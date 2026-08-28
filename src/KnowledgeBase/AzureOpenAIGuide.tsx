import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Mental Model',                     icon: '🧠' },
  { id: 's2',  num: '2',  title: 'The Four Env Vars',                icon: '🔑' },
  { id: 's3',  num: '3',  title: 'Deployments vs Models',            icon: '🚀' },
  { id: 's4',  num: '4',  title: 'Direct REST (No SDK)',             icon: '🌐' },
  { id: 's5',  num: '5',  title: 'Streaming via SSE',                icon: '🌊' },
  { id: 's6',  num: '6',  title: 'The IIS Buffer-Padding Trick',     icon: '🧰' },
  { id: 's7',  num: '7',  title: 'Token Counts + Telemetry',         icon: '📊' },
  { id: 's8',  num: '8',  title: 'Provider Comparison',              icon: '⚖️' },
  { id: 's9',  num: '9',  title: 'Errors + Retry',                   icon: '⚠️' },
  { id: 's10', num: '10', title: 'API Version Pinning',              icon: '📌' },
  { id: 's11', num: '★',  title: 'Lab: Build a Streaming Endpoint',  icon: '🛠️' },
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

export default function AzureOpenAIGuide() {
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
            <span className="sidebar-title">Azure OpenAI</span>
          </div>
          <div className="sidebar-sub">Hearth's chat + streaming routes</div>
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
          <div className="hero-tag">🔑 Azure OpenAI · 2024-04-01-preview · 2026</div>
          <h1>Azure OpenAI Service<br />(Hearth's chat backbone)</h1>
          <p>
            Hearth ships two Azure OpenAI endpoints — one buffered, one streaming — talking directly to the Azure REST
            API with no SDK. The deployment-name URL convention, the <code>api-key</code> header (not Bearer), the IIS
            2KB buffer-padding hack for SSE, the close-handler that cancels the upstream reader on client abort — every
            production detail of running Azure OpenAI is here. Plus: how Hearth's approach compares to PulseWire's
            <strong style={{ color: '#C77AA0' }}> Azure AI Foundry</strong> route and ShopKeep's
            <strong style={{ color: '#C77AA0' }}> direct Anthropic SDK</strong>.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">2</span><span className="hero-stat-label">Routes (sync + SSE)</span></div>
            <div className="hero-stat"><span className="hero-stat-val">0</span><span className="hero-stat-label">SDK dependencies</span></div>
            <div className="hero-stat"><span className="hero-stat-val">2KB</span><span className="hero-stat-label">SSE pad</span></div>
            <div className="hero-stat"><span className="hero-stat-val">120s</span><span className="hero-stat-label">Timeout target</span></div>
          </div>
        </div>

        {/* SECTION 1 — MENTAL MODEL */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Mental Model</h2>
          <p>
            Azure OpenAI is Microsoft's hosted, enterprise-tier version of OpenAI's API — same models, same response
            shapes, different URL structure, different auth header, different rate-limiting story. You "deploy" a
            model (give it a name like <code>gpt-5</code> or <code>gpt-mini</code>) and then call your DEPLOYMENT, not
            the model directly. From your code's perspective, the deployment name takes the place of the model name in
            most APIs.
          </p>

          <h3>Three analogies</h3>
          <p>
            <strong>Hotel chains vs. Airbnb.</strong> Calling api.openai.com is renting from the host directly. Calling
            Azure OpenAI is renting from a hotel chain — Microsoft handles billing, compliance, SLA, throughput
            allocation. The room is the same; the front desk is different.
          </p>
          <p>
            <strong>The deployment as a phone extension.</strong> Each Azure resource has an endpoint
            (<code>https://contoso.openai.azure.com</code>) — that's the building. Inside, you create deployments
            (<code>gpt-5-prod</code>, <code>gpt-mini-cheap</code>) — those are phone extensions. The model running on
            each extension is configurable. When you call, you dial the extension; you don't say "give me a GPT-5
            operator."
          </p>
          <p>
            <strong>SDK is optional.</strong> The official <code>openai</code> npm package supports Azure via a few
            extra constructor args, but the REST API is just an HTTP POST with a JSON body and a header. Hearth
            chose the raw-REST route because the SDK adds 250KB of bundle for one method call. (PulseWire uses the SDK
            because it points at Azure AI Foundry, which is OpenAI-SDK-compatible by design.)
          </p>

          <h3>What Hearth uses it for</h3>
          <ul>
            <li><strong>The Plex metadata enrichment flow</strong> — Hearth's Plex Command Center can ask a model to clean up movie titles, suggest taxonomy fixes, and explain mismatch warnings.</li>
            <li><strong>Generic chat</strong> — the <code>/api/azure-openai/chat</code> endpoint is reusable for any conversational flow in the UI.</li>
            <li><strong>Streaming responses</strong> — the <code>/api/azure-openai/chat/stream</code> endpoint surfaces tokens as they arrive, for the "GPT typing in real time" UX.</li>
          </ul>

          <h3>Azure OpenAI vs everything else</h3>
          <table>
            <tbody>
              <tr><th>Service</th><th>Host</th><th>Auth</th><th>SDK</th><th>Best for</th></tr>
              <tr><td><strong>Azure OpenAI</strong></td><td>*.openai.azure.com</td><td><code>api-key</code> header</td><td>openai (Azure mode)</td><td>Enterprise SLA + compliance</td></tr>
              <tr><td>Azure AI Foundry</td><td>*.services.ai.azure.com</td><td>Bearer or api-key</td><td>openai SDK works as-is</td><td>Multi-model, evals, hosted prompts</td></tr>
              <tr><td>OpenAI direct</td><td>api.openai.com</td><td>Bearer (Authorization)</td><td>openai</td><td>Bleeding edge access, fastest releases</td></tr>
              <tr><td>Anthropic direct</td><td>api.anthropic.com</td><td><code>x-api-key</code> header</td><td>@anthropic-ai/sdk</td><td>Long context, vision, web_search tool</td></tr>
            </tbody>
          </table>

          <h3>Fleet usage map</h3>
          <table>
            <tbody>
              <tr><th>App</th><th>Provider</th><th>Why</th></tr>
              <tr><td>SecretApp (Hearth)</td><td>Azure OpenAI</td><td>Microsoft-internal account, free Azure credit, easy DNS</td></tr>
              <tr><td>PulseWire</td><td>Azure AI Foundry</td><td>OpenAI SDK + multi-model + integrated cost cap</td></tr>
              <tr><td>ShopKeep</td><td>Anthropic direct</td><td>Vision for tool photos, web_search for enrichment</td></tr>
              <tr><td>Tabloom</td><td>Anthropic direct</td><td>Long-context note summarization, web_search</td></tr>
              <tr><td>Cairn / GLP1 / Puzzlebox</td><td>None</td><td>Don't need AI today</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* SECTION 2 — ENV VARS */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>The Four Env Vars</h2>
          <p>Azure OpenAI configuration boils down to four pieces of information. Hearth keeps them in <code>lib/azureOpenAI.js</code>:</p>

          <CodePre>{`// lib/azureOpenAI.js — verbatim
export const azureOpenAIConfig = {
  endpoint:   process.env.AZURE_OPENAI_ENDPOINT,
  apiKey:     process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview',
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
}`}</CodePre>

          <h3>endpoint</h3>
          <p>The Azure resource's base URL: <code>https://&lt;resource-name&gt;.openai.azure.com</code>. Hearth's includes the trailing slash to make URL concatenation simpler. Always region-specific — the same model in <code>eastus</code> and <code>swedencentral</code> has different endpoints.</p>

          <h3>apiKey</h3>
          <p>
            32-character secret from the Azure portal under <em>Keys and Endpoint</em>. Goes in the
            <code>api-key</code> header — NOT <code>Authorization: Bearer</code> like OpenAI direct or AI Foundry. This
            is the single most-tripped-over difference between Azure OpenAI and every other API. <strong>If your call
            returns 401 and you're using <code>Authorization: Bearer</code>, that's why.</strong>
          </p>

          <h3>apiVersion</h3>
          <p>
            Azure pins your code to a specific API contract. The default <code>2024-04-01-preview</code> includes
            chat-completions, streaming, function-calling, JSON mode, and structured outputs. Newer previews surface
            newer features (vision, parallel tool use, response_format=text/json_object/json_schema). Pin to a known
            version; never use "latest" in production.
          </p>

          <h3>deployment</h3>
          <p>
            The name you gave your deployment in the Azure portal, NOT the model name. Hearth's prod deployment is
            named after the underlying model for clarity (e.g., <code>gpt-5</code>), but you could deploy gpt-5 under
            a deployment name like <code>cheap-llm</code> if you wanted. The deployment name appears in the URL path.
          </p>

          <h3>server.js validation</h3>
          <p>Hearth's <code>server.js</code> validates these at startup and refuses to boot if any are missing:</p>
          <CodePre>{`// server.js (sketch — actual list in code)
const REQUIRED_ENV = [
  'AZURE_OPENAI_ENDPOINT',
  'AZURE_OPENAI_API_KEY',
  'AZURE_OPENAI_DEPLOYMENT',
  // AZURE_OPENAI_API_VERSION has a default
  'PLEX_TOKEN',
]
for (const k of REQUIRED_ENV) {
  if (!process.env[k]) {
    console.error(\`Missing required env: \${k}\`)
    process.exit(1)
  }
}`}</CodePre>

          <p>This is fail-fast: better to crash at boot with a clear message than to fail every AI request later with a confusing 401. The "boot validation" pattern is fleet-wide — every app that requires external services validates at startup.</p>

          <h3>Where they live in production</h3>
          <ul>
            <li><strong>Azure App Service</strong>: configured under <em>Environment Variables</em>. Set <code>AZURE_OPENAI_API_KEY</code> as a "slot setting" so blue/green swaps don't move the secret between slots.</li>
            <li><strong>Key Vault references</strong>: the cleanest pattern. App Service can reference <code>@Microsoft.KeyVault(SecretUri=...)</code> instead of holding the secret in app config. Key Vault audit log shows every fetch.</li>
            <li><strong>Local dev</strong>: in <code>.env</code> (gitignored). Hearth's <code>.env.example</code> documents every required key.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 3 — DEPLOYMENTS */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Deployments vs Models</h2>
          <p>The single most confusing part of Azure OpenAI is the deployment-vs-model distinction. Once it clicks, everything else falls into place.</p>

          <h3>The mental shift</h3>
          <p>
            On OpenAI direct, you call <code>{`POST /v1/chat/completions`}</code> and pass <code>{`{ "model": "gpt-5" }`}</code>
            in the body. The model name IS the routing key.
          </p>
          <p>
            On Azure OpenAI, you call <code>{`POST /openai/deployments/<deployment-name>/chat/completions`}</code>. The
            deployment name in the URL is the routing key. You can still pass <code>model</code> in the body, but it's
            informational — the URL has already routed your request.
          </p>

          <h3>Why this matters</h3>
          <ul>
            <li><strong>Deployments are independently rate-limited.</strong> Two deployments of the same model have separate TPM/RPM quotas. Useful for isolation: dev vs prod, free-tier user vs paid.</li>
            <li><strong>Deployments persist across model upgrades.</strong> You can swap the underlying model behind a deployment without changing code. Move from gpt-4 to gpt-5 by changing one Azure portal setting.</li>
            <li><strong>Multiple deployments per model.</strong> You can have <code>gpt-5-fast</code> (low temperature, JSON mode default) and <code>gpt-5-creative</code> (high temperature) — same model, different default config.</li>
            <li><strong>The model name in the response.</strong> Azure includes the actual underlying model in <code>data.model</code> in the response — useful for logging which version was used.</li>
          </ul>

          <h3>The URL pattern</h3>
          <CodePre>{`POST {endpoint}openai/deployments/{deployment}/chat/completions?api-version={apiVersion}`}</CodePre>

          <p>Hearth's URL-builder line, from <code>routes/ai.js</code>:</p>
          <CodePre>{`const url = \`\${azureOpenAIConfig.endpoint}openai/deployments/\${azureOpenAIConfig.deployment}/chat/completions?api-version=\${azureOpenAIConfig.apiVersion}\``}</CodePre>

          <h3>Other endpoints under the deployment</h3>
          <table>
            <tbody>
              <tr><th>Endpoint</th><th>Use for</th></tr>
              <tr><td><code>.../chat/completions</code></td><td>Chat (the workhorse)</td></tr>
              <tr><td><code>.../completions</code></td><td>Legacy text completion</td></tr>
              <tr><td><code>.../embeddings</code></td><td>Vector embeddings</td></tr>
              <tr><td><code>.../images/generations</code></td><td>DALL·E</td></tr>
              <tr><td><code>.../audio/transcriptions</code></td><td>Whisper</td></tr>
            </tbody>
          </table>

          <p>Each requires a SEPARATE deployment — you can't share one deployment between chat and embeddings. The Plex enrichment flow could need TWO deployments if it both chats and embeds.</p>

          <h3>Quota implications</h3>
          <p>Azure Open AI quotas come in TPM (tokens per minute) and RPM (requests per minute). When you create a deployment, you allocate a slice of your subscription's TPM budget. If you have 240k TPM total in the region and split it 50/50 between two deployments, each gets 120k. Move quota by editing the deployment in the portal.</p>

          <p>Hearth's prod deployment is allocated 30k TPM — sufficient for Plex enrichment's bursty load. If a feature ever requires more, increase the slice.</p>
        </section>

        <hr />

        {/* SECTION 4 — DIRECT REST */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Direct REST (No SDK)</h2>
          <p>Hearth talks directly to the Azure OpenAI REST API using <code>fetch</code>. No SDK, no wrappers. Here's the full buffered endpoint:</p>

          <CodePre>{`// routes/ai.js — verbatim (lines 11-56)
router.post('/api/azure-openai/chat', async (req, res) => {
  try {
    const { messages } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' })
    }
    const url = \`\${azureOpenAIConfig.endpoint}openai/deployments/\${azureOpenAIConfig.deployment}/chat/completions?api-version=\${azureOpenAIConfig.apiVersion}\`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIConfig.apiKey
      },
      body: JSON.stringify({
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      })
    })
    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({
        error: 'Azure OpenAI API request failed',
        details: errorText
      })
    }
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})`}</CodePre>

          <h3>What's happening, top to bottom</h3>
          <ol>
            <li><strong>Validate the request body.</strong> Messages must exist and be an array. No further validation — the model rejects bad message shapes itself.</li>
            <li><strong>Construct the URL.</strong> Deployment + apiVersion from config; the rest is the Azure pattern.</li>
            <li><strong>Set headers.</strong> <code>Content-Type</code> + <code>api-key</code>. That's it.</li>
            <li><strong>POST the body.</strong> Same shape as OpenAI direct: <code>messages</code>, <code>temperature</code>, <code>max_tokens</code>, etc.</li>
            <li><strong>Surface errors verbatim.</strong> If Azure returns 429 (rate limit) or 400 (bad messages), forward the status and the error body — don't swallow the detail.</li>
            <li><strong>Forward the response.</strong> Whatever Azure returned, send it to the client.</li>
          </ol>

          <h3>The request body shape</h3>
          <CodePre>{`{
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user",   "content": "What is Plex?" }
  ],
  "temperature": 0.7,           // 0 = deterministic, 1 = creative
  "max_tokens": 2000,           // hard cap on response
  "top_p": 0.95,                // nucleus sampling (alternative to temperature)
  "frequency_penalty": 0,       // discourage repeating tokens
  "presence_penalty": 0,        // discourage repeating topics
  "stream": false               // true for SSE
}`}</CodePre>

          <h3>The response shape</h3>
          <CodePre>{`{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1716000000,
  "model": "gpt-5-2025-08-01",  // underlying model, not deployment name
  "choices": [{
    "index": 0,
    "message": { "role": "assistant", "content": "Plex is a media server..." },
    "finish_reason": "stop"      // or "length" if max_tokens hit
  }],
  "usage": {
    "prompt_tokens": 23,
    "completion_tokens": 145,
    "total_tokens": 168
  }
}`}</CodePre>

          <h3>The "structured output" extension</h3>
          <p>Set <code>response_format=&#123;"type":"json_object"&#125;</code> in the body to force valid JSON. Better still, pass a JSON schema:</p>
          <CodePre>{`response_format: {
  type: "json_schema",
  json_schema: {
    name: "tool_metadata",
    schema: {
      type: "object",
      properties: {
        name:  { type: "string" },
        brand: { type: ["string", "null"] },
        category: { type: "string" }
      },
      required: ["name", "category"]
    },
    strict: true
  }
}`}</CodePre>

          <p>With <code>strict: true</code>, Azure guarantees the output validates against the schema — no JSON-parse errors, no missing fields. The "strict" mode adds ~50–200ms latency but eliminates 100% of malformed-JSON failures. Worth it for any structured-extraction task.</p>

          <h3>Why no SDK?</h3>
          <ul>
            <li><strong>Bundle size.</strong> The OpenAI SDK is ~250KB unminified. Hearth's backend bundle doesn't need it.</li>
            <li><strong>Surface area.</strong> Hearth uses exactly one method (chat completions). No need to import an abstraction.</li>
            <li><strong>Version pin.</strong> The REST API contract is pinned via <code>api-version</code>. The SDK introduces a SECOND version axis (SDK version) that can drift independently.</li>
            <li><strong>Debug surface.</strong> When a call fails, you can read the actual HTTP request and response. SDKs hide that behind abstractions.</li>
          </ul>

          <p>
            <strong>Counter-argument.</strong> If you need vision, tool use, retries, or rich error types, the SDK adds
            real value. PulseWire's case for using <code>openai</code> is sound — it talks to Foundry which is
            OpenAI-SDK-compatible, and it uses tool-use heavily.
          </p>
        </section>

        <hr />

        {/* SECTION 5 — STREAMING */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Streaming via SSE</h2>
          <p>
            Streaming is the difference between "wait 8 seconds for the answer" and "see the answer typing in real
            time." Azure OpenAI supports it via the same <code>stream: true</code> flag as OpenAI direct, and the
            response format is Server-Sent Events (SSE) — the same protocol the browser's <code>EventSource</code>
            consumes natively.
          </p>

          <h3>The Hearth streaming endpoint — full source</h3>
          <CodePre>{`// routes/ai.js — verbatim (lines 63-174)
router.post('/api/azure-openai/chat/stream', async (req, res) => {
  try {
    const { messages } = req.body
    const url = \`\${azureOpenAIConfig.endpoint}openai/deployments/\${azureOpenAIConfig.deployment}/chat/completions?api-version=\${azureOpenAIConfig.apiVersion}\`
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': azureOpenAIConfig.apiKey
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95,
        stream: true              // ← THE KEY DIFFERENCE
      })
    })
    if (!upstream.ok) {
      const errorText = await upstream.text()
      return res.status(upstream.status).json({
        error: 'Azure OpenAI API request failed',
        details: errorText
      })
    }
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders?.()
    res.write(':' + ' '.repeat(2048) + '\\n\\n')   // ← see §6
    const reader = upstream.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let aborted = false
    req.on('close', () => {
      aborted = true
      reader.cancel().catch(() => {})
    })
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const frames = buffer.split('\\n\\n')
        buffer = frames.pop() ?? ''
        for (const frame of frames) {
          const line = frame.trim()
          if (!line.startsWith('data:')) continue
          const payload = line.slice(5).trim()
          if (payload === '[DONE]') {
            res.write('event: done\\ndata: {}\\n\\n')
            continue
          }
          try {
            const json = JSON.parse(payload)
            const delta = json?.choices?.[0]?.delta?.content
            if (typeof delta === 'string' && delta.length > 0) {
              res.write(\`data: \${JSON.stringify({ delta })}\\n\\n\`)
            }
            const finishReason = json?.choices?.[0]?.finish_reason
            if (finishReason) {
              res.write(\`event: finish\\ndata: \${JSON.stringify({ reason: finishReason })}\\n\\n\`)
            }
          } catch (err) {
            // ignore partial/unparseable frames
          }
        }
      }
      if (!aborted) {
        res.write('event: done\\ndata: {}\\n\\n')
        res.end()
      }
    } catch (err) {
      if (aborted) return
      res.write(\`event: error\\ndata: \${JSON.stringify({ error: err.message || 'stream error' })}\\n\\n\`)
      res.end()
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    } else {
      res.end()
    }
  }
})`}</CodePre>

          <h3>What's happening</h3>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant C as Client (React)
  participant H as Hearth (Express)
  participant A as Azure OpenAI

  C->>H: POST /api/azure-openai/chat/stream
  H->>A: POST .../chat/completions?stream=true
  A-->>H: text/event-stream (chunked)

  H->>C: Set SSE headers
  H->>C: write 2KB padding (IIS flush)

  loop For each chunk
    A-->>H: data: {choices:[{delta:{content:"H"}}]}\\n\\n
    H->>C: data: {"delta":"H"}\\n\\n
  end

  A-->>H: data: [DONE]
  H->>C: event: done\\ndata: {}\\n\\n
  H->>C: end()`} />

          <h3>The seven moving parts</h3>
          <ol>
            <li><strong>Set SSE headers.</strong> <code>Content-Type: text/event-stream</code>, <code>Cache-Control: no-cache</code>, <code>X-Accel-Buffering: no</code> (kills Nginx buffering).</li>
            <li><strong>flushHeaders()</strong> sends the response headers immediately. Without it, the headers stay buffered until the first body bytes — defeating the streaming purpose.</li>
            <li><strong>Write the 2KB padding.</strong> The IIS/browser buffer hack — §6 has the full explanation.</li>
            <li><strong>Read upstream body as a stream.</strong> <code>upstream.body.getReader()</code> gives a <code>ReadableStreamReader</code>. The <code>TextDecoder</code> handles chunk-spanning UTF-8 sequences.</li>
            <li><strong>Parse SSE frames.</strong> Frames are <code>\n\n</code>-delimited. Each frame starts with <code>data:</code> followed by JSON (or <code>[DONE]</code>).</li>
            <li><strong>Forward deltas to the client.</strong> Strip the Azure envelope, re-wrap as a clean <code>{`{ "delta": "..." }`}</code> shape for the frontend.</li>
            <li><strong>Handle client abort.</strong> <code>req.on('close')</code> fires when the browser disconnects; the <code>reader.cancel()</code> tells the upstream to stop generating — saves cost.</li>
          </ol>

          <h3>The buffer-and-parse loop</h3>
          <p>The hairy part of every SSE proxy: SSE frames arrive in CHUNKS, not whole frames. One TCP packet might contain half a frame + half of the next. So:</p>
          <ul>
            <li>Append every incoming chunk to a <code>buffer</code> string.</li>
            <li>Split on <code>\n\n</code>. Everything BEFORE the final boundary is a complete frame; everything AFTER is a partial.</li>
            <li>Process the complete frames; keep the partial as the new buffer.</li>
            <li>Next chunk's data appends to the partial — eventually completing it.</li>
          </ul>

          <p>This pattern (incremental parse with leftover buffer) shows up everywhere in streaming protocols. It's the protocol-parser canonical form.</p>

          <h3>The client side</h3>
          <CodePre>{`// React (sketch)
const res = await fetch('/api/azure-openai/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages })
})
const reader = res.body.getReader()
const decoder = new TextDecoder()
let buffer = ''
while (true) {
  const { value, done } = await reader.read()
  if (done) break
  buffer += decoder.decode(value, { stream: true })
  const frames = buffer.split('\\n\\n')
  buffer = frames.pop() ?? ''
  for (const frame of frames) {
    if (!frame.startsWith('data:')) continue
    const json = JSON.parse(frame.slice(5).trim())
    if (json.delta) appendToOutput(json.delta)
  }
}`}</CodePre>

          <p>Alternative: <code>EventSource</code> works for GET requests, but you need POST for chat. Use <code>fetch</code> + manual parsing.</p>

          <h3>Why not WebSockets</h3>
          <p>SSE is unidirectional (server → client), which is exactly what LLM streaming needs. WebSockets add bidirectional complexity for no benefit. SSE auto-reconnects on disconnect (with <code>EventSource</code>) and works through most proxies without special config. Use SSE for LLM streaming.</p>
        </section>

        <hr />

        {/* SECTION 6 — BUFFER PADDING */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>The IIS Buffer-Padding Trick</h2>
          <p>
            One specific line in Hearth's streaming handler exists because of a deeply annoying behavior in IIS,
            CloudFlare, and several enterprise proxies:
          </p>

          <CodePre>{`res.write(':' + ' '.repeat(2048) + '\\n\\n')`}</CodePre>

          <p>It writes a 2KB SSE "comment" line (SSE comments start with <code>:</code>) padded with spaces. The browser ignores it. Why is it there?</p>

          <h3>The problem</h3>
          <p>
            Some HTTP intermediaries buffer the first ~4KB of response output before forwarding ANY of it to the client.
            They do this because they're trying to compress responses, or because they're doing antivirus inspection, or
            because the upstream HTTP server has a default flush threshold. The result: your streaming endpoint sends
            the first 50 tokens, the proxy sits on them, the client sees nothing for 3 seconds, THEN the buffer flushes
            and 50 tokens dump at once.
          </p>

          <h3>The fix</h3>
          <p>
            Send 2KB of harmless padding immediately after headers. This pushes past the buffer threshold so the proxy
            starts forwarding. Subsequent writes flow through in real time.
          </p>

          <h3>Why an SSE comment</h3>
          <p>
            SSE spec says lines starting with <code>:</code> are "comments" — the receiver should ignore them. So we
            can write whatever we want without confusing the browser's parser. The format
            <code>: &lt;2048 spaces&gt;\n\n</code> is one SSE comment, exactly the size needed.
          </p>

          <h3>Where this matters</h3>
          <ul>
            <li><strong>Azure App Service for Linux</strong>: usually not needed in 2026 — Linux ASE doesn't buffer SSE.</li>
            <li><strong>Azure App Service for Windows (IIS)</strong>: needed. IIS's compression module buffers up to 4KB by default.</li>
            <li><strong>CloudFlare</strong>: needed if you've put CloudFlare in front. Disable buffering with the <code>X-Accel-Buffering: no</code> header AND send the padding (belt and suspenders).</li>
            <li><strong>Nginx with proxy_buffering on</strong>: needed. <code>proxy_buffering off</code> in the location block is the better fix, but if you can't change Nginx config, send the padding.</li>
          </ul>

          <h3>Tuning the padding size</h3>
          <p>2KB is conservative. 1KB works for most proxies. If you're really sure of your stack (Linux ASE direct, no intermediaries), you can skip the padding entirely. The 2KB write costs almost nothing and inoculates against every common proxy.</p>

          <h3>The two other headers in the same fix</h3>
          <CodePre>{`res.setHeader('Cache-Control', 'no-cache, no-transform')
res.setHeader('X-Accel-Buffering', 'no')`}</CodePre>

          <ul>
            <li><strong><code>Cache-Control: no-transform</code></strong> tells intermediaries (especially CloudFlare) not to alter the body — important because some compressors break SSE framing.</li>
            <li><strong><code>X-Accel-Buffering: no</code></strong> is Nginx's explicit "do not buffer" directive. Recognized by Azure Front Door and CloudFlare too.</li>
          </ul>

          <p>Together: padding + X-Accel-Buffering + no-transform = SSE that streams through any modern proxy stack.</p>

          <h3>Diagnosing buffering</h3>
          <p>If you're not sure whether buffering is your problem, open the browser Network tab while hitting the endpoint. Look at the "Transfer-Encoding" header on the response. If it's <code>chunked</code> AND the network panel shows continuous progress bars, streaming works. If you see a single big chunk arriving 3 seconds in, buffering is the issue.</p>
        </section>

        <hr />

        {/* SECTION 7 — TELEMETRY */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Token Counts + Telemetry</h2>
          <p>
            Every response includes a <code>usage</code> object with <code>prompt_tokens</code> +
            <code>completion_tokens</code> + <code>total_tokens</code>. Logging these is the foundation of cost
            tracking (covered in depth in <em>AI Cost Tracking</em>).
          </p>

          <h3>Hearth's normalized response shape</h3>
          <p>The <code>/api/ai-test/gpt5</code> route, for instance, wraps the Azure response in a simpler envelope:</p>

          <CodePre>{`// routes/ai.js (lines 200-210)
const data = await response.json()
res.json({
  content:       data.choices?.[0]?.message?.content ?? '',
  elapsed_ms:    Date.now() - start,
  input_tokens:  data.usage?.prompt_tokens,
  output_tokens: data.usage?.completion_tokens,
  model:         data.model ?? azureOpenAIConfig.deployment,
})`}</CodePre>

          <h3>What to log</h3>
          <ul>
            <li><strong>prompt_tokens</strong> + <strong>completion_tokens</strong>: cost basis.</li>
            <li><strong>elapsed_ms</strong>: latency. Track p50, p95, p99 separately.</li>
            <li><strong>model</strong> (from the response, NOT your config): the actual model that served the request. Useful when deployments are remapped.</li>
            <li><strong>finish_reason</strong>: <code>stop</code> = good. <code>length</code> = you hit max_tokens, response is truncated. <code>content_filter</code> = Azure flagged it.</li>
            <li><strong>id</strong>: unique request ID. Save for support escalations.</li>
          </ul>

          <h3>Streaming token counts</h3>
          <p>The streamed response from Azure includes usage stats only in the FINAL chunk (when <code>finish_reason</code> is set), and only if you opt in via:</p>
          <CodePre>{`body: JSON.stringify({
  messages,
  stream: true,
  stream_options: { include_usage: true }   // ← opt-in for token counts
})`}</CodePre>

          <p>Without <code>stream_options.include_usage</code>, you never see the usage object in streamed responses. Always include it for tracking.</p>

          <h3>Estimating tokens upfront</h3>
          <p>
            If you need a budget estimate before sending the request, count tokens with <code>tiktoken</code> (the
            BPE tokenizer OpenAI uses). One token ≈ 4 chars of English. For exact counts, use the official
            <code>js-tiktoken</code> package and the right encoder for your model.
          </p>
          <CodePre>{`import { encoding_for_model } from 'js-tiktoken'
const enc = encoding_for_model('gpt-5')
const tokens = enc.encode('Hello, world').length`}</CodePre>

          <h3>Latency budget</h3>
          <p>Hearth observes:</p>
          <table>
            <tbody>
              <tr><th>Token count</th><th>Buffered latency</th><th>First-token latency (streaming)</th></tr>
              <tr><td>~50 input, 100 output</td><td>~1.5s</td><td>~400ms</td></tr>
              <tr><td>~500 input, 500 output</td><td>~6s</td><td>~600ms</td></tr>
              <tr><td>~5000 input, 2000 output</td><td>~25s</td><td>~1.2s</td></tr>
            </tbody>
          </table>

          <p>Streaming wins on perceived latency. The 400ms first-token vs 1.5s "everything at once" feels much faster, even though the TOTAL time is similar.</p>

          <h3>Logging shape that doesn't bite later</h3>
          <p>Don't log full prompts to your activity log — they can be huge and may contain user PII. Log:</p>
          <ul>
            <li>Route name</li>
            <li>Token counts (no content)</li>
            <li>Elapsed ms</li>
            <li>Model</li>
            <li>Finish reason</li>
            <li>HTTP status</li>
            <li>Optionally a short hash of the prompt (for "show me re-queries of the same content")</li>
          </ul>

          <p>For full request/response debugging during incidents, save to a separate table you can purge aggressively (7-day retention).</p>
        </section>

        <hr />

        {/* SECTION 8 — PROVIDER COMPARISON */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Provider Comparison</h2>
          <p>The fleet uses three providers across four apps. Each makes a different tradeoff.</p>

          <h3>SecretApp/Hearth → Azure OpenAI (direct REST)</h3>
          <ul>
            <li><strong>+</strong> Microsoft-internal subscription, free Azure credit, easy compliance story.</li>
            <li><strong>+</strong> No SDK dependency = tiny backend bundle.</li>
            <li><strong>+</strong> Streaming SSE works cleanly through Azure App Service Linux.</li>
            <li><strong>−</strong> No automatic retry / backoff (must implement).</li>
            <li><strong>−</strong> No cost cap built in (would need to add).</li>
          </ul>

          <h3>PulseWire → Azure AI Foundry (OpenAI SDK)</h3>
          <ul>
            <li><strong>+</strong> OpenAI-SDK-compatible — use the standard <code>openai</code> npm package.</li>
            <li><strong>+</strong> Multi-model: Azure deployments, OpenAI Foundry hosted, Cohere, Mistral, etc.</li>
            <li><strong>+</strong> Built-in cost tracking + pause infrastructure (PulseWire's <code>withAiCallLog</code> wraps every call).</li>
            <li><strong>+</strong> Evals + hosted prompts in Foundry portal.</li>
            <li><strong>−</strong> 250KB SDK bundle.</li>
            <li><strong>−</strong> First-token latency higher than direct Azure OpenAI (~600ms vs ~400ms).</li>
          </ul>

          <h3>ShopKeep → Anthropic direct (claude-sonnet-4-6 + claude-haiku-4-5)</h3>
          <ul>
            <li><strong>+</strong> Vision is excellent (sonnet for tool photo identification).</li>
            <li><strong>+</strong> <code>web_search</code> tool built-in (used for tool enrichment).</li>
            <li><strong>+</strong> Long context (1M tokens) for tool-database analysis.</li>
            <li><strong>−</strong> No Azure compliance umbrella.</li>
            <li><strong>−</strong> Different error shapes from OpenAI — can't easily switch providers.</li>
          </ul>

          <h3>Sample call shapes side-by-side</h3>
          <CodePre>{`// Azure OpenAI (Hearth — direct REST)
const r = await fetch(\`\${endpoint}openai/deployments/\${dep}/chat/completions?api-version=\${ver}\`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
  body: JSON.stringify({ messages, max_tokens: 2000 })
})

// Azure AI Foundry (PulseWire — OpenAI SDK)
import OpenAI from 'openai'
const client = new OpenAI({ baseURL: endpoint, apiKey })
const r = await client.chat.completions.create({
  model: deploymentName,
  messages,
  max_completion_tokens: 2000
})

// Anthropic (ShopKeep — Anthropic SDK)
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic({ apiKey })
const r = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 2000,
  messages
})`}</CodePre>

          <h3>Cost — same content, different bills</h3>
          <p>For a typical 500-input / 500-output call in 2026:</p>
          <table>
            <tbody>
              <tr><th>Provider/Model</th><th>Input $/1M</th><th>Output $/1M</th><th>Per-call</th></tr>
              <tr><td>Azure OpenAI gpt-5.4 (Hearth)</td><td>$5</td><td>$15</td><td>$0.010</td></tr>
              <tr><td>Foundry gpt-5.4 (PulseWire)</td><td>$5</td><td>$15</td><td>$0.010</td></tr>
              <tr><td>Foundry gpt-4.1</td><td>$2.50</td><td>$10</td><td>$0.0063</td></tr>
              <tr><td>Anthropic claude-sonnet-4-6</td><td>$3</td><td>$15</td><td>$0.009</td></tr>
              <tr><td>Anthropic claude-haiku-4-5</td><td>$0.80</td><td>$4</td><td>$0.0024</td></tr>
            </tbody>
          </table>

          <p>The 4× spread between Haiku and Sonnet/GPT-5 matters at scale. ShopKeep's enrichment flow uses Haiku for the web search + extraction (cheap, frequent) and Sonnet only for vision (rare, requires capability).</p>

          <h3>When to mix providers</h3>
          <p>It's fine to use different providers for different tasks in the same app:</p>
          <ul>
            <li><strong>Vision</strong> → Anthropic Sonnet or GPT-5 (both excellent).</li>
            <li><strong>Cheap classification</strong> → Anthropic Haiku or gpt-4.1.</li>
            <li><strong>Long context (&gt;200k)</strong> → Anthropic (1M tokens).</li>
            <li><strong>Embeddings</strong> → Azure or Voyage (Anthropic doesn't have embedding endpoints).</li>
            <li><strong>web_search tool</strong> → Anthropic (built-in; OpenAI requires custom tool definitions).</li>
          </ul>

          <p>The cost of mixing is two API keys and two error-handling paths. Manageable. The cost of NOT mixing is paying premium prices for cheap tasks.</p>
        </section>

        <hr />

        {/* SECTION 9 — ERRORS */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Errors + Retry</h2>

          <h3>Status codes you'll see</h3>
          <table>
            <tbody>
              <tr><th>Status</th><th>Meaning</th><th>Action</th></tr>
              <tr><td>200</td><td>Success</td><td>—</td></tr>
              <tr><td>400</td><td>Bad request — malformed messages, invalid params</td><td>Don't retry. Log and fix.</td></tr>
              <tr><td>401</td><td>Wrong API key or wrong header (Bearer instead of api-key)</td><td>Don't retry. Check env.</td></tr>
              <tr><td>404</td><td>Deployment doesn't exist or wrong endpoint URL</td><td>Don't retry. Check config.</td></tr>
              <tr><td>429</td><td>Rate limit (TPM or RPM)</td><td>Retry with exponential backoff.</td></tr>
              <tr><td>500/502/503</td><td>Server-side error</td><td>Retry with exponential backoff.</td></tr>
              <tr><td>504</td><td>Gateway timeout — Azure took too long</td><td>Retry once.</td></tr>
            </tbody>
          </table>

          <h3>Content filter rejections</h3>
          <p>Azure has a content filter that can flag prompts OR responses as policy-violating. If the PROMPT is flagged, you get a 400 with a body explaining which category (hate, violence, sexual, self-harm). If the RESPONSE is flagged, you get a 200 with <code>finish_reason: "content_filter"</code> and a partial or empty content.</p>

          <CodePre>{`if (data.choices?.[0]?.finish_reason === 'content_filter') {
  // Response was filtered. Tell the user — don't pretend success.
}`}</CodePre>

          <h3>Reading 429 headers</h3>
          <p>Rate limit responses include headers telling you when to retry:</p>
          <CodePre>{`X-RateLimit-Remaining-Tokens: 0
X-RateLimit-Limit-Tokens: 30000
Retry-After: 7`}</CodePre>

          <p>Respect <code>Retry-After</code> — it's in seconds. Don't hammer.</p>

          <h3>Retry pattern with exponential backoff</h3>
          <CodePre>{`async function callWithRetry(url, body, maxAttempts = 3) {
  let delay = 1000
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(body)
    })
    if (res.ok) return res
    if (res.status >= 500 || res.status === 429) {
      const retryAfter = parseInt(res.headers.get('Retry-After') ?? '0', 10)
      const wait = retryAfter > 0 ? retryAfter * 1000 : delay
      await new Promise(r => setTimeout(r, wait))
      delay *= 2
      continue
    }
    throw new Error(\`HTTP \${res.status}: \${await res.text()}\`)
  }
  throw new Error('Max retries exceeded')
}`}</CodePre>

          <p>
            Three attempts, 1s/2s/4s delays (or whatever <code>Retry-After</code> says, whichever is longer). For
            non-retryable errors (400, 401, 404), throw immediately. For 5xx/429, retry.
          </p>

          <h3>Streaming errors mid-flight</h3>
          <p>What if the upstream connection dies after 50 tokens? You can't restart the stream from token 51. Two options:</p>
          <ul>
            <li><strong>Pass through the partial result.</strong> Send the tokens received so far to the client, plus an error event.</li>
            <li><strong>Restart from scratch.</strong> Discard the partial and re-call with the same prompt. Risk: user sees 50 tokens, then they vanish.</li>
          </ul>

          <p>Hearth chose option 1 (see the <code>error</code> event in §5). It's marginally worse UX but it's faster.</p>

          <h3>Timeout</h3>
          <p>fetch has no default timeout. For a buffered chat call, set one:</p>
          <CodePre>{`const controller = new AbortController()
const timer = setTimeout(() => controller.abort(), 60_000)  // 60s
try {
  const res = await fetch(url, { ..., signal: controller.signal })
  // ...
} finally {
  clearTimeout(timer)
}`}</CodePre>

          <p>For streaming, the timeout should be on FIRST TOKEN (e.g., 10s), not on total response.</p>

          <h3>Logging failed calls</h3>
          <p>Log enough to debug:</p>
          <ul>
            <li>Status code</li>
            <li>Response body (truncated to 1KB)</li>
            <li>Request body (truncated, no PII)</li>
            <li>Elapsed ms before failure</li>
            <li>Attempt number (if retrying)</li>
          </ul>

          <p>Don't log the API key, ever, even partially.</p>
        </section>

        <hr />

        {/* SECTION 10 — API VERSION */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>API Version Pinning</h2>
          <p>
            <code>?api-version=2024-04-01-preview</code> is one of the most consequential strings in your codebase. It
            decides what features you have access to and what response shapes you get back. Pin it; don't drift.
          </p>

          <h3>Why versions exist</h3>
          <p>Azure rolls out new features (vision, parallel tool use, response_format=json_schema, prompt caching, structured outputs) by introducing new preview API versions. Each version is a snapshot of supported features.</p>

          <h3>What changes between versions</h3>
          <table>
            <tbody>
              <tr><th>API Version</th><th>Key features</th></tr>
              <tr><td>2024-02-15-preview</td><td>JSON mode</td></tr>
              <tr><td>2024-04-01-preview (Hearth's pin)</td><td>JSON schema, vision (gpt-4-turbo)</td></tr>
              <tr><td>2024-08-01-preview</td><td>Structured outputs (strict mode), o1 reasoning</td></tr>
              <tr><td>2025-04-01-preview</td><td>Prompt caching, async batch API, gpt-5 family</td></tr>
              <tr><td>2025-10-01-preview</td><td>Tool use orchestration, native MCP</td></tr>
            </tbody>
          </table>

          <h3>Picking a version</h3>
          <ul>
            <li>Newer = more features, more risk of breaking changes.</li>
            <li>Older = stable, missing features.</li>
            <li>"Preview" versions can change without notice (it's right there in the name).</li>
            <li>"GA" versions (non-preview) are stable but lag by ~6 months.</li>
          </ul>

          <p>Hearth pins to <code>2024-04-01-preview</code> because it supports JSON schema (which is what the Plex metadata enrichment uses) and has been stable for two years.</p>

          <h3>Upgrading versions safely</h3>
          <ol>
            <li>Read the Azure release notes for the new version. Look for breaking changes.</li>
            <li>Add a SECOND env var <code>AZURE_OPENAI_API_VERSION_NEW</code>.</li>
            <li>For 10% of traffic (use a deterministic hash), use the new version. Compare response quality + latency.</li>
            <li>If parity, promote the new version to the default.</li>
            <li>If divergence, investigate before promoting.</li>
          </ol>

          <h3>The unwritten rule</h3>
          <p>Don't pass <code>api-version</code> dynamically from the client. The server controls the version pin. Otherwise you're letting users select API behavior — a footgun for breaking changes.</p>
        </section>

        <hr />

        {/* SECTION 11 — LAB */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">★</span>Lab: Build a Streaming Endpoint</h2>
          <p>Build Hearth's streaming endpoint from scratch. By the end you'll have a working SSE proxy to Azure OpenAI in ~80 lines of Express.</p>

          <h3>Setup</h3>
          <ol>
            <li>Have an Azure OpenAI resource provisioned in your subscription.</li>
            <li>Create a deployment of any chat model (e.g., gpt-5 deployed as <code>gpt-5</code>).</li>
            <li>Copy the endpoint + key from <em>Keys and Endpoint</em>.</li>
          </ol>

          <CodePre>{`# .env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_DEPLOYMENT=gpt-5
AZURE_OPENAI_API_VERSION=2024-04-01-preview`}</CodePre>

          <h3>Step 1 — server.js skeleton</h3>
          <CodePre>{`import express from 'express'
import 'dotenv/config'

const app = express()
app.use(express.json())

const cfg = {
  endpoint:   process.env.AZURE_OPENAI_ENDPOINT,
  apiKey:     process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
}

app.listen(3001, () => console.log('listening on 3001'))`}</CodePre>

          <h3>Step 2 — the streaming route</h3>
          <CodePre>{`app.post('/stream', async (req, res) => {
  const url = \`\${cfg.endpoint}openai/deployments/\${cfg.deployment}/chat/completions?api-version=\${cfg.apiVersion}\`

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': cfg.apiKey },
    body: JSON.stringify({
      messages: req.body.messages,
      stream: true,
      stream_options: { include_usage: true },
      max_tokens: 1000
    })
  })
  if (!upstream.ok) {
    return res.status(upstream.status).json({ error: await upstream.text() })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()
  res.write(':' + ' '.repeat(2048) + '\\n\\n')   // ← buffer-bust

  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  req.on('close', () => reader.cancel().catch(() => {}))

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const frames = buffer.split('\\n\\n')
    buffer = frames.pop() ?? ''
    for (const frame of frames) {
      if (!frame.startsWith('data:')) continue
      const payload = frame.slice(5).trim()
      if (payload === '[DONE]') {
        res.write('event: done\\ndata: {}\\n\\n')
        continue
      }
      try {
        const json = JSON.parse(payload)
        const delta = json.choices?.[0]?.delta?.content
        if (delta) res.write(\`data: \${JSON.stringify({ delta })}\\n\\n\`)
        if (json.usage) res.write(\`event: usage\\ndata: \${JSON.stringify(json.usage)}\\n\\n\`)
      } catch {}
    }
  }
  res.end()
})`}</CodePre>

          <h3>Step 3 — a quick client</h3>
          <CodePre>{`<!-- index.html -->
<button id="ask">Ask</button>
<pre id="out"></pre>
<script>
document.getElementById('ask').onclick = async () => {
  const out = document.getElementById('out')
  out.textContent = ''
  const res = await fetch('/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Write a haiku about Plex.' }]
    })
  })
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const frames = buffer.split('\\n\\n')
    buffer = frames.pop()
    for (const frame of frames) {
      if (!frame.startsWith('data:')) continue
      try {
        const json = JSON.parse(frame.slice(5).trim())
        if (json.delta) out.textContent += json.delta
      } catch {}
    }
  }
}
</script>`}</CodePre>

          <h3>What you should see</h3>
          <ol>
            <li>Click "Ask."</li>
            <li>Within ~400ms, characters appear in the <code>&lt;pre&gt;</code>.</li>
            <li>The full haiku writes itself out token by token.</li>
            <li>Check Network tab — type is <code>eventsource</code> or <code>text/event-stream</code>.</li>
            <li>Refresh and watch network panel: chunks arrive continuously, not in one burst.</li>
          </ol>

          <h3>Extensions</h3>
          <ul>
            <li>Add retry-on-429 with exponential backoff.</li>
            <li>Display the final <code>usage</code> event (token counts) to the user.</li>
            <li>Add a "stop" button that aborts the fetch — server should stop too via <code>req.on('close')</code>.</li>
            <li>Log every call to a SQLite <code>ai_calls</code> table.</li>
            <li>Switch the underlying deployment to a vision model and add an image upload to the prompt.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 — TROUBLESHOOTING */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">?</span>Troubleshooting</h2>

          <h3>"401 Unauthorized"</h3>
          <p>Most common cause: using <code>Authorization: Bearer ...</code> instead of <code>api-key: ...</code>. Azure OpenAI is the only OpenAI-compatible API that requires the <code>api-key</code> header.</p>

          <h3>"404 Not Found"</h3>
          <ul>
            <li>Deployment name typo: must match the EXACT name in Azure portal (case-sensitive).</li>
            <li>Endpoint missing trailing slash or has extra path segments.</li>
            <li>Wrong region — endpoint contains the region in the subdomain.</li>
            <li>API version doesn't exist (typo or future date).</li>
          </ul>

          <h3>"The model X has been deprecated"</h3>
          <p>Azure deprecates models on a published schedule. Re-deploy with a newer model behind the same deployment name (no code change), or update <code>AZURE_OPENAI_DEPLOYMENT</code> to a new deployment.</p>

          <h3>"429 Too Many Requests"</h3>
          <p>Your TPM/RPM quota is exhausted. Read the <code>Retry-After</code> header. Long-term: request a quota increase from the Azure portal, or split traffic across regions.</p>

          <h3>"Streaming hangs, then dumps everything at once"</h3>
          <p>Buffering. Three fixes (apply all):</p>
          <ol>
            <li>Send the 2KB padding (<code>res.write(':' + ' '.repeat(2048) + '\\n\\n')</code>).</li>
            <li>Set <code>X-Accel-Buffering: no</code>.</li>
            <li>Set <code>Cache-Control: no-cache, no-transform</code>.</li>
          </ol>

          <h3>"finish_reason is 'length' and response is truncated"</h3>
          <p>You hit <code>max_tokens</code>. Either increase it or summarize your prompt to leave more room for the response.</p>

          <h3>"finish_reason is 'content_filter'"</h3>
          <p>Azure's content filter blocked the response. You can configure filter sensitivity in the Azure portal under "Content filters" — DefaultV2 is the default. Test prompts in the playground to see which category triggered.</p>

          <h3>"Response is in JSON but it's invalid JSON"</h3>
          <p>You forgot <code>response_format: &#123; type: 'json_object' &#125;</code> (or didn't enforce <code>json_schema</code>). The model "tried" JSON but didn't commit. Always pass <code>response_format</code> for structured outputs.</p>

          <h3>"Token counts in streaming are missing"</h3>
          <p>You didn't pass <code>stream_options: &#123; include_usage: true &#125;</code>. The usage comes only in the final chunk.</p>

          <h3>"Calls work locally but fail in App Service"</h3>
          <p>
            App Service environment variables not set, or set in the wrong slot. Verify via the Kudu console with
            <code>printenv | grep AZURE_OPENAI</code>. Also check that App Service can reach
            <code>*.openai.azure.com</code> — if you have VNet integration, the outbound subnet needs that DNS.
          </p>

          <h3>"504 Gateway Timeout"</h3>
          <p>Azure's edge timed out waiting for a model response. For very long prompts/responses, you may need to switch to streaming (which keeps the connection alive token by token) or break the request into pieces.</p>

          <h3>"Cost is way higher than expected"</h3>
          <p>Most often: someone removed the <code>max_tokens</code> cap. The default is "as many as the model wants," which for a chatty prompt can be 4000+ output tokens at $15/1M. Always set <code>max_tokens</code> explicitly.</p>
        </section>

        <hr />

        {/* SECTION 13 — CHEAT SHEET */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Env vars</h3>
          <CodePre>{`AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_VERSION=2024-04-01-preview
AZURE_OPENAI_DEPLOYMENT=gpt-5`}</CodePre>

          <h3>URL pattern</h3>
          <CodePre>{`{endpoint}openai/deployments/{deployment}/chat/completions?api-version={apiVersion}`}</CodePre>

          <h3>Auth header</h3>
          <CodePre>{`api-key: ${'<APIKEY>'}     // ← NOT Authorization: Bearer`}</CodePre>

          <h3>Buffered call</h3>
          <CodePre>{`const r = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
  body: JSON.stringify({
    messages,
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' }   // optional, for JSON
  })
})
const data = await r.json()
const text = data.choices[0].message.content`}</CodePre>

          <h3>Streaming call — server side</h3>
          <CodePre>{`res.setHeader('Content-Type', 'text/event-stream')
res.setHeader('Cache-Control', 'no-cache, no-transform')
res.setHeader('X-Accel-Buffering', 'no')
res.flushHeaders()
res.write(':' + ' '.repeat(2048) + '\\n\\n')   // ← buffer-bust

const reader = upstream.body.getReader()
const decoder = new TextDecoder()
let buffer = ''
req.on('close', () => reader.cancel().catch(() => {}))
while (true) {
  const { value, done } = await reader.read()
  if (done) break
  buffer += decoder.decode(value, { stream: true })
  const frames = buffer.split('\\n\\n')
  buffer = frames.pop() ?? ''
  for (const f of frames) {
    if (!f.startsWith('data:')) continue
    const p = f.slice(5).trim()
    if (p === '[DONE]') continue
    const j = JSON.parse(p)
    const delta = j.choices?.[0]?.delta?.content
    if (delta) res.write(\`data: \${JSON.stringify({ delta })}\\n\\n\`)
  }
}
res.end()`}</CodePre>

          <h3>Token usage in streaming</h3>
          <CodePre>{`stream_options: { include_usage: true }   // usage object in final chunk`}</CodePre>

          <h3>Status codes</h3>
          <table>
            <tbody>
              <tr><th>Status</th><th>Retry?</th></tr>
              <tr><td>200</td><td>—</td></tr>
              <tr><td>400 / 401 / 404</td><td>No (config error)</td></tr>
              <tr><td>429</td><td>Yes (with Retry-After)</td></tr>
              <tr><td>5xx</td><td>Yes (exp. backoff)</td></tr>
            </tbody>
          </table>

          <h3>Three buffer-busting headers</h3>
          <CodePre>{`Content-Type: text/event-stream
Cache-Control: no-cache, no-transform
X-Accel-Buffering: no`}</CodePre>

          <h3>Provider quick-pick</h3>
          <MermaidDiagram theme="default" chart={`graph LR
  Need[What do you need?]
  Need -->|Enterprise SLA + compliance| AOAI[Azure OpenAI]
  Need -->|OpenAI SDK + cost gating| FOUND[Azure AI Foundry]
  Need -->|Vision + web_search| ANT[Anthropic direct]
  Need -->|Bleeding edge first| OPENAI[OpenAI direct]
  style AOAI fill:#5C2A4A,color:#fff`} />

          <h3>The fleet pattern</h3>
          <ul>
            <li>Validate env vars at boot — refuse to start if missing.</li>
            <li>Pin <code>api-version</code> in env. Don't drift.</li>
            <li>Always set <code>max_tokens</code> explicitly.</li>
            <li>Streaming: 2KB padding + 3 headers.</li>
            <li>Log <code>usage</code> + <code>elapsed_ms</code> for every call.</li>
            <li>Don't log full prompts (PII risk).</li>
            <li>Retry only 429 and 5xx, with exp. backoff + Retry-After.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
