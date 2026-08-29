import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'motion.* + the Four Props',        icon: '🎬' },
  { id: 's3',  num: '3',  title: 'AnimatePresence + exit',           icon: '🌗' },
  { id: 's4',  num: '4',  title: 'Variants + Stagger',               icon: '🎭' },
  { id: 's5',  num: '5',  title: 'useReducedMotion',                 icon: '♿' },
  { id: 's6',  num: '6',  title: 'Layout Animations + layoutId',     icon: '📐' },
  { id: 's7',  num: '7',  title: 'GLP1 IntroAnimation deep dive',    icon: '✨' },
  { id: 's8',  num: '8',  title: 'Cairn View Crossfade',             icon: '🔀' },
  { id: 's9',  num: '9',  title: 'Performance: GPU vs Layout',       icon: '⚡' },
  { id: 's10', num: '10', title: 'Gotchas + Anti-patterns',          icon: '⚠️' },
  { id: 's11', num: '★',  title: 'Lab: View-State Crossfade',        icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                  icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                      icon: '📋' },
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

export default function FramerMotionGuide() {
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
            <span className="sidebar-title">Framer Motion</span>
          </div>
          <div className="sidebar-sub">Animations for the fleet</div>
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
          <div className="hero-tag">🎬 framer-motion 12.x · React 19 · 2026</div>
          <h1>Framer Motion<br />(animations across the fleet)</h1>
          <p>
            Three apps in the fleet — <strong style={{ color: '#C77AA0' }}>GLP1 (Tare), Cairn, and PulseWire</strong> —
            ship Framer Motion (now branded just "motion") as their animation engine. This guide is the deep dive: the
            four props that drive every animation, why <code>AnimatePresence</code> is the missing primitive React
            forgot, how Variants give you parent-orchestrated staggers without per-index <code>delay</code> math,
            and how to make every animation respect <code>prefers-reduced-motion</code> without writing a single
            conditional yourself.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Fleet apps</span></div>
            <div className="hero-stat"><span className="hero-stat-val">12.40</span><span className="hero-stat-label">Latest in fleet</span></div>
            <div className="hero-stat"><span className="hero-stat-val">4</span><span className="hero-stat-label">Core props</span></div>
            <div className="hero-stat"><span className="hero-stat-val">200ms</span><span className="hero-stat-label">Crossfade target</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Framer Motion is a React animation library. You wrap an element in <code>motion.div</code>, declare where
            it starts (<code>initial</code>), where it ends up (<code>animate</code>), and how the transition feels
            (<code>transition</code>) — and the library interpolates every frame in between. Underneath, it uses CSS
            transforms + the Web Animations API where it can, falls back to JS-driven <code>requestAnimationFrame</code>
            otherwise, and orchestrates parent/child timing through a "variants" system.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The stage manager.</strong> CSS transitions are like an actor doing their own choreography — every
            move is the actor's job, and there's no one to make sure two actors enter together. Framer Motion is a stage
            manager: you tell it "these five cards should enter staggered, 70ms apart, with a slight overshoot," and it
            coordinates them. The actors (your components) just declare what role they're playing.
          </p>
          <p>
            <strong>The missing primitive.</strong> React has <code>useState</code> for mounting and updating. It does
            NOT have "animate this component as it unmounts." When you do <code>setShow(false)</code>, the component is
            gone immediately — there's no afterlife. Framer Motion's <code>AnimatePresence</code> adds that primitive:
            it intercepts unmounting, plays the <code>exit</code> animation, THEN removes the node from the DOM. (See §3.)
          </p>
          <p>
            <strong>Declarative not imperative.</strong> jQuery animations were imperative: "fade this element, then
            slide it, then change color." Framer Motion is declarative: "this element's current pose is X; its next
            pose is Y." When you change <code>animate</code> from one value to another, the library figures out the
            interpolation. The same way React is declarative about DOM ("this is what the UI should look like, you
            figure out the diff").
          </p>

          <h3>The fleet at a glance</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Version</th><th>Where</th><th>Usage</th></tr>
              <tr><td>GLP1 (Tare)</td><td>12.38.0</td><td>health tracker</td><td>Cinematic intro, page transitions, stagger, count-up</td></tr>
              <tr><td>Cairn</td><td>12.39.0</td><td>study app</td><td>View-state-machine crossfade, stagger for exam grids</td></tr>
              <tr><td>PulseWire</td><td>12.40.0</td><td>news app</td><td>Page hero entrances, hover affordances</td></tr>
              <tr><td>SecretApp (Hearth)</td><td>—</td><td>this app</td><td>Not used — relies on MUI's built-in transitions instead</td></tr>
              <tr><td>ShopKeep / Puzzlebox / Tabloom / workshop</td><td>—</td><td>—</td><td>No motion library</td></tr>
            </tbody>
          </table>

          <p>
            The split makes sense. Health and study apps are emotional — the user shows up to confront a goal, and the
            UI is doing the heavy lift of making that feel manageable. News apps want a polished hero. Office-tools
            apps (Tabloom, ShopKeep) value being out of the way; their animations are MUI defaults.
          </p>

          <h3>Why "motion" and not "framer-motion"</h3>
          <p>
            In 2025, Framer Motion rebranded to just <strong>"motion"</strong> — the npm package became <code>motion</code>,
            the React-specific entry point became <code>motion/react</code>, and a vanilla-JS API was extracted. But the
            fleet still imports from the legacy <code>framer-motion</code> package, which is a thin compat shim that
            re-exports from <code>motion/react</code>. Both work; new apps should use <code>motion/react</code>.
          </p>

          <h3>What you get</h3>
          <ul>
            <li><strong><code>motion.X</code></strong> — proxy components for every HTML/SVG element. <code>motion.div</code>, <code>motion.button</code>, <code>motion.svg</code>, etc.</li>
            <li><strong>Animation props</strong> — <code>initial</code>, <code>animate</code>, <code>exit</code>, <code>transition</code>, <code>whileHover</code>, <code>whileTap</code>.</li>
            <li><strong><code>AnimatePresence</code></strong> — wraps children, plays their <code>exit</code> when they unmount.</li>
            <li><strong>Variants</strong> — named pose objects that propagate from parent to child (powers stagger).</li>
            <li><strong>Hooks</strong> — <code>useReducedMotion</code>, <code>useScroll</code>, <code>useTransform</code>, <code>useAnimate</code>, <code>useMotionValue</code>.</li>
            <li><strong>Layout animations</strong> — <code>layout</code> prop + <code>layoutId</code> for FLIP-style "magic move" transitions.</li>
          </ul>

          <p>
            The full surface is large; this guide covers the 80% the fleet actually uses. The hooks listed above past
            <code>useReducedMotion</code> are situational.
          </p>
        </section>

        <hr />

        {/* SECTION 2 — MOTION + 4 PROPS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>motion.* + the Four Props</h2>
          <p>Almost every animation in the fleet boils down to four props on a <code>motion.div</code>:</p>

          <CodePre>{`<motion.div
  initial={{ opacity: 0, y: 16 }}    // pose A — when the element first mounts
  animate={{ opacity: 1, y: 0 }}     // pose B — what it animates TO
  exit={{ opacity: 0, y: -8 }}       // pose C — what it animates to before unmounting
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  Hi
</motion.div>`}</CodePre>

          <h3>initial</h3>
          <p>
            Where the element starts. Object of CSS-shaped properties (with shortcuts: <code>x</code> / <code>y</code> instead
            of <code>transform: translateX</code> / <code>translateY</code>). If you pass <code>false</code>, the element
            skips the entrance animation entirely — useful for hydration or when the initial render already matches
            <code>animate</code>.
          </p>

          <h3>animate</h3>
          <p>
            Where the element ends up. Can be a static object (animates once on mount) or it can change over time —
            every time <code>animate</code>'s value changes, Framer Motion plays a transition from the current rendered
            state to the new one. So you can drive animation with React state:
          </p>
          <CodePre>{`const [open, setOpen] = useState(false)
<motion.div
  animate={{ rotate: open ? 90 : 0, opacity: open ? 1 : 0.5 }}
  transition={{ duration: 0.25 }}
/>`}</CodePre>

          <h3>exit</h3>
          <p>
            Only fires when the element is unmounted inside an <code>AnimatePresence</code> (see §3). Without
            <code>AnimatePresence</code>, React removes the node from the DOM before any animation can play.
          </p>

          <h3>transition</h3>
          <p>The "how" of the move. Two main families:</p>
          <ul>
            <li><strong>Tween</strong> (default for most props): time-based interpolation. <code>{`{ duration, ease }`}</code>.</li>
            <li><strong>Spring</strong> (default for <code>x</code>/<code>y</code>/<code>scale</code>): physics-based, time emerges from <code>stiffness</code> + <code>damping</code> + <code>mass</code>. <code>{`{ type: 'spring', stiffness: 400, damping: 30 }`}</code>.</li>
          </ul>

          <p>For predictable timing (page transitions, hero reveals), use tween. For organic feel (drag, gesture, pull-down), use spring.</p>

          <h3>Easing — the named curves</h3>
          <p>The built-in easings:</p>
          <CodePre>{`ease: 'linear'      // straight line, robotic
ease: 'easeIn'      // starts slow
ease: 'easeOut'     // ends slow — most common for entrances
ease: 'easeInOut'   // slow at both ends
ease: 'circIn' | 'circOut' | 'circInOut'    // circular
ease: 'backIn' | 'backOut' | 'backInOut'    // overshoots`}</CodePre>

          <p>Or pass a cubic-bezier array, which is how the fleet does it. Cairn's <code>ease</code> object (verbatim):</p>

          <CodePre>{`// cairn/src/views/motion.tsx (lines 12-17)
export const ease = {
  outCubic:   [0.215, 0.61, 0.355, 1] as const,
  outQuart:   [0.165, 0.84, 0.44, 1] as const,
  outBack:    [0.34, 1.56, 0.64, 1] as const,
  inOutCubic: [0.65, 0, 0.35, 1] as const,
};`}</CodePre>

          <p>
            <strong><code>outCubic</code></strong> is the workhorse — every page enter, every fade-up. <strong><code>outBack</code></strong>
            is the secret weapon: the curve goes slightly past 1.0 then settles back, giving an overshoot that reads as
            "playful" without being cartoonish. GLP1 uses it for the capsule logomark and for every stagger item.
          </p>

          <h3>Shortcut props</h3>
          <p>You can write <code>x</code> instead of <code>translateX</code>, <code>scale</code> instead of <code>transform: scale(...)</code>. The library compiles all of these into a single <code>transform</code> string:</p>

          <CodePre>{`<motion.div animate={{
  x: 100,       // translateX(100px)
  y: -50,       // translateY(-50px)
  scale: 1.1,   // scale(1.1)
  rotate: 12,   // rotate(12deg)
  skewX: 5,
}} />`}</CodePre>

          <p>Transforms are GPU-accelerated. Animating <code>x</code> + <code>scale</code> is much cheaper than animating <code>left</code> + <code>width</code> (§9 has the details).</p>

          <h3>Hover and tap shortcuts</h3>
          <CodePre>{`<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
  Click me
</motion.button>`}</CodePre>

          <p>
            These shortcuts auto-detect <code>pointerenter</code> / <code>pointerdown</code> events and animate back
            when the gesture ends. They're the single best return-on-effort in the whole library — replace every
            CSS <code>:hover</code> transition you have with these and the app immediately feels nicer.
          </p>
        </section>

        <hr />

        {/* SECTION 3 — ANIMATEPRESENCE */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>AnimatePresence + exit</h2>
          <p>
            The hardest problem in React animation is the unmount. When you do <code>setShow(false)</code>, React tears
            the DOM node out instantly — there's no place to hook an animation. <code>AnimatePresence</code> is the
            solution. It's a component that wraps children, intercepts unmounts, plays the child's <code>exit</code>
            animation, THEN actually removes the node.
          </p>

          <CodePre>{`import { AnimatePresence, motion } from 'framer-motion'

function Toast({ open, message }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}`}</CodePre>

          <h3>Three rules</h3>
          <ul>
            <li><strong>Children of <code>AnimatePresence</code> must have unique <code>key</code> props.</strong> Without a key, the library can't tell which child is leaving.</li>
            <li><strong>The element must be conditionally rendered.</strong> Hiding it with <code>display: none</code> doesn't trigger <code>exit</code> — the element has to be GONE from the JSX tree.</li>
            <li><strong>Only direct children of <code>AnimatePresence</code> get their <code>exit</code> animated.</strong> Wrap each thing you want to animate as its own <code>motion.X</code> direct child.</li>
          </ul>

          <h3>mode="wait" vs default</h3>
          <p>By default, <code>AnimatePresence</code> animates entering AND exiting children at the same time — they overlap. For page transitions where the new view shouldn't enter until the old one is gone, use <code>mode="wait"</code>:</p>

          <CodePre>{`<AnimatePresence mode="wait" initial={false}>
  <motion.div key={currentView} ...>{view}</motion.div>
</AnimatePresence>`}</CodePre>

          <p><code>initial={`{false}`}</code> suppresses the entrance animation on first render — otherwise the very first view fades in, which usually isn't what you want.</p>

          <h3>The three modes</h3>
          <table>
            <tbody>
              <tr><th>Mode</th><th>Behavior</th><th>Use for</th></tr>
              <tr><td><code>(default)</code></td><td>Old exits + new enters simultaneously</td><td>Modal stacks, toast queues</td></tr>
              <tr><td><code>mode="wait"</code></td><td>Old finishes exit, THEN new enters</td><td>Page/view transitions</td></tr>
              <tr><td><code>mode="popLayout"</code></td><td>Exiting element is taken out of flow so layout settles immediately</td><td>List item deletions</td></tr>
            </tbody>
          </table>

          <h3>The "child re-keying" trick</h3>
          <p>
            <code>AnimatePresence</code> sees a "new" child whenever the <code>key</code> changes. So you can force a
            re-animation just by changing the key, even on the same component:
          </p>
          <CodePre>{`<AnimatePresence mode="wait">
  <motion.div
    key={tab}                              // ← changes when user clicks a tab
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
  >
    <TabContent tab={tab} />
  </motion.div>
</AnimatePresence>`}</CodePre>

          <p>This is how Cairn does its view-state-machine crossfade — §8 has the full code.</p>

          <h3>Common gotcha: missing keys</h3>
          <p>If <code>AnimatePresence</code> isn't animating an exit, 9/10 times it's because the child doesn't have a key, OR the key isn't changing. React's reconciler matches children by position; without an explicit key, swapping component types looks like an "update" to React, not an unmount, and <code>exit</code> never fires.</p>
        </section>

        <hr />

        {/* SECTION 4 — VARIANTS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Variants + Stagger</h2>
          <p>
            Variants are named pose objects. Instead of writing <code>animate=&#123;&#123;...&#125;&#125;</code> on every
            child, you define a set of named states once and reference them by string. The win: a parent's variant change
            propagates to all <code>motion</code> children, AND the parent can orchestrate timing (stagger, delay).
          </p>

          <h3>The basic shape</h3>
          <CodePre>{`const fadeVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

<motion.div variants={fadeVariants} initial="hidden" animate="visible">
  Hello
</motion.div>`}</CodePre>

          <p><code>initial="hidden"</code> means "start at the variant named 'hidden'." <code>animate="visible"</code> means "go to the variant named 'visible'."</p>

          <h3>Why use variants instead of inline poses</h3>
          <ol>
            <li><strong>Reuse.</strong> One <code>STAGGER</code> object, used by every grid in the app.</li>
            <li><strong>Orchestration.</strong> The parent can sequence children via <code>staggerChildren</code> + <code>delayChildren</code>.</li>
            <li><strong>Propagation.</strong> When the parent switches variant, children inherit — no need to thread <code>animate</code> through every child.</li>
          </ol>

          <h3>The fleet's STAGGER pattern</h3>
          <p>GLP1 and Cairn both use the same shape. Cairn's version (verbatim from the codebase):</p>

          <CodePre>{`// cairn/src/views/motion.tsx (lines 19-38)
const STAGGER = {
  container: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.04,
      },
    },
  },
  item: {
    hidden:  { opacity: 0, y: 16, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.42, ease: ease.outBack },
    },
  },
};`}</CodePre>

          <p>How it works:</p>
          <ul>
            <li>The container has empty poses — it isn't visually animating. Its job is just <strong>orchestration</strong>.</li>
            <li><code>staggerChildren: 0.07</code> means each child's entrance starts 70ms after the previous one.</li>
            <li><code>delayChildren: 0.04</code> means the first child waits 40ms before starting.</li>
            <li>Each item has the real animation (fade-up + scale + outBack overshoot).</li>
          </ul>

          <h3>The wrapper components</h3>
          <CodePre>{`// cairn/src/views/motion.tsx (lines 40-83)
export function Stagger({ children, className, style }) {
  return (
    <motion.div
      variants={STAGGER.container}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, style, onClick }) {
  return (
    <motion.div
      variants={STAGGER.item}
      onClick={onClick}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}`}</CodePre>

          <p>Usage in Cairn's HomePage:</p>
          <CodePre>{`<Stagger className="grid grid-cols-3 gap-4">
  {levels.map(level => (
    <StaggerItem key={level.id} onClick={() => onSelectLevel(level.id)}>
      <LevelCard level={level} />
    </StaggerItem>
  ))}
</Stagger>`}</CodePre>

          <p>That's it. Five lines of JSX gets you a dozen cards entering in cascade with a slight overshoot. No per-index <code>delay</code> math. If the list has 50 items, it still works — staggerChildren computes the cascade automatically.</p>

          <h3>The 70ms vs 120ms tradeoff</h3>
          <p>
            GLP1's primitives.jsx uses <code>staggerChildren: 0.12</code>; Cairn uses <code>0.07</code>. The difference
            is intentional. GLP1's dashboard has 4–6 hero stats — fewer items, longer cascade reads more deliberate.
            Cairn's exam grid has 12–22 items — a 120ms cascade would take 1.5+ seconds and feel slow. Tune
            <code>staggerChildren</code> to roughly <code>total ≈ items × stagger ≤ 0.8s</code>.
          </p>

          <h3>Variant inheritance</h3>
          <p>A subtle point: when a parent's variant changes, ALL <code>motion.*</code> descendants with matching variant names react, not just direct children. This means you can have a Stagger inside a Stagger and the timing nests correctly.</p>

          <CodePre>{`// Nested staggers — outer cascade reveals sections,
// inner cascade reveals each section's cards.
<Stagger>
  <StaggerItem>
    <Stagger>
      <StaggerItem><CardA /></StaggerItem>
      <StaggerItem><CardB /></StaggerItem>
    </Stagger>
  </StaggerItem>
  <StaggerItem>{/* second section */}</StaggerItem>
</Stagger>`}</CodePre>

          <p>Each inner Stagger fires its cascade when its parent StaggerItem hits "visible." Surprisingly elegant.</p>
        </section>

        <hr />

        {/* SECTION 5 — REDUCED MOTION */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>useReducedMotion (accessibility)</h2>
          <p>
            macOS, iOS, Windows, and Android all expose a "reduce motion" accessibility setting. Some users get
            vertigo from translate-Y animations; some have vestibular disorders triggered by parallax. The browser
            surfaces this preference via the <code>prefers-reduced-motion: reduce</code> media query.
          </p>

          <h3>The hook</h3>
          <p><code>useReducedMotion()</code> returns <code>true</code> when the user has opted in to reduced motion. Use it to swap out — or shorten — your animations.</p>

          <CodePre>{`import { motion, useReducedMotion } from 'framer-motion'

function FadeUp({ children, y = 8, duration = 0.4 }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}     // no translate when reduced
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.001 : duration }}
    >
      {children}
    </motion.div>
  )
}`}</CodePre>

          <h3>The fleet's pattern</h3>
          <p>GLP1's FadeUp (verbatim) and Cairn's RouteFade both follow this convention: opacity always animates (it's safe — no spatial motion), but Y-translate is suppressed and duration becomes near-zero when reduced motion is on.</p>

          <CodePre>{`// glp1/src/components/motion/primitives.jsx (lines 131-144)
