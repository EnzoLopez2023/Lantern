import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Decision framework',        icon: '🧭' },
  { id: 's2',  num: '2',  title: 'Learning prerequisites',    icon: '🎓' },
  { id: 's3',  num: '3',  title: 'Core architecture',         icon: '🏗️' },
  { id: 's4',  num: '4',  title: 'The six main routes',       icon: '🛣️' },
  { id: 's5',  num: '5',  title: 'Other 2D options',          icon: '🎨' },
  { id: 's6',  num: '6',  title: '3D options',                icon: '🧊' },
  { id: 's7',  num: '7',  title: 'Advanced approaches',       icon: '🦀' },
  { id: 's8',  num: '8',  title: 'Mobile & touch input',      icon: '📱' },
  { id: 's9',  num: '9',  title: 'Audio handling',            icon: '🔊' },
  { id: 's10', num: '10', title: 'Save state & persistence',  icon: '💾' },
  { id: 's11', num: '11', title: 'Multiplayer & networking',  icon: '🌐' },
  { id: 's12', num: '12', title: 'Deployment & hosting',      icon: '🚀' },
  { id: 's13', num: '13', title: 'WebGPU — looking forward',  icon: '🔮' },
  { id: 's14', num: '14', title: 'Decision matrix',           icon: '📊' },
  { id: 's15', num: '15', title: 'Learning paths',            icon: '🗺️' },
  { id: 's16', num: 'A',  title: 'Appendices',                icon: '📚' },
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

export default function WebGameDevGuide() {
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
              <path d="M8 10h12v8H8z" fill="white" opacity="0.9" />
              <circle cx="11" cy="14" r="1.5" fill="#5C2A4A" />
              <circle cx="17" cy="14" r="1.5" fill="#5C2A4A" />
            </svg>
            <span className="sidebar-title">Web Game Dev</span>
          </div>
          <div className="sidebar-sub">Pick the right stack · 2D + 3D</div>
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
          <div className="hero-tag">🎮 Web Game Dev Guide · 2026</div>
          <h1>Building<br />Web Games</h1>
          <p>
            A comprehensive tech-stack guide for developers who can write JS/TS and want to build games that run in a browser. Pick the right tool for the right game, with enough detail to actually start building. <strong style={{ color: '#C77AA0' }}>2D + 3D</strong>, hobbyist to commercial, with a brief detour into native engines.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">16</span><span className="hero-stat-label">Chapters</span></div>
            <div className="hero-stat"><span className="hero-stat-val">12+</span><span className="hero-stat-label">Frameworks</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2D + 3D</span><span className="hero-stat-label">Coverage</span></div>
            <div className="hero-stat"><span className="hero-stat-val">&lt;10KB</span><span className="hero-stat-label">Min bundle</span></div>
          </div>
        </div>

        {/* SECTION 1 — DECISION FRAMEWORK */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>Decision framework</h2>

          <h3>Four questions before you pick a tool</h3>
          <table>
            <tbody>
              <tr><th>Question</th><th>Why it matters</th></tr>
              <tr><td><strong>What kind of game?</strong></td><td>A puzzle game has different needs than an MMO.</td></tr>
              <tr><td><strong>2D or 3D?</strong></td><td>3D needs a real renderer (WebGL/WebGPU). 2D can use Canvas2D.</td></tr>
              <tr><td><strong>Solo or networked?</strong></td><td>Multiplayer requires server architecture, not just a client choice.</td></tr>
              <tr><td><strong>Shipping or learning?</strong></td><td>If you're learning, pick the most transparent stack. If shipping, pick what minimizes time to market.</td></tr>
            </tbody>
          </table>

          <h3>Quick decision tree</h3>
          <MermaidDiagram theme="default" chart={`flowchart TD
    A[Start: I want to build a web game] --> B{2D or 3D?}
    B -->|2D| C{How complex?}
    B -->|3D| D{Engine experience?}
    C -->|Simple puzzle/turn-based| E[Vanilla JS + Canvas<br/>or TypeScript + Vite]
    C -->|Smooth animations,<br/>many sprites| F[PixiJS]
    C -->|Complex platformer<br/>or arcade game| G[Phaser or Kaplay]
    C -->|Heavy UI + game board| H[React + PixiJS]
    C -->|Console-style 2D| I[Godot HTML5 export]
    D -->|None| J[Three.js or Babylon.js]
    D -->|Want a real engine| K[Godot, PlayCanvas,<br/>or Unity WebGL]
    D -->|Rust/systems dev| L[Bevy + WASM]
    style E fill:#4a8b3b,color:#fff
    style F fill:#4a8b3b,color:#fff
    style G fill:#4a8b3b,color:#fff
    style J fill:#4a8b3b,color:#fff`} />

          <h3>"I want to ship in 2 months" rule of thumb</h3>
          <ul>
            <li><strong>Browser-only, 2D, single-player</strong> → Phaser or PixiJS + TypeScript + Vite.</li>
            <li><strong>Browser-only, 3D, single-player</strong> → Babylon.js or Three.js, or Godot HTML5.</li>
            <li><strong>Cross-platform (web + mobile + desktop)</strong> → Godot or Unity. Unity has the better mobile/console pipeline, Godot has the smaller bundle.</li>
            <li><strong>Multiplayer-first</strong> → Colyseus or PartyKit on the backend, anything 2D/3D on the front.</li>
          </ul>
        </section>

        {/* SECTION 2 — LEARNING PREREQUISITES */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Learning prerequisites</h2>

          <h3>Universal (all stacks)</h3>
          <ol>
            <li><strong>JavaScript / TypeScript fundamentals</strong> — closures, async/await, destructuring, modules. For TS: interfaces, generics, type narrowing.</li>
            <li><strong>HTML + CSS basics</strong> — for the page that hosts your game canvas.</li>
            <li><strong>ES Modules</strong> — <code>import</code>/<code>export</code>, why bundlers exist.</li>
            <li><strong>DevTools</strong> — Chrome DevTools Performance tab, memory profiler, console.</li>
            <li><strong>Git</strong> — for source control and deployment.</li>
          </ol>

          <h3>Math you actually need</h3>
          <MermaidDiagram theme="default" chart={`graph LR
    A[Math Topic] --> B[Used For]
    A1[Trigonometry<br/>sin/cos/atan2] --> B1[Rotation, projectiles,<br/>orbital motion]
    A2[Vectors<br/>add, scale, normalize, dot] --> B2[Movement, physics,<br/>collision direction]
    A3[Linear algebra<br/>matrices, transforms] --> B3[3D rendering,<br/>camera systems]
    A4[Easing functions] --> B4[Animation,<br/>juice and polish]
    A5[Modular arithmetic] --> B5[Tile grids, wrapping,<br/>hex coordinates]`} />

          <p>For 2D games, <strong>trig and vectors are 80% of what you need</strong>. For 3D, matrices and quaternions matter, but most engines hide them.</p>

          <h3>Concepts to learn before code</h3>
          <ul>
            <li><strong>Game loop</strong> — the heartbeat of every game</li>
            <li><strong>State machines</strong> — managing menu → play → pause → game over</li>
            <li><strong>Delta time</strong> — making things move at the same speed regardless of frame rate</li>
            <li><strong>Coordinate systems</strong> — screen vs world space, Y-axis direction differs per engine</li>
            <li><strong>Asset pipeline</strong> — sprites, atlases, audio formats, loading</li>
          </ul>
        </section>

        {/* SECTION 3 — CORE ARCHITECTURE */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Core architecture concepts</h2>

          <h3>The game loop — heartbeat of every game</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
    participant Browser
    participant GameLoop
    participant Input
    participant Update
    participant Render
    Browser->>GameLoop: requestAnimationFrame
    GameLoop->>Input: poll keyboard/mouse/touch
    Input-->>GameLoop: input state
    GameLoop->>Update: update(deltaTime)
    Note over Update: physics, AI,<br/>collision, timers
    Update-->>GameLoop: new state
    GameLoop->>Render: render(state)
    Render-->>Browser: draw to canvas
    Browser->>GameLoop: next frame`} />

          <h4>The minimal game loop in vanilla JS</h4>
          <CodePre>{`let lastTime = 0;

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // in seconds
    lastTime = currentTime;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);`}</CodePre>

          <p><strong>The two rules of game loops:</strong></p>
          <ol>
            <li><strong>Always use <code>deltaTime</code></strong> — otherwise the game runs faster on 144Hz monitors than 60Hz.</li>
            <li><strong>Separate update from render</strong> — for physics determinism, fixed timestep is often best (see "Fix Your Timestep" by Glenn Fiedler).</li>
          </ol>

          <h4>Fixed timestep variant (deterministic physics)</h4>
          <CodePre>{`const FIXED_DT = 1 / 60; // 60 physics ticks per second
let accumulator = 0;
let lastTime = performance.now();

function gameLoop(currentTime) {
    const frameTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    accumulator += Math.min(frameTime, 0.25); // cap to prevent spiral of death

    while (accumulator >= FIXED_DT) {
        update(FIXED_DT);
        accumulator -= FIXED_DT;
    }

    render(accumulator / FIXED_DT); // interpolation factor for smoothness
    requestAnimationFrame(gameLoop);
}`}</CodePre>

          <h3>Entity-Component-System (ECS) pattern</h3>
          <p>For complex games, ECS becomes invaluable. Instead of class hierarchies, you have:</p>
          <ul>
            <li><strong>Entities</strong> — just an ID</li>
            <li><strong>Components</strong> — pure data (Position, Velocity, Sprite)</li>
            <li><strong>Systems</strong> — logic that runs on entities with specific components</li>
          </ul>

          <CodePre>{`// Naive ECS sketch
const positions = new Map();   // entityId -> {x, y}
const velocities = new Map();  // entityId -> {dx, dy}
const sprites = new Map();     // entityId -> {image, frame}

function movementSystem(dt) {
    for (const [id, vel] of velocities) {
        const pos = positions.get(id);
        if (!pos) continue;
        pos.x += vel.dx * dt;
        pos.y += vel.dy * dt;
    }
}`}</CodePre>

          <p>Libraries like <strong>bitECS</strong> or <strong>miniplex</strong> give you this with much better ergonomics and performance.</p>
        </section>

        {/* SECTION 4 — THE SIX MAIN ROUTES */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The six main routes</h2>

          <h3>Route 1: Vanilla JS + HTML5 Canvas</h3>
          <p><strong>Best for:</strong> Learning fundamentals, jam games, puzzle/turn-based games, prototypes.<br />
          <strong>Avoid for:</strong> Games needing 60fps with hundreds of sprites, complex animations, mobile touch.</p>

          <h4>The absolute minimum</h4>
          <CodePre>{`<!DOCTYPE html>
<html>
<head><title>My Game</title></head>
<body>
    <canvas id="game" width="800" height="600"></canvas>
    <script type="module" src="game.js"></script>
</body>
</html>`}</CodePre>

          <p>You need a local server (modules don't load via <code>file://</code>):</p>
          <CodePre>{`npx serve .
# or
python -m http.server 8000`}</CodePre>

          <h4>A working pong-ish snippet</h4>
          <CodePre>{`const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const player = { x: 20, y: 250, w: 10, h: 100, speed: 300 };
const ball = { x: 400, y: 300, dx: 200, dy: 150, r: 8 };
const keys = new Set();

window.addEventListener('keydown', e => keys.add(e.key));
window.addEventListener('keyup', e => keys.delete(e.key));

function update(dt) {
    if (keys.has('ArrowUp')) player.y -= player.speed * dt;
    if (keys.has('ArrowDown')) player.y += player.speed * dt;
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));

    ball.x += ball.dx * dt;
    ball.y += ball.dy * dt;
    if (ball.y < 0 || ball.y > canvas.height) ball.dy *= -1;
    if (ball.x < 0 || ball.x > canvas.width) ball.dx *= -1;
}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
}

