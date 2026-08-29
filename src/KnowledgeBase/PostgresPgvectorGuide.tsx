import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Why Postgres in This Fleet',       icon: '🆚' },
  { id: 's3',  num: '3',  title: 'Azure Flexible Server Setup',      icon: '☁️' },
  { id: 's4',  num: '4',  title: 'Drizzle ORM Basics',               icon: '🌧️' },
  { id: 's5',  num: '5',  title: 'pgvector: the vector Column',      icon: '🧭' },
  { id: 's6',  num: '6',  title: 'IVFFlat + HNSW Indexes',           icon: '⚡' },
  { id: 's7',  num: '7',  title: 'Cosine Similarity Queries',        icon: '📐' },
  { id: 's8',  num: '8',  title: 'Full-Text Search (GIN)',           icon: '🔍' },
  { id: 's9',  num: '9',  title: 'Migrations + Schema Authoring',    icon: '🛠️' },
  { id: 's10', num: '10', title: 'Operational Concerns',             icon: '🚦' },
  { id: 's11', num: '★',  title: 'Lab: pgvector from Scratch',       icon: '🛠️' },
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

export default function PostgresPgvectorGuide() {
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
            <span className="sidebar-title">Postgres + pgvector</span>
          </div>
          <div className="sidebar-sub">PulseWire's outlier</div>
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
          <div className="hero-tag">🐘 PostgreSQL · pgvector · Drizzle · 2026</div>
          <h1>PostgreSQL + pgvector<br />(PulseWire deep dive)</h1>
          <p>
            PulseWire is the only fleet app on <strong style={{ color: '#C77AA0' }}>Postgres</strong> — every other app
            runs SQLite. The driver is what makes PulseWire AI-native: <code>pgvector</code> lets the database store
            and search 1536-dimension embeddings; GIN indexes give it full-text search; Drizzle ORM gives it type-safe
            queries. This guide walks every layer with real PulseWire code: the schema, the IVFFlat index, the
            embedding flow, the cosine-similarity nearest-neighbor query, and the FTS pattern.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">1/8</span><span className="hero-stat-label">Apps on Postgres</span></div>
            <div className="hero-stat"><span className="hero-stat-val">1536</span><span className="hero-stat-label">Vector dims</span></div>
            <div className="hero-stat"><span className="hero-stat-val">IVFFlat</span><span className="hero-stat-label">Vector index</span></div>
            <div className="hero-stat"><span className="hero-stat-val">GIN</span><span className="hero-stat-label">FTS index</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Postgres is the most flexible open-source relational database. Out of the box: ACID, MVCC, advanced query
            planner, partial indexes, JSON columns, full-text search. With extensions: vector similarity (pgvector),
            geospatial (PostGIS), time-series (TimescaleDB), and more. PulseWire uses the vanilla Postgres feature set
            + pgvector.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>The Swiss army knife.</strong> SQLite is a perfect pocketknife — one tool, sharp, reliable, fits
            anywhere. Postgres is a Swiss army knife — same blade quality, but with twelve other tools attached. You
            use Postgres when the SQLite knife isn't enough.
          </p>
          <p>
            <strong>The warehouse vs the workshop.</strong> SQLite is your workshop — one person works there. Postgres
            is the warehouse — many workers in parallel, formal forklifts, freight rails, a logistics planner. The
            warehouse costs more to maintain; it's the right call when one workshop can't hold the work.
          </p>
          <p>
            <strong>pgvector is "lookups on an N-D treasure map."</strong> Embeddings turn text into points in a
            high-dimensional space. "Find similar articles" = "find points near this point." pgvector adds the spatial
            indexing so the query doesn't scan every point.
          </p>

          <h3>What PulseWire uses</h3>
          <ul>
            <li><strong>Postgres 16+</strong> on Azure Database for PostgreSQL Flexible Server (centralus)</li>
            <li><strong>pgvector</strong> extension (1536-D embeddings via OpenAI's text-embedding-3-small)</li>
            <li><strong>Drizzle ORM</strong> (0.45) — type-safe queries</li>
            <li><strong>postgres-js</strong> driver (3.4) — connection pooling, prepared statements</li>
            <li><strong>drizzle-kit</strong> (0.31) — schema migrations</li>
            <li><strong>GIN index</strong> on full-text search expression</li>
            <li><strong>IVFFlat index</strong> on vector columns</li>
          </ul>

          <h3>What lives in the database</h3>
          <p>~16 tables, several with vector columns:</p>
          <ul>
            <li><code>users</code>, <code>feeds</code>, <code>subscriptions</code>, <code>read_state</code>, <code>saves</code></li>
            <li><code>articles</code> (with <code>embedding</code> vector column, <code>contentText</code> for FTS)</li>
            <li><code>clusters</code> (with <code>centroid</code> vector — the cluster's average embedding)</li>
            <li><code>article_clusters</code>, <code>signal_scores</code>, <code>summaries</code>, <code>highlights</code></li>
            <li><code>ai_call_log</code>, <code>daily_ai_cost_rollup</code> (cost tracking)</li>
            <li><code>feed_fetch_log</code>, <code>graphile_worker.jobs</code> (operational)</li>
          </ul>

          <h3>The article lifecycle, end-to-end</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  F[fetch_feed task] --> A[INSERT article<br/>contentText, contentHash]
  A --> E[embed_article task]
  E --> EM[UPDATE article<br/>embedding 1536 dim]
  EM --> CL[cluster_article task]
  CL --> Q[Cosine query<br/>against clusters.centroid]
  Q --> AC{Match cluster?}
  AC -->|yes| LINK[INSERT article_clusters]
  AC -->|no| NEW[INSERT clusters new]
  LINK --> SC[score_article task]
  NEW --> SC
  SC --> SS[INSERT signal_scores]`} />
        </section>

        <hr />

        {/* SECTION 2 — WHY POSTGRES */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Why Postgres in This Fleet</h2>
          <p>Seven fleet apps run SQLite. PulseWire chose Postgres specifically — for reasons that don't apply to the others.</p>

          <h3>The four reasons</h3>
          <ol>
            <li><strong>Vector search.</strong> SQLite has no native vector search. pgvector is the most mature solution; alternatives (Pinecone, Weaviate) are services with monthly costs.</li>
            <li><strong>Concurrent writers.</strong> The graphile-worker process AND the Next.js server both write to the DB simultaneously. SQLite serializes writers (one at a time, even in WAL mode); Postgres handles concurrent writers natively.</li>
            <li><strong>Job queue.</strong> PulseWire uses graphile-worker — a Postgres-backed job queue. SQLite isn't a viable host for this kind of workload (no LISTEN/NOTIFY, no advisory locks, no skip-locked).</li>
            <li><strong>Full-text search.</strong> SQLite has FTS5 but PulseWire's pattern (GIN on a function expression covering coalesced columns) is cleaner in Postgres.</li>
          </ol>

          <h3>Side-by-side with the fleet</h3>
          <table>
            <tbody>
              <tr><th></th><th>SQLite (7 fleet apps)</th><th>Postgres (PulseWire)</th></tr>
              <tr><td>Hosting</td><td>File on App Service volume</td><td>Azure Flexible Server (centralus)</td></tr>
              <tr><td>Cost</td><td>$0/month</td><td>~$15/month (B1ms tier)</td></tr>
              <tr><td>Setup complexity</td><td>None — it's a file</td><td>Provision server + firewall + extensions + migrations</td></tr>
              <tr><td>Concurrent writers</td><td>One at a time (WAL helps readers)</td><td>Many in parallel (MVCC)</td></tr>
              <tr><td>Vector search</td><td>None natively</td><td>pgvector extension</td></tr>
              <tr><td>Full-text</td><td>FTS5</td><td>tsvector + GIN</td></tr>
              <tr><td>JSON</td><td>JSON1 (function-based)</td><td>JSONB column type</td></tr>
              <tr><td>Job queue</td><td>Custom code or external (BullMQ + Redis)</td><td>graphile-worker (Postgres-backed)</td></tr>
              <tr><td>Migrations</td><td>Hand-written try/catch ALTER</td><td>Drizzle-kit with versioned files</td></tr>
              <tr><td>Backups</td><td>Online backup API or file copy</td><td>Built-in PITR, automated daily</td></tr>
              <tr><td>Connections</td><td>One (in-process)</td><td>Pool of 5 (PulseWire) up to ~100</td></tr>
            </tbody>
          </table>

          <h3>When SQLite is right for personal apps</h3>
          <ul>
            <li>Single-user or small-household scale.</li>
            <li>No vector search needed.</li>
            <li>Reads dominate; writes are infrequent.</li>
            <li>You want the lowest-maintenance database possible.</li>
          </ul>

          <h3>When Postgres becomes right</h3>
          <ul>
            <li>Vector / semantic search.</li>
            <li>Concurrent writers (job queue, multi-tenant write workloads).</li>
            <li>Geospatial queries (PostGIS).</li>
            <li>Time-series at scale (TimescaleDB).</li>
            <li>Replicas, failover, complex backup policies.</li>
            <li>Schema you expect to evolve significantly over years.</li>
          </ul>

          <p>PulseWire crosses multiple of those thresholds (vector + queue + complex schema). One alone wouldn't justify the move; three together do.</p>

          <h3>What PulseWire still uses SQLite for — nothing</h3>
          <p>One Postgres database, all data. No SQLite at all in the running app. (PulseWire's per-user SQLite-like isolation isn't applicable — Postgres + Row Level Security or per-user-id filter columns cover the same need.)</p>
        </section>

        <hr />

        {/* SECTION 3 — AZURE FLEXIBLE SERVER */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Azure Flexible Server Setup</h2>
          <p>PulseWire runs on <strong>Azure Database for PostgreSQL — Flexible Server</strong>, in centralus. "Flexible" is Microsoft's modern PostgreSQL offering (vs the older "Single Server" which is deprecated).</p>

          <h3>Why Flexible vs Single</h3>
          <table>
            <tbody>
              <tr><th></th><th>Flexible Server</th><th>Single Server (deprecated)</th></tr>
              <tr><td>Postgres version</td><td>15, 16, 17</td><td>11 (frozen)</td></tr>
              <tr><td>Extensions</td><td>pgvector, postgis, timescaledb, ~30 more</td><td>Limited</td></tr>
              <tr><td>Burstable tier</td><td>B1ms ~$15/mo</td><td>Not available</td></tr>
              <tr><td>Backups</td><td>7–35 day PITR built-in</td><td>Built-in but less flexible</td></tr>
              <tr><td>Maintenance</td><td>Self-scheduled or system-managed</td><td>System-managed only</td></tr>
              <tr><td>VNet integration</td><td>Native</td><td>Service endpoint workaround</td></tr>
            </tbody>
          </table>

          <p>Always Flexible for new deployments.</p>

          <h3>The PulseWire provisioning summary</h3>
          <CodePre>{`Server name: psql-pulsewire-prod
Region:      centralus (not eastus — subscription quota issue)
Tier:        Burstable B1ms (1 vCore, 2 GiB RAM)
Storage:     32 GiB SSD (auto-scaling)
Postgres:    16
Backup:      7-day PITR (default), no geo-redundant
Network:     Public access with firewall rules; only Azure services + admin IP
Extensions:  pgvector enabled
TLS:         Required (ssl: "require" in postgres driver)
Cost:        ~$15/mo`}</CodePre>

          <h3>Why centralus vs eastus</h3>
          <p>Most fleet resources live in eastus. PulseWire's Postgres lives in centralus because the Azure subscription had quota issues for Flexible Server in eastus at provisioning time. Cross-region latency from App Service (eastus) → Postgres (centralus) adds ~20-30ms per query — acceptable for PulseWire's workload, but noticeable. Move to eastus eventually.</p>

          <h3>Enabling pgvector</h3>
          <p>Flexible Server's pgvector is allow-list-enabled; turn it on in the portal first, then create in SQL:</p>
          <CodePre>{`# Azure CLI (one-time)
az postgres flexible-server parameter set \\
  --resource-group rg-personal-apps-prod \\
  --server-name psql-pulsewire-prod \\
  --name azure.extensions \\
  --value VECTOR

# Then in SQL (idempotent in migration files)
CREATE EXTENSION IF NOT EXISTS vector;`}</CodePre>

          <p>If you skip the Azure CLI step, the <code>CREATE EXTENSION</code> fails with "permission denied to create extension." This is one of those one-time configuration gotchas.</p>

          <h3>Connecting from App Service</h3>
          <p>PulseWire's <code>DATABASE_URL</code> looks like:</p>
          <CodePre>{`postgres://pulsewire_admin:<password>@psql-pulsewire-prod.postgres.database.azure.com:5432/pulsewire?sslmode=require`}</CodePre>

          <p>Stored in Azure Key Vault (<code>kv-pulsewire-prod</code> → secret <code>DATABASE-URL</code>, note the hyphens — Key Vault doesn't allow underscores). The App Service setting is a Key Vault reference:</p>
          <CodePre>{`DATABASE_URL=@Microsoft.KeyVault(VaultName=kv-pulsewire-prod;SecretName=DATABASE-URL)`}</CodePre>

          <p>App Service resolves the reference at runtime via its managed identity (PulseWire's web app has been granted "Key Vault Secrets User" on the vault).</p>

          <h3>Firewall rules</h3>
          <p>Flexible Server's firewall defaults to "deny all." Two rules to allow:</p>
          <ol>
            <li><strong>Allow Azure services</strong>: a special rule (0.0.0.0 to 0.0.0.0) that lets any Azure-IP service connect. App Service's outbound IPs are not static, so this is the pragmatic choice.</li>
            <li><strong>Allow your admin IP</strong>: your home/office IP for manual psql access (drizzle-kit pushes, debugging).</li>
          </ol>

          <p>For production-grade isolation, switch to VNet-integrated Flexible Server — App Service joins the VNet and the DB is private-IP-only. PulseWire isn't there yet (extra cost; not needed at fleet scale).</p>
        </section>

        <hr />

        {/* SECTION 4 — DRIZZLE */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Drizzle ORM Basics</h2>
          <p>The TypeScript ORM PulseWire uses. Schema defined in TypeScript; queries built with a fluent SQL-like API; full type inference end-to-end.</p>

          <h3>The three Drizzle packages</h3>
          <table>
            <tbody>
              <tr><th>Package</th><th>Role</th></tr>
              <tr><td><code>drizzle-orm</code></td><td>Runtime: query builder, types, SQL helpers</td></tr>
              <tr><td><code>drizzle-kit</code></td><td>Dev tool: migration generation, schema introspection, studio UI</td></tr>
              <tr><td><code>postgres</code> (postgres-js)</td><td>The actual Postgres driver. Drizzle is database-agnostic; it adapts to postgres-js</td></tr>
            </tbody>
          </table>

          <h3>The drizzle.config.ts</h3>
          <CodePre>{`// PulseWire/drizzle.config.ts — verbatim
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out:    './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
})`}</CodePre>

          <h3>The schema file</h3>
          <p>Tables defined in TypeScript. Drizzle generates migration SQL from diffs against the live schema:</p>
          <CodePre>{`// src/db/schema.ts (pattern)
import { pgTable, uuid, text, timestamp, integer, index } from 'drizzle-orm/pg-core'

export const feeds = pgTable('feeds', {
  id:        uuid('id').primaryKey().defaultRandom(),
  url:       text('url').notNull().unique(),
  title:     text('title'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})`}</CodePre>

          <h3>Type inference</h3>
          <CodePre>{`import { feeds } from '@/db/schema'

type Feed = typeof feeds.$inferSelect       // { id: string; url: string; title: string | null; createdAt: Date }
type NewFeed = typeof feeds.$inferInsert    // { id?: string; url: string; title?: string | null; createdAt?: Date }`}</CodePre>

          <p>Refactor a column name in the schema file → every reader / writer's TypeScript breaks until updated. No schema-vs-code drift possible.</p>

          <h3>The query builder</h3>
          <CodePre>{`import { db } from '@/db/client'
import { feeds } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// SELECT
const all = await db.select().from(feeds)

// SELECT with WHERE
const one = await db.select().from(feeds).where(eq(feeds.url, 'https://example.com/rss'))

// JOIN
const result = await db
  .select({ feedTitle: feeds.title, count: count(articles.id) })
  .from(feeds)
  .leftJoin(articles, eq(articles.feedId, feeds.id))
  .groupBy(feeds.id)

// INSERT
await db.insert(feeds).values({ url: 'https://...' })
await db.insert(feeds).values({ url: 'https://...' }).returning()   // SELECT after INSERT

// UPDATE
await db.update(feeds).set({ title: 'New' }).where(eq(feeds.id, id))

// DELETE
await db.delete(feeds).where(eq(feeds.id, id))`}</CodePre>

          <h3>Raw SQL escape hatch</h3>
          <CodePre>{`import { sql } from 'drizzle-orm'

// Tagged template — params auto-escaped
const rows = await db.execute<{ id: string; score: number }>(sql\`
  SELECT id, score
  FROM articles
  WHERE published_at > now() - interval '24 hours'
  ORDER BY score DESC
  LIMIT 50
\`)

// In a WHERE clause
await db.select().from(articles).where(sql\`length(content_text) > 1000\`)`}</CodePre>

          <p>The <code>sql</code> tag escapes interpolated values. Use it whenever Drizzle's query builder doesn't cover what you need (window functions, CTEs, raw vector operators).</p>

          <h3>The DB client</h3>
          <p>PulseWire's DB client is a lazy Proxy (covered in the Next.js App Router guide §6). Once accessed, it returns a Drizzle instance over postgres-js. Code consuming it doesn't care:</p>
          <CodePre>{`import { db } from '@/db/client'
const feeds = await db.select().from(feeds)`}</CodePre>

          <h3>Why Drizzle instead of Prisma</h3>
          <ul>
            <li><strong>SQL-first.</strong> Drizzle's API feels like SQL; Prisma's feels like a non-SQL ORM.</li>
            <li><strong>No runtime engine.</strong> Prisma ships a Rust query engine; Drizzle is pure TypeScript.</li>
            <li><strong>Smaller bundle.</strong> Drizzle in the Next.js bundle is ~80KB; Prisma is ~5MB.</li>
            <li><strong>Drizzle-kit's migration model</strong> (versioned SQL files) is simpler than Prisma's schema-driven introspection.</li>
            <li><strong>pgvector support</strong> — both work; Drizzle has cleaner vector column declaration.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 5 — PGVECTOR */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>pgvector: the <code>vector</code> Column Type</h2>
          <p>The extension that makes Postgres an AI-native database. Adds a <code>vector</code> column type with similarity operators and supporting indexes.</p>

          <h3>What an embedding IS</h3>
          <p>
            An embedding is a fixed-length array of floats (e.g. 1536 numbers) produced by an AI model from input text.
            Two texts with similar meaning produce vectors that are CLOSE in 1536-D space; two unrelated texts produce
            vectors that are FAR. "Find articles like this one" = "find vectors near this vector."
          </p>

          <h3>Why 1536 dimensions?</h3>
          <p>OpenAI's <code>text-embedding-3-small</code> (PulseWire's choice) outputs 1536 floats per input. Other models pick other dimensions:</p>
          <table>
            <tbody>
              <tr><th>Model</th><th>Dims</th><th>Used by</th></tr>
              <tr><td>text-embedding-3-small</td><td>1536</td><td>PulseWire</td></tr>
              <tr><td>text-embedding-3-large</td><td>3072</td><td>Higher quality, 2× cost</td></tr>
              <tr><td>text-embedding-ada-002</td><td>1536</td><td>Older, similar to 3-small</td></tr>
              <tr><td>Voyage AI voyage-3</td><td>1024</td><td>Tabloom</td></tr>
              <tr><td>Cohere embed-v3</td><td>1024</td><td>Alternative provider</td></tr>
            </tbody>
          </table>

          <p>The dimension is fixed by the model — you can't ask for 768-D output from a 1536-D model. Your database column dimension must match.</p>

          <h3>Drizzle's vector column</h3>
          <CodePre>{`// PulseWire/src/db/schema.ts — verbatim (articles excerpt)
import { vector, pgTable, uuid, text, timestamp, integer, index, uniqueIndex } from 'drizzle-orm/pg-core'

export const articles = pgTable(
  'articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    feedId: uuid('feed_id')
      .notNull()
      .references(() => feeds.id, { onDelete: 'cascade' }),
    guid: text('guid'),
    url: text('url').notNull(),
    canonicalUrl: text('canonical_url'),
    title: text('title').notNull(),
    contentHtml: text('content_html'),
    contentText: text('content_text'),
    author: text('author'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
    contentHash: text('content_hash'),
    embedding: vector('embedding', { dimensions: 1536 }),   // ← the magic column
    language: text('language'),
    imageUrl: text('image_url'),
    duplicateOfId: uuid('duplicate_of_id').references(
      (): AnyPgColumn => articles.id,
      { onDelete: 'set null' },
    ),
  },
  (t) => [
    index('articles_feed_published_idx').on(t.feedId, t.publishedAt.desc().nullsLast()),
    index('articles_canonical_url_idx').on(t.canonicalUrl),
    uniqueIndex('articles_feed_guid_unique').on(t.feedId, t.guid)
      .where(sql\`\${t.guid} is not null\`),
  ],
)`}</CodePre>

          <h3>The clusters table — centroids</h3>
          <CodePre>{`// PulseWire/src/db/schema.ts (clusters table)
export const clusters = pgTable(
  'clusters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    canonicalTitle: text('canonical_title'),
    canonicalSummary: text('canonical_summary'),
    firstSeenAt: timestamp('first_seen_at', { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt:  timestamp('last_seen_at',  { withTimezone: true }).notNull().defaultNow(),
    centroid:    vector('centroid', { dimensions: 1536 }),    // ← cluster's average embedding
    memberCount: integer('member_count').notNull().default(0),
    velocityScore: numeric('velocity_score', { precision: 8, scale: 4 }),
    status: clusterStatus('status').notNull().default('active'),
  },
)`}</CodePre>

          <p>Each cluster has a centroid — the average of its member articles' embeddings. New articles search the centroids; close-enough matches join an existing cluster, far-enough articles form a new one.</p>

          <h3>The three distance functions</h3>
          <table>
            <tbody>
              <tr><th>Operator</th><th>Distance</th><th>Use</th></tr>
              <tr><td><code>&lt;-&gt;</code></td><td>Euclidean (L2)</td><td>"Straight-line distance"</td></tr>
              <tr><td><code>&lt;#&gt;</code></td><td>Negative inner product</td><td>For normalized vectors</td></tr>
              <tr><td><code>&lt;=&gt;</code></td><td>Cosine distance</td><td><strong>PulseWire's default</strong> — most common for embeddings</td></tr>
            </tbody>
          </table>

          <p>For OpenAI's normalized embeddings, all three rank-equivalent results similarly. PulseWire picks <code>&lt;=&gt;</code> (cosine) because it's the conventional choice in the embedding literature.</p>
        </section>

        <hr />

        {/* SECTION 6 — INDEXES */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>IVFFlat + HNSW Indexes</h2>
          <p>
            Without a vector index, each similarity query reads every row (sequential scan). With 100k+ rows that's
            seconds per query. pgvector ships two index types — IVFFlat and HNSW — that make vector search sub-100ms
            at scale.
          </p>

          <h3>The two index types</h3>
          <table>
            <tbody>
              <tr><th></th><th>IVFFlat</th><th>HNSW</th></tr>
              <tr><td>Build time</td><td>Fast</td><td>Slow (10-100× IVFFlat)</td></tr>
              <tr><td>Query time</td><td>Fast</td><td>Faster</td></tr>
              <tr><td>Memory</td><td>Small</td><td>Larger</td></tr>
              <tr><td>Update cost</td><td>Cheap (per-INSERT)</td><td>Expensive</td></tr>
              <tr><td>Recall</td><td>Tunable via <code>probes</code></td><td>Higher default, tunable via <code>ef_search</code></td></tr>
              <tr><td>When optimal</td><td>10k-1M rows, frequent updates</td><td>&gt;1M rows, read-heavy</td></tr>
              <tr><td>PulseWire's pick</td><td>✓ (fleet-scale fits)</td><td>—</td></tr>
            </tbody>
          </table>

          <h3>PulseWire's index creation</h3>
          <CodePre>{`-- PulseWire/drizzle/0004_vector_index.sql — verbatim
-- Phase 2 chunk C: pgvector IVFFlat index for embedding cosine search.
--
-- IVFFlat sizing rule of thumb: lists = rows / 1000 for <1M rows, sqrt(rows)
-- otherwise. lists=100 is sized for medium scale (~100k-1M articles).
-- Pre-data this is over-provisioned; centroids will rebalance after the
-- first REINDEX once we have >10k rows.
--
-- Queries that filter to a small set (e.g., last 48h via fetched_at) will
-- still seq-scan; the index helps when we ask for "any similar article in
-- the corpus". Phase 2 chunk D uses it for online clustering against the
-- last 72h of articles + active clusters.
--
-- pgvector requires the extension to be present. We installed it on Day 4
-- via azure-infra; no-op if already present.
CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX IF NOT EXISTS "articles_embedding_idx"
  ON "articles" USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);`}</CodePre>

          <h3>The three operator classes</h3>
          <p>The index targets one specific distance function via its "operator class":</p>
          <table>
            <tbody>
              <tr><th>Operator class</th><th>For operator</th></tr>
              <tr><td><code>vector_l2_ops</code></td><td><code>&lt;-&gt;</code> (Euclidean)</td></tr>
              <tr><td><code>vector_ip_ops</code></td><td><code>&lt;#&gt;</code> (inner product)</td></tr>
              <tr><td><code>vector_cosine_ops</code></td><td><code>&lt;=&gt;</code> (cosine) — PulseWire's pick</td></tr>
            </tbody>
          </table>

          <p>An index supports only its operator class. You'd create separate indexes if you query by multiple distance functions.</p>

          <h3>Tuning IVFFlat <code>lists</code></h3>
          <p>The <code>lists</code> parameter splits vectors into clusters at index build time. Query time, only the closest <code>probes</code> clusters are searched.</p>
          <ul>
            <li><strong>Too few lists</strong>: each list is huge; query scans most of them → slow.</li>
            <li><strong>Too many lists</strong>: each is tiny; centroids dominate the search → also slow + low recall.</li>
            <li><strong>Rule of thumb</strong>: <code>lists = rows / 1000</code> for &lt; 1M rows, <code>lists = sqrt(rows)</code> beyond.</li>
            <li><strong>PulseWire's 100 lists</strong>: sized for ~100k-1M articles. Over-provisioned at small scale; correct after growth.</li>
          </ul>

          <h3>Tuning query-time <code>probes</code></h3>
          <CodePre>{`-- Default: 1 (fastest, lowest recall)
SET ivfflat.probes = 1;
SELECT ... ORDER BY embedding <=> '[...]' LIMIT 10;

-- Higher recall, more cost
SET ivfflat.probes = 10;`}</CodePre>

          <p>Each probe scans one list. <code>probes = lists</code> is exact search (same as no index — full scan). PulseWire uses default (1) which gives ~85% recall — fine for similar-article suggestions.</p>

          <h3>When to switch to HNSW</h3>
          <p>HNSW (Hierarchical Navigable Small Worlds) is the modern alternative. Faster queries, higher recall, but slow index builds + larger memory:</p>
          <CodePre>{`CREATE INDEX articles_embedding_hnsw_idx
  ON articles USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);`}</CodePre>

          <p>For PulseWire's <code>~10k-100k articles</code> scale, IVFFlat is the right call. HNSW shines past 1M rows where the build-time penalty amortizes.</p>

          <h3>REINDEX strategy</h3>
          <p>IVFFlat centroids are fixed at build time. As you add rows, the cluster assignment can drift — queries get slower because the right neighbors are spread across more lists. Schedule a REINDEX nightly or weekly:</p>
          <CodePre>{`REINDEX INDEX CONCURRENTLY articles_embedding_idx;`}</CodePre>

          <p>The CONCURRENTLY variant doesn't block queries. PulseWire doesn't schedule this yet (corpus is small); add when scan times noticeably degrade.</p>
        </section>

        <hr />

        {/* SECTION 7 — COSINE QUERIES */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Cosine Similarity Queries</h2>
          <p>The whole point of pgvector: ask "what's similar to THIS embedding?" and get the top-K nearest neighbors back. Two patterns: nearest-neighbor lookup + threshold-filtered match.</p>

          <h3>The simplest query — top 10 nearest neighbors</h3>
          <CodePre>{`-- SQL form (use psql or db.execute)
SELECT id, title, embedding <=> '[0.123, 0.456, ...]'::vector AS distance
FROM articles
ORDER BY embedding <=> '[0.123, 0.456, ...]'::vector
LIMIT 10;`}</CodePre>

          <p>The <code>&lt;=&gt;</code> operator returns the cosine distance (0 = identical, 1 = orthogonal, 2 = opposite). Lower = more similar. ORDER BY + LIMIT does the K-nearest lookup.</p>

          <h3>The Drizzle version</h3>
          <CodePre>{`import { sql } from 'drizzle-orm'
import { db } from '@/db/client'
import { articles } from '@/db/schema'

async function findSimilar(targetEmbedding: number[], limit = 10) {
  const result = await db.execute<{ id: string; title: string; distance: number }>(sql\`
    SELECT id, title, embedding <=> \${JSON.stringify(targetEmbedding)}::vector AS distance
    FROM articles
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> \${JSON.stringify(targetEmbedding)}::vector
    LIMIT \${limit}
  \`)
  return result
}`}</CodePre>

          <h3>Threshold-filtered queries</h3>
          <p>Often you want "matches above similarity X" rather than top-K:</p>
          <CodePre>{`-- "Articles within cosine distance 0.3 of this embedding"
-- (cosine distance 0.3 ≈ cosine similarity 0.7)
SELECT id, title
FROM articles
WHERE embedding IS NOT NULL
  AND embedding <=> '[...]'::vector < 0.3
ORDER BY embedding <=> '[...]'::vector
LIMIT 50;`}</CodePre>

          <p>Note: pgvector returns DISTANCE (lower = better). Cosine SIMILARITY = 1 - distance. <code>distance &lt; 0.3</code> means <code>similarity &gt; 0.7</code>.</p>

          <h3>PulseWire's clustering query</h3>
          <p>The cluster_article task: given a new article's embedding, find which active cluster's centroid is closest. If close enough, join. Otherwise, create a new cluster:</p>
          <CodePre>{`// PulseWire's clustering pattern (simplified)
const CLUSTER_DISTANCE_THRESHOLD = 0.15   // cosine distance < 0.15 = same story

async function findClusterFor(articleEmbedding: number[]): Promise<{ id: string; distance: number } | null> {
  const matches = await db.execute<{ id: string; distance: number }>(sql\`
    SELECT id, centroid <=> \${JSON.stringify(articleEmbedding)}::vector AS distance
    FROM clusters
    WHERE status = 'active'
      AND last_seen_at > now() - interval '72 hours'
      AND centroid IS NOT NULL
    ORDER BY centroid <=> \${JSON.stringify(articleEmbedding)}::vector
    LIMIT 1
  \`)
  const best = matches[0]
  if (!best || best.distance > CLUSTER_DISTANCE_THRESHOLD) return null
  return best
}`}</CodePre>

          <p>The <code>status = 'active'</code> + 72-hour window filters means most queries scan a small subset (current-news clusters). The IVFFlat index helps when the filter selects a large fraction; for small filtered sets, Postgres opts for the row-by-row distance calc.</p>

          <h3>Pre-filter vs index</h3>
          <p>The IVFFlat index only helps when the query touches many rows. With a tight WHERE clause (last 24h, specific feed), Postgres seq-scans the filtered set — which is often faster than walking the vector index. EXPLAIN ANALYZE confirms whichever Postgres chose.</p>

          <h3>The vector cast syntax</h3>
          <CodePre>{`-- Casting an array literal to vector
'[0.123, 0.456]'::vector

-- Or with the explicit dimension
'[...]'::vector(1536)

-- From a JSON array string (PulseWire's approach via JSON.stringify)
'[0.123, 0.456]'::vector`}</CodePre>

          <h3>Hybrid search (vector + keyword)</h3>
          <p>Often you want "semantically similar AND mentions 'rate hike'":</p>
          <CodePre>{`SELECT id, title,
       embedding <=> '[...]'::vector AS semantic_distance,
       ts_rank(
         to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, '')),
         to_tsquery('english', 'rate & hike')
       ) AS keyword_score
FROM articles
WHERE embedding IS NOT NULL
  AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, '')) @@ to_tsquery('english', 'rate & hike')
ORDER BY (embedding <=> '[...]'::vector) - (ts_rank(...) * 0.5)
LIMIT 50;`}</CodePre>

          <p>This combines vector distance with FTS rank in a single ORDER BY. The relative weighting (0.5 in the example) is tunable. PulseWire doesn't currently do hybrid search; it's on the roadmap.</p>
        </section>

        <hr />

        {/* SECTION 8 — FULL-TEXT SEARCH */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Full-Text Search (GIN)</h2>
          <p>Postgres ships full-text search as a core feature (no extension needed). <code>tsvector</code> is the search-friendly representation; <code>tsquery</code> is the query format; GIN is the index type that makes both fast.</p>

          <h3>PulseWire's FTS index</h3>
          <CodePre>{`-- PulseWire/drizzle/0005_article_search_index.sql — verbatim
-- Phase 2 follow-up: full-text search index on articles.
--
-- Why expression index vs. stored tsvector column: avoids a schema change
-- and a backfill — we don't need to filter on the tsvector itself, only
-- match against it. ts_rank + ts_headline still work fine against the
-- expression. If we later add weighted columns (e.g., title heavier than
-- body), promote this to a stored column with a trigger.
--
-- Coalesces are required because content_text can be NULL for articles
-- we couldn't extract; we still want the title to match in that case.
CREATE INDEX IF NOT EXISTS "articles_fts_idx"
  ON "articles"
  USING gin (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(content_text, '')
    )
  );`}</CodePre>

          <h3>The expression index pattern</h3>
          <p>Two approaches to FTS:</p>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>Trade-off</th></tr>
              <tr><td>Stored tsvector column</td><td>+ Faster queries (no per-row computation). - Migration overhead, trigger to maintain, storage cost</td></tr>
              <tr><td>Expression index (PulseWire)</td><td>+ Zero schema change, no triggers. - Marginal per-query overhead</td></tr>
            </tbody>
          </table>

          <p>For PulseWire's scale (~100k articles, dozens of FTS queries per minute), the expression index is fine. At 10M+ rows, stored column wins.</p>

          <h3>FTS query syntax</h3>
          <CodePre>{`-- Match articles mentioning "rate hike"
SELECT id, title
FROM articles
WHERE to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, ''))
   @@ to_tsquery('english', 'rate & hike');

-- Phrase search ("interest rate")
... @@ phraseto_tsquery('english', 'interest rate');

-- "Or" search
... @@ to_tsquery('english', 'rate | hike');

-- Stemmed match (matches "running", "ran", "runs")
... @@ to_tsquery('english', 'run');

-- Web-search-style (PulseWire's user input pattern)
... @@ websearch_to_tsquery('english', 'rate hike -inflation');`}</CodePre>

          <h3><code>websearch_to_tsquery</code></h3>
          <p>The friendliest input parser — accepts user-input strings in the format people expect:</p>
          <ul>
            <li><code>rate hike</code> = both words</li>
            <li><code>"interest rate"</code> = phrase</li>
            <li><code>rate OR hike</code> = either</li>
            <li><code>-inflation</code> = exclude</li>
          </ul>

          <p>PulseWire's search input goes through <code>websearch_to_tsquery</code> directly — no need to sanitize/parse client-side.</p>

          <h3>Ranking with ts_rank</h3>
          <CodePre>{`SELECT id, title,
       ts_rank(
         to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, '')),
         websearch_to_tsquery('english', 'rate hike')
       ) AS rank
FROM articles
WHERE to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content_text, ''))
   @@ websearch_to_tsquery('english', 'rate hike')
ORDER BY rank DESC
LIMIT 50;`}</CodePre>

          <p>ts_rank weights matches by frequency + position. ts_rank_cd adds cover-density weighting (multi-word matches close together rank higher).</p>

          <h3>Search snippets — ts_headline</h3>
          <CodePre>{`SELECT id, title,
       ts_headline(
         'english',
         content_text,
         websearch_to_tsquery('english', 'rate hike'),
         'StartSel=<mark>, StopSel=</mark>, MaxFragments=2, MinWords=10, MaxWords=20'
       ) AS snippet
FROM articles
WHERE ...`}</CodePre>

          <p>ts_headline returns the matching portion of the text with the query terms highlighted (default: HTML <code>&lt;b&gt;</code> tags; configurable). Use it to show search-result previews.</p>

          <h3>Weighted FTS (title heavier than body)</h3>
          <p>Promote the FTS to a stored column when you want different weights per source field:</p>
          <CodePre>{`-- Migration: add stored tsvector column with weights
ALTER TABLE articles ADD COLUMN tsv tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content_text, '')), 'B')
  ) STORED;

CREATE INDEX articles_tsv_idx ON articles USING gin(tsv);

-- Queries simplify:
SELECT id, title FROM articles
WHERE tsv @@ websearch_to_tsquery('english', 'rate hike')
ORDER BY ts_rank(tsv, websearch_to_tsquery('english', 'rate hike')) DESC;`}</CodePre>

          <p>The <code>GENERATED ALWAYS AS ... STORED</code> column is auto-maintained — no trigger needed. PulseWire doesn't use this yet; the unweighted expression index is sufficient.</p>
        </section>

        <hr />

        {/* SECTION 9 — MIGRATIONS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Migrations + Schema Authoring</h2>
          <p>drizzle-kit auto-generates SQL migration files from your TypeScript schema. The pattern: edit schema.ts, run <code>npx drizzle-kit generate</code>, review/edit the SQL, commit.</p>

          <h3>The workflow</h3>
          <ol>
            <li>Edit <code>src/db/schema.ts</code> — add a column, table, index.</li>
            <li>Run <code>npx drizzle-kit generate</code> — Drizzle diffs against the previous schema state.</li>
            <li>A new file appears: <code>drizzle/0042_descriptive_name.sql</code>.</li>
            <li>Review + optionally edit. drizzle-kit usually gets it right but vector indexes / triggers / extensions need manual tweaks.</li>
            <li>Commit both the schema change AND the migration file.</li>
            <li>On boot, <code>instrumentation-node.ts</code> calls <code>migrate()</code> which applies any pending files.</li>
          </ol>

          <h3>The PulseWire migration directory</h3>
          <CodePre>{`drizzle/
├── 0000_initial_schema.sql
├── 0001_add_subscriptions.sql
├── 0002_feed_fetch_log.sql
├── 0003_articles.sql
├── 0004_vector_index.sql              # ← CREATE EXTENSION + ivfflat (manual edits)
├── 0005_article_search_index.sql      # ← GIN expression index (manual)
├── 0006_clusters.sql
└── meta/
    └── _journal.json                  # ← tracks which migrations have been applied`}</CodePre>

          <h3>What drizzle-kit can NOT auto-generate</h3>
          <ul>
            <li><strong>CREATE EXTENSION</strong> statements. Add manually to the relevant migration file.</li>
            <li><strong>Vector indexes</strong> (ivfflat / hnsw). drizzle-kit doesn't recognize these yet.</li>
            <li><strong>Triggers</strong>. Add manually.</li>
            <li><strong>Functions / procedures / materialized views</strong>. Manual.</li>
            <li><strong>Custom constraint check expressions</strong>. Manual.</li>
            <li><strong>Data backfills</strong>. drizzle-kit emits schema changes only; if you renamed a column, the new column starts empty and you write a separate migration to copy data.</li>
          </ul>

          <p>When drizzle-kit's output isn't enough, you can edit the generated SQL file freely. Drizzle records the file's hash; subsequent runs detect drift.</p>

          <h3>Running migrations at boot</h3>
          <CodePre>{`// PulseWire/src/instrumentation-node.ts (excerpt)
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

export async function runMigrations() {
  if (process.env.PULSEWIRE_SKIP_MIGRATIONS === '1') return
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return

  const migrationsFolder = locateMigrationsFolder()
  const client = postgres(databaseUrl, { max: 1, ssl: 'require' })
  try {
    await migrate(drizzle(client), { migrationsFolder })
  } finally {
    await client.end({ timeout: 5 })
  }
}`}</CodePre>

          <p>The migrator reads <code>drizzle/meta/_journal.json</code> + the migrations folder, applies anything pending in order. Idempotent — already-applied migrations are skipped.</p>

          <h3>Manual migrations during development</h3>
          <CodePre>{`# Generate migration from schema diff
npx drizzle-kit generate

# Push schema directly (no migration file — dev only)
npx drizzle-kit push

# Apply pending migrations to the running DB
npx drizzle-kit migrate

# Drop everything (NUKE — dev only)
# Connect via psql and DROP SCHEMA public CASCADE; CREATE SCHEMA public;`}</CodePre>

          <p>For dev, <code>push</code> is fast (no files generated). For prod, always use <code>generate</code> + commit the file + let boot-time migrator apply it.</p>

          <h3>The PULSEWIRE_SKIP_MIGRATIONS escape hatch</h3>
          <p>Set this env var to <code>1</code> when you need the app to start without running migrations — useful when a migration has a bug and you're rolling forward to fix it. Set, redeploy, debug, unset, redeploy.</p>
        </section>

        <hr />

        {/* SECTION 10 — OPERATIONAL */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Operational Concerns</h2>

          <h3>Connection pooling</h3>
          <CodePre>{`// PulseWire/src/db/client.ts (excerpt)
const client = postgres(url, { max: 5, idle_timeout: 30, ssl: 'require' })`}</CodePre>

          <p>Postgres has a hard per-server connection limit (typically ~100 on small tiers). One Node process should not open hundreds of connections. PulseWire's <code>max: 5</code> means at most 5 simultaneous connections from this process; further queries wait.</p>

          <p>With Next.js's dual-process model (web + worker), that's 10 connections total. Comfortable on a B1ms tier (limit: ~50).</p>

          <h3>Idle timeout</h3>
          <p><code>idle_timeout: 30</code> closes connections after 30 seconds of inactivity. Saves the DB's per-connection memory; the cost is that the next query needs a fresh handshake (~10ms).</p>

          <h3>SSL: 'require'</h3>
          <p>Always. Azure Postgres Flexible Server rejects non-SSL connections by default.</p>

          <h3>Vacuum + analyze</h3>
          <p>Postgres has autovacuum on by default. For hot tables (article inserts on every fetch), check that autovacuum is running often enough:</p>
          <CodePre>{`SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;`}</CodePre>

          <p>If <code>n_dead_tup</code> grows unboundedly without autovacuum firing, tune <code>autovacuum_vacuum_scale_factor</code> for that table.</p>

          <h3>Monitoring</h3>
          <p>Azure Flexible Server's portal includes:</p>
          <ul>
            <li>Active connections + max</li>
            <li>CPU + memory</li>
            <li>Storage used + IOPS</li>
            <li>Query Store (slow query identification)</li>
            <li>Backup status</li>
          </ul>

          <p>For deeper observability, <code>pg_stat_statements</code> extension tracks query frequency + duration. Useful when you start seeing odd p95s.</p>

          <h3>Backups + PITR</h3>
          <p>Azure Flexible Server includes:</p>
          <ul>
            <li>Automated daily backups (retained 7-35 days based on tier).</li>
            <li>Point-in-time restore — recover the DB to any second in the retention window.</li>
            <li>Geo-redundant option (extra cost).</li>
          </ul>

          <p>PulseWire uses 7-day PITR with no geo-redundancy. For a personal app, sufficient. For production-critical data, bump retention + enable geo-redundancy.</p>

          <h3>Replicas</h3>
          <p>Flexible Server supports read replicas. PulseWire doesn't need them (single user; write volume is low). When the worker's clustering queries start contending with the web's read traffic, add a replica + route the worker's reads to it.</p>

          <h3>The recurring "Postgres killed my Node process" gotcha</h3>
          <p>If your <code>max: 5</code> connection pool gets fully utilized + queries are long-running, the next query waits forever. With a worker doing lots of parallel embedding inserts, you can exhaust the pool. Either: bump <code>max</code>, or serialize the worker's writes.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — pgvector from Scratch</h2>
          <p>Stand up local Postgres, install pgvector, create a vector column, populate it, query it. ~30 minutes.</p>

          <h3>Step 1 — Local Postgres + pgvector</h3>
          <CodePre>{`# Docker compose for local dev
cat > docker-compose.yml << 'EOF'
services:
  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_PASSWORD: lab
      POSTGRES_DB: pgvector_lab
    ports: ['5432:5432']
    volumes: ['pgdata:/var/lib/postgresql/data']

volumes:
  pgdata:
EOF

docker compose up -d`}</CodePre>

          <h3>Step 2 — Connect + enable</h3>
          <CodePre>{`psql postgres://postgres:lab@localhost:5432/pgvector_lab

-- Inside psql:
CREATE EXTENSION IF NOT EXISTS vector;
\\dx                              -- confirm 'vector' is listed`}</CodePre>

          <h3>Step 3 — Schema with a vector column</h3>
          <CodePre>{`CREATE TABLE documents (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  embedding   vector(384),     -- 384-D for the lab; matches all-MiniLM-L6-v2
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX documents_embedding_idx
  ON documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);

CREATE INDEX documents_fts_idx
  ON documents USING gin (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
  );`}</CodePre>

          <h3>Step 4 — Generate embeddings (Node script)</h3>
          <CodePre>{`# In a fresh directory
npm init -y
npm pkg set type=module
npm i postgres @xenova/transformers

cat > embed.js << 'EOF'
import postgres from 'postgres'
import { pipeline } from '@xenova/transformers'

const sql = postgres('postgres://postgres:lab@localhost:5432/pgvector_lab')

console.log('loading model...')
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

const documents = [
  { title: 'Coffee brewing', content: 'Pour-over methods extract clean, bright flavors from light-roasted beans.' },
  { title: 'Espresso theory', content: 'Pulling shots requires consistent dose, grind, and pressure for repeatable extraction.' },
  { title: 'Cake baking', content: 'Creaming butter and sugar until light traps air for a fluffy crumb.' },
  { title: 'Bread sourdough', content: 'A starter of flour and water cultivates wild yeast over days of feedings.' },
  { title: 'Tea ceremony', content: 'Matcha is whisked with hot water in a chawan using a bamboo chasen.' },
  { title: 'Wine fermentation', content: 'Yeast converts sugar to alcohol; temperature controls aroma development.' },
]

for (const doc of documents) {
  const text = \`\${doc.title}\\n\${doc.content}\`
  const result = await embedder(text, { pooling: 'mean', normalize: true })
  const vec = Array.from(result.data)   // 384 floats
  await sql\`INSERT INTO documents (title, content, embedding)
            VALUES (\${doc.title}, \${doc.content}, \${JSON.stringify(vec)}::vector)\`
  console.log(\`inserted: \${doc.title}\`)
}

await sql.end()
EOF

node embed.js`}</CodePre>

          <h3>Step 5 — Query similar documents</h3>
          <CodePre>{`cat > query.js << 'EOF'
import postgres from 'postgres'
import { pipeline } from '@xenova/transformers'

const sql = postgres('postgres://postgres:lab@localhost:5432/pgvector_lab')
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

const query = process.argv[2] ?? 'how to make pour-over coffee'
console.log(\`\\nquery: "\${query}"\\n\`)

const result = await embedder(query, { pooling: 'mean', normalize: true })
const vec = Array.from(result.data)

const rows = await sql\`
  SELECT id, title, embedding <=> \${JSON.stringify(vec)}::vector AS distance
  FROM documents
  ORDER BY embedding <=> \${JSON.stringify(vec)}::vector
  LIMIT 5
\`

for (const row of rows) {
  console.log(\`  \${row.distance.toFixed(4)}  \${row.title}\`)
}

await sql.end()
EOF

node query.js "morning beverage with caffeine"
node query.js "baked dessert recipe"
node query.js "alcoholic drink fermentation"`}</CodePre>

          <p>Expected output:</p>
          <CodePre>{`query: "morning beverage with caffeine"
  0.2841  Coffee brewing
  0.3187  Espresso theory
  0.4192  Tea ceremony
  0.6912  Wine fermentation
  0.7012  Bread sourdough

query: "baked dessert recipe"
  0.2451  Cake baking
  0.4912  Bread sourdough
  0.6182  Coffee brewing
  ...`}</CodePre>

          <p>Semantic matches without keyword overlap. "Caffeine" doesn't appear in any document; pgvector finds Coffee + Espresso + Tea via meaning.</p>

          <h3>Step 6 — Combine with full-text search</h3>
          <CodePre>{`-- Match documents mentioning "yeast" AND closest in meaning to "fermentation"
SELECT id, title,
       embedding <=> '[...]'::vector AS sem_dist,
       ts_rank(
         to_tsvector('english', title || ' ' || content),
         to_tsquery('english', 'yeast')
       ) AS fts_score
FROM documents
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', 'yeast')
ORDER BY embedding <=> '[...]'::vector
LIMIT 5;`}</CodePre>

          <h3>Step 7 — EXPLAIN ANALYZE</h3>
          <CodePre>{`EXPLAIN ANALYZE
SELECT id, title FROM documents
ORDER BY embedding <=> '[...]'::vector
LIMIT 5;`}</CodePre>

          <p>You should see <code>Index Scan using documents_embedding_idx</code> in the plan. At 6 rows, Postgres might prefer a Seq Scan (the index overhead isn't worth it). Insert thousands of rows and re-check.</p>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated PulseWire's entire pgvector pattern at lab scale: pgvector extension, vector column,
              IVFFlat index, embedding generation, cosine similarity query, FTS index, and hybrid search. Swap the
              local model for OpenAI embeddings + the dimensions to 1536 and you're at PulseWire's exact shape.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"ERROR: extension 'vector' is not allow-listed"</h3>
          <p>Azure Flexible Server only allows whitelisted extensions. Run the <code>az postgres flexible-server parameter set</code> command from §3.</p>

          <h3>"could not open extension control file 'vector.control'"</h3>
          <p>pgvector isn't installed on the Postgres host. On Docker, use the <code>pgvector/pgvector:pg16</code> image (not vanilla <code>postgres:16</code>).</p>

          <h3>"data type vector has no default operator class for access method 'ivfflat'"</h3>
          <p>You forgot the operator class. Include <code>vector_cosine_ops</code> (or l2_ops / ip_ops): <code>USING ivfflat (embedding vector_cosine_ops)</code>.</p>

          <h3>"Connection timed out" from App Service</h3>
          <p>Three causes: (a) firewall rule missing — add "Allow Azure services", (b) <code>sslmode=require</code> not in connection string, (c) DATABASE_URL points at wrong server.</p>

          <h3>Vector queries are slow despite the index</h3>
          <p>EXPLAIN ANALYZE. If you see Seq Scan, Postgres decided the index wouldn't help for this query (maybe the WHERE filter is too tight). Try removing the filter or raising <code>ivfflat.probes</code>. If you see Index Scan but it's still slow, the table is huge — switch to HNSW.</p>

          <h3>"too many connections" error</h3>
          <p>Your pool's <code>max</code> times all processes exceeds the Postgres limit. Lower <code>max</code>, or upgrade the Postgres tier.</p>

          <h3>Drizzle generates a migration that drops + recreates a column</h3>
          <p>Drizzle sometimes can't infer "this is a rename" vs "this is drop + add." Edit the generated SQL to use <code>ALTER COLUMN ... RENAME TO ...</code> manually before applying. Otherwise you lose data.</p>

          <h3>Vector column inserts fail with "expected 1536 dimensions, got X"</h3>
          <p>The embedding model returned a different dimension than the column expects. Check both — the column declaration AND your embedding call.</p>

          <h3>"deadlock detected" under high concurrency</h3>
          <p>Two transactions waited on each other's locks. Reorder operations to acquire locks in a consistent order (e.g. always update parent rows before children). For PulseWire's worker, this rarely happens because tasks are serial per-article.</p>

          <h3>FTS doesn't find what I expect</h3>
          <p>Stemming + stopword handling. <code>'running'</code> stems to <code>'run'</code>; <code>'and'</code>/<code>'the'</code> are stopwords. To debug:</p>
          <CodePre>{`SELECT to_tsvector('english', 'The quick brown foxes are running');
-- → 'brown':3 'fox':4 'quick':2 'run':6`}</CodePre>

          <h3>"shared memory available" error during REINDEX</h3>
          <p>IVFFlat REINDEX needs more <code>maintenance_work_mem</code> than the default. Bump for the session: <code>SET maintenance_work_mem = '256MB';</code> then REINDEX.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Provisioning</h3>
          <CodePre>{`# Azure CLI
az postgres flexible-server create \\
  --resource-group rg-personal-apps-prod \\
  --name psql-myapp-prod \\
  --location centralus \\
  --tier Burstable \\
  --sku-name Standard_B1ms \\
  --storage-size 32 \\
  --version 16

# Allow pgvector
az postgres flexible-server parameter set \\
  --resource-group rg-personal-apps-prod \\
  --server-name psql-myapp-prod \\
  --name azure.extensions --value VECTOR

# Allow Azure services
az postgres flexible-server firewall-rule create \\
  --resource-group rg-personal-apps-prod \\
  --name psql-myapp-prod \\
  --rule-name allow-azure --start-ip 0.0.0.0 --end-ip 0.0.0.0`}</CodePre>

          <h3>Connection string</h3>
          <CodePre>{`postgres://<user>:<password>@<server>.postgres.database.azure.com:5432/<db>?sslmode=require`}</CodePre>

          <h3>Schema with vector + indexes</h3>
          <CodePre>{`-- SQL form
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE articles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  embedding  vector(1536)
);

CREATE INDEX articles_embedding_idx
  ON articles USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX articles_fts_idx
  ON articles USING gin (
    to_tsvector('english', coalesce(title, ''))
  );`}</CodePre>

          <h3>Cosine NN query</h3>
          <CodePre>{`SELECT id, title, embedding <=> '[...]'::vector AS distance
FROM articles
WHERE embedding IS NOT NULL
ORDER BY embedding <=> '[...]'::vector
LIMIT 10;`}</CodePre>

          <h3>FTS query</h3>
          <CodePre>{`SELECT id, title,
       ts_rank(to_tsvector('english', title), websearch_to_tsquery('english', $1)) AS r
FROM articles
WHERE to_tsvector('english', title) @@ websearch_to_tsquery('english', $1)
ORDER BY r DESC LIMIT 50;`}</CodePre>

          <h3>Drizzle schema (vector)</h3>
          <CodePre>{`import { pgTable, uuid, text, vector, index } from 'drizzle-orm/pg-core'

export const articles = pgTable('articles', {
  id:        uuid('id').primaryKey().defaultRandom(),
  title:     text('title').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
})`}</CodePre>

          <h3>Drizzle vector query</h3>
          <CodePre>{`import { sql } from 'drizzle-orm'

await db.execute<{ id: string; distance: number }>(sql\`
  SELECT id, embedding <=> \${JSON.stringify(vec)}::vector AS distance
  FROM articles
  ORDER BY embedding <=> \${JSON.stringify(vec)}::vector
  LIMIT 10
\`)`}</CodePre>

          <h3>Migration workflow</h3>
          <CodePre>{`# Edit src/db/schema.ts
npx drizzle-kit generate                   # creates new file in drizzle/
# review + edit (manual: extensions, vector indexes, triggers)
git add . && git commit -m "schema: add X"
# Deploy — instrumentation-node.ts applies on boot`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>vector column in Drizzle</td><td>PulseWire · <code>src/db/schema.ts</code> (articles + clusters)</td></tr>
              <tr><td>IVFFlat index migration</td><td>PulseWire · <code>drizzle/0004_vector_index.sql</code></td></tr>
              <tr><td>GIN FTS expression index</td><td>PulseWire · <code>drizzle/0005_article_search_index.sql</code></td></tr>
              <tr><td>Embedding generation + storage</td><td>PulseWire · <code>src/lib/ai/embed.ts</code></td></tr>
              <tr><td>Embed worker task</td><td>PulseWire · <code>src/worker/tasks/embed-article.ts</code></td></tr>
              <tr><td>Boot-time migration runner</td><td>PulseWire · <code>src/instrumentation-node.ts</code></td></tr>
              <tr><td>Drizzle config</td><td>PulseWire · <code>drizzle.config.ts</code> (full)</td></tr>
              <tr><td>Postgres pool</td><td>PulseWire · <code>src/db/client.ts</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: Azure AI Foundry.</p>
        </section>
      </main>
    </div>
  );
}
