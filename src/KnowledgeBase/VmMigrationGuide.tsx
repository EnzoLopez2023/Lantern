import { useEffect, useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../app/storage/scopedStorage';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '0',  title: 'Overview',                       icon: '🏁' },
  { id: 's2',  num: '1',  title: 'Inventory the current setup',    icon: '📋' },
  { id: 's3',  num: '2',  title: 'Pick a hypervisor & build the VM', icon: '🖥️' },
  { id: 's4',  num: '3',  title: 'Install & prep Windows 11',      icon: '💿' },
  { id: 's5',  num: '4',  title: 'Install IIS, ARR, Docker, Certify', icon: '🔧' },
  { id: 's6',  num: '5',  title: 'Migrate the services',           icon: '🚚' },
  { id: 's7',  num: '6',  title: 'Networking & cutover',           icon: '🌐' },
  { id: 's8',  num: '7',  title: 'Ongoing operations on the VM',   icon: '🛠️' },
  { id: 's9',  num: '8',  title: 'Troubleshooting',                icon: '🚨' },
  { id: 's10', num: '✦',  title: 'Command cheat sheet',            icon: '📋' },
];

const CHECKLIST_STORAGE_KEY = 'vm-migration-checks';

// ── Inventory wizard items ─────────────────────────────────────────────
const INV_IIS_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i1', label: <>Open elevated PowerShell on the old PC</> },
  { id: 'i2', label: <><code>Import-Module WebAdministration</code></> },
  { id: 'i3', label: <>Save site list: <code>Get-Website | Select Name,Id,State,PhysicalPath,Bindings,ApplicationPool | ConvertTo-Json -Depth 5 | Out-File C:\migration-notes\iis-sites.json</code></> },
  { id: 'i4', label: <>Save app pools: <code>Get-IISAppPool | Select Name,ManagedRuntimeVersion,ManagedPipelineMode,State,ProcessModel | ConvertTo-Json -Depth 5 | Out-File C:\migration-notes\iis-apppools.json</code></> },
  { id: 'i5', label: <>Save bindings detail: <code>Get-WebBinding | Format-Table -AutoSize | Out-File C:\migration-notes\iis-bindings.txt</code></> },
  { id: 'i6', label: <>Note physical paths each site points to (e.g., <code>C:\inetpub\wwwroot\SecretApp</code>) — these are file trees you'll need to copy</> },
];
const INV_REWRITE_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i10', label: <>Backup <code>applicationHost.config</code> (the master IIS config):<br /><code>Copy-Item C:\Windows\System32\inetsrv\config\applicationHost.config C:\migration-notes\applicationHost.config.bak</code></> },
  { id: 'i11', label: <>Export per-site web.config files: each site's physical path has a <code>web.config</code> with rewrite rules. Copy them all to <code>C:\migration-notes\webconfigs\</code> (preserve folder structure).</> },
  { id: 'i12', label: <>List global rewrite rules: <code>%windir%\system32\inetsrv\appcmd.exe list config -section:system.webServer/rewrite/globalRules &gt; C:\migration-notes\rewrite-global.txt</code></> },
  { id: 'i13', label: <>List ARR server proxy settings: <code>%windir%\system32\inetsrv\appcmd.exe list config -section:system.webServer/proxy &gt; C:\migration-notes\arr-proxy.txt</code></> },
  { id: 'i14', label: <>Note any ARR farms (Server Farms in IIS Manager): screenshot or export their member list</> },
];
const INV_DOCKER_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i20', label: <><code>docker compose ls &gt; C:\migration-notes\compose-projects.txt</code></> },
  { id: 'i21', label: <><code>{`docker ps -a --format "table {{.Names}}\\t{{.Image}}\\t{{.Ports}}\\t{{.Status}}" > C:\\migration-notes\\containers.txt`}</code></> },
  { id: 'i22', label: <><code>docker volume ls &gt; C:\migration-notes\volumes.txt</code></> },
  { id: 'i23', label: <>For each named volume, inspect mountpoint + size:<br /><code>{`docker volume ls -q | ForEach-Object { docker volume inspect $_ } | ConvertTo-Json -Depth 5 | Out-File C:\\migration-notes\\volumes-detail.json`}</code></> },
  { id: 'i24', label: <>Locate every <code>docker-compose.yml</code> and <code>.env</code> in <code>Q:\repo\</code> — copy them to <code>C:\migration-notes\compose\</code> preserving folder names</> },
  { id: 'i25', label: <>Note which containers use bind mounts vs named volumes (matters at restore time)</> },
];
const INV_CERTIFY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i30', label: <>Open Certify the Web → Settings → Backup &amp; Restore → Create Encrypted Backup. Save the <code>.cert-mgr-backup</code> file to <code>C:\migration-notes\certify-backup\</code>. Record the encryption password somewhere safe.</> },
  { id: 'i31', label: <>Note the ACME account email used (Settings → ACME accounts). You'll need it to verify on the new VM.</> },
  { id: 'i32', label: <>Count managed certs (Managed Sites list). Note which sites/domains are covered. Free Certify the Web has a 5-certs-per-host limit.</> },
  { id: 'i33', label: <>Export the cert renewal scheduled task: in Task Scheduler, find Certify's task → Export → save XML to <code>C:\migration-notes\certify-task.xml</code></> },
];
const INV_FIREWALL_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i40', label: <>Save inbound rules: <code>Get-NetFirewallRule -Direction Inbound -Enabled True | Select DisplayName,Profile,Action,Direction,Enabled | ConvertTo-Json -Depth 3 | Out-File C:\migration-notes\firewall-inbound.json</code></> },
  { id: 'i41', label: <>Note specifically the rule for port 443 (and 80 if Certify uses HTTP-01 challenges)</> },
  { id: 'i42', label: <>Note any rules for Docker subnets / Hyper-V virtual switches</> },
];
const INV_ROUTER_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i50', label: <>Log into router admin. Screenshot the port forwarding page. Note: WAN:443 → LAN:&lt;ip&gt;:443 (and 80 if used for ACME)</> },
  { id: 'i51', label: <>Note the current home PC's LAN IP (from router DHCP list or <code>ipconfig</code>)</> },
  { id: 'i52', label: <>Check if router has DHCP reservation for the home PC (so its IP doesn't change). If not, note the IP it currently has.</> },
  { id: 'i53', label: <>Check for NAT Loopback / Hairpin NAT setting (lets internal devices hit your public hostname). Note current state.</> },
  { id: 'i54', label: <>Identify how dynamic DNS works for <code>enzolopez.net</code>: does the router update it (built-in DDNS), or is there a client app on the home PC (No-IP, DynDNS), or is it static?</> },
  { id: 'i55', label: <>Snapshot DNS records at your registrar — at minimum A or CNAME records for each subdomain. Save to <code>C:\migration-notes\dns-records.txt</code></> },
];
const INV_TASKS_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i60', label: <>List scheduled tasks created by Certify, Docker, or your apps:<br /><code>Get-ScheduledTask | Where State -ne Disabled | Select TaskPath,TaskName,State | Format-Table -AutoSize | Out-File C:\migration-notes\scheduled-tasks.txt</code></> },
  { id: 'i61', label: <>Note Docker Desktop "Start on login" setting (Settings → General)</> },
  { id: 'i62', label: <>Note any backup scripts you run (search Startup folder, Task Scheduler, custom scripts in <code>C:\</code>)</> },
];
const INV_SECRETAPP_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'i70', label: <>Identify SecretApp's runtime: is it an IIS-hosted .NET app, a Node service, something else?</> },
  { id: 'i71', label: <>Note its IIS site name + physical path (already captured above, but flag it specifically)</> },
  { id: 'i72', label: <>Identify its data location: SQLite/MySQL/MS SQL/file system? Snapshot the data file(s) location</> },
  { id: 'i73', label: <>Note any specific runtime prerequisites (.NET 6/8, Node version, MySQL Server) you'd need to install on the VM</> },
];

// ── Service migration wizard items ─────────────────────────────────────
const SVC_FILES_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's1', label: <>Create <code>C:\migration-notes\</code> on the new VM (mirror the old PC's path so paths in your notes still resolve)</> },
  { id: 's2', label: <>Copy the entire <code>migration-notes</code> folder over (Hyper-V: enable "Guest Services" then <code>Copy-VMFile</code>; or zip and SMB share; or just put on a USB)</> },
  { id: 's3', label: <>Clone repo dirs from old to new (<code>Q:\repo\workshop</code>, etc.) — or pull fresh from GitHub if you've pushed</> },
];
const SVC_DOCKER_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's10', label: <>Confirm Docker is running on the new VM (<code>docker version</code>)</> },
  { id: 's11', label: <>For each app (workshop, glp1, shopkeep): <code>cd Q:\repo\&lt;app&gt;</code> then <code>docker compose build</code></> },
  { id: 's12', label: <>Don't <code>up</code> yet — first restore volume data (tar export on old → tar import on new)</> },
  { id: 's13', label: <>On NEW VM: restore each volume using <code>docker volume create</code> + tar extract into <code>/data</code></> },
  { id: 's14', label: <>Start one container at a time: <code>docker compose up -d</code> per app. Check logs: <code>docker compose logs -f</code></> },
  { id: 's15', label: <>Test each app via <code>curl http://localhost:&lt;port&gt;/api/health</code></> },
];
const SVC_IIS_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's20', label: <>Copy <code>web.config</code> files into <code>C:\inetpub\wwwroot\&lt;site&gt;\</code> on the new VM (or wherever sites' physical paths are)</> },
  { id: 's21', label: <>Verify ARR is enabled at server level (IIS Manager → server node → Application Request Routing Cache → Server Proxy Settings → ☑ Enable proxy)</> },
  { id: 's22', label: <>For each site, in IIS Manager → Sites → Add Website: name, physical path, HTTPS binding on port 443 with matching hostname, leave SSL cert empty (Certify will fill it)</> },
  { id: 's23', label: <>Verify each site has its <code>web.config</code> with the same rewrite rules. View them: IIS Manager → site → URL Rewrite</> },
  { id: 's24', label: <>If you had server-level (global) rewrite rules: open <code>C:\migration-notes\rewrite-global.txt</code> and recreate them via IIS Manager → server node → URL Rewrite → Add Rule</> },
  { id: 's25', label: <>Verify ARR proxy settings match old PC: server node → Application Request Routing Cache → Server Proxy Settings.</> },
  { id: 's26', label: <>Test ARR forwarding from inside the VM:<br /><code>curl -H "Host: workshop.enzolopez.net" http://localhost</code><br />should return the workshop app's HTML</> },
];
const SVC_SECRETAPP_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's30', label: <>Install SecretApp's runtime on the new VM (.NET runtime, Node, etc.)</> },
  { id: 's31', label: <>Copy the app's files from old PC's physical path to the same path on new VM</> },
  { id: 's32', label: <>Copy the data file(s) (DB, JSON, whatever it persists)</> },
  { id: 's33', label: <>Recreate the IIS app pool with matching settings (ManagedRuntimeVersion, pipeline mode, identity)</> },
  { id: 's34', label: <>Verify the site loads on its IIS binding</> },
];
const SVC_CERTIFY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's40', label: <>Open Certify → Settings → Import Backup → load the .cert-mgr-backup</> },
  { id: 's41', label: <>Pause all managed sites (so they don't try to renew before cutover when port 80/443 still go to old PC)</> },
  { id: 's42', label: <>Verify ACME account email matches</> },
  { id: 's43', label: <>Verify managed sites list contains every cert from the old PC</> },
  { id: 's44', label: <>If the renewal task didn't get imported, manually trigger import of <code>C:\migration-notes\certify-task.xml</code> in Task Scheduler</> },
];
const SVC_FIREWALL_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 's50', label: <>Open inbound TCP/80 (ACME HTTP-01 challenge):<br /><code>New-NetFirewallRule -DisplayName "HTTP 80 inbound" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow</code></> },
  { id: 's51', label: <>Open inbound TCP/443 (HTTPS):<br /><code>New-NetFirewallRule -DisplayName "HTTPS 443 inbound" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow</code></> },
  { id: 's52', label: <>Disable / remove any port 3389 (RDP) inbound rules from the public profile if RDP is enabled (lock it to LAN only)</> },
];

// ── Cutover wizard items ───────────────────────────────────────────────
const CUT_DRYRUN_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'c1', label: <>All inventory items checked off on the new VM (Service migration wizard 100%)</> },
  { id: 'c2', label: <>Smoke test each site via parallel forward on port 8443: <code>https://workshop.enzolopez.net:8443/api/health</code> from cellular</> },
  { id: 'c3', label: <>Confirm DB writes persist: do a write in each app, restart container, write still there</> },
  { id: 'c4', label: <>Snapshot the new VM in Hyper-V (Action → Checkpoint → name it "pre-cutover")</> },
  { id: 'c5', label: <>Confirm Certify managed sites are paused</> },
];
const CUT_SYNC_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'c10', label: <>Notify family / users (if applicable) of brief unavailability</> },
  { id: 'c11', label: <>On OLD PC: <code>docker compose stop</code> for each app</> },
  { id: 'c12', label: <>On OLD PC: stop IIS sites that map to SecretApp (<code>Stop-Website -Name SecretApp</code>) — prevents writes during sync</> },
  { id: 'c13', label: <>Sync delta data from OLD → NEW: re-tar each Docker volume; <code>robocopy /MIR</code> for SecretApp data files</> },
  { id: 'c14', label: <>On NEW VM: restore the refreshed volumes; start containers</> },
  { id: 'c15', label: <>On NEW VM: start SecretApp IIS site</> },
  { id: 'c16', label: <>Verify each app on parallel forward (port 8443) one more time</> },
];
const CUT_FLIP_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'c20', label: <>Router admin → Port forwarding</> },
  { id: 'c21', label: <>Change WAN:443 forward from old LAN IP → new VM LAN IP</> },
  { id: 'c22', label: <>Change WAN:80 forward (if present)</> },
  { id: 'c23', label: <>Save / apply</> },
  { id: 'c24', label: <>Wait 30 sec; from cellular, hit <code>https://workshop.enzolopez.net</code></> },
  { id: 'c25', label: <>Repeat for each subdomain</> },
];
const CUT_CERTIFY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'c30', label: <>On NEW VM Certify: unpause one managed site</> },
  { id: 'c31', label: <>Click "Test" — runs HTTP-01 challenge; should succeed now that 80/443 route to new VM</> },
  { id: 'c32', label: <>If green: unpause all other managed sites</> },
  { id: 'c33', label: <>Force renewal on each: confirms Certify can issue + IIS auto-binds the new cert</> },
  { id: 'c34', label: <>Browser: visit each site, check the cert details (Subject, Issuer = Let's Encrypt, NotAfter ~90 days out)</> },
];
const CUT_OBSERVE_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'c40', label: <>Keep OLD PC powered on but with services stopped (rollback reserve)</> },
  { id: 'c41', label: <>Monitor logs: <code>docker compose logs -f</code> per app, IIS log files under <code>C:\inetpub\logs\LogFiles\</code></> },
  { id: 'c42', label: <>Check Certify renewals run nightly (Task Scheduler history)</> },
  { id: 'c43', label: <>Snapshot new VM ("post-cutover-stable") after 48h clean run</> },
];
const CUT_DECOMM_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'c50', label: <>Shut down OLD PC services in order: containers (<code>docker compose down</code>), IIS (<code>iisreset /stop</code>), Certify (close the app)</> },
  { id: 'c51', label: <>Take a final disk image of OLD PC (Macrium Reflect Free is good) to <code>D:\backups\old-pc-final.mrimg</code></> },
  { id: 'c52', label: <>Power off OLD PC</> },
  { id: 'c53', label: <>Wait one more week. If nothing surfaced that requires it, wipe the disk or repurpose the hardware</> },
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

