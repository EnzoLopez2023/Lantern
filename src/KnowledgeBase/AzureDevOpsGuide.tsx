import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'What is Azure DevOps?',         icon: '🏛️' },
  { id: 's2',  num: '2',  title: 'Services & hierarchy',          icon: '🌳' },
  { id: 's3',  num: '3',  title: 'Identity & process templates',  icon: '🔐' },
  { id: 's4',  num: '4',  title: 'Pricing & onboarding',          icon: '💰' },
  { id: 's5',  num: '5',  title: 'Azure Repos',                   icon: '📦' },
  { id: 's6',  num: '6',  title: 'Branch policies',               icon: '🛡️' },
  { id: 's7',  num: '7',  title: 'Pull requests',                 icon: '🔀' },
  { id: 's8',  num: '8',  title: 'Azure Boards',                  icon: '📋' },
  { id: 's9',  num: '9',  title: 'AB# linking & traceability',    icon: '🔗' },
  { id: 's10', num: '10', title: 'What pipelines are + YAML',     icon: '⚙️' },
  { id: 's11', num: '11', title: 'Triggers, agents, service conn.',icon: '🚦' },
  { id: 's12', num: '12', title: 'Variables, params, templates',  icon: '🧩' },
  { id: 's13', num: '13', title: 'Environments & multi-stage',    icon: '🚀' },
  { id: 's14', num: '14', title: 'Artifacts & Test Plans',        icon: '📤' },
  { id: 's15', num: '15', title: 'Security & governance',         icon: '🔒' },
  { id: 's16', num: '16', title: 'CLI, API, ADO vs GitHub',       icon: '🔧' },
  { id: 's17', num: 'A',  title: 'Troubleshooting & cheat sheet', icon: '🩺' },
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
      <button className="copy-btn" type="button" onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
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
          <button key={t.id} type="button" className={`tab-btn ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="tab-panel">{current?.content}</div>
    </div>
  );
}

export default function AzureDevOpsGuide() {
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
              <path d="M7 8h14v3H7zM7 13h10v3H7zM7 18h12v3H7z" fill="white" opacity="0.9" />
            </svg>
            <span className="sidebar-title">Azure DevOps</span>
          </div>
          <div className="sidebar-sub">Boards · Repos · Pipelines · Artifacts</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          <div className="progress-label">{readSections.size} of {SECTIONS.length} sections read</div>
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
                  <span className="nav-num">{s.num}</span>{s.icon} {s.title}
                </a>
              ))
            )}
          </div>
        </nav>
      </aside>

      <main>
        <div className="hero">
          <div className="hero-tag">🚀 Azure DevOps · 2026</div>
          <h1>Azure DevOps<br />End-to-End</h1>
          <p>
            Not just <em>what to click</em> — a complete learning reference. For each concept: what it is, why it exists, when to use it, and how it connects to everything else. Spans all <strong style={{ color: '#C77AA0' }}>five services</strong> (Boards, Repos, Pipelines, Artifacts, Test Plans) with the depth and gotchas you only learn from production projects.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">17</span><span className="hero-stat-label">Chapters</span></div>
            <div className="hero-stat"><span className="hero-stat-val">5</span><span className="hero-stat-label">Services</span></div>
            <div className="hero-stat"><span className="hero-stat-val">18+</span><span className="hero-stat-label">Diagrams</span></div>
            <div className="hero-stat"><span className="hero-stat-val">$0</span><span className="hero-stat-label">Free tier (≤5)</span></div>
          </div>
        </div>

        {/* SECTION 1 — WHAT IS ADO */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>What is Azure DevOps?</h2>

          <p><strong>Azure DevOps is Microsoft's integrated toolchain for the entire software development lifecycle</strong> — plan, code, build, test, release, deploy, monitor. It's the SaaS evolution of Microsoft's on-premises Team Foundation Server (TFS) lineage, which traces back to 2005:</p>

          <CodePre>{`TFS (2005) → VSTS (2015) → Azure DevOps Services (2018) → today`}</CodePre>

          <p>The on-premises product is now called <strong>Azure DevOps Server</strong>. The cloud version — <strong>Azure DevOps Services</strong>, hosted at <code>dev.azure.com</code> — is what almost everyone means by "Azure DevOps" today.</p>

          <h3>What does it actually do?</h3>
          <p>It provides <strong>five separate services</strong> that work together:</p>

          <table>
            <tbody>
              <tr><th>Service</th><th>What it provides</th></tr>
              <tr><td><strong>Azure Boards</strong></td><td>Agile planning: work items, backlogs, sprints, Kanban boards, dashboards</td></tr>
              <tr><td><strong>Azure Repos</strong></td><td>Git (and legacy TFVC) hosting with <strong>branch policies</strong> and pull requests</td></tr>
              <tr><td><strong>Azure Pipelines</strong></td><td>CI/CD — automated build, test, and deploy</td></tr>
              <tr><td><strong>Azure Test Plans</strong></td><td>Manual and exploratory test case management</td></tr>
              <tr><td><strong>Azure Artifacts</strong></td><td>Package registry — npm, NuGet, Maven, Python, Universal Packages</td></tr>
            </tbody>
          </table>

          <p>You can use any subset. Many teams use <strong>Boards + Pipelines</strong> but keep their code in GitHub. Others use <strong>Repos + Pipelines</strong> and skip Boards in favor of Jira or Linear. The flexibility is intentional.</p>

          <h3>Azure DevOps vs the alternatives</h3>
          <table>
            <tbody>
              <tr><th>Tool</th><th>Strength</th><th>Weakness</th></tr>
              <tr><td><strong>Azure DevOps</strong></td><td>One integrated platform, deep Entra ID integration, branch policies are excellent, free for ≤5 users</td><td>UI looks dated; Boards is functional but not as slick as Linear/Jira</td></tr>
              <tr><td><strong>GitHub</strong></td><td>De-facto open-source home, Copilot, vibrant community, simpler UI</td><td>"Boards" (Projects) is newer; some enterprise governance still maturing</td></tr>
              <tr><td><strong>GitLab</strong></td><td>Self-hostable, all-in-one similar to ADO, strong CI</td><td>Smaller market share; UX changes a lot release-to-release</td></tr>
              <tr><td><strong>Atlassian</strong></td><td>Best-of-breed Jira; tight integration with Confluence</td><td>Two products, two billing surfaces; Bitbucket lags GitHub features</td></tr>
            </tbody>
          </table>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Practical rule.</strong> If you're already in the Microsoft ecosystem (Entra ID, Azure, Visual Studio), Azure DevOps is the path of least resistance. If you want the largest dev community and best AI tooling, GitHub. Microsoft owns both — they're not in conflict.</div>
          </div>
        </section>

        {/* SECTION 2 — SERVICES & HIERARCHY */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>The five services and how they fit together</h2>

          <p>Azure DevOps isn't one product — it's a hub. The services share <strong>identity, permissions, and project context</strong>, but each is independent enough that you can adopt them piecemeal.</p>

          <MermaidDiagram theme="default" chart={`graph TB
    subgraph Project["Azure DevOps Project"]
        Boards[Azure Boards<br/>Plan work]
        Repos[Azure Repos<br/>Store code]
        Pipelines[Azure Pipelines<br/>Build and deploy]
        Artifacts[Azure Artifacts<br/>Publish packages]
        TestPlans[Azure Test Plans<br/>Verify quality]
    end
    Boards -.->|AB#123 link| Repos
    Boards -.->|AB#123 link| Pipelines
    Repos -->|commit triggers| Pipelines
    Pipelines -->|publish| Artifacts
    Pipelines -.->|consume| Artifacts
    Pipelines -->|deploy to| Azure[Azure / AWS / GCP / on-prem]
    TestPlans -.->|link tests to| Boards
    style Boards fill:#0078d4,color:#fff
    style Repos fill:#0078d4,color:#fff
    style Pipelines fill:#0078d4,color:#fff
    style Artifacts fill:#0078d4,color:#fff
    style TestPlans fill:#0078d4,color:#fff`} />

          <p>The arrows that aren't bold are the killer integrations:</p>
          <ul>
            <li>A commit message containing <code>AB#42</code> auto-links the commit to work item 42 in Boards</li>
            <li>The pipeline that runs from that commit also gets linked to work item 42</li>
            <li>The PR that contains the commit gets linked too</li>
            <li>All of this rolls up: from a single work item, you can see every commit, PR, pipeline run, and deployment that touched it</li>
          </ul>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>Why this matters.</strong> That cross-service traceability is one of Azure DevOps's strongest features. You don't get the same depth wiring GitHub + Jira together — the cross-tool links exist but they require maintenance and break easily.</div>
          </div>

          <h3>Organizations, projects, teams — the hierarchy</h3>
          <MermaidDiagram theme="default" chart={`graph TD
    EntraID[Microsoft Entra ID Tenant<br/>identity boundary]
    EntraID --> Org1[Azure DevOps Organization<br/>billing + parallelism boundary]
    EntraID --> Org2[Another Organization]
    Org1 --> Proj1[Project A<br/>workspace boundary]
    Org1 --> Proj2[Project B]
    Proj1 --> Team1[Team: Backend]
    Proj1 --> Team2[Team: Frontend]
    Proj1 --> ProjResources["Boards + Repos + Pipelines<br/>+ Artifacts + Test Plans"]
    Team1 --> Areas[Area paths<br/>+ Iteration paths]
    Team2 --> Areas
    style EntraID fill:#1e3a5f,stroke:#4f9eff,color:#fff
    style Org1 fill:#1f3a2f,stroke:#6fdc8c,color:#fff
    style Proj1 fill:#3a2f1f,stroke:#ffb454,color:#fff`} />

          <table>
            <tbody>
              <tr><th>Layer</th><th>What it is</th><th>When you create one</th></tr>
              <tr><td><strong>Entra ID Tenant</strong></td><td>The identity directory your users live in</td><td>Already exists if your company uses Microsoft 365</td></tr>
              <tr><td><strong>Organization</strong></td><td>The top-level container at <code>dev.azure.com/&#123;org&#125;</code>. Owns billing, parallel job allowances, extensions, audit log.</td><td>One per company, or one per major business unit. URLs and parallelism are per-organization, so splitting too granularly creates friction.</td></tr>
              <tr><td><strong>Project</strong></td><td>The workspace that holds repos, boards, pipelines, etc.</td><td>One per product. Don't put two unrelated products in one project — they'll share permissions, Boards processes, and dashboards.</td></tr>
              <tr><td><strong>Team</strong></td><td>A subset of a project with its own backlog, sprints, and area path</td><td>One per squad. Many projects start with just the default team.</td></tr>
              <tr><td><strong>Area paths</strong></td><td>A hierarchical tag for work items (e.g., <code>MyProduct\Mobile\iOS</code>)</td><td>Mirror your team or product structure</td></tr>
              <tr><td><strong>Iteration paths</strong></td><td>A hierarchical tag for time (e.g., <code>2026\Q2\Sprint 3</code>)</td><td>Define your sprint cadence</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The two-tenant gotcha.</strong> Just like Azure subscriptions, an Azure DevOps organization can be connected to a different Entra tenant than the one you'd guess. Find this at <strong>Organization Settings → Azure Active Directory</strong>. If users get unexpected "no access" errors, it's almost always because they're signed into one tenant while the org is bound to another. Check <code>https://dev.azure.com/&#123;org&#125;/_settings/organizationAad</code>.</div>
          </div>
        </section>

        {/* SECTION 3 — IDENTITY & PROCESS TEMPLATES */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Identity, authentication, process templates</h2>

          <h3>Identity types</h3>
          <table>
            <tbody>
              <tr><th>Identity</th><th>Source</th><th>Use for</th></tr>
              <tr><td><strong>Microsoft account (MSA)</strong></td><td><code>outlook.com</code>, personal accounts</td><td>Personal projects, demos</td></tr>
              <tr><td><strong>Work/school account</strong></td><td>Your Entra tenant (<code>@contoso.com</code>)</td><td>Real work; required for SSO, conditional access, audit log</td></tr>
              <tr><td><strong>Service principal / managed identity</strong></td><td>Entra applications</td><td>Automation (pipelines, scripts, GitHub Actions calling into ADO)</td></tr>
            </tbody>
          </table>

          <h3>How a user actually authenticates to ADO</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
    participant User
    participant Browser
    participant ADO as Azure DevOps
    participant Entra as Microsoft Entra ID
    User->>Browser: Visit dev.azure.com/myorg
    Browser->>ADO: GET /myorg
    ADO->>Entra: Redirect to login (if not authed)
    Entra->>Browser: Login page (MFA, conditional access)
    User->>Entra: Credentials + MFA
    Entra->>Browser: ID token + access token
    Browser->>ADO: Authenticated request with token
    ADO->>ADO: Look up user in org members<br/>Check permissions
    ADO->>Browser: Render page`} />

          <h3>Three options for git operations</h3>
          <ol>
            <li><strong>Git Credential Manager (GCM)</strong> — the modern default, ships with Git for Windows. Pops up a browser window the first time, handles MFA, then caches the token. <em>Use this unless you have a specific reason not to.</em></li>
            <li><strong>SSH keys</strong> — generate, upload to <strong>User settings → SSH public keys</strong>. Useful when you're on a network blocking HTTPS (rare) or you want zero-prompt automation on a single machine.</li>
            <li><strong>Personal Access Tokens (PATs)</strong> — username + token-as-password. PATs expire (max 1 year), have specific scopes, and can be revoked. <em>Treat them like passwords.</em></li>
          </ol>

          <h3>Process templates — Basic vs Agile vs Scrum vs CMMI</h3>
          <p>When you create a project, ADO asks which <strong>process template</strong> to use. This determines the work item types you get, their fields, their states, and the default workflow.</p>

          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Creating a project] --> B{How does<br/>your team work?}
    B -->|Just lists of tasks<br/>I want it simple| C[Basic<br/>3 work item types]
    B -->|User stories,<br/>iterative delivery| D[Agile<br/>5 work item types]
    B -->|Strict Scrum vocabulary<br/>PBI, Impediment| E[Scrum<br/>4 work item types]
    B -->|Regulated industry,<br/>formal requirements| F[CMMI<br/>8 work item types]
    style C fill:#4a8b3b,color:#fff
    style D fill:#4a8b3b,color:#fff`} />

          <table>
            <tbody>
              <tr><th>Template</th><th>Work items</th><th>When to pick</th></tr>
              <tr><td><strong>Basic</strong></td><td>Epic → Issue → Task</td><td>Smallest learning curve. Personal or small-team projects. Hard to upgrade later.</td></tr>
              <tr><td><strong>Agile</strong></td><td>Epic → Feature → User Story → Task; Bug as peer to Story</td><td>Most common pick. Generic enough for any agile flavor. <strong>Default recommendation.</strong></td></tr>
              <tr><td><strong>Scrum</strong></td><td>Epic → Feature → Product Backlog Item → Task; Impediment</td><td>Pick if your team uses formal Scrum terminology and wants <code>Impediment</code> as a first-class concept.</td></tr>
              <tr><td><strong>CMMI</strong></td><td>Epic → Feature → Requirement → Task + Change Request, Risk, Review</td><td>Regulated industries (healthcare, defense, banking). Heavy.</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Choose carefully.</strong> You choose this once <em>per project</em> and changing it later is painful. If you have any doubt, pick <strong>Agile</strong>. You can customize further with an <strong>inherited process</strong> (copy Agile, add custom fields/states). Inherited processes are managed at <strong>Organization Settings → Process</strong>.</div>
          </div>
        </section>

        {/* SECTION 4 — PRICING & ONBOARDING */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Pricing &amp; onboarding</h2>

          <h3>Free tier and parallelism</h3>
          <table>
            <tbody>
              <tr><th>Resource</th><th>Free quota</th><th>Paid pricing</th></tr>
              <tr><td><strong>Users (Basic)</strong></td><td>5 free</td><td>$6/user/mo after</td></tr>
              <tr><td><strong>Stakeholders</strong></td><td>Unlimited free</td><td>Free — read-only access to Boards</td></tr>
              <tr><td><strong>Test Plans users</strong></td><td>None free</td><td>$52/user/mo (this is the expensive one)</td></tr>
              <tr><td><strong>MS-hosted parallel jobs (public)</strong></td><td>10 free parallel jobs</td><td>n/a</td></tr>
              <tr><td><strong>MS-hosted parallel jobs (private)</strong></td><td><strong>1 free parallel job, 1800 min/mo</strong></td><td>$40/parallel job/mo (unlimited minutes)</td></tr>
              <tr><td><strong>Self-hosted parallel jobs</strong></td><td>1 free</td><td>$15/parallel job/mo (unlimited minutes)</td></tr>
              <tr><td><strong>Azure Artifacts storage</strong></td><td>2 GB free</td><td>$2/GB/mo over 2 GB</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The '1 free parallel job' trap.</strong> A single free parallel job means pipelines queue serially. If three commits hit <code>main</code> in 5 minutes, the third commit waits until the first two finish their entire pipeline. For solo work this is fine. For teams of 3+ where everyone wants quick CI feedback, buy at least 2 paid parallel jobs.</div>
          </div>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>MSDN subscriber benefit.</strong> If you're an MSDN Visual Studio subscriber, you get an additional free parallel job — link your subscription at <strong>Organization Settings → Billing</strong>.</div>
          </div>

          <h3>Create your first organization</h3>
          <ol>
            <li>Open <a href="https://dev.azure.com" target="_blank" rel="noreferrer">https://dev.azure.com</a>.</li>
            <li>Sign in with the account you want the org to be billed against.</li>
            <li>If you have no organization yet, ADO offers <strong>+ New organization</strong>.</li>
            <li>Pick a <strong>name</strong> — this becomes the URL: <code>dev.azure.com/&#123;name&#125;</code>. Globally unique, hard to change.</li>
            <li>Pick a <strong>region</strong> — Microsoft-hosted agents and the database live here. Pick the region closest to your team. <em>You cannot change this after creation.</em></li>
          </ol>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Why region matters.</strong> If your team is in the US East but your org is in Australia, every git push, pipeline trigger, and page load adds ~150ms. Over a workday, that's noticeable.</div>
          </div>

          <h3>Create a project — what each setting means</h3>
          <table>
            <tbody>
              <tr><th>Setting</th><th>What it controls</th><th>Recommendation</th></tr>
              <tr><td><strong>Name</strong></td><td>Folder name in the URL</td><td>Use kebab-case or PascalCase; no spaces</td></tr>
              <tr><td><strong>Description</strong></td><td>Project landing-page blurb</td><td>Future-you and teammates will thank you</td></tr>
              <tr><td><strong>Visibility</strong></td><td>Public or Private</td><td><strong>Private</strong> unless you want anonymous internet users to see it</td></tr>
              <tr><td><strong>Version control</strong></td><td>Git or TFVC</td><td><strong>Git.</strong> TFVC is the legacy centralized model</td></tr>
              <tr><td><strong>Work item process</strong></td><td>Basic, Agile, Scrum, CMMI</td><td><strong>Agile</strong> as the default. See §3.</td></tr>
            </tbody>
          </table>

          <h3>Project settings to know on day one</h3>
          <table>
            <tbody>
              <tr><th>Section</th><th>What's in it</th></tr>
              <tr><td><strong>General → Overview</strong></td><td>Rename, change description, set visibility, delete</td></tr>
              <tr><td><strong>General → Teams</strong></td><td>Default team plus any extras; configure area/iteration paths</td></tr>
              <tr><td><strong>Boards → Project configuration</strong></td><td>Iteration cadence (sprint length), areas, working days</td></tr>
              <tr><td><strong>Repos → Repositories</strong></td><td>Default branch name (set to <code>main</code>), per-repo permissions</td></tr>
              <tr><td><strong>Repos → Policies</strong></td><td>Repository-wide policies (commit author email, max file size, secret scanning)</td></tr>
              <tr><td><strong>Pipelines → Settings</strong></td><td>Default agent pool, allow forks to run pipelines, retention</td></tr>
              <tr><td><strong>Pipelines → Service connections</strong></td><td>Connections to Azure, AWS, GitHub, Docker registries — your "credentials vault"</td></tr>
              <tr><td><strong>Pipelines → Environments</strong></td><td>Named deploy targets with approvals (e.g., <code>prod-app-service</code>)</td></tr>
              <tr><td><strong>Pipelines → Library</strong></td><td>Variable groups, secure files</td></tr>
              <tr><td><strong>Permissions</strong></td><td>Project-level security groups — Project Administrators, Contributors, Readers</td></tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 5 — AZURE REPOS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Azure Repos</h2>

          <p>Azure Repos is a hosted source control service. Each project can host:</p>
          <ul>
            <li><strong>Many Git repositories</strong> (the modern, default choice)</li>
            <li><strong>One TFVC repository</strong> (Team Foundation Version Control — centralized, like SVN; legacy)</li>
          </ul>

          <p>Unless you're working in an existing TFVC codebase, <strong>always pick Git</strong>. TFVC's only real advantage is partial checkout of giant codebases, and modern Git has sparse-checkout for that.</p>

          <h3>What Azure Repos layers on top of Git</h3>
          <MermaidDiagram theme="default" chart={`graph TB
    A[Git protocol<br/>standard everywhere] --> B[Azure Repos<br/>Git server]
    B --> Layer1[Branch policies]
    B --> Layer2[Pull request system]
    B --> Layer3[Required reviewers groups]
    B --> Layer4[Build validation]
    B --> Layer5[Work item linking]
    B --> Layer6[Code search]
    B --> Layer7[Mirror to GitHub]
    style B fill:#0078d4,color:#fff`} />

          <h3>Cloning and auth flows</h3>
          <CodePre>{`# HTTPS — uses Git Credential Manager
git clone https://dev.azure.com/myorg/myproject/_git/myrepo

# SSH — uses an SSH key uploaded to your user settings
git clone git@ssh.dev.azure.com:v3/myorg/myproject/myrepo`}</CodePre>

          <MermaidDiagram theme="default" chart={`flowchart LR
    A[git clone] --> B{Auth method}
    B -->|HTTPS| C[Git Credential Manager]
    C --> D[Opens browser for<br/>Entra ID sign-in]
    D --> E[Caches OAuth token<br/>~90 day refresh]
    B -->|SSH| F[SSH key<br/>uploaded to ADO]
    F --> G[No prompts after setup]
    B -->|PAT| H[Username:any<br/>Password:PAT]
    H --> I[Expires per token TTL<br/>max 1 year]
    style E fill:#4a8b3b,color:#fff
    style G fill:#4a8b3b,color:#fff`} />

          <ul>
            <li><strong>For developers:</strong> HTTPS + GCM. Modern, MFA-friendly, no key management.</li>
            <li><strong>For CI scripts inside other systems:</strong> OIDC if the target supports it (see §11); otherwise PATs.</li>
            <li><strong>For one specific machine that hates browsers:</strong> SSH.</li>
          </ul>

          <h3>Cloning in VS Code</h3>
          <ol>
            <li>Open <strong>Visual Studio Code</strong>.</li>
            <li>Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> to open the Command Palette.</li>
            <li>Search for and select <strong>Git: Clone</strong>.</li>
            <li>Paste the Azure DevOps clone URL.</li>
            <li>Choose the local folder where you want the repository stored.</li>
            <li>When prompted, choose <strong>Open</strong>.</li>
            <li>Sign in if VS Code asks you to authenticate to Azure DevOps.</li>
          </ol>

          <h3>Branch strategies</h3>
          <MermaidDiagram theme="default" chart={`graph TB
    subgraph TrunkBased[Trunk-based development]
        Main1[main] --> Feature1[short-lived<br/>feature branches<br/>merge same day]
    end
    subgraph GitHubFlow[GitHub Flow]
        Main2[main] --> Feature2[feature/x<br/>days to ~1 week]
        Feature2 --> Main2
    end
    subgraph GitFlow[Git Flow]
        Main3[main] --> Develop[develop]
        Develop --> Feature3[feature/x]
        Develop --> Release[release/1.2]
        Main3 --> Hotfix[hotfix/y]
    end
    style TrunkBased fill:#1f3a2f,stroke:#6fdc8c,color:#fff
    style GitHubFlow fill:#1f3a2f,stroke:#6fdc8c,color:#fff
    style GitFlow fill:#3a2f1f,stroke:#ffb454,color:#fff`} />

          <p>For most teams using Azure DevOps, <strong>GitHub Flow</strong> (everything branches off <code>main</code>, PRs merge back into <code>main</code>) is the right model. Git Flow is overkill outside of versioned libraries with multiple supported releases.</p>

          <h3>Naming conventions</h3>
          <CodePre>{`feat/add-azure-deploy
fix/login-redirect-loop
refactor/extract-auth-service
docs/update-readme
chore/upgrade-vite-5`}</CodePre>
        </section>

        {/* SECTION 6 — BRANCH POLICIES */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Branch policies — Azure Repos' killer feature</h2>

          <p>This is the section where Azure Repos pulls ahead of GitHub for many enterprise teams. Branch policies are configurable rules attached to a branch (typically <code>main</code>) that <strong>gate pull requests</strong> from merging.</p>

          <MermaidDiagram theme="default" chart={`flowchart TB
    A[PR opened to main] --> B{Branch policies}
    B -->|Required reviewers met?| C{Build validation passes?}
    C -->|Yes| D{Comments resolved?}
    D -->|Yes| E{Linked work item?}
    E -->|Yes| F{Merge type allowed?}
    F -->|Yes| G[Complete button enabled]
    B -->|No| X[Blocked]
    C -->|No| X
    D -->|No| X
    E -->|No| X
    F -->|No| X
    style G fill:#4a8b3b,color:#fff
    style X fill:#a8542e,color:#fff`} />

          <h3>Every policy you can configure</h3>
          <table>
            <tbody>
              <tr><th>Policy</th><th>What it does</th><th>Typical setting</th></tr>
              <tr><td>Require a minimum number of reviewers</td><td>N approvals before merge</td><td>1 for solo / 2 for team</td></tr>
              <tr><td>Check for linked work items</td><td>PR must reference an <code>AB#</code> work item</td><td>On for production code</td></tr>
              <tr><td>Check for comment resolution</td><td>All inline comments must be resolved</td><td>On</td></tr>
              <tr><td>Limit merge types</td><td>Force squash, no merge commits, etc.</td><td>Squash for short-lived branches</td></tr>
              <tr><td>Build validation</td><td>Pipeline runs against the PR; must pass</td><td>On — pick your CI pipeline</td></tr>
              <tr><td>Required reviewers (by file path)</td><td>Specific user/group must review changes to certain paths</td><td>CODEOWNERS-style policies</td></tr>
              <tr><td>Status checks (external)</td><td>Third-party services post status</td><td>Optional</td></tr>
              <tr><td>Automatically include reviewers</td><td>Auto-add reviewers when changes touch certain paths</td><td>Better than ad-hoc tagging</td></tr>
            </tbody>
          </table>

          <h3>Setting them up (UI)</h3>
          <p><strong>Project Settings → Repositories → [your repo] → Policies → Branch policies → main</strong></p>

          <p>The most important nuances:</p>
          <ul>
            <li><strong>"Reset code reviewer votes when there are new changes"</strong> — best practice ON. Otherwise a sneaky later commit could land without re-review.</li>
            <li><strong>"Build validation → Required"</strong> vs <strong>"Optional"</strong>: required means the merge button greys out until the pipeline passes. Set to <strong>Required</strong> for the primary CI pipeline.</li>
            <li><strong>"Build expiration"</strong> — if a PR sits open longer than X hours after the build ran, require a re-run. Default 12 hours is reasonable.</li>
          </ul>

          <h3>Setting them up (CLI)</h3>
          <CodePre>{`# Require approver count
az repos policy approver-count create \\
  --repository-id <guid> \\
  --branch main \\
  --branch-match-type exact \\
  --minimum-approver-count 1 \\
  --creator-vote-counts false \\
  --reset-on-source-push true \\
  --allow-downvotes false

# Require build validation
az repos policy build create \\
  --repository-id <guid> \\
  --branch main \\
  --build-definition-id 42 \\
  --display-name "Required CI" \\
  --queue-on-source-update-only true \\
  --valid-duration 720 \\
  --manual-queue-only false \\
  --enabled true`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>Cross-repo policies.</strong> Newer feature: at <strong>Project Settings → Repositories → Policies</strong> (not under a specific repo), you can apply a policy to all repos in the project — e.g., "no commit may have a non-corporate email" or "no file &gt;50 MB."</div>
          </div>
        </section>

        {/* SECTION 7 — PULL REQUESTS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Pull requests &amp; code search</h2>

          <h3>The full PR lifecycle</h3>
          <MermaidDiagram theme="default" chart={`stateDiagram-v2
    [*] --> Draft: gh-style or "Mark as draft"
    Draft --> Active: Mark as ready
    Active --> Approved: Reviewers approve
    Active --> Rejected: Reviewer rejects (block)
    Active --> WaitingForAuthor: Reviewer says "Wait for author"
    WaitingForAuthor --> Active: Author addresses feedback
    Approved --> Completed: Author clicks Complete
    Approved --> AutoCompleted: Auto-complete triggers
    Completed --> [*]
    Rejected --> Active: Author addresses
    Active --> Abandoned: Closed without merge
    Abandoned --> [*]`} />

          <h3>Key features</h3>
          <table>
            <tbody>
              <tr><th>Feature</th><th>What it does</th></tr>
              <tr><td><strong>Draft PR</strong></td><td>Open the PR for visibility (CI runs, others can see) but signal "not ready"</td></tr>
              <tr><td><strong>Auto-complete</strong></td><td>Mark a PR to auto-merge once all policies pass — saves you coming back</td></tr>
              <tr><td><strong>Suggestions</strong></td><td>Reviewers can propose exact code edits; author clicks one button to apply</td></tr>
              <tr><td><strong>Required reviewers</strong></td><td>Configured per file path or globally</td></tr>
              <tr><td><strong>Linked work items</strong></td><td>Auto-detected from branch name or commit messages</td></tr>
              <tr><td><strong>Squash merge</strong></td><td>Combine all PR commits into one on <code>main</code></td></tr>
              <tr><td><strong>Cherry-pick / revert</strong></td><td>Built-in buttons on the PR after merge</td></tr>
              <tr><td><strong>PR templates</strong></td><td><code>.azuredevops/pull_request_template.md</code> auto-fills the description</td></tr>
            </tbody>
          </table>

          <h3>PR template example</h3>
          <p>Create <code>.azuredevops/pull_request_template.md</code>:</p>
          <CodePre>{`## Summary
<!-- What does this PR do? -->

## Why
<!-- Motivation, link to work item -->

## Test plan
- [ ] Manual test: ...
- [ ] Added unit tests
- [ ] Verified CI passes

Related work item: AB#`}</CodePre>

          <h3>Creating a PR via CLI</h3>
          <CodePre>{`# Push and create PR
git push -u origin feat/add-auth
az repos pr create \\
  --title "Add OIDC auth" \\
  --description "Replaces password flow with Entra ID" \\
  --source-branch feat/add-auth \\
  --target-branch main \\
  --auto-complete \\
  --squash \\
  --delete-source-branch`}</CodePre>

          <h3>Code search and semantic review</h3>
          <p><strong>Code search</strong> is enabled per-project at <strong>Project Settings → Marketplace → Code Search</strong> (free extension). Once enabled, the search bar at the top searches <em>across all files in all repos</em> with operators:</p>

          <CodePre>{`file:server.js          # only this filename
ext:tsx                 # only files with this extension
proj:MyProject          # restrict to a project
repo:MyRepo             # restrict to a repo
"exact phrase"          # phrase search
useState                # regex over identifiers`}</CodePre>

          <p>For larger projects this is invaluable — Visual Studio-style "find in solution" but across every repo.</p>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Semantic Code Review.</strong> Newer feature, Copilot-powered: summarizes large PRs and flags risky changes. Enable at <strong>Organization Settings → Extensions</strong> if you have a Copilot license.</div>
          </div>
        </section>

        {/* SECTION 8 — AZURE BOARDS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Azure Boards</h2>

          <h3>The work item hierarchy (Agile template)</h3>
          <MermaidDiagram theme="default" chart={`graph TB
    Epic[Epic<br/>Quarter-scale outcome]
    Epic --> Feature1[Feature 1<br/>Sprint-to-month scope]
    Epic --> Feature2[Feature 2]
    Feature1 --> Story1[User Story<br/>Sprint-sized, user-facing]
    Feature1 --> Story2[User Story]
    Story1 --> Task1[Task<br/>Hours of work]
    Story1 --> Task2[Task]
    Story1 --> Bug1[Bug<br/>Discovered defect]
    Feature2 --> Story3[User Story]
    style Epic fill:#7e3af2,color:#fff
    style Feature1 fill:#9333ea,color:#fff
    style Feature2 fill:#9333ea,color:#fff
    style Story1 fill:#3b82f6,color:#fff
    style Story2 fill:#3b82f6,color:#fff
    style Story3 fill:#3b82f6,color:#fff
    style Task1 fill:#facc15,color:#000
    style Task2 fill:#facc15,color:#000
    style Bug1 fill:#dc2626,color:#fff`} />

          <table>
            <tbody>
              <tr><th>Type</th><th>Scope</th><th>Owner</th></tr>
              <tr><td><strong>Epic</strong></td><td>Quarters</td><td>Product manager</td></tr>
              <tr><td><strong>Feature</strong></td><td>Weeks-month</td><td>Product owner</td></tr>
              <tr><td><strong>User Story</strong></td><td>Sprint</td><td>Dev team</td></tr>
              <tr><td><strong>Task</strong></td><td>Hours</td><td>Individual developer</td></tr>
              <tr><td><strong>Bug</strong></td><td>Varies</td><td>Whoever owns the affected code</td></tr>
            </tbody>
          </table>

          <h3>Useful fields</h3>
          <table>
            <tbody>
              <tr><th>Field</th><th>Purpose</th></tr>
              <tr><td><strong>Title</strong></td><td>Short imperative summary</td></tr>
              <tr><td><strong>Description</strong></td><td>What and why, ideally with screenshots</td></tr>
              <tr><td><strong>Acceptance Criteria</strong></td><td>Definition of done in bullet form</td></tr>
              <tr><td><strong>State</strong></td><td>Workflow position: New → Active → Resolved → Closed (Agile)</td></tr>
              <tr><td><strong>Assigned To</strong></td><td>One person — accountability</td></tr>
              <tr><td><strong>Iteration Path</strong></td><td>Which sprint</td></tr>
              <tr><td><strong>Area Path</strong></td><td>Which team/component</td></tr>
              <tr><td><strong>Story Points / Effort</strong></td><td>Estimation in story points (Fibonacci typical: 1, 2, 3, 5, 8, 13)</td></tr>
              <tr><td><strong>Priority / Severity</strong></td><td>Triage signals</td></tr>
            </tbody>
          </table>

          <h3>Backlogs, sprints, capacity</h3>
          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Backlog<br/>flat list of all stories] -->|select for sprint| B[Sprint 1 backlog]
    B --> C[Capacity planning]
    C --> D{Capacity exceeded?}
    D -->|Yes| E[Bump items back to backlog]
    D -->|No| F[Start sprint]
    F --> G[Daily: update tasks,<br/>move story states]
    G --> H[Sprint end:<br/>review, retro, close sprint]
    H --> I[Carry incomplete<br/>to next sprint]
    style F fill:#4a8b3b,color:#fff`} />

          <h3>Boards (Kanban) — WIP limits, swimlanes</h3>
          <p>The <strong>Board</strong> view of any backlog is a Kanban board. The columns map to work item states:</p>
          <CodePre>{`New | Active | Resolved | Closed     (Agile, default)`}</CodePre>

          <p>You can customize columns at <strong>Team Settings → Board → Columns</strong>. Each column has:</p>
          <ul>
            <li><strong>Title</strong> (what users see)</li>
            <li><strong>Mapped state(s)</strong> — which underlying state(s) feed this column</li>
            <li><strong>WIP limit</strong> (optional) — column turns red when exceeded</li>
            <li><strong>Definition of Done</strong> — a checklist per column (nice for handoffs)</li>
            <li><strong>Split column</strong> — split into Doing / Done sub-columns</li>
          </ul>

          <h3>Queries — finding work at scale</h3>
          <p>Queries are saved searches over work items. WIQL (Work Item Query Language) under the hood, but the UI is point-and-click.</p>

          <MermaidDiagram theme="default" chart={`graph TB
    A[Query type] --> B[Flat list<br/>simple match]
    A --> C[Tree of work items<br/>parent-child]
    A --> D[Work items and direct links<br/>linked-to relationship]
    style A fill:#0078d4,color:#fff`} />

          <CodePre>{`SELECT [System.Id], [System.Title], [System.State]
FROM workitems
WHERE [System.TeamProject] = @project
  AND [System.WorkItemType] = 'Bug'
  AND [System.State] <> 'Closed'
  AND [System.AssignedTo] = @me
ORDER BY [Microsoft.VSTS.Common.Priority]`}</CodePre>

          <h3>Dashboards</h3>
          <p>A dashboard is a configurable page of widgets. Each project has a default dashboard; you can create more per-team or per-purpose.</p>

          <table>
            <tbody>
              <tr><th>Widget</th><th>Shows</th></tr>
              <tr><td><strong>Sprint burndown</strong></td><td>Remaining work over time in current sprint</td></tr>
              <tr><td><strong>Velocity</strong></td><td>Story points completed per sprint (running average)</td></tr>
              <tr><td><strong>Cumulative flow diagram</strong></td><td>Stacked counts of work items by state over time</td></tr>
              <tr><td><strong>Query results</strong></td><td>Live results from any saved query</td></tr>
              <tr><td><strong>Build history</strong></td><td>Recent pipeline runs and their status</td></tr>
              <tr><td><strong>Pull request</strong></td><td>Open PRs needing your review</td></tr>
              <tr><td><strong>Test results trend</strong></td><td>Pass/fail rate over time</td></tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 9 — AB# LINKING */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>AB# syntax — linking code to work</h2>

          <p>This is one of the most important features and easy to miss: <strong>mentioning <code>AB#42</code> in a commit message, PR title, or PR description automatically links to work item 42</strong>.</p>

          <CodePre>{`git commit -m "feat: add SSO login flow AB#142"`}</CodePre>

          <p>Now work item 142 shows:</p>
          <ul>
            <li>The commit</li>
            <li>The PR (when opened)</li>
            <li>The pipeline run (when it triggers)</li>
            <li>The deployment (if pipeline deploys)</li>
          </ul>
          <p>Everything traceable from one place.</p>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Configuration.</strong> Enable at <strong>Project Settings → Boards → GitHub connections</strong> (if the code is in GitHub) or it's on by default for Azure Repos. The <code>AB#</code> prefix is the default; you can also configure <code>Fixes AB#</code>, <code>Closes AB#</code>, etc., to transition the work item state on merge.</div>
          </div>
        </section>

        {/* SECTION 10 — WHAT PIPELINES ARE + YAML */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>What a pipeline actually is + YAML anatomy</h2>

          <p>Strip away the YAML and the UI: <strong>a pipeline is a recipe for doing work in response to events.</strong></p>

          <MermaidDiagram theme="default" chart={`graph LR
    Event[Event<br/>code push, PR, schedule, manual] --> Run[Pipeline run<br/>numbered instance]
    Run --> Stage1[Stage 1: Build]
    Run --> Stage2[Stage 2: Test]
    Run --> Stage3[Stage 3: Deploy]
    Stage1 --> Job1[Job: build-linux]
    Stage1 --> Job2[Job: build-windows]
    Job1 --> Step1[Step: checkout]
    Job1 --> Step2[Step: npm install]
    Job1 --> Step3[Step: npm run build]
    Job1 -.->|runs on| Agent[Agent<br/>VM or container]
    style Event fill:#0078d4,color:#fff
    style Run fill:#3a2f1f,stroke:#ffb454,color:#fff
    style Agent fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <table>
            <tbody>
              <tr><th>Concept</th><th>What it is</th></tr>
              <tr><td><strong>Event</strong></td><td>The trigger — push, PR, scheduled cron, manual click, another pipeline finishing, an external resource update</td></tr>
              <tr><td><strong>Pipeline</strong></td><td>The YAML file (or Classic UI definition) that describes what to do</td></tr>
              <tr><td><strong>Run</strong></td><td>A specific execution instance (e.g., run #4521). Has a status, logs, artifacts.</td></tr>
              <tr><td><strong>Stage</strong></td><td>A logical grouping of jobs. Stages run in sequence by default. Used to model build → test → deploy.</td></tr>
              <tr><td><strong>Job</strong></td><td>A set of steps that run together on the <strong>same agent</strong>. Jobs within a stage run in parallel by default.</td></tr>
              <tr><td><strong>Step</strong></td><td>A single unit of work — running a script, invoking a task, calling a template.</td></tr>
              <tr><td><strong>Task</strong></td><td>A reusable, pre-packaged step (e.g., <code>AzureCLI@2</code>, <code>PublishTestResults@2</code>). Hundreds in the Marketplace.</td></tr>
              <tr><td><strong>Agent</strong></td><td>A machine (VM or container) that executes a job. Microsoft-hosted or self-hosted.</td></tr>
              <tr><td><strong>Pool</strong></td><td>A group of agents. Jobs reference a pool, not a specific agent.</td></tr>
            </tbody>
          </table>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>Why CI/CD matters.</strong> Two reasons every team eventually adopts pipelines: (1) Repeatable builds — "it works on my machine" stops being acceptable when prod builds on someone else's hardware. (2) Fast feedback — within minutes of a push, every developer knows if their code broke a test, broke a lint rule, or broke the build.</div>
          </div>

          <h3>YAML vs Classic — and why YAML won</h3>
          <table>
            <tbody>
              <tr><th></th><th>YAML pipelines</th><th>Classic pipelines</th></tr>
              <tr><td>Definition</td><td>A <code>.yml</code> file in your repo</td><td>Configured via UI, stored server-side</td></tr>
              <tr><td>Versioning</td><td>Tracked in git alongside your code</td><td>Not version-controlled</td></tr>
              <tr><td>Review</td><td>Goes through PRs like any code</td><td>Direct edit in UI</td></tr>
              <tr><td>Branch-specific config</td><td>Yes — each branch can have its own</td><td>No — one config per pipeline</td></tr>
              <tr><td>Templates / reuse</td><td>Excellent, with extends/parameters</td><td>Limited "task groups"</td></tr>
              <tr><td>MS's recommendation</td><td>✅ All new pipelines</td><td>Legacy only</td></tr>
            </tbody>
          </table>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>Use YAML.</strong> Classic pipelines still exist for backward compatibility but Microsoft hasn't added meaningful new features there in years.</div>
          </div>

          <h3>A minimal azure-pipelines.yml</h3>
          <CodePre>{`trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - script: echo "Hello from Azure Pipelines"
    displayName: 'Run a one-line script'`}</CodePre>

          <h3>A real-world one</h3>
          <CodePre>{`name: $(Date:yyyyMMdd)$(Rev:.r)         # Run number format

trigger:
  branches:
    include: [main]
  paths:
    exclude: ['**/*.md', 'docs/**']

pr:                                      # PR validation
  branches:
    include: [main]

variables:
  - group: shared-prod-secrets           # variable group from Library
  - name: nodeVersion
    value: '20.x'

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - checkout: self
            fetchDepth: 1

          - task: NodeTool@0
            inputs:
              versionSpec: $(nodeVersion)

          - script: |
              npm ci
              npm run lint
              npm test -- --coverage
              npm run build
            displayName: 'Install, lint, test, build'

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: JUnit
              testResultsFiles: '**/junit.xml'

          - publish: $(System.DefaultWorkingDirectory)/dist
            artifact: webapp

  - stage: DeployStaging
    dependsOn: Build
    condition: succeeded()
    jobs:
      - deployment: DeployStaging
        environment: staging
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: webapp
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'azure-staging-svc-conn'
                    appType: webAppLinux
                    appName: myapp-staging
                    package: $(Pipeline.Workspace)/webapp

  - stage: DeployProd
    dependsOn: DeployStaging
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployProd
        environment: production    # has approval gate configured
        strategy:
          runOnce:
            deploy:
              steps:
                - download: current
                  artifact: webapp
                - task: AzureWebApp@1
                  inputs:
                    azureSubscription: 'azure-prod-svc-conn'
                    appType: webAppLinux
                    appName: myapp-prod
                    package: $(Pipeline.Workspace)/webapp`}</CodePre>

          <h3>Key top-level keys</h3>
          <table>
            <tbody>
              <tr><th>Key</th><th>What it does</th></tr>
              <tr><td><code>name</code></td><td>Run number template — uses tokens like <code>$(Date:yyyyMMdd)$(Rev:.r)</code></td></tr>
              <tr><td><code>trigger</code></td><td>CI triggers — branches/paths/tags</td></tr>
              <tr><td><code>pr</code></td><td>PR validation triggers</td></tr>
              <tr><td><code>schedules</code></td><td>Cron triggers</td></tr>
              <tr><td><code>resources</code></td><td>External resources (other repos, pipelines, containers, packages)</td></tr>
              <tr><td><code>parameters</code></td><td>Runtime parameters (when you click "Run pipeline")</td></tr>
              <tr><td><code>variables</code></td><td>Pipeline-scoped variables, variable groups, key vault links</td></tr>
              <tr><td><code>pool</code></td><td>Default agent pool</td></tr>
              <tr><td><code>stages</code> / <code>jobs</code> / <code>steps</code></td><td>The work hierarchy — pick the right depth for your scenario</td></tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 11 — TRIGGERS, AGENTS, SERVICE CONNECTIONS */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Triggers, agents &amp; service connections</h2>

          <h3>Trigger types</h3>
          <MermaidDiagram theme="default" chart={`graph TB
    Triggers[Triggers] --> CI[CI trigger]
    Triggers --> PR[PR trigger]
    Triggers --> Sched[Scheduled trigger]
    Triggers --> Resource[Resource trigger]
    Triggers --> Manual[Manual / API]
    CI --> CIDesc[Push to specific branches/tags/paths]
    PR --> PRDesc[PR opened/updated against specific branches]
    Sched --> SchedDesc[Cron expression, with branch filter]
    Resource --> ResDesc[Another pipeline finished,<br/>or a repo/container/package updated]
    Manual --> ManualDesc[User clicks Run,<br/>or REST API call,<br/>or Az CLI]
    style Triggers fill:#0078d4,color:#fff`} />

          <h4>CI trigger</h4>
          <CodePre>{`trigger:
  batch: true                    # collapse rapid pushes into one run
  branches:
    include: [main, release/*]
    exclude: [feature/*]
  paths:
    include: [src/**, package.json]
    exclude: ['**/*.md']
  tags:
    include: [v*]`}</CodePre>

          <h4>PR trigger</h4>
          <CodePre>{`pr:
  branches:
    include: [main]
  paths:
    include: [src/**]
  drafts: false                  # skip draft PRs`}</CodePre>

          <h4>Scheduled trigger (cron)</h4>
          <CodePre>{`schedules:
  - cron: "0 6 * * 1-5"          # 6 AM weekdays UTC
    displayName: 'Daily smoke test'
    branches:
      include: [main]
    always: false                # only run if there are new commits`}</CodePre>

          <h4>Resource trigger — when another pipeline finishes</h4>
          <CodePre>{`resources:
  pipelines:
    - pipeline: backend          # local alias
      source: 'Backend CI'       # name in ADO
      trigger:
        branches: [main]`}</CodePre>
          <p>This is the foundation of <strong>promotion pipelines</strong>: backend builds, then frontend builds, then a release pipeline triggers on both completing.</p>

          <h3>Agents and pools — Microsoft-hosted vs self-hosted</h3>
          <p>Every job runs on an <strong>agent</strong>. An agent is a VM (or container) running the Azure Pipelines agent software, listening for jobs.</p>

          <MermaidDiagram theme="default" chart={`graph TB
    subgraph MS[Microsoft-hosted pools]
        Pool1[ubuntu-latest<br/>Ubuntu 22.04+]
        Pool2[windows-latest<br/>Windows Server 2022]
        Pool3[macos-latest<br/>macOS 14+]
    end
    subgraph Self[Self-hosted pool]
        Agent1[Agent on your<br/>Windows server]
        Agent2[Agent in your<br/>Docker container]
        Agent3[Agent on a<br/>Mac mini]
    end
    Pipeline[Your pipeline] -->|vmImage: ubuntu-latest| Pool1
    Pipeline2[Internal pipeline] -->|name: my-self-hosted| Agent1
    style MS fill:#1e3a5f,stroke:#4f9eff,color:#fff
    style Self fill:#3a2f1f,stroke:#ffb454,color:#fff`} />

          <h4>Microsoft-hosted agents</h4>
          <p>Pre-built VMs maintained by Microsoft with hundreds of preinstalled tools. You don't pay for the VM, you pay for <strong>parallel job slots</strong>.</p>
          <table>
            <tbody>
              <tr><th>Image</th><th>Use for</th></tr>
              <tr><td><code>ubuntu-latest</code></td><td>Default for most builds. Fastest. Cheapest.</td></tr>
              <tr><td><code>windows-latest</code></td><td>.NET Framework, MSBuild, Windows-only tooling</td></tr>
              <tr><td><code>macos-latest</code></td><td>iOS/macOS builds, Xcode</td></tr>
            </tbody>
          </table>
          <p>Each run starts on a fresh VM — no state from previous runs.</p>

          <h4>Self-hosted agents</h4>
          <p>Install the agent on a machine you control. Use cases:</p>
          <ul>
            <li><strong>Special hardware</strong> — GPUs for ML pipelines, specific OS versions</li>
            <li><strong>Network access</strong> — agent inside your private network can reach internal resources</li>
            <li><strong>Faster builds</strong> — cached dependencies across runs</li>
            <li><strong>Cost</strong> — for very high-volume teams, owning the hardware beats per-parallel-job billing</li>
          </ul>

          <h4>Install (Linux example)</h4>
          <CodePre>{`# At https://dev.azure.com/{org}/_settings/agentpools, create a pool
# and get a PAT with "Agent Pools: Read & manage" scope.

mkdir myagent && cd myagent
curl -O https://vstsagentpackage.azureedge.net/agent/4.244.0/vsts-agent-linux-x64-4.244.0.tar.gz
tar zxvf vsts-agent-linux-x64-4.244.0.tar.gz

./config.sh \\
  --url https://dev.azure.com/myorg \\
  --auth pat \\
  --token $PAT \\
  --pool myPool \\
  --agent $(hostname) \\
  --unattended

# Install as a service
sudo ./svc.sh install $USER
sudo ./svc.sh start`}</CodePre>

          <h4>Demands and capabilities</h4>
          <CodePre>{`pool:
  name: myPool
  demands:
    - npm
    - agent.os -equals Linux`}</CodePre>

          <h3>Service connections and OIDC federated identity</h3>
          <p>A <strong>service connection</strong> is Azure DevOps's name for "stored credentials and config for talking to an external service." Examples: Azure subscription, AWS account, Docker Hub registry, GitHub repo, JFrog Artifactory.</p>

          <p>Configure at <strong>Project Settings → Service connections → New service connection</strong>.</p>

          <h4>The OIDC federated identity flow (use this for Azure)</h4>
          <p>Old way: store a service principal's client secret in the service connection. Rotate every 90 days. Vulnerable if leaked.</p>
          <p>New way: <strong>federated credential</strong>. Azure DevOps proves its identity to Entra ID with a signed JWT; no stored secret.</p>

          <MermaidDiagram theme="default" chart={`sequenceDiagram
    participant Pipeline as Azure Pipeline
    participant ADO as Azure DevOps OIDC
    participant Entra as Microsoft Entra ID
    participant Azure as Azure Resource Manager
    Pipeline->>ADO: Request JWT for this job
    ADO->>Pipeline: JWT with claims (org, project, pipeline, environment)
    Pipeline->>Entra: Exchange JWT for access token
    Entra->>Entra: Verify JWT signature against ADO public keys<br/>Check federated credential subject matches
    Entra->>Pipeline: Access token (1 hour TTL)
    Pipeline->>Azure: API call with access token
    Azure->>Pipeline: Response`} />

          <h4>Setup (the modern way)</h4>
          <ol>
            <li>In Azure portal, create or pick an app registration (or user-assigned managed identity).</li>
            <li>Add a <strong>federated credential</strong> of type <strong>Other issuer</strong>:
              <ul>
                <li><strong>Issuer:</strong> <code>https://vstoken.dev.azure.com/&#123;org-id&#125;</code></li>
                <li><strong>Subject identifier:</strong> <code>sc://&#123;org&#125;/&#123;project&#125;/&#123;service-connection-name&#125;</code></li>
                <li><strong>Audience:</strong> <code>api://AzureADTokenExchange</code></li>
              </ul>
            </li>
            <li>Grant the app/identity the needed Azure roles (Contributor on the resource group, etc.).</li>
            <li>In ADO, create a new <strong>Azure Resource Manager</strong> service connection using <strong>Workload Identity federation (manual)</strong>.</li>
          </ol>

          <p>Or even easier: use the <strong>automatic</strong> workload-identity option when creating the service connection, and ADO sets up the federated credential for you.</p>

          <CodePre>{`- task: AzureCLI@2
  inputs:
    azureSubscription: 'azure-prod-svc-conn'  # name of the service connection
    scriptType: bash
    scriptLocation: inlineScript
    inlineScript: az group list`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>The right pattern in 2026.</strong> No client secret in YAML, no client secret in Library, no rotation.</div>
          </div>
        </section>

        {/* SECTION 12 — VARIABLES, PARAMS, TEMPLATES */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Variables, parameters &amp; templates</h2>

          <p>Pipelines have several variable systems with different lifecycles. Mixing them up is the most common source of "why isn't this working?" pain.</p>

          <MermaidDiagram theme="default" chart={`graph TB
    A[Variable types] --> B[Pipeline variables<br/>defined in YAML or UI]
    A --> C[Variable groups<br/>shared across pipelines, in Library]
    A --> D[Output variables<br/>set by a task for later tasks/jobs]
    A --> E[Predefined variables<br/>Build.SourceBranch, Agent.OS, etc.]
    A --> F[Runtime parameters<br/>prompt at queue time]
    A --> G[Secret variables<br/>encrypted, not in logs]
    A --> H[Key Vault references<br/>fetched from Azure Key Vault at runtime]
    style A fill:#0078d4,color:#fff`} />

          <h3>Pipeline variables</h3>
          <CodePre>{`variables:
  buildConfiguration: 'Release'
  nodeVersion: '20.x'`}</CodePre>
          <p>Use as <code>$(buildConfiguration)</code>. They're plain text and visible in logs.</p>

          <h3>Variable groups</h3>
          <p>Stored at <strong>Pipelines → Library</strong>. Useful for cross-pipeline secrets (API keys, connection strings).</p>
          <CodePre>{`variables:
  - group: shared-prod-secrets       # references a Library group
  - name: buildConfig
    value: 'Release'`}</CodePre>

          <h3>Secret variables</h3>
          <p>Set via the UI (a padlock icon) or via <code>isSecret: true</code> in a variable group. They're encrypted at rest and <strong>masked in logs</strong>. To use them in a script, you must explicitly pass them:</p>
          <CodePre>{`- script: ./deploy.sh
  env:
    DEPLOY_TOKEN: $(deployToken)    # explicit pass-through required for secrets`}</CodePre>

          <h3>Parameters</h3>
          <p>Runtime parameters — show a prompt when the user manually runs the pipeline.</p>
          <CodePre>{`parameters:
  - name: environment
    displayName: 'Target environment'
    type: string
    default: staging
    values: [staging, production]
  - name: skipTests
    type: boolean
    default: false

jobs:
  - job: Deploy
    steps:
      - \${{ if not(parameters.skipTests) }}:
          - script: npm test
      - script: ./deploy.sh \${{ parameters.environment }}`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Compile-time vs runtime evaluation.</strong> Note the <code>$&#123;&#123; &#125;&#125;</code> for compile-time evaluation vs <code>$( )</code> for runtime variable expansion. They're not interchangeable. <code>$&#123;&#123; &#125;&#125;</code> resolves when ADO parses the YAML before running it; <code>$( )</code> resolves on the agent at execution time.</div>
          </div>

          <h3>Predefined variables (the big ones)</h3>
          <table>
            <tbody>
              <tr><th>Variable</th><th>What it contains</th></tr>
              <tr><td><code>Build.SourceBranch</code></td><td><code>refs/heads/main</code>, <code>refs/pull/42/merge</code>, etc.</td></tr>
              <tr><td><code>Build.SourceBranchName</code></td><td>Just the branch name (e.g., <code>main</code>)</td></tr>
              <tr><td><code>Build.SourceVersion</code></td><td>The full commit SHA</td></tr>
              <tr><td><code>Build.BuildId</code></td><td>The numeric ID of this run</td></tr>
              <tr><td><code>Build.BuildNumber</code></td><td>The display number (e.g., <code>20260518.3</code>)</td></tr>
              <tr><td><code>Build.Reason</code></td><td><code>IndividualCI</code>, <code>PullRequest</code>, <code>Schedule</code>, <code>Manual</code>, ...</td></tr>
              <tr><td><code>Agent.OS</code></td><td><code>Linux</code>, <code>Windows_NT</code>, <code>Darwin</code></td></tr>
              <tr><td><code>Pipeline.Workspace</code></td><td>Root directory of the workspace</td></tr>
            </tbody>
          </table>

          <h3>Templates — extends, steps, jobs, stages</h3>
          <MermaidDiagram theme="default" chart={`graph TB
    A[Template types] --> B[Steps template<br/>reusable sequence of steps]
    A --> C[Jobs template<br/>reusable job definitions]
    A --> D[Stages template<br/>reusable stage definitions]
    A --> E[Variables template<br/>shared variable blocks]
    A --> F[Extends template<br/>caller inherits from base]
    style F fill:#4a8b3b,color:#fff`} />

          <h4>Steps template — simple reuse</h4>
          <p><code>templates/npm-build.yml</code>:</p>
          <CodePre>{`parameters:
  - name: nodeVersion
    type: string
    default: '20.x'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: \${{ parameters.nodeVersion }}
  - script: npm ci
  - script: npm test
  - script: npm run build`}</CodePre>

          <p>Caller:</p>
          <CodePre>{`steps:
  - template: templates/npm-build.yml
    parameters:
      nodeVersion: '22.x'`}</CodePre>

          <h4>Extends template — enforce structure</h4>
          <p>Useful when you want a base pipeline shape (e.g., always have a build → test → deploy structure, with security tasks injected).</p>
          <CodePre>{`# templates/secure-pipeline.yml
parameters:
  - name: buildSteps
    type: stepList

stages:
  - stage: SecurityScan
    jobs:
      - job: Scan
        steps:
          - task: CredScan@3
          - task: AntiMalware@4

  - stage: Build
    dependsOn: SecurityScan
    jobs:
      - job: Build
        steps:
          - \${{ each step in parameters.buildSteps }}:
              - \${{ step }}`}</CodePre>

          <p>Caller (<code>azure-pipelines.yml</code>):</p>
          <CodePre>{`extends:
  template: templates/secure-pipeline.yml
  parameters:
    buildSteps:
      - script: npm ci
      - script: npm run build`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>Platform team superpower.</strong> The caller can only do what the base template allows. This is how platform teams enforce mandatory steps (security scans, signing, audit logs) without trusting every dev to add them.</div>
          </div>

          <h4>Template across repos</h4>
          <CodePre>{`resources:
  repositories:
    - repository: templates
      type: git
      name: SharedRepo/PipelineTemplates
      ref: refs/tags/v1.2

extends:
  template: secure-pipeline.yml@templates`}</CodePre>
        </section>

        {/* SECTION 13 — ENVIRONMENTS & MULTI-STAGE */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>Environments &amp; multi-stage pipelines</h2>

          <p>An <strong>environment</strong> in ADO Pipelines is a named deployment target — <code>dev</code>, <code>staging</code>, <code>production</code>. Find them at <strong>Pipelines → Environments</strong>.</p>

          <h3>Per-environment configuration</h3>
          <table>
            <tbody>
              <tr><th>Setting</th><th>What it does</th></tr>
              <tr><td><strong>Approvals</strong></td><td>Specific users/groups must approve before a deploy proceeds</td></tr>
              <tr><td><strong>Branch control</strong></td><td>Only deploys from specific branches allowed</td></tr>
              <tr><td><strong>Business hours</strong></td><td>Only allow deploys 9-5 weekdays</td></tr>
              <tr><td><strong>Required template</strong></td><td>Deploy YAML must extend a specific template</td></tr>
              <tr><td><strong>Required reviewers</strong></td><td>Group of approvers; configurable minimum count</td></tr>
              <tr><td><strong>Exclusive lock</strong></td><td>Only one deploy at a time</td></tr>
              <tr><td><strong>Invoke REST API check</strong></td><td>Call a webhook to authorize</td></tr>
              <tr><td><strong>Evaluate artifact</strong></td><td>Validate the artifact (e.g., SBOM scan)</td></tr>
            </tbody>
          </table>

          <h3>A deployment job targets an environment</h3>
          <CodePre>{`- deployment: DeployProd
  environment: production    # the named environment with approvals
  strategy:
    runOnce:
      deploy:
        steps:
          - download: current
            artifact: webapp
          - task: AzureWebApp@1
            inputs:
              azureSubscription: 'azure-prod-svc-conn'
              appName: myapp-prod
              package: $(Pipeline.Workspace)/webapp/**/*.zip`}</CodePre>

          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Stage 'DeployProd' starts] --> B[Pause:<br/>environment requires approval]
    B --> C[Email/Teams notification<br/>to approvers]
    C --> D{Approved?}
    D -->|Yes| E[Continue deploy]
    D -->|Reject| F[Stage fails]
    D -->|Timeout: 30 days| G[Stage fails]
    style E fill:#4a8b3b,color:#fff
    style F fill:#a8542e,color:#fff`} />

          <h3>Multi-stage pipelines — build → test → deploy</h3>
          <MermaidDiagram theme="default" chart={`graph LR
    Commit[Commit to main] --> Build[Stage: Build<br/>compile, lint, unit test]
    Build --> IntegrationTest[Stage: Integration Test<br/>deploy to ephemeral env, run e2e]
    IntegrationTest --> DeployStaging[Stage: Deploy Staging<br/>deploy to staging slot, smoke test]
    DeployStaging --> Approval{Manual approval}
    Approval -->|Yes| DeployProd[Stage: Deploy Production<br/>blue/green or slot swap]
    Approval -->|No| Stop[Pipeline ends]
    style Build fill:#0078d4,color:#fff
    style DeployStaging fill:#3a2f1f,stroke:#ffb454,color:#fff
    style DeployProd fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <h3>Deployment strategies</h3>
          <CodePre>{`- deployment: DeployProd
  environment: production
  strategy:
    rolling:                 # incrementally update instances
      maxParallel: 2
      preDeploy: { steps: [ ... ] }
      deploy:    { steps: [ ... ] }
      routeTraffic: { steps: [ ... ] }
      postRouteTraffic: { steps: [ ... ] }
      on:
        success: { steps: [ ... ] }
        failure: { steps: [ ... ] }`}</CodePre>

          <table>
            <tbody>
              <tr><th>Strategy</th><th>Behavior</th></tr>
              <tr><td><code>runOnce</code></td><td>One-shot deploy. Default.</td></tr>
              <tr><td><code>rolling</code></td><td>Deploy to N instances at a time.</td></tr>
              <tr><td><code>canary</code></td><td>Deploy to small percentage first, then expand.</td></tr>
            </tbody>
          </table>

          <h3>Library — variable groups and secure files</h3>
          <p><strong>Pipelines → Library</strong> is the central store for two things:</p>

          <h4>Variable groups</h4>
          <p>Reusable variables, optionally linked to <strong>Azure Key Vault</strong>:</p>
          <CodePre>{`variables:
  - group: prod-secrets       # group name
  - group: shared-config`}</CodePre>
          <p>A Key Vault-linked group automatically pulls fresh values at pipeline run time. Combined with OIDC service connections, this gives you secret management with zero stored credentials.</p>

          <h4>Secure files</h4>
          <p>Files too sensitive for the repo: <code>.pfx</code> signing certs, <code>id_rsa</code> keys, gMSA passwords.</p>
          <CodePre>{`- task: DownloadSecureFile@1
  name: signingCert
  inputs:
    secureFile: 'codesigning.pfx'

- script: |
    sudo cp $(signingCert.secureFilePath) /etc/cert.pfx`}</CodePre>
          <p>The downloaded file is in a temp directory, deleted at job end, never in the workspace.</p>
        </section>

        {/* SECTION 14 — ARTIFACTS & TEST PLANS */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Azure Artifacts &amp; Test Plans</h2>

          <h3>Feeds — npm, NuGet, Maven, Python, Universal</h3>
          <p>A <strong>feed</strong> is a package registry hosted in your ADO project. Useful for:</p>
          <ul>
            <li>Publishing internal libraries shared between repos</li>
            <li>Caching public packages (resilience against npm outages, deletions)</li>
            <li>Tightly controlled lists of approved upstream packages</li>
          </ul>

          <table>
            <tbody>
              <tr><th>Protocol</th><th>Use case</th></tr>
              <tr><td><strong>npm</strong></td><td>JavaScript/TypeScript packages</td></tr>
              <tr><td><strong>NuGet</strong></td><td>.NET packages</td></tr>
              <tr><td><strong>Maven</strong></td><td>Java packages</td></tr>
              <tr><td><strong>Python</strong></td><td>pip packages</td></tr>
              <tr><td><strong>Universal</strong></td><td>Anything else — large binary blobs, ML models</td></tr>
            </tbody>
          </table>

          <h3>Upstream sources</h3>
          <p>Configure a feed to proxy a public registry (npmjs.org, nuget.org). Behavior:</p>

          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Your build asks feed<br/>for package X] --> B{Cached in feed?}
    B -->|Yes| C[Serve from cache<br/>fast, resilient]
    B -->|No| D[Fetch from upstream]
    D --> E[Cache in feed<br/>for future builds]
    E --> C`} />

          <p>This protects against the classic supply-chain issues:</p>
          <ul>
            <li>Package gets unpublished from npm (left-pad) → your cached version still works</li>
            <li>Public registry has an outage → builds still pass</li>
            <li>Public registry compromised → you can pin to known-good cached versions</li>
          </ul>

          <h3>Retention</h3>
          <p>Feeds can grow unbounded. Configure retention at <strong>Feed → Settings → Retention policies</strong>:</p>
          <table>
            <tbody>
              <tr><th>Setting</th><th>What it does</th></tr>
              <tr><td>Max versions per package</td><td>Keep newest N</td></tr>
              <tr><td>Days to keep recently downloaded</td><td>Don't delete actively-used versions</td></tr>
              <tr><td>Tagged versions exempt</td><td>Pinned versions never deleted</td></tr>
            </tbody>
          </table>

          <h3>Test Plans — manual testing, exploratory testing, the licensing gotcha</h3>
          <p>Azure Test Plans is for <strong>manual</strong> testing — test cases, test runs, exploratory sessions, bug filing. Not for automated test execution (those run in pipelines).</p>

          <table>
            <tbody>
              <tr><th>Feature</th><th>Use</th></tr>
              <tr><td><strong>Test cases</strong></td><td>Step-by-step manual test scripts</td></tr>
              <tr><td><strong>Test plans</strong></td><td>Collections of test cases for a release</td></tr>
              <tr><td><strong>Test suites</strong></td><td>Group cases — by feature, by area</td></tr>
              <tr><td><strong>Test runs</strong></td><td>An execution of a plan; results recorded per case</td></tr>
              <tr><td><strong>Exploratory testing</strong></td><td>Time-boxed session, capture screenshots/bugs</td></tr>
              <tr><td><strong>Test &amp; Feedback browser extension</strong></td><td>Capture bugs with screenshots, comments, video while testing</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The licensing gotcha.</strong> Test Plans requires a separate license ($52/user/month) on top of the Basic tier. Project admins and stakeholders can still <em>view</em> results, but creating test cases or running tests requires the license.</div>
          </div>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>Common pattern.</strong> For most teams, Test Plans is too expensive to roll out widely. Common pattern: QA leads have Test Plans licenses; developers stay on Basic and use the <strong>Test &amp; Feedback</strong> extension for ad-hoc bug filing.</div>
          </div>
        </section>

        {/* SECTION 15 — SECURITY */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>Security &amp; governance</h2>

          <h3>The permissions model</h3>
          <MermaidDiagram theme="default" chart={`graph TD
    A[Azure DevOps Organization] -->|inherits to| B[Project]
    B -->|inherits to| C[Repository]
    C -->|inherits to| D[Branch]
    A -.->|groups: Project Collection Administrators,<br/>Project Collection Build Administrators| A
    B -.->|groups: Project Administrators,<br/>Contributors, Readers| B
    C -.->|per-repo: Contribute,<br/>Force push, Manage permissions| C
    D -.->|per-branch: Bypass policies,<br/>Force push, Manage permissions| D
    style A fill:#0078d4,color:#fff`} />

          <p>Permissions cascade: <strong>Deny</strong> at any level wins over <strong>Allow</strong> at a higher level.</p>

          <h3>Default project security groups</h3>
          <table>
            <tbody>
              <tr><th>Group</th><th>What members can do</th></tr>
              <tr><td><strong>Project Administrators</strong></td><td>Everything in the project — manage permissions, settings, delete</td></tr>
              <tr><td><strong>Contributors</strong></td><td>Create branches, push, open PRs, run pipelines</td></tr>
              <tr><td><strong>Readers</strong></td><td>View only</td></tr>
              <tr><td><strong>Build Administrators</strong></td><td>Manage all pipelines and their settings</td></tr>
            </tbody>
          </table>

          <p>You can create custom groups (e.g., "Senior reviewers") and assign granular permissions.</p>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Common gotchas.</strong> "I can't push to main" — branch security overrides project Contributor permissions. Check <strong>Repos → Branches → main → Branch security</strong> for explicit denies. "My pipeline can't write to a wiki" — the <code>Build Service</code> user (your pipeline's identity) has limited default permissions. Grant it explicitly at the resource level.</div>
          </div>

          <h3>Personal Access Tokens (PATs) and Conditional Access</h3>
          <p>PATs are scoped tokens for automation. Create at <strong>User Settings → Personal access tokens</strong>.</p>

          <h4>Scopes (pick the minimum)</h4>
          <CodePre>{`Code: Read, Read & Write, Status                      → Repos
Build: Read & Execute                                  → Trigger pipelines
Release: Read, Write, Execute, & Manage                → Classic releases
Agent Pools: Read & manage                             → Register agents
Packaging: Read, Read & Write                          → Artifacts
Work Items: Read, Read & Write                         → Boards
Service Connections: Read, query, & manage             → Manage service connections`}</CodePre>

          <h4>Expiration</h4>
          <p>Max 1 year. Best practice: 90 days for personal use, 30 days for shared automation.</p>

          <h4>Conditional Access</h4>
          <p>In Entra ID, you can require <strong>Conditional Access policies</strong> (must be on corporate network, must use MFA, must be on a compliant device) for ADO sign-in. As of 2024+, you can also require Conditional Access for <strong>PAT issuance</strong> — preventing developers from creating long-lived PATs while away from the corporate network.</p>

          <h3>Audit logs and security policies</h3>
          <p>The <strong>audit log</strong> at <strong>Organization Settings → Auditing</strong> records every privileged action: permission changes, PAT creation, project creation, security group membership. Retained 90 days; export to a SIEM (Splunk, Sentinel) for longer retention.</p>

          <h4>Useful event filters</h4>
          <ul>
            <li><code>Token.PatCreateEvent</code> — every new PAT</li>
            <li><code>Project.CreateProjectEvent</code> — new project created</li>
            <li><code>Project.UpdateProjectVisibility</code> — project made public (security-relevant)</li>
            <li><code>Pipelines.PipelineCreatedEvent</code> — new pipeline definition</li>
          </ul>

          <h4>Common security policies to enable at the org level</h4>
          <table>
            <tbody>
              <tr><th>Policy</th><th>Recommendation</th></tr>
              <tr><td>Disable creation of classic pipelines</td><td>On — force YAML</td></tr>
              <tr><td>Disable anonymous access to badges</td><td>Off (badges aren't secrets)</td></tr>
              <tr><td>Limit project visibility to private</td><td>On — prevent accidental public projects</td></tr>
              <tr><td>External guest access</td><td>Off unless you have a known need</td></tr>
              <tr><td>Require MFA for sign-in</td><td>Use Entra ID conditional access for this</td></tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 16 — CLI, API, ADO VS GITHUB */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>CLI, REST API &amp; ADO vs GitHub</h2>

          <h3>The az devops CLI</h3>
          <p>The Azure CLI has a <code>devops</code> extension that exposes most ADO functionality.</p>

          <CodePre>{`# Install once
az extension add --name azure-devops

# Sign in
az login
az devops login   # optional - prompts for PAT for git ops

# Configure defaults
az devops configure --defaults \\
  organization=https://dev.azure.com/myorg \\
  project=MyProject

# Common ops
az repos list --output table
az repos create --name my-new-repo
az pipelines list --output table
az pipelines run --name "Backend CI" --branch main
az boards work-item create --title "New bug" --type Bug
az boards work-item show --id 42
az artifacts universal publish ...`}</CodePre>

          <p>For anything not covered, <code>az devops invoke</code> calls any REST endpoint:</p>
          <CodePre>{`az devops invoke --area git --resource refs \\
  --route-parameters project=MyProject repositoryId=<guid> \\
  --query-parameters filter=heads/`}</CodePre>

          <h3>REST API basics</h3>
          <p>Almost every ADO feature has a REST endpoint. Base URL: <code>https://dev.azure.com/&#123;org&#125;/&#123;project&#125;/_apis/...?api-version=7.1</code>.</p>

          <p>Authentication: <code>Authorization: Basic &lt;base64(":PAT")&gt;</code> or with OIDC bearer tokens.</p>

          <CodePre>{`# Get the current user
curl -u :$PAT https://dev.azure.com/myorg/_apis/projects?api-version=7.1

# Create a work item
curl -u :$PAT -X POST \\
  -H "Content-Type: application/json-patch+json" \\
  -d '[
    {"op":"add","path":"/fields/System.Title","value":"New bug"}
  ]' \\
  "https://dev.azure.com/myorg/MyProject/_apis/wit/workitems/\\$Bug?api-version=7.1"`}</CodePre>

          <h3>Marketplace extensions worth knowing</h3>
          <p>Install at <strong>Organization Settings → Extensions → Browse marketplace</strong>.</p>
          <table>
            <tbody>
              <tr><th>Extension</th><th>What it adds</th></tr>
              <tr><td><strong>SonarCloud</strong></td><td>Static code analysis as a pipeline task</td></tr>
              <tr><td><strong>Snyk Security</strong></td><td>Vulnerability scanning</td></tr>
              <tr><td><strong>GitHub Pull Requests for ADO</strong></td><td>Bridge to GitHub PRs</td></tr>
              <tr><td><strong>Markdown Editor</strong></td><td>Better wiki editing</td></tr>
              <tr><td><strong>Code Search</strong></td><td>Cross-repo code search</td></tr>
              <tr><td><strong>Test &amp; Feedback</strong></td><td>Browser extension for filing bugs while testing</td></tr>
              <tr><td><strong>Azure DevOps Migration Tools</strong> (3rd party)</td><td>Migrate work items between projects</td></tr>
            </tbody>
          </table>

          <h3>Azure DevOps vs GitHub — honest comparison</h3>
          <p>Microsoft owns both. They're not competitors — they have different sweet spots.</p>

          <table>
            <tbody>
              <tr><th>Dimension</th><th>Azure DevOps</th><th>GitHub</th></tr>
              <tr><td><strong>Public/OSS visibility</strong></td><td>Limited (public projects exist but rare)</td><td>Industry standard for OSS</td></tr>
              <tr><td><strong>Branch policies</strong></td><td>Excellent, mature</td><td>Good — rulesets are catching up</td></tr>
              <tr><td><strong>Pull request UX</strong></td><td>Functional</td><td>Cleaner, faster</td></tr>
              <tr><td><strong>Project planning</strong></td><td>Boards is mature, hierarchy + sprints</td><td>Projects v2 is newer; flexible but less battle-tested</td></tr>
              <tr><td><strong>CI/CD</strong></td><td>Pipelines: YAML, multi-stage, environments</td><td>Actions: simpler syntax, larger marketplace</td></tr>
              <tr><td><strong>Package registry</strong></td><td>Artifacts: 5 protocols, upstream sources</td><td>Packages: more focused, GHCR for Docker</td></tr>
              <tr><td><strong>Manual testing</strong></td><td>Test Plans (expensive license)</td><td>None native</td></tr>
              <tr><td><strong>Audit log</strong></td><td>First-class, queryable</td><td>First-class on Enterprise</td></tr>
              <tr><td><strong>Entra ID integration</strong></td><td>Deep, built-in</td><td>Strong via SSO</td></tr>
              <tr><td><strong>AI assistance</strong></td><td>Copilot in Repos + Boards</td><td>Copilot everywhere, more mature</td></tr>
              <tr><td><strong>Marketplace</strong></td><td>Smaller, enterprise-focused</td><td>Massive</td></tr>
              <tr><td><strong>Best for</strong></td><td>Enterprise teams in Microsoft stack</td><td>Anyone building public OSS, or wanting the best AI</td></tr>
            </tbody>
          </table>

          <PathTabs tabs={[
            {
              id: 'pick-ado',
              label: 'Pick Azure DevOps if...',
              content: (
                <ul>
                  <li>Your company already standardizes on Microsoft (Entra, Azure, Microsoft 365)</li>
                  <li>You need Boards/manual test management together with code+CI</li>
                  <li>Strong branch policy enforcement is critical</li>
                  <li>You're migrating from on-prem TFS/TFVC</li>
                </ul>
              ),
            },
            {
              id: 'pick-github',
              label: 'Pick GitHub if...',
              content: (
                <ul>
                  <li>Open source is part of your portfolio</li>
                  <li>You want the best AI / Copilot integration</li>
                  <li>The dev community matters (hiring, contribution patterns)</li>
                  <li>You're picking fresh today</li>
                </ul>
              ),
            },
            {
              id: 'use-both',
              label: 'Use both',
              content: (
                <p>Many teams do. Code in GitHub, Boards in ADO. Or code in ADO, releases tracked in GitHub. They federate.</p>
              ),
            },
          ]} />

          <h3>Migration patterns</h3>
          <h4>ADO → GitHub</h4>
          <table>
            <tbody>
              <tr><th>What</th><th>How</th></tr>
              <tr><td>Code</td><td><code>git remote add github &lt;url&gt;; git push --mirror github</code></td></tr>
              <tr><td>Pipelines</td><td>Rewrite as GitHub Actions (no automatic converter, but YAML structure is similar)</td></tr>
              <tr><td>Work items</td><td><strong>GitHub Issues importer</strong> (3rd party tools) or <strong>Azure DevOps Migration Tools</strong></td></tr>
              <tr><td>Branch policies</td><td>Recreate as GitHub rulesets</td></tr>
              <tr><td>Service connections</td><td>Recreate as GitHub Environments + OIDC</td></tr>
            </tbody>
          </table>

          <h4>GitHub → ADO</h4>
          <table>
            <tbody>
              <tr><th>What</th><th>How</th></tr>
              <tr><td>Code</td><td><code>git clone --mirror github_url; git push --mirror ado_url</code></td></tr>
              <tr><td>Actions</td><td>Rewrite as ADO Pipelines</td></tr>
              <tr><td>Issues</td><td>ADO's import wizard handles GitHub Issues directly</td></tr>
              <tr><td>Projects</td><td>Recreate as ADO Boards</td></tr>
            </tbody>
          </table>

          <p>Microsoft has not made one particularly easier than the other. Plan a couple weeks of dedicated effort either way.</p>
        </section>

        {/* SECTION 17 — TROUBLESHOOTING & CHEAT SHEET */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">A</span>Troubleshooting &amp; cheat sheet</h2>

          <h3>"Authentication failed" on git push</h3>
          <MermaidDiagram theme="default" chart={`flowchart TD
    A[Auth failed] --> B{Using HTTPS or SSH?}
    B -->|HTTPS| C[Check Git Credential Manager<br/>Open Credential Manager, remove ADO entry, retry]
    B -->|SSH| D[Check ssh-agent<br/>ssh-add -l]
    B -->|PAT| E{PAT expired?}
    E -->|Yes| F[Generate a new PAT]
    E -->|No| G[Check PAT scopes<br/>need Code: Read and Write minimum]
    C --> H[Retry — browser opens for re-auth]
    D --> I[Verify key is uploaded<br/>at dev.azure.com user settings]
    style F fill:#4a8b3b,color:#fff
    style H fill:#4a8b3b,color:#fff`} />

          <h3>"Push rejected — branch protected"</h3>
          <p>You hit a branch policy. The CLI doesn't show <em>which</em> policy. Open the branch in ADO web UI to see specifics. Typical causes:</p>
          <ul>
            <li>Missing required reviewer</li>
            <li>Build validation hasn't run yet</li>
            <li>Missing linked work item</li>
            <li>Force push attempted</li>
          </ul>

          <h3>Pipeline stuck "Queued"</h3>
          <MermaidDiagram theme="default" chart={`flowchart TD
    A[Pipeline queued, not starting] --> B{Pool has free agents?}
    B -->|No| C[Wait or buy more parallelism]
    B -->|Yes| D{Demands satisfied?}
    D -->|No| E[Agent missing a required capability]
    D -->|Yes| F{Pipeline approvals pending?}
    F -->|Yes| G[Check Environments → Approvals]
    F -->|No| H{Concurrency lock?}
    H -->|Yes| I[Another run holds the lock]
    style C fill:#a8542e,color:#fff`} />

          <h3>"Free tier parallel job exhausted"</h3>
          <p>You're hitting the free 1800 minutes/month limit. Two options:</p>
          <ul>
            <li>Buy more parallel jobs ($40/month each, unlimited minutes)</li>
            <li>Set up self-hosted agents (free + you own the hardware)</li>
          </ul>
          <p>For OSS projects, request <strong>10 free parallel jobs for public projects</strong> via the public project parallelism form.</p>

          <h3>"Cannot access repo from pipeline"</h3>
          <p>The pipeline runs as the <strong>Build Service</strong> user, not as you. By default it can read repos in the same project, but not write back. Grant <code>Contribute</code> permission to the <code>Project Collection Build Service (&#123;Org&#125;)</code> identity if your pipeline needs to push back.</p>

          <h3>Cheat sheet</h3>
          <h4>Daily git workflow</h4>
          <CodePre>{`git pull origin main
git checkout -b feature/my-change
# make changes
git add .
git commit -m "feat: short description AB#42"
git push origin feature/my-change
# open PR in browser via terminal:
az repos pr create --auto-complete --squash --delete-source-branch`}</CodePre>

          <h4>Pipeline ops</h4>
          <CodePre>{`az pipelines runs list --pipeline-ids 42
az pipelines run --name "Backend CI" --branch main --open`}</CodePre>

          <h4>Work items</h4>
          <CodePre>{`az boards work-item create --title "Login broken" --type Bug --description "..."
az boards work-item update --id 42 --state Active
az boards query --wiql "SELECT [System.Id] FROM workitems WHERE [System.State]='Active'"`}</CodePre>

          <h4>Repo housekeeping</h4>
          <CodePre>{`az repos list --output table
az repos delete --id <guid> --yes
az repos policy list --branch main --repository-id <guid>`}</CodePre>

          <h3>Glossary</h3>
          <table>
            <tbody>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td><strong>ADO</strong></td><td>Azure DevOps</td></tr>
              <tr><td><strong>Organization</strong></td><td>Top-level container at <code>dev.azure.com/&#123;org&#125;</code></td></tr>
              <tr><td><strong>Project</strong></td><td>Workspace inside an org; holds repos, boards, pipelines</td></tr>
              <tr><td><strong>Process template</strong></td><td>Defines work item types and workflow (Basic/Agile/Scrum/CMMI)</td></tr>
              <tr><td><strong>Area path</strong></td><td>Hierarchical tag for grouping work items by team/component</td></tr>
              <tr><td><strong>Iteration path</strong></td><td>Hierarchical tag for sprints/cycles</td></tr>
              <tr><td><strong>Branch policy</strong></td><td>Rule that gates merging a PR</td></tr>
              <tr><td><strong>Pipeline</strong></td><td>Automation defined by <code>azure-pipelines.yml</code></td></tr>
              <tr><td><strong>Run</strong></td><td>A specific execution of a pipeline</td></tr>
              <tr><td><strong>Stage</strong></td><td>A logical phase of a pipeline (build, test, deploy)</td></tr>
              <tr><td><strong>Job</strong></td><td>A set of steps on the same agent</td></tr>
              <tr><td><strong>Step</strong></td><td>A unit of work (script or task)</td></tr>
              <tr><td><strong>Task</strong></td><td>Pre-built reusable step from the Marketplace</td></tr>
              <tr><td><strong>Agent</strong></td><td>A machine executing jobs</td></tr>
              <tr><td><strong>Pool</strong></td><td>Group of agents</td></tr>
              <tr><td><strong>Service connection</strong></td><td>Stored credentials for an external service</td></tr>
              <tr><td><strong>Environment</strong></td><td>Named deploy target with approvals</td></tr>
              <tr><td><strong>Variable group</strong></td><td>Reusable variables across pipelines, in Library</td></tr>
              <tr><td><strong>Feed</strong></td><td>Package registry hosted in Azure Artifacts</td></tr>
              <tr><td><strong>PAT</strong></td><td>Personal Access Token for authentication</td></tr>
              <tr><td><strong>OIDC</strong></td><td>Federated identity protocol — passwordless auth</td></tr>
              <tr><td><strong>WIQL</strong></td><td>Work Item Query Language</td></tr>
              <tr><td><strong>AB#42</strong></td><td>Linking syntax — references work item 42</td></tr>
            </tbody>
          </table>

          <h3>Further reading</h3>
          <ul>
            <li><a href="https://learn.microsoft.com/azure/devops/" target="_blank" rel="noreferrer">Azure DevOps documentation home</a></li>
            <li><a href="https://learn.microsoft.com/azure/devops/pipelines/yaml-schema/" target="_blank" rel="noreferrer">YAML schema reference</a></li>
            <li><a href="https://learn.microsoft.com/azure/devops/pipelines/build/variables" target="_blank" rel="noreferrer">Predefined variables</a></li>
            <li><a href="https://learn.microsoft.com/azure/devops/pipelines/library/connect-to-azure" target="_blank" rel="noreferrer">Service connections — workload identity federation</a></li>
            <li><a href="https://learn.microsoft.com/azure/devops/repos/git/branch-policies" target="_blank" rel="noreferrer">Branch policies and settings</a></li>
            <li><a href="https://learn.microsoft.com/rest/api/azure/devops/" target="_blank" rel="noreferrer">REST API reference</a></li>
            <li><a href="https://learn.microsoft.com/cli/azure/devops" target="_blank" rel="noreferrer">az devops CLI reference</a></li>
          </ul>
        </section>
      </main>
    </div>
  );
}
