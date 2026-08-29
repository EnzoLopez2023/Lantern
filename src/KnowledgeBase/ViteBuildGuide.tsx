import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Project Anatomy',                    icon: '📁' },
  { id: 's3',  num: '3',  title: 'Dev Server + HMR',                   icon: '🔥' },
  { id: 's4',  num: '4',  title: 'The /api Proxy Pattern',             icon: '🔌' },
  { id: 's5',  num: '5',  title: 'Env Vars & VITE_ Prefix',            icon: '🔑' },
  { id: 's6',  num: '6',  title: 'Production Build',                   icon: '📦' },
  { id: 's7',  num: '7',  title: 'manualChunks Strategy',              icon: '✂️' },
  { id: 's8',  num: '8',  title: 'Docker Build-Args',                  icon: '🐳' },
  { id: 's9',  num: '9',  title: 'CI Propagation',                     icon: '🚀' },
  { id: 's10', num: '10', title: 'Vite 8 + Rolldown',                  icon: '🔄' },
  { id: 's11', num: '★',  title: 'Lab: New App Wired',                 icon: '🛠️' },
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

export default function ViteBuildGuide() {
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
            <span className="sidebar-title">Vite Build System</span>
          </div>
          <div className="sidebar-sub">esbuild dev · Rollup prod</div>
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
          <div className="hero-tag">⚡ Vite 7 / 8 · 2026</div>
          <h1>Vite Build System<br />Deep Dive</h1>
          <p>
            Nine of the ten fleet apps use <strong style={{ color: '#C77AA0' }}>Vite</strong> (the tenth, PulseWire,
            uses Next.js's bundler). Four of those have moved to Vite 8 with the new Rolldown bundler. This guide walks
            the dev loop, the prod build, the <code>VITE_*</code> env-var dance, Docker build-args, and the GitHub
            Actions propagation that ties it all together.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">9</span><span className="hero-stat-label">Fleet Apps Use Vite</span></div>
            <div className="hero-stat"><span className="hero-stat-val">4</span><span className="hero-stat-label">On Vite 8 + Rolldown</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~50ms</span><span className="hero-stat-label">Cold Start</span></div>
            <div className="hero-stat"><span className="hero-stat-val">5</span><span className="hero-stat-label">VITE_ Vars Baked</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Vite is two tools in one trench coat:
          </p>
          <ol>
            <li><strong>Dev server</strong> — uses esbuild (Go) for "transpile only" and serves files unbundled via native ES module imports. Cold start in ~50ms. Hot Module Replacement (HMR) in single-digit ms.</li>
            <li><strong>Production build</strong> — uses Rollup (or Rolldown in Vite 8) to tree-shake, bundle, code-split, and minify. Slower than esbuild, but the output is a tiny optimized bundle.</li>
          </ol>

          <h3>The dev-vs-prod gap (and why it exists)</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  subgraph Dev
    A[Source files] -->|esbuild transform| B[Native ES modules]
    B -->|browser fetches each| C[Browser]
  end
  subgraph Prod
    D[Source files] -->|Rollup bundles| E[Optimized chunks]
    E -->|tree-shaken + minified| F[dist/]
  end`} />

          <p>
            In dev, your browser fetches <code>App.tsx</code> over HTTP, Vite transforms it on-the-fly, and the next
            file is fetched the same way. No bundling step — that's why it's instant. In prod, all of that is
            pre-bundled, tree-shaken, and minified into a tree of chunks that fits in a CDN.
          </p>

          <h3>Two analogies</h3>
          <p>
            <strong>Dev = restaurant kitchen.</strong> Orders come in (browser requests), the kitchen cooks
            (transforms) on demand. Fast for one order, slow if you tried to feed an army.
          </p>
          <p>
            <strong>Prod = factory.</strong> Pre-cook every meal, freeze it, ship it. Slow to set up the factory, but
            every customer gets food in ten seconds because it's already cooked.
          </p>

          <h3>What Vite is not</h3>
          <ul>
            <li><strong>Not a framework.</strong> It bundles. React, Vue, Solid, Svelte all plug in via plugins.</li>
            <li><strong>Not a type-checker.</strong> Both dev and prod strip TypeScript types with esbuild; they don't verify them. Run <code>tsc --noEmit</code> in CI.</li>
            <li><strong>Not a server.</strong> The dev server is a dev convenience. In prod, you serve <code>dist/</code> from any static host (or Express, or App Service container).</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 2 — ANATOMY */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Project Anatomy</h2>
          <p>The minimal shape of a Vite project as the fleet uses it:</p>

          <CodePre>{`my-app/
├── index.html              ← entry HTML (NOT in src/)
├── package.json
├── vite.config.ts          ← Vite config
├── tsconfig.json           ← TS config
├── tsconfig.app.json
├── tsconfig.node.json      ← config for vite.config.ts itself
├── public/                 ← static assets copied verbatim into dist/
│   └── favicon.ico
├── src/
│   ├── main.tsx            ← entry script referenced from index.html
│   ├── App.tsx
│   └── ...
└── dist/                   ← output (gitignored)`}</CodePre>

          <h3>The <code>index.html</code> is the entry — not <code>main.tsx</code></h3>
          <p>This is the biggest mental shift coming from webpack: Vite treats <code>index.html</code> as the entry point. It's a real HTML file that you edit; Vite injects a <code>&lt;script type="module"&gt;</code> tag at build time.</p>
          <CodePre>{`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hearth</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>  <!-- ← The entry -->
  </body>
</html>`}</CodePre>

          <h3>The <code>public/</code> folder</h3>
          <p>Anything in <code>public/</code> is copied verbatim into <code>dist/</code> at build time. Reference it with an absolute path: <code>&lt;img src="/logo.png"&gt;</code>. Use this for things that need a stable URL (favicons, robots.txt, og-images).</p>
          <p>Anything imported from <code>src/</code> goes through the bundler. Both are valid; <code>public/</code> bypasses hash-renaming.</p>

          <h3>The <code>scripts</code> in <code>package.json</code></h3>
          <CodePre>{`{
  "scripts": {
    "dev": "vite",                   // dev server on :5173
    "build": "tsc -b && vite build", // type-check + bundle
    "preview": "vite preview",       // serve dist/ locally (for smoke-testing)
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"      // type-check only (no emit)
  }
}`}</CodePre>

          <p>The <code>tsc -b</code> before <code>vite build</code> is what catches type errors during the build. Without it, Vite emits a working bundle even if your types are broken.</p>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>Vite's <code>build</code> step does NOT type-check.</strong> esbuild strips types and emits JS;
              that's it. If you skip <code>tsc -b</code>, you'll ship type-broken code that runs (probably). Always
              prepend <code>tsc -b</code> or a CI <code>tsc --noEmit</code> step.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 3 — DEV SERVER */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The Dev Server + HMR</h2>
          <p>
            <code>npm run dev</code> starts the dev server on port 5173. The browser loads <code>index.html</code>,
            which loads <code>main.tsx</code>, which loads its imports, each of which Vite transforms-and-serves
            on-the-fly using esbuild.
          </p>

          <h3>Hot Module Replacement</h3>
          <p>When you save a file, Vite:</p>
          <ol>
            <li>Re-transforms <em>just that one file</em> with esbuild (~5ms).</li>
            <li>Sends a WebSocket message to the browser: "module <code>/src/App.tsx</code> changed, here's the new version."</li>
            <li>The browser's HMR runtime swaps the module without a full page refresh.</li>
            <li>If the module is React-Fast-Refresh-compatible (it is, via <code>@vitejs/plugin-react</code>), the component's state is preserved across the swap.</li>
          </ol>

          <p>End-to-end latency: typically under 100ms from save to "DOM updated."</p>

          <h3>The mental model: ES modules are the unit</h3>
          <p>Vite serves each <code>.ts</code>/<code>.tsx</code> file as its own ES module. The browser's import graph and your source tree are 1:1. You can open the Network tab and see them.</p>

          <h3>Dev-only quirks</h3>
          <ul>
            <li><strong>First page load is slow-ish.</strong> Vite pre-bundles dependencies (the <code>node_modules</code> stuff) on first run; that takes a few seconds. Subsequent loads use the cache in <code>node_modules/.vite/</code>.</li>
            <li><strong>Removing a dep doesn't always clean up.</strong> If you change <code>package.json</code>, restart the dev server (or delete <code>node_modules/.vite/</code>).</li>
            <li><strong>Dev is not bundled.</strong> If you're testing a "shaped like prod" build, use <code>vite build &amp;&amp; vite preview</code>.</li>
          </ul>

          <h3>What plugins do</h3>
          <p>Vite plugins are functions that hook into the transform pipeline. The fleet uses these:</p>
          <table>
            <tbody>
              <tr><th>Plugin</th><th>Apps</th><th>Purpose</th></tr>
              <tr><td><code>@vitejs/plugin-react</code></td><td>Hearth, Cairn, GLP1, Tabloom, Puzzlebox</td><td>JSX + Fast Refresh</td></tr>
              <tr><td><code>@vitejs/plugin-react</code> (Rolldown variant)</td><td>ShopKeep, Workshop, SecretPhoto (Vite 8)</td><td>Same, on Rolldown</td></tr>
              <tr><td><code>@tailwindcss/vite</code></td><td>ShopKeep, Workshop, SecretPhoto</td><td>Tailwind v4 PostCSS-free integration</td></tr>
              <tr><td><code>@tailwindcss/postcss</code> (via postcss.config)</td><td>Hearth (Tailwind v4)</td><td>Tailwind v4 through PostCSS</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 4 — API PROXY */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The <code>/api</code> Proxy Pattern</h2>
          <p>
            Every fleet app runs the React SPA and the Express backend as separate processes during dev. The frontend
            wants to call <code>/api/recipes</code>; the backend listens on <code>localhost:3001</code>. Vite's dev
            proxy bridges them.
          </p>

          <h3>The pattern</h3>
          <CodePre>{`// SecretApp/vite.config.ts — verbatim
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // ... build config below ...
})`}</CodePre>

          <h3>What it does</h3>
          <ol>
            <li>Vite dev server runs on <code>localhost:5173</code>.</li>
            <li>Express backend runs on <code>localhost:3001</code> (via <code>npm run server</code>).</li>
            <li>Browser hits <code>http://localhost:5173/api/recipes</code>.</li>
            <li>Vite intercepts the path (starts with <code>/api</code>), forwards to <code>http://localhost:3001/api/recipes</code>.</li>
            <li>Express responds; Vite proxies the response back.</li>
            <li>From the browser's perspective: same-origin call, no CORS dance.</li>
          </ol>

          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant B as Browser
  participant V as Vite (5173)
  participant E as Express (3001)
  B->>V: GET /api/recipes
  V->>E: GET /api/recipes (proxied)
  E->>V: 200 [recipes]
  V->>B: 200 [recipes]
  Note over B,V: Browser sees same-origin response`} />

          <h3>Per-app proxy targets</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Frontend port</th><th>Backend port</th></tr>
              <tr><td>Hearth (SecretApp)</td><td>5173</td><td>3001</td></tr>
              <tr><td>ShopKeep</td><td>5173</td><td>3002</td></tr>
              <tr><td>GLP1</td><td>3000</td><td>3004</td></tr>
              <tr><td>Puzzlebox</td><td>5173</td><td>3002</td></tr>
              <tr><td>Workshop</td><td>5180</td><td>3006</td></tr>
              <tr><td>Tabloom</td><td>5173</td><td>3007</td></tr>
              <tr><td>Cairn</td><td>5173</td><td>3001</td></tr>
            </tbody>
          </table>

          <h3>Why <code>changeOrigin</code> and <code>secure</code></h3>
          <ul>
            <li><strong><code>changeOrigin: true</code></strong> rewrites the <code>Host</code> header on the proxied request to match the target. Without it, Express sees <code>Host: localhost:5173</code> and may reject (it doesn't, but some servers do).</li>
            <li><strong><code>secure: false</code></strong> ignores TLS cert errors. Only matters when the target uses HTTPS with a self-signed cert (not the case in fleet dev — but the flag is harmless).</li>
          </ul>

          <h3>What happens in production?</h3>
          <p>The proxy is a <em>dev-only</em> feature. In prod, Express serves the static <code>dist/</code> at <code>/</code> and the API at <code>/api/*</code> — same origin, no proxy needed. The <code>vite.config.ts</code> proxy is ignored at build time.</p>
        </section>

        <hr />

        {/* SECTION 5 — ENV VARS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Env Vars and the <code>VITE_</code> Prefix</h2>
          <p>
            Vite has a strict rule: <strong>only env vars prefixed with <code>VITE_</code> are exposed to the
            browser</strong>. Everything else stays server-side.
          </p>

          <h3>The mental model</h3>
          <p>
            <code>process.env.DATABASE_URL</code>? Server-side only (Node sees it; browser doesn't).
            <code>import.meta.env.VITE_AZURE_CLIENT_ID</code>? Baked into the browser bundle at build time.
            The prefix is the firewall.
          </p>

          <h3>Where Vite reads from</h3>
          <p>Three sources, in priority order (later beats earlier):</p>
          <ol>
            <li><code>.env</code> — committed defaults (rarely a good idea — leak risk)</li>
            <li><code>.env.local</code> — gitignored secrets for local dev</li>
            <li><code>.env.production</code> — overrides for prod builds</li>
            <li><code>.env.production.local</code> — gitignored prod secrets</li>
            <li>The shell environment at build time — <em>this is what Docker uses</em></li>
          </ol>

          <h3>Reading in app code</h3>
          <CodePre>{`// src/auth/msalConfig.ts (ShopKeep)
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: \`https://login.microsoftonline.com/\${import.meta.env.VITE_AZURE_TENANT_ID}\`,
    redirectUri: window.location.origin,
  },
  // ...
}`}</CodePre>

          <p>At build time, Vite finds every <code>import.meta.env.VITE_X</code> in your code and replaces it with the literal string. After build, there's no env-var lookup — the value is hardcoded into the bundle.</p>

          <h3>Type-safe env access</h3>
          <CodePre>{`// src/env.d.ts (or src/vite-env.d.ts)
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_CLIENT_ID: string
  readonly VITE_AZURE_TENANT_ID: string
  readonly VITE_TABLOOM_API_BASE_URL: string
  readonly VITE_TABLOOM_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}`}</CodePre>

          <p>Now <code>import.meta.env.VITE_AZURE_CLIENT_ID</code> is typed as <code>string</code>, not <code>string | undefined</code>. Misspell <code>VITE_AZURE_CLIENT_ID</code> as <code>VITE_AZURE_ID</code>? Compile error.</p>

          <h3>Vite vs Node env conventions</h3>
          <table>
            <tbody>
              <tr><th>Side</th><th>Access</th><th>Naming</th></tr>
              <tr><td>Browser (built code)</td><td><code>import.meta.env.VITE_FOO</code></td><td>Must start with <code>VITE_</code></td></tr>
              <tr><td>Backend (Node)</td><td><code>process.env.FOO</code></td><td>Any name</td></tr>
              <tr><td>Vite config (Node)</td><td><code>process.env.FOO</code></td><td>Any name</td></tr>
              <tr><td>Docker builder stage</td><td><code>ENV/ARG</code> directives</td><td>Must mirror <code>VITE_*</code> for frontend</td></tr>
            </tbody>
          </table>

          <h3>The "hardcoded in source" alternative</h3>
          <p>
            Hearth, Cairn, and Puzzlebox <em>hardcode</em> the MSAL <code>clientId</code> and <code>tenantId</code> in
            <code>src/auth/msalConfig.ts</code> rather than baking them via <code>VITE_*</code>. Why? They're
            non-secrets (client IDs are public; the secret is the federated credential, which never leaves Azure). The
            simplification pays for itself: no build-arg dance, no Docker propagation, no GitHub Actions plumbing.
          </p>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>Never put real secrets in <code>VITE_*</code> vars.</strong> They're baked into the browser bundle
              and visible to anyone who hits View Source. <code>VITE_*</code> is for public-but-environment-specific
              config (client IDs, public URLs, feature flags).
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 6 — PRODUCTION BUILD */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The Production Build</h2>
          <p>
            <code>vite build</code> runs Rollup (or Rolldown in Vite 8) over your entry point, tree-shakes unused
            exports, bundles into chunks, minifies, hashes filenames for cache-busting, and writes everything to
            <code>dist/</code>.
          </p>

          <h3>Reading the output</h3>
          <CodePre>{`> vite build

vite v7.1.7 building for production...
✓ 2487 modules transformed.
dist/index.html                              0.62 kB │ gzip:  0.40 kB
dist/assets/index-DA5JOZ7P.css              52.31 kB │ gzip: 11.84 kB
dist/assets/index-Bk2_pIuP.js                4.21 kB │ gzip:  1.86 kB
dist/assets/mui-vendor-BjU9C3Yc.js         483.21 kB │ gzip: 154.32 kB
dist/assets/plex-tools-CKlPGr_l.js         105.83 kB │ gzip:  33.42 kB
dist/assets/utility-tools-T1Q6DkBb.js       84.10 kB │ gzip:  27.19 kB
dist/assets/AzureGuide-D3z8vL2k.js         118.94 kB │ gzip:  36.81 kB
✓ built in 4.32s`}</CodePre>

          <ul>
            <li><strong>Hashed filenames</strong> let you set <code>Cache-Control: public, max-age=31536000, immutable</code> safely. Content changes → hash changes → new URL.</li>
            <li><strong>Gzipped sizes</strong> are what users actually download. Aim for ≤ 100KB gzipped on the initial chunk.</li>
            <li><strong>One chunk per lazy boundary</strong> (e.g. <code>AzureGuide</code> is its own chunk from <code>lazy(() =&gt; import('./AzureGuide'))</code>).</li>
          </ul>

          <h3>Build options worth knowing</h3>
          <CodePre>{`// vite.config.ts
export default defineConfig({
  build: {
    target: 'es2022',                  // emit modern JS — smaller, faster, valid in all 2026 browsers
    minify: 'esbuild',                  // default; faster than terser; usually identical output
    sourcemap: true,                    // emit .js.map files (for prod debugging)
    chunkSizeWarningLimit: 1000,        // warn if any chunk exceeds 1MB (raw, not gzipped)
    cssCodeSplit: true,                 // emit per-chunk CSS (default true)
    assetsInlineLimit: 4096,            // inline assets under 4KB as base64
    emptyOutDir: true,                  // clean dist/ before each build
    rollupOptions: {                    // forward to Rollup
      output: {
        manualChunks: { /* see §7 */ }
      }
    }
  }
})`}</CodePre>

          <h3>Hearth's actual build config</h3>
          <CodePre>{`// SecretApp/vite.config.ts — verbatim
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true, secure: false }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React + MUI share a single vendor chunk (React alone ends up
          // empty because MUI pulls it in first during chunking).
          mui: ['react', 'react-dom', '@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          // Separate chunks for heavy components
          'plex-tools': ['./src/PlexMovieInsights.tsx'],
          'utility-tools': ['./src/ExcelToJsonConverter.tsx', './src/ChatApp.tsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000  // 1MB warning threshold
  }
})`}</CodePre>
        </section>

        <hr />

        {/* SECTION 7 — MANUALCHUNKS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span><code>manualChunks</code> Strategy</h2>
          <p>
            By default, Vite chunks by lazy boundary: every <code>import('./X')</code> becomes its own chunk.
            <code>manualChunks</code> overrides that for dependencies — typically you split vendor code into stable
            chunks so users don't re-download React every time you change a button label.
          </p>

          <h3>Why vendor splitting matters</h3>
          <ol>
            <li>You ship a small UI change (1KB of source).</li>
            <li>Vite hashes the changed file → new URL.</li>
            <li>If React was in the same chunk → its URL changes too → user re-downloads React (200KB).</li>
            <li>If React was its own chunk with no source changes → URL unchanged → user re-uses cached copy.</li>
          </ol>
          <p>The longer dependencies stay in their own chunks, the better the cache-hit rate across deploys.</p>

          <h3>Two ways to declare chunks</h3>
          <p><strong>Object form — by name.</strong> Easy, brittle (typos silent), works for stable lists.</p>
          <CodePre>{`manualChunks: {
  mui: ['react', 'react-dom', '@mui/material', '@mui/icons-material',
        '@emotion/react', '@emotion/styled'],
  'plex-tools': ['./src/PlexMovieInsights.tsx'],
}`}</CodePre>

          <p><strong>Function form — by predicate.</strong> Flexible, scales to dozens of vendor splits without renaming source files.</p>
          <CodePre>{`// Tabloom/vite.config.ts — verbatim
manualChunks(id) {
  if (!id.includes("node_modules")) return undefined;
  if (id.includes("/@azure/") || id.includes("/jose/")) return "vendor-auth";
  if (id.includes("/@tiptap/") || id.includes("/prosemirror-")) return "vendor-tiptap";
  if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
    return "vendor-react";
  }
  if (id.includes("/react-router")) return "vendor-router";
  if (id.includes("/zustand/")) return "vendor-state";
  return undefined;
}`}</CodePre>

          <p>For each module, Rollup calls this function with the absolute path. Return a chunk name to assign; return <code>undefined</code> to use the default.</p>

          <h3>ShopKeep's predicate-based split</h3>
          <CodePre>{`// ShopKeep/vite.config.ts — verbatim
manualChunks(id) {
  if (id.includes('node_modules/recharts')) return 'charts';
  if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) return 'mui';
  if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
}`}</CodePre>

          <h3>Which split strategy is right?</h3>
          <table>
            <tbody>
              <tr><th>App size</th><th>Strategy</th></tr>
              <tr><td>Tiny (1 page, few deps)</td><td>Default — let Vite chunk by lazy boundary</td></tr>
              <tr><td>Small (Hearth-ish)</td><td>Object form — 1–3 vendor chunks (MUI, charts, etc.)</td></tr>
              <tr><td>Medium-large (Tabloom-ish)</td><td>Function form — split by package family</td></tr>
              <tr><td>Huge</td><td>Re-architect — code-split routes, lazy-load heavy editors</td></tr>
            </tbody>
          </table>

          <h3>Footgun: orphan chunks</h3>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              If you list a dep in <code>manualChunks</code> but nothing actually imports it, you get an empty chunk.
              Hearth's config notes this: <em>"React alone ends up empty because MUI pulls it in first during
              chunking."</em> Hence MUI + React share <code>mui.js</code>.
            </div>
          </div>

          <h3>Verifying your split actually saves bytes</h3>
          <ul>
            <li>Build: <code>npm run build</code>.</li>
            <li>Make a tiny source change.</li>
            <li>Build again. Diff the filenames in <code>dist/assets/</code>. The vendor-chunk hash should be unchanged.</li>
            <li>If it's not, your split is leaking — likely your app code accidentally imports through a re-exporting barrel that drags vendor code into the main chunk.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 8 — DOCKER */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Docker Build-Args — Baking <code>VITE_*</code> Into the Image</h2>
          <p>
            Build args are Docker's way of passing values into a build that <em>aren't</em> part of the runtime
            environment. Vite needs <code>VITE_*</code> values <strong>during <code>npm run build</code></strong>
            inside the builder stage. The pattern: <code>ARG</code> → <code>ENV</code> → <code>RUN npm run build</code>.
          </p>

          <h3>The pattern, end-to-end</h3>
          <CodePre>{`# Workshop/Dockerfile — verbatim, builder stage

FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Vite bakes these into the JS bundle at build time.
# Values come from the host .env via docker-compose build args.
ARG VITE_AZURE_CLIENT_ID
ARG VITE_AZURE_TENANT_ID
ARG VITE_SHOPKEEP_URL
ARG VITE_TABLOOM_API_BASE_URL
ARG VITE_TABLOOM_CLIENT_ID
ENV VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID
ENV VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID
ENV VITE_SHOPKEEP_URL=$VITE_SHOPKEEP_URL
ENV VITE_TABLOOM_API_BASE_URL=$VITE_TABLOOM_API_BASE_URL
ENV VITE_TABLOOM_CLIENT_ID=$VITE_TABLOOM_CLIENT_ID

RUN npm run build`}</CodePre>

          <h3>Why <code>ARG</code> then <code>ENV</code>?</h3>
          <ul>
            <li><strong><code>ARG</code></strong> declares a build-time argument the caller can supply. It exists only inside the builder stage; it's not part of the image's runtime env.</li>
            <li><strong><code>ENV</code></strong> sets a process env var inside the stage. <code>npm run build</code> spawns Node which reads <code>process.env</code>, which Vite then bakes into the bundle.</li>
            <li><strong>Without the <code>ENV</code> line</strong>, <code>ARG</code> alone doesn't get into the build process — it's just a Dockerfile-internal variable.</li>
          </ul>

          <h3>Why this isn't a runtime env var on App Service</h3>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              Setting <code>VITE_AZURE_CLIENT_ID</code> on App Service in the portal does <strong>nothing</strong> — the
              bundle is already built. The value is baked in by the build step in the Dockerfile. To change it, you
              must rebuild and redeploy the image. This is <em>the</em> recurring "I changed an App Service setting and
              nothing happened" gotcha.
            </div>
          </div>

          <h3>The "no build args needed" version (Hearth pattern)</h3>
          <p>Hearth hardcodes its MSAL config in source, so its Dockerfile has zero <code>ARG VITE_*</code> declarations:</p>
          <CodePre>{`# SecretApp/Dockerfile — verbatim, builder stage

FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build       # ← no VITE_* vars needed; values are in src/`}</CodePre>

          <p>The header comment in the file makes it explicit:</p>
          <CodePre>{`# msalConfig.ts hardcodes the Entra client/tenant IDs (unlike Workshop/
# ShopKeep/GLP-1) so there are NO Vite build-args needed here. Sidesteps
# MIGRATION_RCA #3 entirely.`}</CodePre>

          <h3>The three-stage Dockerfile shape across the fleet</h3>
          <CodePre>{`FROM node:22-alpine AS deps      # tiny — production deps only, with native module compilation
  apk add python3 make g++       # for better-sqlite3 native build
  npm install --omit=dev

FROM node:22-alpine AS builder   # all deps + build
  apk add python3 make g++
  npm install
  ARG VITE_*                     # build-time args (per app)
  ENV VITE_*=$VITE_*
  npm run build                  # emits dist/

FROM node:22-alpine AS runner    # minimal runtime
  COPY --from=deps    node_modules
  COPY --from=builder dist
  COPY server.js routes lib schema.sql
  ENV NODE_ENV=production
  VOLUME ["/data"]
  CMD ["node", "server.js"]`}</CodePre>

          <p>The runner stage doesn't have native build tools, no devDependencies, no source — it's just enough to run the production server. Final image size is typically 200–300 MB.</p>
        </section>

        <hr />

        {/* SECTION 9 — CI PROPAGATION */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>CI Propagation — From <code>deploy.yml</code> to ACR</h2>
          <p>Tying the chain: GitHub Actions has the values, passes them as <code>--build-arg</code> to <code>az acr build</code>, which forwards them to the Dockerfile, which forwards them as <code>ENV</code> to <code>npm run build</code>, which Vite bakes them into the bundle.</p>

          <h3>Workshop's full deploy.yml (showing the chain)</h3>
          <CodePre>{`# workshop/.github/workflows/deploy.yml — verbatim
name: Build & Deploy Workshop to Azure
on:
  push:
    branches: [main]
    paths-ignore:
      - '**/*.md'
      - 'azure-infra/**'
      - '.gitignore'
  workflow_dispatch:

concurrency:
  group: deploy-workshop
  cancel-in-progress: false

permissions:
  id-token: write
  contents: read

env:
  RG:     rg-personal-apps-prod
  ACR:    acrenzolopez01
  IMAGE:  workshop:latest
  WEBAPP: app-workshop-prod-lwxhu7jxlrbtu

  AZURE_CLIENT_ID:       dbd68ead-ad3f-4c2b-8559-36112970db42
  AZURE_TENANT_ID:       de625678-c55b-4494-9558-14946cbb6133
  AZURE_SUBSCRIPTION_ID: 1cf02211-8d77-4658-bb6a-0f83ec831c3b

  # Vite build-time Entra IDs — baked into the frontend bundle.
  VITE_AZURE_CLIENT_ID: 0f303f8f-207f-4b7f-84a5-b5d0abcf49d1
  VITE_AZURE_TENANT_ID: 52188f12-db6b-46c6-88ff-08c802f0ed3b

  # Tabloom integration — workshop's frontend acquires a token for
  # Tabloom's API scope and calls Tabloom directly.
  VITE_TABLOOM_API_BASE_URL: https://app-tabloom-prod-lwxhu7jxlrbtu.azurewebsites.net
  VITE_TABLOOM_CLIENT_ID:    b30f09b9-e100-4aa5-af22-ce359ff13fba

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: azure/login@v2
        with:
          client-id:       \${{ env.AZURE_CLIENT_ID }}
          tenant-id:       \${{ env.AZURE_TENANT_ID }}
          subscription-id: \${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: Build image in ACR
        # ACR builds server-side — no Docker daemon needed on the runner.
        run: |
          az acr build \\
            --registry "$ACR" \\
            --image "$IMAGE" \\
            --build-arg "VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID" \\
            --build-arg "VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID" \\
            --build-arg "VITE_TABLOOM_API_BASE_URL=$VITE_TABLOOM_API_BASE_URL" \\
            --build-arg "VITE_TABLOOM_CLIENT_ID=$VITE_TABLOOM_CLIENT_ID" \\
            .

      - run: az webapp restart -g "$RG" -n "$WEBAPP"

      - name: Wait for app to come up
        run: |
          url="https://$WEBAPP.azurewebsites.net/api/health"
          for i in $(seq 1 60); do
            if curl -fsS --max-time 8 "$url" > /dev/null 2>&1; then
              echo "Healthy after $((i * 5))s"
              exit 0
            fi
            sleep 5
          done
          echo "Health check did not pass within 5 min" >&2
          exit 1`}</CodePre>

          <h3>The chain visualized</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  W[deploy.yml env block] -->|env: VITE_AZURE_CLIENT_ID=...| R[GitHub runner shell]
  R -->|--build-arg VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID| A[az acr build]
  A -->|forwards as Docker --build-arg| D[Docker builder stage]
  D -->|ARG VITE_AZURE_CLIENT_ID + ENV| N[npm run build → Node]
  N -->|process.env.VITE_AZURE_CLIENT_ID| V[Vite]
  V -->|literal string substitution| B[dist/assets/index-HASH.js]
  B -->|deployed via az webapp restart| App[App Service container]`} />

          <h3>Hearth's deploy.yml (no build-args needed)</h3>
          <p>Compare with Hearth, which sidesteps the entire chain:</p>
          <CodePre>{`# SecretApp/.github/workflows/deploy.yml — verbatim build step
- name: Build image in ACR
  run: |
    az acr build \\
      --registry "$ACR" \\
      --image "$IMAGE" \\
      .`}</CodePre>

          <p>One <code>az acr build</code> with no args. The trade-off: client/tenant IDs are committed to source. For non-secret IDs (which OIDC + Federated Credential scope-locks), that's an acceptable simplification.</p>

          <h3>Tabloom's BUILD_SHA / BUILD_TIME variant</h3>
          <p>Tabloom adds two more build args — not for Vite, but for runtime identity verification:</p>
          <CodePre>{`# Tabloom/Dockerfile (runner stage)
ARG BUILD_SHA=unknown
ARG BUILD_TIME=unknown
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_TIME=$BUILD_TIME`}</CodePre>

          <p>The deploy workflow's health-check polls <code>/api/version</code> until the SHA matches the just-pushed commit. That confirms the new image is actually live (not the prev-cached one).</p>

          <h3>Why <code>az acr build</code> instead of <code>docker build</code>?</h3>
          <ul>
            <li><strong>No Docker daemon on the runner.</strong> ACR builds the image server-side; the runner just orchestrates.</li>
            <li><strong>Faster.</strong> ACR caches layers between builds across all your CI runs (shared by everything in the registry).</li>
            <li><strong>Less yak-shaving.</strong> No buildx setup, no QEMU emulation, no platform args.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 10 — VITE 8 / ROLLDOWN */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Vite 8 + Rolldown</h2>
          <p>
            Vite 8 introduced <strong>Rolldown</strong> — a Rust-port of Rollup with the same API. It's still
            opt-in-by-bundler-name (in 2026), but ShopKeep, Workshop, SecretPhoto, and sovereign-tactics are already on it.
          </p>

          <h3>What changes</h3>
          <table>
            <tbody>
              <tr><th>Aspect</th><th>Rollup (Vite ≤ 7)</th><th>Rolldown (Vite 8+)</th></tr>
              <tr><td>Implementation</td><td>JavaScript</td><td>Rust</td></tr>
              <tr><td>Build speed</td><td>1×</td><td>4–8× faster on large projects</td></tr>
              <tr><td>Memory</td><td>High (Node GC churn)</td><td>~1/3 the peak</td></tr>
              <tr><td>API</td><td>Stable</td><td>API-compatible (drop-in for most configs)</td></tr>
              <tr><td>Tree shaking</td><td>Mature</td><td>Same algorithm, ported</td></tr>
              <tr><td>Plugins</td><td>Full Rollup ecosystem</td><td>Most Rollup plugins work via shim layer</td></tr>
            </tbody>
          </table>

          <h3>How to opt in</h3>
          <p>Install <code>vite@8</code> and the matching <code>@vitejs/plugin-react@6</code>; Vite 8 ships with Rolldown enabled. No config change needed for most projects.</p>
          <CodePre>{`npm i -D vite@8 @vitejs/plugin-react@6`}</CodePre>

          <h3>What broke (in the fleet)</h3>
          <p>For ShopKeep and Workshop, the upgrade was almost free. The one wrinkle:</p>
          <ul>
            <li><strong>Some Rollup plugins</strong> that hook deep into Rollup's AST (<code>@rollup/plugin-replace</code>'s complex patterns, custom transforms) may not work yet. Vite-native plugins are unaffected.</li>
            <li><strong>Build output is byte-identical</strong> in the apps that switched (manually diffed once after upgrade). No regressions caught yet.</li>
          </ul>

          <h3>What's still on Rollup</h3>
          <p>Hearth and Cairn still ship Vite 7 + Rollup; GLP1, Puzzlebox, and Tabloom are further back on Vite 5 + Rollup. There's no urgency — Rolldown is faster, but not "you need this" faster at fleet-scale apps. Plan to migrate during the next major-version sweep.</p>

          <h3>Future — esbuild deprecation in dev</h3>
          <p>
            Vite's roadmap floats replacing esbuild with Rolldown in dev too, eliminating the dev-vs-prod bundler split.
            The benefit would be perfect parity ("if it builds in prod, it ran in dev"). Watch the Vite changelog.
          </p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Wire a New App End-to-End</h2>
          <p>Stand up a fresh Vite app with: <code>/api</code> proxy to a local Express, <code>VITE_*</code> build-args, a Dockerfile that bakes them, and a manual chunk split.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`npm create vite@latest my-app -- --template react-ts
cd my-app
npm i
npm i -D @types/node`}</CodePre>

          <h3>Step 2 — Add a backend</h3>
          <CodePre>{`npm i express

# server.js
import express from 'express';
const app = express();
app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));
app.get('/api/config', (req, res) => res.json({
  azureClientId: import.meta.env?.VITE_AZURE_CLIENT_ID ?? '(server doesnt see VITE_*)',
}));
app.listen(3001, () => console.log('Express on 3001'));`}</CodePre>

          <p>Add a <code>"server"</code> script to <code>package.json</code>:</p>
          <CodePre>{`{
  "scripts": {
    "dev":    "vite",
    "server": "node server.js",
    "build":  "tsc -b && vite build"
  }
}`}</CodePre>

          <h3>Step 3 — Configure the proxy</h3>
          <CodePre>{`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true, secure: false }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
          return undefined;
        }
      }
    }
  }
})`}</CodePre>

          <h3>Step 4 — Add a <code>VITE_*</code> var</h3>
          <CodePre>{`# .env.local — gitignored
