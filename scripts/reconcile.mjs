import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openDatabase } from '../lib/database.js'
import { kbProgressResourceKey } from '../lib/user-state-keys.js'
import {
  SOURCE_ORACLES,
  SOURCE_PRODUCT_SHA256,
  TABLES,
  assertSourceSchema,
  canonicalRows,
  openImmutableSource,
  parseArgs,
  readSequences,
  requireGuid,
  LEGACY_SOURCE_SHA256,
  LEGACY_SOURCE_SIZE,
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

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function tableObservedHash(table, canonical) {
  return hashJson({
    table,
    columns: TABLES[table].columns,
    count: canonical.count,
    keyHash: canonical.keyHash,
    rowHash: canonical.rowHash,
  })
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right)
}

const PROGRESS_STATE_COLUMNS = [
  'tenant_id',
  'oid',
  'resource_type',
  'resource_key',
  'revision',
  'value_json',
  'tombstone',
  'mutation_id',
  'updated_at',
  'change_sequence',
]

function progressStateRows(db, table) {
  return db.prepare(`
    SELECT ${PROGRESS_STATE_COLUMNS.join(', ')}
    FROM ${table}
    WHERE resource_type = 'progress'
      AND resource_key LIKE 'kb-tts-progress:%'
    ORDER BY tenant_id, oid, resource_key, change_sequence
  `).all()
}

function progressStateEvidence(expected, target, tenantId, oid) {
  const key = (row) => [
    row.tenant_id,
    row.oid,
    row.resource_type,
    row.resource_key,
  ]
  const expectedKeys = expected.map(key)
  const targetKeys = target.map(key)
  const expectedByKey = new Map(expected.map((row) => [JSON.stringify(key(row)), row]))
  const targetByKey = new Map(target.map((row) => [JSON.stringify(key(row)), row]))
  const missingResourceKeys = [...expectedByKey.keys()]
    .filter((value) => !targetByKey.has(value))
    .map((value) => JSON.parse(value))
  const extraResourceKeys = [...targetByKey.keys()]
    .filter((value) => !expectedByKey.has(value))
    .map((value) => JSON.parse(value))
  const mismatchedResourceKeys = [...expectedByKey.entries()]
    .filter(([value, row]) =>
      targetByKey.has(value) && !sameJson(row, targetByKey.get(value)))
    .map(([value]) => JSON.parse(value))
  const wrongOwnerCount = target.filter((row) =>
    row.tenant_id !== tenantId || row.oid !== oid).length
  return {
    expectedCount: expected.length,
    targetCount: target.length,
    wrongOwnerCount,
    expectedResourceKeyHash: hashJson(expectedKeys),
    targetResourceKeyHash: hashJson(targetKeys),
    expectedRowHash: hashJson(expected.map((row) =>
      PROGRESS_STATE_COLUMNS.map((column) => row[column]))),
    targetRowHash: hashJson(target.map((row) =>
      PROGRESS_STATE_COLUMNS.map((column) => row[column]))),
    expectedChangeSequences: expected.map(({ change_sequence }) => change_sequence),
    targetChangeSequences: target.map(({ change_sequence }) => change_sequence),
    missingResourceKeys,
    extraResourceKeys,
    mismatchedResourceKeys,
    match: wrongOwnerCount === 0 && sameJson(expected, target),
  }
}

function expectedProgressState(sourceDb, tenantId, oid) {
  return sourceDb.prepare('SELECT * FROM kb_tts_progress ORDER BY guide_id').all()
    .map((row, index) => ({
      tenant_id: tenantId,
      oid,
      resource_type: 'progress',
      resource_key: kbProgressResourceKey(row.guide_id),
      revision: 1,
      value_json: JSON.stringify(JSON.stringify(legacySavedPosition(row))),
      tombstone: 0,
      mutation_id: `legacy-kb-progress:${row.guide_id}`,
      updated_at: row.updated_at,
      change_sequence: index + 1,
    }))
}

