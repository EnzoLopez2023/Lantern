import assert from 'node:assert/strict'
import Database from 'better-sqlite3'
import {
  appendFileSync,
  existsSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  renameSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { basename, join } from 'node:path'
import test from 'node:test'
import {
  createOnlineBackup as createOnlineBackupOperation,
  verifyDatabase,
  verifyDisposableRestore as verifyDisposableRestoreOperation,
} from '../../scripts/recovery.mjs'
import {
  cleanupPrivateStage,
  createPrivateStage,
  fsyncFile,
  publishNoReplace,
  supportsDescriptorRelativeChildOperations,
  unlinkIfSame,
} from '../../scripts/secure-files.mjs'
import { workspace } from './helpers.js'

function testRecoveryOptions(options) {
  return {
    ...options,
    env: { ...options?.env, NODE_ENV: 'test' },
    allowTestOnlyPathFallback: true,
  }
}

function createOnlineBackup(options) {
  return createOnlineBackupOperation(testRecoveryOptions(options))
}

function verifyDisposableRestore(options) {
  return verifyDisposableRestoreOperation(testRecoveryOptions(options))
}

const nativeDescriptorOperations = supportsDescriptorRelativeChildOperations()

test('secure recovery writes require descriptor-relative Linux child operations', async () => {
  if (process.platform === 'linux') {
    assert.equal(
      nativeDescriptorOperations,
      true,
      'Linux CI must provide usable /proc/self/fd child paths',
    )
  }
  if (nativeDescriptorOperations) return

  const root = workspace()
  const source = join(root, 'source.db')
  const defaultParent = join(root, 'default-rejected')
  const fallbackParent = join(root, 'non-test-rejected')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()

  await assert.rejects(
    createOnlineBackupOperation({
      database: source,
      output: join(defaultParent, 'backup.db'),
    }),
    /requires Linux \/proc\/self\/fd/,
  )
  assert.equal(existsSync(defaultParent), false)

  await assert.rejects(
    createOnlineBackupOperation({
      database: source,
      output: join(fallbackParent, 'backup.db'),
      env: { NODE_ENV: 'production' },
      allowTestOnlyPathFallback: true,
    }),
    /pathname fallback is test-only/,
  )
  assert.equal(existsSync(fallbackParent), false)

  const portableBackup = join(root, 'portable.db')
  await createOnlineBackup({ database: source, output: portableBackup })
  const restoreParent = join(root, 'restore-default-rejected')
  await assert.rejects(
    verifyDisposableRestoreOperation({
      backup: portableBackup,
      destination: join(restoreParent, 'restore.db'),
    }),
    /requires Linux \/proc\/self\/fd/,
  )
  assert.equal(existsSync(restoreParent), false)

  const restoreFallbackParent = join(root, 'restore-non-test-rejected')
  await assert.rejects(
    verifyDisposableRestoreOperation({
      backup: portableBackup,
      destination: join(restoreFallbackParent, 'restore.db'),
      env: { NODE_ENV: 'development' },
      allowTestOnlyPathFallback: true,
    }),
    /pathname fallback is test-only/,
  )
  assert.equal(existsSync(restoreFallbackParent), false)
})

test('recovery uses online SQLite backup and disposable verified restores', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const backup = join(root, 'backup.db')
  const restore = join(root, 'restore.db')
  const backupManifest = `${backup}.manifest.json`
  const restoreManifest = `${restore}.manifest.json`
  const db = new Database(source)
  db.exec(`
    CREATE TABLE sample(
      id INTEGER PRIMARY KEY,
      value TEXT,
      updated_at TEXT NOT NULL
    )
  `)
  db.prepare("INSERT INTO sample(value, updated_at) VALUES ('before', '2026-08-28T12:00:00Z')")
    .run()

  const ownershipDescriptors = []
  const backupReport = await createOnlineBackup({
    database: source,
    output: backup,
    publicationHooks: {
      afterLink: ({ publication }) => {
        ownershipDescriptors.push(publication.ownershipDescriptor)
      },
    },
  })
  assert.equal(backupReport.ok, true)
  assert.equal(ownershipDescriptors.length, 2)
  for (const descriptor of ownershipDescriptors) {
    assert.throws(
      () => fstatSync(descriptor),
      (error) => error.code === 'EBADF',
    )
  }
  assert.equal(existsSync(backupManifest), true)
  assert.equal(backupReport.manifest.format, 'lantern-sqlite-backup/v1')
  assert.equal(backupReport.manifest.database.bytes, statSync(backup).size)
  assert.match(backupReport.manifest.database.sha256, /^[0-9a-f]{64}$/)
  assert.deepEqual(backupReport.manifest.checks, {
    quickCheck: ['ok'],
    integrityCheck: ['ok'],
    foreignKeyCheck: [],
  })
  assert.equal(backupReport.manifest.identity.app.name, 'lantern')
  assert.equal(backupReport.manifest.identity.source.app, 'hearth')
  assert.deepEqual(backupReport.manifest.identity.schemaMigrations.entries, [])
  assert.deepEqual(backupReport.manifest.tables.sample, {
    count: 1,
    recency: { column: 'updated_at', maximum: '2026-08-28T12:00:00Z' },
  })
  db.prepare("INSERT INTO sample(value, updated_at) VALUES ('after', '2026-08-28T12:01:00Z')")
    .run()
  db.close()
  const changedReleaseVerification = await verifyDatabase({
    database: backup,
    env: {
      NODE_ENV: 'production',
      LANTERN_VERSION: '99.0.0',
      BUILD_SHA: 'f'.repeat(40),
      BUILD_ID: 'future-build',
    },
    root: join(root, 'nonexistent-future-release'),
  })
  assert.equal(changedReleaseVerification.ok, true)
  assert.notEqual(
    changedReleaseVerification.manifest.identity.app.version,
    '99.0.0',
  )

  let hookRan = false
  await verifyDisposableRestore({
    backup,
    destination: restore,
    env: { NODE_ENV: 'production', LANTERN_VERSION: '100.0.0' },
    root: join(root, 'another-release'),
    hook: async ({ path, manifestPath, verification }) => {
      const restored = new Database(path, { readonly: true })
      assert.equal(restored.prepare('SELECT COUNT(*) AS count FROM sample').get().count, 1)
      restored.close()
      assert.equal(manifestPath, restoreManifest)
      assert.equal(
        verification.manifest.database.sha256,
        backupReport.manifest.database.sha256,
      )
      hookRan = true
    },
  })
  assert.equal(hookRan, true)
  assert.equal(existsSync(restore), false)
  assert.equal(existsSync(restoreManifest), false)
  assert.equal(existsSync(`${restore}.partial`), false)
  assert.equal(existsSync(`${restoreManifest}.partial`), false)
})

