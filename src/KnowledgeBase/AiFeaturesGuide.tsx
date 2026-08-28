import { useEffect, useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../app/storage/scopedStorage';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                icon: '🧠' },
  { id: 's2',  num: '2',  title: 'SDK Quickstart',              icon: '⚡' },
  { id: 's3',  num: '3',  title: 'Prompt Caching',              icon: '💾' },
  { id: 's4',  num: '4',  title: 'Structured Outputs',          icon: '🧱' },
  { id: 's5',  num: '5',  title: 'Tool Use & Agentic Loop',     icon: '🔧' },
  { id: 's6',  num: '6',  title: 'Multimodal',                  icon: '🖼️' },
  { id: 's7',  num: '7',  title: 'Cost Engineering',            icon: '💰' },
  { id: 's8',  num: '8',  title: 'Production Hardening',        icon: '🛡️' },
  { id: 's9',  num: '9',  title: 'Evals',                       icon: '🧪' },
  { id: 's10', num: '10', title: 'Observability',               icon: '📡' },
  { id: 's11', num: '11', title: 'Patterns for Your Apps',      icon: '🧩' },
  { id: 's12', num: '12', title: 'RAG',                         icon: '🔎' },
  { id: 's13', num: '13', title: 'Migrating Models',            icon: '🚚' },
  { id: 's14', num: '★',  title: 'Feature Planning Wizard',     icon: '✅' },
  { id: 's15', num: '?',  title: 'Troubleshooting',             icon: '🛠️' },
  { id: 's16', num: '✦',  title: 'SDK Cheat Sheet',             icon: '📋' },
];

const CHECKLIST_STORAGE_KEY = 'ai-features-checks';

const DESIGN_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'd1', label: <><strong>User flow specified</strong> — what triggers the call, what's shown, what fallback applies on failure</> },
  { id: 'd2', label: <><strong>Right model picked</strong> — Haiku (cheap/fast), Sonnet (default), Opus (hardest reasoning)</> },
  { id: 'd3', label: <><strong>Output format decided</strong> — text (streaming) or structured (tool use)</> },
  { id: 'd4', label: <><strong><code>max_tokens</code> capped</strong> at a realistic ceiling</> },
  { id: 'd5', label: <><strong>System prompt drafted</strong>; expected to be stable across users → cache it</> },
];
const COST_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'c1', label: <><strong>Estimated cost</strong> per call &amp; per user-day (input × price + output × price)</> },
  { id: 'c2', label: <><strong>Prompt caching configured</strong> if system prompt or context &gt; 1024 tokens</> },
  { id: 'c3', label: <><strong>Per-user rate limit set</strong> (express-rate-limit or similar)</> },
  { id: 'c4', label: <><strong>Considered Batch API</strong> for any non-realtime portion</> },
];
const RELIABILITY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'r1', label: <><strong>Timeout set</strong> (per-call or per-client)</> },
  { id: 'r2', label: <><strong>Client disconnect cancels the stream</strong></> },
  { id: 'r3', label: <><strong>Errors logged</strong> with enough context to debug (model, params, error type)</> },
  { id: 'r4', label: <><strong>Graceful user-facing message</strong> on failure (not a raw stack trace)</> },
];
const SAFETY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 't1', label: <><strong>User input validated</strong> for length and rough shape</> },
  { id: 't2', label: <><strong>Tool-use output validated</strong> with a schema parser (zod, ajv, etc.) before acting on it</> },
  { id: 't3', label: <><strong>No user text concatenated</strong> into the system prompt</> },
  { id: 't4', label: <><strong>High-stakes actions</strong> (send email, modify data) require human confirmation</> },
];
const OBSERVABILITY_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'o1', label: <><strong>Every call logs</strong>: model, latency, tokens, cache hits, stop_reason, estimated cost</> },
  { id: 'o2', label: <><strong>Logs reach App Insights</strong> (or your sink of choice)</> },
  { id: 'o3', label: <><strong>Dashboard or KQL query</strong> for daily cost + p95 latency by feature</> },
  { id: 'o4', label: <><strong>Alerts wired</strong>: error rate &gt; 5%, p95 latency &gt; 10s, daily cost &gt; $X</> },
];
const EVALS_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'e1', label: <><strong>At least 5 fixture cases</strong> covering common + edge inputs</> },
  { id: 'e2', label: <><strong>Asserts on output structure</strong> (schema, length)</> },
  { id: 'e3', label: <><strong>Asserts on output content</strong> for cases where there's a "right answer"</> },
  { id: 'e4', label: <><strong>Evals runnable locally and in CI</strong>; tied to model version</> },
];

function useChecklist(prefix: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}');
      return stored[prefix] ?? {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(CHECKLIST_STORAGE_KEY) || '{}');
      all[prefix] = checked;
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  }, [checked, prefix]);
  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }));
  return { checked, toggle };
}

