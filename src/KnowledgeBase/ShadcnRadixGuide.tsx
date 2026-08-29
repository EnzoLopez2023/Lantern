import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Tailwind v4 + @theme',             icon: '🎨' },
  { id: 's3',  num: '3',  title: 'The cn() Utility',                 icon: '🔗' },
  { id: 's4',  num: '4',  title: 'class-variance-authority',         icon: '🏷️' },
  { id: 's5',  num: '5',  title: 'Radix Primitives',                 icon: '🧱' },
  { id: 's6',  num: '6',  title: 'shadcn — Copy, Not Install',       icon: '📋' },
  { id: 's7',  num: '7',  title: 'components.json + the CLI',        icon: '⚙️' },
  { id: 's8',  num: '8',  title: 'Composing UI Primitives',          icon: '🧩' },
  { id: 's9',  num: '9',  title: 'Theming via CSS Variables',        icon: '🌈' },
  { id: 's10', num: '10', title: 'Comparison: MUI vs shadcn',        icon: '⚖️' },
  { id: 's11', num: '★',  title: 'Lab: Build a Component Lib',       icon: '🛠️' },
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

export default function ShadcnRadixGuide() {
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
            <span className="sidebar-title">shadcn + Radix + cva</span>
          </div>
          <div className="sidebar-sub">PulseWire UI stack</div>
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
          <div className="hero-tag">🧱 shadcn/ui + Radix + cva · Tailwind v4 · 2026</div>
          <h1>shadcn/ui + Radix UI + cva<br />(PulseWire UI stack)</h1>
          <p>
            PulseWire's UI is the fleet's most "modern web" stack — <strong style={{ color: '#C77AA0' }}>shadcn/ui
            components copied into the repo, Radix UI primitives underneath, cva for variants, Tailwind v4 with
            @theme CSS variables, the cn() utility tying it all together</strong>. This guide walks each layer of that
            stack with PulseWire's real code, contrasts with MUI (used by the other fleet apps), and ends with a lab
            that builds the equivalent of shadcn's Button from scratch.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">1/8</span><span className="hero-stat-label">Apps on shadcn</span></div>
            <div className="hero-stat"><span className="hero-stat-val">7</span><span className="hero-stat-label">cn() LOC</span></div>
            <div className="hero-stat"><span className="hero-stat-val">v4</span><span className="hero-stat-label">Tailwind</span></div>
            <div className="hero-stat"><span className="hero-stat-val">Copy</span><span className="hero-stat-label">Not install</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            shadcn/ui is "components you OWN." Where MUI ships a fixed component library you import from
            <code>@mui/material</code>, shadcn ships a <em>CLI that copies component source code into your repo</em>.
            You modify it however you want. There's no upgrade path — there's just your code.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>MUI is a furniture store; shadcn is the lumber yard.</strong> MUI: walk in, pick a chair, take it
            home assembled. shadcn: walk in, grab the boards + the assembly instructions, build the chair in your
            workshop. The lumber yard hands you a great starting point — you finish (or don't) the upholstery.
          </p>
          <p>
            <strong>The component library spectrum.</strong> Bootstrap (1990s): pre-styled everything. MUI / Mantine:
            pre-styled, theme-able. Radix UI: unstyled, behavior-only. shadcn/ui: styled wrappers around Radix you can
            edit. cva: variant system. Pick the spot on the spectrum that matches your control needs.
          </p>
          <p>
            <strong>"Headless UI" vs "shadcn-style."</strong> Radix UI is headless — it gives you the
            <code>{`<Dialog.Root>`}</code>, <code>{`<Dialog.Trigger>`}</code>, <code>{`<Dialog.Content>`}</code>
            primitives with full keyboard + ARIA behavior but no visual styling. You compose them with your own
            Tailwind. shadcn is "we composed them with Tailwind for you; here's the file — change it."
          </p>

          <h3>The five-layer stack</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  R[Radix UI primitives<br/>headless, accessible behavior]
  R --> S[shadcn/ui components<br/>copied source — yours to edit]
  S --> CVA[cva variants<br/>typed variant system]
  CVA --> CN[cn utility<br/>clsx + tailwind-merge]
  CN --> T[Tailwind v4<br/>with @theme CSS vars]
  T --> A[Your app]`} />

          <h3>What lives where</h3>
          <table>
            <tbody>
              <tr><th>Layer</th><th>Provided by</th><th>Customizable?</th></tr>
              <tr><td>ARIA + keyboard behavior</td><td>Radix UI (npm)</td><td>Behaviorally no; you wire your own UI around it</td></tr>
              <tr><td>Default styled components</td><td>shadcn CLI (copies into <code>components/ui/</code>)</td><td>Fully — they're YOUR files now</td></tr>
              <tr><td>Variant systems</td><td>cva (npm)</td><td>You define the variants</td></tr>
              <tr><td>Class merging</td><td>clsx + tailwind-merge (npm)</td><td>Composed via <code>cn()</code></td></tr>
              <tr><td>Tokens (colors, spacing)</td><td>Tailwind v4 @theme CSS vars</td><td>Yes — edit globals.css</td></tr>
            </tbody>
          </table>

          <h3>Why PulseWire picked this</h3>
          <ul>
            <li><strong>Dark-glass aesthetic.</strong> PulseWire wants a custom "premium reader" look; MUI's Material aesthetic is wrong for that.</li>
            <li><strong>Next.js + RSC compat.</strong> Radix is RSC-friendly (small client island per primitive); MUI's full theme-provider in RSC is awkward.</li>
            <li><strong>Tailwind v4 already in stack.</strong> Adding MUI on top would mean two styling systems.</li>
            <li><strong>Editable source.</strong> The "fix the off-by-1px in production" muscle is friction-free when the source is in your repo.</li>
          </ul>

          <h3>Why the other fleet apps DIDN'T</h3>
          <p>Hearth, Cairn, ShopKeep, Tabloom all picked MUI 7. Reasons:</p>
          <ul>
            <li>They started years before shadcn was popular.</li>
            <li>MUI's Material aesthetic suits "personal app" UIs (recipe forms, inventory tables, dashboard tiles).</li>
            <li>MUI's table / DataGrid / DatePicker work out of the box; shadcn ships the building blocks but not those compound widgets.</li>
            <li>MUI is mature for a11y. Radix is mature too; the gap is smaller than it used to be.</li>
          </ul>

          <p>Neither pick is wrong. PulseWire's custom-dark-glass design needs shadcn's flexibility; Hearth's warm-artisan-with-cards design benefits from MUI's polish.</p>
        </section>

        <hr />

        {/* SECTION 2 — TAILWIND V4 */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Tailwind v4 + @theme</h2>
          <p>
            Tailwind v4 (released late 2024) moved from JS config (<code>tailwind.config.js</code>) to CSS-first config:
            you declare your design tokens in CSS, inside an <code>@theme</code> block, and Tailwind auto-generates the
            utility classes that reference them.
          </p>

          <h3>PulseWire's full globals.css</h3>
          <CodePre>{`/* PulseWire/src/app/globals.css — verbatim */
@import "tailwindcss";

:root {
  --background: #0b1020;
  --surface: #121826;
  --foreground: #ffffff;
  --muted: #94a3b8;
  --accent-cyan: #00e5ff;
  --accent-violet: #7c3aed;
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-accent-cyan: var(--accent-cyan);
  --color-accent-violet: var(--accent-violet);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}`}</CodePre>

          <h3>What @theme does</h3>
          <p>
            <code>@theme inline</code> tells Tailwind: "these CSS variables ARE my theme tokens. Generate utilities that
            reference them." The result: <code>bg-background</code>, <code>text-foreground</code>,
            <code>border-accent-cyan</code> all resolve to <code>var(--color-background)</code>,
            <code>var(--color-foreground)</code>, <code>var(--color-accent-cyan)</code>.
          </p>

          <h3>The CSS-variable indirection</h3>
          <p>
            PulseWire splits tokens into <em>raw values</em> (in <code>:root</code>) + <em>semantic mappings</em> (in
            <code>@theme</code>). The benefit: you can later add a dark/light theme by swapping the raw values, while
            the semantic names stay constant:
          </p>
          <CodePre>{`/* Future: light mode */
@media (prefers-color-scheme: light) {
  :root {
    --background: #ffffff;
    --foreground: #0b1020;
    /* ... etc ... */
  }
}
/* @theme block stays unchanged — semantic names track the raw values */`}</CodePre>

          <h3>Other @theme entries</h3>
          <p>Beyond <code>--color-*</code>, you can declare any token namespace Tailwind knows:</p>
          <CodePre>{`@theme {
  --color-primary: #...;          /* utility: bg-primary, text-primary, ... */
  --font-display: "Playfair";     /* utility: font-display */
  --spacing-128: 32rem;           /* utility: p-128, m-128, ... */
  --radius-2xl: 1rem;             /* utility: rounded-2xl */
  --animate-fade: fadeIn .2s;     /* utility: animate-fade */
  --breakpoint-3xl: 1920px;       /* utility: 3xl:flex */
}`}</CodePre>

          <h3>The v3 → v4 mental shift</h3>
          <table>
            <tbody>
              <tr><th>Tailwind v3</th><th>Tailwind v4</th></tr>
              <tr><td><code>tailwind.config.js</code> with JS theme object</td><td><code>globals.css</code> with <code>@theme</code> block</td></tr>
              <tr><td><code>content: ['./src/**/*.{`{tsx,ts}`}']</code></td><td>Auto-detected via filesystem scan</td></tr>
              <tr><td><code>require('tailwindcss/plugin')</code></td><td><code>@plugin "name"</code> in CSS</td></tr>
              <tr><td><code>theme.extend.colors.foo = '#...'</code></td><td><code>--color-foo: #...;</code> in <code>@theme</code></td></tr>
              <tr><td>PostCSS config required</td><td>Optional; <code>@tailwindcss/vite</code> or <code>@tailwindcss/postcss</code></td></tr>
            </tbody>
          </table>

          <h3>The PostCSS integration</h3>
          <CodePre>{`// PulseWire/postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}`}</CodePre>

          <p>That's the entire PostCSS config. The plugin processes <code>@import "tailwindcss"</code> + <code>@theme</code> directives.</p>

          <h3>Why CSS-first matters</h3>
          <ul>
            <li><strong>One source of truth.</strong> Designers edit CSS variables directly without touching JS config.</li>
            <li><strong>Live theme swap.</strong> Toggle dark mode by changing CSS vars at runtime; Tailwind utilities follow.</li>
            <li><strong>SSR/RSC-friendly.</strong> No JS config evaluation at build time means cleaner Server Component behavior.</li>
            <li><strong>Smaller config surface.</strong> Less JS to typecheck, less plugin glue.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 3 — CN UTILITY */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The <code>cn()</code> Utility — clsx + tailwind-merge</h2>
          <p>The seven most useful lines of code in any Tailwind project. Composes conditional classes AND resolves Tailwind conflicts intelligently.</p>

          <h3>The full file</h3>
          <CodePre>{`// PulseWire/src/lib/utils.ts — verbatim
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}</CodePre>

          <h3>What each layer does</h3>
          <table>
            <tbody>
              <tr><th>Function</th><th>What it does</th></tr>
              <tr><td><code>clsx</code></td><td>Conditional joining: <code>clsx('p-2', isError && 'bg-red-500')</code> → <code>"p-2 bg-red-500"</code> if isError, else <code>"p-2"</code></td></tr>
              <tr><td><code>twMerge</code></td><td>Resolve Tailwind conflicts: <code>twMerge('p-2 p-4')</code> → <code>"p-4"</code> (later wins). Knows that <code>p-2</code> and <code>p-4</code> conflict.</td></tr>
              <tr><td><code>cn</code></td><td>Composes both: take any clsx-shaped input, conflict-resolve the result.</td></tr>
            </tbody>
          </table>

          <h3>The killer use case</h3>
          <CodePre>{`// A component accepts custom classes from the consumer:
function Button({ className, ...props }: { className?: string }) {
  return (
    <button
      className={cn(
        'px-4 py-2 bg-blue-500 text-white rounded',   // default styles
        className                                       // consumer override
      )}
      {...props}
    />
  )
}

// Consumer does:
<Button className="bg-red-500">Red Button</Button>

// cn() resolves:
// 'px-4 py-2 bg-blue-500 text-white rounded' + 'bg-red-500'
// → 'px-4 py-2 text-white rounded bg-red-500'
// (bg-red-500 wins because it came later AND tailwind-merge knows they conflict)`}</CodePre>

          <p>Without <code>twMerge</code>, both <code>bg-blue-500</code> AND <code>bg-red-500</code> would land in the className string. Browsers apply the LAST one in the CSS file (not the className string), which is whichever the bundler put later. Result: unpredictable. <code>twMerge</code> fixes this by knowing about Tailwind's class semantics and keeping only the winner.</p>

          <h3>The conflict groups twMerge knows</h3>
          <p>twMerge ships with a built-in map of conflict groups. Examples:</p>
          <ul>
            <li><code>p-*</code> conflicts with <code>p-*</code> (later wins).</li>
            <li><code>px-*</code> conflicts with <code>p-*</code>.</li>
            <li><code>bg-red-500</code> conflicts with <code>bg-blue-500</code> but NOT <code>bg-opacity-50</code>.</li>
            <li><code>text-lg</code> conflicts with <code>text-sm</code> but NOT <code>text-red-500</code>.</li>
          </ul>

          <p>It does this with full understanding of Tailwind's grammar. Custom utilities (defined in <code>@theme</code>) are also resolved correctly.</p>

          <h3>The typescript-friendly inputs</h3>
          <CodePre>{`cn('a', 'b')                          // strings
cn('a', isError && 'b')               // strings + booleans
cn('a', { 'b': isError })             // object form
cn('a', ['b', 'c'])                   // array form
cn('a', cn('b', 'c'))                 // nested cn() calls

// ALL produce the same: 'a b c' (or 'a' if isError is false)`}</CodePre>

          <h3>Why both clsx AND tailwind-merge</h3>
          <p>You could write either alone and it'd "work":</p>
          <ul>
            <li><strong>clsx alone</strong>: handles conditionals but leaves conflicts in the output.</li>
            <li><strong>twMerge alone</strong>: handles conflicts but doesn't accept booleans/objects/arrays.</li>
            <li><strong>cn</strong>: both. Compose with clsx (rich input), then resolve with twMerge (clean output).</li>
          </ul>

          <h3>Performance</h3>
          <p>Both clsx and tailwind-merge are sub-microsecond for typical inputs. The cost is negligible vs the readability + safety win. PulseWire calls <code>cn()</code> tens of thousands of times per page render with no perf concern.</p>
        </section>

        <hr />

        {/* SECTION 4 — CVA */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>class-variance-authority (cva)</h2>
          <p>
            A typed variant system for component classNames. You define the styles for each variant + size + state, and
            cva returns a function that takes the props and returns the right combined className. It's like a switch
            statement for Tailwind — but typed and ergonomic.
          </p>

          <h3>The shape</h3>
          <CodePre>{`import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  // 1. Base styles — always applied
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    // 2. Variants — one prop per axis
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:     'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost:       'hover:bg-accent hover:text-accent-foreground',
        link:        'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm:      'h-9 px-3',
        lg:      'h-11 px-8',
        icon:    'h-10 w-10',
      },
    },
    // 3. Compound variants — combinations
    compoundVariants: [
      // e.g. ghost + sm gets a different padding
      // { variant: 'ghost', size: 'sm', className: 'px-2' }
    ],
    // 4. Default variants — used when prop is omitted
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)`}</CodePre>

          <h3>Using it in a component</h3>
          <CodePre>{`type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}`}</CodePre>

          <h3>Consumer usage</h3>
          <CodePre>{`<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon"><XIcon /></Button>
<Button variant="link" className="text-red-500">Override</Button>   {/* className passes through */}`}</CodePre>

          <h3>The typed payoff</h3>
          <CodePre>{`<Button variant="defualt" />     {/* ❌ TS error: typo in 'default' */}
<Button variant="unknown" />     {/* ❌ TS error: not a valid variant */}
<Button size="huge" />           {/* ❌ TS error: not a valid size */}
<Button variant="default" />     {/* ✅ */}`}</CodePre>

          <p><code>VariantProps&lt;typeof buttonVariants&gt;</code> infers exactly which strings are valid for each prop. Refactor a variant name and TS flags every call site.</p>

          <h3>The conflict resolution</h3>
          <p>cva's output is one string of Tailwind utilities — but it can contain conflicts (e.g. the base has <code>p-2</code> and the variant adds <code>p-4</code>). Passing through <code>cn()</code> at the end resolves them:</p>
          <CodePre>{`cn(buttonVariants({ variant, size, className }))
//      ↑ produces 'inline-flex ... h-10 px-4 py-2 bg-primary ...'
//      ↑ plus the consumer's className (which can override)
// twMerge inside cn() resolves any conflicts.`}</CodePre>

          <h3>Why cva instead of CSS-in-JS</h3>
          <table>
            <tbody>
              <tr><th>Approach</th><th>Trade-off</th></tr>
              <tr><td>CSS-in-JS (styled-components, Emotion)</td><td>Powerful, but ships a runtime JS framework. Slower paint.</td></tr>
              <tr><td>BEM with hand-written CSS</td><td>No runtime, but verbose + manual.</td></tr>
              <tr><td>cva + Tailwind</td><td>No runtime (just string concat), typed, ergonomic.</td></tr>
            </tbody>
          </table>

          <h3>When you outgrow cva</h3>
          <p>cva is great for component-level variants. For app-wide theming with multiple themes (light/dark/high-contrast), pair it with CSS variables (§9). For animations and state machines, reach for Framer Motion + Radix's built-in state APIs.</p>
        </section>

        <hr />

        {/* SECTION 5 — RADIX */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Radix UI Primitives</h2>
          <p>The "headless" component library that does all the hard parts — focus management, keyboard navigation, ARIA, portal rendering, controlled/uncontrolled state — and leaves the visual styling to you.</p>

          <h3>What Radix provides</h3>
          <p>~30 primitives covering every common compound widget:</p>
          <ul>
            <li><strong>Dialog</strong>, <strong>AlertDialog</strong> — modals with focus trap</li>
            <li><strong>DropdownMenu</strong>, <strong>ContextMenu</strong>, <strong>Menubar</strong> — keyboard-nav menus</li>
            <li><strong>Tooltip</strong>, <strong>HoverCard</strong> — positioned popovers</li>
            <li><strong>Popover</strong>, <strong>Select</strong>, <strong>Combobox</strong> — overlay inputs</li>
            <li><strong>Tabs</strong>, <strong>Accordion</strong>, <strong>Collapsible</strong> — disclosure widgets</li>
            <li><strong>RadioGroup</strong>, <strong>Checkbox</strong>, <strong>Switch</strong> — form controls</li>
            <li><strong>Toast</strong>, <strong>Slider</strong>, <strong>Progress</strong>, <strong>Avatar</strong> — and more</li>
          </ul>

          <h3>The compound-component pattern</h3>
          <CodePre>{`import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>Open</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed inset-0 m-auto h-fit w-96 bg-white p-6 rounded">
      <Dialog.Title>Confirm</Dialog.Title>
      <Dialog.Description>Are you sure?</Dialog.Description>
      <Dialog.Close asChild>
        <button>Cancel</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`}</CodePre>

          <p>Radix provides the parts (<code>Root</code>, <code>Trigger</code>, <code>Content</code>, <code>Title</code>, <code>Close</code>). You compose them with your styling. Radix wires up focus, keyboard (Esc closes), ARIA (role="dialog", aria-modal), portal rendering, and the open/close state machine.</p>

          <h3>The <code>asChild</code> prop</h3>
          <p>Most Radix primitives accept <code>asChild</code>. When set, Radix doesn't render its own DOM element — it merges its behavior onto whatever child you pass:</p>
          <CodePre>{`<Dialog.Trigger asChild>
  <button>Open</button>           {/* ← <button> with Dialog.Trigger behavior, not nested */}
</Dialog.Trigger>

<Dialog.Trigger>
  Open                            {/* ← Radix renders a <button> for you with text inside */}
</Dialog.Trigger>`}</CodePre>

          <p>asChild lets you bring your OWN styled component (e.g. shadcn's Button) and have Radix attach behavior to it. The two play together cleanly.</p>

          <h3>What Radix gets you for free</h3>
          <table>
            <tbody>
              <tr><th>Without Radix (hand-rolled Dialog)</th><th>With Radix</th></tr>
              <tr><td>Focus trap when modal opens</td><td>Built-in</td></tr>
              <tr><td>Restore focus to trigger on close</td><td>Built-in</td></tr>
              <tr><td>Esc key closes the dialog</td><td>Built-in</td></tr>
              <tr><td>Click outside closes</td><td>Built-in (configurable)</td></tr>
              <tr><td>Body scroll lock</td><td>Built-in</td></tr>
              <tr><td>Portal render outside React tree</td><td>Built-in via <code>Dialog.Portal</code></td></tr>
              <tr><td>aria-modal, aria-labelledby</td><td>Built-in</td></tr>
              <tr><td>Animated unmount</td><td>data-state="closed" attribute → CSS transition</td></tr>
            </tbody>
          </table>

          <p>Hand-rolling these correctly across every browser is a weeks-long project. Radix nails them once for everyone.</p>

          <h3>Radix's state attributes</h3>
          <CodePre>{`<Dialog.Content data-state="open">    {/* or "closed" */}
  ...
</Dialog.Content>

/* Style with Tailwind's data attribute selectors: */
className="
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0
  data-[state=open]:fade-in-0
"`}</CodePre>

          <p>The animations come from <code>tw-animate-css</code> (a Tailwind plugin shadcn uses). Radix toggles the <code>data-state</code>; Tailwind matches it.</p>

          <h3>Server Component compatibility</h3>
          <p>Radix is a client library — its primitives use <code>useState</code>, <code>useEffect</code>, etc. To use in Next.js App Router, mark the wrapper component <code>"use client"</code>. shadcn's generated wrappers do this for you (you'll see <code>"use client"</code> at the top of each component file in <code>src/components/ui/</code>).</p>
        </section>

        <hr />

        {/* SECTION 6 — SHADCN COPY */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>shadcn/ui — Copy, Not Install</h2>
          <p>
            The defining shadcn idea: there is no <code>@shadcn/ui</code> npm package. Instead, you run a CLI that
            <em>copies</em> the source code of components into <code>src/components/ui/</code>. From that point, those
            files are yours — to edit, refactor, throw away, whatever.
          </p>

          <h3>Why copy instead of npm</h3>
          <table>
            <tbody>
              <tr><th>Install (npm package)</th><th>Copy (shadcn)</th></tr>
              <tr><td>Easy to upgrade</td><td>Manual diff/merge for upgrades</td></tr>
              <tr><td>Can't deeply customize without forking</td><td>Customize freely; it's your file</td></tr>
              <tr><td>API surface = library's choice</td><td>API surface = whatever you want</td></tr>
              <tr><td>Bundle ships full library</td><td>Bundle ships only what you use</td></tr>
              <tr><td>Bug fix = wait for new release</td><td>Bug fix = edit + commit</td></tr>
              <tr><td>Theme is whatever library exposes</td><td>Theme is whatever you write</td></tr>
            </tbody>
          </table>

          <h3>The CLI in action</h3>
          <CodePre>{`# Initialize shadcn in a project (once)
npx shadcn@latest init

# Add components as needed
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add card

# Each command copies the component into src/components/ui/<name>.tsx`}</CodePre>

          <h3>What gets copied</h3>
          <p>Running <code>npx shadcn add button</code> drops a file like this into <code>src/components/ui/button.tsx</code>:</p>
          <CodePre>{`'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium ...',
  {
    variants: {
      variant: { default: 'bg-primary ...', destructive: '...', /* ... */ },
      size:    { default: 'h-10 px-4 py-2', sm: '...', lg: '...', icon: '...' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }`}</CodePre>

          <p>That file is yours. Need a new variant? Add to the <code>variant</code> object. Want different defaults? Change them. Want to refactor the API? Refactor. No PR upstream needed.</p>

          <h3>The upgrade story</h3>
          <p>shadcn's CLI has a <code>diff</code> command that shows what's changed upstream since you copied. You can selectively accept updates:</p>
          <CodePre>{`npx shadcn@latest diff
# Shows: button.tsx upstream now has X, your local has Y
# You decide whether to take the upstream change.`}</CodePre>

          <p>In practice, fleet apps copy once and rarely chase upstream. The components are stable; bug fixes are local.</p>

          <h3>What shadcn ships</h3>
          <p>The CLI catalog covers ~40 components. The common ones:</p>
          <ul>
            <li><strong>Inputs</strong>: Button, Input, Textarea, Label, Checkbox, RadioGroup, Switch, Select, Combobox, DatePicker</li>
            <li><strong>Overlays</strong>: Dialog, AlertDialog, Sheet, Popover, Tooltip, HoverCard, ContextMenu, DropdownMenu, Command</li>
            <li><strong>Display</strong>: Card, Badge, Avatar, Separator, Skeleton, Toast, Alert, Table</li>
            <li><strong>Navigation</strong>: NavigationMenu, Breadcrumb, Tabs, Accordion, Collapsible</li>
            <li><strong>Misc</strong>: Pagination, Progress, ScrollArea, Slider, Toggle, Sonner</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 7 — COMPONENTS.JSON */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span><code>components.json</code> + the CLI</h2>
          <p>One config file at the repo root tells the shadcn CLI where to copy components, which style preset to use, and how to resolve import paths.</p>

          <h3>PulseWire's full components.json</h3>
          <CodePre>{`// PulseWire/components.json — verbatim
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}`}</CodePre>

          <h3>Each field decoded</h3>
          <table>
            <tbody>
              <tr><th>Field</th><th>Meaning</th></tr>
              <tr><td><code>style</code></td><td>The visual preset. <code>radix-nova</code> is the dark-glass aesthetic; <code>default</code> is the classic shadcn look</td></tr>
              <tr><td><code>rsc</code></td><td>Generate components compatible with React Server Components (the <code>"use client"</code> directive lives in each file's header)</td></tr>
              <tr><td><code>tsx</code></td><td>TypeScript output (vs <code>.jsx</code>)</td></tr>
              <tr><td><code>tailwind.config</code></td><td>Empty in v4 (no JS config); was the path to <code>tailwind.config.js</code> in v3</td></tr>
              <tr><td><code>tailwind.css</code></td><td>Where the global Tailwind import lives (also where shadcn injects CSS vars on init)</td></tr>
              <tr><td><code>tailwind.baseColor</code></td><td>The grayscale palette: neutral / zinc / slate / stone / gray</td></tr>
              <tr><td><code>tailwind.cssVariables</code></td><td>Use CSS vars (modern) vs hardcoded Tailwind classes (legacy)</td></tr>
              <tr><td><code>iconLibrary</code></td><td>Default icons: lucide / radix</td></tr>
              <tr><td><code>aliases.components</code></td><td>Where new components are copied (relative to the configured TS path alias)</td></tr>
              <tr><td><code>aliases.utils</code></td><td>Where the <code>cn()</code> utility lives (CLI looks here to import)</td></tr>
              <tr><td><code>aliases.ui</code></td><td>Where shadcn-specific components (Button, Dialog, etc.) go</td></tr>
            </tbody>
          </table>

          <h3>The <code>@/</code> alias</h3>
          <p>The CLI emits imports like <code>{"import { cn } from '@/lib/utils'"}</code>. That requires your <code>tsconfig.json</code> + bundler to resolve <code>@/*</code> → <code>./src/*</code>:</p>
          <CodePre>{`// tsconfig.json (PulseWire's)
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}`}</CodePre>

          <p>Next.js handles <code>@/</code> transparently. For Vite, add to <code>vite.config.ts</code>:</p>
          <CodePre>{`import path from 'path'
// ...
resolve: { alias: { '@': path.resolve(__dirname, './src') } },`}</CodePre>

          <h3>Adding a component</h3>
          <CodePre>{`# Single component
npx shadcn@latest add button

# Multiple
npx shadcn@latest add button dialog input card

# A "block" (a pre-composed multi-component pattern)
npx shadcn@latest add login-01`}</CodePre>

          <p>The CLI:</p>
          <ol>
            <li>Reads <code>components.json</code> for the alias paths + style.</li>
            <li>Fetches the component source from shadcn's registry (https://ui.shadcn.com).</li>
            <li>Resolves the dependencies (Radix packages, lucide-react, etc.) and offers to install.</li>
            <li>Copies the source to <code>src/components/ui/button.tsx</code>.</li>
            <li>(Init only) injects CSS variables into <code>globals.css</code>.</li>
          </ol>

          <h3>Custom registries</h3>
          <p>The <code>registries</code> field lets you point at YOUR own component catalog. Useful for internal design systems: publish your shared components to a registry, then any app in the org runs <code>npx shadcn add my-internal/datepicker</code>.</p>
        </section>

        <hr />

        {/* SECTION 8 — COMPOSING */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Composing UI Primitives — Real PulseWire</h2>
          <p>PulseWire mixes shadcn-generated primitives with hand-rolled Tailwind components. The pattern: use shadcn for anything with state machinery (Dialog, DropdownMenu); roll plain Tailwind for purely-presentational pieces.</p>

          <h3>A hand-rolled component (uses Tailwind directly)</h3>
          <CodePre>{`// PulseWire/src/components/TopBar.tsx — verbatim
'use client'

type TopBarProps = {
  user: { name: string; email: string }
  onMenuClick?: () => void
  onBackClick?:  () => void
}

export function TopBar({ user, onMenuClick, onBackClick }: TopBarProps) {
  const initials =
    user.name
      .split(/\\s+/)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2) || '?'

  return (
    <header className="flex h-14 items-center gap-2 border-b border-white/5 bg-surface/40 px-3 lg:px-6">
      {onBackClick ? (
        <button
          type="button"
          aria-label="Back"
          onClick={onBackClick}
          className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/5 bg-surface/40 text-foreground hover:border-accent-cyan/40 lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      ) : null}
      {/* ... rest of header ... */}
    </header>
  )
}`}</CodePre>

          <p>Notice: NO shadcn components, just <code>{`<header>`}</code> + <code>{`<button>`}</code> with Tailwind classes. PulseWire's design here didn't need the shadcn Button's variant system — a hand-styled button is simpler.</p>

          <h3>A small Client Component using inline Tailwind</h3>
          <CodePre>{`// PulseWire/src/app/app/saved/DeleteButton.tsx — verbatim
'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { deleteSavedAction } from './actions'

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!confirm("Delete this snapshot? This can't be undone.")) return
        startTransition(async () => {
          await deleteSavedAction(id)
          router.push('/app/saved')
        })
      }}
      className="rounded border border-white/10 px-2 py-0.5 text-muted transition-colors hover:border-red-500/50 hover:text-red-300"
    >
      {isPending ? 'deleting…' : 'delete'}
    </button>
  )
}`}</CodePre>

          <h3>When to use shadcn's Button vs raw <code>&lt;button&gt;</code></h3>
          <table>
            <tbody>
              <tr><th>Use shadcn Button</th><th>Use raw &lt;button&gt;</th></tr>
              <tr><td>Repeating button styles across many places</td><td>One-off button in a unique design</td></tr>
              <tr><td>Need variants (default/destructive/outline/ghost)</td><td>Just one style needed</td></tr>
              <tr><td>Want consistent focus + disabled + hover behavior</td><td>Custom hover/focus that doesn't match shadcn's</td></tr>
              <tr><td>Need <code>asChild</code> composition with Radix</td><td>No composition needed</td></tr>
              <tr><td>Team-wide design system</td><td>Personal-app polish</td></tr>
            </tbody>
          </table>

          <p>PulseWire's pattern: shadcn for anything compound (Dialog, DropdownMenu, Sheet) and hand-rolled for everything one-off (TopBar, DeleteButton, ArticleCard internals). The shadcn-generated components live in <code>src/components/ui/</code>; the app components live in <code>src/components/</code>.</p>

          <h3>The shadcn + Tailwind hybrid pattern</h3>
          <CodePre>{`'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function ShareDialog({ articleId }: { articleId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <ShareIcon size={14} /> Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this article</DialogTitle>
        </DialogHeader>
        {/* Hand-rolled body content */}
        <div className="flex flex-col gap-3">
          <input
            readOnly
            value={\`https://pulsewire.example.com/share/\${articleId}\`}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
          <Button onClick={copyLink}>Copy link</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}`}</CodePre>

          <p>Dialog + Button come from shadcn (state machinery + variants). The inner <code>{`<input>`}</code> + layout div are hand-styled with Tailwind. This is the typical mix.</p>
        </section>

        <hr />

        {/* SECTION 9 — THEMING */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Theming via CSS Variables</h2>
          <p>Combining shadcn + Tailwind v4 makes theming a one-line swap. The components reference semantic class names (<code>bg-primary</code>, <code>text-foreground</code>); the theme defines what those map to via CSS variables.</p>

          <h3>The two-layer pattern</h3>
          <p>PulseWire's <code>globals.css</code> already showed this (§2). Recap:</p>
          <CodePre>{`/* Raw values */
:root {
  --background:    #0b1020;
  --foreground:    #ffffff;
  --accent-cyan:   #00e5ff;
  --accent-violet: #7c3aed;
}

/* Semantic mappings */
@theme inline {
  --color-background:    var(--background);
  --color-foreground:    var(--foreground);
  --color-accent-cyan:   var(--accent-cyan);
  --color-accent-violet: var(--accent-violet);
}`}</CodePre>

          <h3>Light/dark theme swap</h3>
          <CodePre>{`/* Default (dark) */
:root {
  --background: #0b1020;
  --foreground: #ffffff;
  /* ... */
}

/* Light variant */
@media (prefers-color-scheme: light) {
  :root {
    --background: #ffffff;
    --foreground: #0b1020;
    /* ... */
  }
}

/* Or class-based */
.dark {
  --background: #0b1020;
  --foreground: #ffffff;
}

.light {
  --background: #ffffff;
  --foreground: #0b1020;
}`}</CodePre>

          <p>shadcn's components reference <code>bg-background text-foreground</code>; flipping <code>.dark</code> ↔ <code>.light</code> on the <code>&lt;html&gt;</code> element switches the whole UI without re-rendering React.</p>

          <h3>The next-themes integration</h3>
          <CodePre>{`npm i next-themes`}</CodePre>

          <CodePre>{`// src/components/theme-provider.tsx
'use client'
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}

// src/app/layout.tsx (Server Component)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  )
}`}</CodePre>

          <p>next-themes manages the <code>.dark</code> / <code>.light</code> class on <code>&lt;html&gt;</code> + persists the user's choice to localStorage + listens for <code>prefers-color-scheme</code>. SSR-safe (<code>suppressHydrationWarning</code> + the matching script injected into <code>&lt;head&gt;</code>).</p>

          <h3>The PulseWire shape</h3>
          <p>PulseWire is dark-only — no theme toggle. The CSS-var pattern is in place if/when theming gets added.</p>

          <h3>Per-component theme overrides</h3>
          <CodePre>{`/* Override --background just inside one section */
.special-card {
  --background: #1e293b;   /* deeper background */
}

/* Now <Card> rendered inside <div class="special-card"> picks up the override */`}</CodePre>

          <p>CSS variable inheritance: child elements inherit values from their nearest ancestor. Overriding a variable in a wrapper retunes everything inside. This is dramatically simpler than threading a theme prop through React.</p>
        </section>

        <hr />

        {/* SECTION 10 — COMPARISON */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Comparison: MUI vs shadcn</h2>
          <p>The fleet ships both — MUI in 4 apps (Hearth, Cairn, ShopKeep, Tabloom selective), shadcn in 1 (PulseWire). The differences are real and architectural; neither is "better."</p>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th></th><th>MUI 7</th><th>shadcn/ui</th></tr>
              <tr><td>Install model</td><td>npm package, import from <code>@mui/*</code></td><td>CLI copies source into your repo</td></tr>
              <tr><td>Styling</td><td>CSS-in-JS via Emotion + <code>sx</code> prop</td><td>Tailwind utility classes</td></tr>
              <tr><td>Theme</td><td>JS object passed to <code>&lt;ThemeProvider&gt;</code></td><td>CSS variables in globals.css</td></tr>
              <tr><td>Component upgrade</td><td><code>npm update @mui/material</code></td><td>Manual diff/merge</td></tr>
              <tr><td>Bundle size (Button)</td><td>~30KB gzipped (with theme provider)</td><td>~2KB gzipped (just your file)</td></tr>
              <tr><td>Customization</td><td>Through theme + sx prop overrides</td><td>Edit the source directly</td></tr>
              <tr><td>RSC compatibility</td><td>Works but theme provider must be Client</td><td>Per-component <code>"use client"</code> directive</td></tr>
              <tr><td>Out-of-box components</td><td>~100 (table, datagrid, datepicker, drawer)</td><td>~40 (building blocks, fewer compound widgets)</td></tr>
              <tr><td>A11y maturity</td><td>~10 years of polish</td><td>Radix is mature; some shadcn wrappers younger</td></tr>
              <tr><td>Aesthetic ceiling</td><td>Material Design (hard to escape)</td><td>Whatever you write</td></tr>
              <tr><td>Bug fix flow</td><td>File issue → wait for release</td><td>Edit your file → commit</td></tr>
              <tr><td>Learning curve</td><td>Steep — many APIs, complex theme</td><td>Moderate — Tailwind + cva + your file</td></tr>
            </tbody>
          </table>

          <h3>When MUI wins</h3>
          <ul>
            <li>You want Material Design (the look).</li>
            <li>You need compound widgets out-of-box: DataGrid, DatePicker, Autocomplete, Drawer.</li>
            <li>You're moving fast and don't want to make styling decisions.</li>
            <li>You're on Next.js Pages Router or pure CRA/Vite — MUI's RSC story is workable but less natural.</li>
            <li>Your team is bigger; shadcn's "everyone edits the source" can produce drift.</li>
          </ul>

          <h3>When shadcn wins</h3>
          <ul>
            <li>You want a custom aesthetic that doesn't fight you.</li>
            <li>You're on Next.js App Router and want to minimize the Client bundle.</li>
            <li>You're comfortable with Tailwind.</li>
            <li>You want each component's source visible + editable.</li>
            <li>You're building a design system — shadcn's source-copy + registry pattern fits.</li>
          </ul>

          <h3>The fleet's actual picks</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Pick</th><th>Why</th></tr>
              <tr><td>Hearth (SecretApp)</td><td>MUI 7</td><td>Warm artisan palette + Material's polish</td></tr>
              <tr><td>Cairn</td><td>MUI 7</td><td>Forked from Hearth; same pattern</td></tr>
              <tr><td>ShopKeep</td><td>MUI 7 selective</td><td>Just Select / Dialog / icons; rest is Tailwind</td></tr>
              <tr><td>Tabloom</td><td>None</td><td>Hand-rolled Tailwind + Pure CSS tokens</td></tr>
              <tr><td>GLP1 (Tare)</td><td>Headless UI + Tailwind</td><td>Lightweight; no compound widgets needed</td></tr>
              <tr><td>Workshop</td><td>Tailwind only</td><td>Custom warm aesthetic; no library</td></tr>
              <tr><td>Puzzlebox</td><td>Tailwind only</td><td>Game UI; no component library fit</td></tr>
              <tr><td>PulseWire</td><td>shadcn + Radix + cva</td><td>Premium dark-glass reader; full design control</td></tr>
            </tbody>
          </table>

          <p>The spectrum: from "full library" (MUI) to "primitives only" (Radix via shadcn) to "no library" (raw Tailwind). Pick based on aesthetic ceiling + compound-widget needs + RSC compatibility.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a Component Library</h2>
          <p>Stand up a Vite + React + Tailwind v4 app with shadcn, copy the Button + Dialog, build a custom Card from scratch. ~45 minutes.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`npm create vite@latest shadcn-lab -- --template react-ts
cd shadcn-lab
npm i
npm i -D tailwindcss @tailwindcss/vite
npm i clsx tailwind-merge class-variance-authority`}</CodePre>

          <h3>Step 2 — Configure Tailwind v4 + path alias</h3>
          <CodePre>{`// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})`}</CodePre>

          <CodePre>{`// tsconfig.json — add paths
{
  "compilerOptions": {
    // ... existing ...
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}`}</CodePre>

          <h3>Step 3 — globals.css</h3>
          <CodePre>{`/* src/index.css — replace whatever was there */
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #0b1020;
  --primary: #7c3aed;
  --primary-foreground: #ffffff;
  --muted: #94a3b8;
  --border: #e2e8f0;
}

.dark {
  --background: #0b1020;
  --foreground: #ffffff;
  --primary: #00e5ff;
  --primary-foreground: #0b1020;
  --muted: #94a3b8;
  --border: rgba(255, 255, 255, 0.1);
}

@theme inline {
  --color-background:         var(--background);
  --color-foreground:         var(--foreground);
  --color-primary:            var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted:              var(--muted);
  --color-border:             var(--border);
}

body {
  background: var(--background);
  color: var(--foreground);
}`}</CodePre>

          <h3>Step 4 — The cn() utility</h3>
          <CodePre>{`// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}</CodePre>

          <h3>Step 5 — A Button with cva</h3>
          <CodePre>{`// src/components/ui/button.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
  'disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground hover:opacity-90',
        outline:     'border border-border bg-transparent hover:bg-primary/10',
        ghost:       'bg-transparent hover:bg-primary/10',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm:      'h-9 px-3 text-xs',
        lg:      'h-11 px-8 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
)
Button.displayName = 'Button'`}</CodePre>

          <h3>Step 6 — A Card with cva variants</h3>
          <CodePre>{`// src/components/ui/card.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-lg border bg-background', {
  variants: {
    padding: { none: 'p-0', sm: 'p-3', md: 'p-5', lg: 'p-7' },
    border:  { default: 'border-border', accent: 'border-primary', none: 'border-transparent' },
    shadow:  { none: '', sm: 'shadow-sm', md: 'shadow', lg: 'shadow-md' },
  },
  defaultVariants: { padding: 'md', border: 'default', shadow: 'sm' },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, padding, border, shadow, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding, border, shadow, className }))} {...props} />
}`}</CodePre>

          <h3>Step 7 — Use them</h3>
          <CodePre>{`// src/App.tsx
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function App() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Shadcn Lab</h1>

      <Card>
        <h2 className="text-lg font-semibold mb-2">Default card</h2>
        <p className="text-sm text-muted mb-4">
          Composed with cn() + cva + your CSS vars. Edit any of it; it's your file.
        </p>
        <div className="flex gap-2">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </Card>

      <Card border="accent" padding="lg" shadow="md">
        <h2 className="text-lg font-semibold mb-2">Accented card</h2>
        <div className="flex gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </Card>

      <Button
        onClick={() => document.documentElement.classList.toggle('dark')}
      >
        Toggle dark mode
      </Button>
    </div>
  )
}`}</CodePre>

          <h3>Step 8 — Run it</h3>
          <CodePre>{`npm run dev`}</CodePre>

          <ol>
            <li>Open <code>http://localhost:5173</code>. You see your component lab.</li>
            <li>Click "Toggle dark mode." The whole UI swaps colors via the CSS var indirection.</li>
            <li>Open DevTools → Elements → <code>&lt;html&gt;</code>. The <code>.dark</code> class toggles.</li>
            <li>Edit <code>buttonVariants.variants.variant.default</code>'s string. Hot-reload picks it up.</li>
            <li>Try <code>cn('p-2', 'p-4')</code> in the console (after exposing cn globally). Output: <code>"p-4"</code> — twMerge resolved the conflict.</li>
          </ol>

          <h3>Step 9 — Add Radix Dialog (optional)</h3>
          <CodePre>{`npm i @radix-ui/react-dialog @radix-ui/react-slot`}</CodePre>

          <p>Copy a minimal shadcn-style Dialog wrapper into <code>src/components/ui/dialog.tsx</code> (the file shadcn's CLI would produce). Compose with Button + a real modal in App.tsx.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated the entire shadcn/ui + Radix + cva + Tailwind v4 stack from first principles. Each file
              is yours. No upstream upgrade flow to worry about; no theme provider to thread; no CSS-in-JS runtime.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Cannot find module '@/lib/utils'"</h3>
          <p>Your path alias isn't configured. Set <code>paths</code> in tsconfig + (Vite) <code>resolve.alias</code> in vite.config + (Next.js) it's automatic. The TS error is separate from the runtime resolve; both must be set.</p>

          <h3>Classes don't apply</h3>
          <p>Tailwind isn't scanning your files. v4 should auto-detect; if not, add <code>@source "./src/**/*.tsx";</code> at the top of globals.css.</p>

          <h3>tailwind-merge doesn't resolve conflicts on custom utilities</h3>
          <p>If you defined custom utility classes (e.g. <code>bg-brand-primary</code>) and twMerge keeps both, you need to extend its config. Pass a custom merge config via <code>extendTailwindMerge()</code>.</p>

          <h3>Variants aren't typed</h3>
          <p>You didn't use <code>VariantProps</code>. Add <code>VariantProps&lt;typeof yourVariants&gt;</code> to your props type. Now <code>variant: 'foo'</code> autocompletes.</p>

          <h3>"Module '@radix-ui/react-dialog' has no exported member 'Root'"</h3>
          <p>Radix v1.4+ uses <code>import &#123; Root, Trigger, Content &#125; from '@radix-ui/react-dialog'</code> OR <code>import * as Dialog from '@radix-ui/react-dialog'</code>. shadcn templates use the latter style.</p>

          <h3>"Hydration mismatch" with theme toggle</h3>
          <p>Server-render produced one theme; client read localStorage and switched. Use <code>suppressHydrationWarning</code> on <code>&lt;html&gt;</code> + next-themes' <code>ThemeProvider</code> with the right setup.</p>

          <h3>shadcn CLI says "no components.json"</h3>
          <p>You haven't run <code>npx shadcn@latest init</code> yet. Do that first; it creates the config + your initial globals.css setup.</p>

          <h3>The CLI overwrites my custom edits</h3>
          <p>By default, re-running <code>npx shadcn add button</code> for an existing file may prompt to overwrite. Always say no, OR use <code>npx shadcn diff</code> to merge selectively.</p>

          <h3>cva output has duplicate classes</h3>
          <p>You forgot to wrap cva's output in <code>cn()</code>. cva emits the raw string; cn (via twMerge) resolves conflicts. Always: <code>cn(buttonVariants(...))</code>.</p>

          <h3>"data-state=open" classes don't trigger</h3>
          <p>You need <code>tw-animate-css</code> (or similar) installed and <code>data-[state=open]:animate-in</code> classes available. shadcn's default Dialog template imports them; if you're hand-rolling, add the plugin.</p>

          <h3>Tailwind v4 doesn't process @import</h3>
          <p>Your PostCSS/Vite config is missing the Tailwind plugin. Verify <code>@tailwindcss/vite</code> is in your Vite plugins, OR <code>@tailwindcss/postcss</code> is in postcss.config.mjs.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The five-line stack init</h3>
          <CodePre>{`npm i clsx tailwind-merge class-variance-authority
npm i @radix-ui/react-{dialog,dropdown-menu,popover,tooltip} @radix-ui/react-slot
npm i lucide-react
npx shadcn@latest init
npx shadcn@latest add button card dialog`}</CodePre>

          <h3>cn() — the seven-line utility</h3>
          <CodePre>{`import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`}</CodePre>

          <h3>cva skeleton</h3>
          <CodePre>{`const xVariants = cva('BASE_CLASSES', {
  variants: {
    intent: { primary: '...', secondary: '...' },
    size:   { sm: '...', md: '...', lg: '...' },
  },
  compoundVariants: [
    { intent: 'primary', size: 'sm', className: '...' },
  ],
  defaultVariants: { intent: 'primary', size: 'md' },
})

type XProps = VariantProps<typeof xVariants> & { className?: string }

function X({ className, intent, size, ...props }: XProps) {
  return <div className={cn(xVariants({ intent, size, className }))} {...props} />
}`}</CodePre>

          <h3>Radix Dialog skeleton</h3>
          <CodePre>{`import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root>
  <Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Body</Dialog.Description>
      <Dialog.Close asChild><Button variant="ghost">Cancel</Button></Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`}</CodePre>

          <h3>Tailwind v4 @theme</h3>
          <CodePre>{`@import "tailwindcss";

:root {
  --background: #...;
  --foreground: #...;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}`}</CodePre>

          <h3>components.json</h3>
          <CodePre>{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils":      "@/lib/utils",
    "ui":         "@/components/ui",
    "lib":        "@/lib",
    "hooks":      "@/hooks"
  }
}`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>cn() utility</td><td>PulseWire · <code>src/lib/utils.ts</code> (full file)</td></tr>
              <tr><td>components.json config</td><td>PulseWire · <code>components.json</code> (full file)</td></tr>
              <tr><td>Tailwind v4 @theme</td><td>PulseWire · <code>src/app/globals.css</code> (full file)</td></tr>
              <tr><td>Hand-rolled Tailwind component</td><td>PulseWire · <code>src/components/TopBar.tsx</code></td></tr>
              <tr><td>Client transition + Tailwind</td><td>PulseWire · <code>src/app/app/saved/DeleteButton.tsx</code></td></tr>
              <tr><td>radix-nova preset</td><td>PulseWire · <code>components.json:3</code> (<code>"style": "radix-nova"</code>)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: PostgreSQL + pgvector.</p>
        </section>
      </main>
    </div>
  );
}
