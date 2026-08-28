import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { openDatabase } from '../../lib/database.js'
import { workspace } from './helpers.js'

const migrations = join(
  dirname(dirname(dirname(fileURLToPath(import.meta.url)))),
  'lib',
  'migrations',
)

test('database uses DELETE journaling, foreign keys, and append-only migrations', () => {
  const path = join(workspace(), 'database.db')
  const db = openDatabase({ path, production: false, busyTimeoutMs: 1234 })
  assert.equal(db.pragma('journal_mode', { simple: true }), 'delete')
  assert.equal(db.pragma('foreign_keys', { simple: true }), 1)
  assert.equal(db.pragma('busy_timeout', { simple: true }), 1234)
  assert.deepEqual(
    db.prepare('SELECT name FROM schema_migrations ORDER BY name').all(),
    [
      { name: '001-initial.sql' },
      { name: '002-user-state-change-sequence.sql' },
    ],
  )
  const attempt = db.prepare(`
    INSERT INTO exam_attempts(score, total_questions, correct_count) VALUES (1, 1, 1)
  `).run().lastInsertRowid
  db.prepare(`
    INSERT INTO exam_question_results(attempt_id, question_id, selected)
    VALUES (?, 'q1', '"a"')
  `).run(attempt)
  db.prepare('DELETE FROM exam_attempts WHERE id = ?').run(attempt)
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM exam_question_results').get().count, 0)
  db.close()

  const reopened = openDatabase({ path, production: false })
  assert.equal(reopened.prepare('SELECT COUNT(*) AS count FROM schema_migrations').get().count, 2)
  reopened.close()
})

test('user-state sequence migration backfills existing state history', () => {
  const root = workspace()
  const path = join(root, 'upgrade.db')
  const initialMigrations = join(root, 'initial-migrations')
  mkdirSync(initialMigrations)
  writeFileSync(
    join(initialMigrations, '001-initial.sql'),
    readFileSync(join(migrations, '001-initial.sql')),
  )
  const old = openDatabase({
    path,
    migrationsDir: initialMigrations,
    production: false,
  })
  old.prepare(`
    INSERT INTO user_state(
      tenant_id, oid, resource_type, resource_key, revision,
      value_json, tombstone, mutation_id, updated_at
    ) VALUES ('tenant', 'oid', 'note', 'existing', 1, '"value"', 0, 'old-mutation',
              '2026-08-28 12:00:00')
  `).run()
  old.close()

  const upgraded = openDatabase({ path, production: false })
  const state = upgraded.prepare(`
    SELECT change_sequence FROM user_state WHERE resource_key = 'existing'
  `).get()
  assert.ok(state.change_sequence > 0)
  assert.deepEqual(
    upgraded.prepare(`
      SELECT resource_key, revision, change_sequence FROM user_state_changes
    `).get(),
    { resource_key: 'existing', revision: 1, change_sequence: state.change_sequence },
  )
  upgraded.close()
})

test('production cannot redirect the persistent database', () => {
  assert.throws(
    () => openDatabase({ path: join(workspace(), 'wrong.db'), production: true }),
    /Production database path/,
  )
})
