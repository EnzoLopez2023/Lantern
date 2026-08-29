import { randomUUID } from 'node:crypto'
import { kbProgressResourceKey } from './user-state-keys.js'

function json(value) {
  return JSON.stringify(value ?? null)
}

function parseJson(value, fallback = null) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

function identityArgs(identity) {
  return [identity.tenantId, identity.oid]
}

function stateResult(row) {
  if (!row) return null
  return {
    resourceType: row.resource_type,
    resourceKey: row.resource_key,
    revision: row.revision,
    value: row.tombstone ? null : parseJson(row.value_json),
    tombstone: row.tombstone === 1,
    mutationId: row.mutation_id,
    updatedAt: row.updated_at,
    changeSequence: row.change_sequence,
  }
}

export function createRepositories(db) {
  const writeAudit = db.prepare(`
    INSERT INTO audit_events(tenant_id, oid, action, target_type, target_id, detail_json)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const repositories = {
    async ensureUser(identity) {
      db.transaction(() => {
        const created = db.prepare(`
          INSERT OR IGNORE INTO users(tenant_id, oid, display_name, email)
          VALUES (?, ?, ?, ?)
        `).run(identity.tenantId, identity.oid, identity.displayName, identity.email).changes === 1
        db.prepare(`
          UPDATE users SET display_name = ?, email = ?, last_seen_at = datetime('now')
          WHERE tenant_id = ? AND oid = ?
        `).run(
          identity.displayName,
          identity.email,
          identity.tenantId,
          identity.oid,
        )
        if (created) {
          db.prepare(`
            INSERT INTO user_roles(tenant_id, oid, role_name) VALUES (?, ?, 'user')
          `).run(...identityArgs(identity))
        }
      })()
      return repositories.getUser(identity)
    },

    async getUser(identity) {
      const user = db.prepare(`
        SELECT tenant_id, oid, display_name, email, created_at, last_seen_at, disabled_at
        FROM users WHERE tenant_id = ? AND oid = ?
      `).get(...identityArgs(identity))
      if (!user) return null
      const roles = db.prepare(`
        SELECT r.name, r.scopes_json
        FROM user_roles ur JOIN roles r ON r.name = ur.role_name
        WHERE ur.tenant_id = ? AND ur.oid = ?
        ORDER BY r.name
      `).all(...identityArgs(identity))
      const scopes = new Set()
      for (const role of roles) {
        for (const scope of parseJson(role.scopes_json, [])) scopes.add(scope)
      }
      return {
        tenantId: user.tenant_id,
        oid: user.oid,
        displayName: user.display_name,
        email: user.email,
        createdAt: user.created_at,
        lastSeenAt: user.last_seen_at,
        disabled: user.disabled_at !== null,
        roles: roles.map(({ name }) => name),
        scopes: [...scopes].sort(),
      }
    },

    async listUsers() {
      const rows = db.prepare(`
        SELECT u.tenant_id, u.oid, u.display_name, u.email, u.created_at,
               u.last_seen_at, u.disabled_at,
               COALESCE(group_concat(ur.role_name), '') AS role_names
        FROM users u
        LEFT JOIN user_roles ur ON ur.tenant_id = u.tenant_id AND ur.oid = u.oid
        GROUP BY u.tenant_id, u.oid
        ORDER BY u.last_seen_at DESC
        LIMIT 500
      `).all()
      return rows.map((row) => ({
        tenantId: row.tenant_id,
        oid: row.oid,
        displayName: row.display_name,
        email: row.email,
        createdAt: row.created_at,
        lastSeenAt: row.last_seen_at,
        disabled: row.disabled_at !== null,
        roles: row.role_names ? row.role_names.split(',').sort() : [],
      }))
    },

    async listRoles() {
      return db.prepare('SELECT name, scopes_json, built_in FROM roles ORDER BY name').all()
        .map((row) => ({
          name: row.name,
          scopes: parseJson(row.scopes_json, []),
          builtIn: row.built_in === 1,
        }))
    },

    async ensureBootstrapAdmin(tenantId, oid) {
      const promote = db.transaction(() => {
        db.prepare(`
          INSERT INTO users(tenant_id, oid, display_name)
          VALUES (?, ?, 'Lantern administrator')
          ON CONFLICT(tenant_id, oid) DO NOTHING
        `).run(tenantId, oid)
        db.prepare(`
          INSERT OR IGNORE INTO user_roles(tenant_id, oid, role_name)
          VALUES (?, ?, 'admin')
        `).run(tenantId, oid)
      })
      promote()
    },

    async setUserRoles(actor, target, roleNames) {
      const apply = db.transaction(() => {
        const exists = db.prepare(
          'SELECT 1 FROM users WHERE tenant_id = ? AND oid = ?',
        ).get(target.tenantId, target.oid)
        if (!exists) {
          const error = new Error('User not found')
          error.code = 'NOT_FOUND'
          throw error
        }
        const known = new Set(db.prepare('SELECT name FROM roles').all().map(({ name }) => name))
        if (roleNames.some((name) => !known.has(name))) {
          const error = new Error('Unknown role')
          error.code = 'VALIDATION'
          throw error
        }
        db.prepare('DELETE FROM user_roles WHERE tenant_id = ? AND oid = ?')
          .run(target.tenantId, target.oid)
        const insert = db.prepare(
          'INSERT INTO user_roles(tenant_id, oid, role_name) VALUES (?, ?, ?)',
        )
        for (const name of [...new Set(roleNames)]) {
          insert.run(target.tenantId, target.oid, name)
        }
        writeAudit.run(
          actor.tenantId,
          actor.oid,
          'admin.user_roles.set',
          'user',
          `${target.tenantId}:${target.oid}`,
          json({ roles: [...new Set(roleNames)].sort() }),
        )
      })
      apply()
      return repositories.getUser(target)
    },

    async listAttempts(identity) {
      return db.prepare(`
        SELECT a.id, a.mode, a.score, a.total_questions AS totalQuestions,
               a.correct_count AS correctCount, a.domain1_score AS domain1Score,
               a.domain1_total AS domain1Total, a.domain2_score AS domain2Score,
               a.domain2_total AS domain2Total, a.passed,
               a.time_spent_sec AS timeSpentSec, a.completed_at AS completedAt
        FROM exam_attempts a
        JOIN exam_attempt_owners o ON o.attempt_id = a.id
        WHERE o.tenant_id = ? AND o.oid = ?
        ORDER BY a.completed_at DESC, a.id DESC
        LIMIT 50
      `).all(...identityArgs(identity))
    },

    async getAttempt(identity, id) {
      const attempt = db.prepare(`
        SELECT a.id, a.mode, a.score, a.total_questions AS totalQuestions,
               a.correct_count AS correctCount, a.domain1_score AS domain1Score,
               a.domain1_total AS domain1Total, a.domain2_score AS domain2Score,
               a.domain2_total AS domain2Total, a.passed,
               a.time_spent_sec AS timeSpentSec, a.completed_at AS completedAt
        FROM exam_attempts a
        JOIN exam_attempt_owners o ON o.attempt_id = a.id
        WHERE a.id = ? AND o.tenant_id = ? AND o.oid = ?
      `).get(id, ...identityArgs(identity))
      if (!attempt) return null
      const results = db.prepare(`
        SELECT question_id AS questionId, selected, correct
        FROM exam_question_results WHERE attempt_id = ? ORDER BY id
      `).all(id)
      return { ...attempt, results }
    },

    async createAttempt(identity, attempt) {
      const create = db.transaction(() => {
        const info = db.prepare(`
          INSERT INTO exam_attempts(
            mode, score, total_questions, correct_count, domain1_score,
            domain1_total, domain2_score, domain2_total, passed, time_spent_sec
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          attempt.mode,
          attempt.score,
          attempt.totalQuestions,
          attempt.correctCount,
          attempt.domain1Score,
          attempt.domain1Total,
          attempt.domain2Score,
          attempt.domain2Total,
          attempt.passed ? 1 : 0,
          attempt.timeSpentSec,
        )
        const id = Number(info.lastInsertRowid)
        db.prepare(`
          INSERT INTO exam_attempt_owners(attempt_id, tenant_id, oid) VALUES (?, ?, ?)
        `).run(id, ...identityArgs(identity))
        const insertResult = db.prepare(`
          INSERT INTO exam_question_results(attempt_id, question_id, selected, correct)
          VALUES (?, ?, ?, ?)
        `)
        for (const result of attempt.results) {
          insertResult.run(
            id,
            result.questionId,
            JSON.stringify(result.selected),
            result.correct ? 1 : 0,
          )
        }
        writeAudit.run(
          identity.tenantId,
          identity.oid,
          'exam.attempt.create',
          'exam_attempt',
          String(id),
          json({ score: attempt.score, passed: attempt.passed }),
        )
        return id
      })
      const id = create()
      return { id, score: attempt.score, passed: attempt.passed }
    },

    async deleteAttempt(identity, id) {
      const remove = db.transaction(() => {
        const owned = db.prepare(`
          SELECT 1 FROM exam_attempt_owners
          WHERE attempt_id = ? AND tenant_id = ? AND oid = ?
        `).get(id, ...identityArgs(identity))
        if (!owned) return false
        db.prepare('DELETE FROM exam_attempts WHERE id = ?').run(id)
        writeAudit.run(
          identity.tenantId,
          identity.oid,
          'exam.attempt.delete',
          'exam_attempt',
          String(id),
          '{}',
        )
        return true
      })
      return remove()
    },

    async getExamStats(identity) {
      const stats = db.prepare(`
        SELECT COUNT(*) AS totalAttempts,
               SUM(CASE WHEN a.passed = 1 THEN 1 ELSE 0 END) AS passedAttempts,
               MAX(a.score) AS bestScore, AVG(a.score) AS avgScore,
               AVG(a.time_spent_sec) AS avgTime
        FROM exam_attempts a
        JOIN exam_attempt_owners o ON o.attempt_id = a.id
        WHERE o.tenant_id = ? AND o.oid = ?
      `).get(...identityArgs(identity))
      const weakAreas = db.prepare(`
        SELECT q.question_id AS questionId, COUNT(*) AS attempts,
               SUM(CASE WHEN q.correct = 0 THEN 1 ELSE 0 END) AS wrongCount
        FROM exam_question_results q
        JOIN exam_attempt_owners o ON o.attempt_id = q.attempt_id
        WHERE o.tenant_id = ? AND o.oid = ?
        GROUP BY q.question_id HAVING wrongCount > 0
        ORDER BY CAST(wrongCount AS FLOAT) / attempts DESC, q.question_id
        LIMIT 10
      `).all(...identityArgs(identity))
      return { ...stats, weakAreas }
    },

    async getKbProgress(identity, guideId) {
      const state = await repositories.getState(
        identity,
        'progress',
        kbProgressResourceKey(guideId),
      )
      if (!state || state.tombstone) return null
      if (typeof state.value !== 'string') return null
      let value
      try {
        value = JSON.parse(state.value)
      } catch {
        return null
      }
      return {
        sectionIndex: value.sectionIndex ?? 0,
        sentenceIndex: value.sentenceIndex ?? 0,
        title: value.title ?? '',
        timestamp: value.timestamp ?? Date.parse(`${state.updatedAt.replace(' ', 'T')}Z`),
      }
    },

    async putKbProgress(identity, guideId, progress) {
      const current = await repositories.getState(
        identity,
        'progress',
        kbProgressResourceKey(guideId),
      )
      await repositories.mutateState(identity, {
        resourceType: 'progress',
        resourceKey: kbProgressResourceKey(guideId),
        mutationId: randomUUID(),
        expectedRevision: current?.revision ?? 0,
        tombstone: false,
        value: JSON.stringify({ ...progress, timestamp: Date.now() }),
      })
    },

    async deleteKbProgress(identity, guideId) {
      const current = await repositories.getState(
        identity,
        'progress',
        kbProgressResourceKey(guideId),
      )
      await repositories.mutateState(identity, {
        resourceType: 'progress',
        resourceKey: kbProgressResourceKey(guideId),
        mutationId: randomUUID(),
        expectedRevision: current?.revision ?? 0,
        tombstone: true,
        value: null,
      })
    },

    async listSettings() {
      return db.prepare(`
        SELECT key, value_json, revision, updated_at FROM app_settings ORDER BY key
      `).all().map((row) => ({
        key: row.key,
        value: parseJson(row.value_json),
        revision: row.revision,
        updatedAt: row.updated_at,
      }))
    },

    async putSetting(identity, key, value, expectedRevision) {
      const update = db.transaction(() => {
        const current = db.prepare(
          'SELECT revision FROM app_settings WHERE key = ?',
        ).get(key)
        const revision = current?.revision ?? 0
        if (expectedRevision !== revision) {
          const error = new Error('Setting revision conflict')
          error.code = 'CONFLICT'
          error.currentRevision = revision
          throw error
        }
        db.prepare(`
          INSERT INTO app_settings(
            key, value_json, revision, updated_at, updated_tenant_id, updated_oid
          ) VALUES (?, ?, 1, datetime('now'), ?, ?)
          ON CONFLICT(key) DO UPDATE SET
            value_json = excluded.value_json,
            revision = app_settings.revision + 1,
            updated_at = excluded.updated_at,
            updated_tenant_id = excluded.updated_tenant_id,
            updated_oid = excluded.updated_oid
        `).run(key, json(value), ...identityArgs(identity))
        const row = db.prepare(`
          SELECT key, value_json, revision, updated_at FROM app_settings WHERE key = ?
        `).get(key)
        writeAudit.run(
          identity.tenantId,
          identity.oid,
          'settings.update',
          'setting',
          key,
          json({ revision: row.revision }),
        )
        return {
          key: row.key,
          value: parseJson(row.value_json),
          revision: row.revision,
          updatedAt: row.updated_at,
        }
      })
      return update()
    },

    async getState(identity, resourceType, resourceKey) {
      return stateResult(db.prepare(`
        SELECT * FROM user_state
        WHERE tenant_id = ? AND oid = ? AND resource_type = ? AND resource_key = ?
      `).get(...identityArgs(identity), resourceType, resourceKey))
    },

    async listState(identity, { cursor = null, limit = 100 } = {}) {
      const snapshotHighWater = cursor?.highWater ?? db.prepare(`
        SELECT COALESCE(MAX(change_sequence), 0) AS high_water
        FROM user_state_changes
        WHERE tenant_id = ? AND oid = ?
      `).get(...identityArgs(identity)).high_water
      const afterSequence = cursor?.sequence ?? 0
      const rows = db.prepare(`
        WITH snapshot AS (
          SELECT changes.*,
                 ROW_NUMBER() OVER (
                   PARTITION BY resource_type, resource_key
                   ORDER BY change_sequence DESC
                 ) AS snapshot_rank
          FROM user_state_changes changes
          WHERE tenant_id = ? AND oid = ? AND change_sequence <= ?
        )
        SELECT * FROM snapshot
        WHERE snapshot_rank = 1 AND change_sequence > ?
        ORDER BY change_sequence
        LIMIT ?
      `).all(
        ...identityArgs(identity),
        snapshotHighWater,
        afterSequence,
        limit + 1,
      )
      const hasMore = rows.length > limit
      const page = hasMore ? rows.slice(0, limit) : rows
      const last = hasMore ? page.at(-1) : null
      return {
        resources: page.map(stateResult),
        next: last
          ? {
              sequence: last.change_sequence,
              highWater: snapshotHighWater,
            }
          : null,
      }
    },

    async mutateState(identity, mutation) {
      const mutate = db.transaction(() => {
        const previousMutation = db.prepare(`
          SELECT resource_type, resource_key, response_json
          FROM user_state_mutations
          WHERE tenant_id = ? AND oid = ? AND mutation_id = ?
        `).get(...identityArgs(identity), mutation.mutationId)
        if (previousMutation) {
          if (
            previousMutation.resource_type !== mutation.resourceType ||
            previousMutation.resource_key !== mutation.resourceKey
          ) {
            const error = new Error('Mutation ID already used for another resource')
            error.code = 'CONFLICT'
            throw error
          }
          return parseJson(previousMutation.response_json)
        }
        const current = db.prepare(`
          SELECT * FROM user_state
          WHERE tenant_id = ? AND oid = ? AND resource_type = ? AND resource_key = ?
        `).get(
          ...identityArgs(identity),
          mutation.resourceType,
          mutation.resourceKey,
        )
        const currentRevision = current?.revision ?? 0
        if (currentRevision !== mutation.expectedRevision) {
          const error = new Error('User state revision conflict')
          error.code = 'CONFLICT'
          error.current = stateResult(current)
          throw error
        }
        const change = db.prepare(`
          INSERT INTO user_state_changes(
            tenant_id, oid, resource_type, resource_key, revision,
            value_json, tombstone, mutation_id, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          ...identityArgs(identity),
          mutation.resourceType,
          mutation.resourceKey,
          currentRevision + 1,
          mutation.tombstone ? null : json(mutation.value),
          mutation.tombstone ? 1 : 0,
          mutation.mutationId,
        )
        const changeSequence = Number(change.lastInsertRowid)
        db.prepare(`
          INSERT INTO user_state(
            tenant_id, oid, resource_type, resource_key, revision,
            value_json, tombstone, mutation_id, updated_at, change_sequence
          )
          SELECT
            tenant_id, oid, resource_type, resource_key, revision,
            value_json, tombstone, mutation_id, updated_at, change_sequence
          FROM user_state_changes
          WHERE change_sequence = ?
          ON CONFLICT(tenant_id, oid, resource_type, resource_key) DO UPDATE SET
            revision = excluded.revision,
            value_json = excluded.value_json,
            tombstone = excluded.tombstone,
            mutation_id = excluded.mutation_id,
            updated_at = excluded.updated_at,
            change_sequence = excluded.change_sequence
        `).run(changeSequence)
        const result = stateResult(db.prepare(`
          SELECT * FROM user_state
          WHERE tenant_id = ? AND oid = ? AND resource_type = ? AND resource_key = ?
        `).get(
          ...identityArgs(identity),
          mutation.resourceType,
          mutation.resourceKey,
        ))
        db.prepare(`
          INSERT INTO user_state_mutations(
            tenant_id, oid, mutation_id, resource_type, resource_key, response_json
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          ...identityArgs(identity),
          mutation.mutationId,
          mutation.resourceType,
          mutation.resourceKey,
          json(result),
        )
        return result
      })
      return mutate()
    },

    async appendAudit(identity, action, targetType, targetId, detail = {}) {
      const info = writeAudit.run(
        identity?.tenantId ?? null,
        identity?.oid ?? null,
        action,
        targetType ?? null,
        targetId ?? null,
        json(detail),
      )
      return Number(info.lastInsertRowid)
    },

    async listAudit({ limit = 100, beforeId = Number.MAX_SAFE_INTEGER } = {}) {
      return db.prepare(`
        SELECT id, occurred_at, tenant_id, oid, action, target_type, target_id, detail_json
        FROM audit_events WHERE id < ? ORDER BY id DESC LIMIT ?
      `).all(beforeId, limit).map((row) => ({
        id: row.id,
        occurredAt: row.occurred_at,
        actor: row.tenant_id ? { tenantId: row.tenant_id, oid: row.oid } : null,
        action: row.action,
        targetType: row.target_type,
        targetId: row.target_id,
        detail: parseJson(row.detail_json, {}),
      }))
    },
  }

  return repositories
}
