import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Why It Beats userId Columns',         icon: '🆚' },
  { id: 's3',  num: '3',  title: 'OID Validation (Security First)',     icon: '🔐' },
  { id: 's4',  num: '4',  title: 'getDb(oid) — The Resolver',          icon: '🧭' },
  { id: 's5',  num: '5',  title: 'withUserDb Middleware',              icon: '🚦' },
  { id: 's6',  num: '6',  title: 'Schema Init + Seeding',              icon: '🌱' },
  { id: 's7',  num: '7',  title: 'Connection Caching',                 icon: '♻️' },
  { id: 's8',  num: '8',  title: 'Legacy DB Migration',                icon: '🚚' },
  { id: 's9',  num: '9',  title: 'When Not to Use It',                 icon: '🛑' },
  { id: 's10', num: '10', title: 'Backups + Failure Modes',            icon: '💾' },
  { id: 's11', num: '★',  title: 'Lab: Full Per-User Stack',           icon: '🛠️' },
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

export default function PerUserSQLiteGuide() {
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
            <span className="sidebar-title">Per-User SQLite</span>
          </div>
          <div className="sidebar-sub">file path = user boundary</div>
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
          <div className="hero-tag">👥 Per-user isolation · 2026</div>
          <h1>Per-User SQLite<br />Isolation Pattern</h1>
          <p>
            Three fleet apps — <strong style={{ color: '#C77AA0' }}>Cairn, GLP1, ShopKeep</strong> — give every signed-in
            user their own <code>.db</code> file. The file path is the trust boundary; there are no <code>userId</code>
            columns anywhere. This guide walks the security-critical OID validation, the resolver pattern, the Express
            middleware that attaches the right handle, schema init on first open, and the LRU cache that keeps file
            descriptors bounded.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Apps Use Pattern</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label"><code>userId</code> Cols</span></div>
            <div className="hero-stat"><span className="hero-stat-val">36</span><span className="hero-stat-label">GUID Char Length</span></div>
            <div className="hero-stat"><span className="hero-stat-val">50</span><span className="hero-stat-label">Cairn LRU Cap</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Per-user SQLite isolation is the simplest multi-tenant design that exists. Each authenticated user gets a
            file at <code>users/&lt;oid&gt;.db</code>. The auth middleware extracts the user's <code>oid</code> from
            their JWT, opens (or reuses) <em>their</em> DB, attaches the handle to <code>req.db</code>, and the route
            handler reads/writes as if it were a single-user app.
          </p>

          <h3>The diagram</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  C[Client] -->|Bearer JWT| AM[requireAuth]
  AM -->|req.user.oid| WM[withUserDb]
  WM --> R{getDb cache}
  R -->|cache hit| H1[req.db = cached]
  R -->|cache miss| O[Open users/oid.db]
  O --> S[Apply schema + seed]
  S --> H2[req.db = new]
  H1 --> RH[Route handler]
  H2 --> RH
  RH -->|reads / writes| DB[(per-user .db file)]`} />

          <h3>One sentence per layer</h3>
          <ol>
            <li><strong>auth.js</strong> verifies the JWT and writes <code>req.user.oid</code>.</li>
            <li><strong>userDb.js</strong> exposes <code>getDb(oid)</code> — opens the DB, caches the handle, returns it.</li>
            <li><strong>withUserDb</strong> middleware calls <code>getDb(req.user.oid)</code> and attaches <code>req.db</code>.</li>
            <li><strong>Route handlers</strong> use <code>req.db.prepare(...)</code> like any single-user app.</li>
          </ol>

          <h3>Two analogies</h3>
          <p>
            <strong>The hotel room.</strong> Each user gets their own room (their own .db file). The hotel staff (auth
            middleware) checks your key card and walks you to your room. You can do anything you want inside — you
            can't accidentally walk into the next room because the file path is different.
          </p>
          <p>
            <strong>The locker rooms.</strong> Each authenticated user has a personal locker with their stuff. The
            attendant's only job is to show you to <em>your</em> locker. There's no shared shelf, no labels to mix up,
            no chance of grabbing someone else's locker by mistake — the path is the access control.
          </p>

          <h3>The three apps</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>DB root</th><th>Cache</th><th>Schema</th></tr>
              <tr><td>Cairn</td><td><code>/home/data/users/&lt;oid&gt;.db</code></td><td>LRU cap 50</td><td>schema.sql</td></tr>
              <tr><td>GLP1 (Tare)</td><td><code>/data/users/&lt;oid&gt;.db</code></td><td>Unbounded Map</td><td>SCHEMA_SQL constant</td></tr>
              <tr><td>ShopKeep</td><td><code>&lt;DB_DIR&gt;/&lt;oid&gt;.db</code></td><td>Unbounded Map</td><td>Inline + addColIfMissing</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 2 — VS USERID COLUMNS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Why It Beats <code>userId</code> Columns</h2>
          <p>The alternative — and what every database textbook teaches — is to add a <code>user_id</code> column to every table and join on it everywhere. For most apps that's the right answer. For personal apps with a 1–10 user count, per-user SQLite isolation is strictly better.</p>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th>Aspect</th><th>Per-user .db files</th><th>Shared DB + userId columns</th></tr>
              <tr><td>Auth boundary</td><td>File path. Can't access another user's data.</td><td>WHERE clause. One missed <code>WHERE user_id = ?</code> = leak.</td></tr>
              <tr><td>Schema</td><td>One schema, applied to every user file</td><td>Same — but every query must remember to filter</td></tr>
              <tr><td>Migrations</td><td>Run on each user file at first open after deploy</td><td>Run once across the shared DB</td></tr>
              <tr><td>Backups</td><td>One file per user; can restore individually</td><td>One file; restore is all-or-nothing</td></tr>
              <tr><td>Export-my-data (GDPR)</td><td>Ship <code>users/&lt;oid&gt;.db</code></td><td>SELECT everywhere; harder</td></tr>
              <tr><td>Delete-my-data</td><td><code>fs.unlink(users/&lt;oid&gt;.db)</code></td><td>DELETE everywhere; complex with FK CASCADE</td></tr>
              <tr><td>Concurrency</td><td>Each user's writes are isolated; no cross-user locking</td><td>One global write lock under SQLite (WAL helps)</td></tr>
              <tr><td>Per-user feature flags</td><td>Could be a column on a single-row settings table</td><td>Column on users table</td></tr>
              <tr><td>Cross-user queries</td><td>Can't easily — would need to iterate files</td><td>Trivial</td></tr>
              <tr><td>Disk usage</td><td>N × overhead per user</td><td>One file, no per-row overhead</td></tr>
            </tbody>
          </table>

          <h3>The auth-boundary argument</h3>
          <p>
            Consider a fleet-style app with 12 routes spanning 8 tables. With per-user files, the only auth check is
            "does <code>req.user.oid</code> point to a valid OID?" — once, in middleware. Every query inside
            <code>req.db</code> is naturally scoped.
          </p>
          <p>
            With shared DB + <code>userId</code> columns, every query needs <code>WHERE user_id = req.user.oid</code>.
            Forget it in one route and you leak data. Worse: forget it in a JOIN clause and you might leak
            <em>related</em> data without leaking the main table. The bug is silent unless someone notices.
          </p>

          <h3>The export-my-data argument</h3>
          <CodePre>{`// Per-user files — one line
res.download(\`/home/data/users/\${req.user.oid}.db\`)

// Shared DB — pages of code
async function exportUserData(oid) {
  const data = {}
  data.tools     = db.prepare('SELECT * FROM tools WHERE user_id = ?').all(oid)
  data.images    = db.prepare('SELECT * FROM tool_images WHERE tool_id IN (SELECT id FROM tools WHERE user_id = ?)').all(oid)
  data.checkouts = db.prepare('SELECT * FROM checkout_log WHERE user_id = ?').all(oid)
  // ...12 more tables...
  return data
}`}</CodePre>

          <h3>When the shared-DB approach wins</h3>
          <ul>
            <li><strong>You need cross-user queries.</strong> "Top recipes by rating across all users" requires a shared table.</li>
            <li><strong>Sharing between users.</strong> Tabloom's notebook-sharing model needs a shared table — and uses one, with permission middleware (article 11 §7).</li>
            <li><strong>You're past ~100 users.</strong> File-descriptor caching and migration time start mattering.</li>
            <li><strong>You need referential integrity across users.</strong> Rare in personal apps.</li>
          </ul>

          <h3>Hybrid approaches</h3>
          <p>Tabloom isn't per-user; it's a single shared DB with multi-user sharing via permission middleware. The decision tree:</p>
          <ul>
            <li><strong>Single user (Workshop):</strong> Just one shared DB. No <code>user_id</code> column needed because there <em>is</em> no second user.</li>
            <li><strong>Few users, no sharing (Cairn, GLP1, ShopKeep):</strong> Per-user SQLite.</li>
            <li><strong>Few users, with sharing (Tabloom):</strong> Shared DB + permission middleware.</li>
            <li><strong>Many users:</strong> Postgres + Drizzle (PulseWire), even if you don't need sharing yet — saves the migration later.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 3 — OID VALIDATION */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>OID Validation — Security First</h2>
          <p>
            Before any code touches the filesystem with the OID, it must verify the OID is a strict GUID. The JWT
            middleware already validated the token; this is belt-and-braces against future code changes that might pass
            an unvalidated value in.
          </p>

          <h3>The threat</h3>
          <p>
            If <code>oid</code> could be <code>../../etc/passwd</code>, then <code>path.join(USERS_ROOT, oid + '.db')</code>
            escapes the users directory. Even if your JWT auth never produces that, defense in depth dictates a
            character-level whitelist at the resolver itself. <code>path.join</code> is not safe against
            <code>..</code> components.
          </p>

          <h3>Cairn's regex</h3>
          <CodePre>{`// Cairn/lib/userDb.js — verbatim
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function getDb(oid) {
  if (!oid || typeof oid !== 'string' || !GUID_RE.test(oid)) {
    throw new Error('Invalid oid for per-user database')
  }
  const key = oid.toLowerCase()
  // ...rest...
}`}</CodePre>

          <p>The regex requires <strong>exactly</strong> the GUID format Entra ID emits. Three layers of check:</p>
          <ol>
            <li><strong>Truthy:</strong> not <code>null</code> / <code>undefined</code> / <code>''</code></li>
            <li><strong>String type:</strong> not a number or object that might bypass the regex unexpectedly</li>
            <li><strong>GUID shape:</strong> 32 hex chars in 8-4-4-4-12 grouping</li>
          </ol>

          <h3>GLP1's looser variant</h3>
          <CodePre>{`// GLP1/server.js — verbatim
const OID_RE = /^[0-9a-f-]{36}$/i

function getUserDb(oid) {
  if (dbHandles.has(oid)) return dbHandles.get(oid)
  if (!OID_RE.test(oid)) throw new Error('invalid oid')
  // ...
}`}</CodePre>

          <p>GLP1's regex is laxer — it accepts any 36-char string of hex + dashes. Functionally equivalent for valid OIDs from Entra; cleaner to read; same security outcome (no path-traversal characters).</p>

          <h3>Lowercase normalization</h3>
          <p>Cairn lowercases the oid before using it as a key (cache + filename). Reasoning: the same OID arriving as <code>F1A2...</code> and <code>f1a2...</code> from different token issuers wouldn't get two separate files. Even though Entra is consistent, this is a small defensive measure.</p>

          <h3>Where validation lives — defense in depth</h3>
          <CodePre>{`// Layer 1 — auth middleware (always present, runs first)
async function requireAuth(req, res, next) {
  const { payload } = await jwtVerify(token, JWKS, { audience, issuer })
  if (!payload.oid) return res.status(401).end()
  req.userId = payload.oid
  next()
}

// Layer 2 — withUserDb middleware (uses req.userId)
function withUserDb(req, res, next) {
  try {
    req.db = getUserDb(req.userId)  // ← calls getDb, which validates again
    next()
  } catch (err) {
    res.status(500).end()
  }
}

// Layer 3 — getDb / getUserDb (the resolver itself)
function getUserDb(oid) {
  if (!OID_RE.test(oid)) throw new Error('invalid oid')  // ← LAST LINE OF DEFENSE
  // ... open file ...
}`}</CodePre>

          <p>If any future code path bypasses the middleware (CLI tool, background worker, a misrouted call), the resolver's own validation still catches it.</p>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              Defense-in-depth isn't paranoia — it's contract-by-contract programming. Each function defends its own
              invariants, even if its caller "should" already have. Cheap to write, free to read, saves you when the
              caller changes.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 4 — GETDB */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span><code>getDb(oid)</code> — The Resolver</h2>
          <p>One function: take an OID, return a ready-to-use better-sqlite3 handle. Opens on first call, caches thereafter, applies schema on first open.</p>

          <h3>Cairn's full implementation</h3>
          <CodePre>{`// Cairn/lib/userDb.js — verbatim
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, mkdirSync } from 'fs'
import Database from 'better-sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const REPO_ROOT  = path.dirname(__dirname)

// USERS_ROOT defaults to a users/ directory alongside the legacy cairn.db
// file. In App Service that resolves to /home/data/users/.
const LEGACY_DB_PATH = process.env.DB_PATH ?? path.join(REPO_ROOT, 'cairn.db')
const USERS_ROOT = process.env.USERS_DB_ROOT ?? path.join(path.dirname(LEGACY_DB_PATH), 'users')

mkdirSync(USERS_ROOT, { recursive: true })

const SCHEMA = readFileSync(path.join(REPO_ROOT, 'schema.sql'), 'utf8')

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// LRU cache of open connections. For a personal app the working set is
// 1-5 users; cap at 50 with eviction so a misconfigured deploy can't
// leak file descriptors.
const MAX_CACHE = 50
const cache = new Map()

export function getDb(oid) {
  if (!oid || typeof oid !== 'string' || !GUID_RE.test(oid)) {
    throw new Error('Invalid oid for per-user database')
  }
  const key = oid.toLowerCase()

  const cached = cache.get(key)
  if (cached) {
    // Bump to most-recently-used.
    cache.delete(key)
    cache.set(key, cached)
    return cached
  }

  const dbPath = path.join(USERS_ROOT, \`\${key}.db\`)
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(SCHEMA)

  cache.set(key, db)
  if (cache.size > MAX_CACHE) {
    const oldestKey = cache.keys().next().value
    const oldest = cache.get(oldestKey)
    cache.delete(oldestKey)
    try { oldest.close() } catch { /* best-effort */ }
  }

  return db
}`}</CodePre>

          <h3>What's happening, line by line</h3>
          <ol>
            <li><strong>L18-22:</strong> Compute the users directory. Default to <code>{`<repo>/users/`}</code>, override via <code>USERS_DB_ROOT</code>. On App Service this resolves to <code>/home/data/users/</code>.</li>
            <li><strong>L24:</strong> Create the directory (idempotent).</li>
            <li><strong>L26:</strong> Read the schema file once at module load. Avoids re-reading on every <code>getDb</code> call.</li>
            <li><strong>L28:</strong> Compile the GUID regex once at module load.</li>
            <li><strong>L33-34:</strong> Module-level <code>Map</code> as cache. Max 50 entries.</li>
            <li><strong>L36-39:</strong> Validate the OID. Throw if invalid — caller's <code>withUserDb</code> catches and 500s.</li>
            <li><strong>L40:</strong> Normalize to lowercase.</li>
            <li><strong>L42-47:</strong> Cache hit path. Map iterates in insertion order, so deleting and re-setting bumps the entry to "most recently used" position.</li>
            <li><strong>L50-54:</strong> Cache miss path. Open the file, apply pragmas, apply schema.</li>
            <li><strong>L56-61:</strong> Eviction. If we're over capacity, evict the oldest entry (first iteration position) and <code>close()</code> its handle.</li>
          </ol>

          <h3>ShopKeep's variant — unbounded cache + seeding</h3>
          <CodePre>{`// ShopKeep/server.js — verbatim, lines 273-286
const dbConnections = new Map()

function getDb(userId) {
  if (dbConnections.has(userId)) return dbConnections.get(userId)
  const userDb = new Database(join(DB_DIR, \`\${userId}.db\`))
  userDb.pragma('journal_mode = WAL')
  userDb.pragma('foreign_keys = ON')
  initSchema(userDb)        // ← runs CREATE TABLE IF NOT EXISTS + ALTER migrations
  seedCategories(userDb)    // ← seeds 23 default tool categories if table empty
  seedSampleTools(userDb)   // ← seeds 3 sample tools if table empty
  dbConnections.set(userId, userDb)
  return userDb
}`}</CodePre>

          <p>No LRU. ShopKeep's working set is tiny (it's a single-household app), so unbounded growth isn't a problem. Cairn's cap is a "what if I made a mistake later" hedge.</p>

          <h3>GLP1's variant — same shape</h3>
          <CodePre>{`// GLP1/server.js — verbatim, lines 235-279 (truncated)
const OID_RE = /^[0-9a-f-]{36}$/i
const dbHandles = new Map()

function getUserDb(oid) {
  if (dbHandles.has(oid)) return dbHandles.get(oid)
  if (!OID_RE.test(oid)) throw new Error('invalid oid')

  mkdirSync(USERS_DIR, { recursive: true })
  const target = join(USERS_DIR, \`\${oid}.db\`)

  // (legacy migration block — see §8)

  const db = new Database(target)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(SCHEMA_SQL)
  applyMigrations(db)

  dbHandles.set(oid, db)
  return db
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 5 — WITHUSERDB */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span><code>withUserDb</code> Middleware</h2>
          <p>The bridge between auth and route handlers: take <code>req.userId</code>, call <code>getDb</code>, attach the handle to <code>req.db</code>.</p>

          <h3>GLP1's implementation</h3>
          <CodePre>{`// GLP1/server.js — verbatim, lines 306-314
function withUserDb(req, res, next) {
  try {
    req.db = getUserDb(req.userId)
    next()
  } catch (err) {
    console.error('[withUserDb]', err.message)
    res.status(500).json({ error: 'db unavailable' })
  }
}`}</CodePre>

          <h3>The wire-up</h3>
          <CodePre>{`// Apply auth + per-user DB to everything under /api/*
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()   // exempt health check
  return requireAuth(req, res, next)
})

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  return withUserDb(req, res, next)
})

