import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'Foundry vs Azure OpenAI',          icon: '⚖️' },
  { id: 's3',  num: '3',  title: 'The OpenAI-Compat Endpoint',       icon: '🔌' },
  { id: 's4',  num: '4',  title: 'The foundry() Client',             icon: '🤖' },
  { id: 's5',  num: '5',  title: 'Per-Token Pricing Table',          icon: '💰' },
  { id: 's6',  num: '6',  title: 'The $50 Pause Threshold',          icon: '⏸️' },
  { id: 's7',  num: '7',  title: 'withAiCallLog Wrapper',            icon: '📋' },
  { id: 's8',  num: '8',  title: 'AiPausedError Discipline',         icon: '🛑' },
  { id: 's9',  num: '9',  title: 'Cost Rollup + SendGrid Alerts',    icon: '📧' },
  { id: 's10', num: '10', title: 'Chat + Embeddings — Real Calls',   icon: '📡' },
  { id: 's11', num: '★',  title: 'Lab: Cost-Gated AI Client',        icon: '🛠️' },
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

export default function AzureAiFoundryGuide() {
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
            <span className="sidebar-title">Azure AI Foundry</span>
          </div>
          <div className="sidebar-sub">cost-gated AI calls</div>
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
          <div className="hero-tag">🤖 Azure AI Foundry · OpenAI SDK · 2026</div>
          <h1>Azure AI Foundry<br />Cost-Gated Production AI</h1>
          <p>
            PulseWire is the only fleet app on <strong style={{ color: '#C77AA0' }}>Azure AI Foundry</strong> — Microsoft's
            OpenAI-compatible endpoint hosted in your own Azure tenant. This guide walks PulseWire's complete pattern:
            the OpenAI client pointed at Foundry's URL, the per-token pricing table, the $50 monthly cap with 60-second
            cached pause state, the <code>withAiCallLog</code> wrapper that instruments every call to
            <code>ai_call_log</code>, the <code>AiPausedError</code> discipline that lets workers skip jobs gracefully,
            the daily rollup task, SendGrid alerting, and real chat + embedding call sites.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">$50</span><span className="hero-stat-label">MTD pause</span></div>
            <div className="hero-stat"><span className="hero-stat-val">$40</span><span className="hero-stat-label">Alert threshold</span></div>
            <div className="hero-stat"><span className="hero-stat-val">60s</span><span className="hero-stat-label">Pause cache</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Models (chat + embed)</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Azure AI Foundry is "the OpenAI API, but hosted in your Azure tenant, billed via Azure, and with regional
            data residency." Same API surface (chat completions, embeddings, the whole OpenAI SDK works), different
            endpoint, different billing path.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>OpenAI direct vs Foundry: the franchise vs the corporate store.</strong> OpenAI's
            <code>api.openai.com</code> is the corporate store. Foundry is a franchise in your local mall (Azure
            tenant). Same menu, same recipes, but the receipt comes from your franchise owner and the food is prepared
            in YOUR region.
          </p>
          <p>
            <strong>The cost cap as a circuit breaker.</strong> Every AI call adds to a running total. At $40, an
            alert email fires (warning lamp). At $50, a circuit-breaker trips — subsequent calls throw
            <code>AiPausedError</code>. The breaker resets monthly. Workers catch the error gracefully and skip; users
            see a friendly "AI temporarily unavailable" message.
          </p>
          <p>
            <strong>The observability tax.</strong> Every AI call writes one row to <code>ai_call_log</code> with
            model + tokens + cost. The table grows by ~1k rows/day at PulseWire's scale. A daily rollup compacts it
            into <code>daily_ai_cost_rollup</code>. The original detail rows are kept for ~30 days, then pruned.
          </p>

          <h3>What PulseWire uses Foundry for</h3>
          <table>
            <tbody>
              <tr><th>Model deployment</th><th>Used for</th></tr>
              <tr><td><code>AZURE_AI_CHAT_DEPLOYMENT</code> (gpt-5.4)</td><td>Cluster summarization, signal scoring, gatekeeper analysis</td></tr>
              <tr><td><code>AZURE_AI_EMBED_DEPLOYMENT</code> (text-embedding-3-small)</td><td>Article embedding for vector clustering</td></tr>
            </tbody>
          </table>

          <p>Deployment names are configurable env vars — the underlying model can be swapped (e.g. upgrade gpt-5.4 → gpt-5.5) without code changes.</p>

          <h3>The seven moving parts</h3>
          <ol>
            <li><strong><code>foundry()</code></strong> — OpenAI client factory with PulseWire's baseURL + key</li>
            <li><strong><code>chatComplete()</code></strong> + <strong><code>embedOne()</code></strong> / <strong><code>embedMany()</code></strong> — typed wrappers around the SDK</li>
            <li><strong><code>withAiCallLog()</code></strong> — instruments every call, writes to <code>ai_call_log</code></li>
            <li><strong><code>estimateCostUsd()</code></strong> — converts model + tokens → dollars</li>
            <li><strong><code>getPauseState()</code></strong> — checks MTD spend, returns paused/not (60s cached)</li>
            <li><strong><code>AiPausedError</code></strong> — thrown by chat/embed wrappers when paused</li>
            <li><strong><code>costRollupTask</code></strong> — daily rollup + alert/pause threshold check</li>
          </ol>

          <h3>The full flow per AI call</h3>
          <MermaidDiagram theme="default" chart={`graph TD
  C[Caller: route or task]
  C --> CG[getPauseState 60s cached]
  CG -->|paused| TH[throw AiPausedError]
  CG -->|ok| WL[withAiCallLog wrapper]
  WL --> FC[foundry .chat or .embeddings]
  FC --> AZ[Azure AI Foundry API]
  AZ --> R[Response w/ tokens]
  R --> EC[estimateCostUsd]
  EC --> ILOG[INSERT ai_call_log]
  ILOG --> C
  C -->|on error| EFAIL[INSERT ai_call_log succeeded=false]`} />
        </section>

        <hr />

        {/* SECTION 2 — FOUNDRY VS AZURE OPENAI */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Foundry vs Azure OpenAI vs OpenAI Direct</h2>
          <p>Three ways to call OpenAI-family models. PulseWire picks one (Foundry); Hearth picks another (Azure OpenAI Service); the rest of the fleet calls Anthropic. The distinctions matter.</p>

          <h3>Side-by-side</h3>
          <table>
            <tbody>
              <tr><th></th><th>OpenAI Direct</th><th>Azure OpenAI Service</th><th>Azure AI Foundry</th></tr>
              <tr><td>Endpoint</td><td><code>api.openai.com</code></td><td><code>{`<resource>.openai.azure.com`}</code></td><td><code>{`<resource>.cognitiveservices.azure.com/openai/v1`}</code></td></tr>
              <tr><td>Billing</td><td>OpenAI invoice</td><td>Azure subscription</td><td>Azure subscription</td></tr>
              <tr><td>SDK</td><td>OpenAI SDK (default)</td><td>OpenAI SDK with <code>azure-openai</code> module OR custom</td><td>OpenAI SDK with custom <code>baseURL</code></td></tr>
              <tr><td>API shape</td><td>Standard OpenAI</td><td>OpenAI + Azure overrides (api-version)</td><td>Standard OpenAI (PulseWire's pick)</td></tr>
              <tr><td>Models available</td><td>OpenAI's full catalog</td><td>Subset Microsoft has deployed</td><td>Subset Microsoft has deployed</td></tr>
              <tr><td>Region</td><td>OpenAI-managed</td><td>You pick at provisioning</td><td>You pick at provisioning</td></tr>
              <tr><td>Data residency</td><td>OpenAI's policy</td><td>Your Azure region</td><td>Your Azure region</td></tr>
              <tr><td>Auth</td><td>API key</td><td>API key OR Entra ID managed identity</td><td>API key OR Entra ID managed identity</td></tr>
              <tr><td>Used by fleet</td><td>None directly (Anthropic via API)</td><td>Hearth (gpt-5.4 / gpt-5.4-pro)</td><td>PulseWire</td></tr>
            </tbody>
          </table>

          <h3>Why PulseWire picks Foundry (over Azure OpenAI Service)</h3>
          <ul>
            <li><strong>Standard OpenAI surface.</strong> Foundry's <code>/openai/v1</code> path is bit-for-bit OpenAI-compatible. No <code>api-version</code> query param dance, no Azure-specific wrappers. Drop-in OpenAI SDK works.</li>
            <li><strong>Easier portability.</strong> If PulseWire ever leaves Azure for direct OpenAI, change <code>baseURL</code> + <code>apiKey</code>. Done.</li>
            <li><strong>Unified portal.</strong> Foundry's portal has model deployment + monitoring + content filter in one place. Azure OpenAI Service has the same features split across multiple blades.</li>
            <li><strong>Microsoft's strategic push.</strong> Foundry is the modern surface; new features land there first. Azure OpenAI Service still exists but is increasingly the "classic" path.</li>
          </ul>

          <h3>Why Hearth still uses Azure OpenAI Service</h3>
          <p>Hearth's setup predates Foundry. The Hearth chat assistant works fine on the classic surface; migrating just to migrate isn't worth the risk. New apps should pick Foundry.</p>

          <h3>What "OpenAI-compatible" means in practice</h3>
          <CodePre>{`// Same code works against direct OpenAI, Foundry, and many other "OpenAI-compat" endpoints
// (Together AI, Anyscale, Groq, etc.):

const openai = new OpenAI({
  baseURL: 'https://api.openai.com/v1',        // OpenAI direct
  // OR
  baseURL: 'https://<foundry>.openai/v1',       // Foundry
  // OR
  baseURL: 'https://api.together.ai/v1',        // Together AI
  apiKey:  'sk-...',
})

await openai.chat.completions.create({ model: 'gpt-5.4', messages: [...] })
// Same call works on all three, with the right model name + key.`}</CodePre>

          <h3>What Foundry has that direct OpenAI doesn't</h3>
          <ul>
            <li>Per-Azure-tenant private endpoint option (network-isolated)</li>
            <li>Customer-managed keys for at-rest encryption</li>
            <li>Azure Monitor integration (built-in metrics + alerts)</li>
            <li>Bundled with other Azure AI services (Content Safety, Translator)</li>
            <li>Free-tier credits via Azure subscription benefits</li>
          </ul>

          <h3>What direct OpenAI has that Foundry doesn't (yet)</h3>
          <ul>
            <li>Earliest model releases (Foundry lags by weeks)</li>
            <li>Some specialized models (o1-mini, codex variants) not in Foundry</li>
            <li>Sora / DALL-E availability varies</li>
          </ul>

          <p>Fleet pattern: pick Foundry for production-stable workloads (PulseWire's scoring + clustering); pick direct OpenAI if you need a freshly-released model.</p>
        </section>

        <hr />

        {/* SECTION 3 — ENDPOINT */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>The OpenAI-Compatible Endpoint</h2>
          <p>Foundry serves a standards-compliant OpenAI API at a specific URL pattern. Knowing the exact path matters — there are two paths and only one is OpenAI-shaped.</p>

          <h3>The two Foundry endpoint paths</h3>
          <table>
            <tbody>
              <tr><th>Path</th><th>What it serves</th></tr>
              <tr><td><code>/openai/deployments/{`<name>`}/...</code></td><td><strong>Azure OpenAI Service legacy surface</strong>. URL routes by deployment name, requires <code>api-version</code> query param. NOT what PulseWire uses.</td></tr>
              <tr><td><code>/openai/v1/...</code></td><td><strong>OpenAI-compatible surface</strong>. URL is standard <code>/chat/completions</code>, <code>/embeddings</code>, etc. Deployment name passed as <code>model</code> field in the body. PulseWire's pick.</td></tr>
            </tbody>
          </table>

          <h3>PulseWire's endpoint URL</h3>
          <CodePre>{`# .env (production via Key Vault)
AZURE_AI_ENDPOINT=https://pulsewire-foundry.cognitiveservices.azure.com/openai/v1`}</CodePre>

          <p>Note the <code>/openai/v1</code> suffix — that's what makes it OpenAI-compatible. Without it, you'd be on the legacy surface.</p>

          <h3>The provisioning summary</h3>
          <ol>
            <li>Azure portal → Create resource → "Azure AI Foundry" (or "Azure AI services")</li>
            <li>Pick region (PulseWire: <code>eastus2</code>)</li>
            <li>Pick pricing tier (PulseWire: Standard S0 — pay-per-token, no commitment)</li>
            <li>Once provisioned, open the Foundry portal</li>
            <li>Deployments → Create deployment → pick model (<code>gpt-5.4</code>, <code>text-embedding-3-small</code>)</li>
            <li>Name the deployment (PulseWire uses <code>chat-5</code> and <code>embed-small</code>)</li>
            <li>Pick capacity (TPM — tokens per minute; default 10K is fine for personal-app scale)</li>
            <li>Grab the API key from Keys + Endpoint blade</li>
          </ol>

          <h3>Two env vars per deployment</h3>
          <CodePre>{`AZURE_AI_ENDPOINT=https://pulsewire-foundry.cognitiveservices.azure.com/openai/v1
AZURE_AI_API_KEY=<base64 key from portal>
AZURE_AI_CHAT_DEPLOYMENT=chat-5         # ← name you gave the chat deployment
AZURE_AI_EMBED_DEPLOYMENT=embed-small   # ← name you gave the embedding deployment`}</CodePre>

          <p>The <code>*_DEPLOYMENT</code> env vars decouple "the model to use" from "the name in Azure." Upgrade gpt-5.4 → gpt-5.5 by creating a new deployment + flipping the env var. Zero code change.</p>

          <h3>Why decouple deployment names</h3>
          <p>Models come and go. A breaking model bump (output format changes) might require keeping the old deployment around for an A/B period. The env var indirection makes this easy:</p>
          <CodePre>{`# Phase 1: in production with gpt-5.4
AZURE_AI_CHAT_DEPLOYMENT=chat-5

# Phase 2: deploy gpt-5.5 as 'chat-55' deployment alongside
# Test in dev:
AZURE_AI_CHAT_DEPLOYMENT=chat-55

# Phase 3: flip prod to chat-55
AZURE_AI_CHAT_DEPLOYMENT=chat-55

# Phase 4: delete old deployment after a week of monitoring`}</CodePre>

          <h3>Auth: API key vs Managed Identity</h3>
          <p>Two auth options:</p>
          <ul>
            <li><strong>API key</strong> (PulseWire's current). Stored in Key Vault, fetched via App Service's Key Vault reference. Simple, works.</li>
            <li><strong>Managed Identity</strong>. App Service has an MI; grant it "Cognitive Services User" on the Foundry resource. App Service's MI obtains tokens via IMDS; no key to rotate.</li>
          </ul>

          <p>MI is more secure (no static credential to leak). PulseWire could move; the API key path is simpler for now. The OpenAI SDK supports both via Azure's AzureADTokenProvider.</p>

          <h3>Content safety</h3>
          <p>Foundry includes Azure Content Safety (PII detection, harmful content filtering) bundled in some tiers. PulseWire doesn't currently use it; for a public-facing app, enable it.</p>
        </section>

        <hr />

        {/* SECTION 4 — FOUNDRY CLIENT */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>The <code>foundry()</code> Client</h2>
          <p>PulseWire's wrapper that returns a properly-configured OpenAI client. Lazy + dev-cached so hot-reloads don't churn.</p>

          <h3>The full module</h3>
          <CodePre>{`// PulseWire/src/lib/ai/foundry.ts — verbatim
import OpenAI from 'openai'
import { env } from '@/env'

/**
 * Azure AI Foundry's \`/openai/v1\` endpoint is OpenAI-compatible (NOT the
 * classic Azure OpenAI surface), so we use the standard OpenAI SDK with
 * a custom baseURL. Auth is via Bearer token in the \`apiKey\` field.
 *
 * Calls take the deployment name as \`model\`:
 *
 *   client.chat.completions.create({ model: env.AZURE_AI_CHAT_DEPLOYMENT, ... })
 *   client.embeddings.create({ model: env.AZURE_AI_EMBED_DEPLOYMENT, ... })
 *
 * Don't import this module from route handlers that might be evaluated
 * at build time — it would crash on missing env. The OpenAI client itself
 * is constructed lazily so importing is cheap.
 */

declare global {
  var __openaiFoundry: OpenAI | undefined
}

function build(): OpenAI {
  return new OpenAI({
    baseURL: env.AZURE_AI_ENDPOINT.replace(/\\/$/, ''),
    apiKey:  env.AZURE_AI_API_KEY,
    // Default 60s; AI Foundry can spike to 30+ on first-token under load.
    timeout: 120_000,
  })
}

export function foundry(): OpenAI {
  if (env.NODE_ENV === 'production') return build()
  globalThis.__openaiFoundry ??= build()
  return globalThis.__openaiFoundry
}`}</CodePre>

          <h3>The trailing-slash strip</h3>
          <CodePre>{`baseURL: env.AZURE_AI_ENDPOINT.replace(/\\/$/, '')`}</CodePre>

          <p>If <code>AZURE_AI_ENDPOINT</code> ends with <code>/</code>, the OpenAI SDK would concatenate to produce <code>...//chat/completions</code> — Foundry rejects the double slash. The strip handles either form gracefully.</p>

          <h3>The 120-second timeout</h3>
          <p>OpenAI SDK's default timeout is 60s. PulseWire bumps to 120s because Foundry can spike to 30+ seconds on first-token under load. Tighter timeouts cause spurious failures; longer doesn't hurt because the call would have failed anyway on a real hang.</p>

          <h3>The dev-cached singleton</h3>
          <CodePre>{`declare global {
  var __openaiFoundry: OpenAI | undefined
}

export function foundry(): OpenAI {
  if (env.NODE_ENV === 'production') return build()
  globalThis.__openaiFoundry ??= build()
  return globalThis.__openaiFoundry
}`}</CodePre>

          <p>
            Same pattern as MSAL Node (covered in §3 of the MSAL Node guide) and the Drizzle DB client. Production:
            new instance per <code>build()</code> call (modules load once anyway). Dev: cache in <code>globalThis</code>
            so hot-reload doesn't re-instantiate.
          </p>

          <h3>Usage pattern</h3>
          <CodePre>{`import { foundry } from '@/lib/ai/foundry'
import { env } from '@/env'

const result = await foundry().chat.completions.create({
  model:    env.AZURE_AI_CHAT_DEPLOYMENT,
  messages: [{ role: 'user', content: 'Hello' }],
  max_tokens: 100,
})

const text = result.choices[0]?.message.content`}</CodePre>

          <p>Notice: <code>model</code> is the DEPLOYMENT NAME (e.g. <code>chat-5</code>), not the underlying model name (<code>gpt-5.4</code>). Foundry routes by deployment name and serves the model that deployment was configured with.</p>

          <h3>The SDK works for streaming too</h3>
          <CodePre>{`const stream = await foundry().chat.completions.create({
  model: env.AZURE_AI_CHAT_DEPLOYMENT,
  messages,
  stream: true,
})

for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content
  if (delta) process.stdout.write(delta)
}`}</CodePre>

          <p>Foundry's <code>/openai/v1/chat/completions</code> with <code>stream: true</code> sends SSE deltas the SDK consumes natively. Identical to OpenAI direct.</p>
        </section>

        <hr />

        {/* SECTION 5 — PRICING */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Per-Token Pricing Table</h2>
          <p>PulseWire hardcodes per-token prices for each model. The estimator runs after each call and writes the cost to <code>ai_call_log</code>.</p>

          <h3>The table</h3>
          <CodePre>{`// PulseWire/src/lib/ai/cost.ts — verbatim
/**
 * Per-token pricing in USD. Values are best-effort estimates — Azure billing
 * is the source of truth. Update from the AI Foundry portal periodically.
 *
 * \`gpt-5.4\` pricing isn't published on a public price list — used a
 * conservative estimate that overshoots GPT-4o pricing. If real billing
 * comes in lower, the threshold trips later (harmless). If higher, the
 * threshold trips earlier (also fine).
 */
const MODEL_PRICING: Record<
  string,
  { input: number; output: number }
> = {
  // $/token (per single token, not per 1M)
  'gpt-5.4':                { input: 5e-6,  output: 15e-6 },
  'gpt-5.4-pro':            { input: 15e-6, output: 60e-6 },
  'gpt-4.1':                { input: 2.5e-6, output: 10e-6 },
  'text-embedding-3-small': { input: 0.02e-6, output: 0 },
}

export const ALERT_THRESHOLD_USD = 40
export const PAUSE_THRESHOLD_USD = 50

export function estimateCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const p = MODEL_PRICING[model]
  if (!p) {
    // Unknown model — log a beacon by overestimating so we notice in the dashboard.
    console.warn(\`[cost] no pricing for model='\${model}', defaulting to gpt-5.4 rate\`)
    const fallback = MODEL_PRICING['gpt-5.4']!
    return inputTokens * fallback.input + outputTokens * fallback.output
  }
  return inputTokens * p.input + outputTokens * p.output
}`}</CodePre>

          <h3>Why "per-token" not "per-million"</h3>
          <p>OpenAI's published prices are typically per-million-tokens (e.g. "$5/MTok input"). PulseWire's table stores per-single-token (5e-6 = $0.000005). Reason: arithmetic. <code>inputTokens * 5e-6</code> is just multiplication. Per-million pricing would require: <code>(inputTokens / 1_000_000) * 5</code>, which is the same but with extra steps.</p>

          <h3>Worked example</h3>
          <CodePre>{`# A typical PulseWire summary call:
# - Model: gpt-5.4
# - Input:  1200 tokens (system prompt + article)
# - Output: 200 tokens (summary)

cost = 1200 * 5e-6 + 200 * 15e-6
     = 0.006 + 0.003
     = $0.009 per call

# An embedding call:
# - Model: text-embedding-3-small
# - Input: 500 tokens (article title + first 500 chars of body)
# - Output: 0 (embeddings have no output token cost)

cost = 500 * 0.02e-6 + 0
     = $0.00001 per call`}</CodePre>

          <p>Embeddings are ~3 orders of magnitude cheaper than completions. PulseWire embeds every article (10k+/month); summary calls are reserved for clusters (~50/month).</p>

          <h3>The unknown-model fallback</h3>
          <CodePre>{`if (!p) {
  console.warn(\`[cost] no pricing for model='\${model}', defaulting to gpt-5.4 rate\`)
  const fallback = MODEL_PRICING['gpt-5.4']!
  return inputTokens * fallback.input + outputTokens * fallback.output
}`}</CodePre>

          <p>If the model name isn't in the table (e.g. you deployed a new gpt-5.5 and forgot to update <code>cost.ts</code>), don't crash. Log a beacon, use the most expensive model's pricing as fallback. Effect: the pause threshold fires earlier than reality, which is the safer side of an estimation error.</p>

          <h3>Updating prices</h3>
          <p>Azure publishes prices in the Foundry portal + on the public pricing page. Real billing arrives at month-end. PulseWire's pattern:</p>
          <ol>
            <li>At month-end, compare PulseWire's estimated MTD cost vs Azure's actual.</li>
            <li>If consistently over/under by &gt;10%, update <code>MODEL_PRICING</code>.</li>
            <li>Commit + redeploy.</li>
          </ol>

          <p>Treat the table as a calibration target, not a source of truth. The Azure invoice IS the source of truth.</p>

          <h3>The thresholds</h3>
          <CodePre>{`export const ALERT_THRESHOLD_USD = 40   // email sent
export const PAUSE_THRESHOLD_USD = 50   // hard pause`}</CodePre>

          <p>Two thresholds — early warning + hard stop. The 80% / 100% pattern means the alert gives you 10% of the budget to react (rotate keys, investigate misuse) before the breaker trips.</p>
        </section>

        <hr />

        {/* SECTION 6 — PAUSE STATE */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The $50 Pause Threshold</h2>
          <p>The heart of PulseWire's cost control: a single function that returns "paused or not" with 60-second caching. Every AI call goes through it.</p>

          <h3>The MTD calculation</h3>
          <CodePre>{`// PulseWire/src/lib/ai/cost.ts — verbatim
/**
 * Month-to-date cost in USD, accounting for the current day from
 * ai_call_log (since the rollup is end-of-day) and prior days from
 * the rollup table. America/New_York as the month boundary.
 */
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

          <h3>The CTE structure</h3>
          <p>The query has three parts:</p>
          <ol>
            <li><code>current_month_start</code>: compute the start of the current month in ET.</li>
            <li><code>rolled</code>: sum prior days from <code>daily_ai_cost_rollup</code> (cheap — pre-aggregated).</li>
            <li><code>today</code>: sum today's rows from <code>ai_call_log</code> (also cheap — small).</li>
            <li>Total = rolled + today.</li>
          </ol>

          <p>The rolled table is "everything before today, aggregated." The detail table covers "today only." This means the query stays fast even when <code>ai_call_log</code> has hundreds of thousands of rows — we never scan more than today's worth.</p>

          <h3>The ET timezone</h3>
          <p>Times are in <code>America/New_York</code>. Reasons: (a) PulseWire's owner is ET-based, (b) the daily rollup cron fires at 04:30 UTC = 00:30 ET, which is just past midnight ET. The month boundary calculation matches.</p>

          <h3>The pause state function</h3>
          <CodePre>{`export type PauseState = {
  paused: boolean
  reason?: string
  mtdUsd: number
}

let pauseCache: { value: PauseState; expiresAt: number } | null = null
const PAUSE_CACHE_TTL_MS = 60_000

/**
 * Returns whether AI calls should be made. Cached for 60s so we don't
 * hammer the DB on every embedding call. Cache invalidation happens
 * naturally on TTL — operator can wait, or restart the worker for an
 * immediate refresh.
 */
export async function getPauseState(): Promise<PauseState> {
  const now = Date.now()
  if (pauseCache && pauseCache.expiresAt > now) return pauseCache.value

  const mtd = await getMtdCostUsd()
  const state: PauseState =
    mtd >= PAUSE_THRESHOLD_USD
      ? { paused: true,  reason: \`MTD $\${mtd.toFixed(2)} >= $\${PAUSE_THRESHOLD_USD}\`, mtdUsd: mtd }
      : { paused: false, mtdUsd: mtd }

  pauseCache = { value: state, expiresAt: now + PAUSE_CACHE_TTL_MS }
  return state
}

export function invalidatePauseCache() {
  pauseCache = null
}`}</CodePre>

          <h3>Why a 60-second cache</h3>
          <p>The worker processes hundreds of articles per fetch cycle. Without caching, each embedding call would query the DB for MTD spend. Net effect: hundreds of pointless DB queries per fetch. The 60s cache means roughly 1 query per minute regardless of call volume.</p>

          <p>The cost: pause-state changes don't propagate for up to 60s. When you pause manually (set <code>PULSEWIRE_FORCE_PAUSE</code> env), it can take ~60s before in-flight calls see it. Acceptable for a cost cap.</p>

          <h3>The reset story</h3>
          <p>What "unpauses" PulseWire after $50 was reached:</p>
          <ol>
            <li>Wait for the next month. <code>getMtdCostUsd()</code> uses the new month boundary, sees $0, returns <code>paused: false</code>.</li>
            <li>OR: manually delete recent <code>ai_call_log</code> rows (e.g. you discovered a runaway loop and want to restart).</li>
            <li>Worker restart clears the in-memory cache; the next <code>getPauseState()</code> recomputes from fresh.</li>
          </ol>

          <h3>Manual invalidation</h3>
          <CodePre>{`import { invalidatePauseCache } from '@/lib/ai/cost'

// After programmatically clearing old rows or other tampering
invalidatePauseCache()`}</CodePre>

          <p>PulseWire's <code>cost-rollup</code> task calls this after writing today's rollup — ensures the next query reflects the just-aggregated state.</p>
        </section>

        <hr />

        {/* SECTION 7 — WITHAICALLLOG */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span><code>withAiCallLog</code> Wrapper</h2>
          <p>Every AI call goes through this wrapper. It runs the inner function, captures the result + token counts, computes cost, writes a row to <code>ai_call_log</code>, and re-throws on error (after logging the failure).</p>

          <h3>The full module</h3>
          <CodePre>{`// PulseWire/src/lib/ai/log.ts — verbatim
import { db } from '@/db/client'
import { aiCallLog } from '@/db/schema'
import { estimateCostUsd } from './cost'

export type AiCallMeta = {
  routeOrJob: string
  model: string
}

export type AiCallResult<T> = {
  data: T
  inputTokens: number
  outputTokens: number
}

/**
 * Wraps an AI call with ai_call_log instrumentation. The callee must
 * return its result PLUS the token counts (which OpenAI responses give
 * us under \`usage.prompt_tokens\` / \`usage.completion_tokens\`).
 *
 * Errors are logged with succeeded=false and re-thrown — the caller
 * decides how to handle (retry, surface, etc.).
 */
export async function withAiCallLog<T>(
  meta: AiCallMeta,
  fn: () => Promise<AiCallResult<T>>,
): Promise<T> {
  try {
    const { data, inputTokens, outputTokens } = await fn()
    const estCost = estimateCostUsd(meta.model, inputTokens, outputTokens)
    await db.insert(aiCallLog).values({
      routeOrJob:   meta.routeOrJob,
      model:        meta.model,
      inputTokens,
      outputTokens,
      estCostUsd:   estCost.toFixed(6),
      succeeded:    true,
    })
    return data
  } catch (e) {
    await db
      .insert(aiCallLog)
      .values({
        routeOrJob:   meta.routeOrJob,
        model:        meta.model,
        inputTokens:  0,
        outputTokens: 0,
        estCostUsd:   '0',
        succeeded:    false,
      })
      .catch(() => {})
    throw e
  }
}`}</CodePre>

          <h3>The contract</h3>
          <p>Callers supply two things:</p>
          <ol>
            <li><code>meta</code>: who's calling (<code>routeOrJob</code> string for query/grouping) + the model name (for pricing).</li>
            <li><code>fn</code>: an async function that does the actual AI call and returns the data + the token counts.</li>
          </ol>

          <p>The wrapper does the rest: token → cost calculation, row insertion, error path.</p>

          <h3>Calling it</h3>
          <CodePre>{`return withAiCallLog(
  { routeOrJob: 'embed_article', model: env.AZURE_AI_EMBED_DEPLOYMENT },
  async () => {
    const resp = await foundry().embeddings.create({ model, input })
    const vec  = resp.data[0]?.embedding
    if (!vec) throw new Error('embed: empty response')
    return {
      data:         vec,
      inputTokens:  resp.usage?.prompt_tokens ?? 0,
      outputTokens: 0,
    }
  },
)`}</CodePre>

          <p>The inner function returns <code>{`{ data, inputTokens, outputTokens }`}</code>. The wrapper unwraps <code>data</code> for the caller; the token counts disappear into the log.</p>

          <h3>The ai_call_log schema</h3>
          <CodePre>{`// PulseWire/src/db/schema.ts — verbatim
export const aiCallLog = pgTable(
  'ai_call_log',
  {
    id:           uuid('id').primaryKey().defaultRandom(),
    routeOrJob:   text('route_or_job').notNull(),
    model:        text('model').notNull(),
    inputTokens:  integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    estCostUsd:   numeric('est_cost_usd', { precision: 12, scale: 6 }).notNull().default('0'),
    succeeded:    boolean('succeeded').notNull().default(true),
    createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('ai_call_log_created_at_idx').on(t.createdAt.desc())],
)`}</CodePre>

          <p>The columns:</p>
          <ul>
            <li><code>route_or_job</code>: where the call came from — "embed_article", "cluster_summarize", "score_article", etc. Lets you slice cost by feature.</li>
            <li><code>model</code>: which deployment was used. Lets you compare cost by model.</li>
            <li><code>input_tokens</code> / <code>output_tokens</code>: raw token counts from the API response.</li>
            <li><code>est_cost_usd</code>: cost in USD as numeric(12, 6) — 6 decimal places, fits up to $999,999.999999.</li>
            <li><code>succeeded</code>: false rows show failed calls (timeout, rate limit, etc.).</li>
            <li><code>created_at</code>: timestamp for time-series queries.</li>
          </ul>

          <h3>Index strategy</h3>
          <p>The single index on <code>created_at DESC</code> covers the two main query patterns:</p>
          <ul>
            <li>"What did we spend today?" — descending scan from now.</li>
            <li>"What did we spend this month?" — bounded by month-start, still uses the index.</li>
          </ul>

          <p>Not indexed: <code>route_or_job</code> or <code>model</code>. For "spend by feature" queries, Postgres scans the time-bounded subset and groups in memory. Fast enough at PulseWire's volume (~30k rows/month).</p>

          <h3>The error path</h3>
          <CodePre>{`} catch (e) {
  await db
    .insert(aiCallLog)
    .values({
      /* ... */ succeeded: false,
    })
    .catch(() => {})
  throw e
}`}</CodePre>

          <p>The double-try (outer for the AI call, inner for the log insert) ensures a log-insert failure doesn't mask the original error. The <code>.catch(() =&gt; {`{}`})</code> swallows the secondary failure silently — log-write failures shouldn't propagate. The original error re-throws to the caller, who decides how to handle.</p>
        </section>

        <hr />

        {/* SECTION 8 — AIPAUSEDERROR */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span><code>AiPausedError</code> Discipline</h2>
          <p>The error thrown by chat/embed wrappers when MTD spend has crossed $50. Callers MUST handle it gracefully — usually by skipping the work and not retrying.</p>

          <h3>The error class</h3>
          <CodePre>{`// PulseWire/src/lib/ai/chat.ts — verbatim (excerpt)
export class AiPausedError extends Error {
  constructor(reason: string) {
    super(\`AI calls paused: \${reason}\`)
    this.name = 'AiPausedError'
  }
}`}</CodePre>

          <p>Standard pattern — extend Error, set the name. <code>instanceof AiPausedError</code> works.</p>

          <h3>Where it's thrown</h3>
          <CodePre>{`// PulseWire/src/lib/ai/chat.ts (chatComplete pattern)
export async function chatComplete(routeOrJob: string, opts: ChatOptions) {
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? 'unknown')

  // ... actual call ...
}

// PulseWire/src/lib/ai/embed.ts (embedOne pattern)
export async function embedOne(routeOrJob: string, input: string): Promise<number[]> {
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? 'unknown')

  // ... actual call ...
}`}</CodePre>

          <p>Every AI entry point checks pause first. The throw happens BEFORE any network call to Foundry — cheap and pre-emptive.</p>

          <h3>The graceful-skip pattern</h3>
          <CodePre>{`// PulseWire/src/worker/tasks/embed-article.ts — verbatim relevant block
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

          <p>The worker pattern:</p>
          <ul>
            <li><code>AiPausedError</code> → log + return. Don't retry; the next month-start will resume.</li>
            <li>Any other error → re-throw. graphile-worker handles the retry (up to <code>maxAttempts</code>).</li>
          </ul>

          <p>If the worker treated <code>AiPausedError</code> as a normal error and retried, every retry would re-fire the same pause + immediately fail. The job queue would burn down to zero only to immediately re-fill. The <code>return</code> short-circuits this loop.</p>

          <h3>The fan-out implication</h3>
          <CodePre>{`// embed-article task — relevant lines
if (vec.length !== 1536) {
  helpers.logger.error(\`unexpected dim \${vec.length}\`)
  return
}

await db.update(articles).set({ embedding: vec }).where(eq(articles.id, articleId))

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

          <p>If <code>AiPausedError</code> fires, the article's embedding is NEVER computed, the downstream cluster_article is NEVER enqueued, and the article sits with NULL embedding in the DB. When AI resumes next month, the <code>backfill_embeddings</code> nightly task (covered in the graphile-worker guide) picks up these stragglers and embeds them.</p>

          <h3>The user-facing path</h3>
          <p>Route handlers (e.g. on-demand "summarize this for me" endpoints) can surface <code>AiPausedError</code> to the user with a friendly message:</p>
          <CodePre>{`export async function POST(req: Request) {
  try {
    const summary = await summarizeArticle(articleId)
    return NextResponse.json({ summary })
  } catch (e) {
    if (e instanceof AiPausedError) {
      return NextResponse.json({
        error: 'AI is temporarily unavailable. We have reached our monthly budget. Please try again next month.',
      }, { status: 503 })
    }
    throw e
  }
}`}</CodePre>

          <p>503 (Service Unavailable) is the right HTTP code — "temporarily can't serve, try later."</p>

          <h3>Why the type discipline matters</h3>
          <p>If callers caught <code>Error</code> generically and treated it as transient, they'd retry while paused. The <code>instanceof AiPausedError</code> distinguishes "skip this gracefully" from "retry with backoff." The type itself encodes operational policy.</p>
        </section>

        <hr />

        {/* SECTION 9 — ROLLUP + EMAIL */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Cost Rollup + SendGrid Alerts</h2>
          <p>The nightly task that aggregates yesterday's ai_call_log into the rollup table + emails alerts when thresholds cross.</p>

          <h3>The cost_rollup task</h3>
          <CodePre>{`// PulseWire/src/worker/tasks/cost-rollup.ts — verbatim (excerpt)
import { sql } from 'drizzle-orm'
import type { Task } from 'graphile-worker'
import { db } from '@/db/client'
import { dailyAiCostRollup } from '@/db/schema'
import {
  ALERT_THRESHOLD_USD,
  PAUSE_THRESHOLD_USD,
  getMtdCostUsd,
  invalidatePauseCache,
} from '@/lib/ai/cost'
import { sendAlertEmail } from '@/lib/ai/email'

/**
 * Daily aggregation of ai_call_log into daily_ai_cost_rollup. Runs at
 * 00:30 ET (04:30 UTC) so it captures the previous full ET day.
 *
 * Also checks MTD vs ALERT_THRESHOLD and PAUSE_THRESHOLD, sends one
 * email per threshold per month (idempotency via alert_sent flag on
 * the current month's first rollup row).
 */
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
  helpers.logger.info(\`cost_rollup: MTD = $\${mtd.toFixed(2)}\`)

  // ... alert logic continues below ...
}`}</CodePre>

          <h3>What the aggregation does</h3>
          <p>The INSERT...ON CONFLICT pattern:</p>
          <ol>
            <li>Group yesterday's rows by ET date.</li>
            <li>Sum the est_cost_usd.</li>
            <li>Insert into <code>daily_ai_cost_rollup</code>.</li>
            <li>If a row for yesterday already exists (re-run), update it.</li>
          </ol>

          <p>Idempotent — running the task twice produces the same result.</p>

          <h3>The daily_ai_cost_rollup schema</h3>
          <CodePre>{`// PulseWire/src/db/schema.ts — verbatim
// Date-keyed aggregate so /app/settings/ai-cost can chart MTD spend without
// re-scanning ai_call_log. Updated by the daily cost_rollup task.
export const dailyAiCostRollup = pgTable('daily_ai_cost_rollup', {
  date:        text('date').primaryKey(), // YYYY-MM-DD in America/New_York
  estCostUsd:  numeric('est_cost_usd', { precision: 12, scale: 6 }).notNull().default('0'),
  alertSent:   boolean('alert_sent').notNull().default(false),
})`}</CodePre>

          <h3>The alert email path</h3>
          <CodePre>{`// PulseWire/src/lib/ai/email.ts — verbatim
import sgMail from '@sendgrid/mail'
import { env } from '@/env'

const FROM_ADDRESS = 'alerts@pulsewire.enzolopez.net'

let configured = false
function configure(): boolean {
  if (!env.SENDGRID_API_KEY) return false
  if (!configured) {
    sgMail.setApiKey(env.SENDGRID_API_KEY)
    configured = true
  }
  return true
}

export async function sendAlertEmail(opts: { subject: string; text: string }): Promise<boolean> {
  if (!configure()) {
    console.warn(\`[alert] SENDGRID_API_KEY not set — would send "\${opts.subject}":\\n\${opts.text}\`)
    return false
  }
  if (!env.COST_ALERT_EMAIL) {
    console.warn(\`[alert] COST_ALERT_EMAIL not set — would send "\${opts.subject}":\\n\${opts.text}\`)
    return false
  }
  try {
    await sgMail.send({
      to:      env.COST_ALERT_EMAIL,
      from:    FROM_ADDRESS,
      subject: opts.subject,
      text:    opts.text,
    })
    console.log(\`[alert] sent: \${opts.subject}\`)
    return true
  } catch (e) {
    console.error('[alert] SendGrid error:', (e as Error).message)
    return false
  }
}`}</CodePre>

          <h3>The "fail open, never throw" pattern</h3>
          <p>The email function NEVER throws. If SendGrid is down, the key is missing, the address is wrong — log loudly, return false. Reason: a cost-alert path that itself crashes the worker means you'd lose the alert AND lose the worker process. Better: log the alert text to console (Azure log stream picks it up) and continue.</p>

          <h3>The alert dedup</h3>
          <p>The <code>alert_sent</code> flag on the FIRST rollup row of the current month is the idempotency token. Pseudocode for the alert block:</p>
          <CodePre>{`// Pseudocode (continuation of cost-rollup.ts)
const monthFirstRow = await db.query.dailyAiCostRollup.findFirst({
  where: gte(dailyAiCostRollup.date, monthStartStr),
  orderBy: asc(dailyAiCostRollup.date),
})

if (mtd >= ALERT_THRESHOLD_USD && !monthFirstRow?.alertSent) {
  await sendAlertEmail({
    subject: \`PulseWire AI MTD $\${mtd.toFixed(2)} (alert threshold $\${ALERT_THRESHOLD_USD})\`,
    text:    \`Reached \${(mtd / PAUSE_THRESHOLD_USD * 100).toFixed(0)}% of monthly AI budget...\`,
  })
  // Set the flag so we don't email again this month
  await db.update(dailyAiCostRollup)
    .set({ alertSent: true })
    .where(eq(dailyAiCostRollup.date, monthFirstRow.date))
}`}</CodePre>

          <p>One email per month per threshold. Without the flag, you'd email every night for the rest of the month — annoying + masks the actual signal.</p>

          <h3>The SendGrid setup</h3>
          <ol>
            <li>Sign up at sendgrid.com (free tier: 100 emails/day).</li>
            <li>Verify a single sender ("alerts@yourapp.com") — the only sender you can send from on the free tier.</li>
            <li>Create an API key with "Mail Send" permission.</li>
            <li>Store in <code>SENDGRID_API_KEY</code>; also set <code>COST_ALERT_EMAIL</code> to where alerts go.</li>
          </ol>

          <p>For production at scale, verify a domain (DKIM + SPF) so emails don't land in spam. PulseWire's setup uses the single-sender path because the cost-alert email is the only thing it sends.</p>
        </section>

        <hr />

        {/* SECTION 10 — REAL CALLS */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Chat + Embeddings — Real Call Sites</h2>
          <p>How real PulseWire features compose all of the above into a single call.</p>

          <h3>An embedding call (the most common)</h3>
          <CodePre>{`// PulseWire/src/lib/ai/embed.ts — verbatim
import { env } from '@/env'
import { AiPausedError } from './chat'
import { getPauseState } from './cost'
import { foundry } from './foundry'
import { withAiCallLog } from './log'

/**
 * Cost-gated single-input embedding. Returns the 1536-dim vector
 * (text-embedding-3-small native dimension). Caller is responsible for
 * shape-checking against the articles.embedding column dimension.
 */
export async function embedOne(routeOrJob: string, input: string): Promise<number[]> {
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? 'unknown')

  const model = env.AZURE_AI_EMBED_DEPLOYMENT
  return withAiCallLog(
    { routeOrJob, model },
    async () => {
      const resp = await foundry().embeddings.create({ model, input })
      const vec  = resp.data[0]?.embedding
      if (!vec) throw new Error('embed: empty response')
      return {
        data:         vec,
        inputTokens:  resp.usage?.prompt_tokens ?? 0,
        outputTokens: 0,
      }
    },
  )
}`}</CodePre>

          <h3>A batched embedding call (for backfills)</h3>
          <CodePre>{`/**
 * Batched embedding. The OpenAI SDK accepts an array of inputs and
 * returns embeddings in the same order. Use this for backfills.
 */
export async function embedMany(routeOrJob: string, inputs: string[]): Promise<number[][]> {
  if (inputs.length === 0) return []
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? 'unknown')

  const model = env.AZURE_AI_EMBED_DEPLOYMENT
  return withAiCallLog(
    { routeOrJob, model },
    async () => {
      const resp = await foundry().embeddings.create({ model, input: inputs })
      const vecs = resp.data.map(d => d.embedding)
      return {
        data:         vecs,
        inputTokens:  resp.usage?.prompt_tokens ?? 0,
        outputTokens: 0,
      }
    },
  )
}`}</CodePre>

          <p>Same shape, accepts an array. Foundry returns the vectors in input-order. The <code>backfill_embeddings</code> task uses this — embedding 100 articles in one API call rather than 100 calls.</p>

          <h3>A chat completion (with JSON mode + max_tokens)</h3>
          <CodePre>{`// PulseWire/src/lib/ai/chat.ts (pattern from chatComplete)
export async function chatComplete(
  routeOrJob: string,
  opts: ChatOptions,
): Promise<{ content: string; inputTokens: number; outputTokens: number }> {
  const pause = await getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason ?? 'unknown')

  const model = opts.model ?? env.AZURE_AI_CHAT_DEPLOYMENT

  return withAiCallLog(
    { routeOrJob, model },
    async () => {
      const resp = await foundry().chat.completions.create({
        model,
        messages:        opts.messages,
        response_format: opts.responseFormat,
        max_tokens:      opts.maxTokens ?? 512,
        temperature:     opts.temperature ?? 0.2,
      })
      const choice = resp.choices[0]
      return {
        data: {
          content:      choice?.message.content ?? '',
          inputTokens:  resp.usage?.prompt_tokens ?? 0,
          outputTokens: resp.usage?.completion_tokens ?? 0,
        },
        inputTokens:  resp.usage?.prompt_tokens ?? 0,
        outputTokens: resp.usage?.completion_tokens ?? 0,
      }
    },
  )
}`}</CodePre>

          <h3>Cluster summarization — using chatComplete</h3>
          <CodePre>{`// Cluster summarize task — usage pattern
const result = await chatComplete('summarize_cluster', {
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user',   content: \`Here are 3-5 articles about the same story. Write a 1-paragraph executive summary.\\n\\n\${articleTexts.join('\\n---\\n')}\` },
  ],
  responseFormat: { type: 'json_object' },
  maxTokens: 400,
  temperature: 0.2,
})

const parsed = JSON.parse(result.content)  // { title, summary }
await db.update(clusters).set({
  canonicalTitle:   parsed.title,
  canonicalSummary: parsed.summary,
}).where(eq(clusters.id, clusterId))`}</CodePre>

          <p>JSON mode + temperature 0.2 gives mostly-deterministic structured output. The summary task generates one summary per cluster per session — at PulseWire's scale, ~50 clusters/day → ~50 chat calls/day at $0.01 each = ~$15/month for summaries. Embeddings dominate cost.</p>

          <h3>Streaming chat (for "ask my notes" features)</h3>
          <p>PulseWire's reader could support streaming Q&A. The pattern:</p>
          <CodePre>{`// Pseudo — not currently in PulseWire but the shape
const stream = await foundry().chat.completions.create({
  model: env.AZURE_AI_CHAT_DEPLOYMENT,
  messages,
  stream: true,
})

// Server-side SSE forwarding to the browser
for await (const chunk of stream) {
  const delta = chunk.choices[0]?.delta?.content
  if (delta) res.write(\`data: \${JSON.stringify({ delta })}\\n\\n\`)
}

// withAiCallLog wrapping streams is trickier — usage arrives in the final chunk.
// PulseWire wraps after the stream completes by reading stream.usage.`}</CodePre>

          <h3>Cost by feature breakdown</h3>
          <p>Querying <code>ai_call_log</code> by <code>route_or_job</code> shows where the budget goes:</p>
          <CodePre>{`SELECT route_or_job, model,
       count(*) as calls,
       sum(input_tokens) as in_tokens,
       sum(output_tokens) as out_tokens,
       sum(est_cost_usd) as cost
FROM ai_call_log
WHERE created_at > now() - interval '30 days'
GROUP BY route_or_job, model
ORDER BY cost DESC;`}</CodePre>

          <p>Typical PulseWire result:</p>
          <ul>
            <li><code>embed_article</code> + <code>text-embedding-3-small</code>: ~10k calls, ~5M input tokens, ~$0.10 cost</li>
            <li><code>summarize_cluster</code> + <code>gpt-5.4</code>: ~50 calls, ~50k input + ~10k output, ~$0.40 cost</li>
            <li><code>score_article</code>: pure DB, no AI calls</li>
            <li>Total: well under the $50 cap</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab — Cost-Gated AI Client</h2>
          <p>Stand up a minimal cost-gated AI client against any OpenAI-compatible endpoint. Implement the pricing table, pause threshold, withAiCallLog wrapper, AiPausedError. ~45 minutes.</p>

          <h3>Step 1 — Scaffold</h3>
          <CodePre>{`mkdir ai-cost-lab && cd ai-cost-lab
npm init -y
npm pkg set type=module
npm i openai better-sqlite3 dotenv`}</CodePre>

          <CodePre>{`# .env
# For the lab — point at OpenAI direct
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_EMBED_MODEL=text-embedding-3-small

ALERT_THRESHOLD_USD=0.10
PAUSE_THRESHOLD_USD=0.20`}</CodePre>

          <p>Tiny thresholds so you can hit them quickly in dev.</p>

          <h3>Step 2 — db.js with SQLite</h3>
          <CodePre>{`// db.js
import Database from 'better-sqlite3'

const db = new Database('./lab.db')
db.pragma('journal_mode = WAL')
db.exec(\`
  CREATE TABLE IF NOT EXISTS ai_call_log (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    route_or_job  TEXT NOT NULL,
    model         TEXT NOT NULL,
    input_tokens  INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    est_cost_usd  REAL NOT NULL,
    succeeded     INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_ai_call_log_created ON ai_call_log(created_at DESC);
\`)

export default db`}</CodePre>

          <h3>Step 3 — cost.js</h3>
          <CodePre>{`// cost.js
import db from './db.js'

const PRICING = {
  'gpt-4o-mini':            { input: 0.15e-6, output: 0.60e-6 },
  'gpt-4o':                 { input: 5e-6,    output: 15e-6 },
  'text-embedding-3-small': { input: 0.02e-6, output: 0 },
}

export const ALERT = Number(process.env.ALERT_THRESHOLD_USD ?? 0.10)
export const PAUSE = Number(process.env.PAUSE_THRESHOLD_USD ?? 0.20)

export function estimateCostUsd(model, inputTokens, outputTokens) {
  const p = PRICING[model]
  if (!p) {
    console.warn(\`[cost] no pricing for \${model}, defaulting to gpt-4o\`)
    const fb = PRICING['gpt-4o']
    return inputTokens * fb.input + outputTokens * fb.output
  }
  return inputTokens * p.input + outputTokens * p.output
}

let pauseCache = null
const TTL = 60_000

export function getPauseState() {
  const now = Date.now()
  if (pauseCache && pauseCache.exp > now) return pauseCache.value

  const today = db.prepare("SELECT COALESCE(SUM(est_cost_usd), 0) AS c FROM ai_call_log WHERE created_at > datetime('now', 'start of month')").get()
  const mtd = Number(today.c) || 0
  const state = mtd >= PAUSE
    ? { paused: true,  reason: \`MTD $\${mtd.toFixed(4)} >= $\${PAUSE}\`, mtdUsd: mtd }
    : { paused: false, mtdUsd: mtd }
  pauseCache = { value: state, exp: now + TTL }
  return state
}

export function invalidatePauseCache() { pauseCache = null }`}</CodePre>

          <h3>Step 4 — log.js</h3>
          <CodePre>{`// log.js
import db from './db.js'
import { estimateCostUsd } from './cost.js'

export async function withAiCallLog(meta, fn) {
  try {
    const { data, inputTokens, outputTokens } = await fn()
    const est = estimateCostUsd(meta.model, inputTokens, outputTokens)
    db.prepare(
      'INSERT INTO ai_call_log (route_or_job, model, input_tokens, output_tokens, est_cost_usd, succeeded) VALUES (?, ?, ?, ?, ?, 1)'
    ).run(meta.routeOrJob, meta.model, inputTokens, outputTokens, est)
    return data
  } catch (e) {
    try {
      db.prepare(
        'INSERT INTO ai_call_log (route_or_job, model, input_tokens, output_tokens, est_cost_usd, succeeded) VALUES (?, ?, ?, ?, ?, 0)'
      ).run(meta.routeOrJob, meta.model, 0, 0, 0)
    } catch {}
    throw e
  }
}`}</CodePre>

          <h3>Step 5 — foundry.js + chat.js + embed.js</h3>
          <CodePre>{`// foundry.js
import OpenAI from 'openai'

let client
export function foundry() {
  if (client) return client
  client = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey:  process.env.OPENAI_API_KEY,
    timeout: 120_000,
  })
  return client
}

// chat.js
import { foundry } from './foundry.js'
import { getPauseState, invalidatePauseCache } from './cost.js'
import { withAiCallLog } from './log.js'

export class AiPausedError extends Error {
  constructor(reason) { super(\`AI paused: \${reason}\`); this.name = 'AiPausedError' }
}

export async function chatComplete(routeOrJob, messages) {
  const pause = getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason)

  const model = process.env.OPENAI_CHAT_MODEL
  return withAiCallLog({ routeOrJob, model }, async () => {
    const resp = await foundry().chat.completions.create({ model, messages, max_tokens: 200 })
    return {
      data:         resp.choices[0]?.message.content ?? '',
      inputTokens:  resp.usage?.prompt_tokens ?? 0,
      outputTokens: resp.usage?.completion_tokens ?? 0,
    }
  })
}

// embed.js
export async function embedOne(routeOrJob, input) {
  const pause = getPauseState()
  if (pause.paused) throw new AiPausedError(pause.reason)

  const model = process.env.OPENAI_EMBED_MODEL
  return withAiCallLog({ routeOrJob, model }, async () => {
    const resp = await foundry().embeddings.create({ model, input })
    return {
      data:         resp.data[0]?.embedding,
      inputTokens:  resp.usage?.prompt_tokens ?? 0,
      outputTokens: 0,
    }
  })
}`}</CodePre>

          <h3>Step 6 — main.js + run</h3>
          <CodePre>{`// main.js
import 'dotenv/config'
import { chatComplete, embedOne, AiPausedError } from './chat.js'
import db from './db.js'

async function loop() {
  for (let i = 0; i < 50; i++) {
    try {
      const text = await chatComplete('test_chat', [
        { role: 'system', content: 'Reply with exactly 5 words.' },
        { role: 'user',   content: \`Tell me about #\${i}\` },
      ])
      console.log(\`#\${i}: \${text}\`)
    } catch (e) {
      if (e instanceof AiPausedError) {
        console.log(\`#\${i}: PAUSED — \${e.message}\`)
        break  // stop the loop
      }
      throw e
    }
  }

  const summary = db.prepare(\`
    SELECT route_or_job, model, COUNT(*) as calls, SUM(est_cost_usd) as cost
    FROM ai_call_log GROUP BY route_or_job, model
  \`).all()
  console.log('\\nai_call_log summary:')
  console.table(summary)
}

await loop()`}</CodePre>

          <CodePre>{`node main.js`}</CodePre>

          <h3>Step 7 — Watch it pause</h3>
          <p>With <code>PAUSE_THRESHOLD_USD=0.20</code> and gpt-4o-mini's cheap rates, you'll need ~50-100 calls to cross. The loop will print "PAUSED" when MTD crosses the threshold and break.</p>

          <p>Run a second time without resetting — the loop pauses immediately because the SQLite ai_call_log persists.</p>

          <h3>Step 8 — Reset</h3>
          <CodePre>{`# To resume in the lab — clear the log
sqlite3 lab.db "DELETE FROM ai_call_log;"

# Then run again
node main.js`}</CodePre>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              You've replicated PulseWire's entire cost-gated AI client at lab scale: pricing table, threshold, pause
              state, withAiCallLog wrapper, AiPausedError discipline, ai_call_log instrumentation. The same code with
              SQLite swapped for Postgres + a real rollup task + SendGrid is what PulseWire ships.
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"Resource not found" 404 from Foundry</h3>
          <p>The <code>model</code> field doesn't match a deployment name. Check the deployment names in the Foundry portal vs your env vars.</p>

          <h3>"Authentication failed" 401</h3>
          <p>Wrong API key, OR you're using the OpenAI direct key against a Foundry endpoint. The keys are different — Foundry's is per-resource, OpenAI's starts with <code>sk-</code>.</p>

          <h3>"baseURL must include /openai/v1"</h3>
          <p>You're pointed at the classic Azure OpenAI Service surface. Either: (a) append <code>/openai/v1</code> to the URL, (b) switch the SDK to <code>AzureOpenAI</code> client that handles the legacy path. PulseWire goes with (a).</p>

          <h3>"429 Too Many Requests"</h3>
          <p>Hit the TPM (tokens per minute) capacity on the deployment. Either: (a) lower call volume, (b) increase TPM in the Foundry portal, (c) request a quota increase from Azure.</p>

          <h3>The OpenAI SDK can't find usage</h3>
          <p>For streaming calls, <code>usage</code> isn't on individual chunks — only on the final chunk if you pass <code>stream_options: {`{ include_usage: true }`}</code>. PulseWire's streaming pattern reads usage from the final chunk.</p>

          <h3>"AiPausedError" but I expected to be under budget</h3>
          <p>Either: (a) the 60s cache hasn't refreshed (wait or restart), (b) the pricing table overestimates, (c) someone (or the worker) burned the budget unexpectedly. Run the cost-by-feature query (§10) to see who.</p>

          <h3>Worker keeps retrying paused tasks</h3>
          <p>You forgot to add <code>if (e instanceof AiPausedError) return</code> to the catch block. Without that, graphile-worker treats it as a normal error and retries up to <code>maxAttempts</code> times.</p>

          <h3>SendGrid emails not arriving</h3>
          <ul>
            <li>API key wrong or expired.</li>
            <li>From address not verified (free tier requires single-sender verification).</li>
            <li>Receiving server marking as spam — check the SendGrid activity feed.</li>
          </ul>

          <h3>Cost rollup task fires but the MTD seems wrong</h3>
          <p>Timezone confusion. The aggregation uses <code>America/New_York</code>; if you check at UTC midnight you might think yesterday's spend got dropped. It hasn't — it's just that "yesterday in ET" is still part of today in UTC for the first 4-5 hours.</p>

          <h3>ai_call_log table is huge</h3>
          <p>At ~1k rows/day, 30 days = 30k rows. At 10k rows/day, 30 days = 300k rows. Add a prune task that deletes rows older than 90 days — the rollup table covers everything beyond.</p>

          <h3>"My estimated cost doesn't match the Azure invoice"</h3>
          <p>Expected. The pricing table is best-effort. Reconcile monthly, update the table if drift exceeds 10%.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>The four env vars</h3>
          <CodePre>{`AZURE_AI_ENDPOINT=https://<resource>.cognitiveservices.azure.com/openai/v1
AZURE_AI_API_KEY=<key from portal>
AZURE_AI_CHAT_DEPLOYMENT=<deployment-name>
AZURE_AI_EMBED_DEPLOYMENT=<deployment-name>`}</CodePre>

          <h3>foundry() client</h3>
          <CodePre>{`new OpenAI({
  baseURL: env.AZURE_AI_ENDPOINT.replace(/\\/$/, ''),
  apiKey:  env.AZURE_AI_API_KEY,
  timeout: 120_000,
})`}</CodePre>

          <h3>Per-token cost</h3>
          <CodePre>{`function estimateCostUsd(model, inputTokens, outputTokens) {
  const p = PRICING[model] ?? PRICING.fallback
  return inputTokens * p.input + outputTokens * p.output
}`}</CodePre>

          <h3>Pause state</h3>
          <CodePre>{`async function getPauseState() {
  if (cache && cache.exp > now) return cache.value
  const mtd = await mtdCostUsd()
  const state = mtd >= PAUSE_THRESHOLD_USD
    ? { paused: true,  reason: \`MTD $\${mtd}\`, mtdUsd: mtd }
    : { paused: false, mtdUsd: mtd }
  cache = { value: state, exp: now + 60_000 }
  return state
}`}</CodePre>

          <h3>withAiCallLog wrapper</h3>
          <CodePre>{`async function withAiCallLog(meta, fn) {
  try {
    const { data, inputTokens, outputTokens } = await fn()
    const est = estimateCostUsd(meta.model, inputTokens, outputTokens)
    await db.insert(aiCallLog).values({ ...meta, inputTokens, outputTokens, estCostUsd: est, succeeded: true })
    return data
  } catch (e) {
    await db.insert(aiCallLog).values({ ...meta, ..., succeeded: false }).catch(() => {})
    throw e
  }
}`}</CodePre>

          <h3>The paused-error pattern</h3>
          <CodePre>{`export class AiPausedError extends Error {
  constructor(reason) { super(\`AI paused: \${reason}\`); this.name = 'AiPausedError' }
}

// At every entry point:
const pause = await getPauseState()
if (pause.paused) throw new AiPausedError(pause.reason)

// At every worker catch:
catch (e) {
  if (e instanceof AiPausedError) {
    logger.warn(\`\${task} paused\`)
    return                              // ← don't retry
  }
  throw e                                // ← retry transient
}`}</CodePre>

          <h3>Where to find each pattern in source</h3>
          <table>
            <tbody>
              <tr><th>Pattern</th><th>File</th></tr>
              <tr><td>foundry() client</td><td>PulseWire · <code>src/lib/ai/foundry.ts</code> (full)</td></tr>
              <tr><td>Per-token pricing table</td><td>PulseWire · <code>src/lib/ai/cost.ts</code></td></tr>
              <tr><td>getMtdCostUsd CTE</td><td>PulseWire · <code>src/lib/ai/cost.ts</code></td></tr>
              <tr><td>getPauseState + 60s cache</td><td>PulseWire · <code>src/lib/ai/cost.ts</code></td></tr>
              <tr><td>withAiCallLog wrapper</td><td>PulseWire · <code>src/lib/ai/log.ts</code> (full)</td></tr>
              <tr><td>AiPausedError class</td><td>PulseWire · <code>src/lib/ai/chat.ts</code></td></tr>
              <tr><td>embedOne / embedMany</td><td>PulseWire · <code>src/lib/ai/embed.ts</code></td></tr>
              <tr><td>cost_rollup task</td><td>PulseWire · <code>src/worker/tasks/cost-rollup.ts</code></td></tr>
              <tr><td>sendAlertEmail</td><td>PulseWire · <code>src/lib/ai/email.ts</code> (full)</td></tr>
              <tr><td>ai_call_log schema</td><td>PulseWire · <code>src/db/schema.ts</code></td></tr>
              <tr><td>daily_ai_cost_rollup schema</td><td>PulseWire · <code>src/db/schema.ts</code></td></tr>
              <tr><td>Worker AiPausedError catch</td><td>PulseWire · <code>src/worker/tasks/embed-article.ts</code></td></tr>
            </tbody>
          </table>

          <p className="finished-marker">★ End of guide — next: graphile-worker.</p>
        </section>
      </main>
    </div>
  );
}
