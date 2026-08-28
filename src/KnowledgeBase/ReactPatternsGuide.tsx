import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                    icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Hooks Deep Dive',                 icon: '🪝' },
  { id: 's3',  num: '3',  title: 'View State Machines',             icon: '🧭' },
  { id: 's4',  num: '4',  title: 'Code-Splitting with lazy()',      icon: '✂️' },
  { id: 's5',  num: '5',  title: 'AnimatePresence Transitions',     icon: '🎞️' },
  { id: 's6',  num: '6',  title: 'The Synchronous-OID Pattern',     icon: '🔐' },
  { id: 's7',  num: '7',  title: 'Server Components (Next.js)',     icon: '🌐' },
  { id: 's8',  num: '8',  title: 'Concurrent React',                icon: '⚡' },
  { id: 's9',  num: '9',  title: 'Common Foot-Guns',                icon: '🦶' },
  { id: 's10', num: '10', title: 'Patterns by App',                 icon: '🧩' },
  { id: 's11', num: '★',  title: 'Lab: State Machine from Scratch', icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                 icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                     icon: '📋' },
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

export default function ReactPatternsGuide() {
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
            <span className="sidebar-title">React 19 in Production</span>
          </div>
          <div className="sidebar-sub">Patterns from the fleet</div>
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
          <div className="hero-tag">⚛️ React 19 · 2026</div>
          <h1>React 19 Patterns<br />in Production</h1>
          <p>
            How <strong style={{ color: '#C77AA0' }}>eight shipping apps</strong> compose React 19 — view state
            machines, lazy chunks, MSAL race-free auth, and the Server Component boundary. Every snippet is real code
            from <code>SecretApp</code>, <code>Cairn</code>, <code>ShopKeep</code>, <code>GLP1</code>, <code>Puzzlebox</code>,
            <code>PulseWire</code>, <code>Tabloom</code>, or <code>workshop</code>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">8</span><span className="hero-stat-label">Apps Surveyed</span></div>
            <div className="hero-stat"><span className="hero-stat-val">5</span><span className="hero-stat-label">Use State Machines</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Use a Router</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~50</span><span className="hero-stat-label">Lazy Boundaries</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            A React component is a function that maps <em>state</em> to a description of UI. React's job is to call your
            function whenever the state changes, diff the output against the last call, and patch the real DOM with the
            minimum work required.
          </p>

          <h3>Three sentences that explain almost everything</h3>
          <ol>
            <li><strong>UI is a function of state.</strong> Same state in → same JSX out. If two renders produce different output from the same state, something stateful leaked in (a ref, a closure, a global).</li>
            <li><strong>Rendering is not committing.</strong> React may call your function multiple times before painting. Side effects belong in <code>useEffect</code> / <code>useLayoutEffect</code>, never inside the render body.</li>
            <li><strong>The dependency array is a contract.</strong> Listing a value in a hook's deps means "re-run when this changes." Lying about deps is the #1 source of React bugs.</li>
          </ol>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              The cleanest mental model: think of your component tree as a <em>spreadsheet</em>. Each cell (component)
              computes from inputs (props + state + context). When inputs change, dependent cells recompute. Everything
              else stays put.
            </div>
          </div>

          <h3>What React 19 changed (vs 18)</h3>
          <table>
            <tbody>
              <tr><th>Feature</th><th>What it gives you</th><th>Apps using it</th></tr>
              <tr><td><code>use()</code> hook</td><td>Read a Promise/Context conditionally, inside an <code>if</code> branch</td><td>None yet in fleet — fits semantic-search lazy-loading nicely</td></tr>
              <tr><td>Actions + <code>useTransition</code> async</td><td>Form submissions return Promises; auto pending state</td><td>None yet — Tabloom's editor saves are a future fit</td></tr>
              <tr><td><code>useOptimistic</code></td><td>Optimistic UI for slow-network mutations</td><td>None yet — recipe save in Hearth, tool checkout in ShopKeep</td></tr>
              <tr><td><code>useFormStatus</code></td><td>Read the parent form's submission state from any child</td><td>None yet</td></tr>
              <tr><td><code>ref</code> as a prop</td><td>No more <code>forwardRef</code> dance</td><td>Quietly removed forwardRef in several apps post-upgrade</td></tr>
              <tr><td>Hydration error UX</td><td>Diffs are highlighted, not "minified error 418"</td><td>Helped diagnose Plex card SSR mismatch in Hearth dev</td></tr>
              <tr><td>Document metadata in components</td><td><code>&lt;title&gt;</code> / <code>&lt;meta&gt;</code> inside any component</td><td>PulseWire — sets per-page titles without a head manager</td></tr>
            </tbody>
          </table>

          <h3>The render → commit → effect lifecycle</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  A[State changes] --> B[Render: function runs]
  B --> C[Reconcile: diff vs last render]
  C --> D{Changes?}
  D -->|No| E[Bail out]
  D -->|Yes| F[Commit: patch DOM]
  F --> G[Run useLayoutEffect]
  G --> H[Browser paints]
  H --> I[Run useEffect]`} />

          <p>
            <strong>Render</strong> = your function runs. <strong>Commit</strong> = React touches the DOM.
            <strong>Effect</strong> = your side-effect callbacks fire. These three steps are separated by frames; treating
            them as one phase causes 80% of the bugs in this guide.
          </p>

          <h3>Functional vs Class Components</h3>
          <p>
            Every component in every app on this fleet is a function. Classes still work, but hooks subsume their
            features (state, lifecycle, error boundaries excepted — those still need <code>componentDidCatch</code>, but
            you can wrap a class boundary around your function tree). Don't write new class components.
          </p>
        </section>

        <hr />

        {/* SECTION 2 — HOOKS DEEP DIVE */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Hooks Deep Dive</h2>
          <p>Six built-in hooks cover ~95% of what every app in the fleet needs. Master these; reach for the rest only when one of these stops fitting.</p>

          <h3><code>useState</code> — anchor your component to a value</h3>
          <p>
            The <em>identity</em> of a state value lives <em>between</em> renders, even though your function re-runs from
            scratch each time. The setter never changes; you can put it in deps lists with no consequence.
          </p>
          <CodePre>{`// Hearth's App.tsx, line 66:
const [currentView, setCurrentView] = useState<AppView>('dashboard')
const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)`}</CodePre>

          <h4>Three idioms worth memorizing</h4>
          <CodePre>{`// 1. Lazy initial — only runs on first render
const [tree, setTree] = useState(() => buildExpensiveTree(props.config))

// 2. Functional update — read the latest value, not the closure-captured one
setCount(c => c + 1)