let last = 0;
function loop(t) {
    const dt = (t - last) / 1000;
    last = t;
    update(dt);
    render();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);`}</CodePre>

          <h4>Strengths & weaknesses</h4>
          <table>
            <tbody>
              <tr><th>Strengths</th><th>Weaknesses</th></tr>
              <tr><td>Zero dependencies. Any browser, no build step.</td><td>No sprite batching — Canvas2D draws one sprite at a time. Slow above ~1000 sprites.</td></tr>
              <tr><td>Maximum transparency — every pixel is yours.</td><td>No texture atlases out of the box. You manage that yourself.</td></tr>
              <tr><td>Excellent learning tool.</td><td>Manual everything — scene management, asset loading, input mapping.</td></tr>
            </tbody>
          </table>

          <h3>Route 2: TypeScript + Vite</h3>
          <p><strong>Best for:</strong> Same as Route 1 but you want maintainability, autocomplete, and fewer bugs. <strong>The single biggest productivity win for a hobby game project.</strong></p>

          <p>Once your game has more than ~5 files, vanilla JS becomes painful: refactoring is dangerous (no rename support), state shapes drift across files, "what does this function expect?" requires reading the source, imports get tangled.</p>

          <p>TypeScript gives you autocomplete, refactor tools, and catches whole classes of bugs at edit time. Vite gives you a dev server with <strong>hot module reload</strong> — change a file, see the result instantly without losing game state.</p>

          <h4>Setup</h4>
          <CodePre>{`npm init -y
npm install -D typescript vite`}</CodePre>

          <CodePre>{`{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "typecheck": "tsc --noEmit"
  }
}`}</CodePre>

          <h4>Typed game state — the real win</h4>
          <CodePre>{`interface Vec2 { x: number; y: number; }

interface Entity {
    id: number;
    pos: Vec2;
    vel: Vec2;
    sprite: string;
    health: number;
}

interface GameState {
    entities: Map<number, Entity>;
    player: Entity;
    score: number;
    elapsed: number;
}

function update(state: GameState, dt: number): void {
    for (const entity of state.entities.values()) {
        entity.pos.x += entity.vel.x * dt;
        entity.pos.y += entity.vel.y * dt;
    }
    state.elapsed += dt;
}`}</CodePre>

          <p>Now if you change <code>Entity</code> to add a new required field, TypeScript tells you everywhere that breaks. Transformative for a game with growing complexity.</p>

          <h3>Route 3: PixiJS</h3>
          <p><strong>Best for:</strong> 2D games needing smooth animations, particle effects, lots of sprites, retina-crisp rendering. The industry-standard 2D WebGL renderer for the browser.</p>

          <h4>What PixiJS gives you</h4>
          <ul>
            <li><strong>WebGL rendering with automatic batching</strong> — 10,000+ sprites at 60fps is realistic</li>
            <li><strong>Scene graph</strong> — parent/child transforms (rotate a ship and its turret follows)</li>
            <li><strong>Texture atlases</strong> — bundle 100 sprites into one image, draw them in one GPU call</li>
            <li><strong>Filters and blending modes</strong> — bloom, blur, color grading at the GPU level</li>
            <li><strong>Spritesheet animation</strong> — sequence frames with one API call</li>
            <li><strong>Text rendering with bitmap fonts</strong> — fast, crisp pixel text</li>
          </ul>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>PixiJS is a renderer, not a game engine.</strong> You still need to write: game loop, input handling, physics/collision, scene management, audio (Howler.js or the Web Audio API). This is intentional — it composes well with anything.</div>
          </div>

          <h4>Minimal scene</h4>
          <CodePre>{`import { Application, Assets, Sprite } from 'pixi.js';

const app = new Application();
await app.init({ width: 800, height: 600, backgroundColor: 0x1099bb, antialias: true });
document.body.appendChild(app.canvas);

const texture = await Assets.load('hero.png');
const hero = new Sprite(texture);
hero.anchor.set(0.5);
hero.x = 400;
hero.y = 300;
app.stage.addChild(hero);

app.ticker.add((ticker) => {
    hero.rotation += 0.05 * ticker.deltaTime;
});`}</CodePre>

          <h4>Spritesheet animation</h4>
          <CodePre>{`import { AnimatedSprite, Assets } from 'pixi.js';

const sheet = await Assets.load('hero-spritesheet.json');
const walkFrames = sheet.animations.walk;
const walker = new AnimatedSprite(walkFrames);
walker.animationSpeed = 0.15;
walker.loop = true;
walker.play();
app.stage.addChild(walker);`}</CodePre>

          <p>Create the spritesheet with <a href="https://www.codeandweb.com/texturepacker" target="_blank" rel="noreferrer">TexturePacker</a> or the free <a href="https://free-tex-packer.com/" target="_blank" rel="noreferrer">free-tex-packer</a>.</p>

          <h3>Route 4: React + PixiJS (hybrid UI + game)</h3>
          <p><strong>Best for:</strong> Games with significant UI (inventory, menus, dialogs, tooltips, HUD) alongside an action canvas. <strong>Pattern:</strong> React handles DOM-level UI, PixiJS handles the game world.</p>

          <p>Game UI in pure Canvas/Pixi is painful: building a scrollable list, dialog modals, dropdowns — all require reinvention. DOM handles all of these. The play area, where you need 60fps with hundreds of moving objects, is where you actually need the GPU.</p>

          <MermaidDiagram theme="default" chart={`graph TB
    subgraph DOM
        A[React Tree]
        A --> B[HUD: health, score, minimap]
        A --> C[Inventory Modal]
        A --> D[Settings Menu]
        A --> E[Pixi Canvas Component]
    end
    subgraph WebGL
        E --> F[PixiJS Stage]
        F --> G[Game World]
        F --> H[Entities]
        F --> I[Particles]
    end
    J[Game State<br/>Zustand/Redux/Jotai] -->|reads| A
    J -->|reads| F
    K[Game Loop] -->|writes| J`} />

          <h4>Imperative wrapper component (recommended at scale)</h4>
          <CodePre>{`import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

