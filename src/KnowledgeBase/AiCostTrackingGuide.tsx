import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                       icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Three Logging Tiers',                icon: '📊' },
  { id: 's3',  num: '3',  title: 'The withAiCallLog Wrapper',          icon: '🎁' },
  { id: 's4',  num: '4',  title: 'Per-Token Pricing Table',            icon: '💲' },
  { id: 's5',  num: '5',  title: 'MTD Computation + Timezone',         icon: '🗓️' },
  { id: 's6',  num: '6',  title: 'Pause Cache + AiPausedError',        icon: '⏸️' },
  { id: 's7',  num: '7',  title: 'Daily Rollup Job',                   icon: '🔄' },
  { id: 's8',  num: '8',  title: 'Alert + Per-Month Idempotency',      icon: '📧' },
  { id: 's9',  num: '9',  title: 'Comparing the Fleet',                icon: '⚖️' },
  { id: 's10', num: '10', title: 'Beyond AI: Activity Logs',           icon: '📜' },
  { id: 's11', num: '★',  title: 'Lab: Build a Cost Cap',              icon: '🛠️' },
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

export default function AiCostTrackingGuide() {
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
            <span className="sidebar-title">AI Cost Tracking</span>
          </div>
          <div className="sidebar-sub">Logs, caps, alerts, audit trails</div>
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
          <div className="hero-tag">💰 ai_call_log · MTD cap · 2026</div>
          <h1>AI Cost Tracking,<br />Activity Logs, Audit Trails</h1>
          <p>
            Personal-app AI bills go from "$2/month" to "$200/month" in one bad night — a recursion bug, a runaway
            worker, a misconfigured rate. <strong style={{ color: '#C77AA0' }}>PulseWire</strong> ships the most
            sophisticated cost cap in the fleet: a <code>withAiCallLog</code> wrapper that logs every call, a daily
            rollup, a 60s-cached MTD probe, an <code>AiPausedError</code> that gates every AI entry point, and a
            SendGrid alert with per-month idempotency. <strong style={{ color: '#C77AA0' }}>Tabloom</strong> has a
            simpler <code>ai_calls</code> table. <strong style={{ color: '#C77AA0' }}>ShopKeep</strong> logs to a
            generic <code>activity_log</code>. This guide pulls all three patterns apart, then shows how to wire any
            of them into a new app.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">$40 / $50</span><span className="hero-stat-label">Alert / pause</span></div>
            <div className="hero-stat"><span className="hero-stat-val">60s</span><span className="hero-stat-label">Pause cache TTL</span></div>
            <div className="hero-stat"><span className="hero-stat-val">12.6</span><span className="hero-stat-label">Numeric precision</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Logging tiers</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            AI cost tracking is three discrete jobs wearing the same hat:
            (1) <strong>log</strong> every API call so you have a forensic record;
            (2) <strong>aggregate</strong> the log into a budget number you can compare to a threshold;
            (3) <strong>enforce</strong> the threshold by refusing future calls once exceeded.
            Each job is easy on its own. The hard part is wiring them together so the cost of measurement is amortized,
            the enforcement decisions stay consistent across concurrent calls, and the alerting doesn't spam.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The taxi meter.</strong> A meter counts dollars in real time. The cab stops when you say "pull over."
            AI cost tracking is the meter; <code>AiPausedError</code> is the "pull over" message — but the cab itself
            (the API call) doesn't know it's about to stop until you tell it.
          </p>
          <p>
            <strong>The utility breaker box.</strong> Your house has a circuit breaker that trips when current exceeds a
            threshold. The wiring still works; the breaker just opens the circuit. PulseWire's pause is a software
            breaker — when MTD &gt; $50, all AI calls open-circuit (throw). Feeds keep fetching; clustering keeps
            running; only the metered devices (chat, embed, summarize) stop.
          </p>
          <p>
            <strong>Receipts vs ledger vs alarm.</strong> Receipts (per-call rows) are forensic. The ledger (daily
            rollup) is the running total. The alarm is the threshold check + email. Don't conflate them — they have
            different lifespans (receipts forever, ledger forever, alarm transient).
          </p>

          <h3>What problem this solves</h3>
          <ul>
            <li><strong>Cost surprises.</strong> "Why is my bill $300 instead of $25?" → query the log.</li>
            <li><strong>Per-user attribution.</strong> "Which user generated most of the cost?" → group by user_oid in the log.</li>
            <li><strong>Bug containment.</strong> "I deployed a refactor that recursed and called the API in a loop." → automatic pause prevents disaster.</li>
            <li><strong>Cost projections.</strong> "If I keep adding 100 users, what's the AI bill at scale?" → divide daily cost by active users, multiply by target.</li>
            <li><strong>Compliance.</strong> "Show me every AI call that touched this user's data." → query.</li>
          </ul>

          <h3>The three apps that ship this</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Sophistication</th><th>Cap?</th><th>Alert?</th><th>Schema</th></tr>
              <tr><td>PulseWire</td><td>Full — log + rollup + pause + alert</td><td>Yes ($50)</td><td>Yes (SendGrid)</td><td><code>ai_call_log</code> + <code>daily_ai_cost_rollup</code></td></tr>
              <tr><td>Tabloom</td><td>Mid — log only, no enforcement</td><td>No</td><td>No</td><td><code>ai_calls</code></td></tr>
              <tr><td>ShopKeep</td><td>Light — generic activity log</td><td>No</td><td>No</td><td><code>activity_log</code></td></tr>
              <tr><td>SecretApp (Hearth)</td><td>None today</td><td>No</td><td>No</td><td>n/a</td></tr>
            </tbody>
          </table>

          <p>Take from each what you need. A side project with $10/month spend can ship Tabloom's pattern. A production app with multiple AI surfaces needs PulseWire's.</p>

          <h3>The four moving parts</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  AI[AI call] --> WRAP[withAiCallLog]
  WRAP --> LOG[(ai_call_log)]
  ROLLUP[Daily rollup job 00:30] --> RU[(daily_ai_cost_rollup)]
  LOG --> ROLLUP
  RU --> MTD[getMtdCostUsd]
  MTD --> PAUSE{MTD >= 50?}
  PAUSE -->|yes| ERR[AiPausedError]
  PAUSE -->|no| OK[Proceed]
  PAUSE -->|MTD >= 40| ALERT[SendGrid alert]
  style WRAP fill:#5C2A4A,color:#fff
  style PAUSE fill:#5C2A4A,color:#fff`} />
        </section>

        <hr />

        {/* SECTION 2 — LOGGING TIERS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Three Logging Tiers</h2>
          <p>The fleet ships three different schemas for logging AI activity. Each makes different tradeoffs.</p>

          <h3>Tier 1: ShopKeep's activity_log (generic)</h3>
          <CodePre>{`-- shopkeep/server.js
CREATE TABLE IF NOT EXISTS activity_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  action    TEXT NOT NULL,
  tool_id   INTEGER,
  tool_name TEXT,
  details   TEXT
);`}</CodePre>

          <p>
            One table for ALL user actions — not AI-specific. AI events use action names like <code>ai_identify_tool</code>,
            <code>ai_enrich_tool</code>, <code>ai_find_photo</code>. The <code>details</code> column is JSON with
            whatever the action wanted to record. Pro: simple, unified audit trail across the app. Con: no schema
            enforcement on the AI-specific fields; analytics queries have to JSON-parse to get token counts.
          </p>

          <h3>Tier 2: Tabloom's ai_calls (AI-specific)</h3>
          <CodePre>{`-- tabloom/server.js (lines 239-254)
CREATE TABLE IF NOT EXISTS ai_calls (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_oid      TEXT,
  operation     TEXT NOT NULL,
  model         TEXT,
  input_tokens  INTEGER,
  output_tokens INTEGER,
  elapsed_ms    INTEGER,
  cost_usd      REAL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);`}</CodePre>

          <p>
            A dedicated table for AI calls. Per-user attribution (<code>user_oid</code>), operation name (<code>search:semantic</code>,
            <code>summarize-page</code>, etc.), model + tokens + cost. Easy queries: "total cost this month," "cost
            per user," "most expensive operations." No enforcement — Tabloom logs but doesn't cap.
          </p>

          <h3>Tier 3: PulseWire's ai_call_log + daily_ai_cost_rollup (full)</h3>
          <CodePre>{`// pulsewire/src/db/schema.ts (lines 248-265)
export const aiCallLog = pgTable(
  "ai_call_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    routeOrJob: text("route_or_job").notNull(),
    model: text("model").notNull(),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    estCostUsd: numeric("est_cost_usd", { precision: 12, scale: 6 })
      .notNull()
      .default("0"),
    succeeded: boolean("succeeded").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("ai_call_log_created_at_idx").on(t.createdAt.desc())],
)`}</CodePre>

          <CodePre>{`// pulsewire/src/db/schema.ts (lines 376-384)
export const dailyAiCostRollup = pgTable("daily_ai_cost_rollup", {
  date: text("date").primaryKey(),    // YYYY-MM-DD in America/New_York
  estCostUsd: numeric("est_cost_usd", { precision: 12, scale: 6 })
    .notNull()
    .default("0"),
  alertSent: boolean("alert_sent").notNull().default(false),
})`}</CodePre>

          <p>
            Two tables. The fine-grained log keeps everything; the daily rollup keeps just the budget number. Why
            split? Because the budget query (MTD computation) needs to scan a LOT less data when most days are
            pre-aggregated. The <code>alert_sent</code> flag is what makes "send one email per month per threshold"
            possible.
          </p>

          <h3>Which to pick</h3>
          <table>
            <tbody>
              <tr><th>Need</th><th>Pick</th></tr>
              <tr><td>Just need to see what happened</td><td>Tier 1 (activity_log)</td></tr>
              <tr><td>Want cost analytics + per-user breakdown</td><td>Tier 2 (ai_calls)</td></tr>
              <tr><td>Have a real cost cap to enforce</td><td>Tier 3 (ai_call_log + rollup)</td></tr>
              <tr><td>Compliance requires audit trail</td><td>Tier 2 or 3 (immutable, append-only)</td></tr>
              <tr><td>Cost is &lt; $5/month and unlikely to grow</td><td>Tier 1 is fine</td></tr>
            </tbody>
          </table>

          <h3>The recurring fields</h3>
          <p>Across all three patterns, these fields show up:</p>
          <ul>
            <li><strong>created_at / timestamp</strong>: when the call happened (timezone-aware).</li>
            <li><strong>operation / action / route_or_job</strong>: caller identity.</li>
            <li><strong>model</strong>: which model handled the call.</li>
            <li><strong>input_tokens / output_tokens</strong>: from the API response's <code>usage</code> object.</li>
            <li><strong>cost_usd / est_cost_usd</strong>: computed locally from a pricing table.</li>
            <li><strong>elapsed_ms</strong>: latency (Tabloom only).</li>
            <li><strong>succeeded</strong>: true on success, false on exception (PulseWire only).</li>
          </ul>

          <h3>What NOT to log</h3>
          <ul>
            <li><strong>Full prompts</strong>. They can contain PII. Log a hash or a prefix only.</li>
            <li><strong>Full responses</strong>. Same reason.</li>
            <li><strong>API keys.</strong> Never log the key, partial or full.</li>
            <li><strong>Per-token details</strong>. Aggregated token counts are enough.</li>
          </ul>

          <p>If you need full-prompt debugging during incidents, put it in a SEPARATE table with a 7-day TTL purge.</p>
        </section>

        <hr />

        {/* SECTION 3 — WITHAICALLLOG */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The withAiCallLog Wrapper</h2>
          <p>PulseWire's <code>withAiCallLog</code> is the cleanest "wrap-every-call" pattern in the fleet. It's 35 lines of TypeScript. Every chat completion, every embedding, every AI call goes through it.</p>

          <h3>The full implementation</h3>
          <CodePre>{`// pulsewire/src/lib/ai/log.ts (verbatim)
import { db } from "@/db/client"
import { aiCallLog } from "@/db/schema"
import { estimateCostUsd } from "./cost"

export type AiCallMeta = {
  routeOrJob: string
  model: string
}

export type AiCallResult<T> = {
  data: T
  inputTokens: number
  outputTokens: number
}

export async function withAiCallLog<T>(
  meta: AiCallMeta,
  fn: () => Promise<AiCallResult<T>>,
): Promise<T> {
  try {
    const { data, inputTokens, outputTokens } = await fn()
    const estCost = estimateCostUsd(meta.model, inputTokens, outputTokens)
    await db.insert(aiCallLog).values({
      routeOrJob: meta.routeOrJob,
      model: meta.model,
      inputTokens,
      outputTokens,
      estCostUsd: estCost.toFixed(6),
      succeeded: true,
    })
    return data
  } catch (e) {
    await db
      .insert(aiCallLog)
      .values({
        routeOrJob: meta.routeOrJob,
        model: meta.model,
        inputTokens: 0,
        outputTokens: 0,
        estCostUsd: "0",
        succeeded: false,
      })
      .catch(() => {})
    throw e
  }
}`}</CodePre>

          <h3>What's happening</h3>
          <ol>
            <li><strong>Caller passes meta + an async function.</strong> The function does the actual API call and returns <code>&#123; data, inputTokens, outputTokens &#125;</code>.</li>
            <li><strong>If the function succeeds:</strong> compute cost from the tokens, log success row, return the unwrapped <code>data</code> to the caller.</li>
            <li><strong>If it throws:</strong> log a failure row (0 tokens, 0 cost), then re-throw. The caller sees the original error.</li>
            <li><strong>The log INSERT is awaited</strong> — every call pays for one DB INSERT. PulseWire's Postgres is fast; the cost is negligible.</li>
            <li><strong>The failure-log INSERT has <code>.catch(() =&gt; &#123;&#125;)</code></strong> — if logging the failure also fails (DB down), don't compound the problem. The original error wins.</li>
          </ol>

          <h3>How callers use it</h3>
          <CodePre>{`// pulsewire/src/lib/ai/embed.ts (lines 6-26)
export async function embedOne(routeOrJob: string, input: string): Promise<number[]> {
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? "unknown")

  const model = env.AZURE_AI_EMBED_DEPLOYMENT
  return withAiCallLog(
    { routeOrJob, model },                  // ← meta
    async () => {                            // ← fn
      const resp = await foundry().embeddings.create({ model, input })
      const vec = resp.data[0]?.embedding
      if (!vec) throw new Error("embed: empty response")
      return {
        data: vec,                           // ← what caller wants
        inputTokens: resp.usage?.prompt_tokens ?? 0,
        outputTokens: 0,
      }
    },
  )
}`}</CodePre>

          <p>The caller writes the API call, names which tokens to count, and gets back the unwrapped data. Logging is automatic. Cost calculation is automatic.</p>

          <h3>Why this pattern is great</h3>
          <ul>
            <li><strong>Centralized logging.</strong> One place to change schema, retention, redaction.</li>
            <li><strong>Force-fits cost tracking.</strong> If you want to add a new AI call without logging, you have to deliberately bypass <code>withAiCallLog</code> — the easy path is the right path.</li>
            <li><strong>Type-safe via generic.</strong> <code>T</code> is whatever the caller's function returns. The wrapper doesn't constrain.</li>
            <li><strong>Failure mode is correct.</strong> Caller sees original error; log row records failure for analytics. Cost on failure is zero (no tokens consumed).</li>
          </ul>

          <h3>The contract</h3>
          <p>Two things the caller must do:</p>
          <ol>
            <li>Compute <code>inputTokens</code> and <code>outputTokens</code> from the API response.</li>
            <li>If the API failed in a way that DID consume tokens (rare — usually 5xx means no tokens), still log honestly.</li>
          </ol>

          <h3>A subtle property: ALL paths log</h3>
          <p>Three execution paths exist:</p>
          <ol>
            <li><strong>Success</strong>: logs row with <code>succeeded: true</code>.</li>
            <li><strong>API failure</strong> (HTTP 4xx/5xx): logs row with <code>succeeded: false</code>, 0 tokens.</li>
            <li><strong>Logging failure</strong> (DB down): the success/failure log is .catch'd; original behavior is unchanged.</li>
          </ol>

          <p>No path "disappears" — every call gets a log entry, even if it's "we tried, it failed."</p>

          <h3>Adapting it to your fleet</h3>
          <p>If you're using SQLite (Tabloom-style), the only change is the DB driver:</p>
          <CodePre>{`async function withAiCallLog(meta, fn) {
  const start = Date.now()
  try {
    const { data, inputTokens, outputTokens } = await fn()
    const cost = estimateCostUsd(meta.model, inputTokens, outputTokens)
    db.prepare(\`
      INSERT INTO ai_calls (user_oid, operation, model, input_tokens, output_tokens, cost_usd, elapsed_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    \`).run(meta.userOid ?? null, meta.routeOrJob, meta.model, inputTokens, outputTokens, cost, Date.now() - start)
    return data
  } catch (e) {
    db.prepare(\`
      INSERT INTO ai_calls (user_oid, operation, model, input_tokens, output_tokens, cost_usd, elapsed_ms)
      VALUES (?, ?, ?, 0, 0, 0, ?)
    \`).run(meta.userOid ?? null, meta.routeOrJob, meta.model, Date.now() - start)
    throw e
  }
}`}</CodePre>

          <p>Pretty much the same shape. The wrapper pattern is portable across DB engines.</p>
        </section>

        <hr />

        {/* SECTION 4 — PRICING TABLE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Per-Token Pricing Table</h2>
          <p>Cost estimation requires knowing per-token prices for every model you call. PulseWire keeps the table inline:</p>

          <CodePre>{`// pulsewire/src/lib/ai/cost.ts (lines 1-12)
const MODEL_PRICING: Record<
  string,
  { input: number; output: number }
> = {
  // $/token (per single token, not per 1M)
  "gpt-5.4":     { input: 5e-6,    output: 15e-6 },
  "gpt-5.4-pro": { input: 15e-6,   output: 60e-6 },
  "gpt-4.1":     { input: 2.5e-6,  output: 10e-6 },
  "text-embedding-3-small": { input: 0.02e-6, output: 0 },
}`}</CodePre>

          <h3>Units explained</h3>
          <p>
            Vendors usually publish prices as "$5 per 1M input tokens." Per single token that's $5 / 1,000,000 = 5×10⁻⁶
            = <code>5e-6</code>. PulseWire stores the per-token form so the cost computation is just a multiply:
          </p>

          <CodePre>{`// lines 14-27
export function estimateCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const p = MODEL_PRICING[model]
  if (!p) {
    console.warn(\`[cost] no pricing for model='\${model}', defaulting to gpt-5.4 rate\`)
    const fallback = MODEL_PRICING["gpt-5.4"]!
    return inputTokens * fallback.input + outputTokens * fallback.output
  }
  return inputTokens * p.input + outputTokens * p.output
}`}</CodePre>

          <h3>The unknown-model fallback</h3>
          <p>If you call a model that's not in the table, PulseWire logs a warning and defaults to gpt-5.4's rate. Why default to the MOST EXPENSIVE common model?</p>
          <ul>
            <li><strong>Conservative bias.</strong> Better to overestimate (which triggers earlier alerts and gives you time to investigate) than to underestimate (which makes you blow through the cap silently).</li>
            <li><strong>Loud signal.</strong> If you're tracking the wrong model, the cost estimate looks wrong, and you'll notice.</li>
          </ul>

          <h3>Keeping the table fresh</h3>
          <p>Vendor prices change. Voyage cut voyage-3 from $0.10 to $0.06 in mid-2025. OpenAI introduced text-embedding-3 at 1/3 the cost of ada-002. Every quarter, audit your table:</p>
          <ol>
            <li>Check the vendor's pricing page.</li>
            <li>Update the table.</li>
            <li>If a model's price dropped, your historical estimates are now too HIGH — that's fine, they're estimates, the numbers in your DB are still correct for what they were at the time.</li>
            <li>If a model's price INCREASED retroactively (rare), recompute historical estimates.</li>
          </ol>

          <h3>Cached / streamed input</h3>
          <p>Some providers offer prompt caching (Anthropic's <code>cache_control</code>, OpenAI's automatic caching). Cached tokens are billed at a discount (Anthropic: 90% off). To model this honestly:</p>
          <CodePre>{`"claude-sonnet-4-6": {
  input: 3e-6,             // standard input rate
  cachedInput: 0.3e-6,     // 90% cheaper for cache hits
  output: 15e-6,
}

// Caller passes cached-input count explicitly:
estimateCostUsd("claude-sonnet-4-6", inputTokens, outputTokens, cachedInputTokens)`}</CodePre>

          <p>PulseWire doesn't currently model caching — it's a future enhancement when their gpt-5.4 caching rolls out.</p>

          <h3>Where the table lives</h3>
          <p>Three options:</p>
          <ul>
            <li><strong>Hardcoded in code</strong> (PulseWire). Pro: type-safe, atomic with code changes. Con: requires deploy to update.</li>
            <li><strong>In an env var as JSON</strong>. Pro: deploy-free updates. Con: typos crash the app at boot.</li>
            <li><strong>In a DB table</strong>. Pro: live-editable. Con: needs caching, validation; more moving parts.</li>
          </ul>

          <p>For personal-fleet scale, hardcoded is right. For SaaS where pricing changes often, DB-backed is right.</p>

          <h3>numeric(12, 6)</h3>
          <p>PulseWire's <code>est_cost_usd</code> column is <code>numeric(12, 6)</code> — up to 12 total digits, 6 of which are after the decimal. So $0.000045 (a tiny embedding call) is precise. And $999,999.999999 is the cap before overflow — far more than any reasonable budget. Don't use REAL/FLOAT for money; use NUMERIC.</p>
        </section>

        <hr />

        {/* SECTION 5 — MTD COMPUTATION */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>MTD Computation + Timezone</h2>
          <p>"Month-to-date cost" sounds trivial. It's not. There's a daily rollup, today's running cost, and a timezone choice that can put you off by 24 hours.</p>

          <h3>The query</h3>
          <CodePre>{`// pulsewire/src/lib/ai/cost.ts (lines 44-66)
export async function getMtdCostUsd(): Promise<number> {
  const rows = await db.execute<{ mtd: string }>(sql\`
    with current_month_start as (
      select date_trunc('month', now() at time zone 'America/New_York') at time zone 'America/New_York' as start_ts,
             to_char(date_trunc('month', now() at time zone 'America/New_York'), 'YYYY-MM-DD') as start_str
    ),
    rolled as (
      select coalesce(sum(est_cost_usd), 0) as c
        from \${dailyAiCostRollup}
       where date >= (select start_str from current_month_start)
    ),
    today as (
      select coalesce(sum(est_cost_usd), 0) as c
        from ai_call_log
       where created_at >= date_trunc('day', now() at time zone 'America/New_York') at time zone 'America/New_York'
    )
    select ((select c from rolled) + (select c from today))::text as mtd
  \`)

  const arr = Array.isArray(rows) ? rows : []
  const first = arr[0] as { mtd?: string } | undefined
  return first?.mtd ? Number.parseFloat(first.mtd) : 0
}`}</CodePre>

          <h3>What the SQL does</h3>
          <ol>
            <li><code>current_month_start</code>: compute the first day of this month in America/New_York timezone. Get both the timestamp and the YYYY-MM-DD string form.</li>
            <li><code>rolled</code>: sum <code>est_cost_usd</code> from the daily rollup table for all days from month start onward.</li>
            <li><code>today</code>: sum <code>est_cost_usd</code> from the raw call log for everything happening since today's midnight (NY time).</li>
            <li><code>final</code>: <code>rolled + today</code> = total MTD.</li>
          </ol>

          <h3>Why the split</h3>
          <p>The daily rollup holds ALL prior days. Today's data isn't in the rollup yet (the rollup job runs at 00:30 the next day). So MTD = "everything before today (from rollup)" + "today (from raw log)." Without this split, you'd either:</p>
          <ul>
            <li>Scan the entire <code>ai_call_log</code> every time MTD is computed (slow at scale).</li>
            <li>Or be 24 hours late on MTD (rollup-only).</li>
          </ul>

          <p>The split is the magic: rollup gives you O(1) historical scan, raw log gives you up-to-the-minute today.</p>

          <h3>The timezone problem</h3>
          <p>
            "Cost today" depends on what "today" means. If your DB is UTC and your bill closes at midnight Pacific
            time, you can have:
          </p>
          <ul>
            <li>UTC midnight = 5pm Pacific (or 4pm during DST).</li>
            <li>A call at 11pm Pacific is "tomorrow in UTC" but still "today in Pacific."</li>
            <li>Vendor invoices and your local mental model disagree.</li>
          </ul>

          <p>
            PulseWire pins everything to America/New_York (the operator's timezone). Whatever timezone you pick, BE
            CONSISTENT. The rollup query, the today query, the alert evaluation, the rollup job — all use the same
            timezone. PulseWire's SQL has <code>at time zone 'America/New_York'</code> in five different places for
            this reason.
          </p>

          <h3>Why store dates as TEXT</h3>
          <p><code>date_trunc('month', now() at time zone 'America/New_York')</code> returns a <code>timestamp</code>. Converting it to a <code>YYYY-MM-DD</code> string and using that as the primary key (instead of a date type) eliminates timezone ambiguity in the rollup table. <code>'2026-05-01'</code> always means the same thing.</p>

          <h3>Tabloom's simpler MTD</h3>
          <p>Tabloom doesn't have a rollup — just <code>SELECT SUM(cost_usd) FROM ai_calls WHERE created_at &gt;= date('now', 'start of month')</code>. Works because Tabloom's call volume is low (low hundreds of calls per month). At higher volume, the full-table sum would slow searches; that's when the rollup pattern earns its keep.</p>

          <h3>The 60s cache</h3>
          <p>
            getMtdCostUsd is potentially expensive — a CTE with two subqueries. Calling it on EVERY AI request would
            triple every AI route's latency. PulseWire caches the result for 60s:
          </p>

          <CodePre>{`// (in cost.ts)
let pauseCache: { value: PauseState; expiresAt: number } | null = null
const PAUSE_CACHE_TTL_MS = 60_000

export async function getPauseState(): Promise<PauseState> {
  const now = Date.now()
  if (pauseCache && pauseCache.expiresAt > now) return pauseCache.value

  const mtd = await getMtdCostUsd()
  const state: PauseState = /* ... */
  pauseCache = { value: state, expiresAt: now + PAUSE_CACHE_TTL_MS }
  return state
}

export function invalidatePauseCache() { pauseCache = null }`}</CodePre>

          <p>60s is a deliberate compromise. Long enough that bursty traffic (50 embeds in 10s) doesn't re-query the DB. Short enough that crossing the threshold gets detected within a minute. Plus there's an explicit invalidate function that the rollup job calls after writing new rollup rows.</p>
        </section>

        <hr />

        {/* SECTION 6 — PAUSE CACHE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Pause Cache + AiPausedError</h2>
          <p>The pause mechanism is what separates "logging" from "enforcement." PulseWire's is implemented in two pieces: a cached state probe + a custom error class.</p>

          <h3>The state probe</h3>
          <CodePre>{`// pulsewire/src/lib/ai/cost.ts (lines 71-95)
export type PauseState = {
  paused: boolean
  reason?: string
  mtdUsd: number
}

export async function getPauseState(): Promise<PauseState> {
  const now = Date.now()
  if (pauseCache && pauseCache.expiresAt > now) return pauseCache.value

  const mtd = await getMtdCostUsd()
  const state: PauseState =
    mtd >= PAUSE_THRESHOLD_USD
      ? { paused: true, reason: \`MTD \$\${mtd.toFixed(2)} >= \$\${PAUSE_THRESHOLD_USD}\`, mtdUsd: mtd }
      : { paused: false, mtdUsd: mtd }

  pauseCache = { value: state, expiresAt: now + PAUSE_CACHE_TTL_MS }
  return state
}`}</CodePre>

          <p>Every AI entry point starts with <code>const pause = await getPauseState()</code>. If <code>paused</code> is true, throw <code>AiPausedError</code>. Otherwise proceed.</p>

          <h3>The error class</h3>
          <CodePre>{`// pulsewire/src/lib/ai/chat.ts (lines 6-11)
export class AiPausedError extends Error {
  constructor(reason: string) {
    super(\`AI calls paused: \${reason}\`)
    this.name = "AiPausedError"
  }
}`}</CodePre>

          <p>Subclass of Error so it propagates normally, but with a distinct <code>name</code> so callers can detect it specifically (<code>instanceof AiPausedError</code>).</p>

          <h3>The gate</h3>
          <CodePre>{`// pulsewire/src/lib/ai/embed.ts (lines 7-10)
export async function embedOne(routeOrJob: string, input: string): Promise<number[]> {
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? "unknown")
  // ...
}`}</CodePre>

          <p>Three lines at the top of every AI-call function. The cached probe means the check is essentially free.</p>

          <h3>How callers handle it</h3>
          <CodePre>{`// pulsewire/src/worker/tasks/embed-article.ts (lines 42-49)
let vec: number[]
try {
  vec = await embedOne("embed_article", input)
} catch (e) {
  if (e instanceof AiPausedError) {
    helpers.logger.warn(\`embed_article \${articleId} skipped: \${e.message}\`)
    return                    // ← exit cleanly, no retry
  }
  throw e                     // ← retry transient errors
}`}</CodePre>

          <p>
            This is the critical idiom. <strong>Catch <code>AiPausedError</code> in workers</strong>, log + return.
            <strong>Don't</strong> re-throw — that would cause the job to retry, which would hit the same pause, in a
            loop, burning worker CPU. Returning marks the job complete. When the pause lifts, normal new traffic picks
            up; the paused tasks stay "completed with no work done." Tradeoff: those articles never get embedded. PulseWire
            accepts that — feed traffic is continuous, fresh articles will come.
          </p>

          <h3>Why the cache invalidation matters</h3>
          <p>After the daily rollup runs (at 00:30), the rollup table now has yesterday's costs. If the cache still says "paused" but rollup data has changed (e.g., the rollup was wrong yesterday and corrected today), we want the next probe to recompute. <code>invalidatePauseCache()</code> after the rollup forces a fresh probe.</p>

          <CodePre>{`// pulsewire/src/worker/tasks/cost-rollup.ts (excerpt)
await db.execute(sql\`
  insert into \${dailyAiCostRollup} (date, est_cost_usd, alert_sent)
  select /* aggregate yesterday */ ...
\`)

invalidatePauseCache()    // ← cache no longer trusted
const mtd = await getMtdCostUsd()
// ... then check thresholds for alerts`}</CodePre>

          <h3>Alert vs pause — two thresholds</h3>
          <CodePre>{`// pulsewire/src/lib/ai/cost.ts (lines 13-14)
export const ALERT_THRESHOLD_USD = 40
export const PAUSE_THRESHOLD_USD = 50`}</CodePre>

          <p>
            $40 = warning email. AI keeps running. $50 = pause + warning email. The 10-dollar buffer lets you decide
            what to do — increase the cap, find the bug, manually disable the offending route — before things shut off
            entirely. Both thresholds are environment-friendly: tune them via env vars if you want different prod/staging
            values.
          </p>

          <h3>Per-user pause vs global</h3>
          <p>PulseWire's pause is global — when MTD hits $50, ALL users are blocked. For SaaS apps, you'd want per-user (or per-team) pauses:</p>
          <CodePre>{`async function getPauseState(userId) {
  const userMtd = await getUserMtdCost(userId)
  const userBudget = await getUserBudget(userId)   // e.g. from settings
  return userMtd >= userBudget
    ? { paused: true, reason: \`User \${userId} MTD over budget\` }
    : { paused: false }
}`}</CodePre>

          <p>Add a <code>user_oid</code> column to the log, group by user in the MTD query, check per-user threshold. Same pattern, scoped narrower.</p>
        </section>

        <hr />

        {/* SECTION 7 — DAILY ROLLUP */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Daily Rollup Job</h2>
          <p>The rollup job aggregates yesterday's call log into a single row. Runs nightly via graphile-worker cron.</p>

          <h3>The task</h3>
          <CodePre>{`// pulsewire/src/worker/tasks/cost-rollup.ts (verbatim, abbreviated)
export const costRollupTask: Task = async (_payload, helpers) => {
  // Aggregate yesterday's ai_call_log into the rollup table.
  await db.execute(sql\`
    insert into \${dailyAiCostRollup} (date, est_cost_usd, alert_sent)
    select
      to_char(date_trunc('day', created_at at time zone 'America/New_York'), 'YYYY-MM-DD') as date,
      sum(est_cost_usd) as est,
      false
    from ai_call_log
    where date_trunc('day', created_at at time zone 'America/New_York')
        = date_trunc('day', (now() at time zone 'America/New_York') - interval '1 day')
    group by 1
    on conflict (date) do update set est_cost_usd = excluded.est_cost_usd
  \`)

  invalidatePauseCache()
  const mtd = await getMtdCostUsd()
  helpers.logger.info(\`cost_rollup: MTD = \$\${mtd.toFixed(2)}\`)

  // ... alert logic (see §8) ...
}`}</CodePre>

          <h3>The scheduling</h3>
          <CodePre>{`// pulsewire/src/worker/crontab.ts (sketch)
30 0 * * *    cost_rollup ?fill=day&jobKey=cost_rollup`}</CodePre>

          <p>At 00:30 every day in the local timezone, fire the cost_rollup task. The crontab format is standard cron. The query in the task adjusts for timezone anyway, so the cron time is approximate — running at 00:30 local just gives some slack for late-arriving call logs.</p>

          <h3>The ON CONFLICT trick</h3>
          <p>
            <code>ON CONFLICT (date) DO UPDATE SET est_cost_usd = excluded.est_cost_usd</code> means: if a row for
            this date already exists (e.g., the rollup ran twice for some reason), overwrite the cost. This makes the
            job idempotent — you can re-run it without compounding.
          </p>

          <p><strong>Important caveat:</strong> the UPDATE only overwrites <code>est_cost_usd</code>. It does NOT reset <code>alert_sent</code>. That's deliberate — we don't want re-running the rollup to re-trigger an alert email.</p>

          <h3>Re-running historical rollups</h3>
          <p>If pricing changes and you want to recompute historical costs from the call log:</p>
          <CodePre>{`-- Recompute all rollups from raw log (admin task)
TRUNCATE daily_ai_cost_rollup;
INSERT INTO daily_ai_cost_rollup (date, est_cost_usd, alert_sent)
SELECT
  to_char(date_trunc('day', created_at at time zone 'America/New_York'), 'YYYY-MM-DD'),
  sum(est_cost_usd),
  false
FROM ai_call_log
GROUP BY 1
ORDER BY 1;`}</CodePre>

          <p>This is destructive (truncate + repopulate). Only do it during a maintenance window. Note: since <code>est_cost_usd</code> in the call log is what was estimated AT THE TIME, recomputing the rollup with old prices is correct.</p>

          <h3>What if you want to retroactively REPRICE</h3>
          <p>That's a separate operation: rewrite <code>est_cost_usd</code> in the call log first (UPDATE with the new rate per model), THEN recompute the rollups. Be careful — historical analytics that compared "what we paid" vs "what we predicted" will now diverge.</p>

          <h3>Cost log retention</h3>
          <p>The raw <code>ai_call_log</code> grows. At 10,000 calls/month and ~200 bytes per row, that's ~2 MB per month or 24 MB per year. Negligible. Don't worry about retention until you hit 10× that scale.</p>

          <p>For very high-volume apps, you can purge raw logs older than (say) 6 months and keep only the rolled-up daily numbers:</p>
          <CodePre>{`DELETE FROM ai_call_log
WHERE created_at < NOW() - INTERVAL '6 months';`}</CodePre>

          <p>The rollup table is what matters for cost trends; raw logs are for incident investigation.</p>
        </section>

        <hr />

        {/* SECTION 8 — ALERTS */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Alert + Per-Month Idempotency</h2>
          <p>The alert flow lives inside the daily rollup task. It's clever: one email per month per threshold, never spammy.</p>

          <h3>The full alert block</h3>
          <CodePre>{`// pulsewire/src/worker/tasks/cost-rollup.ts (verbatim, abbreviated)
if (mtd >= ALERT_THRESHOLD_USD) {
  // 1) Ensure today's row exists (so we can set alert_sent on it).
  const today = await db.execute<{ date: string; alert_sent: boolean }>(sql\`
    with today_str as (
      select to_char(now() at time zone 'America/New_York', 'YYYY-MM-DD') as d
    )
    insert into \${dailyAiCostRollup} (date, est_cost_usd, alert_sent)
    select d, 0, false from today_str
    on conflict (date) do nothing
    returning date, alert_sent
  \`)

  // 2) Check whether ANY day this month is marked alert_sent.
  const months = await db.execute<{ sent: boolean }>(sql\`
    select bool_or(alert_sent) as sent
      from \${dailyAiCostRollup}
     where date >= to_char(date_trunc('month', now() at time zone 'America/New_York'), 'YYYY-MM-DD')
  \`)
  const alreadySent = months[0]?.sent === true

  if (!alreadySent) {
    // 3) Compose + send the email.
    const subject = mtd >= PAUSE_THRESHOLD_USD
      ? \`[PulseWire] AI auto-paused — MTD \$\${mtd.toFixed(2)}\`
      : \`[PulseWire] AI cost alert — MTD \$\${mtd.toFixed(2)}\`
    const body = /* ... formatted body ... */
    const sent = await sendAlertEmail({ subject, text: body })

    // 4) Mark today's row as alert_sent.
    if (sent) {
      await db.execute(sql\`
        update \${dailyAiCostRollup}
           set alert_sent = true
         where date = to_char(now() at time zone 'America/New_York', 'YYYY-MM-DD')
      \`)
    }
  } else {
    helpers.logger.info(
      \`cost_rollup: MTD \$\${mtd.toFixed(2)} crossed threshold; alert already sent this month\`,
    )
  }
}`}</CodePre>

          <h3>The clever bit: alert_sent column</h3>
          <p>
            <code>daily_ai_cost_rollup.alert_sent</code> is the per-day boolean. <code>bool_or</code> across all days
            in this month = "has ANY day this month triggered an alert?" If yes, don't send another. If no, send and
            mark today.
          </p>
          <p>
            When the month ends, the new month's days have <code>alert_sent = false</code> by default. So one new
            month → eligible for one new alert. Perfect monthly idempotency without keeping a separate "last alert
            sent at" timestamp.
          </p>

          <h3>Why ensure today's row exists first</h3>
          <p>Today's row might not exist yet if no calls happened today. Without it, we have nowhere to set <code>alert_sent = true</code>. The <code>INSERT ... ON CONFLICT (date) DO NOTHING</code> ensures a row exists; if it was already there, nothing changes.</p>

          <h3>The subject line discrimination</h3>
          <CodePre>{`const subject = mtd >= PAUSE_THRESHOLD_USD
  ? \`[PulseWire] AI auto-paused — MTD \$\${mtd.toFixed(2)}\`
  : \`[PulseWire] AI cost alert — MTD \$\${mtd.toFixed(2)}\``}</CodePre>

          <p>Two thresholds, two subject lines. Alert ($40) vs pause ($50). The operator can tell from the email which one fired.</p>

          <h3>The email body</h3>
          <CodePre>{`const body =
  \`PulseWire AI cost has crossed a threshold.\\n\\n\` +
  \`  Month-to-date: \$\${mtd.toFixed(2)}\\n\` +
  \`  Alert threshold: \$\${ALERT_THRESHOLD_USD}\\n\` +
  \`  Pause threshold: \$\${PAUSE_THRESHOLD_USD}\\n\\n\` +
  (mtd >= PAUSE_THRESHOLD_USD
    ? \`AI calls (embed, summarize, gatekeep) are now auto-paused. ... To unpause: wait for the next month, OR manually delete this month's rows from daily_ai_cost_rollup.\`
    : \`Auto-pause kicks in at \$\${PAUSE_THRESHOLD_USD}. No action required yet.\`)`}</CodePre>

          <p>Plain text, includes the threshold, includes manual-unpause instructions. The unpause instruction is critical — operators need to know HOW to fix it.</p>

          <h3>Manual unpause</h3>
          <p>Two options to lift a pause within a month:</p>
          <ol>
            <li><strong>Delete this month's rollup rows.</strong> MTD recomputes from raw logs, which still show today's costs. Doesn't help — you'd just trip the pause again next probe.</li>
            <li><strong>Raise the pause threshold</strong> (env var change, requires deploy or env update + restart). This is the legitimate way.</li>
            <li><strong>Truncate <code>ai_call_log</code></strong> (destructive). You'd lose forensic data.</li>
          </ol>

          <p>In practice, the pause IS the safety mechanism. Don't reflexively unpause — investigate WHY MTD jumped. If a bug caused it, fix the bug first.</p>

          <h3>SendGrid configuration</h3>
          <p>PulseWire uses SendGrid for the email send. Setup:</p>
          <ol>
            <li>Create a SendGrid account (free tier supports 100/day — plenty for monthly alerts).</li>
            <li>Verify a sender identity.</li>
            <li>Generate an API key with Mail Send permission.</li>
            <li>Set <code>SENDGRID_API_KEY</code> + <code>ALERT_FROM_EMAIL</code> + <code>ALERT_TO_EMAIL</code> in env.</li>
            <li><code>sendAlertEmail</code> calls SendGrid's REST API.</li>
          </ol>

          <p>If SendGrid isn't configured, <code>sendAlertEmail</code> returns false and the rollup logs a warning — but the rollup still completes. Graceful degradation: cost cap still works, just no email.</p>
        </section>

        <hr />

        {/* SECTION 9 — FLEET */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Comparing the Fleet</h2>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th>Concern</th><th>PulseWire</th><th>Tabloom</th><th>ShopKeep</th><th>SecretApp</th></tr>
              <tr><td>Logging</td><td>structured wrapper</td><td>inline logAiCall fn</td><td>activity_log generic</td><td>none</td></tr>
              <tr><td>Per-call cost computed</td><td>yes (pricing table)</td><td>yes</td><td>no</td><td>no</td></tr>
              <tr><td>Aggregation</td><td>daily rollup</td><td>SUM per request</td><td>none</td><td>none</td></tr>
              <tr><td>Threshold</td><td>$40 alert / $50 pause</td><td>—</td><td>—</td><td>—</td></tr>
              <tr><td>Enforcement</td><td>AiPausedError</td><td>—</td><td>—</td><td>—</td></tr>
              <tr><td>Cache</td><td>60s pause cache</td><td>—</td><td>—</td><td>—</td></tr>
              <tr><td>Alert</td><td>SendGrid + monthly idempotency</td><td>—</td><td>—</td><td>—</td></tr>
              <tr><td>Storage</td><td>Postgres</td><td>SQLite</td><td>SQLite</td><td>SQLite</td></tr>
              <tr><td>Per-user attribution</td><td>route_or_job</td><td>user_oid + operation</td><td>tool_id + action</td><td>—</td></tr>
            </tbody>
          </table>

          <h3>When each shines</h3>
          <p><strong>PulseWire's full stack</strong> is the right choice when:</p>
          <ul>
            <li>You have multiple AI surfaces (chat + embed + summarize).</li>
            <li>One bug could cost &gt; $50.</li>
            <li>You want predictable monthly cost ceilings.</li>
            <li>You need to investigate "what cost the most" after the fact.</li>
          </ul>

          <p><strong>Tabloom's mid-tier</strong> is right when:</p>
          <ul>
            <li>AI is one-off (search + occasional summarization).</li>
            <li>You want per-user attribution but don't need real enforcement.</li>
            <li>Volume is low enough that scanning the raw log is fast.</li>
          </ul>

          <p><strong>ShopKeep's activity-log tier</strong> is right when:</p>
          <ul>
            <li>AI is rare (manual photo identification, occasional enrichment).</li>
            <li>You already have a generic activity log.</li>
            <li>Cost isn't a top concern.</li>
          </ul>

          <p><strong>SecretApp's no-tracking</strong> is right when:</p>
          <ul>
            <li>You're the only user.</li>
            <li>Volume is under $1/month.</li>
            <li>The Azure portal's per-resource cost dashboard is sufficient observability.</li>
          </ul>

          <h3>Migration path</h3>
          <p>From SecretApp's "none" to PulseWire's "full":</p>
          <ol>
            <li>Add the activity_log table. Log every AI call with operation + tokens (1 hour of work).</li>
            <li>Add a pricing table + estimateCost function. Backfill cost_usd. Now you have Tabloom-tier.</li>
            <li>Add a daily rollup table + nightly cron. Compute MTD on demand. Still no enforcement.</li>
            <li>Add a threshold check + AiPausedError. Wrap every AI call in <code>withAiCallLog</code> (or whatever pattern fits your codebase). PulseWire-tier.</li>
            <li>Add SendGrid alert + per-month idempotency. Done.</li>
          </ol>

          <p>Each step is independently valuable. You can stop wherever your app's risk profile fits.</p>

          <h3>What about per-user budgets</h3>
          <p>
            None of the fleet apps ship this today. The pattern is: add a <code>user_budget_usd</code> column to your
            users table, query MTD per user (group by user_oid in the rollup or call log), throw an error if user MTD
            exceeds budget. Same shape as PulseWire's global pause, just scoped narrower.
          </p>

          <p>The complication is what to do when a user is paused. Block the request entirely? Show "your budget is full" UI? Let admins override? These are product decisions, not technical ones.</p>
        </section>

        <hr />

        {/* SECTION 10 — ACTIVITY LOGS */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Beyond AI: Activity Logs</h2>
          <p>The patterns in this guide generalize to ANY activity logging. ShopKeep's activity_log isn't AI-specific; it's how the whole app logs significant user actions.</p>

          <h3>The "audit log" pattern</h3>
          <p>Add a table with these columns:</p>
          <ul>
            <li><strong>id</strong>: primary key.</li>
            <li><strong>created_at / timestamp</strong>: when.</li>
            <li><strong>actor</strong>: user_oid or "system."</li>
            <li><strong>action</strong>: short verb-noun phrase ("ai_identify_tool", "delete_movie", "create_user").</li>
            <li><strong>subject</strong>: optional — what the action acted on ("tool 42", "movie X").</li>
            <li><strong>details</strong>: JSON blob with action-specific fields.</li>
          </ul>

          <h3>ShopKeep's example</h3>
          <CodePre>{`-- shopkeep/server.js
CREATE TABLE IF NOT EXISTS activity_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  action    TEXT NOT NULL,
  tool_id   INTEGER,
  tool_name TEXT,
  details   TEXT
);`}</CodePre>

          <p>Less normalized than PulseWire's split tables — everything goes here. Tool checkouts, AI calls, deletions, photo uploads. The action column is the filter; details JSON has the per-action fields.</p>

          <h3>Hearth's plex_action_log</h3>
          <CodePre>{`-- secretapp/schema.sql (Plex delete audit, sketch)
CREATE TABLE IF NOT EXISTS plex_action_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp     TEXT NOT NULL DEFAULT (datetime('now')),
  action        TEXT NOT NULL,         -- 'delete', 'verify_failed', 'cancelled'
  plex_id       TEXT,
  title         TEXT,
  year          INTEGER,
  guid          TEXT,
  file_path     TEXT,
  metadata_json TEXT,                   -- full snapshot
  outcome       TEXT,                   -- 'success', 'failed'
  error         TEXT
);`}</CodePre>

          <p>
            Hearth's Plex delete flow writes one row per attempted delete (success, failed, verify_failed, cancelled).
            This is forensic-grade — full metadata snapshot in JSON means you can reconstruct exactly what was deleted
            even if Plex itself loses the metadata. Audit logs for irreversible operations should over-capture.
          </p>

          <h3>What to log vs not</h3>
          <table>
            <tbody>
              <tr><th>Log</th><th>Don't log</th></tr>
              <tr><td>Action performed</td><td>Password fields</td></tr>
              <tr><td>Actor (user_oid)</td><td>Full session tokens</td></tr>
              <tr><td>Subject (what was acted on)</td><td>API keys</td></tr>
              <tr><td>Outcome (success/fail)</td><td>Full plaintext credentials</td></tr>
              <tr><td>Error message</td><td>SSNs / payment data without redaction</td></tr>
              <tr><td>Timestamps</td><td>Heavy debug data (use a separate purge-able table)</td></tr>
            </tbody>
          </table>

          <h3>Query patterns</h3>
          <CodePre>{`-- All AI calls today by user
SELECT operation, COUNT(*), SUM(cost_usd)
  FROM ai_calls
 WHERE created_at >= date('now', 'start of day')
   AND user_oid = ?
 GROUP BY operation;

-- Cost by user this month
SELECT user_oid, SUM(cost_usd) as total
  FROM ai_calls
 WHERE created_at >= date('now', 'start of month')
 GROUP BY user_oid
 ORDER BY total DESC
 LIMIT 20;

-- Tool deletion audit
SELECT timestamp, action, tool_name, details
  FROM activity_log
 WHERE action = 'delete_tool'
 ORDER BY timestamp DESC;`}</CodePre>

          <h3>Retention</h3>
          <ul>
            <li><strong>Cost log</strong>: 6–12 months is plenty. Older data lives in the rollup.</li>
            <li><strong>Activity / audit log</strong>: long-term — usually as long as the data the log references exists. Compliance frameworks (SOC 2, HIPAA) often mandate 1–7 years.</li>
            <li><strong>Debug / trace log</strong>: short-term — purge daily. Don't conflate with audit logs.</li>
          </ul>

          <h3>Indexing</h3>
          <p>Activity logs grow. Index the columns you query on:</p>
          <CodePre>{`CREATE INDEX activity_log_action_ts_idx ON activity_log(action, timestamp DESC);
CREATE INDEX activity_log_actor_idx     ON activity_log(actor, timestamp DESC);
CREATE INDEX ai_calls_user_ts_idx       ON ai_calls(user_oid, created_at DESC);`}</CodePre>

          <p>The descending timestamp index supports "show me the latest 50 actions" without sorting the whole table.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Build a Cost Cap</h2>
          <p>Build PulseWire's cost cap from scratch — minus the rollup (lab is SQLite, full-table sum is fine at lab scale). ~60 lines of code; everything end-to-end.</p>

          <h3>Setup</h3>
          <CodePre>{`npm install better-sqlite3 dotenv
# AZURE_OPENAI_* env vars from previous lab`}</CodePre>

          <h3>Step 1 — schema</h3>
          <CodePre>{`// schema.sql
CREATE TABLE IF NOT EXISTS ai_calls (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  operation     TEXT NOT NULL,
  model         TEXT NOT NULL,
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_usd      REAL NOT NULL DEFAULT 0,
  succeeded     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS ai_calls_created_at_idx ON ai_calls(created_at DESC);`}</CodePre>

          <h3>Step 2 — pricing</h3>
          <CodePre>{`// cost.js
const MODEL_PRICING = {
  'gpt-5':                  { input: 5e-6,    output: 15e-6 },
  'gpt-4.1':                { input: 2.5e-6,  output: 10e-6 },
  'text-embedding-3-small': { input: 0.02e-6, output: 0 },
}

export function estimateCostUsd(model, inputTokens, outputTokens) {
  const p = MODEL_PRICING[model] ?? MODEL_PRICING['gpt-5']
  return inputTokens * p.input + outputTokens * p.output
}`}</CodePre>

          <h3>Step 3 — wrapper + pause</h3>
          <CodePre>{`// cap.js
import { estimateCostUsd } from './cost.js'

export const ALERT_THRESHOLD_USD = 0.50    // tiny — for lab
export const PAUSE_THRESHOLD_USD = 1.00

export class AiPausedError extends Error {
  constructor(reason) {
    super(\`AI calls paused: \${reason}\`)
    this.name = 'AiPausedError'
  }
}

let cache = null
const TTL_MS = 60_000

function mtdCostUsd(db) {
  const row = db.prepare(\`
    SELECT COALESCE(SUM(cost_usd), 0) AS mtd
    FROM ai_calls
    WHERE created_at >= date('now', 'start of month')
  \`).get()
  return row.mtd ?? 0
}

export function getPauseState(db) {
  const now = Date.now()
  if (cache && cache.expiresAt > now) return cache.value
  const mtd = mtdCostUsd(db)
  const state = mtd >= PAUSE_THRESHOLD_USD
    ? { paused: true, reason: \`MTD \$\${mtd.toFixed(4)} >= \$\${PAUSE_THRESHOLD_USD}\`, mtdUsd: mtd }
    : { paused: false, mtdUsd: mtd }
  cache = { value: state, expiresAt: now + TTL_MS }
  return state
}

export function invalidatePauseCache() { cache = null }

export async function withAiCallLog(db, meta, fn) {
  try {
    const { data, inputTokens, outputTokens } = await fn()
    const cost = estimateCostUsd(meta.model, inputTokens, outputTokens)
    db.prepare(\`
      INSERT INTO ai_calls (operation, model, input_tokens, output_tokens, cost_usd, succeeded)
      VALUES (?, ?, ?, ?, ?, 1)
    \`).run(meta.routeOrJob, meta.model, inputTokens, outputTokens, cost)
    invalidatePauseCache()
    return data
  } catch (e) {
    try {
      db.prepare(\`
        INSERT INTO ai_calls (operation, model, succeeded)
        VALUES (?, ?, 0)
      \`).run(meta.routeOrJob, meta.model)
    } catch {}
    throw e
  }
}`}</CodePre>

          <h3>Step 4 — example wrapped call</h3>
          <CodePre>{`// chat.js
import 'dotenv/config'
import Database from 'better-sqlite3'
import fs from 'node:fs'
import { withAiCallLog, getPauseState, AiPausedError } from './cap.js'

const db = new Database('./cap.db')
db.exec(fs.readFileSync('./schema.sql', 'utf8'))

const cfg = {
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey:   process.env.AZURE_OPENAI_API_KEY,
  version:  process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
}

export async function chat(messages) {
  const pause = getPauseState(db)
  if (pause.paused) throw new AiPausedError(pause.reason)

  return withAiCallLog(db, { routeOrJob: 'chat', model: 'gpt-5' }, async () => {
    const url = \`\${cfg.endpoint}openai/deployments/\${cfg.deployment}/chat/completions?api-version=\${cfg.version}\`
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': cfg.apiKey },
      body: JSON.stringify({ messages, max_tokens: 200 })
    })
    if (!r.ok) throw new Error(\`API \${r.status}: \${await r.text()}\`)
    const data = await r.json()
    return {
      data: data.choices[0].message.content,
      inputTokens:  data.usage.prompt_tokens,
      outputTokens: data.usage.completion_tokens,
    }
  })
}`}</CodePre>

          <h3>Step 5 — run it</h3>
          <CodePre>{`// run.js
import { chat } from './chat.js'

// Burst until cap trips
for (let i = 0; i < 100; i++) {
  try {
    const text = await chat([{ role: 'user', content: 'Say hi in 10 words.' }])
    console.log(i, text.slice(0, 40))
  } catch (e) {
    console.log(i, e.name, e.message)
    if (e.name === 'AiPausedError') break
  }
}

console.log('Done. Check ai_calls table.')`}</CodePre>

          <h3>What you should see</h3>
          <ol>
            <li>First N calls succeed, logging rows to ai_calls.</li>
            <li>When MTD exceeds $1, the next call's <code>getPauseState</code> returns paused.</li>
            <li>AiPausedError is thrown. Loop breaks.</li>
            <li><code>sqlite3 cap.db 'SELECT SUM(cost_usd), COUNT(*) FROM ai_calls'</code> shows the tally.</li>
          </ol>

          <h3>Extensions</h3>
          <ul>
            <li>Add a daily rollup table + nightly cron. Make MTD use rollup + today.</li>
            <li>Add SendGrid alert email.</li>
            <li>Add per-user budgets (user_oid column + per-user threshold).</li>
            <li>Add an admin endpoint that shows MTD + pause state + recent failures.</li>
            <li>Reset cap.db and watch the cap re-engage.</li>
            <li>Modify <code>cap.js</code> to support cached input tokens (Anthropic pricing).</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Calls bypass the pause"</h3>
          <p>Someone added a new AI call path that doesn't go through <code>withAiCallLog</code>. Audit every <code>fetch</code> to <code>openai</code> / <code>anthropic</code> / <code>voyage</code> domains. Force-fit them through the wrapper.</p>

          <h3>"MTD is wrong"</h3>
          <ul>
            <li><strong>Timezone mismatch.</strong> Your query uses UTC; your rollup uses local. Pick one and stick to it.</li>
            <li><strong>Pricing table out of date.</strong> Old rates inflate or deflate estimates.</li>
            <li><strong>Rollup didn't run last night.</strong> Check the cron history. Re-run manually.</li>
            <li><strong>Cache is stale.</strong> 60s old; mostly fine. Force invalidate with the function call.</li>
          </ul>

          <h3>"Pause won't lift"</h3>
          <p>Cache TTL is 60s. After raising the threshold or clearing logs, give it a minute, or call <code>invalidatePauseCache()</code>. If still paused: query the cache value and the raw MTD separately to find the divergence.</p>

          <h3>"Alert email never sent"</h3>
          <ul>
            <li>SendGrid not configured (check <code>SENDGRID_API_KEY</code>).</li>
            <li>Sender identity not verified (check SendGrid portal).</li>
            <li>Already sent this month (<code>alert_sent = true</code> on some row). Clear if testing.</li>
            <li>Spam folder.</li>
          </ul>

          <h3>"Alert email arrived twice"</h3>
          <p>The <code>alert_sent</code> flag should make this impossible — unless the rollup job double-ran AND the second run happened before the first marked the flag. Add a SELECT FOR UPDATE around the alert block, or use a transaction.</p>

          <h3>"Workers retry paused jobs forever"</h3>
          <p>The worker is RE-THROWING <code>AiPausedError</code>. Fix the catch block to return cleanly when the error is paused-related. Pause errors are not transient — retrying doesn't help.</p>

          <h3>"DB INSERT slow — logging is bottlenecking AI calls"</h3>
          <p>You probably don't have an index on <code>ai_call_log.created_at</code>, or you have a trigger doing extra work on every INSERT. Both unusual. For high-volume apps (1000+ AI calls/minute), consider buffering log writes (5s flush) instead of awaiting each.</p>

          <h3>"Cost log table is huge"</h3>
          <p>Set up a purge job. Keep raw logs 6 months, rollups indefinitely. Anything older than 6 months in the raw log is purgeable — the rollup has the aggregate.</p>

          <h3>"Streaming calls aren't getting cost-logged"</h3>
          <p>For streaming, <code>usage</code> only arrives in the FINAL chunk, and only if you pass <code>{`stream_options: { include_usage: true }`}</code>. Make sure to parse the usage from the final delta and pass it to the wrapper.</p>

          <h3>"Pricing for cached input is wrong"</h3>
          <p>Anthropic returns separate <code>cache_read_input_tokens</code> and <code>cache_creation_input_tokens</code> in its usage object. To price correctly, your pricing table needs three rates (input, cached, output) and your wrapper needs to receive all three counts.</p>

          <h3>"MTD jumped 10× overnight"</h3>
          <p>Run <code>SELECT operation, COUNT(*), SUM(cost_usd) FROM ai_calls WHERE created_at &gt;= datetime('now', '-1 day') GROUP BY operation ORDER BY 3 DESC</code>. The operation at the top is the culprit. Then read that route's code for a recent change.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Schema — PulseWire</h3>
          <CodePre>{`-- log table
CREATE TABLE ai_call_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_or_job  TEXT NOT NULL,
  model         TEXT NOT NULL,
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  est_cost_usd  NUMERIC(12, 6) NOT NULL DEFAULT 0,
  succeeded     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX ai_call_log_created_at_idx ON ai_call_log(created_at DESC);

-- rollup
CREATE TABLE daily_ai_cost_rollup (
  date          TEXT PRIMARY KEY,       -- YYYY-MM-DD (local TZ)
  est_cost_usd  NUMERIC(12, 6) NOT NULL DEFAULT 0,
  alert_sent    BOOLEAN NOT NULL DEFAULT false
);`}</CodePre>

          <h3>Wrapper</h3>
          <CodePre>{`async function withAiCallLog(meta, fn) {
  try {
    const { data, inputTokens, outputTokens } = await fn()
    const cost = estimateCostUsd(meta.model, inputTokens, outputTokens)
    await db.insert(aiCallLog).values({
      routeOrJob: meta.routeOrJob,
      model: meta.model,
      inputTokens, outputTokens,
      estCostUsd: cost.toFixed(6),
      succeeded: true,
    })
    return data
  } catch (e) {
    await db.insert(aiCallLog).values({
      routeOrJob: meta.routeOrJob,
      model: meta.model,
      inputTokens: 0, outputTokens: 0,
      estCostUsd: '0',
      succeeded: false,
    }).catch(() => {})
    throw e
  }
}`}</CodePre>

          <h3>Pricing</h3>
          <CodePre>{`const MODEL_PRICING = {
  'gpt-5':                  { input: 5e-6,    output: 15e-6 },
  'gpt-4.1':                { input: 2.5e-6,  output: 10e-6 },
  'text-embedding-3-small': { input: 0.02e-6, output: 0 },
}

estimateCostUsd(model, inTok, outTok) = inTok * p.input + outTok * p.output`}</CodePre>

          <h3>Pause</h3>
          <CodePre>{`export class AiPausedError extends Error {
  constructor(reason) { super(\`AI calls paused: \${reason}\`); this.name = 'AiPausedError' }
}

// in every entry point:
const pause = await getPauseState()
if (pause.paused) throw new AiPausedError(pause.reason)`}</CodePre>

          <h3>MTD SQL (PostgreSQL)</h3>
          <CodePre>{`with current_month_start as (
  select to_char(date_trunc('month', now() at time zone 'America/New_York'), 'YYYY-MM-DD') as start_str
),
rolled as (
  select coalesce(sum(est_cost_usd), 0) as c
    from daily_ai_cost_rollup
   where date >= (select start_str from current_month_start)
),
today as (
  select coalesce(sum(est_cost_usd), 0) as c
    from ai_call_log
   where created_at >= date_trunc('day', now() at time zone 'America/New_York') at time zone 'America/New_York'
)
select (rolled.c + today.c)::text as mtd from rolled, today;`}</CodePre>

          <h3>Daily rollup task (00:30 nightly)</h3>
          <CodePre>{`insert into daily_ai_cost_rollup (date, est_cost_usd, alert_sent)
select
  to_char(date_trunc('day', created_at at time zone 'America/New_York'), 'YYYY-MM-DD'),
  sum(est_cost_usd),
  false
from ai_call_log
where date_trunc('day', created_at at time zone 'America/New_York')
    = date_trunc('day', (now() at time zone 'America/New_York') - interval '1 day')
group by 1
on conflict (date) do update set est_cost_usd = excluded.est_cost_usd;`}</CodePre>

          <h3>Per-month alert idempotency</h3>
          <CodePre>{`-- alert is sent only if NO day this month has alert_sent = true
select bool_or(alert_sent) as sent
  from daily_ai_cost_rollup
 where date >= to_char(date_trunc('month', now() at time zone 'America/New_York'), 'YYYY-MM-DD');`}</CodePre>

          <h3>Caller patterns</h3>
          <CodePre>{`// Workers catching pause:
try { vec = await embedOne(...) }
catch (e) {
  if (e instanceof AiPausedError) { log.warn(...); return }   // ← exit, no retry
  throw e                                                      // ← retry transient
}

// HTTP routes catching pause:
try { return await chatComplete(...) }
catch (e) {
  if (e instanceof AiPausedError) return res.status(503).json({ paused: true })
  throw e
}`}</CodePre>

          <h3>Logging tier choices</h3>
          <table>
            <tbody>
              <tr><th>Tier</th><th>Schema</th><th>Effort</th><th>Caps?</th></tr>
              <tr><td>1</td><td>activity_log (generic)</td><td>1 hour</td><td>No</td></tr>
              <tr><td>2</td><td>ai_calls (AI-specific)</td><td>2 hours</td><td>Optional manual</td></tr>
              <tr><td>3</td><td>ai_call_log + rollup + pause</td><td>1 day</td><td>Yes (auto)</td></tr>
            </tbody>
          </table>

          <h3>The four moving parts</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  CALL[AI call] --> W[withAiCallLog]
  W --> LOG[(ai_call_log)]
  LOG --> RJ[cost_rollup 00:30]
  RJ --> R[(daily_ai_cost_rollup)]
  R --> M[getMtdCostUsd]
  LOG --> M
  M --> P{Threshold?}
  P -->|>= 40| EMAIL[SendGrid]
  P -->|>= 50| ERR[AiPausedError]
  style W fill:#5C2A4A,color:#fff
  style P fill:#5C2A4A,color:#fff`} />

          <h3>The discipline</h3>
          <ul>
            <li>Every AI call goes through the wrapper. No exceptions.</li>
            <li>Workers catch <code>AiPausedError</code> and exit cleanly — never re-throw.</li>
            <li>Don't log prompts. Hash them if you need re-query detection.</li>
            <li>Timezone consistency across all queries.</li>
            <li>Use NUMERIC for money, not REAL/FLOAT.</li>
            <li>Cache the pause probe (60s is fine).</li>
            <li>One email per month per threshold.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
