import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Foundations',                  icon: '🏛️' },
  { id: 's2',  num: '2',  title: 'Identity & profile',           icon: '🔐' },
  { id: 's3',  num: '3',  title: 'Repositories',                 icon: '📦' },
  { id: 's4',  num: '4',  title: 'Git command reference',        icon: '⌨️' },
  { id: 's5',  num: '5',  title: 'Branches & pull requests',     icon: '🌿' },
  { id: 's6',  num: '6',  title: 'Code review etiquette',        icon: '👀' },
  { id: 's7',  num: '7',  title: 'Branch protection & rulesets', icon: '🛡️' },
  { id: 's8',  num: '8',  title: 'Webhooks',                     icon: '🪝' },
  { id: 's9',  num: '9',  title: 'GitHub Copilot',               icon: '🤖' },
  { id: 's10', num: '10', title: 'Project management',           icon: '📋' },
  { id: 's11', num: '11', title: 'GitHub Actions',               icon: '⚙️' },
  { id: 's12', num: '12', title: 'Secrets, OIDC & reuse',        icon: '🔑' },
  { id: 's13', num: '13', title: 'Security',                     icon: '🔒' },
  { id: 's14', num: '14', title: 'Distribution & publishing',    icon: '📤' },
  { id: 's15', num: '15', title: 'Developer tools',              icon: '🛠️' },
  { id: 's16', num: '16', title: 'Workflow recipes',             icon: '🍳' },
  { id: 's17', num: 'A',  title: 'Cheat sheet & glossary',       icon: '📚' },
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