VITE_AZURE_CLIENT_ID=00000000-0000-0000-0000-000000000000
VITE_AZURE_TENANT_ID=11111111-1111-1111-1111-111111111111`}</CodePre>

          <p>Type it:</p>
          <CodePre>{`// src/vite-env.d.ts (already exists from the template; extend it)
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_CLIENT_ID: string
  readonly VITE_AZURE_TENANT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}`}</CodePre>

          <p>Use it:</p>
          <CodePre>{`// src/App.tsx (add anywhere)
console.log('CLIENT_ID at build time:', import.meta.env.VITE_AZURE_CLIENT_ID)`}</CodePre>

          <h3>Step 5 — Run + verify</h3>
          <ol>
            <li>Terminal 1: <code>npm run server</code> (Express on :3001)</li>
            <li>Terminal 2: <code>npm run dev</code> (Vite on :5173)</li>
            <li>Open <code>http://localhost:5173</code></li>
            <li>Open DevTools, Console. You should see <code>CLIENT_ID at build time: 00000000-...</code></li>
            <li>Open <code>http://localhost:5173/api/health</code>. You should see <code>{`{"ok":true,"time":...}`}</code></li>
          </ol>

          <h3>Step 6 — Build for production</h3>
          <CodePre>{`npm run build`}</CodePre>

          <p>Inspect the output:</p>
          <CodePre>{`> ls dist/assets/
