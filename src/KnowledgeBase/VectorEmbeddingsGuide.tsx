import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                    icon: '🧠' },
  { id: 's2',  num: '2',  title: 'What is an Embedding',            icon: '📐' },
  { id: 's3',  num: '3',  title: 'Voyage AI vs OpenAI',             icon: '⚖️' },
  { id: 's4',  num: '4',  title: 'Document vs Query Input Type',    icon: '🎯' },
  { id: 's5',  num: '5',  title: 'Storage: BLOB vs pgvector',       icon: '💾' },
  { id: 's6',  num: '6',  title: 'Cosine = Dot Product',            icon: '🔢' },
  { id: 's7',  num: '7',  title: "Tabloom's Embed Worker",          icon: '⚙️' },
  { id: 's8',  num: '8',  title: 'PulseWire embed-article',         icon: '📰' },
  { id: 's9',  num: '9',  title: 'Hash-Based Re-Embed Skip',        icon: '🔁' },
  { id: 's10', num: '10', title: 'Cost + Scaling',                  icon: '💰' },
  { id: 's11', num: '★',  title: 'Lab: Build a Semantic Search',    icon: '🛠️' },
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

export default function VectorEmbeddingsGuide() {
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
            <span className="sidebar-title">Vector Embeddings</span>
          </div>
          <div className="sidebar-sub">Tabloom + PulseWire semantic search</div>
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
          <div className="hero-tag">📐 Voyage AI · pgvector · 2026</div>
          <h1>Vector Embeddings<br />and Semantic Search</h1>
          <p>
            Two apps ship semantic search: <strong style={{ color: '#C77AA0' }}>Tabloom</strong> embeds notebook pages
            with Voyage AI and stores 1024-D vectors as SQLite BLOBs;
            <strong style={{ color: '#C77AA0' }}> PulseWire</strong> embeds news articles with Azure AI Foundry
            (text-embedding-3-small) and stores 1536-D vectors in pgvector. Different stacks, same problem.
            This guide is the deep dive: what an embedding actually IS, why "document" vs "query" input types matter,
            the hash-based re-embed skip, BLOB vs pgvector tradeoffs, and the background-worker patterns that keep
            embeddings up to date without blocking saves.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Apps shipping it</span></div>
            <div className="hero-stat"><span className="hero-stat-val">1024 / 1536</span><span className="hero-stat-label">Dimensions</span></div>
            <div className="hero-stat"><span className="hero-stat-val">$0.06 / $0.02</span><span className="hero-stat-label">per 1M tokens</span></div>
            <div className="hero-stat"><span className="hero-stat-val">FNV-1a</span><span className="hero-stat-label">Skip hash</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Vector embedding turns a piece of text (or image, or audio) into a list of N numbers — a vector — such that
            "semantically similar" pieces of text end up close to each other in N-dimensional space. The proximity is
            usually measured with <strong>cosine similarity</strong>: the cosine of the angle between two vectors. Once
            you have an embedding for every document in your corpus and an embedding for the user's query, finding the
            most relevant documents reduces to a math problem: which document vectors are most parallel to the query
            vector?
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The semantic latitude/longitude.</strong> Earth maps every place to two numbers (lat, lng). To find
            "places near me," you compute distance. Embeddings do the same thing in 1000+ dimensions: every document
            gets coordinates, and "similar to me" is a distance computation. The dimensions are abstract — coord 142
            might roughly encode "is this about food," coord 591 might encode "is this technical writing" — but you
            never see them; you only see the math.
          </p>
          <p>
            <strong>The library Dewey Decimal.</strong> Old libraries grouped books by topic via Dewey numbers. Two
            books with similar numbers were physically near each other on the shelf — making "browse this section"
            useful. Embeddings are Dewey on steroids: thousands of dimensions instead of one, automatically derived
            from content, no library scientist required.
          </p>
          <p>
            <strong>Keyword search vs semantic search.</strong> Keyword search asks "does this document contain the
            exact words 'kubernetes deployment'?" Semantic search asks "is this document ABOUT kubernetes deployments,
            even if the words it uses are 'k8s rollout' or 'container orchestration'?" The first is a string match;
            the second requires understanding what the words mean. Embeddings encode that meaning.
          </p>

          <h3>What the fleet uses it for</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Use case</th><th>Corpus size</th></tr>
              <tr><td>Tabloom</td><td>Find notebook pages by meaning ("the page where I figured out the Postgres migration")</td><td>Hundreds–thousands of pages per user</td></tr>
              <tr><td>PulseWire</td><td>Dedup near-duplicate news articles + cluster related stories</td><td>Tens of thousands of articles</td></tr>
            </tbody>
          </table>

          <h3>The two halves</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  subgraph indexing
    DOC[Document text] --> EMB[Embedding API]
    EMB --> VEC[1024 / 1536 numbers]
    VEC --> STORE[Storage: BLOB or pgvector]
  end

  subgraph query
    Q[User query] --> EMB2[Embedding API]
    EMB2 --> QVEC[Query vector]
    QVEC --> SIM[Cosine similarity vs all docs]
    SIM --> TOPK[Top K results]
  end

  style EMB fill:#5C2A4A,color:#fff
  style EMB2 fill:#5C2A4A,color:#fff`} />

          <h3>Two halves, two costs</h3>
          <p>
            Indexing is a ONE-TIME cost per document (plus re-embed on edit). Query is a PER-SEARCH cost. Tabloom and
            PulseWire both shape their architectures around this: indexing runs in a background worker (latency doesn't
            matter), querying runs on the request path (latency matters a lot).
          </p>

          <h3>Embeddings are not "intelligence"</h3>
          <p>
            An embedding model is a much smaller, much cheaper model than a chat model. Voyage's voyage-3 is ~$0.06
            per 1M tokens; gpt-5 chat is ~$5 input + $15 output per 1M. Two orders of magnitude cheaper. They don't
            "think" — they encode. The intelligence is in how you USE the encoding.
          </p>

          <h3>What semantic search adds over keyword</h3>
          <ul>
            <li><strong>Synonym tolerance</strong>: searching "lr" finds "learning rate."</li>
            <li><strong>Paraphrase</strong>: "how do I make my server faster" finds "performance tuning."</li>
            <li><strong>Conceptual queries</strong>: "the time I broke production" finds the incident postmortem even though it never says "broke."</li>
            <li><strong>Cross-lingual</strong> (with the right model): "fromage" finds "cheese."</li>
          </ul>

          <h3>What it doesn't fix</h3>
          <ul>
            <li>Exact-match needs (find the document with ID 12345) — keyword wins.</li>
            <li>Rare named entities ("RFC 8259") that don't appear in training data — keyword wins.</li>
            <li>Boolean operators ("kubernetes NOT docker") — keyword wins.</li>
          </ul>

          <p>The right answer in 2026 is usually <strong>hybrid</strong>: BM25 (keyword) + embedding cosine, then re-rank. Tabloom doesn't do hybrid yet — pure semantic. PulseWire uses dedup-by-cosine but article search itself is FTS + dates.</p>
        </section>

        <hr />

        {/* SECTION 2 — WHAT IS AN EMBEDDING */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>What is an Embedding</h2>
          <p>An embedding is a 1D array of floating-point numbers. That's it. For a 1024-dim model, it's 1024 floats. For 1536-dim, 1536 floats. Always the same length for a given model.</p>

          <h3>What it looks like</h3>
          <CodePre>{`{
  "data": [
    {
      "embedding": [
        -0.0034, 0.0521, -0.0118, 0.0237, /* ... 1024 numbers total ... */,
        -0.0042, 0.0019
      ],
      "index": 0
    }
  ],
  "usage": { "total_tokens": 247 }
}`}</CodePre>

          <p>Most modern embedding models return <strong>L2-normalized</strong> vectors — the sum of squares of all components equals 1.0. This is important: §6 explains why it makes similarity computation simpler.</p>

          <h3>Dimension counts</h3>
          <table>
            <tbody>
              <tr><th>Model</th><th>Dims</th><th>Bytes per vec (Float32)</th></tr>
              <tr><td>voyage-3</td><td>1024</td><td>4,096</td></tr>
              <tr><td>voyage-3-large</td><td>2048</td><td>8,192</td></tr>
              <tr><td>text-embedding-3-small</td><td>1536</td><td>6,144</td></tr>
              <tr><td>text-embedding-3-large</td><td>3072</td><td>12,288</td></tr>
              <tr><td>OpenAI ada-002 (legacy)</td><td>1536</td><td>6,144</td></tr>
            </tbody>
          </table>

          <p>
            More dimensions ≈ more precision, but with diminishing returns. The OpenAI v3 models support
            "dimension truncation" — you can ask for a 512-dim or 256-dim vector and it works (slightly degraded). The
            small/large split is just a different model; small isn't a truncation of large.
          </p>

          <h3>What semantic similarity actually looks like</h3>
          <p>For the prompts "What is React?" and "Tell me about the React JavaScript library," cosine similarity will be ~0.92 (very close). For "What is React?" and "How do I bake bread?", it'll be ~0.05 (orthogonal). The boundary is fuzzy — in practice, you tune a threshold (Tabloom's is 0.10; anything below is dropped from results).</p>

          <h3>Why the dimensions are abstract</h3>
          <p>
            You can't look at the 142nd dimension of voyage-3 and say "this measures verbosity." The model learned a
            representation that's optimized for retrieval — there's no human-interpretable axis. Studies have shown
            that SOME dimensions correlate with semantic concepts after lots of analysis, but you can't use them as
            features.
          </p>

          <h3>Float32 vs Int8 (quantization)</h3>
          <p>Voyage offers Int8 quantized embeddings — same vector, but each number is an 8-bit int instead of a 32-bit float. 4× storage saving. Accuracy drop is &lt;1% in retrieval quality. For very large corpora (millions of documents), quantization is the difference between fitting in RAM and not.</p>

          <p>Neither Tabloom nor PulseWire quantize today. Their corpora are small enough that Float32 is fine. Worth revisiting at 1M+ documents.</p>
        </section>

        <hr />

        {/* SECTION 3 — VOYAGE VS OPENAI */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Voyage AI vs OpenAI</h2>
          <p>The fleet picked two different providers for two different reasons.</p>

          <h3>Tabloom → Voyage AI (voyage-3)</h3>
          <ul>
            <li><strong>Cheapest production-grade embedding</strong>: $0.06 per 1M tokens (vs $0.13 for text-embedding-3-small).</li>
            <li><strong>Asymmetric query / document optimization</strong> via <code>input_type</code> hint (§4 — huge for retrieval quality).</li>
            <li><strong>1024 dims</strong> = 4KB per vector. Compact.</li>
            <li><strong>Up to 128 inputs per batch</strong>.</li>
            <li><strong>L2-normalized output</strong>.</li>
            <li><strong>Direct REST API</strong>, no SDK required.</li>
          </ul>

          <h3>PulseWire → Azure AI Foundry text-embedding-3-small</h3>
          <ul>
            <li><strong>Already in the OpenAI SDK</strong> — PulseWire uses it for chat too, so no second provider.</li>
            <li><strong>1536 dims</strong> = 6KB per vector.</li>
            <li><strong>Same cost cap infrastructure</strong> — <code>withAiCallLog</code> + <code>AiPausedError</code> works seamlessly because it goes through the same client.</li>
            <li><strong>Cluster of Azure compliance benefits</strong> that align with how PulseWire is deployed.</li>
          </ul>

          <h3>Tabloom's Voyage config — verbatim</h3>
          <CodePre>{`// tabloom/lib/embeddings.js (lines 1-6)
export const VOYAGE_MODEL = "voyage-3";
export const VOYAGE_DIM   = 1024;
const VOYAGE_URL          = "https://api.voyageai.com/v1/embeddings";
const VOYAGE_BATCH        = 64;     // Voyage allows up to 128; 64 keeps requests <10 KB.
const VOYAGE_TIMEOUT      = 30_000; // big docs occasionally take a few seconds.`}</CodePre>

          <h3>PulseWire's Foundry embed call — verbatim</h3>
          <CodePre>{`// pulsewire/src/lib/ai/embed.ts (lines 6-26)
export async function embedOne(routeOrJob: string, input: string): Promise<number[]> {
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? "unknown")

  const model = env.AZURE_AI_EMBED_DEPLOYMENT
  return withAiCallLog(
    { routeOrJob, model },
    async () => {
      const resp = await foundry().embeddings.create({
        model,
        input,
      })
      const vec = resp.data[0]?.embedding
      if (!vec) throw new Error("embed: empty response")
      return {
        data: vec,
        inputTokens: resp.usage?.prompt_tokens ?? 0,
        outputTokens: 0,
      }
    },
  )
}`}</CodePre>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th></th><th>voyage-3 (Tabloom)</th><th>text-embedding-3-small (PulseWire)</th></tr>
              <tr><td>Dimensions</td><td>1024</td><td>1536</td></tr>
              <tr><td>Bytes / vec</td><td>4,096</td><td>6,144</td></tr>
              <tr><td>Cost / 1M tokens</td><td>$0.06</td><td>$0.02 (per PulseWire's MODEL_PRICING)</td></tr>
              <tr><td>Max input</td><td>32k tokens</td><td>8k tokens</td></tr>
              <tr><td>Batch size</td><td>up to 128</td><td>up to 2048</td></tr>
              <tr><td>input_type hint</td><td>"document" / "query"</td><td>none (symmetric)</td></tr>
              <tr><td>L2-normalized</td><td>yes</td><td>yes</td></tr>
              <tr><td>SDK</td><td>none (direct REST)</td><td>openai SDK</td></tr>
            </tbody>
          </table>

          <h3>Which to pick</h3>
          <ul>
            <li>If you're already using OpenAI / Azure OpenAI / Foundry for chat → text-embedding-3-small is the path of least resistance.</li>
            <li>If you're chasing the lowest cost per token AND want the asymmetric optimization → Voyage.</li>
            <li>If you need to embed code → Voyage's <code>voyage-code-3</code> is specialized.</li>
            <li>If you need to embed images → Cohere, Voyage Multimodal, or OpenAI's CLIP-style endpoints.</li>
          </ul>

          <h3>The third option: bge-base / nomic-embed</h3>
          <p>Open-source embedding models run locally with no per-token cost — popular for self-hosted use cases. <code>bge-base-en-v1.5</code> at 768 dims is competitive with paid models on most benchmarks. The cost is the operational overhead of running a model server (~2GB RAM, ~150ms per embed on CPU). Tabloom and PulseWire chose paid APIs because their volume is too low to justify the ops.</p>
        </section>

        <hr />

        {/* SECTION 4 — INPUT TYPE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Document vs Query Input Type</h2>
          <p>Voyage's <code>input_type</code> parameter is one of the most underrated features in commercial embeddings. It tells the model whether a piece of text is a DOCUMENT (something to be indexed) or a QUERY (something to be matched against documents). The model produces different vectors for the same text depending on which role it plays.</p>

          <h3>Why this works</h3>
          <p>
            Queries and documents have different distributions. A document might be 5000 tokens of detailed prose. A
            query might be 6 tokens: "kubernetes pod restart." If you embed them in the same "space," queries cluster
            near each other (short, terse) and documents cluster near each other (long, verbose). The cosine between
            them is dragged down by their style differences, not their topic differences.
          </p>
          <p>
            Voyage trains two slightly different "heads" on top of the same backbone — one optimized for embedding
            documents in a way that's queryable, one for embedding queries in a way that pulls the right documents. The
            difference is significant: published benchmarks show ~5–15% retrieval-quality improvement vs symmetric
            embedding for the same model.
          </p>

          <h3>Tabloom's usage</h3>
          <CodePre>{`// tabloom/lib/embeddings.js (lines 68-77)
export async function embedQuery(text) {
  if (!text || !text.trim()) {
    throw new Error("embedQuery: text required")
  }
  const result = await callVoyage({ input: [text.slice(0, 32_000)], inputType: "query" })
  const vec = result.data?.[0]?.embedding
  if (!Array.isArray(vec)) {
    throw new Error("Voyage returned no embedding")
  }
  return { vector: new Float32Array(vec), tokens: result.usage?.total_tokens ?? 0, model: VOYAGE_MODEL }
}`}</CodePre>

          <CodePre>{`// tabloom/lib/embeddings.js (lines 79-100)
export async function embedDocuments(texts) {
  const inputs = texts.map((t) => (t ?? "").slice(0, 32_000)).filter((t) => t.length > 0)
  if (inputs.length === 0) return { vectors: [], tokens: 0, model: VOYAGE_MODEL }

  const vectors = new Array(inputs.length)
  let totalTokens = 0

  for (let i = 0; i < inputs.length; i += VOYAGE_BATCH) {
    const batch = inputs.slice(i, i + VOYAGE_BATCH)
    const result = await callVoyage({ input: batch, inputType: "document" })   // ← "document"
    totalTokens += result.usage?.total_tokens ?? 0
    for (const row of result.data ?? []) {
      vectors[i + row.index] = new Float32Array(row.embedding)
    }
  }
  return { vectors, tokens: totalTokens, model: VOYAGE_MODEL }
}`}</CodePre>

          <h3>Critical rule: be consistent</h3>
          <p>
            If you embed your index with <code>input_type: "document"</code>, you MUST embed your queries with
            <code>input_type: "query"</code>. Mixing them (or omitting them entirely) drops retrieval quality. This is
            the most common subtle bug in semantic search systems built on Voyage.
          </p>

          <h3>OpenAI's text-embedding-3 doesn't have this</h3>
          <p>
            OpenAI's models are <strong>symmetric</strong> — same embedding regardless of role. PulseWire calls
            <code>embeddings.create({"{ input }"})</code> with no role hint. The model still works fine; you just leave
            ~10% retrieval quality on the table compared to Voyage. Whether that matters depends on your use case.
          </p>

          <h3>Tabloom's query flow</h3>
          <CodePre>{`// tabloom/server.js (lines 2677-2700)
if (mode === "semantic") {
  if (!embeddingsEnabled()) {
    return res.status(503).json({ /* ... */ })
  }
  const qResult = await embedQuery(q)                  // ← "query" type
  logAiCall(req, "search:semantic", {
    model: qResult.model,
    usage: { input_tokens: qResult.tokens, output_tokens: 0 },
    elapsedMs: 0,
  })
  const rows = stmts.listAllEmbeddings.all().filter((r) => accessibleNbIds.has(r.notebook_id))
  const scored = rows.map((r) => {
    const vec = blobToVec(r.vec)                       // ← documents were "document" type
    return {
      pageId: String(r.page_id),
      score: cosine(qResult.vector, vec),
      // ...
    }
  })
  scored.sort((a, b) => b.score - a.score)
  const results = scored.slice(0, limit).filter((s) => s.score > 0.1)
  return res.json({ mode, query: q, results, model: VOYAGE_MODEL })
}`}</CodePre>

          <p>Search query → query vector. Stored docs (already embedded as "document") → loaded from BLOB. Cosine, sort, filter by 0.1 threshold, top K.</p>
        </section>

        <hr />

        {/* SECTION 5 — STORAGE */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Storage: BLOB vs pgvector</h2>
          <p>The fleet shows both strategies. Each is right for its app.</p>

          <h3>Tabloom: SQLite BLOB</h3>
          <CodePre>{`-- tabloom/server.js (schema, lines 255-263)
