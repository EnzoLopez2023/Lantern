import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                 icon: '🧠' },
  { id: 's2',  num: '2',  title: 'The Stack',                    icon: '🧱' },
  { id: 's3',  num: '3',  title: 'Phaser 4 Bootstrap',           icon: '🚀' },
  { id: 's4',  num: '4',  title: 'The Scene Pipeline',           icon: '🎬' },
  { id: 's5',  num: '5',  title: 'The Pure-TS Sim Core',         icon: '🧩' },
  { id: 's6',  num: '6',  title: 'Determinism (Seeded RNG)',     icon: '🎲' },
  { id: 's7',  num: '7',  title: 'Commands & Events',            icon: '📨' },
  { id: 's8',  num: '8',  title: 'Procedural Map Generation',    icon: '🗺️' },
  { id: 's9',  num: '9',  title: 'The Render Bridge',            icon: '🌉' },
  { id: 's10', num: '10', title: 'Testing a Game',               icon: '🧪' },
  { id: 's11', num: '★',  title: 'Lab: Deterministic Mini-Sim',  icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',              icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                  icon: '📋' },
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

export default function PhaserGameGuide() {
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
            <span className="sidebar-title">Phaser 4 Game Architecture</span>
          </div>
          <div className="sidebar-sub">sovereign-tactics deep dive</div>
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
          <div className="hero-tag">🎮 Phaser 4.1 · TypeScript 6 · 2026</div>
          <h1>Phaser 4 Game Architecture<br />(sovereign-tactics deep dive)</h1>
          <p>
            sovereign-tactics is the fleet's only game — an Empire-Deluxe-style strategy game on
            <strong style={{ color: '#C77AA0' }}> Phaser 4.1</strong> + TypeScript 6 + Vite 8, with{' '}
            <strong style={{ color: '#C77AA0' }}>no backend</strong> (it deploys as a static <code>dist/</code>). Its
            defining decision is a hard split: a <strong style={{ color: '#C77AA0' }}>pure-TS, deterministic
            simulation core</strong> in <code>src/core/</code> that imports zero Phaser, and a thin Phaser
            <em> render layer</em> that animates the events the core emits. That boundary is what makes the game
            replayable, testable without a browser, and easy to reason about.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Phaser imports in core</span></div>
            <div className="hero-stat"><span className="hero-stat-val">4</span><span className="hero-stat-label">Scenes (Boot→Game)</span></div>
            <div className="hero-stat"><span className="hero-stat-val">1</span><span className="hero-stat-label">Seed → identical game</span></div>
            <div className="hero-stat"><span className="hero-stat-val">vitest</span><span className="hero-stat-label">Tests the core, no DOM</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            The single most important idea in this codebase: <strong>the game is a pure function of (seed +
            commands), and Phaser is just a viewer.</strong> The simulation never touches the screen; the renderer
            never decides game rules. They communicate across one narrow boundary — <em>commands</em> go in,
            <em> events</em> come out.
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  subgraph Core["src/core — pure TS, deterministic, no Phaser"]
    CMD[Command] --> ENGINE[TurnEngine.execute]
    ENGINE --> STATE[(GameState)]
    ENGINE --> EVT[GameEvent array]
    RNG[Seeded Rng] --> ENGINE
  end
  subgraph Render["src/render — Phaser 4"]
    SCENE[GameScene] -->|emits| CMD
    EVT -->|animate| QUEUE[AnimationQueue]
    QUEUE --> SPRITES[Sprites / tweens]
  end`} />
          <h3>Why split this way</h3>
          <ul>
            <li><strong>Testable without a browser.</strong> The core runs under vitest in Node — no canvas, no DOM,
              no Phaser. You can play thousands of turns in a unit test (§10).</li>
            <li><strong>Deterministic &amp; replayable.</strong> Same seed + same commands = byte-identical game. The
              RNG state serializes with the save, so a loaded game continues <em>exactly</em> as it would have (§6).</li>
            <li><strong>Pacing lives in the renderer.</strong> The core is synchronous and instant; AI "thinking"
              delays and movement tweens are presentation, not rules. The sim doesn't know what a millisecond is.</li>
            <li><strong>Swappable view.</strong> Because the core is Phaser-free, you could render it with the DOM,
              canvas, or a test harness without touching a rule.</li>
          </ul>
          <Note>
            This is the classic <strong>simulation/presentation split</strong> (a.k.a. "logic core + dumb renderer").
            It's the same instinct as keeping business logic out of React components — here it's keeping game rules out
            of Phaser scenes.
          </Note>
        </section>

        <hr />

        {/* SECTION 2 — STACK */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>The Stack</h2>
          <table>
            <tbody>
              <tr><th>Package</th><th>Version</th><th>Job</th></tr>
              <tr><td><code>phaser</code></td><td>4.1.0</td><td>WebGL/Canvas renderer, scenes, input, tweens, camera</td></tr>
              <tr><td><code>typescript</code></td><td>6.0.3</td><td>Strict mode; the fleet's first TS 6 app</td></tr>
              <tr><td><code>vite</code></td><td>8.0.16</td><td>Dev server + Rolldown prod build → static <code>dist/</code></td></tr>
              <tr><td><code>alea</code></td><td>1.0</td><td>Tiny seedable PRNG with exportable state (determinism)</td></tr>
              <tr><td><code>simplex-noise</code></td><td>4.0</td><td>Coherent noise for the procedural heightmap</td></tr>
              <tr><td><code>vitest</code></td><td>4.1</td><td>Unit tests over the pure core</td></tr>
              <tr><td><code>playwright</code></td><td>1.60</td><td>End-to-end smoke tests in a real browser</td></tr>
            </tbody>
          </table>
          <p>
            There is <strong>no Express, no SQLite, no auth</strong> — uniquely in the fleet, sovereign-tactics has no
            backend. <code>npm run build</code> is <code>tsc --noEmit &amp;&amp; vite build</code>; the output is a
            folder of static assets you can host anywhere. Saves go to the browser, not a server (§6).
          </p>
        </section>

        <hr />

        {/* SECTION 3 — BOOTSTRAP */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Phaser 4 Bootstrap</h2>
          <p>
            The entire entry point is one <code>new Phaser.Game(config)</code>. <code>type: Phaser.AUTO</code> picks
            WebGL when available and falls back to Canvas; <code>Scale.RESIZE</code> makes the game fill its parent and
            track window size; <code>scene</code> is the ordered list of scene classes:
          </p>
          <CodePre>{`// src/main.ts — the whole bootstrap
import Phaser from 'phaser';
import { BootScene } from './render/scenes/BootScene';
import { PreloadScene } from './render/scenes/PreloadScene';
import { MainMenuScene } from './render/scenes/MainMenuScene';
import { GameScene } from './render/scenes/GameScene';

new Phaser.Game({
  type: Phaser.AUTO,             // WebGL, fall back to Canvas
  parent: 'game',               // mount inside <div id="game">
  backgroundColor: '#0a1420',
  scale: {
    mode: Phaser.Scale.RESIZE,  // fill parent, follow window resizes
    width: '100%',
    height: '100%',
  },
  scene: [BootScene, PreloadScene, MainMenuScene, GameScene],
});`}</CodePre>
          <Note>
            <strong>Phaser 4 vs 3:</strong> the public API is largely source-compatible with Phaser 3, but v4 ships a
            rebuilt WebGL renderer and is authored TypeScript-first, so the types are far better. Most "Phaser 3"
            tutorials still apply — just install <code>phaser@4</code> and trust the types over the docs where they
            disagree.
          </Note>
        </section>

        <hr />

        {/* SECTION 4 — SCENES */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The Scene Pipeline</h2>
          <p>
            A Phaser <em>scene</em> is a self-contained stage with its own lifecycle. sovereign-tactics uses four, run
            in sequence — the canonical loading pipeline:
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  BOOT[BootScene<br/>config, first assets] --> PRE[PreloadScene<br/>load tileset + sprites]
  PRE --> MENU[MainMenuScene<br/>new game / load / options]
  MENU -->|start scene, pass setup| GAME[GameScene<br/>core + render bridge]
  GAME -->|return to menu| MENU`} />
          <h3>The lifecycle hooks</h3>
          <table>
            <tbody>
              <tr><th>Hook</th><th>When</th><th>Used for</th></tr>
              <tr><td><code>init(data)</code></td><td>On scene start, before preload</td><td>Read data passed from the previous scene</td></tr>
              <tr><td><code>preload()</code></td><td>After init</td><td>Queue asset loads (the loader runs them)</td></tr>
              <tr><td><code>create(data)</code></td><td>Once loads finish</td><td>Build the world, wire input, instantiate the sim</td></tr>
              <tr><td><code>update(t, dt)</code></td><td>Every frame</td><td>Per-frame work — camera, animation queue draining</td></tr>
            </tbody>
          </table>
          <h3>Switching scenes &amp; passing data</h3>
          <p>
            One scene hands off to the next with <code>this.scene.start(key, data)</code>; the receiving scene reads
            <code>data</code> in <code>init</code>/<code>create</code>. That's how the menu tells <code>GameScene</code>
            whether to start a new game or load a saved one:
          </p>
          <CodePre>{`// MainMenuScene → GameScene
this.scene.start('GameScene', { setup: { mapWidth: 40, mapHeight: 28, players } });
// …or resume a saved game:
this.scene.start('GameScene', { loadRecord });

// GameScene picks one path or the other in create(data):
create(data: { setup?: GameSetup; loadRecord?: GameStateRecord }) {
  this.state = data.loadRecord
    ? GameState.fromRecord(data.loadRecord)     // deterministic resume
    : GameState.newGame(data.setup ?? DEFAULT_SETUP);
  this.engine = new TurnEngine(this.state);
  // …
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 5 — CORE */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>The Pure-TS Sim Core</h2>
          <p>
            Everything in <code>src/core/</code> is plain TypeScript with <strong>no Phaser, no DOM, no I/O</strong>.
            That rule is load-bearing — it's what keeps the game testable and deterministic. The pieces:
          </p>
          <table>
            <tbody>
              <tr><th>File</th><th>Responsibility</th></tr>
              <tr><td><code>GameState.ts</code></td><td>The whole world: map, players, units, turn bookkeeping. Serializes to a versioned plain-data record.</td></tr>
              <tr><td><code>TurnEngine.ts</code></td><td>Validates + applies commands, returns events. The only thing that mutates state.</td></tr>
              <tr><td><code>commands.ts</code> / <code>events.ts</code></td><td>The two discriminated-union vocabularies crossing the core boundary.</td></tr>
              <tr><td><code>rng.ts</code></td><td>Seeded PRNG whose state serializes with the save.</td></tr>
              <tr><td><code>map/MapGen.ts</code></td><td>simplex-noise procedural terrain.</td></tr>
              <tr><td><code>Unit.ts</code> / <code>City.ts</code> / <code>Player.ts</code></td><td>Entities, each with a <code>*Record</code> type for save/load.</td></tr>
              <tr><td><code>pathfinding.ts</code> / <code>ai.ts</code></td><td>A* movement; the AI that emits commands like a player.</td></tr>
            </tbody>
          </table>
          <h3>State is a serializable record</h3>
          <p>
            <code>GameState</code> can flatten itself to a versioned plain object — no class instances, no functions —
            and rebuild from one. That record <em>is</em> the save file, and it's also how a loaded game resumes
            bit-for-bit (note <code>rngState</code> rides along):
          </p>
          <CodePre>{`export const SAVE_VERSION = 1;

export interface GameStateRecord {
  saveVersion: number;
  seed: string;
  rngState: RngState;          // ← the PRNG's internal state travels with the save
  nextEntityId: number;
  turnNumber: number;
  currentPlayerIndex: number;
  status: 'playing' | 'ended';
  winnerId: number | null;
  fogOfWar: boolean;
  map: MapRecord;
  players: PlayerRecord[];
  units: UnitRecord[];
}

// GameState.newGame(setup)  → fresh game from a seed
// GameState.fromRecord(rec) → exact resume of a saved game`}</CodePre>
          <Note kind="warn">
            The "no Phaser in core" rule is easy to violate accidentally — one <code>import Phaser</code> for a
            <code>Phaser.Math</code> helper and suddenly your unit tests need a canvas and your sim isn't portable.
            Keep math/geometry helpers in <code>core/</code> (see <code>manhattan</code>, <code>Vec2</code>) so the
            temptation never arises.
          </Note>
        </section>

        <hr />

        {/* SECTION 6 — DETERMINISM */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Determinism (Seeded RNG)</h2>
          <p>
            Determinism is a feature, not an accident. The whole simulation draws randomness from one seeded PRNG —
            never <code>Math.random()</code>. The <code>Rng</code> class wraps <code>alea</code> and, crucially,
            exposes <code>exportState</code>/<code>importState</code> so the generator's position can be saved and
            restored:
          </p>
          <CodePre>{`import Alea from 'alea';
export type RngState = [number, number, number, number];

export class Rng {
  readonly seed: string;
  private alea: ReturnType<typeof Alea>;

  constructor(seed: string, state?: RngState) {
    this.alea = Alea(seed);
    if (state) this.alea.importState(state);   // resume mid-stream
  }

  next(): number { return this.alea(); }              // float [0,1)
  int(min: number, max: number): number {             // inclusive int
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(items: readonly T[]): T { return items[this.int(0, items.length - 1)]; }

  exportState(): RngState { return this.alea.exportState(); }
}`}</CodePre>
          <h3>Why exportState matters</h3>
          <p>
            If you only saved the seed, a loaded game would re-roll from the <em>start</em> of the random stream and
            diverge from where the player actually was. By serializing the PRNG's internal state into the save record,
            a resumed game keeps drawing the <em>same</em> numbers it would have — every future combat roll and AI
            decision matches a never-interrupted playthrough.
          </p>
          <Note>
            <strong>Determinism leaks to hunt for:</strong> <code>Math.random()</code>, <code>Date.now()</code>,
            <code>performance.now()</code>, <code>Array.sort</code> with an unstable comparator, and iterating a
            <code>Set</code>/<code>Map</code> whose insertion order depends on timing. Route every "random" or
            "time-based" decision in the core through the seeded <code>Rng</code> and an explicit turn counter.
          </Note>
        </section>

        <hr />

        {/* SECTION 7 — COMMANDS & EVENTS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Commands &amp; Events</h2>
          <p>
            The core boundary is two discriminated unions. <strong>Commands</strong> are intents ("move this unit
            there"); <strong>events</strong> are facts about what happened ("unit moved", "unit destroyed"). Both UI and
            AI speak only commands; the renderer consumes only events. Nothing mutates state except
            <code>TurnEngine</code>:
          </p>
          <CodePre>{`// commands.ts — the only way anything mutates the simulation
export interface MoveUnit     { type: 'moveUnit';     unitId: number; to: Vec2; }
export interface AttackUnit   { type: 'attackUnit';   attackerId: number; defenderId: number; }
export interface SetPath      { type: 'setPath';      unitId: number; to: Vec2; }
export interface SetProduction{ type: 'setProduction';cityId: number; unitType: UnitType; }
export interface EndTurn      { type: 'endTurn'; }
export type Command = MoveUnit | AttackUnit | SetPath | SetProduction | EndTurn /* | … */;`}</CodePre>
          <h3>TurnEngine.execute — validate, apply, return events</h3>
          <p>
            <code>execute</code> is a synchronous switch over the command union. It validates (illegal commands are
            no-ops, not exceptions), mutates state, and pushes the ordered events the renderer will animate:
          </p>
          <CodePre>{`export class TurnEngine {
  constructor(readonly state: GameState) {}

  execute(cmd: Command): GameEvent[] {
    const events: GameEvent[] = [];
    if (this.state.status === 'ended') return events;

    switch (cmd.type) {
      case 'moveUnit':      this.moveUnit(cmd.unitId, cmd.to, events); break;
      case 'attackUnit':    this.attackUnit(cmd.attackerId, cmd.defenderId, events); break;
      case 'setProduction': this.setProduction(cmd.cityId, cmd.unitType, events); break;
      case 'endTurn':       this.endTurn(events); break;
      // …
    }
    return events;   // ← ordered facts for the presentation layer to animate
  }
}`}</CodePre>
          <Note>
            Because illegal commands are silently rejected inside <code>execute</code>, the UI can be optimistic and
            the AI can be naive — neither can corrupt state. And because the return value is a plain array of events,
            the same engine output drives the renderer, the test asserts, and (if you wanted) a network replay.
          </Note>
        </section>

        <hr />

        {/* SECTION 8 — MAP GEN */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Procedural Map Generation</h2>
          <p>
            Terrain is a fractal-Brownian-motion heightmap built from <strong>simplex noise</strong>. The trick that
            keeps it deterministic: <code>createNoise2D</code> takes a random source, and sovereign-tactics feeds it the
            <em>seeded</em> <code>Rng</code> — so the same seed produces the same continents every time:
          </p>
          <CodePre>{`import { createNoise2D } from 'simplex-noise';

// Three independent noise fields — each createNoise2D drains ~256 rng values.
const heightNoise = createNoise2D(() => rng.next());
const mountNoise  = createNoise2D(() => rng.next());
const forestNoise = createNoise2D(() => rng.next());

// fBm: sum octaves of noise at increasing frequency / decreasing amplitude
function fbm(noise, x, y, octaves = 4) {
  let value = 0, amp = 1, freq = 1, norm = 0;
  for (let o = 0; o < octaves; o++) {
    value += amp * noise(x * freq, y * freq);
    norm  += amp;
    amp   *= 0.5;
    freq  *= 2;
  }
  return value / norm;            // back into ~[-1, 1]
}
// elevation → ocean / coast / land / mountain thresholds`}</CodePre>
          <Note kind="warn">
            Feeding <code>createNoise2D</code> the seeded RNG means map generation <em>consumes</em> RNG draws in a
            fixed order. If you reorder those three <code>createNoise2D</code> calls, every downstream roll shifts and
            existing seeds generate different worlds. Treat the order of RNG consumption as part of your save format.
          </Note>
        </section>

        <hr />

        {/* SECTION 9 — RENDER BRIDGE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>The Render Bridge</h2>
          <p>
            <code>GameScene</code> is where the two worlds meet. It owns a <code>GameState</code> + <code>TurnEngine</code>
            and an <code>AnimationQueue</code>. Input and AI both funnel into one helper:
            <em>execute a command, then feed the resulting events to the queue</em>:
          </p>
          <CodePre>{`// GameScene wires core → Phaser
import { GameState, type GameSetup } from '../../core/GameState';
import { TurnEngine } from '../../core/TurnEngine';
import { runAITurn } from '../../core/ai';
import { AnimationQueue } from '../AnimationQueue';

create(data) {
  this.state  = data.loadRecord ? GameState.fromRecord(data.loadRecord)
                                : GameState.newGame(data.setup);
  this.engine = new TurnEngine(this.state);
  this.queue  = new AnimationQueue(this /* scene */, this.state /* … */);
}

// every player intent and AI move goes through one funnel:
private runCommandEvents(events: GameEvent[]) {
  this.queue.enqueue(events);   // tweens, delays, sprite updates — pacing lives here
}

onProduceUnit(cityId, unitType) {
  this.runCommandEvents(this.engine.execute({ type: 'setProduction', cityId, unitType }));
}`}</CodePre>
          <h3>Pacing belongs to the renderer</h3>
          <p>
            The engine returns all events instantly. The <code>AnimationQueue</code> is what spaces them out — a
            move tween takes <code>MOVE_TWEEN_MS</code>, the AI "thinks" for <code>AI_THINK_MS</code> before its turn,
            a turn auto-ends after <code>AUTO_END_TURN_MS</code>. None of those numbers exist in the core. That's the
            payoff of the split: you tune game-feel entirely in the render layer without ever risking a rule.
          </p>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as Input / AI
  participant E as TurnEngine (core)
  participant Q as AnimationQueue (render)
  participant P as Phaser
  U->>E: execute(command)
  E-->>U: GameEvent[] (instant)
  U->>Q: enqueue(events)
  Q->>P: tween / delay / sprite update
  P-->>Q: tween complete → next event`} />
        </section>

        <hr />

        {/* SECTION 10 — TESTING */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Testing a Game</h2>
          <p>
            Games are notoriously hard to test — except when the rules live in a pure core. sovereign-tactics tests the
            <em>entire</em> simulation under <strong>vitest</strong> with no Phaser and no DOM, and uses
            <strong> Playwright</strong> only for a thin "does it boot and render" smoke test.
          </p>
          <h3>Unit-testing the core (vitest)</h3>
          <CodePre>{`// core.test.ts — pure TS, no Phaser, no DOM
import { describe, expect, it } from 'vitest';
import { GameState } from './GameState';

describe('map generation', () => {
  it('is deterministic for the same seed', () => {
    const a = GameState.newGame({ seed: 'test-seed', mapWidth: 30, mapHeight: 20, players });
    const b = GameState.newGame({ seed: 'test-seed', mapWidth: 30, mapHeight: 20, players });
    expect(a.map.terrain).toEqual(b.map.terrain);          // identical worlds
  });

  it('differs across seeds', () => {
    const a = GameState.newGame({ seed: 'one', /* … */ });
    const b = GameState.newGame({ seed: 'two', /* … */ });
    expect(a.map.terrain).not.toEqual(b.map.terrain);
  });
});`}</CodePre>
          <p>
            The same file round-trips save/load (<code>fromRecord(state.toRecord())</code> deep-equals the original),
            plays full AI turns via <code>runAITurn</code>, and asserts combat/production outcomes — all in
            milliseconds, because there's no renderer to spin up.
          </p>
          <h3>End-to-end (Playwright)</h3>
          <p>
            Playwright drives a real browser to catch the things a unit test can't: the canvas mounts, the menu
            renders, "New Game" reaches <code>GameScene</code>, no console errors. You want a <em>few</em> of these, not
            hundreds — they're slow and they overlap with what the core tests already prove.
          </p>
          <Note>
            The rule of thumb: <strong>test rules in the core, test wiring in the browser.</strong> If a test needs a
            canvas to assert a game <em>rule</em>, that rule is in the wrong layer.
          </Note>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — A Deterministic Mini-Sim</h2>
          <p>
            Build the smallest possible version of this architecture: a seeded core with a command/event boundary, then
            a Phaser scene that renders it. No game design — just the skeleton.
          </p>
          <h3>Step 1 — scaffold</h3>
          <CodePre>{`npm create vite@latest mini-sim -- --template vanilla-ts
cd mini-sim
npm i phaser alea
npm i -D vitest`}</CodePre>
          <h3>Step 2 — the pure core (no Phaser)</h3>
          <CodePre>{`// core.ts
import Alea from 'alea';

export interface State { seed: string; tick: number; dots: { x: number; y: number }[]; }
export type Command = { type: 'spawn' } | { type: 'tick' };
export type Event = { type: 'spawned'; x: number; y: number } | { type: 'ticked' };

export function newGame(seed: string): State { return { seed, tick: 0, dots: [] }; }

export function execute(state: State, cmd: Command, rng: () => number): Event[] {
  if (cmd.type === 'spawn') {
    const x = Math.floor(rng() * 100), y = Math.floor(rng() * 100);
    state.dots.push({ x, y });
    return [{ type: 'spawned', x, y }];
  }
  state.tick++;
  return [{ type: 'ticked' }];
}`}</CodePre>
          <h3>Step 3 — prove determinism (vitest)</h3>
          <CodePre>{`// core.test.ts
import { expect, it } from 'vitest';
import Alea from 'alea';
import { newGame, execute } from './core';

it('same seed → same dots', () => {
  const run = () => {
    const s = newGame('seed'); const rng = Alea('seed');
    for (let i = 0; i < 5; i++) execute(s, { type: 'spawn' }, rng);
    return s.dots;
  };
  expect(run()).toEqual(run());   // identical every time
});`}</CodePre>
          <h3>Step 4 — render it with Phaser</h3>
          <CodePre>{`// main.ts
import Phaser from 'phaser';
import Alea from 'alea';
import { newGame, execute, type Event } from './core';

class GameScene extends Phaser.Scene {
  create() {
    const state = newGame('seed');
    const rng = Alea('seed');
    this.input.on('pointerdown', () => {
      const events = execute(state, { type: 'spawn' }, rng);   // command in
      for (const e of events as Event[])                       // events out → render
        if (e.type === 'spawned') this.add.circle(e.x * 6, e.y * 6, 6, 0xC77AA0);
    });
  }
}
new Phaser.Game({ type: Phaser.AUTO, parent: 'app', width: 640, height: 640, scene: [GameScene] });`}</CodePre>
          <p>You now have the exact shape of sovereign-tactics in ~40 lines: a testable core, a command/event seam, and Phaser as a dumb viewer.</p>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause / Fix</th></tr>
              <tr><td>Loaded save diverges from where you were</td><td>You saved only the seed, not the RNG state. Serialize <code>rng.exportState()</code> and restore with <code>importState</code> (§6).</td></tr>
              <tr><td>Same seed makes different maps</td><td>A determinism leak — <code>Math.random()</code>/<code>Date.now()</code> in the core, or you reordered RNG consumption (e.g. the <code>createNoise2D</code> calls). Route all randomness through the seeded <code>Rng</code>.</td></tr>
              <tr><td>Core test wants a canvas / <code>window</code></td><td>Phaser leaked into <code>src/core</code>. Move the offending helper into the core as pure TS; keep the import boundary clean.</td></tr>
              <tr><td>Animations overlap / fire instantly</td><td>You rendered straight off <code>execute()</code> instead of queuing. Feed events through the <code>AnimationQueue</code> so pacing serializes (§9).</td></tr>
              <tr><td>Game doesn't resize with the window</td><td>Use <code>scale.mode: Phaser.Scale.RESIZE</code> and a percentage width/height (§3); recompute layout on the scene's <code>resize</code> event.</td></tr>
              <tr><td>Blank screen, no error</td><td>A scene threw in <code>create</code> and Phaser swallowed it, or assets failed in <code>preload</code>. Add a Playwright smoke test that asserts no console errors (§10).</td></tr>
              <tr><td>Illegal move crashes the game</td><td>Don't throw in <code>execute</code>. Validate and return an empty event list — illegal commands should be no-ops (§7).</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>
          <table>
            <tbody>
              <tr><th>Need</th><th>Reach for</th></tr>
              <tr><td>Boot a Phaser game</td><td><code>new Phaser.Game({'{'} type: Phaser.AUTO, scene: [...] {'}'})</code></td></tr>
              <tr><td>Fill the window</td><td><code>scale: {'{'} mode: Phaser.Scale.RESIZE, width:'100%', height:'100%' {'}'}</code></td></tr>
              <tr><td>Asset loading flow</td><td>Boot → Preload (<code>preload()</code>) → MainMenu → Game</td></tr>
              <tr><td>Pass data between scenes</td><td><code>this.scene.start('GameScene', data)</code> → read in <code>create(data)</code></td></tr>
              <tr><td>Keep rules testable</td><td>Pure-TS <code>src/core</code> — zero Phaser/DOM imports</td></tr>
              <tr><td>Deterministic randomness</td><td>Seeded <code>Rng</code> over <code>alea</code>; never <code>Math.random()</code></td></tr>
              <tr><td>Resumable saves</td><td>Serialize <code>rngState</code> in the save record; <code>importState</code> on load</td></tr>
              <tr><td>Mutate the simulation</td><td>Only through <code>TurnEngine.execute(command) → events</code></td></tr>
              <tr><td>Procedural terrain</td><td><code>createNoise2D(() =&gt; rng.next())</code> + fBm octaves</td></tr>
              <tr><td>Animate without blocking rules</td><td>Feed engine events to an <code>AnimationQueue</code> in the renderer</td></tr>
              <tr><td>Test the game</td><td>vitest on the core (fast, deterministic) + a few Playwright smoke tests</td></tr>
              <tr><td>Ship it</td><td><code>tsc --noEmit &amp;&amp; vite build</code> → static <code>dist/</code>, host anywhere</td></tr>
            </tbody>
          </table>
          <p className="finished-marker">★ sovereign-tactics — a deterministic strategy sim that happens to be drawn by Phaser.</p>
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
