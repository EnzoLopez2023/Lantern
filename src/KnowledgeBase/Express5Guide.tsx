import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Express 5 — What Changed',         icon: '✨' },
  { id: 's3',  num: '3',  title: 'Single-File server.js',            icon: '📄' },
  { id: 's4',  num: '4',  title: 'Router-per-Domain',                icon: '🧩' },
  { id: 's5',  num: '5',  title: 'Middleware Order',                 icon: '🚦' },
  { id: 's6',  num: '6',  title: 'Auth Middleware',                  icon: '🔐' },
  { id: 's7',  num: '7',  title: 'Permission Middleware',            icon: '🛂' },
  { id: 's8',  num: '8',  title: 'SSE Streaming',                    icon: '📡' },
  { id: 's9',  num: '9',  title: 'Static + SPA Fallback',            icon: '📦' },
  { id: 's10', num: '10', title: 'Error Handling',                   icon: '⚠️' },
  { id: 's11', num: '★',  title: 'Lab — Build a Backend',            icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                  icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                      icon: '📋' },
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

export default function Express5Guide() {
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
            <span className="sidebar-title">Express 5 Patterns</span>
          </div>
          <div className="sidebar-sub">single-file backends in production</div>
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
          <div className="hero-tag">🛠️ Express 5.1 · Node 22/24 · 2026</div>
          <h1>Express 5<br />Server Patterns</h1>
          <p>
            Seven fleet apps run an Express 5 backend (the eighth, PulseWire, is Next.js). Most are <em>single-file
            <code>server.js</code></em> — 600 to 3000 lines — with router-per-domain composition, JWT auth via
            <code>jose</code>, and a per-user SQLite handle attached to every request. Every snippet below is real
            production code from <strong style={{ color: '#C77AA0' }}>SecretApp, GLP1, ShopKeep, Cairn, Tabloom, or
            Workshop</strong>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">7</span><span className="hero-stat-label">Apps on Express 5</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3000</span><span className="hero-stat-label">Tabloom LOC</span></div>
            <div className="hero-stat"><span className="hero-stat-val">10</span><span className="hero-stat-label">Hearth Routers</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Tests in Most Apps</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Express is a chain of <em>middleware</em> functions, each of which takes a request and either responds, passes
            it down the chain, or aborts. That's the entire framework.
          </p>

          <h3>The signature</h3>
          <CodePre>{`function middleware(req, res, next) {
  // Inspect / mutate req
  // Optionally respond via res.json(...) / res.status(...).send(...)
  // OR call next() to pass to the next middleware
  // OR call next(error) to skip to the error handler
}`}</CodePre>

          <h3>Two analogies that explain it</h3>
          <p>
            <strong>Conveyor belt with stations.</strong> The request rides a belt. Each station (middleware) can inspect
            it, attach a sticker (<code>req.user</code>, <code>req.db</code>), reroute it (<code>res.json(...)</code>), or
            throw it in a bin (<code>res.status(401)</code>). The last station wraps it up.
          </p>
          <p>
            <strong>Russian dolls.</strong> Each middleware is a layer. <code>next()</code> opens the next inner layer.
            When the innermost responds, the response unwinds back through each layer's "after <code>next()</code>" code.
            Most middleware doesn't have after-code, but logging and error-handling middlewares do.
          </p>

          <h3>The big four primitives</h3>
          <table>
            <tbody>
              <tr><th>Primitive</th><th>Purpose</th><th>Example</th></tr>
              <tr><td><code>app.use(...)</code></td><td>Register middleware for ALL routes</td><td><code>app.use(cors())</code></td></tr>
              <tr><td><code>app.use(path, ...)</code></td><td>Middleware for a path prefix</td><td><code>app.use('/api', requireAuth)</code></td></tr>
              <tr><td><code>app.METHOD(path, ...)</code></td><td>Route — exact path + method</td><td><code>app.get('/api/recipes', handler)</code></td></tr>
              <tr><td><code>express.Router()</code></td><td>Sub-app you mount with <code>app.use</code></td><td>Router-per-domain (§4)</td></tr>
            </tbody>
          </table>

          <h3>The request lifecycle</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant C as Client
  participant E as Express
  participant CORS as cors()
  participant JSON as express.json()
  participant A as requireAuth
  participant D as withUserDb
  participant H as Route handler
  C->>E: POST /api/weight
  E->>CORS: pass
  CORS->>JSON: pass (sets Access-Control-* headers)
  JSON->>A: pass (parses req.body)
  A->>D: pass (verifies JWT, sets req.user)
  D->>H: pass (opens req.db for this user)
  H->>C: 201 + JSON`} />
        </section>

        <hr />

        {/* SECTION 2 — EXPRESS 5 */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Express 5 — What Changed from 4</h2>
          <p>Express 5 stabilized in 2024–2025 and is what every fleet app uses. The migration was painless because the major changes were already supported as opt-in in 4.x.</p>

          <h3>The three changes that matter</h3>

          <h4>1. Async errors auto-handle</h4>
          <CodePre>{`// Express 4 — unhandled rejection crashes process unless you wrap:
app.get('/api/x', async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    next(err);  // ← manual forward
  }
});

// Express 5 — a thrown error from an async handler is caught for you:
app.get('/api/x', async (req, res) => {
  const data = await fetchData();  // throws? Express routes to error handler.
  res.json(data);
});`}</CodePre>

          <h4>2. New path-matching syntax</h4>
          <p>Express 5 swapped <code>path-to-regexp</code> v0 for v6+. The headline change: the SPA fallback that used to be <code>'*'</code> is now <code>'/{`*path`}'</code>:</p>
          <CodePre>{`// Express 4
app.get('*', (req, res) => res.sendFile('index.html'))

