import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'tsconfig Knob-by-Knob',               icon: '⚙️' },
  { id: 's3',  num: '3',  title: 'The Strictness Ladder',               icon: '🪜' },
  { id: 's4',  num: '4',  title: 'Discriminated Unions',                icon: '🔀' },
  { id: 's5',  num: '5',  title: 'Type Narrowing',                      icon: '🔭' },
  { id: 's6',  num: '6',  title: 'Generics',                            icon: '🅰️' },
  { id: 's7',  num: '7',  title: 'as const · satisfies · branded',      icon: '🏷️' },
  { id: 's8',  num: '8',  title: 'noUnused Pair',                       icon: '🧹' },
  { id: 's9',  num: '9',  title: 'Strict Null Checks',                  icon: '🕳️' },
  { id: 's10', num: '10', title: 'Migrating JSX → TSX',                 icon: '🚚' },
  { id: 's11', num: '★',  title: 'Lab: Discriminated Union',            icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                     icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                         icon: '📋' },
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

export default function TypeScriptStrictGuide() {
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
            <span className="sidebar-title">TypeScript Strict Mode</span>
          </div>
          <div className="sidebar-sub">From relaxed to airtight</div>
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
          <div className="hero-tag">🎯 TypeScript 5.9 / 6.0 · 2026</div>
          <h1>TypeScript Strict Mode<br />in Practice</h1>
          <p>
            Six of the ten fleet apps run <strong style={{ color: '#C77AA0' }}>strict mode</strong>; three of those add
            <code>noUnusedLocals</code> + <code>noUnusedParameters</code> so unused imports fail the build. Most apps are
            on TypeScript 5.9; sovereign-tactics is the first to move to <strong style={{ color: '#C77AA0' }}>TypeScript 6.0</strong>. This guide
            walks every relevant compiler knob, the strictness ladder across the fleet, and the type-level patterns each
            app actually leans on.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">8</span><span className="hero-stat-label">Apps Surveyed</span></div>
            <div className="hero-stat"><span className="hero-stat-val">6</span><span className="hero-stat-label">Use TypeScript</span></div>
            <div className="hero-stat"><span className="hero-stat-val">4</span><span className="hero-stat-label">Strict Mode On</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Strictest Tier</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            TypeScript is a static analyzer that compiles to JavaScript. Its job: <em>before</em> your code runs,
            prove that values flow through your program in ways that won't crash at runtime. The proof is the type
            system; failing to prove something is a compile error.
          </p>

          <h3>Two analogies that explain it</h3>
          <p>
            <strong>JS lies, TS asks.</strong> JavaScript will happily concatenate a number with <code>undefined</code>
            and hand you back <code>"5undefined"</code>. TypeScript stops you and asks "are you sure that variable can
            never be undefined here?" Strict mode is the difference between TypeScript suggesting and TypeScript
            insisting.
          </p>
          <p>
            <strong>The contract analogy.</strong> A type annotation is a contract between two parts of your code.
            "This function takes a string and returns a number." Strict mode is the lawyer who refuses to let you sign a
            contract you might not honor (e.g. accepting <code>string | undefined</code> as the input).
          </p>

          <h3>Strict mode is not one flag</h3>
          <p><code>"strict": true</code> is shorthand that enables this group at once:</p>
          <table>
            <tbody>
              <tr><th>Flag</th><th>What it does</th></tr>
              <tr><td><code>strictNullChecks</code></td><td><code>null</code> and <code>undefined</code> are no longer assignable to every type</td></tr>
              <tr><td><code>strictFunctionTypes</code></td><td>Function parameters are checked <em>contravariantly</em> (catches subtle subclass bugs)</td></tr>
              <tr><td><code>strictBindCallApply</code></td><td><code>fn.bind/call/apply</code> are type-checked instead of being escape hatches</td></tr>
              <tr><td><code>strictPropertyInitialization</code></td><td>Class fields must be initialized in the constructor</td></tr>
              <tr><td><code>noImplicitAny</code></td><td>Implicit <code>any</code> (untyped variable/param) is an error</td></tr>
              <tr><td><code>noImplicitThis</code></td><td><code>this</code> with implicit <code>any</code> type is an error</td></tr>
              <tr><td><code>alwaysStrict</code></td><td>Emit <code>"use strict"</code> in every generated file</td></tr>
              <tr><td><code>useUnknownInCatchVariables</code></td><td><code>catch (e)</code> gives <code>unknown</code>, not <code>any</code></td></tr>
            </tbody>
          </table>

          <h3>Why bother — what strict mode catches</h3>
          <ul>
            <li><strong>Forgot to handle <code>null</code>:</strong> "Object is possibly 'undefined'" before you ship the page that NPE's at 3am.</li>
            <li><strong>Off-by-one in a refactor:</strong> renamed a property; TS flags every reader.</li>
            <li><strong>Stale API client:</strong> server changed a field's shape; TS marks every call site.</li>
            <li><strong>Exhaustiveness:</strong> a new union variant; TS yells at every <code>switch</code> that doesn't handle it.</li>
            <li><strong>Race-free refactoring:</strong> rename a type, every consumer breaks immediately rather than at runtime in production.</li>
          </ul>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              The payoff curve is steep. The first day with strict mode is annoying. By day three, you'll catch a bug at
              compile time that would have cost an hour to diagnose at runtime. By month one, you'll forget how you ever
              shipped without it.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 2 — TSCONFIG */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>tsconfig — Knob by Knob</h2>
          <p>The strictest <code>tsconfig.app.json</code> in the fleet (Workshop) — every meaningful knob explained.</p>

          <CodePre>{`// workshop/tsconfig.app.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "erasableSyntaxOnly": true
  },
  "include": ["src"]
}`}</CodePre>

          <h3>Knobs that control output</h3>
          <table>
            <tbody>
              <tr><th>Knob</th><th>Meaning</th></tr>
              <tr><td><code>target</code></td><td>The ECMAScript version of the emitted JS. ES2022 covers everything modern browsers + Node 18+ support.</td></tr>
              <tr><td><code>module</code></td><td>The module system in emitted output. ESNext = ES modules, leave choices to the bundler.</td></tr>
              <tr><td><code>moduleResolution</code></td><td><code>bundler</code> tells TS "follow how Vite/esbuild resolves imports" (no requirement for <code>.js</code> extensions).</td></tr>
              <tr><td><code>noEmit</code></td><td>Don't emit JS. Vite handles the actual transpile via esbuild; TS only type-checks.</td></tr>
              <tr><td><code>lib</code></td><td>Which type definitions to include. <code>DOM</code> for browser APIs; omit for Node-only.</td></tr>
              <tr><td><code>jsx</code></td><td><code>react-jsx</code> = auto-import JSX runtime; no <code>import React</code> needed.</td></tr>
              <tr><td><code>useDefineForClassFields</code></td><td>Compile class fields with <code>Object.defineProperty</code> (spec behavior) not <code>=</code>.</td></tr>
            </tbody>
          </table>

          <h3>Knobs that control strictness</h3>
          <table>
            <tbody>
              <tr><th>Knob</th><th>Meaning</th></tr>
              <tr><td><code>strict</code></td><td>The eight-flag bundle from §1.</td></tr>
              <tr><td><code>noUnusedLocals</code></td><td>Unused local variable → error.</td></tr>
              <tr><td><code>noUnusedParameters</code></td><td>Unused function parameter → error. Prefix with <code>_</code> to opt out.</td></tr>
              <tr><td><code>noFallthroughCasesInSwitch</code></td><td><code>case</code> blocks must <code>break</code>/<code>return</code>.</td></tr>
              <tr><td><code>noUncheckedIndexedAccess</code></td><td>Index access (<code>obj[key]</code>) returns <code>T | undefined</code>. (PulseWire uses this.)</td></tr>
              <tr><td><code>noImplicitOverride</code></td><td>Subclass overrides must use <code>override</code> keyword.</td></tr>
              <tr><td><code>useUnknownInCatchVariables</code></td><td><code>catch (e)</code> is <code>unknown</code>; you must narrow before using.</td></tr>
              <tr><td><code>exactOptionalPropertyTypes</code></td><td><code>{`{ x?: number }`}</code> rejects <code>{`{ x: undefined }`}</code> — only <em>missing</em> property is allowed.</td></tr>
            </tbody>
          </table>

          <h3>Knobs that control imports</h3>
          <table>
            <tbody>
              <tr><th>Knob</th><th>Meaning</th></tr>
              <tr><td><code>verbatimModuleSyntax</code></td><td>Keep <code>import</code>/<code>export</code> verbatim; type-only imports must use <code>import type</code>.</td></tr>
              <tr><td><code>allowImportingTsExtensions</code></td><td>Allow <code>./foo.ts</code> in imports (bundlers strip the extension).</td></tr>
              <tr><td><code>moduleDetection: "force"</code></td><td>Every file is a module (eliminates the "file with no imports is a script" ambiguity).</td></tr>
              <tr><td><code>isolatedModules</code></td><td>Each file must be transpilable on its own. Required for Vite/esbuild.</td></tr>
              <tr><td><code>erasableSyntaxOnly</code></td><td>Only allow TS syntax that pure-JS bundlers can erase. Bans <code>enum</code>, parameter properties.</td></tr>
              <tr><td><code>resolveJsonModule</code></td><td>Allow <code>import data from "./file.json"</code>.</td></tr>
            </tbody>
          </table>

          <h3>Other useful knobs</h3>
          <table>
            <tbody>
              <tr><th>Knob</th><th>Meaning</th></tr>
              <tr><td><code>skipLibCheck</code></td><td>Don't type-check <code>node_modules/.d.ts</code> files. Almost always on — faster, and stale lib types in deps shouldn't fail your build.</td></tr>
              <tr><td><code>tsBuildInfoFile</code></td><td>Where to cache incremental compilation state.</td></tr>
              <tr><td><code>paths</code></td><td>Path aliasing — <code>"@/*": ["./src/*"]</code> lets you write <code>@/components/Foo</code>.</td></tr>
              <tr><td><code>types</code></td><td>Which <code>@types/*</code> packages to include globally (<code>["vite/client"]</code> in Vite apps).</td></tr>
              <tr><td><code>incremental</code></td><td>Cache type-check results between runs.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 3 — STRICTNESS LADDER */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The Strictness Ladder — Where Each App Sits</h2>
          <p>
            None of the apps are exactly the same on strictness. Here's the actual ladder across the TS apps, from
            "relaxed" to "airtight":
          </p>

          <MermaidDiagram theme="default" chart={`graph TD
  T0[GLP1 / Puzzlebox<br/>JSX only — no TS] --> T1[Cairn · SecretApp<br/>strict: false<br/>relaxed but TS-typed]
  T1 --> T2[ShopKeep · SecretPhoto<br/>strict: true<br/>nullable safety on]
  T2 --> T3[Tabloom · workshop · sovereign-tactics<br/>strict + noUnused pair<br/>unused imports fail build]
  T3 --> T4[PulseWire<br/>strict + noUncheckedIndexedAccess<br/>airtight, Next.js standard]`} />

          <h3>Per-app config table</h3>
          <table>
            <tbody>
              <tr><th>Repo</th><th><code>strict</code></th><th><code>noUnusedLocals</code></th><th><code>noUnusedParameters</code></th><th><code>noUncheckedIndexedAccess</code></th><th><code>target</code></th></tr>
              <tr><td>Cairn</td><td>false</td><td>false</td><td>false</td><td>—</td><td>ES2022</td></tr>
              <tr><td>SecretApp (Hearth)</td><td>false</td><td>false</td><td>false</td><td>—</td><td>ES2022</td></tr>
              <tr><td>ShopKeep</td><td>true</td><td>false</td><td>false</td><td>—</td><td>ES2023</td></tr>
              <tr><td>SecretPhoto</td><td>true</td><td>false</td><td>false</td><td>—</td><td>ES2023</td></tr>
              <tr><td>workshop</td><td>true</td><td>true</td><td>true</td><td>—</td><td>ES2022</td></tr>
              <tr><td>tabloom</td><td>true</td><td>true</td><td>true</td><td>—</td><td>ES2022</td></tr>
              <tr><td>sovereign-tactics</td><td>true</td><td>true</td><td>true</td><td>—</td><td>ES2022 (TS 6.0)</td></tr>
              <tr><td>PulseWire</td><td>true</td><td>—</td><td>—</td><td>true</td><td>ES2017</td></tr>
              <tr><td>GLP1</td><td>—</td><td>—</td><td>—</td><td>—</td><td>JSX-only</td></tr>
              <tr><td>Puzzlebox</td><td>—</td><td>—</td><td>—</td><td>—</td><td>JSX-only</td></tr>
            </tbody>
          </table>

          <h3>What each tier costs and buys</h3>
          <table>
            <tbody>
              <tr><th>Tier</th><th>Friction</th><th>Benefit</th></tr>
              <tr><td>JSX-only</td><td>Zero compile-time checks</td><td>Fastest iteration; bug surface = runtime only</td></tr>
              <tr><td>Strict false</td><td>Light</td><td>Catches type mismatches on annotated values; <code>null</code> still ignorable</td></tr>
              <tr><td>Strict true</td><td>Medium — must handle <code>null</code>/<code>undefined</code> everywhere</td><td>Nullable bug elimination</td></tr>
              <tr><td>+ noUnused pair</td><td>Medium-high — unused imports fail build</td><td>Forced cleanup; PRs can't smuggle dead code</td></tr>
              <tr><td>+ noUncheckedIndexedAccess</td><td>High — every <code>arr[i]</code> is <code>T | undefined</code></td><td>Catches off-by-one bugs at compile time</td></tr>
            </tbody>
          </table>

          <h3>Why Hearth still runs <code>"strict": false</code></h3>
          <p>
            Inherited tech debt. <code>App.tsx</code> renders well-typed code, but parts of the recipe and Plex flows
            still rely on implicit <code>any</code> chains. The opt-in plan: flip <code>strictNullChecks: true</code>
            alone (it's the highest-value flag) without enabling the full bundle. That surfaces nullable bugs without
            forcing a sweep through every implicit-<code>any</code>.
          </p>

          <h3>Suggested ladder for a new app</h3>
          <ol>
            <li><strong>Day 1:</strong> <code>"strict": true</code>. Pay the cost now, never retrofit.</li>
            <li><strong>Week 1:</strong> add <code>"noUnusedLocals": true</code> and <code>"noUnusedParameters": true</code>. PRs are cleaner; refactors are safer.</li>
            <li><strong>Month 1:</strong> add <code>"noFallthroughCasesInSwitch": true</code>. Cheap, catches real bugs.</li>
            <li><strong>When you cross 50 files:</strong> consider <code>"noUncheckedIndexedAccess": true</code>. It's a brutal flag — every <code>arr[i]</code> becomes <code>T | undefined</code> — but it surfaces real off-by-one bugs.</li>
            <li><strong>Skip:</strong> <code>"exactOptionalPropertyTypes"</code> until you genuinely need it. It interacts poorly with most React-ecosystem types.</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 4 — DISCRIMINATED UNIONS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Discriminated Unions — TS's Killer Feature</h2>
          <p>
            A discriminated union is a union type where every variant shares a common literal field (the
            <em>discriminant</em>) that lets TS narrow at the type level. It's the cleanest way to model "one of N
            states" — exactly the shape of view machines, API responses, form steps, and Redux actions.
          </p>

          <h3>The shape</h3>
          <CodePre>{`type Result<T> =
  | { kind: 'ok',  value: T }
  | { kind: 'err', error: string }

function handle(r: Result<number>) {
  if (r.kind === 'ok') {
    console.log(r.value)  // ← TS knows .value exists here
  } else {
    console.log(r.error)  // ← TS knows .error exists here
  }
}`}</CodePre>

          <p>The magic: TS reads <code>if (r.kind === 'ok')</code> and narrows <code>r</code> to <code>{`{ kind: 'ok', value: T }`}</code> inside the branch. No type assertions needed.</p>

          <h3>Hearth's AppView union</h3>
          <p>This file is the load-bearing type for the entire app:</p>
          <CodePre>{`// SecretApp/src/types/AppView.ts — verbatim
export type AppView =
  | 'dashboard'
  | 'chat'
  | 'halloween'
  | 'converter'
  | 'home-maintenance'
  | 'home-inventory'
  | 'yard-maintenance'
  | 'recipe-manager'
  | 'ai-test'
  | 'plex-command-center'
  | 'knowledge-base'
  | 'exam-prep-hub'`}</CodePre>

          <p>This is a degenerate discriminated union — just string literals, no payload. The discriminant <em>is</em> the value. When you add <code>'profile'</code> to the union, TypeScript flags every render branch, every label table, and every command-palette entry that doesn't handle it.</p>

          <h3>Upgrading to a payloaded union (ShopKeep pattern)</h3>
          <CodePre>{`type RouteState =
  | { name: 'dashboard' }
  | { name: 'tool-detail', toolId: number }
  | { name: 'scan' }
  | { name: 'reports', tab: 'spending' | 'inventory' };

function render(r: RouteState) {
  switch (r.name) {
    case 'dashboard':   return <Dashboard />;
    case 'tool-detail': return <ToolDetail id={r.toolId} />;   // ← .toolId narrowed in
    case 'scan':        return <Scanner />;
    case 'reports':     return <Reports tab={r.tab} />;        // ← .tab narrowed in
    // No default needed — exhaustive switch
  }
}`}</CodePre>

          <h3>Exhaustiveness check</h3>
          <p>The trick to make sure your switch covers every variant: assign the not-yet-matched value to <code>never</code>:</p>
          <CodePre>{`function assertNever(x: never): never {
  throw new Error(\`Unreachable: \${JSON.stringify(x)}\`);
}

function render(r: RouteState) {
  switch (r.name) {
    case 'dashboard':   return <Dashboard />;
    case 'tool-detail': return <ToolDetail id={r.toolId} />;
    case 'scan':        return <Scanner />;
    case 'reports':     return <Reports tab={r.tab} />;
    default:            return assertNever(r);  // ← TS errors if you add a variant + forget the case
  }
}`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              <strong>This is the strongest refactoring tool in TypeScript.</strong> Add a new variant; every place
              that needs to handle it fails the build. You ship a refactor, not a partial migration.
            </div>
          </div>

          <h3>API response unions — PulseWire</h3>
          <p>PulseWire models AI-call results as a discriminated union so the consumer must handle the pause case:</p>
          <CodePre>{`type AiCallResult<T> =
  | { ok: true,  data: T,         tokens: { input: number, output: number } }
  | { ok: false, error: 'paused', resumeAt: Date }
  | { ok: false, error: 'rate-limited', retryAfter: number }
  | { ok: false, error: 'other',  message: string }

async function callAi(...): Promise<AiCallResult<Summary>> { ... }

const r = await callAi(...);
if (!r.ok) {
  if (r.error === 'paused')       showCostCapBanner(r.resumeAt);
  else if (r.error === 'rate-limited') await sleep(r.retryAfter);
  else                                  toast.error(r.message);
  return;
}
render(r.data);  // ← .data narrowed in`}</CodePre>

          <h3>Common pitfall — multiple discriminants</h3>
          <CodePre>{`// 🚫 Doesn't narrow — TS can't pick which field is the discriminant
type Bad =
  | { type: 'a', a: number }
  | { type: 'b', b: string }
  | { type: 'a', a: string }  // ← duplicate 'a' breaks narrowing

// ✅ One discriminant, one variant per value
type Good =
  | { type: 'numeric', value: number }
  | { type: 'textual', value: string }`}</CodePre>
        </section>

        <hr />

        {/* SECTION 5 — TYPE NARROWING */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Type Narrowing</h2>
          <p>Narrowing = TS reducing a value's type to a more specific one based on what your code checks. This is half of what makes TS useful day-to-day.</p>

          <h3>The five narrowing patterns</h3>

          <h4>1. <code>typeof</code> guards</h4>
          <CodePre>{`function pad(n: string | number, width: number) {
  if (typeof n === 'string') {
    return n.padStart(width, '0');  // n: string
  }
  return n.toString().padStart(width, '0');  // n: number
}`}</CodePre>

          <h4>2. <code>instanceof</code> guards</h4>
          <CodePre>{`function area(s: Square | Circle) {
  if (s instanceof Circle) {
    return Math.PI * s.radius ** 2;  // s: Circle
  }
  return s.side ** 2;  // s: Square
}`}</CodePre>

          <h4>3. <code>in</code> guards</h4>
          <CodePre>{`function move(thing: Bird | Fish) {
  if ('fly' in thing) {
    thing.fly();   // thing: Bird
  } else {
    thing.swim();  // thing: Fish
  }
}`}</CodePre>

          <h4>4. Discriminant property (see §4)</h4>
          <CodePre>{`if (r.kind === 'ok') r.value
else r.error`}</CodePre>

          <h4>5. Equality narrowing</h4>
          <CodePre>{`function process(x: string | null) {
  if (x !== null) {
    x.toUpperCase()  // x: string
  }
}`}</CodePre>

          <h3>User-defined type guards</h3>
          <p>When the built-in narrowing isn't enough, write your own predicate. The return type <code>x is Foo</code> tells TS "if this returns true, narrow x to Foo":</p>
          <CodePre>{`function isString(x: unknown): x is string {
  return typeof x === 'string';
}

function logUpper(x: unknown) {
  if (isString(x)) {
    console.log(x.toUpperCase());  // x: string
  }
}`}</CodePre>

          <p>The fleet pattern: validate JSON-shaped data from a server with a user-defined guard.</p>
          <CodePre>{`interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
}

function isRecipe(x: unknown): x is Recipe {
  if (typeof x !== 'object' || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === 'number' &&
    typeof r.title === 'string' &&
    Array.isArray(r.ingredients) &&
    r.ingredients.every(i => typeof i === 'string')
  );
}

const data: unknown = await fetch('/api/recipes/42').then(r => r.json());
if (!isRecipe(data)) throw new Error('invalid recipe');
data.title.toUpperCase();  // safe`}</CodePre>

          <h3>Assertion functions</h3>
          <p>Same idea but throws instead of returning a boolean:</p>
          <CodePre>{`function assertDefined<T>(x: T | undefined, msg: string): asserts x is T {
  if (x === undefined) throw new Error(msg);
}

const found = list.find(x => x.id === id);
assertDefined(found, 'no such id');
found.name;  // ← TS knows found is non-undefined now`}</CodePre>

          <h3>Type-narrowing in practice — Puzzlebox's pencil/value toggle</h3>
          <CodePre>{`// Puzzlebox/src/App.jsx (TypeScript-equivalent)
const handleNumber = useCallback((num: number) => {
  if (!selected || !board || !puzzle || !solution) return;  // ← guard narrows out null
  const { r, c } = selected;                                 // ← .r, .c safe to access
  if (puzzle[r][c] !== 0) return;

  if (isPencil) {
    // Branch: adding a note. We can confidently mutate notes.
    const next = notes.map(row => row.map(s => new Set(s)));
    if (next[r][c].has(num)) next[r][c].delete(num);
    else next[r][c].add(num);
    setNotes(next);
  } else {
    // Branch: writing a value. Different state slice gets touched.
    const next = board.map(row => [...row]);
    next[r][c] = next[r][c] === num ? 0 : num;
    setBoard(next);
  }
}, [selected, board, notes, puzzle, solution, isPencil]);`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              Narrowing flows from <em>checked statements</em>, not declarations. <code>if (x)</code> narrows
              <code>string | null | undefined</code> down to <code>string</code> inside the block.
              <code>const x = maybe</code> doesn't.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 6 — GENERICS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Generics</h2>
          <p>
            A generic is a type variable — a placeholder you fill in at use time. <code>Array&lt;T&gt;</code> is the
            archetype: it works for any element type, but each instance is locked to one.
          </p>

          <h3>Function generics</h3>
          <CodePre>{`function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first([1, 2, 3]);     // T = number → n: number | undefined
const s = first(['a', 'b']);    // T = string → s: string | undefined`}</CodePre>

          <h3>Generic constraints</h3>
          <CodePre>{`function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alice', age: 30 };
pluck(user, 'name');    // ok, returns string
pluck(user, 'unknown'); // ❌ TS error: not a key of T`}</CodePre>

          <h3>Generic interfaces (data containers)</h3>
          <CodePre>{`interface ApiResponse<T> {
  data: T;
  meta: { timestamp: number; requestId: string };
}

type Recipe = { id: number; title: string };
type RecipeResponse = ApiResponse<Recipe>;        // { data: Recipe; meta: ... }
type RecipesResponse = ApiResponse<Recipe[]>;     // { data: Recipe[]; meta: ... }`}</CodePre>

          <h3>Generic React components</h3>
          <CodePre>{`interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyOf: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyOf }: ListProps<T>) {
  return <ul>{items.map(i => <li key={keyOf(i)}>{renderItem(i)}</li>)}</ul>;
}

// Usage — T is inferred from items
<List
  items={recipes}
  keyOf={r => r.id}
  renderItem={r => <RecipeCard recipe={r} />}
/>`}</CodePre>

          <h3>Real fleet example — Workshop's <code>CutPlanResult</code></h3>
          <p>Workshop's cut-plan optimizer uses typed result interfaces rather than a discriminated <code>Result</code> wrapper:</p>
          <CodePre>{`// workshop/src/lib/cutPlan.ts
export interface StockSheet {
  id: string; length: number; width: number; qty: number;
  label: string; thickness: string;
}

export interface CutPiece {
  id: string; partName: string; length: number; width: number;
  material: string; thickness: string;
}

export interface CutPlanResult {
  layouts: SheetLayout[];
  totalSheets: number;
  overallYieldPercent: number;
  totalCuts: number;
  skippedPieces: string[];
  unplacedPieces: string[];
}`}</CodePre>

          <h3>Where generics earn their keep</h3>
          <ul>
            <li><strong>API clients:</strong> one <code>fetcher&lt;T&gt;(url)</code> instead of typing every endpoint by hand.</li>
            <li><strong>State stores:</strong> a Zustand store factory, parameterized by the slice's type.</li>
            <li><strong>Form helpers:</strong> a <code>useForm&lt;T&gt;</code> where <code>T</code> is the form's value type.</li>
            <li><strong>Utility components:</strong> table cells, select inputs, list renderers.</li>
          </ul>

          <h3>Where generics over-engineer</h3>
          <p>A generic with one call site is just a type alias with extra steps. If the same type is used in three or more places <em>and</em> with two or more different inner types, generics earn their keep. Otherwise, just write the concrete type.</p>
        </section>

        <hr />

        {/* SECTION 7 — AS CONST · SATISFIES · BRANDED */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span><code>as const</code> · <code>satisfies</code> · branded types</h2>

          <h3><code>as const</code> — freeze a literal</h3>
          <p>
            Without it, TS widens literals to their general type: <code>{`{ x: 5 }`}</code> becomes
            <code>{`{ x: number }`}</code>. <code>as const</code> tells TS to keep the literal type.
          </p>
          <CodePre>{`const config = {
  theme: 'warm',
  maxRetries: 3,
  endpoints: ['/api/users', '/api/recipes']
};
// type: { theme: string; maxRetries: number; endpoints: string[] }

const config2 = {
  theme: 'warm',
  maxRetries: 3,
  endpoints: ['/api/users', '/api/recipes']
} as const;
// type: { readonly theme: 'warm'; readonly maxRetries: 3; readonly endpoints: readonly ['/api/users', '/api/recipes'] }`}</CodePre>

          <h3>Where it earns its keep</h3>
          <CodePre>{`// Without as const, you'd need to manually retype the union
const SEVERITIES = ['info', 'warn', 'error'] as const;
type Severity = (typeof SEVERITIES)[number];  // 'info' | 'warn' | 'error'

// Single source of truth — change the array, type updates automatically.`}</CodePre>

          <h3><code>satisfies</code> — assert without losing literal types</h3>
          <p>
            <code>satisfies T</code> tells TS "verify this expression matches type T, but don't widen the literal type."
            It's <code>as T</code>'s safer cousin.
          </p>
          <CodePre>{`type ColorMap = Record<string, [number, number, number]>;

// ❌ With "as ColorMap" — keys are now string, not literal
const palette = { rust: [160, 82, 45], sage: [120, 134, 99] } as ColorMap;
palette.rust       // OK
palette.unknown    // OK (any string is allowed — broke type safety)

// ✅ With satisfies — palette retains literal keys + values
const palette2 = {
  rust: [160, 82, 45],
  sage: [120, 134, 99]
} satisfies ColorMap;
palette2.rust       // OK
palette2.unknown    // ❌ TS error: property doesn't exist`}</CodePre>

          <h3>When to use which</h3>
          <table>
            <tbody>
              <tr><th>Tool</th><th>Use when</th></tr>
              <tr><td><code>as const</code></td><td>You want literal types preserved across the whole expression</td></tr>
              <tr><td><code>satisfies T</code></td><td>You want to check shape compatibility without widening</td></tr>
              <tr><td><code>as T</code></td><td>You're 100% sure of the runtime shape; TS can't infer it (rare — escape hatch)</td></tr>
            </tbody>
          </table>

          <h3>Branded types — runtime-distinct wrappers</h3>
          <p>
            <code>string</code> is <code>string</code> — TS can't tell a <code>UserId</code> string from a
            <code>RecipeId</code> string. Branded types tag a primitive at the type level (with no runtime cost) so the
            two can't be mixed up.
          </p>
          <CodePre>{`type UserId   = string & { __brand: 'UserId' };
type RecipeId = string & { __brand: 'RecipeId' };

function asUserId(s: string): UserId   { return s as UserId; }
function asRecipeId(s: string): RecipeId { return s as RecipeId; }

function fetchRecipe(id: RecipeId) { ... }

const uid = asUserId('user_123');
const rid = asRecipeId('rec_456');

fetchRecipe(rid);   // ✅
fetchRecipe(uid);   // ❌ TS error: UserId not assignable to RecipeId
fetchRecipe('rec_456');  // ❌ TS error: plain string not assignable`}</CodePre>

          <p>Use branded types when:</p>
          <ul>
            <li>You've shipped a bug where the wrong id was passed.</li>
            <li>Two columns in the same row are both strings but semantically different (e.g. <code>oid</code> vs <code>account_id</code>).</li>
            <li>You're handling user input that needs validation (e.g. <code>type Email = string &amp; {`{__email: true}`}</code>).</li>
          </ul>

          <h3>PulseWire's Zod schema → inferred types</h3>
          <p>PulseWire validates env vars with Zod, then infers the types — no manual interface declaration:</p>
          <CodePre>{`// PulseWire/src/env.ts
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    ENTRA_TENANT_ID: z.string().uuid(),
    ENTRA_CLIENT_ID: z.string().uuid(),
    ENTRA_CLIENT_SECRET: z.string().min(1),
    SESSION_SECRET: z.string().min(32),
    APP_BASE_URL: z.string().url(),
    AZURE_AI_ENDPOINT: z.string().url(),
    AZURE_AI_API_KEY: z.string().min(1),
    AZURE_AI_CHAT_DEPLOYMENT: z.string().min(1),
    AZURE_AI_EMBED_DEPLOYMENT: z.string().min(1),
    SENDGRID_API_KEY: z.string().optional(),
    COST_ALERT_EMAIL: z.string().email().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  client: {},
});`}</CodePre>
          <p>
            Anywhere in the codebase, <code>env.DATABASE_URL</code> has type <code>string</code>; <code>env.NODE_ENV</code>
            has type <code>'development' | 'test' | 'production'</code>; <code>env.SENDGRID_API_KEY</code> has type
            <code>string | undefined</code>. No drift between runtime validation and compile-time types.
          </p>
        </section>

        <hr />

        {/* SECTION 8 — NOUNUSED PAIR */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>The <code>noUnused</code> Pair</h2>
          <p>Workshop and Tabloom set both flags to <code>true</code>. Cairn, SecretApp, and ShopKeep leave them off. This section is about whether to flip them on.</p>

          <h3>What each flag does</h3>
          <CodePre>{`// noUnusedLocals
function example() {
  const result = compute();   // ❌ if 'result' is never read
  return 42;
}

// noUnusedParameters
function callback(event: Event, ctx: Context) {  // ❌ if 'ctx' is never read
  console.log(event.type);
}`}</CodePre>

          <h3>The <code>_</code> escape hatch</h3>
          <p>Prefix with underscore to opt out. This is the standard convention for "intentionally unused":</p>
          <CodePre>{`function callback(event: Event, _ctx: Context) {
  console.log(event.type);  // _ctx is fine — prefixed with _
}`}</CodePre>

          <h3>Why turn them on</h3>
          <ul>
            <li><strong>Unused imports stand out</strong> — a deleted feature's stranded imports fail the build immediately.</li>
            <li><strong>Refactors don't smuggle leftovers</strong> — renaming a function but leaving the old import? Build fails.</li>
            <li><strong>Forced clarity</strong> — every parameter must be either used or explicitly marked unused (the <code>_</code> prefix).</li>
            <li><strong>Diff hygiene</strong> — PR reviewers don't see leftover imports cluttering the change.</li>
          </ul>

          <h3>Why some teams don't</h3>
          <ul>
            <li><strong>Annoyance during incremental refactors</strong> — you commented out a call site temporarily; build won't pass until you also remove the now-unused import.</li>
            <li><strong>Test fixtures</strong> sometimes have parameters that exist for the type contract but aren't used in a specific test. The <code>_</code> prefix is the answer, but it adds noise.</li>
            <li><strong>Story-time tools</strong> (Storybook, Playwright) sometimes generate code that conflicts; either configure those tools to skip the check or use eslint-disable comments.</li>
          </ul>

          <h3>What workshop actually catches</h3>
          <p>From workshop's git history, real instances of bugs that <code>noUnusedLocals</code> caught:</p>
          <ul>
            <li>A renamed prop (<code>userId</code> → <code>oid</code>) where the destructure was added but the old reference wasn't removed. Build failed on <code>const &#123; userId &#125; = props</code>.</li>
            <li>An imported helper from a now-deleted file. Old <code>import &#123; foo &#125; from './deleted'</code> would have shipped as a broken import in JSX-only land; here, it's a compile error.</li>
            <li>A function parameter that was being passed through a chain of HOCs but never consumed. Removing the parameter cleaned up four call sites.</li>
          </ul>

          <h3>Recommendation</h3>
          <p>Turn them on for any new app. For existing apps, sequence the migration:</p>
          <ol>
            <li>Flip <code>noUnusedLocals: true</code> first. Fix or underscore the warnings in a single PR.</li>
            <li>Then flip <code>noUnusedParameters: true</code>. Some libraries' callback signatures will need the <code>_</code> prefix.</li>
            <li>Add a CI step: <code>npx tsc --noEmit</code>. Don't rely on the IDE.</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 9 — STRICT NULL CHECKS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Strict Null Checks</h2>
          <p>The single most valuable flag in the strict bundle. Without it, every type implicitly includes <code>null</code> and <code>undefined</code>. With it, you must be explicit.</p>

          <h3>What changes</h3>
          <CodePre>{`// Without strictNullChecks
function greet(name: string) {
  return 'Hi, ' + name.toUpperCase();   // ← no error
}
greet(null);  // ← no error, NPE at runtime

// With strictNullChecks
function greet(name: string) {
  return 'Hi, ' + name.toUpperCase();   // ← still no error
}
greet(null);  // ❌ TS: Argument of type 'null' is not assignable to 'string'`}</CodePre>

          <h3>The opt-in pattern: <code>T | null</code> and <code>T | undefined</code></h3>
          <CodePre>{`function lookup(id: string): User | undefined {
  return users.get(id);
}

const u = lookup('alice');
u.name;       // ❌ TS: Object is possibly 'undefined'
u?.name;      // ✅ optional chaining
if (u) u.name; // ✅ narrowed`}</CodePre>

          <h3>Non-null assertion <code>!</code></h3>
          <CodePre>{`const root = document.getElementById('root')!;  // ← I know it's there
ReactDOM.createRoot(root).render(<App />);`}</CodePre>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Use sparingly.</strong> <code>!</code> tells TS "trust me." When you're wrong, you NPE at runtime
              and the error message is unhelpful because TS didn't track it. Prefer optional chaining or a real guard.
            </div>
          </div>

          <h3>Optional chaining + nullish coalescing</h3>
          <CodePre>{`const name  = user?.profile?.name ?? 'Anonymous';   // ← name is string
const items = data?.items ?? [];                    // ← items is T[]
const fn    = callbacks?.onClick;                   // ← fn is fn | undefined
fn?.();                                              // ← calls if defined`}</CodePre>

          <h3>Optional parameters vs union with undefined</h3>
          <CodePre>{`function a(name?: string)          { ... }  // can be called as a() or a('x')
function b(name: string | undefined) { ... }  // must pass undefined explicitly: b(undefined)

// They look similar but differ in call-site ergonomics.
// Use ? for genuinely optional. Use | undefined when you mean "the caller computes this and might not have a value."`}</CodePre>

          <h3>Element access — <code>noUncheckedIndexedAccess</code></h3>
          <p>PulseWire turns this on. It's the strictest flag in the fleet's tsconfigs:</p>
          <CodePre>{`const arr: number[] = [1, 2, 3];
const x = arr[0];  // Without: x: number. With: x: number | undefined

const m: Record<string, User> = {};
const u = m['alice'];  // Without: u: User. With: u: User | undefined`}</CodePre>
          <p>This forces you to handle the "off-the-end-of-the-array" case. Painful, but catches real bugs.</p>

          <h3>Narrowing back to non-null</h3>
          <CodePre>{`function process(arr: number[]) {
  const first = arr[0];
  if (first === undefined) return 'empty';
  // first is number here
  return first * 2;
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 10 — MIGRATING JSX */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Migrating JSX → TSX</h2>
          <p>GLP1 and Puzzlebox are pure JSX. Both could move to TS without rewriting the world. Here's the playbook.</p>

          <h3>Step 1 — Install + scaffold</h3>
          <CodePre>{`npm i -D typescript @types/react @types/react-dom @types/node`}</CodePre>
          <CodePre>{`// tsconfig.json — copy from workshop, tweak target/lib if needed
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

// tsconfig.app.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,                          // ← start relaxed
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "allowJs": true,                          // ← key: lets old .jsx files coexist
    "noImplicitAny": false                    // ← key: don't fail on unannotated params yet
  },
  "include": ["src"]
}`}</CodePre>

          <h3>Step 2 — Rename file-by-file</h3>
          <p><code>App.jsx</code> → <code>App.tsx</code>. Don't add types yet; just rename. TypeScript will compile your existing JSX-as-TSX with mostly-permissive defaults.</p>

          <h3>Step 3 — Tighten gradually</h3>
          <ol>
            <li>Rename + commit. Repeat for ~5–10 files.</li>
            <li>Flip <code>noImplicitAny: true</code>. Fix the errors — most are <em>just</em> adding a type to a function parameter.</li>
            <li>Flip <code>strict: true</code>. Fix the null-related errors.</li>
            <li>Drop <code>allowJs</code> once all files are renamed.</li>
            <li>Add <code>noUnusedLocals</code> + <code>noUnusedParameters</code>.</li>
          </ol>

          <h3>Step 4 — Add component prop types</h3>
          <CodePre>{`// Before (JSX)
function Card({ title, children, accent }) {
  return <div className={\`card \${accent}\`}><h3>{title}</h3>{children}</div>
}

// After (TSX)
interface CardProps {
  title: string
  children: React.ReactNode
  accent: 'rust' | 'sage' | 'amber'   // ← discriminated literal instead of string
}

function Card({ title, children, accent }: CardProps) {
  return <div className={\`card \${accent}\`}><h3>{title}</h3>{children}</div>
}`}</CodePre>

          <h3>Step 5 — Type your event handlers</h3>
          <CodePre>{`// Common shapes:
const onChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
const onClick  = (e: MouseEvent<HTMLButtonElement>) => doThing();
const onSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); }
const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { ... };`}</CodePre>

          <h3>Step 6 — Type your async functions</h3>
          <CodePre>{`async function fetchRecipes(): Promise<Recipe[]> {
  const r = await fetch('/api/recipes')
  if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
  return r.json()  // ← inferred as Promise<any>; we widen via the return type
}

// Even better — validate the shape:
async function fetchRecipes(): Promise<Recipe[]> {
  const r = await fetch('/api/recipes')
  if (!r.ok) throw new Error(\`HTTP \${r.status}\`)
  const data: unknown = await r.json()
  if (!Array.isArray(data)) throw new Error('expected array')
  return data.filter(isRecipe)  // ← uses the guard from §5
}`}</CodePre>

          <h3>Estimated effort</h3>
          <ul>
            <li><strong>~50 files (small app):</strong> 1–2 days for rename + relaxed mode. Another 1–2 days for strict mode.</li>
            <li><strong>~150 files (medium app like GLP1):</strong> 3–5 days for the full migration.</li>
            <li><strong>The blocker:</strong> 3rd-party library types. If a lib has no <code>@types/*</code>, you'll either write a quick <code>declarations.d.ts</code> stub or set <code>allowSyntheticDefaultImports</code>.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a Discriminated Union API Client</h2>
          <p>Build a tiny API helper that returns <code>Result&lt;T&gt;</code>, with strict-mode-passing TypeScript and a callsite that demonstrates exhaustive narrowing.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`npm create vite@latest ts-lab -- --template react-ts
cd ts-lab
npm i`}</CodePre>

          <h3>Step 2 — Crank up strictness</h3>
          <p>Open <code>tsconfig.app.json</code> and set:</p>
          <CodePre>{`{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}`}</CodePre>

          <h3>Step 3 — Define the Result type</h3>
          <CodePre>{`// src/lib/result.ts
export type Result<T, E = string> =
  | { ok: true,  value: T }
  | { ok: false, error: E, code?: number }

export function ok<T>(value: T): Result<T> { return { ok: true, value } }
export function err<E = string>(error: E, code?: number): Result<never, E> {
  return { ok: false, error, code }
}`}</CodePre>

          <h3>Step 4 — Write the API helper</h3>
          <CodePre>{`// src/lib/api.ts
import { Result, ok, err } from './result'

export async function fetchJson<T>(
  url: string,
  guard?: (x: unknown) => x is T
): Promise<Result<T>> {
  let response: Response
  try {
    response = await fetch(url)
  } catch (e) {
    return err(e instanceof Error ? e.message : 'network error')
  }

  if (!response.ok) {
    return err(\`HTTP \${response.status}\`, response.status)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    return err('invalid JSON')
  }

  if (guard && !guard(data)) {
    return err('shape mismatch')
  }

  return ok(data as T)
}`}</CodePre>

          <h3>Step 5 — Build a user-defined guard</h3>
          <CodePre>{`// src/lib/types.ts
export interface Recipe {
  id: number
  title: string
  ingredients: string[]
}

export function isRecipe(x: unknown): x is Recipe {
  if (typeof x !== 'object' || x === null) return false
  const r = x as Record<string, unknown>
  return (
    typeof r.id === 'number' &&
    typeof r.title === 'string' &&
    Array.isArray(r.ingredients) &&
    r.ingredients.every(i => typeof i === 'string')
  )
}

export function isRecipeArray(x: unknown): x is Recipe[] {
  return Array.isArray(x) && x.every(isRecipe)
}`}</CodePre>

          <h3>Step 6 — Wire it into a component</h3>
          <CodePre>{`// src/App.tsx
import { useEffect, useState } from 'react'
import { fetchJson } from './lib/api'
import { isRecipeArray, type Recipe } from './lib/types'

export default function App() {
  const [state, setState] = useState<
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success', recipes: Recipe[] }
    | { status: 'error',   message: string }
  >({ status: 'idle' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetchJson('/api/recipes', isRecipeArray).then(r => {
      if (cancelled) return
      if (r.ok) {
        setState({ status: 'success', recipes: r.value })
      } else {
        setState({ status: 'error', message: r.error })
      }
    })
    return () => { cancelled = true }
  }, [])

  // Exhaustive switch — try removing a case and watch the build fail.
  switch (state.status) {
    case 'idle':    return null
    case 'loading': return <p>Loading…</p>
    case 'error':   return <p>Failed: {state.message}</p>
    case 'success': return (
      <ul>
        {state.recipes.map(r => <li key={r.id}>{r.title}</li>)}
      </ul>
    )
  }
}`}</CodePre>

          <h3>Step 7 — Add the exhaustiveness assertion</h3>
          <p>Add a <code>default</code> case with an <code>assertNever</code> call. Then try adding a new variant to the state union without handling it.</p>
          <CodePre>{`function assertNever(x: never): never {
  throw new Error(\`Unreachable: \${JSON.stringify(x)}\`)
}

switch (state.status) {
  // ... cases ...
  default: return assertNever(state)   // ← TS: Argument of type 'X' is not assignable to 'never'
}`}</CodePre>

          <h3>Step 8 — Verify</h3>
          <ul>
            <li><code>npx tsc --noEmit</code> — should pass cleanly.</li>
            <li>Try deleting the <code>case 'error'</code> arm. Build fails.</li>
            <li>Try adding <code>{`| { status: 'cached', age: number }`}</code> to the union without handling it. Build fails at the <code>assertNever</code> line.</li>
            <li>Try indexing into an empty array (<code>state.recipes[0].title</code> when recipes is empty). With <code>noUncheckedIndexedAccess</code>, build fails.</li>
          </ul>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've built a type-safe API client with discriminated unions, user-defined guards, and exhaustive
              narrowing — the same patterns PulseWire and Workshop use in production. The most-strict tsconfig in the
              fleet just compiled your code clean.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Object is possibly 'undefined'"</h3>
          <p>Narrow it (<code>if (x)</code>), optional-chain (<code>x?.foo</code>), or default-coalesce (<code>x ?? defaultValue</code>). Avoid <code>!</code> unless you're 100% sure.</p>

          <h3>"Type 'string' is not assignable to type '"foo" | "bar"'"</h3>
          <p>You're passing a generic string where a literal union is expected. Either widen the target type, or use <code>as const</code> on the source, or use <code>satisfies</code>.</p>

          <h3>"This expression is not callable"</h3>
          <p>TS thinks the value might be undefined. Optional-call: <code>fn?.()</code>. Or assert: <code>if (fn) fn()</code>.</p>

          <h3>"Type '...' is not assignable to type 'never'"</h3>
          <p>Almost always means: an empty array <code>[]</code> was typed as <code>never[]</code>. Annotate the type: <code>const items: Recipe[] = []</code>.</p>

          <h3>"Cannot find module 'foo' or its corresponding type declarations"</h3>
          <p>The package has no types. Three options: <code>npm i -D @types/foo</code>, write a stub <code>declare module 'foo'</code> in <code>src/global.d.ts</code>, or set <code>"allowSyntheticDefaultImports": true</code>.</p>

          <h3>"Property '...' does not exist on type '...'"</h3>
          <p>Three likely causes: (a) typo, (b) you're working with a wider union and need to narrow first, (c) the property genuinely doesn't exist — check the type definition.</p>

          <h3>The build passes locally but fails in CI</h3>
          <p>Make sure your CI runs <code>npx tsc --noEmit</code> (or equivalent), not just <code>npm run build</code>. Vite's <code>build</code> doesn't type-check by default — it strips types with esbuild and ships. Many fleet apps separate these:</p>
          <CodePre>{`{
  "scripts": {
    "typecheck": "tsc --noEmit -p tsconfig.app.json",
    "build": "tsc -b && vite build"
  }
}`}</CodePre>

          <h3>ESLint and TS disagree</h3>
          <p>Run <code>typescript-eslint</code> via <code>typescript-eslint</code> package. The <code>parser</code> should be <code>@typescript-eslint/parser</code>; the <code>parserOptions.project</code> should point at your tsconfig.</p>

          <h3>I'm using a 3rd-party hook and TS won't infer its return</h3>
          <p>Usually the library doesn't export the generic correctly. Wrap it: <code>{`function useFoo<T>() { return useThirdParty() as T }`}</code>. Better: file an issue upstream.</p>

          <h3>"Type instantiation is excessively deep and possibly infinite"</h3>
          <p>You wrote a recursive type that TS can't unfold. Add an explicit base case, limit the recursion depth manually, or simplify.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>tsconfig presets</h3>
          <CodePre>{`// Minimum — relaxed (Cairn, SecretApp)
{ "strict": false, "noImplicitAny": false }

// Recommended — start here (ShopKeep)
{ "strict": true }

// Production-strength (workshop, tabloom)
{ "strict": true, "noUnusedLocals": true, "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true }

// Airtight (PulseWire)
{ "strict": true, "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true }`}</CodePre>

          <h3>Type-level patterns</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>Snippet</th></tr>
              <tr><td>Discriminated union</td><td><code>{`{ kind: 'ok', value: T } | { kind: 'err', error: string }`}</code></td></tr>
              <tr><td>Literal preserved</td><td><code>const x = [...] as const</code></td></tr>
              <tr><td>Shape check + literal</td><td><code>const x = {`{...}`} satisfies T</code></td></tr>
              <tr><td>Branded</td><td><code>type UserId = string &amp; {`{__brand: 'UserId'}`}</code></td></tr>
              <tr><td>User guard</td><td><code>{`function isFoo(x: unknown): x is Foo { ... }`}</code></td></tr>
              <tr><td>Assertion fn</td><td><code>{`function assert(x): asserts x { ... }`}</code></td></tr>
              <tr><td>Exhaustive switch</td><td><code>{`default: return assertNever(x)`}</code></td></tr>
              <tr><td>Const enum</td><td><code>{`const SEVERITIES = [...] as const; type S = (typeof SEVERITIES)[number]`}</code></td></tr>
            </tbody>
          </table>

          <h3>Narrowing toolkit</h3>
          <table>
            <tbody>
              <tr><th>Tool</th><th>Use</th></tr>
              <tr><td><code>typeof</code></td><td>Primitives: string, number, boolean, symbol, undefined, object, function</td></tr>
              <tr><td><code>instanceof</code></td><td>Classes</td></tr>
              <tr><td><code>in</code></td><td>Property-based union narrowing</td></tr>
              <tr><td><code>===</code> / <code>!==</code></td><td>Literal types, null, undefined</td></tr>
              <tr><td>Discriminant property</td><td>Best for hand-modeled unions</td></tr>
              <tr><td><code>Array.isArray</code></td><td>Built-in array guard</td></tr>
              <tr><td>User-defined <code>x is Foo</code></td><td>Anything else</td></tr>
            </tbody>
          </table>

          <h3>Common React types</h3>
          <CodePre>{`React.ReactNode               // any renderable: string, number, JSX, array, null, ...
React.PropsWithChildren<P>    // P & { children?: ReactNode }
React.FC<P>                   // function component (rarely needed in 19; just write a function)
React.ComponentType<P>        // class or function component (e.g. for HOCs)
React.RefObject<HTMLDivElement>  // { current: HTMLDivElement | null }

ChangeEvent<HTMLInputElement>
MouseEvent<HTMLButtonElement>
FormEvent<HTMLFormElement>
KeyboardEvent<HTMLInputElement>
FocusEvent<HTMLInputElement>`}</CodePre>

          <h3>Utility types worth memorizing</h3>
          <CodePre>{`Partial<T>           // all fields optional
Required<T>          // all fields required
Readonly<T>          // all fields readonly
Pick<T, K>           // keep only K fields
Omit<T, K>           // remove K fields
Record<K, V>         // map K → V
Exclude<T, U>        // remove U from union T
Extract<T, U>        // keep only U from union T
NonNullable<T>       // remove null + undefined
ReturnType<F>        // F's return type
Parameters<F>        // F's parameter tuple
Awaited<T>           // unwrap Promise<T> → T`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>String-literal union (12 variants)</td><td>SecretApp · <code>src/types/AppView.ts</code></td></tr>
              <tr><td>Zod schema → inferred types</td><td>PulseWire · <code>src/env.ts</code></td></tr>
              <tr><td>Strict + noUnused pair</td><td>workshop · <code>tsconfig.app.json</code> · tabloom · <code>tsconfig.app.json</code></td></tr>
              <tr><td>noUncheckedIndexedAccess</td><td>PulseWire · <code>tsconfig.json</code></td></tr>
              <tr><td>Typed result interfaces</td><td>workshop · <code>src/lib/cutPlan.ts</code></td></tr>
              <tr><td>Relaxed-but-typed</td><td>SecretApp · <code>tsconfig.app.json</code> · Cairn · <code>tsconfig.app.json</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — onward to Vite Build System.</p>
        </section>
      </main>
    </div>
  );
}
