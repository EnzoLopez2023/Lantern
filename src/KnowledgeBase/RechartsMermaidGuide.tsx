import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Two Visualization Engines',     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Recharts Composition Model',    icon: '📊' },
  { id: 's3',  num: '3',  title: 'The Core Chart Types',          icon: '📈' },
  { id: 's4',  num: '4',  title: 'ResponsiveContainer + Layout',  icon: '📐' },
  { id: 's5',  num: '5',  title: 'Tooltips, Legends, Cells',      icon: '🏷️' },
  { id: 's6',  num: '6',  title: 'ShopKeep Reports deep dive',    icon: '🛠️' },
  { id: 's7',  num: '7',  title: 'GLP1 Glucose Line Chart',       icon: '💉' },
  { id: 's8',  num: '8',  title: 'Mermaid: Diagram-as-Code',      icon: '🌳' },
  { id: 's9',  num: '9',  title: 'Hearth\'s MermaidDiagram comp', icon: '⚙️' },
  { id: 's10', num: '10', title: 'Performance + Bundle Size',     icon: '⚡' },
  { id: 's11', num: '★',  title: 'Lab: Build a Trend Card',       icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',               icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                   icon: '📋' },
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

export default function RechartsMermaidGuide() {
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
            <span className="sidebar-title">Recharts + Mermaid</span>
          </div>
          <div className="sidebar-sub">Charts and diagrams across the fleet</div>
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
          <div className="hero-tag">📊 Recharts 3.8 · Mermaid 11.15 · 2026</div>
          <h1>Recharts + Mermaid<br />(data viz across the fleet)</h1>
          <p>
            Two libraries, two jobs. <strong style={{ color: '#C77AA0' }}>Recharts</strong> turns arrays of data into
            interactive charts — bar, line, pie, scatter, composed. ShopKeep's Reports page alone has 15+ charts. GLP1's
            entire health dashboard is Recharts. <strong style={{ color: '#C77AA0' }}>Mermaid</strong> turns text-form
            graph definitions into rendered SVG diagrams — Hearth's KnowledgeBase guides use it everywhere you see a
            flowchart or sequence diagram. Together they cover the two big "show me a picture" needs of the fleet.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">3.8</span><span className="hero-stat-label">Recharts version</span></div>
            <div className="hero-stat"><span className="hero-stat-val">11.15</span><span className="hero-stat-label">Mermaid version</span></div>
            <div className="hero-stat"><span className="hero-stat-val">15+</span><span className="hero-stat-label">Charts in ShopKeep</span></div>
            <div className="hero-stat"><span className="hero-stat-val">29</span><span className="hero-stat-label">Guides with diagrams</span></div>
          </div>
        </div>

        {/* SECTION 1 — TWO ENGINES */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>Two Visualization Engines</h2>
          <p>
            Recharts and Mermaid solve different problems. Both end up as SVG in the DOM, but the inputs are completely
            different.
          </p>

          <h3>Recharts — arrays of records → interactive chart</h3>
          <p>
            You have an array like <code>[&#123; month: 'Jan', spend: 1200 &#125;, &#123; month: 'Feb', spend: 1450 &#125;, ...]</code>.
            You want a bar chart. Recharts is a set of React components — <code>BarChart</code>, <code>Bar</code>,
            <code>XAxis</code>, <code>Tooltip</code> — that you compose, pass the data array to once, and get an
            interactive chart with hover, tooltips, animation, and responsive sizing.
          </p>

          <h3>Mermaid — text definition → static diagram</h3>
          <p>
            You have a thought: "request goes from React app to API to database, with a cache in the middle." You write:
          </p>
          <CodePre>{`graph LR
  App --> API
  API --> Cache
  Cache --> DB`}</CodePre>
          <p>
            And Mermaid renders an arrow diagram. The input is TEXT — you're writing a language, not composing React.
            Mermaid renders it to SVG once, on mount; it's not interactive. Used for documentation, system diagrams,
            sequence flows, ER diagrams, Gantt charts.
          </p>

          <h3>When to reach for which</h3>
          <table>
            <tbody>
              <tr><th>Need</th><th>Tool</th><th>Why</th></tr>
              <tr><td>Show data values over time</td><td>Recharts</td><td>Live data, axes, tooltips</td></tr>
              <tr><td>Compare categories</td><td>Recharts</td><td>Bars, pies, scatter</td></tr>
              <tr><td>Show interaction with data</td><td>Recharts</td><td>Click handlers per element</td></tr>
              <tr><td>Show a process / flow</td><td>Mermaid</td><td>Text-form graphs render to SVG</td></tr>
              <tr><td>Show a sequence of operations</td><td>Mermaid</td><td>sequenceDiagram primitive</td></tr>
              <tr><td>Show an architecture</td><td>Mermaid</td><td>flowchart / graph primitive</td></tr>
              <tr><td>Show a hierarchy / taxonomy</td><td>Mermaid</td><td>graph TD</td></tr>
              <tr><td>Show data in a chart</td><td>NEVER Mermaid</td><td>Mermaid's chart support is minimal; use Recharts</td></tr>
              <tr><td>Diagrams in markdown docs</td><td>Mermaid</td><td>GitHub renders Mermaid natively</td></tr>
            </tbody>
          </table>

          <h3>The fleet at a glance</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Recharts</th><th>Mermaid</th><th>Notes</th></tr>
              <tr><td>ShopKeep</td><td>3.8.0</td><td>—</td><td>15+ charts in Reports — biggest user</td></tr>
              <tr><td>GLP1 (Tare)</td><td>2.10.3</td><td>—</td><td>Health dashboard charts (glucose, weight)</td></tr>
              <tr><td>SecretApp (Hearth)</td><td>3.8.1</td><td>11.15.0</td><td>KnowledgeBase + Plex stats</td></tr>
              <tr><td>Cairn</td><td>—</td><td>11.15.0</td><td>Exam prep guide diagrams</td></tr>
              <tr><td>Tabloom / PulseWire / Puzzlebox / Workshop</td><td>—</td><td>—</td><td>No charts or diagrams</td></tr>
            </tbody>
          </table>

          <h3>Why both end up in the same guide</h3>
          <p>
            They look adjacent but feel different. Recharts is interactive and code-heavy: you compose ten components,
            wire up data, write tooltip formatters. Mermaid is declarative: one big string, one render call. This guide
            covers both because (a) most apps that ship one ship the other, and (b) the deciding question
            — "is this LIVE data or DOC content?" — is the same conceptual fork.
          </p>
        </section>

        <hr />

        {/* SECTION 2 — COMPOSITION */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Recharts Composition Model</h2>
          <p>
            Recharts works by composing chart "pieces." The wrapper component (<code>BarChart</code>, <code>LineChart</code>,
            etc.) is the chart's canvas. The pieces inside (<code>Bar</code>, <code>XAxis</code>, <code>Tooltip</code>)
            are React components that READ the data via context and draw their part of the chart. The end result is one
            SVG element rendered to the DOM.
          </p>

          <h3>The minimum viable chart</h3>
          <CodePre>{`import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', spend: 1200 },
  { month: 'Feb', spend: 1450 },
  { month: 'Mar', spend: 980 },
]

export default function SpendByMonth() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="spend" fill="#C17A2E" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}`}</CodePre>

          <h3>Composition rules</h3>
          <ul>
            <li><strong>Pass <code>data</code> to the chart wrapper, not to individual <code>Bar</code> / <code>Line</code> components.</strong> The wrapper provides the data via React context.</li>
            <li><strong><code>dataKey</code> tells each visual which field to read.</strong> <code>{`<XAxis dataKey="month">`}</code> says "use the 'month' field for the X axis." <code>{`<Bar dataKey="spend">`}</code> says "use the 'spend' field for bar height."</li>
            <li><strong>Order of children matters for stacking.</strong> Later children render on top. Place <code>Tooltip</code> last so it isn't drawn under bars.</li>
            <li><strong>Composed charts mix types.</strong> <code>ComposedChart</code> can hold <code>Bar</code> + <code>Line</code> + <code>Area</code> in the same chart.</li>
          </ul>

          <h3>The visual hierarchy</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  RC[ResponsiveContainer<br/>sets dimensions]
  RC --> BC[BarChart / LineChart / etc<br/>holds data context]
  BC --> CG[CartesianGrid<br/>background grid]
  BC --> XA[XAxis / YAxis<br/>axes + ticks]
  BC --> TT[Tooltip<br/>hover overlay]
  BC --> LEG[Legend<br/>color key]
  BC --> BAR[Bar / Line / Area<br/>visual marks]
  BAR --> CELL[Cell<br/>per-datum overrides]
  style RC fill:#5C2A4A,color:#fff
  style BC fill:#5C2A4A,color:#fff`} />

          <h3>Why declarative composition wins</h3>
          <p>You could draw charts with raw D3 — full control, but every chart is hundreds of lines of imperative SVG manipulation. Or you could use Chart.js — one config object, but extending it means subclassing or escape hatches. Recharts splits the difference: React components, composed by you, with prop-level overrides for everything.</p>

          <p>The win shows up when you need to do something the library didn't anticipate. Want to highlight one bar a different color? Drop in <code>{`<Cell key={i} fill={...} />`}</code> children inside the Bar (§5). Want a custom tooltip? Pass <code>content={`{<CustomTooltip />}`}</code>. Every extension point is a React prop.</p>

          <h3>The recharts surface — what's actually in the package</h3>
          <ul>
            <li><strong>Chart wrappers</strong>: <code>BarChart</code>, <code>LineChart</code>, <code>AreaChart</code>, <code>PieChart</code>, <code>ScatterChart</code>, <code>RadarChart</code>, <code>RadialBarChart</code>, <code>ComposedChart</code>, <code>Treemap</code>, <code>Sankey</code>, <code>Funnel</code>.</li>
            <li><strong>Visual elements</strong>: <code>Bar</code>, <code>Line</code>, <code>Area</code>, <code>Pie</code>, <code>Scatter</code>, <code>Radar</code>, <code>Cell</code>, <code>Sector</code>.</li>
            <li><strong>Axes + grid</strong>: <code>XAxis</code>, <code>YAxis</code>, <code>ZAxis</code> (scatter), <code>PolarAngleAxis</code>, <code>PolarRadiusAxis</code>, <code>CartesianGrid</code>.</li>
            <li><strong>Overlays</strong>: <code>Tooltip</code>, <code>Legend</code>, <code>LabelList</code>, <code>ReferenceLine</code>, <code>ReferenceArea</code>, <code>Brush</code>.</li>
            <li><strong>Layout</strong>: <code>ResponsiveContainer</code>.</li>
            <li><strong>Customization</strong>: <code>Customized</code>, <code>Label</code>, <code>ErrorBar</code>.</li>
          </ul>

          <p>You'll use a fraction of these. ShopKeep's Reports page uses about 12 of them. GLP1's BloodGlucose chart uses 8.</p>
        </section>

        <hr />

        {/* SECTION 3 — CHART TYPES */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The Core Chart Types</h2>
          <p>The fleet uses six chart types regularly. Each one has a "default" shape and a few common variations.</p>

          <h3>BarChart — comparison across categories</h3>
          <p>Best for: "how does X compare to Y to Z?" — a dozen categories or fewer.</p>
          <CodePre>{`<BarChart data={data}>
  <XAxis dataKey="category" />
  <YAxis />
  <Bar dataKey="value" fill="#C17A2E" radius={[5, 5, 0, 0]} />
</BarChart>`}</CodePre>

          <p>Tricks:</p>
          <ul>
            <li><code>layout="vertical"</code> + swap <code>type="number"</code> / <code>type="category"</code> on the axes → horizontal bars. ShopKeep uses this for "Investment by Category" and "Top Brands."</li>
            <li><code>stackId="x"</code> on multiple Bars → stacked bars (ShopKeep "Category Mix by Year").</li>
            <li><code>radius=&#123;[5, 5, 0, 0]&#125;</code> on a Bar → rounded top corners only.</li>
            <li>Per-bar fill: nest <code>&lt;Cell key=&#123;i&#125; fill=&#123;...&#125; /&gt;</code> components inside the Bar.</li>
          </ul>

          <h3>LineChart — trend over time</h3>
          <p>Best for: continuous data over a time axis. GLP1's glucose chart, GLP1's weight chart, etc.</p>
          <CodePre>{`<LineChart data={data}>
  <XAxis dataKey="date" />
  <YAxis />
  <Line type="monotone" dataKey="value" stroke="#C17A2E" strokeWidth={2} dot={false} />
</LineChart>`}</CodePre>

          <p>Tricks:</p>
          <ul>
            <li><code>type="monotone"</code> = smooth curve. <code>type="linear"</code> = straight segments. <code>type="step"</code> = staircase.</li>
            <li><code>connectNulls</code> = bridge gaps in data (otherwise the line breaks at <code>null</code>).</li>
            <li>Multiple <code>{`<Line>`}</code> children = multi-series overlay.</li>
            <li><code>strokeDasharray="4 2"</code> = dashed line.</li>
            <li><code>{`<ReferenceLine y={70} stroke="#ef4444" />`}</code> = horizontal threshold marker (GLP1's glucose ranges).</li>
          </ul>

          <h3>AreaChart — cumulative or filled-line</h3>
          <p>Best for: showing magnitude with running totals, or emphasizing a single trend line.</p>
          <CodePre>{`<AreaChart data={data}>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="#C17A2E" stopOpacity={0.35} />
      <stop offset="95%" stopColor="#C17A2E" stopOpacity={0.02} />
    </linearGradient>
  </defs>
  <XAxis dataKey="month" />
  <YAxis />
  <Area type="monotone" dataKey="cumulative" stroke="#C17A2E" fill="url(#grad)" />
</AreaChart>`}</CodePre>

          <p>The gradient fill (via <code>{`<defs>`}</code> + <code>linearGradient</code>) is the canonical "soft fade to transparent" Recharts pattern. ShopKeep's "Cumulative Investment" chart uses it verbatim (§6).</p>

          <h3>PieChart — proportions of a whole</h3>
          <p>Best for: 3–8 categories, where the total = 100%.</p>
          <CodePre>{`<PieChart>
  <Pie data={data} dataKey="value" nameKey="category" innerRadius={58} outerRadius={96} paddingAngle={2}>
    {data.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>`}</CodePre>

          <p>Set <code>innerRadius &gt; 0</code> to get a donut chart. <code>paddingAngle</code> creates whitespace between slices.</p>

          <h3>ScatterChart — bivariate distribution</h3>
          <p>Best for: showing relationships between two numeric dimensions, optionally with a third (bubble size).</p>
          <CodePre>{`<ScatterChart>
  <XAxis type="number" dataKey="x" name="Count" />
  <YAxis type="number" dataKey="y" name="Avg" />
  <ZAxis type="number" dataKey="z" range={[60, 900]} />
  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
  <Scatter data={brands} fill="#C17A2E" />
</ScatterChart>`}</CodePre>

          <p>
            <code>ZAxis</code> + a <code>range</code> = bubble chart. ShopKeep's "Brand Landscape" plots tool count vs
            avg price with bubble size = total spend.
          </p>

          <h3>ComposedChart — mixing types</h3>
          <p>Best for: showing two related quantities at different scales, like "raw count + rolling average."</p>
          <CodePre>{`<ComposedChart data={data}>
  <XAxis dataKey="month" />
  <YAxis />
  <Bar dataKey="tools" fill="#E8C99A" />
  <Line type="monotone" dataKey="rolling" stroke="#C17A2E" strokeWidth={2.5} dot={false} />
</ComposedChart>`}</CodePre>

          <p>ShopKeep's "Purchase Velocity" uses bars for monthly tool adds and a line overlay for the 6-month rolling average. Telling the same story two ways at once.</p>

          <h3>Choosing the type — flowchart</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  S[Start: what's the data?]
  S --> Q1{Continuous time axis?}
  Q1 -->|yes| LC[LineChart or AreaChart]
  Q1 -->|no| Q2{Categorical comparison?}
  Q2 -->|yes| Q3{<= 8 cats AND sums to whole?}
  Q3 -->|yes| PC[PieChart]
  Q3 -->|no| BC[BarChart]
  Q2 -->|no| Q4{Two numeric dimensions?}
  Q4 -->|yes| SC[ScatterChart]
  Q4 -->|no| CC[ComposedChart]
  style LC fill:#5C2A4A,color:#fff
  style BC fill:#5C2A4A,color:#fff
  style PC fill:#5C2A4A,color:#fff
  style SC fill:#5C2A4A,color:#fff
  style CC fill:#5C2A4A,color:#fff`} />
        </section>

        <hr />

        {/* SECTION 4 — RESPONSIVE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>ResponsiveContainer + Layout</h2>
          <p>
            Recharts charts have explicit <code>width</code> and <code>height</code> on the chart wrapper. In a real
            layout you don't know the width in advance — it depends on the user's window, sidebar state, what device
            they're on. <code>ResponsiveContainer</code> wraps the chart, measures its parent, and resizes on every
            resize event.
          </p>

          <h3>The pattern</h3>
          <CodePre>{`<div style={{ width: '100%', height: 260 }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      ...
    </BarChart>
  </ResponsiveContainer>
</div>`}</CodePre>

          <p>Or, more commonly, the explicit <code>height</code> on ResponsiveContainer:</p>
          <CodePre>{`<ResponsiveContainer width="100%" height={260}>
  <BarChart data={data}>...</BarChart>
</ResponsiveContainer>`}</CodePre>

          <h3>Why the explicit height</h3>
          <p>
            <code>ResponsiveContainer</code> works by reading the parent's <code>width</code> and <code>height</code>.
            If neither parent NOR ResponsiveContainer has an explicit height, the chart collapses to 0 pixels — a common
            "blank chart" bug. Always give ResponsiveContainer a number (or its parent a fixed height).
          </p>

          <h3>The margin trap</h3>
          <p>
            Recharts reserves margin for axes labels. The default margin is <code>{`{ top: 5, right: 5, left: 5, bottom: 5 }`}</code>,
            which clips axis tick labels. ShopKeep's convention:
          </p>
          <CodePre>{`margin={{ top: 8, right: 10, left: 0, bottom: 0 }}`}</CodePre>

          <p><code>left: 0</code> lets the Y axis labels render where they want; <code>right: 10</code> stops the rightmost X label from clipping. Adjust per chart.</p>

          <h3>Mobile considerations</h3>
          <p>ShopKeep's Reports page uses <code>useIsMobile()</code> to swap layout details on small screens:</p>
          <CodePre>{`// shopkeep/src/pages/Reports.tsx (excerpt)
const isMobile = useIsMobile()

<Pie data={byCategory} cx={isMobile ? '50%' : '42%'} cy="50%" />
{!isMobile && <Legend layout="vertical" align="right" verticalAlign="middle" />}`}</CodePre>

          <p>On desktop, the pie chart has a vertical legend on the right and is centered at 42% so the legend has room. On mobile, the legend disappears and the pie centers at 50%. Same data, two layouts.</p>

          <h3>Resize handling</h3>
          <p>
            ResponsiveContainer uses <code>ResizeObserver</code> under the hood. Every parent resize triggers a re-render.
            It's mostly free, but if your chart has 10,000 data points, each resize is heavy. For very large datasets,
            consider <code>{`<ResponsiveContainer debounce={50}>`}</code> to throttle.
          </p>

          <h3>Width: percentage vs number</h3>
          <p>
            <code>width="100%"</code> = take all of the parent's width. <code>width=&#123;500&#125;</code> = fixed 500px.
            Use percentage for cards in a grid that should fill their cell; use a number when the chart has a fixed size
            (rare). Mixing — say <code>width="60%"</code> — works but is unusual.
          </p>
        </section>

        <hr />

        {/* SECTION 5 — TOOLTIPS LEGENDS CELLS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Tooltips, Legends, Cells</h2>

          <h3>Tooltip — the hover overlay</h3>
          <CodePre>{`<Tooltip />                              // default tooltip
<Tooltip formatter={(v) => fmt$(v)} />   // format the value
<Tooltip
  formatter={(v, n) => [\`\${v} mg/dL\`, n]}
  labelFormatter={l => \`Day: \${l}\`}
/>`}</CodePre>

          <p>Three knobs:</p>
          <ul>
            <li><strong><code>formatter</code></strong>: function called per series. Return either a string OR an array <code>[value, name]</code>.</li>
            <li><strong><code>labelFormatter</code></strong>: function for the header (the X axis value).</li>
            <li><strong><code>content</code></strong>: completely custom component. Render whatever you want.</li>
          </ul>

          <p>ShopKeep's pattern — a shared money tooltip:</p>
          <CodePre>{`// shopkeep/src/pages/Reports.tsx (sketch)
const moneyTip = (isMoney: boolean) =>
  ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background:'#fff', border:'1px solid #EDE8E3', borderRadius:9, padding:'9px 13px' }}>
        <div style={{ fontWeight:700 }}>{label}</div>
        {payload.map(p => (
          <div key={p.dataKey}>
            {p.name}: <strong>{isMoney ? fmt$(p.value) : p.value}</strong>
          </div>
        ))}
      </div>
    )
  }

<Tooltip content={moneyTip(true)} />`}</CodePre>

          <p>The factory pattern (a function that RETURNS a component) lets multiple charts share the same look but format their values differently. Common.</p>

          <h3>Legend</h3>
          <CodePre>{`<Legend />                                            // top, horizontal
<Legend layout="vertical" align="right" verticalAlign="middle" />
<Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
<Legend formatter={(value) => <span className="my-class">{value}</span>} />`}</CodePre>

          <p><code>iconSize</code>, <code>wrapperStyle</code>, <code>formatter</code> are the three usable knobs. <code>formatter</code> can return JSX — useful for adding hover styles or extra info next to each label.</p>

          <h3>Cell — per-datum styling</h3>
          <p>
            By default, all bars in a Bar are the same color. To override per-datum (e.g., highlight the most recent
            month), nest <code>&lt;Cell&gt;</code> components INSIDE the Bar:
          </p>
          <CodePre>{`<Bar dataKey="total">
  {data.map((d, i) => (
    <Cell key={i} fill={i === data.length - 1 ? '#C17A2E' : '#E8C99A'} />
  ))}
</Bar>`}</CodePre>

          <p>Cell is a "render prop"-style override. One Cell per data point. Same pattern for Pie slices, ScatterChart points.</p>

          <h3>LabelList — text on bars</h3>
          <CodePre>{`<Bar dataKey="total">
  <LabelList dataKey="change" position="top"
    formatter={(v) => \`\${v > 0 ? '+' : ''}\${v}%\`}
    style={{ fontSize: 10, fill: '#6B5B4E' }} />
</Bar>`}</CodePre>

          <p>Renders text labels on each bar — ShopKeep's YoY chart uses LabelList to show "+22%" / "-15%" above each bar.</p>

          <h3>ReferenceLine — threshold markers</h3>
          <p>Horizontal or vertical lines at specific values. GLP1's glucose chart uses three:</p>
          <CodePre>{`<ReferenceLine y={70}  stroke="#ef4444" strokeDasharray="3 2" label={{ value: 'Low' }} />
<ReferenceLine y={100} stroke="#22c55e" strokeDasharray="3 2" label={{ value: 'Normal' }} />
<ReferenceLine y={126} stroke="#f97316" strokeDasharray="3 2" label={{ value: 'High' }} />`}</CodePre>

          <p>Dashed red, green, orange — the user sees their actual reading in context. ReferenceLines can also be VERTICAL (set <code>x=...</code> instead of <code>y=...</code>); GLP1 uses vertical ReferenceLines to mark injection days on the glucose timeline.</p>

          <h3>Click handlers</h3>
          <p>Every visual element supports <code>onClick</code>:</p>
          <CodePre>{`<Bar
  dataKey="total"
  cursor="pointer"
  onClick={(e) => drillMonth(e.month)}
/>`}</CodePre>

          <p>The handler receives the datum (sort of — Recharts wraps it; you usually need a type assertion). ShopKeep uses click handlers on every chart to drill into the underlying records. This is the killer feature — interactive data exploration without a separate "details" page.</p>
        </section>

        <hr />

        {/* SECTION 6 — SHOPKEEP REPORTS */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>ShopKeep Reports deep dive</h2>
          <p>
            ShopKeep's Reports page is the most ambitious chart-heavy view in the fleet — 15+ charts, all
            interactive, drill-downs everywhere, mobile responsive. The file
            (<code>shopkeep/src/pages/Reports.tsx</code>) is ~1100 lines, dominated by chart definitions. Reading it is
            the best way to internalize Recharts.
          </p>

          <h3>The imports — every Recharts surface</h3>
          <CodePre>{`// shopkeep/src/pages/Reports.tsx (verbatim, lines 3-8)
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
  LineChart, Line, ScatterChart, Scatter, ZAxis,
  ComposedChart, LabelList,
} from 'recharts';`}</CodePre>

          <p>11 chart wrappers + 10 elements. A representative sample of what a serious Recharts app needs.</p>

          <h3>The palette</h3>
          <CodePre>{`// lines 24-29
const CAT_COLORS   = ['#C17A2E','#3B82F6','#10B981','#6366F1','#EF4444','#8B5CF6','#F59E0B','#14B8A6','#EC4899','#84CC16','#F97316','#06B6D4','#A855F7','#0EA5E9','#22C55E','#D946EF'];
const BRAND_COLORS = ['#C17A2E','#3B82F6','#10B981','#8B5CF6','#EF4444','#F59E0B','#6366F1','#14B8A6','#EC4899','#84CC16','#F97316','#06B6D4'];
const ACCENT      = '#C17A2E';
const ACCENT_SOFT = '#E8C99A';`}</CodePre>

          <p>16-color category palette, 12-color brand palette, plus the brand accent. The first color in each is the brand <code>#C17A2E</code> (warm caramel) — so the most prominent slice/bar shows brand color.</p>

          <h3>The "investment by year" chart</h3>
          <CodePre>{`// shopkeep/src/pages/Reports.tsx (lines 855-867)
<ResponsiveContainer width="100%" height={260}>
  <ComposedChart data={byYear} margin={{ top:16, right:10, left:0, bottom:0 }} barSize={28}>
    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" vertical={false} />
    <XAxis dataKey="year" tick={{ fontSize:11, fill:'#9C8476' }} axisLine={false} tickLine={false} />
    <YAxis tick={{ fontSize:10, fill:'#9C8476' }} axisLine={false} tickLine={false}
      tickFormatter={v => trendMode === 'count' ? String(v) : \`$\${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}\`} />
    <Tooltip content={moneyTip(trendMode !== 'count')} />
    <Bar dataKey={trendMode === 'spend' ? 'total' : trendMode === 'avg' ? 'avg' : 'count'}
         name={trendMode} radius={[6,6,0,0]} cursor="pointer"
         onClick={(e: unknown) => drillYear((e as { year: string }).year)}>
      {byYear.map((y, i) => <Cell key={y.year} fill={i === byYear.length - 1 ? ACCENT : ACCENT_SOFT} />)}
    </Bar>
  </ComposedChart>
</ResponsiveContainer>`}</CodePre>

          <p>Lessons:</p>
          <ul>
            <li><strong>Dynamic <code>dataKey</code>:</strong> the user toggles between spend / avg / count and the same chart re-renders with a different field. One chart, three modes.</li>
            <li><strong>Custom tick formatter:</strong> <code>$1.2k</code> instead of <code>1200</code>. Hand-rolled because <code>{"${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}"}</code> is one line.</li>
            <li><strong>Per-bar Cell coloring:</strong> the most recent year is full <code>ACCENT</code>; prior years are <code>ACCENT_SOFT</code>. Visual emphasis on "right now."</li>
            <li><strong>Drill click handler:</strong> <code>onClick</code> on the Bar calls <code>drillYear(year)</code>, which opens a modal showing all tools from that year.</li>
            <li><strong>Type assertion:</strong> <code>(e as &#123; year: string &#125;).year</code> — Recharts' click event type is loose; you assert what you know.</li>
          </ul>

          <h3>The "cumulative investment" chart</h3>
          <CodePre>{`// lines 872-888
<ResponsiveContainer width="100%" height={260}>
  <AreaChart data={timelineCumulative} margin={{ top:8, right:10, left:0, bottom:0 }}>
    <defs>
      <linearGradient id="cumulGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.35} />
        <stop offset="95%" stopColor={ACCENT} stopOpacity={0.02} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" vertical={false} />
    <XAxis dataKey="month" tick={{ fontSize:10 }}
      interval={Math.max(0, Math.floor(timelineCumulative.length / 6))}
      tickFormatter={v => { const [y, m] = String(v).split('-'); return \`\${MONTHS[parseInt(m,10)-1]} '\${y.slice(2)}\`; }} />
    <YAxis tick={{ fontSize:10 }} tickFormatter={v => \`$\${(v/1000).toFixed(0)}k\`} />
    <Tooltip formatter={(v: unknown) => [fmt$(Number(v)), 'Total Invested']}
             labelFormatter={l => \`Through \${l}\`} />
    <Area type="monotone" dataKey="cumulative" stroke={ACCENT} strokeWidth={2.5}
          fill="url(#cumulGrad)" dot={false} activeDot={{ r:5, fill: ACCENT }} />
  </AreaChart>
</ResponsiveContainer>`}</CodePre>

          <p>The gradient defined in <code>{`<defs>`}</code> is referenced as <code>fill="url(#cumulGrad)"</code>. Standard SVG pattern, surfaced through Recharts.</p>

          <p>The <code>interval=&#123;Math.max(0, Math.floor(data.length / 6))&#125;</code> trick: show ~6 X ticks regardless of data length. Without this, a 5-year timeline would crowd 60 month labels.</p>

          <h3>The "brand landscape" scatter</h3>
          <CodePre>{`// lines 1070-1090ish
<ResponsiveContainer width="100%" height={300}>
  <ScatterChart margin={{ top:16, right:14, left:0, bottom:14 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5"/>
    <XAxis type="number" dataKey="x" name="Tools" label={{ value:'Tools owned', position:'insideBottom' }} />
    <YAxis type="number" dataKey="y" name="Avg" label={{ value:'Avg $', angle:-90, position:'insideLeft' }}
      tickFormatter={v => \`$\${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}\`} />
    <ZAxis type="number" dataKey="z" range={[60, 900]} />
    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
      if (!active || !payload?.length) return null;
      const d = payload[0].payload;
      return (
        <div style={{ background:'#fff', border:'1px solid #EDE8E3', borderRadius:9, padding:'9px 13px' }}>
          <div style={{ fontWeight:700 }}>{d.brand}</div>
          <div>Tools: <strong>{d.x}</strong></div>
          <div>Avg: <strong>{fmt$(d.y)}</strong></div>
        </div>
      );
    }} />
    <Scatter data={brandScatter} />
  </ScatterChart>
</ResponsiveContainer>`}</CodePre>

          <p>X = tools owned. Y = avg price. Z (bubble size, range 60-900 px²) = total spend. Three dimensions on one chart. The custom tooltip shows the brand name and all three values.</p>

          <h3>What ShopKeep teaches you</h3>
          <ul>
            <li><strong>Reuse formatters and palettes.</strong> Don't define <code>fmt$</code> in every component — one helper, used across 15 charts.</li>
            <li><strong>Use Cell for emphasis.</strong> "Most recent year accent, prior years soft" pattern → instant clarity.</li>
            <li><strong>Click handlers everywhere.</strong> Every chart that COULD be drillable, IS drillable.</li>
            <li><strong>Custom tooltips when default doesn't fit.</strong> A scatter with brand + 3 metrics needs a custom tooltip; a simple bar chart probably doesn't.</li>
            <li><strong>Tune ticks density.</strong> <code>interval=</code> on XAxis is how you keep dense timelines readable.</li>
            <li><strong>Wrap charts in a Card with title + sub.</strong> Every chart in ShopKeep is inside a <code>Card</code> primitive with consistent padding/border. Don't put a raw chart on a page.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 7 — GLP1 GLUCOSE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>GLP1 Glucose Line Chart</h2>
          <p>
            GLP1's BloodGlucose page is the second-most chart-heavy view in the fleet. Where ShopKeep is "exploration"
            (drill into the data), GLP1 is "health insight" (am I in the normal range, and trending right?). The
            charts are simpler — fewer dimensions — but the contextual ReferenceLines turn them into clinical tools.
          </p>

          <h3>The full chart</h3>
          <CodePre>{`// glp1/src/pages/BloodGlucose.jsx (verbatim, lines 157-176)
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
    <XAxis dataKey="label" tick={{ fontSize: 10 }} />
    <YAxis tick={{ fontSize: 10 }} domain={[60, 'auto']} />
    <Tooltip formatter={(v, n) => [v ? \`\${v} mg/dL\` : '—', n]} />
    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />

    {/* Three horizontal threshold lines */}
    <ReferenceLine y={70}  stroke="#ef4444" strokeDasharray="3 2" label={{ value: 'Low',    fontSize: 9 }} />
    <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="3 2" label={{ value: 'Normal', fontSize: 9 }} />
    <ReferenceLine y={126} stroke="#f97316" strokeDasharray="3 2" label={{ value: 'High',   fontSize: 9 }} />

    {/* Three concurrent line series */}
    <Line type="monotone" dataKey="avg"     name="Average"   stroke="#0ea5e9" dot={false} strokeWidth={2}   connectNulls />
    <Line type="monotone" dataKey="fastAvg" name="Fasting"   stroke="#8b5cf6" dot={false} strokeWidth={1.5} connectNulls strokeDasharray="4 2" />
    <Line type="monotone" dataKey="postAvg" name="Post-Meal" stroke="#f97316" dot={false} strokeWidth={1.5} connectNulls strokeDasharray="4 2" />

    {/* Vertical markers for injection days */}
    {injectionLabels.map(lbl => (
      <ReferenceLine key={lbl} x={lbl} stroke="#7c3aed" strokeWidth={1.5}
        label={{ value: '💉', position: 'top', fontSize: 11 }} />
    ))}
  </LineChart>
</ResponsiveContainer>`}</CodePre>

          <h3>What's interesting here</h3>
          <ul>
            <li><strong><code>domain=&#123;[60, 'auto']&#125;</code></strong> — Y axis starts at 60 (the visual floor; anything lower is medical concern). Max is auto-computed from the data. So the chart never wastes space on the 0–60 range.</li>
            <li><strong>Three concurrent <code>{`<Line>`}</code> children</strong> — overall average (solid blue), fasting average (dashed purple), post-meal average (dashed orange). All on the same chart, color-coded.</li>
            <li><strong>Three horizontal ReferenceLines</strong> — at 70 (low / red), 100 (normal / green), 126 (high / orange). The reader sees their glucose IN CONTEXT of medical ranges, not as an abstract number.</li>
            <li><strong>Vertical ReferenceLines from a mapped array</strong> — every injection day gets a vertical purple line with a 💉 emoji as label. Lets the user correlate medication with glucose response.</li>
            <li><strong><code>connectNulls</code></strong> — if the user misses a day of glucose readings, the line bridges the gap instead of breaking. Visual continuity wins over data-purity here.</li>
            <li><strong><code>dot=&#123;false&#125;</code></strong> — disable per-point dots; with 30+ days, dots are noise.</li>
            <li><strong><code>strokeDasharray="4 2"</code></strong> — secondary series (fasting / post-meal) are dashed to de-emphasize them relative to the solid overall average.</li>
          </ul>

          <h3>The data-shape lesson</h3>
          <p>The data array looks like:</p>
          <CodePre>{`[
  { label: 'Mon', avg: 95, fastAvg: 88, postAvg: 110 },
  { label: 'Tue', avg: 102, fastAvg: 92, postAvg: 125 },
  { label: 'Wed', avg: null, fastAvg: null, postAvg: null },  // missed day
  { label: 'Thu', avg: 98, fastAvg: 90, postAvg: 108 },
  ...
]`}</CodePre>

          <p>One row per X position. Multiple series? Multiple fields per row. NOT separate arrays per series. This is the canonical Recharts shape and trips up everyone the first time — you don't pass an array PER series, you pass one array with one row per X-coordinate and N value fields per row.</p>

          <h3>What this teaches you about clinical UI</h3>
          <p>
            GLP1 isn't "show me a glucose chart." It's "tell me if I'm okay." The ReferenceLines + emoji labels are
            what turn raw data into clinical context. ShopKeep's drill-down approach is "explore." GLP1's contextual
            ranges approach is "assess." Same library; very different user need.
          </p>
        </section>

        <hr />

        {/* SECTION 8 — MERMAID */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Mermaid: Diagram-as-Code</h2>
          <p>
            Mermaid lets you write a diagram as a string of text and have it rendered as an SVG. It's "Markdown for
            diagrams" — github.com supports it natively in any <code>.md</code> file fenced with <code>```mermaid</code>.
            Hearth and Cairn both use it: Hearth for the 29+ KnowledgeBase guides, Cairn for exam-prep diagrams.
          </p>

          <h3>The smallest possible Mermaid</h3>
          <CodePre>{`graph LR
  A --> B
  B --> C`}</CodePre>

          <p>That string renders as three boxes (A, B, C) connected by left-to-right arrows. <code>graph LR</code> = left-to-right; <code>graph TD</code> = top-down.</p>

          <h3>Diagram types Mermaid supports</h3>
          <table>
            <tbody>
              <tr><th>Type</th><th>Use for</th><th>Keyword</th></tr>
              <tr><td>Flowchart</td><td>Decision trees, system architecture</td><td><code>graph TD</code> / <code>graph LR</code> / <code>flowchart TD</code></td></tr>
              <tr><td>Sequence diagram</td><td>Request flows, API interactions</td><td><code>sequenceDiagram</code></td></tr>
              <tr><td>Class diagram</td><td>OOP relationships, type hierarchies</td><td><code>classDiagram</code></td></tr>
              <tr><td>State diagram</td><td>State machines, lifecycle</td><td><code>stateDiagram-v2</code></td></tr>
              <tr><td>ER diagram</td><td>Database schemas</td><td><code>erDiagram</code></td></tr>
              <tr><td>Gantt chart</td><td>Project timelines</td><td><code>gantt</code></td></tr>
              <tr><td>Pie chart</td><td>Avoid — use Recharts</td><td><code>pie</code></td></tr>
              <tr><td>Mind map</td><td>Brainstorm-style trees</td><td><code>mindmap</code></td></tr>
              <tr><td>Quadrant chart</td><td>2×2 matrix</td><td><code>quadrantChart</code></td></tr>
            </tbody>
          </table>

          <h3>Flowchart syntax — the basics</h3>
          <CodePre>{`graph TD
  A[Square box]
  B(Round box)
  C{Decision diamond}
  D((Circle))
  E[/Parallelogram/]

  A --> B
  B --> C
  C -->|yes| D
  C -->|no| E

  style A fill:#5C2A4A,color:#fff
  style D fill:#22c55e`}</CodePre>

          <p>Shape brackets matter: <code>[]</code> = rectangle, <code>()</code> = rounded, <code>&#123;&#125;</code> = diamond, <code>(())</code> = circle. Arrows: <code>--&gt;</code> = solid, <code>-.-&gt;</code> = dashed, <code>==&gt;</code> = thick.</p>

          <h3>Sequence diagram — request flows</h3>
          <CodePre>{`sequenceDiagram
  participant U as User
  participant A as API
  participant DB as Database

  U->>A: POST /api/login
  A->>DB: SELECT user WHERE email=?
  DB-->>A: user row
  A-->>U: { token }`}</CodePre>

          <p>This is what most KnowledgeBase guides use to show "request → server → database → response" flows. Cleaner than ASCII art, fewer hands to draw.</p>

          <h3>Hearth's use — flowcharts in guides</h3>
          <p>Every guide in this KnowledgeBase that has a diagram uses Mermaid. The pattern (see §9 for the component):</p>
          <CodePre>{`<MermaidDiagram theme="default" chart={\`graph LR
  M[motion.X] --> AP[AnimatePresence]
  AP -->|exit| V[Variants]
  V -->|stagger| RM[useReducedMotion]
\`} />`}</CodePre>

          <p>The template literal is the diagram source. Triple backticks aren't possible inside a TS template literal so you escape with regular backticks; the same string in a markdown file would be fenced with <code>```mermaid</code>.</p>

          <h3>Theming</h3>
          <p>Mermaid has built-in themes: <code>default</code>, <code>dark</code>, <code>forest</code>, <code>neutral</code>, <code>base</code>. Hearth's component lets you pass <code>theme="dark"</code> (default) or <code>theme="default"</code> (light). Switch based on the surrounding context.</p>

          <p>Per-node colors (the <code>style</code> lines in the examples) override theme defaults. The fleet's pattern is to use the brand caramel <code>#5C2A4A</code> for emphasized nodes.</p>

          <h3>The strength: text-form means diff-able</h3>
          <p>
            A PNG of a diagram is opaque to <code>git diff</code>. A Mermaid string is plain text — code review tools
            can show what changed. When you update an architecture diagram, the diff is "added one arrow" instead of
            "the entire image changed." Huge win for documentation that lives alongside code.
          </p>

          <h3>The limitation: not interactive</h3>
          <p>Mermaid renders once on mount. No hover, no click. If you need an interactive flowchart, Mermaid isn't your tool — try react-flow or Cytoscape. For static documentation, Mermaid is optimal.</p>
        </section>

        <hr />

        {/* SECTION 9 — MERMAID COMPONENT */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Hearth's MermaidDiagram component</h2>
          <p>The whole React wrapper for Mermaid is 50 lines. It's a great study in how to integrate an imperative library into React's lifecycle.</p>

          <h3>The full component</h3>
          <CodePre>{`// src/KnowledgeBase/components/MermaidDiagram.tsx — verbatim
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

let mermaidInitialized = false;
let currentTheme: 'default' | 'dark' = 'dark';

function ensureInit(theme: 'default' | 'dark') {
  if (!mermaidInitialized || theme !== currentTheme) {
    mermaid.initialize({
      startOnLoad: false,
      theme,
      themeVariables: { fontFamily: 'system-ui, sans-serif' },
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true },
    });
    mermaidInitialized = true;
    currentTheme = theme;
  }
}

interface MermaidDiagramProps {
  chart: string;
  theme?: 'default' | 'dark';
}

let diagramCounter = 0;

export default function MermaidDiagram({ chart, theme = 'dark' }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(\`mmd-\${++diagramCounter}\`);

  useEffect(() => {
    let cancelled = false;
    ensureInit(theme);
    mermaid
      .render(idRef.current, chart)
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch(err => {
        if (!cancelled && ref.current) {
          ref.current.textContent = \`Mermaid render error: \${err?.message ?? err}\`;
        }
      });
    return () => {
      cancelled = true;
    };
  }, [chart, theme]);

  return <div className="mermaid" ref={ref} />;
}`}</CodePre>

          <h3>What's interesting</h3>

          <h4>Module-level singleton init</h4>
          <p>
            <code>mermaidInitialized</code> is a module-level boolean — initialization happens ONCE per browser session,
            shared across every <code>{`<MermaidDiagram>`}</code> instance. Mermaid's <code>initialize</code> is global
            state, so re-initializing per component would be wasteful (and would race-condition with concurrent renders).
          </p>

          <h4>Theme-change re-init</h4>
          <p>If the theme prop changes between renders, <code>ensureInit</code> re-calls <code>mermaid.initialize</code>. The effect re-runs because <code>theme</code> is in the dependency array.</p>

          <h4>Unique ID per instance</h4>
          <p>
            Mermaid's <code>render()</code> needs a unique ID — it creates an internal element with that ID, then
            extracts the resulting SVG. <code>diagramCounter</code> (incremented on each component mount) guarantees
            uniqueness. <code>idRef</code> persists the ID across re-renders so a single component keeps the same ID
            (avoids visual flicker).
          </p>

          <h4>The cancelled flag — the React 18 strict-mode killer</h4>
          <CodePre>{`let cancelled = false;
mermaid.render(...).then(({ svg }) => {
  if (!cancelled && ref.current) { ... }
});
return () => { cancelled = true };`}</CodePre>

          <p>
            React 18+ Strict Mode in dev double-runs effects (mount → unmount → mount). Without the cancelled flag,
            the first render's promise could resolve AFTER the second render's, causing a stale SVG to overwrite the
            fresh one. The cancelled flag in the cleanup closure prevents this. It's the same pattern you should use for
            ANY async effect in React.
          </p>

          <h4>innerHTML — controlled risk</h4>
          <p>
            <code>ref.current.innerHTML = svg</code> is normally a security smell. Here it's safe because Mermaid
            produces the SVG from a user-authored template literal — there's no untrusted input. If you ever rendered
            Mermaid from user-provided content (a wiki, a comment system), you'd need to either trust Mermaid's
            sanitization or wrap with DOMPurify.
          </p>

          <h4>Error handling</h4>
          <p>If the chart string is malformed (typo in syntax), Mermaid throws. The catch writes the error message into the div so the developer sees what's wrong rather than a blank space.</p>

          <h3>Why not <code>dangerouslySetInnerHTML</code></h3>
          <p>
            You could write the JSX as <code>{`<div dangerouslySetInnerHTML={{ __html: svg }} />`}</code> — but then
            React owns the markup, and re-renders during the async window would erase Mermaid's work. Imperatively
            setting <code>ref.current.innerHTML</code> outside of React's render loop avoids that race.
          </p>

          <h3>Bundle cost</h3>
          <p>
            Mermaid is ~600KB gzipped (it includes a parser + rendering engine + theme system). Hearth doesn't lazy-load
            it because guide bundles are themselves lazy-loaded — Mermaid only ships when a user opens a guide. Same
            tradeoff Tabloom makes for TipTap.
          </p>

          <h3>Cairn's version</h3>
          <p>
            Cairn has the same component, almost byte-identical — it was forked from Hearth's. If you maintain both,
            consider extracting to a shared library. For now, two copies is fine; the file is small.
          </p>
        </section>

        <hr />

        {/* SECTION 10 — PERFORMANCE */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Performance + Bundle Size</h2>

          <h3>Recharts bundle cost</h3>
          <p>Recharts is built on D3 internally and ships with all chart types in one package — no per-chart-type imports.</p>
          <ul>
            <li>Recharts 3.x: <strong>~120KB gzipped</strong> (when tree-shaken with Vite/Rollup)</li>
            <li>Without tree-shaking: ~280KB</li>
            <li>D3-shape, d3-scale, d3-array transitive dependencies dominate the bundle</li>
          </ul>

          <p>
            Vite tree-shakes by default — if you only use <code>BarChart</code> + <code>Bar</code>, you don't ship
            <code>RadarChart</code>'s code. But the D3 internals always come along. There's no "import just Pie" route.
          </p>

          <h3>Mermaid bundle cost</h3>
          <ul>
            <li>Mermaid 11.x: <strong>~600KB gzipped</strong> (parser + renderer + all diagram types)</li>
            <li>Heavier than Recharts because it includes a custom parser (chevrotain), a layout engine (dagre / elk), and per-diagram-type rendering</li>
          </ul>

          <p>
            If you only need flowcharts, you can import from <code>mermaid/dist/mermaid.esm.mjs</code> and tree-shake
            partially — but in practice the whole library comes along. For Hearth (one chunk per guide), this is fine;
            for an app where every page has a diagram, lazy-load the Mermaid component.
          </p>

          <h3>Recharts performance per render</h3>
          <p>Recharts renders to SVG. SVG is GPU-friendly for static drawing, but every chart re-render = full SVG re-paint:</p>
          <ul>
            <li>Under 200 data points: imperceptible.</li>
            <li>200–2000: noticeable on slower devices, smooth on desktops.</li>
            <li>2000+: visible jank. Consider sub-sampling or switching to a Canvas-based library (e.g., Chart.js or D3 with custom Canvas rendering).</li>
          </ul>

          <p>The Animation prop (default <code>isAnimationActive=&#123;true&#125;</code>) interpolates entrance over 1500ms. For dashboards with many charts, disable it (<code>isAnimationActive=&#123;false&#125;</code>) to avoid CPU thrash.</p>

          <h3>Tooltip render cost</h3>
          <p>
            The tooltip re-renders on every mouse move. If your <code>content</code> prop is a heavy custom component,
            you'll feel it. Memoize the tooltip component with <code>React.memo</code>, or keep its render logic small.
          </p>

          <h3>Mermaid performance</h3>
          <p>One render per mount. The parser + layout pass dominates: ~50ms for a 10-node flowchart, ~300ms for a 50-node one. Not a hot-loop concern, but visible on cold start. For pages with 6+ diagrams, the loading time stacks.</p>

          <h3>Optimizations the fleet uses</h3>
          <ul>
            <li><strong>Lazy load guides.</strong> Hearth's <code>React.lazy</code> on each guide means Mermaid only ships when a guide loads.</li>
            <li><strong>Lazy load Reports.</strong> ShopKeep's Reports page is one chunk, lazy-loaded — Recharts only ships when a user opens Reports.</li>
            <li><strong>ResponsiveContainer debounce.</strong> ShopKeep uses default 50ms; tune up if charts feel sluggish on resize.</li>
            <li><strong>Memo expensive data computations.</strong> ShopKeep's <code>byCategory</code>, <code>byYear</code>, etc. are wrapped in <code>useMemo</code> so they don't recompute on unrelated re-renders.</li>
            <li><strong>Animation off for dashboards.</strong> When 10 charts on screen, set <code>isAnimationActive=&#123;false&#125;</code> on each.</li>
          </ul>

          <h3>The Vite chunk strategy</h3>
          <p>Hearth's <code>vite.config.ts</code> doesn't carve Mermaid into its own chunk (yet) — it ends up in whatever guide chunk first imports it. If multiple guides load, Mermaid is cached. A future optimization: pin Mermaid to its own vendor chunk so first guide pays the cost, subsequent guides reuse it.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Build a Trend Card</h2>
          <p>
            Build a self-contained "trend card" that combines a chart (ShopKeep-style line chart) and a Mermaid pipeline
            diagram (showing the data flow). ~80 lines of code. By the end you'll have used Recharts and Mermaid
            together, just like Hearth's KnowledgeBase guides do.
          </p>

          <h3>Setup</h3>
          <CodePre>{`npm install recharts mermaid`}</CodePre>

          <h3>Step 1 — fake some data</h3>
          <CodePre>{`// trendData.ts
export const trendData = [
  { day: 'Mon', value: 120, target: 100 },
  { day: 'Tue', value: 132, target: 100 },
  { day: 'Wed', value: 98,  target: 100 },
  { day: 'Thu', value: 145, target: 100 },
  { day: 'Fri', value: 108, target: 100 },
  { day: 'Sat', value: 92,  target: 100 },
  { day: 'Sun', value: 115, target: 100 },
]`}</CodePre>

          <h3>Step 2 — the chart component</h3>
          <CodePre>{`// TrendChart.tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { trendData } from './trendData'

export function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={trendData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE5" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9C8476' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#9C8476' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [\`\${v} units\`, 'Value']} />
        <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="3 2" label={{ value: 'Target', fontSize: 9, fill: '#22c55e' }} />
        <Line type="monotone" dataKey="value" stroke="#C17A2E" strokeWidth={2.5} dot={{ r: 4, fill: '#C17A2E' }} />
      </LineChart>
    </ResponsiveContainer>
  )
}`}</CodePre>

          <h3>Step 3 — the Mermaid pipeline component</h3>
          <CodePre>{`// PipelineDiagram.tsx
import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

let initialized = false
let counter = 0

export function PipelineDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const idRef = useRef(\`pl-\${++counter}\`)

  useEffect(() => {
    let cancelled = false
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: 'default' })
      initialized = true
    }
    mermaid.render(idRef.current, \`graph LR
      Sensor[Sensor] --> Ingest[Ingest API]
      Ingest --> Cache[(Cache)]
      Cache --> Chart[Recharts Line]
      style Chart fill:#C17A2E,color:#fff
    \`).then(({ svg }) => {
      if (!cancelled && ref.current) ref.current.innerHTML = svg
    })
    return () => { cancelled = true }
  }, [])

  return <div ref={ref} style={{ marginTop: 16 }} />
}`}</CodePre>

          <h3>Step 4 — compose into the card</h3>
          <CodePre>{`// TrendCard.tsx
import { TrendChart } from './TrendChart'
import { PipelineDiagram } from './PipelineDiagram'

export function TrendCard() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #EDE8E3',
      borderRadius: 14,
      padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      maxWidth: 600,
    }}>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>
        Daily Throughput
      </div>
      <div style={{ fontSize: '0.78rem', color: '#9C8476', marginBottom: 12 }}>
        7-day rolling, vs 100-unit target
      </div>
      <TrendChart />
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #EDE8E3' }} />
      <div style={{ fontSize: '0.82rem', color: '#5C3D2A', fontWeight: 600, marginBottom: 4 }}>
        How the data flows
      </div>
      <PipelineDiagram />
    </div>
  )
}`}</CodePre>

          <h3>What you should see</h3>
          <ol>
            <li>A card with a "Daily Throughput" header.</li>
            <li>A line chart with 7 days of values, target ReferenceLine at 100.</li>
            <li>Below the chart, a Mermaid flow diagram: Sensor → Ingest API → Cache → Recharts Line.</li>
            <li>The "Recharts Line" node is highlighted in brand caramel.</li>
            <li>Hover the line: tooltip with "X units, Value."</li>
          </ol>

          <h3>Extensions</h3>
          <ul>
            <li>Add a second Line series (rolling average).</li>
            <li>Make the chart click-drillable — onClick the data point logs to console.</li>
            <li>Theme the Mermaid diagram <code>dark</code>; observe how the colors change.</li>
            <li>Wrap TrendChart and PipelineDiagram in <code>React.memo</code> to skip re-renders.</li>
            <li>Add an AreaChart variant with a gradient fill (use ShopKeep's <code>{`<defs>`}</code> pattern).</li>
          </ul>

          <p>If you can build the lab, you can ship any of ShopKeep's Reports charts or any of Hearth's KnowledgeBase diagrams.</p>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"My chart is blank / 0 pixels tall"</h3>
          <p>
            ResponsiveContainer needs height. Either the parent has <code>height: 260</code> (and ResponsiveContainer
            <code>height="100%"</code>), OR ResponsiveContainer has an explicit number <code>height=&#123;260&#125;</code>.
            Both empty = collapsed chart.
          </p>

          <h3>"My data isn't showing on the chart"</h3>
          <ul>
            <li><strong>Is the <code>dataKey</code> right?</strong> If your row is <code>&#123; spend: 1200 &#125;</code> and your Bar has <code>dataKey="value"</code>, no bar will appear.</li>
            <li><strong>Are the values numbers, not strings?</strong> <code>{`"1200"`}</code> as a string makes Recharts treat the axis as categorical, not numeric. Coerce with <code>Number(x)</code>.</li>
            <li><strong>Did the array re-create?</strong> If you compute the data inline without <code>useMemo</code>, every render gives Recharts a "new" array — usually fine, occasionally causes animation flicker.</li>
          </ul>

          <h3>"The axis labels are clipped"</h3>
          <p>The margin is too tight. Increase <code>margin=&#123;&#123; left: 20, bottom: 20 &#125;&#125;</code> on the chart wrapper. Specifically:</p>
          <ul>
            <li><code>left: 20</code> for visible Y axis labels</li>
            <li><code>bottom: 20</code> for rotated X axis labels (e.g., <code>angle=&#123;-40&#125; textAnchor="end"</code>)</li>
            <li><code>right: 10</code> to stop the rightmost X label from clipping</li>
          </ul>

          <h3>"The tooltip is on the wrong z-index"</h3>
          <p>Recharts tooltips render INSIDE the chart container. If a sibling element overlaps, the tooltip can be covered. Move the chart container or set <code>{`position: 'relative', zIndex: 2`}</code> on it.</p>

          <h3>"Mermaid throws 'parse error'"</h3>
          <p>
            Mermaid's parser is whitespace-sensitive. Indentation matters in a multi-line graph definition. Also, some
            characters trigger parser issues — labels containing parens, slashes, or quotes need to be wrapped:
          </p>
          <CodePre>{`graph LR
  A["Label with (parens)"] --> B[Plain label]`}</CodePre>

          <p>Always use double-quote brackets for labels with special chars.</p>

          <h3>"Mermaid renders as text, not a diagram"</h3>
          <p>Two causes:</p>
          <ul>
            <li><strong><code>mermaid.initialize</code> never ran.</strong> Check that <code>startOnLoad: false</code> + an explicit <code>render()</code> call are present.</li>
            <li><strong>The string has incorrect newlines.</strong> If you template-literal-build the chart string but interpolate values without preserving newlines, the parser sees one mega-line and fails silently.</li>
          </ul>

          <h3>"Recharts animation flickers on resize"</h3>
          <p>ResponsiveContainer's resize triggers a re-render, which restarts the animation. Set <code>isAnimationActive=&#123;false&#125;</code> on the visual elements. For dashboards with many charts, you almost always want this.</p>

          <h3>"My custom tooltip flickers between charts"</h3>
          <p>Custom tooltips re-mount on every chart hover. If the tooltip has heavy state or makes API calls, that's a problem. Move state OUT of the tooltip and read from a shared context, or memoize the tooltip component.</p>

          <h3>"Mobile pinch-zoom breaks the chart"</h3>
          <p>SVGs zoom with the page by default. Wrap the chart in <code>{`<div style={{ touchAction: 'pan-y' }}>`}</code> to allow vertical scroll but block pinch zoom from breaking out of the chart bounds.</p>

          <h3>"Stacked bar order is wrong"</h3>
          <p>Stacked bars stack in the order of the <code>{`<Bar>`}</code> children. Reorder the JSX, not the data. Same goes for <code>{`<Line>`}</code> series — the LAST line in the JSX draws on top.</p>

          <h3>"The Pie chart goes off-screen on mobile"</h3>
          <p>The Pie's <code>cx</code> / <code>cy</code> are usually percentages. On a narrow viewport, <code>cx="42%"</code> (which makes room for a right-aligned legend) leaves the pie cut off when the legend disappears. Use <code>useIsMobile()</code> to set <code>cx="50%"</code> on mobile and <code>cx="42%"</code> on desktop.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Imports — Recharts essentials</h3>
          <CodePre>{`import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, ScatterChart, Scatter, ComposedChart,
  XAxis, YAxis, ZAxis, CartesianGrid,
  Tooltip, Legend, Cell, LabelList,
  ReferenceLine, ReferenceArea,
  ResponsiveContainer,
} from 'recharts'`}</CodePre>

          <h3>The chart skeleton</h3>
          <CodePre>{`<ResponsiveContainer width="100%" height={260}>
  <BarChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#C17A2E" radius={[5, 5, 0, 0]} />
  </BarChart>
</ResponsiveContainer>`}</CodePre>

          <h3>Horizontal bars</h3>
          <CodePre>{`<BarChart layout="vertical" data={data}>
  <XAxis type="number" />
  <YAxis type="category" dataKey="brand" width={100} />
  <Bar dataKey="total" />
</BarChart>`}</CodePre>

          <h3>Per-bar Cell coloring</h3>
          <CodePre>{`<Bar dataKey="value">
  {data.map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
</Bar>`}</CodePre>

          <h3>Area with gradient fill</h3>
          <CodePre>{`<defs>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%"  stopColor="#C17A2E" stopOpacity={0.35} />
    <stop offset="95%" stopColor="#C17A2E" stopOpacity={0.02} />
  </linearGradient>
</defs>
<Area type="monotone" dataKey="cumulative" stroke="#C17A2E" fill="url(#g)" />`}</CodePre>

          <h3>Donut</h3>
          <CodePre>{`<Pie data={data} dataKey="value" nameKey="cat" innerRadius={58} outerRadius={96} paddingAngle={2}>
  {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
</Pie>`}</CodePre>

          <h3>Multi-line chart with reference lines</h3>
          <CodePre>{`<LineChart data={data}>
  <ReferenceLine y={70}  stroke="#ef4444" strokeDasharray="3 2" />
  <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="3 2" />
  <Line dataKey="avg" stroke="#0ea5e9" strokeWidth={2} dot={false} connectNulls />
  <Line dataKey="fastAvg" stroke="#8b5cf6" strokeDasharray="4 2" dot={false} connectNulls />
</LineChart>`}</CodePre>

          <h3>Composed chart (bar + line)</h3>
          <CodePre>{`<ComposedChart data={data}>
  <Bar dataKey="raw" fill="#E8C99A" />
  <Line type="monotone" dataKey="rolling" stroke="#C17A2E" strokeWidth={2.5} dot={false} />
</ComposedChart>`}</CodePre>

          <h3>Custom tooltip</h3>
          <CodePre>{`const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#fff', border:'1px solid #ddd', padding:8 }}>
      <strong>{label}</strong>
      {payload.map(p => <div key={p.dataKey}>{p.name}: {p.value}</div>)}
    </div>
  )
}

<Tooltip content={<Tip />} />`}</CodePre>

          <h3>Click handler with type assertion</h3>
          <CodePre>{`<Bar dataKey="total" cursor="pointer"
  onClick={(e: unknown) => drill((e as { year: string }).year)}
/>`}</CodePre>

          <h3>Mermaid — flowchart</h3>
          <CodePre>{`graph LR
  A[App] --> API[API Server]
  API --> DB[(Database)]
  style A fill:#5C2A4A,color:#fff`}</CodePre>

          <h3>Mermaid — sequence</h3>
          <CodePre>{`sequenceDiagram
  participant U as User
  participant A as API
  U->>A: POST /login
  A-->>U: 200 + token`}</CodePre>

          <h3>Mermaid — decision tree</h3>
          <CodePre>{`graph TD
  Q1{Continuous time?}
  Q1 -->|yes| LC[LineChart]
  Q1 -->|no| Q2{Categories?}
  Q2 -->|yes| BC[BarChart]
  Q2 -->|no| SC[ScatterChart]`}</CodePre>

          <h3>Mermaid component (Hearth pattern)</h3>
          <CodePre>{`<MermaidDiagram theme="default" chart={\`graph LR
  A --> B
\`} />`}</CodePre>

          <h3>The fleet's chart palette</h3>
          <table>
            <tbody>
              <tr><th>Token</th><th>Value</th><th>Use for</th></tr>
              <tr><td>ACCENT</td><td>#C17A2E</td><td>Primary chart color, brand caramel</td></tr>
              <tr><td>ACCENT_SOFT</td><td>#E8C99A</td><td>De-emphasized bars (prior years)</td></tr>
              <tr><td>Grid stroke</td><td>#F0EBE5</td><td>Subtle background grid</td></tr>
              <tr><td>Tick fill</td><td>#9C8476</td><td>Muted axis labels</td></tr>
              <tr><td>OK / In range</td><td>#22c55e</td><td>ReferenceLine "normal"</td></tr>
              <tr><td>Warning</td><td>#F59E0B</td><td>ReferenceLine "high"</td></tr>
              <tr><td>Error / Low</td><td>#EF4444</td><td>ReferenceLine "low"</td></tr>
            </tbody>
          </table>

          <h3>When to reach for which</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  D[Have data?]
  D -->|yes| R[Recharts]
  D -->|no — show a flow| M[Mermaid]
  R --> SHIP[interactive chart]
  M --> DOC[static SVG diagram]
  style R fill:#5C2A4A,color:#fff
  style M fill:#5C2A4A,color:#fff`} />
        </section>
      </main>
    </div>
  );
}