export default function GitHubMasteryGuide() {
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
              <path d="M14 6a8 8 0 0 0-2.5 15.6c.4.1.6-.2.6-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8 0 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.1-.1-.2-.4-1.1.1-2.2 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 2 .1 2.2.5.5.8 1.2.8 2.1 0 3-1.8 3.7-3.6 3.9.3.2.5.7.5 1.5v2.2c0 .2.2.5.6.4A8 8 0 0 0 14 6z" fill="white" opacity="0.9" />
            </svg>
            <span className="sidebar-title">GitHub Mastery</span>
          </div>
          <div className="sidebar-sub">Branches · PRs · Actions · Copilot</div>
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
          <div className="hero-tag">🐙 GitHub Mastery · 2026</div>
          <h1>GitHub<br />Mastery</h1>
          <p>
            From "I push directly to <code>main</code>" to GitHub mastery. Deep dives on branches, pull requests, rulesets, webhooks, Copilot, Actions, security, and every other feature worth knowing. Every major section has <strong style={{ color: '#C77AA0' }}>both UI and CLI walkthroughs</strong>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">17</span><span className="hero-stat-label">Chapters</span></div>
            <div className="hero-stat"><span className="hero-stat-val">5</span><span className="hero-stat-label">Maturity levels</span></div>
            <div className="hero-stat"><span className="hero-stat-val">UI + CLI</span><span className="hero-stat-label">Both paths</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2026</span><span className="hero-stat-label">Up to date</span></div>
          </div>
        </div>

        {/* SECTION 1 — FOUNDATIONS */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>Foundations</h2>

          <h3>The GitHub maturity ladder</h3>
          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Level 1<br/>Direct to main] --> B[Level 2<br/>Feature branches +<br/>self-merge PRs]
    B --> C[Level 3<br/>Branch protection +<br/>Required CI checks]
    C --> D[Level 4<br/>Rulesets,<br/>CODEOWNERS,<br/>required reviewers]
    D --> E[Level 5<br/>Multi-repo orchestration,<br/>org-wide policies,<br/>custom GitHub App]
    style A fill:#a8542e,color:#fff
    style E fill:#4a8b3b,color:#fff`} />
          <p>Most teams aim at Level 3–4. Level 5 is overkill for solo work but worth knowing. The single biggest workflow upgrade is going from Level 1 to Level 3 — protected <code>main</code>, PR-based workflow, required CI.</p>

          <h3>Account types</h3>
          <table>
            <tbody>
              <tr><th>Type</th><th>Use</th></tr>
              <tr><td><strong>Personal</strong></td><td>Your individual identity. Owns your personal repos.</td></tr>
              <tr><td><strong>Organization</strong></td><td>Shared namespace for teams/companies. Multiple owners, teams, billing.</td></tr>
              <tr><td><strong>Enterprise</strong></td><td>Container for multiple organizations (large companies).</td></tr>
            </tbody>
          </table>

          <h3>Plans</h3>
          <table>
            <tbody>
              <tr><th>Plan</th><th>Cost</th><th>Gets you</th></tr>
              <tr><td>Free</td><td>$0</td><td>Unlimited public + private repos, 500MB Packages, 2000 Actions min/mo</td></tr>
              <tr><td>Pro</td><td>$4/mo</td><td>+ Codespaces hours, larger Actions allowance, advanced insights</td></tr>
              <tr><td>Team</td><td>$4/user/mo</td><td>Org: required reviewers, draft PRs, scheduled reminders, audit log</td></tr>
              <tr><td>Enterprise</td><td>$21/user/mo</td><td>+ SSO, SAML, SCIM, audit log API, GHAS</td></tr>
            </tbody>
          </table>

          <h3>Two-Factor Authentication (2FA)</h3>
          <p><strong>Mandatory.</strong> GitHub enforces 2FA for everyone who contributes code. In order of preference:</p>
          <ol>
            <li><strong>Passkey</strong> (best — phishing-resistant)</li>
            <li><strong>Security key</strong> (YubiKey, etc.)</li>
            <li><strong>Authenticator app</strong> (Authy, 1Password, Microsoft Authenticator)</li>
            <li>SMS (least secure — avoid)</li>
          </ol>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Recovery codes are your only safety net.</strong> Download recovery codes when you enable 2FA. Store them in 1Password or an encrypted file. If you lose your phone <em>and</em> laptop, these codes are your only way back in. Without them, account recovery via GitHub Support takes days and isn't guaranteed.</div>
          </div>
        </section>

        {/* SECTION 2 — IDENTITY & PROFILE */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Identity &amp; profile</h2>

          <h3>SSH vs HTTPS for git operations</h3>
          <table>
            <tbody>
              <tr><th></th><th>HTTPS</th><th>SSH</th></tr>
              <tr><td>Auth</td><td>PAT or OAuth via <code>gh</code></td><td>SSH key pair</td></tr>
              <tr><td>Setup</td><td>Easier on Windows</td><td>Slightly more steps</td></tr>
              <tr><td>Behind firewalls</td><td>Works on port 443</td><td>Often blocked (port 22)</td></tr>
              <tr><td>Re-auth</td><td><code>gh</code> handles it</td><td>Almost never — keys don't expire</td></tr>
            </tbody>
          </table>

          <h4>Switching to SSH (when you want zero re-auth friction)</h4>
          <CodePre>{`# 1. Generate a key
ssh-keygen -t ed25519 -C "you@example.com"

# 2. Add to ssh-agent (Windows PowerShell)
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add $env:USERPROFILE\\.ssh\\id_ed25519

# 3. Add public key to GitHub
gh ssh-key add ~/.ssh/id_ed25519.pub --title "Dev Box"

# 4. Test
ssh -T git@github.com

# 5. Switch existing repo from HTTPS to SSH
git remote set-url origin git@github.com:USER/REPO.git`}</CodePre>

          <h3>Personal Access Tokens (PATs)</h3>
          <ul>
            <li><strong>Classic PATs</strong> — broad scopes (<code>repo</code>, <code>workflow</code>, etc.), one token covers all repos, long expiration possible.</li>
            <li><strong>Fine-grained PATs</strong> (preferred) — per-repository access, per-permission granularity, max 1-year expiration enforced.</li>
          </ul>

          <MermaidDiagram theme="default" chart={`flowchart TD
    A[Need a token?] --> B{What's it for?}
    B -->|Personal scripts on<br/>your own repos| C[Use gh CLI<br/>no PAT needed]
    B -->|Third-party app| D[Fine-grained PAT<br/>scoped to needed repos]
    B -->|CI/CD| E[Use OIDC if possible<br/>else PAT in secrets]
    B -->|GitHub API automation| F[Fine-grained PAT<br/>or GitHub App]
    style C fill:#4a8b3b,color:#fff
    style E fill:#4a8b3b,color:#fff`} />

          <h3>Signed commits — SSH signing (easiest, modern)</h3>
          <CodePre>{`# 1. Use your SSH key for signing
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# 2. Sign all commits by default
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# 3. Recognize your own key
echo "you@example.com $(cat ~/.ssh/id_ed25519.pub)" > ~/.ssh/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers

# 4. Add the SSH key as a SIGNING key on GitHub
gh ssh-key add ~/.ssh/id_ed25519.pub --title "Signing - Dev Box" --type signing`}</CodePre>

          <p>Now every commit you push shows <strong>Verified</strong> on GitHub.</p>

          <h3>Profile mastery (README, pins, status)</h3>
          <h4>Profile README</h4>
          <p>Create a repo with <strong>the same name as your username</strong>. Its <code>README.md</code> becomes your profile page.</p>
          <CodePre>{`gh repo create USERNAME --public --add-readme --description "Profile README"`}</CodePre>

          <h4>Pinned repositories</h4>
          <p>Up to 6 repos shown at the top of your profile. <strong>Profile → Customize your pins</strong>. Pin your best work; update as projects evolve.</p>

          <h4>Achievements &amp; status</h4>
          <ul>
            <li><strong>Achievements</strong> auto-populate (pull shark, quickdraw, galaxy brain). No control over these.</li>
            <li><strong>Status</strong> is a temporary banner ("Busy", "Working on X"). Set via the profile dropdown menu.</li>
          </ul>

          <h4>GitHub Sponsors</h4>
          <p>Accept payments for open-source work. Requires application + tax info; only supported in some regions. Set up at <strong>Settings → Billing &amp; plans → Sponsors</strong>.</p>

          <h3>Notifications &amp; subscriptions — controlling the firehose</h3>
          <p>GitHub's default notifications flood you. A power user tames them.</p>

          <h4>Watch settings (per repo)</h4>
          <ul>
            <li><strong>Participating and @mentions</strong> (default) — only when you're tagged or already in the thread</li>
            <li><strong>All Activity</strong> — every issue, PR, discussion. Use for a repo you actively maintain.</li>
            <li><strong>Ignore</strong> — silence everything</li>
            <li><strong>Custom</strong> — pick categories: Issues, PRs, Discussions, Releases, Security alerts</li>
          </ul>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Pro tip: the Releases-only watch.</strong> On open-source dependencies you care about, set <strong>Custom → Releases only</strong>. You get notified of new versions without the issue-tracker noise.</div>
          </div>

          <h4>Useful saved filters at github.com/notifications</h4>
          <ul>
            <li><code>is:pr is:unread reason:review-requested</code> — PRs awaiting your review</li>
            <li><code>is:issue is:unread reason:assign</code> — issues assigned to you</li>
            <li><code>reason:mention</code> — everything where you were @mentioned</li>
            <li><code>is:unread reason:security_alert</code> — Dependabot security alerts</li>
          </ul>

          <h4>GitHub Mobile (for triage on the go)</h4>
          <p>The official iOS/Android app handles notifications well: swipe to archive, push notifications you can mute per repo, code-review with inline diff. <strong>The best use case</strong>: triage your inbox while commuting, leave deep work for the desktop.</p>
        </section>

        {/* SECTION 3 — REPOSITORIES */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Repositories</h2>

          <h3>Creating a repo via CLI (faster than UI)</h3>
          <CodePre>{`# Create + clone in one step
gh repo create my-new-project --public --clone --add-readme

# Private + with description
gh repo create cool-tool --private --description "Internal tooling" --clone

# Create from current directory
cd ~/existing-project
git init && git add . && git commit -m "initial commit"
gh repo create --source=. --public --push`}</CodePre>

          <h3>Visibility levels</h3>
          <table>
            <tbody>
              <tr><th>Visibility</th><th>Who sees it</th><th>Use case</th></tr>
              <tr><td>Public</td><td>Everyone</td><td>Open source, portfolio, sharing</td></tr>
              <tr><td>Private</td><td>Only you + collaborators</td><td>Personal projects, WIP, business</td></tr>
              <tr><td>Internal</td><td>Everyone in your enterprise</td><td>Enterprise plan only</td></tr>
            </tbody>
          </table>

          <h3>Repository templates</h3>
          <p>Mark a repo as a template, then create new repos pre-populated with its contents:</p>
          <CodePre>{`gh repo edit owner/repo --template
gh repo create my-new-project --template owner/template-repo --public --clone`}</CodePre>

          <p>Useful for your stack: create a template repo with Vite + TypeScript + ESLint + your CI workflow pre-configured.</p>

          <h3>.gitignore + .gitattributes</h3>
          <CodePre>{`# .gitignore — common patterns
node_modules/
dist/
build/
*.log
.env
.env.local
.DS_Store
Thumbs.db
.vscode/
.idea/
*.pem
*.key`}</CodePre>

          <CodePre>{`# .gitattributes — line endings + binary handling + linguist
* text=auto eol=lf

*.png binary
*.jpg binary
*.mp3 binary

docs/* linguist-documentation
vendor/* linguist-vendored`}</CodePre>

          <p>Linguist directives fix the "this repo is 78% HTML" problem when most of your HTML is generated output.</p>

          <h3>Archiving vs deleting</h3>
          <ul>
            <li><strong>Archive</strong> when a project is done but worth keeping visible. Read-only, can be unarchived.</li>
            <li><strong>Delete</strong> when it has zero value and you're sure. No undo.</li>
          </ul>
          <CodePre>{`gh repo archive owner/repo
gh repo delete owner/repo  # asks for confirmation, --yes to skip`}</CodePre>

          <h3>CODEOWNERS file</h3>
          <p>Define automatic reviewer assignment by file path:</p>
          <CodePre>{`# .github/CODEOWNERS
*                       @username
/src/components/        @frontend-team @design-team
/server.js              @backend-team
/.github/workflows/     @devops-team @username`}</CodePre>

          <p>Combined with branch protection, required reviewers auto-assign based on the changed files.</p>
        </section>

        {/* SECTION 4 — GIT REFERENCE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Git command reference</h2>

          <h3>Configuration &amp; aliases</h3>
          <CodePre>{`# Identity
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Default branch
git config --global init.defaultBranch main

# Line endings on Windows
git config --global core.autocrlf input

# Editor
git config --global core.editor "code --wait"

# Push behavior
git config --global push.default simple
git config --global push.autoSetupRemote true   # auto-set upstream on first push

# Pull with rebase (cleaner history)
git config --global pull.rebase true`}</CodePre>

          <h4>Aliases — productivity multipliers</h4>
          <CodePre>{`[alias]
    co = checkout
    sw = switch
    br = branch
    st = status
    ci = commit
    a = add
    ap = add -p

    # Beautiful log
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
    last = log -1 HEAD --stat

    # Common shortcuts
    unstage = reset HEAD --
    amend = commit --amend --no-edit
    discard = checkout --

    # Branch management
    cleanup = "!git branch --merged | grep -v '^\\\\*\\\\|main\\\\|master' | xargs -n 1 git branch -d"
    recent = branch --sort=-committerdate

    # Sync
    sync = "!git fetch origin && git rebase origin/main"`}</CodePre>

          <h3>Daily commands</h3>
          <CodePre>{`git status                    # What's changed?
git add file.js               # Stage a file
git add .                     # Stage everything
git add -p                    # Stage interactively (review hunks)
git commit -m "message"       # Commit staged changes
git commit -am "message"      # Stage tracked changes + commit (skips untracked)
git push                      # Push to upstream
git pull                      # Fetch + merge/rebase
git fetch                     # Download remote changes without merging
git log                       # History
git diff                      # Unstaged changes
git diff --staged             # Staged changes
git diff main..feature        # Difference between branches`}</CodePre>

          <h4>Branching</h4>
          <CodePre>{`git branch                          # List local branches
git branch -a                       # List all branches (local + remote)
git switch -c feature-x             # Create + switch to new branch
git switch main                     # Switch to existing
git switch -                        # Switch to previous branch (like cd -)
git branch -d feature-x             # Delete merged branch
git branch -D feature-x             # Force delete unmerged branch
git push origin --delete feature-x  # Delete remote branch`}</CodePre>

          <h4>Stashing</h4>
          <CodePre>{`git stash                       # Save uncommitted changes
git stash push -m "message"     # Save with description
git stash list                  # See all stashes
git stash pop                   # Restore + remove top stash
git stash apply stash@{2}       # Apply specific stash without removing
git stash drop stash@{0}        # Discard a stash
git stash branch fix-from-stash # Create branch from stash`}</CodePre>

          <h3>Merging, rebasing, reset, revert</h3>
          <h4>Merging</h4>
          <CodePre>{`git switch main
git merge feature-x             # Merge feature into current branch
git merge --no-ff feature-x     # Force a merge commit (preserves topology)
git merge --squash feature-x    # Combine all commits into one
git merge --ff-only feature-x   # Only allow if fast-forward possible`}</CodePre>

          <h4>Rebasing (rewriting history)</h4>
          <CodePre>{`git switch feature-x
git rebase main                 # Replay feature commits on top of main
git rebase -i main              # Interactive: edit, reword, squash, drop
git push --force-with-lease     # Safer than --force after rewrite`}</CodePre>

          <h4>Reset — moving HEAD around</h4>
          <MermaidDiagram theme="default" chart={`flowchart TD
    A[Working Directory] -->|git add| B[Staging Area / Index]
    B -->|git commit| C[Local Repo / HEAD]
    C -->|git push| D[Remote]
    E[git reset --soft] -.->|moves HEAD,<br/>keeps staged| B
    F[git reset --mixed] -.->|moves HEAD,<br/>unstages| A
    G[git reset --hard] -.->|moves HEAD,<br/>discards everything| H[GONE]
    I[git checkout --] -.->|discards working<br/>directory changes| H
    style H fill:#a8542e,color:#fff`} />

          <CodePre>{`git reset --soft HEAD~1         # Undo commit, keep changes staged
git reset --mixed HEAD~1        # Undo commit, keep changes unstaged (default)
git reset --hard HEAD~1         # Undo commit, DISCARD changes ⚠️
git reset --hard origin/main    # Force local main to match remote ⚠️`}</CodePre>

          <h4>Revert (safe undo for shared history)</h4>
          <CodePre>{`git revert COMMIT_HASH          # Creates a new commit that undoes the target
git revert HEAD~3..HEAD         # Revert a range
git revert --no-commit HEAD     # Revert into staging without committing`}</CodePre>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Reset vs revert.</strong> Use <code>revert</code> on commits already pushed (shared history). Use <code>reset</code> only for local history.</div>
          </div>

          <h3>Reflog — your time machine</h3>
          <p>Every move HEAD makes is recorded. If you "lose" work, reflog finds it:</p>
          <CodePre>{`git reflog
# a1b2c3 HEAD@{0}: reset: moving to HEAD~3   ← oh no, I lost work
# d4e5f6 HEAD@{1}: commit: my important work

git reset --hard HEAD@{1}                # Recover your work`}</CodePre>

          <p>Reflog entries last ~90 days locally. <strong>This is why you can recover from most "I broke git" disasters.</strong></p>

          <h4>Common recovery scenarios</h4>
          <CodePre>{`# "I committed to the wrong branch"
git branch feature-x        # Create branch pointing to current HEAD
git reset --hard HEAD~1     # Move main back one
git switch feature-x        # You're on the right branch now

# "I committed but forgot to add a file"
git add forgotten-file.js
git commit --amend --no-edit

# "I want to change the last commit message"
git commit --amend -m "New message"

# "I want to undo a push to a shared branch"
git revert HEAD
git push

# "Find when a bug was introduced"
git bisect start
git bisect bad
git bisect good v1.0
# Repeat until git tells you the culprit
git bisect reset`}</CodePre>

          <h3>Advanced: submodules, LFS, worktrees, hooks</h3>
          <h4>Submodules</h4>
          <CodePre>{`git submodule add https://github.com/user/library libs/library
git clone --recurse-submodules URL
git submodule update --init --recursive
git submodule update --remote --merge`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Submodules are notoriously confusing.</strong> Modern alternatives: package managers (npm, pip), monorepos, or git subtree.</div>
          </div>

          <h4>Git LFS (Large File Storage)</h4>
          <CodePre>{`git lfs install
git lfs track "*.psd"
git lfs track "*.mp4"
git add .gitattributes
# Use git normally — LFS swaps in pointer files
git add huge-video.mp4
git commit -m "Add tutorial video"
git push`}</CodePre>

          <h4>Git worktrees</h4>
          <p>Multiple working directories from one repo. Useful for jumping between branches without stashing.</p>
          <CodePre>{`git worktree add ../my-repo-feature feature-branch
git worktree list
git worktree remove ../my-repo-feature`}</CodePre>

          <h4>Git hooks</h4>
          <table>
            <tbody>
              <tr><th>Hook</th><th>Fires when</th><th>Use</th></tr>
              <tr><td><code>pre-commit</code></td><td>Before committing</td><td>Lint, format, run tests</td></tr>
              <tr><td><code>commit-msg</code></td><td>After commit message written</td><td>Validate format</td></tr>
              <tr><td><code>pre-push</code></td><td>Before pushing</td><td>Run full test suite</td></tr>
              <tr><td><code>post-merge</code></td><td>After pulling/merging</td><td>Auto-run <code>npm install</code> if package.json changed</td></tr>
            </tbody>
          </table>

          <p>Hooks are local-only by default. Tools that distribute hooks across a team: <strong>husky</strong>, <strong>pre-commit</strong>, <strong>lefthook</strong>.</p>

          <h4>Conventional Commits</h4>
          <CodePre>{`<type>[scope]: <description>

[body]

[footer]

# Example:
feat(auth): add SSO via Entra ID

Users can now sign in with their work account.

BREAKING CHANGE: Existing local user accounts must migrate.`}</CodePre>

          <p>Types: <code>feat</code>, <code>fix</code>, <code>docs</code>, <code>style</code>, <code>refactor</code>, <code>perf</code>, <code>test</code>, <code>chore</code>, <code>ci</code>. Tools: <strong>commitlint</strong> (validates), <strong>release-please</strong> (auto-changelog).</p>
        </section>

        {/* SECTION 5 — BRANCHES & PRs */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Branches &amp; pull requests</h2>

          <p>A branch is <strong>a pointer to a commit</strong>. When you commit, the pointer moves forward. When you switch branches, HEAD points to a different commit, and your working directory updates.</p>

          <h3>Branch strategies</h3>
          <table>
            <tbody>
              <tr><th>Strategy</th><th>When to use</th></tr>
              <tr><td><strong>GitHub Flow</strong></td><td>Most apps. <code>main</code> always deployable, short-lived feature branches, merge via PR.</td></tr>
              <tr><td><strong>Git Flow</strong></td><td>Libraries with multiple supported versions. <code>develop</code>, <code>feature/*</code>, <code>release/*</code>, <code>hotfix/*</code>.</td></tr>
              <tr><td><strong>Trunk-based</strong></td><td>Mature CI + feature flags. Everyone commits to <code>main</code>. Used at Google, Meta.</td></tr>
            </tbody>
          </table>

          <h3>Branch lifecycle</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
    participant Local
    participant Remote
    participant Main
    Note over Local,Main: 1. Create
    Local->>Local: git switch -c feat/x
    Local->>Remote: git push -u
    Note over Local,Main: 2. Work
    Local->>Local: edit + commit
    Local->>Remote: git push
    Note over Local,Main: 3. Sync with main
    Main->>Remote: someone merged X
    Remote->>Local: git fetch origin
    Local->>Local: git rebase origin/main
    Note over Local,Main: 4. Merge via PR
    Remote->>Main: PR merged
    Note over Local,Main: 5. Cleanup
    Remote->>Remote: branch auto-deleted
    Local->>Local: git switch main && git pull
    Local->>Local: git branch -d feat/x`} />

          <h3>Pull Requests — the complete playbook</h3>
          <p>A PR is a proposal to merge one branch into another, with discussion attached. PRs turn <code>git merge</code> from a click into a workflow with review, CI, discussion, and history.</p>

          <h4>Lifecycle of a PR</h4>
          <MermaidDiagram theme="default" chart={`stateDiagram-v2
    [*] --> Draft: gh pr create --draft
    Draft --> Ready: Mark ready for review
    Ready --> Reviewing: Reviewers added
    Reviewing --> Changes_Requested: Reviewer requests changes
    Changes_Requested --> Reviewing: Address feedback,<br/>push more commits
    Reviewing --> Approved: All required approve
    Approved --> Merged: Click merge
    Merged --> [*]
    Ready --> Closed: Closed without merge
    Closed --> [*]`} />

          <h4>Creating a PR — CLI</h4>
          <CodePre>{`# Push and create PR in one step
git push -u origin feat/add-auth
gh pr create --title "Add OIDC auth" --body "Replaces password flow with Entra ID"

# Interactive
gh pr create
gh pr create --draft
gh pr create --base develop
gh pr create --body-file pr-description.md
gh pr create --web`}</CodePre>

          <h4>PR template</h4>
          <p>Create <code>.github/pull_request_template.md</code>:</p>
          <CodePre>{`## Summary
<!-- What does this PR do? -->

## Why
<!-- Context — why is this needed? -->

## Changes
- [ ] ...

## Test plan
- [ ] Manual test: ...
- [ ] Added unit tests
- [ ] Verified CI passes

Closes #`}</CodePre>

          <p><strong>Use this even when solo</strong> — it forces you to articulate what you did.</p>

          <h4>Linking issues — closing keywords auto-close on merge</h4>
          <CodePre>{`Closes #42
Fixes #43
Resolves #44`}</CodePre>

          <p>Synonyms: <code>close</code>, <code>closed</code>, <code>closing</code>, <code>fix</code>, <code>fixed</code>, <code>fixing</code>, <code>resolve</code>, <code>resolved</code>, <code>resolving</code>.</p>

          <h4>Reviewing — CLI</h4>
          <CodePre>{`gh pr list --search "review-requested:@me"
gh pr checkout 42                          # check out PR branch locally
gh pr view 42
gh pr diff 42
gh pr checks 42                            # CI status

gh pr review 42 --approve --body "LGTM"
gh pr review 42 --request-changes --body "See inline comments"
gh pr review 42 --comment --body "Some thoughts..."

gh pr comment 42 --body "Looks great!"`}</CodePre>

          <h4>Merge methods</h4>
          <table>
            <tbody>
              <tr><th>Strategy</th><th>History</th><th>Pros</th><th>Cons</th><th>When to use</th></tr>
              <tr><td><strong>Merge commit</strong></td><td>Branchy</td><td>Preserves exact history</td><td>Noisy log</td><td>Long-lived feature branches, multi-author</td></tr>
              <tr><td><strong>Squash</strong></td><td>Linear</td><td>Clean log, one commit per PR</td><td>Loses granular history</td><td>Short-lived PRs, solo work</td></tr>
              <tr><td><strong>Rebase</strong></td><td>Linear</td><td>Clean + preserves commits</td><td>Rewrites history</td><td>When commits are individually meaningful</td></tr>
            </tbody>
          </table>

          <p><strong>For solo / short PRs: Squash merge.</strong> Each PR becomes one well-described commit on <code>main</code>. Easy to revert, easy to log.</p>

          <h4>Auto-merge</h4>
          <CodePre>{`gh pr merge 42 --auto --squash`}</CodePre>

          <p>GitHub waits for required checks + approvals, then merges automatically. Saves you from coming back to click merge after CI passes.</p>
        </section>

        {/* SECTION 6 — CODE REVIEW */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Code review etiquette</h2>

          <h3>As a reviewer</h3>
          <ul>
            <li><strong>Read the description first.</strong> Understand intent before judging code.</li>
            <li><strong>Comment, don't command.</strong> "Could we…?" beats "Change this to…".</li>
            <li><strong>Distinguish must from nit.</strong> Prefix: <code>nit:</code> (optional polish), <code>suggestion:</code> (probably do this), <code>blocker:</code> (must fix), <code>question:</code> (asking, not judging).</li>
            <li><strong>Approve generously.</strong> If 80% is good and you have 2 nits, approve with comments.</li>
            <li><strong>Test the code.</strong> Don't just read — pull the branch and run it.</li>
          </ul>

          <h3>As an author</h3>
          <ul>
            <li><strong>Keep PRs small.</strong> &lt;400 lines is reviewable. &gt;1000 lines and reviewers rubber-stamp it.</li>
            <li><strong>Self-review first.</strong> Walk through the diff before requesting review.</li>
            <li><strong>Explain the why.</strong> Code shows what; description shows why.</li>
            <li><strong>Respond to every comment.</strong> Either fix, reply, or explicitly defer.</li>
            <li><strong>Don't squash before review.</strong> Reviewers need to see incremental changes.</li>
          </ul>
        </section>

        {/* SECTION 7 — BRANCH PROTECTION & RULESETS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Branch protection &amp; rulesets</h2>

          <p>GitHub has two systems for protecting branches:</p>
          <ol>
            <li><strong>Classic branch protection rules</strong> — older, per-branch, simpler</li>
            <li><strong>Rulesets</strong> — newer, more flexible, can apply to multiple branches/tags via patterns, can be defined at org level</li>
          </ol>

          <p><strong>For new setups, use Rulesets.</strong> Branch protection still works but rulesets are the future.</p>

          <h3>Rulesets advantages</h3>
          <ul>
            <li>One ruleset can target multiple branches via patterns: <code>main</code>, <code>release/*</code>, <code>~DEFAULT_BRANCH</code></li>
            <li>Can be <strong>organization-wide</strong> (apply to all repos)</li>
            <li><strong>Enforcement statuses</strong>: Active, Evaluate (dry-run), Disabled</li>
            <li><strong>Bypass actors</strong> explicit</li>
            <li><strong>Insights</strong> showing what was blocked</li>
          </ul>

          <h3>Recommended ruleset for your main branch</h3>
          <MermaidDiagram theme="default" chart={`graph TB
    A[Push to main attempted] --> B{Direct push?}
    B -->|Yes| X[Blocked - PR required]
    B -->|No, via PR| C{CI passing?}
    C -->|No| X
    C -->|Yes| D{Approvals?}
    D -->|No| X
    D -->|Yes| E{Signed commits?}
    E -->|No| X
    E -->|Yes| Y[Merged]
    style X fill:#a8542e,color:#fff
    style Y fill:#4a8b3b,color:#fff`} />

          <ul>
            <li>☑️ Require pull request — 0 approvals (solo) or 1 (team)</li>
            <li>☑️ Require status checks (your build workflow)</li>
            <li>☑️ Require branches up to date</li>
            <li>☑️ Block force pushes</li>
            <li>☑️ Restrict deletions</li>
            <li>☑️ Require linear history (paired with squash merge)</li>
            <li>☑️ Require signed commits (if you've set up signing)</li>
          </ul>

          <h3>Rulesets via CLI</h3>
          <CodePre>{`# List rulesets
gh api repos/OWNER/REPO/rulesets

# Create
gh api repos/OWNER/REPO/rulesets \\
  --method POST \\
  --field name="Protect main" \\
  --field target=branch \\
  --field enforcement=active \\
  --raw-field 'conditions={"ref_name":{"include":["refs/heads/main"],"exclude":[]}}' \\
  --raw-field 'rules=[{"type":"pull_request","parameters":{"required_approving_review_count":1}}]'`}</CodePre>

          <h3>Tag rulesets</h3>
          <p>Lock down release tags so you can't accidentally delete or rewrite them: Target <code>v*</code>, restrict creations/updates/deletions.</p>

          <h3>Push rulesets (file-level rules)</h3>
          <ul>
            <li>Restrict file paths — block changes to specific paths</li>
            <li>Restrict file size — block files over X MB (prevents accidental binary commits)</li>
            <li>Restrict commit author email — only specific domains</li>
            <li>Restrict commit message — must match a pattern (e.g., conventional commits)</li>
          </ul>
        </section>

        {/* SECTION 8 — WEBHOOKS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Webhooks</h2>

          <p>Webhooks let GitHub notify external systems when events happen. When code is pushed, an issue opened, a PR merged, GitHub POSTs a JSON payload to your URL.</p>

          <h3>Webhook anatomy</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
    participant GitHub
    participant YourServer
    participant Action
    Note over GitHub: Event happens<br/>(push, PR, etc.)
    GitHub->>YourServer: POST https://your-app.com/hook<br/>X-GitHub-Event: push<br/>X-Hub-Signature-256: sha256=...<br/>Body: payload JSON
    YourServer->>YourServer: Verify HMAC signature
    YourServer->>Action: Trigger CI, send Slack, etc.
    YourServer-->>GitHub: 200 OK (within 10s)`} />

          <h3>Setup</h3>
          <p><strong>Settings → Webhooks → Add webhook</strong>:</p>
          <ol>
            <li><strong>Payload URL:</strong> your endpoint</li>
            <li><strong>Content type:</strong> <code>application/json</code></li>
            <li><strong>Secret:</strong> random string — verify signatures with it</li>
            <li><strong>Events:</strong> just push, or specific events</li>
          </ol>

          <h3>Verifying webhook signatures (CRITICAL)</h3>
          <p>Anyone who knows your URL can POST to it. <strong>Always verify the HMAC signature</strong>:</p>
          <CodePre>{`import express from 'express';
import crypto from 'crypto';

const app = express();
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

app.use('/github-webhook', express.raw({ type: 'application/json' }));

function verifySignature(req) {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) return false;
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(req.body).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

app.post('/github-webhook', (req, res) => {
    if (!verifySignature(req)) return res.status(401).send('Invalid signature');

    const event = req.headers['x-github-event'];
    const payload = JSON.parse(req.body);

    switch (event) {
        case 'push': handlePush(payload); break;
        case 'pull_request': handlePR(payload); break;
    }
    res.status(200).send('ok');
});`}</CodePre>

          <h3>Testing webhooks locally</h3>
          <p>Use a tunnel:</p>
          <CodePre>{`# smee.io (free, GitHub-recommended)
npm install -g smee-client
smee --url https://smee.io/YOUR_CHANNEL --target http://localhost:3000/github-webhook

# Or ngrok
ngrok http 3000

# Or Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000`}</CodePre>

          <h3>Webhook vs GitHub App</h3>
          <table>
            <tbody>
              <tr><th></th><th>Webhook</th><th>GitHub App</th></tr>
              <tr><td>Setup</td><td>URL + secret</td><td>Full app with manifest, OAuth</td></tr>
              <tr><td>Read GitHub data</td><td>No (just receives events)</td><td>Yes (auth'd API access)</td></tr>
              <tr><td>Write back to GitHub</td><td>No (need separate auth)</td><td>Yes (act as the app)</td></tr>
              <tr><td>Use case</td><td>Simple notifications</td><td>Full automation, marketplace apps</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Webhook tips.</strong> Idempotency: GitHub may retry; make handlers safe to receive the same event twice. Respond fast (&lt; 10 seconds): long processing → queue it asynchronously. HTTPS only. Use the webhook's "Recent Deliveries" tab for debugging — full request/response, redeliver button.</div>
          </div>
        </section>

        {/* SECTION 9 — COPILOT */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>GitHub Copilot</h2>

          <h3>What Copilot is and what it actually includes</h3>
          <p>"Copilot" is now an umbrella for several distinct GitHub products. Knowing which is which saves time:</p>
          <table>
            <tbody>
              <tr><th>Product</th><th>Where it lives</th><th>What it does</th></tr>
              <tr><td><strong>Copilot in IDE</strong></td><td>VS Code, JetBrains, Visual Studio, Vim</td><td>Inline code completions + Copilot Chat in a side panel</td></tr>
              <tr><td><strong>Copilot Chat on github.com</strong></td><td>Web (chat icon, top-right)</td><td>Chat that has context for the current repo / file / PR you're viewing</td></tr>
              <tr><td><strong>Copilot CLI</strong></td><td>Terminal (<code>gh copilot</code>)</td><td>Suggest / explain shell commands, git incantations</td></tr>
              <tr><td><strong>Copilot for PRs</strong></td><td>PR page</td><td>Auto-generated PR summaries, code review suggestions, conflict resolution hints</td></tr>
              <tr><td><strong>Copilot Workspace</strong></td><td>github.com/copilot/workspace</td><td>Task-driven: start from an issue, Copilot proposes a plan + multi-file PR</td></tr>
              <tr><td><strong>Copilot Agents</strong> (preview)</td><td>github.com</td><td>Background agents that work asynchronously on issues you assign them</td></tr>
              <tr><td><strong>Copilot Extensions</strong></td><td>IDE + Chat</td><td>Third-party extensions (DataDog, Docker, Sentry, etc.) callable in chat</td></tr>
            </tbody>
          </table>

          <h3>Pricing (2026)</h3>
          <table>
            <tbody>
              <tr><th>Tier</th><th>Cost</th><th>Notable</th></tr>
              <tr><td>Free</td><td>$0</td><td>Limited monthly completions + chat messages; great for trying</td></tr>
              <tr><td>Individual (Pro)</td><td>$10/mo</td><td>Unlimited completions, chat in IDE + web, CLI, Workspace</td></tr>
              <tr><td>Business</td><td>$19/user/mo</td><td>+ org policy controls, audit log, public-code filter enforced</td></tr>
              <tr><td>Enterprise</td><td>$39/user/mo</td><td>+ knowledge bases, custom models, fine-grained access controls</td></tr>
            </tbody>
          </table>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Free tier is genuinely useful.</strong> GitHub's free Copilot tier launched in late 2024 with a meaningful monthly allotment. If you've never tried Copilot because of the $10/mo, the free tier is enough to evaluate seriously.</div>
          </div>

          <h3>Copilot in VS Code</h3>
          <h4>Day-to-day shortcuts</h4>
          <table>
            <tbody>
              <tr><th>Action</th><th>Default key</th></tr>
              <tr><td>Accept suggestion</td><td><kbd>Tab</kbd></td></tr>
              <tr><td>Dismiss suggestion</td><td><kbd>Esc</kbd></td></tr>
              <tr><td>Next suggestion</td><td><kbd>Alt</kbd>+<kbd>]</kbd></td></tr>
              <tr><td>Previous suggestion</td><td><kbd>Alt</kbd>+<kbd>[</kbd></td></tr>
              <tr><td>Open Copilot Chat</td><td><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd></td></tr>
              <tr><td>Inline chat (edit in place)</td><td><kbd>Ctrl</kbd>+<kbd>I</kbd></td></tr>
              <tr><td>Open suggestions panel</td><td><kbd>Ctrl</kbd>+<kbd>Enter</kbd></td></tr>
            </tbody>
          </table>

          <h4>Slash commands in Chat</h4>
          <CodePre>{`/explain        # explain the selected code
/fix            # propose a fix for selected code or visible errors
/tests          # generate tests for the selected code
/doc            # add docstrings / comments
/new            # scaffold a new project — Copilot proposes a multi-file template
/workspace      # ask about the whole project, not just open files
/terminal       # explain or generate terminal commands
@workspace      # context: index the whole workspace before answering
@vscode         # ask about VS Code features themselves
@github         # ask about issues / PRs / docs on github.com`}</CodePre>

          <h4>What makes Copilot accurate vs sloppy</h4>
          <ul>
            <li><strong>Open the relevant files.</strong> Copilot uses your open editor tabs as context. Files you haven't opened are invisible to it.</li>
            <li><strong>Write clear comments before code.</strong> A function header comment that describes intent yields much better suggestions.</li>
            <li><strong>Use <code>@workspace</code> for cross-file questions.</strong> Without it, chat only sees your current selection.</li>
            <li><strong>Reject low-quality completions.</strong> Hitting Tab on bad suggestions trains your habit, not the model.</li>
          </ul>

          <h3>Copilot CLI — terminal helper</h3>
          <CodePre>{`gh extension install github/gh-copilot

# Suggest a command for a goal
gh copilot suggest "find all files modified in the last 24 hours containing 'TODO'"

# Explain a command someone gave you
gh copilot explain "find . -mtime -1 -type f -exec grep -l TODO {} +"

# Aliases (set in your shell profile)
alias '??'='gh copilot suggest'
alias '?!'='gh copilot explain'`}</CodePre>

          <p>The CLI is most useful for: <code>git</code> incantations, one-shot shell scripts, <code>kubectl</code> / <code>az</code> / <code>aws</code> commands you only run occasionally.</p>

          <h3>Copilot Workspace — task-driven coding</h3>
          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Pick an issue<br/>or describe a task] --> B[Copilot proposes<br/>a plan]
    B --> C[You edit<br/>the plan]
    C --> D[Copilot generates<br/>code changes across files]
    D --> E[You review +<br/>edit in browser]
    E --> F[Open PR]`} />

          <p><strong>When it shines:</strong> mechanical refactors across many files, issues with a clear narrow scope, first drafts of new features in indexed codebases.</p>
          <p><strong>When it struggles:</strong> anything requiring deep architectural judgment, cross-repo changes, ambiguous scope.</p>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Treat the plan as the actual deliverable.</strong> The proposed plan is what you should iterate on most carefully. Generated code follows the plan — if the plan is wrong, the code is too. Spend 80% of your time refining the plan, 20% reviewing the resulting diff.</div>
          </div>
        </section>

        {/* SECTION 10 — PROJECT MANAGEMENT */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Project management</h2>

          <h3>Issues, labels, milestones, assignees</h3>
          <CodePre>{`gh issue create --title "Login bug" --body "Steps to reproduce..." --label bug
gh issue create --web
gh issue create               # interactive

gh issue list                          # Show open issues
gh issue list --label bug              # Filtered
gh issue view 42
gh issue close 42 --comment "Fixed in PR #50"
gh issue edit 42 --add-label "priority-high"
gh issue develop 42 --checkout              # auto-create branch from issue`}</CodePre>

          <h4>Useful custom labels</h4>
          <CodePre>{`priority/critical    #B60205
priority/high        #D93F0B
priority/medium      #FBCA04
priority/low         #0E8A16

type/bug             #d73a4a
type/feature         #a2eeef
type/refactor        #1d76db
type/docs            #0075ca

status/blocked       #000000
status/in-progress   #fef2c0
status/ready         #c2e0c6`}</CodePre>

          <CodePre>{`gh label create "priority/critical" --color "B60205" --description "Drop everything"
gh label list
gh label clone OTHER_USER/template-repo`}</CodePre>

          <h3>Projects (v2) — boards, tables, roadmaps</h3>
          <p>Projects v2 is GitHub's modern project management. Boards, tables, or roadmaps with multiple views, custom fields, automations.</p>

          <MermaidDiagram theme="default" chart={`graph TB
    P[Project] --> V[Views]
    P --> F[Fields]
    P --> I[Items]
    V --> V1[Board view<br/>Kanban]
    V --> V2[Table view<br/>Spreadsheet]
    V --> V3[Roadmap view<br/>Timeline]
    F --> F1[Status<br/>Single-select]
    F --> F2[Priority]
    F --> F3[Iteration<br/>Date range]
    I --> I1[Issues from any repo]
    I --> I2[Pull requests]
    I --> I3[Draft items<br/>quick notes]`} />

          <CodePre>{`gh project create --owner @me --title "MyApp Roadmap"
gh project list --owner @me
gh project view 1 --owner @me

# Add an item
gh project item-add 1 --owner @me --url https://github.com/USER/REPO/issues/42

# Add a field
gh project field-create 1 --owner @me --name "Effort" --data-type "NUMBER"`}</CodePre>

          <h4>Automations</h4>
          <ul>
            <li>Item added to project → set Status to Todo</li>
            <li>Issue closed → set Status to Done</li>
            <li>PR merged → set Status to Done</li>
            <li>Auto-add issues/PRs to project (by repo + filter)</li>
            <li>Auto-archive after X days in Done</li>
          </ul>

          <h3>Discussions vs Issues</h3>
          <table>
            <tbody>
              <tr><th></th><th>Issue</th><th>Discussion</th></tr>
              <tr><td>Tracks work</td><td>Yes</td><td>No</td></tr>
              <tr><td>Has labels/assignees</td><td>Yes</td><td>Categories only</td></tr>
              <tr><td>Closes / opens</td><td>Yes</td><td>No (resolved on Q&amp;A)</td></tr>
              <tr><td>Threading</td><td>Linear</td><td>Threaded replies</td></tr>
              <tr><td>When to use</td><td>Bug, feature, task</td><td>Question, idea, conversation</td></tr>
            </tbody>
          </table>

          <p>Enable per-repo: <strong>Settings → General → Features → Discussions</strong>. The <strong>Q&amp;A</strong> category has a unique feature: mark an answer (StackOverflow-style).</p>
        </section>

        {/* SECTION 11 — GITHUB ACTIONS */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>GitHub Actions</h2>

          <MermaidDiagram theme="default" chart={`graph TB
    A[Event] --> B[Workflow]
    B --> C[Jobs]
    C --> D[Steps]
    D --> E[Actions or shell commands]
    F[Runners] -.->|execute| C
    style A fill:#1d76db,color:#fff
    style B fill:#4a8b3b,color:#fff`} />

          <h3>Workflow file structure</h3>
          <CodePre>{`# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test`}</CodePre>

          <h3>Triggers (events)</h3>
          <CodePre>{`on:
  push:
    branches: [main, release/*]
    paths: ['src/**', '!**.md']
    tags: ['v*']

  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main]

  schedule:
    - cron: '0 0 * * *'     # daily at midnight UTC

  workflow_dispatch:        # manual
    inputs:
      environment:
        description: 'Deploy target'
        required: true
        default: 'staging'
        type: choice
        options: [staging, production]

  workflow_call:            # reusable — called from other workflows
  workflow_run:             # when another workflow finishes
    workflows: ['CI']
    types: [completed]

  release:
    types: [published]`}</CodePre>

          <h3>Matrix builds</h3>
          <CodePre>{`jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        include:
          - os: ubuntu-latest
            node: 20
            coverage: true
        exclude:
          - os: windows-latest
            node: 18

    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm test`}</CodePre>

          <h3>Job dependencies &amp; outputs</h3>
          <CodePre>{`jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: \${{ steps.bump.outputs.version }}
    steps:
      - id: bump
        run: echo "version=1.2.3" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying \${{ needs.build.outputs.version }}"`}</CodePre>

          <h3>Caching</h3>
          <CodePre>{`- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-node-

# Or use built-in cache from setup-node:
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'`}</CodePre>

          <h3>Artifacts</h3>
          <CodePre>{`- uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist/
    retention-days: 7

# In another job:
- uses: actions/download-artifact@v4
  with:
    name: dist
    path: ./dist`}</CodePre>

          <h3>Concurrency</h3>
          <CodePre>{`concurrency:
  group: deploy-\${{ github.ref }}
  cancel-in-progress: false   # queue, don't cancel`}</CodePre>

          <h3>Workflow permissions</h3>
          <CodePre>{`permissions:
  contents: write       # Push commits, create releases
  pull-requests: write  # Create/comment PRs
  issues: write
  id-token: write       # For OIDC
  packages: write
  pages: write`}</CodePre>
        </section>

        {/* SECTION 12 — SECRETS, OIDC, REUSE */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Secrets, OIDC &amp; reusable workflows</h2>

          <h3>Secrets vs Variables</h3>
          <table>
            <tbody>
              <tr><th></th><th>Secrets</th><th>Variables</th></tr>
              <tr><td>Encrypted at rest</td><td>Yes</td><td>No</td></tr>
              <tr><td>Visible in logs</td><td>No (masked)</td><td>Yes</td></tr>
              <tr><td>Use for</td><td>API keys, passwords</td><td>Config like deploy URLs, feature flags</td></tr>
            </tbody>
          </table>

          <CodePre>{`gh secret set AZURE_CREDENTIALS < creds.json
gh secret list
gh secret delete OLD_SECRET`}</CodePre>

          <h3>Environments with protection rules</h3>
          <p>Per-environment: required reviewers, wait timer, deployment branches, environment secrets.</p>

          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Workflow triggered] --> B[Reaches 'environment: production' step]
    B --> C{Reviewer required?}
    C -->|Yes| D[Pause, request approval]
    D --> E{Approved?}
    E -->|Yes| F[Wait timer]
    E -->|No| X[Cancelled]
    C -->|No| F
    F --> G{Wait done?}
    G -->|Yes| H[Run with env secrets]
    H --> I[Deployed]`} />

          <CodePre>{`jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: \${{ secrets.API_KEY }}    # from environment, not repo`}</CodePre>

          <h3>OIDC authentication to cloud providers</h3>
          <p>OIDC lets GitHub Actions get a short-lived token from your cloud provider without storing long-lived secrets.</p>

          <MermaidDiagram theme="default" chart={`sequenceDiagram
    participant Workflow
    participant GitHub_IDP as GitHub OIDC Provider
    participant Azure_AD as Entra ID
    participant Azure_API
    Workflow->>GitHub_IDP: Request JWT (id-token: write)
    GitHub_IDP-->>Workflow: JWT with claims<br/>(repo, branch, etc.)
    Workflow->>Azure_AD: Exchange JWT for access token<br/>(azure/login@v2)
    Azure_AD->>Azure_AD: Verify JWT signature,<br/>check federated credential
    Azure_AD-->>Workflow: Access token
    Workflow->>Azure_API: API call with access token
    Azure_API-->>Workflow: Response`} />

          <h4>Federated credential subject claims</h4>
          <CodePre>{`repo:OWNER/REPO:ref:refs/heads/BRANCH        # specific branch
repo:OWNER/REPO:pull_request                  # any PR
repo:OWNER/REPO:environment:NAME              # specific environment
repo:OWNER/REPO:ref:refs/tags/TAG_PATTERN    # specific tag pattern`}</CodePre>

          <p><strong>Most secure:</strong> scope to a specific environment + branch combination.</p>

          <h4>AWS, GCP analogs</h4>
          <CodePre>{`# AWS
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions
    aws-region: us-east-1

# GCP
- uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/.../locations/global/workloadIdentityPools/...
    service_account: github@project.iam.gserviceaccount.com`}</CodePre>

          <h3>Reusable workflows</h3>
          <CodePre>{`# .github/workflows/build.yml
name: Reusable Build
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: '20'
      run-tests:
        type: boolean
        default: true
    secrets:
      npm-token:
        required: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ inputs.node-version }}
      - run: npm ci
      - if: inputs.run-tests
        run: npm test`}</CodePre>

          <CodePre>{`# Caller
jobs:
  call-build:
    uses: ./.github/workflows/build.yml
    with:
      node-version: '20'
      run-tests: true
    secrets:
      npm-token: \${{ secrets.NPM_TOKEN }}

# Or from another repo:
jobs:
  call-build:
    uses: USER/shared-workflows/.github/workflows/build.yml@main`}</CodePre>

          <h3>Composite actions</h3>
          <CodePre>{`# .github/actions/setup/action.yml
name: Setup
description: Common setup for our repos
inputs:
  node-version:
    default: '20'

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: \${{ inputs.node-version }}
        cache: 'npm'
    - shell: bash
      run: npm ci`}</CodePre>

          <table>
            <tbody>
              <tr><th></th><th>Reusable Workflow</th><th>Composite Action</th></tr>
              <tr><td>Granularity</td><td>Whole jobs</td><td>Steps</td></tr>
              <tr><td>Multiple jobs</td><td>Yes</td><td>No (one job context)</td></tr>
              <tr><td>Secrets handling</td><td>Explicit</td><td>Inherits from caller</td></tr>
              <tr><td>Use case</td><td>Multi-job pipelines</td><td>Common step sequences</td></tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 13 — SECURITY */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>Security</h2>

          <h3>Dependabot — automated updates</h3>
          <CodePre>{`# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    labels: ["dependencies"]
    groups:
      dev-dependencies:
        dependency-type: "development"
      production-dependencies:
        dependency-type: "production"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"`}</CodePre>

          <p>Supported ecosystems: npm, pip, maven, gradle, gomod, cargo, nuget, composer, bundler, docker, terraform, github-actions, and many more.</p>

          <h4>Auto-merge Dependabot PRs (safe for minor/patch)</h4>
          <CodePre>{`# .github/workflows/dependabot-automerge.yml
name: Dependabot auto-merge
on: pull_request_target

permissions:
  contents: write
  pull-requests: write

jobs:
  automerge:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - uses: dependabot/fetch-metadata@v2
        id: meta
      - if: steps.meta.outputs.update-type != 'version-update:semver-major'
        run: gh pr review --approve "$PR_URL"
        env:
          PR_URL: \${{ github.event.pull_request.html_url }}
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      - if: steps.meta.outputs.update-type != 'version-update:semver-major'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: \${{ github.event.pull_request.html_url }}
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}</CodePre>

          <h3>Code Scanning (CodeQL)</h3>
          <p>Static analysis for security vulnerabilities. <strong>Free for public repos</strong>, paid (GHAS) for private.</p>

          <CodePre>{`# .github/workflows/codeql.yml
name: "CodeQL"
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 8 * * 1'

jobs:
  analyze:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    strategy:
      matrix:
        language: ['javascript-typescript']
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: \${{ matrix.language }}
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3`}</CodePre>

          <p>Code scanning accepts SARIF format from any tool: Semgrep, Snyk, SonarQube, ESLint security plugins.</p>

          <h3>Secret Scanning &amp; Push Protection</h3>
          <p>GitHub scans your code for accidentally-committed secrets (API keys, tokens, passwords).</p>
          <ul>
            <li><strong>Public repos:</strong> always on, free</li>
            <li><strong>Private repos:</strong> GHAS feature (paid) or free with trial</li>
          </ul>

          <h4>Push protection</h4>
          <p><strong>Settings → Code security → Push protection</strong>. Blocks pushes that contain detectable secrets <em>before</em> they hit the repo.</p>

          <MermaidDiagram theme="default" chart={`sequenceDiagram
    Developer->>Local: git commit (with secret)
    Developer->>GitHub: git push
    GitHub->>GitHub: Scan for secrets
    GitHub-->>Developer: Push blocked
    Note over Developer: Remove secret,<br/>amend commit, push again`} />

          <h4>SECURITY.md</h4>
          <CodePre>{`# Security Policy

## Supported Versions
| Version | Supported |
| --- | --- |
| 1.x | ✅ |
| < 1.0 | ❌ |

## Reporting a Vulnerability
Please email security@example.com. Do NOT open a public issue.
We will respond within 48 hours.`}</CodePre>

          <p>GitHub shows a "Report a vulnerability" button in your Security tab.</p>
        </section>

        {/* SECTION 14 — DISTRIBUTION */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Distribution &amp; publishing</h2>

          <h3>Releases, tags &amp; semver</h3>
          <CodePre>{`MAJOR.MINOR.PATCH
  │     │     └─ Bug fixes, no breaking changes
  │     └─ New features, backward compatible
  └─ Breaking changes`}</CodePre>

          <h4>Creating a release — CLI</h4>
          <CodePre>{`# Create tag locally
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0

# Create release
gh release create v1.0.0 --title "Version 1.0.0" --notes-file CHANGELOG.md

# With assets
gh release create v1.0.0 dist/installer.exe dist/installer.dmg \\
  --title "Version 1.0.0" --notes "First public release"

# Auto-generate release notes
gh release create v1.0.0 --generate-notes`}</CodePre>

          <h4>Auto-release on tag push</h4>
          <CodePre>{`# .github/workflows/release.yml
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm run build
      - uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
          files: |
            dist/installer.exe
            dist/installer.dmg`}</CodePre>

          <h4>release-please for conventional commits</h4>
          <p><a href="https://github.com/googleapis/release-please" target="_blank" rel="noreferrer">release-please</a> reads conventional commits and maintains a PR with the next version's changelog. When you merge that PR, it creates a tag + release.</p>

          <h3>GitHub Pages — static hosting</h3>
          <h4>Modern setup with Actions (recommended)</h4>
          <CodePre>{`# .github/workflows/pages.yml
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4`}</CodePre>

          <h4>User vs project pages</h4>
          <table>
            <tbody>
              <tr><th>Type</th><th>Repo</th><th>URL</th></tr>
              <tr><td>User page</td><td><code>USER/USER.github.io</code></td><td><code>https://USER.github.io</code></td></tr>
              <tr><td>Project page</td><td><code>USER/REPO</code></td><td><code>https://USER.github.io/REPO/</code></td></tr>
            </tbody>
          </table>

          <h3>GitHub Packages (npm, Docker, etc.)</h3>
          <h4>Docker images (GHCR)</h4>
          <CodePre>{`- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: \${{ github.actor }}
    password: \${{ secrets.GITHUB_TOKEN }}

- uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: |
      ghcr.io/USER/REPO:latest
      ghcr.io/USER/REPO:\${{ github.sha }}`}</CodePre>

          <p>Pull with <code>docker pull ghcr.io/USER/REPO:latest</code>. Free for public, free up to 500MB for private.</p>

          <h4>npm packages</h4>
          <CodePre>{`# .npmrc
@scope:registry=https://npm.pkg.github.com`}</CodePre>

          <CodePre>{`- uses: actions/setup-node@v4
  with:
    node-version: '20'
    registry-url: https://npm.pkg.github.com
- run: npm publish
  env:
    NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}`}</CodePre>
        </section>

        {/* SECTION 15 — DEV TOOLS */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>Developer tools</h2>

          <h3>GitHub CLI — power-user reference</h3>
          <h4>Auth</h4>
          <CodePre>{`gh auth login
gh auth status
gh auth refresh -s "admin:org"
gh auth token`}</CodePre>

          <h4>Repo</h4>
          <CodePre>{`gh repo create NAME [--public|--private] [--clone] [--add-readme]
gh repo clone OWNER/REPO
gh repo view OWNER/REPO --web
gh repo list [USER] [--visibility public]
gh repo fork OWNER/REPO --clone --remote
gh repo sync                                # sync your fork with upstream
gh repo edit --add-topic gamedev
gh repo archive
gh repo delete --yes`}</CodePre>

          <h4>PR</h4>
          <CodePre>{`gh pr create [--title T] [--body B] [--draft] [--base BRANCH]
gh pr list [--state open|closed|merged] [--author @me]
gh pr checkout N
gh pr diff N
gh pr checks N
gh pr review N [--approve|--request-changes|--comment] [--body B]
gh pr merge N [--squash|--merge|--rebase] [--auto] [--delete-branch]`}</CodePre>

          <h4>Workflow / Actions</h4>
          <CodePre>{`gh workflow list
gh workflow run WORKFLOW [--ref BRANCH] [-f input=value]

gh run list [--workflow WORKFLOW] [--branch main] [--limit 10]
gh run view RUN_ID [--log]
gh run watch RUN_ID                        # tail until complete
gh run rerun RUN_ID [--failed]
gh run download RUN_ID                     # download artifacts`}</CodePre>

          <h4>gh api — raw API access</h4>
          <CodePre>{`# REST
gh api user
gh api repos/USER/REPO
gh api repos/USER/REPO/issues --paginate
gh api user --jq '.login'

# GraphQL
gh api graphql -f query='
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      pullRequests(states: OPEN, first: 5) {
        nodes { number title author { login } }
      }
    }
  }' -f owner=USER -f name=REPO`}</CodePre>

          <h4>Handy extensions</h4>
          <CodePre>{`gh extension install dlvhdr/gh-dash         # dashboard TUI for PRs/issues
gh extension install github/gh-copilot      # Copilot CLI
gh extension install nektos/gh-act          # run actions locally`}</CodePre>

          <h3>Codespaces &amp; dev containers</h3>
          <p>Codespaces = cloud-hosted VS Code dev environment.</p>

          <CodePre>{`// .devcontainer/devcontainer.json
{
  "name": "MyApp Dev",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/azure-cli:1": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "postCreateCommand": "npm install",
  "forwardPorts": [3000, 5173]
}`}</CodePre>

          <p>Launch via <strong>Repo → Code → Codespaces → Create</strong> or <code>gh codespace create -r OWNER/REPO</code>.</p>
          <p><strong>Cost:</strong> 60 hours/month free on 2-core (Pro account). Beyond that: $0.18/hour (2-core), $0.36/hour (4-core).</p>

          <h3>GitHub search mastery</h3>
          <h4>Code search operators</h4>
          <CodePre>{`repo:USER/REPO
org:NAME
user:USER
language:typescript
filename:Dockerfile
path:src/
extension:yml
size:>10000

content:"specific string"
/regex pattern/`}</CodePre>

          <h4>Examples</h4>
          <CodePre>{`# Find a usage in your repos
org:USER useState language:tsx

# Find all workflow files
org:USER path:.github/workflows extension:yml

# Find TODOs
org:USER /TODO|FIXME/

# Find SQL injection-like patterns
org:USER /query.*\\+.*req\\./`}</CodePre>

          <h4>Issue/PR search</h4>
          <CodePre>{`is:issue is:open author:@me
is:pr is:open review-requested:@me
is:pr is:merged closed:>2024-01-01
is:pr label:bug
is:issue no:assignee`}</CodePre>

          <h4>gh search</h4>
          <CodePre>{`gh search repos "stars:>10000 language:rust"
gh search code "useState" --language tsx --owner USER
gh search issues "is:open author:@me"
gh search prs "is:merged author:@me"`}</CodePre>

          <h3>GitHub Apps vs OAuth Apps vs PATs</h3>
          <MermaidDiagram theme="default" chart={`flowchart TB
    A[Need API access] --> B{For one user<br/>or many?}
    B -->|One user| C{Personal automation?}
    C -->|Local scripts| D[Use gh CLI<br/>no setup]
    C -->|CI/CD| E[PAT in secret<br/>or OIDC]
    B -->|Many users| F{Acting AS users<br/>or with their permission?}
    F -->|As users| G[OAuth App]
    F -->|With permission,<br/>as the app| H[GitHub App<br/>RECOMMENDED]`} />

          <table>
            <tbody>
              <tr><th>Type</th><th>Acts as</th><th>Use for</th></tr>
              <tr><td><strong>PAT</strong></td><td>You</td><td>Personal scripts, CI/CD if OIDC isn't viable</td></tr>
              <tr><td><strong>OAuth App</strong></td><td>User who authorized it</td><td>Multi-user product where each user logs in with GitHub</td></tr>
              <tr><td><strong>GitHub App</strong></td><td>Itself (first-class identity)</td><td>Integrations, bots, ChatOps. Higher rate limits, per-repo permissions, own webhooks.</td></tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 16 — WORKFLOW RECIPES */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>Workflow recipes</h2>

          <h3>Solo developer — PR-based workflow with self-merge</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
    participant You
    participant Local
    participant GitHub
    participant CI
    You->>Local: gh issue create<br/>git switch -c feat/x
    You->>Local: code, commit
    You->>GitHub: git push
    You->>GitHub: gh pr create --draft
    GitHub->>CI: Trigger workflows
    CI-->>GitHub: Pass
    You->>GitHub: gh pr ready
    You->>GitHub: Self-review<br/>(reads own diff)
    You->>GitHub: gh pr merge --squash --delete-branch
    GitHub->>GitHub: main updated,<br/>deploy workflow runs`} />

          <h4>Setup checklist for a new project</h4>
          <CodePre>{`# 1. Create repo from template
gh repo create my-new-project --template USER/template --public --clone
cd my-new-project

# 2. Enable branch ruleset
gh api repos/USER/my-new-project/rulesets --method POST \\
  --field name="Protect main" \\
  --field target=branch \\
  --field enforcement=active \\
  --raw-field 'conditions={"ref_name":{"include":["refs/heads/main"],"exclude":[]}}' \\
  --raw-field 'rules=[{"type":"pull_request"},{"type":"deletion"},{"type":"non_fast_forward"}]'

# 3. Auto-delete merged branches
gh api repos/USER/my-new-project --method PATCH \\
  --field delete_branch_on_merge=true

# 4. Squash-only merge
gh api repos/USER/my-new-project --method PATCH \\
  --field allow_squash_merge=true \\
  --field allow_merge_commit=false \\
  --field allow_rebase_merge=false

# 5. Enable security features
gh api repos/USER/my-new-project/automated-security-fixes --method PUT
gh api repos/USER/my-new-project/vulnerability-alerts --method PUT`}</CodePre>

          <h4>Sync labels across all repos</h4>
          <CodePre>{`LABELS_REPO=USER/template-repo
for repo in $(gh repo list USER --json name -q '.[].name'); do
  echo "Syncing labels to $repo"
  gh label clone $LABELS_REPO --repo USER/$repo --force
done`}</CodePre>

          <h3>Migrating from direct-to-main to PR-based</h3>
          <h4>Step 1: Pick a pilot repo</h4>
          <p>Start with your most active project.</p>

          <h4>Step 2: Set up a ruleset (Evaluate mode first)</h4>
          <p>Use <strong>Evaluate</strong> enforcement initially — logs what would be blocked without actually blocking.</p>
          <CodePre>{`gh api repos/USER/REPO/rulesets \\
  --method POST \\
  --field name="Protect main (testing)" \\
  --field target=branch \\
  --field enforcement=evaluate \\
  --raw-field 'conditions={"ref_name":{"include":["~DEFAULT_BRANCH"],"exclude":[]}}' \\
  --raw-field 'rules=[{"type":"pull_request","parameters":{"required_approving_review_count":0}}]'`}</CodePre>

          <h4>Step 3: Try the new workflow for a week</h4>
          <CodePre>{`# Old way: (edit, commit, push to main)

# New way:
git switch -c feat/something
# ... edit, commit
git push -u origin feat/something
gh pr create --fill                           # uses commit msg as title/body
gh pr merge --squash --delete-branch --auto    # auto-merge when CI passes`}</CodePre>

          <h4>Step 4: Switch ruleset to Active</h4>
          <CodePre>{`RULESET_ID=$(gh api repos/USER/REPO/rulesets --jq '.[0].id')
gh api repos/USER/REPO/rulesets/$RULESET_ID \\
  --method PUT \\
  --field enforcement=active`}</CodePre>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Common stumbles.</strong> "I can't push directly anymore" — Yes! That's the point. <code>git switch -c</code> first. "CI is slow" — Cache deps, parallelize jobs, use <code>paths</code> filters to skip unrelated workflows. "Tiny typo fix, the PR feels excessive" — Keep yourself in the bypass list of the ruleset for emergencies, but make it the exception.</div>
          </div>

          <h3>Team workflows — CODEOWNERS, stacked PRs</h3>
          <h4>CODEOWNERS for auto-review</h4>
          <CodePre>{`# .github/CODEOWNERS
# Default owners
*                       @USER

# Frontend
/src/                   @USER @frontend-lead

# Infra
/.github/workflows/     @devops-team
/azure-infra/           @devops-team

# Docs
/Guides/                @tech-writer-team
*.md                    @tech-writer-team`}</CodePre>

          <p>Combined with "Require review from Code Owners" in branch protection, PRs auto-assign the right reviewers.</p>

          <h4>Stack of PRs (chained branches)</h4>
          <p>For a big change broken into reviewable pieces:</p>
          <CodePre>{`main ← refactor-step-1 ← refactor-step-2 ← refactor-step-3
        (PR #1)           (PR #2)            (PR #3)`}</CodePre>

          <p>Tools: graphite.dev, ghstack. Each PR is reviewed independently; merging cascades.</p>
        </section>

        {/* SECTION 17 — CHEAT SHEET & GLOSSARY */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">A</span>Cheat sheet &amp; glossary</h2>

          <h3>Daily commands</h3>
          <CodePre>{`# Status & sync
git status
git fetch
git pull --rebase

# Branch + work
git switch -c feat/x
git add . && git commit -m "feat: message"
git push -u origin feat/x

# PR
gh pr create --fill
gh pr checks
gh pr merge --squash --delete-branch

# Cleanup
git switch main && git pull
git branch -d feat/x

# Emergency recovery
git reflog                              # find lost work
git reset --hard HEAD@{N}               # recover
git stash                               # save WIP fast
git stash pop                           # restore
git revert COMMIT                       # safe undo
git restore .                           # discard unstaged

# gh power-ups
gh status                               # your dashboard
gh pr list --search "review-requested:@me"
gh run watch                            # tail latest workflow
gh browse                               # open in browser`}</CodePre>

          <h3>Glossary</h3>
          <table>
            <tbody>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td><strong>Branch</strong></td><td>Named pointer to a commit</td></tr>
              <tr><td><strong>Commit</strong></td><td>Snapshot of files at a point in time</td></tr>
              <tr><td><strong>HEAD</strong></td><td>Pointer to the current commit</td></tr>
              <tr><td><strong>Fast-forward</strong></td><td>A merge where target branch is an ancestor of source — no merge commit needed</td></tr>
              <tr><td><strong>Merge base</strong></td><td>Common ancestor of two branches</td></tr>
              <tr><td><strong>Rebase</strong></td><td>Replay commits on a different base</td></tr>
              <tr><td><strong>Cherry-pick</strong></td><td>Apply a specific commit elsewhere</td></tr>
              <tr><td><strong>Fork</strong></td><td>Server-side copy of a repo</td></tr>
              <tr><td><strong>Upstream</strong></td><td>The original repo a fork was made from</td></tr>
              <tr><td><strong>Origin</strong></td><td>Conventional name for the primary remote</td></tr>
              <tr><td><strong>PR / Pull Request</strong></td><td>A merge proposal with review attached</td></tr>
              <tr><td><strong>Status check</strong></td><td>An automated check (CI run) gating merging</td></tr>
              <tr><td><strong>Branch protection</strong></td><td>Older rule system limiting actions on branches</td></tr>
              <tr><td><strong>Ruleset</strong></td><td>Newer, more flexible rule system</td></tr>
              <tr><td><strong>Action</strong></td><td>A reusable workflow component</td></tr>
              <tr><td><strong>Workflow</strong></td><td>A YAML file defining an automation</td></tr>
              <tr><td><strong>Runner</strong></td><td>The machine that executes a job</td></tr>
              <tr><td><strong>CODEOWNERS</strong></td><td>File defining auto-reviewers per path</td></tr>
              <tr><td><strong>Webhook</strong></td><td>HTTP callback for GitHub events</td></tr>
              <tr><td><strong>OIDC</strong></td><td>OpenID Connect — passwordless auth from CI to clouds</td></tr>
              <tr><td><strong>GHAS</strong></td><td>GitHub Advanced Security (CodeQL, secret scanning for private repos)</td></tr>
              <tr><td><strong>Semver</strong></td><td>MAJOR.MINOR.PATCH versioning convention</td></tr>
              <tr><td><strong>Conventional Commits</strong></td><td>Commit message format enabling automation</td></tr>
            </tbody>
          </table>

          <h3>Recommended reading</h3>
          <h4>Official docs (bookmark these)</h4>
          <ul>
            <li><a href="https://docs.github.com/" target="_blank" rel="noreferrer">GitHub Docs</a> — searchable, comprehensive</li>
            <li><a href="https://docs.github.com/actions" target="_blank" rel="noreferrer">GitHub Actions docs</a></li>
            <li><a href="https://cli.github.com/manual/" target="_blank" rel="noreferrer">gh CLI manual</a></li>
            <li><a href="https://docs.github.com/rest" target="_blank" rel="noreferrer">GitHub REST API</a></li>
            <li><a href="https://docs.github.com/graphql" target="_blank" rel="noreferrer">GitHub GraphQL API</a></li>
            <li><a href="https://docs.github.com/webhooks" target="_blank" rel="noreferrer">GitHub Webhooks reference</a></li>
            <li><a href="https://docs.github.com/copilot" target="_blank" rel="noreferrer">GitHub Copilot docs</a></li>
          </ul>

          <h4>Books &amp; long reads</h4>
          <ul>
            <li><strong>Pro Git</strong> by Scott Chacon — <a href="https://git-scm.com/book/en/v2" target="_blank" rel="noreferrer">free online</a>. The canonical git book.</li>
            <li><strong>"A Successful Git Branching Model"</strong> by Vincent Driessen — describes Git Flow</li>
            <li><strong>"Trunk-Based Development"</strong> at <a href="https://trunkbaseddevelopment.com/" target="_blank" rel="noreferrer">trunkbaseddevelopment.com</a> — the modern counterargument</li>
          </ul>

          <h4>Tools worth learning</h4>
          <ul>
            <li><a href="https://github.com/jonas/tig" target="_blank" rel="noreferrer"><code>tig</code></a> — terminal git log/diff browser</li>
            <li><a href="https://github.com/jesseduffield/lazygit" target="_blank" rel="noreferrer"><code>lazygit</code></a> — TUI for git operations</li>
            <li><a href="https://github.com/dlvhdr/gh-dash" target="_blank" rel="noreferrer"><code>gh-dash</code></a> — TUI dashboard for PRs/issues</li>
            <li><a href="https://github.com/nektos/act" target="_blank" rel="noreferrer"><code>act</code></a> — run GitHub Actions locally</li>
            <li><a href="https://github.com/gitleaks/gitleaks" target="_blank" rel="noreferrer"><code>gitleaks</code></a> — scan for secrets locally before push</li>
          </ul>

          <hr />
          <h3>Closing thoughts</h3>
          <p>If you push directly to <code>main</code> today, the leap to Level 3 (PR-based, protected main, required CI) is the single biggest workflow upgrade you can make. Start with one repo. Set up a ruleset in <strong>Evaluate</strong> mode this week. Try the workflow for a week. Switch to Active. Repeat for other repos.</p>

          <p><strong>The single biggest mindset shift:</strong> Every change is a proposal, not an action. Even when you're the only one reviewing. The PR is documentation, the merge is a deliberate event, and <code>main</code> is always known-good.</p>
        </section>
      </main>
    </div>
  );
}
