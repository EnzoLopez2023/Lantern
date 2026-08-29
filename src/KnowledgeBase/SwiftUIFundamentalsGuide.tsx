import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                 icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Variables & Types',            icon: '📝' },
  { id: 's3',  num: '3',  title: 'Control Flow',                 icon: '🔀' },
  { id: 's4',  num: '4',  title: 'Enums',                        icon: '📦' },
  { id: 's5',  num: '5',  title: 'Structs & Classes',            icon: '🏛️' },
  { id: 's6',  num: '6',  title: 'Protocols & Extensions',       icon: '🔌' },
  { id: 's7',  num: '7',  title: 'Error Handling',               icon: '🚨' },
  { id: 's8',  num: '8',  title: 'Generics',                     icon: '🔣' },
  { id: 's9',  num: '9',  title: 'Closures In Depth',            icon: '🪄' },
  { id: 's10', num: '10', title: 'async/await',                  icon: '⏳' },
  { id: 's11', num: '11', title: 'Your First View',              icon: '👀' },
  { id: 's12', num: '12', title: 'Modifiers',                    icon: '🎨' },
  { id: 's13', num: '13', title: 'Layout: Stacks',               icon: '🧱' },
  { id: 's14', num: '14', title: 'Lazy Layouts & Grids',         icon: '🗄️' },
  { id: 's15', num: '15', title: '@State & Bindings',            icon: '🔄' },
  { id: 's16', num: '16', title: 'State Objects & Environment',  icon: '🌍' },
  { id: 's17', num: '17', title: 'Controls',                     icon: '🎛️' },
  { id: 's18', num: '18', title: 'Lists, ForEach & Actions',     icon: '📋' },
  { id: 's19', num: '19', title: 'Navigation',                   icon: '🧭' },
  { id: 's20', num: '20', title: 'TabView',                      icon: '📑' },
  { id: 's21', num: '21', title: 'Animations & Transitions',     icon: '✨' },
  { id: 's22', num: '22', title: 'Custom Views & Modifiers',     icon: '🧩' },
  { id: 's23', num: '23', title: 'Async Images & Networking',    icon: '🌐' },
  { id: 's24', num: '24', title: 'Accessibility',                icon: '♿' },
  { id: 's25', num: '?',  title: 'Common Pitfalls',              icon: '🩺' },
  { id: 's26', num: '✦',  title: 'Cheat Sheet',                  icon: '📋' },
  { id: 's27', num: '27', title: 'Properties & Observers',        icon: '🔭' },
  { id: 's28', num: '28', title: 'Functions Deep Dive',           icon: '🔧' },
  { id: 's29', num: '29', title: 'Collections: Set & Advanced',   icon: '🗃️' },
  { id: 's30', num: '30', title: 'String Manipulation',           icon: '🔤' },
  { id: 's31', num: '31', title: 'Custom Shapes & Drawing',       icon: '✏️' },
  { id: 's32', num: '32', title: 'Form & Input Patterns',         icon: '📄' },
  { id: 's33', num: '33', title: 'Focus & Keyboard',              icon: '⌨️' },
  { id: 's34', num: '34', title: 'App Lifecycle & Scene',         icon: '🌅' },
  { id: 's35', num: '35', title: 'SF Symbols & Icons',            icon: '🎯' },
  { id: 's36', num: '36', title: 'Combine Basics',                icon: '⚡' },
  { id: 's37', num: '37', title: 'Memory Management (ARC)',       icon: '🧹' },
  { id: 's38', num: '38', title: 'SwiftData Persistence',         icon: '💾' },
  { id: 's39', num: '39', title: 'Toolbar & Menus',               icon: '🛠️' },
  { id: 's40', num: '40', title: 'UIKit Interop',                 icon: '🔗' },
  { id: 's41', num: '41', title: 'Testing SwiftUI',               icon: '🧪' },
  { id: 's42', num: '42', title: 'Performance Tips',              icon: '🚀' },
  { id: 's43', num: '43', title: 'Operator Overloading',          icon: '➕' },
  { id: 's44', num: '44', title: 'Opaque Types & some/any',       icon: '🔍' },
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