index-DA5JOZ7P.js          ← your app code
vendor-react-Bk2_pIuP.js   ← React + ReactDOM, split out
index-CXBd9F2x.css`}</CodePre>

          <p>Open <code>dist/assets/index-*.js</code> in a text editor. Search for <code>00000000-0000-0000-0000-000000000000</code>. You'll find it literally inlined — that's <code>import.meta.env.VITE_AZURE_CLIENT_ID</code> baked at build time.</p>

          <h3>Step 7 — Dockerize</h3>
          <CodePre>{`# Dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_AZURE_CLIENT_ID
ARG VITE_AZURE_TENANT_ID
ENV VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID
ENV VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY server.js ./
COPY package.json ./
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["node", "server.js"]`}</CodePre>

          <p>Build it with build-args:</p>
          <CodePre>{`docker build \\
  --build-arg VITE_AZURE_CLIENT_ID=22222222-2222-2222-2222-222222222222 \\
  --build-arg VITE_AZURE_TENANT_ID=33333333-3333-3333-3333-333333333333 \\
  -t my-app:latest \\
  .`}</CodePre>

          <p>Run it:</p>
          <CodePre>{`docker run -p 3001:3001 my-app:latest`}</CodePre>

          <p>Visit <code>http://localhost:3001</code>. You'll need Express to serve <code>dist/</code> too — add that to <code>server.js</code>:</p>
          <CodePre>{`import express from 'express';
