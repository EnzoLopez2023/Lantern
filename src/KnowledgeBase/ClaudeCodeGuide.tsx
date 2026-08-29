import { useEffect, useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../app/storage/scopedStorage';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: 'I',    title: 'The Mental Model',           icon: '🧠' },
  { id: 's2',  num: 'II',   title: 'CLAUDE.md',                  icon: '📄' },
  { id: 's3',  num: 'III',  title: 'settings.json',              icon: '⚙️' },
  { id: 's4',  num: 'IV',   title: 'Hooks',                      icon: '🪝' },
  { id: 's5',  num: 'V',    title: 'Skills & Slash Commands',    icon: '🛠️' },
  { id: 's6',  num: 'VI',   title: 'Subagents',                  icon: '🤖' },
  { id: 's7',  num: 'VII',  title: 'MCP Servers',                icon: '🔌' },
  { id: 's8',  num: 'VIII', title: 'Auto-Memory',                icon: '💾' },
  { id: 's9',  num: 'IX',   title: 'Plan Mode',                  icon: '📋' },
  { id: 's10', num: 'X',    title: 'Workflow Recipes',           icon: '🍳' },
  { id: 's11', num: 'XI',   title: 'Power-User Tricks',          icon: '✨' },
  { id: 's12', num: 'XII',  title: 'Troubleshooting',            icon: '🐛' },
  { id: 's13', num: 'XIII', title: 'Cheat Sheet',                icon: '📋' },
];

const CHECKLIST_STORAGE_KEY = 'claude-code-checks';

const SETUP_ACCOUNT_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'f1', label: <>Install Claude Code (<code>npm i -g @anthropic-ai/claude-code</code> or via the macOS/Windows installer)</> },
  { id: 'f2', label: <><code>claude</code> in a terminal; sign in with your Anthropic account</> },
  { id: 'f3', label: <>Decide on default model: Sonnet 4.6 (good speed/cost), Opus 4.8 (deepest reasoning). Toggle anytime with <code>/model</code>.</> },
];
const SETUP_USER_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'f10', label: <>Create <code>~/.claude/CLAUDE.md</code> with your global preferences (terse responses, no emojis unless asked, etc.)</> },
  { id: 'f11', label: <>Create <code>~/.claude/settings.json</code> with sensible defaults (theme, model, env)</> },
  { id: 'f12', label: <>Allowlist commonly-trusted Bash commands (git status/diff/log, ls, cat, npm test, etc.) to reduce permission prompts</> },
  { id: 'f13', label: <>Configure an MCP server you'll actually use (GitHub, filesystem, or one of your own) — skip if unsure</> },
];
const SETUP_PROJECT_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'f20', label: <><code>cd</code> into your project</> },
  { id: 'f21', label: <>Run <code>/init</code> — Claude reads your repo and proposes a <code>CLAUDE.md</code>. Edit before saving.</> },
  { id: 'f22', label: <>Add <code>.claude/settings.local.json</code> to <code>.gitignore</code></> },
  { id: 'f23', label: <>Commit <code>CLAUDE.md</code> and <code>.claude/settings.json</code> to share with collaborators (or future you)</> },
  { id: 'f24', label: <>Add a <code>.claude/commands/</code> dir if you'll write project-specific slash commands</> },
];
const SETUP_MEMORY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'f30', label: <>Confirm <code>~/.claude/projects/&lt;workspace&gt;/memory/MEMORY.md</code> exists or will be created on first save</> },
  { id: 'f31', label: <>Decide what you want remembered (preferences, project context, references) and ask Claude to "remember X"</> },
  { id: 'f32', label: <>Periodically review memory entries — they age, especially project state</> },
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

