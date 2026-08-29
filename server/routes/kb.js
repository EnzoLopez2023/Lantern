import { Router } from 'express'
import { kbProgressResourceKey } from '../../lib/user-state-keys.js'
import { asyncRoute, boundedString, integer } from '../http.js'

function guideId(req) {
  kbProgressResourceKey(req.params.guideId)
  return req.params.guideId
}

export function createKbRouter({ repositories, requireScope }) {
  const router = Router()
  router.get('/api/kb/progress/:guideId', requireScope('kb:read'), asyncRoute(async (req, res) => {
    res.json(await repositories.getKbProgress(req.identity, guideId(req)))
  }))
  router.put('/api/kb/progress/:guideId', requireScope('kb:write'), asyncRoute(async (req, res) => {
    const body = req.body ?? {}
    await repositories.putKbProgress(req.identity, guideId(req), {
      sectionIndex: integer(body.sectionIndex ?? 0, 'sectionIndex', { max: 1_000_000 }),
      sentenceIndex: integer(body.sentenceIndex ?? 0, 'sentenceIndex', { max: 1_000_000 }),
      title: boundedString(body.title ?? '', 'title', { min: 0, max: 500 }),
    })
    res.json({ ok: true })
  }))
  router.delete('/api/kb/progress/:guideId', requireScope('kb:write'), asyncRoute(async (req, res) => {
    await repositories.deleteKbProgress(req.identity, guideId(req))
    res.json({ ok: true })
  }))
  return router
}
