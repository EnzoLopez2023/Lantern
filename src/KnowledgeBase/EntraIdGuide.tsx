import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Tenants & Subscriptions',          icon: '🏛️' },
  { id: 's3',  num: '3',  title: 'App Registration Anatomy',         icon: '📋' },
  { id: 's4',  num: '4',  title: 'Authorities & Audiences',          icon: '🌐' },
  { id: 's5',  num: '5',  title: 'Redirect URIs',                    icon: '↪️' },
  { id: 's6',  num: '6',  title: 'Token Types — ID vs Access',       icon: '🎫' },
  { id: 's7',  num: '7',  title: 'Scopes & Permissions',             icon: '🔓' },
  { id: 's8',  num: '8',  title: 'Expose an API',                    icon: '🚪' },
  { id: 's9',  num: '9',  title: 'OIDC Federated Credentials',       icon: '🤝' },
  { id: 's10', num: '10', title: 'Fleet Inventory',                  icon: '📦' },
  { id: 's11', num: '★',  title: 'Lab: Create a Fresh App Reg',      icon: '🛠️' },
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

export default function EntraIdGuide() {
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
            <span className="sidebar-title">Entra ID Deep Dive</span>
          </div>
          <div className="sidebar-sub">tenants, app regs, tokens</div>
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
          <div className="hero-tag">🆔 Microsoft Entra ID · 2026</div>
          <h1>Entra ID<br />App Registrations</h1>
          <p>
            Every fleet app authenticates against <strong style={{ color: '#C77AA0' }}>Microsoft Entra ID</strong> (the
            artist formerly known as Azure AD). This guide walks the underlying identity primitives — tenants, app
            registrations, redirect URIs, ID vs access tokens, scopes, the "Expose an API" dance — using the actual app
            registrations from the eight fleet apps as worked examples.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">8/8</span><span className="hero-stat-label">Apps Use Entra</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Tenants in Play</span></div>
            <div className="hero-stat"><span className="hero-stat-val">8+8</span><span className="hero-stat-label">App Regs + CI SPs</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Static Secrets</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Entra ID is Microsoft's identity-as-a-service. It does one thing well: <em>given a user, prove who they
            are</em>. Your app trusts Entra; Entra trusts the user; therefore your app trusts the user. You never see
            passwords, never store credentials, never run a sign-in form. You just check the token Entra produces.
          </p>

          <h3>Three analogies that explain it</h3>
          <p>
            <strong>The hotel front desk.</strong> Entra is the front desk that issues key cards. Your app is a room
            with a card reader. The reader doesn't know who the guest is; it just verifies the card was issued by the
            front desk and hasn't expired.
          </p>
          <p>
            <strong>The passport.</strong> A passport is a document issued by a trusted authority (a government). Border
            agents don't call the government — they verify the passport's signature and visible features. Tokens are
            the same: signed by Entra, verifiable offline (with the right public key), good for an hour.
          </p>
          <p>
            <strong>The kerberos ticket.</strong> If you're old enough to remember Active Directory, Entra is the cloud
            version of the same basic dance: kdc-equivalent issues tickets, services validate tickets, users never
            type passwords twice. The mechanics moved to HTTPS + JWTs; the model is unchanged.
          </p>

          <h3>What Entra is</h3>
          <table>
            <tbody>
              <tr><th>Term</th><th>What it is</th></tr>
              <tr><td><strong>Tenant</strong></td><td>An organization-shaped container for users, groups, app registrations. <em>The</em> unit of isolation.</td></tr>
              <tr><td><strong>User</strong></td><td>A human (or service) identity within a tenant. Has an OID (object ID, a GUID).</td></tr>
              <tr><td><strong>App Registration</strong></td><td>Your app's identity in the tenant. Has a Client ID. Defines what scopes it requests and what redirect URIs it allows.</td></tr>
              <tr><td><strong>Service Principal</strong></td><td>The instantiation of an app registration in a tenant. App reg = template; SP = "in this tenant, this app exists."</td></tr>
              <tr><td><strong>Scope</strong></td><td>A named permission. <code>User.Read</code> is a built-in; <code>api://&lt;guid&gt;/access_as_user</code> is custom.</td></tr>
              <tr><td><strong>Token</strong></td><td>A signed JWT proving "this user authenticated, with these scopes, in this tenant." Two kinds: ID + access.</td></tr>
              <tr><td><strong>OID</strong></td><td>Object ID — the user's GUID within a tenant. The same human has different OIDs in different tenants.</td></tr>
            </tbody>
          </table>

          <h3>What it is NOT</h3>
          <ul>
            <li><strong>Not an authorization service.</strong> Entra proves who you are; your app decides what you can do. Fleet apps that use roles (Tabloom owner/editor/viewer) store roles in their own DB.</li>
            <li><strong>Not a session manager.</strong> Tokens are stateless. There's no "log out everywhere" lever short of revoking the user's account or rotating signing keys.</li>
            <li><strong>Not free at every tier.</strong> Standard sign-in is free; advanced features (Conditional Access, P2 PIM) are licensed. Fleet apps don't use those.</li>
            <li><strong>Not the same as on-prem AD.</strong> Entra is cloud-only. The on-prem product is Active Directory; the bridge is Entra Connect.</li>
          </ul>

          <h3>The four pieces of every Entra-protected request</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User browser
  participant F as Frontend (React)
  participant E as Entra ID
  participant A as Your API
  Note over U,F: 1. App loads, no token
  F->>E: redirect: login
  E->>U: sign-in page
  U->>E: credentials + MFA
  E->>F: redirect back + tokens
  F->>F: store tokens (localStorage)
  Note over F,A: 2. Token-attached API call
  F->>A: GET /api/recipes + Bearer token
  A->>A: verify signature, audience, expiry
  A->>F: 200 [recipes]`} />
        </section>

        <hr />

        {/* SECTION 2 — TENANTS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Tenants & Subscriptions</h2>
          <p>
            Tenants and Azure subscriptions are <em>related but separate</em>. A subscription belongs to a tenant (it's
            who you billed when), but a tenant can host many subscriptions, and many app registrations that have
            nothing to do with Azure resources.
          </p>

          <h3>The fleet's dual-tenant story</h3>
          <p>Two tenants in play:</p>
          <table>
            <tbody>
              <tr><th>Tenant ID (prefix)</th><th>Purpose</th><th>Hosts</th></tr>
              <tr><td><code>de625678-…</code></td><td>Compute / billing</td><td>The Azure subscription, App Services, ACR, OIDC service principals for GitHub Actions</td></tr>
              <tr><td><code>52188f12-…</code></td><td>User-facing identities</td><td>The MSAL app registrations users sign in to</td></tr>
            </tbody>
          </table>

          <p>Why two? It's the most common pattern in real-world Azure: the corporate identity tenant (where employees and customers live) is intentionally separate from the tenant that holds Azure-resource service principals. Fleet apps mirror this — even though it's overkill for personal use, it keeps the patterns transferable.</p>

          <h3>What's in each tenant</h3>

          <h4>Compute tenant (<code>de625678-…</code>) holds:</h4>
          <ul>
            <li>The Azure subscription <code>1cf02211-8d77-4658-bb6a-0f83ec831c3b</code></li>
            <li>The resource group <code>rg-personal-apps-prod</code></li>
            <li>8 OIDC service principals — <code>github-cairn-ci</code>, <code>github-shopkeep-ci</code>, etc.</li>
            <li>Federated credentials linking each SP to <code>repo:&lt;your-github-org&gt;/&lt;repo&gt;:ref:refs/heads/main</code></li>
          </ul>

          <h4>User tenant (<code>52188f12-…</code>) holds:</h4>
          <ul>
            <li>8 user-facing app registrations (one per fleet app)</li>
            <li>Each with: client ID, redirect URIs, exposed API scopes, "Sign in users + read profile" permission</li>
            <li>The actual users (you, your spouse, anyone else who needs to sign in)</li>
          </ul>

          <h3>Cross-tenant token issuance</h3>
          <p>Here's the subtle bit: when you sign in to a fleet app, Entra ID issues a token. The token's <code>iss</code> claim points at the <strong>user tenant</strong> (<code>52188f12</code>). The token's <code>aud</code> claim is the user-tenant app registration's client ID. The compute tenant doesn't appear in any of this — it only matters at deploy time.</p>

          <h3>Why you'd want a single tenant instead</h3>
          <p>For a true personal app you control entirely, one tenant simplifies everything. The fleet picks two-tenant because it's the pattern that scales — the same app code works whether you're at "personal app, one tenant" or "enterprise app, separate identity tenant."</p>

          <h3>Other tenant kinds you might encounter</h3>
          <table>
            <tbody>
              <tr><th>Tenant kind</th><th>When used</th></tr>
              <tr><td>Workforce tenant</td><td>The default. Employees + B2B guests.</td></tr>
              <tr><td>External tenant</td><td>For customer-facing apps (Entra External ID, formerly Azure AD B2C).</td></tr>
              <tr><td>Personal Microsoft Account "tenant"</td><td>Outlook / Hotmail / Xbox accounts. Puzzlebox uses this — the only fleet app on personal MSAs.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 3 — APP REG ANATOMY */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>App Registration Anatomy</h2>
          <p>The single object that defines your app's identity to Entra. Created in the Azure portal under <strong>Entra ID → App registrations → New registration</strong>.</p>

          <h3>The fields that matter</h3>
          <table>
            <tbody>
              <tr><th>Field</th><th>What it is</th><th>Fleet example</th></tr>
              <tr><td><strong>Display name</strong></td><td>Human-readable name (cosmetic, not the identifier)</td><td><code>SecretApp</code></td></tr>
              <tr><td><strong>Application (client) ID</strong></td><td>The GUID your app code uses</td><td><code>55bf92db-2cec-4e65-ab0d-71bee90d7494</code> (Hearth)</td></tr>
              <tr><td><strong>Directory (tenant) ID</strong></td><td>Which tenant hosts this app reg</td><td><code>52188f12-db6b-46c6-88ff-08c802f0ed3b</code></td></tr>
              <tr><td><strong>Object ID</strong></td><td>Tenant-specific identifier of the SP (rarely used in code)</td><td>Different from client ID</td></tr>
              <tr><td><strong>Supported account types</strong></td><td>Single tenant / multi-tenant / personal accounts</td><td>Single tenant for fleet (except Puzzlebox)</td></tr>
              <tr><td><strong>Redirect URIs</strong></td><td>Allowed post-sign-in landing pages</td><td>§5</td></tr>
              <tr><td><strong>API permissions</strong></td><td>What the app can do on behalf of users (Graph, custom APIs)</td><td>§7</td></tr>
              <tr><td><strong>Expose an API</strong></td><td>Define scopes other apps can request</td><td>§8</td></tr>
              <tr><td><strong>Certificates &amp; secrets</strong></td><td>Client secrets / certs (only confidential clients)</td><td>PulseWire only (server-side)</td></tr>
              <tr><td><strong>Federated credentials</strong></td><td>OIDC trust to GitHub / etc.</td><td>§9 — every CI SP</td></tr>
              <tr><td><strong>Authentication</strong></td><td>Implicit grant settings, allowed flows</td><td>SPA flow for fleet</td></tr>
            </tbody>
          </table>

          <h3>App reg vs Service Principal vs Enterprise App</h3>
          <p>The terminology trap that catches everyone:</p>
          <ul>
            <li>An <strong>App Registration</strong> defines the app — the template. Lives in one tenant. <em>This is where you set redirect URIs, permissions, secrets.</em></li>
            <li>A <strong>Service Principal</strong> (also called "Enterprise Application" in the portal) is the app's instantiation in a tenant. <em>This is where you grant the app permissions, see sign-in logs.</em></li>
            <li>Single-tenant: app reg + SP in the same tenant. They look "merged" in the UI but the underlying objects are distinct.</li>
            <li>Multi-tenant: one app reg in the home tenant, one SP in every consumer tenant.</li>
          </ul>

          <p>For fleet apps, single-tenant means there's one of each, in the user tenant. You'll only touch "App registrations" in the portal day-to-day. "Enterprise applications" is where you'd grant tenant-wide admin consent or see sign-in counts.</p>

          <h3>The minimum-viable app reg</h3>
          <ol>
            <li><strong>Name:</strong> <code>MyApp</code></li>
            <li><strong>Account types:</strong> "Single tenant" (or "Personal Microsoft accounts only" for hobby toys)</li>
            <li><strong>Redirect URI:</strong> <code>https://myapp.example.com</code> (platform: <strong>SPA</strong>)</li>
            <li><strong>API permissions:</strong> <code>User.Read</code> (Microsoft Graph, delegated). This is the default.</li>
          </ol>
          <p>That's it for sign-in. Adding custom scopes (§8) and federated credentials (§9) is on top of the minimum.</p>
        </section>

        <hr />

        {/* SECTION 4 — AUTHORITIES & AUDIENCES */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Authorities & Audiences</h2>
          <p>Two key URL formats your code constantly references, distinguished by whether they emit v1 or v2 tokens.</p>

          <h3>Authority URL — where to redirect users for sign-in</h3>
          <CodePre>{`// v2 endpoint (modern — fleet default)
https://login.microsoftonline.com/{tenantId}/v2.0

// v1 endpoint (older — still issued by some app regs)
https://sts.windows.net/{tenantId}/

// Personal accounts only (Puzzlebox)
https://login.microsoftonline.com/consumers/

// Both work + personal (multi-tenant)
https://login.microsoftonline.com/common/
https://login.microsoftonline.com/organizations/`}</CodePre>

          <h3>The v1 vs v2 distinction</h3>
          <p>
            Each app registration has a manifest field <code>accessTokenAcceptedVersion</code> that's either <code>1</code>
            or <code>2</code>. The choice affects which issuer URL appears in the tokens it issues. Cairn's auth.js
            handles both because the manifest setting isn't always known:
          </p>

          <CodePre>{`// Cairn/middleware/auth.js — verbatim
// AAD can issue access tokens as v1.0 OR v2.0 depending on the App
// Registration manifest's \`accessTokenAcceptedVersion\` setting.
//   v1.0 iss: https://sts.windows.net/{tid}/
//   v2.0 iss: https://login.microsoftonline.com/{tid}/v2.0
// Accept both so the middleware works regardless of how the app reg is
// configured. (Default for new app regs is v1.0 unless the manifest
// explicitly sets accessTokenAcceptedVersion: 2.)
const ACCEPTED_ISSUERS = [
  \`https://login.microsoftonline.com/\${TENANT_ID}/v2.0\`,
  \`https://sts.windows.net/\${TENANT_ID}/\`,
]`}</CodePre>

          <h3>The audience trap</h3>
          <p>The <code>aud</code> claim on an issued token is <strong>either</strong>:</p>
          <ul>
            <li>The application ID URI: <code>api://&lt;client-id&gt;</code></li>
            <li>OR the bare client ID GUID: <code>55bf92db-2cec-…</code></li>
          </ul>
          <p>Which one depends on the same v1/v2 manifest setting. To be safe, accept both:</p>
          <CodePre>{`// Cairn/middleware/auth.js — verbatim
const ACCEPTED_AUDIENCES = [\`api://\${CLIENT_ID}\`, CLIENT_ID]`}</CodePre>

          <h3>Why this matters in production</h3>
          <p>
            The fleet has at least one app where the manifest was set to <code>accessTokenAcceptedVersion: 2</code>
            after the original deploy. Tokens that worked yesterday started getting rejected because the issuer URL
            changed. Accepting both issuers prevents this class of bug entirely.
          </p>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              Modern apps should set <code>accessTokenAcceptedVersion: 2</code> in the app reg manifest and write code
              that only accepts v2. The fleet picks the laxer "accept both" path because the manifest setting isn't
              under tight version control — better to be tolerant than fragile.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 5 — REDIRECT URIS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Redirect URIs</h2>
          <p>
            After successful sign-in, Entra redirects the user back to your app with the tokens. The redirect URI must
            <strong>exactly match</strong> one in the app reg's allow-list (case-sensitive on path, scheme, port).
          </p>

          <h3>Platform types</h3>
          <p>Entra distinguishes three platform types when you add a redirect URI:</p>
          <table>
            <tbody>
              <tr><th>Platform</th><th>For</th><th>Flow</th></tr>
              <tr><td>SPA</td><td>Browser-only JavaScript apps</td><td>Authorization code with PKCE (no client secret)</td></tr>
              <tr><td>Web</td><td>Server-side apps (Node, Express, Next.js server)</td><td>Authorization code with client secret OR federated identity</td></tr>
              <tr><td>Public client / Mobile / Desktop</td><td>Native apps, CLI tools</td><td>Device code, OS-level auth</td></tr>
            </tbody>
          </table>

          <p>Six fleet apps register URIs under SPA (Cairn, Hearth, GLP1, ShopKeep, Tabloom, Workshop). PulseWire registers under Web (server-side OIDC). Puzzlebox registers under SPA for personal Microsoft accounts.</p>

          <h3>Hearth's redirect URI set</h3>
          <CodePre>{`# Production
https://hearth.nintek.com
https://app-hearth-prod-lwxhu7jxlrbtu.azurewebsites.net

# Local dev
http://localhost:5173`}</CodePre>

          <p>Both production URLs are registered — the App Service default hostname AND the custom domain. The Vite dev server URL is registered too. Without it, sign-in works in prod but errors locally.</p>

          <h3>Hearth's msalConfig — using window.location.origin</h3>
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
  // ... cache + logger config ...
};`}</CodePre>

          <p>
            <code>window.location.origin</code> is a shortcut: at runtime, MSAL uses whatever origin the page was served
            from. Whether you're on <code>localhost:5173</code> or <code>hearth.nintek.com</code>, the same line
            picks the right value — as long as <em>all</em> those origins are in the app reg's allow-list.
          </p>

          <h3>Common foot-gun: trailing slashes</h3>
          <CodePre>{`# Registered: https://myapp.com
