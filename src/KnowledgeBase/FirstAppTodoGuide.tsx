import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'What We’re Building', icon: '🎯' },
  { id: 's2',  num: '2',  title: 'New Project',            icon: '🆕' },
  { id: 's3',  num: '3',  title: 'The Data Model',         icon: '🧱' },
  { id: 's4',  num: '4',  title: 'The List',               icon: '📋' },
  { id: 's5',  num: '5',  title: 'Add a Task',             icon: '➕' },
  { id: 's6',  num: '6',  title: 'Complete & Delete',      icon: '✅' },
  { id: 's7',  num: '7',  title: 'Persist with @AppStorage', icon: '💾' },
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

export default function FirstAppTodoGuide() {
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
            <span className="sidebar-title">Build a To-Do List</span>
          </div>
          <div className="sidebar-sub">Lists, sheets & saving data</div>
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
          <div className="hero-tag">✅ Build Your Second App · 2026</div>
          <h1>Build a To-Do List<br />(lists, sheets &amp; saving)</h1>
          <p>
            Your second app levels up: a real <strong style={{ color: '#C77AA0' }}>data model</strong>, a scrollable
            list you add to and delete from, a slide-up form, and — the big one —
            <strong style={{ color: '#C77AA0' }}> saving data so your tasks survive closing the app</strong>. These are
            the building blocks behind most apps you use every day. Do the Tip Calculator guide first; this one moves a
            little faster.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">List</span><span className="hero-stat-label">Dynamic rows</span></div>
            <div className="hero-stat"><span className="hero-stat-val">.sheet</span><span className="hero-stat-label">Slide-up add form</span></div>
            <div className="hero-stat"><span className="hero-stat-val">swipe</span><span className="hero-stat-label">Delete to remove</span></div>
            <div className="hero-stat"><span className="hero-stat-val">💾</span><span className="hero-stat-label">Survives relaunch</span></div>
          </div>
        </div>

        {/* SECTION 1 — WHAT */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>What We're Building</h2>
          <ul>
            <li>A list of tasks, each with a title and a done/not-done state.</li>
            <li>A <strong>+</strong> button that slides up a form to add a new task.</li>
            <li>Tap a row to <strong>toggle</strong> done (a checkmark + strikethrough).</li>
            <li><strong>Swipe</strong> a row to delete it.</li>
            <li>Everything <strong>saved automatically</strong>, so it's all still there when you reopen the app.</li>
          </ul>
          <MermaidDiagram theme="default" chart={`graph TB
  ADD[Tap +] --> SHEET[Add form slides up]
  SHEET --> ITEMS[(items array)]
  ITEMS --> LIST[List shows a row each]
  LIST -->|tap| TOGGLE[toggle done]
  LIST -->|swipe| DEL[delete]
  TOGGLE --> ITEMS
  DEL --> ITEMS
  ITEMS -->|auto-save| DISK[(saved on device)]`} />
        </section>

        <hr />

        {/* SECTION 2 — NEW PROJECT */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>New Project</h2>
          <p>
            Same as before: <strong>File → New → Project</strong> → iOS → App → Name it <code>TodoList</code>, Interface
            <strong> SwiftUI</strong>, Language <strong>Swift</strong>. Open <code>ContentView.swift</code>. We'll build
            it up section by section, then show the finished file.
          </p>
        </section>

        <hr />

        {/* SECTION 3 — MODEL */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The Data Model</h2>
          <p>
            A "to-do item" is two things: a title and whether it's done. Bundle them in a <code>struct</code>. Put this
            <strong> above</strong> <code>struct ContentView</code> (or in its own file — File → New → File → Swift File
            → <code>TodoItem.swift</code>):
          </p>
          <CodePre>{`struct TodoItem: Identifiable, Codable {
    var id = UUID()
    var title: String
    var isDone = false
}`}</CodePre>
          <p>Two important keywords after the name:</p>
          <ul>
            <li><strong>Identifiable</strong> — gives each item a unique <code>id</code> (the <code>UUID()</code>), so
              <code> List</code> can tell rows apart and animate them. (You saw this in the SwiftUI guide.)</li>
            <li><strong>Codable</strong> — lets Swift convert the item to/from data (JSON) automatically. This is what
              makes saving possible in §7. You get it for free just by listing the keyword, as long as every field is a
              simple type.</li>
          </ul>
          <Note kind="warn">
            <strong>Don't name it <code>Task</code>.</strong> Swift already has a built-in type called <code>Task</code>
            (for concurrency), and reusing the name causes confusing errors. <code>TodoItem</code> (or
            <code> Chore</code>, <code>Todo</code>) avoids the clash.
          </Note>
          <p>Now give <code>ContentView</code> an array of them to display. Start with <code>@State</code> (we'll upgrade it to saved storage in §7):</p>
          <CodePre>{`struct ContentView: View {
    @State private var items: [TodoItem] = [
        TodoItem(title: "Buy groceries"),
        TodoItem(title: "Walk the dog")
    ]

    var body: some View {
        Text("\\(items.count) tasks")   // placeholder for now
    }
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 4 — LIST */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The List</h2>
          <p>Replace the placeholder body with a real list. We use <code>ForEach($items)</code> — note the <code>$</code> — so each row gets a <strong>binding</strong> it can change (to toggle done in §6):</p>
          <CodePre>{`var body: some View {
    NavigationStack {
        List {
            ForEach($items) { $item in
                HStack {
                    Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                        .foregroundStyle(item.isDone ? .green : .secondary)
                    Text(item.title)
                        .strikethrough(item.isDone)
                }
            }
        }
        .navigationTitle("To-Do")
    }
}`}</CodePre>
          <ul>
            <li><code>ForEach($items) {'{ $item in }'}</code> — loops the array, handing each row a writable
              <code> $item</code>. Inside, <code>item</code> is the current task.</li>
            <li><code>Image(systemName: …)</code> — a built-in SF Symbol; a filled green check when done, an empty
              circle when not.</li>
            <li><code>.strikethrough(item.isDone)</code> — crosses out the title once done.</li>
          </ul>
          <p>Run it: you'll see your two starter tasks as rows with empty circles. Next, make them do something.</p>
        </section>

        <hr />

        {/* SECTION 5 — ADD */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Add a Task</h2>
          <p>We need a <strong>+</strong> button in the toolbar that slides up a form. Add two pieces of state:</p>
          <CodePre>{`@State private var showingAdd = false
@State private var newTitle = ""`}</CodePre>
          <p>Add a toolbar button (inside <code>NavigationStack</code>, after <code>.navigationTitle</code>):</p>
          <CodePre>{`.toolbar {
    Button {
        showingAdd = true
    } label: {
        Image(systemName: "plus")
    }
}`}</CodePre>
          <p>And the sheet that appears when <code>showingAdd</code> becomes true:</p>
          <CodePre>{`.sheet(isPresented: $showingAdd) {
    NavigationStack {
        Form {
            TextField("What needs doing?", text: $newTitle)
        }
        .navigationTitle("New Task")
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Add") {
                    let trimmed = newTitle.trimmingCharacters(in: .whitespaces)
                    if !trimmed.isEmpty {
                        items.append(TodoItem(title: trimmed))
                    }
                    newTitle = ""
                    showingAdd = false
                }
            }
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel") {
                    newTitle = ""
                    showingAdd = false
                }
            }
        }
    }
}`}</CodePre>
          <ul>
            <li><code>.sheet(isPresented: $showingAdd)</code> — shows the card while the boolean is true; the user can
              swipe it down, or our buttons set it back to false.</li>
            <li><code>items.append(TodoItem(title: trimmed))</code> — adds the new task; the list updates itself.</li>
            <li><code>trimmingCharacters(in: .whitespaces)</code> + the <code>if !trimmed.isEmpty</code> check — quietly
              ignores blank entries so you don't add empty rows.</li>
            <li><code>.confirmationAction</code> / <code>.cancellationAction</code> — standard placements that put Add on
              the right and Cancel on the left, the way iOS users expect.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 6 — COMPLETE & DELETE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Complete &amp; Delete</h2>
          <h3>Tap to toggle done</h3>
          <p>Because each row has a <code>$item</code> binding, toggling is one line. Add a tap gesture to the row's <code>HStack</code>:</p>
          <CodePre>{`HStack {
    Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
        .foregroundStyle(item.isDone ? .green : .secondary)
    Text(item.title)
        .strikethrough(item.isDone)
}
.contentShape(.rect)              // makes the whole row tappable
.onTapGesture {
    item.isDone.toggle()          // flips done; the row redraws itself
}`}</CodePre>
          <p>
            <code>item.isDone.toggle()</code> writes back through the binding into the array. SwiftUI sees the change and
            redraws that row (check fills in, title strikes through). <code>.contentShape(.rect)</code> makes the empty
            space in the row tappable too, not just the text.
          </p>
          <h3>Swipe to delete</h3>
          <p>Attach <code>.onDelete</code> to the <code>ForEach</code> (not the List). This gives you the standard swipe-left-to-delete for free:</p>
          <CodePre>{`ForEach($items) { $item in
    // ...row...
}
.onDelete { indexSet in
    items.remove(atOffsets: indexSet)
}`}</CodePre>
          <p>
            <code>indexSet</code> is which row(s) the user swiped; <code>remove(atOffsets:)</code> deletes them. You can
            also add an <code>EditButton()</code> to the toolbar for tap-to-delete, but swipe is enough.
          </p>
        </section>

        <hr />

        {/* SECTION 7 — PERSIST */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Persist with @AppStorage</h2>
          <p>
            Right now, closing the app loses everything — <code>@State</code> lives only while the app runs. To
            <strong> save</strong> tasks on the device, switch the array from <code>@State</code> to
            <strong> <code>@AppStorage</code></strong>, which reads and writes the device's small built-in key-value
            store automatically.
          </p>
          <p>
            <code>@AppStorage</code> natively handles simple types (String, Int, Bool…). To store an <em>array of our
            Codable struct</em>, we add a small one-time helper that teaches Swift how to turn any
            <code> Codable</code> array into a string and back. <strong>Paste this at the bottom of the file</strong> —
            you don't need to fully understand it yet, just that it makes the next line work:
          </p>
          <CodePre>{`// Persistence helper — lets @AppStorage save any array of Codable items.
extension Array: @retroactive RawRepresentable where Element: Codable {
    public init?(rawValue: String) {
        guard let data = rawValue.data(using: .utf8),
              let decoded = try? JSONDecoder().decode([Element].self, from: data)
        else { return nil }
        self = decoded
    }
    public var rawValue: String {
        guard let data = try? JSONEncoder().encode(self),
              let json = String(data: data, encoding: .utf8)
        else { return "[]" }
        return json
    }
}`}</CodePre>
          <p>Now change the array declaration — one line is all it takes:</p>
          <CodePre>{`// before:
// @State private var items: [TodoItem] = [ ... ]

// after:
@AppStorage("todoItems") private var items: [TodoItem] = []`}</CodePre>
          <p>
            That's it. <code>"todoItems"</code> is just the key it saves under. Every time you append, toggle, or delete,
            <code> @AppStorage</code> re-encodes the array to JSON and writes it; on launch it reads it back. Run the app,
            add a few tasks, <strong>fully quit it</strong> (in the Simulator: Device → Home, then swipe the app away, or
            just stop and re-run from Xcode), reopen — your tasks are still there.
          </p>
          <Note>
            <strong>What's happening:</strong> <code>JSONEncoder</code> turns your <code>[TodoItem]</code> into text like
            <code> [{'{'}"id":"…","title":"Buy milk","isDone":false{'}'}]</code>, which <code>@AppStorage</code> saves.
            On load, <code>JSONDecoder</code> rebuilds the array. This works <em>because</em> <code>TodoItem</code> is
            <code> Codable</code> (§3) — that one keyword is doing the heavy lifting.
          </Note>
          <Note kind="warn">
            <code>@AppStorage</code> is meant for <strong>small</strong> data (settings, short lists) — it's perfect
            here. For hundreds of items or relationships between data, you'd graduate to <strong>SwiftData</strong> or a
            database (a "next step", not needed now).
          </Note>
        </section>

        <hr />

        {/* SECTION 8 — POLISH */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Polish</h2>
          <h3>An empty state</h3>
          <p>When there are no tasks, show a friendly message instead of a blank list using <code>ContentUnavailableView</code>:</p>
          <CodePre>{`if items.isEmpty {
    ContentUnavailableView("No tasks yet", systemImage: "checklist", description: Text("Tap + to add your first one."))
} else {
    List {
        ForEach($items) { $item in /* ...rows... */ }
            .onDelete { items.remove(atOffsets: $0) }
    }
}`}</CodePre>
          <h3>A remaining-count subtitle</h3>
          <p>Show how many are left to do in the navigation bar area:</p>
          <CodePre>{`let remaining = items.filter { !$0.isDone }.count
// ...
.navigationTitle("To-Do")
.navigationSubtitle("\\(remaining) remaining")   // iOS 26+; otherwise put it in a Text row`}</CodePre>
          <p>
            <code>items.filter {'{ !$0.isDone }'}.count</code> counts the not-done tasks. <code>filter</code> keeps only
            items matching the test — a handy tool you'll reach for constantly. (If <code>navigationSubtitle</code> isn't
            available on your target, just put the count in a small <code>Text</code> at the top of the list.)
          </p>
        </section>

        <hr />

        {/* SECTION 9 — RUN */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Run It</h2>
          <p>Here's the core of the finished <code>ContentView</code> for reference (the persistence helper from §7 goes below it):</p>
          <CodePre>{`import SwiftUI

struct ContentView: View {
    @AppStorage("todoItems") private var items: [TodoItem] = []
    @State private var showingAdd = false
    @State private var newTitle = ""

    var body: some View {
        NavigationStack {
            List {
                ForEach($items) { $item in
                    HStack {
                        Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                            .foregroundStyle(item.isDone ? .green : .secondary)
                        Text(item.title).strikethrough(item.isDone)
                    }
                    .contentShape(.rect)
                    .onTapGesture { item.isDone.toggle() }
                }
                .onDelete { items.remove(atOffsets: $0) }
            }
            .navigationTitle("To-Do")
            .toolbar {
                Button { showingAdd = true } label: { Image(systemName: "plus") }
            }
            .sheet(isPresented: $showingAdd) {
                NavigationStack {
                    Form { TextField("What needs doing?", text: $newTitle) }
                        .navigationTitle("New Task")
                        .toolbar {
                            ToolbarItem(placement: .confirmationAction) {
                                Button("Add") {
                                    let t = newTitle.trimmingCharacters(in: .whitespaces)
                                    if !t.isEmpty { items.append(TodoItem(title: t)) }
                                    newTitle = ""; showingAdd = false
                                }
                            }
                            ToolbarItem(placement: .cancellationAction) {
                                Button("Cancel") { newTitle = ""; showingAdd = false }
                            }
                        }
                }
            }
        }
    }
}`}</CodePre>
          <p>Press <strong>▶ Run</strong> (<code>⌘R</code>). Add tasks, tap to complete, swipe to delete, quit and reopen to confirm they're saved. <strong>You built a real, persistent app.</strong></p>
        </section>

        <hr />

        {/* SECTION 10 — RECAP */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">✦</span>Recap &amp; Next Steps</h2>
          <h3>What you just used</h3>
          <table>
            <tbody>
              <tr><th>Concept</th><th>Where</th></tr>
              <tr><td>A model struct</td><td><code>TodoItem</code> (<code>Identifiable</code>, <code>Codable</code>)</td></tr>
              <tr><td>An array of state</td><td><code>items</code></td></tr>
              <tr><td>Dynamic rows + per-row binding</td><td><code>ForEach($items)</code></td></tr>
              <tr><td>Slide-up form</td><td><code>.sheet</code> + toolbar buttons</td></tr>
              <tr><td>Add / toggle / delete</td><td><code>append</code> · <code>toggle()</code> · <code>.onDelete</code></td></tr>
              <tr><td>Saving data</td><td><code>@AppStorage</code> + <code>Codable</code> + the Array helper</td></tr>
              <tr><td>Filtering</td><td><code>items.filter {'{ !$0.isDone }'}</code></td></tr>
            </tbody>
          </table>
          <h3>Where to go next</h3>
          <ul>
            <li><strong>Add features:</strong> a due date (<code>DatePicker</code>), categories, sorting done items to
              the bottom, or an edit screen via <code>NavigationLink</code>.</li>
            <li><strong>Graduate the storage:</strong> learn <strong>SwiftData</strong> (Apple's modern, built-in
              database) when your data outgrows <code>@AppStorage</code>.</li>
            <li><strong>Different path:</strong> if your goal is to ship one of your existing <em>web</em> apps to iOS
              rather than build native, see the <strong>WKWebView Integration</strong> guide and the
              <strong> iOS Deployment Guide</strong>.</li>
          </ul>
          <p className="finished-marker">★ Two apps down. You now know the core loop of nearly every iPhone app: a model, a list, a form, and saved data. Keep building — pick an app you actually want and add one new piece at a time.</p>
        </section>
      </main>
    </div>
  );
}
