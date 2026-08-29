import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Vault Provisioning (Bicep)',         icon: '🏗️' },
  { id: 's3',  num: '3',  title: 'RBAC vs Access Policies',            icon: '🔐' },
  { id: 's4',  num: '4',  title: 'Soft Delete + Purge Protection',     icon: '🛡️' },
  { id: 's5',  num: '5',  title: 'KV References from App Service',     icon: '🔗' },
  { id: 's6',  num: '6',  title: 'Managed Identity (System vs User)',  icon: '🆔' },
  { id: 's7',  num: '7',  title: 'Secret-Name Normalization',          icon: '📝' },
  { id: 's8',  num: '8',  title: 'Local-Dev Story',                    icon: '💻' },
  { id: 's9',  num: '9',  title: 'SDK Path (DefaultAzureCredential)',  icon: '📦' },
  { id: 's10', num: '10', title: 'Rotation + Versioning',              icon: '🔄' },
  { id: 's11', num: '★',  title: 'Lab: Migrate One Secret to KV',      icon: '🛠️' },
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

export default function KeyVaultGuide() {
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
            <span className="sidebar-title">Azure Key Vault</span>
          </div>
          <div className="sidebar-sub">Bicep + KV refs + managed identity</div>
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
          <div className="hero-tag">🔐 Azure Key Vault · RBAC mode · 2026</div>
          <h1>Azure Key Vault<br />Patterns</h1>
          <p>
            The fleet stores production secrets in Key Vault and pulls them into App Service via
            <code>@Microsoft.KeyVault(SecretUri=...)</code> references. The Bicep templates in
            <code>azure-infra</code> spin up a vault with <strong style={{ color: '#C77AA0' }}>RBAC mode</strong>,
            <strong style={{ color: '#C77AA0' }}> soft delete (90 days)</strong>, and
            <strong style={{ color: '#C77AA0' }}> purge protection</strong>. The webapp's system-assigned managed
            identity gets the <code>Key Vault Secrets User</code> role scoped to THIS vault only — least-privilege by
            construction. This guide walks the whole pattern: Bicep, RBAC vs access policies, the
            <code>SecretUri</code> mechanics, the underscore-to-hyphen secret-name rule, why the fleet skips the SDK,
            and how to migrate one plaintext env var to KV.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">90d</span><span className="hero-stat-label">Soft delete</span></div>
            <div className="hero-stat"><span className="hero-stat-val">RBAC</span><span className="hero-stat-label">Auth mode</span></div>
            <div className="hero-stat"><span className="hero-stat-val">$0</span><span className="hero-stat-label">Standard SKU base</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">SDK calls in app code</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Key Vault is Microsoft's hosted secret store. You put a secret in (an API key, a connection string, a
            certificate), you grant identities permission to read it, and you retrieve it at runtime. The point is
            not just storage — it's the surrounding infrastructure: access logging, soft delete, RBAC, versioning,
            rotation hooks, certificate auto-renewal. You're paying for all of it; if you only use "put secret, get
            secret," you're underutilizing it.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The hotel safe.</strong> The safe is in your room; the room key gets you in; the safe combination
            gets you the contents. Two layers of access control. Key Vault: the "room key" is your Azure RBAC
            assignment to the vault. The "combination" is having the right role (Reader, Secrets User, Secrets
            Officer). You can have one without the other.
          </p>
          <p>
            <strong>The locker at the rink.</strong> Quarters in, lock the locker, get a key. The key DOES NOT
            identify you — anyone with the key can open the locker. Key Vault's "managed identity" inverts this: the
            key (identity) IS who you are, and the vault checks "is this identity allowed?" before opening the locker.
            No anonymous keys.
          </p>
          <p>
            <strong>The reference at the bank.</strong> A safety deposit box is a reference: instead of holding your
            grandmother's diamonds, you hold a number that points to a specific box at the bank. Key Vault references
            in App Service work the same way: your environment variable holds the REFERENCE
            (<code>@Microsoft.KeyVault(SecretUri=...)</code>), not the secret value. The App Service runtime resolves
            the reference at startup using the webapp's identity.
          </p>

          <h3>What Key Vault stores</h3>
          <ul>
            <li><strong>Secrets</strong>: arbitrary strings (API keys, connection strings, passwords). What the fleet uses.</li>
            <li><strong>Keys</strong>: cryptographic keys (RSA, EC) for sign/verify/encrypt/decrypt. Hardware-backed if you pick Premium SKU + HSM.</li>
            <li><strong>Certificates</strong>: X.509 certs with auto-renewal hooks. Useful for TLS termination on Application Gateway.</li>
          </ul>

          <p>The fleet only uses Secrets. Keys and Certificates are out of scope for this guide.</p>

          <h3>What the fleet keeps in KV</h3>
          <table>
            <tbody>
              <tr><th>Secret</th><th>App(s)</th><th>Why</th></tr>
              <tr><td>AZURE_OPENAI_API_KEY</td><td>SecretApp</td><td>Azure OpenAI auth</td></tr>
              <tr><td>AZURE_AI_API_KEY</td><td>PulseWire</td><td>AI Foundry auth</td></tr>
              <tr><td>VOYAGE_API_KEY</td><td>Tabloom</td><td>Voyage AI embeddings</td></tr>
              <tr><td>ANTHROPIC_API_KEY</td><td>ShopKeep, Tabloom</td><td>Claude</td></tr>
              <tr><td>PLEX_TOKEN</td><td>SecretApp</td><td>Plex auth</td></tr>
              <tr><td>SENDGRID_API_KEY</td><td>PulseWire</td><td>Cost alert email</td></tr>
              <tr><td>DATABASE_URL</td><td>PulseWire</td><td>Postgres connection string</td></tr>
              <tr><td>SESSION_JWT_SECRET</td><td>PulseWire</td><td>HS256 cookie signing</td></tr>
            </tbody>
          </table>

          <h3>The flow</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  D[Developer] -->|az keyvault secret set| KV[(Key Vault)]
  AS[App Service] -->|reads ref at boot| ENV[Env var<br/>has SecretUri]
  AS -->|managed identity| KV
  KV -->|returns secret value| AS
  AS -->|injects as plain env var| APP[Your Node.js app]
  APP -->|process.env.AZURE_OPENAI_API_KEY| OK[Just works]
  style KV fill:#5C2A4A,color:#fff
  style AS fill:#5C2A4A,color:#fff`} />

          <h3>What changes in your app code</h3>
          <p><strong>Nothing</strong>. The whole point of KV references is that <code>process.env.MY_SECRET</code> works the same way as if you'd put the secret in App Service config directly. The App Service runtime does the KV resolution before your app starts. From the app's view, it's a normal env var.</p>

          <p>That's why the fleet doesn't use the Azure SDK in app code — there's no need. The infrastructure does it.</p>
        </section>

        <hr />

        {/* SECTION 2 — BICEP */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Vault Provisioning (Bicep)</h2>
          <p>The fleet's Bicep templates spin up the vault with the exact settings you want for production. Reading them verbatim is the fastest path to understanding.</p>

          <h3>The full resource declaration</h3>
          <CodePre>{`// azure-infra/new-apps/templates/app.bicep (lines 123-142, verbatim)
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
  }
}`}</CodePre>

          <h3>Field by field</h3>

          <h4>name + location</h4>
          <p>
            Vault names are GLOBALLY unique across all of Azure. Use a deterministic naming convention. The fleet
            uses <code>kv-&lt;app&gt;-&lt;env&gt;-&lt;regionHash&gt;</code>. The region must be where most callers live;
            latency for cross-region KV calls is noticeable.
          </p>

          <h4>sku.name: 'standard'</h4>
          <p>Two tiers:</p>
          <ul>
            <li><strong>Standard</strong>: $0 monthly base + ~$0.03 per 10,000 operations. Software-backed keys.</li>
            <li><strong>Premium</strong>: ~$1/month per HSM-protected key + operations. Required for FIPS 140-2 compliance.</li>
          </ul>

          <p>The fleet uses Standard. Premium is for regulated workloads.</p>

          <h4>tenantId</h4>
          <p>The Entra ID tenant this vault is bound to. Identities from other tenants cannot get a token to access it. Almost always <code>subscription().tenantId</code>.</p>

          <h4>enableRbacAuthorization: true</h4>
          <p>Use Azure RBAC for authorization (the modern way). The legacy alternative is access policies (more on this in §3). Always pick RBAC for new vaults.</p>

          <h4>enableSoftDelete + softDeleteRetentionInDays</h4>
          <p>When a secret is deleted, it goes into "soft delete" state for 90 days. Recoverable via Azure CLI / portal. After 90 days, it's purged automatically. <strong>Cannot be disabled once enabled.</strong> Cannot reduce retention below 7 days.</p>

          <h4>enablePurgeProtection: true</h4>
          <p>Blocks immediate hard delete. Even an admin cannot purge a soft-deleted secret during the 90-day retention. This is the "you really can't lose the secret to an angry sysadmin" guarantee. <strong>Once turned on, cannot be turned off for this vault.</strong></p>

          <h4>publicNetworkAccess: 'Enabled'</h4>
          <p>
            Vault is reachable from the public internet (with authentication, of course). Acceptable for the fleet
            because:
          </p>
          <ul>
            <li>Authentication is Entra-backed — anonymous access is impossible.</li>
            <li>App Service is itself a public Azure resource that calls KV over the Azure backbone.</li>
            <li>Developer machines need to reach KV for local-dev setup.</li>
          </ul>

          <p>For higher-security workloads, set this to <code>'Disabled'</code> + add Private Endpoint + Private DNS zone. Beyond the fleet's needs.</p>

          <h4>networkAcls.bypass: 'AzureServices'</h4>
          <p>Even when <code>publicNetworkAccess: 'Disabled'</code>, Azure-internal services (App Service, Logic Apps, etc.) can still reach the vault. Set this so App Service still works after locking down public network access.</p>

          <h3>The whole module pattern</h3>
          <p>
            In <code>app.bicep</code>, the vault is one resource in a larger template that also provisions: App Service
            Plan, App Service, role assignments, app settings. The pattern: one Bicep module per app, deploys
            everything atomically.
          </p>

          <CodePre>{`// Deploy with:
az deployment group create \\
  --resource-group rg-pulsewire-prod \\
  --template-file app.bicep \\
  --parameters appName=pulsewire env=prod`}</CodePre>

          <h3>Outputs the module exposes</h3>
          <CodePre>{`output keyVaultUri string = keyVault.properties.vaultUri
output webappPrincipalId string = webapp.identity.principalId
output webappHostName string = webapp.properties.defaultHostName`}</CodePre>

          <p>Other modules (like a DB module) can consume <code>keyVaultUri</code> to write their own secrets to this vault.</p>
        </section>

        <hr />

        {/* SECTION 3 — RBAC */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>RBAC vs Access Policies</h2>
          <p>Key Vault offers two authorization models. Always pick RBAC.</p>

          <h3>Access policies (legacy)</h3>
          <p>
            Each vault has its own access policy list — up to 1024 entries. Each entry is "this principal can do
            these specific actions on these specific resource types." Like a per-vault ACL. Pre-2020 default.
          </p>

          <p>Downsides:</p>
          <ul>
            <li>Per-vault management — at fleet scale, you're editing N vaults.</li>
            <li>No inheritance — granting subscription-level read doesn't help.</li>
            <li>Action lists are flat — no role abstractions.</li>
            <li>You CAN'T see all access at one glance via Azure RBAC tools.</li>
          </ul>

          <h3>RBAC mode (modern)</h3>
          <CodePre>{`enableRbacAuthorization: true`}</CodePre>

          <p>Authorization is done through Azure RBAC, which is the same system used for all other Azure resources. Standard role-based access control.</p>

          <p>Built-in roles relevant to KV:</p>
          <table>
            <tbody>
              <tr><th>Role</th><th>What it grants</th><th>Use for</th></tr>
              <tr><td>Key Vault Administrator</td><td>Full data plane control (read + write secrets/keys/certs)</td><td>Power admin (rare)</td></tr>
              <tr><td>Key Vault Secrets Officer</td><td>Read + write secrets (no keys/certs)</td><td>You, as the developer</td></tr>
              <tr><td>Key Vault Secrets User</td><td>Read secrets only</td><td>App Service managed identity</td></tr>
              <tr><td>Key Vault Reader</td><td>Read metadata (not secret values)</td><td>Auditors</td></tr>
              <tr><td>Key Vault Crypto Officer</td><td>Manage keys</td><td>Cert management</td></tr>
              <tr><td>Key Vault Crypto User</td><td>Use keys (sign/encrypt/decrypt)</td><td>Apps using keys</td></tr>
              <tr><td>Key Vault Certificates Officer</td><td>Manage certificates</td><td>TLS automation</td></tr>
            </tbody>
          </table>

          <h3>The fleet's role assignment</h3>
          <CodePre>{`// azure-infra/new-apps/templates/app.bicep (lines 219-229, verbatim)
// Webapp managed identity -> read secrets from this app's Key Vault.
// Scope = keyVault. The webapp can only read secrets from THIS vault.
resource webappKvReader 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webapp.id, 'KeyVaultSecretsUser')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRoleId)
    principalId: webapp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}`}</CodePre>

          <h3>Breakdown</h3>
          <ul>
            <li><strong><code>name: guid(...)</code></strong>: role assignments need deterministic names so re-running Bicep doesn't create duplicates. <code>guid()</code> hashes the inputs into a stable UUID.</li>
            <li><strong><code>scope: keyVault</code></strong>: this assignment is SCOPED TO THIS VAULT ONLY. The webapp cannot read secrets from any other vault — even other vaults in the same subscription.</li>
            <li><strong><code>roleDefinitionId</code></strong>: <code>4633458b-17de-408a-b874-0445c86b69e6</code> = Key Vault Secrets User. Built-in role ID. Memorize this one.</li>
            <li><strong><code>principalId: webapp.identity.principalId</code></strong>: the webapp's system-assigned managed identity. §6 covers how this gets created.</li>
            <li><strong><code>principalType: 'ServicePrincipal'</code></strong>: required — distinguishes between user, group, and SP identities.</li>
          </ul>

          <h3>The least-privilege win</h3>
          <p>
            The webapp can READ secrets. It cannot list, write, delete, or create new versions. If the webapp's
            code is compromised, an attacker can fetch existing secrets but cannot dump the entire vault, rotate
            keys, or destroy data. Smallest possible blast radius.
          </p>

          <h3>Built-in role IDs to memorize</h3>
          <CodePre>{`// app.bicep var declarations
var keyVaultSecretsUserRoleId     = '4633458b-17de-408a-b874-0445c86b69e6'  // read secrets
var keyVaultSecretsOfficerRoleId  = 'b86a8fe4-44ce-4948-aee5-eccb2c155cd7'  // r/w secrets
var keyVaultCryptoUserRoleId      = '12338af0-0e69-4776-bea7-57ae8d297424'  // use keys
var keyVaultAdministratorRoleId   = '00482a5a-887f-4fb3-b363-3b7fe8e74483'  // full data plane`}</CodePre>

          <h3>Migrating from access policies to RBAC</h3>
          <p>Existing vaults can switch:</p>
          <ol>
            <li>Identify every access policy + the equivalent RBAC role.</li>
            <li>Create RBAC assignments at the appropriate scope.</li>
            <li>Verify access works for both modes (test apps still get secrets).</li>
            <li>Flip <code>enableRbacAuthorization</code> to <code>true</code>. Access policies are now ignored.</li>
            <li>If anything breaks, flip back. Access policies are still there.</li>
            <li>Once stable, remove all access policies.</li>
          </ol>

          <p>The fleet started with RBAC, so this isn't an issue. For older Azure subscriptions with vaults predating 2020, plan the migration carefully.</p>
        </section>

        <hr />

        {/* SECTION 4 — SOFT DELETE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Soft Delete + Purge Protection</h2>
          <p>These two settings work together to make secret loss nearly impossible. Worth understanding in detail.</p>

          <h3>Soft delete behavior</h3>
          <p>When you delete a secret:</p>
          <ol>
            <li>The secret's status becomes <code>Deleted</code>.</li>
            <li>It's hidden from normal <code>list-secrets</code> calls.</li>
            <li>A "deleted secrets" namespace holds it for the retention period (90 days for the fleet).</li>
            <li>Anyone with appropriate permissions can <em>recover</em> it back to live status.</li>
            <li>After 90 days, it's purged automatically and is unrecoverable.</li>
          </ol>

          <h3>Recovering a deleted secret</h3>
          <CodePre>{`# List deleted secrets
az keyvault secret list-deleted --vault-name kv-pulsewire-prod

# Recover a specific one
az keyvault secret recover \\
  --vault-name kv-pulsewire-prod \\
  --name DATABASE-URL`}</CodePre>

          <h3>Purging</h3>
          <p>"Purge" = permanently delete. Bypasses the retention period. Requires <code>Key Vault Administrator</code> role + the <code>purge</code> action.</p>

          <CodePre>{`# Without purge protection, you could do this:
az keyvault secret purge --vault-name kv-pulsewire-prod --name DATABASE-URL
# → "permanently destroys the secret"`}</CodePre>

          <h3>Purge protection — what changes</h3>
          <CodePre>{`enablePurgeProtection: true`}</CodePre>

          <p>With this on, <code>az keyvault secret purge</code> returns an error. Even an admin cannot force-delete during retention. The 90-day waiting period is mandatory.</p>

          <p>Once enabled, <strong>purge protection cannot be disabled.</strong> So if you ever decide you don't want it, you have to wait for purge protection's own retention... which is forever. Be intentional.</p>

          <h3>Why both</h3>
          <p>Soft delete alone is recoverable from accidental delete. Adds purge protection ensures it's recoverable from MALICIOUS delete (compromised admin trying to destroy evidence). The combination:</p>
          <ul>
            <li>Accidental delete by developer → soft-deleted, recoverable for 90 days.</li>
            <li>Malicious admin tries purge → blocked by purge protection.</li>
            <li>Attacker takes over RBAC → can soft-delete but cannot purge.</li>
            <li>Worst case: secret is unavailable for 90 days. Recoverable after audit + admin intervention.</li>
          </ul>

          <h3>What if I really need to delete?</h3>
          <p>
            Scenarios where you might want to bypass: a secret was leaked publicly and needs to be gone permanently.
            The answer: rotate the secret value (compromised version becomes useless). The "permanently delete" feel
            is replaced by "compromised key is no longer valid anywhere." This is operationally equivalent and
            doesn't lose any audit trail.
          </p>

          <h3>The "stuck" name problem</h3>
          <p>
            If you delete a secret named <code>API-KEY</code> and try to immediately CREATE a new secret named
            <code>API-KEY</code> with a different value, you get <code>ConflictError: A secret with this name is
            currently in a soft-deleted state</code>. The name is "reserved" until retention expires.
          </p>

          <p>Two solutions:</p>
          <ol>
            <li><strong>Recover the soft-deleted secret, then update its value.</strong> Same name; new value becomes the new version.</li>
            <li><strong>Use a different name.</strong> <code>API-KEY-V2</code>. Less elegant but works around the conflict.</li>
          </ol>

          <h3>Versioning</h3>
          <p>When you UPDATE a secret, Key Vault creates a new VERSION. Old versions stay accessible by URI. You can read a specific version, list all versions, mark a version as disabled. This is independent of soft delete — it's part of every secret.</p>

          <CodePre>{`# Update creates a new version
az keyvault secret set --vault-name kv-foo --name API-KEY --value "new-value"

# Get the previous version explicitly
az keyvault secret show \\
  --vault-name kv-foo \\
  --name API-KEY \\
  --version 1a2b3c4d5e6f`}</CodePre>

          <p>If a rotation goes wrong, you can roll back to an older version. (More on rotation in §10.)</p>
        </section>

        <hr />

        {/* SECTION 5 — KV REFERENCES */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>KV References from App Service</h2>
          <p>The fleet's main pattern: App Service env vars hold REFERENCES to KV secrets, not the secrets themselves. App Service resolves them at app startup.</p>

          <h3>The reference syntax</h3>
          <CodePre>{`@Microsoft.KeyVault(SecretUri=https://kv-pulsewire-prod.vault.azure.net/secrets/DATABASE-URL/)`}</CodePre>

          <p>Breakdown:</p>
          <ul>
            <li><strong><code>@Microsoft.KeyVault(...)</code></strong>: the reference wrapper. App Service recognizes it as "resolve this at startup."</li>
            <li><strong><code>SecretUri=...</code></strong>: the full URI of the secret.</li>
            <li><strong><code>https://kv-...vault.azure.net/secrets/&lt;name&gt;/</code></strong>: the latest version.</li>
            <li><strong><code>.../&lt;name&gt;/&lt;version-id&gt;</code></strong>: a specific version (rare; the fleet uses latest).</li>
          </ul>

          <h3>Bicep generates these automatically</h3>
          <CodePre>{`// app.bicep (lines 102-105, verbatim)
var secretAppSettings = [for secretName in secretAppSettingNames: {
  name: secretName
  value: '@Microsoft.KeyVault(SecretUri=\${keyVaultUriComputed}secrets/\${replace(secretName, '_', '-')}/)'
}]`}</CodePre>

          <p>This Bicep loop:</p>
          <ul>
            <li>Takes a list of secret names (passed as parameter).</li>
            <li>For each, generates an App Service app setting where the env var name = secret name (with underscores intact) and the value = KV reference (with underscores replaced by hyphens, because KV secret names cannot contain underscores).</li>
          </ul>

          <p>So <code>AZURE_OPENAI_API_KEY</code> in App Service env config becomes a reference to the <code>AZURE-OPENAI-API-KEY</code> secret in KV. Your Node code reads <code>process.env.AZURE_OPENAI_API_KEY</code> and gets the value as-if it were set directly.</p>

          <h3>Resolution lifecycle</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant D as Developer
  participant K as Key Vault
  participant AS as App Service
  participant N as Node app

  D->>K: az keyvault secret set
  K-->>D: secret stored

  Note over AS: App restart triggers resolution
  AS->>AS: read app settings
  AS->>AS: detect @Microsoft.KeyVault(...) refs
  AS->>K: GET secret value (via managed identity)
  K-->>AS: plain secret value
  AS->>N: spawn Node with env vars set
  N->>N: process.env.X = "actual-secret"`} />

          <h3>When references resolve</h3>
          <p>Resolution happens at App Service warmup, NOT on every request. If KV is unreachable at startup, the reference becomes the LITERAL STRING <code>@Microsoft.KeyVault(...)</code> in your env var — your app starts but with broken secrets.</p>

          <p>App Service marks the reference status in the Configuration blade:</p>
          <ul>
            <li><strong>Resolved</strong>: green check. Working.</li>
            <li><strong>Source not found</strong>: vault or secret doesn't exist.</li>
            <li><strong>Access denied</strong>: managed identity lacks the role.</li>
            <li><strong>Reference syntax error</strong>: the string isn't parseable.</li>
            <li><strong>Recommendation</strong>: fix the issue, then restart the App Service to re-resolve.</li>
          </ul>

          <h3>Auto-refresh (sort of)</h3>
          <p>App Service polls KV references every ~24 hours and refreshes if the value changed. For faster propagation, restart the App Service after rotating a secret. The polling is best-effort; don't rely on it for time-sensitive rotations.</p>

          <h3>Why this beats the SDK</h3>
          <p>You could fetch secrets from KV at app startup using <code>@azure/keyvault-secrets</code> + <code>@azure/identity</code>. Compared to the KV reference pattern:</p>
          <table>
            <tbody>
              <tr><th></th><th>KV reference</th><th>SDK at boot</th></tr>
              <tr><td>Code change</td><td>Zero</td><td>Add SDK, fetch logic, error handling</td></tr>
              <tr><td>Failure mode</td><td>App Service shows "ref not resolved"</td><td>App boot fails or env unset</td></tr>
              <tr><td>Dependencies</td><td>None</td><td>2 npm packages, MSAL chain</td></tr>
              <tr><td>Visibility</td><td>Visible in App Service portal</td><td>In your logs / code</td></tr>
              <tr><td>Local dev</td><td>Hit a wall (manual .env)</td><td>Same SDK works locally</td></tr>
            </tbody>
          </table>

          <p>The fleet picked KV references because the runtime is opaque (Node + Express + SQLite) and the zero-code-change benefit was worth losing the unified dev/prod flow. For Next.js apps where SDK is already pulled in for other reasons, the SDK route is equally fine.</p>
        </section>

        <hr />

        {/* SECTION 6 — MANAGED IDENTITY */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Managed Identity (System vs User)</h2>
          <p>The webapp doesn't authenticate to KV with a static key. It uses a "managed identity" — Azure issues short-lived tokens via the Instance Metadata Service. Two flavors.</p>

          <h3>System-assigned (what the fleet uses)</h3>
          <p>Tied to the App Service resource. Created when you enable it, destroyed when the resource is deleted. No separate lifecycle.</p>

          <CodePre>{`// In Bicep (app.bicep), the webapp resource:
resource webapp 'Microsoft.Web/sites@2023-01-01' = {
  name: webappName
  identity: {
    type: 'SystemAssigned'    // ← this creates the identity
  }
  // ...
}`}</CodePre>

          <p>Reference it as <code>webapp.identity.principalId</code>. This is the principal ID used in RBAC assignments.</p>

          <h3>User-assigned</h3>
          <p>A separate Azure resource that you create independently and can attach to multiple App Service instances. Useful when:</p>
          <ul>
            <li>Multiple apps share the same set of permissions.</li>
            <li>You want the identity to outlive any particular app.</li>
            <li>You want to manage role assignments once and have all apps inherit.</li>
          </ul>

          <CodePre>{`// User-assigned identity is a separate resource:
resource uami 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'uami-shared-prod'
  location: location
}

resource webapp 'Microsoft.Web/sites@2023-01-01' = {
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '\${uami.id}': {} }
  }
}`}</CodePre>

          <h3>How the webapp gets a token</h3>
          <p>Behind the scenes, App Service sets two env vars:</p>
          <ul>
            <li><code>IDENTITY_ENDPOINT</code>: a URL like <code>http://127.0.0.1:43901/msi/token</code>.</li>
            <li><code>IDENTITY_HEADER</code>: a per-instance shared secret.</li>
          </ul>

          <p>The KV reference resolver (and the Azure SDK, if you used it) calls the endpoint with the header to get a token scoped to the requested resource (<code>https://vault.azure.net</code>). Standard MSI flow.</p>

          <p>You don't write this code. App Service handles KV references; the SDK handles SDK calls.</p>

          <h3>When system-assigned is wrong</h3>
          <p>Cross-app scenarios. If app A and app B both need to read from the same KV, system-assigned means TWO role assignments. With user-assigned, one identity attached to both apps means ONE role assignment. Less drift, easier to audit.</p>

          <p>For the fleet (where each app is independent), system-assigned is simpler.</p>

          <h3>Cross-subscription / cross-tenant</h3>
          <p>If KV is in a different subscription than the webapp:</p>
          <ul>
            <li>Same tenant: works fine. Just need cross-subscription role assignment.</li>
            <li>Different tenant: requires Azure AD multi-tenant identity configuration. Avoid unless absolutely necessary.</li>
          </ul>

          <h3>Auditing access</h3>
          <CodePre>{`# Find every secret read in the last day