export function GameCanvas({ onReady }: { onReady: (app: Application) => void }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const app = new Application();
        let mounted = true;

        app.init({ width: 800, height: 600 }).then(() => {
            if (!mounted) return;
            ref.current?.appendChild(app.canvas);
            onReady(app);
        });

        return () => {
            mounted = false;
            app.destroy(true, { children: true });
        };
    }, []);

    return <div ref={ref} />;
}`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>@pixi/react at scale.</strong> The declarative <code>@pixi/react</code> library exposes Pixi as React components — convenient for small scenes, but at thousands of entities updating every frame, React's reconciler becomes the bottleneck. Use the imperative approach and let Pixi handle its own diffing.</div>
          </div>

          <h4>Rule of thumb</h4>
          <ul>
            <li><strong>HUD, menus, dialogs, settings</strong> → React + your favorite component library</li>
            <li><strong>Game world rendering</strong> → PixiJS, imperative</li>
            <li><strong>Cross-boundary state</strong> → Zustand or Jotai (simpler than Redux for games)</li>
          </ul>

          <h3>Route 5: Phaser (full 2D game framework)</h3>
          <p><strong>Best for:</strong> Platformers, top-down RPGs, arcade games, anything with classic 2D mechanics. Phaser is a full 2D game framework — not just a renderer.</p>

          <h4>What Phaser includes</h4>
          <ul>
            <li>Renderer (WebGL or Canvas2D)</li>
            <li><strong>Scene management</strong> (menu, play, game-over, with transitions)</li>
            <li><strong>Physics engines</strong> — Arcade (fast/AABB), Matter.js (rigid body)</li>
            <li><strong>Tilemap support</strong> — load Tiled-format maps directly</li>
            <li><strong>Input system</strong> — keyboard, mouse, touch, gamepad</li>
            <li><strong>Audio system</strong> — Web Audio with fallbacks</li>
            <li>Animations, tweens, timers, particle emitter, camera system</li>
          </ul>

          <h4>A complete (small) game</h4>
          <CodePre>{`import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(400, 300, 'sky');
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, platforms);
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('walk', true);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('walk', true);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
        }
        if (this.cursors.up.isDown && this.player.body!.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}

new Phaser.Game({
    type: Phaser.AUTO,
    width: 800, height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 300 }, debug: false }},
    scene: [PlayScene]
});`}</CodePre>

          <p>In ~50 lines: physics, animation, input, gravity, collision. That's what "opinionated framework" buys you.</p>

          <h4>When NOT to use Phaser</h4>
          <ul>
            <li><strong>Heavy DOM UI</strong> — Phaser's text/UI is OK but DOM is better. Mix with React if needed.</li>
            <li><strong>3D anything</strong> — Phaser is 2D only.</li>
            <li><strong>Tiny projects</strong> — for a simple puzzle, Phaser is overkill.</li>
          </ul>

          <h3>Route 6: Godot → HTML5 export</h3>
          <p><strong>Best for:</strong> Serious 2D games (and small 3D ones) where you want a real game engine but still want a web build.</p>

          <h4>Why Godot for the web</h4>
          <ul>
            <li><strong>Free, open source, MIT license</strong> — no royalties, no fees</li>
            <li><strong>Visual scene editor</strong> — drag-drop nodes, no code for basic layouts</li>
            <li><strong>GDScript</strong> — Python-like, easy to learn; or use C# / C++ / Rust via bindings</li>
            <li><strong>Built-in physics, animation, audio, UI, particles, lights, shaders</strong></li>
            <li><strong>Same project exports to</strong> Windows, Mac, Linux, iOS, Android, HTML5, consoles (with extra work)</li>
          </ul>

          <h4>A minimal player script (GDScript)</h4>
          <CodePre>{`extends CharacterBody2D

const SPEED = 300.0
const JUMP_VELOCITY = -400.0
var gravity = 980.0

func _physics_process(delta: float) -> void:
    if not is_on_floor():
        velocity.y += gravity * delta

    if Input.is_action_just_pressed("ui_accept") and is_on_floor():
        velocity.y = JUMP_VELOCITY

    var direction = Input.get_axis("ui_left", "ui_right")
    if direction:
        velocity.x = direction * SPEED
    else:
        velocity.x = move_toward(velocity.x, 0, SPEED)

    move_and_slide()`}</CodePre>

          <p>That's a complete platformer character.</p>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>HTML5 export gotchas.</strong> A minimal Godot 4 HTML5 build is ~25MB (engine WASM included). Compressed to ~10MB with gzip. <strong>First load is slow</strong> — use a loading screen. Godot 4 requires <code>Cross-Origin-Opener-Policy: same-origin</code> and <code>Cross-Origin-Embedder-Policy: require-corp</code> HTTP headers for SharedArrayBuffer/threads. Many hosts don't set these by default.</div>
          </div>

          <h4>Hosting Godot HTML5</h4>
          <table>
            <tbody>
              <tr><th>Host</th><th>Works out of the box?</th><th>Notes</th></tr>
              <tr><td>GitHub Pages</td><td>⚠️ Mostly</td><td>Need workaround for COOP/COEP headers</td></tr>
              <tr><td>Netlify</td><td>✅ Yes</td><td>Add <code>_headers</code> file with required headers</td></tr>
              <tr><td>Cloudflare Pages</td><td>✅ Yes</td><td><code>_headers</code> file supported</td></tr>
              <tr><td>itch.io</td><td>✅ Yes</td><td>Native Godot HTML5 support, just upload zip</td></tr>
            </tbody>
          </table>
        </section>

        {/* SECTION 5 — OTHER 2D OPTIONS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Other 2D options</h2>

          <PathTabs tabs={[
            {
              id: 'kaplay',
              label: 'Kaplay / Kaboom',
              content: (
                <>
                  <p><strong>Best for:</strong> Beginners, game jams, teaching kids, tiny games. KaplayJS (the active fork of Kaboom) optimizes for <em>fun to write</em>:</p>
                  <CodePre>{`import kaplay from "kaplay";

kaplay();
loadSprite("bean", "/sprites/bean.png");

scene("main", () => {
    const bean = add([sprite("bean"), pos(80, 40), area(), body()]);
    onKeyPress("space", () => { if (bean.isGrounded()) bean.jump(); });
    add([rect(width(), 48), pos(0, height() - 48), area(), body({ isStatic: true })]);
});
go("main");`}</CodePre>
                  <p>Downside: performance ceiling — great until you need 1000+ entities or custom shaders.</p>
                </>
              ),
            },
            {
              id: 'excalibur',
              label: 'Excalibur',
              content: (
                <p><strong>Best for:</strong> TypeScript-first 2D games with clean OO architecture. Built TypeScript-first, with actor-based architecture, built-in physics, good docs. Sits between Phaser (kitchen sink) and PixiJS (renderer only).</p>
              ),
            },
            {
              id: 'p5',
              label: 'p5.js',
              content: (
                <>
                  <p><strong>Best for:</strong> Generative art, educational projects, prototypes. Processing for JavaScript. Beautiful for creative coding but not optimized for production games.</p>
                  <p>If you're teaching programming or doing visual experiments, this is wonderful. Don't ship commercial games with it.</p>
                </>
              ),
            },
            {
              id: 'no-code',
              label: 'Construct 3 / GDevelop',
              content: (
                <>
                  <p><strong>Best for:</strong> Designers and non-programmers, rapid prototyping. Browser-based event-driven editors.</p>
                  <ul>
                    <li><strong>Construct 3</strong> — subscription ($99/year+), polished UX. Games you make are free to distribute.</li>
                    <li><strong>GDevelop</strong> — MIT licensed, free desktop editor. Less polished UX than Construct but no subscription.</li>
                  </ul>
                </>
              ),
            },
            {
              id: 'defold-cocos',
              label: 'Defold / Cocos',
              content: (
                <>
                  <p><strong>Defold</strong> — Engine made by King (Candy Crush), now free + open-source. Lua scripting. Excellent web export. Used for shipping mobile games at scale.</p>
                  <p><strong>Cocos Creator</strong> — Very popular in Asian mobile market. TypeScript scripting. Good web export. Free.</p>
                </>
              ),
            },
          ]} />
        </section>

        {/* SECTION 6 — 3D OPTIONS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>3D options</h2>

          <h3>Three.js + React Three Fiber</h3>
          <p><strong>Best for:</strong> Custom 3D experiences, data visualization with 3D, hobby 3D games. The most popular 3D library on the web by far.</p>

          <CodePre>{`import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

