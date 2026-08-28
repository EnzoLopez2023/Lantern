import { Router } from 'express'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { asyncRoute } from '../http.js'

const DEFAULT_VOICE = 'en-US-JennyNeural'
const VOICE_PATTERN = /^[A-Za-z]{2,3}-[A-Za-z]{2,4}-[A-Za-z0-9]+Neural$/
const REGION_PATTERN = /^[a-z0-9-]{2,30}$/
const MAX_AUDIO_BYTES = 16 * 1024 * 1024

export function buildSsml(text, voice) {
  const lang = voice.split('-').slice(0, 2).join('-')
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
  return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'><voice name='${voice}'>${escaped}</voice></speak>`
}

function byteLimit(maximum, controller) {
  let total = 0
  return new Transform({
    transform(chunk, _encoding, callback) {
      total += chunk.length
      if (total > maximum) {
        controller.abort(new Error('Azure TTS response exceeded limit'))
        callback(new Error('Azure TTS response exceeded limit'))
      } else {
        callback(null, chunk)
      }
    },
  })
}

function streamTimeouts(controller, { idleTimeoutMs, timeoutMs }) {
  let idleTimer
  let overallTimer
  let stream
  const fail = (message) => {
    const error = new Error(message)
    controller.abort(error)
    stream.destroy(error)
  }
  const resetIdle = () => {
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(
      () => fail('Azure TTS stream idle timeout'),
      idleTimeoutMs,
    )
    idleTimer.unref()
  }
  const clearTimers = () => {
    if (idleTimer) clearTimeout(idleTimer)
    if (overallTimer) clearTimeout(overallTimer)
    idleTimer = null
    overallTimer = null
  }
  stream = new Transform({
    transform(chunk, _encoding, callback) {
      resetIdle()
      callback(null, chunk)
    },
    destroy(error, callback) {
      clearTimers()
      callback(error)
    },
  })
  resetIdle()
  overallTimer = setTimeout(
    () => fail('Azure TTS stream overall timeout'),
    timeoutMs,
  )
  overallTimer.unref()
  return stream
}

export function createTtsRouter({
  requireScope,
  env = process.env,
  fetchImpl = globalThis.fetch,
  timeoutMs = 15_000,
  streamIdleTimeoutMs = 5_000,
  streamTimeoutMs = 60_000,
} = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 60_000) {
    throw new Error('Azure Speech timeout must be an integer between 1000 and 60000')
  }
  if (
    !Number.isSafeInteger(streamIdleTimeoutMs) ||
    streamIdleTimeoutMs < 25 ||
    streamIdleTimeoutMs > 60_000
  ) {
    throw new Error('Azure Speech stream idle timeout must be between 25 and 60000')
  }
  if (
    !Number.isSafeInteger(streamTimeoutMs) ||
    streamTimeoutMs < 50 ||
    streamTimeoutMs > 300_000 ||
    streamTimeoutMs <= streamIdleTimeoutMs
  ) {
    throw new Error(
      'Azure Speech stream timeout must be between 50 and 300000 and exceed idle timeout',
    )
  }
  const router = Router()
  router.post('/api/tts/synthesize', requireScope('tts:use'), asyncRoute(async (req, res) => {
    const key = env.AZURE_SPEECH_KEY
    if (!key) return res.status(503).json({ error: 'TTS not configured' })
    const region = env.AZURE_SPEECH_REGION || 'eastus'
    const text = req.body?.text
    const voice = req.body?.voice || env.AZURE_SPEECH_VOICE || DEFAULT_VOICE
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text is required' })
    }
    if (text.length > 10_000) return res.status(400).json({ error: 'text too long' })
    if (!VOICE_PATTERN.test(voice)) return res.status(400).json({ error: 'invalid voice' })
    if (!REGION_PATTERN.test(region)) throw new Error('Invalid Azure Speech region configuration')

    const controller = new AbortController()
    let timeout = setTimeout(() => controller.abort(new Error('Azure TTS timeout')), timeoutMs)
    timeout.unref()
    let clientDisconnected = false
    const disconnect = () => {
      if (!res.writableFinished) {
        clientDisconnected = true
        controller.abort(new Error('Client disconnected'))
      }
    }
    req.once('aborted', disconnect)
    res.once('close', disconnect)
    try {
      const response = await fetchImpl(
        `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
            'User-Agent': 'Lantern/1.0',
          },
          body: buildSsml(text.trim(), voice),
          signal: controller.signal,
        },
      )
      clearTimeout(timeout)
      timeout = null
      if (!response.ok) {
        await response.body?.cancel().catch(() => {})
        return res.status(response.status >= 400 && response.status <= 599 ? response.status : 502)
          .json({ error: 'Azure TTS request failed' })
      }
      if (!response.body) throw new Error('Azure TTS returned no audio')
      const length = Number(response.headers.get('content-length'))
      if (Number.isFinite(length) && length > MAX_AUDIO_BYTES) {
        await response.body.cancel()
        return res.status(502).json({ error: 'Azure TTS response too large' })
      }
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.toLowerCase().startsWith('audio/')) {
        await response.body.cancel()
        return res.status(502).json({ error: 'Azure TTS returned invalid content' })
      }
      res.status(200)
      res.set('Content-Type', 'audio/mpeg')
      res.set('Cache-Control', 'no-store')
      try {
        await pipeline(
          Readable.fromWeb(response.body),
          streamTimeouts(controller, {
            idleTimeoutMs: streamIdleTimeoutMs,
            timeoutMs: streamTimeoutMs,
          }),
          byteLimit(MAX_AUDIO_BYTES, controller),
          res,
        )
      } catch (error) {
        if (res.headersSent) {
          res.destroy(error)
          return
        }
        throw error
      }
    } catch (error) {
      if (controller.signal.aborted && clientDisconnected) return
      if (
        controller.signal.aborted &&
        controller.signal.reason?.message === 'Azure TTS timeout' &&
        !res.headersSent
      ) {
        return res.status(504).json({ error: 'Azure TTS request timed out' })
      }
      if (
        controller.signal.aborted &&
        /^Azure TTS stream (idle|overall) timeout$/.test(
          controller.signal.reason?.message ?? '',
        ) &&
        !res.headersSent
      ) {
        return res.status(504).json({ error: 'Azure TTS response timed out' })
      }
      throw error
    } finally {
      if (timeout) clearTimeout(timeout)
      req.off('aborted', disconnect)
      res.off('close', disconnect)
    }
  }))
  return router
}