export default function ClaudeCodeGuide() {
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
            <span className="sidebar-title">Claude Code Power User</span>
          </div>
          <div className="sidebar-sub">Hooks · Skills · Subagents · MCP</div>
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
          <div className="hero-tag">🤖 Claude Code Guide · 2026</div>
          <h1>Mastering<br />Claude Code</h1>
          <p>
            Settings, hooks, skills, subagents, MCP servers, memory, plan mode, and the workflows
            that turn Claude Code from "helpful assistant" into a{' '}
            <strong style={{ color: '#C77AA0' }}>force-multiplier dev environment</strong>. Written
            for someone who already uses Claude Code daily and wants to go deeper.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">13</span><span className="hero-stat-label">Chapters</span></div>
            <div className="hero-stat"><span className="hero-stat-val">4</span><span className="hero-stat-label">Config Layers</span></div>
            <div className="hero-stat"><span className="hero-stat-val">7</span><span className="hero-stat-label">Hook Events</span></div>
            <div className="hero-stat"><span className="hero-stat-val">∞</span><span className="hero-stat-label">Skills & MCPs</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">I</span>The Mental Model</h2>

          <h3>What Claude Code actually is</h3>
          <p>Three things sit underneath the rectangle you type into:</p>

          <MermaidDiagram theme="default" chart={`graph LR
  You[You] -->|prompts| Harness["Harness (the CLI)<br/>permissions, tools, hooks,<br/>file watching, context mgmt"]
  Harness -->|orchestrates| Model["Claude model<br/>(Opus / Sonnet / Haiku)"]
  Harness -->|invokes| Tools["Tools<br/>Read, Edit, Bash,<br/>Grep, Glob, Agent, MCP, ..."]
  Model -->|tool calls| Tools
  Tools -->|results| Model
  style Harness fill:#3a2f1f,stroke:#cc7b5c,color:#fff`} />

          <ul>
            <li><strong>The harness</strong> = the binary, the keyboard UI, the permission system, the tool registry, the conversation manager, the file watcher, the hook executor. <em>This is not the model.</em> It's a piece of software with very specific rules.</li>
            <li><strong>The model</strong> = Claude, the LLM. Currently Sonnet 4.6 or Opus 4.8 in production setups. The model sees a sequence of messages + tool definitions; it emits text + tool calls.</li>
            <li><strong>Tools</strong> = capabilities the model can invoke. <code>Read</code>, <code>Edit</code>, <code>Bash</code>, <code>Grep</code>, <code>Glob</code>, <code>Agent</code>, plus any MCP servers you've configured. Tools are <em>not</em> part of the model; the harness exposes them and runs them when the model calls.</li>
          </ul>

          <h4>Why this mental model matters</h4>
          <p>Almost every "Claude Code didn't do X" complaint resolves to: <em>which layer is the problem in?</em></p>
          <ul>
            <li><strong>Model didn't understand</strong> → fix the prompt or context.</li>
            <li><strong>Tool failed</strong> → check permission, environment, or the tool's input.</li>
            <li><strong>Harness blocked it</strong> → check hooks, permission mode, allowlist.</li>
          </ul>
          <p>Power-user fluency means knowing which knob to twist.</p>

          <h3>Claude Code vs Claude API vs Claude Agent SDK</h3>
          <PathTabs
            tabs={[
              {
                id: 'cc',
                label: 'Claude Code',
                content: (
                  <>
                    <p><strong>What:</strong> An end-user CLI (and IDE extensions, web app). Has a UI, permission prompts, file system access, MCP support, hooks, skills.</p>
                    <p><strong>Use for:</strong> Doing dev work interactively. Refactoring, debugging, code review, scaffolding.</p>
                    <p><strong>Where:</strong> Your terminal, VS Code, JetBrains IDEs, claude.ai/code, the macOS/Windows desktop apps.</p>
                  </>
                ),
              },
              {
                id: 'api',
                label: 'Claude API',
                content: (
                  <>
                    <p><strong>What:</strong> HTTP API (and SDKs in Python, Node, etc.) for sending messages to Claude. No UI, no tools, no opinions.</p>
                    <p><strong>Use for:</strong> Building AI features into your own apps. The "Analyze with AI" button in workshop calls this. See the AI Features in Your Apps guide.</p>
                    <p><strong>Where:</strong> Your code (server-side typically).</p>
                  </>
                ),
              },
              {
                id: 'sdk',
                label: 'Claude Agent SDK',
                content: (
                  <>
                    <p><strong>What:</strong> A higher-level SDK for building <em>agents</em> — programs that loop with Claude over tools. Wraps the API with tool-use plumbing, conversation state, hooks.</p>
                    <p><strong>Use for:</strong> Building Claude Code-like agents for your own use cases — internal tools that read code, run scripts, propose changes, etc.</p>
                    <p><strong>Where:</strong> Your code, when you want agent behavior without rebuilding the loop yourself.</p>
                  </>
                ),
              },
            ]}
          />

          <p>This guide is about <strong>Claude Code</strong>. The companion AI-features guide covers the <strong>API</strong>. The Agent SDK is a deeper rabbit hole — worth its own future doc.</p>

          <h3>The configuration cascade — where does X come from?</h3>
          <p>Claude Code reads configuration from a stack of files. Higher-precedence wins. Knowing the order saves hours of "why did it do that?"</p>

          <table>
            <tbody>
              <tr><th>Layer</th><th>Path</th><th>Scope</th><th>Goes in git?</th></tr>
              <tr><td>1. <strong>Local override</strong></td><td><code>&lt;project&gt;/.claude/settings.local.json</code></td><td>This machine, this project</td><td>❌ <code>.gitignore</code> it</td></tr>
              <tr><td>2. Project</td><td><code>&lt;project&gt;/.claude/settings.json</code></td><td>Project, all developers</td><td>✅</td></tr>
              <tr><td>3. User</td><td><code>~/.claude/settings.json</code></td><td>You, every project</td><td>❌ (it's your dotfiles)</td></tr>
              <tr><td>4. Enterprise (managed)</td><td>OS-specific managed policy</td><td>Org-wide</td><td>(IT-controlled)</td></tr>
            </tbody>
          </table>

          <p>The same cascade applies to:</p>
          <ul>
            <li><code>CLAUDE.md</code> files (project, parent dirs, user, enterprise) — they all concatenate into context.</li>
            <li><code>.claude/agents/</code> subagent definitions — project agents override user agents with the same name.</li>
            <li><code>.claude/skills/</code> skills — same rule.</li>
            <li><code>.claude/commands/</code> slash commands — same rule.</li>
            <li>Hooks merge across levels (all hooks fire).</li>
            <li>Permissions cascade: a denied permission at one level blocks it; allowed permissions union.</li>
          </ul>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>The 'where did this come from' trick.</strong> When something behaves unexpectedly, list every file that could influence the session:
              <CodePre>{`ls -la ~/.claude/
ls -la <project>/.claude/
cat ~/.claude/settings.json | jq .
cat <project>/.claude/settings.json 2>/dev/null | jq .
cat <project>/.claude/settings.local.json 2>/dev/null | jq .`}</CodePre>
              Often the answer is in a forgotten <code>settings.local.json</code>.
            </div>
          </div>

          <h3>First-setup wizard <span className="badge green">interactive</span></h3>
          <p>Run through once on a fresh machine, or audit an existing setup. Checkboxes persist in this browser.</p>

          <h4>Account &amp; install</h4>
          <Checklist prefix="setup-account" items={SETUP_ACCOUNT_ITEMS} />

          <h4>User-level config (one-time)</h4>
          <Checklist prefix="setup-user" items={SETUP_USER_ITEMS} />

          <h4>Per-project setup</h4>
          <Checklist prefix="setup-project" items={SETUP_PROJECT_ITEMS} />

          <h4>Auto-memory (worth enabling once)</h4>
          <Checklist prefix="setup-memory" items={SETUP_MEMORY_ITEMS} />
        </section>

        <hr />

        {/* SECTION 2 — CLAUDE.MD */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">II</span>CLAUDE.md, the Project-Level Brain</h2>

          <h3>What is CLAUDE.md and how it's loaded</h3>
          <p><code>CLAUDE.md</code> is a markdown file that Claude Code automatically pulls into every conversation in that project. It's <em>the place</em> to durably teach Claude about your codebase.</p>

          <h4>The CLAUDE.md hierarchy</h4>
          <p>Claude Code looks for <code>CLAUDE.md</code> in:</p>
          <ol>
            <li>The current working directory.</li>
            <li>Every parent directory up to the user home (monorepo support).</li>
            <li><code>~/.claude/CLAUDE.md</code> (your global preferences).</li>
            <li>Enterprise managed policy (if your org has one).</li>
          </ol>
          <p>All matching files are concatenated into the system context. So a monorepo can have a root <code>CLAUDE.md</code> with shared conventions plus per-package files for specifics.</p>

          <h4>What belongs in CLAUDE.md</h4>
          <ul>
            <li><strong>House style</strong> beyond what linter rules enforce — "we prefer X over Y", "avoid Z pattern."</li>
            <li><strong>Architecture notes</strong> a fresh reader wouldn't pick up by skimming files — "this service is split across 3 repos because of historical reasons; do all DB work in repo X."</li>
            <li><strong>Key commands</strong> — how to run dev server, tests, lint, build. With copy-paste-ready invocations.</li>
            <li><strong>Danger zones</strong> — "never modify <code>db/migrations</code> directly", "don't run <code>scripts/seed.sql</code> on prod."</li>
            <li><strong>Conventions for tools</strong> — "when adding a new endpoint, also update <code>openapi.yaml</code>", "always co-locate tests in <code>__tests__/</code>."</li>
            <li><strong>Common gotchas</strong> — "this app uses better-sqlite3, which is sync, not async — don't suggest awaiting db calls."</li>
          </ul>

          <h4>What does NOT belong in CLAUDE.md</h4>
          <ul>
            <li><strong>Anything obvious from the code.</strong> "We use React" — Claude sees the package.json. "We have a server.js" — Claude sees the file. Don't waste context.</li>
            <li><strong>Information that will change.</strong> "Sprint 23 priorities" or "the bug we're debugging right now" — that's chat context, not CLAUDE.md.</li>
            <li><strong>Secrets or credentials.</strong> Obvious but worth saying.</li>
            <li><strong>Boilerplate restating Claude Code's own rules.</strong> "Be helpful, be terse" — the system prompt already says this.</li>
            <li><strong>Long historical narrative.</strong> Three paragraphs about the previous architecture you migrated away from — pick what's still load-bearing.</li>
          </ul>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>CLAUDE.md isn't free.</strong> Every byte of CLAUDE.md is in every system prompt for every turn in this project. A 5000-line CLAUDE.md silently eats your context window and adds latency. Aim for tight, high-signal content. If it's not useful in 90% of conversations, it doesn't belong here.</div>
          </div>

          <h3>A solid CLAUDE.md template (for your apps)</h3>
          <p>Here's a starting template you could drop into <code>Q:\repo\workshop\CLAUDE.md</code> and adapt:</p>

          <CodePre>{`# Workshop project notes for Claude

## What this app is
A personal woodworking workshop manager. Tracks projects, tools, materials, photos. Auth'd
via Entra ID (single-tenant). SQLite-backed.

## Stack
- Backend: Node 22, Express 5, \`better-sqlite3\` (sync — don't suggest awaiting db calls)
- Frontend: React 19, Vite 8, Tailwind, MSAL.js
- Container: single Docker image, runs on App Service Linux in production

## How to run
\`\`\`
npm install
npm run dev       # vite dev server on :5173, proxies API to :3006
npm run server    # standalone backend on :3006
\`\`\`

## Key paths
- \`server.js\` — backend entry; mounts auth middleware, routes, static dist
- \`src/auth/msalConfig.js\` — frontend MSAL config (uses env at build time)
- \`Q:\\repo\\azure-infra\\\` — companion infra repo (Bicep, deploy scripts, guides)

## Things to remember
- DB at \`/data/workshop.db\` in container, \`./workshop.db\` in dev. Always check \`DB_PATH\`.
- Auth: backend verifies Entra ID tokens via \`jose\`; rejects mismatched \`tid\` or \`aud\`.
- \`ALLOWED_OID\` env var gates the single allowed user. Multiple users requires schema rework.
- Uploads go to \`/data/uploads\` (or \`UPLOADS_PATH\`). Don't put them in SQLite blobs.

## House rules
- WAL mode is enabled at startup; never \`PRAGMA journal_mode=DELETE\`.
- All new routes get input validation via the pattern in \`routes/projects.js\`.
- Don't add new top-level deps without justification. Vite + Express ecosystem only.

## Don't
- Don't suggest moving to Prisma / Drizzle — better-sqlite3 is intentional.
- Don't add server-side sessions; the access token IS the session.
- Don't introduce a build step for the backend; it's plain ESM.`}</CodePre>
        </section>

        <hr />

        {/* SECTION 3 — SETTINGS */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">III</span>settings.json</h2>

          <h3>Anatomy of a settings.json file</h3>
          <p>This is the harness's configuration file. It sets defaults, permissions, hooks, MCP servers, environment variables. JSON format. Same schema at every level (user/project/local).</p>

          <CodePre>{`{
  "$schema": "https://anthropic.com/claude/settings-schema.json",
  "theme": "dark",
  "model": "claude-sonnet-4-6",
  "env": {
    "ANTHROPIC_API_KEY": "...",
    "EDITOR": "code --wait"
  },
  "permissions": {
    "allow": [
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(npm test:*)",
      "Bash(npm run lint:*)",
      "WebFetch(domain:learn.microsoft.com)",
      "WebFetch(domain:nodejs.org)"
    ],
    "deny": [
      "Bash(rm -rf /:*)",
      "Bash(curl * | sh:*)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "prettier --write \\"$CLAUDE_TOOL_INPUT_file_path\\"" }
        ]
      }
    ]
  },
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/code"]
    }
  }
}`}</CodePre>

          <h4>The fields you'll actually use</h4>
          <table>
            <tbody>
              <tr><th>Field</th><th>What it does</th><th>Where to set</th></tr>
              <tr><td><code>theme</code></td><td>UI theme: <code>dark</code>, <code>light</code>, <code>dark-daltonized</code></td><td>User</td></tr>
              <tr><td><code>model</code></td><td>Default model for this scope</td><td>Either user or project</td></tr>
              <tr><td><code>env</code></td><td>Environment variables exposed to tools (Bash, hooks, MCP). Subject to permission prompts on first use.</td><td>Project or local</td></tr>
              <tr><td><code>permissions.allow</code></td><td>Tool calls auto-approved without prompting. Globbed patterns.</td><td>Mostly user; some project</td></tr>
              <tr><td><code>permissions.deny</code></td><td>Tool calls always blocked, even if otherwise allowed</td><td>Project (org policy) or user</td></tr>
              <tr><td><code>permissions.defaultMode</code></td><td><code>default</code>, <code>acceptEdits</code>, <code>plan</code>, etc. Affects prompts.</td><td>User or project</td></tr>
              <tr><td><code>hooks</code></td><td>Shell commands to run on harness events</td><td>Project (project-specific) or user (universal)</td></tr>
              <tr><td><code>mcpServers</code></td><td>External tools via Model Context Protocol</td><td>Project or user</td></tr>
              <tr><td><code>statusLine</code></td><td>Custom statusline command</td><td>User</td></tr>
            </tbody>
          </table>

          <h3>Permissions and allowlists</h3>
          <p>By default Claude Code prompts for every tool call (Bash, Edit, Write). For routine commands you trust, allowlist them to remove friction.</p>

          <h4>Allowlist syntax</h4>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>Matches</th></tr>
              <tr><td><code>Bash(git status:*)</code></td><td>Any <code>git status</code> invocation with any args</td></tr>
              <tr><td><code>Bash(git diff:*)</code></td><td>Any <code>git diff</code></td></tr>
              <tr><td><code>Bash(git:*)</code></td><td>Any git command — broader, riskier (allows <code>git push</code>)</td></tr>
              <tr><td><code>Bash(npm test:*)</code></td><td>Any <code>npm test</code></td></tr>
              <tr><td><code>Bash(npm run lint:*)</code></td><td>Specifically <code>npm run lint</code></td></tr>
              <tr><td><code>Edit</code></td><td>All Edit calls (rarely a good idea)</td></tr>
              <tr><td><code>WebFetch(domain:nodejs.org)</code></td><td>WebFetch to anything on nodejs.org</td></tr>
              <tr><td><code>mcp__github__*</code></td><td>All MCP tools from the "github" server</td></tr>
            </tbody>
          </table>

          <h4>The fewer-permission-prompts skill (yours)</h4>
          <p>The built-in <code>fewer-permission-prompts</code> skill scans your recent transcripts, finds Bash commands you approved repeatedly, and proposes an allowlist for <code>.claude/settings.json</code>. Run it once a week to keep your permissions tidy.</p>

          <CodePre>{`/fewer-permission-prompts`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>The deny list is more powerful than you think.</strong> Even if everything is in <code>allow</code>, anything matching <code>deny</code> blocks. Use deny for safety nets you never want overridden:
              <CodePre>{`"deny": [
  "Bash(rm -rf /:*)",
  "Bash(rm -rf ~:*)",
  "Bash(:(){ :|:& };::*)",
  "Bash(curl * | sh:*)",
  "Bash(curl * | bash:*)",
  "Bash(git push --force:*)",
  "Bash(git push -f:*)"
]`}</CodePre>
            </div>
          </div>

          <h4>Permission modes</h4>
          <ul>
            <li><strong>default</strong> — prompts as normal.</li>
            <li><strong>acceptEdits</strong> — auto-approves Edit/Write/NotebookEdit. Bash still prompts. Useful when iterating fast on code.</li>
            <li><strong>plan</strong> — Claude can read and think but cannot write or edit. Use for design-first workflows.</li>
            <li><strong>bypassPermissions</strong> — auto-approves everything. <strong>Use only in disposable sandboxes.</strong></li>
          </ul>
          <p>Toggle with the <code>/permissions</code> command or set <code>defaultMode</code> in settings.</p>

          <h3>env block — environment variables for tools</h3>
          <p>Anything in <code>settings.json → env</code> becomes available to every Bash command, every hook, every MCP server Claude Code starts.</p>

          <CodePre>{`{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-...",
    "GITHUB_TOKEN": "ghp_...",
    "EDITOR": "code --wait",
    "PAGER": "cat"
  }
}`}</CodePre>

          <ul>
            <li><strong>API keys for MCP servers</strong> — many MCP servers (GitHub, Slack, Postgres) authenticate via env vars. Putting them in <code>settings.json</code> avoids littering your shell rc with secrets.</li>
            <li><strong>Tool defaults</strong> — <code>EDITOR=code --wait</code> means <code>git rebase</code> opens VS Code for the interactive edit; <code>PAGER=cat</code> stops <code>git log</code> from blocking on <code>less</code>.</li>
            <li><strong>Different keys per project</strong> — project-level <code>settings.json</code> can scope keys to one repo. Useful for client work.</li>
          </ul>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>settings.local.json is your friend.</strong> Don't put secrets in <code>.claude/settings.json</code> (it gets committed). Put them in <code>.claude/settings.local.json</code> (gitignored). Same schema, same precedence, only lives on your machine.</div>
          </div>
        </section>

        <hr />

        {/* SECTION 4 — HOOKS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">IV</span>Hooks</h2>

          <h3>What hooks are and when they fire</h3>
          <p>Hooks are shell commands the harness runs at specific events. Use them to automate things that happen <em>around</em> a Claude turn — without needing to ask Claude.</p>

          <h4>Event types</h4>
          <table>
            <tbody>
              <tr><th>Event</th><th>Fires</th><th>Can it block?</th><th>Common use</th></tr>
              <tr><td><code>UserPromptSubmit</code></td><td>Right after you press Enter, before the model sees the prompt</td><td>Yes (exit non-zero → block)</td><td>Inject context, gate on conditions, log prompts</td></tr>
              <tr><td><code>PreToolUse</code></td><td>Before a tool runs, after the model called it</td><td>Yes</td><td>Reject specific tool calls (e.g., block writes to <code>/etc</code>)</td></tr>
              <tr><td><code>PostToolUse</code></td><td>After a tool succeeds</td><td>No</td><td>Format/lint changed files, run tests, log</td></tr>
              <tr><td><code>Stop</code></td><td>End of turn (Claude finishes responding)</td><td>No</td><td>Desktop notification, run validation suite</td></tr>
              <tr><td><code>SubagentStop</code></td><td>End of a subagent's run</td><td>No</td><td>Same as Stop, scoped to delegated work</td></tr>
              <tr><td><code>Notification</code></td><td>When Claude Code emits a system notification</td><td>No</td><td>Bridge to Slack / external alerter</td></tr>
              <tr><td><code>SessionStart</code></td><td>New session</td><td>No</td><td>Pull latest git, show statusboard</td></tr>
            </tbody>
          </table>

          <h4>The matcher pattern</h4>
          <p>Hooks can match specific tools via regex. <code>"matcher": "Edit|Write"</code> only fires for Edit and Write tool calls, not Bash.</p>

          <CodePre>{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|NotebookEdit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \\"$CLAUDE_TOOL_INPUT_file_path\\" 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}`}</CodePre>

          <h4>Environment variables Claude Code injects</h4>
          <p>Hook commands run with these in their environment:</p>
          <ul>
            <li><code>$CLAUDE_TOOL_NAME</code> — the tool that just ran (e.g., <code>Edit</code>).</li>
            <li><code>$CLAUDE_TOOL_INPUT_&lt;param&gt;</code> — each tool input, e.g., <code>$CLAUDE_TOOL_INPUT_file_path</code> for Edit.</li>
            <li><code>$CLAUDE_TOOL_RESULT</code> — the tool's result string (PostToolUse).</li>
            <li><code>$CLAUDE_CWD</code> — current working dir of the harness.</li>
            <li><code>$CLAUDE_USER_PROMPT</code> — the prompt (UserPromptSubmit only).</li>
          </ul>

          <h3>Hook recipes worth stealing</h3>

          <h4>1. Auto-format on every edit</h4>
          <CodePre>{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "f=\\"$CLAUDE_TOOL_INPUT_file_path\\"; case \\"$f\\" in *.js|*.ts|*.tsx|*.jsx|*.json|*.md) prettier --write \\"$f\\" ;; *.py) ruff format \\"$f\\" ;; esac"
          }
        ]
      }
    ]
  }
}`}</CodePre>

          <h4>2. Block writes to dangerous paths</h4>
          <CodePre>{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "case \\"$CLAUDE_TOOL_INPUT_file_path\\" in /etc/*|/usr/*|*.production.env) echo 'Blocked: protected path'; exit 1 ;; esac"
          }
        ]
      }
    ]
  }
}`}</CodePre>
          <p>Hook returns non-zero → tool call is rejected before it runs. Claude sees the error and adjusts.</p>

          <h4>3. Desktop notification on turn end (macOS)</h4>
          <CodePre>{`{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "osascript -e 'display notification \\"Claude finished\\" with title \\"Claude Code\\"'" }
        ]
      }
    ]
  }
}`}</CodePre>
          <p>Lets you context-switch to other work while a long task runs.</p>

          <h4>4. Auto-test on edits in a known dir</h4>
          <CodePre>{`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "case \\"$CLAUDE_TOOL_INPUT_file_path\\" in src/*) cd \\"$CLAUDE_CWD\\" && npm test -- --findRelatedTests \\"$CLAUDE_TOOL_INPUT_file_path\\" ;; esac"
          }
        ]
      }
    ]
  }
}`}</CodePre>

          <h4>5. Inject git state into every prompt</h4>
          <CodePre>{`{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          { "type": "command", "command": "echo \\"<git-state>$(git -C \\"$CLAUDE_CWD\\" status --porcelain --branch)</git-state>\\"" }
        ]
      }
    ]
  }
}`}</CodePre>
          <p>Output on stdout from a <code>UserPromptSubmit</code> hook gets prepended to the user's prompt as context. Useful for surfacing dirty state without asking Claude to check.</p>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Hook output discipline.</strong> Hooks print to stderr → ignored. Print to stdout → injected into context (UserPromptSubmit) or shown to Claude (PostToolUse). Keep output tight or you'll pollute every turn with noise.</div>
          </div>
        </section>

        <hr />

        {/* SECTION 5 — SKILLS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">V</span>Skills &amp; Slash Commands</h2>

          <h3>Skills: reusable instructions Claude can invoke</h3>
          <p>A skill is a folder containing a <code>SKILL.md</code> with frontmatter + instructions. Claude can invoke skills by name (via the <code>Skill</code> tool) or auto-trigger them when a user's prompt matches.</p>

          <h4>Skill file layout</h4>
          <CodePre>{`.claude/skills/
├── review-pr/
│   └── SKILL.md
├── deploy/
│   ├── SKILL.md
│   └── helpers.sh
└── lint-fix/
    └── SKILL.md`}</CodePre>

          <h4>SKILL.md structure</h4>
          <CodePre>{`---
name: review-pr
description: Review a pull request — looks at diff, flags risks, suggests improvements. Invoke when the user asks for a code review or wants feedback on a branch's changes.
tools: [Bash, Read, Grep, Glob, Edit]
---

You are reviewing a pull request. Follow this protocol:

1. Identify the base branch (usually main) and current branch.
2. Run \`git diff main...HEAD\` to see all changes in this branch.
3. For each changed file, read the surrounding code (5-10 lines context).
4. Flag:
   - Security risks (injection, secrets, auth bypass)
   - Breaking changes to public interfaces
   - Missing tests for new behavior
   - Performance footguns (N+1 queries, sync I/O in async paths)
   - Style violations not caught by linters
5. Don't nitpick formatting (a formatter handles that).
6. End with a "ship / hold" verdict.`}</CodePre>

          <h4>How skills get discovered &amp; invoked</h4>
          <ol>
            <li>Claude Code scans <code>.claude/skills/</code> on session start and shows skills in the <code>Skill</code> tool's available list (with name + description).</li>
            <li>When the user types <code>/review-pr</code>, Claude invokes that skill via the <code>Skill</code> tool.</li>
            <li>When the user's prompt matches a skill's description, Claude auto-invokes the skill (no slash needed).</li>
            <li>The skill's <code>SKILL.md</code> body becomes Claude's instructions for that subtask.</li>
          </ol>

          <h4>Writing good skill descriptions</h4>
          <p>The <code>description</code> is what Claude pattern-matches against user prompts. Be specific about <em>when</em> to invoke:</p>
          <ul>
            <li>❌ "Helps with code review." (vague)</li>
            <li>✅ "Review a pull request — looks at diff, flags risks. Invoke when the user asks for a code review or wants feedback on a branch's changes."</li>
          </ul>

          <h3>Slash commands (skills' lightweight cousin)</h3>
          <p>If you don't want a full skill, just a parameterized prompt: drop a markdown file in <code>.claude/commands/</code>:</p>

          <CodePre>{`---
description: Add a new Express route with auth + validation + tests
---

Add a new Express route under \`routes/\` following our conventions:

- Use the auth middleware from \`middleware/auth.js\`
- Validate inputs with the pattern in \`routes/projects.js\`
- Include a test in \`__tests__/\`
- Update \`openapi.yaml\` if the route changes the API surface

Route to add: $ARGUMENTS`}</CodePre>

          <p>Now typing <code>/new-route POST /projects/:id/comments</code> expands <code>$ARGUMENTS</code> and runs the prompt.</p>

          <h4>When to use which</h4>
          <table>
            <tbody>
              <tr><th>Use a <strong>skill</strong> when</th><th>Use a <strong>slash command</strong> when</th></tr>
              <tr><td>The task has a structured protocol</td><td>It's a parameterized prompt</td></tr>
              <tr><td>You want auto-invocation based on description</td><td>You'll always type the command</td></tr>
              <tr><td>Multiple files / scripts involved</td><td>Single prompt template</td></tr>
              <tr><td>Wants its own tool allowlist</td><td>Inherits session tools</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 6 — SUBAGENTS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">VI</span>Subagents</h2>

          <h3>What subagents are and when to use them</h3>
          <p>A subagent is Claude Code spawning another Claude with its own conversation, its own context window, its own tool grants. Subagents let you:</p>
          <ul>
            <li><strong>Parallelize</strong> — kick off three searches at once, each in its own context.</li>
            <li><strong>Protect context</strong> — long-running searches don't pollute the main conversation.</li>
            <li><strong>Specialize</strong> — different agents have different prompts, different tools, different models.</li>
            <li><strong>Get independent opinions</strong> — a fresh agent can review your work without your conversation's bias.</li>
          </ul>

          <h4>Built-in agents</h4>
          <table>
            <tbody>
              <tr><th>Agent</th><th>Best for</th></tr>
              <tr><td><code>claude</code></td><td>Default catch-all for sub-tasks</td></tr>
              <tr><td><code>Explore</code></td><td>Fast read-only search across a codebase. Glob+Grep+Read. Use for "where is X defined?" and similar.</td></tr>
              <tr><td><code>general-purpose</code></td><td>Multi-step research and code tasks. Has all tools.</td></tr>
              <tr><td><code>Plan</code></td><td>Architect/designer. Produces an implementation plan without executing.</td></tr>
              <tr><td><code>statusline-setup</code></td><td>Configures your statusline.</td></tr>
            </tbody>
          </table>

          <h4>Defining a custom subagent</h4>
          <p>Drop a markdown file in <code>.claude/agents/</code>:</p>
          <CodePre>{`---
name: db-migration-reviewer
description: Reviews proposed database schema migrations for safety. Checks for lock contention, breaking changes to existing readers, and irreversible operations. Use whenever a migration file is added or edited.
tools: [Read, Grep, Glob, Bash]
model: opus
---

You are reviewing a database migration. Be paranoid.

For each change in the migration file:
1. Identify the operation type (CREATE, ALTER, DROP, INSERT).
2. Flag operations that take exclusive locks on large tables.
3. Flag operations that break compatibility with the previous schema (current readers must continue working until they're redeployed).
4. Flag irreversible operations (DROP COLUMN, DROP TABLE) without an explicit rollback plan.
5. Check that any data backfill uses batched updates (not a single UPDATE statement on the whole table).
6. Suggest a safer alternative if any of the above apply.

End with: SAFE / NEEDS CHANGES / UNSAFE.`}</CodePre>

          <p>Invoke it via the <code>Agent</code> tool with <code>subagent_type: "db-migration-reviewer"</code> — Claude does this when the situation matches the description.</p>

          <h3>Spawning subagents in parallel</h3>
          <p>The big win: send multiple <code>Agent</code> tool calls in the same message. They run concurrently. You wait once for the slowest.</p>

          <MermaidDiagram theme="default" chart={`graph TD
  Main[Main Claude turn]
  Main --> A1["Agent: Explore<br/>'find auth middleware'"]
  Main --> A2["Agent: Explore<br/>'find all DB queries'"]
  Main --> A3["Agent: general-purpose<br/>'check test coverage of auth'"]
  A1 --> Result1[result 1]
  A2 --> Result2[result 2]
  A3 --> Result3[result 3]
  Result1 --> Synth[Main Claude synthesizes]
  Result2 --> Synth
  Result3 --> Synth
  style Main fill:#3a2f1f,stroke:#cc7b5c,color:#fff
  style Synth fill:#1f3a2f,stroke:#6fdc8c,color:#fff`} />

          <h4>The rules for parallel subagents</h4>
          <ul>
            <li>They must be <strong>independent</strong>. If agent B needs agent A's output, they must run sequentially.</li>
            <li>Each agent should have a <strong>self-contained prompt</strong>. Subagents don't see your conversation — they only see what you wrote in the <code>prompt</code> field.</li>
            <li>Tell each agent <strong>what to return</strong>, in what format. "Report under 200 words" or "List file paths, one per line."</li>
            <li>Don't delegate <strong>understanding</strong>. Don't say "based on your findings, fix the bug." Synthesize the findings yourself in the main turn.</li>
          </ul>

          <h4>Background subagents</h4>
          <p>For agents that'll take a while, mark them <code>run_in_background: true</code>. Continue with other work; you're notified when they finish.</p>
        </section>

        <hr />

        {/* SECTION 7 — MCP */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">VII</span>MCP Servers</h2>

          <h3>What MCP is, why it exists</h3>
          <p>Model Context Protocol is an open spec for "tools you can plug into any Claude conversation." An MCP server exposes:</p>
          <ul>
            <li><strong>Tools</strong> — like a function call. Claude can invoke them.</li>
            <li><strong>Resources</strong> — like read-only data. Documents, schemas, snapshots.</li>
            <li><strong>Prompts</strong> — pre-baked prompt templates.</li>
          </ul>

          <MermaidDiagram theme="default" chart={`graph LR
  CC[Claude Code harness] --STDIO/HTTP--> MCP1[GitHub MCP server]
  CC --STDIO/HTTP--> MCP2[Filesystem MCP server]
  CC --STDIO/HTTP--> MCP3[Postgres MCP server]
  CC --STDIO/HTTP--> MCP4[Your custom MCP server]
  MCP1 --REST--> GitHub
  MCP2 --fs--> Disk
  MCP3 --SQL--> DB
  style CC fill:#3a2f1f,stroke:#cc7b5c,color:#fff`} />

          <h4>Why this matters</h4>
          <p>An MCP server you write once works in Claude Code, claude.ai, claude.ai/code, and any other MCP-aware client. You're not building a Claude Code plugin — you're building a tool.</p>

          <h3>Configuring MCP servers</h3>
          <h4>STDIO (child process)</h4>
          <CodePre>{`{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/code"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
    }
  }
}`}</CodePre>

          <h4>HTTP (remote)</h4>
          <CodePre>{`{
  "mcpServers": {
    "my-api": {
      "url": "https://mcp.mycompany.com/sse",
      "headers": { "Authorization": "Bearer \${MY_API_TOKEN}" }
    }
  }
}`}</CodePre>

          <h4>The big public servers worth knowing</h4>
          <table>
            <tbody>
              <tr><th>Server</th><th>What it gives Claude</th></tr>
              <tr><td><code>@modelcontextprotocol/server-filesystem</code></td><td>Read/write/list files outside the project. Scope to specific paths.</td></tr>
              <tr><td><code>@modelcontextprotocol/server-github</code></td><td>GitHub API — issues, PRs, code search</td></tr>
              <tr><td><code>@modelcontextprotocol/server-postgres</code></td><td>Read-only Postgres queries</td></tr>
              <tr><td><code>@modelcontextprotocol/server-slack</code></td><td>Read channels, post messages</td></tr>
              <tr><td><code>@modelcontextprotocol/server-fetch</code></td><td>HTTP fetch with content extraction</td></tr>
              <tr><td><code>@modelcontextprotocol/server-puppeteer</code></td><td>Headless browser automation</td></tr>
              <tr><td><code>@modelcontextprotocol/server-memory</code></td><td>Knowledge-graph memory across sessions</td></tr>
            </tbody>
          </table>

          <h4>Per-server permissions</h4>
          <p>Each MCP tool shows up as <code>mcp__&lt;server&gt;__&lt;tool&gt;</code>. Allowlist accordingly:</p>
          <CodePre>{`"permissions": {
  "allow": [
    "mcp__github__list_issues",
    "mcp__github__get_pull_request",
    "mcp__filesystem__read_file"
  ]
}`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Trust matters.</strong> Adding an MCP server gives it access to your conversation context (whatever Claude passes as tool input). Be deliberate. Audit MCP code before running it, especially community servers.</div>
          </div>

          <h3>Writing your own MCP server</h3>
          <p>Tiny TypeScript example using the official SDK:</p>

          <CodePre>{`// my-mcp/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({ name: "workshop-stats", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "project_count",
    description: "Count projects in the workshop database",
    inputSchema: { type: "object", properties: {}, required: [] }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  if (req.params.name === "project_count") {
    const Database = (await import("better-sqlite3")).default;
    const db = new Database("/data/workshop.db", { readonly: true });
    const { c } = db.prepare("SELECT COUNT(*) as c FROM projects").get() as { c: number };
    return { content: [{ type: "text", text: \`\${c} projects\` }] };
  }
  throw new Error("unknown tool");
});

await server.connect(new StdioServerTransport());`}</CodePre>

          <p>Register in <code>settings.json</code>:</p>
          <CodePre>{`"mcpServers": {
  "workshop-stats": {
    "command": "node",
    "args": ["/path/to/my-mcp/dist/index.js"]
  }
}`}</CodePre>

          <p>Now ask Claude "how many projects do I have?" and it can call <code>mcp__workshop-stats__project_count</code>.</p>
        </section>

        <hr />

        {/* SECTION 8 — MEMORY */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">VIII</span>The Auto-Memory System</h2>

          <h3>What it is, and what's already in yours</h3>
          <p>Auto-memory is a file-based persistence layer for context that should survive across sessions. Unlike CLAUDE.md (project-scoped instructions), memory is for things you've told Claude that should still be true tomorrow.</p>

          <h4>Where memory lives</h4>
          <CodePre>{`C:\\Users\\enlo\\.claude\\projects\\C--Users-enlo\\memory\\
├── MEMORY.md              # the index (one-line pointers per entry)
├── project_azure_migration.md
├── project_two_tenant_setup.md
└── reference_q_drive_share.md`}</CodePre>

          <p>Each entry is a markdown file with frontmatter (<code>name</code>, <code>description</code>, <code>type</code>) and a body. <code>MEMORY.md</code> is always loaded into context; individual entries are read when Claude judges them relevant.</p>

          <h4>The four memory types</h4>
          <table>
            <tbody>
              <tr><th>Type</th><th>Stores</th><th>Example</th></tr>
              <tr><td><strong>user</strong></td><td>Who you are, your role, preferences</td><td>"User is a Microsoft engineer with focus on personal apps; prefers terse responses."</td></tr>
              <tr><td><strong>feedback</strong></td><td>Corrections + confirmations on how to work</td><td>"Don't suggest moving SQLite to ORMs unless asked — user prefers raw drivers."</td></tr>
              <tr><td><strong>project</strong></td><td>Ongoing work context</td><td>"Currently migrating workshop/glp1/shopkeep from home PC to Azure App Service."</td></tr>
              <tr><td><strong>reference</strong></td><td>Pointers to external systems</td><td>"Real .env files live on home PC, not on Q:\ share."</td></tr>
            </tbody>
          </table>

          <h4>How to use it</h4>
          <ul>
            <li><strong>Save:</strong> ask Claude to "remember that X" — Claude writes a new entry.</li>
            <li><strong>Forget:</strong> ask Claude to "forget that X" — entry gets deleted or rewritten.</li>
            <li><strong>Audit:</strong> open the memory dir manually — entries are plain markdown.</li>
            <li><strong>Refresh:</strong> when context changes, re-tell Claude the new state. The entry updates.</li>
          </ul>

          <h4>What NOT to put in memory</h4>
          <ul>
            <li>Things derivable from code (architecture, file paths, conventions) — let Claude read the repo.</li>
            <li>Things in git history (who changed what, when) — git already tells you.</li>
            <li>Solutions to a specific bug — the fix is in the diff; the why is in the commit message.</li>
            <li>Anything already in CLAUDE.md.</li>
            <li>Ephemeral state (mid-task notes, current chat context).</li>
          </ul>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Memory ages.</strong> Project memories especially go stale: people move, priorities shift, the architecture changes. When Claude reads a memory that contradicts the current code, trust the code and update the memory. Don't act on a stale memory just because it's there.</div>
          </div>
        </section>

        <hr />

        {/* SECTION 9 — PLAN MODE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">IX</span>Plan Mode</h2>

          <h3>When to use plan mode</h3>
          <p>In plan mode, Claude can read, search, and think — but cannot edit, write, or run mutating commands. The turn ends with an <code>ExitPlanMode</code> proposing a plan for your approval.</p>

          <h4>Why plan mode matters</h4>
          <ul>
            <li><strong>Forces design-before-implementation.</strong> Often the plan reveals you wanted something different than what Claude was about to do.</li>
            <li><strong>Cheap to revise.</strong> A plan is text; changing it costs nothing. A half-implemented change is expensive to undo.</li>
            <li><strong>Better for big tasks.</strong> Multi-file refactors, new features, anything where the "shape" matters.</li>
            <li><strong>Pairs with subagents.</strong> The <code>Plan</code> subagent does this in isolation; the main turn can review the plan and decide.</li>
          </ul>

          <h4>Entering plan mode</h4>
          <ul>
            <li>Press <kbd>Shift+Tab</kbd> to cycle through permission modes (default → acceptEdits → plan).</li>
            <li>Or use the <code>/permissions</code> command.</li>
            <li>Or set <code>defaultMode: "plan"</code> in settings.json for projects where you want plan-first as the norm.</li>
          </ul>

          <h4>The plan-then-execute workflow</h4>
          <ol>
            <li>Plan mode on. Describe the task: "Add per-user rate limiting to all API routes."</li>
            <li>Claude explores the code, proposes a plan with specific files and changes.</li>
            <li>Review. Push back on anything that's off. "Use the express-rate-limit middleware instead of writing our own."</li>
            <li>Iterate the plan until you're happy.</li>
            <li><code>ExitPlanMode</code> — Claude switches to execute mode and implements.</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 10 — RECIPES */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">X</span>Workflow Recipes</h2>

          <h3>Recipe: code review</h3>
          <h4>Setup</h4>
          <p>Create <code>.claude/skills/review/SKILL.md</code> with:</p>
          <CodePre>{`---
name: review
description: Code review for the current branch's changes — flag security, breaking changes, missing tests, performance. Invoke when the user asks for a review or wants feedback on changes.
tools: [Bash, Read, Grep, Glob]
---

Review the current branch's changes against main:
1. \`git fetch origin main && git diff origin/main...HEAD --stat\` to see scope.
2. \`git diff origin/main...HEAD\` for the full diff.
3. For each changed file:
   - Read surrounding context (\`Read\` 30 lines around change).
   - Check for missing tests (\`Grep\` for related test files).
4. Flag categorically:
   - 🔒 Security risks
   - 💥 Breaking API changes
   - 🧪 Missing test coverage for new behavior
   - 🐢 Performance issues
5. End with a verdict: ship / hold / discuss.`}</CodePre>

          <h4>Run</h4>
          <p>On any branch: <code>/review</code> → Claude does it all.</p>

          <h3>Recipe: long-running migration</h3>
          <p>You're migrating workshop from SQLite to Postgres. This is many small commits over hours/days.</p>

          <h4>Setup</h4>
          <ol>
            <li>Project-level CLAUDE.md note: "Currently migrating to Postgres. Don't add new SQLite-specific syntax."</li>
            <li>Create a feedback memory: "When working on Postgres migration: use <code>pg</code> driver, parameter syntax <code>$1, $2</code>, prefer JSONB for blob-y fields."</li>
            <li><code>/loop 30m /check-migration-progress</code> for periodic status checks during long sessions.</li>
          </ol>

          <h4>Pattern</h4>
          <ul>
            <li>Use plan mode for each major migration step (schema, queries, transactions).</li>
            <li>Use the <code>Explore</code> subagent to scan for remaining SQLite usages: <code>"Find any remaining better-sqlite3 imports or sqlite-specific syntax. List file:line."</code></li>
            <li>Use a <code>review</code> subagent run on each PR before merging.</li>
          </ul>

          <h3>Recipe: debugging a specific failure</h3>
          <h4>Pattern</h4>
          <ol>
            <li>Give Claude the <em>exact</em> failure (stack trace, error message, reproduction). Paste, don't paraphrase.</li>
            <li>Say what you've already tried. Save Claude from suggesting it again.</li>
            <li>If you have a hypothesis, share it but invite challenge: "I think it's a race condition between X and Y. Convince me I'm wrong before we fix it."</li>
            <li>Use plan mode first when the bug is subtle — forces Claude to articulate the model before changing code.</li>
            <li>After a fix lands, ask Claude to <em>write the regression test</em> in the same session.</li>
          </ol>

          <h4>What NOT to do</h4>
          <ul>
            <li>Don't paste the whole codebase. Claude can read it; just point.</li>
            <li>Don't accept the first fix. "What else could cause this?" surfaces deeper causes.</li>
            <li>Don't skip the regression test. The bug will come back without one.</li>
          </ul>

          <h3>Recipe: greenfield feature</h3>
          <ol>
            <li>Plan mode: describe the feature, your constraints, and the user it serves.</li>
            <li>Claude proposes a plan. Iterate until it matches your mental model.</li>
            <li>Exit plan mode. Let Claude execute step 1 (often: data model + types).</li>
            <li>Run tests after each step. Don't batch.</li>
            <li>When Claude finishes a major piece, ask the <code>review</code> skill to evaluate it before moving on.</li>
            <li>End with: "Update CLAUDE.md if this feature introduces conventions worth documenting."</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 11 — TRICKS */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">XI</span>Power-User Tricks</h2>

          <h3>Things that aren't obvious until someone shows you</h3>

          <h4>1. <code>!command</code> runs a shell command inline</h4>
          <p>Type <code>! ls</code> at the prompt — it runs in your shell, output lands in the conversation as if you'd pasted it. Useful for <code>! az login</code> (interactive auth that Claude can't run for you).</p>

          <h4>2. Drag a file into the prompt</h4>
          <p>In the macOS/Windows app and web client, dragging a file (or screenshot) attaches it. Claude reads images, PDFs, text. Saves typing paths.</p>

          <h4>3. <kbd>Ctrl+R</kbd> to search session transcript</h4>
          <p>Find that error message you discussed 50 turns ago without re-explaining.</p>

          <h4>4. <code>/compact</code> to shrink the conversation manually</h4>
          <p>Claude automatically compacts long conversations near the context limit. You can force it earlier to keep more headroom for upcoming work.</p>

          <h4>5. <code>/cost</code> shows token usage</h4>
          <p>Useful when you suspect a tool is dumping huge output into context (e.g., a big <code>grep</code>). Confirms before optimizing.</p>

          <h4>6. Set <code>defaultMode: "plan"</code> per project for design-heavy work</h4>
          <p>For projects where you always want a plan before changes (production code, shared libraries, infra), set the default mode. Use <kbd>Shift+Tab</kbd> to leave plan mode when ready.</p>

          <h4>7. Use <code>ScheduleWakeup</code> via <code>/loop</code> for self-paced polling</h4>
          <p>When you have Claude babysitting a CI run or long migration: <code>/loop 5m /check-status</code>. Claude wakes up on its own at the interval.</p>

          <h4>8. Subagents can run in the background</h4>
          <p>Pass <code>run_in_background: true</code> in the Agent call. Continue with other work; you're notified when it finishes. Great for tasks that take minutes.</p>

          <h4>9. Pin frequent paths via <code>@file</code> mentions</h4>
          <p>In the prompt, <code>@server.js</code> includes the file's contents at submission. Skips a Read call. Works for relative paths.</p>

          <h4>10. Use the <code>TaskCreate</code> tool for multi-step work</h4>
          <p>Claude already tracks a todo list internally when tasks get complex. Asking explicitly ("track this as a task list") makes the progress visible and stable across compaction.</p>

          <h4>11. Combine <code>Plan</code> subagent + main turn for the best of both</h4>
          <p>Ask Claude in the main turn to "spawn a Plan subagent to design X, then implement based on its plan." You get isolated design + integrated execution.</p>

          <h4>12. Skills can disable their own dangerous tools</h4>
          <p>If a skill explicitly omits a tool from its <code>tools:</code> frontmatter, that tool is unavailable during the skill's execution. Use to scope a code-review skill to read-only.</p>

          <h4>13. Hooks can be triggered conditionally via <code>matcher</code></h4>
          <p>Don't run prettier on JSON files? Don't run tests on the docs folder? Match patterns precisely:</p>
          <CodePre>{`"matcher": "Edit|Write",
"hooks": [{
  "type": "command",
  "command": "case \\"$CLAUDE_TOOL_INPUT_file_path\\" in src/*) npm test ;; esac"
}]`}</CodePre>

          <h4>14. <code>WebFetch</code> can read remote docs into context</h4>
          <p>"Read this RFC and summarize the changes: https://datatracker.ietf.org/..." — Claude pulls it directly. Useful for staying current.</p>

          <h4>15. Customize the model per subagent</h4>
          <p>A search-heavy <code>Explore</code> agent can run on Haiku (cheaper, faster). A code-review agent that needs deep judgment can be pinned to Opus. Set <code>model:</code> in the agent's frontmatter.</p>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">XII</span>Troubleshooting</h2>

          <h3>Permission prompts I don't want</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Fix</th></tr>
              <tr><td>Same Bash command prompts every time</td><td>Add it to <code>allow</code> with a globbed pattern: <code>Bash(npm test:*)</code></td></tr>
              <tr><td>Permission already in <code>allow</code> but still prompts</td><td>Check the exact tool name + arg pattern. The pattern must match the full invocation. Try a broader glob first.</td></tr>
              <tr><td>I added it to <code>~/.claude/settings.json</code> but it still prompts in this project</td><td>Check for <code>deny</code> in project-level <code>settings.json</code> — it overrides user allow. Or a <code>settings.local.json</code> is overriding.</td></tr>
              <tr><td>I want zero prompts for a quick task</td><td>Switch to <code>bypassPermissions</code> mode temporarily via <code>/permissions</code>. Switch back when done.</td></tr>
            </tbody>
          </table>

          <h3>Hooks not firing</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>PostToolUse hook never runs</td><td>Wrong <code>matcher</code> regex</td><td>Test with <code>"matcher": ".*"</code> first; narrow once it fires</td></tr>
              <tr><td>Hook runs but appears not to</td><td>Output going to stderr (silently dropped)</td><td>Test by writing to a file: <code>echo "ran" &gt;&gt; /tmp/cchook.log</code></td></tr>
              <tr><td>Hook blocks every tool call</td><td>Exiting non-zero by accident (e.g., grep returning no matches)</td><td>Add <code>|| true</code> or explicit <code>exit 0</code></td></tr>
              <tr><td>UserPromptSubmit hook output doesn't reach Claude</td><td>Output going to stderr, or hook timed out</td><td>Print to stdout; keep hook fast (&lt;1s)</td></tr>
            </tbody>
          </table>

          <h3>Skills not being invoked</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>Typing <code>/myskill</code> errors</td><td>Skill not discovered — wrong path or wrong frontmatter</td><td>Path must be <code>.claude/skills/&lt;name&gt;/SKILL.md</code>. Frontmatter must have <code>name:</code> and <code>description:</code>.</td></tr>
              <tr><td>Skill exists but Claude doesn't auto-invoke</td><td>Description too vague to match the prompt</td><td>Rewrite description with explicit triggers: "Use when user mentions X, Y, or Z."</td></tr>
              <tr><td>Skill runs but lacks needed tools</td><td>Tools not in frontmatter <code>tools:</code></td><td>Add: <code>tools: [Read, Bash, Edit, ...]</code></td></tr>
            </tbody>
          </table>

          <h3>MCP server not working</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Fix</th></tr>
              <tr><td>Server not starting</td><td>Run the command manually in your shell. Most failures are missing deps or wrong args.</td></tr>
              <tr><td>No tools showing</td><td>Server started but doesn't expose tools. Check the server's docs; some need a flag.</td></tr>
              <tr><td>Auth failing</td><td>Env vars in <code>settings.json → mcpServers.&lt;name&gt;.env</code>, not in <code>env</code> at top level.</td></tr>
              <tr><td>"Tool not allowed"</td><td>Add <code>mcp__&lt;server&gt;__&lt;tool&gt;</code> to permissions allow list</td></tr>
              <tr><td>Tool hangs forever</td><td>STDIO server may be blocked on stdin. Restart by reloading the session.</td></tr>
            </tbody>
          </table>

          <h3>"Claude lost track of what we were doing"</h3>
          <p>Context compaction is automatic but lossy. Strategies:</p>
          <ul>
            <li><strong>Save state in CLAUDE.md</strong> or memory as you go: "Currently on step 3 of the migration; tests pass for routes/, working on services/." Survives compaction.</li>
            <li><strong>Use <code>TaskCreate</code></strong> for multi-step work — the task list survives compaction more reliably than chat history.</li>
            <li><strong>Reference files explicitly</strong>: "We last edited <code>server.js:42</code> — re-read it and continue." Beats hoping Claude remembers.</li>
            <li><strong>Start a fresh session</strong> with a concise handoff prompt when the current one has drifted. Often faster than fighting context fragmentation.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">XIII</span>Cheat Sheet</h2>

          <h3>Commands &amp; keys you'll use weekly</h3>

          <h4>Built-in slash commands</h4>
          <table>
            <tbody>
              <tr><td><code>/init</code></td><td>Scaffold a project CLAUDE.md</td></tr>
              <tr><td><code>/compact</code></td><td>Force conversation compaction</td></tr>
              <tr><td><code>/cost</code></td><td>Show token usage for the session</td></tr>
              <tr><td><code>/clear</code></td><td>Start a fresh conversation</td></tr>
              <tr><td><code>/help</code></td><td>List commands</td></tr>
              <tr><td><code>/model</code></td><td>Switch model (Sonnet / Opus / Haiku)</td></tr>
              <tr><td><code>/permissions</code></td><td>Switch permission mode</td></tr>
              <tr><td><code>/config</code></td><td>Open settings editor</td></tr>
              <tr><td><code>/review</code></td><td>Built-in PR review (skill)</td></tr>
              <tr><td><code>/security-review</code></td><td>Security pass on pending changes</td></tr>
              <tr><td><code>/loop &lt;interval&gt; &lt;command&gt;</code></td><td>Periodic execution</td></tr>
              <tr><td><code>/fast</code></td><td>Toggle fast mode (Opus only)</td></tr>
            </tbody>
          </table>

          <h4>Keys</h4>
          <table>
            <tbody>
              <tr><td><kbd>Shift+Tab</kbd></td><td>Cycle permission modes</td></tr>
              <tr><td><kbd>Ctrl+R</kbd></td><td>Search transcript</td></tr>
              <tr><td><kbd>Esc</kbd></td><td>Interrupt Claude mid-thought</td></tr>
              <tr><td><kbd>!</kbd> prefix</td><td>Run command in your shell, output lands in chat</td></tr>
              <tr><td><kbd>@</kbd> mention</td><td>Attach a file to the prompt</td></tr>
            </tbody>
          </table>

          <h4>Config files</h4>
          <table>
            <tbody>
              <tr><td><code>~/.claude/settings.json</code></td><td>User settings</td></tr>
              <tr><td><code>~/.claude/CLAUDE.md</code></td><td>Your global preferences</td></tr>
              <tr><td><code>~/.claude/keybindings.json</code></td><td>Custom keys</td></tr>
              <tr><td><code>&lt;proj&gt;/.claude/settings.json</code></td><td>Project settings (commit)</td></tr>
              <tr><td><code>&lt;proj&gt;/.claude/settings.local.json</code></td><td>Per-machine overrides (gitignore)</td></tr>
              <tr><td><code>&lt;proj&gt;/CLAUDE.md</code></td><td>Project brain</td></tr>
              <tr><td><code>&lt;proj&gt;/.claude/agents/*.md</code></td><td>Custom subagents</td></tr>
              <tr><td><code>&lt;proj&gt;/.claude/skills/&lt;name&gt;/SKILL.md</code></td><td>Skills</td></tr>
              <tr><td><code>&lt;proj&gt;/.claude/commands/*.md</code></td><td>Slash commands</td></tr>
              <tr><td><code>~/.claude/projects/&lt;ws&gt;/memory/</code></td><td>Auto-memory dir</td></tr>
            </tbody>
          </table>
        </section>

        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--rust)', marginBottom: 8 }}>
            🤖 Claude Code Power User
          </div>
          v1 · 2026-05-15. Companion: the AI Features in Your Apps guide covers the Anthropic API side
          (caching, tool use, streaming, evals) for embedding Claude in your apps.
        </div>
      </main>
    </div>
  );
}