export async function reconcileLegacy({
  source,
  target,
  ownerTenant,
  ownerOid,
  output,
  sourceExpectation,
  beforePublish = async () => {},
  env = process.env,
  allowTestOnlyPathFallback = false,
} = {}) {
  const recoveryFilesystem = requireSecureRecoveryFilesystem({
    allowTestOnlyPathFallback,
    nodeEnv: env.NODE_ENV,
  })
  if (!source || !target || !output) throw new Error('source, target, and output are required')
  const tenantId = requireGuid(ownerTenant, 'owner tenant')
  const oid = requireGuid(ownerOid, 'owner OID')
  const destination = assertPathAbsent(resolve(output), 'Reconciliation output')
  const targetPath = resolve(target)
  const targetParent = ensureSecureDirectoryChain(dirname(targetPath), {
    createMissing: false,
  })
  const stage = createPrivateStage(targetPath, '.lantern-reconcile-', {
    parentIdentity: targetParent,
    recoveryFilesystem,
  })
  const expectation = sourceExpectation ?? {
    expectedSize: LEGACY_SOURCE_SIZE,
    expectedSha256: LEGACY_SOURCE_SHA256,
  }
  let sourceDb
  let db
  let report
  try {
    const stagedSource = stageVerifiedFile(source, stage, 'source.sqlite3', expectation)
    const stagedTarget = stageVerifiedFile(targetPath, stage, 'target.sqlite3')
    if (
      stagedSource.sourceInode.dev === stagedTarget.sourceInode.dev &&
      stagedSource.sourceInode.ino === stagedTarget.sourceInode.ino
    ) {
      throw new Error('Source and target resolve to the same database file')
    }
    const sourceFile = {
      path: stagedSource.requestedPath,
      size: stagedSource.size,
      sha256: stagedSource.sha256,
    }
    sourceDb = openImmutableSource(stagedSource.stagedPath)
    db = openImmutableSource(stagedTarget.stagedPath)
    assertSourceSchema(sourceDb)

    const legacyProgressOwnership = db.prepare(`
      SELECT
        COUNT(*) AS totalTargetCount,
        SUM(CASE WHEN tenant_id = ? AND oid = ? THEN 1 ELSE 0 END) AS mappedTargetCount,
        SUM(CASE WHEN tenant_id <> ? OR oid <> ? THEN 1 ELSE 0 END) AS wrongOwnerCount
      FROM kb_tts_progress
    `).get(tenantId, oid, tenantId, oid)
    legacyProgressOwnership.mappedTargetCount ??= 0
    legacyProgressOwnership.wrongOwnerCount ??= 0
    const tables = {}
    for (const table of Object.keys(TABLES)) {
      const sourceCanonical = canonicalRows(sourceDb, 'main', table)
      const targetCanonical = table === 'kb_tts_progress'
        ? canonicalRows(db, 'main', table, {
            where: 'WHERE tenant_id = ? AND oid = ?',
            parameters: [tenantId, oid],
          })
        : canonicalRows(db, 'main', table)
      const ownershipMatches = table !== 'kb_tts_progress' ||
        (
          legacyProgressOwnership.totalTargetCount === sourceCanonical.count &&
          legacyProgressOwnership.mappedTargetCount === sourceCanonical.count &&
          legacyProgressOwnership.wrongOwnerCount === 0
        )
      const rowsMatch =
        sourceCanonical.count === targetCanonical.count &&
        sourceCanonical.rowHash === targetCanonical.rowHash &&
        ownershipMatches
      const keysMatch = sourceCanonical.keyHash === targetCanonical.keyHash
      const oracle = SOURCE_ORACLES[table]
      tables[table] = {
        sourceCount: sourceCanonical.count,
        targetCount: targetCanonical.count,
        sourceKeyHash: sourceCanonical.keyHash,
        targetKeyHash: targetCanonical.keyHash,
        sourceRowHash: sourceCanonical.rowHash,
        targetRowHash: targetCanonical.rowHash,
        sourceObservedTableHash: tableObservedHash(table, sourceCanonical),
        targetObservedTableHash: tableObservedHash(table, targetCanonical),
        canonicalSourceHash: oracle.hash,
        canonicalTargetHash: rowsMatch && keysMatch ? oracle.hash : null,
        expectedSourceCount: oracle.count,
        countMatchesOracle: sourceCanonical.count === oracle.count,
        ...(table === 'kb_tts_progress'
          ? { ...legacyProgressOwnership, ownershipMatches }
          : {}),
        rowsMatch,
        keysMatch,
      }
    }

    const sourceSequences = readSequences(sourceDb, 'main')
    const targetSequences = readSequences(db, 'main')
    const foreignKeyViolations = db.pragma('foreign_key_check')
    const ownerSummary = db.prepare(`
      SELECT COUNT(*) AS count, COUNT(DISTINCT tenant_id || ':' || oid) AS identities
      FROM exam_attempt_owners
    `).get()
    const wrongOwners = db.prepare(`
      SELECT COUNT(*) AS count FROM exam_attempt_owners
      WHERE tenant_id <> ? OR oid <> ?
    `).get(tenantId, oid).count
    const allTableMatches = Object.values(tables).every((table) =>
      table.countMatchesOracle && table.rowsMatch && table.keysMatch)
    const ownerMatches =
      ownerSummary.count === tables.exam_attempts.targetCount &&
      (ownerSummary.count === 0 || ownerSummary.identities === 1) &&
      wrongOwners === 0
    const sequenceMatches = sameJson(sourceSequences, targetSequences)
    const expectedState = expectedProgressState(sourceDb, tenantId, oid)
    const stateEvidence = progressStateEvidence(
      expectedState,
      progressStateRows(db, 'user_state'),
      tenantId,
      oid,
    )
    const historyEvidence = progressStateEvidence(
      expectedState,
      progressStateRows(db, 'user_state_changes'),
      tenantId,
      oid,
    )
    const applicationProgressMatches = stateEvidence.match && historyEvidence.match
    const sourceProductEvidence = Object.fromEntries(
      Object.entries(tables).map(([name, table]) => [name, table.canonicalSourceHash]),
    )
    const targetProductEvidence = Object.fromEntries(
      Object.entries(tables).map(([name, table]) => [name, table.canonicalTargetHash]),
    )
    report = {
      format: 'lantern-legacy-reconciliation/v1',
      generatedAt: new Date().toISOString(),
      source: sourceFile,
      target: stagedTarget.requestedPath,
      owner: { tenantId, oid },
      tables,
      sequences: {
        source: sourceSequences,
        target: targetSequences,
        match: sequenceMatches,
      },
      foreignKeys: { ok: foreignKeyViolations.length === 0, violations: foreignKeyViolations },
      ownership: { ...ownerSummary, wrongOwners, match: ownerMatches },
      kbProgress: {
        legacyTable: {
          sourceCount: tables.kb_tts_progress.sourceCount,
          ...legacyProgressOwnership,
          match: tables.kb_tts_progress.ownershipMatches,
        },
        userState: stateEvidence,
        userStateChanges: historyEvidence,
        match: applicationProgressMatches,
      },
      canonicalProduct: {
        sourceHash: SOURCE_PRODUCT_SHA256,
        targetHash: allTableMatches ? SOURCE_PRODUCT_SHA256 : null,
        sourceEvidence: sourceProductEvidence,
        targetEvidence: targetProductEvidence,
      },
      ok:
        allTableMatches &&
        ownerMatches &&
        applicationProgressMatches &&
        sequenceMatches &&
        foreignKeyViolations.length === 0,
    }
  } finally {
    if (sourceDb?.open) sourceDb.close()
    if (db?.open) db.close()
    cleanupPrivateStage(stage)
  }

  const outputParent = ensureSecureDirectoryChain(dirname(destination), {
    createMissing: false,
  })
  const reportStage = createPrivateStage(destination, '.lantern-reconcile-report-', {
    parentIdentity: outputParent,
    recoveryFilesystem,
  })
  let reportPublication
  try {
    const stagedReport = privateStageChild(reportStage, 'reconciliation.json')
    writeFileSync(stagedReport, `${JSON.stringify(report, null, 2)}\n`, {
      flag: 'wx',
      mode: 0o600,
    })
    fsyncPrivateStageFile(reportStage, 'reconciliation.json')
    await beforePublish({ output: destination })
    reportPublication = publishPrivateStageNoReplace(
      reportStage,
      'reconciliation.json',
      destination,
    )
  } finally {
    try {
      cleanupPrivateStage(reportStage)
    } finally {
      closePublicationOwnership(reportPublication)
    }
  }
  if (!report.ok) {
    const error = new Error('Legacy reconciliation failed')
    error.report = report
    throw error
  }
  return report
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const report = await reconcileLegacy({
    source: args.source,
    target: args.target,
    ownerTenant: args['owner-tenant'],
    ownerOid: args['owner-oid'],
    output: args.output,
  })
  process.stdout.write(`${JSON.stringify({ ok: report.ok, output: resolve(args.output) })}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Reconciliation failed: ${error.message}`)
    process.exitCode = 1
  })
}