export function FadeUp({ children, delay = 0, y = 8, className, ...rest }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: ease.outCubic, delay: reduce ? 0 : delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}`}</CodePre>

          <h3>The intro animation respects it too</h3>
          <p>GLP1's IntroAnimation (the cinematic 3.6s intro) bails out entirely when reduced motion is set, replacing the whole cinematic with a 250ms opacity fade:</p>

          <CodePre>{`// glp1/src/components/motion/IntroAnimation.jsx (lines 22-49)
const reduce = useReducedMotion()
const total = reduce ? 0.25 : 3.6   // bail out fast

if (reduce) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: 0.25 }}
      onClick={handleSkip}
      className="fixed inset-0 z-50 ..."
    >
      <Wordmark instant />
    </motion.div>
  )
}
// (otherwise: full cinematic with orbital dots, capsule, etc.)`}</CodePre>

          <p>That's the right pattern: don't try to make a "reduced-motion version" of every animation. Have a fast-path that just shows the end-state. The user who set reduced motion wants the UI to be USEFUL, not "almost the same animation but a bit less."</p>

          <h3>The CSS safety net</h3>
          <p>Even with Framer Motion handling things, add a global CSS clamp for animations that slipped through (third-party libraries, CSS animations, etc.):</p>

          <CodePre>{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}`}</CodePre>

          <p>This is in GLP1's <code>index.css</code> and Cairn's global stylesheet. Defense in depth.</p>

          <h3>Framer Motion's built-in respect</h3>
          <p>
            framer-motion automatically shortens spring transitions when reduced motion is set — even without
            <code>useReducedMotion</code>, your spring animations get clamped. But tween durations are NOT auto-reduced.
            Use the hook for tweens you care about.
          </p>
        </section>

        <hr />

        {/* SECTION 6 — LAYOUT ANIMATIONS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Layout Animations + layoutId</h2>
          <p>
            Two of the more advanced features. <code>layout</code> auto-animates when the layout of an element changes
            (size, position, anything caused by sibling re-arrangement). <code>layoutId</code> animates between two
            DIFFERENT elements that share an ID — the classic "magic move" between a thumbnail and an expanded card.
          </p>

          <h3>The layout prop</h3>
          <CodePre>{`<motion.div layout>
  {expanded ? <ExpandedContent /> : <CollapsedContent />}
