import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',              icon: '🗺️' },
  { id: 's2',  num: '2',  title: 'Install & First Launch',    icon: '⬇️' },
  { id: 's3',  num: '3',  title: 'Your First Project',        icon: '🆕' },
  { id: 's4',  num: '4',  title: 'The Xcode UI Tour',         icon: '🧭' },
  { id: 's5',  num: '5',  title: 'All Five Navigators',       icon: '🗂️' },
  { id: 's6',  num: '6',  title: 'Running Your App',          icon: '▶️' },
  { id: 's7',  num: '7',  title: 'The Editor In Depth',       icon: '⌨️' },
  { id: 's8',  num: '8',  title: 'Debugging',                 icon: '🐛' },
  { id: 's9',  num: '9',  title: 'Project Anatomy',           icon: '📁' },
  { id: 's10', num: '10', title: 'Source Control',            icon: '🌿' },
  { id: 's11', num: '11', title: 'Swift Package Manager',     icon: '📦' },
  { id: 's12', num: '12', title: 'Asset Catalogs',            icon: '🎨' },
  { id: 's13', num: '13', title: 'Build Configs & Schemes',   icon: '⚙️' },
  { id: 's14', num: '14', title: 'Instruments & Profiling',   icon: '📊' },
  { id: 's15', num: '15', title: 'Testing with XCTest',       icon: '✅' },
  { id: 's16', num: '16', title: 'Capabilities & Signing',    icon: '🔑' },
  { id: 's17', num: '17', title: 'Documentation (DocC)',      icon: '📖' },
  { id: 's18', num: '18', title: 'Xcode Cloud & CI',          icon: '☁️' },
  { id: 's19', num: '19', title: 'Editor Power Features',     icon: '⚡' },
  { id: 's20', num: '20', title: 'Settings & Comfort',        icon: '🛋️' },
  { id: 's21', num: '?',  title: 'Troubleshooting',           icon: '🩺' },
  { id: 's22', num: '✦',  title: 'Cheat Sheet',               icon: '📋' },
  { id: 's23', num: '23', title: 'Build System Deep Dive',    icon: '🏗️' },
  { id: 's24', num: '24', title: 'Localization in Xcode',     icon: '🌍' },
  { id: 's25', num: '25', title: 'Accessibility Inspector',   icon: '♿' },
  { id: 's26', num: '26', title: 'Refactoring Tools',         icon: '🔧' },
  { id: 's27', num: '27', title: 'Multi-Platform Projects',   icon: '🖥️' },
  { id: 's28', num: '28', title: 'Code Review Workflow',      icon: '👁️' },
  { id: 's29', num: '29', title: 'Environment Overrides',     icon: '🎛️' },
  { id: 's30', num: '30', title: 'Previews Deep Dive',        icon: '🖼️' },
  { id: 's31', num: '31', title: 'Swift Macros in Xcode',    icon: '🔮' },
  { id: 's32', num: '32', title: 'Organizer & Crash Reports',icon: '📉' },
  { id: 's33', num: '33', title: 'Workspaces & Modules',     icon: '🏛️' },
  { id: 's34', num: '34', title: 'Swift Error Messages',      icon: '🆘' },
  { id: 's35', num: '35', title: 'Xcode 16 Features',         icon: '✨' },
  { id: 's36', num: '36', title: 'Advanced Debugging',        icon: '🔬' },
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

