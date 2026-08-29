import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Bootstrap Before React',           icon: '🚀' },
  { id: 's3',  num: '3',  title: 'PublicClientApplication Config',   icon: '⚙️' },
  { id: 's4',  num: '4',  title: 'MsalProvider + Hooks',             icon: '🪝' },
  { id: 's5',  num: '5',  title: 'AuthGuard Patterns',               icon: '🔐' },
  { id: 's6',  num: '6',  title: 'Login Flows: Popup vs Redirect',   icon: '↪️' },
  { id: 's7',  num: '7',  title: 'Token Acquisition',                icon: '🎫' },
  { id: 's8',  num: '8',  title: 'API Client w/ Bearer',             icon: '📡' },
  { id: 's9',  num: '9',  title: 'OID Header Variant',               icon: '🔖' },
  { id: 's10', num: '10', title: 'Synchronous-OID Race-Fix',         icon: '⚡' },
  { id: 's11', num: '★',  title: 'Lab: Full Sign-In Flow',           icon: '🛠️' },
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

export default function MsalReactGuide() {
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
            <span className="sidebar-title">MSAL React</span>
          </div>
          <div className="sidebar-sub">client-side auth, 7 fleet apps</div>
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
          <div className="hero-tag">🔑 MSAL React 3 / 5 · 2026</div>
          <h1>MSAL React<br />Client-Side Auth</h1>
          <p>
            Seven fleet apps use <strong style={{ color: '#C77AA0' }}>@azure/msal-react</strong> for browser-side sign-in
            against Entra ID. This guide walks the entire flow — bootstrap, configuration, provider wiring, AuthGuard
            patterns, popup vs redirect, token acquisition, API client integration, and the synchronous-OID race-fix
            that ShopKeep and friends use to prevent the empty-dashboard bug.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">7/8</span><span className="hero-stat-label">Use MSAL React</span></div>
            <div className="hero-stat"><span className="hero-stat-val">1</span><span className="hero-stat-label">MSAL Node (PulseWire)</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~60</span><span className="hero-stat-label">LOC for sign-in</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Hooks You Need</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            MSAL (Microsoft Authentication Library) is a JS library that handles every step of Entra sign-in: redirect to
            the IdP, capture the callback, parse tokens, refresh silently, store securely, expose React hooks for the
            current account. You don't implement OAuth or OIDC; MSAL does it.
          </p>

          <h3>One sentence per layer</h3>
          <ul>
            <li><strong><code>@azure/msal-browser</code></strong> — the engine. Plain JS, framework-agnostic. Manages tokens, talks to Entra.</li>
            <li><strong><code>@azure/msal-react</code></strong> — the React adapter. Provides <code>&lt;MsalProvider&gt;</code> and the hooks (<code>useMsal</code>, <code>useIsAuthenticated</code>, <code>useAccount</code>).</li>
            <li><strong>Your code</strong> — wires up MSAL once, renders auth-gated UI, calls APIs with the token.</li>
          </ul>

          <h3>The 6-step user journey</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User
  participant F as Frontend (React)
  participant M as MSAL Browser
  participant E as Entra ID
  participant A as Backend API
  U->>F: visits app
  F->>M: useIsAuthenticated() → false
  F->>U: <LoginPage> + "Sign in" button
  U->>M: clicks → loginRedirect()
  M->>E: redirect to login.microsoftonline.com
  U->>E: credentials + MFA
  E->>F: redirect back with #code=...
  F->>M: handleRedirectPromise()
  M->>E: exchange code for tokens (PKCE)
  E->>M: ID token + access token + refresh token
  M->>F: useIsAuthenticated() → true
  F->>A: API call + Authorization: Bearer <token>`} />

          <h3>What MSAL doesn't do</h3>
          <ul>
            <li><strong>Not authorization.</strong> "Is this user allowed to delete this recipe?" lives in your app, not MSAL.</li>
            <li><strong>Not session management.</strong> Tokens live ~1 hour; MSAL silently refreshes. No session table needed.</li>
            <li><strong>Not user storage.</strong> Users live in Entra; your DB stores per-user data keyed by their OID.</li>
            <li><strong>Not the entire SPA.</strong> MSAL only handles sign-in. The rest of your app is whatever you want.</li>
          </ul>

          <h3>The dependencies for every fleet app</h3>
          <CodePre>{`# package.json
"@azure/msal-browser": "^4.25.0",  # or v5 in newer apps
"@azure/msal-react":   "^3.0.20",   # or v5

# All TS apps additionally type-check against:
"@types/node": "..."`}</CodePre>

          <h3>Versions in the fleet</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>msal-browser</th><th>msal-react</th></tr>
              <tr><td>Cairn / SecretApp (Hearth)</td><td>4.25</td><td>3.0</td></tr>
              <tr><td>GLP1 (Tare)</td><td>5.8</td><td>5.3</td></tr>
              <tr><td>ShopKeep</td><td>5.5</td><td>5.0</td></tr>
              <tr><td>Puzzlebox</td><td>5.5</td><td>5.0</td></tr>
              <tr><td>Tabloom</td><td>5.10</td><td>5.4</td></tr>
              <tr><td>Workshop</td><td>5.8</td><td>5.3</td></tr>
            </tbody>
          </table>
          <p>Differences between v3, v4, v5 are minor for the patterns in this guide. The hooks and config object are essentially identical.</p>
        </section>

        <hr />

        {/* SECTION 2 — BOOTSTRAP */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Bootstrap MSAL Before React</h2>
          <p>
            The #1 gotcha with MSAL: you must call <code>pca.initialize()</code> and <code>handleRedirectPromise()</code>
            <em>before</em> React renders. If you skip this, the first sign-in works (because there's no redirect to
            handle yet), but the second-and-onward fails silently.
          </p>

          <h3>The correct shape</h3>
          <CodePre>{`// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './auth/msalConfig'
import App from './App'

const pca = new PublicClientApplication(msalConfig)

// MSAL 5 requires explicit initialize(). For MSAL 3/4 it's optional but harmless.
pca.initialize().then(async () => {
  // If we're returning from a redirect sign-in, this consumes the URL
  // hash + sets up the account. Returns null on non-redirect loads.
  await pca.handleRedirectPromise()

  // Set the first signed-in account as active so useMsal().instance has it.
  const accounts = pca.getAllAccounts()
  if (!pca.getActiveAccount() && accounts[0]) {
    pca.setActiveAccount(accounts[0])
  }

  // NOW render React
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={pca}>
        <App />
      </MsalProvider>
    </StrictMode>
  )
})`}</CodePre>

          <h3>Why init must precede render</h3>
          <ol>
            <li><strong><code>handleRedirectPromise()</code></strong> consumes any URL hash containing OAuth response codes. If React renders first and any component calls another MSAL method before this finishes, you get "interaction_in_progress" errors.</li>
            <li><strong><code>setActiveAccount()</code></strong> ensures that <code>useMsal().instance.getActiveAccount()</code> returns something non-null on first render. Without it, the AuthGuard's child useEffects fire with no active account and may render an empty page.</li>
          </ol>

          <h3>Workshop's explicit setMsalInstance wire-up</h3>
          <p>Workshop has a second step — its API client needs the MSAL instance too, and registers it during boot:</p>
          <CodePre>{`// workshop/src/main.tsx (pattern)