</motion.div>`}</CodePre>

          <p>
            When the contents change size, the wrapper smoothly animates between the old bounds and the new bounds.
            Internally, Framer Motion measures the element BEFORE the layout change, lets React update, measures AFTER,
            then plays a FLIP animation (First, Last, Invert, Play — a classic layout animation technique).
          </p>

          <p>Use it for accordions, expandable cards, list filtering, anything where the DOM layout shifts on a state change.</p>

          <h3>The layoutId prop — shared element transitions</h3>
          <p>Two elements with the same <code>layoutId</code>, ONE rendered at a time. Framer Motion animates from one to the other:</p>

          <CodePre>{`function Gallery({ selected, items, onSelect, onClose }) {
  return (
    <>
      <div className="grid">
        {items.map(item =>
          selected === item.id ? null : (
            <motion.div
              key={item.id}
              layoutId={\`card-\${item.id}\`}
              onClick={() => onSelect(item.id)}
              className="thumb"
            >
              {item.title}
            </motion.div>
          )
        )}
      </div>
      <AnimatePresence>
        {selected != null && (
          <motion.div
            layoutId={\`card-\${selected}\`}
            className="expanded-modal"
            onClick={onClose}
          >
            <FullDetail id={selected} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}`}</CodePre>

          <p>When the user clicks a thumb, it visually expands into the modal — same DOM node logically, even though it's two separate components. Behind the scenes, Framer Motion measures the source, the destination, and plays the FLIP transition between them.</p>

          <h3>When the fleet uses this</h3>
          <p>
            Honestly, sparingly. Layout animations are CPU-expensive — every measurement triggers a layout pass. The
            fleet currently uses layout animations in two places: Cairn's exam-detail expand-from-card (TBD when level
            three is added), and GLP1's WeeklyChart drawer (when you tap a day, the day's row expands into a detail
            sheet). Pulse Wire considered it for article cards but stuck with a route-level crossfade.
          </p>

          <h3>The cost: don't overuse</h3>
          <p>Every <code>layout</code> prop adds a measurement on every render. A list of 200 cards each with <code>layout</code> is going to thrash. Use sparingly, and prefer changing <code>animate</code> on transforms when you can.</p>
        </section>

        <hr />

        {/* SECTION 7 — INTRO ANIMATION */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>GLP1 IntroAnimation deep dive</h2>
          <p>
            GLP1's first-launch intro is the most cinematic piece of motion in the fleet. It plays once per browser
            session (gated by <code>sessionStorage</code>), runs ~3.6s, and combines five layered animations: a
            background radial gradient, twelve orbital dots, a brand capsule logomark with pulse, a wordmark that types
            in character-by-character, and a tagline that fades up at the end. Tap to skip. Reduces to a 250ms fade when
            reduced motion is set.
          </p>

          <p>It's small enough to reproduce verbatim. Reading it is a master class in compound animations.</p>

          <h3>The top-level orchestration</h3>
          <CodePre>{`// glp1/src/components/motion/IntroAnimation.jsx — verbatim
export default function IntroAnimation({ onDone }) {
  const reduce = useReducedMotion()
  const [skipped, setSkipped] = useState(false)
  const total = reduce ? 0.25 : 3.6

  useEffect(() => {
    const t = setTimeout(() => onDone?.(), total * 1000)
    return () => clearTimeout(t)
  }, [onDone, total])

  // ... (reduced-motion early return) ...

  return (
    <motion.div
      onClick={handleSkip}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 ..."
    >
      <Background />
      <OrbitalDots />
      <Capsule />     {/* delay 1.1s */}
      <Wordmark />    {/* delay 1.6s */}
      <Tagline />     {/* delay 2.3s */}
      <SkipHint />    {/* delay 2.8s */}
    </motion.div>
  )
}`}</CodePre>

          <p>
            The whole intro is one <code>motion.div</code> with five children, each starting at a different
            <code>delay</code>. No variants here — the timing is deliberately staggered, not procedural. The container's
            only job is the final fade-out (<code>exit</code>) when it gets unmounted by its parent.
          </p>

          <h3>The background gradient</h3>
          <CodePre>{`<motion.div
  initial={{ opacity: 0, scale: 1.1 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.4, ease: ease.outCubic }}
  style={{
    background:
      'radial-gradient(60% 50% at 50% 45%, #fef3c7 0%, #fbf6ec 65%, #fbf6ec 100%)',
  }}
/>`}</CodePre>

          <p>1.4 seconds, gentle. The 1.1 → 1.0 scale on top of the opacity fade reads as the gradient "settling in" — like the camera focus pulling.</p>

          <h3>The orbital dots — the keyframes trick</h3>
          <p>This is where it gets clever. Twelve dots, each with a SCALAR delay, animating between three keyframes:</p>

          <CodePre>{`{dots.map(i => {
  const angle = (i / 12) * Math.PI * 2
  const radius = 110
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius

  return (
    <motion.div
      key={i}
      initial={{ x, y, opacity: 0, scale: 0.5 }}
      animate={{
        x:       [x, x, 0],      // ← stays at outer position, then collapses to center
        y:       [y, y, 0],
        opacity: [0, 0.9, 0],    // ← fades in, holds, fades out
        scale:   [0.5, 1, 0.4],
      }}
      transition={{
        duration: 2.2,
        delay: 0.2 + i * 0.04,
        ease: ease.inOutCubic,
        times: [0, 0.55, 1],      // ← keyframe positions on the duration timeline
      }}
      className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
      style={{ marginLeft: -4, marginTop: -4, background: '#a98049' }}
    />
  )
})}`}</CodePre>

          <p><strong>The <code>times</code> array</strong> is the key. It says "keyframe 0 at t=0, keyframe 1 at t=0.55, keyframe 2 at t=1.0." The dot enters at full radius, holds for 55% of the duration, then collapses to center. Without <code>times</code>, the three keyframes would be evenly distributed (0, 0.5, 1) — and the "hold" period would be 0 instead of 55%.</p>

          <p>Each dot has a different <code>delay</code> (<code>i * 0.04</code> means 40ms per dot, 480ms across all 12) so the entrances cascade.</p>

          <h3>The capsule — pulse via mirror repeat</h3>
          <CodePre>{`<motion.svg
  width="180" height="80" viewBox="0 0 180 80"
  animate={{ scale: [1, 1.03, 1] }}
  transition={{
    duration: 1.6,
    ease: ease.inOutCubic,
    repeat: Infinity,
    repeatType: 'mirror',
  }}
>
  {/* ... capsule shape ... */}
</motion.svg>`}</CodePre>

          <p><code>repeat: Infinity</code> + <code>repeatType: 'mirror'</code> ping-pongs the animation forever — go to 1.03, back to 1, go to 1.03, back. The result is a subtle "breathing" pulse on the brand mark.</p>

          <h3>The wordmark — typewriter via per-char delay</h3>
          <CodePre>{`function Wordmark({ instant = false }) {
  const chars = 'Tare'.split('')
  return (
    <div className="...">
      {chars.map((c, i) => (
        <motion.span
          key={i}
          initial={instant ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: instant ? 0 : 1.6 + i * 0.08,
            ease: ease.outCubic,
          }}
          className="..."
        >
          {c}
        </motion.span>
      ))}
    </div>
  )
}`}</CodePre>

          <p>Per-character <code>delay</code> = 0.08s = 80ms per letter. "Tare" has 4 characters → 4 × 80ms = 320ms total for the wordmark to fully type in. Cheap visual reward.</p>

          <h3>The skip handler</h3>
          <CodePre>{`const handleSkip = () => {
  if (skipped) return
  setSkipped(true)
  onDone?.()
}

// ...
<motion.div onClick={handleSkip} ...>`}</CodePre>

          <p>One click anywhere fires <code>onDone</code> early. The parent component unmounts IntroAnimation, which triggers its <code>exit</code> opacity fade (because it's a direct child of <code>AnimatePresence</code> upstream).</p>

          <h3>What you can steal</h3>
          <ul>
            <li>The "keyframe array + times" pattern for non-linear timing within a single animation.</li>
            <li><code>repeat: Infinity</code> + <code>repeatType: 'mirror'</code> for any subtle pulse (button, badge, indicator).</li>
            <li>Per-index delay for typewriter / staggered character effects.</li>
            <li>The reduced-motion bail-out path — replace the whole cinematic, don't try to "tone it down."</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 8 — CAIRN CROSSFADE */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Cairn's View-State Crossfade</h2>
          <p>
            Cairn doesn't use a router. Its <code>App.tsx</code> holds a discriminated union <code>view</code> state and
            switches between five top-level "pages" (home, level, exam, details, admin). The transition between them is
            a <code>200ms</code> opacity-plus-translate crossfade managed entirely by <code>AnimatePresence</code> +
            <code>RouteFade</code>. It's the cleanest example in the fleet of using <code>AnimatePresence</code> to
            animate between state-machine states (not URL routes).
          </p>

          <h3>The view state</h3>
          <CodePre>{`type View =
  | { kind: 'home' }
  | { kind: 'level'; level: 1 | 2 | 3 }
  | { kind: 'exam'; examId: string; fromLevel: 1 | 2 | 3 }
  | { kind: 'details' }
  | { kind: 'admin' }

const [view, setView] = useState<View>({ kind: 'home' })`}</CodePre>

          <h3>The render — verbatim</h3>
          <CodePre>{`// cairn/src/App.tsx (lines 59-101)
// Single key per view so AnimatePresence can crossfade. Faster (200ms)
// than the previous 350ms exit+entry so the next page's stagger starts
// before the user notices a gap.
const routeKey =
  view.kind === 'level' ? \`level-\${view.level}\` :
  view.kind === 'exam'  ? \`exam-\${view.examId}\` :
  view.kind;

return (
  <AnimatePresence mode="wait" initial={false}>
    <RouteFade key={routeKey} routeKey={routeKey}>
      {view.kind === 'home'    && <HomePage    ... />}
      {view.kind === 'details' && <DetailsPage ... />}
      {view.kind === 'admin'   && <AdminPortal ... />}
      {view.kind === 'level'   && <LevelPage   ... />}
      {view.kind === 'exam'    && <ExamPrepHub ... />}
    </RouteFade>
  </AnimatePresence>
);`}</CodePre>

          <h3>The RouteFade primitive</h3>
          <CodePre>{`// cairn/src/views/motion.tsx (lines 119-138)
export function RouteFade({ children, routeKey }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: reduce ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -4 }}
      transition={{ duration: reduce ? 0.001 : 0.2, ease: ease.outCubic }}
    >
      {children}
    </motion.div>
  );
}`}</CodePre>

          <p>Three observations:</p>
          <ol>
            <li><strong>The key is the routeKey, NOT just <code>view.kind</code>.</strong> If you navigate from level-1 to level-2, both are <code>kind: 'level'</code>; without including the level number in the key, AnimatePresence would think it's the same view and not animate.</li>
            <li><strong>Exit translate is negative (Y: -4); enter translate is positive (Y: 6).</strong> The previous view "exits up," the next view "enters from below" — a tiny vertical motion that reads as forward navigation.</li>
            <li><strong><code>initial=&#123;false&#125;</code> on AnimatePresence</strong> suppresses the entrance animation on first render (so the very first home page doesn't fade in on initial load).</li>
          </ol>

          <h3>Why 200ms specifically</h3>
          <p>
            The comment in the code is instructive: "the next page's stagger starts before the user notices a gap." If
            the crossfade is too long, the next page's interior animations (Stagger items) feel slow because they're
            waiting for the crossfade to finish. 200ms is the floor — long enough to be perceived as a transition, short
            enough that the next page's stagger fires while the user's eye is still adjusting.
          </p>

          <h3>What this replaces</h3>
          <p>
            Without AnimatePresence, switching view state would be an instant DOM swap — jarring, especially for views
            with heavy hero content. <code>RouteFade</code> + <code>AnimatePresence</code> gives you a router-like
            transition WITHOUT introducing a router. Same pattern works for:
          </p>
          <ul>
            <li>Tab switching (key = tab name)</li>
            <li>Wizard step navigation (key = step number)</li>
            <li>Modal stack transitions (key = top-of-stack id)</li>
            <li>Any "single component switches what's inside" pattern</li>
          </ul>

          <h3>What Hearth could borrow</h3>
          <p>
            Hearth's <code>App.tsx</code> drives a similar single-state-machine navigation pattern. Currently it has no
            crossfade — views swap instantly. Wrapping Hearth's view switch in <code>AnimatePresence</code> + a
            <code>RouteFade</code>-style component would give it the same polish for ~30 lines of code. Not on the
            current roadmap, but a candidate if the UX feels too "clicky."
          </p>
        </section>

        <hr />

        {/* SECTION 9 — PERFORMANCE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Performance: GPU vs Layout</h2>
          <p>
            All animations are not equal. Some properties run on the GPU at 60fps without breaking a sweat. Others
            trigger a layout pass on every frame and tank the framerate. Knowing the difference matters as much in
            Framer Motion as it does in raw CSS.
          </p>

          <h3>The GPU-cheap properties</h3>
          <p>Composited transforms — they don't trigger layout or paint:</p>
          <ul>
            <li><code>x</code>, <code>y</code>, <code>z</code> — translateX/Y/Z</li>
            <li><code>scale</code>, <code>scaleX</code>, <code>scaleY</code></li>
            <li><code>rotate</code>, <code>rotateX</code>, <code>rotateY</code>, <code>rotateZ</code></li>
            <li><code>opacity</code></li>
            <li><code>filter</code> (blur, hue-rotate, etc.) — paint but not layout</li>
          </ul>

          <h3>The layout-expensive properties</h3>
          <p>These trigger a layout recalculation. Animate them only when you have to:</p>
          <ul>
            <li><code>width</code> / <code>height</code> — recalculates ALL siblings + parents</li>
            <li><code>top</code> / <code>left</code> / <code>right</code> / <code>bottom</code> — same</li>
            <li><code>margin</code> / <code>padding</code></li>
            <li><code>font-size</code></li>
            <li>Any flex/grid property that changes track sizing</li>
          </ul>

          <h3>The rewrite rule</h3>
          <p>If you'd reach for <code>width</code> + <code>height</code>, ask: can I use <code>scale</code> instead?</p>

          <CodePre>{`// SLOW — layout thrash
<motion.div animate={{ width: open ? 400 : 100, height: open ? 300 : 100 }} />

// FAST — GPU
<motion.div
  style={{ width: 400, height: 300 }}        // intrinsic max size
  animate={{ scale: open ? 1 : 0.25 }}       // GPU transform
/>`}</CodePre>

          <p>The pitfall: the GPU version doesn't push siblings around. If the layout WANTS to reflow as the element grows, you need the layout animation (§6) — which uses FLIP to swap a layout change into a GPU-cheap transform. That's the whole point of <code>layout</code>.</p>

          <h3>will-change is automatic — usually</h3>
          <p>Framer Motion sets <code>will-change: transform, opacity</code> on animating elements automatically. This hints to the browser to put the element on its own compositor layer. But:</p>
          <ul>
            <li>Don't manually set <code>will-change</code> EVERYWHERE — too many layers cost memory.</li>
            <li>Don't animate with a <code>filter</code> + a <code>transform</code> in the same component if you can avoid it — combined operations sometimes fall off the fast path.</li>
            <li>Watch the Chrome DevTools Performance panel. Look for "Layout" in the recording — every Layout block during animation is a fall-off-fast-path moment.</li>
          </ul>

          <h3>Spring vs tween cost</h3>
          <p>Springs run physics simulations until they settle. Most settle in 400–800ms. The cost is per-frame compute, not memory. Tween is interpolated math — slightly cheaper but you have to pick a duration.</p>

          <p>For UI affordances (hover, tap): spring feels organic, cost is negligible. For batch animations (50 stagger items): tween with a fixed duration is more predictable and CPU-cheap.</p>

          <h3>Measuring</h3>
          <p>Open Chrome DevTools → Performance → record while the animation plays. The flame chart shows:</p>
          <ul>
            <li><strong>Animation Frame</strong> bars — every 16.67ms is good (60fps).</li>
            <li><strong>Layout</strong> blocks — if these appear during your animation, you have a layout-expensive property in your <code>animate</code>.</li>
            <li><strong>Composite Layers</strong> in the Layers panel — see which elements have their own GPU layer.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 10 — GOTCHAS */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Gotchas + Anti-patterns</h2>

          <h3>1. AnimatePresence + conditional render — not display:none</h3>
          <p><code>display: none</code> doesn't unmount. <code>exit</code> only plays on UNMOUNT. Use <code>&#123;condition && ...&#125;</code>, not <code>style.display</code>.</p>

          <h3>2. Direct children only for AnimatePresence</h3>
          <p>
            AnimatePresence only animates the exit of its DIRECT motion children. Wrapping the conditional element in a
            non-motion div breaks it:
          </p>

          <CodePre>{`// BAD — div wrapper kills exit
<AnimatePresence>
  {open && (
    <div>
      <motion.div exit={{ opacity: 0 }}>...</motion.div>
    </div>
  )}
</AnimatePresence>

// GOOD
<AnimatePresence>
  {open && <motion.div exit={{ opacity: 0 }}>...</motion.div>}
</AnimatePresence>`}</CodePre>

          <h3>3. Keys, keys, keys</h3>
          <p>AnimatePresence matches children by <code>key</code> to figure out who's entering / exiting. No key → it doesn't know. Same key across re-renders → no exit/enter. Use a key that genuinely identifies the content.</p>

          <h3>4. The "Infinity" repeat type</h3>
          <p>
            <code>{`{ repeat: Infinity }`}</code> never stops. If the animating element unmounts, the timer stays alive
            briefly (Framer Motion handles cleanup, but custom RAF loops you wrote DON'T). For looping pulse / shimmer,
            use Framer's <code>repeat: Infinity</code> — don't roll your own.
          </p>

          <h3>5. Mixing transition properties across nested motions</h3>
          <p>
            If the parent has <code>transition=&#123;&#123; duration: 0.5 &#125;&#125;</code> and the child has
            <code>transition=&#123;&#123; duration: 0.2 &#125;&#125;</code>, the child wins for its own animations. But
            if you set transition ONLY on the parent and rely on variant inheritance, the parent's transition propagates.
            Be explicit about where transition lives — usually on the variant definition, not on the JSX prop.
          </p>

          <h3>6. Using motion.div for elements that don't animate</h3>
          <p>Every <code>motion.X</code> subscribes to motion contexts and has marginal cost. Don't replace every <code>div</code> with <code>motion.div</code> "just in case." Use plain <code>div</code> for static layout, <code>motion.div</code> only where you actually need animation.</p>

          <h3>7. Animating between unequal arrays</h3>
          <p>
            <code>animate=&#123;&#123; x: [0, 100, 50] &#125;&#125;</code> and the next render passes
            <code>animate=&#123;&#123; x: [0, 100, 50, 200] &#125;&#125;</code> — Framer Motion may not interpolate
            smoothly because the keyframe count changed. Be consistent with array length within a given animate sequence.
          </p>

          <h3>8. Forgetting initial={`{false}`} on first-render AnimatePresence</h3>
          <p>If you don't pass <code>initial=&#123;false&#125;</code>, the very first render plays the entrance animation. For a page wrapper, you usually want the first page to just BE there, with no entrance. Pass <code>initial=&#123;false&#125;</code> on the outer AnimatePresence.</p>

          <h3>9. Variants override single-pose props</h3>
          <p>If you pass both <code>variants</code> and an inline <code>animate=&#123;&#123;...&#125;&#125;</code> object, the variants win. Pick one approach per component — don't mix.</p>

          <h3>10. Forgetting to add motion to the right element</h3>
          <p>You wrap a Card in <code>motion.div</code>, but the CARD itself sets its own height via internal layout. The motion wrapper's <code>animate=&#123;&#123; height &#125;&#125;</code> is fighting the card's intrinsic height. Animate <code>opacity</code> + <code>scale</code> on the outer wrapper, NOT structural properties of the inner content.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: View-State Crossfade</h2>
          <p>
            Build Cairn's view-state crossfade pattern in ~50 lines of code. Two views, a header with two buttons,
            and a 200ms crossfade between them. By the end you'll have the same primitive Cairn uses in production.
          </p>

          <h3>Setup</h3>
          <CodePre>{`npm install framer-motion`}</CodePre>

          <h3>Step 1 — the view state</h3>
          <CodePre>{`// App.tsx
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

type View = { kind: 'home' } | { kind: 'detail'; id: number }

export default function App() {
  const [view, setView] = useState<View>({ kind: 'home' })
  return (
    <div className="container">
      <Header view={view} onHome={() => setView({ kind: 'home' })} />
      <ViewRouter view={view} setView={setView} />
    </div>
  )
}`}</CodePre>

          <h3>Step 2 — the RouteFade primitive</h3>
          <CodePre>{`function RouteFade({ children, routeKey }: { children: React.ReactNode; routeKey: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: reduce ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -4 }}
      transition={{ duration: reduce ? 0.001 : 0.2, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {children}
    </motion.div>
  )
}`}</CodePre>

          <h3>Step 3 — the router</h3>
          <CodePre>{`function ViewRouter({ view, setView }: { view: View; setView: (v: View) => void }) {
  const routeKey =
    view.kind === 'detail' ? \`detail-\${view.id}\` : view.kind

  return (
    <AnimatePresence mode="wait" initial={false}>
      <RouteFade key={routeKey} routeKey={routeKey}>
        {view.kind === 'home' && (
          <HomeView onOpen={(id) => setView({ kind: 'detail', id })} />
        )}
        {view.kind === 'detail' && (
          <DetailView id={view.id} onBack={() => setView({ kind: 'home' })} />
        )}
      </RouteFade>
    </AnimatePresence>
  )
}`}</CodePre>

          <h3>Step 4 — Stagger and StaggerItem</h3>
          <CodePre>{`const STAGGER = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  },
  item: {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.42, ease: [0.34, 1.56, 0.64, 1] },
    },
  },
}

function Stagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={STAGGER.container}
      initial="hidden"
      animate="visible"
      className="grid"
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.div variants={STAGGER.item} onClick={onClick} className="card">
      {children}
    </motion.div>
  )
}`}</CodePre>

          <h3>Step 5 — the views</h3>
          <CodePre>{`function HomeView({ onOpen }: { onOpen: (id: number) => void }) {
  return (
    <Stagger>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <StaggerItem key={i} onClick={() => onOpen(i)}>
          Card {i}
        </StaggerItem>
      ))}
    </Stagger>
  )
}

function DetailView({ id, onBack }: { id: number; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <h1>Detail for card {id}</h1>
    </div>
  )
}`}</CodePre>

          <h3>What you should see</h3>
          <ol>
            <li>On mount: home view's 6 cards cascade in from 16px below, slightly scaled up, with a soft overshoot.</li>
            <li>Click a card → home view fades + drifts up; detail view enters from below, all in 200ms.</li>
            <li>Click Back → reverse direction.</li>
            <li>Enable "Reduce motion" in OS settings → the cascade collapses to a 1ms opacity swap, but the UI still works.</li>
          </ol>

          <h3>Extensions</h3>
          <ul>
            <li>Add a third view (settings). Show how easy it is to add states.</li>
            <li>Add <code>whileHover</code> and <code>whileTap</code> to <code>StaggerItem</code>.</li>
            <li>Try <code>layoutId</code> so clicking a card visually expands it into the detail view.</li>
            <li>Add an IntroAnimation with a 1.5s reveal on first session.</li>
          </ul>

          <p>If you can build the lab from scratch, you understand 80% of what the fleet does with Framer Motion.</p>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"My exit animation isn't playing"</h3>
          <p>Diagnosis tree:</p>
          <ul>
            <li>Is the element inside <code>AnimatePresence</code>? — Exit ONLY plays inside AnimatePresence.</li>
            <li>Is the element conditionally rendered (<code>&#123;cond && ...&#125;</code>)? — Not display:none, not visibility:hidden.</li>
            <li>Does the element have a <code>key</code>? — AnimatePresence needs keys.</li>
            <li>Is the element a DIRECT child of <code>AnimatePresence</code>? — Wrapped in a non-motion div = no exit.</li>
            <li>Has the parent re-rendered with the same key + different children? — That's not an unmount, it's an update.</li>
          </ul>

          <h3>"The first render is animating, but I want it to just appear"</h3>
          <p>Pass <code>initial=&#123;false&#125;</code> on the <code>AnimatePresence</code> (page level), OR pass <code>initial=&#123;false&#125;</code> on the individual <code>motion.div</code>. Both work; the AnimatePresence version cascades to all children.</p>

          <h3>"My stagger isn't staggering"</h3>
          <ul>
            <li>Are the children <code>motion.X</code> components? — Variants only propagate to motion components.</li>
            <li>Do the children declare <code>variants=&#123;...&#125;</code>? — They need to reference the same variant names the parent does.</li>
            <li>Is the parent passing <code>initial</code> and <code>animate</code>? — Variant transition happens on those props.</li>
            <li>Is <code>staggerChildren</code> on the CONTAINER variant's <code>transition</code>? — Common mistake: it goes on the variant, not as a top-level prop.</li>
          </ul>

          <h3>"Animation jumps at the end"</h3>
          <p>Usually a CSS specificity issue. Framer Motion writes inline styles for transform / opacity. If your CSS has <code>!important</code> on the same property, the inline style is overridden and the final state snaps. Drop the !important.</p>

          <h3>"Performance is bad on mobile"</h3>
          <p>
            Almost always layout-expensive properties. Open the Performance panel on a real device (not desktop emulation)
            and look for Layout blocks during the animation. Replace <code>width</code> / <code>height</code> with
            <code>scale</code>. Replace <code>top</code> / <code>left</code> with <code>x</code> / <code>y</code>. If
            you have a <code>layout</code> prop on something that doesn't NEED FLIP, remove it.
          </p>

          <h3>"TypeScript complains about my variant types"</h3>
          <p>Framer Motion's variant types are loose by design (they accept any string-keyed object of CSS-shaped values). If you want strict types:</p>
          <CodePre>{`import type { Variants } from 'framer-motion'

const STAGGER: Variants = {           // ← typed
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}`}</CodePre>

          <h3>"useReducedMotion always returns null on first render"</h3>
          <p>It does — the hook needs a tick to subscribe to <code>matchMedia</code>. On first render it returns <code>null</code>; subsequent renders return the actual value. Always check for null OR use it inside <code>useEffect</code>.</p>

          <h3>"My route transition flickers"</h3>
          <p>
            Two causes. Either (a) <code>mode="wait"</code> is missing and the entry/exit overlap visually, or (b) the
            outgoing component's heavy children are still rendering during exit. For (b), memo the page component or
            shorten the exit duration so the flicker is below perceptual threshold (<code>{`{ duration: 0.15 }`}</code>).
          </p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The four props</h3>
          <CodePre>{`<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
/>`}</CodePre>

          <h3>Hover / tap</h3>
          <CodePre>{`<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
/>`}</CodePre>

          <h3>AnimatePresence (page transitions)</h3>
          <CodePre>{`<AnimatePresence mode="wait" initial={false}>
  <motion.div key={view}
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.2 }}>
    {/* page */}
  </motion.div>
</AnimatePresence>`}</CodePre>

          <h3>Stagger (fleet pattern)</h3>
          <CodePre>{`const STAGGER = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
}

<motion.div variants={STAGGER.container} initial="hidden" animate="visible">
  {items.map(i => <motion.div key={i} variants={STAGGER.item}>{i}</motion.div>)}
</motion.div>`}</CodePre>

          <h3>Reduced motion</h3>
          <CodePre>{`const reduce = useReducedMotion()
const dur = reduce ? 0.001 : 0.4
const y = reduce ? 0 : 16`}</CodePre>

          <h3>The fleet's eases</h3>
          <CodePre>{`outCubic:   [0.215, 0.61, 0.355, 1]    // entrances, page transitions
outQuart:   [0.165, 0.84, 0.44, 1]     // count-up, easeOut feel
outBack:    [0.34,  1.56, 0.64, 1]     // overshoot — stagger items, brand mark
inOutCubic: [0.65,  0,    0.35, 1]     // round-trip, repeats`}</CodePre>

          <h3>Keyframes + times</h3>
          <CodePre>{`animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1, 0.4] }}
transition={{ duration: 2.2, times: [0, 0.55, 1] }}
// times maps each keyframe to a position on the duration timeline.`}</CodePre>

          <h3>Looping pulse</h3>
          <CodePre>{`animate={{ scale: [1, 1.03, 1] }}
transition={{ duration: 1.6, repeat: Infinity, repeatType: 'mirror' }}`}</CodePre>

          <h3>Layout animation (FLIP)</h3>
          <CodePre>{`<motion.div layout>
  {/* contents that change size */}
</motion.div>

// Shared element transition:
<motion.div layoutId="card-42">{thumbnail}</motion.div>
// ...elsewhere, one rendered at a time:
<motion.div layoutId="card-42">{expanded}</motion.div>`}</CodePre>

          <h3>Common transitions</h3>
          <table>
            <tbody>
              <tr><th>Feel</th><th>Transition</th></tr>
              <tr><td>Page enter</td><td><code>{`{ duration: 0.2, ease: outCubic }`}</code></td></tr>
              <tr><td>Card stagger</td><td><code>{`{ duration: 0.42, ease: outBack }`}</code></td></tr>
              <tr><td>Hover affordance</td><td><code>{`{ type: 'spring', stiffness: 400, damping: 25 }`}</code></td></tr>
              <tr><td>Drawer open</td><td><code>{`{ type: 'spring', stiffness: 300, damping: 30 }`}</code></td></tr>
              <tr><td>Subtle pulse</td><td><code>{`{ duration: 1.6, repeat: Infinity, repeatType: 'mirror' }`}</code></td></tr>
              <tr><td>Number ticker</td><td><code>{`{ duration: 1.0, ease: outQuart }`}</code></td></tr>
            </tbody>
          </table>

          <h3>Performance rules</h3>
          <ul>
            <li>Prefer <code>scale</code> over <code>width</code>/<code>height</code></li>
            <li>Prefer <code>x</code>/<code>y</code> over <code>top</code>/<code>left</code></li>
            <li>Don't wrap static elements in <code>motion.div</code></li>
            <li>Use <code>layout</code> sparingly — measures on every render</li>
            <li>200ms is the floor for page transitions in this fleet</li>
          </ul>

          <h3>The fleet flow</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  M[motion.X] --> AP[AnimatePresence]
  AP -->|exit| V[Variants]
  V -->|stagger| RM[useReducedMotion]
  RM --> SHIP[ship 60fps animations]
  style M fill:#5C2A4A,color:#fff
  style SHIP fill:#5C2A4A,color:#fff`} />

        </section>
      </main>
    </div>
  );
}
