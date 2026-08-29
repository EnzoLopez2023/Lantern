import assert from 'node:assert/strict'
import Database from 'better-sqlite3'
import { request as httpRequest } from 'node:http'
import { join } from 'node:path'
import { ReadableStream } from 'node:stream/web'
import test from 'node:test'
import { KB_PROGRESS_PREFIX } from '../../lib/user-state-keys.js'
import { createRuntimeConfig } from '../../server/app.js'
import { withApp } from './helpers.js'

async function body(response) {
  return response.json()
}

test('health/version expose bounded SQLite, lifecycle, build, and source identity', async () => {
  await withApp(async ({ request, db }) => {
    const source = {
      app: 'hearth',
      version: '2.13.2',
      build: 172,
      commit: 'f0b05fc1dbf53e8aa26c215d8e858894a2793871',
      tree: '62cbd35861c511f7c17187c875d19ee6e353b80d',
      imageDigest: 'sha256:dc4df7e0f966be5b0608e71643d316cc5eba7590b8e56cec482583ab69443140',
    }
    const live = await request('/api/live', { headers: { authorization: '' } })
    assert.equal(live.status, 200)
    assert.equal((await body(live)).status, 'live')
    const ready = await request('/api/ready', { headers: { authorization: '' } })
    assert.equal(ready.status, 200)
    const readiness = await body(ready)
    assert.deepEqual(readiness.database, {
      authority: 'sqlite',
      journalMode: 'delete',
      schemaIdentity: '001-initial.sql,002-user-state-change-sequence.sql',
    })
    assert.equal(readiness.lifecycle, 'running')
    assert.deepEqual(readiness.workers, [])
    assert.equal(readiness.build.app, 'lantern')
    assert.deepEqual(readiness.build.source, source)
    const version = await body(await request('/api/version', {
      headers: { authorization: '' },
    }))
    assert.equal(version.app, 'lantern')
    assert.deepEqual(version.source, source)
    const unauthorized = await request('/api/auth/me', { headers: { authorization: '' } })
    assert.equal(unauthorized.status, 401)
    db.close()
    const started = performance.now()
    assert.equal((await request('/api/ready', { headers: { authorization: '' } })).status, 503)
    assert.ok(performance.now() - started < 1_000)
  })
})

test('runtime config is public, no-store, safely serialized, and contains no secrets', async () => {
  await withApp(async ({ request }) => {
    const response = await request('/runtime-config.js', {
      headers: { authorization: '' },
    })
    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type'), /^application\/javascript/)
    assert.match(response.headers.get('cache-control'), /no-store/)
    const script = await response.text()
    assert.doesNotMatch(script, /<\/script/i)
    assert.doesNotMatch(script, /speech-secret|client-secret|database-secret/)
    const serialized = script
      .replace(/^window\.__LANTERN_RUNTIME_CONFIG__=/, '')
      .replace(/;\n$/, '')
    assert.deepEqual(JSON.parse(serialized), {
      tenantId: '11111111-1111-1111-1111-111111111111',
      clientId: 'lantern-client',
      apiScope: 'api://lantern/access_as_user</script>',
      apiBaseUrl: '',
      allowDevAuth: true,
      devTenantId: '11111111-1111-1111-1111-111111111111',
      devOid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    })
  }, {
    env: {
      NODE_ENV: 'development',
      AZURE_AD_TENANT_ID: '11111111-1111-1111-1111-111111111111',
      AZURE_AD_CLIENT_ID: 'lantern-client',
      AZURE_AD_API_SCOPE: 'api://lantern/access_as_user</script>',
      ALLOW_DEV_AUTH: 'true',
      DEV_AUTH_TENANT_ID: '11111111-1111-1111-1111-111111111111',
      DEV_AUTH_OID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      AZURE_SPEECH_KEY: 'speech-secret',
      AZURE_AD_CLIENT_SECRET: 'client-secret',
      DATABASE_SECRET: 'database-secret',
    },
  })
})

