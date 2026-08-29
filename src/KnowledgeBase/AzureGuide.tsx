import { useEffect, useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../app/storage/scopedStorage';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Azure foundations',          icon: '🏛️' },
  { id: 's2',  num: '2',  title: 'Identity & Auth',            icon: '🔐' },
  { id: 's3',  num: '3',  title: 'Choosing a hosting target',  icon: '🎯' },
  { id: 's4',  num: '4',  title: 'Azure Container Registry',   icon: '📦' },
  { id: 's5',  num: '5',  title: 'DNS, domains, TLS',          icon: '🌐' },
  { id: 's6',  num: '6',  title: 'Storage & Databases',        icon: '💾' },
  { id: 's7',  num: '7',  title: 'CI/CD with GitHub',          icon: '🚀' },
  { id: 's8',  num: '8',  title: 'Migration playbook',         icon: '🧭' },
  { id: 's9',  num: '9',  title: 'New app from scratch',       icon: '✨' },
  { id: 's10', num: '10', title: 'Operations',                 icon: '🛠️' },
  { id: 's11', num: '11', title: 'Troubleshooting',            icon: '🩺' },
  { id: 's12', num: '12', title: 'CLI cheat sheet',            icon: '📋' },
  { id: 's13', num: 'A',  title: 'Glossary',                   icon: '📚' },
];

const CHECKLIST_STORAGE_KEY = 'azure-guide-checks';

