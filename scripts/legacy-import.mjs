import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { openDatabase } from '../lib/database.js'
import { kbProgressResourceKey } from '../lib/user-state-keys.js'
import {
  LEGACY_SOURCE_SHA256,
  LEGACY_SOURCE_SIZE,
  SOURCE_ORACLES,
  assertSourceSchema,
  openImmutableSource,
  parseArgs,
  readSequences,
  requireGuid,
  legacySavedPosition,
} from './legacy-lib.mjs'
import {
  assertPathAbsent,
  cleanupPrivateStage,
  closePublicationOwnership,
  createPrivateStage,
  ensureSecureDirectoryChain,
  fsyncPrivateStageFile,
  privateStageChild,
  publishPrivateStageNoReplace,
  requireSecureRecoveryFilesystem,
  stageVerifiedFile,
} from './secure-files.mjs'

function assertImportedProgressState(db, sourceDb, tenantId, oid) {
  for (const source of sourceDb.prepare(
    'SELECT * FROM kb_tts_progress ORDER BY guide_id',
  ).iterate()) {
    const imported = db.prepare(`
      SELECT value_json, revision, tombstone, change_sequence FROM user_state
      WHERE tenant_id = ? AND oid = ? AND resource_type = 'progress'
        AND resource_key = ?
    `).get(tenantId, oid, kbProgressResourceKey(source.guide_id))
    if (!imported ||
        imported.revision !== 1 ||
        imported.tombstone !== 0 ||
        !Number.isSafeInteger(imported.change_sequence) ||
        imported.change_sequence <= 0) {
      throw new Error(`Imported KB progress state is missing for ${source.guide_id}`)
    }
    const history = db.prepare(`
      SELECT COUNT(*) AS count FROM user_state_changes
      WHERE change_sequence = ? AND tenant_id = ? AND oid = ?
        AND resource_type = 'progress' AND resource_key = ?
    `).get(
      imported.change_sequence,
      tenantId,
      oid,
      kbProgressResourceKey(source.guide_id),
    )
    if (history.count !== 1) {
      throw new Error(`Imported KB progress history is missing for ${source.guide_id}`)
    }
    const queuedValue = JSON.parse(imported.value_json)
    if (typeof queuedValue !== 'string' ||
        JSON.stringify(JSON.parse(queuedValue)) !==
          JSON.stringify(legacySavedPosition(source))) {
      throw new Error(`Imported KB progress encoding is invalid for ${source.guide_id}`)
    }
  }
}

