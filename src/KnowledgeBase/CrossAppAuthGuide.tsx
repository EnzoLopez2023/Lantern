import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Two App Regs, One User',           icon: '🆔' },
  { id: 's3',  num: '3',  title: 'Expose an API on Tabloom',         icon: '🚪' },
  { id: 's4',  num: '4',  title: 'Grant Workshop the Scope',         icon: '🔓' },
  { id: 's5',  num: '5',  title: 'Acquiring the Sibling Token',      icon: '🎫' },
  { id: 's6',  num: '6',  title: 'The Direct-Call API Client',       icon: '📡' },
  { id: 's7',  num: '7',  title: 'Server-Side: Validate the Audience', icon: '🛡️' },
  { id: 's8',  num: '8',  title: 'CORS for Sibling Origins',         icon: '🌐' },
  { id: 's9',  num: '9',  title: 'Read-Only Integration Routes',     icon: '📖' },
  { id: 's10', num: '10', title: 'Build-Arg Propagation',            icon: '🐳' },
  { id: 's11', num: '★',  title: 'Lab: Wire Cross-App End-to-End',   icon: '🛠️' },
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

export default function CrossAppAuthGuide() {
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
            <span className="sidebar-title">Cross-App Authentication</span>
          </div>
          <div className="sidebar-sub">Workshop ↔ Tabloom</div>
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
          <div className="hero-tag">🔗 Sibling-app integration · 2026</div>
          <h1>Cross-App Authentication<br />(Workshop ↔ Tabloom)</h1>
          <p>
            Workshop's notebook view is a read-only window into <strong style={{ color: '#C77AA0' }}>Tabloom's API</strong>
            — same user, two different app registrations, direct browser-to-API call. This guide walks the entire pattern:
            Expose an API on the producer side, request the custom scope on the consumer, acquire an access token (NOT
            an ID token) via MSAL, validate the audience server-side, configure CORS, and propagate the Tabloom client
            ID + base URL through Docker build args + GitHub Actions.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">App Regs</span></div>
            <div className="hero-stat"><span className="hero-stat-val">1</span><span className="hero-stat-label">User Identity</span></div>
            <div className="hero-stat"><span className="hero-stat-val">api://</span><span className="hero-stat-label">Scope URI</span></div>
            <div className="hero-stat"><span className="hero-stat-val">Read-Only</span><span className="hero-stat-label">Integration</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Cross-app authentication is "two apps, same user." The user signs in once to each app (via Entra). When
            Workshop wants to call Tabloom on the user's behalf, Workshop asks Entra for a token specifically scoped to
            Tabloom — and Entra issues one, signed for Tabloom's audience. Tabloom validates the token (signature +
            audience), recognizes the user, and serves data.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The keycard with two endorsements.</strong> Your hotel keycard normally opens just your room. With
            two endorsements (your hotel + the spa next door), it opens the spa's door too — but only because the spa
            agreed in advance to accept your hotel's keycards under certain conditions. Cross-app auth is the same:
            Workshop's user has a token Tabloom will accept, because Tabloom said it would.
          </p>
          <p>
            <strong>The driver's license.</strong> Your home state issues your license; other states accept it through
            reciprocity agreements. Workshop's user gets an Entra token; Tabloom accepts it through its "Expose an API"
            declaration.
          </p>
          <p>
            <strong>The visa, not the passport.</strong> An ID token is a passport — "this is who you are." An access
            token is a visa — "this is what you're allowed to do at this border." Cross-app needs the visa.
          </p>

          <h3>The shape</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant W as Workshop browser
  participant E as Entra ID
  participant T as Tabloom API
  W->>E: acquireTokenSilent({ scopes: ['api://<tabloom-id>/access_as_user'] })
  E->>W: access token (aud = api://<tabloom-id>)
  W->>T: GET /api/integrations/workshop/pages<br/>Authorization: Bearer <token>
  T->>T: jwtVerify(token, JWKS, { audience: TABLOOM_CLIENT_ID })
  T->>T: payload.oid → req.user.oid
  T->>W: 200 [pages]`} />

          <h3>The four prerequisites</h3>
          <ol>
            <li><strong>Both apps in the same Entra tenant.</strong> Cross-tenant works but is way more complex; the fleet stays single-tenant.</li>
            <li><strong>Tabloom (the producer) exposes a custom scope.</strong> Under "Expose an API" — see §3.</li>
            <li><strong>Workshop (the consumer) is granted that scope as an API permission.</strong> The user (or admin) consents — see §4.</li>
            <li><strong>The user has an active session on both apps.</strong> They've signed in to each at least once.</li>
          </ol>

          <h3>What's NOT going on</h3>
          <ul>
            <li><strong>No shared database.</strong> Each app has its own backend.</li>
            <li><strong>No iframe / postMessage.</strong> Workshop's frontend directly calls Tabloom's API origin.</li>
            <li><strong>No service principal / on-behalf-of flow.</strong> Workshop's user IS the user; we just ask Entra for a different-audience token. No token-exchange.</li>
            <li><strong>No reverse-proxy.</strong> Workshop's API doesn't proxy Tabloom — the browser hits Tabloom directly.</li>
          </ul>

          <h3>Two flavors of cross-app (and why we pick the simpler one)</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>What it is</th><th>Complexity</th></tr>
              <tr><td><strong>Direct API call (fleet's pick)</strong></td><td>Workshop's frontend acquires a Tabloom-audienced token, calls Tabloom's API directly</td><td>Low — one MSAL scope, one CORS config</td></tr>
              <tr><td>On-Behalf-Of (OBO)</td><td>Workshop's backend takes the user's Workshop token, swaps it server-to-server with Entra for a Tabloom-audienced token</td><td>High — confidential client + OBO grant + token caching</td></tr>
            </tbody>
          </table>

          <p>Direct API call wins for fleet's scale. OBO matters when Workshop's BACKEND (not browser) calls Tabloom on the user's behalf — common in microservice chains. PulseWire's standalone-process model would have used OBO if it called sibling APIs; it doesn't.</p>

          <h3>Why direct API call is OK</h3>
          <p>The browser has the user's session. Asking Entra for a different-audience token doesn't expose anything: each token Entra issues is still tied to the user's identity. The cookie-or-token security of Workshop's app reg isn't compromised.</p>
        </section>

        <hr />

        {/* SECTION 2 — TWO APP REGS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Two App Registrations, One User</h2>
          <p>Workshop and Tabloom are separate apps in Entra. Each has its own client ID, redirect URIs, and consenting users. The cross-app dance is "Workshop's app reg requests a scope defined on Tabloom's app reg, then Tabloom's user identity is established by the token Entra issues."</p>

          <h3>The two apps' configs</h3>
          <table>
            <tbody>
              <tr><th>Property</th><th>Workshop</th><th>Tabloom</th></tr>
              <tr><td>Client ID</td><td><code>0f303f8f-207f-4b7f-84a5-b5d0abcf49d1</code></td><td><code>b30f09b9-e100-4aa5-af22-ce359ff13fba</code></td></tr>
              <tr><td>Tenant</td><td><code>52188f12-…</code></td><td><code>52188f12-…</code> (same)</td></tr>
              <tr><td>Platform</td><td>SPA (PKCE)</td><td>SPA (PKCE)</td></tr>
              <tr><td>Exposes API?</td><td>No</td><td>Yes — <code>access_as_user</code> scope</td></tr>
              <tr><td>Requests scopes from</td><td>Microsoft Graph + Tabloom</td><td>Microsoft Graph only</td></tr>
            </tbody>
          </table>

          <h3>The flow when a user uses both</h3>
          <ol>
            <li>User opens Workshop → signs in to Workshop's app reg → gets a Workshop-audienced token in localStorage.</li>
            <li>User opens Tabloom → signs in to Tabloom's app reg → gets a Tabloom-audienced token in localStorage.</li>
            <li>User opens Workshop's "Notebook" page → Workshop's frontend silently calls Entra: "give me a Tabloom-audienced token."</li>
            <li>Entra checks: is this user signed in? (yes — they have a Workshop session). Does Workshop have permission for Tabloom's scope? (yes — granted at app-reg level + user consented). Issues a Tabloom-audienced access token.</li>
            <li>Workshop's frontend calls Tabloom's API with that token. Tabloom validates, sees the user's <code>oid</code>, serves their data.</li>
          </ol>

          <h3>What about the user identity</h3>
          <p>
            The user's <code>oid</code> is THE SAME across all tokens Entra issues for them in this tenant. It's the
            tenant-scoped user identifier. So when Tabloom looks up "data for oid X" using the token Workshop sent,
            and Tabloom's own user table also has "oid X," they line up — same user.
          </p>
          <p>That's the whole trick. Two app regs, two scopes, two token audiences — but one user identity flowing through both.</p>

          <h3>Could Workshop use the SAME app reg as Tabloom?</h3>
          <p>Technically yes — Tabloom's app reg could host Workshop's redirect URIs too. Then no cross-app dance is needed. But:</p>
          <ul>
            <li>You lose blast-radius separation. A compromised Workshop = compromised access to Tabloom's API.</li>
            <li>You can't independently rotate, audit, or scope-limit each app.</li>
            <li>You can't have different sign-in flows or consent prompts per app.</li>
          </ul>
          <p>Fleet-level discipline: one app reg per app, integrate via Expose-an-API scopes.</p>

          <h3>Tenant boundary</h3>
          <p>Both apps live in the user-facing tenant (<code>52188f12-…</code>). If they lived in different tenants, you'd need multi-tenant app registrations + cross-tenant trust — the spec is OIDC's "Application is multi-tenant" + the consenting tenant grants admin consent for the foreign app. Fleet sidesteps this complexity entirely.</p>
        </section>

        <hr />

        {/* SECTION 3 — EXPOSE AN API */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Expose an API on Tabloom (the producer)</h2>
          <p>Tabloom is the producer in this relationship — it has data Workshop wants. The producer declares a custom scope so consumers can request it.</p>

          <h3>The portal walkthrough</h3>
          <ol>
            <li>Open Entra → App registrations → <strong>Tabloom</strong> → <strong>Expose an API</strong>.</li>
            <li>If prompted for an Application ID URI, accept the default: <code>api://{`<tabloom-client-id>`}</code>.</li>
            <li>Click <strong>Add a scope</strong>.</li>
            <li>Fill in:
              <ul>
                <li><strong>Scope name</strong>: <code>access_as_user</code> (convention; could be <code>read</code>, <code>write</code>, <code>admin</code>, etc.)</li>
                <li><strong>Who can consent?</strong>: <strong>Admins and users</strong> (admin-only would require an admin to grant on behalf of each new user; the household app pattern is users)</li>
                <li><strong>Admin consent display name</strong>: "Access Tabloom on behalf of the user"</li>
                <li><strong>Admin consent description</strong>: "Allow this app to read and modify Tabloom data as the signed-in user"</li>
                <li><strong>State</strong>: Enabled</li>
              </ul>
            </li>
            <li>Save.</li>
          </ol>

          <p>The result: a scope identified by the URI <code>api://&lt;tabloom-client-id&gt;/access_as_user</code>. Other apps in the tenant can request this scope; their users will see the consent prompt the first time.</p>

          <h3>Scope naming conventions</h3>
          <p>Common patterns:</p>
          <table>
            <tbody>
              <tr><th>Scope name</th><th>Use for</th></tr>
              <tr><td><code>access_as_user</code></td><td>Broad "act on the user's behalf"</td></tr>
              <tr><td><code>read</code></td><td>Read-only access</td></tr>
              <tr><td><code>write</code></td><td>Modify user data</td></tr>
              <tr><td><code>admin</code></td><td>Admin-only operations (and require admin consent)</td></tr>
              <tr><td><code>{`<entity>.read`}</code> / <code>{`<entity>.write`}</code></td><td>Per-entity scopes (Graph-style)</td></tr>
            </tbody>
          </table>

          <p>Tabloom uses just <code>access_as_user</code> — a single broad scope. Per-route enforcement happens via Tabloom's own permission middleware (owner/editor/viewer), not via scope granularity.</p>

          <h3>The Application ID URI</h3>
          <p>The <code>api://&lt;guid&gt;</code> URI is the prefix for all scopes on this app. By default it's <code>api://</code> + client ID. You can change it to a custom URI like <code>api://tabloom.example.com</code> if you own that domain. Most apps stick with the default.</p>

          <h3>Verifying it worked</h3>
          <p>After saving, on the same Expose an API page, you should see your scope listed with its full URI: <code>api://b30f09b9-e100-4aa5-af22-ce359ff13fba/access_as_user</code>.</p>

          <p>You'd then test by attempting to request the scope from any other app reg in the tenant — Entra would issue a token, or report a clear consent-required error if the consumer hasn't been granted the permission yet.</p>

          <h3>Optional: "authorized client applications"</h3>
          <p>The "Expose an API" page also has an "Authorized client applications" section. Adding a client app's ID here pre-authorizes it — users of that app never see a consent prompt for this scope. Useful when both apps are owned by you. Not strictly required.</p>
        </section>

        <hr />

        {/* SECTION 4 — GRANT THE SCOPE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Grant Workshop the Scope (the consumer side)</h2>
          <p>Now Workshop's app reg needs to be granted permission to request that scope. This is a one-time setup on Workshop's app reg.</p>

          <h3>The portal walkthrough</h3>
          <ol>
            <li>Open Entra → App registrations → <strong>Workshop</strong> → <strong>API permissions</strong>.</li>
            <li>Click <strong>Add a permission</strong>.</li>
            <li>In the picker, click the <strong>My APIs</strong> tab.</li>
            <li>Find <strong>Tabloom</strong> in the list and click it.</li>
            <li>Click <strong>Delegated permissions</strong>.</li>
            <li>Check the box next to <code>access_as_user</code>.</li>
            <li>Click <strong>Add permissions</strong>.</li>
            <li>(Optional but recommended) Click <strong>Grant admin consent for &lt;tenant&gt;</strong> — this skips the per-user consent prompt.</li>
          </ol>

          <p>The result: Workshop's app reg now lists Tabloom's <code>access_as_user</code> under API permissions, with a green "Granted for &lt;tenant&gt;" if admin consent was granted.</p>

          <h3>Delegated vs Application permissions</h3>
          <table>
            <tbody>
              <tr><th>Kind</th><th>Means</th></tr>
              <tr><td>Delegated</td><td>"Act on behalf of the signed-in user." Most cross-app integrations use this.</td></tr>
              <tr><td>Application</td><td>"Act as the app itself, no user." Used by daemon/service patterns. Requires a confidential client.</td></tr>
            </tbody>
          </table>

          <p>Workshop's cross-app call is "the user wants to see THEIR Tabloom data." That's delegated. Application permissions are for things like "a nightly job that scans all users' Tabloom data" (PulseWire's worker would use this, if it called sibling APIs).</p>

          <h3>The user consent flow</h3>
          <p>Without admin consent, the FIRST time a Workshop user calls Tabloom, they'll see an Entra consent dialog:</p>
          <CodePre>{`Workshop is requesting permissions to:
  ✓ Access Tabloom on behalf of the user

[Cancel]  [Accept]`}</CodePre>

          <p>After acceptance, Entra records the consent on the user's account. Future requests are silent.</p>

          <p>With admin consent (tenant admin clicked the button), the dialog is skipped entirely — the permission is pre-approved for everyone in the tenant.</p>

          <h3>When you don't need admin consent</h3>
          <ul>
            <li>Personal app, single household, you're the user — sure, click through the consent dialog once. Admin consent is just a convenience.</li>
            <li>Some scopes (like <code>User.Read</code>) consent users without dialog because they're low-impact.</li>
          </ul>

          <h3>When you DO need admin consent</h3>
          <ul>
            <li>Enterprise app, where users shouldn't be deciding what apps can access organization data.</li>
            <li>Scopes that touch other users' data (e.g. <code>Directory.Read.All</code>).</li>
            <li>Anything tagged "Admin consent required: Yes" in the portal.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 5 — ACQUIRE TOKEN */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Acquiring the Sibling Token</h2>
          <p>Workshop's frontend code uses MSAL's <code>acquireTokenSilent</code> with the Tabloom scope. Same pattern as for any token, just a different scope string.</p>

          <h3>Workshop's full getTabloomToken</h3>
          <CodePre>{`// workshop/src/auth/getTabloomToken.ts — verbatim
import { InteractionRequiredAuthError, type IPublicClientApplication } from '@azure/msal-browser'

const TABLOOM_CLIENT_ID = import.meta.env.VITE_TABLOOM_CLIENT_ID

if (!TABLOOM_CLIENT_ID) {
  throw new Error(
    'VITE_TABLOOM_CLIENT_ID must be set in your .env file. ' +
    'See .env.example for reference.'
  )
}

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
      // acquireTokenRedirect navigates away; this throw is unreachable in practice
      throw err
    }
    throw err
  }
}`}</CodePre>

          <h3>The scope string</h3>
          <CodePre>{`export const tabloomApiScope = \`api://\${TABLOOM_CLIENT_ID}/access_as_user\``}</CodePre>

          <p>The string is built at runtime from the build-time env var. Notice it's the Tabloom client ID, NOT Workshop's. This is the difference between asking Entra for "a token for my own app" (Workshop's client ID) and "a token for Tabloom" (Tabloom's client ID).</p>

          <h3>Why this is different from <code>getApiToken</code></h3>
          <p>Workshop has two token helpers:</p>
          <CodePre>{`// getToken.ts — for Workshop's own backend
export const apiScope = \`api://\${WORKSHOP_CLIENT_ID}/access_as_user\`
export async function getApiToken(...) { /* scopes: [apiScope] */ }

// getTabloomToken.ts — for Tabloom's backend
export const tabloomApiScope = \`api://\${TABLOOM_CLIENT_ID}/access_as_user\`
export async function getTabloomToken(...) { /* scopes: [tabloomApiScope] */ }`}</CodePre>

          <p>Same MSAL machinery, different scope string. MSAL caches tokens per-scope-set, so requesting Tabloom's scope doesn't disrupt Workshop's own token.</p>

          <h3>The accessToken vs idToken choice</h3>
          <p>Notice <code>result.accessToken</code> — NOT <code>result.idToken</code>. Why:</p>
          <ul>
            <li>The ID token's <code>aud</code> is always the requesting app's client ID. Sending it to Tabloom would fail audience validation.</li>
            <li>The access token's <code>aud</code> is determined by the requested scope's API URI: <code>api://&lt;tabloom-id&gt;</code>. Sending it to Tabloom matches.</li>
          </ul>

          <p>This is the single biggest cross-app pitfall: people use <code>idToken</code> habitually (it works for same-app calls) and get audience errors when calling sibling apps. <strong>Always</strong> <code>accessToken</code> for cross-app.</p>

          <h3>The InteractionRequiredAuthError fallback</h3>
          <CodePre>{`if (err instanceof InteractionRequiredAuthError) {
  await instance.acquireTokenRedirect({ scopes: [tabloomApiScope], account })
  throw err  // unreachable — acquireTokenRedirect navigated away
}`}</CodePre>

          <p>This handles the first-call consent prompt. If the user hasn't consented to Tabloom's scope yet, the silent flow fails with <code>InteractionRequiredAuthError</code>. The fallback triggers a redirect to Entra where the user sees the consent dialog. After accepting, they're redirected back; the call retries silently.</p>

          <p>With admin consent granted (§4), this code path almost never runs — silent succeeds first try. But the safety net is essential for cases where admin consent wasn't granted.</p>
        </section>

        <hr />

        {/* SECTION 6 — API CLIENT */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The Direct-Call API Client</h2>
          <p>Workshop's <code>tabloomApi.ts</code> is a thin fetch wrapper that injects the Tabloom token. Critically: the request goes <strong>directly from the browser to Tabloom's origin</strong>, not through Workshop's backend.</p>

          <h3>The full client</h3>
          <CodePre>{`// workshop/src/services/tabloomApi.ts — verbatim
import type { IPublicClientApplication } from '@azure/msal-browser'
import { getTabloomToken } from '../auth/getTabloomToken'

const BASE = import.meta.env.VITE_TABLOOM_API_BASE_URL as string | undefined

if (!BASE) {
  throw new Error(
    'VITE_TABLOOM_API_BASE_URL must be set in your .env file. ' +
    'See .env.example for reference.'
  )
}

export interface TabloomPageSummary {
  id: string
  title: string
  snippet: string | null
  edited_at: string
}

export interface TabloomPageDetail extends TabloomPageSummary {
  html: string
}

let msal: IPublicClientApplication | null = null
export function setMsalInstance(instance: IPublicClientApplication) { msal = instance }

async function get<T>(path: string): Promise<T> {
  if (!msal) throw new Error('Tabloom client: MSAL not initialized')
  const token = await getTabloomToken(msal)
  const res = await fetch(\`\${BASE}\${path}\`, {
    headers: { Authorization: \`Bearer \${token}\` },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(body.error ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export const listTabloomWorkshopPages = () =>
  get<TabloomPageSummary[]>('/api/integrations/workshop/pages')

export const getTabloomWorkshopPage = (id: string) =>
  get<TabloomPageDetail>(\`/api/integrations/workshop/pages/\${encodeURIComponent(id)}\`)`}</CodePre>

          <h3>The BASE URL</h3>
          <p><code>VITE_TABLOOM_API_BASE_URL</code> baked at build time. In production:</p>
          <CodePre>{`VITE_TABLOOM_API_BASE_URL=https://app-tabloom-prod-lwxhu7jxlrbtu.azurewebsites.net`}</CodePre>

          <p>The browser literally hits Tabloom's hostname. Workshop's backend is bypassed entirely for these calls.</p>

          <h3>Why browser-to-Tabloom (not Workshop-proxy-to-Tabloom)</h3>
          <table>
            <tbody>
              <tr><th></th><th>Direct call</th><th>Workshop proxies</th></tr>
              <tr><td>Network hops</td><td>1 (browser → Tabloom)</td><td>2 (browser → Workshop → Tabloom)</td></tr>
              <tr><td>Latency</td><td>~50ms</td><td>~100-150ms</td></tr>
              <tr><td>Workshop backend code</td><td>None</td><td>Yes — proxy route + auth re-validation</td></tr>
              <tr><td>CORS required</td><td>Yes (browser cross-origin)</td><td>No (Workshop is same-origin)</td></tr>
              <tr><td>Caching</td><td>Browser-managed</td><td>Workshop must implement</td></tr>
              <tr><td>Failure isolation</td><td>Tabloom down = feature unavailable</td><td>Tabloom down = feature unavailable, but Workshop logs it</td></tr>
            </tbody>
          </table>

          <p>Direct call is simpler. The trade-off (CORS configuration) is small. PulseWire's pattern is "browser is just another API consumer" — and at small scale, that's fine.</p>

          <h3>Usage in a component</h3>
          <CodePre>{`// workshop/src/pages/NotebookList.tsx — verbatim (top portion)
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { listTabloomWorkshopPages, type TabloomPageSummary } from '../services/tabloomApi'

// ... relativeTime helper ...

export default function NotebookList() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<TabloomPageSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    listTabloomWorkshopPages()
      .then(setPages)
      .catch(err => {
        console.error(err)
        setLoadError(err instanceof Error ? err.message : 'Failed to load')
      })
      .finally(() => setLoading(false))
  }, [])

  // ... render the page list ...
}`}</CodePre>

          <p>The component looks identical to any other API-consuming component. The Tabloom-ness is hidden behind <code>tabloomApi.ts</code>.</p>

          <h3>The MSAL instance plumbing</h3>
          <CodePre>{`// workshop/src/main.tsx (boot pattern)
import { setMsalInstance as setApiMsal } from './services/api'
import { setMsalInstance as setTabloomMsal } from './services/tabloomApi'

pca.initialize().then(async () => {
  await pca.handleRedirectPromise()
  // Plumb MSAL into BOTH API clients
  setApiMsal(pca)
  setTabloomMsal(pca)
  // ... render React ...
})`}</CodePre>

          <p>Two API client modules, each needs the MSAL instance. Both are set during boot — a "one MSAL, many API clients" pattern.</p>
        </section>

        <hr />

        {/* SECTION 7 — VALIDATE AUDIENCE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Server-Side: Validate the Audience</h2>
          <p>Tabloom's server receives a Bearer token from Workshop. It must verify the token's signature AND that the audience matches Tabloom's own client ID. Otherwise, an attacker could send a token issued for ANY other app reg in the tenant.</p>

          <h3>Tabloom's full requireAuth</h3>
          <CodePre>{`// tabloom/server.js — verbatim, lines 983-1022
// ── Auth ──────────────────────────────────────────────────────────────────────
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
      audience: AAD_CLIENT_ID,   // ← Tabloom's OWN client ID
      clockTolerance: "60s",
    })
    if (payload.tid !== AAD_TENANT_ID) return res.status(401).json({ error: "unauthorized" })
    if (!payload.oid)                  return res.status(401).json({ error: "unauthorized" })
    const email = (payload.preferred_username ?? payload.email ?? "").toLowerCase() || null
    req.user = {
      oid:     payload.oid,
      name:    payload.name ?? null,
      email,
      isOwner: payload.oid === PRIMARY_USER_OID,
    }
    // Track every caller — first sign-in writes the row, subsequent calls
    // bump last_seen. Cheap (single upsert) and gives us a real "guests"
    // list for the share UI.
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

          <h3>What "audience: AAD_CLIENT_ID" actually means</h3>
          <p>Tabloom's own client ID, e.g. <code>b30f09b9-…</code>. The token Workshop sends has <code>aud: api://b30f09b9-…</code> (or the bare <code>b30f09b9-…</code> depending on Entra's manifest setting).</p>
          <p>jose's audience matcher is permissive enough that:</p>
          <ul>
            <li>Token <code>aud: b30f09b9-…</code> matches expected <code>audience: b30f09b9-…</code></li>
            <li>Token <code>aud: api://b30f09b9-…</code> ALSO matches (jose strips the <code>api://</code> prefix during comparison)</li>
          </ul>

          <p>For strict matching with both formats explicit, pass an array:</p>
          <CodePre>{`audience: [\`api://\${AAD_CLIENT_ID}\`, AAD_CLIENT_ID]`}</CodePre>

          <h3>The token Tabloom sees</h3>
          <p>When Workshop's user calls Tabloom, the token looks like (decoded):</p>
          <CodePre>{`{
  "aud": "api://b30f09b9-e100-4aa5-af22-ce359ff13fba",
  "iss": "https://login.microsoftonline.com/52188f12-.../v2.0",
  "tid": "52188f12-...",
  "oid": "abc12345-...",
  "name": "Alex Wilber",
  "preferred_username": "alex.wilber@contoso.com",
  "scp": "access_as_user",
  "azp": "0f303f8f-207f-4b7f-84a5-b5d0abcf49d1",   // ← Workshop's client ID (the consuming app)
  "ver": "2.0",
  "exp": 1716662800
}`}</CodePre>

          <p>Notice <code>azp</code> ("authorized party") is Workshop's client ID — it tells Tabloom WHICH app obtained this token. Tabloom doesn't check <code>azp</code> in its middleware, but it could ("only accept tokens from Workshop's client ID") for tighter security.</p>

          <h3>What the validation catches</h3>
          <ul>
            <li><strong>Tokens from other Entra tenants</strong>: <code>iss</code> mismatch rejects.</li>
            <li><strong>Tokens for other apps in the same tenant</strong>: <code>aud</code> mismatch rejects — even if signed by Entra, even if valid for that other app.</li>
            <li><strong>Tampered tokens</strong>: signature mismatch rejects.</li>
            <li><strong>Expired tokens</strong>: <code>exp</code> mismatch rejects.</li>
            <li><strong>Different tenant via multi-tenant</strong>: <code>tid</code> mismatch rejects (belt-and-braces).</li>
          </ul>

          <h3>The user-tracking sidecar</h3>
          <p>Tabloom upserts the user into its <code>users</code> table on every successful auth. This gives Tabloom a real "list of guests" for the share UI without polling Entra Graph. Best-effort — the upsert is in try/catch, so a DB hiccup doesn't fail the request.</p>

          <p>The upsert is unique to Tabloom's sharing model. Most other fleet apps don't need it.</p>
        </section>

        <hr />

        {/* SECTION 8 — CORS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>CORS for Sibling Origins</h2>
          <p>The browser's same-origin policy blocks the cross-origin request by default. Tabloom must opt-in via CORS headers.</p>

          <h3>The threat model</h3>
          <p>Without CORS, your browser refuses to let JavaScript on <code>https://workshop.example.com</code> read responses from <code>https://tabloom.example.com</code>. CORS is the way for the server to say "yes, this origin is allowed."</p>

          <h3>Tabloom's pattern (simplified)</h3>
          <CodePre>{`// tabloom/server.js — pattern
import cors from 'cors'

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)  // same-origin / curl / Postman
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
    return callback(new Error(\`CORS: origin \${origin} not allowed\`))
  },
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}))`}</CodePre>

          <p>In production:</p>
          <CodePre>{`ALLOWED_ORIGINS=https://app-workshop-prod-lwxhu7jxlrbtu.azurewebsites.net,https://app-tabloom-prod-lwxhu7jxlrbtu.azurewebsites.net`}</CodePre>

          <h3>The preflight</h3>
          <p>For a non-trivial request (with custom headers like Authorization), the browser sends an <strong>OPTIONS preflight</strong> before the actual request:</p>
          <CodePre>{`# Browser → Tabloom (preflight)
OPTIONS /api/integrations/workshop/pages HTTP/1.1
Host: tabloom.example.com
Origin: https://workshop.example.com
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization

# Tabloom → Browser (200 with CORS headers)
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://workshop.example.com
Access-Control-Allow-Methods: GET
Access-Control-Allow-Headers: authorization

# Browser → Tabloom (actual request)
GET /api/integrations/workshop/pages HTTP/1.1
Host: tabloom.example.com
Origin: https://workshop.example.com
Authorization: Bearer eyJ...`}</CodePre>

          <p>The <code>cors</code> npm package handles preflight automatically — you only configure once.</p>

          <h3>credentials: false vs true</h3>
          <ul>
            <li><strong>credentials: false</strong> (Tabloom's choice) — Bearer-token auth, no cookies cross-origin. The simpler config.</li>
            <li><strong>credentials: true</strong> — Cookies sent on cross-origin requests. Requires more strict CORS (no wildcard origin) and the client must explicitly opt-in (<code>fetch(url, &#123; credentials: 'include' &#125;)</code>).</li>
          </ul>

          <p>Bearer-token cross-app integration doesn't need <code>credentials: true</code>. Cookies would only matter if you wanted cookie-based session auth across origins (rare; usually use cookies same-origin and Bearer cross-origin).</p>

          <h3>Wildcard origin warning</h3>
          <p><code>Access-Control-Allow-Origin: *</code> would allow ANY website to call Tabloom's API. That's a bad idea for an authenticated API — even with token validation, you'd be inviting attackers to try various tokens against your endpoints. Use an explicit allow-list.</p>

          <h3>Local dev wrinkle</h3>
          <p>In dev, Workshop runs on <code>localhost:5180</code> and Tabloom on <code>localhost:5173</code>. Add both to the dev <code>ALLOWED_ORIGINS</code>:</p>
          <CodePre>{`# .env.local
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5180`}</CodePre>

          <h3>Why CORS only matters for direct browser-to-Tabloom</h3>
          <p>If Workshop's backend proxied the request (browser → Workshop → Tabloom), no CORS would be needed — the cross-origin call is server-to-server, where same-origin policy doesn't apply. The direct-call pattern (§6) is why CORS becomes a thing.</p>
        </section>

        <hr />

        {/* SECTION 9 — READ-ONLY ROUTES */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Read-Only Integration Routes</h2>
          <p>The cross-app routes are intentionally a separate prefix on Tabloom's API. They're read-only — Workshop can list pages and fetch one, but can't write or delete. This is principle-of-least-privilege applied to inter-app integration.</p>

          <h3>The route structure</h3>
          <CodePre>{`# Tabloom's regular routes (Tabloom's own UI uses these)
GET    /api/notebooks
POST   /api/notebooks
GET    /api/pages
PUT    /api/pages/:id
DELETE /api/pages/:id

# Tabloom's integration routes (cross-app)
GET    /api/integrations/workshop/pages          # list
GET    /api/integrations/workshop/pages/:id       # fetch one`}</CodePre>

          <h3>Why a separate prefix</h3>
          <ul>
            <li><strong>Easier to audit.</strong> "What does Workshop have access to?" → look at <code>/api/integrations/workshop/*</code>.</li>
            <li><strong>Easier to deprecate.</strong> "Workshop's integration is sunsetting" → remove the <code>/api/integrations/workshop/</code> mount.</li>
            <li><strong>Shape can differ.</strong> The integration routes can return a reduced/filtered version of the data (e.g. omit shares, omit owner-only fields).</li>
            <li><strong>Versioning is local.</strong> Move to <code>/api/integrations/workshop/v2/*</code> without disturbing Tabloom's own routes.</li>
          </ul>

          <h3>The reduced payload</h3>
          <CodePre>{`// tabloom/server.js — pattern
app.get('/api/integrations/workshop/pages', requireAuth, (req, res) => {
  // Find the user's "Workshop" notebook (a specific notebook name they've chosen)
  const notebook = stmts.findNotebookByName.get({ oid: req.user.oid, name: 'Workshop' })
  if (!notebook) return res.json([])

  // Return only the fields Workshop needs — NOT full HTML, NOT shares list
  const pages = stmts.listPagesByNotebook.all(notebook.id)
  res.json(pages.map(p => ({
    id:        p.id,
    title:     p.title,
    snippet:   p.snippet,        // ← short preview, NOT full content
    edited_at: p.edited_at,
  })))
})

app.get('/api/integrations/workshop/pages/:id', requireAuth, (req, res) => {
  const page = stmts.getPage.get(Number(req.params.id))
  if (!page) return res.status(404).json({ error: 'not found' })

  // Verify it's IN the Workshop notebook (not some other notebook)
  const notebook = stmts.getNotebook.get(page.notebook_id)
  if (notebook.name !== 'Workshop' || notebook.user_oid !== req.user.oid) {
    return res.status(403).json({ error: 'forbidden' })
  }

  // Full content — but no shares, no version history
  res.json({
    id:        page.id,
    title:     page.title,
    snippet:   page.snippet,
    edited_at: page.edited_at,
    html:      page.html,
  })
})`}</CodePre>

          <h3>The naming convention</h3>
          <p>The pattern: each consuming app gets its own folder under <code>/api/integrations/&lt;app-name&gt;/</code>. If a future sibling app needs different access, you add <code>/api/integrations/&lt;new-app&gt;/</code> without disturbing Workshop's routes.</p>

          <h3>The notebook-name convention</h3>
          <p>Tabloom's pattern: Workshop's "notebook view" pulls pages from a notebook the user explicitly named <code>Workshop</code>. The user creates this notebook in Tabloom; Tabloom's integration routes scope to it.</p>
          <p>Alternative: a tag, a category, a "shared with Workshop" flag per page. The notebook-name convention is simplest — discoverable in Tabloom's regular UI, no special UI needed.</p>

          <h3>What read-only means here</h3>
          <p>Workshop can't:</p>
          <ul>
            <li>POST a new page to Tabloom.</li>
            <li>PUT an update.</li>
            <li>DELETE.</li>
            <li>List ALL the user's notebooks (only the "Workshop" one's pages).</li>
            <li>Access shares.</li>
          </ul>

          <p>If Workshop wanted write access, you'd add <code>POST /api/integrations/workshop/pages</code> with whatever validation Tabloom wants. The token + audience model doesn't change; it's purely a question of what routes you expose.</p>
        </section>

        <hr />

        {/* SECTION 10 — BUILD-ARG PROPAGATION */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Build-Arg Propagation</h2>
          <p>The Tabloom client ID + base URL are baked into Workshop's frontend bundle at Docker build time. The full chain: GitHub env → workflow env → <code>az acr build --build-arg</code> → Dockerfile ARG/ENV → <code>npm run build</code> → Vite's <code>import.meta.env</code>.</p>

          <h3>The end-state values</h3>
          <CodePre>{`# workshop/.env.example — verbatim
# Tabloom integration (read-only). The Workshop notebook UI pulls its pages
# from a notebook named "Workshop" in the sibling Tabloom app.
#   - VITE_TABLOOM_API_BASE_URL: origin of the Tabloom server
#   - VITE_TABLOOM_CLIENT_ID:    Tabloom's AAD app client ID (used to mint a
#                                token with audience \`api://<id>/access_as_user\`)
# Workshop's AAD app must be granted delegated \`access_as_user\` on Tabloom's
# API for this to work — see Tabloom's CLAUDE.md.
VITE_TABLOOM_API_BASE_URL=https://app-tabloom-prod-lwxhu7jxlrbtu.azurewebsites.net
VITE_TABLOOM_CLIENT_ID=b30f09b9-e100-4aa5-af22-ce359ff13fba`}</CodePre>

          <h3>The Dockerfile chunk</h3>
          <CodePre>{`# workshop/Dockerfile — verbatim, lines 14-29
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

          <h3>The deploy.yml chunk</h3>
          <CodePre>{`# workshop/.github/workflows/deploy.yml — verbatim, lines 40-72
  # Tabloom integration (read-only notebook). Workshop's frontend acquires
  # a token for Tabloom's API scope and calls Tabloom directly.
  VITE_TABLOOM_API_BASE_URL: https://app-tabloom-prod-lwxhu7jxlrbtu.azurewebsites.net
  VITE_TABLOOM_CLIENT_ID:    b30f09b9-e100-4aa5-af22-ce359ff13fba

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id:       \${{ env.AZURE_CLIENT_ID }}
          tenant-id:       \${{ env.AZURE_TENANT_ID }}
          subscription-id: \${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: Build image in ACR
        # ACR builds server-side — no Docker daemon needed on the runner.
        # VITE_* vars must be baked in at build time (MIGRATION_RCA.md #3).
        run: |
          az acr build \\
            --registry "$ACR" \\
            --image "$IMAGE" \\
            --build-arg "VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID" \\
            --build-arg "VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID" \\
            --build-arg "VITE_TABLOOM_API_BASE_URL=$VITE_TABLOOM_API_BASE_URL" \\
            --build-arg "VITE_TABLOOM_CLIENT_ID=$VITE_TABLOOM_CLIENT_ID" \\
            .`}</CodePre>

          <h3>The chain, visualized</h3>
          <MermaidDiagram theme="default" chart={`graph TB
  GH[deploy.yml env block]
  GH -->|env: VITE_TABLOOM_CLIENT_ID=b30f09b9-...| R[GitHub Actions runner]
  R -->|--build-arg VITE_TABLOOM_CLIENT_ID=$VITE_TABLOOM_CLIENT_ID| AZ[az acr build]
  AZ -->|forwards as Docker --build-arg| BS[Builder stage]
  BS -->|ARG + ENV| NP[npm run build → Node]
  NP -->|process.env.VITE_TABLOOM_CLIENT_ID| V[Vite]
  V -->|literal substitution| BUNDLE[dist/assets/index-HASH.js]
  BUNDLE -->|served from| APP[Workshop App Service]`} />

          <h3>The "what could go wrong" list</h3>
          <ol>
            <li><strong>Missed in deploy.yml env block</strong> → workflow has no value → empty string passed to ACR → empty string in bundle → "VITE_TABLOOM_CLIENT_ID must be set" thrown at runtime.</li>
            <li><strong>Missed <code>--build-arg</code></strong> in <code>az acr build</code> → docker arg present but unset → ENV empty → same outcome as above.</li>
            <li><strong>Missed <code>ENV</code> after <code>ARG</code></strong> in Dockerfile → ARG exists but doesn't propagate to npm-run-build → process.env.VITE_TABLOOM_CLIENT_ID undefined → same outcome.</li>
            <li><strong>Used in code as <code>process.env.VITE_TABLOOM_CLIENT_ID</code></strong> instead of <code>import.meta.env.VITE_TABLOOM_CLIENT_ID</code> → won't work in browser at all.</li>
          </ol>

          <p>The validation throw in <code>getTabloomToken.ts</code> + <code>tabloomApi.ts</code> catches each of these at app boot:</p>
          <CodePre>{`if (!TABLOOM_CLIENT_ID) {
  throw new Error('VITE_TABLOOM_CLIENT_ID must be set in your .env file. See .env.example for reference.')
}`}</CodePre>

          <p>Fail loud, fail at boot, fail with a message that says exactly what to do.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Wire Cross-App End-to-End</h2>
          <p>Stand up two minimal apps — a "Producer" that exposes data + a "Consumer" that reads it. Wire MSAL on the consumer side, validate audience on the producer side, configure CORS. ~60 minutes.</p>

          <h3>Step 1 — Create two app registrations</h3>
          <p>In your Entra tenant, create two app regs:</p>
          <ol>
            <li><strong>"Lab-Producer"</strong> — Web platform, redirect URI <code>http://localhost:5174</code></li>
            <li><strong>"Lab-Consumer"</strong> — SPA platform, redirect URI <code>http://localhost:5175</code></li>
          </ol>

          <p>On the Producer's app reg:</p>
          <ol>
            <li>Go to Expose an API.</li>
            <li>Add scope <code>access_as_user</code>. Users + admins can consent.</li>
            <li>Note the full URI: <code>api://&lt;producer-client-id&gt;/access_as_user</code>.</li>
          </ol>

          <p>On the Consumer's app reg:</p>
          <ol>
            <li>Go to API permissions → Add a permission → My APIs → Lab-Producer.</li>
            <li>Pick Delegated permissions → <code>access_as_user</code>.</li>
            <li>Add. Click Grant admin consent for tenant.</li>
          </ol>

          <h3>Step 2 — Scaffold both apps</h3>
          <CodePre>{`mkdir lab-cross-app && cd lab-cross-app
mkdir producer consumer

# Producer — Express + jose
cd producer
npm init -y
npm pkg set type=module
npm i express cors jose dotenv

# Consumer — Vite + React + MSAL
cd ../consumer
npm create vite@latest . -- --template react-ts
npm i
npm i @azure/msal-browser @azure/msal-react`}</CodePre>

          <h3>Step 3 — Producer: server.js</h3>
          <CodePre>{`// producer/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { jwtVerify, createRemoteJWKSet } from 'jose'

const TENANT_ID = process.env.AAD_TENANT_ID
const CLIENT_ID = process.env.AAD_CLIENT_ID  // ← PRODUCER's client ID
if (!TENANT_ID || !CLIENT_ID) {
  console.error('AAD_TENANT_ID and AAD_CLIENT_ID required')
  process.exit(1)
}

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5175').split(',').map(s => s.trim())

const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${TENANT_ID}/discovery/v2.0/keys\`)
)
const ISSUER = \`https://login.microsoftonline.com/\${TENANT_ID}/v2.0\`

const app = express()

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(\`CORS: origin \${origin} not allowed\`))
  },
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))

async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'unauthorized', detail: 'missing bearer' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer:   ISSUER,
      audience: [CLIENT_ID, \`api://\${CLIENT_ID}\`],   // ← accept both formats
      clockTolerance: '60s',
    })
    if (payload.tid !== TENANT_ID) return res.status(401).json({ error: 'unauthorized' })
    if (!payload.oid) return res.status(401).json({ error: 'unauthorized' })
    req.user = { oid: payload.oid, name: payload.name, email: payload.preferred_username }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized', detail: err.code ?? err.message })
  }
}

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  return requireAuth(req, res, next)
})

app.get('/api/integrations/consumer/items', (req, res) => {
  res.json([
    { id: 1, title: 'Item One',   note: \`Hello, \${req.user.name}\` },
    { id: 2, title: 'Item Two',   note: 'From the producer' },
    { id: 3, title: 'Item Three', note: \`Your OID: \${req.user.oid}\` },
  ])
})

app.listen(5174, () => console.log('Producer on :5174'))`}</CodePre>

          <CodePre>{`# producer/.env
AAD_TENANT_ID=YOUR_TENANT_ID
AAD_CLIENT_ID=PRODUCER_CLIENT_ID
ALLOWED_ORIGINS=http://localhost:5175`}</CodePre>

          <h3>Step 4 — Consumer: MSAL config</h3>
          <CodePre>{`# consumer/.env.local
VITE_AAD_TENANT_ID=YOUR_TENANT_ID
VITE_AAD_CLIENT_ID=CONSUMER_CLIENT_ID
VITE_PRODUCER_CLIENT_ID=PRODUCER_CLIENT_ID
VITE_PRODUCER_BASE_URL=http://localhost:5174`}</CodePre>

          <CodePre>{`// consumer/src/auth/msalConfig.ts
import { LogLevel, type Configuration } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_AAD_CLIENT_ID as string
const tenantId = import.meta.env.VITE_AAD_TENANT_ID as string

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: \`https://login.microsoftonline.com/\${tenantId}\`,
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'localStorage' },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, pii) => {
        if (pii) return
        console.debug(\`[MSAL:\${LogLevel[level]}] \${message}\`)
      },
      logLevel: LogLevel.Warning,
    },
  },
}

export const loginRequest = { scopes: ['User.Read'] }`}</CodePre>

          <h3>Step 5 — Consumer: sibling-app token helper</h3>
          <CodePre>{`// consumer/src/auth/getProducerToken.ts
import { InteractionRequiredAuthError, type IPublicClientApplication } from '@azure/msal-browser'

const PRODUCER_CLIENT_ID = import.meta.env.VITE_PRODUCER_CLIENT_ID as string
if (!PRODUCER_CLIENT_ID) throw new Error('VITE_PRODUCER_CLIENT_ID must be set')

export const producerScope = \`api://\${PRODUCER_CLIENT_ID}/access_as_user\`

export async function getProducerToken(instance: IPublicClientApplication): Promise<string> {
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) throw new Error('Not signed in')
  try {
    const result = await instance.acquireTokenSilent({ scopes: [producerScope], account })
    return result.accessToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect({ scopes: [producerScope], account })
      throw err
    }
    throw err
  }
}`}</CodePre>

          <h3>Step 6 — Consumer: producer API client</h3>
          <CodePre>{`// consumer/src/services/producerApi.ts
import type { IPublicClientApplication } from '@azure/msal-browser'
import { getProducerToken } from '../auth/getProducerToken'

const BASE = import.meta.env.VITE_PRODUCER_BASE_URL as string
if (!BASE) throw new Error('VITE_PRODUCER_BASE_URL must be set')

let msal: IPublicClientApplication | null = null
export function setMsalInstance(instance: IPublicClientApplication) { msal = instance }

export interface ProducerItem {
  id: number
  title: string
  note: string
}

export async function listItems(): Promise<ProducerItem[]> {
  if (!msal) throw new Error('MSAL not initialized')
  const token = await getProducerToken(msal)
  const res = await fetch(\`\${BASE}/api/integrations/consumer/items\`, {
    headers: { Authorization: \`Bearer \${token}\` },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}`}</CodePre>

          <h3>Step 7 — Consumer: App.tsx + main.tsx</h3>
          <CodePre>{`// consumer/src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './auth/msalConfig'
import { setMsalInstance } from './services/producerApi'
import App from './App'

const pca = new PublicClientApplication(msalConfig)

pca.initialize().then(async () => {
  await pca.handleRedirectPromise()
  const accounts = pca.getAllAccounts()
  if (!pca.getActiveAccount() && accounts[0]) pca.setActiveAccount(accounts[0])
  setMsalInstance(pca)

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MsalProvider instance={pca}>
        <App />
      </MsalProvider>
    </StrictMode>
  )
})`}</CodePre>

          <CodePre>{`// consumer/src/App.tsx
import { useEffect, useState } from 'react'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from './auth/msalConfig'
import { listItems, type ProducerItem } from './services/producerApi'

export default function App() {
  const isAuth = useIsAuthenticated()
  const { instance } = useMsal()
  const [items, setItems] = useState<ProducerItem[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuth) return
    listItems().then(setItems).catch(e => setErr(e.message))
  }, [isAuth])

  if (!isAuth) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Cross-App Lab — Consumer</h1>
        <button onClick={() => instance.loginRedirect(loginRequest)}>Sign in</button>
      </main>
    )
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Items from the Producer</h1>
      {err && <p style={{ color: 'red' }}>Error: {err}</p>}
      <ul>
        {items.map(i => (
          <li key={i.id}>
            <strong>{i.title}</strong> — {i.note}
          </li>
        ))}
      </ul>
      <button onClick={() => instance.logoutRedirect()}>Sign out</button>
    </main>
  )
}`}</CodePre>

          <h3>Step 8 — Run both</h3>
          <CodePre>{`# Terminal 1
cd producer && node server.js

# Terminal 2
cd consumer && npm run dev -- --port 5175`}</CodePre>

          <ol>
            <li>Open <code>http://localhost:5175</code>.</li>
            <li>Click Sign in. Sign in with a tenant user.</li>
            <li>Redirected back. Consumer fetches <code>http://localhost:5174/api/integrations/consumer/items</code>.</li>
            <li>If first call: Entra may prompt to consent to Producer's scope (if admin consent wasn't granted).</li>
            <li>Items render. Each item's "note" includes your name + OID.</li>
            <li>Watch the Network tab — see the GET to Producer's URL with the Bearer token.</li>
            <li>Decode the token at jwt.ms. Notice <code>aud: api://&lt;producer-client-id&gt;</code> and <code>scp: access_as_user</code>.</li>
          </ol>

          <h3>Step 9 — Verify failure paths</h3>

          <p><strong>Test 1: send Consumer's ID token instead of Producer's access token.</strong> In <code>App.tsx</code>, temporarily change <code>listItems</code> to use <code>idToken</code>:</p>
          <CodePre>{`const result = await instance.acquireTokenSilent({ scopes: ['User.Read'], account })
return result.idToken  // ← consumer's ID token, not producer's access token`}</CodePre>

          <p>Producer rejects with <code>unauthorized — ERR_JWT_CLAIM_VALIDATION_FAILED</code> (audience mismatch). Restore.</p>

          <p><strong>Test 2: remove CORS from Producer.</strong> Comment out <code>app.use(cors(...))</code>. Restart Producer. The Consumer's request now fails in the browser with "Access-Control-Allow-Origin missing." Restore.</p>

          <p><strong>Test 3: revoke the Producer's app reg API permissions on Consumer.</strong> Remove the API permission entry. Sign out and sign in. The <code>acquireTokenSilent</code> now throws <code>InteractionRequiredAuthError</code> → consent prompt → user gets the dialog. Restore.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated Workshop ↔ Tabloom's cross-app pattern end-to-end: Expose an API on the producer,
              grant the scope on the consumer, acquire sibling-app token, direct-call API, validate audience server-side,
              CORS-allow the consumer's origin.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"unauthorized — ERR_JWT_CLAIM_VALIDATION_FAILED"</h3>
          <p>The Producer's audience validation failed. Three likely causes:</p>
          <ol>
            <li>Consumer is sending an ID token (its own audience) instead of an access token (Producer's audience). Use <code>result.accessToken</code>.</li>
            <li>Consumer requested the wrong scope. Verify <code>api://&lt;producer-client-id&gt;/access_as_user</code> exactly.</li>
            <li>v1 vs v2 audience format mismatch. Pass both: <code>{'audience: [CLIENT_ID, `api://${CLIENT_ID}`]'}</code>.</li>
          </ol>

          <h3>"AADSTS65001 — User or admin has not consented"</h3>
          <p>The Consumer's user hasn't granted the scope yet. Either: (a) trigger the consent flow via <code>acquireTokenRedirect</code>, (b) admin grants tenant-wide consent on the Consumer's app reg's API permissions.</p>

          <h3>"AADSTS650053 — Scope not exposed on this resource"</h3>
          <p>The Producer's app reg doesn't have the scope you're requesting. Verify Expose an API → scopes list. Common cause: scope name typo (<code>access_as_user</code> vs <code>accessAsUser</code> — they're different).</p>

          <h3>CORS error in browser console</h3>
          <p>Producer is responding without <code>Access-Control-Allow-Origin</code>. Verify: (a) <code>cors()</code> middleware is registered before the routes, (b) the Consumer's origin is in <code>ALLOWED_ORIGINS</code>, (c) preflight OPTIONS isn't being blocked by another middleware.</p>

          <h3>Works locally but not in production</h3>
          <p>Almost always: <code>ALLOWED_ORIGINS</code> only has localhost. Add the production Consumer URL to Producer's env. Or: build args missed (VITE_PRODUCER_CLIENT_ID is empty in the prod bundle).</p>

          <h3>"VITE_TABLOOM_CLIENT_ID must be set" at boot</h3>
          <p>The build arg didn't propagate. Check the chain: deploy.yml env → <code>--build-arg</code> → Dockerfile ARG + ENV → <code>npm run build</code>. The validation throw at runtime tells you the env var wasn't baked.</p>

          <h3>Consumer's Network tab shows "blocked: cors" but Producer's logs show 401</h3>
          <p>The auth middleware rejected before CORS headers could be set on the response. Most cors libraries handle this correctly, but if you wired auth first and CORS later, the 401 response lacks the Access-Control-Allow-Origin header. Always register CORS BEFORE auth.</p>

          <h3>Tokens work for an hour, then suddenly start failing</h3>
          <p>Access tokens expire after ~1 hour. MSAL silently refreshes — UNLESS the refresh token is missing/expired. Check the cache: <code>localStorage</code> should have keys for the Producer's scope. If not, refresh fell back to interactive (likely user closed the tab).</p>

          <h3>Producer accepts tokens from ANY user, not just Consumer's users</h3>
          <p>You're missing the <code>azp</code> check. Add: <code>if (payload.azp !== EXPECTED_CONSUMER_CLIENT_ID) return 403</code>. Most apps don't bother; Producer trusts any client in the tenant. For stricter security, pin the consumer.</p>

          <h3>Local dev: Consumer can't reach Producer</h3>
          <p>Producer must allow Consumer's localhost URL: <code>ALLOWED_ORIGINS=http://localhost:5175</code>. If you started Vite on a different port (e.g. <code>5173</code>), match.</p>

          <h3>App registration deletion / rotation</h3>
          <p>If you delete the Producer's app reg + create a fresh one, the Client ID changes. Every consumer must update its <code>VITE_PRODUCER_CLIENT_ID</code> + the API permission entry. Mid-flight tokens (~1 hour) will continue to validate against the OLD client ID, then start rejecting after refresh.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The 4-step setup</h3>
          <ol>
            <li><strong>Producer</strong>: Expose an API → add scope <code>access_as_user</code>.</li>
            <li><strong>Consumer</strong>: API permissions → My APIs → Producer → Delegated → <code>access_as_user</code>. Optional: grant admin consent.</li>
            <li><strong>Consumer</strong>: bake <code>VITE_PRODUCER_CLIENT_ID</code> + <code>VITE_PRODUCER_BASE_URL</code> at Docker build.</li>
            <li><strong>Producer</strong>: allow Consumer's origin in CORS.</li>
          </ol>

          <h3>Scope string</h3>
          <CodePre>{`const scope = \`api://\${PRODUCER_CLIENT_ID}/access_as_user\``}</CodePre>

          <h3>Acquire sibling-app token</h3>
          <CodePre>{`const result = await instance.acquireTokenSilent({
  scopes: [\`api://\${PRODUCER_CLIENT_ID}/access_as_user\`],
  account,
})
return result.accessToken    // ← NOT result.idToken`}</CodePre>

          <h3>API client</h3>
          <CodePre>{`const res = await fetch(\`\${BASE}/api/foo\`, {
  headers: { Authorization: \`Bearer \${token}\` },
})`}</CodePre>

          <h3>Audience validation (producer)</h3>
          <CodePre>{`const { payload } = await jwtVerify(token, JWKS, {
  issuer,
  audience: [CLIENT_ID, \`api://\${CLIENT_ID}\`],   // ← accept both formats
})`}</CodePre>

          <h3>CORS allow-list</h3>
          <CodePre>{`app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(\`CORS: \${origin} not allowed\`))
  },
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization'],
}))`}</CodePre>

          <h3>Build args chain</h3>
          <CodePre>{`deploy.yml env → az acr build --build-arg → Dockerfile ARG + ENV → npm run build → import.meta.env`}</CodePre>

          <h3>The error that means each thing</h3>
          <table>
            <tbody>
              <tr><th>Error</th><th>Likely cause</th></tr>
              <tr><td>Audience mismatch</td><td>Sent ID token instead of access token</td></tr>
              <tr><td>AADSTS65001</td><td>User hasn't consented to the scope</td></tr>
              <tr><td>AADSTS650053</td><td>Scope not exposed on producer's app reg</td></tr>
              <tr><td>AADSTS50011</td><td>Redirect URI mismatch in consumer's app reg</td></tr>
              <tr><td>CORS error</td><td>Producer doesn't allow consumer's origin</td></tr>
              <tr><td>"... must be set"</td><td>Build arg missed in the chain</td></tr>
            </tbody>
          </table>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>Sibling-app scope string</td><td>workshop · <code>src/auth/getTabloomToken.ts:12</code></td></tr>
              <tr><td>acquireTokenSilent with sibling scope</td><td>workshop · <code>src/auth/getTabloomToken.ts:14-28</code></td></tr>
              <tr><td>API client w/ Bearer</td><td>workshop · <code>src/services/tabloomApi.ts</code> (full)</td></tr>
              <tr><td>Component using the integration</td><td>workshop · <code>src/pages/NotebookList.tsx</code></td></tr>
              <tr><td>Audience validation</td><td>tabloom · <code>server.js:993-1006</code></td></tr>
              <tr><td>Build-arg propagation in Dockerfile</td><td>workshop · <code>Dockerfile:18-22</code></td></tr>
              <tr><td>Build-arg propagation in deploy.yml</td><td>workshop · <code>.github/workflows/deploy.yml:40-72</code></td></tr>
              <tr><td>.env.example for VITE_TABLOOM_*</td><td>workshop · <code>.env.example:35-43</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: Plex Media Server integration (SecretApp).</p>
        </section>
      </main>
    </div>
  );
}
