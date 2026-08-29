import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Confidential Client vs SPA',       icon: '⚖️' },
  { id: 's3',  num: '3',  title: 'MSAL Node Setup',                  icon: '⚙️' },
  { id: 's4',  num: '4',  title: 'The OIDC Auth Code + PKCE Flow',   icon: '🔐' },
  { id: 's5',  num: '5',  title: 'The /auth/login Route',            icon: '↪️' },
  { id: 's6',  num: '6',  title: 'The /auth/callback Route',         icon: '↩️' },
  { id: 's7',  num: '7',  title: 'Session Cookies (HS256 JWT)',      icon: '🍪' },
  { id: 's8',  num: '8',  title: '__Host- Prefix + Cookie Flags',    icon: '🛡️' },
  { id: 's9',  num: '9',  title: 'Reading the Session in Handlers',  icon: '📖' },
  { id: 's10', num: '10', title: 'Logout',                           icon: '👋' },
  { id: 's11', num: '★',  title: 'Lab: Build the Whole Flow',        icon: '🛠️' },
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

export default function MsalNodeGuide() {
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
            <span className="sidebar-title">MSAL Node + OIDC</span>
          </div>
          <div className="sidebar-sub">PulseWire's server-side auth</div>
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
          <div className="hero-tag">🔒 @azure/msal-node 5 · jose 6 · 2026</div>
          <h1>MSAL Node<br />Server-Side OIDC</h1>
          <p>
            PulseWire is the only fleet app with <strong style={{ color: '#C77AA0' }}>fully server-side auth</strong> —
            no client-side MSAL, no Bearer tokens in localStorage, no exposed client secrets. Instead: OIDC
            Authorization Code flow with PKCE, handled by <code>@azure/msal-node</code>, finalized as an HS256-signed
            JWT in an HTTP-only cookie. This guide walks the entire flow — login, callback, session creation, route
            handler reads, and logout — with PulseWire's real code.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">Server-side</span><span className="hero-stat-label">No client MSAL</span></div>
            <div className="hero-stat"><span className="hero-stat-val">__Host-</span><span className="hero-stat-label">Cookie prefix</span></div>
            <div className="hero-stat"><span className="hero-stat-val">PKCE</span><span className="hero-stat-label">S256 challenge</span></div>
            <div className="hero-stat"><span className="hero-stat-val">14d</span><span className="hero-stat-label">Session lifetime</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Server-side OIDC means: the user's browser never holds an Entra token. The server does the OAuth dance, then
            issues its OWN session token (an HS256-signed JWT) and puts it in an HTTP-only cookie. The cookie is the
            only thing the browser carries; everything else is server-only.
          </p>

          <h3>Two analogies</h3>
          <p>
            <strong>The hotel key card system.</strong> When you sign in to a Fleet App that uses MSAL React, you carry
            your passport (the Entra access token) around the hotel — every door reads it. PulseWire's pattern: you
            trade your passport at the front desk for a hotel-issued key card. You only carry the key card; the
            passport stays in the safe. The key card is meaningful only inside this hotel.
          </p>
          <p>
            <strong>OAuth as a coatcheck.</strong> Server-side OIDC is "give us your coat (auth code), here's a numbered
            ticket (session cookie)." Client-side MSAL is "carry your own coat around with you and show it to every
            door." Both work; the coatcheck is harder to lose.
          </p>

          <h3>The five-step flow</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User browser
  participant P as PulseWire server
  participant E as Entra ID
  Note over U,P: 1. Unauthenticated request to /app
  U->>P: GET /app/reader
  P->>P: proxy.ts checks cookie → none
  P->>U: 302 → /auth/login
  Note over U,E: 2. OAuth Authorization Code with PKCE
  U->>P: GET /auth/login
  P->>P: generate PKCE verifier + challenge, state, nonce
  P->>U: set auth-state cookie, 302 → Entra
  U->>E: GET /authorize?...
  U->>E: sign in (MFA, etc.)
  E->>U: 302 → /auth/callback?code=...&state=...
  Note over U,P: 3. Callback exchanges code for tokens
  U->>P: GET /auth/callback?code=...&state=...
  P->>P: validate state cookie, get PKCE verifier
  P->>E: acquireTokenByCode (server-to-server)
  E->>P: ID token + access token + refresh
  P->>P: extract oid/email/name from ID token
  Note over U,P: 4. Server mints its OWN session JWT
  P->>P: SignJWT(claims, HS256, SESSION_SECRET)
  P->>U: Set-Cookie __Host-pulsewire-session=...
  P->>U: 302 → /app/reader (the originally requested URL)
  Note over U,P: 5. Subsequent requests
  U->>P: GET /app/reader [cookie]
  P->>P: proxy.ts verifies cookie JWT → ok
  P->>U: render page`} />

          <h3>What's different from client-side MSAL</h3>
          <table>
            <tbody>
              <tr><th></th><th>Client-side MSAL React</th><th>Server-side MSAL Node (PulseWire)</th></tr>
              <tr><td>Where the OAuth dance happens</td><td>In the browser, via popup or redirect</td><td>On the server, via redirect through your origin</td></tr>
              <tr><td>Where tokens are stored</td><td>Browser localStorage</td><td>Browser cookie (server-issued, server-signed)</td></tr>
              <tr><td>Client secret</td><td>None (public client; PKCE-only)</td><td>Yes (confidential client; from Entra)</td></tr>
              <tr><td>Token refresh</td><td>Browser via MSAL silent</td><td>Server-side (when implemented; PulseWire just expires cookies)</td></tr>
              <tr><td>Token in your code</td><td>Bearer header on fetch</td><td>Cookie (read on the server only)</td></tr>
              <tr><td>XSS impact</td><td>Token theft possible if XSS</td><td>HTTP-only cookie is invisible to XSS</td></tr>
              <tr><td>CSRF impact</td><td>Bearer is immune (no auto-send)</td><td>Cookie + SameSite=Lax is mostly immune</td></tr>
              <tr><td>Setup complexity</td><td>Low — config + hooks</td><td>Higher — three routes + state cookies + PKCE</td></tr>
            </tbody>
          </table>

          <h3>When to pick server-side OIDC</h3>
          <ul>
            <li>You're building a server-rendered app (Next.js, Remix, Rails, Django, Phoenix) — not an SPA.</li>
            <li>You want HTTP-only cookies to eliminate the XSS-eats-token risk.</li>
            <li>You're processing the user's request on the server anyway — adding "read cookie" is cheap.</li>
            <li>You need access to refresh tokens on the server (e.g. to call Microsoft Graph on behalf of the user from a background job).</li>
            <li>You want to issue a session token shaped to YOUR API, decoupled from Entra's token format.</li>
          </ul>

          <h3>When NOT to</h3>
          <ul>
            <li>Pure SPA (no server). Use MSAL React.</li>
            <li>API-only backend with mobile/native clients sending Bearer tokens. Use server-side JWT validation.</li>
          </ul>

          <h3>Why PulseWire picks this pattern</h3>
          <p>
            PulseWire is server-rendered (Next.js App Router with Server Components). Every page load goes through the
            server anyway; the marginal cost of reading a cookie is microseconds. Compare with MSAL React on a Next.js
            app: every page would have to be a Client Component to access the MSAL hooks, defeating the point of
            Server Components. Cookie-based auth is the natural fit.
          </p>
        </section>

        <hr />

        {/* SECTION 2 — CONFIDENTIAL CLIENT */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Confidential Client vs SPA (Public) Client</h2>
          <p>Entra distinguishes two client kinds based on whether the app can keep a secret. The distinction matters because confidential clients use a different OAuth grant variant.</p>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th></th><th>Public client (SPA)</th><th>Confidential client (PulseWire)</th></tr>
              <tr><td>Auth library</td><td><code>@azure/msal-browser</code></td><td><code>@azure/msal-node</code></td></tr>
              <tr><td>Can keep a secret?</td><td>No — running in user's browser</td><td>Yes — running on your server</td></tr>
              <tr><td>Auth grant</td><td>Authorization Code + PKCE (no secret)</td><td>Authorization Code + PKCE + client secret</td></tr>
              <tr><td>Client credentials grant</td><td>Not available</td><td>Available (machine-to-machine)</td></tr>
              <tr><td>App reg platform type</td><td>"Single-page application"</td><td>"Web"</td></tr>
              <tr><td>Refresh tokens</td><td>Stored client-side (encrypted)</td><td>Stored server-side</td></tr>
            </tbody>
          </table>

          <h3>What changes in the app registration</h3>
          <p>For confidential clients, your app reg gets two additions:</p>
          <ol>
            <li><strong>A client secret</strong> (or certificate, or federated credential). Created under <strong>Certificates &amp; secrets → Client secrets → New client secret</strong>.</li>
            <li><strong>A "Web" platform redirect URI</strong> (not SPA). Under <strong>Authentication → Add a platform → Web</strong>.</li>
          </ol>

          <p>The redirect URIs look identical from the URL perspective (<code>https://yourapp.com/auth/callback</code>); what differs is the platform tag, which controls which OAuth grant Entra allows.</p>

          <h3>Federated credential alternative</h3>
          <p>If your server runs in Azure (App Service, Functions, AKS), you can replace the client secret with a federated credential — your managed identity authenticates to Entra without a stored secret. PulseWire currently uses a client secret stored in Key Vault; the federated path is on the roadmap.</p>

          <h3>The lifecycle of a confidential client secret</h3>
          <ol>
            <li>Generate in Entra → app reg → Certificates &amp; secrets.</li>
            <li>Choose validity (PulseWire: 1 year).</li>
            <li>Copy the secret VALUE immediately (not the secret ID — it shows once).</li>
            <li>Store in Key Vault (PulseWire uses <code>kv-pulsewire-prod</code> for this).</li>
            <li>Reference from App Service: <code>ENTRA_CLIENT_SECRET=@Microsoft.KeyVault(VaultName=...;SecretName=entra-client-secret)</code>.</li>
            <li>Set calendar reminder for ~11 months out to rotate.</li>
          </ol>

          <h3>The "public client + PKCE" alternative for server apps</h3>
          <p>You CAN run a server-side confidential-client-shaped flow without a secret if you use PKCE + treat the app as public. This is a less-common path; the standard for trusted server apps is confidential client with secret/cert. PulseWire takes the standard path.</p>
        </section>

        <hr />

        {/* SECTION 3 — MSAL NODE SETUP */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>MSAL Node Setup</h2>
          <p>Single helper module — <code>src/lib/auth/msal.ts</code> — returns the <code>ConfidentialClientApplication</code> instance. Per-process cached in dev (so hot-reload doesn't open a new one each time).</p>

          <h3>PulseWire's full msal.ts</h3>
          <CodePre>{`// PulseWire/src/lib/auth/msal.ts — verbatim
import { ConfidentialClientApplication, LogLevel } from "@azure/msal-node"
import { env } from "@/env"

declare global {
  var __msalClient: ConfidentialClientApplication | undefined
}

function build(): ConfidentialClientApplication {
  return new ConfidentialClientApplication({
    auth: {
      clientId: env.ENTRA_CLIENT_ID,
      authority: \`https://login.microsoftonline.com/\${env.ENTRA_TENANT_ID}\`,
      clientSecret: env.ENTRA_CLIENT_SECRET,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message) => {
          if (level <= LogLevel.Warning) console.log(\`[msal] \${message}\`)
        },
        piiLoggingEnabled: false,
        logLevel: LogLevel.Warning,
      },
    },
  })
}

export function msalClient(): ConfidentialClientApplication {
  if (env.NODE_ENV === "production") return build()
  globalThis.__msalClient ??= build()
  return globalThis.__msalClient
}

export const OIDC_SCOPES = ["openid", "profile", "email", "User.Read"]

export function redirectUri(): string {
  return \`\${env.APP_BASE_URL.replace(/\\/$/, "")}/auth/callback\`
}`}</CodePre>

          <h3>The <code>auth</code> config</h3>
          <table>
            <tbody>
              <tr><th>Key</th><th>What it is</th></tr>
              <tr><td><code>clientId</code></td><td>Entra app reg's client ID (GUID)</td></tr>
              <tr><td><code>authority</code></td><td>The tenant URL (no /v2.0 suffix for MSAL Node — it adds /oauth2/v2.0/token internally)</td></tr>
              <tr><td><code>clientSecret</code></td><td>The confidential client secret. CRITICAL: never log this</td></tr>
              <tr><td><code>clientCertificate</code></td><td>Alternative to clientSecret — cert thumbprint + private key</td></tr>
              <tr><td><code>clientAssertion</code></td><td>Alternative — JWT assertion (federated credential path)</td></tr>
            </tbody>
          </table>

          <h3>The dev caching pattern</h3>
          <p>
            Next.js hot-reloads modules on save. Without the <code>globalThis.__msalClient</code> cache, every save
            would re-instantiate <code>ConfidentialClientApplication</code> and reset its internal token cache. In
            production, modules load once — the cache is unnecessary, so PulseWire skips it
            (<code>if (NODE_ENV === 'production') return build()</code>).
          </p>

          <h3>The scopes</h3>
          <CodePre>{`export const OIDC_SCOPES = ["openid", "profile", "email", "User.Read"]`}</CodePre>

          <p>Four scopes the login route requests:</p>
          <ul>
            <li><code>openid</code> — required for OIDC; tells Entra to issue an ID token</li>
            <li><code>profile</code> — include the user's name, picture, etc.</li>
            <li><code>email</code> — include the user's email</li>
            <li><code>User.Read</code> — Microsoft Graph permission to read the user's profile</li>
          </ul>

          <p>If you don't need to call Graph, drop <code>User.Read</code>. The first three are enough to authenticate.</p>

          <h3>The redirect URI</h3>
          <CodePre>{`export function redirectUri(): string {
  return \`\${env.APP_BASE_URL.replace(/\\/$/, "")}/auth/callback\`
}`}</CodePre>

          <p>Built from the <code>APP_BASE_URL</code> env var. The trailing-slash strip is defensive — if the user set <code>APP_BASE_URL=https://pulsewire.example.com/</code>, the redirect would otherwise be <code>https://...com//auth/callback</code> which doesn't match the Entra app reg's allow-list.</p>

          <h3>Env validation</h3>
          <p>PulseWire validates these env vars at boot via Zod (see the Node Runtime guide §8):</p>
          <CodePre>{`// PulseWire/src/env.ts — relevant lines
server: {
  ENTRA_TENANT_ID: z.string().uuid(),
  ENTRA_CLIENT_ID: z.string().uuid(),
  ENTRA_CLIENT_SECRET: z.string().min(1),
  SESSION_SECRET: z.string().min(32),     // ← used for the cookie JWT
  APP_BASE_URL: z.string().url(),
  // ...
}`}</CodePre>

          <p>The <code>SESSION_SECRET.min(32)</code> enforcement is critical — short secrets are guessable; 32+ random bytes is the floor.</p>
        </section>

        <hr />

        {/* SECTION 4 — AUTH CODE + PKCE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The OIDC Authorization Code Flow + PKCE</h2>
          <p>The OAuth 2 grant used by web apps that can keep a secret. PKCE (Proof Key for Code Exchange) is bolted on as a hijack-prevention mechanism, originally for public clients but now standard for everyone.</p>

          <h3>Why not the implicit flow</h3>
          <p>The OAuth implicit flow (used by SPAs before PKCE was standard) returns tokens directly in the URL fragment. Browser history, referrer headers, and shoulder-surfing all leak the token. Auth Code + PKCE returns a one-time-use CODE that must be exchanged server-to-server; the code is useless without the PKCE verifier.</p>

          <h3>The dance, step by step</h3>
          <ol>
            <li><strong>Server generates a PKCE pair</strong>: a high-entropy <code>code_verifier</code> (random string) and its SHA-256 hash <code>code_challenge</code>.</li>
            <li><strong>Server stashes the verifier</strong> in a short-lived cookie keyed by a random <code>state</code> token.</li>
            <li><strong>Server redirects user to Entra</strong> with the <code>code_challenge</code> + <code>state</code> + scopes + redirect URI.</li>
            <li><strong>User authenticates at Entra</strong>.</li>
            <li><strong>Entra redirects user back</strong> to <code>redirect_uri?code=XXX&state=YYY</code>.</li>
            <li><strong>Server reads the state cookie</strong>, validates it matches the <code>state</code> param, retrieves the verifier.</li>
            <li><strong>Server calls Entra server-to-server</strong>: "trade this code + verifier + client secret for tokens."</li>
            <li><strong>Entra validates</strong>: code hasn't been used, verifier hashes to challenge, client secret matches. Returns ID + access + refresh tokens.</li>
            <li><strong>Server extracts claims</strong>, mints its own session JWT, sets cookie, redirects user to the originally-requested URL.</li>
          </ol>

          <h3>What PKCE prevents</h3>
          <p>Without PKCE, an attacker who intercepts the auth code (e.g. via URL leak, shoulder-surfing, sideloaded extension) can trade it for tokens. With PKCE, they also need the verifier — which never leaves the server.</p>

          <h3>What the state cookie prevents</h3>
          <p>The state cookie + state URL param matching is anti-CSRF — it prevents an attacker from sending a victim's browser a forged callback URL with their own auth code. The state cookie is set when the legitimate login starts; an attacker's forged callback wouldn't have a matching state cookie.</p>

          <h3>What the nonce prevents</h3>
          <p>The nonce is included in the auth request and echoed in the ID token. By comparing them, the server confirms the ID token came from the auth request it just initiated (not a replay of an earlier session). PulseWire generates one and verifies it (covered in §6).</p>
        </section>

        <hr />

        {/* SECTION 5 — LOGIN ROUTE */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>The <code>/auth/login</code> Route</h2>
          <p>The entry point. Generates PKCE + state + nonce, stashes them in a short-lived cookie, redirects user to Entra.</p>

          <h3>PulseWire's full login route</h3>
          <CodePre>{`// PulseWire/src/app/auth/login/route.ts — verbatim
import { CryptoProvider } from "@azure/msal-node"
import { NextResponse } from "next/server"

import { msalClient, OIDC_SCOPES, redirectUri } from "@/lib/auth/msal"
import { createAuthState } from "@/lib/auth/session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const postLogin = url.searchParams.get("returnTo") ?? "/app"

  const crypto = new CryptoProvider()
  const { verifier, challenge } = await crypto.generatePkceCodes()
  const state = crypto.createNewGuid()
  const nonce = crypto.createNewGuid()

  await createAuthState({
    code_verifier: verifier,
    state,
    nonce,
    post_login_redirect: postLogin,
  })

  const authUrl = await msalClient().getAuthCodeUrl({
    scopes: OIDC_SCOPES,
    redirectUri: redirectUri(),
    codeChallenge: challenge,
    codeChallengeMethod: "S256",
    state,
    nonce,
    responseMode: "query",
    prompt: "select_account",
  })

  return NextResponse.redirect(authUrl)
}`}</CodePre>

          <h3>The CryptoProvider</h3>
          <p><code>@azure/msal-node</code> ships a <code>CryptoProvider</code> helper for the OAuth primitives — PKCE pairs, GUIDs, encryption. You could use Node's <code>crypto</code> module directly; the helper is a convenience.</p>

          <CodePre>{`const crypto = new CryptoProvider()
const { verifier, challenge } = await crypto.generatePkceCodes()
// verifier:  random 43+ char URL-safe string (kept secret)
// challenge: SHA-256(verifier) base64url-encoded (sent in URL)

const state = crypto.createNewGuid()  // e.g. "a4f1c8e2-..."
const nonce = crypto.createNewGuid()  // e.g. "b9c3d7f4-..."`}</CodePre>

          <h3>The auth-state cookie</h3>
          <p>PulseWire stashes the verifier, state, nonce, and post-login redirect target in a short-lived cookie:</p>
          <CodePre>{`await createAuthState({
  code_verifier: verifier,
  state,
  nonce,
  post_login_redirect: postLogin,
})`}</CodePre>

          <p>The cookie is keyed by <code>__Host-pulsewire-auth-state</code> (or similar) and lives for 10 minutes — long enough for the user to complete sign-in, short enough that stale state can't be replayed later. The contents are signed (HS256) the same way as the session cookie.</p>

          <h3><code>getAuthCodeUrl</code></h3>
          <CodePre>{`const authUrl = await msalClient().getAuthCodeUrl({
  scopes: OIDC_SCOPES,
  redirectUri: redirectUri(),
  codeChallenge: challenge,
  codeChallengeMethod: "S256",   // ← S256 (SHA-256) is the only good option; "plain" is deprecated
  state,
  nonce,
  responseMode: "query",          // ← code returned via ?code=... vs fragment #code=...
  prompt: "select_account",       // ← always show account picker
})`}</CodePre>

          <p>The returned URL is something like:</p>
          <CodePre>{`https://login.microsoftonline.com/<tenant>/oauth2/v2.0/authorize?
  client_id=<...>&
  response_type=code&
  redirect_uri=https://pulsewire.example.com/auth/callback&
  response_mode=query&
  scope=openid+profile+email+User.Read&
  code_challenge=<sha256-hash>&
  code_challenge_method=S256&
  state=a4f1c8e2-...&
  nonce=b9c3d7f4-...&
  prompt=select_account`}</CodePre>

          <h3>The <code>prompt</code> options</h3>
          <table>
            <tbody>
              <tr><th>Value</th><th>Behavior</th></tr>
              <tr><td><code>select_account</code></td><td>Always show the account picker (PulseWire's choice)</td></tr>
              <tr><td><code>none</code></td><td>Silently sign in if a session exists; fail if not</td></tr>
              <tr><td><code>login</code></td><td>Always re-prompt for credentials</td></tr>
              <tr><td><code>consent</code></td><td>Always re-prompt for permissions</td></tr>
            </tbody>
          </table>

          <p><code>select_account</code> is friendly when a user has multiple Microsoft accounts; <code>none</code> would silently use the wrong one.</p>

          <h3>The returnTo dance</h3>
          <p>If the proxy redirected from <code>/app/reader</code>, the login URL includes <code>?returnTo=/app/reader</code>. PulseWire stores that in the auth-state cookie. The callback (§6) reads it and redirects there after sign-in. Without it, every login lands on <code>/app</code>'s home.</p>
        </section>

        <hr />

        {/* SECTION 6 — CALLBACK ROUTE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The <code>/auth/callback</code> Route</h2>
          <p>Where the user lands after authenticating at Entra. Reads the state cookie, calls <code>acquireTokenByCode</code>, validates the token, mints the session cookie, redirects.</p>

          <h3>The full callback (key portions)</h3>
          <CodePre>{`// PulseWire/src/app/auth/callback/route.ts — key sections, verbatim
export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const oidcError = url.searchParams.get("error")
  if (oidcError) return fail(\`entra error: \${oidcError}\`)
  if (!code || !state) return fail("missing code or state")

  const authState = await consumeAuthState(state)   // ← validates state + retrieves verifier
  if (!authState) return fail("auth state cookie missing or expired")

  let result
  try {
    result = await msalClient().acquireTokenByCode({
      code,
      scopes: OIDC_SCOPES,
      redirectUri: redirectUri(),
      codeVerifier: authState.code_verifier,
    })
  } catch (e) {
    return fail(\`token exchange threw: \${(e as Error).message}\`)
  }
  if (!result) return fail("token exchange returned null")

  // ... extract claims, upsert user, etc. ...

  await createSession({
    sub: userId,
    oid: entraOid,
    email,
    name: displayName,
  })

  const target = new URL(authState.post_login_redirect, env.APP_BASE_URL)
  return NextResponse.redirect(target)
}`}</CodePre>

          <h3>The seven things this route does</h3>
          <ol>
            <li><strong>Parse query params</strong>: <code>code</code>, <code>state</code>, optional <code>error</code>.</li>
            <li><strong>Check for Entra error</strong>: if Entra returned an error, surface it immediately.</li>
            <li><strong>Consume the auth-state cookie</strong>: read + delete in one step. Returns the original verifier + nonce + post-login URL.</li>
            <li><strong>Reject mismatched state</strong>: the state URL param doesn't match the cookie's state.</li>
            <li><strong>Exchange code for tokens</strong>: server-to-server call to Entra via <code>acquireTokenByCode</code>.</li>
            <li><strong>Extract claims</strong>: pull <code>oid</code>, email, name from the ID token.</li>
            <li><strong>Mint session cookie + redirect</strong>: sign the session JWT, set the cookie, redirect to the originally-requested URL.</li>
          </ol>

          <h3><code>acquireTokenByCode</code> internally</h3>
          <CodePre>{`result = await msalClient().acquireTokenByCode({
  code,                                // the one-time code from the URL
  scopes: OIDC_SCOPES,                 // same scopes we requested in /login
  redirectUri: redirectUri(),          // same redirect_uri (Entra cross-checks)
  codeVerifier: authState.code_verifier,  // proves we initiated this flow
})

// result:
// {
//   accessToken: "eyJ0eXAi...",         ← for calling Graph
//   idToken:     "eyJ0eXAi...",          ← the user identity
//   idTokenClaims: { oid, name, email, ... },  ← decoded ID token
//   account:     { homeAccountId, ... },
//   tenantId:    "...",
//   tokenType:   "Bearer",
//   expiresOn:   Date,
//   ...
// }`}</CodePre>

          <h3>Why we use <code>idTokenClaims</code></h3>
          <p>MSAL Node already verified the ID token's signature server-to-server during <code>acquireTokenByCode</code>. The decoded claims are safe to use directly:</p>
          <CodePre>{`const claims = result.idTokenClaims as IdTokenClaims
const entraOid = claims.oid
const email    = claims.preferred_username ?? claims.email ?? ''
const display  = claims.name ?? email ?? 'User'`}</CodePre>

          <p>Compare with client-side flows where you'd validate the token via JWKS — MSAL Node does it for you here.</p>

          <h3>The user upsert</h3>
          <p>PulseWire upserts the user into its own <code>users</code> table on every callback (first sign-in creates the row, subsequent calls update <code>last_seen</code>). This is the server-side equivalent of Tabloom's auth-middleware upsert:</p>
          <CodePre>{`const userId = await upsertUser({
  entraOid:   claims.oid,
  email:      email,
  name:       display,
})`}</CodePre>

          <p>The returned <code>userId</code> is PulseWire's own internal ID (a UUID), distinct from the Entra OID. The session cookie's <code>sub</code> claim is this internal ID; the <code>oid</code> claim is the Entra OID. The decoupling means a user could rotate their Entra identity (rare) and PulseWire could keep their data intact.</p>

          <h3>The state-cookie consume</h3>
          <p><code>consumeAuthState(state)</code> does three things in one call: (a) read the cookie, (b) verify its state matches the URL param, (c) delete it. Critical: never leave the cookie around after consumption — replays would otherwise be possible.</p>

          <h3>Failure mode</h3>
          <p>The <code>fail()</code> helper returns a friendly error page rather than a stack trace. In production, the user sees "Authentication failed. Please try again." In dev, the underlying error is included.</p>
          <CodePre>{`function fail(reason: string) {
  console.warn('[auth] callback failed:', reason)
  const url = new URL('/auth/error', env.APP_BASE_URL)
  url.searchParams.set('reason', reason)
  return NextResponse.redirect(url)
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 7 — SESSION COOKIE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Session Cookies (HS256 JWT)</h2>
          <p>The session is an HS256-signed JWT, NOT an Entra-issued token. PulseWire mints its own. The signing key is <code>SESSION_SECRET</code> (a 32+ byte secret in Key Vault).</p>

          <h3>The session module</h3>
          <CodePre>{`// PulseWire/src/lib/auth/session.ts — key portions, verbatim
import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { env } from "@/env"

const SESSION_COOKIE_NAME =
  env.NODE_ENV === "production"
    ? "__Host-pulsewire-session"
    : "pulsewire-session"
const AUTH_STATE_COOKIE_NAME = "pulsewire-auth-state"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14   // 14 days
const AUTH_STATE_MAX_AGE_SECONDS = 60 * 10           // 10 minutes
const ISSUER = "pulsewire"
const AUDIENCE = "pulsewire-app"

export type SessionClaims = {
  sub: string
  oid: string
  email: string
  name: string
}

function key(): Uint8Array {
  return new TextEncoder().encode(env.SESSION_SECRET)
}

async function signJwt(
  payload: Record<string, unknown>,
  subject: string,
  ttlSeconds: number,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setSubject(subject)
    .setIssuedAt()
    .setExpirationTime(\`\${ttlSeconds}s\`)
    .sign(key())
}

export async function createSession(claims: SessionClaims): Promise<void> {
  const token = await signJwt(
    { oid: claims.oid, email: claims.email, name: claims.name },
    claims.sub,
    SESSION_MAX_AGE_SECONDS,
  )
  const jar = await cookies()
  jar.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}`}</CodePre>

          <h3>Why HS256 (symmetric) instead of RS256 (asymmetric)</h3>
          <p>
            HS256 uses a single secret for both signing AND verification. RS256 uses a public/private keypair. Both are
            secure. HS256 is faster (~10× on small payloads) and requires no key rotation infrastructure. The trade-off:
            anyone with the secret can mint tokens — so it MUST be kept secret. Since PulseWire signs + verifies in the
            same process, HS256 is the right call.
          </p>
          <p>RS256 wins when you need to <em>distribute</em> verification (multiple services verify; one service signs). PulseWire is monolithic, so HS256.</p>

          <h3>The claims in the session JWT</h3>
          <table>
            <tbody>
              <tr><th>Claim</th><th>Value</th></tr>
              <tr><td><code>sub</code></td><td>PulseWire's internal user ID (UUID from the users table)</td></tr>
              <tr><td><code>oid</code></td><td>Entra OID (preserved for traceability)</td></tr>
              <tr><td><code>email</code></td><td>User's email</td></tr>
              <tr><td><code>name</code></td><td>Display name</td></tr>
              <tr><td><code>iss</code></td><td>"pulsewire" (PulseWire is the issuer of its OWN sessions)</td></tr>
              <tr><td><code>aud</code></td><td>"pulsewire-app" (the consumer)</td></tr>
              <tr><td><code>iat</code></td><td>Issued-at timestamp</td></tr>
              <tr><td><code>exp</code></td><td>iat + 14 days</td></tr>
            </tbody>
          </table>

          <p>Notice the issuer/audience are PulseWire-internal strings, not Entra URLs. The session is decoupled from Entra — the user could keep browsing for 14 days even if Entra rotated their account (though they'd need to re-auth on session expiry).</p>

          <h3>The signing call</h3>
          <CodePre>{`new SignJWT({ oid, email, name })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuer('pulsewire')
  .setAudience('pulsewire-app')
  .setSubject(internalUserId)
  .setIssuedAt()
  .setExpirationTime('1209600s')   // 14 days
  .sign(secretAsUint8Array)`}</CodePre>

          <p>jose's <code>SignJWT</code> builder is fluent — chain the claim setters, end with <code>.sign(key)</code>. The result is the JWT string ready to put in a cookie.</p>

          <h3>Lifetime trade-offs</h3>
          <table>
            <tbody>
              <tr><th>Session length</th><th>Trade-off</th></tr>
              <tr><td>Short (1 hour)</td><td>Painful UX — re-auth too often. Better security.</td></tr>
              <tr><td>Medium (1-3 days)</td><td>Reasonable for most apps.</td></tr>
              <tr><td>Long (14 days — PulseWire)</td><td>Good UX for a daily-use app. Acceptable for low-sensitivity content.</td></tr>
              <tr><td>Very long (30+ days)</td><td>For sticky apps. Pair with refresh logic + activity checks.</td></tr>
            </tbody>
          </table>

          <h3>What about token refresh</h3>
          <p>PulseWire doesn't refresh access tokens — when the session JWT expires, the user signs in again. Why: PulseWire doesn't make Microsoft Graph calls on behalf of the user after sign-in, so it has no need for fresh access tokens. The Entra refresh token MSAL Node received is discarded.</p>
          <p>For apps that DO call Graph from background jobs (a notifier reading the user's calendar nightly, for example), you'd store the refresh token server-side, encrypted, and use it to mint new access tokens. That adds complexity PulseWire doesn't need.</p>
        </section>

        <hr />

        {/* SECTION 8 — COOKIE FLAGS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>The <code>__Host-</code> Prefix + Cookie Flags</h2>
          <p>The session cookie's name and flags encode a security contract with the browser. Get them right and most cookie-stealing attacks become impossible.</p>

          <h3>The cookie flags PulseWire sets</h3>
          <CodePre>{`jar.set(SESSION_COOKIE_NAME, token, {
  httpOnly: true,                          // ← XSS can't read
  secure:   env.NODE_ENV === 'production', // ← HTTPS only
  sameSite: 'lax',                          // ← CSRF mitigation
  path:     '/',                            // ← entire origin
  maxAge:   SESSION_MAX_AGE_SECONDS,        // ← 14 days
})`}</CodePre>

          <table>
            <tbody>
              <tr><th>Flag</th><th>Effect</th><th>Why</th></tr>
              <tr><td><code>HttpOnly</code></td><td>JS can't read <code>document.cookie</code> for this cookie</td><td>An XSS injection can't steal the token</td></tr>
              <tr><td><code>Secure</code></td><td>Cookie only sent over HTTPS</td><td>Eavesdroppers on HTTP can't grab it</td></tr>
              <tr><td><code>SameSite=Lax</code></td><td>Cookie sent only on same-site requests + top-level navigations</td><td>Mitigates CSRF — a malicious site can't POST with the cookie attached</td></tr>
              <tr><td><code>Path=/</code></td><td>Cookie sent on every path</td><td>App is served from the root</td></tr>
              <tr><td><code>Max-Age</code></td><td>Cookie persists for N seconds, then expires</td><td>Bounded session lifetime</td></tr>
            </tbody>
          </table>

          <h3>The <code>__Host-</code> prefix</h3>
          <p>
            <code>__Host-pulsewire-session</code> isn't just a label — the <code>__Host-</code> prefix triggers extra
            browser-side validation. A cookie with this prefix MUST be:
          </p>
          <ul>
            <li>Set with <code>Secure</code> (HTTPS-only)</li>
            <li>Set with <code>Path=/</code></li>
            <li>Set <strong>without</strong> <code>Domain</code> (i.e. it can't be a subdomain-cookie)</li>
          </ul>

          <p>If any of those are violated, the browser refuses to set the cookie. That makes accidental misconfiguration loud rather than silent. Browsers enforce the prefix; the server doesn't have to.</p>

          <h3>Dev vs prod cookie names</h3>
          <CodePre>{`const SESSION_COOKIE_NAME =
  env.NODE_ENV === "production"
    ? "__Host-pulsewire-session"
    : "pulsewire-session"`}</CodePre>

          <p>In dev, <code>__Host-</code> would fail because the dev server is HTTP. Use the plain name locally. Production runs HTTPS and uses the prefix.</p>

          <h3>Other prefix variants</h3>
          <table>
            <tbody>
              <tr><th>Prefix</th><th>Requirements</th></tr>
              <tr><td><code>__Host-</code></td><td>Secure, Path=/, no Domain</td></tr>
              <tr><td><code>__Secure-</code></td><td>Just Secure (less strict than __Host-)</td></tr>
              <tr><td>(none)</td><td>None enforced; configuration mistakes are silent</td></tr>
            </tbody>
          </table>

          <h3>Why not <code>SameSite=Strict</code></h3>
          <p>
            Strict blocks the cookie on top-level navigation from another origin too. That means: clicking a link from
            an external email to <code>https://pulsewire.example.com/app/reader</code> would arrive without the cookie,
            forcing a re-auth even though the user is signed in. <code>Lax</code> sends the cookie on top-level GET
            navigations but not on cross-origin POST/iframe/img requests — the right balance.
          </p>

          <h3>What this combination defeats</h3>
          <ul>
            <li><strong>XSS-based token theft</strong>: <code>HttpOnly</code> means JS can't read the cookie even if an attacker injects script</li>
            <li><strong>Network sniffing</strong>: <code>Secure</code> means the cookie never traverses HTTP</li>
            <li><strong>CSRF</strong>: <code>SameSite=Lax</code> blocks the cookie on cross-origin POST</li>
            <li><strong>Subdomain takeover</strong>: <code>__Host-</code> rejects domain-scoped cookies; a compromised <code>blog.pulsewire.example.com</code> can't set a cookie for the main app</li>
            <li><strong>Cookie tossing</strong>: <code>__Host-</code> + no Domain means there's only one valid cookie path</li>
          </ul>

          <h3>What it does NOT defeat</h3>
          <ul>
            <li><strong>Server compromise</strong>: anyone with <code>SESSION_SECRET</code> can mint sessions. Store it in Key Vault.</li>
            <li><strong>Physical access</strong>: if someone has the user's logged-in computer, the cookie is theirs.</li>
            <li><strong>Phishing</strong>: a fake sign-in page that captures the user's Entra credentials. (Cookie doesn't help; SSO with hardware keys does.)</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 9 — READING SESSION */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Reading the Session in Route Handlers</h2>
          <p>Once the cookie is set, every server-side request can read + verify it. PulseWire wraps this in <code>readSession()</code>.</p>

          <h3>The reader function</h3>
          <CodePre>{`// PulseWire/src/lib/auth/session.ts — pattern
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function readSession(): Promise<SessionClaims | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, key(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    })
    return {
      sub:   payload.sub as string,
      oid:   payload.oid as string,
      email: payload.email as string,
      name:  payload.name as string,
    }
  } catch {
    return null
  }
}`}</CodePre>

          <h3>Using it in a route handler</h3>
          <CodePre>{`// src/app/api/reader/articles/route.ts — verbatim opening
export async function GET(req: Request) {
  const session = await readSession()
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 })

  // session.sub, session.oid, session.email, session.name all available here
  const { rows, nextCursor } = await listArticles({ userId: session.sub, /* ... */ })
  return NextResponse.json({ articles: rows, nextCursor })
}`}</CodePre>

          <h3>Why proxy.ts + readSession() in handlers (belt and braces)</h3>
          <p>The proxy gates the URL space (matcher: <code>/app/:path*</code>). But:</p>
          <ul>
            <li>Some API routes need a finer-grained check (e.g. "only the user's OWN data").</li>
            <li>Background tasks or webhook routes might bypass proxy.</li>
            <li>The proxy doesn't have access to the parsed cookie payload — only the boolean "valid or not."</li>
          </ul>
          <p>Each handler that needs user identity calls <code>readSession()</code>. The proxy gates access; the handler reads the identity.</p>

          <h3>In Server Components</h3>
          <CodePre>{`// Server Component (NOT a route handler)
import { readSession } from '@/lib/auth/session'

export default async function ProfilePage() {
  const session = await readSession()
  if (!session) {
    // Should never happen — proxy gates this — but defense in depth
    redirect('/auth/login')
  }

  return <div>Hello, {session.name}</div>
}`}</CodePre>

          <p>Server Components can call <code>readSession()</code> too. The <code>cookies()</code> helper from <code>next/headers</code> works in both Server Components and Route Handlers (but NOT in Client Components, where you'd use <code>document.cookie</code> — though HttpOnly means you can't read this cookie that way).</p>

          <h3>The session-in-context pattern</h3>
          <p>For larger apps, you might wrap <code>readSession()</code> in a React context or a Server Component cache:</p>
          <CodePre>{`import { cache } from 'react'

export const getSession = cache(async () => {
  return await readSession()
})

// Now multiple Server Components on the same request can call getSession()
// and only one underlying cookie-parse happens.`}</CodePre>

          <p>PulseWire doesn't currently use <code>cache()</code> here; <code>readSession</code> is cheap enough that the duplication doesn't matter.</p>
        </section>

        <hr />

        {/* SECTION 10 — LOGOUT */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Logout</h2>
          <p>Two endpoints: GET and POST. Both clear the session cookie and redirect to the landing page.</p>

          <h3>The logout route</h3>
          <CodePre>{`// PulseWire/src/app/auth/logout/route.ts — verbatim
import { NextResponse } from "next/server"
import { env } from "@/env"
import { clearSession } from "@/lib/auth/session"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  await clearSession()
  return NextResponse.redirect(new URL("/", env.APP_BASE_URL))
}

export async function POST() {
  await clearSession()
  return NextResponse.redirect(new URL("/", env.APP_BASE_URL))
}`}</CodePre>

          <h3><code>clearSession()</code></h3>
          <CodePre>{`export async function clearSession(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE_NAME)
}`}</CodePre>

          <p>One line. <code>cookies().delete()</code> emits a <code>Set-Cookie</code> header with <code>Max-Age=0</code>, which the browser interprets as "remove this cookie immediately."</p>

          <h3>Why GET AND POST</h3>
          <ul>
            <li><strong>GET</strong>: convenience for "click this link to sign out" UX. Simple.</li>
            <li><strong>POST</strong>: the safer pattern — GET should be idempotent; logout is technically a mutation. Some browser extensions / preview-link generators trigger GETs as users browse, which could log users out unexpectedly.</li>
          </ul>

          <p>PulseWire ships both because the UX is "click a sign-out link" but the safer pattern is a POST from a form. Frontend can pick either.</p>

          <h3>Optional: front-channel logout from Entra</h3>
          <p>The full enterprise pattern: redirect through Entra's logout endpoint too, so the user is signed out of THIS app AND of Entra (across all SSO-connected apps).</p>
          <CodePre>{`export async function GET() {
  await clearSession()
  const logoutUrl = \`https://login.microsoftonline.com/\${env.ENTRA_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=\${encodeURIComponent(env.APP_BASE_URL)}\`
  return NextResponse.redirect(logoutUrl)
}`}</CodePre>

          <p>PulseWire skips this — the next time the user visits, Entra's session likely picks them back up with no prompt (which is the point of SSO). For a true "kicked out of everything" flow, use the Entra logout URL.</p>

          <h3>The auth-state cookie too?</h3>
          <p>The auth-state cookie is short-lived (10 min) and only meaningful during the brief sign-in dance. PulseWire doesn't explicitly clear it on logout; it expires naturally.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build the Whole Flow</h2>
          <p>Stand up a Next.js 16 app with full server-side OIDC: login route, callback, session cookie, protected route. ~45 minutes.</p>

          <h3>Step 1 — Scaffold + create Entra app reg</h3>
          <ol>
            <li>Create a Next.js app: <code>npx create-next-app@latest oidc-lab --typescript --app --src-dir</code></li>
            <li><code>npm i @azure/msal-node jose @t3-oss/env-nextjs zod</code></li>
            <li>In Entra, create an app reg. Under <strong>Authentication</strong>, add a <strong>Web</strong> platform with redirect URI <code>http://localhost:3000/auth/callback</code>.</li>
            <li>Under <strong>Certificates &amp; secrets</strong>, generate a client secret. Copy the value.</li>
          </ol>

          <h3>Step 2 — .env.local</h3>
          <CodePre>{`ENTRA_TENANT_ID=YOUR_TENANT_ID
ENTRA_CLIENT_ID=YOUR_CLIENT_ID
ENTRA_CLIENT_SECRET=YOUR_CLIENT_SECRET
SESSION_SECRET=$(openssl rand -base64 32)
APP_BASE_URL=http://localhost:3000`}</CodePre>

          <h3>Step 3 — Env validation</h3>
          <CodePre>{`// src/env.ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    ENTRA_TENANT_ID:     z.string().uuid(),
    ENTRA_CLIENT_ID:     z.string().uuid(),
    ENTRA_CLIENT_SECRET: z.string().min(1),
    SESSION_SECRET:      z.string().min(32),
    APP_BASE_URL:        z.string().url(),
    NODE_ENV:            z.enum(['development', 'test', 'production']).default('development'),
  },
  client: {},
  runtimeEnv: {
    ENTRA_TENANT_ID:     process.env.ENTRA_TENANT_ID,
    ENTRA_CLIENT_ID:     process.env.ENTRA_CLIENT_ID,
    ENTRA_CLIENT_SECRET: process.env.ENTRA_CLIENT_SECRET,
    SESSION_SECRET:      process.env.SESSION_SECRET,
    APP_BASE_URL:        process.env.APP_BASE_URL,
    NODE_ENV:            process.env.NODE_ENV,
  },
})`}</CodePre>

          <h3>Step 4 — MSAL helper</h3>
          <CodePre>{`// src/lib/auth/msal.ts
import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node'
import { env } from '@/env'

declare global { var __msalClient: ConfidentialClientApplication | undefined }

function build() {
  return new ConfidentialClientApplication({
    auth: {
      clientId:     env.ENTRA_CLIENT_ID,
      authority:    \`https://login.microsoftonline.com/\${env.ENTRA_TENANT_ID}\`,
      clientSecret: env.ENTRA_CLIENT_SECRET,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message) => {
          if (level <= LogLevel.Warning) console.log(\`[msal] \${message}\`)
        },
        logLevel: LogLevel.Warning,
      },
    },
  })
}

export function msalClient() {
  if (env.NODE_ENV === 'production') return build()
  globalThis.__msalClient ??= build()
  return globalThis.__msalClient
}

export const OIDC_SCOPES = ['openid', 'profile', 'email', 'User.Read']
export const redirectUri = () => \`\${env.APP_BASE_URL.replace(/\\/$/, '')}/auth/callback\``}</CodePre>

          <h3>Step 5 — Session helper</h3>
          <CodePre>{`// src/lib/auth/session.ts
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { env } from '@/env'

const COOKIE_NAME = env.NODE_ENV === 'production' ? '__Host-oidc-lab-session' : 'oidc-lab-session'
const STATE_COOKIE = 'oidc-lab-auth-state'
const ISSUER = 'oidc-lab'
const AUDIENCE = 'oidc-lab-app'
const SESSION_TTL = 60 * 60 * 24 * 7   // 7 days
const STATE_TTL   = 60 * 10            // 10 min

const key = () => new TextEncoder().encode(env.SESSION_SECRET)

async function sign(payload: Record<string, unknown>, sub: string, ttl: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER).setAudience(AUDIENCE).setSubject(sub)
    .setIssuedAt().setExpirationTime(\`\${ttl}s\`)
    .sign(key())
}

export async function createSession(claims: { sub: string; email: string; name: string }) {
  const token = await sign({ email: claims.email, name: claims.name }, claims.sub, SESSION_TTL)
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax',
    path: '/', maxAge: SESSION_TTL,
  })
}

export async function readSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, key(), { issuer: ISSUER, audience: AUDIENCE })
    return { sub: payload.sub as string, email: payload.email as string, name: payload.name as string }
  } catch {
    return null
  }
}

export async function clearSession() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

// — Auth-state (PKCE verifier + state) —
type AuthState = { code_verifier: string; state: string; nonce: string; post_login_redirect: string }

export async function createAuthState(s: AuthState) {
  const token = await sign(s as unknown as Record<string, unknown>, s.state, STATE_TTL)
  const jar = await cookies()
  jar.set(STATE_COOKIE, token, {
    httpOnly: true, secure: env.NODE_ENV === 'production', sameSite: 'lax',
    path: '/', maxAge: STATE_TTL,
  })
}

export async function consumeAuthState(stateFromUrl: string): Promise<AuthState | null> {
  const jar = await cookies()
  const token = jar.get(STATE_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, key(), { issuer: ISSUER, audience: AUDIENCE })
    if (payload.sub !== stateFromUrl) return null
    jar.delete(STATE_COOKIE)
    return {
      code_verifier:       payload.code_verifier       as string,
      state:                payload.state                as string,
      nonce:                payload.nonce                as string,
      post_login_redirect:  payload.post_login_redirect  as string,
    }
  } catch {
    return null
  }
}`}</CodePre>

          <h3>Step 6 — /auth/login</h3>
          <CodePre>{`// src/app/auth/login/route.ts
import { CryptoProvider } from '@azure/msal-node'
import { NextResponse } from 'next/server'
import { msalClient, OIDC_SCOPES, redirectUri } from '@/lib/auth/msal'
import { createAuthState } from '@/lib/auth/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const postLogin = url.searchParams.get('returnTo') ?? '/app'

  const crypto = new CryptoProvider()
  const { verifier, challenge } = await crypto.generatePkceCodes()
  const state = crypto.createNewGuid()
  const nonce = crypto.createNewGuid()

  await createAuthState({ code_verifier: verifier, state, nonce, post_login_redirect: postLogin })

  const authUrl = await msalClient().getAuthCodeUrl({
    scopes: OIDC_SCOPES, redirectUri: redirectUri(),
    codeChallenge: challenge, codeChallengeMethod: 'S256',
    state, nonce, responseMode: 'query', prompt: 'select_account',
  })

  return NextResponse.redirect(authUrl)
}`}</CodePre>

          <h3>Step 7 — /auth/callback</h3>
          <CodePre>{`// src/app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { msalClient, OIDC_SCOPES, redirectUri } from '@/lib/auth/msal'
import { consumeAuthState, createSession } from '@/lib/auth/session'
import { env } from '@/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  if (error) return new NextResponse(\`Entra error: \${error}\`, { status: 400 })
  if (!code || !state) return new NextResponse('Missing code or state', { status: 400 })

  const authState = await consumeAuthState(state)
  if (!authState) return new NextResponse('Auth state cookie missing/expired', { status: 400 })

  let result
  try {
    result = await msalClient().acquireTokenByCode({
      code, scopes: OIDC_SCOPES, redirectUri: redirectUri(),
      codeVerifier: authState.code_verifier,
    })
  } catch (e) {
    return new NextResponse(\`Token exchange failed: \${(e as Error).message}\`, { status: 400 })
  }

  if (!result?.idTokenClaims) return new NextResponse('No ID token claims', { status: 400 })
  const claims = result.idTokenClaims as { oid?: string; name?: string; preferred_username?: string; email?: string }
  const sub   = claims.oid ?? 'unknown'
  const name  = claims.name ?? 'User'
  const email = claims.preferred_username ?? claims.email ?? ''

  await createSession({ sub, name, email })

  return NextResponse.redirect(new URL(authState.post_login_redirect, env.APP_BASE_URL))
}`}</CodePre>

          <h3>Step 8 — /auth/logout</h3>
          <CodePre>{`// src/app/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { env } from '@/env'
import { clearSession } from '@/lib/auth/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  await clearSession()
  return NextResponse.redirect(new URL('/', env.APP_BASE_URL))
}`}</CodePre>

          <h3>Step 9 — proxy.ts</h3>
          <CodePre>{`// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE = process.env.NODE_ENV === 'production' ? '__Host-oidc-lab-session' : 'oidc-lab-session'

async function valid(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { issuer: 'oidc-lab', audience: 'oidc-lab-app' })
    return true
  } catch { return false }
}

export async function proxy(req: NextRequest) {
  if (await valid(req)) return NextResponse.next()
  const url = new URL('/auth/login', req.url)
  url.searchParams.set('returnTo', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = { matcher: ['/app/:path*'] }`}</CodePre>

          <h3>Step 10 — Protected page + landing</h3>
          <CodePre>{`// src/app/page.tsx
import Link from 'next/link'
export default function Landing() {
  return (
    <main style={{ padding: 24 }}>
      <h1>OIDC Lab</h1>
      <Link href="/app">Go to dashboard (login required)</Link>
    </main>
  )
}

// src/app/app/page.tsx
import { readSession } from '@/lib/auth/session'
export default async function Dashboard() {
  const session = await readSession()
  return (
    <main style={{ padding: 24 }}>
      <h1>Hello, {session?.name}</h1>
      <p>Email: {session?.email}</p>
      <a href="/auth/logout">Sign out</a>
    </main>
  )
}`}</CodePre>

          <h3>Step 11 — Run + verify</h3>
          <CodePre>{`npm run dev`}</CodePre>

          <ol>
            <li>Open <code>http://localhost:3000</code>. See "OIDC Lab" + link.</li>
            <li>Click "Go to dashboard." Proxy redirects to <code>/auth/login?returnTo=/app</code>.</li>
            <li>Login route generates PKCE, sets state cookie, redirects to Entra.</li>
            <li>Sign in at Entra (with a user in your tenant).</li>
            <li>Entra redirects to <code>/auth/callback?code=...&state=...</code></li>
            <li>Callback exchanges code, mints session cookie, redirects to <code>/app</code>.</li>
            <li>Dashboard renders your name + email.</li>
            <li>DevTools → Application → Cookies — see the <code>oidc-lab-session</code> cookie with HttpOnly checked.</li>
            <li>Click "Sign out." Cookie deleted, redirected to landing.</li>
          </ol>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated PulseWire's entire server-side OIDC flow — login, callback, session cookie, protected
              route, logout. ~100 lines of code total, end-to-end.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>AADSTS9002326 — "Cross-origin token redemption is permitted only for SPA"</h3>
          <p>The redirect URI is registered under the <strong>SPA</strong> platform, but you're using a confidential client (Web). Delete it from Authentication → SPA, re-add under Authentication → Web.</p>

          <h3>AADSTS50011 — Reply URL doesn't match</h3>
          <p>The redirect URI in <code>getAuthCodeUrl</code> doesn't exactly match what's in the app reg. Match scheme, host, port, path, no trailing slash.</p>

          <h3>"AADSTS7000215 — Invalid client secret"</h3>
          <p>The secret was: (a) typo'd, (b) expired, (c) deleted and re-created (the value, not just the ID, changes). Generate a fresh one.</p>

          <h3>Callback redirects to login forever</h3>
          <p>The session cookie isn't being set. Causes: (a) HTTPS issue (Secure flag requires HTTPS in prod; check NODE_ENV in dev), (b) SameSite=Strict killing the redirect, (c) __Host- prefix violation (set Path=/ and no Domain).</p>

          <h3>"auth state cookie missing or expired"</h3>
          <p>Either: (a) the user's auth dance took longer than 10 minutes (uncommon — usually a stale tab), (b) cookies are being blocked (third-party cookie blocking in incognito), (c) the state cookie was set on a different subdomain. Confirm DevTools shows the cookie after /auth/login.</p>

          <h3>Token exchange throws "AADSTS900144"</h3>
          <p>The grant type isn't supported. Almost always: the app reg's redirect URI is under the wrong platform (SPA vs Web). The Authorization Code with secret only works under Web.</p>

          <h3>Session cookie not deleted after logout</h3>
          <p>Different path or domain when setting vs deleting. Match exactly. Easiest fix: always set Path=/ on both set and delete.</p>

          <h3>"jose: signature verification failed"</h3>
          <p><code>SESSION_SECRET</code> changed between when the cookie was signed and when you're reading it. Restart the server with the SAME secret. In dev, this happens when you regenerate the secret in .env.local — clear cookies + restart.</p>

          <h3>JWT works but user can't access their data</h3>
          <p>The session's <code>sub</code> claim doesn't match the user-id format your database expects. Verify what you put in <code>createSession({`{ sub: ... }`})</code> — should be the user's internal ID, not the raw Entra OID.</p>

          <h3>Cookie set in dev (HTTP) but rejected in prod (HTTPS)</h3>
          <p>__Host- prefix requires Secure, which requires HTTPS. The dev/prod name swap (PulseWire's pattern) handles this. If you used the prefix in dev, browsers silently refuse to set it on HTTP.</p>

          <h3>"Cannot read .env at build time"</h3>
          <p>You're reading env vars at module load. Use the t3-oss/env-nextjs pattern (validates at boot, types at compile time, throws nicely if missing).</p>

          <h3>MSAL Node logs ALL requests at info level</h3>
          <p>You set <code>logLevel: LogLevel.Info</code> or lower in the loggerOptions. Use <code>LogLevel.Warning</code> (PulseWire's default) — warnings and errors only, no per-request spam.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The 6-file shape</h3>
          <CodePre>{`src/
├── env.ts                            # Zod validation
├── proxy.ts                          # cookie-check redirect to /auth/login
├── lib/auth/
│   ├── msal.ts                       # ConfidentialClientApplication factory
│   └── session.ts                    # SignJWT/jwtVerify, cookies()
└── app/auth/
    ├── login/route.ts                # generate PKCE, redirect to Entra
    ├── callback/route.ts             # exchange code, create session
    └── logout/route.ts               # clear cookie, redirect`}</CodePre>

          <h3>MSAL Node factory</h3>
          <CodePre>{`new ConfidentialClientApplication({
  auth: {
    clientId,
    authority: \`https://login.microsoftonline.com/\${tenantId}\`,
    clientSecret,
  },
})`}</CodePre>

          <h3>OAuth Authorization Code + PKCE — request</h3>
          <CodePre>{`const crypto = new CryptoProvider()
const { verifier, challenge } = await crypto.generatePkceCodes()
const state = crypto.createNewGuid()
const nonce = crypto.createNewGuid()
// (stash verifier + state + nonce in a short-lived signed cookie)
const authUrl = await msalClient().getAuthCodeUrl({
  scopes, redirectUri,
  codeChallenge: challenge, codeChallengeMethod: 'S256',
  state, nonce, responseMode: 'query', prompt: 'select_account',
})
return NextResponse.redirect(authUrl)`}</CodePre>

          <h3>OAuth Authorization Code + PKCE — exchange</h3>
          <CodePre>{`const result = await msalClient().acquireTokenByCode({
  code, scopes, redirectUri,
  codeVerifier: authState.code_verifier,
})
const claims = result.idTokenClaims  // already verified by MSAL Node`}</CodePre>

          <h3>Sign + set session cookie</h3>
          <CodePre>{`const token = await new SignJWT({ email, name })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuer('myapp').setAudience('myapp-app').setSubject(userId)
  .setIssuedAt().setExpirationTime('14d')
  .sign(new TextEncoder().encode(env.SESSION_SECRET))

const jar = await cookies()
jar.set('__Host-myapp-session', token, {
  httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 14 * 24 * 60 * 60,
})`}</CodePre>

          <h3>Read + verify session</h3>
          <CodePre>{`const token = (await cookies()).get(COOKIE)?.value
if (!token) return null
const { payload } = await jwtVerify(token, key, { issuer, audience })
return { sub: payload.sub, ... }`}</CodePre>

          <h3>Cookie flag cheat sheet</h3>
          <table>
            <tbody>
              <tr><th>Flag</th><th>Setting</th></tr>
              <tr><td>Name</td><td><code>__Host-myapp-session</code> in prod, plain in dev</td></tr>
              <tr><td>HttpOnly</td><td>true (always)</td></tr>
              <tr><td>Secure</td><td>true in prod (always with __Host-)</td></tr>
              <tr><td>SameSite</td><td>Lax (default for auth)</td></tr>
              <tr><td>Path</td><td>/ (always with __Host-)</td></tr>
              <tr><td>Domain</td><td>(unset — always with __Host-)</td></tr>
              <tr><td>Max-Age</td><td>session TTL in seconds</td></tr>
            </tbody>
          </table>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>ConfidentialClientApplication factory</td><td>PulseWire · <code>src/lib/auth/msal.ts</code> (full)</td></tr>
              <tr><td>OIDC scopes constant</td><td>PulseWire · <code>src/lib/auth/msal.ts</code></td></tr>
              <tr><td>redirectUri builder</td><td>PulseWire · <code>src/lib/auth/msal.ts</code></td></tr>
              <tr><td>HS256 session JWT</td><td>PulseWire · <code>src/lib/auth/session.ts</code></td></tr>
              <tr><td>__Host-pulsewire-session cookie</td><td>PulseWire · <code>src/lib/auth/session.ts</code></td></tr>
              <tr><td>Login route — PKCE + state cookie</td><td>PulseWire · <code>src/app/auth/login/route.ts</code> (full)</td></tr>
              <tr><td>Callback — acquireTokenByCode</td><td>PulseWire · <code>src/app/auth/callback/route.ts</code></td></tr>
              <tr><td>Logout — clearSession</td><td>PulseWire · <code>src/app/auth/logout/route.ts</code> (full)</td></tr>
              <tr><td>Cookie verification in proxy</td><td>PulseWire · <code>src/proxy.ts</code></td></tr>
              <tr><td>Session read in route handler</td><td>PulseWire · <code>src/app/api/reader/articles/route.ts</code></td></tr>
              <tr><td>SESSION_SECRET min(32) check</td><td>PulseWire · <code>src/env.ts</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: Cross-App Authentication (Workshop ↔ Tabloom).</p>
        </section>
      </main>
    </div>
  );
}