function Note({ children, kind = 'info' }: { children: React.ReactNode; kind?: 'info' | 'warn' | 'good' }) {
  const icon = kind === 'warn' ? '⚠️' : kind === 'good' ? '✅' : '💡';
  const cls  = kind === 'warn' ? 'warn'  : kind === 'good' ? 'good' : 'info';
  return (
    <div className={`alert ${cls}`}>
      <span className="alert-icon">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export default function SwiftUIFundamentalsGuide() {
  const { readSections, currentSection, setRef, pct } = useGuideProgress(SECTIONS.map(s => s.id));
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
            <span className="sidebar-title">SwiftUI Fundamentals</span>
          </div>
          <div className="sidebar-sub">Swift language deep dive + SwiftUI</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          <div className="progress-label">{readSections.size} of {SECTIONS.length} sections read</div>
        </div>
        <div className="sidebar-search-wrap">
          <input type="search" className="sidebar-search" placeholder="Search this guide…"
            value={query} onChange={e => setQuery(e.target.value)} />
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
                <a key={s.id} href={`#${s.id}`}
                  className={`nav-item${readSections.has(s.id) ? ' done' : ''}${currentSection === s.id ? ' active' : ''}`}>
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
          <div className="hero-tag">🍊 Swift + SwiftUI · 2026</div>
          <h1>SwiftUI Fundamentals<br />(Swift language + building screens)</h1>
          <p>
            A complete foundation: first a thorough Swift language guide covering every construct you'll use
            daily, then all the SwiftUI patterns from a single <code>Text</code> view to navigation, animation,
            custom components, and async networking. Open Xcode alongside this and type the snippets into a
            new project's <code>ContentView.swift</code> — the live Canvas updates instantly.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">10</span><span className="hero-stat-label">Swift language sections</span></div>
            <div className="hero-stat"><span className="hero-stat-val">@State</span><span className="hero-stat-label">The one big idea</span></div>
            <div className="hero-stat"><span className="hero-stat-val">VHZ</span><span className="hero-stat-label">Three stack types</span></div>
            <div className="hero-stat"><span className="hero-stat-val">async</span><span className="hero-stat-label">Modern concurrency</span></div>
          </div>
        </div>

        {/* ─── S1 ─── */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            The old way of building UIs was <em>imperative</em>: create a label, add it to the screen, and when
            data changes, find that label again and update it. You manually orchestrate every change.
          </p>
          <p>
            SwiftUI is <strong>declarative</strong>: you describe what the screen should look like <em>for the
            current data</em>, and SwiftUI handles the drawing. When data changes, you don't touch the screen —
            SwiftUI re-reads your description and redraws exactly what changed.
          </p>
          <Note>
            <strong>A view is a function of its state.</strong> Same data in → same screen out. You never "update
            the label" — you change the data and let SwiftUI redraw. Internalize this one sentence and SwiftUI
            stops being mysterious.
          </Note>
          <MermaidDiagram theme="default" chart={`graph LR
  DATA[Your state / data] -->|SwiftUI reads| VIEW[View description]
  VIEW -->|SwiftUI draws| SCREEN[Screen]
  USER[User interaction] -->|changes| DATA`} />
          <p>
            Practically, you build screens from small pieces called <strong>views</strong>, arrange them with
            <strong> stacks</strong>, customize them with <strong>modifiers</strong>, and wire interactivity with
            <strong> state</strong>. The Swift language sections below give you the tools; the SwiftUI sections
            (starting at §11) show you how to use them.
          </p>
        </section>

        <hr />

        {/* ─── S2 ─── */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Variables &amp; Types</h2>

          <h3>let vs var</h3>
          <CodePre>{`let name = "Ada"      // constant — cannot be changed
var score = 0         // variable — can change
score = 10            // ✅ fine
// name = "Bob"       // ❌ error: cannot assign to a 'let'`}</CodePre>
          <p>
            Prefer <code>let</code> by default. Only use <code>var</code> when you know the value will change.
            The compiler will warn you about <code>var</code> declarations that are never mutated.
          </p>

          <h3>Type inference — Swift figures it out</h3>
          <CodePre>{`let city = "Charleston"     // String
let population = 150000    // Int
let latitude = 32.7765     // Double
let isCapital = false      // Bool

// You can be explicit when clarity helps:
let radius: Double = 5
let label: String = "Hello"`}</CodePre>

          <h3>The four primitive types</h3>
          <table>
            <tbody>
              <tr><th>Type</th><th>What it holds</th><th>Literal example</th></tr>
              <tr><td><code>String</code></td><td>Text</td><td><code>"hello"</code></td></tr>
              <tr><td><code>Int</code></td><td>Whole numbers (64-bit on modern devices)</td><td><code>42</code>, <code>-7</code></td></tr>
              <tr><td><code>Double</code></td><td>Decimal numbers (64-bit floating point)</td><td><code>3.14</code>, <code>-0.5</code></td></tr>
              <tr><td><code>Bool</code></td><td>True or false only</td><td><code>true</code>, <code>false</code></td></tr>
            </tbody>
          </table>

          <h3>String interpolation</h3>
          <CodePre>{`let count = 5
let name = "Ada"

let message = "Hello, \\(name)! You have \\(count) messages."
// → "Hello, Ada! You have 5 messages."

// Any expression works inside \\( ):
let summary = "That's \\(count * 2) items total."
let status = "User is \\(isLoggedIn ? "logged in" : "logged out")"

// Multi-line strings:
let body = """
    Dear \\(name),
    Your order of \\(count) items is ready.
    """  // triple-quote, opening """ must be on its own line`}</CodePre>

          <h3>Arrays</h3>
          <CodePre>{`var fruits: [String] = ["apple", "pear", "plum"]
// or use type inference:
var fruits = ["apple", "pear", "plum"]

fruits.append("kiwi")          // add one
fruits.insert("mango", at: 0)  // insert at index
fruits.remove(at: 1)           // remove "pear"
fruits.count                   // 3
fruits[0]                      // "mango"  (zero-indexed)
fruits.first                   // Optional("mango") — nil if empty
fruits.last                    // Optional("plum")
fruits.isEmpty                 // false
fruits.contains("apple")       // true
fruits.sorted()                // new sorted array (original unchanged)
fruits.filter { $0.count > 4 } // ["mango", "apple"]
fruits.map { $0.uppercased() } // ["MANGO", "APPLE", "PLUM"]`}</CodePre>

          <h3>Dictionaries</h3>
          <CodePre>{`var scores: [String: Int] = ["Alice": 95, "Bob": 87]
// or:
var scores = ["Alice": 95, "Bob": 87]

scores["Charlie"] = 91          // add or update
scores["Bob"] = nil             // remove
scores["Alice"]                 // Optional(95) — nil if missing
scores["Alice"] ?? 0            // 95 (or 0 if missing)
scores.count                    // 2
scores.keys                     // ["Alice", "Charlie"]
scores.values                   // [95, 91]`}</CodePre>

          <h3>Optionals — "maybe there's a value, maybe not"</h3>
          <p>
            A <code>String?</code> (note the <code>?</code>) might hold a string or might be <code>nil</code>.
            This is Swift's core safety system — it forces you to handle the "no value" case explicitly, eliminating
            a huge class of crashes.
          </p>
          <CodePre>{`var nickname: String? = nil
nickname = "Ace"

// Safe unwrap with if-let:
if let real = nickname {
    print("Hi \\(real)")      // only runs when there IS a value
} else {
    print("No nickname")
}

// Provide a fallback with ??:
let shown = nickname ?? "Anonymous"

// Guard for early exit (prefer this in functions):
func greet(nick: String?) {
    guard let nick else { return }   // exits if nil
    print("Hi \\(nick)")
}

// Optional chaining — safely access properties that might be nil:
let count = nickname?.count    // Int? — nil if nickname was nil
let upper = nickname?.uppercased()   // String? — nil or "ACE"

// Force-unwrap with ! — ONLY when you're 100% certain it's not nil:
let definite = nickname!   // crashes if nickname is nil
// Rule: almost never use ! in production code`}</CodePre>

          <h3>Tuples — lightweight grouping</h3>
          <CodePre>{`let point = (x: 3.0, y: 4.5)
print(point.x)   // 3.0

let (width, height) = (1920, 1080)   // destructuring

// Useful for returning multiple values from a function:
func minMax(in array: [Int]) -> (min: Int, max: Int) {
    return (array.min()!, array.max()!)
}
let result = minMax(in: [3, 1, 7, 2])
print(result.min)   // 1
print(result.max)   // 7`}</CodePre>
        </section>

        <hr />

        {/* ─── S3 ─── */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Control Flow</h2>

          <h3>if / else if / else</h3>
          <CodePre>{`let temperature = 72

if temperature > 85 {
    print("Hot")
} else if temperature > 65 {
    print("Comfortable")    // this runs
} else {
    print("Cold")
}

// Single-expression: use the ternary operator
let label = temperature > 65 ? "Warm" : "Cool"

// if as an expression (Swift 5.9+):
let mood: String = if temperature > 85 { "hot" } else { "cool" }`}</CodePre>

          <h3>guard — early exit</h3>
          <p>
            <code>guard</code> is like <code>if</code> but for the "must be true to continue" case. It reads
            better than deeply nested <code>if let</code> chains and is the standard pattern in functions that
            validate their inputs:
          </p>
          <CodePre>{`func processOrder(item: String?, quantity: Int) {
    guard !item.isNilOrEmpty else {
        print("No item specified")
        return   // guard always exits its scope on failure
    }
    guard quantity > 0 else {
        print("Quantity must be positive")
        return
    }
    guard let item else { return }   // now item is unwrapped
    // by here, both guards passed — item is a non-nil String
    print("Ordering \\(quantity) of \\(item)")
}

// guard let unwraps and keeps the variable in scope for the rest of the function:
func fetchUser(id: Int?) -> String {
    guard let id else { return "No ID provided" }
    // id is Int (not Int?) from here on
    return "User #\\(id)"
}`}</CodePre>

          <h3>for-in — iterate over sequences</h3>
          <CodePre>{`let fruits = ["apple", "pear", "plum"]

for fruit in fruits {
    print(fruit)
}

// With index using enumerated():
for (index, fruit) in fruits.enumerated() {
    print("\\(index): \\(fruit)")
}

// Ranges:
for i in 1...5 { print(i) }    // 1, 2, 3, 4, 5  (closed range)
for i in 1..<5 { print(i) }   // 1, 2, 3, 4      (half-open range)

// Stride for custom steps:
for i in stride(from: 0, to: 100, by: 25) {
    print(i)   // 0, 25, 50, 75
}

// Ignoring the loop variable:
for _ in 1...3 {
    print("hello")   // prints 3 times
}`}</CodePre>

          <h3>while / repeat-while</h3>
          <CodePre>{`var count = 0
while count < 5 {
    count += 1
}

// repeat-while runs the body at least once:
repeat {
    count -= 1
} while count > 0`}</CodePre>

          <h3>switch — powerful pattern matching</h3>
          <p>
            Swift's <code>switch</code> is far more powerful than other languages' — it handles ranges, tuples,
            type patterns, and value binding. Cases don't fall through by default (no <code>break</code> needed):
          </p>
          <CodePre>{`let score = 78

switch score {
case 90...100:
    print("A")
case 80..<90:
    print("B")
case 70..<80:
    print("C")   // this runs
case 60..<70:
    print("D")
default:
    print("F")
}

// Switch on strings:
let direction = "north"
switch direction {
case "north", "up":    // multiple values in one case
    print("going up")
case "south", "down":
    print("going down")
default:
    print("unknown direction")
}

// Value binding in switch:
let point = (2, 0)
switch point {
case (0, 0):
    print("origin")
case (let x, 0):
    print("on x-axis at \\(x)")   // this runs
case (0, let y):
    print("on y-axis at \\(y)")
case (let x, let y):
    print("at (\\(x), \\(y))")
}

// where clause for extra conditions:
switch score {
case let s where s >= 90:
    print("Excellent: \\(s)")
case let s where s >= 70:
    print("Good: \\(s)")   // this runs
default:
    print("Needs work")
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S4 ─── */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Enums</h2>
          <p>
            An <strong>enum</strong> (enumeration) defines a type with a fixed set of named cases. Use enums to
            make impossible states unrepresentable — instead of passing strings like <code>"north"</code>,
            <code>"south"</code>, use a type that only allows valid values.
          </p>

          <h3>Basic enum</h3>
          <CodePre>{`enum Direction {
    case north, south, east, west
}

var heading = Direction.north
heading = .south   // shorthand when type is already known

switch heading {
case .north: print("Going north")
case .south: print("Going south")
case .east:  print("Going east")
case .west:  print("Going west")
// No default needed — Swift knows all cases are covered
}`}</CodePre>

          <h3>Raw values — enums backed by a primitive</h3>
          <CodePre>{`enum Planet: Int {
    case mercury = 1   // raw value starts at 1
    case venus         // 2 (auto-incremented)
    case earth         // 3
    case mars          // 4
}

let earth = Planet.earth
earth.rawValue            // 3
Planet(rawValue: 2)       // Optional(Planet.venus)  — nil if no match
Planet(rawValue: 99)      // nil

// String raw values:
enum Season: String {
    case spring = "Spring"
    case summer = "Summer"
    case autumn = "Autumn"
    case winter = "Winter"
}

let s = Season.summer
s.rawValue        // "Summer"
Season(rawValue: "Winter")   // Optional(Season.winter)`}</CodePre>

          <h3>Associated values — enums that carry data</h3>
          <p>
            This is Swift's most powerful enum feature. Each case can carry different data — like a tagged union.
            This is the foundation of the <code>Result</code> type, SwiftUI's navigation, and network error handling.
          </p>
          <CodePre>{`enum NetworkResult {
    case success(data: Data, statusCode: Int)
    case failure(Error)
    case loading
}

var state = NetworkResult.loading
state = .success(data: someData, statusCode: 200)

switch state {
case .success(let data, let code):
    print("Got \\(data.count) bytes with status \\(code)")
case .failure(let error):
    print("Error: \\(error.localizedDescription)")
case .loading:
    print("Still loading…")
}

// Pattern matching with if-case:
if case .success(let data, _) = state {
    process(data)
}`}</CodePre>

          <h3>CaseIterable — loop over all cases</h3>
          <CodePre>{`enum Weekday: String, CaseIterable {
    case monday, tuesday, wednesday, thursday, friday, saturday, sunday
}

for day in Weekday.allCases {
    print(day.rawValue)
}

Weekday.allCases.count    // 7`}</CodePre>

          <h3>Enums with methods and computed properties</h3>
          <CodePre>{`enum TrafficLight {
    case red, yellow, green

    var isStopRequired: Bool {
        self == .red
    }

    var next: TrafficLight {
        switch self {
        case .red:    return .green
        case .green:  return .yellow
        case .yellow: return .red
        }
    }

    func describe() -> String {
        switch self {
        case .red:    return "Stop"
        case .yellow: return "Caution"
        case .green:  return "Go"
        }
    }
}

let light = TrafficLight.red
light.describe()     // "Stop"
light.next           // .green`}</CodePre>
        </section>

        <hr />

        {/* ─── S5 ─── */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Structs &amp; Classes</h2>

          <h3>Structs — value types</h3>
          <p>
            A <strong>struct</strong> groups related data into a named type. When you assign a struct to a new
            variable, you get a <em>copy</em> — changes to the copy don't affect the original. This makes structs
            safe to pass around without worrying about shared mutable state.
          </p>
          <CodePre>{`struct Recipe {
    let id: UUID = UUID()
    var title: String
    var ingredients: [String]
    var servings: Int

    // Computed property — recalculated on access, not stored
    var summary: String {
        "\\(title) (\\(servings) servings, \\(ingredients.count) ingredients)"
    }

    // Methods that modify stored properties must be marked mutating:
    mutating func addIngredient(_ item: String) {
        ingredients.append(item)
    }
}

var pasta = Recipe(title: "Pasta", ingredients: ["noodles"], servings: 4)
pasta.addIngredient("sauce")    // must be var, not let
pasta.summary   // "Pasta (4 servings, 2 ingredients)"

// Value semantics — copy on assignment:
var copy = pasta
copy.title = "Modified Pasta"
pasta.title   // still "Pasta"`}</CodePre>

          <h3>Classes — reference types</h3>
          <p>
            A <strong>class</strong> works similarly to a struct but uses <em>reference semantics</em>: assigning
            a class instance to a new variable gives you another reference to the <em>same object</em>. Changes
            are visible through all references.
          </p>
          <CodePre>{`class UserSession {
    var username: String
    var isLoggedIn: Bool = false

    init(username: String) {
        self.username = username
    }

    func logIn() {
        isLoggedIn = true
        print("\\(username) logged in")
    }
}

let session = UserSession(username: "Ada")
let reference = session     // NOT a copy — both point to same object

reference.logIn()
session.isLoggedIn   // true  (both see the change)`}</CodePre>

          <h3>Struct vs Class — which to use?</h3>
          <table>
            <tbody>
              <tr><th>Use <code>struct</code> when…</th><th>Use <code>class</code> when…</th></tr>
              <tr><td>Representing data (a Recipe, a Point, a User)</td><td>You need identity — two instances that are the "same thing"</td></tr>
              <tr><td>Value semantics are correct (copies are fine)</td><td>You need reference semantics (shared mutable state)</td></tr>
              <tr><td>SwiftUI views and models</td><td>A delegate pattern requires a class</td></tr>
              <tr><td>The default choice — prefer struct</td><td>Interoperating with Objective-C APIs</td></tr>
            </tbody>
          </table>

          <Note>
            <strong>Rule of thumb: start with struct.</strong> SwiftUI's <code>View</code> protocol requires
            structs. Most data models work perfectly as structs. Switch to a class only when you hit a specific
            need for reference semantics or inheritance.
          </Note>

          <h3>Initializers</h3>
          <CodePre>{`struct Point {
    var x: Double
    var y: Double

    // Memberwise init is auto-generated for structs:
    // Point(x: 1.0, y: 2.0) — works for free

    // Custom init:
    init(angle: Double, radius: Double) {
        self.x = radius * cos(angle)
        self.y = radius * sin(angle)
    }

    // Failable init — returns nil if inputs are invalid:
    init?(string: String) {
        let parts = string.split(separator: ",")
        guard parts.count == 2,
              let x = Double(parts[0]),
              let y = Double(parts[1]) else { return nil }
        self.x = x
        self.y = y
    }
}

let p1 = Point(x: 0, y: 0)         // memberwise
let p2 = Point(angle: .pi, radius: 5)
let p3 = Point(string: "3.0,4.0")  // Optional(Point)
let p4 = Point(string: "bad")      // nil`}</CodePre>

          <h3>Inheritance (classes only)</h3>
          <CodePre>{`class Animal {
    var name: String
    init(name: String) { self.name = name }
    func speak() -> String { "..." }
}

class Dog: Animal {
    override func speak() -> String { "Woof!" }
    func fetch() { print("\\(name) fetches the ball") }
}

let dog = Dog(name: "Rex")
dog.speak()    // "Woof!"
dog.fetch()    // "Rex fetches the ball"

// Type checking:
let animal: Animal = dog
animal is Dog        // true
animal as? Dog       // Optional(dog)`}</CodePre>
        </section>

        <hr />

        {/* ─── S6 ─── */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Protocols &amp; Extensions</h2>

          <h3>Protocols — define a contract</h3>
          <p>
            A <strong>protocol</strong> defines a set of requirements (properties and methods) that any conforming
            type must implement. Protocols are the foundation of Swift's composition system — you build behavior by
            mixing in protocols, not by deep inheritance hierarchies.
          </p>
          <CodePre>{`protocol Drawable {
    var color: String { get }      // must have a readable color property
    func draw()                    // must implement draw()
}

protocol Resizable {
    mutating func resize(by factor: Double)
}

// Conform by implementing the requirements:
struct Circle: Drawable, Resizable {
    var color: String
    var radius: Double

    func draw() {
        print("Drawing a \\(color) circle of radius \\(radius)")
    }

    mutating func resize(by factor: Double) {
        radius *= factor
    }
}

// Use the protocol as a type:
func render(_ shape: any Drawable) {
    shape.draw()
}

var c = Circle(color: "red", radius: 5.0)
render(c)       // "Drawing a red circle of radius 5.0"
c.resize(by: 2) // radius is now 10.0`}</CodePre>

          <h3>Common built-in protocols</h3>
          <table>
            <tbody>
              <tr><th>Protocol</th><th>What it gives you</th></tr>
              <tr><td><code>Identifiable</code></td><td>An <code>id</code> property. Required by <code>List</code> and <code>ForEach</code> for stable identity.</td></tr>
              <tr><td><code>Equatable</code></td><td><code>==</code> and <code>!=</code> operators.</td></tr>
              <tr><td><code>Comparable</code></td><td><code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Enables <code>.sorted()</code>.</td></tr>
              <tr><td><code>Hashable</code></td><td>Use as a dictionary key or <code>Set</code> element.</td></tr>
              <tr><td><code>Codable</code></td><td>Encode to / decode from JSON automatically. Combine of <code>Encodable</code> + <code>Decodable</code>.</td></tr>
              <tr><td><code>CustomStringConvertible</code></td><td>A <code>description</code> property that controls what <code>print()</code> shows.</td></tr>
            </tbody>
          </table>
          <CodePre>{`// Codable — automatic JSON encoding/decoding:
struct User: Codable, Identifiable, Equatable {
    let id: UUID
    var name: String
    var email: String
}

let user = User(id: UUID(), name: "Ada", email: "ada@example.com")

// Encode to JSON:
let data = try! JSONEncoder().encode(user)
let json = String(data: data, encoding: .utf8)!

// Decode from JSON:
let decoded = try! JSONDecoder().decode(User.self, from: data)
decoded.name   // "Ada"`}</CodePre>

          <h3>Protocol extensions — default implementations</h3>
          <CodePre>{`protocol Greetable {
    var name: String { get }
    func greet() -> String
}

// Default implementation — any conforming type gets this for free:
extension Greetable {
    func greet() -> String {
        "Hello, I'm \\(name)!"
    }
}

struct Person: Greetable {
    var name: String
    // greet() is provided by the extension — no need to implement it
}

let p = Person(name: "Ada")
p.greet()   // "Hello, I'm Ada!"`}</CodePre>

          <h3>Extensions — add functionality to existing types</h3>
          <CodePre>{`// Add a method to String (even though you don't own String):
extension String {
    var isValidEmail: Bool {
        contains("@") && contains(".")
    }

    func truncated(to maxLength: Int, trailing: String = "…") -> String {
        guard count > maxLength else { return self }
        return String(prefix(maxLength)) + trailing
    }
}

"ada@example.com".isValidEmail      // true
"notanemail".isValidEmail           // false
"This is a very long title".truncated(to: 10)   // "This is a…"

// Extend Int:
extension Int {
    var isEven: Bool { self % 2 == 0 }
    var doubled: Int { self * 2 }
}

4.isEven    // true
7.doubled   // 14`}</CodePre>
        </section>

        <hr />

        {/* ─── S7 ─── */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Error Handling</h2>

          <h3>Defining errors</h3>
          <CodePre>{`// Errors are types that conform to the Error protocol:
enum NetworkError: Error {
    case badURL
    case noConnection
    case serverError(statusCode: Int)
    case decodingFailed(reason: String)
}

enum ValidationError: Error, LocalizedError {
    case emptyField(fieldName: String)
    case tooShort(minimum: Int)

    // LocalizedError gives a user-friendly description:
    var errorDescription: String? {
        switch self {
        case .emptyField(let field): return "\\(field) cannot be empty."
        case .tooShort(let min): return "Must be at least \\(min) characters."
        }
    }
}`}</CodePre>

          <h3>Throwing and catching</h3>
          <CodePre>{`// Functions that can fail are marked throws:
func validateUsername(_ name: String) throws -> String {
    guard !name.isEmpty else {
        throw ValidationError.emptyField(fieldName: "username")
    }
    guard name.count >= 3 else {
        throw ValidationError.tooShort(minimum: 3)
    }
    return name.lowercased()
}

// Call with try — must be inside do/catch or propagate:
do {
    let clean = try validateUsername("Ad")
    print("Valid: \\(clean)")
} catch ValidationError.tooShort(let min) {
    print("Too short — need \\(min)+ characters")
} catch ValidationError.emptyField(let field) {
    print("\\(field) is empty")
} catch {
    // Catch-all: 'error' is the thrown value
    print("Unknown error: \\(error)")
}

// Propagate errors upward (the caller must handle it):
func saveUser(name: String) throws {
    let valid = try validateUsername(name)  // propagates if it throws
    // … save logic
}

// try? — converts failure to nil (silently drops the error):
let result = try? validateUsername("")   // nil

// try! — crashes on failure (only use when you're 100% sure it won't throw):
let guaranteed = try! validateUsername("ada")   // "ada"`}</CodePre>

          <h3>Result type — explicit success or failure</h3>
          <CodePre>{`// Result<Success, Failure> holds either a value or an error:
func fetchUser(id: Int) -> Result<User, NetworkError> {
    guard id > 0 else { return .failure(.badURL) }
    // ... networking ...
    return .success(User(id: UUID(), name: "Ada", email: "ada@test.com"))
}

let result = fetchUser(id: 1)
switch result {
case .success(let user):
    print("Got user: \\(user.name)")
case .failure(let error):
    print("Failed: \\(error)")
}

// Convert Result to throwing:
let user = try result.get()   // throws if .failure`}</CodePre>
        </section>

        <hr />

        {/* ─── S8 ─── */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Generics</h2>
          <p>
            Generics let you write functions and types that work with <em>any</em> type without losing type safety.
            They're what makes <code>Array&lt;T&gt;</code> work for both <code>[String]</code> and
            <code>[Recipe]</code>.
          </p>

          <h3>Generic functions</h3>
          <CodePre>{`// Without generics — only works for Int:
func swapInts(_ a: inout Int, _ b: inout Int) {
    let temp = a; a = b; b = temp
}

// With generics — works for any type T:
func swap<T>(_ a: inout T, _ b: inout T) {
    let temp = a; a = b; b = temp
}

var x = 3, y = 7
swap(&x, &y)   // x=7, y=3

var s1 = "hello", s2 = "world"
swap(&s1, &s2)   // s1="world", s2="hello"`}</CodePre>

          <h3>Generic types</h3>
          <CodePre>{`// A generic stack — works for any Element type:
struct Stack<Element> {
    private var items: [Element] = []

    mutating func push(_ item: Element) { items.append(item) }
    mutating func pop() -> Element? { items.popLast() }
    var top: Element? { items.last }
    var isEmpty: Bool { items.isEmpty }
    var count: Int { items.count }
}

var intStack = Stack<Int>()
intStack.push(1)
intStack.push(2)
intStack.pop()   // Optional(2)

var stringStack = Stack<String>()
stringStack.push("hello")
stringStack.top  // Optional("hello")`}</CodePre>

          <h3>Type constraints — require conformances</h3>
          <CodePre>{`// T must be Comparable to use < and >:
func largest<T: Comparable>(_ a: T, _ b: T) -> T {
    return a > b ? a : b
}

largest(3, 7)           // 7
largest("apple", "pear")  // "pear" (alphabetically)
// largest(Date(), "hello")  // ❌ compile error — types must match

// Multiple constraints with where:
func findFirst<C: Collection, T: Equatable>(in collection: C, matching value: T) -> T?
    where C.Element == T {
    return collection.first { $0 == value }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S9 ─── */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Closures In Depth</h2>
          <p>
            A <strong>closure</strong> is a self-contained block of functionality that can be stored and passed around.
            Functions are closures too — they're just named ones. Most SwiftUI code ends in a trailing closure.
          </p>

          <h3>Closure syntax spectrum</h3>
          <CodePre>{`// Full syntax:
let doubled = numbers.map({ (n: Int) -> Int in return n * 2 })

// Swift can infer the types:
let doubled = numbers.map({ n in return n * 2 })

// Single expression — return is implicit:
let doubled = numbers.map({ n in n * 2 })

// Shorthand argument names ($0 = first arg, $1 = second, etc.):
let doubled = numbers.map({ $0 * 2 })

// Trailing closure — if closure is the last argument, move it outside:
let doubled = numbers.map { $0 * 2 }

// All five lines do the same thing. Most Swift code uses trailing closures.`}</CodePre>

          <h3>Common higher-order functions</h3>
          <CodePre>{`let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// map — transform each element:
numbers.map { $0 * 2 }           // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter — keep only matching elements:
numbers.filter { $0.isMultiple(of: 2) }   // [2, 4, 6, 8, 10]

// reduce — combine all into one value:
numbers.reduce(0, +)              // 55 (sum)
numbers.reduce(1, *)              // 3628800 (product)

// compactMap — map and remove nils:
let strings = ["1", "two", "3", "four"]
strings.compactMap { Int($0) }    // [1, 3]

// flatMap — flatten nested arrays:
let nested = [[1, 2], [3, 4], [5]]
nested.flatMap { $0 }             // [1, 2, 3, 4, 5]

// sorted — with custom comparator:
let people = [("Bob", 30), ("Ada", 25), ("Charlie", 35)]
people.sorted { $0.1 < $1.1 }   // sorted by age ascending

// forEach — side effects (like for-in but functional style):
numbers.forEach { print($0) }`}</CodePre>

          <h3>Capture lists — controlling what closures capture</h3>
          <CodePre>{`class ViewModel {
    var count = 0

    func start() {
        // Without capture list — closure holds a strong reference to self:
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            self.count += 1   // self captured strongly → potential retain cycle
        }

        // With [weak self] — self might become nil, must unwrap:
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            self?.count += 1   // safe: if ViewModel is deallocated, no crash
        }

        // With [unowned self] — self must outlive the closure (use sparingly):
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [unowned self] _ in
            self.count += 1   // crashes if self was deallocated
        }
    }
}`}</CodePre>

          <h3>@escaping closures</h3>
          <CodePre>{`// A closure "escapes" when it's called after the function returns.
// Async callbacks always escape:
func fetchData(completion: @escaping (Data?) -> Void) {
    URLSession.shared.dataTask(with: url) { data, _, _ in
        completion(data)   // called after fetchData() has returned
    }.resume()
}

// Non-escaping closures (no @escaping) are simpler:
// - Can't be stored
// - Cannot create retain cycles
// - Compiler can optimize them better`}</CodePre>
        </section>

        <hr />

        {/* ─── S10 ─── */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>async/await &amp; Swift Concurrency</h2>
          <p>
            Swift's modern concurrency system replaces callback-based code with linear, readable async functions.
            You'll use this constantly in SwiftUI for network calls.
          </p>

          <h3>async functions and await</h3>
          <CodePre>{`// Mark a function async to allow awaiting inside it:
func fetchRecipes() async throws -> [Recipe] {
    let url = URL(string: "https://api.example.com/recipes")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([Recipe].self, from: data)
}

// await suspends the current task without blocking the thread.
// The thread is freed to do other work while waiting for the network.

// Call an async function with await:
func loadData() async {
    do {
        let recipes = try await fetchRecipes()
        print("Loaded \\(recipes.count) recipes")
    } catch {
        print("Failed: \\(error)")
    }
}`}</CodePre>

          <h3>Task — start async work from sync context</h3>
          <CodePre>{`// SwiftUI views are synchronous — start async work with Task:
struct RecipeListView: View {
    @State private var recipes: [Recipe] = []

    var body: some View {
        List(recipes) { r in Text(r.title) }
            .task {
                // .task modifier: starts a Task when view appears,
                // cancels it automatically when view disappears
                recipes = (try? await fetchRecipes()) ?? []
            }
    }
}

// Manual Task — fire and forget:
Task {
    let data = try await fetchSomething()
    // runs concurrently with whatever's next
}

// Task with priority:
Task(priority: .background) {
    await expensiveOperation()
}`}</CodePre>

          <h3>@MainActor — always run on the main thread</h3>
          <CodePre>{`// UI updates must happen on the main thread.
// Mark a class @MainActor to ensure all its methods run there:
@MainActor
class RecipeViewModel: ObservableObject {
    @Published var recipes: [Recipe] = []
    @Published var isLoading = false

    func load() async {
        isLoading = true
        defer { isLoading = false }
        recipes = (try? await fetchRecipes()) ?? []
        // All assignments above run on main thread — safe for @Published
    }
}

// Or mark a specific function:
func updateUI() async {
    await MainActor.run {
        self.label = "Done"   // explicitly hop to main
    }
}`}</CodePre>

          <h3>async let — parallel async work</h3>
          <CodePre>{`// Sequential (slow — waits for each one):
let recipes = try await fetchRecipes()
let user = try await fetchUser()

// Parallel with async let (both fire at the same time):
async let recipes = fetchRecipes()
async let user = fetchUser()
// Both run concurrently; await both at the end:
let (loadedRecipes, loadedUser) = try await (recipes, user)`}</CodePre>

          <h3>Actor — thread-safe shared state</h3>
          <CodePre>{`// An actor serializes access to its properties — no data races:
actor Counter {
    private var value = 0

    func increment() { value += 1 }
    func get() -> Int { return value }
}

let counter = Counter()

// Accessing actor methods requires await (may need to hop threads):
await counter.increment()
let v = await counter.get()`}</CodePre>
        </section>

        <hr />

        {/* ─── S11 ─── */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Your First View</h2>
          <p>
            Open a new project's <code>ContentView.swift</code>. The starter code:
          </p>
          <CodePre>{`import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, world!")
    }
}

#Preview {
    ContentView()
}`}</CodePre>
          <p>Every piece matters:</p>
          <ul>
            <li><code>import SwiftUI</code> — makes SwiftUI available.</li>
            <li><code>struct ContentView: View</code> — a struct that promises to be a <code>View</code>.</li>
            <li><code>var body: some View</code> — the description of what to draw. <code>some View</code> means "a specific type of view that I'll figure out" — don't overthink it.</li>
            <li><code>#Preview</code> — drives the Canvas; not part of the shipped app.</li>
          </ul>

          <h3>Primitive views</h3>
          <CodePre>{`Text("Hello")                          // displays text
Text("Bold").bold()                    // bold text
Text("Styled").font(.largeTitle).foregroundStyle(.blue)

Image(systemName: "star.fill")         // SF Symbol icon
Image("my-photo")                      // from Assets.xcassets
Image("my-photo").resizable().scaledToFit()

Color.red                              // fills available space with color
Color("brandPrimary")                  // named color from Assets
Rectangle().fill(.blue).frame(height: 2)  // a line

Spacer()                               // flexible gap
Divider()                              // horizontal line`}</CodePre>

          <h3>Combining views</h3>
          <CodePre>{`struct ProfileCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: "person.circle.fill")
                .font(.system(size: 60))
                .foregroundStyle(.blue)
            Text("Ada Lovelace")
                .font(.title2)
                .fontWeight(.semibold)
            Text("First programmer")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(.rect(cornerRadius: 16))
        .shadow(radius: 8)
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S12 ─── */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Modifiers</h2>
          <p>
            Modifiers transform views. Each returns a new modified view, so you chain them with dots. Order matters —
            modifiers wrap the result of the one above.
          </p>

          <h3>Essential modifiers</h3>
          <CodePre>{`Text("Hello")
    .font(.largeTitle)
    .fontWeight(.bold)
    .italic()
    .foregroundStyle(.indigo)
    .multilineTextAlignment(.center)
    .lineLimit(3)
    .truncationMode(.tail)
    .padding()                          // equal padding all sides
    .padding(.horizontal, 24)           // horizontal padding only
    .padding(.top, 8)                   // top only
    .frame(width: 200, height: 50)      // fixed size
    .frame(maxWidth: .infinity)         // stretch to fill width
    .frame(minHeight: 44)               // at least 44pt tall
    .background(.yellow)
    .background(.ultraThinMaterial)     // frosted glass effect
    .overlay(alignment: .topTrailing) { // layer something on top
        Circle().fill(.red).frame(width: 12)
    }
    .clipShape(.rect(cornerRadius: 12)) // rounded rectangle
    .clipShape(.circle)                 // circular clip
    .border(.gray, width: 1)
    .shadow(color: .black.opacity(0.2), radius: 8, x: 0, y: 4)
    .opacity(0.8)
    .scaleEffect(1.2)
    .rotationEffect(.degrees(45))
    .offset(x: 10, y: -5)`}</CodePre>

          <h3>Order matters — a key example</h3>
          <CodePre>{`// Padding INSIDE the background:
Text("Hello")
    .padding()
    .background(.yellow)   // yellow fills the padded area (chunky yellow box)

// Background INSIDE the padding:
Text("Hello")
    .background(.yellow)   // yellow hugs just the text
    .padding()             // clear space outside the yellow`}</CodePre>

          <h3>Conditional modifiers</h3>
          <CodePre>{`// Don't use if-else inline — use a ternary or .if extension:
Text("Status")
    .foregroundStyle(isActive ? .green : .gray)
    .fontWeight(isSelected ? .bold : .regular)

// For conditionally adding/removing a modifier entirely:
@ViewBuilder
var conditionalView: some View {
    if showBorder {
        myView.border(.red)
    } else {
        myView
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S13 ─── */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>Layout: Stacks</h2>
          <table>
            <tbody>
              <tr><th>Stack</th><th>Direction</th><th>Use for</th></tr>
              <tr><td><code>VStack</code></td><td>Top → Bottom</td><td>Vertical layouts: forms, cards, lists</td></tr>
              <tr><td><code>HStack</code></td><td>Left → Right</td><td>Rows: icon + label, stat pairs</td></tr>
              <tr><td><code>ZStack</code></td><td>Front → Back (layered)</td><td>Overlays, badges, backgrounds behind text</td></tr>
            </tbody>
          </table>

          <CodePre>{`VStack(alignment: .leading, spacing: 12) {
    Text("Title").font(.title)
    Text("Subtitle").foregroundStyle(.secondary)
}

HStack(alignment: .center, spacing: 8) {
    Image(systemName: "star.fill").foregroundStyle(.yellow)
    Text("Favorite")
    Spacer()              // pushes content to left edge
    Text("4.9").bold()
}

ZStack(alignment: .topTrailing) {
    Image("product-photo").resizable().scaledToFill()
    Text("NEW")
        .font(.caption).bold()
        .padding(4)
        .background(.red)
        .foregroundStyle(.white)
        .clipShape(.capsule)
}`}</CodePre>

          <h3>Alignment guides</h3>
          <CodePre>{`// VStack alignment options:
VStack(alignment: .leading) { … }   // left edge
VStack(alignment: .center) { … }    // centered (default)
VStack(alignment: .trailing) { … }  // right edge

// HStack alignment:
HStack(alignment: .top) { … }
HStack(alignment: .center) { … }    // default
HStack(alignment: .bottom) { … }
HStack(alignment: .firstTextBaseline) { … }  // aligns text baselines`}</CodePre>

          <h3>Spacer and Divider</h3>
          <CodePre>{`// Spacer — flexible empty space:
HStack {
    Text("Left")
    Spacer()       // pushes Left and Right to opposite edges
    Text("Right")
}

// With minimum length:
Spacer(minLength: 20)

// Divider — a horizontal line in VStack, vertical in HStack:
VStack {
    Text("Above")
    Divider()
    Text("Below")
}
HStack {
    Text("Left")
    Divider()
    Text("Right")
}`}</CodePre>

          <h3>Layout priority</h3>
          <CodePre>{`HStack {
    Text("Short")
        .layoutPriority(1)   // this view gets space first
    Text("This is a longer piece of text that might get truncated")
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S14 ─── */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Lazy Layouts &amp; Grids</h2>

          <h3>LazyVStack / LazyHStack</h3>
          <p>
            Regular stacks create all their children at once. <code>LazyVStack</code> and
            <code> LazyHStack</code> only create children as they scroll into view — essential for long lists
            inside a <code>ScrollView</code>:
          </p>
          <CodePre>{`ScrollView {
    LazyVStack(spacing: 12) {
        ForEach(0..<1000, id: \\.self) { i in
            Text("Row \\(i)")
                .frame(maxWidth: .infinity)
                .padding()
                .background(.quaternary)
                .clipShape(.rect(cornerRadius: 8))
        }
    }
    .padding()
}`}</CodePre>

          <h3>LazyVGrid — grid layouts</h3>
          <CodePre>{`// Fixed columns — always 3 columns:
let threeColumns = [
    GridItem(.fixed(100)),
    GridItem(.fixed(100)),
    GridItem(.fixed(100)),
]

// Flexible columns — fill available space equally:
let flexColumns = [
    GridItem(.flexible()),
    GridItem(.flexible()),
    GridItem(.flexible()),
]

// Adaptive columns — as many as fit in the available width:
let adaptiveColumns = [
    GridItem(.adaptive(minimum: 120))   // at least 120pt wide each
]

ScrollView {
    LazyVGrid(columns: adaptiveColumns, spacing: 16) {
        ForEach(photos) { photo in
            AsyncImage(url: photo.url)
                .frame(height: 120)
                .clipShape(.rect(cornerRadius: 8))
        }
    }
    .padding()
}`}</CodePre>

          <h3>Grid — fixed grid for precise layout</h3>
          <CodePre>{`// Grid for table-like layouts where columns must align:
Grid(alignment: .leading) {
    GridRow {
        Text("Name").bold()
        Text("Score").bold()
        Text("Grade").bold()
    }
    Divider()
    ForEach(students) { student in
        GridRow {
            Text(student.name)
            Text("\\(student.score)")
            Text(student.grade)
        }
    }
}`}</CodePre>

          <h3>ScrollView</h3>
          <CodePre>{`// Vertical scroll (default):
ScrollView {
    VStack { /* content */ }
}

// Horizontal scroll:
ScrollView(.horizontal, showsIndicators: false) {
    HStack(spacing: 16) {
        ForEach(items) { item in Card(item: item) }
    }
    .padding(.horizontal)
}

// Scroll to a specific item with ScrollViewReader:
ScrollViewReader { proxy in
    ScrollView {
        ForEach(messages) { message in
            MessageRow(message: message).id(message.id)
        }
    }
    .onChange(of: messages.count) {
        withAnimation {
            proxy.scrollTo(messages.last?.id, anchor: .bottom)
        }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S15 ─── */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>@State &amp; Bindings</h2>

          <h3>@State</h3>
          <p>
            Mark changing data with <code>@State</code>. When it changes, SwiftUI redraws every view that reads it.
            <code>@State</code> is <em>owned</em> by the view that declares it.
          </p>
          <CodePre>{`struct CounterView: View {
    @State private var count = 0   // owned by this view

    var body: some View {
        VStack(spacing: 20) {
            Text("\\(count)")
                .font(.system(size: 72, weight: .bold))

            HStack(spacing: 40) {
                Button {
                    count -= 1
                } label: {
                    Image(systemName: "minus.circle.fill")
                        .font(.largeTitle)
                }

                Button {
                    count += 1
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.largeTitle)
                }
            }
        }
    }
}`}</CodePre>

          <h3>Bindings with $</h3>
          <p>
            Pass a <em>binding</em> (written with <code>$</code>) to a child view that needs to read AND write
            the same piece of state:
          </p>
          <CodePre>{`struct ParentView: View {
    @State private var name = ""
    @State private var isEnabled = false

    var body: some View {
        VStack {
            TextField("Enter name", text: $name)      // binding: $name
            Toggle("Enable feature", isOn: $isEnabled) // binding: $isEnabled
            ChildView(name: $name)                    // pass binding down
        }
    }
}

struct ChildView: View {
    @Binding var name: String   // receives binding from parent

    var body: some View {
        VStack {
            Text("Hello, \\(name)")
            Button("Clear") { name = "" }   // writes back to parent's @State
        }
    }
}`}</CodePre>

          <h3>@AppStorage — persist across launches</h3>
          <CodePre>{`struct SettingsView: View {
    // Reads from and writes to UserDefaults automatically:
    @AppStorage("userName") private var userName = ""
    @AppStorage("fontSize")  private var fontSize: Double = 16
    @AppStorage("darkMode")  private var darkMode = false

    var body: some View {
        Form {
            TextField("Name", text: $userName)
            Slider(value: $fontSize, in: 12...24, label: { Text("Font size") })
            Toggle("Dark mode", isOn: $darkMode)
        }
    }
}`}</CodePre>

          <h3>@SceneStorage — restore after backgrounding</h3>
          <CodePre>{`// Like @AppStorage but tied to the scene — survives backgrounding:
struct EditorView: View {
    @SceneStorage("draftText") private var draftText = ""

    var body: some View {
        TextEditor(text: $draftText)
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S16 ─── */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>State Objects &amp; Environment</h2>

          <h3>ObservableObject / @StateObject</h3>
          <p>
            For state that's too complex for <code>@State</code> or needs to be shared between views, extract it
            into an <code>ObservableObject</code>. Mark properties with <code>@Published</code> to notify views
            when they change.
          </p>
          <CodePre>{`// The model — a class that publishes changes:
class RecipeViewModel: ObservableObject {
    @Published var recipes: [Recipe] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    func loadRecipes() async {
        isLoading = true
        defer { isLoading = false }
        do {
            recipes = try await fetchRecipesFromAPI()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func delete(_ recipe: Recipe) {
        recipes.removeAll { $0.id == recipe.id }
    }
}

// View that OWNS the model — use @StateObject (created once, lives with the view):
struct RecipeListView: View {
    @StateObject private var viewModel = RecipeViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView()
                } else {
                    List(viewModel.recipes) { recipe in
                        Text(recipe.title)
                    }
                }
            }
            .navigationTitle("Recipes")
            .toolbar {
                Button("Refresh") {
                    Task { await viewModel.loadRecipes() }
                }
            }
        }
        .task { await viewModel.loadRecipes() }
    }
}`}</CodePre>

          <h3>@ObservedObject — observe someone else's model</h3>
          <CodePre>{`// A child view that receives but doesn't own the model:
struct RecipeDetailView: View {
    @ObservedObject var viewModel: RecipeViewModel   // passed in from parent
    let recipe: Recipe

    var body: some View {
        // …
    }
}`}</CodePre>

          <h3>@EnvironmentObject — inject to the whole tree</h3>
          <CodePre>{`// Inject a model into the entire view hierarchy from the top:
@main
struct MyApp: App {
    @StateObject private var authManager = AuthManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)   // available to all descendants
        }
    }
}

// Any descendant can access it without explicit passing:
struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        Text("Logged in as \\(authManager.currentUser?.name ?? "guest")")
    }
}`}</CodePre>

          <h3>@Observable (Swift 5.9+ / iOS 17+)</h3>
          <CodePre>{`// Modern replacement for ObservableObject — simpler syntax:
@Observable
class CartModel {
    var items: [CartItem] = []
    var total: Double { items.reduce(0) { $0 + $1.price } }

    func add(_ item: CartItem) { items.append(item) }
    func remove(_ item: CartItem) { items.removeAll { $0.id == item.id } }
}

// Use @State for ownership (not @StateObject):
struct ShopView: View {
    @State private var cart = CartModel()

    var body: some View {
        // cart.items and cart.total automatically trigger redraws
        CartSummary(cart: cart)
    }
}

struct CartSummary: View {
    var cart: CartModel   // no property wrapper needed — @Observable tracks access

    var body: some View {
        Text("\\(cart.items.count) items — $\\(cart.total, format: .number.precision(.fractionLength(2)))")
    }
}`}</CodePre>

          <h3>@Environment — read system values</h3>
          <CodePre>{`struct AdaptiveView: View {
    @Environment(\\.colorScheme) var colorScheme
    @Environment(\\.horizontalSizeClass) var sizeClass
    @Environment(\\.dynamicTypeSize) var typeSize
    @Environment(\\.dismiss) var dismiss       // dismiss a sheet or nav link
    @Environment(\\.openURL) var openURL       // open a URL

    var body: some View {
        Text("Mode: \\(colorScheme == .dark ? "Dark" : "Light")")
            .foregroundStyle(colorScheme == .dark ? .white : .black)
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S17 ─── */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">17</span>Controls</h2>

          <CodePre>{`// Button — runs an action when tapped:
Button("Save") { save() }
Button(action: save) { Label("Save", systemImage: "checkmark") }
Button("Delete", role: .destructive) { delete() }

// TextField — text input:
@State private var name = ""
TextField("Your name", text: $name)
    .textFieldStyle(.roundedBorder)
    .autocorrectionDisabled()
    .textInputAutocapitalization(.words)
    .submitLabel(.done)
    .onSubmit { /* called when user taps Done/Return */ }

// SecureField — password entry (hides characters):
@State private var password = ""
SecureField("Password", text: $password)

// TextEditor — multi-line text input:
@State private var bio = ""
TextEditor(text: $bio)
    .frame(height: 120)
    .border(.quaternary)

// Toggle:
@State private var isOn = false
Toggle("Dark mode", isOn: $isOn)
Toggle(isOn: $isOn) { Label("Notifications", systemImage: "bell") }

// Slider:
@State private var brightness: Double = 0.5
Slider(value: $brightness, in: 0...1, step: 0.01)
Slider(value: $brightness, in: 0...1) {
    Text("Brightness")
} minimumValueLabel: {
    Image(systemName: "sun.min")
} maximumValueLabel: {
    Image(systemName: "sun.max")
}

// Stepper:
@State private var quantity = 1
Stepper("Qty: \\(quantity)", value: $quantity, in: 1...99)
Stepper(value: $quantity, in: 1...99, step: 5) { Text("Count: \\(quantity)") }

// Picker:
@State private var selectedColor = "Red"
Picker("Color", selection: $selectedColor) {
    Text("Red").tag("Red")
    Text("Green").tag("Green")
    Text("Blue").tag("Blue")
}
.pickerStyle(.segmented)    // segmented control
// .pickerStyle(.menu)       // compact dropdown
// .pickerStyle(.wheel)      // scrollable wheel
// .pickerStyle(.inline)     // list-style inside Form

// DatePicker:
@State private var date = Date()
DatePicker("Appointment", selection: $date, displayedComponents: .date)
DatePicker("Time", selection: $date, in: Date()..., displayedComponents: .hourAndMinute)

// ColorPicker:
@State private var color = Color.blue
ColorPicker("Accent color", selection: $color)

// ProgressView:
ProgressView()                                 // spinning indicator
ProgressView(value: 0.7)                      // progress bar (70%)
ProgressView("Loading…", value: 0.4, total: 1.0)`}</CodePre>
        </section>

        <hr />

        {/* ─── S18 ─── */}
        <section className="section" id="s18" ref={setRef('s18')}>
          <h2><span className="section-num">18</span>Lists, ForEach &amp; Row Actions</h2>

          <h3>Static and dynamic lists</h3>
          <CodePre>{`// Static:
List {
    Text("Buy milk")
    Text("Walk the dog")
}

// Dynamic from array:
List(chores, id: \\.self) { chore in
    Text(chore)
}

// Identifiable model (preferred):
struct Task: Identifiable {
    let id = UUID()
    var title: String
    var isDone: Bool
}

@State private var tasks = [
    Task(title: "Write code", isDone: false),
    Task(title: "Eat lunch", isDone: true),
]

List(tasks) { task in
    HStack {
        Image(systemName: task.isDone ? "checkmark.circle.fill" : "circle")
            .foregroundStyle(task.isDone ? .green : .gray)
        Text(task.title)
            .strikethrough(task.isDone)
    }
}`}</CodePre>

          <h3>Sections</h3>
          <CodePre>{`List {
    Section("Pending") {
        ForEach(tasks.filter { !$0.isDone }) { task in
            Text(task.title)
        }
    }
    Section("Done") {
        ForEach(tasks.filter { $0.isDone }) { task in
            Text(task.title).foregroundStyle(.secondary)
        }
    }
}`}</CodePre>

          <h3>Swipe actions</h3>
          <CodePre>{`List($tasks) { $task in
    Text(task.title)
        .swipeActions(edge: .trailing) {
            Button(role: .destructive) {
                tasks.removeAll { $0.id == task.id }
            } label: {
                Label("Delete", systemImage: "trash")
            }
        }
        .swipeActions(edge: .leading) {
            Button {
                task.isDone.toggle()
            } label: {
                Label(task.isDone ? "Undo" : "Done",
                      systemImage: task.isDone ? "arrow.uturn.backward" : "checkmark")
            }
            .tint(.green)
        }
}`}</CodePre>

          <h3>Delete and move</h3>
          <CodePre>{`List {
    ForEach($tasks) { $task in
        Text(task.title)
    }
    .onDelete { indexSet in
        tasks.remove(atOffsets: indexSet)
    }
    .onMove { source, destination in
        tasks.move(fromOffsets: source, toOffset: destination)
    }
}
.toolbar { EditButton() }   // shows Edit/Done to enable move handles`}</CodePre>

          <h3>Context menu (long-press)</h3>
          <CodePre>{`Text(task.title)
    .contextMenu {
        Button("Mark Done") { task.isDone = true }
        Button("Edit") { editingTask = task }
        Button("Delete", role: .destructive) { deleteTask(task) }
    }`}</CodePre>

          <h3>Searchable</h3>
          <CodePre>{`@State private var searchText = ""

var filteredTasks: [Task] {
    if searchText.isEmpty { return tasks }
    return tasks.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
}

NavigationStack {
    List(filteredTasks) { task in Text(task.title) }
    .navigationTitle("Tasks")
    .searchable(text: $searchText, prompt: "Search tasks")`}</CodePre>
        </section>

        <hr />

        {/* ─── S19 ─── */}
        <section className="section" id="s19" ref={setRef('s19')}>
          <h2><span className="section-num">19</span>Navigation</h2>

          <h3>NavigationStack — standard push/pop</h3>
          <CodePre>{`NavigationStack {
    List(recipes) { recipe in
        NavigationLink(recipe.title, value: recipe)
    }
    .navigationTitle("Recipes")
    .navigationDestination(for: Recipe.self) { recipe in
        RecipeDetailView(recipe: recipe)
    }
    .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
            Button("Add", systemImage: "plus") { showAddSheet = true }
        }
    }
}`}</CodePre>

          <h3>Programmatic navigation with NavigationPath</h3>
          <CodePre>{`@State private var path = NavigationPath()

NavigationStack(path: $path) {
    ContentView()
        .navigationDestination(for: Recipe.self) { RecipeDetailView(recipe: $0) }
        .navigationDestination(for: String.self) { StringDetailView(value: $0) }
}

// Navigate programmatically:
path.append(someRecipe)           // push a Recipe
path.append("some string")        // push a String
path.removeLast()                 // pop one level
path = NavigationPath()           // pop to root`}</CodePre>

          <h3>Sheets</h3>
          <CodePre>{`@State private var showingAdd = false
@State private var selectedRecipe: Recipe?

// Boolean-driven sheet:
Button("Add") { showingAdd = true }
    .sheet(isPresented: $showingAdd) {
        AddRecipeView()
    }

// Item-driven sheet (nil = closed, non-nil = shows sheet for that item):
List(recipes) { recipe in
    Button(recipe.title) { selectedRecipe = recipe }
}
.sheet(item: $selectedRecipe) { recipe in
    RecipeDetailView(recipe: recipe)
}

// Full-screen cover (no drag-to-dismiss):
.fullScreenCover(isPresented: $showingCamera) {
    CameraView()
}`}</CodePre>

          <h3>Alerts and confirmations</h3>
          <CodePre>{`@State private var showingDeleteAlert = false

Button("Delete", role: .destructive) { showingDeleteAlert = true }
    .alert("Delete Recipe?", isPresented: $showingDeleteAlert) {
        Button("Delete", role: .destructive) { delete() }
        Button("Cancel", role: .cancel) { }
    } message: {
        Text("This cannot be undone.")
    }

// Confirmation dialog (action sheet on iPhone):
.confirmationDialog("Are you sure?", isPresented: $showConfirm, titleVisibility: .visible) {
    Button("Delete", role: .destructive) { delete() }
    Button("Archive") { archive() }
    Button("Cancel", role: .cancel) { }
}`}</CodePre>

          <h3>Dismiss a view</h3>
          <CodePre>{`// Inside a presented view (sheet, fullScreenCover, nav link):
@Environment(\\.dismiss) var dismiss

Button("Done") { dismiss() }`}</CodePre>
        </section>

        <hr />

        {/* ─── S20 ─── */}
        <section className="section" id="s20" ref={setRef('s20')}>
          <h2><span className="section-num">20</span>TabView</h2>

          <CodePre>{`struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            RecipeListView()
                .tabItem { Label("Recipes", systemImage: "fork.knife") }
                .tag(0)

            ShoppingListView()
                .tabItem { Label("Shopping", systemImage: "cart") }
                .tag(1)

            SettingsView()
                .tabItem { Label("Settings", systemImage: "gear") }
                .tag(2)
        }
    }
}`}</CodePre>

          <h3>Badge on tab items</h3>
          <CodePre>{`RecipeListView()
    .tabItem { Label("Recipes", systemImage: "fork.knife") }
    .badge(newRecipesCount)          // shows a number badge
    .badge("New")                    // shows a text badge`}</CodePre>

          <h3>Page-style tab view</h3>
          <CodePre>{`TabView {
    OnboardingPage1()
    OnboardingPage2()
    OnboardingPage3()
}
.tabViewStyle(.page)                    // swipeable pages
.indexViewStyle(.page(backgroundDisplayMode: .always))  // dot indicators`}</CodePre>
        </section>

        <hr />

        {/* ─── S21 ─── */}
        <section className="section" id="s21" ref={setRef('s21')}>
          <h2><span className="section-num">21</span>Animations &amp; Transitions</h2>

          <h3>withAnimation — animate state changes</h3>
          <CodePre>{`@State private var isExpanded = false

Button("Toggle") {
    withAnimation(.spring(duration: 0.4)) {
        isExpanded.toggle()     // any state change inside animates
    }
}

// The view reacts:
RoundedRectangle(cornerRadius: 12)
    .fill(.blue)
    .frame(height: isExpanded ? 200 : 80)   // animates smoothly`}</CodePre>

          <h3>Animation types</h3>
          <CodePre>{`withAnimation(.default)                        // simple ease-in-out
withAnimation(.linear(duration: 0.3))          // constant speed
withAnimation(.easeIn(duration: 0.2))          // starts slow, ends fast
withAnimation(.easeOut(duration: 0.2))         // starts fast, ends slow
withAnimation(.easeInOut(duration: 0.4))       // ease both ends
withAnimation(.spring())                       // natural spring
withAnimation(.spring(duration: 0.5, bounce: 0.4))   // bouncy spring
withAnimation(.bouncy)                         // preset bouncy spring
withAnimation(.snappy)                         // quick spring
withAnimation(.default.delay(0.2))             // wait 0.2s before animating
withAnimation(.default.repeatForever())        // loops forever`}</CodePre>

          <h3>Implicit animation — .animation modifier</h3>
          <CodePre>{`// Attaches to a view — animates whenever the bound values change:
Circle()
    .fill(isSelected ? .blue : .gray)
    .scaleEffect(isSelected ? 1.2 : 1.0)
    .animation(.spring(), value: isSelected)  // only animates when isSelected changes`}</CodePre>

          <h3>Transitions — animate view appearance / disappearance</h3>
          <CodePre>{`if showBanner {
    BannerView()
        .transition(.slide)               // slides in from left
        .transition(.move(edge: .top))    // slides in from top
        .transition(.opacity)             // fades in/out
        .transition(.scale(scale: 0.8).combined(with: .opacity))  // combined
}

// Custom transition:
extension AnyTransition {
    static var popUp: AnyTransition {
        .scale(scale: 0.1).combined(with: .opacity)
    }
}
SomeView().transition(.popUp)`}</CodePre>

          <h3>Matched geometry effect — hero animations</h3>
          <CodePre>{`@Namespace private var animation

// In the source:
Image("photo")
    .matchedGeometryEffect(id: "photo", in: animation)

// In the destination (inside an if/else):
if isZoomed {
    Image("photo")
        .matchedGeometryEffect(id: "photo", in: animation)
        .ignoresSafeArea()
}

// SwiftUI animates the frame transition between the two.`}</CodePre>

          <h3>Keyframe animations (iOS 17+)</h3>
          <CodePre>{`Logo()
    .keyframeAnimator(initialValue: AnimValues()) { view, values in
        view.scaleEffect(values.scale)
             .rotationEffect(.degrees(values.rotation))
    } keyframes: { _ in
        KeyframeTrack(\\.scale) {
            LinearKeyframe(1.0, duration: 0.1)
            SpringKeyframe(1.5, duration: 0.3, spring: .bouncy)
            LinearKeyframe(1.0, duration: 0.2)
        }
        KeyframeTrack(\\.rotation) {
            LinearKeyframe(0, duration: 0.2)
            CubicKeyframe(10, duration: 0.2)
            CubicKeyframe(-10, duration: 0.2)
            LinearKeyframe(0, duration: 0.2)
        }
    }`}</CodePre>
        </section>

        <hr />

        {/* ─── S22 ─── */}
        <section className="section" id="s22" ref={setRef('s22')}>
          <h2><span className="section-num">22</span>Custom Views &amp; View Modifiers</h2>

          <h3>Extracting reusable views</h3>
          <CodePre>{`// Extract repeated UI into its own view:
struct StatCard: View {
    let title: String
    let value: String
    var icon: String = "chart.bar"
    var tint: Color = .blue

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Label(title, systemImage: icon)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundStyle(tint)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.quaternary)
        .clipShape(.rect(cornerRadius: 12))
    }
}

// Use it:
StatCard(title: "Recipes", value: "42")
StatCard(title: "Favorites", value: "8", icon: "heart.fill", tint: .red)`}</CodePre>

          <h3>ViewBuilder — multiple views as content</h3>
          <CodePre>{`struct Card<Content: View>: View {
    let title: String
    @ViewBuilder let content: () -> Content   // accepts multiple views

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title).font(.headline)
            Divider()
            content()  // renders whatever was passed in
        }
        .padding()
        .background(.quaternary)
        .clipShape(.rect(cornerRadius: 12))
    }
}

// Usage:
Card(title: "Shopping List") {
    Text("• Apples")
    Text("• Milk")
    Text("• Bread")
}`}</CodePre>

          <h3>Custom ViewModifier</h3>
          <CodePre>{`// Package a set of modifiers into a reusable modifier:
struct CardStyle: ViewModifier {
    var tint: Color = .blue

    func body(content: Content) -> some View {
        content
            .padding()
            .background(tint.opacity(0.1))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(tint.opacity(0.3), lineWidth: 1)
            )
            .clipShape(.rect(cornerRadius: 12))
    }
}

// Add a convenience extension:
extension View {
    func cardStyle(tint: Color = .blue) -> some View {
        modifier(CardStyle(tint: tint))
    }
}

// Usage:
Text("Featured Recipe")
    .cardStyle()

VStack { /* ... */ }
    .cardStyle(tint: .green)`}</CodePre>

          <h3>Preference keys — child-to-parent communication</h3>
          <CodePre>{`// A child view reports its size to the parent:
struct SizeKey: PreferenceKey {
    static var defaultValue: CGSize = .zero
    static func reduce(value: inout CGSize, nextValue: () -> CGSize) {
        value = nextValue()
    }
}

// Child sets the preference:
someView
    .background(
        GeometryReader { geo in
            Color.clear.preference(key: SizeKey.self, value: geo.size)
        }
    )

// Parent reads it:
parentView
    .onPreferenceChange(SizeKey.self) { size in
        childSize = size
    }`}</CodePre>

          <h3>GeometryReader — read available space</h3>
          <CodePre>{`GeometryReader { geometry in
    VStack {
        Text("Width: \\(geometry.size.width, format: .number)")
        Rectangle()
            .fill(.blue)
            .frame(width: geometry.size.width * 0.6)   // 60% of available width
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S23 ─── */}
        <section className="section" id="s23" ref={setRef('s23')}>
          <h2><span className="section-num">23</span>Async Images &amp; Networking</h2>

          <h3>AsyncImage</h3>
          <CodePre>{`// Basic — shows a placeholder while loading:
AsyncImage(url: URL(string: "https://example.com/photo.jpg"))

// With placeholder and error handling:
AsyncImage(url: URL(string: "https://example.com/photo.jpg")) { phase in
    switch phase {
    case .empty:
        ProgressView()                        // loading
    case .success(let image):
        image
            .resizable()
            .scaledToFill()
    case .failure:
        Image(systemName: "photo.slash")      // failed to load
            .foregroundStyle(.secondary)
    @unknown default:
        EmptyView()
    }
}
.frame(width: 200, height: 200)
.clipShape(.rect(cornerRadius: 12))`}</CodePre>

          <h3>URLSession with async/await</h3>
          <CodePre>{`struct Recipe: Codable, Identifiable {
    let id: Int
    let title: String
    let imageURL: String
    let ingredients: [String]
}

class RecipeService {
    static let baseURL = "https://api.myapp.com"

    func fetchAll() async throws -> [Recipe] {
        let url = URL(string: "\\(Self.baseURL)/recipes")!
        let (data, response) = try await URLSession.shared.data(from: url)

        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw NetworkError.serverError(statusCode:
                (response as? HTTPURLResponse)?.statusCode ?? 0)
        }

        return try JSONDecoder().decode([Recipe].self, from: data)
    }

    func create(_ recipe: Recipe) async throws -> Recipe {
        var request = URLRequest(url: URL(string: "\\(Self.baseURL)/recipes")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(recipe)

        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(Recipe.self, from: data)
    }

    func delete(id: Int) async throws {
        let url = URL(string: "\\(Self.baseURL)/recipes/\\(id)")!
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        _ = try await URLSession.shared.data(for: request)
    }
}`}</CodePre>

          <h3>Complete networking example with error state</h3>
          <CodePre>{`struct RecipeListView: View {
    @State private var recipes: [Recipe] = []
    @State private var isLoading = false
    @State private var error: Error?

    let service = RecipeService()

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    ProgressView("Loading recipes…")
                } else if let error {
                    VStack(spacing: 16) {
                        Image(systemName: "wifi.slash").font(.largeTitle)
                        Text(error.localizedDescription)
                            .multilineTextAlignment(.center)
                            .foregroundStyle(.secondary)
                        Button("Retry") { Task { await load() } }
                            .buttonStyle(.borderedProminent)
                    }
                    .padding()
                } else if recipes.isEmpty {
                    ContentUnavailableView("No Recipes",
                        systemImage: "fork.knife",
                        description: Text("Add your first recipe to get started."))
                } else {
                    List(recipes) { recipe in
                        RecipeRow(recipe: recipe)
                    }
                }
            }
            .navigationTitle("Recipes")
            .refreshable { await load() }
        }
        .task { await load() }
    }

    func load() async {
        isLoading = true
        error = nil
        do {
            recipes = try await service.fetchAll()
        } catch {
            self.error = error
        }
        isLoading = false
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S24 ─── */}
        <section className="section" id="s24" ref={setRef('s24')}>
          <h2><span className="section-num">24</span>Accessibility</h2>
          <p>
            Building accessible apps isn't optional — it's required by Apple's App Store guidelines and is the
            right thing to do. SwiftUI makes a lot of accessibility work automatic, but you still need to fill in
            the gaps.
          </p>

          <h3>Labels and hints</h3>
          <CodePre>{`// Add a label for VoiceOver when the visual isn't self-explanatory:
Image(systemName: "heart.fill")
    .accessibilityLabel("Add to favorites")
    .accessibilityHint("Double-tap to add this recipe to your favorites list")

// Custom button label:
Button(action: deleteItem) {
    Image(systemName: "trash")
}
.accessibilityLabel("Delete")
.accessibilityHint("Removes this item from your list")`}</CodePre>

          <h3>Group related elements</h3>
          <CodePre>{`// A star-rating display reads as "4 filled stars, 1 empty star"
// instead of reading each image separately:
HStack {
    ForEach(1...5, id: \\.self) { star in
        Image(systemName: star <= rating ? "star.fill" : "star")
    }
}
.accessibilityElement(children: .ignore)
.accessibilityLabel("Rating: \\(rating) out of 5 stars")`}</CodePre>

          <h3>Dynamic Type support</h3>
          <CodePre>{`// Use semantic font styles — they scale automatically:
Text("Title").font(.title)
Text("Body").font(.body)
Text("Caption").font(.caption)

// For custom sizes, allow scaling:
Text("Custom")
    .font(.system(size: 18))
    .dynamicTypeSize(.large ... .accessibility3)  // clamp range

// Layouts that need to adapt:
@Environment(\\.dynamicTypeSize) var typeSize

var body: some View {
    if typeSize.isAccessibilitySize {
        VStack { icon; label }     // stack vertically for large text
    } else {
        HStack { icon; label }     // normal side-by-side
    }
}`}</CodePre>

          <h3>Reduce motion</h3>
          <CodePre>{`@Environment(\\.accessibilityReduceMotion) var reduceMotion

Circle()
    .scaleEffect(isSelected ? 1.2 : 1.0)
    .animation(reduceMotion ? nil : .spring(), value: isSelected)`}</CodePre>

          <h3>Traits</h3>
          <CodePre>{`// Tell VoiceOver about the role and state:
Button("Play") { play() }
    .accessibilityAddTraits(.isButton)

Text("Error: file not found")
    .accessibilityAddTraits(.isStaticText)

Toggle("Shuffle", isOn: $shuffle)
    .accessibilityValue(shuffle ? "on" : "off")`}</CodePre>
        </section>

        <hr />

        {/* ─── S25 ─── */}
        <section className="section" id="s25" ref={setRef('s25')}>
          <h2><span className="section-num">?</span>Common Pitfalls</h2>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause / Fix</th></tr>
              <tr>
                <td>"Cannot convert value… use $?"</td>
                <td>Control needs a binding — add <code>$</code>: <code>TextField("x", text: $name)</code>, not <code>text: name</code>.</td>
              </tr>
              <tr>
                <td>"Cannot assign… 'self' is immutable"</td>
                <td>You're mutating a property in a view or non-mutating function. Wrap changing data in <code>@State</code>.</td>
              </tr>
              <tr>
                <td>Screen doesn't update when data changes</td>
                <td>The changed data isn't <code>@State</code>, <code>@Published</code>, or <code>@Observable</code>. State must be the thing the view reads.</td>
              </tr>
              <tr>
                <td>"Referencing initializer requires Identifiable"</td>
                <td>Add <code>let id = UUID()</code> to your model and conform to <code>Identifiable</code>, or add an explicit <code>id:</code> parameter to <code>ForEach</code>.</td>
              </tr>
              <tr>
                <td>Body has too many views / can only return one</td>
                <td><code>body</code> returns one view. Wrap multiple children in a <code>VStack</code>, <code>Group</code>, or <code>@ViewBuilder</code>.</td>
              </tr>
              <tr>
                <td>"unexpectedly found nil while unwrapping"</td>
                <td>Used <code>!</code> on a nil optional. Use <code>if let</code>, <code>guard let</code>, or <code>??</code>.</td>
              </tr>
              <tr>
                <td>Preview crashes, Simulator works fine</td>
                <td>Preview runs your code at compile-time with no live data. Remove crash-prone force unwraps and ensure previews have sample data.</td>
              </tr>
              <tr>
                <td>@StateObject recreated on every render</td>
                <td>You used <code>@ObservedObject</code> instead of <code>@StateObject</code> for the view that <em>owns</em> the model. <code>@StateObject</code> persists across redraws; <code>@ObservedObject</code> does not.</td>
              </tr>
              <tr>
                <td>@EnvironmentObject crashes with "not found"</td>
                <td>The object wasn't injected with <code>.environmentObject(…)</code> somewhere in the ancestor chain. Also crashes in previews unless you add <code>.environmentObject(…)</code> to the <code>#Preview</code>.</td>
              </tr>
              <tr>
                <td>Animation doesn't animate</td>
                <td>The state change must happen <em>inside</em> <code>withAnimation {'{ }'}</code>, or the view must have <code>.animation(…, value:)</code> watching the right property.</td>
              </tr>
              <tr>
                <td>Retain cycle / memory leak</td>
                <td>A closure inside a class captures <code>self</code> strongly. Use <code>[weak self]</code> in closures stored on a class (<code>@escaping</code>) or in timers.</td>
              </tr>
              <tr>
                <td>"Main thread checker: UI API called on background thread"</td>
                <td>Publishing a <code>@Published</code> change off the main thread. Wrap with <code>await MainActor.run {'{ }'}</code> or mark the class <code>@MainActor</code>.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── S26 ─── */}
        <section className="section" id="s26" ref={setRef('s26')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Swift quick reference</h3>
          <table>
            <tbody>
              <tr><th>Need</th><th>Syntax</th></tr>
              <tr><td>Constant</td><td><code>let x = 5</code></td></tr>
              <tr><td>Variable</td><td><code>var x = 5</code></td></tr>
              <tr><td>Optional</td><td><code>var s: String? = nil</code></td></tr>
              <tr><td>Unwrap optional</td><td><code>if let s {'{ }'}</code> · <code>guard let s else {'{ return }'}</code> · <code>s ?? "default"</code></td></tr>
              <tr><td>Array</td><td><code>var a = [1, 2, 3]</code> · <code>a.append(4)</code></td></tr>
              <tr><td>Dictionary</td><td><code>var d = ["a": 1]</code> · <code>d["b"] = 2</code></td></tr>
              <tr><td>For loop</td><td><code>for x in array {'{ }'}</code></td></tr>
              <tr><td>Switch</td><td><code>switch x {'{ case .a: … default: … }'}</code></td></tr>
              <tr><td>Guard</td><td><code>guard condition else {'{ return }'}</code></td></tr>
              <tr><td>Function</td><td><code>func f(label param: Type) -&gt; ReturnType {'{ }'}</code></td></tr>
              <tr><td>Throws</td><td><code>func f() throws -&gt; T</code> · call with <code>try f()</code></td></tr>
              <tr><td>Async</td><td><code>func f() async throws -&gt; T</code> · call with <code>await f()</code></td></tr>
              <tr><td>Closure</td><td><code>{'{ $0 * 2 }'}</code> · <code>{'{ x in x * 2 }'}</code></td></tr>
              <tr><td>Enum</td><td><code>enum E {'{ case a, b }'}</code> · <code>E.a</code> · <code>.a</code></td></tr>
              <tr><td>Struct</td><td><code>struct S {'{ var x: Int }'}</code></td></tr>
              <tr><td>Protocol</td><td><code>{'protocol P { func f() }'}</code> · <code>{'struct S: P { func f() { } }'}</code></td></tr>
              <tr><td>Extension</td><td><code>extension String {'{ var isEmpty … }'}</code></td></tr>
            </tbody>
          </table>

          <h3>SwiftUI building blocks</h3>
          <table>
            <tbody>
              <tr><th>Need</th><th>Reach for</th></tr>
              <tr><td>Show text</td><td><code>Text("hi")</code></td></tr>
              <tr><td>Show icon</td><td><code>Image(systemName: "star")</code></td></tr>
              <tr><td>Show network image</td><td><code>AsyncImage(url: url)</code></td></tr>
              <tr><td>Vertical layout</td><td><code>{'VStack { }'}</code></td></tr>
              <tr><td>Horizontal layout</td><td><code>{'HStack { }'}</code></td></tr>
              <tr><td>Layered layout</td><td><code>{'ZStack { }'}</code></td></tr>
              <tr><td>Grid</td><td><code>{'LazyVGrid(columns: cols) { }'}</code></td></tr>
              <tr><td>Scrollable</td><td><code>{'ScrollView { LazyVStack { } }'}</code></td></tr>
              <tr><td>Rows</td><td><code>{'List(items) { item in … }'}</code></td></tr>
              <tr><td>Tabs</td><td><code>{'TabView { View().tabItem { Label(…) } }'}</code></td></tr>
              <tr><td>Navigation</td><td><code>{'NavigationStack { … }'}</code></td></tr>
              <tr><td>Go to detail</td><td><code>{'NavigationLink(value: item) { Label }'}</code></td></tr>
              <tr><td>Pop-up form</td><td><code>{'.sheet(isPresented: $flag) { }'}</code></td></tr>
              <tr><td>Dismiss sheet</td><td><code>@Environment(\\.dismiss) var dismiss</code></td></tr>
              <tr><td>Changing local data</td><td><code>@State private var x = …</code></td></tr>
              <tr><td>Shared model</td><td><code>@StateObject var vm = ViewModel()</code></td></tr>
              <tr><td>Two-way control</td><td>pass <code>$x</code> binding</td></tr>
              <tr><td>Animate</td><td><code>{'withAnimation(.spring()) { state change }'}</code></td></tr>
              <tr><td>Async on appear</td><td><code>{'.task { await loadData() }'}</code></td></tr>
              <tr><td>Pull to refresh</td><td><code>{'.refreshable { await reload() }'}</code></td></tr>
              <tr><td>Search bar</td><td><code>.searchable(text: $query)</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">
            ★ You have the full Swift + SwiftUI vocabulary. Continue below for advanced language features and
            additional SwiftUI patterns.
          </p>
        </section>

        <hr />

        {/* ─── S27 ─── */}
        <section className="section" id="s27" ref={setRef('s27')}>
          <h2><span className="section-num">27</span>Properties &amp; Observers</h2>

          <h3>Stored vs. computed properties</h3>
          <CodePre>{`struct Rectangle {
    // Stored properties — use memory to hold the value:
    var width: Double
    var height: Double

    // Computed property — recalculated on every access, no storage:
    var area: Double { width * height }
    var perimeter: Double { 2 * (width + height) }

    // Computed with getter and setter:
    var diagonal: Double {
        get { (width * width + height * height).squareRoot() }
        set {
            // If someone sets diagonal, adjust width (keeping aspect ratio):
            let ratio = width / height
            height = (newValue * newValue / (1 + ratio * ratio)).squareRoot()
            width = height * ratio
        }
    }
}

var r = Rectangle(width: 3, height: 4)
r.area          // 12.0
r.perimeter     // 14.0
r.diagonal      // 5.0 (Pythagorean triple!)`}</CodePre>

          <h3>Property observers — willSet and didSet</h3>
          <CodePre>{`class TemperatureSensor {
    var celsius: Double = 0.0 {
        willSet {
            // newValue is the incoming value (before change):
            print("About to change from \\(celsius) to \\(newValue)")
        }
        didSet {
            // oldValue is what it used to be (after change):
            print("Changed from \\(oldValue) to \\(celsius)")
            if celsius > 100 {
                print("Warning: boiling point exceeded!")
            }
        }
    }

    var fahrenheit: Double {
        get { celsius * 9/5 + 32 }
        set { celsius = (newValue - 32) * 5/9 }
    }
}

var sensor = TemperatureSensor()
sensor.celsius = 37   // "About to change… Changed from 0.0 to 37.0"
sensor.fahrenheit     // 98.6
sensor.fahrenheit = 212  // sets celsius to 100.0`}</CodePre>

          <h3>Lazy properties</h3>
          <CodePre>{`class DataProcessor {
    let dataURL: URL

    // Lazy: created on first access, not at init time.
    // Useful for expensive resources that might not always be needed.
    lazy var parser: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()

    init(url: URL) { self.dataURL = url }
}

let dp = DataProcessor(url: someURL)
// parser hasn't been created yet
let data = dp.parser.decode(...)  // parser is created NOW, once`}</CodePre>

          <h3>Static and class properties</h3>
          <CodePre>{`struct AppConfig {
    // static — belongs to the type, not an instance:
    static let version = "2.1"
    static let buildNumber = 42
    static var instanceCount = 0

    // Computed static property:
    static var versionString: String {
        "v\\(version) (\\(buildNumber))"
    }
}

AppConfig.version         // "2.1"
AppConfig.versionString   // "v2.1 (42)"

// class properties (classes only) — can be overridden:
class Base {
    class var description: String { "Base" }
}
class Child: Base {
    override class var description: String { "Child" }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S28 ─── */}
        <section className="section" id="s28" ref={setRef('s28')}>
          <h2><span className="section-num">28</span>Functions Deep Dive</h2>

          <h3>Argument labels and parameter names</h3>
          <CodePre>{`// Swift separates external label (call site) from internal name (body):
func move(from start: Int, to end: Int) {
    print("Moving from \\(start) to \\(end)")
    // start and end are the internal names
}
move(from: 0, to: 100)   // from and to are the external labels

// _ suppresses the label at the call site:
func add(_ a: Int, _ b: Int) -> Int { a + b }
add(3, 5)   // no labels — cleaner for obvious parameters

// Same label inside and out (most common):
func greet(name: String) { print("Hi, \\(name)") }
greet(name: "Ada")`}</CodePre>

          <h3>Default parameter values</h3>
          <CodePre>{`func send(message: String, to recipient: String = "everyone", urgent: Bool = false) {
    let prefix = urgent ? "URGENT: " : ""
    print("To \\(recipient): \\(prefix)\\(message)")
}

send(message: "Hello")                        // To everyone: Hello
send(message: "Hello", to: "Bob")             // To Bob: Hello
send(message: "Hello", urgent: true)          // To everyone: URGENT: Hello
send(message: "Hello", to: "Bob", urgent: true)`}</CodePre>

          <h3>Variadic parameters</h3>
          <CodePre>{`// Accept zero or more values of the same type:
func sum(_ numbers: Double...) -> Double {
    numbers.reduce(0, +)
}

sum(1, 2, 3)          // 6.0
sum(10, 20, 30, 40)   // 100.0
sum()                 // 0.0  (zero arguments is valid)

// Inside the function, numbers is a [Double]`}</CodePre>

          <h3>inout — modify the caller's variable</h3>
          <CodePre>{`// By default, parameters are constants. inout lets you modify the original:
func doubleInPlace(_ value: inout Int) {
    value *= 2
}

var count = 5
doubleInPlace(&count)   // & means "pass by reference"
count   // 10

// Useful for modifying multiple values at once:
func swap<T>(_ a: inout T, _ b: inout T) {
    let tmp = a; a = b; b = tmp
}`}</CodePre>

          <h3>Functions as values</h3>
          <CodePre>{`// Functions have types: (ParamType) -> ReturnType
func double(_ x: Int) -> Int { x * 2 }
func triple(_ x: Int) -> Int { x * 3 }

var transform: (Int) -> Int = double
transform(5)   // 10
transform = triple
transform(5)   // 15

// Pass functions as arguments:
func apply(_ f: (Int) -> Int, to value: Int) -> Int { f(value) }
apply(double, to: 7)    // 14

// Return functions from functions:
func multiplier(by factor: Int) -> (Int) -> Int {
    return { x in x * factor }   // closure capturing factor
}
let times3 = multiplier(by: 3)
times3(7)   // 21`}</CodePre>

          <h3>@discardableResult</h3>
          <CodePre>{`// By default, Swift warns when you ignore a return value.
// @discardableResult silences the warning when ignoring is intentional:
@discardableResult
func logAndReturn(message: String) -> String {
    print(message)
    return message
}

logAndReturn(message: "Done")      // no warning even though return isn't used
let msg = logAndReturn(message: "Saved")   // using the return value also works`}</CodePre>
        </section>

        <hr />

        {/* ─── S29 ─── */}
        <section className="section" id="s29" ref={setRef('s29')}>
          <h2><span className="section-num">29</span>Collections: Set &amp; Advanced Array</h2>

          <h3>Set — unordered, no duplicates</h3>
          <CodePre>{`// Set stores unique values with no defined order:
var colors: Set<String> = ["red", "green", "blue"]
var colors: Set = ["red", "green", "blue"]   // inferred

colors.insert("yellow")        // add
colors.remove("green")         // remove (no error if missing)
colors.contains("red")         // true — O(1) lookup (faster than Array!)
colors.count                   // 3

// Set math:
let a: Set = [1, 2, 3, 4]
let b: Set = [3, 4, 5, 6]

a.union(b)             // {1, 2, 3, 4, 5, 6}
a.intersection(b)      // {3, 4}
a.subtracting(b)       // {1, 2}
a.symmetricDifference(b)  // {1, 2, 5, 6}

// Subset / superset checks:
let small: Set = [1, 2]
small.isSubset(of: a)        // true
a.isSuperset(of: small)      // true
a.isDisjoint(with: b)        // false (they share elements)`}</CodePre>

          <h3>Advanced array operations</h3>
          <CodePre>{`var numbers = [5, 3, 8, 1, 9, 2, 7, 4, 6]

// Sorting:
numbers.sorted()                          // new sorted array
numbers.sorted(by: >)                     // descending
numbers.sorted { abs($0 - 5) < abs($1 - 5) }  // closest to 5 first

numbers.sort()    // sorts in-place (mutates the array)

// Searching:
numbers.first { $0 > 7 }      // Optional(8) — first match
numbers.firstIndex { $0 > 7 } // Optional(2) — index of first match
numbers.min()                  // Optional(1)
numbers.max()                  // Optional(9)

// Partitioning:
let pivot = numbers.partition { $0 > 5 }   // elements > 5 at end, returns split index
// numbers is now rearranged (exact order not guaranteed)

// Slices — a view into part of the array (no copying):
let slice = numbers[2...5]    // ArraySlice<Int>
Array(slice)                  // convert to a real Array if you need to store it

// zip — combine two sequences element-by-element:
let names = ["Alice", "Bob", "Charlie"]
let ages  = [30, 25, 35]
zip(names, ages).forEach { name, age in
    print("\\(name) is \\(age)")
}
// ("Alice", 30), ("Bob", 25), ("Charlie", 35)

// enumerated — iterate with index:
for (i, name) in names.enumerated() {
    print("\\(i): \\(name)")
}`}</CodePre>

          <h3>Ranges</h3>
          <CodePre>{`let closed = 1...5        // ClosedRange<Int>: 1, 2, 3, 4, 5
let half   = 1..<5        // Range<Int>: 1, 2, 3, 4
let from   = 1...          // PartialRangeFrom<Int>: 1, 2, 3, …
let through = ...5         // PartialRangeThrough<Int>: …, 4, 5
let upTo   = ..<5          // PartialRangeUpTo<Int>: …, 3, 4

// Check membership:
(1...10).contains(7)    // true
5 ~= 1...10             // true (pattern match operator)

// Use in switch:
switch score {
case 90...: print("A")
case 80..<90: print("B")
default: print("Below B")
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S30 ─── */}
        <section className="section" id="s30" ref={setRef('s30')}>
          <h2><span className="section-num">30</span>String Manipulation</h2>

          <CodePre>{`var s = "Hello, Swift!"

// Basic properties:
s.count               // 13
s.isEmpty             // false
s.first               // Optional("H")
s.last                // Optional("!")

// Case:
s.uppercased()        // "HELLO, SWIFT!"
s.lowercased()        // "hello, swift!"
s.capitalized         // "Hello, Swift!"

// Check contents:
s.hasPrefix("Hello")  // true
s.hasSuffix("!")      // true
s.contains("Swift")   // true

// Modify:
s.append(" 🎉")
s.insert(".", at: s.endIndex)
s.removeAll { $0 == "!" }

// Split:
let csv = "one,two,three"
let parts = csv.split(separator: ",")       // ["one", "two", "three"] — [Substring]
let words = csv.components(separatedBy: ",") // [String] (Foundation method)

// Join:
["one", "two", "three"].joined(separator: ", ")   // "one, two, three"

// Trim:
"  hello  ".trimmingCharacters(in: .whitespaces)  // "hello"

// Replace:
s.replacing("Swift", with: "World")
s.replacingOccurrences(of: "Hello", with: "Hi")   // Foundation

// Substring (cheap view, no copy):
let start = s.startIndex
let end = s.index(start, offsetBy: 5)
let sub = s[start..<end]   // "Hello" — Substring
let str = String(sub)      // convert to String to store

// Find and replace with Regex (Swift 5.7+):
let cleaned = s.replacing(/[!?]+/, with: ".")

// Multi-line:
let poem = """
    Roses are red,
    Violets are blue.
    """

// String interpolation with format:
let pi = 3.14159
"Pi is approximately \\(pi, format: .number.precision(.fractionLength(2)))"
// "Pi is approximately 3.14"
"Score: \\(1000, format: .number)"   // "Score: 1,000" (locale-aware)`}</CodePre>

          <h3>AttributedString — styled text</h3>
          <CodePre>{`var attributed = AttributedString("Hello, World!")
let boldRange = attributed.range(of: "World")!
attributed[boldRange].font = .boldSystemFont(ofSize: 16)
attributed[boldRange].foregroundColor = .blue

// In SwiftUI:
Text(attributed)`}</CodePre>
        </section>

        <hr />

        {/* ─── S31 ─── */}
        <section className="section" id="s31" ref={setRef('s31')}>
          <h2><span className="section-num">31</span>Custom Shapes &amp; Drawing</h2>

          <h3>The Shape protocol</h3>
          <p>
            Create custom shapes by conforming to <code>Shape</code> and implementing <code>path(in:)</code>.
            SwiftUI calls your function with the available frame; you return a <code>Path</code> describing
            what to draw.
          </p>
          <CodePre>{`struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))      // top center
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))   // bottom right
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))   // bottom left
        path.closeSubpath()   // close back to top
        return path
    }
}

struct Star: Shape {
    var points: Int = 5
    var innerRadius: CGFloat = 0.4

    func path(in rect: CGRect) -> Path {
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let outerRadius = min(rect.width, rect.height) / 2
        let inner = outerRadius * innerRadius
        var path = Path()
        let step = .pi * 2 / Double(points)
        let offset = -.pi / 2   // start at top

        for i in 0..<points {
            let outerAngle = Double(i) * step + offset
            let innerAngle = outerAngle + step / 2
            let outerPt = CGPoint(
                x: center.x + outerRadius * cos(outerAngle),
                y: center.y + outerRadius * sin(outerAngle))
            let innerPt = CGPoint(
                x: center.x + inner * cos(innerAngle),
                y: center.y + inner * sin(innerAngle))
            if i == 0 { path.move(to: outerPt) }
            else { path.addLine(to: outerPt) }
            path.addLine(to: innerPt)
        }
        path.closeSubpath()
        return path
    }
}

// Use them like any shape:
Triangle()
    .fill(.orange)
    .frame(width: 100, height: 80)

Star(points: 5)
    .fill(.yellow)
    .overlay(Star(points: 5).stroke(.orange, lineWidth: 2))
    .frame(width: 80, height: 80)`}</CodePre>

          <h3>Canvas — direct drawing</h3>
          <CodePre>{`// Canvas gives you a CGContext-like API directly in SwiftUI:
Canvas { context, size in
    // Draw a gradient background:
    let gradient = Gradient(colors: [.blue, .purple])
    let rect = CGRect(origin: .zero, size: size)
    context.fill(
        Path(rect),
        with: .linearGradient(gradient,
            startPoint: CGPoint(x: 0, y: 0),
            endPoint: CGPoint(x: size.width, y: size.height))
    )

    // Draw a circle:
    let center = CGPoint(x: size.width/2, y: size.height/2)
    let circlePath = Path(ellipseIn: CGRect(x: center.x - 40, y: center.y - 40,
                                             width: 80, height: 80))
    context.fill(circlePath, with: .color(.white.opacity(0.3)))
    context.stroke(circlePath, with: .color(.white), lineWidth: 2)
}
.frame(height: 200)
.clipShape(.rect(cornerRadius: 16))`}</CodePre>

          <h3>Built-in shapes</h3>
          <CodePre>{`// All shapes accept .fill(), .stroke(), .strokeBorder():
Circle()
    .fill(.blue)
    .frame(width: 80, height: 80)

Rectangle()
    .stroke(.red, lineWidth: 2)
    .frame(width: 100, height: 60)

RoundedRectangle(cornerRadius: 12)
    .fill(.green.gradient)

Capsule()
    .fill(.orange)
    .frame(width: 120, height: 40)

Ellipse()
    .strokeBorder(.purple, lineWidth: 3)
    .frame(width: 120, height: 60)

// Combine stroke + fill:
Circle()
    .strokeBorder(.blue, lineWidth: 4)
    .background(Circle().fill(.blue.opacity(0.1)))`}</CodePre>
        </section>

        <hr />

        {/* ─── S32 ─── */}
        <section className="section" id="s32" ref={setRef('s32')}>
          <h2><span className="section-num">32</span>Form &amp; Input Patterns</h2>

          <h3>Form view</h3>
          <p>
            <code>Form</code> wraps inputs with system styling — grouped rows on iOS. Ideal for settings screens
            and data-entry flows:
          </p>
          <CodePre>{`struct ProfileForm: View {
    @State private var name = ""
    @State private var age = 18
    @State private var email = ""
    @State private var receiveNewsletter = false
    @State private var plan = "Free"

    let plans = ["Free", "Pro", "Enterprise"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Personal Info") {
                    TextField("Name", text: $name)
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                    Stepper("Age: \\(age)", value: $age, in: 1...120)
                }

                Section("Preferences") {
                    Toggle("Newsletter", isOn: $receiveNewsletter)
                    Picker("Plan", selection: $plan) {
                        ForEach(plans, id: \\.self) { Text($0) }
                    }
                }

                Section {
                    Button("Save") { save() }
                        .frame(maxWidth: .infinity)
                        .foregroundStyle(.white)
                        .listRowBackground(Color.blue)
                }
            }
            .navigationTitle("Edit Profile")
        }
    }

    func save() { /* … */ }
}`}</CodePre>

          <h3>Validation state</h3>
          <CodePre>{`struct LoginForm: View {
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    @State private var errorMessage: String?

    var isFormValid: Bool {
        email.contains("@") && password.count >= 8
    }

    var body: some View {
        VStack(spacing: 16) {
            TextField("Email", text: $email)
                .textFieldStyle(.roundedBorder)
                .overlay(alignment: .trailing) {
                    if !email.isEmpty && !email.contains("@") {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.red)
                            .padding(.trailing, 8)
                    }
                }

            SecureField("Password (8+ chars)", text: $password)
                .textFieldStyle(.roundedBorder)

            if let error = errorMessage {
                Label(error, systemImage: "exclamationmark.triangle")
                    .foregroundStyle(.red)
                    .font(.caption)
            }

            Button("Log In") { Task { await logIn() } }
                .buttonStyle(.borderedProminent)
                .disabled(!isFormValid || isLoading)
                .overlay {
                    if isLoading { ProgressView().tint(.white) }
                }
        }
        .padding()
    }

    func logIn() async {
        isLoading = true
        defer { isLoading = false }
        // network call…
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S33 ─── */}
        <section className="section" id="s33" ref={setRef('s33')}>
          <h2><span className="section-num">33</span>Focus &amp; Keyboard</h2>

          <h3>@FocusState — programmatic focus</h3>
          <CodePre>{`struct SearchView: View {
    @State private var query = ""
    @FocusState private var isSearchFocused: Bool

    var body: some View {
        VStack {
            TextField("Search…", text: $query)
                .focused($isSearchFocused)     // bind focus state
                .textFieldStyle(.roundedBorder)

            Button("Focus Search") {
                isSearchFocused = true          // activate keyboard programmatically
            }
            Button("Dismiss Keyboard") {
                isSearchFocused = false         // dismiss keyboard
            }
        }
        .onAppear {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                isSearchFocused = true          // auto-focus after appear
            }
        }
    }
}`}</CodePre>

          <h3>Multi-field focus with enum</h3>
          <CodePre>{`enum Field { case firstName, lastName, email }

struct SignupView: View {
    @State private var firstName = ""
    @State private var lastName  = ""
    @State private var email     = ""
    @FocusState private var focusedField: Field?

    var body: some View {
        Form {
            TextField("First name", text: $firstName)
                .focused($focusedField, equals: .firstName)
                .onSubmit { focusedField = .lastName }   // advance on Return

            TextField("Last name", text: $lastName)
                .focused($focusedField, equals: .lastName)
                .onSubmit { focusedField = .email }

            TextField("Email", text: $email)
                .focused($focusedField, equals: .email)
                .onSubmit { focusedField = nil }         // dismiss on last field
        }
        .onAppear { focusedField = .firstName }          // start on first field
    }
}`}</CodePre>

          <h3>Keyboard avoidance and safe areas</h3>
          <CodePre>{`// SwiftUI automatically moves content when keyboard appears.
// To fine-tune, use .ignoresSafeArea(.keyboard) or .scrollDismissesKeyboard:

ScrollView {
    LazyVStack {
        ForEach(messages) { msg in MessageRow(msg: msg) }
    }
}
.scrollDismissesKeyboard(.interactively)   // drag to dismiss keyboard

// For a chat input pinned above the keyboard:
VStack {
    MessageList()
    HStack {
        TextField("Message…", text: $draft)
        Button("Send") { send() }
    }
    .padding()
    .background(.bar)
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S34 ─── */}
        <section className="section" id="s34" ref={setRef('s34')}>
          <h2><span className="section-num">34</span>App Lifecycle &amp; Scene</h2>

          <h3>The @main entry point</h3>
          <CodePre>{`@main
struct MyApp: App {
    // @StateObject lives for the entire app lifetime:
    @StateObject private var authManager = AuthManager()
    @StateObject private var settingsManager = SettingsManager()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(authManager)
                .environmentObject(settingsManager)
                .onOpenURL { url in
                    handleDeepLink(url)   // handle universal links
                }
        }
    }

    func handleDeepLink(_ url: URL) {
        // parse url.path and navigate accordingly
    }
}`}</CodePre>

          <h3>scenePhase — react to foreground/background</h3>
          <CodePre>{`struct ContentView: View {
    @Environment(\\.scenePhase) var scenePhase

    var body: some View {
        MainView()
            .onChange(of: scenePhase) { _, newPhase in
                switch newPhase {
                case .active:
                    // App became active (foregrounded or launched)
                    refreshData()
                case .inactive:
                    // App is about to go to background (phone call, multitasking)
                    saveState()
                case .background:
                    // App is in background — do minimal work, schedule tasks
                    scheduleBackgroundRefresh()
                @unknown default:
                    break
                }
            }
    }
}`}</CodePre>

          <h3>AppStorage and UserDefaults</h3>
          <CodePre>{`// AppStorage is a SwiftUI binding to UserDefaults:
@AppStorage("onboardingComplete") var hasOnboarded = false
@AppStorage("accentColorIndex") var accentColor = 0

// It works across views — all views with the same key see the same value.
// Change in one view updates all others automatically.

// Under the hood, AppStorage uses UserDefaults.standard.
// For a custom suite (e.g., App Group shared with a widget):
@AppStorage("key", store: UserDefaults(suiteName: "group.com.example.app"))
var sharedValue = ""

// Direct UserDefaults access (outside SwiftUI):
UserDefaults.standard.set(true, forKey: "firstLaunchDone")
UserDefaults.standard.bool(forKey: "firstLaunchDone")
UserDefaults.standard.string(forKey: "username") ?? ""`}</CodePre>
        </section>

        <hr />

        {/* ─── S35 ─── */}
        <section className="section" id="s35" ref={setRef('s35')}>
          <h2><span className="section-num">35</span>SF Symbols &amp; Icons</h2>
          <p>
            SF Symbols is Apple's built-in icon library with 5,000+ symbols. They scale with Dynamic Type,
            respond to the system tint, and support multiple rendering modes. Use the <strong>SF Symbols app</strong>
            (free from Apple) to browse and copy symbol names.
          </p>

          <h3>Basic usage</h3>
          <CodePre>{`// System symbol:
Image(systemName: "star.fill")
Image(systemName: "heart")
Image(systemName: "arrow.right.circle.fill")

// Control size with font modifier:
Image(systemName: "wifi")
    .font(.largeTitle)

// Or imageScale:
Image(systemName: "person.fill")
    .imageScale(.large)    // .small, .medium, .large`}</CodePre>

          <h3>Symbol rendering modes</h3>
          <CodePre>{`// Monochrome — single color (default):
Image(systemName: "heart.fill")
    .foregroundStyle(.red)

// Hierarchical — multiple opacities of one color:
Image(systemName: "person.crop.circle.fill")
    .symbolRenderingMode(.hierarchical)
    .foregroundStyle(.blue)

// Palette — up to 3 explicit colors:
Image(systemName: "cloud.sun.fill")
    .symbolRenderingMode(.palette)
    .foregroundStyle(.yellow, .blue)

// Multicolor — Apple's official color scheme:
Image(systemName: "flame.fill")
    .symbolRenderingMode(.multicolor)`}</CodePre>

          <h3>Symbol variants and effects</h3>
          <CodePre>{`// Variants (circle, square, fill, slash):
Image(systemName: "heart")          // outline
Image(systemName: "heart.fill")     // filled
Image(systemName: "heart.circle")   // in a circle
Image(systemName: "heart.slash")    // crossed out

// Symbol effects (iOS 17+):
Image(systemName: "wifi")
    .symbolEffect(.pulse)            // pulsing animation

Image(systemName: "bell")
    .symbolEffect(.bounce, options: .repeating)

Image(systemName: "checkmark.circle")
    .symbolEffect(.appear, isActive: showCheck)  // appear/disappear`}</CodePre>

          <h3>Label — icon + text together</h3>
          <CodePre>{`Label("Settings", systemImage: "gear")
Label("Delete", systemImage: "trash").foregroundStyle(.red)

// Control display:
Label("Favorites", systemImage: "heart")
    .labelStyle(.titleAndIcon)    // text + icon (default in most contexts)
    .labelStyle(.titleOnly)       // text only
    .labelStyle(.iconOnly)        // icon only

// In toolbars — Button with Label collapses to icon-only automatically:
ToolbarItem(placement: .topBarTrailing) {
    Button {
        addItem()
    } label: {
        Label("Add", systemImage: "plus")
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S36 ─── */}
        <section className="section" id="s36" ref={setRef('s36')}>
          <h2><span className="section-num">36</span>Combine Basics</h2>
          <p>
            Combine is Apple's reactive programming framework. You'll encounter it in older codebases and in
            some UIKit/AppKit integrations. With <code>async/await</code> covering most new use cases, Combine
            is now mainly used for debouncing, timers, and NotificationCenter observation.
          </p>

          <h3>Publishers and Subscribers</h3>
          <CodePre>{`import Combine

// A Publisher emits values over time. A Subscriber receives them.
// The simplest publisher: Just — emits a single value then completes:
let publisher = Just(42)
publisher.sink { value in
    print("Got: \\(value)")   // "Got: 42"
}

// Array publisher:
[1, 2, 3].publisher
    .map { $0 * 10 }
    .sink { print($0) }   // 10, 20, 30`}</CodePre>

          <h3>AnyCancellable — managing subscriptions</h3>
          <CodePre>{`class ViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var results: [String] = []
    private var cancellables = Set<AnyCancellable>()

    init() {
        // React to changes in searchText, but debounce and skip duplicates:
        $searchText
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .filter { $0.count > 2 }
            .sink { [weak self] text in
                Task { await self?.search(text) }
            }
            .store(in: &cancellables)   // keep subscription alive
    }

    func search(_ text: String) async {
        // … network call
    }
}`}</CodePre>

          <h3>Timer with Combine</h3>
          <CodePre>{`class ClockViewModel: ObservableObject {
    @Published var time = Date()
    private var cancellable: AnyCancellable?

    func start() {
        cancellable = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] date in
                self?.time = date
            }
    }

    func stop() { cancellable = nil }
}`}</CodePre>

          <h3>NotificationCenter with Combine</h3>
          <CodePre>{`NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)
    .sink { _ in
        refreshData()
    }
    .store(in: &cancellables)

// Much cleaner than the old addObserver / removeObserver dance.`}</CodePre>
        </section>

        <hr />

        {/* ─── S37 ─── */}
        <section className="section" id="s37" ref={setRef('s37')}>
          <h2><span className="section-num">37</span>Memory Management (ARC)</h2>
          <p>
            Swift uses <strong>Automatic Reference Counting (ARC)</strong> to manage memory. Understanding ARC
            prevents memory leaks and crashes.
          </p>

          <h3>How ARC works</h3>
          <CodePre>{`// Every class instance has a reference count.
// When count reaches 0, the object is deallocated.

class Dog {
    let name: String
    init(name: String) {
        self.name = name
        print("\\(name) created")
    }
    deinit {
        print("\\(name) deallocated")   // called when ref count hits 0
    }
}

var dog1: Dog? = Dog(name: "Rex")    // count: 1, "Rex created"
var dog2 = dog1                       // count: 2  (another reference)
dog1 = nil                            // count: 1  (dog2 still holds it)
dog2 = nil                            // count: 0, "Rex deallocated"`}</CodePre>

          <h3>Strong reference cycles</h3>
          <CodePre>{`// Two objects holding strong references to each other → neither is ever freed:
class Person {
    var name: String
    var apartment: Apartment?       // strong reference
    init(name: String) { self.name = name }
    deinit { print("\\(name) deallocated") }
}

class Apartment {
    var unit: String
    var tenant: Person?             // strong reference — CYCLE!
    init(unit: String) { self.unit = unit }
    deinit { print("Apartment \\(unit) deallocated") }
}

var john: Person? = Person(name: "John")
var unit4A: Apartment? = Apartment(unit: "4A")

john?.apartment = unit4A     // Person → Apartment (strong)
unit4A?.tenant = john        // Apartment → Person (strong)  ← cycle!

john = nil      // Person's count: 1 (Apartment still holds it)
unit4A = nil    // Apartment's count: 1 (Person still holds it)
// Neither deinit is called — MEMORY LEAK`}</CodePre>

          <h3>weak and unowned — breaking cycles</h3>
          <CodePre>{`class Apartment {
    var unit: String
    weak var tenant: Person?       // weak: automatically nil when Person is freed
    init(unit: String) { self.unit = unit }
    deinit { print("Apartment \\(unit) deallocated") }
}

// Now:
john = nil     // Person's count reaches 0 → "John deallocated"
unit4A = nil   // Apartment's count reaches 0 → "Apartment 4A deallocated"

// weak vs unowned:
// weak var: optional, becomes nil when target is freed. Use when target can outlive the reference.
// unowned var: non-optional, crashes if accessed after target freed. Use when target always outlives it.

class CreditCard {
    let number: String
    unowned let holder: Person    // card can't exist without a holder — always safe
    init(number: String, holder: Person) {
        self.number = number
        self.holder = holder
    }
}`}</CodePre>

          <h3>Retain cycles in closures</h3>
          <CodePre>{`class ViewController {
    var name = "Main"
    var callback: (() -> Void)?

    func setup() {
        // Closure captures self strongly → cycle if stored on self:
        callback = {
            print(self.name)   // self is captured strongly
        }

        // Fix with [weak self]:
        callback = { [weak self] in
            guard let self else { return }
            print(self.name)
        }

        // Or [unowned self] if you're certain self outlives the closure:
        callback = { [unowned self] in
            print(self.name)
        }
    }
}

// In SwiftUI, closures in .task, .onChange, etc. are managed by the
// framework — you usually don't need [weak self] in SwiftUI views
// because views are structs (value types), not classes.`}</CodePre>

          <p className="finished-marker">
            ★ ARC covered. Continue below for persistence, toolbars, UIKit interop, and testing.
          </p>
        </section>

        <hr />

        {/* ─── S38 ─── */}
        <section className="section" id="s38" ref={setRef('s38')}>
          <h2><span className="section-num">38</span>SwiftData Persistence</h2>
          <p>
            SwiftData (iOS 17+) is Apple's modern persistence layer — a Swift-native replacement for CoreData with
            a much simpler API. Mark your model class with <code>@Model</code> and SwiftData handles storage,
            queries, and updates automatically.
          </p>

          <h3>Define a model</h3>
          <CodePre>{`import SwiftData

@Model
final class Recipe {
    var title: String
    var ingredients: [String]
    var servings: Int
    var isFavorite: Bool
    var createdAt: Date

    // Relationships:
    var category: Category?
    @Relationship(deleteRule: .cascade) var steps: [RecipeStep] = []

    init(title: String, ingredients: [String] = [], servings: Int = 4) {
        self.title = title
        self.ingredients = ingredients
        self.servings = servings
        self.isFavorite = false
        self.createdAt = Date()
    }
}

@Model
final class Category {
    var name: String
    var recipes: [Recipe] = []
    init(name: String) { self.name = name }
}`}</CodePre>

          <h3>Set up the container</h3>
          <CodePre>{`@main
struct RecipeApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [Recipe.self, Category.self])
        // Single schema — SwiftData creates/migrates the database automatically
    }
}`}</CodePre>

          <h3>Query and display data</h3>
          <CodePre>{`struct RecipeListView: View {
    // @Query fetches and keeps results up-to-date automatically:
    @Query(sort: \\.title) var recipes: [Recipe]
    @Query(filter: #Predicate<Recipe> { $0.isFavorite },
           sort: \\.createdAt, order: .reverse)
    var favorites: [Recipe]

    @Environment(\\.modelContext) private var modelContext

    var body: some View {
        List {
            Section("All Recipes") {
                ForEach(recipes) { recipe in
                    RecipeRow(recipe: recipe)
                        .swipeActions {
                            Button(role: .destructive) {
                                modelContext.delete(recipe)
                            } label: { Label("Delete", systemImage: "trash") }
                        }
                }
            }
        }
        .toolbar {
            Button("Add") { addRecipe() }
        }
    }

    func addRecipe() {
        let recipe = Recipe(title: "New Recipe")
        modelContext.insert(recipe)
        // SwiftData saves automatically (or call try? modelContext.save())
    }
}`}</CodePre>

          <h3>Filtering and sorting</h3>
          <CodePre>{`// Dynamic filter from user input:
struct FilteredRecipes: View {
    let searchText: String

    var predicate: Predicate<Recipe> {
        #Predicate<Recipe> { recipe in
            recipe.title.localizedStandardContains(searchText)
        }
    }

    @Query var recipes: [Recipe]

    init(searchText: String) {
        self.searchText = searchText
        _recipes = Query(filter: predicate, sort: \\.title)
    }

    var body: some View {
        ForEach(recipes) { recipe in Text(recipe.title) }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S39 ─── */}
        <section className="section" id="s39" ref={setRef('s39')}>
          <h2><span className="section-num">39</span>Toolbar &amp; Menus</h2>

          <h3>Toolbar</h3>
          <CodePre>{`NavigationStack {
    ListView()
        .navigationTitle("Recipes")
        .toolbar {
            // Leading (left side):
            ToolbarItem(placement: .topBarLeading) {
                Button("Cancel") { dismiss() }
            }

            // Trailing (right side — most common):
            ToolbarItem(placement: .topBarTrailing) {
                Button("Add", systemImage: "plus") { addItem() }
            }

            // Multiple trailing items:
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button(action: sort) { Label("Sort", systemImage: "arrow.up.arrow.down") }
                Button(action: filter) { Label("Filter", systemImage: "line.3.horizontal.decrease") }
                EditButton()
            }

            // Bottom toolbar:
            ToolbarItemGroup(placement: .bottomBar) {
                Button("Share") { share() }
                Spacer()
                Button("Delete") { delete() }
            }

            // Keyboard toolbar (appears above the keyboard):
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button("Done") { focusedField = nil }
            }
        }
}`}</CodePre>

          <h3>Menu — dropdown action list</h3>
          <CodePre>{`Menu("Options") {
    Button("Sort A–Z") { sort(by: .name) }
    Button("Sort by Date") { sort(by: .date) }

    Divider()

    Menu("Group by…") {
        Button("Category") { group(by: .category) }
        Button("Ingredient") { group(by: .ingredient) }
    }

    Divider()

    Button("Export", systemImage: "square.and.arrow.up") { export() }
    Button("Delete All", systemImage: "trash", role: .destructive) { deleteAll() }
}

// Menu as toolbar button:
ToolbarItem(placement: .topBarTrailing) {
    Menu {
        Button("Edit") { isEditing = true }
        Button("Share") { shareRecipe() }
        Button("Delete", role: .destructive) { delete() }
    } label: {
        Image(systemName: "ellipsis.circle")
    }
}`}</CodePre>

          <h3>Context menu on list rows</h3>
          <CodePre>{`ForEach(recipes) { recipe in
    RecipeRow(recipe: recipe)
        .contextMenu {
            Button("Favorite") {
                recipe.isFavorite.toggle()
            }
            ShareLink(item: recipe.title) {
                Label("Share", systemImage: "square.and.arrow.up")
            }
            Divider()
            Button("Delete", role: .destructive) {
                delete(recipe)
            }
        } preview: {
            // Optional: custom preview shown during long press
            RecipeCardPreview(recipe: recipe)
        }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S40 ─── */}
        <section className="section" id="s40" ref={setRef('s40')}>
          <h2><span className="section-num">40</span>UIKit Interop</h2>
          <p>
            SwiftUI and UIKit can live in the same app. You'll need UIKit interop when using a UIKit-only
            component (like <code>UIDocumentPickerViewController</code>) or when embedding SwiftUI into an
            existing UIKit app.
          </p>

          <h3>UIViewRepresentable — wrap a UIView in SwiftUI</h3>
          <CodePre>{`// Wrap UIActivityIndicatorView (legacy spinner) as a SwiftUI view:
struct ActivityIndicator: UIViewRepresentable {
    var isAnimating: Bool

    // Required: create the UIView:
    func makeUIView(context: Context) -> UIActivityIndicatorView {
        UIActivityIndicatorView(style: .large)
    }

    // Required: update the UIView when SwiftUI state changes:
    func updateUIView(_ view: UIActivityIndicatorView, context: Context) {
        isAnimating ? view.startAnimating() : view.stopAnimating()
    }
}

// Use in SwiftUI:
ActivityIndicator(isAnimating: isLoading)
    .tint(.blue)`}</CodePre>

          <h3>UIViewControllerRepresentable — wrap a UIViewController</h3>
          <CodePre>{`struct DocumentPicker: UIViewControllerRepresentable {
    var onPick: (URL) -> Void

    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.pdf, .image])
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ vc: UIDocumentPickerViewController, context: Context) {}

    // Coordinator: a class that acts as the UIKit delegate:
    func makeCoordinator() -> Coordinator { Coordinator(onPick: onPick) }

    class Coordinator: NSObject, UIDocumentPickerDelegate {
        let onPick: (URL) -> Void
        init(onPick: @escaping (URL) -> Void) { self.onPick = onPick }

        func documentPicker(_ controller: UIDocumentPickerViewController,
                            didPickDocumentsAt urls: [URL]) {
            if let url = urls.first { onPick(url) }
        }
    }
}

// Use in SwiftUI:
struct ContentView: View {
    @State private var showPicker = false
    @State private var pickedURL: URL?

    var body: some View {
        Button("Pick Document") { showPicker = true }
            .sheet(isPresented: $showPicker) {
                DocumentPicker { url in
                    pickedURL = url
                    showPicker = false
                }
            }
    }
}`}</CodePre>

          <h3>Hosting SwiftUI inside UIKit</h3>
          <CodePre>{`// Use UIHostingController to embed a SwiftUI view in a UIKit app:
class MainViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        let swiftUIView = RecipeListView()
        let hostingController = UIHostingController(rootView: swiftUIView)

        addChild(hostingController)
        view.addSubview(hostingController.view)
        hostingController.view.frame = view.bounds
        hostingController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        hostingController.didMove(toParent: self)
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S41 ─── */}
        <section className="section" id="s41" ref={setRef('s41')}>
          <h2><span className="section-num">41</span>Testing SwiftUI</h2>

          <h3>Unit testing with XCTest</h3>
          <CodePre>{`import XCTest
@testable import MyApp

// Test your model / viewmodel logic — NOT the views themselves:
class RecipeViewModelTests: XCTestCase {

    func testAddRecipe() {
        let vm = RecipeViewModel()
        XCTAssertEqual(vm.recipes.count, 0)

        vm.add(Recipe(title: "Pasta", ingredients: ["noodles"], servings: 4))
        XCTAssertEqual(vm.recipes.count, 1)
        XCTAssertEqual(vm.recipes[0].title, "Pasta")
    }

    func testFilterFavorites() {
        let vm = RecipeViewModel()
        vm.add(Recipe(title: "A", isFavorite: true))
        vm.add(Recipe(title: "B", isFavorite: false))
        vm.add(Recipe(title: "C", isFavorite: true))

        XCTAssertEqual(vm.favorites.count, 2)
    }

    func testLoadRecipesAsync() async throws {
        let vm = RecipeViewModel(service: MockRecipeService())
        await vm.load()
        XCTAssertFalse(vm.isLoading)
        XCTAssertNil(vm.errorMessage)
        XCTAssertGreaterThan(vm.recipes.count, 0)
    }
}`}</CodePre>

          <h3>Mocking dependencies</h3>
          <CodePre>{`// Define a protocol for your service:
protocol RecipeServiceProtocol {
    func fetchAll() async throws -> [Recipe]
}

// Real implementation:
class RecipeService: RecipeServiceProtocol { /* … */ }

// Mock for tests:
class MockRecipeService: RecipeServiceProtocol {
    var recipesToReturn: [Recipe] = [
        Recipe(title: "Test Recipe", ingredients: [], servings: 2)
    ]
    var shouldThrow = false

    func fetchAll() async throws -> [Recipe] {
        if shouldThrow { throw NetworkError.noConnection }
        return recipesToReturn
    }
}

// ViewModel uses the protocol:
class RecipeViewModel: ObservableObject {
    private let service: RecipeServiceProtocol

    init(service: RecipeServiceProtocol = RecipeService()) {
        self.service = service
    }
}`}</CodePre>

          <h3>UI tests with XCUITest</h3>
          <CodePre>{`import XCTest

class RecipeUITests: XCTestCase {
    let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launchArguments = ["--uitesting"]   // signal to app to use test data
        app.launch()
    }

    func testAddRecipe() throws {
        // Tap the Add button:
        app.buttons["Add"].tap()

        // Type a name:
        let field = app.textFields["Recipe name"]
        field.tap()
        field.typeText("Test Pasta")

        // Save:
        app.buttons["Save"].tap()

        // Verify it appears in the list:
        XCTAssertTrue(app.staticTexts["Test Pasta"].exists)
    }

    func testSwipeToDelete() throws {
        let cell = app.cells.firstMatch
        cell.swipeLeft()
        app.buttons["Delete"].tap()
        // Verify cell is gone…
    }
}`}</CodePre>

          <Note>
            Test your <strong>logic</strong> heavily with unit tests (fast, reliable). UI tests are slower and
            brittle — use them only for critical user flows. Aim for a pyramid: many unit tests, some integration
            tests, few UI tests.
          </Note>

          <p className="finished-marker">
            ★ Testing covered. Continue below for performance tips and language features.
          </p>
        </section>

        <hr />

        {/* ─── S42 ─── */}
        <section className="section" id="s42" ref={setRef('s42')}>
          <h2><span className="section-num">42</span>Performance Tips</h2>

          <h3>Equatable views — skip unnecessary redraws</h3>
          <CodePre>{`// SwiftUI redraws a view when any of its inputs change.
// If your view's body is expensive, conform to Equatable:
struct ExpensiveRow: View, Equatable {
    let item: Item

    static func == (lhs: ExpensiveRow, rhs: ExpensiveRow) -> Bool {
        lhs.item.id == rhs.item.id && lhs.item.version == rhs.item.version
    }

    var body: some View { /* … expensive rendering … */ }
}

// Use .equatable() modifier to opt in to the comparison:
ExpensiveRow(item: item).equatable()`}</CodePre>

          <h3>Measuring with Instruments and the Canvas</h3>
          <CodePre>{`// In Xcode Canvas — click the Debug Preview button (►) to see
// which views are being redrawn. A flashing overlay shows redrawn views.

// Common causes of excessive redraws:
// 1. @Published property changes that don't affect the view — use separate ObservableObjects
// 2. Entire parent redrawing because one child's @State changed
// 3. Computed property that creates a new value on every comparison

// Fix 1: Split your ViewModel:
// Instead of one giant VM with 30 @Published properties,
// use focused VMs — a SearchViewModel, a CartViewModel, etc.
// Only views that observe a VM redraw when that VM changes.

// Fix 2: Extract subviews:
// If a list row has local state (e.g., isExpanded), put that
// @State inside the row struct — not in the parent. The parent
// won't redraw when the row's local state changes.`}</CodePre>

          <h3>Lazy loading</h3>
          <CodePre>{`// Always use LazyVStack / LazyHStack inside ScrollView for long lists:
ScrollView {
    LazyVStack {
        ForEach(items) { item in ItemRow(item: item) }
    }
}
// NOT:
ScrollView {
    VStack {   // ← creates ALL rows at once — bad for 1000 items
        ForEach(items) { item in ItemRow(item: item) }
    }
}

// List is already lazy by default — you don't need LazyVStack inside List.`}</CodePre>

          <h3>Image optimization</h3>
          <CodePre>{`// Resize images close to display size — loading a 4K image for a 50pt thumbnail wastes memory:
AsyncImage(url: imageURL) { image in
    image
        .resizable()
        .scaledToFill()
        .frame(width: 80, height: 80)
        .clipped()
} placeholder: {
    Color.gray.opacity(0.3)
}

// For local images, provide 1x/2x/3x assets in the Asset catalog
// instead of one large image that Swift scales down at runtime.`}</CodePre>
        </section>

        <hr />

        {/* ─── S43 ─── */}
        <section className="section" id="s43" ref={setRef('s43')}>
          <h2><span className="section-num">43</span>Operator Overloading</h2>
          <p>
            Swift lets you define or overload operators for your own types. Use sparingly — only when the
            operator has a clear, unambiguous meaning for the type.
          </p>

          <CodePre>{`struct Vector2D {
    var x: Double
    var y: Double

    // Overload + for Vector addition:
    static func + (lhs: Vector2D, rhs: Vector2D) -> Vector2D {
        Vector2D(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
    }

    // Overload * for scalar multiplication:
    static func * (lhs: Vector2D, rhs: Double) -> Vector2D {
        Vector2D(x: lhs.x * rhs, y: lhs.y * rhs)
    }

    // Compound assignment:
    static func += (lhs: inout Vector2D, rhs: Vector2D) {
        lhs = lhs + rhs
    }

    // Unary minus:
    static prefix func - (v: Vector2D) -> Vector2D {
        Vector2D(x: -v.x, y: -v.y)
    }

    // Equality (requires Equatable):
    static func == (lhs: Vector2D, rhs: Vector2D) -> Bool {
        lhs.x == rhs.x && lhs.y == rhs.y
    }

    var magnitude: Double { (x * x + y * y).squareRoot() }
}

let v1 = Vector2D(x: 1, y: 2)
let v2 = Vector2D(x: 3, y: 4)
let v3 = v1 + v2          // Vector2D(x: 4, y: 6)
let v4 = v1 * 2.0         // Vector2D(x: 2, y: 4)
var v5 = v1
v5 += v2                   // v5 is now Vector2D(x: 4, y: 6)
let v6 = -v1               // Vector2D(x: -1, y: -2)`}</CodePre>

          <h3>Custom operators</h3>
          <CodePre>{`// Define a completely new operator (use with restraint!):
infix operator **: MultiplicationPrecedence

func ** (base: Double, exponent: Double) -> Double {
    pow(base, exponent)
}

2.0 ** 10   // 1024.0
3.0 ** 3    // 27.0

// Pipe operator (functional style):
infix operator |>: AdditionPrecedence

func |> <A, B>(value: A, f: (A) -> B) -> B { f(value) }

let result = 5 |> { $0 * 2 } |> { $0 + 1 }   // 11`}</CodePre>

          <p className="finished-marker">
            ★ You now have a comprehensive Swift + SwiftUI reference covering the full language and UI toolkit —
            from value types to generics, from your first Text view to SwiftData and UIKit interop.
            Next: the <strong>iOS Deployment Guide</strong> covers shipping your app to real devices and the App Store.
          </p>
        </section>

        <hr />

        {/* ─── S44 ─── */}
        <section className="section" id="s44" ref={setRef('s44')}>
          <h2><span className="section-num">44</span>Opaque Types: <code>some</code> &amp; <code>any</code></h2>
          <p>
            These keywords appear constantly in SwiftUI and modern Swift code. Understanding the difference helps
            you read error messages and write correct generic code.
          </p>

          <h3><code>some</code> — opaque return type</h3>
          <CodePre>{`// The body property you write every day uses some:
var body: some View {
    Text("Hello")
}

// some View means: "I return a specific, concrete type that conforms to View,
// but I'm not saying which one." The compiler knows the exact type — you just
// don't need to spell it out.

// Why not just return View?
// Because View has an associated type (Body), making it not directly usable
// as a return type. some View is the practical solution.

// some in functions:
func makeButton(title: String) -> some View {
    Button(title) { }
        .buttonStyle(.borderedProminent)
}

// The caller gets a concrete (but unnamed) type. They can use it as a view
// but can't inspect what kind of view it is.`}</CodePre>

          <h3><code>any</code> — existential type</h3>
          <CodePre>{`// any Drawable means: "a box that holds any Drawable, type erased."
// You pay a runtime cost but gain flexibility to mix types in a collection.

var shapes: [any Drawable] = [Circle(), Triangle(), Star()]

for shape in shapes {
    shape.draw()   // dynamic dispatch — resolved at runtime
}

// any is explicit since Swift 5.7. Older code uses the protocol name directly:
var shapes: [Drawable] = [Circle(), Triangle()]  // Swift 5.6 and earlier style

// The rule:
// some T → single concrete type, known at compile time, no boxing overhead
// any T  → potentially different types, resolved at runtime, small boxing cost`}</CodePre>

          <h3>Associated types in protocols</h3>
          <CodePre>{`// Some protocols have associated types — placeholder types filled in at
// conformance time. Array is the clearest example:
// protocol Sequence { associatedtype Element }

protocol Container {
    associatedtype Item
    var items: [Item] { get }
    func add(_ item: Item)
}

struct Box<T>: Container {
    var items: [T] = []
    mutating func add(_ item: T) { items.append(item) }
}

// Because Container has an associated type, you CAN'T write:
// var c: Container  // ❌ — use 'any Container' or constrain with some

// Use some in function signatures:
func first(in container: some Container) -> Any? {
    container.items.first
}

// Or constrain with where:
func printAll<C: Container>(in container: C) where C.Item: CustomStringConvertible {
    container.items.forEach { print($0.description) }
}`}</CodePre>

          <h3>Primary associated types (Swift 5.7+)</h3>
          <CodePre>{`// Protocols can declare primary associated types, enabling constrained existentials:
protocol Container<Item> {
    associatedtype Item
    var items: [Item] { get }
}

// Now you can write:
func process(container: any Container<String>) {
    container.items.forEach { print($0) }
}

// Or with some:
func first(in container: some Container<Int>) -> Int? {
    container.items.first
}

// This replaces many use cases that previously required generic constraints with where clauses.`}</CodePre>

          <h3>ResultBuilder — how SwiftUI's ViewBuilder works</h3>
          <CodePre>{`// ViewBuilder is a ResultBuilder — a compiler feature that transforms
// a block of expressions into a single value. You can write your own:
@resultBuilder
struct HTMLBuilder {
    static func buildBlock(_ components: String...) -> String {
        components.joined(separator: "\n")
    }
    static func buildIf(_ component: String?) -> String {
        component ?? ""
    }
    static func buildEither(first component: String) -> String { component }
    static func buildEither(second component: String) -> String { component }
}

func html(@HTMLBuilder _ build: () -> String) -> String { build() }

let page = html {
    "<h1>Hello</h1>"
    "<p>Welcome to my site</p>"
    // if/else works because of buildEither:
    if showLogin { "<a href='/login'>Log in</a>" }
}
// page is "<h1>Hello</h1>\n<p>Welcome to my site</p>\n<a href='/login'>Log in</a>"

// SwiftUI's @ViewBuilder is exactly this — it's what allows:
// VStack {
//     Text("One")
//     Text("Two")          // these aren't function calls or a collection
//     if condition { Text("Three") }  // if works in a view body because of @ViewBuilder
// }`}</CodePre>

          <h3>Opaque types in SwiftUI custom views</h3>
          <CodePre>{`// When you extract a view into a computed property, use some View:
extension View {
    var withCardBackground: some View {
        self
            .padding()
            .background(.quaternary)
            .clipShape(.rect(cornerRadius: 12))
    }
}

// When you need to conditionally return different view types, use @ViewBuilder:
@ViewBuilder
var headerView: some View {
    if isLoggedIn {
        UserAvatarView(user: currentUser)
    } else {
        GuestWelcomeView()
    }
    // Without @ViewBuilder, the compiler would complain that the two branches
    // return different concrete types. @ViewBuilder uses buildEither under the
    // hood to merge them into a single opaque type.
}`}</CodePre>

          <Note>
            The practical rule: use <code>some</code> when your function or property always returns the same concrete
            type (even if you don't want to name it). Use <code>any</code> when you need a heterogeneous collection
            or truly need to accept any conforming type at runtime.
          </Note>

          <p className="finished-marker">
            ★ Complete. You now have a deep Swift + SwiftUI reference — 44 sections covering every core language
            feature and UI pattern you'll encounter daily. Next: the <strong>iOS Deployment Guide</strong> covers
            shipping your app to real devices, TestFlight, and the App Store.
          </p>
        </section>
      </main>
    </div>
  );
}