const app = express();

// Serve static frontend
app.use(express.static('dist'));

// API routes
app.get('/api/health', (req, res) => res.json({ ok: true }));

// SPA fallback — anything not matched goes to index.html
app.get('*', (req, res) => res.sendFile(process.cwd() + '/dist/index.html'));

app.listen(3001);`}</CodePre>

          <p>Inspect the live bundle in DevTools. The client ID is the <em>second</em> one (<code>22222222-...</code>) — the build-arg overrode the dev-time <code>.env.local</code>. That's exactly the prod flow.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated the full chain: source → <code>.env.local</code> → dev server. Source →
              <code>--build-arg</code> → Docker → Vite → <code>dist/</code> → container. The same pattern five fleet
              apps use in production.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"I set <code>VITE_FOO</code> on App Service but my app doesn't see it"</h3>
          <p>App Service env vars are <em>runtime</em>; <code>VITE_*</code> vars are <em>build-time</em>. Set them as <code>--build-arg</code> in your <code>az acr build</code> step in <code>deploy.yml</code>, then rebuild and redeploy.</p>

          <h3>"<code>process.env</code> is undefined in the browser"</h3>
          <p>That's correct — <code>process.env</code> doesn't exist in a browser. Use <code>import.meta.env.VITE_FOO</code>. If you're porting from CRA, replace every <code>process.env.REACT_APP_X</code> with <code>import.meta.env.VITE_X</code>.</p>

          <h3>"<code>/api/foo</code> 404s in dev, works in prod"</h3>
          <p>You forgot to start the backend, or the proxy target is wrong. <code>npm run server</code> (or whatever the fleet repo calls it). Check the port matches <code>vite.config.ts</code>'s proxy target.</p>

          <h3>"<code>/api/foo</code> 404s in prod, works in dev"</h3>
          <p>Your prod server isn't routing <code>/api/*</code> to Express. The pattern is: Express serves <code>dist/</code> AND mounts <code>/api/*</code> routes BEFORE the SPA fallback. If the SPA fallback comes first, every request returns <code>index.html</code>.</p>

          <h3>"Build is slow / dev is slow"</h3>
          <ul>
            <li>Dev: delete <code>node_modules/.vite/</code> and restart.</li>
            <li>Build: check <code>chunkSizeWarningLimit</code> warnings — they often indicate accidental large dep imports.</li>
            <li>Both: switch to Vite 8 + Rolldown if you're on Vite 7.</li>
          </ul>

          <h3>"vendor chunk hash keeps changing on every deploy"</h3>
          <p>Your app code is dragging vendor code into the main bundle. Common causes: a barrel file (<code>index.ts</code> re-exporting everything) imports MUI; an icon library imports tree-shake-poorly; a CSS-in-JS lib gets pulled in via runtime metadata.</p>
          <p>Use <code>npx vite-bundle-visualizer</code> (a plugin) to see exactly what's in each chunk.</p>

          <h3>"<code>VITE_*</code> variable shows as <code>undefined</code> in the bundle"</h3>
          <p>The variable wasn't set at build time. Three places to check, in order:</p>
          <ol>
            <li>Was the GitHub Actions <code>env:</code> block defined?</li>
            <li>Was it passed as <code>--build-arg</code> to <code>az acr build</code>?</li>
            <li>Was it declared as both <code>ARG</code> AND <code>ENV</code> in the Dockerfile builder stage?</li>
          </ol>

          <h3>"App works in dev, broken in prod"</h3>
          <p>Most common: a dev-only dependency or import path. Run <code>npm run build &amp;&amp; npm run preview</code> locally — that replicates prod exactly. If the bug shows up there, you've isolated it to bundling. If it only shows on App Service, it's an env-var or routing thing.</p>

          <h3>"My dynamic <code>import()</code> path isn't tree-shaken"</h3>
          <p><code>import('./views/' + name)</code> can't be statically analyzed; Vite can't tell which file you'll need. Use a literal: <code>import('./views/Recipes')</code>, or build a map of imports keyed by name (Cairn's <code>EXAM_SHELLS</code> pattern).</p>

          <h3>"Native module fails to build in Docker"</h3>
          <p>You're missing <code>python3</code> / <code>make</code> / <code>g++</code> in the deps stage. Add: <code>RUN apk add --no-cache python3 make g++</code>. This is mandatory for <code>better-sqlite3</code> on Alpine — every fleet Dockerfile has it.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Lifecycle</h3>
          <table>
            <tbody>
              <tr><th>Phase</th><th>Tool</th><th>Speed</th></tr>
              <tr><td>Dev transform</td><td>esbuild (Go)</td><td>~5ms per file</td></tr>
              <tr><td>Prod bundle (Vite ≤7)</td><td>Rollup</td><td>~2–10s per build</td></tr>
              <tr><td>Prod bundle (Vite 8)</td><td>Rolldown</td><td>~500ms–2s per build</td></tr>
              <tr><td>Type-check</td><td>tsc</td><td>~1–5s (not done by Vite)</td></tr>
            </tbody>
          </table>

          <h3>Config recipes</h3>
          <CodePre>{`// Minimal:
{ plugins: [react()] }

