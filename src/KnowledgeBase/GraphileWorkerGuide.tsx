import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'graphile-worker vs Alternatives',  icon: '⚖️' },
  { id: 's3',  num: '3',  title: 'The Worker Process',               icon: '🔁' },
  { id: 's4',  num: '4',  title: 'Defining Tasks',                   icon: '🧩' },
  { id: 's5',  num: '5',  title: 'Enqueuing Jobs (addJob)',          icon: '📨' },
  { id: 's6',  num: '6',  title: 'Fan-out Chains',                   icon: '🔀' },
  { id: 's7',  num: '7',  title: 'Crontab + Periodic Schedules',     icon: '⏰' },
  { id: 's8',  num: '8',  title: 'Retries + Idempotency',            icon: '🔄' },
  { id: 's9',  num: '9',  title: 'Bundling with esbuild',            icon: '📦' },
  { id: 's10', num: '10', title: 'Operational Concerns',             icon: '🚦' },
  { id: 's11', num: '★',  title: 'Lab: Job Queue from Scratch',      icon: '🛠️' },
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

export default function GraphileWorkerGuide() {
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
            <span className="sidebar-title">graphile-worker</span>
          </div>
          <div className="sidebar-sub">Postgres-backed jobs</div>
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
          <div className="hero-tag">⚙️ graphile-worker 0.16 · Postgres-backed · 2026</div>
          <h1>graphile-worker<br />(PulseWire's job queue)</h1>
          <p>
            PulseWire ships a <strong style={{ color: '#C77AA0' }}>Postgres-backed job queue</strong> — no Redis, no
            separate broker, just the same database that holds the application data. This guide walks every layer of
            PulseWire's worker: the second process spawned by the launcher, the task registry with crontab schedules,
            individual task definitions, the fan-out chain (fetch → embed → cluster → score → summarize), retry +
            idempotency patterns, and the esbuild bundling step that produces a single <code>dist/worker.mjs</code>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">12</span><span className="hero-stat-label">PulseWire tasks</span></div>
            <div className="hero-stat"><span className="hero-stat-val">7</span><span className="hero-stat-label">Cron schedules</span></div>
            <div className="hero-stat"><span className="hero-stat-val">3</span><span className="hero-stat-label">Worker concurrency</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">Redis</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            A job queue lets the web process say "do X later" and a worker process do X. PulseWire's web handles user
            requests; the worker handles RSS feed fetching, embedding, clustering, scoring, and summarizing. The two
            processes communicate via a Postgres table called <code>graphile_worker.jobs</code> — the web inserts rows,
            the worker SELECTs + processes + deletes them.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The diner ticket spike.</strong> The cook (worker) doesn't go to each customer (web request) to ask
            what they want. The server (web) writes tickets and stabs them on a spike. The cook pulls the next ticket,
            cooks it, plates it. PulseWire's <code>graphile_worker.jobs</code> table IS the spike.
          </p>
          <p>
            <strong>The mail room.</strong> Direct calls (web → AI API) are like running across the office to deliver a
            letter. Job queues are like dropping it in the mail room — someone else delivers later. You move on; the
            letter still arrives.
          </p>
          <p>
            <strong>"Postgres-backed" vs "Redis-backed."</strong> Most JS job queues (BullMQ, Bee Queue) use Redis as
            the broker. Redis is faster but it's another service to run. graphile-worker uses Postgres — slower in
            raw throughput, but one less moving part. For PulseWire's scale (~100k jobs/month), Postgres is plenty
            fast.
          </p>

          <h3>What's actually in the queue</h3>
          <p>graphile-worker creates a dedicated schema in your database:</p>
          <CodePre>{`-- Inside the Postgres DB
\\dn graphile_worker

-- Tables it owns:
graphile_worker.jobs                  -- pending + locked jobs
graphile_worker.job_queues            -- queue metadata (optional throttling)
graphile_worker.known_crontabs         -- cron schedule registry
graphile_worker.migrations            -- internal schema versioning`}</CodePre>

          <p>You don't interact with these directly. graphile-worker provides functions: <code>addJob()</code>, <code>complete_job()</code>, etc., that handle inserts and atomic claims.</p>

          <h3>The job lifecycle</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  P[Producer<br/>web/cron] -->|INSERT| J[(graphile_worker.jobs)]
  J -->|SELECT...FOR UPDATE SKIP LOCKED| W[Worker]
  W --> T[Task handler]
  T -->|success| D[DELETE row]
  T -->|throw| R{Retry?}
  R -->|yes - backoff| J
  R -->|max attempts| F[Mark failed]`} />

          <h3>What PulseWire uses the worker for</h3>
          <ol>
            <li><strong>Periodic work</strong> (crontab): re-fetch feeds every 5 minutes, daily cost rollup, weekly prune.</li>
            <li><strong>Fan-out chains</strong>: fetching a feed creates an article → embed it → cluster it → score it → maybe summarize.</li>
            <li><strong>Long-running tasks</strong>: backfilling embeddings for 1000 stale articles.</li>
            <li><strong>Off-thread AI calls</strong>: chat completions that take 10-30 seconds — block the web for that long and request times blow up.</li>
          </ol>

          <h3>The seven moving parts</h3>
          <ol>
            <li><strong>The Postgres tables</strong> (auto-managed by graphile-worker).</li>
            <li><strong>The worker process</strong> (<code>scripts/launch-prod.mjs</code> spawns it).</li>
            <li><strong>The task registry</strong> (<code>src/worker/index.ts</code>): a map of task names → handler functions.</li>
            <li><strong>The crontab</strong> (also in <code>src/worker/index.ts</code>): periodic schedules.</li>
            <li><strong>Task files</strong> (<code>src/worker/tasks/*.ts</code>): individual handlers.</li>
            <li><strong>Producers</strong>: web routes + other tasks that call <code>helpers.addJob()</code> to enqueue.</li>
            <li><strong>The esbuild bundle</strong>: <code>scripts/build-worker.mjs</code> compiles everything into <code>dist/worker.mjs</code>.</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 2 — VS ALTERNATIVES */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>graphile-worker vs Alternatives</h2>
          <p>Three popular job-queue options in the JS ecosystem. graphile-worker is PulseWire's pick; understand the alternatives to know why.</p>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th></th><th>graphile-worker</th><th>BullMQ</th><th>Inngest / Trigger.dev</th></tr>
              <tr><td>Backing store</td><td>Postgres</td><td>Redis</td><td>SaaS (hosted)</td></tr>
              <tr><td>Extra service needed?</td><td>None — uses your existing Postgres</td><td>Redis</td><td>External SaaS</td></tr>
              <tr><td>Throughput</td><td>~1000 jobs/sec/worker</td><td>~10000 jobs/sec/worker</td><td>Varies</td></tr>
              <tr><td>Persistence</td><td>Postgres durability</td><td>Redis (RDB/AOF)</td><td>Provider's promise</td></tr>
              <tr><td>Cron schedules</td><td>Built-in</td><td>Built-in (BullMQ Pro)</td><td>Built-in</td></tr>
              <tr><td>UI / dashboard</td><td>Optional (graphile-worker-ui)</td><td>Bull Board, BullMQ UI</td><td>Built-in (hosted)</td></tr>
              <tr><td>Observability</td><td>Query the jobs table directly</td><td>Bull-board, Prometheus</td><td>Built-in</td></tr>
              <tr><td>Atomic dequeue</td><td>SELECT FOR UPDATE SKIP LOCKED</td><td>Redis BLPOP/BRPOPLPUSH</td><td>Provider-managed</td></tr>
              <tr><td>Setup complexity</td><td>Low (just connect)</td><td>Medium (Redis + monitor)</td><td>Low (sign up)</td></tr>
              <tr><td>Cost</td><td>$0 extra (uses existing DB)</td><td>Redis cost (~$10-50/mo)</td><td>SaaS pricing (variable)</td></tr>
              <tr><td>PulseWire fit</td><td>✓ Perfect</td><td>Overkill at scale</td><td>External dependency</td></tr>
            </tbody>
          </table>

          <h3>Why PulseWire picks graphile-worker</h3>
          <ul>
            <li><strong>Already on Postgres.</strong> Adding Redis would mean another Azure service to manage + pay for.</li>
            <li><strong>Throughput sufficient.</strong> ~1k jobs/sec/worker is 100× what PulseWire ever needs.</li>
            <li><strong>Operationally simple.</strong> One DB. One backup. One credential. No Redis-out-of-memory issues.</li>
            <li><strong>Postgres durability.</strong> Job persistence is whatever Postgres guarantees — strong.</li>
            <li><strong>Atomic dequeue via SKIP LOCKED.</strong> Postgres 9.5+ has this as a primitive; multiple workers can pull from the same queue without contention.</li>
            <li><strong>Crontab built-in.</strong> Periodic schedules without a separate scheduler.</li>
            <li><strong>The same SQL you query for data is what you query for ops.</strong> "Why are these jobs stuck?" is a SELECT. No separate UI required.</li>
          </ul>

          <h3>When to graduate to BullMQ</h3>
          <ul>
            <li>Job throughput &gt; 10k/sec.</li>
            <li>You're already running Redis for caching.</li>
            <li>You want Bull-board's UI without writing your own.</li>
            <li>You need fine-grained rate limiting (BullMQ's <code>RateLimiter</code> is more sophisticated).</li>
          </ul>

          <h3>When to skip self-hosted entirely</h3>
          <p>Inngest, Trigger.dev, Defer — managed job-queue SaaS. Trade money for ops simplicity. Reasonable for early-stage SaaS apps. Not how the fleet thinks about cost.</p>

          <h3>The "everything in Postgres" philosophy</h3>
          <p>PulseWire's stack reflects a deliberate "minimize services" stance:</p>
          <ul>
            <li>One Postgres (data + queue + cron + cost ledger)</li>
            <li>One App Service container (web + worker via launcher)</li>
            <li>One Foundry deployment</li>
            <li>One Key Vault</li>
            <li>One identity (Entra) for everything</li>
          </ul>

          <p>Each service is a thing to monitor, back up, secure, pay for. Consolidating to Postgres + Azure App Service + Foundry keeps the operational surface tiny.</p>
        </section>

        <hr />

        {/* SECTION 3 — WORKER PROCESS */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The Worker Process</h2>
          <p>graphile-worker ships an embeddable <code>run()</code> function. PulseWire wraps it in <code>src/worker/index.ts</code> — the entry point spawned alongside Next.js by the launcher.</p>

          <h3>PulseWire's full worker entry</h3>
          <CodePre>{`// PulseWire/src/worker/index.ts — verbatim
import { run } from 'graphile-worker'

import { backfillEmbeddingsTask } from './tasks/backfill-embeddings'
import { clusterArticleTask } from './tasks/cluster-article'
import { costRollupTask } from './tasks/cost-rollup'
import { embedArticleTask } from './tasks/embed-article'
import { enqueueDueFetchesTask } from './tasks/enqueue-due-fetches'
import { fetchFeedTask } from './tasks/fetch-feed'
import { gatekeepBorderlineTask } from './tasks/gatekeep-borderline'
import { pruneArticlesTask } from './tasks/prune-articles'
import { scoreArticleTask } from './tasks/score-article'
import { scoreArticlesNightlyTask } from './tasks/score-articles-nightly'
import { summarizeClusterTask } from './tasks/summarize-cluster'
import { summarizeDemoArticlesTask } from './tasks/summarize-demo-articles'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set — worker cannot start')
  }

  console.log('[worker] starting graphile-worker')
  const runner = await run({
    connectionString,
    concurrency: 3,
    noHandleSignals: false,
    pollInterval: 5000,
    taskList: {
      enqueue_due_fetches:     enqueueDueFetchesTask,
      fetch_feed:              fetchFeedTask,
      prune_articles:          pruneArticlesTask,
      cost_rollup:             costRollupTask,
      embed_article:           embedArticleTask,
      backfill_embeddings:     backfillEmbeddingsTask,
      cluster_article:         clusterArticleTask,
      summarize_cluster:       summarizeClusterTask,
      score_article:           scoreArticleTask,
      score_articles_nightly:  scoreArticlesNightlyTask,
      gatekeep_borderline:     gatekeepBorderlineTask,
      summarize_demo_articles: summarizeDemoArticlesTask,
    },
    crontab: [
      '*/5 * * * * enqueue_due_fetches',
      '30 4 * * * cost_rollup',
      '30 5 * * * backfill_embeddings',
      '0 6 * * * score_articles_nightly',
      '30 6 * * * gatekeep_borderline',
      '0 7 * * * prune_articles',
      '0 13 * * * summarize_demo_articles',
    ].join('\\n'),
  })

  console.log(
    '[worker] running (concurrency=3, fetches /5min, nightly chain 04:30→07:00 UTC)',
  )
  await runner.promise
}

