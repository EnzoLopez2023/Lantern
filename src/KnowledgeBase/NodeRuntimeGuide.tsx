import { useRef, useState } from 'react';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                      icon: '🧠' },
  { id: 's2',  num: '2',  title: 'ESM vs CJS',                        icon: '📦' },
  { id: 's3',  num: '3',  title: 'Native Modules on Alpine',          icon: '🔧' },
  { id: 's4',  num: '4',  title: 'Multer + file-type Uploads',        icon: '📤' },
  { id: 's5',  num: '5',  title: 'undici Custom Dispatchers',         icon: '🌐' },
  { id: 's6',  num: '6',  title: 'express-rate-limit',                icon: '🚥' },
  { id: 's7',  num: '7',  title: 'sanitize-html + Archiver',          icon: '🛡️' },
  { id: 's8',  num: '8',  title: 'Env Validation at Startup',         icon: '🔑' },
  { id: 's9',  num: '9',  title: 'Process Lifecycle',                 icon: '🔄' },
  { id: 's10', num: '10', title: 'Logging (sans App Insights)',       icon: '📝' },
  { id: 's11', num: '★',  title: 'Lab: Safe Upload Pipeline',         icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                   icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                       icon: '📋' },
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

export default function NodeRuntimeGuide() {
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
            <span className="sidebar-title">Node.js 22 / 24</span>
          </div>
          <div className="sidebar-sub">ESM, native modules, the runtime</div>
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
          <div className="hero-tag">🟢 Node 22 / 24 · 2026</div>
          <h1>Node.js 22 / 24<br />in Production</h1>
          <p>
            Nearly all fleet apps run <strong style={{ color: '#C77AA0' }}>Node 22 or 24</strong> on
            <code>alpine</code> (GLP-1's container is the lone holdout, still on Node 20), with ESM, <code>better-sqlite3</code>, <code>multer</code>+<code>file-type</code>,
            <code>undici</code>, and <code>express-rate-limit</code>. This guide walks every meaningful runtime knob:
            module systems, native module compilation in containers, safe uploads, TLS-bypass dispatchers, rate limiting,
            process signals, and the observability gap.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">8/8</span><span className="hero-stat-label">Apps on ESM</span></div>
            <div className="hero-stat"><span className="hero-stat-val">200MB</span><span className="hero-stat-label">Image Size</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Native Modules</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">App Insights</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Node.js is V8 (JavaScript engine) + libuv (async I/O) + a small standard library + a module system. Most of
            what "Node" means to you in 2026 is the standard library — <code>fs</code>, <code>net</code>, <code>http</code>,
            <code>crypto</code>, <code>stream</code> — plus the npm ecosystem.
          </p>

          <h3>The event loop in one sentence</h3>
          <p>
            Node runs your code on a single thread, but any I/O (file read, network call, DB query) is delegated to
            libuv's threadpool, freeing the main thread to handle other work while it waits. When the I/O finishes,
            libuv pushes the callback onto a queue; the event loop picks it up on the next tick.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The single-line restaurant.</strong> One server (the main thread) takes orders, sends them to the
            kitchen (libuv), and as kitchen tickets come back, delivers them. Never blocks at the counter while the steak
            cooks.
          </p>
          <p>
            <strong>A switchboard.</strong> One operator routes calls. Each call is brief (set up the connection, hand
            off to a clerk in another room). The operator handles thousands per minute by never staying on any one call.
          </p>
          <p>
            <strong>The CPU vs I/O distinction matters.</strong> If you crunch numbers in pure JavaScript for 500ms,
            <em>everything</em> blocks. That's why CPU-heavy work (image processing, big JSON parsing) goes to a worker
            thread or a child process.
          </p>

          <h3>What Node 22 → 24 changed</h3>
          <table>
            <tbody>
              <tr><th>Feature</th><th>Why it matters</th></tr>
              <tr><td><code>node --watch</code></td><td>Built-in file watching for dev (no nodemon needed)</td></tr>
              <tr><td>Built-in fetch (already in 18+; stable now)</td><td>No need for <code>node-fetch</code> or <code>axios</code> for simple GET/POST</td></tr>
              <tr><td>WebStreams API</td><td>Same streaming primitives as the browser; cleaner than legacy Node streams</td></tr>
              <tr><td>Test runner (<code>node --test</code>)</td><td>Built-in test runner — no Jest required for small libs</td></tr>
              <tr><td>Permissions model (<code>--permission</code>)</td><td>Sandbox what files / network the process can touch — opt-in</td></tr>
              <tr><td>ESM by default</td><td>Both 22 and 24 strongly prefer ESM; <code>require()</code> still works, but new code is ESM</td></tr>
              <tr><td>V8 upgrades</td><td>~10-20% perf wins on object-heavy code per major version</td></tr>
              <tr><td>Native TypeScript stripping (24+)</td><td>Node can <em>strip</em> types from .ts files without a transpile step (no type-check though)</td></tr>
            </tbody>
          </table>

          <h3>Per-fleet versions</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Node version (Dockerfile base)</th></tr>
              <tr><td>SecretApp (Hearth)</td><td><code>node:22-alpine</code></td></tr>
              <tr><td>GLP1 (Tare)</td><td><code>node:20-alpine</code> (package.json says 24)</td></tr>
              <tr><td>Cairn</td><td><code>node:22-alpine</code></td></tr>
              <tr><td>PulseWire</td><td><code>node:22-alpine</code></td></tr>
              <tr><td>ShopKeep</td><td><code>node:22-alpine</code></td></tr>
              <tr><td>SecretPhoto</td><td><code>node:22-alpine</code> (+ <code>vips-dev</code> for sharp)</td></tr>
              <tr><td>Puzzlebox</td><td><code>node:22-alpine</code></td></tr>
              <tr><td>Tabloom</td><td><code>node:22-alpine</code></td></tr>
              <tr><td>Workshop</td><td><code>node:22-alpine</code></td></tr>
            </tbody>
          </table>
          <p>The Dockerfile base is the source of truth; <code>package.json</code> <code>engines.node</code> drift is common in personal apps.</p>
        </section>

        <hr />

        {/* SECTION 2 — ESM VS CJS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>ESM vs CommonJS</h2>
          <p>Every fleet app uses ESM. CommonJS still works, but every new project on Node 18+ should default to ESM.</p>

          <h3>What flips it on</h3>
          <CodePre>{`// package.json
{
  "type": "module"   // ← this one line makes every .js file in the package ESM
}`}</CodePre>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th>Topic</th><th>CJS</th><th>ESM</th></tr>
              <tr><td>Import</td><td><code>const x = require('./foo')</code></td><td><code>import x from './foo.js'</code></td></tr>
              <tr><td>Export</td><td><code>{'module.exports = { foo }'}</code></td><td><code>export const foo = ...</code> / <code>export default ...</code></td></tr>
              <tr><td>File extension</td><td>Optional</td><td>Required (<code>./foo.js</code>, not <code>./foo</code>)</td></tr>
              <tr><td>__dirname / __filename</td><td>Built-in</td><td>Compute from <code>import.meta.url</code></td></tr>
              <tr><td>Conditional require</td><td><code>if (cond) require(...)</code></td><td><code>await import(...)</code> (async)</td></tr>
              <tr><td>Top-level await</td><td>Not supported</td><td>Supported</td></tr>
              <tr><td>Live bindings</td><td>Snapshot at require</td><td>Re-read on every access</td></tr>
              <tr><td>Cycles</td><td>Partial exports OK</td><td>Hoisted bindings, full graph resolved before any module runs</td></tr>
            </tbody>
          </table>

          <h3>The <code>__dirname</code> shim every fleet app uses</h3>
          <CodePre>{`// SecretApp/server.js — verbatim
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

// Now use __dirname just like in CJS:
app.use(express.static(join(__dirname, 'dist')))`}</CodePre>

          <h3>The dual-package hazard</h3>
          <p>Some npm packages ship both formats. If you accidentally <code>require</code> the CJS build in one place and <code>import</code> the ESM build elsewhere, you get <em>two instances</em> of the package's internal state. Symptoms: a singleton that mysteriously isn't shared, instanceof checks failing across boundaries.</p>
          <p>Fix: be consistent within your codebase, and check package.json <code>exports</code> field for explicit ESM/CJS entries.</p>

          <h3>Interop tricks</h3>
          <CodePre>{`// Importing a CJS-only package from ESM:
import express from 'express'              // ✅ works — Node bridges default export

// Named imports from CJS sometimes fail:
import { Router } from 'express'           // ❌ may not work depending on shape

// Workaround: destructure from default
import express from 'express'
const { Router } = express                 // ✅`}</CodePre>

          <h3>Top-level await</h3>
          <CodePre>{`// ESM module — this works at the top level, no IIFE wrapping needed
import fetch from 'node-fetch'
const config = await (await fetch(CONFIG_URL)).json()
export default config`}</CodePre>

          <p>Top-level <code>await</code> blocks module evaluation. Use it sparingly: a slow top-level <code>await</code> in <code>lib/foo.js</code> blocks every module that imports it.</p>

          <h3>Dynamic import</h3>
          <CodePre>{`// Conditional or lazy load — returns a Promise resolving to the module namespace
async function getAnthropic() {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}`}</CodePre>

          <p>Workshop uses this pattern: it only instantiates the Anthropic client if <code>ANTHROPIC_API_KEY</code> is set, avoiding the dependency entirely in environments that don't need AI.</p>
        </section>

        <hr />

        {/* SECTION 3 — NATIVE MODULES */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Native Modules on Alpine</h2>
          <p>
            <code>better-sqlite3</code> is a native module — it's a C++ binding compiled against the running Node ABI. On
            Alpine, that compilation needs <code>python3</code>, <code>make</code>, and <code>g++</code>. Every fleet
            Dockerfile installs them in the <code>deps</code> AND <code>builder</code> stages, then drops them in
            <code>runner</code>.
          </p>

          <h3>The pattern</h3>
          <CodePre>{`# Every fleet Dockerfile, deps stage
FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++   # ← required for better-sqlite3 native build
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Builder stage
FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++   # ← needed again because deps are reinstalled with dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runner stage — NO build tools
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY server.js      ./
COPY package.json   ./
# ... no apk add — final image stays small`}</CodePre>

          <h3>Why two stages compile, one doesn't</h3>
          <ol>
            <li><strong>deps stage:</strong> installs ONLY production dependencies (<code>npm install --omit=dev</code>). The native binding compiles once. This stage's <code>node_modules/</code> is what ships to runner.</li>
            <li><strong>builder stage:</strong> installs ALL dependencies (including <code>vite</code>, <code>typescript</code>, etc.) so <code>npm run build</code> can transpile the frontend. The native binding compiles again, but this stage is discarded.</li>
            <li><strong>runner stage:</strong> just runs <code>node server.js</code>. No build tools means no compiler vulnerabilities in the final image and a 200MB final size vs 600MB+.</li>
          </ol>

          <h3>Other common native modules</h3>
          <table>
            <tbody>
              <tr><th>Package</th><th>Why native</th><th>Apps using it</th></tr>
              <tr><td><code>better-sqlite3</code></td><td>Bindings to SQLite C library</td><td>7 of 8 (all but PulseWire)</td></tr>
              <tr><td><code>sharp</code></td><td>libvips for image processing</td><td>None currently — could be added for thumbnail generation</td></tr>
              <tr><td><code>node-pty</code></td><td>terminal subprocesses</td><td>None</td></tr>
              <tr><td><code>argon2</code> / <code>bcrypt</code></td><td>Password hashing</td><td>None — fleet uses Entra ID</td></tr>
            </tbody>
          </table>

          <h3>When prebuilt binaries save your day</h3>
          <p>Most native modules ship prebuilt binaries via <code>node-pre-gyp</code> or <code>prebuild-install</code>. If a matching binary exists for your platform + Node version + ABI, npm downloads it and skips compilation. Alpine/musl is sometimes a miss — that's why fleet Dockerfiles always have the compiler ready.</p>

          <h3>The <code>node-gyp</code> error</h3>
          <CodePre>{`# Symptom in build log:
gyp ERR! find Python
gyp ERR! find Python Python is not set from command line or npm configuration
gyp ERR! find Python checking if "python" can be used`}</CodePre>
          <p>You forgot the <code>apk add python3 make g++</code> line. Add it.</p>

          <h3>libc compat for PulseWire</h3>
          <p>PulseWire's Dockerfile adds one extra package: <code>libc6-compat</code>. Some Next.js native deps reach for glibc symbols that Alpine's musl doesn't supply by default. The package provides a compatibility shim:</p>
          <CodePre>{`# PulseWire Dockerfile
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat   # ← Next.js + some shared deps need this`}</CodePre>
        </section>

        <hr />

        {/* SECTION 4 — UPLOADS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Multer + file-type — Safe Uploads</h2>
          <p>
            <code>multer</code> is the standard Express middleware for <code>multipart/form-data</code>. By itself, it
            trusts the client's <code>Content-Type</code> header — which is the threat model for stored XSS. The
            fleet pattern: multer for the upload, <code>file-type</code> for magic-byte sniffing, reject mismatches.
          </p>

          <h3>Workshop's full pattern</h3>
          <CodePre>{`// workshop/server.js — verbatim, lines 435-467
// ── File upload (multer — disk storage) ─────────────────────────

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_PATH),
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase()
      cb(null, \`\${randomUUID()}\${ext}\`)
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
})

// Server-side MIME sniffing. The client-supplied req.file.mimetype is not
// trustworthy — an HTML file uploaded as image/jpeg would otherwise be served
// back as image/jpeg from our origin (still safe), but worse, anything we
// echoed as text/html could host stored XSS. Sniff magic bytes instead.
const ALLOWED_UPLOAD_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic',
  'image/heif', 'image/avif', 'image/bmp', 'image/tiff',
  'application/pdf',
])

async function sniffMimeOrReject(filePath) {
  const detected = await fileTypeFromFile(filePath)
  if (!detected || !ALLOWED_UPLOAD_MIMES.has(detected.mime)) {
    await unlinkAsync(filePath).catch(() => {})
    const e = new Error('Unsupported file type — only images and PDFs are accepted')
    e.status = 400
    throw e
  }
  return detected.mime
}`}</CodePre>

          <h3>The full route</h3>
          <CodePre>{`router.post('/api/projects/:id/images', requireAuth, upload.single('file'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })

  try {
    // Re-read the file (now on disk) and sniff its magic bytes.
    const mime = await sniffMimeOrReject(req.file.path)
    // \`mime\` is now the verified MIME type; safe to store + serve back.
    db.prepare('INSERT INTO project_images (project_id, file_path, mime) VALUES (?, ?, ?)')
      .run(req.params.id, req.file.path, mime)
    res.status(201).json({ ok: true })
  } catch (err) {
    next(err)
  }
})`}</CodePre>

          <h3>Why never trust <code>req.file.mimetype</code></h3>
          <p>That field is whatever the <em>client</em> said the file was. The client is hostile in this threat model. A malicious user can:</p>
          <ol>
            <li>Craft a file that's HTML at the start but valid PNG bytes thereafter.</li>
            <li>Upload it with <code>Content-Type: image/png</code>.</li>
            <li>Multer accepts it. <code>req.file.mimetype === 'image/png'</code>.</li>
            <li>You serve it back with <code>res.type('image/png')</code>. Safe so far.</li>
            <li>But if you ever <em>echo</em> the MIME from the DB without re-sniffing, OR an attacker tricks you into serving it as <code>text/html</code>, you get stored XSS.</li>
          </ol>
          <p>Magic-byte sniffing reads the actual file content's first ~20 bytes against a known table. PNG starts with <code>89 50 4E 47</code>; JPEG with <code>FF D8 FF</code>; PDF with <code>25 50 44 46</code>. <code>file-type</code> handles the table.</p>

          <h3>Disk vs memory storage</h3>
          <table>
            <tbody>
              <tr><th>Mode</th><th>When</th></tr>
              <tr><td>Disk (workshop pattern)</td><td>Large files, persistent storage, server has volume. Multer streams straight to disk.</td></tr>
              <tr><td>Memory</td><td>Small files (&lt; 1MB), processed once then forwarded (e.g. to BLOB column or remote storage). <code>req.file.buffer</code> available.</td></tr>
            </tbody>
          </table>

          <h3>BLOB storage variant — Hearth recipe images</h3>
          <CodePre>{`// SecretApp/routes/recipes.js (pattern)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/api/recipes/:id/images', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  const mime = (await fileTypeFromBuffer(req.file.buffer))?.mime
  if (!ALLOWED_MIMES.has(mime)) return res.status(400).json({ error: 'unsupported type' })

  db.prepare('INSERT INTO recipe_images (recipe_id, file_data, file_type, file_size, file_name) VALUES (?, ?, ?, ?, ?)')
    .run(req.params.id, req.file.buffer, mime, req.file.size, req.file.originalname)
  res.status(201).json({ ok: true })
})`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>The <code>filename</code> randomization matters.</strong> If you save by <code>originalname</code>,
              two users uploading <code>photo.jpg</code> overwrite each other. Worse, a user can upload <code>../../etc/passwd</code>
              and break out of UPLOADS_PATH. Workshop generates <code>randomUUID()</code> + original extension; safe and
              predictable.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 5 — UNDICI */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>undici — Custom HTTP Dispatchers</h2>
          <p>
            <code>undici</code> is the HTTP/1.1 client built into Node 18+. It's what powers global <code>fetch()</code>.
            Sometimes you need to deviate from the default — a self-signed TLS cert, a different timeout, a connection
            pool. That's what a Dispatcher does.
          </p>

          <h3>Hearth's self-signed Plex bypass</h3>
          <CodePre>{`// SecretApp/lib/plex.js — verbatim
// Plex configuration, an undici Dispatcher that bypasses TLS verification,
// and shared fetch helpers. Most home Plex servers run with a self-signed
// cert on the LAN; the dispatcher is the native-fetch equivalent of
// node-fetch's \`agent: { rejectUnauthorized: false }\`. If the app ever
// talks to Plex over an untrusted network, revisit.

import { Agent } from 'undici'

export const plexConfig = {
  baseUrl:        process.env.PLEX_BASE_URL || 'https://localhost:32400',
  token:          process.env.PLEX_TOKEN,
  librarySection: process.env.PLEX_LIBRARY_SECTION || '9',
}

export const plexDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
})

// Thrown on any non-2xx Plex response. Carries status + path so callers can
// build user-facing messages without re-parsing the error text.
export class PlexAPIError extends Error {
  constructor(status, path) {
    super(\`Plex request to \${path} failed with status \${status}\`)
    this.name = 'PlexAPIError'
    this.status = status
    this.path = path
  }
}

export async function plexFetch(path, options = {}) {
  const { method = 'GET', formData, accept = 'json' } = options
  const separator = path.includes('?') ? '&' : '?'
  const url = \`\${plexConfig.baseUrl}\${path}\${separator}X-Plex-Token=\${plexConfig.token}\`

  const init = {
    method,
    headers: { Accept: accept === 'xml' ? 'application/xml' : 'application/json' },
    dispatcher: plexDispatcher,   // ← key — fetch uses this instead of the default
  }
  if (formData) {
    init.body = new URLSearchParams(formData)
    init.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return fetch(url, init)
}

export async function plexJSON(path, options = {}) {
  const response = await plexFetch(path, options)
  if (!response.ok) throw new PlexAPIError(response.status, path)
  return response.json()
}

export async function plexText(path, options = {}) {
  const response = await plexFetch(path, { accept: 'xml', ...options })
  if (!response.ok) throw new PlexAPIError(response.status, path)
  return response.text()
}`}</CodePre>

          <h3>The dispatcher key</h3>
          <CodePre>{`const dispatcher = new Agent({
  // TLS knobs
  connect: {
    rejectUnauthorized: false,  // accept self-signed certs (DANGEROUS on untrusted networks)
    ca: 'PEM string',           // OR provide a CA explicitly (safer)
  },

  // Connection pool
  connections: 10,              // max sockets per origin

  // Timeouts
  connectTimeout: 5000,         // ms to establish connection
  bodyTimeout: 30000,           // ms between reads from the body
  headersTimeout: 30000,        // ms to receive headers
  keepAliveTimeout: 4000,       // ms to keep idle connections

  // HTTP/2 (off by default)
  allowH2: false,
})`}</CodePre>

          <h3>When to reach for a custom dispatcher</h3>
          <ul>
            <li><strong>Self-signed TLS</strong> (Hearth ↔ Plex on LAN).</li>
            <li><strong>Mutual TLS</strong> (B2B integrations with client certs).</li>
            <li><strong>Strict timeouts</strong> for one client (e.g. you want the AI proxy to fail in 30s, but the Plex client in 5s).</li>
            <li><strong>Connection pooling</strong> for high-throughput downstream APIs.</li>
            <li><strong>HTTP/2</strong> when the server supports it.</li>
          </ul>

          <h3>The default vs custom decision</h3>
          <p>Global <code>fetch()</code> uses a shared default dispatcher. Pass <code>{`{ dispatcher: ...}`}</code> in the options to override per-call. Pass <code>setGlobalDispatcher(d)</code> to change the default app-wide (rarely a good idea — affects every fetch).</p>
        </section>

        <hr />

        {/* SECTION 6 — RATE LIMITING */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>express-rate-limit — Per-User Throttling</h2>
          <p>
            Workshop applies rate limiting to its two AI endpoints — 30 calls per user per hour. The crucial detail:
            the limiter is keyed by user OID, not IP. Multiple users behind a NAT (or a home network) would otherwise
            burn each other's quota.
          </p>

          <h3>Workshop's setup</h3>
          <CodePre>{`// workshop/server.js — verbatim, lines 659-667
import rateLimit from 'express-rate-limit'

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,    // 1 hour
  limit: 30,                    // 30 analyze calls / user / hour
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.oid ?? req.ip,
  message: { error: 'rate limit exceeded — try again later' },
})

app.use(['/api/projects/analyze-url', '/api/shaper-projects/analyze-url'], aiLimiter)`}</CodePre>

          <h3>Knob by knob</h3>
          <table>
            <tbody>
              <tr><th>Knob</th><th>What it does</th></tr>
              <tr><td><code>windowMs</code></td><td>The time window in milliseconds</td></tr>
              <tr><td><code>limit</code></td><td>Max requests per window per key</td></tr>
              <tr><td><code>keyGenerator</code></td><td>Function that returns the key. <strong>Default is <code>req.ip</code></strong> — almost never what you want.</td></tr>
              <tr><td><code>standardHeaders</code></td><td>Emit <code>RateLimit-Limit/-Remaining/-Reset</code> (modern)</td></tr>
              <tr><td><code>legacyHeaders</code></td><td>Emit <code>X-RateLimit-*</code> (old) — usually off</td></tr>
              <tr><td><code>message</code></td><td>Body returned on 429. Default is a string; pass an object for JSON</td></tr>
              <tr><td><code>handler</code></td><td>Custom 429 handler (e.g. log + custom shape)</td></tr>
              <tr><td><code>store</code></td><td>Where counters live — default is in-memory (process-local)</td></tr>
              <tr><td><code>skip</code></td><td>Function returning true to skip this request (e.g. admin OID)</td></tr>
            </tbody>
          </table>

          <h3>Default store gotchas</h3>
          <p>The default in-memory store works fine for a single-process App Service (everything fleet apps run). If you scale to multiple instances, every instance has its own counter — limits effectively multiply by N. For multi-instance apps, use the Redis store (<code>rate-limit-redis</code>).</p>

          <h3>What to rate-limit</h3>
          <ul>
            <li><strong>Paid AI endpoints</strong> — token cost grows with calls (Workshop's pattern).</li>
            <li><strong>Slow endpoints</strong> — anything that takes &gt; 1s of compute.</li>
            <li><strong>External-API-relay endpoints</strong> — your AI proxy will get throttled upstream anyway; better to limit here.</li>
            <li><strong>Auth endpoints</strong> — if you have password login (none in fleet).</li>
            <li><strong>Search endpoints</strong> — easy to weaponize for resource exhaustion.</li>
          </ul>

          <h3>The OID fallback</h3>
          <p>Workshop uses <code>req.user?.oid ?? req.ip</code>. If the user is unauthenticated (shouldn't happen on AI endpoints, but defense in depth), fall back to IP. Without the fallback, a missing OID resolves to <code>undefined</code> and every unauthenticated request shares the same counter — instant DoS for everyone.</p>
        </section>

        <hr />

        {/* SECTION 7 — SANITIZE + ARCHIVER */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>sanitize-html + archiver — Two More Standard Libs</h2>

          <h3>sanitize-html — XSS defense for user HTML</h3>
          <p>
            Tabloom's TipTap editor stores HTML directly (not JSON). On every save, Tabloom passes the HTML through
            <code>sanitize-html</code> to strip script tags, event handlers, and any other dangerous markup. Without
            this, a user could paste an <code>{`<img onerror="...">`}</code> into the editor and pop their own session
            on next render. (On a single-user app, that's silly; with notebook sharing, it's stored XSS.)
          </p>
          <CodePre>{`import sanitizeHtml from 'sanitize-html'

const CLEAN_OPTS = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's', 'sub', 'sup',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'img', 'figure', 'figcaption',
    'blockquote', 'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a:   ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    '*': ['class', 'style'],   // sparingly — style allows CSS expression() in old IE; modern browsers ignore
  },
  allowedSchemes: ['http', 'https', 'mailto', 'data'],
  // Transform: force external links to open in new tab + noopener
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' },
    }),
  },
}

function safeSave(req, res) {
  const cleanHtml = sanitizeHtml(req.body.html, CLEAN_OPTS)
  db.prepare('UPDATE pages SET html = ? WHERE id = ?').run(cleanHtml, req.params.id)
  res.json({ ok: true })
}`}</CodePre>

          <h3>The threats it blocks</h3>
          <ul>
            <li><code>{`<script>`}</code> tags — dropped.</li>
            <li><code>onerror</code>, <code>onclick</code>, all event handler attributes — dropped.</li>
            <li><code>javascript:</code> URLs in <code>href</code>/<code>src</code> — dropped.</li>
            <li>Unknown tags — dropped.</li>
            <li>Unknown attributes — dropped.</li>
          </ul>

          <h3>archiver — building ZIP files on the fly</h3>
          <p>Tabloom uses <code>archiver</code> to build downloadable notebook exports as ZIPs. The pattern: stream-pipe the archive into the HTTP response so memory usage stays flat regardless of export size.</p>
          <CodePre>{`import archiver from 'archiver'

router.get('/api/notebooks/:id/export.zip', requireOwner, (req, res) => {
  const notebook = db.prepare('SELECT * FROM notebooks WHERE id = ?').get(req.params.id)
  if (!notebook) return res.status(404).end()

  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', \`attachment; filename="\${notebook.name}.zip"\`)

  const zip = archiver('zip', { zlib: { level: 9 } })
  zip.on('error', err => res.status(500).end(err.message))
  zip.pipe(res)

  // Add page HTMLs
  const pages = db.prepare('SELECT id, title, html FROM pages WHERE notebook_id = ?').all(notebook.id)
  for (const p of pages) {
    zip.append(p.html, { name: \`pages/\${p.id}-\${p.title}.html\` })
  }

  // Add media files
  const media = db.prepare('SELECT file_path, original_name FROM media WHERE notebook_id = ?').all(notebook.id)
  for (const m of media) {
    zip.file(m.file_path, { name: \`media/\${m.original_name}\` })
  }

  zip.finalize()
})`}</CodePre>

          <h3>Other archive options</h3>
          <table>
            <tbody>
              <tr><th>Format</th><th>Module</th><th>Use when</th></tr>
              <tr><td>ZIP</td><td><code>archiver</code></td><td>Default — Windows-friendly</td></tr>
              <tr><td>TAR</td><td><code>archiver</code> or built-in <code>tar</code></td><td>Unix-friendly, large dirs with permissions</td></tr>
              <tr><td>GZIP single file</td><td>built-in <code>zlib</code></td><td>One big file (log dump)</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 8 — ENV VALIDATION */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Env Validation at Startup</h2>
          <p>Every fleet app crashes loudly at startup if a required env var is missing. The alternative — silently launching with <code>process.env.X === undefined</code> — produces inscrutable failures hours later.</p>

          <h3>The minimum pattern (Hearth)</h3>
          <CodePre>{`// SecretApp/server.js — verbatim, lines 18-30
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
}`}</CodePre>

          <h3>The PulseWire pattern — Zod schema</h3>
          <CodePre>{`// PulseWire/src/env.ts — verbatim (truncated)
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL:             z.string().url(),
    ENTRA_TENANT_ID:          z.string().uuid(),
    ENTRA_CLIENT_ID:          z.string().uuid(),
    ENTRA_CLIENT_SECRET:      z.string().min(1),
    SESSION_SECRET:           z.string().min(32),
    APP_BASE_URL:             z.string().url(),
    AZURE_AI_ENDPOINT:        z.string().url(),
    AZURE_AI_API_KEY:         z.string().min(1),
    AZURE_AI_CHAT_DEPLOYMENT: z.string().min(1),
    AZURE_AI_EMBED_DEPLOYMENT: z.string().min(1),
    SENDGRID_API_KEY:         z.string().optional(),
    COST_ALERT_EMAIL:         z.string().email().optional(),
    NODE_ENV:                 z.enum(['development', 'test', 'production']).default('development'),
  },
  client: {},
})`}</CodePre>

          <p>The Zod schema gives you three things:</p>
          <ol>
            <li><strong>Validation</strong>: <code>z.string().uuid()</code> fails the build if the value isn't a valid UUID.</li>
            <li><strong>Defaults</strong>: <code>NODE_ENV</code> defaults to <code>"development"</code>.</li>
            <li><strong>Types</strong>: <code>env.SESSION_SECRET</code> is typed as <code>string</code> (not <code>string | undefined</code>), so you don't need <code>!</code> assertions everywhere.</li>
          </ol>

          <h3>Required vs optional</h3>
          <p>Be honest about what's truly required to <em>start</em> the server vs what's only needed for specific features. Hearth's <code>ANTHROPIC_API_KEY</code> is optional — the recipe AI endpoints return 503 if it's absent, but the rest of the app works. Don't <code>exit(1)</code> on optional vars.</p>

          <h3>Where env vars come from</h3>
          <table>
            <tbody>
              <tr><th>Environment</th><th>Source</th></tr>
              <tr><td>Local dev</td><td><code>.env</code> file loaded by <code>dotenv/config</code></td></tr>
              <tr><td>App Service</td><td>App Settings (set via portal, CLI, or Bicep)</td></tr>
              <tr><td>Docker run</td><td><code>--env-file</code> or <code>-e</code> flags</td></tr>
              <tr><td>Docker build (VITE_*)</td><td><code>--build-arg</code> → ENV in Dockerfile → process.env in npm run build</td></tr>
              <tr><td>Key Vault references (PulseWire)</td><td>App Setting value is <code>@Microsoft.KeyVault(...)</code></td></tr>
            </tbody>
          </table>

          <h3>Use <code>.env.example</code></h3>
          <p>Every fleet repo commits a <code>.env.example</code> with the var names but blank values. New contributors copy it to <code>.env</code> and fill in their own. CI lints that every required var in <code>server.js</code> appears in <code>.env.example</code>.</p>
        </section>

        <hr />

        {/* SECTION 9 — PROCESS LIFECYCLE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Process Lifecycle</h2>

          <h3>Signals</h3>
          <p>App Service sends <code>SIGTERM</code> when it restarts the container. You have ~30 seconds before it sends <code>SIGKILL</code>. Handle <code>SIGTERM</code> to: finish in-flight requests, close DB handles, flush logs.</p>
          <CodePre>{`// GLP1/server.js — verbatim
function closeAllDbs() {
  for (const db of dbHandles.values()) {
    try { db.close() } catch { /* ignore */ }
  }
  dbHandles.clear()
}
process.on('SIGTERM', closeAllDbs)
process.on('SIGINT',  () => { closeAllDbs(); process.exit(0) })`}</CodePre>

          <p>For Express, the full graceful shutdown looks like:</p>
          <CodePre>{`const server = app.listen(port)

const shutdown = (signal) => {
  console.log(\`[\${signal}] graceful shutdown\`)
  server.close(err => {                 // stop accepting new connections
    if (err) console.error(err)
    closeAllDbs()                        // close DB handles
    process.exit(err ? 1 : 0)
  })
  // If still running after 10s, force exit
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))`}</CodePre>

          <h3>Uncaught errors</h3>
          <CodePre>{`process.on('uncaughtException', err => {
  console.error('[uncaught]', err)
  // Don't try to recover — crash and let App Service restart you
  process.exit(1)
})

process.on('unhandledRejection', reason => {
  console.error('[unhandledRejection]', reason)
  process.exit(1)
})`}</CodePre>

          <p>Listening for these to <em>log</em> is fine. Listening to <em>swallow</em> them is a bug factory — your app is now in an unknown state and may corrupt data on its next operation. Crash and restart is the only safe response.</p>

          <h3>Cold start</h3>
          <p>App Service B1 (the fleet tier) is single-instance, no warm pool. Cold start = the container is gone, you wait for image pull + Node boot + schema apply. Reliably 2–4 minutes. The deploy workflow polls <code>/api/health</code> for up to 5 minutes; the user-facing impact is "first request after a deploy is slow."</p>

          <p>Strategies if you need faster cold start:</p>
          <ul>
            <li><strong>Always On</strong> — App Service Plan setting; B1 doesn't support it (B2 does). Pings your app so it never goes idle.</li>
            <li><strong>Premium tier</strong> — Pre-warmed instances. Expensive for personal apps.</li>
            <li><strong>External pinger</strong> — UptimeRobot or similar hits <code>/api/health</code> every 5 minutes. Costs nothing.</li>
          </ul>

          <h3>Memory</h3>
          <p>B1 has 1.75 GB RAM. Node uses what it needs up to <code>--max-old-space-size</code> (default ~50% of system memory). For B1 that's ~870 MB. Push it: <code>node --max-old-space-size=1400 server.js</code>. Fleet apps don't tune this; sufficient for now.</p>
        </section>

        <hr />

        {/* SECTION 10 — LOGGING */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Logging — Without App Insights</h2>
          <p>
            None of the fleet apps wire Application Insights. Logging is <code>console.log</code> + App Service log
            streaming. Workable for personal scale; here's how to get the most out of it.
          </p>

          <h3>Structured vs unstructured</h3>
          <p>Single-string logs (<code>console.log('user 42 saved recipe')</code>) are hard to grep, filter, or aggregate. JSON logs (<code>{`console.log(JSON.stringify({ at: 'recipe.save', user: 42, recipe: 17 }))`}</code>) are queryable. App Service's log stream is plain text either way, but if you ever move to a real log sink, the JSON paid off.</p>

          <h3>The pino pattern (recommended)</h3>
          <CodePre>{`import pino from 'pino'

export const log = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  // Pretty-print in dev; JSON in prod
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  } : undefined,
})

log.info({ user: req.user.oid, route: '/api/recipes' }, 'recipe saved')
log.warn({ status: 401 }, 'invalid token')
log.error({ err: error.message, stack: error.stack }, 'unhandled error')`}</CodePre>

          <h3>What every fleet app logs</h3>
          <table>
            <tbody>
              <tr><th>Event</th><th>Why</th></tr>
              <tr><td>Server start (port + DB path)</td><td>Confirm boot in the deploy log</td></tr>
              <tr><td>Required-env validation</td><td>Bad config = immediate exit with reason</td></tr>
              <tr><td>Auth failures</td><td>Distinguish "missing token" from "expired" from "wrong audience"</td></tr>
              <tr><td>AI calls</td><td>Model, tokens, cost estimate, status</td></tr>
              <tr><td>Errors</td><td>Method, path, error message — never the stack to client</td></tr>
              <tr><td>Plex action log (Hearth)</td><td>Every delete attempt + outcome (in the DB, not console)</td></tr>
            </tbody>
          </table>

          <h3>Streaming logs from App Service</h3>
          <CodePre>{`# Real-time stream from the running container
az webapp log tail -g rg-personal-apps-prod -n app-hearth-prod-lwxhu7jxlrbtu

# Download recent logs as zip
az webapp log download -g rg-personal-apps-prod -n app-hearth-prod-lwxhu7jxlrbtu --log-file logs.zip`}</CodePre>

          <h3>When to graduate to App Insights</h3>
          <ul>
            <li>Multi-instance app where logs are interleaved across containers.</li>
            <li>You need to alert on patterns ("error rate &gt; 5% in 5 min").</li>
            <li>You need correlation between frontend errors and backend logs.</li>
            <li>You need long-term retention (App Service rotates logs aggressively).</li>
            <li>You need user-impact metrics (real user monitoring).</li>
          </ul>

          <p>Wire it via <code>applicationinsights</code> npm package + <code>APPINSIGHTS_CONNECTION_STRING</code> env var. The SDK auto-instruments Express, HTTP, console.log. Cost: free up to 5 GB ingest/month.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a Safe Upload Pipeline</h2>
          <p>Stand up an Express endpoint that accepts an image upload, sniffs magic bytes, rejects non-images, and stores the file with a randomized name — the Workshop pattern, end to end.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`mkdir upload-lab && cd upload-lab
npm init -y
npm pkg set type=module
npm i express multer file-type
echo "node_modules/\\nuploads/" > .gitignore`}</CodePre>

          <h3>Step 2 — Build the server</h3>
          <CodePre>{`// server.js
import express from 'express'
import multer from 'multer'
import { fileTypeFromFile } from 'file-type'
import { randomUUID } from 'crypto'
import { mkdirSync, unlinkSync } from 'fs'
import { extname, join } from 'path'

const UPLOADS_DIR = './uploads'
mkdirSync(UPLOADS_DIR, { recursive: true })

const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
])

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase()
      cb(null, \`\${randomUUID()}\${ext}\`)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },   // 10MB
})

async function sniffMimeOrReject(filePath) {
  const detected = await fileTypeFromFile(filePath)
  if (!detected || !ALLOWED_MIMES.has(detected.mime)) {
    try { unlinkSync(filePath) } catch {}
    throw Object.assign(new Error('Unsupported file type'), { status: 400 })
  }
  return detected.mime
}

const app = express()
app.use(express.static(UPLOADS_DIR))

app.post('/api/upload', upload.single('file'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  try {
    const mime = await sniffMimeOrReject(req.file.path)
    res.json({
      filename: req.file.filename,
      url: \`/\${req.file.filename}\`,
      size: req.file.size,
      verifiedMime: mime,
      clientClaimedMime: req.file.mimetype,
    })
  } catch (err) {
    next(err)
  }
})

app.use((err, _req, res, _next) => {
  console.error('[error]', err.message)
  res.status(err.status ?? 500).json({ error: err.message })
})

app.listen(3000, () => console.log('Upload lab on :3000'))`}</CodePre>

          <h3>Step 3 — Test the happy path</h3>
          <CodePre>{`# Grab a tiny JPEG
curl -o cat.jpg https://placecats.com/200/200

# Upload it
curl -F file=@cat.jpg http://localhost:3000/api/upload`}</CodePre>

          <p>Response:</p>
          <CodePre>{`{
  "filename": "abc12345-...jpg",
  "url": "/abc12345-...jpg",
  "size": 8432,
  "verifiedMime": "image/jpeg",
  "clientClaimedMime": "image/jpeg"
}`}</CodePre>

          <h3>Step 4 — Test the malicious path</h3>
          <p>Create a fake JPEG that's actually HTML:</p>
          <CodePre>{`# Make a "JPEG" that's actually an XSS payload
cat > fake.jpg << 'EOF'
<script>alert(document.cookie)</script>
EOF

# Try to upload it
curl -F file=@fake.jpg http://localhost:3000/api/upload`}</CodePre>

          <p>Response:</p>
          <CodePre>{`{ "error": "Unsupported file type" }`}</CodePre>

          <p>The file is rejected because <code>fileTypeFromFile</code> reads the magic bytes — and the magic bytes say "this is text," not JPEG. The fake file is unlinked before the response.</p>

          <h3>Step 5 — Verify the disk state</h3>
          <CodePre>{`ls -la uploads/
# You should see only the real .jpg, not the rejected fake.jpg`}</CodePre>

          <h3>Step 6 — Test a content-type mismatch</h3>
          <p>Upload the real JPEG but lie about its type:</p>
          <CodePre>{`# Force the Content-Type to text/html
curl -F 'file=@cat.jpg;type=text/html' http://localhost:3000/api/upload`}</CodePre>

          <p>Response is <em>still successful</em> — the magic bytes win, so the server records the verified MIME (<code>image/jpeg</code>) regardless of what the client claimed. <code>clientClaimedMime</code> shows the lie; <code>verifiedMime</code> shows reality.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated Workshop's exact production pattern. The four guarantees: (a) random filenames (no collisions, no traversal), (b) size limit (multer's <code>fileSize</code>), (c) magic-byte verification (server-trusted MIME), (d) cleanup on failure (rejected files don't pollute the volume).
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Error: Cannot find module ... or its corresponding type declarations"</h3>
          <p>You're using ESM with a missing file extension. Change <code>import x from './foo'</code> to <code>import x from './foo.js'</code>. (Yes, even for .ts files when <code>moduleResolution: bundler</code> isn't set — see the TypeScript guide.)</p>

          <h3>"better-sqlite3 was compiled against a different Node.js version"</h3>
          <p>You upgraded Node but didn't rebuild native modules. <code>npm rebuild better-sqlite3</code>. If that fails, <code>rm -rf node_modules &amp;&amp; npm install</code>.</p>

          <h3>"node-gyp: Python not found"</h3>
          <p>Your Alpine image is missing <code>python3 make g++</code>. Add them to the Dockerfile stage that does <code>npm install</code>.</p>

          <h3>"fetch failed: self-signed certificate"</h3>
          <p>The target uses a cert that isn't in Node's trust store. Either: (a) use an undici dispatcher with <code>rejectUnauthorized: false</code> (Hearth's Plex pattern), or (b) better, install the cert via <code>NODE_EXTRA_CA_CERTS=/path/to/cert.pem</code> env var.</p>

          <h3>"Request entity too large"</h3>
          <p>The default <code>express.json()</code> limit is 100KB. Set it: <code>express.json(&#123; limit: '20mb' &#125;)</code>.</p>

          <h3>"Multer error: File too large"</h3>
          <p>The multer <code>limits.fileSize</code> hit. Either increase it or have the client compress before upload.</p>

          <h3>SIGTERM didn't fire on container restart</h3>
          <p>Your CMD is wrong. <code>CMD "node server.js"</code> wraps the process in a shell which doesn't forward signals. Use the array form: <code>CMD ["node", "server.js"]</code>. Every fleet Dockerfile gets this right.</p>

          <h3>Process leaks memory until OOM</h3>
          <p>Common causes: (a) unclosed file/DB handles in error paths, (b) timers without <code>clearInterval</code> on cleanup, (c) caches that grow unbounded (always cap with LRU eviction), (d) SSE responses leaking because <code>req.on('close')</code> isn't wired.</p>

          <h3>"Cannot use import statement outside a module"</h3>
          <p>You set <code>type: "module"</code> in package.json but a file has <code>require()</code> syntax. Either: (a) convert to <code>import</code>, (b) rename the file to <code>.cjs</code>, (c) remove <code>type: "module"</code> from package.json.</p>

          <h3>The deployed app reads stale env vars</h3>
          <p>You updated an App Service Application Setting but didn't restart the app. App Settings are read by Node at process start, not on the fly. <code>az webapp restart</code>.</p>

          <h3>"EADDRINUSE: address already in use :::3001"</h3>
          <p>Another process holds the port. Find it: Windows <code>netstat -ano | findstr :3001</code>, Mac/Linux <code>lsof -i :3001</code>. Kill it or change ports.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>ESM essentials</h3>
          <CodePre>{`// package.json
{ "type": "module" }

// __dirname / __filename shim
import { fileURLToPath } from 'url'
import { dirname }       from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

// Top-level await — works in ESM
const config = await fetch(url).then(r => r.json())

// Dynamic import — lazy load
const { default: Heavy } = await import('./heavy.js')`}</CodePre>

          <h3>Multer + file-type (safe uploads)</h3>
          <CodePre>{`import multer from 'multer'
import { fileTypeFromFile } from 'file-type'
import { randomUUID } from 'crypto'

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOADS),
    filename:    (_, file, cb) => cb(null, randomUUID() + extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
})

async function sniff(path) {
  const t = await fileTypeFromFile(path)
  if (!t || !ALLOWED.has(t.mime)) {
    await unlink(path).catch(() => {})
    throw Object.assign(new Error('bad type'), { status: 400 })
  }
  return t.mime
}`}</CodePre>

          <h3>undici dispatcher</h3>
          <CodePre>{`import { Agent } from 'undici'

const dispatcher = new Agent({
  connect:        { rejectUnauthorized: false },  // self-signed
  connections:    10,
  connectTimeout: 5000,
  bodyTimeout:    30000,
})

fetch(url, { dispatcher })`}</CodePre>

          <h3>express-rate-limit</h3>
          <CodePre>{`import rateLimit from 'express-rate-limit'

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  keyGenerator: req => req.user?.oid ?? req.ip,
  message: { error: 'rate limited' },
})

app.use(['/api/ai/*'], aiLimiter)`}</CodePre>

          <h3>Graceful shutdown</h3>
          <CodePre>{`const server = app.listen(port)

const shutdown = sig => {
  server.close(() => {
    for (const db of dbHandles.values()) {
      try { db.close() } catch {}
    }
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>ESM <code>__dirname</code> shim</td><td>SecretApp · <code>server.js:10-14</code></td></tr>
              <tr><td>undici TLS-bypass dispatcher</td><td>SecretApp · <code>lib/plex.js</code></td></tr>
              <tr><td>multer + file-type</td><td>workshop · <code>server.js:435-467</code></td></tr>
              <tr><td>express-rate-limit by OID</td><td>workshop · <code>server.js:659-667</code></td></tr>
              <tr><td>SSRF guard</td><td>workshop · <code>server.js:469-517</code></td></tr>
              <tr><td>archiver for ZIP</td><td>tabloom · <code>server.js</code> (export endpoint)</td></tr>
              <tr><td>Zod env validation</td><td>PulseWire · <code>src/env.ts</code></td></tr>
              <tr><td>Required env exit(1)</td><td>SecretApp · <code>server.js:18-30</code></td></tr>
              <tr><td>SIGTERM handler</td><td>GLP1 · <code>server.js:316-324</code></td></tr>
              <tr><td>VACUUM-equivalent backup</td><td>tabloom · <code>lib/backup.js</code></td></tr>
              <tr><td>Native module deps</td><td>Every fleet Dockerfile (apk add python3 make g++)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: SQLite + better-sqlite3 mastery.</p>
        </section>
      </main>
    </div>
  );
}
