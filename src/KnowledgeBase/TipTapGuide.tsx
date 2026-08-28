import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'ProseMirror Underneath',           icon: '⚙️' },
  { id: 's3',  num: '3',  title: 'Extensions + StarterKit',          icon: '🧩' },
  { id: 's4',  num: '4',  title: 'useEditor + editorProps',          icon: '🪝' },
  { id: 's5',  num: '5',  title: 'Slash Menu (Suggestion)',          icon: '⌨️' },
  { id: 's6',  num: '6',  title: 'BubbleMenu Toolbar',               icon: '🫧' },
  { id: 's7',  num: '7',  title: 'Custom Node Views (React)',        icon: '🎨' },
  { id: 's8',  num: '8',  title: 'Image Upload + Drop / Paste',      icon: '📤' },
  { id: 's9',  num: '9',  title: 'Lazy Loading + Save Flow',         icon: '💾' },
  { id: 's10', num: '10', title: 'Schema Sanitization',              icon: '🛡️' },
  { id: 's11', num: '★',  title: 'Lab: Mini Notebook Editor',        icon: '🛠️' },
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

export default function TipTapGuide() {
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
            <span className="sidebar-title">TipTap Editor</span>
          </div>
          <div className="sidebar-sub">Tabloom's rich text engine</div>
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
          <div className="hero-tag">📝 TipTap 2.27 · ProseMirror · 2026</div>
          <h1>TipTap Rich-Text Editor<br />(Tabloom deep dive)</h1>
          <p>
            Tabloom is the only fleet app shipping a rich-text editor — <strong style={{ color: '#C77AA0' }}>TipTap 2.27
            over ProseMirror</strong>. This guide walks every layer: the StarterKit + 12 extensions Tabloom enables,
            the slash-command menu implemented as a Suggestion plugin, the BubbleMenu that floats above selected text,
            two custom React node views (Callout, Figure), the auto-save debounce, the lazy-loaded ~350KB bundle, and
            how ProseMirror's schema is the actual sanitizer.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">14</span><span className="hero-stat-label">Extensions</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Custom node views</span></div>
            <div className="hero-stat"><span className="hero-stat-val">500ms</span><span className="hero-stat-label">Save debounce</span></div>
            <div className="hero-stat"><span className="hero-stat-val">~350KB</span><span className="hero-stat-label">Lazy chunk</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            TipTap is a React-friendly wrapper around <strong>ProseMirror</strong> — the rigorous open-source editor
            engine behind Atlassian, the New York Times, Notion, and most "Notion-style" notebooks. ProseMirror is
            opinionated: every editable region has a strict <em>schema</em> that defines what's allowed; the editor
            content is a <em>document</em> in that schema; every change goes through a <em>transaction</em>.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The IDE for prose.</strong> A code editor (VS Code) enforces syntax: it knows what tokens are
            legal where, how to indent, what auto-completes. ProseMirror does the same for prose: heading then
            paragraph, lists inside lists, tables in 3×3 grids. The "syntax" is your schema.
          </p>
          <p>
            <strong>Slate vs ProseMirror vs Lexical.</strong> Three serious rich-text engines exist in 2026. ProseMirror
            (TipTap's foundation) is the most opinionated — schema-first, transaction-based. Slate is more
            "React-shaped." Lexical (Meta's) is somewhere between. TipTap picked ProseMirror for correctness; Tabloom
            picked TipTap for ergonomics.
          </p>
          <p>
            <strong>Why not contentEditable directly?</strong> <code>{`<div contentEditable>`}</code> is the browser's
            built-in rich-text input. It's a nightmare. Different browsers produce different HTML for the same edits;
            keyboard handling is inconsistent; selection state is fragile. ProseMirror exists because contentEditable
            doesn't scale. TipTap is the React-friendly face of that scaling.
          </p>

          <h3>The four layers</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  R[Your React app]
  R --> T[TipTap React adapter]
  T --> TC[TipTap core + extensions]
  TC --> PM[ProseMirror]
  PM --> DOM[contentEditable DOM]

  style PM fill:#5C2A4A,color:#fff
  style TC fill:#5C2A4A,color:#fff`} />

          <ul>
            <li><strong>ProseMirror</strong>: the engine. Schema, document, transactions, plugins.</li>
            <li><strong>TipTap core</strong>: an extension API on top — declare features as objects, register with the editor.</li>
            <li><strong>TipTap React</strong>: <code>useEditor()</code> hook, <code>{`<EditorContent>`}</code> + <code>{`<BubbleMenu>`}</code> components, <code>ReactNodeViewRenderer</code> for rendering React inside ProseMirror.</li>
            <li><strong>Your code</strong>: pick extensions, configure them, write commands, style with CSS.</li>
          </ul>

          <h3>What Tabloom uses TipTap for</h3>
          <p>The page editor — the central feature of the notebook app. Every "page" is one TipTap document, persisted as ProseMirror JSON in a SQLite column. Tabloom lets users:</p>
          <ul>
            <li>Type formatted text (bold, italic, headings, lists, tables, code)</li>
            <li>Press <code>/</code> to insert blocks (callout, figure, code block, table, image)</li>
            <li>Drag-handle blocks around</li>
            <li>Drop or paste images directly into the editor</li>
            <li>Auto-save every 500ms of inactivity</li>
            <li>Versioned history (every save creates a page_versions row if content changed)</li>
          </ul>

          <h3>The cost of TipTap</h3>
          <ul>
            <li><strong>~350KB gzipped bundle</strong>. Lazy-loaded behind <code>React.lazy</code>.</li>
            <li>One ProseMirror runtime per editor instance.</li>
            <li>A learning curve — the schema/transaction model takes a week to internalize.</li>
            <li>Custom node views need both ProseMirror schema definition AND React component.</li>
          </ul>

          <p>For an app that needs ONE rich-text editor, the cost is right. For an app that needs a sticky-note input field, just use <code>{`<textarea>`}</code>.</p>
        </section>

        <hr />

        {/* SECTION 2 — PROSEMIRROR */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>ProseMirror Underneath</h2>
          <p>You can use TipTap without knowing ProseMirror. You'll write better TipTap if you know what's under it. A few concepts that matter.</p>

          <h3>The document is a tree</h3>
          <p>Not a string of HTML. Not a Markdown string. A typed tree:</p>
          <CodePre>{`{
  "type": "doc",
  "content": [
    { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Hello" }] },
    { "type": "paragraph", "content": [
      { "type": "text", "marks": [{ "type": "bold" }], "text": "World" }
    ] }
  ]
}`}</CodePre>

          <p>Every node has a <strong>type</strong> (heading, paragraph, table, callout). Inline content has <strong>marks</strong> (bold, italic, link, code). Nodes have <strong>attrs</strong> (heading.level, image.src). This shape is what Tabloom serializes to SQLite as <code>body_json</code>.</p>

          <h3>The schema defines what's legal</h3>
          <p>A schema is a JS object mapping node names to their content rules:</p>
          <CodePre>{`// Pseudo — actual schema is generated by TipTap from extensions
{
  doc:       { content: "block+" },
  paragraph: { content: "inline*", group: "block" },
  heading:   { content: "inline*", group: "block", attrs: { level: { default: 1 } } },
  text:      { group: "inline" },
  bold:      { type: "mark" },
  table:     { content: "tableRow+", group: "block" },
  tableRow:  { content: "tableCell+" },
  tableCell: { content: "block+" },
}`}</CodePre>

          <p>"block+" means one-or-more block-group nodes. "inline*" means zero-or-more inline. The schema rejects invalid input — you can't INSERT a tableRow at the top of doc; you can't put a heading inside an inline span.</p>

          <h3>Transactions, not mutations</h3>
          <p>You don't mutate the document. You create a <strong>transaction</strong> — a description of changes — and apply it:</p>
          <CodePre>{`// Conceptual
const tr = editor.state.tr   // ← new transaction
tr.insertText('Hello', 5, 5)  // ← describe a change
editor.view.dispatch(tr)       // ← apply
// (TipTap's chain() API wraps this in a fluent builder)`}</CodePre>

          <p>The transaction model means: every change is atomic, history (undo/redo) is built-in, plugins can react to each transaction, collaborative editing is possible.</p>

          <h3>Plugins extend ProseMirror</h3>
          <p>Plugins observe transactions, can modify them, can add their own UI. TipTap's extensions ARE ProseMirror plugins (with some convenience layered on top).</p>

          <h3>What this means in practice</h3>
          <ul>
            <li><strong>You write to the schema, not to HTML.</strong> Add a new block type? Define its schema node first.</li>
            <li><strong>"Just add this CSS class" doesn't work for blocks.</strong> The class has to be part of the node's <code>renderHTML</code>.</li>
            <li><strong>HTML import / export</strong> uses <code>parseHTML</code> / <code>renderHTML</code> rules per node. Anything not in the schema doesn't survive a round-trip.</li>
            <li><strong>Sanitization is implicit.</strong> ProseMirror only accepts what the schema allows. <code>{`<script>`}</code> isn't in the schema — it gets dropped. (More on this in §10.)</li>
          </ul>

          <h3>Beyond TipTap's surface</h3>
          <p>Most days, you write TipTap extensions and never touch ProseMirror directly. When you DO need to (custom node views with complex schema, collaborative editing, plugin observability), the docs at prosemirror.net are essential. TipTap's extension API is intentionally a leaky abstraction — you can drop down to ProseMirror APIs anywhere.</p>
        </section>

        <hr />

        {/* SECTION 3 — EXTENSIONS */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Extensions + StarterKit</h2>
          <p>An extension is the unit of TipTap functionality. Each extension can register schema (nodes + marks), commands (e.g. <code>toggleBold</code>), keyboard shortcuts (<code>Ctrl+B</code>), input rules (<code>**bold**</code> → bold mark), and ProseMirror plugins.</p>

          <h3>StarterKit — the batteries-included bundle</h3>
          <p>StarterKit is a single extension that bundles ~15 of TipTap's most common extensions. It's the recommended starting point.</p>
          <CodePre>{`import StarterKit from '@tiptap/starter-kit'

StarterKit.configure({
  heading: { levels: [2, 3] },              // restrict to h2/h3
  codeBlock: { HTMLAttributes: { class: 'codeblock' } },
})`}</CodePre>

          <p>What's in StarterKit (Tabloom's view):</p>
          <table>
            <tbody>
              <tr><th>Extension</th><th>Provides</th></tr>
              <tr><td>Document</td><td>The root <code>doc</code> node — required</td></tr>
              <tr><td>Paragraph</td><td>The default block</td></tr>
              <tr><td>Text</td><td>The inline text node — required</td></tr>
              <tr><td>Heading</td><td>h1–h6 (Tabloom restricts to h2-h3)</td></tr>
              <tr><td>BulletList / OrderedList / ListItem</td><td>Lists</td></tr>
              <tr><td>HardBreak</td><td>Shift+Enter line break</td></tr>
              <tr><td>HorizontalRule</td><td><code>---</code> → <code>&lt;hr&gt;</code></td></tr>
              <tr><td>Blockquote</td><td><code>&gt;</code> → quote</td></tr>
              <tr><td>CodeBlock</td><td>Fenced code blocks (Tabloom adds className)</td></tr>
              <tr><td>Bold / Italic / Strike / Code</td><td>Inline marks</td></tr>
              <tr><td>History</td><td>Undo/redo</td></tr>
              <tr><td>Dropcursor / Gapcursor</td><td>Visual cursors for drag/drop + tables</td></tr>
            </tbody>
          </table>

          <p>You can disable any with <code>{`{ historyDisabled: true }`}</code>-style options — see TipTap docs.</p>

          <h3>Tabloom's full extension list</h3>
          <CodePre>{`// tabloom/src/routes/PageView/RichEditor.tsx — verbatim
const extensions = useMemo(
  () => [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      codeBlock: { HTMLAttributes: { class: 'codeblock' } },
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: false }),
    TableRow,
    TableCell,
    TableHeader,
    Callout,
    TagInline,
    Figure,
    Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
    GlobalDragHandle.configure({ dragHandleWidth: 20 }),
    Placeholder.configure({
      placeholder: 'Write something, or press "/" for blocks…',
    }),
    SlashCommand.configure({ onState: setSlashState }),
  ],
  [],
)`}</CodePre>

          <p>Three groups beyond StarterKit:</p>
          <ol>
            <li><strong>Standard TipTap extensions</strong>: TaskList, TaskItem, Table, TableRow, TableCell, TableHeader, Link, Placeholder.</li>
            <li><strong>Third-party</strong>: GlobalDragHandle (drag handle).</li>
            <li><strong>Tabloom-custom</strong>: Callout, TagInline, Figure, SlashCommand. These live in <code>src/routes/PageView/tiptap/*.tsx</code>.</li>
          </ol>

          <h3>The <code>configure()</code> pattern</h3>
          <p>Every extension exports an instance you can call <code>.configure({`{ ... }`})</code> on to customize. Configuration is type-safe:</p>
          <CodePre>{`Link.configure({
  openOnClick: false,    // don't follow links in the editor
  autolink: true,         // type a URL → becomes a link
  linkOnPaste: true,      // paste a URL with text selected → wraps in link
})

Table.configure({ resizable: false })   // no drag handles on column borders

TaskItem.configure({ nested: true })    // allow checklists inside checklists`}</CodePre>

          <h3>Stable references</h3>
          <p>Notice <code>useMemo(() =&gt; [...], [])</code>. The extensions array MUST be stable across renders. If it changes (new array each render), TipTap re-initializes the editor + loses content. Empty dep array = create once.</p>

          <h3>Creating a custom extension</h3>
          <CodePre>{`import { Node } from '@tiptap/core'

export const MyBlock = Node.create({
  name: 'myBlock',         // schema name
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'div[data-type="my-block"]' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'my-block' }, 0]
  },
})`}</CodePre>

          <p>Three required fields: <code>name</code> (schema key), the <code>group</code> + <code>content</code> rules (where can it live, what can it contain), and the <code>parseHTML</code> / <code>renderHTML</code> pair (how to serialize/deserialize).</p>
        </section>

        <hr />

        {/* SECTION 4 — USEEDITOR */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span><code>useEditor</code> + editorProps</h2>
          <p>The React hook that bootstraps the editor. Wraps a ProseMirror EditorView in a React-friendly hook that re-renders when content changes.</p>

          <h3>Tabloom's full call</h3>
          <CodePre>{`// tabloom/src/routes/PageView/RichEditor.tsx — verbatim (lines 122-149)
const editor = useEditor(
  {
    extensions,
    content: initialContent as Content,
    editable,
    editorProps: {
      attributes: { class: 'editor tiptap', 'data-anno': 'editor-body' },
      handlePaste: (_view, event) =>
        editable ? insertImageFiles(event.clipboardData?.files) : false,
      handleDrop: (_view, event) =>
        editable ? insertImageFiles((event as DragEvent).dataTransfer?.files) : false,
    },
    onUpdate: ({ editor: ed }) => {
      if (!editable) return
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      setSaveState('saving')
      const id = pageIdRef.current
      saveTimer.current = window.setTimeout(async () => {
        try {
          const doc = ed.getJSON() as ProseMirrorDoc
          const text = ed.getText().replace(/\\s+/g, ' ').trim()
          await updatePage(id, { notes: doc, snippet: text.slice(0, 160) })
          setSaveState('saved')
        } catch {
          setSaveState('error')
        }
      }, 500)
    },
  },
  // dep array — re-create editor when any of these change
)`}</CodePre>

          <h3>The config object</h3>
          <table>
            <tbody>
              <tr><th>Field</th><th>Purpose</th></tr>
              <tr><td><code>extensions</code></td><td>The array from §3</td></tr>
              <tr><td><code>content</code></td><td>Initial document — ProseMirror JSON, HTML string, or text</td></tr>
              <tr><td><code>editable</code></td><td>Read-only mode toggle (Tabloom toggles via viewer-vs-editor permission)</td></tr>
              <tr><td><code>editorProps</code></td><td>Pass-through to ProseMirror's <code>EditorView</code> — handlers + attributes</td></tr>
              <tr><td><code>onCreate</code> / <code>onUpdate</code> / <code>onSelectionUpdate</code> / <code>onDestroy</code></td><td>Lifecycle callbacks</td></tr>
              <tr><td><code>autofocus</code></td><td><code>true</code> | <code>'start'</code> | <code>'end'</code> | position number</td></tr>
              <tr><td><code>injectCSS</code></td><td>Inject TipTap's default styles (default true)</td></tr>
            </tbody>
          </table>

          <h3>editorProps — ProseMirror's escape hatch</h3>
          <p>Everything in <code>editorProps</code> is passed directly to ProseMirror. The most useful:</p>
          <CodePre>{`editorProps: {
  // Class + data attributes on the contentEditable root
  attributes: {
    class: 'editor tiptap',
    'data-anno': 'editor-body',
  },

  // Handle paste — return true to skip default behavior
  handlePaste: (view, event) => {
    const files = event.clipboardData?.files
    if (files && files.length > 0) {
      // Custom handling for pasted files
      return true
    }
    return false  // ProseMirror's default
  },

  // Handle drop — same shape as paste
  handleDrop: (view, event) => { ... },

  // Handle keyboard events at the editor level
  handleKeyDown: (view, event) => { ... },
}`}</CodePre>

          <h3>The editor object</h3>
          <p><code>useEditor</code> returns the <code>Editor</code> instance (or null briefly during init):</p>
          <CodePre>{`editor.getJSON()             // ← current document as ProseMirror JSON
editor.getHTML()             // ← current document serialized to HTML
editor.getText()             // ← plain text content
editor.commands.setContent(json)  // ← replace document
editor.chain().focus().toggleBold().run()   // ← fluent commands
editor.isActive('bold')      // ← is selection inside a bold mark?
editor.isActive('heading', { level: 2 })   // ← attr-aware
editor.can().undo()          // ← would undo do anything?
editor.state.doc             // ← raw ProseMirror node tree
editor.view                  // ← raw ProseMirror EditorView`}</CodePre>

          <h3>The <code>chain().focus().X().run()</code> pattern</h3>
          <p>The fluent command API. Each command returns a new chain; <code>.run()</code> dispatches the transaction.</p>
          <CodePre>{`editor.chain().focus().toggleBold().run()
editor.chain().focus().setHeading({ level: 2 }).run()
editor.chain().focus().insertContent({ type: 'callout', content: [{ type: 'text', text: 'Hi' }] }).run()
editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()`}</CodePre>

          <p>The <code>.focus()</code> is critical — without it, the editor loses focus when you click a toolbar button, breaking selection-based commands.</p>

          <h3>The save flow shape</h3>
          <p>Tabloom's <code>onUpdate</code> debounces saves at 500ms:</p>
          <ol>
            <li>User types something. ProseMirror dispatches a transaction. <code>onUpdate</code> fires.</li>
            <li>Cancel any pending save timer.</li>
            <li>Set UI state to "saving".</li>
            <li>Schedule a new save in 500ms.</li>
            <li>If user types again within 500ms, repeat from step 2.</li>
            <li>Once idle for 500ms, send the document to the server.</li>
          </ol>

          <p>Result: rapid typing produces ONE save 500ms after the last keystroke, not one per keystroke.</p>
        </section>

        <hr />

        {/* SECTION 5 — SLASH MENU */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Slash Menu (Suggestion plugin)</h2>
          <p>The "/" trigger that opens an inline block-picker (Notion-style). TipTap ships the <code>@tiptap/suggestion</code> infrastructure; you build the UI + action mapping.</p>

          <h3>The mental model</h3>
          <p>When the user types <code>/</code>, the Suggestion plugin watches their following keystrokes. It reports query updates via callbacks. You render a popup somewhere outside the editor + execute commands when items are picked.</p>

          <h3>Tabloom's SlashCommand extension</h3>
          <CodePre>{`// tabloom/src/routes/PageView/tiptap/SlashCommand.ts — verbatim (lines 74-120)
export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',
  addOptions() { return { onState: () => {} } },

  addProseMirrorPlugins() {
    const onState = this.options.onState
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        startOfLine: false,
        allowSpaces: false,
        items: () => SLASH_ITEMS.map(i => i.key),
        command: () => {
          /* unused — the popup runs editor commands directly via state.run */
        },
        render: () => {
          const push = (props: {
            query: string
            clientRect?: (() => DOMRect | null) | null
            editor: Editor
            range: Range
          }) => {
            onState({
              open: true,
              query: props.query,
              rect: props.clientRect?.() ?? null,
              run: (key) => applyBlock(props.editor, props.range, key),
            })
          }
          return {
            onStart: push,
            onUpdate: push,
            onKeyDown: (props) => slashKeyHandlerRef.current?.(props.event) ?? false,
            onExit: () => {
              onState({ open: false, query: '', rect: null, run: null })
            },
          }
        },
      }),
    ]
  },
})`}</CodePre>

          <h3>The Suggestion lifecycle</h3>
          <ol>
            <li><code>onStart</code>: user typed the trigger char. Open the popup.</li>
            <li><code>onUpdate</code>: every subsequent keystroke. Filter items by query.</li>
            <li><code>onKeyDown</code>: intercept arrow keys + Enter for popup navigation. Return true to swallow.</li>
            <li><code>onExit</code>: user hit Esc, lost focus, or moved away. Close popup.</li>
          </ol>

          <h3>The "state lifted to React" pattern</h3>
          <p>Tabloom's clever decision: the Suggestion plugin only EMITS state updates (via the <code>onState</code> callback). The actual popup rendering is in React, OUTSIDE the editor. This means:</p>
          <ul>
            <li>The popup can use React state + portals + animations.</li>
            <li>Multiple editors could share one popup component.</li>
            <li>The Suggestion plugin stays small + pure.</li>
          </ul>

          <h3>The popup component (sketch)</h3>
          <CodePre>{`// In the parent of RichEditor
const [slashState, setSlashState] = useState<SlashState>({ open: false, query: '', rect: null, run: null })

return (
  <>
    <RichEditor onSlashState={setSlashState} ... />
    {slashState.open && slashState.rect && (
      <SlashPopup
        query={slashState.query}
        anchorRect={slashState.rect}
        onPick={(key) => slashState.run?.(key)}
      />
    )}
  </>
)`}</CodePre>

          <h3>The action mapping</h3>
          <CodePre>{`// SLASH_ITEMS defines what / can insert
const SLASH_ITEMS = [
  { key: 'heading2', label: 'Heading 2',  hint: 'Section header' },
  { key: 'heading3', label: 'Heading 3',  hint: 'Subsection' },
  { key: 'bullet',   label: 'Bullet list', hint: '• item' },
  { key: 'numbered', label: 'Numbered list', hint: '1. item' },
  { key: 'task',     label: 'To-do',       hint: 'Check item' },
  { key: 'quote',    label: 'Quote',       hint: 'Blockquote' },
  { key: 'code',     label: 'Code block',  hint: 'Monospace' },
  { key: 'callout',  label: 'Callout',     hint: 'Highlighted note' },
  { key: 'table',    label: 'Table',       hint: '3×3 with header' },
  { key: 'figure',   label: 'Image',       hint: 'Upload from disk' },
  // ...
]

function applyBlock(editor: Editor, range: Range, key: string) {
  const chain = editor.chain().focus().deleteRange(range)   // ← delete the "/query" text
  switch (key) {
    case 'heading2': chain.setHeading({ level: 2 }).run(); break
    case 'heading3': chain.setHeading({ level: 3 }).run(); break
    case 'bullet':   chain.toggleBulletList().run(); break
    case 'numbered': chain.toggleOrderedList().run(); break
    case 'task':     chain.toggleTaskList().run(); break
    case 'quote':    chain.toggleBlockquote().run(); break
    case 'code':     chain.toggleCodeBlock().run(); break
    case 'callout':  chain.insertContent({ type: 'callout', content: [{ type: 'text', text: '' }] }).run(); break
    case 'table':    chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); break
    case 'figure':   pickImage().then(file => uploadAndInsert(editor, file)); break
  }
}`}</CodePre>

          <h3>Customizing trigger char + behavior</h3>
          <p>Suggestion accepts:</p>
          <ul>
            <li><code>char: '/'</code> — what triggers it.</li>
            <li><code>startOfLine: false</code> — does it only fire after newline? Tabloom: no (anywhere).</li>
            <li><code>allowSpaces: false</code> — does the query allow spaces? Tabloom: no (any space exits).</li>
            <li><code>allowedPrefixes</code> — characters that can precede the trigger.</li>
            <li><code>pluginKey</code> — name for ProseMirror debug.</li>
          </ul>

          <p>You can ship multiple Suggestion plugins with different triggers (e.g. <code>@</code> for mentions, <code>#</code> for tags — different popups, different actions).</p>
        </section>

        <hr />

        {/* SECTION 6 — BUBBLE MENU */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>BubbleMenu Toolbar</h2>
          <p>A floating toolbar that appears above selected text. TipTap ships a React component that handles the positioning + the show/hide logic.</p>

          <h3>The wire-up</h3>
          <CodePre>{`// tabloom/src/routes/PageView/RichEditor.tsx — verbatim
{editor && !isMobile && (
  <BubbleMenu
    editor={editor}
    tippyOptions={{ duration: 120 }}
    shouldShow={({ editor: ed, from, to }) =>
      from !== to &&
      ed.isEditable &&
      !ed.isActive('figure') &&
      !ed.isActive('codeBlock')
    }
  >
    <BubbleToolbar editor={editor} placement="bubble" />
  </BubbleMenu>
)}`}</CodePre>

          <h3>The shouldShow predicate</h3>
          <p>Returns true → show the menu. Tabloom's rules:</p>
          <ul>
            <li><code>from !== to</code>: there's a selection (not just a cursor).</li>
            <li><code>ed.isEditable</code>: the editor isn't in read-only mode.</li>
            <li><code>!ed.isActive('figure')</code>: not inside a figure (Tabloom's image block).</li>
            <li><code>!ed.isActive('codeBlock')</code>: not inside a code block (formatting marks don't make sense there).</li>
          </ul>

          <h3>Underlying tech — Tippy.js</h3>
          <p>BubbleMenu uses Tippy.js for positioning. The <code>tippyOptions</code> prop passes options through:</p>
          <CodePre>{`tippyOptions={{
  duration: 120,                                      // fade animation ms
  placement: 'top',                                   // or 'bottom', 'top-start', etc.
  popperOptions: {                                    // raw Popper options
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  },
}}`}</CodePre>

          <h3>The toolbar buttons</h3>
          <CodePre>{`// tabloom/src/routes/PageView/tiptap/BubbleToolbar.tsx — verbatim (lines 56-82)
const marks = (
  <>
    {btn(editor.isActive('bold'),   () => editor.chain().focus().toggleBold().run(),   'Bold (Ctrl+B)',   <Icons.Bold size={14} />)}
    {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic (Ctrl+I)', <Icons.Italic size={14} />)}
    {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'Strikethrough',   <span style={{ textDecoration: 'line-through', fontWeight: 600 }}>S</span>)}
    {btn(editor.isActive('code'),   () => editor.chain().focus().toggleCode().run(),   'Inline code',     <Icons.Code size={14} />)}
    {btn(editor.isActive('tagInline'), () => editor.chain().focus().toggleMark('tagInline').run(), 'Inline tag chip', <Icons.Hash size={14} />)}
    <div className="bubble-sep" />
    {btn(editor.isActive('link'), handleLink, 'Link', <Icons.Link size={14} />)}
  </>
)`}</CodePre>

          <p>The shape of every button:</p>
          <ul>
            <li><code>editor.isActive('bold')</code> → boolean for "highlighted" state.</li>
            <li><code>editor.chain().focus().toggleBold().run()</code> → toggle on click.</li>
            <li>Tooltip text + icon for the UI.</li>
          </ul>

          <h3>The link button needs special handling</h3>
          <CodePre>{`function handleLink() {
  const previous = editor.getAttributes('link').href
  const url = window.prompt('URL', previous)
  if (url === null) return                    // cancelled
  if (url === '') {                            // empty = remove link
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}`}</CodePre>

          <p>The native <code>prompt</code> is the simplest path. Tabloom uses it for now; a custom modal with validation is the obvious upgrade.</p>

          <h3>FloatingMenu — alternative for "show when empty"</h3>
          <p>TipTap also ships <code>FloatingMenu</code>, which appears on EMPTY paragraphs (not selections). Useful for "click here to add a block" UI. Tabloom uses BubbleMenu only — block insertion goes through the slash menu.</p>
        </section>

        <hr />

        {/* SECTION 7 — CUSTOM NODE VIEWS */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Custom Node Views (React)</h2>
          <p>The crown jewel of TipTap+React: render React components INSIDE the editor as part of the document. Tabloom uses this for its Callout block (a highlighted note with an icon) and Figure block (an image with a caption).</p>

          <h3>Why a node view</h3>
          <p>Some blocks need interactivity that vanilla HTML can't deliver:</p>
          <ul>
            <li>A callout block with an icon-picker dropdown.</li>
            <li>An image block that loads its src from an authenticated API.</li>
            <li>A poll embed that lets the user vote inline.</li>
            <li>A code block with syntax highlighting via Prism/Shiki.</li>
          </ul>

          <p>Node views let your React component be the rendered node in the ProseMirror document. The DOM you render IS what the editor displays + edits.</p>

          <h3>Tabloom's Callout — full source</h3>
          <CodePre>{`// tabloom/src/routes/PageView/tiptap/Callout.tsx — verbatim (lines 9-50)
function CalloutView() {
  return (
    <NodeViewWrapper className="callout" as="div">
      <Icons.Sparkle className="ci" />
      <NodeViewContent className="callout-body" />
    </NodeViewWrapper>
  )
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      icon: {
        default: 'Sparkle',
        parseHTML: (el) => el.getAttribute('data-icon') ?? 'Sparkle',
        renderHTML: (attrs) => ({ 'data-icon': attrs.icon }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'callout', class: 'callout' }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },
})`}</CodePre>

          <h3>The two pieces</h3>
          <ol>
            <li><strong>Node.create({`{ ... }`})</strong>: defines the ProseMirror schema entry. Name, group, content rules, attrs, HTML parse/render rules.</li>
            <li><strong>ReactNodeViewRenderer(CalloutView)</strong>: tells TipTap "render this node by mounting THIS React component."</li>
          </ol>

          <h3>NodeViewWrapper + NodeViewContent</h3>
          <p>Inside the React component:</p>
          <ul>
            <li><strong><code>NodeViewWrapper</code></strong>: the outer element that ProseMirror knows about. You can pass <code>as</code> to change the tag, plus className + style.</li>
            <li><strong><code>NodeViewContent</code></strong>: the editable inner region. ProseMirror writes the node's content (the inline text) here.</li>
          </ul>

          <p>Anything else in your React component (icons, buttons, decorative elements) is purely visual — ProseMirror ignores it.</p>

          <h3>What "defining" means</h3>
          <CodePre>{`defining: true,`}</CodePre>

          <p>A "defining" node creates a rigid boundary. The user can't accidentally merge a callout into a regular paragraph by hitting backspace at its start; instead, the callout stays as a callout. Useful for blocks that shouldn't be casually disrupted.</p>

          <h3>Attributes — icon picker</h3>
          <CodePre>{`addAttributes() {
  return {
    icon: {
      default: 'Sparkle',
      parseHTML: (el) => el.getAttribute('data-icon') ?? 'Sparkle',
      renderHTML: (attrs) => ({ 'data-icon': attrs.icon }),
    },
  }
}`}</CodePre>

          <p>Each attribute gets:</p>
          <ul>
            <li><strong>default</strong>: value when the node is created without specifying.</li>
            <li><strong>parseHTML</strong>: extract from DOM when parsing pasted HTML.</li>
            <li><strong>renderHTML</strong>: serialize to DOM attribute on export.</li>
          </ul>

          <p>Inside the React node view, access via <code>props.node.attrs.icon</code>. Update via <code>props.updateAttributes({`{ icon: 'Star' }`})</code>.</p>

          <h3>The Figure node — image with caption</h3>
          <p>Tabloom's Figure handles three image sources: <code>mediaId</code> (auth-gated, fetched via API), <code>src</code> (external URL), or a gradient placeholder. The React node view renders the right one based on attrs. Source pattern:</p>
          <CodePre>{`function FigureView({ node, updateAttributes }) {
  const { mediaId, src, caption } = node.attrs

  return (
    <NodeViewWrapper className="figure" as="figure">
      {mediaId
        ? <AuthenticatedImage id={mediaId} />
        : src
          ? <img src={src} alt={caption ?? ''} />
          : <GradientPlaceholder />}
      <figcaption contentEditable suppressContentEditableWarning>
        {caption}
      </figcaption>
    </NodeViewWrapper>
  )
}`}</CodePre>

          <p>The <code>{`<figcaption>`}</code> is HAND-MANAGED contentEditable — outside ProseMirror's purview, but inside the React component. When the user types, save via <code>updateAttributes</code>.</p>

          <h3>Node view rules of thumb</h3>
          <ul>
            <li><strong>Use <code>NodeViewContent</code> for editable text inside.</strong> Don't try to manage selection yourself.</li>
            <li><strong>Use <code>updateAttributes</code> to mutate attrs.</strong> It dispatches a proper ProseMirror transaction.</li>
            <li><strong>Use refs sparingly.</strong> Node views re-mount on certain operations.</li>
            <li><strong>Style with className, not inline styles.</strong> ProseMirror sometimes overrides style during transforms.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 8 — IMAGE UPLOAD */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Image Upload + Drop/Paste</h2>
          <p>Tabloom doesn't use TipTap's <code>@tiptap/extension-image</code>. Instead, drop or paste triggers a custom upload flow that creates a media row server-side and inserts a Figure node referencing it.</p>

          <h3>The full upload handler</h3>
          <CodePre>{`// tabloom/src/routes/PageView/RichEditor.tsx — verbatim (lines 74-94)
const insertImageFiles = useCallback(
  (files: FileList | null | undefined): boolean => {
    const list = Array.from(files ?? [])
    const img = list.find(f => f.type.startsWith('image/'))
    if (!img) return false
    uploadRef.current(img, { notebookId: notebookRef.current })
      .then((media) => {
        editorRef.current
          ?.chain()
          .focus()
          .insertContent({
            type: 'figure',
            attrs: { mediaId: media.id, caption: media.caption },
          })
          .run()
      })
      .catch(() => undefined)
    return true
  },
  [],
)`}</CodePre>

          <h3>The wire-up</h3>
          <CodePre>{`editorProps: {
  handlePaste: (_view, event) =>
    editable ? insertImageFiles(event.clipboardData?.files) : false,
  handleDrop: (_view, event) =>
    editable ? insertImageFiles((event as DragEvent).dataTransfer?.files) : false,
}`}</CodePre>

          <p>Both events route to the same handler. Return <code>true</code> = "I handled it, don't let ProseMirror try"; return <code>false</code> = "fall through to default behavior."</p>

          <h3>The upload API</h3>
          <p><code>uploadRef.current</code> calls the upload function (passed in from the parent component). Behind the scenes:</p>
          <CodePre>{`// In the parent — the upload function
async function uploadMedia(file: File, opts: { notebookId?: number }) {
  const form = new FormData()
  form.append('file', file)
  if (opts.notebookId) form.append('notebookId', String(opts.notebookId))

  const res = await fetch('/api/media', {
    method: 'POST',
    body: form,                          // multipart, no Content-Type
    headers: { Authorization: \`Bearer \${token}\` },
  })

  if (!res.ok) throw new Error('upload failed')
  return res.json() as Promise<MediaRow>   // { id, caption, status, ocr, ... }
}`}</CodePre>

          <p>The server creates a media row (status="indexing", OCR pending in background), saves the file to <code>UPLOADS_PATH</code>, returns the row. The Figure node references it by <code>mediaId</code>.</p>

          <h3>Why mediaId, not embedded base64</h3>
          <p>Tabloom embeds <code>{`{ type: 'figure', attrs: { mediaId: 42, caption: '...' } }`}</code> — a reference to a server-side row. NOT base64 inline.</p>
          <ul>
            <li><strong>Document size stays small.</strong> A 50-image page is still small JSON.</li>
            <li><strong>Images are auth-gated.</strong> Loading <code>/api/media/42</code> requires a Bearer token; base64 in a document wouldn't.</li>
            <li><strong>OCR-able.</strong> The server can run OCR on the stored file (see Article 26).</li>
            <li><strong>Deduplication possible.</strong> Same image referenced from multiple pages = one storage row.</li>
            <li><strong>Easier export.</strong> Backups copy media files separately.</li>
          </ul>

          <h3>The Figure render</h3>
          <p>Inside the React node view, the <code>img</code> tag points at the API:</p>
          <CodePre>{`<img
  src={\`/api/media/\${mediaId}/file?\${queryAuth}\`}
  alt={caption ?? ''}
/>`}</CodePre>

          <p>The auth-on-img-tag problem (browsers can't send custom headers on <code>img</code> requests) is solved by passing a query-string auth token. Same pattern ShopKeep uses (see the MSAL React guide §9).</p>

          <h3>What about TipTap's Image extension</h3>
          <p>Imported in Tabloom's <code>package.json</code> but NOT in the active extensions list — leftover from an earlier prototype. If you used it, the shape would be:</p>
          <CodePre>{`Image.configure({
  inline: false,
  allowBase64: true,                      // tolerate base64 srcs from paste
  HTMLAttributes: { class: 'tt-image' },
})`}</CodePre>

          <p>The Image extension is fine for prototype use. For production where you need auth + OCR + deduplication, roll a custom Figure node.</p>
        </section>

        <hr />

        {/* SECTION 9 — LAZY + SAVE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Lazy Loading + Save Flow</h2>
          <p>TipTap is ~350KB gzipped — significant for the main bundle. Tabloom lazy-loads it behind <code>React.lazy</code> so users who never open a page don't download it.</p>

          <h3>The lazy import</h3>
          <CodePre>{`// tabloom/src/routes/PageView/NoteEditor.tsx — verbatim (lines 10-12)
const RichEditor = lazy(() =>
  import('./RichEditor').then((m) => ({ default: m.RichEditor })),
)`}</CodePre>

          <p>The <code>.then(m =&gt; ({`{ default: m.RichEditor }`}))</code> is needed because <code>RichEditor.tsx</code> exports <code>RichEditor</code> as a NAMED export, but <code>React.lazy</code> only accepts default exports. The transform wraps it.</p>

          <h3>The Suspense boundary</h3>
          <CodePre>{`// In NoteEditor.tsx (sketch)
return (
  <Suspense fallback={<EditorSkeleton />}>
    <RichEditor pageId={page.id} initialContent={page.notes} ... />
  </Suspense>
)`}</CodePre>

          <p>Until TipTap's chunk loads, users see the skeleton. On first visit to any page, ~300ms additional load (Vite-Rolldown bundle, network-bound). Subsequent pages: cached, instant.</p>

          <h3>The Vite chunk split</h3>
          <p>Tabloom's <code>vite.config.ts</code> explicitly carves TipTap into its own chunk:</p>
          <CodePre>{`// tabloom/vite.config.ts (relevant)
manualChunks(id) {
  if (!id.includes('node_modules')) return undefined
  if (id.includes('/@tiptap/') || id.includes('/prosemirror-')) return 'vendor-tiptap'
  // ... other vendor chunks ...
}`}</CodePre>

          <p>Every <code>@tiptap/*</code> + every <code>prosemirror-*</code> ends up in <code>vendor-tiptap.js</code>. The cache benefit: editing app code doesn't invalidate the TipTap chunk; users keep the cached copy across deploys.</p>

          <h3>The save flow, end-to-end</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User typing
  participant T as TipTap onUpdate
  participant D as debounce 500ms
  participant API as /api/pages/:id
  participant DB as SQLite
  U->>T: keystroke
  T->>T: setSaveState('saving')
  T->>D: cancel + reschedule
  Note over U: user keeps typing
  U->>T: more keystrokes
  T->>D: cancel + reschedule
  Note over U: user pauses
  D->>API: PUT { notes, snippet }
  API->>DB: UPDATE pages SET body_json
  API->>DB: INSERT page_versions if changed
  API-->>T: 200 OK
  T->>T: setSaveState('saved')`} />

          <h3>The frontend save handler</h3>
          <CodePre>{`// tabloom/src/routes/PageView/RichEditor.tsx — verbatim (lines 134-149)
onUpdate: ({ editor: ed }) => {
  if (!editable) return
  if (saveTimer.current) window.clearTimeout(saveTimer.current)
  setSaveState('saving')
  const id = pageIdRef.current
  saveTimer.current = window.setTimeout(async () => {
    try {
      const doc = ed.getJSON() as ProseMirrorDoc
      const text = ed.getText().replace(/\\s+/g, ' ').trim()
      await updatePage(id, { notes: doc, snippet: text.slice(0, 160) })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }, 500)
},`}</CodePre>

          <p>Two artifacts sent per save:</p>
          <ul>
            <li><code>notes</code>: the full ProseMirror JSON document.</li>
            <li><code>snippet</code>: the first 160 characters of plain text — for search results, page-list previews.</li>
          </ul>

          <h3>The server endpoint</h3>
          <CodePre>{`// tabloom/server.js — verbatim relevant block (lines 1491-1558, abridged)
app.put('/api/pages/:id', requireEditorOnPage, (req, res) => {
  const id = Number(req.params.id)
  const existing = stmts.getPage.get(id)
  if (!existing) return res.status(404).json({ error: 'not found' })

  const { notes, body_json, title, snippet, ... } = req.body ?? {}

  const body =
    notes !== undefined
      ? JSON.stringify(notes)
      : typeof body_json === 'string'
        ? body_json
        : null

  const tx = db.transaction(() => {
    stmts.updatePage.run({ id, body_json: body, ... })
    if (contentChanged && shouldVersion(id)) {
      stmts.insertPageVersion.run({
        page_id: id,
        title: nextTitle,
        body_json: nextBody,
        edited_by_oid: req.user?.oid ?? null,
      })
    }
  })
  tx()

  if (contentChanged) embedWorker.enqueue(id)   // ← for semantic search
  res.json(shapePageFull(stmts.getPage.get(id)))
})`}</CodePre>

          <p>What the server does:</p>
          <ol>
            <li>Check editor permission on the page.</li>
            <li>Stringify the ProseMirror JSON to a TEXT column.</li>
            <li>UPDATE the page row.</li>
            <li>If content actually changed AND the version-throttle allows, INSERT a <code>page_versions</code> row.</li>
            <li>Enqueue the embedding worker (for vector search) if content changed.</li>
            <li>Return the updated row.</li>
          </ol>

          <h3>The shouldVersion throttle</h3>
          <p>Without throttling, every keystroke would create a new version. Tabloom rate-limits versioning (e.g. "only version once per 5 minutes per page") so the <code>page_versions</code> table doesn't explode. The exact threshold is in source; the pattern is: check the most recent version's timestamp, skip if it's recent.</p>
        </section>

        <hr />

        {/* SECTION 10 — SANITIZATION */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Schema Sanitization (the secret)</h2>
          <p>Many rich-text apps run user HTML through <code>sanitize-html</code> server-side to strip XSS. Tabloom doesn't — and doesn't need to. Why: ProseMirror's schema IS the sanitizer.</p>

          <h3>The mechanism</h3>
          <p>When TipTap (or any ProseMirror consumer) parses HTML — from paste, from initial content, from anywhere — only nodes + marks declared in the schema are accepted. Everything else is dropped.</p>

          <ul>
            <li><code>{`<script>`}</code>? Not in the schema. Dropped.</li>
            <li><code>{`<img onerror="alert(1)">`}</code>? The Image extension (or Figure node) only honors <code>src</code> + <code>alt</code> attrs from its declared parseHTML. <code>onerror</code> is ignored.</li>
            <li><code>{`<a href="javascript:...">`}</code>? The Link extension's parseHTML can be configured to validate URLs. Tabloom's Link uses defaults — javascript: URLs are rejected by TipTap's URL validator.</li>
            <li><code>{`<iframe>`}</code>? Not in the schema. Dropped.</li>
            <li>Style attributes? Most schema nodes don't extract <code>style</code>; it's lost.</li>
          </ul>

          <h3>Why this is sufficient</h3>
          <p>Tabloom NEVER stores raw HTML strings. It stores ProseMirror JSON. The JSON is:</p>
          <ol>
            <li>A typed tree where every node's type is in your schema.</li>
            <li>Re-serialized to HTML for display only when needed (currently: never — the editor renders directly from JSON).</li>
            <li>Free from arbitrary HTML attributes that aren't declared in the schema.</li>
          </ol>

          <p>The attack surface is the parser, not the storage. If your parser only emits schema-valid output, you're safe.</p>

          <h3>What this means in practice</h3>
          <CodePre>{`// User pastes:
<p>Hello <script>steal(document.cookie)</script> World</p>

// ProseMirror parses against the schema:
// - <p> → paragraph node ✓
// - "Hello " → text node ✓
// - <script> → NOT IN SCHEMA → dropped
// - "steal(document.cookie)" → text node ✓ (text content of script, lifted)
// - " World" → text node ✓

// Resulting ProseMirror JSON:
{
  "type": "paragraph",
  "content": [
    { "type": "text", "text": "Hello steal(document.cookie) World" }
  ]
}

// Rendered HTML:
<p>Hello steal(document.cookie) World</p>

// Safe — just a paragraph with plain text.`}</CodePre>

          <h3>When you'd still need sanitize-html</h3>
          <p>If you ever stored a raw HTML string and re-rendered it (without going through ProseMirror), you'd need to sanitize. Tabloom doesn't, so it doesn't.</p>

          <p>Two scenarios where it'd matter:</p>
          <ul>
            <li><strong>Email rendering</strong>: you store user-authored HTML to display in an email template. Sanitize before sending.</li>
            <li><strong>RSS / external HTML</strong>: PulseWire pulls in HTML from feeds. It DOES need sanitization (sanitize-html, via PostgreSQL's stored content path).</li>
            <li><strong>Public sharing</strong>: if Tabloom ever exports a page as a public HTML file, that file must be sanitized before serving (because the recipient doesn't go through ProseMirror).</li>
          </ul>

          <h3>The link validator</h3>
          <p>TipTap's Link extension has a URL validator. Configure if you have strict requirements:</p>
          <CodePre>{`Link.configure({
  openOnClick: false,
  autolink: true,
  linkOnPaste: true,
  validate: (href) => {
    try {
      const url = new URL(href)
      return ['http:', 'https:', 'mailto:'].includes(url.protocol)
    } catch {
      return false
    }
  },
})`}</CodePre>

          <p>Default validator already blocks <code>javascript:</code> URLs. The customization is for "only allow http/https + mailto, not file:// or chrome://."</p>

          <h3>The contentEditable safety net</h3>
          <p>Even if a malicious user somehow got dangerous HTML past the schema parser, browsers themselves enforce contentEditable safety — no inline scripts, no event-handler attributes. ProseMirror + the browser is a double layer.</p>

          <p>This isn't a "we don't think about XSS" pass — it's "the architecture forecloses on the attack surface." Different model from sanitize-html, same outcome.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Mini Notebook Editor</h2>
          <p>Stand up a Vite + React + TipTap notebook with StarterKit, slash menu, BubbleMenu, and a custom Callout node view. ~45 minutes.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`npm create vite@latest tiptap-lab -- --template react-ts
cd tiptap-lab
npm i
npm i @tiptap/react @tiptap/starter-kit @tiptap/suggestion @tiptap/extension-bubble-menu`}</CodePre>

          <h3>Step 2 — Basic editor</h3>
          <CodePre>{`// src/App.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<h2>Hello</h2><p>Type something!</p>',
  })

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <h1>TipTap Lab</h1>
      <EditorContent editor={editor} />
    </div>
  )
}`}</CodePre>

          <h3>Step 3 — CSS styling</h3>
          <CodePre>{`/* src/index.css — append */
.tiptap {
  outline: none;
  font-family: system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  min-height: 200px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.tiptap h2 { font-size: 1.6rem; margin: 16px 0 8px; }
.tiptap h3 { font-size: 1.3rem; margin: 14px 0 6px; }
.tiptap p  { margin: 8px 0; }
.tiptap ul, .tiptap ol { padding-left: 28px; margin: 8px 0; }
.tiptap blockquote { border-left: 3px solid #94a3b8; padding-left: 12px; color: #64748b; }
.tiptap pre { background: #f1f5f9; padding: 12px; border-radius: 4px; font-family: monospace; }
.tiptap code { background: #f1f5f9; padding: 2px 6px; border-radius: 3px; font-family: monospace; }`}</CodePre>

          <p>Run <code>npm run dev</code>. You should see a working editor.</p>

          <h3>Step 4 — A BubbleMenu toolbar</h3>
          <CodePre>{`// src/App.tsx
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<h2>Hello</h2><p>Select some text to see the bubble menu.</p>',
  })

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 24 }}>
      <h1>TipTap Lab</h1>
      {editor && (
        <BubbleMenu editor={editor}>
          <div style={{ background: '#1e293b', color: 'white', borderRadius: 6, padding: 4, display: 'flex', gap: 4 }}>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              style={{ ...btnStyle, fontWeight: editor.isActive('bold') ? 700 : 400 }}
            >B</button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              style={{ ...btnStyle, fontStyle: editor.isActive('italic') ? 'italic' : 'normal' }}
            >I</button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              style={btnStyle}
            >S</button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              style={{ ...btnStyle, fontFamily: 'monospace' }}
            >&lt;/&gt;</button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  color: 'white',
  border: 'none',
  padding: '4px 10px',
  cursor: 'pointer',
  borderRadius: 2,
}`}</CodePre>

          <p>Select text in the editor — a black toolbar appears above your selection with B/I/S/Code buttons.</p>

          <h3>Step 5 — A custom Callout node view</h3>
          <CodePre>{`// src/Callout.tsx
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'

function CalloutView() {
  return (
    <NodeViewWrapper
      as="div"
      style={{
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: 6,
        padding: 12,
        margin: '12px 0',
      }}
    >
      <strong style={{ marginRight: 8 }}>💡</strong>
      <NodeViewContent style={{ display: 'inline' }} />
    </NodeViewWrapper>
  )
}

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView)
  },
})`}</CodePre>

          <p>Register it in the editor:</p>
          <CodePre>{`import { Callout } from './Callout'

const editor = useEditor({
  extensions: [StarterKit, Callout],
  content: \`
    <h2>Hello</h2>
    <p>This is regular text.</p>
    <div data-type="callout">This is a callout</div>
    <p>More text.</p>
  \`,
})`}</CodePre>

          <p>Reload. The page now has a yellow callout block. Notice it's still editable — you can type inside.</p>

          <h3>Step 6 — A button to insert callouts</h3>
          <CodePre>{`<button
  onClick={() => editor.chain().focus().insertContent({
    type: 'callout',
    content: [{ type: 'text', text: 'New callout — type here' }],
  }).run()}
  style={{ padding: '6px 12px', marginBottom: 12, cursor: 'pointer' }}
>
  Insert callout
</button>`}</CodePre>

          <h3>Step 7 — Watch the document state</h3>
          <CodePre>{`// Add below the editor
{editor && (
  <details style={{ marginTop: 16 }}>
    <summary>Document JSON</summary>
    <pre style={{ background: '#f1f5f9', padding: 12, fontSize: 12, overflow: 'auto' }}>
      {JSON.stringify(editor.getJSON(), null, 2)}
    </pre>
  </details>
)}`}</CodePre>

          <p>Open the disclosure. As you type, the JSON updates live. You see the tree structure ProseMirror maintains.</p>

          <h3>Step 8 — Try XSS</h3>
          <p>Paste this into the editor:</p>
          <CodePre>{`<p>Hello <script>alert(1)</script> world</p>
<img src=x onerror="alert(2)">
<a href="javascript:alert(3)">Click</a>`}</CodePre>

          <p>What you'll see in the editor: <em>"Hello world"</em> + maybe a broken image icon + a link that does nothing on click. The schema dropped everything dangerous. Inspect the JSON — no scripts, no event handlers, no javascript: URLs.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've stood up the core TipTap pattern from scratch — editor, BubbleMenu, custom node view, and demonstrated
              schema-as-sanitizer. Adding a slash menu (via Suggestion plugin), table support, and a real upload flow is
              additive from here.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"editor is null on first render"</h3>
          <p>useEditor() returns null briefly. Check before rendering anything that uses it: <code>{`{editor && <BubbleMenu editor={editor}>...</BubbleMenu>}`}</code>.</p>

          <h3>Content disappears on save reload</h3>
          <p>You're treating the editor as controlled (React state mirrors content + you setContent on every render). Don't. TipTap is uncontrolled — set initial content once via the <code>content</code> option.</p>

          <h3>Custom node view re-mounts on every keystroke</h3>
          <p>Your <code>CalloutView</code> component creates new objects/functions inline. React sees them as different. Wrap with <code>memo()</code> or move stable parts outside.</p>

          <h3>"Cannot read properties of null (reading 'state')"</h3>
          <p>You used <code>editor.X</code> after the editor was destroyed (component unmounted, async callback fires). Always guard: <code>if (!editor) return</code>.</p>

          <h3>Extensions array changing causes editor to reset</h3>
          <p>The <code>extensions</code> prop's identity matters. Tabloom uses <code>useMemo(() =&gt; [...], [])</code> with an empty dep array — extensions never change. If you need conditional extensions, the editor will rebuild when they change.</p>

          <h3>BubbleMenu appears in the wrong place</h3>
          <p>The container needs <code>position: relative</code> (or none — Tippy positions absolutely from the body by default). Don't put the editor inside a CSS <code>contain</code> region; popper.js positioning can break.</p>

          <h3>Paste from Google Docs loses formatting</h3>
          <p>Google Docs' HTML is wildly bespoke. Some marks survive the schema parse, some don't. Customize <code>parseHTML</code> on the marks you care about to recognize Google's class names.</p>

          <h3>Selection lost after toolbar click</h3>
          <p>Forgot <code>.focus()</code> in the chain: <code>editor.chain().focus().toggleBold().run()</code>. Without it, the chain runs but the editor isn't focused, so the selection collapses.</p>

          <h3>"Cannot insert image — schema doesn't allow"</h3>
          <p>You're trying to insert a content type ProseMirror's schema doesn't have. Either: (a) the Image extension isn't registered, (b) the cursor is inside a block that doesn't allow images (e.g. inside a heading), (c) the figure type is at the wrong nesting level.</p>

          <h3>Document gets bigger on every save</h3>
          <p>You're inserting a new copy of the content instead of replacing. Use <code>setContent(json, false)</code> (the second arg is whether to emit an update — set to false to prevent recursive saves).</p>

          <h3>"Inline content not allowed" errors</h3>
          <p>Trying to put text directly in a block group. The schema says a block contains other blocks; inline goes inside <code>paragraph</code> (or similar). Wrap your text node in a paragraph node when inserting.</p>

          <h3>The bundle is huge</h3>
          <p>You're not lazy-loading. Wrap your editor component in <code>React.lazy(() =&gt; import('./Editor'))</code> + a Suspense fallback. Bundle should drop to ~50KB upfront, with TipTap deferred.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Install</h3>
          <CodePre>{`npm i @tiptap/react @tiptap/starter-kit @tiptap/suggestion @tiptap/extension-bubble-menu
# Optional per-need:
npm i @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header
npm i @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-task-list @tiptap/extension-task-item
npm i tiptap-extension-global-drag-handle`}</CodePre>

          <h3>useEditor skeleton</h3>
          <CodePre>{`const editor = useEditor({
  extensions: useMemo(() => [StarterKit, Link, Placeholder.configure({ placeholder: '...' })], []),
  content: initialJsonOrHtml,
  editable: true,
  editorProps: {
    attributes: { class: 'tiptap' },
    handlePaste: (view, event) => { ... return true if handled },
    handleDrop:  (view, event) => { ... return true if handled },
  },
  onUpdate: ({ editor }) => {
    debouncedSave(editor.getJSON())
  },
})`}</CodePre>

          <h3>Commands</h3>
          <CodePre>{`editor.chain().focus().toggleBold().run()
editor.chain().focus().toggleItalic().run()
editor.chain().focus().setHeading({ level: 2 }).run()
editor.chain().focus().toggleBulletList().run()
editor.chain().focus().toggleOrderedList().run()
editor.chain().focus().toggleTaskList().run()
editor.chain().focus().toggleBlockquote().run()
editor.chain().focus().toggleCodeBlock().run()
editor.chain().focus().setLink({ href: url }).run()
editor.chain().focus().unsetLink().run()
editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
editor.chain().focus().insertContent({ type: 'callout', content: [...] }).run()
editor.chain().focus().undo().run()
editor.chain().focus().redo().run()`}</CodePre>

          <h3>Inspecting state</h3>
          <CodePre>{`editor.isActive('bold')                       // marks: 'bold', 'italic', 'code', etc.
editor.isActive('heading', { level: 2 })       // attr-aware
editor.can().undo()                            // boolean — would it do anything?
editor.getJSON()                               // ProseMirror JSON
editor.getHTML()                               // serialized HTML
editor.getText()                               // plain text
editor.state.doc                               // raw ProseMirror node tree`}</CodePre>

          <h3>Custom node view shape</h3>
          <CodePre>{`function MyView({ node, updateAttributes }) {
  return (
    <NodeViewWrapper className="my-block" as="div">
      <ToolbarOrIcon />
      <NodeViewContent />     {/* editable inner */}
    </NodeViewWrapper>
  )
}

export const MyBlock = Node.create({
  name: 'myBlock',
  group: 'block',
  content: 'inline*',
  defining: true,
  addAttributes: () => ({ ... }),
  parseHTML:  () => [{ tag: 'div[data-type="my-block"]' }],
  renderHTML: ({ HTMLAttributes }) => ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'my-block' }), 0],
  addNodeView: () => ReactNodeViewRenderer(MyView),
})`}</CodePre>

          <h3>BubbleMenu skeleton</h3>
          <CodePre>{`<BubbleMenu
  editor={editor}
  shouldShow={({ editor, from, to }) => from !== to && editor.isEditable}
  tippyOptions={{ duration: 120 }}
>
  <YourToolbar editor={editor} />
</BubbleMenu>`}</CodePre>

          <h3>Lazy load</h3>
          <CodePre>{`const RichEditor = lazy(() => import('./RichEditor').then(m => ({ default: m.RichEditor })))

<Suspense fallback={<EditorSkeleton />}>
  <RichEditor ... />
</Suspense>`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>useEditor + extensions list</td><td>tabloom · <code>src/routes/PageView/RichEditor.tsx</code></td></tr>
              <tr><td>SlashCommand extension (Suggestion)</td><td>tabloom · <code>src/routes/PageView/tiptap/SlashCommand.ts</code></td></tr>
              <tr><td>BubbleMenu + toolbar</td><td>tabloom · <code>src/routes/PageView/tiptap/BubbleToolbar.tsx</code></td></tr>
              <tr><td>Custom Callout node view</td><td>tabloom · <code>src/routes/PageView/tiptap/Callout.tsx</code></td></tr>
              <tr><td>Custom Figure (image) node view</td><td>tabloom · <code>src/routes/PageView/tiptap/Figure.tsx</code></td></tr>
              <tr><td>Drop/paste handlers</td><td>tabloom · <code>src/routes/PageView/RichEditor.tsx</code> (insertImageFiles)</td></tr>
              <tr><td>500ms save debounce</td><td>tabloom · <code>src/routes/PageView/RichEditor.tsx</code> (onUpdate)</td></tr>
              <tr><td>Lazy load + Suspense</td><td>tabloom · <code>src/routes/PageView/NoteEditor.tsx</code></td></tr>
              <tr><td>Server save endpoint + versioning</td><td>tabloom · <code>server.js</code> PUT /api/pages/:id</td></tr>
              <tr><td>Vite chunk split for TipTap</td><td>tabloom · <code>vite.config.ts</code> (manualChunks)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: OCR with Azure Computer Vision.</p>
        </section>
      </main>
    </div>
  );
}