// Now every route handler under /api can use req.db:
app.get('/api/weight', (req, res) => {
  const rows = req.db.prepare('SELECT * FROM weight_logs ORDER BY date DESC').all()
  res.json(rows)
})`}</CodePre>

          <h3>Why this order is right</h3>
          <ol>
            <li><strong>requireAuth runs first.</strong> It validates the JWT and sets <code>req.userId</code>.</li>
            <li><strong>withUserDb runs second.</strong> It depends on <code>req.userId</code> being set. If auth failed, this never runs.</li>
            <li><strong>Route handlers run third.</strong> Both <code>req.user</code> (from auth) and <code>req.db</code> (from withUserDb) are populated.</li>
          </ol>

          <h3>One handler, no auth thinking</h3>
          <p>Once you're in the route handler, there's <strong>zero</strong> auth code to write. The query just uses <code>req.db</code>:</p>
          <CodePre>{`router.post('/api/recipes', (req, res) => {
  const { title, ingredients } = req.body
  // NO WHERE user_id = ? — because req.db IS the user's database
  const info = req.db.prepare('INSERT INTO recipes (title) VALUES (?)').run(title)
  res.status(201).json({ id: Number(info.lastInsertRowid) })
})`}</CodePre>

          <p>Compare with a shared DB approach where the same route needs every query gated:</p>
          <CodePre>{`router.post('/api/recipes', (req, res) => {
  const { title, ingredients } = req.body
  // EVERY query needs the WHERE — forget once = leak
  const info = db.prepare('INSERT INTO recipes (user_id, title) VALUES (?, ?)').run(req.user.oid, title)
  res.status(201).json({ id: Number(info.lastInsertRowid) })
})`}</CodePre>

          <h3>The "user has no DB yet" case</h3>
          <p>First-time login: <code>users/&lt;oid&gt;.db</code> doesn't exist. <code>better-sqlite3</code>'s <code>new Database(path)</code> creates the file. Schema and seed run on the same call. By the time <code>getDb</code> returns, the file exists and the user can write.</p>
          <p>No "register" or "create profile" step needed — the user's first authenticated request creates everything.</p>
        </section>

        <hr />

        {/* SECTION 6 — SCHEMA INIT + SEEDING */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Schema Init + Seeding on First Open</h2>
          <p>Every <code>getDb</code> call applies the schema. Idempotent <code>CREATE TABLE IF NOT EXISTS</code> means it's a no-op after the first time. Seeding needs explicit "is this table empty?" guards.</p>

          <h3>ShopKeep's full first-open flow</h3>
          <CodePre>{`function getDb(userId) {
  if (dbConnections.has(userId)) return dbConnections.get(userId)
  const userDb = new Database(join(DB_DIR, \`\${userId}.db\`))
  userDb.pragma('journal_mode = WAL')
  userDb.pragma('foreign_keys = ON')

  initSchema(userDb)          // ← CREATE TABLE IF NOT EXISTS + addColIfMissing
  seedCategories(userDb)      // ← seeds only if categories table is empty
  seedSampleTools(userDb)     // ← seeds only if tools table is empty

  dbConnections.set(userId, userDb)
  return userDb
}`}</CodePre>

          <h3>ShopKeep's seed-only-if-empty guards</h3>
          <CodePre>{`// ShopKeep/server.js — verbatim, lines 245-266
function seedCategories(db) {
  if (db.prepare('SELECT COUNT(*) as c FROM categories').get().c === 0) {
    const insertCat = db.prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?)')
    const insertSub = db.prepare('INSERT INTO sub_categories (category_id, name, sort_order) VALUES (?, ?, ?)')
    SEED_CATEGORIES.forEach((cat, i) => {
      const { lastInsertRowid } = insertCat.run(cat.name, i)
      cat.subs.forEach((sub, j) => insertSub.run(lastInsertRowid, sub, j))
    })
    console.log('Seeded categories from defaults.')
  }
}

function seedSampleTools(db) {
  if (db.prepare('SELECT COUNT(*) as c FROM tools').get().c === 0) {
    const ins = db.prepare(
      "INSERT INTO tools (name, category, sub_category, condition, status) VALUES (?, ?, ?, ?, ?)"
    )
    ins.run('Claw Hammer',       'Striking & Driving',          'Claw hammers',   'good', 'available')
    ins.run('25ft Tape Measure', 'Measuring, Layout & Marking', 'Tape measures',  'good', 'available')
    ins.run('Cordless Drill',    'Portable Power Tools',        'Cordless drills','good', 'available')
  }
}`}</CodePre>

          <h3>Why the count-zero guard matters</h3>
          <p>If you reseed on every getDb call (no guard), the user who deletes the sample tools would see them re-appear on every login. The guard says "seed only when the table is genuinely empty, which can only happen on first open."</p>
          <p>Same logic applies to inventory categories in Hearth (single-DB), tool categories in ShopKeep (per-user). 23 categories. 3 sample tools. The user can edit or delete them; they never come back.</p>

          <h3>Migration during getDb (GLP1)</h3>
          <CodePre>{`// GLP1's getUserDb calls applyMigrations on every open
const db = new Database(target)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(SCHEMA_SQL)
applyMigrations(db)            // ← runs additive try/catch ALTER TABLE statements
dbHandles.set(oid, db)

// applyMigrations elsewhere in server.js:
function applyMigrations(db) {
  try { db.exec('ALTER TABLE settings ADD COLUMN lastBackupAt TEXT') } catch { /* already exists */ }
  try { db.exec(\`ALTER TABLE meals ADD COLUMN photoDataUrl TEXT DEFAULT ''\`) } catch { /* already exists */ }
}`}</CodePre>

          <p>Critical: migrations run for every user file independently. When you ship a new ALTER, each user's DB picks it up on their first request after the deploy. No coordinator, no "did everyone get migrated?" worry — every file self-migrates lazily.</p>

          <h3>What happens to inactive users</h3>
          <p>If a user hasn't signed in for 6 months, their DB still has the old schema. On their next sign-in, all 6 months' worth of pending migrations apply. The pattern is robust to this — each ALTER is idempotent, and the sequence has no dependencies on previous state.</p>
        </section>

        <hr />

        {/* SECTION 7 — CACHING */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Connection Caching — Map + LRU Eviction</h2>
          <p>Opening a SQLite file is fast (~5ms) but not free. Holding the handle in a module-level Map skips that cost on every request after the first.</p>

          <h3>The case for a cap</h3>
          <p>
            <code>better-sqlite3</code> handles wrap an OS file descriptor. Each open <code>.db</code> file uses one
            FD; WAL mode adds two more (<code>.db-wal</code>, <code>.db-shm</code>). Linux's default ulimit is 1024 FDs
            per process. If your app saw 400 unique users in a deploy and you held all their handles, you'd be at 1200
            FDs and crash.
          </p>
          <p>For personal apps this'll never happen. But Cairn's <code>MAX_CACHE = 50</code> is the right way to encode the bound — it costs nothing and prevents a future bug.</p>

          <h3>The LRU eviction trick</h3>
          <CodePre>{`// Cairn/lib/userDb.js — relevant lines
const cache = new Map()

// Cache hit: bump to "most recently used" position
const cached = cache.get(key)
if (cached) {
  cache.delete(key)
  cache.set(key, cached)
  return cached
}

// Cache miss: insert + evict if over capacity
cache.set(key, db)
if (cache.size > MAX_CACHE) {
  const oldestKey = cache.keys().next().value
  const oldest = cache.get(oldestKey)
  cache.delete(oldestKey)
  try { oldest.close() } catch { /* best-effort */ }
}`}</CodePre>

          <p>The trick: <code>Map</code> iteration order in JavaScript is insertion order. <code>cache.keys().next().value</code> is the entry inserted longest ago. Re-inserting on cache hit moves it to "newest." Net effect: LRU with O(1) get + put.</p>

          <h3>Why close() the evicted handle</h3>
          <p>If you evict without closing, the file descriptor stays open until garbage collection. GC timing is unpredictable; on App Service B1 with 1.75GB RAM, you might never GC until OOM. <code>close()</code> deterministically returns the FD to the pool.</p>

          <h3>Closing on shutdown</h3>
          <p>GLP1's pattern — close every handle on SIGTERM so the OS doesn't have to clean up:</p>
          <CodePre>{`// GLP1/server.js — verbatim
function closeAllDbs() {
  for (const db of dbHandles.values()) {
    try { db.close() } catch { /* ignore */ }
  }
  dbHandles.clear()
}
process.on('SIGTERM', closeAllDbs)
process.on('SIGINT',  () => { closeAllDbs(); process.exit(0) })`}</CodePre>

          <p>App Service sends SIGTERM ~30 seconds before SIGKILL. The handler catches in-flight writes, closes handles, flushes WAL. Without it: the WAL file might be slightly behind on the next boot, requiring a recovery pass.</p>

          <h3>When the cache is wrong</h3>
          <p>Three scenarios where you must skip the cache (none of which happen in normal fleet operation):</p>
          <ul>
            <li><strong>The DB file was rotated on disk.</strong> If you manually <code>mv users/&lt;oid&gt;.db users/&lt;oid&gt;.db.old</code> while the app's running, the cached handle still points at the old (unlinked) inode.</li>
            <li><strong>Schema changed at runtime.</strong> If you somehow edit <code>schema.sql</code> while the server's running, only new opens see it.</li>
            <li><strong>Bug recovery.</strong> If a write fails and leaves the DB in a weird state, sometimes closing + reopening clears it. Rare.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 8 — LEGACY MIGRATION */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Migrating a Legacy Single-User DB</h2>
          <p>GLP1 was originally single-user. When per-user isolation landed, the primary user's existing <code>glp1.db</code> needed to become <code>users/&lt;primary-oid&gt;.db</code> on first sign-in. GLP1 handles this inside <code>getUserDb</code>:</p>

          <h3>The migration block</h3>
          <CodePre>{`// GLP1/server.js — verbatim, lines 246-269
function getUserDb(oid) {
  if (dbHandles.has(oid)) return dbHandles.get(oid)
  if (!OID_RE.test(oid)) throw new Error('invalid oid')

  mkdirSync(USERS_DIR, { recursive: true })
  const target = join(USERS_DIR, \`\${oid}.db\`)

  // One-shot legacy DB migration for the primary user.
  if (
    PRIMARY_USER_OID && oid === PRIMARY_USER_OID &&
    !existsSync(target) && existsSync(LEGACY_DB_PATH)
  ) {
    try {
      renameSync(LEGACY_DB_PATH, target)
      // Move WAL siblings if present so WAL state stays consistent.
      for (const ext of ['-shm', '-wal']) {
        const from = LEGACY_DB_PATH + ext
        if (existsSync(from)) {
          try { renameSync(from, target + ext) } catch { /* tolerated */ }
        }
      }
      console.log(\`[migrate] moved legacy DB → \${target}\`)
    } catch (err) {
      // If the legacy file vanished between the check and rename (e.g. another
      // request raced us), recheck existence and continue without aborting.
      if (existsSync(target)) {
        // someone else won the race, we can use the moved file
      } else {
        throw err
      }
    }
  }

  const db = new Database(target)
  // ... open, schema, migrations as usual ...
}`}</CodePre>

          <h3>What's robust about this</h3>
          <ol>
            <li><strong>Gated by both conditions.</strong> Only fires if the target doesn't exist AND the legacy file does. Subsequent calls (target now exists) skip the block entirely.</li>
            <li><strong>WAL sidecar files move together.</strong> <code>.db</code> alone would lose the in-flight WAL content.</li>
            <li><strong>Race-safe.</strong> If two requests arrive simultaneously and both pass the existence check, one wins the rename, the other catches the error and verifies the target now exists.</li>
            <li><strong>One-shot.</strong> After the first migration, <code>LEGACY_DB_PATH</code> no longer exists. The block is dead code for all subsequent calls.</li>
          </ol>

          <h3>The general legacy-data-migration recipe</h3>
          <ol>
            <li><strong>Detect:</strong> "should this be migrated?" (typically: target doesn't exist + source does)</li>
            <li><strong>Move atomically:</strong> rename, not copy (rename is one syscall, atomic on the same filesystem)</li>
            <li><strong>Handle sidecars:</strong> for SQLite WAL, the <code>.db-shm</code> and <code>.db-wal</code> files must accompany the main <code>.db</code></li>
            <li><strong>Handle races:</strong> two requests might both think they need to migrate; only one will succeed at the rename, the other should re-check and continue</li>
            <li><strong>Log it:</strong> migrations should leave a console trail you can find in the App Service log stream</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 9 — WHEN NOT TO USE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>When NOT to Use This Pattern</h2>
          <p>Per-user SQLite is the right call for ~1-50 user personal apps with no sharing. Outside that envelope, three alternatives are usually better.</p>

          <h3>Signal 1: You need to share data between users</h3>
          <p>If user A sends a notebook to user B (Tabloom) or user A's tool gets borrowed by user B (ShopKeep multi-user variant), you can't represent the shared resource in two separate files. Either:</p>
          <ul>
            <li><strong>Shared DB + permission middleware</strong> (Tabloom's actual pick) — one file, role-based access checks.</li>
            <li><strong>Per-user + sync engine</strong> (complex, only if you've gone full CRDT).</li>
          </ul>

          <h3>Signal 2: Cross-user queries are routine</h3>
          <p>"Show me the most-viewed recipe across all users." With per-user files, you'd iterate every file, run the query, aggregate. Slow and clumsy at any user count. Shared DB beats this trivially.</p>

          <h3>Signal 3: You're past ~100 active users</h3>
          <p>Even with the cache cap, opening 100 files per minute (worst case for cold starts after a deploy) adds up. Migration time × 100 files = noticeable startup latency. At this scale, Postgres + Drizzle (PulseWire's stack) is the natural next step.</p>

          <h3>Signal 4: You need ACID across users</h3>
          <p>"Transfer 10 credits from user A to user B" needs both updates to commit together or neither. With per-user files, no single transaction spans both. You'd need a two-phase commit protocol, which is expensive and rare to need correctly. Shared DB is the right tool.</p>

          <h3>Signal 5: Per-user backups are not a feature you need</h3>
          <p>If your backup story is "snapshot the whole environment nightly to blob storage," there's no advantage to per-user files. The export-my-data and delete-my-data wins evaporate when the backup is opaque anyway.</p>

          <h3>The simplest decision tree</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  Q1{One user, ever?}
  Q1 -->|Yes| A1[Shared DB,<br/>no user_id needed]
  Q1 -->|No| Q2{Users share data?}
  Q2 -->|Yes| A2[Shared DB +<br/>permission middleware]
  Q2 -->|No| Q3{Over 100 users?}
  Q3 -->|Yes| A3[Postgres + ORM]
  Q3 -->|No| A4[Per-user SQLite<br/>This pattern]`} />
        </section>

        <hr />

        {/* SECTION 10 — BACKUPS */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Backups + Failure Modes</h2>

          <h3>Per-user backup strategy</h3>
          <p>You have two viable options:</p>
          <ol>
            <li><strong>Backup the whole users/ directory</strong> as a tarball nightly. Simple. Works for any number of users.</li>
            <li><strong>Backup each .db individually</strong> using <code>db.backup()</code>. More moving parts, but each user's snapshot is independently restorable.</li>
          </ol>

          <h3>Tarball pattern</h3>
          <CodePre>{`import { exec } from 'child_process'
import { promisify } from 'util'
const run = promisify(exec)

async function nightlyBackup() {
  const today = new Date().toISOString().slice(0, 10)
  const out = \`/home/data/backups/users-\${today}.tar.gz\`
  await run(\`tar -czf \${out} -C /home/data users\`)
  console.log(\`[backup] tarball → \${out}\`)
}

setInterval(nightlyBackup, 24 * 60 * 60 * 1000)`}</CodePre>

          <p>Caveat: this copies live <code>.db</code> + <code>.db-wal</code> + <code>.db-shm</code> files. Under WAL with active writers, the snapshot may be inconsistent. Acceptable for personal apps (the active user is unlikely to be writing at 3am); not OK for high-throughput multi-user.</p>

          <h3>Online-backup-per-file pattern</h3>
          <CodePre>{`async function nightlyBackup() {
  const today = new Date().toISOString().slice(0, 10)
  const backupRoot = \`/home/data/backups/\${today}\`
  await mkdir(backupRoot, { recursive: true })

  // Iterate every open + on-disk user file
  const files = await readdir(USERS_DIR)
  for (const f of files) {
    if (!f.endsWith('.db')) continue
    const oid = f.slice(0, -3)
    const db = getDb(oid)   // ← reuse the cache; opens if not already
    await db.backup(join(backupRoot, f))
  }
  console.log(\`[backup] backed up \${files.length} per-user files → \${backupRoot}\`)
}`}</CodePre>

          <p>The benefit: <code>db.backup()</code> is safe under concurrent writes. The cost: 50 users = 50 file opens for the backup pass.</p>

          <h3>The export-my-data endpoint</h3>
          <CodePre>{`router.get('/api/me/export', requireAuth, async (req, res) => {
  const oid = req.user.oid
  const sourcePath = join(USERS_DIR, \`\${oid}.db\`)
  const tmpPath = join(TMP_DIR, \`\${oid}-export.db\`)

  // Use online backup so we don't ship a partial WAL state
  await getDb(oid).backup(tmpPath)

  res.download(tmpPath, \`my-data-\${new Date().toISOString().slice(0,10)}.db\`, async (err) => {
    await unlink(tmpPath).catch(() => {})
    if (err) console.error('[export]', err)
  })
})`}</CodePre>

          <h3>The delete-my-account endpoint</h3>
          <CodePre>{`router.delete('/api/me', requireAuth, async (req, res) => {
  const oid = req.user.oid
  // Close + evict the cached handle first
  const cached = cache.get(oid.toLowerCase())
  if (cached) {
    try { cached.close() } catch {}
    cache.delete(oid.toLowerCase())
  }
  // Then unlink the file (and sidecars)
  for (const ext of ['', '-wal', '-shm']) {
    await unlink(join(USERS_DIR, \`\${oid}.db\${ext}\`)).catch(() => {})
  }
  res.status(204).end()
})`}</CodePre>

          <h3>Failure modes</h3>
          <table>
            <tbody>
              <tr><th>Failure</th><th>Symptom</th><th>Recovery</th></tr>
              <tr><td>OOM during seed transaction</td><td>Partial seed; some categories present, some missing</td><td>Reseed function: drop and re-insert. Or accept; subsequent CRUD doesn't depend on completeness.</td></tr>
              <tr><td>File descriptor leak</td><td><code>EMFILE: too many open files</code></td><td>Cap the cache. Cairn's pattern. Add <code>ulimit -n 4096</code> to entrypoint.</td></tr>
              <tr><td>Corrupted .db (extremely rare)</td><td>SQLite throws "database disk image is malformed"</td><td>Restore from backup. Affected user only.</td></tr>
              <tr><td>Disk full</td><td>Write fails with <code>SQLITE_FULL</code></td><td>Free space (cleanup old backups) and retry. Use App Service quotas to detect early.</td></tr>
              <tr><td>Lost WAL file</td><td>Pre-WAL state; lose last N writes</td><td>Restore from backup. Don't delete WAL sidecars manually.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build the Full Per-User Stack</h2>
          <p>Stand up an Express backend with per-user SQLite, GUID-validated OID, LRU cache, schema init + seed, and an export-my-data endpoint. Same shape as Cairn / GLP1 / ShopKeep.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`mkdir per-user-lab && cd per-user-lab
npm init -y
npm pkg set type=module
npm i express cors better-sqlite3 dotenv`}</CodePre>

          <h3>Step 2 — schema.sql</h3>
          <CodePre>{`-- schema.sql
CREATE TABLE IF NOT EXISTS notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  body       TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);

CREATE TRIGGER IF NOT EXISTS trg_notes_updated_at
AFTER UPDATE ON notes FOR EACH ROW
BEGIN
  UPDATE notes SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS tags (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);`}</CodePre>

          <h3>Step 3 — lib/userDb.js</h3>
          <CodePre>{`// lib/userDb.js
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, mkdirSync } from 'fs'
import Database from 'better-sqlite3'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const REPO_ROOT  = path.dirname(__dirname)

const USERS_ROOT = process.env.USERS_DB_ROOT ?? path.join(REPO_ROOT, 'users')
mkdirSync(USERS_ROOT, { recursive: true })

const SCHEMA = readFileSync(path.join(REPO_ROOT, 'schema.sql'), 'utf8')

const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const MAX_CACHE = 50
const cache = new Map()

function seedDefaultTags(db) {
  if (db.prepare('SELECT COUNT(*) AS n FROM tags').get().n === 0) {
    const ins = db.prepare('INSERT INTO tags (name) VALUES (?)')
    const tx = db.transaction(() => {
      ['inbox', 'starred', 'archive'].forEach(t => ins.run(t))
    })
    tx()
    console.log(\`[\${db.name}] seeded 3 default tags\`)
  }
}

export function getDb(oid) {
  if (!oid || typeof oid !== 'string' || !GUID_RE.test(oid)) {
    throw new Error('Invalid oid')
  }
  const key = oid.toLowerCase()

  const cached = cache.get(key)
  if (cached) {
    cache.delete(key)
    cache.set(key, cached)
    return cached
  }

  const dbPath = path.join(USERS_ROOT, \`\${key}.db\`)
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(SCHEMA)
  seedDefaultTags(db)

  cache.set(key, db)
  if (cache.size > MAX_CACHE) {
    const oldestKey = cache.keys().next().value
    const oldest = cache.get(oldestKey)
    cache.delete(oldestKey)
    try { oldest.close() } catch {}
  }

  return db
}

export function closeAll() {
  for (const db of cache.values()) {
    try { db.close() } catch {}
  }
  cache.clear()
}`}</CodePre>

          <h3>Step 4 — middleware/withUserDb.js</h3>
          <CodePre>{`// middleware/withUserDb.js
import { getDb } from '../lib/userDb.js'

// For this lab, accept oid via a custom header instead of JWT (cuts complexity)
export function requireOidHeader(req, res, next) {
  const oid = req.header('x-user-oid')
  if (!oid) return res.status(401).json({ error: 'missing X-User-OID header' })
  req.userId = oid
  next()
}

export function withUserDb(req, res, next) {
  try {
    req.db = getDb(req.userId)
    next()
  } catch (err) {
    console.error('[withUserDb]', err.message)
    res.status(500).json({ error: 'db unavailable' })
  }
}`}</CodePre>

          <h3>Step 5 — server.js</h3>
          <CodePre>{`// server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { requireOidHeader, withUserDb } from './middleware/withUserDb.js'
import { closeAll } from './lib/userDb.js'
import { existsSync, unlinkSync } from 'fs'
import { join } from 'path'

const app = express()
app.use(cors())
app.use(express.json())

// Public health
app.get('/api/health', (req, res) => res.json({ ok: true }))

// All /api/* (except health) requires OID + DB
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  return requireOidHeader(req, res, next)
})
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  return withUserDb(req, res, next)
})

// Routes — note: ZERO auth code in the handler, ZERO user_id columns
app.get('/api/notes', (req, res) => {
  res.json(req.db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all())
})

app.post('/api/notes', (req, res) => {
  const { title, body } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const info = req.db.prepare('INSERT INTO notes (title, body) VALUES (?, ?)').run(title, body ?? '')
  res.status(201).json({ id: Number(info.lastInsertRowid) })
})

app.delete('/api/notes/:id', (req, res) => {
  const info = req.db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'not found' })
  res.status(204).end()
})

app.get('/api/tags', (req, res) => {
  res.json(req.db.prepare('SELECT * FROM tags').all())
})

// Graceful shutdown
process.on('SIGTERM', () => { closeAll(); process.exit(0) })
process.on('SIGINT',  () => { closeAll(); process.exit(0) })

const port = process.env.PORT ?? 3000
app.listen(port, () => console.log(\`🚀 backend on :\${port}\`))`}</CodePre>

          <h3>Step 6 — Try it</h3>
          <CodePre>{`# Start the server
node server.js

# Health (no auth needed)
curl http://localhost:3000/api/health

# Wrong OID format — rejected by the resolver
curl -H 'X-User-OID: not-a-guid' http://localhost:3000/api/tags
# → 500 db unavailable

# Valid OID format — opens fresh DB, seeds 3 tags
curl -H 'X-User-OID: 11111111-1111-1111-1111-111111111111' http://localhost:3000/api/tags
# → [{"id":1,"name":"inbox"},{"id":2,"name":"starred"},{"id":3,"name":"archive"}]

# Add a note for user A
curl -X POST \\
  -H 'Content-Type: application/json' \\
  -H 'X-User-OID: 11111111-1111-1111-1111-111111111111' \\
  -d '{"title":"Hello"}' \\
  http://localhost:3000/api/notes

# List user A's notes
curl -H 'X-User-OID: 11111111-1111-1111-1111-111111111111' http://localhost:3000/api/notes
# → [{"id":1,"title":"Hello","body":"","created_at":"..."}]

# User B sees nothing — totally isolated
curl -H 'X-User-OID: 22222222-2222-2222-2222-222222222222' http://localhost:3000/api/notes
# → []`}</CodePre>

          <h3>Step 7 — Look at the file system</h3>
          <CodePre>{`ls users/
# 11111111-1111-1111-1111-111111111111.db
# 11111111-1111-1111-1111-111111111111.db-shm
# 11111111-1111-1111-1111-111111111111.db-wal
# 22222222-2222-2222-2222-222222222222.db
# 22222222-2222-2222-2222-222222222222.db-shm
# 22222222-2222-2222-2222-222222222222.db-wal`}</CodePre>

          <p>Each user has their own three files. User A's notes are in user A's DB only. Open it directly:</p>
          <CodePre>{`sqlite3 users/11111111-1111-1111-1111-111111111111.db "SELECT * FROM notes"
# 1|Hello||2026-05-26 14:23:01|2026-05-26 14:23:01`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated the per-user pattern end-to-end: validated OID, getDb resolver, LRU-capped cache, schema
              init, idempotent seed, withUserDb middleware. The route handlers are clean of auth concerns because the
              file path is the trust boundary.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Invalid oid for per-user database"</h3>
          <p>The OID didn't match the GUID regex. Either: (a) the JWT's <code>oid</code> claim is missing or malformed, (b) the middleware didn't run before the resolver, (c) a developer tool / test rig is hitting the route with a fake header. Check the regex matches Entra's format exactly.</p>

          <h3>"EMFILE: too many open files"</h3>
          <p>Your cache is unbounded and you've accumulated more open handles than the OS allows. Cap it (Cairn's <code>MAX_CACHE = 50</code> pattern). On App Service, the container's <code>ulimit -n</code> is usually 1024; raise via Dockerfile if you have legitimate need.</p>

          <h3>"SQLITE_BUSY: database is locked"</h3>
          <p>Rare in per-user mode (each user is alone in their DB). If you see it: another process is touching the file (e.g. a backup script doing <code>cp</code> without using the online backup API). Switch to <code>db.backup()</code> or pause writes during the backup window.</p>

          <h3>User reports "my data disappeared after I logged in"</h3>
          <p>Almost always: the OID changed between sessions. Causes: (a) the user signed in with a different account (work vs personal Microsoft account both work), (b) the JWT claim's case changed and you didn't lowercase, (c) the user's Entra ID rotated for some unusual reason. Audit the log — does the request's OID match the previous file?</p>

          <h3>Schema changes don't apply to existing users</h3>
          <p>You added <code>CREATE TABLE IF NOT EXISTS</code> but no ALTER for existing files. CREATE-IF-NOT-EXISTS only creates new tables; it doesn't add columns to existing ones. Add an <code>ALTER TABLE</code> in try/catch (or addColIfMissing) for every retroactive column.</p>

          <h3>The deploy bumps Node version → all per-user DBs need migration</h3>
          <p>This isn't actually a problem — each user's DB self-migrates on their next request. But the FIRST request after a deploy is slower for each user. If your fleet is 50 users, expect 50 slow requests spread over the day after deploy.</p>

          <h3>"better-sqlite3 file is encrypted or is not a database"</h3>
          <p>The DB file is corrupted. Restore from backup. Per-user file means only that user's affected.</p>

          <h3>Backup tarball is missing files</h3>
          <p>You're racing the user's active write. SQLite WAL guarantees ACID for the next read-after-checkpoint, but a tar.gz that catches the WAL mid-write captures inconsistent state. Use the online backup API instead.</p>

          <h3>"I want to query across all users for an admin dashboard"</h3>
          <p>This is the signal §9 talks about. Two options: (a) iterate every file, run the query, aggregate (slow), (b) maintain a separate "aggregates" shared DB that each user's writes also update (complex, ETL-shaped). If admin queries are routine, you're past the pattern's envelope — move to a shared DB.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The 5 files</h3>
          <CodePre>{`schema.sql                          -- canonical schema, applied to every user file
lib/userDb.js                       -- the getDb resolver
middleware/auth.js                  -- JWT verification, sets req.user.oid
middleware/withUserDb.js            -- calls getDb, attaches req.db
server.js                           -- mounts middleware in order: auth → withUserDb → routes`}</CodePre>

          <h3>The OID regex</h3>
          <CodePre>{`const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`}</CodePre>

          <h3>getDb skeleton</h3>
          <CodePre>{`const cache = new Map()
const MAX_CACHE = 50

export function getDb(oid) {
  if (!GUID_RE.test(oid)) throw new Error('invalid oid')
  const key = oid.toLowerCase()

  const cached = cache.get(key)
  if (cached) { cache.delete(key); cache.set(key, cached); return cached }

  const db = new Database(path.join(USERS_ROOT, \`\${key}.db\`))
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(SCHEMA)
  seedDefaults(db)

  cache.set(key, db)
  if (cache.size > MAX_CACHE) {
    const oldestKey = cache.keys().next().value
    try { cache.get(oldestKey).close() } catch {}
    cache.delete(oldestKey)
  }
  return db
}`}</CodePre>

          <h3>withUserDb skeleton</h3>
          <CodePre>{`export function withUserDb(req, res, next) {
  try {
    req.db = getDb(req.user.oid)
    next()
  } catch (err) {
    res.status(500).json({ error: 'db unavailable' })
  }
}`}</CodePre>

          <h3>Seed-only-if-empty</h3>
          <CodePre>{`function seedTags(db) {
  if (db.prepare('SELECT COUNT(*) AS n FROM tags').get().n === 0) {
    const ins = db.prepare('INSERT INTO tags (name) VALUES (?)')
    db.transaction(() => DEFAULTS.forEach(t => ins.run(t)))()
  }
}`}</CodePre>

          <h3>SIGTERM cleanup</h3>
          <CodePre>{`function closeAll() {
  for (const db of cache.values()) {
    try { db.close() } catch {}
  }
  cache.clear()
}
process.on('SIGTERM', closeAll)
process.on('SIGINT',  () => { closeAll(); process.exit(0) })`}</CodePre>

          <h3>Decision tree</h3>
          <table>
            <tbody>
              <tr><th>Situation</th><th>Pick</th></tr>
              <tr><td>1 user only</td><td>Shared DB, no user_id column</td></tr>
              <tr><td>2-50 users, no sharing</td><td>Per-user SQLite ✓ this pattern</td></tr>
              <tr><td>2-50 users, with sharing</td><td>Shared DB + permission middleware</td></tr>
              <tr><td>50+ users</td><td>Postgres + ORM</td></tr>
              <tr><td>Cross-user queries routine</td><td>Shared DB regardless</td></tr>
              <tr><td>Need cross-user transactions</td><td>Shared DB regardless</td></tr>
            </tbody>
          </table>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>GUID regex + getDb resolver</td><td>Cairn · <code>lib/userDb.js</code> (full file)</td></tr>
              <tr><td>LRU eviction with close()</td><td>Cairn · <code>lib/userDb.js:33-63</code></td></tr>
              <tr><td>withUserDb middleware</td><td>GLP1 · <code>server.js:306-314</code></td></tr>
              <tr><td>Unbounded cache + seed-on-open</td><td>ShopKeep · <code>server.js:273-286</code></td></tr>
              <tr><td>Seed-only-if-empty</td><td>ShopKeep · <code>server.js:245-266</code></td></tr>
              <tr><td>Legacy single-user → per-user migration</td><td>GLP1 · <code>server.js:246-269</code></td></tr>
              <tr><td>SIGTERM closeAll</td><td>GLP1 · <code>server.js:316-324</code></td></tr>
              <tr><td>Apply migrations on every open</td><td>GLP1 · <code>server.js:225-232</code> (applyMigrations)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — Phase 1's backend foundations are complete.</p>
        </section>
      </main>
    </div>
  );
}