const pca = new PublicClientApplication(msalConfig)

pca.initialize().then(async () => {
  await pca.handleRedirectPromise()
  // Make MSAL available to the API client (services/api.ts)
  setMsalInstance(pca)

  const accounts = pca.getAllAccounts()
  if (!pca.getActiveAccount() && accounts[0]) {
    pca.setActiveAccount(accounts[0])
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={pca}>
        <App />
      </MsalProvider>
    </StrictMode>
  )
})`}</CodePre>

          <p>The API client (covered in §8) is a module-level singleton; this is the boot step that hands it the MSAL instance.</p>

          <h3>What goes wrong if you skip init</h3>
          <CodePre>{`// 🚫 BAD — no initialize, no handleRedirectPromise
const pca = new PublicClientApplication(msalConfig)
createRoot(...).render(
  <MsalProvider instance={pca}>
    <App />
  </MsalProvider>
)`}</CodePre>

          <p>Symptoms:</p>
          <ul>
            <li>First sign-in: works (the redirect lands, but React-rendered components ALSO try to handle the redirect; one of them succeeds).</li>
            <li>Second sign-in attempt during the session: "interaction_in_progress" errors.</li>
            <li>Token acquisition: sometimes returns null because the active account isn't set yet.</li>
            <li>"Could not get an active account" warnings in dev console.</li>
          </ul>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              The init-then-render pattern adds ~50ms to first-paint. Worth it. It's the difference between "auth works
              every time" and "auth works mostly, until the hash fragment lingers and you can't reproduce the bug."
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 3 — CONFIG */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>PublicClientApplication Configuration</h2>
          <p>One <code>Configuration</code> object passed to <code>new PublicClientApplication(config)</code>. Three sub-objects: <code>auth</code>, <code>cache</code>, <code>system</code>.</p>

          <h3>Hearth's full config</h3>
          <CodePre>{`// SecretApp/src/auth/msalConfig.ts — verbatim
import { LogLevel, type Configuration } from '@azure/msal-browser';

const clientId = '55bf92db-2cec-4e65-ab0d-71bee90d7494';
const tenantId = '52188f12-db6b-46c6-88ff-08c802f0ed3b';

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: \`https://login.microsoftonline.com/\${tenantId}\`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    loggerOptions: {
      loggerCallback(level, message, containsPii) {
        if (containsPii) return;
        console.debug(\`[MSAL:\${LogLevel[level]}] \${message}\`);
      },
      logLevel: LogLevel.Warning,
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};`}</CodePre>

          <h3><code>auth</code> — what app + where</h3>
          <table>
            <tbody>
              <tr><th>Key</th><th>Meaning</th></tr>
              <tr><td><code>clientId</code></td><td>Your app reg's client ID (GUID)</td></tr>
              <tr><td><code>authority</code></td><td>Where to redirect for sign-in. Defaults to <code>/common</code>; fleet sets it to a specific tenant.</td></tr>
              <tr><td><code>redirectUri</code></td><td>Where Entra sends the user post-sign-in. Must match the app reg's allow-list.</td></tr>
              <tr><td><code>postLogoutRedirectUri</code></td><td>Where to land after sign-out.</td></tr>
              <tr><td><code>navigateToLoginRequestUrl</code></td><td>After login, navigate back to the URL the user was trying to reach (vs always landing on home).</td></tr>
              <tr><td><code>knownAuthorities</code></td><td>For multi-tenant or B2C — list of trusted authorities.</td></tr>
            </tbody>
          </table>

          <h3><code>cache</code> — where tokens live</h3>
          <table>
            <tbody>
              <tr><th>Key</th><th>Choices</th><th>Trade-off</th></tr>
              <tr><td><code>cacheLocation</code></td><td><code>'sessionStorage'</code> | <code>'localStorage'</code> | <code>'memoryStorage'</code></td><td>localStorage survives tab close (most apps); sessionStorage is per-tab; memoryStorage is per-page-load.</td></tr>
              <tr><td><code>storeAuthStateInCookie</code></td><td>true / false</td><td>For IE11 and Edge Legacy compat. True is safe; harmless if you don't need it.</td></tr>
            </tbody>
          </table>

          <p>Fleet apps standardize on <code>localStorage</code>. Trade-off: tokens persist across tab closes (good UX), but if a malicious extension reads localStorage, tokens are exposed. Acceptable for personal apps; consider sessionStorage for sensitive enterprise apps.</p>

          <h3><code>system</code> — logging + protocol tuning</h3>
          <CodePre>{`system: {
  loggerOptions: {
    loggerCallback(level, message, containsPii) {
      if (containsPii) return  // ← respect this flag
      console.debug(\`[MSAL:\${LogLevel[level]}] \${message}\`)
    },
    logLevel: LogLevel.Warning,  // Verbose | Info | Warning | Error
    piiLoggingEnabled: false,
  },
  // Other knobs (rarely changed):
  windowHashTimeout: 60000,     // ms to wait for popup/iframe response
  iframeHashTimeout: 6000,
  loadFrameTimeout: 0,
  asyncPopups: false,           // popup target opens before token request
}`}</CodePre>

          <h3>The <code>loginRequest</code> object — what to ask for</h3>
          <CodePre>{`export const loginRequest = {
  scopes: ['User.Read'],         // Microsoft Graph default
  prompt: 'select_account',      // force account picker (default: 'none' if cached)
  extraQueryParameters: { ui_locales: 'en' },
}`}</CodePre>

          <p>Passed to <code>loginRedirect</code> / <code>loginPopup</code> / <code>acquireTokenSilent</code>. The <code>scopes</code> are what permissions you're requesting.</p>

          <h3>Env-baked variant — ShopKeep</h3>
          <p>If you want the client/tenant IDs to come from build-time env vars (covered in the Vite Build System guide):</p>
          <CodePre>{`// ShopKeep/src/auth/msalConfig.ts — verbatim
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID as string;

if (!clientId || !tenantId) {
  throw new Error('VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID must be set in .env');
}

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: \`https://login.microsoftonline.com/\${tenantId}\`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  // ...
};`}</CodePre>

          <p>The <code>throw</code> at boot is critical — if the Docker build forgot to pass the build-args, the app fails loudly on first load rather than silently producing AADSTS errors.</p>
        </section>

        <hr />

        {/* SECTION 4 — PROVIDER + HOOKS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span><code>&lt;MsalProvider&gt;</code> + Hooks</h2>
          <p>Wrap your app once with <code>&lt;MsalProvider&gt;</code>; consume MSAL state via three hooks anywhere underneath.</p>

          <h3>The wrap</h3>
          <CodePre>{`<MsalProvider instance={pca}>
  <App />
</MsalProvider>`}</CodePre>

          <h3>The three hooks you'll use</h3>

          <h4><code>useMsal()</code> — the MSAL instance + current state</h4>
          <CodePre>{`import { useMsal } from '@azure/msal-react'

function MyComponent() {
  const { instance, accounts, inProgress } = useMsal()

  // instance: the PublicClientApplication you passed to MsalProvider
  // accounts: every signed-in account known to MSAL (usually 0 or 1)
  // inProgress: enum — none | login | logout | acquireToken | handleRedirect | ...
}`}</CodePre>

          <h4><code>useIsAuthenticated()</code> — boolean shortcut</h4>
          <CodePre>{`import { useIsAuthenticated } from '@azure/msal-react'

function MyComponent() {
  const isAuthenticated = useIsAuthenticated()
  if (!isAuthenticated) return <LoginPage />
  return <SignedInApp />
}`}</CodePre>

          <h4><code>useAccount()</code> — get a specific account</h4>
          <CodePre>{`import { useAccount } from '@azure/msal-react'

function MyComponent() {
  const { accounts } = useMsal()
  const account = useAccount(accounts[0] ?? {})

  // account.name, account.username, account.localAccountId (the OID!), etc.
}`}</CodePre>

          <p>Most fleet code uses <code>useMsal().accounts[0]</code> directly rather than <code>useAccount</code>. Same result; <code>useAccount</code> is useful when you have multiple signed-in accounts (rare in single-user apps).</p>

          <h3>The Account object</h3>
          <CodePre>{`{
  homeAccountId: '...',           // tenant-id.client-id format
  environment:   'login.windows.net',
  tenantId:      'de625678-...',
  username:      'alex.wilber@contoso.com',
  localAccountId: 'abc12345-...',  // ← this is the OID
  name:          'Alex Wilber',
  idTokenClaims: { ... },          // decoded ID token
  // ... more fields ...
}`}</CodePre>

          <h3>The InteractionStatus enum</h3>
          <p><code>inProgress</code> tells you what MSAL is currently doing. Useful for showing "Signing you in…" UI:</p>
          <CodePre>{`import { InteractionStatus } from '@azure/msal-browser'

if (inProgress === InteractionStatus.Login)           // initial login active
if (inProgress === InteractionStatus.Logout)          // logging out
if (inProgress === InteractionStatus.AcquireToken)    // silent or interactive token acquisition
if (inProgress === InteractionStatus.HandleRedirect)  // processing redirect response
if (inProgress === InteractionStatus.None)            // idle`}</CodePre>

          <h3>Component helpers</h3>
          <p>MSAL React also ships drop-in component wrappers for the common patterns:</p>
          <CodePre>{`import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'

<AuthenticatedTemplate>
  <DashboardUI />  {/* only renders if signed in */}
