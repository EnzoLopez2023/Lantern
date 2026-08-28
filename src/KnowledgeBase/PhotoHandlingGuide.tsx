import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                    icon: '🧠' },
  { id: 's2',  num: '2',  title: 'The Stack',                       icon: '🧱' },
  { id: 's3',  num: '3',  title: 'Serving a NAS Share Safely',      icon: '🛡️' },
  { id: 's4',  num: '4',  title: 'The SQLite Metadata Cache',       icon: '🗄️' },
  { id: 's5',  num: '5',  title: 'sharp Thumbnails',                icon: '✂️' },
  { id: 's6',  num: '6',  title: 'react-photo-album',               icon: '🖼️' },
  { id: 's7',  num: '7',  title: 'yet-another-react-lightbox',      icon: '🔦' },
  { id: 's8',  num: '8',  title: 'The Browse Flow',                 icon: '🗂️' },
  { id: 's9',  num: '9',  title: 'Performance Discipline',          icon: '⚡' },
  { id: 's10', num: '10', title: 'Dockerizing sharp (libvips)',     icon: '🐳' },
  { id: 's11', num: '★',  title: 'Lab: Mini Masonry Gallery',       icon: '🛠️' },
  { id: 's12', num: '?',  title: 'Troubleshooting',                 icon: '🩺' },
  { id: 's13', num: '✦',  title: 'Cheat Sheet',                     icon: '📋' },
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