camera.position.z = 5;
function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();`}</CodePre>

          <p>Three.js is <strong>a 3D library, not a game engine</strong>. You need:</p>
          <ul>
            <li>Physics: <strong>Rapier.js</strong> (Rust/WASM, fast) or <strong>Cannon.js</strong></li>
            <li>Input/controls: write yourself or use <a href="https://github.com/pmndrs/drei" target="_blank" rel="noreferrer">drei</a> helpers</li>
            <li>Asset loading: built into Three.js (GLTFLoader)</li>
          </ul>

          <h4>React Three Fiber — the React-friendly wrapper</h4>
          <CodePre>{`import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function Box() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.x += delta;
    });
    return (
        <mesh ref={ref}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

function App() {
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box />
        </Canvas>
    );
}`}</CodePre>

          <p>R3F + <code>drei</code> (helpers) + <code>@react-three/rapier</code> (physics) is an incredibly productive stack for browser 3D.</p>

          <h3>Babylon.js — engine-style 3D</h3>
          <p><strong>Best for:</strong> Full-featured 3D, especially if you want a real "engine" vibe with built-in physics, AI, networking.</p>

          <p>Babylon.js is more game-engine-like than Three.js. It includes:</p>
          <ul>
            <li>Physics (Havok engine integration)</li>
            <li>Animation system (skeletal, blendshapes)</li>
            <li>Audio engine with spatial sound</li>
            <li>Inspector tools (built-in debug UI)</li>
            <li>Visual editor (separate app)</li>
          </ul>

          <h4>Three.js vs Babylon.js</h4>
          <table>
            <tbody>
              <tr><th>Aspect</th><th>Three.js</th><th>Babylon.js</th></tr>
              <tr><td>Philosophy</td><td>Library / toolkit</td><td>Engine</td></tr>
              <tr><td>Bundle size</td><td>Smaller (~150KB)</td><td>Larger (~700KB)</td></tr>
              <tr><td>Built-in physics</td><td>No</td><td>Yes (Havok)</td></tr>
              <tr><td>Built-in audio</td><td>Minimal</td><td>Full spatial audio</td></tr>
              <tr><td>Editor</td><td>None</td><td>Yes (free)</td></tr>
              <tr><td>Documentation</td><td>Good but library-style</td><td>Excellent, engine-style</td></tr>
            </tbody>
          </table>

          <p><strong>Pick Three.js</strong> if you want maximum flexibility and don't mind composing tools. <strong>Pick Babylon.js</strong> if you want batteries included and game-engine ergonomics.</p>

          <h3>PlayCanvas &amp; A-Frame</h3>
          <h4>PlayCanvas</h4>
          <p><strong>Best for:</strong> Commercial 3D web games, marketing demos, AAA-grade visual quality. Browser-based collaborative 3D editor (think Figma for 3D games). Free tier for public projects, paid for private. Used for Disney, Ubisoft web games.</p>

          <h4>A-Frame</h4>
          <p><strong>Best for:</strong> WebXR (VR/AR in browser), declarative 3D scenes.</p>
          <CodePre>{`<a-scene>
    <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
    <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
    <a-sky color="#ECECEC"></a-sky>
</a-scene>`}</CodePre>
          <p>Great for VR demos. Less suitable for non-VR action games.</p>
        </section>

        {/* SECTION 7 — ADVANCED */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Advanced approaches</h2>

          <h3>Bevy + WebAssembly (Rust)</h3>
          <p><a href="https://bevyengine.org/" target="_blank" rel="noreferrer">Bevy</a> is a Rust ECS game engine that compiles to WASM. Beautiful API, blazing performance, but requires Rust expertise.</p>

          <CodePre>{`use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, move_player)
        .run();
}

fn setup(mut commands: Commands) {
    commands.spawn(Camera2dBundle::default());
    commands.spawn((
        SpriteBundle { transform: Transform::from_xyz(0., 0., 0.), ..default() },
        Player,
    ));
}

