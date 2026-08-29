import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'JWT Anatomy',                      icon: '🧬' },
  { id: 's3',  num: '3',  title: 'JWKS — Public Key Fetching',       icon: '🔑' },
  { id: 's4',  num: '4',  title: 'jose vs jsonwebtoken',             icon: '⚖️' },
  { id: 's5',  num: '5',  title: 'Issuer Verification (v1 vs v2)',   icon: '🏷️' },
  { id: 's6',  num: '6',  title: 'Audience Verification',            icon: '🎯' },
  { id: 's7',  num: '7',  title: 'Multi-Audience JWT (Tabloom)',     icon: '🔀' },
  { id: 's8',  num: '8',  title: 'Claim Extraction',                 icon: '📋' },
  { id: 's9',  num: '9',  title: 'requireAuth Middleware',           icon: '🚦' },
  { id: 's10', num: '10', title: 'Public-Before-Auth Patterns',      icon: '🚪' },
  { id: 's11', num: '★',  title: 'Lab: Build a Validator',           icon: '🛠️' },
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

export default function JwtValidationGuide() {
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
            <span className="sidebar-title">JWT Validation</span>
          </div>
          <div className="sidebar-sub">server-side, with jose</div>
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
          <div className="hero-tag">🛡️ JWT validation · 2026</div>
          <h1>JWT Validation<br />Server-Side</h1>
          <p>
            The flipside of MSAL: <strong style={{ color: '#C77AA0' }}>verifying</strong> tokens the client sends. Five
            fleet backends do this — four with <code>jose</code> (GLP1, PulseWire, Tabloom, Workshop), one with
            <code>jsonwebtoken</code>+<code>jwks-rsa</code> (Cairn). This guide walks JWT anatomy, JWKS fetching, both
            library choices, v1/v2 issuer acceptance, multi-audience matching, claim extraction, and the
            <code>requireAuth</code> middleware that ties it together.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">5</span><span className="hero-stat-label">Apps Validate JWT</span></div>
            <div className="hero-stat"><span className="hero-stat-val">4/5</span><span className="hero-stat-label">Use jose</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Issuer Versions</span></div>
            <div className="hero-stat"><span className="hero-stat-val">24h</span><span className="hero-stat-label">JWKS Cache</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            A JWT is a signed claim. The signature proves the claim came from Entra. Validation = "verify the signature
            matches a known public key" + "verify the claims meet your requirements." Both steps must pass; passing
            either alone is insecure.
          </p>

          <h3>The five checks your server must do</h3>
          <ol>
            <li><strong>Signature</strong> matches a public key from Entra's JWKS endpoint.</li>
            <li><strong>Issuer (<code>iss</code>)</strong> is your trusted Entra tenant's URL.</li>
            <li><strong>Audience (<code>aud</code>)</strong> matches your app's client ID (or API URI).</li>
            <li><strong>Expiration (<code>exp</code>)</strong> is in the future.</li>
            <li><strong>Tenant (<code>tid</code>)</strong> matches your expected tenant (defense in depth).</li>
          </ol>

          <p>Bonus: extract <code>oid</code> and verify it exists. Without it you don't know who the user is.</p>

          <h3>Three analogies</h3>
          <p>
            <strong>The notary stamp.</strong> A JWT is a document with a notary stamp. The signature is the stamp. The
            claims are the document text. Your job is to verify the stamp is real (signature check) AND read what the
            document says (claim check). Forging either is the attacker's win condition.
          </p>
          <p>
            <strong>The boarding pass.</strong> Your boarding pass has your name, flight number, gate, and a barcode.
            The gate agent scans the barcode (signature check — is this from the airline?) and visually confirms the
            details (claim check — right flight, right name, time hasn't passed). One without the other gets you
            arrested.
          </p>
          <p>
            <strong>What about the signature alone?</strong> "Token is signed by Entra" tells you the token exists; it
            doesn't tell you it's for your app. Without audience checking, a token issued for a totally different app
            (whose owner is malicious) could authenticate to yours. The aud claim is the second half.
          </p>

          <h3>The two libraries — equivalent outcomes</h3>
          <table>
            <tbody>
              <tr><th>Library</th><th>Style</th><th>Used by</th></tr>
              <tr><td><code>jose</code></td><td>Modern Promise-based, ESM-native, native crypto</td><td>GLP1, PulseWire, Tabloom, Workshop (recommended)</td></tr>
              <tr><td><code>jsonwebtoken</code> + <code>jwks-rsa</code></td><td>Callback-style, older, dual-package shape</td><td>Cairn (historical)</td></tr>
            </tbody>
          </table>

          <p>Both produce the same verified result. <code>jose</code> is the default for new code; <code>jsonwebtoken</code> still works fine for existing code.</p>
        </section>

        <hr />

        {/* SECTION 2 — JWT ANATOMY */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>JWT Anatomy</h2>
          <p>A JWT is three base64url-encoded JSON objects joined by dots: <code>header.payload.signature</code>.</p>

          <h3>The wire format</h3>
          <CodePre>{`eyJhbGciOiJSUzI1NiIsImtpZCI6IjFMVE10Yk9MR3VtMDFBYjF...
.
eyJhdWQiOiI1NWJmOTJkYi0yY2VjLTRlNjUtYWIwZC03MWJlZTkw...
.
M3kvkqHaqJ4VEHfPwlV8eEBxxFwjT0p8wWvFs2WUmKE...`}</CodePre>

          <p>Three pieces, separated by dots:</p>

          <h3>Header — algorithm + key ID</h3>
          <CodePre>{`{
  "alg": "RS256",
  "kid": "1LTMtbOLGum01Ab1pAcGY-c5pCw",
  "typ": "JWT"
}`}</CodePre>
          <ul>
            <li><code>alg</code>: the signing algorithm. Entra always uses <code>RS256</code> (RSA with SHA-256).</li>
            <li><code>kid</code>: the key ID — tells you which of Entra's many signing keys was used. You look this up in JWKS.</li>
            <li><code>typ</code>: always "JWT" for our purposes.</li>
          </ul>

          <h3>Payload — the claims</h3>
          <CodePre>{`{
  "aud": "55bf92db-2cec-4e65-ab0d-71bee90d7494",
  "iss": "https://login.microsoftonline.com/52188f12-.../v2.0",
  "iat": 1716659200,
  "nbf": 1716659200,
  "exp": 1716662800,
  "name": "Alex Wilber",
  "oid": "abc12345-1111-2222-3333-444444444444",
  "preferred_username": "alex.wilber@contoso.com",
  "sub": "subject-identifier",
  "tid": "52188f12-db6b-46c6-88ff-08c802f0ed3b",
  "ver": "2.0"
}`}</CodePre>

          <table>
            <tbody>
              <tr><th>Standard claim</th><th>Meaning</th></tr>
              <tr><td><code>aud</code></td><td>Audience — who this token is FOR</td></tr>
              <tr><td><code>iss</code></td><td>Issuer — who SIGNED this token</td></tr>
              <tr><td><code>iat</code></td><td>Issued At — Unix timestamp</td></tr>
              <tr><td><code>nbf</code></td><td>Not Before — earliest valid time</td></tr>
              <tr><td><code>exp</code></td><td>Expiration — latest valid time (~1hr after iat)</td></tr>
              <tr><td><code>sub</code></td><td>Subject — typically the same as oid for Entra</td></tr>
            </tbody>
          </table>

          <table>
            <tbody>
              <tr><th>Entra-specific claim</th><th>Meaning</th></tr>
              <tr><td><code>oid</code></td><td>User's tenant-scoped Object ID (GUID)</td></tr>
              <tr><td><code>tid</code></td><td>Tenant ID</td></tr>
              <tr><td><code>name</code></td><td>Display name</td></tr>
              <tr><td><code>preferred_username</code></td><td>Email / UPN</td></tr>
              <tr><td><code>ver</code></td><td>Token version (1.0 or 2.0)</td></tr>
              <tr><td><code>scp</code></td><td>Scopes (access tokens only)</td></tr>
              <tr><td><code>roles</code></td><td>App roles (if configured)</td></tr>
            </tbody>
          </table>

          <h3>Signature — RSA over header + payload</h3>
          <p>The signature is computed as:</p>
          <CodePre>{`RSA-SHA256(
  base64url(header) + "." + base64url(payload),
  Entra's private key
)`}</CodePre>

          <p>You verify it with Entra's <em>public</em> key (fetched from JWKS, §3). If anything in the header or payload changes by one byte, the signature won't match.</p>

          <h3>Decoding vs validating</h3>
          <p>Decoding a JWT is trivial — just base64url-decode the three parts. You can do this in a one-liner:</p>
          <CodePre>{`const payload = JSON.parse(atob(jwt.split('.')[1]))
console.log(payload.oid)`}</CodePre>

          <div className="alert bad">
            <span className="alert-icon">🚫</span>
            <div>
              <strong>NEVER use that decoded payload to make authorization decisions.</strong> Decoding doesn't verify
              the signature; an attacker can modify the payload and the server would happily trust the new claims. Always
              call your validator (<code>jwtVerify</code> or <code>jwt.verify</code>) first.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 3 — JWKS */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>JWKS — Fetching Entra's Public Keys</h2>
          <p>
            JWKS = JSON Web Key Set. It's a JSON document published by Entra containing every public key it currently
            uses to sign tokens. Your server fetches it (cached), uses the <code>kid</code> in the token's header to
            pick the right key, then verifies the signature with that key.
          </p>

          <h3>The endpoint</h3>
          <CodePre>{`https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys`}</CodePre>

          <h3>What it returns</h3>
          <CodePre>{`{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "kid": "1LTMtbOLGum01Ab1pAcGY-c5pCw",
      "x5t": "1LTMtbOLGum01Ab1pAcGY-c5pCw",
      "n": "...modulus base64...",
      "e": "AQAB",
      "x5c": ["...cert chain..."]
    },
    { /* more keys ... */ }
  ]
}`}</CodePre>

          <p>Entra rotates these keys ~every 24 hours. Old keys remain in the set for a grace period so tokens issued before the rotation still verify.</p>

          <h3>What "verify with the public key" actually does</h3>
          <ol>
            <li>Pick the <code>kid</code> from the JWT's header.</li>
            <li>Look up the corresponding key in the JWKS array.</li>
            <li>Construct an RSA public key from the <code>n</code> (modulus) and <code>e</code> (exponent) fields.</li>
            <li>Decode the signature portion of the JWT.</li>
            <li>Verify that <code>RSA-SHA256-verify(header.payload, signature, publicKey)</code> succeeds.</li>
          </ol>

          <p>Both libraries (jose, jsonwebtoken) handle all of this for you. Your code doesn't see modulus or exponent.</p>

          <h3>jose's <code>createRemoteJWKSet</code></h3>
          <CodePre>{`// GLP1/server.js — verbatim
import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${AAD_TENANT_ID}/discovery/v2.0/keys\`)
)`}</CodePre>

          <p>Behind the scenes, <code>createRemoteJWKSet</code> fetches the JWKS on first use, caches it (default: 5 minutes), and gracefully refetches when an unknown kid appears (key rotation).</p>

          <h3>jwks-rsa equivalent (Cairn)</h3>
          <CodePre>{`// Cairn/middleware/auth.js — verbatim
import jwksClient from 'jwks-rsa'

const keyClient = jwksClient({
  jwksUri: \`https://login.microsoftonline.com/\${TENANT_ID}/discovery/v2.0/keys\`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 24 * 60 * 60 * 1000, // 24h
})

function getSigningKey(header, callback) {
  keyClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err)
    callback(null, key.getPublicKey())
  })
}`}</CodePre>

          <h3>Caching strategy</h3>
          <p>Both libraries cache. The trade-offs:</p>
          <table>
            <tbody>
              <tr><th>Cache lifetime</th><th>Trade-off</th></tr>
              <tr><td>Too short (&lt; 1 min)</td><td>Hammers Entra's JWKS endpoint. Wasteful + potential rate-limiting.</td></tr>
              <tr><td>Default (~5 min — jose)</td><td>Balanced. Most production apps use this.</td></tr>
              <tr><td>Long (24h — Cairn)</td><td>Best perf. Risk: if Entra emergency-rotates a key, you might reject valid tokens until the cache refreshes.</td></tr>
            </tbody>
          </table>

          <p>For a personal-scale app, 24h cache is fine — emergency key rotations are rare, and a 5-minute window of rejection is acceptable. Pick what each library defaults to unless you have a reason to deviate.</p>

          <h3>What happens on an unknown kid</h3>
          <p>If the token's <code>kid</code> isn't in the cached JWKS (because Entra rotated and the new key isn't cached yet), both libraries refetch the JWKS. This refetch is automatic; your code doesn't see it.</p>

          <h3>jose's full URL pattern</h3>
          <CodePre>{`// PulseWire / GLP1 / Tabloom / Workshop pattern
const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${TENANT_ID}/discovery/v2.0/keys\`),
  {
    cacheMaxAge: 600_000,        // 10 min (default 5 min in older versions)
    cooldownDuration: 30_000,    // wait 30s before refetching after a miss
    timeoutDuration: 5_000,      // ms to wait for the fetch
  }
)`}</CodePre>
        </section>

        <hr />

        {/* SECTION 4 — JOSE VS JSONWEBTOKEN */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span><code>jose</code> vs <code>jsonwebtoken</code> + <code>jwks-rsa</code></h2>
          <p>Both libraries do the same job. Use <code>jose</code> for new code; understand <code>jsonwebtoken</code> because some apps still use it.</p>

          <h3>jose — modern (recommended)</h3>
          <CodePre>{`import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${TENANT_ID}/discovery/v2.0/keys\`)
)

async function verifyToken(token) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer:    \`https://login.microsoftonline.com/\${TENANT_ID}/v2.0\`,
    audience:  CLIENT_ID,
    clockTolerance: '60s',
  })
  return payload
}`}</CodePre>

          <p>Why jose wins:</p>
          <ul>
            <li><strong>Promise-based</strong> — works naturally with async/await.</li>
            <li><strong>ESM-native</strong> — clean imports, tree-shakable.</li>
            <li><strong>Smaller</strong> — uses Node's built-in <code>node:crypto</code>, not a custom RSA implementation.</li>
            <li><strong>Modern API</strong> — single <code>jwtVerify</code> call vs <code>verify(token, keyResolver, options, callback)</code>.</li>
            <li><strong>Standards-current</strong> — keeps up with JOSE spec updates.</li>
          </ul>

          <h3>jsonwebtoken — legacy</h3>
          <CodePre>{`// Cairn/middleware/auth.js — verbatim (key portion)
import jwksClient from 'jwks-rsa'
import jwt from 'jsonwebtoken'

const keyClient = jwksClient({
  jwksUri: \`https://login.microsoftonline.com/\${TENANT_ID}/discovery/v2.0/keys\`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 24 * 60 * 60 * 1000,
})

function getSigningKey(header, callback) {
  keyClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err)
    callback(null, key.getPublicKey())
  })
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }
  const token = header.slice('Bearer '.length).trim()

  jwt.verify(
    token,
    getSigningKey,
    {
      algorithms: ['RS256'],
      audience: ACCEPTED_AUDIENCES,
      issuer: ACCEPTED_ISSUERS,
    },
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' })
      }
      req.user = {
        oid: decoded.oid,
        name: decoded.name ?? null,
        tid: decoded.tid ?? null,
      }
      next()
    }
  )
}`}</CodePre>

          <h3>Side-by-side comparison</h3>
          <table>
            <tbody>
              <tr><th></th><th>jose</th><th>jsonwebtoken</th></tr>
              <tr><td>Style</td><td>async/await</td><td>callback</td></tr>
              <tr><td>Module system</td><td>ESM-native</td><td>CJS + ESM bridge</td></tr>
              <tr><td>JWKS</td><td>Built-in via <code>createRemoteJWKSet</code></td><td>Separate <code>jwks-rsa</code> package</td></tr>
              <tr><td>Algorithm allowlist</td><td>Auto-inferred from key</td><td>Must pass <code>algorithms: ['RS256']</code> manually</td></tr>
              <tr><td>Clock skew</td><td><code>clockTolerance: '60s'</code></td><td><code>clockTolerance: 60</code> (seconds)</td></tr>
              <tr><td>Multiple audiences</td><td>Pass array directly</td><td>Pass array via <code>audience: [...]</code></td></tr>
              <tr><td>Multiple issuers</td><td>Pass array directly</td><td>Pass array via <code>issuer: [...]</code></td></tr>
              <tr><td>npm install size</td><td>~250kb</td><td>~150kb + ~250kb (two packages)</td></tr>
            </tbody>
          </table>

          <h3>Migration path</h3>
          <p>From <code>jsonwebtoken</code> to <code>jose</code>:</p>
          <CodePre>{`// Old (jsonwebtoken + jwks-rsa)
jwt.verify(token, getSigningKey, options, (err, decoded) => {
  if (err) return res.status(401).end()
  req.user = { oid: decoded.oid }
  next()
})

// New (jose)
try {
  const { payload } = await jwtVerify(token, JWKS, options)
  req.user = { oid: payload.oid }
  next()
} catch {
  return res.status(401).end()
}`}</CodePre>

          <p>Drop two packages, install one. Convert callback to async. The validation outcome is identical.</p>

          <div className="alert bad">
            <span className="alert-icon">🚫</span>
            <div>
              <strong>Always pin algorithm.</strong> With <code>jsonwebtoken</code>, you MUST pass
              <code>algorithms: ['RS256']</code>. Without it, an attacker could send a JWT with <code>alg: none</code>
              (no signature) or <code>alg: HS256</code> (symmetric key using your JWKS modulus as the secret) and bypass
              verification. <code>jose</code> infers algorithm from the key, immune to this attack.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 5 — ISSUER VERIFICATION */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Issuer Verification (v1 vs v2)</h2>
          <p>
            Entra issues tokens whose <code>iss</code> claim differs depending on the app reg's
            <code>accessTokenAcceptedVersion</code> manifest setting. The fleet handles both.
          </p>

          <h3>The two formats</h3>
          <CodePre>{`# v2 (modern — default for new app regs once you set accessTokenAcceptedVersion: 2)
https://login.microsoftonline.com/<tenantId>/v2.0

# v1 (legacy — default if manifest doesn't override)
https://sts.windows.net/<tenantId>/`}</CodePre>

          <h3>jose — single issuer</h3>
          <p>Most fleet apps that use jose target only v2 (because they've set <code>accessTokenAcceptedVersion: 2</code> in their manifest):</p>
          <CodePre>{`// GLP1/server.js — verbatim
const ISSUER = \`https://login.microsoftonline.com/\${AAD_TENANT_ID}/v2.0\`

const { payload } = await jwtVerify(token, JWKS, {
  issuer: ISSUER,          // single string — exact match
  audience: AAD_CLIENT_ID,
  clockTolerance: '60s',
})`}</CodePre>

          <h3>jsonwebtoken — multi-issuer (Cairn)</h3>
          <p>Cairn defensively accepts both v1 and v2 — handles the case where the app reg manifest setting was changed but tokens of the old shape still exist:</p>
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

          <h3>How to know which version your app reg emits</h3>
          <ol>
            <li>Sign in to the app.</li>
            <li>Grab a fresh token from MSAL's localStorage cache.</li>
            <li>Paste it into <a href="https://jwt.ms" target="_blank" rel="noopener noreferrer">jwt.ms</a>.</li>
            <li>Look at the <code>iss</code> claim. <code>v2.0</code> in the URL → v2 token. <code>sts.windows.net</code> → v1 token.</li>
          </ol>

          <h3>Setting it explicitly</h3>
          <p>To force v2 tokens:</p>
          <ol>
            <li>Entra → App registrations → MyApp → Manifest.</li>
            <li>Find <code>accessTokenAcceptedVersion</code> (default: <code>null</code>, which means v1).</li>
            <li>Set it to <code>2</code>.</li>
            <li>Save. Existing tokens still validate; new tokens are v2.</li>
          </ol>

          <h3>Why not just always accept both?</h3>
          <p>You can, and Cairn does. The benefit of forcing v2: cleaner code, one canonical issuer. The benefit of accepting both: tolerance to manifest drift. For a personal app where you control the manifest, force v2. For an enterprise app where the manifest might be edited by an admin, accept both.</p>

          <h3>jose accepting multiple issuers</h3>
          <CodePre>{`// jose 5+ supports an array of issuers
const { payload } = await jwtVerify(token, JWKS, {
  issuer: [
    \`https://login.microsoftonline.com/\${TENANT_ID}/v2.0\`,
    \`https://sts.windows.net/\${TENANT_ID}/\`,
  ],
  audience: CLIENT_ID,
})`}</CodePre>

          <p>Older jose versions don't accept arrays; you'd need to try once with v2 and fall back to v1. The fleet's apps that use jose all target only v2 by virtue of their app reg manifests.</p>
        </section>

        <hr />

        {/* SECTION 6 — AUDIENCE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Audience Verification</h2>
          <p>The <code>aud</code> claim says "this token is for THIS app." Your server verifies it matches what you expect.</p>

          <h3>The two formats Entra issues</h3>
          <CodePre>{`# Format A — bare client ID GUID
"aud": "55bf92db-2cec-4e65-ab0d-71bee90d7494"

# Format B — Application ID URI
"aud": "api://55bf92db-2cec-4e65-ab0d-71bee90d7494"`}</CodePre>

          <p>Which format depends on:</p>
          <ul>
            <li><strong>ID tokens</strong> have <code>aud</code> = your client ID GUID. Fleet apps that send ID tokens to their own backend (Hearth, GLP1, ShopKeep) match against the bare GUID.</li>
            <li><strong>Access tokens</strong> for custom APIs have <code>aud</code> = <code>api://&lt;guid&gt;</code>. Workshop sending an access token to Tabloom matches against this.</li>
          </ul>

          <h3>jose — single audience</h3>
          <CodePre>{`// GLP1/server.js — verbatim
const { payload } = await jwtVerify(token, JWKS, {
  issuer: ISSUER,
  audience: AAD_CLIENT_ID,   // ← single string — must match exactly
  clockTolerance: '60s',
})`}</CodePre>

          <h3>jsonwebtoken — multi-audience (Cairn)</h3>
          <CodePre>{`// Cairn/middleware/auth.js — verbatim
// AAD issues access tokens whose \`aud\` claim is either the Application ID
// URI (api://<clientId>) or the bare client id, depending on how the API
// is configured. Accept both — both refer to the same Cairn app reg.
const ACCEPTED_AUDIENCES = [\`api://\${CLIENT_ID}\`, CLIENT_ID]

jwt.verify(token, getSigningKey, {
  algorithms: ['RS256'],
  audience: ACCEPTED_AUDIENCES,
  issuer: ACCEPTED_ISSUERS,
}, (err, decoded) => { /* ... */ })`}</CodePre>

          <p>If you can't predict which format your app reg will emit, accept both. Cheap, defensive.</p>

          <h3>jose with multi-audience</h3>
          <CodePre>{`const { payload } = await jwtVerify(token, JWKS, {
  audience: [\`api://\${CLIENT_ID}\`, CLIENT_ID],
  issuer: ISSUER,
})`}</CodePre>

          <h3>What audience checks prevent</h3>
          <p>Suppose your server didn't check audience. An attacker:</p>
          <ol>
            <li>Registers their own app (it gets a different client ID).</li>
            <li>Signs in a victim to their app — the victim consents to <code>User.Read</code>.</li>
            <li>Gets a valid token signed by Entra. <code>iss</code> is the victim's tenant. <code>oid</code> is the victim's OID.</li>
            <li>Sends that token to your server.</li>
            <li>Your server only checks issuer + oid → accepts it → renders the victim's data.</li>
          </ol>

          <p>The audience check catches this: the token's <code>aud</code> is the attacker's client ID, not yours. Reject.</p>

          <h3>Tenant verification — the third axis</h3>
          <p>Even with audience + issuer right, you might want to verify <code>tid</code> (tenant ID). For single-tenant apps, this is redundant (issuer URL already encodes tenant), but Tabloom does it as belt-and-braces:</p>
          <CodePre>{`// tabloom/server.js — verbatim
const { payload } = await jwtVerify(m[1], JWKS, {
  issuer:   ISSUER,
  audience: AAD_CLIENT_ID,
  clockTolerance: "60s",
})
if (payload.tid !== AAD_TENANT_ID) return res.status(401).json({ error: "unauthorized" })
if (!payload.oid)                  return res.status(401).json({ error: "unauthorized" })`}</CodePre>

          <p>This catches the case where an app reg accidentally becomes multi-tenant — without the <code>tid</code> check, you'd accept tokens from <em>any</em> tenant whose users signed in.</p>
        </section>

        <hr />

        {/* SECTION 7 — MULTI-AUDIENCE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Multi-Audience JWT (Tabloom)</h2>
          <p>
            Tabloom is the most complex audience case in the fleet. It accepts tokens from TWO different app registrations:
            its own users (ID tokens with Tabloom's client ID as aud) and Workshop users calling its API (access tokens
            with <code>api://&lt;tabloom-client-id&gt;/access_as_user</code> scope).
          </p>

          <h3>The two token shapes Tabloom accepts</h3>
          <table>
            <tbody>
              <tr><th>Caller</th><th>Token kind</th><th><code>aud</code></th></tr>
              <tr><td>Tabloom's own frontend</td><td>ID token</td><td>Tabloom's client ID GUID</td></tr>
              <tr><td>Workshop's frontend</td><td>Access token</td><td><code>api://&lt;tabloom-client-id&gt;</code></td></tr>
            </tbody>
          </table>

          <h3>How Tabloom validates both</h3>
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
      audience: AAD_CLIENT_ID,
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
    try {
      stmts.upsertUser.run({ oid: payload.oid, name: req.user.name, email })
    } catch (e) {
      console.warn("[auth] upsertUser failed:", e?.message ?? e)
    }
    next()
  } catch {
    res.status(401).json({ error: "unauthorized" })
  }
}`}</CodePre>

          <h3>Wait — the audience is just <code>AAD_CLIENT_ID</code>?</h3>
          <p>Yes. <code>jose</code>'s audience matcher is permissive enough that:</p>
          <ul>
            <li>A token with <code>aud: &lt;tabloom-client-id&gt;</code> matches when <code>audience: AAD_CLIENT_ID</code></li>
            <li>A token with <code>aud: api://&lt;tabloom-client-id&gt;</code> ALSO matches because jose strips the <code>api://</code> prefix during comparison</li>
          </ul>
          <p>This isn't formally documented; it's an artifact of jose's implementation. For strict matching, pass the array form:</p>
          <CodePre>{`audience: [\`api://\${CLIENT_ID}\`, CLIENT_ID],`}</CodePre>

          <h3>The user-tracking sidecar</h3>
          <p>Tabloom does something fleet-unique: every successful auth upserts a row in a <code>users</code> table. This gives Tabloom a real "list of guests" for the share UI without polling Entra Graph:</p>
          <CodePre>{`try {
  stmts.upsertUser.run({ oid: payload.oid, name: req.user.name, email })
} catch (e) {
  console.warn("[auth] upsertUser failed:", e?.message ?? e)
}`}</CodePre>

          <p>The upsert is best-effort (try/catch) — if it fails, the request still succeeds. The user is authenticated regardless.</p>

          <h3>The cross-app pattern in full</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant W as Workshop frontend
  participant E as Entra ID
  participant T as Tabloom backend
  W->>E: acquireTokenSilent(scopes: [api://<tabloom-id>/access_as_user])
  E->>W: access token (aud: api://<tabloom-id>)
  W->>T: GET /api/integrations/workshop/* + Bearer
  T->>T: jwtVerify checks aud, iss, tid, oid
  T->>W: 200 [read-only notebook data]`} />

          <p>Workshop's frontend never touches Workshop's backend in this flow — it goes directly to Tabloom. The full pattern is the subject of the upcoming Cross-App Authentication guide.</p>
        </section>

        <hr />

        {/* SECTION 8 — CLAIM EXTRACTION */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Claim Extraction</h2>
          <p>Once verified, extract the claims you need and attach them to <code>req.user</code> for downstream middleware.</p>

          <h3>The minimum — just OID</h3>
          <CodePre>{`if (!payload.oid) return res.status(401).end()
req.userId = payload.oid
next()`}</CodePre>

          <p>GLP1 uses this — just attaches the OID. Per-user DB resolution (covered in the Per-User SQLite guide) does the rest.</p>

          <h3>The richer pattern — Cairn</h3>
          <CodePre>{`// Cairn/middleware/auth.js — verbatim
req.user = {
  oid,
  name: typeof decoded.name === 'string' ? decoded.name : null,
  tid:  typeof decoded.tid  === 'string' ? decoded.tid  : null,
}
next()`}</CodePre>

          <p>Type-narrowed (<code>typeof decoded.name === 'string'</code>) to avoid leaking non-string claims into <code>req.user.name</code>.</p>

          <h3>The richest pattern — Tabloom</h3>
          <CodePre>{`// tabloom/server.js — verbatim
const email = (payload.preferred_username ?? payload.email ?? "").toLowerCase() || null
req.user = {
  oid:     payload.oid,
  name:    payload.name ?? null,
  email,
  isOwner: payload.oid === PRIMARY_USER_OID,
}`}</CodePre>

          <p>Notice:</p>
          <ul>
            <li><strong>Email coalescing</strong> — <code>preferred_username</code> first, fallback to <code>email</code>. Entra emits one or the other depending on tenant config.</li>
            <li><strong>Lowercase</strong> — emails are case-insensitive, so normalize.</li>
            <li><strong>Empty-string fallback</strong> — <code>"" || null</code> coerces empty to null.</li>
            <li><strong>isOwner</strong> — Tabloom uses this for the <code>requireOwner</code> middleware. Computed from the OID claim against a hardcoded primary user.</li>
          </ul>

          <h3>The standard Entra claim set</h3>
          <table>
            <tbody>
              <tr><th>Claim</th><th>Example</th><th>Notes</th></tr>
              <tr><td><code>oid</code></td><td>GUID</td><td>Always present. Your primary user identifier.</td></tr>
              <tr><td><code>sub</code></td><td>Opaque string</td><td>Same as oid in single-tenant; different for guest users.</td></tr>
              <tr><td><code>tid</code></td><td>GUID</td><td>Tenant ID. Always present.</td></tr>
              <tr><td><code>name</code></td><td>"Alex Wilber"</td><td>Display name. Optional — depends on user profile.</td></tr>
              <tr><td><code>preferred_username</code></td><td>"alex.wilber@contoso.com"</td><td>UPN or email. Usually present for work/school accounts.</td></tr>
              <tr><td><code>email</code></td><td>"alex.wilber@contoso.com"</td><td>Alternative email claim. Present if user has a verified email.</td></tr>
              <tr><td><code>ver</code></td><td>"2.0"</td><td>Token version.</td></tr>
              <tr><td><code>scp</code></td><td>"User.Read"</td><td>Space-separated scopes (access tokens only).</td></tr>
              <tr><td><code>roles</code></td><td>["admin"]</td><td>App roles (if configured).</td></tr>
            </tbody>
          </table>

          <h3>Type-safe extraction in TypeScript</h3>
          <CodePre>{`interface UserClaims {
  oid: string
  name?: string
  email?: string
  tid?: string
}

function extractUser(payload: JWTPayload): UserClaims {
  if (typeof payload.oid !== 'string') throw new Error('missing oid')
  return {
    oid: payload.oid,
    name: typeof payload.name === 'string' ? payload.name : undefined,
    email: typeof payload.preferred_username === 'string'
      ? payload.preferred_username
      : (typeof payload.email === 'string' ? payload.email : undefined),
    tid: typeof payload.tid === 'string' ? payload.tid : undefined,
  }
}`}</CodePre>

          <p>The check-typeof-then-assign pattern keeps your <code>UserClaims</code> type honest. <code>payload.X</code> is typed as <code>unknown</code> in strict <code>jose</code>; the typeof guard narrows it.</p>
        </section>

        <hr />

        {/* SECTION 9 — REQUIREAUTH */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span><code>requireAuth</code> Middleware</h2>
          <p>Tying it all together — the Express middleware that gates protected routes.</p>

          <h3>The full GLP1 implementation</h3>
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

          <h3>The 8 things this middleware does, in order</h3>
          <ol>
            <li><strong>Extracts</strong> the <code>Authorization</code> header.</li>
            <li><strong>Parses</strong> the Bearer scheme via regex (case-insensitive).</li>
            <li><strong>Returns 401</strong> immediately if missing or malformed (don't try to verify junk).</li>
            <li><strong>Calls <code>jwtVerify</code></strong> — this does signature check, exp check, iss check, aud check, and nbf check.</li>
            <li><strong>Verifies tid</strong> as belt-and-braces defense.</li>
            <li><strong>Verifies oid presence</strong> — if Entra emitted a token without oid, treat as invalid.</li>
            <li><strong>Sets <code>req.userId</code></strong> for downstream middleware.</li>
            <li><strong>Catches everything else</strong> as 401 — don't leak error details.</li>
          </ol>

          <h3>Why <code>clockTolerance</code></h3>
          <p>The token's <code>exp</code> is "valid until time X." If your server's clock is even 30 seconds ahead of Entra's, every freshly-issued token will appear expired-but-issued-in-the-future. <code>clockTolerance: '60s'</code> means "accept tokens that look slightly off due to clock skew."</p>

          <p>App Service's clocks are well-synced; 60s is plenty. Don't make it longer — it's a security boundary, not a perf one.</p>

          <h3>The error response</h3>
          <CodePre>{`return res.status(401).json({ error: 'unauthorized' })`}</CodePre>

          <p>Generic. Don't return "token expired" or "audience mismatch" — that helps an attacker probe for valid token shapes. <code>{`{ error: 'unauthorized' }`}</code> for all auth failures.</p>

          <p>In development, log the specific reason for your own debugging:</p>
          <CodePre>{`} catch (err) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[auth] token rejected:', err?.code ?? err?.message ?? err)
  }
  res.status(401).json({ error: 'unauthorized' })
}`}</CodePre>

          <h3>Mounting it</h3>
          <CodePre>{`// Public health BEFORE auth
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Apply auth to everything under /api
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  return requireAuth(req, res, next)
})

// Then withUserDb (the Per-User SQLite guide's middleware)
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  return withUserDb(req, res, next)
})

// Protected routes
app.get('/api/recipes', (req, res) => { /* req.userId, req.db available */ })`}</CodePre>
        </section>

        <hr />

        {/* SECTION 10 — PUBLIC-BEFORE-AUTH */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Public-Before-Auth Patterns</h2>
          <p>Some routes must run BEFORE auth middleware. Get the order right or you'll wonder why your health check times out.</p>

          <h3>The big four "must be public"</h3>
          <ol>
            <li><strong>Health check</strong> — the deploy probe doesn't authenticate.</li>
            <li><strong>Static frontend</strong> — your sign-in page itself can't require auth (chicken-and-egg).</li>
            <li><strong>OAuth callback routes</strong> — Entra's redirect lands without a Bearer token.</li>
            <li><strong>Images served via <code>{`<img>`}</code> tags</strong> — HTML img tags can't send custom headers.</li>
          </ol>

          <h3>The order template</h3>
          <CodePre>{`// 1. CORS first
app.use(cors())

// 2. Body parsers
app.use(express.json({ limit: '20mb' }))

// 3. Static frontend — public
app.use(express.static(join(__dirname, 'dist')))

// 4. Public API routes
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.get('/api/tools/images/:id', publicImageHandler)  // <img> friendly — query-string OID

// 5. Auth gate for everything else under /api
app.use('/api', requireAuth)

// 6. Per-user DB middleware
app.use('/api', withUserDb)

// 7. Protected domain routers
app.use(recipesRoutes)
app.use(aiRoutes)

// 8. SPA fallback (LAST GET)
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

// 9. 404 + error handler
app.use((err, req, res, _next) => res.status(err.status ?? 500).json({ error: 'internal' }))`}</CodePre>

          <h3>The exempt-path pattern</h3>
          <p>If you want a SINGLE auth middleware that knows which paths are public:</p>
          <CodePre>{`const PUBLIC_PATHS = new Set([
  '/health',
  '/version',
])

function isExemptPath(path) {
  return PUBLIC_PATHS.has(path) || path.startsWith('/tools/images/')
}

app.use('/api', (req, res, next) => {
  if (isExemptPath(req.path)) return next()
  return requireAuth(req, res, next)
})`}</CodePre>

          <p>Cleaner than spreading public routes across the file. Less error-prone than relying on registration order.</p>

          <h3>The image-with-query-string OID variant (ShopKeep)</h3>
          <CodePre>{`// Public route — must be registered BEFORE the auth gate
app.get('/api/tools/images/:id', (req, res) => {
  const oid = req.query.oid
  if (!isValidOidFormat(oid)) return res.status(403).end()
  const row = getDb(oid).prepare('SELECT data FROM tool_images WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).end()
  res.type('image/jpeg').send(row.data)
})

// Auth gate AFTER the public image route
app.use('/api', requireAuth)`}</CodePre>

          <h3>The "404, not 403" admin pattern (Cairn)</h3>
          <p>For admin routes, Cairn returns 404 (not 403) when the user isn't authorized — hiding the route's existence:</p>
          <CodePre>{`function requireAdmin(req, res, next) {
  if (req.user?.oid !== ADMIN_OID) {
    return res.status(404).json({ error: 'not found' })   // ← not 403
  }
  next()
}

router.get('/api/admin/qc-status', requireAuth, requireAdmin, async (req, res) => {
  // ... admin-only response ...
})`}</CodePre>

          <p>Doesn't change auth — still verifies the JWT first. Just renames the failure response to hide that the route exists.</p>

          <h3>Workshop's single-user lock</h3>
          <p>Workshop adds an OID allowlist as part of <code>requireAuth</code>:</p>
          <CodePre>{`// workshop/server.js — verbatim
const ALLOWED_OID = process.env.ALLOWED_OID || ''

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

          <p>Set <code>ALLOWED_OID</code> on App Service to lock the app to one user. Useful for "personal" apps that get accidentally exposed via a public URL.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a JWT Validator</h2>
          <p>Stand up an Express server with a real JWT validator (jose), test it against a real Entra ID token, demonstrate the rejection paths.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`mkdir jwt-lab && cd jwt-lab
npm init -y
npm pkg set type=module
npm i express jose dotenv`}</CodePre>

          <h3>Step 2 — .env</h3>
          <CodePre>{`AAD_TENANT_ID=YOUR_TENANT_ID
AAD_CLIENT_ID=YOUR_CLIENT_ID`}</CodePre>

          <p>Use the same tenant + client ID from the MSAL React lab (or any other app reg you have).</p>

          <h3>Step 3 — middleware/auth.js</h3>
          <CodePre>{`// middleware/auth.js
import { jwtVerify, createRemoteJWKSet } from 'jose'

const TENANT = process.env.AAD_TENANT_ID
const CLIENT = process.env.AAD_CLIENT_ID

if (!TENANT || !CLIENT) {
  throw new Error('AAD_TENANT_ID and AAD_CLIENT_ID must be set in .env')
}

const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${TENANT}/discovery/v2.0/keys\`)
)
const ISSUER = \`https://login.microsoftonline.com/\${TENANT}/v2.0\`

export async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!m) {
    return res.status(401).json({ error: 'unauthorized', detail: 'missing bearer' })
  }
  try {
    const { payload } = await jwtVerify(m[1], JWKS, {
      issuer: ISSUER,
      audience: CLIENT,
      clockTolerance: '60s',
    })
    if (payload.tid !== TENANT) {
      return res.status(401).json({ error: 'unauthorized', detail: 'wrong tenant' })
    }
    if (!payload.oid) {
      return res.status(401).json({ error: 'unauthorized', detail: 'no oid claim' })
    }
    req.user = {
      oid: payload.oid,
      name: payload.name ?? null,
      email: payload.preferred_username ?? payload.email ?? null,
    }
    next()
  } catch (err) {
    return res.status(401).json({
      error: 'unauthorized',
      // dev only — production should be generic
      detail: err.code ?? err.message ?? 'verify failed',
    })
  }
}`}</CodePre>

          <h3>Step 4 — server.js</h3>
          <CodePre>{`// server.js
import 'dotenv/config'
import express from 'express'
import { requireAuth } from './middleware/auth.js'

const app = express()
app.use(express.json())

// Public health
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Protected routes
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  return requireAuth(req, res, next)
})

app.get('/api/whoami', (req, res) => {
  res.json(req.user)
})

app.listen(3001, () => console.log('JWT lab on :3001'))`}</CodePre>

          <h3>Step 5 — Get a real token</h3>
          <p>Use the MSAL React lab from the MSAL React guide. After signing in:</p>
          <ol>
            <li>Open DevTools → Application → Local Storage.</li>
            <li>Find a key matching <code>msal.token.keys.*</code> or <code>msal.account.keys</code>.</li>
            <li>Look for the JWT-shaped value (three base64 sections separated by dots).</li>
            <li>Alternatively, modify the lab's <code>App.tsx</code> to log the token: <code>const r = await instance.acquireTokenSilent(loginRequest); console.log(r.idToken)</code>.</li>
          </ol>

          <h3>Step 6 — Test the happy path</h3>
          <CodePre>{`# Replace YOUR_TOKEN with the actual JWT
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/whoami

# Response:
# { "oid": "abc12345-...", "name": "Alex Wilber", "email": "alex.wilber@..." }`}</CodePre>

          <h3>Step 7 — Test rejection paths</h3>

          <p><strong>No token:</strong></p>
          <CodePre>{`curl http://localhost:3001/api/whoami
# { "error": "unauthorized", "detail": "missing bearer" }`}</CodePre>

          <p><strong>Garbage token:</strong></p>
          <CodePre>{`curl -H "Authorization: Bearer nothing-here" http://localhost:3001/api/whoami
# { "error": "unauthorized", "detail": "ERR_JWS_INVALID" }`}</CodePre>

          <p><strong>Modified payload:</strong> grab a valid token, edit the payload section's base64 (e.g. flip a character), keep header + signature intact.</p>
          <CodePre>{`curl -H "Authorization: Bearer eyJ...modified.payload..." http://localhost:3001/api/whoami
# { "error": "unauthorized", "detail": "ERR_JWS_SIGNATURE_VERIFICATION_FAILED" }`}</CodePre>

          <p><strong>Expired token:</strong> wait an hour. Or, for instant test: manually adjust your machine's clock forward by 2 hours.</p>
          <CodePre>{`# Token now expired
# { "error": "unauthorized", "detail": "ERR_JWT_EXPIRED" }`}</CodePre>

          <p><strong>Wrong audience:</strong> get a token from a different app reg in the same tenant.</p>
          <CodePre>{`# { "error": "unauthorized", "detail": "ERR_JWT_CLAIM_VALIDATION_FAILED" }`}</CodePre>

          <h3>Step 8 — Check the health endpoint stays open</h3>
          <CodePre>{`curl http://localhost:3001/api/health
# { "ok": true }    ← no auth required`}</CodePre>

          <h3>Step 9 — Add the public-image variant</h3>
          <p>Register a public route BEFORE the auth middleware:</p>
          <CodePre>{`// server.js — before "app.use('/api', requireAuth)"
app.get('/api/avatars/:userId', (req, res) => {
  const { userId } = req.params
  if (!/^[0-9a-f-]{36}$/i.test(userId)) {
    return res.status(400).json({ error: 'invalid id' })
  }
  // ... look up avatar, send image bytes ...
  res.type('image/png').send(Buffer.from('test'))
})`}</CodePre>

          <p>Verify it works without auth:</p>
          <CodePre>{`curl http://localhost:3001/api/avatars/abc12345-1111-2222-3333-444444444444
# (returns 4 bytes "test")`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've built a complete JWT validator that handles 5 rejection paths (missing, malformed, wrong signature,
              expired, wrong audience). Plus the public-before-auth ordering. Five fleet apps' backend security model in
              ~50 lines.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>ERR_JWKS_NO_MATCHING_KEY</h3>
          <p>The token's <code>kid</code> isn't in the cached JWKS. Two causes: (a) you're targeting the wrong tenant — the <code>kid</code> in the token references a key from a different tenant's JWKS, (b) the token is genuinely old, signed before a key was rotated out. Fix: confirm tenant ID matches; if it does, restart the server to clear JWKS cache.</p>

          <h3>ERR_JWS_SIGNATURE_VERIFICATION_FAILED</h3>
          <p>Signature didn't match. The token was tampered with, OR you're using the wrong tenant's JWKS. Verify the <code>iss</code> claim in the token vs your JWKS URL.</p>

          <h3>ERR_JWT_CLAIM_VALIDATION_FAILED — wrong audience</h3>
          <p>The <code>aud</code> claim doesn't match what you passed to <code>jwtVerify</code>. Use jwt.ms to inspect. Common causes: (a) using ID token's audience format but expecting access token's (or vice versa), (b) app reg's <code>accessTokenAcceptedVersion</code> emits <code>api://&lt;guid&gt;</code> format but you check for bare GUID. Accept both with array form.</p>

          <h3>ERR_JWT_CLAIM_VALIDATION_FAILED — wrong issuer</h3>
          <p>The <code>iss</code> claim doesn't match. Causes: (a) v1 vs v2 issuer format mismatch — accept both, (b) wrong tenant. Inspect with jwt.ms.</p>

          <h3>ERR_JWT_EXPIRED</h3>
          <p>Token's <code>exp</code> is past. Check clock skew on your server (<code>date -u</code> on Linux/Mac, <code>w32tm /query /status</code> on Windows). Add <code>clockTolerance: '60s'</code> if your clock is consistently a bit off.</p>

          <h3>Token works in curl but not via the frontend</h3>
          <p>The frontend is sending a DIFFERENT token than you tested. MSAL caches multiple tokens for different scopes; <code>result.idToken</code> and <code>result.accessToken</code> have different audiences. Confirm which one your frontend sends with DevTools.</p>

          <h3>"Cannot read property 'oid' of undefined"</h3>
          <p>You're accessing <code>req.user.oid</code> in a handler where <code>requireAuth</code> didn't run. Either the handler is registered before the middleware, OR the path slips past your auth router's path filter.</p>

          <h3>Auth passes locally but fails on App Service</h3>
          <p>Three likely causes:</p>
          <ul>
            <li>Env vars (<code>AAD_TENANT_ID</code>, <code>AAD_CLIENT_ID</code>) aren't set on App Service. Add them via portal or <code>az webapp config appsettings set</code>.</li>
            <li>Clock skew. App Service B1 occasionally drifts. Add <code>clockTolerance: '60s'</code>.</li>
            <li>Outbound network restriction blocks the JWKS fetch. Check the App Service VNet integration settings.</li>
          </ul>

          <h3>Hot reload breaks the JWKS cache</h3>
          <p>In dev, every code reload creates a new <code>createRemoteJWKSet</code> instance with an empty cache, refetching JWKS on the first request. This is normal — production caches across requests because the module is loaded once.</p>

          <h3>JWKS endpoint times out</h3>
          <p>Rare. Microsoft's discovery endpoint is highly available. If it persists: check outbound DNS / proxy. Bump <code>timeoutDuration</code> on <code>createRemoteJWKSet</code> for higher tolerance.</p>

          <h3>"InvalidTokenError: TIME_USED_AFTER_EXPIRY"</h3>
          <p>Specifically with <code>jsonwebtoken</code>. Means <code>exp</code> claim is past, even after <code>clockTolerance</code>. Same fix as <code>ERR_JWT_EXPIRED</code> for jose.</p>

          <h3>Rejecting all tokens after a deploy</h3>
          <p>Almost always: env var typo or missing. Confirm with the deploy logs that <code>AAD_TENANT_ID</code> + <code>AAD_CLIENT_ID</code> are populated. Otherwise: stale code references an old tenant/client ID — redeploy.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The 5 checks</h3>
          <ol>
            <li>Signature matches a JWKS public key</li>
            <li><code>iss</code> matches your trusted Entra URL</li>
            <li><code>aud</code> matches your client ID (or API URI)</li>
            <li><code>exp</code> is in the future</li>
            <li><code>tid</code> matches your tenant (defense in depth)</li>
          </ol>

          <h3>jose skeleton</h3>
          <CodePre>{`import { jwtVerify, createRemoteJWKSet } from 'jose'

const JWKS = createRemoteJWKSet(
  new URL(\`https://login.microsoftonline.com/\${TENANT}/discovery/v2.0/keys\`)
)

const { payload } = await jwtVerify(token, JWKS, {
  issuer: \`https://login.microsoftonline.com/\${TENANT}/v2.0\`,
  audience: CLIENT_ID,
  clockTolerance: '60s',
})

if (payload.tid !== TENANT) throw new Error('wrong tenant')
if (!payload.oid)            throw new Error('no oid')`}</CodePre>

          <h3>Express middleware</h3>
          <CodePre>{`async function requireAuth(req, res, next) {
  const m = /^Bearer (.+)$/i.exec(req.headers.authorization ?? '')
  if (!m) return res.status(401).json({ error: 'unauthorized' })
  try {
    const { payload } = await jwtVerify(m[1], JWKS, { issuer, audience, clockTolerance: '60s' })
    if (payload.tid !== TENANT) return res.status(401).end()
    if (!payload.oid)            return res.status(401).end()
    req.user = { oid: payload.oid, name: payload.name ?? null }
    next()
  } catch {
    res.status(401).end()
  }
}`}</CodePre>

          <h3>Multi-audience</h3>
          <CodePre>{`audience: [\`api://\${CLIENT_ID}\`, CLIENT_ID]`}</CodePre>

          <h3>Multi-issuer (v1 + v2)</h3>
          <CodePre>{`issuer: [
  \`https://login.microsoftonline.com/\${TENANT}/v2.0\`,
  \`https://sts.windows.net/\${TENANT}/\`,
]`}</CodePre>

          <h3>Public-before-auth order</h3>
          <CodePre>{`app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.get('/api/health', ...)              // public
app.get('/api/images/:id', ...)          // public, query-string OID
app.use('/api', requireAuth)              // auth gate
app.use('/api', withUserDb)
app.use(domainRouters)
app.get('/{*path}', spaFallback)
app.use(errorHandler)`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>jose <code>requireAuth</code></td><td>GLP1 · <code>server.js:282-304</code></td></tr>
              <tr><td>jsonwebtoken + jwks-rsa <code>requireAuth</code></td><td>Cairn · <code>middleware/auth.js</code> (full file)</td></tr>
              <tr><td>Multi-audience (v1 + v2)</td><td>Cairn · <code>middleware/auth.js:31</code></td></tr>
              <tr><td>Multi-issuer (v1 + v2)</td><td>Cairn · <code>middleware/auth.js:23-26</code></td></tr>
              <tr><td>Tenant claim check + user upsert</td><td>tabloom · <code>server.js:988-1015</code></td></tr>
              <tr><td>Single-user OID lock</td><td>workshop · <code>server.js:608-633</code></td></tr>
              <tr><td>jose with tenant check</td><td>GLP1 · <code>server.js:297</code></td></tr>
              <tr><td>404-not-403 admin pattern</td><td>Cairn · admin route</td></tr>
              <tr><td>Email coalescing</td><td>tabloom · <code>server.js:1000</code></td></tr>
              <tr><td>JWKS 24h cache (jwks-rsa)</td><td>Cairn · <code>middleware/auth.js:37</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of Phase 1 — every foundational article shipped.</p>
        </section>
      </main>
    </div>
  );
}