CREATE TABLE IF NOT EXISTS page_embeddings (
  page_id     INTEGER PRIMARY KEY,
  model       TEXT NOT NULL,
  dim         INTEGER NOT NULL,
  vec         BLOB NOT NULL,             -- 4 KB for voyage-3
  hash        TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);`}</CodePre>

          <h3>Float32 → BLOB → Float32</h3>
          <CodePre>{`// tabloom/lib/embeddings.js (lines 114-130)
export function vecToBlob(vec) {
  const f32 = vec instanceof Float32Array ? vec : new Float32Array(vec)
  const buf = Buffer.allocUnsafe(f32.byteLength)
  buf.set(new Uint8Array(f32.buffer, f32.byteOffset, f32.byteLength))
  return buf
}

export function blobToVec(blob) {
  if (!blob) return null
  const f32 = new Float32Array(blob.length / 4)
  const view = new Uint8Array(f32.buffer)
  view.set(blob)
  return f32
}`}</CodePre>

          <p>
            <strong>What's happening</strong>: a 1024-dim Float32Array is 4×1024 = 4096 bytes. The buffer just COPIES
            those bytes into a Node.js Buffer (which is what better-sqlite3 binds for BLOB columns). On read, the
            reverse — interpret the BLOB bytes as Float32. Zero allocations beyond the buffers themselves.
          </p>

          <h3>How Tabloom queries</h3>
          <p>
            On every semantic search: load ALL the user's accessible embeddings, compute cosine vs query in JavaScript,
            sort, slice. For Tabloom's per-user scale (hundreds to thousands of pages), this is &lt;5ms even with
            naive iteration. The simplicity is worth it.
          </p>

          <h3>When BLOB stops scaling</h3>
          <ul>
            <li>Above ~50,000 documents per shard, JS cosine iteration becomes noticeable.</li>
            <li>If you need cross-user search (e.g., "all public notebooks"), you can't easily filter before scoring.</li>
            <li>SQLite doesn't have a native vector index.</li>
          </ul>

          <p>At Tabloom's scale, none of these matter. Per-user notebooks have ~hundreds of pages on average.</p>

          <h3>The sqlite-vec extension</h3>
          <p>
            For SQLite users who outgrow BLOB scan, <code>sqlite-vec</code> is a SQLite extension that adds vector
            indexing + native KNN queries to SQLite. It's a single C extension you load at startup. The fleet doesn't
            use it (Tabloom doesn't need it), but it's the obvious next step if BLOB iteration ever bottlenecks.
          </p>

          <h3>PulseWire: pgvector column</h3>
          <CodePre>{`// pulsewire/src/db/schema.ts (lines 109-130, abbreviated)
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  // ... other fields ...
  contentText: text("content_text"),
  embedding: vector("embedding", { dimensions: 1536 }),    // ← pgvector
  // ...
})`}</CodePre>

          <p>
            <code>vector("embedding", &#123; dimensions: 1536 &#125;)</code> is Drizzle ORM's wrapper around pgvector's
            <code>vector(1536)</code> column type. The column stores the array natively in Postgres — no BLOB
            conversion, no application-side scan.
          </p>

          <h3>pgvector queries</h3>
          <CodePre>{`-- Find articles most similar to a query embedding
