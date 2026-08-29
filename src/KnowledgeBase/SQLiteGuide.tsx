import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'WAL + Foreign Keys',                 icon: '🗂️' },
  { id: 's3',  num: '3',  title: 'better-sqlite3 API',                 icon: '⚙️' },
  { id: 's4',  num: '4',  title: 'Prepared Statements',                icon: '📋' },
  { id: 's5',  num: '5',  title: 'Idempotent Schema',                  icon: '🌱' },
  { id: 's6',  num: '6',  title: 'Migrations Without a Framework',     icon: '🔄' },
  { id: 's7',  num: '7',  title: 'Transactions',                       icon: '🔐' },
  { id: 's8',  num: '8',  title: 'BLOBs vs Disk',                      icon: '🖼️' },
  { id: 's9',  num: '9',  title: 'Triggers + FK CASCADE',              icon: '🔗' },
  { id: 's10', num: '10', title: 'Backups (Online Backup API)',        icon: '💾' },
  { id: 's11', num: '★',  title: 'Lab: Build a Schema',                icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                    icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                        icon: '📋' },
];

function CodePre({ children }: { children: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const text = preRef.current?.innerText.replace(/^Copy\n?/, '') ?? '';
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <pre ref={preRef}>
      <button className="copy-btn" type="button" onClick={copy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {children}
    </pre>
  );
}

export default function SQLiteGuide() {
  const { readSections, currentSection, setRef, pct } = useGuideProgress(
    SECTIONS.map(s => s.id)
  );

  const { query, setQuery, filtered: filteredSections } = useGuideSearch(SECTIONS);

  return (
    <div className="kb-warm-guide">
      <aside id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#5C2A4A" />
              <path d="M14 5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L6.5 11.2l5.9-.9L14 5z" fill="white" opacity="0.9" />
            </svg>
            <span className="sidebar-title">SQLite + better-sqlite3</span>
          </div>
          <div className="sidebar-sub">a file is your database</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-label">
            {readSections.size} of {SECTIONS.length} sections read
          </div>
        </div>
        <div className="sidebar-search-wrap">
          <input
            type="search"
            className="sidebar-search"
            placeholder="Search this guide…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="sidebar-search-meta">
            {query ? `${filteredSections.length} of ${SECTIONS.length} sections match` : ''}
          </div>
        </div>
        <nav>
          <div>
            {query && filteredSections.length === 0 ? (
              <div className="nav-empty">No matches</div>
            ) : (
              filteredSections.map(s => (
                <a key={s.id} href={`#${s.id}`} className={`nav-item${readSections.has(s.id) ? ' done' : ''}${currentSection === s.id ? ' active' : ''}`}>
                  <span className="nav-num">{s.num}</span>
                  {s.icon} {s.title}
                </a>
              ))
            )}
          </div>
        </nav>
      </aside>

      <main>
        <div className="hero">
          <div className="hero-tag">🗄️ SQLite 3 · better-sqlite3 11/12 · 2026</div>
          <h1>SQLite + better-sqlite3<br />Mastery</h1>
          <p>
            Eight of ten fleet apps use SQLite via <strong style={{ color: '#C77AA0' }}>better-sqlite3</strong> — the
            synchronous, native-binding driver that's the fastest way to talk to SQLite from Node. (PulseWire is on
            Postgres; sovereign-tactics has no backend.) This guide covers WAL
            mode, prepared statements, idempotent schema, migrations without a framework, transactions, BLOBs vs disk,
            and the online backup API. Every snippet is real code from <code>SecretApp</code>, <code>Tabloom</code>,
            <code>Workshop</code>, <code>ShopKeep</code>, or <code>Puzzlebox</code>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">7/8</span><span className="hero-stat-label">Apps on SQLite</span></div>
            <div className="hero-stat"><span className="hero-stat-val">17</span><span className="hero-stat-label">Hearth Tables</span></div>
            <div className="hero-stat"><span className="hero-stat-val">WAL</span><span className="hero-stat-label">Journal Mode</span></div>
            <div className="hero-stat"><span className="hero-stat-val">14d</span><span className="hero-stat-label">Rolling Backup</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            SQLite is a <em>file</em>. There is no server, no daemon, no network connection. Your <code>.db</code> file is
            the entire database — schema, data, indexes, the lot. Reads and writes go through your process directly via
            the SQLite C library, which <code>better-sqlite3</code> wraps with Node bindings.
          </p>

          <h3>Three analogies that explain it</h3>
          <p>
            <strong>A spreadsheet you can query.</strong> If Excel were ACID, that's SQLite. Same single-file storage,
            same instant-open, but with real joins, indexes, transactions, and crash safety.
          </p>
          <p>
            <strong>Memory-mapped persistence.</strong> SQLite is closer to a really good <code>HashMap</code> with disk
            backing than to PostgreSQL. There's no "connection cost" to amortize.
          </p>
          <p>
            <strong>Embedded library, not a service.</strong> Like Redis-the-library vs Redis-the-server.
            <code>better-sqlite3</code> calls into native code on the same OS process as your Express server. There's no
            client/server protocol to worry about.
          </p>

          <h3>What SQLite is great at</h3>
          <ul>
            <li><strong>Personal/small-team apps.</strong> Seven of eight fleet apps. ~10k rows in the busiest table; ms-scale queries on every endpoint.</li>
            <li><strong>Embedded scenarios.</strong> Phones, browsers (IndexedDB is built on it), iOS/Android, every desktop app you've ever used.</li>
            <li><strong>Backup as a file copy.</strong> <code>cp app.db backup.db</code> works (with caveats — see §10).</li>
            <li><strong>Cross-OS portability.</strong> Same file on Windows, Mac, Linux, ARM, x86.</li>
          </ul>

          <h3>What it's not great at</h3>
          <ul>
            <li><strong>High concurrent writers.</strong> One writer at a time (the database lock). Many readers can proceed in parallel under WAL.</li>
            <li><strong>Network-attached storage.</strong> NFS, SMB — known SQLite footguns. Always local-disk.</li>
            <li><strong>Sharding.</strong> Not built in. If you outgrow a single file, you're outgrowing SQLite.</li>
            <li><strong>Pure analytics warehouses.</strong> Postgres + pgvector (PulseWire) wins for vector search at scale.</li>
          </ul>

          <h3>Why <code>better-sqlite3</code>, not <code>sqlite3</code></h3>
          <table>
            <tbody>
              <tr><th></th><th><code>sqlite3</code> (older)</th><th><code>better-sqlite3</code> (fleet pick)</th></tr>
              <tr><td>API</td><td>Async (callback / Promise)</td><td>Synchronous</td></tr>
              <tr><td>Bindings</td><td>JS layer over C</td><td>Native C++ Node addon</td></tr>
              <tr><td>Speed</td><td>~10x slower per query (event-loop dance)</td><td>Direct C call</td></tr>
              <tr><td>Mental model</td><td>"DB call yields, then resumes"</td><td>"DB call returns like any function"</td></tr>
              <tr><td>Transactions</td><td>Async-aware (more complex)</td><td>Just JS — atomic by definition</td></tr>
            </tbody>
          </table>

          <p>
            The intuition: in a single-process app, the I/O wait of a SQLite query is so short (microseconds) that the
            async ceremony is pure overhead. <code>better-sqlite3</code> just runs the query inline.
          </p>

          <h3>Versions in the fleet</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>better-sqlite3</th></tr>
              <tr><td>SecretApp (Hearth)</td><td>11.10.0</td></tr>
              <tr><td>Cairn</td><td>11.10.0</td></tr>
              <tr><td>GLP1</td><td>12.9.0</td></tr>
              <tr><td>ShopKeep</td><td>12.8.0</td></tr>
              <tr><td>SecretPhoto</td><td>12.8.0</td></tr>
              <tr><td>Puzzlebox</td><td>12.8.0</td></tr>
              <tr><td>Tabloom</td><td>12.10.0</td></tr>
              <tr><td>Workshop</td><td>12.8.0</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 2 — WAL + FK */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>WAL + Foreign Keys — The Two Pragmas Every App Sets</h2>
          <p>SQLite ships with defaults from 2004. Two pragmas modernize it. Every fleet app sets both, right after opening the DB.</p>

          <h3>The pattern</h3>
          <CodePre>{`// SecretApp/lib/db.js — verbatim, lines 17-19
const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')`}</CodePre>

          <h3>WAL — Write-Ahead Logging</h3>
          <p>
            By default, SQLite uses "rollback journal" mode: to commit a write, it locks the entire DB file, writes the
            change, syncs to disk, releases the lock. Readers wait for the lock. Slow under any concurrency.
          </p>
          <p>WAL flips this: writes go to a separate <code>.db-wal</code> file. Readers continue from the main file without seeing the in-flight changes. The WAL file is merged back into the main DB periodically (checkpointing).</p>

          <MermaidDiagram theme="default" chart={`graph LR
  subgraph "Rollback journal (default)"
    R1[Reader] -->|waits| DB1[(app.db)]
    W1[Writer] -->|locks| DB1
  end
  subgraph "WAL mode"
    R2[Reader] -->|reads| DB2[(app.db)]
    R3[Reader] -->|reads| DB2
    W2[Writer] -->|appends| WAL[(app.db-wal)]
    WAL -.->|checkpoint| DB2
  end`} />

          <h3>What WAL changes for your app</h3>
          <ul>
            <li><strong>Multiple readers + one writer concurrently.</strong> SELECTs never block on INSERTs.</li>
            <li><strong>Three files instead of one.</strong> <code>app.db</code>, <code>app.db-wal</code>, <code>app.db-shm</code>. Back up all three together (see §10) or use the online backup API.</li>
            <li><strong>Faster writes.</strong> Appends to WAL, not random writes into the main file.</li>
            <li><strong>Persists across restarts.</strong> WAL mode is a property of the file. Once set, it stays.</li>
          </ul>

          <h3>Foreign keys</h3>
          <p>SQLite ships with foreign key constraints disabled. They're <em>declared</em> in your schema (the SQL parser accepts them), but not <em>enforced</em> unless you flip the pragma. Every fleet app turns them on. Without it:</p>
          <ul>
            <li><code>DELETE FROM recipes</code> doesn't cascade to <code>recipe_ingredients</code>.</li>
            <li>You can insert a <code>recipe_id</code> that doesn't exist in <code>recipes</code>.</li>
            <li>Your data integrity model exists on paper, not in reality.</li>
          </ul>

          <h3>Other pragmas worth knowing</h3>
          <CodePre>{`db.pragma('foreign_keys = ON')                    // enforce FK constraints (REQUIRED)
db.pragma('journal_mode = WAL')                    // write-ahead logging (REQUIRED)
db.pragma('synchronous = NORMAL')                   // WAL-default; safe + fast
db.pragma('temp_store = MEMORY')                    // tmp tables in RAM (small perf win)
db.pragma('busy_timeout = 5000')                    // wait 5s before giving up on lock contention
db.pragma('mmap_size = 268435456')                  // 256MB mmap window (read perf)
db.pragma('cache_size = -16000')                    // 16MB page cache (negative = KB)`}</CodePre>

          <p>The first two are mandatory; the rest are situational. Fleet apps stick with the first two and trust the defaults for the rest.</p>

          <h3>Verifying it stuck</h3>
          <CodePre>{`> sqlite3 app.db "PRAGMA journal_mode; PRAGMA foreign_keys;"
wal
1`}</CodePre>

          <p>"wal" and "1" means it's set. If you see "delete" or "0", your code didn't apply the pragmas (common cause: opening with <code>readonly: true</code>, which can't change pragmas).</p>
        </section>

        <hr />

        {/* SECTION 3 — API */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The better-sqlite3 API in 10 Methods</h2>
          <p>You'll use these five hundred times each. Memorize them.</p>

          <h3>Opening</h3>
          <CodePre>{`import Database from 'better-sqlite3'

const db = new Database('app.db')          // open or create
const db2 = new Database('app.db', { readonly: true })
const db3 = new Database(':memory:')        // in-memory (lost on close)`}</CodePre>

          <h3>Statements</h3>
          <CodePre>{`// 1. db.prepare(sql) — compile a statement once, reuse
const insertRecipe = db.prepare('INSERT INTO recipes (title) VALUES (?)')

// 2. stmt.run(...params) — for INSERT/UPDATE/DELETE
const info = insertRecipe.run('Chicken Tikka')
// info = { changes: 1, lastInsertRowid: 42n }

// 3. stmt.get(...params) — return first row or undefined
const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(42)
// recipe = { id: 42, title: 'Chicken Tikka', ... } | undefined

// 4. stmt.all(...params) — return all rows as array
const recipes = db.prepare('SELECT * FROM recipes WHERE rating > ?').all(4)
// recipes = [ {...}, {...}, ... ]

// 5. stmt.iterate(...params) — yield rows one at a time (memory-friendly)
for (const row of db.prepare('SELECT * FROM big_table').iterate()) {
  process(row)
}`}</CodePre>

          <h3>Raw exec (no parameters)</h3>
          <CodePre>{`// db.exec(sql) — for DDL, multiple statements separated by ;
db.exec(\`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);
\`)`}</CodePre>

          <h3>Transactions</h3>
          <CodePre>{`// db.transaction(fn) — atomic; rolls back on throw
const insertBatch = db.transaction((items) => {
  for (const item of items) {
    insertRecipe.run(item.title)
  }
})
insertBatch(items)  // ← all rows commit together or none do`}</CodePre>

          <h3>Pragmas</h3>
          <CodePre>{`db.pragma('foreign_keys = ON')           // set
const mode = db.pragma('journal_mode')   // read (returns array of rows)`}</CodePre>

          <h3>Misc</h3>
          <CodePre>{`db.close()                                // close (rare — keep open for app lifetime)
db.inTransaction                          // true if currently in a transaction
db.name                                   // file path
db.open                                   // boolean: is the connection open
db.readonly                               // boolean
db.memory                                 // boolean (:memory: db)
db.backup('snapshot.db')                  // online backup (see §10)`}</CodePre>

          <h3>Parameter binding styles</h3>
          <CodePre>{`// 1. Positional ? placeholders
db.prepare('SELECT * FROM x WHERE a = ? AND b = ?').get(1, 'foo')

// 2. Named :param placeholders
db.prepare('SELECT * FROM x WHERE a = :a AND b = :b').get({ a: 1, b: 'foo' })

// 3. Named $param (legacy SQLite syntax)
db.prepare('SELECT * FROM x WHERE a = $a').get({ a: 1 })`}</CodePre>

          <p>Tabloom uses named params for clarity in long INSERTs (it has 25-field rows). Most fleet code uses positional <code>?</code> for brevity.</p>

          <div className="alert bad">
            <span className="alert-icon">🚫</span>
            <div>
              <strong>Never interpolate values into SQL strings.</strong> <code>{'db.prepare(`SELECT * FROM x WHERE id = ${id}`)'}</code> is SQL injection waiting to happen. Always use parameter binding — it's faster AND safer.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 4 — PREPARED STATEMENTS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Prepared Statements</h2>
          <p>
            Every <code>db.prepare(...)</code> call asks SQLite to parse + compile + plan the SQL. Preparing once and
            reusing the resulting <code>Statement</code> object saves all of that on subsequent calls. For hot-path
            queries this is 2-5x speedup.
          </p>

          <h3>The pattern: declare once at module load</h3>
          <p>Puzzlebox organizes its prepared statements into four groups (one per game / mode):</p>
          <CodePre>{`// Puzzlebox/server.js — verbatim, lines 105-139 (truncated)
const stmts = {
  upsertUser: db.prepare(\`
    INSERT INTO users (id, display_name, email, last_seen)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      display_name = excluded.display_name,
      email        = excluded.email,
      last_seen    = datetime('now')
  \`),
  insertGame: db.prepare(\`
    INSERT INTO games (user_id, difficulty, time_seconds, completed)
    VALUES (?, ?, ?, ?)
  \`),
  // ... more ...
}

const competeStmts = {
  countByDiff: db.prepare(\`SELECT COUNT(*) AS cnt FROM compete_puzzles WHERE difficulty = ?\`),
  insertPuzzle: db.prepare(\`
    INSERT INTO compete_puzzles (difficulty, puzzle_json, solution_json, seq_num)
    VALUES (?, ?, ?, ?)
  \`),
  // ... more ...
}`}</CodePre>

          <p>At handler time, each route just calls the prepared statement:</p>
          <CodePre>{`router.post('/api/games', (req, res) => {
  const info = stmts.insertGame.run(
    req.user.oid,
    req.body.difficulty,
    req.body.timeSeconds,
    req.body.completed ? 1 : 0
  )
  res.status(201).json({ id: info.lastInsertRowid })
})`}</CodePre>

          <h3>Why groups</h3>
          <p>
            Puzzlebox's four groups (<code>stmts</code>, <code>competeStmts</code>, <code>nsStmts</code>,
            <code>nsCompeteStmts</code>) keep statements organized by feature domain. The comment in source says: "must
            not merge" — because each group's statements reference a different table family.
          </p>

          <h3>The <code>info</code> object</h3>
          <CodePre>{`const info = stmt.run(...params)
// info.changes        — number of rows affected
// info.lastInsertRowid — BigInt (use Number(info.lastInsertRowid) if you need a number)`}</CodePre>

          <h3>BigInt gotcha</h3>
          <CodePre>{`// 🚫 BUG — sending BigInt via res.json() throws "Do not know how to serialize a BigInt"
res.json({ id: info.lastInsertRowid })

// ✅ Coerce
res.json({ id: Number(info.lastInsertRowid) })

// Or set DB option at open time (better-sqlite3 12+):
const db = new Database(path, { safeIntegers: false })  // default — Number, not BigInt`}</CodePre>

          <h3>The return-of-changes-on-DELETE pattern</h3>
          <CodePre>{`router.delete('/api/recipes/:id', (req, res) => {
  const info = db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'not found' })
  res.status(204).end()
})`}</CodePre>

          <h3>Returning rows from INSERT</h3>
          <p>SQLite supports <code>RETURNING</code> (since 3.35). Use it instead of two round trips:</p>
          <CodePre>{`// Old: two queries
const info = db.prepare('INSERT INTO recipes (title) VALUES (?)').run(title)
const row  = db.prepare('SELECT * FROM recipes WHERE id = ?').get(info.lastInsertRowid)

// New: one query
const row = db.prepare('INSERT INTO recipes (title) VALUES (?) RETURNING *').get(title)`}</CodePre>
        </section>

        <hr />

        {/* SECTION 5 — IDEMPOTENT SCHEMA */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Idempotent Schema (Reapply on Every Boot)</h2>
          <p>
            Six of seven fleet SQLite apps re-apply their entire schema on every server start. <code>CREATE TABLE IF NOT
            EXISTS</code> + <code>CREATE INDEX IF NOT EXISTS</code> + <code>CREATE TRIGGER IF NOT EXISTS</code> means
            applying the schema is a no-op on every boot but a one-shot setup on a fresh DB.
          </p>

          <h3>The pattern</h3>
          <CodePre>{`// SecretApp/lib/db.js — verbatim
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, mkdirSync } from 'fs'
import Database from 'better-sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const REPO_ROOT  = path.dirname(__dirname)

const DB_PATH = process.env.DB_PATH ?? path.join(REPO_ROOT, 'hearth.db')

mkdirSync(path.dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(readFileSync(path.join(REPO_ROOT, 'schema.sql'), 'utf8'))   // ← apply schema

// Backfill the \`nutrition\` column for installations that predate the schema addition.
// Throws if the column already exists; safe to swallow.
try { db.exec('ALTER TABLE recipes ADD COLUMN nutrition TEXT') } catch (_) { /* already present */ }

// One-time seeding for Home Inventory.
seedInventoryDefaults(db)

console.log(\`📂 SQLite database opened: \${DB_PATH}\`)

export default db`}</CodePre>

          <h3>Hearth's schema (excerpt)</h3>
          <CodePre>{`-- SecretApp/schema.sql — verbatim
CREATE TABLE IF NOT EXISTS recipes (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  title              TEXT    NOT NULL,
  description        TEXT,
  cuisine_type       TEXT,
  meal_type          TEXT    DEFAULT 'dinner'
                     CHECK(meal_type IN ('breakfast','lunch','dinner','snack','dessert','appetizer')),
  prep_time_minutes  INTEGER DEFAULT 0,
  cook_time_minutes  INTEGER DEFAULT 0,
  total_time_minutes INTEGER DEFAULT 0,
  servings           INTEGER DEFAULT 4,
  difficulty_level   TEXT    DEFAULT 'medium' CHECK(difficulty_level IN ('easy','medium','hard')),
  instructions       TEXT,
  notes              TEXT,
  source_url         TEXT,
  image_url          TEXT,
  is_favorite        INTEGER DEFAULT 0,
  rating             REAL,
  dietary_tags       TEXT,
  parsed_by_ai       INTEGER DEFAULT 0,
  nutrition          TEXT,
  created_at         TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type     ON recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine_type  ON recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty    ON recipes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_recipes_is_favorite   ON recipes(is_favorite);
CREATE INDEX IF NOT EXISTS idx_recipes_rating        ON recipes(rating);
CREATE TRIGGER IF NOT EXISTS trg_recipes_updated_at
AFTER UPDATE ON recipes FOR EACH ROW
BEGIN
  UPDATE recipes SET updated_at = datetime('now') WHERE id = OLD.id;
END;`}</CodePre>

          <h3>Schema-level features worth using</h3>
          <table>
            <tbody>
              <tr><th>Feature</th><th>What it does</th></tr>
              <tr><td><code>NOT NULL</code></td><td>Reject inserts that omit this column</td></tr>
              <tr><td><code>DEFAULT '...'</code></td><td>Auto-fill when INSERT omits the column</td></tr>
              <tr><td><code>CHECK(col IN ('a','b'))</code></td><td>Enforce enum-like constraint at the DB level</td></tr>
              <tr><td><code>UNIQUE(col)</code></td><td>Reject duplicate values</td></tr>
              <tr><td><code>FOREIGN KEY (x) REFERENCES y(id) ON DELETE CASCADE</code></td><td>Auto-delete children when parent deletes</td></tr>
              <tr><td><code>CREATE INDEX IF NOT EXISTS</code></td><td>Speed up <code>WHERE</code> on a column</td></tr>
              <tr><td><code>CREATE TRIGGER IF NOT EXISTS</code></td><td>Auto-update fields on INSERT/UPDATE/DELETE</td></tr>
              <tr><td><code>DEFAULT (datetime('now'))</code></td><td>Auto-timestamp on creation</td></tr>
            </tbody>
          </table>

          <h3>Why schema-in-a-file vs schema-in-JS</h3>
          <p>
            Fleet apps split: SecretApp / Cairn put schema in <code>schema.sql</code>. Tabloom / Workshop / ShopKeep
            inline schema as a template literal in <code>server.js</code>. Same outcome; the file-based version is
            easier to diff in PRs, the inline version is easier to keep in sync with migrations. Either works.
          </p>
        </section>

        <hr />

        {/* SECTION 6 — MIGRATIONS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Migrations Without a Framework</h2>
          <p>
            None of the fleet apps use a migration framework (Knex, Prisma, drizzle-kit — only PulseWire has the latter,
            and it's Postgres). They use two patterns: the try/catch ALTER, and the PRAGMA table_info check.
          </p>

          <h3>Pattern 1 — try/catch ALTER (Hearth's style)</h3>
          <CodePre>{`// SecretApp/lib/db.js — verbatim, line 24
// Backfill the \`nutrition\` column for installations that predate the schema addition.
// Throws if the column already exists; safe to swallow.
try { db.exec('ALTER TABLE recipes ADD COLUMN nutrition TEXT') } catch (_) { /* already present */ }`}</CodePre>

          <p>Cheap and cheerful: on a fresh DB the column exists from <code>CREATE TABLE IF NOT EXISTS</code>. On an old DB the column doesn't, and the ALTER adds it. Either way the next line of code sees the column.</p>

          <h3>Pattern 2 — PRAGMA table_info (ShopKeep / Workshop style)</h3>
          <CodePre>{`// ShopKeep/server.js — verbatim, lines 114-127
// Migrations: add new columns to existing DBs
const addColIfMissing = (col, def) => {
  const cols = db.pragma('table_info(tools)').map(c => c.name)
  if (!cols.includes(col)) db.exec(\`ALTER TABLE tools ADD COLUMN \${col} \${def}\`)
}
addColIfMissing('sub_location',   'TEXT')
addColIfMissing('sub_category',   'TEXT')
addColIfMissing('qty',            'INTEGER DEFAULT 1')
addColIfMissing('purchased_from', 'TEXT')
addColIfMissing('product_url',    'TEXT')
addColIfMissing('sku',            'TEXT')
addColIfMissing('barcode',        'TEXT')
addColIfMissing('product_detail', 'TEXT')
addColIfMissing('order_number',   'TEXT')`}</CodePre>

          <p>Explicit, no exception flow. The cost is one PRAGMA query per migration call (microseconds — negligible).</p>

          <h3>Workshop's complex migration — recreating a table</h3>
          <p>SQLite can't ALTER a column's <code>NOT NULL</code> constraint after creation. When workshop needed to make <code>cut_list_items.project_id</code> nullable (so cut items could belong to a <code>shaper_project</code> instead), it recreated the table:</p>
          <CodePre>{`// workshop/server.js — verbatim, lines 142-180 (truncated)
const cutTableInfo = db.prepare(\`PRAGMA table_info(cut_list_items)\`).all()
const cutCols = new Set(cutTableInfo.map(c => c.name))
const projectIdCol = cutTableInfo.find(c => c.name === 'project_id')
const cutTableSql  = (db.prepare(\`SELECT sql FROM sqlite_master WHERE type='table' AND name='cut_list_items'\`).get()?.sql ?? '').toUpperCase()
const needsRecreate = (projectIdCol && projectIdCol.notnull === 1) || !cutTableSql.includes('CHECK')

if (needsRecreate) {
  db.pragma('foreign_keys = OFF')
  try {
    db.transaction(() => {
      db.exec(\`
        CREATE TABLE cut_list_items_new (
          id                INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id        INTEGER REFERENCES projects(id) ON DELETE CASCADE,
          shaper_project_id INTEGER REFERENCES shaper_projects(id) ON DELETE CASCADE,
          part_name         TEXT NOT NULL,
          qty               INTEGER NOT NULL DEFAULT 1,
          length            TEXT,
          width             TEXT,
          /* ... */
          CHECK ((project_id IS NULL) <> (shaper_project_id IS NULL))
        )
      \`)
      db.exec('INSERT INTO cut_list_items_new SELECT * FROM cut_list_items')
      db.exec('DROP TABLE cut_list_items')
      db.exec('ALTER TABLE cut_list_items_new RENAME TO cut_list_items')
    })()
  } finally {
    db.pragma('foreign_keys = ON')  // ← always re-enable
  }
}`}</CodePre>

          <p>The three steps: (1) create the new shape as a different name, (2) copy data, (3) drop old + rename new. The FK pragma toggle is critical — leaving FKs on would cascade-delete everything that referenced the old table during the DROP.</p>

          <h3>When to graduate to a framework</h3>
          <ul>
            <li>Migrations have ordering dependencies you'd otherwise forget.</li>
            <li>You need to roll back to a known state during development.</li>
            <li>You want to test "schema from prod + my new migration applies cleanly" before pushing.</li>
            <li>Your team is bigger than 1–2 people.</li>
          </ul>

          <p>None of the fleet apps have hit that threshold yet. <code>drizzle-kit</code> is the pick for ESM Node when you do.</p>
        </section>

        <hr />

        {/* SECTION 7 — TRANSACTIONS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Transactions — The 10x Speedup Hidden in Plain Sight</h2>
          <p>SQLite commits each statement individually by default. If you're inserting 1000 rows, that's 1000 fsync calls — disk-sync-per-row. Wrap in a transaction: one fsync for the batch.</p>

          <h3>The pattern</h3>
          <CodePre>{`// SecretApp/lib/db.js — verbatim, lines 46-49
const insertCat = db.prepare(
  'INSERT INTO inventory_categories (name, sort_order) VALUES (?, ?)'
)
const categories = [ 'Electronics', 'Furniture', 'Kitchen', /* ... */ ]
const tx = db.transaction(() => {
  categories.forEach((name, i) => insertCat.run(name, i))
})
tx()
console.log(\`🌱 Seeded \${categories.length} inventory categories\`)`}</CodePre>

          <h3>What <code>db.transaction</code> does</h3>
          <ol>
            <li>Wraps your function in <code>BEGIN ... COMMIT</code>.</li>
            <li>On any thrown error, runs <code>ROLLBACK</code>.</li>
            <li>Returns a callable. Call it to execute.</li>
          </ol>

          <CodePre>{`// Long-form equivalent (DON'T do this — use db.transaction)
db.exec('BEGIN')
try {
  for (const item of items) insertItem.run(item)
  db.exec('COMMIT')
} catch (err) {
  db.exec('ROLLBACK')
  throw err
}`}</CodePre>

          <h3>Parameters and return values</h3>
          <CodePre>{`const insertWithChildren = db.transaction((recipe) => {
  const { lastInsertRowid } = db.prepare('INSERT INTO recipes (title) VALUES (?)').run(recipe.title)
  for (const ing of recipe.ingredients) {
    db.prepare('INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit) VALUES (?, ?, ?, ?)')
      .run(lastInsertRowid, ing.name, ing.qty, ing.unit)
  }
  return Number(lastInsertRowid)
})

const newId = insertWithChildren({ title: 'Carbonara', ingredients: [...] })`}</CodePre>

          <h3>Nested transactions — SAVEPOINTs</h3>
          <CodePre>{`const outer = db.transaction((items) => {
  const inner = db.transaction((items2) => {
    // ... do something rollback-able as a unit ...
  })

  for (const batch of chunks(items, 100)) {
    try {
      inner(batch)
    } catch {
      // outer continues even if a single inner batch fails
    }
  }
})`}</CodePre>

          <p>better-sqlite3 maps nested transactions to SAVEPOINTs automatically. The outer can succeed even if an inner rolls back.</p>

          <h3>When NOT to wrap</h3>
          <ul>
            <li><strong>Single-statement operations.</strong> A bare <code>stmt.run(...)</code> already runs atomically.</li>
            <li><strong>Read-only batches.</strong> SELECTs don't need transactions for atomicity (use one for snapshot consistency across reads).</li>
            <li><strong>Across HTTP requests.</strong> Don't span a transaction across multiple <code>req</code> lifecycles. It defeats SQLite's concurrency model and locks the DB.</li>
          </ul>

          <h3>The performance number</h3>
          <p>Hearth seeds ~30 inventory rows on first boot. Without transactions: ~30 fsyncs = ~150ms on App Service's slow disk. With the transaction wrapper: 1 fsync = ~5ms. Times 6 seeded tables, that's ~900ms shaved off cold start.</p>
        </section>

        <hr />

        {/* SECTION 8 — BLOBS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>BLOBs vs Disk — Where to Store Files</h2>
          <p>SecretApp stores recipe images as <strong>BLOBs</strong> in SQLite. Workshop stores project images <strong>on disk</strong> with file paths in SQLite. Both work; the tradeoff is real.</p>

          <h3>The two patterns</h3>
          <CodePre>{`-- BLOB pattern (Hearth)
CREATE TABLE recipe_images (
  id          INTEGER PRIMARY KEY,
  recipe_id   INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_data   BLOB NOT NULL,    -- ← raw bytes in the DB
  file_type   TEXT NOT NULL,
  file_size   INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Disk-path pattern (Workshop)
CREATE TABLE project_images (
  id           INTEGER PRIMARY KEY,
  project_id   INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  file_path    TEXT NOT NULL,   -- ← path under UPLOADS_PATH
  file_name    TEXT NOT NULL,
  uploaded_at  TEXT NOT NULL DEFAULT (datetime('now'))
);`}</CodePre>

          <h3>BLOB pros and cons</h3>
          <table>
            <tbody>
              <tr><th>BLOBs (Hearth)</th><th></th></tr>
              <tr><td>✅ Backup ships with the DB</td><td>The .db file IS the backup</td></tr>
              <tr><td>✅ Atomic deletes</td><td>FK CASCADE removes the image when the recipe is deleted</td></tr>
              <tr><td>✅ Zero file-system permission issues</td><td>App Service container restarts don't lose files (they're in the persistent DB)</td></tr>
              <tr><td>❌ DB grows fast</td><td>10MB image = 10MB SQLite growth</td></tr>
              <tr><td>❌ Bypass-the-DB serving needs a route</td><td>Can't just <code>express.static</code> — need to <code>res.type(mime).send(buf)</code></td></tr>
              <tr><td>❌ Can't use a CDN directly</td><td>Cache headers + HTTP semantics are on you</td></tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr><th>Disk paths (Workshop)</th><th></th></tr>
              <tr><td>✅ Small DB</td><td>Just the path string; SQLite stays nimble</td></tr>
              <tr><td>✅ <code>express.static</code> serves directly</td><td>One line of middleware; HTTP caching works automatically</td></tr>
              <tr><td>✅ Can move to blob storage later</td><td>Replace <code>file_path</code> values with URLs; no schema change</td></tr>
              <tr><td>❌ Two-step backup</td><td>Have to copy DB AND uploads dir; risk of drift</td></tr>
              <tr><td>❌ Orphan files on bugs</td><td>If a DELETE fails to also unlink, the file lingers</td></tr>
              <tr><td>❌ App Service volume mount required</td><td><code>/home/data</code> persistent storage must be enabled</td></tr>
            </tbody>
          </table>

          <h3>Reading a BLOB</h3>
          <CodePre>{`router.get('/api/recipes/:id/image', (req, res) => {
  const row = db.prepare(
    'SELECT file_data, file_type FROM recipe_images WHERE recipe_id = ? LIMIT 1'
  ).get(req.params.id)
  if (!row) return res.status(404).end()
  res.setHeader('Content-Type', row.file_type)
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.send(row.file_data)  // ← Buffer, sent as-is
})`}</CodePre>

          <h3>Writing a BLOB</h3>
          <CodePre>{`router.post('/api/recipes/:id/images', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  db.prepare(
    'INSERT INTO recipe_images (recipe_id, file_name, file_data, file_type, file_size) VALUES (?, ?, ?, ?, ?)'
  ).run(
    req.params.id,
    req.file.originalname,
    req.file.buffer,        // ← multer.memoryStorage()
    req.file.mimetype,
    req.file.size
  )
  res.status(201).end()
})`}</CodePre>

          <h3>Rule of thumb</h3>
          <p>
            <strong>BLOBs</strong> for &lt; 10MB files at &lt; 100MB total per app. <strong>Disk paths</strong> when total
            media exceeds 100MB or you might move to blob storage. Hearth's 2-user household scale is well under both
            thresholds; Workshop's photo-heavy build logs would explode a BLOB-backed DB.
          </p>
        </section>

        <hr />

        {/* SECTION 9 — TRIGGERS + CASCADE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Triggers + Foreign Key CASCADE</h2>

          <h3>FK CASCADE — auto-delete children</h3>
          <CodePre>{`-- SecretApp/schema.sql
CREATE TABLE recipe_ingredients (
  id            INTEGER PRIMARY KEY,
  recipe_id     INTEGER NOT NULL,
  ingredient    TEXT    NOT NULL,
  quantity      REAL    NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);`}</CodePre>

          <p>Delete a recipe → SQLite auto-deletes every row in <code>recipe_ingredients</code> with that <code>recipe_id</code>. (Provided <code>foreign_keys = ON</code> — §2.)</p>

          <h3>Other CASCADE actions</h3>
          <table>
            <tbody>
              <tr><th>Clause</th><th>Behavior</th></tr>
              <tr><td><code>ON DELETE CASCADE</code></td><td>Delete children with parent</td></tr>
              <tr><td><code>ON DELETE SET NULL</code></td><td>Set the FK column to NULL in children</td></tr>
              <tr><td><code>ON DELETE RESTRICT</code></td><td>Refuse the delete if children exist (default)</td></tr>
              <tr><td><code>ON DELETE NO ACTION</code></td><td>Same as RESTRICT (the SQL standard's wording)</td></tr>
              <tr><td><code>ON UPDATE CASCADE</code></td><td>Same idea but on UPDATE of the parent's primary key (rare — most PKs don't change)</td></tr>
            </tbody>
          </table>

          <h3>Triggers — auto-update timestamps</h3>
          <CodePre>{`-- SecretApp/schema.sql — verbatim
CREATE TRIGGER IF NOT EXISTS trg_recipes_updated_at
AFTER UPDATE ON recipes FOR EACH ROW
BEGIN
  UPDATE recipes SET updated_at = datetime('now') WHERE id = OLD.id;
END;`}</CodePre>

          <p>Every UPDATE on <code>recipes</code> sets <code>updated_at</code> to now. No application code involved.</p>

          <h3>Trigger anatomy</h3>
          <CodePre>{`CREATE TRIGGER [IF NOT EXISTS] name
{BEFORE | AFTER | INSTEAD OF} {INSERT | UPDATE [OF col1, col2] | DELETE}
ON table_name
[FOR EACH ROW]
[WHEN condition]
BEGIN
  -- one or more statements
  -- NEW.col / OLD.col reference the row being acted on
END;`}</CodePre>

          <h3>When to use a trigger</h3>
          <ul>
            <li><strong>Auto-timestamps</strong> (every fleet app).</li>
            <li><strong>Audit logs</strong> — log to a separate table on every UPDATE (see §10's audit log example).</li>
            <li><strong>Denormalization</strong> — maintain a count column on the parent when children change.</li>
            <li><strong>Validation</strong> — RAISE(ABORT, 'message') from a BEFORE trigger when a condition fails.</li>
          </ul>

          <h3>When NOT to use a trigger</h3>
          <ul>
            <li><strong>Business logic</strong> belongs in your app code, where you can test and debug it.</li>
            <li><strong>Cross-table side effects</strong> can produce surprising deadlocks and ordering issues.</li>
            <li><strong>Heavy work</strong> — triggers run inside the user's transaction. Slow trigger = slow user response.</li>
          </ul>

          <h3>The Hearth audit-log pattern (immutable rows)</h3>
          <CodePre>{`-- SecretApp/schema.sql — verbatim
-- ── Plex action log (audit trail for duplicate-cleanup deletes) ─────
CREATE TABLE IF NOT EXISTS plex_action_log (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  ts              INTEGER NOT NULL,
  action          TEXT    NOT NULL,
  status          TEXT    NOT NULL,
  rating_key      TEXT,
  library_id      TEXT,
  library_title   TEXT,
  movie_guid      TEXT,
  title           TEXT,
  year            INTEGER,
  file_path       TEXT,
  file_size       INTEGER,
  duration_ms     INTEGER,
  bitrate_kbps    INTEGER,
  resolution      TEXT,
  video_codec     TEXT,
  audio_codec     TEXT,
  audio_channels  INTEGER,
  container       TEXT,
  kept_rating_key TEXT,
  kept_file_path  TEXT,
  snapshot_json   TEXT,
  error_message   TEXT,
  user_email      TEXT
);
CREATE INDEX IF NOT EXISTS idx_plex_action_log_ts ON plex_action_log(ts DESC);
CREATE INDEX IF NOT EXISTS idx_plex_action_log_rating_key ON plex_action_log(rating_key);`}</CodePre>

          <p>
            Every Plex delete attempt (success, failure, verify-failure, cancellation) inserts one row. Rows are
            <strong>append-only</strong>; no UPDATE or DELETE statements exist for this table. The full state at decision
            time is captured in <code>snapshot_json</code> so you can reconstruct what the app saw at the moment of
            decision.
          </p>

          <p>This is the audit-trail pattern: trust nothing the client sends; record everything the server decides; never UPDATE rows that represent past decisions.</p>
        </section>

        <hr />

        {/* SECTION 10 — BACKUPS */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Backups (Online Backup API)</h2>
          <p>
            "Just cp the file" works on a stopped DB. Under WAL with active writers, it doesn't — you'd get an inconsistent
            snapshot. SQLite's <em>online backup API</em> reads pages from the live DB into a separate file, handling
            concurrent writes transparently. better-sqlite3 exposes it as <code>db.backup(target)</code>.
          </p>

          <h3>Tabloom's full pattern — 14-day rolling, daily at 3am</h3>
          <CodePre>{`// tabloom/lib/backup.js — verbatim
import { mkdirSync, readdirSync, statSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'

const DAY_MS = 86_400_000
const FILE_RE = /^tabloom-(\\d{4}-\\d{2}-\\d{2})\\.db$/

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function startBackupSchedule({ db, backupsDir, retainDays = 14 }) {
  mkdirSync(backupsDir, { recursive: true })

  async function runBackup() {
    const target = join(backupsDir, \`tabloom-\${today()}.db\`)
    try {
      // Online Backup API — safe to run concurrently with writes; WAL is
      // handled transparently. Produces a single clean .db file.
      await db.backup(target)
      const sizeKb = Math.round(statSync(target).size / 1024)
      console.log(\`[backup] -> \${target} (\${sizeKb} KB)\`)
      prune()
    } catch (err) {
      console.error(\`[backup] failed: \${err.message}\`)
    }
  }

  function prune() {
    const cutoff = Date.now() - retainDays * DAY_MS
    let removed = 0
    for (const name of readdirSync(backupsDir)) {
      if (!FILE_RE.test(name)) continue
      const p = join(backupsDir, name)
      try {
        if (statSync(p).mtimeMs < cutoff) {
          unlinkSync(p)
          removed++
        }
      } catch { /* ignore */ }
    }
    if (removed > 0) console.log(\`[backup] pruned \${removed} file(s) older than \${retainDays}d\`)
  }

  function scheduleNext() {
    const now = new Date()
    const next = new Date(now)
    next.setHours(3, 0, 0, 0)
    if (next <= now) next.setDate(next.getDate() + 1)
    const ms = next.getTime() - now.getTime()
    setTimeout(async () => {
      await runBackup()
      scheduleNext()
    }, ms)
    console.log(\`[backup] next run at \${next.toISOString()}\`)
  }

  // Catch-up on boot
  const todayFile = join(backupsDir, \`tabloom-\${today()}.db\`)
  if (!existsSync(todayFile)) {
    runBackup()
  } else {
    console.log(\`[backup] today's snapshot already present: \${todayFile}\`)
  }

  scheduleNext()
}`}</CodePre>

          <h3>What makes this pattern strong</h3>
          <ol>
            <li><strong>Idempotent.</strong> Re-running same-day just overwrites (it would, except for the existsSync guard skipping).</li>
            <li><strong>Self-cleaning.</strong> 14-day retention; old snapshots are removed automatically.</li>
            <li><strong>Catch-up on boot.</strong> If today's snapshot isn't on disk (e.g. fresh container, or first deploy after midnight), runs immediately.</li>
            <li><strong>Pinned filename format.</strong> Regex matches only the expected name pattern — won't sweep unrelated files in the backup dir.</li>
            <li><strong>Fixed-time schedule.</strong> Always 3am local. Predictable, lines up with low traffic.</li>
          </ol>

          <h3>VACUUM INTO — the other approach</h3>
          <CodePre>{`db.exec(\`VACUUM INTO 'backup-\${today}.db'\`)`}</CodePre>
          <p>
            <code>VACUUM INTO</code> writes a defragmented copy of the DB to a new file. Like <code>db.backup()</code>, it's
            safe under concurrent writes. The difference: <code>VACUUM INTO</code> also rebuilds the DB structure
            (smaller output, slightly slower), while <code>db.backup()</code> does a page-level copy (same size, faster).
            For periodic backups, either works.
          </p>

          <h3>The full backup story for App Service</h3>
          <ol>
            <li><strong>Schedule on-server backups</strong> via Tabloom's pattern — to a directory on the same persistent volume.</li>
            <li><strong>Cloud-level snapshots</strong> via App Service's built-in backup feature (configure in portal). Snapshots the entire app + persistent storage daily.</li>
            <li><strong>Off-app pulls</strong> via Kudu (<code>az webapp ssh</code> + <code>cp</code>) when you need a one-off.</li>
            <li><strong>Test the restore</strong> at least once. A backup you've never restored is a hypothesis, not a backup.</li>
          </ol>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Backing up via file copy on a running WAL DB is unsafe.</strong> You'd capture <code>app.db</code>
              without <code>app.db-wal</code>, losing all writes since the last checkpoint. Always use
              <code>db.backup()</code> or <code>VACUUM INTO</code>, or copy all three sidecar files together (<code>.db</code>,
              <code>.db-wal</code>, <code>.db-shm</code>) while no writes are in flight.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a Schema from Scratch</h2>
          <p>Build a 3-table schema with FK CASCADE, an idempotent migration, transactions, an audit log, and a daily backup loop. Mirrors what every fleet app does.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`mkdir sqlite-lab && cd sqlite-lab
npm init -y
npm pkg set type=module
npm i better-sqlite3`}</CodePre>

          <h3>Step 2 — schema.sql</h3>
          <CodePre>{`-- schema.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS authors (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS books (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id  INTEGER NOT NULL,
  title      TEXT NOT NULL,
  genre      TEXT NOT NULL DEFAULT 'fiction' CHECK(genre IN ('fiction','nonfiction','poetry','reference')),
  pages      INTEGER NOT NULL DEFAULT 0,
  published  TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_genre  ON books(genre);

CREATE TRIGGER IF NOT EXISTS trg_books_updated_at
AFTER UPDATE ON books FOR EACH ROW
BEGIN
  UPDATE books SET updated_at = datetime('now') WHERE id = OLD.id;
END;

-- Append-only audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts          INTEGER NOT NULL,
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   INTEGER,
  snapshot    TEXT
);
CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_log(ts DESC);`}</CodePre>

          <h3>Step 3 — lib/db.js</h3>
          <CodePre>{`// lib/db.js
import Database from 'better-sqlite3'
import { readFileSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const DB_PATH = process.env.DB_PATH ?? './lab.db'
mkdirSync(dirname(DB_PATH), { recursive: true })

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(readFileSync('./schema.sql', 'utf8'))

// Migration example — add a column to books
const cols = db.pragma('table_info(books)').map(c => c.name)
if (!cols.includes('rating')) {
  db.exec('ALTER TABLE books ADD COLUMN rating REAL')
  console.log('Migration: added books.rating')
}

console.log(\`📂 DB opened: \${DB_PATH}\`)
export default db`}</CodePre>

          <h3>Step 4 — Seeding with a transaction</h3>
          <CodePre>{`// seed.js
import db from './lib/db.js'

const seed = db.transaction(() => {
  const insAuthor = db.prepare('INSERT OR IGNORE INTO authors (name) VALUES (?)')
  const insBook   = db.prepare('INSERT INTO books (author_id, title, genre, pages) VALUES (?, ?, ?, ?)')

  insAuthor.run('Ursula K. Le Guin')
  insAuthor.run('Italo Calvino')

  const leguin = db.prepare('SELECT id FROM authors WHERE name = ?').get('Ursula K. Le Guin').id
  const calvino = db.prepare('SELECT id FROM authors WHERE name = ?').get('Italo Calvino').id

  insBook.run(leguin,  'A Wizard of Earthsea',  'fiction', 205)
  insBook.run(leguin,  'The Dispossessed',       'fiction', 387)
  insBook.run(calvino, 'Invisible Cities',       'fiction', 165)
  insBook.run(calvino, 'If on a winter\\'s night',  'fiction', 260)
})

seed()
console.log('Seeded.')`}</CodePre>

          <p>Run: <code>node seed.js</code></p>

          <h3>Step 5 — A typical query pattern</h3>
          <CodePre>{`// query.js
import db from './lib/db.js'

const list = db.prepare(\`
  SELECT b.id, b.title, b.pages, a.name AS author
  FROM books b
  JOIN authors a ON a.id = b.author_id
  WHERE b.genre = ?
  ORDER BY b.pages DESC
\`).all('fiction')

console.table(list)`}</CodePre>

          <h3>Step 6 — Audit log via trigger</h3>
          <CodePre>{`// In schema.sql, add:
CREATE TRIGGER IF NOT EXISTS trg_books_audit_insert
AFTER INSERT ON books FOR EACH ROW
BEGIN
  INSERT INTO audit_log (ts, action, entity, entity_id, snapshot)
  VALUES (
    strftime('%s', 'now') * 1000,
    'create',
    'book',
    NEW.id,
    json_object('title', NEW.title, 'author_id', NEW.author_id, 'genre', NEW.genre)
  );
END;

CREATE TRIGGER IF NOT EXISTS trg_books_audit_delete
AFTER DELETE ON books FOR EACH ROW
BEGIN
  INSERT INTO audit_log (ts, action, entity, entity_id, snapshot)
  VALUES (
    strftime('%s', 'now') * 1000,
    'delete',
    'book',
    OLD.id,
    json_object('title', OLD.title, 'pages', OLD.pages)
  );
END;`}</CodePre>

          <p>Now every INSERT/DELETE on <code>books</code> writes a row to <code>audit_log</code> automatically. Query it:</p>
          <CodePre>{`SELECT * FROM audit_log ORDER BY ts DESC LIMIT 10;`}</CodePre>

          <h3>Step 7 — Demonstrate CASCADE</h3>
          <CodePre>{`// cascade-demo.js
import db from './lib/db.js'

const beforeBooks  = db.prepare('SELECT COUNT(*) AS n FROM books').get().n
const beforeAudits = db.prepare('SELECT COUNT(*) AS n FROM audit_log').get().n

db.prepare('DELETE FROM authors WHERE name = ?').run('Italo Calvino')

const afterBooks  = db.prepare('SELECT COUNT(*) AS n FROM books').get().n
const afterAudits = db.prepare('SELECT COUNT(*) AS n FROM audit_log').get().n

console.log(\`Books   : \${beforeBooks} → \${afterBooks}\`)
console.log(\`Audits  : \${beforeAudits} → \${afterAudits}\`)
// Books should drop by 2 (Calvino had 2); audits should rise by 2 (delete trigger fired).`}</CodePre>

          <h3>Step 8 — Backup loop</h3>
          <CodePre>{`// backup.js
import db from './lib/db.js'

await db.backup('./snapshot.db')
console.log('Backed up to ./snapshot.db')`}</CodePre>

          <p>Run it. Open the snapshot to verify:</p>
          <CodePre>{`sqlite3 snapshot.db "SELECT COUNT(*) FROM books;"`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated every fleet-scale pattern: WAL + FK, prepared statements, idempotent schema, additive
              migrations, transactional seeding, trigger-driven audit logs, FK CASCADE, and the online-backup API.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"SQLITE_BUSY: database is locked"</h3>
          <p>Another process / connection is mid-transaction. With WAL this is rare, but possible during checkpointing. Solutions: (a) <code>db.pragma('busy_timeout = 5000')</code> at open time — block up to 5s for the lock, (b) check you're not running a long-lived read in a transaction that's blocking writers.</p>

          <h3>"SQLITE_CONSTRAINT: FOREIGN KEY constraint failed"</h3>
          <p>You're inserting a row whose FK column points to a parent that doesn't exist. Either insert the parent first or remove the FK clause if the relationship is genuinely optional (and use <code>ON DELETE SET NULL</code> on the FK).</p>

          <h3>"SqliteError: no such column"</h3>
          <p>Your schema is out of sync. Either: (a) re-run the app so <code>CREATE TABLE IF NOT EXISTS</code> + ALTER migrations apply, (b) the migration uses the wrong column name, (c) you opened a stale DB file (check <code>DB_PATH</code>).</p>

          <h3>"Cannot find module 'better-sqlite3'" / "Module not loaded"</h3>
          <p>Native build failed during <code>npm install</code>. On Alpine, ensure <code>apk add python3 make g++</code> is in your Dockerfile.</p>

          <h3>BigInt errors in JSON.stringify</h3>
          <p><code>info.lastInsertRowid</code> is BigInt. Coerce with <code>Number(...)</code> before sending JSON, or open the DB with <code>safeIntegers: false</code> (default).</p>

          <h3>Empty audit log after a trigger</h3>
          <p>Triggers don't fire if the underlying operation doesn't actually happen. <code>DELETE FROM x WHERE id = -1</code> when nothing matches → zero rows affected → no trigger. Also: triggers don't fire on REPLACE that turns into a no-op INSERT.</p>

          <h3>"foreign key mismatch"</h3>
          <p>You're referencing a column in another table that isn't UNIQUE or PRIMARY KEY. Foreign keys must point at a column with a uniqueness constraint.</p>

          <h3>Backup is empty</h3>
          <p>You called <code>db.backup('foo.db')</code> without <code>await</code>. It returns a Promise; you have to await it.</p>

          <h3>"Schema differs between local and prod"</h3>
          <p>Likely cause: a migration ran in one place but not the other. The PRAGMA table_info pattern is idempotent but only adds; it doesn't drop renamed columns. Best practice: track migrations explicitly in a versions table.</p>

          <h3>DB file growing forever</h3>
          <p>Two causes: (a) you DELETE rows but the freed pages aren't released to OS until VACUUM — periodic <code>VACUUM</code> helps, (b) WAL file grew big and isn't checkpointing — call <code>db.pragma('wal_checkpoint(TRUNCATE)')</code> periodically.</p>

          <h3>Slow query that "should" be fast</h3>
          <p>Run <code>EXPLAIN QUERY PLAN</code> via <code>db.prepare('EXPLAIN QUERY PLAN SELECT ...').all()</code>. If you see "SCAN TABLE" instead of "SEARCH ... USING INDEX", you need an index on the WHERE/JOIN columns.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Open + pragmas</h3>
          <CodePre>{`import Database from 'better-sqlite3'

const db = new Database(process.env.DB_PATH ?? './app.db')
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(readFileSync('./schema.sql', 'utf8'))`}</CodePre>

          <h3>The five statement methods</h3>
          <CodePre>{`db.prepare(sql)                  // compile once
stmt.run(params)                  // INSERT / UPDATE / DELETE  → { changes, lastInsertRowid }
stmt.get(params)                  // SELECT one row             → row | undefined
stmt.all(params)                  // SELECT many                → row[]
stmt.iterate(params)              // SELECT lazy                → iterator
db.exec(sql)                       // DDL / multi-statement, no params`}</CodePre>

          <h3>Transactions</h3>
          <CodePre>{`const tx = db.transaction((items) => {
  for (const i of items) stmt.run(i)
})
tx(items)                          // atomic`}</CodePre>

          <h3>Idempotent schema + migrations</h3>
          <CodePre>{`-- in schema.sql:
CREATE TABLE IF NOT EXISTS ... CHECK(col IN ('a','b'));
CREATE INDEX IF NOT EXISTS ...;
CREATE TRIGGER IF NOT EXISTS ...;

// in db.js — add columns retroactively:
try { db.exec('ALTER TABLE x ADD COLUMN y TEXT') } catch {}
// or:
const cols = db.pragma('table_info(x)').map(c => c.name)
if (!cols.includes('y')) db.exec('ALTER TABLE x ADD COLUMN y TEXT')`}</CodePre>

          <h3>Backup</h3>
          <CodePre>{`await db.backup('snapshot.db')   // online backup — safe under WAL writes
db.exec("VACUUM INTO 'snapshot.db'")  // equivalent + defrags`}</CodePre>

          <h3>Common pragmas</h3>
          <CodePre>{`db.pragma('foreign_keys = ON')           // REQUIRED
db.pragma('journal_mode = WAL')           // REQUIRED
db.pragma('busy_timeout = 5000')           // wait on locks
db.pragma('wal_checkpoint(TRUNCATE)')      // shrink the WAL file`}</CodePre>

          <h3>Schema features</h3>
          <CodePre>{`NOT NULL                          -- column is required
DEFAULT 0                          -- auto-fill
DEFAULT (datetime('now'))          -- auto-timestamp
CHECK(col IN ('a','b'))            -- enum constraint
UNIQUE(col)                        -- uniqueness
FOREIGN KEY(...) REFERENCES x(id) ON DELETE CASCADE
PRIMARY KEY AUTOINCREMENT          -- auto-incrementing PK`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>WAL + FK + schema apply</td><td>SecretApp · <code>lib/db.js:17-20</code></td></tr>
              <tr><td>try/catch ALTER migration</td><td>SecretApp · <code>lib/db.js:24</code></td></tr>
              <tr><td>addColIfMissing migration</td><td>ShopKeep · <code>server.js:114-127</code></td></tr>
              <tr><td>Recreate-table migration</td><td>workshop · <code>server.js:142-180</code></td></tr>
              <tr><td>Transaction seeding</td><td>SecretApp · <code>lib/db.js:46-49</code></td></tr>
              <tr><td>Prepared statement groups</td><td>Puzzlebox · <code>server.js:105-243</code></td></tr>
              <tr><td>FK CASCADE + AFTER UPDATE trigger</td><td>SecretApp · <code>schema.sql:39-43, 53</code></td></tr>
              <tr><td>Append-only audit log</td><td>SecretApp · <code>schema.sql:388-416</code></td></tr>
              <tr><td>BLOB column</td><td>SecretApp · <code>schema.sql</code> (recipe_images table)</td></tr>
              <tr><td>Online backup + 14-day rolling</td><td>tabloom · <code>lib/backup.js</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: per-user SQLite isolation.</p>
        </section>
      </main>
    </div>
  );
}
