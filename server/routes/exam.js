import { Router } from 'express'
import { asyncRoute, boundedString, integer } from '../http.js'

function optionalInteger(value, name, options) {
  return value == null ? null : integer(value, name, options)
}

function examPayload(body = {}) {
  const mode = body.mode ?? 'full'
  if (mode !== 'full' && mode !== 'practice') {
    const error = new Error('mode must be full or practice')
    error.code = 'VALIDATION'
    throw error
  }
  const inputResults = body.results ?? []
  if (!Array.isArray(inputResults) || inputResults.length > 1_000) {
    const error = new Error('results must be an array with at most 1000 entries')
    error.code = 'VALIDATION'
    throw error
  }
  const results = inputResults.map((result, index) => {
    if (!Object.hasOwn(result ?? {}, 'selected')) {
      const error = new Error(`results[${index}].selected is required`)
      error.code = 'VALIDATION'
      throw error
    }
    const serialized = JSON.stringify(result.selected)
    if (serialized === undefined || serialized.length > 10_000) {
      const error = new Error(`results[${index}].selected is invalid`)
      error.code = 'VALIDATION'
      throw error
    }
    return {
      questionId: boundedString(result.questionId, `results[${index}].questionId`, { max: 200 }),
      selected: result.selected,
      correct: result.correct === true,
    }
  })
  return {
    mode,
    score: integer(body.score, 'score', { min: 0, max: 1_000_000 }),
    totalQuestions: integer(body.totalQuestions, 'totalQuestions', { max: 1_000_000 }),
    correctCount: integer(body.correctCount, 'correctCount', { max: 1_000_000 }),
    domain1Score: integer(body.domain1Score ?? 0, 'domain1Score', { max: 1_000_000 }),
    domain1Total: integer(body.domain1Total ?? 0, 'domain1Total', { max: 1_000_000 }),
    domain2Score: integer(body.domain2Score ?? 0, 'domain2Score', { max: 1_000_000 }),
    domain2Total: integer(body.domain2Total ?? 0, 'domain2Total', { max: 1_000_000 }),
    passed: body.passed === true,
    timeSpentSec: optionalInteger(body.timeSpentSec, 'timeSpentSec', { max: 31_536_000 }),
    results,
  }
}

export function createExamRouter({ repositories, requireScope }) {
  const router = Router()

  router.get('/api/exam-prep/attempts', requireScope('exam:read'), asyncRoute(async (req, res) => {
    res.json(await repositories.listAttempts(req.identity))
  }))

  router.get('/api/exam-prep/attempts/:id', requireScope('exam:read'), asyncRoute(async (req, res) => {
    const id = Number(req.params.id)
    integer(id, 'attempt id', { min: 1 })
    const attempt = await repositories.getAttempt(req.identity, id)
    if (!attempt) return res.status(404).json({ error: 'Attempt not found' })
    res.json(attempt)
  }))

  router.post('/api/exam-prep/attempts', requireScope('exam:write'), asyncRoute(async (req, res) => {
    const result = await repositories.createAttempt(req.identity, examPayload(req.body))
    res.status(201).json(result)
  }))

  router.get('/api/exam-prep/stats', requireScope('exam:read'), asyncRoute(async (req, res) => {
    res.json(await repositories.getExamStats(req.identity))
  }))

  router.delete('/api/exam-prep/attempts/:id', requireScope('exam:write'), asyncRoute(async (req, res) => {
    const id = Number(req.params.id)
    integer(id, 'attempt id', { min: 1 })
    if (!await repositories.deleteAttempt(req.identity, id)) {
      return res.status(404).json({ error: 'Attempt not found' })
    }
    res.json({ success: true })
  }))

  return router
}
