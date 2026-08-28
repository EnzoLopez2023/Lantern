import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import { FULL_SOURCE } from './BlockBlastFullSource';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: "What We're Building",       icon: '🎯' },
  { id: 's2',  num: '2',  title: 'Game Design Breakdown',     icon: '📐' },
  { id: 's3',  num: '3',  title: 'Project Setup',             icon: '🏗️' },
  { id: 's4',  num: '4',  title: 'The Grid Data Model',       icon: '🧮' },
  { id: 's5',  num: '5',  title: 'Drawing the Board',         icon: '🟦' },
  { id: 's6',  num: '6',  title: 'Defining Block Pieces',     icon: '🧱' },
  { id: 's7',  num: '7',  title: 'The Piece Tray',            icon: '🎴' },
  { id: 's8',  num: '8',  title: 'Rendering a Piece',         icon: '🖌️' },
  { id: 's9',  num: '9',  title: 'Drag & Drop: Pick Up',      icon: '👆' },
  { id: 's10', num: '10', title: 'Drag & Drop: Snap & Ghost', icon: '👻' },
  { id: 's11', num: '11', title: 'Placement Validation',      icon: '✅' },
  { id: 's12', num: '12', title: 'Committing a Placement',    icon: '📥' },
  { id: 's13', num: '13', title: 'Clearing Lines',            icon: '💥' },
  { id: 's14', num: '14', title: 'Scoring & Combos',          icon: '🏆' },
  { id: 's15', num: '15', title: 'Refilling the Tray',        icon: '🔄' },
  { id: 's16', num: '16', title: 'Game Over Detection',       icon: '🛑' },
  { id: 's17', num: '17', title: 'The Game Over Screen',      icon: '💀' },
  { id: 's18', num: '18', title: 'Juice, Part 1: Motion',     icon: '✨' },
  { id: 's19', num: '19', title: 'Juice, Part 2: Effects',    icon: '🎆' },
  { id: 's20', num: '20', title: 'Sound Effects',             icon: '🔊' },
  { id: 's21', num: '21', title: 'Saving the High Score',     icon: '💾' },
  { id: 's22', num: '22', title: 'The Main Menu',             icon: '🏠' },
  { id: 's23', num: '23', title: 'Pause & Restart',           icon: '⏸️' },
  { id: 's24', num: '24', title: 'Mobile Polish',             icon: '📱' },
  { id: 's25', num: '25', title: 'Playtesting',               icon: '🧪' },
  { id: 's26', num: '26', title: 'Pre-Ship Checklist',        icon: '📋' },
  { id: 's27', num: '27', title: 'Shipping to TestFlight',    icon: '✈️' },
  { id: 's31', num: '28', title: 'Settings Screen',           icon: '⚙️' },
  { id: 's32', num: '29', title: 'Difficulty & Weighting',    icon: '🎚️' },
  { id: 's33', num: '30', title: 'Daily Challenge (Seeded)',  icon: '📅' },
  { id: 's34', num: '31', title: 'Resuming a Saved Game',     icon: '♻️' },
  { id: 's35', num: '32', title: 'Accessibility',             icon: '♿' },
  { id: 's36', num: '33', title: 'Full Source: Core Files',   icon: '📄' },
  { id: 's37', num: '34', title: 'Full Source: Piece & Board', icon: '📄' },
  { id: 's38', num: '35', title: 'Full Source: Game.gd',      icon: '📄' },
  { id: 's39', num: '36', title: 'Scene Construction Reference', icon: '🌲' },
  { id: 's40', num: '37', title: 'Theming & Fonts',           icon: '🎨' },
  { id: 's41', num: '38', title: 'Music & Audio Buses',       icon: '🎵' },
  { id: 's42', num: '39', title: 'Stats & Progression',       icon: '📈' },
  { id: 's28', num: '?',  title: 'Bug Hunt',                  icon: '🐛' },
  { id: 's29', num: '+',  title: 'Extending the Game',        icon: '🚀' },
  { id: 's30', num: '✦',  title: 'Source Recap',              icon: '🗂️' },
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