main().catch((e) => {
  console.error('[worker] fatal:', e)
  process.exit(1)
})`}</CodePre>

          <h3>The <code>run()</code> options</h3>
          <table>
            <tbody>
              <tr><th>Option</th><th>What it does</th></tr>
              <tr><td><code>connectionString</code></td><td>Postgres URL. Same DB as the app.</td></tr>
              <tr><td><code>concurrency</code></td><td>Max parallel jobs per worker process. PulseWire: 3.</td></tr>
              <tr><td><code>noHandleSignals</code></td><td>If true, graphile-worker doesn't install signal handlers — useful when running embedded.</td></tr>
              <tr><td><code>pollInterval</code></td><td>Backstop polling. graphile-worker uses LISTEN/NOTIFY for instant pickup; <code>pollInterval</code> is the fallback if a NOTIFY is missed.</td></tr>
              <tr><td><code>taskList</code></td><td>Map of task name → handler function.</td></tr>
              <tr><td><code>crontab</code></td><td>String with one cron schedule per line.</td></tr>
            </tbody>
          </table>

          <h3>The concurrency knob</h3>
          <p>
            <code>concurrency: 3</code> means up to 3 jobs run at the same time within this worker process. PulseWire's
            picks: AI tasks are I/O-bound (waiting on Foundry), so concurrency = 3 keeps the pipeline full without
            exhausting the database connection pool (which has max 5).
          </p>

          <p>For CPU-bound tasks (e.g. heavy data crunching), set concurrency = number of CPU cores. For pure I/O, you can go higher; just respect downstream rate limits.</p>

          <h3>The LISTEN/NOTIFY trick</h3>
          <p>graphile-worker has two ways to know when new jobs arrive:</p>
          <ol>
            <li><strong>LISTEN/NOTIFY</strong>: Postgres pushes a notification when a job is added. The worker picks up within milliseconds.</li>
            <li><strong>Polling</strong>: Every <code>pollInterval</code> ms, the worker SELECTs for pending jobs. Backstop in case a NOTIFY is dropped.</li>
          </ol>

          <p>For PulseWire, the 5-second poll interval means jobs are picked up within ~5s worst-case (if NOTIFY misses). Instant in the common case.</p>

          <h3>Graceful shutdown</h3>
          <p>With <code>noHandleSignals: false</code>, graphile-worker installs SIGTERM/SIGINT handlers. On signal:</p>
          <ol>
            <li>Stop accepting new jobs.</li>
            <li>Wait for in-flight jobs to complete (with a timeout).</li>
            <li>Exit cleanly.</li>
          </ol>

          <p>This matters for App Service restarts — a deploy sends SIGTERM and waits ~30s. graphile-worker uses that window to finish what's in progress; the launcher kills it if it overruns.</p>

          <h3>How it connects to the launcher</h3>
          <p>Recall from the Next.js App Router guide §8: <code>scripts/launch-prod.mjs</code> spawns the worker:</p>
          <CodePre>{`start('worker', 'node', ['dist/worker.mjs'])`}</CodePre>

          <p>The launcher pipes stdout/stderr. If the worker exits non-zero, the launcher kills the web process too (forces App Service to restart the whole container, picking up any in-flight bugs). If the worker exits cleanly on SIGTERM, the launcher proceeds normally.</p>
        </section>

        <hr />

        {/* SECTION 4 — DEFINING TASKS */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Defining Tasks</h2>
          <p>A task is just an async function with a specific signature. PulseWire colocates each task in its own file under <code>src/worker/tasks/</code> for clarity; the worker registry imports them.</p>

          <h3>The Task type</h3>
          <CodePre>{`import type { Task } from 'graphile-worker'

const myTask: Task = async (payload, helpers) => {
  // payload: whatever was passed to addJob() — typed as 'unknown' by default
  // helpers: { logger, addJob, withPgClient, query, abortSignal, ... }
}`}</CodePre>

          <h3>A complete task — fetch_feed</h3>
          <CodePre>{`// PulseWire/src/worker/tasks/fetch-feed.ts — verbatim