test('runtime config rejects every nonempty API base and OPTIONS has no public surface', async () => {
  for (const apiBaseUrl of [
    'https://api.example.invalid',
    '//api.example.invalid',
    '/prefix',
    ' ',
  ]) {
    assert.throws(
      () => createRuntimeConfig({ LANTERN_PUBLIC_API_BASE_URL: apiBaseUrl }),
      /same-origin only/,
    )
  }
  await withApp(async ({ request }) => {
    for (const path of ['/runtime-config.js', '/api/user-state']) {
      const response = await request(path, {
        method: 'OPTIONS',
        headers: {
          authorization: '',
          origin: 'https://cross-origin.example',
          'access-control-request-method': 'GET',
        },
      })
      assert.equal(response.status, 405)
      assert.equal(response.headers.get('access-control-allow-origin'), null)
    }
  })
})

test('runtime config never exposes development identity outside development', async () => {
  await withApp(async ({ request }) => {
    const script = await (await request('/runtime-config.js', {
      headers: { authorization: '' },
    })).text()
    const config = JSON.parse(
      script.replace(/^window\.__LANTERN_RUNTIME_CONFIG__=/, '').replace(/;\n$/, ''),
    )
    assert.equal(config.allowDevAuth, false)
    assert.equal(config.devTenantId, null)
    assert.equal(config.devOid, null)
  }, {
    env: {
      NODE_ENV: 'production',
      ALLOW_DEV_AUTH: 'true',
      DEV_AUTH_TENANT_ID: '11111111-1111-1111-1111-111111111111',
      DEV_AUTH_OID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    },
  })
})

