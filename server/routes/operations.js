import { Router } from 'express'
import { GUID_PATTERN } from '../../lib/auth.js'
import { asyncRoute, boundedString, integer } from '../http.js'

const SETTING_KEY = /^[A-Za-z0-9][A-Za-z0-9._-]*$/

export function createOperationsRouter({ repositories, requireScope }) {
  const router = Router()
  router.get('/api/auth/me', asyncRoute(async (req, res) => {
    res.json(req.localUser)
  }))

  router.get('/api/settings', requireScope('settings:read'), asyncRoute(async (_req, res) => {
    res.json({ settings: await repositories.listSettings() })
  }))
  router.put('/api/settings/:key', requireScope('settings:write'), asyncRoute(async (req, res) => {
    const key = boundedString(req.params.key, 'setting key', { max: 100, pattern: SETTING_KEY })
    if (!Object.hasOwn(req.body ?? {}, 'value') || JSON.stringify(req.body.value) === undefined) {
      const error = new Error('value must be JSON-serializable')
      error.code = 'VALIDATION'
      throw error
    }
    const expectedRevision = integer(
      req.body?.expectedRevision,
      'expectedRevision',
      { max: 2_147_483_647 },
    )
    res.json(await repositories.putSetting(req.identity, key, req.body?.value, expectedRevision))
  }))

  router.get('/api/admin/users', requireScope('admin:users'), asyncRoute(async (_req, res) => {
    res.json({ users: await repositories.listUsers() })
  }))
  router.get('/api/admin/roles', requireScope('admin:users'), asyncRoute(async (_req, res) => {
    res.json({ roles: await repositories.listRoles() })
  }))
  router.put(
    '/api/admin/users/:tenantId/:oid/roles',
    requireScope('admin:users'),
    asyncRoute(async (req, res) => {
      const tenantId = req.params.tenantId.toLowerCase()
      const oid = req.params.oid.toLowerCase()
      if (!GUID_PATTERN.test(tenantId) || !GUID_PATTERN.test(oid)) {
        const error = new Error('tenantId and oid must be GUIDs')
        error.code = 'VALIDATION'
        throw error
      }
      if (!Array.isArray(req.body?.roles) || req.body.roles.length > 20) {
        const error = new Error('roles must be an array with at most 20 entries')
        error.code = 'VALIDATION'
        throw error
      }
      const roles = req.body.roles.map((name) =>
        boundedString(name, 'role name', { max: 100, pattern: SETTING_KEY }))
      res.json(await repositories.setUserRoles(req.identity, { tenantId, oid }, roles))
    }),
  )

  router.get('/api/audit', requireScope('audit:read'), asyncRoute(async (req, res) => {
    const limit = req.query.limit == null
      ? 100
      : integer(Number(req.query.limit), 'limit', { min: 1, max: 500 })
    const beforeId = req.query.beforeId == null
      ? Number.MAX_SAFE_INTEGER
      : integer(Number(req.query.beforeId), 'beforeId', { min: 1 })
    res.json({ events: await repositories.listAudit({ limit, beforeId }) })
  }))
  return router
}