SELECT id, title, 1 - (embedding <=> $1::vector) as similarity
FROM articles
WHERE embedding IS NOT NULL
ORDER BY embedding <=> $1::vector
LIMIT 20;`}</CodePre>

          <ul>
            <li><strong><code>&lt;=&gt;</code></strong> = cosine distance (NOT similarity — lower is more similar).</li>
            <li><strong><code>1 - (embedding &lt;=&gt; query)</code></strong> = cosine similarity. Higher is closer.</li>
            <li><strong><code>::vector</code></strong> casts a JS array to pgvector's type.</li>
            <li><code>&lt;-&gt;</code> = L2 distance. <code>&lt;#&gt;</code> = inner product. Cosine is the standard choice for L2-normalized vectors.</li>
          </ul>

          <h3>pgvector indexing</h3>
          <p>For large corpora, add an IVFFlat or HNSW index. IVFFlat is what PulseWire uses (covered in depth in the <em>Postgres + pgvector</em> guide):</p>
          <CodePre>{`CREATE INDEX articles_embedding_idx
  ON articles
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);`}</CodePre>

          <h3>When to choose which</h3>
          <table>
            <tbody>
              <tr><th>Need</th><th>Pick</th></tr>
              <tr><td>SQLite + small corpus (per-user)</td><td>BLOB</td></tr>
              <tr><td>SQLite + want fast index</td><td>sqlite-vec extension</td></tr>
              <tr><td>Already on Postgres</td><td>pgvector</td></tr>
              <tr><td>Need cross-table filters before vector scan</td><td>pgvector</td></tr>
              <tr><td>Massive scale (10M+ documents)</td><td>Dedicated vector DB (Pinecone, Qdrant, Weaviate)</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 6 — COSINE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Cosine = Dot Product (when normalized)</h2>
          <p>Cosine similarity sounds intimidating. For L2-normalized vectors, it's just the dot product. That's why Tabloom can implement it in three lines:</p>

          <CodePre>{`// tabloom/lib/embeddings.js (lines 132-137)
