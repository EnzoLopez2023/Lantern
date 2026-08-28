import { useRef, useState } from 'react';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'v3 — JS-Config Era',               icon: '📜' },
  { id: 's3',  num: '3',  title: 'v4 — CSS-First Era',               icon: '🎨' },
  { id: 's4',  num: '4',  title: 'The @theme Block',                 icon: '🏷️' },
  { id: 's5',  num: '5',  title: 'Build Plugin Choices',             icon: '⚙️' },
  { id: 's6',  num: '6',  title: 'Custom Utilities + Variants',      icon: '🛠️' },
  { id: 's7',  num: '7',  title: 'Tooling: clsx + tailwind-merge',   icon: '🔗' },
  { id: 's8',  num: '8',  title: 'Migrating v3 → v4',                icon: '🚚' },
  { id: 's9',  num: '9',  title: 'Fleet-Wide Decisions',             icon: '🌐' },
  { id: 's10', num: '10', title: 'Performance + Bundle',             icon: '📦' },
  { id: 's11', num: '★',  title: 'Lab: v3 vs v4 Side-by-Side',       icon: '🛠️' },
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

export default function TailwindGuide() {
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
            <span className="sidebar-title">Tailwind v3 vs v4</span>
          </div>
          <div className="sidebar-sub">JS-config → CSS-first</div>
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
          <div className="hero-tag">🎨 Tailwind CSS v3 + v4 · 2026</div>
          <h1>Tailwind CSS<br />v3 vs v4 across the Fleet</h1>
          <p>
            Two fleet apps ship Tailwind <strong style={{ color: '#C77AA0' }}>v3</strong> (GLP1, Puzzlebox);
            five ship <strong style={{ color: '#C77AA0' }}>v4</strong> (SecretApp, ShopKeep, Workshop, SecretPhoto,
            PulseWire). This guide walks the architectural shift from JS-config to CSS-first, every
            configuration knob with real code, the migration playbook, and tooling that's shared across both versions
            — <code>clsx</code> + <code>tailwind-merge</code> + <code>cva</code>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Apps on v3</span></div>
            <div className="hero-stat"><span className="hero-stat-val">5</span><span className="hero-stat-label">Apps on v4</span></div>
            <div className="hero-stat"><span className="hero-stat-val">@theme</span><span className="hero-stat-label">v4 keyword</span></div>
            <div className="hero-stat"><span className="hero-stat-val">5×</span><span className="hero-stat-label">Faster compile</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Tailwind is a CSS framework whose entire premise is: <em>compose UI by stringing utility classes</em>.
            Instead of writing <code>{`.button { color: white; background: blue; padding: 8px 16px; }`}</code>, you write
            <code>{`<button class="text-white bg-blue-500 px-4 py-2">`}</code>. There's no "your styles" CSS file
            growing forever; there's just Tailwind's utilities applied at the markup.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The painter's palette vs the artisan's box.</strong> Traditional CSS is the painter mixing paint
            on a palette: you name the color, store it, reapply it. Tailwind is the artisan's box of pre-mixed paints:
            you reach in, grab <code>bg-blue-500</code>, slap it on. The box has every color you need; mixing is rarely
            necessary.
          </p>
          <p>
            <strong>The Lego analogy.</strong> Bootstrap is "a furnished house, change the colors a bit." Tailwind is
            "a bag of Lego bricks, build whatever you want." The bricks (utilities) are atomic + composable. You don't
            assemble "a Bootstrap card"; you make whatever card shape fits your design from the bricks.
          </p>
          <p>
            <strong>v3 vs v4 = config-in-JS vs config-in-CSS.</strong> v3 had a JS file (<code>tailwind.config.js</code>)
            that exported your theme + content paths. v4 moves that into CSS via the <code>@theme</code> at-rule. Same
            functionality, different surface.
          </p>

          <h3>What Tailwind is (in 2026)</h3>
          <ul>
            <li>A <strong>CSS generator</strong>: scans your source files, finds class names, generates the matching CSS.</li>
            <li>A <strong>design system</strong>: prebuilt color scales, spacing scales, font sizes, breakpoints.</li>
            <li>A <strong>build-time tool</strong>: runs as a PostCSS plugin (or Vite plugin in v4); no runtime cost.</li>
            <li>A <strong>JIT compiler</strong>: only generates the utilities actually used, so the output stays small.</li>
          </ul>

          <h3>What Tailwind is NOT</h3>
          <ul>
            <li>Not a component library (no buttons, modals, tables shipped — shadcn fills that gap for v4 apps).</li>
            <li>Not a CSS-in-JS runtime (no JS evaluated to compute styles at render time).</li>
            <li>Not a framework lock-in (it's just CSS classes; you can adopt incrementally).</li>
          </ul>

          <h3>The fleet inventory</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Tailwind version</th><th>Notes</th></tr>
              <tr><td>GLP1 (Tare)</td><td>v3 (3.4)</td><td>Rich warm-artisan palette in <code>tailwind.config.js</code></td></tr>
              <tr><td>Puzzlebox</td><td>v3 (3.4)</td><td>Minimal config — just defaults</td></tr>
              <tr><td>SecretApp (Hearth)</td><td>v4</td><td>Mostly uses MUI; Tailwind is supporting cast</td></tr>
              <tr><td>ShopKeep</td><td>v4</td><td>Mixed Tailwind + selective MUI</td></tr>
              <tr><td>SecretPhoto</td><td>v4 (4.2)</td><td><code>@tailwindcss/vite</code> plugin; masonry photo grid + lightbox, no MUI</td></tr>
              <tr><td>Workshop</td><td>v4 (4.2)</td><td>Warm-artisan palette in <code>@theme</code> block</td></tr>
              <tr><td>PulseWire</td><td>v4</td><td>Dark-glass palette in <code>@theme inline</code> block</td></tr>
              <tr><td>Cairn</td><td>(none — MUI only)</td><td>Uses MUI's <code>sx</code> exclusively</td></tr>
              <tr><td>Tabloom</td><td>(none — handwritten CSS)</td><td>Custom CSS tokens, no Tailwind</td></tr>
              <tr><td>sovereign-tactics</td><td>(none — Phaser canvas)</td><td>Game renders to a canvas; no DOM styling layer</td></tr>
            </tbody>
          </table>

          <p>So: 7 of 10 apps use some Tailwind. The v3 → v4 split corresponds to "started before late 2024" vs "started after."</p>
        </section>

        <hr />

        {/* SECTION 2 — V3 */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>v3 — the JS-Config Era</h2>
          <p>v3 was the dominant Tailwind from ~2022 to late 2024. Configuration in a JS file, theme tokens as JavaScript objects, PostCSS as the compiler.</p>

          <h3>GLP1's full v3 config</h3>
          <CodePre>{`// GLP1/tailwind.config.js — verbatim
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f1',
          100: '#fbeed8',
          200: '#f6dcb1',
          300: '#efc380',
          400: '#e6a44d',
          500: '#d68a2c',   // primary amber/honey
          600: '#b86c1e',
          700: '#92521b',
          800: '#75421d',
          900: '#5e361b',
          950: '#371d0c',
        },
        wood: {
          50:  '#fbf6ec',
          100: '#f4ebd6',
          // ... up to 950
        },
        meds:    { soft: '#fce4d8', mid: '#f59669', deep: '#9a3412' },
        glu:     { soft: '#dceef7', mid: '#5fa8d3', deep: '#0c4a6e' },
        weight:  { soft: '#ede5f4', mid: '#9b7cc7', deep: '#4c1d95' },
        active:  { soft: '#dde9d3', mid: '#7ea764', deep: '#365314' },
        glucose: {
          low:    '#ef4444',
          normal: '#22c55e',
          high:   '#f97316',
          vhigh:  '#dc2626',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        tile: '1.375rem',
      },
    },
  },
  plugins: [],
}`}</CodePre>

          <h3>The four sections of any v3 config</h3>
          <table>
            <tbody>
              <tr><th>Section</th><th>Purpose</th></tr>
              <tr><td><code>content</code></td><td>Globs for files Tailwind should scan for class names. If a class isn't in any scanned file, it's not generated.</td></tr>
              <tr><td><code>theme.extend</code></td><td>Augment Tailwind's default theme (add to the built-in color scale, add font families, add breakpoints).</td></tr>
              <tr><td><code>theme</code> (without extend)</td><td>REPLACE Tailwind's defaults entirely. Rarely used.</td></tr>
              <tr><td><code>plugins</code></td><td>Tailwind plugins for custom utilities, variants, components.</td></tr>
            </tbody>
          </table>

          <h3>Puzzlebox's bare-bones config</h3>
          <CodePre>{`// Puzzlebox/tailwind.config.js — verbatim (full file)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`}</CodePre>

          <p>Puzzlebox uses Tailwind's built-in palette as-is. No customization needed — the game UI is utilitarian.</p>

          <h3>The PostCSS config</h3>
          <CodePre>{`// GLP1/postcss.config.js — verbatim (full file)
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`}</CodePre>

          <p>Two plugins: <code>tailwindcss</code> (compiles directives + utilities) and <code>autoprefixer</code> (adds vendor prefixes for older browsers). Standard v3 setup.</p>

          <h3>The CSS entry</h3>
          <CodePre>{`/* GLP1/src/index.css (typical v3 entry) */
@tailwind base;       /* Tailwind's reset + base styles */
@tailwind components; /* Component-layer classes from plugins */
@tailwind utilities;  /* All the utility classes */

/* Your custom CSS goes after */
@layer base {
  html { font-family: 'Inter', system-ui, sans-serif; }
}

@layer components {
  .btn { @apply px-4 py-2 rounded bg-brand-500 text-white; }
}`}</CodePre>

          <h3>Using the custom tokens</h3>
          <CodePre>{`<button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-tile">
  Save
</button>

<div className="bg-wood-50 border border-wood-200 rounded-tile p-6">
  <h2 className="font-display text-3xl">Welcome</h2>
</div>`}</CodePre>

          <p><code>bg-brand-500</code> → <code>#d68a2c</code> (defined in config). <code>rounded-tile</code> → 1.375rem. <code>font-display</code> → "Inter Tight" fallback chain. All declared in v3's <code>theme.extend</code>.</p>

          <h3>The "plugins" array</h3>
          <CodePre>{`plugins: [
  require('@tailwindcss/forms'),       // sane form styles
  require('@tailwindcss/typography'),  // prose class
  require('@tailwindcss/aspect-ratio'),
  function ({ addUtilities }) {
    addUtilities({
      '.text-shadow': { textShadow: '2px 2px 4px rgba(0,0,0,0.3)' },
    })
  },
],`}</CodePre>

          <p>v3 plugins were JS functions that registered classes. Most fleet apps don't use plugins; defaults suffice.</p>
        </section>

        <hr />

        {/* SECTION 3 — V4 */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>v4 — the CSS-First Era</h2>
          <p>v4 dropped in late 2024 with a new architecture: <em>CSS-first configuration</em>, no required JS file, automatic content detection, an Oxide engine (Rust + Lightning CSS). Same utility classes, very different setup.</p>

          <h3>The headline changes</h3>
          <table>
            <tbody>
              <tr><th>Aspect</th><th>v3</th><th>v4</th></tr>
              <tr><td>Config location</td><td><code>tailwind.config.js</code></td><td>CSS file with <code>@theme</code></td></tr>
              <tr><td>Content scanning</td><td>Glob in <code>content: [...]</code></td><td>Automatic via filesystem walk</td></tr>
              <tr><td>Plugins</td><td><code>require('@tailwindcss/forms')</code></td><td><code>@plugin "@tailwindcss/forms"</code> in CSS</td></tr>
              <tr><td>Theme override</td><td>JS object</td><td>CSS variables in <code>@theme</code></td></tr>
              <tr><td>Compiler</td><td>PostCSS</td><td>Oxide (Rust)</td></tr>
              <tr><td>Compile speed</td><td>Baseline</td><td>~5× faster, especially incremental</td></tr>
              <tr><td>Browser support</td><td>IE11+</td><td>Modern browsers only (Safari 16.4+, Chrome 111+)</td></tr>
              <tr><td>Vite integration</td><td>PostCSS plugin</td><td>Dedicated <code>@tailwindcss/vite</code> plugin</td></tr>
            </tbody>
          </table>

          <h3>Workshop's full v4 setup</h3>

          <h4>Vite config:</h4>
          <CodePre>{`// workshop/vite.config.ts — verbatim
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5180,
  },
})`}</CodePre>

          <h4>The CSS entry:</h4>
          <CodePre>{`/* workshop/src/index.css — verbatim */
@import 'tailwindcss';

@theme {
  --color-cream:     #F5F0EA;
  --color-cream-2:   #EFE8DF;
  --color-paper:     #FFFFFF;
  --color-ink:       #1C0F07;
  --color-ink-soft:  #3D2817;
  --color-muted:     #8B7A6B;
  --color-line:      #EDE8E3;
  --color-rust:      #5C2A4A;
  --color-rust-dark: #7C3E1F;

  --font-serif:  'Playfair Display', Georgia, serif;
  --font-sans:   'Inter', system-ui, -apple-system, sans-serif;
}

html, body, #root {
  height: 100%;
}`}</CodePre>

          <h3>What changed</h3>
          <ol>
            <li><strong>No <code>tailwind.config.js</code></strong>. Everything's in CSS.</li>
            <li><strong><code>@import 'tailwindcss'</code></strong> replaces <code>@tailwind base; @tailwind components; @tailwind utilities;</code>.</li>
            <li><strong><code>@theme</code></strong> is the new way to declare tokens — they become both CSS variables AND Tailwind utilities.</li>
            <li><strong>No <code>content</code> globs</strong>. Tailwind scans automatically.</li>
            <li><strong>Vite plugin</strong> replaces PostCSS plugin (PostCSS still works; Vite plugin is faster).</li>
          </ol>

          <h3>Using v4's tokens</h3>
          <CodePre>{`<button className="bg-rust hover:bg-rust-dark text-cream px-4 py-2 rounded">
  Save
</button>

<h1 className="font-serif text-ink">Workshop</h1>`}</CodePre>

          <p>The class names work identically to v3. The difference is what's behind them (CSS variables vs JS objects).</p>

          <h3>SecretApp (Hearth)'s v4 — PostCSS variant</h3>
          <CodePre>{`// SecretApp/postcss.config.js — verbatim
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}`}</CodePre>

          <p>Same v4, different build plugin. <code>@tailwindcss/postcss</code> is the PostCSS adapter. Works in any PostCSS-enabled environment (not just Vite).</p>

          <h3>Why both plugin choices exist</h3>
          <ul>
            <li><strong><code>@tailwindcss/vite</code></strong>: native Vite plugin. Fastest. Use if you're already on Vite.</li>
            <li><strong><code>@tailwindcss/postcss</code></strong>: PostCSS plugin. Works in Next.js (which uses PostCSS internally), Webpack, etc.</li>
          </ul>

          <p>PulseWire uses PostCSS (because Next.js does). ShopKeep + Workshop use Vite (already on Vite). Both produce identical output; the Vite path is a hair faster on incremental rebuilds.</p>
        </section>

        <hr />

        {/* SECTION 4 — THEME */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The <code>@theme</code> Block</h2>
          <p>v4's biggest conceptual addition. A CSS at-rule that registers tokens — colors, fonts, spacing, breakpoints — that become BOTH CSS variables AND Tailwind utilities.</p>

          <h3>The pattern</h3>
          <CodePre>{`@theme {
  --color-primary: #3b82f6;
  --color-success: #22c55e;
  --color-danger:  #ef4444;
  --font-sans:     'Inter', system-ui;
  --spacing-72:    18rem;
  --radius-tile:   1.375rem;
}`}</CodePre>

          <p>What this gives you:</p>
          <ul>
            <li>CSS variables you can use anywhere: <code>color: var(--color-primary)</code>.</li>
            <li>Tailwind utilities: <code>{`<div class="bg-primary text-success border-danger font-sans p-72 rounded-tile">`}</code>.</li>
          </ul>

          <h3>The naming convention</h3>
          <p>Tailwind reads <code>--&lt;namespace&gt;-&lt;name&gt;</code> and generates utilities in that namespace:</p>
          <table>
            <tbody>
              <tr><th>Variable</th><th>Generated utilities</th></tr>
              <tr><td><code>--color-rust</code></td><td><code>bg-rust</code>, <code>text-rust</code>, <code>border-rust</code>, etc.</td></tr>
              <tr><td><code>--font-serif</code></td><td><code>font-serif</code></td></tr>
              <tr><td><code>--spacing-72</code></td><td><code>p-72</code>, <code>m-72</code>, <code>w-72</code>, <code>h-72</code>, <code>gap-72</code>, etc.</td></tr>
              <tr><td><code>--radius-tile</code></td><td><code>rounded-tile</code></td></tr>
              <tr><td><code>--breakpoint-3xl</code></td><td><code>3xl:</code> variant</td></tr>
              <tr><td><code>--shadow-glow</code></td><td><code>shadow-glow</code></td></tr>
              <tr><td><code>--animate-bounce-slow</code></td><td><code>animate-bounce-slow</code></td></tr>
            </tbody>
          </table>

          <h3><code>@theme</code> vs <code>@theme inline</code></h3>
          <CodePre>{`/* Plain @theme: the variable VALUE is what gets generated */
@theme {
  --color-primary: #3b82f6;
}
/* CSS output:
   :root { --color-primary: #3b82f6; }
   .bg-primary { background-color: #3b82f6; }   ← literal, not var()
*/

/* @theme inline: the variable REFERENCE is preserved */
@theme inline {
  --color-primary: var(--brand-primary);   /* references another var */
}
/* CSS output:
   .bg-primary { background-color: var(--brand-primary); }   ← preserved
*/`}</CodePre>

          <p>The <code>inline</code> variant is what enables PulseWire's two-layer pattern (raw values in <code>:root</code>, semantic mappings in <code>@theme inline</code>). The semantic name's utility resolves at render time via CSS variable inheritance, so changing the raw value swaps everything.</p>

          <h3>PulseWire's two-layer pattern</h3>
          <CodePre>{`/* PulseWire/src/app/globals.css — verbatim relevant portion */
@import "tailwindcss";

:root {
  --background:    #0b1020;
  --foreground:    #ffffff;
  --accent-cyan:   #00e5ff;
  --accent-violet: #7c3aed;
}

@theme inline {
  --color-background:    var(--background);
  --color-foreground:    var(--foreground);
  --color-accent-cyan:   var(--accent-cyan);
  --color-accent-violet: var(--accent-violet);
}`}</CodePre>

          <p>Now PulseWire can:</p>
          <ul>
            <li>Use <code>{`<div class="bg-background text-foreground">`}</code> throughout the codebase.</li>
            <li>Override <code>--background</code> anywhere (light mode, a specific component) and EVERY <code>bg-background</code> updates.</li>
            <li>Toggle dark/light via class on <code>{`<html>`}</code> — no JS theme provider needed.</li>
          </ul>

          <h3>Workshop's flat pattern</h3>
          <CodePre>{`@theme {
  --color-cream:     #F5F0EA;
  --color-ink:       #1C0F07;
  --color-rust:      #5C2A4A;
}`}</CodePre>

          <p>No <code>inline</code> — Workshop bakes the values directly into the generated utilities. Simpler; no theme-swap flexibility, but Workshop doesn't need it.</p>

          <h3>What you can declare in @theme</h3>
          <table>
            <tbody>
              <tr><th>Prefix</th><th>Generates</th></tr>
              <tr><td><code>--color-*</code></td><td>Color utilities (bg, text, border, ring, etc.)</td></tr>
              <tr><td><code>--font-*</code></td><td>font-family utilities</td></tr>
              <tr><td><code>--text-*</code></td><td>font-size + line-height pairs</td></tr>
              <tr><td><code>--font-weight-*</code></td><td>font-weight utilities</td></tr>
              <tr><td><code>--tracking-*</code></td><td>letter-spacing utilities</td></tr>
              <tr><td><code>--leading-*</code></td><td>line-height utilities</td></tr>
              <tr><td><code>--breakpoint-*</code></td><td>responsive variants (md:, lg:, etc.)</td></tr>
              <tr><td><code>--container-*</code></td><td>container query variants</td></tr>
              <tr><td><code>--spacing-*</code></td><td>p, m, w, h, gap, etc.</td></tr>
              <tr><td><code>--radius-*</code></td><td>rounded-* utilities</td></tr>
              <tr><td><code>--shadow-*</code></td><td>shadow-* utilities</td></tr>
              <tr><td><code>--blur-*</code></td><td>blur-* utilities</td></tr>
              <tr><td><code>--animate-*</code></td><td>animate-* utilities (referencing @keyframes)</td></tr>
            </tbody>
          </table>

          <h3>Disabling defaults</h3>
          <CodePre>{`@theme {
  /* Disable all default color tokens — only your own */
  --color-*: initial;

  /* Now declare your palette */
  --color-rust: #5C2A4A;
  --color-cream: #F5F0EA;
}`}</CodePre>

          <p>This is the v4 equivalent of v3's <code>theme.colors</code> (override) vs <code>theme.extend.colors</code> (augment). Use <code>--namespace-*: initial</code> to wipe defaults.</p>
        </section>

        <hr />

        {/* SECTION 5 — BUILD PLUGIN */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Build Plugin Choices</h2>
          <p>Three ways to wire Tailwind into your build, depending on your bundler.</p>

          <h3>v3 — PostCSS</h3>
          <CodePre>{`// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`}</CodePre>

          <p>Works anywhere PostCSS is supported: Vite (built-in), Webpack (with postcss-loader), Next.js (built-in), Astro, etc.</p>

          <h3>v4 — PostCSS variant</h3>
          <CodePre>{`// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}`}</CodePre>

          <p>Same idea, new plugin name. Used by Hearth and PulseWire (Next.js).</p>

          <h3>v4 — Vite plugin (preferred for Vite apps)</h3>
          <CodePre>{`// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`}</CodePre>

          <p>Bypasses PostCSS entirely. Direct integration with Vite's transform pipeline. ~20-30% faster than the PostCSS variant in benchmarks. Used by ShopKeep + Workshop.</p>

          <h3>v4 — Next.js standard</h3>
          <p>Next.js 15+ ships with built-in PostCSS support. PulseWire's setup is just:</p>
          <CodePre>{`// PulseWire/postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config`}</CodePre>

          <p>That's the entire build integration. Next.js sees PostCSS config + automatically applies it.</p>

          <h3>v4 — CLI (for non-bundled use cases)</h3>
          <CodePre>{`# Install
npm install -D @tailwindcss/cli

# Watch + compile
npx @tailwindcss/cli -i input.css -o output.css --watch

# One-shot build
npx @tailwindcss/cli -i input.css -o output.css --minify`}</CodePre>

          <p>For projects without a bundler (a plain static site, a Rails app, server-rendered HTML). Not used in the fleet.</p>

          <h3>Choosing</h3>
          <table>
            <tbody>
              <tr><th>If you're on…</th><th>Use…</th></tr>
              <tr><td>Vite</td><td><code>@tailwindcss/vite</code></td></tr>
              <tr><td>Next.js</td><td><code>@tailwindcss/postcss</code></td></tr>
              <tr><td>Webpack / Astro / Other PostCSS</td><td><code>@tailwindcss/postcss</code></td></tr>
              <tr><td>No bundler / static</td><td><code>@tailwindcss/cli</code></td></tr>
            </tbody>
          </table>

          <h3>Autoprefixer + v4</h3>
          <p>v4 includes Lightning CSS internally, which handles vendor prefixing AND modern CSS features (nesting, color functions, etc.). For most apps, you can drop autoprefixer. Hearth keeps it for belt-and-braces; PulseWire drops it (just the Tailwind plugin alone in PostCSS config).</p>
        </section>

        <hr />

        {/* SECTION 6 — CUSTOM UTILITIES */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Custom Utilities + Variants</h2>
          <p>Most of what you need is in Tailwind's defaults. When you need more, both versions support custom utilities + custom variants — different mechanisms.</p>

          <h3>v3 — JS plugin</h3>
          <CodePre>{`// tailwind.config.js
import plugin from 'tailwindcss/plugin'

export default {
  // ...
  plugins: [
    plugin(function({ addUtilities, addVariant, theme }) {
      addUtilities({
        '.text-shadow-sm': { textShadow: '1px 1px 2px rgba(0,0,0,0.25)' },
        '.text-shadow':    { textShadow: '2px 2px 4px rgba(0,0,0,0.3)' },
      })

      addVariant('hocus', ['&:hover', '&:focus'])
    }),
  ],
}`}</CodePre>

          <p>Lets you write <code>{`<button class="hocus:bg-blue-500 text-shadow">`}</code>.</p>

          <h3>v4 — CSS-only</h3>
          <CodePre>{`/* In your globals.css */
@import 'tailwindcss';

@theme {
  --color-rust: #5C2A4A;
}

/* Custom utility — generates .text-shadow utility */
@utility text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Custom utility with theme variable */
@utility text-shadow-rust {
  text-shadow: 2px 2px 4px var(--color-rust);
}

/* Custom variant */
@custom-variant hocus {
  &:hover, &:focus {
    @slot;
  }
}`}</CodePre>

          <p>No JS. The <code>@utility</code> + <code>@custom-variant</code> at-rules are v4's plugin replacement.</p>

          <h3>Workshop's animation utilities</h3>
          <CodePre>{`/* workshop/src/index.css */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* These animations are available as classes via @theme animate-* tokens */`}</CodePre>

          <p>Workshop defines the keyframes; if registered via <code>@theme</code> (<code>--animate-fade-up: fadeUp 0.4s ease-out</code>), you'd write <code>{`<div class="animate-fade-up">`}</code>.</p>

          <h3>Arbitrary values (both versions)</h3>
          <CodePre>{`<!-- Arbitrary class — generated on demand -->
<div class="text-[#FF5733]">Custom color</div>
<div class="w-[37%]">Custom width</div>
<div class="grid-cols-[repeat(3,_minmax(0,_1fr))]">Custom grid</div>

<!-- Arbitrary properties (Tailwind 3.1+) -->
<div class="[--my-var:_red]">Set CSS variable inline</div>

<!-- Combined with variants -->
<div class="hover:bg-[#5C2A4A]">Hover with arbitrary color</div>`}</CodePre>

          <p>Both versions support this. Useful for one-off values that don't deserve a token.</p>

          <h3>@apply for component extraction</h3>
          <CodePre>{`/* v3 + v4 both support */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-rust text-cream rounded hover:bg-rust-dark;
  }
}

/* Then use: <button class="btn-primary">Save</button> */`}</CodePre>

          <p>Useful for components that appear many times. Hearth + Workshop barely use this (preferring direct utility composition). PulseWire uses it sparingly for utility components in its components folder.</p>
        </section>

        <hr />

        {/* SECTION 7 — TOOLING */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Tooling: clsx + tailwind-merge + cva</h2>
          <p>Three small libraries that level up Tailwind. Version-agnostic — they work with v3 and v4 identically. PulseWire uses all three (deep dive in the shadcn/ui guide); the rest of the fleet uses subsets.</p>

          <h3>clsx — conditional class joining</h3>
          <CodePre>{`import { clsx } from 'clsx'

<button className={clsx(
  'px-4 py-2 rounded',                  // always
  isPrimary && 'bg-blue-500 text-white', // conditional
  { 'opacity-50': disabled },            // object form
)}>
  Click
</button>`}</CodePre>

          <p>Handles truthy strings, arrays, objects. Drops falsy values. The "Hello" → "px-4 py-2 rounded bg-blue-500 text-white" output is a clean joined string.</p>

          <h3>tailwind-merge — conflict resolution</h3>
          <CodePre>{`import { twMerge } from 'tailwind-merge'

// Two padding utilities — twMerge picks the last
twMerge('p-2 p-4')             // → 'p-4'

// Conflict on background, but NOT on text
twMerge('bg-blue-500 text-white bg-red-500')  // → 'text-white bg-red-500'

// Knows about Tailwind's grammar:
twMerge('px-2 p-4')            // → 'p-4' (p- supersedes px-)
twMerge('bg-red-500/50 bg-blue-500/50')  // → 'bg-blue-500/50' (knows about /N opacity)`}</CodePre>

          <p>The killer feature: when a component accepts a <code>className</code> prop, you need conflict resolution. Without it, both classes end up in the className string + CSS file order decides — unpredictable. tailwind-merge applies the LAST one consistently.</p>

          <h3>The cn() pattern — combine clsx + tailwind-merge</h3>
          <CodePre>{`// utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}</CodePre>

          <p>Seven lines. PulseWire ships this verbatim. ShopKeep / Workshop ship variations. The single most useful Tailwind helper.</p>

          <h3>Usage in components</h3>
          <CodePre>{`function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded font-medium transition-colors',       // base
        variant === 'primary'   && 'bg-rust text-cream hover:bg-rust-dark',
        variant === 'secondary' && 'bg-cream border border-line',
        className,                                                // consumer's className wins on conflicts
      )}
      {...props}
    />
  )
}

<Button variant="primary" className="bg-red-500">Override</Button>
// Output: "px-4 py-2 rounded font-medium transition-colors text-cream hover:bg-rust-dark bg-red-500"`}</CodePre>

          <p>The consumer's <code>className="bg-red-500"</code> wins over the variant's <code>bg-rust</code> because tailwind-merge knows they conflict + the consumer's came later. Without twMerge, both would land in the string + browser picks one based on CSS order (typically the variant, because Tailwind's classes come first alphabetically) — surprising for the consumer.</p>

          <h3>cva — variant systems</h3>
          <p>Covered in detail in the shadcn guide §4. Brief reminder:</p>
          <CodePre>{`import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'px-4 py-2 rounded font-medium transition-colors',   // base
  {
    variants: {
      variant: {
        primary:   'bg-rust text-cream hover:bg-rust-dark',
        secondary: 'bg-cream border border-line',
        ghost:     'hover:bg-cream',
      },
      size: {
        sm: 'text-sm px-3 py-1',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = VariantProps<typeof buttonVariants> & { className?: string }

function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}`}</CodePre>

          <p>cva builds the class string with full TypeScript inference of available variants. Workshop + ShopKeep don't currently use cva (they roll variants by hand); PulseWire uses it everywhere.</p>

          <h3>When to use what</h3>
          <table>
            <tbody>
              <tr><th>You have…</th><th>Reach for…</th></tr>
              <tr><td>Conditional classes</td><td>clsx</td></tr>
              <tr><td>A consumer-overridable className</td><td>cn (clsx + tailwind-merge)</td></tr>
              <tr><td>A component with 3+ visual variants</td><td>cva + cn</td></tr>
              <tr><td>Just one className value</td><td>Plain string</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 8 — MIGRATION */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Migrating v3 → v4</h2>
          <p>Tailwind ships an upgrade tool. For most apps, the migration is mechanical; for custom-plugin-heavy configs, hand-translation is needed.</p>

          <h3>The upgrade tool</h3>
          <CodePre>{`# In your project root
npx @tailwindcss/upgrade

# Or with a specific target version
npx @tailwindcss/upgrade@next`}</CodePre>

          <p>The tool:</p>
          <ul>
            <li>Renames packages: <code>tailwindcss</code> → <code>tailwindcss@4</code>, installs <code>@tailwindcss/postcss</code> or <code>@tailwindcss/vite</code>.</li>
            <li>Converts your <code>tailwind.config.js</code>'s <code>theme.extend</code> to <code>@theme</code> in CSS.</li>
            <li>Replaces <code>@tailwind base/components/utilities</code> with <code>@import 'tailwindcss'</code>.</li>
            <li>Migrates simple plugin usages (Forms, Typography) to <code>@plugin</code> directives.</li>
            <li>Updates class names that changed semantics (rare — Tailwind tries hard to keep utility names stable).</li>
          </ul>

          <h3>What the tool can't do automatically</h3>
          <ul>
            <li><strong>Custom JS plugins</strong>: rewrite to <code>@utility</code> / <code>@custom-variant</code> in CSS.</li>
            <li><strong><code>theme.extend.colors</code> with nested objects</strong>: the tool flattens to <code>--color-brand-500</code>, but you may want different shapes.</li>
            <li><strong>Browser-support constraints</strong>: v4 dropped IE11; if you need it, stay on v3 or migrate carefully.</li>
            <li><strong><code>@tailwindcss/typography</code> customizations</strong>: the v4 version uses different override syntax.</li>
          </ul>

          <h3>The before/after for GLP1</h3>

          <p>Before (v3):</p>
          <CodePre>{`// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#d68a2c', 600: '#b86c1e' },
        wood:  { 50: '#fbf6ec', 950: '#1c150e' },
      },
      borderRadius: { tile: '1.375rem' },
    },
  },
}`}</CodePre>

          <p>After (v4 equivalent):</p>
          <CodePre>{`/* src/index.css */
@import 'tailwindcss';

@theme {
  --color-brand-500: #d68a2c;
  --color-brand-600: #b86c1e;
  --color-wood-50:   #fbf6ec;
  --color-wood-950:  #1c150e;

  --radius-tile:     1.375rem;
}`}</CodePre>

          <p>The nested objects (<code>{'brand: { 500, 600 }'}</code>) flatten to dash-separated names. Generated utilities are identical (<code>bg-brand-500</code>, <code>rounded-tile</code>).</p>

          <h3>The class-name compatibility</h3>
          <p>Almost every utility class works in both v3 and v4. The exceptions are tiny edge cases (some color-opacity syntax, some gradient utilities). If your codebase compiles in v4 after migration, the visual output should be ~identical.</p>

          <h3>The browser-support shift</h3>
          <table>
            <tbody>
              <tr><th></th><th>v3</th><th>v4</th></tr>
              <tr><td>Safari</td><td>11+</td><td>16.4+ (2023)</td></tr>
              <tr><td>Chrome</td><td>60+</td><td>111+ (2023)</td></tr>
              <tr><td>Firefox</td><td>78+</td><td>113+ (2023)</td></tr>
              <tr><td>IE</td><td>11</td><td>Not supported</td></tr>
            </tbody>
          </table>

          <p>v4 uses modern CSS features (cascade layers, color() functions, container queries). If you support old browsers, stay on v3 or write fallbacks.</p>

          <h3>When to migrate</h3>
          <ul>
            <li><strong>Greenfield app</strong>: v4. No reason to start on v3.</li>
            <li><strong>Existing app, large codebase</strong>: defer until you have a quiet week. The upgrade tool handles ~80%; the remaining ~20% is hand work.</li>
            <li><strong>Plugin-heavy</strong>: defer until the plugins you use have v4 equivalents or you've decided to rewrite them.</li>
            <li><strong>IE / legacy browser audience</strong>: stay on v3.</li>
          </ul>

          <p>Fleet pattern: new apps started on v4; existing v3 apps (GLP1, Puzzlebox) haven't been migrated yet. Both versions still receive bug fixes; v3 isn't deprecated.</p>
        </section>

        <hr />

        {/* SECTION 9 — FLEET DECISIONS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Fleet-Wide Decisions</h2>
          <p>The fleet's choices around Tailwind are deliberate — not "we just used what came up." Five patterns worth noting.</p>

          <h3>1. Warm-artisan palette (Workshop, GLP1, ShopKeep)</h3>
          <p>Three apps share variants of a "warm artisan" color theme — cream backgrounds, rust accents, ink text. GLP1 names them <code>brand-*</code>+<code>wood-*</code>; Workshop names them <code>cream / ink / rust</code>; ShopKeep doesn't formalize them.</p>

          <p>Workshop's tokens:</p>
          <CodePre>{`@theme {
  --color-cream:     #F5F0EA;  /* main background */
  --color-cream-2:   #EFE8DF;  /* cards / surfaces */
  --color-paper:     #FFFFFF;  /* elevated surfaces */
  --color-ink:       #1C0F07;  /* primary text */
  --color-ink-soft:  #3D2817;  /* secondary text */
  --color-muted:     #8B7A6B;  /* tertiary text */
  --color-line:      #EDE8E3;  /* borders */
  --color-rust:      #5C2A4A;  /* accent */
  --color-rust-dark: #7C3E1F;  /* accent hover */
}`}</CodePre>

          <h3>2. Dark-glass palette (PulseWire)</h3>
          <p>PulseWire is the outlier — a premium dark reader UI with cyan + violet accents:</p>
          <CodePre>{`:root {
  --background:    #0b1020;   /* deep night */
  --surface:       #121826;   /* card surface */
  --foreground:    #ffffff;   /* primary text */
  --muted:         #94a3b8;   /* secondary text */
  --accent-cyan:   #00e5ff;   /* highlight 1 */
  --accent-violet: #7c3aed;   /* highlight 2 */
}`}</CodePre>

          <h3>3. Two-layer pattern for theme-able apps</h3>
          <p>PulseWire (would-be-themable, currently dark-only) uses the <code>:root</code> raw values + <code>@theme inline</code> semantic mappings (covered in §4). Workshop uses flat values — no theme swap planned.</p>

          <h3>4. Mixed Tailwind + MUI</h3>
          <p>ShopKeep, Hearth use BOTH. The pattern:</p>
          <ul>
            <li><strong>MUI</strong>: complex compound widgets — <code>{`<Select>`}</code>, <code>{`<Dialog>`}</code>, <code>{`<DataGrid>`}</code>, <code>{`<DatePicker>`}</code>. Plus icons (<code>@mui/icons-material</code>).</li>
            <li><strong>Tailwind</strong>: everything else — layout, spacing, typography, hand-rolled components.</li>
          </ul>

          <p>The reasoning: MUI's pre-built widgets save building from scratch. Tailwind's utility model wins for everything else. CSS-in-JS overhead is acceptable for the few MUI components used; Tailwind owns the rest.</p>

          <h3>5. cn() utility is the lingua franca</h3>
          <p>Every v4 app has <code>src/lib/utils.ts</code> (or similar) with the seven-line <code>cn()</code> helper. Even when components don't strictly need conflict resolution, the habit is "any className composition goes through cn()." Predictable, safe.</p>

          <h3>What the fleet does NOT do</h3>
          <ul>
            <li><strong>Tailwind plugins</strong>: nobody uses <code>@tailwindcss/forms</code> or <code>@tailwindcss/typography</code>. Hand-rolled form styles + custom markdown rendering (e.g. Hearth's <code>react-markdown</code> + custom CSS).</li>
            <li><strong>The <code>prefix</code> option</strong>: no <code>tw-</code> prefix anywhere. Vanilla utility names.</li>
            <li><strong>JIT exclusively</strong>: v3.3+ ships with JIT enabled by default; v4 only does JIT. No legacy "purge" config.</li>
            <li><strong>CSS-in-JS for Tailwind classes</strong>: never <code>tw\`bg-blue-500\`</code> tagged templates. Just string className.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 10 — PERF */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Performance + Bundle</h2>

          <h3>JIT mode (since v3.3)</h3>
          <p>Tailwind only generates the utilities you actually use. The output CSS for a typical fleet app is 10-30 KB gzipped — tiny compared to the full utility set (~3 MB if everything were generated).</p>

          <h3>What "uses" means</h3>
          <p>Tailwind scans your source files for class names. If <code>bg-blue-500</code> appears in any tracked file, it's in the output. If not, it's not.</p>
          <p>This is why arbitrary classes can be dangerous:</p>
          <CodePre>{`// 🚫 BAD — Tailwind can't see the class name through interpolation
const color = 'red-500'
return <div className={\`bg-\${color}\`}>...</div>
// Tailwind sees 'bg-' + variable; doesn't generate any bg- utility.

// ✅ GOOD — full class name appears literally
return <div className={isDanger ? 'bg-red-500' : 'bg-blue-500'}>...</div>
// Tailwind sees both classes, generates both.

// Also OK — explicit safelist in tailwind.config.js (v3) or @source inline in CSS (v4)`}</CodePre>

          <h3>v4 — automatic content detection</h3>
          <p>v3's <code>content: [...]</code> globs are gone in v4 — Tailwind scans your filesystem automatically, starting from the CSS file's directory + walking up to find your <code>.tsx</code> / <code>.jsx</code> / <code>.html</code> files. To opt out:</p>
          <CodePre>{`@import 'tailwindcss';

@source 'src/**/*.tsx';            /* explicit source */
@source not 'src/generated/**';   /* exclude */`}</CodePre>

          <p>Fleet apps don't override; the defaults work.</p>

          <h3>The compile speed</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>v3 compile</th><th>v4 compile</th></tr>
              <tr><td>GLP1 (v3)</td><td>~300ms</td><td>—</td></tr>
              <tr><td>ShopKeep (v4)</td><td>—</td><td>~50ms</td></tr>
              <tr><td>PulseWire (v4)</td><td>—</td><td>~60ms (Next.js cold)</td></tr>
              <tr><td>Workshop (v4)</td><td>—</td><td>~40ms</td></tr>
            </tbody>
          </table>

          <p>v4's Oxide engine (Rust + Lightning CSS) is 5-10× faster than v3's PostCSS-based compile. The win is most noticeable on hot reload — sub-100ms means a save-to-paint feels instant.</p>

          <h3>The output bundle</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Generated CSS</th><th>Gzipped</th></tr>
              <tr><td>GLP1 (v3)</td><td>~95 KB</td><td>~22 KB</td></tr>
              <tr><td>ShopKeep (v4)</td><td>~70 KB</td><td>~15 KB</td></tr>
              <tr><td>PulseWire (v4)</td><td>~80 KB</td><td>~17 KB</td></tr>
              <tr><td>Workshop (v4)</td><td>~65 KB</td><td>~14 KB</td></tr>
            </tbody>
          </table>

          <p>v4 is slightly smaller (better tree-shaking) but the difference is marginal. The bigger win is in compile time.</p>

          <h3>Tree-shaking gotcha</h3>
          <p>If you import a library that includes Tailwind classes in its source, Tailwind might miss them (only your project files are scanned by default). Solutions:</p>
          <ul>
            <li>Add the library to <code>@source</code>: <code>@source '../node_modules/my-ui-lib/**/*.tsx';</code></li>
            <li>OR safelist the classes you need.</li>
            <li>OR pick a library that ships pre-compiled CSS.</li>
          </ul>

          <p>None of the fleet apps hit this — shadcn copies source INTO your project (so Tailwind scans it normally), and other libraries either ship CSS or don't use Tailwind.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — v3 vs v4 Side-by-Side</h2>
          <p>Stand up two minimal Vite + React apps — one v3, one v4 — with the same warm-artisan palette and a single component. Compare configs, compile speed, and class output. ~30 minutes.</p>

          <h3>Step 1 — Scaffold both</h3>
          <CodePre>{`mkdir tailwind-lab && cd tailwind-lab
npm create vite@latest v3-app -- --template react-ts
npm create vite@latest v4-app -- --template react-ts`}</CodePre>

          <h3>Step 2 — v3 setup</h3>
          <CodePre>{`cd v3-app
npm i
npm i -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p`}</CodePre>

          <p>The <code>init -p</code> generates both <code>tailwind.config.js</code> and <code>postcss.config.js</code>. Replace contents:</p>

          <CodePre>{`// v3-app/tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:    '#F5F0EA',
        ink:      '#1C0F07',
        rust:     '#5C2A4A',
        'rust-dark': '#7C3E1F',
        line:     '#EDE8E3',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`}</CodePre>

          <CodePre>{`/* v3-app/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body { background: theme('colors.cream'); color: theme('colors.ink'); }`}</CodePre>

          <h3>Step 3 — v4 setup</h3>
          <CodePre>{`cd ../v4-app
npm i
npm i -D tailwindcss @tailwindcss/vite`}</CodePre>

          <CodePre>{`// v4-app/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})`}</CodePre>

          <CodePre>{`/* v4-app/src/index.css */
@import 'tailwindcss';

@theme {
  --color-cream:     #F5F0EA;
  --color-ink:       #1C0F07;
  --color-rust:      #5C2A4A;
  --color-rust-dark: #7C3E1F;
  --color-line:      #EDE8E3;

  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans:  'Inter', system-ui, sans-serif;
}

body {
  background: var(--color-cream);
  color: var(--color-ink);
}`}</CodePre>

          <h3>Step 4 — Same App.tsx for both</h3>
          <CodePre>{`// Copy into both v3-app/src/App.tsx and v4-app/src/App.tsx
export default function App() {
  return (
    <div className="min-h-screen p-12 max-w-2xl mx-auto">
      <h1 className="font-serif text-4xl text-ink mb-2">
        Tailwind Lab
      </h1>
      <p className="text-lg mb-6">
        Same component, two configs. Open DevTools to inspect the generated CSS.
      </p>

      <div className="grid gap-4">
        <div className="bg-white border border-line p-6 rounded-lg">
          <h2 className="font-serif text-2xl mb-2">Card 1</h2>
          <button className="bg-rust hover:bg-rust-dark text-cream px-4 py-2 rounded transition-colors">
            Save
          </button>
        </div>

        <div className="bg-white border border-line p-6 rounded-lg">
          <h2 className="font-serif text-2xl mb-2">Card 2</h2>
          <p className="text-sm">
            Each card uses utility classes only — no custom CSS.
          </p>
        </div>
      </div>
    </div>
  )
}`}</CodePre>

          <h3>Step 5 — Compare</h3>
          <ol>
            <li>Run <code>npm run dev</code> in both. Visit them side-by-side. They should look identical.</li>
            <li>DevTools → inspect a button. The computed style is the same.</li>
            <li>DevTools → Sources tab. Find the loaded CSS file.
              <ul>
                <li>v3: see <code>--tw-bg-opacity</code> CSS variables + hex literals in utilities.</li>
                <li>v4: utilities use <code>color-mix()</code> + your CSS variables.</li>
              </ul>
            </li>
            <li>Time how long the dev server takes to hot-reload after saving App.tsx:
              <ul>
                <li>v3: ~150-300 ms.</li>
                <li>v4: ~30-60 ms.</li>
              </ul>
            </li>
            <li>Build for production: <code>npm run build</code> in each. Compare the generated CSS file sizes in <code>dist/assets/</code>.</li>
          </ol>

          <h3>Step 6 — Add an arbitrary utility (works in both)</h3>
          <CodePre>{`<button className="bg-[#FF5733] text-white p-[18px]">
  Arbitrary
</button>`}</CodePre>

          <p>Both versions handle this identically. The generated CSS includes the literal values.</p>

          <h3>Step 7 — Add a v3-only feature: @apply in a component</h3>
          <CodePre>{`/* v3-app/src/index.css */
@layer components {
  .btn-primary {
    @apply bg-rust text-cream px-4 py-2 rounded hover:bg-rust-dark transition-colors;
  }
}

/* Then in App.tsx: <button className="btn-primary">Save</button> */`}</CodePre>

          <p>v4 also supports <code>@apply</code> — but only outside <code>@theme</code>. Same syntax otherwise.</p>

          <h3>Step 8 — Try @utility (v4 only)</h3>
          <CodePre>{`/* v4-app/src/index.css */
@utility text-shadow-rust {
  text-shadow: 2px 2px 8px var(--color-rust);
}

/* Then: <h1 className="text-shadow-rust font-serif">...</h1> */`}</CodePre>

          <p>Custom utility, defined in CSS, generated like any built-in. v3 needed a JS plugin for this.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've stood up both versions side-by-side. The visual output is identical; the configuration surface is
              the headline difference. v4's CSS-first model + faster compile is why new fleet apps pick it.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>Classes don't apply</h3>
          <p>Most common: Tailwind isn't scanning your files. v3: check <code>content</code> globs include your file paths. v4: ensure the CSS file is imported by your app and <code>@import 'tailwindcss'</code> is at the top.</p>

          <h3>"Cannot find module '@tailwindcss/vite'"</h3>
          <p>v4 only. Install: <code>npm i -D @tailwindcss/vite</code>.</p>

          <h3>Arbitrary class with dynamic value doesn't work</h3>
          <p>Tailwind can't see classes built via string interpolation. Use a static class lookup table:</p>
          <CodePre>{`// 🚫 Bad
const className = \`bg-\${color}-500\`

// ✅ Good
const COLOR_MAP = { red: 'bg-red-500', blue: 'bg-blue-500' }
const className = COLOR_MAP[color]`}</CodePre>

          <h3>Custom colors aren't generating utilities</h3>
          <p>v3: check <code>theme.extend.colors</code> structure (nested objects → dash-separated names). v4: check <code>--color-*</code> prefix; <code>--my-color</code> won't generate <code>bg-my-color</code>.</p>

          <h3>twMerge keeps both conflicting classes</h3>
          <p>Custom utilities (e.g. <code>bg-brand</code>) need to be registered with tailwind-merge OR added via <code>@theme</code> so the library understands them. The simpler fix: stick to standard utilities for component bases, accept arbitrary overrides via className.</p>

          <h3>v3 → v4 migration: <code>@apply</code> stopped working in component CSS</h3>
          <p>v4's <code>@apply</code> rules changed slightly. You can still use it; the directive needs to be in an actual CSS file imported after <code>@import 'tailwindcss'</code>.</p>

          <h3>Tailwind classes work in dev but not in prod</h3>
          <p>Production build's tree-shake is stricter. If a class only appears in a string template or eval'd code, prod might drop it. Add explicit references (safelist or static class table).</p>

          <h3>Theme variables aren't available in regular CSS</h3>
          <p>v4: <code>@theme</code> tokens become CSS variables on <code>:root</code>. Use them: <code>color: var(--color-rust)</code>. If you don't see them, your CSS file isn't being processed by Tailwind.</p>

          <h3>"Unknown at-rule @theme"</h3>
          <p>v4 only. Your editor's CSS linting doesn't know about it — that's cosmetic. The build works. To silence the warning, configure your editor or use <code>/* prettier-ignore */</code>.</p>

          <h3>v4 dropped my IE support</h3>
          <p>Stay on v3, or write a manual postcss-cssnano + autoprefixer config to backport. Most fleet apps don't support IE; this isn't an issue.</p>

          <h3>Hot-reload doesn't pick up class additions</h3>
          <p>Restart the dev server. Tailwind's incremental compile occasionally gets out of sync with new class names; full restart fixes it.</p>

          <h3>v3 + v4 in the same monorepo</h3>
          <p>Each app's <code>node_modules</code> gets its own version. Just keep them in their own directories. The CSS files don't conflict.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>v3 — install + config</h3>
          <CodePre>{`npm i -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: { colors: { rust: '#5C2A4A' } } },
  plugins: [],
}

// postcss.config.js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }

/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;`}</CodePre>

          <h3>v4 — install + config</h3>
          <CodePre>{`npm i -D tailwindcss @tailwindcss/vite     # for Vite
# OR
npm i -D tailwindcss @tailwindcss/postcss   # for PostCSS / Next.js

// vite.config.ts (Vite)
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })

// postcss.config.js (PostCSS)
export default { plugins: { '@tailwindcss/postcss': {} } }

/* src/index.css */
@import 'tailwindcss';

@theme {
  --color-rust: #5C2A4A;
}`}</CodePre>

          <h3>The cn() utility</h3>
          <CodePre>{`import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}</CodePre>

          <h3>v4 @theme namespaces</h3>
          <CodePre>{`@theme {
  --color-*:      /* bg-X, text-X, border-X, ring-X */
  --font-*:       /* font-X (font-family) */
  --text-*:       /* text-X (font-size pair) */
  --font-weight-*:
  --tracking-*:   /* letter-spacing */
  --leading-*:    /* line-height */
  --breakpoint-*: /* responsive variants */
  --container-*:  /* container query variants */
  --spacing-*:    /* p, m, w, h, gap */
  --radius-*:     /* rounded- */
  --shadow-*:     /* shadow- */
  --animate-*:    /* animate- (with @keyframes) */
}`}</CodePre>

          <h3>v4 — custom utility + variant</h3>
          <CodePre>{`@utility text-shadow {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

@custom-variant hocus {
  &:hover, &:focus { @slot; }
}`}</CodePre>

          <h3>cva pattern</h3>
          <CodePre>{`const buttonVariants = cva('px-4 py-2 rounded', {
  variants: {
    variant: { primary: 'bg-rust text-cream', secondary: 'bg-cream border' },
    size:    { sm: 'text-sm', md: 'text-base', lg: 'text-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>v3 config with warm palette</td><td>GLP1 · <code>tailwind.config.js</code></td></tr>
              <tr><td>v3 config — minimal</td><td>Puzzlebox · <code>tailwind.config.js</code></td></tr>
              <tr><td>v4 + Vite plugin</td><td>workshop · <code>vite.config.ts</code></td></tr>
              <tr><td>v4 @theme block with warm palette</td><td>workshop · <code>src/index.css</code></td></tr>
              <tr><td>v4 @theme inline + two-layer</td><td>PulseWire · <code>src/app/globals.css</code></td></tr>
              <tr><td>v4 + PostCSS plugin</td><td>SecretApp · <code>postcss.config.js</code> · PulseWire · <code>postcss.config.mjs</code></td></tr>
              <tr><td>cn() utility</td><td>PulseWire · <code>src/lib/utils.ts</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: MUI 7 + Emotion.</p>
        </section>
      </main>
    </div>
  );
}
