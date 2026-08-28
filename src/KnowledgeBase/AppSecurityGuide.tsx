import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Threat Model: Who, Why, How',        icon: '🎯' },
  { id: 's3',  num: '3',  title: 'trust proxy + Real Client IPs',      icon: '🌐' },
  { id: 's4',  num: '4',  title: 'CORS Configuration',                 icon: '🚦' },
  { id: 's5',  num: '5',  title: 'Request Size Limits',                icon: '📏' },
  { id: 's6',  num: '6',  title: 'requireAuth Discipline',             icon: '🔒' },
  { id: 's7',  num: '7',  title: 'Rate Limiting + IP Allowlists',      icon: '⏳' },
  { id: 's8',  num: '8',  title: 'Input Validation Patterns',          icon: '✅' },
  { id: 's9',  num: '9',  title: 'HTTP Security Headers',              icon: '📨' },
  { id: 's10', num: '10', title: 'Audit Logs + Secret Scrubbing',      icon: '📜' },
  { id: 's11', num: '★',  title: 'Lab: Harden a Sample Express App',   icon: '🛠️' },
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

export default function AppSecurityGuide() {
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
            <span className="sidebar-title">App Security</span>
          </div>
          <div className="sidebar-sub">Hardening Express in production</div>
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
          <div className="hero-tag">🛡️ Express 5 · App Service Linux · 2026</div>
          <h1>Application Security<br />Hardening</h1>
          <p>
            The fleet's honest baseline: <strong style={{ color: '#C77AA0' }}>token auth (JWT + JWKS)</strong>,
            <strong style={{ color: '#C77AA0' }}> trust proxy</strong> for App Service reverse-proxy compatibility,
            generous CORS, generous request-size limits for base64 image uploads, no helmet, no rate limiting, manual
            input validation, no secret scrubbing in logs. Some of these are sins; some are deliberate tradeoffs for a
            private fleet behind Entra ID. This guide is the gap analysis: what's there, what's not, why, and how to
            harden a fresh app from zero. Includes the <code>requireAuth</code> middleware pattern, the JWKS lookup
            chain, what helmet's defaults do (and why the fleet doesn't need them today), and the rate-limiting
            recipe for when you DO go public.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">trust 1</span><span className="hero-stat-label">Proxy hops</span></div>
            <div className="hero-stat"><span className="hero-stat-val">JWKS</span><span className="hero-stat-label">Token verify</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">helmet usage</span></div>
            <div className="hero-stat"><span className="hero-stat-val">9</span><span className="hero-stat-label">Hardening levers</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            "Securing an Express app" sounds like a single task. It's actually nine independent concerns. Most apps
            ship with three or four of them correct and the others either misconfigured or absent. Production hardening
            means deliberately picking which ones matter for your app, and writing them down so the next developer
            doesn't undo them by mistake.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The bank vault</strong>. A bank doesn't have ONE security control. It has guards (auth), cameras
            (audit logs), reinforced walls (rate limits), the vault door (input validation), and a backup vault in
            another city (audit immutability). Each addresses a different threat. None alone is enough. None can be
            skipped while pretending the others compensate.
          </p>
          <p>
            <strong>Defense in depth</strong>. Military doctrine: don't put all your forces at the perimeter. Place
            them in layers so a breach of one layer hits another. In app security: even if auth bypasses, input
            validation might block; even if validation passes, an output filter might catch a leak. Each layer is
            cheap; together they form a robust shield.
          </p>
          <p>
            <strong>The threat model is the architecture</strong>. You can't decide what to harden without knowing
            who you're hardening against. A public-facing SaaS hardens against bots, script kiddies, OWASP top-10. An
            internal-only Entra-gated app hardens against compromised user accounts and dependency CVEs. The fleet
            picked the second model for everything except SecretApp's Plex Command Center, which has a public-facing
            angle (Plex auth tokens).
          </p>

          <h3>The fleet's baseline</h3>
          <p>What's in every fleet app:</p>
          <ul>
            <li><strong>JWT auth via Microsoft JWKS</strong> on every route under <code>/api/*</code>.</li>
            <li><strong><code>trust proxy</code></strong> set for App Service.</li>
            <li><strong>Health endpoints excluded from auth</strong> (so deploy verification works).</li>
            <li><strong>Request size limit</strong> via <code>express.json({"{ limit }"})</code>.</li>
            <li><strong>Prepared SQL statements</strong> (SQLi-proof).</li>
            <li><strong>Some audit logging</strong> (varies — Tabloom: stdout; ShopKeep: DB table; SecretApp: Plex action log).</li>
          </ul>

          <p>What's NOT in any fleet app:</p>
          <ul>
            <li>helmet (security headers middleware).</li>
            <li>Rate limiting (express-rate-limit).</li>
            <li>Input validation library (zod, joi).</li>
            <li>CSP / HSTS / X-Frame-Options explicit headers.</li>
            <li>IP allowlists.</li>
            <li>Secret scrubbing in logs.</li>
            <li>Request-body logging for forensic purposes.</li>
          </ul>

          <p>This guide explains each — when you NEED it, when you don't, and the recipe to add it.</p>

          <h3>The nine concerns at a glance</h3>
          <table>
            <tbody>
              <tr><th>Concern</th><th>Fleet status</th><th>For public-facing add?</th></tr>
              <tr><td>1. Reverse proxy awareness</td><td>✓ trust proxy 1</td><td>Yes (already done)</td></tr>
              <tr><td>2. CORS</td><td>cors() open</td><td>Yes — narrow to known origins</td></tr>
              <tr><td>3. Request size limits</td><td>1MB to 50MB depending on app</td><td>Tighten</td></tr>
              <tr><td>4. Auth</td><td>JWT + JWKS</td><td>Already done</td></tr>
              <tr><td>5. Rate limiting</td><td>None</td><td>Add express-rate-limit per route</td></tr>
              <tr><td>6. Input validation</td><td>Manual</td><td>Add zod or joi for routes accepting JSON</td></tr>
              <tr><td>7. HTTP security headers</td><td>None</td><td>Add helmet()</td></tr>
              <tr><td>8. Audit logs</td><td>Some apps</td><td>Always log auth events + mutations</td></tr>
              <tr><td>9. Secret scrubbing</td><td>None</td><td>Pino or Winston with redaction config</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 2 — THREAT MODEL */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Threat Model: Who, Why, How</h2>
          <p>Pick the right level of paranoia by knowing who you're defending against. The fleet's threat model:</p>

          <h3>The fleet's threat model</h3>
          <table>
            <tbody>
              <tr><th>Actor</th><th>Motive</th><th>Plausible attack</th><th>Fleet defense</th></tr>
              <tr><td>External anonymous</td><td>Scanning bots, opportunistic</td><td>Brute-force, CVE exploits</td><td>Entra ID gate — bots can't authenticate</td></tr>
              <tr><td>External authenticated</td><td>n/a (no public signup)</td><td>n/a</td><td>n/a — not in threat model</td></tr>
              <tr><td>Compromised tenant member</td><td>Data theft, mischief</td><td>Steal other users' data</td><td>Per-user DB isolation + OID-scoped queries</td></tr>
              <tr><td>Bad code path (developer mistake)</td><td>n/a</td><td>SQLi, XSS, accidental data leak</td><td>Prepared statements, React's auto-escaping</td></tr>
              <tr><td>Dependency CVE</td><td>n/a</td><td>RCE via npm package</td><td>npm audit, GitHub Dependabot</td></tr>
              <tr><td>Lost/leaked API key</td><td>n/a</td><td>Use leaked key</td><td>Key Vault rotation</td></tr>
            </tbody>
          </table>

          <h3>The "private fleet" assumption</h3>
          <p>
            Every fleet app is gated by Entra ID — only invited tenant members can sign in. There's no public signup,
            no anonymous access (except health probes). This assumption is what justifies:
          </p>
          <ul>
            <li><strong>Open CORS</strong>: any origin can hit the API, but they still need a token.</li>
            <li><strong>No rate limiting</strong>: trusted users only; abuse means a known person.</li>
            <li><strong>No helmet</strong>: no clickjacking surface; users navigate from their own browsers.</li>
            <li><strong>No bot protection</strong>: bots can't get past the Entra wall.</li>
          </ul>

          <p>If ANY of these change — you open public signup, you ship a non-authenticated endpoint, you embed in third-party iframes — you have to revisit the threat model and add corresponding defenses.</p>

          <h3>When the fleet's threat model doesn't fit</h3>
          <p>You need a different model if:</p>
          <ul>
            <li><strong>Public signup</strong>: bots will register, scrape, abuse.</li>
            <li><strong>Multi-tenant SaaS</strong>: malicious tenant trying to extract other tenants' data.</li>
            <li><strong>Payment processing</strong>: PCI compliance requirements.</li>
            <li><strong>Health data</strong>: HIPAA compliance requirements.</li>
            <li><strong>Government / regulated</strong>: FedRAMP, etc.</li>
            <li><strong>Public APIs without rate limits</strong>: scraping, abuse.</li>
          </ul>

          <p>Each adds layers. Don't pretend the fleet pattern fits. Each industry has its own playbook.</p>

          <h3>The OWASP top 10 (2025 list)</h3>
          <ol>
            <li><strong>Broken Access Control</strong>: missing auth checks, IDOR.</li>
            <li><strong>Cryptographic Failures</strong>: weak hashing, missing TLS, leaked secrets.</li>
            <li><strong>Injection</strong>: SQLi, XSS, command injection.</li>
            <li><strong>Insecure Design</strong>: missing threat model, lack of rate limits.</li>
            <li><strong>Security Misconfiguration</strong>: default passwords, verbose errors.</li>
            <li><strong>Vulnerable Components</strong>: outdated npm packages with CVEs.</li>
            <li><strong>Authentication Failures</strong>: weak passwords, missing MFA.</li>
            <li><strong>Software & Data Integrity</strong>: unsigned packages, CI/CD compromise.</li>
            <li><strong>Logging & Monitoring Failures</strong>: no audit trail.</li>
            <li><strong>Server-Side Request Forgery (SSRF)</strong>: server makes attacker-controlled requests.</li>
          </ol>

          <p>Fleet status against each:</p>
          <ul>
            <li>1 (Access Control): ✓ requireAuth on every /api/*; per-user DB isolation.</li>
            <li>2 (Crypto): ✓ TLS via App Service; secrets in KV.</li>
            <li>3 (Injection): ✓ prepared statements; React auto-escaping.</li>
            <li>4 (Insecure Design): partial — no threat model documented for some endpoints.</li>
            <li>5 (Misconfig): ✓ generic error responses; verbose errors only in dev.</li>
            <li>6 (Vulnerable Components): ✓ Dependabot; manual npm audit.</li>
            <li>7 (Auth): ✓ Entra ID — MFA enforced at tenant level.</li>
            <li>8 (Integrity): ✓ OIDC federated credentials, no static CI secrets.</li>
            <li>9 (Logging): partial — fleet has logs but not centralized.</li>
            <li>10 (SSRF): mostly N/A — only the Plex integration makes outbound requests, and the URL is pinned.</li>
          </ul>

          <p>Solid baseline. Public-facing additions would tighten 4, 9, and add a few more nuances.</p>
        </section>

        <hr />

        {/* SECTION 3 — TRUST PROXY */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>trust proxy + Real Client IPs</h2>
          <p>Azure App Service is behind a reverse proxy. Without telling Express, every request's <code>req.ip</code> shows the proxy's IP, not the actual client's. Rate limits and audit logs become useless.</p>

          <h3>The line</h3>
          <CodePre>{`// tabloom/server.js (lines 1143-1145)
const app = express()
app.set("trust proxy", 1)
app.use(express.json({ limit: "1mb" }))`}</CodePre>

          <h3>What this does</h3>
          <p>
            <code>app.set('trust proxy', 1)</code> tells Express to trust the FIRST <code>X-Forwarded-For</code>
            header value. Specifically:
          </p>
          <ul>
            <li><code>req.ip</code> now returns the client IP (from the proxy's <code>X-Forwarded-For</code>).</li>
            <li><code>req.protocol</code> returns 'https' if the proxy was https-terminated.</li>
            <li><code>req.secure</code> returns true under https.</li>
          </ul>

          <h3>The value (1, 2, true)</h3>
          <ul>
            <li><code>1</code>: trust the first hop (the immediate upstream proxy). Fleet uses this.</li>
            <li><code>2</code>: trust two hops (e.g., CDN → App Service → your app).</li>
            <li><code>true</code>: trust ALL hops — DANGEROUS. Anyone can set <code>X-Forwarded-For</code> manually if they reach your app directly.</li>
            <li><code>false</code>: don't trust anything. <code>req.ip</code> is always the immediate connection.</li>
          </ul>

          <h3>What goes wrong without it</h3>
          <p>Imagine you add rate limiting:</p>
          <CodePre>{`import rateLimit from 'express-rate-limit'
const limiter = rateLimit({ windowMs: 60_000, max: 100 })
app.use(limiter)`}</CodePre>

          <p>
            Without <code>trust proxy</code>: every request looks like it came from the SAME IP (the App Service edge
            IP). 100 requests/min total. The first 100 users hitting your app exhaust the limit; users 101+ get
            rate-limited.
          </p>
          <p>With <code>trust proxy: 1</code>: each user has their own IP. Each user gets their own 100 requests/min budget.</p>

          <h3>X-Forwarded-For spoofing</h3>
          <p>
            If you set <code>trust proxy: true</code> (trust all), an attacker can spoof their IP by setting
            <code>X-Forwarded-For: 1.2.3.4</code> in their request. Rate limit checks against 1.2.3.4 → unlimited. Use
            <code>1</code> (or the specific number of trusted proxies in your topology).
          </p>

          <h3>The CDN case (CloudFlare in front)</h3>
          <p>If you're CloudFlare → App Service → app, you have TWO upstream proxies:</p>
          <CodePre>{`app.set('trust proxy', 2)`}</CodePre>

          <p>Trust the first two hops. The third is the actual client.</p>

          <p>Alternative: trust by IP. <code>app.set('trust proxy', ['10.0.0.0/8', '173.245.48.0/20'])</code> — trust only specific IP ranges.</p>

          <h3>Verifying it works</h3>
          <CodePre>{`app.get('/api/whoami', requireAuth, (req, res) => {
  res.json({
    ip: req.ip,
    forwarded: req.headers['x-forwarded-for'],
    protocol: req.protocol,
    secure: req.secure,
  })
})

// curl https://app.azurewebsites.net/api/whoami
// → {
//     "ip": "203.0.113.45",        ← your actual client IP
//     "forwarded": "203.0.113.45",
//     "protocol": "https",
//     "secure": true
//   }`}</CodePre>

          <p>If <code>ip</code> shows an Azure-internal address (10.x.x.x), <code>trust proxy</code> isn't set or set wrong.</p>

          <h3>The other trust-proxy effects</h3>
          <ul>
            <li><strong><code>req.hostname</code></strong>: uses <code>X-Forwarded-Host</code> if trust proxy enabled.</li>
            <li><strong><code>req.protocol</code></strong>: uses <code>X-Forwarded-Proto</code>.</li>
            <li><strong>Cookie <code>Secure</code> flag</strong>: works correctly under https without manually checking proxy headers.</li>
          </ul>

          <p>All necessary for production behind a reverse proxy. The fleet's <code>trust proxy: 1</code> is the right setting.</p>
        </section>

        <hr />

        {/* SECTION 4 — CORS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>CORS Configuration</h2>
          <p>Cross-Origin Resource Sharing. The browser policy that says "JavaScript on origin A can't read responses from origin B by default." Servers opt in via headers. The fleet's stance: <strong>open</strong>.</p>

          <h3>The fleet pattern</h3>
          <CodePre>{`// shopkeep/server.js (lines 345-347)
const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))`}</CodePre>

          <p><code>cors()</code> with no options means <code>Access-Control-Allow-Origin: *</code>. Any origin can make requests.</p>

          <h3>Why open CORS is fine for the fleet</h3>
          <ul>
            <li>API is auth-gated. Browser CORS prevents reading responses for OTHER auth contexts (cookies, session), but the fleet uses Bearer tokens — irrelevant to CORS.</li>
            <li>No cookies = no CSRF risk. CSRF is the main reason for strict CORS. With token auth, the attack vector doesn't exist.</li>
            <li>Same-origin in production: frontend + backend on same domain (e.g., <code>shopkeep.azurewebsites.net</code>). CORS literally doesn't apply.</li>
          </ul>

          <h3>When open CORS is NOT fine</h3>
          <ul>
            <li><strong>Cookie auth</strong>: <code>Set-Cookie</code> + browser cookies. CSRF via cross-origin form POST. CORS narrowing helps.</li>
            <li><strong>API tokens in localStorage</strong>: malicious page on another origin can pull them. Strict CORS plus token-binding helps.</li>
            <li><strong>Public APIs you want to control which apps consume</strong>.</li>
          </ul>

          <h3>The strict pattern</h3>
          <CodePre>{`const allowed = new Set([
  'https://myapp.azurewebsites.net',
  'https://www.myapp.com',
  process.env.NODE_ENV === 'development' && 'http://localhost:5173',
].filter(Boolean))

app.use(cors({
  origin: (origin, cb) => {
    // null = native fetch from same origin (no Origin header). Allow.
    if (!origin) return cb(null, true)
    if (allowed.has(origin)) return cb(null, true)
    return cb(new Error(\`Origin \${origin} not allowed by CORS\`))
  },
  credentials: true,                  // ← required if cookies / Authorization
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,                       // cache preflight 24h
}))`}</CodePre>

          <h3>What the headers do</h3>
          <table>
            <tbody>
              <tr><th>Header</th><th>Purpose</th></tr>
              <tr><td>Access-Control-Allow-Origin</td><td>Which origin can read responses</td></tr>
              <tr><td>Access-Control-Allow-Methods</td><td>Which HTTP methods are allowed</td></tr>
              <tr><td>Access-Control-Allow-Headers</td><td>Which request headers are allowed</td></tr>
              <tr><td>Access-Control-Allow-Credentials</td><td>Whether browser may send cookies / Auth headers</td></tr>
              <tr><td>Access-Control-Max-Age</td><td>Preflight cache duration in seconds</td></tr>
              <tr><td>Vary: Origin</td><td>Tells caches the response varies by origin</td></tr>
            </tbody>
          </table>

          <h3>Preflight</h3>
          <p>
            For non-simple requests (POST with JSON, custom headers, etc.), the browser sends an <code>OPTIONS</code>
            preflight to ask "is this allowed?" before the real request. The cors middleware handles it automatically.
          </p>

          <p><code>maxAge: 86400</code> tells browsers to cache the preflight answer for 24 hours. Reduces preflight chatter.</p>

          <h3>Credentials caveat</h3>
          <p>
            <code>Access-Control-Allow-Credentials: true</code> requires <code>Access-Control-Allow-Origin</code> to
            be a SPECIFIC ORIGIN, not <code>*</code>. The fleet's <code>cors()</code> with no options ignores
            credentials by default. If you need credentials (cookies, Authorization header) with cross-origin,
            you must specify origins.
          </p>

          <h3>OPTIONS catch-all for ad-hoc</h3>
          <CodePre>{`app.options('/api/*', cors(corsOptions))   // explicit preflight handler
app.use('/api/*', cors(corsOptions))         // applied to actual requests`}</CodePre>

          <p>Usually one <code>app.use(cors(...))</code> is enough. The two-step pattern is for when you want different CORS for preflight vs actual.</p>

          <h3>The browser's "opaque response"</h3>
          <p>
            If your server returns CORS-rejected response, the browser's <code>fetch</code> sees an "opaque" response
            with empty body and zero headers. You'll see "Failed to fetch" in the console. Server-side, the request
            DID happen (your endpoint was called) — the rejection is browser-side only. This is important: CORS doesn't
            stop the request; it stops the JS from reading the response.
          </p>
        </section>

        <hr />

        {/* SECTION 5 — SIZE LIMITS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Request Size Limits</h2>
          <p>Without a limit, Express accepts unbounded request bodies, which means a small attacker can fill RAM with one 4GB POST. Three fleet apps; three different limits.</p>

          <h3>The fleet's settings</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Limit</th><th>Why</th></tr>
              <tr><td>Tabloom</td><td>1 MB</td><td>JSON-only API; pages are small text</td></tr>
              <tr><td>SecretApp (Hearth)</td><td>50 MB</td><td>Base64 images in some routes</td></tr>
              <tr><td>ShopKeep</td><td>50 MB</td><td>Base64 tool photos</td></tr>
              <tr><td>PulseWire</td><td>(Next.js default ~4MB)</td><td>API routes, no large bodies</td></tr>
            </tbody>
          </table>

          <h3>The Express config</h3>
          <CodePre>{`// tabloom/server.js (line 1145)
app.use(express.json({ limit: '1mb' }))

// secretapp/server.js (line 51)
app.use(express.json({ limit: '50mb' }))

// shopkeep/server.js (line 347)
app.use(express.json({ limit: '50mb' }))`}</CodePre>

          <p>The string format <code>'1mb'</code>, <code>'50mb'</code>, <code>'500kb'</code> is parsed by the <code>bytes</code> npm package. Case-insensitive.</p>

          <h3>What happens at the limit</h3>
          <p>Express body-parser receives bytes from the stream. When the cumulative size reaches the limit:</p>
          <ol>
            <li>Reading stops.</li>
            <li>An <code>ENTITY_TOO_LARGE</code> error is passed to the next middleware.</li>
            <li>Default Express response: 413 Payload Too Large.</li>
          </ol>

          <p>Custom handler:</p>
          <CodePre>{`app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload too large',
      limit: err.limit,
      received: err.length,
    })
  }
  next(err)
})`}</CodePre>

          <h3>Per-route limits</h3>
          <p>For routes that accept large uploads, override the global limit:</p>
          <CodePre>{`// Global low limit
app.use(express.json({ limit: '1mb' }))

// Override for one specific route
app.post('/api/large-upload',
  express.json({ limit: '50mb' }),    // ← only for THIS route
  handleLargeUpload,
)`}</CodePre>

          <p>Tighter global; relaxed per-route. Better than blanket-large because misuse on other routes is bounded.</p>

          <h3>Multer vs express.json</h3>
          <p>For multipart uploads (multer):</p>
          <ul>
            <li>Multer parses multipart and writes to disk. <code>express.json({"{ limit }"})</code> doesn't apply.</li>
            <li>Multer has its own <code>limits.fileSize</code>.</li>
            <li>For non-multipart routes, <code>express.json({"{ limit }"})</code> applies.</li>
          </ul>

          <p>Set both: multer's <code>fileSize</code> for multipart, express.json's <code>limit</code> for JSON.</p>

          <h3>The intermediary gotcha</h3>
          <p>
            App Service Linux's reverse proxy has its own request size limit (~100 MB by default). Even if your
            Express config allows 200MB, the proxy will reject before reaching your app. CloudFlare's free tier
            limits at 100MB. Adjust expectations based on the FULL stack, not just Express.
          </p>

          <h3>The streaming alternative</h3>
          <p>For very large uploads (video, archives), don't buffer the whole body in memory. Stream:</p>
          <CodePre>{`app.post('/api/large', (req, res) => {
  const out = createWriteStream('/data/upload.bin')
  req.pipe(out)
  out.on('finish', () => res.json({ ok: true }))
})`}</CodePre>

          <p>Skip body-parser middleware for this route entirely. Pipe the raw stream to disk or to blob storage.</p>

          <h3>Other express limits to know</h3>
          <ul>
            <li><code>express.urlencoded({"{ limit }"})</code>: for form-encoded bodies.</li>
            <li><code>express.text({"{ limit }"})</code>: for text/plain bodies.</li>
            <li><code>express.raw({"{ limit }"})</code>: for application/octet-stream.</li>
          </ul>

          <p>The fleet uses mostly JSON; the other forms apply to specific use cases.</p>
        </section>

        <hr />

        {/* SECTION 6 — REQUIREAUTH */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>requireAuth Discipline</h2>
          <p>The fleet's auth pattern is uniform. JWT bearer tokens, validated against Microsoft's JWKS, parsed for OID/tenant/audience. Covered in depth in the JWT Validation guide; here we focus on the security DISCIPLINE around it.</p>

          <h3>Tabloom's requireAuth</h3>
          <CodePre>{`// tabloom/server.js (lines 988-1022, verbatim)
const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${AAD_TENANT_ID}/discovery/v2.0/keys\`),
)
const ISSUER = \`https://login.microsoftonline.com/\${AAD_TENANT_ID}/v2.0\`

async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ""
  const m = /^Bearer (.+)$/i.exec(header)
  if (!m) return res.status(401).json({ error: "unauthorized" })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer:   ISSUER,
      audience: AAD_CLIENT_ID,
      clockTolerance: "60s",
    })
    if (payload.tid !== AAD_TENANT_ID) return res.status(401).json({ error: "unauthorized" })
    if (!payload.oid)                  return res.status(401).json({ error: "unauthorized" })
    const email = (payload.preferred_username ?? payload.email ?? "").toLowerCase() || null
    req.user = {
      oid:   payload.oid,
      name:  payload.name ?? null,
      email,
      isOwner: payload.oid === PRIMARY_USER_OID,
    }
    try {
      stmts.upsertUser.run({ oid: payload.oid, name: req.user.name, email })
    } catch (e) {
      console.warn("[auth] upsertUser failed:", e?.message ?? e)
    }
    next()
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth] token rejected:", err?.code ?? err?.message ?? err)
    }
    res.status(401).json({ error: "unauthorized" })
  }
}`}</CodePre>

          <h3>The four checks</h3>
          <ol>
            <li><strong>Signature</strong> via JWKS — confirms Microsoft signed the token.</li>
            <li><strong>Issuer</strong> matches Microsoft's URL for THIS tenant.</li>
            <li><strong>Audience</strong> matches THIS app's client ID.</li>
            <li><strong>Tenant claim (tid)</strong> matches the expected tenant.</li>
            <li><strong>OID present</strong> — user has an Object ID.</li>
          </ol>

          <p>Five checks, actually. All five must pass.</p>

          <h3>Why each check matters</h3>
          <ul>
            <li><strong>Signature</strong>: stops anyone from minting fake tokens.</li>
            <li><strong>Issuer</strong>: stops tokens from other identity providers / other tenants pretending to be Microsoft.</li>
            <li><strong>Audience</strong>: stops tokens issued for OTHER apps from being replayed at yours.</li>
            <li><strong>Tenant</strong>: extra layer beyond issuer — if Microsoft is multi-tenant in a sneaky way, this catches it.</li>
            <li><strong>OID</strong>: every authenticated user has one; absence = malformed token.</li>
          </ul>

          <h3>The wiring</h3>
          <CodePre>{`// Apply to /api/* but exclude health endpoints
app.use("/api", (req, res, next) => {
  if (req.path === "/health" || req.path === "/health/deep" || req.path === "/version") {
    return next()
  }
  return requireAuth(req, res, next)
})`}</CodePre>

          <p>
            The pattern: blanket auth on <code>/api/*</code> with an explicit allowlist for health and version endpoints.
            The deploy verification workflow polls these without a token; everything else demands auth.
          </p>

          <h3>The discipline rule: explicit allowlist, not denylist</h3>
          <p>Wrong pattern (denylist):</p>
          <CodePre>{`// BAD — easy to miss adding auth to new routes
app.get('/api/some-public', publicHandler)
app.use('/api', requireAuth)             // ← only routes registered AFTER are protected`}</CodePre>

          <p>Right pattern (allowlist):</p>
          <CodePre>{`// GOOD — explicit allowlist of public endpoints
app.use('/api', (req, res, next) => {
  const PUBLIC = ['/health', '/version', '/test']
  if (PUBLIC.includes(req.path)) return next()
  return requireAuth(req, res, next)
})

// Now /api/some-public also requires auth unless added to PUBLIC.`}</CodePre>

          <p>Default-deny is the security-correct stance. Default-allow leaves room for "I forgot to add auth to that route."</p>

          <h3>The dev-time logging</h3>
          <CodePre>{`if (process.env.NODE_ENV !== "production") {
  console.warn("[auth] token rejected:", err?.code ?? err?.message ?? err)
}
res.status(401).json({ error: "unauthorized" })`}</CodePre>

          <p>In dev, log WHY the token was rejected (expired, bad signature, wrong audience). In prod, log nothing detailed — just return 401. Reasoning: prod log noise + leaked info to attackers.</p>

          <p>The client gets a generic <code>{`{ error: "unauthorized" }`}</code> regardless. Specifics belong in your dev console, not the user-facing response.</p>

          <h3>req.user attachment</h3>
          <CodePre>{`req.user = {
  oid: payload.oid,
  name: payload.name ?? null,
  email,
  isOwner: payload.oid === PRIMARY_USER_OID,
}`}</CodePre>

          <p>After requireAuth, every subsequent middleware has access to <code>req.user</code>. Downstream code checks <code>req.user.oid</code> to scope queries, <code>req.user.isOwner</code> for admin-only paths.</p>

          <h3>Per-tenant database isolation</h3>
          <p>
            Tabloom uses <code>getDb(req.user.oid)</code> to open the per-user SQLite database. Cross-user queries
            are impossible because each user's database is a separate file. SQLi against user A can't reach user B's
            data even if the SQL escapes — they're in different files.
          </p>

          <p>Covered in detail in the Per-User SQLite guide.</p>

          <h3>The audit-as-side-effect</h3>
          <CodePre>{`try {
  stmts.upsertUser.run({ oid: payload.oid, name: req.user.name, email })
} catch (e) {
  console.warn("[auth] upsertUser failed:", e?.message ?? e)
}`}</CodePre>

          <p>Every successful auth = a row in the users table or a <code>last_seen</code> update. First sign-in writes; subsequent updates the timestamp. Cheap audit trail. If the DB write fails, the auth still succeeds — don't block the user on a logging failure.</p>
        </section>

        <hr />

        {/* SECTION 7 — RATE LIMITING */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Rate Limiting + IP Allowlists</h2>
          <p>None of the fleet apps ship rate limiting. For Entra-gated apps, the threat model doesn't require it. If you go public-facing, here's the recipe.</p>

          <h3>The package: express-rate-limit</h3>
          <CodePre>{`npm install express-rate-limit`}</CodePre>

          <h3>The basic recipe</h3>
          <CodePre>{`import rateLimit from 'express-rate-limit'

// 100 requests per IP per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,            // adds RateLimit-* headers
  legacyHeaders: false,             // drop X-RateLimit-* (old names)
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: res.getHeader('Retry-After'),
    })
  },
})

app.use(limiter)`}</CodePre>

          <h3>Per-route limits</h3>
          <p>One-size-fits-all is wrong for most apps. Different routes have different abuse profiles:</p>
          <CodePre>{`// Default: 100/min per IP
app.use(rateLimit({ windowMs: 60_000, max: 100 }))

// Stricter for auth-like endpoints
const authLimit = rateLimit({ windowMs: 60_000, max: 5 })
app.post('/api/login', authLimit, loginHandler)

// Looser for browse / read endpoints
const readLimit = rateLimit({ windowMs: 60_000, max: 500 })
app.use('/api/feed', readLimit, feedRoutes)

// Strict for expensive endpoints (AI calls)
const aiLimit = rateLimit({ windowMs: 60_000, max: 10 })
app.use('/api/ai/', aiLimit, aiRoutes)`}</CodePre>

          <h3>Per-user keys (not per-IP)</h3>
          <p>For authenticated APIs, rate-limit by USER not IP — that way a single user can't burn through someone else's quota by sharing an office:</p>

          <CodePre>{`const aiLimit = rateLimit({
  windowMs: 60_000,
  max: 10,
  keyGenerator: (req) => {
    // Must run AFTER requireAuth so req.user exists
    return req.user?.oid ?? req.ip
  },
})

app.use('/api/ai/', requireAuth, aiLimit)`}</CodePre>

          <p>Important: put rate-limit AFTER auth. Otherwise <code>req.user</code> isn't populated.</p>

          <h3>Distributed rate limiting</h3>
          <p>express-rate-limit's default in-memory store doesn't work across multiple instances. If you scale to 2+ App Service instances:</p>
          <CodePre>{`import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'redis'

const redis = createClient({ url: process.env.REDIS_URL })
await redis.connect()

const limiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  store: new RedisStore({
    sendCommand: (...args) => redis.sendCommand(args),
  }),
})`}</CodePre>

          <p>For Azure: Azure Cache for Redis. ~$15/mo for the cheapest tier. Required for multi-instance accuracy.</p>

          <h3>The Retry-After response</h3>
          <p>When a client is rate-limited, return a <code>Retry-After</code> header telling them when to retry:</p>
          <CodePre>{`// express-rate-limit sets this automatically:
// RateLimit-Limit: 100
// RateLimit-Remaining: 0
// RateLimit-Reset: 1716000000
// Retry-After: 30`}</CodePre>

          <p>Polite clients honor it. Aggressive bots don't, but at least you've reduced server load.</p>

          <h3>IP allowlist (admin-only routes)</h3>
          <CodePre>{`const ADMIN_IPS = new Set([
  '203.0.113.45',
  '203.0.113.46',
])

function ipAllowlist(req, res, next) {
  if (ADMIN_IPS.has(req.ip)) return next()
  return res.status(403).json({ error: 'forbidden' })
}

app.use('/api/admin', requireAuth, ipAllowlist, adminRoutes)`}</CodePre>

          <p>
            Defense in depth: require both auth AND a specific IP for admin actions. Useful when you have a known
            office or VPN egress IP. Combine with <code>trust proxy</code> being correctly set (or you're checking the
            proxy's IP, not the client's).
          </p>

          <h3>IP blocklist (abuse)</h3>
          <CodePre>{`const BLOCKED = new Set([
  '198.51.100.42',    // known abusive IP
])

app.use((req, res, next) => {
  if (BLOCKED.has(req.ip)) return res.status(403).end()
  next()
})`}</CodePre>

          <p>Manual blocklist for problematic IPs. For automated, look at services like CloudFlare's bot protection or Azure's WAF.</p>

          <h3>The Azure Front Door / WAF option</h3>
          <p>For non-code rate limiting, put Azure Front Door + WAF in front of App Service. WAF rules can rate-limit by IP, geo, URL, headers. Costs ~$20/month minimum. Worth it for public-facing services.</p>

          <p>The fleet doesn't use this because Entra ID already filters to known users.</p>
        </section>

        <hr />

        {/* SECTION 8 — VALIDATION */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Input Validation Patterns</h2>
          <p>None of the fleet apps use a validation library. Validation is manual. Functional, but not bulletproof. Here's the spectrum.</p>

          <h3>The fleet's manual pattern</h3>
          <CodePre>{`// secretapp/routes/ai.js (lines 11-17)
router.post('/api/azure-openai/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' })
    }
    // ... rest of handler ...
  } catch (e) { /* ... */ }
})`}</CodePre>

          <p>Type check + null check. Simple, works for simple shapes.</p>

          <h3>What manual validation catches</h3>
          <ul>
            <li>Required-field absence.</li>
            <li>Wrong top-level type (array vs object).</li>
            <li>Type coercion mishaps (string vs number).</li>
          </ul>

          <h3>What it doesn't catch</h3>
          <ul>
            <li>Nested field validation (every message has role + content).</li>
            <li>Enum constraints (role must be 'user' or 'assistant').</li>
            <li>String length / format / regex.</li>
            <li>Number bounds.</li>
            <li>Discriminated unions.</li>
          </ul>

          <p>For these, you need a schema library.</p>

          <h3>Zod (recommended)</h3>
          <CodePre>{`import { z } from 'zod'

const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(100_000),
})

const ChatRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().max(4000).optional(),
})

router.post('/api/azure-openai/chat', async (req, res) => {
  const parsed = ChatRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: parsed.error.issues,
    })
  }
  const { messages, temperature, max_tokens } = parsed.data
  // ... rest of handler ...
})`}</CodePre>

          <p>Zod gives you:</p>
          <ul>
            <li>One schema = type definition + runtime validator.</li>
            <li>Composable schemas.</li>
            <li>Detailed error messages with paths into the input.</li>
            <li>TypeScript inference: <code>type ChatRequest = z.infer&lt;typeof ChatRequestSchema&gt;</code>.</li>
            <li>Async validation, refinements, transformations.</li>
          </ul>

          <h3>Adding zod to a fleet app</h3>
          <ol>
            <li><code>npm install zod</code></li>
            <li>Create <code>routes/schemas.ts</code> with all your schemas.</li>
            <li>For each route, parse <code>req.body</code> with the schema.</li>
            <li>Replace manual checks with <code>safeParse</code>.</li>
          </ol>

          <p>Tabloom and PulseWire would benefit most — both have many JSON-bodied routes. SecretApp's surface is small, so manual is reasonable.</p>

          <h3>SQL injection — already solved</h3>
          <CodePre>{`// secretapp/routes/inventory.js (lines 24-38)
router.get('/api/inventory/items', (req, res) => {
  try {
    const { category_id, location_id, sub_location_id } = req.query
    const conditions = []
    const params = []

    if (category_id) { conditions.push('i.category_id = ?'); params.push(category_id) }
    if (location_id) { conditions.push('i.location_id = ?'); params.push(location_id) }
    // ... uses params with prepared statement ...
})`}</CodePre>

          <p><code>?</code> placeholders + <code>params</code> array = prepared statements. better-sqlite3 escapes everything automatically. SQLi-proof regardless of input content.</p>

          <h3>XSS — React's default protection</h3>
          <p>React auto-escapes any string interpolated in JSX:</p>
          <CodePre>{`<div>{user.name}</div>
// Rendered: <div>Bob &lt;script&gt;...&lt;/script&gt;</div>
// Safe — the script tag is text, not HTML.

<div dangerouslySetInnerHTML={{ __html: user.bio }} />
// DANGEROUS — explicit opt-out.`}</CodePre>

          <p>The fleet uses no <code>dangerouslySetInnerHTML</code> except for MermaidDiagram's controlled SVG. Safe.</p>

          <h3>Command injection</h3>
          <p>If you ever shell out (rare in the fleet):</p>
          <CodePre>{`// DANGEROUS
import { exec } from 'node:child_process'
exec(\`convert \${userFilename} thumbnail.jpg\`)   // ← user controls filename

// SAFE
import { execFile } from 'node:child_process'
execFile('convert', [userFilename, 'thumbnail.jpg'])   // ← args are arrays, no shell interp`}</CodePre>

          <p><code>execFile</code> with array args = no shell. Even if filename has shell metacharacters, they're not interpreted.</p>

          <h3>SSRF (Server-Side Request Forgery)</h3>
          <p>If your server makes outbound HTTP requests using URL from user input, validate the URL doesn't point to internal services:</p>

          <CodePre>{`function isInternalUrl(url) {
  const u = new URL(url)
  const host = u.hostname.toLowerCase()
  if (host === 'localhost' || host === '127.0.0.1') return true
  if (host.endsWith('.internal') || host.endsWith('.local')) return true
  if (host === '169.254.169.254') return true   // ← Azure IMDS!
  // ... more checks for RFC 1918 IPs etc. ...
  return false
}

// Block before making the request
if (isInternalUrl(userProvidedUrl)) {
  return res.status(400).json({ error: 'Internal URLs not allowed' })
}`}</CodePre>

          <p><strong>169.254.169.254</strong> is critical to block — it's Azure's Instance Metadata Service. An SSRF that reaches it can steal managed identity tokens.</p>

          <p>The fleet's only outbound calls go to known fixed URLs (Plex, Voyage, Azure OpenAI). No user-controlled URLs.</p>
        </section>

        <hr />

        {/* SECTION 9 — HEADERS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>HTTP Security Headers</h2>
          <p>The fleet ships none. helmet is the standard answer for adding them. Here's what helmet does and what to set if you don't use helmet.</p>

          <h3>What helmet sets by default</h3>
          <CodePre>{`import helmet from 'helmet'
app.use(helmet())`}</CodePre>

          <p>That one line adds:</p>
          <table>
            <tbody>
              <tr><th>Header</th><th>Default Value</th><th>Purpose</th></tr>
              <tr><td>Content-Security-Policy</td><td>default-src 'self'</td><td>Block XSS from injected scripts</td></tr>
              <tr><td>Cross-Origin-Embedder-Policy</td><td>require-corp</td><td>Allow SharedArrayBuffer</td></tr>
              <tr><td>Cross-Origin-Opener-Policy</td><td>same-origin</td><td>Mitigate Spectre attacks</td></tr>
              <tr><td>Cross-Origin-Resource-Policy</td><td>same-origin</td><td>Limit cross-origin embedding</td></tr>
              <tr><td>Origin-Agent-Cluster</td><td>?1</td><td>Isolate browsing contexts</td></tr>
              <tr><td>Referrer-Policy</td><td>no-referrer</td><td>Don't leak URLs to outbound links</td></tr>
              <tr><td>Strict-Transport-Security</td><td>max-age=31536000; includeSubDomains</td><td>Force HTTPS</td></tr>
              <tr><td>X-Content-Type-Options</td><td>nosniff</td><td>Don't infer MIME from content</td></tr>
              <tr><td>X-DNS-Prefetch-Control</td><td>off</td><td>Don't pre-fetch DNS</td></tr>
              <tr><td>X-Download-Options</td><td>noopen</td><td>IE-specific, deprecated</td></tr>
              <tr><td>X-Frame-Options</td><td>SAMEORIGIN</td><td>Block clickjacking</td></tr>
              <tr><td>X-Permitted-Cross-Domain-Policies</td><td>none</td><td>Adobe Flash, deprecated</td></tr>
              <tr><td>X-XSS-Protection</td><td>0</td><td>Disable old IE XSS auditor</td></tr>
            </tbody>
          </table>

          <h3>Why the fleet doesn't use helmet</h3>
          <ul>
            <li>Apps are behind Entra ID — no anonymous XSS vector to defend.</li>
            <li>No third-party embedding via iframes.</li>
            <li>No mixed-content (Vite serves all assets over the same origin).</li>
            <li>The defaults sometimes break Vite dev or App Service health probes (CSP can be tricky).</li>
          </ul>

          <p>Pragmatic but not airtight. Adding helmet is a 1-line change with mostly-safe defaults.</p>

          <h3>Adding helmet to a fleet app</h3>
          <CodePre>{`import helmet from 'helmet'

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],                            // no inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"],         // MUI uses inline styles
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://login.microsoftonline.com'],
      fontSrc: ["'self'", 'data:'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}))`}</CodePre>

          <p>Tune CSP based on your specific assets. Start broad, tighten over time.</p>

          <h3>CSP in production</h3>
          <p>The challenge: CSP breaks things you forgot about. <code>script-src 'self'</code> blocks Google Analytics, third-party widgets, inline scripts in your HTML. Vite's hot-reload in dev needs different CSP than production. Each external service needs an exception.</p>

          <p>The "report-only" mode is your friend:</p>
          <CodePre>{`app.use(helmet({
  contentSecurityPolicy: {
    directives: { /* ... */ },
    reportOnly: true,                  // ← only WARN, don't block
  },
}))`}</CodePre>

          <p>Run report-only for a week. Look at console violations. Add exceptions. Then flip to enforcing.</p>

          <h3>HSTS</h3>
          <p>
            <code>Strict-Transport-Security: max-age=31536000</code> tells browsers "always use HTTPS for this domain
            for 1 year." Once a browser caches this, even <code>http://yoursite.com</code> auto-redirects to HTTPS.
            Critical for production.
          </p>

          <p>App Service Linux serves HTTPS by default. Adding the HSTS header makes the browser refuse downgrades. The <code>preload</code> directive lets you submit to <code>hstspreload.org</code> so browsers ship with your domain pre-cached.</p>

          <h3>X-Frame-Options</h3>
          <p>
            <code>X-Frame-Options: SAMEORIGIN</code> stops your site from being embedded in iframes on other origins.
            Defends against clickjacking. Default deny is right for most apps.
          </p>

          <p>Exception: if you legitimately embed your app elsewhere (Microsoft Teams app, embedded widget), you need <code>frame-ancestors</code> CSP directive instead.</p>

          <h3>Without helmet — minimum viable headers</h3>
          <CodePre>{`app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.setHeader('Referrer-Policy', 'no-referrer')
  next()
})`}</CodePre>

          <p>Four lines, four headers. Maybe 80% of helmet's value with much less risk of breaking things.</p>

          <h3>What App Service / Azure Front Door already adds</h3>
          <p>Some headers get added by the infrastructure regardless of your code:</p>
          <ul>
            <li>Strict-Transport-Security: when App Service is HTTPS-only.</li>
            <li>X-Content-Type-Options on certain content (depends).</li>
            <li>Server: cloaked (App Service hides Express signature).</li>
          </ul>

          <p>Defense in depth means setting them in your app code too — don't rely on infra alone.</p>
        </section>

        <hr />

        {/* SECTION 10 — AUDIT */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Audit Logs + Secret Scrubbing</h2>
          <p>The fleet logs requests but doesn't centralize. Some apps log every mutation; others don't. None scrub secrets from log output. This section covers gaps and recipes.</p>

          <h3>Tabloom's request log</h3>
          <CodePre>{`// tabloom/server.js (lines 1149-1161, verbatim)