</AuthenticatedTemplate>

<UnauthenticatedTemplate>
  <LoginButton />  {/* only renders if NOT signed in */}
</UnauthenticatedTemplate>`}</CodePre>

          <p>The fleet doesn't use these — preferring the imperative pattern in AuthGuard (§5) for clarity. But for simple top-bar elements ("Sign in" button vs avatar dropdown), they're fine.</p>
        </section>

        <hr />

        {/* SECTION 5 — AUTHGUARD */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>AuthGuard Patterns</h2>
          <p>Every fleet app has an <code>AuthGuard</code> component at the top of its tree. It checks auth state and renders either the login page or the signed-in app. Three subtle differences across the fleet.</p>

          <h3>Hearth's variant — simple</h3>
          <CodePre>{`// SecretApp/src/auth/AuthGuard.tsx — verbatim
import { useEffect } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import type { ReactNode } from 'react';
import LoginPage from './LoginPage';
import './LoginPage.css';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();

  useEffect(() => {
    const accounts = instance.getAllAccounts();
    if (!instance.getActiveAccount() && accounts.length > 0) {
      instance.setActiveAccount(accounts[0]);
    }
  }, [instance, isAuthenticated]);

  if (inProgress === 'login' || inProgress === 'handleRedirect') {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Signing you in…</h1>
          <p className="login-subtitle">Please wait while we complete authentication.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}`}</CodePre>

          <h3>Three states the AuthGuard distinguishes</h3>
          <ol>
            <li><strong>Mid-auth</strong> — show "Signing you in…" message. Prevents flash of login page during the redirect-handling tick.</li>
            <li><strong>Not authenticated</strong> — render <code>LoginPage</code>.</li>
            <li><strong>Authenticated</strong> — render <code>children</code>.</li>
          </ol>

          <h3>ShopKeep's variant — adds the synchronous-OID pattern</h3>
          <CodePre>{`// ShopKeep/src/auth/AuthGuard.tsx — verbatim
import { useState } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import type { ReactNode } from 'react';
import LoginPage from './LoginPage';
import SplashScreen from './SplashScreen';
import { setUserOid } from '../services/userContext';

interface AuthGuardProps {
  children: ReactNode;
}

const SPLASH_KEY = 'shopkeep_splash_v1';

export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem(SPLASH_KEY) === '1',
  );

  // Run synchronously during render (not in useEffect) so the OID is set before
  // any child component's useEffect fires — prevents a race where Dashboard fetches
  // data before the OID header is available on first login.
  const accounts = instance.getAllAccounts();
  if (!instance.getActiveAccount() && accounts.length > 0) {
    instance.setActiveAccount(accounts[0]);
  }
  const active = instance.getActiveAccount();
  if (active?.localAccountId) setUserOid(active.localAccountId);

  if (inProgress === InteractionStatus.HandleRedirect || inProgress === InteractionStatus.AcquireToken) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Signing you in…</h1>
          <p className="login-subtitle">Please wait while we complete authentication.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!splashDone) {
    return (
      <SplashScreen
        onDone={() => {
          sessionStorage.setItem(SPLASH_KEY, '1');
          setSplashDone(true);
        }}
      />
    );
  }

  return <>{children}</>;
}`}</CodePre>

          <p>Key difference from Hearth: ShopKeep <em>also</em> calls <code>setUserOid(active.localAccountId)</code> during render (not in useEffect). That's the synchronous-OID race-fix covered in §10.</p>

          <h3>Workshop's variant — useEffect for setActiveAccount</h3>
          <CodePre>{`// workshop/src/auth/AuthGuard.tsx — verbatim
