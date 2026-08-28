import { useRef, useState } from 'react';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Emotion Under the Hood',           icon: '⚙️' },
  { id: 's3',  num: '3',  title: 'createTheme + ThemeProvider',      icon: '🎨' },
  { id: 's4',  num: '4',  title: 'The sx Prop',                      icon: '✨' },
  { id: 's5',  num: '5',  title: 'useC() — Theme-Aware Tokens',      icon: '🪝' },
  { id: 's6',  num: '6',  title: 'Box / Stack / Grid',               icon: '📐' },
  { id: 's7',  num: '7',  title: 'Card + CardActionArea',            icon: '🃏' },
  { id: 's8',  num: '8',  title: 'Icons + Lazy Imports',             icon: '🎯' },
  { id: 's9',  num: '9',  title: 'Dark Mode Implementation',         icon: '🌙' },
  { id: 's10', num: '10', title: 'When MUI Is Selective',            icon: '✂️' },
  { id: 's11', num: '★',  title: 'Lab: A Theme + Card',              icon: '🛠️' },
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

export default function MuiEmotionGuide() {
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
            <span className="sidebar-title">MUI 7 + Emotion</span>
          </div>
          <div className="sidebar-sub">3 fleet apps' UI engine</div>
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
          <div className="hero-tag">🎨 MUI 7 · Emotion 11 · 2026</div>
          <h1>MUI 7 + Emotion<br />(the fleet's "real" component library)</h1>
          <p>
            Three fleet apps use <strong style={{ color: '#C77AA0' }}>MUI 7</strong> as their primary UI library (Cairn,
            SecretApp/Hearth) or selectively (ShopKeep). This guide walks the architecture — Emotion underneath, the
            theme + ThemeProvider pattern, the <code>sx</code> prop, Hearth's canonical <code>useC()</code> hook for
            theme-aware tokens, the Box/Stack/Grid layout primitives, dark mode wiring, and the "selective MUI" pattern
            that mixes MUI's compound widgets with Tailwind everywhere else.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">3/8</span><span className="hero-stat-label">Apps use MUI</span></div>
            <div className="hero-stat"><span className="hero-stat-val">v7</span><span className="hero-stat-label">Current major</span></div>
            <div className="hero-stat"><span className="hero-stat-val">Emotion</span><span className="hero-stat-label">CSS-in-JS engine</span></div>
            <div className="hero-stat"><span className="hero-stat-val">useC()</span><span className="hero-stat-label">Canonical pattern</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            MUI (Material UI) is a comprehensive React component library implementing Google's Material Design — with
            theming, accessibility, and ~100 prebuilt components shipped out of the box. Where shadcn/ui is "lumber yard"
            (you assemble), MUI is "furnished apartment" (move in).
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The furnished apartment.</strong> Pick a building (MUI), it comes with kitchen + bath + appliances.
            You can repaint, swap furniture, change layouts (via theme + sx). But the bones (Material Design + Emotion
            runtime) are pre-built.
          </p>
          <p>
            <strong>The Tailwind contrast.</strong> Tailwind/shadcn ships utility classes; you compose UI from
            scratch. MUI ships components; you customize them via theme. The same Button takes either ~3 lines of
            Tailwind (compose) OR <code>{`<Button variant="contained">Save</Button>`}</code> (configure).
          </p>
          <p>
            <strong>Why fleet apps mix both.</strong> MUI shines for compound widgets — <code>DataGrid</code>,
            <code>DatePicker</code>, <code>Autocomplete</code>, <code>Drawer</code>. shadcn/Tailwind shines for custom
            aesthetics + zero runtime CSS-in-JS overhead. ShopKeep uses both: MUI for <code>Select</code> + <code>Dialog</code>,
            Tailwind for everything else.
          </p>

          <h3>What you get with MUI</h3>
          <ul>
            <li><strong>~100 components</strong>: Button, Card, Dialog, Drawer, Tabs, Snackbar, Tooltip, Accordion, Stepper, Table, DataGrid, DatePicker, etc.</li>
            <li><strong>Material Design theming</strong>: color palette, typography scale, spacing scale, shape system.</li>
            <li><strong>Built-in dark mode</strong>: toggle via theme.</li>
            <li><strong>Built-in accessibility</strong>: ARIA, keyboard nav, focus management.</li>
            <li><strong>The <code>sx</code> prop</strong>: inline styling with theme awareness — feels like a constrained CSS-in-JS DSL.</li>
            <li><strong>The <code>styled()</code> API</strong>: create reusable styled components with theme access.</li>
            <li><strong>Icons</strong>: <code>@mui/icons-material</code> ships ~2000 Material Design icons.</li>
          </ul>

          <h3>What MUI costs</h3>
          <ul>
            <li><strong>Bundle size</strong>: ~300-400KB gzipped for a typical MUI app. The icons package alone is huge unless tree-shaken.</li>
            <li><strong>CSS-in-JS runtime overhead</strong>: Emotion evaluates styles at render time. Sub-millisecond per component, but it adds up.</li>
            <li><strong>Theme provider is mandatory</strong>: every MUI component reads theme; you must wrap your app.</li>
            <li><strong>Aesthetic ceiling</strong>: it's Material Design. Customizing beyond palette + typography requires fighting the framework.</li>
            <li><strong>RSC compatibility is awkward</strong>: ThemeProvider must be Client; works in Next.js but adds boilerplate.</li>
          </ul>

          <h3>Why the fleet picked MUI</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Why MUI</th></tr>
              <tr><td>Hearth (SecretApp)</td><td>Warm artisan palette wraps Material well; needs ~10 compound widgets (Drawer, Dialog, Tooltip, Snackbar)</td></tr>
              <tr><td>Cairn</td><td>Forked from Hearth; inherited the choice</td></tr>
              <tr><td>ShopKeep</td><td>Selective use — Select / Dialog / icons only. Tailwind owns the rest</td></tr>
            </tbody>
          </table>

          <h3>Why other fleet apps DIDN'T</h3>
          <ul>
            <li><strong>PulseWire</strong>: needed a custom dark-glass aesthetic. shadcn + Radix + cva was the right shape.</li>
            <li><strong>Workshop, GLP1, Puzzlebox</strong>: Tailwind only; minimal compound widgets needed.</li>
            <li><strong>Tabloom</strong>: hand-written CSS with design tokens; rich editor doesn't fit either framework cleanly.</li>
          </ul>

          <h3>MUI versions across the fleet</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>@mui/material</th><th>@emotion/react</th></tr>
              <tr><td>SecretApp</td><td>7.3.4</td><td>11.14.0</td></tr>
              <tr><td>Cairn</td><td>7.3.4</td><td>11.14.0</td></tr>
              <tr><td>ShopKeep</td><td>7.3.9</td><td>11.14.0</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 2 — EMOTION */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Emotion Under the Hood</h2>
          <p>
            MUI doesn't write its own styling engine. It uses <strong>Emotion</strong> — a CSS-in-JS library — under
            the hood. Knowing this matters because (a) Emotion is your peer dependency, (b) its conventions affect MUI
            behavior, (c) when you reach for <code>styled()</code> or <code>css</code> templates, you're using
            Emotion's API.
          </p>

          <h3>Why CSS-in-JS for MUI</h3>
          <ul>
            <li><strong>Theme awareness</strong>: every Emotion-generated class can read the current theme at render time.</li>
            <li><strong>Scoped styles</strong>: no class-name collisions; Emotion generates unique hashes.</li>
            <li><strong>Dynamic styles</strong>: props affect rendered CSS without preprocessor build steps.</li>
            <li><strong>SSR-friendly</strong>: Emotion can extract critical CSS during server render.</li>
          </ul>

          <h3>What "CSS-in-JS at runtime" means</h3>
          <CodePre>{`// Each render, this object is evaluated:
<Box sx={{ p: 2, bgcolor: 'primary.main' }} />

// Emotion serializes it to a CSS string at render time:
.css-1ab2c3d {
  padding: 16px;
  background-color: #1976d2;
}

// Then injects that class into <head>:
<style>.css-1ab2c3d { padding: 16px; background-color: #1976d2; }</style>

// And applies it to the element:
<div class="css-1ab2c3d">...</div>`}</CodePre>

          <p>On every render, Emotion runs through this serialization. With memoization + caching, most renders hit the cache + just reuse the class name. Sub-millisecond per component in steady state.</p>

          <h3>Two Emotion packages you need</h3>
          <CodePre>{`// package.json
"@emotion/react":  "^11.14.0",   // The core: <ThemeProvider>, css template, useTheme
"@emotion/styled": "^11.14.1",   // The styled() API for creating reusable components`}</CodePre>

          <p>Both are MUI's peer dependencies; <code>@mui/material</code> won't install without them.</p>

          <h3>Three styling APIs available</h3>
          <CodePre>{`// 1. The sx prop (most common; MUI-specific syntactic sugar over Emotion)
<Box sx={{ p: 2, bgcolor: 'primary.main' }} />

// 2. The css template (Emotion's primitive)
import { css } from '@emotion/react'
const style = css\`
  padding: 16px;
  background: #1976d2;
\`
<div css={style} />

// 3. The styled() API (creates a reusable component)
import { styled } from '@mui/material/styles'
const RustButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#C77AA0' : '#5C2A4A',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#D08A5C' : '#7C3E1F',
  },
}))
<RustButton>Save</RustButton>`}</CodePre>

          <p>The fleet uses (1) for ~95% of cases. (3) appears occasionally for components that get reused dozens of times. (2) is rare — sx covers most use cases.</p>

          <h3>The SSR consideration</h3>
          <p>None of the fleet's MUI apps use SSR (they're SPAs). For Next.js + MUI, there's extra ceremony (CacheProvider with Emotion's SSR cache). PulseWire avoids it by NOT using MUI.</p>

          <h3>Browser CSS output vs Tailwind</h3>
          <ul>
            <li><strong>Tailwind</strong>: build-time CSS file shipped to browser. Browser reads it once.</li>
            <li><strong>MUI/Emotion</strong>: runtime CSS injected per-render. Same browser CSS engine, but the class names are generated on the fly.</li>
          </ul>

          <p>The runtime overhead is real but invisible. The trade-off: MUI is more dynamic; Tailwind is more static. Tailwind compiles → ship static CSS; MUI computes → ship code that generates CSS.</p>
        </section>

        <hr />

        {/* SECTION 3 — THEME */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span><code>createTheme</code> + ThemeProvider</h2>
          <p>The bootstrap of any MUI app. <code>createTheme</code> defines your design tokens; <code>ThemeProvider</code> makes them available to all child components.</p>

          <h3>Hearth's theme builder</h3>
          <CodePre>{`// SecretApp/src/context/ThemeContext.tsx — verbatim (relevant portion)
function buildTheme(mode: Mode) {
  const isDark = mode === 'dark'
  const t = isDark ? DARK : LIGHT

  return createTheme({
    palette: {
      mode,
      primary: {
        main:         t.rust,
        light:        t.rustLight,
        dark:         t.rustDark,
        contrastText: isDark ? '#1C1008' : '#FFFFFF',
      },
      background: {
        default: t.bg,
        paper:   t.paper,
      },
      text: {
        primary:   t.ink,
        secondary: t.muted,
      },
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    },
  })
}`}</CodePre>

          <h3>The theme shape</h3>
          <p>MUI's theme is a deep JS object with predefined slots. The main ones:</p>
          <CodePre>{`createTheme({
  palette: {
    mode: 'light' | 'dark',                    // base mode
    primary:   { main, light, dark, contrastText },
    secondary: { main, light, dark, contrastText },
    error:     { main, light, dark },
    warning:   { main, light, dark },
    info:      { main, light, dark },
    success:   { main, light, dark },
    text:      { primary, secondary, disabled },
    background: { default, paper },
    divider:   '#...',
    action:    { active, hover, selected, disabled, ... },
  },
  typography: {
    fontFamily, fontSize, fontWeightLight, fontWeightRegular, fontWeightBold,
    h1: { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing },
    h2: { ... }, h3: { ... }, body1: { ... }, button: { ... },
    // ... etc
  },
  spacing: 8,                                  // base spacing unit (default 8)
  shape: { borderRadius: 2 },                  // default border radius
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
  components: {
    MuiButton: {                                // override Button defaults
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 600,
        }),
      },
    },
  },
  zIndex: { ... },
  transitions: { ... },
})`}</CodePre>

          <h3>The ThemeProvider wire-up</h3>
          <CodePre>{`// SecretApp/src/context/ThemeContext.tsx — verbatim (provider)
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved === 'light' || saved === 'dark') ? saved : 'light'
  })

  const toggleMode = () =>
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })

  const theme = useMemo(() => buildTheme(mode), [mode])
  const ctxValue = useMemo(() => ({ mode, toggleMode }), [mode])

  return (
    <ThemeModeContext.Provider value={ctxValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}`}</CodePre>

          <p>Three pieces:</p>
          <ol>
            <li><strong>Hearth's own context</strong> (<code>ThemeModeContext</code>): exposes <code>mode</code> + <code>toggleMode</code> to UI components.</li>
            <li><strong>MUI's <code>ThemeProvider</code></strong>: makes the theme object available to MUI components via the <code>useTheme()</code> hook.</li>
            <li><strong><code>CssBaseline</code></strong>: MUI's CSS reset. Normalizes browser defaults so MUI components look the same everywhere.</li>
          </ol>

          <h3>Why CssBaseline matters</h3>
          <p><code>CssBaseline</code> applies Material Design's CSS reset: sensible defaults for body color/background, smooth scrolling, fixed-width fonts in <code>code</code>/<code>pre</code>. Without it, browser defaults bleed through and MUI components look mismatched.</p>

          <h3>Wrapping in App.tsx</h3>
          <CodePre>{`// SecretApp/src/main.tsx (pattern)
import { ThemeModeProvider } from './context/ThemeContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <App />
    </ThemeModeProvider>
  </React.StrictMode>
)`}</CodePre>

          <p>The provider sits as high as possible — everything below it has theme access.</p>

          <h3>Using the theme — useTheme hook</h3>
          <CodePre>{`import { useTheme } from '@mui/material/styles'

function MyComponent() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  // theme.palette.primary.main, theme.spacing(2), theme.breakpoints.up('md'), etc.
}`}</CodePre>

          <p>The hook returns the current theme object. Read whatever you need.</p>
        </section>

        <hr />

        {/* SECTION 4 — SX PROP */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The <code>sx</code> Prop</h2>
          <p>MUI's superpower — and where you spend 95% of your styling time. <code>sx</code> is a JSX prop that accepts an object (or a function returning an object) of CSS properties + MUI-specific shortcuts.</p>

          <h3>The basics</h3>
          <CodePre>{`<Box sx={{
  p: 2,                                 // padding: 16px (8 * 2)
  m: 1,                                 // margin: 8px
  bgcolor: 'primary.main',              // background-color: theme.palette.primary.main
  color: 'text.secondary',              // color: theme.palette.text.secondary
  borderRadius: 2,                      // border-radius: 8px (4 * 2)
  fontSize: '1rem',                     // direct CSS
  fontFamily: 'monospace',              // direct CSS
  '&:hover': {
    bgcolor: 'primary.light',
  },
}}>
  Hello
</Box>`}</CodePre>

          <h3>The shortcuts</h3>
          <table>
            <tbody>
              <tr><th>sx shortcut</th><th>CSS equivalent</th></tr>
              <tr><td><code>p, pt, pr, pb, pl, px, py</code></td><td>padding (multiples of theme.spacing)</td></tr>
              <tr><td><code>m, mt, mr, mb, ml, mx, my</code></td><td>margin (multiples of theme.spacing)</td></tr>
              <tr><td><code>bgcolor</code></td><td>background-color</td></tr>
              <tr><td><code>color</code></td><td>color (with theme paths)</td></tr>
              <tr><td><code>borderRadius</code></td><td>border-radius (multiples of theme.shape.borderRadius)</td></tr>
              <tr><td><code>boxShadow</code></td><td>box-shadow (also accepts theme.shadows[N])</td></tr>
              <tr><td><code>display, flex, gap</code></td><td>direct CSS</td></tr>
            </tbody>
          </table>

          <h3>The theme-path syntax</h3>
          <CodePre>{`color: 'primary.main'           // theme.palette.primary.main
color: 'text.secondary'         // theme.palette.text.secondary
color: 'rust'                   // ❌ NOT a built-in palette key (you'd need to extend)
bgcolor: 'background.paper'     // theme.palette.background.paper
boxShadow: 4                    // theme.shadows[4] (one of MUI's predefined elevations)
fontSize: 'body1.fontSize'      // theme.typography.body1.fontSize`}</CodePre>

          <p>Dotted paths are auto-resolved against the theme. If the path doesn't match a theme key, MUI treats the value as a literal CSS string.</p>

          <h3>The function form — theme-aware</h3>
          <CodePre>{`<Box sx={(theme) => ({
  bgcolor:    theme.palette.mode === 'dark' ? '#C77AA0' : '#5C2A4A',
  color:      theme.palette.text.primary,
  border:     \`1px solid \${theme.palette.divider}\`,
  '&:hover':  { transform: 'translateY(-2px)' },
  [theme.breakpoints.up('md')]: {
    padding: 4,
  },
})}>
  Theme-aware
</Box>`}</CodePre>

          <p>The function form gives full theme access. Use when:</p>
          <ul>
            <li>You need dark-mode-conditional values (<code>theme.palette.mode === 'dark' ? X : Y</code>).</li>
            <li>You need breakpoint queries.</li>
            <li>You're composing complex values from theme tokens.</li>
          </ul>

          <h3>Responsive shortcuts</h3>
          <CodePre>{`<Box sx={{
  p: { xs: 1, sm: 2, md: 3, lg: 4 },    // responsive padding
  display: { xs: 'block', md: 'flex' },  // responsive display
  fontSize: { xs: '0.875rem', md: '1rem' },
}}>
  Responsive
</Box>`}</CodePre>

          <p>An object keyed by breakpoint name. MUI generates the right media queries.</p>

          <h3>Array shortcuts (alternative responsive)</h3>
          <CodePre>{`<Box sx={{ p: [1, 2, 3, 4] }}>  // [xs, sm, md, lg]
  Responsive via array
</Box>`}</CodePre>

          <p>Same outcome, shorter syntax. The fleet uses the object form for clarity (you can see "sm" vs reading positional).</p>

          <h3>Nested selectors</h3>
          <CodePre>{`<Box sx={{
  '&:hover':        { bgcolor: 'rust' },
  '&:focus':        { outline: '2px solid' },
  '&[data-active="true"]': { fontWeight: 700 },
  '& .child-class': { color: 'red' },
  '@media (max-width: 600px)': { display: 'none' },
}}>
  Nested
</Box>`}</CodePre>

          <p>Any valid CSS selector works. <code>&</code> refers to the current element. Descendant selectors target children.</p>

          <h3>When NOT to use sx</h3>
          <ul>
            <li><strong>Component is used 50+ times</strong> — switch to <code>styled()</code> for performance (the styled component caches its CSS).</li>
            <li><strong>You're sharing styles across many components</strong> — extract to <code>styled()</code> or a constants module.</li>
            <li><strong>You want to inspect styles in DevTools by name</strong> — sx generates random class names; styled() preserves the component name.</li>
          </ul>

          <p>For one-off use, sx is the right call. For repeated patterns, styled() wins.</p>
        </section>

        <hr />

        {/* SECTION 5 — USEC */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span><code>useC()</code> — Theme-Aware Tokens</h2>
          <p>Hearth's canonical pattern for "I need a bunch of theme-aware colors in a component." Encapsulates the dark/light switch into one hook that returns an object of resolved color values.</p>

          <h3>The full useC() pattern</h3>
          <CodePre>{`// SecretApp/src/PlexCommandCenter.tsx — verbatim (lines 35-65)
function useC() {
  const theme = useTheme()
  const d = theme.palette.mode === 'dark'
  return {
    bg:      d ? '#1C1008' : '#F5F0EA',
    surface: d ? '#261608' : '#EFE8DF',
    paper:   d ? '#2F1C0C' : '#FFFFFF',
    border:  d ? '#4A3020' : '#EDE8E3',
    ink:     d ? '#F5F0EA' : '#1C0F07',
    muted:   d ? '#B89B82' : '#8B7A6B',
    rust:    d ? '#C77AA0' : '#5C2A4A',
    rustBg:  d ? 'rgba(199,122,160,0.18)' : 'rgba(92,42,74,0.10)',
    green:   d ? '#7CAE6A' : '#4F7A3E',
    red:     d ? '#D47A6A' : '#B05945',
    blue:    d ? '#7AA8C4' : '#4A7A9B',
    amber:   d ? '#C4A040' : '#9A7A20',
    purple:  d ? '#9E86C8' : '#6B5A9A',
  }
}`}</CodePre>

          <h3>How it's used</h3>
          <CodePre>{`function PlexCommandCenter() {
  const C = useC()

  return (
    <Box sx={{ bgcolor: C.bg, color: C.ink, p: 3 }}>
      <Card sx={{ bgcolor: C.paper, border: \`1px solid \${C.border}\` }}>
        <Typography sx={{ color: C.muted }}>Subtitle</Typography>
        <Button sx={{ bgcolor: C.rust, color: '#FFF' }}>Action</Button>
      </Card>
    </Box>
  )
}`}</CodePre>

          <h3>Why this pattern wins</h3>
          <ol>
            <li><strong>One read of the theme per component</strong>: <code>useC()</code> calls <code>useTheme()</code> once; you reference <code>C.rust</code> N times. Faster than N calls into <code>theme.palette.X</code>.</li>
            <li><strong>Centralized palette</strong>: every Plex component imports the same hook + sees the same colors. Renaming a token = one edit.</li>
            <li><strong>Dark/light handled in one place</strong>: the ternary in <code>useC()</code> is the only conditional. Consumers just use <code>C.X</code>.</li>
            <li><strong>Type-safe</strong>: TS infers the return type; misspellings caught at compile time.</li>
            <li><strong>Easy to extend</strong>: add a new color → add one ternary → all consumers see it.</li>
          </ol>

          <h3>The alternative — direct theme access</h3>
          <CodePre>{`function Card() {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{
      bgcolor: isDark ? '#2F1C0C' : '#FFFFFF',
      color:   isDark ? '#F5F0EA' : '#1C0F07',
      border:  \`1px solid \${isDark ? '#4A3020' : '#EDE8E3'}\`,
    }}>
      ...
    </Box>
  )
}`}</CodePre>

          <p>Same outcome, but: every component has to know the hex codes. Renaming "border color" requires touching every component. The <code>useC()</code> pattern abstracts that.</p>

          <h3>Per-component vs global useC()</h3>
          <p>Hearth's <code>useC()</code> is defined PER-COMPONENT (each major view has its own). Reasons:</p>
          <ul>
            <li>Different views have different palette needs (PlexCommandCenter uses cool blues; RecipeManager uses warm corals).</li>
            <li>Co-located with the component that uses it — searchable, maintainable.</li>
            <li>If you wanted a truly shared palette, just import from a shared module.</li>
          </ul>

          <p>The pattern is the hook shape, not necessarily where it lives.</p>

          <h3>When to use this vs sx-function</h3>
          <table>
            <tbody>
              <tr><th>Use useC()</th><th>Use sx function</th></tr>
              <tr><td>5+ theme-aware values in one component</td><td>1-2 theme-aware values</td></tr>
              <tr><td>Same palette across multiple components</td><td>One-off styling</td></tr>
              <tr><td>Want to refactor palette as a unit</td><td>Just need to access a single token</td></tr>
            </tbody>
          </table>

          <h3>Extending to typography / spacing</h3>
          <CodePre>{`function useT() {
  const theme = useTheme()
  return {
    heading: { fontFamily: theme.typography.h1.fontFamily, fontWeight: 700 },
    body:    { fontFamily: theme.typography.body1.fontFamily, lineHeight: 1.6 },
    small:   { fontSize: '0.875rem', color: theme.palette.text.secondary },
  }
}

// Use:
<Typography sx={useT().heading}>Title</Typography>`}</CodePre>

          <p>Same pattern, applied to non-color tokens. Hearth's actual codebase uses this sparingly; <code>useC()</code> for colors covers most cases.</p>
        </section>

        <hr />

        {/* SECTION 6 — LAYOUT */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Box / Stack / Grid</h2>
          <p>MUI ships three layout primitives. <code>Box</code> is the workhorse; <code>Stack</code> is flexbox shortcuts; <code>Grid</code> is responsive 12-column grid (or arbitrary).</p>

          <h3>Box — the workhorse</h3>
          <CodePre>{`<Box sx={{ p: 2, display: 'flex', gap: 2 }}>
  <Box>Item 1</Box>
  <Box sx={{ flexGrow: 1 }}>Item 2 (expands)</Box>
  <Box>Item 3</Box>
</Box>`}</CodePre>

          <p><code>Box</code> renders a <code>{`<div>`}</code> with sx support. Use it anywhere you'd use a div + styling. ~80% of layout code in MUI apps is Boxes.</p>

          <h3>Stack — flexbox shortcuts</h3>
          <CodePre>{`<Stack direction="row" spacing={2} alignItems="center">
  <Avatar src="..." />
  <Typography>Username</Typography>
  <Button>Follow</Button>
</Stack>

<Stack direction="column" spacing={1}>
  <Typography variant="h2">Title</Typography>
  <Typography variant="body1">Body</Typography>
</Stack>`}</CodePre>

          <p>Stack is "Box but for flex layouts." Saves typing:</p>
          <table>
            <tbody>
              <tr><th>Stack prop</th><th>Equivalent sx</th></tr>
              <tr><td><code>direction="row"</code></td><td><code>display: 'flex', flexDirection: 'row'</code></td></tr>
              <tr><td><code>direction="column"</code></td><td><code>display: 'flex', flexDirection: 'column'</code></td></tr>
              <tr><td><code>spacing={2}</code></td><td><code>gap: 16px</code></td></tr>
              <tr><td><code>alignItems="center"</code></td><td><code>alignItems: 'center'</code></td></tr>
              <tr><td><code>justifyContent="space-between"</code></td><td><code>justifyContent: 'space-between'</code></td></tr>
            </tbody>
          </table>

          <h3>Responsive Stack</h3>
          <CodePre>{`<Stack
  direction={{ xs: 'column', md: 'row' }}    // stack vertically on mobile, horizontally on desktop
  spacing={{ xs: 1, md: 3 }}
>
  ...
</Stack>`}</CodePre>

          <p>One of the most common MUI patterns. The responsive direction switch handles ~90% of "mobile vs desktop layout."</p>

          <h3>Grid — for true grid layouts</h3>
          <CodePre>{`import { Grid } from '@mui/material'

<Grid container spacing={2}>
  <Grid xs={12} md={6}>      {/* full width on mobile, half on md+ */}
    <Card>Left half</Card>
  </Grid>
  <Grid xs={12} md={6}>
    <Card>Right half</Card>
  </Grid>
</Grid>

<Grid container spacing={3}>
  {recipes.map(r => (
    <Grid key={r.id} xs={12} sm={6} md={4} lg={3}>
      <RecipeCard recipe={r} />
    </Grid>
  ))}
</Grid>`}</CodePre>

          <p><code>Grid</code> is MUI's 12-column responsive grid. <code>container</code> wraps children. Each child is a <code>Grid</code> with breakpoint-keyed column counts.</p>

          <h3>Cairn's card grid example</h3>
          <CodePre>{`// Cairn/src/App.tsx pattern
<Box sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
  gap: 2.5,
}}>
  {EXAMS.map(exam => (
    <Card key={exam.id} sx={{ ... }}>
      ...
    </Card>
  ))}
</Box>`}</CodePre>

          <p>Notice: Cairn uses <code>Box</code> with CSS Grid (<code>gridTemplateColumns</code>) instead of <code>Grid</code>. Why:</p>
          <ul>
            <li>CSS Grid is more powerful than MUI's <code>Grid</code> component.</li>
            <li>No 12-column constraint.</li>
            <li>Slightly less code.</li>
          </ul>

          <p>Both patterns are valid. Fleet picks Box + CSS Grid for new code; uses <code>Grid</code> when migrating older code.</p>

          <h3>Container — page-level width</h3>
          <CodePre>{`<Container maxWidth="md">       {/* xs, sm, md, lg, xl, false */}
  <Typography variant="h1">Page Title</Typography>
  ...
</Container>`}</CodePre>

          <p>Centered, max-width-constrained wrapper. Hearth uses this for documentation-style pages; not for dense dashboards.</p>

          <h3>Spacing scale reference</h3>
          <table>
            <tbody>
              <tr><th>theme.spacing(N)</th><th>Pixel value (default)</th></tr>
              <tr><td>0.5</td><td>4px</td></tr>
              <tr><td>1</td><td>8px</td></tr>
              <tr><td>2</td><td>16px</td></tr>
              <tr><td>3</td><td>24px</td></tr>
              <tr><td>4</td><td>32px</td></tr>
              <tr><td>6</td><td>48px</td></tr>
              <tr><td>8</td><td>64px</td></tr>
            </tbody>
          </table>

          <p><code>{`<Box sx={{ p: 2 }}>`}</code> = <code>padding: 16px</code> = <code>theme.spacing(2)</code>. The unit is intentional — 8 is the Material Design base.</p>
        </section>

        <hr />

        {/* SECTION 7 — CARD */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Card + CardActionArea</h2>
          <p>The Knowledge Base index uses this pattern for the guide cards. <code>CardActionArea</code> wraps the card's content with a click handler + Material's ripple effect; the surrounding <code>Card</code> provides surface + elevation.</p>

          <h3>Hearth's KB card pattern</h3>
          <CodePre>{`// SecretApp/src/KnowledgeBase/index.tsx — pattern
<Card
  key={g.id}
  sx={{
    backgroundColor: CARD_BG,
    border: \`1px solid \${BORDER}\`,
    borderRadius: 2,
    boxShadow: 'none',
    transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
    '&:hover': {
      borderColor: accent,
      transform: 'translateY(-2px)',
      boxShadow: isDark
        ? '0 8px 24px rgba(0,0,0,0.4)'
        : '0 8px 24px rgba(160, 82, 45, 0.12)',
    },
  }}
>
  <CardActionArea
    onClick={() => setActive(g.id)}
    sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
  >
    <Box sx={{
      width: 56, height: 56, borderRadius: 2,
      backgroundColor: isDark ? \`\${accent}22\` : \`\${accent}14\`,
      color: accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      mb: 2,
    }}>
      {g.icon}
    </Box>
    <Typography sx={{
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      fontSize: '1.15rem',
      mb: 0.75,
    }}>
      {g.title}
    </Typography>
    <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem' }}>
      {g.blurb}
    </Typography>
  </CardActionArea>
</Card>`}</CodePre>

          <h3>The Card / CardActionArea pair</h3>
          <table>
            <tbody>
              <tr><th>Component</th><th>Role</th></tr>
              <tr><td><code>Card</code></td><td>The surface — background, border, shadow, hover styles. Static (no click handler).</td></tr>
              <tr><td><code>CardActionArea</code></td><td>The clickable area inside. Adds Material's ripple effect on click + accessible button behavior.</td></tr>
            </tbody>
          </table>

          <p>If you put <code>onClick</code> on <code>Card</code> directly, you don't get the ripple + you don't get a proper button role for accessibility. <code>CardActionArea</code> handles both.</p>

          <h3>The accent-color trick</h3>
          <CodePre>{`backgroundColor: isDark ? \`\${accent}22\` : \`\${accent}14\`,`}</CodePre>

          <p>The pattern: a hex color + two hex digits at the end = the color with that opacity. <code>22</code> = ~13% alpha, <code>14</code> = ~8% alpha. Lets you tint the icon background with a faded version of the accent without using <code>rgba()</code>.</p>

          <h3>The transform-on-hover lift</h3>
          <CodePre>{`'&:hover': {
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 24px rgba(160, 82, 45, 0.12)',
},`}</CodePre>

          <p>The card lifts 2px on hover + gains a shadow. Subtle, premium-feeling. Used throughout Hearth + Cairn.</p>

          <h3>Other useful MUI compound widgets</h3>
          <table>
            <tbody>
              <tr><th>Component</th><th>Use</th></tr>
              <tr><td><code>Dialog</code></td><td>Modal overlay; built-in focus trap, ARIA, escape-to-close</td></tr>
              <tr><td><code>Drawer</code></td><td>Side panel (nav, settings); supports temporary/persistent/permanent</td></tr>
              <tr><td><code>Menu</code></td><td>Dropdown menu (right-click contexts, action menus)</td></tr>
              <tr><td><code>Snackbar</code></td><td>Toast notifications</td></tr>
              <tr><td><code>Tooltip</code></td><td>Hover info popup</td></tr>
              <tr><td><code>Tabs</code></td><td>Tabbed navigation</td></tr>
              <tr><td><code>Accordion</code></td><td>Collapsible sections</td></tr>
              <tr><td><code>Autocomplete</code></td><td>Combo box with async loading</td></tr>
              <tr><td><code>DatePicker</code></td><td>Calendar input (via <code>@mui/x-date-pickers</code>)</td></tr>
              <tr><td><code>DataGrid</code></td><td>Sortable, filterable table (via <code>@mui/x-data-grid</code>)</td></tr>
            </tbody>
          </table>

          <p>Fleet apps use these selectively. None ship with DataGrid (too heavy for current needs); a few use DatePicker. Most use Dialog + Snackbar + Tooltip.</p>
        </section>

        <hr />

        {/* SECTION 8 — ICONS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Icons + Lazy Imports</h2>
          <p><code>@mui/icons-material</code> ships ~2000 Material Design icons. Each is its own React component. Tree-shaking is critical — otherwise you'd ship megabytes.</p>

          <h3>The import pattern</h3>
          <CodePre>{`// ✅ Good — tree-shakable named imports
import {
  Home as HomeIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

// 🚫 Bad — pulls EVERY icon into your bundle
import * as Icons from '@mui/icons-material'
<Icons.Home />`}</CodePre>

          <h3>Hearth's icon imports</h3>
          <CodePre>{`// SecretApp/src/App.tsx — verbatim
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Movie as MovieIcon,
  TableChart as ConverterIcon,
  HomeRepairService as MaintenanceIcon,
  Inventory2 as InventoryIcon,
  Yard as YardIcon,
  MenuBook as RecipeIcon,
  Psychology as AITestIcon,
  LibraryBooks as KnowledgeBaseIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  School as ExamPrepIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'`}</CodePre>

          <p>Named imports — each icon is a separate ES module. Vite tree-shakes unused ones out at build time.</p>

          <h3>Usage</h3>
          <CodePre>{`<HomeIcon fontSize="small" />
<SettingsIcon fontSize="medium" />
<PersonIcon fontSize="large" />
<HomeIcon sx={{ fontSize: 32, color: 'primary.main' }} />`}</CodePre>

          <p>Icons are SVG components. They accept <code>fontSize</code> (preset sizes) + <code>sx</code> (anything else).</p>

          <h3>Custom sizes</h3>
          <CodePre>{`<HomeIcon sx={{ fontSize: 64 }} />       // raw pixels
<HomeIcon sx={{ fontSize: '2rem' }} />   // relative units`}</CodePre>

          <h3>Coloring icons</h3>
          <CodePre>{`<HomeIcon color="primary" />                    // theme.palette.primary.main
<HomeIcon color="action" />                     // theme.palette.action.active
<HomeIcon sx={{ color: 'rust.500' }} />         // custom palette key
<HomeIcon sx={{ color: '#5C2A4A' }} />          // literal`}</CodePre>

          <h3>Why MUI icons specifically</h3>
          <ul>
            <li><strong>Quality</strong>: Material Design icons are well-designed + comprehensive.</li>
            <li><strong>Consistency</strong>: 24x24 grid; same visual language across all icons.</li>
            <li><strong>Free + open source</strong>.</li>
            <li><strong>Drop-in replacement</strong> for Material Icons CSS font (same names).</li>
          </ul>

          <h3>Alternatives</h3>
          <table>
            <tbody>
              <tr><th>Library</th><th>Style</th><th>Used by</th></tr>
              <tr><td>@mui/icons-material</td><td>Material Design</td><td>Hearth, Cairn, ShopKeep (mixed)</td></tr>
              <tr><td>lucide-react</td><td>Lightweight, geometric</td><td>ShopKeep, Workshop, PulseWire, Tabloom, GLP1</td></tr>
              <tr><td>react-icons</td><td>Aggregator (FontAwesome, Bootstrap, etc.)</td><td>Not in fleet</td></tr>
              <tr><td>@radix-ui/react-icons</td><td>Geometric, paired with shadcn</td><td>Not in fleet</td></tr>
              <tr><td>Heroicons</td><td>Hand-crafted, Tailwind-team-made</td><td>Not in fleet</td></tr>
            </tbody>
          </table>

          <p>For MUI apps, <code>@mui/icons-material</code> matches the aesthetic. For Tailwind/shadcn apps, <code>lucide-react</code> is the standard pick (smaller bundle, more modern look).</p>

          <h3>The bundle-size watch</h3>
          <p>A handful of icons → ~5KB total (gzipped). Importing the entire library accidentally → ~3MB. Always use named imports.</p>

          <CodePre>{`// Check what's in your bundle
npx vite-bundle-visualizer
# Look at the @mui/icons-material chunk. Should be tiny.`}</CodePre>
        </section>

        <hr />

        {/* SECTION 9 — DARK MODE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Dark Mode Implementation</h2>
          <p>MUI supports dark mode via <code>palette.mode</code>. The pattern: state somewhere, rebuild the theme when it changes, persist preference in localStorage.</p>

          <h3>Hearth's full dark mode setup</h3>
          <CodePre>{`// SecretApp/src/context/ThemeContext.tsx — verbatim relevant block
type Mode = 'light' | 'dark'
const STORAGE_KEY = 'hearth.theme.mode'

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved === 'light' || saved === 'dark') ? saved : 'light'
  })

  const toggleMode = () =>
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })

  const theme = useMemo(() => buildTheme(mode), [mode])
  const ctxValue = useMemo(() => ({ mode, toggleMode }), [mode])

  return (
    <ThemeModeContext.Provider value={ctxValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}`}</CodePre>

          <h3>The toggle UI</h3>
          <CodePre>{`import { useThemeMode } from './context/ThemeContext'
import { DarkMode, LightMode } from '@mui/icons-material'

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()
  return (
    <IconButton onClick={toggleMode} aria-label="Toggle theme">
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  )
}`}</CodePre>

          <h3>The four pieces</h3>
          <ol>
            <li><strong>State</strong>: <code>useState&lt;Mode&gt;</code> with initial value from localStorage.</li>
            <li><strong>Toggle function</strong>: flips mode + persists to localStorage.</li>
            <li><strong>Theme rebuild</strong>: <code>useMemo</code> re-creates the MUI theme when mode changes.</li>
            <li><strong>Context</strong>: exposes mode + toggle to descendants.</li>
          </ol>

          <h3>System preference detection</h3>
          <CodePre>{`// Inside ThemeModeProvider — also respect prefers-color-scheme
const [mode, setMode] = useState<Mode>(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  // Fall back to OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
})`}</CodePre>

          <p>Listen for OS preference changes:</p>
          <CodePre>{`useEffect(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e: MediaQueryListEvent) => {
    // Only react if user hasn't set their own preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      setMode(e.matches ? 'dark' : 'light')
    }
  }
  mq.addEventListener('change', handler)
  return () => mq.removeEventListener('change', handler)
}, [])`}</CodePre>

          <h3>The hidden cost of dark mode in MUI</h3>
          <p>Every component re-renders when mode changes — because the theme object's identity changed. With <code>useMemo</code> on the theme, this is one re-render per mode toggle, not per render. Acceptable.</p>

          <h3>SSR + dark mode</h3>
          <p>For Next.js apps that SSR: there's a flash of light mode before the client-side JS reads localStorage. Solutions:</p>
          <ol>
            <li><strong>Inject a script in <code>&lt;head&gt;</code></strong> that reads localStorage + sets a class on <code>&lt;html&gt;</code> before React hydrates.</li>
            <li><strong>Use <code>next-themes</code></strong> (the shadcn pattern from §9 of the shadcn guide).</li>
            <li><strong>Accept the flash</strong>: 200ms of light mode isn't a deal-breaker for personal apps.</li>
          </ol>

          <p>Hearth + Cairn are SPAs (no SSR); the flash doesn't apply.</p>
        </section>

        <hr />

        {/* SECTION 10 — SELECTIVE */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>When MUI Is Selective (ShopKeep's Pattern)</h2>
          <p>ShopKeep uses BOTH MUI and Tailwind. The pattern: MUI for components that benefit from the prebuilt complexity (Select, Dialog, icons); Tailwind for everything else.</p>

          <h3>The decision matrix</h3>
          <table>
            <tbody>
              <tr><th>Need</th><th>Pick</th></tr>
              <tr><td>A clickable button with custom styling</td><td>Tailwind (raw <code>{`<button>`}</code> + classes)</td></tr>
              <tr><td>A dropdown that needs keyboard nav + ARIA + portal</td><td>MUI <code>{`<Select>`}</code></td></tr>
              <tr><td>A modal with focus trap + escape-to-close</td><td>MUI <code>{`<Dialog>`}</code></td></tr>
              <tr><td>A spinner / loader</td><td>Tailwind (CSS animation) or MUI <code>{`<CircularProgress>`}</code> — pick by aesthetic</td></tr>
              <tr><td>A toast notification</td><td>MUI <code>{`<Snackbar>`}</code> or a Tailwind library like sonner</td></tr>
              <tr><td>An icon</td><td>lucide-react (Tailwind apps) or MUI icons (MUI apps)</td></tr>
              <tr><td>A complex compound widget (DataGrid, DatePicker)</td><td>MUI (rolling these yourself is weeks)</td></tr>
              <tr><td>Page layout — header, sidebar, grid</td><td>Tailwind utilities (or Box + sx if you're already MUI-heavy)</td></tr>
            </tbody>
          </table>

          <h3>The avoidance pattern</h3>
          <p>ShopKeep imports MUI's <code>Select</code> and <code>Dialog</code> at the top of files that need them, but the rest of the file is Tailwind:</p>
          <CodePre>{`// ShopKeep/src/pages/ToolForm.tsx (pattern)
import { Select, MenuItem, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Trash } from 'lucide-react'        // Tailwind-style icon

function ToolForm({ tool, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Tool</DialogTitle>
      <DialogContent>
        <div className="grid gap-4 mt-4">
          <input className="rounded border border-line px-3 py-2" placeholder="Name" />
          <Select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
          <button className="bg-rust text-cream px-4 py-2 rounded">
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}`}</CodePre>

          <p>Dialog provides the modal mechanics; Select provides the dropdown's keyboard behavior. Everything else is hand-rolled with Tailwind classes.</p>

          <h3>Why the mix works</h3>
          <ul>
            <li><strong>You only pay for what you use</strong>: importing 5 MUI components ships those 5 + their dependencies, not the whole library.</li>
            <li><strong>You skip MUI's aesthetic where it doesn't fit</strong>: warm-artisan styling is hard with MUI's Material Design defaults.</li>
            <li><strong>You get MUI's complexity-for-free where it matters</strong>: Dialog's focus management, Select's keyboard nav.</li>
            <li><strong>Maintenance is split</strong>: MUI upgrades affect the few components; Tailwind upgrades affect the rest.</li>
          </ul>

          <h3>The bundle implications</h3>
          <p>ShopKeep ships:</p>
          <ul>
            <li>~150KB MUI (just the components imported)</li>
            <li>~20KB Tailwind CSS</li>
            <li>~10KB lucide-react icons</li>
            <li>~30KB Emotion runtime (because MUI is there)</li>
          </ul>
          <p>Total: ~210KB UI overhead. Comparable to PulseWire's all-Tailwind/shadcn (~170KB) or Hearth's all-MUI (~250KB). The mix doesn't double-cost.</p>

          <h3>The styling boundary</h3>
          <p>Don't mix sx and Tailwind on the SAME component. Pick one per element:</p>
          <CodePre>{`// ✅ Good — sx on MUI components, Tailwind on plain elements
<Dialog open>
  <DialogTitle sx={{ p: 3 }}>Title</DialogTitle>
  <DialogContent>
    <div className="grid gap-4">                    {/* Tailwind on a div */}
      <input className="border px-2 py-1" />        {/* Tailwind on plain input */}
    </div>
  </DialogContent>
</Dialog>

// 🚫 Bad — mixing on the same element
<Box sx={{ p: 2 }} className="bg-rust">          {/* Confusing — pick one */}
  ...
</Box>`}</CodePre>

          <h3>When the mix DOESN'T work</h3>
          <ul>
            <li><strong>Heavy theming needs</strong>: maintaining both MUI's theme AND Tailwind's @theme is two sources of truth.</li>
            <li><strong>Lots of styled MUI components</strong>: at some point you're fighting MUI's defaults more than using them.</li>
            <li><strong>RSC-heavy Next.js</strong>: MUI's ThemeProvider must be Client; if you want server components everywhere, MUI gets in the way.</li>
          </ul>

          <p>If you find yourself fighting MUI to look right, switch to all-Tailwind/shadcn. If you find Tailwind missing too many compound widgets, switch to all-MUI. The mix is for the middle ground.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — A Theme + Card</h2>
          <p>Stand up a Vite + React + MUI 7 app with a custom warm-artisan theme, a dark mode toggle, and a card grid using the useC() pattern. ~30 minutes.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`npm create vite@latest mui-lab -- --template react-ts
cd mui-lab
npm i
npm i @mui/material @mui/icons-material @emotion/react @emotion/styled`}</CodePre>

          <h3>Step 2 — Theme</h3>
          <CodePre>{`// src/theme.ts
import { createTheme } from '@mui/material/styles'

const LIGHT = {
  bg: '#F5F0EA', paper: '#FFFFFF', ink: '#1C0F07', muted: '#8B7A6B',
  rust: '#5C2A4A', rustDark: '#7C3E1F', rustLight: '#C77AA0',
  line: '#EDE8E3',
}
const DARK = {
  bg: '#1C1008', paper: '#2F1C0C', ink: '#F5F0EA', muted: '#B89B82',
  rust: '#C77AA0', rustDark: '#5C2A4A', rustLight: '#D08A5C',
  line: '#4A3020',
}

export function buildTheme(mode: 'light' | 'dark') {
  const t = mode === 'dark' ? DARK : LIGHT
  return createTheme({
    palette: {
      mode,
      primary: { main: t.rust, light: t.rustLight, dark: t.rustDark, contrastText: '#FFFFFF' },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.ink, secondary: t.muted },
      divider: t.line,
    },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      h1: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
      h2: { fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700 },
    },
    shape: { borderRadius: 8 },
  })
}`}</CodePre>

          <h3>Step 3 — Theme context</h3>
          <CodePre>{`// src/theme-context.tsx
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { buildTheme } from './theme'

type Mode = 'light' | 'dark'
const Ctx = createContext<{ mode: Mode; toggle: () => void }>({ mode: 'light', toggle: () => {} })

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('lab.mode')
    return (saved === 'light' || saved === 'dark') ? saved : 'light'
  })

  const toggle = () => {
    setMode(m => {
      const next = m === 'dark' ? 'light' : 'dark'
      localStorage.setItem('lab.mode', next)
      return next
    })
  }

  const theme = useMemo(() => buildTheme(mode), [mode])

  return (
    <Ctx.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Ctx.Provider>
  )
}

export const useThemeMode = () => useContext(Ctx)`}</CodePre>

          <h3>Step 4 — useC() hook</h3>
          <CodePre>{`// src/use-c.ts
import { useTheme } from '@mui/material/styles'

export function useC() {
  const theme = useTheme()
  const d = theme.palette.mode === 'dark'
  return {
    bg:      d ? '#1C1008' : '#F5F0EA',
    paper:   d ? '#2F1C0C' : '#FFFFFF',
    border:  d ? '#4A3020' : '#EDE8E3',
    ink:     d ? '#F5F0EA' : '#1C0F07',
    muted:   d ? '#B89B82' : '#8B7A6B',
    rust:    d ? '#C77AA0' : '#5C2A4A',
    rustBg:  d ? 'rgba(199,122,160,0.18)' : 'rgba(92,42,74,0.10)',
  }
}`}</CodePre>

          <h3>Step 5 — App component</h3>
          <CodePre>{`// src/App.tsx
import { Box, Card, CardActionArea, Container, IconButton, Stack, Typography } from '@mui/material'
import { DarkMode, LightMode, Restaurant, Yard, Build, Movie } from '@mui/icons-material'
import { useC } from './use-c'
import { useThemeMode } from './theme-context'

const SECTIONS = [
  { id: 'recipes', title: 'Recipes',     blurb: 'Cook + plan',   icon: <Restaurant /> },
  { id: 'yard',    title: 'Yard',        blurb: 'Maintenance',   icon: <Yard /> },
  { id: 'tools',   title: 'Tools',       blurb: 'Workshop',      icon: <Build /> },
  { id: 'plex',    title: 'Movies',      blurb: 'Plex library',  icon: <Movie /> },
]

export default function App() {
  const C = useC()
  const { mode, toggle } = useThemeMode()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: C.bg, color: C.ink, py: 6 }}>
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h1" sx={{ fontSize: '2.5rem' }}>MUI Lab</Typography>
          <IconButton onClick={toggle} aria-label="Toggle theme">
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Stack>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3,
        }}>
          {SECTIONS.map(s => (
            <Card key={s.id} sx={{
              bgcolor: C.paper, border: \`1px solid \${C.border}\`, boxShadow: 'none',
              transition: 'transform 0.15s, border-color 0.15s',
              '&:hover': { borderColor: C.rust, transform: 'translateY(-2px)' },
            }}>
              <CardActionArea sx={{ p: 3 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2,
                  bgcolor: C.rustBg, color: C.rust,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 2,
                }}>
                  {s.icon}
                </Box>
                <Typography variant="h2" sx={{ fontSize: '1.2rem', mb: 0.5 }}>{s.title}</Typography>
                <Typography sx={{ color: C.muted, fontSize: '0.9rem' }}>{s.blurb}</Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}`}</CodePre>

          <h3>Step 6 — main.tsx</h3>
          <CodePre>{`// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeContextProvider } from './theme-context'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </StrictMode>
)`}</CodePre>

          <h3>Step 7 — Run + verify</h3>
          <ol>
            <li><code>npm run dev</code></li>
            <li>Open <code>http://localhost:5173</code>. You should see a card grid in light mode.</li>
            <li>Click the moon icon top-right. Theme flips to dark. All cards update colors smoothly.</li>
            <li>Refresh the page. Dark mode is preserved (localStorage).</li>
            <li>Hover a card. It lifts 2px + the border turns rust-colored.</li>
            <li>Resize the window narrow. The grid collapses to 1 column.</li>
          </ol>

          <h3>Step 8 — Inspect the DOM</h3>
          <p>Open DevTools → Elements. You'll see:</p>
          <ul>
            <li>Cards render as <code>{`<div class="MuiCard-root css-XXX">`}</code> with Emotion-generated class names.</li>
            <li>The class name has scoped styles (you can see them in the Styles panel).</li>
            <li>Toggling dark mode replaces the inline CSS variables OR re-renders with new class names — depending on MUI's strategy.</li>
          </ul>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've stood up Hearth/Cairn's complete MUI pattern from scratch — theme, useC() hook, card grid,
              dark mode toggle, responsive layout. Adding more components (Dialog, Drawer, Tabs) follows the same shape.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Cannot read property 'palette' of undefined"</h3>
          <p>Your component is using <code>useTheme()</code> without being wrapped in <code>{`<ThemeProvider>`}</code>. Check that the provider is high enough in the tree.</p>

          <h3>Dark mode flashes light first</h3>
          <p>Your state initializer reads from localStorage AFTER first paint. Use <code>useState(() =&gt; readLocalStorage())</code> (the lazy initializer form) so it reads BEFORE first render. For SSR apps, this requires more work — see §9.</p>

          <h3>"Module not found: Can't resolve '@emotion/react'"</h3>
          <p>You installed @mui/material but not Emotion. Run <code>npm i @emotion/react @emotion/styled</code>.</p>

          <h3>Icons aren't rendering</h3>
          <p>Three causes: (a) typo in the import name, (b) missing <code>@mui/icons-material</code> install, (c) tree-shaking dropped them — use named imports, not star imports.</p>

          <h3>sx prop styles aren't applying</h3>
          <p>The prop is named <code>sx</code>, lowercase. <code>Sx</code> or <code>SX</code> won't work. Also: sx only works on MUI components (Box, Stack, Typography, etc.), not on plain <code>{`<div>`}</code>.</p>

          <h3>Theme tokens don't autocomplete in sx</h3>
          <p>MUI 7 has full TypeScript support — autocomplete should work. If not, you may have an old <code>@mui/system</code> version that doesn't match. Update all MUI packages to matching versions.</p>

          <h3>Box renders an unexpected element</h3>
          <p>By default <code>Box</code> renders a <code>{`<div>`}</code>. Use the <code>component</code> prop to change: <code>{`<Box component="section">`}</code> renders a <code>{`<section>`}</code>.</p>

          <h3>"useMemo dependency changed but theme didn't update"</h3>
          <p><code>useMemo</code>'s deps need to be primitives. If you pass an object (like a config), the identity changes every render. Stringify or break into individual values.</p>

          <h3>CSS-in-JS is slow on large lists</h3>
          <p>Every <code>sx</code> evaluation has overhead. For lists of 1000+ items, use <code>styled()</code> instead — its CSS is cached and doesn't re-evaluate.</p>

          <h3>MUI Grid throws "Grid component is deprecated"</h3>
          <p>MUI 7 removed the old <code>Grid</code> in favor of <code>Grid</code> (without "container"). The new API is similar but cleaner. Or: use <code>Box</code> with <code>display: 'grid'</code> for full CSS Grid power.</p>

          <h3>Bundle is huge because of icons</h3>
          <p>You're using <code>import * as Icons from '@mui/icons-material'</code> somewhere. Convert to named imports.</p>

          <h3>Theme isn't persisting after navigation</h3>
          <p>Your ThemeProvider is INSIDE a route that unmounts. Move it ABOVE the router so it survives navigation.</p>

          <h3>"Property 'palette' is missing in type" TS error</h3>
          <p>You typed your <code>createTheme</code> call but didn't include <code>palette</code>. <code>createTheme</code> requires palette + typography keys; even empty objects suffice.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Install</h3>
          <CodePre>{`npm i @mui/material @mui/icons-material @emotion/react @emotion/styled`}</CodePre>

          <h3>Bootstrap</h3>
          <CodePre>{`import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const theme = createTheme({ palette: { mode: 'light' } })

<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>`}</CodePre>

          <h3>sx prop quick reference</h3>
          <CodePre>{`// Spacing (multiples of theme.spacing — default 8px)
p={2}                   // padding: 16px
m={1}                   // margin: 8px
mx={2}                  // margin-left + margin-right
gap={3}                 // gap: 24px

// Colors (theme paths)
bgcolor="primary.main"
color="text.secondary"
borderColor="divider"

// Responsive
p={{ xs: 1, md: 3 }}
display={{ xs: 'block', md: 'flex' }}

// Pseudo-selectors
'&:hover': { ... }
'&:focus': { ... }
'&[data-foo="bar"]': { ... }

// Theme function
sx={(theme) => ({ bgcolor: theme.palette.mode === 'dark' ? '...' : '...' })}`}</CodePre>

          <h3>useC() pattern</h3>
          <CodePre>{`function useC() {
  const theme = useTheme()
  const d = theme.palette.mode === 'dark'
  return {
    rust: d ? '#C77AA0' : '#5C2A4A',
    paper: d ? '#2F1C0C' : '#FFFFFF',
    // ...
  }
}

// Usage:
const C = useC()
<Box sx={{ bgcolor: C.paper, color: C.ink }}>...</Box>`}</CodePre>

          <h3>Box / Stack / Grid</h3>
          <CodePre>{`<Box sx={{ p: 2, display: 'flex' }}>...</Box>

<Stack direction="row" spacing={2} alignItems="center">
  <Avatar />
  <Typography>...</Typography>
</Stack>

<Box sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
  gap: 3,
}}>
  {items.map(i => <Card key={i.id}>{i}</Card>)}
</Box>`}</CodePre>

          <h3>Card + CardActionArea</h3>
          <CodePre>{`<Card sx={{ '&:hover': { transform: 'translateY(-2px)' } }}>
  <CardActionArea onClick={...} sx={{ p: 3 }}>
    {/* content */}
  </CardActionArea>
</Card>`}</CodePre>

          <h3>Dark mode skeleton</h3>
          <CodePre>{`const [mode, setMode] = useState<'light' | 'dark'>(() =>
  (localStorage.getItem('mode') as 'light' | 'dark') ?? 'light'
)
const toggle = () => setMode(m => {
  const next = m === 'dark' ? 'light' : 'dark'
  localStorage.setItem('mode', next)
  return next
})
const theme = useMemo(() => createTheme({ palette: { mode, ... } }), [mode])`}</CodePre>

          <h3>Icons (tree-shakable)</h3>
          <CodePre>{`import { Home as HomeIcon, Settings as SettingsIcon } from '@mui/icons-material'

<HomeIcon fontSize="small" />
<SettingsIcon sx={{ fontSize: 32, color: 'primary.main' }} />`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>buildTheme + ThemeProvider</td><td>SecretApp · <code>src/context/ThemeContext.tsx</code></td></tr>
              <tr><td>useC() hook</td><td>SecretApp · <code>src/PlexCommandCenter.tsx</code></td></tr>
              <tr><td>Card + CardActionArea + hover</td><td>SecretApp · <code>src/KnowledgeBase/index.tsx</code></td></tr>
              <tr><td>Tree-shakable icon imports</td><td>SecretApp · <code>src/App.tsx</code> (top imports)</td></tr>
              <tr><td>Box + CSS Grid responsive</td><td>SecretApp · <code>src/KnowledgeBase/index.tsx</code></td></tr>
              <tr><td>Selective MUI usage</td><td>ShopKeep · <code>src/pages/*</code> (Select, Dialog imports)</td></tr>
              <tr><td>localStorage-persisted dark mode</td><td>SecretApp · <code>src/context/ThemeContext.tsx</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: Framer Motion.</p>
        </section>
      </main>
    </div>
  );
}
