import 'dotenv/config'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { authConfiguration, GUID_PATTERN } from '../lib/auth.js'
import {
  defaultDatabasePath,
  openDatabase,
} from '../lib/database.js'
import { createReadinessChecker } from '../lib/readiness-checker.js'
import { createRepositories } from '../lib/repositories.js'
import { createApp } from './app.js'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

function boundedInteger(value, fallback, name, min, max) {
  if (value == null || value === '') return fallback
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`)
  }
  return parsed
}

export function validateEnvironment(env = process.env) {
  if (String(env.LANTERN_PUBLIC_API_BASE_URL ?? '') !== '') {
    throw new Error('LANTERN_PUBLIC_API_BASE_URL must be empty; Lantern is same-origin only')
  }
  if (env.NODE_ENV === 'production') {
    const required = [
      'AZURE_AD_TENANT_ID',
      'AZURE_AD_CLIENT_ID',
      'AZURE_AD_AUDIENCE',
      'AZURE_AD_API_SCOPE',
      'AZURE_AD_DELEGATED_SCOPE',
    ]
    const missing = required.filter((name) => !String(env[name] || '').trim())
    if (missing.length) {
      throw new Error(`Missing required production environment variables: ${missing.join(', ')}`)
    }
  }
  const auth = authConfiguration(env)
  const port = boundedInteger(env.PORT, 3001, 'PORT', 1, 65_535)
  const busyTimeoutMs = boundedInteger(
    env.SQLITE_BUSY_TIMEOUT_MS ?? env.LANTERN_DB_BUSY_TIMEOUT_MS,
    2_000,
    'LANTERN_DB_BUSY_TIMEOUT_MS',
    1,
    10_000,
  )
  const shutdownTimeoutMs = boundedInteger(
    env.SHUTDOWN_DRAIN_TIMEOUT_MS ?? env.LANTERN_SHUTDOWN_TIMEOUT_MS,
    10_000,
    'LANTERN_SHUTDOWN_TIMEOUT_MS',
    1_000,
    60_000,
  )
  boundedInteger(
    env.AZURE_SPEECH_TIMEOUT_MS,
    15_000,
    'AZURE_SPEECH_TIMEOUT_MS',
    1_000,
    60_000,
  )
  const speechStreamIdleTimeoutMs = boundedInteger(
    env.AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS,
    5_000,
    'AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS',
    25,
    60_000,
  )
  const speechStreamTimeoutMs = boundedInteger(
    env.AZURE_SPEECH_STREAM_TIMEOUT_MS,
    60_000,
    'AZURE_SPEECH_STREAM_TIMEOUT_MS',
    50,
    300_000,
  )
  if (speechStreamTimeoutMs <= speechStreamIdleTimeoutMs) {
    throw new Error(
      'AZURE_SPEECH_STREAM_TIMEOUT_MS must exceed AZURE_SPEECH_STREAM_IDLE_TIMEOUT_MS',
    )
  }
  const databasePath = defaultDatabasePath(env, ROOT)
  if (env.NODE_ENV === 'production') {
    if (!existsSync(databasePath)) {
      throw new Error(`Production database does not exist at ${databasePath}`)
    }
    if (!/^[0-9a-f]{40}$/.test(env.BUILD_SHA || '')) {
      throw new Error('BUILD_SHA must be a full lowercase Git SHA in production')
    }
  }
  const bootstrapTenant = env.LANTERN_BOOTSTRAP_ADMIN_TENANT_ID?.toLowerCase()
  const bootstrapOid = env.LANTERN_BOOTSTRAP_ADMIN_OID?.toLowerCase()
  if ((bootstrapTenant || bootstrapOid) && (
    !GUID_PATTERN.test(bootstrapTenant || '') ||
    !GUID_PATTERN.test(bootstrapOid || '')
  )) {
    throw new Error('Both bootstrap administrator IDs must be GUIDs')
  }
  if (bootstrapTenant && bootstrapTenant !== auth.tenantId) {
    throw new Error('Bootstrap administrator tenant must match AZURE_TENANT_ID')
  }
  return {
    auth,
    port,
    busyTimeoutMs,
    shutdownTimeoutMs,
    databasePath,
    bootstrapAdmin: bootstrapTenant ? { tenantId: bootstrapTenant, oid: bootstrapOid } : null,
  }
}

function listen(app, port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port)
    server.once('listening', () => resolve(server))
    server.once('error', reject)
  })
}

export async function bootstrap({ env = process.env } = {}) {
  const config = validateEnvironment(env)
  const db = openDatabase({
    path: config.databasePath,
    production: env.NODE_ENV === 'production',
    busyTimeoutMs: config.busyTimeoutMs,
  })
  let readinessChecker
  const repositories = createRepositories(db)
  try {
    readinessChecker = createReadinessChecker({ databasePath: config.databasePath })
    if (config.bootstrapAdmin) {
      await repositories.ensureBootstrapAdmin(
        config.bootstrapAdmin.tenantId,
        config.bootstrapAdmin.oid,
      )
    }
    const app = createApp({
      db,
      readinessChecker,
      env,
      repositories,
      authConfig: config.auth,
      staticDir: join(ROOT, 'dist'),
    })
    const server = await listen(app, config.port)
    let shuttingDown = false

    const shutdown = (signal = 'shutdown') => {
      if (shuttingDown) return
      shuttingDown = true
      const forceTimer = setTimeout(() => {
        server.closeAllConnections?.()
        void readinessChecker.close()
        if (db.open) db.close()
      }, config.shutdownTimeoutMs)
      forceTimer.unref()
      server.close(() => {
        clearTimeout(forceTimer)
        void readinessChecker.close()
        if (db.open) db.close()
      })
      console.info(`Lantern received ${signal}; draining requests`)
    }
    process.once('SIGTERM', shutdown)
    process.once('SIGINT', shutdown)
    return { app, server, db, readinessChecker, shutdown, config }
  } catch (error) {
    if (readinessChecker) await readinessChecker.close()
    if (db.open) db.close()
    throw error
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  bootstrap().catch((error) => {
    console.error('Lantern failed to start:', error.message)
    process.exitCode = 1
  })
}