import { useEffect } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { Hammer } from 'lucide-react'
import LandingPage from './LandingPage'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()

  useEffect(() => {
    const accounts = instance.getAllAccounts()
    if (!instance.getActiveAccount() && accounts.length > 0) {
      instance.setActiveAccount(accounts[0])
    }
  }, [instance, isAuthenticated])

  if (inProgress === InteractionStatus.HandleRedirect ||
      inProgress === InteractionStatus.AcquireToken) {
    return (<div>Signing you in…</div>)  // (styling omitted for brevity)
  }

  if (!isAuthenticated) return <LandingPage />

  return <>{children}</>
}`}</CodePre>

          <p>
            Workshop uses useEffect for <code>setActiveAccount</code> — works because its API client reads the active
            account at call time (not during render). ShopKeep can't because its API client reads the OID from a
            module-level singleton populated during render.
          </p>

          <h3>The decision tree</h3>
          <ul>
            <li><strong>useEffect setActiveAccount</strong> if your API client reads MSAL state at fetch time. (Hearth, Workshop, Cairn, Tabloom.)</li>
            <li><strong>Synchronous-during-render</strong> if you mirror OID to a module-level store / context that children consume during their first useEffect. (ShopKeep.)</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 6 — LOGIN FLOWS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Login Flows: Popup vs Redirect</h2>
          <p>MSAL exposes two sign-in flows. Each has the same end state (signed in, tokens cached); the user experience differs.</p>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th></th><th>loginPopup</th><th>loginRedirect</th></tr>
              <tr><td>User experience</td><td>Pops up a window; main app stays put</td><td>Whole tab redirects to entra; comes back</td></tr>
              <tr><td>Awaitable</td><td>Returns a Promise with tokens</td><td>Side effect — your code doesn't return</td></tr>
              <tr><td>Mobile</td><td>Often blocked / broken</td><td>Works everywhere</td></tr>
              <tr><td>Third-party cookies</td><td>Required (issue on Safari)</td><td>Not required</td></tr>
              <tr><td>State preservation</td><td>App state stays (in memory)</td><td>App state lost — must serialize first</td></tr>
              <tr><td>Production reliability</td><td>Variable</td><td>Reliable</td></tr>
            </tbody>
          </table>

          <h3>Fleet's pick: redirect</h3>
          <p>Every fleet app uses <code>loginRedirect</code>. Reasons: mobile compatibility, Safari ITP, the simpler "redirect away, redirect back" mental model.</p>

          <CodePre>{`// LoginPage.tsx pattern
import { useMsal } from '@azure/msal-react'
import { loginRequest } from './msalConfig'

