import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'How Games & Engines Work',  icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Why Godot (vs Unity)',      icon: '⚖️' },
  { id: 's3',  num: '3',  title: 'Finding Your Way Around a Mac', icon: '🍎' },
  { id: 's4',  num: '4',  title: 'The Terminal, Gently',      icon: '⌨️' },
  { id: 's5',  num: '5',  title: 'Installing Godot 4',        icon: '⬇️' },
  { id: 's6',  num: '6',  title: 'The Project Manager',       icon: '🗂️' },
  { id: 's7',  num: '7',  title: 'A Tour of the Editor',      icon: '🧭' },
  { id: 's8',  num: '8',  title: 'Nodes & Scenes',            icon: '🧩' },
  { id: 's9',  num: '9',  title: 'The Node Zoo',              icon: '🦒' },
  { id: 's10', num: '10', title: 'Your First Scene',          icon: '🎬' },
  { id: 's11', num: '11', title: 'GDScript: The Basics',      icon: '📜' },
  { id: 's12', num: '12', title: 'GDScript: Going Further',   icon: '🔧' },
  { id: 's13', num: '13', title: 'The Inspector & @export',   icon: '🔎' },
  { id: 's14', num: '14', title: 'Signals',                   icon: '📡' },
  { id: 's15', num: '15', title: 'Handling Input & Touch',    icon: '👆' },
  { id: 's16', num: '16', title: '2D Space & Transforms',     icon: '📐' },
  { id: 's17', num: '17', title: 'Drawing Without Art',       icon: '🎨' },
  { id: 's18', num: '18', title: 'Sound & Music',             icon: '🔊' },
  { id: 's19', num: '19', title: 'Building UI',               icon: '🖼️' },
  { id: 's20', num: '20', title: 'Scenes, Autoloads & State', icon: '🗃️' },
  { id: 's21', num: '21', title: 'Saving & Loading',          icon: '💾' },
  { id: 's22', num: '22', title: 'Settings for Mobile',       icon: '📱' },
  { id: 's23', num: '23', title: 'How Exporting Works',       icon: '📦' },
  { id: 's24', num: '24', title: 'Apple Developer Account',   icon: '🍏' },
  { id: 's25', num: '25', title: 'Installing Xcode',          icon: '🛠️' },
  { id: 's26', num: '26', title: 'iOS Export from Godot',     icon: '🚀' },
  { id: 's27', num: '27', title: 'Godot → Xcode → Signing',   icon: '🔑' },
  { id: 's28', num: '28', title: 'Running on Your iPhone',    icon: '📲' },
  { id: 's29', num: '29', title: 'Icons & Launch Screen',     icon: '🎴' },
  { id: 's30', num: '30', title: 'Uploading to TestFlight',   icon: '✈️' },
  { id: 's34', num: '31', title: 'Animation: Tweens & AnimationPlayer', icon: '🎞️' },
  { id: 's35', num: '32', title: 'Particles & Effects',       icon: '🎆' },
  { id: 's36', num: '33', title: 'The Scene Tree & Node Paths', icon: '🌲' },
  { id: 's37', num: '34', title: 'Resources & Custom Data',    icon: '📦' },
  { id: 's38', num: '35', title: 'Common GDScript Patterns',   icon: '🧩' },
  { id: 's39', num: '36', title: 'Organizing a Bigger Project', icon: '🗃️' },
  { id: 's40', num: '37', title: 'Version Control with Git',   icon: '🌿' },
  { id: 's41', num: '38', title: 'Performance & Profiling',    icon: '📊' },
  { id: 's42', num: '39', title: 'TestFlight → App Store',     icon: '🏬' },
  { id: 's44', num: '40', title: 'GDScript Language Reference', icon: '📕' },
  { id: 's45', num: '41', title: 'Math for 2D Games',          icon: '📐' },
  { id: 's46', num: '42', title: 'Input & Devices Reference',  icon: '🎮' },
  { id: 's47', num: '43', title: 'Editor Shortcuts & Power Tips', icon: '⚡' },
  { id: 's43', num: '44', title: 'Glossary',                   icon: '📖' },
  { id: 's31', num: '?',  title: 'Troubleshooting',           icon: '🩺' },
  { id: 's32', num: '✦',  title: 'Cheat Sheet',               icon: '📋' },
  { id: 's33', num: '→',  title: 'Where to Go Next',          icon: '🧗' },
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