test('backup verification rejects manifest tampering', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const backup = join(root, 'backup.db')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()
  await createOnlineBackup({ database: source, output: backup })

  const path = `${backup}.manifest.json`
  const manifest = JSON.parse(readFileSync(path, 'utf8'))
  manifest.identity.app.name = 'tampered'
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`)
  await assert.rejects(
    verifyDatabase({ database: backup }),
    /manifest digest mismatch/,
  )
})

test('backup verification rejects database byte/hash mismatch', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const backup = join(root, 'backup.db')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()
  await createOnlineBackup({ database: source, output: backup })

  appendFileSync(backup, Buffer.from([0]))
  await assert.rejects(
    verifyDatabase({ database: backup }),
    /manifest database .*does not match/,
  )
})

test('backup securely creates absent private parent chains', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const nestedRoot = join(root, 'backups')
  const nestedYear = join(nestedRoot, '2026')
  const nestedDay = join(nestedYear, '08-28')
  const backup = join(nestedDay, 'lantern.sqlite3')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()

  const result = await createOnlineBackup({ database: source, output: backup })
  assert.equal(result.ok, true)
  for (const directory of [nestedRoot, nestedYear, nestedDay]) {
    const stat = lstatSync(directory)
    assert.equal(stat.isDirectory(), true)
    assert.equal(stat.mode & 0o777, 0o700)
  }
})

test('backup parent creation rejects symlink traversal and parent replacement races', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()

  const realDirectory = join(root, 'real')
  mkdirSync(realDirectory, { mode: 0o700 })
  const symlinkDirectory = join(root, 'linked')
  symlinkSync(realDirectory, symlinkDirectory)
  await assert.rejects(
    createOnlineBackup({
      database: source,
      output: join(symlinkDirectory, 'nested', 'lantern.sqlite3'),
    }),
    /Unsafe non-directory or symlink path segment/,
  )

  const racedBackup = join(root, 'raced', 'nested', 'lantern.sqlite3')
  const racedOperation = createOnlineBackup({
    database: source,
    output: racedBackup,
    afterParentReady: async ({ path }) => {
      renameSync(path, `${path}-original`)
      mkdirSync(path, { mode: 0o700 })
    },
  })
  if (nativeDescriptorOperations) {
    await racedOperation
    assert.equal(existsSync(join(root, 'raced', 'nested-original', 'lantern.sqlite3')), true)
  } else {
    await assert.rejects(racedOperation, /Staging parent changed/)
  }
  assert.equal(existsSync(racedBackup), false)
})

test('backup rejects parent replacement after staging before SQLite backup', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const parent = join(root, 'secured')
  const displacedParent = join(root, 'secured-owned')
  const output = join(parent, 'lantern.sqlite3')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()
  let attackerStage

  const operation = createOnlineBackup({
    database: source,
    output,
    beforeBackup: async ({ stagePath }) => {
      renameSync(parent, displacedParent)
      mkdirSync(parent, { mode: 0o700 })
      attackerStage = join(parent, basename(stagePath))
      mkdirSync(attackerStage, { mode: 0o700 })
    },
  })
  if (nativeDescriptorOperations) {
    await operation
    assert.equal(existsSync(join(displacedParent, 'lantern.sqlite3')), true)
  } else {
    await assert.rejects(operation, /Staging parent changed|Private stage changed/)
  }

  assert.deepEqual(readdirSync(attackerStage), [])
  assert.equal(existsSync(output), false)
  assert.equal(existsSync(`${output}.manifest.json`), false)
})

test('backup rejects stage replacement before manifest creation', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const output = join(root, 'lantern.sqlite3')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()
  let attackerStage

  const operation = createOnlineBackup({
    database: source,
    output,
    beforeManifestWrite: async ({ stagePath }) => {
      renameSync(stagePath, `${stagePath}-owned`)
      mkdirSync(stagePath, { mode: 0o700 })
      attackerStage = stagePath
      writeFileSync(join(attackerStage, 'sentinel'), 'attacker')
    },
  })
  if (nativeDescriptorOperations) {
    await operation
  } else {
    await assert.rejects(operation, /Private stage changed/)
  }

  assert.deepEqual(readdirSync(attackerStage), ['sentinel'])
  assert.equal(readFileSync(join(attackerStage, 'sentinel'), 'utf8'), 'attacker')
  assert.equal(existsSync(output), nativeDescriptorOperations)
  assert.equal(existsSync(`${output}.manifest.json`), nativeDescriptorOperations)
})

test('backup rejects parent replacement immediately before publication', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const parent = join(root, 'secured')
  const displacedParent = join(root, 'secured-owned')
  const output = join(parent, 'lantern.sqlite3')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()
  let attackerStage

  const operation = createOnlineBackup({
    database: source,
    output,
    beforePublish: async ({ stagePath }) => {
      renameSync(parent, displacedParent)
      mkdirSync(parent, { mode: 0o700 })
      attackerStage = join(parent, basename(stagePath))
      mkdirSync(attackerStage, { mode: 0o700 })
    },
  })
  if (nativeDescriptorOperations) {
    await operation
    assert.equal(existsSync(join(displacedParent, 'lantern.sqlite3')), true)
  } else {
    await assert.rejects(operation, /Staging parent changed|Private stage changed/)
  }

  assert.deepEqual(readdirSync(attackerStage), [])
  assert.equal(existsSync(output), false)
  assert.equal(existsSync(`${output}.manifest.json`), false)
})

test('backup bundles verify and restore after portable rename or move', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const original = join(root, 'lantern.sqlite3')
  const movedDirectory = join(root, 'transported')
  const moved = join(movedDirectory, 'renamed-backup.sqlite3')
  const restore = join(root, 'restore.db')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY); INSERT INTO sample VALUES (1)')
  db.close()
  await createOnlineBackup({ database: source, output: original })

  mkdirSync(movedDirectory, { mode: 0o700 })
  renameSync(original, moved)
  renameSync(`${original}.manifest.json`, `${moved}.manifest.json`)
  const verification = await verifyDatabase({ database: moved })
  assert.equal(verification.ok, true)
  assert.equal(verification.manifest.database.file, 'lantern.sqlite3')
  assert.equal(
    (await verifyDisposableRestore({ backup: moved, destination: restore })).ok,
    true,
  )
  assert.equal(existsSync(restore), false)
})

test('recovery rejects dangling output aliases without following them', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const backup = join(root, 'dangling-backup.db')
  const restore = join(root, 'dangling-restore.db')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()
  symlinkSync(join(root, 'missing-backup-target'), backup)
  await assert.rejects(
    createOnlineBackup({ database: source, output: backup }),
    /already exists/,
  )
  assert.equal(lstatSync(backup).isSymbolicLink(), true)

  const validBackup = join(root, 'valid-backup.db')
  await createOnlineBackup({ database: source, output: validBackup })
  symlinkSync(join(root, 'missing-restore-target'), restore)
  await assert.rejects(
    verifyDisposableRestore({ backup: validBackup, destination: restore }),
    /already exists/,
  )
  assert.equal(lstatSync(restore).isSymbolicLink(), true)
})

test('recovery no-replace publication preserves racing and replacement files', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const racedBackup = join(root, 'raced-backup.db')
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()

  await assert.rejects(createOnlineBackup({
    database: source,
    output: racedBackup,
    beforePublish: async () => writeFileSync(racedBackup, 'racing-backup-writer'),
  }), /already exists|EEXIST/)
  assert.equal(readFileSync(racedBackup, 'utf8'), 'racing-backup-writer')

  const backup = join(root, 'backup.db')
  const restore = join(root, 'restore.db')
  await createOnlineBackup({ database: source, output: backup })
  await assert.rejects(
    verifyDisposableRestore({
      backup,
      destination: restore,
      hook: async ({ path }) => {
        unlinkSync(path)
        writeFileSync(path, 'replacement-must-survive')
      },
    }),
    /refused to delete a replacement/,
  )
  assert.equal(readFileSync(restore, 'utf8'), 'replacement-must-survive')
  assert.equal(
    readdirSync(root).some((name) =>
      name.startsWith('.lantern-backup-') || name.startsWith('.lantern-restore-')),
    false,
  )
})

test('publication rollback removes exact linked inode and permits retry', async () => {
  for (const phase of ['afterLink', 'afterInodeValidation', 'fsyncParent']) {
    const root = workspace()
    const source = join(root, 'source.db')
    const backup = join(root, `${phase}.db`)
    const db = new Database(source)
    db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
    db.close()
    const failure = new Error(`forced-${phase}`)
    const publicationHooks = phase === 'fsyncParent'
      ? {
          fsyncParent: () => {
            throw failure
          },
        }
      : {
          [phase]: ({ stagedName }) => {
            if (stagedName === 'backup.db') throw failure
          },
        }

    await assert.rejects(
      createOnlineBackup({ database: source, output: backup, publicationHooks }),
      failure,
    )
    assert.equal(existsSync(backup), false)
    assert.equal(existsSync(`${backup}.manifest.json`), false)

    const retried = await createOnlineBackup({ database: source, output: backup })
    assert.equal(retried.ok, true)
    assert.equal(existsSync(backup), true)
    assert.equal(existsSync(`${backup}.manifest.json`), true)
  }
})

test('publication rollback preserves a replacement raced after link', async () => {
  const root = workspace()
  const source = join(root, 'source.db')
  const backup = join(root, 'backup.db')
  const manifest = `${backup}.manifest.json`
  const db = new Database(source)
  db.exec('CREATE TABLE sample(id INTEGER PRIMARY KEY)')
  db.close()

  await assert.rejects(
    createOnlineBackup({
      database: source,
      output: backup,
      publicationHooks: {
        afterLink: ({ stagedName, destination }) => {
          if (stagedName !== 'backup.db') return
          unlinkSync(destination)
          writeFileSync(destination, 'raced-replacement')
          throw new Error('forced-after-link-race')
        },
      },
    }),
    /rollback could not remove its exact inode/,
  )
  assert.equal(readFileSync(backup, 'utf8'), 'raced-replacement')
  assert.equal(existsSync(manifest), false)

  unlinkSync(backup)
  const retried = await createOnlineBackup({ database: source, output: backup })
  assert.equal(retried.ok, true)
  assert.equal(existsSync(manifest), true)
})

test('inode cleanup quarantines an interleaved replacement instead of deleting it', () => {
  const root = workspace()
  const output = join(root, 'published.db')
  const stage = createPrivateStage(output, '.publication-stage-')
  const staged = join(stage.path, 'owned.db')
  writeFileSync(staged, 'owned-publication', { flag: 'wx', mode: 0o600 })
  fsyncFile(staged)
  const publication = publishNoReplace(staged, output)
  const ownershipDescriptor = publication.ownershipDescriptor
  cleanupPrivateStage(stage)

  let failure
  try {
    unlinkIfSame(publication, {
      afterValidation: () => {
        unlinkSync(output)
        writeFileSync(output, 'raced-replacement')
        publication.inode = lstatSync(output)
      },
      afterMove: () => {
        writeFileSync(output, 'second-occupant')
      },
    })
  } catch (error) {
    failure = error
  }
  assert.match(failure?.message, /preserved a raced replacement in quarantine/)
  assert.equal(readFileSync(output, 'utf8'), 'second-occupant')
  assert.equal(readFileSync(failure.quarantinePath, 'utf8'), 'raced-replacement')
  assert.throws(
    () => fstatSync(ownershipDescriptor),
    (error) => error.code === 'EBADF',
  )
})

test('publication cleanup preserves raced symlinks without following them', () => {
  const scenarios = [
    { name: 'dangling', secondOccupant: false },
    { name: 'target', secondOccupant: false },
    { name: 'occupied', secondOccupant: true },
  ]

  for (const scenario of scenarios) {
    const root = workspace()
    const output = join(root, 'published.db')
    const symlinkTarget = scenario.name === 'dangling'
      ? join(root, 'missing-target')
      : join(root, 'target.txt')
    if (scenario.name !== 'dangling') writeFileSync(symlinkTarget, 'target-unchanged')
    const stage = createPrivateStage(output, '.publication-stage-')
    const staged = join(stage.path, 'owned.db')
    writeFileSync(staged, 'owned-publication', { flag: 'wx', mode: 0o600 })
    fsyncFile(staged)
    const publication = publishNoReplace(staged, output)
    const ownershipDescriptor = publication.ownershipDescriptor
    cleanupPrivateStage(stage)

    let failure
    try {
      unlinkIfSame(publication, {
        afterValidation: () => {
          unlinkSync(output)
          symlinkSync(symlinkTarget, output)
        },
        afterMove: () => {
          if (scenario.secondOccupant) writeFileSync(output, 'second-occupant')
        },
      })
    } catch (error) {
      failure = error
    }

    assert.ok(failure, scenario.name)
    assert.match(failure.message, /preserved an unowned non-regular replacement/)
    assert.equal(lstatSync(failure.quarantinePath).isSymbolicLink(), true)
    assert.equal(readlinkSync(failure.quarantinePath), symlinkTarget)
    if (scenario.secondOccupant) {
      assert.equal(readFileSync(output, 'utf8'), 'second-occupant')
    } else {
      assert.equal(existsSync(output), false)
    }
    if (scenario.name === 'dangling') {
      assert.equal(existsSync(symlinkTarget), false)
    } else {
      assert.equal(readFileSync(symlinkTarget, 'utf8'), 'target-unchanged')
    }
    assert.throws(
      () => fstatSync(ownershipDescriptor),
      (error) => error.code === 'EBADF',
    )
  }
})