az monitor activity-log list \\
  --resource-id /subscriptions/.../vaults/kv-pulsewire-prod \\
  --offset 1d \\
  --query "[?operationName.value=='Microsoft.KeyVault/vaults/secrets/getSecret/action']"`}</CodePre>

          <p>KV writes every secret read to the Azure Activity Log. Useful for incident investigation — see who/what accessed which secret when.</p>

          <p>For continuous monitoring, send activity logs to Azure Log Analytics + alert on patterns (unexpected principal IDs, off-hours access, etc.).</p>
        </section>

        <hr />

        {/* SECTION 7 — SECRET NAMES */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Secret-Name Normalization</h2>
          <p>The fleet's Bicep converts underscores to hyphens. There's a rule behind it.</p>

          <CodePre>{`'@Microsoft.KeyVault(SecretUri=\${keyVaultUriComputed}secrets/\${replace(secretName, '_', '-')}/)'`}</CodePre>

          <h3>The constraint</h3>
          <p>Key Vault secret names must match the regex <code>^[0-9a-zA-Z-]+$</code>. Allowed:</p>
          <ul>
            <li>Letters (a-z, A-Z)</li>
            <li>Digits (0-9)</li>
            <li>Hyphens (-)</li>
          </ul>

          <p>Not allowed:</p>
          <ul>
            <li>Underscores (<code>_</code>)</li>
            <li>Dots, slashes, spaces, brackets, anything else</li>
          </ul>

          <h3>The convention</h3>
          <p>Bash and Node convention is to use UNDERSCORES in env var names: <code>AZURE_OPENAI_API_KEY</code>, <code>DATABASE_URL</code>, etc. KV requires hyphens.</p>

          <p>The fleet's Bicep does the conversion in one direction:</p>
          <ul>
            <li>App Service env var name: <code>AZURE_OPENAI_API_KEY</code> (preserves underscores; your Node code reads <code>process.env.AZURE_OPENAI_API_KEY</code>).</li>
            <li>KV secret name: <code>AZURE-OPENAI-API-KEY</code> (replaced underscores with hyphens; what you store in KV).</li>
          </ul>

          <h3>Adding a new secret — full flow</h3>
          <ol>
            <li>Decide env var name: <code>SENDGRID_API_KEY</code>.</li>
            <li>Convert: KV secret name is <code>SENDGRID-API-KEY</code>.</li>
            <li>Set in KV:
              <CodePre>{`az keyvault secret set \\
  --vault-name kv-pulsewire-prod \\
  --name SENDGRID-API-KEY \\
  --value "SG.xxxxxx"`}</CodePre>
            </li>
            <li>Add to <code>secretAppSettingNames</code> Bicep parameter (or directly in App Service config):
              <CodePre>{`@Microsoft.KeyVault(SecretUri=https://kv-pulsewire-prod.vault.azure.net/secrets/SENDGRID-API-KEY/)`}</CodePre>
            </li>
            <li>Restart App Service to pick up the new env var.</li>
            <li>Test: <code>process.env.SENDGRID_API_KEY</code> should now hold "SG.xxxxxx".</li>
          </ol>

          <h3>Common gotcha</h3>
          <p>
            Don't try to use <code>process.env.SENDGRID-API-KEY</code> in Node — that's a property access on a
            dash-named key (parses as a subtraction). The Bicep already converted underscores; your Node code uses
            the underscore form.
          </p>

          <h3>Naming conventions</h3>
          <p>Beyond the underscore rule, the fleet uses UPPER_SNAKE_CASE for env vars (Bash convention) and UPPER-KEBAB-CASE for KV (mechanical conversion). Don't mix conventions:</p>
          <ul>
            <li><code>DATABASE_URL</code> ✓ (UPPER_SNAKE)</li>
            <li><code>database_url</code> ✗ (lower-snake — works but unconventional)</li>
            <li><code>DatabaseUrl</code> ✗ (PascalCase — unusual for env vars)</li>
          </ul>

          <h3>Long names</h3>
          <p>Secret names can be up to 127 characters. Plenty for any reasonable name. Don't worry about it.</p>

          <h3>What if you accidentally pushed a secret with underscores</h3>
          <p>The Azure CLI rejects it:</p>
          <CodePre>{`az keyvault secret set --name AZURE_OPENAI_API_KEY --value "abc"
# Error: The request URI contains an invalid name. Reserved URL characters
# must be properly escaped.`}</CodePre>

          <p>Fix the name, set again. No partial-state to clean up.</p>
        </section>

        <hr />

        {/* SECTION 8 — LOCAL DEV */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Local-Dev Story</h2>
          <p>Where the fleet is honest: there is no automatic local-dev integration with KV. Developers copy secrets into <code>.env</code> manually.</p>

          <h3>The current fleet pattern</h3>
          <ol>
            <li>Developer needs to run <code>npm run dev</code> locally.</li>
            <li>Looks at <code>.env.example</code> to see what env vars are needed.</li>
            <li>Manually fetches each secret from KV:
              <CodePre>{`az keyvault secret show \\
  --vault-name kv-pulsewire-prod \\
  --name AZURE-OPENAI-API-KEY \\
  --query value -o tsv`}</CodePre>
            </li>
            <li>Copies values into <code>.env</code>.</li>
            <li><code>.env</code> is gitignored — never committed.</li>
            <li>When secrets rotate in prod, developer must manually re-fetch.</li>
          </ol>

          <h3>Why no SDK-based fetch</h3>
          <p>Could the app code fetch secrets at boot via Azure SDK using <code>DefaultAzureCredential</code>? Yes:</p>

          <CodePre>{`// boot-time secret fetcher (not what the fleet does)
import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'

const client = new SecretClient(
  'https://kv-pulsewire-prod.vault.azure.net',
  new DefaultAzureCredential(),
)
process.env.AZURE_OPENAI_API_KEY = (await client.getSecret('AZURE-OPENAI-API-KEY')).value
process.env.DATABASE_URL = (await client.getSecret('DATABASE-URL')).value
// ...
// THEN start the server`}</CodePre>

          <p>This works locally because <code>DefaultAzureCredential</code> tries:</p>
          <ol>
            <li>Env-var credentials</li>
            <li>Workload Identity</li>
            <li>Managed Identity (works in App Service)</li>
            <li>Azure CLI credentials (<code>az login</code>) (works on dev machines)</li>
          </ol>

          <p>So if you've run <code>az login</code>, the SDK uses your developer identity. Same code, both environments. Trade-off: every developer needs <code>az login</code> + role assignment.</p>

          <h3>The flexible-dev pattern (recommended addition)</h3>
          <CodePre>{`// boot.ts
import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
import 'dotenv/config'

const SECRETS = ['AZURE_OPENAI_API_KEY', 'DATABASE_URL', 'SENDGRID_API_KEY']

if (process.env.NODE_ENV === 'development' && process.env.AZURE_OPENAI_API_KEY) {
  // Already in .env — use it
  console.log('Using local .env values')
} else if (process.env.AZURE_KEY_VAULT_URL) {
  // Production OR developer with KV URL set — fetch from KV
  const client = new SecretClient(
    process.env.AZURE_KEY_VAULT_URL,
    new DefaultAzureCredential(),
  )
  for (const name of SECRETS) {
    const kvName = name.replace(/_/g, '-')
    process.env[name] = (await client.getSecret(kvName)).value
  }
}`}</CodePre>

          <p>Now you have three modes:</p>
          <ul>
            <li>Dev with <code>.env</code>: fastest, no Azure calls.</li>
            <li>Dev with <code>AZURE_KEY_VAULT_URL</code> set: uses CLI auth via DefaultAzureCredential.</li>
            <li>App Service prod: uses managed identity via DefaultAzureCredential. (Or: the KV references work directly, this code is a fallback.)</li>
          </ul>

          <h3>The fleet didn't ship this — why</h3>
          <p>
            Honest assessment: it adds two dependencies, a startup latency cost (~200ms to call Azure), and a chunk
            of code. For five hobby apps with infrequent dev, the manual <code>.env</code> approach was acceptable.
            For a team of N developers where rotation is frequent, the SDK fetcher pays for itself.
          </p>

          <h3>Local-dev anti-patterns</h3>
          <ul>
            <li><strong>Committing <code>.env</code> with real values</strong>. The classic. Gitignore from day 1; use git-secrets or pre-commit hooks to catch it.</li>
            <li><strong>Sharing <code>.env</code> via Slack/email</strong>. Each share is another copy outside KV's audit log.</li>
            <li><strong>Using prod secrets in dev</strong>. Dev should hit a separate vault (kv-app-dev) with separate values. Reduces blast radius.</li>
            <li><strong>Hardcoding secrets in tests</strong>. Mock external services in tests; use environment-specific config.</li>
          </ul>

          <h3>Dev/staging/prod vaults</h3>
          <p>The fleet's Bicep is parameterized by environment. Three vaults per app: <code>kv-pulsewire-dev</code>, <code>kv-pulsewire-stg</code>, <code>kv-pulsewire-prod</code>. Each App Service slot points to its own vault. Dev developers have <code>Secrets User</code> on the dev vault only.</p>
        </section>

        <hr />

        {/* SECTION 9 — SDK */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>SDK Path (DefaultAzureCredential)</h2>
          <p>For cases where KV references don't fit, the Azure SDK is the way. Walk through it once so you can use it when needed.</p>

          <h3>Install</h3>
          <CodePre>{`npm install @azure/identity @azure/keyvault-secrets`}</CodePre>

          <h3>The minimal fetcher</h3>
          <CodePre>{`import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'

const url = process.env.AZURE_KEY_VAULT_URL  // https://kv-foo.vault.azure.net
const client = new SecretClient(url, new DefaultAzureCredential())

const secret = await client.getSecret('DATABASE-URL')
console.log(secret.value)  // → "postgresql://..."`}</CodePre>

          <h3>DefaultAzureCredential — the credential chain</h3>
          <p>Tries multiple sources in order, uses the first that works:</p>
          <ol>
            <li><strong>EnvironmentCredential</strong>: <code>AZURE_CLIENT_ID</code> + <code>AZURE_CLIENT_SECRET</code> + <code>AZURE_TENANT_ID</code> env vars.</li>
            <li><strong>WorkloadIdentityCredential</strong>: federated workload identity (AKS pods, GitHub Actions OIDC).</li>
            <li><strong>ManagedIdentityCredential</strong>: App Service / Azure VM managed identity via IMDS.</li>
            <li><strong>AzureCliCredential</strong>: token from <code>az login</code>.</li>
            <li><strong>AzurePowerShellCredential</strong>: token from <code>Connect-AzAccount</code>.</li>
            <li><strong>AzureDeveloperCliCredential</strong>: token from <code>azd auth login</code>.</li>
          </ol>

          <p>So locally with <code>az login</code> AND in App Service, the SAME SDK code works. That's the appeal of <code>DefaultAzureCredential</code>.</p>

          <h3>When to use the SDK instead of references</h3>
          <ul>
            <li><strong>You need to fetch secrets at runtime, not just boot.</strong> Per-request key rotation, dynamic config loading.</li>
            <li><strong>You're using Azure Functions or AKS</strong> — both support KV references via similar mechanisms, but the SDK is more flexible.</li>
            <li><strong>You're already pulling in <code>@azure/identity</code></strong> for other reasons (Storage SDK, Cosmos SDK, etc.).</li>
            <li><strong>You want fine-grained error handling</strong> when a specific secret is missing.</li>
          </ul>

          <h3>Caching</h3>
          <p>The SDK doesn't cache by default. If you call <code>getSecret</code> on every request, you'll make a KV API call every time. Add a simple cache:</p>

          <CodePre>{`const cache = new Map()
const TTL_MS = 5 * 60_000  // 5 minutes

async function getSecret(name) {
  const entry = cache.get(name)
  if (entry && entry.expiresAt > Date.now()) return entry.value
  const fresh = (await client.getSecret(name)).value
  cache.set(name, { value: fresh, expiresAt: Date.now() + TTL_MS })
  return fresh
}`}</CodePre>

          <p>5-minute TTL is a reasonable starting point. Rotation propagation lag goes up by the TTL — pick based on how fast you need rotation to take effect.</p>

          <h3>The cost picture</h3>
          <p>KV charges per 10,000 operations. The fleet's read load: maybe 50 ops per day across all apps. Cost: less than $0.10/month. Don't worry about it.</p>

          <p>Avoid: per-request reads with no cache. At 100 requests/sec, that's 8.6 million ops/day = $25/day = $750/month. Cache.</p>

          <h3>Error handling</h3>
          <CodePre>{`try {
  const secret = await client.getSecret('DATABASE-URL')
  return secret.value
} catch (e) {
  if (e.statusCode === 404) {
    console.error('Secret not found in vault')
  } else if (e.statusCode === 403) {
    console.error('Identity lacks Key Vault Secrets User role')
  } else if (e.statusCode === 401) {
    console.error('Authentication failed (DefaultAzureCredential chain exhausted)')
  } else {
    console.error('Unexpected error:', e)
  }
  throw e
}`}</CodePre>

          <h3>Specific version pinning</h3>
          <CodePre>{`// Get the latest version (most common)
await client.getSecret('DATABASE-URL')

// Get a specific version
await client.getSecret('DATABASE-URL', { version: '1a2b3c4d5e6f' })`}</CodePre>

          <p>Useful for rolling back: if the new version is broken, your app can point to the previous version while you investigate.</p>
        </section>

        <hr />

        {/* SECTION 10 — ROTATION */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Rotation + Versioning</h2>
          <p>Rotation is changing a secret to a new value. Versioning is how KV preserves the history.</p>

          <h3>The basic rotation flow</h3>
          <ol>
            <li>Generate a new value (new API key, new connection string with new password).</li>
            <li>Update the secret in KV:
              <CodePre>{`az keyvault secret set \\
  --vault-name kv-pulsewire-prod \\
  --name DATABASE-URL \\
  --value "postgresql://new-pass@..."`}</CodePre>
            </li>
            <li>App Service auto-refreshes within 24 hours, or you restart to propagate immediately.</li>
            <li>The old value is preserved as a previous VERSION. Still queryable.</li>
            <li>Verify the app is working with the new value.</li>
            <li>If something breaks, you can ROLL BACK by re-pointing the KV reference to the old version explicitly.</li>
          </ol>

          <h3>Why versions matter for rotation</h3>
          <p>Without versions, "update the secret" would be destructive — no way to roll back. Versions preserve the history.</p>

          <CodePre>{`# List all versions of a secret
az keyvault secret list-versions \\
  --vault-name kv-pulsewire-prod \\
  --name DATABASE-URL

# Returns:
# - id: https://kv.../secrets/DATABASE-URL/abc123  (current, created today)
# - id: https://kv.../secrets/DATABASE-URL/def456  (previous, created last month)
# - id: https://kv.../secrets/DATABASE-URL/789xyz  (older, created year ago)`}</CodePre>

          <h3>The pin-to-version trick</h3>
          <p>Normally, KV references use the unversioned URL (<code>.../secrets/DATABASE-URL/</code>), which means "latest version." For a controlled rollout:</p>

          <CodePre>{`@Microsoft.KeyVault(SecretUri=https://kv.../secrets/DATABASE-URL/abc123/)`}</CodePre>

          <p>This pins to version abc123. The app gets THAT value, regardless of what "latest" is. Use cases:</p>
          <ul>
            <li>Blue/green deploys: blue gets latest, green gets pinned-previous.</li>
            <li>Rolling back without re-rotating: point to the previous version.</li>
            <li>Staging vs prod with same vault: staging pins to previous; prod pins to latest after staging validates.</li>
          </ul>

          <p>The fleet doesn't pin versions in practice. The "restart and roll forward" model is simpler.</p>

          <h3>Rotation policies (KV auto-rotation)</h3>
          <p>For some integrations, KV can rotate secrets automatically. The fleet doesn't use this — most fleet secrets are external (Anthropic API keys, Voyage API keys) and KV doesn't know how to rotate them.</p>

          <p>What KV CAN auto-rotate:</p>
          <ul>
            <li>Storage account keys (Azure Storage)</li>
            <li>SQL Server admin password (via Azure SQL automation)</li>
            <li>Self-signed certificates (auto-renewal)</li>
          </ul>

          <p>For external secrets, automation lives elsewhere (GitHub Actions, Azure Logic Apps, manual ops).</p>

          <h3>Rotation cadence</h3>
          <p>Fleet practice:</p>
          <ul>
            <li><strong>API keys</strong>: rotate on incident only (key suspected leaked). Otherwise indefinite.</li>
            <li><strong>Database passwords</strong>: rotate quarterly (just in case).</li>
            <li><strong>Session JWT secret</strong>: rotate annually + on credential incident.</li>
            <li><strong>TLS certs</strong>: auto-rotate (Let's Encrypt + cert-manager or App Service Managed Certs).</li>
          </ul>

          <p>"Rotate everything every 90 days" is theatrical. Rotate when there's a reason — leak, employee leaving, compliance requirement.</p>

          <h3>Disabling a version</h3>
          <CodePre>{`az keyvault secret set-attributes \\
  --vault-name kv-pulsewire-prod \\
  --name DATABASE-URL \\
  --version abc123 \\
  --enabled false`}</CodePre>

          <p>Disabled versions can't be read — even by GetSecret. Useful when a version was compromised. Apps pinned to that version will fail with 403.</p>

          <h3>Expiration</h3>
          <CodePre>{`az keyvault secret set-attributes \\
  --vault-name kv-pulsewire-prod \\
  --name DATABASE-URL \\
  --version abc123 \\
  --expires 2026-12-31T23:59:00Z`}</CodePre>

          <p>Sets a hard expiration. After this date, KV returns 403 on GetSecret. Useful for "this temp credential expires Jan 1" workflows.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Migrate One Secret to KV</h2>
          <p>Take one plain env var in your App Service config, move it to Key Vault, switch to a reference. ~15 minutes of clicking + CLI.</p>

          <h3>Prerequisites</h3>
          <ul>
            <li>An Azure subscription with an App Service running.</li>
            <li><code>az login</code> + appropriate permissions.</li>
            <li>The App Service has at least one env var with a sensitive value you want to move (e.g., <code>OPENAI_API_KEY=sk-...</code>).</li>
          </ul>

          <h3>Step 1 — Create the vault</h3>
          <CodePre>{`az group create -n rg-myapp-prod -l eastus

az keyvault create \\
  --resource-group rg-myapp-prod \\
  --name kv-myapp-prod \\
  --location eastus \\
  --enable-rbac-authorization \\
  --enable-purge-protection \\
  --retention-days 90`}</CodePre>

          <h3>Step 2 — Grant yourself Officer role on the vault</h3>
          <CodePre>{`# Get your principal ID
ME=$(az ad signed-in-user show --query id -o tsv)

# Assign role
az role assignment create \\
  --role "Key Vault Secrets Officer" \\
  --assignee $ME \\
  --scope $(az keyvault show -n kv-myapp-prod --query id -o tsv)`}</CodePre>

          <h3>Step 3 — Put the secret in KV</h3>
          <CodePre>{`# Convert env var name: OPENAI_API_KEY → OPENAI-API-KEY

az keyvault secret set \\
  --vault-name kv-myapp-prod \\
  --name OPENAI-API-KEY \\
  --value "sk-actual-value"`}</CodePre>

          <h3>Step 4 — Enable system-assigned identity on App Service</h3>
          <CodePre>{`az webapp identity assign \\
  --resource-group rg-myapp-prod \\
  --name app-myapp-prod`}</CodePre>

          <p>Note the <code>principalId</code> in the output — you'll use it in step 5.</p>

          <h3>Step 5 — Grant App Service Secrets User on the vault</h3>
          <CodePre>{`APP_PRINCIPAL=$(az webapp identity show \\
  --resource-group rg-myapp-prod \\
  --name app-myapp-prod \\
  --query principalId -o tsv)

az role assignment create \\
  --role "Key Vault Secrets User" \\
  --assignee $APP_PRINCIPAL \\
  --scope $(az keyvault show -n kv-myapp-prod --query id -o tsv)`}</CodePre>

          <h3>Step 6 — Replace the env var with a KV reference</h3>
          <CodePre>{`VAULT_URL=$(az keyvault show -n kv-myapp-prod --query properties.vaultUri -o tsv)

az webapp config appsettings set \\
  --resource-group rg-myapp-prod \\
  --name app-myapp-prod \\
  --settings OPENAI_API_KEY="@Microsoft.KeyVault(SecretUri=\${VAULT_URL}secrets/OPENAI-API-KEY/)"`}</CodePre>

          <h3>Step 7 — Restart and verify</h3>
          <CodePre>{`az webapp restart \\
  --resource-group rg-myapp-prod \\
  --name app-myapp-prod`}</CodePre>

          <p>Check the App Service Configuration → Environment variables blade. The setting <code>OPENAI_API_KEY</code> should show with a "Source" of "Key Vault Reference" and status "Resolved." Your app should be working.</p>

          <h3>Step 8 — Verify access logging</h3>
          <CodePre>{`# See the App Service's recent secret reads
az monitor activity-log list \\
  --resource-id $(az keyvault show -n kv-myapp-prod --query id -o tsv) \\
  --offset 1h \\
  --query "[?operationName.value=='Microsoft.KeyVault/vaults/secrets/getSecret/action'].{caller:caller, time:eventTimestamp}"`}</CodePre>

          <p>You should see the App Service managed identity reading the secret.</p>

          <h3>Step 9 — Rotate the secret (verify the workflow)</h3>
          <CodePre>{`az keyvault secret set \\
  --vault-name kv-myapp-prod \\
  --name OPENAI-API-KEY \\
  --value "sk-newly-rotated-value"

az webapp restart \\
  --resource-group rg-myapp-prod \\
  --name app-myapp-prod`}</CodePre>

          <p>The app should now use the new value. Try with a deliberately broken value to see what happens on bad rotation (your app fails with 401 from the upstream API — useful to plan for).</p>

          <h3>Extensions</h3>
          <ul>
            <li>Add a second secret. Generalize to a "move all secrets" script.</li>
            <li>Pin one reference to a specific version. Roll back to the previous value.</li>
            <li>Disable a version. See the app fail.</li>
            <li>Configure activity log alerts that fire on unexpected secret access.</li>
            <li>Add a SECOND vault for staging. Try cross-vault access (should fail; scope is per-vault).</li>
            <li>Use the SDK approach in app code as a fallback for when KV references fail.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Source not found" in App Service config</h3>
          <ul>
            <li>The vault doesn't exist (typo in the URL).</li>
            <li>The secret doesn't exist in the vault.</li>
            <li>The vault name resolves to a soft-deleted state (deleted then re-created without recovery).</li>
          </ul>

          <p>Verify with <code>az keyvault secret show -n &lt;name&gt; --vault-name &lt;vault&gt;</code>.</p>

          <h3>"Access denied" in App Service config</h3>
          <p>The App Service managed identity doesn't have <code>Key Vault Secrets User</code> on this vault. Check:</p>
          <CodePre>{`az role assignment list \\
  --scope $(az keyvault show -n kv-myapp-prod --query id -o tsv)`}</CodePre>

          <p>Look for the App Service's principal ID. If absent, re-run the role assignment step.</p>

          <h3>"My app says env var is literally @Microsoft.KeyVault(...)"</h3>
          <p>The reference didn't resolve. Three possible reasons:</p>
          <ul>
            <li>App Service didn't restart after you changed the setting.</li>
            <li>The reference syntax is malformed (missing closing paren, wrong URL).</li>
            <li>Resolution succeeded but App Service is showing the source value for some reason. Hit the live env via <code>printenv</code> in Kudu.</li>
          </ul>

          <h3>"The secret name has an underscore so KV won't accept it"</h3>
          <p>Convert underscores to hyphens for the KV name. Keep underscores in the App Service env var name. The reference URL holds the KV name (hyphens).</p>

          <h3>"I can't delete the vault"</h3>
          <p>Purge protection. You can't permanently delete during the 90-day retention. Soft delete works, but the name stays reserved.</p>

          <p>For test/throwaway vaults, omit purge protection. For production, embrace the 90-day cost of intentionality.</p>

          <h3>"I want to delete a soft-deleted secret right now"</h3>
          <p>You can't. Purge protection. Wait 90 days. OR roll the value (set a NEW value on the SAME secret name) which essentially deprecates the old.</p>

          <h3>"My App Service is in region A, my KV in region B"</h3>
          <p>Works fine, slightly higher latency on the first resolve. Not enough to worry about. For low-traffic apps it's invisible.</p>

          <h3>"DefaultAzureCredential is slow on local dev"</h3>
          <p>The credential chain tries each source in order. On local dev with only <code>az login</code> set up, it tries Environment, Workload, Managed (all fail) before falling to CLI (succeeds). 1-3 seconds of timeout per source.</p>

          <p>Force a specific credential:</p>
          <CodePre>{`import { AzureCliCredential } from '@azure/identity'
const cred = new AzureCliCredential()`}</CodePre>

          <p>Or use the <code>AZURE_USE_PREVIEW_CLI_LOGIN_FLOW</code> env var to skip non-CLI paths.</p>

          <h3>"I rotated the secret but my app is still using the old value"</h3>
          <ul>
            <li>App Service polls every ~24 hours. Restart to force immediate refresh.</li>
            <li>If using the SDK with caching: bust your cache or wait for TTL.</li>
            <li>If using the SDK without caching: should be immediate; if not, the SDK has stale auth token (unlikely).</li>
          </ul>

          <h3>"DefaultAzureCredential fails in CI"</h3>
          <p>CI doesn't have <code>az login</code>. Use Workload Identity (federated credentials with GitHub Actions OIDC) — covered in the Azure DevOps and GitHub Mastery guides.</p>

          <h3>"My quota for vault reads is exhausted"</h3>
          <p>KV soft limits at ~2,000 transactions/10s. You've cached too little. Add a cache layer (5-minute TTL). For pathological cases, request a quota bump.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Bicep: vault</h3>
          <CodePre>{`resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
    networkAcls: { bypass: 'AzureServices', defaultAction: 'Allow' }
  }
}`}</CodePre>

          <h3>Bicep: role assignment</h3>
          <CodePre>{`resource webappKvReader 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, webapp.id, 'KeyVaultSecretsUser')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '4633458b-17de-408a-b874-0445c86b69e6'  // Secrets User
    )
    principalId: webapp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}`}</CodePre>

          <h3>Built-in role IDs</h3>
          <CodePre>{`Key Vault Administrator        00482a5a-887f-4fb3-b363-3b7fe8e74483
Key Vault Secrets Officer      b86a8fe4-44ce-4948-aee5-eccb2c155cd7
Key Vault Secrets User         4633458b-17de-408a-b874-0445c86b69e6  ← APP
Key Vault Reader               21090545-7ca7-4776-b22c-e363652d74d2
Key Vault Crypto Officer       14b46e9e-c2b7-41b4-b07b-48a6ebf60603
Key Vault Crypto User          12338af0-0e69-4776-bea7-57ae8d297424
Key Vault Certificates Officer a4417e6f-fecd-4de8-b567-7b0420556985`}</CodePre>

          <h3>App Service reference syntax</h3>
          <CodePre>{`@Microsoft.KeyVault(SecretUri=https://kv-foo.vault.azure.net/secrets/MY-SECRET/)
@Microsoft.KeyVault(SecretUri=https://kv-foo.vault.azure.net/secrets/MY-SECRET/abc123/)`}</CodePre>

          <h3>Name conversion rule</h3>
          <p>Env var <code>FOO_BAR_BAZ</code> → KV secret <code>FOO-BAR-BAZ</code>. Bicep: <code>replace(name, '_', '-')</code>.</p>

          <h3>Azure CLI essentials</h3>
          <CodePre>{`# Create vault
az keyvault create -g RG -n kv-NAME -l REGION \\
  --enable-rbac-authorization --enable-purge-protection --retention-days 90

# Grant yourself Secrets Officer
az role assignment create --role "Key Vault Secrets Officer" \\
  --assignee $(az ad signed-in-user show --query id -o tsv) \\
  --scope $(az keyvault show -n kv-NAME --query id -o tsv)

# Set / get
az keyvault secret set --vault-name kv-NAME --name SECRET-NAME --value "..."
az keyvault secret show --vault-name kv-NAME --name SECRET-NAME --query value -o tsv

# Enable App Service managed identity
az webapp identity assign -g RG -n APP

# Grant App Service Secrets User
az role assignment create --role "Key Vault Secrets User" \\
  --assignee $(az webapp identity show -g RG -n APP --query principalId -o tsv) \\
  --scope $(az keyvault show -n kv-NAME --query id -o tsv)

# Set KV reference as App Service setting
az webapp config appsettings set -g RG -n APP --settings \\
  MY_ENV_VAR="@Microsoft.KeyVault(SecretUri=https://kv-NAME.vault.azure.net/secrets/MY-SECRET/)"

# Restart to resolve
az webapp restart -g RG -n APP

# List versions
az keyvault secret list-versions --vault-name kv-NAME --name SECRET-NAME

# Recover deleted
az keyvault secret list-deleted --vault-name kv-NAME
az keyvault secret recover --vault-name kv-NAME --name SECRET-NAME`}</CodePre>

          <h3>SDK alternative</h3>
          <CodePre>{`import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'

const client = new SecretClient(
  process.env.AZURE_KEY_VAULT_URL,
  new DefaultAzureCredential(),
)
const secret = await client.getSecret('MY-SECRET')`}</CodePre>

          <h3>DefaultAzureCredential chain</h3>
          <ol>
            <li>EnvironmentCredential (AZURE_CLIENT_ID + AZURE_CLIENT_SECRET)</li>
            <li>WorkloadIdentityCredential (federated identity)</li>
            <li>ManagedIdentityCredential (App Service IMDS)</li>
            <li>AzureCliCredential (<code>az login</code>)</li>
            <li>AzurePowerShellCredential</li>
            <li>AzureDeveloperCliCredential</li>
          </ol>

          <h3>The discipline</h3>
          <ul>
            <li>RBAC mode, never access policies.</li>
            <li>Soft delete + purge protection on for production vaults.</li>
            <li>Scope role assignments to a single vault.</li>
            <li>System-assigned managed identity for the app (simpler than user-assigned).</li>
            <li>Env vars stay underscored; KV names use hyphens; Bicep does the conversion.</li>
            <li>App Service restart to propagate rotated secrets quickly.</li>
            <li>Cache SDK reads (5-min TTL) to avoid quota issues.</li>
            <li>Pin version only for controlled rollouts.</li>
            <li>Activity log → Log Analytics for audit.</li>
            <li>Local dev: manual <code>.env</code> OR SDK with <code>az login</code>.</li>
          </ul>

          <h3>The fleet pattern in one picture</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  D[Dev sets secret via az CLI] --> KV[Key Vault]
  B[Bicep deploys App Service<br/>with KV refs as env var values] --> AS[App Service]
  AS -->|system-assigned identity| KV
  KV -->|secret value| AS
  AS -->|process.env.X| APP[Node app]
  style KV fill:#5C2A4A,color:#fff`} />
        </section>
      </main>
    </div>
  );
}
