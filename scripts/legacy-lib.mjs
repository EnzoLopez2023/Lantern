import Database from 'better-sqlite3'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'
import { GUID_PATTERN } from '../lib/auth.js'

export const LEGACY_SOURCE_SIZE = 950_947_840
export const LEGACY_SOURCE_SHA256 =
  'dc9fb47d269b339a3dcae37279dc3116f37a0635728a2d2b2ac2c511811a5807'
export const SOURCE_PRODUCT_SHA256 =
  'b71bee99ff4160f7018b227dda921311aa9a32775c613e5159dcc411eaaab8cb'
export const SOURCE_ORACLES = Object.freeze({
  exam_attempts: Object.freeze({
    count: 0,
    hash: '6e9ee03c85f73bb2fca73fb301ec58facd47e7ba6d7f7c5be4baec7ef6c1e606',
  }),
  exam_question_results: Object.freeze({
    count: 0,
    hash: '8d66544a801347b22884b623c422eb726f73affa492c22a644c193a78caa9ca0',
  }),
  kb_tts_progress: Object.freeze({
    count: 3,
    hash: '9687599dccc177ca7fe95d3a70c8f93c0da192805304abcebcf2d098a7d07bda',
  }),
})

export const TABLES = Object.freeze({
  exam_attempts: Object.freeze({
    columns: [
      'id', 'mode', 'score', 'total_questions', 'correct_count', 'domain1_score',
      'domain1_total', 'domain2_score', 'domain2_total', 'passed',
      'time_spent_sec', 'completed_at',
    ],
    keys: ['id'],
  }),
  exam_question_results: Object.freeze({
    columns: ['id', 'attempt_id', 'question_id', 'selected', 'correct'],
    keys: ['id'],
  }),
  kb_tts_progress: Object.freeze({
    columns: ['guide_id', 'section_index', 'sentence_index', 'section_title', 'updated_at'],
    keys: ['guide_id'],
  }),
})

export function parseArgs(argv) {
  const result = {}
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]
    if (!item.startsWith('--')) throw new Error(`Unexpected argument: ${item}`)
    const key = item.slice(2)
    if (!key) throw new Error('Invalid empty option')
    const next = argv[index + 1]
    if (next == null || next.startsWith('--')) result[key] = true
    else {
      result[key] = next
      index += 1
    }
  }
  return result
}

export function requireGuid(value, name) {
  const normalized = String(value ?? '').toLowerCase()
  if (!GUID_PATTERN.test(normalized)) throw new Error(`${name} must be a GUID`)
  return normalized
}

export async function sha256File(path) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest('hex')
}

export function openImmutableSource(sourcePath) {
  const source = new Database(resolve(sourcePath), { readonly: true, fileMustExist: true })
  source.pragma('query_only = ON')
  source.pragma('busy_timeout = 1000')
  return source
}

export function assertSourceSchema(db, database = 'main') {
  for (const [table, specification] of Object.entries(TABLES)) {
    const columns = db.prepare(`PRAGMA ${database}.table_info('${table}')`).all()
      .map(({ name }) => name)
    if (JSON.stringify(columns) !== JSON.stringify(specification.columns)) {
      throw new Error(`Legacy ${table} schema does not match the pinned contract`)
    }
  }
}

function canonicalValue(value) {
  if (value === null) return ['null']
  if (Buffer.isBuffer(value)) return ['blob', value.toString('base64')]
  if (typeof value === 'number') return ['number', Number.isFinite(value) ? String(value) : null]
  return [typeof value, String(value)]
}

export function canonicalRows(db, database, table, { where = '', parameters = [] } = {}) {
  const specification = TABLES[table]
  const columns = specification.columns.map((name) => `"${name}"`).join(', ')
  const order = specification.keys.map((name) => `"${name}"`).join(', ')
  const rowHash = createHash('sha256')
  const keyHash = createHash('sha256')
  let count = 0
  for (const row of db.prepare(
    `SELECT ${columns} FROM ${database}."${table}" ${where} ORDER BY ${order}`,
  ).iterate(...parameters)) {
    const values = specification.columns.map((name) => canonicalValue(row[name]))
    const keys = specification.keys.map((name) => canonicalValue(row[name]))
    rowHash.update(`${JSON.stringify(values)}\n`)
    keyHash.update(`${JSON.stringify(keys)}\n`)
    count += 1
  }
  return {
    count,
    rowHash: rowHash.digest('hex'),
    keyHash: keyHash.digest('hex'),
  }
}

export function readSequences(db, database) {
  const hasSequences = db.prepare(`
    SELECT 1 FROM ${database}.sqlite_master
    WHERE type = 'table' AND name = 'sqlite_sequence'
  `).get()
  if (!hasSequences) return {}
  const wanted = Object.keys(TABLES)
  return Object.fromEntries(
    db.prepare(`
      SELECT name, seq FROM ${database}.sqlite_sequence
      WHERE name IN (${wanted.map(() => '?').join(',')})
      ORDER BY name
    `).all(...wanted).map(({ name, seq }) => [name, seq]),
  )
}