export default function LoginPage() {
  const { instance } = useMsal()

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <button onClick={() => instance.loginRedirect(loginRequest)}>
        Sign in with Microsoft
      </button>
    </div>
  )
}`}</CodePre>

          <h3>The redirect dance, step by step</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User
  participant F as Frontend
  participant M as MSAL
  participant E as Entra ID
  U->>F: clicks "Sign in"
  F->>M: instance.loginRedirect(loginRequest)
  M->>E: window.location = login URL
  Note over U,E: User signs in at Entra
  E->>F: redirect to redirectUri#code=...
  F->>M: pca.initialize() then handleRedirectPromise()
  M->>E: exchange code for tokens (PKCE)
  E->>M: tokens
  M->>M: stash in localStorage
  M->>F: signal: active account exists
  F->>U: render signed-in UI`} />

          <h3>State preservation across redirect</h3>
          <p>If the user clicks "Sign in" from a deep URL (e.g. <code>/recipes/42</code>), the redirect to Entra and back loses the URL. Two patterns:</p>

          <p><strong>The MSAL way:</strong> set <code>navigateToLoginRequestUrl: true</code> in config — MSAL remembers and navigates back to the original URL.</p>

          <p><strong>The manual way:</strong> stash the URL in <code>state</code> param, restore on redirect:</p>
          <CodePre>{`// Click handler
const handleLogin = () => {
  instance.loginRedirect({
    ...loginRequest,
    state: window.location.pathname + window.location.search,
  })
}

// In main.tsx after handleRedirectPromise:
const response = await pca.handleRedirectPromise()
if (response?.state) {
  window.history.replaceState({}, '', response.state)
}`}</CodePre>

          <h3>Logout</h3>
          <CodePre>{`// Front-channel logout — Entra also clears its session
instance.logoutRedirect()

// Or only clear MSAL state, leave Entra signed in (rare)
instance.logoutRedirect({ onRedirectNavigate: () => false })

// Popup variant
instance.logoutPopup()`}</CodePre>

          <h3>Account picker</h3>
          <CodePre>{`// Force the account picker even if cached
instance.loginRedirect({
  ...loginRequest,
  prompt: 'select_account',
})

// Suppress the picker and use the last account
instance.loginRedirect({
  ...loginRequest,
  prompt: 'none',
})  // ← fails if no cached account; use acquireTokenSilent instead`}</CodePre>
        </section>

        <hr />

        {/* SECTION 7 — TOKEN ACQUISITION */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Token Acquisition</h2>
          <p>Once signed in, you call <code>acquireTokenSilent</code> to get an access token (or ID token) for an API call. MSAL handles the entire refresh flow.</p>

          <h3>The pattern</h3>
          <CodePre>{`import { InteractionRequiredAuthError } from '@azure/msal-browser'

async function getToken(scopes: string[]): Promise<string> {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) throw new Error('Not signed in')

  try {
    const result = await instance.acquireTokenSilent({ scopes, account })
    return result.accessToken  // or result.idToken if you want the ID token
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      // The cached token expired AND silent refresh failed (e.g. user revoked consent).
      // Force an interactive sign-in.
      await instance.acquireTokenRedirect({ scopes, account })
      // acquireTokenRedirect navigates away; this throw is unreachable in practice
      throw err
    }
    throw err
  }
}`}</CodePre>

          <h3>Workshop's exact pattern</h3>
          <CodePre>{`// workshop/src/auth/getToken.ts — verbatim
import { InteractionRequiredAuthError, type IPublicClientApplication } from '@azure/msal-browser'
import { apiScope } from './msalConfig'

export async function getApiToken(instance: IPublicClientApplication): Promise<string> {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) throw new Error('No signed-in account')
  try {
    const result = await instance.acquireTokenSilent({ scopes: [apiScope], account })
    return result.accessToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect({ scopes: [apiScope], account })
      // acquireTokenRedirect navigates away; this throw is unreachable in practice
      throw err
    }
    throw err
  }
}`}</CodePre>

          <p>The same shape works for Workshop's sibling-app token (Tabloom) — different scope, same flow:</p>
          <CodePre>{`// workshop/src/auth/getTabloomToken.ts — verbatim
export const tabloomApiScope = \`api://\${TABLOOM_CLIENT_ID}/access_as_user\`

export async function getTabloomToken(instance: IPublicClientApplication): Promise<string> {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) throw new Error('No signed-in account')
  try {
    const result = await instance.acquireTokenSilent({ scopes: [tabloomApiScope], account })
    return result.accessToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect({ scopes: [tabloomApiScope], account })
      throw err
    }
    throw err
  }
}`}</CodePre>

          <h3>What <code>acquireTokenSilent</code> does internally</h3>
          <ol>
            <li><strong>Cache check.</strong> If a cached access token for the requested scope is still valid, return it.</li>
            <li><strong>Refresh.</strong> If access token expired but refresh token is valid, exchange the refresh token for a new access token.</li>
            <li><strong>Hidden iframe.</strong> If no refresh token (rare), open an invisible iframe to Entra. Works if the user has an Entra session cookie.</li>
            <li><strong>Throw <code>InteractionRequiredAuthError</code>.</strong> If all three fail, user needs to sign in interactively again.</li>
          </ol>

          <h3>ID token vs access token</h3>
          <CodePre>{`const result = await instance.acquireTokenSilent({ scopes: ['User.Read'] })

result.idToken      // ← JWT, audience = your client ID — send to YOUR backend
result.accessToken  // ← JWT, audience = api://... or graph URL — send to that API
result.account      // ← AccountInfo
result.expiresOn    // ← Date
result.scopes       // ← array of granted scopes`}</CodePre>

          <p>For apps that only protect their own backend (Hearth, GLP1, Cairn, ShopKeep), send <code>idToken</code>. For apps calling sibling APIs (Workshop → Tabloom), send <code>accessToken</code>.</p>

          <h3>Common foot-gun: requesting a scope you can't get</h3>
          <p>If you call <code>acquireTokenSilent({`{ scopes: ['some.bogus.scope'] }`})</code>, MSAL fails. The scope must be either (a) a Microsoft Graph delegated permission your app reg has, or (b) a custom scope from another app reg's "Expose an API." See the Entra ID guide §7.</p>

          <h3>The 5-minute safety margin</h3>
          <p>MSAL refreshes tokens ~5 minutes before they expire by default. If you have a long-running batch operation, the token in your hand might expire mid-flight. Re-call <code>acquireTokenSilent</code> before each API call rather than caching the token in your code.</p>
        </section>

        <hr />

        {/* SECTION 8 — API CLIENT */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>API Client with Bearer Token</h2>
          <p>The pattern: a thin wrapper around fetch that calls <code>getToken</code> first, attaches <code>Authorization: Bearer</code>, then makes the request.</p>

          <h3>Workshop's full api.ts</h3>
          <CodePre>{`// workshop/src/services/api.ts — verbatim (truncated)
import type { IPublicClientApplication } from '@azure/msal-browser'
import { getApiToken } from '../auth/getToken'

const BASE = '/api'

let msal: IPublicClientApplication | null = null
export function setMsalInstance(instance: IPublicClientApplication) { msal = instance }

async function authHeaders(): Promise<Record<string, string>> {
  if (!msal) return {}
  const token = await getApiToken(msal)
  return { Authorization: \`Bearer \${token}\` }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const auth = await authHeaders()
  const res = await fetch(\`\${BASE}\${url}\`, {
    ...options,
    headers: { ...auth, ...(options?.headers as Record<string, string> | undefined) },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

const json = (method: string, body?: unknown) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: body !== undefined ? JSON.stringify(body) : undefined,
})

// Per-domain functions on top
export const listProjects = () => request<ProjectListItem[]>('/projects')
export const getProject   = (id: number) => request<ProjectDetail>(\`/projects/\${id}\`)
export const createProject = (p: ProjectFormPayload) =>
  request<ProjectListItem>('/projects', json('POST', p))
export const updateProject = (id: number, p: Partial<ProjectFormPayload>) =>
  request<ProjectListItem>(\`/projects/\${id}\`, json('PUT', p))
export const deleteProject = (id: number) =>
  request<{ success: boolean }>(\`/projects/\${id}\`, { method: 'DELETE' })`}</CodePre>

          <h3>Why a module-level singleton for the MSAL instance</h3>
          <p>The instance comes from React (via <code>useMsal</code>), but the API client is called from anywhere — event handlers, useEffects, even from outside React (e.g. service-worker). Stashing the instance at boot via <code>setMsalInstance(pca)</code> means every call site can access it without prop-drilling.</p>

          <h3>Usage in components</h3>
          <CodePre>{`// Anywhere in the React tree:
import { listProjects } from '../services/api'

function Dashboard() {
  const [projects, setProjects] = useState<ProjectListItem[]>([])

  useEffect(() => {
    listProjects().then(setProjects).catch(console.error)
  }, [])

  return <ProjectGrid projects={projects} />
}`}</CodePre>

          <p>No MSAL-related code in the component. The token acquisition is invisible because it's hidden in <code>request()</code>.</p>

          <h3>Uploads (multipart) need extra care</h3>
          <p>For file uploads, you can't set <code>Content-Type: application/json</code> — multer needs to see the original multipart boundary header. Use FormData and let fetch set the right Content-Type automatically:</p>
          <CodePre>{`// workshop/src/services/api.ts — verbatim (truncated)
export const uploadImage = async (
  projectId: number,
  kind: 'sketch' | 'inspiration',
  file: File,
  onProgress?: (pct: number) => void,
): Promise<{ id: number }> => {
  const auth = await authHeaders()
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('kind', kind)
    form.append('file', file)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', \`\${BASE}/projects/\${projectId}/images\`)
    for (const [k, v] of Object.entries(auth)) xhr.setRequestHeader(k, v)
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(new Error(\`Upload failed: \${xhr.status}\`))
      }
    }
    xhr.onerror = () => reject(new Error('Upload error'))
    xhr.send(form)
  })
}`}</CodePre>

          <p>XHR rather than fetch — needed for the upload progress callback. Bearer token attached via headers; FormData lets the browser pick the multipart boundary.</p>
        </section>

        <hr />

        {/* SECTION 9 — OID HEADER */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>The OID-Header Variant (ShopKeep)</h2>
          <p>
            ShopKeep takes a different approach: instead of attaching a JWT and validating it server-side, it sends the
            user's OID directly in a custom <code>X-User-OID</code> header. The server trusts the header (because the
            client is already authenticated to Entra) and uses the OID to look up the right user DB.
          </p>

          <h3>ShopKeep's API client</h3>
          <CodePre>{`// ShopKeep/src/services/toolService.ts — verbatim (truncated)
import type { Tool, ToolFormData } from '../types/tool'
import { getUserOid } from './userContext'

const BASE = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const oid = getUserOid()
  const headers: Record<string, string> = { ...(options?.headers as Record<string, string> ?? {}) }
  if (oid) headers['X-User-OID'] = oid
  const res = await fetch(\`\${BASE}\${url}\`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? res.statusText)
  }
  return res.json() as Promise<T>
}`}</CodePre>

          <h3>Where the OID comes from</h3>
          <CodePre>{`// ShopKeep/src/services/userContext.ts (pattern)
let _oid: string | null = null

export function setUserOid(oid: string) {
  _oid = oid
}

export function getUserOid(): string | null {
  return _oid
}`}</CodePre>

          <p>A module-level singleton. Set by AuthGuard during render (the synchronous-OID pattern in §10). Read by the API client at request time.</p>

          <h3>Why this approach</h3>
          <ul>
            <li><strong>Simplicity.</strong> No JWT verification on the server side. Just <code>req.headers['x-user-oid']</code>.</li>
            <li><strong>Image URLs.</strong> <code>{`<img>`}</code> tags can't send custom headers via fetch, but they CAN send query-string parameters. ShopKeep adds <code>?oid=...</code> to image URLs to convey the same identity.</li>
            <li><strong>Cold-start tolerance.</strong> No JWKS fetch needed; the server can answer the first request to <code>/api/tools</code> in microseconds.</li>
          </ul>

          <h3>Why this approach is less secure than JWT</h3>
          <ul>
            <li><strong>Server trusts the client.</strong> If anyone could send <code>X-User-OID: &lt;someone-else's-oid&gt;</code>, they'd see that user's data. The mitigation is "the API isn't exposed to the public internet" — which is true here, but fragile.</li>
            <li><strong>No expiration enforcement.</strong> The OID is forever; a JWT expires after an hour.</li>
            <li><strong>No tenant verification.</strong> A malicious user from a different tenant who knew an OID could impersonate.</li>
          </ul>

          <p>The fleet's other apps use JWT validation (covered in the JWT Validation guide) for these reasons. ShopKeep's OID-header pattern is acceptable for the specific household scale it targets, but isn't a general recommendation.</p>

          <h3>Image URLs with the query-string fallback</h3>
          <CodePre>{`// Bad — <img> can't send custom headers
<img src={\`/api/tools/images/\${toolId}\`} />

// ShopKeep's workaround — embed OID in URL
const oid = getUserOid()
<img src={\`/api/tools/images/\${toolId}?oid=\${oid}\`} />`}</CodePre>

          <p>Server-side, ShopKeep's image route reads <code>req.query.oid</code> with a regex validation to be sure it's a valid OID format (defense in depth).</p>
        </section>

        <hr />

        {/* SECTION 10 — SYNC-OID PATTERN */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>The Synchronous-OID Race-Fix</h2>
          <p>
            ShopKeep / Workshop / GLP1 / Tabloom all share an MSAL pitfall: if you capture the user's OID in a
            <code>useEffect</code>, child components that fetch data in <em>their</em> first <code>useEffect</code> will
            fire <em>before</em> the OID is set. The fetch sends no OID → server returns empty → user sees empty
            dashboard for ~16ms after first login. ShopKeep's fix: capture during render.
          </p>

          <h3>The race, visualized</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant React as React renderer
  participant Guard as AuthGuard
  participant Child as Dashboard
  participant API as /api/tools
  Note over React,API: BAD pattern — OID set in useEffect
  React->>Guard: render
  Guard->>React: returns <Dashboard />
  React->>Child: render (queues useEffect)
  Note over React: All renders done, now run effects
  React->>Child: child useEffect: fetch /api/tools  ← BEFORE Guard's useEffect!
  Child->>API: GET /api/tools (no OID!)
  React->>Guard: Guard useEffect: setUserOid('abc')
  API->>Child: 200 [] (empty)`} />

          <h3>The fix — set during render</h3>
          <CodePre>{`// ShopKeep/src/auth/AuthGuard.tsx — verbatim (key lines)
export default function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();

  // Run synchronously during render (not in useEffect) so the OID is set before
  // any child component's useEffect fires — prevents a race where Dashboard fetches
  // data before the OID header is available on first login.
  const accounts = instance.getAllAccounts();
  if (!instance.getActiveAccount() && accounts.length > 0) {
    instance.setActiveAccount(accounts[0]);
  }
  const active = instance.getActiveAccount();
  if (active?.localAccountId) setUserOid(active.localAccountId);
  // ...
}`}</CodePre>

          <h3>Why this is safe</h3>
          <p>
            <code>setUserOid</code> writes to a module-level variable — not React state. Writing to a module-level value
            during render is safe because (a) it doesn't trigger a re-render, (b) it doesn't subscribe to React's
            scheduling, (c) the next render will read the same value. The "rule against side effects in render" is
            specifically about React state updates, not external store writes.
          </p>

          <h3>Why <code>useLayoutEffect</code> doesn't help</h3>
          <p>
            <code>useLayoutEffect</code> runs synchronously after commit but <em>before paint</em> — and crucially,
            <em>after</em> all child effects have already queued. So it still fires after the child's fetch, just before
            the browser paints. The race is identical.
          </p>

          <h3>The general lesson</h3>
          <ul>
            <li>State that needs to be available to children on their first render must be captured <strong>during render</strong>, not in any effect.</li>
            <li>"During render" means either: (a) a module-level store (ShopKeep's <code>userContext</code>, or a Zustand/Jotai store), (b) context whose value is computed during render, (c) props.</li>
            <li>If a value must come from an async source (e.g. token refresh), gate the children behind <code>{`if (!value) return <Spinner />`}</code> instead.</li>
          </ul>

          <h3>The async-OID variant — gate, don't race</h3>
          <CodePre>{`function AuthGuard({ children }: { children: ReactNode }) {
  const [oid, setOid] = useState<string | null>(null)
  const { instance } = useMsal()

  useEffect(() => {
    const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
    if (account) setOid(account.localAccountId)
  }, [instance])

  if (!oid) return <Spinner />                  // children don't render until OID is set
  return <UserContext.Provider value={oid}>{children}</UserContext.Provider>
}`}</CodePre>

          <p>The trade-off: an extra spinner frame on first paint, in exchange for no race. Workshop and Cairn use this gate-and-fetch pattern; ShopKeep uses synchronous-during-render. Both work.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Full Sign-In + API Call</h2>
          <p>Build a React app with full MSAL sign-in, an AuthGuard, a token-attaching API client, and an authenticated API call. ~30 minutes start to finish.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`npm create vite@latest msal-lab -- --template react-ts
cd msal-lab
npm i
npm i @azure/msal-browser @azure/msal-react`}</CodePre>

          <h3>Step 2 — Create app reg + config (from Entra ID guide § 11)</h3>
          <p>Create an app reg in your tenant, register <code>http://localhost:5173</code> as a SPA redirect URI, and grab the client + tenant IDs.</p>

          <CodePre>{`// src/auth/msalConfig.ts
import { LogLevel, type Configuration } from '@azure/msal-browser'

const clientId = 'YOUR_CLIENT_ID'
const tenantId = 'YOUR_TENANT_ID'

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: \`https://login.microsoftonline.com/\${tenantId}\`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: { cacheLocation: 'localStorage' },
  system: {
    loggerOptions: {
      loggerCallback(level, message, containsPii) {
        if (containsPii) return
        console.debug(\`[MSAL:\${LogLevel[level]}] \${message}\`)
      },
      logLevel: LogLevel.Warning,
    },
  },
}

export const loginRequest = { scopes: ['User.Read'] }`}</CodePre>

          <h3>Step 3 — Bootstrap MSAL</h3>
          <CodePre>{`// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './auth/msalConfig'
import { setMsalInstance } from './services/api'
import App from './App'

const pca = new PublicClientApplication(msalConfig)

pca.initialize().then(async () => {
  await pca.handleRedirectPromise()
  const accounts = pca.getAllAccounts()
  if (!pca.getActiveAccount() && accounts[0]) {
    pca.setActiveAccount(accounts[0])
  }
  setMsalInstance(pca)

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={pca}>
        <App />
      </MsalProvider>
    </StrictMode>
  )
})`}</CodePre>

          <h3>Step 4 — AuthGuard + LoginPage</h3>
          <CodePre>{`// src/auth/AuthGuard.tsx
import { useEffect } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import LoginPage from './LoginPage'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()

  useEffect(() => {
    const accounts = instance.getAllAccounts()
    if (!instance.getActiveAccount() && accounts.length > 0) {
      instance.setActiveAccount(accounts[0])
    }
  }, [instance, isAuthenticated])

  if (inProgress === InteractionStatus.HandleRedirect ||
      inProgress === InteractionStatus.AcquireToken) {
    return <div style={{ padding: 24 }}>Signing you in…</div>
  }

  if (!isAuthenticated) return <LoginPage />
  return <>{children}</>
}`}</CodePre>

          <CodePre>{`// src/auth/LoginPage.tsx
import { useMsal } from '@azure/msal-react'
import { loginRequest } from './msalConfig'

export default function LoginPage() {
  const { instance } = useMsal()
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>MSAL Lab</h1>
      <p>You must sign in to continue.</p>
      <button
        onClick={() => instance.loginRedirect(loginRequest)}
        style={{ padding: '8px 16px', fontSize: 16, cursor: 'pointer' }}
      >
        Sign in with Microsoft
      </button>
    </div>
  )
}`}</CodePre>

          <h3>Step 5 — Token helper</h3>
          <CodePre>{`// src/auth/getToken.ts
import { InteractionRequiredAuthError, type IPublicClientApplication } from '@azure/msal-browser'

export async function getIdToken(instance: IPublicClientApplication): Promise<string> {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) throw new Error('Not signed in')
  try {
    const result = await instance.acquireTokenSilent({ scopes: ['User.Read'], account })
    return result.idToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect({ scopes: ['User.Read'], account })
      throw err
    }
    throw err
  }
}`}</CodePre>

          <h3>Step 6 — API client with Bearer</h3>
          <CodePre>{`// src/services/api.ts
import type { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../auth/getToken'

let msal: IPublicClientApplication | null = null
export function setMsalInstance(instance: IPublicClientApplication) { msal = instance }

export async function whoAmI() {
  if (!msal) throw new Error('MSAL not initialized')
  const token = await getIdToken(msal)
  // For this lab we don't have a real backend, so we'll decode the token ourselves.
  const payload = JSON.parse(atob(token.split('.')[1]))
  return payload
}`}</CodePre>

          <h3>Step 7 — App that ties it all together</h3>
          <CodePre>{`// src/App.tsx
import { useState } from 'react'
import { useMsal } from '@azure/msal-react'
import AuthGuard from './auth/AuthGuard'
import { whoAmI } from './services/api'

function Dashboard() {
  const { instance, accounts } = useMsal()
  const [claims, setClaims] = useState<Record<string, unknown> | null>(null)

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Signed in as {accounts[0]?.name}</h1>
      <p>OID: <code>{accounts[0]?.localAccountId}</code></p>
      <button onClick={async () => setClaims(await whoAmI())}>
        Get my ID token claims
      </button>
      {claims && (
        <pre style={{ background: '#f5f5f5', padding: 16, marginTop: 16 }}>
          {JSON.stringify(claims, null, 2)}
        </pre>
      )}
      <hr />
      <button onClick={() => instance.logoutRedirect()}>Sign out</button>
    </div>
  )
}

export default function App() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}`}</CodePre>

          <h3>Step 8 — Run it</h3>
          <CodePre>{`npm run dev`}</CodePre>

          <ol>
            <li>Open <code>http://localhost:5173</code>. You see "MSAL Lab" + Sign in button.</li>
            <li>Click "Sign in." Entra page loads. Sign in with a tenant user.</li>
            <li>Redirected back. AuthGuard now renders the Dashboard.</li>
            <li>Click "Get my ID token claims." The decoded JWT payload renders.</li>
            <li>Click "Sign out." You're redirected through Entra's logout and back to the LoginPage.</li>
          </ol>

          <h3>Step 9 — Test the edge cases</h3>
          <p>Try each of these:</p>
          <ul>
            <li><strong>Refresh the page after signing in</strong>: Dashboard reappears immediately (token in localStorage).</li>
            <li><strong>Open in a new tab</strong>: signed in there too (localStorage shared).</li>
            <li><strong>Open in an incognito window</strong>: sees LoginPage (no localStorage).</li>
            <li><strong>Sign out, then click Sign in</strong>: account picker appears.</li>
            <li><strong>Hover the button before clicking</strong>: nothing happens; MSAL only triggers on click.</li>
          </ul>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated every fleet app's auth shape: bootstrap, AuthGuard, LoginPage, token helper, API client.
              The remaining production concerns (synchronous-OID race-fix, sibling-app tokens, OID-header alternative)
              are extensions of this skeleton.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"BrowserAuthError: interaction_in_progress"</h3>
          <p>You called <code>loginRedirect</code> (or similar) while another interaction was mid-flight. Common cause: <code>handleRedirectPromise()</code> wasn't called before React rendered. Move it to <code>main.tsx</code>'s bootstrap (see §2).</p>

          <h3>Dashboard renders empty on first login, then populates on refresh</h3>
          <p>The synchronous-OID race (§10). Either set OID during render (ShopKeep), or gate children behind a spinner until OID is loaded.</p>

          <h3>"No accounts in MSAL state"</h3>
          <p>You skipped <code>setActiveAccount</code>. After successful sign-in, <code>getAllAccounts()</code> returns an array, but <code>getActiveAccount()</code> is null. Call <code>setActiveAccount(accounts[0])</code> at boot.</p>

          <h3>Token from <code>acquireTokenSilent</code> has wrong audience</h3>
          <p>You requested the wrong scopes. For your own backend, request <code>User.Read</code> and use <code>result.idToken</code>. For sibling APIs, request <code>api://&lt;client-id&gt;/access_as_user</code> and use <code>result.accessToken</code>.</p>

          <h3>"Refresh token expired" or interactive sign-in keeps appearing</h3>
          <p>Refresh tokens last ~90 days by default. If the user hasn't visited in that long, interactive sign-in is mandatory. This is normal — handle with try/catch + <code>acquireTokenRedirect</code>.</p>

          <h3>localStorage is cleared but user is still signed in</h3>
          <p>You cleared MSAL's keys but Entra still has a session cookie. Call <code>logoutRedirect()</code> to clear both.</p>

          <h3>Safari blocks tokens in the redirect callback</h3>
          <p>Safari's ITP (Intelligent Tracking Prevention) sometimes blocks third-party cookies that MSAL's iframe-based silent refresh relies on. Fixes: (a) ensure both the app and Entra are on the same eTLD+1 (rarely possible), (b) accept that interactive sign-in is the only path on Safari, (c) configure custom domain on Entra (advanced).</p>

          <h3>"window.location is undefined" during SSR</h3>
          <p>You're rendering MSAL config in a server-side context. <code>window.location.origin</code> doesn't exist there. Either: (a) use a static string for <code>redirectUri</code>, (b) lazy-initialize the config inside a useEffect, (c) check <code>typeof window === 'undefined'</code> first.</p>

          <h3>"interactionType not supported"</h3>
          <p>You're trying to use popup methods in an environment that doesn't support popups (mobile webview, IE11). Switch to redirect.</p>

          <h3>useEffect re-runs and calls loginRedirect twice</h3>
          <p>Strict Mode + a dependency that changes on every render. The effect's deps should not include the MSAL instance every render — extract a stable reference, or skip the effect entirely if the call would be a no-op.</p>

          <h3>"Cannot read property 'accessToken' of undefined"</h3>
          <p><code>acquireTokenSilent</code> threw and you didn't catch it. Wrap in try/catch and handle <code>InteractionRequiredAuthError</code> by calling <code>acquireTokenRedirect</code>.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Boot order</h3>
          <CodePre>{`const pca = new PublicClientApplication(msalConfig)
await pca.initialize()
await pca.handleRedirectPromise()
const accounts = pca.getAllAccounts()
if (!pca.getActiveAccount() && accounts[0]) pca.setActiveAccount(accounts[0])
// THEN render React`}</CodePre>

          <h3>The three hooks</h3>
          <CodePre>{`useMsal()                  // { instance, accounts, inProgress }
useIsAuthenticated()       // boolean
useAccount(accountIdentifier)  // specific account by homeAccountId / username`}</CodePre>

          <h3>Sign in / out</h3>
          <CodePre>{`instance.loginRedirect(loginRequest)
instance.logoutRedirect()
instance.loginPopup(loginRequest)        // discouraged
instance.acquireTokenSilent(scopeRequest)
instance.acquireTokenRedirect(scopeRequest)  // fallback when silent fails`}</CodePre>

          <h3>Get a token</h3>
          <CodePre>{`async function getToken(scopes: string[]) {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) throw new Error('Not signed in')
  try {
    const result = await instance.acquireTokenSilent({ scopes, account })
    return result.idToken          // OR result.accessToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect({ scopes, account })
    }
    throw err
  }
}`}</CodePre>

          <h3>API client wrapper</h3>
          <CodePre>{`async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = await getToken(['User.Read'])
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: \`Bearer \${token}\`, ...(options?.headers ?? {}) },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}`}</CodePre>

          <h3>The AuthGuard skeleton</h3>
          <CodePre>{`function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const { instance, inProgress } = useMsal()

  useEffect(() => {
    const accounts = instance.getAllAccounts()
    if (!instance.getActiveAccount() && accounts.length > 0) {
      instance.setActiveAccount(accounts[0])
    }
  }, [instance, isAuthenticated])

  if (inProgress === InteractionStatus.HandleRedirect) return <Loading />
  if (!isAuthenticated) return <LoginPage />
  return <>{children}</>
}`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>Hardcoded config</td><td>SecretApp · <code>src/auth/msalConfig.ts</code></td></tr>
              <tr><td>Env-baked config with validation</td><td>ShopKeep · <code>src/auth/msalConfig.ts</code></td></tr>
              <tr><td>AuthGuard with useEffect</td><td>SecretApp · <code>src/auth/AuthGuard.tsx</code></td></tr>
              <tr><td>AuthGuard with synchronous OID</td><td>ShopKeep · <code>src/auth/AuthGuard.tsx</code></td></tr>
              <tr><td>Token acquisition pattern</td><td>workshop · <code>src/auth/getToken.ts</code></td></tr>
              <tr><td>Sibling-app token (different scope)</td><td>workshop · <code>src/auth/getTabloomToken.ts</code></td></tr>
              <tr><td>API client w/ Bearer</td><td>workshop · <code>src/services/api.ts</code></td></tr>
              <tr><td>API client w/ X-User-OID</td><td>ShopKeep · <code>src/services/toolService.ts</code></td></tr>
              <tr><td>XHR upload with auth</td><td>workshop · <code>src/services/api.ts</code> (uploadImage)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: JWT validation server-side.</p>
        </section>
      </main>
    </div>
  );
}
