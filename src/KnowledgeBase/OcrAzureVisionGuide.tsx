import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Read API v3.2 Async Pattern',      icon: '🔄' },
  { id: 's3',  num: '3',  title: 'Provisioning + Env Vars',          icon: '☁️' },
  { id: 's4',  num: '4',  title: 'Submit + operation-location',      icon: '📤' },
  { id: 's5',  num: '5',  title: 'The Poll Loop',                    icon: '🔁' },
  { id: 's6',  num: '6',  title: 'media.status State Machine',       icon: '🔀' },
  { id: 's7',  num: '7',  title: 'Fire-and-Forget Upload',           icon: '📨' },
  { id: 's8',  num: '8',  title: 'Frontend Polling While Indexing',  icon: '⏱️' },
  { id: 's9',  num: '9',  title: 'Graceful Disabled Mode',           icon: '🛑' },
  { id: 's10', num: '10', title: 'Alternatives Considered',          icon: '⚖️' },
  { id: 's11', num: '★',  title: 'Lab: OCR a File from Disk',        icon: '🛠️' },
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

export default function OcrAzureVisionGuide() {
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
            <span className="sidebar-title">Azure CV OCR</span>
          </div>
          <div className="sidebar-sub">Tabloom's image text extraction</div>
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
          <div className="hero-tag">👁️ Azure Computer Vision · Read API v3.2 · 2026</div>
          <h1>OCR with Azure Computer Vision<br />(Tabloom deep dive)</h1>
          <p>
            Tabloom's media uploads run through <strong style={{ color: '#C77AA0' }}>Azure Computer Vision's Read API
            v3.2</strong> — Microsoft's OCR service. Tabloom uses raw fetch (no SDK), the asynchronous submit+poll
            pattern, fire-and-forget from the upload route, a three-state machine on the media row, and frontend
            polling while items are still indexing. This guide walks every layer with Tabloom's real code.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">~40s</span><span className="hero-stat-label">Poll budget</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">media.status states</span></div>
            <div className="hero-stat"><span className="hero-stat-val">No SDK</span><span className="hero-stat-label">Raw fetch</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">User-facing search</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            OCR (Optical Character Recognition) is "given an image, return the text in it." Azure Computer Vision's
            Read API v3.2 is an asynchronous service: submit the image, get back an "operation location" URL, poll
            that URL until the result is ready, extract the recognized text.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The postal claim ticket.</strong> You drop a package off (the image). The post office gives you a
            tracking number (operation-location URL). You poll until the tracking shows "delivered" (succeeded), then
            pick up your receipt (the recognized text).
          </p>
          <p>
            <strong>OCR vs vision LLM.</strong> Azure CV's Read API is a specialist — fast, cheap, accurate on
            printed/handwritten text. A multimodal LLM (GPT-4o, Claude with vision) can also OCR but is 10-100× more
            expensive and slower. Use the specialist for OCR; reach for the LLM when you also need understanding
            ("what's this person feeling?" + the text).
          </p>
          <p>
            <strong>Async APIs are dance partners.</strong> The client doesn't get a result on the first call; it gets a
            promise (the operation-location URL). You poll until the dance ends. Synchronous OCR exists but it's worse
            — multi-page PDFs can take 30+ seconds, blocking the HTTP request that long is fragile.
          </p>

          <h3>What Tabloom uses OCR for</h3>
          <p>Every uploaded image is OCR'd. The recognized text is stored on the <code>media.ocr</code> column. Use cases:</p>
          <ul>
            <li><strong>Accessibility</strong>: alt text + screen-reader content for image attachments.</li>
            <li><strong>Future search</strong>: the schema supports it; the search query doesn't currently expose it.</li>
            <li><strong>Notebook-as-archive</strong>: photos of receipts, business cards, whiteboards become searchable artifacts.</li>
          </ul>

          <h3>What Tabloom intentionally does NOT do</h3>
          <ul>
            <li><strong>No SDK</strong>: raw fetch only. The <code>@azure/ai-vision-image-analysis</code> SDK exists; Tabloom skips it.</li>
            <li><strong>No background queue</strong>: OCR fires from the upload route via fire-and-forget. No graphile-worker, no setInterval sweep.</li>
            <li><strong>No pre-processing</strong>: image is sent as-is. No resizing, no compression. Azure handles up to ~50 MB / 4MP.</li>
            <li><strong>No retry on failure</strong>: a failed OCR stays failed. The user can re-upload to retry.</li>
            <li><strong>OCR text isn't user-searchable</strong>: stored, displayed in the media detail view, but the search query (LIKE on pages.title + pages.snippet) doesn't include it.</li>
          </ul>

          <h3>The seven moving parts</h3>
          <ol>
            <li><strong><code>lib/ocr.js</code></strong>: the helper — submit + poll + extract text</li>
            <li><strong><code>POST /api/media</code></strong>: upload route; creates the row + fires OCR</li>
            <li><strong>The <code>media</code> table</strong>: <code>status</code> + <code>ocr</code> columns</li>
            <li><strong><code>finalizeOcr</code> prepared statement</strong>: writes results back when OCR completes</li>
            <li><strong>The frontend MediaTab component</strong>: polls <code>/api/media</code> while any row is indexing</li>
            <li><strong>Env vars</strong>: <code>AZURE_VISION_ENDPOINT</code> + <code>AZURE_VISION_KEY</code></li>
            <li><strong>The "OCR is disabled" graceful path</strong>: if env vars missing, mark indexed immediately</li>
          </ol>

          <h3>The full flow</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User
  participant T as Tabloom server
  participant DB as media row
  participant CV as Azure Vision
  U->>T: POST /api/media (multipart)
  T->>DB: INSERT status='indexing'
  T->>U: 201 (created with status='indexing')
  Note over T: fire-and-forget runOcr
  T->>CV: POST .../read/analyze (bytes)
  CV->>T: 202 + operation-location header
  loop poll up to 25× / 1.6s
    T->>CV: GET operation-location
    CV->>T: { status: 'running' }
  end
  CV->>T: { status: 'succeeded', readResults: [...] }
  T->>DB: UPDATE ocr, status='indexed'
  Note over U: meanwhile, frontend polls /api/media every 4s
  U->>T: GET /api/media (poll)
  T->>U: status='indexed' (ready)`} />
        </section>

        <hr />

        {/* SECTION 2 — READ API */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Read API v3.2 — Async Pattern</h2>
          <p>Microsoft's OCR endpoint has TWO surfaces. Read API v3.2 is async (submit-then-poll). Vision Image Analysis v4 has synchronous OCR for small images. Tabloom uses v3.2.</p>

          <h3>Why async</h3>
          <p>OCR is slow. Microsoft's service has no SLA on single-call latency — a high-resolution scanned PDF can take 30+ seconds. Sync HTTP requests held that long are fragile (idle timeouts, retries, exhausted Node event-loop slots). Async means:</p>
          <ol>
            <li>Client submits the image. Server returns 202 + an operation-location URL. ~500ms.</li>
            <li>Client polls the operation-location URL on whatever cadence works. Each poll is &lt;500ms.</li>
            <li>When the result is ready, the polled URL returns it. Client extracts.</li>
          </ol>

          <p>From the client's perspective: never a blocking 30-second call. From Azure's: it can use whatever backend it wants without worrying about HTTP timeouts.</p>

          <h3>The two endpoints</h3>
          <table>
            <tbody>
              <tr><th>Endpoint</th><th>Use</th></tr>
              <tr><td><code>POST {`{endpoint}`}/vision/v3.2/read/analyze</code></td><td>Submit an image for OCR</td></tr>
              <tr><td><code>GET {`{operation-location}`}</code></td><td>Poll for the result</td></tr>
            </tbody>
          </table>

          <p>The endpoint base URL comes from your Azure Cognitive Services resource. Operation-location URLs are absolute (returned in a response header), so no need to construct them yourself.</p>

          <h3>What v3.2 supports</h3>
          <ul>
            <li>Printed text in ~70 languages.</li>
            <li>Handwritten text in English (less reliable in other languages).</li>
            <li>Multi-page PDFs (Tabloom doesn't use this — single images only).</li>
            <li>Up to 50MB request body / 50MB file / 10K × 10K resolution.</li>
            <li>JPEG, PNG, BMP, TIFF, PDF.</li>
          </ul>

          <h3>What it returns</h3>
          <CodePre>{`// Successful poll response
{
  "status": "succeeded",
  "createdDateTime": "2026-05-27T10:00:00Z",
  "lastUpdatedDateTime": "2026-05-27T10:00:03Z",
  "analyzeResult": {
    "version": "3.2.0",
    "modelVersion": "2022-04-30",
    "readResults": [
      {
        "page": 1,
        "angle": 0.5,
        "width": 1920,
        "height": 1080,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [120, 80, 540, 80, 540, 130, 120, 130],
            "text": "Hello World",
            "words": [
              { "boundingBox": [...], "text": "Hello", "confidence": 0.99 },
              { "boundingBox": [...], "text": "World", "confidence": 0.97 }
            ]
          },
          // ... more lines ...
        ]
      }
    ]
  }
}`}</CodePre>

          <h3>What Tabloom extracts</h3>
          <p>Just the line text. Joins them with newlines. Discards bounding boxes, words, angles, confidence scores. Simple is the right call when you don't need the geometry.</p>

          <h3>Alternative: Vision Image Analysis v4</h3>
          <p>Microsoft's newer OCR surface, synchronous, returns text + structured layout + objects + tags in one call. Tabloom doesn't use it because (a) v3.2 was already shipped when v4 launched, (b) sync requires careful timeout management, (c) v3.2 is well-documented + stable.</p>

          <h3>API version syntax</h3>
          <p>The version is in the URL path (<code>/vision/v3.2/...</code>), not a query string or header. Microsoft has done this both ways across services. v3.2 stays as v3.2 forever; if you want v4, the URL itself changes.</p>
        </section>

        <hr />

        {/* SECTION 3 — PROVISIONING */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Provisioning + Env Vars</h2>
          <p>Two things needed: an Azure Cognitive Services / Computer Vision resource, and the endpoint + key in your app's env.</p>

          <h3>Creating the resource</h3>
          <ol>
            <li>Azure portal → Create resource → "Computer Vision" (or "Cognitive Services" with multi-service if you'll use other services too).</li>
            <li>Region: pick one with low latency to your App Service. Tabloom's is in <code>eastus</code>.</li>
            <li>Pricing tier:
              <ul>
                <li><strong>F0 (Free)</strong>: 20 calls/minute, 5K calls/month. Fine for personal apps.</li>
                <li><strong>S1 (Standard)</strong>: pay-per-call (~$1 per 1000 transactions). Higher rate limits.</li>
              </ul>
            </li>
            <li>Once provisioned, open the resource → "Keys and Endpoint" blade.</li>
            <li>Copy <strong>Endpoint</strong> (e.g. <code>https://my-cv.cognitiveservices.azure.com/</code>) and one of the two <strong>Keys</strong>.</li>
          </ol>

          <h3>Env vars in Tabloom</h3>
          <CodePre>{`// tabloom/lib/ocr.js — verbatim