// With proxy + manual chunks:
{ plugins: [react()], server: { proxy: { '/api': '...' } }, build: { rollupOptions: { output: { manualChunks: ... } } } }

// With Tailwind v4:
import tailwindcss from '@tailwindcss/vite'
{ plugins: [react(), tailwindcss()] }`}</CodePre>

          <h3>Env vars</h3>
          <CodePre>{`// Browser:
import.meta.env.VITE_FOO     // baked at build time
import.meta.env.MODE         // 'development' | 'production'
import.meta.env.DEV          // boolean
import.meta.env.PROD         // boolean
import.meta.env.BASE_URL     // app's base path

// Server / Vite config:
process.env.NODE_ENV
process.env.VITE_FOO         // doesn't reach the browser unless via import.meta.env

// Type it:
interface ImportMetaEnv { readonly VITE_FOO: string }
interface ImportMeta { readonly env: ImportMetaEnv }`}</CodePre>

          <h3>The Dockerfile builder-stage incantation</h3>
          <CodePre>{`FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_X
ARG VITE_Y
ENV VITE_X=$VITE_X
ENV VITE_Y=$VITE_Y
RUN npm run build`}</CodePre>

          <h3>The <code>az acr build</code> incantation</h3>
          <CodePre>{`az acr build \\
  --registry "$ACR" \\
  --image "$IMAGE" \\
  --build-arg "VITE_X=$VITE_X" \\
  --build-arg "VITE_Y=$VITE_Y" \\
  .`}</CodePre>

          <h3>Build commands</h3>
          <table>
            <tbody>
              <tr><th>Command</th><th>What it does</th></tr>
              <tr><td><code>npm run dev</code></td><td>Dev server on :5173 (or configured port)</td></tr>
              <tr><td><code>npm run build</code></td><td>tsc -b + vite build → emits dist/</td></tr>
              <tr><td><code>npm run preview</code></td><td>Serves dist/ locally (test prod build)</td></tr>
              <tr><td><code>npm run typecheck</code></td><td>tsc --noEmit (just type-check)</td></tr>
              <tr><td><code>vite --port 5174</code></td><td>Override port</td></tr>
              <tr><td><code>vite --host</code></td><td>Listen on all interfaces (for LAN testing)</td></tr>
            </tbody>
          </table>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>Object-form <code>manualChunks</code></td><td>SecretApp · <code>vite.config.ts</code></td></tr>
              <tr><td>Function-form <code>manualChunks</code></td><td>tabloom · <code>vite.config.ts</code> · ShopKeep · <code>vite.config.ts</code></td></tr>
              <tr><td>5 VITE_* build args</td><td>workshop · <code>Dockerfile</code></td></tr>
              <tr><td>Zero VITE_* build args (hardcoded)</td><td>SecretApp · <code>Dockerfile</code></td></tr>
              <tr><td>BUILD_SHA / BUILD_TIME runner args</td><td>tabloom · <code>Dockerfile</code> · <code>deploy.yml</code></td></tr>
              <tr><td><code>az acr build --build-arg</code></td><td>workshop · <code>.github/workflows/deploy.yml</code></td></tr>
              <tr><td>API proxy</td><td>Every <code>vite.config.ts</code> in the fleet</td></tr>
              <tr><td>Vite 8 + Rolldown</td><td>ShopKeep · workshop · SecretPhoto · sovereign-tactics · <code>package.json</code> (vite ≥ 8)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of Phase 1 — next up: Express 5 server patterns, then better-sqlite3.</p>
        </section>
      </main>
    </div>
  );
}
