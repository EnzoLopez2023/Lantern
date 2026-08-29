import assert from 'node:assert/strict'
import Database from 'better-sqlite3'
import {
  existsSync,
  linkSync,
  readFileSync,
  readdirSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { createRepositories } from '../../lib/repositories.js'
import { KB_PROGRESS_PREFIX } from '../../lib/user-state-keys.js'
import { importLegacy as importLegacyOperation } from '../../scripts/legacy-import.mjs'
import {
  SOURCE_ORACLES,
  SOURCE_PRODUCT_SHA256,
  sha256File,
} from '../../scripts/legacy-lib.mjs'
import { reconcileLegacy as reconcileLegacyOperation } from '../../scripts/reconcile.mjs'
import { supportsDescriptorRelativeChildOperations } from '../../scripts/secure-files.mjs'
import { withApp, workspace } from './helpers.js'

const tenantId = '11111111-1111-1111-1111-111111111111'
const oid = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

function testSecureOptions(options) {
  return {
    ...options,
    env: { ...options?.env, NODE_ENV: 'test' },
    allowTestOnlyPathFallback: true,
  }
}

function importLegacy(options) {
  return importLegacyOperation(testSecureOptions(options))
}

function reconcileLegacy(options) {
  return reconcileLegacyOperation(testSecureOptions(options))
}

test('canonical source oracles match the coordinator artifact', () => {
  assert.deepEqual(SOURCE_ORACLES, {
    exam_attempts: {
      count: 0,
      hash: '6e9ee03c85f73bb2fca73fb301ec58facd47e7ba6d7f7c5be4baec7ef6c1e606',
    },
    exam_question_results: {
      count: 0,
      hash: '8d66544a801347b22884b623c422eb726f73affa492c22a644c193a78caa9ca0',
    },
    kb_tts_progress: {
      count: 3,
      hash: '9687599dccc177ca7fe95d3a70c8f93c0da192805304abcebcf2d098a7d07bda',
    },
  })
  assert.equal(
    SOURCE_PRODUCT_SHA256,
    'b71bee99ff4160f7018b227dda921311aa9a32775c613e5159dcc411eaaab8cb',
  )
})

function createLegacy(path, {
  attempts = 0,
  guideIds = ['guide-1', 'guide-2', 'guide-3'],
} = {}) {
  const db = new Database(path)
  db.pragma('journal_mode = DELETE')
  db.exec(`
    CREATE TABLE exam_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mode TEXT NOT NULL DEFAULT 'full' CHECK(mode IN ('full','practice')),
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      correct_count INTEGER NOT NULL,
      domain1_score INTEGER DEFAULT 0,
      domain1_total INTEGER DEFAULT 0,
      domain2_score INTEGER DEFAULT 0,
      domain2_total INTEGER DEFAULT 0,
      passed INTEGER NOT NULL DEFAULT 0,
      time_spent_sec INTEGER,
      completed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE exam_question_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      selected TEXT NOT NULL,
      correct INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE
    );
    CREATE TABLE kb_tts_progress (
      guide_id TEXT PRIMARY KEY,
      section_index INTEGER NOT NULL DEFAULT 0,
      sentence_index INTEGER NOT NULL DEFAULT 0,
      section_title TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
  for (let index = 1; index <= attempts; index += 1) {
    db.prepare(`
      INSERT INTO exam_attempts(
        id, mode, score, total_questions, correct_count, completed_at
      ) VALUES (?, 'practice', 90, 1, 1, '2026-01-01 00:00:00')
    `).run(index)
    db.prepare(`
      INSERT INTO exam_question_results(
        id, attempt_id, question_id, selected, correct
      ) VALUES (?, ?, ?, '"A"', 1)
    `).run(index, index, `q${index}`)
  }
  for (const [offset, guideId] of guideIds.entries()) {
    const index = offset + 1
    db.prepare(`
      INSERT INTO kb_tts_progress(
        guide_id, section_index, sentence_index, section_title, updated_at
      ) VALUES (?, ?, 0, ?, '2026-01-01 00:00:00')
    `).run(guideId, index, `Guide ${index}`)
  }
  db.close()
}

async function expectation(path) {
  const { size } = await import('node:fs').then(({ statSync }) => statSync(path))
  return { expectedSize: size, expectedSha256: await sha256File(path) }
}

test('import and reconcile writes require secure descriptor-relative operations', async () => {
  const supported = supportsDescriptorRelativeChildOperations()
  if (process.platform === 'linux') {
    assert.equal(supported, true, 'Linux CI must provide usable /proc/self/fd child paths')
  }
  if (supported) return

  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  const target = join(root, 'lantern.db')
  const rejectedTarget = join(root, 'rejected.db')
  const output = join(root, 'reconciliation.json')
  createLegacy(source)
  const sourceExpectation = await expectation(source)
  const base = {
    source,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation,
  }

  await assert.rejects(
    importLegacyOperation({ ...base, target: rejectedTarget }),
    /requires Linux \/proc\/self\/fd/,
  )
  assert.equal(existsSync(rejectedTarget), false)
  await assert.rejects(
    importLegacyOperation({
      ...base,
      target: rejectedTarget,
      env: { NODE_ENV: 'production' },
      allowTestOnlyPathFallback: true,
    }),
    /pathname fallback is test-only/,
  )
  assert.equal(existsSync(rejectedTarget), false)

  await importLegacy({ ...base, target })
  await assert.rejects(
    reconcileLegacyOperation({ ...base, target, output }),
    /requires Linux \/proc\/self\/fd/,
  )
  assert.equal(existsSync(output), false)
  await assert.rejects(
    reconcileLegacyOperation({
      ...base,
      target,
      output,
      env: { NODE_ENV: 'development' },
      allowTestOnlyPathFallback: true,
    }),
    /pathname fallback is test-only/,
  )
  assert.equal(existsSync(output), false)
})

test('legacy import verifies immutable input, preserves IDs, transforms ownership, and is one-shot', async () => {
  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  const target = join(root, 'lantern.db')
  createLegacy(source, { attempts: 1 })
  const sourceExpectation = await expectation(source)
  const report = await importLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation,
  })

  assert.deepEqual(report.counts, {
    exam_attempts: 1,
    exam_question_results: 1,
    kb_tts_progress: 3,
  })
  const targetDb = new Database(target, { readonly: true })
  assert.equal(targetDb.prepare('SELECT id FROM exam_attempts').get().id, 1)
  assert.deepEqual(
    targetDb.prepare('SELECT tenant_id, oid FROM exam_attempt_owners').get(),
    { tenant_id: tenantId, oid },
  )
  assert.equal(
    targetDb.prepare('SELECT COUNT(*) AS count FROM kb_tts_progress WHERE oid = ?').get(oid).count,
    3,
  )
  assert.deepEqual(
    targetDb.prepare(`
      SELECT COUNT(*) AS count, COUNT(DISTINCT change_sequence) AS sequences
      FROM user_state_changes
      WHERE tenant_id = ? AND oid = ?
    `).get(tenantId, oid),
    { count: 3, sequences: 3 },
  )
  assert.equal(
    targetDb.prepare(`
      SELECT COUNT(*) AS count FROM user_state
      WHERE tenant_id = ? AND oid = ? AND resource_type = 'progress'
        AND resource_key LIKE 'kb-tts-progress:%' AND revision = 1 AND tombstone = 0
    `).get(tenantId, oid).count,
    3,
  )
  targetDb.close()
  await assert.rejects(importLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation,
  }), /already exists/)
})

test('imported KB progress uses queued string encoding and tombstones without resurrection', async () => {
  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  const target = join(root, 'lantern.db')
  createLegacy(source)
  await importLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation: await expectation(source),
  })
  const expectedTimestamp = Date.parse('2026-01-01T00:00:00Z')

  await withApp(async ({ db, request }) => {
    const repositories = createRepositories(db)
    const page = await repositories.listState(
      { tenantId, oid },
      { limit: 500 },
    )
    const imported = page.resources.filter(({ resourceKey }) =>
      resourceKey.startsWith('kb-tts-progress:'))
    assert.equal(imported.length, 3)
    for (let index = 1; index <= 3; index += 1) {
      const state = imported.find(({ resourceKey }) =>
        resourceKey === `kb-tts-progress:guide-${index}`)
      assert.equal(typeof state.value, 'string')
      assert.deepEqual(JSON.parse(state.value), {
        sectionIndex: index,
        sentenceIndex: 0,
        title: `Guide ${index}`,
        timestamp: expectedTimestamp,
      })
    }

    const apiPage = await (await request('/api/user-state?limit=500')).json()
    const apiImported = apiPage.resources.filter(({ resourceKey }) =>
      resourceKey.startsWith('kb-tts-progress:'))
    assert.equal(apiImported.length, 3)
    assert.equal(apiImported.every(({ value }) => typeof value === 'string'), true)
    assert.deepEqual(
      await (await request('/api/kb/progress/guide-2')).json(),
      {
        sectionIndex: 2,
        sentenceIndex: 0,
        title: 'Guide 2',
        timestamp: expectedTimestamp,
      },
    )
    assert.equal(
      (await request('/api/kb/progress/guide-2', { method: 'DELETE' })).status,
      200,
    )
    assert.equal(await (await request('/api/kb/progress/guide-2')).json(), null)
    const tombstone = await (
      await request('/api/user-state/progress/kb-tts-progress:guide-2')
    ).json()
    assert.equal(tombstone.tombstone, true)
    assert.equal(tombstone.value, null)
    assert.equal(
      db.prepare(`
        SELECT COUNT(*) AS count FROM kb_tts_progress WHERE guide_id = 'guide-2'
      `).get().count,
      1,
    )
  }, { databasePath: target })
})

test('legacy import rejects KB guide IDs that cannot form valid user-state keys', async () => {
  const root = workspace()
  const invalidGuideIds = [
    'bad guide',
    'g'.repeat(200 - KB_PROGRESS_PREFIX.length + 1),
  ]
  for (const [index, invalidGuideId] of invalidGuideIds.entries()) {
    const source = join(root, `invalid-${index}.sqlite3`)
    const target = join(root, `invalid-${index}.db`)
    createLegacy(source, {
      guideIds: ['guide-1', invalidGuideId, 'guide-3'],
    })
    const sourceHash = await sha256File(source)
    await assert.rejects(importLegacy({
      source,
      target,
      ownerTenant: tenantId,
      ownerOid: oid,
      sourceExpectation: await expectation(source),
    }), /guideId must use the user-state key charset/)
    assert.equal(existsSync(target), false)
    assert.equal(await sha256File(source), sourceHash)
  }
})

test('reconcile persists counts, keys, canonical rows/tables/product, FKs, and sequences', async () => {
  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  const target = join(root, 'lantern.db')
  const output = join(root, 'reconciliation.json')
  createLegacy(source)
  const sourceExpectation = await expectation(source)
  await importLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation,
  })
  const targetHashBefore = await sha256File(target)
  const report = await reconcileLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    output,
    sourceExpectation,
  })
  assert.equal(report.ok, true)
  assert.equal(report.tables.kb_tts_progress.sourceCount, 3)
  assert.equal(report.tables.kb_tts_progress.rowsMatch, true)
  assert.deepEqual(
    {
      totalTargetCount: report.kbProgress.legacyTable.totalTargetCount,
      mappedTargetCount: report.kbProgress.legacyTable.mappedTargetCount,
      wrongOwnerCount: report.kbProgress.legacyTable.wrongOwnerCount,
      match: report.kbProgress.legacyTable.match,
    },
    { totalTargetCount: 3, mappedTargetCount: 3, wrongOwnerCount: 0, match: true },
  )
  assert.equal(report.kbProgress.userState.match, true)
  assert.equal(report.kbProgress.userStateChanges.match, true)
  assert.equal(report.kbProgress.userState.expectedRowHash.length, 64)
  assert.equal(report.kbProgress.userStateChanges.targetRowHash.length, 64)
  assert.equal(
    report.canonicalProduct.targetHash,
    'b71bee99ff4160f7018b227dda921311aa9a32775c613e5159dcc411eaaab8cb',
  )
  assert.equal(report.foreignKeys.ok, true)
  assert.equal(existsSync(output), true)
  assert.equal(await sha256File(target), targetHashBefore)
})

test('reconcile rejects every application-facing KB progress divergence', async () => {
  const cases = [
    {
      name: 'deleted-state',
      evidence: 'userState',
      mutate(db) {
        db.prepare(`
          DELETE FROM user_state
          WHERE resource_key = 'kb-tts-progress:guide-1'
        `).run()
      },
    },
    {
      name: 'deleted-history',
      evidence: 'userStateChanges',
      mutate(db) {
        db.prepare(`
          DELETE FROM user_state_changes
          WHERE resource_key = 'kb-tts-progress:guide-1'
        `).run()
      },
    },
    {
      name: 'misowned-legacy-progress',
      evidence: 'legacyTable',
      mutate(db) {
        db.prepare(`
          INSERT INTO kb_tts_progress(
            tenant_id, oid, guide_id, section_index, sentence_index, section_title
          ) VALUES (?, ?, 'attacker-guide', 0, 0, 'extra')
        `).run('22222222-2222-2222-2222-222222222222', oid)
      },
    },
    {
      name: 'misowned-extra-state',
      evidence: 'userState',
      mutate(db) {
        db.prepare(`
          INSERT INTO user_state(
            tenant_id, oid, resource_type, resource_key, revision,
            value_json, tombstone, mutation_id, updated_at, change_sequence
          ) VALUES (?, ?, 'progress', 'kb-tts-progress:attacker', 1,
                    '"extra"', 0, 'extra-state', '2026-01-01 00:00:00', 9001)
        `).run('22222222-2222-2222-2222-222222222222', oid)
      },
    },
    {
      name: 'misowned-extra-history',
      evidence: 'userStateChanges',
      mutate(db) {
        db.prepare(`
          INSERT INTO user_state_changes(
            tenant_id, oid, resource_type, resource_key, revision,
            value_json, tombstone, mutation_id, updated_at
          ) VALUES (?, ?, 'progress', 'kb-tts-progress:attacker', 1,
                    '"extra"', 0, 'extra-history', '2026-01-01 00:00:00')
        `).run(tenantId, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
      },
    },
    {
      name: 'state-encoding-revision-tombstone-sequence-mismatch',
      evidence: 'userState',
      mutate(db) {
        db.prepare(`
          UPDATE user_state
          SET value_json = '{"not":"a queued string"}',
              revision = 2,
              tombstone = 1,
              change_sequence = 9002
          WHERE resource_key = 'kb-tts-progress:guide-2'
        `).run()
      },
    },
    {
      name: 'history-sequence-mismatch',
      evidence: 'userStateChanges',
      mutate(db) {
        db.prepare(`
          UPDATE user_state_changes
          SET change_sequence = 9003, value_json = '"wrong"', revision = 2
          WHERE resource_key = 'kb-tts-progress:guide-3'
        `).run()
      },
    },
  ]

  for (const scenario of cases) {
    const root = workspace()
    const source = join(root, 'legacy.sqlite3')
    const target = join(root, 'lantern.db')
    const output = join(root, 'reconciliation.json')
    createLegacy(source)
    const sourceExpectation = await expectation(source)
    await importLegacy({
      source,
      target,
      ownerTenant: tenantId,
      ownerOid: oid,
      sourceExpectation,
    })
    const targetDb = new Database(target)
    scenario.mutate(targetDb)
    targetDb.close()

    let failure
    try {
      await reconcileLegacy({
        source,
        target,
        ownerTenant: tenantId,
        ownerOid: oid,
        output,
        sourceExpectation,
      })
    } catch (error) {
      failure = error
    }
    assert.equal(failure?.report?.ok, false, scenario.name)
    assert.equal(failure.report.kbProgress[scenario.evidence].match, false, scenario.name)
    assert.equal(existsSync(output), true, scenario.name)
  }
})

test('import and reconcile reject source aliases before writable target open', async () => {
  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  createLegacy(source)
  const sourceExpectation = await expectation(source)
  const originalHash = await sha256File(source)
  const aliases = [
    join(root, 'source-symlink.sqlite3'),
    join(root, 'source-hardlink.sqlite3'),
  ]
  symlinkSync(source, aliases[0])
  linkSync(source, aliases[1])

  for (const [index, target] of aliases.entries()) {
    await assert.rejects(importLegacy({
      source,
      target,
      ownerTenant: tenantId,
      ownerOid: oid,
      sourceExpectation,
    }), /already exists|same database file/)
    await assert.rejects(reconcileLegacy({
      source,
      target,
      ownerTenant: tenantId,
      ownerOid: oid,
      output: join(root, `alias-${index}-reconciliation.json`),
      sourceExpectation,
    }), /non-symlink|same database file/)
  }
  assert.equal(await sha256File(source), originalHash)
})

test('import rejects existing unrelated targets without migration or mutation', async () => {
  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  const target = join(root, 'unrelated.db')
  createLegacy(source)
  const unrelated = new Database(target)
  unrelated.exec("CREATE TABLE marker(value TEXT); INSERT INTO marker VALUES ('unchanged')")
  unrelated.close()
  const before = await sha256File(target)

  await assert.rejects(importLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation: await expectation(source),
  }), /already exists/)
  assert.equal(await sha256File(target), before)
  const check = new Database(target, { readonly: true })
  assert.equal(check.prepare('SELECT value FROM marker').get().value, 'unchanged')
  assert.equal(
    check.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE name='schema_migrations'")
      .get().count,
    0,
  )
  check.close()
})

test('import no-replace publication preserves a target created during staging', async () => {
  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  const target = join(root, 'raced.db')
  createLegacy(source)
  await assert.rejects(importLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation: await expectation(source),
    beforePublish: async () => writeFileSync(target, 'racing-writer'),
  }), /already exists|EEXIST/)
  assert.equal(readFileSync(target, 'utf8'), 'racing-writer')
  assert.equal(
    readdirSync(root).some((name) => name.startsWith('.lantern-import-')),
    false,
  )
})

test('reconcile report publication never replaces raced or dangling outputs', async () => {
  const root = workspace()
  const source = join(root, 'legacy.sqlite3')
  const target = join(root, 'lantern.db')
  const output = join(root, 'reconciliation.json')
  createLegacy(source)
  const sourceExpectation = await expectation(source)
  await importLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    sourceExpectation,
  })

  await assert.rejects(reconcileLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    output,
    sourceExpectation,
    beforePublish: async () => writeFileSync(output, 'competing-report'),
  }), /already exists|EEXIST/)
  assert.equal(readFileSync(output, 'utf8'), 'competing-report')

  const dangling = join(root, 'dangling-report.json')
  symlinkSync(join(root, 'missing-report'), dangling)
  await assert.rejects(reconcileLegacy({
    source,
    target,
    ownerTenant: tenantId,
    ownerOid: oid,
    output: dangling,
    sourceExpectation,
  }), /already exists/)
})
