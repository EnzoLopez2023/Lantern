import Database from 'better-sqlite3'
import { parentPort, workerData } from 'node:worker_threads'

let db
try {
  db = new Database(workerData.databasePath, {
    readonly: true,
    fileMustExist: true,
  })
  db.pragma('query_only = ON')
  db.pragma(`busy_timeout = ${workerData.busyTimeoutMs}`)
} catch (error) {
  parentPort.postMessage({ type: 'fatal', error: error.message })
}

if (db) {
  parentPort.on('message', (message) => {
    if (message?.type === 'close') {
      if (db.open) db.close()
      parentPort.close()
      return
    }
    if (message?.type !== 'check') return
    try {
      const schema = db.prepare(`
        SELECT group_concat(name, ',') AS identity
        FROM (SELECT name FROM schema_migrations ORDER BY name)
      `).get()
      const schemaVersion = db.pragma('schema_version', { simple: true })
      db.prepare('SELECT 1 AS ready').get()
      parentPort.postMessage({
        type: 'result',
        id: message.id,
        result: {
          schemaIdentity: schema.identity || 'unversioned',
          schemaVersion,
        },
      })
    } catch (error) {
      parentPort.postMessage({
        type: 'result',
        id: message.id,
        error: error.message,
      })
    }
  })
}
