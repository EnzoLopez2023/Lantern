import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Three Stages: deps / builder / runner', icon: '🏗️' },
  { id: 's3',  num: '3',  title: 'Base Image: Alpine + Native Modules', icon: '⚡' },
  { id: 's4',  num: '4',  title: 'npm ci vs npm install',              icon: '📦' },
  { id: 's5',  num: '5',  title: 'VITE_* Build Args',                  icon: '🔧' },
  { id: 's6',  num: '6',  title: 'BUILD_SHA Tracking',                 icon: '🏷️' },
  { id: 's7',  num: '7',  title: 'PulseWire: pnpm + non-root',         icon: '🐧' },
  { id: 's8',  num: '8',  title: '.dockerignore Discipline',           icon: '🚫' },
  { id: 's9',  num: '9',  title: 'VOLUME + Persistent Storage',        icon: '💾' },
  { id: 's10', num: '10', title: 'Layer Caching + Image Size',         icon: '🗂️' },
  { id: 's11', num: '★',  title: 'Lab: Build a Multi-Stage Image',     icon: '🛠️' },
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

export default function DockerfileGuide() {
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
            <span className="sidebar-title">Dockerfile Patterns</span>
          </div>
          <div className="sidebar-sub">node:22-alpine, multi-stage, ACR</div>
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
          <div className="hero-tag">🐳 node:22-alpine · 3 stages · 2026</div>
          <h1>Multi-Stage Dockerfile<br />Patterns</h1>
          <p>
            Nine fleet apps ship Dockerfiles to Azure Container Registry, nearly all with the same three-stage skeleton —
            <strong style={{ color: '#C77AA0' }}> deps → builder → runner</strong> — on
            <code>node:22-alpine</code> (GLP-1 is the lone holdout, still on <code>node:20-alpine</code>). Each stage does one thing; <code>COPY --from=...</code> stitches them together
            so the final image is lean. This guide pulls apart every Dockerfile in the fleet: why Alpine, why three
            stages instead of one, the <code>apk add python3 make g++</code> dance for better-sqlite3, build args for
            Vite, BUILD_SHA tracking for App Service rollback detection, PulseWire's non-root user + pnpm, and
            <code>.dockerignore</code> hygiene.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Stages</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~250MB</span><span className="hero-stat-label">Final image</span></div>
            <div className="hero-stat"><span className="hero-stat-val">9</span><span className="hero-stat-label">Fleet apps</span></div>
            <div className="hero-stat"><span className="hero-stat-val">node:22</span><span className="hero-stat-label">Base</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            A Dockerfile is a recipe for building an immutable image: a stack of "layers" (filesystem snapshots) plus
            metadata (entrypoint, ports, env vars). Docker runs the recipe top-down, caching each layer so unchanged
            ones reuse from the previous build. <strong>Multi-stage</strong> means using TWO OR MORE <code>FROM</code>
            blocks in one Dockerfile; the final image keeps only files from the LAST stage. Earlier stages do
            "scratchpad" work — build, compile, install — and only their useful outputs get copied forward.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The kitchen prep / plate</strong>. Restaurants prep ingredients in a noisy back kitchen (mise en
            place), then plate in a clean dining area. The back kitchen has knives, blood, scraps. The plate goes out
            with only the food. Multi-stage Docker is the same: the <code>builder</code> stage has compilers, build
            tools, and source code; the <code>runner</code> stage has only the cooked output.
          </p>
          <p>
            <strong>The blueprint vs the house</strong>. A blueprint describes how to build. A house is what's there.
            Dockerfile is the blueprint; the image is the house. Re-reading the blueprint doesn't change the house;
            re-running <code>docker build</code> with the same Dockerfile produces the same image (assuming caching
            and pinned base versions).
          </p>
          <p>
            <strong>Layers as transparencies</strong>. Each line in a Dockerfile adds a transparency on top. The final
            image is the stack. Order matters for caching: lines that rarely change (the base image, package install
            from a stable lockfile) go FIRST. Lines that change every commit (your source code) go LAST. That way,
            small source changes only invalidate the last few layers, not the entire pipeline.
          </p>

          <h3>Why three stages</h3>
          <table>
            <tbody>
              <tr><th>Stage</th><th>Purpose</th><th>What's in it</th></tr>
              <tr><td><code>deps</code></td><td>Install prod dependencies only</td><td>node_modules (no dev deps)</td></tr>
              <tr><td><code>builder</code></td><td>Build the frontend bundle</td><td>Source code, all deps, /app/dist</td></tr>
              <tr><td><code>runner</code></td><td>Production image</td><td>Backend code + prod node_modules + dist</td></tr>
            </tbody>
          </table>

          <p>The runner copies <code>node_modules</code> from <strong>deps</strong> (prod-only) and <code>dist/</code> from <strong>builder</strong> (the built frontend). Dev dependencies (Vite, TypeScript, ESLint) never leak into prod. Image stays small.</p>

          <h3>The fleet Dockerfiles</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Base</th><th>Stages</th><th>Special</th></tr>
              <tr><td>SecretApp (Hearth)</td><td>node:22-alpine</td><td>3 (deps, builder, runner)</td><td>Hardcoded Entra IDs, no build args</td></tr>
              <tr><td>ShopKeep</td><td>node:22-alpine</td><td>3</td><td>VITE_AZURE_* build args</td></tr>
              <tr><td>Tabloom</td><td>node:22-alpine</td><td>3</td><td>BUILD_SHA + BUILD_TIME tracking</td></tr>
              <tr><td>PulseWire</td><td>node:22-alpine</td><td>3</td><td>pnpm + non-root user + worker bundle</td></tr>
              <tr><td>Cairn</td><td>node:22-alpine</td><td>3</td><td>Similar to ShopKeep</td></tr>
              <tr><td>Puzzlebox</td><td>node:22-alpine</td><td>3</td><td>Parameterized base-image arg (avoids Docker Hub rate limits)</td></tr>
              <tr><td>SecretPhoto</td><td>node:22-alpine</td><td>3</td><td><code>apk add vips-dev</code> for sharp thumbnails; VOLUME mounts for photos + thumbs</td></tr>
              <tr><td>Workshop</td><td>node:22-alpine</td><td>3</td><td>5 VITE_* build args (Tailwind v4 SPA)</td></tr>
              <tr><td>GLP-1 (Tare)</td><td><strong>node:20-alpine</strong></td><td>3</td><td>Fleet outlier — still on Node 20; candidate for a bump</td></tr>
            </tbody>
          </table>

          <p>Five apps, one pattern. Differences are tactical, not architectural.</p>

          <h3>The deploy pipeline</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  G[git push main] --> GH[GitHub Actions]
  GH --> ACR[Azure Container Registry<br/>builds the image]
  ACR --> AS[App Service]
  AS --> RES[az webapp restart]
  RES --> POLL[Poll /api/test until healthy]
  style ACR fill:#5C2A4A,color:#fff
  style AS fill:#5C2A4A,color:#fff`} />

          <p>For SecretApp specifically: push triggers ACR build (server-side, not in CI runner), then a webapp restart, then health polling for ~4-6 minutes total. The CI runner doesn't build the image itself — it asks ACR to.</p>

          <h3>Why Alpine</h3>
          <p>Three choices for Node base image:</p>
          <ul>
            <li><strong>node:22-alpine</strong> (~50MB base, what the fleet uses)</li>
            <li><strong>node:22-slim</strong> / <strong>node:22-bookworm-slim</strong> (~120MB base, Debian-based)</li>
            <li><strong>node:22</strong> (~400MB base, full Debian)</li>
          </ul>

          <p>Alpine wins on size. The tradeoff: Alpine uses musl libc instead of glibc, which sometimes breaks native modules. The fleet works around this by installing build tools in the stages that need them (more in §3).</p>

          <h3>What you get with multi-stage</h3>
          <ul>
            <li><strong>Smaller image</strong> — no compilers, no source, no dev deps in prod.</li>
            <li><strong>Faster cold pulls</strong> — App Service pulls from ACR; smaller image = faster cold start.</li>
            <li><strong>Layer caching</strong> — if you change source but not package.json, npm install layer reuses.</li>
            <li><strong>Security</strong> — fewer binaries in prod = fewer CVE surfaces.</li>
            <li><strong>Reproducibility</strong> — Dockerfile pinned to specific Node version + lockfile = same image every time.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 2 — THREE STAGES */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Three Stages: deps / builder / runner</h2>
          <p>Hearth's Dockerfile is the cleanest version of the pattern. Read it top to bottom.</p>

          <h3>The full file</h3>
          <CodePre>{`# secretapp/Dockerfile — verbatim
# Built and pushed to Azure Container Registry by GitHub Actions on every
# push to main. See .github/workflows/deploy.yml.
#
# msalConfig.ts hardcodes the Entra client/tenant IDs (unlike Workshop/
# ShopKeep/GLP-1) so there are NO Vite build-args needed here.

FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY server.js      ./
COPY schema.sql     ./
COPY package.json   ./
COPY lib            ./lib
COPY routes         ./routes

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/hearth.db

EXPOSE 3001

VOLUME ["/data"]

CMD ["node", "server.js"]`}</CodePre>

          <h3>Stage 1: deps</h3>
          <CodePre>{`FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev`}</CodePre>

          <p>Goal: install <strong>production-only</strong> dependencies (i.e., everything in <code>dependencies</code>, NOT <code>devDependencies</code>). The resulting <code>node_modules</code> is what the runner stage will use.</p>

          <p>Why <code>apk add python3 make g++</code>: <code>better-sqlite3</code> is a native module. It downloads C++ source, compiles it with <code>node-gyp</code>, which needs Python, make, and a C++ compiler. Alpine doesn't ship these by default — they get installed in the dep stage so the install can compile native modules.</p>

          <p><code>--no-cache</code>: don't keep the apk package index. Saves a few MB.</p>

          <p><code>COPY package*.json ./</code>: copies <code>package.json</code> AND <code>package-lock.json</code>. The lockfile is essential — without it, <code>npm install</code> resolves versions fresh, which is non-deterministic.</p>

          <p><code>--omit=dev</code>: skip devDependencies. Vite, TypeScript, ESLint, etc. are not needed at runtime.</p>

          <h3>Stage 2: builder</h3>
          <CodePre>{`FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build`}</CodePre>

          <p>Goal: produce the built frontend (<code>dist/</code>). Needs ALL deps, including dev (Vite is in devDependencies). So <code>npm install</code> with no <code>--omit</code>.</p>

          <p><code>COPY . .</code> after <code>npm install</code>: this is the layer-caching trick. If you change a source file but NOT package.json, the <code>npm install</code> layer is cached — Docker reuses it. If you change package.json, the install re-runs. Order matters.</p>

          <p><code>RUN npm run build</code>: runs the Vite build, producing <code>dist/</code>. This is the artifact the runner needs.</p>

          <h3>Stage 3: runner</h3>
          <CodePre>{`FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY server.js      ./
COPY schema.sql     ./
COPY package.json   ./
COPY lib            ./lib
COPY routes         ./routes

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/hearth.db

EXPOSE 3001

VOLUME ["/data"]

CMD ["node", "server.js"]`}</CodePre>

          <p>Goal: lean production image. The base is fresh <code>node:22-alpine</code> — no build tools, no dev deps, nothing from the build environment.</p>

          <p><code>COPY --from=deps /app/node_modules</code>: bring in the prod-only node_modules from stage 1.</p>

          <p><code>COPY --from=builder /app/dist</code>: bring in the built frontend from stage 2.</p>

          <p>Then explicit copies of backend files: <code>server.js</code>, <code>schema.sql</code>, <code>package.json</code>, <code>lib/</code>, <code>routes/</code>. The runner is the union of these.</p>

          <p>What's NOT in the runner: TypeScript sources, Vite config, ESLint config, tests, README, design docs. All trimmed via <code>.dockerignore</code> (§8) and the explicit-copy pattern.</p>

          <h3>The ENV / EXPOSE / VOLUME / CMD trio</h3>
          <ul>
            <li><strong><code>ENV NODE_ENV=production</code></strong>: tells Express + other libraries to use production paths.</li>
            <li><strong><code>ENV PORT=3001</code></strong>: the port Express listens on.</li>
            <li><strong><code>ENV DB_PATH=/data/hearth.db</code></strong>: SQLite file location inside the container (paired with VOLUME).</li>
            <li><strong><code>EXPOSE 3001</code></strong>: documentation only — Docker doesn't enforce, but App Service reads this to know where to route HTTP.</li>
            <li><strong><code>VOLUME ["/data"]</code></strong>: mount point for persistent storage (§9).</li>
            <li><strong><code>CMD ["node", "server.js"]</code></strong>: the process to run. Exec form (array) — no shell wrapper, so signals (SIGTERM) reach Node directly.</li>
          </ul>

          <h3>Image size at the end</h3>
          <p>For Hearth: ~250 MB (Alpine base 50MB + Node 22 ~80MB + node_modules ~120MB). That's the production cost. Compare:</p>
          <ul>
            <li>One-stage Dockerfile (everything in one FROM): ~600 MB (includes dev deps, build tools, source).</li>
            <li>Three-stage Alpine: ~250 MB.</li>
            <li>Three-stage Debian-slim: ~320 MB.</li>
            <li>Three-stage full Debian: ~600 MB.</li>
          </ul>

          <p>Alpine + multi-stage = 2.4× smaller than naive. Worth the complexity.</p>
        </section>

        <hr />

        {/* SECTION 3 — ALPINE NATIVE */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Base Image: Alpine + Native Modules</h2>
          <p>Alpine is small but has rough edges. Native modules are where they show up.</p>

          <h3>Alpine vs glibc-based images</h3>
          <p>Alpine uses <strong>musl libc</strong>, an alternative to <strong>glibc</strong>. They're API-compatible at the C level but subtly different. For pure-JS packages, no difference. For native modules (C/C++ compiled to .node files), it matters:</p>
          <ul>
            <li>npm prebuilt binaries are usually compiled against glibc.</li>
            <li>Alpine can't load glibc binaries.</li>
            <li>So Alpine has to COMPILE FROM SOURCE.</li>
            <li>Which requires Python (for node-gyp), make, g++, sometimes more.</li>
          </ul>

          <h3>The apk add line</h3>
          <CodePre>{`RUN apk add --no-cache python3 make g++`}</CodePre>

          <p>Three packages:</p>
          <ul>
            <li><code>python3</code> — required by node-gyp (the build tool for native modules).</li>
            <li><code>make</code> — runs the Makefiles node-gyp generates.</li>
            <li><code>g++</code> — compiles the C++ source.</li>
          </ul>

          <p>For some packages you also need <code>libc6-compat</code> (musl compatibility shim for glibc-only binaries):</p>
          <CodePre>{`RUN apk add --no-cache libc6-compat python3 make g++`}</CodePre>

          <p>PulseWire uses this because its dependency tree pulls in some packages that ship only glibc binaries.</p>

          <h3>Which native modules the fleet uses</h3>
          <table>
            <tbody>
              <tr><th>Module</th><th>Native?</th><th>Apps</th></tr>
              <tr><td>better-sqlite3</td><td>Yes (C++)</td><td>SecretApp, ShopKeep, Tabloom</td></tr>
              <tr><td>sharp</td><td>Yes (libvips)</td><td>Tabloom, SecretPhoto (image processing / thumbnails)</td></tr>
              <tr><td>node-gyp</td><td>Build tool</td><td>(transitive, called by other modules)</td></tr>
              <tr><td>bcrypt</td><td>Yes</td><td>None in fleet</td></tr>
            </tbody>
          </table>

          <h3>Why install build tools in BOTH deps AND builder</h3>
          <p>Same Dockerfile has <code>apk add python3 make g++</code> twice — once in deps, once in builder. Why?</p>

          <p>Because deps and builder are SEPARATE STAGES, each starting from a fresh <code>node:22-alpine</code> base. The apk installations from deps don't carry over to builder (or runner). Each stage that needs build tools must install them.</p>

          <p>The runner doesn't need them — by the time it copies node_modules in, the native modules are already compiled. No build needed at runtime.</p>

          <h3>The "I see Python is required but not installed" error</h3>
          <CodePre>{`# error: gyp ERR! find Python You need to install the latest version of Python.
# error: gyp ERR! stack Error: Could not find any Python installation to use`}</CodePre>

          <p>Means: you tried to <code>npm install</code> on Alpine without first installing python3. Add the <code>apk add python3 make g++</code> line above the install.</p>

          <h3>The "musl vs glibc" error</h3>
          <CodePre>{`# Error loading shared library libstdc++.so.6: No such file or directory`}</CodePre>

          <p>Means: the package shipped a glibc binary that musl can't load. Two fixes:</p>
          <ol>
            <li>Add <code>libc6-compat</code>: <code>apk add libc6-compat</code></li>
            <li>Switch to a glibc base image: <code>FROM node:22-bookworm-slim</code></li>
          </ol>

          <p>For most packages, libc6-compat is enough. For complex native stacks (TensorFlow.js, ONNX), bookworm-slim is safer.</p>

          <h3>Image-size tradeoff</h3>
          <p>Alpine + multi-stage gets you ~250MB. Bookworm-slim + multi-stage gets you ~320MB. The 70MB savings is real but not huge. Pick based on your dependency tree's musl-compatibility:</p>
          <ul>
            <li>Pure-JS + better-sqlite3 + sharp: Alpine is fine.</li>
            <li>ML libraries, Puppeteer, complex native stacks: bookworm-slim is safer.</li>
          </ul>

          <h3>Building for ARM (M1/M2 Macs)</h3>
          <p>If you develop on Apple Silicon and deploy to x86 App Service:</p>
          <CodePre>{`docker buildx build --platform linux/amd64 -t myapp .`}</CodePre>

          <p>Without <code>--platform linux/amd64</code>, your local build is arm64 and won't run on App Service. You can also let ACR build it (which is x86 native) — what the fleet does via GitHub Actions.</p>
        </section>

        <hr />

        {/* SECTION 4 — NPM CI */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>npm ci vs npm install</h2>
          <p>Two commands. Same goal: populate <code>node_modules</code>. Critical differences for Dockerfile builds.</p>

          <h3>npm install (Hearth's choice)</h3>
          <CodePre>{`COPY package*.json ./
RUN npm install --omit=dev`}</CodePre>

          <p>Behavior:</p>
          <ul>
            <li>If <code>node_modules</code> exists, updates it.</li>
            <li>If <code>package-lock.json</code> exists, follows it for already-listed packages.</li>
            <li>If a dependency in <code>package.json</code> has been updated (<code>"react": "^19.0.0"</code> and 19.0.1 exists), MAY install the newer version.</li>
            <li>Can update <code>package-lock.json</code> during install.</li>
          </ul>

          <p>Risk in CI/Docker: non-deterministic. Two builds days apart might install different exact versions if patch versions were released.</p>

          <h3>npm ci (ShopKeep, Tabloom's choice)</h3>
          <CodePre>{`COPY package*.json ./
RUN npm ci --omit=dev`}</CodePre>

          <p>Behavior:</p>
          <ul>
            <li>REQUIRES <code>package-lock.json</code> to exist.</li>
            <li>Deletes existing <code>node_modules</code> first.</li>
            <li>Installs EXACTLY what the lockfile says.</li>
            <li>Errors if <code>package.json</code> and lockfile disagree.</li>
            <li>NEVER updates the lockfile.</li>
            <li>2x faster than <code>npm install</code> in CI (no resolution work).</li>
          </ul>

          <p>Deterministic. Recommended for Dockerfile builds.</p>

          <h3>Why the fleet has both</h3>
          <p>SecretApp's Dockerfile predates the team's awareness of <code>npm ci</code>. Functionally it works because both apps have committed lockfiles and stable dependency trees. ShopKeep and Tabloom (newer) use <code>npm ci</code>.</p>

          <p>Recommendation: always <code>npm ci</code> for Docker builds. Faster, deterministic, fails loudly on drift.</p>

          <h3>The --omit=dev flag</h3>
          <p>Skips packages in <code>devDependencies</code>. For prod containers, you don't need Vite, ESLint, TypeScript, etc. — they were only needed for the build step in the <code>builder</code> stage.</p>

          <p>Quick check: what's in dev vs prod?</p>
          <CodePre>{`{
  "dependencies": {
    "express": "^5.0.0",         // ← needed at runtime
    "better-sqlite3": "^11.3.0", // ← needed at runtime
    "jose": "^5.0.0"             // ← needed at runtime
  },
  "devDependencies": {
    "vite": "^8.0.0",            // ← only for build
    "typescript": "^5.9.0",      // ← only for typecheck
    "eslint": "^9.0.0",          // ← only for lint
    "@types/express": "^5.0.0"   // ← only for typecheck
  }
}`}</CodePre>

          <p>Audit periodically — packages drift into the wrong section. Sharp, multer, axios — these belong in <code>dependencies</code>. Vitest, prettier, husky — these belong in <code>devDependencies</code>.</p>

          <h3>--frozen-lockfile (pnpm equivalent)</h3>
          <p>PulseWire uses pnpm, with its own flag:</p>
          <CodePre>{`RUN pnpm install --frozen-lockfile`}</CodePre>

          <p>Same semantics as <code>npm ci</code>: error if lockfile + package.json disagree, install exactly what the lockfile says, no surprises.</p>

          <h3>Lockfile hygiene</h3>
          <ul>
            <li><strong>Commit it.</strong> <code>package-lock.json</code> / <code>pnpm-lock.yaml</code> / <code>yarn.lock</code> all belong in git.</li>
            <li><strong>Don't manually edit it.</strong> Run <code>npm install</code> locally to regenerate.</li>
            <li><strong>Resolve merge conflicts by re-running install.</strong> Don't try to merge JSON.</li>
            <li><strong>If <code>npm ci</code> errors</strong>, your lockfile is out of sync with package.json. Run <code>npm install</code> locally + commit.</li>
          </ul>

          <h3>Cache mounts (BuildKit feature)</h3>
          <CodePre>{`# Cache the npm cache directory across builds
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev`}</CodePre>

          <p>
            With BuildKit (Docker 20.10+), you can cache directories between builds. The npm cache (<code>~/.npm</code>)
            holds downloaded tarballs — caching it makes incremental builds much faster. The fleet doesn't use this
            because ACR caches layers anyway, but it's a nice optimization for local builds.
          </p>
        </section>

        <hr />

        {/* SECTION 5 — VITE BUILD ARGS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>VITE_* Build Args</h2>
          <p>Vite bakes <code>VITE_*</code> env vars into the bundle at BUILD TIME, not RUN TIME. They have to be available during <code>npm run build</code>. Dockerfile <code>ARG</code> + <code>ENV</code> is how you pass them in.</p>

          <h3>ShopKeep's pattern</h3>
          <CodePre>{`# shopkeep/Dockerfile (excerpt)
FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# VITE_* vars are baked into the bundle at build time — pass them as build args
ARG VITE_AZURE_CLIENT_ID
ARG VITE_AZURE_TENANT_ID
ENV VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID
ENV VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID

RUN npm run build`}</CodePre>

          <h3>ARG vs ENV</h3>
          <p>Two different things:</p>
          <ul>
            <li><strong><code>ARG</code></strong>: build-time variable. Set via <code>docker build --build-arg NAME=value</code>. Available during <code>RUN</code> commands. NOT in the final image's env.</li>
            <li><strong><code>ENV</code></strong>: env var both during build AND in the final running container.</li>
          </ul>

          <p>The fleet pattern: declare <code>ARG</code>, copy it to <code>ENV</code>. Why? Because Vite reads from <code>process.env.VITE_X</code>, so the build needs it as an ENV. The ARG version is what gets passed in from outside; the ENV version is what Vite consumes.</p>

          <h3>How to pass them</h3>
          <CodePre>{`# Local
docker build \\
  --build-arg VITE_AZURE_CLIENT_ID=abc-123 \\
  --build-arg VITE_AZURE_TENANT_ID=xyz-789 \\
  -t myapp .

# Azure Container Registry (server-side build)
az acr build -r myregistry -t myapp:latest \\
  --build-arg VITE_AZURE_CLIENT_ID=abc-123 \\
  --build-arg VITE_AZURE_TENANT_ID=xyz-789 \\
  .

# GitHub Actions (calls az acr build)
- name: Build image
  run: |
    az acr build -r \${{ vars.ACR_NAME }} -t \${{ env.IMAGE_TAG }} \\
      --build-arg VITE_AZURE_CLIENT_ID=\${{ secrets.VITE_AZURE_CLIENT_ID }} \\
      --build-arg VITE_AZURE_TENANT_ID=\${{ secrets.VITE_AZURE_TENANT_ID }} \\
      .`}</CodePre>

          <h3>Why Hearth doesn't have build args</h3>
          <p>SecretApp hardcodes its Entra client ID + tenant ID in <code>msalConfig.ts</code>:</p>
          <CodePre>{`// secretapp/src/msalConfig.ts (sketch)
export const msalConfig = {
  auth: {
    clientId: 'a3f2c8e1-91b3-4f1c-9d2e-1234567890ab',  // hardcoded
    tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
  },
}`}</CodePre>

          <p>The values aren't secrets — they're public identifiers. Hardcoding them means no build args, no environment setup, fewer moving parts. ShopKeep + others use build args because they want to deploy the same image to multiple environments with different Entra configs.</p>

          <h3>Security: build args ARE visible in the image</h3>
          <p>Build args you used during <code>RUN</code> can be inspected:</p>
          <CodePre>{`docker history myapp --no-trunc`}</CodePre>

          <p>Each RUN command shows what was executed. If you passed a secret as <code>--build-arg API_KEY=...</code>, it appears in the build history.</p>

          <p>So: NEVER pass secrets as build args. Use them only for non-sensitive config (client IDs, tenant IDs, public URLs). For real secrets, use App Service env vars + KV references (see the Key Vault guide).</p>

          <h3>The Vite build process</h3>
          <p>During <code>npm run build</code>:</p>
          <ol>
            <li>Vite reads <code>process.env.VITE_*</code>.</li>
            <li>It SUBSTITUTES occurrences of <code>import.meta.env.VITE_X</code> in source code with the actual value.</li>
            <li>It writes the result to <code>dist/</code>.</li>
          </ol>

          <p>By the time runtime happens, the values are baked into the JS bundles. If you change a Vite env var, you must rebuild the image. There's no "edit App Service config and it just works" — that only works for SERVER-SIDE env vars.</p>

          <h3>Multiple environments — one approach</h3>
          <p>If you have dev/staging/prod with different Vite configs:</p>
          <ul>
            <li>Three separate image tags: <code>myapp:dev</code>, <code>myapp:staging</code>, <code>myapp:prod</code>.</li>
            <li>Each built with its own build args.</li>
            <li>Each App Service points to its own tag.</li>
          </ul>

          <p>You can't switch an existing image between environments — Vite already baked in the values.</p>
        </section>

        <hr />

        {/* SECTION 6 — BUILD SHA */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>BUILD_SHA Tracking</h2>
          <p>Tabloom's Dockerfile tracks the git SHA + build time so the deploy workflow can verify the new container actually took over. Worth understanding because App Service sometimes silently rolls back.</p>

          <h3>The Dockerfile additions</h3>
          <CodePre>{`# tabloom/Dockerfile (excerpt)
FROM node:22-alpine AS runner
# ... copies, env vars ...

# Build identity - surfaced via /api/version so the deploy workflow can
# verify the new container actually took over (App Service silently rolls
# back to the old container on warmup failure).
ARG BUILD_SHA=unknown
ARG BUILD_TIME=unknown
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_TIME=$BUILD_TIME`}</CodePre>

          <h3>How they get set</h3>
          <CodePre>{`# In GitHub Actions
az acr build \\
  -r myregistry \\
  -t myapp:latest \\
  --build-arg BUILD_SHA=\${GITHUB_SHA} \\
  --build-arg BUILD_TIME=\$(date -u +%FT%TZ) \\
  .`}</CodePre>

          <p><code>GITHUB_SHA</code> is the commit hash that triggered the workflow. <code>BUILD_TIME</code> is when the image was built.</p>

          <h3>The /api/version endpoint</h3>
          <CodePre>{`// tabloom/server.js (sketch)
app.get('/api/version', (req, res) => {
  res.json({
    buildSha: process.env.BUILD_SHA || 'unknown',
    buildTime: process.env.BUILD_TIME || 'unknown',
    nodeVersion: process.version,
    uptime: process.uptime(),
  })
})`}</CodePre>

          <p>Public endpoint, no auth — so the deploy workflow can poll it during health checks.</p>

          <h3>Why this matters: App Service silent rollback</h3>
          <p>When App Service pulls a new image:</p>
          <ol>
            <li>It downloads the new image.</li>
            <li>It starts a new container.</li>
            <li>It waits for the new container to respond to health probes.</li>
            <li>If the new container fails to start within ~5 minutes, App Service KEEPS THE OLD CONTAINER RUNNING.</li>
            <li>The deploy command returns "success" — but the old code is still serving traffic.</li>
          </ol>

          <p>This is silent and dangerous. You think you deployed; the user is still on yesterday's bug.</p>

          <h3>The verification flow</h3>
          <CodePre>{`# In GitHub Actions, after az webapp restart:
EXPECTED_SHA=\${GITHUB_SHA}

for i in {1..60}; do
  ACTUAL=\$(curl -s https://myapp.azurewebsites.net/api/version | jq -r .buildSha)
  if [[ "\$ACTUAL" == "\$EXPECTED_SHA" ]]; then
    echo "Deploy verified: \$ACTUAL"
    exit 0
  fi
  echo "Waiting for new container (attempt \$i): saw \$ACTUAL, expected \$EXPECTED_SHA"
  sleep 10
done

echo "TIMEOUT: new container never took over"
exit 1`}</CodePre>

          <p>Poll <code>/api/version</code> for up to 10 minutes. If you ever see the expected SHA, deploy is good. If you never see it, App Service silently rolled back — fail the workflow.</p>

          <h3>The pattern is fleet-wide</h3>
          <p>SecretApp has a similar <code>/api/test</code> endpoint that the GitHub workflow polls until healthy (~4–6 min). The polling pattern is the same; the difference is that Hearth's workflow checks "responds at all" not "responds with expected SHA."</p>

          <p>Stronger guarantee: SHA verification. Weaker guarantee: just-responds. Pick based on how often you've been bitten by silent rollback.</p>

          <h3>Why BUILD_TIME too</h3>
          <p>Two scenarios:</p>
          <ul>
            <li>You rebuilt the same SHA after a registry bug — BUILD_TIME differs.</li>
            <li>The SHA verification passes but you want extra confidence — BUILD_TIME confirms it's recent.</li>
          </ul>

          <p>Operationally minor; useful for forensics.</p>

          <h3>Adding it to a new app</h3>
          <ol>
            <li>Add <code>ARG BUILD_SHA=unknown</code> + <code>ENV BUILD_SHA=$BUILD_SHA</code> to the runner stage.</li>
            <li>Pass <code>--build-arg BUILD_SHA=$GITHUB_SHA</code> in the build command.</li>
            <li>Add a <code>/api/version</code> endpoint that returns <code>process.env.BUILD_SHA</code>.</li>
            <li>Add SHA-polling to the deploy workflow.</li>
          </ol>

          <p>15 minutes of work. Catches a class of silent-failure bugs that App Service has not solved on its own.</p>
        </section>

        <hr />

        {/* SECTION 7 — PULSEWIRE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>PulseWire: pnpm + non-root</h2>
          <p>PulseWire's Dockerfile is the most elaborate in the fleet. Three key differences: pnpm instead of npm, a non-root user, and a separate worker bundle. Worth reading because it's what production-grade Node + Next.js images look like.</p>

          <h3>The full Dockerfile</h3>
          <CodePre>{`# pulsewire/Dockerfile — verbatim
# Stage 1: Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the Next.js app AND the worker bundle
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG GIT_SHA=dev
ENV GIT_SHA=$GIT_SHA
ENV SKIP_ENV_VALIDATION=1
RUN pnpm build
RUN pnpm worker:build

# Stage 3: Production image
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache tzdata && \\
    addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/scripts/launch-prod.mjs ./launch-prod.mjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=America/New_York
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ARG GIT_SHA=dev
ENV GIT_SHA=$GIT_SHA

USER nextjs
EXPOSE 3000

CMD ["node", "launch-prod.mjs"]`}</CodePre>

          <h3>pnpm + corepack</h3>
          <p><code>corepack enable</code> activates the bundled package-manager management in Node 22. After it, <code>pnpm</code> commands work without a separate install.</p>

          <p>Why pnpm over npm:</p>
          <ul>
            <li><strong>Disk efficiency</strong>: pnpm uses a content-addressable store with hard links. Same package never duplicated across projects.</li>
            <li><strong>Strict resolution</strong>: pnpm enforces that packages can only import their declared dependencies. No accidental "works because something else pulls it in."</li>
            <li><strong>Workspace support</strong>: monorepo-friendly out of the box (PulseWire is a monorepo with the worker as a sub-package).</li>
            <li><strong>Fast</strong>: ~2x faster than npm in cold installs.</li>
          </ul>

          <p>For new apps, pnpm is a reasonable default. The fleet has mixed adoption.</p>

          <h3>libc6-compat</h3>
          <p>Why PulseWire needs it but SecretApp doesn't:</p>
          <ul>
            <li>PulseWire's Next.js standalone build includes some packages that ship glibc-only binaries.</li>
            <li>SecretApp's dependencies don't.</li>
          </ul>

          <p>The Alpine images are too small to include glibc compatibility by default. <code>libc6-compat</code> is the workaround.</p>

          <h3>The non-root user</h3>
          <CodePre>{`RUN apk add --no-cache tzdata && \\
    addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# ...
USER nextjs`}</CodePre>

          <p>Three steps:</p>
          <ol>
            <li>Create a system group and user (named <code>nextjs</code> here).</li>
            <li>Copy files with <code>--chown=nextjs:nodejs</code> so the user can read them.</li>
            <li><code>USER nextjs</code>: switch the container's runtime user to non-root.</li>
          </ol>

          <p>Why: defense in depth. If the Node process is compromised (RCE in a dep), the attacker has only <code>nextjs</code> user permissions — can read app files, can write to <code>/tmp</code>, but cannot install system packages, modify <code>/etc</code>, escalate privileges. The container's blast radius shrinks.</p>

          <p>The other fleet apps don't bother with non-root because they're behind Entra ID gates and the threat model is "trusted user, careless dependency" not "external attacker, RCE chain." For public-facing services, non-root is mandatory.</p>

          <h3>UID 1001</h3>
          <p>Why <code>--uid 1001</code> specifically?</p>
          <ul>
            <li>0–999: reserved for system users (root, daemon, sshd, etc.).</li>
            <li>1000+: human users by convention.</li>
            <li>Using a high numeric UID (1001) avoids conflicts with whatever's on the host.</li>
            <li>The number itself is arbitrary; consistency across fleet is the point.</li>
          </ul>

          <h3>tzdata</h3>
          <p><code>apk add tzdata</code> + <code>ENV TZ=America/New_York</code> means log timestamps + date-fns formatting use the operator's timezone. Without it, the container is UTC, and logs are confusing to read in local context.</p>

          <p>Cost: ~1.5MB. Worth it.</p>

          <h3>SKIP_ENV_VALIDATION</h3>
          <CodePre>{`ENV SKIP_ENV_VALIDATION=1`}</CodePre>

          <p>PulseWire uses <code>@t3-oss/env-nextjs</code> for runtime env var validation. The validator runs at build time too — but build time doesn't have the secrets (those come from KV references at runtime). So skip validation during build, validate at app boot instead.</p>

          <p>The <code>SKIP_ENV_VALIDATION</code> flag is specific to @t3-oss/env-nextjs. Other validators (zod schemas at boot) don't need this dance.</p>

          <h3>Next.js standalone output</h3>
          <CodePre>{`COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static`}</CodePre>

          <p>Next.js 12+ can produce a "standalone" build — a minimal directory containing just what's needed to serve the app. No <code>node_modules</code> outside of what's actually used. The standalone directory is what gets copied; static assets and public files come separately.</p>

          <p>Result: PulseWire's image is ~180MB despite being a Next.js app (vs ~400MB for a naive Next.js Dockerfile).</p>

          <h3>The launch-prod.mjs CMD</h3>
          <CodePre>{`CMD ["node", "launch-prod.mjs"]`}</CodePre>

          <p>PulseWire launches a custom script instead of <code>node server.js</code>. The script starts both the Next.js server AND the graphile-worker process. One container, two processes. Covered in detail in the graphile-worker guide.</p>
        </section>

        <hr />

        {/* SECTION 8 — DOCKERIGNORE */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>.dockerignore Discipline</h2>
          <p>The <code>.dockerignore</code> file decides what gets sent to the Docker build context. Things excluded never reach the build — even via <code>COPY . .</code>. Essential for keeping images small and builds fast.</p>

          <h3>SecretApp's .dockerignore</h3>
          <CodePre>{`# secretapp/.dockerignore (verbatim)
node_modules
dist
.git
*.db
*.db-wal
*.db-shm
.env*
*.log
logs/
Plex Logs/`}</CodePre>

          <h3>Tabloom's .dockerignore</h3>
          <CodePre>{`# tabloom/.dockerignore (verbatim)
node_modules
dist
.git
.gitignore
.vscode
.idea
.DS_Store
.claude
design_handoff_tabloom
.vite
*.log
*.local
.env
.env.local
.env.*.local
**/*.test.ts
**/*.test.tsx
*.swp
*.swo`}</CodePre>

          <h3>Why each entry matters</h3>
          <table>
            <tbody>
              <tr><th>Entry</th><th>Why exclude</th></tr>
              <tr><td><code>node_modules</code></td><td>Local install is wrong arch / dev deps. Re-installed in deps stage.</td></tr>
              <tr><td><code>dist</code></td><td>Local build artifacts. Re-built in builder stage.</td></tr>
              <tr><td><code>.git</code></td><td>Build doesn't need git history. Saves MB.</td></tr>
              <tr><td><code>*.db</code> + <code>*.db-wal</code> + <code>*.db-shm</code></td><td>Local SQLite files. Could leak data.</td></tr>
              <tr><td><code>.env*</code></td><td>Local secrets. Critical security exclusion.</td></tr>
              <tr><td><code>*.log</code></td><td>Verbose, irrelevant.</td></tr>
              <tr><td><code>.vscode</code> / <code>.idea</code></td><td>IDE config. Not for production.</td></tr>
              <tr><td><code>.claude</code></td><td>Claude Code agent state. Not for production.</td></tr>
              <tr><td><code>*.test.ts</code></td><td>Test files. Not for production.</td></tr>
              <tr><td><code>.DS_Store</code></td><td>macOS Finder cruft.</td></tr>
              <tr><td><code>*.swp</code> / <code>*.swo</code></td><td>Vim swap files.</td></tr>
            </tbody>
          </table>

          <h3>The .env exclusion is critical</h3>
          <p>
            If you have <code>.env</code> with real secrets and you forget to <code>.dockerignore</code> it, those
            secrets get baked into the image — and ANYONE who can pull the image can extract them. A common
            embarrassment in early-stage projects.
          </p>

          <p>Defense:</p>
          <ol>
            <li>Always include <code>.env*</code> in <code>.dockerignore</code>.</li>
            <li>Verify with <code>docker run -it myapp ls -la</code> after build.</li>
            <li>For really paranoid: use git-secrets / pre-commit hooks to block <code>.env</code> from ever being committed.</li>
          </ol>

          <h3>The build context size</h3>
          <p>Every file NOT excluded gets sent to Docker. For a typical app:</p>
          <ul>
            <li>Without <code>.dockerignore</code>: 300MB+ (includes <code>node_modules</code>, <code>.git</code>, build outputs).</li>
            <li>With proper <code>.dockerignore</code>: 5–15MB.</li>
            <li>Send time: 5MB in 100ms; 300MB in 60s+. The size affects every build.</li>
          </ul>

          <h3>Negative patterns</h3>
          <p>You can re-include after excluding:</p>
          <CodePre>{`# Exclude all node_modules
node_modules

# But re-include just one
!node_modules/@my-package/critical-file.json`}</CodePre>

          <p>Rare; included for completeness. The fleet doesn't use negative patterns.</p>

          <h3>Comparing .dockerignore + .gitignore</h3>
          <p>Often the same content, but not always:</p>
          <ul>
            <li>Both: <code>node_modules</code>, <code>dist</code>, <code>.env*</code>, <code>*.log</code>.</li>
            <li><strong>.dockerignore</strong> usually adds: <code>.git</code>, test files, IDE configs.</li>
            <li><strong>.gitignore</strong> usually adds: editor swap files (but Docker copies what git tracks; if it's not tracked it might still be in the context).</li>
          </ul>

          <p>You can have them be identical; many teams do. Tabloom's are deliberately different (more exclusions in Docker, fewer in git).</p>

          <h3>The Docker glob</h3>
          <p><code>.dockerignore</code> uses gitignore-style glob:</p>
          <ul>
            <li><code>*.log</code> — any .log at any level</li>
            <li><code>**/*.test.ts</code> — any .test.ts in any subdirectory (explicit recursive)</li>
            <li><code>logs/</code> — the logs directory and its contents</li>
            <li><code>!keep.log</code> — re-include this specific file</li>
          </ul>

          <h3>Verifying after build</h3>
          <CodePre>{`# What's in the image?
docker run --rm -it myapp ls -la /app
docker run --rm -it myapp find /app -name "*.env"
docker run --rm -it myapp du -sh /app/*`}</CodePre>

          <p>Spot-check after every Dockerfile change. Especially after refactoring <code>.dockerignore</code>.</p>
        </section>

        <hr />

        {/* SECTION 9 — VOLUME */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>VOLUME + Persistent Storage</h2>
          <p>Containers are ephemeral by design. Files written to the container filesystem disappear when the container restarts. <code>VOLUME</code> declares "this directory is supposed to be mounted from the host" — telling the orchestrator (App Service, Kubernetes, plain Docker) to provide persistent storage.</p>

          <h3>The fleet pattern</h3>
          <CodePre>{`VOLUME ["/data"]`}</CodePre>

          <p>Single line in the Dockerfile. Tells Docker: <code>/data</code> inside the container is a mount point.</p>

          <h3>What goes in /data</h3>
          <ul>
            <li>SQLite database files (Hearth: <code>/data/hearth.db</code>; Tabloom: <code>/data/tabloom.db</code>).</li>
            <li>Uploaded media files (Tabloom: <code>/data/uploads/...</code>).</li>
            <li>Backups (Tabloom: <code>/data/backups/...</code>).</li>
            <li>Any operational state that should survive container restarts.</li>
          </ul>

          <h3>App Service path mapping</h3>
          <p>In the Azure portal: <strong>App Service → Configuration → Path mappings</strong>:</p>
          <ul>
            <li>Mount type: Azure Files Share</li>
            <li>Storage account: stmyapp</li>
            <li>Share name: app-data</li>
            <li>Mount path: <code>/data</code></li>
          </ul>

          <p>This binds the Azure Files share to <code>/data</code> inside the container. The Dockerfile's <code>VOLUME</code> declaration ensures Docker reserves that path; the App Service mapping fills it.</p>

          <h3>The /home alternative</h3>
          <p>App Service for Linux automatically mounts <code>/home</code> as persistent. You don't need a path mapping for it. So you could use <code>/home/data</code> instead of <code>/data</code>:</p>
          <CodePre>{`ENV DB_PATH=/home/data/myapp.db`}</CodePre>

          <p>Pros: no Azure Storage setup; comes with the App Service automatically.</p>
          <p>Cons: shared with App Service system files (logs, FTP); no Azure Backup integration; size limited by App Service plan.</p>

          <p>The fleet uses dedicated <code>/data</code> via Azure Files for separation. <code>/home</code> works fine for small apps.</p>

          <h3>VOLUME without a mapping</h3>
          <p>If you declare <code>VOLUME</code> in the Dockerfile but never mount anything to it, Docker still creates an anonymous volume. Files written to that path persist for the lifetime of the volume — which is "until Docker garbage-collects unused volumes."</p>

          <p>Anonymous volumes are not what you want in production. Always pair <code>VOLUME</code> with an explicit mount.</p>

          <h3>Local dev with the volume</h3>
          <CodePre>{`# Run locally with a host directory mounted
docker run -v \$(pwd)/data:/data myapp

# Or use docker-compose
services:
  myapp:
    build: .
    volumes:
      - ./data:/data`}</CodePre>

          <p>The <code>./data</code> directory on your dev machine becomes <code>/data</code> inside the container. Files persist on your laptop, not in the container.</p>

          <h3>The "no VOLUME, mount works anyway" question</h3>
          <p>Even WITHOUT <code>VOLUME ["/data"]</code> in the Dockerfile, you can mount a volume to <code>/data</code> at runtime. So why declare it?</p>
          <ul>
            <li><strong>Documentation</strong>: future maintainers see "this path is meant to be persistent."</li>
            <li><strong>Tooling</strong>: some orchestrators (older versions) require it.</li>
            <li><strong>Crash safety</strong>: if someone runs <code>docker run</code> without a mount, the VOLUME declaration creates an anonymous volume — files at least survive container restarts within the same Docker daemon.</li>
          </ul>

          <p>Modern Kubernetes / App Service don't strictly need it, but the fleet includes it as good practice.</p>

          <h3>Permissions on the mount</h3>
          <p>If your container runs as non-root (PulseWire's pattern), the mount needs to be writable by that user. Azure Files mounts as root by default — non-root users may need explicit permission setup.</p>

          <p>Workaround: have an init script chmod the mount, or run as root just for the file-writing parts. PulseWire avoids this by NOT writing to <code>/data</code> from the Next.js process — its data lives in Postgres, not on the filesystem.</p>
        </section>

        <hr />

        {/* SECTION 10 — LAYER CACHING */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Layer Caching + Image Size</h2>
          <p>Docker caches each layer. Understanding layer invalidation makes the difference between 30-second builds and 5-minute builds.</p>

          <h3>How layers work</h3>
          <p>Every <code>RUN</code>, <code>COPY</code>, <code>ADD</code>, and <code>WORKDIR</code> creates a new layer. Each layer is a diff against the previous. Docker stores layers content-addressed by hash; identical layers reuse from cache.</p>

          <h3>Layer invalidation rule</h3>
          <p>A layer's cache is INVALIDATED when:</p>
          <ul>
            <li>Its instruction text changes.</li>
            <li>Any input changes (for COPY/ADD: the files; for RUN: the command).</li>
            <li>Any PREVIOUS layer in the same stage has been invalidated (cascading invalidation).</li>
          </ul>

          <h3>The classic ordering trick</h3>
          <CodePre>{`# BAD ORDER — every source change invalidates npm install
COPY . .
RUN npm install

# GOOD ORDER — npm install layer only invalidates when package.json changes
COPY package*.json ./
RUN npm install
COPY . .`}</CodePre>

          <p>The fleet uses the good order. Result: changing a single source file rebuilds only the last few layers (the source copy + the build). The expensive <code>npm install</code> is reused from cache.</p>

          <h3>Multi-stage cache behavior</h3>
          <p>Each stage has its own cache. Changes in stage A don't invalidate stage B unless stage B does <code>COPY --from=stageA</code>.</p>

          <p>The fleet's three stages have separate caches:</p>
          <ul>
            <li><strong>deps</strong>: invalidates only when package.json or lockfile changes.</li>
            <li><strong>builder</strong>: invalidates when source code OR package.json changes.</li>
            <li><strong>runner</strong>: invalidates when deps changes OR builder changes OR backend source changes.</li>
          </ul>

          <h3>Calculating image size</h3>
          <CodePre>{`docker images myapp
docker history myapp                  # see each layer's size
docker history myapp --no-trunc       # see each layer's full command`}</CodePre>

          <p>Look for the big layers. Typical fleet breakdown:</p>
          <table>
            <tbody>
              <tr><th>Layer</th><th>Size</th></tr>
              <tr><td>node:22-alpine base</td><td>~50 MB</td></tr>
              <tr><td>Node 22 runtime</td><td>~80 MB</td></tr>
              <tr><td>node_modules (prod only)</td><td>~120 MB</td></tr>
              <tr><td>dist/</td><td>~3 MB</td></tr>
              <tr><td>backend code (server.js, lib/, routes/)</td><td>~1 MB</td></tr>
              <tr><td><strong>Total</strong></td><td><strong>~250 MB</strong></td></tr>
            </tbody>
          </table>

          <h3>Image size optimizations</h3>
          <ol>
            <li><strong>Use multi-stage</strong>: already done in the fleet.</li>
            <li><strong>Use alpine</strong>: already done.</li>
            <li><strong>Aggressive <code>.dockerignore</code></strong>: don't copy junk.</li>
            <li><strong>Combine RUN commands</strong>: each RUN is a layer. <code>RUN apk add x && apk add y</code> is one layer; two RUNs are two layers. (The fleet's apk lines are single-RUN already.)</li>
            <li><strong>Clean caches in same RUN</strong>: <code>RUN apk add foo && rm -rf /var/cache/apk/*</code>. Most Alpine packages use <code>--no-cache</code> which avoids the cache file entirely.</li>
            <li><strong>Use specific tags</strong>: <code>node:22.5.1-alpine</code> instead of <code>node:22-alpine</code> for reproducibility (but harder to update for security patches).</li>
          </ol>

          <h3>The "I changed Dockerfile and now everything rebuilds" gotcha</h3>
          <p>If you change an early line (like adding a new <code>apk add</code> in deps), every subsequent layer in that stage invalidates. To avoid: put rare-change lines first, frequent-change lines last.</p>

          <h3>Buildkit benefits</h3>
          <p>Docker 20.10+ ships with BuildKit, which adds:</p>
          <ul>
            <li><strong>Parallel stage builds</strong>: deps and builder can build at the same time when they don't depend on each other.</li>
            <li><strong>--mount=type=cache</strong>: persistent cache directories across builds.</li>
            <li><strong>Better output</strong>: cleaner build logs.</li>
            <li><strong>SBOM generation</strong>: attestations for supply-chain security.</li>
          </ul>

          <p>Enable with <code>DOCKER_BUILDKIT=1 docker build .</code> or set <code>{`{ "buildkit": true }`}</code> in Docker daemon config.</p>

          <p>ACR uses BuildKit by default. The fleet gets parallel stages for free in CI.</p>

          <h3>Multi-arch builds</h3>
          <CodePre>{`docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  -t myapp:latest \\
  --push .`}</CodePre>

          <p>Builds for both x86 and ARM. Useful if you have ARM dev machines (M1/M2 Mac) + x86 servers. App Service Linux is x86 only, so the fleet doesn't need multi-arch in production. Local dev: if you don't specify, Docker on M1 builds arm64.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Build a Multi-Stage Image</h2>
          <p>Build the fleet's three-stage pattern for a tiny Express + better-sqlite3 app. Measure final image size. ~10 minutes.</p>

          <h3>Setup</h3>
          <CodePre>{`mkdir myapp && cd myapp
npm init -y
npm install express better-sqlite3
npm install -D vite typescript`}</CodePre>

          <h3>Step 1 — minimal app</h3>
          <CodePre>{`// server.js
import express from 'express'
import Database from 'better-sqlite3'

const db = new Database(process.env.DB_PATH ?? './app.db')
db.exec('CREATE TABLE IF NOT EXISTS visits (id INTEGER PRIMARY KEY, time TEXT)')

const app = express()
app.get('/', (req, res) => {
  db.prepare('INSERT INTO visits (time) VALUES (datetime("now"))').run()
  const count = db.prepare('SELECT COUNT(*) as n FROM visits').get().n
  res.send(\`Hello! You're visit \${count}.\`)
})

app.listen(process.env.PORT ?? 3001, () => console.log('listening'))`}</CodePre>

          <h3>Step 2 — package.json</h3>
          <CodePre>{`{
  "type": "module",
  "scripts": {
    "build": "echo no frontend"
  },
  "dependencies": {
    "express": "^5.0.0",
    "better-sqlite3": "^11.0.0"
  },
  "devDependencies": {
    "vite": "^8.0.0",
    "typescript": "^5.0.0"
  }
}`}</CodePre>

          <h3>Step 3 — Dockerfile</h3>
          <CodePre>{`# Dockerfile
FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps    /app/node_modules ./node_modules
COPY server.js      ./
COPY package.json   ./

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/app.db

EXPOSE 3001
VOLUME ["/data"]
CMD ["node", "server.js"]`}</CodePre>

          <h3>Step 4 — .dockerignore</h3>
          <CodePre>{`# .dockerignore
node_modules
*.db
*.db-wal
*.db-shm
.git
.env*
*.log
.DS_Store`}</CodePre>

          <h3>Step 5 — build it</h3>
          <CodePre>{`docker build -t myapp:lab .

# Verify image size
docker images myapp:lab
# REPOSITORY   TAG   IMAGE ID       CREATED        SIZE
# myapp        lab   abc123def4     1 minute ago   ~210MB

# Look at the layers
docker history myapp:lab`}</CodePre>

          <h3>Step 6 — run it</h3>
          <CodePre>{`mkdir -p ./local-data
docker run -p 3001:3001 -v \$(pwd)/local-data:/data myapp:lab

# In another terminal
curl http://localhost:3001
# → Hello! You're visit 1.
curl http://localhost:3001
# → Hello! You're visit 2.

# Verify persistence
docker stop \$(docker ps -q --filter ancestor=myapp:lab)
docker run -p 3001:3001 -v \$(pwd)/local-data:/data myapp:lab

# Visit again
curl http://localhost:3001
# → Hello! You're visit 3.  (count survived restart)`}</CodePre>

          <h3>Step 7 — measure the layers</h3>
          <CodePre>{`docker history myapp:lab --no-trunc | head -20

# You'll see the layer breakdown.
# Look for the npm install layer — should be ~120MB.
# Everything else should be small.`}</CodePre>

          <h3>Step 8 — break the cache to observe</h3>
          <CodePre>{`# Edit server.js (change a string)
sed -i '' 's/Hello!/Hi!/' server.js

# Rebuild
time docker build -t myapp:lab .

# Most layers should hit cache. Final layer (COPY server.js) rebuilds.
# Build time: a few seconds, not minutes.`}</CodePre>

          <h3>Step 9 — change package.json to invalidate deps cache</h3>
          <CodePre>{`# Add a new dependency
npm install cors

# Rebuild
time docker build -t myapp:lab .

# Now deps stage rebuilds (because package.json changed).
# Builder stage also rebuilds.
# Build time: 1-2 minutes (npm install runs twice — once in deps, once in builder).`}</CodePre>

          <h3>Step 10 — push to ACR (if you have one)</h3>
          <CodePre>{`# Tag for ACR
docker tag myapp:lab myregistry.azurecr.io/myapp:lab

# Push (assumes az acr login already done)
docker push myregistry.azurecr.io/myapp:lab

# Or use ACR build (no local Docker needed)
az acr build -r myregistry -t myapp:lab .`}</CodePre>

          <h3>Extensions</h3>
          <ul>
            <li>Add a VITE_* build arg and verify it's baked into a dummy frontend.</li>
            <li>Add the BUILD_SHA pattern.</li>
            <li>Switch to non-root user.</li>
            <li>Switch from npm to pnpm with corepack.</li>
            <li>Try bookworm-slim base — observe size difference.</li>
            <li>Try the one-stage version — observe size difference.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"node-gyp can't find Python"</h3>
          <p>You forgot <code>apk add python3 make g++</code> in a stage that runs npm install on a project with native modules. Add it.</p>

          <h3>"The build is suddenly very slow"</h3>
          <ul>
            <li>You probably have <code>COPY . .</code> BEFORE <code>npm install</code>. Any source change invalidates the install layer. Move <code>COPY package*.json ./</code> + <code>npm install</code> before <code>COPY . .</code>.</li>
            <li>Or your <code>.dockerignore</code> is letting <code>node_modules</code> through. Add it.</li>
            <li>Or you're not using BuildKit. Set <code>DOCKER_BUILDKIT=1</code>.</li>
          </ul>

          <h3>"The final image is huge (1GB+)"</h3>
          <ul>
            <li>You're not using multi-stage. The build tools are in the final image.</li>
            <li>Your <code>.dockerignore</code> doesn't exclude <code>node_modules</code> or <code>.git</code>.</li>
            <li>You're using <code>node:22</code> (full Debian) instead of <code>node:22-alpine</code>.</li>
            <li>Your dependencies are heavy (Puppeteer, Playwright). Audit <code>dependencies</code> vs <code>devDependencies</code>.</li>
          </ul>

          <h3>"App works locally but not in the container"</h3>
          <ul>
            <li>Hardcoded paths. Use <code>process.env.X ?? fallback</code>.</li>
            <li>Hardcoded ports. Use <code>process.env.PORT</code>.</li>
            <li>Permissions on the volume mount.</li>
            <li>Missing env vars. Verify with <code>docker exec -it &lt;container&gt; printenv</code>.</li>
            <li>Architecture mismatch. M1 Mac dev → x86 prod requires <code>--platform linux/amd64</code>.</li>
          </ul>

          <h3>"App Service deployment 'succeeds' but app is still the old version"</h3>
          <p>Silent rollback. The new image started but failed health checks within ~5 minutes. App Service kept the old container. Add the BUILD_SHA verification to your deploy workflow (§6) so you fail loud instead of silent.</p>

          <h3>"docker push is very slow"</h3>
          <p>Push uploads each layer that isn't already in the registry. If your image has a huge node_modules layer, the first push is slow but subsequent pushes only upload changed layers. Don't fight the slow first push.</p>

          <p>For faster CI: use <code>az acr build</code> which builds in Azure (no local push) and is generally faster than build+push.</p>

          <h3>"node:22-alpine pulled a new build and broke my app"</h3>
          <p>Alpine tags update. <code>node:22-alpine</code> today might be node:22.5.1-alpine, tomorrow 22.6.0-alpine. Pin a specific version: <code>node:22.5.1-alpine</code> for full reproducibility.</p>

          <p>Tradeoff: pinned versions need manual updates for security patches.</p>

          <h3>"Container starts and immediately exits"</h3>
          <ul>
            <li>Check <code>docker logs &lt;container&gt;</code> for crash logs.</li>
            <li>Missing env vars at startup — Node throws on undefined process.env.X.</li>
            <li>SQLite trying to open a file in a non-writable location.</li>
            <li>Permission denied on a file the CMD tries to read.</li>
          </ul>

          <h3>"I can't connect from outside the container"</h3>
          <p>Likely you didn't publish the port: <code>docker run -p 3001:3001 myapp</code>. The <code>EXPOSE</code> instruction is documentation; <code>-p</code> is what actually maps.</p>

          <h3>"Environment variable I set in Dockerfile isn't visible at runtime"</h3>
          <p>You probably used <code>ARG</code> instead of <code>ENV</code>. <code>ARG</code> is build-time only. Use <code>ENV</code> for runtime variables.</p>

          <h3>"A new VITE_* var I added isn't in the bundle"</h3>
          <p>You rebuilt without passing the <code>--build-arg</code>. Build args have to be passed every time. Set them in your CI workflow.</p>

          <h3>"Image won't run on App Service: 'cannot execute binary file'"</h3>
          <p>Architecture mismatch. You built arm64 (M1 Mac default) and tried to run on x86 (App Service). Build with <code>--platform linux/amd64</code> or use <code>az acr build</code>.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The three-stage skeleton</h3>
          <CodePre>{`FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY server.js package.json ./
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
VOLUME ["/data"]
CMD ["node", "server.js"]`}</CodePre>

          <h3>The .dockerignore baseline</h3>
          <CodePre>{`node_modules
dist
.git
.gitignore
.env*
*.log
*.db
*.db-wal
*.db-shm
.vscode
.idea
.DS_Store
.claude
**/*.test.ts`}</CodePre>

          <h3>Build args (VITE_*)</h3>
          <CodePre>{`# Dockerfile
ARG VITE_X
ENV VITE_X=$VITE_X
RUN npm run build

# Build command
docker build --build-arg VITE_X=actual-value -t myapp .
az acr build -r myreg -t myapp --build-arg VITE_X=actual-value .`}</CodePre>

          <h3>BUILD_SHA pattern</h3>
          <CodePre>{`# Dockerfile (runner stage)
ARG BUILD_SHA=unknown
ARG BUILD_TIME=unknown
ENV BUILD_SHA=$BUILD_SHA
ENV BUILD_TIME=$BUILD_TIME

# Build
az acr build -r myreg -t myapp \\
  --build-arg BUILD_SHA=$GITHUB_SHA \\
  --build-arg BUILD_TIME=$(date -u +%FT%TZ) .

# Endpoint to verify
app.get('/api/version', (req, res) => res.json({
  buildSha: process.env.BUILD_SHA,
  buildTime: process.env.BUILD_TIME,
}))

# Deploy workflow polls until SHA matches`}</CodePre>

          <h3>Non-root user (PulseWire pattern)</h3>
          <CodePre>{`RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/dist ./
USER nextjs`}</CodePre>

          <h3>pnpm with corepack</h3>
          <CodePre>{`RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ... rest like npm ...`}</CodePre>

          <h3>The apk install line variations</h3>
          <CodePre>{`# Minimum for better-sqlite3
RUN apk add --no-cache python3 make g++

# Add for some packages with glibc-only binaries
RUN apk add --no-cache libc6-compat python3 make g++

# Add tzdata for timezone-aware logs
RUN apk add --no-cache tzdata python3 make g++`}</CodePre>

          <h3>Common ports across fleet</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Port</th></tr>
              <tr><td>SecretApp (Hearth)</td><td>3001</td></tr>
              <tr><td>ShopKeep</td><td>3002</td></tr>
              <tr><td>GLP1 (Tare)</td><td>3003</td></tr>
              <tr><td>Cairn</td><td>3004</td></tr>
              <tr><td>PulseWire</td><td>3000</td></tr>
              <tr><td>Workshop</td><td>3005</td></tr>
              <tr><td>Puzzlebox</td><td>3006</td></tr>
              <tr><td>Tabloom</td><td>3007</td></tr>
            </tbody>
          </table>

          <h3>Build commands</h3>
          <CodePre>{`# Local
docker build -t myapp .
docker build --platform linux/amd64 -t myapp .
docker build --build-arg X=y -t myapp .

# ACR
az acr build -r myregistry -t myapp:latest .
az acr build -r myregistry -t myapp:\$(git rev-parse --short HEAD) .

# Inspect
docker images myapp
docker history myapp
docker history myapp --no-trunc
docker run --rm -it myapp /bin/sh
docker run --rm -it myapp ls -la /app`}</CodePre>

          <h3>The layer-caching ordering rule</h3>
          <ol>
            <li>Base image FROM.</li>
            <li>System packages (apk add).</li>
            <li>WORKDIR.</li>
            <li>Copy package.json + lockfile.</li>
            <li>Install dependencies.</li>
            <li>Copy source code.</li>
            <li>Build / compile.</li>
          </ol>

          <p>Rarely-changing things first, frequently-changing things last.</p>

          <h3>The discipline</h3>
          <ul>
            <li>Multi-stage by default (deps + builder + runner).</li>
            <li><code>node:22-alpine</code> base.</li>
            <li><code>npm ci --omit=dev</code> (or pnpm equivalent), never <code>npm install</code> for prod.</li>
            <li><code>apk add python3 make g++</code> in every stage with native modules.</li>
            <li>Copy package*.json BEFORE source.</li>
            <li>VITE_* via <code>ARG</code> + <code>ENV</code>.</li>
            <li>BUILD_SHA tracking + <code>/api/version</code> endpoint.</li>
            <li>VOLUME for persistent paths.</li>
            <li>Comprehensive <code>.dockerignore</code>.</li>
            <li>Build via <code>az acr build</code> in CI (no local Docker on runner needed).</li>
            <li>Polling deploy verification — never trust App Service's "success."</li>
          </ul>

          <h3>The fleet pattern at a glance</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  S[Source code] --> D[deps stage<br/>npm ci --omit=dev]
  S --> B[builder stage<br/>npm ci + build]
  D --> R[runner stage]
  B --> R
  R --> IMG[~250MB final image]
  IMG --> ACR[ACR]
  ACR --> AS[App Service]
  style D fill:#5C2A4A,color:#fff
  style B fill:#5C2A4A,color:#fff
  style R fill:#5C2A4A,color:#fff`} />
        </section>
      </main>
    </div>
  );
}