// Structured request log to stdout. One line per request: time, method, path,
// status, ms, oid. Format is parseable by Azure Log Stream's tail UI.
app.use((req, res, next) => {
  if (!req.path.startsWith("/api/")) return next()
  const start = process.hrtime.bigint()
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1_000_000
    const oid = req.user?.oid ?? "-"
    const line = \`[api] \${req.method} \${req.path} \${res.statusCode} \${ms.toFixed(1)}ms oid=\${oid}\`
    if (res.statusCode >= 500) console.error(line)
    else if (res.statusCode >= 400) console.error(line)
    else console.log(line)
  })
  next()
})`}</CodePre>

          <h3>What's logged</h3>
          <ul>
            <li>HTTP method (GET, POST, etc.)</li>
            <li>Path (the request URL)</li>
            <li>Status code</li>
            <li>Response time in ms</li>
            <li>OID (user identifier, or "-" for unauthenticated)</li>
            <li>Severity routing (5xx → error stream, 4xx → error, 2xx → info)</li>
          </ul>

          <h3>What's NOT logged</h3>
          <ul>
            <li>Request body</li>
            <li>Response body</li>
            <li>Headers (including Authorization — good!)</li>
            <li>Query string parameters</li>
          </ul>

          <p>The exclusions are deliberate: bodies can contain PII or secrets; headers can contain tokens.</p>

          <h3>ShopKeep's mutation log</h3>
          <CodePre>{`// shopkeep/server.js (lines 288-298)
function logActivity(db, action, toolId, toolName, details) {
  try {
    db.prepare(
      'INSERT INTO activity_log (action, tool_id, tool_name, details) VALUES (?, ?, ?, ?)'
    ).run(action, toolId ?? null, toolName ?? null, details ? JSON.stringify(details) : null)
  } catch (err) {
    console.error('logActivity error:', err)
  }
}`}</CodePre>

          <p>Persisted in DB. Used for every mutation: create, edit, delete, checkout, sold. Different purpose from request log — answers "who did what to which thing" not "what HTTP requests came in."</p>

          <h3>What to log for audit</h3>
          <table>
            <tbody>
              <tr><th>Event</th><th>Log it</th></tr>
              <tr><td>Auth success</td><td>Yes — actor + timestamp</td></tr>
              <tr><td>Auth failure</td><td>Yes — IP + timestamp + reason (in dev)</td></tr>
              <tr><td>Authorization denial</td><td>Yes — what was attempted</td></tr>
              <tr><td>Resource create/update/delete</td><td>Yes — who, what, when</td></tr>
              <tr><td>Privilege escalation</td><td>Yes — role change events</td></tr>
              <tr><td>Sensitive data access (PII, financial)</td><td>Yes — who accessed what</td></tr>
              <tr><td>External API call (especially AI)</td><td>Yes — already covered in AI cost guide</td></tr>
              <tr><td>Configuration change</td><td>Yes</td></tr>
              <tr><td>Bulk data export</td><td>Yes</td></tr>
              <tr><td>Failed input validation</td><td>Optional — could be noisy</td></tr>
            </tbody>
          </table>

          <h3>Where to log</h3>
          <ul>
            <li><strong>stdout</strong>: simple, App Service Log Stream tails it. Not durable.</li>
            <li><strong>SQLite/Postgres table</strong>: durable, queryable. Best for audit logs.</li>
            <li><strong>Azure Application Insights</strong>: queryable + alertable. Best for telemetry + diagnostics.</li>
            <li><strong>Azure Log Analytics</strong>: long-term retention + KQL queries. Best for compliance.</li>
          </ul>

          <p>Each tier has costs. Combine for best results: stdout for dev iteration, DB for app-specific audit, Application Insights for diagnostics and alerting.</p>

          <h3>Secret scrubbing in logs</h3>
          <p>When you log objects, secrets can leak. Example:</p>
          <CodePre>{`// BAD
console.log('Received request:', req.body)
// → If req.body has { apiKey: 'sk-...' }, the key is now in your logs forever.`}</CodePre>

          <p>Fix: explicit allowlist of fields to log.</p>
          <CodePre>{`function safeBody(body) {
  const SAFE = ['id', 'name', 'status', 'type', 'createdAt']
  return Object.fromEntries(
    Object.entries(body).filter(([k]) => SAFE.includes(k))
  )
}
console.log('Received request:', safeBody(req.body))`}</CodePre>

          <p>Or use Pino with built-in redaction:</p>
          <CodePre>{`import pino from 'pino'

const logger = pino({
  redact: {
    paths: ['req.headers.authorization', '*.password', '*.apiKey', '*.token'],
    censor: '[REDACTED]',
  },
})`}</CodePre>

          <p>Pino auto-redacts the paths you specify. Use it for any structured logging in production.</p>

          <h3>The error-message leak</h3>
          <CodePre>{`// BAD
try { /* ... */ }
catch (e) {
  res.status(500).json({ error: e.message })   // ← may include secrets!
}

// SAFE
try { /* ... */ }
catch (e) {
  console.error(e)                              // log full error
  res.status(500).json({ error: 'Internal error' })  // generic to client
}`}</CodePre>

          <p>Stack traces and error messages can leak file paths, package versions, internal IDs. Log them server-side; never echo to the client.</p>

          <h3>The Log Stream output</h3>
          <p>App Service's "Log Stream" feature shows recent stdout/stderr. Useful for debugging. Tabloom's structured log format is parseable here. For long-term storage, ship to Application Insights:</p>

          <CodePre>{`// applicationinsights setup (sketch)
import * as appInsights from 'applicationinsights'
appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
  .setSendLiveMetrics(true)
  .start()

// Then console.log automatically goes to App Insights too.`}</CodePre>

          <p>The fleet doesn't currently wire App Insights. For low-volume apps, Log Stream is enough.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Harden a Sample Express App</h2>
          <p>Take a default Express setup, add each of the nine layers. ~30 minutes.</p>

          <h3>Setup</h3>
          <CodePre>{`mkdir hardened-app && cd hardened-app
npm init -y
npm install express cors helmet express-rate-limit jose zod pino`}</CodePre>

          <h3>Step 1 — start with naive</h3>
          <CodePre>{`// server.js
import express from 'express'
const app = express()
app.use(express.json())

app.post('/api/echo', (req, res) => res.json(req.body))
app.listen(3000)`}</CodePre>

          <h3>Step 2 — add layers one at a time</h3>
          <CodePre>{`// server.js (hardened)
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import { z } from 'zod'
import pino from 'pino'

const logger = pino({
  redact: {
    paths: ['req.headers.authorization', '*.password', '*.apiKey', '*.token', '*.secret'],
    censor: '[REDACTED]',
  },
})

const app = express()

// 1) trust proxy (App Service behind reverse proxy)
app.set('trust proxy', 1)

// 2) helmet — security headers
app.use(helmet())

// 3) strict CORS
const ALLOWED = new Set([
  'http://localhost:5173',
  'https://app.example.com',
])
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (ALLOWED.has(origin)) return cb(null, true)
    cb(new Error('CORS denied'))
  },
  credentials: true,
}))

// 4) size limit
app.use(express.json({ limit: '1mb' }))

// 5) rate limit
const limiter = rateLimit({ windowMs: 60_000, max: 100 })
app.use(limiter)

// 6) request log (no body, no headers)
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      ms: Date.now() - start,
      ip: req.ip,
    })
  })
  next()
})

// 7) auth (JWT verification — simplified)
const TENANT = process.env.AAD_TENANT_ID
const CLIENT = process.env.AAD_CLIENT_ID
const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${TENANT}/discovery/v2.0/keys\`),
)

async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'unauthorized' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer:   \`https://login.microsoftonline.com/\${TENANT}/v2.0\`,
      audience: CLIENT,
    })
    if (payload.tid !== TENANT) return res.status(401).json({ error: 'unauthorized' })
    if (!payload.oid)            return res.status(401).json({ error: 'unauthorized' })
    req.user = { oid: payload.oid, name: payload.name }
    next()
  } catch (e) {
    res.status(401).json({ error: 'unauthorized' })
  }
}

// 8) public endpoints
app.get('/health', (_req, res) => res.json({ ok: true }))

// 9) protected endpoints — wrap with auth
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1).max(100_000),
  })).min(1).max(50),
})

app.post('/api/chat', requireAuth, (req, res) => {
  const parsed = ChatRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ issues: parsed.error.issues })
  }
  res.json({ ok: true, received: parsed.data.messages.length })
})

// 10) error handler — never leak details
app.use((err, _req, res, _next) => {
  logger.error(err)
  if (err.message === 'CORS denied') return res.status(403).end()
  res.status(500).json({ error: 'Internal error' })
})

app.listen(3000)`}</CodePre>

          <h3>Step 3 — test each layer</h3>
          <CodePre>{`# Health — no auth needed
curl http://localhost:3000/health
# → { ok: true }

# Protected without auth → 401
curl -X POST http://localhost:3000/api/chat -d '{"messages":[]}' -H 'Content-Type: application/json'
# → { error: "unauthorized" }

# Bad input shape → 400
curl -X POST http://localhost:3000/api/chat \\
  -H 'Authorization: Bearer <valid-token>' \\
  -H 'Content-Type: application/json' \\
  -d '{"messages": "not an array"}'
# → { issues: [...] }

# Oversized body → 413
curl -X POST http://localhost:3000/api/chat \\
  -H 'Authorization: Bearer <valid-token>' \\
  -H 'Content-Type: application/json' \\
  -d "{\\"messages\\": $(python -c 'print(",".join(["{}"]*10000))')}"
# → 413 Payload Too Large

# Rate limit — hit 101 times
for i in {1..101}; do curl http://localhost:3000/health; done
# Last few → 429 Too Many Requests

# CORS denial — wrong origin
curl -X POST http://localhost:3000/api/chat \\
  -H 'Origin: https://evil.com' \\
  -d '{}' -H 'Content-Type: application/json'
# → 403 (CORS denied)`}</CodePre>

          <h3>Step 4 — check the headers</h3>
          <CodePre>{`curl -I http://localhost:3000/health

# Should include (helmet defaults):
# Content-Security-Policy: ...
# Strict-Transport-Security: max-age=...
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Referrer-Policy: no-referrer`}</CodePre>

          <h3>Step 5 — verify Pino redaction</h3>
          <CodePre>{`# Send a request with a "password" field
curl -X POST http://localhost:3000/api/chat \\
  -H 'Authorization: Bearer <valid>' \\
  -H 'Content-Type: application/json' \\
  -d '{"messages":[{"role":"user","content":"hi"}],"password":"secret123"}'

# Check the logs — password should be [REDACTED], not "secret123"`}</CodePre>

          <h3>Extensions</h3>
          <ul>
            <li>Switch in-memory rate limit to Redis-backed.</li>
            <li>Add per-route rate limits.</li>
            <li>Add an audit table + log every mutation.</li>
            <li>Tighten CSP and run report-only for a week.</li>
            <li>Add a basic IP allowlist for /api/admin/*.</li>
            <li>Switch authorization check to per-tenant.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Auth says 'unauthorized' but my token looks valid"</h3>
          <ul>
            <li>Token expired. Check the <code>exp</code> claim.</li>
            <li>Wrong audience. The token was for app A; you're checking app B's client ID.</li>
            <li>Wrong issuer. v1.0 vs v2.0 endpoint.</li>
            <li>Wrong tenant. <code>tid</code> claim doesn't match.</li>
            <li>Clock skew. Add <code>clockTolerance: '60s'</code> to jwtVerify.</li>
          </ul>

          <p>In dev, log <code>err.code</code> from jwtVerify — it tells you which check failed.</p>

          <h3>"Rate limit hits everyone at once"</h3>
          <p>You forgot <code>app.set('trust proxy', 1)</code>. All requests appear to come from the App Service edge IP. Add it.</p>

          <h3>"CORS is blocking my own frontend"</h3>
          <ul>
            <li>Origin mismatch. Console will show "Origin X is not allowed by Access-Control-Allow-Origin."</li>
            <li>Add localhost:5173 to allowed origins for dev.</li>
            <li>Check the actual Origin header your frontend sends (might be https vs http differences).</li>
            <li>Trailing slashes matter: "https://app.com" ≠ "https://app.com/".</li>
          </ul>

          <h3>"CSP is breaking my React app"</h3>
          <ul>
            <li>Vite dev server uses <code>style-src 'unsafe-inline'</code>. Add it.</li>
            <li>Inline scripts blocked. Move to external .js or use nonces.</li>
            <li>Fonts loaded from Google Fonts. Add <code>font-src 'self' fonts.gstatic.com</code>.</li>
            <li>API calls to login.microsoftonline.com blocked. Add to <code>connect-src</code>.</li>
          </ul>

          <p>Use report-only mode to discover all violations before enforcing.</p>

          <h3>"helmet broke my health probe"</h3>
          <p>Some defaults can interfere. Allow specific paths to bypass headers, or configure helmet selectively:</p>
          <CodePre>{`app.get('/health', (_req, res) => res.json({ ok: true }))   // before helmet
app.use(helmet())
// ... rest of app ...`}</CodePre>

          <p>Or just <code>{`app.use(helmet({ contentSecurityPolicy: false }))`}</code> to skip CSP while keeping everything else.</p>

          <h3>"Request size limit too strict"</h3>
          <p>Either raise the global limit (not recommended) or override per-route:</p>
          <CodePre>{`app.use(express.json({ limit: '1mb' }))
app.post('/api/large', express.json({ limit: '50mb' }), handler)`}</CodePre>

          <h3>"My audit log is leaking PII"</h3>
          <ul>
            <li>Add Pino redaction for sensitive fields.</li>
            <li>Use explicit allowlist of fields to include.</li>
            <li>Never log full request body in production.</li>
            <li>Sample logs only (1% of requests for high-volume routes).</li>
          </ul>

          <h3>"Bot traffic is bypassing rate limit"</h3>
          <p>Bots rotate IPs. Per-IP rate limiting helps but isn't bulletproof. Options:</p>
          <ul>
            <li>Per-user (after auth) instead of per-IP.</li>
            <li>Add CAPTCHA on auth endpoints.</li>
            <li>Add Azure WAF or CloudFlare bot protection.</li>
            <li>Block known-abuse IP ranges (TorBulkExitList, AbuseIPDB).</li>
          </ul>

          <h3>"X-Frame-Options is set twice"</h3>
          <p>Both your app and a CDN/proxy are setting it. Pick one source of truth. Remove from app code if infra handles it.</p>

          <h3>"Authorization header reaches my logs"</h3>
          <p>Pino redaction should catch <code>req.headers.authorization</code>. If using Winston or console.log, you must filter manually. Use <code>{`Object.assign({}, req.headers, { authorization: '[REDACTED]' })`}</code> before logging.</p>

          <h3>"Trust proxy means anyone can fake an IP"</h3>
          <p>Only if you set <code>true</code> (trust all hops). Use the specific number (<code>1</code> for App Service direct, <code>2</code> for CloudFlare + App Service). Don't use <code>true</code>.</p>

          <h3>"I can't tell if my Zod schema is matching"</h3>
          <p>Use <code>safeParse</code> instead of <code>parse</code>. The .error.issues array shows exact failure paths. Log them in dev to iterate quickly.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The nine concerns</h3>
          <CodePre>{`1. trust proxy            app.set('trust proxy', 1)
2. CORS                   cors() open OR cors({ origin: allowlist })
3. Body size limit        express.json({ limit: '1mb' })
4. Auth                   requireAuth on /api/* (allowlist health)
5. Rate limiting          express-rate-limit per-IP or per-user
6. Input validation       Zod schemas (.safeParse)
7. Security headers       helmet() or 4-header manual
8. Audit logs             stdout (Tabloom) OR DB table (ShopKeep)
9. Secret scrubbing       Pino redact, never log Authorization`}</CodePre>

          <h3>The auth wiring</h3>
          <CodePre>{`app.set('trust proxy', 1)
app.use(express.json({ limit: '1mb' }))

const PUBLIC = new Set(['/health', '/version'])
app.use('/api', (req, res, next) => {
  if (PUBLIC.has(req.path)) return next()
  return requireAuth(req, res, next)
})`}</CodePre>

          <h3>The requireAuth pattern</h3>
          <CodePre>{`const JWKS = createRemoteJWKSet(new URL(
  \`https://login.microsoftonline.com/\${TENANT}/discovery/v2.0/keys\`
))

async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'unauthorized' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer:   \`https://login.microsoftonline.com/\${TENANT}/v2.0\`,
      audience: CLIENT,
      clockTolerance: '60s',
    })
    if (payload.tid !== TENANT) return res.status(401).json({ error: 'unauthorized' })
    if (!payload.oid)            return res.status(401).json({ error: 'unauthorized' })
    req.user = { oid: payload.oid, name: payload.name, isOwner: payload.oid === OWNER_OID }
    next()
  } catch { res.status(401).json({ error: 'unauthorized' }) }
}`}</CodePre>

          <h3>helmet — the line</h3>
          <CodePre>{`app.use(helmet())

// Or selectively:
app.use(helmet({
  contentSecurityPolicy: { directives: { /* tuned */ }, reportOnly: true },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}))`}</CodePre>

          <h3>Rate limiting — three patterns</h3>
          <CodePre>{`// Global