# Visited:    https://myapp.com/

# MSAL fails with AADSTS50011: "The reply URL specified in the request does
# not match the reply URLs configured for the application."`}</CodePre>

          <p>Register both with-and-without trailing slash, OR be consistent in your code. <code>window.location.origin</code> never has a trailing slash, so register without and you're fine.</p>

          <h3>Front-channel logout</h3>
          <p><code>postLogoutRedirectUri</code> is where Entra sends the user after they sign out. Same rules — must be in the allow-list. Defaults to home page if you don't set it.</p>
        </section>

        <hr />

        {/* SECTION 6 — TOKEN TYPES */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Token Types — ID vs Access</h2>
          <p>
            Entra issues two kinds of tokens, and conflating them is the source of half the auth bugs in the wild.
            Both are JWTs. Both contain user claims. They are used for different things.
          </p>

          <h3>The distinction</h3>
          <table>
            <tbody>
              <tr><th></th><th>ID token</th><th>Access token</th></tr>
              <tr><td>Purpose</td><td>"This user signed in"</td><td>"This user is allowed to call this API"</td></tr>
              <tr><td>Audience</td><td>The client app itself</td><td>The API being called (could be a different app)</td></tr>
              <tr><td>Typical <code>aud</code></td><td>Client ID GUID</td><td><code>api://&lt;client-id&gt;</code> (or GUID)</td></tr>
              <tr><td>Sent to</td><td>The frontend itself (consumed locally)</td><td>API server in <code>Authorization: Bearer</code></td></tr>
              <tr><td>Lifespan</td><td>~1 hour</td><td>~1 hour</td></tr>
              <tr><td>Format</td><td>JWT</td><td>JWT</td></tr>
              <tr><td>Refreshable</td><td>No (re-sign-in)</td><td>Yes (via refresh token)</td></tr>
            </tbody>
          </table>

          <h3>Most fleet apps use the ID token AS an access token</h3>
          <p>For an app that only protects its OWN backend (no calls to other APIs), the simplest pattern is: send the ID token to your own server, verify it there. Hearth, GLP1, Cairn, ShopKeep all do this:</p>

          <CodePre>{`// Client side — get the ID token
const result = await instance.acquireTokenSilent({ scopes: ['User.Read'] })
const idToken = result.idToken  // ← what we send to OUR API

// Server side — verify audience matches our client ID
const { payload } = await jwtVerify(idToken, JWKS, {
  audience: AAD_CLIENT_ID,
  issuer: \`https://login.microsoftonline.com/\${AAD_TENANT_ID}/v2.0\`,
})`}</CodePre>

          <h3>Workshop uses a real access token</h3>
          <p>Workshop needs to call <em>Tabloom</em>'s API (its sibling app). For that it requests an access token with Tabloom's scope:</p>

          <CodePre>{`// workshop/src/auth/getTabloomToken.ts — verbatim
import { InteractionRequiredAuthError, type IPublicClientApplication } from '@azure/msal-browser'

const TABLOOM_CLIENT_ID = import.meta.env.VITE_TABLOOM_CLIENT_ID

export const tabloomApiScope = \`api://\${TABLOOM_CLIENT_ID}/access_as_user\`

export async function getTabloomToken(instance: IPublicClientApplication): Promise<string> {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) throw new Error('No signed-in account')
  try {
    const result = await instance.acquireTokenSilent({ scopes: [tabloomApiScope], account })
    return result.accessToken  // ← access token, NOT idToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect({ scopes: [tabloomApiScope], account })
      throw err
    }
    throw err
  }
}`}</CodePre>

          <p>This token's <code>aud</code> is <code>api://&lt;tabloom-client-id&gt;</code>. Tabloom's server verifies that audience and grants Workshop access to its API.</p>

          <h3>Inspecting a token</h3>
          <p>Paste the JWT into <a href="https://jwt.ms" target="_blank" rel="noopener noreferrer">jwt.ms</a> (Microsoft's tool — it never leaves your browser). You'll see claims like:</p>

          <CodePre>{`{
  "aud": "55bf92db-2cec-4e65-ab0d-71bee90d7494",
  "iss": "https://login.microsoftonline.com/52188f12-.../v2.0",
  "iat": 1716659200,
  "nbf": 1716659200,
  "exp": 1716662800,
  "name": "Alex Wilber",
  "oid": "abc12345-...",
  "preferred_username": "alex.wilber@contoso.com",
  "sub": "...",
  "tid": "52188f12-...",
  "ver": "2.0"
}`}</CodePre>

          <p>Critical claims for verification: <code>aud</code>, <code>iss</code>, <code>exp</code>, <code>oid</code>, <code>tid</code>. The middleware checks each.</p>

          <h3>Refresh tokens</h3>
          <p>MSAL stores a refresh token alongside the access token. When the access token expires (typically after an hour), <code>acquireTokenSilent</code> uses the refresh token to get a new one without prompting the user. Fleet apps never see the refresh token directly — MSAL handles the entire lifecycle.</p>
        </section>

        <hr />

        {/* SECTION 7 — SCOPES & PERMISSIONS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Scopes & Permissions</h2>

          <h3>Permission categories</h3>
          <table>
            <tbody>
              <tr><th>Kind</th><th>Means</th></tr>
              <tr><td>Delegated</td><td>Acting on behalf of a signed-in user. Most fleet permissions are this.</td></tr>
              <tr><td>Application</td><td>Acting as the app itself, no user. Used by background services. None in fleet.</td></tr>
            </tbody>
          </table>

          <h3>Microsoft Graph — the built-in API</h3>
          <p>Graph is Microsoft's "everything API" — calendars, mail, files, groups, users. Most fleet apps only use <code>User.Read</code> — enough to get the user's display name + email on the profile page:</p>

          <CodePre>{`// Hearth/src/auth/msalConfig.ts — verbatim
export const loginRequest = {
  scopes: ['User.Read'],
}`}</CodePre>

          <p>Pass these scopes to <code>instance.loginRedirect(loginRequest)</code> or <code>acquireTokenSilent(loginRequest)</code>. MSAL handles the consent and token acquisition.</p>

          <h3>Custom API scopes — your app's own API</h3>
          <p>If your app exposes its own API to OTHER apps (Workshop calls Tabloom), Tabloom defines a custom scope. The format is <code>api://&lt;tabloom-client-id&gt;/&lt;scope-name&gt;</code>. Common names: <code>access_as_user</code>, <code>read</code>, <code>write</code>, <code>admin</code>.</p>

          <p>Tabloom defines <code>access_as_user</code>. Workshop requests it:</p>
          <CodePre>{`// workshop/src/auth/getTabloomToken.ts
export const tabloomApiScope = \`api://\${TABLOOM_CLIENT_ID}/access_as_user\``}</CodePre>

          <h3>Admin consent vs user consent</h3>
          <p>
            Permissions can be consented to per-user (a single user clicks "yes, this app can read my profile") or
            tenant-wide (an admin clicks once, every user is automatically granted). For personal apps, per-user is
            fine. For workplace apps, ask admins to do tenant-wide consent so individual users don't see a consent
            dialog.
          </p>

          <h3>Adding a Graph permission to an app reg</h3>
          <ol>
            <li><strong>Entra → App registrations → MyApp → API permissions → Add a permission</strong>.</li>
            <li>Pick <strong>Microsoft Graph → Delegated permissions</strong>.</li>
            <li>Search for the permission (e.g. <code>User.Read</code>) and add it.</li>
            <li>For broader-scoped permissions, click "Grant admin consent for &lt;tenant&gt;" — otherwise users see the consent dialog on first sign-in.</li>
          </ol>

          <h3>Scope-vs-permission terminology</h3>
          <p>The portal and the JWTs use "permission" and "scope" interchangeably. They're the same thing — a permission you've configured in the app reg becomes a scope string MSAL requests at token-acquisition time.</p>
        </section>

        <hr />

        {/* SECTION 8 — EXPOSE AN API */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Expose an API</h2>
          <p>
            If your app's API will be called by OTHER apps (cross-app integration), you need to publish a scope in the
            app reg. Tabloom does this so Workshop can call it. Without this step, Workshop has no way to request a
            valid token for Tabloom's audience.
          </p>

          <h3>The portal walkthrough</h3>
          <ol>
            <li><strong>Entra → App registrations → MyApp → Expose an API</strong>.</li>
            <li>Click <strong>Add a scope</strong>. On first add, the portal asks for an Application ID URI — accept the default <code>api://&lt;your-client-id&gt;</code> (you can change it to a custom domain like <code>api://tabloom.enzolopez.net</code> if you own that domain, but most apps don't).</li>
            <li>Define the scope:
              <ul>
                <li><strong>Scope name:</strong> <code>access_as_user</code> (convention) or <code>read</code>/<code>write</code></li>
                <li><strong>Who can consent?</strong> Admins and users (for personal app), Admins only (for sensitive scopes)</li>
                <li><strong>Admin consent display name:</strong> "Access MyApp's API"</li>
                <li><strong>State:</strong> Enabled</li>
              </ul>
            </li>
            <li>Save.</li>
          </ol>

          <h3>The result</h3>
          <p>You can now request the scope from a sibling app's MSAL config:</p>
          <CodePre>{`// In Workshop's app reg → API permissions → Add a permission
// → My APIs tab → Tabloom → Delegated permissions → access_as_user → Add`}</CodePre>

          <p>Workshop's MSAL can now do <code>acquireTokenSilent({`{ scopes: [tabloomApiScope] }`})</code> and Entra issues an access token with <code>aud: api://&lt;tabloom-client-id&gt;</code>.</p>

          <h3>How Tabloom's server validates</h3>
          <CodePre>{`// tabloom/server.js — verbatim, lines 988-1015
const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${AAD_TENANT_ID}/discovery/v2.0/keys\`)
)
const ISSUER = \`https://login.microsoftonline.com/\${AAD_TENANT_ID}/v2.0\`

async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ""
  const m = /^Bearer (.+)$/i.exec(header)
  if (!m) return res.status(401).json({ error: "unauthorized" })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer:   ISSUER,
      audience: AAD_CLIENT_ID,   // ← Tabloom's own client ID
      clockTolerance: "60s",
    })
    if (payload.tid !== AAD_TENANT_ID) return res.status(401).json({ error: "unauthorized" })
    if (!payload.oid)                  return res.status(401).json({ error: "unauthorized" })
    req.user = {
      oid:     payload.oid,
      name:    payload.name ?? null,
      email:   payload.preferred_username ?? payload.email ?? null,
      isOwner: payload.oid === PRIMARY_USER_OID,
    }
    next()
  } catch {
    res.status(401).json({ error: "unauthorized" })
  }
}`}</CodePre>

          <p>The crucial part: Tabloom validates with its OWN client ID as the audience. Workshop sent a token whose <code>aud</code> is <code>api://&lt;tabloom-client-id&gt;</code> — but <code>jose</code>'s audience matcher is lenient enough that the bare GUID matches too. (For strict matching, see the JWT validation guide's "multi-audience" section.)</p>

          <h3>The same flow for direct ID tokens</h3>
          <p>For an app calling its OWN backend (no cross-app), you skip Expose-an-API entirely — the ID token already has the client ID as its audience. Most fleet apps live in this simpler world.</p>
        </section>

        <hr />

        {/* SECTION 9 — OIDC FEDERATED CREDENTIALS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>OIDC Federated Credentials — Auth Without Secrets</h2>
          <p>
            The fleet's GitHub Actions workflows authenticate to Azure with zero static secrets. Each repo has its own
            service principal whose only allowed credential is "a GitHub OIDC token from this specific repo + branch."
            That's federated identity.
          </p>

          <h3>What's federated</h3>
          <p>
            "Federated credential" in Entra is a trust relationship: "if a JWT signed by GitHub claims <code>repo:Enzo
            Lopez2023/Hearth:ref:refs/heads/main</code>, treat it as proof that this service principal should be
            issued an Entra token."
          </p>

          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant W as GitHub Workflow
  participant G as GitHub OIDC token issuer
  participant E as Entra ID
  participant A as Azure (ACR, App Service)
  W->>G: request OIDC token (sub: repo:owner/repo:ref:refs/heads/main)
  G->>W: signed JWT
  W->>E: trade GitHub JWT for Entra access token (clientCredentialFlow)
  E->>E: verify GitHub JWT signature + sub matches federated credential
  E->>W: Entra access token (Bearer)
  W->>A: az acr build / az webapp restart with Bearer token`} />

          <h3>The setup, per app reg</h3>
          <ol>
            <li>Create a service principal in the compute tenant (<code>github-myapp-ci</code>).</li>
            <li>On its app reg, go to <strong>Certificates &amp; secrets → Federated credentials → Add credential</strong>.</li>
            <li>Pick <strong>"GitHub Actions deploying Azure resources"</strong>.</li>
            <li>Fill: organization (your GitHub org), repo (the repo name), entity type (Branch), branch (<code>main</code>).</li>
            <li>Name the credential (e.g. <code>main</code>).</li>
            <li>Save.</li>
            <li>In an Azure subscription, grant the SP the <strong>Contributor</strong> role on the resource group it'll deploy to.</li>
          </ol>

          <h3>The workflow side</h3>
          <CodePre>{`# .github/workflows/deploy.yml — Hearth, verbatim relevant section
permissions:
  id-token: write     # required for actions to receive OIDC token
  contents: read

env:
  AZURE_CLIENT_ID:       e25535a2-7a83-401f-9152-0600821cce8f
  AZURE_TENANT_ID:       de625678-c55b-4494-9558-14946cbb6133
  AZURE_SUBSCRIPTION_ID: 1cf02211-8d77-4658-bb6a-0f83ec831c3b

jobs:
  deploy:
    steps:
      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id:       \${{ env.AZURE_CLIENT_ID }}
          tenant-id:       \${{ env.AZURE_TENANT_ID }}
          subscription-id: \${{ env.AZURE_SUBSCRIPTION_ID }}`}</CodePre>

          <p>Notice: no <code>secret</code>. The <code>azure/login@v2</code> action requests an OIDC token from GitHub (made possible by <code>id-token: write</code> permission) and trades it with Entra for an Azure access token. All client IDs are non-secret values.</p>

          <h3>Why this is strictly better than static secrets</h3>
          <ul>
            <li><strong>No secret to rotate.</strong> The trust is the federated credential's <code>subject</code> claim, which is the repo + branch. Both are non-secret.</li>
            <li><strong>Branch-scoped.</strong> The federated credential's <code>subject</code> is <code>repo:owner/repo:ref:refs/heads/main</code>. A workflow running on a fork OR a different branch gets a different OIDC token, which Entra refuses to trade.</li>
            <li><strong>Audit trail.</strong> Entra sign-in logs show "service principal X authenticated via federated credential Y at time Z" — you can see exactly which deploy happened when.</li>
            <li><strong>No leak surface.</strong> A repo secret can leak in build logs. A federated credential cannot — it doesn't exist as a string anywhere.</li>
          </ul>

          <h3>Scope-locked permissions</h3>
          <p>Each fleet SP has Contributor only on <code>rg-personal-apps-prod</code>. If <code>github-cairn-ci</code> is somehow compromised, it can't touch other resource groups or subscriptions.</p>

          <h3>One SP per repo, not one SP for all CI</h3>
          <p>The fleet has 8 service principals (one per repo) instead of one shared CI SP. Why: scope-locking. If <code>github-shopkeep-ci</code> is compromised, only ShopKeep's image can be poisoned — not the whole fleet. The blast radius is one app.</p>
        </section>

        <hr />

        {/* SECTION 10 — FLEET INVENTORY */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Fleet Inventory — Who Uses What</h2>

          <h3>App registrations (in the user tenant <code>52188f12-…</code>)</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Client ID</th><th>Auth shape</th></tr>
              <tr><td>Cairn</td><td><code>142376b1-6cf0-4377-9c99-e47bb4a3be9a</code></td><td>SPA, ID-token-as-access</td></tr>
              <tr><td>GLP1 (Tare)</td><td><code>a38cd69e-8260-4b35-88f8-b93d2722cb41</code></td><td>SPA, ID-token-as-access</td></tr>
              <tr><td>PulseWire</td><td>Confidential client</td><td>Server-side OIDC, session cookies</td></tr>
              <tr><td>SecretApp (Hearth)</td><td><code>55bf92db-2cec-4e65-ab0d-71bee90d7494</code></td><td>SPA, hardcoded in source</td></tr>
              <tr><td>ShopKeep</td><td><code>8c9567bd-e5ef-470a-b8c8-b911bff7752a</code></td><td>SPA, OID via header</td></tr>
              <tr><td>Puzzlebox</td><td>Hardcoded; personal accounts</td><td>SPA, personal MSAs</td></tr>
              <tr><td>Tabloom</td><td><code>b30f09b9-e100-4aa5-af22-ce359ff13fba</code></td><td>SPA + exposes API for Workshop</td></tr>
              <tr><td>Workshop</td><td><code>0f303f8f-207f-4b7f-84a5-b5d0abcf49d1</code></td><td>SPA, requests Tabloom scope too</td></tr>
            </tbody>
          </table>

          <h3>Hardcoded vs env-baked client IDs</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>Apps</th></tr>
              <tr><td>Hardcoded in <code>msalConfig.ts</code></td><td>SecretApp, Cairn, Puzzlebox</td></tr>
              <tr><td>Baked from <code>VITE_*</code> env vars</td><td>GLP1, ShopKeep, Tabloom, Workshop</td></tr>
            </tbody>
          </table>

          <p>Client IDs are non-secret — they're public in every JWT issued. The hardcoded variant is fine if you accept that "rotating to a new app reg" requires a code change. The env-baked variant is more flexible but adds the Docker build-arg propagation work (covered in the Vite Build System guide).</p>

          <h3>Two distinct patterns the fleet uses</h3>

          <p><strong>Hearth's variant — hardcoded:</strong></p>
          <CodePre>{`// SecretApp/src/auth/msalConfig.ts — verbatim
const clientId = '55bf92db-2cec-4e65-ab0d-71bee90d7494';
const tenantId = '52188f12-db6b-46c6-88ff-08c802f0ed3b';`}</CodePre>

          <p><strong>ShopKeep's variant — env-baked with validation:</strong></p>
          <CodePre>{`// ShopKeep/src/auth/msalConfig.ts — verbatim
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID as string;

if (!clientId || !tenantId) {
  throw new Error('VITE_AZURE_CLIENT_ID and VITE_AZURE_TENANT_ID must be set in .env');
}`}</CodePre>

          <p>The env-baked variant fails LOUDLY at app boot if the values weren't baked at Docker build time. Without that check, you'd silently authenticate against an undefined client ID and get cryptic AADSTS errors.</p>

          <h3>OIDC service principals (in the compute tenant <code>de625678-…</code>)</h3>
          <p>Eight SPs, one per repo, named <code>github-&lt;repo&gt;-ci</code>. Each has a federated credential scoped to its repo + main/master branch. None has a client secret.</p>

          <h3>Resource group scope</h3>
          <p>All eight CI SPs have <strong>Contributor</strong> on <code>rg-personal-apps-prod</code> only. None has subscription-level access.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Create a Fresh App Registration</h2>
          <p>Stand up a brand-new app reg in your tenant, wire it to a fresh React app, sign in, see the ID token. ~15 minutes start to finish.</p>

          <h3>Step 1 — Create the app reg</h3>
          <ol>
            <li>Open <a href="https://entra.microsoft.com" target="_blank" rel="noopener noreferrer">entra.microsoft.com</a>.</li>
            <li><strong>Identity → Applications → App registrations → New registration</strong>.</li>
            <li>Name: <code>LabApp</code>.</li>
            <li>Supported account types: <strong>"Single tenant"</strong> (or "Personal Microsoft accounts only" if you're using a personal MSA tenant).</li>
            <li>Redirect URI: pick <strong>Single-page application (SPA)</strong> and enter <code>http://localhost:5173</code>.</li>
            <li>Click <strong>Register</strong>.</li>
            <li>On the Overview page, copy the <strong>Application (client) ID</strong> and the <strong>Directory (tenant) ID</strong>.</li>
          </ol>

          <h3>Step 2 — Scaffold a Vite + React + TS app</h3>
          <CodePre>{`npm create vite@latest entra-lab -- --template react-ts
cd entra-lab
npm i
npm i @azure/msal-browser @azure/msal-react`}</CodePre>

          <h3>Step 3 — Configure MSAL</h3>
          <CodePre>{`// src/auth/msalConfig.ts
import { LogLevel, type Configuration } from '@azure/msal-browser'

const clientId = 'PASTE_YOUR_CLIENT_ID_HERE'
const tenantId = 'PASTE_YOUR_TENANT_ID_HERE'

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: \`https://login.microsoftonline.com/\${tenantId}\`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
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

          <h3>Step 4 — Bootstrap MSAL before React</h3>
          <CodePre>{`// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './auth/msalConfig'
import App from './App'
import './index.css'

const pca = new PublicClientApplication(msalConfig)

// MSAL needs an explicit initialize() before any other call.
pca.initialize().then(() => {
  // Handle the redirect response from sign-in (if any)
  return pca.handleRedirectPromise()
}).then(() => {
  // Set the first signed-in account as the active one
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

          <h3>Step 5 — Build a sign-in / sign-out App</h3>
          <CodePre>{`// src/App.tsx
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from './auth/msalConfig'

export default function App() {
  const isAuthenticated = useIsAuthenticated()
  const { instance, accounts } = useMsal()

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Lab App</h1>
        <button onClick={() => instance.loginRedirect(loginRequest)}>
          Sign in
        </button>
      </div>
    )
  }

  const account = accounts[0]
  return (
    <div style={{ padding: 24 }}>
      <h1>Signed in as {account.name}</h1>
      <p>OID: <code>{account.localAccountId}</code></p>
      <p>Tenant: <code>{account.tenantId}</code></p>
      <p>Username: <code>{account.username}</code></p>
      <button onClick={() => instance.logoutRedirect()}>Sign out</button>
      <hr />
      <button onClick={async () => {
        const result = await instance.acquireTokenSilent(loginRequest)
        // Decode the ID token's payload (DO NOT do this for production verification — server-side only)
        const payload = JSON.parse(atob(result.idToken.split('.')[1]))
        console.log('ID token payload:', payload)
        alert('Token claims logged to console')
      }}>
        Get token + log claims
      </button>
    </div>
  )
}`}</CodePre>

          <h3>Step 6 — Run it</h3>
          <CodePre>{`npm run dev`}</CodePre>

          <ol>
            <li>Open <code>http://localhost:5173</code>.</li>
            <li>Click "Sign in." Entra's sign-in page loads. Sign in with a tenant user.</li>
            <li>You're redirected back to <code>localhost:5173</code> with tokens.</li>
            <li>The app shows your name, OID, tenant ID, and username.</li>
            <li>Click "Get token + log claims." Open DevTools console — you'll see the decoded payload.</li>
          </ol>

          <h3>Step 7 — Inspect the JWT</h3>
          <p>Copy the ID token from the MSAL storage (DevTools → Application → Local Storage → look for keys starting with the client ID). Paste into <a href="https://jwt.ms" target="_blank" rel="noopener noreferrer">jwt.ms</a>. You'll see:</p>
          <ul>
            <li><code>aud</code>: your client ID</li>
            <li><code>iss</code>: <code>https://login.microsoftonline.com/&lt;tenantId&gt;/v2.0</code></li>
            <li><code>oid</code>: your user's OID — the same GUID you saw in the app</li>
            <li><code>tid</code>: your tenant ID</li>
            <li><code>exp</code>: Unix timestamp ~1 hour ahead</li>
          </ul>

          <h3>Step 8 — Try it from a different origin</h3>
          <p>Edit Vite config to run on a different port (<code>server: {`{ port: 5174 }`}</code>). Restart. Try to sign in. You'll see <strong>AADSTS50011</strong> — the reply URL doesn't match. This is the redirect-URI allow-list working as designed.</p>

          <p>Fix: add <code>http://localhost:5174</code> to the app reg's redirect URIs and try again.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've created an app reg, wired MSAL, signed in, inspected the token, and seen the redirect-URI guard
              fire. Every fleet app uses this exact shape — just with different client IDs and route handlers around it.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>AADSTS50011 — Reply URL doesn't match</h3>
          <p>The exact URL the browser landed on isn't in the redirect URIs list. Match case, scheme (http vs https), port, path, trailing slash. <code>window.location.origin</code> produces <code>https://example.com</code> with no trailing slash.</p>

          <h3>AADSTS65001 — User or admin has not consented</h3>
          <p>You're requesting a scope the user hasn't granted. Either (a) call <code>loginRedirect</code> with the scope so consent is requested, (b) have an admin click "Grant admin consent" in the app reg's API permissions tab.</p>

          <h3>AADSTS700016 — Application not found in tenant</h3>
          <p>The client ID is wrong, OR the app reg lives in a different tenant than the authority you're targeting. Double-check tenant ID. For multi-tenant apps, use the <code>/common</code> or <code>/organizations</code> authority.</p>

          <h3>AADSTS700024 — Client assertion is not within its valid time range</h3>
          <p>(Federated identity only.) Clock skew between your system and Entra. Add <code>clockTolerance: '60s'</code> to <code>jwtVerify</code>.</p>

          <h3>AADSTS9002326 — Cross-origin token redemption is permitted only for SPA</h3>
          <p>You registered the redirect URI under the wrong platform. SPAs need <strong>SPA</strong> platform (PKCE flow, no client secret). Servers need <strong>Web</strong>. Recreate the redirect URI under the right platform.</p>

          <h3>Token's <code>aud</code> claim doesn't match what my server expects</h3>
          <p>Three causes: (a) client requested a different scope than the server validates, (b) v1 vs v2 audience format mismatch — accept both, (c) you're sending the ID token to one app's server expecting an access token to another's. Use jwt.ms to inspect.</p>

          <h3>"User has no OID" — auth succeeds but <code>oid</code> claim is missing</h3>
          <p>Rare. Usually means you're using <code>/common</code> authority and receiving tokens from personal Microsoft accounts that don't have an OID. Switch to single-tenant or extract <code>sub</code> as a fallback identifier.</p>

          <h3>"Could not validate token"</h3>
          <p>(Server-side.) Either: (a) signing key cache is stale — JWKS endpoints rotate keys; cache for at most 24 hours, (b) <code>jose</code>/<code>jsonwebtoken</code> rejecting the audience or issuer — see §4. The JWT Validation guide covers this in depth.</p>

          <h3>"AADSTS50058 — Silent sign-in failed" on first load</h3>
          <p>This is normal — MSAL tries silent sign-in first, fails because there's no session, then renders your sign-in UI. It's only a problem if it happens AFTER a successful interactive sign-in (cookie / 3rd-party-cookie blocking).</p>

          <h3>Sign-in works, but the API rejects the token</h3>
          <p>You're sending the ID token but the API validates against the access token's audience format (or vice versa). Look at the audience in jwt.ms: ID tokens have the bare client ID; access tokens for custom APIs have <code>api://&lt;client-id&gt;</code>. Configure your server validator to accept the one your client sends.</p>

          <h3>Sign-out doesn't clear the session</h3>
          <p><code>logoutRedirect</code> clears local storage AND sends a front-channel logout to Entra. <code>logoutPopup</code> does the same in a popup. If you're calling <code>setActiveAccount(null)</code> alone, you've cleared the local state but not the Entra session — the next sign-in will be silent.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The four GUIDs you'll need</h3>
          <table>
            <tbody>
              <tr><th>GUID</th><th>Where it lives</th></tr>
              <tr><td>Tenant ID</td><td>Entra → Overview</td></tr>
              <tr><td>Subscription ID</td><td>Azure → Subscriptions</td></tr>
              <tr><td>App registration client ID</td><td>App reg → Overview</td></tr>
              <tr><td>User OID</td><td>In any issued token's <code>oid</code> claim</td></tr>
            </tbody>
          </table>

          <h3>Authority URL formats</h3>
          <CodePre>{`https://login.microsoftonline.com/{tenantId}/v2.0    # v2 (modern)
https://sts.windows.net/{tenantId}/                   # v1 (still issued)
https://login.microsoftonline.com/common              # multi-tenant + personal
https://login.microsoftonline.com/organizations       # multi-tenant work/school only
https://login.microsoftonline.com/consumers           # personal accounts only`}</CodePre>

          <h3>Audience formats</h3>
          <CodePre>{`# ID token aud
<client-id>                            # bare GUID

# Access token aud (custom API)
api://<client-id>                      # default Application ID URI
api://my-app.example.com               # custom URI (rare)`}</CodePre>

          <h3>Token claims you'll touch</h3>
          <table>
            <tbody>
              <tr><th>Claim</th><th>Meaning</th></tr>
              <tr><td><code>aud</code></td><td>Who this token is FOR</td></tr>
              <tr><td><code>iss</code></td><td>Who SIGNED this token</td></tr>
              <tr><td><code>oid</code></td><td>User's tenant-specific ID</td></tr>
              <tr><td><code>tid</code></td><td>Tenant ID</td></tr>
              <tr><td><code>name</code></td><td>Display name</td></tr>
              <tr><td><code>preferred_username</code></td><td>Email / UPN</td></tr>
              <tr><td><code>iat</code></td><td>Issued-at (Unix timestamp)</td></tr>
              <tr><td><code>nbf</code></td><td>Not-before</td></tr>
              <tr><td><code>exp</code></td><td>Expiry (Unix timestamp, ~1 hr after iat)</td></tr>
              <tr><td><code>scp</code></td><td>Scopes granted (access tokens only)</td></tr>
              <tr><td><code>ver</code></td><td>Token version (<code>1.0</code> or <code>2.0</code>)</td></tr>
            </tbody>
          </table>

          <h3>The 7-step new-app-reg checklist</h3>
          <ol>
            <li>Create app reg (Entra → App registrations → New)</li>
            <li>Add redirect URI as SPA platform</li>
            <li>(If serving an API) Expose an API + add a scope</li>
            <li>(If calling other APIs) API permissions → Add → Microsoft Graph + custom APIs</li>
            <li>(If admin-consent required) "Grant admin consent for tenant"</li>
            <li>(For CI) Federated credentials → Add GitHub Actions credential</li>
            <li>(For CI) Grant the SP RBAC role on target resource group</li>
          </ol>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>Hardcoded client + tenant</td><td>SecretApp · <code>src/auth/msalConfig.ts:3-4</code></td></tr>
              <tr><td>Env-baked client + tenant + validation</td><td>ShopKeep · <code>src/auth/msalConfig.ts:3-8</code></td></tr>
              <tr><td>v1+v2 issuer acceptance</td><td>Cairn · <code>middleware/auth.js:23-26</code></td></tr>
              <tr><td>API URI + bare GUID audience acceptance</td><td>Cairn · <code>middleware/auth.js:31</code></td></tr>
              <tr><td>Custom scope definition + use</td><td>workshop · <code>src/auth/getTabloomToken.ts:12</code></td></tr>
              <tr><td>OIDC federated CI auth</td><td>Every fleet <code>.github/workflows/deploy.yml</code></td></tr>
              <tr><td>Tenant-claim verification</td><td>tabloom · <code>server.js:998</code></td></tr>
              <tr><td>OID extraction → req.user</td><td>tabloom · <code>server.js:999-1006</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: MSAL React (Client-Side Auth).</p>
        </section>
      </main>
    </div>
  );
}