const ENDPOINT = (process.env.AZURE_VISION_ENDPOINT ?? '').replace(/\\/+$/, '')
const KEY = process.env.AZURE_VISION_KEY ?? ''
const ENABLED = Boolean(ENDPOINT && KEY)

if (ENABLED) {
  console.log(\`[ocr] Azure CV enabled at \${ENDPOINT}\`)
} else {
  console.warn("[ocr] AZURE_VISION_ENDPOINT / _KEY not set — OCR disabled, uploads will be marked 'indexed' immediately.")
}`}</CodePre>

          <h3>Two important details</h3>
          <ul>
            <li><strong>Trailing-slash strip</strong>: <code>.replace(/\/+$/, '')</code>. Without it, you'd construct URLs like <code>...azure.com//vision/...</code> (double slash). Some servers are strict about this; better to be defensive.</li>
            <li><strong>"Enabled" guard</strong>: if either env var is missing, OCR is silently disabled. The app still works — uploads just don't get OCR'd.</li>
          </ul>

          <h3>App Service config</h3>
          <p>Production Tabloom stores both env vars as App Service Application Settings. The endpoint is non-secret (it's just a URL). The key IS secret — should be a Key Vault reference:</p>
          <CodePre>{`AZURE_VISION_ENDPOINT=https://my-cv.cognitiveservices.azure.com
AZURE_VISION_KEY=@Microsoft.KeyVault(VaultName=kv-tabloom;SecretName=azure-vision-key)`}</CodePre>

          <p>Tabloom doesn't currently use Key Vault for this (the secret sits raw in App Settings) — acceptable for personal app scale; recommended pattern is Key Vault for any production deployment.</p>

          <h3>Optional: use the secondary key</h3>
          <p>Computer Vision gives you two keys (Key 1 + Key 2). The pattern for rotation: app uses Key 1 today; you regenerate Key 2 (still unused); swap the app to Key 2; regenerate Key 1; you can now swap back to Key 1 anytime. Both keys work simultaneously — no downtime.</p>

          <h3>Cost monitoring</h3>
          <p>Azure portal → your CV resource → Metrics. Watch "Total Calls" + "Total Errors." For Tabloom's scale (~5-50 OCRs/month from household use), well under the F0 tier limits. For a public-facing app, set a Budget alert at the cost level you can tolerate.</p>
        </section>

        <hr />

        {/* SECTION 4 — SUBMIT */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Submit + operation-location Header</h2>
          <p>The first half of the dance: POST the image bytes, receive a 202 response with the operation-location URL in a header.</p>

          <h3>Tabloom's submit</h3>
          <CodePre>{`// tabloom/lib/ocr.js — verbatim relevant block
try {
  const bytes = await readFile(absoluteFilePath)
  const submit = await fetch(\`\${ENDPOINT}/vision/v3.2/read/analyze\`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: bytes,
  })
  if (submit.status !== 202) {
    const text = await submit.text().catch(() => '')
    console.warn(\`[ocr] submit failed: \${submit.status} \${text.slice(0, 200)}\`)
    return { status: 'failed', ocr: '' }
  }
  const opLocation = submit.headers.get('operation-location')
  if (!opLocation) return { status: 'failed', ocr: '' }
  // ... poll loop ...
}`}</CodePre>

          <h3>The two ways to submit an image</h3>
          <table>
            <tbody>
              <tr><th>Method</th><th>Content-Type</th><th>Body</th></tr>
              <tr><td>Raw bytes (Tabloom)</td><td><code>application/octet-stream</code></td><td>Image binary</td></tr>
              <tr><td>URL reference</td><td><code>application/json</code></td><td><code>{`{ "url": "https://..." }`}</code></td></tr>
            </tbody>
          </table>

          <p>Raw bytes is what Tabloom uses — the file is on disk in <code>UPLOADS_PATH</code>. URL reference requires the image to be publicly accessible OR sit behind a SAS URL; not applicable.</p>

          <h3>The auth header</h3>
          <CodePre>{`headers: {
  'Ocp-Apim-Subscription-Key': KEY,
}`}</CodePre>

          <p><code>Ocp-Apim-Subscription-Key</code> is the standard auth header for Azure API Management-backed Cognitive Services. Microsoft has been consistent about this across products — same name on Translator, Speech, Form Recognizer, etc.</p>

          <h3>The 202 + operation-location pattern</h3>
          <p>HTTP 202 ("Accepted") is the standard "we got your request, work is async" status. Microsoft puts the polling URL in a custom header:</p>
          <CodePre>{`# Response headers
HTTP/1.1 202 Accepted
Operation-Location: https://my-cv.cognitiveservices.azure.com/vision/v3.2/read/analyzeResults/abc12345-...
Content-Length: 0`}</CodePre>

          <p>The body is empty. Everything you need is in the header. Tabloom extracts it via <code>submit.headers.get('operation-location')</code>.</p>

          <h3>Failure modes at submit</h3>
          <table>
            <tbody>
              <tr><th>Status</th><th>Cause</th></tr>
              <tr><td>400</td><td>Bad request — corrupt image, unsupported format, too large</td></tr>
              <tr><td>401</td><td>Bad subscription key</td></tr>
              <tr><td>403</td><td>Quota exhausted (F0 monthly limit)</td></tr>
              <tr><td>413</td><td>Image too large (&gt;50MB)</td></tr>
              <tr><td>429</td><td>Rate limit (20/min on F0)</td></tr>
              <tr><td>500-504</td><td>Azure service problem</td></tr>
            </tbody>
          </table>

          <p>Tabloom doesn't differentiate — any non-202 returns "failed." Adding retry-on-429 with a backoff would be the obvious enhancement; not currently implemented because the volume is too low to matter.</p>

          <h3>The "missing header" guard</h3>
          <CodePre>{`const opLocation = submit.headers.get('operation-location')
if (!opLocation) return { status: 'failed', ocr: '' }`}</CodePre>

          <p>Belt-and-braces. A 202 should always have the header; if it doesn't (Azure bug, proxy strip), give up gracefully rather than throwing.</p>
        </section>

        <hr />

        {/* SECTION 5 — POLL */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>The Poll Loop</h2>
          <p>The second half: GET the operation-location URL on a fixed cadence until the status reports succeeded or failed.</p>

          <h3>Tabloom's poll loop</h3>
          <CodePre>{`// tabloom/lib/ocr.js — verbatim (lines 53-73)
// Poll up to ~40 seconds (25 attempts × 1.6s).
for (let attempt = 0; attempt < 25; attempt++) {
  await new Promise((r) => setTimeout(r, 1600))
  const pollRes = await fetch(opLocation, {
    headers: { 'Ocp-Apim-Subscription-Key': KEY },
  })
  if (!pollRes.ok) continue
  const body = await pollRes.json().catch(() => null)
  const status = body?.status
  if (status === 'succeeded') {
    const lines = []
    for (const r of body?.analyzeResult?.readResults ?? []) {
      for (const l of r?.lines ?? []) {
        if (l?.text) lines.push(l.text)
      }
    }
    return { status: 'indexed', ocr: lines.join('\\n') }
  }
  if (status === 'failed') return { status: 'failed', ocr: '' }
  // status 'running' or 'notStarted' — keep polling
}
return { status: 'failed', ocr: '' }`}</CodePre>

          <h3>The cadence — 1.6 seconds × 25 attempts</h3>
          <p>40 seconds total budget. Why this shape:</p>
          <ul>
            <li><strong>1.6s interval</strong>: typical OCR latency is 2-5 seconds for small images. Polling every 1.6s catches most jobs on the 2nd-3rd attempt without hammering Azure.</li>
            <li><strong>25 attempts</strong>: 40-second cap. Long enough for high-res images; short enough that a failing job doesn't hold the function call open forever.</li>
            <li><strong>Fixed interval</strong>: no exponential backoff. The Read API's processing time isn't bursty; constant interval is fine.</li>
          </ul>

          <p>Could be tuned smarter — start with 500ms interval for the first 3 attempts (most jobs finish here), then back off to 2s thereafter. Tabloom keeps it simple.</p>

          <h3>The four polling statuses</h3>
          <table>
            <tbody>
              <tr><th>status</th><th>Meaning</th><th>What Tabloom does</th></tr>
              <tr><td><code>notStarted</code></td><td>Azure hasn't picked up the job yet</td><td>Continue polling</td></tr>
              <tr><td><code>running</code></td><td>Azure is processing</td><td>Continue polling</td></tr>
              <tr><td><code>succeeded</code></td><td>OCR complete</td><td>Extract text, return indexed</td></tr>
              <tr><td><code>failed</code></td><td>Azure rejected or errored</td><td>Return failed</td></tr>
            </tbody>
          </table>

          <h3>The text extraction</h3>
          <CodePre>{`const lines = []
for (const r of body?.analyzeResult?.readResults ?? []) {
  for (const l of r?.lines ?? []) {
    if (l?.text) lines.push(l.text)
  }
}
return { status: 'indexed', ocr: lines.join('\\n') }`}</CodePre>

          <p>Each page (<code>readResults</code> array, usually 1 for single images) has <code>lines</code>, each line has <code>text</code>. Tabloom flattens everything to one string, lines joined by newline. Bounding boxes + words + confidence scores are discarded.</p>

          <h3>The optional-chaining defensive style</h3>
          <p><code>body?.analyzeResult?.readResults ?? []</code>. If the response shape is unexpected (Azure changed the API, malformed response, etc.), the chain returns an empty array → for-loop is a no-op → return indexed with empty OCR.</p>

          <p>Better than crashing on a missing field. The downside: if Azure ever returns a malformed success response, you'd silently get empty OCR. Hasn't happened in practice.</p>

          <h3>The "if (!pollRes.ok) continue" pattern</h3>
          <p>A transient network error or a 5xx response → skip this attempt, try again in 1.6s. The total budget (40s) cap protects against persistent failures.</p>

          <h3>The throwaway promise wrapper</h3>
          <CodePre>{`await new Promise((r) => setTimeout(r, 1600))`}</CodePre>

          <p>Standard sleep idiom in Node. There's no <code>sleep()</code> built-in; <code>setTimeout</code> wrapped in a Promise is the convention. Could be extracted to a helper; Tabloom inlines it.</p>

          <h3>The implicit final return</h3>
          <CodePre>{`return { status: 'failed', ocr: '' }`}</CodePre>

          <p>If the for-loop exits without hitting succeeded or failed, that means we exhausted the 25 attempts. Treat as failed. The user can retry by re-uploading.</p>
        </section>

        <hr />

        {/* SECTION 6 — STATE MACHINE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span><code>media.status</code> State Machine</h2>
          <p>Three states: <code>indexing</code>, <code>indexed</code>, <code>failed</code>. The row's <code>status</code> column tracks where it is.</p>

          <h3>The media table</h3>
          <CodePre>{`-- tabloom/server.js — verbatim
CREATE TABLE IF NOT EXISTS media (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  notebook_id   INTEGER,
  page_id       INTEGER,
  caption       TEXT,
  ocr           TEXT,
  status        TEXT NOT NULL DEFAULT 'indexing',
  mime_type     TEXT,
  file_path     TEXT,
  bg_gradient   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (notebook_id) REFERENCES notebooks(id) ON DELETE SET NULL,
  FOREIGN KEY (page_id)     REFERENCES pages(id)    ON DELETE SET NULL
);`}</CodePre>

          <h3>The state lifecycle</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  A[INSERT row] --> I[status=indexing]
  I --> R[runOcr fires]
  R --> S{result?}
  S -->|succeeded| OK[UPDATE status=indexed, ocr=text]
  S -->|failed / timeout| F[UPDATE status=failed, ocr='']
  S -->|OCR disabled| OKE[Skip — already indexed]`} />

          <h3>The transitions in code</h3>

          <h4>1. INSERT → indexing</h4>
          <CodePre>{`const initialStatus = ocrEnabled() ? 'indexing' : 'indexed'
const info = stmts.insertMedia.run({
  notebook_id: ...,
  page_id: ...,
  caption: ...,
  ocr: '',
  status: initialStatus,
  ...
})`}</CodePre>

          <p>If Azure CV is configured → status starts as <code>indexing</code>. If not → status starts as <code>indexed</code> immediately (graceful disabled mode, see §9).</p>

          <h4>2. indexing → indexed or failed</h4>
          <CodePre>{`const finalizeOcr = db.prepare(
  "UPDATE media SET ocr = @ocr, status = @status, updated_at = datetime('now') WHERE id = @id",
)

// In the upload route, fire-and-forget:
if (ocrEnabled()) {
  const absPath = join(UPLOADS_PATH, req.file.filename)
  runOcr(absPath).then((result) => {
    finalizeOcr.run({ id, ocr: result.ocr, status: result.status })
  })
}`}</CodePre>

          <p>One prepared statement does both transitions. <code>result.status</code> is either <code>'indexed'</code> or <code>'failed'</code>.</p>

          <h3>What happens on a server restart mid-OCR</h3>
          <p>If the server crashes / restarts while OCR is in progress, the row stays as <code>indexing</code> forever. No sweep recovers it. The user notices and can re-upload to retry, or an admin can manually run a recovery script.</p>

          <p>This is a real fragility. A more robust design would:</p>
          <ul>
            <li>Use graphile-worker (Tabloom doesn't use it; PulseWire does) — jobs persist across restarts.</li>
            <li>Or have a periodic sweep that re-attempts <code>indexing</code> rows older than ~1 minute.</li>
            <li>Or include a timestamp; if <code>status='indexing'</code> and <code>updated_at &lt; now - 1h</code>, mark failed.</li>
          </ul>

          <p>Tabloom hasn't added any of these because the failure mode is rare + recoverable by re-upload. The pattern is "do the simplest thing that works; harden when it breaks."</p>

          <h3>What status the UI displays</h3>
          <table>
            <tbody>
              <tr><th>status</th><th>UI</th></tr>
              <tr><td>indexing</td><td>Spinner + "Indexing…" pill</td></tr>
              <tr><td>indexed</td><td>Show the OCR text (if non-empty) on the media detail; no pill</td></tr>
              <tr><td>failed</td><td>"Couldn't extract text" pill (subtle, not error-toned)</td></tr>
            </tbody>
          </table>

          <h3>No "retry" UI</h3>
          <p>Tabloom doesn't expose a "retry OCR" button. If the user wants to retry, they delete + re-upload. Adding a retry would mean: add a server endpoint that re-fires <code>runOcr</code> on an existing row, expose it via the UI. Not currently in scope.</p>
        </section>

        <hr />

        {/* SECTION 7 — FIRE AND FORGET */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Fire-and-Forget Upload</h2>
          <p>The upload route doesn't wait for OCR. It creates the row, responds to the user, and kicks off OCR with a dangling Promise.</p>

          <h3>Tabloom's upload handler</h3>
          <CodePre>{`// tabloom/server.js — verbatim (lines 2139-2182)
app.post('/api/media', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })
  const { notebookId, notebook_id, pageId, page_id, caption } = req.body ?? {}
  const nbId = Number(notebookId ?? notebook_id)
  const pId = Number(pageId ?? page_id)

  // Gate after multer so we can read the multipart body.
  if (Number.isFinite(nbId) && nbId > 0) {
    const level = notebookAccessLevel(req, nbId)
    if (!level || ROLE_RANK[level] < ROLE_RANK.editor) {
      try { unlinkSync(join(UPLOADS_PATH, req.file.filename)) } catch {}
      return res.status(403).json({ error: 'forbidden' })
    }
  } else if (!req.user?.isOwner) {
    // Unfiled media (no notebook) is owner-only.
    try { unlinkSync(join(UPLOADS_PATH, req.file.filename)) } catch {}
    return res.status(403).json({ error: 'forbidden' })
  }

  const initialStatus = ocrEnabled() ? 'indexing' : 'indexed'
  const info = stmts.insertMedia.run({
    notebook_id: Number.isFinite(nbId) && nbId > 0 ? nbId : null,
    page_id: Number.isFinite(pId) && pId > 0 ? pId : null,
    caption: caption || req.file.originalname,
    ocr: '',
    status: initialStatus,
    mime_type: req.file.mimetype,
    file_path: req.file.filename,
    bg_gradient: null,
  })
  const id = Number(info.lastInsertRowid)
  res.status(201).json(shapeMedia(stmts.getMedia.get(id)))

  // Fire-and-forget OCR. Errors are swallowed by runOcr; the row is updated
  // once the Read API settles. The frontend polls /api/media while any row
  // is still 'indexing'.
  if (ocrEnabled()) {
    const absPath = join(UPLOADS_PATH, req.file.filename)
    runOcr(absPath).then((result) => {
      finalizeOcr.run({ id, ocr: result.ocr, status: result.status })
    })
  }
})`}</CodePre>

          <h3>The pattern dissected</h3>
          <ol>
            <li><strong>multer parses the multipart upload</strong> → <code>req.file</code> populated, file on disk.</li>
            <li><strong>Authorization check</strong> — does the user have editor access? If not, delete the file + return 403.</li>
            <li><strong>INSERT the media row</strong> with initial status.</li>
            <li><strong>Return 201 to the client</strong> with the row shape — at this point the user sees their image uploaded, but the OCR isn't done yet.</li>
            <li><strong>Dangling promise</strong>: <code>runOcr(absPath).then(...)</code>. The route handler returns; the Promise resolves later, updating the row.</li>
          </ol>

          <h3>The "fire-and-forget" anti-pattern (and why Tabloom does it anyway)</h3>
          <p>In general, dangling promises are bad — errors get swallowed, you lose observability. Tabloom's case is acceptable because:</p>
          <ul>
            <li><code>runOcr</code> NEVER throws (errors are caught internally + logged).</li>
            <li>The result is persisted to the DB via a known prepared statement.</li>
            <li>Worst case: <code>finalizeOcr.run</code> fails (DB closed?) — the row stays as <code>indexing</code>, user can re-upload.</li>
            <li>Adding a queue (graphile-worker) for ONE operation is overkill at Tabloom's scale.</li>
          </ul>

          <h3>What "fire and forget" buys</h3>
          <ul>
            <li><strong>Fast upload response</strong>: user sees their image immediately, doesn't wait 40 seconds for OCR.</li>
            <li><strong>No queue infrastructure</strong>: no Redis, no graphile-worker, no separate worker process.</li>
            <li><strong>Simple code</strong>: one route, no extra moving parts.</li>
          </ul>

          <h3>What it costs</h3>
          <ul>
            <li><strong>OCR is tied to App Service uptime</strong>: server restart mid-OCR loses the result. (See §6.)</li>
            <li><strong>No visibility</strong>: if all OCRs start failing, you find out via user complaints or by querying <code>media WHERE status='failed' ORDER BY created_at DESC</code>.</li>
            <li><strong>No retries</strong>: a 429 rate limit produces "failed" instead of a delayed retry.</li>
          </ul>

          <p>For Tabloom's personal-app household scale, the trade-off is correct. For a SaaS at scale, you'd use graphile-worker or BullMQ + retries + dashboards.</p>

          <h3>The "delete file on auth failure" detail</h3>
          <CodePre>{`if (!level || ROLE_RANK[level] < ROLE_RANK.editor) {
  try { unlinkSync(join(UPLOADS_PATH, req.file.filename)) } catch {}
  return res.status(403).json({ error: 'forbidden' })
}`}</CodePre>

          <p>multer wrote the file to disk BEFORE auth was checked (because we needed to parse the multipart body to know which notebook the user is targeting). If auth fails, delete the orphan file. The <code>try/catch</code> swallows any unlink errors (file might not exist for some reason).</p>
        </section>

        <hr />

        {/* SECTION 8 — FRONTEND POLLING */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Frontend Polling While Indexing</h2>
          <p>The user uploads an image; the server returns it with <code>status='indexing'</code>. The frontend polls until status changes. 4-second cadence, 60-second cap.</p>

          <h3>Tabloom's poll hook</h3>
          <CodePre>{`// tabloom/src/routes/PageView/MediaTab.tsx — verbatim (lines 22-37)
// Poll the media list while any item is still indexing — OCR is async on the
// server. Cap at 60s of polling so we don't spin forever on a misconfigured
// Azure CV resource. Resets whenever a new indexing item appears.
const indexingCount = media.filter((m) => m.status === 'indexing').length

useEffect(() => {
  if (indexingCount === 0) return
  const start = Date.now()
  const tick = window.setInterval(() => {
    if (Date.now() - start > 60_000) {
      window.clearInterval(tick)
      return
    }
    refreshMedia()
  }, 4_000)
  return () => window.clearInterval(tick)
}, [indexingCount, refreshMedia])`}</CodePre>

          <h3>The hook's three jobs</h3>
          <ol>
            <li><strong>Detect indexing rows</strong>: if any exist, start polling.</li>
            <li><strong>Refresh on a 4-second cadence</strong>: GET /api/media → updates the local state.</li>
            <li><strong>Cap at 60 seconds</strong>: if polling exceeds 60s (server is misconfigured, OCR stuck), stop.</li>
          </ol>

          <h3>The dependency array</h3>
          <CodePre>{`}, [indexingCount, refreshMedia])`}</CodePre>

          <p>Re-runs the effect when:</p>
          <ul>
            <li><strong>indexingCount changes</strong>: a new item starts indexing (count went up) → restart polling; an item finishes (count went down) → effect re-evaluates, possibly stops polling.</li>
            <li><strong>refreshMedia changes</strong>: rare (the function comes from a Zustand store), but included for correctness.</li>
          </ul>

          <h3>The "reset start time on new indexing" behavior</h3>
          <p>When <code>indexingCount</code> changes from 0 → 1 (user uploads), <code>start = Date.now()</code> resets. The 60-second cap is per-batch, not absolute. If the user uploads 5 images over 5 minutes, each gets its own 60-second poll budget.</p>

          <h3>Why 4-second cadence (frontend) vs 1.6-second (server-side)</h3>
          <p>Different concerns:</p>
          <ul>
            <li><strong>Server poll</strong>: as fast as Azure tolerates without rate limiting. Optimizes total OCR latency.</li>
            <li><strong>Frontend poll</strong>: as slow as user experience tolerates without "stale UI" feel. Optimizes server load (fewer DB hits).</li>
          </ul>

          <p>4 seconds means the user sees the OCR result within ~4 seconds of completion. Acceptable.</p>

          <h3>Why 60-second cap</h3>
          <p>Server-side OCR caps at 40 seconds. Frontend caps at 60 seconds. The 20-second buffer absorbs network round-trip latency. If the server-side OCR succeeds, the frontend sees it within 60 seconds. If it doesn't (server hang, network issue), the frontend stops polling — better than spinning forever.</p>

          <h3>The alternative — Server-Sent Events</h3>
          <p>SSE (covered in the Express 5 guide §8) would push status updates to the frontend in real-time, no polling needed. Trade-off:</p>
          <ul>
            <li>SSE requires an open HTTP connection per active client.</li>
            <li>Polling is stateless on the server.</li>
            <li>For a single-user household app, polling is simpler.</li>
          </ul>

          <p>If Tabloom needed real-time updates from multiple users on shared notebooks, SSE would be the upgrade. Not currently the case.</p>

          <h3>The user experience</h3>
          <p>What the user actually sees:</p>
          <ol>
            <li>Pick an image from their device.</li>
            <li>Drag/drop into the editor (or paste).</li>
            <li>Image appears in the editor immediately (~500ms upload).</li>
            <li>An "Indexing…" pill shows on the image (status='indexing').</li>
            <li>~5-10 seconds later, pill disappears. OCR text is in the media row (visible in the side panel).</li>
          </ol>

          <p>For the user, OCR is invisible plumbing. They see the image, edit around it, and the text-extraction happens silently.</p>
        </section>

        <hr />

        {/* SECTION 9 — DISABLED MODE */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Graceful Disabled Mode</h2>
          <p>If Azure CV isn't configured, Tabloom still works — uploads are just marked <code>indexed</code> immediately with empty OCR text. Critical: the absence of OCR isn't a fatal error.</p>

          <h3>The detection</h3>
          <CodePre>{`// tabloom/lib/ocr.js — verbatim
const ENDPOINT = (process.env.AZURE_VISION_ENDPOINT ?? '').replace(/\\/+$/, '')
const KEY = process.env.AZURE_VISION_KEY ?? ''
const ENABLED = Boolean(ENDPOINT && KEY)

if (ENABLED) {
  console.log(\`[ocr] Azure CV enabled at \${ENDPOINT}\`)
} else {
  console.warn("[ocr] AZURE_VISION_ENDPOINT / _KEY not set — OCR disabled, uploads will be marked 'indexed' immediately.")
}

export function ocrEnabled() {
  return ENABLED
}

export async function runOcr(absoluteFilePath) {
  if (!ENABLED) return { status: 'indexed', ocr: '' }
  // ... actual OCR ...
}`}</CodePre>

          <p>The <code>ENABLED</code> boolean is computed once at module load. If either env var is empty/missing, OCR is off for the lifetime of the process.</p>

          <h3>Why "indexed" instead of "disabled"</h3>
          <CodePre>{`if (!ENABLED) return { status: 'indexed', ocr: '' }`}</CodePre>

          <p>The frontend UI was designed around three states (indexing, indexed, failed). Adding a fourth ("disabled") would mean UI changes. Returning <code>indexed</code> with empty OCR text means:</p>
          <ul>
            <li>The UI doesn't show an "Indexing…" pill.</li>
            <li>The OCR text panel shows empty (or just nothing).</li>
            <li>The user can't tell OCR is disabled — they just see no extracted text.</li>
          </ul>

          <p>For a personal app where the operator knows whether they configured OCR, this is fine. For a SaaS, you'd want to explicitly tell users "OCR not available."</p>

          <h3>The upload route's behavior</h3>
          <CodePre>{`const initialStatus = ocrEnabled() ? 'indexing' : 'indexed'`}</CodePre>

          <p>If OCR is disabled, the row is created already-indexed. No background work scheduled. The image is uploaded, the row is final, response goes out.</p>

          <h3>What this enables</h3>
          <ul>
            <li><strong>Local dev without Azure CV</strong>: Tabloom devs can run the app locally with no <code>AZURE_VISION_*</code> env vars. Image uploads work; just no OCR.</li>
            <li><strong>Cost-conscious operators</strong>: someone running Tabloom for personal use can choose not to provision Azure CV. The app degrades gracefully.</li>
            <li><strong>Faster CI / e2e tests</strong>: skip env vars; everything else works.</li>
          </ul>

          <h3>The pattern, generalized</h3>
          <p>"Disable optional features when their config is missing, with a clear log message." Applies to:</p>
          <ul>
            <li>SendGrid (PulseWire): if <code>SENDGRID_API_KEY</code> missing, log alerts to console instead of emailing.</li>
            <li>Anthropic (Hearth recipe AI): if <code>ANTHROPIC_API_KEY</code> missing, return 503 from AI routes.</li>
            <li>Plex (Hearth): if <code>PLEX_TOKEN</code> missing — Hearth refuses to start (Plex is core; opinionated choice).</li>
          </ul>

          <p>The decision per feature: is this core to the app or a nice-to-have? Tabloom's OCR is nice-to-have → graceful disable. Hearth's Plex is core → fail-loud.</p>

          <h3>The log line</h3>
          <CodePre>{`console.warn("[ocr] AZURE_VISION_ENDPOINT / _KEY not set — OCR disabled, uploads will be marked 'indexed' immediately.")`}</CodePre>

          <p>Helpful + actionable. A developer running locally sees this once at startup and knows what's happening. Better than silent disabling.</p>
        </section>

        <hr />

        {/* SECTION 10 — ALTERNATIVES */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Alternatives Considered</h2>
          <p>Five other OCR options that Tabloom could have chosen. Each has reasonable use cases; Tabloom picked Azure CV for specific reasons.</p>

          <h3>The five alternatives</h3>
          <table>
            <tbody>
              <tr><th>Option</th><th>Trade-off</th><th>When right</th></tr>
              <tr><td><strong>Azure CV (Tabloom's pick)</strong></td><td>Async + reliable + fair pricing</td><td>App on Azure; budget cost-conscious</td></tr>
              <tr><td>Google Cloud Vision</td><td>Best accuracy, similar pricing</td><td>App on GCP; or you've evaluated and it's better for your text type</td></tr>
              <tr><td>AWS Textract</td><td>Strong on forms / tables, premium price</td><td>App on AWS; you OCR receipts/invoices</td></tr>
              <tr><td>Tesseract (self-hosted)</td><td>Free, offline, slower, less accurate</td><td>No cloud budget; privacy-required</td></tr>
              <tr><td>GPT-4o / Claude with vision</td><td>Slow, expensive, but bonus understanding</td><td>You need both OCR AND interpretation</td></tr>
              <tr><td>PaddleOCR (self-hosted ML)</td><td>Free, good accuracy, ops complexity</td><td>You have ML infra + want best free option</td></tr>
            </tbody>
          </table>

          <h3>Why Azure CV specifically</h3>
          <ul>
            <li><strong>Already on Azure</strong>: Tabloom's resource group has the entire fleet in <code>eastus</code>. One more Cognitive Services resource is zero operational addition.</li>
            <li><strong>Cost</strong>: F0 tier is free (5K calls/month). Personal-app scale fits comfortably. S1 is ~$1/1K calls — bearable if you grow.</li>
            <li><strong>Async-by-default</strong>: matches the upload flow naturally. No timeout dance.</li>
            <li><strong>Multi-language</strong>: supports 70+ languages out of the box.</li>
            <li><strong>Reliable</strong>: Azure Cognitive Services SLA is 99.9%. Outages happen but they're rare.</li>
          </ul>

          <h3>Why NOT Tesseract</h3>
          <p>Tesseract (npm: <code>tesseract.js</code> or native binary) would let Tabloom skip the cloud entirely. Why not:</p>
          <ul>
            <li><strong>Accuracy</strong>: substantially lower than Azure CV on handwriting and stylized fonts.</li>
            <li><strong>Latency</strong>: slow on weak CPUs (App Service B1 has limited cores).</li>
            <li><strong>Bundle size</strong>: Tesseract WASM is ~30MB. App Service container would balloon.</li>
            <li><strong>Memory</strong>: each OCR pass needs ~200MB. B1 has 1.75GB total; you'd starve the rest of the app.</li>
          </ul>

          <p>Self-hosted OCR is right when you have dedicated hardware. Not for a fleet app on B1.</p>

          <h3>Why NOT a vision LLM</h3>
          <p>Claude / GPT-4o with image input can OCR. Tabloom could send the image to its existing AI pipeline. Why not:</p>
          <ul>
            <li><strong>Cost</strong>: a vision LLM call is ~$0.01-$0.05 per image. Azure CV is ~$0.001 (1000× cheaper).</li>
            <li><strong>Latency</strong>: LLMs take 5-15 seconds per call. Azure CV is 2-5s.</li>
            <li><strong>Accuracy for plain OCR</strong>: comparable to Azure CV for printed text. Worse for handwriting in some cases.</li>
            <li><strong>Bonus features unused</strong>: LLMs offer "describe what's in the image" — Tabloom doesn't need that today.</li>
          </ul>

          <p>If Tabloom ever adds "what does this picture show?" as a feature, LLM-with-vision is the natural fit. For OCR-only, the specialist wins.</p>

          <h3>Why NOT the Azure SDK</h3>
          <p>Microsoft ships <code>@azure/ai-vision-image-analysis</code>. Tabloom uses raw fetch. Why:</p>
          <ul>
            <li><strong>Read API v3.2 is the older async surface</strong>. The SDK targets the newer v4 (sync). Tabloom needs v3.2's async pattern.</li>
            <li><strong>Bundle size</strong>: the SDK pulls in ~500KB. Fetch is built-in.</li>
            <li><strong>Less code</strong>: Tabloom's <code>lib/ocr.js</code> is ~80 lines. SDK version would be similar but with more abstraction.</li>
            <li><strong>Easier to update</strong>: if Azure changes a header or query param, you change one line; SDK requires a version bump.</li>
          </ul>

          <p>The SDK is the right choice when the SDK adds typed safety, automatic retries, or features you'd otherwise reimplement. For a simple 2-call (submit + poll) pattern, raw fetch is cleaner.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — OCR a File from Disk</h2>
          <p>Stand up an OCR client against Azure CV using raw fetch. End-to-end: provision the resource (or skip if you have one), wire env vars, OCR a real image. ~20 minutes.</p>

          <h3>Step 1 — Get an Azure CV resource</h3>
          <ol>
            <li>Azure portal → Create resource → "Computer Vision".</li>
            <li>Pick F0 (Free) tier — sufficient for the lab.</li>
            <li>Region: any in your closest country (eastus / westeurope / etc.).</li>
            <li>Once provisioned, open Keys + Endpoint.</li>
            <li>Copy Endpoint URL and Key 1.</li>
          </ol>

          <h3>Step 2 — Scaffold</h3>
          <CodePre>{`mkdir ocr-lab && cd ocr-lab
npm init -y
npm pkg set type=module
npm i dotenv`}</CodePre>

          <CodePre>{`# .env
AZURE_VISION_ENDPOINT=https://YOUR-RESOURCE.cognitiveservices.azure.com
AZURE_VISION_KEY=YOUR_KEY_1`}</CodePre>

          <h3>Step 3 — A test image</h3>
          <p>Grab any image with text in it. Options:</p>
          <ul>
            <li>Screenshot of this page.</li>
            <li>Photo of a book cover.</li>
            <li>This sample: <code>curl -o sample.png https://aka.ms/vision-sample-en</code> (Microsoft's official sample).</li>
          </ul>

          <p>Save as <code>sample.png</code> (or whatever name; you'll pass it).</p>

          <h3>Step 4 — lib/ocr.js</h3>
          <CodePre>{`// lib/ocr.js
import { readFile } from 'fs/promises'

const ENDPOINT = (process.env.AZURE_VISION_ENDPOINT ?? '').replace(/\\/+$/, '')
const KEY = process.env.AZURE_VISION_KEY ?? ''

if (!ENDPOINT || !KEY) {
  throw new Error('Set AZURE_VISION_ENDPOINT and AZURE_VISION_KEY in .env')
}

export async function runOcr(filePath) {
  const bytes = await readFile(filePath)

  // 1. SUBMIT
  const submit = await fetch(\`\${ENDPOINT}/vision/v3.2/read/analyze\`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: bytes,
  })

  if (submit.status !== 202) {
    const text = await submit.text().catch(() => '')
    throw new Error(\`submit failed: \${submit.status} \${text}\`)
  }

  const opLocation = submit.headers.get('operation-location')
  if (!opLocation) throw new Error('no operation-location header')
  console.log(\`[ocr] submitted, polling: \${opLocation}\`)

  // 2. POLL
  for (let attempt = 0; attempt < 25; attempt++) {
    await new Promise(r => setTimeout(r, 1600))
    const pollRes = await fetch(opLocation, {
      headers: { 'Ocp-Apim-Subscription-Key': KEY },
    })
    if (!pollRes.ok) continue
    const body = await pollRes.json().catch(() => null)
    const status = body?.status
    console.log(\`  attempt \${attempt + 1}: status=\${status}\`)
    if (status === 'succeeded') {
      const lines = []
      for (const r of body.analyzeResult?.readResults ?? []) {
        for (const l of r.lines ?? []) {
          if (l.text) lines.push(l.text)
        }
      }
      return lines.join('\\n')
    }
    if (status === 'failed') throw new Error('OCR failed')
  }

  throw new Error('OCR timed out after 25 attempts')
}`}</CodePre>

          <h3>Step 5 — main.js</h3>
          <CodePre>{`// main.js
import 'dotenv/config'
import { runOcr } from './lib/ocr.js'

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node main.js <file.png>')
  process.exit(1)
}

const start = Date.now()
const text = await runOcr(filePath)
const elapsed = ((Date.now() - start) / 1000).toFixed(2)

console.log(\`\\n[ocr] completed in \${elapsed}s\`)
console.log('---')
console.log(text)
console.log('---')`}</CodePre>

          <h3>Step 6 — Run it</h3>
          <CodePre>{`node main.js sample.png

# Expected output:
# [ocr] submitted, polling: https://.../analyzeResults/...
#   attempt 1: status=running
#   attempt 2: status=running
#   attempt 3: status=succeeded
# [ocr] completed in 4.82s
# ---
# (the recognized text)
# ---`}</CodePre>

          <h3>Step 7 — Try edge cases</h3>
          <ul>
            <li><strong>Image with no text</strong>: a photo of a flower. The result should be empty or just noise.</li>
            <li><strong>Handwriting</strong>: photo of a handwritten note. Should work for English.</li>
            <li><strong>Multi-language</strong>: a page in Japanese / Arabic / Cyrillic. Should also work.</li>
            <li><strong>Multi-page PDF</strong>: download a PDF; v3.2 supports it. Iterate over <code>readResults</code> for each page.</li>
            <li><strong>Tiny image</strong>: smaller than 50px. Likely returns "failed" — Azure has minimum sizes.</li>
            <li><strong>Huge image</strong>: 8K resolution. May hit 413 (too large) or just take longer.</li>
          </ul>

          <h3>Step 8 — Try with the Free tier limits</h3>
          <p>F0 allows 20 calls/min. Fire 30 calls in a tight loop:</p>
          <CodePre>{`// rate-test.js
import 'dotenv/config'
import { runOcr } from './lib/ocr.js'

for (let i = 0; i < 30; i++) {
  try {
    const text = await runOcr('sample.png')
    console.log(\`#\${i + 1}: \${text.slice(0, 30)}...\`)
  } catch (e) {
    console.log(\`#\${i + 1}: \${e.message}\`)
  }
}`}</CodePre>

          <p>You'll see successful calls up to ~20, then 429 (Too Many Requests) errors. The pattern teaches respect for rate limits.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated Tabloom's entire OCR pipeline: submit, poll, extract. Substitute the file with bytes
              from multer's req.file + the prepared statement to UPDATE a media row, and you're at Tabloom's exact
              shape.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"401 Unauthorized"</h3>
          <p>The key is wrong, or it's the wrong key for the wrong endpoint. Verify both come from the same Azure resource.</p>

          <h3>"403 Forbidden"</h3>
          <p>Two causes: (a) quota exhausted on F0 (5K/month), (b) the resource is in a state that doesn't allow OCR. Check the portal.</p>

          <h3>"429 Too Many Requests"</h3>
          <p>Rate limit hit. F0 = 20/min, S1 = ~10/sec. Slow down or upgrade. Tabloom doesn't retry on 429 — for a personal app the throttle is rarely hit.</p>

          <h3>"413 Payload Too Large"</h3>
          <p>Image &gt; 50MB. Pre-resize on the client or server before submitting. Sharp library handles this nicely.</p>

          <h3>OCR returns empty text</h3>
          <p>Three causes:</p>
          <ol>
            <li>Image has no text (e.g., photo of a flower).</li>
            <li>Text is too small / blurry. Azure's confidence is low; lines below threshold get dropped.</li>
            <li>Language Azure doesn't support — though it supports most major ones.</li>
          </ol>

          <h3>"operation-location header missing"</h3>
          <p>Unexpected. The submit returned 202 but no header. Treat as failed; investigate Azure portal logs.</p>

          <h3>Poll returns "succeeded" but the text is missing</h3>
          <p>Check the structure: the text is under <code>analyzeResult.readResults[].lines[].text</code>. If you typo'd a level, you'd get empty results from valid OCR.</p>

          <h3>OCR works locally but fails on App Service</h3>
          <p>Likely: env vars aren't set on App Service. Set <code>AZURE_VISION_ENDPOINT</code> and <code>AZURE_VISION_KEY</code> as Application Settings + restart.</p>

          <h3>The 4-second frontend poll feels too slow</h3>
          <p>Drop to 2 seconds. The trade-off: more API calls. For Tabloom's scale (1-2 users), either works.</p>

          <h3>"status='indexing' rows pile up after a server restart"</h3>
          <p>Documented limitation (§6). Two mitigations: (a) periodic sweep to mark stale rows as 'failed', (b) move OCR to graphile-worker so jobs persist.</p>

          <h3>I want to retry an OCR</h3>
          <p>Tabloom doesn't expose a retry UI. Two options: (a) delete + re-upload, (b) add a server endpoint that calls <code>runOcr</code> again on an existing row + updates with the result.</p>

          <h3>"The bundle imports Azure SDK and it's huge"</h3>
          <p>Don't import the SDK. Raw fetch is the right call (Tabloom's pattern). The SDK's only benefit is typed responses + retry logic — replicate in your own code in ~30 lines.</p>

          <h3>How do I OCR a multi-page PDF?</h3>
          <p>Send the PDF bytes the same way as an image. The response's <code>analyzeResult.readResults</code> array has one entry per page. Iterate and concat.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Provisioning</h3>
          <CodePre>{`# Azure CLI
az cognitiveservices account create \\
  --name my-cv \\
  --resource-group rg-personal-apps-prod \\
  --kind ComputerVision \\
  --sku F0 \\
  --location eastus

# Get endpoint + key
az cognitiveservices account show \\
  --name my-cv -g rg-personal-apps-prod \\
  --query properties.endpoint -o tsv
az cognitiveservices account keys list \\
  --name my-cv -g rg-personal-apps-prod \\
  --query key1 -o tsv`}</CodePre>

          <h3>Submit</h3>
          <CodePre>{`const submit = await fetch(\`\${ENDPOINT}/vision/v3.2/read/analyze\`, {
  method: 'POST',
  headers: {
    'Ocp-Apim-Subscription-Key': KEY,
    'Content-Type': 'application/octet-stream',
  },
  body: bytes,
})

if (submit.status !== 202) throw new Error('submit failed')
const opLocation = submit.headers.get('operation-location')`}</CodePre>

          <h3>Poll</h3>
          <CodePre>{`for (let attempt = 0; attempt < 25; attempt++) {
  await new Promise(r => setTimeout(r, 1600))
  const r = await fetch(opLocation, { headers: { 'Ocp-Apim-Subscription-Key': KEY } })
  if (!r.ok) continue
  const body = await r.json()
  if (body.status === 'succeeded') {
    return body.analyzeResult.readResults
      .flatMap(p => p.lines.map(l => l.text))
      .join('\\n')
  }
  if (body.status === 'failed') throw new Error('OCR failed')
}
throw new Error('OCR timed out')`}</CodePre>

          <h3>media schema</h3>
          <CodePre>{`CREATE TABLE media (
  id          INTEGER PRIMARY KEY,
  ocr         TEXT,
  status      TEXT NOT NULL DEFAULT 'indexing',  -- 'indexing' | 'indexed' | 'failed'
  file_path   TEXT,
  ...
)`}</CodePre>

          <h3>Fire-and-forget from upload</h3>
          <CodePre>{`const id = insertMedia.run({ status: 'indexing', ... }).lastInsertRowid
res.status(201).json(...)            // ← respond FIRST

runOcr(filePath).then((result) => {
  finalizeOcr.run({ id, ocr: result.ocr, status: result.status })
})`}</CodePre>

          <h3>Frontend poll</h3>
          <CodePre>{`useEffect(() => {
  if (indexingCount === 0) return
  const start = Date.now()
  const tick = setInterval(() => {
    if (Date.now() - start > 60_000) { clearInterval(tick); return }
    refreshMedia()
  }, 4000)
  return () => clearInterval(tick)
}, [indexingCount])`}</CodePre>

          <h3>Graceful disabled</h3>
          <CodePre>{`export function ocrEnabled() { return Boolean(ENDPOINT && KEY) }

export async function runOcr(path) {
  if (!ocrEnabled()) return { status: 'indexed', ocr: '' }
  // ... actual OCR ...
}`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>The full OCR helper</td><td>tabloom · <code>lib/ocr.js</code> (full file)</td></tr>
              <tr><td>media table schema</td><td>tabloom · <code>server.js</code> (CREATE TABLE media)</td></tr>
              <tr><td>Upload route + fire-and-forget</td><td>tabloom · <code>server.js</code> POST /api/media</td></tr>
              <tr><td>finalizeOcr prepared statement</td><td>tabloom · <code>server.js</code> (db.prepare line)</td></tr>
              <tr><td>Frontend poll hook</td><td>tabloom · <code>src/routes/PageView/MediaTab.tsx</code></td></tr>
              <tr><td>Env detection + graceful disable</td><td>tabloom · <code>lib/ocr.js</code> (ENABLED + ocrEnabled)</td></tr>
              <tr><td>The 1.6s poll interval</td><td>tabloom · <code>lib/ocr.js</code> (25 × 1600ms)</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — Phase 2 is complete.</p>
        </section>
      </main>
    </div>
  );
}