export function cosine(a, b) {
  if (!a || !b || a.length !== b.length) return 0
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}`}</CodePre>

          <h3>The math</h3>
          <p>
            Full cosine similarity: <code>cos(θ) = (a · b) / (|a| × |b|)</code>. If both vectors have magnitude 1 (L2-normalized),
            <code>|a| = |b| = 1</code>, so cosine = a · b (dot product).
          </p>
          <p>The dot product is: sum of products of corresponding components. For 1024-dim vectors, that's 1024 multiplies + 1023 adds. Fast.</p>

          <h3>Why L2-normalized vectors are common</h3>
          <ul>
            <li>Cosine = dot product (no division needed at query time).</li>
            <li>"Magnitude" of an embedding is meaningless for retrieval — only direction matters.</li>
            <li>Normalizing the index once at write time is cheap; normalizing every query candidate at read time is expensive.</li>
          </ul>

          <h3>Cosine range</h3>
          <ul>
            <li><strong>+1.0</strong>: vectors point the same direction (identical content).</li>
            <li><strong>0.0</strong>: vectors are orthogonal (unrelated topics).</li>
            <li><strong>−1.0</strong>: vectors point opposite directions (negated meaning — rarely seen in practice).</li>
          </ul>

          <p>Modern embeddings rarely produce truly orthogonal pairs. The practical range is more like 0.0 to 1.0, with 0.3 being "vaguely related," 0.6 being "topically similar," and 0.85+ being "essentially the same content."</p>

          <h3>Tabloom's threshold</h3>
          <CodePre>{`const results = scored.slice(0, limit).filter((s) => s.score > 0.1)`}</CodePre>

          <p>0.1 is the floor — anything below is dropped as "not really related." The number was picked empirically. Tabloom tested with real notebooks and found that &lt;0.1 results were noise.</p>

          <h3>Other distance metrics (and why we don't use them)</h3>
          <ul>
            <li><strong>L2 (Euclidean)</strong>: <code>sqrt(sum((a-b)²))</code>. For L2-normalized vectors, L2 distance and cosine similarity are equivalent up to a monotonic transformation. Use cosine.</li>
            <li><strong>Manhattan (L1)</strong>: <code>sum(|a-b|)</code>. Rarely used for embeddings.</li>
            <li><strong>Inner product</strong>: same as dot product. For L2-normalized vectors, identical to cosine.</li>
            <li><strong>Hamming</strong>: only meaningful for binary (1-bit) embeddings.</li>
          </ul>

          <p>For Voyage / OpenAI v3 / text-embedding-ada-002: use cosine (= dot product). Done.</p>

          <h3>SIMD acceleration</h3>
          <p>JavaScript's V8 auto-vectorizes the loop in Tabloom's cosine function. The 1024-multiply-add takes ~3μs per pair. For 1000 documents, that's 3ms. For 100k documents, that's 300ms — at which point you want sqlite-vec or pgvector with an index.</p>

          <h3>The Postgres operator</h3>
          <p>In pgvector, the <code>&lt;=&gt;</code> operator returns cosine DISTANCE (1 - similarity). So:</p>
          <ul>
            <li>Lowest distance = most similar.</li>
            <li>Use <code>ORDER BY embedding &lt;=&gt; $1::vector ASC LIMIT N</code> for top-N.</li>
            <li>Compute similarity as <code>1 - (embedding &lt;=&gt; $1::vector)</code> if you want the 0–1 score.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 7 — TABLOOM WORKER */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Tabloom's Embed Worker</h2>
          <p>
            Embedding every page on save would add 500ms+ to every save request. Tabloom instead runs a background
            "embed worker" — an in-memory queue with a drain ticker — that catches up asynchronously. The pattern is
            elegant: simple to reason about, robust to failure, easy to inspect.
          </p>

          <h3>The full module</h3>
          <CodePre>{`// tabloom/lib/embed-worker.js (verbatim, abbreviated)