test('development bypass works using only required DEV_AUTH GUID identity', async () => {
  await withApp(async ({ request }) => {
    const me = await body(await request('/api/auth/me', {
      headers: { authorization: '' },
    }))
    assert.equal(me.tenantId, '11111111-1111-1111-1111-111111111111')
    assert.equal(me.oid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
    const script = await (await request('/runtime-config.js', {
      headers: { authorization: '' },
    })).text()
    const config = JSON.parse(
      script.replace(/^window\.__LANTERN_RUNTIME_CONFIG__=/, '').replace(/;\n$/, ''),
    )
    assert.deepEqual(config, {
      tenantId: '',
      clientId: '',
      apiScope: '',
      apiBaseUrl: '',
      allowDevAuth: true,
      devTenantId: '11111111-1111-1111-1111-111111111111',
      devOid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    })
  }, {
    env: {
      NODE_ENV: 'development',
      ALLOW_DEV_AUTH: 'true',
      DEV_AUTH_TENANT_ID: '11111111-1111-1111-1111-111111111111',
      DEV_AUTH_OID: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    },
    useEnvironmentAuth: true,
  })
})

test('exam and KB routes retain legacy shape while enforcing tenant/OID ownership', async () => {
  await withApp(async ({ request, db }) => {
    const created = await request('/api/exam-prep/attempts', {
      method: 'POST',
      body: {
        mode: 'practice',
        score: 80,
        totalQuestions: 1,
        correctCount: 1,
        passed: true,
        results: [{ questionId: 'q1', selected: 'A', correct: true }],
      },
    })
    assert.equal(created.status, 201)
    const { id } = await body(created)
    const ownAttempt = await request(`/api/exam-prep/attempts/${id}`)
    assert.equal(ownAttempt.status, 200)
    assert.equal((await body(ownAttempt)).results[0].selected, '"A"')
    assert.equal((await request(`/api/exam-prep/attempts/${id}`, { token: 'user-b' })).status, 404)

    await request('/api/kb/progress/guide-1', {
      method: 'PUT',
      body: { sectionIndex: 2, sentenceIndex: 4, title: 'Section' },
    })
    assert.equal((await body(await request('/api/kb/progress/guide-1'))).sectionIndex, 2)
    assert.equal(await body(await request('/api/kb/progress/guide-1', { token: 'user-b' })), null)
    db.prepare(`
      INSERT INTO kb_tts_progress(
        tenant_id, oid, guide_id, section_index, sentence_index, section_title
      ) VALUES (?, ?, 'guide-1', 99, 99, 'stale legacy row')
    `).run(
      '11111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    )
    assert.equal((await request('/api/kb/progress/guide-1', { method: 'DELETE' })).status, 200)
    assert.equal(await body(await request('/api/kb/progress/guide-1')), null)
    const state = db.prepare(`
      SELECT tombstone, revision FROM user_state
      WHERE tenant_id = ? AND oid = ? AND resource_type = 'progress'
        AND resource_key = 'kb-tts-progress:guide-1'
    `).get(
      '11111111-1111-1111-1111-111111111111',
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    )
    assert.equal(state.tombstone, 1)
    assert.equal(state.revision, 2)

    const longestGuideId = 'g'.repeat(200 - KB_PROGRESS_PREFIX.length)
    assert.equal((await request(`/api/kb/progress/${longestGuideId}`, {
      method: 'PUT',
      body: { sectionIndex: 7, sentenceIndex: 8, title: 'Longest valid guide' },
    })).status, 200)
    assert.equal(
      (await request(`/api/kb/progress/${'g'.repeat(longestGuideId.length + 1)}`, {
        method: 'PUT',
        body: {},
      })).status,
      400,
    )
    assert.equal(
      (await request('/api/kb/progress/bad%20guide', { method: 'PUT', body: {} })).status,
      400,
    )
    const pagedKeys = []
    let cursor = null
    do {
      const page = await body(await request(
        `/api/user-state?limit=1${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
      ))
      pagedKeys.push(...page.resources.map(({ resourceKey }) => resourceKey))
      cursor = page.nextCursor
    } while (cursor)
    assert.equal(pagedKeys.includes(`${KB_PROGRESS_PREFIX}${longestGuideId}`), true)
  })
})

test('user state supports revisions, tombstones, conflicts, and idempotent mutation IDs', async () => {
  await withApp(async ({ request }) => {
    const firstMutation = {
      mutationId: 'mutation-0001',
      expectedRevision: 0,
      value: { answer: 42 },
    }
    const first = await body(await request('/api/user-state/note/alpha', {
      method: 'PUT',
      body: firstMutation,
    }))
    assert.equal(first.revision, 1)
    assert.deepEqual(first.value, { answer: 42 })

    const replay = await body(await request('/api/user-state/note/alpha', {
      method: 'PUT',
      body: firstMutation,
    }))
    assert.deepEqual(replay, first)
    const conflict = await request('/api/user-state/note/alpha', {
      method: 'PUT',
      body: { mutationId: 'mutation-0002', expectedRevision: 0, value: 'late' },
    })
    assert.equal(conflict.status, 409)
    const conflictBody = await body(conflict)
    assert.equal(conflictBody.current.revision, 1)
    assert.deepEqual(conflictBody.current.value, { answer: 42 })
    const afterConflict = await body(await request('/api/user-state/note/alpha'))
    assert.equal(afterConflict.revision, 1)
    assert.deepEqual(afterConflict.value, { answer: 42 })

    const removed = await body(await request('/api/user-state/note/alpha', {
      method: 'DELETE',
      body: { mutationId: 'mutation-0003', expectedRevision: 1 },
    }))
    assert.equal(removed.revision, 2)
    assert.equal(removed.tombstone, true)
    assert.equal(removed.value, null)
    assert.equal((await body(await request('/api/user-state'))).resources.length, 1)
    assert.equal((await request('/api/user-state/note/alpha', { token: 'user-b' })).status, 404)
  })
})

test('user-state sequence snapshot paginates concurrent same-timestamp changes safely', async () => {
  await withApp(async ({ request, db }) => {
    await request('/api/auth/me')
    const insertChange = db.prepare(`
      INSERT INTO user_state_changes(
        tenant_id, oid, resource_type, resource_key, revision,
        value_json, tombstone, mutation_id, updated_at
      ) VALUES (?, ?, ?, ?, 1, '"value"', 0, ?, ?)
    `)
    const insertState = db.prepare(`
      INSERT INTO user_state(
        tenant_id, oid, resource_type, resource_key, revision,
        value_json, tombstone, mutation_id, updated_at, change_sequence
      ) VALUES (?, ?, ?, ?, 1, '"value"', 0, ?, ?, ?)
    `)
    db.transaction(() => {
      for (let index = 0; index < 1_201; index += 1) {
        const key = `key-${String(index).padStart(4, '0')}`
        const values = [
          '11111111-1111-1111-1111-111111111111',
          'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          'progress',
          key,
          `mutation-${String(index).padStart(4, '0')}`,
          '2026-08-28 13:00:00',
        ]
        const change = insertChange.run(...values)
        insertState.run(...values, Number(change.lastInsertRowid))
      }
    })()

    const keys = []
    const values = new Map()
    const first = await body(await request('/api/user-state?limit=500'))
    keys.push(...first.resources.map(({ resourceKey }) => resourceKey))
    for (const state of first.resources) values.set(state.resourceKey, state.value)
    let cursor = first.nextCursor
    assert.equal(typeof cursor, 'string')

    const mutate = async (key, mutationId, expectedRevision, value, token) => {
      const response = await request(`/api/user-state/progress/${key}`, {
        method: 'PUT',
        token,
        body: { mutationId, expectedRevision, value },
      })
      assert.equal(response.status, 200)
    }
    await mutate('key-0001', 'concurrent-earlier-update', 1, 'updated-earlier')
    await mutate('key-1000', 'concurrent-later-update', 1, 'updated-later')
    await mutate('aaa-concurrent', 'concurrent-earlier-insert', 0, 'inserted-earlier')
    await mutate('zzz-concurrent', 'concurrent-later-insert', 0, 'inserted-later')
    await mutate('other-identity', 'other-identity-insert', 0, 'private', 'user-b')

    do {
      const response = await request(
        `/api/user-state?limit=500&cursor=${encodeURIComponent(cursor)}`,
      )
      assert.equal(response.status, 200)
      const page = await body(response)
      keys.push(...page.resources.map(({ resourceKey }) => resourceKey))
      for (const state of page.resources) values.set(state.resourceKey, state.value)
      cursor = page.nextCursor
    } while (cursor)

    assert.equal(keys.length, 1_201)
    assert.equal(new Set(keys).size, 1_201)
    assert.deepEqual(keys, [...keys].sort())
    assert.equal(keys.includes('aaa-concurrent'), false)
    assert.equal(keys.includes('zzz-concurrent'), false)
    assert.equal(values.get('key-0001'), 'value')
    assert.equal(values.get('key-1000'), 'value')

    const nextHydration = []
    cursor = null
    do {
      const page = await body(await request(
        `/api/user-state?limit=500${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
      ))
      nextHydration.push(...page.resources)
      cursor = page.nextCursor
    } while (cursor)
    assert.equal(nextHydration.length, 1_203)
    assert.equal(new Set(nextHydration.map(({ resourceKey }) => resourceKey)).size, 1_203)
    assert.equal(
      nextHydration.find(({ resourceKey }) => resourceKey === 'key-0001').value,
      'updated-earlier',
    )
    assert.equal(
      nextHydration.find(({ resourceKey }) => resourceKey === 'key-1000').value,
      'updated-later',
    )
    assert.equal(
      nextHydration.some(({ resourceKey }) => resourceKey === 'other-identity'),
      false,
    )
    assert.equal((await request('/api/user-state?cursor=not_base64!')).status, 400)
    const invalidRange = Buffer.from(JSON.stringify({ v: 2, s: 10, h: 9 }))
      .toString('base64url')
    assert.equal(
      (await request(`/api/user-state?cursor=${invalidRange}`)).status,
      400,
    )
  })
})

test('readiness returns within its budget while SQLite is exclusively locked', async () => {
  await withApp(async ({ request, root }) => {
    const locker = new Database(join(root, 'lantern.db'))
    try {
      locker.exec('BEGIN EXCLUSIVE')
      const started = performance.now()
      const readinessRequest = request('/api/ready', { headers: { authorization: '' } })
      const liveStarted = performance.now()
      const live = await request('/api/live', { headers: { authorization: '' } })
      assert.equal(live.status, 200)
      assert.ok(performance.now() - liveStarted < 100)
      const response = await readinessRequest
      const elapsedMs = performance.now() - started
      assert.equal(response.status, 503)
      assert.ok(elapsedMs < 250, `readiness took ${elapsedMs}ms`)
    } finally {
      locker.exec('ROLLBACK')
      locker.close()
    }
    assert.equal(
      (await request('/api/ready', { headers: { authorization: '' } })).status,
      200,
    )
  })
})

test('roles and permissions are app-local and settings/audit require admin', async () => {
  await withApp(async ({ request, db }) => {
    await request('/api/auth/me')
    assert.equal((await request('/api/settings/theme', {
      method: 'PUT',
      body: { expectedRevision: 0, value: 'dark' },
    })).status, 403)
    db.prepare(`
      INSERT INTO user_roles(tenant_id, oid, role_name)
      VALUES ('11111111-1111-1111-1111-111111111111',
              'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin')
    `).run()
    const updated = await request('/api/settings/theme', {
      method: 'PUT',
      body: { expectedRevision: 0, value: 'dark' },
    })
    assert.equal(updated.status, 200)
    assert.equal((await body(updated)).revision, 1)
    assert.equal((await request('/api/audit')).status, 200)
  })
})

test('TTS bounds input, escapes SSML, and streams ephemeral audio', async () => {
  let requestBody
  const fetchImpl = async (_url, options) => {
    requestBody = options.body
    return new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]))
        controller.close()
      },
    }), { headers: { 'content-type': 'audio/mpeg', 'content-length': '3' } })
  }
  await withApp(async ({ request, db }) => {
    const response = await request('/api/tts/synthesize', {
      method: 'POST',
      body: { text: '<hello & goodbye>' },
    })
    assert.equal(response.status, 200)
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [1, 2, 3])
    assert.match(requestBody, /&lt;hello &amp; goodbye&gt;/)
    const tables = db.prepare(`
      SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '%audio%'
    `).all()
    assert.deepEqual(tables, [])
  }, { env: { AZURE_SPEECH_KEY: 'test-key' }, fetchImpl })
})