export default function VmMigrationGuide() {
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
            <span className="sidebar-title">Home → VM Migration</span>
          </div>
          <div className="sidebar-sub">IIS + Docker + Certify</div>
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
          <div className="hero-tag">🖥️ VM Migration · 2026</div>
          <h1>Migrating to a<br />Fresh VM</h1>
          <p>
            Step-by-step playbook for moving your entire home stack — <strong style={{ color: '#C77AA0' }}>IIS + ARR + Docker + Certify the Web + Windows Firewall + router config</strong> — onto a fresh Windows 11 VM. Clean install on the target. Parallel-run cutover (zero downtime, instant rollback). Companion to the Azure migration; this is the "stay self-hosted on new hardware" path.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">8</span><span className="hero-stat-label">Chapters</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Wizards</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~10s</span><span className="hero-stat-label">Rollback</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Downtime</span></div>
          </div>
        </div>

        {/* SECTION 1 — OVERVIEW */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">0</span>Overview</h2>

          <h3>The big picture</h3>
          <MermaidDiagram theme="default" chart={`graph TB
  subgraph OLD["OLD HOME PC (current, port 443 forwarded here)"]
    Router1[Router :443] --> IIS1[IIS + ARR]
    IIS1 --> Docker1[Docker containers<br/>workshop, glp1, shopkeep]
    IIS1 --> SecretApp[SecretApp on IIS]
    Certify1[Certify the Web<br/>Let's Encrypt renewals]
    Certify1 -.->|cert PFX| IIS1
  end
  subgraph NEW["NEW WIN11 VM (provisioned in parallel)"]
    IIS2[IIS + ARR]
    Docker2[Docker containers]
    Certify2[Certify the Web]
    Certify2 -.->|cert PFX| IIS2
  end
  Router1 -.->|cutover: flip port forward| IIS2
  style OLD fill:#3a2f1f,stroke:#ffb454,color:#fff
  style NEW fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <h4>What you're doing</h4>
          <ol>
            <li><strong>Inventory</strong> everything currently running on the home PC (IIS sites, ARR rules, Docker containers, scheduled tasks, Certify managed certs, firewall rules).</li>
            <li><strong>Provision</strong> a Windows 11 VM on a hypervisor of your choice.</li>
            <li><strong>Clean-install</strong> Windows, then install IIS + ARR + Docker Desktop + Certify the Web from scratch.</li>
            <li><strong>Migrate</strong> each service's config + data into the new VM. Test each on a non-prod hostname.</li>
            <li><strong>Cut over</strong> by changing one router port-forward from old PC's LAN IP to the new VM's LAN IP.</li>
            <li><strong>Validate</strong> for 1–2 weeks while keeping old PC quiescent. Then decommission.</li>
          </ol>

          <h4>Why this works</h4>
          <ul>
            <li><strong>Parallel run = instant rollback.</strong> If the new VM has a problem, point the router forward back at the old PC. Total recovery: ~10 seconds (DNS cached at clients; router NAT is instant).</li>
            <li><strong>Clean install = no inherited cruft.</strong> Old PC has accumulated drivers, registry entries, half-removed apps, weird group policy. Starting fresh leaves all of that behind.</li>
            <li><strong>VM = snapshots and portability.</strong> Snapshot before risky changes. Export the VHDX/VMDK to back up the whole machine. Move to different hardware in the future without rebuilding.</li>
          </ul>

          <h4>Where this guide fits relative to the Azure migration</h4>
          <p>You have two complementary moves in flight:</p>
          <ul>
            <li><strong>Azure</strong> — eventually moves the apps off your home network entirely. The Azure guide covers this.</li>
            <li><strong>VM rehost</strong> (this guide) — keeps the apps self-hosted but on new hardware. Use this if Azure migration stalls, or if you want a bridge while Azure rolls out, or if a particular app stays self-hosted long-term (e.g., SecretApp, which isn't containerized).</li>
          </ul>
          <p>Both can run simultaneously: the VM serves traffic now; you move apps to Azure one at a time on its own schedule.</p>

          <h3>Prerequisites &amp; assumptions</h3>
          <h4>What you need before starting</h4>
          <ul>
            <li>A machine to host the VM — same physical PC running Hyper-V, a separate PC running VMware/VirtualBox, or a dedicated hypervisor box running Proxmox/ESXi.</li>
            <li>~16 GB RAM available for the VM (8 minimum), 100+ GB disk, 4+ CPU cores allocatable.</li>
            <li>Windows 11 ISO (Pro or Enterprise — Home doesn't include Hyper-V client). Download free from <a href="https://www.microsoft.com/en-us/software-download/windows11" target="_blank" rel="noreferrer">microsoft.com/software-download</a>.</li>
            <li>Local admin access to the existing home PC.</li>
            <li>Router admin password (for the port-forward change at cutover).</li>
            <li>Domain registrar / DNS host credentials for <code>enzolopez.net</code>.</li>
            <li>Certify the Web — ACME account email + a Pro license key if you have one (Community edition handles 5 certs/host fine).</li>
          </ul>

          <h4>Assumed current state on the home PC</h4>
          <ul>
            <li>IIS running with one site per subdomain (e.g., <code>workshop.enzolopez.net</code>, <code>glp1.enzolopez.net</code>, <code>shopkeep.enzolopez.net</code>, plus <code>SecretApp</code>).</li>
            <li>URL Rewrite + Application Request Routing (ARR) modules installed; ARR forwards each subdomain to a Docker container on <code>localhost:&lt;port&gt;</code>.</li>
            <li>Docker Desktop with three containers (workshop, glp1, shopkeep) listening on their respective host ports.</li>
            <li>Certify the Web is generating Let's Encrypt certs and binding them to IIS sites automatically.</li>
            <li>Router has <code>WAN:443 → LAN:&lt;home-PC-IP&gt;:443</code> port forward.</li>
            <li>Dynamic DNS (or static public IP) so <code>*.enzolopez.net</code> resolves to your WAN IP.</li>
          </ul>

          <p>If anything above differs (e.g., you use Caddy instead of IIS, or Pi-hole for DNS), the section structure still applies; you'll substitute the relevant tool.</p>
        </section>

        <hr />

        {/* SECTION 2 — INVENTORY */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">1</span>Inventory the current setup</h2>

          <h3>Why inventory first</h3>
          <p>Half the pain of a migration is discovering something forgotten three days after cutover. Spend an hour now enumerating <em>everything</em>. You'll find at least one surprise — a scheduled task, an undocumented IIS rewrite rule, a Docker volume nobody remembers creating.</p>
          <p>The inventory becomes both your acceptance criteria ("everything in this list works on the new VM") and your rollback diff ("if X breaks, what changed").</p>

          <h3>Inventory wizard <span className="badge green">interactive</span></h3>
          <p>Work through this on the <strong>current home PC</strong>. Save outputs to <code>C:\migration-notes\</code> as you go — you'll reference them from the new VM.</p>

          <h3>IIS — sites, bindings, app pools</h3>
          <Checklist prefix="inv-iis" items={INV_IIS_ITEMS} />

          <h3>IIS — URL Rewrite &amp; ARR rules</h3>
          <Checklist prefix="inv-rewrite" items={INV_REWRITE_ITEMS} />

          <h3>Docker — images, containers, volumes</h3>
          <Checklist prefix="inv-docker" items={INV_DOCKER_ITEMS} />

          <h3>Certify the Web — managed certs</h3>
          <Checklist prefix="inv-certify" items={INV_CERTIFY_ITEMS} />

          <h3>Windows Firewall</h3>
          <Checklist prefix="inv-firewall" items={INV_FIREWALL_ITEMS} />

          <h3>Router &amp; DNS</h3>
          <Checklist prefix="inv-router" items={INV_ROUTER_ITEMS} />

          <h3>Scheduled tasks &amp; auto-start</h3>
          <Checklist prefix="inv-tasks" items={INV_TASKS_ITEMS} />

          <h3>SecretApp (the non-containerized one)</h3>
          <Checklist prefix="inv-secretapp" items={INV_SECRETAPP_ITEMS} />
        </section>

        <hr />

        {/* SECTION 3 — HYPERVISOR */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">2</span>Pick a hypervisor &amp; build the VM</h2>

          <h3>Which hypervisor?</h3>
          <PathTabs
            tabs={[
              {
                id: 'hv',
                label: 'Hyper-V (recommended)',
                content: (
                  <>
                    <p><strong>Built into Windows 11 Pro/Enterprise.</strong> Free. Good performance. Tight Windows integration.</p>
                    <p><strong>Pros:</strong> nothing to install (just enable the feature), good console UX, snapshots called "checkpoints", PowerShell-scriptable via <code>Hyper-V</code> module.</p>
                    <p><strong>Cons:</strong> requires Pro SKU (Home edition doesn't include it). Coexists awkwardly with VirtualBox/VMware on the same host — pick one.</p>
                    <p><strong>Best for:</strong> running the VM on your existing or new Windows Pro PC, side-by-side with regular use.</p>
                  </>
                ),
              },
              {
                id: 'vmware',
                label: 'VMware Workstation',
                content: (
                  <>
                    <p><strong>VMware Workstation Pro</strong> — paid (~$200), recently free for personal use (verify current licensing). Cross-platform.</p>
                    <p><strong>Pros:</strong> excellent UX, snapshot tree visualizer, USB passthrough, OS support is broad. <code>vmrun</code> CLI is scriptable.</p>
                    <p><strong>Cons:</strong> licensing volatility; uses a different virtualization stack than Hyper-V.</p>
                    <p><strong>Best for:</strong> users already comfortable with VMware.</p>
                  </>
                ),
              },
              {
                id: 'vbox',
                label: 'VirtualBox',
                content: (
                  <>
                    <p><strong>Oracle VirtualBox</strong> — free, cross-platform.</p>
                    <p><strong>Pros:</strong> simple, well-known.</p>
                    <p><strong>Cons:</strong> performance trails Hyper-V/VMware. Nested-virt support is rough. Networking quirks (NAT vs bridged).</p>
                    <p><strong>Best for:</strong> short-term test VMs, not long-running production-style hosting. Skip for this migration.</p>
                  </>
                ),
              },
              {
                id: 'prox',
                label: 'Proxmox VE',
                content: (
                  <>
                    <p><strong>Proxmox VE</strong> — free, full hypervisor OS (Debian + KVM). Runs on dedicated hardware.</p>
                    <p><strong>Pros:</strong> web UI, snapshots, backup scheduling, multiple VMs, more "production" feel. ZFS support.</p>
                    <p><strong>Cons:</strong> dedicates a whole machine (you can't use the host for desktop work). Bigger learning curve.</p>
                    <p><strong>Best for:</strong> dedicating an old PC as a home server permanently. Best long-term answer if you'll run several VMs.</p>
                  </>
                ),
              },
            ]}
          />

          <p>This guide assumes <strong>Hyper-V on Windows 11 Pro</strong>. Where steps differ on Proxmox/VMware, the concept is identical — just the UI changes.</p>

          <h3>Enable Hyper-V on the host</h3>
          <p>Run elevated PowerShell:</p>
          <CodePre>{`# Check edition (must be Pro / Enterprise / Education)
(Get-WmiObject -Class Win32_OperatingSystem).Caption

# Enable Hyper-V (requires reboot)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All

# After reboot, verify
Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V | Select State`}</CodePre>

          <h4>Create a virtual switch</h4>
          <p>The VM needs network access. You have three options:</p>
          <table>
            <tbody>
              <tr><th>Switch type</th><th>What it does</th><th>Use for</th></tr>
              <tr><td><strong>External</strong> ✅</td><td>Bridges the VM directly to your LAN. VM gets its own DHCP lease from the router, just like a separate physical PC.</td><td>This migration. Lets the router port-forward to the VM by LAN IP.</td></tr>
              <tr><td>Internal</td><td>VM ↔ host only. No internet.</td><td>Air-gapped test labs.</td></tr>
              <tr><td>Private</td><td>VM ↔ VM only. Not even the host.</td><td>Multi-VM isolated networks.</td></tr>
            </tbody>
          </table>

          <CodePre>{`# List physical adapters
Get-NetAdapter | Where Status -eq Up | Select Name,InterfaceDescription

# Create an external switch bound to your Ethernet adapter (replace name)
New-VMSwitch -Name "ExternalSwitch" -NetAdapterName "Ethernet" -AllowManagementOS $true`}</CodePre>
          <p><code>-AllowManagementOS $true</code> keeps the host able to use the network through the same NIC. Required if the host only has one NIC.</p>

          <h3>Create the VM</h3>
          <h4>Sizing</h4>
          <table>
            <tbody>
              <tr><th>Resource</th><th>Min</th><th>Recommended</th><th>Note</th></tr>
              <tr><td>vCPU</td><td>2</td><td><strong>4</strong></td><td>Docker + IIS + Windows itself</td></tr>
              <tr><td>RAM</td><td>4 GB</td><td><strong>8 GB</strong> (12 if comfortable)</td><td>Docker Desktop alone wants 4 GB</td></tr>
              <tr><td>Disk</td><td>60 GB</td><td><strong>100 GB dynamic</strong></td><td>Dynamic = grows as used, capped at 100. Saves host disk.</td></tr>
              <tr><td>Generation</td><td>—</td><td><strong>Gen 2</strong></td><td>UEFI boot, Secure Boot, modern</td></tr>
            </tbody>
          </table>

          <h4>Create via PowerShell (preferred — scriptable)</h4>
          <CodePre>{`$VMName  = "win11-services"
$Switch  = "ExternalSwitch"
$VHDPath = "D:\\Hyper-V\\$VMName\\$VMName.vhdx"
$ISOPath = "D:\\ISO\\Win11.iso"

New-VM -Name $VMName \`
       -MemoryStartupBytes 8GB \`
       -Generation 2 \`
       -NewVHDPath $VHDPath \`
       -NewVHDSizeBytes 100GB \`
       -SwitchName $Switch

Set-VM -Name $VMName -ProcessorCount 4 -AutomaticCheckpointsEnabled $false
Set-VMMemory -VMName $VMName -DynamicMemoryEnabled $true -MinimumBytes 4GB -MaximumBytes 12GB -StartupBytes 8GB

# Mount the Win11 ISO
Add-VMDvdDrive -VMName $VMName -Path $ISOPath

# Boot order: DVD first for install
$dvd = Get-VMDvdDrive -VMName $VMName
Set-VMFirmware -VMName $VMName -FirstBootDevice $dvd

# Hyper-V Gen 2 requires Secure Boot template configured for Windows (default for Win11)
Set-VMFirmware -VMName $VMName -EnableSecureBoot On

# Start it
Start-VM $VMName
vmconnect localhost $VMName  # opens the console`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Disable automatic checkpoints.</strong> Automatic checkpoints sound helpful but quietly bloat your host disk and break some apps that don't expect snapshots. Disable them; take manual checkpoints when you mean to.</div>
          </div>

          <h4>Or via Hyper-V Manager UI</h4>
          <ol>
            <li>Open Hyper-V Manager → Action → New → Virtual Machine.</li>
            <li>Name: <code>win11-services</code>. Specify location on a roomy drive.</li>
            <li>Generation 2.</li>
            <li>RAM: 8 GB startup, dynamic memory enabled, min 4 GB max 12 GB.</li>
            <li>Network: ExternalSwitch.</li>
            <li>Disk: create new VHDX, 100 GB.</li>
            <li>Installation: install OS later (we'll mount the ISO).</li>
            <li>After creation: VM Settings → DVD Drive → mount Win11 ISO. Processor → 4 vCPUs. Checkpoints → disable automatic.</li>
            <li>Start.</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 4 — WIN11 INSTALL + PREP */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">3</span>Install &amp; prep Windows 11</h2>

          <h3>Installer walkthrough</h3>
          <ol>
            <li>VM boots from ISO. Click through language → Install Now.</li>
            <li>Enter product key (or "I don't have a product key" — you can activate later).</li>
            <li>Select edition: <strong>Windows 11 Pro</strong> (Home lacks features you'll want for the host machine; on the VM itself Home would work but Pro is more flexible).</li>
            <li>Accept license, "Custom: Install Windows only".</li>
            <li>Select the 100 GB virtual disk, Next.</li>
            <li>Install runs (~10 min on SSD).</li>
          </ol>

          <h3>Out-of-Box Experience (OOBE)</h3>
          <p>Win11 by default forces a Microsoft account. For a server-style VM, a local account is cleaner:</p>
          <CodePre>{`At "Let's connect you to a network":
  Press Shift+F10 to open command prompt
  Type:  OOBE\\BYPASSNRO
  Press Enter
  VM reboots; this time "I don't have internet" option appears
Now create a local account:
  Username: srvadmin (or your preference)
  Password: (a strong one — this is the box behind your public IP)
  Skip all security questions or set them
Disable all telemetry toggles in privacy step`}</CodePre>

          <h3>First-boot hardening</h3>
          <p>Elevated PowerShell on the new VM:</p>
          <CodePre>{`# Rename the host
Rename-Computer -NewName "vm-services" -Force

# Set timezone (replace as needed)
Set-TimeZone -Id "Eastern Standard Time"

# Disable sleep / hibernate (this is a server now)
powercfg -change -standby-timeout-ac 0
powercfg -change -hibernate-timeout-ac 0
powercfg -h off

# Set a strong local admin password if not already
# (use net user srvadmin * to prompt interactively)

# Install all updates and reboot
Install-Module PSWindowsUpdate -Force -SkipPublisherCheck
Import-Module PSWindowsUpdate
Get-WindowsUpdate
Install-WindowsUpdate -AcceptAll -AutoReboot`}</CodePre>

          <h3>Networking — static IP via the router</h3>
          <p>You want a stable LAN IP for the VM (so the router port forward keeps pointing at it). Two ways:</p>
          <ul>
            <li><strong>Preferred: DHCP reservation</strong> at the router. Find the VM's MAC (<code>Get-VMNetworkAdapter -VMName win11-services</code> or <code>ipconfig /all</code> inside the VM), then create a reservation in the router admin → DHCP table. VM still uses DHCP but always gets the same IP.</li>
            <li>
              <strong>Alternative: static IP</strong> inside Windows. Risk: if router DHCP scope is misconfigured you can end up with conflicts. PowerShell:
              <CodePre>{`New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.50 -PrefixLength 24 -DefaultGateway 192.168.1.1
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 1.1.1.1,8.8.8.8`}</CodePre>
            </li>
          </ul>
          <p>Verify from the host: <code>ping vm-services</code> (resolves over LAN if router does DNS) or <code>ping 192.168.1.50</code>.</p>

          <h3>Install core tools</h3>
          <p>Use <code>winget</code> (built into Win11):</p>
          <CodePre>{`winget install --id Microsoft.PowerShell -e        # pwsh 7+
winget install --id Git.Git -e
winget install --id Microsoft.VisualStudioCode -e
winget install --id Microsoft.WindowsTerminal -e
winget install --id 7zip.7zip -e`}</CodePre>

          <h3>Hyper-V Integration Services</h3>
          <p>Already built into Win11 — verify with <code>Get-Service vmicheartbeat,vmickvpexchange | Format-Table -AutoSize</code>. These give you "Quick Create" features like file copy between host and VM (<code>Copy-VMFile</code>).</p>
        </section>

        <hr />

        {/* SECTION 5 — INSTALL STACK */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">4</span>Install IIS, ARR, Docker, Certify</h2>

          <h3>IIS + URL Rewrite + ARR</h3>
          <h4>Enable IIS features</h4>
          <CodePre>{`# Core IIS + most common modules
Enable-WindowsOptionalFeature -Online -All -FeatureName \`
  IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, \`
  IIS-StaticContent, IIS-DefaultDocument, IIS-DirectoryBrowsing, \`
  IIS-HttpErrors, IIS-HttpRedirect, IIS-ApplicationDevelopment, \`
  IIS-NetFxExtensibility45, IIS-HealthAndDiagnostics, IIS-HttpLogging, \`
  IIS-LoggingLibraries, IIS-RequestMonitor, IIS-HttpTracing, \`
  IIS-Security, IIS-RequestFiltering, IIS-Performance, \`
  IIS-WebServerManagementTools, IIS-ManagementConsole, \`
  IIS-IIS6ManagementCompatibility, IIS-Metabase, \`
  NetFx4Extended-ASPNET45, IIS-ASPNET45, IIS-ISAPIExtensions, IIS-ISAPIFilter, \`
  IIS-WebSockets

# Verify
Get-WindowsOptionalFeature -Online -FeatureName IIS-WebServer | Select State`}</CodePre>

          <h4>Install URL Rewrite</h4>
          <CodePre>{`# URL Rewrite 2.1 (latest from Microsoft)
$url = "https://download.microsoft.com/download/1/2/8/128E2E22-C1B9-44A4-BE2A-5859ED1D4592/rewrite_amd64_en-US.msi"
Invoke-WebRequest -Uri $url -OutFile "$env:TEMP\\rewrite.msi"
Start-Process msiexec.exe -ArgumentList "/i $env:TEMP\\rewrite.msi /qn" -Wait`}</CodePre>

          <h4>Install Application Request Routing (ARR)</h4>
          <CodePre>{`# ARR 3.0
$url = "https://download.microsoft.com/download/E/9/8/E9849D6A-020E-47E4-9FD0-A023E99B54EB/requestRouter_amd64.msi"
Invoke-WebRequest -Uri $url -OutFile "$env:TEMP\\arr.msi"
Start-Process msiexec.exe -ArgumentList "/i $env:TEMP\\arr.msi /qn" -Wait

# Verify both modules appear in IIS Manager → Server-level → Modules
# After install, ARR adds: "Application Request Routing Cache" + "Server Farms" features`}</CodePre>

          <h4>Enable ARR proxy</h4>
          <p>ARR ships disabled. Enable it once (server-level setting):</p>
          <CodePre>{`Import-Module IISAdministration
# Or via appcmd:
%windir%\\system32\\inetsrv\\appcmd.exe set config -section:system.webServer/proxy /enabled:"True" /commit:apphost`}</CodePre>
          <p>You can also do this in IIS Manager: click the server node → Application Request Routing Cache → Server Proxy Settings → check "Enable proxy".</p>

          <h3>Docker Desktop</h3>
          <h4>License check</h4>
          <p>Docker Desktop is free for personal use, small businesses (&lt;250 employees, &lt;$10M revenue), education, and non-commercial open source. Personal home use qualifies. For paid contexts, see <a href="https://www.docker.com/pricing/" target="_blank" rel="noreferrer">docker.com/pricing</a>.</p>

          <h4>Enable WSL2 (required backend)</h4>
          <CodePre>{`wsl --install --no-distribution
# If wsl is already installed:
wsl --update
wsl --set-default-version 2

# Verify
wsl --status`}</CodePre>

          <h4>Install Docker Desktop</h4>
          <CodePre>{`winget install --id Docker.DockerDesktop -e`}</CodePre>
          <p>Or download the installer from <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noreferrer">docker.com/products/docker-desktop</a>.</p>

          <h4>First-run setup</h4>
          <ol>
            <li>Launch Docker Desktop. Accept EULA.</li>
            <li>
              Settings → General:
              <ul>
                <li>✅ Start Docker Desktop when you sign in</li>
                <li>✅ Use the WSL 2 based engine</li>
                <li>❌ Send usage statistics (your call)</li>
              </ul>
            </li>
            <li>
              Settings → Resources:
              <ul>
                <li>Memory: 4 GB (more if needed)</li>
                <li>CPUs: 2 (of the VM's 4)</li>
                <li>Disk: keep default (it's per-WSL distro)</li>
              </ul>
            </li>
            <li>Settings → Resources → WSL Integration: enable for any distros you'll use (Ubuntu, etc., optional).</li>
            <li>Apply &amp; restart Docker.</li>
          </ol>

          <h4>Auto-start the engine on VM boot</h4>
          <p>Docker Desktop's "start on login" requires an interactive logon — not ideal for a headless VM. Two options:</p>
          <ul>
            <li><strong>Configure autologon</strong> for the VM's service account (sets registry to auto-sign-in at boot, then Docker Desktop launches at login). Use <code>autologon.exe</code> from Sysinternals.</li>
            <li><strong>Switch to Docker Engine</strong> (the daemon without the Desktop UI) — runs as a Windows service, auto-starts at boot, no login required. More setup but no human session needed.</li>
          </ul>
          <p>For a personal setup, autologon is simpler.</p>

          <h3>Certify the Web</h3>
          <h4>Install</h4>
          <CodePre>{`winget install --id Webprofusion.CertifyTheWebClient -e
# or download from https://certifytheweb.com`}</CodePre>
          <p>Certify needs IIS already installed (it integrates via the IIS COM API). Make sure IIS is installed before Certify.</p>

          <h4>First-run setup</h4>
          <ol>
            <li>Launch Certify the Web.</li>
            <li>It will offer to register an ACME account on Let's Encrypt. Click "Yes" and enter your email (the same email you used on the old PC keeps your renewal history continuous in your inbox).</li>
            <li>Optional: enter your Pro license key from the old install. License keys are typically tied to a host name — Certify support can migrate the key if you ask.</li>
            <li>Settings → Backup &amp; Restore → "Import from Backup" → select the <code>.cert-mgr-backup</code> file from <code>C:\migration-notes\certify-backup\</code>. Enter the password.</li>
            <li>Import preserves your managed certs list, ACME account key, and credentials. Renewals re-run on schedule.</li>
          </ol>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Don't actually issue certs yet.</strong> Once imported, Certify <em>will try to renew expiring certs immediately</em>. If renewals use HTTP-01 challenges and your router still forwards 443/80 to the OLD PC, the new VM's challenge attempts will fail because Let's Encrypt won't be able to reach it. Open the imported managed sites and click "Pause" on each until cutover. Or — better — wait to import until after cutover.</div>
          </div>

          <h4>HTTP-01 vs DNS-01 challenges (worth knowing)</h4>
          <table>
            <tbody>
              <tr><th>Challenge</th><th>How it works</th><th>Used when</th></tr>
              <tr><td><strong>HTTP-01</strong> ✅ (your current)</td><td>Let's Encrypt connects to <code>http://&lt;domain&gt;/.well-known/acme-challenge/&lt;token&gt;</code>. Your server replies with the token. Proves you control the domain. Requires port 80 open to the public.</td><td>Default. Easiest for IIS + Certify.</td></tr>
              <tr><td>DNS-01</td><td>Let's Encrypt asks for a TXT record at <code>_acme-challenge.&lt;domain&gt;</code> with a specific value. Requires API access to your DNS host. Doesn't need any port open.</td><td>Wildcard certs (<code>*.enzolopez.net</code>). Or if port 80 is unavailable.</td></tr>
            </tbody>
          </table>
          <p>HTTP-01 needs port 80 forwarded to the new VM at cutover, alongside 443. Add a rule to Windows Firewall for inbound TCP/80.</p>
        </section>

        <hr />

        {/* SECTION 6 — MIGRATE SERVICES */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">5</span>Migrate the services</h2>

          <h3>Service migration wizard <span className="badge green">interactive</span></h3>
          <p>Work through these on the <strong>new VM</strong>, copying configs/data from your <code>C:\migration-notes\</code> dump on the old PC. Use a USB drive, a network share, or <code>Copy-VMFile</code> from the host to transfer.</p>

          <h3>Get the files onto the new VM</h3>
          <Checklist prefix="svc-files" items={SVC_FILES_ITEMS} />

          <h3>Docker: restore containers</h3>
          <Checklist prefix="svc-docker" items={SVC_DOCKER_ITEMS} />

          <h3>IIS: recreate sites &amp; ARR rules</h3>
          <Checklist prefix="svc-iis" items={SVC_IIS_ITEMS} />

          <h3>SecretApp (non-containerized)</h3>
          <Checklist prefix="svc-secretapp" items={SVC_SECRETAPP_ITEMS} />

          <h3>Certify the Web: import + verify</h3>
          <Checklist prefix="svc-certify" items={SVC_CERTIFY_ITEMS} />

          <h3>Windows Firewall</h3>
          <Checklist prefix="svc-firewall" items={SVC_FIREWALL_ITEMS} />

          <h3>IIS migration deep dive — what to copy vs recreate</h3>
          <p><code>applicationHost.config</code> is tempting to copy whole-file from old PC to new PC. <strong>Don't.</strong> It contains:</p>
          <ul>
            <li>Cert thumbprints that don't exist on the new machine yet.</li>
            <li>Machine-specific encrypted credentials (app pool identities with passwords).</li>
            <li>References to physical paths and modules.</li>
          </ul>
          <p>A blunt copy will surface as IIS Manager errors after restart. Instead, copy <em>fragments</em>:</p>

          <h4>What to copy directly</h4>
          <table>
            <tbody>
              <tr><th>Item</th><th>Source</th><th>Destination</th></tr>
              <tr><td>Per-site <code>web.config</code></td><td><code>&lt;site-physical-path&gt;\web.config</code></td><td>Same path on new VM</td></tr>
              <tr><td>Site content (static files, dist)</td><td>Site's physical path</td><td>Same path on new VM</td></tr>
            </tbody>
          </table>

          <h4>What to recreate via IIS Manager / PowerShell</h4>
          <table>
            <tbody>
              <tr><th>Item</th><th>How</th></tr>
              <tr><td>Sites + bindings</td><td><code>New-Website</code> per site, or IIS Manager → Add Website</td></tr>
              <tr><td>App pools</td><td><code>New-WebAppPool</code> with matching <code>.NET CLR</code>, pipeline mode, identity</td></tr>
              <tr><td>Server-level rewrite rules</td><td>IIS Manager → server node → URL Rewrite → Add Rule. Or paste the XML fragment into the global <code>applicationHost.config</code> at <code>&lt;system.webServer&gt;/&lt;rewrite&gt;/&lt;globalRules&gt;</code></td></tr>
              <tr><td>ARR proxy settings</td><td>IIS Manager → server node → Application Request Routing Cache</td></tr>
              <tr><td>ARR server farms (if any)</td><td>IIS Manager → server node → Server Farms → Add Server Farm</td></tr>
              <tr><td>HTTPS bindings</td><td>Done automatically by Certify when it issues/renews a cert. Or manually: IIS Manager → site → Bindings → Add → HTTPS + cert.</td></tr>
            </tbody>
          </table>

          <h4>Scripted site recreation</h4>
          <p>If you want to script the IIS setup (recommended for repeatability), use <code>WebAdministration</code> module:</p>
          <CodePre>{`Import-Module WebAdministration

# App pool
New-WebAppPool -Name "workshop-pool"
Set-ItemProperty IIS:\\AppPools\\workshop-pool -Name managedRuntimeVersion -Value ""
Set-ItemProperty IIS:\\AppPools\\workshop-pool -Name managedPipelineMode -Value "Integrated"

# Site (HTTP only initially; Certify will add HTTPS binding)
New-Website -Name "workshop" \`
            -PhysicalPath "C:\\inetpub\\wwwroot\\workshop" \`
            -ApplicationPool "workshop-pool" \`
            -HostHeader "workshop.enzolopez.net" \`
            -Port 80

# Validate
Get-Website -Name "workshop" | Format-List`}</CodePre>

          <h4>ARR reverse-proxy rules — the per-site rule pattern</h4>
          <p>Each ARR'd site has a <code>web.config</code> like this:</p>
          <CodePre>{`<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxyToDocker" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:3006/{R:1}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_HOST" value="{HTTP_HOST}" />
            <set name="HTTP_X_FORWARDED_PROTO" value="https" />
          </serverVariables>
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>`}</CodePre>
          <p>If your old web.configs use server variables like <code>HTTP_X_FORWARDED_*</code>, you need to whitelist them at the server level on the new VM (otherwise IIS rejects them):</p>
          <CodePre>{`IIS Manager → server node → URL Rewrite → "View Server Variables" (right side)
  Add: HTTP_X_FORWARDED_HOST
  Add: HTTP_X_FORWARDED_PROTO
  Add: any other custom variables your rules set`}</CodePre>

          <h3>Docker migration deep dive — volumes are the only thing that matter</h3>
          <p>Docker images can be rebuilt from Dockerfiles. Docker compose files live in Git. Containers are ephemeral. <strong>Volumes are the only durable state.</strong> Get the volume migration right and everything else is just <code>docker compose up</code>.</p>

          <h4>Inventory volumes precisely</h4>
          <CodePre>{`docker volume ls -q | ForEach-Object {
  $info = docker volume inspect $_ | ConvertFrom-Json
  [pscustomobject]@{
    Name       = $info.Name
    Driver     = $info.Driver
    Mountpoint = $info.Mountpoint
    Containers = (docker ps -aq --filter "volume=$($info.Name)") -join ','
  }
} | Format-Table -AutoSize`}</CodePre>

          <h4>Three ways to move volume data</h4>
          <PathTabs
            tabs={[
              {
                id: 'tar',
                label: 'tar (recommended)',
                content: (
                  <>
                    <p>Treat each volume as an opaque tarball. Most portable.</p>
                    <p><strong>On OLD PC:</strong> stop the containers using the volume, then:</p>
                    <CodePre>{`docker compose -f Q:\\repo\\workshop\\docker-compose.yml stop
docker run --rm \`
  -v workshop_workshop-data:/source:ro \`
  -v "C:\\migration-notes\\volume-backups:/backup" \`
  alpine tar czf /backup/workshop-data.tar.gz -C /source .`}</CodePre>
                    <p>(volume name is typically <code>&lt;project&gt;_&lt;volname&gt;</code> — confirm with <code>docker volume ls</code>)</p>
                    <p><strong>On NEW VM:</strong></p>
                    <CodePre>{`docker volume create workshop_workshop-data
docker run --rm \`
  -v workshop_workshop-data:/target \`
  -v "C:\\migration-notes\\volume-backups:/backup" \`
  alpine tar xzf /backup/workshop-data.tar.gz -C /target`}</CodePre>
                    <p>Then <code>docker compose up -d</code> — the container finds its data already in place.</p>
                  </>
                ),
              },
              {
                id: 'bind',
                label: 'Bind-mount conversion',
                content: (
                  <>
                    <p>If you change <code>docker-compose.yml</code> to use bind mounts (host paths) instead of named volumes, the data just lives on the host filesystem and is trivially backed up:</p>
                    <CodePre>{`services:
  workshop:
    # ...
    volumes:
      # Old: workshop-data:/data
      # New: bind mount to a host path
      - C:\\dockerdata\\workshop:/data`}</CodePre>
                    <p>Migration becomes "copy <code>C:\dockerdata\workshop</code> from old to new". Trade-off: container's data path is now exposed to host file system; permissions can be quirky on Windows.</p>
                  </>
                ),
              },
              {
                id: 'reg',
                label: 'Push to registry',
                content: (
                  <>
                    <p>Push images to a registry (Docker Hub, ACR, GitHub Container Registry) on the old PC; pull on the new. Doesn't help with volumes — only with images. Useful in conjunction with the tar approach for moving custom-built images, or if you don't want to rebuild on the VM.</p>
                  </>
                ),
              },
            ]}
          />

          <h4>SQLite + WAL — stop the container before copying</h4>
          <p>SQLite uses three files: <code>foo.db</code>, <code>foo.db-shm</code>, <code>foo.db-wal</code>. The WAL contains writes not yet committed to the main file. If you copy only the <code>.db</code> while the container is running, you lose recent writes.</p>
          <p>Procedure:</p>
          <ol>
            <li><code>docker compose stop</code> on the source.</li>
            <li>Either copy all three files, or run <code>sqlite3 foo.db "PRAGMA wal_checkpoint(FULL);"</code> first which folds the WAL into the main DB.</li>
            <li>Copy the volume (tar) to the destination.</li>
            <li>Bring up the destination container.</li>
          </ol>

          <h3>Certify the Web — account + cert migration in detail</h3>
          <h4>What's inside a Certify backup</h4>
          <ul>
            <li>Managed sites configuration (which domains, which IIS sites, which challenge).</li>
            <li>ACME account credentials (the private key Let's Encrypt knows about — critical for renewals to be recognized as "the same account").</li>
            <li>Issued certificates (PFX files with private keys).</li>
            <li>Scheduled renewal task definition.</li>
          </ul>

          <h4>Import order matters</h4>
          <ol>
            <li><strong>Install Certify</strong> on the new VM but don't register a new ACME account.</li>
            <li><strong>Import the backup</strong> — this brings in the existing ACME account, so Let's Encrypt sees you as the same registered party.</li>
            <li><strong>Pause all managed sites</strong> before they auto-renew (during the period when port 80/443 still go to the OLD PC, the new VM can't pass HTTP-01 challenges).</li>
            <li><strong>After cutover</strong> (router forward flipped to new VM), unpause managed sites. Test renewal manually: select a site → "Request Certificate" → ✓ to confirm renewal works.</li>
          </ol>

          <h4>If the backup is missing or corrupted</h4>
          <p>You can register a fresh ACME account on the new VM. Existing certs remain valid until they expire (~90 days); renewals will happen against the new account starting then. There's no penalty from Let's Encrypt for having multiple registered accounts to one email.</p>

          <h4>Wildcard certs (if you want them)</h4>
          <p>A single <code>*.enzolopez.net</code> cert covers any subdomain. Pros: one cert to manage. Cons: requires DNS-01 challenge, which requires API access to your DNS host. Certify supports Cloudflare, Route53, Azure DNS, GoDaddy, and many others as DNS providers — you'd configure API credentials in Certify's "Credentials" store.</p>
          <p>For your current per-subdomain setup, HTTP-01 keeps working. Wildcards are an option, not a requirement.</p>
        </section>

        <hr />

        {/* SECTION 7 — NETWORKING & CUTOVER */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">6</span>Networking &amp; cutover</h2>

          <h3>Where the packets go (today vs. after cutover)</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User browser
  participant ISP as Internet
  participant R as Home router
  participant Old as OLD PC (IIS+ARR+Docker)
  participant New as NEW VM (IIS+ARR+Docker)
  rect rgb(58, 47, 31)
  Note over R: BEFORE cutover
  U->>ISP: HTTPS workshop.enzolopez.net
  ISP->>R: arrives at WAN IP, port 443
  R->>Old: NAT to 192.168.1.50:443
  Old->>U: response
  end
  rect rgb(31, 58, 47)
  Note over R: AFTER cutover (router forward flipped)
  U->>ISP: HTTPS workshop.enzolopez.net
  ISP->>R: arrives at WAN IP, port 443
  R->>New: NAT to 192.168.1.60:443
  New->>U: response
  end`} />

          <p>The cutover is literally one change at the router: the destination LAN IP for the port-443 forward.</p>

          <h3>Router port forwarding</h3>
          <h4>Before cutover — add (don't replace) a parallel test forward</h4>
          <p>If you want to test the new VM externally before going live:</p>
          <ul>
            <li>Pick a non-standard external port (e.g., 8443).</li>
            <li>Add a router rule: <code>WAN:8443 → 192.168.1.60:443</code>.</li>
            <li>Visit <code>https://&lt;your-domain&gt;:8443/...</code> from a phone on cellular (bypasses LAN).</li>
            <li>This lets you smoke-test before flipping production.</li>
          </ul>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Cert validity at :8443.</strong> Your Let's Encrypt cert is valid for the hostname, not the port — it'll work fine on a non-standard port. The browser may complain about HSTS pinning if you've enabled it; check from an incognito window.</div>
          </div>

          <h4>At cutover</h4>
          <ol>
            <li>Note the existing rule's current settings (screenshot).</li>
            <li>Edit the rule for WAN:443 to point at <strong>192.168.1.60</strong> (new VM) instead of <strong>192.168.1.50</strong> (old PC).</li>
            <li>Edit the rule for WAN:80 if you have one (Certify HTTP-01 challenges).</li>
            <li>Save. Most routers apply changes within seconds.</li>
            <li>Test from a clean source: phone on cellular, or a fresh incognito window.</li>
          </ol>

          <h4>Rollback (if needed)</h4>
          <p>Edit the rule back to 192.168.1.50. Done. The old PC was still running through all of this.</p>

          <h4>NAT loopback / Hairpin NAT</h4>
          <p>Some routers can't NAT a connection that originated inside the LAN back into the LAN. Symptom: <code>workshop.enzolopez.net</code> works from outside, hangs from inside. Two fixes:</p>
          <ul>
            <li>Enable NAT loopback in router settings (sometimes called Hairpin NAT, Reflection, or Loopback).</li>
            <li>Use split-horizon DNS: tell internal devices that <code>workshop.enzolopez.net</code> = LAN IP directly. Pi-hole, AdGuard Home, or your router's local DNS overrides can do this.</li>
          </ul>

          <h3>Dynamic DNS</h3>
          <p>Most home internet connections have dynamic public IPs that change occasionally. <code>enzolopez.net</code> needs a DDNS updater to keep its A record pointed at your current WAN IP.</p>

          <h4>Where does your current DDNS update from?</h4>
          <PathTabs
            tabs={[
              {
                id: 'router-ddns',
                label: 'Router (recommended)',
                content: (
                  <>
                    <p>If your router has built-in DDNS (most consumer routers do — look under "Dynamic DNS" or "DDNS" in admin), it updates whenever the WAN IP changes. <strong>No migration needed</strong> — it's tied to the router, not the PC.</p>
                    <p>This is the right place for it long-term. Confirm in your router's admin UI.</p>
                  </>
                ),
              },
              {
                id: 'pc-ddns',
                label: 'Client on home PC',
                content: (
                  <>
                    <p>If a Windows app on the old PC handles DDNS updates (Dyn Updater, No-IP DUC, ddclient via WSL), it'll stop when the old PC powers off. You need to either:</p>
                    <ul>
                      <li><strong>Install the same client</strong> on the new VM. Same credentials.</li>
                      <li><strong>Move DDNS to the router</strong> (better) — it should never depend on a specific PC.</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 'static',
                label: 'Static IP',
                content: <p>If you have a static WAN IP (paid business plan), nothing to migrate. Skip this section.</p>,
              },
            ]}
          />

          <h3>Cutover wizard <span className="badge green">interactive</span></h3>
          <p>Run this end-to-end on the day of cutover. Plan a 30–60 min focused window even with parallel run; you'll want to monitor closely. Most steps are reversible.</p>

          <h3>T-1 day: final dry run</h3>
          <Checklist prefix="cut-dryrun" items={CUT_DRYRUN_ITEMS} />

          <h3>T-0: final data sync</h3>
          <Checklist prefix="cut-sync" items={CUT_SYNC_ITEMS} />

          <h3>The flip</h3>
          <Checklist prefix="cut-flip" items={CUT_FLIP_ITEMS} />

          <h3>Post-flip — Certify renewals</h3>
          <Checklist prefix="cut-certify" items={CUT_CERTIFY_ITEMS} />

          <h3>48h observation</h3>
          <Checklist prefix="cut-observe" items={CUT_OBSERVE_ITEMS} />

          <h3>Decommission OLD PC (after 1–2 weeks of stable new operation)</h3>
          <Checklist prefix="cut-decomm" items={CUT_DECOMM_ITEMS} />
        </section>

        <hr />

        {/* SECTION 8 — OPS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">7</span>Ongoing operations on the VM</h2>

          <h3>Snapshots, backups, updates</h3>
          <h4>Snapshots (called "Checkpoints" in Hyper-V)</h4>
          <p>Take one before anything risky: Windows updates, IIS module changes, Docker Desktop upgrades, schema migrations.</p>
          <CodePre>{`# Take a checkpoint
Checkpoint-VM -Name win11-services -SnapshotName "before-iis-tweak"

# List checkpoints
Get-VMCheckpoint -VMName win11-services | Format-Table Name,CreationTime,ParentSnapshotName

# Restore
Restore-VMCheckpoint -Name "before-iis-tweak" -VMName win11-services -Confirm:$false

# Delete old checkpoints (they consume disk)
Remove-VMCheckpoint -VMName win11-services -Name "before-iis-tweak"`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Don't keep checkpoints long-term.</strong> Each active checkpoint adds disk and IO overhead — Hyper-V writes to an AVHDX differencing disk instead of the base VHDX. Long chains hurt performance. Take, validate, then merge.</div>
          </div>

          <h4>Data backups (the only thing that matters)</h4>
          <p>The VM can be rebuilt from this guide; what can't be rebuilt is your data. Daily backup of:</p>
          <ul>
            <li>Docker volumes (tar them to a host path, then copy off-box)</li>
            <li>SecretApp data folder</li>
            <li>IIS site contents (relatively static)</li>
            <li>Certify backup file (re-export after any cert changes)</li>
          </ul>
          <CodePre>{`$Backup = "D:\\backups\\$(Get-Date -Format yyyy-MM-dd)"
New-Item -ItemType Directory -Force $Backup | Out-Null

# Docker volumes
docker volume ls -q | ForEach-Object {
  docker run --rm -v \${_}:/data -v "\${Backup}:/backup" alpine tar czf "/backup/$_.tar.gz" -C /data .
}

# SecretApp data
robocopy "C:\\inetpub\\wwwroot\\SecretApp\\App_Data" "$Backup\\SecretApp" /MIR

# Optional: push to OneDrive / Azure Blob / external HDD
# robocopy $Backup "Z:\\offsite\\$(Get-Date -Format yyyy-MM-dd)" /MIR`}</CodePre>
          <p>Schedule via Task Scheduler nightly.</p>

          <h4>Whole-VM backup (occasional)</h4>
          <p>Export the entire VM to capture state-of-the-world:</p>
          <CodePre>{`Stop-VM -Name win11-services
Export-VM -Name win11-services -Path "D:\\backups\\vm-exports\\$(Get-Date -Format yyyy-MM-dd)"
Start-VM -Name win11-services`}</CodePre>
          <p>Quarterly is plenty if daily data backups exist.</p>

          <h4>Windows Updates</h4>
          <p>You want updates, but on your schedule (not 4 AM during a deploy):</p>
          <CodePre>{`# Disable auto-restart (still installs; reboots happen manually)
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" \`
  -Name NoAutoRebootWithLoggedOnUsers -Value 1

# Set active hours (don't restart during your typical use times)
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\WindowsUpdate\\UX\\Settings" \`
  -Name ActiveHoursStart -Value 7
Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\WindowsUpdate\\UX\\Settings" \`
  -Name ActiveHoursEnd -Value 23`}</CodePre>
          <p>Patch monthly: snapshot → <code>Install-WindowsUpdate</code> → verify services → discard snapshot.</p>
        </section>

        <hr />

        {/* SECTION 9 — TROUBLESHOOTING */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">8</span>Troubleshooting</h2>

          <h3>IIS / ARR issues</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>502 Bad Gateway from ARR</td><td>Container isn't running, or wrong target port</td><td><code>docker ps</code> confirm running; <code>curl localhost:&lt;port&gt;/api/health</code> from inside VM. Check ARR rule's destination URL.</td></tr>
              <tr><td>504 Gateway Timeout</td><td>ARR's default timeout (30s) shorter than container's response time</td><td>IIS Manager → server → ARR Cache → Proxy Settings → Time-out (seconds): raise to 120</td></tr>
              <tr><td>500.19 "Cannot read configuration file"</td><td>web.config has syntax error or references unregistered module/server-variable</td><td>Check Windows Event Viewer → Windows Logs → Application for the exact path. Whitelist server vars in IIS Manager → URL Rewrite → View Server Variables.</td></tr>
              <tr><td>Site loads but assets 404</td><td>MIME types for static files missing in fresh IIS install</td><td>Add MIME mapping in IIS Manager → site → MIME Types. Or add to web.config <code>&lt;staticContent&gt;</code> section.</td></tr>
              <tr><td>"Could not load file or assembly" (.NET app)</td><td>Missing .NET runtime version</td><td>Install the right .NET Runtime + Hosting Bundle on the VM. Recycle app pool.</td></tr>
              <tr><td>ARR ignores rule</td><td>Rule disabled, or "Stop processing of subsequent rules" not checked on an earlier matching rule</td><td>IIS Manager → site → URL Rewrite → verify rule order and enabled state</td></tr>
            </tbody>
          </table>

          <h3>Docker on Windows issues</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>Docker Desktop "engine stopped"</td><td>WSL2 didn't start, or Hyper-V conflict</td><td><code>wsl --status</code> + <code>wsl --shutdown</code> then restart Docker Desktop. If still failing: enable Hyper-V feature explicitly.</td></tr>
              <tr><td>Port already in use</td><td>Old container still has it, or IIS bound to it, or a leftover Windows service</td><td><code>Get-NetTCPConnection -LocalPort &lt;port&gt;</code>; identify process; stop or change port</td></tr>
              <tr><td>Container exits immediately</td><td>App crash on start, missing env var</td><td><code>docker compose logs &lt;svc&gt;</code> for the actual stack trace; verify .env file present</td></tr>
              <tr><td>Volume data is empty after restore</td><td>Tarball restored to wrong volume name</td><td>Volume names follow <code>&lt;compose-project&gt;_&lt;volume&gt;</code> by default. <code>docker volume ls</code>; <code>docker volume inspect</code>. Recreate with correct name + re-extract.</td></tr>
              <tr><td>Slow file I/O</td><td>Bind mount from Windows host into Linux container — known WSL2 perf issue for many small files</td><td>Use named volumes (faster); or keep node_modules out of the bind mount</td></tr>
            </tbody>
          </table>

          <h3>Certify / Let's Encrypt issues</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>HTTP-01 challenge times out</td><td>Port 80 not forwarded to new VM, or Windows Firewall blocking</td><td>Test: <code>curl -v http://workshop.enzolopez.net/.well-known/acme-challenge/test</code> from outside. Check router forward + firewall rule.</td></tr>
              <tr><td>"Rate limit exceeded"</td><td>Let's Encrypt rate limit (5 duplicate certs / week, 50 certs per registered domain / week)</td><td>Wait, or switch to staging endpoint for testing (Certify → Advanced → Use staging environment)</td></tr>
              <tr><td>Cert issued but not bound to IIS</td><td>Site name in Certify config doesn't match IIS site name</td><td>Certify managed site → Edit → "IIS Web Site" dropdown — pick the right site</td></tr>
              <tr><td>Browser shows wrong cert</td><td>Old IIS binding still references the previous cert</td><td>IIS Manager → site → Bindings → Edit HTTPS → Select the new cert from the dropdown</td></tr>
              <tr><td>Renewal silently fails</td><td>Certify scheduled task disabled</td><td>Task Scheduler → find Certify task → Enable. Check "Run whether user is logged on or not" with stored credentials.</td></tr>
            </tbody>
          </table>

          <h3>Network / router issues</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>External access fails but internal works</td><td>Router port forward didn't take, or pointing at wrong LAN IP</td><td>Test: <code>curl https://&lt;your-public-IP&gt;</code> from cellular. <code>tracert</code> if connection refused.</td></tr>
              <tr><td>Internal access fails but external works</td><td>NAT loopback / hairpin NAT disabled on router</td><td>Enable in router, or add LAN DNS overrides (Pi-hole) to resolve hostnames to LAN IP internally</td></tr>
              <tr><td>WAN IP changed and clients can't reach</td><td>DDNS didn't update fast enough</td><td>Check DDNS provider's last-update timestamp. Router-based DDNS usually updates within 60 sec of WAN-IP change.</td></tr>
              <tr><td>Some clients hit old PC, others hit new</td><td>DNS or router state inconsistency during cutover</td><td>Most consumer routers apply NAT changes immediately. If split: reboot router. Clear local DNS cache (<code>ipconfig /flushdns</code>).</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 10 — CHEAT SHEET */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">✦</span>Command cheat sheet</h2>
          <p>Things you'll run repeatedly.</p>

          <h4>Hyper-V</h4>
          <CodePre>{`Get-VM | Format-Table Name,State,CPUUsage,MemoryAssigned,Uptime
Start-VM -Name win11-services
Stop-VM -Name win11-services -Save                      # save state (fast)
Stop-VM -Name win11-services                            # graceful shutdown
Stop-VM -Name win11-services -TurnOff                   # hard off (last resort)
Checkpoint-VM -Name win11-services -SnapshotName "label"
Get-VMCheckpoint -VMName win11-services
Restore-VMCheckpoint -Name "label" -VMName win11-services -Confirm:$false
Remove-VMCheckpoint -VMName win11-services -Name "label"
vmconnect localhost win11-services                       # open console`}</CodePre>

          <h4>IIS / appcmd</h4>
          <CodePre>{`Import-Module WebAdministration
Get-Website
Get-IISAppPool
Get-WebBinding -Name "workshop"

# Start / stop / restart
Start-Website -Name "workshop"
Stop-Website -Name "workshop"
Restart-WebAppPool -Name "workshop-pool"
iisreset                                                  # restart all of IIS

# appcmd lives here:
$appcmd = "$env:WinDir\\System32\\inetsrv\\appcmd.exe"
& $appcmd list sites
& $appcmd list apppool
& $appcmd list config -section:system.webServer/rewrite/globalRules`}</CodePre>

          <h4>Docker</h4>
          <CodePre>{`docker ps
docker ps -a
docker compose -f Q:\\repo\\workshop\\docker-compose.yml up -d
docker compose -f Q:\\repo\\workshop\\docker-compose.yml logs -f
docker compose -f Q:\\repo\\workshop\\docker-compose.yml stop
docker compose -f Q:\\repo\\workshop\\docker-compose.yml down
docker volume ls
docker volume inspect workshop_workshop-data
docker system df                                          # disk usage
docker system prune -a                                    # delete unused images/containers
docker image ls
docker exec -it workshop sh                               # shell into container`}</CodePre>

          <h4>Certify (mostly UI, but)</h4>
          <CodePre>{`# Force renewal of all due certs (no UI needed):
Set-Location "C:\\Program Files\\Certify\\"
# Or check the scheduled task:
Get-ScheduledTask -TaskName "Certify*" | Get-ScheduledTaskInfo`}</CodePre>

          <h4>Firewall</h4>
          <CodePre>{`Get-NetFirewallRule -Enabled True -Direction Inbound | Format-Table DisplayName,LocalPort,Action
New-NetFirewallRule -DisplayName "HTTPS in" -Direction Inbound -Protocol TCP -LocalPort 443 -Action Allow
Remove-NetFirewallRule -DisplayName "Old rule name"`}</CodePre>

          <h4>Diagnostics</h4>
          <CodePre>{`ipconfig /all
nslookup workshop.enzolopez.net 1.1.1.1                  # resolve via public DNS
Test-NetConnection workshop.enzolopez.net -Port 443
Get-NetTCPConnection -LocalPort 443 -ErrorAction SilentlyContinue
Get-Process -Id (Get-NetTCPConnection -LocalPort 3006).OwningProcess`}</CodePre>
        </section>

        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--rust)', marginBottom: 8 }}>
            🖥️ Home → VM Migration
          </div>
          v1 · 2026-05-15. Companion guides in <code>Q:\repo\azure-infra\</code>:{' '}
          <code>AZURE_GUIDE.html</code> (cloud migration target), <code>MIGRATION_PLAN.md</code> (Azure work-in-progress).
        </div>
      </main>
    </div>
  );
}
