import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'What We’re Building', icon: '🎯' },
  { id: 's2',  num: '2',  title: 'New Project',            icon: '🆕' },
  { id: 's3',  num: '3',  title: 'The Bill Amount',        icon: '💵' },
  { id: 's4',  num: '4',  title: 'Tip Percentage',         icon: '％' },
  { id: 's5',  num: '5',  title: 'The Math',               icon: '🧮' },
  { id: 's6',  num: '6',  title: 'Lay It Out',             icon: '📐' },
  { id: 's7',  num: '7',  title: 'Split the Bill',         icon: '👥' },
  { id: 's8',  num: '8',  title: 'Polish',                 icon: '✨' },
  { id: 's9',  num: '9',  title: 'Run It',                 icon: '▶️' },
  { id: 's10', num: '✦',  title: 'Recap & Next Steps',     icon: '📋' },
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

function Note({ children, kind = 'info' }: { children: React.ReactNode; kind?: 'info' | 'warn' }) {
  return (
    <div className={`alert ${kind === 'warn' ? 'warn' : 'info'}`}>
      <span className="alert-icon">{kind === 'warn' ? '⚠️' : '💡'}</span>
      <div>{children}</div>
    </div>
  );
}

export default function FirstAppTipGuide() {
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
            <span className="sidebar-title">First App: Tip Calculator</span>
          </div>
          <div className="sidebar-sub">Build it from scratch</div>
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
          <div className="hero-tag">💵 Build Your First App · 2026</div>
          <h1>Build a Tip Calculator<br />(your first real app)</h1>
          <p>
            Time to build something that works. A <strong style={{ color: '#C77AA0' }}>tip calculator</strong> is the
            perfect first app: one screen, a few inputs, and a number that recalculates live as you type. By the end
            you'll have used <code>@State</code>, <code>TextField</code>, <code>Picker</code>, <code>Stepper</code>,
            computed values, and currency formatting — and watched it all run on the Simulator. Do the{' '}
            <strong style={{ color: '#C77AA0' }}>Xcode</strong> and <strong style={{ color: '#C77AA0' }}>SwiftUI
            Fundamentals</strong> guides first; this one assumes you've seen those words once.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">1</span><span className="hero-stat-label">Screen</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~40</span><span className="hero-stat-label">Lines of code</span></div>
            <div className="hero-stat"><span className="hero-stat-val">Live</span><span className="hero-stat-label">Recalculates as you type</span></div>
            <div className="hero-stat"><span className="hero-stat-val">30m</span><span className="hero-stat-label">Start to finish</span></div>
          </div>
        </div>

        {/* SECTION 1 — WHAT */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>What We're Building</h2>
          <p>A single screen with:</p>
          <ul>
            <li>A field to type the <strong>bill amount</strong>.</li>
            <li>A <strong>tip percentage</strong> picker (10% / 15% / 18% / 20% / 25%).</li>
            <li>A <strong>number-of-people</strong> stepper to split the bill.</li>
            <li>A results area showing the <strong>tip</strong>, the <strong>total</strong>, and the
              <strong> per-person</strong> amount — all updating instantly as you change anything.</li>
          </ul>
          <MermaidDiagram theme="default" chart={`graph TB
  subgraph Screen["Tip Calculator screen"]
    BILL[Bill amount field] --> CALC{recalculate}
    TIP[Tip % picker] --> CALC
    PPL[People stepper] --> CALC
    CALC --> OUT[Tip · Total · Per person]
  end`} />
          <Note>
            The whole app is "inputs change → recalculate → show numbers." That's the SwiftUI loop from the
            fundamentals guide: state in, derived text out. You won't write any "update the label" code.
          </Note>
        </section>

        <hr />

        {/* SECTION 2 — NEW PROJECT */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>New Project</h2>
          <ol>
            <li>Xcode → <strong>File → New → Project</strong> (<code>⇧⌘N</code>).</li>
            <li>Choose <strong>iOS → App</strong> → <strong>Next</strong>.</li>
            <li>Product Name: <code>TipCalculator</code>. Interface: <strong>SwiftUI</strong>. Language: <strong>Swift</strong>.</li>
            <li><strong>Next</strong> → pick a folder → <strong>Create</strong>.</li>
            <li>Open <code>ContentView.swift</code> and delete the starter body so you have an empty canvas to build on:</li>
          </ol>
          <CodePre>{`import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Tip Calculator")
    }
}

#Preview {
    ContentView()
}`}</CodePre>
          <p>Run it once (<code>⌘R</code>) to confirm the project works, then come back. We'll add pieces one at a time.</p>
        </section>

        <hr />

        {/* SECTION 3 — BILL */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The Bill Amount</h2>
          <p>
            First, a place to store the bill, and a field to type it. The bill is a decimal number, so it's a
            <code> Double</code>, and it changes, so it's <code>@State</code>:
          </p>
          <CodePre>{`struct ContentView: View {
    @State private var bill = 0.0

    var body: some View {
        Form {
            Section("Bill") {
                TextField("Amount", value: $bill, format: .currency(code: "USD"))
                    .keyboardType(.decimalPad)
            }
        }
    }
}`}</CodePre>
          <p>Three things to notice:</p>
          <ul>
            <li><code>value: $bill</code> — the <code>$</code> binding lets the field write what you type back into
              <code> bill</code>. <code>format: .currency(code: "USD")</code> makes it show and parse like money.</li>
            <li><code>.keyboardType(.decimalPad)</code> — brings up the number pad instead of the full keyboard.</li>
            <li><code>Form</code> + <code>Section</code> — gives you the grouped, rounded iPhone-settings look for free.</li>
          </ul>
          <Note>
            Run it now. The decimal pad has no "Return" key to dismiss it — that's normal on this simple screen; tapping
            another control or the picker (next step) moves focus. We'll keep it simple and not chase keyboard dismissal
            here.
          </Note>
        </section>

        <hr />

        {/* SECTION 4 — TIP % */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Tip Percentage</h2>
          <p>Add state for the tip percent and a <code>Picker</code> to choose it. We'll store it as a decimal (0.15 = 15%):</p>
          <CodePre>{`@State private var bill = 0.0
@State private var tipPercent = 0.15

let tipOptions = [0.10, 0.15, 0.18, 0.20, 0.25]`}</CodePre>
          <p>Then a new section with the picker:</p>
          <CodePre>{`Section("Tip") {
    Picker("Tip percentage", selection: $tipPercent) {
        ForEach(tipOptions, id: \\.self) { percent in
            Text(percent, format: .percent).tag(percent)
        }
    }
    .pickerStyle(.segmented)
}`}</CodePre>
          <ul>
            <li><code>selection: $tipPercent</code> — the binding the picker writes the chosen value into.</li>
            <li><code>ForEach(tipOptions…)</code> — one option per value in our list. <code>.tag(percent)</code> marks
              which value each option represents.</li>
            <li><code>Text(percent, format: .percent)</code> — shows <code>0.15</code> as "15%" automatically.</li>
            <li><code>.pickerStyle(.segmented)</code> — the row-of-buttons style. Try removing it to see the default
              dropdown style instead.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 5 — MATH */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>The Math</h2>
          <p>
            Now the heart of it. We don't store the tip and total — we <strong>compute</strong> them from the inputs, so
            they're always correct. Add these <strong>computed properties</strong> to the struct (alongside the
            <code> body</code>, not inside it):
          </p>
          <CodePre>{`var tipAmount: Double {
    bill * tipPercent
}

var total: Double {
    bill + tipAmount
}`}</CodePre>
          <p>
            A computed property has no stored value — the code after the braces runs every time it's read. Because they
            read <code>bill</code> and <code>tipPercent</code> (both <code>@State</code>), they recalculate
            automatically whenever you change an input. <strong>That's the whole trick — no update code, ever.</strong>
          </p>
          <p>Now show them. Add a results section:</p>
          <CodePre>{`Section("Result") {
    LabeledContent("Tip", value: tipAmount, format: .currency(code: "USD"))
    LabeledContent("Total", value: total, format: .currency(code: "USD"))
}`}</CodePre>
          <p>
            <code>LabeledContent</code> shows a label on the left and a value on the right — perfect for a results row.
            The <code>.currency</code> format turns the raw number into "$12.34". Run it: type a bill, tap a tip
            percent, and watch Tip and Total fill in live.
          </p>
          <Note>
            <strong>Why computed instead of @State?</strong> The tip and total are <em>derived</em> from other values —
            they're never typed directly. Storing them would mean keeping them in sync by hand (and getting it wrong).
            Compute anything you can derive; only store what the user directly controls.
          </Note>
        </section>

        <hr />

        {/* SECTION 6 — LAYOUT */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Lay It Out</h2>
          <p>Wrap everything in a <code>NavigationStack</code> to get a title bar, and here's the screen so far in one piece:</p>
          <CodePre>{`import SwiftUI

struct ContentView: View {
    @State private var bill = 0.0
    @State private var tipPercent = 0.15

    let tipOptions = [0.10, 0.15, 0.18, 0.20, 0.25]

    var tipAmount: Double { bill * tipPercent }
    var total: Double { bill + tipAmount }

    var body: some View {
        NavigationStack {
            Form {
                Section("Bill") {
                    TextField("Amount", value: $bill, format: .currency(code: "USD"))
                        .keyboardType(.decimalPad)
                }

                Section("Tip") {
                    Picker("Tip percentage", selection: $tipPercent) {
                        ForEach(tipOptions, id: \\.self) { percent in
                            Text(percent, format: .percent).tag(percent)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Section("Result") {
                    LabeledContent("Tip", value: tipAmount, format: .currency(code: "USD"))
                    LabeledContent("Total", value: total, format: .currency(code: "USD"))
                }
            }
            .navigationTitle("Tip Calculator")
        }
    }
}

#Preview {
    ContentView()
}`}</CodePre>
          <p>That's a complete, useful app. The next two sections add a nice extra and some polish.</p>
        </section>

        <hr />

        {/* SECTION 7 — SPLIT */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Split the Bill</h2>
          <p>Let's split the total across people. Add state and a <code>Stepper</code> (the minus/plus control):</p>
          <CodePre>{`@State private var people = 1`}</CodePre>
          <p>A computed per-person amount — note we convert the <code>Int</code> count to a <code>Double</code> to divide:</p>
          <CodePre>{`var perPerson: Double {
    total / Double(people)
}`}</CodePre>
          <p>Add a stepper to the Tip section (or its own section) and a per-person result row:</p>
          <CodePre>{`Section("Split") {
    Stepper("People: \\(people)", value: $people, in: 1...20)
}

// add inside the "Result" section:
LabeledContent("Per person", value: perPerson, format: .currency(code: "USD"))`}</CodePre>
          <ul>
            <li><code>Stepper("People: \\(people)", value: $people, in: 1...20)</code> — shows the count and gives
              minus/plus buttons, clamped between 1 and 20 so you can't divide by zero.</li>
            <li><code>Double(people)</code> — Swift won't let you divide a <code>Double</code> by an <code>Int</code>;
              converting is explicit on purpose. Forgetting this is a super-common beginner compile error.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 8 — POLISH */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Polish</h2>
          <ul>
            <li><strong>Make the total stand out.</strong> Add modifiers to its row's value — e.g. wrap the total in its
              own <code>HStack</code> with <code>.font(.title2).bold().foregroundStyle(.green)</code> so it reads as the
              headline number.</li>
            <li><strong>Custom tip option.</strong> Swap the segmented picker for a <code>Slider</code>
              (<code>Slider(value: $tipPercent, in: 0...0.30, step: 0.01)</code>) and show
              <code> Text(tipPercent, format: .percent)</code> above it for any percentage.</li>
            <li><strong>App icon.</strong> Open <code>Assets.xcassets</code> → <strong>AppIcon</strong> and drag in a
              1024×1024 PNG. It appears on the home screen. (Free icon generators abound; any square image works.)</li>
            <li><strong>App display name.</strong> Click the blue project → target → <strong>General</strong> → Display
              Name to change what shows under the icon.</li>
          </ul>
          <Note>
            Polish is where you experiment. Change a <code>.font</code>, add a <code>.foregroundStyle</code>, reorder
            sections — the Canvas shows each change instantly. Breaking and fixing tiny things is exactly how the syntax
            sinks in.
          </Note>
        </section>

        <hr />

        {/* SECTION 9 — RUN */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Run It</h2>
          <ol>
            <li>Pick an iPhone Simulator in the toolbar and press <strong>▶ Run</strong> (<code>⌘R</code>).</li>
            <li>Type a bill amount, tap a tip percent, change the number of people — every number updates live.</li>
            <li>Rotate the Simulator (Device → Rotate) to see it adapt.</li>
          </ol>
          <h3>Run it on your own iPhone (optional)</h3>
          <p>
            Plug your iPhone into the Mac with a cable, trust the computer on the phone, then pick your phone in the
            toolbar's device list and Run. The first time, you'll approve the app on the phone under
            <strong> Settings → General → VPN &amp; Device Management</strong>. The full device-and-signing walkthrough
            (and TestFlight / App Store) is in the <strong>iOS Deployment Guide</strong> — this is just a taste.
          </p>
        </section>

        <hr />

        {/* SECTION 10 — RECAP */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">✦</span>Recap &amp; Next Steps</h2>
          <h3>What you just used</h3>
          <table>
            <tbody>
              <tr><th>Concept</th><th>Where</th></tr>
              <tr><td><code>@State</code> for inputs</td><td><code>bill</code>, <code>tipPercent</code>, <code>people</code></td></tr>
              <tr><td>Bindings (<code>$</code>)</td><td>Every <code>TextField</code> / <code>Picker</code> / <code>Stepper</code></td></tr>
              <tr><td>Computed properties</td><td><code>tipAmount</code>, <code>total</code>, <code>perPerson</code></td></tr>
              <tr><td>Formatting</td><td><code>.currency</code> and <code>.percent</code></td></tr>
              <tr><td>Layout containers</td><td><code>Form</code>, <code>Section</code>, <code>NavigationStack</code></td></tr>
              <tr><td>Type conversion</td><td><code>Double(people)</code></td></tr>
            </tbody>
          </table>
          <h3>Where to go next</h3>
          <ul>
            <li><strong>Build the To-Do List app</strong> (next guide) — adds a real data model, a scrollable list,
              adding/deleting rows, and saving data so it survives relaunch.</li>
            <li><strong>Experiment:</strong> add a "round up the total" toggle, or a second currency, or a history of
              recent bills.</li>
            <li>When you're ready to put an app on the App Store, see the <strong>iOS Deployment Guide</strong>.</li>
          </ul>
          <p className="finished-marker">★ You built and ran a complete iPhone app from scratch. That's the milestone — everything else is more of the same, one new piece at a time.</p>
        </section>
      </main>
    </div>
  );
}
