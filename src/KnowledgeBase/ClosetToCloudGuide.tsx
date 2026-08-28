import { useEffect, useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../app/storage/scopedStorage';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1', num: 'I',    title: 'Overview',         icon: '📋' },
  { id: 's2', num: 'II',   title: 'Core Concepts',    icon: '☁️' },
  { id: 's3', num: 'III',  title: 'Architecture',     icon: '🏗️' },
  { id: 's4', num: 'IV',   title: 'Migration',        icon: '🚚' },
  { id: 's5', num: 'V',    title: 'Deployment',       icon: '🚀' },
  { id: 's6', num: 'VI',   title: 'Operations',       icon: '🛠️' },
  { id: 's7', num: 'VII',  title: 'Future',           icon: '🔮' },
  { id: 's8', num: 'VIII', title: 'Reference',        icon: '📚' },
];

const CHECKLIST_STORAGE_KEY = 'workshop-azure-checks';

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

export function Checklist({ prefix, items }: { prefix: string; items: { id: string; label: React.ReactNode }[] }) {
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

export function PathTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
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

export default function ClosetToCloudGuide() {
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
              <path d="M6 18 L14 8 L22 18 Z M9 18 L14 12 L19 18 Z" fill="white" opacity="0.9" />
            </svg>
            <span className="sidebar-title">Closet to Cloud</span>
          </div>
          <div className="sidebar-sub">Migration knowledge base</div>
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
          <div className="hero-tag">☁️ Migration Knowledge Base · 2026</div>
          <h1>Closet<br />to Cloud</h1>
          <p>
            The complete knowledge base of migrating six personal apps off the home PC
            (<strong style={{ color: '#C77AA0' }}>Workshop</strong>, ShopKeep, GLP-1, Puzzlebox, Tabloom, SecretApp)
            from local Docker behind IIS-ARR to Azure App Service for Linux. Architecture, the 18 issues we hit,
            lessons, and a cheat sheet for working with what we built.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">~$18</span><span className="hero-stat-label">USD / month</span></div>
            <div className="hero-stat"><span className="hero-stat-val">6</span><span className="hero-stat-label">Apps migrated</span></div>
            <div className="hero-stat"><span className="hero-stat-val">19</span><span className="hero-stat-label">Issues hit + fixed</span></div>
            <div className="hero-stat"><span className="hero-stat-val">1</span><span className="hero-stat-label">B1 plan</span></div>
          </div>
        </div>

        {/* PART I — OVERVIEW */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">I</span>Overview</h2>

          <h3>Introduction</h3>
          <p>
            This is the consolidated reference for everything we learned while moving all six personal apps
            (<strong>Workshop</strong>, <strong>ShopKeep</strong>, <strong>GLP-1</strong>, <strong>Puzzlebox</strong>,
            <strong> Tabloom</strong>, and <strong>SecretApp</strong>) from a home PC running Docker + IIS + PM2
            to Azure App Service for Linux. It exists for three reasons:
          </p>
          <ol>
            <li>So <strong>future app migrations or new app additions</strong> reuse what worked and skip what didn&rsquo;t.</li>
            <li>So <strong>operations</strong> (deploys, restarts, backups, debugging) don&rsquo;t require re-deriving Azure concepts from docs.</li>
            <li>So <strong>concepts</strong> like Bicep and Kudu are explained once, in plain English, with their gotchas surfaced.</li>
          </ol>
          <p>
            Audience: a senior software engineer, comfortable with Docker, Linux, Node, and SQL but not deeply
            familiar with Azure&rsquo;s service catalogue. Where Azure docs are right, this file just links to them;
            where they&rsquo;re wrong or misleading for Linux App Service, it says so explicitly.
          </p>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>How to read this.</strong> The sidebar is the table of contents. Sections are mostly independent &mdash; jump in wherever you need. Code blocks have a Copy button. Deep-dive sections (Bicep, Kudu) can be skipped if you just want the operational reference.</div>
          </div>

          <h3>Before → After</h3>
          <div className="card-grid">
            <div className="card">
              <h4>Before (local)</h4>
              <ul>
                <li>Windows 10 PC at home</li>
                <li>Workshop runs in Docker (<code>docker compose up</code>)</li>
                <li>IIS with ARR reverse-proxies <code>workshop.enzolopez.net</code> to the container</li>
                <li>SQLite + uploads on a named Docker volume (<code>workshop_workshop-data</code>)</li>
                <li>Single point of failure: that PC. Power outage = downtime.</li>
              </ul>
            </div>
            <div className="card">
              <h4>After (Azure)</h4>
              <ul>
                <li>Azure App Service for Linux (Web App for Containers)</li>
                <li>Image stored in Azure Container Registry (ACR)</li>
                <li>SQLite + uploads on App Service&rsquo;s persistent <code>/home/</code> mount</li>
                <li>Auth via Microsoft Entra (MSAL on the frontend, JWT validation on the backend)</li>
                <li>GitHub Actions (<code>ubuntu-latest</code>, OIDC federated auth) builds &amp; deploys on every push &mdash; no secrets in GitHub, no local runner to maintain</li>
              </ul>
            </div>
          </div>

          <h4>Trip across the network</h4>
          <MermaidDiagram
            theme="default"
            chart={`flowchart LR
    user[User browser] --> dns[DNS]
    dns --> app[Azure App Service<br/>Linux container]
    app --> acr[(ACR<br/>pulls image)]
    app --> entra[Microsoft Entra<br/>JWT validation]
    app --> home[(/home/data/<br/>SQLite + uploads)]
    style app fill:#1f6feb,color:#fff
    style home fill:#238636,color:#fff
    style acr fill:#8957e5,color:#fff
    style entra fill:#bf8700,color:#fff`}
          />
        </section>

        <hr />

        {/* PART II — CORE CONCEPTS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">II</span>Core Azure Concepts</h2>

          <h3>Azure fundamentals</h3>
          <p>A quick glossary of the org structure. These nest top-down:</p>
          <table>
            <thead><tr><th>Concept</th><th>What it is</th><th>For Workshop</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Tenant</strong></td>
                <td>An identity directory (Microsoft Entra ID, formerly Azure AD). Users and app registrations live here.</td>
                <td>Two tenants! <code>52188f12&hellip;</code> for app registrations (MSAL), <code>de625678&hellip;</code> for billing.</td>
              </tr>
              <tr>
                <td><strong>Subscription</strong></td>
                <td>A billing container. All Azure spend ties to a subscription.</td>
                <td>Visual Studio Enterprise, <code>1cf02211&hellip;</code></td>
              </tr>
              <tr>
                <td><strong>Resource group</strong></td>
                <td>A logical bucket of resources. Deletes cascade. Strong unit of lifecycle.</td>
                <td><code>rg-personal-apps-prod</code></td>
              </tr>
              <tr>
                <td><strong>Region</strong></td>
                <td>A geographic data center cluster (e.g. East US, West Europe).</td>
                <td><code>eastus</code></td>
              </tr>
              <tr>
                <td><strong>Resource</strong></td>
                <td>An actual thing: a web app, a database, a storage account.</td>
                <td>ACR, App Service Plan, 3 web apps, 3 role assignments.</td>
              </tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The two-tenant subtlety.</strong> Your Entra app registration (which MSAL talks to for sign-in) is in tenant <code>52188f12&hellip;</code>. Your <em>billing</em> is in tenant <code>de625678&hellip;</code>. <code>az account show</code> returns the billing tenant, but the value you put in <code>AZURE_TENANT_ID</code> for auth is the Entra tenant. This bites people every time.</div>
          </div>

          <h3>App Service</h3>
          <p>
            <strong>Azure App Service</strong> is a PaaS for hosting web apps. You hand Azure a container image (or
            source code), and it gives you back HTTPS + a hostname + monitoring + scaling. No VM to manage.
          </p>
          <p>Three concepts that interact:</p>
          <div className="card-grid">
            <div className="card">
              <h4>App Service Plan</h4>
              <p>The compute tier. A virtual machine (or pool) sized by SKU. You pay per plan, not per app. Multiple web apps on the same plan share CPU/RAM.</p>
              <p><strong>Workshop uses:</strong> B1 Linux (~$13/mo, 1 vCPU shared, 1.75 GB RAM, supports <code>alwaysOn</code>).</p>
            </div>
            <div className="card">
              <h4>Web App</h4>
              <p>A single application instance. Pulls an image, runs it, exposes HTTPS. Has its own URL, env vars, managed identity, and (with the right setting) its own slice of persistent storage.</p>
              <p><strong>Workshop uses:</strong> <code>app-workshop-prod-lwxhu7jxlrbtu</code>.</p>
            </div>
            <div className="card">
              <h4>Web App for Containers</h4>
              <p>A flavor of Web App where the runtime is &ldquo;your Docker image&rdquo; rather than &ldquo;managed Node/Python/.NET&rdquo;. Pull source is configurable: ACR, Docker Hub, anything OCI-compatible.</p>
              <p>This is what we use across all three apps.</p>
            </div>
          </div>

          <h4>The magical <code>/home/</code> mount</h4>
          <p>
            When <code>WEBSITES_ENABLE_APP_SERVICE_STORAGE=true</code> is set on a web app, Azure mounts a
            <strong> persistent filesystem</strong> at <code>/home/</code> inside your container. That storage:
          </p>
          <ul>
            <li>Is scoped to <em>this specific web app</em> &mdash; no sharing between apps.</li>
            <li>Survives container restarts, image upgrades, and (most) platform maintenance.</li>
            <li>Is backed by Azure&rsquo;s own storage; you don&rsquo;t see a SKU for it, it&rsquo;s included.</li>
            <li>Gives you 10 GB on Basic plans, more on higher tiers.</li>
            <li>Is the <strong>only</strong> path you should write to if you want data to outlive the container.</li>
          </ul>
          <p>Inside the container, <code>/home/</code> looks like a regular Linux directory. <code>/home/site/</code> holds App Service&rsquo;s own files; <code>/home/data/</code> is by convention yours.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>Why this matters for SQLite.</strong> <code>/home/</code> is a real filesystem &mdash; not an SMB / Azure Files mount. Crucial for SQLite, which has well-known locking bugs over SMB. <code>better-sqlite3</code> on <code>/home/data/workshop.db</code> works the same as <code>better-sqlite3</code> on a local Docker volume.</div>
          </div>

          <h3>Azure Container Registry (ACR)</h3>
          <p>
            <strong>ACR</strong> is Azure&rsquo;s managed Docker registry. Same role as Docker Hub or GHCR &mdash;
            it stores OCI images &mdash; but inside Azure&rsquo;s trust boundary, with managed-identity
            authentication for App Service pulls.
          </p>

          <div className="card-grid">
            <div className="card">
              <h4>Basic SKU</h4>
              <p>~$5/mo, 10 GB storage, plenty for personal-scale images. Workshop&rsquo;s image is ~250 MB.</p>
            </div>
            <div className="card">
              <h4>Server-side builds</h4>
              <p><code>az acr build</code> uploads your source, runs Docker on an ACR build agent, pushes the result &mdash; <strong>no local Docker needed</strong>. Huge for self-hosted runners and CI.</p>
            </div>
            <div className="card">
              <h4>Admin user disabled</h4>
              <p>By policy. Auth happens via managed identity (see below), so there&rsquo;s no admin password to leak.</p>
            </div>
          </div>

          <h4>Naming rules (this trips people up)</h4>
          <ul>
            <li>5&ndash;50 characters</li>
            <li>Lowercase alphanumeric only (no hyphens, no dots)</li>
            <li>Globally unique across all of Azure</li>
          </ul>
          <p>Workshop&rsquo;s registry: <code>acrenzolopez01</code>. Login server: <code>acrenzolopez01.azurecr.io</code>.</p>

          <h3>Bicep (deep dive)</h3>
          <p>
            <strong>Bicep</strong> is Microsoft&rsquo;s domain-specific language for describing Azure infrastructure
            declaratively. You write a <code>.bicep</code> file that says &ldquo;here is what I want to exist,&rdquo;
            run <code>az deployment group create</code>, and Azure makes it so.
          </p>

          <h4>Why it exists</h4>
          <p>
            Azure&rsquo;s underlying API for declarative infrastructure is called <strong>ARM</strong> (Azure
            Resource Manager). ARM accepts JSON templates. ARM JSON is notoriously verbose, hard to read, and
            full of escaped string interpolation
            (<code>{`"[concat(parameters('foo'), '-', uniqueString(resourceGroup().id))]"`}</code>).
          </p>
          <p>
            Bicep is a <strong>thin DSL that compiles to ARM JSON</strong>. Microsoft built it after years of
            watching customers use Terraform&rsquo;s <code>azurerm</code> provider precisely because ARM JSON was
            painful. Same execution model (declarative, idempotent, server-side), much nicer syntax.
          </p>

          <h4>Bicep vs Terraform vs ARM JSON</h4>
          <table>
            <thead><tr><th></th><th>ARM JSON</th><th>Bicep</th><th>Terraform</th></tr></thead>
            <tbody>
              <tr><td>Made by</td><td>Microsoft</td><td>Microsoft</td><td>HashiCorp</td></tr>
              <tr><td>Azure-only?</td><td>Yes</td><td>Yes</td><td>No (multi-cloud)</td></tr>
              <tr><td>Server-side state</td><td>Yes (via ARM)</td><td>Yes (via ARM)</td><td>No &mdash; you manage <code>.tfstate</code></td></tr>
              <tr><td>Drift detection</td><td>Limited</td><td>Limited</td><td>Strong</td></tr>
              <tr><td>Day-1 with new Azure features</td><td>Always available</td><td>Usually within hours</td><td>Days to weeks</td></tr>
              <tr><td>Syntax pain</td><td>High</td><td>Low</td><td>Low</td></tr>
            </tbody>
          </table>
          <p>
            For an Azure-only stack, Bicep is the path of least resistance. No state file to manage (ARM stores
            it), day-one support for every Azure feature, and the CLI ships with the Azure CLI.
          </p>

          <h4>The file structure</h4>
          <p>Workshop&rsquo;s infra lives in two files:</p>
          <div className="card-grid">
            <div className="card">
              <h4><code>main.bicep</code></h4>
              <p>The declarative template. Defines parameters, resources, role assignments, and outputs.</p>
            </div>
            <div className="card">
              <h4><code>main.bicepparam</code></h4>
              <p>The parameter values. Separates the &ldquo;what&rdquo; (template) from the &ldquo;how&rdquo; (config). Like Terraform&rsquo;s <code>.tfvars</code>.</p>
            </div>
          </div>

          <h4>Key Bicep concepts</h4>

          <h4>1. Resources</h4>
          <p>The basic unit. Each <code>resource</code> declaration says &ldquo;I want one of these.&rdquo;</p>
          <CodePre>{`resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}`}</CodePre>
          <p>
            The string <code>'Microsoft.ContainerRegistry/registries@2023-07-01'</code> is the resource type plus
            an API version. Each Azure resource type has versioned schemas; Bicep ties you to one.
          </p>

          <h4>2. Parameters and variables</h4>
          <p><code>param</code> = input (from <code>.bicepparam</code> or CLI). <code>var</code> = computed locally.</p>
          <CodePre>{`param location string = resourceGroup().location
param planSku string = 'B1'
var suffix = uniqueString(resourceGroup().id)
var planName = 'plan-\${envName}-\${suffix}'`}</CodePre>

          <h4>3. The <code>uniqueString</code> function</h4>
          <p>
            A pure function: given the same input, always returns the same 13-char string. Used for generating
            deterministic-but-globally-unique resource names. <code>resourceGroup().id</code> is a stable input per
            resource group, so the suffix stays the same on every re-deploy &mdash; which is what enables
            <strong> idempotency</strong> (re-running the deploy is a no-op).
          </p>
          <p>
            This is exactly why a manual portal-created plan with a different naming format clashed with what
            Bicep wanted to create. The names diverged; Bicep didn&rsquo;t recognize the manual one as &ldquo;ours.&rdquo;
          </p>

          <h4>4. Loops</h4>
          <p>Bicep can iterate over arrays to create N copies of a resource:</p>
          <CodePre>{`resource webApps 'Microsoft.Web/sites@2023-12-01' = [for app in apps: {
  name: 'app-\${app.name}-\${envName}-\${suffix}'
  location: location
  kind: 'app,linux,container'
  identity: { type: 'SystemAssigned' }
  properties: { ... }
}]`}</CodePre>
          <p>That single loop creates one web app per entry in the <code>apps</code> parameter array. Adding a fourth app later is a one-entry change in <code>main.bicepparam</code>.</p>

          <h4>5. Outputs</h4>
          <p>Bicep can return values from a deploy &mdash; useful for &ldquo;what URL did this give me?&rdquo; questions:</p>
          <CodePre>{`output acrLoginServer string = acr.properties.loginServer
output webAppHostnames array = [for (app, i) in apps: webApps[i].properties.defaultHostName]`}</CodePre>

          <h4>6. Deployment modes</h4>
          <p>
            Bicep deploys are <strong>incremental by default</strong>: existing resources not mentioned in the
            template are left alone. Adding a fourth app doesn&rsquo;t threaten the existing three. The other mode
            (<code>Complete</code>) deletes anything not in the template &mdash; useful for test environments,
            dangerous for prod.
          </p>

          <h4>The Bicep workflow</h4>
          <MermaidDiagram
            theme="default"
            chart={`flowchart LR
    a[main.bicep] -->|bicep build| b[ARM JSON]
    c[main.bicepparam] --> b
    b -->|az deployment group create| d[Azure Resource Manager]
    d -->|reconciles| e[Actual resources]
    style a fill:#1f6feb,color:#fff
    style e fill:#238636,color:#fff`}
          />
          <p>You can <code>bicep build main.bicep</code> to see the ARM JSON it produces; usually unnecessary, but useful when debugging.</p>

          <h4>Why we use Bicep specifically</h4>
          <ul>
            <li>The whole infra fits in ~110 lines.</li>
            <li>Re-deploys are safe (idempotent). Adding/removing apps is a one-line change.</li>
            <li>The compute resources, role assignments, and ACR all stay in sync &mdash; no &ldquo;I forgot to grant AcrPull&rdquo; class of bug.</li>
            <li>No state file to lose. The current state lives in ARM, where Azure can audit it.</li>
            <li>The CLI is already installed (it ships with <code>az</code>).</li>
          </ul>

          <h3>Kudu (deep dive)</h3>
          <p>
            <strong>Kudu</strong> is the engine behind every App Service web app&rsquo;s &ldquo;SCM site&rdquo;
            &mdash; the admin/management surface that lives alongside your actual app.
          </p>
          <p>
            If your app is at <code>https://&lt;webapp&gt;.azurewebsites.net</code>, Kudu is at
            <code> https://&lt;webapp&gt;.scm.azurewebsites.net</code>. Same web app, different surface.
          </p>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Where the name comes from.</strong> The <strong>kudu</strong> is an African antelope (the spiral-horned one). Not an acronym. The project was created at Microsoft around 2011&ndash;2012 by David Ebbo&rsquo;s team as the deployment engine for Windows Azure Web Sites. They open-sourced it at <a href="https://github.com/projectkudu/kudu" target="_blank" rel="noopener noreferrer">github.com/projectkudu/kudu</a>.</div>
          </div>

          <h4>What Kudu does</h4>
          <table>
            <thead><tr><th>Surface</th><th>What it&rsquo;s for</th></tr></thead>
            <tbody>
              <tr><td>Source-based deploys</td><td>Originally <em>the</em> way to deploy. Push to a git remote that lives inside Kudu and it builds + activates the result.</td></tr>
              <tr><td>Zip deploy</td><td><code>az webapp deploy --type zip</code>: ship a build artifact, Kudu unpacks it.</td></tr>
              <tr><td>VFS API</td><td><code>/api/vfs/&lt;path&gt;</code> &mdash; read/write files in App Service&rsquo;s storage. <strong>Trap on Linux:</strong> see below.</td></tr>
              <tr><td>Command API</td><td><code>/api/command</code> &mdash; run shell commands in a sandbox that shares storage with your app.</td></tr>
              <tr><td>Browser file manager</td><td><code>/newui/fileManager</code> &mdash; drag-and-drop UI on top of VFS.</td></tr>
              <tr><td>Logs</td><td><code>/api/logs/</code> &mdash; deployment history, app stdout, Docker pull logs.</td></tr>
              <tr><td>SSH</td><td>On Linux, &ldquo;SSH&rdquo; in the portal opens a shell in a Kudu-managed sandbox.</td></tr>
              <tr><td>Diagnostics</td><td>Processes, env, memory, etc.</td></tr>
            </tbody>
          </table>

          <h4>Authentication</h4>
          <p>Each web app has auto-generated <strong>publishing credentials</strong>:</p>
          <CodePre>{`az webapp deployment list-publishing-credentials \\
    -g rg-personal-apps-prod \\
    -n app-workshop-prod-lwxhu7jxlrbtu \\
    --query "{user:publishingUserName, pass:publishingPassword}" -o json`}</CodePre>
          <p>You send <code>Authorization: Basic base64(user:pass)</code> on every Kudu API call.</p>

          <h4 id="kudu-trap">The Linux mount trap <span className="badge">important</span></h4>
          <p>
            On <strong>Linux</strong> App Service, Kudu runs in a <em>separate container</em> from your app. Both
            have a <code>/home/</code> path, but they aren&rsquo;t always backed by the same mount:
          </p>
          <div className="card-grid">
            <div className="card">
              <h4>VFS API <span className="badge">avoid</span></h4>
              <p><code>/api/vfs/home/&hellip;</code> writes to <strong>Kudu&rsquo;s</strong> filesystem view. Your app does <strong>not</strong> see these files.</p>
            </div>
            <div className="card">
              <h4>Command API <span className="badge green">use this</span></h4>
              <p><code>/api/command</code> runs in a sandbox that <strong>does</strong> share the app&rsquo;s persistent storage. Files written here show up under <code>/home/data/</code> in the app.</p>
            </div>
          </div>
          <p>
            On <strong>Windows</strong> App Service these are the same filesystem &mdash; which is why Microsoft docs
            and Stack Overflow answers say &ldquo;use Kudu to upload to <code>/home</code>.&rdquo; Those docs were
            written for the Windows era and never updated for Linux containers. Cost us ~2 hours to discover.
          </p>

          <h4>Diagnosing the trap (the sentinel trick)</h4>
          <p>If you ever suspect a mount-mismatch issue, run this test:</p>
          <CodePre>{`# Write a sentinel via VFS
PUT /api/vfs/home/data/sentinel.txt
Authorization: Basic ...
Body: "hello"

# Read it via the command API
POST /api/command
Body: { "command": "cat /home/data/sentinel.txt", "dir": "/home" }`}</CodePre>
          <p>If the sentinel comes back empty or &ldquo;no such file,&rdquo; you&rsquo;ve confirmed the mount mismatch. Stop using VFS immediately.</p>

          <h3>Managed identity</h3>
          <p>
            A <strong>managed identity</strong> is an Entra service principal that Azure creates and rotates for
            you, attached to a specific resource (web app, VM, Logic App, etc.). It exists so resources can
            authenticate to <em>other</em> resources without secrets in your config.
          </p>

          <h4>How Workshop uses it</h4>
          <p>The web app needs to pull its image from ACR. Instead of admin credentials, we:</p>
          <ol>
            <li>Enable a system-assigned managed identity on the web app (one line in Bicep).</li>
            <li>Grant that identity the <strong>AcrPull</strong> role on the ACR (also in Bicep).</li>
            <li>Tell the web app to use managed identity for the ACR pull: <code>acrUseManagedIdentityCreds: true</code>.</li>
          </ol>
          <p>No secret in the param file. No secret in App Service settings. When the web app is deleted, the identity vanishes with it. Revocation is automatic.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>Why this is better than admin creds.</strong> The conventional approach is to enable the ACR admin user, store the password in App Service settings, and use those for pulls. That password is now a long-lived secret you have to rotate, can be leaked, and shows up in <code>az</code> output. Managed identity sidesteps all of that.</div>
          </div>
        </section>

        <hr />

        {/* PART III — ARCHITECTURE */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">III</span>Workshop Architecture</h2>

          <h3>Resource diagram</h3>
          <MermaidDiagram
            theme="default"
            chart={`flowchart TD
    rg[Resource group<br/>rg-personal-apps-prod]
    acr[ACR Basic<br/>acrenzolopez01]
    plan[App Service Plan B1 Linux<br/>plan-prod-lwxhu7jxlrbtu]
    ws[Web App: workshop<br/>port 3006]
    sk[Web App: shopkeep<br/>port 3002]
    glp[Web App: glp1<br/>port 3004]
    home[(Persistent /home/<br/>per web app)]
    mi1[Managed identity]
    role1[AcrPull role assignment]

    rg --> acr
    rg --> plan
    plan --> ws
    plan --> sk
    plan --> glp
    ws --> mi1
    mi1 --> role1
    role1 --> acr
    ws -.persists.-> home

    style rg fill:#1f6feb,color:#fff
    style acr fill:#8957e5,color:#fff
    style plan fill:#bf8700,color:#fff
    style ws fill:#238636,color:#fff
    style sk fill:#238636,color:#fff
    style glp fill:#238636,color:#fff
    style home fill:#3a3a3a,color:#fff,stroke:#56d364`}
          />

          <h3>Why these choices</h3>
          <details open>
            <summary>Web App for Containers, not Container Apps / AKS</summary>
            <p>Single replica, SQLite, no scale-out needs. Container Apps&rsquo; scale-to-zero is useless for a personal app you want responsive at all times, and mounting state on Azure Files reintroduces SMB-SQLite locking quirks. AKS is overkill for three small apps.</p>
          </details>
          <details>
            <summary>SQLite + <code>/home/data/</code>, not Azure SQL / Postgres</summary>
            <p>The app uses <code>better-sqlite3</code> with no migration framework &mdash; moving to a hosted DB would require a real rewrite. <code>/home/</code> is a real filesystem (no SMB layer), so SQLite locking works exactly as it does in Docker.</p>
          </details>
          <details>
            <summary>ACR Basic, not Docker Hub / GHCR</summary>
            <p>Stays inside the Azure trust boundary. Managed-identity pulls. Under $60/year. ACR Basic is the cheapest tier; Standard/Premium add geo-replication and content trust we don&rsquo;t need.</p>
          </details>
          <details>
            <summary>Managed identity, not admin credentials</summary>
            <p>No secrets to rotate or leak. The web app&rsquo;s identity has AcrPull on exactly one registry. Deletes cascade.</p>
          </details>
          <details>
            <summary>One B1 plan for all three apps</summary>
            <p>Each app uses ~150 MB RAM under typical load; three fit comfortably in 1.75 GB. Marginal cost of adding ShopKeep + GLP-1 is effectively zero. Upgrade to P0v3 (~$60/mo, 4 GB, dedicated vCPU) if any becomes load-bearing.</p>
          </details>
          <details>
            <summary>No Application Insights / Key Vault / Front Door (yet)</summary>
            <p>Deferred. Each is a one-issue change when needed. See <a href="#deferred">What&rsquo;s not here yet</a>.</p>
          </details>

          <h3>SQLite + WAL deep dive</h3>
          <h4>The tech stack</h4>
          <ul>
            <li><strong>Engine:</strong> SQLite 3 via <code>better-sqlite3</code>. Synchronous, in-process, no daemon.</li>
            <li><strong>Mode:</strong> WAL (<code>db.pragma('journal_mode = WAL')</code>). Foreign keys on.</li>
            <li><strong>Schema:</strong> Inline <code>CREATE TABLE IF NOT EXISTS</code> in <code>server.js</code>.</li>
            <li><strong>Migration framework:</strong> None. To evolve schema, edit the block and let the next app start create new tables. Destructive changes (drop column) need a manual SQL pass.</li>
            <li><strong>File location:</strong> <code>/home/data/workshop.db</code>.</li>
            <li><strong>Backups:</strong> Manual, via the Kudu command API (see <a href="#common-ops">Common operations</a>).</li>
          </ul>

          <h4>What WAL mode means</h4>
          <p>WAL = Write-Ahead Logging. In rollback-journal mode (SQLite&rsquo;s old default), writes overwrite the main DB file directly, with a side file to enable rollback. In WAL mode:</p>
          <ul>
            <li>Writes go to a separate file (<code>workshop.db-wal</code>) and are appended.</li>
            <li>Readers continue reading the main DB file. They&rsquo;re not blocked by writers.</li>
            <li>Periodically, SQLite <em>checkpoints</em> &mdash; copies WAL pages into the main file and truncates the WAL.</li>
            <li>A small shared-memory file (<code>workshop.db-shm</code>) coordinates between readers and writers.</li>
          </ul>
          <p>Net effect: better concurrency, faster writes, more resilient crash recovery. Default choice for any new SQLite app.</p>

          <h4>The file anatomy</h4>
          <div className="card-grid">
            <div className="card">
              <h4><code>workshop.db</code></h4>
              <p>The main DB file. Contains all committed data <strong>up to the last checkpoint</strong>. Can be opened by sqlite3 CLI directly.</p>
            </div>
            <div className="card">
              <h4><code>workshop.db-wal</code></h4>
              <p>The write-ahead log. New writes since the last checkpoint live here. Has a salt that ties it to the writer&rsquo;s session &mdash; mismatched salts cause SQLite to discard the WAL on next open.</p>
            </div>
            <div className="card">
              <h4><code>workshop.db-shm</code></h4>
              <p>Shared memory for coordination. Always recreated by SQLite when the DB is opened. Safe to delete when the DB is closed.</p>
            </div>
          </div>

          <div className="alert warn">
            <span className="alert-icon">🚫</span>
            <div><strong>The WAL salt trap.</strong> If you copy a live <code>.db-wal</code> file to another machine while the original writer is still attached, the receiving SQLite sees a WAL salt that doesn&rsquo;t match what its connection expects. It throws the WAL away &mdash; <strong>data loss</strong>. Always <code>VACUUM INTO</code> a clean single-file copy before moving SQLite databases. See <a href="#rca-6">RCA issue #6</a>.</div>
          </div>

          <h4>The safe copy recipe</h4>
          <CodePre>{`# 1. Stop the writer
docker stop workshop

# 2. Vacuum to a clean single file (no WAL, no SHM)
docker run --rm \\
  -v workshop_workshop-data:/data \\
  -v "$WIN_TMP:/out" \\
  alpine sh -c \\
    'apk add --no-cache sqlite >/dev/null && \\
     sqlite3 /data/workshop.db "VACUUM INTO /out/workshop_clean.db"'

# 3. Restore the writer
docker start workshop

# 4. Upload only workshop_clean.db. NEVER copy .db-wal or .db-shm.`}</CodePre>

          <h4>Why no migration framework?</h4>
          <p>
            Alembic / Knex / Prisma / EF migrations are powerful, but they&rsquo;re also one more thing to maintain.
            Workshop&rsquo;s schema changes maybe once a month, the schema fits in a few hundred lines, and additive
            changes (new tables, new columns with defaults) are handled by the <code>CREATE TABLE IF NOT EXISTS</code>{' '}
            idiom and <code>ALTER TABLE ADD COLUMN</code> guarded by an <code>EXISTS</code> check.
          </p>
          <p>
            Destructive changes (drop column, rename) require a manual SQL session via the Kudu command API.
            That&rsquo;s deliberate friction &mdash; you should think hard before doing one.
          </p>
        </section>

        <hr />

        {/* PART IV — MIGRATION */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">IV</span>Migration Journey</h2>

          <h3 id="playbook">Migration playbook</h3>
          <p>The condensed version of <code>MIGRATION_PLAN.md</code>. For each future app:</p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Provision infra</div>
                <div className="tl-desc">Edit <code>main.bicepparam</code> (add the new app entry), run <code>deploy.ps1</code>. Bicep skips existing resources and adds the new web app + role assignment. Quota is already raised for eastus.</div>
                <span className="tl-time">~5 min</span>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Build &amp; push the image</div>
                <div className="tl-desc"><code>az acr build --registry acrenzolopez01 --image &lt;app&gt;:latest .</code> with <code>--build-arg VITE_*_CLIENT_ID</code> and <code>VITE_*_TENANT_ID</code> for any MSAL-using frontend. Watch out for the Windows CLI Unicode crash &mdash; verify via <code>az acr task list-runs</code>.</div>
                <span className="tl-time">~3 min</span>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Set secrets</div>
                <div className="tl-desc"><code>az webapp config appsettings set ... --settings ANTHROPIC_API_KEY=...</code></div>
                <span className="tl-time">~1 min</span>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">Transfer data from the Docker volume</div>
                <div className="tl-desc"><code>docker stop &lt;app&gt;</code> &rarr; <code>VACUUM INTO</code> a clean DB and <code>tar -cf uploads.tar</code> &rarr; <code>docker start &lt;app&gt;</code>. Then <code>upload-via-kudu.ps1</code> for each file. <strong>Do not</strong> use the Kudu file manager or VFS API.</div>
                <span className="tl-time">~30 min (with the helper)</span>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">5</div>
              <div className="tl-content">
                <div className="tl-title">Smoke test</div>
                <div className="tl-desc">Hit <code>https://&lt;app&gt;.azurewebsites.net</code>. Sign in. Click around. Verify data + uploads visible.</div>
                <span className="tl-time">~5 min</span>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">6</div>
              <div className="tl-content">
                <div className="tl-title">Custom domain + free cert</div>
                <div className="tl-desc">CNAME at registrar &rarr; <code>az webapp config hostname add</code> &rarr; <code>ssl create</code> &rarr; <code>ssl bind</code>.</div>
                <span className="tl-time">~10 min + DNS propagation</span>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">7</div>
              <div className="tl-content">
                <div className="tl-title">Flip DNS, retire IIS rule</div>
                <div className="tl-desc">Change the registrar record from your home IP to the Azure hostname. Once Azure serves traffic, remove the IIS/ARR rule.</div>
                <span className="tl-time">~5 min + TTL</span>
              </div>
            </div>
          </div>

          <h3 id="rca">Root cause analysis — the 7 issues</h3>
          <p>What went wrong during Workshop&rsquo;s migration, in the order it bit us. Read this in full before doing ShopKeep or GLP-1.</p>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Time impact, summarized.</strong> Total migration time: ~4 hours. Of which ~2.5 hours was the data transfer issue (#5 + #6). The other six issues combined cost ~1 hour.</div>
          </div>

          <h4 id="rca-1">Issue #1 — vCPU quota was 0 in eastus <span className="badge">solved</span></h4>
          <p><strong>Symptom.</strong> First <code>deploy.ps1</code> failed with <code>SubscriptionIsOverQuotaForSku</code>. &ldquo;Current Limit (Total VMs): 0. Amount required: 1.&rdquo;</p>
          <p><strong>Cause.</strong> Visual Studio Enterprise subscriptions start with zero compute quota in a fresh region. The Bicep plan creation fails before any resources land.</p>
          <p><strong>Fix.</strong> Portal &rarr; Subscriptions &rarr; Settings &rarr; Usage + quotas &rarr; filter by <code>eastus</code>, request &ldquo;Standard BS Family vCPUs&rdquo; &rarr; 10. Auto-approved within minutes.</p>
          <p><strong>Lesson for next time.</strong> Quota persists per subscription/region. Already raised for eastus. No action for ShopKeep/GLP-1.</p>

          <h4 id="rca-2">Issue #2 — orphan portal plan blocked Bicep retry <span className="badge">solved</span></h4>
          <p><strong>Symptom.</strong> After getting quota, second deploy failed with <code>Conflict — No available instances</code> against <code>plan-prod-lwxhu7jxlrbtu</code>. Listing showed a different plan name <code>plan-prod-x7q2k4</code> from the earlier portal attempt.</p>
          <p><strong>Cause.</strong> During the quota-error phase, a manually-created plan landed with a name that didn&rsquo;t match what Bicep&rsquo;s <code>uniqueString</code> generates. Bicep tried to create its own alongside, which the B1 SKU pool wasn&rsquo;t ready to satisfy in seconds.</p>
          <p><strong>Fix.</strong> <code>az appservice plan delete</code> on the orphan, re-run Bicep, clean success.</p>
          <p><strong>Lesson.</strong> Don&rsquo;t create resources manually in the portal while Bicep is in progress. Let Bicep own all naming. If an orphan exists, delete before retry.</p>

          <h4 id="rca-3">Issue #3 — missing MSAL build-args = blank page <span className="badge">subtle</span></h4>
          <p><strong>Symptom.</strong> App loaded the <code>&lt;title&gt;</code> but the page stayed blank. No error shown.</p>
          <p><strong>Cause.</strong> First <code>az acr build</code> for Workshop didn&rsquo;t pass <code>--build-arg VITE_AZURE_CLIENT_ID=...</code>. Workshop&rsquo;s <code>src/auth/msalConfig.ts</code> <code>throws new Error()</code> at module-load time if either ID is missing. That uncaught throw aborts JS before <code>main.tsx</code>&rsquo;s <code>try/catch</code> can run &mdash; not even the in-page error renderer gets to fire. Result: empty <code>&lt;div id=&quot;root&quot;&gt;</code>.</p>
          <p><strong>Fix.</strong> Rebuild with both args, restart the web app.</p>
          <p><strong>Lesson.</strong> Any Vite app importing <code>@azure/msal-browser</code> needs its client/tenant IDs as build-args. The fix is now baked into <code>deploy.ps1</code> and the GitHub Actions workflow.</p>

          <h4 id="rca-4">Issue #4 — Azure CLI crashes on Vite&rsquo;s &ldquo;✓&rdquo; <span className="badge">workaround</span></h4>
          <p><strong>Symptom.</strong> <code>az acr build</code> and <code>az webapp log tail</code> exit with <code>UnicodeEncodeError: 'charmap' codec can't encode character '✓'</code>. Looks like a build failure.</p>
          <p><strong>Cause.</strong> Vite prints a &ldquo;✓&rdquo; (U+2713) on success. Azure CLI on Windows opens stdout with <code>cp1252</code> and colorama crashes forwarding the char. <code>PYTHONUTF8=1</code> doesn&rsquo;t reach the embedded interpreter in the MSI build.</p>
          <p><strong>Fix.</strong> Don&rsquo;t trust the local exit code. Verify via <code>az acr task list-runs --registry &lt;acr&gt; --top 1 -o table</code> &mdash; that&rsquo;s authoritative.</p>
          <p><strong>Lesson.</strong> Same workaround for ShopKeep/GLP-1. The GitHub Actions workflow already checks task-run status directly.</p>

          <h4 id="rca-5">Issue #5 — the Kudu VFS ≠ app container mount <span className="badge">~2 hours lost</span></h4>
          <p><strong>Symptom.</strong> Hours of debugging. We uploaded <code>workshop.db</code> to <code>/api/vfs/home/data/workshop.db</code> and verified the size via VFS GET. But the app saw 0 rows; <code>sqlite3 /home/data/workshop.db</code> via the Kudu command API showed only 88 KB of schema.</p>
          <p>The clincher: writing a sentinel via VFS was invisible to <code>ls /home/data/</code> via the command API in the same web app.</p>
          <p><strong>Cause.</strong> On Linux App Service, the Kudu SCM site is a <em>separate container</em>. Its VFS API operates on Kudu&rsquo;s filesystem &mdash; not visible to the app. The command API runs in a sandbox that <em>does</em> share the app&rsquo;s persistent storage. See <a href="#kudu-trap">the Kudu trap section</a>.</p>
          <p><strong>Fix.</strong> Upload data files via the Kudu command API with <code>printf 'BASE64' | base64 -d &gt;&gt; /home/data/&lt;file&gt;</code> in 50 KB chunks. That hits the right mount.</p>
          <p><strong>Lesson.</strong> The biggest time sink. Future apps use <code>upload-via-kudu.ps1</code> &mdash; takes ~30 min instead of 2.5 hours.</p>

          <h4 id="rca-6">Issue #6 — SQLite WAL salt mismatch wiped data <span className="badge">data loss risk</span></h4>
          <p><strong>Symptom.</strong> After uploading the live <code>.db</code> + <code>.db-shm</code> + <code>.db-wal</code> trio, the app opened the DB and <em>truncated everything</em>. Main DB shrank to 88 KB, WAL to 0, all rows gone.</p>
          <p><strong>Cause.</strong> Every SQLite WAL file has a salt tying it to the writer connection. The Azure SQLite saw a WAL with a non-matching salt (the local Docker container also had it open with its own salt) and treated it as orphaned &mdash; effectively resetting the DB to the main file&rsquo;s state at WAL-start, then truncating the WAL.</p>
          <p><strong>Fix.</strong> <code>VACUUM INTO</code> to a clean file before transfer. Don&rsquo;t copy <code>.db-wal</code> or <code>.db-shm</code> &mdash; SQLite recreates them.</p>
          <p><strong>Lesson.</strong> ShopKeep and GLP-1 use per-user DBs (<code>&lt;oid&gt;.db</code>). Loop and <code>VACUUM INTO</code> each one individually.</p>

          <h4 id="rca-7">Issue #7 — production data lived in a Docker volume, not the repo <span className="badge">obvious in hindsight</span></h4>
          <p><strong>Symptom.</strong> Initial uploads transferred the <code>workshop.db</code> from <code>C:\Source\Repo\Workshop\</code> &mdash; a stale 4 KB dev DB from local testing months ago.</p>
          <p><strong>Cause.</strong> Workshop&rsquo;s <code>docker-compose.yml</code> mounts a named volume <code>workshop_workshop-data</code> at <code>/data</code> in the container. Live data lives in that volume. The repo file is leftover from pre-Docker testing.</p>
          <p><strong>Fix.</strong> Extract from the volume:</p>
          <CodePre>{`docker volume inspect workshop_workshop-data
docker run --rm -v workshop_workshop-data:/data alpine ls -la /data`}</CodePre>
          <p><strong>Lesson.</strong> ShopKeep volume: <code>shopkeep_shopkeep-data</code>. GLP-1: check that app&rsquo;s <code>docker-compose.yml</code>. <strong>Never</strong> assume the file in the repo root is the live DB.</p>

          <h4 id="rca-8">Issue #8 — GitHub Actions self-hosted runner needed five iterations <span className="badge">lessons logged</span></h4>
          <p><strong>Context.</strong> First push to <code>main</code> after wiring up the workflow triggered red X. Five commits to fix it end-to-end. Sub-issues:</p>
          <ul>
            <li><strong>#8a &mdash; <code>az</code> not on runner PATH.</strong> Windows services inherit machine PATH at start time, not user PATH. Azure CLI installed to a user-PATH-only folder means the runner service can&rsquo;t find <code>az</code>. Fix: ensure CLI&rsquo;s dir is on machine PATH, restart the runner service.</li>
            <li><strong>#8b &mdash; Windows Azure CLI Unicode crash propagates to GHA exit code.</strong> Same as #4: <code>az acr build</code> exits non-zero on Windows due to Vite&rsquo;s &ldquo;&#10003;&rdquo; character. GitHub Actions&rsquo; PowerShell wrapper then fails the step. Fix: wrap in <code>{'cmd /c "... & exit 0"'}</code>.</li>
            <li><strong>#8c &mdash; <code>Invoke-WebRequest</code> TLS edge case.</strong> Crashed with unhandled exception against <code>*.azurewebsites.net</code>. Fix: use <code>curl --fail</code> (ships at <code>C:\Windows\System32\curl.exe</code> on Win10+).</li>
            <li><strong>#8d &mdash; Container cold-start window underestimated.</strong> B1 Linux takes 2&ndash;4 min for Docker pull + Node boot. First workflow gave 60 seconds. Fix: 5-minute health-check poll.</li>
          </ul>
          <p><strong>Lesson.</strong> All of #8a, #8b, #8c are Windows-runner-only problems. See Issue #15 for the definitive fix.</p>

          <h4 id="rca-9">Issue #9 — runner-service <code>az</code> can&rsquo;t call ARM APIs: DPAPI logon-session mismatch <span className="badge">critical</span></h4>
          <p><strong>Symptom (GLP-1 migration).</strong> After fixing #8a, the pipeline advanced &mdash; <code>az account show</code> printed successfully, <code>az acr build</code> ran fine. Then <code>az webapp restart</code> failed in 14 seconds:</p>
          <CodePre>{`ERROR: A specified logon session does not exist. It may already have been
terminated. Status: Response_Status.Status_Unexpected, Error code: -2147023584`}</CodePre>
          <p><strong>Cause.</strong> <code>az</code> stores cached access/refresh tokens in <code>%USERPROFILE%\.azure\msal_token_cache.bin</code> encrypted with DPAPI tied to the interactive logon session that ran <code>az login</code>. The runner service runs in a <em>different</em> logon session &mdash; DPAPI refuses to decrypt. Any <code>az</code> call that hits ARM (i.e., anything beyond <code>az account show</code>) fails.</p>
          <p>Two red herrings: <code>az account show</code> reads <code>azureProfile.json</code> (unencrypted JSON), so the sanity check passes. <code>az acr build</code> runs server-side in ACR and uses the data-plane token (cached separately), so it also passes. Only ARM calls like <code>az webapp restart</code> hit the wall.</p>
          <p><strong>Fix &mdash; OIDC federated credentials</strong> (implemented 2026-05-17 for all three apps):</p>
          <CodePre>{`$app  = "workshop"   # or shopkeep / glp1
$repo = "Workshop"   # GitHub repo name
$branch = "main"
$sub  = "1cf02211-8d77-4658-bb6a-0f83ec831c3b"
$rg   = "rg-personal-apps-prod"

# 1. Create SP scoped Contributor to the RG only
$sp = az ad sp create-for-rbac --name "github-$app-ci" \\
        --role contributor \\
        --scopes "/subscriptions/$sub/resourceGroups/$rg" \\
        --years 1 | ConvertFrom-Json
$appId = $sp.appId

# 2. Add federated credential trusting GH Actions for this repo+branch
@"
{
  "name": "github-$app-$branch",
  "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:your-github-org/$repo:ref:refs/heads/$branch",
  "audiences": ["api://AzureADTokenExchange"]
}
"@ | Out-File "$env:TEMP\\fc.json" -Encoding utf8
az ad app federated-credential create --id $appId --parameters "@$env:TEMP\\fc.json"`}</CodePre>
          <p>The three IDs go in the workflow <code>env:</code> block (they are <strong>not</strong> secrets &mdash; the federated credential scoped to this repo+branch is what makes them usable).</p>

          <h4 id="rca-10">Issue #10 — <code>BACKUPS_DIR</code> relative-path default silently uses ephemeral storage <span className="badge">silent data loss</span></h4>
          <p><strong>Symptom (GLP-1).</strong> GLP-1&rsquo;s daily-backup feature writes to <code>BACKUPS_DIR</code> (default <code>./data/backups</code>). On Azure that resolves to <code>/app/data/backups</code> &mdash; ephemeral container storage wiped on every redeploy. Backups silently never persisted.</p>
          <p><strong>Fix.</strong> Added <code>{'{ name: \'BACKUPS_DIR\', value: \'/home/data/backups\' }'}</code> to GLP-1&rsquo;s entry in <code>main.bicepparam</code>.</p>
          <p><strong>Lesson.</strong> Before deploying any app, audit <code>server.js</code> for <code>process.env.X ?? '&lt;relative path&gt;'</code> defaults. Any state-bearing default landing on <code>./data/...</code> writes to ephemeral storage and gets wiped on redeploy. Pin every such path to <code>/home/data/...</code> in <code>main.bicepparam</code>.</p>

          <h4 id="rca-11">Issue #11 — Docker Compose volume name has the project-dir prefix <span className="badge">gotcha</span></h4>
          <p><strong>Symptom (GLP-1).</strong> <code>docker run --rm -v glp1-data:/data alpine ls /data</code> returned empty. But the app clearly had data.</p>
          <p><strong>Cause.</strong> Docker Compose prefixes named volumes with the project name (by default the lowercased directory name). GLP-1&rsquo;s directory is <code>GLP-1</code>, so the actual volume name is <code>glp-1_glp1-data</code>, not <code>glp1-data</code>.</p>
          <p><strong>Fix.</strong> Always confirm the actual volume name first:</p>
          <CodePre>{`docker inspect <container> --format '{{json .Mounts}}'
docker volume ls | findstr <app>`}</CodePre>

          <h4 id="rca-12">Issue #12 — em-dash in PowerShell script causes PS 5.1 parser error <span className="badge">encoding trap</span></h4>
          <p><strong>Symptom.</strong> Running <code>upload-via-kudu.ps1</code> from PowerShell 5.1 failed with <code>Unexpected token 'local'</code> parser errors across many lines.</p>
          <p><strong>Cause.</strong> The script had an em-dash (<code>&mdash;</code>, U+2014) in a <code>throw</code> message. The file is UTF-8 without BOM. PowerShell 5.1&rsquo;s default codepage is Windows-1252, which mis-decodes the 3-byte UTF-8 em-dash. The tokenizer can&rsquo;t parse the resulting bytes.</p>
          <p><strong>Fix.</strong> Replace em-dashes with ASCII hyphens in PowerShell sources. Alternatively, add a UTF-8 BOM or pin to <code>pwsh</code> (PS 7) which defaults to UTF-8.</p>

          <h4 id="rca-13">Issue #13 — <code>az webapp config ssl list</code> unreliable; use <code>ssl show</code> instead <span className="badge">Azure CLI bug</span></h4>
          <p><strong>Symptom (GLP-1 custom domain).</strong> Script polled <code>ssl list</code> for 5 minutes never seeing the cert. Direct <code>ssl show --certificate-name glp1.enzolopez.net</code> returned the cert immediately with status Succeeded.</p>
          <p><strong>Fix.</strong> After <code>az webapp config ssl create --hostname X</code>, poll <code>az webapp config ssl show --certificate-name X --query thumbprint -o tsv</code> instead of <code>ssl list</code>.</p>

          <h4 id="rca-14">Issue #14 — new runner service inherits stale PATH: restart it before first deploy <span className="badge">guaranteed first-run fail</span></h4>
          <p><strong>Symptom.</strong> Every new runner registration (Workshop, GLP-1, ShopKeep &mdash; all three) failed on first push with:</p>
          <CodePre>{`##[error]Login failed with Error: Unable to locate executable file: az.`}</CodePre>
          <p><strong>Cause.</strong> Each GitHub repo gets its own Windows service when you register a runner. Services inherit machine PATH at service-start time. If <code>az</code> was added after the service started (or the runner was registered before <code>az</code> was in machine PATH), every child process &mdash; including Node.js spawning <code>az</code> &mdash; can&rsquo;t find it. Happened identically on all three registrations.</p>
          <p><strong>Fix.</strong> Restart the runner service after every new registration:</p>
          <CodePre>{`$svc = Get-Content "C:\\actions-runner\\<AppName>\\.service"
sc.exe stop $svc; sc.exe start $svc`}</CodePre>
          <p><strong>Lesson.</strong> Moot once you switch to GitHub-hosted runners (Issue #15).</p>

          <h4 id="rca-15">Issue #15 — switch to GitHub-hosted runners: eliminates #8a, #8b, #8c, #14 entirely <span className="badge green">permanent fix</span></h4>
          <p><strong>Context (2026-05-17, after ShopKeep migration).</strong> After hitting Issue #14 on three separate apps, the root cause became clear: every self-hosted runner problem exists because the runner is a long-lived Windows service on a home PC. It has state, can drift, and requires maintenance.</p>
          <p><strong>Fix.</strong> Use <code>runs-on: ubuntu-latest</code>. GitHub spins up a fresh Linux VM for each run, tears it down after, and maintains it. The VM has <code>az</code> CLI pre-installed, runs bash natively, and handles Unicode without issue.</p>
          <p><strong>Before (self-hosted, PowerShell):</strong></p>
          <CodePre>{`jobs:
  deploy:
    runs-on: self-hosted
    defaults:
      run:
        shell: powershell
        working-directory: C:\\Source\\Repo\\ShopKeep
    steps:
      - name: Sync repo
        run: |
          git fetch --all --prune
          git reset --hard origin/master
      - name: Build image in ACR
        run: |
          cmd /c "az acr build ... > nul 2>&1 & exit 0"
          exit 0
      - name: Wait for app to come up
        run: |
          for ($i = 0; $i -lt 60; $i++) {
            cmd /c "curl -fsS ... > nul 2>&1"
            if ($LASTEXITCODE -eq 0) { ... }
            Start-Sleep -Seconds 5
          }`}</CodePre>
          <p><strong>After (GitHub-hosted, bash):</strong></p>
          <CodePre>{`jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id: \${{ env.AZURE_CLIENT_ID }}
          tenant-id: \${{ env.AZURE_TENANT_ID }}
          subscription-id: \${{ env.AZURE_SUBSCRIPTION_ID }}
      - name: Build image in ACR
        run: |
          az acr build \\
            --registry "$ACR" --image "$IMAGE" \\
            --build-arg "VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID" \\
            --build-arg "VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID" \\
            .
      - name: Wait for app to come up
        run: |
          url="https://$WEBAPP.azurewebsites.net/api/health"
          for i in $(seq 1 60); do
            if curl -fsS --max-time 8 "$url" > /dev/null 2>&1; then
              echo "Healthy after $((i * 5))s"; exit 0
            fi
            sleep 5
          done
          exit 1`}</CodePre>
          <p><strong>What this removes:</strong> the <code>runs-on: self-hosted</code> + PowerShell shell default; the manual git sync step; the <code>cmd /c "... &amp; exit 0"</code> Unicode-crash wrapper; all of Issues #8a, #8b, #8c, #14.</p>
          <p><strong>What stays:</strong> OIDC federated credentials. The federated credential authenticates on repo + branch, not on runner type &mdash; no changes to the SP or credential needed when switching.</p>

          <h4 id="rca-19">Issue #19 &mdash; Bicep <code>siteConfig.appSettings</code> is destructive: every redeploy wipes post-deploy secrets <span className="badge">critical</span></h4>
          <p>
            <strong>Symptom (2026-05-21, SecretApp).</strong> Adding a new app (<code>cairn</code>) to the stack and re-running
            Bicep made SecretApp&rsquo;s custom domain go completely dark &mdash; TCP connections closed immediately, no HTTP
            response at all. The other 5 apps appeared fine. Initial instinct: &ldquo;port 3001 collision between cairn and
            SecretApp.&rdquo; That was a red herring.
          </p>
          <p>
            <strong>Cause.</strong> The container was crash-looping. Docker stdout log showed:
          </p>
          <CodePre>{`❌ Missing required environment variables:
   - AZURE_OPENAI_API_KEY
   - PLEX_TOKEN`}</CodePre>
          <p>
            SecretApp&rsquo;s <code>server.js</code> calls <code>process.exit(1)</code> if any required env var is missing.
            Listing app settings confirmed all 7 secrets that had been set post-deploy via <code>az webapp config
            appsettings set</code> were gone.
          </p>
          <p>
            <strong>Root cause.</strong> <code>main.bicep</code> uses <code>siteConfig.appSettings: union([platform], app.settings)</code>
            for every web app in the loop. ARM treats <code>siteConfig.appSettings</code> as a <strong>destructive replace</strong>
            &mdash; the entire collection is overwritten with what Bicep declares. Every key not in <code>main.bicepparam</code>
            (i.e., every API key, deliberately kept out of source) is wiped.
          </p>
          <p>This affects every app on every redeploy, not just the one being added:</p>
          <ul>
            <li><strong>SecretApp:</strong> dies immediately (required vars).</li>
            <li><strong>Workshop / GLP-1 / ShopKeep / Tabloom:</strong> keep booting; their <code>ANTHROPIC_API_KEY</code> is optional in those backends, so AI features silently 503.</li>
            <li><strong>Puzzlebox / Cairn:</strong> no post-deploy secrets, unaffected.</li>
          </ul>
          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div>
              <strong>The port-collision red herring.</strong> Two App Service Linux web apps on the same plan can both have
              <code> WEBSITES_PORT=3001</code>. Each container runs in its own Linux network namespace. Don&rsquo;t try to &ldquo;fix&rdquo;
              it by changing ports.
            </div>
          </div>
          <p><strong>Immediate fix:</strong> re-set the missing secrets from the local <code>.env</code> via <code>az webapp config appsettings set</code>.</p>
          <p><strong>Long-term fix:</strong> added <code>restore-secrets.ps1</code> to <code>azure-infra/</code>. It reads each app&rsquo;s local <code>.env</code>, filters to that app&rsquo;s configured post-deploy keys, and re-applies them in one command. <code>deploy.ps1</code> now invokes it automatically at the end of every Bicep deploy.</p>
          <CodePre>{`cd C:\\Source\\Repo\\azure-infra
.\\restore-secrets.ps1                      # all apps
.\\restore-secrets.ps1 -Apps secretapp      # one
.\\restore-secrets.ps1 -DryRun              # show what would be set`}</CodePre>
          <p><strong>Better fix (deferred):</strong> move secrets into Azure Key Vault and reference them from Bicep. Then Bicep declares them but the values come from KV, not source. Punt until a secret needs rotation.</p>
          <p><strong>Future apps.</strong> When adding a new app to <code>main.bicepparam</code>, add a matching entry to <code>restore-secrets.ps1</code>&rsquo;s <code>$appMap</code> listing which keys that app needs restored after each Bicep redeploy.</p>

          <h3>Consolidated lessons</h3>
          <ol>
            <li><strong>Quota:</strong> already raised in <code>eastus</code> for the subscription. No action.</li>
            <li><strong>No portal clicks during Bicep deploys.</strong> Let Bicep own resource names.</li>
            <li><strong>MSAL build-args required for every Vite + msal-react app.</strong> Workshop, ShopKeep, GLP-1 all need this.</li>
            <li><strong>CLI Unicode crash on Windows is cosmetic.</strong> Trust <code>az acr task list-runs</code>, not the local exit code. Moot on GitHub-hosted runners.</li>
            <li><strong>For data transfer to Linux App Service:</strong> Kudu command API + base64-chunked writes is the ONLY method that hits the app container&rsquo;s <code>/home</code>. Never the VFS API. Never FTPS. Never drag-and-drop.</li>
            <li><strong>SQLite copy:</strong> Stop the writer, <code>VACUUM INTO</code> a clean file, upload that. No <code>.db-wal</code> / <code>.db-shm</code> transfer.</li>
            <li><strong>Live data is in Docker volumes</strong>, not in the repo. Always extract from the volume.</li>
            <li><strong>Use OIDC federated credentials</strong> for the workflow&rsquo;s Azure auth. The DPAPI token cache is tied to the interactive logon session and won&rsquo;t decrypt from the runner service context. Setup: create SP scoped to the RG, add a federated credential, drop <code>azure/login@v2</code> into the workflow. The three Azure IDs are not secrets. See RCA #9.</li>
            <li><strong>Audit <code>server.js</code> for relative-path env-var defaults</strong> before deploying. Any <code>process.env.X ?? './data/...'</code> writes to ephemeral container storage and gets wiped on redeploy. Pin every state-bearing path to <code>/home/data/...</code> in <code>main.bicepparam</code>.</li>
            <li><strong>Verify the Docker Compose volume name</strong> before extracting data &mdash; Compose prefixes the volume with the lowercased directory name. Run <code>{`docker inspect <container> --format '{{json .Mounts}}'`}</code> first.</li>
            <li><strong>Use ASCII in PowerShell helper scripts</strong> or add a UTF-8 BOM. PS 5.1 mis-decodes UTF-8 multi-byte chars (em-dashes, etc.) and the tokenizer chokes. GitHub-hosted runners default to Ubuntu + bash, so this only affects scripts you run locally.</li>
            <li><strong>Poll <code>az webapp config ssl show</code>, not <code>ssl list</code></strong>, when waiting for a managed cert. The list endpoint is unreliable; <code>show --certificate-name &lt;hostname&gt;</code> is authoritative.</li>
            <li><strong>Restart the runner service after registering it</strong> (historical &mdash; moot with GitHub-hosted runners). Services inherit machine PATH at start time. Happened on Workshop, GLP-1, and ShopKeep. Always run <code>sc.exe stop/start</code> before the first push.</li>
            <li><strong>Use GitHub-hosted runners (<code>ubuntu-latest</code>) from day one.</strong> No runner registration, no service management, no PATH issues, no Windows-specific workarounds in the workflow. OIDC auth is unchanged &mdash; federated credentials work on any runner type.</li>
            <li><strong>Give the app 5 minutes to come up</strong> after a restart on B1. Docker pull (~250 MB image) + Node boot reliably takes 2&ndash;4 minutes on a cold start. Poll <code>/api/health</code> in a loop.</li>
            <li><strong>Every Bicep redeploy wipes post-deploy secrets.</strong> <code>siteConfig.appSettings</code> is a destructive replace in ARM. Always run <code>restore-secrets.ps1</code> after <code>deploy.ps1</code> (it&rsquo;s now wired into <code>deploy.ps1</code> automatically, but the seatbelt matters for ad-hoc <code>az deployment group create</code> calls). See RCA #19. Long-term: move to Key Vault references.</li>
          </ol>
        </section>

        <hr />

        {/* PART V — DEPLOYMENT */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">V</span>Deployment</h2>

          <h3>git push → live</h3>
          <p>What happens when you commit and push to <code>main</code>:</p>
          <MermaidDiagram
            theme="default"
            chart={`sequenceDiagram
    participant dev as You
    participant gh as GitHub
    participant gha as GitHub Actions<br/>(ubuntu-latest runner)
    participant entra as Entra (OIDC)
    participant acr as ACR
    participant app as App Service
    participant home as /home/data/

    dev->>gh: git push origin main
    gh->>gha: trigger deploy.yml (fresh Linux VM)
    gha->>gh: request OIDC token (id-token: write)
    gh-->>gha: short-lived OIDC JWT
    gha->>entra: exchange JWT (azure/login@v2)
    entra-->>gha: Azure access token (no secrets stored)
    gha->>acr: az acr build (Docker build server-side)
    acr-->>gha: build complete
    gha->>acr: image pushed as workshop:latest
    gha->>app: az webapp restart
    app->>acr: pull workshop:latest (via managed identity)
    acr-->>app: image
    app->>app: start new container
    Note over home: untouched — survives the swap
    gha->>app: poll /api/health (up to 5 min)
    app-->>gha: 200 OK`}
          />

          <h4 id="whats-preserved">What survives a deploy</h4>
          <p>The image swap replaces the container&rsquo;s filesystem with a fresh copy from ACR. But <code>/home/</code> is a separate persistent mount that survives:</p>
          <ul>
            <li><code>/home/data/workshop.db</code> (+ <code>-wal</code>, <code>-shm</code>) &mdash; your 17 projects</li>
            <li><code>/home/data/uploads/</code> &mdash; every image and PDF you&rsquo;ve ever uploaded</li>
            <li><code>/home/LogFiles/</code> &mdash; app stdout/stderr history</li>
          </ul>
          <p>So when the new container boots, it opens the existing DB and serves the existing images. <strong>Zero data loss on deploy.</strong></p>

          <h4>The only ways data <em>could</em> be lost</h4>
          <ol>
            <li>Deleting the web app or the resource group.</li>
            <li>Changing <code>DB_PATH</code> or <code>UPLOADS_PATH</code> in <code>main.bicepparam</code> to point elsewhere, then redeploying.</li>
            <li>Running destructive SQL via the Kudu command API.</li>
          </ol>
          <p>All three require deliberate action. None happen incidentally.</p>

          <h3>GitHub Actions workflow</h3>
          <p>Lives at <code>.github/workflows/deploy.yml</code>. Runs on <code>ubuntu-latest</code> (GitHub-hosted) with OIDC federated auth &mdash; no secrets stored, no local runner to manage. Skips on doc-only pushes. The three Azure IDs in the <code>env:</code> block are <strong>not</strong> secrets; the federated credential scoped to this repo+branch is what makes them usable.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>This pattern is now live for all three apps</strong> (backported 2026-05-17). Workshop, GLP-1, and ShopKeep all deploy via <code>ubuntu-latest</code> + OIDC. The <code>deploy-template.yml</code> in <code>azure-infra/</code> is the canonical template to copy for new apps.</div>
          </div>

          <CodePre>{`name: Build & Deploy Workshop to Azure

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

# Required for azure/login@v2 to request an OIDC JWT from GitHub.
permissions:
  id-token: write
  contents: read

env:
  RG:  rg-personal-apps-prod
  ACR: acrenzolopez01
  IMAGE: workshop:latest
  WEBAPP: app-workshop-prod-lwxhu7jxlrbtu
  # SP for OIDC auth — created via \`az ad sp create-for-rbac\` with a
  # federated credential for this repo+branch. These IDs are public; only
  # the federated credential makes them usable.
  AZURE_CLIENT_ID:       dbd68ead-...   # github-workshop-ci appId
  AZURE_TENANT_ID:       de625678-c55b-4494-9558-14946cbb6133
  AZURE_SUBSCRIPTION_ID: 1cf02211-8d77-4658-bb6a-0f83ec831c3b
  VITE_AZURE_CLIENT_ID: 0f303f8f-...
  VITE_AZURE_TENANT_ID: 52188f12-db6b-46c6-88ff-08c802f0ed3b

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Azure login (OIDC)
        uses: azure/login@v2
        with:
          client-id:       \${{ env.AZURE_CLIENT_ID }}
          tenant-id:       \${{ env.AZURE_TENANT_ID }}
          subscription-id: \${{ env.AZURE_SUBSCRIPTION_ID }}

      - name: Build image in ACR
        run: |
          az acr build \\
            --registry "$ACR" --image "$IMAGE" \\
            --build-arg "VITE_AZURE_CLIENT_ID=$VITE_AZURE_CLIENT_ID" \\
            --build-arg "VITE_AZURE_TENANT_ID=$VITE_AZURE_TENANT_ID" \\
            .

      - name: Restart web app to pull new image
        run: az webapp restart -g "$RG" -n "$WEBAPP"

      - name: Wait for app to come up
        run: |
          url="https://$WEBAPP.azurewebsites.net/api/health"
          for i in $(seq 1 60); do
            if curl -fsS --max-time 8 "$url" > /dev/null 2>&1; then
              echo "Healthy after $((i * 5))s"; exit 0
            fi
            sleep 5
          done
          exit 1`}</CodePre>
        </section>

        <hr />

        {/* PART VI — OPERATIONS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">VI</span>Operations</h2>

          <h3 id="domain-vs-fd">Custom domain vs Front Door</h3>
          <p>Both are listed as &ldquo;not here yet&rdquo; in the architecture doc. They&rsquo;re different layers &mdash; you can have one without the other.</p>

          <h4>Custom domain + managed TLS cert</h4>
          <p>The basic &ldquo;make my app available at a nice URL&rdquo; layer.</p>
          <div className="card-grid">
            <div className="card">
              <h4>What you get</h4>
              <ul>
                <li>App at <code>workshop.enzolopez.net</code> instead of <code>app-workshop-prod-&hellip;.azurewebsites.net</code></li>
                <li>Free TLS cert (App Service Managed Certificate &mdash; Microsoft&rsquo;s Let&rsquo;s Encrypt equivalent for Azure)</li>
                <li>Auto-renewed every 90 days</li>
              </ul>
            </div>
            <div className="card">
              <h4>How it works</h4>
              <p>Traffic path: Browser &rarr; DNS &rarr; App Service (East US) &rarr; your container.</p>
              <ol>
                <li>CNAME at registrar: <code>workshop.enzolopez.net</code> &rarr; <code>app-workshop-prod-&hellip;.azurewebsites.net</code></li>
                <li><code>az webapp config hostname add</code></li>
                <li><code>az webapp config ssl create</code></li>
                <li><code>az webapp config ssl bind</code></li>
              </ol>
            </div>
          </div>
          <p><strong>Cost.</strong> Free (the cert is free, the domain is whatever you pay your registrar).</p>
          <p><strong>Setup time.</strong> ~10 minutes + DNS propagation.</p>

          <h4>Azure Front Door / CDN</h4>
          <p>A global edge layer that sits <em>in front of</em> your app.</p>
          <div className="card-grid">
            <div className="card">
              <h4>What you get</h4>
              <ul>
                <li>~190+ Microsoft edge POPs worldwide; users hit the nearest one</li>
                <li>Caching for static assets</li>
                <li>WAF (Web App Firewall) &mdash; OWASP top 10, SQLi, XSS, bot traffic, rate limiting</li>
                <li>Multi-region failover</li>
                <li>DDoS protection at the edge</li>
                <li>Path-based / header-based routing to multiple backends</li>
              </ul>
            </div>
            <div className="card">
              <h4>How it works</h4>
              <p>Traffic path: Browser &rarr; DNS &rarr; Front Door edge (Singapore / London / Sydney / &hellip;) &rarr; App Service (East US) &rarr; container.</p>
            </div>
          </div>
          <p><strong>Cost.</strong> Front Door Standard is ~$35/mo base + per-GB transfer. Premium (with the better WAF) ~$330/mo.</p>
          <p><strong>Setup time.</strong> 1&ndash;2 hours.</p>

          <h4>Side-by-side</h4>
          <table>
            <thead><tr><th></th><th>Custom domain only</th><th>Front Door + custom domain</th></tr></thead>
            <tbody>
              <tr><td>Nice URL</td><td>Yes</td><td>Yes</td></tr>
              <tr><td>Free HTTPS cert</td><td>Yes</td><td>Yes (or BYO)</td></tr>
              <tr><td>Global edge caching</td><td>No</td><td>Yes</td></tr>
              <tr><td>WAF</td><td>No</td><td>Yes</td></tr>
              <tr><td>Multi-region failover</td><td>No</td><td>Yes</td></tr>
              <tr><td>DDoS protection beyond baseline</td><td>No</td><td>Yes</td></tr>
              <tr><td>Latency impact (same region)</td><td>None</td><td>+5&ndash;20ms</td></tr>
              <tr><td>Monthly cost</td><td>$0</td><td>$35+</td></tr>
              <tr><td>Setup time</td><td>~10 min</td><td>1&ndash;2 hours</td></tr>
            </tbody>
          </table>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Recommendation for personal apps.</strong> Just do custom domain + managed cert. Free, simple, sufficient. Skip Front Door unless the app gets opened to non-family users at scale, you start serving users outside North America regularly, you want WAF rate-limiting, or you actually need multi-region.</div>
          </div>

          <h3 id="common-ops">Common operations</h3>
          <h4>Find current image / runtime config</h4>
          <CodePre>{`az webapp config show -g rg-personal-apps-prod -n app-workshop-prod-lwxhu7jxlrbtu \\
    --query "linuxFxVersion"

az webapp config appsettings list -g rg-personal-apps-prod -n app-workshop-prod-lwxhu7jxlrbtu -o table`}</CodePre>

          <h4>Restart without redeploying</h4>
          <CodePre>{`az webapp restart -g rg-personal-apps-prod -n app-workshop-prod-lwxhu7jxlrbtu`}</CodePre>

          <h4>Run SQL against the live DB</h4>
          <CodePre>{`$user = '$app-workshop-prod-lwxhu7jxlrbtu'
$pass = (az webapp deployment list-publishing-credentials \`
    -g rg-personal-apps-prod -n app-workshop-prod-lwxhu7jxlrbtu \`
    --query publishingPassword -o tsv)
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("\${user}:\${pass}"))
$body = '{"command":"sqlite3 /home/data/workshop.db \\"SELECT COUNT(*) FROM projects;\\"","dir":"/home"}'
Invoke-WebRequest -Uri "https://app-workshop-prod-lwxhu7jxlrbtu.scm.azurewebsites.net/api/command" \`
    -Method POST \`
    -Headers @{Authorization="Basic $auth"; "Content-Type"="application/json"} \`
    -Body $body -UseBasicParsing | Select-Object -ExpandProperty Content`}</CodePre>

          <h4>Manual DB backup</h4>
          <CodePre>{`# Run via Kudu command API:
sqlite3 /home/data/workshop.db "VACUUM INTO /home/data/backup-$(date +%Y%m%d).db"`}</CodePre>
          <p>Recommended cadence: monthly, or before any schema change.</p>

          <h4>Roll back to an earlier image</h4>
          <CodePre>{`# List recent digests
az acr repository show-manifests --name acrenzolopez01 --repository workshop --top 5 -o tsv --query "[].digest"

# Re-tag an old digest as latest
az acr import --name acrenzolopez01 \\
    --source acrenzolopez01.azurecr.io/workshop@<digest> \\
    --image workshop:latest --force

# Restart to pull
az webapp restart -g rg-personal-apps-prod -n app-workshop-prod-lwxhu7jxlrbtu`}</CodePre>

          <h4>Tail live logs (when CLI doesn&rsquo;t crash)</h4>
          <CodePre>{`az webapp log tail -g rg-personal-apps-prod -n app-workshop-prod-lwxhu7jxlrbtu`}</CodePre>
          <p>On Windows the CLI may crash on Unicode chars in app output. Workaround: portal &rarr; Diagnose and solve problems &rarr; Application Logs, or hit <code>https://&lt;webapp&gt;.scm.azurewebsites.net/api/logs/</code> directly.</p>

          <h3>Costs</h3>
          <table>
            <thead><tr><th>Item</th><th>USD / month</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>App Service Plan B1 Linux</td><td>~$13</td><td>Shared across all 6 apps</td></tr>
              <tr><td>ACR Basic</td><td>~$5</td><td>10 GB included</td></tr>
              <tr><td>Egress (typical personal use)</td><td>$0&ndash;$2</td><td>First 100 GB outbound free</td></tr>
              <tr><td>App Service Managed Certificates</td><td>$0</td><td>Free, auto-renewed</td></tr>
              <tr><td>Persistent <code>/home/</code> storage</td><td>$0</td><td>Included with App Service</td></tr>
              <tr><th>Total per environment</th><th>~$18&ndash;$20</th><th>Well inside $150/mo VS Enterprise credit</th></tr>
            </tbody>
          </table>
          <p>All 6 apps (Workshop, ShopKeep, GLP-1, Puzzlebox, Tabloom, SecretApp) share the same B1 plan &mdash; marginal cost of adding each new app is effectively zero until the plan gets cramped (see "Plan sizing" below).</p>

          <h3 id="plan-sizing">Plan sizing &mdash; when to upgrade and to what</h3>
          <p>
            B1 (1 shared vCPU, 1.75 GB RAM) was the starting point. With 6 apps on it as of 2026-05-18,
            it&rsquo;s working but the memory headroom is shrinking. Use this section as the decision guide
            when symptoms hit.
          </p>

          <h4>Real utilization on the current plan (2026-05-18, 24h window)</h4>
          <table>
            <thead><tr><th>Metric</th><th>Avg</th><th>Peak</th><th>Verdict</th></tr></thead>
            <tbody>
              <tr><td>CPU %</td><td>25&ndash;62%</td><td>100% (3 spikes)</td><td>OK &mdash; spikes correlated with deploys/builds, not user load</td></tr>
              <tr><td>Memory %</td><td>74&ndash;83%</td><td>87%</td><td>Tight &mdash; trended up from 74% (5 apps) to 82&ndash;85% (6 apps)</td></tr>
            </tbody>
          </table>

          <h4>Per-app working set (the user processes themselves are tiny)</h4>
          <p>
            Workshop ~23 MB &middot; GLP-1 ~21 MB &middot; ShopKeep ~17 MB &middot; Puzzlebox ~16 MB &middot;
            Tabloom ~16 MB &middot; SecretApp ~15 MB &mdash; total ~108 MB.
          </p>
          <p>
            Yet the plan shows ~1.43 GB used. The other ~1.3 GB is App Service platform overhead:
            one Node runtime per container, Docker, OS, file cache. That&rsquo;s why 6 tiny apps
            consume 80%+ of 1.75 GB.
          </p>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Symptoms that mean &ldquo;upgrade now&rdquo;:</strong>
              <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                <li>Plan memory % regularly above 90%</li>
                <li>Cold-start container exit/restart loops on any app</li>
                <li>502s on legitimate user traffic (not deploy windows)</li>
              </ul>
            </div>
          </div>

          <h4>Plan options (Linux, eastus, approximate USD/mo &mdash; verify on the Azure pricing calculator before committing)</h4>
          <table>
            <thead><tr><th>SKU</th><th>vCPU</th><th>RAM</th><th>$/mo</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td><strong>B1</strong> (current)</td><td>1 shared</td><td>1.75 GB</td><td>~$13</td><td>Cheapest. Shared CPU = noisy-neighbor risk. No SLA.</td></tr>
              <tr><td>B2</td><td>2 shared</td><td>3.5 GB</td><td>~$26</td><td>Doubles everything for +$13. Same noisy-neighbor caveat.</td></tr>
              <tr><td>B3</td><td>4 shared</td><td>7 GB</td><td>~$52</td><td>Overkill for personal apps.</td></tr>
              <tr><td><strong>P0v3</strong></td><td>1 dedicated</td><td>4 GB</td><td>~$54</td><td>Best upgrade target. Dedicated CPU (no neighbors), 99.95% SLA, deployment slots, autoscale, faster local SSD.</td></tr>
              <tr><td>P1v3</td><td>2 dedicated</td><td>8 GB</td><td>~$118</td><td>If apps ever become load-bearing.</td></tr>
              <tr><td>S1 / S2 / S3</td><td>varies</td><td>varies</td><td>$73&ndash;$292</td><td>Standard tier &mdash; gets slots + autoscale but on shared CPU. Worse $/perf than Pv3. Skip.</td></tr>
            </tbody>
          </table>

          <h4>Recommendation when the time comes</h4>
          <ul>
            <li><strong>B2 (~$26)</strong> &mdash; cheapest path. Just want headroom. Same product, no new features. Total monthly cost goes from ~$18 to ~$31.</li>
            <li><strong>P0v3 (~$54)</strong> &mdash; better long-term choice. Dedicated CPU (predictable performance, no noisy-neighbor), deployment slots for zero-downtime deploys, 99.95% SLA. Total ~$59/mo.</li>
          </ul>
          <p>
            Both fit comfortably inside the $150/mo Visual Studio Enterprise credit. The migration is
            so cheap that the &ldquo;right&rdquo; answer is more about what features you want than the
            extra ~$13&ndash;$40/mo.
          </p>

          <h4>How to upgrade (in-place, ~2 min, no downtime)</h4>
          <CodePre>{`# Bump to B2 (cheapest path to headroom)
az appservice plan update -g rg-personal-apps-prod -n plan-prod-lwxhu7jxlrbtu --sku B2

# Or P0v3 (dedicated CPU + deployment slots)
az appservice plan update -g rg-personal-apps-prod -n plan-prod-lwxhu7jxlrbtu --sku P0V3

# Downgrade later is the same command with the smaller SKU
az appservice plan update -g rg-personal-apps-prod -n plan-prod-lwxhu7jxlrbtu --sku B1`}</CodePre>

          <h4>How to check the plan&rsquo;s actual utilization (run anytime)</h4>
          <CodePre>{`# 24h CPU + Memory averages and peaks
$plan = "/subscriptions/<sub>/resourceGroups/rg-personal-apps-prod/providers/Microsoft.Web/serverfarms/plan-prod-lwxhu7jxlrbtu"
az monitor metrics list --resource $plan \\
    --metric CpuPercentage,MemoryPercentage \\
    --aggregation Average Maximum --interval PT1H \\
    --start-time (Get-Date).AddHours(-24).ToString('yyyy-MM-ddTHH:mm:ssZ') -o table`}</CodePre>

          <h3 id="deferred">What&rsquo;s not here yet</h3>
          <p>Deliberate &ldquo;not yet&rdquo; items. Each is a one-issue change when the time comes.</p>
          <div className="card-grid">
            <div className="card">
              <h4>Application Insights</h4>
              <p>For tracing AI calls and slow endpoints. <strong>When to add:</strong> the moment you wonder why something feels slow and there&rsquo;s no data to look at.</p>
            </div>
            <div className="card">
              <h4>Key Vault</h4>
              <p>For <code>ANTHROPIC_API_KEY</code> with rotation and audit. <strong>When to add:</strong> when the key needs to be rotated and you want it auditable.</p>
            </div>
            <div className="card">
              <h4>Azure Front Door</h4>
              <p>Global edge + WAF. Probably never for personal use. See <a href="#domain-vs-fd">above</a>.</p>
            </div>
            <div className="card">
              <h4>Custom domain (ShopKeep)</h4>
              <p>ShopKeep DNS CNAME flip to <code>shopkeep.enzolopez.net</code> is pending at the registrar. ~5 min + propagation.</p>
            </div>
            <div className="card">
              <h4>Nightly DB backup to Blob</h4>
              <p>Schema small but irreplaceable. <strong>Recommended.</strong> Add via a scheduled webjob or GitHub Action that runs <code>VACUUM INTO</code> + <code>az storage blob upload</code>.</p>
            </div>
          </div>
        </section>

        <hr />

        {/* PART VII — FUTURE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">VII</span>Future Migrations</h2>

          <h3>ShopKeep &amp; GLP-1 — per-app deltas</h3>
          <p>Per-app deltas relative to Workshop. Use this as the &ldquo;what&rsquo;s different&rdquo; checklist.</p>

          <h4>ShopKeep</h4>
          <ul>
            <li><strong>Port:</strong> 3002 (container internal, also <code>WEBSITES_PORT</code>).</li>
            <li><strong>Auth:</strong> No server-side JWT validation. Backend just reads <code>X-User-OID</code> header. So no <code>AAD_TENANT_ID</code> / <code>AAD_CLIENT_ID</code> as App Service settings. Those are <em>only</em> Vite build-args (<code>VITE_AZURE_CLIENT_ID</code>, <code>VITE_AZURE_TENANT_ID</code>).</li>
            <li><strong>DB layout:</strong> per-user <code>&lt;oid&gt;.db</code> files directly under <code>/home/data/</code>. Loop <code>VACUUM INTO</code> each one when transferring.</li>
            <li><strong>Volume:</strong> <code>shopkeep_shopkeep-data</code>.</li>
            <li><strong>Storage caveat:</strong> images are stored as SQLite blobs (not in a separate uploads dir). The 10 GB <code>/home/</code> ceiling becomes real if you accumulate hundreds of MB.</li>
          </ul>

          <h4>GLP-1</h4>
          <ul>
            <li><strong>Port:</strong> 3004.</li>
            <li><strong>Auth:</strong> Backend validates JWTs against <code>AAD_TENANT_ID</code> + <code>AAD_CLIENT_ID</code>. These ARE App Service settings.</li>
            <li><strong>DB layout:</strong> per-user <code>users/&lt;oid&gt;.db</code>. <code>LEGACY_DB_PATH</code> handles a one-time auto-migration from the old single-user <code>glp1.db</code> &mdash; safe to leave set; no-op once the file is gone.</li>
            <li><strong>Volume:</strong> check the app&rsquo;s <code>docker-compose.yml</code> for the volume name.</li>
            <li><strong>Build args:</strong> <code>VITE_AAD_CLIENT_ID</code>, <code>VITE_AAD_TENANT_ID</code> (different prefix than Workshop/ShopKeep).</li>
          </ul>

          <h4>Actual time budgets (all three apps migrated 2026-05-15/17)</h4>
          <table>
            <thead><tr><th>Phase</th><th>Workshop</th><th>GLP-1</th><th>ShopKeep</th></tr></thead>
            <tbody>
              <tr><td>Bicep deploy</td><td>~15 min (incl. quota fix)</td><td>~5 min</td><td>~5 min</td></tr>
              <tr><td>Image build (<code>az acr build</code>)</td><td>~3 min</td><td>~3 min</td><td>~3 min</td></tr>
              <tr><td>App settings + restart</td><td>~5 min</td><td>~5 min</td><td>~5 min</td></tr>
              <tr><td>DB + uploads transfer</td><td>~2.5 hours (dead ends)</td><td>~20 min (recipe worked first try)</td><td>~20 min</td></tr>
              <tr><td>Smoke test + custom domain</td><td>~15 min</td><td>~10 min</td><td>~10 min</td></tr>
              <tr><td>GitHub Actions CI/CD</td><td>~30 min (issues #8a&ndash;#8d)</td><td>~90 min (issue #9 OIDC setup)</td><td>~10 min (template is OIDC by default)</td></tr>
              <tr><th>Total</th><th>~4 hours</th><th>~2.5 hours</th><th>~1 hour</th></tr>
            </tbody>
          </table>
          <p>ShopKeep was the cleanest run &mdash; every known issue had a documented workaround baked into the template.</p>
        </section>

        <hr />

        {/* PART VIII — REFERENCE */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">VIII</span>Reference</h2>

          <h3 id="glossary">Glossary</h3>
          <dl>
            <dt><strong>ACR</strong></dt><dd>Azure Container Registry. Microsoft&rsquo;s managed Docker registry.</dd>
            <dt><strong>App Service</strong></dt><dd>Azure&rsquo;s PaaS for hosting web apps and containers.</dd>
            <dt><strong>App Service Plan</strong></dt><dd>The VM/SKU tier that runs web apps. You pay per plan.</dd>
            <dt><strong>ARM</strong></dt><dd>Azure Resource Manager. The control plane API for everything in Azure. Bicep compiles to ARM JSON.</dd>
            <dt><strong>Bicep</strong></dt><dd>Microsoft&rsquo;s declarative DSL for Azure infrastructure. Compiles to ARM JSON.</dd>
            <dt><strong>Entra ID</strong></dt><dd>Microsoft&rsquo;s identity service. Formerly Azure AD. Holds users + app registrations.</dd>
            <dt><strong>Kudu</strong></dt><dd>The management/admin engine behind every App Service web app. Named after the African antelope.</dd>
            <dt><strong>Managed identity</strong></dt><dd>An Entra service principal Azure creates and rotates for a resource, used for secret-free auth to other resources.</dd>
            <dt><strong>MSAL</strong></dt><dd>Microsoft Authentication Library. The client library for OAuth/OIDC against Entra.</dd>
            <dt><strong>OID</strong></dt><dd>Object ID. The stable, immutable identifier for a user in Entra. Survives email changes.</dd>
            <dt><strong>OIDC</strong></dt><dd>OpenID Connect. The federation standard used by Entra and GitHub Actions for secret-free auth.</dd>
            <dt><strong>Resource group</strong></dt><dd>A logical bucket of Azure resources. Lifecycle unit. Deletes cascade.</dd>
            <dt><strong>SCM site</strong></dt><dd>The Kudu-served admin site for an App Service web app. <code>https://&lt;app&gt;.scm.azurewebsites.net</code>.</dd>
            <dt><strong>SKU</strong></dt><dd>Stock Keeping Unit. The pricing/sizing tier of an Azure resource (B1, P0v3, etc.).</dd>
            <dt><strong>VFS</strong></dt><dd>Virtual File System. Kudu&rsquo;s file-access REST API. <strong>Wrong mount on Linux App Service</strong> &mdash; use the command API instead.</dd>
            <dt><strong>WAL</strong></dt><dd>Write-Ahead Log. SQLite&rsquo;s journaling mode for better concurrency. Has a salt per writer session.</dd>
          </dl>

          <h3 id="cheatsheet">Cheat sheet</h3>
          <h4>Key identifiers</h4>
          <CodePre>{`RG          rg-personal-apps-prod
Region      eastus
Subscription 1cf02211-8d77-4658-bb6a-0f83ec831c3b   (Visual Studio Enterprise)
Entra tenant 52188f12-db6b-46c6-88ff-08c802f0ed3b   (where app registrations live)
ACR         acrenzolopez01.azurecr.io
Plan        plan-prod-lwxhu7jxlrbtu  (B1 Linux)
Workshop    app-workshop-prod-lwxhu7jxlrbtu  → workshop.enzolopez.net
ShopKeep    app-shopkeep-prod-lwxhu7jxlrbtu  → shopkeep.enzolopez.net (DNS pending)
Tare        app-tare-prod-lwxhu7jxlrbtu      → tare.nintek.com`}</CodePre>

          <h4>Most-used commands</h4>
          <CodePre>{`# Verify az session
az account show

# Build & push (with Workshop's MSAL build-args)
az acr build --registry acrenzolopez01 --image workshop:latest \\
    --build-arg VITE_AZURE_CLIENT_ID=0f303f8f-207f-4b7f-84a5-b5d0abcf49d1 \\
    --build-arg VITE_AZURE_TENANT_ID=52188f12-db6b-46c6-88ff-08c802f0ed3b .

# Truth source for build status (CLI exit code unreliable on Windows)
az acr task list-runs --registry acrenzolopez01 --top 1 -o table

# Restart
az webapp restart -g rg-personal-apps-prod -n app-workshop-prod-lwxhu7jxlrbtu

# Health
curl https://app-workshop-prod-lwxhu7jxlrbtu.azurewebsites.net/api/health

# Set / change a secret app setting
az webapp config appsettings set -g rg-personal-apps-prod \\
    -n app-workshop-prod-lwxhu7jxlrbtu \\
    --settings ANTHROPIC_API_KEY=<value>

# Upload data file (uses upload-via-kudu.ps1)
.\\upload-via-kudu.ps1 \`
    -ResourceGroup rg-personal-apps-prod \`
    -WebApp app-workshop-prod-lwxhu7jxlrbtu \`
    -LocalFile C:\\temp\\workshop.db \`
    -RemotePath /home/data/workshop.db \`
    -StopAppDuringUpload`}</CodePre>

          <h4>Don&rsquo;t do these things</h4>
          <ul>
            <li>Do <strong>not</strong> use Kudu file manager / VFS / FTPS for <code>/home/data/</code> on Linux &mdash; wrong mount.</li>
            <li>Do <strong>not</strong> copy <code>.db-wal</code> or <code>.db-shm</code> between machines &mdash; WAL salt mismatch will wipe data.</li>
            <li>Do <strong>not</strong> create resources in the portal while a Bicep deploy is in flight.</li>
            <li>Do <strong>not</strong> trust the Azure CLI exit code on Windows for <code>acr build</code> / <code>log tail</code> &mdash; check <code>az acr task list-runs</code>.</li>
            <li>Do <strong>not</strong> assume the <code>.db</code> in the repo is the live DB &mdash; production data is in the Docker volume.</li>
            <li>Do <strong>not</strong> rely on the runner-user&rsquo;s cached <code>az login</code> for ARM API calls &mdash; DPAPI sessions will expire and break <code>az webapp restart</code>. Use OIDC.</li>
            <li>Do <strong>not</strong> set state-bearing env vars to relative paths (e.g., <code>./data/backups</code>) &mdash; they land on ephemeral storage. Use <code>/home/data/...</code>.</li>
            <li>Do <strong>not</strong> use em-dashes or other multi-byte UTF-8 characters in PowerShell scripts without a UTF-8 BOM &mdash; PS 5.1 mis-decodes them.</li>
          </ul>
        </section>

        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--rust)', marginBottom: 8 }}>
            ☁️ Closet to Cloud
          </div>
          v4 · 2026-05-21 (RCA #19: Bicep wipes post-deploy secrets &mdash; restore-secrets.ps1 helper added; cairn entry in main.bicepparam). Companion: the AI Features in Your Apps guide covers the Anthropic SDK side
          (prompt caching, tool use, evals, cost engineering) — they pair well, since Workshop&rsquo;s AI routes
          run on the App Service this guide provisions.
        </div>
      </main>
    </div>
  );
}
