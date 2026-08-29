import express from 'express'
import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createAuth, authConfiguration, GUID_PATTERN } from '../lib/auth.js'
import { createRepositories } from '../lib/repositories.js'
import { createExamRouter } from './routes/exam.js'
import { createKbRouter } from './routes/kb.js'
import { createOperationsRouter } from './routes/operations.js'
import { createTtsRouter } from './routes/tts.js'
import { createUserStateRouter } from './routes/user-state.js'

const PROCESS_INSTANCE_ID = randomUUID()
const RELEASE = JSON.parse(readFileSync(new URL('../version.json', import.meta.url), 'utf8'))

function versionPayload(env) {
  return Object.freeze({
    app: RELEASE.app,
    version: env.LANTERN_VERSION || env.npm_package_version || RELEASE.version,
    commit: env.BUILD_SHA || 'local-development',
    buildId: env.BUILD_ID || 'local-development',
    environment: env.NODE_ENV || 'development',
    instanceId: env.LANTERN_PROCESS_INSTANCE_ID || PROCESS_INSTANCE_ID,
    source: RELEASE.source,
  })
}

function safeJavaScriptJson(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`)
}

export function createRuntimeConfig(env = process.env) {
  if (String(env.LANTERN_PUBLIC_API_BASE_URL ?? '') !== '') {
    throw new Error('LANTERN_PUBLIC_API_BASE_URL must be empty; Lantern is same-origin only')
  }
  const allowDevAuth =
    env.NODE_ENV === 'development' &&
    env.ALLOW_DEV_AUTH === 'true'
  if (allowDevAuth && (
    !GUID_PATTERN.test(env.DEV_AUTH_TENANT_ID || '') ||
    !GUID_PATTERN.test(env.DEV_AUTH_OID || '')
  )) {
    throw new Error('Development runtime auth requires GUID DEV_AUTH_TENANT_ID and DEV_AUTH_OID')
  }
  return {
    tenantId: env.AZURE_AD_TENANT_ID || '',
    clientId: env.AZURE_AD_CLIENT_ID || '',
    apiScope: env.AZURE_AD_API_SCOPE || '',
    apiBaseUrl: '',
    allowDevAuth,
    devTenantId: allowDevAuth ? env.DEV_AUTH_TENANT_ID.toLowerCase() : null,
    devOid: allowDevAuth ? env.DEV_AUTH_OID.toLowerCase() : null,
  }
}

export function createApp({
  db,
  readinessChecker,
  env = process.env,
  repositories = createRepositories(db),
  authConfig = authConfiguration(env),
  verifyToken,
  fetchImpl = globalThis.fetch,
  staticDir,
} = {}) {
  if (!db) throw new Error('createApp requires a database handle')
  if (!readinessChecker) throw new Error('createApp requires a readiness checker')
  const app = express()
  const metadata = versionPayload(env)
  const publicRuntimeConfig = createRuntimeConfig(env)
  const auth = createAuth({ repositories, config: authConfig, verifyToken })

  app.disable('x-powered-by')
  app.use((_req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
    })
    next()
  })
  app.options('/{*path}', (_req, res) => res.sendStatus(405))
  app.get('/api/live', (_req, res) => {
    res.set('Cache-Control', 'no-store')
    res.json({
      status: 'live',
      instanceId: metadata.instanceId,
      uptimeSeconds: Math.floor(process.uptime()),
    })
  })
  app.get('/api/ready', async (_req, res) => {
    res.set('Cache-Control', 'no-store')
    const started = performance.now()
    try {
      if (!db.open) throw new Error('database closed')
      const schema = await readinessChecker.check()
      const elapsedMs = performance.now() - started
      if (elapsedMs > readinessChecker.deadlineMs) {
        throw new Error('database readiness deadline exceeded')
      }
      res.json({
        status: 'ready',
        database: {
          authority: 'sqlite',
          journalMode: 'delete',
          schemaIdentity: schema.schemaIdentity,
        },
        lifecycle: 'running',
        workers: [],
        build: metadata,
      })
    } catch {
      res.status(503).json({ status: 'not_ready', database: 'unavailable' })
    }
  })
  app.get(['/api/version', '/version.json'], (_req, res) => {
    res.set('Cache-Control', 'no-store')
    res.json(metadata)
  })
  app.get('/runtime-config.js', (_req, res) => {
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/javascript; charset=utf-8',
    })
    res.send(
      `window.__LANTERN_RUNTIME_CONFIG__=${safeJavaScriptJson(publicRuntimeConfig)};\n`,
    )
  })

  app.use(express.json({ limit: '64kb', strict: true }))
  app.use('/api', auth.authenticate)
  app.use(createOperationsRouter({ repositories, requireScope: auth.requireScope }))
  app.use(createExamRouter({ repositories, requireScope: auth.requireScope }))
  app.use(createKbRouter({ repositories, requireScope: auth.requireScope }))
  app.use(createUserStateRouter({ repositories, requireScope: auth.requireScope }))
  app.use(createTtsRouter({
    requireScope: auth.requireScope,
    env,
    fetchImpl,
    timeoutMs: Number(env.AZURE_SPEECH_TIMEOUT_MS ?? 15_000),
    streamIdleTimeoutMs: Number(env.AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS ?? 5_000),
    streamTimeoutMs: Number(env.AZURE_SPEECH_STREAM_TIMEOUT_MS ?? 60_000),
  }))

  app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }))

  if (staticDir) {
    const absoluteStaticDir = resolve(staticDir)
    app.use(express.static(absoluteStaticDir, {
      index: false,
      fallthrough: true,
      maxAge: env.NODE_ENV === 'production' ? '1h' : 0,
    }))
    const index = join(absoluteStaticDir, 'index.html')
    if (existsSync(index)) {
      app.get('/{*path}', (req, res, next) => {
        if (!req.accepts('html')) return next()
        res.sendFile(index)
      })
    }
  }

  app.use((error, _req, res, _next) => {
    if (res.headersSent) return res.end()
    if (error?.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Request body too large' })
    }
    if (error?.code === 'VALIDATION') return res.status(400).json({ error: error.message })
    if (error?.code === 'NOT_FOUND') return res.status(404).json({ error: error.message })
    if (error?.code === 'CONFLICT') {
      return res.status(409).json({
        error: error.message,
        ...(Object.hasOwn(error, 'current') ? { current: error.current } : {}),
        ...(Object.hasOwn(error, 'currentRevision')
          ? { currentRevision: error.currentRevision }
          : {}),
      })
    }
    if (error?.code === 'SQLITE_BUSY' || error?.code === 'SQLITE_LOCKED') {
      return res.status(503).json({ error: 'Database temporarily unavailable' })
    }
    console.error('Unhandled Lantern request error:', error)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
