import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { after } from 'node:test'
import { openDatabase } from '../../lib/database.js'
import { createReadinessChecker } from '../../lib/readiness-checker.js'
import { createApp } from '../../server/app.js'

const workspaces = []

export function workspace() {
  const base = resolve('data')
  mkdirSync(base, { recursive: true })
  const root = mkdtempSync(join(base, 'backend-test-'))
  workspaces.push(root)
  return root
}

after(() => {
  for (const root of workspaces) rmSync(root, { recursive: true, force: true })
})

export async function withApp(run, {
  identityForToken = (token) => ({
    tenantId: '11111111-1111-1111-1111-111111111111',
    oid: token === 'user-b'
      ? 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
      : 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    displayName: token,
    email: `${token}@example.invalid`,
  }),
  env = {},
  fetchImpl,
  databasePath: suppliedDatabasePath,
  useEnvironmentAuth = false,
} = {}) {
  const root = suppliedDatabasePath
    ? dirname(resolve(suppliedDatabasePath))
    : workspace()
  const databasePath = suppliedDatabasePath
    ? resolve(suppliedDatabasePath)
    : join(root, 'lantern.db')
  const db = openDatabase({ path: databasePath, production: false })
  const readinessChecker = createReadinessChecker({ databasePath })
  const app = createApp({
    db,
    readinessChecker,
    env: { NODE_ENV: 'test', ...env },
    ...(useEnvironmentAuth
      ? {}
      : {
          authConfig: {
            bypass: false,
            tenantId: '11111111-1111-1111-1111-111111111111',
            audience: 'test',
            issuer: 'https://issuer.invalid',
          },
          verifyToken: identityForToken,
        }),
    fetchImpl,
  })
  const server = await new Promise((resolveServer) => {
    const listening = app.listen(0, () => resolveServer(listening))
  })
  const base = `http://127.0.0.1:${server.address().port}`
  const request = (path, {
    token = 'user-a',
    method = 'GET',
    body,
    headers = {},
  } = {}) => fetch(`${base}${path}`, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  try {
    await run({ db, readinessChecker, app, request, root, base })
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose))
    await readinessChecker.close()
    if (db.open) db.close()
  }
}
