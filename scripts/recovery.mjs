import Database from 'better-sqlite3'
import { createHash } from 'node:crypto'
import {
  closeSync,
  constants,
  existsSync,
  fsyncSync,
  openSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs, sha256File } from './legacy-lib.mjs'
import {
  assertPathAbsent,
  assertPrivateStage,
  cleanupPrivateStage,
  closeDirectoryIdentity,
  createPrivateStage,
  ensureSecureDirectoryChain,
  fsyncPrivateStageFile,
  privateStageChild,
  publishPrivateStageNoReplace,
  requireSecureRecoveryFilesystem,
  unlinkIfSame,
} from './secure-files.mjs'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const MANIFEST_FORMAT = 'lantern-sqlite-backup/v1'
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024
const RECENCY_COLUMNS = [
  'updated_at',
  'occurred_at',
  'last_seen_at',
  'completed_at',
  'imported_at',
  'reconciled_at',
  'granted_at',
  'applied_at',
  'created_at',
  'timestamp',
]

function requirePath(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required`)
  return resolve(value)
}

function ensureDifferent(source, destination) {
  if (source === destination) throw new Error('Source and destination must differ')
}

function quoteIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) =>
      `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function digest(value) {
  return createHash('sha256').update(stableJson(value)).digest('hex')
}

function manifestPath(database) {
  return `${database}.manifest.json`
}

async function withStageOperation(stage, operation) {
  assertPrivateStage(stage)
  try {
    return await operation()
  } finally {
    assertPrivateStage(stage)
  }
}

async function writeStageJson(stage, name, value) {
  await withStageOperation(stage, async () => {
    const path = privateStageChild(stage, name)
    let descriptor
    try {
      descriptor = openSync(
        path,
        constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL |
          (constants.O_NOFOLLOW ?? 0),
        0o600,
      )
      assertPrivateStage(stage)
      writeFileSync(descriptor, `${JSON.stringify(value, null, 2)}\n`)
      fsyncSync(descriptor)
    } finally {
      if (descriptor !== undefined) closeSync(descriptor)
    }
  })
}

async function fsyncStageFile(stage, name) {
  await withStageOperation(stage, async () => {
    fsyncPrivateStageFile(stage, name)
  })
}

async function collectStageEvidence(stage, name, options) {
  return withStageOperation(stage, async () =>
    collectEvidence(privateStageChild(stage, name), options))
}

async function backupIntoStage(db, stage, name) {
  await withStageOperation(stage, async () => {
    await db.backup(privateStageChild(stage, name))
  })
}

function publishStageFile(stage, name, destination, hooks) {
  assertPrivateStage(stage)
  try {
    return publishPrivateStageNoReplace(stage, name, destination, hooks)
  } finally {
    assertPrivateStage(stage)
  }
}

function releaseIdentity(root, env) {
  const release = JSON.parse(readFileSync(join(root, 'version.json'), 'utf8'))
  if (release.app !== 'lantern' || typeof release.version !== 'string' || !release.source) {
    throw new Error('version.json does not contain Lantern source identity')
  }
  return {
    app: {
      name: release.app,
      version: env.LANTERN_VERSION || env.npm_package_version || release.version,
    },
    source: release.source,
    build: {
      commit: env.BUILD_SHA || 'local-development',
      buildId: env.BUILD_ID || 'local-development',
      environment: env.NODE_ENV || 'development',
    },
  }
}

function hasTable(db, name) {
  return Boolean(db.prepare(`
    SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?
  `).get(name))
}

function schemaMigrationIdentity(db) {
  const entries = hasTable(db, 'schema_migrations')
    ? db.prepare(`
        SELECT name, applied_at AS appliedAt FROM schema_migrations ORDER BY name
      `).all()
    : []
  return { entries, sha256: digest(entries) }
}

function importedSourceIdentity(db) {
  if (!hasTable(db, 'legacy_imports')) return []
  return db.prepare(`
    SELECT id, imported_at AS importedAt, source_sha256 AS sourceSha256,
           source_size AS sourceSize, owner_tenant_id AS ownerTenantId,
           owner_oid AS ownerOid, counts_json AS countsJson
    FROM legacy_imports ORDER BY id
  `).all().map(({ countsJson, ...row }) => ({
    ...row,
    counts: JSON.parse(countsJson),
  }))
}

function tableEvidence(db) {
  const tables = db.prepare(`
    SELECT name FROM sqlite_master
    WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all().map(({ name }) => name)
  return Object.fromEntries(tables.map((table) => {
    const columns = new Set(
      db.prepare(`PRAGMA table_info(${quoteIdentifier(table)})`).all().map(({ name }) => name),
    )
    const recencyColumn = RECENCY_COLUMNS.find((column) => columns.has(column))
    const count = db.prepare(`
      SELECT COUNT(*) AS count FROM ${quoteIdentifier(table)}
    `).get().count
    const recency = recencyColumn
      ? {
          column: recencyColumn,
          maximum: db.prepare(`
            SELECT MAX(${quoteIdentifier(recencyColumn)}) AS maximum
            FROM ${quoteIdentifier(table)}
          `).get().maximum,
        }
      : null
    return [table, { count, recency }]
  }))
}

function checks(db) {
  return {
    quickCheck: db.pragma('quick_check').map((row) => Object.values(row)[0]),
    integrityCheck: db.pragma('integrity_check').map((row) => Object.values(row)[0]),
    foreignKeyCheck: db.pragma('foreign_key_check'),
  }
}

function checksAreHealthy(result) {
  return result.quickCheck.length === 1 &&
    result.quickCheck[0] === 'ok' &&
    result.integrityCheck.length === 1 &&
    result.integrityCheck[0] === 'ok' &&
    result.foreignKeyCheck.length === 0
}

async function fileEvidence(path) {
  const stat = statSync(path)
  return { bytes: stat.size, sha256: await sha256File(path) }
}

async function collectEvidence(path, {
  recordedFile = basename(path),
} = {}) {
  const before = await fileEvidence(path)
  const db = new Database(path, { readonly: true, fileMustExist: true })
  let databaseEvidence
  try {
    db.pragma('query_only = ON')
    db.pragma('busy_timeout = 5000')
    databaseEvidence = {
      identity: {
        schemaMigrations: schemaMigrationIdentity(db),
        importedSources: importedSourceIdentity(db),
      },
      tables: tableEvidence(db),
      checks: checks(db),
    }
  } finally {
    db.close()
  }
  const after = await fileEvidence(path)
  if (before.bytes !== after.bytes || before.sha256 !== after.sha256) {
    throw new Error('Database changed while backup evidence was collected')
  }
  if (!checksAreHealthy(databaseEvidence.checks)) {
    const error = new Error('SQLite backup verification failed')
    error.evidence = databaseEvidence
    throw error
  }
  return {
    database: { file: recordedFile, ...after },
    ...databaseEvidence,
  }
}

function withManifestDigest(payload) {
  return { ...payload, manifestSha256: digest(payload) }
}

function readManifest(path) {
  const stat = statSync(path)
  if (!stat.isFile() || stat.size > MAX_MANIFEST_BYTES) {
    throw new Error('Backup manifest is missing, invalid, or too large')
  }
  const manifest = JSON.parse(readFileSync(path, 'utf8'))
  const { manifestSha256, ...payload } = manifest
  if (typeof manifestSha256 !== 'string' || digest(payload) !== manifestSha256) {
    throw new Error('Backup manifest digest mismatch')
  }
  if (manifest.format !== MANIFEST_FORMAT) throw new Error('Unsupported backup manifest format')
  return manifest
}

function assertSameEvidence(actual, manifest) {
  for (const field of ['tables', 'checks']) {
    if (stableJson(actual[field]) !== stableJson(manifest[field])) {
      throw new Error(`Backup manifest ${field} does not match database evidence`)
    }
  }
  for (const field of ['bytes', 'sha256']) {
    if (actual.database[field] !== manifest.database?.[field]) {
      throw new Error(`Backup manifest database ${field} does not match database evidence`)
    }
  }
  for (const field of ['schemaMigrations', 'importedSources']) {
    if (stableJson(actual.identity[field]) !== stableJson(manifest.identity?.[field])) {
      throw new Error(`Backup manifest ${field} does not match database evidence`)
    }
  }
}

export async function createOnlineBackup({
  database,
  output,
  env = process.env,
  root = ROOT,
  afterParentReady = async () => {},
  afterStageCreated = async () => {},
  beforeBackup = async () => {},
  beforeManifestWrite = async () => {},
  beforePublish = async () => {},
  allowTestOnlyPathFallback = false,
  publicationHooks,
} = {}) {
  const recoveryFilesystem = requireSecureRecoveryFilesystem({
    allowTestOnlyPathFallback,
    nodeEnv: env.NODE_ENV,
  })
  const source = requirePath(database, 'database')
  const destination = assertPathAbsent(requirePath(output, 'output'), 'Backup output')
  const destinationManifest = manifestPath(destination)
  assertPathAbsent(destinationManifest, 'Backup manifest')
  ensureDifferent(source, destination)
  if (!existsSync(source)) throw new Error(`Database does not exist: ${source}`)
  const parentIdentity = ensureSecureDirectoryChain(dirname(destination))
  let stage
  let databasePublication
  let manifestPublication
  let db
  try {
    await afterParentReady(parentIdentity)
    stage = createPrivateStage(destination, '.lantern-backup-', {
      parentIdentity,
      recoveryFilesystem,
    })
    const hookContext = {
      destination,
      manifestPath: destinationManifest,
      parentPath: parentIdentity.path,
      stagePath: stage.path,
    }
    await afterStageCreated(hookContext)
    await beforeBackup(hookContext)
    db = new Database(source, { readonly: true, fileMustExist: true })
    await backupIntoStage(db, stage, 'backup.db')
    db.close()
    await fsyncStageFile(stage, 'backup.db')
    const evidence = await collectStageEvidence(stage, 'backup.db', {
      recordedFile: basename(destination),
    })
    const payload = {
      format: MANIFEST_FORMAT,
      createdAt: new Date().toISOString(),
      ...evidence,
      identity: {
        ...releaseIdentity(root, env),
        ...evidence.identity,
      },
    }
    const manifest = withManifestDigest(payload)
    await beforeManifestWrite(hookContext)
    await writeStageJson(stage, 'backup.manifest.json', manifest)
    await beforePublish(hookContext)
    databasePublication = publishStageFile(
      stage,
      'backup.db',
      destination,
      publicationHooks,
    )
    manifestPublication = publishStageFile(
      stage,
      'backup.manifest.json',
      destinationManifest,
      publicationHooks,
    )
    return {
      ok: true,
      path: destination,
      manifestPath: destinationManifest,
      manifest,
    }
  } finally {
    if (db?.open) db.close()
    let cleanupError
    if (!manifestPublication && databasePublication) {
      try {
        unlinkIfSame(databasePublication, {
          parentIdentity,
          recoveryFilesystem,
        })
      } catch (error) {
        cleanupError = error
      }
    }
    if (stage) {
      try {
        cleanupPrivateStage(stage)
      } catch (error) {
        cleanupError ??= error
      }
    } else {
      closeDirectoryIdentity(parentIdentity)
    }
    if (cleanupError) throw cleanupError
  }
}

export async function verifyDatabase({
  database,
  manifest = database ? manifestPath(resolve(database)) : undefined,
} = {}) {
  const path = requirePath(database, 'database')
  const manifestFile = requirePath(manifest, 'manifest')
  const recorded = readManifest(manifestFile)
  const actual = await collectEvidence(path, {
    recordedFile: basename(path),
  })
  assertSameEvidence(actual, recorded)
  return { ok: true, path, manifestPath: manifestFile, manifest: recorded }
}

export async function verifyDisposableRestore({
  backup,
  destination,
  manifest = backup ? manifestPath(resolve(backup)) : undefined,
  beforePublish = async () => {},
  afterStageCreated = async () => {},
  beforeBackup = async () => {},
  beforeManifestWrite = async () => {},
  hook = async () => {},
  env = process.env,
  allowTestOnlyPathFallback = false,
  publicationHooks,
} = {}) {
  const recoveryFilesystem = requireSecureRecoveryFilesystem({
    allowTestOnlyPathFallback,
    nodeEnv: env.NODE_ENV,
  })
  const source = requirePath(backup, 'backup')
  const restored = assertPathAbsent(requirePath(destination, 'destination'), 'Disposable restore')
  const restoredManifest = manifestPath(restored)
  assertPathAbsent(restoredManifest, 'Disposable restore manifest')
  ensureDifferent(source, restored)
  const sourceVerification = await verifyDatabase({
    database: source,
    manifest,
  })
  const parentIdentity = ensureSecureDirectoryChain(dirname(restored), {
    createMissing: false,
  })
  const stage = createPrivateStage(restored, '.lantern-restore-', {
    parentIdentity,
    recoveryFilesystem,
  })
  let databasePublication
  let manifestPublication
  const sourceDb = new Database(source, { readonly: true, fileMustExist: true })
  try {
    const hookContext = {
      destination: restored,
      manifestPath: restoredManifest,
      parentPath: stage.parent.path,
      stagePath: stage.path,
    }
    await afterStageCreated(hookContext)
    await beforeBackup(hookContext)
    await backupIntoStage(sourceDb, stage, 'restore.db')
    sourceDb.close()
    await fsyncStageFile(stage, 'restore.db')
    const evidence = await collectStageEvidence(stage, 'restore.db', {
      recordedFile: basename(restored),
    })
    if (evidence.database.bytes !== sourceVerification.manifest.database.bytes ||
        evidence.database.sha256 !== sourceVerification.manifest.database.sha256) {
      throw new Error('Disposable restore bytes do not match backup manifest')
    }
    const payload = {
      ...sourceVerification.manifest,
      database: evidence.database,
      restoredFrom: {
        file: basename(source),
        manifestSha256: sourceVerification.manifest.manifestSha256,
      },
    }
    delete payload.manifestSha256
    const restoredManifestValue = withManifestDigest(payload)
    await beforeManifestWrite(hookContext)
    await writeStageJson(stage, 'restore.manifest.json', restoredManifestValue)
    if (stableJson(evidence.identity.schemaMigrations) !==
          stableJson(sourceVerification.manifest.identity.schemaMigrations) ||
        stableJson(evidence.identity.importedSources) !==
          stableJson(sourceVerification.manifest.identity.importedSources) ||
        stableJson(evidence.tables) !== stableJson(sourceVerification.manifest.tables) ||
        stableJson(evidence.checks) !== stableJson(sourceVerification.manifest.checks)) {
      throw new Error('Disposable restore does not match backup manifest evidence')
    }
    await beforePublish(hookContext)
    databasePublication = publishStageFile(
      stage,
      'restore.db',
      restored,
      publicationHooks,
    )
    manifestPublication = publishStageFile(
      stage,
      'restore.manifest.json',
      restoredManifest,
      publicationHooks,
    )
    const verification = {
      ok: true,
      path: restored,
      manifestPath: restoredManifest,
      manifest: restoredManifestValue,
    }
    await hook({ path: restored, manifestPath: restoredManifest, verification })
    return verification
  } finally {
    if (sourceDb.open) sourceDb.close()
    let cleanupError
    for (const publication of [manifestPublication, databasePublication]) {
      if (!publication) continue
      try {
        unlinkIfSame(publication, {
          parentIdentity: stage.parent,
          recoveryFilesystem,
        })
      } catch (error) {
        cleanupError ??= error
      }
    }
    try {
      cleanupPrivateStage(stage)
    } catch (error) {
      cleanupError ??= error
    }
    if (cleanupError) throw cleanupError
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)
  let report
  if (command === 'backup') {
    report = await createOnlineBackup({ database: args.database, output: args.output })
  } else if (command === 'verify') {
    report = await verifyDatabase({ database: args.database, manifest: args.manifest })
  } else if (command === 'restore-verify') {
    if (args.disposable !== true) {
      throw new Error('restore-verify requires the explicit --disposable flag')
    }
    report = await verifyDisposableRestore({
      backup: args.backup,
      manifest: args.manifest,
      destination: args.destination,
    })
  } else {
    throw new Error(
      'Usage: recovery.mjs backup --database DB --output FILE | ' +
      'verify --database FILE [--manifest FILE] | restore-verify --backup FILE ' +
      '[--manifest FILE] --destination FILE --disposable',
    )
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Recovery command failed: ${error.message}`)
    process.exitCode = 1
  })
}