// Express 5 — must name the wildcard parameter
app.get('/{*path}', (req, res) => res.sendFile('index.html'))`}</CodePre>

          <p>Hearth's <code>server.js</code> uses exactly this pattern at the very bottom — it's the SPA fallback for the React Router app served from <code>dist/</code>.</p>

          <h4>3. Removed deprecated APIs</h4>
          <ul>
            <li><code>req.param()</code> (use <code>req.params</code>, <code>req.query</code>, <code>req.body</code>)</li>
            <li><code>res.send(status, body)</code> (use <code>res.status(...).send(body)</code>)</li>
            <li><code>res.json(status, body)</code> (use <code>res.status(...).json(body)</code>)</li>
            <li><code>app.del()</code> alias (use <code>app.delete()</code>)</li>
          </ul>

          <h3>What didn't change</h3>
          <p>The middleware signature, the <code>Router</code> API, route handling semantics — all unchanged. Most apps' code looks identical to Express 4 except the SPA-fallback path.</p>

          <h3>Versions in the fleet</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Express</th><th>Node</th></tr>
              <tr><td>SecretApp (Hearth)</td><td>5.1.0</td><td>24</td></tr>
              <tr><td>GLP1 (Tare)</td><td>5.0.1</td><td>24</td></tr>
              <tr><td>Cairn</td><td>5.1.0</td><td>22</td></tr>
              <tr><td>ShopKeep</td><td>5.2.1</td><td>22</td></tr>
              <tr><td>Puzzlebox</td><td>5.2.1</td><td>22</td></tr>
              <tr><td>Tabloom</td><td>5.2.1</td><td>22</td></tr>
              <tr><td>Workshop</td><td>5.2.1</td><td>22</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 3 — SINGLE-FILE SERVER */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The Single-File <code>server.js</code></h2>
          <p>
            Six of seven fleet apps run their entire backend out of one file (Tabloom and ShopKeep are 3000 and 1631 lines
            respectively). It's the right call for personal-scale apps — you trade one big file for zero discoverability
            overhead. Anyone with the repo opens <code>server.js</code> and reads top-to-bottom.
          </p>

          <h3>The skeleton</h3>
          <CodePre>{`// 1. Imports (ESM)
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

// 2. Validate required env vars BEFORE importing modules that need them
const required = ['AZURE_OPENAI_ENDPOINT', 'PLEX_TOKEN']
const missing = required.filter(v => !process.env[v])
if (missing.length) {
  console.error('❌ Missing env vars:', missing)
  process.exit(1)
}

// 3. Import side-effecting modules (DB open, schema apply)
import db from './lib/db.js'

// 4. Domain routers
import aiRoutes from './routes/ai.js'
import recipesRoutes from './routes/recipes.js'

// 5. App + middleware
const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.static('dist'))

// 6. Mount routers (each declares absolute paths internally)
app.use(aiRoutes)
app.use(recipesRoutes)

// 7. Health check
app.get('/api/test', (req, res) => res.json({ ok: true }))

// 8. SPA fallback (must be LAST GET)
app.get('/{*path}', (req, res) => res.sendFile('dist/index.html'))