function FullSourceSoFar({ sectionId }: { sectionId: string }) {
  const files = FULL_SOURCE[sectionId];
  if (!files || files.length === 0) return null;
  return (
    <details className="full-source">
      <summary>📄 Full source so far (every file, as it should look right now)</summary>
      <div className="full-source-body">
        {files.map(f => (
          <div className="full-source-file" key={f.path}>
            <div className="full-source-filename">{f.path}</div>
            <CodePre>{f.code}</CodePre>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function BlockBlastCloneGuide() {
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
            <span className="sidebar-title">Block Blast Clone</span>
          </div>
          <div className="sidebar-sub">Godot 4 · step by step</div>
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
          <div className="hero-tag">🧩 Block Blast Clone · Godot 4 · GDScript · 2026</div>
          <h1>Build a Block Blast Clone<br />(Godot 4, Step by Step)</h1>
          <p>
            We'll build a complete, polished <strong style={{ color: '#C77AA0' }}>Block Blast</strong>-style
            puzzle game from an empty Godot project to a build on your iPhone via TestFlight. Drag pieces
            onto an 8×8 grid, fill rows and columns to clear them, chase a high score, and lose when
            nothing fits. Every script is shown in full and explained line by line. If you've read the{' '}
            <strong style={{ color: '#C77AA0' }}>Godot 4 for Beginners</strong> guide, you have everything
            you need to follow along.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">8×8</span><span className="hero-stat-label">Grid</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Pieces per tray</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~600</span><span className="hero-stat-label">Lines of GDScript</span></div>
            <div className="hero-stat"><span className="hero-stat-val">100%</span><span className="hero-stat-label">No art files needed</span></div>
          </div>
        </div>

        {/* SECTION 1 — WHAT WE'RE BUILDING */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>What We're Building</h2>
          <p>
            Block Blast is a deceptively simple puzzle game. You have a square grid. Below it, a tray
            offers three block shapes. You drag each shape onto the grid wherever it fits. Whenever a full
            row or full column is completely filled, those cells <strong>clear</strong> and you score.
            When you've placed all three shapes, you get three new ones. The game ends when none of your
            three current shapes can fit anywhere on the board. The whole goal is to last as long as
            possible and rack up a high score.
          </p>
          <p>Here's the screen we're aiming for, in ASCII:</p>
          <div className="arch-diagram">
            <span className="dim">┌─────────── SCORE: 1280 ───────────┐</span>{'\n'}
            ░ ░ ░ █ █ ░ ░ ░{'\n'}
            ░ ░ ░ █ █ ░ ░ ░{'\n'}
            ░ █ █ ░ ░ ░ ░ ░{'\n'}
            █ █ ░ ░ ░ ░ ░ █{'\n'}
            ░ ░ ░ ░ ░ ░ ░ █{'\n'}
            ░ ░ ░ ░ █ █ ░ ░{'\n'}
            ░ ░ ░ ░ █ █ ░ ░{'\n'}
            ░ ░ ░ ░ ░ ░ ░ ░{'\n'}
            <span className="dim">└──────────── TRAY ─────────────────┘</span>{'\n'}
            {'  '}<span className="highlight">█</span>{'      '}<span className="highlight">█ █</span>{'    '}<span className="highlight">█</span>{'\n'}
            {'  '}<span className="highlight">█ █</span>{'    '}<span className="highlight">█ █</span>{'    '}<span className="highlight">█</span>{'\n'}
            {'  '}<span className="dim">(drag a piece up onto the board)</span>
          </div>
          <h3>Why this is a great first game</h3>
          <ul>
            <li><strong>Pure 2D, no physics.</strong> Everything is a grid of cells — integer math, no gravity, no collisions to tune.</li>
            <li><strong>No art required.</strong> Colored rounded squares look fantastic and are drawn in code.</li>
            <li><strong>Self-contained.</strong> One screen, clear rules, a satisfying loop — perfect scope for finishing.</li>
            <li><strong>Touch-native.</strong> Drag-and-drop is the whole interaction, ideal for learning mobile input.</li>
          </ul>
          <h3>What you need first</h3>
          <p>
            You need Godot 4 installed. That's genuinely it — <strong>you do not need to already know your
            way around the editor.</strong> Every time this guide asks you to do something in Godot, it spells
            out which panel to look at, which button to click, and what you should see afterwards. Where a
            skill gets reused (adding a child node, attaching a script, setting an anchor), it's taught once
            in full and then referred back to.
          </p>
          <p>
            <strong>"Godot 4 for Beginners"</strong> in this Knowledge Base is still worth reading alongside —
            it explains the <em>why</em> behind the engine's concepts, and covers the iOS/TestFlight pipeline
            in more depth than the summary at the end of this guide. But you can follow this one cold.
          </p>
          <Note>
            <strong>If a step ever loses you</strong>, check the tree diagram at the end of the section — the
            guide prints a "checkpoint" of exactly what your Scene dock should contain, so you can compare
            and spot a missing or misplaced node before it turns into a crash three sections later.
          </Note>
          <Note>
            <strong>Build it in order.</strong> Each section adds one working piece and leaves the game
            runnable. Resist skipping ahead — by section 16 you'll have a fully playable game, and the rest
            is polish and shipping.
          </Note>
        </section>

        <hr />

        {/* SECTION 2 — GAME DESIGN BREAKDOWN */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Game Design Breakdown</h2>
          <p>
            Before writing code, let's pin down the exact rules and the data they imply. Being precise now
            saves debugging later.
          </p>
          <h3>The rules, exactly</h3>
          <table>
            <tbody>
              <tr><th>Rule</th><th>Detail</th></tr>
              <tr><td>Board</td><td>An 8×8 grid. Each cell is empty or filled with a color.</td></tr>
              <tr><td>Tray</td><td>Holds 3 pieces at a time. Each piece is a small shape of 1–5 cells.</td></tr>
              <tr><td>Placing</td><td>Drag a piece onto the board. It can be placed only where every one of its cells lands on an empty board cell, fully in bounds.</td></tr>
              <tr><td>No rotation</td><td>Unlike Tetris, pieces are NOT rotated. What you see is how it places. (Simpler, and true to Block Blast.)</td></tr>
              <tr><td>Clearing</td><td>After each placement, every fully-filled row AND column clears at once.</td></tr>
              <tr><td>Refill</td><td>When all 3 tray pieces are used, deal 3 new random pieces.</td></tr>
              <tr><td>Scoring</td><td>Points for each placed cell, plus a bigger reward for clearing lines (with a multi-line combo bonus).</td></tr>
              <tr><td>Game over</td><td>If none of the remaining tray pieces can fit anywhere, the game ends.</td></tr>
            </tbody>
          </table>
          <h3>The core game loop</h3>
          <MermaidDiagram theme="default" chart={`graph TB
  DEAL["Deal 3 pieces to the tray"] --> WAIT["Wait for player to drag a piece"]
  WAIT --> VALID{"Valid placement?"}
  VALID -->|no| WAIT
  VALID -->|yes| PLACE["Write piece into grid, remove from tray"]
  PLACE --> CLEAR["Clear full rows + columns, add score"]
  CLEAR --> EMPTY{"Tray empty?"}
  EMPTY -->|yes| DEAL
  EMPTY -->|no| OVER{"Any tray piece still fits?"}
  OVER -->|yes| WAIT
  OVER -->|no| GAMEOVER["Game Over"]`} />
          <h3>The data we'll need</h3>
          <table>
            <tbody>
              <tr><th>Data</th><th>Shape</th><th>Lives in</th></tr>
              <tr><td>The board</td><td>8×8 array of <code>Color</code> or empty</td><td><code>Board.gd</code></td></tr>
              <tr><td>Piece catalog</td><td>List of shapes (cell offsets + color)</td><td><code>Pieces.gd</code></td></tr>
              <tr><td>The tray</td><td>Array of up to 3 piece instances</td><td><code>Game.gd</code></td></tr>
              <tr><td>Score / best</td><td>Two integers, best is saved</td><td><code>GameState.gd</code> (autoload)</td></tr>
            </tbody>
          </table>
          <h3>Coordinate convention (decide once, never waver)</h3>
          <p>
            We'll describe a grid cell as a <code>Vector2i</code> where <strong><code>x</code> is the
            column</strong> (across) and <strong><code>y</code> is the row</strong> (down). That matches
            screen pixels: a cell's pixel position is <code>Vector2(x * CELL, y * CELL)</code>. Sticking to
            "x = column, y = row" everywhere prevents the #1 grid bug: swapped rows and columns.
          </p>
          <Note kind="warn">
            <strong>Vector2i vs Vector2.</strong> <code>Vector2i</code> holds whole numbers (grid cells);{' '}
            <code>Vector2</code> holds decimals (pixel positions). We use <code>Vector2i</code> for grid
            math and <code>Vector2</code> for drawing. Keeping them separate avoids subtle rounding bugs.
          </Note>
        </section>

        <hr />

        {/* SECTION 3 — PROJECT SETUP */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Project Setup</h2>
          <p>
            Let's create the project and lay out the folders and scenes so everything has a home.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Create the project</div>
                <div className="tl-desc">
                  Open Godot. The first window you see is the <strong>Project Manager</strong> (a list of
                  projects). Click <strong>+ Create</strong> (top-left). In the dialog: set{' '}
                  <strong>Project Name</strong> to <code>BlockBlast</code>; click <strong>Browse</strong>{' '}
                  next to <strong>Project Path</strong> and choose an empty folder such as{' '}
                  <code>~/Documents/GodotProjects/BlockBlast</code>; under <strong>Renderer</strong> pick{' '}
                  <strong>Mobile</strong>. Click <strong>Create &amp; Edit</strong>. The editor opens on an
                  empty project.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Set the screen size and orientation</div>
                <div className="tl-desc">
                  Menu bar: <strong>Project → Project Settings…</strong>. A window opens with a long list of
                  categories down the left. Click <strong>Display</strong>, then its <strong>Window</strong>{' '}
                  sub-item. Now set four fields on the right:
                  <br />• <strong>Size → Viewport Width</strong> = <code>1080</code>
                  <br />• <strong>Size → Viewport Height</strong> = <code>1920</code>
                  <br />• <strong>Stretch → Mode</strong> = <code>canvas_items</code>
                  <br />• <strong>Stretch → Aspect</strong> = <code>expand</code>
                  <br />
                  Then scroll to <strong>Handheld → Orientation</strong> and set it to{' '}
                  <code>portrait</code>. Leave the window open — the next step is in the same place.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Let the mouse pretend to be a finger</div>
                <div className="tl-desc">
                  Still in Project Settings, find <strong>Input Devices</strong> in the left list and click
                  its <strong>Pointing</strong> sub-item. Tick{' '}
                  <strong>Emulate Touch From Mouse</strong>. Without this, the touch code we write later
                  won't react to your mouse and the game will feel broken on your computer. Click{' '}
                  <strong>Close</strong>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Make the three folders</div>
                <div className="tl-desc">
                  Look at the <strong>FileSystem</strong> dock (bottom-left). It shows one root row:{' '}
                  <code>res://</code>. Right-click that <code>res://</code> row →{' '}
                  <strong>Create New → Folder…</strong> → type <code>scenes</code> → <strong>OK</strong>.
                  Repeat twice more for <code>scripts</code> and <code>audio</code>. You should end up with
                  three folders under <code>res://</code>.
                </div>
              </div>
            </div>
          </div>
          <Note kind="warn">
            <strong>Don't skip step 3.</strong> "Emulate Touch From Mouse" is the single most common reason
            a beginner's drag-and-drop appears to do nothing when they press Play. If pieces later refuse to
            move, come back and check this box first.
          </Note>
          <h3>The scene tree we're heading toward</h3>
          <p>The finished game has a clear structure. Here's the target so the pieces make sense as we add them:</p>
          <div className="arch-diagram">
            Game <span className="dim">(Node2D, scripts/Game.gd) — main scene</span>{'\n'}
            ├─ Board <span className="dim">(Node2D, scripts/Board.gd) — grid data + drawing</span>{'\n'}
            ├─ Tray  <span className="dim">(Node2D) — holds up to 3 Piece nodes</span>{'\n'}
            └─ HUD   <span className="dim">(CanvasLayer)</span>{'\n'}
            {'   '}├─ ScoreLabel <span className="dim">(Label)</span>{'\n'}
            {'   '}└─ GameOverPanel <span className="dim">(Control, hidden until game over)</span>
          </div>
          <Note>
            <strong>Know your panels first.</strong> Every instruction below names one of Godot's docks. The{' '}
            <strong>Scene dock</strong> (top-left) is the node tree of the scene you're editing. The{' '}
            <strong>FileSystem dock</strong> (bottom-left) is the actual files on disk. The{' '}
            <strong>Inspector</strong> (right) shows the properties of whichever node is selected. The{' '}
            <strong>viewport</strong> (middle) is the canvas. If one is missing or you've moved things
            around, reset with <strong>Editor → Editor Layout → Default</strong>.
          </Note>

          <h3>Create the main scene</h3>
          <p>
            We're building the tree shown above. Two rules that trip up everyone at first:
          </p>
          <ul>
            <li>
              A new node is always added as a <strong>child of whatever node is currently selected</strong>.
              So before adding each node, click the intended parent first.
            </li>
            <li>
              Names must match <strong>exactly</strong>, capital letters included. Later scripts find these
              nodes by name (<code>$Board</code>, <code>$Tray</code>), so <code>board</code> or{' '}
              <code>Board2</code> will break them.
            </li>
          </ul>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Start a new scene</div>
                <div className="tl-desc">
                  In the menu bar: <strong>Scene → New Scene</strong>. The Scene dock now shows a{' '}
                  <strong>Create Root Node</strong> panel with four big buttons.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Add the root node</div>
                <div className="tl-desc">
                  Click <strong>2D Scene</strong>. A root node called <code>Node2D</code> appears in the
                  Scene dock. (That button is just a shortcut for "give me a Node2D root".)
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Rename it to Game</div>
                <div className="tl-desc">
                  Double-click the node's name in the Scene dock — or select it and press <code>F2</code> —
                  type <code>Game</code>, then press <code>Enter</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">Save it as scenes/game.tscn</div>
                <div className="tl-desc">
                  Press <code>Ctrl+S</code> (<code>Cmd+S</code> on Mac). In the save dialog, double-click the{' '}
                  <code>scenes</code> folder so the path at the top reads <code>res://scenes/</code>. Type{' '}
                  <code>game.tscn</code> as the file name and click <strong>Save</strong>. The scene's tab
                  should now say <em>Game</em>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">5</div>
              <div className="tl-content">
                <div className="tl-title">Add the Board child</div>
                <div className="tl-desc">
                  Click <code>Game</code> in the Scene dock to select it. Click the <strong>+</strong> button
                  at the top of that dock (its tooltip is "Add Child Node"; shortcut <code>Ctrl+A</code>). A{' '}
                  <strong>Create New Node</strong> window opens with a search box. Type{' '}
                  <code>Node2D</code>, click <strong>Node2D</strong> in the results, then click{' '}
                  <strong>Create</strong>. Press <code>F2</code> and rename it to <code>Board</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">6</div>
              <div className="tl-content">
                <div className="tl-title">Add the Tray child</div>
                <div className="tl-desc">
                  <strong>Click <code>Game</code> again first</strong> — if <code>Board</code> is still
                  selected, the new node lands inside it. Then <code>Ctrl+A</code> → search{' '}
                  <code>Node2D</code> → <strong>Create</strong> → rename to <code>Tray</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">7</div>
              <div className="tl-content">
                <div className="tl-title">Add the HUD layer</div>
                <div className="tl-desc">
                  Select <code>Game</code> again → <code>Ctrl+A</code> → search <code>CanvasLayer</code> →{' '}
                  <strong>Create</strong> → rename to <code>HUD</code>. A CanvasLayer draws on top of the
                  game and ignores camera movement — exactly what a score display wants.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">8</div>
              <div className="tl-content">
                <div className="tl-title">Add ScoreLabel inside HUD</div>
                <div className="tl-desc">
                  This one is a child of <code>HUD</code>, not <code>Game</code>. Select <code>HUD</code> →{' '}
                  <code>Ctrl+A</code> → search <code>Label</code> → <strong>Create</strong> → rename to{' '}
                  <code>ScoreLabel</code>.
                  <br />
                  <strong>Then make it visible</strong>, because a fresh Label is 16px text parked at the
                  top-left corner — on a 1080 × 1920 screen that's a speck you'll never notice. With{' '}
                  <code>ScoreLabel</code> selected, in the <strong>Inspector</strong>: set{' '}
                  <strong>Text</strong> to <code>0</code>; under <strong>Transform → Position</strong> set{' '}
                  <code>x = 60</code>, <code>y = 180</code>; and under{' '}
                  <strong>Theme Overrides → Font Sizes</strong> click <strong>Font Size</strong> and set it to{' '}
                  <code>90</code>. (Later, the Theming section replaces these one-off overrides with a proper
                  Theme resource.)
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">9</div>
              <div className="tl-content">
                <div className="tl-title">Save, then make it the main scene</div>
                <div className="tl-desc">
                  Press <code>Ctrl+S</code> again. Now press <code>F5</code> (Run Project). Because no main
                  scene exists yet, Godot pops up a dialog offering to pick one — click{' '}
                  <strong>Select Current</strong> and it will use <code>game.tscn</code>. A blank grey window
                  opens: that is correct, there is nothing to draw yet. Close it. (You can change this later
                  under <strong>Project → Project Settings → Application → Run → Main Scene</strong>.)
                </div>
              </div>
            </div>
          </div>

          <Note kind="warn">
            <strong>Put a node under the wrong parent?</strong> Don't delete it — in the Scene dock, drag the
            node and drop it <em>onto</em> the node you meant (dropping onto a node makes it a child;
            dropping between two nodes makes it a sibling). Fix the tree before moving on: every later
            section assumes these exact names and parents.
          </Note>

          <p>
            <strong>Checkpoint.</strong> Your Scene dock should now read exactly this — five nodes, with
            ScoreLabel indented under HUD:
          </p>
          <div className="arch-diagram">
            Game <span className="dim">(Node2D) — the root</span>{'\n'}
            ├─ Board <span className="dim">(Node2D)</span>{'\n'}
            ├─ Tray <span className="dim">(Node2D)</span>{'\n'}
            └─ HUD <span className="dim">(CanvasLayer)</span>{'\n'}
            {'   '}└─ ScoreLabel <span className="dim">(Label)</span>
          </div>

          <h3>Two autoloads</h3>
          <p>
            An <strong>autoload</strong> (Godot's word for a singleton) is a script that Godot loads once at
            startup and keeps alive for the whole game, reachable from any other script just by typing its
            name. We need two: <code>GameState</code> to hold the score, and <code>Sfx</code> to play sounds.
            Setting one up is two jobs — <em>create the file</em>, then <em>register it</em>.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Create the GameState script file</div>
                <div className="tl-desc">
                  In the <strong>FileSystem</strong> dock, right-click the <code>scripts</code> folder →{' '}
                  <strong>Create New → Script…</strong>. In the dialog, leave <strong>Language</strong> as{' '}
                  <code>GDScript</code>, set <strong>Inherits</strong> to <code>Node</code>, and set the{' '}
                  <strong>Path</strong> to <code>res://scripts/GameState.gd</code>. Click{' '}
                  <strong>Create</strong>. Godot opens the new file in the Script editor.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Replace its contents</div>
                <div className="tl-desc">
                  Select everything already in the file (<code>Ctrl+A</code>) and paste the code below over
                  it, then save with <code>Ctrl+S</code>. GDScript indents with <strong>tabs</strong>, not
                  spaces — the copy button below preserves them.
                </div>
              </div>
            </div>
          </div>
          <CodePre>{`# scripts/GameState.gd  (autoload: GameState)
extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0`}</CodePre>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Create the Sfx script file the same way</div>
                <div className="tl-desc">
                  Right-click <code>scripts</code> → <strong>Create New → Script…</strong> → Inherits{' '}
                  <code>Node</code>, Path <code>res://scripts/Sfx.gd</code> → <strong>Create</strong>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">Paste in placeholder sound calls</div>
                <div className="tl-desc">
                  From Section 9 onward this guide has you call things like{' '}
                  <code>Sfx.play_pick()</code> long before Section 20 builds real audio players. Paste this
                  now so those calls quietly do nothing instead of crashing the game — Section 20 replaces
                  this whole file with the real version, so there's nothing to remember later.
                </div>
              </div>
            </div>
          </div>
          <CodePre>{`# scripts/Sfx.gd  (autoload: Sfx)
extends Node

# Placeholders — every call below is safe to make from any script right
# now. Section 20 replaces this whole file with real audio players.
func play_pick() -> void: pass
func play_place() -> void: pass
func play_clear() -> void: pass
func play_over() -> void: pass`}</CodePre>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">5</div>
              <div className="tl-content">
                <div className="tl-title">Register both as autoloads</div>
                <div className="tl-desc">
                  Open <strong>Project → Project Settings</strong>, then click the <strong>Globals</strong>{' '}
                  tab along the top (in Godot 4.0–4.2 this tab is named <strong>Autoload</strong> instead).
                  Click the small <strong>folder icon</strong> next to the <strong>Path</strong> field,
                  choose <code>res://scripts/GameState.gd</code>, and press <strong>Open</strong>. The{' '}
                  <strong>Node Name</strong> field auto-fills with <code>GameState</code> — leave it, because
                  that is the exact word you'll type in code. Click <strong>Add</strong>. Repeat the whole
                  step for <code>res://scripts/Sfx.gd</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">6</div>
              <div className="tl-content">
                <div className="tl-title">Verify, then close</div>
                <div className="tl-desc">
                  The list should now show two rows — <code>GameState</code> and <code>Sfx</code> — each with
                  its <strong>Enable</strong> checkbox ticked. Close Project Settings. From now on, any script
                  in the project can write <code>GameState.score += 10</code> with no imports and no setup.
                </div>
              </div>
            </div>
          </div>
          <Note>
            <strong>Why split into Board / Game / autoloads?</strong> Each file has one job: the Board owns
            grid data and drawing, the Game owns the rules and input, and the autoloads hold game-wide
            state and sound. Small, single-purpose files are far easier to debug than one giant script.
          </Note>
                  <FullSourceSoFar sectionId="s3" />
        </section>

        <hr />

        {/* SECTION 4 — GRID DATA MODEL */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The Grid Data Model</h2>
          <p>
            The board is the heart of the game, and it's just a grid of values in memory. Let's build{' '}
            <code>Board.gd</code> starting with the data and the small helper functions everything else
            relies on. First we need to <strong>attach</strong> a script to the <code>Board</code> node —
            "attaching" means gluing a code file to a node so that the node runs that code.
          </p>
          <h3>How to attach a script (you'll do this a lot)</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Select the node</div>
                <div className="tl-desc">
                  Open <code>scenes/game.tscn</code> (double-click it in the FileSystem dock) and click the{' '}
                  <code>Board</code> node in the Scene dock so it's highlighted.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Click the Attach Script button</div>
                <div className="tl-desc">
                  At the top of the Scene dock there's a row of small icons. Click the one that looks like a{' '}
                  <strong>scroll with a</strong> <code>+</code> (tooltip: <strong>Attach a new or existing
                  script</strong>). It's the right-most of that group. You can also right-click the node →{' '}
                  <strong>Attach Script</strong>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Fill in the dialog</div>
                <div className="tl-desc">
                  Godot pre-fills most of it. Check these: <strong>Language</strong> = <code>GDScript</code>;{' '}
                  <strong>Inherits</strong> = <code>Node2D</code> (it should already match the node's type —
                  don't change it); <strong>Template</strong> = <code>Node: Default</code> is fine;{' '}
                  <strong>Path</strong> = change it to <code>res://scripts/Board.gd</code> so the file lands
                  in our <code>scripts</code> folder instead of next to the scene. Click{' '}
                  <strong>Create</strong>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Confirm it worked</div>
                <div className="tl-desc">
                  A small <strong>script icon</strong> now appears next to <code>Board</code> in the Scene
                  dock, and Godot switches to the <strong>Script</strong> editor with a new{' '}
                  <code>Board.gd</code> open. Clicking that icon any time re-opens the script. Toggle between
                  the code and the canvas with the <strong>2D</strong> / <strong>Script</strong> buttons at
                  the very top-center of the window.
                </div>
              </div>
            </div>
          </div>
          <Note>
            Whenever a later section says "attach <code>scripts/Something.gd</code> to node X", repeat exactly
            these four steps — select X, click Attach Script, set the Path into <code>res://scripts/</code>,
            Create. Then select everything in the generated file and paste the code from the guide over it.
          </Note>

          <h3>How to read the code blocks in this guide</h3>
          <p>
            From here on you'll be pasting a lot of GDScript. Every block tells you which file it belongs to
            in its first comment line, and the wording tells you what to <em>do</em> with it:
          </p>
          <table>
            <tbody>
              <tr><th>First line of the block</th><th>What it means</th></tr>
              <tr>
                <td><code># scripts/Board.gd</code></td>
                <td>
                  This is <strong>the file itself</strong>, from the top (you'll see{' '}
                  <code>extends …</code> right under it). Select everything in that file and{' '}
                  <strong>replace</strong> it with the block.
                </td>
              </tr>
              <tr>
                <td><code># in scripts/Game.gd</code></td>
                <td>
                  An <strong>addition</strong> to a file that already exists. Paste it at the{' '}
                  <strong>bottom</strong> of that file. The one exception: if a function of the same name is
                  already in there, you're <strong>replacing that function</strong> with the new version —
                  the guide is upgrading it, so delete the old one.
                </td>
              </tr>
              <tr>
                <td>No file comment</td>
                <td>
                  It continues the file from the block just above it — keep appending to the bottom of the
                  same script.
                </td>
              </tr>
            </tbody>
          </table>
          <Note kind="warn">
            <strong>The <code>_ready()</code> exception: merge, don't replace.</strong> A few later
            sections show <code>func _ready()</code> with a{' '}
            <code># ...existing setup...</code> line at the top. That comment means{' '}
            <em>keep everything already in your <code>_ready()</code></em> and just <strong>add</strong>{' '}
            the new lines shown below it — this is the one place where a same-named function is{' '}
            <strong>extended</strong> rather than replaced. If you overwrite the whole function instead,
            you'll wipe out earlier setup (dealing the tray, connecting signals) and the game will boot
            broken. When in doubt, the Full Source listing near the end shows the final, fully-merged{' '}
            <code>_ready()</code> to compare against.
          </Note>
          <Note kind="warn">
            <strong>Two things that will bite you when pasting GDScript.</strong> (1) Indentation is{' '}
            <strong>meaningful</strong> and uses <strong>tabs</strong> — the <code>func</code> keyword sits
            hard against the left margin, and only the lines <em>inside</em> a function are indented. (2) The
            copy button on each block preserves the tabs correctly, so prefer it over selecting the text with
            your mouse.
          </Note>

          <h3>Constants and the grid array</h3>
          <p>
            Open <code>scripts/Board.gd</code> (click the little script icon next to <code>Board</code> in
            the Scene dock). Godot generated a few placeholder lines — select all of them (
            <code>Ctrl+A</code>) and <strong>replace the entire file</strong> with this:
          </p>
          <CodePre>{`# scripts/Board.gd
extends Node2D
class_name Board

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []

func _ready() -> void:
	_init_grid()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)`}</CodePre>
          <p>
            <code>grid</code> is an array of rows; each row is an array of cells. We read a cell as{' '}
            <code>grid[y][x]</code> — remember <strong>y is the row, x is the column</strong>. A{' '}
            <code>null</code> means empty; a <code>Color</code> means filled with that color.
          </p>
          <Note>
            <strong>Don't skip <code>class_name Board</code>.</strong> Later, other scripts write{' '}
            <code>var board: Board = $Board</code> to get typed access to things like{' '}
            <code>board.CELL</code> and <code>board.can_place(...)</code>. Without a{' '}
            <code>class_name</code>, Godot treats <code>$Board</code> as a generic node and a couple of
            those later lines fail to compile with "Cannot infer the type of..." errors.
          </Note>
          <h3>The helper functions</h3>
          <p>
            <strong>Where this goes:</strong> the same file. Click at the very end of{' '}
            <code>Board.gd</code> (after the last line of <code>_init_grid</code>), press{' '}
            <code>Enter</code> to get a blank line, and paste this <em>below</em> what's already there.
            You are <strong>adding</strong> to the file now, not replacing it. These tiny functions get used
            everywhere; getting them right makes the rest trivial:
          </p>
          <Note kind="warn">
            <strong>Every <code>func</code> must start at the far left.</strong> GDScript decides what
            belongs to what purely by indentation. If your pasted functions end up indented one tab, Godot
            thinks they live <em>inside</em> <code>_init_grid()</code> and you'll get errors like{' '}
            <code>Nonexistent function 'is_empty'</code>. The <code>func</code> keyword should be hard against
            the left margin, and only the lines <em>inside</em> a function are indented (with tabs).
          </Note>
          <CodePre>{`# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color`}</CodePre>
          <h3>Converting between pixels and cells</h3>
          <p>
            We constantly need to go from a grid cell to a pixel position (to draw) and from a pixel
            position to a grid cell (to figure out where a finger dropped a piece). Two more helpers handle
            it — <strong>again, append these to the bottom of the same <code>Board.gd</code></strong>, below
            the functions you just added:
          </p>
          <CodePre>{`# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))`}</CodePre>
          <p>
            <code>floor</code> rounds down, so any pixel inside a cell maps to that cell's integer
            coordinate. Because the Board node will be positioned with a margin on screen, we'll always
            convert the finger's screen position into the Board's <em>local</em> space first (more on that
            during drag-and-drop).
          </p>
          <h3>Checkpoint: prove the model works before drawing anything</h3>
          <p>
            Nothing is visible yet — <code>Board.gd</code> is pure data. But we can prove the logic is right
            <em>now</em>, which means any bug you hit later is about visuals, not the model. We'll print a few
            values when the game starts, read them, then delete the test.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Temporarily add three print lines</div>
                <div className="tl-desc">
                  In <code>Board.gd</code>, find the <code>_ready()</code> function you wrote earlier and add
                  the three <code>print</code> lines shown below. They must be indented <strong>one tab</strong>,
                  lining up with <code>_init_grid()</code> — that's what makes them part of{' '}
                  <code>_ready()</code>. Save with <code>Ctrl+S</code>.
                </div>
              </div>
            </div>
          </div>
          <CodePre>{`func _ready() -> void:
	_init_grid()
	# --- temporary test, delete when it passes ---
	print("is_empty(0,0)      -> ", is_empty(0, 0))
	print("px_to_cell(130,10) -> ", px_to_cell(Vector2(130, 10)))
	print("in_bounds(8,0)     -> ", in_bounds(8, 0))`}</CodePre>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Run the game</div>
                <div className="tl-desc">
                  Press <code>F5</code> (the ▶ <strong>Run Project</strong> button, top-right). A blank grey
                  window opens — expected, we haven't drawn anything. <strong>Leave it open or close it</strong>,
                  either is fine; the printing already happened the instant the game started.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Read the Output panel</div>
                <div className="tl-desc">
                  Back in the Godot editor, look at the row of tabs along the very bottom of the window:{' '}
                  <strong>Output</strong>, <strong>Debugger</strong>, <strong>Audio</strong>, … Click{' '}
                  <strong>Output</strong>. (It usually pops open by itself when you run.) This is where{' '}
                  <code>print()</code> writes. You should see exactly three lines:
                </div>
              </div>
            </div>
          </div>
          <CodePre>{`is_empty(0,0)      -> true
px_to_cell(130,10) -> (1, 0)
in_bounds(8,0)     -> false`}</CodePre>
          <p>Why those are the right answers:</p>
          <ul>
            <li>
              <code>is_empty(0, 0)</code> → <code>true</code>: every cell starts as <code>null</code>, so the
              top-left cell is empty.
            </li>
            <li>
              <code>px_to_cell(Vector2(130, 10))</code> → <code>(1, 0)</code>: cells are 120 px wide, so
              x = 130 has passed the end of column 0 and landed in column 1; y = 10 is still inside row 0.
            </li>
            <li>
              <code>in_bounds(8, 0)</code> → <code>false</code>: an 8-wide board has columns 0–7, so 8 is off
              the edge. (This is the check that stops pieces from being placed half off-screen.)
            </li>
          </ul>
          <Note kind="warn">
            <strong>Didn't get that?</strong> If the Output says{' '}
            <code>Invalid call. Nonexistent function 'is_empty'</code>, your helper functions were pasted{' '}
            <em>inside</em> another function — check that every <code>func</code> starts at the far-left
            margin. If you see <code>Invalid get index '0'</code>, <code>_init_grid()</code> didn't run, so
            check it's still being called on the first line of <code>_ready()</code>.
          </Note>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Delete the test lines</div>
                <div className="tl-desc">
                  Once all three print correctly, remove the three <code>print</code> lines (and the comment)
                  so <code>_ready()</code> is back to just calling <code>_init_grid()</code>. The data layer is
                  confirmed — from here on, if something looks wrong, it's the drawing, not the grid.
                </div>
              </div>
            </div>
          </div>
                  <FullSourceSoFar sectionId="s4" />
        </section>

        <hr />

        {/* SECTION 5 — DRAWING THE BOARD */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Drawing the Board</h2>
          <p>
            Now let's make the board visible. We'll draw it ourselves in <code>_draw()</code> — a grid of
            rounded cells, empty ones dim and filled ones colored. This is the "drawing without art"
            technique: pure code, no image files.
          </p>
          <h3>Position the board on screen</h3>
          <p>
            With a 1080-wide design and a 960-wide board, centering leaves a 60px margin on each side.
            Set the Board node's position so the grid sits nicely below the score. In{' '}
            <code>_ready()</code>:
          </p>
          <CodePre>{`func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)   # 60px left margin, 360px down from top
	queue_redraw()`}</CodePre>
          <h3>The draw function</h3>
          <CodePre>{`const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	var rect := Rect2(pos, size)
	# Filled rounded square with a lighter top edge for a "bevel" look.
	draw_rect(rect, color)
	if color != EMPTY_COLOR:
		draw_rect(rect, color.lightened(0.25), false, 4.0)`}</CodePre>
          <p>
            Every cell is drawn as a square inset by half the gap, so the cells look separated. Empty
            cells use a faint white; filled cells use their stored color plus a lighter outline for a
            subtle 3D bevel. Whenever the grid changes, we call <code>queue_redraw()</code> to repaint.
          </p>
          <h3>A rounded-corner upgrade</h3>
          <p>
            <code>draw_rect</code> gives sharp corners. For the signature Block Blast rounded look, draw a{' '}
            rounded rectangle using a stylebox or by composing shapes. The simplest crisp option is{' '}
            <code>draw_style_box</code> with a <code>StyleBoxFlat</code> that has a corner radius:
          </p>
          <CodePre>{`func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))`}</CodePre>
          <h3>Position the board, then test it</h3>
          <p>
            Two different things are happening in the <code>_ready()</code> below, and it matters which you
            keep:
          </p>
          <ul>
            <li>
              <code>position = Vector2(60, 360)</code> is <strong>permanent</strong> — it places the Board
              node on screen. The board is 960 px wide (8 cells × 120) inside a 1080 px-wide viewport, so a{' '}
              <strong>60 px margin</strong> on the left centres it. The <strong>360</strong> pushes it down
              from the top, leaving room for the score above and the piece tray below.
            </li>
            <li>
              The three <code>set_cell</code> lines are <strong>temporary</strong> — just coloured cells so
              we can see that drawing works.
            </li>
          </ul>
          <p>Replace your <code>_ready()</code> in <code>Board.gd</code> with this:</p>
          <CodePre>{`func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	# --- temporary: prove _draw() works, delete after testing ---
	set_cell(0, 0, Color.html("#4FC3F7"))
	set_cell(1, 0, Color.html("#FF7043"))
	set_cell(7, 7, Color.html("#9CCC65"))
	queue_redraw()`}</CodePre>
          <p>
            Press <code>F5</code>. You should now see an <strong>8×8 grid of faint cells</strong> with a blue
            square top-left, an orange one next to it, and a green one in the bottom-right corner. That's{' '}
            <code>_draw()</code> working.
          </p>
          <Note kind="warn">
            <strong>Now delete only the test lines.</strong> Remove the three <code>set_cell</code> calls and
            the comment — but <strong>keep <code>position</code>, <code>_init_grid()</code>, and{' '}
            <code>queue_redraw()</code></strong>. If you delete the <code>position</code> line too, the board
            jumps to the top-left corner of the screen and every later drag calculation will look "off by a
            margin." Seeing nothing at all instead? Check that <code>Board</code> still has{' '}
            <code>Board.gd</code> attached (a script icon next to it in the Scene dock).
          </Note>
          <Note>
            <strong>Redraw only when needed.</strong> <code>_draw()</code> doesn't run every frame — it runs
            when you call <code>queue_redraw()</code>. That's efficient: a static board costs nothing until
            something actually changes.
          </Note>
                  <FullSourceSoFar sectionId="s5" />
        </section>

        <hr />

        {/* SECTION 6 — DEFINING BLOCK PIECES */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Defining Block Pieces</h2>
          <p>
            A "piece" is a small shape made of cells — a single square, an L, a 2×2 block, a line of
            three, and so on. Shapes built from squares joined edge-to-edge are called{' '}
            <strong>polyominoes</strong>. We describe each one as a list of <code>Vector2i</code> offsets
            from the shape's top-left corner.
          </p>
          <h3>How a shape becomes data</h3>
          <div className="arch-diagram">
            <span className="dim"># An "L" tromino and its offsets (x = col, y = row)</span>{'\n'}
            █ .      <span className="dim">(0,0)</span>{'\n'}
            █ █      <span className="dim">(0,1) (1,1)</span>{'\n'}
            {'\n'}
            cells = [ Vector2i(0,0), Vector2i(0,1), Vector2i(1,1) ]
          </div>
          <p>
            We <strong>normalize</strong> every shape so its smallest x and y are 0 (the top-left cell is
            always <code>(0,0)</code>). That makes placement math uniform: drop the shape at an "anchor"
            cell and add each offset.
          </p>
          <h3>The piece catalog</h3>
          <Note>
            <strong>This script is not attached to anything.</strong> Unlike <code>Board.gd</code> and{' '}
            <code>Piece.gd</code>, this one hangs off no node and is not an autoload — it's just a bag of
            shape data and helper functions. Create it the same way you made the autoload files: in the{' '}
            <strong>FileSystem</strong> dock, right-click the <code>scripts</code> folder →{' '}
            <strong>Create New → Script…</strong> → set <strong>Inherits</strong> to <code>RefCounted</code>{' '}
            and <strong>Path</strong> to <code>res://scripts/Pieces.gd</code> → <strong>Create</strong>. Then
            paste the code below over it.
          </Note>
          <p>
            The <code>class_name Pieces</code> line on the second line is the magic: it registers "Pieces" as
            a global type, so any other script can call <code>Pieces.random_piece()</code> without importing,
            preloading, or attaching anything.
          </p>
          <CodePre>{`# scripts/Pieces.gd
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[randi() % SHAPES.size()]
	var color: Color = PALETTE[randi() % PALETTE.size()]
	return { "cells": shape, "color": color }`}</CodePre>
          <Note kind="warn">
            <strong>Use <code>Color("#...")</code>, not <code>Color.html("#...")</code>.</strong> Godot
            4.7 doesn't treat <code>Color.html(...)</code> as a constant expression, so a{' '}
            <code>const</code> array built from it fails to compile with "Assigned value for constant
            &lsquo;PALETTE&rsquo; isn't a constant expression." The string constructor,{' '}
            <code>Color("#4FC3F7")</code>, works identically and compiles fine as a constant.
          </Note>
          <p>
            <code>randi() % N</code> picks a random whole number from <code>0</code> to{' '}
            <code>N - 1</code> — a random index into the list. Each call to{' '}
            <code>random_piece()</code> returns a dictionary with the chosen <code>cells</code> and{' '}
            <code>color</code>.
          </p>
          <Note>
            <strong>Tuning difficulty is just editing this list.</strong> Add more big shapes to make the
            game harder, or more small ones to make it easier. You can also weight the randomness later so
            5-cell pieces appear less often. Start simple; tune by feel.
          </Note>
                  <FullSourceSoFar sectionId="s6" />
        </section>

        <hr />

        {/* SECTION 7 — THE PIECE TRAY */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>The Piece Tray</h2>
          <p>
            The tray holds three pieces at the bottom of the screen. Each piece on screen is its own small
            scene so it can be drawn, picked up, and moved independently. Let's create that scene, then
            have the Game deal three of them.
          </p>
          <h3>Create the Piece scene</h3>
          <p>
            This is a <em>second, separate</em> scene file — not part of <code>game.tscn</code>. Think of it
            as a reusable stamp: we define one piece here, and the game will create three copies of it at
            runtime.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Start a fresh scene</div>
                <div className="tl-desc">
                  <strong>Scene → New Scene</strong>. (Your <code>game.tscn</code> isn't lost — it stays open
                  in its own tab along the top of the editor; you can click back to it any time.)
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Root node + name</div>
                <div className="tl-desc">
                  In the Scene dock click <strong>2D Scene</strong> to get a <code>Node2D</code> root, then
                  press <code>F2</code> and rename it to <code>Piece</code>. It has no children — one node is
                  the whole scene.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Save as scenes/piece.tscn</div>
                <div className="tl-desc">
                  <code>Ctrl+S</code> → open the <code>scenes</code> folder → file name{' '}
                  <code>piece.tscn</code> → <strong>Save</strong>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Attach the script</div>
                <div className="tl-desc">
                  With <code>Piece</code> selected, use the same four steps from Section 4: click{' '}
                  <strong>Attach Script</strong>, set <strong>Path</strong> to{' '}
                  <code>res://scripts/Piece.gd</code>, click <strong>Create</strong>. Then select everything
                  in the generated file and paste the code below over it, and save.
                </div>
              </div>
            </div>
          </div>
          <Note>
            <strong>Why <code>class_name Piece</code>?</strong> That line in the script registers "Piece" as a
            type name across the whole project, so other scripts can say <code>var p: Piece</code> and get
            autocomplete. It's not the same thing as the node's name — the node is called <code>Piece</code>{' '}
            and the class is called <code>Piece</code>, which is just a tidy convention.
          </Note>
          <p>
            For now the script only holds data and reports its size; the drawing comes in the next section:
          </p>
          <CodePre>{`# scripts/Piece.gd
extends Node2D
class_name Piece

var cells: Array = []           # Array of Vector2i offsets
var color: Color = Color.WHITE
var cell_size: float = 60.0     # 60 in the tray, ~120 on the board
var home := Vector2.ZERO        # where to snap back if not placed

# Configure this piece from catalog data.
func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

# How many columns x rows the shape spans (for centering + hit-testing).
func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

# The on-screen pixel size of this piece at its current cell_size.
func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size`}</CodePre>
          <h3>Deal three pieces</h3>
          <p>
            This is our <strong>third and last script</strong>, and the one that runs the game. It doesn't
            exist yet, so create it now:
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot done">1</div>
              <div className="tl-content">
                <div className="tl-title">Attach Game.gd to the Game root</div>
                <div className="tl-desc">
                  Open <code>scenes/game.tscn</code>, select the <code>Game</code> node (the very top one),
                  and use the <strong>Attach Script</strong> steps from Section 4: Path{' '}
                  <code>res://scripts/Game.gd</code> → <strong>Create</strong>. Then replace the generated
                  contents with the code below. <code>Board</code> and <code>Tray</code> already have their
                  place in the tree, so <code>Game</code> can reach them with <code>$Board</code> and{' '}
                  <code>$Tray</code>.
                </div>
              </div>
            </div>
          </div>
          <p>
            We keep a <code>tray</code> array and a function to fill it. Used pieces become <code>null</code>{' '}
            in the array so we know when all three are gone:
          </p>
          <CodePre>{`# scripts/Game.gd
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")

func _ready() -> void:
	deal_tray()
	_update_score_label()

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null`}</CodePre>
          <h3>Position pieces in their slots</h3>
          <p>
            We split the 1080-wide screen into three equal slots and center each piece in its slot:
          </p>
          <CodePre>{`func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to`}</CodePre>
          <h3>Show the score</h3>
          <p>
            <code>_ready()</code> already calls <code>_update_score_label()</code> above, so we need it to
            exist now rather than later. It only touches two things that already exist —{' '}
            <code>ScoreLabel</code> from Section 3 and <code>GameState.score</code> from the autoload — so
            there's no reason to wait. Append this to the bottom of <code>Game.gd</code>:
          </p>
          <CodePre>{`func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score`}</CodePre>
          <p>
            Score doesn't change yet — that arrives with placement in Section 12 — but the label will
            correctly show <code>0</code>, and nothing crashes when <code>_ready()</code> calls it.
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  G["Game.deal_tray()"] --> P1["Piece slot 0"]
  G --> P2["Piece slot 1"]
  G --> P3["Piece slot 2"]
  P1 -.added under.-> TRAY["$Tray node"]
  P2 -.added under.-> TRAY
  P3 -.added under.-> TRAY`} />
          <Note kind="warn">
            <strong>Keep <code>$Tray</code> at position (0,0).</strong> We place tray pieces using full
            screen coordinates, which only works if the Tray node itself isn't offset. Leave its position
            at the origin so a piece's <code>position</code> is also its screen position.
          </Note>
                  <FullSourceSoFar sectionId="s7" />
        </section>

        <hr />

        {/* SECTION 8 — RENDERING A PIECE */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Rendering a Piece</h2>
          <p>
            Now let's make pieces visible by drawing their cells — the same rounded-square style as the
            board, so a piece looks identical whether it's in the tray or hovering over the grid. Add this{' '}
            <code>_draw()</code> to <code>Piece.gd</code>:
          </p>
          <CodePre>{`# in scripts/Piece.gd
func _draw() -> void:
	for c in cells:
		var pos := Vector2(c.x, c.y) * cell_size
		_draw_block(pos, color, cell_size)

func _draw_block(pos: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	# A lighter top + darker bottom gives a soft 3D candy look.
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(pos + Vector2(inset, inset),
		Vector2(size, size) - Vector2(inset, inset) * 2.0))`}</CodePre>
          <p>
            Because <code>cell_size</code> is a variable, the exact same drawing code renders a small
            tray piece (<code>cell_size = 60</code>) or a full-size piece over the board
            (<code>cell_size = 120</code>). Everything — corner radius, inset, border — scales with it.
          </p>
          <h3>Why pieces grow when you grab them</h3>
          <p>
            In the tray, pieces are half-size so all three fit. When you pick one up to place it, we set
            its <code>cell_size</code> to match the board's cells, so it lines up perfectly with the grid.
            One variable, two presentations:
          </p>
          <table>
            <tbody>
              <tr><th>State</th><th><code>cell_size</code></th><th>Looks like</th></tr>
              <tr><td>In the tray</td><td><code>60</code></td><td>A compact preview, three across the bottom.</td></tr>
              <tr><td>Being dragged</td><td><code>120</code> (board size)</td><td>Full-size, aligned to the grid it's about to drop into.</td></tr>
            </tbody>
          </table>
          <h3>Run it</h3>
          <p>
            Press <code>F5</code>. You should see the board up top and three colorful pieces along the
            bottom. They don't do anything yet — next we make them draggable.
          </p>
          <Note>
            <strong>Draw order = child order.</strong> Nodes draw in tree order, so children listed later
            appear on top. When we drag a piece, we'll move it to be the last child of <code>Game</code> so
            it floats above the board and tray.
          </Note>
                  <FullSourceSoFar sectionId="s8" />
        </section>

        <hr />

        {/* SECTION 9 — DRAG & DROP: PICK UP */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Drag &amp; Drop: Pick Up</h2>
          <p>
            Drag-and-drop is the entire interaction, so we'll build it carefully in three parts: picking up
            (this section), following the finger with a placement preview (next), and validating (after).
            We handle raw touch in <code>_input()</code>.
          </p>
          <h3>The input skeleton</h3>
          <CodePre>{`# in scripts/Game.gd
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()`}</CodePre>
          <p>
            This skeleton calls two functions that don't exist yet — <code>_try_drop()</code> (built for
            real in Section 12) and <code>_update_preview()</code> (Section 10). Paste these placeholders
            now so the game runs while you build the rest:
          </p>
          <CodePre>{`# in scripts/Game.gd — placeholder, upgraded for real in Section 12
func _try_drop(_touch: Vector2) -> void:
	pass`}</CodePre>
          <CodePre>{`# in scripts/Game.gd — placeholder, upgraded for real in Section 10
func _update_preview() -> void:
	pass`}</CodePre>
          <h3>Picking up the right piece</h3>
          <p>
            On touch-down we check each tray piece's rectangle (grown a little so fat fingers still hit
            it). The first one under the finger becomes the dragged piece, and we scale it up to board
            size:
          </p>
          <CodePre>{`func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return`}</CodePre>
          <p>Let's unpack the two clever bits:</p>
          <table>
            <tbody>
              <tr><th>Line</th><th>Why</th></tr>
              <tr><td><code>.grow(24)</code></td><td>Adds a 24px margin to the hit area. Touch targets should be forgiving — players rarely tap dead-center.</td></tr>
              <tr><td><code>cell_size = $Board.CELL</code></td><td>Reads the board's cell size constant so the dragged piece matches the grid exactly.</td></tr>
              <tr><td><code>grab_offset = (halfWidth, height + 60)</code></td><td>Positions the piece centered above the finger by 60px, so the finger never covers it. The standard mobile pattern.</td></tr>
              <tr><td><code>move_child(..., last)</code></td><td>Re-parents the piece to the end of the draw order so it floats over the board and other pieces.</td></tr>
            </tbody>
          </table>
          <Note kind="warn">
            <strong>Reparenting note.</strong> The piece still lives under <code>$Tray</code>, and we only
            reorder within the Game's children via <code>move_child</code>. If your draw order still looks
            wrong, temporarily <code>reparent()</code> the piece onto <code>Game</code> on pick-up and back
            onto <code>$Tray</code> on drop. For most setups <code>move_child</code> on the Tray's children
            is enough.
          </Note>
                  <FullSourceSoFar sectionId="s9" />
        </section>

        <hr />

        {/* SECTION 10 — DRAG & DROP: SNAP & GHOST */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Drag &amp; Drop: Snap &amp; Ghost</h2>
          <p>
            While dragging, players need to see <em>where</em> the piece will land and <em>whether</em> it
            fits. We show a "ghost" — a highlighted outline on the board's target cells, green if the drop
            is legal and red if not. This single bit of feedback makes the game feel professional.
          </p>
          <h3>Figure out the target cell</h3>
          <p>
            The piece's top-left cell center, converted into the board's local space, tells us the anchor
            grid cell:
          </p>
          <CodePre>{`func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)`}</CodePre>
          <Note kind="warn">
            <strong>Type <code>board</code> explicitly.</strong> <code>var board: Board = $Board</code>,
            not <code>var board := $Board</code>. Godot doesn't infer a node's script type from a bare{' '}
            <code>$Board</code>, so without the explicit <code>: Board</code>, the next line —{' '}
            <code>board.CELL</code> — can't be type-checked and the script fails to compile with{' '}
            "Cannot infer the type of &lsquo;half&rsquo;...".
          </Note>
          <p>
            The preview below needs to ask the board <code>can_place()</code>, which isn't built for real
            until Section 11. Paste this placeholder first — it treats every spot as legal for now, which
            just means the ghost always shows green until you add the real check:
          </p>
          <CodePre>{`# in scripts/Board.gd — placeholder, upgraded for real in Section 11
func can_place(_anchor: Vector2i, _cells: Array) -> bool:
	return true`}</CodePre>
          <h3>Update the preview every drag step</h3>
          <p>
            This replaces the <code>pass</code>-only stub from Section 9 — delete that version and paste
            this one in its place. Note the file: it's <code>Game.gd</code>, not{' '}
            <code>Board.gd</code> — easy to get wrong since the <code>can_place</code> stub right above
            was a Board.gd aside. <code>_update_preview()</code> lives on <code>Game</code> because it
            reads <code>dragging</code>, which only <code>Game.gd</code> has.
          </p>
          <CodePre>{`# in scripts/Game.gd
func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)`}</CodePre>
          <h3>The ghost, drawn by the Board</h3>
          <p>The Board stores the ghost cells and validity, and draws them on top of the grid:</p>
          <CodePre>{`# in scripts/Board.gd
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()`}</CodePre>
          <p>Add the ghost to the end of the Board's <code>_draw()</code> so it sits over the cells:</p>
          <CodePre>{`# at the bottom of Board._draw()
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)`}</CodePre>
          <MermaidDiagram theme="default" chart={`graph LR
  DRAG["Finger drags piece"] --> ANCHOR["_current_anchor()<br/>screen px -> grid cell"]
  ANCHOR --> CHECK["board.can_place?"]
  CHECK -->|true| GREEN["green ghost"]
  CHECK -->|false| RED["red ghost"]`} />
          <Note>
            <strong>Why a center-of-first-cell calculation?</strong> Using the piece's top-left corner
            directly makes placement feel "off" — the piece snaps a cell late. Sampling the <em>center</em>{' '}
            of the first cell makes the snap feel natural and forgiving, the way good touch games behave.
          </Note>
                  <FullSourceSoFar sectionId="s10" />
        </section>

        <hr />

        {/* SECTION 11 — PLACEMENT VALIDATION */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Placement Validation</h2>
          <p>
            "Can this piece go here?" is the rule the whole game hinges on. A placement is legal only if
            every one of the piece's cells lands on an empty, in-bounds board cell. We already wrote{' '}
            <code>in_bounds</code> and <code>is_empty</code> in the data model — validation is just looping
            over the piece's cells and checking each.
          </p>
          <p>
            This replaces the <code>return true</code> stub from Section 10 — delete that version and
            paste this one in its place.
          </p>
          <CodePre>{`# in scripts/Board.gd

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true`}</CodePre>
          <Note kind="warn">
            <strong>Don't split that into <code>var x := anchor.x + c.x</code> first.</strong> Godot
            can't infer a type for <code>c.x</code> (the loop's <code>cells: Array</code> parameter isn't
            element-typed), and <code>:=</code> requires one — you'd get "Cannot infer the type of &lsquo;x&rsquo;...".
            Passing <code>anchor.x + c.x</code> straight into <code>is_empty(...)</code> sidesteps the
            problem entirely, since a function argument doesn't need its type inferred.
          </Note>
          <p>
            One function, and it covers both failure modes: <code>is_empty</code> returns{' '}
            <code>false</code> if the cell is off the board <em>or</em> already filled. The moment any cell
            fails, we bail out with <code>false</code>; if the loop finishes, every cell is clear and the
            placement is legal.
          </p>
          <h3>Can it go ANYWHERE? (needed for game over)</h3>
          <p>
            To know whether a piece is "dead" (can't be placed at all), we try every anchor on the board.
            If any works, the piece still has a home:
          </p>
          <CodePre>{`# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false`}</CodePre>
          <p>
            This is a brute-force scan of all 64 cells — trivially fast for an 8×8 board, and exactly what
            we need to detect game over in a later section.
          </p>
          <div className="card">
            <h4>Edge cases this handles for free</h4>
            <ul style={{ marginBottom: 0 }}>
              <li><strong>Hanging off the edge:</strong> a cell with <code>x = 8</code> fails <code>in_bounds</code>.</li>
              <li><strong>Overlapping a filled cell:</strong> <code>is_empty</code> returns false.</li>
              <li><strong>Negative coordinates:</strong> if a finger drags above/left of the board, anchors can go negative — <code>in_bounds</code> rejects them.</li>
            </ul>
          </div>
          <Note kind="warn">
            <strong>Don't forget bounds in BOTH directions.</strong> A classic bug is checking only that
            cells aren't occupied, forgetting the off-board case — pieces then "place" half off the grid.
            Because <code>is_empty</code> calls <code>in_bounds</code> first, we're safe. If you ever
            rewrite this, keep that ordering.
          </Note>
                  <FullSourceSoFar sectionId="s11" />
        </section>

        <hr />

        {/* SECTION 12 — COMMITTING A PLACEMENT */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Committing a Placement</h2>
          <p>
            When the player lifts their finger over a legal spot, we "commit": write the piece into the
            grid, remove it from the tray, and trigger the after-effects (clearing, scoring, refill). If
            the spot is illegal, the piece snaps back to its tray slot.
          </p>
          <h3>Temporary stubs, so this section runs on its own</h3>
          <p>
            The drop handler below calls four functions that don't get their real implementations until
            Sections 13-15 — <code>Board.clear_full_lines()</code>, <code>GameState.add()</code>,{' '}
            <code>_apply_clear_score()</code>, and <code>_after_placement()</code>. Paste these lightweight
            placeholders first so the game keeps running while you build the rest. Each later section tells
            you exactly when to replace one.
          </p>
          <CodePre>{`# in scripts/Board.gd — placeholder, upgraded for real in Section 13
func clear_full_lines() -> int:
	return 0`}</CodePre>
          <CodePre>{`# in scripts/GameState.gd — placeholder, upgraded for real in Section 14
func add(points: int) -> void:
	score += points`}</CodePre>
          <CodePre>{`# in scripts/Game.gd — placeholders, upgraded for real in Sections 14-15
func _apply_clear_score(lines: int) -> void:
	pass

func _after_placement() -> void:
	pass`}</CodePre>
          <h3>Write the piece into the grid</h3>
          <CodePre>{`# in scripts/Board.gd
func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()`}</CodePre>
          <h3>Handle the drop in Game.gd</h3>
          <p>
            This replaces the <code>pass</code>-only stub from Section 9 — delete that version and paste
            this one in its place.
          </p>
          <CodePre>{`# in scripts/Game.gd
func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null`}</CodePre>
          <h3>Consume or return the piece</h3>
          <CodePre>{`func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()`}</CodePre>
          <p>
            The <code>_update_score_label()</code> call above reuses the function from Section 7 — no new
            code needed here, it already refreshes <code>ScoreLabel</code> from{' '}
            <code>GameState.score</code> every time a placement happens.
          </p>
          <p>
            With this in place the core loop is alive: you can drag a piece onto a legal spot, watch it
            lock into the grid, and watch illegal drops bounce back. Score won't move and clears won't fire
            yet — that's the stubs from above doing nothing on purpose — but nothing crashes. The next three
            sections replace those stubs one at a time with the real behavior.
          </p>
          <Note>
            <strong>Capture values before freeing.</strong> Notice we read <code>dragging.cells.size()</code>{' '}
            into <code>placed_cells</code> <em>before</em> calling <code>_consume_dragging()</code>, which
            frees the node. Reading a property off a freed node is a common crash — grab what you need
            first.
          </Note>
                  <FullSourceSoFar sectionId="s12" />
        </section>

        <hr />

        {/* SECTION 13 — CLEARING LINES */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>Clearing Lines</h2>
          <p>
            After every placement we scan for full rows and full columns, then clear all of them at once.
            Doing it in two passes — first <em>find</em> the full lines, then <em>clear</em> them — avoids
            a subtle bug where clearing a row mid-scan changes the columns you're about to check.
          </p>
          <p>
            This replaces the one-line stub you added in Section 12 — delete that <code>return 0</code>{' '}
            version and paste this one in its place.
          </p>
          <CodePre>{`# in scripts/Board.gd
func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found
	for y in full_rows:
		for x in range(GRID):
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
	return total`}</CodePre>
          <p>
            The function returns how many lines cleared so the Game can score it (more lines at once = a
            bigger reward). A row and a column can both clear from a single placement — and where they
            cross, that shared cell simply clears once.
          </p>
          <MermaidDiagram theme="default" chart={`graph TB
  PLACE["Piece placed"] --> FIND["PASS 1: find full rows + full cols"]
  FIND --> CLEAR["PASS 2: set those cells to empty"]
  CLEAR --> COUNT["return number of cleared lines"]
  COUNT --> SCORE["Game scores it"]`} />
          <div className="card">
            <h4>Why two passes matters (a concrete bug)</h4>
            <p style={{ marginBottom: 0 }}>
              Imagine you clear a full row <em>while still scanning</em>. A column that was full a moment
              ago now has a gap (you just emptied one of its cells), so your code decides it isn't full and
              skips it — the player is robbed of a clear. Finding all full lines first, then clearing,
              guarantees simultaneous clears are honored.
            </p>
          </div>
          <Note>
            <strong>Test with a deliberate setup.</strong> Temporarily fill row 0 except one cell, then
            place a single piece there. You should see the whole row vanish. Confirming clears with a
            hand-made situation is faster than playing until one happens by chance.
          </Note>
                  <FullSourceSoFar sectionId="s13" />
        </section>

        <hr />

        {/* SECTION 14 — SCORING & COMBOS */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Scoring &amp; Combos</h2>
          <p>
            Scoring should reward two things: making progress (placing pieces) and skillful play (clearing
            multiple lines at once). We give a small amount for every placed cell and a much bigger,
            combo-boosted amount for clears.
          </p>
          <h3>The score lives in the GameState autoload</h3>
          <p>
            This replaces the whole file, including the one-line <code>add()</code> stub from Section 12 —
            the <code>best</code>-tracking version below is the real one.
          </p>
          <CodePre>{`# scripts/GameState.gd  (autoload: GameState)
extends Node

var score: int = 0
var best: int = 0

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score`}</CodePre>
          <h3>Reward clears with a combo bonus</h3>
          <p>
            This replaces the <code>pass</code>-only stub from Section 12 — delete that version of{' '}
            <code>_apply_clear_score</code> and paste this one in its place.
          </p>
          <CodePre>{`# in scripts/Game.gd
func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()`}</CodePre>
          <p>Here's how the reward grows — multi-clears are worth chasing:</p>
          <table>
            <tbody>
              <tr><th>Lines cleared at once</th><th>Points</th><th>Per line</th></tr>
              <tr><td>1</td><td>100</td><td>100</td></tr>
              <tr><td>2</td><td>250</td><td>125</td></tr>
              <tr><td>3</td><td>400</td><td>133</td></tr>
              <tr><td>4</td><td>550</td><td>138</td></tr>
            </tbody>
          </table>
          <h3>Optional: a streak multiplier</h3>
          <p>
            Many Block Blast games reward <em>consecutive</em> clears — clear on several placements in a
            row and each is worth more. You can layer that on with a counter that grows on a clear and
            resets on a placement that clears nothing:
          </p>
          <CodePre>{`var streak: int = 0

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		streak = 0          # broke the streak
		return
	streak += 1
	var base: int = lines * 100 + (lines - 1) * 50
	var points: int = base * streak    # ride the streak
	GameState.add(points)
	Sfx.play_clear()`}</CodePre>
          <Note>
            <strong>Tune for feel, not realism.</strong> These numbers are arbitrary — pick values that
            make clearing satisfying and a big multi-clear feel like a triumph. Playtest, then adjust. Show
            the player a little "+250" pop-up (we add juice for this later) and the scoring suddenly feels
            great.
          </Note>
                  <FullSourceSoFar sectionId="s14" />
        </section>

        <hr />

        {/* SECTION 15 — REFILLING THE TRAY */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>Refilling the Tray</h2>
          <p>
            The tray refills only when <strong>all three</strong> pieces are used — that's a core Block
            Blast rule and it's what creates the puzzle: you must plan how to fit all three before getting
            new ones. We check after each placement.
          </p>
          <h3>Two more temporary stubs</h3>
          <p>
            <code>_after_placement()</code> checks for game over, but that detection and the losing screen
            aren't built until the next two sections. Paste these placeholders first so refilling works
            without crashing — Sections 16 and 17 upgrade them.
          </p>
          <CodePre>{`# in scripts/Game.gd — placeholder, upgraded for real in Section 16
func _is_game_over() -> bool:
	return false`}</CodePre>
          <CodePre>{`# in scripts/Game.gd — placeholder, upgraded for real in Section 17
func _show_game_over() -> void:
	pass`}</CodePre>
          <p>
            Now the real <code>_after_placement()</code> — this replaces the <code>pass</code>-only stub
            from Section 12.
          </p>
          <CodePre>{`# in scripts/Game.gd
func _after_placement() -> void:
	# Refill only when every slot is empty.
	if tray[0] == null and tray[1] == null and tray[2] == null:
		deal_tray()
	# Then decide whether the player can keep going (next section).
	if _is_game_over():
		_show_game_over()`}</CodePre>
          <p>
            A cleaner way to express "are all slots empty?" uses a helper, which we'll also reuse for game
            over:
          </p>
          <CodePre>{`func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()`}</CodePre>
          <MermaidDiagram theme="default" chart={`graph TB
  DROP["Piece committed"] --> EMPTY{"All 3 slots empty?"}
  EMPTY -->|yes| DEAL["deal_tray() — 3 new pieces"]
  EMPTY -->|no| KEEP["keep remaining pieces"]
  DEAL --> CHECK["check game over"]
  KEEP --> CHECK`} />
          <Note kind="warn">
            <strong>Order matters: refill BEFORE checking game over.</strong> If you placed your last
            piece, you should get a fresh tray and only lose if <em>those</em> new pieces don't fit.
            Checking game over before refilling would end the game every time you empty the tray — a nasty
            bug. Refill first, then test.
          </Note>
                  <FullSourceSoFar sectionId="s15" />
        </section>

        <hr />

        {/* SECTION 16 — GAME OVER DETECTION */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>Game Over Detection</h2>
          <p>
            The game ends when none of the pieces currently in the tray can be placed anywhere on the
            board. We already built <code>can_place_anywhere</code> on the Board; game over is just asking
            it about each live tray piece.
          </p>
          <p>
            This replaces the <code>return false</code> stub from Section 15 — delete that version and
            paste this one in its place.
          </p>
          <CodePre>{`# in scripts/Game.gd
func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over`}</CodePre>
          <p>
            The logic reads like its English description: if <em>any</em> piece fits <em>anywhere</em>, the
            game is not over. Only when every remaining piece is stuck do we return <code>true</code>.
          </p>
          <h3>What "fits anywhere" actually costs</h3>
          <p>
            For each piece we scan all 64 board cells and, at each, check the piece's handful of cells.
            That's at most a few hundred comparisons per piece — instant on any phone. Don't be tempted to
            over-optimize this; clarity wins and the board is tiny.
          </p>
          <div className="arch-diagram">
            <span className="dim"># Game-over check, conceptually</span>{'\n'}
            for each live tray piece:{'\n'}
            {'    '}for each board cell (x, y):{'\n'}
            {'        '}if piece fits at (x, y):  <span className="highlight">return NOT over</span>{'\n'}
            <span className="highlight">return GAME OVER</span>  <span className="dim"># nothing fit</span>
          </div>
          <Note>
            <strong>Test it deliberately.</strong> Fill most of the board with temporary <code>set_cell</code>{' '}
            calls so only awkward gaps remain, then keep playing until the tray can't fit. Verifying the
            game actually ends (and doesn't end too early) is worth a focused test — it's the moment players
            judge fairness.
          </Note>
                  <FullSourceSoFar sectionId="s16" />
        </section>

        <hr />

        {/* SECTION 17 — GAME OVER SCREEN */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">17</span>The Game Over Screen</h2>
          <p>
            When the game ends we show an overlay with the final score, the best score, and a button to
            play again. We build it as a hidden <code>Control</code> under the HUD and just flip its
            visibility.
          </p>
          <h3>Build the panel</h3>
          <p>
            Open <code>scenes/game.tscn</code>. We're adding this under <code>HUD</code>. The names in
            bold matter — the script finds these nodes by path, so a typo here shows up later as a crash:
          </p>
          <div className="arch-diagram">
            HUD <span className="dim">(CanvasLayer)</span>{'\n'}
            ├─ ScoreLabel <span className="dim">(Label)</span>{'\n'}
            └─ GameOverPanel <span className="dim">(Control, Full Rect anchor, visible = off)</span>{'\n'}
            {'   '}├─ Dim <span className="dim">(ColorRect, Full Rect, black @ 60% alpha)</span>{'\n'}
            {'   '}└─ CenterContainer <span className="dim">(Full Rect)</span>{'\n'}
            {'      '}└─ VBoxContainer{'\n'}
            {'         '}├─ Label <span className="dim">"Game Over"</span>{'\n'}
            {'         '}├─ Final <span className="dim">(Label) "Score: 0"</span>{'\n'}
            {'         '}├─ Best <span className="dim">(Label) "Best: 0"</span>{'\n'}
            {'         '}└─ PlayAgain <span className="dim">(Button) "Play Again"</span>
          </div>
          <Note>
            <strong>What's an anchor preset?</strong> A <code>Control</code> node has no size until you tell
            it one. When a Control is selected, a button appears in the toolbar just above the viewport
            labelled <strong>Anchors Preset</strong> (it looks like a small square grid). Choosing{' '}
            <strong>Full Rect</strong> from that menu means "stretch to fill your parent" — which is what we
            want for an overlay that covers the whole screen. If a Control ever seems invisible or
            zero-sized, an unset anchor is almost always why.
          </Note>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">GameOverPanel (the overlay container)</div>
                <div className="tl-desc">
                  Select <code>HUD</code> → <code>Ctrl+A</code> → search <code>Control</code> →{' '}
                  <strong>Create</strong> → rename to <code>GameOverPanel</code>. With it selected, click the{' '}
                  <strong>Anchors Preset</strong> button in the toolbar and choose <strong>Full Rect</strong>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Dim (the dark backdrop)</div>
                <div className="tl-desc">
                  Select <code>GameOverPanel</code> → <code>Ctrl+A</code> → <code>ColorRect</code> → rename to{' '}
                  <code>Dim</code> → Anchors Preset <strong>Full Rect</strong>. In the{' '}
                  <strong>Inspector</strong> (right panel) click the <strong>Color</strong> swatch and pick
                  black, then drag the <strong>A</strong> (alpha) slider down to about <code>60%</code> — that
                  makes it see-through so the board dims behind the overlay instead of vanishing.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">CenterContainer → VBoxContainer</div>
                <div className="tl-desc">
                  Select <code>GameOverPanel</code> → <code>Ctrl+A</code> → <code>CenterContainer</code> →
                  Anchors Preset <strong>Full Rect</strong>. Then select that CenterContainer →{' '}
                  <code>Ctrl+A</code> → <code>VBoxContainer</code>. These two do the layout for you: the
                  CenterContainer centres its child on screen, and the VBox stacks its children in a vertical
                  column. You never have to position the labels by hand.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">The three labels and the button</div>
                <div className="tl-desc">
                  Select <code>VBoxContainer</code>, then add four children to it (re-selecting the VBox each
                  time): a <code>Label</code> (leave the name <code>Label</code>), a second{' '}
                  <code>Label</code> renamed <code>Final</code>, a third renamed <code>Best</code>, and a{' '}
                  <code>Button</code> renamed <code>PlayAgain</code>. For each one, set its{' '}
                  <strong>Text</strong> property in the Inspector: <code>Game Over</code>,{' '}
                  <code>Score: 0</code>, <code>Best: 0</code>, and <code>Play Again</code> respectively.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">5</div>
              <div className="tl-content">
                <div className="tl-title">Hide it</div>
                <div className="tl-desc">
                  Select <code>GameOverPanel</code> and, in the Inspector, scroll to the{' '}
                  <strong>CanvasItem → Visibility</strong> group and <strong>untick Visible</strong>. (The
                  quick way: click the little <strong>eye icon</strong> next to the node in the Scene dock.)
                  The overlay now starts hidden, and our code flips it on at game over.
                </div>
              </div>
            </div>
          </div>
          <h3>Show it and wire the button</h3>
          <p>
            The <code>_show_game_over()</code> below replaces the <code>pass</code>-only stub from Section
            15 — delete that version and paste this one in its place. This also upgrades{' '}
            <code>_ready()</code> again, adding the button connection to what you already have.
          </p>
          <CodePre>{`# in scripts/Game.gd
@onready var game_over_panel := $HUD/GameOverPanel

func _ready() -> void:
	deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)

func _show_game_over() -> void:
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text`}</CodePre>
          <h3>Restart</h3>
          <CodePre>{`func _on_play_again() -> void:
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	set_process_input(true)
	_update_score_label()`}</CodePre>
          <p>And the board's reset, which empties the grid and repaints:</p>
          <CodePre>{`# in scripts/Board.gd
func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()`}</CodePre>
          <p>
            That's a <strong>complete, playable game</strong>: deal, drag, place, clear, score, refill, and
            game-over with restart. Everything from here is polish — making it <em>feel</em> as good as it
            plays.
          </p>
          <Note>
            <strong>What is <code>.pressed.connect(...)</code>?</strong> That's a <strong>signal</strong>.
            Godot nodes shout when something happens — a Button emits <code>pressed</code> when clicked — and{' '}
            <code>connect()</code> says "when you shout that, run this function of mine." We connect in code
            (inside <code>_ready()</code>) rather than in the editor because it keeps everything about the
            button in one file you can read top to bottom. You <em>can</em> do it via the editor instead:
            select the Button, open the <strong>Node</strong> tab (right panel, next to Inspector), pick{' '}
            <strong>pressed()</strong>, click <strong>Connect…</strong>, and choose the method. Both are
            equivalent — just don't do both, or the function will run twice per click.
          </Note>
          <Note>
            <strong>Disable input during overlays.</strong> <code>set_process_input(false)</code> stops the
            player from dragging "through" the Game Over panel. Re-enable it on restart. The same trick
            works for a pause menu (a later section).
          </Note>
                  <FullSourceSoFar sectionId="s17" />
        </section>

        <hr />

        {/* SECTION 18 — JUICE PART 1 */}
        <section className="section" id="s18" ref={setRef('s18')}>
          <h2><span className="section-num">18</span>Juice, Part 1: Motion</h2>
          <p>
            "Juice" is the catch-all term for the little animations and reactions that make a game feel
            alive. The mechanics already work; juice is what turns "functional" into "fun." We'll add
            motion first: a satisfying thunk on placement, a flash on clears, and a screen shake. Godot's{' '}
            <code>create_tween()</code> makes short animations trivial.
          </p>
          <h3>Tweens in 30 seconds</h3>
          <p>
            A <strong>tween</strong> smoothly changes a property from its current value to a target over
            time. You create one, tell it what to animate, and it runs:
          </p>
          <CodePre>{`var t := create_tween()
t.tween_property(some_node, "scale", Vector2(1.1, 1.1), 0.08)  # grow
t.tween_property(some_node, "scale", Vector2(1, 1), 0.08)      # shrink back`}</CodePre>
          <h3>A placement "thunk"</h3>
          <p>
            When a piece locks in, give the Board a tiny scale-pop so the placement feels physical. Call
            this from <code>_try_drop</code> right after <code>board.place(...)</code>:
          </p>
          <CodePre>{`# in scripts/Board.gd
func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)`}</CodePre>
          <p>
            <code>set_trans(TRANS_BACK)</code> makes it overshoot slightly and settle — a springy,
            pleasing motion. Different transitions (<code>SINE</code>, <code>ELASTIC</code>,{' '}
            <code>BOUNCE</code>) give different feels; try a few.
          </p>
          <h3>Screen shake on a big clear</h3>
          <p>
            A short shake sells impact. Because our world lives under the <code>Game</code> Node2D (and the
            HUD is a separate CanvasLayer that won't move), shaking <code>Game.position</code> shakes the
            board and tray while the score stays rock-steady:
          </p>
          <CodePre>{`# in scripts/Game.gd
func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)`}</CodePre>
          <p>Trigger juice from the clear-scoring step, scaling the shake to how many lines cleared:</p>
          <CodePre>{`func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	GameState.add(lines * 100 + (lines - 1) * 50)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake`}</CodePre>
          <Note kind="warn">
            <strong>Keep shake subtle.</strong> A few pixels for a fraction of a second reads as "impact";
            anything more reads as "broken." Always return to exactly <code>Vector2.ZERO</code> at the end
            so the world doesn't drift after repeated shakes.
          </Note>
                  <FullSourceSoFar sectionId="s18" />
        </section>

        <hr />

        {/* SECTION 19 — JUICE PART 2 */}
        <section className="section" id="s19" ref={setRef('s19')}>
          <h2><span className="section-num">19</span>Juice, Part 2: Effects</h2>
          <p>
            Now the visual payoff for clears: a flash on the cleared cells, a floating "+points" pop-up,
            and an optional particle burst. To drive these, we first upgrade clearing to report{' '}
            <em>which</em> cells were cleared, using a <strong>signal</strong>.
          </p>
          <h3>Emit a signal with the cleared cells</h3>
          <CodePre>{`# in scripts/Board.gd
signal lines_cleared(cleared_cells: Array, line_count: int)

func clear_full_lines() -> int:
	# ...PASS 1 finds full_rows + full_cols (unchanged)...

	var cleared: Array = []          # remember cells for effects
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it
	return total`}</CodePre>
          <h3>Flash the cleared cells</h3>
          <p>
            In <code>Game.gd</code>, connect to the signal and spawn a white square at each cleared cell
            that fades out and frees itself:
          </p>
          <CodePre>{`func _ready() -> void:
	# ...existing setup...
	$Board.lines_cleared.connect(_on_lines_cleared)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)`}</CodePre>
          <h3>A floating "+points" pop-up</h3>
          <CodePre>{`func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)`}</CodePre>
          <h3>Optional: a particle burst</h3>
          <p>
            This one needs a node <em>and</em> a wiring step, because the code below reaches the node through
            an <code>@export</code> variable rather than a <code>$Path</code>.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Add the particle node</div>
                <div className="tl-desc">
                  In <code>game.tscn</code>, select <code>Game</code> → <code>Ctrl+A</code> → search{' '}
                  <code>CPUParticles2D</code> → <strong>Create</strong> → rename it to <code>Burst</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Configure it in the Inspector</div>
                <div className="tl-desc">
                  With <code>Burst</code> selected: <strong>untick Emitting</strong> (otherwise it spits
                  particles constantly from the moment the game starts), <strong>tick One Shot</strong>, set{' '}
                  <strong>Amount</strong> to about <code>24</code>, <strong>Lifetime</strong> to{' '}
                  <code>0.5</code>, and under <strong>Spread</strong> give it something wide like{' '}
                  <code>180</code> so it bursts outward.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">3</div>
              <div className="tl-content">
                <div className="tl-title">Paste the code, then fill the Inspector slot</div>
                <div className="tl-desc">
                  Add the code below to <code>Game.gd</code>. The moment you save, the{' '}
                  <code>@export var burst</code> line makes a new empty <strong>Burst</strong> field appear in
                  the Inspector <em>when the <code>Game</code> node is selected</em>. <strong>Drag the{' '}
                  <code>Burst</code> node from the Scene dock into that field.</strong> This is what{' '}
                  <code>@export</code> is for: it lets you hook a node up by dragging instead of hard-coding a
                  path. Forget this step and <code>burst</code> stays <code>null</code>.
                </div>
              </div>
            </div>
          </div>
          <CodePre>{`# in scripts/Game.gd
@export var burst: CPUParticles2D

func _burst_at(world_pos: Vector2) -> void:
	if burst == null:
		return                    # not wired up yet — skip, don't crash
	burst.global_position = world_pos
	burst.restart()
	burst.emitting = true`}</CodePre>
          <Note>
            <strong>Effects are decoration — guard them.</strong> None of this touches game logic, so if the
            particle node is missing the game must still run — which is exactly what the{' '}
            <code>if burst == null: return</code> line buys us. Keep effect code defensive so a half-finished
            polish pass never breaks play.
          </Note>
                  <FullSourceSoFar sectionId="s19" />
        </section>

        <hr />

        {/* SECTION 20 — SOUND EFFECTS */}
        <section className="section" id="s20" ref={setRef('s20')}>
          <h2><span className="section-num">20</span>Sound Effects</h2>
          <p>
            We've been calling <code>Sfx.play_place()</code> and friends all along, quietly doing nothing
            thanks to the placeholder functions from Section 3 — now let's build that <code>Sfx</code>{' '}
            autoload for real. Making it a small scene with one player per sound keeps things tidy and lets
            sounds overlap.
          </p>
          <h3>Build the Sfx scene</h3>
          <p>
            Back in setup we registered <code>Sfx</code> as a bare <em>script</em>. A script alone can't hold
            audio players, so we're upgrading it to a <em>scene</em> and re-pointing the autoload at that.
            That swap is the fiddly bit, so do these in order:
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">New scene with a plain Node root</div>
                <div className="tl-desc">
                  <strong>Scene → New Scene</strong>. This time <em>don't</em> click "2D Scene" — click{' '}
                  <strong>Other Node</strong>, search <code>Node</code>, pick the plain <code>Node</code>, and{' '}
                  <strong>Create</strong>. (Sound has no position, so it needs no 2D transform.) Rename the
                  root to <code>Sfx</code> with <code>F2</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Add four audio players</div>
                <div className="tl-desc">
                  With <code>Sfx</code> selected, <code>Ctrl+A</code> → search{' '}
                  <code>AudioStreamPlayer</code> → <strong>Create</strong> → rename to <code>Pick</code>.
                  Re-select <code>Sfx</code> and repeat three more times for <code>Place</code>,{' '}
                  <code>Clear</code>, and <code>GameOver</code>. One player per sound means two sounds can
                  overlap without cutting each other off.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Save as scenes/sfx.tscn</div>
                <div className="tl-desc">
                  <code>Ctrl+S</code> → into the <code>scenes</code> folder → name it <code>sfx.tscn</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">Attach the EXISTING Sfx.gd (don't create a new one)</div>
                <div className="tl-desc">
                  <code>scripts/Sfx.gd</code> already exists from setup, so instead of the "Attach Script"
                  button, just <strong>drag <code>Sfx.gd</code> from the FileSystem dock and drop it onto the{' '}
                  <code>Sfx</code> root node</strong> in the Scene dock. (Equivalent: select the node, and in
                  the Inspector scroll to the <strong>Script</strong> property, click the dropdown →{' '}
                  <strong>Load</strong> → pick <code>res://scripts/Sfx.gd</code>.) Then open it and paste the
                  code below over its contents.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">5</div>
              <div className="tl-content">
                <div className="tl-title">Drop a sound into each player</div>
                <div className="tl-desc">
                  Select <code>Pick</code>. In the <strong>Inspector</strong>, the first property is{' '}
                  <strong>Stream</strong> and it says <code>&lt;empty&gt;</code>. Drag a <code>.wav</code>{' '}
                  file from the <code>audio</code> folder in the FileSystem dock and drop it right onto that
                  Stream slot. Repeat for the other three. Haven't got sounds yet? Skip this — the code below
                  is written to silently do nothing when a player is empty, so the game still runs.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">6</div>
              <div className="tl-content">
                <div className="tl-title">Re-point the autoload at the scene</div>
                <div className="tl-desc">
                  <strong>Project → Project Settings → Globals</strong> (or <strong>Autoload</strong> in
                  4.0–4.2). Select the existing <code>Sfx</code> row and click the{' '}
                  <strong>Remove</strong> (trash / minus) button — it currently points at{' '}
                  <code>res://scripts/Sfx.gd</code>. Now add it again, this time choosing{' '}
                  <code>res://scenes/sfx.tscn</code> as the Path, with the Name still <code>Sfx</code>, and
                  click <strong>Add</strong>. This is the step people miss: if the autoload still points at
                  the script, the four audio players don't exist at runtime and every sound call fails.
                </div>
              </div>
            </div>
          </div>
          <CodePre>{`# scripts/Sfx.gd  (autoload: scenes/sfx.tscn, named Sfx)
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

# Guarded so the game still runs before you've added any sound files.
func _play(p: AudioStreamPlayer) -> void:
	if p and p.stream:
		p.play()`}</CodePre>
          <p>
            The <code>_play</code> guard is the beginner-friendly part: if you haven't added a sound to a
            player yet, <code>p.stream</code> is empty and we simply skip it — no crash, no error. Add
            sounds whenever you like and they start playing automatically.
          </p>
          <h3>Where to get sounds</h3>
          <table>
            <tbody>
              <tr><th>Source</th><th>Good for</th><th>Note</th></tr>
              <tr><td><strong>freesound.org</strong></td><td>UI clicks, pops, whooshes</td><td>Check each sound's license; prefer CC0.</td></tr>
              <tr><td><strong>itch.io</strong> asset packs</td><td>Whole SFX sets in one style</td><td>Many are free or pay-what-you-want.</td></tr>
              <tr><td><strong>kenney.nl</strong></td><td>Clean, consistent, CC0 game sounds</td><td>No attribution required — ideal.</td></tr>
              <tr><td>Make your own</td><td>Custom blips</td><td>Tools like sfxr/jsfxr generate retro SFX free.</td></tr>
            </tbody>
          </table>
          <h3>Format &amp; import</h3>
          <p>
            Use short <code>.wav</code> files for snappy effects (lowest latency). Drag them into{' '}
            <code>audio/</code> in the FileSystem dock and Godot imports them automatically. For a piece
            "place," a soft <em>tick</em>; for a clear, a bright <em>pop</em> or <em>chime</em>; for game
            over, a gentle <em>descending</em> tone.
          </p>
          <Note kind="warn">
            <strong>Mind licenses before you ship.</strong> Once your game is on TestFlight or the App
            Store, every sound and image must be cleared for distribution. Keep a note of where each asset
            came from and its license. CC0 assets are the safest — no attribution, no strings.
          </Note>
                  <FullSourceSoFar sectionId="s20" />
        </section>

        <hr />

        {/* SECTION 21 — SAVING THE HIGH SCORE */}
        <section className="section" id="s21" ref={setRef('s21')}>
          <h2><span className="section-num">21</span>Saving the High Score</h2>
          <p>
            The best score should survive closing the app. We persist it to a small file in{' '}
            <code>user://</code> — Godot's per-app writable folder, which on iOS lives safely inside your
            app's private storage. We save when a new best is set and load on launch.
          </p>
          <h3>Add save/load to GameState</h3>
          <CodePre>{`# scripts/GameState.gd  (autoload: GameState)
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({ "best": best }))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))`}</CodePre>
          <p>
            Two bits of defensive coding earn their keep here: <code>file_exists</code> handles the very
            first launch (no save yet), and <code>data.get("best", 0)</code> falls back to <code>0</code>{' '}
            if the file is older or partial. Robust loading means a weird save file can never crash the
            game.
          </p>
          <h3>Also save when the app loses focus</h3>
          <p>
            On a phone, players switch apps constantly. Persist on the way out so nothing is lost even if
            the OS kills the app:
          </p>
          <CodePre>{`func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()`}</CodePre>
          <MermaidDiagram theme="default" chart={`graph LR
  LAUNCH["App launches"] --> LOAD["GameState._ready()<br/>load_data()"]
  PLAY["New high score"] --> SAVE1["add() -> save()"]
  SWITCH["Player switches apps"] --> SAVE2["_notification -> save()"]
  SAVE1 --> FILE[("user://blockblast.save")]
  SAVE2 --> FILE
  LOAD -.reads.-> FILE`} />
          <Note>
            <strong>Inspect your save while developing.</strong> Use{' '}
            <strong>Project → Open User Data Folder</strong> in the Godot editor to see the actual{' '}
            <code>user://</code> directory on your computer and open the save file in a text editor. Great
            for confirming data is written as you expect.
          </Note>
                  <FullSourceSoFar sectionId="s21" />
        </section>

        <hr />

        {/* SECTION 22 — THE MAIN MENU */}
        <section className="section" id="s22" ref={setRef('s22')}>
          <h2><span className="section-num">22</span>The Main Menu</h2>
          <p>
            A title screen makes the game feel finished and gives the best score a home. It's a small{' '}
            <code>Control</code> scene with a title, the best score, and a Play button that switches to the
            game.
          </p>
          <h3>Build the menu scene</h3>
          <p>This is a third scene file, and it's the same container pattern as the Game Over panel:</p>
          <div className="arch-diagram">
            Menu <span className="dim">(Control, Full Rect, scripts/Menu.gd)</span>{'\n'}
            └─ CenterContainer <span className="dim">(Full Rect)</span>{'\n'}
            {'   '}└─ VBoxContainer{'\n'}
            {'      '}├─ Label <span className="dim">"BLOCK BLAST"</span>{'\n'}
            {'      '}├─ BestLabel <span className="dim">"Best: 0"</span>{'\n'}
            {'      '}└─ Play <span className="dim">(Button) "Play"</span>
          </div>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">New scene with a Control root</div>
                <div className="tl-desc">
                  <strong>Scene → New Scene</strong>. In the Create Root Node panel click{' '}
                  <strong>User Interface</strong> — that's the shortcut that gives you a <code>Control</code>{' '}
                  root (the same way "2D Scene" gave you a Node2D). Rename it to <code>Menu</code> and set its{' '}
                  <strong>Anchors Preset</strong> to <strong>Full Rect</strong>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Save as scenes/menu.tscn</div>
                <div className="tl-desc"><code>Ctrl+S</code> → <code>scenes</code> folder → <code>menu.tscn</code>.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Add the containers and children</div>
                <div className="tl-desc">
                  Select <code>Menu</code> → <code>Ctrl+A</code> → <code>CenterContainer</code> → set it to{' '}
                  <strong>Full Rect</strong>. Select that → <code>Ctrl+A</code> →{' '}
                  <code>VBoxContainer</code>. Then add three children to the VBox (re-selecting it each time):
                  a <code>Label</code> (Text: <code>BLOCK BLAST</code>), a second <code>Label</code> renamed{' '}
                  <code>BestLabel</code> (Text: <code>Best: 0</code>), and a <code>Button</code> renamed{' '}
                  <code>Play</code> (Text: <code>Play</code>).
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">4</div>
              <div className="tl-content">
                <div className="tl-title">Attach scripts/Menu.gd</div>
                <div className="tl-desc">
                  Select the <code>Menu</code> root → <strong>Attach Script</strong> → Path{' '}
                  <code>res://scripts/Menu.gd</code> → <strong>Create</strong>. Paste the code below over the
                  generated file.
                </div>
              </div>
            </div>
          </div>
          <Note kind="warn">
            <strong>Node paths are literal.</strong> The script below reaches the button with{' '}
            <code>$CenterContainer/VBoxContainer/Play</code>. That string is just the node names joined by
            slashes — so if you named the button <code>PlayButton</code>, or forgot the CenterContainer, the
            game crashes on launch with a null error. Compare your Scene dock to the tree above before
            running.
          </Note>
          <h3>The menu script</h3>
          <CodePre>{`# scripts/Menu.gd
extends Control

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)

func _on_play() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")`}</CodePre>
          <p>
            Because <code>GameState</code> is an autoload that loads the saved best in its{' '}
            <code>_ready()</code>, the best score is already available when the menu opens — no extra
            plumbing.
          </p>
          <h3>Make the menu the first screen</h3>
          <p>
            Set <code>scenes/menu.tscn</code> as the main scene under <strong>Project → Project Settings →
            Application → Run → Main Scene</strong>. Now the app boots to the menu; Play launches the game.
            Optionally add a "Menu" button to the Game Over panel that calls{' '}
            <code>change_scene_to_file("res://scenes/menu.tscn")</code> to return home.
          </p>
          <Note>
            <strong>Scene switching frees the old scene.</strong> When you change scenes, Godot unloads the
            previous one entirely. That's why game-wide data (the best score) lives in the{' '}
            <code>GameState</code> autoload — autoloads survive scene changes; regular nodes don't.
          </Note>
                  <FullSourceSoFar sectionId="s22" />
        </section>

        <hr />

        {/* SECTION 23 — PAUSE & RESTART */}
        <section className="section" id="s23" ref={setRef('s23')}>
          <h2><span className="section-num">23</span>Pause &amp; Restart</h2>
          <p>
            Players need to pause. Godot has built-in pause: set <code>get_tree().paused = true</code> and
            every node stops processing — <em>except</em> nodes you mark to keep running, like your pause
            menu. That exception is controlled by a node's <strong>process mode</strong>.
          </p>
          <h3>Process modes</h3>
          <table>
            <tbody>
              <tr><th>Process Mode</th><th>Behaves how when paused</th></tr>
              <tr><td><code>Inherit</code> (default)</td><td>Follows its parent — pauses when the tree pauses.</td></tr>
              <tr><td><code>Pausable</code></td><td>Always pauses with the tree. Use for gameplay nodes.</td></tr>
              <tr><td><code>Always</code></td><td>Keeps running even when paused. Use for the pause menu + its button.</td></tr>
              <tr><td><code>WhenPaused</code></td><td>Only runs while paused.</td></tr>
            </tbody>
          </table>
          <h3>Wire up a pause overlay</h3>
          <p>
            In <code>game.tscn</code>, add this under <code>HUD</code>. The code below reaches these nodes by
            the exact names <code>PauseButton</code>, <code>PausePanel</code>, <code>Resume</code>,{' '}
            <code>Restart</code>, and <code>Menu</code> — so match them character for character:
          </p>
          <div className="arch-diagram">
            HUD <span className="dim">(CanvasLayer)</span>{'\n'}
            ├─ ScoreLabel{'\n'}
            ├─ GameOverPanel <span className="dim">(from earlier)</span>{'\n'}
            ├─ PauseButton <span className="dim">(Button, text "II")</span>{'\n'}
            └─ PausePanel <span className="dim">(Control, Full Rect, Visible off, Process Mode = Always)</span>{'\n'}
            {'   '}├─ Dim <span className="dim">(ColorRect, Full Rect, black @ 60%)</span>{'\n'}
            {'   '}└─ CenterContainer <span className="dim">(Full Rect)</span>{'\n'}
            {'      '}└─ VBoxContainer{'\n'}
            {'         '}├─ Resume <span className="dim">(Button)</span>{'\n'}
            {'         '}├─ Restart <span className="dim">(Button)</span>{'\n'}
            {'         '}├─ Menu <span className="dim">(Button)</span>{'\n'}
            {'         '}└─ Settings <span className="dim">(Button — opens the settings overlay in Section 28)</span>
          </div>
          <p>
            Build it exactly like the Game Over panel in Section 17 (add <code>Control</code> → Anchors
            Preset <strong>Full Rect</strong> → <code>ColorRect</code> → <code>CenterContainer</code> →{' '}
            <code>VBoxContainer</code> → four <code>Button</code>s), then untick{' '}
            <strong>Visible</strong> on <code>PausePanel</code>. The <code>Settings</code> button does
            nothing until Section 28 wires it — that's fine, add it now so the pause menu is complete.
          </p>
          <Note kind="warn">
            <strong>The one non-obvious setting: Process Mode.</strong> Pausing works by setting{' '}
            <code>get_tree().paused = true</code>, which freezes <em>every</em> node — including the buttons
            on your pause menu, so nothing would respond and you'd be stuck. Fix it by selecting{' '}
            <code>PausePanel</code>, and in the Inspector scrolling to the <strong>Node → Process</strong>{' '}
            group and setting <strong>Mode</strong> to <code>Always</code>. That means "keep running even when
            the tree is paused." Children inherit it, so the three buttons keep working.
          </Note>
          <p>
            The buttons live under <code>CenterContainer/VBoxContainer</code> (that's what the tree above
            shows), so we reach them by that full path from <code>pause_panel</code>. Match the path to
            your tree exactly — <code>pause_panel.get_node("Resume")</code> alone would look for a{' '}
            <em>direct</em> child called <code>Resume</code> and crash with a null error, because the
            button is actually nested two levels down.
          </p>
          <CodePre>{`# in scripts/Game.gd
@onready var pause_panel := $HUD/PausePanel

func _ready() -> void:
	# ...existing setup...
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")`}</CodePre>
          <Note kind="warn">
            <strong>Always unpause before changing scenes.</strong> If you leave to the menu while{' '}
            <code>paused</code> is still <code>true</code>, the menu loads frozen and feels broken. Set{' '}
            <code>paused = false</code> first. Same goes for restart.
          </Note>
          <h3>Restart reuses what you already wrote</h3>
          <p>
            The pause menu's Restart can call the same <code>_on_play_again()</code> from the Game Over
            section — reset state, clear the board, deal a fresh tray, hide overlays. One restart function,
            reused everywhere, keeps behavior consistent.
          </p>
                  <FullSourceSoFar sectionId="s23" />
        </section>

        <hr />

        {/* SECTION 24 — MOBILE POLISH */}
        <section className="section" id="s24" ref={setRef('s24')}>
          <h2><span className="section-num">24</span>Mobile Polish</h2>
          <p>
            A few mobile-specific touches separate a "works in the editor" game from one that feels at home
            on an iPhone. Most are quick settings; a couple are small code additions.
          </p>
          <h3>Stretch &amp; orientation (confirm)</h3>
          <p>
            Double-check what we set during setup: <strong>Display → Window</strong> stretch mode{' '}
            <code>canvas_items</code>, aspect <code>expand</code>, and Handheld orientation{' '}
            <code>portrait</code>. These make the board fill any iPhone cleanly without stretching or black
            bars.
          </p>
          <h3>Respect the safe area (notch &amp; Dynamic Island)</h3>
          <p>
            Keep the score and any top UI below the notch by insetting your HUD. Query the safe area and
            nudge the top elements down:
          </p>
          <CodePre>{`# in scripts/Game.gd
func _ready() -> void:
	# ...existing setup...
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)`}</CodePre>
          <p>
            Because the board sits well inside the screen and the tray is above the home-indicator area,
            the play field itself is usually safe — it's the very top and very bottom UI you must inset.
          </p>
          <h3>Generous touch targets</h3>
          <p>
            We already padded piece hit areas with <code>.grow(24)</code> in the pick-up code. Apply the
            same generosity to buttons: make them physically large (Apple recommends a minimum tappable
            size of about 44pt). Big, obvious buttons feel better on a phone than dense, precise ones.
          </p>
          <h3>Haptics</h3>
          <p>
            A tiny vibration on a clear adds a surprising amount of satisfaction. Godot exposes basic
            device vibration:
          </p>
          <CodePre>{`func _on_lines_cleared(cells: Array, count: int) -> void:
	# ...flash + popup...
	Input.vibrate_handheld(40)   # ~40ms buzz on a clear`}</CodePre>
          <Note kind="warn">
            <strong>Haptics only fire on a real device.</strong> <code>vibrate_handheld</code> does nothing
            in the editor or Simulator — that's expected. Test it on your actual iPhone. Use it sparingly
            (clears, game over), never on every tap, or it becomes annoying and drains battery.
          </Note>
          <h3>Frame rate &amp; battery</h3>
          <p>
            A puzzle game has no reason to render at 120 FPS. Leaving the default 60 FPS cap keeps the game
            smooth while being kind to the battery. There's nothing to change here unless you previously
            raised the cap.
          </p>
                  <FullSourceSoFar sectionId="s24" />
        </section>

        <hr />

        {/* SECTION 25 — PLAYTESTING */}
        <section className="section" id="s25" ref={setRef('s25')}>
          <h2><span className="section-num">25</span>Playtesting</h2>
          <p>
            Before shipping, play your game the way a player will — with touch, on a phone-shaped screen,
            looking for anything that feels off. Test in three escalating environments.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">In the Godot editor (fastest)</div>
                <div className="tl-desc">Press <code>F5</code>. With "Emulate Touch From Mouse" on, dragging with the mouse behaves like a finger. Use the editor's device-size preview to check a tall, narrow screen.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">In the iOS Simulator</div>
                <div className="tl-desc">After exporting to Xcode (next section), run on a simulated iPhone. Confirms real iOS sizing, safe areas, and orientation lock — though not haptics or true performance.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">3</div>
              <div className="tl-content">
                <div className="tl-title">On a real iPhone</div>
                <div className="tl-desc">The only test that counts for feel. Check drag latency, touch accuracy near edges, haptics, and that nothing hides under the notch or home indicator.</div>
              </div>
            </div>
          </div>
          <h3>A playtest checklist</h3>
          <ul>
            <li>☐ Can you always tell where a piece will land (clear ghost)?</li>
            <li>☐ Do illegal drops snap back cleanly to the tray?</li>
            <li>☐ Do row + column clears both work, including at the same time?</li>
            <li>☐ Does the score (and best) update correctly and persist after relaunch?</li>
            <li>☐ Does game over trigger only when truly stuck — not early, not late?</li>
            <li>☐ Does Restart fully reset the board, tray, and score?</li>
            <li>☐ Is anything important hidden by the notch or home indicator?</li>
            <li>☐ Do pieces near the screen edges still pick up reliably?</li>
          </ul>
          <Note>
            <strong>Watch someone else play.</strong> Hand your phone to a friend and say nothing. Where
            they hesitate or do the "wrong" thing reveals more than hours of solo testing. The fixes are
            usually tiny — a bigger touch target, a clearer ghost, a louder clear sound.
          </Note>
        </section>

        <hr />

        {/* SECTION 26 — PRE-SHIP CHECKLIST */}
        <section className="section" id="s26" ref={setRef('s26')}>
          <h2><span className="section-num">26</span>Pre-Ship Checklist</h2>
          <p>
            Before exporting for the App Store side, lock down the app's identity and assets. Skipping
            these causes the most common upload rejections.
          </p>
          <table>
            <tbody>
              <tr><th>Item</th><th>Where</th><th>Detail</th></tr>
              <tr><td>App name</td><td>iOS export preset → Application → Name</td><td>Short, fits under an icon (e.g. "Block Blast").</td></tr>
              <tr><td>Bundle identifier</td><td>Export preset + App Store Connect</td><td>Unique reverse-domain, e.g. <code>com.yourname.blockblast</code>. Must match everywhere.</td></tr>
              <tr><td>Version / build</td><td>Export preset → Version</td><td>Short version <code>1.0</code>; build number <code>1</code> (bump every upload).</td></tr>
              <tr><td>App icon</td><td>Export preset → Icons / Xcode AppIcon</td><td>1024×1024 PNG, NO transparency.</td></tr>
              <tr><td>Launch screen</td><td>Export preset → Launch Screens</td><td>A solid brand color or simple logo.</td></tr>
              <tr><td>Orientation</td><td>Display → Window → Handheld</td><td>Locked to <code>portrait</code>.</td></tr>
              <tr><td>Asset licenses</td><td>Your notes</td><td>Every sound/image cleared for distribution (prefer CC0).</td></tr>
            </tbody>
          </table>
          <h3>Make an icon from your game</h3>
          <p>
            Block Blast has a free icon idea built in: a small grid of a few colored rounded squares on a
            dark background. Compose a <code>1024×1024</code> PNG in any image editor (or even screenshot a
            zoomed-in cluster of your own blocks), export it flat with a solid background, and set it as the
            App Store icon.
          </p>
          <h3>Strip debug leftovers</h3>
          <ul>
            <li>Remove temporary <code>set_cell(...)</code> test fills and stray <code>print()</code> calls.</li>
            <li>Confirm the main scene is <code>menu.tscn</code> (or <code>game.tscn</code> if you skipped the menu).</li>
            <li>Make sure no placeholder colors or "TODO" labels remain on screen.</li>
          </ul>
          <Note kind="warn">
            <strong>The alpha-channel icon rejection is the #1 gotcha.</strong> If your first upload bounces,
            it's almost always a 1024×1024 icon with transparency. Re-export it flat and try again.
          </Note>
        </section>

        <hr />

        {/* SECTION 27 — SHIPPING TO TESTFLIGHT */}
        <section className="section" id="s27" ref={setRef('s27')}>
          <h2><span className="section-num">27</span>Shipping to TestFlight</h2>
          <p>
            This is the exact order to run, start to finish. The step everyone gets tangled in is the{' '}
            <strong>Bundle ID</strong>, so read the note below before you touch anything — it dissolves the
            apparent chicken-and-egg completely.
          </p>
          <Note kind="warn">
            <strong>The Bundle ID is a string you invent. Nothing generates it.</strong> It is not produced
            by Godot, Xcode, or Apple — you make it up once, right now, and then type{' '}
            <em>the same string</em> everywhere it's asked for. Use reverse-domain form, all lowercase, no
            spaces or underscores: <code>com.yourname.blockblast</code>. It must be globally unique across
            the entire App Store, so use your own name or domain.
            <br /><br />
            It gets used in exactly two places you type it, and one place you pick it from a list:
            <br />• <strong>Godot</strong> export preset — you type it (Step 3).
            <br />• <strong>Xcode</strong> — it arrives automatically from Godot's export; you just turn on
            signing, and <em>that</em> is what registers the ID with Apple (Step 5).
            <br />• <strong>App Store Connect</strong> — you <em>select</em> it from a dropdown (Step 6). It
            only appears in that dropdown <em>because</em> Xcode registered it in Step 5. That's why App
            Store Connect comes after Xcode, not before.
            <br /><br />
            <strong>Write your Bundle ID down now</strong> and copy-paste it every time. A single character
            of drift (a capital letter, a typo) causes confusing signing failures later. And note: once an
            App Store Connect record exists, its Bundle ID <strong>can never be changed</strong> — you'd
            have to make a new app record.
          </Note>

          <h3>The order, and why</h3>
          <MermaidDiagram theme="default" chart={`graph TB
  P["1-2. Prereqs + invent Bundle ID"] --> G["3-4. Godot: preset -> Export Xcode project"]
  G --> X["5. Xcode: turn on signing<br/>(registers Bundle ID with Apple)"]
  X --> A["6. App Store Connect: create app record<br/>(Bundle ID now in the dropdown)"]
  A --> AR["7-8. Xcode: Archive -> Upload"]
  AR --> T["9. TestFlight: encryption + testers"]
  T --> I["10. iPhone: install"]`} />

          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Prerequisites (all three, before anything else)</div>
                <div className="tl-desc">
                  • <strong>Apple Developer Program</strong> membership, $99/yr, from{' '}
                  <code>developer.apple.com</code>. Enrollment can take 24-48 hours to activate — start this
                  first. A <em>free</em> Apple ID can side-load to your own phone for 7 days but{' '}
                  <strong>cannot use TestFlight at all</strong>.
                  <br />• <strong>Xcode</strong> from the Mac App Store. Open it once, accept the license, let
                  it install components. Then <strong>Xcode → Settings → Accounts → +</strong> and sign in with
                  the Apple ID that holds the membership.
                  <br />• <strong>Point the command line at Xcode.</strong> This is the step everyone misses.
                  If you've ever installed Apple's "Command Line Tools" (many things trigger it automatically),
                  your <code>xcode-select</code> points there instead of at Xcode, and Godot's export fails
                  with <code>[Xcode Build]: Failed to run xcodebuild</code>. Fix it once, in Terminal:
                  <br /><code>sudo xcode-select -s /Applications/Xcode.app/Contents/Developer</code>
                  <br /><code>sudo xcodebuild -license accept</code>
                  <br />Then confirm <code>xcodebuild -version</code> prints an Xcode version (not an error).
                  <br />• <strong>Godot iOS export templates</strong>:{' '}
                  <strong>Editor → Manage Export Templates… → Download and Install</strong> (~1 GB). These must
                  match your exact Godot version. Without them the iOS preset shows a red error and won't
                  export.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Invent your Bundle ID and write it down</div>
                <div className="tl-desc">
                  Decide it now: <code>com.yourname.blockblast</code>. Lowercase, reverse-domain, globally
                  unique. Paste it somewhere you can copy from. You will type this exact string in Step 3 and
                  select it in Step 6. <strong>This is the step the old version of this guide was missing</strong>,
                  which is why Steps 2 and 5 looked like they depended on each other.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">3</div>
              <div className="tl-content">
                <div className="tl-title">Godot: create the iOS export preset</div>
                <div className="tl-desc">
                  <strong>Project → Export…</strong> → <strong>Add…</strong> → <strong>iOS</strong>. Then fill
                  in, on the right:
                  <br />• <strong>Application → Bundle Identifier</strong> = the string from Step 2.
                  <br />• <strong>Application → Name</strong> = <code>Block Blast</code> (the home-screen name).
                  <br />• <strong>Application → Short Version</strong> = <code>1.0</code> and{' '}
                  <strong>Version</strong> = <code>1</code> (Version is the <em>build number</em> — you'll bump
                  this every upload).
                  <br />• <strong>Icons → App Store 1024 × 1024</strong> = a 1024×1024 PNG with{' '}
                  <strong>no transparency / no alpha channel</strong> and square corners (Apple rounds them).
                  A missing or transparent icon is the single most common red error here. Godot generates all
                  the smaller icon sizes from this one automatically.
                  <br />• <strong>Application → App Store Team ID</strong>: <em>leave it blank for now.</em>{' '}
                  With Export Project Only (Step 4) you pick your team in Xcode by name, so Godot doesn't need
                  it. If you ever do want it, it's the <strong>10-character code</strong> (like{' '}
                  <code>A1B2C3D4E5</code>) — <em>not</em> your name or email — found at{' '}
                  <code>developer.apple.com/account → Membership</code>, or in Terminal via{' '}
                  <code>security find-identity -v -p codesigning</code> (it's the code in parentheses).
                  <br />
                  Godot lists any remaining problems in red at the bottom of the window — fix until that list
                  is empty. Leave everything else default.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">4</div>
              <div className="tl-content">
                <div className="tl-title">Godot: export the Xcode project (not a .ipa)</div>
                <div className="tl-desc">
                  <strong>First, tick <code>Application → Export Project Only</code> in the preset options.</strong>{' '}
                  This is critical and easy to miss: with it <em>off</em> (Godot 4's default), Godot tries to
                  build the app itself by running <code>xcodebuild</code>, and if signing isn't perfectly set
                  up in the preset it fails with the maddeningly vague{' '}
                  <code>[Xcode Build]: Failed to run xcodebuild</code>. We want Godot to only <em>export the
                  project</em> and let <strong>Xcode</strong> do the building and signing (Steps 5-8) — so
                  turn this on.
                  <br />
                  Then click <strong>Export Project…</strong> and choose an empty <strong>folder</strong>{' '}
                  <em>outside</em> your Godot project — e.g. <code>~/Documents/BlockBlast-iOS</code> (pick a
                  folder, not a <code>.ipa</code> filename). Keeping it outside your project stops Godot
                  re-importing the generated Xcode files as game assets.
                  <br />
                  <strong>Untick "Export With Debug"</strong> — a debug build will be rejected by TestFlight.
                  <br />
                  With <em>Export Project Only</em> on, Godot does <em>not</em> compile anything — it writes an{' '}
                  <code>.xcodeproj</code> plus support files, and Xcode does the actual building next.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">5</div>
              <div className="tl-content">
                <div className="tl-title">Xcode: open it and turn on signing (this registers your Bundle ID)</div>
                <div className="tl-desc">
                  Open the <code>.xcodeproj</code> Godot just produced. In the left sidebar click the{' '}
                  <strong>blue project icon</strong> at the very top, then select the app{' '}
                  <strong>target</strong> in the middle pane, then the{' '}
                  <strong>Signing &amp; Capabilities</strong> tab.
                  <br />• Tick <strong>Automatically manage signing</strong>.
                  <br />• Set <strong>Team</strong> to your Apple Developer team.
                  <br />
                  Confirm the <strong>Bundle Identifier</strong> field already shows your string (Godot put it
                  there). Xcode now talks to Apple and{' '}
                  <strong>registers that Bundle ID under your account</strong> — this is the step that makes it
                  appear in App Store Connect.
                  <br />
                  <strong>What success looks like</strong> (there's no literal "green light"): the{' '}
                  <strong>Provisioning Profile</strong> line reads <em>"Xcode Managed Profile"</em>, the{' '}
                  <strong>Signing Certificate</strong> line shows <em>"Apple Development: …"</em>, and there is{' '}
                  <strong>no red error text</strong> in the Signing box. If you instead see a red "Failed to
                  register" / "no profiles found" message, wait a few seconds (Xcode is talking to Apple), or
                  click <strong>Try Again</strong>; a first-time account can take a minute.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">5b</div>
              <div className="tl-content">
                <div className="tl-title">Xcode: remove the unused privacy capabilities</div>
                <div className="tl-desc">
                  Godot's iOS template adds <strong>Camera</strong>, <strong>Microphone</strong>, and{' '}
                  <strong>Photo Library</strong> capability rows with blank <em>Usage Description</em> fields
                  (yellow ⚠️ warnings). This puzzle game uses none of them, and blank privacy descriptions can
                  get flagged at App Review. In <strong>Signing &amp; Capabilities</strong>, click the{' '}
                  <strong>trash icon</strong> at the top-right of each of those three boxes to remove them.
                  Safe to delete — nothing in the game touches the camera, mic, or photos.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">6</div>
              <div className="tl-content">
                <div className="tl-title">App Store Connect: create the app record</div>
                <div className="tl-desc">
                  <em>Now</em> — and not before — go to <code>appstoreconnect.apple.com</code> →{' '}
                  <strong>Apps</strong> → <strong>+</strong> → <strong>New App</strong>.
                  <br />• <strong>Platform</strong>: iOS
                  <br />• <strong>Name</strong>: your app's App Store name. This must be{' '}
                  <strong>globally unique across the entire App Store</strong>, so popular names like
                  "Block Blast" are already taken — you'll have to pick something else (e.g.
                  "Block Blast — MyName", or any unused variation). This is <em>only</em> the store-listing
                  name; it's separate from the <strong>home-screen name under your icon</strong> (that comes
                  from Godot's <em>Application → Name</em> and does <em>not</em> need to be unique), and from
                  your <strong>Bundle ID</strong>. For TestFlight-only testing the store name barely matters,
                  and you can change it anytime before a public release.
                  <br />• <strong>Primary Language</strong>: English (or whatever)
                  <br />• <strong>Bundle ID</strong>: <strong>pick yours from the dropdown</strong>. It's in
                  there because Step 5 registered it. If the dropdown is empty or missing your ID, Step 5
                  didn't complete — go back and fix signing.
                  <br />• <strong>SKU</strong>: any private unique string, e.g. <code>blockblast001</code>.
                  It's just your internal reference; users never see it.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">7</div>
              <div className="tl-content">
                <div className="tl-title">Xcode: archive the build</div>
                <div className="tl-desc">
                  In the toolbar destination selector (next to the run button) choose{' '}
                  <strong>Any iOS Device (arm64)</strong>.{' '}
                  <strong>You cannot archive while a Simulator is selected</strong> — Product → Archive stays
                  greyed out, which is the #1 confusion here.
                  <br />
                  Then <strong>Product → Archive</strong>. This compiles the engine and your game; the first
                  one can take several minutes. When it finishes, the <strong>Organizer</strong> window opens
                  automatically with your archive listed.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">8</div>
              <div className="tl-content">
                <div className="tl-title">Xcode: upload to App Store Connect</div>
                <div className="tl-desc">
                  In the Organizer, select the archive → <strong>Distribute App</strong> →{' '}
                  <strong>App Store Connect</strong> → <strong>Upload</strong> → keep the defaults
                  (automatically manage signing) → <strong>Upload</strong>.
                  <br />
                  On success you'll get "Upload Successful." The build then goes into{' '}
                  <strong>Processing</strong> on Apple's side — typically 5-30 minutes. You'll get an email
                  when it's done. It will <em>not</em> appear in TestFlight until processing finishes.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot">9</div>
              <div className="tl-content">
                <div className="tl-title">App Store Connect: (maybe) encryption answer + add yourself as a tester</div>
                <div className="tl-desc">
                  Open your app → <strong>TestFlight</strong> tab. Look at the build's status:
                  <br />• If it says <em>"Missing Compliance,"</em> click it and answer the encryption
                  question <strong>No</strong> (Block Blast adds no custom encryption).
                  <br />• If it already says <em>"Ready to Submit"</em> (or "Ready to Test"), the compliance
                  answer was declared during export — <strong>there's nothing to clear, skip straight to the
                  next step.</strong> ("Ready to Submit" is just Apple's label; for internal testing you never
                  actually submit anything.)
                  <br />
                  Now go to <strong>Internal Testing</strong> → <strong>Create Group</strong> (e.g. "Me") →
                  add your own Apple ID as a tester (as the account holder you're already in{' '}
                  <strong>Users and Access</strong>, so you'll appear in the list) → make sure your{' '}
                  <strong>Build</strong> is enabled for the group. Internal testers need no review and get the
                  build within a minute or two.
                </div>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-content">
                <Note>
                  <strong>Ignore every "public submission" prompt in App Store Connect.</strong> Your app
                  record will sit in <em>"Prepare for Submission"</em> forever, and the dashboard will nag you
                  about <strong>EU trader status</strong> (Digital Services Act), <strong>age ratings</strong>,
                  social-media questions, screenshots, pricing, and export compliance. <strong>None of it
                  applies to TestFlight.</strong> Those are all requirements for <em>publicly listing</em> the
                  app on the store — which you're not doing. Internal TestFlight testing needs none of them.
                  The only thing you must answer is the <strong>encryption / Missing Compliance</strong>{' '}
                  question above. The scary "your app will be removed from the EU App Store" banner only
                  affects apps that are actually published publicly — a private test build has nothing to
                  remove.
                </Note>
              </div>
            </div>

            <div className="tl-item">
              <div className="tl-dot done">10</div>
              <div className="tl-content">
                <div className="tl-title">iPhone: install and play</div>
                <div className="tl-desc">
                  Install the free <strong>TestFlight</strong> app from the App Store on your iPhone. Sign in
                  with the <strong>same Apple ID</strong> you added as an internal tester. Your app appears —
                  tap <strong>Install</strong>. You're playing your own game on your phone. 🎉
                </div>
              </div>
            </div>
          </div>

          <h3>When it goes wrong</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause / fix</th></tr>
              <tr><td><strong>[Xcode Build]: Failed to run xcodebuild</strong> (in Godot, at export)</td><td>Two common causes. <strong>(1)</strong> <code>Export Project Only</code> is off, so Godot tries to build the app itself and its signing fails — <strong>tick <code>Application → Export Project Only</code></strong> and let Xcode build instead (this is what Steps 5-8 do). <strong>(2)</strong> <code>xcode-select</code> points at the Command Line Tools, not Xcode: in Terminal run <code>sudo xcode-select -s /Applications/Xcode.app/Contents/Developer</code>, then <code>sudo xcodebuild -license accept</code>, confirm with <code>xcodebuild -version</code>, and re-export.</td></tr>
              <tr><td><strong>Product → Archive is greyed out</strong></td><td>A Simulator is selected. Change the destination to <strong>Any iOS Device (arm64)</strong>.</td></tr>
              <tr><td><strong>Bundle ID missing from the App Store Connect dropdown</strong></td><td>Step 5 didn't finish. Reopen Xcode → Signing &amp; Capabilities, fix the signing error, and let it register.</td></tr>
              <tr><td><strong>"Invalid Signature" / provisioning errors</strong></td><td>Almost always a Bundle ID mismatch. Confirm the exact same string in the Godot preset and Xcode.</td></tr>
              <tr><td><strong>Icon rejected / red error in Godot</strong></td><td>The 1024×1024 PNG has an alpha channel. Re-export it flattened, with no transparency.</td></tr>
              <tr><td><strong>Upload rejected as duplicate</strong></td><td>Build number wasn't incremented. Bump <strong>Version</strong> in the Godot preset (or Build in Xcode) and re-archive.</td></tr>
              <tr><td><strong>Build never appears in TestFlight</strong></td><td>Still Processing, or you haven't answered the encryption/compliance question. Check the TestFlight tab.</td></tr>
              <tr><td><strong>Debug build rejected</strong></td><td>"Export With Debug" was ticked in Step 4. Re-export with it off.</td></tr>
            </tbody>
          </table>

          <Note kind="warn">
            <strong>Bump the build number on every single upload.</strong> Apple rejects a build whose number
            it has already seen. In the Godot preset, that's{' '}
            <strong>Application → Version</strong> (<code>1</code> → <code>2</code> → <code>3</code>…). Do it
            before every re-export, or you'll get a duplicate-build error at the very last step.
          </Note>
          <Note>
            <strong>You only do Steps 1, 2, 5 and 6 once.</strong> Every subsequent build is just: bump the
            version → Godot <strong>Export Project</strong> → Xcode <strong>Archive</strong> →{' '}
            <strong>Distribute</strong>. It takes a couple of minutes once the plumbing exists.
          </Note>
        </section>

        <hr />

        {/* SECTION 28 (s31) — SETTINGS SCREEN */}
        <section className="section" id="s31" ref={setRef('s31')}>
          <h2><span className="section-num">28</span>Settings Screen</h2>
          <p>
            Players expect to control sound and similar options. We'll add a small settings overlay backed
            by flags in <code>GameState</code> that save alongside the high score. The pattern generalizes
            to any toggle you want.
          </p>
          <h3>Store the preferences</h3>
          <p>
            Add the flags to <code>GameState</code> and include them in <code>save()</code>/<code>load_data()</code>{' '}
            (the full version is in the source-listing section):
          </p>
          <CodePre>{`# in scripts/GameState.gd
var sound_on: bool = true
var haptics_on: bool = true

# in save():  JSON.stringify({ "best": best, "sound_on": sound_on, "haptics_on": haptics_on })
# in load_data():
#   sound_on = bool(data.get("sound_on", true))
#   haptics_on = bool(data.get("haptics_on", true))`}</CodePre>
          <h3>Gate effects on the flags</h3>
          <p>
            The <code>Sfx</code> autoload already routes every sound through <code>_play()</code>, so one
            check disables all sound at once. Haptics get the same treatment:
          </p>
          <CodePre>{`# in scripts/Sfx.gd
func _play(p: AudioStreamPlayer) -> void:
	if GameState.sound_on and p and p.stream:
		p.play()

# in scripts/Game.gd, wherever you buzz:
func _buzz(ms: int) -> void:
	if GameState.haptics_on:
		Input.vibrate_handheld(ms)`}</CodePre>
          <h3>Build the settings overlay</h3>
          <p>
            Another overlay under <code>HUD</code>, built exactly like the pause panel. Two things to get
            right: the container is named <code>VBox</code> (not <code>VBoxContainer</code>) because the code
            looks it up as <code>"CenterContainer/VBox/SoundCheck"</code>, and <code>SettingsPanel</code> needs{' '}
            <strong>Process Mode = Always</strong> so it still works when opened from a paused game.
          </p>
          <div className="arch-diagram">
            HUD <span className="dim">(CanvasLayer)</span>{'\n'}
            └─ SettingsPanel <span className="dim">(Control, Full Rect, Visible off, Process Mode = Always)</span>{'\n'}
            {'   '}├─ Dim <span className="dim">(ColorRect, Full Rect, black @ 60%)</span>{'\n'}
            {'   '}└─ CenterContainer <span className="dim">(Full Rect)</span>{'\n'}
            {'      '}└─ VBox <span className="dim">(VBoxContainer — rename it to exactly "VBox")</span>{'\n'}
            {'         '}├─ SoundCheck <span className="dim">(CheckButton, text "Sound")</span>{'\n'}
            {'         '}├─ HapticsCheck <span className="dim">(CheckButton, text "Haptics")</span>{'\n'}
            {'         '}└─ Close <span className="dim">(Button, text "Close")</span>
          </div>
          <Note>
            A <code>CheckButton</code> is the pill-shaped on/off switch (a <code>CheckBox</code> is the square
            tick-box — either works, but CheckButton looks more at home on a phone). Its "is it on?" property
            is <code>button_pressed</code>, and it fires the <code>toggled</code> signal with the new value —
            both of which the code below uses.
          </Note>
          <p>Wire them up:</p>
          <CodePre>{`# in scripts/Game.gd
@onready var settings_panel := $HUD/SettingsPanel

func _ready() -> void:
	# ...existing setup...
	var sound_check := settings_panel.get_node("CenterContainer/VBox/SoundCheck")
	var haptics_check := settings_panel.get_node("CenterContainer/VBox/HapticsCheck")
	sound_check.button_pressed = GameState.sound_on
	haptics_check.button_pressed = GameState.haptics_on
	sound_check.toggled.connect(func(on): GameState.sound_on = on; GameState.save())
	haptics_check.toggled.connect(func(on): GameState.haptics_on = on; GameState.save())
	settings_panel.get_node("CenterContainer/VBox/Close").pressed.connect(func(): settings_panel.visible = false)`}</CodePre>
          <Note kind="warn">
            <strong>Two things the earlier draft of this guide got wrong here.</strong> (1) The path is{' '}
            <code>CenterContainer/VBox/SoundCheck</code>, not <code>VBox/SoundCheck</code> — the{' '}
            <code>VBox</code> lives inside the <code>CenterContainer</code> in the tree above, so the short
            path crashes with a null. (2) This wires the toggles and the <em>Close</em> button, but nothing
            yet <em>opens</em> the panel. Add an opener — the simplest is a <strong>Settings</strong> button
            on the pause menu whose handler does <code>settings_panel.visible = true</code>:
          </Note>
          <CodePre>{`# in scripts/Game.gd — give the pause menu a "Settings" button (see Section 23),
# then open the overlay from it:
func _on_settings() -> void:
	settings_panel.visible = true

# ...and in _ready(), after the pause wiring:
	pause_panel.get_node("CenterContainer/VBoxContainer/Settings").pressed.connect(_on_settings)`}</CodePre>
          <p>
            Those <code>func(on): ...</code> snippets are <strong>lambdas</strong> — small inline functions.
            They're handy for one-line signal handlers like a toggle that just stores a value and saves.
          </p>
          <Note>
            <strong>Save on every change.</strong> Calling <code>GameState.save()</code> the instant a
            toggle flips means settings persist even if the app is killed immediately after. The save file
            is tiny, so saving often costs nothing.
          </Note>
                  <FullSourceSoFar sectionId="s31" />
        </section>

        <hr />

        {/* SECTION 29 (s32) — DIFFICULTY & WEIGHTING */}
        <section className="section" id="s32" ref={setRef('s32')}>
          <h2><span className="section-num">29</span>Difficulty &amp; Weighting</h2>
          <p>
            Right now every shape is equally likely. Real puzzle games tune the odds: more small pieces
            early (a gentle start), and a balanced mix later. We do this with <strong>weighted random</strong>{' '}
            selection — give each shape a "weight" and pick proportionally.
          </p>
          <h3>Add weights to the catalog</h3>
          <CodePre>{`# scripts/Pieces.gd — pair each shape with a weight (higher = more common)
const WEIGHTED := [
	{ "cells": [Vector2i(0,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(0,1)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], "w": 4 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)], "w": 3 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], "w": 1 },
	# ...add the rest with weights to taste...
]`}</CodePre>
          <h3>Pick proportionally</h3>
          <p>
            The classic algorithm: sum all weights, roll a random number in that range, then walk the list
            subtracting weights until you cross zero:
          </p>
          <CodePre>{`static func weighted_piece() -> Dictionary:
	var total := 0
	for s in WEIGHTED:
		total += s["w"]
	var roll := randi() % total
	for s in WEIGHTED:
		roll -= s["w"]
		if roll < 0:
			return { "cells": s["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	# Fallback (shouldn't happen):
	return random_piece()`}</CodePre>
          <MermaidDiagram theme="default" chart={`graph LR
  ROLL["roll = random(0..total)"] --> A["shape A (w=5)"]
  A -->|roll -= 5| B["shape B (w=3)"]
  B -->|roll -= 3| C["shape C (w=1)"]
  C --> PICK["first shape where roll < 0 wins"]`} />
          <h3>Ramping difficulty over time</h3>
          <p>
            To make the game get harder, shift the weights as the score climbs — fewer single cells, more
            awkward 5-cell pieces. A simple version scales a shape's weight by how big it is once the player
            is doing well:
          </p>
          <CodePre>{`static func weighted_piece_for_score(score: int) -> Dictionary:
	var hard := score > 1500          # ramp in after a while
	var total := 0
	var weights := []
	for s in WEIGHTED:
		var w: int = s["w"]
		if hard:
			w = max(1, w + s["cells"].size() - 3)   # favor bigger pieces
		weights.append(w)
		total += w
	var roll := randi() % total
	for i in range(WEIGHTED.size()):
		roll -= weights[i]
		if roll < 0:
			return { "cells": WEIGHTED[i]["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	return random_piece()`}</CodePre>
          <Note kind="warn">
            <strong>Never deal an unwinnable tray on purpose.</strong> Difficulty should come from harder
            shapes, not from guaranteeing a loss. Block Blast is fair because any tray <em>could</em> be
            survivable with good play. Keep at least some small, flexible pieces in the pool so skill
            matters more than luck.
          </Note>
                  <FullSourceSoFar sectionId="s32" />
        </section>

        <hr />

        {/* SECTION 30 (s33) — DAILY CHALLENGE */}
        <section className="section" id="s33" ref={setRef('s33')}>
          <h2><span className="section-num">30</span>Daily Challenge (Seeded)</h2>
          <p>
            A "daily challenge" gives every player the <em>same</em> sequence of pieces on a given day, so
            scores are comparable and there's a reason to come back. The trick is <strong>seeding</strong>{' '}
            the random number generator: the same seed always produces the same sequence.
          </p>
          <h3>How seeding works</h3>
          <p>
            Computers generate "random" numbers from a starting <strong>seed</strong>. Same seed → same
            numbers, every time. If we seed with today's date, everyone who plays today gets identical
            pieces. We use a dedicated <code>RandomNumberGenerator</code> so the daily mode doesn't disturb
            normal random play:
          </p>
          <CodePre>{`# scripts/Pieces.gd
static var rng := RandomNumberGenerator.new()
static var use_seeded := false

static func start_daily() -> void:
	var d := Time.get_date_dict_from_system()
	# Turn the date into a stable number, e.g. 20260623
	var seed_value: int = d.year * 10000 + d.month * 100 + d.day
	rng.seed = seed_value
	use_seeded = true

static func start_endless() -> void:
	use_seeded = false

static func _rand_index(n: int) -> int:
	return rng.randi() % n if use_seeded else randi() % n`}</CodePre>
          <p>
            Then route piece generation through <code>_rand_index</code> instead of bare{' '}
            <code>randi()</code>:
          </p>
          <CodePre>{`static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[_rand_index(SHAPES.size())]
	var color: Color = PALETTE[_rand_index(PALETTE.size())]
	return { "cells": shape, "color": color }`}</CodePre>
          <h3>Hook it to the menu</h3>
          <p>
            Add a <strong>Daily Challenge</strong> button next to Play. It calls{' '}
            <code>Pieces.start_daily()</code> before switching to the game; the normal Play calls{' '}
            <code>Pieces.start_endless()</code>:
          </p>
          <CodePre>{`func _on_play() -> void:
	Pieces.start_endless()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_daily() -> void:
	Pieces.start_daily()
	get_tree().change_scene_to_file("res://scenes/game.tscn")`}</CodePre>
          <Note>
            <strong>Same day, same game.</strong> Because the seed is the calendar date, the daily board is
            identical for everyone until midnight, then regenerates. You could store a separate "best daily
            score" and even show a little "Day streak" counter to bring players back.
          </Note>
                  <FullSourceSoFar sectionId="s33" />
        </section>

        <hr />

        {/* SECTION 31 (s34) — RESUMING A SAVED GAME */}
        <section className="section" id="s34" ref={setRef('s34')}>
          <h2><span className="section-num">31</span>Resuming a Saved Game</h2>
          <p>
            Phones interrupt constantly — a call, a notification, the screen locking. Saving the in-progress
            game so players can resume exactly where they left off is a big quality-of-life win. We
            serialize the board and the tray to JSON, just like the high score.
          </p>
          <h3>Turn the game into data</h3>
          <p>
            Colors and shapes need to become plain text. We store each filled cell's color as a hex string,
            and each tray piece as its cells + color:
          </p>
          <CodePre>{`# in scripts/Board.gd — export the grid as hex strings (or "" for empty)
func to_data() -> Array:
	var rows: Array = []
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			var c = grid[y][x]
			row.append(c.to_html() if c != null else "")
		rows.append(row)
	return rows

func from_data(rows: Array) -> void:
	_init_grid()
	for y in range(min(GRID, rows.size())):
		for x in range(min(GRID, rows[y].size())):
			var s: String = rows[y][x]
			if s != "":
				grid[y][x] = Color.html(s)
	queue_redraw()`}</CodePre>
          <h3>Serialize the tray</h3>
          <CodePre>{`# in scripts/Game.gd
func _tray_to_data() -> Array:
	var out: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			var cell_list: Array = []
			for c in p.cells:
				cell_list.append([c.x, c.y])
			out.append({ "cells": cell_list, "color": p.color.to_html() })
		else:
			out.append(null)
	return out`}</CodePre>
          <h3>Save and restore the whole game</h3>
          <CodePre>{`const GAME_SAVE := "user://blockblast.game"

func save_game() -> void:
	var data := {
		"score": GameState.score,
		"board": $Board.to_data(),
		"tray": _tray_to_data(),
	}
	var f := FileAccess.open(GAME_SAVE, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))
		f.close()

func has_saved_game() -> bool:
	return FileAccess.file_exists(GAME_SAVE)

func load_game() -> bool:
	if not has_saved_game():
		return false
	var f := FileAccess.open(GAME_SAVE, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) != TYPE_DICTIONARY:
		return false
	GameState.score = int(data.get("score", 0))
	$Board.from_data(data.get("board", []))
	_restore_tray(data.get("tray", []))
	_update_score_label()
	return true`}</CodePre>
          <p>
            Call <code>save_game()</code> from <code>_notification</code> when the app pauses, and offer a{' '}
            <strong>Continue</strong> button on the menu that only appears when{' '}
            <code>has_saved_game()</code> is true. Delete the file on game over so a finished game doesn't
            resume.
          </p>
          <p>
            <code>load_game()</code> above calls <code>_restore_tray()</code>, so we have to write it — it
            re-instantiates the <code>piece.tscn</code> nodes from the saved cells/colors and re-positions
            them, the same way <code>deal_tray</code> does but with specific shapes instead of random ones.
            The saved cells come back as plain <code>[x, y]</code> arrays, so convert each to a{' '}
            <code>Vector2i</code>, and the color from its hex string:
          </p>
          <CodePre>{`# in scripts/Game.gd
func _restore_tray(saved: Array) -> void:
	for i in range(3):
		_free_slot(i)                       # clear whatever's there
	for i in range(min(3, saved.size())):
		var entry = saved[i]
		if entry == null:
			continue                        # that slot was already used
		var cells: Array = []
		for c in entry.get("cells", []):
			cells.append(Vector2i(int(c[0]), int(c[1])))
		var color := Color.html(entry.get("color", "ffffff"))
		var piece: Piece = piece_scene.instantiate()
		piece.setup({ "cells": cells, "color": color }, TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece`}</CodePre>
          <Note kind="warn">
            <strong>The resume flow needs a trigger.</strong> A saved file on disk isn't enough — something
            has to <em>ask</em> to resume. The pattern that works: the menu's <strong>Continue</strong>{' '}
            button sets a runtime flag (e.g. <code>GameState.resume_requested = true</code>) before it
            switches scenes, and the game's <code>_ready()</code> checks that flag — if it's set and{' '}
            <code>load_game()</code> succeeds, skip <code>deal_tray()</code>; otherwise deal fresh. Clear the
            flag either way, and delete the save on game over so a finished game never resumes.
          </Note>
                  <FullSourceSoFar sectionId="s34" />
        </section>

        <hr />

        {/* SECTION 32 (s35) — ACCESSIBILITY */}
        <section className="section" id="s35" ref={setRef('s35')}>
          <h2><span className="section-num">32</span>Accessibility</h2>
          <p>
            A few thoughtful touches make your game playable by far more people — and they're easy to add
            now. Apple also looks favorably on accessible apps.
          </p>
          <h3>Color-blind support</h3>
          <p>
            Roughly 1 in 12 men has some color-blindness. If pieces are distinguished <em>only</em> by
            color, some players can't tell them apart. Two fixes, best used together:
          </p>
          <ul>
            <li><strong>Pick a color-blind-safe palette:</strong> avoid red/green being the only difference. Blues, oranges, and yellows are distinguishable to most.</li>
            <li><strong>Add a shape/symbol per color:</strong> draw a tiny icon (dot, ring, square) in each cell so color isn't the only cue.</li>
          </ul>
          <CodePre>{`# Optional: draw a small symbol per color index in Piece/Board cell drawing
func _draw_symbol(center: Vector2, kind: int, size: float) -> void:
	match kind:
		0: draw_circle(center, size * 0.12, Color(0, 0, 0, 0.25))
		1: draw_rect(Rect2(center - Vector2(size,size)*0.1, Vector2(size,size)*0.2), Color(0,0,0,0.25))
		2: draw_arc(center, size * 0.16, 0, TAU, 16, Color(0,0,0,0.25), 3.0)`}</CodePre>
          <h3>Reduced motion</h3>
          <p>
            Screen shake and big animations can bother some players (and trigger motion sensitivity). Add a{' '}
            <code>reduce_motion</code> setting that scales effects down or off:
          </p>
          <CodePre>{`func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	if GameState.reduce_motion:
		return                    # skip shake entirely
	# ...normal shake...`}</CodePre>
          <p>
            <code>reduce_motion</code> already lives in <code>GameState</code> alongside the other saved
            prefs (Section 28), so it persists automatically. To let players actually flip it, add one more
            <code>CheckButton</code> named <code>MotionCheck</code> to the settings panel's <code>VBox</code>{' '}
            (right beside Sound and Haptics), then wire it in <code>_ready()</code> the same way — the Full
            Source guards it with <code>get_node_or_null</code>, so it's safe whether or not you add the node:
          </p>
          <CodePre>{`# in scripts/Game.gd, inside _ready() with the other settings wiring:
	var motion_check := settings_panel.get_node_or_null("CenterContainer/VBox/MotionCheck")
	if motion_check:
		motion_check.button_pressed = GameState.reduce_motion
		motion_check.toggled.connect(func(on): GameState.reduce_motion = on; GameState.save())`}</CodePre>
          <h3>Big, reachable touch targets</h3>
          <p>
            We already grow piece hit areas. For one-handed play, keep important buttons (pause, settings)
            within thumb reach — generally the lower third of the screen — and at least ~44pt. Avoid tiny
            controls near the very top.
          </p>
          <h3>Readable text</h3>
          <p>
            Use a large, high-contrast font for the score and menus. Light text on a dark background (or
            vice versa) with a clear size beats a stylish-but-faint label every time. Test your colors at
            arm's length.
          </p>
          <Note>
            <strong>Accessibility is just good design.</strong> Symbols-plus-color, optional reduced
            motion, big targets, and readable text don't only help users with impairments — they make the
            game clearer and more comfortable for everyone, including you at 1am debugging.
          </Note>
                  <FullSourceSoFar sectionId="s35" />
        </section>

        <hr />

        {/* SECTION 33 (s36) — FULL SOURCE: CORE FILES */}
        <section className="section" id="s36" ref={setRef('s36')}>
          <h2><span className="section-num">33</span>Full Source: Core Files</h2>
          <p>
            These last three sections collect every script in one place — the complete, assembled, working
            code, so you can copy-paste a clean version or check yours against it. We start with the small
            files: <code>GameState.gd</code>, <code>Pieces.gd</code>, <code>Sfx.gd</code>, and{' '}
            <code>Menu.gd</code>.
          </p>
          <h3>GameState.gd (autoload)</h3>
          <CodePre>{`# scripts/GameState.gd  —  autoload named "GameState"
extends Node

const SAVE_PATH := "user://blockblast.save"

var score: int = 0
var best: int = 0
var sound_on: bool = true
var haptics_on: bool = true
var reduce_motion: bool = false
var resume_requested: bool = false   # runtime-only: set by menu's Continue button

func _ready() -> void:
	load_data()

func reset() -> void:
	score = 0

func add(points: int) -> void:
	score += points
	if score > best:
		best = score
		save()             # persist the moment we beat the record

func save() -> void:
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify({
			"best": best,
			"sound_on": sound_on,
			"haptics_on": haptics_on,
			"reduce_motion": reduce_motion,
		}))
		f.close()

func load_data() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		return                          # first launch — nothing saved
	var f := FileAccess.open(SAVE_PATH, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) == TYPE_DICTIONARY:
		best = int(data.get("best", 0))
		sound_on = bool(data.get("sound_on", true))
		haptics_on = bool(data.get("haptics_on", true))
		reduce_motion = bool(data.get("reduce_motion", false))

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save()`}</CodePre>
          <h3>Pieces.gd</h3>
          <CodePre>{`# scripts/Pieces.gd  —  class_name, used as Pieces.random_piece()
class_name Pieces
extends RefCounted

# A friendly, bright palette — pieces pick a random one.
const PALETTE := [
	Color("#4FC3F7"), # sky blue
	Color("#FF7043"), # orange
	Color("#9CCC65"), # green
	Color("#BA68C8"), # purple
	Color("#FFD54F"), # amber
	Color("#F06292"), # pink
]

# Each shape is a list of (x, y) cell offsets, top-left normalized to (0,0).
const SHAPES := [
	[Vector2i(0,0)],                                              # single
	[Vector2i(0,0), Vector2i(1,0)],                              # domino across
	[Vector2i(0,0), Vector2i(0,1)],                              # domino down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)],              # I-3 across
	[Vector2i(0,0), Vector2i(0,1), Vector2i(0,2)],              # I-3 down
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], # I-4 across
	[Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], # 2x2 square
	[Vector2i(0,0), Vector2i(0,1), Vector2i(1,1)],              # L tromino
	[Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)],              # J tromino
	[Vector2i(0,0), Vector2i(1,0), Vector2i(1,1)],              # corner
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], # big L
	[Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(1,1)], # T
]

# --- Daily challenge / seeding (Chapter 30) ---
# A dedicated RNG so the daily mode doesn't disturb normal random play.
static var rng := RandomNumberGenerator.new()
static var use_seeded := false

static func start_daily() -> void:
	var d := Time.get_date_dict_from_system()
	# Turn the date into a stable number, e.g. 20260714
	rng.seed = d.year * 10000 + d.month * 100 + d.day
	use_seeded = true

static func start_endless() -> void:
	use_seeded = false

static func _rand_index(n: int) -> int:
	return rng.randi() % n if use_seeded else randi() % n

# Build one random piece: a shape + a color.
static func random_piece() -> Dictionary:
	var shape: Array = SHAPES[_rand_index(SHAPES.size())]
	var color: Color = PALETTE[_rand_index(PALETTE.size())]
	return { "cells": shape, "color": color }

# --- Difficulty & weighting (Chapter 29) ---
# Each shape paired with a weight (higher = more common).
const WEIGHTED := [
	{ "cells": [Vector2i(0,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(0,1)], "w": 5 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(0,1), Vector2i(1,1)], "w": 4 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0)], "w": 3 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(3,0)], "w": 2 },
	{ "cells": [Vector2i(0,0), Vector2i(1,0), Vector2i(2,0), Vector2i(0,1), Vector2i(0,2)], "w": 1 },
]

# Sum weights, roll in that range, walk the list until we cross zero.
static func weighted_piece() -> Dictionary:
	var total := 0
	for s in WEIGHTED:
		total += s["w"]
	var roll := randi() % total
	for s in WEIGHTED:
		roll -= s["w"]
		if roll < 0:
			return { "cells": s["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	# Fallback (shouldn't happen):
	return random_piece()

# Harder pieces get more likely once the player is doing well.
static func weighted_piece_for_score(score: int) -> Dictionary:
	var hard := score > 1500          # ramp in after a while
	var total := 0
	var weights := []
	for s in WEIGHTED:
		var w: int = s["w"]
		if hard:
			w = max(1, w + s["cells"].size() - 3)   # favor bigger pieces
		weights.append(w)
		total += w
	var roll := randi() % total
	for i in range(WEIGHTED.size()):
		roll -= weights[i]
		if roll < 0:
			return { "cells": WEIGHTED[i]["cells"], "color": PALETTE[randi() % PALETTE.size()] }
	return random_piece()`}</CodePre>
          <h3>Sfx.gd (autoload scene)</h3>
          <CodePre>{`# scripts/Sfx.gd  —  autoload scene scenes/sfx.tscn named "Sfx"
extends Node

@onready var _pick: AudioStreamPlayer = $Pick
@onready var _place: AudioStreamPlayer = $Place
@onready var _clear: AudioStreamPlayer = $Clear
@onready var _over: AudioStreamPlayer = $GameOver

func play_pick() -> void:  _play(_pick)
func play_place() -> void: _play(_place)
func play_clear() -> void: _play(_clear)
func play_over() -> void:  _play(_over)

func _play(p: AudioStreamPlayer) -> void:
	if GameState.sound_on and p and p.stream:
		p.play()`}</CodePre>
          <h3>Menu.gd</h3>
          <CodePre>{`# scripts/Menu.gd  —  on scenes/menu.tscn (Control root)
extends Control

const GAME_SAVE := "user://blockblast.game"

func _ready() -> void:
	$CenterContainer/VBoxContainer/BestLabel.text = "Best: %d" % GameState.best
	$CenterContainer/VBoxContainer/Play.pressed.connect(_on_play)
	$CenterContainer/VBoxContainer/Daily.pressed.connect(_on_daily)
	# Continue only appears when an in-progress game was saved.
	var cont := $CenterContainer/VBoxContainer/Continue
	cont.visible = FileAccess.file_exists(GAME_SAVE)
	cont.pressed.connect(_on_continue)

func _on_play() -> void:
	Pieces.start_endless()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_daily() -> void:
	Pieces.start_daily()
	get_tree().change_scene_to_file("res://scenes/game.tscn")

func _on_continue() -> void:
	GameState.resume_requested = true
	get_tree().change_scene_to_file("res://scenes/game.tscn")`}</CodePre>
        </section>

        <hr />

        {/* SECTION 34 (s37) — FULL SOURCE: PIECE & BOARD */}
        <section className="section" id="s37" ref={setRef('s37')}>
          <h2><span className="section-num">34</span>Full Source: Piece &amp; Board</h2>
          <p>
            The two visual workhorses. <code>Piece.gd</code> draws one shape at any size;{' '}
            <code>Board.gd</code> owns the grid, all the placement logic, clearing, the ghost, and drawing.
          </p>
          <h3>Piece.gd</h3>
          <CodePre>{`# scripts/Piece.gd  —  on scenes/piece.tscn (Node2D root)
extends Node2D
class_name Piece

var cells: Array = []
var color: Color = Color.WHITE
var cell_size: float = 60.0
var home := Vector2.ZERO

func setup(data: Dictionary, size: float) -> void:
	cells = data["cells"]
	color = data["color"]
	cell_size = size
	queue_redraw()

func size_in_cells() -> Vector2i:
	var max_x := 0
	var max_y := 0
	for c in cells:
		max_x = max(max_x, c.x)
		max_y = max(max_y, c.y)
	return Vector2i(max_x + 1, max_y + 1)

func pixel_size() -> Vector2:
	var s := size_in_cells()
	return Vector2(s.x, s.y) * cell_size

func _draw() -> void:
	for c in cells:
		_draw_block(Vector2(c.x, c.y) * cell_size, color, cell_size)

func _draw_block(p: Vector2, col: Color, size: float) -> void:
	var inset := size * 0.06
	var sb := StyleBoxFlat.new()
	sb.bg_color = col
	sb.set_corner_radius_all(int(size * 0.16))
	sb.border_color = col.lightened(0.30)
	sb.set_border_width(SIDE_TOP, 4)
	draw_style_box(sb, Rect2(p + Vector2(inset, inset), Vector2(size, size) - Vector2(inset, inset) * 2.0))`}</CodePre>
          <h3>Board.gd</h3>
          <CodePre>{`# scripts/Board.gd  —  on the Board node in game.tscn
extends Node2D
class_name Board

signal lines_cleared(cleared_cells: Array, line_count: int)

const GRID := 8           # 8x8 board
const CELL := 120         # pixel size of one cell
const BOARD_PX := GRID * CELL   # 960 px wide/tall

# The grid: GRID rows, each a row of GRID entries.
# An entry is either null (empty) or a Color (filled).
var grid: Array = []
const EMPTY_COLOR := Color(1, 1, 1, 0.06)   # faint cell background
const GAP := 6.0                            # pixels between cells
var ghost_cells: Array = []     # Array of Vector2i (absolute board cells)
var ghost_valid := false

func _ready() -> void:
	_init_grid()
	position = Vector2(60, 360)     # KEEP: places the board on screen
	queue_redraw()

func _init_grid() -> void:
	grid.clear()
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			row.append(null)        # start empty
		grid.append(row)

# True if (x, y) is a real cell on the board.
func in_bounds(x: int, y: int) -> bool:
	return x >= 0 and x < GRID and y >= 0 and y < GRID

# True if that cell exists and is empty.
func is_empty(x: int, y: int) -> bool:
	return in_bounds(x, y) and grid[y][x] == null

# Read a cell's color (or null).
func get_cell(x: int, y: int):
	return grid[y][x] if in_bounds(x, y) else null

# Fill or clear a cell.
func set_cell(x: int, y: int, color) -> void:
	if in_bounds(x, y):
		grid[y][x] = color

# Grid cell -> the pixel position of that cell's top-left corner
# (in the Board node's local space).
func cell_to_px(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * CELL, cell.y * CELL)

# A local pixel position -> which grid cell it falls in.
func px_to_cell(pos: Vector2) -> Vector2i:
	return Vector2i(int(floor(pos.x / CELL)), int(floor(pos.y / CELL)))

func _draw() -> void:
	for y in range(GRID):
		for x in range(GRID):
			var color = grid[y][x]
			_draw_cell(x, y, color if color != null else EMPTY_COLOR)
	var tint := Color(0.4, 1.0, 0.4, 0.35) if ghost_valid else Color(1.0, 0.3, 0.3, 0.35)
	for cell in ghost_cells:
		if in_bounds(cell.x, cell.y):
			var pos := Vector2(cell.x, cell.y) * CELL + Vector2(GAP, GAP) * 0.5
			var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
			draw_rect(Rect2(pos, size), tint)

func _draw_cell(x: int, y: int, color: Color) -> void:
	var pos := Vector2(x * CELL, y * CELL) + Vector2(GAP, GAP) * 0.5
	var size := Vector2(CELL, CELL) - Vector2(GAP, GAP)
	draw_style_box(_rounded_box(color, 18), Rect2(pos, size))

func _rounded_box(color: Color, radius: int) -> StyleBoxFlat:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(radius)
	return sb

# Can this shape be placed with its top-left at 'anchor'?
func can_place(anchor: Vector2i, cells: Array) -> bool:
	for c in cells:
		if not is_empty(anchor.x + c.x, anchor.y + c.y):     # off-board OR occupied -> illegal
			return false
	return true

func set_ghost(anchor: Vector2i, cells: Array, valid: bool) -> void:
	ghost_cells = []
	for c in cells:
		ghost_cells.append(Vector2i(anchor.x + c.x, anchor.y + c.y))
	ghost_valid = valid
	queue_redraw()

func clear_ghost() -> void:
	ghost_cells = []
	queue_redraw()

# True if this shape fits at any position on the board.
func can_place_anywhere(cells: Array) -> bool:
	for y in range(GRID):
		for x in range(GRID):
			if can_place(Vector2i(x, y), cells):
				return true
	return false

func clear_full_lines() -> int:
	var full_rows: Array = []
	var full_cols: Array = []

	# PASS 1 — find full rows
	for y in range(GRID):
		var full := true
		for x in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_rows.append(y)

	# PASS 1 — find full columns
	for x in range(GRID):
		var full := true
		for y in range(GRID):
			if grid[y][x] == null:
				full = false
				break
		if full:
			full_cols.append(x)

	# PASS 2 — clear everything we found, remembering cells for effects
	var cleared: Array = []
	for y in full_rows:
		for x in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null
	for x in full_cols:
		for y in range(GRID):
			if grid[y][x] != null:
				cleared.append(Vector2i(x, y))
			grid[y][x] = null

	var total: int = full_rows.size() + full_cols.size()
	if total > 0:
		queue_redraw()
		lines_cleared.emit(cleared, total)   # announce it for effects
	return total

func place(anchor: Vector2i, cells: Array, color: Color) -> void:
	for c in cells:
		set_cell(anchor.x + c.x, anchor.y + c.y, color)
	queue_redraw()

func reset_board() -> void:
	_init_grid()
	clear_ghost()
	queue_redraw()

func pop() -> void:
	scale = Vector2(1.03, 1.03)
	var t := create_tween()
	t.tween_property(self, "scale", Vector2.ONE, 0.12) \\
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

# --- Serialization for resume (Chapter 31) ---
# Export the grid as hex strings (or "" for empty).
func to_data() -> Array:
	var rows: Array = []
	for y in range(GRID):
		var row: Array = []
		for x in range(GRID):
			var c = grid[y][x]
			row.append(c.to_html() if c != null else "")
		rows.append(row)
	return rows

func from_data(rows: Array) -> void:
	_init_grid()
	for y in range(min(GRID, rows.size())):
		for x in range(min(GRID, rows[y].size())):
			var s: String = rows[y][x]
			if s != "":
				grid[y][x] = Color.html(s)
	queue_redraw()`}</CodePre>
        </section>

        <hr />

        {/* SECTION 35 (s38) — FULL SOURCE: GAME.GD */}
        <section className="section" id="s38" ref={setRef('s38')}>
          <h2><span className="section-num">35</span>Full Source: Game.gd</h2>
          <p>
            The conductor — input, drag and drop, the tray, scoring, refill, game over, pause, and juice.
            This is the one file that ties everything together. Read it top to bottom and you can trace the
            entire flow of the game.
          </p>
          <CodePre>{`# scripts/Game.gd  —  on the Game root of game.tscn
extends Node2D

const TRAY_CELL := 60.0
const TRAY_Y := 1560.0          # vertical position of the tray row
const GAME_SAVE := "user://blockblast.game"

var tray: Array = [null, null, null]   # three slots
var piece_scene := preload("res://scenes/piece.tscn")
var dragging: Piece = null      # the piece currently held, or null
var grab_offset := Vector2.ZERO # finger-to-piece offset while dragging
var _over := false              # true once game over — stops resume-saving
@onready var game_over_panel := $HUD/GameOverPanel
@onready var pause_panel := $HUD/PausePanel
@onready var settings_panel := $HUD/SettingsPanel

func _ready() -> void:
	$Board.lines_cleared.connect(_on_lines_cleared)
	# Resume a saved game if the menu's Continue was tapped; otherwise deal fresh.
	if GameState.resume_requested and load_game():
		GameState.resume_requested = false
	else:
		GameState.resume_requested = false
		deal_tray()
	_update_score_label()
	$HUD/GameOverPanel/CenterContainer/VBoxContainer/PlayAgain.pressed.connect(_on_play_again)
	$HUD/PauseButton.pressed.connect(_on_pause)
	pause_panel.get_node("CenterContainer/VBoxContainer/Resume").pressed.connect(_on_resume)
	pause_panel.get_node("CenterContainer/VBoxContainer/Restart").pressed.connect(_on_play_again)
	pause_panel.get_node("CenterContainer/VBoxContainer/Menu").pressed.connect(_on_menu)
	# Keep the score below the notch / Dynamic Island on real devices.
	var safe := DisplayServer.get_display_safe_area()
	$HUD/ScoreLabel.position.y = max($HUD/ScoreLabel.position.y, safe.position.y + 20)
	# Settings overlay: reflect saved prefs, and persist on every toggle.
	var sound_check := settings_panel.get_node("CenterContainer/VBox/SoundCheck")
	var haptics_check := settings_panel.get_node("CenterContainer/VBox/HapticsCheck")
	sound_check.button_pressed = GameState.sound_on
	haptics_check.button_pressed = GameState.haptics_on
	sound_check.toggled.connect(func(on): GameState.sound_on = on; GameState.save())
	haptics_check.toggled.connect(func(on): GameState.haptics_on = on; GameState.save())
	# Reduce Motion toggle is optional — only wire it if the scene has the node.
	var motion_check := settings_panel.get_node_or_null("CenterContainer/VBox/MotionCheck")
	if motion_check:
		motion_check.button_pressed = GameState.reduce_motion
		motion_check.toggled.connect(func(on): GameState.reduce_motion = on; GameState.save())
	settings_panel.get_node("CenterContainer/VBox/Close").pressed.connect(func(): settings_panel.visible = false)
	# Open the settings overlay from the pause menu's Settings button.
	pause_panel.get_node("CenterContainer/VBoxContainer/Settings").pressed.connect(_on_settings)

func deal_tray() -> void:
	for i in range(3):
		_free_slot(i)
		var piece: Piece = piece_scene.instantiate()
		piece.setup(Pieces.random_piece(), TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _free_slot(i: int) -> void:
	if tray[i] != null and is_instance_valid(tray[i]):
		tray[i].queue_free()
	tray[i] = null

func _position_in_tray(piece: Piece, i: int) -> void:
	var slot_w := 1080.0 / 3.0
	var slot_center_x := slot_w * i + slot_w * 0.5
	var ps := piece.pixel_size()
	piece.position = Vector2(slot_center_x - ps.x * 0.5, TRAY_Y - ps.y * 0.5)
	piece.home = piece.position    # remember where to snap back to

func _update_score_label() -> void:
	$HUD/ScoreLabel.text = "%d" % GameState.score

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_try_pick_up(event.position)
		else:
			_try_drop(event.position)
	elif event is InputEventScreenDrag and dragging != null:
		dragging.position = event.position - grab_offset
		_update_preview()

func _try_pick_up(touch: Vector2) -> void:
	for i in range(3):
		var piece: Piece = tray[i]
		if piece == null or not is_instance_valid(piece):
			continue
		var rect := Rect2(piece.position, piece.pixel_size()).grow(24)
		if rect.has_point(touch):
			dragging = piece
			# Grow to board scale so it lines up with the grid.
			dragging.cell_size = float($Board.CELL)
			dragging.queue_redraw()
			# Float the piece above the finger so the player can see it.
			var ps := dragging.pixel_size()
			grab_offset = Vector2(ps.x * 0.5, ps.y + 60.0)
			dragging.position = touch - grab_offset
			# Draw on top of everything.
			move_child(dragging, get_child_count() - 1)
			Sfx.play_pick()
			return

func _current_anchor() -> Vector2i:
	var board: Board = $Board
	var half := board.CELL * 0.5
	# Center of the piece's first cell, in screen space:
	var first_cell_center := dragging.position + Vector2(half, half)
	# Convert to the board's local space, then to a grid cell:
	return board.px_to_cell(first_cell_center - board.position)

func _update_preview() -> void:
	if dragging == null:
		return
	var board: Board = $Board
	var anchor := _current_anchor()
	var ok := board.can_place(anchor, dragging.cells)
	board.set_ghost(anchor, dragging.cells, ok)

func _try_drop(_touch: Vector2) -> void:
	if dragging == null:
		return
	var board := $Board
	var anchor := _current_anchor()

	if board.can_place(anchor, dragging.cells):
		var placed_cells: int = dragging.cells.size()
		board.place(anchor, dragging.cells, dragging.color)
		GameState.add(placed_cells)       # points for the cells you placed
		Sfx.play_place()
		_consume_dragging()               # remove it from the tray
		var lines: int = board.clear_full_lines()   # section 13
		_apply_clear_score(lines)         # section 14
		_after_placement()                # sections 15-16
	else:
		_return_to_tray(dragging)         # illegal -> snap back

	board.clear_ghost()
	_update_score_label()
	dragging = null

func _consume_dragging() -> void:
	for i in range(3):
		if tray[i] == dragging:
			tray[i] = null     # slot is now empty
	dragging.queue_free()      # remove the visual

func _return_to_tray(piece: Piece) -> void:
	piece.cell_size = TRAY_CELL    # shrink back to tray size
	piece.position = piece.home    # snap to its slot
	piece.queue_redraw()

func _apply_clear_score(lines: int) -> void:
	if lines <= 0:
		return
	# 100 per line, plus a growing bonus for multi-line clears.
	var points: int = lines * 100 + (lines - 1) * 50
	GameState.add(points)
	Sfx.play_clear()
	$Board.pop()
	shake(6.0 + lines * 3.0)   # bigger clears, bigger shake

func shake(amount: float = 10.0, steps: int = 6, step_time: float = 0.03) -> void:
	if GameState.reduce_motion:
		return                    # skip shake entirely for motion-sensitive players
	var t := create_tween()
	for i in range(steps):
		var off := Vector2(randf_range(-amount, amount), randf_range(-amount, amount))
		t.tween_property(self, "position", off, step_time)
	t.tween_property(self, "position", Vector2.ZERO, step_time)

func _on_lines_cleared(cells: Array, count: int) -> void:
	var board := $Board
	for cell in cells:
		var flash := ColorRect.new()
		flash.color = Color(1, 1, 1, 0.9)
		flash.size = Vector2(board.CELL, board.CELL)
		flash.position = board.position + Vector2(cell.x, cell.y) * board.CELL
		add_child(flash)
		var t := create_tween()
		t.tween_property(flash, "modulate:a", 0.0, 0.35)
		t.tween_callback(flash.queue_free)
	_spawn_score_popup(count)
	if GameState.haptics_on:
		Input.vibrate_handheld(40)   # ~40ms buzz on a clear (real device only)

func _spawn_score_popup(lines: int) -> void:
	var points := lines * 100 + (lines - 1) * 50
	var label := Label.new()
	label.text = "+%d" % points
	label.add_theme_font_size_override("font_size", 64)
	label.position = Vector2(420, 700)
	$HUD.add_child(label)
	var t := create_tween()
	t.set_parallel(true)
	t.tween_property(label, "position:y", 620, 0.6)
	t.tween_property(label, "modulate:a", 0.0, 0.6)
	t.chain().tween_callback(label.queue_free)

func _tray_pieces() -> Array:
	var live: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			live.append(p)
	return live

func _after_placement() -> void:
	if _tray_pieces().is_empty():
		deal_tray()
	if _is_game_over():
		_show_game_over()

func _is_game_over() -> bool:
	var board := $Board
	for piece in _tray_pieces():
		if board.can_place_anywhere(piece.cells):
			return false      # at least one piece still has a home
	return true               # nothing fits — game over

func _show_game_over() -> void:
	_over = true
	_clear_saved_game()         # a finished game must not resume
	game_over_panel.visible = true
	_set_label("Final", "Score: %d" % GameState.score)
	_set_label("Best", "Best: %d" % GameState.best)
	Sfx.play_over()
	set_process_input(false)    # ignore drags while the overlay is up

func _set_label(name: String, text: String) -> void:
	game_over_panel.get_node("CenterContainer/VBoxContainer/" + name).text = text

func _on_play_again() -> void:
	get_tree().paused = false
	_over = false
	GameState.reset()
	$Board.reset_board()
	deal_tray()
	game_over_panel.visible = false
	pause_panel.visible = false
	set_process_input(true)
	_update_score_label()

func _on_pause() -> void:
	get_tree().paused = true
	pause_panel.visible = true

func _on_resume() -> void:
	get_tree().paused = false
	pause_panel.visible = false

func _on_menu() -> void:
	get_tree().paused = false                       # unpause before leaving!
	get_tree().change_scene_to_file("res://scenes/menu.tscn")

func _on_settings() -> void:
	settings_panel.visible = true

# --- Resume a saved game (Chapter 31) ---
func _tray_to_data() -> Array:
	var out: Array = []
	for p in tray:
		if p != null and is_instance_valid(p):
			var cell_list: Array = []
			for c in p.cells:
				cell_list.append([c.x, c.y])
			out.append({ "cells": cell_list, "color": p.color.to_html() })
		else:
			out.append(null)
	return out

func save_game() -> void:
	if _over:
		return                          # don't persist a finished game
	var data := {
		"score": GameState.score,
		"board": $Board.to_data(),
		"tray": _tray_to_data(),
	}
	var f := FileAccess.open(GAME_SAVE, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data))
		f.close()

func has_saved_game() -> bool:
	return FileAccess.file_exists(GAME_SAVE)

func _clear_saved_game() -> void:
	if FileAccess.file_exists(GAME_SAVE):
		DirAccess.remove_absolute(ProjectSettings.globalize_path(GAME_SAVE))

func load_game() -> bool:
	if not has_saved_game():
		return false
	var f := FileAccess.open(GAME_SAVE, FileAccess.READ)
	var data = JSON.parse_string(f.get_as_text())
	f.close()
	if typeof(data) != TYPE_DICTIONARY:
		return false
	GameState.score = int(data.get("score", 0))
	$Board.from_data(data.get("board", []))
	_restore_tray(data.get("tray", []))
	_update_score_label()
	return true

# Rebuild the on-screen tray pieces from saved data —
# mirrors deal_tray() but uses the saved shapes instead of random ones.
func _restore_tray(saved: Array) -> void:
	for i in range(3):
		_free_slot(i)
	for i in range(min(3, saved.size())):
		var entry = saved[i]
		if entry == null:
			continue
		var cells: Array = []
		for c in entry.get("cells", []):
			cells.append(Vector2i(int(c[0]), int(c[1])))
		var color := Color.html(entry.get("color", "ffffff"))
		var piece: Piece = piece_scene.instantiate()
		piece.setup({ "cells": cells, "color": color }, TRAY_CELL)
		$Tray.add_child(piece)
		_position_in_tray(piece, i)
		tray[i] = piece

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_PAUSED \\
	or what == NOTIFICATION_WM_CLOSE_REQUEST:
		save_game()`}</CodePre>
          <p>
            That's the entire game — about 150 lines of conductor, plus the small files in the previous two
            sections. Everything you played through the build is right here, assembled and consistent.
          </p>
          <Note>
            <strong>This is your reference copy.</strong> If your game misbehaves, diff your version against
            these listings section by section. Most "it stopped working" moments are a single line that
            drifted — a swapped <code>x</code>/<code>y</code>, a missing <code>queue_redraw()</code>, or a
            signal that never got connected in <code>_ready()</code>.
          </Note>
        </section>

        <hr />

        {/* SECTION 36 (s39) — SCENE CONSTRUCTION REFERENCE */}
        <section className="section" id="s39" ref={setRef('s39')}>
          <h2><span className="section-num">36</span>Scene Construction Reference</h2>
          <p>
            Code is only half of a Godot game — the other half is the <strong>scene tree</strong> you build
            in the editor. This section is the exact, node-by-node blueprint for every scene, so you can
            confirm yours matches or rebuild one cleanly. For each scene: the tree, then the properties that
            matter.
          </p>
          <h3>game.tscn — the main game</h3>
          <div className="arch-diagram">
            Game <span className="dim">(Node2D) — script: Game.gd</span>{'\n'}
            ├─ Board <span className="dim">(Node2D) — script: Board.gd</span>{'\n'}
            ├─ Tray  <span className="dim">(Node2D) — position (0,0)</span>{'\n'}
            └─ HUD   <span className="dim">(CanvasLayer)</span>{'\n'}
            {'   '}├─ ScoreLabel    <span className="dim">(Label)</span>{'\n'}
            {'   '}├─ PauseButton   <span className="dim">(Button)</span>{'\n'}
            {'   '}├─ GameOverPanel <span className="dim">(Control, visible off)</span>{'\n'}
            {'   '}│  └─ CenterContainer → VBoxContainer{'\n'}
            {'   '}│     ├─ Label "Game Over"  ├─ Final (Label)  ├─ Best (Label)  └─ PlayAgain (Button){'\n'}
            {'   '}├─ PausePanel    <span className="dim">(Control, visible off, Process Mode = Always)</span>{'\n'}
            {'   '}│  └─ Dim + CenterContainer → VBoxContainer{'\n'}
            {'   '}│     └─ Resume / Restart / Menu / Settings (Buttons){'\n'}
            {'   '}└─ SettingsPanel <span className="dim">(Control, visible off, Process Mode = Always)</span>{'\n'}
            {'      '}└─ Dim + CenterContainer → VBox{'\n'}
            {'         '}└─ SoundCheck / HapticsCheck / MotionCheck (CheckButton) + Close (Button){'\n'}
            {'            '}<span className="dim">(MotionCheck is optional — Section 32; the code wires it only if present)</span></div>
          <table>
            <tbody>
              <tr><th>Node</th><th>Key properties to set</th></tr>
              <tr><td><code>Tray</code></td><td>Position <code>(0, 0)</code> — tray pieces use full screen coordinates.</td></tr>
              <tr><td><code>HUD</code></td><td>A <code>CanvasLayer</code> so the UI ignores the world shake and stays fixed.</td></tr>
              <tr><td><code>ScoreLabel</code></td><td>Large font, anchored top-center; horizontal align = center.</td></tr>
              <tr><td><code>GameOverPanel</code> / <code>PausePanel</code> / <code>SettingsPanel</code></td><td>Anchor <strong>Full Rect</strong>; <strong>Visible</strong> off; overlays get a dim <code>ColorRect</code> background.</td></tr>
              <tr><td><code>PausePanel</code> / <code>SettingsPanel</code></td><td><strong>Process Mode = Always</strong> so their buttons work while <code>get_tree().paused</code> is true.</td></tr>
            </tbody>
          </table>
          <h3>piece.tscn — one draggable piece</h3>
          <div className="arch-diagram">
            Piece <span className="dim">(Node2D) — script: Piece.gd</span>{'\n'}
            <span className="dim"># No children needed — Piece draws itself in _draw().</span></div>
          <p>
            That's deliberately minimal: a piece is just a script that draws its <code>cells</code>. All
            the visuals come from <code>_draw()</code>, so there are no child nodes to manage.
          </p>
          <h3>menu.tscn — the title screen</h3>
          <div className="arch-diagram">
            Menu <span className="dim">(Control, Full Rect) — script: Menu.gd</span>{'\n'}
            └─ CenterContainer <span className="dim">(Full Rect)</span>{'\n'}
            {'   '}└─ VBoxContainer{'\n'}
            {'      '}├─ Label "BLOCK BLAST" <span className="dim">(big title font)</span>{'\n'}
            {'      '}├─ BestLabel (Label){'\n'}
            {'      '}├─ Play (Button){'\n'}
            {'      '}└─ Daily (Button)</div>
          <h3>sfx.tscn — the sound autoload</h3>
          <div className="arch-diagram">
            Sfx <span className="dim">(Node) — script: Sfx.gd</span>{'\n'}
            ├─ Pick     <span className="dim">(AudioStreamPlayer) → audio/pick.wav</span>{'\n'}
            ├─ Place    <span className="dim">(AudioStreamPlayer) → audio/place.wav</span>{'\n'}
            ├─ Clear    <span className="dim">(AudioStreamPlayer) → audio/clear.wav</span>{'\n'}
            └─ GameOver <span className="dim">(AudioStreamPlayer) → audio/over.wav</span></div>
          <h3>Autoloads &amp; main scene (Project Settings)</h3>
          <table>
            <tbody>
              <tr><th>Setting</th><th>Value</th></tr>
              <tr><td>Autoload <code>GameState</code></td><td><code>res://scripts/GameState.gd</code></td></tr>
              <tr><td>Autoload <code>Sfx</code></td><td><code>res://scenes/sfx.tscn</code></td></tr>
              <tr><td>Main Scene</td><td><code>res://scenes/menu.tscn</code></td></tr>
              <tr><td>Display → Window</td><td><code>1080×1920</code>, stretch <code>canvas_items</code>, aspect <code>expand</code>, portrait</td></tr>
            </tbody>
          </table>
          <Note>
            <strong>Names must match the code.</strong> The scripts reach into the tree with paths like{' '}
            <code>$HUD/ScoreLabel</code> and <code>get_node("CenterContainer/VBoxContainer/PlayAgain")</code>.
            If a node is renamed or nested differently, those lookups return <code>null</code> and you'll
            see "Cannot call method on a null value." Match these trees exactly and the lookups just work.
          </Note>
        </section>

        <hr />

        {/* SECTION 37 (s40) — THEMING & FONTS */}
        <section className="section" id="s40" ref={setRef('s40')}>
          <h2><span className="section-num">37</span>Theming &amp; Fonts</h2>
          <p>
            The default Godot UI font is plain. A <strong>Theme</strong> resource lets you restyle every UI
            node at once — fonts, sizes, colors, button looks — and a custom font instantly makes the game
            feel designed. This is optional polish, but high-impact for the effort.
          </p>
          <h3>Create a Theme</h3>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Make a ui/ folder and the resource</div>
                <div className="tl-desc">
                  In the FileSystem dock, right-click <code>res://</code> →{' '}
                  <strong>Create New → Folder…</strong> → <code>ui</code>. Then right-click the new{' '}
                  <code>ui</code> folder → <strong>Create New → Resource…</strong>. A type picker opens —
                  type <code>Theme</code> in its search box, select <strong>Theme</strong>, click{' '}
                  <strong>Create</strong>, and save it as <code>main_theme.tres</code>.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Add a custom font</div>
                <div className="tl-desc">
                  Drag a <code>.ttf</code> or <code>.otf</code> file into the FileSystem dock to import it
                  (free game fonts abound — a rounded display font suits this game). Now{' '}
                  <strong>double-click <code>main_theme.tres</code></strong> — the{' '}
                  <strong>Theme editor</strong> opens in the bottom panel where the Output log usually sits.
                  In the Inspector on the right you'll see <strong>Default Font</strong>: click its dropdown →{' '}
                  <strong>Load</strong> → pick your font file. Set <strong>Default Font Size</strong> to
                  something like <code>48</code> (this game renders at 1080 × 1920, so 16px type is
                  microscopic).
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">3</div>
              <div className="tl-content">
                <div className="tl-title">Apply it to your UI roots</div>
                <div className="tl-desc">
                  Open <code>menu.tscn</code>, select the <code>Menu</code> root, and in the Inspector find
                  the <strong>Theme</strong> property (under the <strong>Control</strong> group). Drag{' '}
                  <code>main_theme.tres</code> from the FileSystem dock onto that slot. Every Control{' '}
                  <em>inside</em> Menu now inherits it — you don't set it per label. Do the same for{' '}
                  <code>GameOverPanel</code> in <code>game.tscn</code>.
                </div>
              </div>
            </div>
          </div>
          <h3>Style buttons with a StyleBoxFlat</h3>
          <p>
            A <strong>StyleBox</strong> is the background drawn behind a UI node — it's how you get rounded,
            colored buttons instead of Godot's flat grey default. In the <strong>Theme editor</strong>{' '}
            (double-click <code>main_theme.tres</code>), click the <strong>+</strong> next to{' '}
            <strong>Type</strong> and add <code>Button</code>. Switch to the <strong>StyleBox</strong> tab,
            and for each of the <code>normal</code>, <code>hover</code>, and <code>pressed</code> entries
            click the dropdown → <strong>New StyleBoxFlat</strong> → then click it to expand and set{' '}
            <strong>BG Color</strong> and <strong>Corner Radius</strong> (set all four corners to ~16). Give{' '}
            <code>hover</code> a slightly lighter color and <code>pressed</code> a slightly darker one so the
            button visibly reacts. If that's more clicking than you want, do the same thing in code for a
            single button:
          </p>
          <CodePre>{`func _style_button(b: Button, color: Color) -> void:
	var sb := StyleBoxFlat.new()
	sb.bg_color = color
	sb.set_corner_radius_all(16)
	sb.content_margin_left = 28
	sb.content_margin_right = 28
	sb.content_margin_top = 14
	sb.content_margin_bottom = 14
	b.add_theme_stylebox_override("normal", sb)
	var hover := sb.duplicate()
	hover.bg_color = color.lightened(0.12)
	b.add_theme_stylebox_override("hover", hover)`}</CodePre>
          <h3>Per-node font overrides</h3>
          <p>
            For one-off tweaks (a giant title, a small subtitle) you can override a single property without
            touching the theme:
          </p>
          <CodePre>{`title.add_theme_font_size_override("font_size", 96)
title.add_theme_color_override("font_color", Color.html("#F5EFE3"))
subtitle.add_theme_font_size_override("font_size", 36)`}</CodePre>
          <h3>A cohesive look on a budget</h3>
          <table>
            <tbody>
              <tr><th>Element</th><th>Quick win</th></tr>
              <tr><td>Background</td><td>A dark, slightly warm color (e.g. <code>#1A0F18</code>) makes bright blocks pop.</td></tr>
              <tr><td>Title</td><td>One bold display font, large, with a subtle shadow.</td></tr>
              <tr><td>Buttons</td><td>Rounded, generous padding, a single accent color + a lighter hover.</td></tr>
              <tr><td>Score</td><td>Big, monospace-ish, high contrast, centered at the top.</td></tr>
            </tbody>
          </table>
          <Note kind="warn">
            <strong>Mind font licenses.</strong> Like art and audio, fonts have licenses. Use ones licensed
            for app distribution (the SIL Open Font License is common and permissive). Keep a note of each
            font's license with your other asset records.
          </Note>
        </section>

        <hr />

        {/* SECTION 38 (s41) — MUSIC & AUDIO BUSES */}
        <section className="section" id="s41" ref={setRef('s41')}>
          <h2><span className="section-num">38</span>Music &amp; Audio Buses</h2>
          <p>
            Sound effects give feedback; <strong>music</strong> sets mood. Adding a calm background loop and
            organizing audio into <strong>buses</strong> (volume groups) lets you offer separate music and
            SFX volume — a feature players appreciate.
          </p>
          <h3>Add looping background music</h3>
          <p>
            Add an <code>AudioStreamPlayer</code> named <code>Music</code> (an autoload, or a node in the
            menu/game). Drag in an <code>.ogg</code> track and enable looping on the import: select the file
            in FileSystem → <strong>Import</strong> tab → check <strong>Loop</strong> → Reimport.
          </p>
          <CodePre>{`# A small Music autoload
extends Node
@onready var player: AudioStreamPlayer = $Player

func play(track: AudioStream) -> void:
	if player.stream == track and player.playing:
		return
	player.stream = track
	player.bus = "Music"
	player.play()

func fade_out(seconds: float = 0.8) -> void:
	var t := create_tween()
	t.tween_property(player, "volume_db", -40.0, seconds)
	t.tween_callback(player.stop)`}</CodePre>
          <h3>Set up audio buses</h3>
          <p>
            A <strong>bus</strong> is just a volume group that audio flows through on its way to the
            speakers. Making two of them means one slider can turn down all sound effects without touching
            the music.
          </p>
          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot">1</div>
              <div className="tl-content">
                <div className="tl-title">Open the Audio panel</div>
                <div className="tl-desc">
                  At the very bottom of the Godot window is a row of tabs — <strong>Output</strong>,{' '}
                  <strong>Debugger</strong>, <strong>Audio</strong>, and so on. Click <strong>Audio</strong>.
                  You'll see a single vertical strip labelled <strong>Master</strong>: that's the one bus
                  every sound uses by default.
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot">2</div>
              <div className="tl-content">
                <div className="tl-title">Add the two buses</div>
                <div className="tl-desc">
                  Click <strong>Add Bus</strong> (top-left of that panel). A new strip named{' '}
                  <code>New Bus</code> appears — double-click its name and rename it to <code>Music</code>.
                  Click <strong>Add Bus</strong> again and name the second one <code>SFX</code>. Spelling and
                  capitalisation matter: the code looks them up by these exact strings. At the bottom of each
                  new strip is a <strong>Send</strong> dropdown — leave it on <code>Master</code>, which means
                  "flow into Master when you're done."
                </div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot done">3</div>
              <div className="tl-content">
                <div className="tl-title">Point each player at its bus</div>
                <div className="tl-desc">
                  Open <code>scenes/sfx.tscn</code>, select <code>Pick</code>, and in the Inspector set the{' '}
                  <strong>Bus</strong> property to <code>SFX</code>. Repeat for <code>Place</code>,{' '}
                  <code>Clear</code>, and <code>GameOver</code>. Set the music player's Bus to{' '}
                  <code>Music</code> (the script above already does this in code with{' '}
                  <code>player.bus = "Music"</code>, so either way works).
                </div>
              </div>
            </div>
          </div>
          <MermaidDiagram theme="default" chart={`graph TB
  PICK["Pick / Place / Clear / Over"] --> SFX["SFX bus"]
  MUSIC["Music player"] --> MUS["Music bus"]
  SFX --> MASTER["Master bus"]
  MUS --> MASTER
  MASTER --> OUT["Speakers"]`} />
          <h3>Volume sliders</h3>
          <p>
            With buses in place, a settings slider can control a whole group's volume. Godot uses decibels;
            convert a 0–1 slider value with <code>linear_to_db</code>:
          </p>
          <CodePre>{`func _on_music_slider_changed(value: float) -> void:
	var idx := AudioServer.get_bus_index("Music")
	AudioServer.set_bus_volume_db(idx, linear_to_db(value))

func _on_sfx_slider_changed(value: float) -> void:
	var idx := AudioServer.get_bus_index("SFX")
	AudioServer.set_bus_volume_db(idx, linear_to_db(value))`}</CodePre>
          <p>
            <code>linear_to_db(0)</code> is silence and <code>linear_to_db(1)</code> is full volume, so a
            slider from 0 to 1 maps naturally. Save the chosen values in <code>GameState</code> like the
            other settings.
          </p>
          <Note>
            <strong>Duck the music on big moments (optional).</strong> Briefly lowering the Music bus when a
            clear sound plays — "ducking" — makes effects punch through. A quick tween on the Music bus
            volume down and back up does it. Nice-to-have, not essential.
          </Note>
        </section>

        <hr />

        {/* SECTION 39 (s42) — STATS & PROGRESSION */}
        <section className="section" id="s42" ref={setRef('s42')}>
          <h2><span className="section-num">39</span>Stats &amp; Progression</h2>
          <p>
            Lightweight stats give players a reason to keep coming back and a sense of progress beyond a
            single score. They're easy to add on top of the <code>GameState</code> save you already have.
          </p>
          <h3>Track a few meaningful numbers</h3>
          <CodePre>{`# add to scripts/GameState.gd
var games_played: int = 0
var total_lines: int = 0
var total_score: int = 0

func record_game(final_score: int, lines_this_game: int) -> void:
	games_played += 1
	total_score += final_score
	total_lines += lines_this_game
	save()      # include these in your JSON dictionary too`}</CodePre>
          <p>
            Call <code>GameState.record_game(...)</code> from <code>_show_game_over()</code>, tracking lines
            cleared this game with a per-run counter you increment in <code>_apply_clear_score</code>.
          </p>
          <h3>Show them on the menu</h3>
          <CodePre>{`# in scripts/Menu.gd
func _ready() -> void:
	# ...existing...
	$Stats/Games.text = "Games: %d" % GameState.games_played
	$Stats/Lines.text = "Lines cleared: %d" % GameState.total_lines
	var avg := 0
	if GameState.games_played > 0:
		avg = GameState.total_score / GameState.games_played
	$Stats/Average.text = "Average score: %d" % avg`}</CodePre>
          <h3>Simple milestones</h3>
          <p>
            You can layer on a few "milestones" without a full achievements system — just check thresholds
            and show a one-time toast:
          </p>
          <CodePre>{`const MILESTONES := [1000, 5000, 10000, 25000]

func _check_milestones(score: int) -> void:
	for m in MILESTONES:
		if score >= m and not GameState.reached.has(m):
			GameState.reached.append(m)
			GameState.save()
			_toast("Milestone: %d points!" % m)`}</CodePre>
          <table>
            <tbody>
              <tr><th>Stat</th><th>Why it motivates</th></tr>
              <tr><td>Best score</td><td>The headline goal — beat your record.</td></tr>
              <tr><td>Games played</td><td>Shows investment; nudges "one more game."</td></tr>
              <tr><td>Total lines cleared</td><td>A number that only ever grows — satisfying.</td></tr>
              <tr><td>Average score</td><td>A skill signal that improves as you learn.</td></tr>
            </tbody>
          </table>
          <Note>
            <strong>Keep stats honest and local.</strong> All of this lives in the device's{' '}
            <code>user://</code> save — no servers, no accounts, no privacy concerns. That's perfect for a
            first game: meaningful progression with zero backend to build or maintain.
          </Note>
        </section>

        <hr />

        {/* SECTION 28 — BUG HUNT */}
        <section className="section" id="s28" ref={setRef('s28')}>
          <h2><span className="section-num">?</span>Bug Hunt</h2>
          <p>
            These are the specific bugs you're most likely to hit building <em>this</em> game, with the
            fix for each.
          </p>
          <h4>Pieces place one cell off from where I drop them</h4>
          <p>
            Your anchor math is using a corner instead of a cell center. Use the center of the piece's
            first cell in <code>_current_anchor()</code> (the <code>+ Vector2(half, half)</code> term) and
            make sure you subtract the Board's <code>position</code> before <code>px_to_cell</code>.
          </p>
          <h4>Rows and columns swapped (board looks transposed)</h4>
          <p>
            You mixed up <code>x</code> and <code>y</code> somewhere. The rule never changes:{' '}
            <strong>x is the column, y is the row</strong>, and you index the grid as{' '}
            <code>grid[y][x]</code>. Grep your code for <code>grid[</code> and confirm every access is{' '}
            <code>[y][x]</code>.
          </p>
          <h4>A simultaneous row+column clear only clears one of them</h4>
          <p>
            You're clearing during the scan instead of after. Use the two-pass approach: find all full
            rows and columns first, <em>then</em> clear them (see the clearing section).
          </p>
          <h4>Game over fires the moment I empty the tray</h4>
          <p>
            You checked game over before refilling. In <code>_after_placement()</code>, deal the new tray{' '}
            <em>first</em>, then test <code>_is_game_over()</code> against the fresh pieces.
          </p>
          <h4>Crash: "Invalid access" / "Object is null" after placing</h4>
          <p>
            You read a property off the dragged piece after freeing it. Capture values like{' '}
            <code>cells.size()</code> into a variable before <code>queue_free()</code>, and set{' '}
            <code>dragging = null</code> at the end of the drop handler.
          </p>
          <h4>Dragging doesn't work when testing on the computer</h4>
          <p>
            Enable <strong>Project Settings → Input Devices → Pointing → Emulate Touch From Mouse</strong>.
            Without it, mouse clicks aren't delivered as touch events.
          </p>
          <h4>The dragged piece hides behind the board</h4>
          <p>
            Its draw order is too low. On pick-up, call <code>move_child(dragging, get_child_count() - 1)</code>{' '}
            (or reparent it onto <code>Game</code>) so it renders on top.
          </p>
          <div className="card">
            <h4>Your debugging toolkit</h4>
            <p style={{ marginBottom: 0 }}>
              <code>print()</code> the values you're unsure about (anchor cell, can_place result, tray
              contents) and watch the <strong>Output</strong> panel. For crashes, read the top line of the{' '}
              <strong>Debugger</strong> panel — it names the file and line. Most bugs in this game are
              off-by-one grid math; a couple of well-placed prints pinpoint them fast.
            </p>
          </div>
        </section>

        <hr />

        {/* SECTION 29 — EXTENDING THE GAME */}
        <section className="section" id="s29" ref={setRef('s29')}>
          <h2><span className="section-num">+</span>Extending the Game</h2>
          <p>
            You have a complete, shippable game. When you want to keep going, here are natural next features
            — roughly easiest to hardest — and where each one hooks into the code you've built.
          </p>
          <table>
            <tbody>
              <tr><th>Feature</th><th>How to approach it</th></tr>
              <tr><td><strong>Combo streak text</strong></td><td>The streak multiplier from the scoring section, plus a "Combo x3!" pop-up reusing the score-popup code.</td></tr>
              <tr><td><strong>Settings (sound on/off)</strong></td><td>A bool in <code>GameState</code>, saved with the best score; gate <code>Sfx._play</code> on it.</td></tr>
              <tr><td><strong>Themes / color palettes</strong></td><td>Swap the <code>PALETTE</code> and board colors based on a chosen theme; save the choice.</td></tr>
              <tr><td><strong>Undo last move</strong></td><td>Snapshot the grid + tray before each placement; one level of undo is a single stored copy.</td></tr>
              <tr><td><strong>Save the in-progress game</strong></td><td>Serialize the grid (colors as hex) and tray shapes to JSON in <code>user://</code>, like the high score.</td></tr>
              <tr><td><strong>Daily challenge</strong></td><td>Seed the random generator with today's date so everyone gets the same pieces (<code>seed(...)</code>).</td></tr>
              <tr><td><strong>Game Center leaderboard</strong></td><td>Requires a plugin/native integration; a meaningful next project once you're comfortable.</td></tr>
            </tbody>
          </table>
          <h3>A note on monetization</h3>
          <p>
            Ads and in-app purchases are out of scope for a first game and add real complexity (SDKs,
            native plugins, App Store review rules, privacy disclosures). If you pursue them later, look at
            community Godot iOS plugins for AdMob/StoreKit — but ship the fun game first. A polished free
            game with a high-score chase is a complete, satisfying product on its own.
          </p>
          <Note>
            <strong>Ship before you extend.</strong> The biggest skill jump in game development is{' '}
            <em>finishing</em>. Get this version onto TestFlight, let a few friends play, then add one
            feature at a time. A shipped simple game beats an unshipped ambitious one every time.
          </Note>
        </section>

        <hr />

        {/* SECTION 30 — SOURCE RECAP */}
        <section className="section" id="s30" ref={setRef('s30')}>
          <h2><span className="section-num">✦</span>Source Recap</h2>
          <p>
            Here's the whole project at a glance — every file and what it owns. If you got lost anywhere,
            this map shows where each responsibility lives.
          </p>
          <div className="arch-diagram">
            BlockBlast/{'\n'}
            ├─ scenes/{'\n'}
            │  ├─ menu.tscn      <span className="dim"># title screen (main scene)</span>{'\n'}
            │  ├─ game.tscn      <span className="dim"># Game + Board + Tray + HUD</span>{'\n'}
            │  ├─ piece.tscn     <span className="dim"># one draggable piece</span>{'\n'}
            │  └─ sfx.tscn       <span className="dim"># Sfx autoload scene (4 players)</span>{'\n'}
            ├─ scripts/{'\n'}
            │  ├─ GameState.gd   <span className="dim"># autoload: score, best, save/load</span>{'\n'}
            │  ├─ Sfx.gd         <span className="dim"># autoload: play_pick/place/clear/over</span>{'\n'}
            │  ├─ Pieces.gd      <span className="dim"># class_name: shape catalog + random_piece()</span>{'\n'}
            │  ├─ Piece.gd       <span className="dim"># one piece: cells, color, draw, size</span>{'\n'}
            │  ├─ Board.gd       <span className="dim"># grid data, draw, can_place, clear, ghost</span>{'\n'}
            │  ├─ Game.gd        <span className="dim"># rules, drag/drop, tray, score, game over</span>{'\n'}
            │  └─ Menu.gd        <span className="dim"># menu: best label + Play</span>{'\n'}
            └─ audio/            <span className="dim"># your .wav sound effects</span>
          </div>
          <h3>The responsibilities, in one table</h3>
          <table>
            <tbody>
              <tr><th>File</th><th>Owns</th></tr>
              <tr><td><code>GameState.gd</code></td><td>The score and best; saving/loading to <code>user://</code>.</td></tr>
              <tr><td><code>Pieces.gd</code></td><td>The shape catalog, palette, and random piece generation.</td></tr>
              <tr><td><code>Piece.gd</code></td><td>One piece's data and how it draws at any cell size.</td></tr>
              <tr><td><code>Board.gd</code></td><td>The 8×8 grid: storage, drawing, placement checks, clearing, the ghost preview.</td></tr>
              <tr><td><code>Game.gd</code></td><td>The conductor: input, drag &amp; drop, the tray, scoring, refill, game over, juice.</td></tr>
              <tr><td><code>Sfx.gd</code> / <code>Menu.gd</code></td><td>Sound playback / the title screen.</td></tr>
            </tbody>
          </table>
          <h3>What you learned building this</h3>
          <ul>
            <li>Modeling a game as plain data (a 2D grid) separate from how it's drawn.</li>
            <li>Touch drag-and-drop with a snap-and-ghost preview.</li>
            <li>Grid algorithms: placement validation, line clearing, and "can it fit anywhere?".</li>
            <li>Signals to decouple systems (the board announces clears; the game reacts).</li>
            <li>Persistence, scene switching, autoloads, juice, and the full iOS → TestFlight pipeline.</li>
          </ul>
          <p>
            Those skills transfer directly to the next puzzle game you build — 2048, a match-3, a memory
            game. You now know how to take a game idea from an empty Godot project all the way to a build on
            your phone. Go make the next one.
          </p>
          <p className="finished-marker">★ A complete Block Blast clone — modeled, drawn, juiced, and shipped to TestFlight.</p>
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