import type { Task } from 'graphile-worker'
import { fetchFeed } from '@/lib/feeds/fetch'

type Payload = { feedId: string }

function isPayload(x: unknown): x is Payload {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as Record<string, unknown>).feedId === 'string'
  )
}

export const fetchFeedTask: Task = async (payload, helpers) => {
  if (!isPayload(payload)) {
    helpers.logger.error('fetch_feed: bad payload')
    return
  }
  const result = await fetchFeed(payload.feedId)
  if (result.error) {
    helpers.logger.warn(
      \`fetch_feed \${payload.feedId} -> error=\${result.error} http=\${result.httpStatus ?? '-'}\`,
    )
    if (result.httpStatus && (result.httpStatus === 429 || result.httpStatus >= 500)) {
      // Throw so graphile-worker retries with backoff.
      throw new Error(\`retryable: \${result.error}\`)
    }
    return
  }
  helpers.logger.info(
    \`fetch_feed \${payload.feedId} -> http=\${result.httpStatus} inserted=\${result.articlesInserted} rejected=\${result.articlesRejected}\${result.notModified ? ' (304)' : ''}\`,
  )

  // Fan-out: enqueue embed_article for each new article. Idempotent via
  // jobKey so re-fired fetches don't double-enqueue.
  for (const articleId of result.insertedIds) {
    await helpers.addJob(
      'embed_article',
      { articleId },
      {
        jobKey: \`embed_article:\${articleId}\`,
        jobKeyMode: 'preserve_run_at',
        maxAttempts: 4,
      },
    )
  }
}`}</CodePre>

          <h3>Anatomy of a task</h3>
          <ol>
            <li><strong>Payload type guard.</strong> <code>isPayload</code> validates the unknown JSON payload at runtime. Without this, a bad payload would throw a cryptic TypeError mid-handler.</li>
            <li><strong>Logging via helpers.logger.</strong> graphile-worker injects a logger that prefixes log lines with the job ID — useful for tracing.</li>
            <li><strong>Business logic.</strong> <code>fetchFeed</code> is a regular function from <code>src/lib/feeds/fetch</code>. The task is mostly orchestration.</li>
            <li><strong>Differentiated error handling.</strong> Non-retryable errors return; retryable errors throw. graphile-worker retries thrown errors with exponential backoff.</li>
            <li><strong>Fan-out.</strong> Successful inserts enqueue downstream tasks via <code>helpers.addJob()</code>.</li>
          </ol>

          <h3>The payload-validation pattern</h3>
          <CodePre>{`type Payload = { articleId: string }

function isPayload(x: unknown): x is Payload {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as Record<string, unknown>).articleId === 'string'
  )
}

export const myTask: Task = async (payload, helpers) => {
  if (!isPayload(payload)) {
    helpers.logger.error('my_task: bad payload')
    return                    // ← log + return; don't retry malformed jobs
  }
  // payload is now typed as Payload
}`}</CodePre>

          <p>Every PulseWire task starts with this exact pattern. Malformed payloads exit immediately — retrying would just re-fail. Real bugs in handlers throw (and retry).</p>

          <h3>An AI task with graceful pause-skip</h3>
          <CodePre>{`// PulseWire/src/worker/tasks/embed-article.ts — verbatim (excerpt)
let vec: number[]
try {
  vec = await embedOne('embed_article', input)
} catch (e) {
  if (e instanceof AiPausedError) {
    helpers.logger.warn(\`embed_article \${articleId} skipped: \${e.message}\`)
    return // don't retry while paused
  }
  throw e // retry on transient errors
}`}</CodePre>

          <p>The discipline: <code>AiPausedError</code> = log + return (skip). Anything else = throw (retry). Same pattern as covered in the Azure AI Foundry guide §8.</p>

          <h3>A pure-DB task — score_article</h3>
          <CodePre>{`// PulseWire/src/worker/tasks/score-article.ts — verbatim
import type { Task } from 'graphile-worker'
import { scoreArticleById } from '@/lib/scoring/persist'

type Payload = { articleId: string }

function isPayload(x: unknown): x is Payload {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as Record<string, unknown>).articleId === 'string'
  )
}

/**
 * Compute + upsert signal score for one article. Pure DB work, no AI.
 * Idempotent. Skips duplicates (signal_scores.article_id has ON DELETE
 * CASCADE, so historical scores die with the article).
 */
export const scoreArticleTask: Task = async (payload, helpers) => {
  if (!isPayload(payload)) {
    helpers.logger.error('score_article: bad payload')
    return
  }
  const r = await scoreArticleById(payload.articleId)
  if (!r) {
    helpers.logger.info(\`score_article \${payload.articleId}: no-op (missing or duplicate)\`)
    return
  }
  helpers.logger.info(\`score_article \${payload.articleId}: signal=\${r.signal} velocity=\${r.velocity}\`)
}`}</CodePre>

          <p>No AI, no fan-out — just compute a score and upsert. The simplest task shape.</p>

          <h3>helpers object reference</h3>
          <table>
            <tbody>
              <tr><th>Helper</th><th>Use</th></tr>
              <tr><td><code>helpers.logger</code></td><td><code>{`.info()`}</code> / <code>{`.warn()`}</code> / <code>{`.error()`}</code> — auto-prefixed with job ID</td></tr>
              <tr><td><code>helpers.addJob(name, payload, opts)</code></td><td>Enqueue a downstream task</td></tr>
              <tr><td><code>helpers.withPgClient(fn)</code></td><td>Run a function with a pg client from the worker's pool (avoid; PulseWire uses its own Drizzle client)</td></tr>
              <tr><td><code>helpers.query(sql, params)</code></td><td>Run a one-off query (rarely needed if you have Drizzle)</td></tr>
              <tr><td><code>helpers.abortSignal</code></td><td>AbortSignal that fires when the worker is shutting down</td></tr>
              <tr><td><code>helpers.job</code></td><td>The job row metadata (id, attempts, max_attempts, run_at, etc.)</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 5 — ADDJOB */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Enqueuing Jobs (<code>addJob</code>)</h2>
          <p>Producers — anything that wants to enqueue work — call <code>addJob()</code>. The web side does this from route handlers; tasks do it from inside handler logic (fan-out).</p>

          <h3>From inside a task</h3>
          <CodePre>{`await helpers.addJob('embed_article', { articleId }, {
  jobKey: \`embed_article:\${articleId}\`,
  jobKeyMode: 'preserve_run_at',
  maxAttempts: 4,
})`}</CodePre>

          <h3>From web routes (Next.js)</h3>
          <CodePre>{`// Pattern — not in current PulseWire but the shape
import { makeWorkerUtils } from 'graphile-worker'
import { env } from '@/env'

let utils: WorkerUtils | null = null
async function workerUtils() {
  if (utils) return utils
  utils = await makeWorkerUtils({ connectionString: env.DATABASE_URL })
  return utils
}

// Inside a Next.js route handler:
export async function POST(req: Request) {
  const utils = await workerUtils()
  await utils.addJob('fetch_feed', { feedId: '...' })
  return NextResponse.json({ ok: true })
}`}</CodePre>

          <p><code>makeWorkerUtils</code> creates a utility object that includes <code>addJob</code> and a Postgres client. Cache it as a singleton (similar to the foundry() client) so you're not opening connections on every request.</p>

          <h3>addJob options</h3>
          <table>
            <tbody>
              <tr><th>Option</th><th>Meaning</th></tr>
              <tr><td><code>jobKey</code></td><td>Unique key for idempotency. Re-adding with the same key updates the existing job rather than creating a duplicate.</td></tr>
              <tr><td><code>jobKeyMode</code></td><td><code>'replace'</code> (default) — re-add overwrites old job's payload. <code>'preserve_run_at'</code> — keep the original run_at if scheduled in the future.</td></tr>
              <tr><td><code>maxAttempts</code></td><td>Max retry attempts. Defaults to 25 — usually too high for fleet apps; PulseWire uses 4.</td></tr>
              <tr><td><code>runAt</code></td><td>Schedule the job for a specific time. Defaults to "now."</td></tr>
              <tr><td><code>priority</code></td><td>Lower number = higher priority. Defaults to 0.</td></tr>
              <tr><td><code>queueName</code></td><td>Named queue with optional serialization (one-at-a-time within a queue). Useful for per-user serialization.</td></tr>
              <tr><td><code>flags</code></td><td>Array of flag names. Used for advanced filtering.</td></tr>
            </tbody>
          </table>

          <h3>The jobKey idempotency pattern</h3>
          <CodePre>{`// First call:
await helpers.addJob('embed_article', { articleId: 'abc' }, {
  jobKey: 'embed_article:abc',
})
// → Creates a new row in graphile_worker.jobs

// Second call (within the same window, before the job runs):
await helpers.addJob('embed_article', { articleId: 'abc' }, {
  jobKey: 'embed_article:abc',
})
// → Updates the existing row's payload (default replace mode)
// → ONE job, not two.`}</CodePre>

          <p>This is critical for fan-out chains. If a feed fetch fires twice (race between scheduler + manual trigger), the second fetch's <code>addJob('embed_article')</code> calls don't double-enqueue every article — they merge with the pending ones.</p>

          <h3>preserve_run_at variant</h3>
          <CodePre>{`// Initial scheduling at noon tomorrow:
await addJob('summarize_demo', payload, {
  jobKey: 'summarize_demo_articles',
  runAt: tomorrowNoon,
})

// Some other code accidentally re-schedules:
await addJob('summarize_demo', payload, {
  jobKey: 'summarize_demo_articles',
  jobKeyMode: 'preserve_run_at',   // ← respects original schedule
})
// → Payload updated, runAt stays at tomorrow noon`}</CodePre>

          <p>Without <code>preserve_run_at</code>, the second call would reset run_at to "now" — the job would fire immediately. PulseWire uses preserve_run_at on tasks scheduled in the future.</p>

          <h3>maxAttempts tuning</h3>
          <p>Defaults to 25. PulseWire uses 4. Reasoning:</p>
          <ul>
            <li>graphile-worker uses exponential backoff: 1s, 2s, 4s, 8s, 16s, ... between attempts.</li>
            <li>25 attempts = 25 retries over many minutes for one transient error.</li>
            <li>If the underlying issue is real (e.g. Foundry rate limit, broken feed), retrying 25 times wastes resources.</li>
            <li>4 attempts = ~10 minutes of retries before giving up. Reasonable for fleet ops.</li>
          </ul>

          <h3>Bulk enqueue — addJobs</h3>
          <CodePre>{`await helpers.addJobs([
  { identifier: 'embed_article', payload: { articleId: 'a' } },
  { identifier: 'embed_article', payload: { articleId: 'b' } },
  { identifier: 'embed_article', payload: { articleId: 'c' } },
])`}</CodePre>

          <p>One DB round-trip instead of N. Useful for bulk fan-out. PulseWire's <code>fetch_feed</code> uses individual addJob calls in a loop — could be optimized to addJobs at scale.</p>
        </section>

        <hr />

        {/* SECTION 6 — FAN-OUT */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Fan-out Chains</h2>
          <p>The pattern: a task does its primary work, then enqueues downstream tasks for the next stage. PulseWire's article pipeline is the canonical example — 4 stages of fan-out.</p>

          <h3>The full PulseWire article pipeline</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  EF[enqueue_due_fetches<br/>cron */5min] --> FF[fetch_feed<br/>per feed]
  FF -->|per new article| EA[embed_article]
  EA -->|per article| CA[cluster_article]
  CA -->|per article| SA[score_article]
  CA -.->|cluster ≥ 3 members| SC[summarize_cluster]
  SA --> END`} />

          <h3>The cron trigger</h3>
          <p>Every 5 minutes, <code>enqueue_due_fetches</code> runs. Its job: find feeds whose fetch-due-time has passed and enqueue a <code>fetch_feed</code> for each:</p>
          <CodePre>{`// PulseWire/src/worker/tasks/enqueue-due-fetches.ts (pattern)
export const enqueueDueFetchesTask: Task = async (_payload, helpers) => {
  const dueFeeds = await db.select({ id: feeds.id })
    .from(feeds)
    .where(lt(feeds.nextFetchAt, new Date()))

  for (const feed of dueFeeds) {
    await helpers.addJob('fetch_feed', { feedId: feed.id }, {
      jobKey: \`fetch_feed:\${feed.id}\`,
      maxAttempts: 3,
    })
  }
  helpers.logger.info(\`enqueue_due_fetches: enqueued \${dueFeeds.length} feeds\`)
}`}</CodePre>

          <h3>fetch_feed fans out to embed_article</h3>
          <p>Each new article that <code>fetchFeed</code> inserted gets queued for embedding:</p>
          <CodePre>{`// PulseWire/src/worker/tasks/fetch-feed.ts (verbatim relevant block)
for (const articleId of result.insertedIds) {
  await helpers.addJob(
    'embed_article',
    { articleId },
    {
      jobKey: \`embed_article:\${articleId}\`,
      jobKeyMode: 'preserve_run_at',
      maxAttempts: 4,
    },
  )
}`}</CodePre>

          <h3>embed_article fans out to cluster_article</h3>
          <CodePre>{`// PulseWire/src/worker/tasks/embed-article.ts (verbatim relevant block)
// Fan-out: cluster_article handles stage-3 dedup + online clustering.
await helpers.addJob(
  'cluster_article',
  { articleId },
  {
    jobKey: \`cluster_article:\${articleId}\`,
    jobKeyMode: 'preserve_run_at',
    maxAttempts: 4,
  },
)`}</CodePre>

          <h3>cluster_article fans out to score_article + maybe summarize_cluster</h3>
          <CodePre>{`// Inside cluster_article (pseudo)
const cluster = await findOrCreateCluster(articleId, embedding)
await helpers.addJob('score_article', { articleId }, {
  jobKey: \`score_article:\${articleId}\`,
})

// When cluster reaches 3 members, summarize it
if (cluster.memberCount >= 3 && !cluster.canonicalSummary) {
  await helpers.addJob('summarize_cluster', { clusterId: cluster.id }, {
    jobKey: \`summarize_cluster:\${cluster.id}\`,
    jobKeyMode: 'preserve_run_at',
    maxAttempts: 3,
  })
}`}</CodePre>

          <h3>Why this shape</h3>
          <ul>
            <li><strong>Each stage is independent.</strong> If embedding fails, scoring isn't blocked for OTHER articles — only this one waits.</li>
            <li><strong>Retries are localized.</strong> A flaky AI call retries just the embed, not the whole pipeline.</li>
            <li><strong>Scale-out is natural.</strong> Adding more worker processes parallelizes each stage independently.</li>
            <li><strong>Idempotency.</strong> Each stage's jobKey lets duplicate fan-outs merge — no work is doubled.</li>
          </ul>

          <h3>The alternative — one giant task</h3>
          <p>You could write <code>fetch_feed</code> to do everything in one task: fetch + embed + cluster + score + summarize. Why not?</p>
          <ul>
            <li>One AI rate-limit error blocks the whole pipeline for that feed.</li>
            <li>Retries restart from the beginning — wasteful.</li>
            <li>Concurrency tuning becomes coarse — you set it per-feed, not per-stage.</li>
            <li>Observability is gnarly — what stage did it fail at? Logs only.</li>
          </ul>

          <p>The 5-stage split keeps each task small, retriable, and observable individually.</p>

          <h3>The "but I want to wait for completion" anti-pattern</h3>
          <p>One temptation: <code>fetch_feed</code> wants to know when all its articles are embedded. Don't do this in graphile-worker — there's no native "wait for child jobs" primitive. Instead:</p>
          <ul>
            <li>Have <code>cluster_article</code> (the final stage) update a counter on the parent.</li>
            <li>OR use a separate "completion check" cron task that runs every minute.</li>
            <li>OR accept that the producer doesn't know about completion (the simplest path; PulseWire's choice).</li>
          </ul>

          <p>If you really need orchestrated workflows, switch to Inngest or Trigger.dev — they're designed for this.</p>
        </section>

        <hr />

        {/* SECTION 7 — CRONTAB */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Crontab + Periodic Schedules</h2>
          <p>graphile-worker's crontab is a built-in scheduler — declare periodic tasks in the same config as the task registry.</p>

          <h3>The PulseWire crontab</h3>
          <CodePre>{`crontab: [
  '*/5 * * * * enqueue_due_fetches',
  '30 4 * * * cost_rollup',
  '30 5 * * * backfill_embeddings',
  '0 6 * * * score_articles_nightly',
  '30 6 * * * gatekeep_borderline',
  '0 7 * * * prune_articles',
  '0 13 * * * summarize_demo_articles',
].join('\\n')`}</CodePre>

          <h3>Cron syntax refresher</h3>
          <CodePre>{`#  ┌───────── minute (0-59)
#  │ ┌─────── hour (0-23)
#  │ │ ┌───── day of month (1-31)
#  │ │ │ ┌─── month (1-12)
#  │ │ │ │ ┌─ day of week (0-7, 0=Sunday)
#  │ │ │ │ │
#  * * * * * task_name

*/5 * * * *    # Every 5 minutes
0  6 * * *     # Daily at 06:00
30 4 * * *     # Daily at 04:30
0  9 * * 1     # Every Monday at 09:00
0  0 1 * *     # First of every month at midnight`}</CodePre>

          <h3>Schedule reading</h3>
          <table>
            <tbody>
              <tr><th>Schedule</th><th>What it does</th><th>UTC time</th></tr>
              <tr><td><code>*/5 * * * * enqueue_due_fetches</code></td><td>Sweep for feeds due to fetch</td><td>Every 5 min</td></tr>
              <tr><td><code>30 4 * * * cost_rollup</code></td><td>Aggregate yesterday's AI costs</td><td>04:30 (00:30 ET)</td></tr>
              <tr><td><code>30 5 * * * backfill_embeddings</code></td><td>Catch articles with missing embeddings</td><td>05:30</td></tr>
              <tr><td><code>0 6 * * * score_articles_nightly</code></td><td>Refresh signal scores (freshness decay)</td><td>06:00</td></tr>
              <tr><td><code>30 6 * * * gatekeep_borderline</code></td><td>Promote borderline-score articles</td><td>06:30</td></tr>
              <tr><td><code>0 7 * * * prune_articles</code></td><td>VACUUM + delete old articles</td><td>07:00</td></tr>
              <tr><td><code>0 13 * * * summarize_demo_articles</code></td><td>Generate summaries for demo articles</td><td>13:00 (09:00 ET)</td></tr>
            </tbody>
          </table>

          <h3>Why this schedule</h3>
          <p>PulseWire stages the nightly chain across ET-quiet hours (00:30-03:00 ET = 04:30-07:00 UTC):</p>
          <ul>
            <li>00:30 ET: ET day just flipped → roll up yesterday's costs.</li>
            <li>01:30 ET: 1 hour later → backfill any embeddings the day missed.</li>
            <li>02:00 ET: Scores need to decay freshness (older articles less important).</li>
            <li>02:30 ET: Gatekeeper re-evaluates borderline articles using fresh scores.</li>
            <li>03:00 ET: Prune + VACUUM — the heaviest task, last.</li>
            <li>09:00 ET: Demo summaries — done before US daytime traffic.</li>
          </ul>

          <p>Each stage builds on the previous (scores need yesterday's data; gatekeeper needs scores). 30-minute gaps give the previous task room to finish.</p>

          <h3>UTC vs local time</h3>
          <p>graphile-worker's crontab is in UTC by default. PulseWire's scheduling treats UTC as the reference; the comments translate to ET for the operator's benefit.</p>

          <p>To use a different timezone, prefix the schedule with a <code>TZ=America/New_York</code> directive (graphile-worker 0.16+):</p>
          <CodePre>{`'TZ=America/New_York 0 0 * * * daily_midnight_task',  // Runs at midnight ET, not UTC`}</CodePre>

          <p>PulseWire stays in UTC for consistency with Postgres + Azure logs.</p>

          <h3>Cron skew + missed runs</h3>
          <p>If the worker is down at scheduled time (deploy, crash), the cron job is MISSED — not deferred. When the worker comes back, the next scheduled time fires. For most tasks this is fine (next 5-minute fetch will catch up). For tasks with hard schedules (daily rollup), the operator might need to manually trigger if a critical run was missed.</p>

          <h3>Tracking that a cron ran</h3>
          <p>graphile-worker maintains <code>graphile_worker.known_crontabs</code> with last-run timestamps. Query it to verify a schedule fired:</p>
          <CodePre>{`SELECT identifier, last_execution FROM graphile_worker.known_crontabs;`}</CodePre>
        </section>

        <hr />

        {/* SECTION 8 — RETRIES + IDEMPOTENCY */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Retries + Idempotency</h2>
          <p>Jobs throw, sometimes. graphile-worker retries with exponential backoff. Your job logic must be idempotent so repeated runs don't double-process.</p>

          <h3>The retry algorithm</h3>
          <p>When a task throws:</p>
          <ol>
            <li>graphile-worker increments the job's <code>attempts</code> counter.</li>
            <li>If <code>attempts &lt; max_attempts</code>: schedule the retry with exponential backoff.</li>
            <li>If <code>attempts &gt;= max_attempts</code>: mark the job permanently failed (it stays in the <code>jobs</code> table with <code>locked_at = NULL</code> + a failure record).</li>
          </ol>

          <h3>The backoff formula</h3>
          <CodePre>{`backoff_seconds = LEAST(86400, exp(LEAST(attempts, 10)))

attempt 1 → ~3 sec
attempt 2 → ~7 sec
attempt 3 → ~20 sec
attempt 4 → ~55 sec
attempt 5 → ~2.5 min
attempt 10 → ~6 hours
beyond → 24 hours cap`}</CodePre>

          <p>The exponential growth means quick retries for transient blips but back-off-ish wait for persistent failures.</p>

          <h3>When to throw vs return</h3>
          <table>
            <tbody>
              <tr><th>Situation</th><th>Action</th></tr>
              <tr><td>Transient error (network, rate limit, timeout)</td><td><code>throw</code> — retry will likely succeed</td></tr>
              <tr><td>Permanent error (bad input, deleted parent row)</td><td><code>return</code> — retrying doesn't fix it</td></tr>
              <tr><td>Cost paused (AiPausedError)</td><td><code>return</code> — try again next month</td></tr>
              <tr><td>Already done (idempotency check found existing result)</td><td><code>return</code> — no work needed</td></tr>
              <tr><td>Bad payload</td><td><code>return</code> (after logging) — payload won't fix itself</td></tr>
            </tbody>
          </table>

          <h3>PulseWire's retry classification</h3>
          <CodePre>{`// fetch_feed retry classifier (verbatim)
if (result.error) {
  if (result.httpStatus && (result.httpStatus === 429 || result.httpStatus >= 500)) {
    throw new Error(\`retryable: \${result.error}\`)   // ← 429 (rate limit) + 5xx (server) → retry
  }
  return                                              // ← 4xx other than 429 → don't retry
}`}</CodePre>

          <p>HTTP 429 (rate limit) and 5xx (server errors) are typically transient. 4xx (client errors) usually aren't — the feed URL is wrong, the resource is gone, etc. Retrying a 404 fifty times is pointless.</p>

          <h3>Idempotency strategies</h3>
          <p>If a task ran successfully but its run was interrupted before the DB committed, graphile-worker retries. Your task MUST be safe to run twice.</p>

          <h4>1. Idempotent UPDATE</h4>
          <CodePre>{`// Always safe to run twice — UPDATE WHERE returns 0 rows the second time
await db.update(articles)
  .set({ embedding: vec })
  .where(and(eq(articles.id, articleId), isNull(articles.embedding)))`}</CodePre>

          <p>The <code>isNull</code> guard means the second run sees the embedding already set and skips. Zero rows affected.</p>

          <h4>2. Check-before-work</h4>
          <CodePre>{`const existing = await db.select({ id: signalScores.id })
  .from(signalScores)
  .where(eq(signalScores.articleId, articleId))
  .limit(1)

if (existing.length > 0) {
  helpers.logger.info('score_article: already scored, skipping')
  return
}
// ... compute + insert ...`}</CodePre>

          <p>Checks before doing the work. Safe but two queries.</p>

          <h4>3. INSERT ... ON CONFLICT</h4>
          <CodePre>{`await db.execute(sql\`
  INSERT INTO signal_scores (article_id, signal, velocity, computed_at)
  VALUES (\${articleId}, \${signal}, \${velocity}, now())
  ON CONFLICT (article_id) DO UPDATE
    SET signal = excluded.signal, velocity = excluded.velocity, computed_at = excluded.computed_at
\`)`}</CodePre>

          <p>Single statement, atomic, idempotent. PulseWire's preferred pattern when supported.</p>

          <h4>4. jobKey for "logical singleton"</h4>
          <CodePre>{`// Two parallel calls with the same jobKey produce ONE job, not two
await helpers.addJob('summarize_cluster', { clusterId }, {
  jobKey: \`summarize_cluster:\${clusterId}\`,
})`}</CodePre>

          <p>Doesn't help WITHIN a task, but prevents enqueueing the same logical job twice in the first place.</p>

          <h3>The "exactly once" myth</h3>
          <p>True exactly-once execution doesn't exist in distributed systems. graphile-worker provides "at-least-once" — your job WILL run, possibly more than once if a crash happens at the wrong moment. Idempotent code turns "at-least-once" into "effectively exactly-once."</p>

          <h3>Permanent failure mode</h3>
          <p>After <code>maxAttempts</code>, the job stays in the table marked failed. Query for stuck jobs:</p>
          <CodePre>{`SELECT id, task_identifier, payload, last_error, attempts, max_attempts
FROM graphile_worker.jobs
WHERE attempts >= max_attempts
ORDER BY created_at DESC;`}</CodePre>

          <p>To retry manually: <code>UPDATE graphile_worker.jobs SET attempts = 0 WHERE id = ...</code>. The worker picks them up on the next poll.</p>
        </section>

        <hr />

        {/* SECTION 9 — ESBUILD */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Bundling with esbuild</h2>
          <p>PulseWire's production worker is a single bundled file: <code>dist/worker.mjs</code>. esbuild compiles every task + its dependencies into one ESM module. Why: simpler container layout, fewer files to copy, faster cold start.</p>

          <h3>The build script</h3>
          <CodePre>{`# PulseWire/package.json — verbatim
"scripts": {
  "worker":       "tsx src/worker/index.ts",
  "worker:build": "esbuild src/worker/index.ts --bundle --platform=node --target=node22 --format=esm --tsconfig=tsconfig.json --outfile=dist/worker.mjs --banner:js=\\"import { createRequire as __cR } from 'node:module'; const require = __cR(import.meta.url);\\"",
}`}</CodePre>

          <h3>The flags decoded</h3>
          <table>
            <tbody>
              <tr><th>Flag</th><th>What it does</th></tr>
              <tr><td><code>--bundle</code></td><td>Inline all imports into one file</td></tr>
              <tr><td><code>--platform=node</code></td><td>Build for Node.js (allows <code>node:*</code> built-ins, doesn't polyfill)</td></tr>
              <tr><td><code>--target=node22</code></td><td>Match the deployment Node version (Node 22 LTS)</td></tr>
              <tr><td><code>--format=esm</code></td><td>Output ES modules (PulseWire is ESM throughout)</td></tr>
              <tr><td><code>--tsconfig</code></td><td>Honor the project's TypeScript config (paths, target)</td></tr>
              <tr><td><code>--outfile</code></td><td>Output path</td></tr>
              <tr><td><code>--banner:js</code></td><td>Inject a header — here, a CJS require shim for libraries that still use it</td></tr>
            </tbody>
          </table>

          <h3>The require shim</h3>
          <CodePre>{`import { createRequire as __cR } from 'node:module'
const require = __cR(import.meta.url)`}</CodePre>

          <p>Some npm packages (older libraries, native modules) use <code>require()</code> internally. ESM doesn't have <code>require</code> natively, so esbuild injects this shim that synthesizes one from <code>import.meta.url</code>. Without it, you'd see "require is not defined" at runtime.</p>

          <h3>What ends up in the bundle</h3>
          <p>Everything reachable from <code>src/worker/index.ts</code>'s import graph:</p>
          <ul>
            <li>All 12 task files + their dependencies (DB client, AI helpers, scoring logic, etc.).</li>
            <li>graphile-worker library code.</li>
            <li>postgres-js driver.</li>
            <li>Drizzle ORM.</li>
            <li>OpenAI SDK.</li>
            <li>jose, sendgrid, all the rest.</li>
          </ul>

          <p>Result: one ~5-10MB JS file containing everything. The runner container only needs Node + this file.</p>

          <h3>What ISN'T in the bundle</h3>
          <ul>
            <li><strong>Native modules</strong> (e.g. <code>bcrypt</code>, <code>better-sqlite3</code>). esbuild can't compile C++; it marks them external. They'd need to be installed via <code>npm install</code> in the runner. PulseWire doesn't use any native deps; this isn't an issue.</li>
            <li><strong>Postgres-js</strong>'s prepared-statement cache, etc. — these are runtime allocations, not bundle content.</li>
            <li><strong>Migrations directory</strong> — pulled in via <code>outputFileTracingIncludes</code> for Next.js, but the worker doesn't run migrations.</li>
          </ul>

          <h3>The two-process Dockerfile shape</h3>
          <CodePre>{`# Dockerfile builder stage
RUN npm run build              # → .next/standalone for Next
RUN npm run worker:build       # → dist/worker.mjs

# Dockerfile runner stage
COPY --from=builder /app/.next/standalone     ./
COPY --from=builder /app/.next/static          ./.next/static
COPY --from=builder /app/public                ./public
COPY --from=builder /app/dist/worker.mjs       ./dist/worker.mjs
COPY scripts/launch-prod.mjs                    ./scripts/launch-prod.mjs

CMD ["node", "scripts/launch-prod.mjs"]`}</CodePre>

          <h3>The launch script wraps both</h3>
          <CodePre>{`// PulseWire/scripts/launch-prod.mjs (verbatim relevant lines)
start('web',    'node', ['server.js'])
start('worker', 'node', ['dist/worker.mjs'])`}</CodePre>

          <p>Two child processes, both Node. The launcher's job is to spawn them, pipe their output, and tie their lifecycles together (die together; see the Next.js App Router guide §8).</p>

          <h3>Why bundled vs unbundled</h3>
          <p>Alternative: ship <code>src/worker/</code> + <code>node_modules/</code> + a <code>tsx</code> binary to compile-on-the-fly. PulseWire used this in dev (<code>npm run worker</code>). Why bundle for production:</p>
          <ul>
            <li><strong>Boot time.</strong> tsx compiles on first import; bundled is pre-compiled. ~500ms savings.</li>
            <li><strong>Container size.</strong> Bundle = 10MB; <code>node_modules</code> = 200MB.</li>
            <li><strong>One file.</strong> Easier to reason about deployment.</li>
            <li><strong>Tree-shaking.</strong> Unused code from libraries is dropped.</li>
          </ul>

          <p>Dev keeps unbundled for hot-reload speed. Prod bundles.</p>
        </section>

        <hr />

        {/* SECTION 10 — OPS */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Operational Concerns</h2>

          <h3>Monitoring</h3>
          <p>No graphile-worker UI in PulseWire. Direct SQL is the observability tool. Useful queries:</p>

          <CodePre>{`-- Pending + failed jobs by task
SELECT task_identifier,
       count(*) as total,
       count(*) FILTER (WHERE attempts >= max_attempts) as failed,
       count(*) FILTER (WHERE locked_at IS NOT NULL) as running
FROM graphile_worker.jobs
GROUP BY task_identifier
ORDER BY total DESC;

-- Recently failed jobs with errors
SELECT id, task_identifier, attempts, last_error, run_at
FROM graphile_worker.jobs
WHERE attempts >= max_attempts
ORDER BY created_at DESC
LIMIT 20;

-- Jobs that should have run but haven't (older than 1 hour)
SELECT task_identifier, count(*)
FROM graphile_worker.jobs
WHERE run_at < now() - interval '1 hour'
  AND locked_at IS NULL
  AND attempts < max_attempts
GROUP BY task_identifier;

-- Job throughput last 24 hours (via the _completed_ logs, if enabled)
-- ... graphile-worker doesn't track this natively; use ai_call_log or similar`}</CodePre>

          <h3>Worker scaling</h3>
          <p>Two ways to scale graphile-worker:</p>
          <ul>
            <li><strong>Vertical (concurrency)</strong>: bump the <code>concurrency: 3</code> setting in worker config. Limited by DB connection pool.</li>
            <li><strong>Horizontal (more processes)</strong>: run multiple worker processes. Each polls; SKIP LOCKED ensures they don't grab the same job.</li>
          </ul>

          <p>PulseWire is single-process. To scale, run a second App Service with just the worker (separate container image, no Next.js bundled).</p>

          <h3>Backpressure</h3>
          <p>If producers enqueue faster than workers can process, the queue grows. Two failure modes:</p>
          <ul>
            <li><strong>Slow but okay.</strong> Queue grows, eventually drains. Acceptable.</li>
            <li><strong>Storage exhaustion.</strong> Queue grows unbounded. Postgres disk fills. Bad.</li>
          </ul>

          <p>Mitigation: add a producer-side throttle (e.g. <code>enqueue_due_fetches</code> stops enqueueing if pending count exceeds 10k). PulseWire doesn't currently need this — fetches are bounded.</p>

          <h3>Deploy considerations</h3>
          <p>App Service restart kills the worker mid-job. The job's <code>locked_at</code> stays set; another worker waiting for the same job would treat it as locked forever. graphile-worker handles this via:</p>
          <ul>
            <li><strong>Lock timeout</strong>: <code>job_expiry</code> (default 4 hours). After this, the row is considered abandoned and gets re-locked.</li>
            <li><strong>Worker shutdown</strong>: graphile-worker's SIGTERM handler unlocks in-flight jobs cleanly before exiting.</li>
          </ul>

          <p>For PulseWire's tasks (most complete in &lt;30s), the deploy-restart pattern works fine. Long-running tasks (multi-minute embeddings) might re-execute after a deploy — idempotency saves us.</p>

          <h3>Cost</h3>
          <p>graphile-worker adds load to your Postgres:</p>
          <ul>
            <li>~one poll query every <code>pollInterval</code> per worker.</li>
            <li>~one INSERT per job.</li>
            <li>~one UPDATE per job (claim).</li>
            <li>~one DELETE per job (completion).</li>
          </ul>

          <p>At 1000 jobs/day, that's 4000 row-touches/day — negligible against PulseWire's article + read state writes. The graphile_worker schema's tables stay small (current pending jobs only; completed jobs are deleted).</p>

          <h3>Cleanup of failed jobs</h3>
          <p>Permanently-failed jobs accumulate. graphile-worker doesn't auto-delete them; that's a deliberate "don't lose evidence" choice. Add a periodic prune:</p>
          <CodePre>{`-- Run weekly
DELETE FROM graphile_worker.jobs
WHERE attempts >= max_attempts
  AND created_at < now() - interval '30 days';`}</CodePre>

          <p>PulseWire doesn't currently prune — at fleet scale, failed-job accumulation isn't a problem yet.</p>

          <h3>When to switch to BullMQ</h3>
          <p>PulseWire would switch IF:</p>
          <ul>
            <li>Throughput hits 5k+ jobs/sec sustained.</li>
            <li>Postgres lock contention becomes a real bottleneck.</li>
            <li>The need for advanced rate limiting per queue.</li>
            <li>You already have Redis for caching.</li>
          </ul>

          <p>For PulseWire's foreseeable scale, graphile-worker is sufficient + correct.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Job Queue from Scratch</h2>
          <p>Stand up graphile-worker against local Postgres + run a few tasks + watch them retry. ~30 minutes.</p>

          <h3>Step 1 — Local Postgres</h3>
          <CodePre>{`docker run --rm -d --name pg-lab \\
  -e POSTGRES_PASSWORD=lab \\
  -e POSTGRES_DB=worker_lab \\
  -p 5432:5432 \\
  postgres:16

# Wait a few seconds for it to start`}</CodePre>

          <h3>Step 2 — Scaffold</h3>
          <CodePre>{`mkdir worker-lab && cd worker-lab
npm init -y
npm pkg set type=module
npm i graphile-worker postgres dotenv`}</CodePre>

          <CodePre>{`# .env
DATABASE_URL=postgres://postgres:lab@localhost:5432/worker_lab`}</CodePre>

          <h3>Step 3 — Define some tasks</h3>
          <CodePre>{`// tasks/hello.js
export const helloTask = async (payload, helpers) => {
  if (!payload || typeof payload.name !== 'string') {
    helpers.logger.error('hello: bad payload')
    return
  }
  helpers.logger.info(\`Hello, \${payload.name}!\`)

  // Fan-out: schedule a follow-up
  await helpers.addJob('goodbye', { name: payload.name }, {
    jobKey: \`goodbye:\${payload.name}\`,
  })
}

// tasks/goodbye.js
export const goodbyeTask = async (payload, helpers) => {
  helpers.logger.info(\`Goodbye, \${payload.name}!\`)
}

// tasks/flaky.js — randomly fails to demonstrate retries
export const flakyTask = async (payload, helpers) => {
  helpers.logger.info(\`flaky task attempt #\${helpers.job.attempts + 1}\`)
  if (Math.random() < 0.7) {
    throw new Error('random failure')
  }
  helpers.logger.info(\`flaky task succeeded after \${helpers.job.attempts + 1} attempts\`)
}

// tasks/heartbeat.js — runs on a schedule
export const heartbeatTask = async (_payload, helpers) => {
  helpers.logger.info(\`heartbeat at \${new Date().toISOString()}\`)
}`}</CodePre>

          <h3>Step 4 — worker.js</h3>
          <CodePre>{`// worker.js
import 'dotenv/config'
import { run } from 'graphile-worker'

import { helloTask } from './tasks/hello.js'
import { goodbyeTask } from './tasks/goodbye.js'
import { flakyTask } from './tasks/flaky.js'
import { heartbeatTask } from './tasks/heartbeat.js'

const runner = await run({
  connectionString: process.env.DATABASE_URL,
  concurrency: 2,
  pollInterval: 2000,
  taskList: {
    hello:     helloTask,
    goodbye:   goodbyeTask,
    flaky:     flakyTask,
    heartbeat: heartbeatTask,
  },
  crontab: [
    '* * * * * heartbeat',     // every minute
  ].join('\\n'),
})

console.log('Worker running. Ctrl+C to stop.')
await runner.promise`}</CodePre>

          <h3>Step 5 — producer.js — enqueue some jobs</h3>
          <CodePre>{`// producer.js
import 'dotenv/config'
import { makeWorkerUtils } from 'graphile-worker'

const utils = await makeWorkerUtils({
  connectionString: process.env.DATABASE_URL,
})

await utils.addJob('hello', { name: 'Alice' })
await utils.addJob('hello', { name: 'Bob' })
await utils.addJob('hello', { name: 'Charlie' })

// Test idempotency — three calls, one job
for (let i = 0; i < 3; i++) {
  await utils.addJob('hello', { name: 'Diana' }, {
    jobKey: 'hello:Diana',
  })
}

// Schedule one for the future
await utils.addJob('goodbye', { name: 'Future Eve' }, {
  runAt: new Date(Date.now() + 30_000),  // 30 seconds from now
})

// Add a flaky one to watch it retry
await utils.addJob('flaky', {}, { maxAttempts: 5 })

console.log('Jobs enqueued. Worker should pick them up.')
await utils.release()`}</CodePre>

          <h3>Step 6 — Run + observe</h3>
          <CodePre>{`# Terminal 1: start the worker
node worker.js

# Terminal 2: enqueue some jobs
node producer.js

# Terminal 3: query the queue
psql postgres://postgres:lab@localhost:5432/worker_lab -c \\
  "SELECT id, task_identifier, attempts, run_at::time FROM graphile_worker.jobs;"`}</CodePre>

          <h3>What you should see</h3>
          <ul>
            <li>Terminal 1: <code>Hello, Alice!</code> → <code>Goodbye, Alice!</code> → repeat for Bob/Charlie/Diana.</li>
            <li>Only ONE Diana run (jobKey idempotency).</li>
            <li>The future-Eve job sits in the queue for 30 seconds, then fires.</li>
            <li>The flaky task: attempt 1 fails → 3-sec wait → attempt 2 → maybe fails → continues until success or 5 attempts exhausted.</li>
            <li>Heartbeats every minute.</li>
            <li>Terminal 3's query shows the queue draining as jobs complete.</li>
          </ul>

          <h3>Step 7 — Watch retries from psql</h3>
          <CodePre>{`-- See the flaky task retry counter
SELECT id, task_identifier, attempts, max_attempts,
       (last_error->>'message') as last_error_msg,
       run_at::time
FROM graphile_worker.jobs
WHERE task_identifier = 'flaky';`}</CodePre>

          <p>Run this query repeatedly. You'll see <code>attempts</code> increment + <code>run_at</code> push back as backoff applies. If all attempts exhaust, the row stays with <code>attempts = max_attempts</code> + the error.</p>

          <h3>Step 8 — Bundle for prod</h3>
          <CodePre>{`npm i -D esbuild

npx esbuild worker.js --bundle --platform=node --target=node22 \\
  --format=esm --outfile=dist/worker.mjs \\
  --banner:js="import { createRequire as __cR } from 'node:module'; const require = __cR(import.meta.url);"

# Run the bundled version
node dist/worker.mjs`}</CodePre>

          <p>Same behavior, one file. The require shim handles any libraries that internally need <code>require()</code>.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated PulseWire's worker pattern at lab scale: worker entry, task registry, crontab,
              idempotent jobKeys, fan-out, retry-on-throw, bundled with esbuild. Substitute the lab tasks for real
              business logic (AI calls, web scraping, etc.) and you've got production-grade async work.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Could not find task 'X' in taskList"</h3>
          <p>You enqueued a job for a task name that isn't in <code>run()</code>'s <code>taskList</code> map. Names are case-sensitive. Check spelling.</p>

          <h3>Jobs stay in the queue but never run</h3>
          <p>Three causes:</p>
          <ol>
            <li><strong>Worker not running.</strong> Check the worker process is up + connected.</li>
            <li><strong>Connection mismatch.</strong> Producer and worker must use the same DATABASE_URL pointing at the same DB.</li>
            <li><strong>locked_at stuck.</strong> A worker died holding the lock; another waits for it to expire. Check <code>locked_at</code> on the row; wait <code>job_expiry</code> (default 4h) or manually UPDATE locked_at = NULL.</li>
          </ol>

          <h3>"Pool client is invalid"</h3>
          <p>Postgres connection died (network blip, server restart). graphile-worker auto-reconnects; the in-flight job will retry. Check Postgres health.</p>

          <h3>Too many connections</h3>
          <p>Worker + web together exceed Postgres's connection limit. Reduce <code>concurrency</code> + the web's pool <code>max</code>. Or upgrade Postgres tier.</p>

          <h3>Cron task never fires</h3>
          <p>Check the <code>crontab</code> string is well-formed. Each line: <code>schedule task_name</code> with single spaces. Newlines separate entries. Check <code>graphile_worker.known_crontabs</code> for last_execution timestamps.</p>

          <h3>Backoff seems too aggressive (or not enough)</h3>
          <p>graphile-worker's backoff is fixed — exponential with a 24h cap. To customize, the only knob is <code>maxAttempts</code>. For sophisticated backoff (e.g. linear, custom delays), you'd need to throw a special error type that graphile-worker doesn't auto-retry, then enqueue a follow-up with custom <code>runAt</code>.</p>

          <h3>Jobs run twice (not idempotent)</h3>
          <p>Either: (a) the task threw after the side effect committed but before graphile-worker marked it complete (rare but possible), (b) two workers somehow grabbed the same job (DB issue). Either way, your task must be idempotent. Always.</p>

          <h3>"Task takes longer than expected"</h3>
          <p>Long-running tasks block one of the concurrency slots. If most jobs take 30s and concurrency is 3, you can only process 6 jobs/min. Either: (a) bump concurrency, (b) break the task into smaller chunks that fan out, (c) move slow work off the queue (e.g. delegate to an external worker).</p>

          <h3>"Bundle is huge"</h3>
          <p>esbuild includes everything imported. Check the bundle's <code>--analyze</code> output:</p>
          <CodePre>{`npx esbuild ... --analyze 2> bundle-analysis.txt`}</CodePre>
          <p>Look for unexpected heavyweight packages. Tree-shake by importing only what you need (e.g. <code>import &#123; eq &#125; from 'drizzle-orm'</code> not <code>import * as drizzle</code>).</p>

          <h3>"My task uses Drizzle but the bundled worker can't find it"</h3>
          <p>The tsconfig's <code>paths</code> alias (<code>@/*</code>) needs to be honored. Pass <code>--tsconfig=tsconfig.json</code> to esbuild + ensure tsconfig includes the worker files.</p>

          <h3>graphile-worker UI not shown</h3>
          <p>Install separately: <code>npm i graphile-worker-ui</code>. Or stay with SQL queries (PulseWire's pick — one less service).</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Install</h3>
          <CodePre>{`npm i graphile-worker postgres`}</CodePre>

          <h3>worker entry skeleton</h3>
          <CodePre>{`import { run } from 'graphile-worker'
import { task1 } from './tasks/task1.js'

const runner = await run({
  connectionString: process.env.DATABASE_URL,
  concurrency: 3,
  pollInterval: 5000,
  taskList: { task1 },
  crontab: [
    '*/5 * * * * task1',
  ].join('\\n'),
})

await runner.promise`}</CodePre>

          <h3>Task definition</h3>
          <CodePre>{`import type { Task } from 'graphile-worker'

type Payload = { id: string }

function isPayload(x: unknown): x is Payload {
  return typeof x === 'object' && x !== null && typeof (x as any).id === 'string'
}

export const myTask: Task = async (payload, helpers) => {
  if (!isPayload(payload)) { helpers.logger.error('bad payload'); return }

  try {
    // ... business logic ...
    await helpers.addJob('next_task', { id: payload.id }, {
      jobKey: \`next_task:\${payload.id}\`,
      maxAttempts: 4,
    })
  } catch (e) {
    if (e instanceof SomeKnownError) {
      helpers.logger.warn(\`skipped: \${e.message}\`)
      return                  // don't retry
    }
    throw e                    // retry transient errors
  }
}`}</CodePre>

          <h3>addJob options</h3>
          <CodePre>{`await helpers.addJob('task_name', { ... payload ... }, {
  jobKey:      'unique-key',                  // idempotency
  jobKeyMode:  'replace' | 'preserve_run_at', // default replace
  maxAttempts: 4,                              // default 25
  runAt:       new Date(Date.now() + 60_000),  // schedule
  priority:    0,                               // lower = higher
})`}</CodePre>

          <h3>esbuild bundle command</h3>
          <CodePre>{`esbuild src/worker/index.ts \\
  --bundle \\
  --platform=node \\
  --target=node22 \\
  --format=esm \\
  --tsconfig=tsconfig.json \\
  --outfile=dist/worker.mjs \\
  --banner:js="import { createRequire as __cR } from 'node:module'; const require = __cR(import.meta.url);"`}</CodePre>

          <h3>Producer (web side)</h3>
          <CodePre>{`import { makeWorkerUtils } from 'graphile-worker'

const utils = await makeWorkerUtils({ connectionString: env.DATABASE_URL })
await utils.addJob('task_name', { payload })`}</CodePre>

          <h3>Crontab syntax</h3>
          <CodePre>{`*/5 * * * * task_name    # every 5 min
0  6 * * * task_name     # daily at 06:00 UTC
30 4 * * * task_name     # daily at 04:30 UTC
0  0 1 * * task_name     # first of month
0  9 * * 1 task_name     # every Monday at 09:00`}</CodePre>

          <h3>Useful queries</h3>
          <CodePre>{`-- Pending jobs by task
SELECT task_identifier, count(*) FROM graphile_worker.jobs GROUP BY 1;

-- Stuck or failed
SELECT * FROM graphile_worker.jobs WHERE attempts >= max_attempts;

-- Reset a failed job to retry
UPDATE graphile_worker.jobs SET attempts = 0 WHERE id = ...;

-- Cron last execution
SELECT * FROM graphile_worker.known_crontabs;`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>Worker entry + crontab</td><td>PulseWire · <code>src/worker/index.ts</code> (full)</td></tr>
              <tr><td>Task definition with payload guard</td><td>PulseWire · <code>src/worker/tasks/fetch-feed.ts</code> (full)</td></tr>
              <tr><td>Fan-out: addJob from task</td><td>PulseWire · <code>src/worker/tasks/fetch-feed.ts</code>, <code>embed-article.ts</code></td></tr>
              <tr><td>AiPausedError graceful skip</td><td>PulseWire · <code>src/worker/tasks/embed-article.ts</code></td></tr>
              <tr><td>Pure-DB task (no AI)</td><td>PulseWire · <code>src/worker/tasks/score-article.ts</code> (full)</td></tr>
              <tr><td>Cron-only task (cost rollup)</td><td>PulseWire · <code>src/worker/tasks/cost-rollup.ts</code></td></tr>
              <tr><td>esbuild bundle command</td><td>PulseWire · <code>package.json</code> (worker:build script)</td></tr>
              <tr><td>Dual-process launcher</td><td>PulseWire · <code>scripts/launch-prod.mjs</code></td></tr>
              <tr><td>jobKey idempotency</td><td>PulseWire · every fetch-feed addJob call</td></tr>
              <tr><td>maxAttempts: 4 convention</td><td>PulseWire · every task's addJob options</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of Phase 2 batch 2 — Tabloom guides next.</p>
        </section>
      </main>
    </div>
  );
}