test('TTS aborts Azure work when the response closes prematurely', async () => {
  let startedResolve
  const started = new Promise((resolve) => { startedResolve = resolve })
  let abortedResolve
  const aborted = new Promise((resolve) => { abortedResolve = resolve })
  const fetchImpl = async (_url, options) => {
    startedResolve()
    return new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        abortedResolve(options.signal.reason)
        reject(options.signal.reason)
      }, { once: true })
    })

  }
  await withApp(async ({ base }) => {
    const client = httpRequest(`${base}/api/tts/synthesize`, {
      method: 'POST',
      headers: {
        authorization: 'Bearer user-a',
        'content-type': 'application/json',
      },
    })
    client.on('error', () => {})
    client.end(JSON.stringify({ text: 'disconnect test' }))
    await started
    client.destroy()
    const reason = await Promise.race([
      aborted,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Azure request was not aborted')), 500)),
    ])
    assert.match(reason.message, /Client disconnected/)
  }, { env: { AZURE_SPEECH_KEY: 'test-key' }, fetchImpl })
})

test('TTS upstream timeout ends at headers and does not truncate a slow stream', async () => {
  let upstreamAborted = false
  const fetchImpl = async (_url, options) => new Response(new ReadableStream({
    start(controller) {
      let value = 0
      options.signal.addEventListener('abort', () => {
        upstreamAborted = true
        clearInterval(interval)
        controller.error(options.signal.reason)
      }, { once: true })
      const interval = setInterval(() => {
        controller.enqueue(new Uint8Array([value]))
        value += 1
        if (value === 8) {
          clearInterval(interval)
          controller.close()
        }
      }, 150)
    },
  }), { headers: { 'content-type': 'audio/mpeg' } })

  await withApp(async ({ request }) => {
    const response = await request('/api/tts/synthesize', {
      method: 'POST',
      body: { text: 'slow but valid stream' },
    })
    assert.equal(response.status, 200)
    assert.deepEqual(
      [...new Uint8Array(await response.arrayBuffer())],
      [0, 1, 2, 3, 4, 5, 6, 7],
    )
    assert.equal(upstreamAborted, false)
  }, {
    env: {
      AZURE_SPEECH_KEY: 'test-key',
      AZURE_SPEECH_TIMEOUT_MS: '1000',
      AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS: '250',
      AZURE_SPEECH_STREAM_TIMEOUT_MS: '2000',
    },
    fetchImpl,
  })
})