export function createEmbedWorker({ db, getPageText }) {
  const queue = new Set()         // ← Set dedups by pageId
  let running = false
  let lastError = null
  let lastSuccessAt = null
  let totalEmbedded = 0
  let totalTokens = 0

  function enqueue(pageId) {
    if (!embeddingsEnabled()) return
    if (!Number.isFinite(pageId)) return
    queue.add(Number(pageId))     // ← O(1) dedup
  }

  async function drain() {
    if (running || !embeddingsEnabled()) return
    if (queue.size === 0) return
    running = true
    try {
      const batch = Array.from(queue).slice(0, SWEEP_BATCH)
      for (const id of batch) queue.delete(id)

      const docs = []
      const ids  = []
      for (const id of batch) {
        const text = getPageText(id)
        if (!text) continue
        const truncated = text.slice(0, MAX_BODY_CHARS)
        const newHash = hashText(truncated)         // ← FNV-1a 32-bit
        const existing = db.prepare("SELECT hash FROM page_embeddings WHERE page_id = ?").get(id)
        if (existing && existing.hash === newHash) continue   // ← skip unchanged
        docs.push(truncated)
        ids.push({ id, hash: newHash })
      }
      if (docs.length === 0) return

      const { vectors, tokens } = await embedDocuments(docs)
      totalTokens += tokens

      const upsert = db.prepare(\`
        INSERT INTO page_embeddings (page_id, model, dim, vec, hash, updated_at)
        VALUES (@page_id, @model, @dim, @vec, @hash, datetime('now'))
        ON CONFLICT(page_id) DO UPDATE SET
          model = excluded.model,
          dim = excluded.dim,
          vec = excluded.vec,
          hash = excluded.hash,
          updated_at = datetime('now')
      \`)
      const tx = db.transaction(() => {
        for (let i = 0; i < ids.length; i++) {
          const vec = vectors[i]
          if (!vec) continue
          upsert.run({
            page_id: ids[i].id,
            model:   VOYAGE_MODEL,
            dim:     VOYAGE_DIM,
            vec:     vecToBlob(vec),
            hash:    ids[i].hash,
          })
          totalEmbedded++
        }
      })
      tx()
      lastError = null
      lastSuccessAt = new Date().toISOString()
    } catch (err) {
      lastError = err.message ?? String(err)
      console.error(\`[embed-worker] drain failed: \${lastError}\`)
    } finally {
      running = false
    }
  }

  function startTicker() {
    setInterval(() => { void drain() }, QUEUE_TICK_MS)   // every 750ms
  }
  // ...
  return { enqueue, sweep, startTicker, stats }
}`}</CodePre>

          <h3>The lifecycle</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant U as User saves page
  participant S as Save handler
  participant Q as In-memory queue (Set)
  participant T as Drain ticker (750ms)
  participant V as Voyage API
  participant DB as SQLite

  U->>S: PUT /pages/:id
  S->>DB: UPDATE pages
  S->>Q: enqueue(pageId)
  S-->>U: 200 (fast)

  Note over T: Tick every 750ms
  T->>Q: drain
  Q->>DB: getPageText for batch
  DB-->>Q: text + existing hash
  Q->>Q: skip if hash matches
  Q->>V: embedDocuments(batch)
  V-->>Q: vectors
  Q->>DB: upsert page_embeddings`} />

          <h3>Why a Set, not a queue</h3>
          <p>
            The dedup is the killer feature. If the user edits page 42 ten times in 30 seconds, only one embedding
            call happens — the last save. A FIFO queue would have to scan-and-skip to dedup; the Set dedups in O(1) on
            insert.
          </p>

          <h3>The running flag</h3>
          <p>
            <code>if (running) return</code> at the top of <code>drain</code> prevents two concurrent drains. If the
            ticker fires while a previous drain is still working (because the embedding API was slow), the second tick
            no-ops. The first drain runs to completion. On the next tick, if there's still work, it runs.
          </p>

          <h3>The hash skip — even cheaper</h3>
          <CodePre>{`const newHash = hashText(truncated)
const existing = db.prepare("SELECT hash FROM page_embeddings WHERE page_id = ?").get(id)
if (existing && existing.hash === newHash) continue`}</CodePre>

          <p>
            Even after enqueueing, if the page's content hash hasn't changed since the last embed, skip. Why does this
            happen? User saves a page, types a typo, saves again, undoes the typo, saves again. Three enqueues, one
            net content change. The hash lets us see that.
          </p>

          <h3>The boot sweep</h3>
          <CodePre>{`async function sweep() {
  if (!embeddingsEnabled()) {
    console.log("[embed-worker] VOYAGE_API_KEY not set - semantic search disabled.")
    return
  }
  const rows = db.prepare(\`
    SELECT p.id FROM pages p
    LEFT JOIN page_embeddings e ON e.page_id = p.id
    WHERE p.deleted_at IS NULL AND e.page_id IS NULL
  \`).all()
  if (rows.length === 0) {
    console.log("[embed-worker] all pages already embedded.")
    return
  }
  console.log(\`[embed-worker] sweep: \${rows.length} page(s) to embed.\`)
  for (let i = 0; i < rows.length; i += SWEEP_BATCH) {
    const slice = rows.slice(i, i + SWEEP_BATCH)
    for (const r of slice) enqueue(r.id)
    await drain()
    if (i + SWEEP_BATCH < rows.length) {
      await new Promise((r) => setTimeout(r, SWEEP_BATCH_DELAY_MS))
    }
  }
  console.log(\`[embed-worker] sweep complete: \${totalEmbedded} embedded, \${totalTokens} tokens.\`)
}`}</CodePre>

          <p>
            On server boot, find every page that doesn't yet have an embedding (or whose embedding is from an older
            model) and enqueue. The 1-second delay between batches prevents Voyage from getting hammered.
          </p>

          <h3>Graceful degradation</h3>
          <p>If <code>VOYAGE_API_KEY</code> is missing, <code>enqueue</code> no-ops, the ticker still runs but never finds work, and the semantic search endpoint returns 503 with a clear message. The app keeps functioning — keyword search still works, the editor still works. Only semantic search is disabled.</p>

          <h3>Stats endpoint</h3>
          <p>Tabloom exposes <code>worker.stats()</code> via an admin endpoint:</p>
          <CodePre>{`{
  enabled: true,
  queued: 3,
  totalEmbedded: 1847,
  totalTokens: 1209847,
  lastError: null,
  lastSuccessAt: "2026-05-27T11:23:14.802Z"
}`}</CodePre>

          <p>This is gold for debugging "did my new page get embedded?" Yes if <code>queued</code> went down and <code>totalEmbedded</code> went up.</p>
        </section>

        <hr />

        {/* SECTION 8 — PULSEWIRE */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>PulseWire embed-article</h2>
          <p>PulseWire's embedding flow looks similar at a distance — async, idempotent, hash-aware — but the implementation is very different. Where Tabloom has an in-process worker, PulseWire uses graphile-worker tasks in Postgres.</p>

          <h3>The full task</h3>
          <CodePre>{`// pulsewire/src/worker/tasks/embed-article.ts (verbatim, abbreviated)
import { eq, isNull, and } from "drizzle-orm"
import type { Task } from "graphile-worker"
import { db } from "@/db/client"
import { articles } from "@/db/schema"
import { AiPausedError } from "@/lib/ai/chat"
import { embedOne } from "@/lib/ai/embed"

type Payload = { articleId: string }
const EMBED_INPUT_BODY_CHARS = 500

export const embedArticleTask: Task = async (payload, helpers) => {
  if (!isPayload(payload)) {
    helpers.logger.error("embed_article: bad payload")
    return
  }
  const { articleId } = payload

  // Idempotency: skip if already embedded
  const rows = await db.select({ /* ... */ })
    .from(articles)
    .where(and(eq(articles.id, articleId), isNull(articles.embedding)))
    .limit(1)
  const article = rows[0]
  if (!article) return   // already embedded or deleted

  const title = (article.title ?? "").trim()
  const body = (article.contentText ?? "").slice(0, EMBED_INPUT_BODY_CHARS).trim()
  const input = \`\${title}\\n\\n\${body}\`.trim()
  if (input.length < 10) {
    helpers.logger.warn(\`embed_article \${articleId}: input too short\`)
    return
  }

  let vec: number[]
  try {
    vec = await embedOne("embed_article", input)
  } catch (e) {
    if (e instanceof AiPausedError) {
      helpers.logger.warn(\`embed_article \${articleId} skipped: \${e.message}\`)
      return   // ← don't retry while paused
    }
    throw e    // ← retry on transient errors
  }

  if (vec.length !== 1536) {
    helpers.logger.error(\`embed_article \${articleId}: expected 1536, got \${vec.length}\`)
    return
  }

  await db.update(articles)
    .set({ embedding: vec })
    .where(eq(articles.id, articleId))

  // Fan-out to stage 3 — dedup + clustering
  await helpers.addJob(
    "cluster_article",
    { articleId },
    { jobKey: \`cluster_article:\${articleId}\`, jobKeyMode: "preserve_run_at", maxAttempts: 4 },
  )
}`}</CodePre>

          <h3>The pattern differences</h3>
          <table>
            <tbody>
              <tr><th></th><th>Tabloom (in-process)</th><th>PulseWire (graphile-worker)</th></tr>
              <tr><td>Queue location</td><td>JS Set in memory</td><td>Postgres table (graphile_worker.jobs)</td></tr>
              <tr><td>Survives process restart</td><td>No (queue lost)</td><td>Yes (jobs persist)</td></tr>
              <tr><td>Retry behavior</td><td>Re-enqueue on next save</td><td>Built-in backoff + max attempts</td></tr>
              <tr><td>Concurrency</td><td>One drain at a time</td><td>Configurable worker pool</td></tr>
              <tr><td>Idempotency</td><td>Hash check + Set dedup</td><td>jobKey + isNull(embedding) check</td></tr>
              <tr><td>Fan-out</td><td>n/a</td><td>addJob for next stage</td></tr>
              <tr><td>Cost gating</td><td>None</td><td>AiPausedError check</td></tr>
            </tbody>
          </table>

          <h3>The pipeline</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  F[Feed fetcher] --> A[article INSERT]
  A --> J1[addJob embed_article]
  J1 --> W1[Worker: embed_article]
  W1 --> E[Embedding 1536-D in DB]
  W1 --> J2[addJob cluster_article]
  J2 --> W2[Worker: cluster_article]
  W2 --> D[Dedup + cluster]
  style W1 fill:#5C2A4A,color:#fff`} />

          <h3>The "stage" pattern</h3>
          <p>Each worker task does ONE thing and then dispatches the next stage. <code>embed-article</code> embeds. <code>cluster-article</code> clusters. <code>summarize-cluster</code> writes the human-readable headline. <code>gatekeep-cluster</code> decides whether to publish. Each stage:</p>
          <ul>
            <li>Has its own retry budget (4 attempts).</li>
            <li>Has its own pause check (some stages run during pause; some don't).</li>
            <li>Is idempotent — re-running it is a no-op if the work is already done.</li>
            <li>Hands off to the next via <code>helpers.addJob</code>.</li>
          </ul>

          <h3>The cost-gate skip</h3>
          <p>
            If <code>embedOne</code> throws <code>AiPausedError</code>, the task LOGS and RETURNS — does NOT throw. This
            is critical: throwing would mark the job as failed and retry it. Returning marks it complete. When the pause
            lifts (new month or manual unblock), feeds will produce new articles that re-enqueue. The paused articles
            stay un-embedded until they next show up via the normal flow.
          </p>

          <p>Tabloom doesn't have this — embeddings always happen if VOYAGE_API_KEY is set. PulseWire's cost cap is more sophisticated.</p>

          <h3>The jobKey idempotency</h3>
          <CodePre>{`await helpers.addJob(
  "cluster_article",
  { articleId },
  {
    jobKey: \`cluster_article:\${articleId}\`,   // ← unique per article
    jobKeyMode: "preserve_run_at",
    maxAttempts: 4,
  },
)`}</CodePre>

          <p>graphile-worker dedups by jobKey within the queue. If the same articleId is enqueued twice (e.g., a re-embed triggers re-clustering), the second addJob updates the existing pending job rather than creating a duplicate. This prevents thundering-herd behavior when many articles arrive in a burst.</p>
        </section>

        <hr />

        {/* SECTION 9 — HASH SKIP */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Hash-Based Re-Embed Skip</h2>
          <p>Re-embedding the same content is pure waste. Tabloom's hash check is the cleanest dedup pattern in the fleet.</p>

          <h3>FNV-1a 32-bit</h3>
          <p>
            FNV-1a is a non-cryptographic hash — fast, no dependency, collision rate ~1 in 4 billion for unrelated
            inputs. Perfect for "did this content change?" detection. Tabloom uses a 32-bit variant; the function fits
            in 10 lines:
          </p>
          <CodePre>{`function hashText(s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}`}</CodePre>

          <h3>Why not SHA-256</h3>
          <p>
            Crypto hashes are ~10× slower per byte than FNV. For 4000 chars of input, the difference is sub-millisecond
            — but multiplied across thousands of saves, it matters. And: you don't need cryptographic resistance to
            preimage attacks. You need "did the content change," which FNV nails.
          </p>

          <h3>The decision tree</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  S[Save triggers enqueue]
  S --> H[Compute hash of new content]
  H --> Q[Lookup existing row]
  Q --> CHK{Same hash?}
  CHK -->|yes| SKIP[Skip - no API call]
  CHK -->|no| EMB[Call embedding API]
  CHK -->|no row| EMB
  EMB --> UP[UPSERT row with new vec + hash]
  style SKIP fill:#22c55e,color:#fff
  style EMB fill:#5C2A4A,color:#fff`} />

          <h3>The win</h3>
          <p>In Tabloom's production data, the skip rate is ~70% — meaning 70% of "page saved" events don't require a new embedding. This is because:</p>
          <ul>
            <li>Users save MANY times during editing (every few keystrokes via auto-save).</li>
            <li>Most saves are no-content-change (cursor moves, formatting tweaks).</li>
            <li>The hash is computed from the truncated (32k-char) content, so trailing edits beyond char 32000 don't change the hash.</li>
          </ul>

          <h3>What to hash</h3>
          <p>Hash whatever you embed. If you embed <code>title + "\n\n" + body</code>, hash <code>title + "\n\n" + body</code>. If you only embed truncated content, hash the truncated content. Hash divergence from embed input = lost skips.</p>

          <h3>PulseWire's equivalent</h3>
          <p>PulseWire doesn't hash. Its skip mechanism is the <code>isNull(articles.embedding)</code> check in the task — "skip if already embedded." Articles are immutable (news stories don't change after publish), so a one-time embed-or-skip is sufficient. No need to detect content changes.</p>
        </section>

        <hr />

        {/* SECTION 10 — COST + SCALING */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Cost + Scaling</h2>

          <h3>Per-token costs (2026)</h3>
          <table>
            <tbody>
              <tr><th>Model</th><th>$/1M tokens</th><th>Implied cost per doc</th></tr>
              <tr><td>voyage-3</td><td>$0.06</td><td>$0.00018 per 3000-token page</td></tr>
              <tr><td>voyage-3-large</td><td>$0.18</td><td>$0.00054</td></tr>
              <tr><td>text-embedding-3-small</td><td>$0.02</td><td>$0.00006</td></tr>
              <tr><td>text-embedding-3-large</td><td>$0.13</td><td>$0.00039</td></tr>
            </tbody>
          </table>

          <p>Tabloom's first 10,000 page embeds cost about $0.60 in total. The numbers are tiny — until they're not. Two scenarios bite:</p>

          <h3>Scenario 1: full re-embed on model change</h3>
          <p>You switch from voyage-3 to voyage-3-large. Now every existing embedding is in the old space and can't be compared to new ones. You need to re-embed the entire corpus. For 100,000 docs at 3k tokens each at $0.18/M = $54.</p>

          <p>Mitigation: store the model name in the embedding row. Re-embed lazily — only what gets queried.</p>

          <h3>Scenario 2: index pages get embedded</h3>
          <p>Tabloom's earlier version embedded notebooks as well as pages. Notebooks are auto-generated content lists ("Recent pages: 1, 2, 3, 4, 5..."). When 200 pages get added to a notebook, the notebook's auto-generated summary changes, the hash changes, the notebook gets re-embedded. Result: a feedback loop of unnecessary embeds.</p>

          <p>Mitigation: embed only the things users actually search FOR. Auto-generated index pages shouldn't be embedded.</p>

          <h3>Scaling beyond per-user corpora</h3>
          <p>Tabloom's BLOB approach scales linearly until cosine iteration becomes noticeable. Round numbers on a modern CPU:</p>
          <ul>
            <li>1,000 docs → ~3ms per query.</li>
            <li>10,000 docs → ~30ms per query.</li>
            <li>50,000 docs → ~150ms per query (noticeable but usable).</li>
            <li>100,000 docs → ~300ms per query (too slow).</li>
            <li>1,000,000 docs → 3s per query (definitely too slow).</li>
          </ul>

          <p>The fix is a vector index. <code>sqlite-vec</code> for SQLite. <code>ivfflat</code> or <code>hnsw</code> for pgvector. Both turn O(N) scan into O(log N) or O(sqrt(N)) probe — query time stays sub-100ms up to millions of vectors.</p>

          <h3>PulseWire's IVFFlat</h3>
          <CodePre>{`CREATE INDEX articles_embedding_idx
  ON articles
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Tune accuracy at query time:
SET LOCAL ivfflat.probes = 10;
SELECT ... ORDER BY embedding <=> $1::vector LIMIT 20;`}</CodePre>

          <ul>
            <li><code>lists = 100</code>: roughly <code>sqrt(N)</code> for ~10k articles.</li>
            <li><code>probes = 10</code>: searches 10 lists — tradeoff between recall and latency.</li>
            <li>More probes → slower but more accurate.</li>
          </ul>

          <p>HNSW (Hierarchical Navigable Small World) is the newer alternative — faster than IVFFlat at higher recall but builds slowly. Either works. PulseWire chose IVFFlat for simpler operational story.</p>

          <h3>The cost of the index</h3>
          <p>Indexes take RAM. A pgvector IVFFlat index on 100k 1536-D vectors is ~600 MB. An HNSW index is ~1.2 GB. For an Azure Postgres Flexible Server, that's the difference between fitting in cache and not.</p>

          <h3>Compression: int8 quantization</h3>
          <p>For very large corpora, switch from Float32 to Int8 storage. 4× size reduction, &lt;1% recall loss. Voyage supports it natively as an output option. pgvector doesn't yet — you'd quantize at the application level.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Build a Semantic Search</h2>
          <p>Build a working semantic search over a small SQLite corpus in ~60 lines. Use Voyage for embeddings, BLOB storage, JS cosine.</p>

          <h3>Setup</h3>
          <ol>
            <li><code>npm install better-sqlite3 dotenv</code></li>
            <li>Get a Voyage API key from <code>voyageai.com</code> (free tier: 200M tokens/month).</li>
            <li>Put it in <code>.env</code> as <code>VOYAGE_API_KEY</code>.</li>
          </ol>

          <h3>Step 1 — schema</h3>
          <CodePre>{`// schema.sql
CREATE TABLE IF NOT EXISTS docs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS embeddings (
  doc_id INTEGER PRIMARY KEY,
  vec    BLOB NOT NULL,
  FOREIGN KEY (doc_id) REFERENCES docs(id) ON DELETE CASCADE
);`}</CodePre>

          <h3>Step 2 — Voyage client</h3>
          <CodePre>{`// embed.js
import 'dotenv/config'

const URL = 'https://api.voyageai.com/v1/embeddings'

export async function embed(texts, inputType) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${process.env.VOYAGE_API_KEY}\`,
    },
    body: JSON.stringify({
      model: 'voyage-3',
      input: texts,
      input_type: inputType,    // "document" or "query"
    }),
  })
  if (!res.ok) throw new Error(\`Voyage \${res.status}: \${await res.text()}\`)
  const json = await res.json()
  return json.data.map(d => new Float32Array(d.embedding))
}`}</CodePre>

          <h3>Step 3 — storage helpers</h3>
          <CodePre>{`// storage.js
export function vecToBlob(vec) {
  const f32 = vec instanceof Float32Array ? vec : new Float32Array(vec)
  const buf = Buffer.allocUnsafe(f32.byteLength)
  buf.set(new Uint8Array(f32.buffer, f32.byteOffset, f32.byteLength))
  return buf
}

export function blobToVec(blob) {
  const f32 = new Float32Array(blob.length / 4)
  const view = new Uint8Array(f32.buffer)
  view.set(blob)
  return f32
}

export function cosine(a, b) {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}`}</CodePre>

          <h3>Step 4 — indexing script</h3>
          <CodePre>{`// index.js
import Database from 'better-sqlite3'
import fs from 'node:fs'
import { embed } from './embed.js'
import { vecToBlob } from './storage.js'

const db = new Database('./search.db')
db.exec(fs.readFileSync('./schema.sql', 'utf8'))

const SAMPLE = [
  { title: 'React',     body: 'A JavaScript library for building user interfaces.' },
  { title: 'Vue',       body: 'A progressive JavaScript framework for the web.' },
  { title: 'Postgres',  body: 'An advanced open-source relational database.' },
  { title: 'Docker',    body: 'Container platform for application packaging.' },
  { title: 'Kubernetes',body: 'Production-grade container orchestration platform.' },
  { title: 'Tailwind',  body: 'A utility-first CSS framework.' },
]

const insertDoc = db.prepare('INSERT INTO docs (title, body) VALUES (?, ?)')
const upsertEmbedding = db.prepare(
  \`INSERT INTO embeddings (doc_id, vec) VALUES (?, ?)
   ON CONFLICT(doc_id) DO UPDATE SET vec = excluded.vec\`,
)

const texts = SAMPLE.map(d => \`\${d.title}\\n\\n\${d.body}\`)
const vectors = await embed(texts, 'document')

const tx = db.transaction(() => {
  SAMPLE.forEach((d, i) => {
    const { lastInsertRowid } = insertDoc.run(d.title, d.body)
    upsertEmbedding.run(lastInsertRowid, vecToBlob(vectors[i]))
  })
})
tx()
console.log(\`Indexed \${SAMPLE.length} docs\`)`}</CodePre>

          <h3>Step 5 — query script</h3>
          <CodePre>{`// search.js
import Database from 'better-sqlite3'
import { embed } from './embed.js'
import { blobToVec, cosine } from './storage.js'

const db = new Database('./search.db')

const query = process.argv.slice(2).join(' ')
if (!query) { console.error('Usage: node search.js <query>'); process.exit(1) }

const [queryVec] = await embed([query], 'query')

const rows = db.prepare(\`
  SELECT d.id, d.title, d.body, e.vec
  FROM docs d JOIN embeddings e ON e.doc_id = d.id
\`).all()

const scored = rows.map(r => ({
  title: r.title,
  body: r.body,
  score: cosine(queryVec, blobToVec(r.vec)),
}))
scored.sort((a, b) => b.score - a.score)

for (const r of scored.slice(0, 5)) {
  console.log(\`\${r.score.toFixed(3)}  \${r.title}: \${r.body}\`)
}`}</CodePre>

          <h3>Run it</h3>
          <CodePre>{`node index.js
# Indexed 6 docs

node search.js "frontend framework"
# 0.681  React: A JavaScript library for building user interfaces.
# 0.674  Vue: A progressive JavaScript framework for the web.
# 0.421  Tailwind: A utility-first CSS framework.
# 0.190  Postgres: An advanced open-source relational database.
# ...

node search.js "container deployment"
# 0.721  Kubernetes: Production-grade container orchestration platform.
# 0.692  Docker: Container platform for application packaging.
# ...`}</CodePre>

          <h3>What you should observe</h3>
          <ul>
            <li>"frontend framework" pulls up React and Vue, NOT because they contain those words but because they're semantically about that.</li>
            <li>"container deployment" pulls up Kubernetes and Docker, even though Docker doesn't say "deployment."</li>
            <li>Cosine scores for relevant docs: 0.6–0.75. For unrelated: 0.1–0.3.</li>
          </ul>

          <h3>Extensions</h3>
          <ul>
            <li>Add a hash column to embeddings; skip re-embeds on identical content.</li>
            <li>Add a CLI loop: keep prompting for queries.</li>
            <li>Add Tabloom-style worker: re-embed on doc UPDATE.</li>
            <li>Switch to text-embedding-3-small via Azure AI Foundry.</li>
            <li>Add the 0.1 threshold filter.</li>
            <li>Time the cosine loop with 10,000 docs — see when it becomes slow.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"All my results have score around 0"</h3>
          <p>You're probably comparing vectors from different models. Voyage and OpenAI embeddings live in different "spaces" — they're not comparable. Check the <code>model</code> column on each embedding row.</p>

          <h3>"Quality dropped after switching from voyage-3 to a newer model"</h3>
          <p>Re-embed your corpus. The old vectors are still in the old model's space; queries in the new model's space won't find them well.</p>

          <h3>"Results are dominated by long documents"</h3>
          <p>You probably aren't normalizing OR your model isn't producing L2-normalized vectors. Check with <code>Math.sqrt(vec.reduce((s, x) =&gt; s + x*x, 0))</code> — should be ≈ 1.0 for normalized vectors.</p>

          <h3>"Search is slow"</h3>
          <p>You've outgrown linear scan. Either (a) switch to sqlite-vec / pgvector with an index, (b) split your corpus by tenant so each search only scans one tenant's vectors, (c) quantize to int8 (4× speedup).</p>

          <h3>"Re-embed loop keeps firing for unchanged content"</h3>
          <p>Your hash is computed from a slightly different input than your embedding. Make sure they're IDENTICAL inputs (same truncation, same string concat).</p>

          <h3>"Tabloom embed worker isn't catching up"</h3>
          <p>Check the worker stats endpoint. If <code>lastError</code> is set, the worker is throwing. Most common: API key expired, network blocked, or one bad document is failing repeatedly and blocking the rest. Add a per-document try/catch in the worker so one bad doc doesn't break the batch.</p>

          <h3>"PulseWire embed-article jobs are stuck"</h3>
          <p>Check graphile-worker's <code>graphile_worker.jobs</code> table directly. If <code>locked_at</code> is set and the worker process restarted, the jobs are locked to a dead worker. Postgres unlocks them after a timeout (usually 4 hours). To force-unlock: <code>UPDATE graphile_worker.jobs SET locked_at = NULL, locked_by = NULL WHERE locked_at &lt; NOW() - INTERVAL '10 minutes'</code>.</p>

          <h3>"Embeddings are missing for many docs after server restart"</h3>
          <p>(Tabloom) The boot sweep should catch this. Check the log line "[embed-worker] sweep: N page(s) to embed." If sweep isn't running, the worker module wasn't initialized at boot. Wire it into server.js startup.</p>

          <h3>"Voyage returns 429 / rate limited"</h3>
          <p>You're hitting the free tier limit (200M tokens/month) or burst RPM. Add per-batch backoff. Or: subscribe to a higher tier.</p>

          <h3>"pgvector query returns nothing even though I have data"</h3>
          <p>The <code>::vector</code> cast can fail silently if the array length doesn't match the column dimensions. Verify: <code>SELECT vector_dims(embedding) FROM articles LIMIT 1</code> — should match your model's dim (1536 for text-embedding-3-small).</p>

          <h3>"Cosine scores cluster around 0.95 — nothing stands out"</h3>
          <p>Probably all your docs are about the same topic. Embeddings tell relative differences; if your corpus is "every variant of a single topic," everything looks similar to everything else. Add diversity, or switch to a different reranking step.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Voyage quick call</h3>
          <CodePre>{`const res = await fetch('https://api.voyageai.com/v1/embeddings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${process.env.VOYAGE_API_KEY}\`,
  },
  body: JSON.stringify({
    model: 'voyage-3',
    input: ['text 1', 'text 2'],
    input_type: 'document',      // ← or 'query'
  }),
})
const { data, usage } = await res.json()
const vec0 = new Float32Array(data[0].embedding)`}</CodePre>

          <h3>OpenAI / Foundry call (PulseWire shape)</h3>
          <CodePre>{`const resp = await foundry().embeddings.create({
  model: 'text-embedding-3-small',
  input: 'Some text here',
})
const vec = resp.data[0].embedding   // 1536-dim array`}</CodePre>

          <h3>Float32 BLOB round-trip</h3>
          <CodePre>{`function vecToBlob(vec) {
  const f32 = vec instanceof Float32Array ? vec : new Float32Array(vec)
  const buf = Buffer.allocUnsafe(f32.byteLength)
  buf.set(new Uint8Array(f32.buffer, f32.byteOffset, f32.byteLength))
  return buf
}

function blobToVec(blob) {
  const f32 = new Float32Array(blob.length / 4)
  const view = new Uint8Array(f32.buffer)
  view.set(blob)
  return f32
}`}</CodePre>

          <h3>Cosine (for L2-normalized vectors)</h3>
          <CodePre>{`function cosine(a, b) {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}`}</CodePre>

          <h3>SQLite schema (Tabloom shape)</h3>
          <CodePre>{`CREATE TABLE IF NOT EXISTS page_embeddings (
  page_id    INTEGER PRIMARY KEY,
  model      TEXT NOT NULL,
  dim        INTEGER NOT NULL,
  vec        BLOB NOT NULL,
  hash       TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);`}</CodePre>

          <h3>Postgres + pgvector (PulseWire shape)</h3>
          <CodePre>{`embedding vector(1536)            -- column type
embedding <=> $1::vector          -- cosine DISTANCE (low = similar)
1 - (embedding <=> $1::vector)    -- cosine SIMILARITY (high = similar)

-- Index:
CREATE INDEX idx ON articles
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

SET LOCAL ivfflat.probes = 10;
SELECT ... ORDER BY embedding <=> $1::vector LIMIT 20;`}</CodePre>

          <h3>Embed-on-save pattern</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  S[Save] --> ENQ[enqueue id]
  ENQ --> Q[Set/queue]
  T[Ticker 750ms] --> DR[Drain]
  Q --> DR
  DR --> H{Hash unchanged?}
  H -->|yes| SK[Skip]
  H -->|no| EMB[Embed API]
  EMB --> UP[Upsert vec + hash]
  style EMB fill:#5C2A4A,color:#fff
  style SK fill:#22c55e,color:#fff`} />

          <h3>Search flow</h3>
          <ol>
            <li>Embed query with <code>input_type: 'query'</code>.</li>
            <li>Load all candidate embeddings (filter by tenant / accessible).</li>
            <li>Compute cosine vs each.</li>
            <li>Sort descending by score.</li>
            <li>Filter score &gt; threshold (Tabloom: 0.1).</li>
            <li>Slice top K.</li>
          </ol>

          <h3>Costs to remember</h3>
          <ul>
            <li>voyage-3: $0.06 / 1M tokens</li>
            <li>text-embedding-3-small: $0.02 / 1M tokens</li>
            <li>1024-D Float32 = 4 KB per vec</li>
            <li>1536-D Float32 = 6 KB per vec</li>
            <li>Int8 quantization = 1 KB / 1.5 KB respectively</li>
          </ul>

          <h3>The asymmetric optimization</h3>
          <p>Voyage gives ~10% better retrieval for the same model when you use <code>input_type: 'document'</code> for indexing and <code>input_type: 'query'</code> for queries. Always use it.</p>

          <h3>Hash-skip win</h3>
          <p>FNV-1a 32-bit of the embed input. ~70% skip rate in Tabloom production. Three lines of code.</p>
        </section>
      </main>
    </div>
  );
}
