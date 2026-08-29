import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'The App Directory',                icon: '📁' },
  { id: 's3',  num: '3',  title: 'Server vs Client Components',      icon: '🔀' },
  { id: 's4',  num: '4',  title: 'proxy.ts (was middleware.ts)',     icon: '🛂' },
  { id: 's5',  num: '5',  title: 'Route Handlers',                   icon: '📡' },
  { id: 's6',  num: '6',  title: 'Lazy DB Connection (Proxy)',       icon: '⏳' },
  { id: 's7',  num: '7',  title: 'instrumentation.ts at Boot',       icon: '🚀' },
  { id: 's8',  num: '8',  title: 'Two Processes, One Container',     icon: '🛤️' },
  { id: 's9',  num: '9',  title: 'next.config Standalone',           icon: '⚙️' },
  { id: 's10', num: '10', title: 'PWA Service Worker',               icon: '📲' },
  { id: 's11', num: '★',  title: 'Lab: Build a Next.js Skeleton',    icon: '🛠️' },
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

export default function NextJsAppRouterGuide() {
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
            <span className="sidebar-title">Next.js 16 App Router</span>
          </div>
          <div className="sidebar-sub">PulseWire deep dive</div>
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
          <div className="hero-tag">▲ Next.js 16.2 · 2026</div>
          <h1>Next.js 16 App Router<br />(PulseWire Deep Dive)</h1>
          <p>
            PulseWire is the only fleet app on Next.js — and the only one that ships <strong style={{ color: '#C77AA0' }}>
            Server Components, a standalone Node server, and a Postgres-backed worker process</strong> in one container.
            This guide walks every PulseWire-specific Next.js mechanism: the app directory, the Server/Client boundary,
            <code>proxy.ts</code> (renamed from <code>middleware.ts</code>), route handlers, the lazy DB Proxy that defers
            connection until first call, the <code>instrumentation.ts</code> migration runner, the dual-process launch
            script, and the standalone build output.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">1/8</span><span className="hero-stat-label">Fleet apps on Next.js</span></div>
            <div className="hero-stat"><span className="hero-stat-val">App Router</span><span className="hero-stat-label">RSC + Streaming</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Procs / Container</span></div>
            <div className="hero-stat"><span className="hero-stat-val">standalone</span><span className="hero-stat-label">Build Output</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Next.js is React with three things bolted on: <em>(a)</em> a file-system router, <em>(b)</em> a build that
            emits a Node server (or static files), and <em>(c)</em> a runtime that knows when a component should render
            on the server vs ship JS to the browser. The "App Router" (introduced in Next 13, default since 14) is the
            modern shape; the older "Pages Router" still works but the fleet picks App Router.
          </p>

          <h3>Two analogies</h3>
          <p>
            <strong>The cookie shop.</strong> Pages Router was "ship a recipe book to the customer; they bake everything
            at home" (every page is hydrated on the client). App Router is "bake what you can in the shop, send the still-warm
            cookies AND a small mixer so the customer can finish the decorating themselves" (Server Components ship as
            HTML; only the interactive parts hydrate).
          </p>
          <p>
            <strong>The cinema vs the home theater.</strong> Server Components are the cinema — you watch what was prepared
            for you, no controls. Client Components are the home theater — you have a remote, you can pause, rewind, swap
            discs. Most of the app is cinema; the remote is the small portion at the leaves.
          </p>

          <h3>What App Router adds over Pages Router</h3>
          <table>
            <tbody>
              <tr><th>Feature</th><th>What it does</th></tr>
              <tr><td>React Server Components (RSC)</td><td>Run on the server, ship as serialized HTML. Zero JS to the browser.</td></tr>
              <tr><td>Streaming</td><td>Server renders incrementally — fast bits ship before slow bits finish.</td></tr>
              <tr><td>Nested layouts</td><td><code>layout.tsx</code> wraps its sibling <code>page.tsx</code> and every nested route. Persistent across navigations.</td></tr>
              <tr><td>Loading + error boundaries</td><td><code>loading.tsx</code> and <code>error.tsx</code> files automatically wrap their route.</td></tr>
              <tr><td>Route groups</td><td><code>(group)</code> folders organize without affecting URL.</td></tr>
              <tr><td>Parallel routes</td><td>Multiple route segments render in parallel via named slots.</td></tr>
              <tr><td>Route Handlers</td><td><code>route.ts</code> files — REST APIs as exported HTTP-method functions.</td></tr>
              <tr><td>Server Actions</td><td>Async functions marked <code>"use server"</code> — form-handlers that run on the server.</td></tr>
            </tbody>
          </table>

          <h3>What PulseWire actually uses</h3>
          <p>PulseWire is intentionally minimal — it uses the parts it needs and skips the rest.</p>
          <ul>
            <li>✅ App Router for file-based routing</li>
            <li>✅ Server Components for the layout shell</li>
            <li>✅ Route Handlers for the REST API (<code>src/app/api/**/route.ts</code>)</li>
            <li>✅ <code>proxy.ts</code> for auth-gating <code>/app/*</code></li>
            <li>✅ <code>instrumentation.ts</code> for boot-time migrations + seeds</li>
            <li>✅ <code>output: 'standalone'</code> for Docker packaging</li>
            <li>❌ Server Actions (uses Route Handlers + client-side fetch instead)</li>
            <li>❌ Streaming / Suspense at the page level (not yet needed)</li>
            <li>❌ Parallel routes / intercepting routes</li>
          </ul>

          <h3>The PulseWire stack at a glance</h3>
          <MermaidDiagram theme="default" chart={`graph TB
  C[Browser]
  subgraph Container
    L[launch-prod.mjs]
    L --> N[Next.js server.js]
    L --> W[graphile-worker dist/worker.mjs]
    N --> P[(Postgres + pgvector)]
    W --> P
  end
  C -->|HTTP| N`} />
        </section>

        <hr />

        {/* SECTION 2 — APP DIRECTORY */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>The App Directory</h2>
          <p>Next.js maps your <code>src/app/</code> directory to URL paths. The folder name IS the route segment; files inside it define what happens when that route is hit.</p>

          <h3>The special filenames</h3>
          <table>
            <tbody>
              <tr><th>File</th><th>Role</th></tr>
              <tr><td><code>page.tsx</code></td><td>Renders the route. <code>src/app/reader/page.tsx</code> → URL <code>/reader</code>.</td></tr>
              <tr><td><code>layout.tsx</code></td><td>Wraps every nested page and layout. Persistent across navigation.</td></tr>
              <tr><td><code>loading.tsx</code></td><td>Auto Suspense boundary while the page loads.</td></tr>
              <tr><td><code>error.tsx</code></td><td>Error boundary for the route + descendants.</td></tr>
              <tr><td><code>not-found.tsx</code></td><td>404 boundary.</td></tr>
              <tr><td><code>route.ts</code></td><td>Route Handler (REST API endpoint). Mutually exclusive with <code>page.tsx</code> in the same folder.</td></tr>
              <tr><td><code>template.tsx</code></td><td>Like layout, but remounts on every navigation. Rare.</td></tr>
              <tr><td><code>middleware.ts</code></td><td>(Next 15 and earlier) URL-level handler. Renamed to <code>proxy.ts</code> in 16.</td></tr>
              <tr><td><code>proxy.ts</code></td><td>(Next 16+) Replaces middleware.ts. Same role.</td></tr>
              <tr><td><code>instrumentation.ts</code></td><td>Server-only init hook. Runs once at boot, before any request.</td></tr>
            </tbody>
          </table>

          <h3>Dynamic segments</h3>
          <CodePre>{`src/app/articles/[id]/page.tsx       # /articles/42    → params.id = "42"
src/app/articles/[...slug]/page.tsx  # /articles/a/b/c → params.slug = ["a","b","c"]
src/app/(marketing)/page.tsx         # / — the (marketing) group is invisible in URLs`}</CodePre>

          <h3>PulseWire's structure</h3>
          <CodePre>{`pulsewire/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # root Server Component layout
│   │   ├── page.tsx                # / (landing)
│   │   ├── globals.css
│   │   ├── auth/
│   │   │   ├── login/route.ts      # GET /auth/login → redirect to Entra
│   │   │   ├── callback/route.ts   # GET /auth/callback → exchange code
│   │   │   └── logout/route.ts     # GET /auth/logout
│   │   ├── app/                    # protected — auth-gated by proxy.ts
│   │   │   ├── layout.tsx
│   │   │   ├── reader/page.tsx
│   │   │   └── saved/page.tsx
│   │   └── api/
│   │       ├── health/route.ts     # public
│   │       ├── reader/articles/route.ts
│   │       └── search/route.ts
│   ├── proxy.ts                    # auth-gates /app/*
│   ├── instrumentation.ts          # boot hook entry
│   ├── instrumentation-node.ts     # migrations + seed
│   ├── db/
│   │   ├── client.ts               # lazy Proxy
│   │   └── schema.ts
│   ├── lib/
│   │   └── auth/
│   │       ├── msal.ts
│   │       └── session.ts
│   └── worker/                     # graphile-worker tasks (separate process)
│       └── tasks/
├── scripts/
│   └── launch-prod.mjs             # spawns Next.js + worker
├── next.config.ts
├── drizzle/                        # Postgres migrations
└── Dockerfile`}</CodePre>

          <h3>The root layout</h3>
          <CodePre>{`// PulseWire/src/app/layout.tsx — verbatim
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PulseWire",
  description: "AI-native RSS reader.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PulseWire",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
}

export const viewport: Viewport = { themeColor: "#0b1020" }

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={\`\${geistSans.variable} \${geistMono.variable} h-full antialiased\`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}`}</CodePre>

          <h3>Note: no <code>"use client"</code></h3>
          <p>The root layout has NO directive. It's a Server Component by default. Its JavaScript never reaches the browser — Next.js renders it server-side and ships only the HTML.</p>

          <h3>The <code>metadata</code> export</h3>
          <p>This is App Router's typed replacement for <code>next/head</code>. Export a <code>metadata</code> object (or function) from any layout / page; Next.js merges them and emits the corresponding <code>&lt;meta&gt;</code> / <code>&lt;link&gt;</code> tags. The PulseWire root sets the page title, manifest, PWA icons, and Apple-specific iOS standalone settings.</p>
        </section>

        <hr />

        {/* SECTION 3 — SERVER VS CLIENT */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Server vs Client Components — The Boundary</h2>
          <p>
            Every component in App Router is a Server Component by default. Add <code>"use client"</code> at the top of
            a file to flip it to a Client Component. The boundary is one-way: once you're in a Client subtree, every
            descendant is also client.
          </p>

          <h3>The split, in one diagram</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  L[layout.tsx<br/>Server Component] --> P[page.tsx<br/>Server Component]
  P --> H[Header.tsx<br/>Server Component]
  P --> S[ArticleStream.tsx<br/>'use client']
  P --> O[SignOutButton.tsx<br/>'use client']
  S --> C[ArticleCard.tsx<br/>Client — inside Stream's subtree]
  H --> N[Nav.tsx<br/>'use client' — Header crosses into client here]

  style S fill:#5C2A4A,color:#fff
  style O fill:#5C2A4A,color:#fff
  style C fill:#5C2A4A,color:#fff
  style N fill:#5C2A4A,color:#fff`} />

          <h3>When to flip to "use client"</h3>
          <ul>
            <li>You use <code>useState</code>, <code>useEffect</code>, <code>useReducer</code>, or any React hook.</li>
            <li>You attach event handlers (<code>onClick</code>, <code>onChange</code>, etc.).</li>
            <li>You use browser APIs (<code>window</code>, <code>document</code>, <code>localStorage</code>, <code>navigator</code>).</li>
            <li>You consume context from a client provider.</li>
            <li>You import any client component (transitively requires you to also be client — actually no, you can import client from server, but server can't import client into HTML and call it).</li>
          </ul>

          <h3>What Server Components can do that Client can't</h3>
          <ul>
            <li><strong>Be <code>async</code> and <code>await</code> data.</strong> No <code>useEffect</code> ceremony.</li>
            <li><strong>Read secrets / env vars / file system / db.</strong> Their code never reaches the browser.</li>
            <li><strong>Ship zero JS.</strong> Only their rendered HTML output is sent to the client.</li>
            <li><strong>Avoid hydration overhead.</strong> Static parts of the page paint instantly with no JS warmup.</li>
          </ul>

          <h3>Server Component fetching pattern</h3>
          <CodePre>{`// Server Component — runs on the server, never ships to browser
import { db } from '@/db/client'
import { articles } from '@/db/schema'
import { desc } from 'drizzle-orm'

export default async function ReaderPage() {
  // ← async + await right in the component body
  const rows = await db.select().from(articles).orderBy(desc(articles.publishedAt)).limit(50)

  return (
    <main>
      {rows.map(a => <ArticleCard key={a.id} article={a} />)}
    </main>
  )
}`}</CodePre>

          <h3>Client Component pattern</h3>
          <CodePre>{`'use client'  // ← directive at the top of the file

import { useState } from 'react'

export default function SaveButton({ articleId }: { articleId: string }) {
  const [saved, setSaved] = useState(false)
  return (
    <button onClick={async () => {
      await fetch(\`/api/articles/\${articleId}/save\`, { method: 'POST' })
      setSaved(true)
    }}>
      {saved ? '✓ Saved' : 'Save'}
    </button>
  )
}`}</CodePre>

          <h3>The serialization rule</h3>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              Props passed from a Server Component to a Client Component <strong>must be JSON-serializable</strong>. No
              functions, no class instances, no Dates with methods, no Maps. Strings, numbers, booleans, plain objects,
              arrays, null. If you need to pass a function, make the Client Component define it; if you need to pass a
              Date, convert with <code>.toISOString()</code> and parse on the client.
            </div>
          </div>

          <h3>Composition tricks</h3>
          <CodePre>{`// Server Component renders a Client wrapper with server-rendered children
export default async function Page() {
  const data = await fetchSomething()
  return (
    <ClientWrapper>
      {/* The children are still server-rendered HTML — only ClientWrapper is interactive */}
      <ServerComponent data={data} />
    </ClientWrapper>
  )
}`}</CodePre>

          <p>This pattern is invaluable: an interactive wrapper (e.g. a tabs container, a modal) can wrap statically-rendered server children. You get the interactivity of a Client Component AND the zero-JS-per-child of Server Components.</p>

          <h3>The default-to-server discipline</h3>
          <p>The PulseWire codebase is mostly Server Components. <code>"use client"</code> appears on:</p>
          <ul>
            <li>The article reader (virtuoso-based virtualized list)</li>
            <li>Sign-in / sign-out buttons</li>
            <li>The settings forms</li>
            <li>Any component that animates (Framer Motion needs client)</li>
            <li>Theme toggle</li>
          </ul>
          <p>Everything else — layouts, page shells, headers, footers, sidebars — stays server. The JS bundle is small as a result.</p>
        </section>

        <hr />

        {/* SECTION 4 — PROXY */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span><code>proxy.ts</code> — Was <code>middleware.ts</code> in Next ≤15</h2>
          <p>
            Next.js 16 renamed the file that gates URLs (auth checks, redirects, header rewriting) from
            <code>middleware.ts</code> → <code>proxy.ts</code>. The exported function changed from <code>middleware</code>
            → <code>proxy</code>. Same role, same API; just a rename to avoid the confusion with Express middleware
            (which behaves very differently).
          </p>

          <h3>PulseWire's full proxy.ts</h3>
          <CodePre>{`// PulseWire/src/proxy.ts — verbatim
import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SESSION_COOKIE_PROD = "__Host-pulsewire-session"
const SESSION_COOKIE_DEV  = "pulsewire-session"
const ISSUER   = "pulsewire"
const AUDIENCE = "pulsewire-app"

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const cookieName =
    process.env.NODE_ENV === "production"
      ? SESSION_COOKIE_PROD
      : SESSION_COOKIE_DEV
  const token = req.cookies.get(cookieName)?.value
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer:   ISSUER,
      audience: AUDIENCE,
    })
    return true
  } catch {
    return false
  }
}

export async function proxy(req: NextRequest) {
  if (await hasValidSession(req)) return NextResponse.next()
  const loginUrl = new URL("/auth/login", req.url)
  loginUrl.searchParams.set("returnTo", req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/app/:path*"],
}`}</CodePre>

          <h3>The matcher — what proxy gates</h3>
          <p>The <code>config.matcher</code> array tells Next.js which URLs to run <code>proxy</code> on. Patterns:</p>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>Matches</th></tr>
              <tr><td><code>"/app/:path*"</code></td><td>Everything under /app/ (recursive)</td></tr>
              <tr><td><code>"/api/:path*"</code></td><td>Everything under /api/</td></tr>
              <tr><td><code>"/((?!auth|api/public|_next).*)"</code></td><td>Everything EXCEPT /auth, /api/public, /_next (regex)</td></tr>
              <tr><td><code>"/dashboard"</code></td><td>Exact match</td></tr>
            </tbody>
          </table>

          <p>PulseWire's <code>"/app/:path*"</code> auth-gates everything in the app area. The landing page, sign-in page, and API health check are not matched and don't run through proxy.</p>

          <h3>The runtime environment</h3>
          <p>By default, proxy runs in the <strong>Edge runtime</strong> — a lightweight V8 isolate without Node APIs. That means:</p>
          <ul>
            <li>✅ <code>fetch</code>, web crypto, base text APIs</li>
            <li>✅ <code>jose</code> (uses Web Crypto under the hood) — works in Edge</li>
            <li>❌ <code>node:fs</code>, <code>better-sqlite3</code>, <code>postgres</code> — Node-only</li>
            <li>❌ <code>jsonwebtoken</code> (uses Node crypto) — won't work in Edge</li>
          </ul>

          <p>PulseWire's proxy uses <code>jose</code> — that's why. If you need Node APIs in proxy:</p>
          <CodePre>{`// At the top of proxy.ts
export const config = {
  matcher: ["/app/:path*"],
  runtime: "nodejs",   // ← explicit Node runtime (Next.js 15.5+)
}`}</CodePre>

          <p>For most auth-check proxies, Edge is faster and cheaper — keep the default.</p>

          <h3>What proxy can do</h3>
          <ul>
            <li><strong>Redirect</strong>: <code>NextResponse.redirect(url)</code></li>
            <li><strong>Rewrite</strong>: <code>NextResponse.rewrite(url)</code> — the URL changes server-side but the browser bar doesn't</li>
            <li><strong>Set cookies</strong>: <code>response.cookies.set(name, value)</code></li>
            <li><strong>Set headers</strong>: <code>response.headers.set("x-foo", "bar")</code></li>
            <li><strong>Pass through</strong>: <code>NextResponse.next()</code> — continue to the matched route</li>
          </ul>

          <h3>The returnTo dance</h3>
          <p>PulseWire's proxy adds <code>?returnTo=/the/path/they/wanted</code> when redirecting unauthenticated users to /auth/login. The login route consumes it; after sign-in completes, the callback redirects to that path. Without it, every login lands on /app's home regardless of which deep URL the user shared.</p>
        </section>

        <hr />

        {/* SECTION 5 — ROUTE HANDLERS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Route Handlers (REST APIs)</h2>
          <p>
            Next.js's replacement for Pages Router's <code>pages/api/*.ts</code>. Each <code>route.ts</code> file exports
            functions named after HTTP methods (<code>GET</code>, <code>POST</code>, etc.). Same folder rules as
            <code>page.tsx</code> — the path becomes the URL.
          </p>

          <h3>The full shape (PulseWire)</h3>
          <CodePre>{`// PulseWire/src/app/api/reader/articles/route.ts — verbatim
import { NextResponse } from "next/server"
import { listArticles, type ArticlesCursor } from "@/lib/articles"
import { readSession } from "@/lib/auth/session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const session = await readSession()
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 })

  const url = new URL(req.url)
  const feedId   = url.searchParams.get("feedId")   || undefined
  const category = url.searchParams.get("category") || undefined
  const cursorRaw = url.searchParams.get("cursor")
  let cursor: ArticlesCursor | null = null
  if (cursorRaw) {
    try {
      const parsed = JSON.parse(cursorRaw)
      if (typeof parsed?.fetchedAt === "string" && typeof parsed?.id === "string") {
        cursor = parsed as ArticlesCursor
      }
    } catch {
      return NextResponse.json({ error: "bad cursor" }, { status: 400 })
    }
  }

  const { rows, nextCursor } = await listArticles({
    userId: session.sub, feedId, category, cursor,
  })

  return NextResponse.json({
    articles: rows.map(r => ({
      ...r,
      publishedAt: r.publishedAt?.toISOString() ?? null,
      fetchedAt:   r.fetchedAt.toISOString(),
    })),
    nextCursor,
  })
}`}</CodePre>

          <h3>The two control directives</h3>
          <CodePre>{`export const runtime = "nodejs"          // | "edge" — pick Node for db + native modules
export const dynamic = "force-dynamic"   // never cache; re-run on every request`}</CodePre>

          <table>
            <tbody>
              <tr><th>Directive</th><th>Values</th><th>Effect</th></tr>
              <tr><td><code>runtime</code></td><td><code>"nodejs"</code> | <code>"edge"</code></td><td>Where the handler runs. Edge for static-ish API, Node for db.</td></tr>
              <tr><td><code>dynamic</code></td><td><code>"auto"</code> | <code>"force-dynamic"</code> | <code>"error"</code> | <code>"force-static"</code></td><td>Controls Next.js's caching aggression.</td></tr>
              <tr><td><code>revalidate</code></td><td>number (seconds) | <code>false</code></td><td>How often to re-render for static handlers.</td></tr>
            </tbody>
          </table>

          <h3>Why <code>force-dynamic</code></h3>
          <p>Without it, Next.js may attempt to statically pre-render the route at build time. That would call <code>readSession()</code> with no cookies, return 401, and bake that 401 response into the build. Every user would get a cached 401. <code>force-dynamic</code> opts out of that.</p>

          <h3>Method functions</h3>
          <CodePre>{`export async function GET(req: Request)    { ... }
export async function POST(req: Request)   { ... }
export async function PUT(req: Request)    { ... }
export async function DELETE(req: Request) { ... }
export async function PATCH(req: Request)  { ... }`}</CodePre>

          <p>Export only the methods you support. Unsupported methods get an automatic 405 Method Not Allowed.</p>

          <h3>Reading params (dynamic routes)</h3>
          <CodePre>{`// src/app/api/articles/[id]/route.ts
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params   // ← Next 16+ makes params async
  const article = await db.select().from(articles).where(eq(articles.id, id))
  return NextResponse.json(article)
}`}</CodePre>

          <p>The <code>params</code> being a Promise is a Next 16 breaking change — earlier versions had it as a plain object. The async form lets Next.js defer resolution for better streaming.</p>

          <h3>Reading body</h3>
          <CodePre>{`export async function POST(req: Request) {
  const body = await req.json()             // ← auto-parses JSON
  // or:
  const formData = await req.formData()
  // or:
  const text = await req.text()
}`}</CodePre>

          <h3>The session helper</h3>
          <p>PulseWire's route handlers consistently use <code>readSession()</code> for auth. That helper reads the session cookie, verifies the JWT, returns the claims or null. It's the server-side counterpart to the proxy's check.</p>
          <CodePre>{`// Inside a route handler
const session = await readSession()
if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 })
const userId = session.sub   // ← from JWT subject claim`}</CodePre>

          <h3>Public vs protected routes</h3>
          <p>PulseWire's proxy matcher only catches <code>/app/*</code>. The <code>/api/*</code> routes are NOT matched by proxy — each route handler does its own auth check. The exception: <code>/api/health</code> is open (no <code>readSession</code>), used by the deploy workflow's smoke test.</p>
        </section>

        <hr />

        {/* SECTION 6 — LAZY DB */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Lazy DB Connection (the Proxy Pattern)</h2>
          <p>
            Next.js 16 evaluates route modules at <em>build time</em> to collect their static metadata, with no env vars
            populated. If your <code>db/client.ts</code> opens a Postgres connection at module load, build fails.
            PulseWire's solution: a JavaScript <code>Proxy</code> that defers connection to first method call.
          </p>

          <h3>The full pattern</h3>
          <CodePre>{`// PulseWire/src/db/client.ts — verbatim
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

declare global {
  var __pgClient: ReturnType<typeof postgres> | undefined
}

type DbType = ReturnType<typeof drizzle<typeof schema>>

function getClient(): ReturnType<typeof postgres> {
  if (globalThis.__pgClient) return globalThis.__pgClient
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")
  const client = postgres(url, { max: 5, idle_timeout: 30, ssl: "require" })
  if (process.env.NODE_ENV !== "production") {
    globalThis.__pgClient = client
  }
  return client
}

let _db: DbType | null = null
function ensure(): DbType {
  if (!_db) _db = drizzle(getClient(), { schema })
  return _db
}

export const db = new Proxy({} as DbType, {
  get(_t, prop, receiver) {
    return Reflect.get(ensure() as object, prop, receiver)
  },
}) as DbType`}</CodePre>

          <h3>Why the Proxy</h3>
          <p>The <code>db</code> export is a Proxy wrapping an empty object. Any access (e.g. <code>db.select</code>) hits the <code>get</code> trap, which calls <code>ensure()</code>. <code>ensure()</code> opens the connection on first call, returns the real Drizzle handle. Subsequent calls return the cached handle.</p>

          <p>From the consumer's perspective:</p>
          <CodePre>{`import { db } from "@/db/client"

// At module load: db is a Proxy, no connection opened yet
// At route handler invocation:
const rows = await db.select().from(articles)
// ← .select triggers the Proxy get trap → ensure() → connection opens NOW`}</CodePre>

          <h3>Why <code>globalThis.__pgClient</code></h3>
          <p>In development, Next.js's hot-reload re-executes the module on every save. Without the global cache, you'd open a new pg connection on every save and quickly exhaust the pool. The global persists across re-evaluations.</p>
          <p>In production, modules load once — the global isn't strictly needed. PulseWire skips it (<code>if (NODE_ENV !== 'production')</code>) to keep the prod behavior clean.</p>

          <h3>Why this matters for Next.js builds</h3>
          <p>Without the Proxy:</p>
          <CodePre>{`// src/db/client.ts — BAD VERSION
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

// ← This runs at module evaluation time
const client = postgres(process.env.DATABASE_URL!, ...)
export const db = drizzle(client)`}</CodePre>

          <p>When Next.js's build process imports a route handler that imports <code>db/client.ts</code>:</p>
          <ol>
            <li>Module evaluation runs the top-level code.</li>
            <li><code>process.env.DATABASE_URL</code> is undefined in the build environment.</li>
            <li><code>postgres(undefined)</code> throws.</li>
            <li>Build fails: "Cannot read .env at build time."</li>
          </ol>

          <p>With the Proxy, module evaluation is a no-op. The connection opens only when a request actually arrives.</p>

          <h3>This pattern works for any side-effecting resource</h3>
          <ul>
            <li>Database connections (PulseWire's pg, hypothetical Redis)</li>
            <li>SDK clients with env-driven keys (Azure OpenAI, SendGrid)</li>
            <li>File handles, log streams</li>
            <li>Any singleton you want to defer</li>
          </ul>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              The Proxy adds ~microseconds of overhead per <code>db.X</code> access. Negligible for any non-trivial query.
              The clarity win (deferred init, no top-level side effects) is worth it.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 7 — INSTRUMENTATION */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span><code>instrumentation.ts</code> — Boot-Time Init</h2>
          <p>
            Next.js's hook for "run this exactly once when the server starts." PulseWire uses it for migrations + seeding.
            The pattern: a thin <code>instrumentation.ts</code> that dynamically imports the heavy work to keep the
            file small + Edge-runtime-compatible.
          </p>

          <h3>The two-file split</h3>
          <CodePre>{`// PulseWire/src/instrumentation.ts — verbatim (entire file)
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return
  const { runMigrations } = await import("./instrumentation-node")
  await runMigrations()
}`}</CodePre>

          <CodePre>{`// PulseWire/src/instrumentation-node.ts — verbatim (relevant portion)
import * as fs from "node:fs"
import * as path from "node:path"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

import { ensureDemoUserAndSubscriptions } from "@/lib/demo/seed"
import { seedSourceBias } from "@/lib/feeds/bias-seed"
import { backfillSubscriptionsForAllUsers, ensureStarterFeeds } from "@/lib/feeds/seed"

export async function runMigrations() {
  if (process.env.PULSEWIRE_SKIP_MIGRATIONS === "1") {
    console.log("[migrate] PULSEWIRE_SKIP_MIGRATIONS=1, skipping")
    return
  }
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.warn("[migrate] DATABASE_URL not set; skipping migrations")
    return
  }

  // outputFileTracingIncludes copies ./drizzle into the standalone bundle
  // at the project root. process.cwd() is the bundle root at runtime.
  const candidates = [
    path.join(process.cwd(), "drizzle"),
    path.join(process.cwd(), "..", "..", "drizzle"),
  ]
  const migrationsFolder = candidates.find(p => fs.existsSync(p))
  if (!migrationsFolder) {
    throw new Error(\`[migrate] could not locate drizzle migrations\`)
  }

  console.log(\`[migrate] applying migrations from \${migrationsFolder}\`)
  const client = postgres(databaseUrl, { max: 1, ssl: "require" })
  try {
    await migrate(drizzle(client), { migrationsFolder })
    console.log("[migrate] migrations applied")
  } finally {
    await client.end({ timeout: 5 })
  }

  // ... seed starter feeds, source bias, demo user ...
}`}</CodePre>

          <h3>Why two files</h3>
          <p>
            <code>instrumentation.ts</code> can run in either Edge or Node runtime; Next.js picks based on
            <code>process.env.NEXT_RUNTIME</code>. Edge can't import <code>node:fs</code>, <code>postgres</code>, etc.
            The two-file split: the thin entry checks the runtime; the heavy file only loads via dynamic import in
            Node. Edge boots run a no-op.
          </p>

          <h3>What runs at boot</h3>
          <ol>
            <li>Apply pending Drizzle migrations (idempotent — <code>migrate()</code> tracks applied migrations in a table).</li>
            <li>Seed source-bias data (left/right/center scoring for feed domains).</li>
            <li>Ensure starter feeds exist (the default subscription list for new users).</li>
            <li>Backfill subscriptions for all existing users (in case the starter set changed).</li>
            <li>Create/refresh the demo user.</li>
          </ol>

          <p>Total boot time on B1: ~3-5 seconds. The deploy workflow tolerates this via the 5-minute health-check window.</p>

          <h3>Where to put boot-time code</h3>
          <table>
            <tbody>
              <tr><th>Need</th><th>File</th></tr>
              <tr><td>One-time async init (migrations, seeds, model warmups)</td><td><code>instrumentation.ts</code></td></tr>
              <tr><td>Synchronous module-load side effects</td><td>The module itself (rare; avoid)</td></tr>
              <tr><td>Server-only env validation</td><td><code>env.ts</code> via <code>@t3-oss/env-nextjs</code></td></tr>
              <tr><td>Per-request setup</td><td>middleware <code>proxy.ts</code> or each route handler</td></tr>
            </tbody>
          </table>

          <h3>The Skip Flag</h3>
          <p>
            <code>PULSEWIRE_SKIP_MIGRATIONS=1</code> lets you boot the app without running migrations — useful for
            emergency hotfixes when a migration is misbehaving. Set it in App Service config, redeploy, fix the
            migration, then unset.
          </p>
        </section>

        <hr />

        {/* SECTION 8 — LAUNCH SCRIPT */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Two Processes, One Container</h2>
          <p>
            PulseWire ships <em>two</em> Node processes per container: the Next.js server AND the graphile-worker
            (Postgres-backed job queue). They start together, die together. The orchestrator is a tiny
            <code>scripts/launch-prod.mjs</code>.
          </p>

          <h3>The full launch script</h3>
          <CodePre>{`// PulseWire/scripts/launch-prod.mjs — verbatim
#!/usr/bin/env node
// Launches the Next.js standalone server AND the graphile-worker process
// inside a single container. If either exits, both go down so App Service
// restarts cleanly.
import { spawn } from "node:child_process"

const procs = []

function start(name, cmd, args) {
  console.log(\`[launch] starting \${name}: \${cmd} \${args.join(" ")}\`)
  const child = spawn(cmd, args, { stdio: "inherit", env: process.env })
  child.on("exit", (code, signal) => {
    console.error(\`[launch] \${name} exited code=\${code} signal=\${signal}\`)
    shutdown(code ?? 1)
  })
  procs.push({ name, child })
}

function shutdown(code) {
  for (const { name, child } of procs) {
    if (!child.killed) {
      console.log(\`[launch] killing \${name}\`)
      child.kill("SIGTERM")
    }
  }
  setTimeout(() => process.exit(code), 2000).unref()
}

process.on("SIGINT",  () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))

start("web",    "node", ["server.js"])
start("worker", "node", ["dist/worker.mjs"])`}</CodePre>

          <h3>The lifecycle</h3>
          <ol>
            <li><strong>Container starts</strong> → runs <code>node scripts/launch-prod.mjs</code> (set as Dockerfile CMD).</li>
            <li><strong>Launcher spawns both</strong> child processes with shared env.</li>
            <li><strong>Each child runs independently</strong> until one dies.</li>
            <li><strong>On any child exit</strong>: launcher SIGTERMs the survivors, then exits with the dead child's code.</li>
            <li><strong>App Service sees an exit</strong> → restarts the container.</li>
            <li><strong>Or: container gets SIGTERM</strong> (deploy / scale-down) → launcher relays to both children → exit.</li>
          </ol>

          <h3>Why one container, two processes</h3>
          <p>The alternative — separate containers for web + worker — would mean:</p>
          <ul>
            <li>Two App Services (double the B1 cost).</li>
            <li>Two deploy targets (two workflows or one with branches).</li>
            <li>Two health-check endpoints.</li>
            <li>Inter-container coordination (which they don't need — both talk to the same Postgres).</li>
          </ul>
          <p>For PulseWire's scale, one container is right. The launch script is the minimum glue.</p>

          <h3>The 2-second grace period</h3>
          <CodePre>{`setTimeout(() => process.exit(code), 2000).unref()`}</CodePre>
          <p>Two seconds after SIGTERM, force exit. Long enough for the children to finish in-flight HTTP responses; short enough that App Service doesn't time out the container shutdown (it gives ~30 seconds).</p>

          <h3>Building the worker</h3>
          <CodePre>{`# PulseWire's worker is bundled with esbuild at image-build time
RUN node ./scripts/build-worker.mjs    # produces dist/worker.mjs`}</CodePre>

          <p>Why bundled rather than launched directly: graphile-worker resolves task modules at startup from a tasks directory. esbuild bundles all of them into a single file the runtime can spawn cleanly inside the standalone Node output.</p>

          <h3>Process supervision alternatives</h3>
          <p>For more complex needs (logs to different files, retries, restart limits), reach for <code>pm2</code> or systemd. PulseWire's simple "die together" model needs neither.</p>
        </section>

        <hr />

        {/* SECTION 9 — NEXT.CONFIG */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span><code>next.config.ts</code> — Standalone Output</h2>
          <p>
            Next.js's build mode controls what <code>npm run build</code> emits. PulseWire uses
            <code>output: 'standalone'</code> — produces a self-contained <code>.next/standalone/</code> directory
            with only the files needed to run the app. Docker packaging gets dramatically smaller.
          </p>

          <h3>The full config</h3>
          <CodePre>{`// PulseWire/next.config.ts — verbatim
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
  },
  // Include drizzle SQL migrations and data/ JSON seeds in the standalone
  // bundle so instrumentation.ts can apply migrations and seed feeds.
  outputFileTracingIncludes: {
    "/*": ["./drizzle/**/*", "./data/**/*.json"],
  },
}

export default nextConfig`}</CodePre>

          <h3>What standalone produces</h3>
          <CodePre>{`.next/standalone/
├── server.js              # entry point — start it with: node server.js
├── node_modules/          # tree-shaken: only what server.js imports
├── package.json           # minimal manifest
├── .next/                 # compiled output (re-included)
└── (your traced files)    # via outputFileTracingIncludes`}</CodePre>

          <p>Compare with default: the full <code>node_modules/</code> + entire project. Standalone is ~10-20× smaller — important for Docker layer caching.</p>

          <h3>The trace step</h3>
          <p>
            Next.js analyzes which files each route imports (transitively) and copies only those to the standalone
            output. Static assets, SQL files, JSON config — anything <em>not</em> imported by JS isn't included by
            default. <code>outputFileTracingIncludes</code> lets you force-include extra files.
          </p>

          <p>PulseWire includes:</p>
          <ul>
            <li><code>./drizzle/**/*</code> — SQL migration files that <code>instrumentation-node.ts</code> reads at boot</li>
            <li><code>./data/**/*.json</code> — seed data files</li>
          </ul>

          <p>Without these, instrumentation throws "could not locate drizzle migrations" on first boot.</p>

          <h3>The Docker side</h3>
          <CodePre>{`# Dockerfile runner stage (simplified)
FROM node:22-alpine AS runner
WORKDIR /app

# Copy the standalone output (includes server.js + traced node_modules)
COPY --from=builder /app/.next/standalone ./
# Copy public assets + static (CSS, fonts)
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Copy the worker bundle
COPY --from=builder /app/dist/worker.mjs ./dist/worker.mjs
# Copy the launcher
COPY scripts/launch-prod.mjs ./scripts/launch-prod.mjs

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "scripts/launch-prod.mjs"]`}</CodePre>

          <h3>Other notable config options</h3>
          <table>
            <tbody>
              <tr><th>Option</th><th>Effect</th></tr>
              <tr><td><code>output: 'export'</code></td><td>Static site export — no server, just HTML.</td></tr>
              <tr><td><code>output: 'standalone'</code></td><td>Self-contained Node app (PulseWire's choice).</td></tr>
              <tr><td><code>output: undefined</code></td><td>Default — needs the whole project at runtime.</td></tr>
              <tr><td><code>{'images: { remotePatterns }'}</code></td><td>Allowed external image domains for <code>next/image</code>.</td></tr>
              <tr><td><code>experimental.serverActions</code></td><td>Enable/configure Server Actions.</td></tr>
              <tr><td><code>experimental.optimizePackageImports</code></td><td>Auto tree-shake big libraries on import.</td></tr>
              <tr><td><code>outputFileTracingExcludes</code></td><td>Force-exclude files from the trace.</td></tr>
              <tr><td><code>poweredByHeader: false</code></td><td>Strip the <code>X-Powered-By: Next.js</code> header.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 10 — PWA */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>PWA Service Worker (install-only)</h2>
          <p>
            PulseWire is installable as a PWA on iOS and desktop. The minimum for Chromium's "Add to Home Screen" prompt:
            a manifest + an install-only service worker. PulseWire ships both; offline reading is a planned future
            feature.
          </p>

          <h3>The manifest</h3>
          <CodePre>{`// PulseWire/public/manifest.webmanifest (excerpt)
{
  "name": "PulseWire",
  "short_name": "PulseWire",
  "description": "AI-native RSS reader",
  "start_url": "/app/reader",
  "display": "standalone",
  "background_color": "#0b1020",
  "theme_color": "#0b1020",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}`}</CodePre>

          <p>Linked from the root layout via <code>metadata.manifest</code>:</p>
          <CodePre>{`export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
}`}</CodePre>

          <h3>The install-only service worker</h3>
          <CodePre>{`// PulseWire/public/sw.js — pattern
self.addEventListener('install', (event) => {
  self.skipWaiting()   // ← activate immediately, no waiting for old tabs
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())   // ← take control of open clients
})

self.addEventListener('fetch', (event) => {
  // Pass through — no caching, no offline. The fetch handler must exist for
  // Chrome to consider the app installable, even if it does nothing.
  event.respondWith(fetch(event.request))
})`}</CodePre>

          <h3>Why an empty fetch handler</h3>
          <p>Chromium's installability heuristic checks for: HTTPS + manifest + service worker with a <code>fetch</code> listener. The listener doesn't have to DO anything — it just has to exist. PulseWire's passes through; future versions will add Cache API logic for offline reading.</p>

          <h3>Registering the SW</h3>
          <CodePre>{`// In a Client Component (e.g. layout's client section)
'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])
  return null
}`}</CodePre>

          <h3>iOS-specific manifest hints</h3>
          <p>The root layout's <code>metadata.appleWebApp</code> + <code>apple-touch-icon</code> images make the iOS Add-to-Home-Screen experience native:</p>
          <CodePre>{`appleWebApp: {
  capable: true,                          // run standalone, no Safari chrome
  statusBarStyle: "black-translucent",
  title: "PulseWire",
},
icons: {
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
}`}</CodePre>

          <h3>What's not yet built</h3>
          <ul>
            <li>Offline reading (would require Cache API + reader-data caching strategy)</li>
            <li>Background sync (sw + Periodic Background Sync API)</li>
            <li>Push notifications (sw + Web Push)</li>
          </ul>
          <p>The install-only sw is the minimum to <em>be</em> a PWA; the rest is roadmap.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a Next.js Skeleton</h2>
          <p>Stand up a Next.js 16 app with a Server Component layout, an auth-gated section via proxy.ts, a Route Handler, the lazy DB Proxy pattern, and an instrumentation hook. ~30 minutes.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`npx create-next-app@latest next-lab \\
  --typescript --app --tailwind --src-dir --import-alias '@/*' --no-eslint
cd next-lab
npm i jose
npm i better-sqlite3
npm i -D @types/better-sqlite3`}</CodePre>

          <h3>Step 2 — next.config.ts</h3>
          <CodePre>{`// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
}

export default nextConfig`}</CodePre>

          <h3>Step 3 — Lazy DB Proxy</h3>
          <CodePre>{`// src/db/client.ts
import Database from 'better-sqlite3'

declare global {
  var __db: Database.Database | undefined
}

function ensure() {
  if (globalThis.__db) return globalThis.__db
  const path = process.env.DB_PATH ?? './app.db'
  const db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(\`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  \`)
  if (process.env.NODE_ENV !== 'production') globalThis.__db = db
  return db
}

export const db = new Proxy({} as Database.Database, {
  get(_t, prop, receiver) {
    return Reflect.get(ensure() as object, prop, receiver)
  },
}) as Database.Database`}</CodePre>

          <h3>Step 4 — instrumentation hook</h3>
          <CodePre>{`// src/instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { runBoot } = await import('./instrumentation-node')
  await runBoot()
}

// src/instrumentation-node.ts
export async function runBoot() {
  console.log('[boot] running boot-time init')
  // (in a real app, run migrations + seed here)
  const { db } = await import('./db/client')
  const n = db.prepare('SELECT COUNT(*) as n FROM notes').get() as { n: number }
  console.log(\`[boot] notes table has \${n.n} rows\`)
}`}</CodePre>

          <h3>Step 5 — Server Component layout</h3>
          <CodePre>{`// src/app/layout.tsx — already created by create-next-app; verify it's a Server Component (no 'use client')
import './globals.css'

export const metadata = { title: 'Next Lab' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}</CodePre>

          <h3>Step 6 — A public page + protected /app section</h3>
          <CodePre>{`// src/app/page.tsx (public)
import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Next Lab</h1>
      <p>Public landing page.</p>
      <Link href="/app/dashboard">Go to dashboard (auth required)</Link>
    </main>
  )
}`}</CodePre>

          <CodePre>{`// src/app/app/dashboard/page.tsx (protected)
import { db } from '@/db/client'

export default async function Dashboard() {
  const notes = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all() as Array<{ id: number; title: string; created_at: string }>

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Dashboard</h1>
      <p>You're signed in. Here are your notes:</p>
      <ul>
        {notes.map(n => <li key={n.id}>{n.title} — {n.created_at}</li>)}
      </ul>
    </main>
  )
}`}</CodePre>

          <h3>Step 7 — A Route Handler to add notes</h3>
          <CodePre>{`// src/app/api/notes/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all()
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const { title } = await req.json()
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })
  const info = db.prepare('INSERT INTO notes (title) VALUES (?)').run(title)
  return NextResponse.json({ id: Number(info.lastInsertRowid) }, { status: 201 })
}`}</CodePre>

          <h3>Step 8 — proxy.ts gating /app</h3>
          <p>For the lab, we'll use a simple cookie check. In a real app this'd be a signed JWT (covered in the MSAL Node guide).</p>
          <CodePre>{`// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server'

const FAKE_AUTH_COOKIE = 'lab-auth'

export function proxy(req: NextRequest) {
  if (req.cookies.get(FAKE_AUTH_COOKIE)?.value === 'yes') {
    return NextResponse.next()
  }
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('returnTo', req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/app/:path*'],
}`}</CodePre>

          <h3>Step 9 — A "login" route</h3>
          <CodePre>{`// src/app/login/page.tsx (Server Component with a Client form)
'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const params = useSearchParams()
  const returnTo = params.get('returnTo') ?? '/app/dashboard'

  function fakeSignIn() {
    document.cookie = \`lab-auth=yes; Path=/; SameSite=Lax\`
    router.push(returnTo)
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Sign in</h1>
      <button onClick={fakeSignIn}>Fake sign-in</button>
    </main>
  )
}`}</CodePre>

          <h3>Step 10 — Run + test</h3>
          <CodePre>{`npm run dev`}</CodePre>

          <ol>
            <li>Visit <code>http://localhost:3000</code> — landing page renders.</li>
            <li>Click "Go to dashboard" — redirects to <code>/login?returnTo=/app/dashboard</code> via proxy.</li>
            <li>Click "Fake sign-in" — sets cookie, redirects to dashboard.</li>
            <li>Dashboard renders. Notes table is empty.</li>
            <li>From DevTools console: <code>fetch('/api/notes', {`{ method: 'POST', body: JSON.stringify({ title: 'Hello' }), headers: { 'Content-Type': 'application/json' } }`})</code></li>
            <li>Refresh. Dashboard now shows "Hello".</li>
            <li>Check server console — you should see <code>[boot] running boot-time init</code> + <code>[boot] notes table has 1 rows</code> on the next request after the insert.</li>
          </ol>

          <h3>Step 11 — Build standalone</h3>
          <CodePre>{`npm run build
ls .next/standalone/`}</CodePre>

          <p>You should see <code>server.js</code> + a minimal <code>node_modules/</code>. Run it:</p>
          <CodePre>{`cd .next/standalone
DB_PATH=../../app.db node server.js`}</CodePre>

          <p>Hit <code>http://localhost:3000</code> — same site, running from the standalone build.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated every PulseWire-shape feature: Server Component layout, proxy.ts auth gate, Route
              Handlers, lazy DB Proxy, instrumentation hook, standalone output. Swap better-sqlite3 for postgres + add
              MSAL Node and you're at PulseWire's exact shape.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Cannot read .env at build time" / "DATABASE_URL is not set"</h3>
          <p>You're opening a DB connection at module load. Wrap it in the lazy Proxy pattern (§6). Top-level DB calls run during <code>next build</code>'s static-analysis phase, where env vars aren't populated.</p>

          <h3>"Error: Dynamic server usage" at build time</h3>
          <p>A route handler is trying to read cookies/headers/searchParams but doesn't have <code>dynamic = "force-dynamic"</code>. Add it. Next.js is trying to pre-render the route and failing because it has no request context.</p>

          <h3>"params should be awaited" warning</h3>
          <p>Next 16's params are now async. Change <code>{`{ params }: { params: { id: string } }`}</code> to <code>{`{ params }: { params: Promise<{ id: string }> }`}</code> and <code>await params</code>.</p>

          <h3>"Cannot use 'use client' in a route handler"</h3>
          <p>Route handlers (<code>route.ts</code>) ARE server-only by definition. There's no client-side variant. Don't add <code>"use client"</code>.</p>

          <h3>Server Component is shipping JS to the browser</h3>
          <p>You imported a Client Component from it. The Client Component's JS ships; the wrapper Server Component's doesn't. Inspect the bundle with <code>npx @next/bundle-analyzer</code>.</p>

          <h3>"Module not found: Can't resolve 'fs'"</h3>
          <p>A file imports <code>node:fs</code> but is being bundled for the Edge runtime. Either: (a) split into Edge-compatible + Node-only files (the instrumentation pattern), (b) explicitly set <code>runtime = "nodejs"</code> in the route.</p>

          <h3>Hot-reload opens new DB connections forever</h3>
          <p>Wrap the connection in <code>globalThis.__pgClient</code> (or similar) cache in dev. The Proxy pattern in §6 handles this.</p>

          <h3>Standalone build runs locally but fails on App Service</h3>
          <p>Missing traced files. Use <code>outputFileTracingIncludes</code> in <code>next.config.ts</code> to copy SQL migrations, JSON seeds, or any other non-imported files into the standalone output.</p>

          <h3>Proxy doesn't run on a route</h3>
          <p>The matcher pattern doesn't match. Patterns are anchored at the start; <code>"/app/:path*"</code> matches <code>/app/anything</code> but NOT <code>/foo/app/bar</code>. Test with the Next.js docs' matcher tool.</p>

          <h3>"Cannot find module './instrumentation-node'"</h3>
          <p>You're testing locally, instrumentation.ts ran in the Edge runtime, dynamic-imported the Node file, but no <code>NEXT_RUNTIME=nodejs</code> was set. Check that the early-return-on-non-Node guard is in place.</p>

          <h3>App Service deploy succeeds but app 502s</h3>
          <p>Most common: <code>WEBSITES_PORT</code> mismatch. App Service expects your container to listen on the port it set; PulseWire ships with <code>PORT=3000</code>. Configure either.</p>

          <h3>graphile-worker process dies on boot, restart loop</h3>
          <p>Three likely causes: (a) <code>DATABASE_URL</code> wrong/unreachable, (b) <code>graphile_worker</code> schema not yet created (run migrations first), (c) the worker bundle path is wrong (verify <code>dist/worker.mjs</code> exists in the runner image).</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Special files</h3>
          <CodePre>{`page.tsx            # renders the route
layout.tsx          # wraps the route + descendants (persistent)
loading.tsx         # automatic Suspense boundary
error.tsx           # error boundary (must be 'use client')
not-found.tsx       # 404 boundary
route.ts            # REST handler (GET, POST, etc.)
proxy.ts            # URL-level handler (was middleware.ts in <16)
instrumentation.ts  # boot-once init
template.tsx        # like layout but remounts on navigation`}</CodePre>

          <h3>Component types</h3>
          <CodePre>{`// Default — Server Component
export default async function Page() {
  const data = await fetch(...).then(r => r.json())
  return <div>{data.foo}</div>
}

// Client Component
'use client'
export default function Counter() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n+1)}>{n}</button>
}`}</CodePre>

          <h3>Route Handler</h3>
          <CodePre>{`export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  return NextResponse.json({ saved: true }, { status: 201 })
}`}</CodePre>

          <h3>proxy.ts skeleton</h3>
          <CodePre>{`import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  if (/* allow */ true) return NextResponse.next()
  return NextResponse.redirect(new URL('/login', req.url))
}

export const config = {
  matcher: ['/app/:path*'],
}`}</CodePre>

          <h3>Lazy DB Proxy</h3>
          <CodePre>{`function ensure() {
  if (!_db) _db = openConnection()
  return _db
}

export const db = new Proxy({} as DbType, {
  get(_t, prop, receiver) {
    return Reflect.get(ensure() as object, prop, receiver)
  },
}) as DbType`}</CodePre>

          <h3>instrumentation.ts</h3>
          <CodePre>{`export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { runMigrations } = await import('./instrumentation-node')
  await runMigrations()
}`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>Root Server Layout</td><td>PulseWire · <code>src/app/layout.tsx</code></td></tr>
              <tr><td>proxy.ts with JWT-cookie session</td><td>PulseWire · <code>src/proxy.ts</code> (full file)</td></tr>
              <tr><td>Route Handler with session + db</td><td>PulseWire · <code>src/app/api/reader/articles/route.ts</code></td></tr>
              <tr><td>Lazy DB Proxy</td><td>PulseWire · <code>src/db/client.ts</code></td></tr>
              <tr><td>Two-file instrumentation</td><td>PulseWire · <code>src/instrumentation.ts</code> + <code>src/instrumentation-node.ts</code></td></tr>
              <tr><td>Dual-process launcher</td><td>PulseWire · <code>scripts/launch-prod.mjs</code></td></tr>
              <tr><td>output: standalone + tracing</td><td>PulseWire · <code>next.config.ts</code></td></tr>
              <tr><td>Zod env validation</td><td>PulseWire · <code>src/env.ts</code></td></tr>
              <tr><td>PWA manifest + metadata</td><td>PulseWire · <code>src/app/layout.tsx</code> + <code>public/manifest.webmanifest</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: MSAL Node + Server-Side OIDC.</p>
        </section>
      </main>
    </div>
  );
}