export default function PhotoHandlingGuide() {
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
            <span className="sidebar-title">Image &amp; Photo Handling</span>
          </div>
          <div className="sidebar-sub">SecretPhoto deep dive</div>
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
          <div className="hero-tag">🖼️ react-photo-album · sharp · 2026</div>
          <h1>Image &amp; Photo Handling<br />(SecretPhoto deep dive)</h1>
          <p>
            SecretPhoto is the fleet's <strong style={{ color: '#C77AA0' }}>read-only photo viewer</strong> over a
            NAS share — <code>\\DS1821\photo\WoodWorking</code>. No uploads, no auth, no editing: it walks a folder
            tree, builds a justified gallery with <strong style={{ color: '#C77AA0' }}>react-photo-album</strong>,
            opens a zoomable <strong style={{ color: '#C77AA0' }}>yet-another-react-lightbox</strong>, and leans on
            <strong style={{ color: '#C77AA0' }}> sharp</strong> (libvips) for thumbnails it caches to disk. A tiny
            SQLite table caches image dimensions so the gallery can lay out before a single full image loads.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Image tiers (thumb/full/zoom)</span></div>
            <div className="hero-stat"><span className="hero-stat-val">600px</span><span className="hero-stat-label">Thumbnail long edge</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Writes to the NAS</span></div>
            <div className="hero-stat"><span className="hero-stat-val">7d</span><span className="hero-stat-label">Thumb cache header</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Every other fleet app <em>owns</em> its images — users upload them, the app stores them (BLOB or disk),
            and it controls the whole lifecycle. SecretPhoto is the opposite: the source of truth is a
            <strong> read-only network share</strong> that something else fills. SecretPhoto never writes a byte back
            to it. That single constraint shapes the whole design.
          </p>
          <p>The data flows in three image tiers, each cheaper-to-serve than the last is to load:</p>
          <MermaidDiagram theme="default" chart={`graph LR
  NAS[(NAS share<br/>read-only)] -->|sharp metadata| META[SQLite cache<br/>width/height/mtime]
  NAS -->|sharp resize 600px| THUMB[Thumb on disk<br/>thumbs/&lt;sha1&gt;.jpg]
  META --> GRID[react-photo-album<br/>justified rows]
  THUMB --> GRID
  GRID -->|click| LB[Lightbox<br/>full image + zoom]
  NAS -->|createReadStream| LB`} />
          <h3>Why three tiers</h3>
          <ul>
            <li><strong>Dimensions cache (cheap, tiny):</strong> the gallery library needs every photo's
              <code>width</code>/<code>height</code> <em>before</em> it can compute a justified layout. Reading that
              from a cached SQLite row is microseconds; reading it from the NAS with sharp is tens of milliseconds ×
              hundreds of files.</li>
            <li><strong>Thumbnail (medium):</strong> a 600px mozjpeg is ~30–80 KB. That's what the grid actually
              renders. Generated once, cached to local disk, served with a 7-day cache header.</li>
            <li><strong>Full image (expensive):</strong> only streamed when the user opens the lightbox. Never loaded
              for the grid.</li>
          </ul>
          <Note>
            The mental shortcut: <strong>the NAS is a database you can only SELECT from.</strong> Everything
            SecretPhoto generates (dimensions, thumbnails) is a derived cache it can rebuild at any time, stored
            <em>beside</em> the app — never on the share.
          </Note>
        </section>

        <hr />

        {/* SECTION 2 — THE STACK */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>The Stack</h2>
          <p>SecretPhoto is deliberately small. Every dependency earns its place:</p>
          <table>
            <tbody>
              <tr><th>Package</th><th>Version</th><th>Job</th></tr>
              <tr><td><code>react-photo-album</code></td><td>3.1</td><td>Justified rows / columns / masonry gallery layout</td></tr>
              <tr><td><code>yet-another-react-lightbox</code></td><td>3.21</td><td>Full-screen viewer with zoom + counter plugins</td></tr>
              <tr><td><code>sharp</code></td><td>0.34</td><td>libvips bindings — read metadata, generate thumbnails</td></tr>
              <tr><td><code>better-sqlite3</code></td><td>12.8</td><td>Dimensions cache (synchronous, no ORM)</td></tr>
              <tr><td><code>express</code></td><td>5.2</td><td>Five JSON/stream endpoints, SPA fallback</td></tr>
              <tr><td><code>react</code> + <code>vite</code></td><td>19 + 8</td><td>SPA on Vite 8 (Rolldown), Tailwind v4 via <code>@tailwindcss/vite</code></td></tr>
            </tbody>
          </table>
          <p>
            No MUI, no router, no auth, no state library. The whole frontend is one <code>BrowsePage</code> driving a
            <code>PhotoGrid</code> and a <code>Lightbox</code>, with a thin <code>photoService.ts</code> wrapping
            <code>fetch</code>. It's the minimal-React end of the fleet — see the React 19 guide's fleet table.
          </p>
        </section>

        <hr />

        {/* SECTION 3 — NAS SAFELY */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Serving a NAS Share Safely</h2>
          <p>
            The backend resolves a single root and refuses to serve anything outside it. The root is configurable so
            dev (a local folder) and prod (the UNC share) differ only by env var:
          </p>
          <CodePre>{`const PHOTOS_ROOT = process.env.PHOTOS_ROOT ?? '\\\\\\\\DS1821\\\\photo\\\\WoodWorking';
const THUMBS_DIR  = process.env.THUMBS_DIR  ?? join(__dirname, 'thumbs');
// resolve once at boot so every request compares against the real absolute path
const PHOTOS_ROOT_RESOLVED = resolve(PHOTOS_ROOT);`}</CodePre>
          <h3>The path-traversal guard</h3>
          <p>
            Every endpoint takes an <code>album</code> (relative folder) and <code>filename</code> from the URL. Those
            are attacker-controlled, so they go through one choke point — <code>safeJoin</code> — that resolves the
            candidate and verifies it still lives under the root. A <code>../../etc/passwd</code> resolves <em>out</em>
            of the root and is rejected:
          </p>
          <CodePre>{`function safeJoin(album, filename = '') {
  const candidate = resolve(PHOTOS_ROOT_RESOLVED, album, filename);
  // must be the root itself or a path beneath it
  if (candidate !== PHOTOS_ROOT_RESOLVED &&
      !candidate.startsWith(PHOTOS_ROOT_RESOLVED + sep)) {
    return null;            // escape attempt → caller returns 400
  }
  return candidate;
}`}</CodePre>
          <Note kind="warn">
            Comparing with <code>startsWith(root + sep)</code> — not bare <code>startsWith(root)</code> — matters.
            Without the separator, <code>/photos-secret</code> would pass a <code>/photos</code> prefix check. The
            trailing <code>sep</code> forces a real directory boundary.
          </Note>
          <h3>Only serve images, with a known MIME</h3>
          <p>
            An extension allow-list keeps non-images (and <code>.lnk</code>/<code>.db</code>/junk) out of listings, and
            a small map sets the right <code>Content-Type</code> on the way out — never trust the OS to guess:
          </p>
          <CodePre>{`const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp', '.tif', '.tiff']);
const isImage = (name) => IMAGE_EXT.has(extname(name).toLowerCase());

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.gif': 'image/gif',  '.webp': 'image/webp', '.avif': 'image/avif',
};`}</CodePre>
          <h3>Streaming, not buffering</h3>
          <p>
            Full images can be 10–30 MB. Reading them into memory would blow up under concurrency. The full-photo route
            <code>stat</code>s the file (to set <code>Content-Length</code>), sets a 1-day cache header, then pipes a
            read stream straight to the response:
          </p>
          <CodePre>{`app.get('/api/photo/:album/:filename', async (req, res) => {
  const album    = decodeURIComponent(req.params.album);
  const filename = decodeURIComponent(req.params.filename);
  const full = safeJoin(album, filename);
  if (!full) return res.status(400).json({ error: 'Invalid path' });

  let stat;
  try { stat = await fs.stat(full); }
  catch { return res.status(404).json({ error: 'Not found' }); }

  res.setHeader('Content-Type', MIME_BY_EXT[extname(filename).toLowerCase()] ?? 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  createReadStream(full).pipe(res);   // backpressure handled for free
});`}</CodePre>
        </section>

        <hr />

        {/* SECTION 4 — METADATA CACHE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The SQLite Metadata Cache</h2>
          <p>
            The gallery needs dimensions for layout. Asking sharp to read EXIF off the NAS for every photo on every
            browse would be painfully slow, so dimensions are cached in a one-table SQLite DB, keyed by
            <code>(album, filename)</code> and invalidated by the file's modified time:
          </p>
          <CodePre>{`db.exec(\`
  CREATE TABLE IF NOT EXISTS photos (
    album      TEXT NOT NULL,
    filename   TEXT NOT NULL,
    width      INTEGER NOT NULL,
    height     INTEGER NOT NULL,
    size_bytes INTEGER NOT NULL,
    mtime      INTEGER NOT NULL,
    PRIMARY KEY (album, filename)
  );
  CREATE INDEX IF NOT EXISTS idx_photos_album ON photos(album);
\`);

const stmts = {
  getPhoto:    db.prepare('SELECT width, height, size_bytes, mtime FROM photos WHERE album = ? AND filename = ?'),
  upsertPhoto: db.prepare(\`INSERT INTO photos (album, filename, width, height, size_bytes, mtime)
                            VALUES (?, ?, ?, ?, ?, ?)
                            ON CONFLICT(album, filename) DO UPDATE SET
                              width=excluded.width, height=excluded.height,
                              size_bytes=excluded.size_bytes, mtime=excluded.mtime\`),
};`}</CodePre>
          <h3>mtime is the cache key</h3>
          <p>
            On read, compare the file's current <code>mtime</code> to the cached one. Match → return the row. Miss →
            ask sharp, write the row, return it. No manual invalidation, no TTL: if someone replaces a photo on the
            NAS, its mtime changes and the cache self-heals on next view.
          </p>
          <CodePre>{`async function readPhotoMeta(album, filename) {
  const full = safeJoin(album, filename);
  if (!full) return null;

  const stat = await fs.stat(full).catch(() => null);
  if (!stat?.isFile()) return null;

  const mtime  = Math.floor(stat.mtimeMs);
  const cached = stmts.getPhoto.get(album, filename);
  if (cached && cached.mtime === mtime) return { ...cached, filename };  // hit

  const meta = await sharp(full).metadata().catch(() => null);           // miss
  if (!meta) return null;

  // EXIF orientation 5–8 means the image is rotated 90°: swap w/h
  const swap   = (meta.orientation ?? 1) >= 5 && (meta.orientation ?? 1) <= 8;
  const width  = swap ? meta.height : meta.width;
  const height = swap ? meta.width  : meta.height;
  if (!width || !height) return null;

  stmts.upsertPhoto.run(album, filename, width, height, stat.size, mtime);
  return { width, height, size_bytes: stat.size, mtime, filename };
}`}</CodePre>
          <Note kind="warn">
            <strong>The EXIF-orientation swap is the #1 image-handling bug.</strong> A portrait phone photo is often
            stored as a landscape buffer plus an "rotate 90°" EXIF flag. sharp reports the <em>buffer's</em> width and
            height; if you don't swap them for orientation 5–8, every portrait photo lays out sideways and the gallery
            math is wrong. The thumbnail pipeline (§5) calls <code>.rotate()</code> to physically bake the rotation in,
            so display and layout agree.
          </Note>
        </section>

        <hr />

        {/* SECTION 5 — SHARP THUMBNAILS */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>sharp Thumbnails</h2>
          <p>
            sharp is a thin, very fast Node binding over <strong>libvips</strong> — a streaming image processor that
            uses a fraction of the memory of ImageMagick. SecretPhoto uses it for exactly two things: reading metadata
            (§4) and producing one 600px thumbnail per image.
          </p>
          <h3>Content-addressed thumbnail paths</h3>
          <p>
            The thumb filename is a SHA-1 of <code>album/filename</code>. That sidesteps every problem with mirroring a
            folder tree (spaces, unicode, nesting, path length) into the thumbs dir — it's a flat directory of
            <code>&lt;hash&gt;.jpg</code> files:
          </p>
          <CodePre>{`function thumbPathFor(album, filename) {
  const hash = createHash('sha1').update(\`\${album}/\${filename}\`).digest('hex');
  return join(THUMBS_DIR, \`\${hash}.jpg\`);
}`}</CodePre>
          <h3>Generate-on-first-hit, idempotent</h3>
          <p>
            <code>ensureThumb</code> is the whole pipeline. If a fresh thumb exists (its mtime is newer than the
            source), reuse it; otherwise generate. Note the order: <code>.rotate()</code> applies EXIF orientation,
            then <code>.resize(...inside, withoutEnlargement)</code> fits within a 600px box without upscaling small
            images, then mozjpeg at q80:
          </p>
          <CodePre>{`async function ensureThumb(album, filename, srcMtime) {
  const src = safeJoin(album, filename);
  if (!src) return null;
  const out = thumbPathFor(album, filename);

  // Cache hit: thumb is at least as new as the source
  try {
    const t = await fs.stat(out);
    if (t.mtimeMs >= srcMtime) return out;
  } catch { /* not generated yet */ }

  await fs.mkdir(THUMBS_DIR, { recursive: true });
  await sharp(src)
    .rotate()                                             // bake EXIF orientation in
    .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
  return out;
}`}</CodePre>
          <h3>The thumbnail endpoint</h3>
          <p>
            Thumbnails are generated lazily — the first request for a given thumb produces it, subsequent requests hit
            disk. A 7-day cache header means the browser barely asks twice:
          </p>
          <CodePre>{`app.get('/api/thumb/:album/:filename', async (req, res) => {
  const album = decodeURIComponent(req.params.album);
  const filename = decodeURIComponent(req.params.filename);
  const src = safeJoin(album, filename);
  if (!src) return res.status(400).json({ error: 'Invalid path' });

  const stat = await fs.stat(src).catch(() => null);
  if (!stat) return res.status(404).json({ error: 'Not found' });

  const thumb = await ensureThumb(album, filename, stat.mtimeMs);
  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=604800');   // 7 days
  createReadStream(thumb).pipe(res);
});`}</CodePre>
          <h3>Fire-and-forget pre-warm</h3>
          <p>
            The clever bit: when <code>/api/browse</code> returns a folder, it <em>also</em> kicks off thumbnail
            generation for the visible photos and covers — <strong>after</strong> the response is sent — so by the time
            the browser's <code>&lt;img&gt;</code> requests arrive, many thumbs already exist. Concurrency is capped so
            sharp and the NAS don't choke:
          </p>
          <CodePre>{`res.json({ path: relPath, subfolders, photos });

// AFTER responding — don't await, just warm the cache
prewarmThumbs(relPath, photos, subfolders);

function prewarmThumbs(relPath, photos, subfolders) {
  const items = photos.map(p => ({ album: relPath, filename: p.filename }));
  for (const s of subfolders) if (s.cover) items.push(s.cover);

  mapLimit(items, 4, async ({ album, filename }) => {      // cap = 4
    const src = safeJoin(album, filename);
    const stat = await fs.stat(src).catch(() => null);
    if (stat) await ensureThumb(album, filename, stat.mtimeMs);
  }).catch(() => { /* swallow — best effort */ });
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 6 — REACT-PHOTO-ALBUM */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>react-photo-album</h2>
          <p>
            react-photo-album computes a <strong>justified gallery</strong> — rows of images scaled to a target height
            with consistent gaps, like Google Photos or Flickr. It does the layout math; you give it photos with
            intrinsic <code>width</code>/<code>height</code> and tell it how to render an image.
          </p>
          <h3>Three layouts, one API</h3>
          <table>
            <tbody>
              <tr><th>Component</th><th>Shape</th><th>Use when</th></tr>
              <tr><td><code>RowsPhotoAlbum</code></td><td>Justified rows (target row height)</td><td>Mixed aspect ratios — SecretPhoto's choice</td></tr>
              <tr><td><code>ColumnsPhotoAlbum</code></td><td>Fixed column count, balanced</td><td>Pinterest-style, predictable column count</td></tr>
              <tr><td><code>MasonryPhotoAlbum</code></td><td>Masonry (waterfall)</td><td>Tall feeds where row alignment doesn't matter</td></tr>
            </tbody>
          </table>
          <h3>SecretPhoto's PhotoGrid</h3>
          <p>
            The grid maps each <code>Photo</code> to the library's shape. The key move is <code>srcSet</code>: the grid
            renders the 600px thumb, but advertises the full image as a higher-resolution candidate so the browser can
            pick a sharper source on hi-DPI screens or when zoomed:
          </p>
          <CodePre>{`import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';

export default function PhotoGrid({ album, photos, onClick }) {
  const items = photos.map(p => ({
    src: thumbUrl(album, p.filename),
    width: p.width,            // intrinsic dims drive the layout math
    height: p.height,
    srcSet: [
      { src: thumbUrl(album, p.filename), width: 600,
        height: Math.round(600 * p.height / p.width) },
      { src: photoUrl(album, p.filename), width: p.width, height: p.height },
    ],
  }));

  return (
    <RowsPhotoAlbum
      photos={items}
      targetRowHeight={240}
      spacing={5}
      onClick={({ index }) => onClick(index)}
      render={{
        // native lazy + async decode — keeps long albums smooth
        image: (props) => <img {...props} loading="lazy" decoding="async" />,
      }}
    />
  );
}`}</CodePre>
          <Note>
            <strong>Intrinsic dimensions are mandatory.</strong> The layout is computed from each photo's aspect ratio
            <em>before</em> any image loads — that's the entire reason the SQLite dimensions cache (§4) exists. Pass
            wrong dims and you get layout shift as images snap to their real size.
          </Note>
          <p>
            The <code>render.image</code> override is where you opt into native lazy loading and async decoding.
            <code>onClick</code> hands back the clicked index, which becomes the lightbox's starting slide.
          </p>
        </section>

        <hr />

        {/* SECTION 7 — LIGHTBOX */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>yet-another-react-lightbox</h2>
          <p>
            The lightbox is a controlled component: it's "open" when the selected index is ≥ 0, and it reports back
            every time the user navigates so the page can keep its own index in sync. Plugins are opt-in — SecretPhoto
            enables <strong>Zoom</strong> and <strong>Counter</strong>:
          </p>
          <CodePre>{`import RYALightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

export default function Lightbox({ album, photos, index, onClose, onIndexChange }) {
  const slides = photos.map(p => ({
    src: photoUrl(album, p.filename),      // full image — only loaded here
    width: p.width, height: p.height,
    alt: p.filename,
  }));

  return (
    <RYALightbox
      open={index >= 0}
      close={onClose}
      index={Math.max(0, index)}
      slides={slides}
      plugins={[Zoom, Counter]}
      controller={{ closeOnBackdropClick: true }}
      animation={{ fade: 320, swipe: 0 }}        // cross-fade between slides
      carousel={{ finite: false, preload: 3 }}   // wrap around + prefetch ±3
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      on={{ view: ({ index: i }) => onIndexChange(i) }}
      styles={{
        container: { backgroundColor: 'rgba(7, 8, 10, 0.97)' },
        button:    { color: theme.gold, filter: 'none' },
        icon:      { color: theme.text },
      }}
    />
  );
}`}</CodePre>
          <h3>The knobs that matter</h3>
          <ul>
            <li><strong><code>carousel.preload: 3</code></strong> — prefetch the next/previous 3 full images so paging
              feels instant. <code>finite: false</code> wraps from last back to first.</li>
            <li><strong><code>zoom.scrollToZoom</code></strong> — wheel/trackpad zooms instead of paging;
              <code>maxZoomPixelRatio: 3</code> lets you go past 1:1 to inspect detail.</li>
            <li><strong><code>animation.swipe: 0</code></strong> — disables the horizontal slide so the cross-fade
              (<code>fade: 320</code>) is the only transition. A taste choice, but a deliberate one.</li>
            <li><strong><code>on.view</code></strong> — the sync hook. Keeping the parent's index in lockstep means
              closing and reopening returns to the right photo, and deep-linking a slide is trivial.</li>
          </ul>
          <Note>
            The grid uses thumbnails; the lightbox uses full images. They share the same <code>photos[]</code> and the
            same index space, so a click at grid index 7 opens slide 7 — no lookup, no mapping table.
          </Note>
        </section>

        <hr />

        {/* SECTION 8 — BROWSE FLOW */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>The Browse Flow</h2>
          <p>
            <code>/api/browse?path=...</code> returns one folder level: its subfolders (each with a cover image) and
            its direct photos. The whole thing is built around <strong>bounded parallelism</strong> — a tiny
            <code>mapLimit</code> helper runs N async tasks with a concurrency cap, because the NAS hates being hit by
            500 simultaneous <code>stat</code>s:
          </p>
          <CodePre>{`async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  const worker = async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      try { out[i] = await fn(items[i], i); } catch { out[i] = null; }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, worker));
  return out;
}`}</CodePre>
          <p>The endpoint uses it twice — covers at cap 8, direct photos at cap 16:</p>
          <CodePre>{`// subfolder covers (one recursive findCover walk each)
const subfolders = await mapLimit(subDescriptors, 8, async (d) => {
  const cover = await findCover(d.childAbs, d.childRel);
  const meta  = cover ? await readPhotoMeta(cover.album, cover.filename) : null;
  return { name: d.sub, path: d.childRel, photoCount: d.childImages,
           subfolderCount: d.childDirs,
           cover: cover ? { ...cover, width: meta?.width ?? 4, height: meta?.height ?? 3 } : null };
});

// direct photos — the big win on large albums
const photos = (await mapLimit(imageNames, 16, (f) => readPhotoMeta(relPath, f))).filter(Boolean);`}</CodePre>
          <h3>Cover selection</h3>
          <p>
            A folder's cover is "the first image found walking depth-first," capped at a max depth so a pathological
            tree can't hang the request. Files-before-dirs ordering means a folder with its own images uses one of
            them rather than diving into a subfolder:
          </p>
          <CodePre>{`async function findCover(absDir, relPath, depth = 0) {
  if (depth > MAX_WALK_DEPTH) return null;
  const entries = await fs.readdir(absDir, { withFileTypes: true }).catch(() => null);
  if (!entries) return null;

  for (const e of entries)                                   // files first
    if (e.isFile() && isImage(e.name)) return { filename: e.name, album: relPath };

  for (const e of entries)                                   // then recurse
    if (e.isDirectory()) {
      const found = await findCover(join(absDir, e.name),
        relPath ? \`\${relPath}/\${e.name}\` : e.name, depth + 1);
      if (found) return found;
    }
  return null;
}`}</CodePre>
          <p>
            The response is sent first, then <code>prewarmThumbs</code> fires (§5). This "respond, then warm" ordering
            is the single biggest perceived-performance trick in the app.
          </p>
        </section>

        <hr />

        {/* SECTION 9 — PERFORMANCE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Performance Discipline</h2>
          <p>The app stays fast on albums of hundreds of photos through a handful of compounding choices:</p>
          <table>
            <tbody>
              <tr><th>Technique</th><th>Where</th><th>Why it matters</th></tr>
              <tr><td>Dimensions cached in SQLite</td><td><code>readPhotoMeta</code></td><td>Layout computes instantly; no sharp call on a warm cache</td></tr>
              <tr><td>Thumbnails, not full images, in the grid</td><td><code>PhotoGrid</code></td><td>~50 KB vs ~20 MB per tile</td></tr>
              <tr><td><code>loading="lazy" decoding="async"</code></td><td><code>render.image</code></td><td>Off-screen tiles never fetch or block the main thread</td></tr>
              <tr><td><code>srcSet</code> (thumb + full)</td><td><code>PhotoGrid</code></td><td>Browser picks the right resolution per DPI</td></tr>
              <tr><td>Bounded parallelism (<code>mapLimit</code>)</td><td><code>/api/browse</code></td><td>NAS isn't flooded; tail latency stays sane</td></tr>
              <tr><td>Respond-then-prewarm</td><td><code>/api/browse</code></td><td>Thumbs are often ready before the browser asks</td></tr>
              <tr><td>Long cache headers (1d full / 7d thumb)</td><td>stream routes</td><td>Repeat views are free</td></tr>
              <tr><td>Lightbox <code>preload: 3</code></td><td><code>Lightbox</code></td><td>Paging is instant; only the full image you need loads</td></tr>
            </tbody>
          </table>
          <Note>
            None of these is exotic — the lesson is that image performance is <em>layered</em>. Each tier hides the
            cost of the next: the cache hides sharp, the thumbnail hides the full image, the cache header hides the
            network. Remove one layer and the album feels sluggish even with the others in place.
          </Note>
        </section>

        <hr />

        {/* SECTION 10 — DOCKER */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Dockerizing sharp (libvips)</h2>
          <p>
            sharp ships prebuilt libvips binaries for common platforms, but on <code>node:22-alpine</code> (musl libc)
            the safe path is to install the system <code>vips-dev</code> so sharp links against it. SecretPhoto's
            Dockerfile is the standard three-stage skeleton plus that one extra <code>apk add</code> — see the
            Multi-Stage Dockerfile guide for the full pattern:
          </p>
          <CodePre>{`# deps — native build tools for better-sqlite3 AND libvips for sharp
FROM node:22-alpine AS deps
RUN apk add --no-cache python3 make g++ vips-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# runner — vips runtime libs (not -dev) for the production image
FROM node:22-alpine AS runner
RUN apk add --no-cache vips
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY server.js ./
# photos mounted read-only; thumbs is a writable cache volume
VOLUME ["/photos", "/thumbs"]
ENV PHOTOS_ROOT=/photos THUMBS_DIR=/thumbs
EXPOSE 3008
CMD ["node", "server.js"]`}</CodePre>
          <ul>
            <li><strong>Two volumes:</strong> <code>/photos</code> is the read-only source (bind-mount the NAS or a
              share); <code>/thumbs</code> is a writable named volume so the thumbnail cache survives rebuilds.</li>
            <li><strong><code>vips-dev</code> in deps, <code>vips</code> in runner:</strong> the dev headers are only
              needed to install/link sharp; the runtime image just needs the shared library.</li>
            <li><strong>Env-var roots:</strong> the same <code>PHOTOS_ROOT</code>/<code>THUMBS_DIR</code> knobs from §3
              let the container point at <code>/photos</code> while dev points at a local folder.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — A Mini Masonry Gallery</h2>
          <p>
            Build a self-contained gallery + lightbox in a fresh Vite + React + TS app. We'll fake the backend with a
            static list so you can focus on the two libraries.
          </p>
          <h3>Step 1 — install</h3>
          <CodePre>{`npm create vite@latest mini-gallery -- --template react-ts
cd mini-gallery
npm i react-photo-album yet-another-react-lightbox`}</CodePre>
          <h3>Step 2 — the gallery</h3>
          <CodePre>{`import { useState } from 'react';
import { MasonryPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/masonry.css';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

// Real width/height are required — here from picsum's known sizes
const photos = Array.from({ length: 12 }, (_, i) => {
  const w = 300 + (i % 3) * 120, h = 200 + (i % 4) * 160;
  return { src: \`https://picsum.photos/id/\${i + 10}/\${w}/\${h}\`, width: w, height: h };
});

export default function App() {
  const [index, setIndex] = useState(-1);
  return (
    <>
      <MasonryPhotoAlbum
        photos={photos}
        columns={(w) => (w < 600 ? 2 : w < 960 ? 3 : 4)}
        spacing={6}
        onClick={({ index }) => setIndex(index)}
        render={{ image: (p) => <img {...p} loading="lazy" decoding="async" /> }}
      />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={Math.max(0, index)}
        slides={photos}
        plugins={[Zoom]}
        carousel={{ finite: false, preload: 2 }}
        on={{ view: ({ index: i }) => setIndex(i) }}
      />
    </>
  );
}`}</CodePre>
          <h3>Step 3 — things to try</h3>
          <ul>
            <li>Swap <code>MasonryPhotoAlbum</code> for <code>RowsPhotoAlbum</code> with <code>targetRowHeight=200</code> — watch the layout change.</li>
            <li>Pass <em>wrong</em> width/height for one photo and reload — observe the layout shift. That's why the dimensions cache exists.</li>
            <li>Add a <code>srcSet</code> with a larger source and open DevTools → Network on a zoomed slide.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Cause / Fix</th></tr>
              <tr><td>Portrait photos lay out sideways</td><td>EXIF orientation not handled. Swap w/h for orientation 5–8 when reading metadata, and call <code>sharp().rotate()</code> before resizing thumbs (§4–5).</td></tr>
              <tr><td>Layout jumps as images load</td><td>You passed wrong/missing intrinsic dimensions. react-photo-album needs accurate <code>width</code>/<code>height</code> up front.</td></tr>
              <tr><td><code>Could not load the "sharp" module</code> in Docker</td><td>Alpine/musl mismatch. Install <code>vips-dev</code> at build and <code>vips</code> at runtime; or use a glibc base (<code>node:22-bookworm-slim</code>).</td></tr>
              <tr><td>Thumbnails 404 or 500</td><td>Source unreadable (NAS down / permissions) or <code>THUMBS_DIR</code> not writable. Check <code>/api/health</code> → <code>photos_root_ok</code>.</td></tr>
              <tr><td>Browse is slow on huge folders</td><td>Cold dimensions cache — first visit pays the sharp cost. Subsequent visits hit SQLite. Raise/lower the <code>mapLimit</code> caps to match the NAS.</td></tr>
              <tr><td>Path-traversal attempts in logs</td><td>Working as intended — <code>safeJoin</code> returns <code>null</code> and the route 400s. Don't relax the <code>startsWith(root + sep)</code> check.</td></tr>
              <tr><td>Images blocked in dev</td><td>Frontend and API on different origins. Either proxy <code>/api</code> in <code>vite.config.ts</code> or keep <code>app.use(cors())</code> on the server.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>
          <table>
            <tbody>
              <tr><th>Need</th><th>Reach for</th></tr>
              <tr><td>Justified rows of mixed-ratio photos</td><td><code>RowsPhotoAlbum</code> + <code>targetRowHeight</code></td></tr>
              <tr><td>Pinterest columns / waterfall</td><td><code>ColumnsPhotoAlbum</code> / <code>MasonryPhotoAlbum</code></td></tr>
              <tr><td>Full-screen viewer with zoom</td><td><code>yet-another-react-lightbox</code> + <code>Zoom</code> plugin</td></tr>
              <tr><td>Fast thumbnails in Node</td><td><code>sharp(src).rotate().resize(600,600,{'{'} fit:'inside' {'}'}).jpeg({'{'} mozjpeg:true {'}'})</code></td></tr>
              <tr><td>Read dimensions without decoding</td><td><code>sharp(src).metadata()</code> (mind orientation 5–8)</td></tr>
              <tr><td>Avoid layout shift</td><td>Cache intrinsic <code>width</code>/<code>height</code> (SQLite, keyed by mtime)</td></tr>
              <tr><td>Stream large files</td><td><code>createReadStream(path).pipe(res)</code> + <code>Content-Length</code></td></tr>
              <tr><td>Block path traversal</td><td><code>resolve()</code> then <code>startsWith(root + sep)</code></td></tr>
              <tr><td>Don't flood a NAS</td><td>Bounded parallelism — a <code>mapLimit(items, N, fn)</code> helper</td></tr>
              <tr><td>Warm caches without blocking</td><td>Send the response, <em>then</em> fire-and-forget the work</td></tr>
              <tr><td>sharp on Alpine</td><td><code>apk add vips-dev</code> (build) + <code>vips</code> (runtime)</td></tr>
            </tbody>
          </table>
          <p className="finished-marker">★ SecretPhoto — a read-only NAS viewer that feels instant because every tier caches the one below it.</p>
        </section>
      </main>
    </div>
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
