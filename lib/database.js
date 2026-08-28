import Database from 'better-sqlite3'
import { mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'migrations')
const MIGRATION_NAME = /^\d{3,}[-_].+\.sql$/

export function defaultDatabasePath(env = process.env, root = process.cwd()) {
  if (env.NODE_ENV === 'production') return '/home/data/lantern.db'
  const databasePath = resolve(root, env.DB_PATH || env.LANTERN_DB_PATH || 'data/lantern.db')
  const fromRoot = relative(resolve(root), databasePath)
  if (fromRoot === '..' || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
    throw new Error('Development database must be inside the repository')
  }
  return databasePath
}

function applyMigrations(db, migrationsDir) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  const applied = new Set(
    db.prepare('SELECT name FROM schema_migrations').all().map(({ name }) => name),
  )
  const files = readdirSync(migrationsDir)
    .filter((name) => MIGRATION_NAME.test(name))
    .sort()

  const migrate = db.transaction(() => {
    for (const name of files) {
      if (applied.has(name)) continue
      db.exec(readFileSync(join(migrationsDir, name), 'utf8'))
      db.prepare('INSERT INTO schema_migrations(name) VALUES (?)').run(name)
    }
  })
  migrate()
}

export function openDatabase({
  path = defaultDatabasePath(),
  migrationsDir = MIGRATIONS_DIR,
  production = process.env.NODE_ENV === 'production',
  busyTimeoutMs = 2_000,
} = {}) {
  if (!Number.isSafeInteger(busyTimeoutMs) || busyTimeoutMs < 1 || busyTimeoutMs > 10_000) {
    throw new Error('busyTimeoutMs must be an integer between 1 and 10000')
  }
  if (production && path !== '/home/data/lantern.db') {
    throw new Error('Production database path must be /home/data/lantern.db')
  }

  mkdirSync(dirname(path), { recursive: true })
  const db = new Database(path)
  try {
    const journalMode = db.pragma('journal_mode = DELETE', { simple: true })
    if (journalMode !== 'delete') {
      throw new Error(`SQLite refused DELETE journal mode: ${journalMode}`)
    }
    db.pragma('foreign_keys = ON')
    db.pragma(`busy_timeout = ${busyTimeoutMs}`)
    applyMigrations(db, migrationsDir)
    return db
  } catch (error) {
    db.close()
    throw error
  }
}

export function isDatabaseFile(path) {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

export { MIGRATIONS_DIR }