function Checklist({ prefix, items }: { prefix: string; items: { id: string; label: React.ReactNode }[] }) {
  const { checked, toggle } = useChecklist(prefix);
  return (
    <ul className="checklist">
      {items.map(item => (
        <li key={item.id} className={checked[item.id] ? 'checked' : ''} onClick={() => toggle(item.id)}>
          <div className="cb" />
          <span className="cb-label">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

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

function PathTabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find(t => t.id === active);
  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            className={`tab-btn ${active === t.id ? 'active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-panel">{current?.content}</div>
    </div>
  );
}

export default function AiFeaturesGuide() {
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
            <span className="sidebar-title">AI Features in Your Apps</span>
          </div>
          <div className="sidebar-sub">Anthropic SDK patterns</div>
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
          <div className="hero-tag">🤖 Anthropic SDK Guide · 2026</div>
          <h1>Building AI Features<br />in Production</h1>
          <p>
            Production patterns for the <strong style={{ color: '#C77AA0' }}>Anthropic Node SDK</strong> in Express
            backends — prompt caching, structured outputs, streaming, tool use, evals, and cost engineering. With
            concrete recipes for the apps you already have.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">13</span><span className="hero-stat-label">Chapters</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">App Patterns</span></div>
            <div className="hero-stat"><span className="hero-stat-val">5–10×</span><span className="hero-stat-label">Cache Savings</span></div>
            <div className="hero-stat"><span className="hero-stat-val">$1–$15</span><span className="hero-stat-label">/MTok In</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>Same model weights, different homes. You pick the API path based on governance, region, billing, and what other services you're integrating with.</p>

          <h3>Direct API vs Bedrock vs Vertex vs Foundry</h3>
          <table>
            <tbody>
              <tr><th>Path</th><th>Auth</th><th>Billing</th><th>When it's right</th></tr>
              <tr><td><strong>Anthropic API</strong> (api.anthropic.com)</td><td>API key</td><td>Anthropic invoice</td><td>Your current setup. Simplest. Best feature recency.</td></tr>
              <tr><td>Amazon Bedrock</td><td>AWS SigV4</td><td>AWS bill</td><td>You're on AWS and want one invoice</td></tr>
              <tr><td>Google Vertex AI</td><td>GCP service account</td><td>GCP bill</td><td>You're on GCP</td></tr>
              <tr><td>Azure AI Foundry</td><td>Entra MI / API key</td><td>Azure bill (counts against your $150 credit!)</td><td>Microsoft work, governance, Azure-native ops</td></tr>
            </tbody>
          </table>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>For your personal apps: <strong>direct Anthropic API</strong> is the right call. Features (prompt caching, tool use, streaming) land there first. The other paths add governance value when you're inside that cloud ecosystem; you're not.</div>
          </div>

          <h3>Model Catalog</h3>
          <div className="card-grid">
            <div className="stat-card"><div className="stat-card-val">$5 / $25</div><div className="stat-card-label">Opus 4.8 · $/MTok</div></div>
            <div className="stat-card"><div className="stat-card-val">$3 / $15</div><div className="stat-card-label">Sonnet 4.6 · $/MTok</div></div>
            <div className="stat-card"><div className="stat-card-val">$1 / $5</div><div className="stat-card-label">Haiku 4.5 · $/MTok</div></div>
          </div>

          <table>
            <tbody>
              <tr><th>Model</th><th>ID</th><th>Use for</th></tr>
              <tr><td><strong>Claude Opus 4.8</strong></td><td><code>claude-opus-4-8</code></td><td>Deepest reasoning, complex agents</td></tr>
              <tr><td><strong>Claude Sonnet 4.6</strong></td><td><code>claude-sonnet-4-6</code></td><td>Default workhorse — fast, capable</td></tr>
              <tr><td><strong>Claude Haiku 4.5</strong></td><td><code>claude-haiku-4-5-20251001</code></td><td>Latency-sensitive, classification, extraction</td></tr>
            </tbody>
          </table>
          <p>Default to Sonnet. Drop to Haiku for high-volume classification. Reach for Opus when correctness &gt; cost on a hard problem.</p>

          <h3>The Shape of an API Request</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  App[Your app] -->|POST /v1/messages| API[Anthropic API]
  API --> Claude
  Claude -->|stream events OR full JSON| App
  App -->|render text / take action| User`} />

          <p>Every request to Claude is structurally the same:</p>
          <CodePre>{`{
  "model": "claude-sonnet-4-6",
  "max_tokens": 1024,
  "system": "You are a helpful assistant.",
  "messages": [
    { "role": "user", "content": "Hi" }
  ]
}`}</CodePre>

          <p>Optional fields that unlock features:</p>
          <ul>
            <li><code>stream: true</code> — server-sent events instead of one JSON blob.</li>
            <li><code>tools: [...]</code> — function-calling.</li>
            <li><code>tool_choice: {'{ type: "tool", name: "..." }'}</code> — force the model to call a specific tool.</li>
            <li><code>temperature: 0..1</code> — randomness. 0 for extraction/classification, 0.7 for creative text.</li>
            <li><code>stop_sequences: [...]</code> — abort when output contains any of these.</li>
            <li><code>thinking: {'{ type: "adaptive" }'}</code> — adaptive thinking on Opus 4.6+/Sonnet 4.6 (Claude picks the depth; <code>budget_tokens</code> is deprecated and 400s on Opus 4.7/4.8). Tune with <code>output_config: {'{ effort: "high" }'}</code>.</li>
            <li><code>metadata.user_id</code> — opaque identifier for abuse mitigation.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 2 — SDK QUICKSTART */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Anthropic Node SDK Quickstart</h2>

          <h3>Install &amp; Auth</h3>
          <CodePre>{`npm install @anthropic-ai/sdk`}</CodePre>

          <CodePre>{`// lib/anthropic.js
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  // optional:
  // baseURL: "https://api.anthropic.com",
  // timeout: 60_000,
  // maxRetries: 2,
});`}</CodePre>

          <p>Workshop, ShopKeep, and GLP1 all import this same pattern.</p>

          <h4>Auth in Production (App Service)</h4>
          <ul>
            <li>Set <code>ANTHROPIC_API_KEY</code> as an App Service config setting, not in code or a checked-in <code>.env</code>.</li>
            <li>For rotation / audit, back it with a Key Vault reference (see the Azure guide's Key Vault section).</li>
            <li>For local dev, use a <code>.env</code> + <code>dotenv</code>. Keep <code>.env</code> in <code>.gitignore</code>.</li>
          </ul>

          <h3>Your First Call</h3>
          <CodePre>{`import { anthropic } from "./lib/anthropic.js";

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 256,
  messages: [
    { role: "user", content: "Summarize Express 5 changes in 2 sentences." }
  ]
});

console.log(response.content[0].text);
console.log(\`Used \${response.usage.input_tokens} in, \${response.usage.output_tokens} out\`);`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div><strong>Always inspect <code>usage</code></strong> — it's how you instrument cost. The SDK returns it on every non-streaming response.</div>
          </div>

          <h4>The <code>content</code> Array</h4>
          <p>Responses are arrays of blocks. Most replies have one text block, but tool use, thinking, and citation responses split into multiple blocks. Don't assume <code>content[0]</code> is always text:</p>
          <CodePre>{`for (const block of response.content) {
  if (block.type === "text") {
    process.stdout.write(block.text);
  } else if (block.type === "tool_use") {
    handleToolCall(block.name, block.input);
  } else if (block.type === "thinking") {
    // optional: log model's reasoning trace
  }
}`}</CodePre>

          <h3>Streaming</h3>
          <p>For any user-facing response, stream. Latency to first token is ~500ms on Sonnet; full completion of a 500-word reply is ~5–8s. Streaming makes that feel instantaneous.</p>

          <CodePre>{`const stream = await anthropic.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Explain WAL mode in SQLite, briefly." }]
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}

// Final message after stream completes:
const final = await stream.finalMessage();
console.log("\\n\\nTotal tokens:", final.usage);`}</CodePre>

          <h4>Express Endpoint Pattern (SSE to the browser)</h4>
          <CodePre>{`// routes/analyze.js
import { anthropic } from "../lib/anthropic.js";

router.post("/analyze", requireAuth, async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no"
  });

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: req.body.text }]
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      res.write(\`data: \${JSON.stringify({ token: event.delta.text })}\\n\\n\`);
    }
  }

  const final = await stream.finalMessage();
  res.write(\`data: \${JSON.stringify({ done: true, usage: final.usage })}\\n\\n\`);
  res.end();
});`}</CodePre>

          <p>Frontend with native <code>EventSource</code> or with <code>fetch</code> + <code>response.body.getReader()</code>:</p>
          <CodePre>{`// src/api/analyze.js
export async function analyzeStream(text, onToken) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: \`Bearer \${token}\` },
    body: JSON.stringify({ text })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\\n\\n");
    buf = lines.pop();
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));
        if (data.token) onToken(data.token);
      }
    }
  }
}`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Don't forget client disconnect.</strong> If the user navigates away mid-stream, your endpoint keeps billing tokens until the stream finishes. Listen for <code>req.on('close')</code> and call <code>stream.controller.abort()</code> to cancel: <code>req.on('close', () =&gt; stream.controller.abort());</code></div>
          </div>
        </section>

        <hr />

        {/* SECTION 3 — PROMPT CACHING */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Prompt Caching <span className="badge green">huge for cost</span></h2>
          <p>If your system prompt or context is the same across many requests, mark it cacheable. Anthropic stores it server-side for ~5 minutes. Subsequent requests that hit the cache pay <strong>10% of input price</strong> (90% off) and skip re-processing.</p>

          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant App as Your app
  participant API as Anthropic API
  participant Cache as Server-side cache
  Note over App,API: First request
  App->>API: messages with cache_control marker
  API->>Cache: store prefix
  API->>App: response + cache_creation_input_tokens
  Note over App,API: Subsequent request within 5 min
  App->>API: messages with same cached prefix
  API->>Cache: lookup hit
  API->>App: response + cache_read_input_tokens (90% off)`} />

          <h3>Real Cost Example</h3>
          <p>A 5000-token system prompt (think: schema docs, examples, instructions) called 100 times in 5 minutes:</p>
          <table>
            <tbody>
              <tr><th>Without caching</th><th>With caching</th></tr>
              <tr><td>100 × 5000 × $3/MTok = <strong>$1.50</strong></td><td>1 × 5000 × $3.75/MTok (cache write) + 99 × 5000 × $0.30/MTok (cache read) = <strong>$0.17</strong></td></tr>
            </tbody>
          </table>
          <p>~10× cheaper. For high-frequency endpoints this is the single biggest cost lever you have.</p>

          <h3>How to Use It</h3>
          <p>Add <code>cache_control</code> to whichever message blocks you want cached. The cache is prefix-based: everything from the start of the prompt up to the marked block is the cache key.</p>

          <CodePre>{`const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: SYSTEM_PROMPT,                  // long static instructions
      cache_control: { type: "ephemeral" }  // ← cache this block + everything before it
    }
  ],
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: LARGE_DOCUMENT, cache_control: { type: "ephemeral" } },
        { type: "text", text: req.body.question }  // varies per request — not cached
      ]
    }
  ]
});

console.log(response.usage);
// {
//   input_tokens: 12,               // tokens NOT served from cache (your question)
//   cache_creation_input_tokens: 0, // tokens newly written to cache (0 = hit)
//   cache_read_input_tokens: 5000,  // tokens served from cache
//   output_tokens: 217
// }`}</CodePre>

          <h4>The Four-Breakpoint Pattern (the most you can have)</h4>
          <p>You can mark up to four <code>cache_control</code> blocks. The cache is prefix-based — each breakpoint extends the cached prefix. Useful for layered caching:</p>
          <CodePre>{`system: [
  { type: "text", text: TOOLS_DOCS, cache_control: { type: "ephemeral" } },   // rarely changes
],
messages: [
  {
    role: "user",
    content: [
      { type: "document", source: pdf, cache_control: { type: "ephemeral" } }, // varies per user, cached per user
      { type: "text", text: req.body.question }                                // varies per question
    ]
  }
]`}</CodePre>

          <h4>The 5-Minute TTL</h4>
          <ul>
            <li>Cache expires 5 minutes after the last hit. Touching it within the window refreshes the timer.</li>
            <li>A 1-hour cache option exists: <code>cache_control: {'{ type: "ephemeral", ttl: "1h" }'}</code> — costs 2× cache-write but lasts 12× longer.</li>
            <li>The cache key is your full prefix exactly. <strong>One byte difference</strong> (a typo in system prompt, a different timestamp embedded) = cache miss.</li>
          </ul>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Don't put dynamic data above a cache breakpoint.</strong> Common mistake: putting "Today is {'{{date}}'}" or "User: {'{{userId}}'}" at the start of the system prompt above the cached block. Every request has a different date/user → cache miss every time → you wrote the cache for nothing. Keep dynamic data AFTER the last cache breakpoint.</div>
          </div>

          <h3>What to Cache</h3>
          <table>
            <tbody>
              <tr><th>Cache it</th><th>Don't cache it</th></tr>
              <tr><td>System prompts</td><td>One-off prompts</td></tr>
              <tr><td>Tool definitions</td><td>Tiny prompts (&lt; 1024 tokens not worth it)</td></tr>
              <tr><td>Long documents users ask multiple questions about</td><td>Things that change every request</td></tr>
              <tr><td>Few-shot examples</td><td>Current timestamps</td></tr>
              <tr><td>Knowledge base / FAQ pages</td><td>User-specific data unless many requests/user</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 4 — STRUCTURED OUTPUTS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Structured Outputs via Tool Use</h2>
          <p>You can ask "respond in JSON" in plain English, but the model occasionally returns markdown fences, prose preambles, or invalid JSON. <strong>Tool use forces compliance</strong> — the model emits a tool call whose input matches the JSON schema you provide. The schema is enforced server-side.</p>

          <CodePre>{`const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools: [
    {
      name: "extract_project_metadata",
      description: "Extract structured metadata from a project description.",
      input_schema: {
        type: "object",
        required: ["title", "category", "difficulty", "estimated_hours"],
        properties: {
          title: { type: "string", description: "Concise project name (max 60 chars)" },
          category: { type: "string", enum: ["furniture", "decor", "outdoor", "repair", "other"] },
          difficulty: { type: "integer", minimum: 1, maximum: 5 },
          estimated_hours: { type: "number", minimum: 0.5 },
          tools_needed: { type: "array", items: { type: "string" } },
          notes: { type: "string" }
        }
      }
    }
  ],
  tool_choice: { type: "tool", name: "extract_project_metadata" },  // FORCE this tool
  messages: [
    { role: "user", content: \`Project description:\\n\\n\${req.body.description}\` }
  ]
});

// The tool call IS the structured output
const toolUse = response.content.find(b => b.type === "tool_use");
const metadata = toolUse.input;  // already an object, schema-validated
// { title: "...", category: "furniture", difficulty: 3, ... }`}</CodePre>

          <p>Key bits:</p>
          <ul>
            <li><code>tool_choice: {'{ type: "tool", name: "..." }'}</code> forces the model to call exactly this tool, not text.</li>
            <li>You never have to call the tool back — there's no actual function to run. You just want the schema-shaped output.</li>
            <li><code>response.stop_reason</code> will be <code>"tool_use"</code> in this case.</li>
            <li>The model returns <code>input</code> already parsed as an object. No <code>JSON.parse</code>.</li>
          </ul>

          <h3>Streaming Structured Outputs</h3>
          <p>Tool inputs stream as partial JSON deltas. Useful when the output is large or you want to show progress:</p>
          <CodePre>{`const stream = await anthropic.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  tools: [{ name: "report", input_schema: REPORT_SCHEMA }],
  tool_choice: { type: "tool", name: "report" },
  messages
});

let partialJson = "";
for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "input_json_delta") {
    partialJson += event.delta.partial_json;
    // Optionally: parse incrementally with a streaming JSON parser like \`parse-json-stream\`
  }
}

const final = await stream.finalMessage();
const result = final.content.find(b => b.type === "tool_use").input;`}</CodePre>
        </section>

        <hr />

        {/* SECTION 5 — TOOL USE AGENTIC LOOP */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Tool Use &amp; the Agentic Loop</h2>
          <p>"Real" tool use (not just structured output) is when you want Claude to call functions, see results, and continue. The loop:</p>

          <MermaidDiagram theme="default" chart={`graph TD
  Start[user message] --> Call1[messages.create]
  Call1 --> Check{stop_reason?}
  Check -- "end_turn" --> Done[return text to user]
  Check -- "tool_use" --> Exec[execute tool calls in your code]
  Exec --> Append[append tool_result blocks to messages]
  Append --> Call1
  style Done fill:#4F7A3E,stroke:#4F7A3E,color:#fff`} />

          <h3>Reference Loop in Node</h3>
          <CodePre>{`async function runAgent(userMessage, tools, handlers) {
  const messages = [{ role: "user", content: userMessage }];
  let iterations = 0;
  const MAX = 10;

  while (iterations++ < MAX) {
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: AGENT_SYSTEM_PROMPT,
      tools,
      messages
    });

    // Append model's response to conversation
    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason === "end_turn") {
      const text = res.content.find(b => b.type === "text")?.text ?? "";
      return { text, usage: res.usage };
    }

    if (res.stop_reason === "tool_use") {
      const toolResults = [];
      for (const block of res.content) {
        if (block.type !== "tool_use") continue;
        try {
          const result = await handlers[block.name](block.input);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result)
          });
        } catch (err) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: \`Error: \${err.message}\`,
            is_error: true
          });
        }
      }
      messages.push({ role: "user", content: toolResults });
      continue;  // loop with tool results in context
    }

    throw new Error(\`Unexpected stop_reason: \${res.stop_reason}\`);
  }
  throw new Error("Hit max iterations");
}`}</CodePre>

          <h3>Concrete: a Query Agent for Workshop</h3>
          <CodePre>{`const tools = [
  {
    name: "search_projects",
    description: "Search the user's projects by title/category. Returns matching projects.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string" },
        category: { type: "string", enum: ["furniture", "decor", "outdoor", "repair", "other"] },
        limit: { type: "integer", maximum: 20, default: 10 }
      },
      required: ["query"]
    }
  },
  {
    name: "get_project_photos",
    description: "Get photo metadata for a specific project.",
    input_schema: {
      type: "object",
      properties: { project_id: { type: "integer" } },
      required: ["project_id"]
    }
  }
];

const handlers = {
  search_projects: ({ query, category, limit = 10 }) => {
    const sql = \`SELECT id, title, category, created_at FROM projects
                 WHERE (title LIKE ? OR description LIKE ?) \${category ? 'AND category = ?' : ''}
                 ORDER BY created_at DESC LIMIT ?\`;
    const args = [\`%\${query}%\`, \`%\${query}%\`, ...(category ? [category] : []), limit];
    return db.prepare(sql).all(...args);
  },
  get_project_photos: ({ project_id }) => {
    return db.prepare("SELECT id, filename FROM photos WHERE project_id = ?").all(project_id);
  }
};

const { text } = await runAgent(
  "What outdoor projects did I work on last summer?",
  tools,
  handlers
);`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div><strong>Tool descriptions are prompts.</strong> The <code>description</code> and parameter descriptions in your schema are the only thing Claude has to decide <em>when</em> to call your tool. A vague description ("Get data") leads to wrong-tool-at-wrong-time. Be specific: "Returns the last 10 projects matching a free-text query in title or description, optionally filtered by category."</div>
          </div>
        </section>

        <hr />

        {/* SECTION 6 — MULTIMODAL */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Multimodal (Images &amp; PDFs)</h2>

          <h3>Sending Images</h3>
          <p>ShopKeep stores tool photos. Workshop has project photos. You could let users say "find my Makita 18V drill" and have Claude search by what's in the photo, or have Claude tag/describe images on upload.</p>

          <CodePre>{`// From base64 (uploaded blob)
const result = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 512,
  messages: [{
    role: "user",
    content: [
      {
        type: "image",
        source: { type: "base64", media_type: "image/jpeg", data: photoBase64 }
      },
      { type: "text", text: "Identify the tool. Return brand and model if visible. If not a tool, say what it is." }
    ]
  }]
});

// From a URL (must be publicly accessible)
{
  type: "image",
  source: { type: "url", url: "https://yoursite.com/uploads/photo.jpg" }
}`}</CodePre>

          <h4>Vision Strengths &amp; Limits</h4>
          <ul>
            <li>✅ Good at: object identification, OCR (text in images), describing scenes, reading documents, identifying brands/products.</li>
            <li>⚠️ Limited: very small text, precise object counts in crowded scenes, identifying specific people, deep technical diagrams.</li>
            <li>📏 Max image size: 5 MB per image, max 100 images per request.</li>
            <li>💰 Each image counts as input tokens (large images = more tokens). Resize before sending if you don't need full resolution.</li>
          </ul>

          <h3>Sending PDFs</h3>
          <p>PDFs are first-class. The model sees both the text and the visual layout. Useful for receipts, manuals, invoices.</p>

          <CodePre>{`import fs from "node:fs";

const pdfBuffer = fs.readFileSync("receipt.pdf");
const pdfBase64 = pdfBuffer.toString("base64");

const result = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 2048,
  messages: [{
    role: "user",
    content: [
      {
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: pdfBase64 }
      },
      { type: "text", text: "Extract line items: name, qty, unit price, total. Use the structured tool." }
    ]
  }],
  tools: [RECEIPT_SCHEMA_TOOL],
  tool_choice: { type: "tool", name: "extract_receipt" }
});`}</CodePre>

          <h4>Citations on PDFs</h4>
          <p>Enable citations and Claude attaches per-claim source ranges back to the PDF. Great for "where did this come from" UX:</p>
          <CodePre>{`{
  type: "document",
  source: { ... },
  citations: { enabled: true }
}

// Responses include citations[] inside content blocks:
// content: [{
//   type: "text",
//   text: "The unit price for screws was $4.99",
//   citations: [{ type: "page_location", document_index: 0, start_page_number: 1, end_page_number: 1 }]
// }]`}</CodePre>
        </section>

        <hr />

        {/* SECTION 7 — COST */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Cost Engineering</h2>

          <h3>The Five Biggest Cost Levers</h3>
          <table>
            <tbody>
              <tr><th>Lever</th><th>Typical savings</th><th>Effort</th></tr>
              <tr><td>1. Prompt caching</td><td>5–10× on heavy system prompts</td><td>~10 lines of code</td></tr>
              <tr><td>2. Right-size the model (Haiku vs Sonnet vs Opus)</td><td>3–15×</td><td>1 char in config</td></tr>
              <tr><td>3. Tight <code>max_tokens</code></td><td>Caps worst-case</td><td>1 number</td></tr>
              <tr><td>4. Batch API (50% off, non-realtime)</td><td>2×</td><td>Different endpoint</td></tr>
              <tr><td>5. Truncate inputs (you don't need to send the whole context)</td><td>Variable, often huge</td><td>Some thinking</td></tr>
            </tbody>
          </table>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>Watch the output tokens.</strong> Output is 5× the input price on Sonnet. A loose prompt that produces 3000 tokens of preamble costs as much as 15× more input. Tell Claude to be brief; use stop sequences; cap with <code>max_tokens</code>.</div>
          </div>

          <h3>Estimate Cost per Request</h3>
          <CodePre>{`function estimateCost(model, usage) {
  const PRICES = {
    "claude-opus-4-8":   { in: 5.00,  out: 25.00, cache_read: 0.50, cache_write: 6.25 },
    "claude-sonnet-4-6": { in: 3.00,  out: 15.00, cache_read: 0.30, cache_write: 3.75 },
    "claude-haiku-4-5-20251001": { in: 1.00, out: 5.00, cache_read: 0.10, cache_write: 1.25 }
  };
  const p = PRICES[model];
  if (!p) return 0;
  const inCost = (usage.input_tokens / 1e6) * p.in;
  const outCost = (usage.output_tokens / 1e6) * p.out;
  const cacheReadCost = (usage.cache_read_input_tokens ?? 0) / 1e6 * p.cache_read;
  const cacheWriteCost = (usage.cache_creation_input_tokens ?? 0) / 1e6 * p.cache_write;
  return inCost + outCost + cacheReadCost + cacheWriteCost;
}

// Log it
console.log(\`Request cost: $\${estimateCost(model, response.usage).toFixed(5)}\`);`}</CodePre>

          <h3>Batch API for Non-Realtime Work</h3>
          <p>If a task doesn't need a response in &lt;30s (e.g., nightly summarization, bulk classification), use the Batch API:</p>
          <CodePre>{`// Submit a batch
const batch = await anthropic.messages.batches.create({
  requests: items.map((item, i) => ({
    custom_id: \`item-\${i}\`,
    params: { model: "claude-sonnet-4-6", max_tokens: 256, messages: [...] }
  }))
});

// Poll status (or use webhook)
const status = await anthropic.messages.batches.retrieve(batch.id);
if (status.processing_status === "ended") {
  for await (const result of anthropic.messages.batches.results(batch.id)) {
    // each result has custom_id + response
  }
}`}</CodePre>
          <p>Results within 24h, 50% off input + output prices. Perfect for backfilling tags on existing data.</p>
        </section>

        <hr />

        {/* SECTION 8 — HARDENING */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Production Hardening</h2>

          <h3>Errors, Retries, Timeouts</h3>
          <h4>The Error Catalog</h4>
          <table>
            <tbody>
              <tr><th>Status</th><th>Type</th><th>Meaning</th><th>Retry?</th></tr>
              <tr><td>400</td><td>invalid_request</td><td>Malformed request — bad message structure, schema mismatch</td><td>No — fix the code</td></tr>
              <tr><td>401</td><td>authentication</td><td>Bad / missing API key</td><td>No — rotate key</td></tr>
              <tr><td>403</td><td>permission</td><td>Key lacks access (e.g., wrong workspace)</td><td>No</td></tr>
              <tr><td>404</td><td>not_found</td><td>Wrong endpoint or model ID</td><td>No</td></tr>
              <tr><td>413</td><td>request_too_large</td><td>Image too big, etc.</td><td>No — shrink input</td></tr>
              <tr><td>429</td><td>rate_limit</td><td>Throttled. Inspect <code>retry-after</code> header.</td><td>Yes — backoff</td></tr>
              <tr><td>500</td><td>api_error</td><td>Transient server issue</td><td>Yes — backoff</td></tr>
              <tr><td>529</td><td>overloaded</td><td>Capacity squeeze. Rare.</td><td>Yes — longer backoff</td></tr>
            </tbody>
          </table>

          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div><strong>The SDK retries already.</strong> By default the SDK retries up to 2× with backoff on 429/500/529. Don't add your own retry on top — you'll multiply attempts. Tune via <code>maxRetries</code> on the client.</div>
          </div>

          <h4>Timeout Pattern</h4>
          <CodePre>{`// Set a per-call timeout (defaults to 10 min):
const res = await anthropic.messages.create(
  { model, max_tokens, messages },
  { timeout: 30_000 }
);

// Or per-client:
const anthropic = new Anthropic({ apiKey, timeout: 30_000, maxRetries: 2 });`}</CodePre>

          <h4>Cancellation</h4>
          <p>Streams can be aborted via the underlying <code>AbortController</code>:</p>
          <CodePre>{`const ac = new AbortController();
setTimeout(() => ac.abort(), 5000);  // hard limit

const stream = await anthropic.messages.stream(
  { model, max_tokens, messages },
  { signal: ac.signal }
);`}</CodePre>

          <h3>Input/Output Guardrails</h3>
          <h4>Validate Inputs at Your Edge</h4>
          <ul>
            <li>Rate-limit per user (<code>express-rate-limit</code>) — Claude is expensive enough that one user can rack up $$$ quickly.</li>
            <li>Cap input length. Anyone posting a 100k-character prompt at your <code>/analyze</code> endpoint is either confused or attacking.</li>
            <li>Strip / escape anything that could break your prompt structure (rare but worth a thought).</li>
          </ul>

          <h4>Validate Outputs Before Acting on Them</h4>
          <p>Even with tool-use schemas, validate the result before passing to downstream systems:</p>
          <CodePre>{`import { z } from "zod";

const ProjectMetadata = z.object({
  title: z.string().max(60),
  category: z.enum(["furniture", "decor", "outdoor", "repair", "other"]),
  difficulty: z.number().int().min(1).max(5),
  estimated_hours: z.number().min(0.5).max(1000)
});

const parsed = ProjectMetadata.safeParse(toolUse.input);
if (!parsed.success) {
  // Log + fall back to "needs manual review"
  return { needsReview: true, raw: toolUse.input };
}
db.prepare("INSERT INTO ...").run(parsed.data);`}</CodePre>

          <h4>Prompt Injection Defense</h4>
          <ul>
            <li>Treat user-provided text as data, not instructions. Never concatenate it directly into a system prompt.</li>
            <li>If a feature lets users upload arbitrary documents, ask Claude to <em>summarize</em> them, not to <em>act on instructions in</em> them.</li>
            <li>For high-stakes actions (e.g., a tool that sends emails or modifies data), require human confirmation rather than trusting the model.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 9 — EVALS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Evals</h2>
          <p>"It seems to work" is not a release criterion. Models change. Prompts drift. Caching boundaries break. Without evals, you find out from users.</p>
          <p>An eval is just a test suite for LLM behavior. It runs your prompts against fixed inputs and asserts on the outputs. Cheap to set up, immensely valuable.</p>

          <h3>Three Eval Shapes</h3>
          <table>
            <tbody>
              <tr><th>Shape</th><th>When it works</th><th>Example</th></tr>
              <tr><td><strong>Exact-match</strong></td><td>Classification, extraction with schemas</td><td>"Given this receipt, the parsed total should be 47.92"</td></tr>
              <tr><td><strong>Property-based</strong></td><td>Open-ended outputs with verifiable properties</td><td>"The summary must mention the project's category" + "Length &lt; 200 words"</td></tr>
              <tr><td><strong>LLM-as-judge</strong></td><td>Subjective quality</td><td>"Rate this summary 1-5 on clarity. Score ≥ 4 = pass."</td></tr>
            </tbody>
          </table>

          <h3>A Minimal Eval Harness</h3>
          <p>You don't need a framework. A small Node script with a fixtures file is plenty:</p>

          <CodePre>{`// evals/extract-project.test.js
import { anthropic } from "../lib/anthropic.js";
import { extractProjectMetadata } from "../lib/extract.js";
import fixtures from "./fixtures/projects.json" assert { type: "json" };
import { describe, it, expect } from "vitest";

describe("project metadata extraction", () => {
  for (const fx of fixtures) {
    it(fx.name, async () => {
      const result = await extractProjectMetadata(fx.input);
      expect(result.category).toBe(fx.expected.category);
      expect(result.difficulty).toBeGreaterThanOrEqual(fx.expected.difficulty - 1);
      expect(result.difficulty).toBeLessThanOrEqual(fx.expected.difficulty + 1);
      expect(result.title.length).toBeLessThanOrEqual(60);
    });
  }
});`}</CodePre>

          <CodePre>{`// evals/fixtures/projects.json
[
  {
    "name": "outdoor bench",
    "input": "Building a cedar bench for the patio. Will use 2x4s, deck screws, and a circular saw. About a weekend of work.",
    "expected": { "category": "outdoor", "difficulty": 2 }
  },
  {
    "name": "complex dining table",
    "input": "8-foot reclaimed oak dining table with hand-cut mortise-and-tenon joinery, hand-planed top, multiple finish coats. Expecting 60+ hours.",
    "expected": { "category": "furniture", "difficulty": 5 }
  }
]`}</CodePre>

          <h4>LLM-as-Judge for Subjective Evals</h4>
          <CodePre>{`async function judge(prompt, response, criterion) {
  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    tools: [{
      name: "score",
      input_schema: {
        type: "object",
        required: ["score", "reasoning"],
        properties: {
          score: { type: "integer", minimum: 1, maximum: 5 },
          reasoning: { type: "string" }
        }
      }
    }],
    tool_choice: { type: "tool", name: "score" },
    messages: [{
      role: "user",
      content: \`Original prompt:\\n\${prompt}\\n\\nResponse:\\n\${response}\\n\\nCriterion: \${criterion}\\n\\nScore 1-5 with reasoning.\`
    }]
  });
  return res.content.find(b => b.type === "tool_use").input;
}`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div><strong>Snapshot tests = poor man's regression.</strong> For prompts where you care about stability rather than correctness, snapshot the output. Diff against the snapshot in CI. When you change the prompt, the snapshot updates intentionally.</div>
          </div>
        </section>

        <hr />

        {/* SECTION 10 — OBSERVABILITY */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Observability</h2>
          <p>The bare minimum for a production AI feature:</p>
          <CodePre>{`async function callWithLogging(params, { userId, feature }) {
  const t0 = Date.now();
  let res, error;
  try {
    res = await anthropic.messages.create(params);
    return res;
  } catch (e) {
    error = e;
    throw e;
  } finally {
    log.info({
      type: "claude_call",
      feature,
      user_id: userId,
      model: params.model,
      latency_ms: Date.now() - t0,
      input_tokens: res?.usage?.input_tokens,
      output_tokens: res?.usage?.output_tokens,
      cache_read_tokens: res?.usage?.cache_read_input_tokens ?? 0,
      cache_write_tokens: res?.usage?.cache_creation_input_tokens ?? 0,
      stop_reason: res?.stop_reason,
      cost_usd: res ? estimateCost(params.model, res.usage) : 0,
      error: error?.message
    });
  }
}`}</CodePre>

          <h3>Wire to App Insights</h3>
          <p>If your app has App Insights enabled (see Azure guide), publish a custom event:</p>
          <CodePre>{`import appInsights from "applicationinsights";

const client = appInsights.defaultClient;

client.trackEvent({
  name: "ClaudeCall",
  properties: { feature, user_id, model, stop_reason },
  measurements: { latency_ms, input_tokens, output_tokens, cost_usd }
});`}</CodePre>

          <p>Then in Azure Portal: App Insights → Logs (KQL):</p>
          <CodePre>{`customEvents
| where name == "ClaudeCall"
| where timestamp > ago(7d)
| summarize total_cost=sum(todouble(customMeasurements["cost_usd"])),
            call_count=count(),
            p95_latency=percentile(todouble(customMeasurements["latency_ms"]), 95)
            by tostring(customDimensions["feature"]), bin(timestamp, 1d)
| render timechart`}</CodePre>
        </section>

        <hr />

        {/* SECTION 11 — PATTERNS FOR YOUR APPS */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Patterns for Your Apps</h2>
          <p>You already have <code>@anthropic-ai/sdk</code> in workshop. The patterns below are tab-organized — pick the app you're working on.</p>

          <PathTabs
            tabs={[
              {
                id: 'workshop',
                label: '🔨 Workshop',
                content: (
                  <>
                    <h3>"Analyze with AI" Button (project metadata)</h3>
                    <p>The current "Analyze" button lets users paste a project description and get suggestions. Production pattern:</p>

                    <CodePre>{`// server.js — routes/projects.js
import { anthropic } from "./lib/anthropic.js";

const SYSTEM_PROMPT = \`You're an assistant for a personal woodworking workshop tracker.
Users describe a project; you extract structured metadata and suggest tools.

Be concise. Categories: furniture, decor, outdoor, repair, other.
Difficulty: 1 (beginner) to 5 (master). Estimated hours: realistic for one person.\`;

const ANALYZE_TOOL = {
  name: "save_metadata",
  description: "Save extracted project metadata to the database.",
  input_schema: {
    type: "object",
    required: ["title", "category", "difficulty_1_5", "estimated_hours"],
    properties: {
      title: { type: "string", maxLength: 60 },
      category: { type: "string", enum: ["furniture", "decor", "outdoor", "repair", "other"] },
      difficulty_1_5: { type: "integer", minimum: 1, maximum: 5 },
      estimated_hours: { type: "number", minimum: 0.25, maximum: 500 },
      tools_needed: { type: "array", items: { type: "string" }, maxItems: 12 },
      cautions: { type: "string", description: "Safety notes if applicable, else empty" }
    }
  }
};

router.post("/api/projects/analyze", requireAuth, async (req, res) => {
  const { description } = req.body;
  if (!description || description.length > 4000) {
    return res.status(400).json({ error: "Description must be 1-4000 chars" });
  }

  try {
    const result = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      tools: [ANALYZE_TOOL],
      tool_choice: { type: "tool", name: "save_metadata" },
      messages: [{ role: "user", content: \`Project description:\\n\\n\${description}\` }],
      metadata: { user_id: req.user.oid }
    });

    const toolUse = result.content.find(b => b.type === "tool_use");
    res.json({ metadata: toolUse.input, usage: result.usage });
  } catch (err) {
    console.error("Analyze failed:", err);
    res.status(500).json({ error: "Analysis unavailable, try again later" });
  }
});`}</CodePre>

                    <p>Why this pattern:</p>
                    <ul>
                      <li>System prompt is cached (~150 tokens isn't huge, but if you grow the prompt over time, the cache is already wired).</li>
                      <li>Forced tool use guarantees schema-shaped output — frontend can trust the response.</li>
                      <li><code>metadata.user_id</code> helps Anthropic flag abuse without you needing to track it.</li>
                      <li>Cap on input length prevents prompt abuse.</li>
                      <li>Generic error message to user; real error logged server-side.</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 'shopkeep',
                label: '🛠️ ShopKeep',
                content: (
                  <>
                    <h3>Identify Tool from Photo</h3>
                    <p>ShopKeep stores tool photos in SQLite blobs. Add an "Identify this tool" button that fills in metadata automatically.</p>

                    <CodePre>{`router.post("/api/tools/identify", requireAuth, async (req, res) => {
  const { image_id } = req.body;
  const image = req.db.prepare(
    "SELECT image_data, image_type FROM tool_images WHERE id = ?"
  ).get(image_id);
  if (!image) return res.status(404).end();

  const base64 = image.image_data.toString("base64");

  const result = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    tools: [{
      name: "identify_tool",
      input_schema: {
        type: "object",
        required: ["is_tool"],
        properties: {
          is_tool: { type: "boolean" },
          brand: { type: "string", description: "If visible on the tool" },
          model: { type: "string", description: "Model number/name if visible" },
          tool_type: { type: "string", description: "e.g. cordless drill, miter saw" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
          notes: { type: "string", description: "Anything unusual or noteworthy" }
        }
      }
    }],
    tool_choice: { type: "tool", name: "identify_tool" },
    messages: [{
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: image.image_type, data: base64 } },
        { type: "text", text: "Identify this tool. If it's not a tool, set is_tool: false." }
      ]
    }]
  });

  res.json(result.content.find(b => b.type === "tool_use").input);
});`}</CodePre>

                    <p>Notes:</p>
                    <ul>
                      <li>Image data is the most expensive part — consider downsampling to ≤ 1024px before sending (sharp / jimp).</li>
                      <li>For high-volume tagging on existing photos, batch via Anthropic's Batch API for 50% off.</li>
                      <li>Show <code>confidence</code> in the UI; low-confidence suggestions need user confirmation.</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 'glp1',
                label: '💊 GLP1',
                content: (
                  <>
                    <h3>Smart Nutrition Q&amp;A</h3>
                    <p>GLP1 tracks nutrition + glucose. Pattern: a chat-style endpoint where the user asks "based on my last week's data, what should I eat tomorrow?" and Claude responds with reasoning grounded in their actual data.</p>

                    <CodePre>{`router.post("/api/insights/chat", requireAuth, async (req, res) => {
  const { question } = req.body;

  // Build context from this user's recent data (cached per user!)
  const week = req.db.prepare(\`
    SELECT date, meals_json, glucose_readings_json, notes
    FROM daily_logs WHERE date >= date('now', '-7 days') ORDER BY date
  \`).all();

  const contextText = \`Recent 7-day log for user:\\n\\n\${JSON.stringify(week, null, 2)}\`;

  res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: [
      { type: "text", text: GLP1_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }
    ],
    messages: [{
      role: "user",
      content: [
        { type: "text", text: contextText, cache_control: { type: "ephemeral" } },
        { type: "text", text: question }
      ]
    }]
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      res.write(\`data: \${JSON.stringify({ token: event.delta.text })}\\n\\n\`);
    }
  }
  res.write("data: [DONE]\\n\\n");
  res.end();
});`}</CodePre>

                    <p>The 7-day log gets cached per user. As long as the user asks multiple follow-up questions within 5 minutes, those questions are ~10% the cost of the first.</p>

                    <div className="alert warn">
                      <span className="alert-icon">⚠️</span>
                      <div><strong>Medical disclaimer pattern.</strong> For anything health-adjacent, your system prompt should require Claude to disclaim that it's not medical advice and to suggest professional consultation when appropriate. Bake it in once, save your conscience.</div>
                    </div>
                  </>
                ),
              },
            ]}
          />

          <h3>Beyond Anthropic — the fleet's other providers</h3>
          <p>
            The sections above all assume Anthropic Claude via <code>@anthropic-ai/sdk</code> (the workshop/ShopKeep
            pattern). Three other apps in the fleet ship AI on different rails. Each has a dedicated KnowledgeBase
            guide with full deployed code; this section is the orientation map.
          </p>

          <h4>SecretApp (Hearth) → Azure OpenAI direct REST</h4>
          <p>
            Hearth's <code>routes/ai.js</code> talks to <code>*.openai.azure.com</code> directly via <code>fetch</code> —
            no SDK. Two endpoints: a buffered <code>/api/azure-openai/chat</code> and a streaming SSE
            <code>/api/azure-openai/chat/stream</code>. The streaming one includes a 2KB padding hack at the top of the
            response (<code>{`res.write(':' + ' '.repeat(2048) + '\\n\\n')`}</code>) to defeat IIS/CloudFlare buffering.
          </p>
          <p>
            Key differences vs Anthropic SDK: deployment-name URL pattern (you call your DEPLOYMENT, not the model);
            <code>api-key</code> header (NOT <code>Authorization: Bearer</code> — this is the #1 gotcha); api-version
            pinning (Hearth: <code>2024-04-01-preview</code>); structured outputs via
            <code>{`response_format: { type: 'json_schema', json_schema: { ... strict: true } }`}</code> which
            guarantees valid JSON.
          </p>
          <p>
            See the <strong>Azure OpenAI Service</strong> guide for the full breakdown — the URL pattern, the SSE
            buffer-padding trick, the request abort + upstream reader cancel chain that saves cost on client disconnect,
            the lab to build a streaming endpoint from scratch in ~80 lines.
          </p>

          <h4>PulseWire → Azure AI Foundry (OpenAI SDK + cost cap)</h4>
          <p>
            PulseWire uses Azure AI Foundry's OpenAI-compatible endpoint via the <code>openai</code> npm package — same
            SDK shape as direct OpenAI. Every call goes through a <code>withAiCallLog</code> wrapper that logs token
            counts + estimated cost to an <code>ai_call_log</code> Postgres table. A <code>cost_rollup</code>
            graphile-worker task runs at 00:30 each night, aggregates yesterday's spend, and checks against thresholds:
            $40 = SendGrid alert, $50 = automatic pause via <code>AiPausedError</code>.
          </p>
          <p>
            The pause mechanism is what makes a $50/month cap actually enforceable. Every AI entry point starts with
            <code>{`const pause = await getPauseState(); if (pause.paused) throw new AiPausedError(...)`}</code> —
            cached for 60 seconds so the check is essentially free. Workers catch <code>AiPausedError</code> and exit
            cleanly (not re-throw), which prevents retry-loop churn while paused.
          </p>
          <p>
            See the <strong>Azure AI Foundry</strong> guide for the Foundry-specific patterns (OpenAI SDK with custom
            <code>baseURL</code>, 120s timeout for first-token spikes, evals + hosted prompts in the Foundry portal),
            and the <strong>AI Cost Tracking</strong> guide for the wrapper + rollup + alert + pause flow with
            per-month idempotency.
          </p>

          <h4>Tabloom → Voyage AI embeddings (semantic search)</h4>
          <p>
            Tabloom uses Voyage AI's <code>voyage-3</code> model (1024-dim, $0.06 per 1M tokens) for notebook page
            embeddings. Stored as Float32 BLOBs in SQLite (~4KB per page). Embedding is fire-and-forget: an in-memory
            <code>Set</code> dedups by page_id, a drain ticker fires every 750ms, and a hash-based skip prevents
            re-embedding unchanged content (~70% skip rate in production).
          </p>
          <p>
            Voyage's killer feature is <strong><code>input_type</code></strong>: pass <code>"document"</code> for
            indexing and <code>"query"</code> for searches, and the model returns subtly different vectors optimized
            for asymmetric retrieval. About 10% better recall vs symmetric models (OpenAI's text-embedding-3 has no
            equivalent). Critical rule: be consistent — mix the two and quality degrades.
          </p>
          <p>
            See the <strong>Vector Embeddings + Semantic Search</strong> guide for the full Voyage client, the BLOB
            round-trip (<code>vecToBlob</code> / <code>blobToVec</code>), why cosine = dot product for L2-normalized
            vectors, the Tabloom embed-worker pattern, and PulseWire's Postgres + pgvector alternative (1536-dim
            text-embedding-3-small with IVFFlat indexing).
          </p>

          <h4>Provider quick-pick for new features</h4>
          <table>
            <tbody>
              <tr><th>Need</th><th>Pick</th><th>Why</th></tr>
              <tr><td>Vision (photo identification)</td><td>Anthropic claude-sonnet-4-6</td><td>Best vision model; web_search tool built-in</td></tr>
              <tr><td>Cheap classification</td><td>Anthropic claude-haiku-4-5 OR gpt-4.1</td><td>~$0.80–$2.50 per 1M input tokens</td></tr>
              <tr><td>Microsoft compliance / Azure credit</td><td>Azure OpenAI direct</td><td>Enterprise SLA, free Azure credit</td></tr>
              <tr><td>Multi-model + cost cap + evals</td><td>Azure AI Foundry</td><td>OpenAI SDK + integrated tooling</td></tr>
              <tr><td>Embeddings (semantic search)</td><td>Voyage AI voyage-3</td><td>Cheapest production-grade + asymmetric input_type</td></tr>
              <tr><td>Embeddings (already on OpenAI SDK)</td><td>text-embedding-3-small via Foundry</td><td>One provider, simpler ops</td></tr>
              <tr><td>Bleeding-edge first access</td><td>OpenAI direct</td><td>New models land here first</td></tr>
            </tbody>
          </table>

          <p>
            The fleet's pattern is to mix providers per task — Sonnet for vision, Haiku for cheap classification,
            Foundry for cost-capped chat at scale, Voyage for embeddings. The cost of mixing is two API keys and two
            error-handling paths. The cost of NOT mixing is paying premium prices for tasks that don't need premium
            models.
          </p>
        </section>

        <hr />

        {/* SECTION 12 — RAG */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>RAG (When to Bother)</h2>
          <p>Retrieval-Augmented Generation = look up relevant chunks of a knowledge base, stuff them into the prompt, ask Claude to answer using them.</p>

          <h3>When NOT to Bother</h3>
          <ul>
            <li>Your "knowledge base" fits in &lt; 100k tokens. Just put it in the system prompt (cached).</li>
            <li>You only have a handful of documents per query. Send them all directly.</li>
            <li>Your queries are repetitive enough that prompt caching covers it.</li>
          </ul>

          <h3>When You Do</h3>
          <ul>
            <li>Knowledge base is 100k+ tokens of static content (manuals, FAQs, codebases).</li>
            <li>Many users, varied questions, can't fit the full corpus.</li>
            <li>You want citations to source docs.</li>
          </ul>

          <h3>The Pieces</h3>
          <table>
            <tbody>
              <tr><th>Component</th><th>Options for your stack</th></tr>
              <tr><td>Embedding model</td><td>OpenAI <code>text-embedding-3-small</code>, Cohere, Voyage, BGE (open-source). Anthropic doesn't ship embeddings.</td></tr>
              <tr><td>Vector store</td><td>pgvector (in Postgres), Azure AI Search, Pinecone, Qdrant, LanceDB (embedded, like SQLite for vectors)</td></tr>
              <tr><td>Retriever</td><td>top-K similarity search, often combined with keyword (hybrid)</td></tr>
              <tr><td>Generator</td><td>Claude with retrieved docs in context</td></tr>
            </tbody>
          </table>

          <h3>A Small Postgres + pgvector Example</h3>
          <CodePre>{`CREATE EXTENSION vector;
CREATE TABLE chunks (
  id BIGSERIAL PRIMARY KEY,
  doc_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536)
);
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);

-- query
SELECT content, doc_id FROM chunks
ORDER BY embedding <=> $1::vector
LIMIT 6;`}</CodePre>

          <CodePre>{`async function ragAnswer(question) {
  const queryEmb = await embed(question);  // 1536-dim float array
  const top = await pg.query(
    "SELECT content, doc_id FROM chunks ORDER BY embedding <=> $1 LIMIT 6",
    [pgvector.toSql(queryEmb)]
  );

  const context = top.rows.map((r, i) => \`[doc \${i+1}: \${r.doc_id}]\\n\${r.content}\`).join("\\n\\n");

  const res = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: "Answer using ONLY the provided sources. Cite as [doc N]. Say 'I don't know' if sources don't cover it.",
    messages: [{ role: "user", content: \`Sources:\\n\\n\${context}\\n\\nQuestion: \${question}\` }]
  });

  return res.content[0].text;
}`}</CodePre>
        </section>

        <hr />

        {/* SECTION 13 — MIGRATION */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>Migrating Between Claude Versions</h2>
          <ol>
            <li><strong>Read the changelog.</strong> Each model release notes known behavioral diffs. New models are usually drop-in but occasionally a system prompt that worked great on 4.5 needs tweaks on 4.6.</li>
            <li><strong>Run your evals.</strong> If you have them (Section 9), this is when they pay for themselves. Diff old vs new on the same fixtures.</li>
            <li><strong>Update model IDs once, not throughout.</strong> Reference them via a constant: <code>const MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6";</code> — flip via env var.</li>
            <li><strong>Watch for tool-use diffs.</strong> Newer models sometimes prefer to call tools more eagerly or use multiple tools per turn. Adjust loop limits accordingly.</li>
            <li><strong>Test extended thinking separately.</strong> Behavior on hard problems can shift significantly; budget needs may change.</li>
          </ol>

          <h3>Common Migration Patterns</h3>
          <table>
            <tbody>
              <tr><th>From</th><th>To</th><th>Notes</th></tr>
              <tr><td>Sonnet 4.5</td><td>Sonnet 4.6</td><td>Drop-in usually. Slightly better tool-use reliability, longer effective context.</td></tr>
              <tr><td>Sonnet 4.6</td><td>Opus 4.8</td><td>Better at hard reasoning, ~1.7× input price ($5 vs $3 /MTok), slower. Use selectively, not as default.</td></tr>
              <tr><td>Opus 4.5</td><td>Sonnet 4.6</td><td>Often a cost win — Sonnet 4.6 ≈ Opus 4.5 quality at ~60% of the input price ($3 vs $5 /MTok).</td></tr>
              <tr><td>Haiku 3.5</td><td>Haiku 4.5</td><td>Much better at tool use and instruction following. Re-test classification thresholds.</td></tr>
            </tbody>
          </table>

          <p>When the next model lands (and there will be a next one), the workflow is the same: change one constant, run evals, ship if green, roll back the constant if not.</p>
        </section>

        <hr />

        {/* SECTION 14 — WIZARD */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">★</span>Feature Planning Wizard</h2>
          <div className="alert info">
            <span className="alert-icon">ℹ️</span>
            <div>Run through before merging an AI feature. State persists in this browser.</div>
          </div>

          <h3>Design</h3>
          <Checklist prefix="design" items={DESIGN_ITEMS} />

          <h3>Cost</h3>
          <Checklist prefix="cost" items={COST_ITEMS} />

          <h3>Reliability</h3>
          <Checklist prefix="reliability" items={RELIABILITY_ITEMS} />

          <h3>Trust &amp; Safety</h3>
          <Checklist prefix="safety" items={SAFETY_ITEMS} />

          <h3>Observability</h3>
          <Checklist prefix="observability" items={OBSERVABILITY_ITEMS} />

          <h3>Evals</h3>
          <Checklist prefix="evals" items={EVALS_ITEMS} />
        </section>

        <hr />

        {/* SECTION 15 — TROUBLESHOOTING */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>Output Quality Issues</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>Verbose preambles ("Great question! Let me think...")</td><td>System prompt doesn't constrain tone</td><td>Add: "Respond directly. No preamble, no apologies."</td></tr>
              <tr><td>Refuses to extract from clear input</td><td>Ambiguous instruction triggers caution</td><td>Be specific: "This is a normal user-submitted project description. Extract metadata."</td></tr>
              <tr><td>Hallucinated fields in tool output</td><td>Tool schema description vague</td><td>Tighten: include "If field is unknown, omit it" or "Set to null if not visible."</td></tr>
              <tr><td>Inconsistent format across calls</td><td>Using free text instead of tool use</td><td>Switch to forced tool use with schema</td></tr>
              <tr><td>Doesn't follow examples in the prompt</td><td>Examples buried under other instructions</td><td>Put 1–3 concrete examples close to the user's input</td></tr>
            </tbody>
          </table>

          <h3>Unexpected Cost Spikes</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>Costs higher than expected</td><td>Cache misses (every request "creates" the cache instead of reading it)</td><td>Inspect <code>usage.cache_read_input_tokens</code> vs <code>cache_creation_input_tokens</code>. A spike in creation = your prefix is varying (dynamic data crept in).</td></tr>
              <tr><td>One feature dominating costs</td><td>Output too long, or model too expensive for the task</td><td>Tighter max_tokens + try Haiku</td></tr>
              <tr><td>Cost drift over time</td><td>Prompt grew over many PRs</td><td>Audit system prompt length; cache if &gt; 1024 tokens</td></tr>
              <tr><td>Bill shock from single user</td><td>No per-user rate limit</td><td>express-rate-limit at 10/min per user is a fine default</td></tr>
            </tbody>
          </table>

          <h3>Streaming Weirdness</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>Stream buffered, all output arrives at once</td><td>Reverse proxy (nginx, IIS, App Service) buffering</td><td>Set <code>X-Accel-Buffering: no</code> header; ensure server emits flush per write</td></tr>
              <tr><td>Stream stops partway, no error</td><td>Hit max_tokens — check final message's <code>stop_reason: "max_tokens"</code></td><td>Raise the cap</td></tr>
              <tr><td>Tool call comes back as partial JSON</td><td>Reading deltas incrementally without combining</td><td>Accumulate <code>partial_json</code> across <code>input_json_delta</code> events; use only the final message for the parsed input</td></tr>
              <tr><td>Token usage off (lower than expected)</td><td>You aborted; bills only what was generated</td><td>(Working as intended)</td></tr>
            </tbody>
          </table>

          <h3>Tool-Use Loop Issues</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr><td>Infinite loop</td><td>Tool returns garbage that doesn't satisfy the model; cap not enforced</td><td>Enforce a max iteration count; return real errors as <code>is_error: true</code></td></tr>
              <tr><td>Model never calls the tool</td><td>Description vague, or tool_choice not set</td><td>Sharpen description; use <code>tool_choice: {'{ type: "tool", name }'}</code> for forced</td></tr>
              <tr><td>Model calls wrong tool</td><td>Tool descriptions overlap</td><td>Make descriptions disjoint: "Use ONLY when X; NOT when Y."</td></tr>
              <tr><td>Tool call gets a 400 from your handler</td><td>Schema constraint not validated server-side</td><td>Validate with zod inside the handler; return <code>is_error: true</code> with a useful message so the model can retry</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 16 — CHEAT SHEET */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">✦</span>SDK Cheat Sheet</h2>
          <p>Things you'll write repeatedly.</p>

          <h4>Basic call</h4>
          <CodePre>{`const res = await anthropic.messages.create({
  model: "claude-sonnet-4-6", max_tokens: 1024,
  messages: [{ role: "user", content: "..." }]
});
res.content[0].text;`}</CodePre>

          <h4>Streaming</h4>
          <CodePre>{`const stream = await anthropic.messages.stream({ /* same params */ });
for await (const e of stream) {
  if (e.type === "content_block_delta" && e.delta.type === "text_delta")
    process.stdout.write(e.delta.text);
}
const final = await stream.finalMessage();`}</CodePre>

          <h4>Prompt cache</h4>
          <CodePre>{`system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }]`}</CodePre>

          <h4>Force structured output</h4>
          <CodePre>{`tools: [{ name: "x", input_schema: SCHEMA }],
tool_choice: { type: "tool", name: "x" }
// then: response.content.find(b => b.type === "tool_use").input`}</CodePre>

          <h4>Image</h4>
          <CodePre>{`{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } }`}</CodePre>

          <h4>PDF</h4>
          <CodePre>{`{ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } }`}</CodePre>

          <h4>Abort on disconnect</h4>
          <CodePre>{`req.on('close', () => stream.controller.abort());`}</CodePre>

          <h4>Extended thinking</h4>
          <CodePre>{`thinking: { type: "adaptive" }   // Opus 4.6+ / Sonnet 4.6
output_config: { effort: "high" } // low | medium | high | max
// budget_tokens is deprecated (and 400s on Opus 4.7/4.8)`}</CodePre>

          <h4>Batch</h4>
          <CodePre>{`const batch = await anthropic.messages.batches.create({
  requests: items.map((it, i) => ({ custom_id: \`i-\${i}\`, params: { /* same shape */ } }))
});
// poll batch.processing_status, then iterate batches.results(batch.id)`}</CodePre>
        </section>

        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--rust)', marginBottom: 8 }}>
            🤖 AI Features in Your Apps
          </div>
          v1 · 2026-05-15. Companion: the Claude Code Power User guide covers the dev-environment side
          (hooks, skills, subagents, MCP) — they pair well, since you'll be using Claude Code to build
          Claude-API features.
        </div>
      </main>
    </div>
  );
}
