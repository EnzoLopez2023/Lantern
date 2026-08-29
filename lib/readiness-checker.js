import { Worker } from 'node:worker_threads'

export function createReadinessChecker({
  databasePath,
  deadlineMs = 200,
  busyTimeoutMs = 50,
} = {}) {
  if (!databasePath) throw new Error('Readiness checker requires databasePath')
  if (!Number.isSafeInteger(deadlineMs) || deadlineMs < 25 || deadlineMs > 1_000) {
    throw new Error('Readiness deadline must be an integer between 25 and 1000')
  }
  if (!Number.isSafeInteger(busyTimeoutMs) ||
      busyTimeoutMs < 1 ||
      busyTimeoutMs >= deadlineMs) {
    throw new Error('Readiness busy timeout must be shorter than its deadline')
  }

  const worker = new Worker(new URL('../server/readiness-worker.js', import.meta.url), {
    workerData: { databasePath, busyTimeoutMs },
  })
  const pending = new Map()
  let nextId = 1
  let closed = false
  let fatalError = null

  function rejectPending(error) {
    for (const request of pending.values()) {
      clearTimeout(request.timer)
      request.reject(error)
    }
    pending.clear()
  }

  worker.on('message', (message) => {
    if (message?.type === 'fatal') {
      fatalError = new Error(`Readiness worker failed: ${message.error}`)
      rejectPending(fatalError)
      return
    }
    if (message?.type !== 'result') return
    const request = pending.get(message.id)
    if (!request) return
    pending.delete(message.id)
    clearTimeout(request.timer)
    if (message.error) request.reject(new Error(message.error))
    else request.resolve(message.result)
  })
  worker.on('error', (error) => {
    fatalError = error
    rejectPending(error)
  })
  worker.on('exit', (code) => {
    if (!closed && code !== 0) {
      fatalError = new Error(`Readiness worker exited with code ${code}`)
      rejectPending(fatalError)
    }
  })

  return {
    deadlineMs,
    async check() {
      if (closed) throw new Error('Readiness checker is closed')
      if (fatalError) throw fatalError
      const id = nextId++
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id)
          reject(new Error('Readiness check deadline exceeded'))
        }, deadlineMs)
        timer.unref()
        pending.set(id, { resolve, reject, timer })
        worker.postMessage({ type: 'check', id })
      })
    },
    async close() {
      if (closed) return
      closed = true
      rejectPending(new Error('Readiness checker is closed'))
      worker.postMessage({ type: 'close' })
      await worker.terminate()
    },
  }
}