// 3. State derived from props — DON'T do this with useState. Compute during render:
//    const filtered = items.filter(i => i.tag === tag)  // ← correct
//    const [filtered, setFiltered] = useState(...)      // ← anti-pattern`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Don't mirror props into state.</strong> If a value can be computed from props, compute it during
              render. State that drifts out of sync with its source is the slowest bug to find.
            </div>
          </div>

          <h3><code>useEffect</code> — sync with something outside React</h3>
          <p>The <em>only</em> reason to reach for <code>useEffect</code> is to talk to a system React doesn't own: the
          DOM, a server, a timer, a subscription, localStorage. If your effect just sets state from props, you don't
          need it.</p>

          <CodePre>{`// Hearth's KnowledgeBase/index.tsx, line 156 — scroll to a hash after lazy guide mounts
useEffect(() => {
  if (!active || !pendingHash) return;
  let cancelled = false;
  const tryScroll = (attemptsLeft: number) => {
    if (cancelled) return;
    const el = document.getElementById(pendingHash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingHash(null);
      return;
    }
    if (attemptsLeft > 0) requestAnimationFrame(() => tryScroll(attemptsLeft - 1));
  };
  requestAnimationFrame(() => tryScroll(20));
  return () => { cancelled = true; };  // cleanup cancels in-flight retries
}, [active, pendingHash]);`}</CodePre>

          <p>That cleanup is the half of <code>useEffect</code> people forget. Every effect that subscribes, timers, or queues async work needs a cleanup that cancels it.</p>

          <h3><code>useMemo</code> — cache a derived value</h3>
          <p>
            Use it for two reasons only: <strong>(a)</strong> the computation is expensive, or <strong>(b)</strong> the
            result is referenced as a dependency in a downstream hook and you need a stable identity.
          </p>
          <CodePre>{`// Hearth's App.tsx, line 75 — command palette items
const commands: CommandItem[] = useMemo(() => {
  const navCommand = (id: AppView, label: string, ...): CommandItem => ({ ... })
  return [
    navCommand('dashboard', 'Home', <HomeIcon fontSize="small" />, ['home']),
    // ...12 commands...
  ]
}, [mode])  // ← rebuild only when theme mode changes`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>Default: don't memoize.</strong> The hook itself has overhead. Profile first, optimize the hot spot.
              Lots of apps in this fleet over-memoize and pay for it.
            </div>
          </div>

          <h3><code>useRef</code> — a value that survives renders but doesn't trigger them</h3>
          <p>Two distinct uses: <strong>DOM refs</strong> (attach to <code>&lt;input ref=...&gt;</code>) and
          <strong>instance variables</strong> (a mutable box for any value).</p>

          <CodePre>{`// Hearth's KnowledgeBase guides — sectionRefs for IntersectionObserver
const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
// ...
<section className="section" id="s1" ref={setRef('s1')}>`}</CodePre>

          <CodePre>{`// Instance variable: stable across renders, doesn't cause re-renders
const lastClickTime = useRef(0);
const handleClick = () => {
  if (Date.now() - lastClickTime.current < 500) return;  // debounce
  lastClickTime.current = Date.now();
  doThing();
};`}</CodePre>

          <h3><code>useCallback</code> — memoize a function reference</h3>
          <p>
            Identity matters when a function is a prop to a <code>memo</code>-wrapped child, or a dependency of another
            hook. Otherwise it's overhead.
          </p>
          <CodePre>{`// Common shape:
const onSave = useCallback(
  (item) => api.save(item).then(() => refresh()),
  [refresh]  // ← function identity stable until refresh changes
);`}</CodePre>

          <h3><code>useContext</code> — read a value without prop-drilling</h3>
          <CodePre>{`// Hearth's App.tsx, line 28
import { useThemeMode } from './context/ThemeContext'

const { mode, toggleMode } = useThemeMode()  // mode: 'light' | 'dark'`}</CodePre>
          <p>
            Context's re-render rule: every consumer re-renders when the provider's <code>value</code> changes by
            reference. Wrap <code>value</code> in <code>useMemo</code> if it's an object — otherwise every parent render
            stomps every consumer.
          </p>

          <h3>The dependency array, in detail</h3>
          <table>
            <tbody>
              <tr><th>You list</th><th>Behavior</th></tr>
              <tr><td><code>[]</code></td><td>Runs once after mount (and once on unmount via cleanup)</td></tr>
              <tr><td><code>[a, b]</code></td><td>Runs when either value changes (by <code>Object.is</code>)</td></tr>
              <tr><td>(omitted)</td><td>Runs after every render — almost always wrong</td></tr>
            </tbody>
          </table>

          <div className="alert bad">
            <span className="alert-icon">🚫</span>
            <div>
              <strong>Never silence the ESLint exhaustive-deps rule with a vague comment.</strong> If you must skip a dep,
              add a comment explaining why (e.g. <em>"setRef is stable; including it would infinite-loop"</em>). The
              <code>react-hooks/exhaustive-deps</code> warning is right ~99% of the time.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 3 — VIEW STATE MACHINES */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The View-State-Machine Pattern</h2>
          <p>
            Five of eight apps in the fleet skip a router and use a <em>single string</em> in <code>useState</code> for
            top-level navigation. It's deliberately under-engineered, and at the scale of these apps it's better than any
            alternative.
          </p>

          <h3>Why no router?</h3>
          <ul>
            <li><strong>No URL contracts:</strong> these are single-user apps; deep links and back-button history don't matter.</li>
            <li><strong>No SSR:</strong> all SPA shells; <code>react-router</code> brings flexibility you don't use.</li>
            <li><strong>One screen = one component:</strong> the entire mental model fits on one line of code.</li>
            <li><strong>TypeScript exhaustiveness:</strong> a discriminated-union view type makes "did you forget a render branch?" a compile error.</li>
          </ul>

          <h3>The full pattern, in three files</h3>

          <h4>Step 1 — declare the view union</h4>
          <CodePre>{`// src/types/AppView.ts (Hearth — verbatim)
//
// Single source of truth for the app's view union. Every component that
// navigates or filters by view (App, Dashboard, NavigationSidebar, etc.)
// imports this type — adding a new view here makes TypeScript flag every
// render branch and label table that misses it.

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

          <h4>Step 2 — hold it in state at the root</h4>
          <CodePre>{`// src/App.tsx (Hearth)
const [currentView, setCurrentView] = useState<AppView>('dashboard')

const navigateToView = (view: AppView) => {
  setCurrentView(view)
  if (isMobile) setMobileDrawerOpen(false)
}`}</CodePre>

          <h4>Step 3 — render with conditional fragments</h4>
          <CodePre>{`// src/App.tsx (Hearth)
{currentView === 'chat' && <ChatApp />}
{currentView === 'halloween' && <PlexMovieInsights />}
{currentView === 'converter' && <ExcelToJsonConverter />}
{currentView === 'home-maintenance' && <HomeMaintenanceTracker />}
{currentView === 'home-inventory' && <HomeInventory />}
{currentView === 'yard-maintenance' && <YardMaintenance />}
{currentView === 'recipe-manager' && <RecipeManager />}
{currentView === 'ai-test' && <AITest />}
{currentView === 'plex-command-center' && <PlexCommandCenter />}
{currentView === 'knowledge-base' && <KnowledgeBase />}
{currentView === 'exam-prep-hub' && <ExamPrepHub />}`}</CodePre>

          <p>That's it. Adding a view is a four-touch change: union → label map → command palette → render branch. TypeScript catches three of the four.</p>

          <h3>Discriminated-union version (ShopKeep)</h3>
          <p>When a view has parameters (e.g. "tool detail with id=42"), upgrade the string to an object union:</p>
          <CodePre>{`type RouteState =
  | { name: 'dashboard' }
  | { name: 'tool-detail', toolId: number }
  | { name: 'scan' }
  | { name: 'reports', tab: 'spending' | 'inventory' };

const [route, setRoute] = useState<RouteState>({ name: 'dashboard' });

// Renders are now exhaustive:
switch (route.name) {
  case 'dashboard':   return <Dashboard />;
  case 'tool-detail': return <ToolDetail id={route.toolId} />;
  case 'scan':        return <Scanner />;
  case 'reports':     return <Reports tab={route.tab} />;
  // No default — TS will yell if you add a new variant and forget to handle it.
}`}</CodePre>

          <h3>When to use a router instead</h3>
          <table>
            <tbody>
              <tr><th>Signal</th><th>Move to router</th></tr>
              <tr><td>Users need to share links</td><td>Yes</td></tr>
              <tr><td>Back button must work intuitively</td><td>Yes</td></tr>
              <tr><td>Deep nesting (3+ levels)</td><td>Yes</td></tr>
              <tr><td>Server-side rendering</td><td>Yes (and you need Next.js, not just React Router)</td></tr>
              <tr><td>Multi-tab workflows in the same app</td><td>Yes</td></tr>
              <tr><td>None of the above</td><td>Stay with the state machine</td></tr>
            </tbody>
          </table>

          <h3>Which apps use which?</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>Apps</th></tr>
              <tr><td><strong>String / union state machine</strong></td><td>Hearth (12 views), Cairn (5 views), ShopKeep (discriminated union), Puzzlebox (string)</td></tr>
              <tr><td>React Router v6</td><td>GLP1, Tabloom</td></tr>
              <tr><td>React Router v7</td><td>workshop</td></tr>
              <tr><td>Next.js App Router</td><td>PulseWire</td></tr>
            </tbody>
          </table>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              The biggest signal that you've outgrown the state-machine pattern: you start adding parameters to
              <code>setCurrentView</code> calls (e.g. <code>{`setCurrentView({ view: 'detail', id: 42 })`}</code>). At that
              point, either upgrade to a discriminated union (still no router needed) or move to a router.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 4 — CODE SPLITTING */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Code-Splitting with <code>lazy()</code></h2>
          <p>
            <code>React.lazy()</code> + <code>Suspense</code> turns one giant JS bundle into a tree of chunks loaded on
            demand. Hearth's dashboard ships ~120KB; every other view is a separate chunk that only downloads when the
            user clicks into it.
          </p>

          <h3>The two-line pattern</h3>
          <CodePre>{`// 1. Replace the static import:
//    import RecipeManager from './RecipeManager'
//    with:
const RecipeManager = lazy(() => import('./RecipeManager'))

// 2. Wrap your render tree in a Suspense boundary with a fallback:
<Suspense fallback={<Spinner />}>
  {currentView === 'recipe-manager' && <RecipeManager />}
</Suspense>`}</CodePre>

          <p>Vite emits one chunk per <code>import()</code> call. The chunk lazy-loads when React first tries to render the component; subsequent renders use the cached module.</p>

          <h3>Hearth's eleven-lazy block</h3>
          <CodePre>{`// src/App.tsx, lines 33–43
const ChatApp                = lazy(() => import('./ChatApp'))
const ExcelToJsonConverter   = lazy(() => import('./ExcelToJsonConverter'))
const PlexMovieInsights      = lazy(() => import('./PlexMovieInsights'))
const HomeMaintenanceTracker = lazy(() => import('./HomeMaintenanceTracker'))
const HomeInventory          = lazy(() => import('./HomeInventory'))
const YardMaintenance        = lazy(() => import('./YardMaintenance'))
const RecipeManager          = lazy(() => import('./RecipeManager'))
const AITest                 = lazy(() => import('./AITest'))
const PlexCommandCenter      = lazy(() => import('./PlexCommandCenter'))
const KnowledgeBase          = lazy(() => import('./KnowledgeBase'))
const ExamPrepHub            = lazy(() => import('./ExamPrepHub'))`}</CodePre>

          <h3>The Suspense boundary</h3>
          <p>Place it as close to the lazy component as practical. One global boundary works, but it flashes the whole app when any new chunk loads. Hearth puts it just below the sidebar:</p>
          <CodePre>{`<Suspense
  fallback={
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
      <CircularProgress size={32} thickness={3} sx={{ color: ACCENT }} />
      <Typography sx={{ color: TEXT_SEC }}>Loading guide…</Typography>
    </Box>
  }
>
  {active === 'ios' && <IosGuide />}
  {active === 'azure' && <AzureGuide />}
  {/* ... */}
</Suspense>`}</CodePre>

          <h3>Lazy maps for many variants — Cairn's exam shells</h3>
          <p>
            When the variants are data-driven (Cairn has ~50 cert tracks), don't write 50 conditional fragments. Put the
            lazy components in a record keyed by id, then look up at render time.
          </p>
          <CodePre>{`// Cairn's src/ExamPrepHub/index.tsx (simplified)
const AI901Exam = lazy(() => import('./exams/AI901'));
const AZ900Exam = lazy(() => import('./exams/AZ900'));
const DP900Exam = lazy(() => import('./exams/DP900'));
// ...~50 more...

const EXAM_SHELLS: Record<string, ComponentType<ExamHubNav>> = {
  AI901: AI901Exam,
  AZ900: AZ900Exam,
  DP900: DP900Exam,
  // ...
};

function ExamPrepHub({ examId }: { examId: string }) {
  const Shell = EXAM_SHELLS[examId];
  if (!Shell) return null;  // unknown exam id — render nothing
  return (
    <Suspense fallback={<Spinner />}>
      <Shell />
    </Suspense>
  );
}`}</CodePre>

          <h3>Preloading — making lazy feel instant</h3>
          <p>The lazy import returns a function; calling it preloads the chunk without rendering. Pair it with
          <code>onMouseEnter</code> on the nav item so by the time the user clicks, the chunk is already cached:</p>
          <CodePre>{`const RecipeManager = lazy(() => import('./RecipeManager'))

// Inside your nav button:
<button
  onMouseEnter={() => import('./RecipeManager')}  // ← warm the cache
  onClick={() => setCurrentView('recipe-manager')}
>
  Recipes
</button>`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              Hover-preload is free perf. The dynamic import deduplicates: calling <code>import('./X')</code> twice
              returns the same Promise, so the chunk only downloads once.
            </div>
          </div>

          <h3>What lazy doesn't help with</h3>
          <ul>
            <li><strong>Eager dependencies.</strong> If <code>App.tsx</code> imports <code>RecipeManager</code> indirectly through a shared module, that module gets bundled into the main chunk. Check the build output (Vite prints chunk sizes).</li>
            <li><strong>Tiny chunks.</strong> Lazy-loading a 4KB component adds round-trip latency. Aim for 30KB+ per chunk.</li>
            <li><strong>SSR.</strong> <code>React.lazy</code> doesn't work in server-rendered output. Next.js has its own <code>dynamic()</code> wrapper for that.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 5 — ANIMATEPRESENCE */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>AnimatePresence — Animating Mount/Unmount</h2>
          <p>
            Framer Motion's <code>AnimatePresence</code> is the missing primitive React doesn't ship: <em>animate a
            component out</em>. React's reconciler unmounts components instantly; <code>AnimatePresence</code> holds
            them long enough to play an exit animation, then unmounts.
          </p>

          <h3>The pattern</h3>
          <CodePre>{`import { motion, AnimatePresence } from 'framer-motion'

<AnimatePresence mode="wait">
  {currentView === 'recipes' && (
    <motion.div
      key="recipes"  // ← changing this forces exit + enter
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <RecipeManager />
    </motion.div>
  )}
</AnimatePresence>`}</CodePre>

          <p>Two non-obvious requirements:</p>
          <ol>
            <li><strong>The <code>key</code> prop must change</strong> between transitions, or AnimatePresence can't tell that "different content" is being rendered.</li>
            <li><strong><code>mode="wait"</code></strong> queues the next mount until the previous exit finishes. Without it, both render simultaneously during the crossfade.</li>
          </ol>

          <h3>GLP1's three-gate entry sequence</h3>
          <p>GLP1 stacks gates: intro splash → onboarding wizard → app. <code>AnimatePresence</code> coordinates the splash exit; gates 2 and 3 are mutually exclusive renders.</p>
          <CodePre>{`// GLP1's src/App.jsx, lines 92–109
<AnimatePresence mode="wait">
  {!introDone && (
    <IntroAnimation key="intro" onDone={() => setIntroDone(true)} />
  )}
</AnimatePresence>

{introDone && needsOnboarding && (
  <OnboardingWizard onComplete={handleOnboardingComplete} />
)}

{introDone && !needsOnboarding && (
  <Layout>
    <AnimatedRoutes />
  </Layout>
)}`}</CodePre>

          <h3>Cairn's home → details cross-fade</h3>
          <p>Cairn's top-level view machine has five branches (<code>home | level | details | admin | exam</code>) and uses <code>AnimatePresence</code> to crossfade between any pair.</p>
          <CodePre>{`<AnimatePresence mode="wait">
  {view === 'home' && (
    <motion.div key="home" {...fadeProps}><Home /></motion.div>
  )}
  {view === 'details' && (
    <motion.div key="details" {...fadeProps}><Details /></motion.div>
  )}
  {/* ...three more... */}
</AnimatePresence>`}</CodePre>

          <h3>The layout-shift trap</h3>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              If the entering content has different height than the exiting content, <code>mode="wait"</code> will produce
              a jarring "snap" at the moment of swap. Two fixes: <strong>(a)</strong> use <code>mode="sync"</code> and
              overlap with absolute positioning, or <strong>(b)</strong> pin the parent's <code>min-height</code> so the
              shrink doesn't propagate.
            </div>
          </div>

          <h3>Reduced motion</h3>
          <CodePre>{`import { useReducedMotion } from 'framer-motion'

function MyView() {
  const reduced = useReducedMotion()
  const transition = reduced ? { duration: 0 } : { duration: 0.2 }
  // ...
}`}</CodePre>
          <p>Respect <code>prefers-reduced-motion</code>. It's a CSS media query, but framer-motion exposes it via this hook so you can skip animations consistently across components.</p>
        </section>

        <hr />

        {/* SECTION 6 — SYNCHRONOUS OID */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The Synchronous-OID Pattern <span className="badge green">MSAL race-prevention</span></h2>
          <p>
            ShopKeep, Workshop, GLP1, and Tabloom share an MSAL pitfall: if you capture the signed-in user's <code>oid</code>
            in a <code>useEffect</code>, child components that fetch data in <em>their</em> first <code>useEffect</code>
            will fire <em>before</em> the OID is set. The fetch sends no OID → server returns empty → user sees an empty
            dashboard for the first ~16ms after login.
          </p>

          <h3>The race, visualized</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant React as React renderer
  participant Guard as AuthGuard
  participant Child as Dashboard
  participant API as /api/tools
  Note over React,API: Bad pattern — OID set in useEffect
  React->>Guard: render
  Guard->>React: returns <Dashboard />
  React->>Child: render
  Child->>React: queues useEffect (fetch /api/tools)
  React-->>Guard: runs Guard.useEffect → setUserOid('abc')
  React-->>Child: runs Child.useEffect → fetch(no OID yet!)
  API-->>Child: 200 [] (empty — no user context)`} />

          <p>
            React runs <strong>all renders bottom-up</strong>, then runs <strong>all effects bottom-up</strong>. The child
            effect fires before the parent effect, so any state the child needs from the parent's effect is unset on first
            paint.
          </p>

          <h3>The fix — capture during render, not in an effect</h3>
          <CodePre>{`// ShopKeep's src/auth/AuthGuard.tsx (idea, lines 22–30)
export function AuthGuard({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // ── CRITICAL: capture OID synchronously during render ──
  // If we move this into useEffect, child components that fetch in their own
  // useEffect will run BEFORE the OID is set. First-paint dashboard is empty.
  const active = instance.getActiveAccount();
  if (active?.localAccountId) {
    setUserOid(active.localAccountId);  // ← module-level setter, see note below
  }

  if (!isAuthenticated) return <Login />;
  return <>{children}</>;
}`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <code>setUserOid</code> here is a module-level setter (a store, not <code>useState</code>). Calling it
              during render is safe because the value is read, not subscribed to during render. If you used <code>useState</code>,
              calling its setter during render would cause an infinite loop.
            </div>
          </div>

          <h3>Why <code>useLayoutEffect</code> doesn't fix it</h3>
          <p>
            <code>useLayoutEffect</code> runs synchronously after commit but <em>before paint</em> — and crucially,
            <em>after</em> all child effects have queued. So it still fires after the child's fetch, just before the
            browser paints. The race is identical.
          </p>

          <h3>The general lesson</h3>
          <ul>
            <li>State that needs to be available to children on their first render must be captured <strong>during render</strong>, not in any effect.</li>
            <li>"During render" means either: <strong>(a)</strong> a module-level store (Zustand, Jotai, or a plain singleton), <strong>(b)</strong> context whose value is computed during render, or <strong>(c)</strong> props.</li>
            <li>If a value must come from an effect (e.g. async fetch), gate the children behind <code>{`if (!value) return <Spinner />`}</code> instead.</li>
          </ul>

          <h3>The async-OID variant</h3>
          <p>If your OID comes from an async source (e.g. you need to refresh a token first), gate, don't race:</p>
          <CodePre>{`function AuthGuard({ children }) {
  const [oid, setOid] = useState<string | null>(null);
  const { instance } = useMsal();

  useEffect(() => {
    instance.acquireTokenSilent({ scopes: ['User.Read'] })
      .then(r => setOid(r.account.localAccountId));
  }, [instance]);

  if (!oid) return <Spinner />;          // ← children don't render until OID is set
  return <UserContext.Provider value={oid}>{children}</UserContext.Provider>;
}`}</CodePre>
          <p>The trade-off: an extra spinner frame on first paint, in exchange for no race.</p>
        </section>

        <hr />

        {/* SECTION 7 — SERVER COMPONENTS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Server Components (Next.js / PulseWire)</h2>
          <p>
            PulseWire is the only app in the fleet using Server Components. Every component in <code>src/app/</code> is a
            Server Component by default — it runs on the server, ships only its HTML output to the browser, and never
            includes its JS in the bundle. Adding the <code>"use client"</code> directive at the top of a file flips it
            to a client component.
          </p>

          <h3>The boundary</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  L[layout.tsx<br/>Server Component] --> P[page.tsx<br/>Server Component]
  P --> H[Header.tsx<br/>Server Component]
  P --> A[ArticleStream.tsx<br/>Client Component]
  P --> S[SignOutButton.tsx<br/>Client Component]
  A --> AC[ArticleCard.tsx<br/>Client Component]
  H --> N[Nav.tsx<br/>Client Component]

  style A fill:#5C2A4A,color:#fff
  style S fill:#5C2A4A,color:#fff
  style AC fill:#5C2A4A,color:#fff
  style N fill:#5C2A4A,color:#fff`} />

          <p>
            Server components (default fill) render on the server and ship HTML. Client components (rust fill) ship JS to
            the browser. Once you cross into a client subtree, everything below it is also client. The boundary is
            one-way.
          </p>

          <h3>PulseWire's root layout</h3>
          <CodePre>{`// PulseWire's src/app/layout.tsx — pure Server Component
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={\`\${geistSans.variable} h-full antialiased\`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}`}</CodePre>
          <p>No <code>"use client"</code> at the top → this file's JS is never sent to the browser. The <code>html</code> and <code>body</code> tags are pre-rendered server-side.</p>

          <h3>When to flip to <code>"use client"</code></h3>
          <ul>
            <li>You use <code>useState</code>, <code>useEffect</code>, or any other hook.</li>
            <li>You attach event handlers (<code>onClick</code>, <code>onChange</code>).</li>
            <li>You use browser APIs (<code>localStorage</code>, <code>window</code>, <code>document</code>).</li>
            <li>You consume context from a client provider.</li>
          </ul>

          <h3>The data-fetching shift</h3>
          <p>Server Components can be <code>async</code>. Fetch data directly inside them, no <code>useEffect</code>:</p>
          <CodePre>{`// Server component — runs on the server, never ships to browser
export default async function ReaderPage({ params }) {
  const articles = await db.select().from(articlesTable).limit(50);

  return (
    <main>
      {articles.map(a => <ArticleCard key={a.id} article={a} />)}
    </main>
  );
}`}</CodePre>
          <p>That <code>db.select()</code> call runs server-side; it never appears in the browser bundle, and Drizzle's connection never crosses the network.</p>

          <h3>The "use client" trap — context across the boundary</h3>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              You cannot pass functions, class instances, or Dates as props from a Server Component to a Client Component.
              Anything crossing the boundary must be JSON-serializable. If you need to pass a callback, define the Client
              Component, then pass plain data; the callback lives client-side.
            </div>
          </div>

          <h3>Mental model rule of thumb</h3>
          <ul>
            <li><strong>Default to Server Components.</strong> Most UI doesn't need interactivity.</li>
            <li><strong>Push <code>"use client"</code> to the leaves.</strong> A button that opens a menu is client; the page that contains it is server.</li>
            <li><strong>Don't fight it.</strong> If you find yourself wrapping everything in <code>"use client"</code>, you're not getting Server Component value — that's a signal you should be in a different framework (or sticking with SPA).</li>
          </ul>

          <p>For the full PulseWire architecture (instrumentation, proxy.ts, lazy DB proxy), see the upcoming Next.js 16 App Router guide.</p>
        </section>

        <hr />

        {/* SECTION 8 — CONCURRENT REACT */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Concurrent React</h2>
          <p>
            React 18 introduced concurrent rendering — the ability to interrupt and abandon in-progress renders. Three
            hooks expose this: <code>useTransition</code>, <code>useDeferredValue</code>, and (R19) async actions.
          </p>

          <h3><code>useTransition</code> — mark some state updates as "low priority"</h3>
          <p>
            Common shape: a typeahead search input. The keystroke must feel instant; the result list can lag a frame or
            two. Wrap the result-list update in <code>startTransition</code>:
          </p>
          <CodePre>{`function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);          // ← urgent: keystroke must paint now
    startTransition(() => {
      setResults(search(e.target.value));  // ← non-urgent: can yield to next keystroke
    });
  };

  return (
    <>
      <input value={query} onChange={onChange} />
      {isPending && <Spinner size="sm" />}
      <ResultList results={results} />
    </>
  );
}`}</CodePre>

          <h3><code>useDeferredValue</code> — let a prop lag the source of truth</h3>
          <p>Same use case, different angle. Pass the deferred value down to the expensive child:</p>
          <CodePre>{`function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ExpensiveList query={deferredQuery} />  {/* re-renders later, doesn't block input */}
    </>
  );
}`}</CodePre>

          <h3>The Hearth search box</h3>
          <p>Hearth's Knowledge Base search is sync against an in-memory index, so it doesn't need transitions. But the <em>index-building</em> step is a perfect transition candidate:</p>
          <CodePre>{`// src/KnowledgeBase/index.tsx — current shape
const ensureIndex = () => {
  if (index || indexing) return;
  setIndexing(true);
  getSearchIndex()
    .then(setIndex)
    .finally(() => setIndexing(false));
};

// Concurrent-React shape:
const [, startTransition] = useTransition();
const ensureIndex = () => {
  if (index || indexing) return;
  setIndexing(true);
  getSearchIndex().then(idx => {
    startTransition(() => setIndex(idx));  // ← yield while we apply the big index
  }).finally(() => setIndexing(false));
};`}</CodePre>

          <h3>Async actions (React 19)</h3>
          <p>Pass an async function to a form's <code>action</code> and React handles pending state, errors, and reset automatically:</p>
          <CodePre>{`function SaveRecipe({ recipe }) {
  async function save(formData: FormData) {
    "use server";  // (in Next.js)
    await db.recipes.update(recipe.id, Object.fromEntries(formData));
  }

  return (
    <form action={save}>
      <input name="title" defaultValue={recipe.title} />
      <SubmitButton />  {/* uses useFormStatus inside */}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;
}`}</CodePre>

          <p>None of the apps in the fleet have shifted to this pattern yet — they all use manual <code>onClick</code> + try/catch + setState. It's a clean refactor target for any form-heavy view (recipe editor in Hearth, tool detail in ShopKeep, profile in GLP1).</p>
        </section>

        <hr />

        {/* SECTION 9 — FOOTGUNS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Common Foot-Guns</h2>

          <h3>Stale closures</h3>
          <p>The #1 React bug. You capture a value in a callback, the value updates, but the callback keeps the old one.</p>
          <CodePre>{`// 🚫 BUG
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);  // ← count is captured as 0 forever
    }, 1000);
    return () => clearInterval(timer);
  }, []);  // ← empty deps = closure freezes
}

// ✅ FIX 1: functional update
setCount(c => c + 1);  // reads the latest, no capture

// ✅ FIX 2: list the dep (re-creates interval each tick — rarely what you want)
useEffect(() => { ... }, [count]);

// ✅ FIX 3: ref the value
const countRef = useRef(count);
useEffect(() => { countRef.current = count });
useEffect(() => {
  const timer = setInterval(() => setCount(countRef.current + 1), 1000);
  return () => clearInterval(timer);
}, []);`}</CodePre>

          <h3>Forgotten cleanup</h3>
          <p>Any effect that subscribes, listens, or queues async work needs a cleanup. Otherwise: leaked listeners, double-fired callbacks after unmount, "can't update state on unmounted component" warnings.</p>
          <CodePre>{`useEffect(() => {
  const onResize = () => setSize([window.innerWidth, window.innerHeight]);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);  // ← REQUIRED
}, []);`}</CodePre>

          <h3>Race conditions in async effects</h3>
          <CodePre>{`// 🚫 BUG — fast typing causes out-of-order responses
useEffect(() => {
  fetch(\`/api/search?q=\${query}\`).then(r => r.json()).then(setResults);
}, [query]);

// ✅ FIX — cancellation flag
useEffect(() => {
  let cancelled = false;
  fetch(\`/api/search?q=\${query}\`).then(r => r.json()).then(r => {
    if (!cancelled) setResults(r);
  });
  return () => { cancelled = true; };
}, [query]);`}</CodePre>

          <h3>Derived state in useState</h3>
          <CodePre>{`// 🚫 BUG — drifts out of sync with items
const [items] = useState([...]);
const [count, setCount] = useState(items.length);

// ✅ FIX — compute during render
const count = items.length;`}</CodePre>

          <h3>Mutating state directly</h3>
          <CodePre>{`// 🚫 BUG — React doesn't detect mutation, won't re-render
items.push(newItem);
setItems(items);

// ✅ FIX — new reference
setItems([...items, newItem]);
// or functional:
setItems(prev => [...prev, newItem]);`}</CodePre>

          <h3>Key collisions in lists</h3>
          <CodePre>{`// 🚫 BUG — array index as key when items reorder/insert
{items.map((item, i) => <Item key={i} {...item} />)}

// ✅ FIX — stable id
{items.map(item => <Item key={item.id} {...item} />)}`}</CodePre>
          <p>React uses <code>key</code> to match elements between renders. Wrong keys cause stale state, lost focus, and broken animations.</p>

          <h3>Re-creating context value</h3>
          <CodePre>{`// 🚫 BUG — every parent render gives a new object → all consumers re-render
<ThemeContext.Provider value={{ mode, toggleMode }}>

// ✅ FIX — memoize the value
const themeValue = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);
<ThemeContext.Provider value={themeValue}>`}</CodePre>

          <h3>Conditional hooks</h3>
          <CodePre>{`// 🚫 BUG — hooks must run in the same order every render
function Foo({ enabled }) {
  if (!enabled) return null;
  const [count, setCount] = useState(0);  // ← React loses track
}

// ✅ FIX — hooks first, conditional return after
function Foo({ enabled }) {
  const [count, setCount] = useState(0);
  if (!enabled) return null;
  return <span>{count}</span>;
}`}</CodePre>

          <div className="alert bad">
            <span className="alert-icon">🚫</span>
            <div>
              <strong>The Rules of Hooks aren't a style guide — they're load-bearing.</strong> React identifies hooks by
              call order. Skipping a hook breaks state for every later hook in that component.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 10 — PATTERNS BY APP */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Patterns by App</h2>
          <p>Cross-cutting reference: which React features each app exercises hardest, and where to look in source.</p>

          <h3>SecretApp (Hearth) — this repo</h3>
          <ul>
            <li><strong>View state machine</strong> — <code>currentView: AppView</code> in [App.tsx:66](src/App.tsx#L66)</li>
            <li><strong>11 lazy chunks</strong> — [App.tsx:33-43](src/App.tsx#L33-L43)</li>
            <li><strong>useMemo for command palette</strong> — [App.tsx:75](src/App.tsx#L75)</li>
            <li><strong>IntersectionObserver via ref</strong> — every KB guide tracks "sections read" this way</li>
            <li><strong>Hash-and-scroll dance</strong> — [KnowledgeBase/index.tsx:156](src/KnowledgeBase/index.tsx#L156) shows the pending-hash + rAF retry pattern</li>
          </ul>

          <h3>Cairn</h3>
          <ul>
            <li><strong>~50 lazy exam shells</strong> via <code>EXAM_SHELLS</code> record (<code>src/ExamPrepHub/index.tsx</code>)</li>
            <li><strong>5-branch view machine with <code>AnimatePresence</code></strong> cross-fade</li>
            <li><strong>localStorage monkey-patch</strong> in <code>syncedStorage.ts</code> — mirrors <code>exam-prep-*</code> keys to per-user SQLite</li>
            <li><strong>Boot-time hydration:</strong> <code>hydrateFromBackend()</code> pulls server state before rendering</li>
          </ul>

          <h3>GLP1 (Tare)</h3>
          <ul>
            <li><strong>Three-gate entry:</strong> IntroAnimation → OnboardingWizard → Layout (lines 92–109 of <code>App.jsx</code>)</li>
            <li><strong>React Router v6</strong> with <code>AnimatedRoutes</code> wrapping <code>&lt;Routes&gt;</code></li>
            <li><strong>JSX-only</strong> (no TypeScript) — the only React app on the fleet with no static types</li>
            <li><strong>Daily summary</strong> uses async <code>useEffect</code> with cancellation flag (the pattern in §9)</li>
          </ul>

          <h3>PulseWire</h3>
          <ul>
            <li><strong>Server Components by default</strong> — <code>src/app/layout.tsx</code> is server</li>
            <li><strong>react-virtuoso</strong> for the article stream — virtualized list, ~1000 items at a time</li>
            <li><strong>Boundary discipline:</strong> <code>"use client"</code> only on interactive leaves (cards, menus)</li>
            <li><strong>No state machine</strong> — file-system routing handles this</li>
          </ul>

          <h3>SecretApp (Hearth)'s sister apps</h3>
          <ul>
            <li><strong>ShopKeep:</strong> discriminated-union <code>RouteState</code>, synchronous-OID <code>AuthGuard</code>, recharts-heavy reports (106k LOC in <code>Reports.tsx</code>)</li>
            <li><strong>workshop:</strong> React Router v7, strict TS, BSSF cut-plan algorithm in pure functions</li>
            <li><strong>tabloom:</strong> Zustand stores (UI + data), TipTap behind <code>React.lazy</code> (430KB chunk), keyboard-driven slash commands</li>
            <li><strong>puzzlebox:</strong> JSX-only, single <code>screen</code> string, multi-game platform (Sudoku, NumberSums, Tower Defense, City War) with sibling root components (<code>App.jsx</code> for Sudoku, <code>NumberSums.jsx</code> for the others)</li>
            <li><strong>secretphoto:</strong> React 19 + TS, presentational SPA — <code>react-photo-album</code> masonry grid feeding <code>yet-another-react-lightbox</code>, no auth, no state machine, no router. The minimal-React end of the fleet.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a State Machine from Scratch</h2>
          <p>Open a fresh Vite + React + TS scaffold (<code>npm create vite@latest</code> → React → TypeScript). We'll build a three-view state machine with lazy code-splitting and <code>AnimatePresence</code> transitions.</p>

          <h3>Step 1 — Declare the view union</h3>
          <CodePre>{`// src/types/View.ts
export type View = 'dashboard' | 'recipes' | 'settings'

export const VIEW_LABELS: Record<View, string> = {
  dashboard: 'Dashboard',
  recipes:   'Recipes',
  settings:  'Settings',
}`}</CodePre>

          <h3>Step 2 — Create the three view components</h3>
          <p>Each file exports a default. Put a console.log so you can see when chunks load.</p>
          <CodePre>{`// src/views/Dashboard.tsx
console.log('[chunk] Dashboard loaded')
export default function Dashboard() {
  return <h1>📊 Dashboard</h1>
}`}</CodePre>
          <p>Duplicate for <code>Recipes.tsx</code> and <code>Settings.tsx</code>.</p>

          <h3>Step 3 — Wire up App with lazy + Suspense</h3>
          <CodePre>{`// src/App.tsx
import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { View } from './types/View'
import { VIEW_LABELS } from './types/View'

const Dashboard = lazy(() => import('./views/Dashboard'))
const Recipes   = lazy(() => import('./views/Recipes'))
const Settings  = lazy(() => import('./views/Settings'))

export default function App() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['dashboard', 'recipes', 'settings'] as View[]).map(v => (
          <button
            key={v}
            onMouseEnter={() => {
              // Preload on hover — see §4
              if (v === 'dashboard') import('./views/Dashboard')
              if (v === 'recipes')   import('./views/Recipes')
              if (v === 'settings')  import('./views/Settings')
            }}
            onClick={() => setView(v)}
            style={{
              padding: '8px 16px',
              background: view === v ? '#5C2A4A' : '#f5f0ea',
              color:      view === v ? 'white'   : '#1c0f07',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </nav>

      <Suspense fallback={<p>Loading…</p>}>
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Dashboard />
            </motion.div>
          )}
          {view === 'recipes' && (
            <motion.div key="recipes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Recipes />
            </motion.div>
          )}
          {view === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  )
}`}</CodePre>

          <h3>Step 4 — Verify in DevTools</h3>
          <ul>
            <li>Open the browser DevTools, Network tab, filter to "JS".</li>
            <li>Reload. You'll see the main chunk only — none of the view chunks.</li>
            <li>Click <strong>Recipes</strong>. You'll see <code>Recipes-<em>hash</em>.js</code> download. The console logs <code>[chunk] Recipes loaded</code>.</li>
            <li>Click back to Dashboard, then forward to Recipes again. No second download — chunk is cached.</li>
            <li>Hover (don't click) Settings. The chunk downloads in the background. Then click it: instant.</li>
          </ul>

          <h3>Step 5 — Try the exhaustiveness check</h3>
          <p>Add a fourth view to the union but <em>don't</em> add a render branch:</p>
          <CodePre>{`// src/types/View.ts
export type View = 'dashboard' | 'recipes' | 'settings' | 'profile'

// VIEW_LABELS now errors:
// Property 'profile' is missing in type '{ dashboard, recipes, settings }'`}</CodePre>
          <p>Run <code>npx tsc --noEmit</code> — you'll see the compile error pointing at <code>VIEW_LABELS</code>. This is the exhaustiveness payoff: TypeScript flags every place that needs an update when the union grows.</p>

          <h3>Optional — Step 6: extract to a reusable hook</h3>
          <CodePre>{`// src/hooks/useViewMachine.ts
import { useState, useCallback } from 'react'

export function useViewMachine<V extends string>(initial: V) {
  const [view, setView] = useState<V>(initial)
  const navigate = useCallback((v: V) => setView(v), [])
  return { view, navigate, isView: (v: V) => view === v }
}

// Usage:
const { view, navigate, isView } = useViewMachine<View>('dashboard')
// ...
<button onClick={() => navigate('recipes')}>Recipes</button>
{isView('recipes') && <Recipes />}`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>You've replicated the core pattern five out of eight fleet apps use. The next steps are routing-or-state-machine choice (see §3) and adding the synchronous-OID pattern (§6) when you wire auth.</div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Hook called conditionally" warning</h3>
          <p>You return early before all hooks run. Move every hook call to the top of the component, before any conditional return.</p>

          <h3>State updates twice in dev</h3>
          <p>React Strict Mode intentionally double-invokes renders, effects, and state setters in development to surface side effects in render bodies. It does NOT happen in production. If your effect's <em>net</em> behavior is wrong under double-invoke, the effect has a side effect that should be in an event handler, not an effect.</p>

          <h3>"Can't perform a React state update on an unmounted component"</h3>
          <p>You're setting state from an async callback after the component has unmounted. Add a cancellation flag (see §9 race conditions) or use <code>AbortController</code>.</p>

          <h3>Infinite re-render</h3>
          <ul>
            <li>You called a state setter inside the render body without a guard.</li>
            <li>An effect's dependency includes an object/array literal: <code>{`useEffect(..., [{ x: 1 }])`}</code> — new object every render → effect runs every render → setter inside → render → loop.</li>
            <li>A memoized value's deps array includes an unstable function. Wrap it in <code>useCallback</code>.</li>
          </ul>

          <h3>Lazy chunk doesn't load (404)</h3>
          <p>Two causes: <strong>(a)</strong> you deployed before the new chunk was pushed to the CDN; users with the old <code>index.html</code> are asking for a chunk that no longer exists. Solution: invalidate <code>index.html</code> on deploy, or use stable chunk names. <strong>(b)</strong> Vite emitted a chunk into a sub-folder and your App Service routing is rewriting JS requests to <code>index.html</code>. Check <code>web.config</code> / <code>staticwebapp.config.json</code> rewrite rules.</p>

          <h3>"Cannot update a component while rendering a different component"</h3>
          <p>You called <code>setX</code> in a child during its render, where <code>X</code> lives in a parent. Move the update into a <code>useEffect</code> or an event handler.</p>

          <h3>Framer Motion exit animation doesn't play</h3>
          <ul>
            <li>You forgot to wrap the entering/leaving element in <code>&lt;AnimatePresence&gt;</code>.</li>
            <li>The <code>key</code> prop didn't change between the two states.</li>
            <li>The element is rendered conditionally inside another <code>&lt;AnimatePresence&gt;</code> that already exited; nested AnimatePresence needs <code>mode="sync"</code> on the parent.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Hooks at a glance</h3>
          <table>
            <tbody>
              <tr><th>Hook</th><th>Reach for it when…</th></tr>
              <tr><td><code>useState</code></td><td>You need a value that survives re-renders</td></tr>
              <tr><td><code>useEffect</code></td><td>You're syncing with something outside React</td></tr>
              <tr><td><code>useMemo</code></td><td>A derivation is expensive OR its identity is a downstream dep</td></tr>
              <tr><td><code>useCallback</code></td><td>A function's identity is a downstream dep</td></tr>
              <tr><td><code>useRef</code></td><td>You need a mutable box or a DOM node reference</td></tr>
              <tr><td><code>useContext</code></td><td>You're reading a value provided higher up the tree</td></tr>
              <tr><td><code>useReducer</code></td><td>State has 3+ related fields with complex transitions</td></tr>
              <tr><td><code>useTransition</code></td><td>Some state updates should be interruptible</td></tr>
              <tr><td><code>useDeferredValue</code></td><td>A child should lag the parent's source of truth</td></tr>
              <tr><td><code>useId</code></td><td>You need a stable id (e.g. for <code>aria-labelledby</code>)</td></tr>
              <tr><td><code>useSyncExternalStore</code></td><td>You're subscribing to a non-React store</td></tr>
            </tbody>
          </table>

          <h3>The view-machine recipe (TS)</h3>
          <CodePre>{`// 1. Define
export type View = 'home' | 'detail' | 'settings'

// 2. Hold
const [view, setView] = useState<View>('home')

// 3. Render
{view === 'home'     && <Home />}
{view === 'detail'   && <Detail />}
{view === 'settings' && <Settings />}

// 4. Navigate
const go = (v: View) => setView(v)`}</CodePre>

          <h3>The lazy + Suspense recipe</h3>
          <CodePre>{`const Heavy = lazy(() => import('./Heavy'))

<Suspense fallback={<Spinner />}>
  <Heavy />
</Suspense>

// Hover-preload:
<button onMouseEnter={() => import('./Heavy')}>Go</button>`}</CodePre>

          <h3>The AnimatePresence recipe</h3>
          <CodePre>{`<AnimatePresence mode="wait">
  {showA && (
    <motion.div
      key="a"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <A />
    </motion.div>
  )}
</AnimatePresence>`}</CodePre>

          <h3>Stale closure fixes</h3>
          <CodePre>{`// Functional update (preferred):
setX(prev => prev + 1)

// Re-create the effect when value changes:
useEffect(() => { ... }, [x])

// Ref to read latest:
const xRef = useRef(x); useEffect(() => { xRef.current = x })`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>Repo · file · line</th></tr>
              <tr><td>View union + state</td><td>SecretApp · <code>src/types/AppView.ts</code> + <code>src/App.tsx:66</code></td></tr>
              <tr><td>Eleven-lazy block</td><td>SecretApp · <code>src/App.tsx:33-43</code></td></tr>
              <tr><td>Suspense fallback</td><td>SecretApp · <code>src/KnowledgeBase/index.tsx:212-229</code></td></tr>
              <tr><td>Synchronous OID</td><td>ShopKeep · <code>src/auth/AuthGuard.tsx:22-30</code></td></tr>
              <tr><td>~50 lazy via record</td><td>Cairn · <code>src/ExamPrepHub/index.tsx</code></td></tr>
              <tr><td>Three-gate entry</td><td>GLP1 · <code>src/App.jsx:92-109</code></td></tr>
              <tr><td>Server Component root</td><td>PulseWire · <code>src/app/layout.tsx</code></td></tr>
              <tr><td>String-state nav</td><td>Puzzlebox · <code>src/App.jsx:255</code></td></tr>
              <tr><td>IntersectionObserver tracking</td><td>SecretApp · any KB guide (e.g. this file)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — onward to TypeScript Strict Mode.</p>
        </section>
      </main>
    </div>
  );
}