export async function importLegacy({
  source,
  target,
  ownerTenant,
  ownerOid,
  sourceExpectation,
  beforePublish = async () => {},
  env = process.env,
  allowTestOnlyPathFallback = false,
} = {}) {
  const recoveryFilesystem = requireSecureRecoveryFilesystem({
    allowTestOnlyPathFallback,
    nodeEnv: env.NODE_ENV,
  })
  if (!source || !target) throw new Error('source and target are required')
  const tenantId = requireGuid(ownerTenant, 'owner tenant')
  const oid = requireGuid(ownerOid, 'owner OID')
  const targetPath = assertPathAbsent(target, 'Target database')
  const parentIdentity = ensureSecureDirectoryChain(dirname(targetPath), {
    createMissing: false,
  })
  const stage = createPrivateStage(targetPath, '.lantern-import-', {
    parentIdentity,
    recoveryFilesystem,
  })
  const expectation = sourceExpectation ?? {
    expectedSize: LEGACY_SOURCE_SIZE,
    expectedSha256: LEGACY_SOURCE_SHA256,
  }
  let sourceDb
  let db
  let published
  try {
    const stagedSource = stageVerifiedFile(source, stage, 'source.sqlite3', expectation)
    const sourceFile = {
      path: stagedSource.requestedPath,
      size: stagedSource.size,
      sha256: stagedSource.sha256,
    }
    sourceDb = openImmutableSource(stagedSource.stagedPath)
    const stagedTarget = privateStageChild(stage, 'target.db')
    db = openDatabase({ path: stagedTarget, production: false })
    assertSourceSchema(sourceDb)
    const counts = Object.fromEntries(
      ['exam_attempts', 'exam_question_results', 'kb_tts_progress'].map((table) => [
        table,
        sourceDb.prepare(`SELECT COUNT(*) AS count FROM "${table}"`).get().count,
      ]),
    )
    if (!sourceExpectation) {
      for (const [table, count] of Object.entries(counts)) {
        if (count !== SOURCE_ORACLES[table].count) {
          throw new Error(`Legacy ${table} count ${count} does not match canonical source`)
        }
      }
    }
    const populated = db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM exam_attempts) +
        (SELECT COUNT(*) FROM exam_question_results) +
        (SELECT COUNT(*) FROM kb_tts_progress) +
        (SELECT COUNT(*) FROM exam_attempt_owners) +
        (SELECT COUNT(*) FROM users) +
        (SELECT COUNT(*) FROM user_roles) +
        (SELECT COUNT(*) FROM app_settings) +
        (SELECT COUNT(*) FROM audit_events) +
        (SELECT COUNT(*) FROM user_state) +
        (SELECT COUNT(*) FROM user_state_changes) +
        (SELECT COUNT(*) FROM user_state_mutations) +
        (SELECT COUNT(*) FROM legacy_imports) +
        (SELECT COUNT(*) FROM reconciliation_runs) AS count
    `).get().count
    if (populated !== 0) throw new Error('Target owned tables must be empty')

    const sequences = readSequences(sourceDb, 'main')
    db.transaction(() => {
      const insertAttempt = db.prepare(`
        INSERT INTO exam_attempts(
          id, mode, score, total_questions, correct_count, domain1_score,
          domain1_total, domain2_score, domain2_total, passed,
          time_spent_sec, completed_at
        ) VALUES (
          @id, @mode, @score, @total_questions, @correct_count, @domain1_score,
          @domain1_total, @domain2_score, @domain2_total, @passed,
          @time_spent_sec, @completed_at
        )
      `)
      const insertResult = db.prepare(`
        INSERT INTO exam_question_results(id, attempt_id, question_id, selected, correct)
        VALUES (@id, @attempt_id, @question_id, @selected, @correct)
      `)
      const insertOwner = db.prepare(`
        INSERT INTO exam_attempt_owners(attempt_id, tenant_id, oid) VALUES (?, ?, ?)
      `)
      for (const row of sourceDb.prepare('SELECT * FROM exam_attempts ORDER BY id').iterate()) {
        insertAttempt.run(row)
        insertOwner.run(row.id, tenantId, oid)
      }
      for (const row of sourceDb.prepare(
        'SELECT * FROM exam_question_results ORDER BY id',
      ).iterate()) insertResult.run(row)
      const insertProgress = db.prepare(`
        INSERT INTO kb_tts_progress(
          tenant_id, oid, guide_id, section_index, sentence_index, section_title, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      const insertProgressChange = db.prepare(`
        INSERT INTO user_state_changes(
          tenant_id, oid, resource_type, resource_key, revision,
          value_json, tombstone, mutation_id, updated_at
        ) VALUES (?, ?, 'progress', ?, 1, ?, 0, ?, ?)
      `)
      const insertProgressState = db.prepare(`
        INSERT INTO user_state(
          tenant_id, oid, resource_type, resource_key, revision,
          value_json, tombstone, mutation_id, updated_at, change_sequence
        )
        SELECT
          tenant_id, oid, resource_type, resource_key, revision,
          value_json, tombstone, mutation_id, updated_at, change_sequence
        FROM user_state_changes WHERE change_sequence = ?
      `)
      for (const row of sourceDb.prepare(
        'SELECT * FROM kb_tts_progress ORDER BY guide_id',
      ).iterate()) {
        const resourceKey = kbProgressResourceKey(row.guide_id)
        insertProgress.run(
          tenantId,
          oid,
          row.guide_id,
          row.section_index,
          row.sentence_index,
          row.section_title,
          row.updated_at,
        )
        const position = legacySavedPosition(row)
        const change = insertProgressChange.run(
          tenantId,
          oid,
          resourceKey,
          JSON.stringify(JSON.stringify(position)),
          `legacy-kb-progress:${row.guide_id}`,
          row.updated_at,
        )
        insertProgressState.run(Number(change.lastInsertRowid))
      }

      const replaceSequence = db.prepare(`
        INSERT INTO sqlite_sequence(name, seq) VALUES (?, ?)
      `)
      for (const [name, sequence] of Object.entries(sequences)) {
        db.prepare('DELETE FROM sqlite_sequence WHERE name = ?').run(name)
        replaceSequence.run(name, sequence)
      }
      const foreignKeys = db.pragma('foreign_key_check')
      if (foreignKeys.length) throw new Error('Imported rows violate foreign keys')
      db.prepare(`
        INSERT INTO legacy_imports(
          source_sha256, source_size, owner_tenant_id, owner_oid, counts_json
        ) VALUES (?, ?, ?, ?, ?)
      `).run(
        sourceFile.sha256,
        sourceFile.size,
        tenantId,
        oid,
        JSON.stringify(counts),
      )
    })()
    assertImportedProgressState(db, sourceDb, tenantId, oid)
    db.close()
    db = null
    sourceDb.close()
    sourceDb = null
    fsyncPrivateStageFile(stage, 'target.db')
    await beforePublish({ target: targetPath })
    published = publishPrivateStageNoReplace(stage, 'target.db', targetPath)
    return {
      source: sourceFile,
      target: published.path,
      owner: { tenantId, oid },
      counts,
    }
  } finally {
    if (sourceDb?.open) sourceDb.close()
    if (db?.open) db.close()
    try {
      cleanupPrivateStage(stage)
    } finally {
      closePublicationOwnership(published)
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const report = await importLegacy({
    source: args.source,
    target: args.target,
    ownerTenant: args['owner-tenant'],
    ownerOid: args['owner-oid'],
  })
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Legacy import failed: ${error.message}`)
    process.exitCode = 1
  })
}