export default function GodotBeginnersGuide() {
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
            <span className="sidebar-title">Godot 4 for Beginners</span>
          </div>
          <div className="sidebar-sub">Mac → iPhone → TestFlight</div>
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
          <div className="hero-tag">🎮 Godot 4.x · GDScript · macOS (Apple Silicon) · 2026</div>
          <h1>Godot 4 for Beginners<br />(Mac → iPhone → TestFlight)</h1>
          <p>
            You have never made a game, never opened a game engine, and you are still finding your
            way around your Mac. That is exactly who this guide is for. We start at "what even is a
            game engine," install <strong style={{ color: '#C77AA0' }}>Godot 4</strong> the right way
            on an Apple Silicon Mac, learn just enough <strong style={{ color: '#C77AA0' }}>GDScript</strong>{' '}
            to be dangerous, and finish by putting a real app on your own iPhone and onto{' '}
            <strong style={{ color: '#C77AA0' }}>TestFlight</strong>. No prior coding, no prior Mac
            expertise assumed — every click and every command is spelled out.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Experience assumed</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~100MB</span><span className="hero-stat-label">Godot download</span></div>
            <div className="hero-stat"><span className="hero-stat-val">$99/yr</span><span className="hero-stat-label">Apple Developer (for TestFlight)</span></div>
            <div className="hero-stat"><span className="hero-stat-val">33</span><span className="hero-stat-label">Sections, zero to shipped</span></div>
          </div>
        </div>

        {/* SECTION 1 — HOW GAMES & ENGINES WORK */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>How Games &amp; Engines Work</h2>
          <p>
            Before we install anything, let's build a mental model. A video game looks like magic, but
            underneath it is doing the same three things, over and over, many times per second:
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  INPUT["1 - Read input<br/>(finger taps, drags)"] --> UPDATE["2 - Update the world<br/>(move things, check rules)"]
  UPDATE --> DRAW["3 - Draw the screen<br/>(show the new picture)"]
  DRAW --> INPUT`} />
          <p>
            That loop is called the <strong>game loop</strong>, and one trip around it is a{' '}
            <strong>frame</strong>. Most games run at 60 frames per second, so the loop runs about
            once every <code>0.0166</code> seconds. Your job as a game developer is mostly to fill in
            step 2 — "given what the player did, what should the world look like now?" — and let the
            engine handle reading the input and painting the screen.
          </p>
          <h3>So what is a "game engine"?</h3>
          <p>
            A game engine is a big box of pre-built machinery so you don't have to write the boring,
            hard parts yourself. Without an engine, you would personally have to write code that talks
            to the graphics chip, loads image and sound files, tracks where every object is, detects
            when two things touch, plays audio, reads the touchscreen, and runs that 60-times-a-second
            loop. That is months of work before you can draw a single square.
          </p>
          <p>
            An engine hands you all of that for free. <strong>Godot</strong> is one such engine. You
            describe <em>what</em> is in your game and <em>what the rules are</em>, and Godot runs the
            loop, draws everything, and plays the sounds. Think of it like the difference between
            building a car from raw metal versus being handed an engine, wheels, and a steering wheel
            and just deciding how to assemble them.
          </p>
          <div className="card">
            <h4>The five things every engine gives you</h4>
            <table>
              <tbody>
                <tr><th>Capability</th><th>What it means for you</th></tr>
                <tr><td><strong>Rendering</strong></td><td>Draws shapes, images, and text to the screen, fast.</td></tr>
                <tr><td><strong>Scene system</strong></td><td>A way to organize the "things" in your game and reuse them.</td></tr>
                <tr><td><strong>Scripting</strong></td><td>A programming language to express your rules (for us, GDScript).</td></tr>
                <tr><td><strong>Input</strong></td><td>Tells you when the player taps, drags, or presses a key.</td></tr>
                <tr><td><strong>Audio + assets</strong></td><td>Loads and plays your images and sounds.</td></tr>
              </tbody>
            </table>
          </div>
          <h3>2D vs 3D</h3>
          <p>
            Games come in <strong>2D</strong> (flat — think Tetris, Block Blast, Candy Crush) and{' '}
            <strong>3D</strong> (think Minecraft or Call of Duty). 2D is dramatically simpler to learn
            and reason about: positions are just an <code>x</code> (across) and a <code>y</code> (up
            and down). Block Blast — the game we'll build in the companion guide — is pure 2D, which is
            perfect, because it lets you focus on <em>game logic</em> instead of cameras, lighting, and
            3D math. Everything in this guide is 2D.
          </p>
          <Note>
            <strong>You do not need to be good at math.</strong> For 2D puzzle games you mostly add and
            compare whole numbers (grid row 3, column 5). If you can fill in a spreadsheet, you have
            enough math for this.
          </Note>
          <h3>The shape of the journey</h3>
          <p>
            Here's the whole trip this guide takes you on, so you always know where you are:
          </p>
          <div className="arch-diagram">
            <span className="dim"># The path from nothing to an app on your phone</span>{'\n'}
            Install Godot  <span className="highlight">→</span>  Learn the editor  <span className="highlight">→</span>  Learn GDScript{'\n'}
            {'      '}<span className="highlight">↓</span>{'\n'}
            Make scenes &amp; UI  <span className="highlight">→</span>  Handle touch  <span className="highlight">→</span>  Save data{'\n'}
            {'      '}<span className="highlight">↓</span>{'\n'}
            Apple Developer acct  <span className="highlight">→</span>  Install Xcode  <span className="highlight">→</span>  Export to iOS{'\n'}
            {'      '}<span className="highlight">↓</span>{'\n'}
            Run on your iPhone  <span className="highlight">→</span>  Upload to TestFlight  <span className="highlight">→</span>  🎉
          </div>
        </section>

        <hr />

        {/* SECTION 2 — WHY GODOT */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Why Godot (vs Unity)</h2>
          <p>
            The two engines most beginners hear about are <strong>Unity</strong> and{' '}
            <strong>Godot</strong>. Both can ship a great iOS game. For <em>your</em> situation — a
            complete beginner, new to Mac, building a 2D puzzle game — this guide uses Godot. Here's the
            honest comparison so you understand the choice rather than just trusting it.
          </p>
          <table>
            <tbody>
              <tr><th>Consideration</th><th>Godot 4</th><th>Unity</th></tr>
              <tr><td>Download &amp; setup</td><td>One ~100&nbsp;MB app, no account, no installer</td><td>Multi-GB, Unity Hub + account + license activation</td></tr>
              <tr><td>Language</td><td>GDScript (reads like plain English / Python)</td><td>C# (more verbose, steeper for a first language)</td></tr>
              <tr><td>2D support</td><td>First-class, built from the ground up for 2D</td><td>Good, but 2D is layered on top of a 3D engine</td></tr>
              <tr><td>Cost</td><td>Free &amp; open-source, forever, no revenue cap</td><td>Free under a revenue threshold; licensing has changed before</td></tr>
              <tr><td>Tutorials online</td><td>Plenty, growing fast</td><td>The largest tutorial library of any engine</td></tr>
              <tr><td>iOS pipeline</td><td>Exports a clean Xcode project (Godot 4.2+)</td><td>Very mature, also exports an Xcode project</td></tr>
            </tbody>
          </table>
          <p>
            The single biggest reason for a beginner-on-a-new-Mac: <strong>friction</strong>. Godot is a
            single application you drag into your Applications folder. There is no account to create, no
            license server, no "Hub" app managing installs. You double-click and you are making a game.
            For a 2D puzzle game, Godot's 2D-first design is also genuinely nicer than Unity's.
          </p>
          <Note kind="warn">
            <strong>Where Unity wins:</strong> if you get stuck and paste an error into a search engine,
            Unity returns more results simply because it's older and bigger. That safety net is real. If
            you already know you want a career making 3D games, Unity may be the better long-term bet.
            For shipping <em>this</em> 2D game with the least pain, Godot is the right call.
          </Note>
          <h3>A note on the two Godot downloads</h3>
          <p>
            On the Godot website you'll see two versions: the <strong>standard</strong> build and the{' '}
            <strong>.NET / C#</strong> build. Use the <strong>standard</strong> one. The .NET build adds
            C# support that you do not need and that complicates iOS exports. Everything here uses
            standard Godot with GDScript.
          </p>
        </section>

        <hr />

        {/* SECTION 3 — MAC ORIENTATION */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Finding Your Way Around a Mac</h2>
          <p>
            If you're new to macOS, a few concepts will make everything later feel calmer. You can skim
            this if you're already comfortable, but the bits about <strong>Gatekeeper</strong> (section
            on installing Godot) trip up almost everyone, so don't skip those.
          </p>
          <h3>The landmarks</h3>
          <table>
            <tbody>
              <tr><th>Thing</th><th>Where</th><th>What it's for</th></tr>
              <tr><td><strong>Menu bar</strong></td><td>Thin strip at the very top of the screen</td><td>Shows menus for whatever app is in front. The Apple logo (far left) is system-wide.</td></tr>
              <tr><td><strong>Dock</strong></td><td>Row of icons at the bottom</td><td>Launch and switch apps. Drag an app here to pin it.</td></tr>
              <tr><td><strong>Finder</strong></td><td>The smiling face icon, far left of the Dock</td><td>Your file browser — like File Explorer on Windows.</td></tr>
              <tr><td><strong>Spotlight</strong></td><td>Press <code>⌘ Space</code></td><td>Type to launch any app or find any file instantly. Your fastest tool.</td></tr>
              <tr><td><strong>System Settings</strong></td><td>Apple menu → System Settings</td><td>All the knobs — Wi-Fi, security, displays, etc.</td></tr>
            </tbody>
          </table>
          <Note>
            <strong>The Command key (⌘) is the Mac's Ctrl.</strong> Copy is <code>⌘C</code>, paste is{' '}
            <code>⌘V</code>, save is <code>⌘S</code>, quit an app entirely is <code>⌘Q</code>. The key
            sits next to the spacebar.
          </Note>
          <h3>Your home folder and file paths</h3>
          <p>
            Every file on your Mac lives at a <strong>path</strong> — a chain of folders separated by
            slashes. Your personal files live in your <strong>home folder</strong>, written as{' '}
            <code>~</code> (the tilde). So <code>~/Documents</code> means "the Documents folder inside
            my home folder." A few you'll meet:
          </p>
          <div className="arch-diagram">
            <span className="dim"># Common Mac paths</span>{'\n'}
            ~/              <span className="dim"># your home folder (e.g. /Users/yourname)</span>{'\n'}
            ~/Documents     <span className="dim"># where we'll keep your Godot projects</span>{'\n'}
            ~/Downloads     <span className="dim"># where Safari saves files</span>{'\n'}
            /Applications   <span className="dim"># where installed apps live</span>
          </div>
          <h3>Installing an app from a download</h3>
          <p>
            Most Mac apps arrive one of two ways:
          </p>
          <ul>
            <li>A <strong>.dmg</strong> file (a "disk image"): double-click it, a window opens, and you
              drag the app's icon onto the <strong>Applications</strong> folder shortcut. Then "eject"
              the disk image (right-click it on the desktop or in Finder → Eject).</li>
            <li>A <strong>.zip</strong> file: double-click it and macOS unzips it into a regular app you
              can drag into Applications. Godot comes as a zip.</li>
          </ul>
          <Note kind="warn">
            <strong>Gatekeeper will stop you at least once.</strong> Apple blocks apps from developers it
            hasn't verified, showing a scary "cannot be opened because it is from an unidentified
            developer" message. This is normal for Godot. The fix (covered in the install section) is to{' '}
            <strong>right-click the app → Open</strong>, then confirm — instead of double-clicking.
          </Note>
        </section>

        <hr />

        {/* SECTION 4 — THE TERMINAL */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The Terminal, Gently</h2>
          <p>
            The <strong>Terminal</strong> is an app that lets you type commands instead of clicking. It
            looks intimidating — a blank window with a blinking cursor — but it's just another way to
            tell your Mac to do things. You'll need it only a couple of times (mostly when setting up
            iOS tools), so let's demystify it now and move on.
          </p>
          <h3>Opening it</h3>
          <p>
            Press <code>⌘ Space</code> to open Spotlight, type <code>Terminal</code>, and press Return.
            A window opens with a <strong>prompt</strong> that ends in a <code>%</code> or{' '}
            <code>$</code>. That's the computer saying "I'm ready for a command." Your Mac uses a shell
            called <strong>zsh</strong> — you don't need to know what that means, just that it's the
            thing reading your commands.
          </p>
          <h3>Five commands that cover almost everything</h3>
          <table>
            <tbody>
              <tr><th>Command</th><th>What it does</th></tr>
              <tr><td><code>pwd</code></td><td>"Print working directory" — shows which folder you're currently in.</td></tr>
              <tr><td><code>ls</code></td><td>Lists the files and folders where you are.</td></tr>
              <tr><td><code>cd Documents</code></td><td>"Change directory" — moves into the Documents folder. <code>cd ..</code> goes up one.</td></tr>
              <tr><td><code>cd ~</code></td><td>Jumps back to your home folder from anywhere.</td></tr>
              <tr><td><code>clear</code></td><td>Wipes the screen clean (the history is still there, scroll up).</td></tr>
            </tbody>
          </table>
          <p>Try it. Open Terminal and type these one at a time, pressing Return after each:</p>
          <CodePre>{`pwd
ls
cd Documents
ls
cd ~`}</CodePre>
          <p>
            Nothing you typed there can hurt anything — you only looked around. That's the key insight:
            most of what you'll do in Terminal is harmless navigation.
          </p>
          <Note kind="warn">
            <strong>Be careful with commands you copy from the internet.</strong> A command can delete
            files. Never paste a command you don't understand from an untrusted source, especially
            anything starting with <code>sudo rm</code>. Everything in this guide is safe and explained.
          </Note>
          <h3>Homebrew (optional, for later)</h3>
          <p>
            <strong>Homebrew</strong> is a "package manager" — a tool that installs other developer tools
            with one command. You won't strictly need it for Godot, but many iOS workflows use it, so
            it's good to have. To install it, paste this single line into Terminal and follow the prompts
            (it will ask for your Mac password — typing shows nothing, that's normal):
          </p>
          <CodePre>{`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`}</CodePre>
          <p>
            After it finishes it may print two <code>echo</code> lines to run so your Mac can find
            Homebrew. Copy-paste those exactly as shown, then close and reopen Terminal. Test it worked
            by typing <code>brew --version</code>.
          </p>
        </section>

        <hr />

        {/* SECTION 5 — INSTALLING GODOT */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Installing Godot 4</h2>
          <p>
            Now the fun part. Godot doesn't use an installer — you download it, unzip it, and it just
            runs. Here's the careful, beginner-proof version.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Go to the official site</div>
                <div className="tl-desc">Open Safari and visit <code>godotengine.org</code>. Click the big <strong>Download</strong> button, then the <strong>macOS</strong> download. Choose the <strong>standard</strong> version (NOT the .NET/C# one).</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Unzip it</div>
                <div className="tl-desc">The file lands in <code>~/Downloads</code> as something like <code>Godot_v4.x-stable_macos.universal.zip</code>. Double-click it. macOS unzips it into a <strong>Godot</strong> app right there.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Move it to Applications</div>
                <div className="tl-desc">Open Finder, open <code>~/Downloads</code>, and drag the <strong>Godot</strong> app onto <strong>Applications</strong> in the sidebar. Now it lives with your other apps and Spotlight can find it.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Open it the FIRST time with right-click → Open</div>
                <div className="tl-desc">This is the Gatekeeper step. In Applications, <strong>right-click</strong> (or Control-click) the Godot app and choose <strong>Open</strong>. A dialog warns it's from an unidentified developer — click <strong>Open</strong> again. You only do this once; after that you can launch normally.</div>
              </div>
            </div>
          </div>
          <Note kind="warn">
            <strong>If "Open" isn't offered, use System Settings.</strong> On newer macOS, double-click
            Godot, let it get blocked, then go to <strong>Apple menu → System Settings → Privacy &amp;
            Security</strong>, scroll down, and click <strong>"Open Anyway"</strong> next to the message
            about Godot. Then try launching again.
          </Note>
          <h3>"Apple Silicon" vs "Intel" — which Mac do I have?</h3>
          <p>
            The universal download runs on both, so you usually don't have to choose. But to know your
            chip: click the <strong>Apple menu → About This Mac</strong>. If "Chip" says{' '}
            <strong>Apple M1/M2/M3/M4</strong>, you're on Apple Silicon (most Macs since 2020). If it
            says an Intel processor, you're on an older Intel Mac. Godot runs great on both; Apple
            Silicon is just faster.
          </p>
          <h3>What you should see</h3>
          <p>
            When Godot opens, you land on the <strong>Project Manager</strong> — a window listing your
            projects (empty for now) with buttons to create or import one. If you see that window,
            you've installed Godot correctly. We'll explore it next.
          </p>
        </section>

        <hr />

        {/* SECTION 6 — PROJECT MANAGER */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The Project Manager</h2>
          <p>
            The Project Manager is the lobby you see before opening any single game. Each game you make
            is a <strong>project</strong> — a folder full of files. Let's create your first one so you
            have something to click around in while you learn.
          </p>
          <h3>Creating a project</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Click "Create" (or "New Project")</div>
                <div className="tl-desc">A dialog appears asking for a name and a location.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Name it and pick a folder</div>
                <div className="tl-desc">Name it <code>HelloGodot</code>. For "Project Path," click <strong>Browse</strong> and make a tidy home like <code>~/Documents/GodotProjects/HelloGodot</code>. Godot wants an <em>empty</em> folder — use "Create Folder" in the picker.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Choose the renderer</div>
                <div className="tl-desc">You'll see <strong>Forward+</strong>, <strong>Mobile</strong>, and <strong>Compatibility</strong>. For a 2D game headed to iPhone, choose <strong>Mobile</strong> (or <strong>Compatibility</strong> — even safer on older devices). You can change this later in settings.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Create &amp; Edit</div>
                <div className="tl-desc">Click <strong>Create &amp; Edit</strong>. Godot opens the main editor with your empty project. 🎉</div>
              </div>
            </div>
          </div>
          <Note>
            <strong>Why "Mobile" or "Compatibility"?</strong> These renderers use graphics features that
            every iPhone supports. "Forward+" targets powerful desktop GPUs and can cause problems or
            larger builds on phones. For a 2D puzzle game you lose nothing by choosing Mobile.
          </Note>
          <h3>What's inside a project folder</h3>
          <p>
            If you open your project folder in Finder, you'll see a couple of files. The important one is{' '}
            <code>project.godot</code> — that file is what makes a folder "a Godot project." Everything
            else (your scenes, scripts, images, sounds) you'll create as you build.
          </p>
          <div className="arch-diagram">
            <span className="dim"># ~/Documents/GodotProjects/HelloGodot</span>{'\n'}
            project.godot      <span className="dim"># the project marker + all settings</span>{'\n'}
            icon.svg           <span className="dim"># the default project icon</span>{'\n'}
            .godot/            <span className="dim"># auto-generated cache — never edit, don't commit</span>
          </div>
          <h3>Opening, closing, and switching projects</h3>
          <p>
            To leave a game and go back to the lobby, use the menu <strong>Project → Quit to Project
            List</strong>. Your project shows up there from now on; double-click it to reopen. You can
            keep as many projects as you like — one per game idea.
          </p>
        </section>

        <hr />

        {/* SECTION 7 — EDITOR TOUR */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>A Tour of the Editor</h2>
          <p>
            The Godot editor looks busy, but it's just a handful of panels around a central canvas.
            Learn the names of the panels and the rest stops being scary. Here's the layout you're
            looking at:
          </p>
          <MermaidDiagram theme="default" chart={`graph TB
  TOP["Top: workspace tabs (2D / 3D / Script / AssetLib) + Play buttons ▶"]
  LEFT["Left: Scene dock (the tree of nodes)<br/>+ FileSystem dock (your files)"]
  CENTER["Center: the Viewport — where you see and arrange your game"]
  RIGHT["Right: Inspector — every property of the selected node"]
  BOTTOM["Bottom: Output, Debugger, Audio, Animation panels"]
  TOP --- CENTER
  LEFT --- CENTER
  CENTER --- RIGHT
  CENTER --- BOTTOM`} />
          <h3>The panels, one by one</h3>
          <table>
            <tbody>
              <tr><th>Panel</th><th>Where</th><th>What it's for</th></tr>
              <tr><td><strong>Viewport</strong></td><td>Center</td><td>The stage. Drag to pan, scroll to zoom. You arrange your game here.</td></tr>
              <tr><td><strong>Scene dock</strong></td><td>Top-left</td><td>A tree of the <em>nodes</em> in the scene you're editing. The heart of Godot.</td></tr>
              <tr><td><strong>FileSystem dock</strong></td><td>Bottom-left</td><td>Every file in your project — scenes, scripts, images, sounds.</td></tr>
              <tr><td><strong>Inspector</strong></td><td>Right</td><td>Shows and edits every property of whatever node you've selected.</td></tr>
              <tr><td><strong>Bottom panels</strong></td><td>Bottom</td><td><strong>Output</strong> shows your <code>print()</code> messages; <strong>Debugger</strong> shows errors.</td></tr>
            </tbody>
          </table>
          <h3>The workspace tabs</h3>
          <p>
            Across the top center you'll see <strong>2D</strong>, <strong>3D</strong>,{' '}
            <strong>Script</strong>, and <strong>AssetLib</strong>. These switch what the center shows.
            You'll live in <strong>2D</strong> (arranging your game) and <strong>Script</strong>
            (writing code). Click between them freely — they don't change anything, they just change
            your view.
          </p>
          <h3>The Play buttons</h3>
          <p>
            Top-right are the playback controls. The most important is the first one — usually described
            as <strong>Run Project</strong> (keyboard <code>F5</code>). It launches your whole game in a
            window. There's also <strong>Run Current Scene</strong> (<code>F6</code>) which runs just the
            scene you're editing — handy for testing one piece without launching everything.
          </p>
          <Note>
            <strong>Don't panic about memorizing this.</strong> You'll learn the panels by using them.
            For now just know: <em>tree of stuff = Scene dock, files = FileSystem, properties =
            Inspector, messages = Output</em>.
          </Note>
        </section>

        <hr />

        {/* SECTION 8 — NODES & SCENES */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Nodes &amp; Scenes</h2>
          <p>
            This is <em>the</em> core idea in Godot. Get this and everything else clicks into place.
          </p>
          <h3>A node is one small thing that does one job</h3>
          <p>
            A <strong>node</strong> is the basic building block — a single LEGO brick. Each node type has
            one job. A <code>Sprite2D</code> node shows a picture. A <code>Label</code> node shows text.
            An <code>AudioStreamPlayer</code> node plays a sound. A <code>Button</code> node is a button.
            You build a game by combining many small nodes.
          </p>
          <h3>Nodes live in a tree (parents and children)</h3>
          <p>
            Nodes are arranged in a <strong>tree</strong>, like folders inside folders. A node can have
            <strong> child</strong> nodes. Children move with their parent: if you move a "Player" node,
            its child "Hat" sprite moves too. This parent-child relationship is how you group things that
            belong together.
          </p>
          <MermaidDiagram theme="default" chart={`graph TB
  ROOT["Player (the parent)"]
  ROOT --> SPR["Sprite2D — the player's picture"]
  ROOT --> COL["CollisionShape2D — its hitbox"]
  ROOT --> SND["AudioStreamPlayer — its jump sound"]
  ROOT --> HAT["Sprite2D — a hat, moves with the player"]`} />
          <h3>A scene is a saved group of nodes</h3>
          <p>
            When you save a tree of nodes to a file, that's a <strong>scene</strong> (a{' '}
            <code>.tscn</code> file). A scene can be a whole screen (the main menu), or one reusable
            thing (a single block, an enemy, a button). The magic: <strong>you can put a scene inside
            another scene</strong>. This is called <em>instancing</em>.
          </p>
          <p>
            Imagine you design one "Block" scene — a colored square with its own behavior. Then your
            "Game" scene can create 50 copies (instances) of that Block scene. Fix a bug in the Block
            scene once, and all 50 copies get the fix. This reuse is why the node/scene system is so
            powerful.
          </p>
          <div className="card">
            <h4>The mental model in one line</h4>
            <p style={{ marginBottom: 0 }}>
              <strong>Nodes</strong> are bricks · a <strong>tree of nodes</strong> is a scene ·{' '}
              <strong>scenes can nest inside scenes</strong> · that nesting is how you reuse and organize
              everything.
            </p>
          </div>
          <Note kind="warn">
            <strong>"Scene" doesn't mean "level."</strong> Beginners assume a scene is like a movie scene
            or a game level. It can be — but a single button is also a scene. Think "a reusable bundle of
            nodes," any size.
          </Note>
        </section>

        <hr />

        {/* SECTION 9 — NODE ZOO */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>The Node Zoo</h2>
          <p>
            Godot has hundreds of node types, but a 2D puzzle game uses maybe a dozen. Here are the ones
            you'll actually meet, grouped by what they do. You don't need to memorize these — just know
            they exist so you recognize them later.
          </p>
          <h4>Structure &amp; positioning</h4>
          <table>
            <tbody>
              <tr><th>Node</th><th>What it does</th></tr>
              <tr><td><code>Node</code></td><td>The plainest node — no position, no visuals. Good as an organizer or a script holder.</td></tr>
              <tr><td><code>Node2D</code></td><td>A node with a 2D position, rotation, and scale. The base for anything you place on screen.</td></tr>
              <tr><td><code>CanvasLayer</code></td><td>A layer that ignores the camera — perfect for UI that stays fixed (score, buttons).</td></tr>
            </tbody>
          </table>
          <h4>Visuals</h4>
          <table>
            <tbody>
              <tr><th>Node</th><th>What it does</th></tr>
              <tr><td><code>Sprite2D</code></td><td>Shows an image (a <code>.png</code>). The workhorse for art.</td></tr>
              <tr><td><code>ColorRect</code></td><td>A solid-colored rectangle. We'll use these as blocks — no art files needed!</td></tr>
              <tr><td><code>Label</code></td><td>Shows text — score, titles, "Game Over."</td></tr>
              <tr><td><code>Polygon2D</code> / <code>Line2D</code></td><td>Draw custom shapes and lines.</td></tr>
            </tbody>
          </table>
          <h4>Interaction &amp; logic</h4>
          <table>
            <tbody>
              <tr><th>Node</th><th>What it does</th></tr>
              <tr><td><code>Area2D</code></td><td>A region that detects when things enter or overlap it. Great for "did the player tap here?"</td></tr>
              <tr><td><code>CollisionShape2D</code></td><td>Defines the actual shape (a rectangle, circle) for an Area2D or body.</td></tr>
              <tr><td><code>Button</code></td><td>A clickable/tappable UI button that emits a "pressed" signal.</td></tr>
              <tr><td><code>Timer</code></td><td>Counts down and fires a signal — for delays, spawns, countdowns.</td></tr>
              <tr><td><code>AudioStreamPlayer</code></td><td>Plays a sound or music track.</td></tr>
            </tbody>
          </table>
          <h4>UI containers (for laying out menus)</h4>
          <table>
            <tbody>
              <tr><th>Node</th><th>What it does</th></tr>
              <tr><td><code>Control</code></td><td>The base type for all UI. Has anchors for responsive layout.</td></tr>
              <tr><td><code>VBoxContainer</code> / <code>HBoxContainer</code></td><td>Stack children vertically / horizontally, automatically.</td></tr>
              <tr><td><code>GridContainer</code></td><td>Arranges children in a grid of N columns — handy for a board or a button pad.</td></tr>
            </tbody>
          </table>
          <Note>
            <strong>How to add any node:</strong> in the Scene dock, click the <strong>+</strong> button
            (or press <code>⌘A</code>), then type the node's name in the search box and press Create.
            That search box is how you'll find every node above.
          </Note>
        </section>

        <hr />

        {/* SECTION 10 — YOUR FIRST SCENE */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Your First Scene</h2>
          <p>
            Enough theory — let's make something appear on screen and press Play. We'll show a label and
            a colored square. Follow along in your <code>HelloGodot</code> project.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Create a root node</div>
                <div className="tl-desc">In the Scene dock (top-left), Godot offers to create a root. Click <strong>Other Node</strong>, search <code>Node2D</code>, and create it. Double-click its name and rename it <code>Main</code>.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Add a Label child</div>
                <div className="tl-desc">With <code>Main</code> selected, click the <strong>+</strong>, search <code>Label</code>, create it. In the Inspector (right), find the <strong>Text</strong> property and type <code>Hello, Godot!</code>. It appears in the viewport.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Add a ColorRect child</div>
                <div className="tl-desc">Select <code>Main</code> again, add a <code>ColorRect</code>. In the Inspector set its <strong>Color</strong> to something bright and drag its corners in the viewport to size it. Drag it below the label.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">Save the scene</div>
                <div className="tl-desc">Press <code>⌘S</code>. Name it <code>main.tscn</code> and save it in your project. You'll now see it in the FileSystem dock.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">5</div>
              <div className="tl-content">
                <div className="tl-title">Set it as the main scene &amp; Play</div>
                <div className="tl-desc">Press <code>F5</code>. Godot asks which scene to run when the game starts — choose <strong>Select Current</strong>. A window opens showing your label and square. You just ran a game! 🎉</div>
              </div>
            </div>
          </div>
          <Note>
            <strong>The "main scene"</strong> is the one that loads when your game launches. You set it
            once; change it later under <strong>Project → Project Settings → Application → Run → Main
            Scene</strong>.
          </Note>
          <p>
            That window you saw <em>is</em> your game — Godot ran the game loop, drew your nodes 60 times
            a second, and showed the result. Close it with <code>⌘Q</code> or by clicking the red dot.
            Everything from here is adding rules and interactivity to scenes like this one.
          </p>
        </section>

        <hr />

        {/* SECTION 11 — GDSCRIPT BASICS */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>GDScript: The Basics</h2>
          <p>
            <strong>GDScript</strong> is Godot's built-in programming language. It's designed to be easy
            to read — if you've seen Python, it'll feel familiar; if you haven't, it still reads almost
            like English. A script is a text file of instructions you <strong>attach to a node</strong>{' '}
            to give it behavior.
          </p>
          <h3>Attaching a script</h3>
          <p>
            Select a node in the Scene dock, then click the <strong>"Attach Script"</strong> icon (a
            scroll with a +) at the top of the dock, or right-click the node → <strong>Attach
            Script</strong>. Accept the defaults and Godot creates a script and opens the Script
            workspace. You'll see a starter file like this:
          </p>
          <CodePre>{`extends Node2D

# Called once when this node enters the game.
func _ready():
	print("Hello from my script!")

# Called every frame. 'delta' is seconds since the last frame.
func _process(delta):
	pass`}</CodePre>
          <p>Let's decode every piece of that:</p>
          <table>
            <tbody>
              <tr><th>Piece</th><th>Meaning</th></tr>
              <tr><td><code>extends Node2D</code></td><td>"This script adds behavior to a Node2D." It must match the node's type.</td></tr>
              <tr><td><code># ...</code></td><td>A comment — a note for humans. Godot ignores everything after <code>#</code>.</td></tr>
              <tr><td><code>func _ready():</code></td><td>Defines a function named <code>_ready</code>. Godot calls it automatically once, when the node is ready.</td></tr>
              <tr><td><code>print(...)</code></td><td>Writes a message to the Output panel — your main tool for "is my code running?"</td></tr>
              <tr><td><code>func _process(delta):</code></td><td>Godot calls this every frame. <code>delta</code> is the time since the last frame.</td></tr>
              <tr><td><code>pass</code></td><td>"Do nothing." A placeholder so an empty function is still valid.</td></tr>
            </tbody>
          </table>
          <Note kind="warn">
            <strong>Indentation matters in GDScript.</strong> The lines inside a function must be indented
            (one Tab). This isn't decoration — it's how GDScript knows which lines belong to the function.
            Godot's editor indents for you; just don't delete the leading Tab.
          </Note>
          <h3>Variables — boxes that hold values</h3>
          <p>
            A <strong>variable</strong> stores a value under a name so you can use it later. Use{' '}
            <code>var</code> to make one, or <code>const</code> for a value that never changes:
          </p>
          <CodePre>{`var score = 0            # a number that can change
var player_name = "Sam"  # text (called a "String")
var is_game_over = false # true or false (a "bool")
const GRID_SIZE = 8      # never changes — convention is ALL_CAPS

score = score + 10       # update it later
score += 10              # shorthand for the same thing
print(score)             # shows 20 in the Output panel`}</CodePre>
          <h3>The common value types</h3>
          <table>
            <tbody>
              <tr><th>Type</th><th>Example</th><th>Used for</th></tr>
              <tr><td><code>int</code></td><td><code>42</code></td><td>Whole numbers — score, grid row.</td></tr>
              <tr><td><code>float</code></td><td><code>3.5</code></td><td>Decimal numbers — positions, time.</td></tr>
              <tr><td><code>String</code></td><td><code>"Game Over"</code></td><td>Text.</td></tr>
              <tr><td><code>bool</code></td><td><code>true</code> / <code>false</code></td><td>Yes/no flags.</td></tr>
              <tr><td><code>Vector2</code></td><td><code>Vector2(100, 50)</code></td><td>A 2D point — x and y together. Positions are Vector2s.</td></tr>
            </tbody>
          </table>
          <h3>Try it</h3>
          <p>
            Replace your <code>_ready</code> with this, attach the script to <code>Main</code>, and press
            <code> F5</code>. Watch the Output panel at the bottom:
          </p>
          <CodePre>{`func _ready():
	var greeting = "Hello"
	var times = 3
	for i in range(times):
		print(greeting, " #", i)`}</CodePre>
          <p>
            You should see three lines. <code>for i in range(3)</code> repeats the indented block three
            times with <code>i</code> being 0, then 1, then 2. Loops like this are everywhere in games —
            we'll use them to walk over every cell of the Block Blast grid.
          </p>
        </section>

        <hr />

        {/* SECTION 12 — GDSCRIPT FURTHER */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>GDScript: Going Further</h2>
          <p>
            A handful more building blocks and you'll have everything the Block Blast guide needs.
          </p>
          <h3>Making decisions with if</h3>
          <CodePre>{`var score = 120

if score >= 100:
	print("You broke 100!")
elif score >= 50:
	print("Halfway there.")
else:
	print("Keep going.")`}</CodePre>
          <p>
            <code>if</code> runs its block only when the condition is true. <code>elif</code> ("else if")
            checks another condition; <code>else</code> catches everything else. The comparison operators
            are <code>==</code> (equal), <code>!=</code> (not equal), and{' '}
            <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>.
          </p>
          <h3>Lists of things: arrays</h3>
          <p>
            An <strong>array</strong> holds many values in order. We'll use one to hold the three pieces
            in the Block Blast tray. Items are numbered starting at <strong>0</strong>:
          </p>
          <CodePre>{`var tray = ["L-shape", "square", "line"]

print(tray[0])     # "L-shape" — first item is index 0
print(tray.size()) # 3 — how many items
tray.append("dot") # add to the end
tray.remove_at(1)  # remove the item at index 1 ("square")

for piece in tray: # visit every item
	print(piece)`}</CodePre>
          <h3>Labeled boxes: dictionaries</h3>
          <p>
            A <strong>dictionary</strong> stores values under named keys (instead of numbered slots).
            Great for describing a thing with several properties:
          </p>
          <CodePre>{`var piece = {
	"name": "L-shape",
	"color": Color.ORANGE,
	"cells": [Vector2(0,0), Vector2(0,1), Vector2(1,1)],
}

print(piece["name"])   # "L-shape"
piece["used"] = true   # add a new key anytime`}</CodePre>
          <h3>Your own functions</h3>
          <p>
            A <strong>function</strong> is a named chunk of code you can run on demand. It can take
            <strong> parameters</strong> (inputs) and <strong>return</strong> a value (an output):
          </p>
          <CodePre>{`# Takes two numbers, returns their sum.
func add(a, b):
	return a + b

# Takes a row+col, returns true if it's on an 8x8 board.
func is_on_board(row, col):
	return row >= 0 and row < 8 and col >= 0 and col < 8

func _ready():
	print(add(2, 3))            # 5
	print(is_on_board(4, 9))    # false — column 9 is off the board`}</CodePre>
          <h3>Classes &amp; extends</h3>
          <p>
            Every script starts with <code>extends</code> something — it means "my script is a kind of
            that node, plus my extra code." When you write <code>extends Node2D</code>, your script{' '}
            <em>is</em> a Node2D and can do everything a Node2D does, plus whatever functions and
            variables you add. That's all you need to know about classes for now.
          </p>
          <h3>The lifecycle functions you'll use constantly</h3>
          <table>
            <tbody>
              <tr><th>Function</th><th>Godot calls it…</th><th>Use it to…</th></tr>
              <tr><td><code>_ready()</code></td><td>Once, when the node is added to the game</td><td>Set things up — build the board, deal pieces.</td></tr>
              <tr><td><code>_process(delta)</code></td><td>Every single frame</td><td>Smooth animation, anything that changes over time.</td></tr>
              <tr><td><code>_input(event)</code></td><td>Whenever the player does something</td><td>React to taps, drags, key presses.</td></tr>
            </tbody>
          </table>
          <Note>
            <strong>You now know enough GDScript to build a game.</strong> Variables, if, arrays,
            dictionaries, functions, and the three lifecycle functions cover the vast majority of the
            Block Blast code. Everything else you'll pick up in context.
          </Note>
        </section>

        <hr />

        {/* SECTION 13 — INSPECTOR & @export */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>The Inspector &amp; @export</h2>
          <p>
            The <strong>Inspector</strong> (the right-hand panel) is where you edit a node's properties
            without writing code. Select a <code>Label</code> and you can change its text, font size, and
            color by clicking. Select a <code>ColorRect</code> and you can change its color. Every node
            type shows different properties here.
          </p>
          <h3>Exposing your own variables to the Inspector</h3>
          <p>
            Here's a lovely trick. Put <code>@export</code> in front of a variable in your script, and
            that variable shows up in the Inspector as an editable field. This lets you tweak values
            without touching code — and lets the same script behave differently on different nodes:
          </p>
          <CodePre>{`extends Node2D

@export var speed: float = 200.0
@export var block_color: Color = Color.CYAN
@export var rows: int = 8

func _ready():
	print("This block moves at ", speed)`}</CodePre>
          <p>
            Now select the node, look at the Inspector, and you'll see <strong>Speed</strong>,{' '}
            <strong>Block Color</strong>, and <strong>Rows</strong> fields at the top — already filled
            with your defaults, ready to change. This is how you build flexible, reusable scenes.
          </p>
          <div className="card">
            <h4>Typed variables</h4>
            <p style={{ marginBottom: 0 }}>
              Notice <code>speed: float</code> — the <code>: float</code> tells Godot the variable holds
              a decimal number. Adding types like <code>: int</code>, <code>: String</code>, or{' '}
              <code>: Color</code> is optional but recommended: Godot catches mistakes earlier and the
              Inspector shows the right kind of editor (a color picker for <code>Color</code>, etc.).
            </p>
          </div>
          <Note>
            <strong>Resources</strong> are reusable data assets (a font, a texture, a theme). When the
            Inspector shows a slot like "Texture" or "Theme," you drag a file from the FileSystem dock
            into it. You'll do this for fonts and sounds later.
          </Note>
        </section>

        <hr />

        {/* SECTION 14 — SIGNALS */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Signals</h2>
          <p>
            <strong>Signals</strong> are how nodes announce that something happened, so other nodes can
            react — without being tightly tied together. It's the "don't call us, we'll call you"
            pattern. A Button doesn't need to know what your game does; it just <em>emits</em> a{' '}
            <code>pressed</code> signal, and whoever cares can listen.
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  BTN["Button node"] -->|emits 'pressed'| HANDLER["your function<br/>_on_button_pressed()"]
  TIMER["Timer node"] -->|emits 'timeout'| HANDLER2["your function<br/>_on_timer_timeout()"]
  AREA["Area2D node"] -->|emits 'input_event'| HANDLER3["your function<br/>handle the tap"]`} />
          <h3>Connecting a signal in the editor (the easy way)</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Select the node that emits</div>
                <div className="tl-desc">Click your Button in the Scene dock.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Open the Node panel</div>
                <div className="tl-desc">On the right, switch from <strong>Inspector</strong> to the <strong>Node</strong> tab. You'll see a list of signals — for a Button, <code>pressed()</code> is at the top.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">3</div>
              <div className="tl-content">
                <div className="tl-title">Double-click "pressed()" and Connect</div>
                <div className="tl-desc">Pick the node whose script should react (often the parent), click <strong>Connect</strong>, and Godot writes a function stub for you, ready to fill in.</div>
              </div>
            </div>
          </div>
          <p>The generated function looks like this — you just add what should happen:</p>
          <CodePre>{`func _on_button_pressed():
	print("The button was tapped!")
	# start the game, restart, whatever you want here`}</CodePre>
          <h3>Connecting in code (the flexible way)</h3>
          <p>
            You can also connect in script, which is handy when you create nodes dynamically (like 64
            grid cells):
          </p>
          <CodePre>{`func _ready():
	$Button.pressed.connect(_on_button_pressed)
	$Timer.timeout.connect(_on_timer_done)

func _on_timer_done():
	print("Time's up!")`}</CodePre>
          <p>
            That <code>$Button</code> means "the child node named Button." The <code>$</code> is a
            shortcut for grabbing child nodes by name — you'll use it constantly.
          </p>
          <h3>Your own custom signals</h3>
          <p>
            You can declare signals too, to announce your own game events. For example, the board can
            announce when lines were cleared, and the score system listens:
          </p>
          <CodePre>{`# In the Board script:
signal lines_cleared(count)

func clear_full_lines():
	# ...after clearing 2 lines...
	lines_cleared.emit(2)   # announce it

# In the Score script:
func _ready():
	board.lines_cleared.connect(_on_lines_cleared)

func _on_lines_cleared(count):
	add_score(count * 100)`}</CodePre>
          <Note>
            <strong>Why bother?</strong> Signals keep your code loosely coupled. The board doesn't need
            to know the score exists — it just shouts "lines cleared!" into the room. This makes games
            far easier to grow and debug.
          </Note>
        </section>

        <hr />

        {/* SECTION 15 — INPUT & TOUCH */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>Handling Input &amp; Touch</h2>
          <p>
            On a phone, "input" means fingers: taps, drags, lifts. Godot gives you two ways to handle
            input, and you'll use both.
          </p>
          <h3>Input actions (named inputs)</h3>
          <p>
            For things like "jump" or "pause," you define a named <strong>action</strong> and map keys or
            buttons to it. Go to <strong>Project → Project Settings → Input Map</strong>, type an action
            name like <code>pause</code>, add it, then assign a key. In code you check it by name:
          </p>
          <CodePre>{`func _process(delta):
	if Input.is_action_just_pressed("pause"):
		print("Pause pressed")`}</CodePre>
          <p>
            The benefit: your code says <code>"pause"</code>, not "the Escape key," so you can remap
            inputs without touching code. For a touch puzzle game you'll use this less, but it's good to
            know.
          </p>
          <h3>Raw touch events</h3>
          <p>
            For dragging blocks, you want the raw finger events. Godot delivers them to{' '}
            <code>_input(event)</code>. The two you care about for touch:
          </p>
          <table>
            <tbody>
              <tr><th>Event type</th><th>Fires when…</th></tr>
              <tr><td><code>InputEventScreenTouch</code></td><td>A finger presses down (<code>pressed == true</code>) or lifts (<code>pressed == false</code>).</td></tr>
              <tr><td><code>InputEventScreenDrag</code></td><td>A finger already down moves across the screen.</td></tr>
            </tbody>
          </table>
          <CodePre>{`func _input(event):
	if event is InputEventScreenTouch:
		if event.pressed:
			print("Finger DOWN at ", event.position)
		else:
			print("Finger UP at ", event.position)
	elif event is InputEventScreenDrag:
		print("Finger DRAG to ", event.position)`}</CodePre>
          <p>
            <code>event.position</code> is a <code>Vector2</code> — the x/y point on screen the finger
            touched. That single value is the foundation of drag-and-drop: on touch-down you figure out
            which piece was grabbed, on drag you move it to follow the finger, on touch-up you try to
            place it.
          </p>
          <Note kind="warn">
            <strong>Test touch on your computer with the mouse.</strong> Godot can treat mouse clicks as
            touches. Turn on <strong>Project Settings → Input Devices → Pointing → Emulate Touch From
            Mouse</strong> so your desktop testing behaves like a phone. There's also "Emulate Mouse From
            Touch" for the reverse.
          </Note>
        </section>

        <hr />

        {/* SECTION 16 — 2D SPACE */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>2D Space &amp; Transforms</h2>
          <p>
            Everything on screen has a <strong>position</strong> — where it sits. In 2D that's a{' '}
            <code>Vector2</code> with an <code>x</code> and a <code>y</code>. Two things surprise
            beginners, so let's get them straight now.
          </p>
          <h3>Y points DOWN</h3>
          <p>
            In school graphs, y goes up. On screens, <strong>y goes down</strong> — <code>(0, 0)</code> is
            the top-left corner, and bigger y means lower on the screen. So moving something "down" means{' '}
            <em>increasing</em> its y.
          </p>
          <div className="arch-diagram">
            (0,0) <span className="highlight">●</span>─────────────→ +x (right){'\n'}
            {'  '}│{'\n'}
            {'  '}│{'    '}<span className="dim">a sprite at (200, 150)</span>{'\n'}
            {'  '}│{'           '}<span className="highlight">■</span>{'\n'}
            {'  '}↓{'\n'}
            {'  '}+y (down)
          </div>
          <h3>The three transform properties</h3>
          <table>
            <tbody>
              <tr><th>Property</th><th>Type</th><th>Meaning</th></tr>
              <tr><td><code>position</code></td><td>Vector2</td><td>Where the node is, relative to its parent.</td></tr>
              <tr><td><code>rotation</code></td><td>float (radians)</td><td>How much it's turned. Use <code>rotation_degrees</code> if you prefer degrees.</td></tr>
              <tr><td><code>scale</code></td><td>Vector2</td><td>Size multiplier. <code>Vector2(2, 2)</code> is double size.</td></tr>
            </tbody>
          </table>
          <CodePre>{`func _ready():
	position = Vector2(100, 50)   # place it
	position.x += 10              # nudge right
	position.y += 10              # nudge DOWN (remember: +y is down)
	scale = Vector2(1.5, 1.5)     # 50% bigger
	rotation_degrees = 45         # turn it`}</CodePre>
          <h3>Local vs global position</h3>
          <p>
            A child's <code>position</code> is measured from its <strong>parent</strong>, not the screen.
            If the parent is at <code>(100, 100)</code> and the child's position is <code>(10, 0)</code>,
            the child appears at <code>(110, 100)</code> on screen. When you need the true on-screen spot,
            use <code>global_position</code>. This matters when you convert a finger's screen position
            into "which grid cell is that?"
          </p>
          <Note>
            <strong>CanvasLayer keeps UI still.</strong> If you put your score Label and buttons under a{' '}
            <code>CanvasLayer</code>, they ignore any camera movement and stay pinned to the screen — exactly
            what you want for a heads-up display.
          </Note>
        </section>

        <hr />

        {/* SECTION 17 — DRAWING WITHOUT ART */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">17</span>Drawing Without Art</h2>
          <p>
            You don't need to be an artist or download a single image to make a polished-looking puzzle
            game. Block Blast is just colored squares with rounded corners — Godot can draw all of that
            for you. Here are your three options, simplest first.
          </p>
          <h3>Option 1 — ColorRect (a solid rectangle)</h3>
          <p>
            The easiest. Add a <code>ColorRect</code> node, set its <strong>Color</strong> and{' '}
            <strong>Size</strong> in the Inspector, done. Our entire Block Blast board can be built from
            ColorRects. In code:
          </p>
          <CodePre>{`var cell = ColorRect.new()
cell.color = Color.html("#4FC3F7")   # a nice blue
cell.size = Vector2(64, 64)
cell.position = Vector2(0, 0)
add_child(cell)`}</CodePre>
          <h3>Option 2 — Custom drawing with _draw()</h3>
          <p>
            For rounded corners, borders, and circles, override the <code>_draw()</code> function on any
            CanvasItem and call drawing commands. Call <code>queue_redraw()</code> whenever it should
            repaint:
          </p>
          <CodePre>{`extends Node2D

@export var block_color: Color = Color.html("#4FC3F7")

func _draw():
	var rect = Rect2(Vector2.ZERO, Vector2(64, 64))
	# Rounded-ish look: fill, then a lighter top edge.
	draw_rect(rect, block_color)
	draw_rect(rect, block_color.lightened(0.25), false, 3.0)

func _ready():
	queue_redraw()`}</CodePre>
          <p>
            Common <code>_draw()</code> commands: <code>draw_rect()</code>,{' '}
            <code>draw_circle()</code>, <code>draw_line()</code>, and <code>draw_string()</code> for text.
            This is how you get that custom, juicy look without art files.
          </p>
          <h3>Option 3 — Sprite2D (a real image)</h3>
          <p>
            When you <em>do</em> want art, drop a <code>.png</code> into your project's FileSystem, add a{' '}
            <code>Sprite2D</code>, and drag the image into its <strong>Texture</strong> slot. Good for
            logos, backgrounds, and icons.
          </p>
          <h3>Colors in Godot</h3>
          <CodePre>{`var a = Color.html("#FF5252")     # from a hex code
var b = Color(0.2, 0.6, 1.0)      # red, green, blue from 0-1
var c = Color(0.2, 0.6, 1.0, 0.5) # ...with 50% transparency (alpha)
var d = Color.ORANGE              # built-in named colors
var lighter = a.lightened(0.3)    # 30% toward white
var darker  = a.darkened(0.3)     # 30% toward black`}</CodePre>
          <Note>
            <strong>A pleasant palette goes a long way.</strong> Pick 5–6 bright, slightly different
            colors for your block types and you'll have a game that <em>looks</em> designed — no
            illustration skills required.
          </Note>
        </section>

        <hr />

        {/* SECTION 18 — SOUND & MUSIC */}
        <section className="section" id="s18" ref={setRef('s18')}>
          <h2><span className="section-num">18</span>Sound &amp; Music</h2>
          <p>
            Sound is the cheapest way to make a game feel alive. A little "click" when you place a piece
            and a satisfying "pop" when lines clear transforms the feel. Godot plays sound through{' '}
            <code>AudioStreamPlayer</code> nodes.
          </p>
          <h3>Getting sound files</h3>
          <p>
            You need short audio files in <code>.wav</code> (best for quick sound effects) or{' '}
            <code>.ogg</code> (best for longer music) format. Free sources include sites like{' '}
            <strong>freesound.org</strong> and game-asset bundles on <strong>itch.io</strong>. Drag the
            files into your project's FileSystem dock — Godot imports them automatically.
          </p>
          <Note kind="warn">
            <strong>Check the license.</strong> "Free" isn't always "free to ship." Prefer assets marked{' '}
            <strong>CC0 / public domain</strong> (no attribution required) or read the license and credit
            the author if asked. This matters once your game is on the App Store.
          </Note>
          <h3>Playing a sound effect</h3>
          <p>
            Add an <code>AudioStreamPlayer</code> node, drag your <code>.wav</code> into its{' '}
            <strong>Stream</strong> slot in the Inspector, then call <code>play()</code> from code:
          </p>
          <CodePre>{`extends Node

func _ready():
	$PlaceSound.play()   # play the sound on the child named PlaceSound

func play_clear():
	$ClearSound.play()`}</CodePre>
          <h3>One reusable sound helper</h3>
          <p>
            Rather than scatter AudioStreamPlayers everywhere, many games make a tiny "SFX" helper they
            can call from anywhere. We'll build one in the Block Blast guide using an{' '}
            <strong>autoload</strong> (next section). The idea:
          </p>
          <CodePre>{`# Sfx.gd — registered as an autoload named "Sfx"
extends Node

@onready var place := $Place
@onready var clear := $Clear
@onready var over := $GameOver

func play_place(): place.play()
func play_clear(): clear.play()
func play_over():  over.play()

# Then anywhere in your game:
# Sfx.play_clear()`}</CodePre>
          <h3>Audio buses (volume groups)</h3>
          <p>
            The bottom <strong>Audio</strong> panel lets you create <strong>buses</strong> — volume
            channels like "Music" and "SFX." Route players to a bus (Inspector → <strong>Bus</strong>)
            and you can offer separate music/effects volume sliders, or mute one group, with a single
            control. Optional for a first game, but nice to know it's there.
          </p>
        </section>

        <hr />

        {/* SECTION 19 — BUILDING UI */}
        <section className="section" id="s19" ref={setRef('s19')}>
          <h2><span className="section-num">19</span>Building UI</h2>
          <p>
            Menus, score displays, buttons, "Game Over" screens — all of that is <strong>UI</strong>, and
            in Godot it's built from <code>Control</code> nodes. Control nodes are special: instead of a
            single position, they have <strong>anchors</strong> and <strong>containers</strong> that make
            them lay out responsively across different screen sizes (crucial — iPhones come in many
            sizes).
          </p>
          <h3>Anchors — pinning to screen edges</h3>
          <p>
            An anchor says "stay relative to this part of the screen." Anchor a score Label to the
            top-left and it hugs the top-left on every device; anchor a button to the bottom-center and
            it stays centered at the bottom. In the toolbar above the viewport, the{' '}
            <strong>Anchors Preset</strong> dropdown gives one-click presets (Top Left, Center, Full
            Rect, etc.).
          </p>
          <h3>Containers — automatic layout</h3>
          <p>
            Containers position their children for you, so you don't hand-place everything:
          </p>
          <table>
            <tbody>
              <tr><th>Container</th><th>Arranges children…</th></tr>
              <tr><td><code>VBoxContainer</code></td><td>In a vertical stack (menu buttons down the screen).</td></tr>
              <tr><td><code>HBoxContainer</code></td><td>In a horizontal row (the three pieces in the tray).</td></tr>
              <tr><td><code>GridContainer</code></td><td>In a grid of N columns (a button pad, or a board).</td></tr>
              <tr><td><code>CenterContainer</code></td><td>Centers its child (a "Game Over" panel).</td></tr>
              <tr><td><code>MarginContainer</code></td><td>Adds padding around its child (keep UI off the screen edges).</td></tr>
            </tbody>
          </table>
          <h3>A simple main menu, by hand</h3>
          <p>The structure for a title-screen menu looks like this in the Scene dock:</p>
          <div className="arch-diagram">
            Control <span className="dim">(root, Full Rect anchor)</span>{'\n'}
            └─ CenterContainer <span className="dim">(Full Rect)</span>{'\n'}
            {'   '}└─ VBoxContainer{'\n'}
            {'      '}├─ Label <span className="dim">"BLOCK BLAST"</span>{'\n'}
            {'      '}├─ Label <span className="dim">"Best: 1280"</span>{'\n'}
            {'      '}├─ Button <span className="dim">"Play"</span>{'\n'}
            {'      '}└─ Button <span className="dim">"Quit"</span>
          </div>
          <p>
            The CenterContainer centers the VBox; the VBox stacks the label and buttons. Connect the Play
            button's <code>pressed</code> signal to a function that switches scenes (next section), and
            you have a working menu.
          </p>
          <h3>Theming</h3>
          <p>
            To restyle all your UI at once — fonts, colors, button look — create a <strong>Theme</strong>{' '}
            resource and assign it to your root Control. Every child inherits it. For a first game you can
            skip deep theming and just set font sizes and colors per node, but know that Themes exist when
            you want a consistent style.
          </p>
          <Note>
            <strong>Two worlds: nodes that move vs UI.</strong> <code>Node2D</code>-based things use raw
            x/y positions (your blocks). <code>Control</code>-based things use anchors/containers (your
            menus and HUD). Don't mix them up — use Control nodes for anything that should reflow with
            screen size.
          </Note>
        </section>

        <hr />

        {/* SECTION 20 — AUTOLOADS & STATE */}
        <section className="section" id="s20" ref={setRef('s20')}>
          <h2><span className="section-num">20</span>Scenes, Autoloads &amp; State</h2>
          <p>
            Real games have multiple screens — a menu, the game, maybe a settings screen — and some data
            that needs to outlive any single screen, like the high score. Here's how Godot handles both.
          </p>
          <h3>Switching scenes</h3>
          <p>
            To go from the menu to the game, you tell Godot's scene tree to change the current scene:
          </p>
          <CodePre>{`func _on_play_pressed():
	get_tree().change_scene_to_file("res://game.tscn")`}</CodePre>
          <p>
            <code>res://</code> means "the root of my project." So <code>res://game.tscn</code> is the
            game scene file. <code>change_scene_to_file</code> swaps the whole screen — the menu unloads,
            the game loads.
          </p>
          <h3>Autoloads — data and helpers that always exist</h3>
          <p>
            An <strong>autoload</strong> (also called a "singleton") is a scene or script that Godot keeps
            loaded for the entire game, no matter which scene is showing. It's the perfect home for global
            state (the score, settings) and global helpers (the Sfx player from earlier). Set one up under{' '}
            <strong>Project → Project Settings → Globals → Autoload</strong>: pick a script, give it a
            name, Add.
          </p>
          <CodePre>{`# GameState.gd — add as an autoload named "GameState"
extends Node

var score: int = 0
var best: int = 0

func reset():
	score = 0

func add(points: int):
	score += points
	if score > best:
		best = score`}</CodePre>
          <p>
            Because it's an autoload named <code>GameState</code>, you can read and write it from any
            script in any scene, just by name:
          </p>
          <CodePre>{`GameState.add(100)
print("Score is now ", GameState.score)
print("Best ever ", GameState.best)`}</CodePre>
          <MermaidDiagram theme="default" chart={`graph TB
  AUTO["GameState (autoload)<br/>always loaded — holds score + best"]
  MENU["Main Menu scene"] -.reads best.-> AUTO
  GAME["Game scene"] -.reads + writes score.-> AUTO
  OVER["Game Over scene"] -.reads final score.-> AUTO`} />
          <Note kind="warn">
            <strong>Don't overuse autoloads.</strong> They're global, which makes code easy to write but
            harder to reason about if everything talks to them. Use them for genuinely game-wide things
            (score, settings, audio) — not as a dumping ground.
          </Note>
        </section>

        <hr />

        {/* SECTION 21 — SAVING & LOADING */}
        <section className="section" id="s21" ref={setRef('s21')}>
          <h2><span className="section-num">21</span>Saving &amp; Loading</h2>
          <p>
            You want the high score to still be there next time the player opens the app. That means
            writing it to a file on the device and reading it back on launch. Godot makes this easy with{' '}
            <code>FileAccess</code> and a special, safe location called <code>user://</code>.
          </p>
          <h3>Where does saved data go?</h3>
          <p>
            <code>user://</code> is a per-app folder Godot manages on each platform — on iOS it's inside
            your app's private storage, exactly where Apple wants user data. You never need the real path;
            just write to <code>user://something</code> and Godot handles the rest.
          </p>
          <h3>Saving JSON</h3>
          <p>
            <strong>JSON</strong> is a simple text format for structured data. Convert a dictionary to a
            JSON string and write it out:
          </p>
          <CodePre>{`const SAVE_PATH = "user://save.json"

func save_game():
	var data = {
		"best": GameState.best,
		"sound_on": true,
	}
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	file.store_string(JSON.stringify(data))
	file.close()`}</CodePre>
          <h3>Loading it back</h3>
          <CodePre>{`func load_game():
	if not FileAccess.file_exists(SAVE_PATH):
		return   # nothing saved yet — first launch

	var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
	var text = file.get_as_text()
	file.close()

	var data = JSON.parse_string(text)
	if data == null:
		return   # file was corrupt — ignore it

	GameState.best = data.get("best", 0)`}</CodePre>
          <p>
            Notice <code>data.get("best", 0)</code> — that reads the <code>"best"</code> key but falls
            back to <code>0</code> if it's missing. Defensive reading like this keeps old or partial save
            files from crashing your game.
          </p>
          <h3>When to save</h3>
          <p>
            Call <code>save_game()</code> at moments that matter: when a new high score is set, and when
            the app loses focus (the player switches away). Godot tells you about that via a notification:
          </p>
          <CodePre>{`func _notification(what):
	if what == NOTIFICATION_APPLICATION_PAUSED:
		save_game()   # player switched away — persist now`}</CodePre>
          <Note>
            <strong>Keep saves small and simple.</strong> For Block Blast you really only need the best
            score and maybe a settings flag. Saving the entire in-progress board is possible but optional —
            start with just the high score.
          </Note>
        </section>

        <hr />

        {/* SECTION 22 — MOBILE SETTINGS */}
        <section className="section" id="s22" ref={setRef('s22')}>
          <h2><span className="section-num">22</span>Settings for Mobile</h2>
          <p>
            A few project settings make the difference between a game that looks right on every iPhone and
            one that's stretched or cropped. Set these once, early. They live in{' '}
            <strong>Project → Project Settings</strong>.
          </p>
          <h3>Resolution &amp; the "stretch" mode</h3>
          <p>
            Under <strong>Display → Window</strong>, set a base resolution to design against. A common
            portrait choice is <code>1080 × 1920</code>. Then set:
          </p>
          <table>
            <tbody>
              <tr><th>Setting</th><th>Value</th><th>Why</th></tr>
              <tr><td>Viewport Width / Height</td><td><code>1080</code> / <code>1920</code></td><td>The size you design for.</td></tr>
              <tr><td>Stretch → Mode</td><td><code>canvas_items</code></td><td>Scales your UI/2D to fit any screen crisply.</td></tr>
              <tr><td>Stretch → Aspect</td><td><code>expand</code></td><td>Avoids black bars; shows a bit more on taller screens.</td></tr>
            </tbody>
          </table>
          <h3>Lock to portrait</h3>
          <p>
            Block Blast is a portrait game. Under <strong>Display → Window → Handheld</strong>, set{' '}
            <strong>Orientation</strong> to <code>portrait</code>. Now the game won't rotate when the
            player tilts the phone.
          </p>
          <h3>Safe area (the notch / Dynamic Island)</h3>
          <p>
            Modern iPhones have a notch or Dynamic Island and rounded corners that can cover the very top
            and bottom of the screen. Keep important UI out of those zones by adding padding (a{' '}
            <code>MarginContainer</code>) and, if needed, querying the safe area in code:
          </p>
          <CodePre>{`func _ready():
	var safe = DisplayServer.get_display_safe_area()
	print("Safe area rect: ", safe)
	# Inset your top HUD by safe.position.y, etc.`}</CodePre>
          <h3>Renderer</h3>
          <p>
            Confirm <strong>Rendering → Renderer → Rendering Method</strong> is{' '}
            <code>mobile</code> (or <code>gl_compatibility</code>). This matches what you chose when
            creating the project and keeps the build phone-friendly.
          </p>
          <Note>
            <strong>Frame rate &amp; battery.</strong> Under <strong>Application → Run</strong> you can
            cap the frame rate. A 2D puzzle game runs fine and saves battery at 60 FPS — no need to push
            higher even on a 120 Hz iPhone.
          </Note>
        </section>

        <hr />

        {/* SECTION 23 — HOW EXPORTING WORKS */}
        <section className="section" id="s23" ref={setRef('s23')}>
          <h2><span className="section-num">23</span>How Exporting Works</h2>
          <p>
            So far you've been pressing Play inside Godot. To get a real app onto a phone, you{' '}
            <strong>export</strong>. Let's understand the pieces before doing it, because the iOS path has
            a few moving parts.
          </p>
          <h3>The big picture for iOS</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  GODOT["Your Godot project"] -->|export iOS| XCODEPROJ["An Xcode project<br/>(Godot generates this)"]
  XCODEPROJ -->|open + Archive in Xcode| IPA["A signed .ipa app build"]
  IPA -->|upload| ASC["App Store Connect"]
  ASC -->|process| TF["TestFlight → your iPhone"]`} />
          <p>
            The key idea: <strong>Godot doesn't talk to Apple directly.</strong> Godot exports an{' '}
            <strong>Xcode project</strong> — a folder Xcode understands. You open that in Xcode, and Xcode
            (Apple's official tool) does the signing, building, and uploading. This is why you need a Mac
            and Xcode for iOS; there is no way around Apple's tools.
          </p>
          <h3>Export templates</h3>
          <p>
            The Godot app you installed can <em>edit</em> games but doesn't ship with the platform-specific
            code needed to <em>build</em> for each platform. That extra code is called{' '}
            <strong>export templates</strong>, and you download them once (a few hundred MB) via{' '}
            <strong>Editor → Manage Export Templates → Download and Install</strong>. We'll do this in the
            iOS export section.
          </p>
          <h3>Export presets</h3>
          <p>
            An <strong>export preset</strong> is a saved configuration for one target — "iOS," with its
            app name, icon, bundle identifier, and so on. You create it under <strong>Project → Export</strong>.
            You set it up once and reuse it every time you build.
          </p>
          <h3>What you'll need for the iOS path (checklist)</h3>
          <ul>
            <li>A <strong>Mac</strong> (you have this) with <strong>Xcode</strong> installed (next sections).</li>
            <li>An <strong>Apple Developer Program</strong> membership — <strong>$99/year</strong>, required for TestFlight and the App Store.</li>
            <li>Godot's <strong>iOS export templates</strong> installed.</li>
            <li>A unique <strong>bundle identifier</strong> like <code>com.yourname.blockblast</code>.</li>
            <li>App <strong>icons</strong> and a <strong>launch screen</strong>.</li>
          </ul>
          <Note kind="warn">
            <strong>The $99/year is unavoidable for TestFlight.</strong> You can run the game in the
            simulator and even on your own iPhone for 7 days with just a free Apple ID, but to use
            TestFlight (and to keep the app installed beyond 7 days), you must enroll in the paid Apple
            Developer Program. We walk through enrollment next.
          </Note>
        </section>

        <hr />

        {/* SECTION 24 — APPLE DEVELOPER ACCOUNT */}
        <section className="section" id="s24" ref={setRef('s24')}>
          <h2><span className="section-num">24</span>Apple Developer Account</h2>
          <p>
            To put an app on TestFlight or the App Store, Apple needs to know who you are and you need to
            pay the <strong>$99/year</strong> Apple Developer Program fee. Here's the whole enrollment,
            step by step. Budget 30–60 minutes; approval is sometimes instant, sometimes 24–48 hours.
          </p>
          <h3>Step 1 — Have a solid Apple ID</h3>
          <p>
            You almost certainly already have an Apple ID (the account you use for the App Store and
            iCloud). Make sure it has:
          </p>
          <ul>
            <li><strong>Two-factor authentication</strong> turned on (Apple requires it for developers). Check under <strong>System Settings → your name → Sign-In &amp; Security</strong>.</li>
            <li>A <strong>verified email and phone number</strong>.</li>
            <li>Ideally, your <strong>real legal name</strong>, since it becomes your seller name.</li>
          </ul>
          <h3>Step 2 — Enroll in the Apple Developer Program</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Go to developer.apple.com</div>
                <div className="tl-desc">Visit <code>developer.apple.com/programs</code> and click <strong>Enroll</strong>. Sign in with your Apple ID.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Choose entity type</div>
                <div className="tl-desc">As an individual, pick <strong>Individual / Sole Proprietor</strong> (simplest — your name is the seller). Choosing <strong>Company/Organization</strong> requires a legal entity and a D-U-N-S number; skip that unless you have a registered business.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Verify your identity</div>
                <div className="tl-desc">Apple may ask you to verify with a government ID through the <strong>Apple Developer app</strong> on your iPhone. Have your ID ready.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">Pay the $99</div>
                <div className="tl-desc">Complete the purchase. It renews yearly; you can turn off auto-renew later if you stop developing.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">5</div>
              <div className="tl-content">
                <div className="tl-title">Wait for approval</div>
                <div className="tl-desc">You'll get an email when you're approved. Until then you can't upload builds, so start this early.</div>
              </div>
            </div>
          </div>
          <h3>Step 3 — Meet App Store Connect</h3>
          <p>
            <strong>App Store Connect</strong> (<code>appstoreconnect.apple.com</code>) is the website
            where you manage apps, builds, testers, and store listings. After enrolling, sign in and look
            around — you'll create your app record here before uploading. It's also where TestFlight
            lives.
          </p>
          <h3>Your Team ID</h3>
          <p>
            Once enrolled, you have a <strong>Team</strong> with a <strong>Team ID</strong> (a 10-character
            code). Xcode and Godot use it to sign your app. You'll find it in your account at{' '}
            <code>developer.apple.com/account</code> under Membership. You rarely type it by hand — Xcode
            picks it from a dropdown once you sign in — but it's good to know what it is.
          </p>
          <Note>
            <strong>Agreements can block uploads.</strong> The first time, App Store Connect may show
            pending <strong>Agreements, Tax, and Banking</strong> tasks. You don't need tax/banking for
            free TestFlight builds, but accept any <strong>Program License Agreement</strong> it shows, or
            uploads can silently fail.
          </Note>
        </section>

        <hr />

        {/* SECTION 25 — INSTALLING XCODE */}
        <section className="section" id="s25" ref={setRef('s25')}>
          <h2><span className="section-num">25</span>Installing Xcode</h2>
          <p>
            <strong>Xcode</strong> is Apple's official app for building iOS apps. Godot hands its iOS
            export to Xcode for the final signing and upload, so you must have it. It's big — plan for a
            10–15&nbsp;GB download and 30–40&nbsp;GB free disk space.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Install from the Mac App Store</div>
                <div className="tl-desc">Open the <strong>App Store</strong> app, search <strong>Xcode</strong>, click <strong>Get / Install</strong>. It's a large download — leave it running.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Open Xcode once to finish setup</div>
                <div className="tl-desc">Launch Xcode. It installs additional components and asks you to accept a license. Let it finish completely.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Install Command Line Tools</div>
                <div className="tl-desc">In Terminal run <code>xcode-select --install</code> (if not already present). Godot's export needs these.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Sign in with your Apple ID</div>
                <div className="tl-desc">In Xcode: <strong>Settings (⌘,) → Accounts → +</strong> → Apple ID. Sign in with the same account you enrolled. Your Team appears here — that's how Xcode signs your app.</div>
              </div>
            </div>
          </div>
          <h3>The iOS Simulator</h3>
          <p>
            Xcode includes a <strong>Simulator</strong> — a virtual iPhone on your Mac's screen. It's
            great for quick testing without plugging in a device. Note: the Simulator can't test a few
            hardware things (haptics, real performance), so always do a final check on a real iPhone, but
            for laying out UI it's perfect.
          </p>
          <Note kind="warn">
            <strong>Get Command Line Tools pointing at Xcode.</strong> If exports complain about missing
            tools, run <code>sudo xcode-select -s /Applications/Xcode.app/Contents/Developer</code> to tell
            your Mac to use the full Xcode rather than just the standalone tools.
          </Note>
        </section>

        <hr />

        {/* SECTION 26 — iOS EXPORT FROM GODOT */}
        <section className="section" id="s26" ref={setRef('s26')}>
          <h2><span className="section-num">26</span>iOS Export from Godot</h2>
          <p>
            With Xcode installed and your developer account active, let's configure Godot to export for
            iOS. You do this once per project.
          </p>
          <h3>Step 1 — Install the iOS export templates</h3>
          <p>
            In Godot, go to <strong>Editor → Manage Export Templates → Download and Install</strong>. This
            grabs the platform code for every export target (iOS, Android, etc.) matching your exact Godot
            version. Wait for it to finish.
          </p>
          <Note kind="warn">
            <strong>Versions must match.</strong> Export templates are tied to the exact Godot build. If
            you update Godot, re-download the templates or exports will fail with a "template not found"
            error.
          </Note>
          <h3>Step 2 — Create the iOS export preset</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Open Project → Export</div>
                <div className="tl-desc">Click <strong>Add…</strong> and choose <strong>iOS</strong>. A new preset appears with many fields — don't be intimidated, only a few matter at first.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Set the Bundle Identifier</div>
                <div className="tl-desc">Under <strong>Application → Bundle Identifier</strong>, enter a unique reverse-domain id like <code>com.yourname.blockblast</code>. This uniquely names your app to Apple — it must be unique across the whole App Store and match what you'll register in App Store Connect.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Set app name, version, and team</div>
                <div className="tl-desc">Fill <strong>Name</strong> (shown under the icon), <strong>Short Version</strong> (e.g. <code>1.0</code>) and <strong>Version</strong> (build number, e.g. <code>1</code>). Enter your <strong>Team ID</strong> if asked.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Add required icons</div>
                <div className="tl-desc">The <strong>Icons</strong> section wants images at several sizes. Provide at least the App Store 1024×1024 icon; Godot can fill the rest from your project icon. (More on icons in a dedicated section.)</div>
              </div>
            </div>
          </div>
          <h3>Step 3 — Export the Xcode project</h3>
          <p>
            With the preset selected, click <strong>Export Project</strong> (not "Export PCK"). Choose a
            folder <em>outside</em> your Godot project (e.g. <code>~/Documents/BlockBlast-iOS</code>) and a
            filename. Godot generates a full <strong>Xcode project</strong> there. You'll typically{' '}
            <em>uncheck</em> "Export With Debug" for a build you intend to upload.
          </p>
          <div className="arch-diagram">
            <span className="dim"># What Godot produces (an Xcode project folder)</span>{'\n'}
            BlockBlast-iOS/{'\n'}
            ├─ blockblast.xcodeproj   <span className="dim"># open THIS in Xcode</span>{'\n'}
            ├─ blockblast/            <span className="dim"># generated app sources + your game data</span>{'\n'}
            └─ ...                    <span className="dim"># icons, plists, frameworks</span>
          </div>
          <p>That folder is the handoff point. Everything after this happens in Xcode.</p>
        </section>

        <hr />

        {/* SECTION 27 — GODOT → XCODE → SIGNING */}
        <section className="section" id="s27" ref={setRef('s27')}>
          <h2><span className="section-num">27</span>Godot → Xcode → Signing</h2>
          <p>
            <strong>Code signing</strong> is Apple's way of proving an app came from a known developer and
            wasn't tampered with. It sounds scary; Xcode's "automatic signing" does almost all of it for
            you. Here's the flow.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Open the .xcodeproj</div>
                <div className="tl-desc">In the exported folder, double-click the <code>.xcodeproj</code> file. Xcode opens your game project.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Select the project, then the target</div>
                <div className="tl-desc">In the left Navigator, click the top blue project icon. In the editor, select the app under <strong>TARGETS</strong>.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Go to Signing &amp; Capabilities</div>
                <div className="tl-desc">Click that tab. Check <strong>Automatically manage signing</strong>, then choose your <strong>Team</strong> from the dropdown (the Apple ID you added).</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Let Xcode resolve signing</div>
                <div className="tl-desc">Xcode creates a signing certificate and a provisioning profile automatically. If the bundle identifier is unique, the warnings clear and you're signed.</div>
              </div>
            </div>
          </div>
          <h3>Certificates &amp; profiles, in plain English</h3>
          <table>
            <tbody>
              <tr><th>Thing</th><th>What it is</th></tr>
              <tr><td><strong>Signing certificate</strong></td><td>A digital ID proving builds are yours. Xcode makes and stores it for you.</td></tr>
              <tr><td><strong>App ID</strong></td><td>Your app's identity on Apple's side, tied to the bundle identifier.</td></tr>
              <tr><td><strong>Provisioning profile</strong></td><td>A permission slip linking your certificate + App ID + allowed devices. Automatic signing manages it.</td></tr>
            </tbody>
          </table>
          <Note kind="warn">
            <strong>The #1 beginner signing error:</strong> "Failed to register bundle identifier" usually
            means the id is already taken or malformed. Make it truly unique (<code>com.yourname.blockblast2026</code>)
            and ensure it matches between Godot's export preset and Xcode. The #2: no Team selected — pick
            it in the dropdown.
          </Note>
        </section>

        <hr />

        {/* SECTION 28 — RUNNING ON IPHONE */}
        <section className="section" id="s28" ref={setRef('s28')}>
          <h2><span className="section-num">28</span>Running on Your iPhone</h2>
          <p>
            Before uploading anywhere, let's get the game running on your actual phone — it's a great
            confidence check and surprisingly satisfying.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Plug in your iPhone</div>
                <div className="tl-desc">Connect it with a cable. The first time, tap <strong>Trust</strong> on the phone and enter its passcode.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Enable Developer Mode on the phone</div>
                <div className="tl-desc">On iOS 16+, go to <strong>Settings → Privacy &amp; Security → Developer Mode</strong>, turn it on, and restart the phone when prompted.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Pick your device in Xcode</div>
                <div className="tl-desc">In the toolbar's device dropdown (top center), choose your iPhone instead of a Simulator.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Press Run (▶)</div>
                <div className="tl-desc">Xcode builds, installs, and launches the game on your phone. The first build is slow; later ones are faster.</div>
              </div>
            </div>
          </div>
          <h3>"Untrusted Developer" on first launch</h3>
          <p>
            The first time you run your own app on the phone, iOS may refuse with an "Untrusted Developer"
            message. Fix it on the phone: <strong>Settings → General → VPN &amp; Device Management</strong>,
            tap your developer profile, and choose <strong>Trust</strong>. Then re-launch the app.
          </p>
          <Note>
            <strong>Free vs paid, on-device.</strong> With a free Apple ID you can run on your own device,
            but the app expires after <strong>7 days</strong> and you can only have a few sideloaded apps.
            With the paid program there's no such limit — and only the paid program unlocks TestFlight.
          </Note>
          <h3>Testing in the Simulator instead</h3>
          <p>
            No cable handy? Pick an iPhone Simulator from the device dropdown and press Run. Godot games
            run in the Simulator for layout and logic checks. Use real hardware for the final feel and
            performance pass.
          </p>
        </section>

        <hr />

        {/* SECTION 29 — ICONS & LAUNCH SCREEN */}
        <section className="section" id="s29" ref={setRef('s29')}>
          <h2><span className="section-num">29</span>Icons &amp; Launch Screen</h2>
          <p>
            Two bits of polish Apple requires before TestFlight: an <strong>app icon</strong> and a{' '}
            <strong>launch screen</strong>. Skipping them leads to rejected uploads or an ugly default, so
            do them properly.
          </p>
          <h3>The app icon</h3>
          <p>
            iOS shows your icon on the home screen and in TestFlight. You provide a master{' '}
            <strong>1024×1024</strong> PNG (no transparency, no rounded corners — iOS rounds it for you).
            Make it simple and readable at tiny sizes: a bold shape and 1–2 colors beats fine detail.
          </p>
          <ul>
            <li>Design a single <code>1024×1024</code> PNG (a colored block grid works great for Block Blast).</li>
            <li>In Godot's iOS export preset, set it under <strong>Icons → App Store Icons / iPhone icons</strong>. Godot can generate the smaller sizes from it.</li>
            <li>Alternatively, drop the full icon set into the generated Xcode project's{' '}
              <strong>Assets.xcassets → AppIcon</strong> and let Xcode manage sizes.</li>
          </ul>
          <Note kind="warn">
            <strong>No alpha channel in the App Store icon.</strong> A 1024×1024 with transparency is the
            single most common upload rejection. Export it as a flat PNG/JPEG with a solid background.
          </Note>
          <h3>The launch screen</h3>
          <p>
            The <strong>launch screen</strong> is the image shown for the split second while your app
            starts. Godot generates a basic one (often a solid color with your icon). You can customize the
            background color in the export preset under <strong>Launch Screens</strong>, or edit the
            launch storyboard in Xcode. Keep it simple — a brand color and a centered logo.
          </p>
          <h3>Generating icon sizes quickly</h3>
          <p>
            If you'd rather make every size at once, free tools and websites take your 1024×1024 and output
            the full icon set. Search "iOS app icon generator." Then drag the produced set into{' '}
            <strong>Assets.xcassets → AppIcon</strong> in Xcode.
          </p>
          <Note>
            <strong>Repo tie-in:</strong> this codebase even has an icon-generation script at{' '}
            <code>scripts/generate-icons.mjs</code>. You don't need it for Godot, but it shows the same idea
            — one master image fanned out to every required size.
          </Note>
        </section>

        <hr />

        {/* SECTION 30 — UPLOADING TO TESTFLIGHT */}
        <section className="section" id="s30" ref={setRef('s30')}>
          <h2><span className="section-num">30</span>Uploading to TestFlight</h2>
          <p>
            This is the finish line: turning your Xcode project into a build on <strong>TestFlight</strong>,
            so you (and anyone you invite) can install it like a normal app and test it on real devices.
          </p>
          <h3>Step 1 — Create the app record in App Store Connect</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Go to App Store Connect → Apps → +</div>
                <div className="tl-desc">At <code>appstoreconnect.apple.com</code>, click <strong>Apps</strong>, then the <strong>+</strong> → <strong>New App</strong>.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">2</div>
              <div className="tl-content">
                <div className="tl-title">Fill the basics</div>
                <div className="tl-desc">Platform <strong>iOS</strong>, a name, primary language, and pick the <strong>Bundle ID</strong> that matches your Godot/Xcode id. Set an SKU (any unique string, e.g. <code>blockblast001</code>).</div>
              </div>
            </div>
          </div>
          <h3>Step 2 — Archive in Xcode</h3>
          <p>
            An <strong>archive</strong> is a release build packaged for distribution. In Xcode:
          </p>
          <ul>
            <li>Set the device dropdown to <strong>Any iOS Device (arm64)</strong> — not a simulator.</li>
            <li>Menu <strong>Product → Archive</strong>. Xcode builds a release archive (takes a few minutes).</li>
            <li>When done, the <strong>Organizer</strong> window opens listing your archive.</li>
          </ul>
          <h3>Step 3 — Distribute to App Store Connect</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Click "Distribute App"</div>
                <div className="tl-desc">In the Organizer, with your archive selected, click <strong>Distribute App</strong>.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Choose "App Store Connect" → Upload</div>
                <div className="tl-desc">Accept the defaults (automatic signing). Xcode validates and uploads the build.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">3</div>
              <div className="tl-content">
                <div className="tl-title">Wait for processing</div>
                <div className="tl-desc">Back in App Store Connect → your app → <strong>TestFlight</strong>, the build shows <em>"Processing"</em> for a few minutes to an hour. Then it's ready.</div>
              </div>
            </div>
          </div>
          <Note kind="warn">
            <strong>Export Compliance.</strong> The first upload asks about encryption. A simple game that
            doesn't add custom encryption can answer <strong>No</strong> to "Does your app use
            non-exempt encryption?" — but read the question and answer honestly. You can also set{' '}
            <code>ITSAppUsesNonExemptEncryption</code> to <code>false</code> in the Info plist to stop
            being asked every time.
          </Note>
          <h3>Step 4 — Add testers and install</h3>
          <p>
            In <strong>TestFlight</strong>, add yourself as an <strong>Internal Tester</strong> (fastest —
            no Apple review needed). On your iPhone, install the free <strong>TestFlight</strong> app from
            the App Store, sign in with the same Apple ID, accept the invite, and tap <strong>Install</strong>.
            Your game is now on your phone via TestFlight. 🎉
          </p>
          <table>
            <tbody>
              <tr><th>Tester type</th><th>Who</th><th>Review needed?</th></tr>
              <tr><td><strong>Internal</strong></td><td>Up to 100 people on your team</td><td>No — available in minutes</td></tr>
              <tr><td><strong>External</strong></td><td>Up to 10,000 invited testers</td><td>Yes — a quick Apple "beta review" first</td></tr>
            </tbody>
          </table>
          <Note>
            <strong>Builds expire.</strong> TestFlight builds last <strong>90 days</strong>. To keep
            testing, upload a fresh build (bump the build number first). When you're ready for the public,
            the same archive flow submits to the App Store for full review.
          </Note>
        </section>

        <hr />

        {/* SECTION 31 (s34) — ANIMATION */}
        <section className="section" id="s34" ref={setRef('s34')}>
          <h2><span className="section-num">31</span>Animation: Tweens &amp; AnimationPlayer</h2>
          <p>
            Movement is what makes a game feel alive. Godot gives you two complementary tools:{' '}
            <strong>tweens</strong> for quick, code-driven animations, and the{' '}
            <strong>AnimationPlayer</strong> node for designed, keyframed sequences.
          </p>
          <h3>Tweens — animate a property over time</h3>
          <p>
            A tween smoothly changes a property from its current value to a target. Create one, queue steps,
            and it runs automatically:
          </p>
          <CodePre>{`func _ready():
	var t := create_tween()
	t.tween_property(self, "position", Vector2(300, 300), 0.5)  # slide
	t.tween_property(self, "modulate:a", 0.0, 0.3)              # then fade out
	t.tween_callback(queue_free)                                # then remove`}</CodePre>
          <p>
            By default steps run one after another. For simultaneous animations, use{' '}
            <code>set_parallel(true)</code>:
          </p>
          <CodePre>{`var t := create_tween()
t.set_parallel(true)
t.tween_property(sprite, "scale", Vector2(1.5, 1.5), 0.2)
t.tween_property(sprite, "rotation", PI, 0.2)`}</CodePre>
          <h3>Easing makes it feel good</h3>
          <p>
            Linear motion looks robotic. <strong>Transitions</strong> and <strong>easing</strong> add
            character — overshoot, bounce, acceleration:
          </p>
          <CodePre>{`t.tween_property(node, "scale", Vector2.ONE, 0.3) \\
	.set_trans(Tween.TRANS_ELASTIC) \\
	.set_ease(Tween.EASE_OUT)`}</CodePre>
          <table>
            <tbody>
              <tr><th>Transition</th><th>Feel</th></tr>
              <tr><td><code>TRANS_SINE</code></td><td>Gentle, natural ease.</td></tr>
              <tr><td><code>TRANS_BACK</code></td><td>Overshoots slightly then settles — springy.</td></tr>
              <tr><td><code>TRANS_ELASTIC</code></td><td>Wobbles into place — playful.</td></tr>
              <tr><td><code>TRANS_BOUNCE</code></td><td>Bounces like a dropped ball.</td></tr>
            </tbody>
          </table>
          <h3>AnimationPlayer — designed sequences</h3>
          <p>
            For complex, reusable animations (a character's idle bob, a title intro), add an{' '}
            <strong>AnimationPlayer</strong> node. It records <strong>keyframes</strong> of any property
            over a timeline, which you scrub and edit visually in the bottom Animation panel. Play them from
            code:
          </p>
          <CodePre>{`$AnimationPlayer.play("intro")
# loop a named animation, or queue another to follow:
$AnimationPlayer.queue("idle")`}</CodePre>
          <Note>
            <strong>Which to use?</strong> Reach for a <strong>tween</strong> when the animation is simple,
            one-off, and easiest to express in code (a pop, a fade, a slide). Use the{' '}
            <strong>AnimationPlayer</strong> when the animation is intricate, hand-tuned, or you want to edit
            it visually and replay it by name.
          </Note>
        </section>

        <hr />

        {/* SECTION 32 (s35) — PARTICLES */}
        <section className="section" id="s35" ref={setRef('s35')}>
          <h2><span className="section-num">32</span>Particles &amp; Effects</h2>
          <p>
            Particles — bursts of tiny moving sprites — add sparkle, smoke, confetti, and impact. Godot has
            two particle nodes: <code>CPUParticles2D</code> (runs on the processor, simplest and
            mobile-safe) and <code>GPUParticles2D</code> (runs on the graphics chip, more particles). For a
            2D mobile puzzle game, <strong>CPUParticles2D</strong> is the easy, reliable choice.
          </p>
          <h3>A one-shot burst</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Add a CPUParticles2D node</div>
                <div className="tl-desc">In the scene, add it where you want the effect.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Configure for a burst</div>
                <div className="tl-desc">In the Inspector: uncheck <strong>Emitting</strong>, check <strong>One Shot</strong>, set <strong>Amount</strong> (e.g. 24), a short <strong>Lifetime</strong> (0.5s), <strong>Explosiveness</strong> = 1 (all at once), and a <strong>Spread</strong> of 180°.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">3</div>
              <div className="tl-content">
                <div className="tl-title">Trigger it from code</div>
                <div className="tl-desc">Position it and call <code>restart()</code> + set <code>emitting = true</code>.</div>
              </div>
            </div>
          </div>
          <CodePre>{`@export var burst: CPUParticles2D

func celebrate_at(world_pos: Vector2) -> void:
	burst.global_position = world_pos
	burst.restart()
	burst.emitting = true`}</CodePre>
          <h3>The properties that matter</h3>
          <table>
            <tbody>
              <tr><th>Property</th><th>Effect</th></tr>
              <tr><td><strong>Amount</strong></td><td>How many particles. Keep modest on mobile.</td></tr>
              <tr><td><strong>Lifetime</strong></td><td>How long each lives before vanishing.</td></tr>
              <tr><td><strong>Initial Velocity</strong></td><td>How fast they fly outward.</td></tr>
              <tr><td><strong>Gravity</strong></td><td>Pulls them down (confetti) or set to zero (sparkle).</td></tr>
              <tr><td><strong>Spread</strong></td><td>The cone angle — 180° sprays everywhere.</td></tr>
              <tr><td><strong>Color / Color Ramp</strong></td><td>Tint, or fade across a gradient over life.</td></tr>
              <tr><td><strong>Scale Amount</strong></td><td>Particle size, optionally shrinking over life.</td></tr>
            </tbody>
          </table>
          <h3>Cheap effects without particles</h3>
          <p>
            Not every effect needs a particle system. A white <code>ColorRect</code> that fades out is a
            "flash." A full-screen <code>ColorRect</code> briefly tinted is a "hit." A quick scale-pop on a
            node (a tween) reads as impact. These cost almost nothing and often look better than overdone
            particles.
          </p>
          <Note kind="warn">
            <strong>Mobile budget.</strong> Particles are the easiest way to tank performance on a phone.
            Keep counts low (tens, not thousands), prefer <code>CPUParticles2D</code> for 2D, and always
            test the effect on a real device, not just your Mac.
          </Note>
        </section>

        <hr />

        {/* SECTION 33 (s36) — SCENE TREE & NODE PATHS */}
        <section className="section" id="s36" ref={setRef('s36')}>
          <h2><span className="section-num">33</span>The Scene Tree &amp; Node Paths</h2>
          <p>
            Scripts constantly need to reach other nodes — "get the score label," "find the board." Godot
            addresses nodes by their position in the tree, much like folders and file paths. Master a few
            patterns and node access stops being guesswork.
          </p>
          <h3>Getting nodes</h3>
          <table>
            <tbody>
              <tr><th>Code</th><th>Means</th></tr>
              <tr><td><code>$Board</code></td><td>The child named "Board" (shorthand for <code>get_node("Board")</code>).</td></tr>
              <tr><td><code>$HUD/ScoreLabel</code></td><td>A nested path — child "HUD", then its child "ScoreLabel".</td></tr>
              <tr><td><code>get_parent()</code></td><td>This node's parent.</td></tr>
              <tr><td><code>get_node("../Tray")</code></td><td><code>..</code> goes up one level, then into "Tray" — a sibling.</td></tr>
              <tr><td><code>%Score</code></td><td>A node marked as a "Scene Unique Name" — found anywhere in the scene by that name.</td></tr>
            </tbody>
          </table>
          <h3>@onready — grab nodes when ready</h3>
          <p>
            You can't access children the instant a script loads — the tree isn't built yet. Use{' '}
            <code>@onready</code> to defer a variable's value until the node is ready:
          </p>
          <CodePre>{`@onready var board := $Board
@onready var score_label := $HUD/ScoreLabel

func _ready():
	score_label.text = "0"   # safe — runs after the tree exists`}</CodePre>
          <h3>Unique names beat fragile paths</h3>
          <p>
            Long paths like <code>$HUD/Panels/Container/ScoreLabel</code> break the moment you rearrange the
            tree. Instead, right-click a node → <strong>Access as Unique Name</strong>, and reach it with{' '}
            <code>%ScoreLabel</code> from anywhere in that scene — no path to maintain.
          </p>
          <h3>Groups — talk to many nodes at once</h3>
          <p>
            Add nodes to a named <strong>group</strong> and address them all together. Great for "pause
            every enemy" or "reset every cell":
          </p>
          <CodePre>{`# add a node to a group (in code or the Node panel's Groups tab)
add_to_group("cells")

# later, from anywhere:
get_tree().call_group("cells", "reset")     # call reset() on all
for c in get_tree().get_nodes_in_group("cells"):
	c.queue_redraw()`}</CodePre>
          <Note>
            <strong>"Call down, signal up."</strong> A common rule: a parent may call methods on its
            children directly (it owns them), but a child should <em>not</em> reach up and poke its parent —
            instead it emits a <strong>signal</strong> the parent listens to. This keeps children reusable
            and prevents tangled dependencies.
          </Note>
        </section>

        <hr />

        {/* SECTION 34 (s37) — RESOURCES */}
        <section className="section" id="s37" ref={setRef('s37')}>
          <h2><span className="section-num">34</span>Resources &amp; Custom Data</h2>
          <p>
            A <strong>Resource</strong> is a reusable data object saved to a file — fonts, textures, audio,
            themes are all Resources. You can also create your <em>own</em> Resource types to store game
            data (a level layout, an enemy's stats, a piece definition) as editable assets, separate from
            code.
          </p>
          <h3>Why custom Resources?</h3>
          <p>
            They let designers (or future-you) tweak data in the Inspector without editing scripts, and they
            keep data and behavior cleanly separated. Define one with <code>class_name</code> and{' '}
            <code>@export</code> fields:
          </p>
          <CodePre>{`# scripts/LevelConfig.gd
class_name LevelConfig
extends Resource

@export var grid_size: int = 8
@export var start_filled: int = 0
@export var palette: Array[Color] = []
@export var piece_weights: Dictionary = {}`}</CodePre>
          <p>
            Now you can create <code>.tres</code> files of this type (FileSystem → Create → Resource →
            LevelConfig), fill them in the Inspector, and load them:
          </p>
          <CodePre>{`@export var config: LevelConfig    # drag a .tres into this slot

func _ready():
	print("Grid is ", config.grid_size, " wide")`}</CodePre>
          <h3>Saving and loading at runtime</h3>
          <CodePre>{`# load a resource that ships with the game
var cfg := load("res://data/easy.tres") as LevelConfig

# save a resource you built at runtime (e.g. to user://)
var r := LevelConfig.new()
r.grid_size = 10
ResourceSaver.save(r, "user://custom_level.tres")`}</CodePre>
          <h3>preload vs load</h3>
          <table>
            <tbody>
              <tr><th>Function</th><th>When it loads</th><th>Use for</th></tr>
              <tr><td><code>preload("res://x.tscn")</code></td><td>At compile/parse time</td><td>Things you always need — fixed scenes like <code>piece.tscn</code>.</td></tr>
              <tr><td><code>load("res://x.tscn")</code></td><td>At the moment the line runs</td><td>Things chosen at runtime — a level picked from a menu.</td></tr>
            </tbody>
          </table>
          <Note>
            <strong>For a first game, you may not need custom Resources at all</strong> — our Block Blast
            stores shapes as plain arrays in a script, which is perfectly fine. Reach for custom Resources
            when you have lots of data to manage (many levels, many item types) and want to edit it visually.
          </Note>
        </section>

        <hr />

        {/* SECTION 35 (s38) — GDSCRIPT PATTERNS */}
        <section className="section" id="s38" ref={setRef('s38')}>
          <h2><span className="section-num">35</span>Common GDScript Patterns</h2>
          <p>
            A grab-bag of idioms that show up constantly. You don't need all of these for Block Blast, but
            recognizing them makes other people's code (and tutorials) readable.
          </p>
          <h3>match — clean multi-way branching</h3>
          <CodePre>{`match state:
	"menu":
		show_menu()
	"playing":
		update_game()
	"game_over":
		show_results()
	_:
		pass   # the default case (underscore = "anything else")`}</CodePre>
          <h3>Enums — named states</h3>
          <CodePre>{`enum State { MENU, PLAYING, PAUSED, GAME_OVER }

var state := State.MENU

func _process(_delta):
	if state == State.PLAYING:
		tick()`}</CodePre>
          <h3>The ternary expression</h3>
          <CodePre>{`var label = "Win" if score > 0 else "Try again"
var speed = fast_speed if boosting else normal_speed`}</CodePre>
          <h3>Lambdas — inline functions</h3>
          <CodePre>{`button.pressed.connect(func(): print("clicked"))
var doubled = [1, 2, 3].map(func(n): return n * 2)   # [2, 4, 6]
var bigs = nums.filter(func(n): return n > 10)`}</CodePre>
          <h3>await — wait for something</h3>
          <CodePre>{`# pause this function until a timer finishes, without freezing the game
await get_tree().create_timer(1.0).timeout
print("one second later")

# or wait for a signal
await $AnimationPlayer.animation_finished`}</CodePre>
          <h3>Safety idioms</h3>
          <table>
            <tbody>
              <tr><th>Idiom</th><th>Why</th></tr>
              <tr><td><code>is_instance_valid(node)</code></td><td>Check a node wasn't freed before using it.</td></tr>
              <tr><td><code>if node:</code></td><td>Guard against <code>null</code> before calling methods.</td></tr>
              <tr><td><code>dict.get("k", default)</code></td><td>Read a key with a fallback if missing.</td></tr>
              <tr><td><code>"%d / %s" % [n, name]</code></td><td>Format values into a string.</td></tr>
            </tbody>
          </table>
          <h3>A tiny state machine</h3>
          <CodePre>{`enum S { IDLE, DRAGGING, ANIMATING }
var s := S.IDLE

func _input(event):
	match s:
		S.IDLE:
			if _touched_a_piece(event): s = S.DRAGGING
		S.DRAGGING:
			if _released(event): s = S.ANIMATING; _resolve_drop()`}</CodePre>
          <Note>
            <strong>Static typing earns its keep.</strong> Annotating types (<code>var n: int = 0</code>,{' '}
            <code>func f(x: float) -&gt; bool:</code>) lets Godot catch mistakes before you run, gives you
            autocomplete, and slightly speeds the game up. Add types as you grow comfortable — they pay off
            quickly.
          </Note>
        </section>

        <hr />

        {/* SECTION 36 (s39) — ORGANIZING A BIGGER PROJECT */}
        <section className="section" id="s39" ref={setRef('s39')}>
          <h2><span className="section-num">36</span>Organizing a Bigger Project</h2>
          <p>
            Block Blast is small, but good habits now save pain later. A little structure keeps a growing
            project navigable.
          </p>
          <h3>Folder conventions</h3>
          <div className="arch-diagram">
            res://{'\n'}
            ├─ scenes/   <span className="dim"># .tscn files</span>{'\n'}
            ├─ scripts/  <span className="dim"># .gd files</span>{'\n'}
            ├─ assets/   <span className="dim"># art (sprites, fonts)</span>{'\n'}
            ├─ audio/    <span className="dim"># sound + music</span>{'\n'}
            ├─ ui/       <span className="dim"># themes</span>{'\n'}
            └─ data/     <span className="dim"># custom resources, configs</span></div>
          <h3>Naming</h3>
          <table>
            <tbody>
              <tr><th>Thing</th><th>Convention</th><th>Example</th></tr>
              <tr><td>Scene / script files</td><td>PascalCase or snake_case (be consistent)</td><td><code>Board.gd</code>, <code>game.tscn</code></td></tr>
              <tr><td>Variables / functions</td><td>snake_case</td><td><code>can_place</code>, <code>tray_cell</code></td></tr>
              <tr><td>Constants / enums</td><td>ALL_CAPS</td><td><code>GRID</code>, <code>State.MENU</code></td></tr>
              <tr><td>Private helpers</td><td>leading underscore</td><td><code>_init_grid()</code></td></tr>
            </tbody>
          </table>
          <h3>Design principles that scale</h3>
          <ul>
            <li><strong>One script, one job.</strong> Board owns the grid; Game owns the rules. Don't let one script do everything.</li>
            <li><strong>Compose with scenes.</strong> Build small reusable scenes (a Piece, a Cell, a Button) and assemble them, rather than one giant scene.</li>
            <li><strong>Autoloads sparingly.</strong> Only truly game-wide things (score, audio, settings) belong in autoloads.</li>
            <li><strong>Call down, signal up.</strong> Parents call children; children emit signals. (See the scene-tree section.)</li>
            <li><strong>Keep data out of logic.</strong> Shapes, palettes, level configs as data (arrays or Resources), not buried in <code>if</code> chains.</li>
          </ul>
          <Note kind="warn">
            <strong>Refactor before it hurts, not after.</strong> When a script passes ~200–300 lines or a
            function does three unrelated things, split it. Small, single-purpose files are the difference
            between a project you can keep building on and one you dread opening.
          </Note>
        </section>

        <hr />

        {/* SECTION 37 (s40) — GIT */}
        <section className="section" id="s40" ref={setRef('s40')}>
          <h2><span className="section-num">37</span>Version Control with Git</h2>
          <p>
            <strong>Git</strong> records snapshots of your project so you can undo mistakes, see what
            changed, and never lose work. It feels optional until the day you break everything and wish you
            could go back — then it's priceless. Godot projects are text-based, so they work beautifully
            with Git.
          </p>
          <h3>You already have Git</h3>
          <p>
            Installing Xcode's command line tools (from the iOS setup) also installed Git. Confirm in
            Terminal:
          </p>
          <CodePre>{`git --version`}</CodePre>
          <h3>Ignore the right files</h3>
          <p>
            Godot regenerates a <code>.godot/</code> cache folder and you don't want to track it (or your
            exports). Create a file named <code>.gitignore</code> in your project root:
          </p>
          <CodePre>{`# .gitignore for a Godot project
.godot/
export_presets.cfg
*.translation
/builds/
/exports/
.DS_Store`}</CodePre>
          <h3>The everyday workflow</h3>
          <CodePre>{`cd ~/Documents/GodotProjects/BlockBlast

git init                 # once, to start tracking this project
git add .                # stage all current files
git commit -m "Initial commit: empty Block Blast project"

# ...make changes in Godot...
git add .
git commit -m "Add board grid and drawing"`}</CodePre>
          <p>
            Each <code>commit</code> is a labeled snapshot. <code>git log</code> lists them;{' '}
            <code>git status</code> shows what changed; <code>git diff</code> shows the exact lines.
          </p>
          <h3>Back it up to GitHub</h3>
          <p>
            Create a free private repository on <strong>github.com</strong>, then connect and push:
          </p>
          <CodePre>{`git remote add origin https://github.com/yourname/blockblast.git
git branch -M main
git push -u origin main`}</CodePre>
          <p>
            Now your project lives in the cloud. Push after meaningful changes and your work survives even a
            dead laptop.
          </p>
          <Note kind="warn">
            <strong>Never commit secrets.</strong> If you later add API keys or signing files, keep them out
            of Git via <code>.gitignore</code>. For a local single-player game you usually have no secrets,
            but the habit matters as you grow.
          </Note>
        </section>

        <hr />

        {/* SECTION 38 (s41) — PERFORMANCE */}
        <section className="section" id="s41" ref={setRef('s41')}>
          <h2><span className="section-num">38</span>Performance &amp; Profiling</h2>
          <p>
            A 2D puzzle game is light, but phones are less powerful than your Mac and run on a battery, so a
            few habits keep things smooth. Godot also includes tools to <em>measure</em> rather than guess.
          </p>
          <h3>The profiler &amp; monitors</h3>
          <p>
            Run your game from the editor and open the bottom <strong>Debugger</strong> panel. The{' '}
            <strong>Profiler</strong> tab shows where frame time goes; the <strong>Monitors</strong> tab
            graphs FPS, memory, and draw calls live. If the game stutters, these tell you <em>what's</em>{' '}
            expensive instead of you guessing.
          </p>
          <h3>Cheap wins for a 2D game</h3>
          <table>
            <tbody>
              <tr><th>Do</th><th>Why</th></tr>
              <tr><td>Redraw only on change (<code>queue_redraw()</code>), not every frame</td><td>A static board should cost nothing.</td></tr>
              <tr><td>Prefer signals over polling in <code>_process</code></td><td>Don't check "did anything happen?" 60×/sec — react to events.</td></tr>
              <tr><td>Reuse nodes instead of creating/freeing constantly</td><td>Allocations every frame cause hitches (see pooling).</td></tr>
              <tr><td>Keep particle counts modest</td><td>Particles are the usual mobile bottleneck.</td></tr>
              <tr><td>Right-size textures</td><td>Huge images waste memory and bandwidth.</td></tr>
            </tbody>
          </table>
          <h3>Object pooling (when you spawn a lot)</h3>
          <p>
            If you create and destroy many short-lived nodes (clear flashes, particles), a <strong>pool</strong>{' '}
            reuses a fixed set instead of churning the allocator:
          </p>
          <CodePre>{`var pool: Array = []

func get_flash() -> ColorRect:
	for r in pool:
		if not r.visible:
			r.visible = true
			return r
	var r := ColorRect.new()
	add_child(r)
	pool.append(r)
	return r

func release_flash(r: ColorRect) -> void:
	r.visible = false   # hide and reuse later, don't free`}</CodePre>
          <h3>Battery &amp; frame rate</h3>
          <p>
            Capping at 60 FPS (the default) is plenty for a puzzle game and gentler on the battery than
            pushing a 120 Hz display. There's nothing to chase here — smooth and efficient beats maximal.
          </p>
          <Note>
            <strong>Measure before optimizing.</strong> Don't contort your code for speed you can't observe.
            Build the game simply, and only optimize the specific thing the profiler shows is slow. For
            Block Blast, you'll likely never need to.
          </Note>
        </section>

        <hr />

        {/* SECTION 39 (s42) — APP STORE */}
        <section className="section" id="s42" ref={setRef('s42')}>
          <h2><span className="section-num">39</span>TestFlight → App Store</h2>
          <p>
            TestFlight is the rehearsal; the App Store is opening night. Once your build tests well, here's
            what it takes to go fully public. This is optional — many people happily stop at TestFlight — but
            here's the map.
          </p>
          <h3>What the App Store needs beyond TestFlight</h3>
          <table>
            <tbody>
              <tr><th>Requirement</th><th>Detail</th></tr>
              <tr><td><strong>Screenshots</strong></td><td>Real captures at required sizes (e.g. 6.7" and 6.5" iPhone). The Simulator can produce these.</td></tr>
              <tr><td><strong>App description &amp; keywords</strong></td><td>What it is, why it's fun, searchable terms.</td></tr>
              <tr><td><strong>Privacy details</strong></td><td>The "privacy nutrition label." A local game that collects nothing is simple to declare.</td></tr>
              <tr><td><strong>Age rating</strong></td><td>A questionnaire; a clean puzzle game rates 4+.</td></tr>
              <tr><td><strong>Pricing &amp; availability</strong></td><td>Free or paid, and which countries.</td></tr>
              <tr><td><strong>Support URL</strong></td><td>A page (even a simple one) where users can reach you.</td></tr>
            </tbody>
          </table>
          <h3>The submission flow</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Fill the App Store listing</div>
                <div className="tl-desc">In App Store Connect → your app → the version page: name, subtitle, description, keywords, screenshots, support URL.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Pick the build</div>
                <div className="tl-desc">Attach the processed build (the same archive you sent to TestFlight).</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Answer compliance &amp; privacy</div>
                <div className="tl-desc">Encryption (usually No for a simple game), data collection (none for a local game), age rating questionnaire.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Submit for review</div>
                <div className="tl-desc">Apple reviews it (often ~24–48 hours). Approved → you choose to release immediately or on a date.</div>
              </div>
            </div>
          </div>
          <h3>Common rejection reasons</h3>
          <ul>
            <li>Crashes or obvious bugs the reviewer hits — test thoroughly first.</li>
            <li>Placeholder content, broken links, or a missing support URL.</li>
            <li>Privacy label that doesn't match actual behavior.</li>
            <li>Icon/screenshot issues (wrong sizes, transparency in the icon).</li>
          </ul>
          <Note>
            <strong>Updates use the same pipeline.</strong> To ship a fix or new feature: bump the version,
            archive, upload, attach to a new version in App Store Connect, and submit. Consider{' '}
            <strong>phased release</strong> so an update rolls out gradually and you can catch problems early.
          </Note>
        </section>

        <hr />

        {/* SECTION 40 (s44) — GDSCRIPT LANGUAGE REFERENCE */}
        <section className="section" id="s44" ref={setRef('s44')}>
          <h2><span className="section-num">40</span>GDScript Language Reference</h2>
          <p>
            A compact reference for the language. You won't memorize this — bookmark it and look things up
            as you write code.
          </p>
          <h4>Operators</h4>
          <table>
            <tbody>
              <tr><th>Category</th><th>Operators</th></tr>
              <tr><td>Arithmetic</td><td><code>+ - * / %</code> (<code>%</code> is remainder), <code>**</code> (power)</td></tr>
              <tr><td>Assignment</td><td><code>=</code> <code>+=</code> <code>-=</code> <code>*=</code> <code>/=</code> <code>%=</code></td></tr>
              <tr><td>Comparison</td><td><code>==</code> <code>!=</code> <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code></td></tr>
              <tr><td>Logical</td><td><code>and</code> <code>or</code> <code>not</code> (also <code>&amp;&amp;</code> <code>||</code> <code>!</code>)</td></tr>
              <tr><td>Membership</td><td><code>in</code> (e.g. <code>if 3 in [1,2,3]</code>)</td></tr>
            </tbody>
          </table>
          <h4>Control flow</h4>
          <CodePre>{`if cond:
	pass
elif other:
	pass
else:
	pass

for i in range(10): pass        # 0..9
for item in array: pass         # each element
for key in dictionary: pass     # each key

while cond:
	if done: break              # exit the loop
	if skip: continue           # next iteration

match value:
	1: pass
	"a": pass
	_: pass                     # default`}</CodePre>
          <h4>Built-in types</h4>
          <table>
            <tbody>
              <tr><th>Type</th><th>Notes</th></tr>
              <tr><td><code>int</code>, <code>float</code></td><td>Whole / decimal numbers.</td></tr>
              <tr><td><code>bool</code></td><td><code>true</code> / <code>false</code>.</td></tr>
              <tr><td><code>String</code></td><td>Text; double or single quotes.</td></tr>
              <tr><td><code>Vector2</code> / <code>Vector2i</code></td><td>2D float / integer point.</td></tr>
              <tr><td><code>Color</code></td><td>RGBA, 0–1 each (or <code>Color.html("#hex")</code>).</td></tr>
              <tr><td><code>Array</code></td><td>Ordered list; <code>[1, 2, 3]</code>.</td></tr>
              <tr><td><code>Dictionary</code></td><td>Key→value; <code>&#123;"a": 1&#125;</code>.</td></tr>
            </tbody>
          </table>
          <h4>String methods</h4>
          <CodePre>{`var s = "Block Blast"
s.length()           # 11
s.to_lower()         # "block blast"
s.to_upper()         # "BLOCK BLAST"
s.begins_with("Bl")  # true
s.contains("Bla")    # true
s.replace("a", "@")  # "Block Bl@st"
s.split(" ")         # ["Block", "Blast"]
str(42)              # "42"  (anything -> String)
"%d pts" % 100       # "100 pts"  (format)`}</CodePre>
          <h4>Array methods</h4>
          <CodePre>{`var a = [3, 1, 2]
a.size()             # 3
a.append(4)          # [3,1,2,4]
a.append_array([5,6])# [3,1,2,4,5,6]
a.has(2)             # true
a.find(2)            # index of first 2 (or -1)
a.erase(2)           # remove first 2
a.remove_at(0)       # remove index 0
a.sort()             # in place, ascending
a.shuffle()          # random order
a.pick_random()      # a random element
a.is_empty()         # bool
a.map(func(n): return n*2)
a.filter(func(n): return n > 1)`}</CodePre>
          <h4>Dictionary methods</h4>
          <CodePre>{`var d = {"hp": 10, "name": "Sam"}
d.has("hp")          # true
d.get("mp", 0)       # 0 (default when missing)
d.keys()             # ["hp", "name"]
d.values()           # [10, "Sam"]
d.erase("hp")        # remove a key
d.size()             # number of keys`}</CodePre>
          <h4>Useful global functions</h4>
          <table>
            <tbody>
              <tr><th>Function</th><th>Does</th></tr>
              <tr><td><code>print(...)</code></td><td>Log to the Output panel.</td></tr>
              <tr><td><code>abs(x)</code> <code>sign(x)</code></td><td>Absolute value / -1,0,1.</td></tr>
              <tr><td><code>min(a,b)</code> <code>max(a,b)</code></td><td>Smaller / larger.</td></tr>
              <tr><td><code>floor(x)</code> <code>ceil(x)</code> <code>round(x)</code></td><td>Round down / up / nearest.</td></tr>
              <tr><td><code>clamp(x, lo, hi)</code></td><td>Keep x within a range.</td></tr>
              <tr><td><code>randi()</code> <code>randf()</code></td><td>Random int / float 0–1.</td></tr>
              <tr><td><code>typeof(x)</code></td><td>The type of a value.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 41 (s45) — MATH FOR 2D GAMES */}
        <section className="section" id="s45" ref={setRef('s45')}>
          <h2><span className="section-num">41</span>Math for 2D Games</h2>
          <p>
            You truly don't need much math for a puzzle game, but these few tools cover most 2D needs —
            movement, smoothing, and randomness. Reach for them when you want motion to feel natural.
          </p>
          <h3>Vector2 — the workhorse</h3>
          <CodePre>{`var a := Vector2(3, 4)
a.length()              # 5.0  (distance from origin)
a.normalized()          # same direction, length 1
a.distance_to(b)        # distance between two points
a.direction_to(b)       # unit vector pointing from a to b
a.angle()               # direction as an angle (radians)
a + b                   # add (combine offsets)
a * 2                   # scale
a.lerp(b, 0.5)          # the midpoint between a and b`}</CodePre>
          <h3>Smoothing &amp; interpolation</h3>
          <table>
            <tbody>
              <tr><th>Function</th><th>What it does</th></tr>
              <tr><td><code>lerp(a, b, t)</code></td><td>Blend from a to b by fraction t (0–1). The basis of smooth motion.</td></tr>
              <tr><td><code>clamp(x, lo, hi)</code></td><td>Keep a value inside bounds (e.g. keep something on-screen).</td></tr>
              <tr><td><code>move_toward(a, b, step)</code></td><td>Step a toward b by a fixed amount — constant-speed approach.</td></tr>
              <tr><td><code>snapped(x, step)</code></td><td>Snap a value to the nearest multiple — useful for grids!</td></tr>
            </tbody>
          </table>
          <CodePre>{`# Smoothly ease a node toward a target each frame:
func _process(delta):
	position = position.lerp(target, 10.0 * delta)

# Snap a pixel position to the nearest 120px grid cell:
var snapped_pos = snapped(raw_pos, Vector2(120, 120))`}</CodePre>
          <h3>Angles, sine, cosine</h3>
          <p>
            Godot measures angles in <strong>radians</strong> (a full circle is <code>TAU</code>, half is{' '}
            <code>PI</code>). Convert with <code>deg_to_rad()</code> / <code>rad_to_deg()</code>. For a
            puzzle game you'll rarely need trig, but a gentle bob uses it:
          </p>
          <CodePre>{`var t := 0.0
func _process(delta):
	t += delta
	# bob up and down by 8 pixels, smoothly
	position.y = base_y + sin(t * 3.0) * 8.0`}</CodePre>
          <h3>Randomness</h3>
          <CodePre>{`randi() % 6           # random int 0..5 (like a die: +1 for 1..6)
randf()               # random float 0.0..1.0
randf_range(0.5, 2.0) # random float in a range
[1,2,3].pick_random() # random element
randomize()           # seed from the clock (call once at startup)`}</CodePre>
          <Note>
            <strong>Grids are just division and multiplication.</strong> Cell = <code>floor(pixel / size)</code>;
            pixel = <code>cell * size</code>. That single pair of conversions is 90% of the "math" in Block
            Blast. If you can do that, you have all the math you need.
          </Note>
        </section>

        <hr />

        {/* SECTION 42 (s46) — INPUT REFERENCE */}
        <section className="section" id="s46" ref={setRef('s46')}>
          <h2><span className="section-num">42</span>Input &amp; Devices Reference</h2>
          <p>
            Everything you can ask about player input, in one place. For a touch game you'll mostly use the
            screen-touch events and a couple of <code>Input</code> singleton calls.
          </p>
          <h3>Input event types</h3>
          <table>
            <tbody>
              <tr><th>Event</th><th>Fires for</th></tr>
              <tr><td><code>InputEventScreenTouch</code></td><td>Finger down/up on a touchscreen. <code>.pressed</code>, <code>.position</code>, <code>.index</code> (which finger).</td></tr>
              <tr><td><code>InputEventScreenDrag</code></td><td>A finger moving while down. <code>.position</code>, <code>.relative</code> (movement since last).</td></tr>
              <tr><td><code>InputEventMouseButton</code></td><td>Mouse clicks (desktop / editor testing).</td></tr>
              <tr><td><code>InputEventMouseMotion</code></td><td>Mouse movement.</td></tr>
              <tr><td><code>InputEventKey</code></td><td>Keyboard keys.</td></tr>
            </tbody>
          </table>
          <h3>The Input singleton</h3>
          <CodePre>{`Input.is_action_pressed("pause")        # held right now?
Input.is_action_just_pressed("pause")   # pressed this frame?
Input.is_action_just_released("pause")  # released this frame?
Input.get_vector("left","right","up","down")  # a movement Vector2
Input.vibrate_handheld(50)              # buzz the phone ~50ms`}</CodePre>
          <h3>Input Map — name your inputs</h3>
          <p>
            Define <strong>actions</strong> in <strong>Project Settings → Input Map</strong> and bind keys,
            buttons, or touchscreen taps to them. Your code references the name, so you can remap without
            changing code:
          </p>
          <CodePre>{`# After adding an action named "pause" in the Input Map:
func _process(_delta):
	if Input.is_action_just_pressed("pause"):
		toggle_pause()`}</CodePre>
          <h3>Where input arrives</h3>
          <table>
            <tbody>
              <tr><th>Callback</th><th>Use</th></tr>
              <tr><td><code>_input(event)</code></td><td>All input, early. Good for global gestures (our drag &amp; drop).</td></tr>
              <tr><td><code>_unhandled_input(event)</code></td><td>Input not already consumed by UI. Good for gameplay so buttons take priority.</td></tr>
              <tr><td><code>_gui_input(event)</code></td><td>On Control nodes — input within that control's rect.</td></tr>
            </tbody>
          </table>
          <Note kind="warn">
            <strong>Touch vs mouse while testing.</strong> Enable <strong>Emulate Touch From Mouse</strong>{' '}
            so your Mac's clicks arrive as <code>InputEventScreenTouch</code>. Without it, you'd handle mouse
            events on desktop and touch on device — double the code and double the bugs.
          </Note>
        </section>

        <hr />

        {/* SECTION 43 (s47) — EDITOR SHORTCUTS */}
        <section className="section" id="s47" ref={setRef('s47')}>
          <h2><span className="section-num">43</span>Editor Shortcuts &amp; Power Tips</h2>
          <p>
            Small habits that make the editor feel fast. Learn three or four and the rest follow naturally.
          </p>
          <h3>Essential shortcuts</h3>
          <table>
            <tbody>
              <tr><th>Action</th><th>Shortcut</th></tr>
              <tr><td>Run project / current scene / stop</td><td><code>F5</code> / <code>F6</code> / <code>F8</code></td></tr>
              <tr><td>Add node</td><td><code>⌘A</code></td></tr>
              <tr><td>Save scene / save all</td><td><code>⌘S</code> / <code>⌘⌥S</code></td></tr>
              <tr><td>Open scene (quick)</td><td><code>⌘⇧O</code></td></tr>
              <tr><td>Open script (quick)</td><td><code>⌘⌥O</code></td></tr>
              <tr><td>Search in script</td><td><code>⌘F</code></td></tr>
              <tr><td>Comment/uncomment lines</td><td><code>⌘K</code></td></tr>
              <tr><td>Duplicate node</td><td><code>⌘D</code></td></tr>
            </tbody>
          </table>
          <h3>Editor power tips</h3>
          <ul>
            <li><strong>Drag a node into the script</strong> while holding <code>⌘</code> (or Ctrl) to paste a <code>get_node</code> path or <code>@onready</code> reference automatically.</li>
            <li><strong>Drag a file from FileSystem into the script</strong> to insert its <code>res://</code> path as a string — no typos.</li>
            <li><strong>The Node panel → Signals tab</strong> connects signals visually; double-click a signal to generate a handler stub.</li>
            <li><strong>Hold a value and drag</strong> on a number field in the Inspector to scrub it live.</li>
            <li><strong>Remote scene tree</strong> (while running, in the Scene dock) lets you inspect live values — invaluable for "why is this node here?"</li>
          </ul>
          <h3>Debugging tips</h3>
          <ul>
            <li><strong>Breakpoints:</strong> click the gutter next to a line; the game pauses there so you can inspect variables.</li>
            <li><strong>The error's top line</strong> in the Debugger names the file and line — start there.</li>
            <li><strong>print_debug()</strong> includes the file and line in the message automatically.</li>
            <li><strong>Errors panel</strong> shows runtime warnings (like "node not found") you might otherwise miss.</li>
          </ul>
          <Note>
            <strong>Configure once, enjoy forever.</strong> In <strong>Editor → Editor Settings</strong> you
            can bump the font size, enable a minimap, and tweak autosave. A comfortable editor is a small
            thing that compounds over every hour you spend building.
          </Note>
        </section>

        <hr />

        {/* SECTION 44 (s43) — GLOSSARY */}
        <section className="section" id="s43" ref={setRef('s43')}>
          <h2><span className="section-num">44</span>Glossary</h2>
          <p>Every term this guide uses, in one place. Skim it now; refer back whenever a word trips you up.</p>
          <h4>Godot &amp; game-dev terms</h4>
          <table>
            <tbody>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td><strong>Game loop</strong></td><td>The read-input → update → draw cycle that runs many times per second.</td></tr>
              <tr><td><strong>Frame</strong></td><td>One pass of the game loop. 60 FPS = 60 frames per second.</td></tr>
              <tr><td><strong>Delta</strong></td><td>Seconds elapsed since the previous frame; used to keep motion frame-rate independent.</td></tr>
              <tr><td><strong>Node</strong></td><td>The basic building block; each does one job (draw, play sound, etc.).</td></tr>
              <tr><td><strong>Scene</strong></td><td>A saved tree of nodes (a <code>.tscn</code> file); can be any size and reused.</td></tr>
              <tr><td><strong>Instance</strong></td><td>A copy of a scene placed inside another scene.</td></tr>
              <tr><td><strong>Signal</strong></td><td>A message a node emits when something happens, that others can react to.</td></tr>
              <tr><td><strong>Autoload</strong></td><td>A script/scene Godot keeps loaded for the whole game (global state, audio).</td></tr>
              <tr><td><strong>GDScript</strong></td><td>Godot's built-in, Python-like programming language.</td></tr>
              <tr><td><strong>Resource</strong></td><td>A reusable data asset saved to a file (font, texture, theme, custom data).</td></tr>
              <tr><td><strong>Viewport</strong></td><td>The rectangle the game is drawn into.</td></tr>
              <tr><td><strong>Tween</strong></td><td>A code-driven animation that changes a property over time.</td></tr>
              <tr><td><strong>Export preset / template</strong></td><td>A saved per-platform build config / the platform code needed to build it.</td></tr>
            </tbody>
          </table>
          <h4>Apple &amp; shipping terms</h4>
          <table>
            <tbody>
              <tr><th>Term</th><th>Meaning</th></tr>
              <tr><td><strong>Xcode</strong></td><td>Apple's official app for building and submitting iOS apps.</td></tr>
              <tr><td><strong>Bundle identifier</strong></td><td>Your app's unique reverse-domain id, e.g. <code>com.you.blockblast</code>.</td></tr>
              <tr><td><strong>Signing certificate</strong></td><td>A digital ID proving a build is yours; Xcode manages it.</td></tr>
              <tr><td><strong>Provisioning profile</strong></td><td>A permission slip linking your certificate, app id, and allowed devices.</td></tr>
              <tr><td><strong>Archive</strong></td><td>A release build packaged for distribution/upload.</td></tr>
              <tr><td><strong>App Store Connect</strong></td><td>Apple's website for managing apps, builds, testers, and listings.</td></tr>
              <tr><td><strong>TestFlight</strong></td><td>Apple's beta-testing service and app for installing pre-release builds.</td></tr>
              <tr><td><strong>Team ID</strong></td><td>Your developer team's 10-character identifier used in signing.</td></tr>
            </tbody>
          </table>
          <p>
            That's the vocabulary of shipping a game. None of it is as complicated as it first sounds — and
            you've now used most of it for real.
          </p>
        </section>

        <hr />

        {/* SECTION 31 — TROUBLESHOOTING */}
        <section className="section" id="s31" ref={setRef('s31')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>
          <p>
            The errors below trip up nearly every beginner. Skim them now so they're familiar when they
            happen — because they will.
          </p>
          <h4>Godot won't open ("unidentified developer")</h4>
          <p>
            Gatekeeper. Right-click the app → <strong>Open</strong>, or allow it in{' '}
            <strong>System Settings → Privacy &amp; Security → Open Anyway</strong>. See the install
            section.
          </p>
          <h4>"No export template found for the selected platform"</h4>
          <p>
            You didn't install (or updated past) the export templates. Run{' '}
            <strong>Editor → Manage Export Templates → Download and Install</strong> for your exact Godot
            version.
          </p>
          <h4>Xcode: "Failed to register bundle identifier"</h4>
          <p>
            The bundle id is taken or malformed. Use a unique reverse-domain string and make sure it
            matches in Godot's preset, Xcode's Signing tab, and App Store Connect.
          </p>
          <h4>Xcode: "No account / No signing certificate"</h4>
          <p>
            Add your Apple ID in <strong>Xcode → Settings → Accounts</strong>, then pick your Team under{' '}
            <strong>Signing &amp; Capabilities</strong> with <strong>Automatically manage signing</strong>{' '}
            checked.
          </p>
          <h4>Black screen or wrong size on the phone</h4>
          <p>
            Check <strong>Project Settings → Display → Window</strong>: set the stretch mode to{' '}
            <code>canvas_items</code>, aspect to <code>expand</code>, and orientation to{' '}
            <code>portrait</code>. Confirm your main scene is set.
          </p>
          <h4>Upload rejected: icon has an alpha channel</h4>
          <p>
            Re-export the 1024×1024 App Store icon as a flat image with a solid background — no
            transparency.
          </p>
          <h4>Touch/drag doesn't work when testing on the computer</h4>
          <p>
            Enable <strong>Project Settings → Input Devices → Pointing → Emulate Touch From Mouse</strong>{' '}
            so mouse clicks register as touches.
          </p>
          <h4>"Build expired" on TestFlight or device</h4>
          <p>
            Free-account device builds last 7 days; TestFlight builds last 90 days. Bump the build number
            and upload again.
          </p>
          <div className="card">
            <h4>The universal debugging move</h4>
            <p style={{ marginBottom: 0 }}>
              When something behaves wrong in-game, sprinkle <code>print()</code> calls and watch the{' '}
              <strong>Output</strong> panel. "Is this function even running? What's this value right now?"
              answers 90% of bugs. The <strong>Debugger</strong> panel shows the exact line of any crash —
              read the top line of the error, it usually tells you the file and line.
            </p>
          </div>
        </section>

        <hr />

        {/* SECTION 32 — CHEAT SHEET */}
        <section className="section" id="s32" ref={setRef('s32')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>
          <h4>Editor shortcuts</h4>
          <table>
            <tbody>
              <tr><th>Action</th><th>Shortcut</th></tr>
              <tr><td>Run project</td><td><code>F5</code></td></tr>
              <tr><td>Run current scene</td><td><code>F6</code></td></tr>
              <tr><td>Stop running</td><td><code>F8</code></td></tr>
              <tr><td>Add node to scene</td><td><code>⌘A</code></td></tr>
              <tr><td>Save scene</td><td><code>⌘S</code></td></tr>
              <tr><td>Search nodes/files (Quick Open)</td><td><code>⌘⇧O</code> (scenes) / <code>⌘⌥O</code> (scripts)</td></tr>
            </tbody>
          </table>
          <h4>GDScript quick reference</h4>
          <CodePre>{`var x = 5                 # variable
const N = 8               # constant
func do_thing(a, b):      # function
	return a + b

if x > 3: pass            # condition
for i in range(8): pass   # loop 0..7
while x > 0: x -= 1       # loop until false

var list = [1, 2, 3]      # array (index from 0)
var map = {"k": 1}        # dictionary
var pos = Vector2(10, 20) # 2D point

$Child                    # get child node by name
print("debug:", x)        # log to Output
get_tree().change_scene_to_file("res://x.tscn")`}</CodePre>
          <h4>Key file paths</h4>
          <table>
            <tbody>
              <tr><th>Prefix</th><th>Means</th></tr>
              <tr><td><code>res://</code></td><td>Your project root (read-only at runtime).</td></tr>
              <tr><td><code>user://</code></td><td>Per-app writable storage (saves go here).</td></tr>
            </tbody>
          </table>
          <h4>The ship-to-TestFlight checklist</h4>
          <ul>
            <li>☐ Apple Developer Program active ($99/yr), agreements accepted.</li>
            <li>☐ Xcode installed; Apple ID added; Team visible.</li>
            <li>☐ Godot iOS export templates installed (matching version).</li>
            <li>☐ iOS export preset: unique bundle id, name, version, build number.</li>
            <li>☐ App Store 1024×1024 icon (no alpha) + launch screen set.</li>
            <li>☐ Portrait orientation + correct stretch mode.</li>
            <li>☐ Export Xcode project → open → Signing: Team selected, auto-signing on.</li>
            <li>☐ App record created in App Store Connect (matching bundle id).</li>
            <li>☐ Product → Archive → Distribute → Upload.</li>
            <li>☐ Build processed → add Internal Tester → install via TestFlight app.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 33 — WHERE TO GO NEXT */}
        <section className="section" id="s33" ref={setRef('s33')}>
          <h2><span className="section-num">→</span>Where to Go Next</h2>
          <p>
            You now have the whole pipeline in your head: install, build, learn the language, and ship to
            a phone. The fastest way to cement it is to build a real, small game end to end — which is
            exactly what the companion guide walks you through.
          </p>
          <div className="card">
            <h4>Your immediate next step</h4>
            <p style={{ marginBottom: 0 }}>
              Open <strong>"Build a Block Blast Clone"</strong> in this Knowledge Base. It uses everything
              here — nodes, scenes, GDScript, touch input, autoloads, saving, and the iOS export pipeline —
              to build a polished, shippable puzzle game step by step.
            </p>
          </div>
          <h3>Resources worth bookmarking</h3>
          <table>
            <tbody>
              <tr><th>Resource</th><th>Why</th></tr>
              <tr><td><strong>docs.godotengine.org</strong></td><td>The official manual — searchable, with a great "Your first 2D game" tutorial.</td></tr>
              <tr><td><strong>Godot Asset Library</strong></td><td>Free addons and sample projects, browsable inside the editor (AssetLib tab).</td></tr>
              <tr><td><strong>r/godot &amp; the Godot Discord</strong></td><td>Friendly communities for when you're stuck.</td></tr>
              <tr><td><strong>kenney.nl &amp; itch.io</strong></td><td>Free, permissively-licensed art and sound packs.</td></tr>
              <tr><td><strong>freesound.org</strong></td><td>Free sound effects (check each license).</td></tr>
            </tbody>
          </table>
          <h3>Good "next games" after Block Blast</h3>
          <ul>
            <li>A <strong>2048</strong> clone — another grid + simple rules, great for practicing arrays.</li>
            <li>A <strong>memory match</strong> game — tap pairs, simple state, easy to polish.</li>
            <li>A <strong>flappy-style</strong> tapper — introduces gravity and continuous motion.</li>
          </ul>
          <p>
            Each one reuses these same fundamentals while teaching one new thing. Build small, ship often,
            and you'll improve faster than any tutorial can teach you.
          </p>
          <p className="finished-marker">★ You can install Godot, write GDScript, and ship an iOS app to TestFlight. Now go build the game.</p>
        </section>
      </main>
    </div>
  );
}

function Note({ children, kind = 'info' }: { children: React.ReactNode; kind?: 'info' | 'warn' }) {
  return (
    <div className={`alert ${kind === 'warn' ? 'warn' : 'info'}`}>
      <span className="alert-icon">{kind === 'warn' ? '⚠️' : '💡'}</span>
      <div>{children}</div>
    </div>
  );
}