// 9. Listen
app.listen(process.env.PORT || 3001)`}</CodePre>

          <h3>The startup env validation</h3>
          <p>Five fleet apps validate required env vars at the very top of <code>server.js</code> and <code>process.exit(1)</code> if anything's missing. The DB module, the AI client, the Plex helpers — every one assumes <code>process.env</code> is populated at import time. Validating first means a missing variable produces a clear log line, not a confusing crash deep in some library.</p>

          <CodePre>{`// SecretApp/server.js — verbatim
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Validate required environment variables before anything else imports lib/db
// or lib/anthropic — those modules may read process.env at import time.
const requiredEnvVars = [
  'AZURE_OPENAI_ENDPOINT',
  'AZURE_OPENAI_API_KEY',
  'AZURE_OPENAI_DEPLOYMENT',
  'PLEX_TOKEN',
]
const missingVars = requiredEnvVars.filter(v => !process.env[v])
if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach(v => console.error(\`   - \${v}\`))
  console.error('\\n📄 Copy .env.example to .env and fill in your values.')
  process.exit(1)
}

import db from './lib/db.js'  // ← only AFTER env vars are guaranteed`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>Order matters here.</strong> Top-level <code>import</code>s in ESM are evaluated before the module's
              body. If <code>lib/db.js</code> reads <code>process.env.DB_PATH</code> at import time, it must come AFTER
              <code>dotenv/config</code> in import order. Hoist the import; don't move the validation.
            </div>
          </div>

          <h3>When to break it up</h3>
          <p>Move out when:</p>
          <ul>
            <li><strong>One domain dominates.</strong> If "recipes" routes are 1500 of your 2500 lines, give recipes its own router file. Hearth does this for all 10 domains.</li>
            <li><strong>Tests need to import handlers.</strong> Hard to unit-test a route that's only ever reachable via <code>app.get(...)</code>. Move it to a router file with an exported handler.</li>
            <li><strong>You want to reuse middleware in dev tools.</strong> A separate <code>middleware/auth.js</code> is callable from a CLI test script.</li>
            <li><strong>It's over 3000 lines.</strong> Tabloom hits this; that's why notebook permission middleware is the next refactor candidate.</li>
          </ul>

          <h3>ShopKeep's box-drawing dividers — visual table-of-contents</h3>
          <p>ShopKeep's 1631-line <code>server.js</code> stays navigable thanks to box-drawing section headers. Search Ctrl-F for the divider character and you've got a TOC:</p>
          <CodePre>{`// ── Schema setup ────────────────────────────────────────────────────
const SCHEMA = \`CREATE TABLE IF NOT EXISTS tools (...)\`;
function initSchema(db) { ... }

// ── Seed categories on first run ──────────────────────────────────────
const SEED_CATEGORIES = [ ... ];
function seedCategories(db) { ... }

// ── Startup migration ─────────────────────────────────────────────────
try { mkdirSync(DB_DIR, { recursive: true }); } catch {}

// ── DB connection cache ───────────────────────────────────────────────
const dbConnections = new Map();
function getDb(userId) { ... }

// ── Activity logging ──────────────────────────────────────────────────
function logActivity(db, action, toolId, toolName, details) { ... }`}</CodePre>

          <p>It's cosmetic, but it makes a 1600-line file scannable in seconds. Workshop and GLP1 use the same convention.</p>
        </section>

        <hr />

        {/* SECTION 4 — ROUTER PER DOMAIN */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Router-per-Domain Composition</h2>
          <p>Hearth and Cairn split routes into per-domain router files. The mounting in <code>server.js</code> doesn't care about path prefixes because each router declares absolute paths internally.</p>

          <h3>The Hearth shape</h3>
          <CodePre>{`// SecretApp/server.js — verbatim, lines 37-71

// Domain routers
import aiRoutes               from './routes/ai.js'
import tautulliRoutes         from './routes/tautulli.js'
import plexRoutes             from './routes/plex.js'
import plexDuplicatesRoutes   from './routes/plex-duplicates.js'
import conversationsRoutes    from './routes/conversations.js'
import maintenanceRoutes      from './routes/maintenance.js'
import inventoryRoutes        from './routes/inventory.js'
import recipesRoutes          from './routes/recipes.js'
import playlistCreatorRoutes  from './routes/playlistCreator.js'
import examPrepRoutes         from './routes/examPrep.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.static(join(__dirname, 'dist')))

// Mount domain routers. Each router uses absolute paths internally
// (e.g. router.get('/api/recipes', ...)), so order between mounts doesn't
// matter — Express picks the first matching route across all routers.
app.use(aiRoutes)
app.use(tautulliRoutes)
app.use(plexRoutes)
app.use(plexDuplicatesRoutes)
app.use(conversationsRoutes)
app.use(maintenanceRoutes)
app.use(inventoryRoutes)
app.use(recipesRoutes)
app.use(playlistCreatorRoutes)
app.use(examPrepRoutes)`}</CodePre>

          <h3>A router file</h3>
          <CodePre>{`// routes/recipes.js
import express from 'express'
import db from '../lib/db.js'

const router = express.Router()

router.get('/api/recipes', (req, res) => {
  const recipes = db.prepare('SELECT * FROM recipes ORDER BY updated_at DESC').all()
  res.json(recipes)
})

router.post('/api/recipes', (req, res) => {
  const { title, instructions } = req.body
  const info = db.prepare(
    'INSERT INTO recipes (title, instructions) VALUES (?, ?)'
  ).run(title, instructions)
  res.status(201).json({ id: info.lastInsertRowid })
})

router.delete('/api/recipes/:id', (req, res) => {
  db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router`}</CodePre>

          <h3>Absolute paths vs path prefix mounting</h3>
          <p>Two conventions; pick one and stick with it.</p>
          <table>
            <tbody>
              <tr><th>Style</th><th>Mount</th><th>Routes inside router</th></tr>
              <tr><td>Absolute paths (Hearth's)</td><td><code>app.use(recipesRoutes)</code></td><td><code>router.get('/api/recipes', ...)</code></td></tr>
              <tr><td>Path prefix</td><td><code>app.use('/api/recipes', recipesRoutes)</code></td><td><code>router.get('/', ...)</code></td></tr>
            </tbody>
          </table>

          <p>Hearth picks absolute. The benefit: a route's URL is fully self-describing — search for <code>/api/recipes</code> across the repo and you find every reference. The cost: a typo in the path doesn't get caught by Express's mount.</p>

          <h3>When to extract a router</h3>
          <ul>
            <li>The domain has 5+ routes (CRUD plus a few specials).</li>
            <li>The domain has shared helpers (validators, formatters) that don't belong in a global lib.</li>
            <li>The domain has its own middleware (e.g. "all recipes routes require <code>requireAuth</code>").</li>
          </ul>

          <h3>Per-router middleware</h3>
          <p>You can mount middleware on a specific router instance — useful when an entire domain needs auth or rate limiting:</p>
          <CodePre>{`// routes/recipes.js
const router = express.Router()
router.use(requireAuth)  // ← every route in this file gets requireAuth first

router.get('/api/recipes', ...)
router.post('/api/recipes', ...)
// ...`}</CodePre>
        </section>

        <hr />

        {/* SECTION 5 — MIDDLEWARE ORDER */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Middleware Order</h2>
          <p>
            Express runs middleware in registration order. Most foot-guns in this guide are reorder bugs — the right
            code in the wrong place.
          </p>

          <h3>The canonical order</h3>
          <ol>
            <li><strong>Trust proxy</strong> — <code>app.set('trust proxy', 1)</code> if you're behind App Service / nginx / CDN, so <code>req.ip</code> is the real client.</li>
            <li><strong>CORS</strong> — first, so even rejected requests get the right Access-Control headers.</li>
            <li><strong>Body parsers</strong> — <code>express.json()</code>, <code>express.urlencoded()</code>, <code>multer</code> for multipart.</li>
            <li><strong>Cookie / session</strong> — if you use them.</li>
            <li><strong>Static files</strong> — before any router so disk hits don't go through your code.</li>
            <li><strong>Health check</strong> — before auth so the deploy probe doesn't 401.</li>
            <li><strong>Public routes</strong> — anything that must NOT require auth.</li>
            <li><strong>Auth middleware</strong> — <code>app.use('/api', requireAuth)</code>.</li>
            <li><strong>Per-request state middleware</strong> — <code>withUserDb</code>, etc.</li>
            <li><strong>Protected routers</strong> — all your real domain routes.</li>
            <li><strong>SPA fallback</strong> — last GET, catches everything not matched above.</li>
            <li><strong>Error handler</strong> — the 4-arg <code>(err, req, res, next)</code> signature, last <code>app.use</code> call.</li>
          </ol>

          <h3>Public-before-auth — ShopKeep's image route</h3>
          <p>
            ShopKeep has an <code>{`<img>`}</code> in the React app that points at <code>/api/tools/images/:id</code>.
            HTML img tags can't send an <code>Authorization</code> header, so the route would 401 if registered after the
            auth middleware. ShopKeep registers it <em>before</em> auth — and accepts an <code>?oid=</code> query
            string instead as a fallback identity:
          </p>
          <CodePre>{`// Pseudo-pattern from ShopKeep's server.js
// PUBLIC routes — must be before requireAuth
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.get('/api/tools/images/:id', (req, res) => {
  const oid = req.query.oid  // <img src="/api/tools/images/42?oid=..." />
  if (!isValidOid(oid)) return res.status(403).end()
  const buf = getDb(oid).prepare('SELECT data FROM tool_images WHERE id = ?').get(req.params.id)
  res.type('image/jpeg').send(buf.data)
})

// AUTH middleware — everything below requires Bearer
app.use(requireAuth)
app.use(withUserDb)

// Protected routes
app.get('/api/tools', listTools)`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              The query-string-OID fallback is only safe because the OID itself is non-secret (it's a public Entra
              identifier) AND because the image is non-sensitive (your own tools). For private content, do NOT degrade
              auth to a query param — render images through a different transport (signed URLs, blob containers, etc.).
            </div>
          </div>

          <h3>Body parser limit</h3>
          <p>Default body limit is 100KB. Most fleet apps bump it: Hearth and GLP1 to <code>50mb</code> (recipe and meal photos). Set it explicitly so future-you knows the cap:</p>
          <CodePre>{`app.use(express.json({ limit: '50mb' }))  // ← recipe images as base64
app.use(express.urlencoded({ extended: true, limit: '50mb' }))`}</CodePre>

          <h3>CORS — origin, credentials, headers</h3>
          <CodePre>{`// GLP1 — verbatim, lines 328-332
app.use(cors({
  origin: true,                            // reflect the request's origin
  credentials: false,                       // no cookies; Bearer tokens only
  allowedHeaders: ['Content-Type', 'Authorization'],
}))`}</CodePre>

          <p><code>origin: true</code> is fine when the auth scheme is Bearer-only (CORS protects browsers, not the server). With cookie sessions, restrict to a known list.</p>
        </section>

        <hr />

        {/* SECTION 6 — AUTH */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The Auth Middleware</h2>
          <p>Every fleet app's auth middleware does the same thing: validate an Entra ID JWT, extract the user's <code>oid</code>, and attach it to <code>req</code>.</p>

          <h3>GLP1's <code>jose</code> version (modern, recommended)</h3>
          <CodePre>{`// GLP1/server.js — verbatim, lines 282-304
import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${AAD_TENANT_ID}/discovery/v2.0/keys\`)
)
const ISSUER = \`https://login.microsoftonline.com/\${AAD_TENANT_ID}/v2.0\`

async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ''
  const m = /^Bearer (.+)$/i.exec(header)
  if (!m) return res.status(401).json({ error: 'unauthorized' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer:   ISSUER,
      audience: AAD_CLIENT_ID,
      clockTolerance: '60s',
    })
    if (payload.tid !== AAD_TENANT_ID) return res.status(401).json({ error: 'unauthorized' })
    if (!payload.oid)                  return res.status(401).json({ error: 'unauthorized' })
    req.userId = payload.oid
    next()
  } catch {
    res.status(401).json({ error: 'unauthorized' })
  }
}`}</CodePre>

          <h3>Cairn's <code>jsonwebtoken</code> + <code>jwks-rsa</code> version</h3>
          <CodePre>{`// Cairn/middleware/auth.js — verbatim
import jwksClient from 'jwks-rsa'
import jwt from 'jsonwebtoken'

const TENANT_ID = '52188f12-db6b-46c6-88ff-08c802f0ed3b'
const CLIENT_ID = '142376b1-6cf0-4377-9c99-e47bb4a3be9a'

// AAD can issue access tokens as v1.0 OR v2.0 depending on the App
// Registration manifest's accessTokenAcceptedVersion setting.
//   v1.0 iss: https://sts.windows.net/{tid}/
//   v2.0 iss: https://login.microsoftonline.com/{tid}/v2.0
// Accept both so the middleware works regardless of how the app reg is
// configured.
const ACCEPTED_ISSUERS = [
  \`https://login.microsoftonline.com/\${TENANT_ID}/v2.0\`,
  \`https://sts.windows.net/\${TENANT_ID}/\`,
]

// Audience can be the Application ID URI (api://<clientId>) OR the bare client id.
const ACCEPTED_AUDIENCES = [\`api://\${CLIENT_ID}\`, CLIENT_ID]

const keyClient = jwksClient({
  jwksUri: \`https://login.microsoftonline.com/\${TENANT_ID}/discovery/v2.0/keys\`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 24 * 60 * 60 * 1000, // 24h
})

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }
  const token = header.slice('Bearer '.length).trim()
  jwt.verify(
    token,
    (header, cb) => keyClient.getSigningKey(header.kid, (err, key) => cb(err, key?.getPublicKey())),
    { algorithms: ['RS256'], audience: ACCEPTED_AUDIENCES, issuer: ACCEPTED_ISSUERS },
    (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' })
      if (!decoded?.oid) return res.status(401).json({ error: 'Token missing oid' })
      req.user = { oid: decoded.oid, name: decoded.name ?? null, tid: decoded.tid ?? null }
      next()
    }
  )
}`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong><code>jose</code> is the modern default.</strong> It's Promise-based, native crypto, smaller footprint,
              ESM-friendly. <code>jsonwebtoken</code> + <code>jwks-rsa</code> is the older callback combo (used in Cairn
              for historical reasons). New apps: use <code>jose</code>.
            </div>
          </div>

          <h3>Wiring it in</h3>
          <CodePre>{`// Public routes BEFORE auth middleware
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Apply auth to everything under /api EXCEPT the exempt paths
app.use('/api', (req, res, next) => {
  if (isExemptPath(req.path)) return next()
  return requireAuth(req, res, next)
})`}</CodePre>

          <h3>The "404, not 403" admin pattern</h3>
          <p>Cairn restricts admin routes to a specific <code>oid</code>. When the check fails, it returns <strong>404</strong>, not 403 — that way attackers can't enumerate which routes exist:</p>
          <CodePre>{`// Cairn/routes/admin.js (pattern)
const ADMIN_OID = process.env.ADMIN_OID

function requireAdmin(req, res, next) {
  if (req.user?.oid !== ADMIN_OID) {
    // Return 404 instead of 403 — don't reveal the route exists.
    return res.status(404).json({ error: 'not found' })
  }
  next()
}

router.get('/api/admin/qc-status', requireAuth, requireAdmin, async (req, res) => {
  // ... admin-only response ...
})`}</CodePre>

          <h3>Workshop's single-user lock — <code>ALLOWED_OID</code></h3>
          <CodePre>{`// workshop/server.js — verbatim, lines 608-633
const TENANT_ID    = process.env.AZURE_TENANT_ID
const API_AUDIENCE = process.env.API_AUDIENCE
const ALLOWED_OID  = process.env.ALLOWED_OID || ''  // ← optional single-user lock

if (!TENANT_ID || !API_AUDIENCE) {
  console.error('[auth] AZURE_TENANT_ID and API_AUDIENCE must be set. Refusing to start with auth disabled.')
}

async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'missing token' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer: \`https://login.microsoftonline.com/\${TENANT_ID}/v2.0\`,
      audience: API_AUDIENCE,
    })
    if (ALLOWED_OID && payload.oid !== ALLOWED_OID) {
      return res.status(403).json({ error: 'forbidden' })
    }
    req.user = { oid: payload.oid, email: payload.preferred_username ?? payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'unauthorized' })
  }
}`}</CodePre>

          <p>Set <code>ALLOWED_OID</code> on App Service to lock the app to one user. Useful for "personal" apps that get accidentally exposed.</p>
        </section>

        <hr />

        {/* SECTION 7 — PERMISSION MIDDLEWARE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Permission Middleware — Beyond requireAuth</h2>
          <p>
            Tabloom has multi-user notebook sharing: owner / editor / viewer roles per notebook. Its permission
            middleware is the cleanest example of factoring permissions in the fleet.
          </p>

          <h3>The factory pattern</h3>
          <CodePre>{`// tabloom/server.js — verbatim
function requireOwner(req, res, next) {
  if (!req.user?.isOwner) return res.status(403).json({ error: 'forbidden' })
  next()
}

// Express middleware factory. Pulls notebookId from params/body and 403s if
// the caller's access is below \`minLevel\`.
function requireNotebookAccess(minLevel, source = 'params') {
  return (req, res, next) => {
    const id = Number(
      source === 'params' ? req.params.nbId ?? req.params.id : req.body?.notebookId ?? req.body?.notebook_id
    )
    if (!id) return res.status(400).json({ error: 'notebook id required' })
    const level = getAccessLevel(req.user.oid, id)  // 'owner' | 'editor' | 'viewer' | null
    if (!hasAtLeast(level, minLevel)) return res.status(403).json({ error: 'forbidden' })
    next()
  }
}

// Build a middleware that gates by access on the notebook of a sub-resource
// (page/link/media). \`lookup\` returns the notebook_id from the row id.
function requireAccessOnResource(lookup, minLevel) {
  return (req, res, next) => {
    const row = lookup(Number(req.params.id))
    if (row === undefined || row === null) {
      return res.status(404).json({ error: 'not found' })
    }
    const level = getAccessLevel(req.user.oid, row.notebook_id)
    if (!hasAtLeast(level, minLevel)) return res.status(403).json({ error: 'forbidden' })
    next()
  }
}

// Concrete middlewares built from the factory:
const requireEditorOnPage = requireAccessOnResource(
  (id) => stmts.getPageNotebookId.get(id),
  'editor'
)
const requireViewerOnPage = requireAccessOnResource(
  (id) => stmts.getPageNotebookId.get(id),
  'viewer'
)`}</CodePre>

          <h3>Using them on routes</h3>
          <CodePre>{`// Only owner can create / delete notebooks
app.post('/api/notebooks', requireOwner, (req, res) => { ... })
app.delete('/api/notebooks/:id', requireOwner, (req, res) => { ... })

// Editor can save page content
app.put('/api/pages/:id/content', requireEditorOnPage, (req, res) => { ... })

// Viewer can read
app.get('/api/pages/:id', requireViewerOnPage, (req, res) => { ... })`}</CodePre>

          <h3>The shape of <code>hasAtLeast</code></h3>
          <CodePre>{`const LEVELS = { viewer: 1, editor: 2, owner: 3 }

function hasAtLeast(actual, required) {
  if (!actual) return false
  return LEVELS[actual] >= LEVELS[required]
}`}</CodePre>

          <p>Owner is implicitly editor and viewer; editor is implicitly viewer. Three middlewares, one comparison function.</p>

          <h3>Where to put permission checks</h3>
          <ul>
            <li><strong>Middleware</strong> when the check is by URL parameter (most cases). Cleanest.</li>
            <li><strong>Inside the handler</strong> when the check depends on the request body (e.g. "can this user move this item to that notebook?"). Inline.</li>
            <li><strong>Never trust the client</strong> — even if your UI hides delete buttons for non-owners, the server must verify on every write.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 8 — SSE STREAMING */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>SSE Streaming — AI Responses, Live Updates</h2>
          <p>
            Server-Sent Events (SSE) is a one-way streaming protocol over HTTP. Hearth uses it for its AI chat (Azure
            OpenAI streams tokens; the route forwards them to the browser) and for the natural-language playlist
            creator. Tabloom uses it for "Ask Your Notes" AI search.
          </p>

          <h3>The four headers</h3>
          <CodePre>{`res.writeHead(200, {
  'Content-Type':     'text/event-stream',
  'Cache-Control':    'no-cache',
  'Connection':       'keep-alive',
  'X-Accel-Buffering': 'no',  // ← critical for nginx / App Service front-end
})`}</CodePre>

          <p><code>X-Accel-Buffering: no</code> tells App Service / nginx not to buffer the response, so each chunk reaches the client immediately. Without it, the entire response sits in the proxy buffer and arrives all-at-once.</p>

          <h3>The Hearth pattern (Azure OpenAI passthrough)</h3>
          <CodePre>{`// SecretApp/routes/ai.js (simplified)
router.post('/api/ai/chat', requireAuth, async (req, res) => {
  res.writeHead(200, {
    'Content-Type':     'text/event-stream',
    'Cache-Control':    'no-cache',
    'Connection':       'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  const stream = await openai.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT,
    messages: req.body.messages,
    stream: true,
  })

  // Cancel upstream if the client disconnects mid-stream.
  req.on('close', () => stream.controller?.abort())

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) {
      res.write(\`data: \${JSON.stringify({ token: delta })}\\n\\n\`)
    }
  }

  res.write('data: [DONE]\\n\\n')
  res.end()
})`}</CodePre>

          <h3>The SSE wire format</h3>
          <p>Each event is one or more <code>field: value</code> lines, terminated by a blank line:</p>
          <CodePre>{`data: {"token": "hello"}

data: {"token": " world"}

event: error
data: {"message": "rate limited"}

data: [DONE]

`}</CodePre>

          <p>Fields you can use: <code>data</code> (the payload), <code>event</code> (the event type), <code>id</code> (for reconnection), <code>retry</code> (reconnect delay in ms).</p>

          <h3>Consuming from the browser</h3>
          <p>Two options. <code>EventSource</code> (built-in, GET-only):</p>
          <CodePre>{`const es = new EventSource('/api/ai/chat')
es.onmessage = e => {
  if (e.data === '[DONE]') { es.close(); return }
  const { token } = JSON.parse(e.data)
  appendToken(token)
}
es.onerror = () => es.close()`}</CodePre>

          <p>Or <code>fetch</code> + reader (works for POST, custom headers):</p>
          <CodePre>{`const r = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
  body: JSON.stringify({ messages }),
})

const reader = r.body.getReader()
const decoder = new TextDecoder()
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  buffer += decoder.decode(value, { stream: true })

  const events = buffer.split('\\n\\n')
  buffer = events.pop()  // ← keep incomplete trailing event

  for (const ev of events) {
    if (ev.startsWith('data: ')) {
      const payload = ev.slice(6)
      if (payload === '[DONE]') return
      const { token } = JSON.parse(payload)
      appendToken(token)
    }
  }
}`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Always wire <code>req.on('close')</code> for SSE.</strong> If the user navigates away mid-stream,
              your endpoint keeps the upstream open (and keeps billing Azure OpenAI tokens) until it finishes. The close
              listener aborts the upstream when the client disconnects.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 9 — STATIC + SPA */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Static + SPA Fallback</h2>
          <p>The prod backend serves both the React bundle and the API. Two pieces: <code>express.static</code> for files that exist, and a catch-all GET for client-side routes that don't.</p>

          <h3>The pattern</h3>
          <CodePre>{`// 1. Serve files from dist/ if they exist
app.use(express.static(join(__dirname, 'dist')))

// 2. Mount all API routers
app.use(recipesRoutes)
app.use(aiRoutes)
// ...

// 3. Health check (often kept separate from routers)
app.get('/api/test', (req, res) => res.json({ ok: true }))

// 4. SPA fallback — any GET that didn't match returns index.html
//    (Express 5 syntax: named wildcard)
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})`}</CodePre>

          <h3>Why this works</h3>
          <ol>
            <li><strong>Real assets resolve first.</strong> <code>/assets/index-AbC123.js</code> hits <code>express.static</code> and serves the file from disk.</li>
            <li><strong>API routes match next.</strong> <code>/api/recipes</code> goes to the recipes router.</li>
            <li><strong>Anything else falls through to <code>index.html</code>.</strong> The React app boots, reads the URL, renders the right route.</li>
          </ol>

          <h3>Common foot-gun: SPA fallback before API routes</h3>
          <CodePre>{`// 🚫 BAD — every API request returns index.html
app.use(express.static('dist'))
app.get('/{*path}', (_req, res) => res.sendFile('dist/index.html'))
app.use(recipesRoutes)  // ← never reached`}</CodePre>

          <h3>Excluding /api from the fallback</h3>
          <p>If you want a true "404 for missing API routes" instead of returning <code>index.html</code> for typos:</p>
          <CodePre>{`// Strict — only HTML routes fall through to SPA
app.get(/^\\/(?!api).*/, (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

// Or: explicit 404 for unmatched API
app.use('/api', (req, res) => res.status(404).json({ error: 'not found' }))
app.get('/{*path}', (_req, res) => res.sendFile('dist/index.html'))`}</CodePre>

          <h3>Cache headers for static</h3>
          <CodePre>{`app.use(express.static(join(__dirname, 'dist'), {
  setHeaders(res, filePath) {
    // Hashed asset files (index-AbC123.js): cache forever, content-addressed
    if (filePath.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
    // index.html: never cache — must check for new app version on every load
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate')
    }
  }
}))`}</CodePre>
        </section>

        <hr />

        {/* SECTION 10 — ERROR HANDLING */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Error Handling</h2>

          <h3>The 4-arg signature</h3>
          <p>Express identifies error-handling middleware by its <em>arity</em>: a function with four parameters is treated as an error handler. It runs only when prior middleware called <code>next(err)</code> or threw (in Express 5).</p>
          <CodePre>{`// Always last in your app.use chain
app.use((err, req, res, next) => {
  console.error('[error]', req.method, req.path, err)

  // Distinguish "expected" errors from bugs
  if (err.status) {
    return res.status(err.status).json({ error: err.message })
  }

  // Generic 500 — don't leak stack to client
  res.status(500).json({ error: 'internal server error' })
})`}</CodePre>

          <h3>Throwing structured errors</h3>
          <CodePre>{`class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

router.get('/api/recipes/:id', (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id)
  if (!recipe) throw new HttpError(404, 'recipe not found')
  res.json(recipe)
})`}</CodePre>

          <h3>The 404 catch-all</h3>
          <p>An unmatched route in Express returns a default 404 with no body. Most fleet apps add a JSON 404:</p>
          <CodePre>{`// After all routes, before the error handler
app.use((req, res) => {
  res.status(404).json({ error: 'not found' })
})`}</CodePre>

          <h3>Per-route try/catch is no longer required (Express 5)</h3>
          <CodePre>{`// Express 5 — bare throws propagate to the error handler
router.post('/api/upload', async (req, res) => {
  const data = await processUpload(req.file)  // ← may throw
  res.json(data)
})`}</CodePre>

          <h3>Don't lose the error</h3>
          <ul>
            <li><strong>Log it before responding.</strong> Otherwise post-mortem debugging means "the server returned 500 at 3am" with no clue why.</li>
            <li><strong>Include request context.</strong> Method, path, user oid if known.</li>
            <li><strong>Sanitize before sending.</strong> Database errors leak schema; stack traces leak file paths. Send a generic message to the client; log the detail server-side.</li>
          </ul>

          <h3>Hearth's health endpoint as a smoke test</h3>
          <CodePre>{`// SecretApp/server.js — verbatim, lines 74-81
app.get('/api/test', (req, res) => {
  try {
    db.prepare('SELECT 1 as test').get()
    res.json({ success: true, message: 'Connected to SQLite database!' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})`}</CodePre>
          <p>The deploy workflow polls this every 5 seconds for up to 5 minutes after restart. A DB-aware health check (not just "200 from /") catches the "container came up but the volume mount failed" case.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a Backend From Scratch</h2>
          <p>Build a working Express 5 backend with auth, a router-per-domain split, SQLite handle injection, an SSE endpoint, and a SPA fallback. Mirrors what every fleet app does.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`mkdir my-backend && cd my-backend
npm init -y

# Required dep set
npm i express cors better-sqlite3 jose dotenv

# Mark this as an ES module project
npm pkg set type=module`}</CodePre>

          <h3>Step 2 — schema.sql + lib/db.js</h3>
          <CodePre>{`-- schema.sql
CREATE TABLE IF NOT EXISTS items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`}</CodePre>

          <CodePre>{`// lib/db.js
import Database from 'better-sqlite3'
import { readFileSync } from 'fs'

const db = new Database(process.env.DB_PATH ?? 'app.db')
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(readFileSync('./schema.sql', 'utf8'))

export default db`}</CodePre>

          <h3>Step 3 — middleware/auth.js</h3>
          <CodePre>{`// middleware/auth.js
import { jwtVerify, createRemoteJWKSet } from 'jose'

const TENANT = process.env.AAD_TENANT_ID
const CLIENT = process.env.AAD_CLIENT_ID

const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${TENANT}/discovery/v2.0/keys\`)
)

export async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'unauthorized' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer: \`https://login.microsoftonline.com/\${TENANT}/v2.0\`,
      audience: CLIENT,
      clockTolerance: '60s',
    })
    if (!payload.oid) return res.status(401).json({ error: 'unauthorized' })
    req.user = { oid: payload.oid }
    next()
  } catch {
    res.status(401).json({ error: 'unauthorized' })
  }
}`}</CodePre>

          <h3>Step 4 — routes/items.js</h3>
          <CodePre>{`// routes/items.js
import express from 'express'
import db from '../lib/db.js'

const router = express.Router()

router.get('/api/items', (req, res) => {
  const rows = db.prepare('SELECT * FROM items ORDER BY id DESC').all()
  res.json(rows)
})

router.post('/api/items', (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const { lastInsertRowid } = db.prepare('INSERT INTO items (title) VALUES (?)').run(title)
  res.status(201).json({ id: lastInsertRowid })
})

router.delete('/api/items/:id', (req, res) => {
  const info = db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)
  if (info.changes === 0) return res.status(404).json({ error: 'not found' })
  res.status(204).end()
})

export default router`}</CodePre>

          <h3>Step 5 — routes/stream.js (SSE)</h3>
          <CodePre>{`// routes/stream.js
import express from 'express'
const router = express.Router()

router.get('/api/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type':      'text/event-stream',
    'Cache-Control':     'no-cache',
    'Connection':        'keep-alive',
    'X-Accel-Buffering': 'no',
  })

  let n = 0
  const timer = setInterval(() => {
    n++
    res.write(\`data: \${JSON.stringify({ n, time: Date.now() })}\\n\\n\`)
    if (n >= 10) {
      clearInterval(timer)
      res.write('data: [DONE]\\n\\n')
      res.end()
    }
  }, 500)

  req.on('close', () => clearInterval(timer))
})

export default router`}</CodePre>

          <h3>Step 6 — server.js</h3>
          <CodePre>{`// server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const required = ['AAD_TENANT_ID', 'AAD_CLIENT_ID']
const missing = required.filter(v => !process.env[v])
if (missing.length) {
  console.error('❌ Missing env vars:', missing)
  process.exit(1)
}

import db from './lib/db.js'
import { requireAuth } from './middleware/auth.js'
import itemsRoutes from './routes/items.js'
import streamRoutes from './routes/stream.js'

const app = express()

// CORS first
app.use(cors({ origin: true, allowedHeaders: ['Content-Type', 'Authorization'] }))
app.use(express.json({ limit: '10mb' }))

// Public health
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Auth for everything else under /api
app.use('/api', requireAuth)

// Protected routers
app.use(itemsRoutes)
app.use(streamRoutes)

// 404 for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'not found' }))

// Error handler — always last
app.use((err, req, res, _next) => {
  console.error('[error]', req.method, req.path, err)
  res.status(err.status ?? 500).json({ error: err.message ?? 'internal' })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(\`🚀 backend on :\${port}\`))`}</CodePre>

          <h3>Step 7 — .env</h3>
          <CodePre>{`AAD_TENANT_ID=de625678-c55b-4494-9558-14946cbb6133
AAD_CLIENT_ID=your-client-id-here
DB_PATH=./app.db
PORT=3000`}</CodePre>

          <h3>Step 8 — Try it</h3>
          <ol>
            <li><code>node server.js</code></li>
            <li><code>curl http://localhost:3000/api/health</code> → <code>{`{"ok":true}`}</code></li>
            <li><code>curl http://localhost:3000/api/items</code> → <code>{`{"error":"unauthorized"}`}</code> (auth gates it correctly)</li>
            <li><code>curl -N http://localhost:3000/api/stream</code> → 10 events streamed (auth fails here too — exercise: move it before <code>requireAuth</code> as a public endpoint, or pass a real Bearer token)</li>
          </ol>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated the entire shape of every fleet backend. The next steps from here are: per-user DB
              isolation (article 14), real schema with FK + idempotent migrations (article 13), and SSL via App Service
              (Azure Hosting guide).
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Cannot GET /api/foo"</h3>
          <p>The route isn't registered, or the SPA fallback caught it first. Check: (a) the router file is imported and mounted; (b) the path string matches exactly (no missing leading slash); (c) the SPA fallback comes after all <code>/api/*</code> routes.</p>

          <h3>Body is empty</h3>
          <p><code>app.use(express.json())</code> must come BEFORE the route. Also: client must send <code>Content-Type: application/json</code>. Without it, Express won't parse.</p>

          <h3>CORS error in dev, works in prod</h3>
          <p>In dev your frontend and backend run on different ports; in prod they're same-origin (Express serves both). Solution in dev: Vite's <code>/api</code> proxy (covered in the Vite guide) — same-origin from the browser's perspective.</p>

          <h3>"req.user is undefined"</h3>
          <p>The auth middleware didn't run, or it failed silently. Check: (a) the route is downstream of <code>requireAuth</code>; (b) the client is sending <code>Authorization: Bearer ...</code>; (c) the JWT's <code>aud</code>/<code>iss</code> match what your middleware accepts (v1 vs v2 issuer is the #1 cause).</p>

          <h3>"Headers already sent"</h3>
          <p>You called <code>res.send()</code>/<code>res.json()</code> twice, OR you forgot to <code>return</code> after a guard. Always: <code>if (!ok) return res.status(401).json(...)</code>.</p>

          <h3>SSE chunks arrive all at once</h3>
          <p>App Service or nginx is buffering. Set <code>X-Accel-Buffering: no</code> on the response. If it's still buffering, you're behind a CDN that ignores the hint — disable CDN for SSE paths, or switch to WebSockets.</p>

          <h3>The dev server restarts but my code change isn't picked up</h3>
          <p>You're running <code>node server.js</code> directly; it doesn't watch files. Use <code>node --watch server.js</code> (Node 18+) or <code>nodemon</code>.</p>

          <h3>"Error: listen EADDRINUSE"</h3>
          <p>Another process is using the port. <code>netstat -ano | findstr :3001</code> on Windows or <code>lsof -i :3001</code> on Mac/Linux finds the PID. Kill it, or pick a different port.</p>

          <h3>Routes work in dev, 404 in prod</h3>
          <p>The Dockerfile didn't copy the routes folder. Check: <code>COPY routes ./routes</code> in your runner stage.</p>

          <h3>Memory growing over time</h3>
          <p>Common cause: SSE responses leaking because <code>req.on('close')</code> isn't wired. Each abandoned stream keeps timers + buffers alive. Audit every SSE endpoint for explicit teardown.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Middleware signature</h3>
          <CodePre>{`function mw(req, res, next) { ... next() }
function errorMw(err, req, res, next) { ... }   // 4 args = error handler`}</CodePre>

          <h3>The order template</h3>
          <CodePre>{`app.use(cors())
app.use(express.json({ limit: '20mb' }))
app.use(express.static('dist'))

// public routes
app.get('/api/health', ...)
app.get('/api/images/:id', ...)  // <img>-friendly

// auth
app.use('/api', requireAuth)

// protected routers
app.use(itemsRouter)
app.use(aiRouter)

// SPA fallback (LAST GET)
app.get('/{*path}', (req, res) => res.sendFile('dist/index.html'))

// 404 + error handler (LAST app.use)
app.use((req, res) => res.status(404).json({ error: 'not found' }))
app.use((err, req, res, next) => res.status(500).json({ error: err.message }))`}</CodePre>

          <h3>jose requireAuth (modern)</h3>
          <CodePre>{`import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(new URL(\`.../discovery/v2.0/keys\`))

async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'unauthorized' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, { issuer, audience, clockTolerance: '60s' })
    if (!payload.oid) return res.status(401).end()
    req.user = { oid: payload.oid }
    next()
  } catch { res.status(401).end() }
}`}</CodePre>

          <h3>SSE one-liner</h3>
          <CodePre>{`res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'X-Accel-Buffering': 'no',
})
req.on('close', () => cleanup())`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>Env validation + exit</td><td>SecretApp · <code>server.js:18-30</code></td></tr>
              <tr><td>Router-per-domain mount</td><td>SecretApp · <code>server.js:37-71</code></td></tr>
              <tr><td>jose requireAuth</td><td>GLP1 · <code>server.js:282-304</code></td></tr>
              <tr><td>jsonwebtoken requireAuth</td><td>Cairn · <code>middleware/auth.js</code></td></tr>
              <tr><td>ALLOWED_OID single-user lock</td><td>workshop · <code>server.js:608-633</code></td></tr>
              <tr><td>requireOwner + factory pattern</td><td>tabloom · <code>server.js:1024-1106</code></td></tr>
              <tr><td>Box-drawing section dividers</td><td>ShopKeep · <code>server.js</code></td></tr>
              <tr><td>SPA fallback (Express 5)</td><td>SecretApp · <code>server.js:86-88</code></td></tr>
              <tr><td>Health endpoint</td><td>SecretApp · <code>server.js:74-81</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: Node.js 22/24 in Production.</p>
        </section>
      </main>
    </div>
  );
}