test('TTS still enforces its timeout before upstream headers', async () => {
  let timedOut = false
  const fetchImpl = async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => {
      timedOut = true
      reject(options.signal.reason)
    }, { once: true })
  })
  await withApp(async ({ request }) => {
    const started = performance.now()
    const response = await request('/api/tts/synthesize', {
      method: 'POST',
      body: { text: 'headers never arrive' },
    })
    assert.equal(response.status, 504)
    assert.equal(timedOut, true)
    assert.ok(performance.now() - started < 1_500)
  }, {
    env: {
      AZURE_SPEECH_KEY: 'test-key',
      AZURE_SPEECH_TIMEOUT_MS: '1000',
    },
    fetchImpl,
  })
})

test('TTS aborts a stalled response body at the idle deadline', async () => {
  let abortReason
  const fetchImpl = async (_url, options) => new Response(new ReadableStream({
    start(controller) {
      options.signal.addEventListener('abort', () => {
        abortReason = options.signal.reason
        controller.error(options.signal.reason)
      }, { once: true })
    },
  }), { headers: { 'content-type': 'audio/mpeg' } })
  await withApp(async ({ request }) => {
    const started = performance.now()
    await assert.rejects(request('/api/tts/synthesize', {
      method: 'POST',
      body: { text: 'stalled stream' },
    }))
    assert.match(abortReason.message, /stream idle timeout/)
    assert.ok(performance.now() - started < 500)
  }, {
    env: {
      AZURE_SPEECH_KEY: 'test-key',
      AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS: '100',
      AZURE_SPEECH_STREAM_TIMEOUT_MS: '1000',
    },
    fetchImpl,
  })
})

test('TTS aborts an endlessly active response body at the overall deadline', async () => {
  let abortReason
  const fetchImpl = async (_url, options) => new Response(new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        controller.enqueue(new Uint8Array([1]))
      }, 30)
      options.signal.addEventListener('abort', () => {
        clearInterval(interval)
        abortReason = options.signal.reason
        controller.error(options.signal.reason)
      }, { once: true })
    },
  }), { headers: { 'content-type': 'audio/mpeg' } })
  await withApp(async ({ request }) => {
    const response = await request('/api/tts/synthesize', {
      method: 'POST',
      body: { text: 'endless stream' },
    })
    assert.equal(response.status, 200)
    await assert.rejects(response.arrayBuffer())
    assert.match(abortReason.message, /stream overall timeout/)
  }, {
    env: {
      AZURE_SPEECH_KEY: 'test-key',
      AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS: '100',
      AZURE_SPEECH_STREAM_TIMEOUT_MS: '250',
    },
    fetchImpl,
  })
})
