import { Router } from 'express'
import {
  USER_STATE_SEGMENT_PATTERN,
  validateUserStateSegment,
} from '../../lib/user-state-keys.js'
import { asyncRoute, boundedString, integer } from '../http.js'

function resource(value, name) {
  return validateUserStateSegment(value, name)
}

function encodeCursor(cursor) {
  if (!cursor) return null
  return Buffer.from(JSON.stringify({
    v: 2,
    s: cursor.sequence,
    h: cursor.highWater,
  })).toString('base64url')
}

function decodeCursor(value) {
  if (value == null) return null
  const encoded = boundedString(value, 'cursor', {
    min: 8,
    max: 1_024,
    pattern: /^[A-Za-z0-9_-]+$/,
  })
  try {
    const bytes = Buffer.from(encoded, 'base64url')
    if (bytes.toString('base64url') !== encoded || bytes.length > 768) {
      throw new Error('non-canonical cursor')
    }
    const parsed = JSON.parse(bytes.toString('utf8'))
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      JSON.stringify(Object.keys(parsed).sort()) !== JSON.stringify(['h', 's', 'v']) ||
      parsed.v !== 2 ||
      !Number.isSafeInteger(parsed.s) ||
      !Number.isSafeInteger(parsed.h) ||
      parsed.s < 0 ||
      parsed.h < 0 ||
      parsed.s > parsed.h
    ) {
      throw new Error('invalid cursor shape')
    }
    return {
      sequence: parsed.s,
      highWater: parsed.h,
    }
  } catch {
    const error = new Error('cursor is invalid')
    error.code = 'VALIDATION'
    throw error
  }
}

function mutationBody(req, tombstone) {
  const body = req.body ?? {}
  if (!tombstone && (!Object.hasOwn(body, 'value') || JSON.stringify(body.value) === undefined)) {
    const error = new Error('value must be JSON-serializable')
    error.code = 'VALIDATION'
    throw error
  }
  return {
    resourceType: resource(req.params.resourceType, 'resourceType'),
    resourceKey: resource(req.params.resourceKey, 'resourceKey'),
    mutationId: boundedString(body.mutationId, 'mutationId', {
      min: 8,
      max: 128,
      pattern: USER_STATE_SEGMENT_PATTERN,
    }),
    expectedRevision: integer(body.expectedRevision, 'expectedRevision', { max: 2_147_483_647 }),
    tombstone,
    value: tombstone ? null : body.value,
  }
}

export function createUserStateRouter({ repositories, requireScope }) {
  const router = Router()
  router.get('/api/user-state', requireScope('state:read'), asyncRoute(async (req, res) => {
    const limit = req.query.limit == null
      ? 100
      : integer(Number(req.query.limit), 'limit', { min: 1, max: 500 })
    const page = await repositories.listState(req.identity, {
      cursor: decodeCursor(req.query.cursor),
      limit,
    })
    res.json({ resources: page.resources, nextCursor: encodeCursor(page.next) })
  }))
  router.get(
    '/api/user-state/:resourceType/:resourceKey',
    requireScope('state:read'),
    asyncRoute(async (req, res) => {
      const state = await repositories.getState(
        req.identity,
        resource(req.params.resourceType, 'resourceType'),
        resource(req.params.resourceKey, 'resourceKey'),
      )
      if (!state) return res.status(404).json({ error: 'Resource not found' })
      res.json(state)
    }),
  )
  router.put(
    '/api/user-state/:resourceType/:resourceKey',
    requireScope('state:write'),
    asyncRoute(async (req, res) => {
      res.json(await repositories.mutateState(req.identity, mutationBody(req, false)))
    }),
  )
  router.delete(
    '/api/user-state/:resourceType/:resourceKey',
    requireScope('state:write'),
    asyncRoute(async (req, res) => {
      res.json(await repositories.mutateState(req.identity, mutationBody(req, true)))
    }),
  )
  return router
}