const MIGRATION_PREFLIGHT_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm1', label: <>Identify all secrets in each app's <code>.env</code> on the home PC</> },
  { id: 'm2', label: <>Confirm GLP1 + ShopKeep app registrations live in tenant <code>52188f12-...</code> (Entra → App registrations)</> },
  { id: 'm3', label: <>Pick an ACR name (lowercase alphanumeric, 5–50 chars, globally unique)</> },
  { id: 'm4', label: <>Fill all placeholders in <code>main.bicepparam</code></> },
  { id: 'm5', label: <>Fix shopkeep var names in <code>main.bicepparam</code> (see MIGRATION_PLAN.md "Known fixes")</> },
  { id: 'm6', label: <>Add <code>.dockerignore</code> to each repo (don't bake DBs into images)</> },
  { id: 'm7', label: <>Snapshot current SQLite files on the home PC (stop containers, copy <code>*.db</code>, <code>*-shm</code>, <code>*-wal</code>)</> },
];
const MIGRATION_PROVISION_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm10', label: <><code>az login</code> on the right subscription</> },
  { id: 'm11', label: <><code>az group create</code> (done — <code>rg-personal-apps-prod</code> exists)</> },
  { id: 'm12', label: <>Run <code>deploy.ps1</code> → creates ACR, plan, 3 web apps, AcrPull role bindings</> },
  { id: 'm13', label: <>Verify with <code>az webapp list -g rg-personal-apps-prod -o table</code></> },
];
const MIGRATION_BUILD_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm20', label: <><code>az acr build</code> workshop image</> },
  { id: 'm21', label: <><code>az acr build</code> shopkeep image (with Vite build args)</> },
  { id: 'm22', label: <><code>az acr build</code> glp1 image (with Vite build args)</> },
];
const MIGRATION_SECRETS_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm30', label: <>Set <code>ANTHROPIC_API_KEY</code> on workshop (optional)</> },
  { id: 'm31', label: <>Set <code>ANTHROPIC_API_KEY</code> on shopkeep</> },
  { id: 'm32', label: <>Set <code>ANTHROPIC_API_KEY</code> on glp1</> },
  { id: 'm33', label: <>(Optional) Migrate raw secrets to Key Vault references</> },
];
const MIGRATION_DATA_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm40', label: <>Stop each Web App before copying data</> },
  { id: 'm41', label: <>Copy workshop <code>workshop.db*</code> + <code>uploads/</code> → <code>/home/data/</code> via Kudu</> },
  { id: 'm42', label: <>Copy shopkeep <code>*.db*</code> → <code>/home/data/</code></> },
  { id: 'm43', label: <>Copy glp1 legacy <code>glp1.db*</code> OR per-user <code>users/*.db*</code> → <code>/home/data/</code> resp. <code>/home/data/users/</code></> },
  { id: 'm44', label: <>Restart each Web App and verify data via <code>/api/health</code> + sign-in</> },
];
const MIGRATION_SMOKE_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm50', label: <>Sign in to each app on <code>https://&lt;app&gt;.azurewebsites.net</code></> },
  { id: 'm51', label: <>Add Entra app registration's <code>azurewebsites.net</code> URL as a temporary redirect URI</> },
  { id: 'm52', label: <>Verify existing data appears for each user</> },
  { id: 'm53', label: <>Test a write (creates a new row); confirm it persists across restart</> },
];
const MIGRATION_DOMAIN_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm60', label: <>Add CNAME at DNS host (<code>workshop → app-workshop-prod-xxx.azurewebsites.net</code>)</> },
  { id: 'm61', label: <>Add ASUID TXT record</> },
  { id: 'm62', label: <><code>az webapp config hostname add</code> → <code>ssl create</code> → <code>ssl bind</code></> },
  { id: 'm63', label: <>Verify <code>https://workshop.enzolopez.net</code> serves over App Service</> },
  { id: 'm64', label: <>Repeat for shopkeep / glp1 subdomains</> },
];
const MIGRATION_CUTOVER_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'm70', label: <>Watch logs and Application Insights for 48h before retiring home PC</> },
  { id: 'm71', label: <>Disable IIS ARR rules for the three subdomains</> },
  { id: 'm72', label: <>Stop Docker containers on home PC</> },
  { id: 'm73', label: <>Schedule weekly SQLite backup (cron in app OR manual Kudu download)</> },
  { id: 'm74', label: <>Set up Cost Management budget alert at $100/mo</> },
];

const SCRATCH_DAY0_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's1', label: <>Answer the 8 questions in "Decide before writing a single line of code" above</> },
  { id: 's2', label: <>Pick app name + subdomain (e.g., <code>myapp</code> / <code>myapp.enzolopez.net</code>)</> },
  { id: 's3', label: <>Pick DB target (default: SQLite-on-/home)</> },
  { id: 's4', label: <>Pick deploy method (default: GH Actions OIDC)</> },
];
const SCRATCH_DAY1_IDENTITY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's10', label: <>Create Entra app registration in tenant <code>52188f12-...</code></> },
  { id: 's11', label: <>Set redirect URIs: <code>https://&lt;app&gt;.azurewebsites.net</code> + <code>https://myapp.enzolopez.net</code> (and <code>http://localhost:5173</code> for dev)</> },
  { id: 's12', label: <>Expose an API: Application ID URI = <code>api://&lt;client-id&gt;</code></> },
  { id: 's13', label: <>Note client ID + tenant ID for later</> },
];
const SCRATCH_DAY1_INFRA_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's20', label: <>Add a new entry in <code>main.bicepparam</code>'s <code>apps</code> array (name, image, port, settings)</> },
  { id: 's21', label: <>Re-run <code>deploy.ps1</code> — idempotent, only the new Web App is added</> },
  { id: 's22', label: <>If using a new DB: provision Azure SQL / Postgres in same RG</> },
];
const SCRATCH_DAY2_CODE_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's30', label: <>Scaffold Express + Vite + MSAL using one of your existing apps as a template</> },
  { id: 's31', label: <>Configure <code>better-sqlite3</code> with WAL mode and <code>/home/data/&lt;name&gt;.db</code></> },
  { id: 's32', label: <>Implement <code>/api/health</code> endpoint (200 OK + DB ping)</> },
  { id: 's33', label: <>Wire MSAL + jose token validation following the workshop pattern</> },
  { id: 's34', label: <>Write Dockerfile (copy the workshop one, adjust port)</> },
  { id: 's35', label: <>Add <code>.dockerignore</code></> },
];
const SCRATCH_DAY2_CI_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's40', label: <>Push code to GitHub (private repo)</> },
  { id: 's41', label: <>Create OIDC federated credential trusting <code>repo:user/myapp:ref:refs/heads/main</code></> },
  { id: 's42', label: <>Add <code>AZURE_CLIENT_ID</code>, <code>AZURE_TENANT_ID</code>, <code>AZURE_SUBSCRIPTION_ID</code> as GitHub secrets</> },
  { id: 's43', label: <>Copy the workflow template from <code>.github/workflows/deploy.yml</code> in workshop</> },
  { id: 's44', label: <>First push to main → confirm CI builds + deploys</> },
];
const SCRATCH_DAY3_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's50', label: <>Smoke test on <code>https://&lt;app&gt;.azurewebsites.net</code></> },
  { id: 's51', label: <>Add custom domain + cert</> },
  { id: 's52', label: <>Update Entra redirect URIs to include the custom domain</> },
  { id: 's53', label: <>Enable Application Insights</> },
  { id: 's54', label: <>Add budget alert if this is the first new resource in a while</> },
];

function useChecklist(prefix: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}');
      return stored[prefix] ?? {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}');
      all[prefix] = checked;
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  }, [checked, prefix]);
  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));
  return { checked, toggle };
}

function Checklist({ prefix, items }: { prefix: string; items: { id: string; label: React.ReactNode }[] }) {
  const { checked, toggle } = useChecklist(prefix);
  return (
    <ul className="checklist">
      {items.map(item => (
        <li key={item.id} className={checked[item.id] ? 'checked' : ''} onClick={() => toggle(item.id)}>
          <div className="cb" />
          <span className="cb-label">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

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

function PathTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find(t => t.id === active);
  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            className={`tab-btn ${active === t.id ? 'active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-panel">{current?.content}</div>
    </div>
  );
}

export default function AzureGuide() {
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
            <span className="sidebar-title">Azure Hosting Guide</span>
          </div>
          <div className="sidebar-sub">App Service · Bicep · CI/CD</div>
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
          <div className="hero-tag">☁️ Azure Guide · 2026</div>
          <h1>Hosting Apps<br />on Azure</h1>
          <p>
            Hosting Node + SQLite + Entra ID apps on <strong style={{ color: '#C77AA0' }}>Azure App Service</strong>{' '}
            with ACR, optional Postgres/SQL/Cosmos, GitHub Actions CI/CD, and a clean migration path off a home PC.
            Tailored to <code>workshop</code>, <code>shopkeep</code>, <code>glp1</code>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">12</span><span className="hero-stat-label">Chapters</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~$18</span><span className="hero-stat-label">/mo target</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Apps</span></div>
            <div className="hero-stat"><span className="hero-stat-val">B1</span><span className="hero-stat-label">Plan SKU</span></div>
          </div>
        </div>

        {/* SECTION 1 — FOUNDATIONS */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>Azure foundations</h2>

          <h3>Tenants, subscriptions, resource groups</h3>
          <p>Azure has a four-level identity-and-billing hierarchy. Understanding it makes every later decision easier.</p>

          <MermaidDiagram theme="default" chart={`graph TD
  T["Tenant (Entra ID directory)<br/>identity boundary"] --> S1["Subscription A<br/>billing + quota boundary"]
  T --> S2["Subscription B"]
  S1 --> RG1["Resource Group: rg-personal-apps-prod<br/>lifecycle + RBAC boundary"]
  S1 --> RG2["Resource Group: rg-sandbox"]
  RG1 --> ACR["Azure Container Registry"]
  RG1 --> PLAN["App Service Plan"]
  RG1 --> APP1["Web App: workshop"]
  RG1 --> APP2["Web App: shopkeep"]
  RG1 --> APP3["Web App: glp1"]
  style T fill:#1e3a5f,stroke:#4f9eff,color:#fff
  style S1 fill:#1f3a2f,stroke:#6fdc8c,color:#fff
  style RG1 fill:#3a2f1f,stroke:#ffb454,color:#fff`} />

          <table>
            <tbody>
              <tr><th>Layer</th><th>What it is</th><th>Your value</th></tr>
              <tr><td><strong>Tenant</strong></td><td>An Entra ID (formerly Azure AD) directory. Users, groups, service principals, app registrations all live here. Identity is scoped to the tenant.</td><td>Subscription tenant: <code>de625678-c55b-4494-9558-14946cbb6133</code><br />App-registration tenant: <code>52188f12-db6b-46c6-88ff-08c802f0ed3b</code></td></tr>
              <tr><td><strong>Subscription</strong></td><td>The billing container. Quotas, spending limits, and credits attach here. A subscription is bound to exactly one tenant.</td><td><code>1cf02211-…</code> Visual Studio Enterprise ($150/mo credit)</td></tr>
              <tr><td><strong>Resource Group (RG)</strong></td><td>A logical folder for related resources. Resources can only belong to one RG. RGs are the natural unit for RBAC, lifecycle (delete the RG → delete everything), and ARM/Bicep deployments.</td><td><code>rg-personal-apps-prod</code></td></tr>
              <tr><td><strong>Resource</strong></td><td>The actual thing (Web App, DB, Key Vault…). Has a region. Has its own RBAC. Has a globally-unique URI (the <code>resourceId</code>).</td><td>see ACR / Plan / Web App sections below</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The two-tenant gotcha (yours).</strong> Your Entra <em>app registrations</em> (the things MSAL talks to) live in a different tenant than the subscription that pays for compute. This is fine — your code already uses tenant <code>52188f12-...</code> for authority, and <code>az</code> uses tenant <code>de625678-...</code> for deployments. Just remember: when filling <code>AZURE_TENANT_ID</code> / <code>AAD_TENANT_ID</code> in app settings, use <code>52188f12-...</code>. Don't confuse it with the value <code>az account show</code> reports.</div>
          </div>

          <h4>Why RGs matter operationally</h4>
          <ul>
            <li><strong>Cost grouping:</strong> the cost analysis blade can filter by RG, so co-locating related resources gives you per-app cost totals.</li>
            <li><strong>Lifecycle:</strong> <code>az group delete --name rg-x --yes</code> tears down everything in one command. Useful for dev RGs, dangerous for prod.</li>
            <li><strong>RBAC inheritance:</strong> a role assigned at the RG flows down to every resource inside it. Grants are simpler than per-resource.</li>
            <li><strong>Deployment scope:</strong> Bicep / ARM templates typically deploy at the RG scope (<code>az deployment group create</code>). The <code>main.bicep</code> in this folder is RG-scoped.</li>
          </ul>

          <h3>Regions and availability</h3>
          <p>Every resource (except global ones like Entra and DNS) has a region. Pick one and stick with it for an app — cross-region traffic is slower and sometimes billable.</p>
          <ul>
            <li><strong>Pick a region close to users.</strong> For personal/family use on the US east coast: <code>eastus</code> or <code>eastus2</code>. West coast: <code>westus3</code>. Middle: <code>centralus</code>. You're in <code>eastus</code>.</li>
            <li><strong>Free managed certs</strong> for App Service custom domains are available in most regions including <code>eastus</code>.</li>
            <li><strong>Service availability</strong> varies. New SKUs (e.g., Cosmos DB serverless v2 features, Postgres Flexible newer versions) sometimes roll out to <code>eastus2</code> before <code>eastus</code>. Check before assuming.</li>
            <li><strong>Paired regions:</strong> Microsoft pairs regions for cross-region replication (e.g., <code>eastus ↔ westus</code>). Relevant for geo-redundant backups, not your current scale.</li>
          </ul>

          <h3>Naming conventions</h3>
          <p>Azure naming has constraints that bite. A loose convention now saves hours later.</p>
          <table>
            <tbody>
              <tr><th>Resource</th><th>Pattern</th><th>Rules</th><th>Example</th></tr>
              <tr><td>Resource Group</td><td><code>rg-&lt;purpose&gt;-&lt;env&gt;</code></td><td>Up to 90 chars, mostly anything goes</td><td><code>rg-personal-apps-prod</code></td></tr>
              <tr><td>App Service Plan</td><td><code>plan-&lt;env&gt;-&lt;suffix&gt;</code></td><td>Unique within RG</td><td><code>plan-prod-x7q2k4</code></td></tr>
              <tr><td>Web App</td><td><code>app-&lt;name&gt;-&lt;env&gt;-&lt;suffix&gt;</code></td><td><strong>Globally unique</strong> (becomes part of <code>*.azurewebsites.net</code>), 2–60 chars, alphanumeric + hyphens</td><td><code>app-workshop-prod-x7q2k4</code></td></tr>
              <tr><td>Container Registry</td><td><code>acr&lt;name&gt;&lt;suffix&gt;</code></td><td><strong>Globally unique</strong>, 5–50 chars, <em>lowercase alphanumeric only</em> (no hyphens)</td><td><code>acrenzolopez01</code></td></tr>
              <tr><td>Key Vault</td><td><code>kv-&lt;name&gt;-&lt;suffix&gt;</code></td><td>Globally unique, 3–24 chars</td><td><code>kv-enzo-prod-01</code></td></tr>
              <tr><td>Storage account</td><td><code>st&lt;name&gt;&lt;suffix&gt;</code></td><td>Globally unique, 3–24 chars, lowercase alphanumeric only</td><td><code>stenzobackups01</code></td></tr>
              <tr><td>SQL server</td><td><code>sql-&lt;name&gt;-&lt;suffix&gt;</code></td><td>Globally unique, 1–63 chars</td><td><code>sql-enzo-prod-01</code></td></tr>
            </tbody>
          </table>
          <p>The Bicep in this folder uses <code>uniqueString(resourceGroup().id)</code> as a deterministic suffix — re-running the deployment into the same RG produces the same names, but a new RG produces fresh ones, avoiding collisions.</p>

          <h3>How billing works</h3>
          <p>Azure bills by the second (or minute) for most compute, by the GB-month for most storage, and by the request/operation for many platform features.</p>

          <h4>Where your money will go (estimated, monthly, for the 3-app stack)</h4>
          <table>
            <tbody>
              <tr><th>Item</th><th>Why it costs</th><th>Est. monthly</th></tr>
              <tr><td>App Service Plan B1 (Linux)</td><td>One always-on Linux VM (1 vCPU, 1.75 GB RAM) regardless of how many Web Apps are on it</td><td>~$13</td></tr>
              <tr><td>App Service Plan P0v3 (Linux)</td><td>Dedicated 1 vCPU, 4 GB RAM, better cold-start</td><td>~$60</td></tr>
              <tr><td>ACR Basic</td><td>Up to 10 GB of images, 2 webhooks</td><td>~$5</td></tr>
              <tr><td>Egress bandwidth</td><td>First 100 GB/mo free; beyond ~$0.087/GB</td><td>~$0 (personal)</td></tr>
              <tr><td>Azure DNS zone (optional)</td><td>Per zone if you host DNS in Azure</td><td>~$0.50</td></tr>
              <tr><td>Application Insights</td><td>First 5 GB/mo free</td><td>~$0</td></tr>
              <tr><td>Key Vault</td><td>$0.03 per 10k operations</td><td>~$0.05</td></tr>
              <tr><td>Azure SQL serverless (if added)</td><td>vCore-seconds when active; auto-pauses</td><td>~$5–$15</td></tr>
              <tr><td>Postgres Flexible Burstable B1ms (if added)</td><td>1 vCore, 2 GB RAM, no auto-pause</td><td>~$15</td></tr>
            </tbody>
          </table>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>Your $150/mo VS Enterprise credit.</strong> Easily covers all three apps on B1, ACR Basic, and a hobbyist DB. You won't hit the cap unless you accidentally provision a Premium plan or a high-tier SQL/Cosmos. Set a budget alert (Cost Management → Budgets) at $100 to get an email if something slips.</div>
          </div>

          <h4>The "always on" cost</h4>
          <p>An App Service Plan bills <em>continuously</em> while it exists, whether or not your Web Apps are receiving requests. Stopping a Web App does <strong>not</strong> stop the plan's billing. To stop billing, delete the plan (or scale it down to <code>F1</code> Free, which has hard limits).</p>

          <h3>Portal vs CLI vs Bicep vs Terraform — when to use which</h3>
          <PathTabs
            tabs={[
              {
                id: 'portal',
                label: 'Portal',
                content: (
                  <>
                    <p><strong>Use for:</strong> exploration, one-off inspection, reading logs, viewing cost charts, RBAC tweaks, debugging.</p>
                    <p><strong>Don't use for:</strong> provisioning anything you'll need to recreate. Portal-clicked resources have no source of truth — you'll forget how you built them.</p>
                  </>
                ),
              },
              {
                id: 'cli',
                label: 'az CLI',
                content: (
                  <>
                    <p><strong>Use for:</strong> imperative one-shot commands, scripts, anything you'd type more than once. <code>az</code> is cross-platform, fully scriptable, and authenticates against your current account.</p>
                    <p><code>az login</code> → <code>az account set -s &lt;sub-id&gt;</code> → run commands. State is in the cloud; the CLI just makes API calls.</p>
                  </>
                ),
              },
              {
                id: 'bicep',
                label: 'Bicep',
                content: (
                  <>
                    <p><strong>Use for:</strong> declarative infra you want versioned. Bicep is the Azure-native DSL that compiles to ARM JSON; it's first-class, supported by Microsoft, no extra accounts or backends needed.</p>
                    <p><strong>How it works:</strong> you describe desired state; <code>az deployment group create</code> diffs against current state and converges. Idempotent — re-running is safe.</p>
                    <p>This guide and the <code>main.bicep</code> in the repo use this approach.</p>
                  </>
                ),
              },
              {
                id: 'tf',
                label: 'Terraform',
                content: (
                  <>
                    <p><strong>Use for:</strong> multi-cloud or org-wide infra where Terraform's broader ecosystem matters. For single-cloud (Azure-only) personal setups, Bicep is simpler and ships with <code>az</code>.</p>
                    <p>Skip Terraform here. It adds a state backend (Azure Storage or HCP) and extra learning curve for no benefit at your scale.</p>
                  </>
                ),
              },
            ]}
          />

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Rule of thumb.</strong> <strong>Bicep</strong> for resources you provision. <strong>az CLI</strong> for operational tasks (deploy code, copy data, restart, view logs). <strong>Portal</strong> for inspection and emergency fixes.</div>
          </div>
        </section>

        <hr />

        {/* SECTION 2 — IDENTITY & AUTH */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Identity &amp; Auth</h2>

          <h3>Entra ID, app registrations, MSAL</h3>
          <p>
            <dfn title="Microsoft Entra ID — Microsoft's identity-as-a-service platform, formerly known as Azure Active Directory (Azure AD)">
              Microsoft Entra ID
            </dfn>{' '}
            is the identity layer behind nearly everything in Azure and Microsoft 365. Your three apps all use it for sign-in.
          </p>

          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User browser
  participant FE as React frontend (MSAL.js)
  participant E as Entra ID (login.microsoftonline.com)
  participant BE as Express backend
  U->>FE: visits workshop.enzolopez.net
  FE->>E: redirect to /authorize?client_id=...&tenant=52188f12...
  E->>U: prompts for sign-in (if not cached)
  U->>E: credentials
  E->>FE: redirect back with id_token + access_token
  FE->>BE: API call with Authorization: Bearer <token>
  BE->>BE: verify token (jose) — checks tid, aud, signature, exp
  BE->>FE: response`} />

          <h4>The pieces involved</h4>
          <table>
            <tbody>
              <tr><th>Concept</th><th>What it is</th><th>Where it lives</th></tr>
              <tr><td>Tenant ID</td><td>GUID identifying the Entra directory</td><td><code>AZURE_TENANT_ID</code> / <code>AAD_TENANT_ID</code> env var; baked into MSAL <code>authority</code></td></tr>
              <tr><td>App registration</td><td>The "identity" of your app inside Entra. Has client ID, redirect URIs, exposed scopes, allowed roles.</td><td>Created in portal: Entra → App registrations</td></tr>
              <tr><td>Client ID (a.k.a. application ID)</td><td>GUID identifying the app registration</td><td><code>AAD_CLIENT_ID</code> / <code>VITE_*_CLIENT_ID</code></td></tr>
              <tr><td>Redirect URI</td><td>Where Entra sends the user back after sign-in. Must exactly match (incl. scheme, host, port).</td><td>App registration → Authentication blade</td></tr>
              <tr><td>API audience</td><td>The identifier of the backend API the access token is for. For your apps, often the same as client ID with a URI prefix.</td><td><code>API_AUDIENCE</code> env var; backend verifies it</td></tr>
              <tr><td>oid (object ID)</td><td>Per-user GUID. Unique per user per tenant. Your apps key per-user SQLite DBs by this.</td><td>Claim inside the ID token</td></tr>
            </tbody>
          </table>

          <h4>How your apps validate tokens (the pattern)</h4>
          <p>Every backend uses <code>jose</code> to verify incoming bearer tokens:</p>
          <ol>
            <li>Fetch the tenant's public signing keys from <code>https://login.microsoftonline.com/&lt;tenant&gt;/discovery/v2.0/keys</code> (cached).</li>
            <li>Verify JWT signature against those keys.</li>
            <li>Check <code>iss</code> matches the expected tenant.</li>
            <li>Check <code>aud</code> matches your API audience.</li>
            <li>Check <code>exp</code> isn't past.</li>
            <li>Extract <code>oid</code> for per-user routing/DB selection.</li>
          </ol>
          <p>This is stateless — no session storage on the server. The token <em>is</em> the session.</p>

          <h4>Single-tenant vs multi-tenant</h4>
          <p>Your apps are single-tenant — only users in tenant <code>52188f12-...</code> can sign in. The backend rejects any token whose <code>tid</code> doesn't match. This is the right choice for personal apps. Multi-tenant adds complexity (tenant ID becomes part of the routing, you must validate each tenant's signing keys, etc.).</p>

          <h3>Managed Identity — the right way to authenticate Azure-to-Azure</h3>
          <p>Whenever one Azure resource talks to another (Web App → ACR, Web App → Key Vault, Web App → SQL), you have three credential options:</p>

          <PathTabs
            tabs={[
              {
                id: 'mi',
                label: 'Managed Identity ✅',
                content: (
                  <>
                    <p>Azure assigns the resource its own identity in Entra. No secrets to store, no rotation needed. RBAC governs what it can access.</p>
                    <p><strong>System-assigned MI:</strong> tied to the resource lifecycle. Created when you enable it on a Web App; deleted when the Web App is deleted.</p>
                    <p><strong>User-assigned MI:</strong> a standalone identity you can share across multiple resources. Useful when several apps need the same access.</p>
                    <p>Your Bicep gives each Web App a system-assigned MI and grants it <code>AcrPull</code> on the ACR. The Web App pulls images using <em>its own identity</em>, with no admin password.</p>
                  </>
                ),
              },
              {
                id: 'sp',
                label: 'Service Principal',
                content: (
                  <>
                    <p>A "service account" in Entra — has a client ID + client secret (or cert). Older pattern, still used for GitHub Actions before OIDC federation.</p>
                    <p>Downside: you have to store and rotate the secret somewhere.</p>
                  </>
                ),
              },
              {
                id: 'key',
                label: 'API Key / Admin Creds',
                content: (
                  <>
                    <p>The resource has an admin password (ACR admin user, Storage account key, SQL admin login). Easy but every consumer needs a copy of the password.</p>
                    <p><strong>Avoid for production.</strong> Disabled in our Bicep — admin user is off on ACR.</p>
                  </>
                ),
              },
            ]}
          />

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>The MI rule.</strong> Whenever a Web App needs to call another Azure service, the answer is <strong>system-assigned MI + RBAC role assignment</strong>. Never paste keys into app settings if MI is supported.</div>
          </div>

          <h3>RBAC — who can do what</h3>
          <p>Role-Based Access Control governs every Azure operation. There's a built-in catalog of roles; a few you'll use constantly:</p>
          <table>
            <tbody>
              <tr><th>Role</th><th>Grants</th><th>Scope you'd assign at</th></tr>
              <tr><td>Owner</td><td>Full control + delegate</td><td>Subscription (you, by default, as the sub owner)</td></tr>
              <tr><td>Contributor</td><td>Full control, can't delegate</td><td>RG, for collaborators</td></tr>
              <tr><td>Reader</td><td>View-only</td><td>RG, for view-only access</td></tr>
              <tr><td>AcrPull</td><td>Pull images from ACR</td><td>ACR, for Web App MIs</td></tr>
              <tr><td>AcrPush</td><td>Push images</td><td>ACR, for CI pipelines</td></tr>
              <tr><td>Key Vault Secrets User</td><td>Read secret values</td><td>Key Vault, for Web App MIs</td></tr>
              <tr><td>Storage Blob Data Contributor</td><td>R/W to blob containers</td><td>Storage account, if you move uploads to Blob</td></tr>
            </tbody>
          </table>
          <p>Assign roles via Bicep (<code>Microsoft.Authorization/roleAssignments</code>), CLI (<code>az role assignment create</code>), or the portal (IAM blade on any resource).</p>

          <h3>Key Vault — storing secrets properly</h3>
          <p>Right now, your apps' Anthropic keys would land as plain app settings. That works but isn't great. Key Vault adds:</p>
          <ul>
            <li>Encryption at rest with audit trail (who read what, when).</li>
            <li>Rotation without re-deploying.</li>
            <li>Secrets stay out of Bicep parameter files and CI logs.</li>
          </ul>

          <h4>How App Service Key Vault references work</h4>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant App as Web App<br/>(system-assigned MI)
  participant KV as Key Vault
  participant Code as Your code (process.env.X)
  Note over App: App setting X has value:<br/>@Microsoft.KeyVault(VaultName=...;SecretName=anthropic-key)
  App->>KV: fetch secret (using MI token)
  KV->>App: secret value
  App->>Code: env var X = "sk-ant-..."`} />

          <p>Your code still reads <code>process.env.ANTHROPIC_API_KEY</code> — it has no idea Key Vault exists. The App Service runtime resolves the reference on startup (and re-resolves periodically).</p>

          <h4>Setup steps (per secret)</h4>
          <ol>
            <li>Create a Key Vault: <code>az keyvault create -n kv-enzo-prod-01 -g rg-personal-apps-prod -l eastus --enable-rbac-authorization true</code></li>
            <li>Add the secret: <code>az keyvault secret set --vault-name kv-enzo-prod-01 -n anthropic-key --value sk-ant-...</code></li>
            <li>Grant the Web App's MI access:<br /><code>az role assignment create --assignee &lt;web-app-mi-principalId&gt; --role "Key Vault Secrets User" --scope $(az keyvault show -n kv-enzo-prod-01 --query id -o tsv)</code></li>
            <li>Set the app setting to a reference: <code>az webapp config appsettings set -g rg-personal-apps-prod -n &lt;app&gt; --settings ANTHROPIC_API_KEY="@Microsoft.KeyVault(VaultName=kv-enzo-prod-01;SecretName=anthropic-key)"</code></li>
          </ol>
          <p>Check the resolution status in the portal: Web App → Configuration → look for the green "Key Vault reference" badge next to the setting. Red means MI doesn't have permission yet, or the secret name is wrong.</p>
        </section>

        <hr />

        {/* SECTION 3 — HOSTING CHOICE */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Choosing a hosting target</h2>

          <h3>Decision tree</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  Start[Need to host a web app] --> Q1{Have a Dockerfile?}
  Q1 -- No --> AS[App Service code deploy<br/>Node/Python/etc directly]
  Q1 -- Yes --> Q2{Need horizontal scale<br/>or scale-to-zero?}
  Q2 -- No --> Q3{Need persistent local disk<br/>e.g. SQLite, uploads?}
  Q2 -- Yes --> ACA[Container Apps]
  Q3 -- Yes --> ASC["App Service Linux<br/>(Web App for Containers)<br/>✅ your choice"]
  Q3 -- No --> ACA2[Container Apps]
  ASC --> Note["Use /home for state.<br/>Single replica.<br/>Mounted Azure Files works for non-SQLite state."]
  style ASC fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <PathTabs
            tabs={[
              {
                id: 'appsvc',
                label: 'App Service Linux ✅',
                content: (
                  <>
                    <p><strong>What it is:</strong> PaaS hosting for web apps. You give it a container image (or just Node/Python/.NET source) and a port; Azure runs it on a managed Linux VM, fronts it with HTTPS, handles certs, restarts on crash.</p>
                    <p><strong>Strengths:</strong> built-in TLS, free managed certs, custom domains, slot-based deployments, persistent <code>/home</code> filesystem, simplest pricing.</p>
                    <p><strong>Weaknesses:</strong> no per-request scaling (the plan VM is always running). Cold start when scaling. Tied to the plan SKU's resources.</p>
                    <p><strong>Best for:</strong> single-replica apps with state, hobby and small-to-medium production workloads.</p>
                  </>
                ),
              },
              {
                id: 'aca',
                label: 'Container Apps',
                content: (
                  <>
                    <p><strong>What it is:</strong> Managed Kubernetes underneath, but you don't see it. Scales by KEDA (HTTP, queue, cron, …), can go to zero.</p>
                    <p><strong>Strengths:</strong> pay-per-second of actual CPU/RAM use, scale to zero, revisions for blue/green.</p>
                    <p><strong>Weaknesses:</strong> no built-in persistent local disk (you'd mount Azure Files; SQLite over SMB has locking issues). More moving parts.</p>
                    <p><strong>Best for:</strong> stateless APIs, event-driven workloads, anything bursty.</p>
                  </>
                ),
              },
              {
                id: 'aks',
                label: 'AKS',
                content: (
                  <>
                    <p><strong>What it is:</strong> Full Kubernetes. You own the cluster, the node pools, the upgrades, the YAML.</p>
                    <p><strong>Strengths:</strong> ultimate flexibility, multi-tenant, every K8s ecosystem tool works.</p>
                    <p><strong>Weaknesses:</strong> dramatically more operational burden. Cluster control plane is free, but node VMs always cost.</p>
                    <p><strong>Best for:</strong> teams with existing K8s expertise running many services. Not you.</p>
                  </>
                ),
              },
              {
                id: 'vm',
                label: 'VM',
                content: (
                  <>
                    <p><strong>What it is:</strong> A virtual machine you own end-to-end. Like your home PC, in Azure.</p>
                    <p><strong>Strengths:</strong> total control.</p>
                    <p><strong>Weaknesses:</strong> you patch, you back up, you secure. Just moves your home-PC problem to a rented PC.</p>
                    <p><strong>Best for:</strong> apps that can't run in PaaS (legacy Windows services, specific kernel modules). Not yours.</p>
                  </>
                ),
              },
            ]}
          />

          <h3>App Service deep dive</h3>
          <h4>The App Service Plan</h4>
          <p>A <dfn title="Hidden Linux VM (or VMs) that runs your Web Apps. You pay for the plan, not per Web App.">Plan</dfn> is the hidden Linux VM(s) that runs your Web Apps. <strong>You pay for the plan, not per Web App.</strong> Multiple Web Apps share one plan if they share resources — your three apps share one B1 (or P0v3) plan.</p>

          <table>
            <tbody>
              <tr><th>SKU</th><th>vCPU / RAM</th><th>Storage</th><th>Slots</th><th>~$/mo</th><th>Use for</th></tr>
              <tr><td>F1 Free</td><td>shared, 1 GB</td><td>1 GB</td><td>0</td><td>$0</td><td>Hello-world testing only. No always-on, 60min/day limit.</td></tr>
              <tr><td>B1 Basic</td><td>1, 1.75 GB</td><td>10 GB</td><td>0 (no slot swap)</td><td>~$13</td><td>Small personal apps. Your starting point.</td></tr>
              <tr><td>B2</td><td>2, 3.5 GB</td><td>10 GB</td><td>0</td><td>~$26</td><td>If 3 apps strain B1.</td></tr>
              <tr><td>P0v3</td><td>1 dedicated, 4 GB</td><td>250 GB</td><td>5</td><td>~$60</td><td>"Production hobby." Unlocks slots.</td></tr>
              <tr><td>P1v3</td><td>2, 8 GB</td><td>250 GB</td><td>5</td><td>~$120</td><td>Real production.</td></tr>
            </tbody>
          </table>

          <h4>Web App for Containers</h4>
          <p>A Web App is your app on the plan. With "for Containers", you give it a Docker image reference and a port; it runs <code>docker pull</code> + <code>docker run</code> for you.</p>

          <h4>The /home persistent storage</h4>
          <p>Every Web App has a <code>/home</code> directory that:</p>
          <ul>
            <li>Survives container restarts and image redeploys.</li>
            <li>Survives plan SKU changes.</li>
            <li>Is local (not SMB) — fine for SQLite WAL mode.</li>
            <li>Is per-Web-App (not shared across apps in the plan).</li>
            <li>Size: ~10 GB on B1, ~250 GB on P0v3.</li>
          </ul>
          <p>You must set <code>WEBSITES_ENABLE_APP_SERVICE_STORAGE=true</code> for <code>/home</code> to be writable in Linux container apps. The Bicep does this.</p>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Don't store at /.</strong> Anything written outside <code>/home</code> goes into the container's ephemeral layer and disappears at next restart. SQLite files, uploaded blobs, anything that must persist — all under <code>/home</code>.</div>
          </div>

          <h4>App settings (env vars)</h4>
          <p>App settings appear inside the container as environment variables. They're stored encrypted at rest. Changes restart the container automatically. Use <code>az webapp config appsettings set</code> or the Configuration blade.</p>

          <h4>Always On</h4>
          <p>Keeps your app warmed up by pinging the root URL periodically. Without it, the platform unloads idle apps after ~20 min and the next request triggers a cold start. Enable on B1+ (it's free).</p>

          <h4>Slots (Standard+ / P0v3+)</h4>
          <p>A slot is a clone of your Web App with its own URL, its own app settings, and its own image. You deploy to <code>staging</code>, smoke-test, then "swap" to production. The swap is metadata-only — no traffic interruption.</p>

          <MermaidDiagram theme="default" chart={`graph LR
  CI[CI pipeline] -->|deploy image| Staging["Web App: prod slot=staging"]
  Staging -->|smoke test passes| Swap[Swap slots]
  Swap --> Prod["Web App: prod slot=production"]
  style Staging fill:#3a2f1f,stroke:#ffb454,color:#fff
  style Prod fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <p>Slot-sticky app settings (some env vars stay with the slot, others travel with the code) are configured per setting. Useful for connection strings that point to different DBs.</p>
          <p>B1 doesn't support slots. If you need them, upgrade to P0v3.</p>

          <h4>Health checks</h4>
          <p>Configure a path (e.g., <code>/health</code> or <code>/api/health</code>) that returns 200 when healthy. App Service uses it to:</p>
          <ul>
            <li>Restart unhealthy instances.</li>
            <li>Gate slot swaps (won't swap if staging fails).</li>
            <li>Pull instances out of rotation when scaled out.</li>
          </ul>
          <p>All three of your apps already have <code>/api/health</code> endpoints. Use them.</p>
        </section>

        <hr />

        {/* SECTION 4 — ACR */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Azure Container Registry</h2>

          <h3>What ACR does</h3>
          <p>ACR is a private Docker image registry. Your Web Apps pull images from it; you push images to it.</p>

          <MermaidDiagram theme="default" chart={`graph LR
  Dev["Your machine /<br/>GitHub Actions"] -->|az acr build| ACR[(Azure Container Registry)]
  ACR -->|docker pull<br/>via MI| App[App Service Web App]
  style ACR fill:#1e3a5f,stroke:#4f9eff,color:#fff`} />

          <h4>SKUs</h4>
          <table>
            <tbody>
              <tr><th>SKU</th><th>Storage included</th><th>Features</th><th>~$/mo</th></tr>
              <tr><td>Basic</td><td>10 GB</td><td>1 webhook, geo-replication ❌, content trust ❌</td><td>~$5</td></tr>
              <tr><td>Standard</td><td>100 GB</td><td>10 webhooks, faster pulls</td><td>~$20</td></tr>
              <tr><td>Premium</td><td>500 GB</td><td>Geo-replication, content trust, private endpoints, RBAC tokens</td><td>~$135</td></tr>
            </tbody>
          </table>
          <p>Basic is the right choice for your scale. Three Node apps' images total ~500 MB.</p>

          <h4>Authentication options</h4>
          <ul>
            <li><strong>Anonymous pull</strong> — public images. Don't enable for your private images.</li>
            <li><strong>Admin user</strong> — single username/password. Easy but bad. Disabled in our Bicep.</li>
            <li><strong>Service principal</strong> — for CI when MI isn't available.</li>
            <li><strong>Managed identity</strong> ✅ — Web App pulls using its own identity. No secrets.</li>
            <li><strong>OIDC federation</strong> ✅ — GitHub Actions pushes using a federated identity tied to your repo. No client secret in GH.</li>
          </ul>

          <h3>az acr build — server-side Docker</h3>
          <p>You don't need Docker installed locally to build for ACR. <code>az acr build</code> ships your build context (the directory) to Azure and builds the image there using ACR Tasks.</p>

          <CodePre>{`cd Q:\\repo\\workshop
az acr build --registry acrenzolopez01 --image workshop:latest .`}</CodePre>

          <p>For builds that need build args (the Vite-baked GLP1 / ShopKeep AAD vars):</p>

          <CodePre>{`az acr build --registry acrenzolopez01 --image glp1:latest \`
    --build-arg VITE_AAD_CLIENT_ID=<value> \`
    --build-arg VITE_AAD_TENANT_ID=<value> .`}</CodePre>

          <h4>What gets uploaded?</h4>
          <p>Everything in the directory that isn't excluded by <code>.dockerignore</code>. Always add <code>.dockerignore</code>:</p>

          <CodePre>{`node_modules
dist
.git
*.db
*.db-shm
*.db-wal
uploads/
.env
.env.*`}</CodePre>

          <p>This keeps build context small (faster uploads) and prevents local DB files from being baked into images.</p>

          <h4>Image tagging strategy</h4>
          <ul>
            <li><code>:latest</code> for the freshest. Web Apps using <code>:latest</code> need a manual restart to pick up new pulls (or use webhooks).</li>
            <li><code>:&lt;git-sha&gt;</code> for traceability. CI/CD uses this so each deploy points to an immutable tag.</li>
            <li>Best: tag both. Push <code>:abc123</code> and also re-tag it as <code>:latest</code>.</li>
          </ul>

          <h4>Image retention</h4>
          <p>ACR Basic doesn't auto-purge. Old image versions accumulate. Quick cleanup:</p>
          <CodePre>{`# Keep newest 10 tags, delete the rest:
az acr repository show-tags --name acrenzolopez01 --repository workshop --orderby time_desc --output tsv | \`
    Select-Object -Skip 10 | \`
    ForEach-Object { az acr repository delete --name acrenzolopez01 --image workshop:$_ --yes }`}</CodePre>

          <h3 id="s4-cache-rules">Cache rules — sidestep Docker Hub rate limits</h3>

          <p>
            <code>az acr build</code> runs Docker on Azure-side build agents. When your Dockerfile has{' '}
            <code>FROM node:22-alpine</code>, those agents pull the base image from Docker Hub anonymously. Docker
            Hub caps anonymous pulls at ~100 per 6 hours per IP, and Azure's build agents share egress IPs across
            tenants — so even your first build of the day can fail:
          </p>

          <CodePre>{`Step 1/27 : FROM node:22-alpine AS deps
toomanyrequests: You have reached your unauthenticated pull rate limit.
https://www.docker.com/increase-rate-limit
Container failed during run: build. No retries remaining.`}</CodePre>

          <p>
            The permanent fix is an <strong>ACR cache rule</strong> — tell your registry to mirror a Docker Hub
            repo into itself, authenticated with a free Docker Hub PAT stored in Key Vault. Future builds pull
            from your ACR (no rate limit, free intra-Azure bandwidth, faster).
          </p>

          <h4>The moving parts</h4>

          <MermaidDiagram theme="default" chart={`flowchart LR
  DH[Docker Hub<br/>library/node]
  KV["Key Vault<br/>dockerhub-user + dockerhub-token"]
  CS[ACR Credential Set<br/>dockerhub-creds]
  CR[ACR Cache Rule<br/>node-library]
  ACR[(ACR<br/>library/node)]
  Build["az acr build<br/>(your Dockerfile)"]

  CS -.reads via MI.-> KV
  CR -- uses --> CS
  CR -- mirrors --> DH
  CR -- writes to --> ACR
  Build -- pulls from --> ACR
  style ACR fill:#1e3a5f,stroke:#4f9eff,color:#fff
  style KV fill:#2d3e2f,stroke:#6fdc8c,color:#fff`} />

          <p>
            Each ACR <strong>credential set</strong> gets its own system-assigned managed identity. You grant{' '}
            <em>that</em> identity (not the registry's identity) Key Vault Secrets User on the vault, and the cache
            rule transparently fetches the PAT when it needs to talk to Docker Hub.
          </p>

          <h4>One-time setup</h4>

          <p><strong>1. Get a Docker Hub PAT.</strong> hub.docker.com → Account Settings → Personal Access Tokens
            → Generate. Scope: <code>Public Repo Read-Only</code>. Copy the token (shown once).</p>

          <p><strong>2. Provision the Key Vault (RBAC mode) + grant yourself write access.</strong></p>

          <CodePre>{`az keyvault create \`
  -g rg-personal-apps-prod \`
  -n kv-personal-prod-lwxhu7 \`
  --enable-rbac-authorization true

# Grant the signed-in user "Key Vault Secrets Officer" on the vault
$kvScope = az keyvault show -n kv-personal-prod-lwxhu7 --query id -o tsv
$me      = az ad signed-in-user show --query id -o tsv

az role assignment create \`
  --role "Key Vault Secrets Officer" \`
  --assignee-object-id $me \`
  --assignee-principal-type User \`
  --scope $kvScope`}</CodePre>

          <p><strong>3. Enable the ACR's system identity</strong> (used by future cache rules without explicit credential sets):</p>

          <CodePre>{`az acr identity assign --identities [system] --name acrenzolopez01

$acrPrincipal = az acr identity show --name acrenzolopez01 --query principalId -o tsv

az role assignment create \`
  --role "Key Vault Secrets User" \`
  --assignee-object-id $acrPrincipal \`
  --assignee-principal-type ServicePrincipal \`
  --scope $kvScope`}</CodePre>

          <p><strong>4. Store the secrets</strong> (paste your username + PAT inline; nothing leaves your terminal):</p>

          <CodePre>{`az keyvault secret set --vault-name kv-personal-prod-lwxhu7 --name dockerhub-user  --value "<your-dockerhub-username>"
az keyvault secret set --vault-name kv-personal-prod-lwxhu7 --name dockerhub-token --value "<the-PAT>"`}</CodePre>

          <p><strong>5. Create the credential set + cache rule.</strong> The credential set creates its own
            managed identity on the fly — capture its principal ID from the response and grant it Secrets User
            on the vault:</p>

          <CodePre>{`$userSecretId  = az keyvault secret show --vault-name kv-personal-prod-lwxhu7 --name dockerhub-user  --query id -o tsv
$tokenSecretId = az keyvault secret show --vault-name kv-personal-prod-lwxhu7 --name dockerhub-token --query id -o tsv

# Credential set — its own MI is created automatically
az acr credential-set create \`
  --registry acrenzolopez01 \`
  --name dockerhub-creds \`
  --login-server docker.io \`
  --username-id $userSecretId \`
  --password-id $tokenSecretId

# Grant the credential set's identity Key Vault read
$credSetPrincipal = az acr credential-set show \`
  --registry acrenzolopez01 --name dockerhub-creds \`
  --query identity.principalId -o tsv

az role assignment create \`
  --role "Key Vault Secrets User" \`
  --assignee-object-id $credSetPrincipal \`
  --assignee-principal-type ServicePrincipal \`
  --scope $kvScope

# Cache rule — sourceRepo:targetRepo is "where to mirror to"
az acr cache create \`
  --registry acrenzolopez01 \`
  --name node-library \`
  --source-repo docker.io/library/node \`
  --target-repo library/node \`
  --cred-set dockerhub-creds`}</CodePre>

          <p>Verify the credential set is Healthy (propagation takes ~30s after the role grant):</p>

          <CodePre>{`az acr credential-set show \`
  --registry acrenzolopez01 \`
  --name dockerhub-creds \`
  --query "authCredentials[0].credentialHealth" -o json
# {"status":"Healthy","errorCode":null,"errorMessage":null}`}</CodePre>

          <h4>Update the Dockerfile</h4>

          <p>Replace every <code>FROM node:22-alpine</code> with the cached path. With multi-stage builds (deps /
            builder / runner) it's three lines:</p>

          <CodePre>{`# BEFORE
FROM node:22-alpine AS deps
FROM node:22-alpine AS builder
FROM node:22-alpine AS runner

# AFTER
FROM acrenzolopez01.azurecr.io/library/node:22-alpine AS deps
FROM acrenzolopez01.azurecr.io/library/node:22-alpine AS builder
FROM acrenzolopez01.azurecr.io/library/node:22-alpine AS runner`}</CodePre>

          <p>
            Builds running inside ACR (<code>az acr build</code>) are already authenticated to your own ACR — no
            extra credential plumbing needed. Local builds work too if you <code>az acr login --name acrenzolopez01</code> first.
          </p>

          <h4>What changes after the rule is in place</h4>

          <table>
            <tbody>
              <tr><th></th><th>Before</th><th>After</th></tr>
              <tr><td>Pull source</td><td>docker.io (anonymous)</td><td>acrenzolopez01.azurecr.io (your MI)</td></tr>
              <tr><td>Rate-limit risk</td><td>~100/6h shared IP</td><td>None (intra-Azure)</td></tr>
              <tr><td>First pull cost</td><td>same</td><td>~30s extra (ACR pulls + caches once)</td></tr>
              <tr><td>Steady-state pull</td><td>~5–10s</td><td>~2–3s (faster — same region)</td></tr>
              <tr><td>Storage cost</td><td>—</td><td>~150 MB inside ACR's 10 GB Basic allowance</td></tr>
              <tr><td>Bandwidth cost</td><td>—</td><td>$0 (Azure-internal egress)</td></tr>
            </tbody>
          </table>

          <h4>Operational notes</h4>

          <ul>
            <li>
              <strong>Cache stays fresh automatically.</strong> When Docker Hub publishes a new digest for the same
              tag (e.g. <code>node:22-alpine</code> rebuilt with a security patch), the next pull triggers ACR to
              re-fetch. You don't manage it.
            </li>
            <li>
              <strong>PAT rotation.</strong> Docker Hub PATs don't auto-expire unless you set a TTL, but if you
              regenerate one, only the <code>dockerhub-token</code> secret in Key Vault needs updating — the cache
              rule keeps working without a re-create. The credential set picks up the new secret version on the
              next pull.
            </li>
            <li>
              <strong>Adding more cached images.</strong> One credential set covers all <code>docker.io</code>{' '}
              pulls; just add more cache rules with different <code>--source-repo</code> / <code>--target-repo</code>{' '}
              pairs. Common candidates: <code>nginx</code>, <code>python</code>, <code>postgres</code>,{' '}
              <code>mcr.microsoft.com</code> images (no auth needed for MCR, but caching them keeps pull latency
              consistent).
            </li>
            <li>
              <strong>The two-identity trap.</strong> Your registry has a system identity AND each credential set
              has its own. Both should have Secrets User if you want maximum flexibility, but the credential
              set's identity is the one that actually does the Docker Hub auth. If a future cache rule fails with
              "Forbidden", the missing role is usually on the credential set's identity, not the registry's.
            </li>
            <li>
              <strong>Bicep drift.</strong> Cache rules + credential sets currently live outside the Bicep
              templates in this repo; document the setup in source control (this guide) and re-create after any
              ACR redeploy. A future improvement is to model them in Bicep too.
            </li>
          </ul>

          <h4>If you'd rather not set up Key Vault</h4>

          <ul>
            <li>
              <strong>Retry the build.</strong> Build agent IPs rotate; second attempt often succeeds. Good
              enough if you push infrequently.
            </li>
            <li>
              <strong>Switch base to MCR.</strong> <code>mcr.microsoft.com/cbl-mariner/base/nodejs:22</code> is
              rate-limit-free but Mariner-based (different package manager, larger image). The Alpine footprint is
              lost — adopt only if Alpine isn't important.
            </li>
            <li>
              <strong>Use Docker Hub's free tier authenticated.</strong> Even a free Docker account gives 200 pulls/6h
              instead of 100 anonymous. Authenticate the build agent with{' '}
              <code>az acr build --auth-mode None</code> + <code>docker login</code> in a custom task. More
              fiddly than a cache rule.
            </li>
          </ul>
        </section>

        <hr />

        {/* SECTION 5 — NETWORKING */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>DNS, custom domains, TLS</h2>

          <h3>How a request reaches your container</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as Browser
  participant DNS as DNS (registrar)
  participant FE as App Service front-end (load balancer)
  participant V as Hidden VM (your plan)
  participant C as Docker container
  U->>DNS: resolve workshop.enzolopez.net
  DNS->>U: CNAME → app-workshop-prod-xxx.azurewebsites.net
  U->>DNS: resolve azurewebsites.net hostname
  DNS->>U: A → load balancer IP
  U->>FE: HTTPS handshake (SNI: workshop.enzolopez.net)
  FE->>FE: terminate TLS with managed cert
  FE->>V: forward HTTPS to the VM
  V->>C: forward to container on WEBSITES_PORT
  C->>V: response
  V->>FE: response
  FE->>U: response`} />

          <h4>Why TLS terminates at the front-end</h4>
          <p>You don't manage certs inside the container. The App Service front-end has the cert, talks TLS to the browser, and forwards plain HTTP to your container internally. Your code never sees the cert.</p>

          <h4>SNI vs IP-based binding</h4>
          <p>SNI (Server Name Indication) lets one IP host many hostnames with different certs — modern, free. IP-based binding gives the app a dedicated IP but costs extra and is rarely needed. <strong>Always use SNI.</strong></p>

          <h3>Adding a custom domain + free managed cert</h3>
          <h4>Steps</h4>
          <ol>
            <li>
              At your DNS host (where <code>enzolopez.net</code> is managed): add two records:
              <ul>
                <li><code>CNAME workshop → app-workshop-prod-xxx.azurewebsites.net</code></li>
                <li><code>TXT asuid.workshop → &lt;verification ID from portal&gt;</code></li>
              </ul>
            </li>
            <li>In Azure: Web App → Custom domains → Add. Paste <code>workshop.enzolopez.net</code>. Azure checks for both records.</li>
            <li>
              Once added, the domain shows as "Not Secure" — add the cert:
              <CodePre>{`az webapp config ssl create -g rg-personal-apps-prod -n <app> --hostname workshop.enzolopez.net`}</CodePre>
              Azure provisions a free DigiCert/Let's-Encrypt-flavored cert (issued by App Service Managed Certificate).
            </li>
            <li>
              Bind the cert:
              <CodePre>{`az webapp config ssl bind -g rg-personal-apps-prod -n <app> --certificate-thumbprint <tp> --ssl-type SNI`}</CodePre>
            </li>
            <li>Force HTTPS: already set in the Bicep (<code>httpsOnly: true</code>).</li>
          </ol>

          <h4>Managed cert constraints</h4>
          <ul>
            <li>Auto-renews ~45 days before expiry.</li>
            <li>Free, but not available for naked apex domains (i.e., <code>enzolopez.net</code> with no subdomain) on Basic. You'd need to use a CNAME-flattening DNS provider (Cloudflare) or a paid cert for apex.</li>
            <li>Not portable — can't export and use elsewhere.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 6 — STORAGE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Storage &amp; Databases</h2>

          <h3>Storage options at a glance</h3>
          <table>
            <tbody>
              <tr><th>Option</th><th>Best for</th><th>Avoid for</th><th>Your relevance</th></tr>
              <tr><td>App Service <code>/home</code></td><td>SQLite, small uploads</td><td>Multi-replica apps; large datasets</td><td>✅ current path</td></tr>
              <tr><td>Azure Files (SMB)</td><td>Shared files across containers, non-SQLite state</td><td>SQLite (locking!), low-latency reads</td><td>Avoid for DBs</td></tr>
              <tr><td>Azure Blob Storage</td><td>User uploads, backups, logs, static assets</td><td>Random-access mutable files</td><td>Future for uploads at scale</td></tr>
              <tr><td>Azure SQL DB</td><td>OLTP, complex queries, T-SQL ecosystems</td><td>Cost-sensitive small apps if not serverless</td><td>Migration option</td></tr>
              <tr><td>Postgres Flexible Server</td><td>Open-source apps, JSONB, full SQL</td><td>Burstable VM idles aren't free</td><td>Migration option</td></tr>
              <tr><td>Cosmos DB</td><td>Globally distributed, schemaless, very high throughput</td><td>Relational queries, low budgets</td><td>Probably overkill</td></tr>
            </tbody>
          </table>

          <MermaidDiagram theme="default" chart={`graph TD
  Start[Need to store data] --> Q1{Structured rows<br/>with relations?}
  Q1 -- No --> Q2{Files like images<br/>or uploads?}
  Q1 -- Yes --> Q3{Tiny dataset<br/>+ single replica?}
  Q2 -- Yes --> BLOB[Azure Blob Storage]
  Q3 -- Yes --> SQLITE["SQLite on /home<br/>✅ your current"]
  Q3 -- No --> Q4{Need scale<br/>or multi-region?}
  Q4 -- No --> PG[Postgres Flexible Burstable]
  Q4 -- Yes --> Q5{Strong consistency<br/>or eventual ok?}
  Q5 -- Strong --> SQL[Azure SQL Hyperscale]
  Q5 -- Eventual --> COSMOS[Cosmos DB]
  style SQLITE fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <h3>SQLite — what it is, when it's enough</h3>
          <p>SQLite is a serverless, file-based relational DB. The whole database is a single file on disk. Your three apps use it via <code>better-sqlite3</code>.</p>

          <h4>Strengths</h4>
          <ul>
            <li><strong>No DB server.</strong> No process to run, no port to expose, no auth.</li>
            <li><strong>Fastest reads of any DB option here</strong> for single-replica apps — it's just file I/O. No network round-trip.</li>
            <li><strong>Free.</strong> Zero infrastructure cost beyond the disk it sits on.</li>
            <li><strong>Easy to back up.</strong> Stop writes, copy the file. Or use the <code>VACUUM INTO</code> command.</li>
            <li><strong>Embeddable.</strong> Ships inside your container; one less thing to deploy/manage.</li>
          </ul>

          <h4>Weaknesses</h4>
          <ul>
            <li><strong>Single writer.</strong> Only one process can write at a time. WAL mode lets readers continue, but writers serialize.</li>
            <li><strong>No horizontal scale.</strong> The DB file is on one machine's disk. Multiple replicas can't share it safely over the network (locking is unreliable on SMB).</li>
            <li><strong>No connection pooling story</strong> in the usual sense — each process opens its own file handle.</li>
            <li><strong>Backup is manual.</strong> No managed PITR.</li>
          </ul>

          <h4>When SQLite is enough</h4>
          <p>Stop worrying about SQLite for an app under ~100 RPS that's fine with a single replica. The Litestream and rqlite ecosystems exist precisely because SQLite handles a lot more than people expect.</p>

          <h4>WAL mode (you should enable this)</h4>
          <CodePre>{`// in server.js, right after opening the DB:
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');`}</CodePre>
          <ul>
            <li><strong>WAL</strong> = Write-Ahead Log. Writers append to a side file; readers see the last committed state without blocking.</li>
            <li><strong>synchronous=NORMAL</strong> trades a microscopic durability window (the OS may buffer the last few writes during a crash) for a 5× write speedup. For personal apps this is the right trade.</li>
          </ul>

          <h4>Backup strategy on App Service</h4>
          <ol>
            <li><strong>Manual snapshot:</strong> SSH in, <code>sqlite3 workshop.db ".backup /home/data/backup-$(date +%F).db"</code>.</li>
            <li><strong>Automated:</strong> a small Node cron in your app (using <code>node-cron</code>) calling <code>db.backup('/home/data/backups/...')</code> every night, then uploading to Blob Storage via the Azure SDK.</li>
            <li><strong>Litestream</strong> (if you want continuous backup): a sidecar process that streams WAL changes to Blob Storage in near-real-time. More complex but bulletproof.</li>
          </ol>
          <p>A 100% offline weekly download of <code>workshop.db</code> via Kudu is also fine for personal scale.</p>

          <h3>Azure SQL Database — migration target</h3>
          <p>Microsoft's managed T-SQL service. Built on the SQL Server engine but offered as a fully managed cloud DB.</p>

          <h4>Tiers</h4>
          <ul>
            <li><strong>Serverless General Purpose</strong> (vCore model, auto-pause): the sweet spot for personal apps. You set min/max vCores; idle = paused; first request after idle = cold start (~30s).</li>
            <li><strong>Provisioned</strong>: fixed vCore, always on, predictable.</li>
            <li><strong>Hyperscale</strong>: separates compute from storage, scales to 100 TB. Overkill for you.</li>
            <li><strong>DTU model</strong>: older bundled pricing. Skip; use vCore.</li>
          </ul>

          <h4>Cost</h4>
          <p>Serverless GP with 0.5–1 vCore + auto-pause runs ~$5–$15/mo for hobby workloads. The "always pay" floor is the storage (~$0.12/GB-mo) — even when paused, storage bills.</p>

          <h4>Code changes from SQLite</h4>
          <table>
            <tbody>
              <tr><th>Concern</th><th>SQLite (now)</th><th>Azure SQL</th></tr>
              <tr><td>Driver</td><td><code>better-sqlite3</code> (sync)</td><td><code>mssql</code> (Node, async/promises)</td></tr>
              <tr><td>Connection</td><td>file path</td><td>connection string with server + db + auth</td></tr>
              <tr><td>Schema</td><td><code>INTEGER PRIMARY KEY AUTOINCREMENT</code></td><td><code>INT IDENTITY(1,1) PRIMARY KEY</code></td></tr>
              <tr><td>Datatypes</td><td>TEXT/INTEGER/REAL/BLOB</td><td>NVARCHAR/INT/FLOAT/VARBINARY</td></tr>
              <tr><td>Parameter binding</td><td><code>?</code></td><td><code>@named</code></td></tr>
              <tr><td>Upserts</td><td><code>INSERT … ON CONFLICT</code></td><td><code>MERGE</code> or <code>IF EXISTS</code></td></tr>
              <tr><td>Auth</td><td>n/a</td><td>SQL auth (user+password) <strong>or</strong> Entra (managed identity)</td></tr>
            </tbody>
          </table>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>Use MI auth, not SQL passwords.</strong> Web App's MI gets <code>SQL DB Contributor</code> at the resource level + a SQL-level role grant. Connection string becomes <code>Server=sql-...database.windows.net;Authentication=Active Directory Default;Database=...</code>. No password to manage.</div>
          </div>

          <h4>Sketch migration plan</h4>
          <ol>
            <li>Provision a Serverless GP database in the same region as the Web App.</li>
            <li>Translate your schema (write a one-time T-SQL migration based on the SQLite schema).</li>
            <li>Write a small Node script that reads each SQLite row and inserts via <code>mssql</code>. Run locally against the cloud DB.</li>
            <li>Swap the data-access layer in code from <code>better-sqlite3</code> to <code>mssql</code>. This is the biggest lift — every query needs touching.</li>
            <li>Deploy behind a feature flag; cut over.</li>
          </ol>

          <h3>Postgres Flexible Server — migration target</h3>
          <p>Open-source Postgres, fully managed. "Flexible" = the modern offering (vs the older "Single Server" which is being retired).</p>

          <h4>Tiers</h4>
          <ul>
            <li><strong>Burstable B1ms</strong> (1 vCore, 2 GB RAM): ~$15/mo. Lowest cost. <em>No auto-pause</em> — you pay 24/7.</li>
            <li><strong>General Purpose D2s_v3</strong> (2 vCore, 8 GB RAM): ~$130/mo.</li>
            <li><strong>Memory Optimized</strong>: for memory-heavy workloads.</li>
          </ul>

          <h4>When Postgres beats Azure SQL</h4>
          <ul>
            <li>You want open-source / portable (works on AWS, GCP, your laptop).</li>
            <li>You use <code>JSONB</code>, full-text search, PostGIS, hstore.</li>
            <li>You already know Postgres better than SQL Server.</li>
            <li>You'll use ORMs that target Postgres first (Prisma, Drizzle).</li>
          </ul>

          <h4>When Azure SQL beats Postgres</h4>
          <ul>
            <li>You want true auto-pause for hobby workloads (Postgres doesn't have it).</li>
            <li>You'll use T-SQL features.</li>
            <li>Active Directory auth setup is simpler.</li>
          </ul>

          <h4>Code changes from SQLite</h4>
          <table>
            <tbody>
              <tr><th>Concern</th><th>SQLite</th><th>Postgres</th></tr>
              <tr><td>Driver</td><td><code>better-sqlite3</code></td><td><code>pg</code> (or <code>postgres</code>, or via Prisma)</td></tr>
              <tr><td>Schema</td><td>permissive types</td><td>strict types; use <code>TEXT</code>, <code>INTEGER</code>, <code>UUID</code>, <code>JSONB</code></td></tr>
              <tr><td>Auto-inc PK</td><td><code>INTEGER PRIMARY KEY AUTOINCREMENT</code></td><td><code>BIGSERIAL PRIMARY KEY</code> or <code>GENERATED ALWAYS AS IDENTITY</code></td></tr>
              <tr><td>Upserts</td><td><code>INSERT … ON CONFLICT</code></td><td><code>INSERT … ON CONFLICT DO UPDATE</code> (Postgres uses the same syntax — nice!)</td></tr>
              <tr><td>Parameters</td><td><code>?</code></td><td><code>$1, $2, …</code></td></tr>
              <tr><td>Auth</td><td>n/a</td><td>user+password or Entra MI</td></tr>
            </tbody>
          </table>

          <h3>Cosmos DB — when (and when not)</h3>
          <p>Cosmos is a multi-model, globally distributed NoSQL database with five APIs (SQL/Core, MongoDB, Cassandra, Gremlin, Table).</p>

          <h4>When to pick it</h4>
          <ul>
            <li>You need single-digit-ms reads across multiple regions.</li>
            <li>Your data is schemaless / document-shaped.</li>
            <li>Throughput is bursty and you want to pay per request, not per hour.</li>
            <li>You'd otherwise self-shard a relational DB.</li>
          </ul>

          <h4>When to skip it</h4>
          <ul>
            <li>You have joins. Cosmos can do them inside a partition, but cross-partition joins are slow/expensive.</li>
            <li>You're price-sensitive. Min spend on a serverless container is small, but ad-hoc queries can spike Request Units.</li>
            <li>You already think relationally.</li>
          </ul>

          <h4>Pricing model</h4>
          <p>You pay for <strong>Request Units (RUs)</strong> — abstract throughput tokens. A simple point-read is ~1 RU, a query scanning 1 KB is ~5 RU. Two consumption modes:</p>
          <ul>
            <li><strong>Provisioned</strong>: reserve RU/s, pay 24/7. Min 400 RU/s ≈ $24/mo per container.</li>
            <li><strong>Serverless</strong>: pay per RU consumed. Cheaper for spiky/idle workloads. Capped at 1M RU/s.</li>
          </ul>

          <h4>Verdict for your apps</h4>
          <p>Skip Cosmos. Your data is relational (workshop projects with photos, glp1 tracking rows, shopkeep tools with categories). SQLite or Postgres fits better. Cosmos shines on a different shape of problem.</p>

          <h3>Azure Blob Storage — for uploads at scale</h3>
          <p>Today, workshop's uploads sit at <code>/home/data/uploads</code>. That works until you have GBs of photos, want a CDN in front, or need to back up off the Web App.</p>

          <h4>What Blob is</h4>
          <p>Object storage. You PUT/GET files (blobs) into containers (buckets). Cheap (~$0.018/GB-mo for hot tier), durable (geo-replicated), and accessible by URL.</p>

          <h4>Migration sketch (workshop's uploads)</h4>
          <ol>
            <li>Provision a Storage Account + Blob Container <code>workshop-uploads</code> (private).</li>
            <li>Grant the Web App's MI <code>Storage Blob Data Contributor</code> on the container.</li>
            <li>In code: replace <code>fs.writeFile(uploadsPath, …)</code> with <code>BlobClient.uploadData(…)</code> using <code>@azure/storage-blob</code> + <code>DefaultAzureCredential</code>.</li>
            <li>Serve via SAS URLs (short-lived signed URLs) — no need to proxy through your Web App.</li>
          </ol>

          <h4>SAS URLs</h4>
          <p>Shared Access Signatures: a query-string token that grants temporary, scoped access. Your code generates one with a 1-hour expiry and returns it to the frontend; the browser fetches the blob directly. Saves bandwidth on your Web App and lets you CDN-cache.</p>
        </section>

        <hr />

        {/* SECTION 7 — CI/CD */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>CI/CD with GitHub</h2>

          <h3>The pipeline at a glance</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  Dev[Your laptop] -->|git push| GH[(GitHub repo)]
  GH -->|workflow trigger| GHA[GitHub Actions runner]
  GHA -->|OIDC token| Entra[Entra]
  Entra -->|federated identity| Azure[Azure]
  GHA -->|az acr build| ACR[(ACR)]
  ACR -->|webhook OR az webapp deploy| Stage["Web App: slot=staging"]
  Stage -->|smoke tests pass| Swap[Swap]
  Swap --> Prod["Web App: slot=production"]
  style GH fill:#1e3a5f,stroke:#4f9eff,color:#fff
  style Stage fill:#3a2f1f,stroke:#ffb454,color:#fff
  style Prod fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <h3>Setting up OIDC federation (no client secrets in GitHub)</h3>
          <p>Old way: create a service principal, paste its client secret into GitHub as a repo secret, rotate quarterly. Painful.</p>
          <p>New way: <strong>federated credentials</strong>. GitHub Actions presents an OIDC token to Entra; Entra exchanges it for an Azure access token without any stored secret.</p>

          <h4>One-time setup per repo</h4>
          <CodePre>{`$app    = "myapp"             # short name, e.g. "workshop"
$repo   = "MyRepoName"        # GitHub repo name
$branch = "main"
$sub    = "1cf02211-8d77-4658-bb6a-0f83ec831c3b"
$rg     = "rg-personal-apps-prod"

# 1. Create the SP + app registration in one command, scoped Contributor to the RG.
#    (Use az ad sp create-for-rbac — it creates both the Entra app and the SP together.)
$sp = az ad sp create-for-rbac --name "github-$app-ci" \`
        --role contributor \`
        --scopes "/subscriptions/$sub/resourceGroups/$rg" \`
        --years 1 | ConvertFrom-Json
$appId = $sp.appId
Write-Host "SP appId: $appId"

# 2. Add a federated credential trusting GitHub Actions for this repo + branch.
@"
{
  "name": "github-$app-$branch",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:your-github-org/$repo:ref:refs/heads/$branch",
  "description": "GitHub Actions deploy from $branch branch",
  "audiences": ["api://AzureADTokenExchange"]
}
"@ | Out-File "$env:TEMP\fc.json" -Encoding utf8
az ad app federated-credential create --id $appId --parameters "@$env:TEMP\fc.json"

# 3. Verify:
az ad app federated-credential list --id $appId \`
    --query "[].{name:name,subject:subject}" -o table`}</CodePre>

          <p>The three IDs go in the workflow <code>env:</code> block. They are <strong>not</strong> secrets &mdash; only the federated credential (scoped to this repo + branch) makes them usable. Safe to commit to the YAML:</p>
          <ul>
            <li><code>AZURE_CLIENT_ID</code> = the <code>$appId</code> above</li>
            <li><code>AZURE_TENANT_ID</code> = your subscription (billing) tenant &mdash; <code>de625678-...</code> &mdash; <strong>not</strong> the Entra app-registration tenant</li>
            <li><code>AZURE_SUBSCRIPTION_ID</code> = <code>1cf02211-...</code></li>
          </ul>
          <p>That's it. No secret, just the three IDs. GitHub Secrets are optional (use them if you prefer not to commit the IDs, but they're not sensitive on their own).</p>

          <h3>Sample GitHub Actions workflow</h3>
          <p>Save as <code>.github/workflows/deploy.yml</code> in each repo. For GLP1 / ShopKeep, add the Vite build args.</p>

          <CodePre>{`name: Build & deploy workshop

on:
  push:
    branches: [main]
  workflow_dispatch:  # allows manual trigger

permissions:
  id-token: write   # for OIDC
  contents: read

env:
  ACR_NAME: acrenzolopez01
  RG: rg-personal-apps-prod
  IMAGE: workshop
  APP_NAME: app-workshop-prod-xxx   # fill from \`az webapp list -o table\`

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Azure login via OIDC
        uses: azure/login@v2
        with:
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Build and push image to ACR
        run: |
          az acr build \\
            --registry $ACR_NAME \\
            --image $IMAGE:\${{ github.sha }} \\
            --image $IMAGE:latest \\
            .

      - name: Deploy to staging slot
        run: |
          az webapp config container set \\
            -g $RG -n $APP_NAME --slot staging \\
            --container-image-name $ACR_NAME.azurecr.io/$IMAGE:\${{ github.sha }}

      - name: Smoke test staging
        run: |
          STAGING_URL=https://$APP_NAME-staging.azurewebsites.net/api/health
          for i in {1..20}; do
            if curl -sf $STAGING_URL; then
              echo "Health OK"; exit 0
            fi
            sleep 10
          done
          echo "Staging never came up"; exit 1

      - name: Swap staging to production
        run: az webapp deployment slot swap -g $RG -n $APP_NAME --slot staging --target-slot production`}</CodePre>

          <p>Note: slots require Plan SKU P0v3+ (B1 has none). On B1, drop the slot steps and deploy directly to the production slot.</p>
        </section>

        <hr />

        {/* SECTION 8 — MIGRATION WIZARD */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Migration playbook (your apps)</h2>

          <h3>Migration wizard <span className="badge green">interactive</span></h3>
          <p>Tick boxes as you go. State is saved in this browser's localStorage; reload-safe.</p>

          <h3>Pre-flight (before touching Azure)</h3>
          <Checklist prefix="migration-preflight" items={MIGRATION_PREFLIGHT_ITEMS} />

          <h3>Provisioning</h3>
          <Checklist prefix="migration-provision" items={MIGRATION_PROVISION_ITEMS} />

          <h3>Image build &amp; push</h3>
          <Checklist prefix="migration-build" items={MIGRATION_BUILD_ITEMS} />

          <h3>Secrets</h3>
          <Checklist prefix="migration-secrets" items={MIGRATION_SECRETS_ITEMS} />

          <h3>Data copy</h3>
          <Checklist prefix="migration-data" items={MIGRATION_DATA_ITEMS} />

          <h3>Smoke test (still on azurewebsites.net)</h3>
          <Checklist prefix="migration-smoke" items={MIGRATION_SMOKE_ITEMS} />

          <h3>Custom domain + cert</h3>
          <Checklist prefix="migration-domain" items={MIGRATION_DOMAIN_ITEMS} />

          <h3>Cutover &amp; retirement</h3>
          <Checklist prefix="migration-cutover" items={MIGRATION_CUTOVER_ITEMS} />
        </section>

        <hr />

        {/* SECTION 9 — FROM-SCRATCH */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Deploying a new app from scratch</h2>

          <h3>Decide before writing a single line of code</h3>
          <p>The questions to answer before you touch <code>npm init</code>:</p>
          <table>
            <tbody>
              <tr><th>Question</th><th>Why it matters</th><th>Default answer (your context)</th></tr>
              <tr><td>Who signs in?</td><td>Determines if you need Entra at all, single-tenant, multi-tenant, or B2C</td><td>You + family → single-tenant Entra in <code>52188f12-...</code></td></tr>
              <tr><td>What's the data shape?</td><td>Drives DB choice; rebuilding later is painful</td><td>If &lt; few GB and single-user-at-a-time: SQLite. Multi-user with relations: Postgres.</td></tr>
              <tr><td>Where will uploads live?</td><td>Same as above — moving files later means rewriting upload code</td><td>Start at <code>/home/data/uploads</code>. Move to Blob if it grows.</td></tr>
              <tr><td>Custom domain or default?</td><td>Affects DNS setup + Entra redirect URIs</td><td>Pick subdomain now (e.g., <code>foo.enzolopez.net</code>) so URIs are stable</td></tr>
              <tr><td>Public or auth-required?</td><td>App registration setup, scopes, audience</td><td>Auth-required = follow the same MSAL pattern as your three apps</td></tr>
              <tr><td>How does it integrate with other apps?</td><td>Shared identity? Shared DB? Inter-app calls?</td><td>Likely standalone like your current set</td></tr>
              <tr><td>What's the deploy cadence?</td><td>If &gt;1×/week, set up GitHub Actions Day 1. If rare, manual <code>az acr build</code> is fine.</td><td>Set up GH Actions from Day 1 — cheap once, painful retro-fit</td></tr>
              <tr><td>SLA / uptime?</td><td>B1 ≈ 99.5%, P0v3 ≈ 99.95%. Determines plan SKU.</td><td>B1 is fine for personal</td></tr>
            </tbody>
          </table>

          <h3>From-scratch wizard <span className="badge green">interactive</span></h3>
          <p>Tick boxes as you go. Saved in localStorage.</p>

          <h3>Day 0 — Decisions (no code yet)</h3>
          <Checklist prefix="scratch-day0" items={SCRATCH_DAY0_ITEMS} />

          <h3>Day 1 — Identity</h3>
          <Checklist prefix="scratch-day1-identity" items={SCRATCH_DAY1_IDENTITY_ITEMS} />

          <h3>Day 1 — Azure infra</h3>
          <Checklist prefix="scratch-day1-infra" items={SCRATCH_DAY1_INFRA_ITEMS} />

          <h3>Day 2 — Code scaffolding</h3>
          <Checklist prefix="scratch-day2-code" items={SCRATCH_DAY2_CODE_ITEMS} />

          <h3>Day 2 — CI/CD</h3>
          <Checklist prefix="scratch-day2-ci" items={SCRATCH_DAY2_CI_ITEMS} />

          <h3>Day 3 — Production</h3>
          <Checklist prefix="scratch-day3" items={SCRATCH_DAY3_ITEMS} />
        </section>

        <hr />

        {/* SECTION 10 — OPERATIONS */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Operations</h2>

          <h3>Logs &amp; monitoring</h3>
          <h4>Log streams</h4>
          <p>App Service captures stdout/stderr from your container, plus its own platform logs. Stream them live:</p>
          <CodePre>{`az webapp log tail -g rg-personal-apps-prod -n app-workshop-prod-xxx`}</CodePre>
          <p>Or download recent logs:</p>
          <CodePre>{`az webapp log download -g rg-personal-apps-prod -n app-workshop-prod-xxx --log-file logs.zip`}</CodePre>

          <h4>Application Insights</h4>
          <p>Optional but recommended. Enable on the Web App's Application Insights blade. Adds:</p>
          <ul>
            <li>Request rate, response time, error rate dashboards.</li>
            <li>Live metrics stream.</li>
            <li>Distributed traces if your code instruments them.</li>
            <li>5 GB/month free.</li>
          </ul>
          <p>For zero code changes, pick <em>Application monitoring → Node.js</em> in the App Insights wizard. The platform auto-instruments via <code>WEBSITE_NODE_DEFAULT_VERSION</code> env vars.</p>

          <h4>Alerts</h4>
          <p>Set up via Monitor → Alerts. Useful starters:</p>
          <ul>
            <li>5xx rate &gt; 5% over 5 min → email.</li>
            <li>CPU &gt; 80% sustained for 10 min → email.</li>
            <li>Daily cost &gt; $5 (Cost Management → Budgets).</li>
            <li>Managed cert &lt; 7 days from expiry → email.</li>
          </ul>

          <h3>Backups</h3>
          <table>
            <tbody>
              <tr><th>Asset</th><th>How to back up</th><th>Frequency</th></tr>
              <tr><td>SQLite DBs</td><td><code>VACUUM INTO '/home/data/backups/...'</code> from a nightly cron in-app, then upload to Blob</td><td>Daily</td></tr>
              <tr><td>Upload files</td><td>Already on <code>/home/data/uploads</code>; back up to Blob nightly OR migrate to Blob entirely</td><td>Daily</td></tr>
              <tr><td>App Settings</td><td><code>az webapp config appsettings list</code> → save JSON</td><td>On change</td></tr>
              <tr><td>App registrations</td><td>Export via <code>az ad app show</code> JSON</td><td>On change</td></tr>
              <tr><td>Bicep</td><td>Already in Git</td><td>Continuous</td></tr>
              <tr><td>Azure SQL DB</td><td>Auto: PITR 7–35 days included. Manual: long-term retention if needed.</td><td>Automatic</td></tr>
              <tr><td>Postgres Flex</td><td>Auto: PITR 7–35 days included.</td><td>Automatic</td></tr>
            </tbody>
          </table>

          <h4>Restore drill (do once)</h4>
          <ol>
            <li>Spin up a throwaway Web App slot.</li>
            <li>Restore yesterday's SQLite backup from Blob.</li>
            <li>Sign in and confirm yesterday's data is intact.</li>
            <li>Delete the throwaway. You now know your backups actually work.</li>
          </ol>

          <h3>Secrets via Key Vault references</h3>
          <p>
            Plain env-var values in App Service Configuration are fine for non-sensitive config. For API keys and
            connection strings, the fleet pattern is <strong>Key Vault references</strong> — the env var holds a
            pointer, App Service resolves it at startup using the webapp's managed identity. Your Node code reads
            <code>process.env.MY_SECRET</code> exactly as if the value were set directly; the indirection is invisible.
          </p>

          <h4>The reference syntax</h4>
          <CodePre>{`@Microsoft.KeyVault(SecretUri=https://kv-pulsewire-prod.vault.azure.net/secrets/DATABASE-URL/)`}</CodePre>

          <h4>Setup, in five steps</h4>
          <ol>
            <li>Provision a vault with RBAC mode, soft delete, purge protection (the fleet's Bicep does this).</li>
            <li>Enable system-assigned managed identity on the App Service: <code>az webapp identity assign -g RG -n APP</code>.</li>
            <li>Grant the identity <em>Key Vault Secrets User</em> scoped to that vault.</li>
            <li>Push your secret: <code>az keyvault secret set --vault-name kv-NAME --name MY-SECRET --value "..."</code>.</li>
            <li>Replace the App Service env value with the reference (see syntax above). Restart to resolve.</li>
          </ol>

          <h4>The name-conversion rule</h4>
          <p>
            Key Vault secret names can only contain <code>[A-Za-z0-9-]</code>. Node env-var names conventionally use
            UNDERSCORES. The fleet's Bicep does the conversion automatically: <code>AZURE_OPENAI_API_KEY</code> (env)
            ↔ <code>AZURE-OPENAI-API-KEY</code> (KV secret name). Don't try to use underscores in the URL — KV will
            reject the secret name with a URI parse error.
          </p>

          <h4>Resolution status</h4>
          <p>
            In the App Service portal under <em>Configuration → Environment variables</em>, each KV-backed value shows
            a Source column. Look for <strong>Resolved</strong> (working), <strong>Source not found</strong> (typo in
            URL or secret missing), or <strong>Access denied</strong> (managed identity lacks the role). Fix and
            restart the webapp to re-resolve.
          </p>

          <h4>Auto-refresh and rotation</h4>
          <p>
            App Service polls KV references roughly every 24 hours and refreshes if the value changed. For faster
            propagation after rotating a secret, restart the webapp explicitly. To pin a specific version (useful for
            controlled rollouts), append <code>/.../SECRET-NAME/&lt;version-id&gt;/</code> to the SecretUri.
          </p>

          <p>
            See the <strong>Azure Key Vault Patterns</strong> guide for the deep dive: Bicep templates, RBAC role IDs
            (memorize <code>4633458b-17de-408a-b874-0445c86b69e6</code> for Secrets User), the
            <code>DefaultAzureCredential</code> SDK fallback for code that fetches secrets dynamically, version pinning
            for controlled rollouts, and a lab to migrate one secret in ~15 minutes.
          </p>

          <h3>Persistent storage: /home vs /data</h3>
          <p>
            App Service for Linux containers have <strong>two</strong> persistent mount points by default. Both
            survive container restarts and image updates; they differ in setup cost and isolation.
          </p>

          <h4>/home — automatic, no setup</h4>
          <p>
            App Service automatically mounts <code>/home</code> as persistent. No path mapping required. The Operations
            backup table above uses <code>/home/data/uploads</code> and <code>/home/data/backups</code> — these "just
            work" because <code>/home</code> is platform-provided.
          </p>
          <ul>
            <li><strong>Pros</strong>: zero setup, comes with the App Service plan, integrates with built-in App Service Backup feature.</li>
            <li><strong>Cons</strong>: shared with system files (platform logs, FTP root, Kudu state); size grows from non-app files; not Azure Backup-managed for snapshots.</li>
            <li><strong>Quota</strong>: shared with the App Service plan's storage allocation (1 GB on F1/B1 → 250 GB on Premium).</li>
          </ul>

          <h4>/data — explicit Azure Files mount</h4>
          <p>
            The fleet's Tabloom / Hearth Dockerfiles declare <code>VOLUME ["/data"]</code> and the App Service
            Configuration → Path mappings binds it to a dedicated Azure Files share. Code writes to
            <code>/data/uploads</code> + <code>/data/&lt;app&gt;.db</code>; the share is on a separate storage account.
          </p>
          <ul>
            <li><strong>Pros</strong>: dedicated quota, separate from <code>/home</code>; can be sized independently; Azure Storage features (lifecycle policies, soft delete, geo-redundancy).</li>
            <li><strong>Cons</strong>: requires creating a storage account + file share + path mapping; latency ~3–5ms per I/O (vs ~1ms for <code>/home</code>); per-GB cost on top of storage account.</li>
          </ul>

          <h4>When to pick which</h4>
          <table>
            <tbody>
              <tr><th>Need</th><th>Pick</th></tr>
              <tr><td>Small SQLite DB + occasional uploads, F1/B1 plan</td><td><code>/home/data</code></td></tr>
              <tr><td>Dedicated DB or media storage with size control</td><td><code>/data</code></td></tr>
              <tr><td>Per-tenant or per-environment isolation</td><td><code>/data</code> (one share per env)</td></tr>
              <tr><td>Need to share files across slots (staging ↔ prod)</td><td><code>/data</code> bound to same share</td></tr>
              <tr><td>Want Azure Backup snapshot integration</td><td><code>/data</code> on a backed-up storage account</td></tr>
            </tbody>
          </table>

          <h4>SQLite-on-mount gotchas</h4>
          <ul>
            <li><strong>SMB locking is unreliable.</strong> Azure Files mounts as SMB. SQLite's POSIX file locking semantics aren't perfectly emulated. For SQLite WAL mode (which the fleet uses), this is fine in practice; for legacy rollback-journal mode under concurrent writers, you'll see <code>SQLITE_BUSY</code> spam.</li>
            <li><strong>Always single replica.</strong> Don't enable horizontal scale on App Service plans hosting SQLite. Two containers writing to the same file = corruption.</li>
            <li><strong>WAL files are siblings.</strong> If you copy the <code>.db</code> file for backup, also copy <code>.db-wal</code> and <code>.db-shm</code> — or use <code>VACUUM INTO</code> which writes a single self-contained snapshot.</li>
            <li><strong>Path traversal guard.</strong> When constructing file paths from user input, always <code>resolve()</code> + <code>startsWith(MOUNT_ROOT)</code> check. Even though the mount is persistent, that doesn't make it safe from escaping.</li>
          </ul>

          <h4>The .dockerignore corollary</h4>
          <p>
            Don't ship local <code>*.db</code> + <code>*.db-wal</code> files into the container image. The fleet's
            <code>.dockerignore</code> excludes them. If they accidentally ship, they BAKE INTO THE IMAGE — every
            cold start "reverts" the DB to whatever was in the image. Verify with
            <code>docker run --rm myapp ls -la /data</code> before deploying.
          </p>

          <h3>App Service plan SKU: cold starts + tradeoffs</h3>
          <p>
            The fleet ships on <strong>B1 (Basic)</strong>. Roughly $13/month per app, 1 vCPU, 1.75 GB RAM, no scale-out,
            no Always On by default. Cheap. With caveats.
          </p>

          <h4>Cold-start reality</h4>
          <p>When the App Service plan is idle (no traffic for ~20 minutes), the container can be unloaded. The first request after idle:</p>
          <ul>
            <li>Pulls the image from ACR (cached, fast if recent).</li>
            <li>Starts the container.</li>
            <li>Runs your <code>CMD</code>.</li>
            <li>Waits for the app to bind to <code>WEBSITES_PORT</code>.</li>
            <li>Routes the request.</li>
          </ul>

          <p>
            For a <code>node:22-alpine</code> + Express + better-sqlite3 image, cold start is typically <strong>4–8
            seconds</strong>. For Next.js with the standalone output (PulseWire), <strong>6–12 seconds</strong>.
            Subsequent requests are sub-100ms — the cost is paid once per cold start.
          </p>

          <h4>"Always On" — the simplest mitigation</h4>
          <CodePre>{`az webapp config set -g RG -n APP --always-on true`}</CodePre>

          <p>
            This sets a flag that prevents the container from being unloaded. App Service sends a synthetic request
            every 5 minutes to keep the container warm. <strong>Available on B1 and above</strong>; NOT available on
            F1 free / Shared tiers. The fleet enables Always On for production apps.
          </p>

          <h4>What Always On does NOT prevent</h4>
          <ul>
            <li><strong>Deployment cold starts</strong>: every <code>az webapp restart</code> reloads the container.</li>
            <li><strong>Platform-initiated restarts</strong>: Azure occasionally cycles the underlying VM. Roughly weekly. Unavoidable.</li>
            <li><strong>OOM kills</strong>: if your app spikes above 1.75 GB on B1, the container is killed. Next request = cold start.</li>
            <li><strong>Health-probe failures</strong>: if your app doesn't respond to App Service's internal health probe within ~30 seconds, the container is killed and restarted.</li>
          </ul>

          <h4>B1 sizing realities</h4>
          <table>
            <tbody>
              <tr><th>Resource</th><th>B1 limit</th><th>What it means</th></tr>
              <tr><td>vCPU</td><td>1 dedicated core</td><td>Fine for &lt;50 RPS; CPU-bound work (image processing, embeddings) will queue</td></tr>
              <tr><td>RAM</td><td>1.75 GB</td><td>Node + your code typically ~200 MB idle; growth comes from caches, in-memory data structures</td></tr>
              <tr><td>Storage</td><td>10 GB (plan-wide)</td><td>Shared across all apps in the plan + their /home contents</td></tr>
              <tr><td>Bandwidth</td><td>Unlimited (within reason)</td><td>Egress is metered separately, ~$0.087/GB</td></tr>
              <tr><td>Concurrent connections</td><td>~1920 sockets</td><td>Plenty for personal apps</td></tr>
              <tr><td>Scale-out</td><td>Not available</td><td>Need to upgrade to S1 for autoscale; not relevant for SQLite-backed apps anyway</td></tr>
            </tbody>
          </table>

          <h4>When to upgrade past B1</h4>
          <ul>
            <li><strong>Sustained CPU &gt; 70%</strong>. Move to B2 (2 cores, $26/mo) or S1 (1 core but better latency, $69/mo).</li>
            <li><strong>Memory pressure</strong>. B2 has 3.5 GB; S1 has 1.75 GB but with deployment slots, custom autoscale, daily backups.</li>
            <li><strong>Need staging slots</strong>. B1 doesn't have them. S1 has 5; P1V3 has 20.</li>
            <li><strong>Need autoscale</strong>. Premium tiers only.</li>
            <li><strong>Need VNet integration with private endpoints</strong>. Premium (P1V3+) only.</li>
          </ul>

          <h4>Cost map for the fleet</h4>
          <table>
            <tbody>
              <tr><th>Plan</th><th>RAM</th><th>Slots</th><th>Approx $/month</th><th>Use for</th></tr>
              <tr><td>F1 Free</td><td>1 GB</td><td>0</td><td>$0</td><td>Throwaway / demos. No custom domain, 60 min/day CPU.</td></tr>
              <tr><td>B1 Basic</td><td>1.75 GB</td><td>0</td><td>~$13</td><td>Personal apps (the fleet)</td></tr>
              <tr><td>B2 Basic</td><td>3.5 GB</td><td>0</td><td>~$26</td><td>Memory-bound personal apps</td></tr>
              <tr><td>S1 Standard</td><td>1.75 GB</td><td>5</td><td>~$69</td><td>Need staging slots</td></tr>
              <tr><td>P1V3 Premium</td><td>8 GB</td><td>20</td><td>~$150</td><td>Production multi-app, VNet integration</td></tr>
            </tbody>
          </table>

          <h4>Sharing plans across apps</h4>
          <p>
            Multiple App Service instances can share ONE plan — they share CPU + RAM. The fleet runs 4–6 apps on a
            single B1 plan, which works because not all apps are active simultaneously. If one app pegs CPU,
            siblings on the same plan suffer. For independent CPU budgets, use separate plans (each at its own SKU
            cost).
          </p>
        </section>

        <hr />

        {/* SECTION 11 — TROUBLESHOOTING */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Troubleshooting</h2>

          <h3>Container won't start</h3>
          <h4>Symptoms</h4>
          <p>App Service returns 503/504. Default page says "Application Error". <code>az webapp log tail</code> shows repeated container start attempts.</p>

          <h4>Diagnoses</h4>
          <table>
            <tbody>
              <tr><th>Likely cause</th><th>How to confirm</th><th>Fix</th></tr>
              <tr><td><code>WEBSITES_PORT</code> doesn't match the port your container actually listens on</td><td>Container log shows your app started on port X, but App Service tries to probe Y</td><td>Set <code>WEBSITES_PORT</code> to match (Bicep handles this; manually: <code>az webapp config appsettings set ... WEBSITES_PORT=&lt;port&gt;</code>)</td></tr>
              <tr><td>Image pull failed (MI doesn't have AcrPull)</td><td>Log shows <code>UNAUTHORIZED</code> / <code>denied</code> from ACR</td><td>Verify role assignment: <code>az role assignment list --assignee &lt;web-app-mi&gt; --scope &lt;acr-id&gt;</code></td></tr>
              <tr><td>Image tag doesn't exist</td><td>Log shows <code>not found</code></td><td>List tags: <code>az acr repository show-tags --name acrenzolopez01 --repository workshop</code></td></tr>
              <tr><td>App crashes immediately on start</td><td>stdout shows Node stack trace</td><td>Often a missing env var. Verify with <code>az webapp config appsettings list</code>.</td></tr>
              <tr><td>Native module mismatch</td><td>"better-sqlite3" or similar error about Linux/musl/glibc</td><td>Rebuild image — Dockerfile already pins <code>node:22-alpine</code>; ensure you're not bind-mounting host node_modules</td></tr>
            </tbody>
          </table>

          <h3>Auth fails (401 / redirect loops)</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
              <tr><td>Redirect loop on sign-in</td><td>Redirect URI in Entra doesn't exactly match the URL the browser is using</td><td>App registration → Authentication → add the exact URL (scheme + host)</td></tr>
              <tr><td>Token says "AADSTS700016: application not found in tenant"</td><td>Frontend pointing at wrong tenant in MSAL config</td><td>Confirm Vite build args used the Entra tenant <code>52188f12-...</code>, not the sub tenant</td></tr>
              <tr><td>Backend returns 401 with "invalid audience"</td><td><code>API_AUDIENCE</code> on the Web App doesn't match the access token's <code>aud</code> claim</td><td>Decode token at jwt.ms; align <code>API_AUDIENCE</code> with the <code>aud</code></td></tr>
              <tr><td>Backend returns 401 with "tid mismatch"</td><td>App config's tenant ID is wrong</td><td>Same as above — Entra tenant, not sub tenant</td></tr>
              <tr><td>"User exists but no oid in token"</td><td>Wrong response type / scopes</td><td>Ensure MSAL requests <code>openid profile</code> at minimum</td></tr>
            </tbody>
          </table>

          <h3>DB locked / corruption errors</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
              <tr><td><code>SQLITE_BUSY: database is locked</code></td><td>Two processes writing the same SQLite file</td><td>You should only have one replica. Check <code>az webapp show --query siteConfig.numberOfWorkers</code>; ensure = 1. Don't enable scaling.</td></tr>
              <tr><td><code>SQLITE_IOERR</code></td><td>Filesystem issue or storage layer outage</td><td>Restart Web App. If persistent, file an Azure support ticket and restore from backup.</td></tr>
              <tr><td>Corrupted WAL</td><td>Container killed mid-write (rare with WAL+NORMAL)</td><td>Restart usually clears it; if not, <code>sqlite3 db.db "PRAGMA integrity_check"</code> + restore</td></tr>
              <tr><td>"No such table"</td><td>Schema not initialized — fresh container started before migration ran</td><td>Confirm schema bootstrap is in startup path, not lazy on first request</td></tr>
            </tbody>
          </table>

          <h3>Custom domain / SSL issues</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
              <tr><td>"DNS verification failed" when adding domain</td><td>ASUID TXT record missing or wrong</td><td>Add <code>TXT asuid.&lt;subdomain&gt; = &lt;value-from-portal&gt;</code>; wait 5 min for propagation</td></tr>
              <tr><td>Browser shows cert for <code>*.azurewebsites.net</code></td><td>Managed cert hasn't been bound yet</td><td>Run <code>az webapp config ssl create</code> + <code>ssl bind</code></td></tr>
              <tr><td>Cert expiry approaching, no auto-renew</td><td>App Service Managed Certs auto-renew ~45d before expiry; if it failed, DNS may have changed</td><td>Check Portal → TLS/SSL settings → Private Key Certificates; re-create if needed</td></tr>
              <tr><td>"Cannot bind cert to slot"</td><td>Slot needs its own hostname binding</td><td>Add hostname + cert to the staging slot separately</td></tr>
            </tbody>
          </table>

          <h3>az acr build fails with "toomanyrequests"</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause</th><th>Fix</th></tr>
              <tr>
                <td><code>toomanyrequests: You have reached your unauthenticated pull rate limit</code> on a <code>FROM node:22-alpine</code> step</td>
                <td>Docker Hub's anonymous-pull cap (~100/6h per IP); ACR build agents share egress IPs across tenants</td>
                <td>
                  Quick: retry the workflow — agent IPs rotate, second attempt usually succeeds.
                  Permanent: set up an <a href="#s4-cache-rules">ACR cache rule</a> with a Docker Hub PAT in Key
                  Vault, then switch the Dockerfile to{' '}
                  <code>FROM acrenzolopez01.azurecr.io/library/node:22-alpine</code>.
                </td>
              </tr>
              <tr>
                <td>Cache rule's <code>credentialHealth</code> shows <code>Unhealthy</code> /{' '}
                <code>Caller is not authorized</code></td>
                <td>Credential set has its own managed identity (separate from the ACR registry's); only the
                  credential set's identity has Key Vault read access</td>
                <td>
                  Find the credential set's principal ID:{' '}
                  <code>az acr credential-set show --registry acrenzolopez01 --name dockerhub-creds --query identity.principalId -o tsv</code>{' '}
                  → grant it <strong>Key Vault Secrets User</strong> on the vault. Wait ~30s for propagation, then
                  re-check.
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Unexpected costs</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>Daily cost jumped 10×</td><td>You scaled up the plan, or provisioned Cosmos provisioned throughput, or App Insights ingestion exploded</td><td>Cost Management → Cost Analysis → group by service → find the spike</td></tr>
              <tr><td>"I deleted everything but still see charges"</td><td>Plan still exists (Web Apps were deleted but the plan wasn't)</td><td><code>az appservice plan list</code> + <code>az appservice plan delete</code></td></tr>
              <tr><td>Cosmos charging when I'm not using it</td><td>Provisioned throughput bills 24/7 regardless of usage</td><td>Convert to serverless or delete</td></tr>
              <tr><td>"I forgot to disable a dev resource"</td><td>Hobby resources left running</td><td>Tag everything with <code>env=prod</code> vs <code>env=dev</code>; filter cost by tag</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 12 — CLI CHEAT SHEET */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>CLI cheat sheet</h2>
          <p>Commands you'll type repeatedly.</p>

          <h4>Account / context</h4>
          <CodePre>{`az login
az account show
az account set --subscription 1cf02211-8d77-4658-bb6a-0f83ec831c3b
az account list -o table`}</CodePre>

          <h4>Resource groups</h4>
          <CodePre>{`az group list -o table
az group create -n rg-x -l eastus
az group delete -n rg-x --yes  # destroys everything inside!`}</CodePre>

          <h4>Bicep deployment</h4>
          <CodePre>{`az deployment group create -g rg-x --template-file main.bicep --parameters main.bicepparam
az deployment group list -g rg-x -o table
az deployment group show -g rg-x -n <deployment-name>`}</CodePre>

          <h4>ACR</h4>
          <CodePre>{`az acr build --registry acrenzolopez01 --image workshop:latest .
az acr repository list --name acrenzolopez01 -o table
az acr repository show-tags --name acrenzolopez01 --repository workshop --orderby time_desc
az acr login --name acrenzolopez01  # for local docker pull`}</CodePre>

          <h4>App Service</h4>
          <CodePre>{`az webapp list -g rg-personal-apps-prod -o table
az webapp config appsettings list -g rg-x -n <app> -o table
az webapp config appsettings set -g rg-x -n <app> --settings KEY=VALUE
az webapp restart -g rg-x -n <app>
az webapp stop -g rg-x -n <app>
az webapp start -g rg-x -n <app>
az webapp log tail -g rg-x -n <app>
az webapp ssh -g rg-x -n <app>
az webapp browse -g rg-x -n <app>
az webapp deployment slot list -g rg-x -n <app> -o table
az webapp deployment slot swap -g rg-x -n <app> --slot staging --target-slot production`}</CodePre>

          <h4>Custom domain &amp; cert</h4>
          <CodePre>{`az webapp config hostname add -g rg-x --webapp-name <app> --hostname foo.example.com
az webapp config ssl create -g rg-x --name <app> --hostname foo.example.com
az webapp config ssl bind -g rg-x --name <app> --certificate-thumbprint <tp> --ssl-type SNI
az webapp config ssl list -g rg-x -o table`}</CodePre>

          <h4>Key Vault</h4>
          <CodePre>{`az keyvault create -n kv-x -g rg-x --enable-rbac-authorization true
az keyvault secret set --vault-name kv-x -n my-secret --value 's3cret'
az keyvault secret list --vault-name kv-x -o table`}</CodePre>

          <h4>RBAC</h4>
          <CodePre>{`az role assignment list --assignee <principalId> --all -o table
az role assignment create --assignee <pid> --role "AcrPull" --scope <acr-resource-id>
az role assignment delete --assignee <pid> --role "AcrPull" --scope <acr-resource-id>`}</CodePre>

          <h4>Cost</h4>
          <CodePre>{`az consumption usage list --start-date 2026-05-01 --end-date 2026-05-31 -o table
# Or use Portal → Cost Management → Cost Analysis (easier UX)`}</CodePre>
        </section>

        <hr />

        {/* SECTION 13 — GLOSSARY */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">A</span>Glossary</h2>

          <h3>Quick definitions</h3>
          <table>
            <tbody>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td>ACR</td><td>Azure Container Registry — private Docker image registry.</td></tr>
              <tr><td>App registration</td><td>An identity for your app in Entra ID. Has client ID, redirect URIs, exposed scopes.</td></tr>
              <tr><td>App Service</td><td>Azure's PaaS for hosting web apps. Linux or Windows.</td></tr>
              <tr><td>App Service Plan</td><td>The hidden VM(s) that run your Web Apps. Billed independently of how many Web Apps live on it.</td></tr>
              <tr><td>AcrPull / AcrPush</td><td>RBAC roles to pull or push images from/to ACR.</td></tr>
              <tr><td>Bicep</td><td>Azure-native DSL for declarative infra. Compiles to ARM JSON.</td></tr>
              <tr><td>Cosmos DB</td><td>Globally distributed multi-model database.</td></tr>
              <tr><td>Entra ID</td><td>Microsoft's identity-as-a-service. Formerly Azure AD.</td></tr>
              <tr><td>Federated credential</td><td>An Entra trust relationship that lets an external workload (e.g., GitHub Actions) exchange its OIDC token for an Azure token, without storing a secret.</td></tr>
              <tr><td>jose</td><td>A JavaScript library for JWT/JWS/JWE. Your apps use it to validate Entra tokens.</td></tr>
              <tr><td>Key Vault</td><td>Azure's managed secret/key/cert store.</td></tr>
              <tr><td>Kudu</td><td>The SCM-side admin interface for App Service. Lives at <code>https://&lt;app&gt;.scm.azurewebsites.net</code>. File manager, log streamer, console.</td></tr>
              <tr><td>Managed Identity (MI)</td><td>An Entra identity attached to an Azure resource. System-assigned = lifecycle-tied; user-assigned = standalone.</td></tr>
              <tr><td>MSAL</td><td>Microsoft Authentication Library. Frontend (msal-browser) and backend (msal-node) flavors.</td></tr>
              <tr><td>oid</td><td>"Object ID" — per-user GUID in Entra, unique per user per tenant. Stable identifier for keying user data.</td></tr>
              <tr><td>OIDC federation</td><td>Trust relationship via OpenID Connect token exchange. See "Federated credential."</td></tr>
              <tr><td>PITR</td><td>Point-in-time restore. Built into Azure SQL and Postgres Flexible.</td></tr>
              <tr><td>RBAC</td><td>Role-Based Access Control. Azure's authorization model.</td></tr>
              <tr><td>SAS URL</td><td>Shared Access Signature. Time-bound signed URL granting scoped access to a blob.</td></tr>
              <tr><td>Slot</td><td>A clone of a Web App with its own URL + config. Used for staging → swap → production. Requires P0v3+.</td></tr>
              <tr><td>SNI</td><td>Server Name Indication. Lets one IP host many TLS certs by inspecting the hostname in the handshake.</td></tr>
              <tr><td>tid</td><td>"Tenant ID" claim in an Entra token.</td></tr>
              <tr><td>WAL</td><td>Write-Ahead Log. SQLite's concurrency mode that allows simultaneous readers and a single writer.</td></tr>
              <tr><td>WEBSITES_PORT</td><td>App setting telling App Service which port your container listens on internally.</td></tr>
            </tbody>
          </table>
        </section>

        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--rust)', marginBottom: 8 }}>
            🌐 Azure Hosting Guide
          </div>
          v1 · 2026-05-15. Companion docs: <code>main.bicep</code>, <code>main.bicepparam</code>,{' '}
          <code>deploy.ps1</code>, <code>MIGRATION_PLAN.md</code> (all in <code>Q:\repo\azure-infra\</code>) —
          pairs well with the AI Features guide for what you'll run on top.
        </div>
      </main>
    </div>
  );
}