fn move_player(time: Res<Time>, mut query: Query<&mut Transform, With<Player>>) {
    for mut t in &mut query {
        t.translation.x += 100. * time.delta_seconds();
    }
}`}</CodePre>

          <CodePre>{`cargo install wasm-bindgen-cli
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen --target web --out-dir ./out target/wasm32-unknown-unknown/release/my_game.wasm`}</CodePre>

          <h3>LÖVE, Emscripten, and networked engines</h3>
          <h4>LÖVE (Lua) → web via love.js</h4>
          <p>LÖVE is a beloved 2D Lua framework. <code>love.js</code> ports it to the web via WASM. Mature, simple Lua API.</p>

          <h4>Emscripten + C/C++ engines</h4>
          <p>Anything written in C/C++ can compile to WebAssembly via <a href="https://emscripten.org/" target="_blank" rel="noreferrer">Emscripten</a>. This is how Doom plays in the browser, many indie engines target web, and some Unreal Engine 4 demos work.</p>

          <h4>Networked engines for multiplayer-first</h4>
          <ul>
            <li><strong>Colyseus</strong> (Node.js) — authoritative server, schema-driven state sync, room-based</li>
            <li><strong>PartyKit</strong> (Cloudflare Workers) — globally distributed multiplayer rooms</li>
            <li><strong>Geckos.io</strong> — WebRTC for low-latency games (FPS, fighting games)</li>
            <li><strong>Socket.IO</strong> — general-purpose websocket abstraction</li>
          </ul>

          <h3>Unity for web — brief</h3>
          <p>Unity is a full 3D + 2D game engine with a massive ecosystem. It exports to WebGL as one of many target platforms.</p>

          <h4>When Unity makes sense for web</h4>
          <ul>
            <li>You're already a Unity dev</li>
            <li>You're shipping cross-platform (web + mobile + console) and web is one of many targets</li>
            <li>You need AAA-quality 3D rendering with minimal effort</li>
            <li>You need the asset store ecosystem (Unity has the largest)</li>
          </ul>

          <h4>When Unity does NOT make sense for web</h4>
          <ul>
            <li><strong>Bundle size:</strong> A minimal Unity WebGL build is <strong>5–20MB compressed</strong> even before assets. Brutal for casual web.</li>
            <li><strong>Mobile web:</strong> Unity WebGL on mobile is unreliable. iOS Safari especially has issues.</li>
            <li><strong>Memory:</strong> Unity WebGL needs 256MB-1GB of WASM memory per instance.</li>
            <li><strong>Cold start time:</strong> 5-15 second load times are normal.</li>
          </ul>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The honest summary.</strong> If web is your <em>only</em> target, do not use Unity. Pick something web-first. If web is one of many targets and you're already a Unity dev, the WebGL build is fine for desktop browsers — for 2D and mid-tier 3D, Godot's web export is significantly smaller (10-15MB compressed) and runs better on mobile web.</div>
          </div>
        </section>

        {/* SECTION 8 — MOBILE */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Mobile &amp; touch input</h2>

          <p>"Build once, run everywhere" is half-true. A web game running flawlessly on desktop can be miserable on mobile if you don't think about: viewport scaling, touch events, performance budgets, and battery. Every modern web game should at least <em>not break</em> on phones — and the platform's biggest install base is mobile browsers.</p>

          <h3>The four things to get right</h3>
          <ol>
            <li><strong>Viewport</strong> — the page should fit the device without scrolling or zooming.</li>
            <li><strong>Input</strong> — touch is not mouse; multi-touch, tap latency, scroll prevention all matter.</li>
            <li><strong>Performance</strong> — a phone GPU is ~10× slower than a laptop. Plan for it.</li>
            <li><strong>Power</strong> — locked-frame-rate games drain batteries on phones. Mobile users notice.</li>
          </ol>

          <h3>Viewport &amp; scaling — the meta tag that makes or breaks mobile</h3>
          <p>Without this, mobile browsers render your page at desktop width and let users zoom — terrible for games. Always include:</p>
          <CodePre>{`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">`}</CodePre>

          <ul>
            <li><code>width=device-width</code> — CSS pixels match device width</li>
            <li><code>initial-scale=1</code> — no auto-zoom on load</li>
            <li><code>user-scalable=no</code> — disable pinch-zoom (intentional for games; bad for content sites)</li>
            <li><code>viewport-fit=cover</code> — use the full screen including notch areas (pair with <code>env(safe-area-inset-*)</code> CSS)</li>
          </ul>

          <h4>Scaling your canvas to the screen — letterbox (preserve aspect ratio)</h4>
          <CodePre>{`function resize(canvas, designW, designH) {
  const r = Math.min(window.innerWidth / designW, window.innerHeight / designH);
  canvas.style.width  = (designW * r) + 'px';
  canvas.style.height = (designH * r) + 'px';
  // canvas internal resolution stays designW × designH — sharp rendering, easy math
}
window.addEventListener('resize', () => resize(canvas, 800, 600));`}</CodePre>

          <h4>Fill (resize internal resolution to viewport)</h4>
          <CodePre>{`function fillResize(canvas) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  // scale your renderer's transform by dpr if drawing in CSS pixels
}`}</CodePre>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>DPR (devicePixelRatio) trap.</strong> Phones often have DPR 2–3. If you set <code>canvas.width = innerWidth</code> without multiplying by DPR, sprites look blurry. If you draw everything at DPR scale and forget the CSS size, your canvas is 3× too large on screen. Always set <em>both</em>: internal size in physical pixels, CSS size in CSS pixels.</div>
          </div>

          <h3>Touch events — what's different from mouse</h3>
          <p>Mobile browsers fire a hybrid of <code>touchstart</code>/<code>touchmove</code>/<code>touchend</code>, then a synthetic <code>mousedown</code>/<code>mouseup</code>. Modern code uses <strong>Pointer Events</strong> which unify both:</p>

          <CodePre>{`canvas.addEventListener('pointerdown', e => {
  e.preventDefault();           // stop page scroll, stop synthetic mouse
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);   // canvas-local
  const y = (e.clientY - rect.top)  * (canvas.height / rect.height);
  handleTap(x, y, e.pointerId);
});

canvas.addEventListener('pointermove', e => {
  if (e.pressure === 0) return; // not pressing
  // ...
});

canvas.addEventListener('pointerup',     e => handleRelease(e.pointerId));
canvas.addEventListener('pointercancel', e => handleRelease(e.pointerId)); // OS preempt`}</CodePre>

          <h4>Multi-touch (virtual joystick + buttons)</h4>
          <p>Each <code>pointerId</code> is unique. Track them in a map; the same gesture's events all share an ID:</p>
          <CodePre>{`const touches = new Map();

canvas.addEventListener('pointerdown', e => {
  touches.set(e.pointerId, { x: e.clientX, y: e.clientY, role: classifyTouch(e) });
});
canvas.addEventListener('pointermove', e => {
  const t = touches.get(e.pointerId);
  if (!t) return;
  t.x = e.clientX; t.y = e.clientY;
});
canvas.addEventListener('pointerup',     e => touches.delete(e.pointerId));
canvas.addEventListener('pointercancel', e => touches.delete(e.pointerId));

function classifyTouch(e) {
  return e.clientX < window.innerWidth / 2 ? 'joystick' : 'button';
}`}</CodePre>

          <h4>Critical CSS for canvas-driven games</h4>
          <CodePre>{`canvas {
  touch-action: none;     /* disable browser pan/zoom on canvas */
  user-select: none;      /* no text-selection on long-press */
  -webkit-tap-highlight-color: transparent; /* iOS blue flash */
}
body, html {
  overscroll-behavior: none; /* no pull-to-refresh */
  overflow: hidden;
}`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The double-tap zoom trap.</strong> iOS Safari double-tap zooms by default. <code>touch-action: none</code> on the canvas fixes it. Pinch-to-zoom is blocked by <code>user-scalable=no</code> in the viewport meta.</div>
          </div>

          <h3>Mobile performance budget</h3>
          <p>A mid-range phone has roughly:</p>
          <ul>
            <li>~1/10 the GPU throughput of a gaming laptop</li>
            <li>~1/3 the CPU single-threaded speed</li>
            <li>4–6GB RAM total, &lt;1GB available to your tab</li>
            <li>Battery: a 60fps game on a phone is a 1–2hr session before dead</li>
          </ul>

          <h4>Knobs to turn</h4>
          <ul>
            <li><strong>Cap to 30fps on mobile</strong> if 60 isn't critical. <code>requestAnimationFrame</code> doesn't let you set FPS directly — you skip frames in your loop.</li>
            <li><strong>Lower texture resolution</strong> for mobile builds. A 4K background isn't visible on a 6.1" screen.</li>
            <li><strong>Reduce particles</strong> by 50% on mobile.</li>
            <li><strong>Detect</strong> via <code>navigator.userAgent</code> (crude) or <code>'ontouchstart' in window</code> or <code>matchMedia('(pointer: coarse)').matches</code>.</li>
          </ul>

          <CodePre>{`const isMobile = window.matchMedia('(pointer: coarse)').matches;
const settings = isMobile
  ? { particles: 50, shadows: false, fpsCap: 30 }
  : { particles: 200, shadows: true, fpsCap: 60 };`}</CodePre>
        </section>

        {/* SECTION 9 — AUDIO */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Audio handling</h2>

          <h3>The AudioContext and the user-gesture rule</h3>
          <p>Browsers won't play sound until the user has interacted with the page (tap, click, key). This kills naive games that start music in <code>onload</code>. The rule:</p>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Audio must start from user input.</strong> Create your <code>AudioContext</code> early, but resume / play in the first <code>pointerdown</code> or <code>keydown</code> handler. Chrome, Safari, Firefox, and most mobile browsers all enforce this.</div>
          </div>

          <CodePre>{`const ctx = new (window.AudioContext || window.webkitAudioContext)();

function unlockAudio() {
  if (ctx.state === 'suspended') ctx.resume();
  document.removeEventListener('pointerdown', unlockAudio);
  document.removeEventListener('keydown',     unlockAudio);
}
document.addEventListener('pointerdown', unlockAudio);
document.addEventListener('keydown',     unlockAudio);`}</CodePre>

          <h3>Howler.js — the practical default for games</h3>
          <p>Howler wraps Web Audio with a much simpler API. It handles format fallbacks, sprite sheets (multiple SFX in one file), pooling, and the user-gesture dance. <strong>Default to Howler for any non-trivial game audio.</strong></p>

          <CodePre>{`import { Howl, Howler } from 'howler';

// Music (looping, fade-friendly)
const music = new Howl({
  src: ['/audio/theme.webm', '/audio/theme.mp3'],
  loop: true,
  volume: 0.5,
});

// SFX sprite — multiple sounds in one file (one HTTP request, one decode)
const sfx = new Howl({
  src: ['/audio/sfx.webm', '/audio/sfx.mp3'],
  sprite: {
    jump:    [0,    300],   // [offset_ms, duration_ms]
    coin:    [500,  200],
    explode: [1000, 700],
  },
});

// On the first input
function startGame() {
  music.play();
}

// Anywhere
sfx.play('jump');
sfx.play('coin');

// Global volume
Howler.volume(0.7);  // master`}</CodePre>

          <h4>Audio format trade-offs</h4>
          <table>
            <tbody>
              <tr><th>Format</th><th>Quality / Size</th><th>Browser support</th><th>Use for</th></tr>
              <tr><td><code>.mp3</code></td><td>Good / medium</td><td>Universal</td><td>Always include as fallback</td></tr>
              <tr><td><code>.ogg</code> (Vorbis)</td><td>Better / smaller</td><td>All except Safari (old)</td><td>Music, ambient</td></tr>
              <tr><td><code>.webm</code> (Opus)</td><td>Best / smallest</td><td>Modern browsers</td><td>Primary; fall back to mp3</td></tr>
              <tr><td><code>.wav</code></td><td>Lossless / huge</td><td>Universal</td><td>Don't ship to web</td></tr>
            </tbody>
          </table>

          <p>Provide two sources (e.g. <code>.webm</code> + <code>.mp3</code>) and let the browser pick. Howler does this automatically with its <code>src</code> array.</p>

          <h3>Spatial / positional audio (3D games)</h3>
          <p>For 3D games, you want sounds to come from where their source is in the world — quieter when far, panned left/right by listener orientation. Web Audio's <code>PannerNode</code> handles this; Three.js wraps it as <code>PositionalAudio</code>:</p>

          <CodePre>{`import * as THREE from 'three';

const listener = new THREE.AudioListener();
camera.add(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('/audio/engine.webm', buffer => {
  const sound = new THREE.PositionalAudio(listener);
  sound.setBuffer(buffer);
  sound.setRefDistance(5);    // distance at which volume = 1
  sound.setRolloffFactor(2);  // how fast it falls off
  sound.setLoop(true);
  sound.play();
  shipMesh.add(sound);        // sound follows the ship
});`}</CodePre>

          <p>Babylon.js has a built-in audio engine with the same concepts — see its <code>Sound</code> class.</p>

          <h3>Common audio pitfalls</h3>
          <ul>
            <li><strong>Loading 30 sounds individually</strong> = 30 HTTP requests + 30 decodes. Use a sprite (Howler supports this natively) or batch into a single Opus file.</li>
            <li><strong>Lots of simultaneous instances of one effect.</strong> Howler pools instances by default; vanilla Web Audio requires you to create a new <code>BufferSource</code> each play (they're disposable).</li>
            <li><strong>iOS Safari memory limits</strong> — too many decoded buffers can crash your tab. Stream long tracks (<code>html5: true</code> in Howler) instead of decoding to memory.</li>
            <li><strong>Mute toggle</strong> — provide one. Browsers also mute background tabs automatically via the Page Visibility API — listen to <code>visibilitychange</code> if you want to pause your own audio explicitly.</li>
          </ul>
        </section>

        {/* SECTION 10 — PERSISTENCE */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Save state &amp; persistence</h2>

          <h3>Where to store player progress</h3>
          <table>
            <tbody>
              <tr><th>Mechanism</th><th>Max size</th><th>Async?</th><th>Use for</th></tr>
              <tr><td><code>localStorage</code></td><td>~5MB per origin</td><td>No (sync)</td><td>Small saves: settings, progress flags, high score</td></tr>
              <tr><td><code>sessionStorage</code></td><td>~5MB per tab</td><td>No</td><td>One-session-only state (rarely useful for games)</td></tr>
              <tr><td><code>IndexedDB</code></td><td>~50MB+ (browser-dependent)</td><td>Yes</td><td>Large saves: full world state, screenshots, replay data</td></tr>
              <tr><td><code>OPFS</code> (Origin Private File System)</td><td>~50MB+</td><td>Yes</td><td>Binary blobs, modders' content; modern browsers only</td></tr>
              <tr><td>Cloud (your server)</td><td>Whatever you provision</td><td>Yes</td><td>Cross-device sync, leaderboards, anti-cheat</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Private mode &amp; iOS Safari quirks.</strong> In Safari's private browsing mode, <code>localStorage</code> is wiped on tab close. Safari also evicts <em>any</em> site's storage after 7 days of inactivity. Don't rely on localStorage as your only save — give the player a "Download save" / "Upload save" option for serious games, or sync to cloud when possible.</div>
          </div>

          <h3>localStorage — the 90% solution</h3>
          <CodePre>{`// Wrap all saves with try/catch — storage can be unavailable or full
const SAVE_KEY = 'my-game-save';
const SAVE_VERSION = 3;

interface SaveData {
  version: number;
  level: number;
  hp: number;
  inventory: string[];
  updatedAt: number;
}

function save(state: SaveData) {
  state.version = SAVE_VERSION;
  state.updatedAt = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    // Storage full, private mode, or disabled
    console.warn('Save failed:', e);
  }
}

function load(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    return migrate(parsed);
  } catch {
    return null;
  }
}

function migrate(save: SaveData): SaveData {
  if (save.version < 2) save.inventory ??= [];   // v2 added inventory
  if (save.version < 3) save.hp ??= 100;         // v3 added hp
  save.version = SAVE_VERSION;
  return save;
}`}</CodePre>

          <p><strong>Always version your saves.</strong> The day you add a new field, every existing player's save breaks unless you migrate. The pattern: bump <code>SAVE_VERSION</code> when the shape changes, add an <code>if (version &lt; N)</code> branch in <code>migrate()</code>.</p>

          <h3>IndexedDB for larger saves</h3>
          <p>localStorage maxes out around 5MB. If your game has multiple save slots, replays, or large procedural worlds, use IndexedDB. The raw API is verbose — most people use a wrapper like <code>idb</code>:</p>

          <CodePre>{`// npm install idb
import { openDB } from 'idb';

const db = await openDB('my-game', 1, {
  upgrade(db) {
    db.createObjectStore('saves', { keyPath: 'slot' });
    db.createObjectStore('replays', { keyPath: 'id', autoIncrement: true });
  },
});

// Write
await db.put('saves', { slot: 'auto', state: bigSaveBlob, ts: Date.now() });
await db.put('saves', { slot: 'manual-1', state: bigSaveBlob, ts: Date.now() });

// Read
const auto = await db.get('saves', 'auto');

// List all slots
const all = await db.getAll('saves');`}</CodePre>

          <p>IndexedDB lets you store <strong>structured-clonable values</strong> directly — no need to <code>JSON.stringify</code>. Numbers, strings, arrays, plain objects, Blobs, Maps, Sets, typed arrays all work as-is.</p>

          <h3>Cloud sync (when player progress needs to travel)</h3>
          <p>If your game has accounts (or you're using itch.io / a multiplayer backend), sync saves to your server. The pattern:</p>

          <ol>
            <li>Local save is the authority while playing.</li>
            <li>On significant events (level complete, app focus loss, periodic interval), POST the save to <code>/api/save</code>.</li>
            <li>On startup: fetch the cloud save. If its <code>updatedAt</code> is newer than local, prompt the user to merge or use the cloud version.</li>
            <li>Use <code>navigator.sendBeacon()</code> for the "save on unload" case — it's the only thing that reliably fires when a tab closes.</li>
          </ol>

          <CodePre>{`window.addEventListener('beforeunload', () => {
  const payload = JSON.stringify(getState());
  navigator.sendBeacon('/api/save', new Blob([payload], { type: 'application/json' }));
});`}</CodePre>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>Anti-cheat for online leaderboards.</strong> Client-side saves are easy to tamper with. For competitive online play, the server should be the authority: clients send <em>inputs</em>, server simulates and stores. Or at minimum, validate suspicious saves server-side (impossible scores, time-travel timestamps).</div>
          </div>
        </section>

        {/* SECTION 11 — MULTIPLAYER */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Multiplayer &amp; networking</h2>

          <h3>Client–Server vs Peer-to-Peer</h3>
          <MermaidDiagram theme="default" chart={`graph TB
    subgraph Authoritative_Server
        A[Client 1] -->|input| S[Server<br/>game logic]
        B[Client 2] -->|input| S
        C[Client 3] -->|input| S
        S -->|state| A
        S -->|state| B
        S -->|state| C
    end
    subgraph Peer_to_Peer
        D[Peer 1] <-->|state sync| E[Peer 2]
        E <-->|state sync| F[Peer 3]
        D <-->|state sync| F
    end`} />

          <ul>
            <li><strong>Authoritative server</strong> — server holds truth, clients are dumb terminals. Cheat-resistant. Required for competitive games.</li>
            <li><strong>Peer-to-peer (P2P)</strong> — clients negotiate state. Cheaper to operate. Vulnerable to cheating. Fine for co-op or social games.</li>
          </ul>

          <h3>Transports</h3>
          <table>
            <tbody>
              <tr><th>Transport</th><th>Latency</th><th>Use case</th></tr>
              <tr><td>WebSocket</td><td>50-200ms</td><td>Most multiplayer games (turn-based, RPG, MMO)</td></tr>
              <tr><td>WebRTC DataChannel</td><td>20-80ms</td><td>Fast-paced games (FPS, fighting, racing)</td></tr>
              <tr><td>HTTP polling</td><td>200ms+</td><td>Asynchronous (chess, words games)</td></tr>
              <tr><td>WebTransport</td><td>Similar to WebRTC</td><td>Modern alternative, less browser support</td></tr>
            </tbody>
          </table>

          <h3>Colyseus — the modern default</h3>
          <CodePre>{`// server.ts
import { Server, Room } from 'colyseus';
import { Schema, MapSchema, type } from '@colyseus/schema';

class PlayerState extends Schema {
    @type("number") x: number = 0;
    @type("number") y: number = 0;
}

class GameState extends Schema {
    @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

class GameRoom extends Room<GameState> {
    onCreate() {
        this.setState(new GameState());
        this.onMessage("move", (client, msg) => {
            const player = this.state.players.get(client.sessionId);
            if (player) { player.x = msg.x; player.y = msg.y; }
        });
    }
    onJoin(client) {
        this.state.players.set(client.sessionId, new PlayerState());
    }
    onLeave(client) {
        this.state.players.delete(client.sessionId);
    }
}

const gameServer = new Server();
gameServer.define("game", GameRoom);
gameServer.listen(2567);`}</CodePre>

          <CodePre>{`// client
import { Client } from 'colyseus.js';

const client = new Client('ws://localhost:2567');
const room = await client.joinOrCreate('game');

room.state.players.onAdd((player, sessionId) => {
    console.log('new player', sessionId);
    player.onChange(() => updatePlayerSprite(sessionId, player.x, player.y));
});

document.addEventListener('mousemove', (e) => {
    room.send('move', { x: e.clientX, y: e.clientY });
});`}</CodePre>

          <h4>Critical concepts to learn</h4>
          <ul>
            <li><strong>Client prediction</strong> — predict your own movement locally for responsiveness</li>
            <li><strong>Server reconciliation</strong> — fix predictions when the server disagrees</li>
            <li><strong>Lag compensation</strong> — server simulates "where the player saw the target" for hit detection</li>
            <li><strong>Interpolation</strong> — smooth other players' movement between snapshots</li>
            <li><strong>Tick rate</strong> — how often the server simulates (20-60Hz typical)</li>
          </ul>

          <p>Read: <a href="https://www.gabrielgambetta.com/client-server-game-architecture.html" target="_blank" rel="noreferrer">Gabriel Gambetta's "Fast-Paced Multiplayer" series</a>.</p>
        </section>

        {/* SECTION 12 — DEPLOYMENT */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Deployment &amp; hosting</h2>

          <h3>Static hosting for browser-only games</h3>
          <MermaidDiagram theme="default" chart={`flowchart LR
    A[Build output<br/>dist/] --> B{Hosting option}
    B --> C[GitHub Pages<br/>free, custom domain]
    B --> D[Netlify<br/>free, CI/CD]
    B --> E[Cloudflare Pages<br/>free, fast CDN]
    B --> F[Vercel<br/>free, fast]
    B --> G[itch.io<br/>great for indie<br/>distribution]`} />

          <h4>Adding required headers (Godot, SharedArrayBuffer)</h4>
          <p>If you use Godot HTML5 or any WASM with threads, add via a <code>_headers</code> file:</p>
          <CodePre>{`/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp`}</CodePre>
          <p>Works on Netlify, Cloudflare Pages. GitHub Pages doesn't support custom headers (use a workaround service worker, or pick a different host).</p>

          <h4>Multiplayer hosting</h4>
          <ul>
            <li><strong>Fly.io</strong> — cheap, simple, great for game servers</li>
            <li><strong>Railway</strong> — easy deploys, generous free tier</li>
            <li><strong>DigitalOcean App Platform</strong> — predictable pricing</li>
            <li><strong>Cloudflare Workers (with PartyKit)</strong> — globally distributed, no servers to manage</li>
          </ul>

          <h4>Asset CDN</h4>
          <p>Big game assets bloat your build. Host on a CDN:</p>
          <ul>
            <li><strong>Cloudflare R2</strong> — S3-compatible, no egress fees</li>
            <li><strong>AWS S3 + CloudFront</strong> — the classic</li>
            <li><strong>Backblaze B2</strong> — cheap</li>
          </ul>
        </section>

        {/* SECTION 13 — WEBGPU */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>WebGPU — looking forward</h2>

          <h3>What it is and when to care</h3>
          <p>WebGPU is the successor to WebGL — a modern, multi-threaded GPU API for browsers. It exposes compute shaders, lower CPU overhead, and modern rendering pipelines (Vulkan / Metal / D3D12-style).</p>

          <h4>Current status (2026)</h4>
          <ul>
            <li><strong>Chrome / Edge:</strong> Stable. Default on.</li>
            <li><strong>Firefox:</strong> Stable behind a flag, on by default in nightly.</li>
            <li><strong>Safari:</strong> Stable on iOS 18+ and macOS Sequoia.</li>
            <li>Realistic feature-detect: <code>'gpu' in navigator</code>. Always have a WebGL fallback.</li>
          </ul>

          <h4>Why a game dev should care</h4>
          <ul>
            <li><strong>Compute shaders</strong> — GPU-accelerated particle systems, physics, AI, post-processing without CPU round-trips. Things that were impossible in WebGL are routine.</li>
            <li><strong>Lower CPU overhead</strong> — multi-threaded command encoding. Your draw calls aren't single-threaded JS anymore.</li>
            <li><strong>Modern pipeline ergonomics</strong> — explicit render passes, bind groups; closer to native engines.</li>
            <li><strong>Subgroup operations</strong> — fast reductions, prefix sums.</li>
          </ul>

          <h3>The easy path: WebGPU via Three.js</h3>
          <p>Don't write raw WebGPU unless you're building a renderer. Three.js has a <code>WebGPURenderer</code> that's largely API-compatible with <code>WebGLRenderer</code> — switch one import:</p>

          <CodePre>{`import { WebGPURenderer } from 'three/webgpu';

const renderer = new WebGPURenderer({ canvas, antialias: true });
await renderer.init();
// then use it like a normal Three.js renderer
renderer.render(scene, camera);`}</CodePre>

          <p>Most existing Three.js code (geometry, materials, lights, scene graph) works as-is. Custom shaders that used <code>RawShaderMaterial</code> need rewriting in TSL (Three Shading Language) or WGSL — that's the breaking change to plan for.</p>

          <h3>A tiny taste of raw WebGPU</h3>
          <p>Skip this unless you're curious. The setup is verbose by design — explicit pipelines are why it's fast.</p>

          <CodePre>{`if (!navigator.gpu) throw new Error('WebGPU not supported');
const adapter = await navigator.gpu.requestAdapter();
const device  = await adapter.requestDevice();

const canvas = document.getElementById('game');
const context = canvas.getContext('webgpu');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format });

const module = device.createShaderModule({
  code: \`
    @vertex
    fn vs(@builtin(vertex_index) i : u32) -> @builtin(position) vec4f {
      let p = array<vec2f, 3>(vec2f(0,1), vec2f(-1,-1), vec2f(1,-1));
      return vec4f(p[i], 0, 1);
    }
    @fragment
    fn fs() -> @location(0) vec4f { return vec4f(1,0.5,0,1); }
  \`,
});

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex:   { module, entryPoint: 'vs' },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list' },
});

function frame() {
  const enc = device.createCommandEncoder();
  const pass = enc.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r:0, g:0, b:0, a:1 },
      loadOp: 'clear', storeOp: 'store',
    }],
  });
  pass.setPipeline(pipeline);
  pass.draw(3);
  pass.end();
  device.queue.submit([enc.finish()]);
  requestAnimationFrame(frame);
}
frame();`}</CodePre>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>When to skip WebGPU for now.</strong> For most 2D games and mid-tier 3D games, WebGL is still the right call in 2026 — better tooling, mature debuggers (Spector.js), simpler. Reach for WebGPU when you need compute shaders (particles, simulation), have heavy CPU-bound rendering (many draw calls), or want to future-proof a new engine.</div>
          </div>
        </section>

        {/* SECTION 14 — DECISION MATRIX */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Decision matrix</h2>

          <h3>At-a-glance comparison</h3>
          <table>
            <tbody>
              <tr><th>Stack</th><th>Bundle</th><th>Perf ceiling</th><th>Learning curve</th><th>Cross-platform</th><th>Best for</th></tr>
              <tr><td><strong>Vanilla JS + Canvas</strong></td><td>&lt;10KB</td><td>Low</td><td>★☆☆☆☆</td><td>Web only</td><td>Learning, puzzles, jam games</td></tr>
              <tr><td><strong>TypeScript + Vite</strong></td><td>&lt;20KB</td><td>Low</td><td>★★☆☆☆</td><td>Web only</td><td>Same as above, maintainable</td></tr>
              <tr><td><strong>PixiJS</strong></td><td>~400KB</td><td>High</td><td>★★★☆☆</td><td>Web only</td><td>2D sprite-heavy, custom games</td></tr>
              <tr><td><strong>React + PixiJS</strong></td><td>~600KB+</td><td>High</td><td>★★★☆☆</td><td>Web only</td><td>Heavy UI + game world</td></tr>
              <tr><td><strong>Phaser</strong></td><td>~1.2MB</td><td>High</td><td>★★★☆☆</td><td>Web only</td><td>2D platformers, arcade</td></tr>
              <tr><td><strong>Kaplay</strong></td><td>~300KB</td><td>Medium</td><td>★☆☆☆☆</td><td>Web only</td><td>Tiny games, jams, teaching</td></tr>
              <tr><td><strong>Excalibur</strong></td><td>~250KB</td><td>Medium-High</td><td>★★☆☆☆</td><td>Web only</td><td>OO TypeScript 2D</td></tr>
              <tr><td><strong>Godot HTML5</strong></td><td>~12MB</td><td>Very high</td><td>★★★★☆</td><td>Everywhere</td><td>Serious 2D, small 3D</td></tr>
              <tr><td><strong>Three.js</strong></td><td>~150KB+</td><td>Very high</td><td>★★★★☆</td><td>Web only</td><td>Custom 3D</td></tr>
              <tr><td><strong>Babylon.js</strong></td><td>~700KB</td><td>Very high</td><td>★★★★☆</td><td>Web only</td><td>Full 3D, engine feel</td></tr>
              <tr><td><strong>PlayCanvas</strong></td><td>varies</td><td>Very high</td><td>★★★☆☆</td><td>Web focused</td><td>AAA web 3D, marketing</td></tr>
              <tr><td><strong>Bevy + WASM</strong></td><td>~5MB</td><td>Extreme</td><td>★★★★★</td><td>Everywhere</td><td>Rust devs, perf-critical</td></tr>
              <tr><td><strong>Unity WebGL</strong></td><td>5-20MB</td><td>Very high</td><td>★★★★☆</td><td>Everywhere</td><td>Cross-platform, web secondary</td></tr>
            </tbody>
          </table>

          <h4>Bundle size context (4G, ~5MB/s effective)</h4>
          <table>
            <tbody>
              <tr><th>Bundle Size</th><th>Mobile Load Time</th></tr>
              <tr><td>&lt;100KB</td><td>&lt;1s</td></tr>
              <tr><td>500KB</td><td>1-2s</td></tr>
              <tr><td>1MB</td><td>2-3s</td></tr>
              <tr><td>5MB</td><td>8-12s</td></tr>
              <tr><td>15MB</td><td>25-40s</td></tr>
            </tbody>
          </table>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>The 5-second rule.</strong> Players will leave a web game that takes &gt;5 seconds to load. Bundle size matters more than any other metric.</div>
          </div>
        </section>

        {/* SECTION 15 — LEARNING PATHS */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>Recommended learning paths</h2>

          <h3>Path A: "I'm new to game dev, want to learn"</h3>
          <MermaidDiagram theme="default" chart={`flowchart TD
    A[Start] --> B[Build pong in vanilla JS + Canvas]
    B --> C[Build a snake game]
    C --> D[Add TypeScript + Vite]
    D --> E[Build a platformer in Phaser]
    E --> F[Build a 2D RPG prototype]
    F --> G{Want more?}
    G -->|3D curious| H[Pick up Three.js]
    G -->|2D focus| I[Try Godot]`} />
          <p>Each step takes 1-4 weeks. By the end you understand all major web game paradigms.</p>

          <h3>Path B: "I know JS, want to ship something quickly"</h3>
          <ol>
            <li><strong>Week 1:</strong> Set up TypeScript + Vite + Phaser. Learn Phaser scenes.</li>
            <li><strong>Week 2-3:</strong> Build core mechanic. Don't worry about polish.</li>
            <li><strong>Week 4-6:</strong> Add levels, balance, sound.</li>
            <li><strong>Week 7:</strong> Deploy to itch.io and Netlify, gather feedback.</li>
            <li><strong>Week 8+:</strong> Polish or scope down. Ship.</li>
          </ol>

          <h3>Path C: "I want browser 3D"</h3>
          <ol>
            <li><strong>Week 1-2:</strong> Three.js basics. Rotating cube, textures, lights, load a GLTF model.</li>
            <li><strong>Week 3:</strong> Add controls (orbit, FPS). Add physics with Rapier.</li>
            <li><strong>Week 4-6:</strong> Build a simple game (golf, racing demo, walker).</li>
            <li><strong>Decision:</strong> stay with Three.js + R3F or try Babylon.js for a more engine-like experience.</li>
          </ol>

          <h3>Path D: "I want to make a multiplayer game"</h3>
          <ol>
            <li><strong>Pre-req:</strong> Have shipped a working single-player game first. Trust me.</li>
            <li>Learn Colyseus. Build their tutorials. Understand authoritative server.</li>
            <li>Build a local 2-player game (same room, websockets). No prediction yet.</li>
            <li>Add interpolation. Other players should move smoothly.</li>
            <li>Add client prediction. Your own movement should feel instant.</li>
            <li>Add reconciliation. Handle server disagreement.</li>
            <li>Profile and optimize. Tick rate, message batching, schema compression.</li>
          </ol>

          <h3>Path E: "I want a real game engine with web export"</h3>
          <ol>
            <li>Try Godot first. Build the 2D platformer tutorial. Build the 3D tutorial.</li>
            <li>Export to HTML5. Understand what <code>.pck</code>, <code>.wasm</code>, <code>.js</code> files are.</li>
            <li>Deploy to itch.io. Smallest friction host.</li>
            <li>If 3D AAA quality needed → PlayCanvas. If cross-platform priority → Unity (and accept the web bundle penalty).</li>
          </ol>
        </section>

        {/* SECTION 16 — APPENDICES */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">A</span>Appendices</h2>

          <h3>Free asset sources</h3>
          <table>
            <tbody>
              <tr><th>Source</th><th>Type</th><th>License</th></tr>
              <tr><td><a href="https://kenney.nl/" target="_blank" rel="noreferrer">Kenney.nl</a></td><td>2D + 3D sprites, audio</td><td>CC0</td></tr>
              <tr><td><a href="https://opengameart.org/" target="_blank" rel="noreferrer">OpenGameArt</a></td><td>All types</td><td>Mixed (check)</td></tr>
              <tr><td><a href="https://itch.io/game-assets/free" target="_blank" rel="noreferrer">itch.io asset packs</a></td><td>All types</td><td>Mixed</td></tr>
              <tr><td><a href="https://freesound.org/" target="_blank" rel="noreferrer">freesound.org</a></td><td>Audio</td><td>Mixed</td></tr>
              <tr><td><a href="https://sketchfab.com/3d-models?features=downloadable" target="_blank" rel="noreferrer">Sketchfab</a></td><td>3D models</td><td>CC variants</td></tr>
              <tr><td><a href="https://www.mixamo.com/" target="_blank" rel="noreferrer">Mixamo</a></td><td>3D characters + animations</td><td>Free with Adobe ID</td></tr>
              <tr><td><a href="https://quaternius.com/" target="_blank" rel="noreferrer">Quaternius</a></td><td>3D models, low-poly</td><td>CC0</td></tr>
            </tbody>
          </table>

          <h3>Essential tools</h3>
          <table>
            <tbody>
              <tr><th>Tool</th><th>Purpose</th></tr>
              <tr><td><strong>TexturePacker</strong> / <a href="https://free-tex-packer.com/" target="_blank" rel="noreferrer">free-tex-packer</a></td><td>Spritesheets</td></tr>
              <tr><td><strong>Tiled</strong></td><td>Tilemap editor (loads into Phaser, Godot, etc.)</td></tr>
              <tr><td><strong>Aseprite</strong> ($20) / <strong>LibreSprite</strong> (free)</td><td>Pixel art + animation</td></tr>
              <tr><td><strong>Blender</strong></td><td>3D modeling, animation (free)</td></tr>
              <tr><td><strong>Audacity</strong></td><td>Audio editing (free)</td></tr>
              <tr><td><strong>Bfxr</strong> / <strong>ChipTone</strong></td><td>Retro sound effects (free)</td></tr>
              <tr><td><strong>Spine</strong> / <strong>DragonBones</strong></td><td>2D skeletal animation</td></tr>
            </tbody>
          </table>

          <h3>Books and references</h3>
          <ul>
            <li><strong>"Game Programming Patterns"</strong> by Robert Nystrom — <a href="https://gameprogrammingpatterns.com/" target="_blank" rel="noreferrer">free online</a></li>
            <li><strong>"Fix Your Timestep!"</strong> by Glenn Fiedler — <a href="https://gafferongames.com/post/fix_your_timestep/" target="_blank" rel="noreferrer">article</a></li>
            <li><strong>"Fast-Paced Multiplayer"</strong> by Gabriel Gambetta — <a href="https://www.gabrielgambetta.com/client-server-game-architecture.html" target="_blank" rel="noreferrer">series</a></li>
            <li><strong>"The Nature of Code"</strong> by Daniel Shiffman — <a href="https://natureofcode.com/" target="_blank" rel="noreferrer">free online</a> (great for procedural / generative behavior)</li>
            <li><strong>"Real-Time Rendering"</strong> — the bible for 3D graphics theory</li>
            <li><strong>"The Art of Game Design: A Book of Lenses"</strong> by Jesse Schell — design, not code</li>
          </ul>

          <hr />
          <h3>Closing thoughts</h3>
          <p>There is no "best" web game stack — only the right tool for your game. <strong>Pick by the constraints of your project</strong>, not by which is trendy.</p>
          <ol>
            <li><strong>Ship something simple before something complex.</strong> Finishing a Snake clone teaches you more than half-building an MMO.</li>
            <li><strong>Performance optimization is for AFTER you have a working game.</strong> Bundle size, draw call counts, ECS — none of it matters if you don't have something playable.</li>
            <li><strong>Art and sound matter more than code.</strong> A Pong made of beautiful sprites with juicy SFX outsells a beautifully-coded Pong with placeholder squares.</li>
            <li><strong>Web bundle size is a feature.</strong> Every megabyte costs you players.</li>
            <li><strong>The web platform is constantly improving.</strong> WebGPU is shipping. WebTransport is rolling out. WASM threading is mainstream.</li>
          </ol>
          <p>Whatever you pick, <strong>build the game</strong>. The tech is just plumbing.</p>
        </section>
      </main>
    </div>
  );
}