function Note({ children, kind = 'info' }: { children: React.ReactNode; kind?: 'info' | 'warn' | 'good' }) {
  const icon = kind === 'warn' ? '⚠️' : kind === 'good' ? '✅' : '💡';
  const cls = kind === 'warn' ? 'warn' : kind === 'good' ? 'good' : 'info';
  return (
    <div className={`alert ${cls}`}>
      <span className="alert-icon">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export default function XcodeBeginnersGuide() {
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
            <span className="sidebar-title">Xcode for Beginners</span>
          </div>
          <div className="sidebar-sub">Your first Mac IDE — complete guide</div>
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
          <div className="hero-tag">🛠️ Xcode Complete Guide · 2026</div>
          <h1>Xcode for Beginners<br />(never opened it before)</h1>
          <p>
            This guide is for someone who just got a Mac and has <strong style={{ color: '#C77AA0' }}>never used
            Xcode</strong>. No assumptions: we install it, sign in, create a project, tour every panel, debug, add
            packages, profile performance, write tests, and wire up CI. By the end the buttons stop being
            mysterious and you can find your way around any Xcode project.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">$0</span><span className="hero-stat-label">Free to start</span></div>
            <div className="hero-stat"><span className="hero-stat-val">22</span><span className="hero-stat-label">Sections</span></div>
            <div className="hero-stat"><span className="hero-stat-val">⌘R</span><span className="hero-stat-label">Build &amp; run</span></div>
            <div className="hero-stat"><span className="hero-stat-val">Sim</span><span className="hero-stat-label">No phone needed</span></div>
          </div>
        </div>

        {/* ─── SECTION 1 ─── */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Three words get thrown around constantly. Pin them down first:
          </p>
          <ul>
            <li><strong>Xcode</strong> — Apple's free IDE ("integrated development environment"). Think Microsoft
              Word, but instead of writing documents you write apps. One window bundles a code editor, a live
              preview canvas, a fake iPhone to test on, a debugger, a version-control panel, and the compiler
              that turns your Swift code into an actual <code>.app</code> file.</li>
            <li><strong>A project</strong> — the folder Xcode creates for one app. It holds your code files,
              images, icons, and settings. You open the <em>project</em> (the <code>.xcodeproj</code> file), not
              individual source files.</li>
            <li><strong>An app</strong> — what your project compiles into: the thing that appears on a home
              screen. While you're building, you run it on a <em>Simulator</em> (a fake iPhone inside a window
              on your Mac). No phone needed until you're ready to test on a real device.</li>
          </ul>

          <h3>The big workflow loop</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  EDIT[Edit code in Xcode] --> BUILD[⌘R: Xcode compiles]
  BUILD --> RUN[App runs in Simulator]
  RUN --> OBSERVE[See what happened]
  OBSERVE --> EDIT`} />

          <h3>Quick Mac orientation</h3>
          <p>If the Mac itself is new to you, these five facts save a lot of confusion:</p>
          <table>
            <tbody>
              <tr><th>Thing</th><th>What it is</th><th>How to open</th></tr>
              <tr><td><strong>Menu bar</strong></td><td>The strip at the very top of the screen. Changes to match the app you're using. Xcode's menus (File, Edit, Product…) live there, not inside the window.</td><td>Always visible</td></tr>
              <tr><td><strong>Finder</strong></td><td>The Mac's file browser. Your projects are folders you can open in Finder.</td><td>Smiling-face icon in the Dock</td></tr>
              <tr><td><strong>Spotlight</strong></td><td>Search the whole Mac. Type "Xcode" to launch it. Fastest way to open anything.</td><td><code>⌘ Space</code></td></tr>
              <tr><td><strong>Dock</strong></td><td>Row of icons at the bottom. Drag Xcode there once installed for one-click access.</td><td>Always visible at bottom</td></tr>
              <tr><td><strong>Terminal</strong></td><td>A text-based shell. You'll use it occasionally for Swift Package Manager and Git commands.</td><td>Spotlight → "Terminal"</td></tr>
            </tbody>
          </table>

          <h3>Keyboard symbols — Xcode uses these everywhere</h3>
          <table>
            <tbody>
              <tr><th>Symbol</th><th>Key</th><th>On PC keyboard</th></tr>
              <tr><td><code>⌘</code></td><td>Command</td><td>Closest to Windows key (but not the same)</td></tr>
              <tr><td><code>⌥</code></td><td>Option</td><td>Alt</td></tr>
              <tr><td><code>⌃</code></td><td>Control</td><td>Ctrl</td></tr>
              <tr><td><code>⇧</code></td><td>Shift</td><td>Shift</td></tr>
              <tr><td><code>↩</code></td><td>Return / Enter</td><td>Enter</td></tr>
              <tr><td><code>⌫</code></td><td>Delete</td><td>Backspace</td></tr>
            </tbody>
          </table>

          <Note>
            <strong>You don't need to know how to code yet.</strong> This guide is about the <em>tool</em>. You'll
            click buttons, run a starter app, and learn where everything lives. Writing your own code starts in
            the SwiftUI Fundamentals guide next door.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 2 ─── */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Install &amp; First Launch</h2>

          <h3>Step 1 — install Xcode from the Mac App Store</h3>
          <ol>
            <li>Open the <strong>App Store</strong> app (blue "A" icon in the Dock).</li>
            <li>Search <strong>Xcode</strong>. It's free, made by Apple. Click <strong>Get</strong> → <strong>Install</strong>.</li>
            <li>It's several gigabytes — allow 30–90 minutes depending on your connection. Let it finish completely before launching.</li>
          </ol>

          <Note kind="warn">
            Xcode requires a recent macOS version. If the App Store says your macOS is too old, update first:
            Apple menu → System Settings → General → Software Update. Then install Xcode.
          </Note>

          <h3>Step 2 — first launch: license + components</h3>
          <p>
            Launch Xcode (Spotlight → "Xcode"). The first launch asks you to <strong>agree to the license</strong>
            and then <strong>install additional components</strong> — approve both and enter your Mac password if
            prompted. This installs the "Command Line Tools" (the Swift compiler and related utilities Xcode needs).
            Wait for it to complete; the Welcome window appears when it's ready.
          </p>
          <p>
            If you ever need to reinstall the Command Line Tools later (e.g. after a macOS upgrade), run this in
            Terminal:
          </p>
          <CodePre>{`xcode-select --install`}</CodePre>

          <h3>Step 3 — set up your Apple ID in Xcode</h3>
          <p>
            An <strong>Apple ID</strong> is just your Apple account (the email you use for the App Store or iCloud).
            A free one lets you build and run apps on the Simulator and on your own iPhone. You only need the paid
            <strong> Apple Developer Program</strong> ($99/year) when you want to publish to the App Store.
          </p>
          <ol>
            <li>Xcode menu → <strong>Settings…</strong> (<code>⌘,</code>)</li>
            <li>Click the <strong>Accounts</strong> tab.</li>
            <li>Click the <strong>+</strong> at the bottom-left → <strong>Apple ID</strong> → sign in.</li>
            <li>Your name appears in the list. You'll see "Personal Team" — that's normal for a free account.</li>
          </ol>
          <p>
            Close Settings. Xcode can now sign apps so they run on the Simulator and your phone.
          </p>

          <h3>Checking your Xcode version</h3>
          <p>
            Xcode menu → <strong>About Xcode</strong>. The version number matters because new iOS features require
            a matching Xcode version. To check in Terminal:
          </p>
          <CodePre>{`xcodebuild -version
# Example output:
# Xcode 16.2
# Build version 16C5032a`}</CodePre>

          <h3>Installing simulators</h3>
          <p>
            Xcode ships with a few simulators. To add more device types: Xcode menu → <strong>Settings…</strong> →
            <strong> Platforms</strong> tab. Click the <strong>+</strong> at the bottom to download iOS, watchOS,
            tvOS, or visionOS simulators. Each is a separate download.
          </p>

          <Note kind="good">
            <strong>Keep Xcode updated.</strong> Apple releases new iOS versions every September. You need a
            compatible Xcode to submit apps targeting the new iOS. Enable auto-updates in the Mac App Store to
            stay current.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 3 ─── */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Your First Project</h2>

          <p>
            From the Welcome window click <strong>Create New Project…</strong> (or menu File → New → Project,
            <code> ⇧⌘N</code>). A template wizard appears.
          </p>

          <h3>Choose a template</h3>
          <p>
            Make sure <strong>iOS</strong> is selected at the top. Choose <strong>App</strong> and click
            <strong> Next</strong>. The "App" template is the blank slate — ignore Augmented Reality App, Game,
            Document App, and others until you know SwiftUI well.
          </p>

          <h3>Fill in the project options</h3>
          <table>
            <tbody>
              <tr><th>Field</th><th>What to enter</th><th>Why it matters</th></tr>
              <tr><td>Product Name</td><td><code>HelloXcode</code></td><td>Your app's display name. Letters and numbers only — no spaces for the first project.</td></tr>
              <tr><td>Team</td><td>Your Apple ID / Personal Team</td><td>Who signs the app. Required even for Simulator builds.</td></tr>
              <tr><td>Organization Identifier</td><td><code>com.yourname</code></td><td>A reverse-domain style id, like a website URL backwards. Unique to you.</td></tr>
              <tr><td>Bundle Identifier</td><td><em>auto-filled</em></td><td>Org id + Product Name = your app's permanent worldwide id. <strong>Cannot change after App Store submission.</strong></td></tr>
              <tr><td><strong>Interface</strong></td><td><strong>SwiftUI</strong></td><td>The modern declarative UI framework. Always pick this unless you need to maintain a legacy app.</td></tr>
              <tr><td><strong>Language</strong></td><td><strong>Swift</strong></td><td>Apple's modern programming language. The only choice for new apps.</td></tr>
              <tr><td>Storage</td><td>None</td><td>Core Data or SwiftData integration — skip for now.</td></tr>
              <tr><td>Include Tests</td><td>Optional</td><td>Adds test targets. Safe to check it — covered in §15.</td></tr>
            </tbody>
          </table>

          <Note kind="warn">
            The two critical settings: <strong>Interface = SwiftUI</strong> and <strong>Language = Swift</strong>.
            If you ever see "Storyboard" or "Objective-C" selected, change them — those are the legacy world and
            not what these guides teach.
          </Note>

          <h3>Save location</h3>
          <p>
            Click <strong>Next</strong>. Choose a location (Desktop or Documents folder is fine). There's a checkbox
            to <strong>Create Git repository on my Mac</strong> — check it. This gives you free undo history for your
            entire project without any extra setup. Then click <strong>Create</strong>.
          </p>
          <p>
            Xcode opens your project. You already have a complete, runnable iOS app — without writing a single line
            of code. The starter shows "Hello, world!" and that's intentional: confirm the tool chain works before
            writing your own code.
          </p>

          <h3>The starter files</h3>
          <p>In the left Navigator panel you'll see:</p>
          <ul>
            <li><code>HelloXcodeApp.swift</code> — the entry point. It says "start by showing ContentView." Rarely touched until you need multiple scenes or custom app-launch logic.</li>
            <li><code>ContentView.swift</code> — your first screen. This is where you'll do most early work.</li>
            <li><code>Assets.xcassets</code> — images, colors, and the app icon.</li>
            <li><code>Preview Content/</code> — assets used only in Xcode previews, not shipped in the app.</li>
          </ul>
        </section>

        <hr />

        {/* ─── SECTION 4 ─── */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The Xcode UI Tour</h2>
          <p>
            The window looks busy but it's just <strong>six areas</strong> around a central editor. Every panel is
            toggleable — nothing is lost, it's just hidden.
          </p>

          <MermaidDiagram theme="default" chart={`graph TB
  TB[Toolbar — Run · Stop · device picker · activity status]
  subgraph Body[" "]
    NAV[Navigator — LEFT<br/>your files / search / issues]
    ED[Editor — CENTER<br/>code you type]
    CAN[Canvas — RIGHT of editor<br/>live SwiftUI preview]
    INS[Inspectors — FAR RIGHT<br/>attributes panel]
  end
  DBG[Debug Area — BOTTOM — console output + variable viewer]
  TB --> Body
  NAV --- ED
  ED --- CAN
  CAN --- INS
  Body --> DBG`} />

          <table>
            <tbody>
              <tr><th>Area</th><th>Location</th><th>Purpose</th><th>Toggle shortcut</th></tr>
              <tr><td><strong>Toolbar</strong></td><td>Very top</td><td>▶ Run, ⏹ Stop, device picker, activity status ("Build Succeeded" / progress spinner)</td><td>View → Hide Toolbar</td></tr>
              <tr><td><strong>Navigator</strong></td><td>Left column</td><td>File tree and five other tabs (search, issues, breakpoints, etc.) — covered in §5</td><td><code>⌘0</code></td></tr>
              <tr><td><strong>Editor</strong></td><td>Center</td><td>Where you read and write code. Always visible — it's the core of the window.</td><td>N/A (always shown)</td></tr>
              <tr><td><strong>Canvas (Preview)</strong></td><td>Right of editor</td><td>Live SwiftUI preview, updates as you type. Only visible for SwiftUI files.</td><td><code>⌥⌘↩</code></td></tr>
              <tr><td><strong>Inspectors</strong></td><td>Far-right column</td><td>Context-sensitive settings: file info, SwiftUI attributes, help documentation</td><td><code>⌥⌘0</code></td></tr>
              <tr><td><strong>Debug Area</strong></td><td>Bottom</td><td>Console (print output), variable viewer, and debugger controls when app is running</td><td><code>⇧⌘Y</code></td></tr>
            </tbody>
          </table>

          <h3>The toolbar in detail</h3>
          <p>Left to right across the top toolbar:</p>
          <ul>
            <li><strong>Scheme picker</strong> (left side) — shows your app name and build configuration. Click it to switch between Debug and Release builds.</li>
            <li><strong>Run ▶ / Stop ⏹</strong> — build and launch or kill the running app.</li>
            <li><strong>Device picker</strong> (center) — choose which Simulator or connected device to run on. Click the device name to see a dropdown of all available simulators.</li>
            <li><strong>Activity viewer</strong> (center-right) — shows what Xcode is doing: "Building…", "Running HelloXcode", "Build Succeeded". Click it to see the full build log.</li>
            <li><strong>Panel toggles</strong> (far right, three rectangles) — toggle the Navigator, Inspectors, and Debug Area on/off.</li>
          </ul>

          <h3>If a panel disappears</h3>
          <p>
            Every panel has a show/hide button in the toolbar's far right. If your window ever "loses" a panel:
          </p>
          <ul>
            <li>Left Navigator: <code>⌘0</code></li>
            <li>Right Inspectors: <code>⌥⌘0</code></li>
            <li>Bottom Debug Area: <code>⇧⌘Y</code></li>
            <li>Canvas: <code>⌥⌘↩</code> (while a SwiftUI file is open)</li>
          </ul>

          <Note>
            The <strong>Canvas pauses</strong> when it detects a code error or after a timeout. A "Resume" button
            appears — click it or press <code>⌥⌘P</code>. It's normal for it to pause frequently while you're
            actively editing.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 5 ─── */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>All Five Navigators</h2>
          <p>
            The left Navigator panel has <strong>six tabs</strong> along its top edge. Each shows a different view
            of your project. Beginners use only the first one; knowing the rest saves huge amounts of time.
          </p>

          <table>
            <tbody>
              <tr><th>Tab</th><th>Icon</th><th>Shortcut</th><th>What it shows</th></tr>
              <tr>
                <td><strong>Project Navigator</strong></td>
                <td>📁 folder</td>
                <td><code>⌘1</code></td>
                <td>Your files and groups, exactly like a file browser. Click any file to open it. Right-click a group to add files, delete files, or create new files.</td>
              </tr>
              <tr>
                <td><strong>Source Control Navigator</strong></td>
                <td>🌿 branch</td>
                <td><code>⌘2</code></td>
                <td>Git history, branches, remotes, and changed files. Covered in §10.</td>
              </tr>
              <tr>
                <td><strong>Symbol Navigator</strong></td>
                <td>⬡ shape</td>
                <td><code>⌘3</code></td>
                <td>Every class, struct, function, and property across your whole project, listed alphabetically. Great for jumping to a function by name without knowing which file it's in.</td>
              </tr>
              <tr>
                <td><strong>Find Navigator</strong></td>
                <td>🔍 magnifier</td>
                <td><code>⌘4</code></td>
                <td>Project-wide search and replace. Supports plain text, regular expressions, and symbol search. Results show the file and line for every match.</td>
              </tr>
              <tr>
                <td><strong>Issue Navigator</strong></td>
                <td>⚠️ triangle</td>
                <td><code>⌘5</code></td>
                <td>Every compiler error and warning, grouped by file. Click any issue to jump directly to the problem line. Cleared automatically when the issue is fixed.</td>
              </tr>
              <tr>
                <td><strong>Test Navigator</strong></td>
                <td>✅ diamond</td>
                <td><code>⌘6</code></td>
                <td>All unit and UI tests, grouped by test class. Run individual tests or whole suites from here. Green check = passed, red X = failed.</td>
              </tr>
              <tr>
                <td><strong>Debug Navigator</strong></td>
                <td>🐛 bug</td>
                <td><code>⌘7</code></td>
                <td>Live CPU, memory, disk, and network gauges while your app runs. Click any gauge to open the related Instrument. Stack trace of the running threads appears here when paused at a breakpoint.</td>
              </tr>
              <tr>
                <td><strong>Breakpoint Navigator</strong></td>
                <td>⬡ arrow</td>
                <td><code>⌘8</code></td>
                <td>All breakpoints in your project listed in one place. Enable/disable individual breakpoints without hunting through files to find them. Right-click to add conditions or actions.</td>
              </tr>
              <tr>
                <td><strong>Report Navigator</strong></td>
                <td>💬 chat bubble</td>
                <td><code>⌘9</code></td>
                <td>History of every build, run, test, and profile session. Click any entry to see the full log — useful when a build failed and you want to read the raw compiler output.</td>
              </tr>
            </tbody>
          </table>

          <h3>Project-wide Find &amp; Replace</h3>
          <p>
            <code>⌘4</code> opens the Find Navigator. Use it to rename a function everywhere in the project, or to
            find all uses of a type. Switch the first dropdown from <strong>Text</strong> to <strong>Symbol</strong>
            to find actual code references (not just text matches in comments or strings).
          </p>
          <CodePre>{`# Keyboard shortcut to open Find Navigator:
⌘4

# Then choose:
Text → finds any text including comments and strings
Symbol → finds actual code references (better for renaming)
Regular Expression → for pattern searches`}</CodePre>

          <Note>
            <strong>Open Quickly</strong> (<code>⇧⌘O</code>) is different from the Find Navigator — it jumps to a
            single file or symbol by name instantly. It's the fastest way to navigate: type a few letters of any file
            or function name and press Enter to open it.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 6 ─── */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Running Your App</h2>

          <h3>Pick where it runs</h3>
          <p>
            In the toolbar, the <strong>device picker</strong> reads something like <strong>HelloXcode &gt; iPhone 16</strong>.
            Click the device half and choose any iPhone Simulator. The first time you run a Simulator it takes a
            minute to boot — subsequent launches are instant because the Simulator stays warmed up in the background.
          </p>

          <h3>Build and run</h3>
          <p>
            Press <strong>▶ Run</strong> or <code>⌘R</code>. Xcode compiles your code and installs it on the
            Simulator. A phone-shaped window opens showing "Hello, world!". Press <strong>⏹ Stop</strong>
            (<code>⌘.</code>) to end it.
          </p>

          <h3>Driving the Simulator</h3>
          <table>
            <tbody>
              <tr><th>Gesture</th><th>How to do it on Mac</th></tr>
              <tr><td>Tap</td><td>Click with the mouse</td></tr>
              <tr><td>Swipe</td><td>Click and drag</td></tr>
              <tr><td>Scroll</td><td>Two-finger scroll on trackpad, or scroll wheel on mouse</td></tr>
              <tr><td>Pinch to zoom</td><td>Hold <code>⌥</code> and move the mouse (shows two circles)</td></tr>
              <tr><td>Home button / gesture</td><td><code>⇧⌘H</code></td></tr>
              <tr><td>Rotate to landscape</td><td>Device menu → Rotate Left/Right, or <code>⌘←</code> / <code>⌘→</code></td></tr>
              <tr><td>Lock screen</td><td><code>⌘L</code></td></tr>
              <tr><td>Take screenshot</td><td><code>⌘S</code> inside the Simulator window</td></tr>
              <tr><td>Hardware keyboard</td><td>I/O menu → Keyboard → Connect Hardware Keyboard</td></tr>
            </tbody>
          </table>

          <h3>Live Preview vs the Simulator — when to use each</h3>
          <p>
            For SwiftUI files, the <strong>Canvas</strong> (§4) shows a live preview that updates <em>as you type</em>
            — no build needed. The <strong>Simulator</strong> runs the full compiled app with real behavior. Use them
            for different things:
          </p>
          <table>
            <tbody>
              <tr><th>Use Canvas for</th><th>Use Simulator for</th></tr>
              <tr><td>Tweaking layout and styling</td><td>Testing navigation between screens</td></tr>
              <tr><td>Checking dark mode, font sizes</td><td>Testing gestures and animations</td></tr>
              <tr><td>Fast iteration on one view</td><td>Testing real network calls and data</td></tr>
              <tr><td>Trying different device sizes</td><td>Testing launch, background, and foreground transitions</td></tr>
              <tr><td>No waiting for compilation</td><td>Testing camera, location, push notifications</td></tr>
            </tbody>
          </table>

          <h3>Running on a real iPhone</h3>
          <p>
            Connect your iPhone with a USB cable. It appears in the device picker under your iPhone's name. Select it
            and press <code>⌘R</code>. The first time you run on a real device, iOS shows an "Untrusted Developer"
            alert on the phone. On the phone go to: Settings → General → VPN &amp; Device Management → tap your Apple
            ID email → Trust. After that, apps from your account install without that prompt.
          </p>

          <Note>
            When the Simulator is slow to respond, it's usually not your code — it's the Mac CPU running both the
            host OS and a simulated ARM chip simultaneously. Closing other apps helps. The first launch after a Mac
            restart is always the slowest.
          </Note>

          <h3>Build-only vs run</h3>
          <p>
            <code>⌘B</code> compiles the code without launching anything — useful for checking for errors quickly
            without waiting for the Simulator to boot. <code>⌘R</code> does everything: compile, install, run. Use
            <code>⌘B</code> during heavy editing sessions to catch errors early.
          </p>

          <h3>Product menu essentials</h3>
          <ul>
            <li><strong>Product → Run</strong> (<code>⌘R</code>) — build and run</li>
            <li><strong>Product → Build</strong> (<code>⌘B</code>) — compile only</li>
            <li><strong>Product → Clean Build Folder</strong> (<code>⇧⌘K</code>) — delete all compiled artifacts and start fresh. Use when builds behave strangely.</li>
            <li><strong>Product → Analyze</strong> — static analysis: finds logic bugs the compiler can't catch, like using a variable before setting it.</li>
            <li><strong>Product → Archive</strong> — creates a release build for App Store submission or TestFlight. Requires a paid Apple Developer account.</li>
          </ul>
        </section>

        <hr />

        {/* ─── SECTION 7 ─── */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>The Editor In Depth</h2>

          <h3>Autocomplete</h3>
          <p>
            As you type, Xcode shows a dropdown of suggestions. Press <code>↩</code> or <code>Tab</code> to accept
            the highlighted suggestion. Press <code>Esc</code> to dismiss. You can also scroll through suggestions
            with <code>↑</code> / <code>↓</code>.
          </p>
          <p>
            Autocomplete shows the <strong>type signature</strong> of each suggestion in the right column — including
            what arguments a function takes and what it returns. This is how you explore an unfamiliar API without
            memorizing it.
          </p>

          <h3>Placeholders</h3>
          <p>
            When you accept a suggestion that needs arguments, Xcode inserts blue "placeholder" bubbles:
            <code> someFunction(&lt;#argument#&gt;)</code>. These are stand-ins you tab into and replace. Press
            <code> Tab</code> to jump to the next placeholder. Click a placeholder to select it, then type to
            replace it.
          </p>

          <h3>Quick Help — ⌥-click anything</h3>
          <p>
            Hold <code>⌥</code> (Option) and click any symbol to see a popover with its documentation: what it
            is, what parameters it takes, what it returns, and an example. This is the fastest way to understand
            an unfamiliar part of the framework.
          </p>
          <p>
            For more: hold <code>⌥</code> and double-click to open the full documentation in the Documentation
            window. Or open Documentation directly: Help → Developer Documentation (<code>⇧⌘0</code>).
          </p>

          <h3>Jump to definition — ⌘-click</h3>
          <p>
            Hold <code>⌘</code> and click any symbol to jump to where it's defined — either in your own code or
            in Apple's SDK (shown as a generated header). Press <code>⌃⌘←</code> to navigate back.
          </p>

          <h3>Code folding</h3>
          <p>
            Hover over the gutter (left margin) to see fold triangles next to blocks. Click the triangle to collapse
            a function, type, or block to a single line. This is essential when working in large files. Enable the
            Code Folding Ribbon in Settings → Text Editing → Display for a persistent fold gutter.
          </p>

          <h3>Multi-cursor editing</h3>
          <p>
            Hold <code>⌃⇧</code> and click to place multiple cursors. Then type and all cursors move together —
            perfect for renaming something in several nearby places at once. Or hold <code>⌥</code> and drag
            vertically to create a column selection.
          </p>

          <h3>Re-indent selected code</h3>
          <CodePre>{`# Select code (⌘A for all), then:
⌃I   → Re-indent selection

# Fix import order (Editor menu):
Editor → Structure → Sort lines`}</CodePre>

          <h3>Refactoring</h3>
          <p>
            Right-click any function or variable name → <strong>Refactor</strong>. Options include:
          </p>
          <ul>
            <li><strong>Rename</strong> — renames a symbol everywhere it's used in the project, intelligently
              handling code, comments, and string literals separately. Much safer than find-and-replace.</li>
            <li><strong>Extract to Method</strong> — wraps selected code in a new function.</li>
            <li><strong>Extract to Variable</strong> — assigns a selected expression to a new local variable.</li>
          </ul>

          <h3>Code snippets</h3>
          <p>
            Type a few letters of a common pattern and press <code>↩</code> to insert a snippet. For example,
            type <code>for</code> and autocomplete offers <code>for...in</code> with placeholders. You can
            add your own: select code, drag it to the Snippets panel (right panel → <code>{'{ }'}</code>).
          </p>

          <h3>Errors and warnings</h3>
          <p>
            A <strong>red dot</strong> in the gutter = compiler error (won't build). A <strong>yellow triangle</strong>
            = warning (builds but something is suspicious). Click either to read the message. Xcode often offers a
            <strong> Fix-it</strong> button — a suggested auto-correction. Read it before clicking; Fix-its are
            usually right but always understand the cause.
          </p>

          <h3>Split editor</h3>
          <p>
            View two files side by side: hold <code>⌥</code> and click a file in the Navigator to open it in a
            split pane. Or drag a tab to the edge of the editor. Useful for reading a model file while editing a
            view that uses it.
          </p>

          <h3>Comparison / diff view</h3>
          <p>
            Right-click any file in the Navigator → <strong>Show File History</strong> to see a timeline of every
            commit that touched that file. Click a commit to see a side-by-side diff of what changed. Or, with
            Xcode's Source Control menu → <strong>Show Last Change For Line</strong> (inline blame).
          </p>
        </section>

        <hr />

        {/* ─── SECTION 8 ─── */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Debugging</h2>

          <h3>Tool 1 — print() — the simplest debugger</h3>
          <p>
            Put <code>print("got here")</code> in your code. It writes to the <strong>console</strong> (bottom Debug
            Area) when that line runs. This answers "did this code run?" and "what was the value?":
          </p>
          <CodePre>{`Button("Save") {
    print("Save tapped — name is: \\(name), count: \\(items.count)")
    save()
}`}</CodePre>
          <p>
            Run the app, trigger the action, and read the console. This is fast and works everywhere — even in code
            that's called before a view appears.
          </p>

          <h3>Tool 2 — breakpoints</h3>
          <p>
            Click in the <strong>gutter</strong> (the line-number margin) next to any line — a blue arrow
            (<strong>breakpoint</strong>) appears. When the app reaches that line while running, it <em>pauses</em>.
            The Debug Area shows every variable's current value. You can:
          </p>
          <ul>
            <li>Hover over any variable in the editor to see its current value in a popover.</li>
            <li>Read variables in the bottom-left pane of the Debug Area (the variable viewer).</li>
            <li>Press <strong>▶ Continue</strong> (<code>⌃⌘Y</code>) to resume.</li>
            <li>Press <strong>Step Over</strong> (<code>F6</code>) to execute the current line and pause on the next.</li>
            <li>Press <strong>Step Into</strong> (<code>F7</code>) to enter a function call and pause on its first line.</li>
            <li>Press <strong>Step Out</strong> (<code>F8</code>) to finish the current function and pause on its caller.</li>
          </ul>

          <h3>Conditional breakpoints</h3>
          <p>
            Right-click a breakpoint → <strong>Edit Breakpoint…</strong>. Add a <strong>Condition</strong> like
            <code> index == 5</code> to only pause when that's true — crucial when debugging loops that run hundreds
            of times.
          </p>

          <h3>Exception breakpoint — the most useful breakpoint</h3>
          <p>
            Add this once and leave it forever: in the Breakpoint Navigator (<code>⌘8</code>), click the
            <strong> +</strong> at the bottom → <strong>Exception Breakpoint</strong>. Now Xcode will pause at the
            exact line that causes a crash, rather than stopping somewhere deep in Apple's code.
          </p>

          <h3>LLDB — the debugger console</h3>
          <p>
            When paused at a breakpoint, the Debug Area bottom shows an <strong>(lldb)</strong> prompt. You can type
            commands to inspect and change your running app:
          </p>
          <CodePre>{`# Print a variable's value:
(lldb) po myVariable
(lldb) p items.count

# Print any expression:
(lldb) po userName.uppercased()

# Change a variable mid-run:
(lldb) expr count = 100

# Print the call stack:
(lldb) bt

# Continue execution:
(lldb) c

# Step over the next line:
(lldb) n`}</CodePre>

          <h3>Watchpoints — pause when a variable changes</h3>
          <p>
            While paused at a breakpoint, right-click a variable in the variable viewer → <strong>Watch</strong>.
            Xcode will pause any time that variable's value changes, no matter where in the code the change happens.
            Invaluable for "why does this variable have the wrong value?"
          </p>

          <h3>Memory Graph Debugger</h3>
          <p>
            While the app is running, click the <strong>memory graph icon</strong> in the Debug Area toolbar (it
            looks like a connected node diagram). Xcode pauses the app and shows every live object in memory as a
            graph. Use it to find:
          </p>
          <ul>
            <li><strong>Memory leaks</strong> — objects that should have been freed but weren't (purple leak badges).</li>
            <li><strong>Retain cycles</strong> — two objects keeping each other alive, preventing deallocation.</li>
          </ul>

          <h3>Thread Sanitizer and Address Sanitizer</h3>
          <p>
            Enable these in the Scheme editor (Product → Scheme → Edit Scheme → Diagnostics tab):
          </p>
          <ul>
            <li><strong>Address Sanitizer (ASan)</strong> — detects buffer overflows, use-after-free bugs. Slows the app but catches subtle memory corruption immediately.</li>
            <li><strong>Thread Sanitizer (TSan)</strong> — detects data races (two threads accessing the same memory without synchronization). Essential when using Swift concurrency.</li>
          </ul>

          <h3>Reading a crash</h3>
          <p>
            When the app stops on a red line: read the console message left to right. Common ones:
          </p>
          <table>
            <tbody>
              <tr><th>Message</th><th>Means</th></tr>
              <tr><td><code>unexpectedly found nil</code></td><td>You force-unwrapped an optional (<code>!</code>) that was nil. Use <code>if let</code> or <code>??</code> instead.</td></tr>
              <tr><td><code>Index out of range</code></td><td>You accessed an array at an index that doesn't exist (e.g. array[5] when only 3 elements).</td></tr>
              <tr><td><code>EXC_BAD_ACCESS</code></td><td>Accessing memory that's been freed or doesn't belong to your app. Enable Address Sanitizer to get a precise location.</td></tr>
              <tr><td><code>Thread 1: signal SIGABRT</code></td><td>An assertion failed or an exception was thrown. Add an Exception Breakpoint to catch it at the source line.</td></tr>
            </tbody>
          </table>

          <Note kind="warn">
            If Xcode stops on a highlighted line deep in Apple's own code, look at the <strong>call stack</strong>
            (left pane of Debug Area). Click the topmost entry that shows <em>your</em> file name — that's the line
            in your code that actually triggered the crash.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 9 ─── */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Project Anatomy</h2>

          <h3>What you see in the Navigator</h3>
          <table>
            <tbody>
              <tr><th>Item</th><th>Type</th><th>Purpose</th></tr>
              <tr><td>Blue icon at top</td><td>Project file (<code>.xcodeproj</code>)</td><td>Click to open Project Settings: app name, version, deployment target, capabilities, build settings.</td></tr>
              <tr><td>Yellow folder icons</td><td>Groups</td><td>Logical organization folders. By default, groups <em>do not</em> match folders on disk — they're just visual organization inside Xcode. Modern Xcode uses "folder references" that sync with the filesystem; you can convert groups to folders via right-click.</td></tr>
              <tr><td><code>.swift</code> files</td><td>Swift source</td><td>Your code. These compile into the app binary.</td></tr>
              <tr><td><code>.xcassets</code></td><td>Asset catalog</td><td>Images, colors, app icon. Double-click to open the catalog editor.</td></tr>
              <tr><td><code>Info.plist</code></td><td>Property list</td><td>App metadata: display name, supported orientations, privacy usage strings, URL schemes. In modern Xcode (15+) most of this is in the project settings rather than a separate file.</td></tr>
              <tr><td><code>Preview Content/</code></td><td>Group</td><td>Assets only used in Xcode canvas previews. Excluded from the App Store build.</td></tr>
            </tbody>
          </table>

          <h3>Targets</h3>
          <p>
            A <strong>target</strong> is one buildable product. A simple project has one target — your app. More
            complex projects have multiple targets:
          </p>
          <ul>
            <li><strong>App target</strong> — your main iOS app</li>
            <li><strong>Widget Extension target</strong> — the home-screen widget (separate binary)</li>
            <li><strong>Unit Test target</strong> — runs automated tests</li>
            <li><strong>UI Test target</strong> — drives the app via accessibility APIs</li>
            <li><strong>Watch App target</strong> — the Apple Watch companion</li>
          </ul>
          <p>
            Click the blue project icon → select a target in the left column to see its settings. The most important
            tabs:
          </p>
          <ul>
            <li><strong>General</strong> — display name, bundle ID, version, deployment target (minimum iOS version), supported devices, app icons.</li>
            <li><strong>Signing &amp; Capabilities</strong> — team, provisioning profile, and capability toggles (push notifications, iCloud, etc.).</li>
            <li><strong>Build Settings</strong> — hundreds of compiler and linker flags. You'll rarely touch this until you hit an advanced problem.</li>
            <li><strong>Build Phases</strong> — what actually happens during a build: compile sources, link libraries, copy resources. Add run-script phases here for things like SwiftGen or R.swift.</li>
          </ul>

          <h3>Where files live on disk</h3>
          <p>
            Right-click the blue project icon → <strong>Show in Finder</strong>. You'll see:
          </p>
          <CodePre>{`HelloXcode/
├── HelloXcode.xcodeproj/        ← double-click to open in Xcode
│   └── project.pbxproj          ← the project file (don't hand-edit this)
├── HelloXcode/                  ← your source code
│   ├── HelloXcodeApp.swift
│   ├── ContentView.swift
│   └── Assets.xcassets/
└── HelloXcodeTests/             ← unit tests (if you checked the box)
    └── HelloXcodeTests.swift`}</CodePre>

          <Note kind="warn">
            Don't move, rename, or delete files in Finder while Xcode is open. Xcode tracks files internally — moving
            them in Finder breaks the reference. Always add, rename, and delete files <em>inside Xcode's Navigator</em>.
          </Note>

          <h3>Reopening a project</h3>
          <p>
            The fastest ways to reopen a project:
          </p>
          <ul>
            <li><strong>File → Open Recent</strong> — lists recent projects.</li>
            <li>Relaunch Xcode — it reopens the last project automatically.</li>
            <li>Double-click <code>HelloXcode.xcodeproj</code> in Finder.</li>
            <li>In Terminal: <code>open HelloXcode.xcodeproj</code></li>
          </ul>
        </section>

        <hr />

        {/* ─── SECTION 10 ─── */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Source Control in Xcode</h2>
          <p>
            Xcode has a full Git client built in. You don't need to use the Terminal for day-to-day Git operations —
            commit, push, pull, branches, and merge conflicts all have UI surfaces.
          </p>

          <h3>The Source Control Navigator</h3>
          <p>
            Press <code>⌘2</code> to open it. You'll see:
          </p>
          <ul>
            <li><strong>Repositories</strong> — your local repo and any remotes (GitHub, Bitbucket, etc.).</li>
            <li><strong>Branches</strong> — all local and remote branches. The current branch has a checkmark.</li>
            <li><strong>Tags</strong> — Git tags (version markers).</li>
            <li><strong>Changes</strong> — files that have changed since the last commit (the "working tree").</li>
          </ul>

          <h3>Committing changes</h3>
          <ol>
            <li>Source Control menu → <strong>Commit…</strong> (or <code>⌥⌘C</code>).</li>
            <li>A diff view opens showing every changed file. Check/uncheck individual files to stage them.</li>
            <li>Within each file, you can right-click specific lines to exclude individual changes from the commit.</li>
            <li>Write a commit message in the text field at the bottom.</li>
            <li>Click <strong>Commit</strong>.</li>
          </ol>

          <h3>Connecting to GitHub</h3>
          <p>
            To push to a remote repository:
          </p>
          <ol>
            <li>Xcode menu → Settings → <strong>Accounts</strong> tab → <strong>+</strong> → <strong>GitHub</strong>.</li>
            <li>Sign in with your GitHub account (uses OAuth — no password stored in Xcode).</li>
            <li>Source Control menu → <strong>New "HelloXcode" Remote…</strong> to create a GitHub repo and push at the same time.</li>
          </ol>

          <h3>Push, pull, fetch</h3>
          <ul>
            <li><strong>Push</strong> — Source Control → Push (<code>⌥⌘X</code>) — sends your local commits to the remote.</li>
            <li><strong>Pull</strong> — Source Control → Pull — fetches and merges remote changes into your current branch.</li>
            <li><strong>Fetch</strong> — downloads remote changes without merging. Useful to see what's changed before you're ready to merge.</li>
          </ul>

          <h3>Branches</h3>
          <p>
            Branches let you try something experimental without touching your working code. Create a branch in the
            Source Control Navigator: right-click the current branch → <strong>New Branch from "main"…</strong>.
            Name it <code>feature/new-button</code>. Switch branches by double-clicking a branch name in the navigator.
          </p>
          <p>
            When you're happy with the feature: Source Control → <strong>Merge "feature/new-button" into "main"…</strong>.
            Xcode shows a side-by-side merge view for any conflicts.
          </p>

          <h3>Inline Git annotations</h3>
          <p>
            In the editor, every line that changed since the last commit shows a <strong>colored stripe</strong> in the
            gutter (green = added, yellow = modified). Click the stripe to see the diff for that hunk. Source Control →
            <strong> Show Last Change For Line</strong> shows an inline blame annotation (who changed it and when).
          </p>

          <h3>Comparing versions with the Compare editor</h3>
          <p>
            Right-click any file in the Navigator → <strong>Show File History</strong>. Click any commit to see a
            side-by-side diff. Very useful for "what changed between these two versions?"
          </p>

          <Note>
            <strong>Best practice:</strong> commit small and often. One logical change per commit, with a message
            that describes <em>why</em> (not just what). "Fix crash when recipe list is empty" is a good commit
            message. "changes" is not.
          </Note>

          <h3>The <code>.gitignore</code> file</h3>
          <p>
            Xcode auto-generates a <code>.gitignore</code> that excludes build artifacts, DerivedData, and user
            settings. You should also add any <code>.env</code> files with secrets. The standard iOS/Swift
            <code>.gitignore</code> from <a href="https://www.gitignore.io" target="_blank" rel="noreferrer">gitignore.io</a> is
            a good starting point.
          </p>
        </section>

        <hr />

        {/* ─── SECTION 11 ─── */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Swift Package Manager</h2>
          <p>
            Swift Package Manager (SPM) is Apple's built-in dependency manager — like npm for Swift. It lets you add
            third-party libraries to your project with no extra tools. You add packages directly inside Xcode.
          </p>

          <h3>Adding a package</h3>
          <ol>
            <li>File → <strong>Add Package Dependencies…</strong></li>
            <li>Paste the GitHub URL of the package you want (e.g. <code>https://github.com/apple/swift-algorithms</code>).</li>
            <li>Xcode fetches the package and shows version options.</li>
            <li>Choose a version rule:
              <ul>
                <li><strong>Up to Next Major</strong> — accepts updates within the same major version. Safe default for most packages.</li>
                <li><strong>Up to Next Minor</strong> — more conservative; only patch updates.</li>
                <li><strong>Exact</strong> — pin to one specific version. Use when you need reproducible builds.</li>
              </ul>
            </li>
            <li>Click <strong>Add Package</strong>. Xcode resolves and downloads it.</li>
            <li>In the next sheet, choose which <strong>target</strong> to add the library to (usually your app target).</li>
          </ol>

          <h3>Using the package in code</h3>
          <CodePre>{`// After adding a package, import it at the top of any file:
import SwiftAlgorithms

// The package's types and functions are now available:
let chunked = [1, 2, 3, 4, 5].chunks(ofCount: 2)`}</CodePre>

          <h3>Managing packages</h3>
          <p>
            Click the blue project icon → <strong>Package Dependencies</strong> tab. From here you can:
          </p>
          <ul>
            <li>See all packages and their resolved versions.</li>
            <li>Click a package → <strong>Update Package</strong> to pull a newer version.</li>
            <li>Select a package and press <code>⌫</code> to remove it.</li>
          </ul>
          <p>
            The package data is stored in <code>Package.resolved</code> (pinned versions) and
            <code> .package(url:…)</code> entries in your project file. Commit <code>Package.resolved</code> so all
            team members build against the exact same versions.
          </p>

          <h3>Popular packages to know</h3>
          <table>
            <tbody>
              <tr><th>Package</th><th>What it does</th><th>URL</th></tr>
              <tr><td>Alamofire</td><td>HTTP networking with a nice Swift API</td><td>github.com/Alamofire/Alamofire</td></tr>
              <tr><td>Kingfisher</td><td>Async image loading and caching</td><td>github.com/onevcat/Kingfisher</td></tr>
              <tr><td>SwiftyJSON</td><td>Friendlier JSON parsing</td><td>github.com/SwiftyJSON/SwiftyJSON</td></tr>
              <tr><td>Firebase iOS SDK</td><td>Analytics, Firestore, Auth, Cloud Messaging</td><td>github.com/firebase/firebase-ios-sdk</td></tr>
              <tr><td>Lottie</td><td>Airbnb's animation library (JSON animations)</td><td>github.com/airbnb/lottie-ios</td></tr>
              <tr><td>swift-collections</td><td>Apple's extra data structures (Deque, OrderedDict)</td><td>github.com/apple/swift-collections</td></tr>
              <tr><td>swift-algorithms</td><td>Apple's extra sequence algorithms</td><td>github.com/apple/swift-algorithms</td></tr>
            </tbody>
          </table>

          <h3>Creating your own package</h3>
          <p>
            File → New → Package… — creates a standalone Swift package. Useful when you want to share code between
            an app and a widget extension, or between two projects. The package has its own <code>Package.swift</code>
            manifest:
          </p>
          <CodePre>{`// Package.swift
import PackageDescription

let package = Package(
    name: "MySharedUtils",
    platforms: [.iOS(.v17)],
    products: [
        .library(name: "MySharedUtils", targets: ["MySharedUtils"]),
    ],
    targets: [
        .target(name: "MySharedUtils", path: "Sources/MySharedUtils"),
        .testTarget(name: "MySharedUtilsTests", dependencies: ["MySharedUtils"]),
    ]
)`}</CodePre>

          <Note>
            SPM replaced CocoaPods and Carthage for most new projects. If you find older tutorials using
            <code> pod install</code> or a <code>Cartfile</code>, those are the legacy equivalents. For new
            projects, use SPM unless a specific package isn't available there.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 12 ─── */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Asset Catalogs</h2>
          <p>
            An <strong>asset catalog</strong> (<code>.xcassets</code>) is Xcode's way of managing images, colors, icons,
            and other resources. Double-click <code>Assets.xcassets</code> in the Navigator to open the catalog editor.
          </p>

          <h3>Image sets</h3>
          <p>
            An image set holds one image in up to three resolutions: <strong>1x</strong>, <strong>2x</strong>, and
            <strong>3x</strong> (for Retina and Super Retina screens). Xcode picks the right one for the device
            automatically. Drag images from Finder into the appropriate slots.
          </p>
          <p>To add a new image set: click the <strong>+</strong> at the bottom-left of the catalog → Image Set. Name it, then drag your image files in.</p>
          <p>Use the image in SwiftUI:</p>
          <CodePre>{`Image("my-photo")          // looks up "my-photo" in Assets.xcassets
    .resizable()
    .scaledToFit()
    .frame(width: 200)`}</CodePre>

          <h3>Color sets</h3>
          <p>
            Color sets let you define colors that automatically adapt to Light Mode and Dark Mode. Create one: + →
            Color Set. Set the "Any Appearance" color, then switch to "Dark" appearance and set the dark version.
            SwiftUI picks the right one automatically.
          </p>
          <CodePre>{`Color("brand-primary")     // looks up a named color from the catalog
    .frame(maxWidth: .infinity)
    .frame(height: 60)`}</CodePre>

          <h3>The App Icon</h3>
          <p>
            Click <strong>AppIcon</strong> in the catalog. In Xcode 15+, you only need to provide a single
            <strong> 1024×1024 PNG</strong> and Xcode generates all sizes automatically. Drag your icon into the
            1024×1024 slot. Requirements:
          </p>
          <ul>
            <li>Exactly 1024 × 1024 pixels</li>
            <li>PNG format</li>
            <li>No transparency (alpha channel)</li>
            <li>No rounded corners — iOS rounds them automatically</li>
            <li>No text smaller than 12pt (it won't be readable at small sizes)</li>
          </ul>

          <h3>SF Symbols — Apple's built-in icon library</h3>
          <p>
            SF Symbols is a set of thousands of icons that Apple provides for free, designed to work perfectly with
            iOS at any size or weight. You reference them by name — no image files needed.
          </p>
          <CodePre>{`Image(systemName: "star.fill")          // filled star
Image(systemName: "arrow.right.circle") // arrow circle
Image(systemName: "person.crop.circle") // person silhouette

// Size and color follow the text context automatically:
Image(systemName: "heart.fill")
    .foregroundStyle(.red)
    .font(.system(size: 32))`}</CodePre>
          <p>
            Install the free <strong>SF Symbols</strong> app from Apple (search "SF Symbols" on the Mac App Store)
            to browse all icons, search by name, and copy the exact name to use in code.
          </p>

          <h3>Adaptive images — dark mode and device variants</h3>
          <p>
            In the Attributes Inspector (right panel) for any image set, you can add:
          </p>
          <ul>
            <li><strong>Appearance → Any, Dark</strong> — different images for light and dark mode</li>
            <li><strong>Width class / Height class</strong> — different images for compact vs regular size classes (phone vs iPad)</li>
            <li><strong>Gamut → sRGB, Display P3</strong> — wide-color images for newer iPhones</li>
          </ul>

          <h3>Data files in asset catalogs</h3>
          <p>
            You can store any binary file (JSON, CSV, audio, 3D models) as a <strong>Data Set</strong> in the catalog:
            + → Data Set. Access it at runtime:
          </p>
          <CodePre>{`// Load a JSON file stored as a Data Set:
let asset = NSDataAsset(name: "sample-data")!
let decoded = try! JSONDecoder().decode(MyModel.self, from: asset.data)`}</CodePre>
        </section>

        <hr />

        {/* ─── SECTION 13 ─── */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>Build Configurations &amp; Schemes</h2>

          <h3>Build configurations</h3>
          <p>
            Every project has at least two build configurations — different sets of build settings for different
            purposes:
          </p>
          <table>
            <tbody>
              <tr><th>Configuration</th><th>What changes</th><th>When used</th></tr>
              <tr><td><strong>Debug</strong></td><td>Optimizations off, debug symbols included, assertions active, Swift compiler runs in "debug" mode</td><td>Running in Simulator or during development on a device</td></tr>
              <tr><td><strong>Release</strong></td><td>Full compiler optimizations, debug symbols stripped (saved separately as dSYM), assertions disabled, binary is smaller and faster</td><td>App Store submission, TestFlight</td></tr>
            </tbody>
          </table>
          <p>
            You can create additional configurations: project settings → Info tab → + under Configurations.
            Common additions: "Staging" for a staging backend, "AdHoc" for internal testing builds.
          </p>

          <h3>Conditional compilation — different code per configuration</h3>
          <CodePre>{`#if DEBUG
let apiBase = "http://localhost:3001"
print("Debug mode — using local API")
#else
let apiBase = "https://api.myapp.com"
#endif

// You can also define custom flags in build settings:
// Build Settings → Swift Compiler - Custom Flags → Active Compilation Conditions
// Add "STAGING" to your Staging configuration, then:
#if STAGING
let apiBase = "https://staging.myapp.com"
#endif`}</CodePre>

          <h3>Schemes</h3>
          <p>
            A <strong>scheme</strong> is a saved set of decisions about how to build, run, test, profile, and archive
            your app. Each scheme specifies:
          </p>
          <ul>
            <li>Which target to build</li>
            <li>Which configuration to use for each action (Run uses Debug, Archive uses Release)</li>
            <li>Launch arguments and environment variables for the app</li>
            <li>Diagnostic options (ASan, TSan, Main Thread Checker)</li>
          </ul>
          <p>
            Edit a scheme: Product → Scheme → <strong>Edit Scheme…</strong>. The sidebar shows six actions:
            Build, Run, Test, Profile, Analyze, Archive.
          </p>

          <h3>Passing launch arguments</h3>
          <p>
            You can pass arguments to your app at launch without changing code — great for enabling feature flags or
            switching to a test backend: Product → Scheme → Edit Scheme → Run → <strong>Arguments</strong> tab →
            add items under "Arguments Passed On Launch" or "Environment Variables".
          </p>
          <CodePre>{`// Read an environment variable set in the scheme:
let isUITesting = ProcessInfo.processInfo.arguments.contains("UI_TESTING")
let serverURL = ProcessInfo.processInfo.environment["API_URL"] ?? "https://default.api.com"`}</CodePre>

          <h3>Multiple schemes</h3>
          <p>
            Large projects have one scheme per configuration: "MyApp (Debug)", "MyApp (Staging)", "MyApp (Release)".
            Switch between them in the toolbar's scheme picker. To create a new scheme: Product → Scheme →
            <strong> New Scheme…</strong>. Choose the target, then edit the new scheme to point each action to the
            right configuration.
          </p>

          <h3>Build settings deep dive</h3>
          <p>
            Build settings control every aspect of compilation. Common ones you'll encounter:
          </p>
          <table>
            <tbody>
              <tr><th>Setting</th><th>What it controls</th></tr>
              <tr><td>IPHONEOS_DEPLOYMENT_TARGET</td><td>Minimum iOS version your app supports. Setting this lower lets older devices install the app.</td></tr>
              <tr><td>SWIFT_VERSION</td><td>Which Swift language version to compile with (5.0, 5.9, 6.0).</td></tr>
              <tr><td>GCC_OPTIMIZATION_LEVEL</td><td>Compiler optimization level. -O0 (none) in Debug, -O (full) in Release.</td></tr>
              <tr><td>ENABLE_BITCODE</td><td>Legacy recompilation option. No longer needed for iOS 16+.</td></tr>
              <tr><td>PRODUCT_BUNDLE_IDENTIFIER</td><td>Your app's bundle ID. Overrideable per configuration to use different bundle IDs for Debug vs Release.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── SECTION 14 ─── */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Instruments &amp; Profiling</h2>
          <p>
            Instruments is a separate profiling app that ships with Xcode. It records what your app is doing over
            time — CPU usage, memory allocations, network calls, energy consumption — and shows it on a timeline.
            Launch it: Product → <strong>Profile</strong> (<code>⌘I</code>).
          </p>

          <Note>
            Always profile on a <strong>real device</strong> if possible. The Simulator runs on your Mac's CPU, not
            the A-series chip, and its performance characteristics are completely different.
          </Note>

          <h3>Choosing an instrument</h3>
          <p>
            A profiling template appears. The most important ones:
          </p>
          <table>
            <tbody>
              <tr><th>Template</th><th>Use it to find</th></tr>
              <tr><td><strong>Time Profiler</strong></td><td>Which functions are consuming the most CPU time. The go-to for "my app feels slow".</td></tr>
              <tr><td><strong>Allocations</strong></td><td>How much memory your app uses and what's allocating it. Find memory growth over time.</td></tr>
              <tr><td><strong>Leaks</strong></td><td>Objects that were allocated but never freed (memory leaks). Combines allocation tracking with leak detection.</td></tr>
              <tr><td><strong>Network</strong></td><td>Every HTTP/HTTPS request: timing, size, response codes. Find slow API calls.</td></tr>
              <tr><td><strong>Energy Log</strong></td><td>CPU, GPU, network, and location wake-ups that drain the battery.</td></tr>
              <tr><td><strong>SwiftUI</strong></td><td>Which SwiftUI views are re-rendering and how long each render takes.</td></tr>
              <tr><td><strong>Core Data</strong></td><td>Fetch requests, saves, and migrations with their SQL queries and timing.</td></tr>
            </tbody>
          </table>

          <h3>Using Time Profiler</h3>
          <ol>
            <li>Select Time Profiler and click <strong>Choose</strong>.</li>
            <li>Press <strong>Record</strong> (red button). Your app launches.</li>
            <li>Use the app the way a user would — exercise the slow path.</li>
            <li>Press <strong>Stop</strong>.</li>
            <li>In the bottom panel, expand the <strong>Call Tree</strong>. Check "Hide System Libraries" in the bottom-left filter bar to see only your code.</li>
            <li>The heaviest callers are at the top. Click any function to see its source file and line number. Double-click to open the source.</li>
          </ol>

          <h3>Interpreting the flame graph</h3>
          <p>
            Switch from "Call Tree" to "Profile" view using the dropdown. The flame graph shows time as a horizontal
            bar — wider = more CPU time. The function on the bottom called the one above it. Find the widest bar in
            your code (not system frameworks) — that's where optimization effort pays off.
          </p>

          <h3>Memory growth with Allocations</h3>
          <p>
            Record with Allocations while repeatedly doing the same action (e.g., navigating to a detail screen and
            back). If memory grows with each repetition and never shrinks, you have a retain cycle or a leak. The
            "Generations" feature (press <strong>Mark Generation</strong> at the start of a repetition) isolates
            exactly what was allocated in that cycle.
          </p>

          <h3>Reading the Instruments timeline</h3>
          <p>
            The main timeline area shows tracks for each data source. Zoom in with <code>⌥-scroll</code>. Option-drag
            to select a time range — the statistics panel below updates to show data for only that range. This lets you
            zoom in on a specific slow frame or a single button tap.
          </p>
        </section>

        <hr />

        {/* ─── SECTION 15 ─── */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>Testing with XCTest</h2>
          <p>
            Testing isn't optional for serious apps — it's what lets you refactor confidently and catch regressions
            before users do. Xcode uses <strong>XCTest</strong>, Apple's built-in testing framework.
          </p>

          <h3>Anatomy of a test file</h3>
          <CodePre>{`import XCTest
@testable import HelloXcode    // @testable gives tests access to internal members

final class RecipeTests: XCTestCase {

    // setUp runs before EACH test method
    override func setUp() {
        super.setUp()
        // reset state here
    }

    // tearDown runs after EACH test method
    override func tearDown() {
        super.tearDown()
        // cleanup here
    }

    // Test methods must start with "test"
    func testRecipeHasTitle() {
        let recipe = Recipe(title: "Pasta", ingredients: [])
        XCTAssertFalse(recipe.title.isEmpty, "title should not be empty")
    }

    func testEmptyIngredientsIsZero() {
        let recipe = Recipe(title: "Pasta", ingredients: [])
        XCTAssertEqual(recipe.ingredients.count, 0)
    }
}`}</CodePre>

          <h3>Running tests</h3>
          <ul>
            <li><strong>All tests:</strong> Product → Test (<code>⌘U</code>)</li>
            <li><strong>One test method:</strong> click the diamond icon in the gutter next to the function name</li>
            <li><strong>One test class:</strong> click the diamond next to the class declaration</li>
            <li><strong>From Test Navigator:</strong> <code>⌘6</code> → right-click any test → Run</li>
          </ul>

          <h3>Common XCTest assertions</h3>
          <CodePre>{`XCTAssertTrue(condition)
XCTAssertFalse(condition)
XCTAssertEqual(a, b)
XCTAssertNotEqual(a, b)
XCTAssertNil(value)
XCTAssertNotNil(value)
XCTAssertGreaterThan(a, b)
XCTAssertLessThanOrEqual(a, b)
XCTAssertThrowsError(try riskyFunction())
XCTAssertNoThrow(try safeFunction())`}</CodePre>

          <h3>Testing async code</h3>
          <CodePre>{`func testFetchRecipes() async throws {
    let service = RecipeService()
    let recipes = try await service.fetchAll()
    XCTAssertFalse(recipes.isEmpty, "should have at least one recipe")
    XCTAssertEqual(recipes.first?.title, "Pasta")
}`}</CodePre>

          <h3>UI Tests</h3>
          <p>
            UI tests drive the app via accessibility. Add a UI Test target (or check "Include Tests" when creating
            the project). UI tests run in a separate process and interact with the app as if a user were tapping:
          </p>
          <CodePre>{`import XCTest

final class AppUITests: XCTestCase {

    let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
    }

    func testAddButton() {
        // Find the "Add" button and tap it
        app.buttons["Add"].tap()

        // Assert a text field appeared
        XCTAssertTrue(app.textFields["Recipe Title"].exists)

        // Type into it
        app.textFields["Recipe Title"].typeText("Tacos")

        // Tap Save
        app.buttons["Save"].tap()

        // Assert "Tacos" appears in the list
        XCTAssertTrue(app.staticTexts["Tacos"].exists)
    }
}`}</CodePre>

          <h3>Test coverage</h3>
          <p>
            Edit Scheme → Test → Options → enable <strong>Code Coverage</strong>. After running tests, open the
            Report Navigator (<code>⌘9</code>) → click the latest test run → Coverage tab. Lines covered by tests
            are highlighted green; uncovered lines are red. A good coverage target for business logic is 70–80%.
          </p>

          <Note>
            Write tests for your <em>model and business logic</em> first — functions that calculate or transform data.
            Those are stable, fast to test, and high-value. Save UI tests for critical user flows (login, checkout).
            Don't obsess over 100% coverage; focus on confidence.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 16 ─── */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>Capabilities &amp; Signing</h2>

          <h3>What capabilities are</h3>
          <p>
            iOS apps are sandboxed — they can only access system features if they explicitly declare they need them.
            <strong> Capabilities</strong> are these declarations. You toggle them on in Xcode and Apple provisions
            the entitlements automatically when you're on a paid developer account.
          </p>
          <p>
            To add a capability: click the blue project icon → select your app target → <strong>Signing &amp;
            Capabilities</strong> tab → <strong>+ Capability</strong> button.
          </p>

          <h3>Common capabilities</h3>
          <table>
            <tbody>
              <tr><th>Capability</th><th>What it enables</th></tr>
              <tr><td>Push Notifications</td><td>Receive remote push notifications via APNs. Required for any app that sends notifications from a server.</td></tr>
              <tr><td>Sign In with Apple</td><td>The "Sign in with Apple" button. Required by App Store Review if you offer other third-party login options.</td></tr>
              <tr><td>iCloud</td><td>CloudKit (Apple's cloud database) and iCloud Documents sync.</td></tr>
              <tr><td>App Groups</td><td>Share data (UserDefaults, files) between your app and its extensions (widgets, share extensions).</td></tr>
              <tr><td>Background Modes</td><td>Lets the app run code while backgrounded: audio, location, VOIP, background fetch.</td></tr>
              <tr><td>HealthKit</td><td>Read and write health data with user permission.</td></tr>
              <tr><td>HomeKit</td><td>Control HomeKit-compatible smart home devices.</td></tr>
              <tr><td>Game Center</td><td>Leaderboards and achievements.</td></tr>
              <tr><td>In-App Purchase</td><td>Charge users for products and subscriptions within the app.</td></tr>
              <tr><td>Keychain Sharing</td><td>Share keychain items between multiple apps from the same developer.</td></tr>
              <tr><td>Maps</td><td>MapKit integration and directions.</td></tr>
              <tr><td>Network Extension</td><td>VPN and custom network protocols.</td></tr>
              <tr><td>Wallet</td><td>Add passes to the user's Apple Wallet.</td></tr>
            </tbody>
          </table>

          <h3>Privacy usage descriptions (Info.plist)</h3>
          <p>
            Before accessing sensitive data, your app must declare <em>why</em> it needs it in a usage description
            string. iOS shows this string in the permission alert. If the string is missing, the app crashes when it
            tries to access that resource. Add these in Project Settings → target → Info tab:
          </p>
          <table>
            <tbody>
              <tr><th>Key</th><th>Triggers permission alert for</th></tr>
              <tr><td>NSCameraUsageDescription</td><td>Camera access</td></tr>
              <tr><td>NSPhotoLibraryUsageDescription</td><td>Reading photos</td></tr>
              <tr><td>NSPhotoLibraryAddUsageDescription</td><td>Saving photos</td></tr>
              <tr><td>NSLocationWhenInUseUsageDescription</td><td>Location (while using the app)</td></tr>
              <tr><td>NSLocationAlwaysUsageDescription</td><td>Location (even when app is backgrounded)</td></tr>
              <tr><td>NSMicrophoneUsageDescription</td><td>Microphone</td></tr>
              <tr><td>NSContactsUsageDescription</td><td>Contacts</td></tr>
              <tr><td>NSCalendarsUsageDescription</td><td>Calendar events</td></tr>
              <tr><td>NSFaceIDUsageDescription</td><td>Face ID authentication</td></tr>
              <tr><td>NSBluetoothAlwaysUsageDescription</td><td>Bluetooth peripherals</td></tr>
            </tbody>
          </table>

          <h3>Understanding code signing</h3>
          <p>
            Code signing proves that an app came from a specific developer and hasn't been tampered with. Xcode handles
            this automatically with <strong>Automatic Signing</strong> enabled (the default). What each piece means:
          </p>
          <ul>
            <li><strong>Signing Certificate</strong> — a cryptographic credential that proves your identity. Xcode creates and manages this in your keychain.</li>
            <li><strong>Provisioning Profile</strong> — a file that ties together: your app's bundle ID, your certificate, and which devices (or "all devices" for the App Store) are allowed to run it.</li>
            <li><strong>Entitlements</strong> — the <code>.entitlements</code> file that lists which capabilities your app is allowed to use. Auto-managed when Automatic Signing is on.</li>
          </ul>

          <Note kind="good">
            With Automatic Signing enabled and your Apple ID connected, you almost never need to touch certificates or
            profiles manually. Xcode creates, renews, and rotates them for you. Only turn off Automatic Signing if you
            have a specific CI/CD reason.
          </Note>
        </section>

        <hr />

        {/* ─── SECTION 17 ─── */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">17</span>Documentation with DocC</h2>
          <p>
            DocC is Apple's documentation tool, built into Xcode 13+. It turns structured comments in your code
            into a searchable, web-hosted documentation site with the same look as Apple's own developer docs.
          </p>

          <h3>Writing doc comments</h3>
          <p>
            Use three slashes (<code>///</code>) for doc comments on any declaration. The first paragraph is the
            summary. Add sections with Markdown:
          </p>
          <CodePre>{`/// Calculates the tip amount for a bill.
///
/// This function takes a bill total and a tip percentage and returns
/// the tip amount as a currency-formatted string.
///
/// - Parameters:
///   - total: The pre-tip bill amount in dollars.
///   - percentage: The tip percentage as a decimal (e.g. 0.20 for 20%).
/// - Returns: A formatted string like "$8.40".
/// - Throws: \`TipError.negativeAmount\` if total is negative.
/// - Note: Does not include tax in the calculation.
/// - SeeAlso: \`calculateTotal(total:tipAmount:)\`
func calculateTip(total: Double, percentage: Double) throws -> String {
    guard total >= 0 else { throw TipError.negativeAmount }
    let tip = total * percentage
    return String(format: "$%.2f", tip)
}`}</CodePre>

          <h3>DocC catalog</h3>
          <p>
            For a full documentation site (with articles, tutorials, and a landing page), add a DocC catalog:
            File → New → File → Documentation Catalog. This creates a <code>.docc</code> folder with:
          </p>
          <ul>
            <li><code>GettingStarted.md</code> — a landing article</li>
            <li>Additional <code>.md</code> article files you write</li>
            <li>Tutorials written in a special DSL for step-by-step learning paths</li>
          </ul>

          <h3>Building and previewing docs</h3>
          <CodePre>{`# Build documentation for your target:
Product → Build Documentation (⌃⇧⌘D)

# This opens the Documentation window with your docs
# integrated into the Xcode dev docs browser.

# Export a static website (for hosting on GitHub Pages etc.):
Product → Build Documentation → then in the docs browser:
File → Export Documentation…`}</CodePre>

          <h3>Inline doc comment shortcut</h3>
          <p>
            Position your cursor on a function and press <code>⌥⌘/</code> — Xcode inserts a pre-filled doc comment
            stub with all parameters and return value already listed. Just fill in the descriptions.
          </p>
        </section>

        <hr />

        {/* ─── SECTION 18 ─── */}
        <section className="section" id="s18" ref={setRef('s18')}>
          <h2><span className="section-num">18</span>Xcode Cloud &amp; CI</h2>
          <p>
            Xcode Cloud is Apple's built-in CI/CD service. It runs in Apple's infrastructure: pull from GitHub,
            build, run tests, and distribute to TestFlight — automatically on every push. Requires an Apple Developer
            Program membership.
          </p>

          <h3>Setting up your first workflow</h3>
          <ol>
            <li>Product → Xcode Cloud → <strong>Create Workflow…</strong></li>
            <li>Xcode walks you through: connect your GitHub/GitLab/Bitbucket repo, set the start condition (push to main, PR opened, tag created), and choose actions.</li>
            <li>Actions available: <strong>Build</strong>, <strong>Test</strong>, <strong>Archive</strong>, <strong>Analyze</strong>.</li>
            <li>After Archive, add a <strong>Post-Action</strong>: TestFlight Internal Testing or TestFlight External Testing to automatically distribute the build.</li>
          </ol>

          <h3>Workflow YAML structure (reference)</h3>
          <CodePre>{`# Xcode Cloud workflows are configured in the UI, but the
# underlying structure is:
#
# Start Condition:
#   - Branch Changes: push to main
#   - Pull Request Changes: any PR opened or updated
#   - Tag Changes: any new tag
#
# Environment:
#   - Xcode version: 16.2
#   - macOS version: 15.x
#   - Environment variables (encrypted for secrets)
#
# Actions:
#   1. Build (always)
#   2. Test (runs unit + UI tests)
#   3. Archive (release build)
#
# Post-Actions:
#   - TestFlight: distribute to "Internal Testers" group`}</CodePre>

          <h3>Environment variables and secrets</h3>
          <p>
            Set environment variables in: Product → Xcode Cloud → Manage Workflows → your workflow → Environment.
            Mark sensitive values as <strong>Secret</strong> — they're encrypted and never visible in logs. Access
            them in your app the same way as scheme environment variables:
          </p>
          <CodePre>{`let apiKey = ProcessInfo.processInfo.environment["API_KEY"] ?? ""`}</CodePre>

          <h3>Xcode Cloud vs GitHub Actions</h3>
          <table>
            <tbody>
              <tr><th></th><th>Xcode Cloud</th><th>GitHub Actions</th></tr>
              <tr><td><strong>Setup</strong></td><td>GUI in Xcode, very easy</td><td>YAML file, more complex</td></tr>
              <tr><td><strong>macOS agents</strong></td><td>Apple's infrastructure, always current</td><td>Available but expensive</td></tr>
              <tr><td><strong>Cost</strong></td><td>Included with Apple Developer Program (limited minutes, then paid)</td><td>Free for public repos; paid for private + macOS minutes</td></tr>
              <tr><td><strong>TestFlight integration</strong></td><td>Built-in, one click</td><td>Requires fastlane or eas-cli setup</td></tr>
              <tr><td><strong>Customization</strong></td><td>Limited to Apple's actions</td><td>Any shell script, any tool</td></tr>
            </tbody>
          </table>

          <h3>Viewing build results</h3>
          <p>
            Product → Xcode Cloud → <strong>View Cloud Builds</strong>. Or in the Report Navigator (<code>⌘9</code>)
            — Xcode Cloud builds appear alongside local builds. Click any build to see the log, test results, and
            artifacts.
          </p>
        </section>

        <hr />

        {/* ─── SECTION 19 ─── */}
        <section className="section" id="s19" ref={setRef('s19')}>
          <h2><span className="section-num">19</span>Editor Power Features</h2>

          <h3>The minimap</h3>
          <p>
            A miniature view of the whole file appears on the right edge of the editor (View → Minimap, or the
            minimap button in the top-right of the editor area). Hover over it to see a zoomed label of that region.
            Click anywhere to jump there. Use it to quickly navigate 500-line files.
          </p>

          <h3>Mark comments — file navigation</h3>
          <CodePre>{`// MARK: - View Body
// MARK: Private Methods
// TODO: clean this up before shipping
// FIXME: crashes when list is empty

// MARK: creates a separator line in the function popup (⌃6)
// The ⌃6 jump bar lists all MARK sections in the current file`}</CodePre>

          <h3>The jump bar</h3>
          <p>
            At the top of the editor, a breadcrumb path shows the current file hierarchy. Click the last segment
            (the function name) to see a <strong>popup of all functions, types, and MARK sections</strong> in the
            file. Press <code>⌃6</code> to open it with keyboard focus, then type to filter.
          </p>

          <h3>Fix-its in bulk</h3>
          <p>
            After a build with errors, Editor → <strong>Fix All Issues</strong> applies all available Fix-its at
            once. Use carefully — review each change — but it's a big time-saver for things like "add required
            protocol conformances" or "apply try? where throws can be ignored."
          </p>

          <h3>Vim mode</h3>
          <p>
            If you know Vim, Xcode has a built-in Vim emulation mode: Xcode Settings → Text Editing → Editing →
            enable <strong>Vim keybindings</strong>. You get normal mode, insert mode, and the common Vim motions
            (hjkl, w/b/e, dd, yy, p, /, etc.). It's not a full Vim implementation but covers 90% of daily usage.
          </p>

          <h3>Custom key bindings</h3>
          <p>
            Xcode Settings → Key Bindings. Every menu item can be reassigned. If you're coming from VS Code, you
            can remap common actions:
          </p>
          <table>
            <tbody>
              <tr><th>VS Code shortcut</th><th>Xcode equivalent</th><th>Default</th></tr>
              <tr><td><code>⌘P</code> (Go to File)</td><td>Open Quickly</td><td><code>⇧⌘O</code></td></tr>
              <tr><td><code>⌘⇧F</code> (Find in files)</td><td>Find Navigator</td><td><code>⌘4</code> (then search)</td></tr>
              <tr><td><code>⌘D</code> (Select next occurrence)</td><td>Edit → Select Next Occurrence</td><td>No default, add one</td></tr>
              <tr><td><code>⌘/</code> (Toggle comment)</td><td>Same</td><td><code>⌘/</code></td></tr>
              <tr><td><code>F2</code> (Rename symbol)</td><td>Refactor → Rename</td><td>No default</td></tr>
            </tbody>
          </table>

          <h3>Code-folding keyboard shortcuts</h3>
          <CodePre>{`# Fold/unfold the current block:
⌥⌘← (fold)   ⌥⌘→ (unfold)

# Fold all methods and functions in the file:
⌥⇧⌘← (fold all)   ⌥⇧⌘→ (unfold all)

# Focus mode — hide everything except the function you're in:
Editor → Focus → Focus on current function`}</CodePre>

          <h3>Live Issues (real-time error checking)</h3>
          <p>
            Xcode checks your code in the background as you type, without needing a full build. Red underlines appear
            in the editor within seconds of typing a mistake. Enable this (it's on by default) in Settings → Text
            Editing → Editing → Show Live Issues.
          </p>

          <h3>Spell-checking strings</h3>
          <p>
            Edit → Format → Spelling and Grammar → <strong>Check Spelling While Typing</strong> underlines
            misspelled words inside string literals. Useful for catching typos in user-visible text.
          </p>
        </section>

        <hr />

        {/* ─── SECTION 20 ─── */}
        <section className="section" id="s20" ref={setRef('s20')}>
          <h2><span className="section-num">20</span>Settings &amp; Comfort</h2>
          <p>
            A few tweaks (Xcode menu → <strong>Settings…</strong>, <code>⌘,</code>) make Xcode significantly more
            pleasant to use every day.
          </p>

          <h3>Themes (editor appearance)</h3>
          <p>
            Settings → <strong>Themes</strong>. Each theme controls editor background, font, and syntax colors.
            Popular choices:
          </p>
          <ul>
            <li><strong>Default (Dark)</strong> — Xcode's dark mode theme, easy on the eyes</li>
            <li><strong>Presentation (Dark)</strong> — larger font, good for screen sharing</li>
            <li><strong>Classic (Light)</strong> — the original light theme</li>
          </ul>
          <p>
            Bump the <strong>font size</strong> up 1–2 points from the default. Your eyes spend hours in the editor;
            legibility matters more than fitting more lines on screen.
          </p>

          <h3>Text editing preferences</h3>
          <ul>
            <li><strong>Settings → Text Editing → Display:</strong> enable <strong>Line Numbers</strong> (error messages reference them), enable <strong>Code Folding Ribbon</strong> (fold gutter on the left).</li>
            <li><strong>Settings → Text Editing → Editing:</strong> keep <strong>Automatically trim trailing whitespace</strong> on. Enable <strong>Tab indents</strong> → set to 4 spaces (or 2 — be consistent with your team).</li>
            <li><strong>Settings → Text Editing → Indentation:</strong> "Prefer indent using: Spaces", width 4.</li>
          </ul>

          <h3>Behaviors</h3>
          <p>
            Settings → <strong>Behaviors</strong>. Controls what Xcode does automatically on events:
          </p>
          <ul>
            <li>Build Starts → Show the current tab without generating output (reduces noise)</li>
            <li>Build Fails → Show Issues Navigator (jumps straight to the errors)</li>
            <li>Run Starts → Show Debugger with Console and Variables views</li>
            <li>Pauses (breakpoint hit) → Show Debugger with all views</li>
          </ul>

          <h3>Derived Data location</h3>
          <p>
            Xcode stores all compiled artifacts in <code>~/Library/Developer/Xcode/DerivedData/</code>. This folder
            grows large over time. Periodically clean it: Xcode menu → Settings → Locations → click the arrow next
            to DerivedData → delete old project folders. You can also move it to an external drive if your Mac's SSD
            is getting full.
          </p>

          <h3>Essential shortcuts summary</h3>
          <table>
            <tbody>
              <tr><th>Action</th><th>Shortcut</th></tr>
              <tr><td>Build &amp; Run</td><td><code>⌘R</code></td></tr>
              <tr><td>Stop</td><td><code>⌘.</code></td></tr>
              <tr><td>Build only</td><td><code>⌘B</code></td></tr>
              <tr><td>Run tests</td><td><code>⌘U</code></td></tr>
              <tr><td>Clean Build Folder</td><td><code>⇧⌘K</code></td></tr>
              <tr><td>Open Quickly</td><td><code>⇧⌘O</code></td></tr>
              <tr><td>Toggle Navigator</td><td><code>⌘0</code></td></tr>
              <tr><td>Toggle Inspectors</td><td><code>⌥⌘0</code></td></tr>
              <tr><td>Toggle Debug Area</td><td><code>⇧⌘Y</code></td></tr>
              <tr><td>Resume Canvas</td><td><code>⌥⌘P</code></td></tr>
              <tr><td>Show Canvas</td><td><code>⌥⌘↩</code></td></tr>
              <tr><td>Comment/Uncomment</td><td><code>⌘/</code></td></tr>
              <tr><td>Re-indent</td><td><code>⌃I</code></td></tr>
              <tr><td>Jump bar</td><td><code>⌃6</code></td></tr>
              <tr><td>Quick Help</td><td><code>⌥</code>-click</td></tr>
              <tr><td>Jump to definition</td><td><code>⌘</code>-click</td></tr>
              <tr><td>Project Search</td><td><code>⇧⌘F</code></td></tr>
              <tr><td>Commit</td><td><code>⌥⌘C</code></td></tr>
              <tr><td>Profile</td><td><code>⌘I</code></td></tr>
              <tr><td>Build Documentation</td><td><code>⌃⇧⌘D</code></td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── SECTION 21 ─── */}
        <section className="section" id="s21" ref={setRef('s21')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>
          <table>
            <tbody>
              <tr>
                <th>Symptom</th>
                <th>Most likely cause</th>
                <th>Fix</th>
              </tr>
              <tr>
                <td>Canvas preview stuck on "Paused" or shows an error</td>
                <td>Code error or timeout</td>
                <td>Fix any red errors, then press Resume (<code>⌥⌘P</code>). Previews are stricter than the Simulator — they crash on things the Simulator would tolerate.</td>
              </tr>
              <tr>
                <td>Simulator won't boot / spins forever</td>
                <td>Stale simulator state</td>
                <td>In the Simulator app: Device menu → Restart. If that fails: Xcode → Window → Devices and Simulators → Simulators tab → delete the offending simulator and re-add it.</td>
              </tr>
              <tr>
                <td>"Untrusted Developer" on a real iPhone</td>
                <td>First run from this Apple ID on this phone</td>
                <td>On the phone: Settings → General → VPN &amp; Device Management → tap your Apple ID → Trust.</td>
              </tr>
              <tr>
                <td>"Signing for … requires a development team"</td>
                <td>No Apple ID connected, or wrong team selected</td>
                <td>Project settings → Signing &amp; Capabilities → Team → pick your Apple ID.</td>
              </tr>
              <tr>
                <td>"Command Line Tools" errors in build or package resolution</td>
                <td>CLT not installed or pointing to wrong Xcode</td>
                <td>Xcode → Settings → Locations → Command Line Tools → select the installed Xcode version. Or: <code>sudo xcode-select -s /Applications/Xcode.app</code></td>
              </tr>
              <tr>
                <td>Build is slow and getting slower</td>
                <td>DerivedData bloated or corrupted</td>
                <td>Product → Clean Build Folder (<code>⇧⌘K</code>), then Run. If still slow, delete DerivedData: Settings → Locations → arrow next to DerivedData → delete folders.</td>
              </tr>
              <tr>
                <td>"xcrun: error: unable to find utility" after macOS update</td>
                <td>Xcode license not accepted after update</td>
                <td>Run: <code>sudo xcodebuild -license accept</code> in Terminal.</td>
              </tr>
              <tr>
                <td>Package resolution fails / "dependency graph not satisfiable"</td>
                <td>Version conflicts between packages</td>
                <td>File → Packages → Reset Package Caches. If still failing, check if two packages require incompatible versions of a shared dependency — try updating to the latest versions of both.</td>
              </tr>
              <tr>
                <td>A panel disappeared entirely</td>
                <td>Accidentally hidden</td>
                <td><code>⌘0</code> (Navigator), <code>⌥⌘0</code> (Inspectors), <code>⇧⌘Y</code> (Debug Area), <code>⌥⌘↩</code> (Canvas). Or View menu → Show/Hide all areas.</td>
              </tr>
              <tr>
                <td>App installs but crashes immediately</td>
                <td>Missing entitlement, uncaught exception, or bad data</td>
                <td>Check the console output in the Debug Area. Add an Exception Breakpoint (<code>⌘8</code> → + → Exception Breakpoint) to catch the crash at the source line.</td>
              </tr>
              <tr>
                <td>"No such module" after adding a package</td>
                <td>Package linked to wrong target, or build needed</td>
                <td>Check the package is linked to your app target (project settings → your target → Build Phases → Link Binary With Libraries). Then <code>⌘B</code> to rebuild.</td>
              </tr>
              <tr>
                <td>Autocomplete stopped working</td>
                <td>SourceKit crashed</td>
                <td>Editor → Structure → Re-Parse File. Or do a full rebuild (<code>⇧⌘K</code> → <code>⌘B</code>). As a last resort, close and reopen Xcode.</td>
              </tr>
              <tr>
                <td>Tests pass locally but fail in CI</td>
                <td>Environment difference (missing env var, different Xcode version, database not reset)</td>
                <td>Run tests with the same Xcode version as CI. Add setUp/tearDown to reset state. Ensure tests don't depend on execution order.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── SECTION 22 ─── */}
        <section className="section" id="s22" ref={setRef('s22')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The window at a glance</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  N[Navigator<br/>⌘0–9] --- E[Editor<br/>center] --- C[Canvas<br/>⌥⌘↩] --- I[Inspectors<br/>⌥⌘0]
  E --- D[Debug Area<br/>⇧⌘Y]`} />

          <h3>Start to running app in 5 steps</h3>
          <table>
            <tbody>
              <tr><th>Step</th><th>How</th></tr>
              <tr><td>New project</td><td><code>⇧⌘N</code> → iOS → App → SwiftUI + Swift → Next</td></tr>
              <tr><td>Pick a device</td><td>Toolbar center → pick any iPhone Simulator</td></tr>
              <tr><td>Run</td><td><code>⌘R</code></td></tr>
              <tr><td>Stop</td><td><code>⌘.</code></td></tr>
              <tr><td>See live preview</td><td>Open a SwiftUI file → Canvas (<code>⌥⌘↩</code>)</td></tr>
            </tbody>
          </table>

          <h3>Navigator tabs</h3>
          <table>
            <tbody>
              <tr><td><code>⌘1</code></td><td>Project files</td><td><code>⌘6</code></td><td>Test results</td></tr>
              <tr><td><code>⌘2</code></td><td>Git / Source Control</td><td><code>⌘7</code></td><td>Debug (CPU/RAM gauges)</td></tr>
              <tr><td><code>⌘4</code></td><td>Find in project</td><td><code>⌘8</code></td><td>Breakpoints</td></tr>
              <tr><td><code>⌘5</code></td><td>Errors &amp; warnings</td><td><code>⌘9</code></td><td>Build history</td></tr>
            </tbody>
          </table>

          <h3>Debug a problem</h3>
          <table>
            <tbody>
              <tr><th>Problem</th><th>Tool</th></tr>
              <tr><td>"Did this line run?"</td><td><code>print("here")</code> → read console</td></tr>
              <tr><td>"What is this value right now?"</td><td>Breakpoint → hover variable or check variable viewer</td></tr>
              <tr><td>"Where does the crash come from?"</td><td>Exception Breakpoint (<code>⌘8</code> → +)</td></tr>
              <tr><td>"Why is my app slow?"</td><td>Product → Profile → Time Profiler</td></tr>
              <tr><td>"Why does memory keep growing?"</td><td>Instruments → Leaks / Allocations</td></tr>
            </tbody>
          </table>

          <h3>Git in Xcode</h3>
          <table>
            <tbody>
              <tr><th>Action</th><th>How</th></tr>
              <tr><td>Commit</td><td><code>⌥⌘C</code></td></tr>
              <tr><td>Push</td><td>Source Control → Push</td></tr>
              <tr><td>Pull</td><td>Source Control → Pull</td></tr>
              <tr><td>New branch</td><td><code>⌘2</code> → right-click branch → New Branch</td></tr>
              <tr><td>File history</td><td>Right-click file → Show File History</td></tr>
            </tbody>
          </table>

          <h3>Add a dependency</h3>
          <table>
            <tbody>
              <tr><th>Step</th><th>How</th></tr>
              <tr><td>Open package search</td><td>File → Add Package Dependencies…</td></tr>
              <tr><td>Paste the GitHub URL</td><td>e.g. https://github.com/Alamofire/Alamofire</td></tr>
              <tr><td>Choose version rule</td><td>"Up to Next Major" is the safe default</td></tr>
              <tr><td>Use in code</td><td><code>import Alamofire</code> at top of file</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">
            ★ Core Xcode skills covered. Continue below for the build system, localization, refactoring tools,
            and Previews in depth.
          </p>
        </section>

        <hr />

        {/* ─── S23 ─── */}
        <section className="section" id="s23" ref={setRef('s23')}>
          <h2><span className="section-num">23</span>Build System Deep Dive</h2>

          <h3>How a build works</h3>
          <p>
            When you press ⌘B or ⌘R, Xcode's build system runs a dependency graph of tasks:
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  SRC[Swift source files] --> COMP[Swift compiler]
  COMP --> OBJ[Object files .o]
  OBJ --> LINK[Linker]
  LINK --> BIN[App binary]
  ASSETS[Assets.xcassets] --> AC[Asset compiler]
  AC --> BIN
  STORYBOARD[Storyboards] --> IBC[Interface Builder compiler]
  IBC --> BIN
  PLISTS[Info.plist] --> PPC[plistutil]
  PPC --> BIN`} />
          <p>
            Xcode uses a parallel build system — it compiles files concurrently as long as dependencies allow.
            The number in the Activity Viewer (top bar) shows how many tasks are running.
          </p>

          <h3>Build settings — the full hierarchy</h3>
          <p>
            Build settings cascade through layers, each overriding the one above:
          </p>
          <ol>
            <li>SDK defaults (e.g., iOS SDK sets base settings)</li>
            <li>Xcode defaults (e.g., Deployment Target)</li>
            <li>Project-level settings (Info tab in project editor)</li>
            <li>Target-level settings (Build Settings in target editor) ← most common place to change</li>
            <li>Configuration-specific (Debug vs Release) ← conditionally overrides target settings</li>
            <li>xcconfig files ← external override, used in CI</li>
          </ol>
          <CodePre>{`// xcconfig files let you manage build settings in text files,
// which can be version-controlled cleanly:

// Config/Debug.xcconfig:
DEBUG_ENABLED = YES
API_BASE_URL = https://staging.yoursite.com
OTHER_SWIFT_FLAGS = $(inherited) -D DEBUG

// Config/Release.xcconfig:
DEBUG_ENABLED = NO
API_BASE_URL = https://yoursite.com

// Reference in Swift:
// In Info.plist: API_BASE_URL = $(API_BASE_URL)
// In Swift: Bundle.main.object(forInfoDictionaryKey: "API_BASE_URL") as? String`}</CodePre>

          <h3>Compiler flags</h3>
          <CodePre>{`// Add custom compiler flags in Build Settings → Swift Compiler — Custom Flags:
// Other Swift Flags: -D BETA_FEATURES

// Use in Swift code:
#if BETA_FEATURES
    BetaMenu()
#endif

// Common built-in flags:
#if DEBUG
    print("Debug mode")
#endif
#if RELEASE
    // release-only code
#endif
#if targetEnvironment(simulator)
    // Simulator-only code (e.g., skip camera)
#endif`}</CodePre>

          <h3>Build time optimization</h3>
          <CodePre>{`// Slow builds? Here are the main causes and fixes:

// 1. Type inference — Swift's type checker spends most of its time inferring types
//    Fix: add explicit type annotations to large expressions
let result: [String: [Int]] = computeComplexDictionary()  // ✅
let result = computeComplexDictionary()  // ❌ compiler must infer everything

// 2. Whole-Module Optimization (WMO) — faster release builds, slower Debug
//    Debug should use "Incremental" compilation
//    Build Settings → Swift Compiler — Code Generation → Compilation Mode

// 3. Too many files in one module — consider splitting large modules

// Measure build time per file:
// Product → Perform Action → Build With Timing Summary
// Xcode logs build times per file in the build log

// Enable build timing warnings:
// Build Settings → Other Swift Flags: -Xfrontend -warn-long-expression-type-checking=200`}</CodePre>
        </section>

        <hr />

        {/* ─── S24 ─── */}
        <section className="section" id="s24" ref={setRef('s24')}>
          <h2><span className="section-num">24</span>Localization in Xcode</h2>
          <p>
            Xcode 15 introduced <strong>String Catalogs</strong> (<code>.xcstrings</code>) — a single file
            that holds all translations for all languages, with built-in pluralization and extraction from source.
          </p>

          <h3>Create a String Catalog</h3>
          <ol>
            <li>File → New File → String Catalog → Save as <code>Localizable.xcstrings</code>.</li>
            <li>Build once — Xcode extracts all <code>String(localized:)</code> and <code>Text("key")</code> usages into the catalog.</li>
            <li>In the catalog editor, add languages (+ button top left).</li>
            <li>Fill in translations in the table view.</li>
          </ol>

          <CodePre>{`// In Swift — always use String(localized:) not plain string literals:
let greeting = String(localized: "greeting.hello",
                      defaultValue: "Hello!",
                      comment: "Greeting shown on the home screen")

// In SwiftUI — Text() is auto-localized:
Text("greeting.hello")   // looks up in Localizable.xcstrings

// Pluralization:
let message = String(localized: "\\(count) items",
                     defaultValue: "\\(count) item")
// String Catalog handles plural rules per language (Russian has 4 plural forms!)`}</CodePre>

          <h3>Export and import for translation</h3>
          <CodePre>{`// Export strings for a translator:
// Product → Export Localizations → select languages → exports .xcloc packages

// Import returned translations:
// Product → Import Localizations → select .xcloc file

// The .xcloc format is a directory with XLIFF files inside,
// compatible with professional translation tools (CAT tools).`}</CodePre>

          <h3>Pseudolanguage testing</h3>
          <CodePre>{`// Run the app in a pseudolanguage to catch truncation and layout issues:
// Edit Scheme → Run → Options → App Language → Double-Length Pseudolanguage
// This doubles all strings ("Hello" → "Hello Hello") — exposes short text fields

// "Bounded String" wraps strings with brackets: "[Hello]"
// Helps verify all strings go through the localization system`}</CodePre>

          <h3>Right-to-left (RTL) languages</h3>
          <CodePre>{`// SwiftUI handles RTL automatically for Arabic, Hebrew, etc.
// HStack flips to right-to-left, leading/trailing are semantic (not left/right)

// Test RTL in Simulator:
// Edit Scheme → Run → Arguments → Add -AppleLanguages '(ar)' to launch arguments

// Use .leading and .trailing instead of .left and .right in all layout:
Text("Label")
    .frame(maxWidth: .infinity, alignment: .leading)  // ✅ flips in RTL
    .frame(maxWidth: .infinity, alignment: .left)     // ❌ always left, breaks RTL`}</CodePre>
        </section>

        <hr />

        {/* ─── S25 ─── */}
        <section className="section" id="s25" ref={setRef('s25')}>
          <h2><span className="section-num">25</span>Accessibility Inspector</h2>
          <p>
            The Accessibility Inspector is a standalone tool (Xcode → Open Developer Tool → Accessibility Inspector)
            that lets you audit your app's accessibility without enabling VoiceOver on your device.
          </p>

          <h3>Features</h3>
          <ul>
            <li><strong>Inspection mode</strong> — hover over any UI element to see its accessibility label, hint, traits, and value. This is the fastest way to catch missing labels.</li>
            <li><strong>Audit</strong> — runs automated checks on the current screen. Flags: missing labels, low contrast, small touch targets, and more. Run it on every major screen before submitting.</li>
            <li><strong>Contrast checker</strong> — enter two colors and it tells you the contrast ratio and whether it passes WCAG AA/AAA.</li>
            <li><strong>Settings panel</strong> — toggle Dynamic Type size, Reduce Motion, Bold Text, Grayscale without going to Settings app. Fast for testing.</li>
          </ul>

          <h3>Running an audit</h3>
          <ol>
            <li>Open Accessibility Inspector.</li>
            <li>Select your Simulator or device from the menu.</li>
            <li>Navigate to the screen you want to audit in your app.</li>
            <li>In Accessibility Inspector, click the Audit button (triangle icon).</li>
            <li>Review each issue — click on an issue to highlight the problematic element.</li>
          </ol>

          <h3>Common audit failures and fixes</h3>
          <table>
            <tbody>
              <tr><th>Failure</th><th>Fix</th></tr>
              <tr><td>Element has no description</td><td><code>.accessibilityLabel("Delete item")</code></td></tr>
              <tr><td>Low contrast ratio</td><td>Use semantic colors, or increase opacity</td></tr>
              <tr><td>Touch target too small</td><td>Add <code>.frame(minWidth: 44, minHeight: 44)</code></td></tr>
              <tr><td>Text doesn't scale</td><td>Use semantic font styles, not fixed sizes</td></tr>
              <tr><td>Interactive element not marked</td><td><code>.accessibilityAddTraits(.isButton)</code></td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── S26 ─── */}
        <section className="section" id="s26" ref={setRef('s26')}>
          <h2><span className="section-num">26</span>Refactoring Tools</h2>
          <p>
            Xcode has several refactoring operations built in, accessible via right-click on any symbol:
            Editor → Refactor.
          </p>

          <h3>Available refactors</h3>
          <table>
            <tbody>
              <tr><th>Refactor</th><th>What it does</th></tr>
              <tr><td>Rename</td><td>Renames a symbol across all uses in the project. Updates callers, conformances, and tests.</td></tr>
              <tr><td>Extract to Method</td><td>Moves selected code into a new function, with proper parameter extraction.</td></tr>
              <tr><td>Extract to Variable</td><td>Moves a selected expression into a let/var with a placeholder name.</td></tr>
              <tr><td>Generate Memberwise Initializer</td><td>Adds an <code>init()</code> that takes all stored properties as parameters.</td></tr>
              <tr><td>Add Documentation</td><td>Inserts a DocC comment template for the selected function.</td></tr>
              <tr><td>Expand Macro</td><td>Shows what a Swift macro expands to (useful for debugging custom macros).</td></tr>
            </tbody>
          </table>

          <h3>Find &amp; Replace with regex</h3>
          <CodePre>{`// Xcode's Find & Replace supports regular expressions:
// ⌥⌘F → opens Find & Replace in current file
// ⇧⌘F → Project-wide search (Find Navigator)

// In Find Navigator: Options button → enable "Regular Expression"
// Capture groups work: find "(\w+)\.description" → replace with "\\1.debugDescription"

// The replacement uses $1, $2 for capture groups (not \\1):
// Find:    import (\w+)
// Replace: import Foundation\nimport $1   ← adds Foundation import before each import`}</CodePre>

          <h3>Global rename</h3>
          <CodePre>{`// The safest way to rename a class, struct, or function:
// 1. Click on the symbol name
// 2. Right-click → Refactor → Rename (or: Editor → Refactor → Rename)
// 3. Xcode highlights ALL references in a live rename mode
// 4. Type the new name — all references update in real time
// 5. Press Return to confirm

// For renames that cross module boundaries (calling code in another target):
// The refactoring still works, but verify in the other target afterward`}</CodePre>
        </section>

        <hr />

        {/* ─── S27 ─── */}
        <section className="section" id="s27" ref={setRef('s27')}>
          <h2><span className="section-num">27</span>Multi-Platform Projects</h2>
          <p>
            Xcode supports building multiple platforms from a single project. A well-structured
            SwiftUI project can target iOS, macOS, watchOS, and tvOS with mostly shared code.
          </p>

          <h3>Multiplatform app template</h3>
          <ol>
            <li>File → New → Project → Multiplatform → App.</li>
            <li>Xcode creates a project with a shared target (iOS + macOS) and platform-specific files.</li>
            <li>The shared target includes one scheme that builds for all selected platforms.</li>
          </ol>

          <CodePre>{`// Check the current platform at build time:
#if os(iOS)
    Text("iOS-specific content")
#elseif os(macOS)
    Text("Mac-specific content")
#elseif os(watchOS)
    Text("Watch content")
#elseif os(tvOS)
    Text("Apple TV content")
#endif

// Or at runtime (less common):
import Foundation
ProcessInfo.processInfo.isiOSAppOnMac   // true when iPhone/iPad app running on Apple Silicon Mac

// Conditional modifiers:
Text("Hello")
    #if os(iOS)
    .font(.largeTitle)
    #else
    .font(.title)
    #endif`}</CodePre>

          <h3>watchOS basics</h3>
          <CodePre>{`// Add a watchOS target: File → New → Target → Watch App

// watchOS views use the same SwiftUI, but with constraints:
// - No full keyboard input
// - Smaller screen (44–49mm)
// - Limited time on screen — design for 2-second interactions
// - Use NavigationStack, List, and TabView (with .tabViewStyle(.verticalPage))

// Share code via a framework target or Swift Package
// that both the iOS and watchOS targets depend on`}</CodePre>

          <h3>App Groups for extension data sharing</h3>
          <CodePre>{`// When you have multiple targets (main app, widget, watchOS, share extension),
// they all need to share data. Use App Groups:

// 1. Enable App Groups in all target capabilities
// 2. Use the same group identifier: "group.com.yourname.MyApp"

// Shared UserDefaults:
let shared = UserDefaults(suiteName: "group.com.yourname.MyApp")!
shared.set("value", forKey: "sharedKey")

// Shared file location:
let groupURL = FileManager.default
    .containerURL(forSecurityApplicationGroupIdentifier: "group.com.yourname.MyApp")!
let dataFile = groupURL.appending(path: "shared.json")`}</CodePre>
        </section>

        <hr />

        {/* ─── S28 ─── */}
        <section className="section" id="s28" ref={setRef('s28')}>
          <h2><span className="section-num">28</span>Code Review Workflow in Xcode</h2>

          <h3>Source Control Changes view</h3>
          <CodePre>{`// In the Source Control Navigator (⌘2 in the navigator):
// - "Changes" shows all uncommitted modifications
// - Click a file to open a diff view (the editor splits to show before/after)
// - The gutter in the editor shows changed lines (blue = modified, green = added, red = deleted)

// Compare any two commits:
// Source Control menu → Show Changes → select range in History

// View a file as it was at any past commit:
// Source Control Navigator → Repositories → your repo → History
// Double-click a commit to see the diff for that commit`}</CodePre>

          <h3>GitHub pull request review in Xcode</h3>
          <CodePre>{`// Xcode integrates with GitHub for PR review (if repo is on GitHub):
// Source Control menu → Create Pull Request → opens GitHub in browser
// Or: Review pull requests in Xcode 15+ natively

// In Xcode 15+:
// Source Control Navigator → Pull Requests tab
// See all open PRs, their checks, and review inline
// Add comments directly in Xcode's diff view`}</CodePre>

          <h3>Staging specific lines</h3>
          <CodePre>{`# Xcode's GUI stages entire files. For line-level staging, use Terminal:
# Stage specific lines interactively:
git add -p   # interactive patch mode — y/n/s/e for each hunk

# Or use a git GUI (Tower, Fork, GitKraken) alongside Xcode for
# finer-grained staging

# Create a commit in Terminal:
git commit -m "fix: handle nil username in profile view"

# Then push from Xcode: Source Control → Push`}</CodePre>
        </section>

        <hr />

        {/* ─── S29 ─── */}
        <section className="section" id="s29" ref={setRef('s29')}>
          <h2><span className="section-num">29</span>Environment Overrides</h2>
          <p>
            Environment Overrides let you toggle iOS system settings during a debug session without leaving
            Xcode or touching the Settings app. Find the button at the bottom of the debug bar (thermometer icon).
          </p>

          <h3>Available overrides</h3>
          <table>
            <tbody>
              <tr><th>Override</th><th>What it tests</th></tr>
              <tr><td>Appearance: Light / Dark</td><td>Dark mode support, contrast</td></tr>
              <tr><td>Dynamic Type</td><td>Text size from xSmall to AX5 — test layout breakage at extremes</td></tr>
              <tr><td>Increase Contrast</td><td>High-contrast accessibility mode</td></tr>
              <tr><td>Bold Text</td><td>System bolds all text — ensure layouts don't break</td></tr>
              <tr><td>Reduce Transparency</td><td>Blurs replaced with solid backgrounds</td></tr>
              <tr><td>Reduce Motion</td><td>Animations should simplify or disable</td></tr>
              <tr><td>Grayscale</td><td>No color information — ensure icons still communicate meaning</td></tr>
              <tr><td>Smart Invert / Classic Invert</td><td>Color inversion accessibility features</td></tr>
            </tbody>
          </table>

          <h3>Using overrides efficiently</h3>
          <CodePre>{`// Best practice workflow before shipping a screen:
// 1. Toggle Dark Mode — check for hardcoded colors, contrast issues
// 2. Set Dynamic Type to AX3 — check layout, truncation, line wrapping
// 3. Enable Reduce Motion — check that animations degrade gracefully
// 4. Enable Bold Text — check that text still fits in containers
// 5. Run Accessibility Inspector Audit

// In code, listen for override changes:
@Environment(\\.colorScheme) var scheme
@Environment(\\.accessibilityReduceMotion) var reduceMotion
@Environment(\\.dynamicTypeSize) var typeSize

// These update live when you change the override slider — no restart needed`}</CodePre>
        </section>

        <hr />

        {/* ─── S30 ─── */}
        <section className="section" id="s30" ref={setRef('s30')}>
          <h2><span className="section-num">30</span>Previews Deep Dive</h2>
          <p>
            Xcode Previews (the Canvas) give you instant visual feedback without running the Simulator. Under
            the hood they build a separate, faster preview binary and render it directly in Xcode.
          </p>

          <h3>Preview macros (Xcode 15+)</h3>
          <CodePre>{`// The #Preview macro replaces PreviewProvider:
#Preview("Light mode") {
    ContentView()
        .preferredColorScheme(.light)
}

#Preview("Dark mode, Large Text") {
    ContentView()
        .preferredColorScheme(.dark)
        .dynamicTypeSize(.accessibility2)
}

// Preview a specific component in isolation:
#Preview("Custom Button") {
    PrimaryButton(title: "Save") { }
        .padding()
        .background(Color(.systemBackground))
}`}</CodePre>

          <h3>Providing sample data</h3>
          <CodePre>{`// Previews must compile — they can't hit a real server.
// Provide mock data using static properties:
extension Recipe {
    static var preview: Recipe {
        Recipe(title: "Pasta Carbonara", ingredients: ["noodles", "eggs", "bacon"], servings: 4)
    }

    static var previewList: [Recipe] {
        [
            Recipe(title: "Pasta", ingredients: ["noodles"], servings: 2),
            Recipe(title: "Pizza", ingredients: ["dough", "tomato"], servings: 4),
        ]
    }
}

#Preview {
    RecipeDetailView(recipe: .preview)
}

// For @StateObject / @EnvironmentObject in previews:
#Preview {
    let vm = RecipeViewModel()
    vm.recipes = .previewList
    return RecipeListView()
        .environmentObject(vm)
}`}</CodePre>

          <h3>Preview in a sheet or navigation stack</h3>
          <CodePre>{`// Preview a view as it appears inside a sheet:
#Preview {
    // Wrap in a sheet to preview with the sheet chrome:
    Color.clear.sheet(isPresented: .constant(true)) {
        AddRecipeView()
    }
}

// Preview with NavigationStack:
#Preview {
    NavigationStack {
        RecipeDetailView(recipe: .preview)
            .navigationTitle("Recipe")
    }
}`}</CodePre>

          <h3>Interactive previews</h3>
          <CodePre>{`// By default, previews are static. Click the play button (▶) in the canvas
// to make them interactive — you can tap buttons, scroll, fill forms.

// To test @State changes: make the preview hold state:
#Preview {
    @State var isShowing = true
    return SettingsView(isShowing: $isShowing)
}

// Preview with SwiftData:
#Preview {
    let config = ModelConfiguration(isStoredInMemoryOnly: true)
    let container = try! ModelContainer(for: Recipe.self, configurations: config)
    container.mainContext.insert(Recipe.preview)
    return RecipeListView()
        .modelContainer(container)
}`}</CodePre>

          <h3>Why previews fail</h3>
          <table>
            <tbody>
              <tr><th>Error</th><th>Cause / Fix</th></tr>
              <tr><td>"Cannot preview in this file"</td><td>A compile error elsewhere prevents the preview binary from building. Fix the error first.</td></tr>
              <tr><td>Preview crashes with EXC_CRASH</td><td>Often force-unwrap or missing data. Add nil checks and provide sample data.</td></tr>
              <tr><td>Preview loads forever</td><td>Slow network call or blocking synchronous code in <code>init</code>. Move side effects into <code>.onAppear</code> or <code>.task</code>.</td></tr>
              <tr><td>"@EnvironmentObject not found"</td><td>Missing <code>.environmentObject(…)</code> on the preview. Add it.</td></tr>
              <tr><td>Stale preview doesn't update</td><td>Click the Refresh button in the canvas, or press ⌥⌘P.</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">
            ★ Previews mastered. Continue for Swift macros, Organizer, workspaces, and Swift error messages.
          </p>
        </section>

        <hr />

        {/* ─── S31 ─── */}
        <section className="section" id="s31" ref={setRef('s31')}>
          <h2><span className="section-num">31</span>Swift Macros in Xcode</h2>
          <p>
            Swift macros (Swift 5.9+, Xcode 15+) generate code at compile time. You write <code>@Model</code>
            or <code>@Observable</code> and the macro inserts the boilerplate. Understanding how to use macros
            (and expand them in Xcode) saves a lot of confusion.
          </p>

          <h3>Using built-in macros</h3>
          <CodePre>{`import SwiftData

// @Model is a macro — it generates conformance code:
@Model
final class Recipe {
    var title: String
    var rating: Int
    init(title: String, rating: Int) {
        self.title = title
        self.rating = rating
    }
}

// Other commonly used built-in macros:
@Observable class ViewModel { }    // generates @Published-like tracking
@MainActor class UIUpdater { }     // runs on main thread
#Preview { ContentView() }         // Canvas preview
#expect(value == 42)               // Swift Testing assertion
#require(try? parseData())         // failing assertion throws`}</CodePre>

          <h3>Expanding a macro in Xcode</h3>
          <CodePre>{`// To see what a macro generates:
// Right-click on the macro name in the editor → Expand Macro

// @Model expands to something like:
// final class Recipe: PersistentModel, Observable {
//     @Transient var _$observationRegistrar = ObservationRegistrar()
//     var title: String {
//         get { _$observationRegistrar.access(self, keyPath: \\.title); return _title }
//         set { ... }
//     }
//     ...
// }

// This is very useful when a macro isn't working as expected.
// The expansion shows exactly what code the compiler sees.`}</CodePre>

          <h3>Common macro errors</h3>
          <table>
            <tbody>
              <tr><th>Error</th><th>Cause / Fix</th></tr>
              <tr><td>"Macro not found" or "Plugin not loaded"</td><td>The macro's package plugin isn't built yet. Try Product → Clean Build Folder → Build.</td></tr>
              <tr><td>Macro expansion shows red errors</td><td>The generated code has a type mismatch. Read the expanded code (Expand Macro) to understand what was generated.</td></tr>
              <tr><td>@Model requires final class</td><td>SwiftData's <code>@Model</code> only works on <code>final class</code>, not <code>class</code> or <code>struct</code>.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── S32 ─── */}
        <section className="section" id="s32" ref={setRef('s32')}>
          <h2><span className="section-num">32</span>Organizer &amp; Crash Reports</h2>
          <p>
            The Xcode Organizer (Window → Organizer) is your post-ship command center. It aggregates data
            from App Store-distributed builds: crash logs, disk writes, energy reports, and more.
          </p>

          <h3>Archives tab</h3>
          <p>
            Every time you archive an app (Product → Archive), Xcode saves it here. Archives include your
            binary plus the <code>.dSYM</code> debug symbols needed to symbolicate crash reports. <strong>Never
            delete your archives</strong> — you need the matching dSYM to read crash logs from that version.
          </p>

          <h3>Crashes tab</h3>
          <CodePre>{`// Crash reports from App Store users appear here automatically.
// Requirements:
// - User has "Share Analytics with App Developers" enabled on their device
// - The crash occurred in a version distributed through App Store

// Understanding a crash report:
// 1. Exception type: EXC_BAD_ACCESS (memory access violation)
//                    EXC_CRASH (SIGABRT — assertion failure, uncaught exception)
//                    EXC_BAD_INSTRUCTION (SIGILL — invalid instruction, often force-unwrap nil)
// 2. Termination reason: specific cause (e.g., "Unexpectedly found nil while unwrapping")
// 3. Thread 0 (main thread) stack trace — the call stack at crash time
// 4. Application Specific Backtrace — the actual Swift/ObjC stack

// To symbolicate manually:
// xcrun atos -arch arm64 -o MyApp.app.dSYM/Contents/Resources/DWARF/MyApp
//            -l 0x[load_address] 0x[crash_address]`}</CodePre>

          <h3>MetricKit reports in Organizer</h3>
          <ul>
            <li><strong>Disk Writes</strong> — how much data your app writes to disk. Excessive writes drain battery.</li>
            <li><strong>Hang Rate</strong> — how often the main thread is blocked for &gt;250ms. Target &lt;1%.</li>
            <li><strong>Launch Time</strong> — time from tap to first frame. Target &lt;400ms.</li>
            <li><strong>Memory</strong> — peak memory use by percentile of your user base.</li>
            <li><strong>Scrolling</strong> — frame rate during scrolling. Target 60 fps (or 120 on ProMotion devices).</li>
          </ul>

          <h3>App Store Connect app analytics</h3>
          <CodePre>{`// App Store Connect → Analytics shows:
// Impressions: how many times your app appeared in search/browse
// Product page views: how many people viewed your App Store page
// App units: how many paid downloads
// Sessions: how many app launches per device
// Active Devices: unique devices that ran your app each day/week
// Crashes (from Apple's crash reporter — different from Organizer)

// Funnel analysis:
// Impressions → Product Page Views → App Units = conversion rate
// Example: 10,000 impressions → 1,000 page views (10%) → 50 downloads (5%)
// Focus on improving the middle funnel: screenshots, description, ratings`}</CodePre>
        </section>

        <hr />

        {/* ─── S33 ─── */}
        <section className="section" id="s33" ref={setRef('s33')}>
          <h2><span className="section-num">33</span>Workspaces &amp; Modules</h2>

          <h3>Xcode workspaces</h3>
          <p>
            A <strong>workspace</strong> (<code>.xcworkspace</code>) contains multiple projects. When you use
            CocoaPods, it generates a workspace that contains your app project + a Pods project. You always open
            the workspace, not the project file, when using CocoaPods.
          </p>
          <CodePre>{`# When CocoaPods is in use, your workspace looks like:
MyApp.xcworkspace/
├── MyApp.xcodeproj      ← your project
└── Pods.xcodeproj       ← CocoaPods-managed dependencies

# Always open: open MyApp.xcworkspace
# Never open:  open MyApp.xcodeproj (dependencies won't be linked)

# Commands:
pod install   # install/update dependencies, regenerate workspace
pod update    # update to latest compatible versions
pod outdated  # list which pods have newer versions`}</CodePre>

          <h3>Swift packages as local modules</h3>
          <CodePre>{`// For large projects, split code into local Swift packages (no remote hosting needed):

// File → New → Package → name it "RecipeCore"
// Place it inside your repo: MyApp/Packages/RecipeCore/

// Package.swift:
// swift-tools-version: 5.10
// import PackageDescription
// let package = Package(
//     name: "RecipeCore",
//     products: [.library(name: "RecipeCore", targets: ["RecipeCore"])],
//     targets: [.target(name: "RecipeCore", path: "Sources")]
// )

// Add to your app target:
// In xcodeproj → Add Package Dependencies → Add Local… → select the Package.swift

// Benefits:
// - Faster incremental builds (modules compile independently)
// - Clear public API boundaries (only public symbols are accessible)
// - Reusable across multiple targets (main app + widget + tests)`}</CodePre>

          <h3>Frameworks vs packages</h3>
          <table>
            <tbody>
              <tr><th></th><th>Swift Package</th><th>Framework (.framework)</th></tr>
              <tr><td>Distribution</td><td>Source code or binary</td><td>Pre-compiled binary</td></tr>
              <tr><td>Debugging</td><td>Full source-level debugging</td><td>Only if dSYMs included</td></tr>
              <tr><td>Build time</td><td>Compiled per machine</td><td>Pre-built, faster app build</td></tr>
              <tr><td>Common use</td><td>Open-source libraries, internal modules</td><td>Third-party proprietary SDKs</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── S34 ─── */}
        <section className="section" id="s34" ref={setRef('s34')}>
          <h2><span className="section-num">34</span>Common Swift Error Messages</h2>
          <p>
            Swift's error messages are often excellent, but some are cryptic for beginners. Here are the
            most common ones decoded.
          </p>

          <table>
            <tbody>
              <tr>
                <th>Error message</th>
                <th>What it means</th>
                <th>Fix</th>
              </tr>
              <tr>
                <td><code>Value of optional type '…?' must be unwrapped</code></td>
                <td>You're using an optional where a non-optional is required.</td>
                <td>Use <code>if let</code>, <code>guard let</code>, <code>!</code>, or <code>?? default</code>.</td>
              </tr>
              <tr>
                <td><code>Cannot assign to property: '…' is a 'let' constant</code></td>
                <td>Trying to mutate an immutable binding or a property on a <code>let</code> struct.</td>
                <td>Change <code>let</code> to <code>var</code>, or make it <code>@State</code> in SwiftUI.</td>
              </tr>
              <tr>
                <td><code>Referencing initializer … requires the types … to be equal</code></td>
                <td>Type mismatch — you passed the wrong type somewhere.</td>
                <td>Check the types involved and add an explicit conversion if needed.</td>
              </tr>
              <tr>
                <td><code>Extra argument '…' in call</code></td>
                <td>Calling a function with a parameter name it doesn't have.</td>
                <td>Check the function's signature. Often a typo in the label name.</td>
              </tr>
              <tr>
                <td><code>Missing argument for parameter '…' in call</code></td>
                <td>Required parameter not provided.</td>
                <td>Add the missing argument, or give it a default value in the function definition.</td>
              </tr>
              <tr>
                <td><code>Cannot convert value of type 'X' to expected argument type 'Y'</code></td>
                <td>Type mismatch at the call site.</td>
                <td>Cast explicitly: <code>Int(someDouble)</code>, <code>String(someInt)</code>, etc.</td>
              </tr>
              <tr>
                <td><code>Mutation of captured var '…' in concurrently-executing code</code></td>
                <td>Multiple async closures could mutate the same variable.</td>
                <td>Use an <code>actor</code>, or <code>@MainActor</code>, or a local copy inside the closure.</td>
              </tr>
              <tr>
                <td><code>Protocol '…' can only be used as a generic constraint</code></td>
                <td>The protocol has an <code>associatedtype</code> so you can't use it directly as a type.</td>
                <td>Use <code>some Protocol</code> or <code>any Protocol</code>, or a generic with <code>&lt;T: Protocol&gt;</code>.</td>
              </tr>
              <tr>
                <td><code>Trailing closure passed to parameter of type '…' that does not accept a closure</code></td>
                <td>The last argument isn't a closure.</td>
                <td>Use explicit argument labels instead of trailing closure syntax.</td>
              </tr>
              <tr>
                <td><code>Expression is too complex to be solved in reasonable time</code></td>
                <td>Type inference is taking too long on a complex expression.</td>
                <td>Break the expression into smaller named variables with explicit types.</td>
              </tr>
              <tr>
                <td><code>Main actor-isolated property '…' can not be mutated from a nonisolated context</code></td>
                <td>Trying to change a @MainActor property from a background task.</td>
                <td>Wrap in <code>await MainActor.run {'{ }'}</code> or mark the function <code>@MainActor</code>.</td>
              </tr>
            </tbody>
          </table>

          <h3>Reading the error location</h3>
          <CodePre>{`// Xcode shows errors inline in the editor, but the ACTUAL error is
// often not on the highlighted line — it's the cause that's a few lines up.

// Classic example:
let x = myFunc()   // ← Xcode underlines this
//       ^ "Cannot convert return expression of type 'Int' to 'String'"

// But the real fix is in myFunc's return type, not here.
// Always read the FULL error message and check the surrounding context.

// "In expansion of macro" errors:
// When a macro (like @Model) generates invalid code, the error points inside
// the expansion. Use "Expand Macro" to see what was generated.

// Multiple errors from one root cause:
// Swift often cascades a type error into 5-10 secondary errors.
// Fix the FIRST error in the list, rebuild, and many others may disappear.`}</CodePre>

          <p className="finished-marker">
            ★ Swift error messages decoded. Continue for Xcode 16 features and advanced debugging.
          </p>
        </section>

        <hr />

        {/* ─── S35 ─── */}
        <section className="section" id="s35" ref={setRef('s35')}>
          <h2><span className="section-num">35</span>Xcode 16 Features</h2>

          <h3>Predictive code completion</h3>
          <p>
            Xcode 16 added on-device predictive code completion — the editor suggests multi-token completions
            trained on Swift and Apple SDK patterns. It runs locally (no data sent to Apple), uses the neural
            engine, and appears as grey ghost text you accept with Tab.
          </p>
          <CodePre>{`// Ghost text appears as you type:
let view = VStack {
    // type "Text" and Xcode may suggest:
    // Text("Hello, World!")
    //         ^^^^^^^^^^^^^ grey ghost text — press Tab to accept

// Toggle in Xcode Settings → Text Editing → Code Completion:
// "Enable Predictive Code Completion" checkbox`}</CodePre>

          <h3>Swift Testing framework</h3>
          <CodePre>{`// Xcode 16 ships the new Swift Testing framework alongside XCTest.
// It uses macros and is more expressive:
import Testing

// Tests are functions marked @Test:
@Test func recipeHasTitle() {
    let recipe = Recipe(title: "Pasta")
    #expect(recipe.title == "Pasta")
    #expect(!recipe.title.isEmpty)
}

// Parameterized tests:
@Test("Recipe creation", arguments: ["Pasta", "Pizza", "Salad"])
func testRecipeCreation(title: String) {
    let recipe = Recipe(title: title)
    #expect(recipe.title == title)
}

// Suites group tests:
@Suite("Recipe Tests")
struct RecipeTests {
    @Test func basicCreation() { /* … */ }
    @Test func favoriteToggle() { /* … */ }
}

// Expectations:
#expect(value == 42)                // fails test but continues
#require(value != nil)             // throws on failure — stops the test
try #require(try riskyOperation())  // await-able too`}</CodePre>

          <h3>Thread performance checker improvements</h3>
          <CodePre>{`// Xcode 16 improves the Main Thread Checker and Data Race detection:
// Product → Scheme → Edit Scheme → Diagnostics:
// - Thread Sanitizer: detects data races at runtime (slow but thorough)
// - Main Thread Checker: warns when UIKit/AppKit/SwiftUI APIs called off main thread
// - Address Sanitizer: detects memory errors (use-after-free, buffer overflow)

// These are most useful in Development and CI — don't ship to TestFlight
// with Thread Sanitizer enabled (huge performance overhead)`}</CodePre>
        </section>

        <hr />

        {/* ─── S36 ─── */}
        <section className="section" id="s36" ref={setRef('s36')}>
          <h2><span className="section-num">36</span>Advanced Debugging</h2>

          <h3>LLDB console commands</h3>
          <CodePre>{`// When paused at a breakpoint, type in the Debug Console:

// Print a variable:
po myVariable              // "po" = print object (calls description)
p myVariable               // "p" = print (shows raw value)
print(myVariable)          // also works

// Execute arbitrary Swift code:
e import Foundation
e let x = Date()
po x.description

// Print all properties of an object:
po dump(myObject)

// Navigate the call stack:
bt           // backtrace — full call stack
bt 5         // show only the top 5 frames
frame select 2   // jump to frame 2

// Continue execution:
c            // continue
n            // next (step over)
s            // step into
finish       // step out`}</CodePre>

          <h3>Watchpoints — break on data change</h3>
          <CodePre>{`// A watchpoint pauses execution whenever a specific memory address changes.
// Useful for "where is this property being mutated from?"

// In LLDB console (while paused):
watchpoint set variable self->_count   // breaks when _count changes

// Or right-click a variable in the Variables panel → Watch "_count"

// Watchpoints are very powerful for debugging unexpected mutations — much faster
// than adding print statements everywhere`}</CodePre>

          <h3>Memory graph debugger</h3>
          <CodePre>{`// The Memory Graph Debugger shows all live objects and their retain graph.
// Press the "Debug Memory Graph" button (squares icon) in the Debug toolbar.

// What you see:
// - All objects currently in memory
// - Lines showing which objects retain which other objects
// - Objects with retain cycles are marked with a purple warning icon

// Finding a leak:
// 1. Navigate through your app to the screen that you suspect leaks
// 2. Go back (pop the navigation, dismiss the sheet)
// 3. Open Memory Graph
// 4. If the view controller / SwiftUI view model is still there, it's retained
// 5. Follow the arrows to find what's keeping it alive

// Fix: break the retain cycle with [weak self] in closures`}</CodePre>

          <h3>Network debugging</h3>
          <CodePre>{`// Log all network requests in the Simulator:
// Edit Scheme → Run → Arguments → Environment Variables:
// CFNETWORK_DIAGNOSTICS = 1    (basic)
// CFNETWORK_DIAGNOSTICS = 3    (verbose, includes headers)

// Charles Proxy or Proxyman (Mac apps) intercept all network traffic:
// Set a system proxy and the app shows every request with full headers/body.
// Essential for debugging API calls, certificate issues, and performance.

// Inspect network in Instruments:
// Instruments → Network template
// Shows every URLSession request with timing breakdown:
// DNS → TCP connect → TLS → first byte → download`}</CodePre>

          <h3>Console filtering</h3>
          <CodePre>{`// The Xcode console can flood with logs. Filter it:
// In the console footer:
// - Search box: type a keyword to show only matching lines
// - Metadata button: show/hide timestamps, subsystem labels
// - Filter icons: show only errors, or all levels

// Use OSLog subsystem to filter to your own app's logs:
// In Console.app on Mac, type "subsystem:com.yourname.MyApp"
// This filters to only your app's logs, even from a real device over USB

// Silence noisy third-party SDK logs:
// Check if the SDK uses OSLog or print(). For print(), nothing you can do.
// For OSLog, you can mute categories in Console.app`}</CodePre>

          <h3>Disassembly view</h3>
          <p>
            When Xcode doesn't have source for a crash location (e.g., inside a system framework), it shows
            assembly. You can also open it intentionally: while paused, right-click in the editor gutter →
            "Show Disassembly for: [function name]". Reading assembly is a rare need, but understanding the
            basics (registers like <code>x0</code>–<code>x7</code> for args/return, <code>bl</code> = branch
            link = function call) helps decode crash-time conditions.
          </p>

          <h3>LLDB Python scripting</h3>
          <CodePre>{`# LLDB supports Python scripts for advanced debugging automation.
# Create ~/.lldbinit to load scripts at startup:
# command script import ~/scripts/my_debug_helpers.py

# Useful built-in LLDB Python commands:
# script import lldb; print(lldb.debugger.GetNumTargets())

# Example: print all instance variables of self:
# (in LLDB console while paused at a Swift breakpoint)
expression -l objc -O -- [self _ivarDescription]

# This uses Objective-C runtime to dump all ivars —
# handy when Swift's introspection doesn't show everything you need`}</CodePre>

          <h3>Sanitizers and diagnostics summary</h3>
          <table>
            <tbody>
              <tr><th>Tool</th><th>What it catches</th><th>Performance cost</th></tr>
              <tr><td>Main Thread Checker</td><td>UIKit called off main thread</td><td>Low</td></tr>
              <tr><td>Thread Sanitizer (TSan)</td><td>Data races</td><td>High (~5-10x slower)</td></tr>
              <tr><td>Address Sanitizer (ASan)</td><td>Memory errors</td><td>High</td></tr>
              <tr><td>Undefined Behavior Sanitizer</td><td>Integer overflow, null refs</td><td>Medium</td></tr>
              <tr><td>Malloc Stack Logging</td><td>Allocation traces for leak debugging</td><td>Medium</td></tr>
            </tbody>
          </table>

          <h3>Debugging SwiftUI binding issues</h3>
          <CodePre>{`// SwiftUI bindings ($) are a frequent source of confusion.
// If a @Binding isn't updating, debug with these techniques:

// 1. Add a .onChange to see when the bound value changes:
TextField("Name", text: $name)
    .onChange(of: name) { old, new in
        print("Name changed from \\(old) to \\(new)")
    }

// 2. Check if the @State is in the right view:
//    @State must live in the view that OWNS the data.
//    If it's in a parent and you're checking in a child, the child sees
//    the parent's copy — they're the same object, changes propagate up.

// 3. Check if the child view recreates (and loses state):
//    If a parent view's body runs and creates a new instance of the child,
//    any @State inside the child resets to its initial value.
//    Fix: move @State to the parent, or make the child use @Binding.

// 4. Unexpected double-render: add _printChanges() to body
struct ContentView: View {
    var body: some View {
        let _ = Self._printChanges()   // prints to console what changed
        VStack { /* … */ }
    }
}`}</CodePre>

          <p className="finished-marker">
            ★ Complete Xcode guide — 36 sections covering everything from installing Xcode through advanced debugging
            with LLDB, memory graphs, network inspection, Swift Testing, and SwiftUI binding debugging. You now have
            the full Xcode toolkit. Next: the <strong>SwiftUI Fundamentals</strong> guide covers the Swift language
            and SwiftUI UI framework in depth, and the <strong>iOS Deployment Guide</strong> covers shipping to
            devices and the App Store.
          </p>
        </section>
      </main>
    </div>
  );
}
