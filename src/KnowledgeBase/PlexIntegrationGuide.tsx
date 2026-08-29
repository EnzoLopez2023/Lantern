import { useRef, useState } from 'react';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'The undici TLS Bypass',            icon: '🔓' },
  { id: 's3',  num: '3',  title: 'plexJSON / plexFetch / plexText',  icon: '📡' },
  { id: 's4',  num: '4',  title: 'Library Sections + Sweep',         icon: '📚' },
  { id: 's5',  num: '5',  title: 'Same-File Collapse (Path Dedup)',  icon: '🪢' },
  { id: 's6',  num: '6',  title: 'Resolution-Aware Grouping',        icon: '📺' },
  { id: 's7',  num: '7',  title: '3D Detection by Path',             icon: '🎞️' },
  { id: 's8',  num: '8',  title: 'Quality Scoring',                  icon: '🏆' },
  { id: 's9',  num: '9',  title: 'Six-Step Delete Guards',           icon: '🛡️' },
  { id: 's10', num: '10', title: 'The Audit Log',                    icon: '📋' },
  { id: 's11', num: '★',  title: 'Lab: Build a Mini Plex Tool',      icon: '🛠️' },
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

export default function PlexIntegrationGuide() {
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
            <span className="sidebar-title">Plex Integration</span>
          </div>
          <div className="sidebar-sub">Hearth's biggest feature</div>
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
          <div className="hero-tag">🎬 Plex Media Server · undici 7 · 2026</div>
          <h1>Plex Media Server<br />Integration</h1>
          <p>
            Hearth's largest backend feature: <strong style={{ color: '#C77AA0' }}>cross-library duplicate detection
            and safe deletion</strong> against a local Plex server. The integration handles self-signed TLS via an
            <code>undici</code> dispatcher, sweeps every library section, collapses same-file references, groups by
            resolution + 3D, scores quality, recommends a keeper, and applies six server-side guards before any
            destructive call — with an immutable audit log of every attempt.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">6</span><span className="hero-stat-label">Delete Guards</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Helper Fns</span></div>
            <div className="hero-stat"><span className="hero-stat-val">24</span><span className="hero-stat-label">Audit Cols</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Lost Files (Audited)</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Plex Media Server runs on the user's home network, exposes a REST API at <code>https://&lt;host&gt;:32400</code>,
            and serves a personal media library to authorized devices. Hearth talks to it from Azure App Service via
            outbound HTTPS, authenticates with a long-lived <code>X-Plex-Token</code>, and does <em>read AND destructive
            write</em> operations — so every destructive call needs to be paranoid.
          </p>

          <h3>Why this is a hard problem</h3>
          <ul>
            <li><strong>Plex's TLS cert is self-signed on the LAN.</strong> Node's default fetch rejects it. You need an undici dispatcher that bypasses cert verification (acceptable on a trusted LAN; not on the public internet).</li>
            <li><strong>Overlapping library sections.</strong> The user has scanned the parent folder <em>and</em> child folders. The same physical file appears under multiple "library" identifiers. You can't count duplicates by counting metadata records.</li>
            <li><strong>Plex's "multi-version" feature.</strong> One metadata record can contain N <code>Media</code> entries (different file variants of the same movie). Naive code that reads <code>Media[0]</code> silently ignores versions 2+.</li>
            <li><strong>4K and 1080p of the same movie are NOT duplicates.</strong> They're legitimate separate editions. The dedupe key has to know about resolution.</li>
            <li><strong>3D editions are NOT duplicates of 2D.</strong> Plex doesn't surface a reliable 3D flag. Hearth detects by filename.</li>
            <li><strong>Some "duplicates" are samples or trailers.</strong> Plex sometimes indexes a 2-minute Sample.mkv alongside a 2-hour movie. The scorer needs to recognize this.</li>
            <li><strong>Once you delete, you can't undo.</strong> A bad delete = lost media. Every safeguard matters.</li>
          </ul>

          <h3>Two analogies</h3>
          <p>
            <strong>The post office sorting facility.</strong> Mail comes in from many trucks; the same package can be
            labeled multiple ways. The sorter has to detect duplicates by physical attributes (size, weight, address) —
            not by the labels alone. Hearth's "same-file collapse by path" is the same idea.
          </p>
          <p>
            <strong>The surgical safety checklist.</strong> Before a surgeon cuts, six things get verified independently:
            patient name, procedure, side of body, allergies, equipment, blood type. Hearth's delete has six checks for
            the same reason — when the action is irreversible, redundancy is correct.
          </p>

          <h3>What Hearth's Plex integration does</h3>
          <ol>
            <li><strong>Scan</strong>: fetch every metadata record from every movie library section.</li>
            <li><strong>Collapse</strong>: dedupe references to the same physical file across sections + multi-version entries.</li>
            <li><strong>Group</strong>: cluster by <code>guid + title + year + resolution + is3D</code>.</li>
            <li><strong>Filter</strong>: only groups with 2+ copies are duplicates.</li>
            <li><strong>Score</strong>: rank each copy by resolution / bitrate / codec / audio / HDR / sample-detection.</li>
            <li><strong>Recommend</strong>: keeper = highest score (if leader vs second is &gt;5%). Otherwise: manual review.</li>
            <li><strong>UI presents</strong>: groups with keeper highlighted + delete targets flagged.</li>
            <li><strong>Delete</strong>: six server-side guards + audit log row before sending the destructive call to Plex.</li>
          </ol>

          <h3>The four endpoints</h3>
          <table>
            <tbody>
              <tr><th>Endpoint</th><th>Purpose</th></tr>
              <tr><td><code>GET /api/plex/duplicates/scan</code></td><td>Run the full sweep, return duplicate groups</td></tr>
              <tr><td><code>POST /api/plex/duplicates/delete</code></td><td>Type-DELETE-to-confirm delete one file</td></tr>
              <tr><td><code>GET /api/plex/duplicates/audit</code></td><td>Return the action log</td></tr>
              <tr><td><code>GET /api/plex/duplicates/server-config</code></td><td>Check that allowMediaDeletion is enabled</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 2 — UNDICI */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>The undici TLS Bypass</h2>
          <p>
            Plex on the home LAN ships with a self-signed cert. Node's default <code>fetch</code> rejects it
            (<code>UNABLE_TO_VERIFY_LEAF_SIGNATURE</code>). The fix: a custom undici <code>Agent</code> that disables
            certificate verification — only used on Plex calls, never anywhere else.
          </p>

          <h3>The full Plex helper module</h3>
          <CodePre>{`// SecretApp/lib/plex.js — verbatim
// Plex configuration, an undici Dispatcher that bypasses TLS verification,
// and shared fetch helpers. Most home Plex servers run with a self-signed
// cert on the LAN; the dispatcher is the native-fetch equivalent of
// node-fetch's \`agent: { rejectUnauthorized: false }\`. If the app ever
// talks to Plex over an untrusted network, revisit.

import { Agent } from 'undici'

export const plexConfig = {
  baseUrl:        process.env.PLEX_BASE_URL || 'https://localhost:32400',
  token:          process.env.PLEX_TOKEN,
  librarySection: process.env.PLEX_LIBRARY_SECTION || '9',
}

export const plexDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
})

// Thrown on any non-2xx Plex response. Carries status + path so callers can
// build user-facing messages without re-parsing the error text.
export class PlexAPIError extends Error {
  constructor(status, path) {
    super(\`Plex request to \${path} failed with status \${status}\`)
    this.name = 'PlexAPIError'
    this.status = status
    this.path = path
  }
}`}</CodePre>

          <h3>Why the bypass is OK here</h3>
          <ul>
            <li>Plex is on the LAN. Traffic to it doesn't cross the public internet.</li>
            <li>The connection uses a stable token (PLEX_TOKEN) for authentication — not the TLS cert.</li>
            <li>The threat (MITM on the LAN) requires the attacker to already be inside the user's home network. At that point, much worse things are already possible.</li>
            <li>Plex's auth model is "token = trust"; the cert is decorative.</li>
          </ul>

          <h3>The dispatcher</h3>
          <CodePre>{`export const plexDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
})`}</CodePre>

          <p>
            An undici <code>Agent</code> with one option: don't reject self-signed certs. The dispatcher is exported as
            a singleton; every Plex fetch in the codebase passes it explicitly:
          </p>

          <CodePre>{`fetch(url, { dispatcher: plexDispatcher })`}</CodePre>

          <h3>The scope of the bypass</h3>
          <p>
            <strong>Only Plex calls use this dispatcher.</strong> The default global dispatcher (used by every other
            fetch in Hearth — Azure OpenAI, Tautulli, OMDb) still validates certs. The bypass is localized;
            <code>setGlobalDispatcher</code> is NOT used.
          </p>

          <h3>Anti-patterns this avoids</h3>
          <table>
            <tbody>
              <tr><th>Bad pattern</th><th>Why bad</th></tr>
              <tr><td><code>NODE_TLS_REJECT_UNAUTHORIZED=0</code> env var</td><td>Disables cert validation app-wide. Every fetch (Azure, Anthropic, etc.) is now MITM-vulnerable.</td></tr>
              <tr><td><code>setGlobalDispatcher(insecureAgent)</code></td><td>Same problem — global state.</td></tr>
              <tr><td>Custom <code>https.Agent</code> on every fetch</td><td>Verbose; easy to forget.</td></tr>
              <tr><td>Trust the cert in code (<code>ca: ...</code>)</td><td>Brittle when the user reissues the cert.</td></tr>
            </tbody>
          </table>

          <h3>The custom <code>Agent</code> options</h3>
          <CodePre>{`new Agent({
  connect: {
    rejectUnauthorized: false,    // ← the bypass
    // Could also: ca: caString, servername: 'plex.example.com'
  },
  // Optional tuning:
  keepAliveTimeout: 60_000,
  keepAliveMaxTimeout: 600_000,
  connections: 10,
})`}</CodePre>

          <p>Hearth uses just the bypass. The defaults for the rest are fine for the Plex call volume.</p>

          <h3>The error class</h3>
          <CodePre>{`export class PlexAPIError extends Error {
  constructor(status, path) {
    super(\`Plex request to \${path} failed with status \${status}\`)
    this.name = 'PlexAPIError'
    this.status = status
    this.path = path
  }
}`}</CodePre>

          <p>Standard pattern — extend Error, carry the status + path as instance properties. Callers can <code>instanceof PlexAPIError</code> to distinguish from network errors and build user-facing messages without re-parsing.</p>
        </section>

        <hr />

        {/* SECTION 3 — HELPERS */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span><code>plexJSON</code> / <code>plexFetch</code> / <code>plexText</code></h2>
          <p>Three helpers cover every Plex call in the codebase. All three pass the dispatcher + token + correct Accept header.</p>

          <h3><code>plexFetch</code> — the low-level helper</h3>
          <CodePre>{`// SecretApp/lib/plex.js — verbatim
export async function plexFetch(path, options = {}) {
  const { method = 'GET', formData, accept = 'json' } = options
  const separator = path.includes('?') ? '&' : '?'
  const url = \`\${plexConfig.baseUrl}\${path}\${separator}X-Plex-Token=\${plexConfig.token}\`

  const init = {
    method,
    headers: { Accept: accept === 'xml' ? 'application/xml' : 'application/json' },
    dispatcher: plexDispatcher,
  }
  if (formData) {
    init.body = new URLSearchParams(formData)
    init.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  return fetch(url, init)
}`}</CodePre>

          <h3>The URL construction trick</h3>
          <p>Plex's <code>X-Plex-Token</code> goes in the query string (it also accepts an <code>X-Plex-Token</code> header, but the query-string form works universally and is what every Plex SDK uses). The separator logic handles whether the path already has a <code>?</code>:</p>
          <CodePre>{`const separator = path.includes('?') ? '&' : '?'
// '/library/sections'        → /library/sections?X-Plex-Token=...
// '/playlists/123?type=video' → /playlists/123?type=video&X-Plex-Token=...`}</CodePre>

          <h3><code>plexJSON</code> — fetch + parse JSON</h3>
          <CodePre>{`export async function plexJSON(path, options = {}) {
  const response = await plexFetch(path, options)
  if (!response.ok) throw new PlexAPIError(response.status, path)
  return response.json()
}`}</CodePre>

          <h3><code>plexText</code> — for XML endpoints</h3>
          <CodePre>{`export async function plexText(path, options = {}) {
  const response = await plexFetch(path, { accept: 'xml', ...options })
  if (!response.ok) throw new PlexAPIError(response.status, path)
  return response.text()
}`}</CodePre>

          <p>Some Plex endpoints (playlist creation, search, verify) return XML by default. <code>plexText</code> requests XML and returns the raw body.</p>

          <h3>Common usage patterns</h3>
          <CodePre>{`// Read library sections
const { MediaContainer } = await plexJSON('/library/sections')
const sections = MediaContainer.Directory ?? []

// Read all movies in a section
const { MediaContainer: mc } = await plexJSON(\`/library/sections/\${sectionId}/all\`)
const movies = mc.Metadata ?? []

// Delete a file (destructive!)
await plexFetch(\`/library/parts/\${partId}?... &deleteMedia=true\`, { method: 'DELETE' })

// Create a playlist (XML response)
const xml = await plexText(\`/playlists?type=video&title=My Playlist&...\`, { method: 'POST' })`}</CodePre>

          <h3>Why three helpers and not one</h3>
          <ul>
            <li><code>plexJSON</code> covers ~80% of calls (everything that returns JSON).</li>
            <li><code>plexText</code> for XML-only endpoints (playlist mutations).</li>
            <li><code>plexFetch</code> for special cases — streaming, custom headers, DELETE with no body. The <code>fetch</code>-shaped escape hatch.</li>
          </ul>

          <p>Wrapping at three layers gives most callers the convenient parse; complex callers drop to <code>plexFetch</code> when needed.</p>
        </section>

        <hr />

        {/* SECTION 4 — SCAN */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Library Sections + the Sweep</h2>
          <p>The scan endpoint walks every movie library section, pulls every metadata record, and feeds them into the dedupe pipeline.</p>

          <h3>Find the movie sections</h3>
          <CodePre>{`// Pattern: routes/plex-duplicates.js
const { MediaContainer } = await plexJSON('/library/sections')
const sections = (MediaContainer.Directory ?? []).filter(d => d.type === 'movie')`}</CodePre>

          <p>A Plex server's library has multiple <strong>sections</strong> (the user's named libraries — "Movies", "Kids Movies", "ALL Movies"). Each section has a <code>type</code> (<code>movie</code> | <code>show</code> | <code>music</code> | etc.) and a <code>key</code> (numeric ID). We only care about movie sections.</p>

          <h3>Fetch each section in parallel</h3>
          <CodePre>{`// SecretApp/routes/plex-duplicates.js — pattern (verbatim style)
const sectionResults = await Promise.all(sections.map(async section => {
  try {
    const data = await plexJSON(\`/library/sections/\${section.key}/all\`)
    const metadata = data?.MediaContainer?.Metadata ?? []
    return { section, metadata }
  } catch (err) {
    console.error(\`Scan: failed to read section \${section.key} (\${section.title}):\`, err)
    return { section, metadata: [] }
  }
}))`}</CodePre>

          <p>Parallel fetch — every section in flight at once. The <code>try/catch</code> per section prevents one broken section from failing the whole scan. A failed section returns an empty array; the dedupe step skips it.</p>

          <h3>The metadata shape</h3>
          <p>Each item in the array is a movie's metadata. Important fields:</p>
          <CodePre>{`{
  "ratingKey": "47281",                 // Plex's internal ID
  "guid":      "plex://movie/5d77686385ac8b001f3ab19f",  // canonical movie ID
  "title":     "The Matrix",
  "year":      1999,
  "duration":  8160000,                  // ms
  "Media": [                              // array of versions
    {
      "id":              "9001",          // media ID — used for DELETE
      "videoResolution": "4k",            // 4k | 1080 | 720 | sd
      "videoCodec":      "hevc",
      "audioCodec":      "ac3",
      "audioChannels":   6,
      "bitrate":         17500,
      "duration":        8160000,
      "Part": [
        {
          "id":   "10001",                // part ID — what you actually delete
          "file": "P:\\\\Movies\\\\The Matrix (1999)\\\\Matrix.mkv",
          "size": 17_000_000_000,
          // ...
        }
      ]
    }
  ]
}`}</CodePre>

          <p>Hearth's scanner walks every Media in every metadata, and every Part in every Media — the nested arrays matter. Naive <code>m.Media[0].Part[0]</code> code misses multi-version entries.</p>

          <h3>Why iterate every Media + every Part</h3>
          <CodePre>{`for (const { section, metadata } of sectionResults) {
  totalMoviesScanned += metadata.length
  for (const m of metadata) {
    if (!m.title) continue
    const mediaArr = m.Media || []
    for (const media of mediaArr) {        // ← every Media
      const parts = media.Part || []
      for (const part of parts) {          // ← every Part
        if (!part?.file) continue
        // ... index this file ...
      }
    }
  }
}`}</CodePre>

          <p>One metadata record can have N Media entries (different versions stored separately). Each Media has at least one Part. Iterating just <code>Media[0].Part[0]</code> would silently miss the second-through-Nth versions.</p>
        </section>

        <hr />

        {/* SECTION 5 — COLLAPSE */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Same-File Collapse (Path Dedup)</h2>
          <p>
            The user's libraries scan overlapping folders — "ALL Movies" scans the parent of "Movies" and "Kids
            Movies". So the same physical file shows up under multiple library section IDs. Hearth's first dedup pass:
            collapse references to the same file path.
          </p>

          <h3>The two sources of file duplication</h3>
          <ol>
            <li><strong>Nested library setups</strong>: "Kids Movies" scans <code>P:\Movies\_Kids Movies\</code> while "Movies" scans the parent <code>P:\Movies\</code>. The same physical file is returned once per section that scans it.</li>
            <li><strong>Plex's "multiple versions" feature</strong>: one metadata record contains N Media entries pointing at different files for the same movie. You MUST iterate every Media + every Part, not just <code>Media[0]</code>.</li>
          </ol>

          <h3>The fileMap data structure</h3>
          <CodePre>{`const fileMap = new Map()  // normPath → { metadata, media, part, ratingKeys[], mediaIds[], libraryIds[], libraryTitles[] }

for (const { section, metadata } of sectionResults) {
  for (const m of metadata) {
    for (const media of (m.Media || [])) {
      for (const part of (media.Part || [])) {
        if (!part?.file) continue

        const pathKey = normalisePath(part.file)
        if (!fileMap.has(pathKey)) {
          fileMap.set(pathKey, {
            metadata:      m,
            media,           // specific Media — used for its specs (resolution, bitrate, codec…)
            part,            // specific Part — used for file path + size
            ratingKeys:    [String(m.ratingKey)],
            mediaIds:      media?.id != null ? [String(media.id)] : [],
            libraryIds:    [String(section.key)],
            libraryTitles: [section.title],
          })
        } else {
          const entry = fileMap.get(pathKey)
          if (!entry.ratingKeys.includes(String(m.ratingKey))) {
            entry.ratingKeys.push(String(m.ratingKey))
          }
          const midStr = media?.id != null ? String(media.id) : null
          if (midStr && !entry.mediaIds.includes(midStr)) {
            entry.mediaIds.push(midStr)
          }
          if (!entry.libraryIds.includes(String(section.key))) {
            entry.libraryIds.push(String(section.key))
            entry.libraryTitles.push(section.title)
          }
        }
      }
    }
  }
}`}</CodePre>

          <h3>The path normalization</h3>
          <CodePre>{`function normalisePath(p) {
  return String(p || '').trim().toLowerCase()
}`}</CodePre>

          <p>
            Windows paths are case-insensitive, so <code>P:\Movies\Matrix.mkv</code> and <code>p:\movies\matrix.mkv</code>
            should collapse. Lowercase + trim is a safe collapse key. Hearth's comment in source:
            <em>"the user's libraries scan overlapping folders so the same file shows up under multiple sections with
            the exact same path string. Lowercase + trim is a safe collapse key."</em>
          </p>

          <h3>What gets aggregated</h3>
          <p>For a file that appears under 3 library sections:</p>
          <CodePre>{`{
  metadata: { title: 'The Matrix', year: 1999, ... },
  media:    { videoResolution: '4k', ... },
  part:     { file: 'P:\\\\Movies\\\\Matrix.mkv', size: 17e9 },
  ratingKeys:    ['47281', '47282', '47283'],   // 3 distinct ratingKeys
  mediaIds:      ['9001', '9002', '9003'],       // 3 media IDs
  libraryIds:    ['1', '5', '7'],                // 3 sections
  libraryTitles: ['Movies', 'Kids Movies', 'ALL Movies'],
}`}</CodePre>

          <p>One file, three ratingKeys, three libraries — but Hearth presents this as a single Copy in the dedup view. The libraryTitles array is shown in the UI: "this copy is referenced in Movies, Kids Movies, ALL Movies."</p>

          <h3>Why metadata is captured</h3>
          <p>The same physical file's metadata might differ between sections (slight title variations from how Plex matched). Hearth picks the FIRST metadata it sees (effectively first-section-wins) and ignores discrepancies. The file IS the file; the metadata is best-effort.</p>
        </section>

        <hr />

        {/* SECTION 6 — RESOLUTION */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Resolution-Aware Grouping</h2>
          <p>
            Hearth's dedupe key includes resolution. A 4K and a 1080p of the same movie are NOT duplicates — they're
            legitimately separate editions the user kept on purpose. Only same-resolution copies of the same movie
            get flagged.
          </p>

          <h3>The resolution canonicalizer</h3>
          <CodePre>{`// SecretApp/routes/plex-duplicates.js — verbatim
// Plex's \`videoResolution\` can be "4k", "1080", "720", "480", "sd", or
// occasionally empty. We canonicalise so that the dedupe key never confuses
// e.g. "" vs "sd". A 4K and a 1080p copy of the same movie are NOT
// duplicates of each other, so this value goes into the dedupe key.
function normaliseResolution(r) {
  const lc = String(r || '').toLowerCase()
  if (lc === '4k' || lc === '2160')        return '4k'
  if (lc === '1080')                       return '1080'
  if (lc === '720')                        return '720'
  if (lc === '480' || lc === 'sd' || lc === '576') return 'sd'
  return lc || 'unknown'
}`}</CodePre>

          <p>Plex emits inconsistent strings — Hearth normalizes them to a known set: <code>4k | 1080 | 720 | sd | unknown</code>.</p>

          <h3>The grouping key</h3>
          <CodePre>{`for (const entry of fileMap.values()) {
  const m     = entry.metadata
  const guid  = m.guid || null
  const title = m.title
  const year  = m.year
  const res   = normaliseResolution(entry.media?.videoResolution)
  const copy  = buildCopyRecord(entry)
  const editionSuffix = copy.is3D ? '|3d' : ''

  if (guid) {
    const key = \`\${guid}|\${normaliseTitle(title)}|\${year || ''}|\${res}\${editionSuffix}\`
    if (!groups.has(key)) {
      groups.set(key, { key, title, year: year || null, guid, resolution: res, is3D: copy.is3D, copies: [] })
    }
    groups.get(key).copies.push(copy)
  } else {
    // Unmatched (no Plex GUID) — fall back to title+year+res key
    const key = \`\${normaliseTitle(title)}|\${year || ''}|\${res}\${editionSuffix}\`
    // ... separate "unmatched" map ...
  }
}`}</CodePre>

          <p>Each component of the key matters:</p>
          <table>
            <tbody>
              <tr><th>Component</th><th>Why</th></tr>
              <tr><td><code>guid</code></td><td>Plex's canonical identifier — same movie across all sources has the same guid</td></tr>
              <tr><td><code>title</code></td><td>Belt-and-braces in case of guid collisions (rare)</td></tr>
              <tr><td><code>year</code></td><td>Disambiguates remakes (Total Recall 1990 vs 2012)</td></tr>
              <tr><td><code>resolution</code></td><td>4K and 1080p are legitimately different</td></tr>
              <tr><td><code>is3D</code></td><td>3D and 2D are legitimately different (see §7)</td></tr>
            </tbody>
          </table>

          <h3>The unmatched bucket</h3>
          <p>If Plex didn't match the file to a movie (no GUID), Hearth puts it in a separate "unmatched" bucket. These can still be duplicates of each other (same title, year, res), but they can't be confidently linked to other parts of the user's library.</p>

          <h3>What counts as a duplicate</h3>
          <CodePre>{`for (const group of groups.values()) {
  if (group.copies.length < 2) continue   // ← single-copy groups are NOT duplicates
  // ... rank, score, recommend keeper ...
}`}</CodePre>

          <p>A group with one copy is fine. A group with 2+ same-resolution-same-movie copies is what we flag.</p>

          <h3>Why title normalization too</h3>
          <CodePre>{`function normaliseTitle(t) {
  return String(t || '').trim().toLowerCase()
}`}</CodePre>

          <p>Belt-and-braces: even with the same guid, Plex sometimes renders title slightly differently across sections ("The Matrix" vs "Matrix, The"). The lowercase+trim doesn't fix this, but it stops trivial case mismatches.</p>
        </section>

        <hr />

        {/* SECTION 7 — 3D DETECTION */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>3D Detection by Path</h2>
          <p>
            Plex doesn't reliably surface a 3D flag in basic metadata. Hearth detects 3D by looking for the literal
            token <code>3D</code> in the file path — anchored on word boundaries so <code>FX3D</code>, <code>M3D</code>,
            <code>3DStudio</code> don't false-positive.
          </p>

          <h3>The detector</h3>
          <CodePre>{`// SecretApp/routes/plex-duplicates.js — verbatim
// 3D editions are not duplicates of their 2D counterparts even at the same
// resolution. Plex doesn't expose a reliable 3D flag in the basic metadata
// response, so we detect it by file path: a "3D" token anywhere in the
// path (folder name or filename) marks the file as 3D. \\b anchors on word
// boundaries, so "FX3D" / "M3D" / "3DStudio" don't false-positive.
function detectThreeD(filePath) {
  return /\\b3D\\b/i.test(String(filePath || ''))
}`}</CodePre>

          <h3>What <code>\b3D\b</code> matches and doesn't</h3>
          <table>
            <tbody>
              <tr><th>Path</th><th>Match?</th><th>Why</th></tr>
              <tr><td><code>P:\Movies\Avatar 3D\Avatar.mkv</code></td><td>Yes</td><td><code>\b3D\b</code> finds 3D between two word boundaries</td></tr>
              <tr><td><code>P:\Movies\Avatar (3D).mkv</code></td><td>Yes</td><td>Parens act as word boundaries</td></tr>
              <tr><td><code>P:\Movies\Avatar.3D.1080p.mkv</code></td><td>Yes</td><td>Dots act as word boundaries</td></tr>
              <tr><td><code>P:\Movies\FX3D\Movie.mkv</code></td><td>No</td><td>3D is not between word boundaries — "FX3D" is one word</td></tr>
              <tr><td><code>P:\Movies\3DStudio\Movie.mkv</code></td><td>No</td><td>Same — "3DStudio" is one word</td></tr>
              <tr><td><code>P:\Movies\M3D\Movie.mkv</code></td><td>No</td><td>Same</td></tr>
            </tbody>
          </table>

          <h3>Why path-based</h3>
          <p>
            Plex DOES include a <code>media.optimizedForStreaming</code> and similar flags in some response shapes, but
            nothing reliable for 3D specifically. The path-based heuristic works because users (or scanners like
            Radarr/Sonarr) typically include "3D" in the folder/filename for 3D rips. False positives (3D in the path
            but not actually 3D) are rare and harmless — the file just gets placed in its own group.
          </p>

          <h3>The edition suffix</h3>
          <CodePre>{`const editionSuffix = copy.is3D ? '|3d' : ''
const key = \`\${guid}|\${title}|\${year}|\${res}\${editionSuffix}\``}</CodePre>

          <p>3D copies get <code>|3d</code> appended to their group key. So:</p>
          <ul>
            <li><code>plex://...|matrix|1999|1080p</code> (the 2D 1080p group)</li>
            <li><code>plex://...|matrix|1999|1080p|3d</code> (the 3D 1080p group)</li>
          </ul>

          <p>They're separate groups; they don't interfere.</p>

          <h3>The buildCopyRecord call</h3>
          <CodePre>{`// pattern in routes/plex-duplicates.js
function buildCopyRecord(entry) {
  const copy = {
    ratingKey:      entry.ratingKeys[0],
    mediaId:        entry.mediaIds[0] ?? null,
    filePath:       entry.part.file,
    fileSize:       Number(entry.part.size) || 0,
    duration:       Number(entry.media?.duration) || 0,
    bitrate:        Number(entry.media?.bitrate) || 0,
    videoResolution: entry.media?.videoResolution || null,
    videoCodec:     entry.media?.videoCodec || null,
    audioCodec:     entry.media?.audioCodec || null,
    audioChannels:  Number(entry.media?.audioChannels) || 0,
    libraryTitles:  entry.libraryTitles,
    is3D:           detectThreeD(entry.part.file),
    // qualityScore + reasons populated later in §8
  }
  return copy
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 8 — SCORING */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Quality Scoring</h2>
          <p>When a group has 2+ copies, Hearth scores each one to recommend a keeper. Score = sum of bonuses for resolution, bitrate, codec, audio, HDR. Negative penalty for short runtime (sample/trailer detection).</p>

          <h3>The scoring function</h3>
          <CodePre>{`// SecretApp/routes/plex-duplicates.js — verbatim
const RESOLUTION_TIER = { '4k': 4, '1080': 3, '720': 2, '480': 1, 'sd': 1 }
const CODEC_BONUS     = { hevc: 500, h265: 500, h264: 200, mpeg4: 100 }

function scoreCopy(media) {
  const reasons = []
  let score = 0

  const resKey = String(media.videoResolution || '').toLowerCase()
  const tier = RESOLUTION_TIER[resKey] ?? 0
  if (tier > 0) {
    const pts = tier * 10000
    score += pts
    reasons.push(\`Resolution \${media.videoResolution} (+\${pts})\`)
  }

  const bitrate = Number(media.bitrate) || 0
  if (bitrate > 0) {
    score += bitrate
    reasons.push(\`Bitrate \${bitrate} kbps (+\${bitrate})\`)
  }

  const codec = String(media.videoCodec || '').toLowerCase()
  const codecBonus = CODEC_BONUS[codec] || 0
  if (codecBonus > 0) {
    score += codecBonus
    reasons.push(\`Video codec \${media.videoCodec} (+\${codecBonus})\`)
  }

  const channels = Number(media.audioChannels) || 0
  if (channels > 0) {
    const pts = channels * 50
    score += pts
    reasons.push(\`Audio \${channels}ch (+\${pts})\`)
  }

  // HDR / Dolby Vision flags (when Plex surfaces them on the Stream array)
  const streams = media?.Part?.[0]?.Stream || []
  const hasHDR = streams.some(s => s.DOVIPresent || /hdr|dolby vision/i.test(s.colorTrc || s.colorPrimaries || s.displayTitle || ''))
  if (hasHDR) {
    score += 2000
    reasons.push('HDR / Dolby Vision (+2000)')
  }

  return { score, reasons }
}`}</CodePre>

          <h3>What each component contributes</h3>
          <table>
            <tbody>
              <tr><th>Component</th><th>Range</th><th>Why</th></tr>
              <tr><td>Resolution tier</td><td>10,000 (sd) – 40,000 (4k)</td><td>Dominant factor — 4K beats everything</td></tr>
              <tr><td>Bitrate</td><td>varies (kbps, raw)</td><td>Tiebreaker within same resolution</td></tr>
              <tr><td>Codec bonus</td><td>100 – 500</td><td>HEVC &gt; H.264 &gt; MPEG-4 — newer codecs encode the same content more efficiently</td></tr>
              <tr><td>Audio channels</td><td>50–350 (mono→7.1)</td><td>5.1/7.1 &gt; stereo for movies</td></tr>
              <tr><td>HDR flag</td><td>+2000</td><td>HDR is a significant quality bump</td></tr>
              <tr><td>Short-runtime penalty</td><td>-1,000,000</td><td>Crushing — ensures samples/trailers can never beat real movies</td></tr>
            </tbody>
          </table>

          <h3>The sample-detection penalty</h3>
          <CodePre>{`// Group-level duration sanity check: if any copy's runtime is less
// than 30% of the longest copy in the group, it's almost certainly a
// sample, trailer, or extras clip — not the actual movie. Apply a
// crushing score penalty so it never beats the real movie as keeper.
// (Real-world example: Plex sometimes indexes a 2-minute Sample.mkv
// alongside the 2-hour movie under the same metadata. The sample's
// reported bitrate is often higher, which previously tricked the
// scorer into promoting it.)
const maxDuration = Math.max(...group.copies.map(c => c.duration || 0))
if (maxDuration > 0) {
  for (const c of group.copies) {
    if (c.duration > 0 && c.duration < maxDuration * 0.3) {
      const pct = Math.round((c.duration / maxDuration) * 100)
      c.qualityScore -= 1_000_000
      c.qualityReasons.push(\`Short runtime — \${pct}% of longest copy, likely sample/trailer (-1000000)\`)
    }
  }
}`}</CodePre>

          <p>The comment is the postmortem from a real bug — early versions of the scorer promoted a sample file over the actual movie because the sample's bitrate looked higher (because it was a fixed-bitrate trailer encode vs the average-bitrate movie). The penalty fixes it.</p>

          <h3>The within-5% rule</h3>
          <CodePre>{`group.copies.sort((a, b) => b.qualityScore - a.qualityScore)
const top    = group.copies[0]
const second = group.copies[1]

// Within-5% rule: if top and second are too close, manual review.
const topScore = Math.max(top.qualityScore, 1)
const spread   = (topScore - second.qualityScore) / topScore
const manualReviewRequired = spread < 0.05

if (manualReviewRequired) {
  // Don't recommend anything.
} else {
  top.isKeeper = true
  for (let i = 1; i < group.copies.length; i++) {
    group.copies[i].isDeleteTarget = true
  }
}`}</CodePre>

          <p>If the top copy beats the second copy by less than 5%, Hearth marks the group as "manual review" — doesn't recommend a keeper. The user sees the group but the auto-delete recommendation is suppressed.</p>

          <h3>The reasons array</h3>
          <p>
            Every score component appends to a <code>reasons</code> array. The UI shows the reasons next to each copy
            so the user can see why the keeper was chosen: <em>"Resolution 4k (+40000), Bitrate 17500 kbps (+17500),
            Video codec hevc (+500), Audio 6ch (+300), HDR / Dolby Vision (+2000)"</em>.
          </p>
          <p>The transparency builds trust. "Why did it pick THAT copy?" is answered in the UI.</p>
        </section>

        <hr />

        {/* SECTION 9 — DELETE GUARDS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>The Six Server-Side Delete Guards</h2>
          <p>Before any DELETE call to Plex, Hearth performs six independent re-verifications. The principle: trust nothing the client sends, re-read everything from Plex at delete time.</p>

          <h3>The six guards, in order</h3>
          <ol>
            <li><strong>Type DELETE to confirm</strong> (UI guard, not server, but the first line)</li>
            <li><strong>Re-fetch the target metadata</strong> from Plex — fresh, not from any cache</li>
            <li><strong>Re-verify GUID + title + year</strong> match what the client said</li>
            <li><strong>Re-verify file path</strong> matches exactly</li>
            <li><strong>Confirm the keeper still exists</strong> — we're not deleting the last copy</li>
            <li><strong>Check <code>allowMediaDeletion</code></strong> on the Plex root — feature must be enabled server-side</li>
          </ol>

          <p>If any guard fails, the delete is refused, a <code>verify_failed</code> row is logged, and the user gets a clear error.</p>

          <h3>The delete handler (pattern)</h3>
          <CodePre>{`// SecretApp/routes/plex-duplicates.js — pattern
router.post('/api/plex/duplicates/delete', async (req, res) => {
  const {
    ratingKey,       // metadata rating key
    mediaId,         // specific Media ID to delete
    filePath,        // file path (for verification)
    expectedGuid,    // GUID from the client's view
    expectedTitle,
    expectedYear,
    keeperRatingKey, // the copy we're keeping
    confirmText,     // user must type "DELETE"
  } = req.body

  // Guard 1: confirm text
  if (confirmText !== 'DELETE') {
    return res.status(400).json({ error: 'confirmation text required' })
  }

  // Guard 2: re-fetch target metadata
  let target
  try {
    const r = await plexJSON(\`/library/metadata/\${ratingKey}\`)
    target = r?.MediaContainer?.Metadata?.[0]
  } catch (err) {
    await logAction({ status: 'verify_failed', error: 'metadata fetch failed', ratingKey })
    return res.status(404).json({ error: 'target metadata not found' })
  }
  if (!target) {
    await logAction({ status: 'verify_failed', error: 'target metadata missing', ratingKey })
    return res.status(404).json({ error: 'target metadata not found' })
  }

  // Guard 3: re-verify GUID + title + year
  if (target.guid !== expectedGuid || normaliseTitle(target.title) !== normaliseTitle(expectedTitle) || target.year !== expectedYear) {
    await logAction({
      status: 'verify_failed', error: 'metadata mismatch',
      ratingKey, target_guid: target.guid, expected_guid: expectedGuid,
    })
    return res.status(409).json({ error: 'metadata mismatch — refresh' })
  }

  // Guard 4: locate + verify the exact Part
  const { media, part } = findMediaAndPart(target, mediaId, filePath)
  if (!media || !part) {
    await logAction({ status: 'verify_failed', error: 'media/part not found' })
    return res.status(404).json({ error: 'specific media/part not found' })
  }
  if (part.file !== filePath) {
    await logAction({ status: 'verify_failed', error: 'file path mismatch' })
    return res.status(409).json({ error: 'file path mismatch' })
  }

  // Guard 5: keeper must still exist
  try {
    const r = await plexJSON(\`/library/metadata/\${keeperRatingKey}\`)
    if (!r?.MediaContainer?.Metadata?.[0]) {
      await logAction({ status: 'verify_failed', error: 'keeper missing' })
      return res.status(409).json({ error: 'keeper missing — refresh' })
    }
  } catch (err) {
    await logAction({ status: 'verify_failed', error: 'keeper fetch failed' })
    return res.status(503).json({ error: 'keeper verification failed' })
  }

  // Guard 6: allowMediaDeletion must be enabled
  try {
    const root = await plexJSON('/')
    if (!root?.MediaContainer?.allowMediaDeletion) {
      await logAction({ status: 'verify_failed', error: 'allowMediaDeletion disabled' })
      return res.status(403).json({ error: 'Plex media deletion not enabled' })
    }
  } catch (err) {
    await logAction({ status: 'verify_failed', error: 'server-config fetch failed' })
    return res.status(503).json({ error: 'server config check failed' })
  }

  // ALL GUARDS PASSED — perform the delete
  try {
    const snapshot = JSON.stringify(target)
    await plexFetch(\`/library/parts/\${part.id}\`, { method: 'DELETE' })
    await logAction({
      status: 'success',
      ratingKey, file_path: filePath, file_size: part.size,
      snapshot_json: snapshot,
    })
    res.json({ ok: true })
  } catch (err) {
    await logAction({ status: 'failure', error: err.message })
    res.status(500).json({ error: 'delete failed' })
  }
})`}</CodePre>

          <h3>Why each guard exists</h3>
          <table>
            <tbody>
              <tr><th>Guard</th><th>Threat it blocks</th></tr>
              <tr><td>Type DELETE confirm</td><td>Misclicks / autoclickers / automated UI bots</td></tr>
              <tr><td>Re-fetch metadata</td><td>Plex library has changed since the user clicked (file moved/renamed)</td></tr>
              <tr><td>GUID + title + year match</td><td>Client lying about which movie to delete (XSS, hijack)</td></tr>
              <tr><td>File path match</td><td>Client confused about which part of a multi-version metadata</td></tr>
              <tr><td>Keeper exists</td><td>Race condition: keeper was deleted between scan and click</td></tr>
              <tr><td>allowMediaDeletion</td><td>Catch the user who configured Plex to disallow this</td></tr>
            </tbody>
          </table>

          <h3>The single Plex API call</h3>
          <CodePre>{`await plexFetch(\`/library/parts/\${part.id}\`, { method: 'DELETE' })`}</CodePre>

          <p>That's it. The actual delete is one line. The other 60 lines are guards.</p>

          <h3>Why so paranoid</h3>
          <p>Plex deletes are irreversible (unless you have a backup of the file, which most home users don't). A bug in dedup logic that deletes the wrong file could cost the user hours of re-acquiring media. The six guards make even a hostile attacker (XSS hijacking the form, malicious browser extension) unable to misdelete.</p>
        </section>

        <hr />

        {/* SECTION 10 — AUDIT LOG */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>The Audit Log — Immutable Trail</h2>
          <p>Every delete attempt — success, failure, cancellation, verify_failed — writes one row to <code>plex_action_log</code>. The table is append-only; no row is ever updated or deleted. Hearth has the full history of every destructive action.</p>

          <h3>The schema</h3>
          <CodePre>{`-- SecretApp/schema.sql — verbatim
-- ── Plex action log (audit trail for duplicate-cleanup deletes) ─────
CREATE TABLE IF NOT EXISTS plex_action_log (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  ts              INTEGER NOT NULL,
  action          TEXT    NOT NULL,
  status          TEXT    NOT NULL,
  rating_key      TEXT,
  library_id      TEXT,
  library_title   TEXT,
  movie_guid      TEXT,
  title           TEXT,
  year            INTEGER,
  file_path       TEXT,
  file_size       INTEGER,
  duration_ms     INTEGER,
  bitrate_kbps    INTEGER,
  resolution      TEXT,
  video_codec     TEXT,
  audio_codec     TEXT,
  audio_channels  INTEGER,
  container       TEXT,
  kept_rating_key TEXT,
  kept_file_path  TEXT,
  snapshot_json   TEXT,
  error_message   TEXT,
  user_email      TEXT
);
CREATE INDEX IF NOT EXISTS idx_plex_action_log_ts ON plex_action_log(ts DESC);
CREATE INDEX IF NOT EXISTS idx_plex_action_log_rating_key ON plex_action_log(rating_key);`}</CodePre>

          <h3>The status enum</h3>
          <table>
            <tbody>
              <tr><th>status</th><th>Means</th></tr>
              <tr><td><code>success</code></td><td>Plex DELETE returned 200; file is gone</td></tr>
              <tr><td><code>failure</code></td><td>All guards passed, but Plex DELETE returned an error</td></tr>
              <tr><td><code>verify_failed</code></td><td>One of the six guards rejected — file is NOT deleted</td></tr>
              <tr><td><code>cancellation</code></td><td>User cancelled at the type-DELETE prompt</td></tr>
            </tbody>
          </table>

          <h3>What gets captured</h3>
          <ul>
            <li><strong>Timestamp + status</strong>: when and what happened</li>
            <li><strong>Movie identity</strong>: ratingKey, guid, title, year</li>
            <li><strong>File details</strong>: path, size, duration, bitrate, codecs, channels, container</li>
            <li><strong>Library context</strong>: library_id, library_title</li>
            <li><strong>Keeper info</strong>: kept_rating_key, kept_file_path (so you can recover what was supposed to remain)</li>
            <li><strong>Full snapshot</strong>: <code>snapshot_json</code> contains the entire Plex metadata at decision time. If a recovery is ever needed, this is the source of truth.</li>
            <li><strong>Error context</strong>: if status is failure or verify_failed, why</li>
            <li><strong>User</strong>: email of the user who initiated</li>
          </ul>

          <h3>The append-only discipline</h3>
          <p>
            No UPDATE or DELETE statements exist anywhere in <code>routes/plex-duplicates.js</code> for this table. The
            only operation is INSERT. The user CAN delete rows via direct SQL access — but Hearth's code path is
            INSERT-only. The audit log is the historical record.
          </p>

          <h3>What you can do with the audit log</h3>
          <ul>
            <li><strong>"Did I delete X?"</strong> — query by title or guid.</li>
            <li><strong>"What did I delete last month?"</strong> — query by ts range.</li>
            <li><strong>"What was the keeper at the time?"</strong> — read kept_rating_key + kept_file_path.</li>
            <li><strong>"What were the file's specs?"</strong> — every metadata field is captured.</li>
            <li><strong>Restore from backup</strong> — kept_file_path tells you where to put a re-downloaded copy.</li>
          </ul>

          <h3>Indexing strategy</h3>
          <p>Two indexes:</p>
          <ul>
            <li><strong>ts DESC</strong>: the "most recent N rows" query path</li>
            <li><strong>rating_key</strong>: "what happened to this movie?" lookup</li>
          </ul>

          <p>Both are bounded — a fleet-scale home Plex might generate a few hundred audit rows over a year. No need for partitioning, no need for FTS.</p>

          <h3>The /audit endpoint</h3>
          <CodePre>{`router.get('/api/plex/duplicates/audit', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 1000)
  const rows = db.prepare(\`
    SELECT * FROM plex_action_log
    ORDER BY ts DESC
    LIMIT ?
  \`).all(limit)
  res.json(rows.map(r => ({
    ...r,
    snapshot: r.snapshot_json ? JSON.parse(r.snapshot_json) : null,
  })))
})`}</CodePre>

          <p>Trivial. Read the rows; parse snapshot_json on the way out. The Settings → Audit Log UI uses this directly.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Build a Mini Plex Tool</h2>
          <p>Stand up an Express server that talks to your local Plex via the undici TLS bypass, lists movies, and detects duplicates by path. ~30 minutes.</p>

          <h3>Step 1 — Get your Plex token</h3>
          <ol>
            <li>Sign in to <code>https://app.plex.tv</code>.</li>
            <li>Open any movie's detail page; click the three-dot menu → "Get Info".</li>
            <li>In the new window, click "View XML" — this opens a URL with <code>?X-Plex-Token=...</code> in it.</li>
            <li>Copy the token value.</li>
          </ol>

          <p>Alternative: open <code>https://&lt;your-plex-host&gt;:32400/identity?X-Plex-Token=YOUR_TOKEN</code> — you should see a Plex identity XML.</p>

          <h3>Step 2 — Scaffold</h3>
          <CodePre>{`mkdir plex-lab && cd plex-lab
npm init -y
npm pkg set type=module
npm i express undici dotenv`}</CodePre>

          <CodePre>{`# .env
PLEX_BASE_URL=https://localhost:32400
PLEX_TOKEN=YOUR_TOKEN_FROM_STEP_1`}</CodePre>

          <h3>Step 3 — lib/plex.js</h3>
          <CodePre>{`// lib/plex.js
import { Agent } from 'undici'

export const plexConfig = {
  baseUrl: process.env.PLEX_BASE_URL || 'https://localhost:32400',
  token:   process.env.PLEX_TOKEN,
}

export const plexDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
})

export class PlexAPIError extends Error {
  constructor(status, path) {
    super(\`Plex \${path} failed: \${status}\`)
    this.status = status
    this.path = path
  }
}

export async function plexJSON(path) {
  const separator = path.includes('?') ? '&' : '?'
  const url = \`\${plexConfig.baseUrl}\${path}\${separator}X-Plex-Token=\${plexConfig.token}\`
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    dispatcher: plexDispatcher,
  })
  if (!res.ok) throw new PlexAPIError(res.status, path)
  return res.json()
}`}</CodePre>

          <h3>Step 4 — server.js</h3>
          <CodePre>{`// server.js
import 'dotenv/config'
import express from 'express'
import { plexJSON } from './lib/plex.js'

const app = express()
app.use(express.json())

// List all libraries
app.get('/api/libraries', async (req, res) => {
  try {
    const { MediaContainer } = await plexJSON('/library/sections')
    res.json((MediaContainer.Directory ?? []).map(d => ({
      key:   d.key,
      title: d.title,
      type:  d.type,
    })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// List movies in a specific section
app.get('/api/section/:id/movies', async (req, res) => {
  try {
    const { MediaContainer } = await plexJSON(\`/library/sections/\${req.params.id}/all\`)
    res.json((MediaContainer.Metadata ?? []).map(m => ({
      ratingKey: m.ratingKey,
      title:     m.title,
      year:      m.year,
      file:      m.Media?.[0]?.Part?.[0]?.file,
    })))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Naive duplicate detection — group by file path
app.get('/api/duplicates', async (req, res) => {
  try {
    const { MediaContainer } = await plexJSON('/library/sections')
    const movieSections = (MediaContainer.Directory ?? []).filter(d => d.type === 'movie')

    const fileMap = new Map()
    for (const section of movieSections) {
      const data = await plexJSON(\`/library/sections/\${section.key}/all\`)
      const metadata = data?.MediaContainer?.Metadata ?? []
      for (const m of metadata) {
        for (const media of (m.Media ?? [])) {
          for (const part of (media.Part ?? [])) {
            if (!part?.file) continue
            const key = part.file.toLowerCase().trim()
            if (!fileMap.has(key)) {
              fileMap.set(key, { file: part.file, title: m.title, year: m.year, libraries: [] })
            }
            fileMap.get(key).libraries.push(section.title)
          }
        }
      }
    }

    // Filter to entries that appear in 2+ libraries (overlapping libraries)
    const overlapping = [...fileMap.values()].filter(e => e.libraries.length > 1)
    res.json(overlapping)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Plex lab on :3001'))`}</CodePre>

          <h3>Step 5 — Run + test</h3>
          <CodePre>{`node server.js`}</CodePre>

          <p>From another terminal:</p>
          <CodePre>{`# List libraries
curl http://localhost:3001/api/libraries

# Show first movie section
curl http://localhost:3001/api/libraries | python -c 'import json,sys; print([s for s in json.load(sys.stdin) if s["type"] == "movie"][0])'

# List movies in section 1
curl http://localhost:3001/api/section/1/movies | python -m json.tool | head -50

# Find overlapping-library duplicates
curl http://localhost:3001/api/duplicates`}</CodePre>

          <h3>Step 6 — Add the resolution-aware grouping</h3>
          <p>Replace the naive duplicate detector with the real grouping logic from §6:</p>
          <CodePre>{`function normaliseTitle(t) { return String(t || '').trim().toLowerCase() }
function normalisePath(p)  { return String(p || '').trim().toLowerCase() }
function normaliseResolution(r) {
  const lc = String(r || '').toLowerCase()
  if (lc === '4k' || lc === '2160') return '4k'
  if (lc === '1080') return '1080'
  if (lc === '720')  return '720'
  if (lc === '480' || lc === 'sd' || lc === '576') return 'sd'
  return lc || 'unknown'
}
function detectThreeD(filePath) { return /\\b3D\\b/i.test(String(filePath || '')) }

app.get('/api/duplicates-real', async (req, res) => {
  // Stage 1: sweep + path-collapse (same code as before)
  const { MediaContainer } = await plexJSON('/library/sections')
  const movieSections = (MediaContainer.Directory ?? []).filter(d => d.type === 'movie')
  const fileMap = new Map()
  for (const section of movieSections) {
    const data = await plexJSON(\`/library/sections/\${section.key}/all\`)
    for (const m of (data?.MediaContainer?.Metadata ?? [])) {
      for (const media of (m.Media ?? [])) {
        for (const part of (media.Part ?? [])) {
          if (!part?.file) continue
          const key = normalisePath(part.file)
          if (!fileMap.has(key)) {
            fileMap.set(key, { metadata: m, media, part, libs: [section.title] })
          } else {
            if (!fileMap.get(key).libs.includes(section.title)) {
              fileMap.get(key).libs.push(section.title)
            }
          }
        }
      }
    }
  }

  // Stage 2: group by guid + title + year + resolution + is3D
  const groups = new Map()
  for (const entry of fileMap.values()) {
    const m = entry.metadata
    const res = normaliseResolution(entry.media?.videoResolution)
    const is3D = detectThreeD(entry.part.file)
    const key = \`\${m.guid ?? ''}|\${normaliseTitle(m.title)}|\${m.year ?? ''}|\${res}\${is3D ? '|3d' : ''}\`
    if (!groups.has(key)) groups.set(key, { title: m.title, year: m.year, resolution: res, is3D, copies: [] })
    groups.get(key).copies.push({ file: entry.part.file, libraries: entry.libs })
  }

  const duplicates = [...groups.values()].filter(g => g.copies.length > 1)
  res.json(duplicates)
})`}</CodePre>

          <p>Now you have a tool that reports real same-resolution-same-movie duplicates — not just files that happen to live in two libraries.</p>

          <h3>Step 7 — Try the audit-log pattern</h3>
          <p>Add SQLite, write a row before any pretend-delete, query it back:</p>
          <CodePre>{`npm i better-sqlite3`}</CodePre>

          <CodePre>{`// At the top of server.js
import Database from 'better-sqlite3'
const db = new Database('./lab.db')
db.pragma('journal_mode = WAL')
db.exec(\`
  CREATE TABLE IF NOT EXISTS plex_lab_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts INTEGER NOT NULL,
    status TEXT NOT NULL,
    title TEXT, file_path TEXT, library TEXT
  );
\`)

app.post('/api/pretend-delete', (req, res) => {
  const { title, filePath, library } = req.body
  db.prepare('INSERT INTO plex_lab_log (ts, status, title, file_path, library) VALUES (?, ?, ?, ?, ?)').run(
    Date.now(), 'pretend', title, filePath, library
  )
  res.json({ ok: true, message: 'Would have deleted (lab pretend mode)' })
})

app.get('/api/log', (req, res) => {
  res.json(db.prepare('SELECT * FROM plex_lab_log ORDER BY ts DESC').all())
})`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated the core of Hearth's Plex integration: undici dispatcher for TLS bypass, the three-helper
              shape, sweep + path-collapse + resolution-aware grouping + 3D detection, and an audit-log pattern. Wire
              up a UI + the full six guards + the scoring function and you have Plex Duplicates as a service.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"UNABLE_TO_VERIFY_LEAF_SIGNATURE"</h3>
          <p>You forgot the undici dispatcher. Add <code>dispatcher: plexDispatcher</code> to the fetch options. Or you accidentally lost the dispatcher when wrapping the call.</p>

          <h3>"connect ECONNREFUSED 127.0.0.1:32400"</h3>
          <p>Plex isn't running, OR you're not on the same network as it. From App Service, you'd need to expose Plex publicly (via Plex Relay) or use a tunnel — neither is trivial. Hearth's Plex integration assumes the App Service can reach Plex (typically via a custom DNS pointing to a port-forwarded home IP).</p>

          <h3>401 Unauthorized on every Plex call</h3>
          <p>PLEX_TOKEN is wrong, expired, or empty. Tokens don't expire under normal use; usually it's a typo or unset env var.</p>

          <h3>Empty <code>MediaContainer</code> from /library/sections</h3>
          <p>The token isn't authenticated to a server. Try <code>https://&lt;host&gt;:32400/identity?X-Plex-Token=...</code> first; if that succeeds, the server is reachable but the token may be for a different Plex account.</p>

          <h3>Scan returns no duplicates but I know I have some</h3>
          <p>The grouping key is wrong for your case. Check: (a) is the file path different between copies (different folder names)?, (b) is the resolution different (4K + 1080p aren't "duplicates")?, (c) is one of them tagged 3D?</p>

          <h3>"Plex media deletion not enabled" 403</h3>
          <p>Plex's web UI → Settings → Library → "Allow media deletion" must be checked. Without it, Plex itself refuses DELETEs from API clients.</p>

          <h3>The delete succeeded but the file is still on disk</h3>
          <p>Plex's DELETE on a Part removes the database reference + tries to delete the file. If Plex doesn't have file-system permission, it succeeds at the DB level but leaves the file. Check Plex's user/group has write+delete on the media folder. The audit log captures success even in this case; the file lingers.</p>

          <h3>Scan finds 4K and 1080p of the same movie as duplicates</h3>
          <p>The resolution canonicalizer didn't run, OR Plex emitted an unusual videoResolution string. Add a console.log to the canonicalizer to see what came in.</p>

          <h3>3D file gets grouped with 2D</h3>
          <p>The 3D detector didn't fire — the path doesn't have 3D as a word-bounded token. Either rename the file to include "3D" (the convention) or hand-tune the regex for your collection's naming convention.</p>

          <h3>Sample file ranked as keeper</h3>
          <p>The duration penalty didn't fire because all copies in the group have similar runtimes (none below 30% of max). This shouldn't happen for true samples vs movies (2 min vs 120 min is well below 30%). If you're seeing it, the sample's metadata duration is wrong; investigate why.</p>

          <h3>"target metadata not found" 404 on delete</h3>
          <p>The user took too long — Plex re-scanned and the ratingKey changed, OR the file was already deleted. The user should re-scan and try again.</p>

          <h3>The audit log is gone after a deploy</h3>
          <p>You're not on persistent storage (App Service's <code>/home/data</code>). Verify <code>DB_PATH</code> points to <code>/home/data/hearth.db</code> and <code>WEBSITES_ENABLE_APP_SERVICE_STORAGE</code> is true.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The three helpers</h3>
          <CodePre>{`import { Agent } from 'undici'

export const plexDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
})

export async function plexFetch(path, options = {}) {
  const { method = 'GET', accept = 'json' } = options
  const sep = path.includes('?') ? '&' : '?'
  const url = \`\${BASE}\${path}\${sep}X-Plex-Token=\${TOKEN}\`
  return fetch(url, {
    method,
    headers: { Accept: accept === 'xml' ? 'application/xml' : 'application/json' },
    dispatcher: plexDispatcher,
  })
}

export async function plexJSON(path, options = {}) {
  const r = await plexFetch(path, options)
  if (!r.ok) throw new PlexAPIError(r.status, path)
  return r.json()
}

export async function plexText(path, options = {}) {
  const r = await plexFetch(path, { accept: 'xml', ...options })
  if (!r.ok) throw new PlexAPIError(r.status, path)
  return r.text()
}`}</CodePre>

          <h3>Sweep pattern</h3>
          <CodePre>{`const { MediaContainer } = await plexJSON('/library/sections')
const movies = (MediaContainer.Directory ?? []).filter(d => d.type === 'movie')

const results = await Promise.all(movies.map(s => plexJSON(\`/library/sections/\${s.key}/all\`)))`}</CodePre>

          <h3>Path-collapse</h3>
          <CodePre>{`for (const r of results) {
  for (const m of (r?.MediaContainer?.Metadata ?? [])) {
    for (const media of (m.Media ?? [])) {           // ← every Media
      for (const part of (media.Part ?? [])) {       // ← every Part
        if (!part?.file) continue
        const key = part.file.toLowerCase().trim()
        // ... aggregate ratingKeys + libraryTitles ...
      }
    }
  }
}`}</CodePre>

          <h3>Group key components</h3>
          <CodePre>{`const key = \`\${guid}|\${normaliseTitle(title)}|\${year}|\${normaliseResolution(res)}\${is3D ? '|3d' : ''}\``}</CodePre>

          <h3>The 3D detector</h3>
          <CodePre>{`function detectThreeD(filePath) {
  return /\\b3D\\b/i.test(String(filePath || ''))
}`}</CodePre>

          <h3>Scoring</h3>
          <CodePre>{`const RESOLUTION_TIER = { '4k': 4, '1080': 3, '720': 2, '480': 1, 'sd': 1 }
const CODEC_BONUS     = { hevc: 500, h265: 500, h264: 200, mpeg4: 100 }

score = resTier * 10000
      + bitrate
      + codecBonus
      + audioChannels * 50
      + (hasHDR ? 2000 : 0)
      - (duration < maxDuration * 0.3 ? 1_000_000 : 0)`}</CodePre>

          <h3>The six guards</h3>
          <ol>
            <li>UI: type DELETE to confirm</li>
            <li>Server: re-fetch target metadata</li>
            <li>Server: GUID + title + year match</li>
            <li>Server: file path match</li>
            <li>Server: keeper still exists</li>
            <li>Server: allowMediaDeletion enabled</li>
          </ol>

          <h3>The audit row</h3>
          <CodePre>{`INSERT INTO plex_action_log (ts, action, status, rating_key, title, year, file_path, file_size, snapshot_json, error_message, ...)`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File · lines</th></tr>
              <tr><td>undici TLS-bypass dispatcher</td><td>SecretApp · <code>lib/plex.js:15-17</code></td></tr>
              <tr><td>plexFetch / plexJSON / plexText</td><td>SecretApp · <code>lib/plex.js</code></td></tr>
              <tr><td>Scoring function</td><td>SecretApp · <code>routes/plex-duplicates.js:18-59</code></td></tr>
              <tr><td>Path normalization</td><td>SecretApp · <code>routes/plex-duplicates.js:95-99</code></td></tr>
              <tr><td>Resolution canonicalizer</td><td>SecretApp · <code>routes/plex-duplicates.js:105-112</code></td></tr>
              <tr><td>3D detection</td><td>SecretApp · <code>routes/plex-duplicates.js:119-121</code></td></tr>
              <tr><td>Same-file collapse loop</td><td>SecretApp · <code>routes/plex-duplicates.js:270-310</code></td></tr>
              <tr><td>Resolution-aware grouping</td><td>SecretApp · <code>routes/plex-duplicates.js:316-341</code></td></tr>
              <tr><td>Sample-detection penalty</td><td>SecretApp · <code>routes/plex-duplicates.js:355-365</code></td></tr>
              <tr><td>Within-5% manual-review rule</td><td>SecretApp · <code>routes/plex-duplicates.js:373-384</code></td></tr>
              <tr><td>Audit log schema</td><td>SecretApp · <code>schema.sql</code> (plex_action_log)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — Phase 2 batch 1 shipped.</p>
        </section>
      </main>
    </div>
  );
}
