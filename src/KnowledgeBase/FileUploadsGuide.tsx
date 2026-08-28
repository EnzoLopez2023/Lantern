import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Two Patterns: Multer vs Base64',     icon: '⚖️' },
  { id: 's3',  num: '3',  title: 'Multer Config Deep Dive',            icon: '🛠️' },
  { id: 's4',  num: '4',  title: 'MIME Sniffing + Magic Bytes',        icon: '🔍' },
  { id: 's5',  num: '5',  title: 'Auth Gate + Delete-on-Reject',       icon: '🚪' },
  { id: 's6',  num: '6',  title: '/data Persistent Storage',           icon: '💾' },
  { id: 's7',  num: '7',  title: 'Serving via <img> + Query Auth',     icon: '🖼️' },
  { id: 's8',  num: '8',  title: 'Streaming Downloads + Caching',      icon: '📥' },
  { id: 's9',  num: '9',  title: 'Background Follow-ons (OCR, etc.)',  icon: '⚙️' },
  { id: 's10', num: '10', title: 'Filename Sanitization + UUIDs',      icon: '🔤' },
  { id: 's11', num: '★',  title: 'Lab: Build an Upload Endpoint',      icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                    icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                        icon: '📋' },
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

export default function FileUploadsGuide() {
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
            <span className="sidebar-title">File Uploads</span>
          </div>
          <div className="sidebar-sub">Tabloom + ShopKeep media patterns</div>
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
          <div className="hero-tag">📤 multer · /data persistent storage · 2026</div>
          <h1>File Uploads<br />and Media Handling</h1>
          <p>
            Two fleet apps ship file uploads with very different approaches.
            <strong style={{ color: '#C77AA0' }}> Tabloom</strong> uses multer + disk storage at
            <code>/data/uploads</code> with a 25MB cap, MIME prefix filter, and OCR fan-out.
            <strong style={{ color: '#C77AA0' }}> ShopKeep</strong> takes a different route entirely: the client
            base64-encodes images and POSTs them as JSON, the server decodes and stores the raw bytes as a SQLite
            BLOB. Both work. Both have tradeoffs. This guide pulls them apart — multer configuration, the auth-gate
            pattern, magic-byte sniffing, query-string auth for <code>{`<img>`}</code> tags, and the persistent-storage
            mount on Azure App Service.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Patterns</span></div>
            <div className="hero-stat"><span className="hero-stat-val">25MB</span><span className="hero-stat-label">Tabloom cap</span></div>
            <div className="hero-stat"><span className="hero-stat-val">/data</span><span className="hero-stat-label">Mount path</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3.6KB</span><span className="hero-stat-label">Base64 overhead</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            A file upload is a multi-step transaction with multiple opportunities to get it wrong: the client packages
            the bytes, the server receives them, the server validates (size, type, auth), the bytes land somewhere
            (disk, DB, blob storage), and a database record links the file to its metadata. Each step can fail
            independently. The hardest part isn't the upload itself — it's making the failure modes recover safely.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The dropbox at the front desk.</strong> You hand a package to the receptionist. Before they accept
            it, they check: is it too heavy? Is it the right kind of package for this building? Who's it for? If yes
            to all three, they file it and hand you a claim ticket. If no to any, they hand it back. Multer + auth
            gate + DB INSERT is exactly this sequence.
          </p>
          <p>
            <strong>Two ways to ship glass.</strong> Multer + disk = "give the package to the courier, the courier
            puts it in the right shelf." Base64 + BLOB = "the package is wrapped INSIDE the form you're filling out,
            mailed together, stored together." Both work. Different tradeoffs in transit (size, parseability) and
            storage (filesystem permissions vs database transactions).
          </p>
          <p>
            <strong>The bouncer comes AFTER the multer.</strong> Express middleware runs in order. <code>multer</code>
            comes first because it parses the multipart body, populating <code>req.body</code> and <code>req.file</code>.
            Auth comes second because auth checks usually need the body to know what was being uploaded TO. If auth
            rejects, the bouncer has to clean up: <code>unlinkSync(req.file.path)</code>. Otherwise you accumulate
            orphan files.
          </p>

          <h3>What the fleet uploads</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>What</th><th>Pattern</th><th>Storage</th></tr>
              <tr><td>Tabloom</td><td>Notebook media (images, diagrams)</td><td>multer + disk</td><td><code>/data/uploads/</code></td></tr>
              <tr><td>ShopKeep</td><td>Tool photos</td><td>Base64 JSON → BLOB</td><td>SQLite BLOB column</td></tr>
              <tr><td>SecretApp (Hearth)</td><td>None today (Plex media lives on the Plex server itself)</td><td>—</td><td>—</td></tr>
              <tr><td>Cairn / GLP1 / PulseWire / Puzzlebox / Workshop</td><td>None</td><td>—</td><td>—</td></tr>
            </tbody>
          </table>

          <h3>The end-to-end flow</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant C as Client (React)
  participant M as Multer
  participant A as Auth gate
  participant DB as SQLite
  participant FS as Filesystem (/data)
  participant W as Worker (OCR / thumbs)

  C->>M: POST /api/media (multipart)
  M->>FS: Write file (uuid-name)
  M->>A: req.file + req.body
  A->>DB: Check user has access to notebook?
  A-->>FS: unlink if rejected
  A-->>C: 403 if rejected
  A->>DB: INSERT media row
  A-->>C: 201 + media shape
  Note over W: Async
  M->>W: Enqueue OCR
  W->>FS: Read file
  W->>DB: UPDATE media SET ocr = ?`} />

          <h3>Five places things go wrong</h3>
          <ol>
            <li><strong>File too large</strong>. Network costs, memory pressure, disk fill.</li>
            <li><strong>Wrong type</strong>. PHP/exe disguised as PNG. MIME header lies; magic bytes don't.</li>
            <li><strong>Auth bypass</strong>. Uploaded BEFORE auth check, written to disk, attacker reuses filename.</li>
            <li><strong>Orphaned files</strong>. DB INSERT fails after file write. File on disk, no DB record.</li>
            <li><strong>Path traversal</strong>. <code>../../etc/passwd</code> in filename = overwriting system files.</li>
          </ol>

          <p>The patterns in this guide solve each one. Read closely.</p>
        </section>

        <hr />

        {/* SECTION 2 — TWO PATTERNS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Two Patterns: Multer vs Base64</h2>
          <p>Side-by-side. Same end goal, opposite mechanics.</p>

          <h3>Tabloom's multer pattern</h3>
          <ul>
            <li><strong>Client</strong>: HTML <code>{`<form encType="multipart/form-data">`}</code> or JS <code>FormData</code> + fetch.</li>
            <li><strong>Wire</strong>: Multipart MIME. Boundaries separate fields and files.</li>
            <li><strong>Server</strong>: multer parses the body, writes the file to disk, fills <code>req.file</code> + <code>req.body</code>.</li>
            <li><strong>Storage</strong>: file on disk at <code>/data/uploads/&lt;uuid&gt;-&lt;safe-name&gt;</code>.</li>
            <li><strong>DB</strong>: row with <code>file_path</code>, <code>mime_type</code>, etc. — pointer to disk.</li>
            <li><strong>Download</strong>: streaming <code>createReadStream(path).pipe(res)</code>.</li>
          </ul>

          <h3>ShopKeep's base64-BLOB pattern</h3>
          <ul>
            <li><strong>Client</strong>: <code>FileReader.readAsDataURL</code>, strip the prefix, POST as JSON.</li>
            <li><strong>Wire</strong>: <code>application/json</code> with <code>imageData</code> field (base64).</li>
            <li><strong>Server</strong>: <code>Buffer.from(imageData, 'base64')</code> → store as BLOB.</li>
            <li><strong>Storage</strong>: BLOB column in SQLite.</li>
            <li><strong>DB</strong>: same row holds the bytes + metadata.</li>
            <li><strong>Download</strong>: <code>res.send(blob)</code>.</li>
          </ul>

          <h3>Side-by-side tradeoffs</h3>
          <table>
            <tbody>
              <tr><th></th><th>Multer + disk</th><th>Base64 + BLOB</th></tr>
              <tr><td>Wire format</td><td>multipart/form-data</td><td>application/json</td></tr>
              <tr><td>Wire size overhead</td><td>~0%</td><td>+33% (base64)</td></tr>
              <tr><td>Server memory pressure</td><td>Streamed (low)</td><td>Whole file in memory</td></tr>
              <tr><td>express.json limit</td><td>Bypassed (multer parses)</td><td>Must be high enough (50MB)</td></tr>
              <tr><td>DB transactions</td><td>Two-phase (file + row)</td><td>Atomic — one INSERT</td></tr>
              <tr><td>Backup story</td><td>Filesystem + DB separately</td><td>One DB dump</td></tr>
              <tr><td>Easy delete</td><td>Need to unlink + DELETE</td><td>DELETE row is enough</td></tr>
              <tr><td>SQLite page size</td><td>n/a</td><td>Default 4KB; BLOBs &gt; few MB cause page bloat</td></tr>
              <tr><td>HTTP cache friendliness</td><td>Standard files + headers</td><td>Standard, but BLOBs hit DB</td></tr>
              <tr><td>Streaming download</td><td>Native streams</td><td>Whole BLOB to RAM first</td></tr>
            </tbody>
          </table>

          <h3>When to pick which</h3>
          <p>Multer + disk is right when:</p>
          <ul>
            <li>Files routinely &gt; 1 MB.</li>
            <li>You want CDN / nginx to serve files directly without hitting Node.</li>
            <li>You need OCR / image processing / thumbnails (filesystem makes worker access easy).</li>
            <li>Persistent storage mount is available (Azure App Service's <code>/home/data</code>, EBS volume, etc.).</li>
          </ul>

          <p>Base64 + BLOB is right when:</p>
          <ul>
            <li>Files are small (under ~500KB typical).</li>
            <li>You want atomic insert/delete with row data.</li>
            <li>One-DB-dump backup is the operational story.</li>
            <li>You don't have persistent storage and don't want to set it up.</li>
          </ul>

          <h3>The hybrid (which neither fleet app does)</h3>
          <p>For very large files (videos, archives), the gold standard is <strong>signed URLs</strong>: client POSTs metadata, server returns a pre-signed URL to Azure Blob Storage or S3, client uploads directly to the bucket. The Node server never holds the file. Beyond the scope of the fleet apps but worth noting.</p>
        </section>

        <hr />

        {/* SECTION 3 — MULTER */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Multer Config Deep Dive</h2>
          <p>Tabloom's multer config is dense — every line matters. Read it verbatim:</p>

          <CodePre>{`// tabloom/server.js (lines 2119-2132, verbatim)
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_PATH,
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-z0-9.\\-_]/gi, "_").slice(-60);
      cb(null, \`\${randomUUID()}-\${safe}\`);
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("only images allowed"));
    cb(null, true);
  },
});`}</CodePre>

          <h3>The three building blocks</h3>

          <h4>storage</h4>
          <p>
            <code>diskStorage</code> (write to filesystem) vs <code>memoryStorage</code> (keep in RAM). Tabloom chose
            disk. Memory would balloon RAM under load; disk amortizes the write and lets workers process files
            later without re-uploading. <strong>Always</strong> use disk for production unless files are tiny AND
            you process them synchronously inside the request handler.
          </p>

          <h4>destination</h4>
          <p>
            Where files land. Tabloom uses <code>UPLOADS_PATH</code> (env var, defaults to
            <code>./uploads/</code> in dev, set to <code>/data/uploads</code> in the Docker container). The
            destination is a directory; multer creates the file with the <code>filename</code> function.
          </p>

          <h4>filename</h4>
          <p>This is the function that names the on-disk file. Tabloom's logic:</p>
          <CodePre>{`const safe = file.originalname.replace(/[^a-z0-9.\\-_]/gi, "_").slice(-60)
cb(null, \`\${randomUUID()}-\${safe}\`)`}</CodePre>

          <ol>
            <li><strong>Sanitize</strong>: replace any character that isn't alphanumeric, dot, dash, or underscore with <code>_</code>. Kills path traversal (<code>../../</code> becomes <code>____</code>).</li>
            <li><strong>Slice last 60</strong>: a 500-character filename is bad for filesystems. Keep the tail (usually has the extension).</li>
            <li><strong>Prepend UUID</strong>: every file gets a unique prefix. Two uploads of "vacation.jpg" don't collide.</li>
            <li><strong>Result</strong>: <code>a3f2c8e1-91b3-4f1c-9d2e-vacation_2024.jpg</code>.</li>
          </ol>

          <h3>limits</h3>
          <CodePre>{`limits: { fileSize: 25 * 1024 * 1024 }   // 25 MB`}</CodePre>

          <p>Hard cap. Multer ABORTS the upload mid-stream when this is exceeded — you don't accidentally write a 500MB file before realizing it's too big. The error gets passed to the next error handler.</p>

          <p>Other limits you can set:</p>
          <ul>
            <li><code>fileSize</code>: bytes per file</li>
            <li><code>files</code>: max number of files</li>
            <li><code>fields</code>: max non-file fields</li>
            <li><code>fieldSize</code>: max bytes per field</li>
            <li><code>headerPairs</code>: max multipart header pairs (default 2000)</li>
          </ul>

          <h3>fileFilter</h3>
          <CodePre>{`fileFilter: (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("only images allowed"))
  cb(null, true)
}`}</CodePre>

          <p>
            Runs BEFORE writing to disk. Tabloom checks the multipart-declared MIME type prefix. <code>image/*</code>
            (image/jpeg, image/png, image/gif, image/webp, etc.) passes. Anything else throws.
          </p>

          <p>
            <strong>Important caveat</strong>: the MIME type in the multipart header comes from the CLIENT — it's not
            verified by multer. An attacker can declare <code>image/png</code> for any file. §4 covers the
            defense: magic-byte sniffing AFTER multer.
          </p>

          <h3>Wiring multer into a route</h3>
          <p>Three ways:</p>
          <CodePre>{`// One file under field name "file"
app.post('/api/media', upload.single('file'), handler)

// Up to N files under field name "files"
app.post('/api/media', upload.array('files', 10), handler)

// Multiple named fields, each with own limit
app.post('/api/media', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery',   maxCount: 20 },
]), handler)`}</CodePre>

          <p>Tabloom uses <code>upload.single('file')</code>: one file per request, under the field name <code>file</code> in the multipart form. Inside the handler, the file appears as <code>req.file</code>.</p>

          <h3>The error handler</h3>
          <p>
            If <code>fileFilter</code> rejects or <code>limits.fileSize</code> is exceeded, multer calls the next
            middleware with an error. By default, Express returns 500. Add an error handler that returns 400:
          </p>
          <CodePre>{`app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large' })
    return res.status(400).json({ error: err.message })
  }
  if (err?.message === 'only images allowed') return res.status(415).json({ error: err.message })
  next(err)
})`}</CodePre>

          <ul>
            <li>413 = Payload Too Large (file size).</li>
            <li>415 = Unsupported Media Type (MIME filter reject).</li>
            <li>400 = generic Multer error (bad multipart, etc.).</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 4 — MIME / MAGIC BYTES */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>MIME Sniffing + Magic Bytes</h2>
          <p>The MIME type in the multipart header is CLIENT-CONTROLLED. Anyone can send a file with a faked <code>Content-Type: image/png</code> header. Real defense requires reading the actual bytes.</p>

          <h3>What magic bytes are</h3>
          <p>Most file formats start with a known byte signature:</p>
          <table>
            <tbody>
              <tr><th>Format</th><th>First bytes (hex)</th><th>ASCII / hint</th></tr>
              <tr><td>JPEG</td><td><code>FF D8 FF</code></td><td>—</td></tr>
              <tr><td>PNG</td><td><code>89 50 4E 47 0D 0A 1A 0A</code></td><td><code>.PNG..</code></td></tr>
              <tr><td>GIF</td><td><code>47 49 46 38 [37|39] 61</code></td><td><code>GIF87a</code> / <code>GIF89a</code></td></tr>
              <tr><td>WebP</td><td><code>52 49 46 46 ?? ?? ?? ?? 57 45 42 50</code></td><td><code>RIFF....WEBP</code></td></tr>
              <tr><td>PDF</td><td><code>25 50 44 46</code></td><td><code>%PDF</code></td></tr>
              <tr><td>ZIP/Office docs</td><td><code>50 4B 03 04</code></td><td><code>PK..</code></td></tr>
              <tr><td>EXE</td><td><code>4D 5A</code></td><td><code>MZ</code></td></tr>
            </tbody>
          </table>

          <h3>The npm package: file-type</h3>
          <p><code>file-type</code> reads the first ~4KB of a buffer or stream and returns the detected type, regardless of what the multipart header claimed:</p>

          <CodePre>{`import { fileTypeFromFile } from 'file-type'

const detected = await fileTypeFromFile('/data/uploads/uuid-vacation.jpg')
// → { ext: 'jpg', mime: 'image/jpeg' } or undefined for unknown
if (!detected || !detected.mime.startsWith('image/')) {
  await fs.promises.unlink(filePath)
  return res.status(415).json({ error: 'Detected non-image content' })
}`}</CodePre>

          <p>The fleet apps don't currently use this defense — Tabloom relies on multer's MIME prefix check alone. For a public-facing upload endpoint, the magic-byte check is the right addition. Two reasons it's omitted today:</p>
          <ul>
            <li>Tabloom is gated behind Entra ID (authenticated users only). The attacker model is "trusted user uploads something wrong by accident," not "external attacker poisons the server."</li>
            <li>The cost of the extra check is small (a few ms per upload) but the dependency is real (one more package, one more failure mode).</li>
          </ul>

          <h3>Adding it to the Tabloom flow</h3>
          <CodePre>{`import { fileTypeFromFile } from 'file-type'
import { unlink } from 'node:fs/promises'

app.post('/api/media', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })

  // ↓ Magic-byte verification AFTER multer wrote the file
  const filePath = join(UPLOADS_PATH, req.file.filename)
  const detected = await fileTypeFromFile(filePath)
  if (!detected || !detected.mime.startsWith('image/')) {
    await unlink(filePath).catch(() => {})
    return res.status(415).json({ error: 'Detected non-image content' })
  }
  // Use detected.mime instead of req.file.mimetype going forward — it's trustworthy
  const trustedMime = detected.mime
  // ... rest of handler ...
})`}</CodePre>

          <h3>What the check catches</h3>
          <ul>
            <li><strong>Polyglot files</strong>: a JPEG header attached to ZIP data. file-type detects the JPEG bytes; SHA the file for hash equality testing if the polyglot matters to you.</li>
            <li><strong>Renamed executables</strong>: <code>malware.exe</code> renamed to <code>cute_kitten.png</code>. Header says <code>image/png</code>, real bytes start with <code>MZ</code>. file-type sees through it.</li>
            <li><strong>SVG with embedded scripts</strong>: SVG is XML; embedded <code>{`<script>`}</code> tags can XSS when rendered. Sometimes worth NOT allowing image/svg+xml at all.</li>
          </ul>

          <h3>What it doesn't catch</h3>
          <ul>
            <li>A real but unwanted image (NSFW, copyrighted). Those need ML moderation or human review.</li>
            <li>Steganography (data hidden in image pixels). Only forensic analysis finds these.</li>
            <li>Image bombs (decompression-bomb PNGs). Use <code>sharp</code> to decode safely with width/height caps.</li>
          </ul>

          <h3>The chained defense</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  C[Client claim: image/png] --> M[Multer prefix filter]
  M -->|pass| F[file-type magic sniff]
  F -->|pass| S[Sharp decode + dimension cap]
  S -->|pass| OK[Accept]
  M -->|fail| X1[415]
  F -->|fail| X2[415 + unlink]
  S -->|fail| X3[415 + unlink]
  style F fill:#5C2A4A,color:#fff`} />

          <p>Three layers. Each catches a different class of attack. Tabloom ships layer 1 (multer prefix). Production-grade public uploads should add layers 2 and 3.</p>
        </section>

        <hr />

        {/* SECTION 5 — AUTH GATE */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Auth Gate + Delete-on-Reject</h2>
          <p>The auth check happens AFTER multer parses the body — because the auth check needs the body's <code>notebookId</code> to know what the user is trying to upload TO. If auth fails, the file is already on disk. You have to clean it up.</p>

          <h3>The full handler</h3>
          <CodePre>{`// tabloom/server.js (lines 2139-2172, verbatim, abbreviated)
app.post("/api/media", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "no file" })
  const { notebookId, notebook_id, pageId, page_id, caption } = req.body ?? {}
  const nbId = Number(notebookId ?? notebook_id)
  const pId = Number(pageId ?? page_id)

  // Gate after multer so we can read the multipart body.
  if (Number.isFinite(nbId) && nbId > 0) {
    const level = notebookAccessLevel(req, nbId)
    if (!level || ROLE_RANK[level] < ROLE_RANK.editor) {
      try { unlinkSync(join(UPLOADS_PATH, req.file.filename)) } catch { /* ignore */ }
      return res.status(403).json({ error: "forbidden" })
    }
  } else if (!req.user?.isOwner) {
    // Unfiled media (no notebook) is owner-only.
    try { unlinkSync(join(UPLOADS_PATH, req.file.filename)) } catch { /* ignore */ }
    return res.status(403).json({ error: "forbidden" })
  }

  const info = stmts.insertMedia.run({
    notebook_id: nbId || null,
    page_id: pId || null,
    caption: caption ?? null,
    ocr: null,
    status: 'indexing',
    mime_type: req.file.mimetype,
    file_path: req.file.filename,
    bg_gradient: null,
  })
  const id = Number(info.lastInsertRowid)
  res.status(201).json(shapeMedia(stmts.getMedia.get(id)))

  // Fire-and-forget OCR
  if (ocrEnabled()) {
    const absPath = join(UPLOADS_PATH, req.file.filename)
    runOcr(absPath).then(/* ... update media.ocr ... */)
  }
})`}</CodePre>

          <h3>The four-phase flow</h3>
          <ol>
            <li><strong>Multer middleware</strong>: parses multipart, writes file to disk, fills <code>req.file</code> + <code>req.body</code>.</li>
            <li><strong>Auth gate</strong>: pulls notebookId from body, checks user's access level. If insufficient, <code>unlinkSync</code> + 403.</li>
            <li><strong>DB INSERT</strong>: media row with <code>file_path</code> + <code>mime_type</code>. Status starts as <code>indexing</code>.</li>
            <li><strong>Fire-and-forget OCR</strong>: don't await; respond to client immediately. OCR updates <code>media.ocr</code> + <code>media.status</code> when done.</li>
          </ol>

          <h3>Two auth paths</h3>
          <p>Tabloom's auth gate has two branches:</p>
          <ul>
            <li><strong>Notebook upload</strong> (nbId provided): user must have <code>editor</code> or higher role on that notebook.</li>
            <li><strong>Unfiled media</strong> (no nbId): only the owner of the database can upload.</li>
          </ul>

          <p>This matters for shared notebooks. Tabloom lets users share notebooks with viewers, editors, and owners. Viewers can read but not upload. The auth check enforces it on upload.</p>

          <h3>Why unlinkSync, not unlink (async)</h3>
          <p>The auth-gate path is synchronous: check → unlink → return. Using async <code>unlink</code> here would require <code>await</code>, which changes the handler's shape. <code>unlinkSync</code> is fine because the response hasn't gone out yet — blocking for a millisecond on a delete is acceptable.</p>

          <h3>Wrapping with try/catch</h3>
          <p><code>{`try { unlinkSync(...) } catch { }`}</code> swallows errors. Why? Two reasons:</p>
          <ul>
            <li>The file might not exist if multer's filename collided with something else (extremely rare).</li>
            <li>Even if delete fails, the response to client must still be 403. The orphan file is a janitorial problem, not an auth failure.</li>
          </ul>

          <p>For monitoring: log the unlink failure to your activity log so you can find orphans later.</p>

          <h3>The 201 status</h3>
          <CodePre>{`res.status(201).json(shapeMedia(stmts.getMedia.get(id)))`}</CodePre>

          <p>
            201 = Created. The right status for "I created a new resource." Returns the created resource shape so the
            client doesn't need a second round-trip to get the ID + status. The shape includes <code>id</code>,
            <code>caption</code>, <code>status: 'indexing'</code>, etc. — exactly what the client needs to render the
            new media element.
          </p>

          <h3>Why respond before OCR finishes</h3>
          <p>
            OCR can take 5–30 seconds. Holding the request open that long would (1) tie up the client UI, (2) risk
            timeouts on intermediaries, (3) waste an HTTP slot. Fire-and-forget is the only sane shape: respond fast,
            update the row asynchronously, let the client poll <code>GET /api/media/:id</code> if it cares about status.
          </p>

          <h3>The status state machine</h3>
          <table>
            <tbody>
              <tr><th>Status</th><th>Meaning</th></tr>
              <tr><td><code>indexing</code></td><td>OCR running. Display "processing..."</td></tr>
              <tr><td><code>indexed</code></td><td>OCR done. <code>ocr</code> field populated.</td></tr>
              <tr><td><code>failed</code></td><td>OCR errored. <code>ocr</code> stays null. Don't retry by default.</td></tr>
              <tr><td><code>disabled</code></td><td>OCR not configured. Treat as "no OCR needed."</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 6 — /data MOUNT */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>/data Persistent Storage</h2>
          <p>Azure App Service for Linux containers gives you a persistent mount at <code>/home</code> (or any path if you configure it). Without it, files written inside the container disappear when the container restarts. Configuring the mount is two settings.</p>

          <h3>The Dockerfile declaration</h3>
          <CodePre>{`# tabloom/Dockerfile (excerpt)
ENV UPLOADS_PATH=/data/uploads
ENV DB_PATH=/data/tabloom.db

VOLUME ["/data"]`}</CodePre>

          <p>
            <code>VOLUME ["/data"]</code> tells Docker the path is a mount point. Inside the container, code writes
            to <code>/data/uploads/&lt;file&gt;</code>; outside, that's a host filesystem path managed by the
            orchestrator (App Service, Kubernetes, plain Docker).
          </p>

          <h3>The App Service binding</h3>
          <p>In Azure App Service, "Path mappings" under Configuration → Path mappings:</p>
          <table>
            <tbody>
              <tr><th>Type</th><th>Mount path</th><th>Storage</th></tr>
              <tr><td>Azure Storage Files</td><td><code>/data</code></td><td>Storage account + file share</td></tr>
              <tr><td>Or: Azure Files share</td><td><code>/data</code></td><td>SMB share</td></tr>
            </tbody>
          </table>

          <p>
            App Service mounts the Azure Storage file share at <code>/data</code> inside the container. The container
            sees a normal POSIX filesystem; behind the scenes, every read/write is to Azure Storage. Latency is ~3–5ms
            per operation — fine for typical app needs, slower than local SSD.
          </p>

          <h3>The cheap alternative: /home</h3>
          <p>
            App Service for Linux ALSO automatically mounts <code>/home</code> as persistent (it's where the platform
            stores logs, custom configs, etc.). You can write to <code>/home/data</code> without any path mapping — it
            persists across container restarts and is automatically backed up with the App Service backup feature.
          </p>

          <p>Tabloom's Dockerfile uses <code>/data</code> because the App Service binds <code>/data</code> to a dedicated Azure Files share — separation of concerns from <code>/home</code>'s system files.</p>

          <h3>Local-dev fallback</h3>
          <CodePre>{`const UPLOADS_PATH = process.env.UPLOADS_PATH ?? join(__dirname, "uploads")`}</CodePre>

          <p>
            In dev, no <code>UPLOADS_PATH</code> env var, so uploads land in <code>./uploads/</code> next to the
            server file. In prod, the Docker container has <code>UPLOADS_PATH=/data/uploads</code>. Same code, two
            paths. Always do the dev-fallback pattern.
          </p>

          <h3>Permissions on the mount</h3>
          <p>
            When the container runs as root (Tabloom's case), writes always succeed. When the container runs as
            non-root (PulseWire's pattern), the mount might need explicit permission. Two options:
          </p>
          <ul>
            <li>Set the file share owner to UID 1001 (the non-root user).</li>
            <li>Use a tmpfs for non-persistent files and only mount <code>/data</code> for what truly needs persistence.</li>
          </ul>

          <h3>Cleanup discipline</h3>
          <p>The mount grows. Without a cleanup story, you'll fill the file share:</p>
          <ul>
            <li><strong>On media delete</strong>: <code>unlinkSync</code> the file before <code>DELETE FROM media</code>.</li>
            <li><strong>Soft delete</strong>: keep the file, set <code>deleted_at</code>. Nightly cron deletes files older than 30 days.</li>
            <li><strong>Quota</strong>: monitor with <code>df -h /data</code> via a maintenance endpoint or App Service Insights.</li>
          </ul>

          <h3>The orphan problem</h3>
          <p>Files on disk with no DB row are "orphans." They happen when:</p>
          <ul>
            <li>Auth gate rejected but unlink failed.</li>
            <li>DB INSERT failed after multer wrote the file.</li>
            <li>Process crashed between write and insert.</li>
          </ul>

          <p>Periodic janitor job:</p>
          <CodePre>{`// Find files in /data/uploads that have no media row, older than 1 hour
const filesOnDisk = await fs.promises.readdir(UPLOADS_PATH)
const rowsInDb = db.prepare("SELECT file_path FROM media").all().map(r => r.file_path)
const dbSet = new Set(rowsInDb)
const now = Date.now()
for (const file of filesOnDisk) {
  if (dbSet.has(file)) continue
  const stat = await fs.promises.stat(join(UPLOADS_PATH, file))
  if (now - stat.mtimeMs < 3600_000) continue  // give incomplete uploads 1 hour
  await fs.promises.unlink(join(UPLOADS_PATH, file))
  console.log(\`[janitor] deleted orphan: \${file}\`)
}`}</CodePre>

          <p>Run once a day via cron. Logs what it deleted so you can investigate patterns.</p>
        </section>

        <hr />

        {/* SECTION 7 — IMG SERVE */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Serving via &lt;img&gt; + Query Auth</h2>
          <p>HTML <code>{`<img src="...">`}</code> can't send Bearer headers. The browser sends the URL with whatever cookies / no headers it has. So your auth-gated image endpoint needs another way to identify the user.</p>

          <h3>The problem in detail</h3>
          <CodePre>{`<!-- Browser sends GET /api/media/42/file with no Authorization header -->
<img src="/api/media/42/file" alt="..." />`}</CodePre>

          <p>
            Three options:
          </p>
          <ol>
            <li><strong>Session cookies</strong>. The browser sends the session cookie automatically. Works, but means you need a session system (most fleet apps are token-only).</li>
            <li><strong>Query-string token</strong>. Embed a short-lived signed token in the URL. Works, but exposes the token in browser history + access logs.</li>
            <li><strong>Per-user query param</strong> (ShopKeep's pattern). Embed the user's OID in the URL. The endpoint validates the OID matches the user's database scope.</li>
          </ol>

          <p>ShopKeep chose option 3. The image endpoint is unauthenticated; the URL contains the user's OID; the endpoint looks up the image in THAT USER'S database.</p>

          <h3>ShopKeep's image-serve endpoint</h3>
          <CodePre>{`// shopkeep/server.js (lines 354-365, verbatim)
// Image serving — unauthenticated so <img> src= requests work (no custom headers)
// OID comes from ?oid= query param set by getToolImageUrl() in the frontend
app.get('/api/tools/images/:imageId', (req, res) => {
  const oid = String(req.query.oid ?? '')
  const db = OID_RE.test(oid) ? getDb(oid) : null
  const image = db?.prepare('SELECT image_name, image_data, image_type FROM tool_images WHERE id = ?').get(req.params.imageId)
  if (!image) return res.status(404).json({ error: 'Image not found' })
  res.setHeader('Content-Type', image.image_type)
  res.setHeader('Content-Disposition', \`inline; filename="\${image.image_name}"\`)
  res.setHeader('Cache-Control', 'public, max-age=31536000')
  res.send(image.image_data)
})`}</CodePre>

          <h3>Why this is safe</h3>
          <ul>
            <li><strong>OID is regex-validated</strong>: <code>OID_RE.test(oid)</code> checks it's a valid UUID-shaped GUID. Otherwise <code>getDb</code> returns null → 404.</li>
            <li><strong>DB lookup is OID-scoped</strong>: <code>getDb(oid)</code> returns the SQLite handle for THIS user's database. No cross-user query possible.</li>
            <li><strong>Image IDs are per-user</strong>: <code>tool_images.id</code> autoincrements within each per-user DB. Image #42 in user A's DB is unrelated to image #42 in user B's DB.</li>
            <li><strong>Authorization is bound to the URL</strong>: a user can share their own image URLs, but cannot construct URLs for someone else's images (would require their OID).</li>
          </ul>

          <p>It's not "no auth" — it's "auth via URL ownership." Defensible. The OID is not sensitive (it appears in many places in the app), but it's also not guessable.</p>

          <h3>Cache-Control: public, max-age=31536000</h3>
          <p>1 year. Aggressive caching. Safe because images are immutable: if a user edits an image, they upload a new one with a new ID — the old URL never serves different bytes. The 1-year cache makes the CDN happy, browsers happy, and serves the bytes once per client.</p>

          <h3>Content-Disposition: inline</h3>
          <p>Inline = display in browser. Alternative is <code>attachment; filename="x.jpg"</code> = force download. For <code>{`<img>`}</code> tag use cases, inline is the right default.</p>

          <h3>Tabloom's variant</h3>
          <p>Tabloom uses standard Bearer-auth on the media endpoint. The frontend either:</p>
          <ul>
            <li>Fetches via <code>fetch</code>, gets the blob, creates an object URL with <code>URL.createObjectURL(blob)</code>, sets that on the <code>img</code> src.</li>
            <li>OR routes through a Next.js / Express proxy that adds the Bearer header server-side (not Tabloom's case).</li>
          </ul>

          <p>The blob-URL approach works but ties up memory until the URL is revoked. For lists of many images, you can pre-fetch eagerly or lazy-load with IntersectionObserver.</p>

          <h3>Pre-signed URLs (the third pattern)</h3>
          <p>For very large files or many small ones, generate a short-lived signed URL:</p>
          <CodePre>{`// Endpoint: client asks for a signed URL
app.get('/api/media/:id/signed-url', requireAuth, (req, res) => {
  // Verify user owns this media
  const media = db.prepare("SELECT * FROM media WHERE id = ?").get(req.params.id)
  if (!media) return res.status(404).end()
  // ... access check ...

  // Generate a 5-min HMAC-signed URL
  const expires = Math.floor(Date.now() / 1000) + 300
  const path = \`/media-cache/\${media.file_path}\`
  const sig = crypto.createHmac('sha256', SIGNING_SECRET).update(\`\${path}|\${expires}\`).digest('hex')
  res.json({ url: \`\${path}?expires=\${expires}&sig=\${sig}\` })
})

// Endpoint that serves the file, verifies the signature
app.get('/media-cache/:filename', (req, res) => {
  const { expires, sig } = req.query
  const path = \`/media-cache/\${req.params.filename}\`
  if (Date.now() / 1000 > Number(expires)) return res.status(403).end()
  const expected = crypto.createHmac('sha256', SIGNING_SECRET).update(\`\${path}|\${expires}\`).digest('hex')
  if (sig !== expected) return res.status(403).end()
  // ... stream the file ...
})`}</CodePre>

          <p>Best for: large files (avoids holding the auth token in browser memory), publicly shareable URLs with TTL, CDN integration. Not used in the fleet; included for completeness.</p>
        </section>

        <hr />

        {/* SECTION 8 — DOWNLOAD */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Streaming Downloads + Caching</h2>
          <p>How you stream a file affects memory pressure, latency, and cache behavior. Tabloom's download endpoint is the right shape:</p>

          <h3>Tabloom's download</h3>
          <CodePre>{`// tabloom/server.js (lines 2205-2218, verbatim)
app.get("/api/media/:id/file", (req, res) => {
  const id = Number(req.params.id)
  const row = stmts.getMedia.get(id)
  if (!row || !row.file_path) return res.status(404).json({ error: "not found" })
  if (row.notebook_id === null) {
    if (!req.user?.isOwner) return res.status(403).json({ error: "forbidden" })
  } else if (!notebookAccessLevel(req, row.notebook_id)) {
    return res.status(403).json({ error: "forbidden" })
  }
  const filePath = join(UPLOADS_PATH, row.file_path)
  res.setHeader("Content-Type", row.mime_type ?? "application/octet-stream")
  res.setHeader("Cache-Control", "private, max-age=3600")
  createReadStream(filePath).on("error", () => res.status(404).end()).pipe(res)
})`}</CodePre>

          <h3>Why createReadStream and not res.sendFile</h3>
          <p>
            <code>res.sendFile</code> works for small files but sets ETag/Last-Modified headers automatically, which
            can be wrong if you want to control caching yourself. <code>createReadStream</code> + <code>pipe</code>
            gives you:
          </p>
          <ul>
            <li><strong>Streaming</strong>: Node reads 64KB at a time, writes to response. Constant memory regardless of file size.</li>
            <li><strong>Explicit headers</strong>: you set Content-Type, Cache-Control exactly as you want.</li>
            <li><strong>Error handling</strong>: if the stream errors (file missing mid-stream), the .on('error') handler intervenes.</li>
            <li><strong>Backpressure</strong>: pipe automatically pauses reads when the client is slow.</li>
          </ul>

          <h3>Content-Type from DB</h3>
          <CodePre>{`res.setHeader("Content-Type", row.mime_type ?? "application/octet-stream")`}</CodePre>

          <p>
            Read the MIME type from the DB row (which multer captured at upload time). Fallback to
            <code>application/octet-stream</code> if missing — browsers will treat it as a binary download. NEVER
            guess MIME from the extension at serve time; trust the captured value.
          </p>

          <h3>Cache-Control: private, max-age=3600</h3>
          <p>
            <code>private</code> = no CDN or shared cache should store this. <code>max-age=3600</code> = browser
            cache for 1 hour. For per-user-authenticated images, <code>private</code> is essential — otherwise a CDN
            might cache user A's photo and serve it to user B.
          </p>

          <h3>Contrast: ShopKeep's BLOB serve</h3>
          <CodePre>{`res.setHeader('Cache-Control', 'public, max-age=31536000')
res.send(image.image_data)`}</CodePre>

          <p>
            ShopKeep uses <code>res.send(buffer)</code> — sends the whole BLOB in one go. Works for ShopKeep's
            typical photo size (under a few MB). For multi-megabyte files, this would block the event loop. Tabloom's
            createReadStream pattern is better.
          </p>

          <h3>Range requests (HTTP 206)</h3>
          <p>For video / audio, browsers send <code>Range: bytes=0-1023</code> headers to fetch chunks. Tabloom doesn't handle them; createReadStream returns the whole file. For media streaming, parse the range header:</p>

          <CodePre>{`const range = req.headers.range
if (range) {
  const stat = await fs.promises.stat(filePath)
  const m = /bytes=(\\d+)-(\\d*)/.exec(range)
  const start = Number(m[1])
  const end = m[2] ? Number(m[2]) : stat.size - 1
  res.status(206)
  res.setHeader('Content-Range', \`bytes \${start}-\${end}/\${stat.size}\`)
  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Length', end - start + 1)
  createReadStream(filePath, { start, end }).pipe(res)
} else {
  // Full file
}`}</CodePre>

          <p>Tabloom is an image-only upload service, so range support isn't needed. If you build a video uploader, this is mandatory.</p>

          <h3>Conditional GET (ETag)</h3>
          <p>For files that rarely change, ETag enables browser cache validation:</p>
          <CodePre>{`const stat = await fs.promises.stat(filePath)
const etag = \`"\${stat.mtimeMs.toString(36)}-\${stat.size.toString(36)}"\`
res.setHeader('ETag', etag)

if (req.headers['if-none-match'] === etag) {
  return res.status(304).end()  // Not Modified
}
// ... stream the file ...`}</CodePre>

          <p>Saves bandwidth + Node CPU when the browser already has the file cached. For per-user-protected files, combine with <code>Vary: Authorization</code> so different users get different cached responses.</p>
        </section>

        <hr />

        {/* SECTION 9 — BACKGROUND FOLLOW-ON */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Background Follow-ons (OCR, etc.)</h2>
          <p>The Tabloom upload triggers async OCR. The pattern generalizes: any expensive processing should happen AFTER the response goes back to the client.</p>

          <h3>The fire-and-forget pattern</h3>
          <CodePre>{`// tabloom/server.js (excerpt)
res.status(201).json(shapeMedia(stmts.getMedia.get(id)))    // ← reply first

// Fire-and-forget OCR on /data/uploads/<uuid>-<safe-name>
if (ocrEnabled()) {
  const absPath = join(UPLOADS_PATH, req.file.filename)
  runOcr(absPath).then((result) => {
    stmts.updateMedia.run({
      id,
      ocr: result.text,
      status: 'indexed',
      bg_gradient: result.gradient,
    })
  }).catch(err => {
    console.warn(\`[ocr] failed for media \${id}: \${err.message}\`)
    stmts.updateMedia.run({ id, ocr: null, status: 'failed', bg_gradient: null })
  })
}`}</CodePre>

          <p>The handler returns 201 before the OCR promise resolves. The promise body updates the DB row when OCR completes (or fails).</p>

          <h3>Why fire-and-forget</h3>
          <ul>
            <li><strong>Client UX</strong>: user uploads, sees "indexing..." instantly, then "indexed" when OCR finishes. No multi-second spinner.</li>
            <li><strong>Server throughput</strong>: the handler doesn't hold an HTTP slot for 30 seconds.</li>
            <li><strong>Failure isolation</strong>: OCR errors don't fail the upload itself.</li>
          </ul>

          <h3>The risk: lost work on crash</h3>
          <p>If the Node process crashes after the response but before OCR completes, the media is left in <code>status: 'indexing'</code> forever. Two mitigations:</p>
          <ol>
            <li><strong>Boot sweep</strong>: on server start, find all <code>status = 'indexing'</code> rows older than 5 minutes and re-enqueue them.</li>
            <li><strong>Use a real queue</strong>: persist OCR jobs in a queue (graphile-worker, BullMQ) so a crash doesn't lose them.</li>
          </ol>

          <p>Tabloom does option 1. PulseWire uses graphile-worker. Both work.</p>

          <h3>The state machine</h3>
          <MermaidDiagram theme="default" chart={`stateDiagram-v2
  [*] --> indexing: Upload
  indexing --> indexed: OCR success
  indexing --> failed: OCR error
  indexing --> disabled: OCR not configured
  failed --> indexing: Manual retry
  indexed --> [*]
  failed --> [*]
  disabled --> [*]`} />

          <h3>Other common follow-ons</h3>
          <table>
            <tbody>
              <tr><th>Follow-on</th><th>Use case</th><th>Where to put it</th></tr>
              <tr><td>OCR</td><td>Search text in scanned documents</td><td>Fire-and-forget after upload</td></tr>
              <tr><td>Thumbnail generation</td><td>Faster grid views</td><td>Same pattern; <code>sharp</code> for resize</td></tr>
              <tr><td>Virus scan</td><td>Public uploads</td><td>Block until done; reject if positive</td></tr>
              <tr><td>NSFW classification</td><td>Public image uploads</td><td>Fire-and-forget; flag for review</td></tr>
              <tr><td>EXIF strip</td><td>Privacy (GPS coords)</td><td>Synchronous before write</td></tr>
              <tr><td>Vector embedding</td><td>Semantic search</td><td>Fire-and-forget; see Embeddings guide</td></tr>
              <tr><td>Backup to blob storage</td><td>Durability beyond local mount</td><td>Nightly cron or per-upload async</td></tr>
            </tbody>
          </table>

          <h3>Sharp for thumbnails</h3>
          <CodePre>{`import sharp from 'sharp'

async function generateThumbnail(srcPath, destPath) {
  await sharp(srcPath)
    .resize(400, 400, { fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toFile(destPath)
}`}</CodePre>

          <p>
            <code>sharp</code> is a native module wrapping libvips. It's the fastest image processing library in
            Node. Use it to generate 400×400 thumbnails on upload, store them at <code>/data/uploads/thumbs/&lt;id&gt;.webp</code>,
            serve them on grid views. Saves dramatic bandwidth.
          </p>

          <h3>EXIF strip for privacy</h3>
          <CodePre>{`await sharp(srcPath)
  .rotate()        // ← respects EXIF orientation
  .withMetadata({ exif: {} })   // ← strips everything else
  .toFile(destPath)`}</CodePre>

          <p>Photos from iPhones often include GPS coordinates. <code>withMetadata({"{ exif: {} }"})</code> strips them while preserving rotation hints. Critical for public-facing apps; nice-to-have for internal ones.</p>
        </section>

        <hr />

        {/* SECTION 10 — SANITIZE */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Filename Sanitization + UUIDs</h2>

          <h3>Tabloom's sanitization</h3>
          <CodePre>{`const safe = file.originalname.replace(/[^a-z0-9.\\-_]/gi, "_").slice(-60)
cb(null, \`\${randomUUID()}-\${safe}\`)`}</CodePre>

          <p>Three rules:</p>
          <ol>
            <li><strong>Whitelist allowed chars</strong>: only letters, digits, dot, dash, underscore. Everything else → underscore.</li>
            <li><strong>Trim to last 60</strong>: bound the length.</li>
            <li><strong>Prepend UUID</strong>: guarantee uniqueness.</li>
          </ol>

          <h3>What the sanitization defends</h3>
          <ul>
            <li><strong>Path traversal</strong>: <code>../../etc/passwd</code> → <code>______etc_passwd</code>. The dots are kept (legitimate extension), but the slashes are gone.</li>
            <li><strong>Shell injection</strong>: <code>name; rm -rf /</code> → <code>name__rm_-rf__</code>. If you later run a shell command on the filename (e.g., piping to ImageMagick), the injected command is neutralized.</li>
            <li><strong>Nullbyte truncation</strong>: <code>file.png\0.exe</code> → <code>file.png_.exe</code>. The C-style null no longer truncates the filename in older code.</li>
            <li><strong>Unicode obfuscation</strong>: U+202E (RIGHT-TO-LEFT OVERRIDE) is not in <code>[a-z0-9.-_]</code>. Stripped.</li>
            <li><strong>Filesystem reserved names</strong>: on Windows, <code>CON</code>, <code>PRN</code>, <code>NUL</code>, <code>AUX</code>, <code>COM1</code>, etc. are reserved. The whitelist doesn't catch them, but the UUID prefix does: <code>a3f2-CON.txt</code> is not the same as <code>CON</code>.</li>
          </ul>

          <h3>Why UUID prepend, not random suffix</h3>
          <p>
            Prepend = predictable file extension at the end of the filename. Useful when tools (image viewers, OCR
            processors) sniff the type from the extension. Append would put the random bytes after the extension,
            confusing things.
          </p>

          <h3>Why .slice(-60) and not .slice(0, 60)</h3>
          <p>
            Keep the END of the filename. The end usually has the extension. <code>my_very_long_descriptive_name.jpg</code>
            sliced to first 60 might be <code>my_very_long_descriptive_name_with_more_text_no_ext</code>; sliced to
            last 60 is <code>more_descriptive_name_with_more_text.jpg</code>.
          </p>

          <h3>UUID v4 collisions</h3>
          <p>
            <code>randomUUID()</code> uses crypto random. 128 bits. Collision odds are ~1 in 2¹²² for any pair. Even
            at 1 million uploads per day for 1000 years, total collisions expected: zero. Don't worry about it.
          </p>

          <h3>Extension handling</h3>
          <p>
            Tabloom doesn't separately store the extension — it's whatever the sanitized originalname ends with.
            That means files with no extension stay extensionless. Files with double extensions (<code>archive.tar.gz</code>)
            keep both. Files with malicious extensions (<code>upload.exe</code>) keep <code>.exe</code> — but the
            MIME filter rejected them before they hit the filename function.
          </p>

          <h3>Path normalization at read time</h3>
          <CodePre>{`const filePath = join(UPLOADS_PATH, row.file_path)`}</CodePre>

          <p>
            <code>join</code> normalizes the path. <code>/data/uploads</code> + <code>../etc/passwd</code> becomes
            <code>/data/etc/passwd</code> — not the user's file. Always use <code>path.join</code> with a known root,
            never string concatenation.
          </p>

          <p>For belt-and-suspenders, verify the resolved path stays within the upload root:</p>
          <CodePre>{`import { resolve, sep } from 'node:path'

const filePath = resolve(UPLOADS_PATH, row.file_path)
if (!filePath.startsWith(resolve(UPLOADS_PATH) + sep)) {
  return res.status(400).json({ error: 'invalid path' })
}`}</CodePre>

          <p>
            This catches any attempt to escape the upload root. Tabloom doesn't do this because <code>file_path</code>
            is set by multer (it's already sanitized), not by the user. If you EVER accept the path from user input,
            do the resolve-and-startsWith check.
          </p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Build an Upload Endpoint</h2>
          <p>Build a Tabloom-style upload endpoint with multer, magic-byte sniffing, auth gate, and streaming download. ~80 lines.</p>

          <h3>Setup</h3>
          <CodePre>{`npm install express multer better-sqlite3 file-type uuid`}</CodePre>

          <h3>Step 1 — schema</h3>
          <CodePre>{`// schema.sql
CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  file_path   TEXT NOT NULL,
  mime_type   TEXT NOT NULL,
  size        INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);`}</CodePre>

          <h3>Step 2 — server skeleton</h3>
          <CodePre>{`// server.js
import express from 'express'
import multer from 'multer'
import Database from 'better-sqlite3'
import { fileTypeFromFile } from 'file-type'
import { randomUUID } from 'node:crypto'
import { createReadStream, unlinkSync, readFileSync } from 'node:fs'
import { unlink } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import { mkdirSync } from 'node:fs'

const UPLOADS_PATH = process.env.UPLOADS_PATH ?? './uploads'
mkdirSync(UPLOADS_PATH, { recursive: true })

const db = new Database('./media.db')
db.exec(readFileSync('./schema.sql', 'utf8'))

const app = express()
app.use(express.json())`}</CodePre>

          <h3>Step 3 — multer config</h3>
          <CodePre>{`const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_PATH,
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-z0-9.\\-_]/gi, '_').slice(-60)
      cb(null, \`\${randomUUID()}-\${safe}\`)
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('only images allowed'))
    cb(null, true)
  },
})`}</CodePre>

          <h3>Step 4 — fake auth</h3>
          <CodePre>{`function requireAuth(req, res, next) {
  // Pretend: every request that has ?user=alice is authorized
  if (req.query.user === 'alice') {
    req.user = { id: 1, name: 'alice' }
    return next()
  }
  return res.status(401).json({ error: 'unauthorized' })
}`}</CodePre>

          <h3>Step 5 — upload route</h3>
          <CodePre>{`app.post('/api/media', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  const filePath = join(UPLOADS_PATH, req.file.filename)

  // 1) Auth gate
  if (req.query.user !== 'alice') {
    await unlink(filePath).catch(() => {})
    return res.status(401).json({ error: 'unauthorized' })
  }

  // 2) Magic byte sniffing
  const detected = await fileTypeFromFile(filePath)
  if (!detected || !detected.mime.startsWith('image/')) {
    await unlink(filePath).catch(() => {})
    return res.status(415).json({ error: 'Detected non-image content' })
  }

  // 3) Insert DB row
  const info = db.prepare(\`
    INSERT INTO media (file_path, mime_type, size)
    VALUES (?, ?, ?)
  \`).run(req.file.filename, detected.mime, req.file.size)

  res.status(201).json({
    id: info.lastInsertRowid,
    mime_type: detected.mime,
    size: req.file.size,
  })
})`}</CodePre>

          <h3>Step 6 — download route</h3>
          <CodePre>{`app.get('/api/media/:id/file', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'not found' })

  // Path traversal guard
  const filePath = resolve(UPLOADS_PATH, row.file_path)
  if (!filePath.startsWith(resolve(UPLOADS_PATH) + sep)) {
    return res.status(400).json({ error: 'invalid path' })
  }

  res.setHeader('Content-Type', row.mime_type)
  res.setHeader('Cache-Control', 'private, max-age=3600')
  createReadStream(filePath).on('error', () => res.status(404).end()).pipe(res)
})

// Error handler for multer errors
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Too large' })
    return res.status(400).json({ error: err.message })
  }
  if (err?.message === 'only images allowed') return res.status(415).json({ error: err.message })
  res.status(500).json({ error: 'internal error' })
})

app.listen(3001, () => console.log('listening on 3001'))`}</CodePre>

          <h3>Test it</h3>
          <CodePre>{`# Authorized upload
curl -F "file=@photo.jpg" "http://localhost:3001/api/media?user=alice"
# → { id: 1, mime_type: "image/jpeg", size: 245837 }

# Unauthorized — file gets unlinked
curl -F "file=@photo.jpg" "http://localhost:3001/api/media?user=mallory"
# → { error: "unauthorized" }

# Try uploading a renamed executable
mv malware.exe malware.png
curl -F "file=@malware.png" "http://localhost:3001/api/media?user=alice"
# → { error: "Detected non-image content" }

# Download
curl "http://localhost:3001/api/media/1/file?user=alice" -o downloaded.jpg

# Too large
truncate -s 50M huge.png
curl -F "file=@huge.png" "http://localhost:3001/api/media?user=alice"
# → { error: "Too large" }`}</CodePre>

          <h3>Extensions</h3>
          <ul>
            <li>Add a janitor cron that finds orphan files and deletes them.</li>
            <li>Generate thumbnails with sharp on upload.</li>
            <li>Add an EXIF stripper.</li>
            <li>Switch from disk storage to memory storage and write to Azure Blob Storage instead.</li>
            <li>Add the signed-URL pattern.</li>
            <li>Implement range requests for video.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Multer doesn't see my file"</h3>
          <ul>
            <li>Field name mismatch. Client sends <code>FormData</code> with key <code>upload</code>; server uses <code>upload.single('file')</code>. Match them.</li>
            <li>Client forgot <code>encType="multipart/form-data"</code> on the form, or sent JSON.</li>
            <li>Missing <code>upload.single(...)</code> middleware — without it, multer doesn't run.</li>
          </ul>

          <h3>"req.body is empty when multer is used"</h3>
          <p>Order matters: <code>app.use(express.json())</code> must come BEFORE multer routes only for JSON-bodied routes. For multipart, multer parses everything itself. If your client sends BOTH JSON and a file, you need <code>upload.single('file')</code> — multer puts non-file fields in req.body automatically.</p>

          <h3>"413 Payload Too Large"</h3>
          <ul>
            <li>Multer's <code>limits.fileSize</code> exceeded → multer error. Raise the cap or split the upload.</li>
            <li>For base64-in-JSON uploads, <code>express.json({"{ limit: '50mb' }"})</code>.</li>
            <li>Some intermediaries (CloudFlare, App Service Gateway) have their own request size caps. Check those if multer says it's fine.</li>
          </ul>

          <h3>"Files aren't persisting across container restarts"</h3>
          <p>You're writing to a directory that isn't the persistent mount. Verify:</p>
          <CodePre>{`# Inside the running container:
mount | grep data
df -h /data
ls -la /data/uploads/`}</CodePre>

          <p>If <code>/data</code> doesn't appear in <code>mount</code>, the App Service path mapping isn't set or the Dockerfile's <code>VOLUME</code> declaration is wrong.</p>

          <h3>"img src returns 404 in the browser but works in curl"</h3>
          <ul>
            <li>Browser is sending different request headers (no Bearer). Use the query-string OID pattern.</li>
            <li>Browser is using a different origin (CORS). Allow it explicitly or proxy.</li>
            <li>Cookies aren't being sent (session auth) because the img tag is from a different domain.</li>
          </ul>

          <h3>"Image rotates wrong"</h3>
          <p>EXIF orientation. iPhones save photos in landscape but tag them with rotation. Strip with <code>sharp(...).rotate()</code> before display, or set <code>image-orientation: from-image</code> in CSS.</p>

          <h3>"Magic bytes detection is slow"</h3>
          <p>file-type reads the first ~4KB. That's a few ms. If it feels slow, check:</p>
          <ul>
            <li>Are you running it inside a synchronous transaction? Move to before the transaction.</li>
            <li>Are you doing it on every list request? Cache the detected type in the DB row.</li>
          </ul>

          <h3>"Some file types come back as undefined from file-type"</h3>
          <p>The library doesn't recognize every format. Plain text, CSV, XML often come back undefined. Add a fallback for these if you allow them.</p>

          <h3>"Orphan files are accumulating in /data/uploads"</h3>
          <p>Your DELETE FROM media isn't unlinking files. Add a hook:</p>
          <CodePre>{`function deleteMedia(id) {
  const row = db.prepare('SELECT file_path FROM media WHERE id = ?').get(id)
  if (row) {
    try { unlinkSync(join(UPLOADS_PATH, row.file_path)) } catch {}
  }
  db.prepare('DELETE FROM media WHERE id = ?').run(id)
}`}</CodePre>

          <p>Or set up an AFTER DELETE trigger that logs the file_path to a delete-queue table for a cleanup job.</p>

          <h3>"Filename encoding is wonky on non-ASCII uploads"</h3>
          <p>The originalname might be UTF-8 byte sequence interpreted as Latin-1 by older multer. Express + multer 1.4.5+ handles UTF-8 correctly. If you see <code>café.jpg</code> arriving as <code>cafÃ©.jpg</code>, you're on old multer.</p>

          <h3>"Upload succeeds but the file is 0 bytes"</h3>
          <ul>
            <li>Disk full. Check <code>df -h /data</code>.</li>
            <li>File permission denied for the multer destination directory.</li>
            <li>Client sent an empty file.</li>
          </ul>

          <p>Add a check: <code>if (req.file.size === 0) reject and unlink</code>.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Multer config (fleet pattern)</h3>
          <CodePre>{`const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_PATH,
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-z0-9.\\-_]/gi, '_').slice(-60)
      cb(null, \`\${randomUUID()}-\${safe}\`)
    },
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('only images allowed'))
    cb(null, true)
  },
})`}</CodePre>

          <h3>Upload route (with auth gate + delete-on-reject)</h3>
          <CodePre>{`app.post('/api/media', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  const filePath = join(UPLOADS_PATH, req.file.filename)

  if (!userCanUploadTo(req.user, req.body.notebookId)) {
    try { unlinkSync(filePath) } catch {}
    return res.status(403).json({ error: 'forbidden' })
  }

  const detected = await fileTypeFromFile(filePath)
  if (!detected?.mime.startsWith('image/')) {
    try { unlinkSync(filePath) } catch {}
    return res.status(415).json({ error: 'bad content' })
  }

  const info = db.prepare(\`INSERT INTO media (...) VALUES (...)\`).run(...)
  res.status(201).json({ id: info.lastInsertRowid, ... })

  // Fire-and-forget OCR / thumbs / etc.
  runOcr(filePath).then(/* ... */).catch(/* ... */)
})`}</CodePre>

          <h3>Streaming download</h3>
          <CodePre>{`app.get('/api/media/:id/file', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).end()
  if (!userCanRead(req.user, row)) return res.status(403).end()

  const filePath = resolve(UPLOADS_PATH, row.file_path)
  if (!filePath.startsWith(resolve(UPLOADS_PATH) + sep)) return res.status(400).end()

  res.setHeader('Content-Type', row.mime_type)
  res.setHeader('Cache-Control', 'private, max-age=3600')
  createReadStream(filePath).on('error', () => res.status(404).end()).pipe(res)
})`}</CodePre>

          <h3>Query-string OID serve (ShopKeep pattern)</h3>
          <CodePre>{`app.get('/api/images/:id', (req, res) => {
  const oid = String(req.query.oid ?? '')
  if (!OID_RE.test(oid)) return res.status(404).end()
  const db = getDb(oid)
  const img = db.prepare('SELECT * FROM images WHERE id = ?').get(req.params.id)
  if (!img) return res.status(404).end()
  res.setHeader('Content-Type', img.image_type)
  res.setHeader('Cache-Control', 'public, max-age=31536000')
  res.send(img.image_data)
})`}</CodePre>

          <h3>Filesize / MIME error responses</h3>
          <table>
            <tbody>
              <tr><th>Code</th><th>Meaning</th><th>When</th></tr>
              <tr><td>400</td><td>Bad Request</td><td>Missing file, malformed multipart</td></tr>
              <tr><td>403</td><td>Forbidden</td><td>Auth gate denied (after unlink)</td></tr>
              <tr><td>413</td><td>Payload Too Large</td><td>fileSize limit exceeded</td></tr>
              <tr><td>415</td><td>Unsupported Media Type</td><td>MIME or magic-byte rejected</td></tr>
            </tbody>
          </table>

          <h3>Magic-byte detection</h3>
          <CodePre>{`import { fileTypeFromFile } from 'file-type'
const detected = await fileTypeFromFile(filePath)
// → { ext: 'jpg', mime: 'image/jpeg' } or undefined
if (!detected || !detected.mime.startsWith('image/')) {
  await unlink(filePath).catch(() => {})
  return res.status(415).end()
}`}</CodePre>

          <h3>/data persistent mount</h3>
          <CodePre>{`# Dockerfile
ENV UPLOADS_PATH=/data/uploads
VOLUME ["/data"]

# App Service path mapping: bind /data to Azure Files share`}</CodePre>

          <h3>Fire-and-forget follow-on</h3>
          <CodePre>{`res.status(201).json(/* immediate */)

runOcr(filePath)
  .then(r => db.prepare('UPDATE media SET ocr=?,status=? WHERE id=?').run(r.text, 'indexed', id))
  .catch(_e => db.prepare('UPDATE media SET status=? WHERE id=?').run('failed', id))`}</CodePre>

          <h3>Janitor pattern (orphan cleanup)</h3>
          <CodePre>{`const filesOnDisk = await fs.promises.readdir(UPLOADS_PATH)
const inDb = new Set(db.prepare('SELECT file_path FROM media').all().map(r => r.file_path))
for (const f of filesOnDisk) {
  if (inDb.has(f)) continue
  const stat = await fs.promises.stat(join(UPLOADS_PATH, f))
  if (Date.now() - stat.mtimeMs < 3600_000) continue   // grace period
  await fs.promises.unlink(join(UPLOADS_PATH, f))
}`}</CodePre>

          <h3>Path traversal guard</h3>
          <CodePre>{`const filePath = resolve(UPLOADS_PATH, candidate)
if (!filePath.startsWith(resolve(UPLOADS_PATH) + sep)) {
  return res.status(400).end()
}`}</CodePre>

          <h3>Decision tree: pick a pattern</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  S[What size files?]
  S -->|< 500KB typical| Q1{Backup story?}
  Q1 -->|One DB dump| BLOB[Base64 + BLOB - ShopKeep]
  Q1 -->|Filesystem OK| MULT[multer + disk - Tabloom]
  S -->|> 1 MB typical| MULT
  S -->|> 100MB or stream| SIGN[Signed URL to blob storage]
  style BLOB fill:#5C2A4A,color:#fff
  style MULT fill:#5C2A4A,color:#fff`} />

          <h3>The discipline</h3>
          <ul>
            <li>multer + disk for production. Memory storage for synchronous tests only.</li>
            <li>UUID prefix + sanitize originalname.</li>
            <li>Auth gate AFTER multer + unlink on reject.</li>
            <li>Magic byte sniff for public uploads.</li>
            <li>Persistent mount (<code>/data</code>) — not the ephemeral container fs.</li>
            <li>Fire-and-forget follow-ons (OCR, thumbs).</li>
            <li>Streaming download with createReadStream + pipe.</li>
            <li>Path traversal guard with resolve + startsWith.</li>
            <li>Janitor cron for orphans.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