app.use(rateLimit({ windowMs: 60_000, max: 100 }))

// Per-route
const aiLimit = rateLimit({ windowMs: 60_000, max: 10 })
app.use('/api/ai/', aiLimit)

// Per-user (after auth)
const userLimit = rateLimit({
  windowMs: 60_000,
  max: 50,
  keyGenerator: (req) => req.user?.oid ?? req.ip,
})
app.use('/api/expensive/', requireAuth, userLimit)`}</CodePre>

          <h3>Zod input validation</h3>
          <CodePre>{`const Schema = z.object({
  email: z.string().email(),
  age: z.number().int().positive().max(150),
  role: z.enum(['user', 'admin']),
})

app.post('/api/x', requireAuth, (req, res) => {
  const parsed = Schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ issues: parsed.error.issues })
  }
  const data = parsed.data
  // ... handler logic with typed data ...
})`}</CodePre>

          <h3>CORS strict</h3>
          <CodePre>{`const allowed = new Set([
  'https://myapp.com',
  process.env.NODE_ENV !== 'production' && 'http://localhost:5173',
].filter(Boolean))

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.has(origin)) return cb(null, true)
    cb(new Error(\`Origin \${origin} not allowed\`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))`}</CodePre>

          <h3>Pino redaction</h3>
          <CodePre>{`import pino from 'pino'

const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.apiKey',
      '*.token',
      '*.secret',
    ],
    censor: '[REDACTED]',
  },
})`}</CodePre>

          <h3>Status code conventions</h3>
          <table>
            <tbody>
              <tr><th>Code</th><th>When</th></tr>
              <tr><td>200</td><td>OK</td></tr>
              <tr><td>201</td><td>Created</td></tr>
              <tr><td>204</td><td>No content (DELETE success)</td></tr>
              <tr><td>400</td><td>Bad request — validation failed</td></tr>
              <tr><td>401</td><td>Unauthorized — no token / bad token</td></tr>
              <tr><td>403</td><td>Forbidden — token valid but lacks permission</td></tr>
              <tr><td>404</td><td>Not found</td></tr>
              <tr><td>413</td><td>Payload too large</td></tr>
              <tr><td>415</td><td>Unsupported media type</td></tr>
              <tr><td>429</td><td>Too many requests (rate limit)</td></tr>
              <tr><td>500</td><td>Internal error (generic)</td></tr>
              <tr><td>503</td><td>Service unavailable (KV ref failed, AI paused, etc.)</td></tr>
            </tbody>
          </table>

          <h3>The OWASP top 10 (2025)</h3>
          <ol>
            <li>Broken Access Control</li>
            <li>Cryptographic Failures</li>
            <li>Injection</li>
            <li>Insecure Design</li>
            <li>Security Misconfiguration</li>
            <li>Vulnerable Components</li>
            <li>Authentication Failures</li>
            <li>Software & Data Integrity</li>
            <li>Logging Failures</li>
            <li>SSRF</li>
          </ol>

          <h3>What to never do</h3>
          <ul>
            <li>Never <code>console.log(req.body)</code> in prod.</li>
            <li>Never <code>{`res.json({ error: e.message })`}</code> (leaks).</li>
            <li>Never <code>app.set('trust proxy', true)</code> (spoofable).</li>
            <li>Never <code>{'execSync(`cmd ${userInput}`)'}</code> (RCE).</li>
            <li>Never <code>{'db.prepare(`SELECT * FROM x WHERE id = ${id}`)'}</code> (SQLi).</li>
            <li>Never <code>dangerouslySetInnerHTML</code> with user-controlled HTML.</li>
            <li>Never log the Authorization header.</li>
            <li>Never accept arbitrary URLs for server-side fetches without validation.</li>
          </ul>

          <h3>The layered defense</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  R[Request] --> TP[trust proxy]
  TP --> H[helmet headers]
  H --> C[CORS check]
  C --> S[Size limit]
  S --> RL[Rate limit]
  RL --> A[requireAuth]
  A --> V[Zod validate]
  V --> APP[Your handler]
  APP --> AL[Audit log]
  AL --> RES[Response]
  style A fill:#5C2A4A,color:#fff
  style V fill:#5C2A4A,color:#fff`} />

          <h3>The discipline</h3>
          <ul>
            <li>trust proxy 1 always.</li>
            <li>Default-deny auth (allowlist public endpoints).</li>
            <li>Generic errors to client, detailed logs server-side.</li>
            <li>Audit every mutation + every auth event.</li>
            <li>Redact sensitive fields in logs.</li>
            <li>Schema-validate JSON bodies with Zod.</li>
            <li>Rate-limit by user, not IP, after auth.</li>
            <li>helmet() is one line away.</li>
            <li>Document your threat model so future-you knows why.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
