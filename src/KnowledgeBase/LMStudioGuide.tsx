import { useRef, useState } from 'react';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'What Is LM Studio?',                 icon: '🧠' },
  { id: 's2',  num: '2',  title: 'System Requirements (Mac)',           icon: '💻' },
  { id: 's3',  num: '3',  title: 'Installation on Mac',                 icon: '📦' },
  { id: 's4',  num: '4',  title: 'App Navigation Tour',                 icon: '🗺️' },
  { id: 's5',  num: '5',  title: 'Downloading Your First Model',        icon: '⬇️' },
  { id: 's6',  num: '6',  title: 'GGUF & Quantization Explained',       icon: '🔬' },
  { id: 's7',  num: '7',  title: 'Loading & Deploying a Model',         icon: '🚀' },
  { id: 's8',  num: '8',  title: 'The Chat Interface',                  icon: '💬' },
  { id: 's9',  num: '9',  title: 'The Local API Server',                icon: '🌐' },
  { id: 's10', num: '10', title: 'Authentication & CORS',               icon: '🔐' },
  { id: 's11', num: '11', title: 'Testing the API',                     icon: '🧪' },
  { id: 's12', num: '12', title: 'Node.js / Express Integration',       icon: '⚙️' },
  { id: 's13', num: '13', title: 'React Frontend Integration',          icon: '⚛️' },
  { id: 's14', num: '14', title: 'Choosing the Right Model',            icon: '🎯' },
  { id: 's15', num: '15', title: 'RAM, GPU & Performance',              icon: '📊' },
  { id: 's16', num: '16', title: 'Troubleshooting',                     icon: '🩺' },
  { id: 's17', num: '★',  title: 'Cheat Sheet',                         icon: '📋' },
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

export default function LMStudioGuide() {
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
              <rect width="28" height="28" rx="8" fill="#166534" />
              <circle cx="14" cy="14" r="7" stroke="white" strokeWidth="2" opacity="0.9" />
              <circle cx="14" cy="14" r="3" fill="white" opacity="0.9" />
              <line x1="14" y1="4" x2="14" y2="8" stroke="white" strokeWidth="2" />
              <line x1="14" y1="20" x2="14" y2="24" stroke="white" strokeWidth="2" />
              <line x1="4" y1="14" x2="8" y2="14" stroke="white" strokeWidth="2" />
              <line x1="20" y1="14" x2="24" y2="14" stroke="white" strokeWidth="2" />
            </svg>
            <span className="sidebar-title">LM Studio</span>
          </div>
          <div className="sidebar-sub">Local AI models on your Mac</div>
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
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`nav-item${readSections.has(s.id) ? ' done' : ''}${currentSection === s.id ? ' active' : ''}`}
                >
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
          <div className="hero-tag">🖥️ LM Studio · Local LLMs on Mac · 2026</div>
          <h1>LM Studio<br />Running AI Models Locally on Your Mac</h1>
          <p>
            LM Studio lets you download and run powerful AI language models entirely on your own machine —
            no API keys, no usage bills, no data leaving your computer. This guide starts from zero: installing
            the app on a Mac, understanding the interface, picking and downloading a model, then deploying it
            as a local HTTP server with an OpenAI-compatible API. By the end you will have LM Studio running
            as a local backend you can call from your Node.js Express routes or React frontend exactly the same
            way you call Azure OpenAI today.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">$0</span><span className="hero-stat-label">Per-token cost</span></div>
            <div className="hero-stat"><span className="hero-stat-val">1234</span><span className="hero-stat-label">Default port</span></div>
            <div className="hero-stat"><span className="hero-stat-val">100%</span><span className="hero-stat-label">Private / offline</span></div>
            <div className="hero-stat"><span className="hero-stat-val">OpenAI</span><span className="hero-stat-label">API compatible</span></div>
          </div>
        </div>

        {/* ── SECTION 1 ── */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>What Is LM Studio?</h2>
          <p>
            LM Studio is a free desktop application for macOS (and Windows / Linux) that lets you download,
            run, and chat with large language models entirely on your own hardware. Think of it as a local
            version of the OpenAI Playground — except the model runs inside your computer and never sends
            your data anywhere. There is no subscription, no API key to buy, and no rate limit.
          </p>

          <h3>The core idea: inference on your machine</h3>
          <p>
            When you type a message to ChatGPT, your words travel to OpenAI's data centres, a GPU cluster
            does the computation, and the response comes back over the internet. That process is called
            <em> inference</em>. LM Studio moves that same inference process to your Mac's CPU and GPU.
            Apple Silicon (M1/M2/M3/M4) is fast enough at inference that you can run surprisingly capable
            models — 7 billion to 14 billion parameters — in real time on a MacBook.
          </p>

          <h3>What you can do with it</h3>
          <ul>
            <li><strong>Chat with a model</strong> — same as ChatGPT but local. Useful for private, sensitive, or proprietary data you don't want to send to a cloud provider.</li>
            <li><strong>Use it as a backend API</strong> — LM Studio exposes an OpenAI-compatible REST server on localhost. Your app sends an HTTP request and gets a response, exactly like calling Azure OpenAI.</li>
            <li><strong>Rapid prototyping</strong> — try a new model in seconds without waiting for cloud access, quota approvals, or billing setup.</li>
            <li><strong>Offline capability</strong> — once the model is downloaded you need no internet connection to run it. Useful on aeroplanes or poor connectivity.</li>
            <li><strong>Experiment with open-source models</strong> — access Llama, Mistral, Qwen, Phi, Gemma, DeepSeek, and hundreds of other models from Hugging Face for free.</li>
          </ul>

          <h3>LM Studio vs cloud AI APIs</h3>
          <table>
            <tbody>
              <tr><th>Factor</th><th>LM Studio (local)</th><th>Azure OpenAI / Anthropic (cloud)</th></tr>
              <tr><td>Cost per token</td><td>$0</td><td>$0.002 – $0.06+ per 1K tokens</td></tr>
              <tr><td>Privacy</td><td>100% — data never leaves your machine</td><td>Data sent to provider's servers</td></tr>
              <tr><td>Model quality</td><td>Good (7B–14B models) to excellent (70B+ with enough RAM)</td><td>State-of-the-art (GPT-5, Claude 4)</td></tr>
              <tr><td>Speed</td><td>10–60 tokens/sec on M-series Mac</td><td>50–200 tokens/sec from cloud GPUs</td></tr>
              <tr><td>Internet required</td><td>Only to download models; inference is offline</td><td>Always</td></tr>
              <tr><td>Rate limits</td><td>None</td><td>RPM / TPM quotas apply</td></tr>
              <tr><td>Setup time</td><td>15–30 minutes first time</td><td>Minutes (API key + env var)</td></tr>
              <tr><td>Best for</td><td>Development, private data, cost control</td><td>Production, cutting-edge quality</td></tr>
            </tbody>
          </table>

          <h3>The mental model</h3>
          <p>
            LM Studio is two things in one: a <strong>desktop chat app</strong> (like a local ChatGPT) and a
            <strong> local HTTP server</strong> that speaks the OpenAI API dialect. When you flip on the
            "Start Server" toggle, port 1234 on your Mac starts accepting requests identical in shape to
            the ones you send to <code>https://api.openai.com/v1/chat/completions</code>. Your Node.js or
            React code needs almost no changes to switch between cloud and local.
          </p>

          <h3>Key terminology</h3>
          <table>
            <tbody>
              <tr><th>Term</th><th>What it means</th></tr>
              <tr><td>Model</td><td>A trained neural network — billions of numbers (weights) that have learned to predict text. Examples: Llama 3.2, Mistral 7B, Qwen2.5.</td></tr>
              <tr><td>Parameters (B)</td><td>The count of learnable numbers in the model. 7B = 7 billion. More parameters generally = smarter but slower and bigger.</td></tr>
              <tr><td>GGUF</td><td>The file format LM Studio uses. One file contains the entire model in a compressed form. Can be 2 GB to 70+ GB.</td></tr>
              <tr><td>Quantization</td><td>Lossy compression applied to model weights to make the file smaller. Q4_K_M means 4-bit quantization. Lower bits = smaller file, slightly lower quality.</td></tr>
              <tr><td>Context window</td><td>How many tokens the model can "see" at once (its working memory). 4096, 8192, 32768, or 128K tokens. Bigger context uses more RAM.</td></tr>
              <tr><td>Tokens</td><td>The chunks text is split into before feeding to the model. Roughly 1 token ≈ 0.75 English words. "Hello world" is 2 tokens.</td></tr>
              <tr><td>Inference</td><td>The act of running the model to generate a response. Requires reading all model weights through the CPU/GPU.</td></tr>
              <tr><td>GPU offloading</td><td>Moving model layers to the GPU's memory for faster computation. On Apple Silicon, this uses the unified memory pool.</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ── SECTION 2 ── */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>System Requirements (Mac)</h2>
          <p>
            LM Studio runs on any modern Mac, but how large a model you can run — and how fast — depends
            heavily on your chip and how much RAM you have.
          </p>

          <h3>Apple Silicon vs Intel Mac</h3>
          <p>
            <strong>Apple Silicon (M1 / M2 / M3 / M4) is strongly recommended.</strong> The reason is
            unified memory: the CPU and GPU share the same physical RAM pool, so LM Studio can offload
            model layers to the GPU without copying data. A 16 GB M2 MacBook Air can run a 13B-parameter
            model at 15–25 tokens per second — genuinely useful for development.
          </p>
          <p>
            On an Intel Mac, LM Studio runs CPU-only. Intel Macs also cap out at 64 GB RAM in the best
            configurations (2019 Mac Pro). CPU-only inference is 3–10× slower than Apple Silicon GPU
            offloading, so you'll want to use smaller models (3B–7B).
          </p>

          <h3>RAM requirements by model size</h3>
          <table>
            <tbody>
              <tr><th>Your Mac's RAM</th><th>Max model you can run comfortably</th><th>Practical examples</th></tr>
              <tr><td>8 GB</td><td>7B parameters (Q4 quantization)</td><td>Llama 3.2 3B, Phi-3.5 Mini, Mistral 7B Q4</td></tr>
              <tr><td>16 GB</td><td>13B parameters (Q4) or 7B (Q8)</td><td>Llama 3.1 8B Q8, Qwen2.5 14B Q4, Mistral 7B Q6</td></tr>
              <tr><td>32 GB</td><td>30B parameters (Q4) or 14B (Q8)</td><td>Llama 3.3 70B Q2, Mistral Small 22B Q5, Qwen2.5 32B Q4</td></tr>
              <tr><td>48 GB</td><td>70B parameters (Q4)</td><td>Llama 3.3 70B Q4, Qwen2.5 72B Q3</td></tr>
              <tr><td>64 GB+</td><td>70B+ parameters (Q8) or 100B+</td><td>Llama 3.3 70B Q8, DeepSeek 67B Q4</td></tr>
            </tbody>
          </table>
          <p>
            <strong>Rule of thumb:</strong> the model file size (in GB) plus about 2 GB for the OS and LM
            Studio itself is roughly the RAM you need. A 4.1 GB GGUF file needs about 6 GB of available RAM.
          </p>

          <h3>Storage requirements</h3>
          <p>
            Models are stored on disk and loaded into RAM when you use them. Budget disk space accordingly:
          </p>
          <ul>
            <li><strong>Small models (1B–3B):</strong> 0.6 GB – 2 GB per model</li>
            <li><strong>Mid-size models (7B–8B):</strong> 3 GB – 8 GB per model</li>
            <li><strong>Large models (13B–14B):</strong> 7 GB – 15 GB per model</li>
            <li><strong>Very large models (34B–70B):</strong> 20 GB – 50 GB per model</li>
          </ul>
          <p>
            Having 50 GB free on your SSD is a reasonable starting budget if you want to experiment with
            several models without constantly deleting old ones.
          </p>

          <h3>macOS version</h3>
          <p>
            LM Studio 0.3.x requires <strong>macOS 13 Ventura or later</strong>. If you're on Sonoma
            (14.x) or Sequoia (15.x) you'll have no issues. Older macOS versions are not supported.
            Run <code>Apple menu → About This Mac</code> to check your version.
          </p>

          <h3>What you do NOT need</h3>
          <ul>
            <li>A discrete GPU (Apple Silicon's GPU is integrated and accessible via Metal)</li>
            <li>An internet connection after models are downloaded</li>
            <li>Admin privileges (LM Studio installs to your user Applications folder)</li>
            <li>Docker or any other runtime</li>
            <li>An API key or account with any provider</li>
          </ul>
        </section>

        <hr />

        {/* ── SECTION 3 ── */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Installation on Mac</h2>
          <p>
            Installing LM Studio is straightforward — it is a standard macOS application distributed as
            a <code>.dmg</code> disk image.
          </p>

          <h3>Step 1 — Download</h3>
          <p>
            Go to <strong>lmstudio.ai</strong> in your browser and click the
            <strong> Download for Mac</strong> button. The site auto-detects whether you have Apple Silicon
            or Intel and offers the correct build. Make sure you download the right one:
          </p>
          <ul>
            <li><strong>Apple Silicon (M-chip):</strong> filename contains <code>arm64</code></li>
            <li><strong>Intel Mac:</strong> filename contains <code>x64</code></li>
          </ul>
          <p>
            If you are unsure which chip you have: go to <strong>Apple menu → About This Mac</strong>.
            Under the chip line it will say either "Apple M1" (or M2/M3/M4) or "Intel Core i5/i7/i9".
          </p>
          <p>
            The download is around 300–500 MB depending on the version. Once it finishes you will have a
            file like <code>LM-Studio-0.3.x-arm64.dmg</code> in your Downloads folder.
          </p>

          <h3>Step 2 — Install</h3>
          <ol>
            <li>Open the <code>.dmg</code> file by double-clicking it in Finder or your downloads bar.</li>
            <li>A window appears showing the LM Studio icon and an <strong>Applications</strong> folder shortcut.</li>
            <li>Drag the LM Studio icon onto the Applications folder. macOS copies the app.</li>
            <li>Eject the disk image (drag it to Trash, or right-click → Eject).</li>
            <li>Open your <strong>Applications</strong> folder and double-click LM Studio to launch it.</li>
          </ol>

          <h3>Step 3 — First-launch security warning</h3>
          <p>
            macOS Gatekeeper will show a warning the first time you open an app downloaded from the internet.
            You will see a dialog like <em>"LM Studio cannot be opened because it is from an unidentified
            developer"</em> or <em>"LM Studio is an app downloaded from the internet. Are you sure you want
            to open it?"</em>
          </p>
          <p>
            To allow it, go to <strong>System Settings → Privacy &amp; Security</strong> and scroll down
            until you see a message about LM Studio being blocked. Click <strong>Open Anyway</strong>.
            macOS will ask for your password to confirm. After this one-time approval, LM Studio opens
            normally every time.
          </p>
          <p>
            Alternatively, right-click (or Control-click) the app icon in Applications and choose
            <strong> Open</strong> from the context menu — this also bypasses Gatekeeper with a one-time
            confirmation.
          </p>

          <h3>Step 4 — First launch wizard</h3>
          <p>
            When LM Studio opens for the first time you'll be greeted by a brief onboarding wizard:
          </p>
          <ol>
            <li><strong>Welcome screen</strong> — click Get Started.</li>
            <li><strong>Model storage location</strong> — choose where models will be saved. The default is
              <code>~/Library/Application Support/LM Studio/models/</code>. You can change this to an
              external drive or a different path if you want to save internal SSD space. This can be
              changed later in Settings.</li>
            <li><strong>Privacy notice</strong> — LM Studio describes what telemetry (if any) is collected.
              You can opt out.</li>
            <li>The main app window opens. You're done.</li>
          </ol>

          <h3>Where LM Studio stores data</h3>
          <table>
            <tbody>
              <tr><th>What</th><th>Default path</th></tr>
              <tr><td>Models (GGUF files)</td><td><code>~/Library/Application Support/LM Studio/models/</code></td></tr>
              <tr><td>App settings</td><td><code>~/Library/Application Support/LM Studio/</code></td></tr>
              <tr><td>Chat history</td><td>Stored within the app's support directory</td></tr>
              <tr><td>Server config</td><td>Saved in app settings, persists between launches</td></tr>
            </tbody>
          </table>

          <h3>Keeping LM Studio updated</h3>
          <p>
            LM Studio checks for updates automatically. When an update is available, you'll see a banner in
            the app. Click <strong>Update</strong> to download and install the new version. Your downloaded
            models are never affected by updates — they stay in the models folder.
          </p>

          <h3>Uninstalling</h3>
          <p>
            Drag LM Studio from Applications to Trash. To also remove all downloaded models and settings,
            delete <code>~/Library/Application Support/LM Studio/</code> in Finder
            (use <strong>Go → Go to Folder…</strong> in the Finder menu bar to navigate there).
          </p>
        </section>

        <hr />

        {/* ── SECTION 4 ── */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>App Navigation Tour</h2>
          <p>
            LM Studio's interface is a sidebar-plus-main-content layout. The left sidebar has five primary
            icons stacked vertically; clicking each one switches the main panel.
          </p>

          <h3>The five main panels</h3>

          <h4>1. Chat (speech bubble icon)</h4>
          <p>
            The <strong>Chat</strong> panel is LM Studio's built-in conversation interface — think of it as
            a local ChatGPT. You select a model at the top, type messages in the text area at the bottom,
            and the model responds. Key things to know about the Chat panel:
          </p>
          <ul>
            <li><strong>Model selector dropdown</strong> — top of the panel. Only shows models you have already downloaded. Click it to switch models mid-conversation.</li>
            <li><strong>Conversation history</strong> — left column when you expand the sidebar. Each conversation is saved. Click <strong>New Chat</strong> to start fresh.</li>
            <li><strong>System Prompt</strong> — a collapsible section above the input area. Text you put here becomes the model's "personality" and instructions. E.g. "You are a helpful coding assistant. Keep answers concise."</li>
            <li><strong>Model parameters panel</strong> — right sidebar. Shows temperature, top-p, top-k, max tokens, and other generation settings. You can adjust these live.</li>
            <li><strong>Send button vs Enter key</strong> — by default, Enter sends the message. Use Shift+Enter for a newline.</li>
          </ul>

          <h4>2. Discover (compass / search icon)</h4>
          <p>
            The <strong>Discover</strong> panel (sometimes called "Search" or "Browse Models") is where you
            find and download models. It connects to Hugging Face's model repository and shows you curated
            recommendations. This is covered in detail in Section 5.
          </p>

          <h4>3. My Models (library / stack icon)</h4>
          <p>
            The <strong>My Models</strong> panel lists every GGUF file LM Studio knows about on your disk.
            From here you can:
          </p>
          <ul>
            <li>See the file size and disk location of each model</li>
            <li>Delete models you no longer need (right-click → Delete, or the trash icon)</li>
            <li>Reveal the model file in Finder</li>
            <li>Import a model you downloaded manually (drag-and-drop or "Add Model" button)</li>
          </ul>

          <h4>4. Developer / API Server (code or server icon)</h4>
          <p>
            The <strong>Developer</strong> panel is where you turn LM Studio into a local HTTP server. This
            is the most important panel for integrating with your app. It has:
          </p>
          <ul>
            <li><strong>Start Server toggle</strong> — one click to start or stop the local API server.</li>
            <li><strong>Model loader</strong> — a separate model selector for the server. The server can have a different model loaded than the Chat panel.</li>
            <li><strong>Port field</strong> — default 1234. Change it if something else is using that port.</li>
            <li><strong>Server log</strong> — a live feed of every request and response, including latency and token counts. Essential for debugging.</li>
            <li><strong>Settings tabs</strong> — control CORS, API key, network binding, and other server-level options.</li>
          </ul>

          <h4>5. Settings (gear icon)</h4>
          <p>
            The <strong>Settings</strong> panel covers:
          </p>
          <ul>
            <li><strong>Models path</strong> — change where GGUF files are stored on disk</li>
            <li><strong>Default model parameters</strong> — set global defaults for temperature, context length, etc.</li>
            <li><strong>GPU acceleration</strong> — toggle Metal (Apple Silicon GPU) usage on/off</li>
            <li><strong>Theme</strong> — light or dark mode</li>
            <li><strong>Updates</strong> — check for new versions manually</li>
            <li><strong>Diagnostics</strong> — system info, loaded model status, memory usage</li>
          </ul>

          <h3>The bottom status bar</h3>
          <p>
            At the very bottom of the window, LM Studio shows real-time stats:
          </p>
          <ul>
            <li><strong>Currently loaded model</strong> — the name of the model in memory right now</li>
            <li><strong>RAM usage</strong> — how much RAM the model is consuming</li>
            <li><strong>Tokens/sec</strong> — current inference speed (visible while generating a response)</li>
            <li><strong>GPU layers</strong> — how many transformer layers are running on the GPU vs CPU</li>
            <li><strong>Server status</strong> — green dot if the API server is running</li>
          </ul>

          <h3>Keyboard shortcuts worth knowing</h3>
          <table>
            <tbody>
              <tr><th>Shortcut</th><th>Action</th></tr>
              <tr><td>Cmd + N</td><td>New chat</td></tr>
              <tr><td>Cmd + ,</td><td>Open Settings</td></tr>
              <tr><td>Enter</td><td>Send message</td></tr>
              <tr><td>Shift + Enter</td><td>Insert newline</td></tr>
              <tr><td>Cmd + K</td><td>Clear current chat</td></tr>
              <tr><td>Esc</td><td>Stop generation</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ── SECTION 5 ── */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Downloading Your First Model</h2>
          <p>
            LM Studio's Discover panel connects to Hugging Face and gives you a searchable, curated browser
            for open-source models. This is by far the easiest way to get models — no account needed.
          </p>

          <h3>Step 1 — Open Discover</h3>
          <p>
            Click the compass/search icon in the left sidebar. The panel loads a list of featured and
            trending models. At the top there is a search bar.
          </p>

          <h3>Step 2 — Find a model</h3>
          <p>
            For your first model, search for <strong>"Llama 3.2 3B Instruct"</strong> — it's an excellent
            starting point. It runs on any Mac with 8 GB RAM, responds quickly, follows instructions well,
            and is capable enough for real tasks. Type it in the search bar and press Enter.
          </p>
          <p>
            You'll see several results. The top result is usually from <code>lmstudio-community</code> on
            Hugging Face — these are LM Studio-curated builds with pre-selected quantizations and verified
            settings. Start with one of these.
          </p>

          <h3>Step 3 — Understand the file listing</h3>
          <p>
            When you click on a model result, you see a list of files. Each file is a different
            quantization variant of the same model. You'll see names like:
          </p>
          <ul>
            <li><code>Llama-3.2-3B-Instruct-Q4_K_M.gguf</code> — 4-bit quantization, medium variant (recommended for 8 GB RAM)</li>
            <li><code>Llama-3.2-3B-Instruct-Q8_0.gguf</code> — 8-bit quantization (better quality, needs more RAM)</li>
            <li><code>Llama-3.2-3B-Instruct-Q2_K.gguf</code> — 2-bit quantization (smallest, lowest quality)</li>
          </ul>
          <p>
            The file sizes are shown next to each variant. Pick one that fits in your available RAM
            with about 2 GB to spare (the OS and LM Studio itself need some memory).
          </p>

          <h3>Step 4 — Download</h3>
          <p>
            Click the <strong>Download</strong> button next to your chosen file. A progress bar appears.
            Download speed depends on your internet connection — a 2 GB file on a fast connection takes
            about 2–5 minutes.
          </p>
          <p>
            You can continue browsing or even start a chat with an already-loaded model while downloading.
            Downloads run in the background.
          </p>

          <h3>Step 5 — Verify in My Models</h3>
          <p>
            Once the download completes, click the <strong>My Models</strong> icon in the sidebar. Your new
            model appears in the list with its file path and size. It is ready to use.
          </p>

          <h3>Recommended first models by RAM</h3>
          <table>
            <tbody>
              <tr><th>Available RAM</th><th>Recommended first model</th><th>Approx. size</th><th>Speed (M2 chip)</th></tr>
              <tr><td>8 GB</td><td>Llama 3.2 3B Instruct Q4_K_M</td><td>~2 GB</td><td>~40 tok/s</td></tr>
              <tr><td>8 GB</td><td>Phi-3.5 Mini Instruct Q4_K_M</td><td>~2.4 GB</td><td>~35 tok/s</td></tr>
              <tr><td>16 GB</td><td>Llama 3.1 8B Instruct Q4_K_M</td><td>~4.7 GB</td><td>~35 tok/s</td></tr>
              <tr><td>16 GB</td><td>Mistral 7B Instruct v0.3 Q6_K</td><td>~5.4 GB</td><td>~30 tok/s</td></tr>
              <tr><td>32 GB</td><td>Qwen2.5 14B Instruct Q5_K_M</td><td>~10 GB</td><td>~20 tok/s</td></tr>
              <tr><td>32 GB</td><td>Llama 3.3 70B Instruct Q2_K</td><td>~27 GB</td><td>~8 tok/s</td></tr>
            </tbody>
          </table>

          <h3>Adding a model you already have</h3>
          <p>
            If you downloaded a <code>.gguf</code> file manually from Hugging Face or another source:
          </p>
          <ol>
            <li>Go to <strong>My Models</strong></li>
            <li>Click <strong>Import Model</strong> or simply drag the <code>.gguf</code> file into the panel</li>
            <li>LM Studio copies it to the models folder (or you can choose to link to it in place)</li>
          </ol>

          <h3>Managing disk space</h3>
          <p>
            Models take significant disk space. To delete a model you no longer need: go to
            <strong> My Models</strong>, hover over the model, and click the trash icon. This permanently
            deletes the GGUF file from disk. You can always re-download it later for free.
          </p>
        </section>

        <hr />

        {/* ── SECTION 6 ── */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>GGUF &amp; Quantization Explained</h2>
          <p>
            When you browse models in LM Studio you will always encounter GGUF files and quantization names
            like Q4_K_M or Q8_0. Understanding these terms helps you choose the right variant for your
            hardware without just guessing.
          </p>

          <h3>What is GGUF?</h3>
          <p>
            GGUF (GPT-Generated Unified Format) is a binary file format for storing the weights of a language
            model. It was created by the <code>llama.cpp</code> project (which LM Studio uses under the
            hood) as a self-contained, portable model format.
          </p>
          <p>
            Before GGUF there was GGML (its predecessor) and various other formats like PyTorch checkpoints,
            safetensors, and ONNX. GGUF replaced GGML in 2023 and is now the standard format for
            CPU/GPU inference with llama.cpp. It packs the model architecture, all weight tensors, and
            metadata (tokenizer, vocabulary, context length, quantization info) into a single file.
          </p>
          <p>
            <strong>One GGUF file = one self-contained, runnable model.</strong> You don't need Python,
            Torch, CUDA, or any other runtime. LM Studio (via llama.cpp) can load and run it directly.
          </p>

          <h3>What is quantization?</h3>
          <p>
            A trained model's weights are originally stored as 16-bit or 32-bit floating-point numbers
            (FP16 or FP32). A 7-billion-parameter model in FP16 requires about 14 GB of RAM — too much
            for most consumer hardware.
          </p>
          <p>
            Quantization is a technique that reduces the precision of those numbers. Instead of storing each
            weight as a 16-bit float, you represent it with a 4-bit or 8-bit integer. This reduces memory
            usage by 2–4× with only a modest quality drop. The model "loses" some fine-grained information,
            but for most conversational and coding tasks the difference is hard to notice.
          </p>

          <h3>Decoding the quantization naming scheme</h3>
          <p>
            File names like <code>Q4_K_M</code> follow this pattern:
          </p>
          <ul>
            <li><strong>Q4</strong> — the number of bits per weight (4-bit in this case)</li>
            <li><strong>_K</strong> — "K-quant" method, which is smarter than older schemes: it uses a different bit depth for different layers based on their importance</li>
            <li><strong>_M</strong> — the size variant of K-quants: S (small), M (medium), L (large). M is the default balance of size and quality</li>
          </ul>
          <p>
            So <code>Q4_K_M</code> means: 4-bit quantization, K-quant method, medium variant. It is
            the most common recommendation and a safe default for most hardware.
          </p>

          <h3>Quantization comparison table</h3>
          <table>
            <tbody>
              <tr><th>Name</th><th>Bits per weight</th><th>Quality vs FP16</th><th>Size vs FP16</th><th>When to use</th></tr>
              <tr><td>Q2_K</td><td>~2.6 bits</td><td>Noticeable degradation</td><td>~18%</td><td>Extreme memory constraint only</td></tr>
              <tr><td>Q3_K_M</td><td>~3.4 bits</td><td>Visible but acceptable</td><td>~23%</td><td>8 GB RAM, bigger model</td></tr>
              <tr><td>Q4_0</td><td>4 bits</td><td>Good</td><td>~28%</td><td>Older format; prefer Q4_K_M</td></tr>
              <tr><td>Q4_K_M</td><td>~4.5 bits</td><td>Very good</td><td>~31%</td><td>Best general-purpose choice</td></tr>
              <tr><td>Q5_K_M</td><td>~5.7 bits</td><td>Excellent</td><td>~38%</td><td>16+ GB RAM, quality priority</td></tr>
              <tr><td>Q6_K</td><td>~6.6 bits</td><td>Near-FP16</td><td>~44%</td><td>32+ GB RAM, max quality in int range</td></tr>
              <tr><td>Q8_0</td><td>8 bits</td><td>Virtually identical to FP16</td><td>~53%</td><td>When you have plenty of RAM</td></tr>
              <tr><td>F16</td><td>16 bits</td><td>Reference quality</td><td>100%</td><td>Fine-tuning / research only</td></tr>
            </tbody>
          </table>

          <h3>Practical picking guide</h3>
          <p>
            Use this flowchart mentally:
          </p>
          <ol>
            <li>Figure out how much free RAM you have (close other apps, check Activity Monitor)</li>
            <li>Pick the largest model that fits (Q4_K_M file size should be ≤ available RAM minus 2 GB)</li>
            <li>If you have headroom, upgrade to Q5_K_M or Q6_K for better quality</li>
            <li>Only go to Q2 or Q3 if you genuinely can't fit a Q4 model</li>
          </ol>
          <p>
            For most developers on 16 GB M-series Macs: <strong>Llama 3.1 8B Q4_K_M</strong> or
            <strong> Mistral 7B Q5_K_M</strong> are the sweet spot — genuinely capable for coding help,
            summarization, and chat, running at 20–40 tokens per second.
          </p>

          <h3>Where quantization does NOT matter</h3>
          <p>
            For integration testing (making sure your API calls work, that your frontend renders
            responses, that your streaming handler works correctly), use the smallest, fastest model
            you have. Q2 is fine for those tests — you're checking your code, not the model's quality.
          </p>
        </section>

        <hr />

        {/* ── SECTION 7 ── */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Loading &amp; Deploying a Model</h2>
          <p>
            "Deploying" a model in LM Studio means loading it into RAM so it can accept requests. There are
            two contexts to load a model: the <strong>Chat panel</strong> (for interactive conversation) and
            the <strong>Developer panel</strong> (for the API server). They can have different models
            loaded simultaneously.
          </p>

          <h3>Loading a model in the Chat panel</h3>
          <ol>
            <li>Click the <strong>Chat</strong> icon in the sidebar.</li>
            <li>At the top of the main area, click the model selector dropdown (it will say "Select a model to load" if none is loaded).</li>
            <li>A search box and list of your downloaded models appears. Click the one you want.</li>
            <li>LM Studio begins loading the model into RAM. A progress indicator shows loading status. For a 4 GB model on an M2 Mac this takes about 3–8 seconds.</li>
            <li>Once loaded, the bottom status bar shows the model name and RAM usage. You can now type and chat.</li>
          </ol>

          <h3>Loading a model in the Developer panel (for API access)</h3>
          <ol>
            <li>Click the <strong>Developer</strong> icon in the sidebar (code brackets or server icon).</li>
            <li>At the top, use the model loader to select which model the API server will use. The process is the same as in Chat — click the dropdown and choose a model.</li>
            <li>Wait for it to load (you'll see RAM usage increase in the status bar).</li>
            <li>Toggle <strong>Start Server</strong>. The toggle turns green and the server log shows "Server started on port 1234".</li>
          </ol>

          <h3>Model configuration settings</h3>
          <p>
            Before or after loading, you can tune how the model behaves. These settings appear in the right
            panel in Chat, or in the Developer panel under "Model Configuration":
          </p>
          <table>
            <tbody>
              <tr><th>Setting</th><th>What it controls</th><th>Typical range</th><th>Default</th></tr>
              <tr><td>Temperature</td><td>Randomness of outputs. Higher = more creative/varied. Lower = more predictable.</td><td>0.0 – 2.0</td><td>0.7 – 1.0</td></tr>
              <tr><td>Top-P (nucleus sampling)</td><td>Probability mass to consider. 0.9 = consider the top 90% most likely tokens.</td><td>0.0 – 1.0</td><td>0.95</td></tr>
              <tr><td>Top-K</td><td>Candidate pool size. 40 = only pick from the 40 most likely next tokens.</td><td>1 – 200</td><td>40</td></tr>
              <tr><td>Max Tokens</td><td>Maximum response length. -1 = unlimited (use model's context max).</td><td>-1 – 32768</td><td>-1</td></tr>
              <tr><td>Context Length</td><td>How many tokens the model "sees" at once. Larger uses more RAM.</td><td>512 – 128K</td><td>Model-specific</td></tr>
              <tr><td>GPU Layers</td><td>How many transformer layers to offload to the GPU. -1 = all (recommended on Apple Silicon).</td><td>-1 – model-specific</td><td>-1</td></tr>
              <tr><td>Repeat Penalty</td><td>Discourages the model from repeating the same phrases. 1.1 is a mild penalty.</td><td>1.0 – 1.5</td><td>1.1</td></tr>
            </tbody>
          </table>

          <h3>GPU offloading explained</h3>
          <p>
            On Apple Silicon, the CPU and GPU share unified memory. LM Studio can "offload" transformer
            layers to the GPU, which speeds up inference significantly because the GPU processes matrix
            multiplications much faster than the CPU.
          </p>
          <p>
            Set <strong>GPU Layers to -1</strong> to let LM Studio automatically offload as many layers as
            will fit in GPU memory. For most models on 16 GB+ M-series Macs, this means all layers run on
            the GPU and you get maximum speed. If you're tight on RAM, reduce the GPU layers count — lower
            layers run on CPU, using less VRAM at the cost of speed.
          </p>

          <h3>Switching models</h3>
          <p>
            Only one model can be loaded at a time per context (Chat or Server). To switch:
          </p>
          <ol>
            <li>Click the model selector dropdown in the relevant panel</li>
            <li>Choose a different model</li>
            <li>LM Studio unloads the current model (freeing RAM) and loads the new one</li>
          </ol>
          <p>
            The Chat and Developer panels each maintain their own loaded model independently. So you
            can have Llama 3.1 8B in the Chat panel for interactive use and Phi-3.5 Mini in the Developer
            panel for your API server, both running simultaneously (if you have enough RAM for both).
          </p>

          <h3>Checking that the model loaded correctly</h3>
          <ul>
            <li>The bottom status bar shows the model name and RAM consumption</li>
            <li>In the Developer panel, the server log shows the model identifier after "Model loaded:"</li>
            <li>Calling <code>GET http://localhost:1234/v1/models</code> returns a JSON list including your loaded model</li>
          </ul>
        </section>

        <hr />

        {/* ── SECTION 8 ── */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>The Chat Interface</h2>
          <p>
            Before wiring up API calls, spend time in the Chat panel to understand how the model behaves.
            It's the fastest feedback loop: no code, no HTTP, just type and read.
          </p>

          <h3>System prompts</h3>
          <p>
            The system prompt is the most powerful tool you have for shaping model behaviour. It appears
            at the top of the conversation history (before any user messages) and the model treats it as
            its core instructions.
          </p>
          <p>
            In LM Studio's Chat panel, there is a <strong>"System Prompt"</strong> field above the main
            chat area (it may be collapsed — click to expand). Type your instructions there. Examples:
          </p>

          <CodePre>{`# For a coding assistant
You are an expert JavaScript and TypeScript developer.
Answer questions concisely with working code examples.
When asked to generate code, output only the code block with a brief explanation.
Do not add unnecessary caveats or disclaimers.`}</CodePre>

          <CodePre>{`# For a document summarizer
You are a precise document summarizer.
When given text, return a structured summary with:
- A one-sentence TL;DR
- 3-5 key bullet points
- Any action items or decisions
Keep summaries factual and neutral. Do not add your own opinions.`}</CodePre>

          <h3>Multi-turn conversation</h3>
          <p>
            Like ChatGPT, LM Studio's Chat panel maintains conversation history. Each exchange
            (user message + assistant response) is appended to the context. The model "remembers" earlier
            parts of the conversation for as long as it fits in the context window.
          </p>
          <p>
            <strong>Context limit warning:</strong> if a conversation grows very long, older messages
            will eventually be truncated when they exceed the context window. You'll notice the model
            stops referring to early parts of the conversation. Start a new chat to reset.
          </p>

          <h3>Adjusting parameters mid-conversation</h3>
          <p>
            You can change temperature, max tokens, and other settings from the right sidebar while
            a conversation is in progress. New messages use the updated settings; previous responses are
            unaffected.
          </p>

          <h3>Regenerating a response</h3>
          <p>
            If the model gives a bad response, hover over the response bubble and click the
            <strong> Regenerate</strong> (refresh) icon. LM Studio re-runs inference with the same prompt
            but a new random seed, producing a different answer. Useful when the model got confused or
            went off-track.
          </p>

          <h3>Editing your messages</h3>
          <p>
            Hover over your sent message and click the edit icon. Modify the text and click
            <strong> Save</strong>. LM Studio trims the conversation back to just before that message and
            regenerates from there. This is useful for iterating on a prompt without scrolling back and
            starting over.
          </p>

          <h3>JSON mode / structured output</h3>
          <p>
            Many models support a mode where they guarantee their response is valid JSON. In LM Studio,
            look for a <strong>"Response Format"</strong> dropdown in the settings panel — choose
            "JSON Object" to enable this. It's equivalent to the <code>response_format</code> parameter
            in the OpenAI API:
          </p>
          <CodePre>{`{
  "response_format": { "type": "json_object" }
}`}</CodePre>
          <p>
            When JSON mode is on, the model won't output any prose — only a JSON object. Your system prompt
            should describe the exact JSON shape you expect.
          </p>

          <h3>What to test before writing API code</h3>
          <p>
            Use the Chat panel to verify:
          </p>
          <ol>
            <li><strong>Does the model follow your system prompt?</strong> — paste your intended system prompt and check.</li>
            <li><strong>Does it stay within the context you care about?</strong> — send a few complex exchanges.</li>
            <li><strong>How is the latency?</strong> — is it fast enough for your use case?</li>
            <li><strong>Does it produce the right output format?</strong> — especially important if you expect JSON or structured data.</li>
          </ol>
          <p>
            Once you're satisfied with the model's behavior in Chat, switching to API mode produces
            identical results (same model, same parameters).
          </p>
        </section>

        <hr />

        {/* ── SECTION 9 ── */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>The Local API Server</h2>
          <p>
            This is the feature that makes LM Studio truly powerful for developers. When you enable the
            server in the Developer panel, LM Studio starts an HTTP server on your Mac that speaks the
            OpenAI API dialect. Your code sends the exact same JSON payloads it would send to Azure OpenAI
            or api.openai.com — just to a different base URL.
          </p>

          <h3>Starting the server</h3>
          <ol>
            <li>Open the <strong>Developer</strong> panel (code icon in the sidebar).</li>
            <li>Select the model you want to serve from the model dropdown at the top and wait for it to load.</li>
            <li>Click the <strong>Start Server</strong> toggle or button. It turns green.</li>
            <li>The server log shows: <code>Server running at http://localhost:1234</code></li>
          </ol>
          <p>
            The server stays running until you toggle it off or quit LM Studio. It persists across
            different chats in the Chat panel.
          </p>

          <h3>The base URL</h3>
          <CodePre>{`http://localhost:1234/v1`}</CodePre>
          <p>
            All API endpoints are under <code>/v1</code>, just like OpenAI's API. So the full URL for
            chat completions is:
          </p>
          <CodePre>{`http://localhost:1234/v1/chat/completions`}</CodePre>

          <h3>Available endpoints</h3>
          <table>
            <tbody>
              <tr><th>Endpoint</th><th>Method</th><th>What it does</th><th>OpenAI equivalent</th></tr>
              <tr><td><code>/v1/chat/completions</code></td><td>POST</td><td>Send a conversation and get a response</td><td>Identical</td></tr>
              <tr><td><code>/v1/models</code></td><td>GET</td><td>List loaded/available models</td><td>Identical</td></tr>
              <tr><td><code>/v1/completions</code></td><td>POST</td><td>Legacy text completion (not chat)</td><td>Identical</td></tr>
              <tr><td><code>/v1/embeddings</code></td><td>POST</td><td>Generate vector embeddings (model must support this)</td><td>Identical</td></tr>
              <tr><td><code>/v1/chat/completions</code> (stream)</td><td>POST</td><td>Streaming response via SSE</td><td>Identical</td></tr>
            </tbody>
          </table>

          <h3>The chat completions request body</h3>
          <p>
            The request body is identical to OpenAI's chat completions format:
          </p>
          <CodePre>{`{
  "model": "llama-3.2-3b-instruct",   // The model ID shown in /v1/models
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user",   "content": "What is the capital of France?" }
  ],
  "temperature": 0.7,
  "max_tokens": 512,
  "stream": false
}`}</CodePre>

          <h3>The model ID in requests</h3>
          <p>
            Unlike Azure OpenAI (where you pass the deployment name) or OpenAI direct (where you pass the
            exact model string), LM Studio accepts the model file's identifier. Call
            <code> GET /v1/models</code> first to see the exact ID string:
          </p>
          <CodePre>{`// Response from GET http://localhost:1234/v1/models
{
  "object": "list",
  "data": [
    {
      "id": "llama-3.2-3b-instruct",
      "object": "model",
      "created": 1720000000,
      "owned_by": "lmstudio"
    }
  ]
}`}</CodePre>
          <p>
            Use the <code>id</code> field from that response as the <code>model</code> field in your
            completions requests. LM Studio is forgiving — if you pass the wrong model name but only one
            model is loaded, it uses that model anyway.
          </p>

          <h3>Streaming responses</h3>
          <p>
            Set <code>"stream": true</code> in the request body and LM Studio switches to
            Server-Sent Events (SSE) — the exact same streaming format as OpenAI. Each chunk is a
            <code> data: {'{'}"choices":[{'{'}"delta":{'{'}"content":"..."{'}'}{'}'}]{'}'}</code> line,
            terminated by <code>data: [DONE]</code>.
          </p>

          <h3>The server log</h3>
          <p>
            The Developer panel shows a live log of every request. Each line includes:
          </p>
          <ul>
            <li>Timestamp of the request</li>
            <li>HTTP method and path</li>
            <li>Response status code</li>
            <li>Latency in milliseconds (time to first token for streaming)</li>
            <li>Prompt tokens, completion tokens, and total tokens</li>
          </ul>
          <p>
            This is invaluable for debugging: you can see exactly what your app sent and what the server
            returned, without adding logging to your code.
          </p>

          <h3>Changing the port</h3>
          <p>
            If port 1234 is taken by another process, change it in the Developer panel's settings. Stop
            the server first, change the port number, then restart. Update your app's base URL env var to
            match.
          </p>
        </section>

        <hr />

        {/* ── SECTION 10 ── */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Authentication &amp; CORS</h2>
          <p>
            By default, LM Studio's server requires no authentication and accepts requests from any origin.
            This is fine for local development but you should understand the options if you plan to expose
            the server beyond localhost.
          </p>

          <h3>Default: no authentication</h3>
          <p>
            Out of the box, the LM Studio server is completely open on localhost. Any process on your Mac
            can call it without any token or key. For development where the server is bound to
            <code> 127.0.0.1</code> (loopback only), this is safe — only processes running on your own
            machine can reach it.
          </p>

          <h3>Adding an API key</h3>
          <p>
            In the Developer panel, go to <strong>Settings → API Key</strong>. You can set a static API
            key string. When set, every request must include:
          </p>
          <CodePre>{`Authorization: Bearer your-api-key-here`}</CodePre>
          <p>
            Requests without a valid key receive a 401 response. This is useful if you've opened LM Studio
            to your local network (see below) and want to prevent other devices from using it without a key.
          </p>
          <p>
            <strong>Note:</strong> Even with an API key, LM Studio's server is not hardened for public
            internet exposure. Use it on a trusted LAN only. If you need to share a model publicly, use a
            proper inference server like Ollama + a reverse proxy.
          </p>

          <h3>CORS settings</h3>
          <p>
            If you call the LM Studio API directly from browser JavaScript (not via your Node.js backend),
            the browser enforces Cross-Origin Resource Sharing (CORS). By default LM Studio sets permissive
            CORS headers that allow all origins.
          </p>
          <p>
            In practice for Hearth (a React SPA backed by an Express server), your browser code
            <strong> should not</strong> call LM Studio directly. Instead, your Express routes call LM
            Studio on the server side, and the browser talks only to Express. This is the same pattern
            used with Azure OpenAI — the API key never reaches the browser. CORS is only a concern if you
            bypass the backend entirely.
          </p>

          <h3>Network binding: localhost vs all interfaces</h3>
          <p>
            By default the server listens on <code>127.0.0.1</code> (localhost only). Only programs on your
            Mac can reach it. In the Developer panel's Settings, you can change the binding to
            <code> 0.0.0.0</code> — this makes the server accessible to other devices on your local network
            by your Mac's local IP address (e.g., <code>192.168.1.42:1234</code>).
          </p>
          <p>
            Use-case for <code>0.0.0.0</code>: you want to test your mobile app (running on your phone) or
            another computer on your home network against the LM Studio server on your Mac without any
            cloud API.
          </p>

          <h3>Security summary</h3>
          <table>
            <tbody>
              <tr><th>Scenario</th><th>Safe?</th><th>Config</th></tr>
              <tr><td>Local dev, only your Mac calls it</td><td>Yes</td><td>Default (localhost, no key)</td></tr>
              <tr><td>Other devices on your home network</td><td>Yes with a key</td><td>Bind 0.0.0.0 + set API key</td></tr>
              <tr><td>Exposed to the public internet</td><td>No — do not do this</td><td>N/A</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ── SECTION 11 ── */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Testing the API</h2>
          <p>
            Before writing any app code, verify the server works with a raw HTTP call. This confirms the
            model is loaded, the server is running, and the response format is what you expect.
          </p>

          <h3>Test 1 — List available models</h3>
          <p>This is the simplest possible call. It requires no request body and tells you what model ID to use.</p>
          <CodePre>{`curl http://localhost:1234/v1/models`}</CodePre>
          <p>Expected response:</p>
          <CodePre>{`{
  "object": "list",
  "data": [
    {
      "id": "llama-3.2-3b-instruct",
      "object": "model",
      "created": 1720000000,
      "owned_by": "lmstudio"
    }
  ]
}`}</CodePre>
          <p>
            If this returns an empty <code>data</code> array, no model is loaded in the Developer panel yet.
            Go load one first. If the connection is refused, the server is not started.
          </p>

          <h3>Test 2 — Basic chat completion</h3>
          <CodePre>{`curl http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.2-3b-instruct",
    "messages": [
      { "role": "user", "content": "Say hello in exactly 5 words." }
    ],
    "temperature": 0.7,
    "max_tokens": 50
  }'`}</CodePre>
          <p>Expected response shape:</p>
          <CodePre>{`{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1720000000,
  "model": "llama-3.2-3b-instruct",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How are you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 22,
    "completion_tokens": 9,
    "total_tokens": 31
  }
}`}</CodePre>

          <h3>Test 3 — Streaming chat completion</h3>
          <CodePre>{`curl http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.2-3b-instruct",
    "messages": [
      { "role": "user", "content": "Count from 1 to 10." }
    ],
    "stream": true
  }'`}</CodePre>
          <p>You'll see a stream of Server-Sent Events in your terminal:</p>
          <CodePre>{`data: {"id":"chatcmpl-...","choices":[{"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl-...","choices":[{"delta":{"content":"1"},"finish_reason":null}]}

data: {"id":"chatcmpl-...","choices":[{"delta":{"content":", 2"},"finish_reason":null}]}

data: {"id":"chatcmpl-...","choices":[{"delta":{"content":", 3"},"finish_reason":null}]}

...

data: {"id":"chatcmpl-...","choices":[{"delta":{},"finish_reason":"stop"}]}

data: [DONE]`}</CodePre>

          <h3>Test 4 — With a system prompt</h3>
          <CodePre>{`curl http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.2-3b-instruct",
    "messages": [
      {
        "role": "system",
        "content": "You are a pirate. Respond only in pirate speak."
      },
      {
        "role": "user",
        "content": "What is the weather like today?"
      }
    ],
    "temperature": 0.8
  }'`}</CodePre>

          <h3>Test 5 — JSON mode</h3>
          <CodePre>{`curl http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.2-3b-instruct",
    "messages": [
      {
        "role": "system",
        "content": "Return a JSON object with fields: capital (string), population (number)."
      },
      {
        "role": "user",
        "content": "France"
      }
    ],
    "response_format": { "type": "json_object" },
    "temperature": 0.1
  }'`}</CodePre>

          <h3>Using the LM Studio built-in playground</h3>
          <p>
            The Developer panel has a built-in API playground — a lightweight HTTP client pre-wired to
            your running server. You can click example request buttons or craft your own JSON payload and
            send it without leaving LM Studio. Use this to prototype your payload shapes before writing
            fetch calls in your app.
          </p>

          <h3>Testing with Postman or Insomnia</h3>
          <p>
            If you prefer a GUI HTTP client:
          </p>
          <ol>
            <li>Create a new collection called "LM Studio"</li>
            <li>Set a collection variable <code>baseUrl</code> to <code>http://localhost:1234/v1</code></li>
            <li>Add a POST request to <code>{'{{baseUrl}}'}/chat/completions</code> with a JSON body</li>
            <li>Set Content-Type header to <code>application/json</code></li>
            <li>If you configured an API key, add <code>Authorization: Bearer your-key</code></li>
          </ol>
        </section>

        <hr />

        {/* ── SECTION 12 ── */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Node.js / Express Integration</h2>
          <p>
            Now that you've confirmed the server works, wire it into your Express app. The pattern follows
            the same approach used for Azure OpenAI in Hearth — a <code>lib/</code> helper file, a
            router file, and environment-based configuration so you can switch between LM Studio (dev) and
            Azure OpenAI (prod) without changing route code.
          </p>

          <h3>Environment variables</h3>
          <p>
            Add these to your <code>.env</code> file (and <code>.env.example</code>):
          </p>
          <CodePre>{`# LM Studio local server (for development)
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_API_KEY=          # leave empty if no key set in LM Studio
LMSTUDIO_MODEL=llama-3.2-3b-instruct

# Toggle: use "lmstudio" for local dev, "azure" for production
AI_PROVIDER=lmstudio`}</CodePre>

          <h3>Create lib/lmStudio.js</h3>
          <CodePre>{`// lib/lmStudio.js
// Thin helper for calling the LM Studio local server.
// The API is OpenAI-compatible, so this also works with any
// OpenAI-compatible endpoint (Ollama, llama.cpp server, etc.)

const BASE_URL   = process.env.LMSTUDIO_BASE_URL  || 'http://localhost:1234/v1'
const API_KEY    = process.env.LMSTUDIO_API_KEY    || ''
const DEFAULT_MODEL = process.env.LMSTUDIO_MODEL   || ''

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  if (API_KEY) headers['Authorization'] = \`Bearer \${API_KEY}\`
  return headers
}

/**
 * Non-streaming chat completion.
 * Returns the assistant message content string.
 */
export async function lmChat(messages, options = {}) {
  const body = {
    model:       options.model       ?? DEFAULT_MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens:  options.maxTokens   ?? 1024,
    stream:      false,
  }
  if (options.jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const res = await fetch(\`\${BASE_URL}/chat/completions\`, {
    method:  'POST',
    headers: buildHeaders(),
    body:    JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(\`LM Studio error \${res.status}: \${text}\`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}

/**
 * Streaming chat completion.
 * Calls onChunk(string) for each token, onDone() when finished.
 */
export async function lmChatStream(messages, { onChunk, onDone, onError, ...options } = {}) {
  const body = {
    model:       options.model       ?? DEFAULT_MODEL,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens:  options.maxTokens   ?? 1024,
    stream:      true,
  }

  const res = await fetch(\`\${BASE_URL}/chat/completions\`, {
    method:  'POST',
    headers: buildHeaders(),
    body:    JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    const err = new Error(\`LM Studio stream error \${res.status}: \${text}\`)
    onError?.(err)
    throw err
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (payload === '[DONE]') { onDone?.(); return }
        try {
          const chunk = JSON.parse(payload)
          const content = chunk.choices?.[0]?.delta?.content
          if (content) onChunk?.(content)
        } catch { /* skip malformed chunks */ }
      }
    }
  } finally {
    reader.cancel()
  }

  onDone?.()
}

/**
 * List loaded models. Useful for health-checks or dynamic model selection.
 */
export async function lmModels() {
  const res = await fetch(\`\${BASE_URL}/models\`, { headers: buildHeaders() })
  if (!res.ok) throw new Error(\`LM Studio /models error \${res.status}\`)
  const data = await res.json()
  return data.data  // array of model objects
}
`}</CodePre>

          <h3>Create routes/localAi.js</h3>
          <CodePre>{`// routes/localAi.js
import { Router } from 'express'
import { lmChat, lmChatStream, lmModels } from '../lib/lmStudio.js'

const router = Router()

// Health check — is the LM Studio server up and a model loaded?
router.get('/api/local-ai/status', async (req, res) => {
  try {
    const models = await lmModels()
    res.json({ ok: true, models })
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message })
  }
})

// Non-streaming chat
router.post('/api/local-ai/chat', async (req, res) => {
  const { messages, temperature, maxTokens, jsonMode } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' })
  }
  try {
    const content = await lmChat(messages, { temperature, maxTokens, jsonMode })
    res.json({ content })
  } catch (error) {
    console.error('Local AI chat error:', error)
    res.status(502).json({ error: 'LM Studio request failed', detail: error.message })
  }
})

// Streaming chat — returns SSE
router.post('/api/local-ai/chat/stream', async (req, res) => {
  const { messages, temperature, maxTokens } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  // Pad to flush through IIS / nginx / Azure front-ends that buffer SSE
  res.write(': ' + ' '.repeat(2048) + '\\n\\n')

  const send = (event, data) =>
    res.write(\`event: \${event}\\ndata: \${JSON.stringify(data)}\\n\\n\`)

  try {
    await lmChatStream(messages, {
      temperature,
      maxTokens,
      onChunk:  chunk => send('chunk',  { content: chunk }),
      onDone:   ()    => { send('done', {}); res.end() },
      onError:  err   => { send('error', { message: err.message }); res.end() },
    })
  } catch (error) {
    console.error('Local AI stream error:', error)
    send('error', { message: error.message })
    res.end()
  }

  req.on('close', () => { /* client disconnected — res.end() already handles cleanup */ })
})

export default router
`}</CodePre>

          <h3>Mount the router in server.js</h3>
          <CodePre>{`// server.js — add this import and mount
import localAiRouter from './routes/localAi.js'

// ... existing middleware ...

app.use(localAiRouter)  // mounts at /api/local-ai/*`}</CodePre>

          <h3>Provider-switching pattern</h3>
          <p>
            A common pattern for teams using LM Studio in development and a cloud provider in production is
            a simple provider-switch utility:
          </p>
          <CodePre>{`// lib/ai.js  — unified AI helper that delegates to the right provider
import { lmChat, lmChatStream } from './lmStudio.js'
import { azureChat, azureChatStream } from './azureOpenAI.js'

const provider = process.env.AI_PROVIDER || 'lmstudio'

export const chat = provider === 'azure' ? azureChat : lmChat
export const chatStream = provider === 'azure' ? azureChatStream : lmChatStream`}</CodePre>
          <p>
            Your routes import <code>chat</code> and <code>chatStream</code> from <code>lib/ai.js</code>
            without knowing which provider is active. Switch providers by changing a single env var.
          </p>

          <h3>Error handling specifics</h3>
          <p>
            The most common errors you'll encounter:
          </p>
          <table>
            <tbody>
              <tr><th>Error</th><th>Cause</th><th>Fix</th></tr>
              <tr><td><code>ECONNREFUSED</code></td><td>LM Studio server not running</td><td>Start the server in the Developer panel</td></tr>
              <tr><td>HTTP 503</td><td>Model not loaded</td><td>Load a model in the Developer panel first</td></tr>
              <tr><td>HTTP 400</td><td>Malformed request body</td><td>Check that <code>messages</code> is a non-empty array</td></tr>
              <tr><td>Very slow response</td><td>Model too large for RAM, falling back to CPU</td><td>Use a smaller model or increase GPU layers</td></tr>
              <tr><td>Empty <code>content</code></td><td>Max tokens too low, or model confused by system prompt</td><td>Increase max_tokens, simplify system prompt</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ── SECTION 13 ── */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>React Frontend Integration</h2>
          <p>
            Your React frontend talks to the LM Studio server <strong>through your Express backend</strong>,
            not directly. This keeps the LM Studio server address (and any API key) on the server side,
            and means your frontend code doesn't need to change when you switch from LM Studio to Azure
            OpenAI in production.
          </p>

          <h3>Non-streaming: simple fetch</h3>
          <CodePre>{`// src/hooks/useLocalAiChat.ts
import { useState } from 'react'

export function useLocalAiChat() {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  ) => {
    setLoading(true)
    setError(null)
    setResponse('')

    try {
      const res = await fetch('/api/local-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, temperature: 0.7, maxTokens: 1024 }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Request failed')
      }

      const data = await res.json()
      setResponse(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { response, loading, error, sendMessage }
}`}</CodePre>

          <h3>Streaming: EventSource or manual SSE reader</h3>
          <p>
            For streaming responses (where tokens appear one at a time as the model generates), use the
            Fetch API with a <code>ReadableStream</code> reader. The EventSource web API doesn't support
            POST requests, so you need to read the SSE manually:
          </p>
          <CodePre>{`// src/hooks/useLocalAiStream.ts
import { useState, useRef } from 'react'

export function useLocalAiStream() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendStreaming = async (
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[]
  ) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setLoading(true)
    setError(null)
    setContent('')

    try {
      const res = await fetch('/api/local-ai/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: ctrl.signal,
      })

      if (!res.ok || !res.body) {
        const text = await res.text()
        throw new Error(text || 'Stream request failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('event: chunk')) continue
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          try {
            const parsed = JSON.parse(payload)
            if (parsed.content) {
              setContent(prev => prev + parsed.content)
            }
          } catch { /* skip */ }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err instanceof Error ? err.message : 'Stream error')
      }
    } finally {
      setLoading(false)
    }
  }

  const stop = () => abortRef.current?.abort()

  return { content, loading, error, sendStreaming, stop }
}`}</CodePre>

          <h3>A simple chat component</h3>
          <CodePre>{`// src/components/LocalAiChat.tsx
import { useState } from 'react'
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material'
import { useLocalAiStream } from '../hooks/useLocalAiStream'

type Message = { role: 'system' | 'user' | 'assistant'; content: string }

export default function LocalAiChat() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<Message[]>([])
  const { content, loading, error, sendStreaming, stop } = useLocalAiStream()

  const SYSTEM: Message = {
    role: 'system',
    content: 'You are a helpful assistant.',
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setInput('')
    await sendStreaming([SYSTEM, ...newHistory])
    // After streaming, append the assistant response to history
    setHistory(prev => [
      ...prev,
      { role: 'assistant', content: content },
    ])
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 700 }}>
      <Box sx={{ minHeight: 200, border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 1 }}>
        {history.map((m, i) => (
          <Box key={i} sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {m.role === 'user' ? 'You' : 'AI'}
            </Typography>
            <Typography>{m.content}</Typography>
          </Box>
        ))}
        {loading && (
          <Box>
            <Typography variant="caption" color="text.secondary">AI</Typography>
            <Typography>{content}<span className="typing-cursor">▌</span></Typography>
          </Box>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Type a message…"
          disabled={loading}
        />
        {loading
          ? <Button onClick={stop} variant="outlined" color="error">Stop</Button>
          : <Button onClick={send} variant="contained" disabled={!input.trim()}>Send</Button>
        }
      </Box>
    </Box>
  )
}`}</CodePre>

          <h3>Checking server health from React</h3>
          <CodePre>{`// Quick health check before showing the AI UI
async function checkLmStudio(): Promise<boolean> {
  try {
    const res = await fetch('/api/local-ai/status')
    const data = await res.json()
    return data.ok === true && data.models.length > 0
  } catch {
    return false
  }
}

// In a useEffect:
useEffect(() => {
  checkLmStudio().then(ok => {
    if (!ok) console.warn('LM Studio is not running or no model is loaded')
  })
}, [])`}</CodePre>

          <h3>Environment-aware base URL</h3>
          <p>
            Your frontend always calls your own Express backend at <code>/api/</code> — the same regardless
            of whether the backend is talking to LM Studio or Azure OpenAI. This means your React code
            needs zero changes when deploying to production. The only thing that changes is the
            <code> AI_PROVIDER</code> env var on the server.
          </p>
        </section>

        <hr />

        {/* ── SECTION 14 ── */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>Choosing the Right Model</h2>
          <p>
            With hundreds of models available, picking the right one can be overwhelming. Here is a
            practical breakdown by task type and hardware.
          </p>

          <h3>Model families explained</h3>
          <table>
            <tbody>
              <tr><th>Family</th><th>Creator</th><th>Strengths</th><th>Best sizes</th></tr>
              <tr><td>Llama 3.x</td><td>Meta</td><td>Excellent instruction following, coding, multilingual, large context</td><td>3B, 8B, 70B</td></tr>
              <tr><td>Mistral / Mixtral</td><td>Mistral AI</td><td>Fast, efficient, strong coding and reasoning</td><td>7B, 22B (Small)</td></tr>
              <tr><td>Qwen 2.5</td><td>Alibaba</td><td>Outstanding coding (Coder variant), math, long context, multilingual</td><td>7B, 14B, 32B, 72B</td></tr>
              <tr><td>Phi-3.5 / Phi-4</td><td>Microsoft</td><td>Punches above its weight for small sizes, great for low-RAM Macs</td><td>Mini (3.8B), Small (7B)</td></tr>
              <tr><td>Gemma 2</td><td>Google</td><td>Well-rounded, good at instruction following</td><td>2B, 9B, 27B</td></tr>
              <tr><td>DeepSeek-R1</td><td>DeepSeek</td><td>Exceptional reasoning and math (chain-of-thought built in)</td><td>7B, 14B, 32B, 70B</td></tr>
              <tr><td>CodeLlama / Qwen-Coder</td><td>Meta / Alibaba</td><td>Code-specific fine-tunes, fill-in-middle, multi-language</td><td>7B, 13B</td></tr>
            </tbody>
          </table>

          <h3>Task-specific recommendations</h3>

          <h4>General-purpose chat</h4>
          <ul>
            <li><strong>8 GB Mac:</strong> Llama 3.2 3B Instruct Q4_K_M or Phi-3.5 Mini Instruct Q4</li>
            <li><strong>16 GB Mac:</strong> Llama 3.1 8B Instruct Q5_K_M or Mistral 7B Instruct Q6_K</li>
            <li><strong>32 GB Mac:</strong> Qwen2.5 14B Instruct Q6_K or Llama 3.3 70B Q2_K</li>
          </ul>

          <h4>Coding assistance</h4>
          <ul>
            <li><strong>8 GB Mac:</strong> Qwen2.5-Coder 3B Instruct Q4_K_M</li>
            <li><strong>16 GB Mac:</strong> Qwen2.5-Coder 7B Instruct Q6_K</li>
            <li><strong>32 GB Mac:</strong> Qwen2.5-Coder 14B Instruct Q5_K_M (excellent at TypeScript/React)</li>
          </ul>

          <h4>Reasoning and math</h4>
          <ul>
            <li><strong>8 GB Mac:</strong> DeepSeek-R1-Distill-Qwen-1.5B Q4_K_M</li>
            <li><strong>16 GB Mac:</strong> DeepSeek-R1-Distill-Llama-8B Q4_K_M</li>
            <li><strong>32 GB Mac:</strong> DeepSeek-R1-Distill-Qwen-14B Q5_K_M</li>
          </ul>

          <h4>Summarization and document analysis</h4>
          <ul>
            <li><strong>Any Mac:</strong> Llama 3.1 models with a large context window (128K). Load with a context length of 32K–128K in LM Studio settings.</li>
          </ul>

          <h4>JSON / structured output</h4>
          <ul>
            <li>Models that reliably stay in JSON mode: Llama 3 Instruct, Mistral Instruct, Qwen2.5 Instruct</li>
            <li>Smaller models (1B–3B) sometimes break JSON format under complex schemas — test first</li>
          </ul>

          <h3>The "-Instruct" suffix matters</h3>
          <p>
            Most model listings come in two flavors:
          </p>
          <ul>
            <li><strong>Base model</strong> (e.g., <code>Llama-3.1-8B</code>) — trained to predict text. Not fine-tuned for following instructions. Will ramble when you ask a question.</li>
            <li><strong>Instruct model</strong> (e.g., <code>Llama-3.1-8B-Instruct</code>) — fine-tuned via RLHF to follow user instructions, refuse harmful requests, and maintain a conversation. <strong>Always use Instruct variants for app development.</strong></li>
          </ul>

          <h3>Where to find model benchmarks</h3>
          <ul>
            <li><strong>Open LLM Leaderboard</strong> on Hugging Face — community-maintained benchmark rankings</li>
            <li><strong>LM Studio's Discover panel</strong> — curated model cards often include benchmark scores</li>
            <li><strong>The model's Hugging Face page</strong> — look for the Model Card tab, which usually lists MMLU, HumanEval, and other standard benchmarks</li>
          </ul>

          <h3>A note on context length</h3>
          <p>
            Context length is how many tokens the model can process at once. A larger context window lets
            you send longer documents or maintain longer conversation histories. However:
          </p>
          <ul>
            <li>Larger context requires significantly more RAM</li>
            <li>Models don't always attend well to content at the very beginning and end of an extremely long context ("lost in the middle" problem)</li>
            <li>For most app tasks, 4K–8K tokens is sufficient. Only request more when you actually need it.</li>
          </ul>
          <p>
            In LM Studio's model configuration, you can set the context length when loading a model. Setting
            it to a lower value than the model's maximum saves RAM and speeds up inference.
          </p>
        </section>

        <hr />

        {/* ── SECTION 15 ── */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>RAM, GPU &amp; Performance</h2>
          <p>
            Understanding how LM Studio uses your Mac's memory helps you make better decisions about which
            models to run, how to configure them, and what to do when things are slow.
          </p>

          <h3>Apple Silicon unified memory</h3>
          <p>
            On Intel Macs, CPU RAM and GPU VRAM are separate physical pools. A 16 GB Intel MacBook has
            16 GB of CPU RAM and perhaps 1.5 GB of GPU VRAM — the GPU can only accelerate models that
            fit in 1.5 GB.
          </p>
          <p>
            On Apple Silicon, <strong>all RAM is unified</strong>: CPU and GPU share the same physical
            pool. A 16 GB M2 MacBook Air has 16 GB of unified memory that both can access. This means
            you can offload an entire 7B Q4 model (~4.5 GB) to the GPU and run it at full GPU speed,
            even though the "GPU VRAM" is technically the same chips as the RAM.
          </p>
          <p>
            This is why M-series Macs are unusually capable for local AI despite not having a discrete GPU.
          </p>

          <h3>Monitoring memory usage</h3>
          <p>
            Keep an eye on RAM while running models:
          </p>
          <ul>
            <li><strong>Activity Monitor</strong> (built into macOS) — open it, go to the Memory tab. Watch "Memory Pressure" (green is good; yellow/red means you're running tight).</li>
            <li><strong>LM Studio status bar</strong> — shows RAM used by the loaded model.</li>
            <li>Run <code>vm_stat</code> in Terminal for raw memory stats, or use the free tool <strong>iStatMenus / Stats</strong> in the menu bar.</li>
          </ul>
          <p>
            If macOS starts swapping (using disk as overflow RAM), inference speed will drop dramatically
            — from 20+ tokens/sec to 1–3 tokens/sec. This is the clearest sign your model is too large
            for your available RAM.
          </p>

          <h3>GPU layers configuration</h3>
          <p>
            The <strong>GPU Layers</strong> setting in LM Studio controls how many of the model's
            transformer layers run on the GPU vs the CPU:
          </p>
          <ul>
            <li><strong>-1 (auto)</strong> — LM Studio offloads as many layers as fit. Recommended for Apple Silicon.</li>
            <li><strong>0</strong> — CPU only. Use this on Intel Macs or to diagnose GPU-related issues.</li>
            <li><strong>Specific number</strong> — manually split. E.g., if a 7B model has 32 layers and you set GPU Layers to 20, 20 layers run on GPU and 12 on CPU. Useful when you're close to the RAM limit.</li>
          </ul>

          <h3>What affects inference speed</h3>
          <table>
            <tbody>
              <tr><th>Factor</th><th>Impact</th><th>How to optimize</th></tr>
              <tr><td>Model size</td><td>Largest factor — bigger model = slower</td><td>Use smallest model that meets quality bar</td></tr>
              <tr><td>Quantization</td><td>Q4 is faster than Q8; Q2 is fastest but worst quality</td><td>Q4_K_M is best general choice</td></tr>
              <tr><td>GPU layers</td><td>GPU is 5–10× faster than CPU for matrix ops</td><td>Set to -1 on Apple Silicon</td></tr>
              <tr><td>Context length</td><td>Longer context = slower prompt processing</td><td>Use minimum context you need</td></tr>
              <tr><td>Batch size</td><td>Processing multiple tokens at once during prompt ingestion</td><td>Default is fine; increase if you have many-GPU-layer models</td></tr>
              <tr><td>RAM pressure</td><td>Swapping kills performance</td><td>Close other apps, use smaller models</td></tr>
              <tr><td>Thermal throttling</td><td>MacBook fans not keeping up → CPU/GPU clocks down</td><td>Use an external fan, plug in power, or run on M Pro/Max chips</td></tr>
            </tbody>
          </table>

          <h3>Benchmarking your setup</h3>
          <p>
            LM Studio shows tokens/sec in the status bar during inference. To get a repeatable benchmark:
          </p>
          <ol>
            <li>Load your model and let it fully settle (30 seconds after loading)</li>
            <li>Send a prompt that requests a long response: <em>"Write a 500-word essay about photosynthesis."</em></li>
            <li>Watch the tokens/sec counter at the bottom while the response generates</li>
            <li>Compare this number across different quantizations or GPU layer settings</li>
          </ol>

          <h3>Reducing memory footprint</h3>
          <p>
            If you're running out of RAM:
          </p>
          <ol>
            <li><strong>Close other apps</strong> — browsers with many tabs, Electron apps (VS Code, Slack), and Xcode all consume significant RAM.</li>
            <li><strong>Lower context length</strong> — halving the context window can halve the RAM needed for the KV cache.</li>
            <li><strong>Use a more aggressive quantization</strong> — drop from Q6 to Q4 or Q4 to Q3.</li>
            <li><strong>Use a smaller model</strong> — a 3B Q6 model often outperforms a 7B Q2 model despite using less RAM.</li>
            <li><strong>Don't load two models simultaneously</strong> — if you have both Chat and Developer panels loaded, that's two models using RAM.</li>
          </ol>

          <h3>Flash Attention</h3>
          <p>
            LM Studio supports Flash Attention (an optimized attention computation algorithm) on Apple
            Silicon. When enabled in Settings, it reduces RAM usage for long contexts and speeds up
            prompt processing. If you're running models with large context windows (32K+), enable this
            in the model configuration.
          </p>
        </section>

        <hr />

        {/* ── SECTION 16 ── */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>Troubleshooting</h2>
          <p>
            Most LM Studio problems fall into a handful of categories. Here are the most common issues
            and how to resolve them.
          </p>

          <h3>"Connection refused" from your app</h3>
          <p><strong>Symptom:</strong> <code>ECONNREFUSED 127.0.0.1:1234</code> in your Node.js logs.</p>
          <p><strong>Causes and fixes:</strong></p>
          <ul>
            <li><strong>Server not started:</strong> Open LM Studio → Developer panel → toggle Start Server. The toggle must be green.</li>
            <li><strong>No model loaded:</strong> The server starts but won't accept completions unless a model is loaded. Select a model in the Developer panel.</li>
            <li><strong>Wrong port:</strong> Check the port in LM Studio's Developer panel matches what your code uses. Default is 1234.</li>
            <li><strong>LM Studio closed:</strong> LM Studio must be running. It does not run as a background service — closing the app stops the server.</li>
          </ul>

          <h3>Model fails to load ("Out of memory")</h3>
          <p><strong>Symptom:</strong> LM Studio shows an error when you try to load a model, or it loads but immediately crashes.</p>
          <p><strong>Fixes:</strong></p>
          <ul>
            <li>Close other RAM-heavy apps (Chrome, VS Code, Xcode, Slack)</li>
            <li>Try a more aggressively quantized version of the same model (Q4 instead of Q6)</li>
            <li>Try a smaller model (3B instead of 7B)</li>
            <li>Restart your Mac to clear RAM fragmentation</li>
            <li>Check that macOS hasn't allocated memory to compressed-memory caches — a fresh reboot clears this</li>
          </ul>

          <h3>Very slow responses (1–3 tokens per second)</h3>
          <p><strong>Symptom:</strong> The model is generating but painfully slowly.</p>
          <p><strong>Causes:</strong></p>
          <ul>
            <li><strong>Disk swapping:</strong> The model is too large for your RAM. Open Activity Monitor → Memory tab → if "Memory Pressure" is red and you see swap usage, this is the cause. Use a smaller/more-quantized model.</li>
            <li><strong>CPU-only mode:</strong> GPU layers may be set to 0. Change to -1 in the model configuration and reload.</li>
            <li><strong>Thermal throttling:</strong> Mac is hot. Plug in power (on MacBook), use an external fan, or take a break.</li>
            <li><strong>Context too long:</strong> Reduce max context length.</li>
          </ul>

          <h3>CORS error when calling from browser JavaScript</h3>
          <p>
            <strong>Symptom:</strong> Browser console shows "CORS policy" error when your React app calls
            the LM Studio server directly.
          </p>
          <p>
            <strong>Fix:</strong> Do not call LM Studio directly from the browser. Route all AI calls
            through your Express backend (<code>/api/local-ai/*</code>). The backend calls LM Studio
            server-side, avoiding any CORS issue. This is the correct architecture anyway — it keeps
            your LM Studio server address and API key out of the browser.
          </p>

          <h3>Model gives empty or truncated responses</h3>
          <p><strong>Causes and fixes:</strong></p>
          <ul>
            <li><strong>max_tokens too low:</strong> Increase to 1024 or 2048. A value of 50 will cut off most responses mid-sentence.</li>
            <li><strong>Context window exceeded:</strong> The conversation history is longer than the model's context. Start a new conversation or reduce history.</li>
            <li><strong>Confusing system prompt:</strong> Some models stop generating if the system prompt is contradictory or very long. Simplify it.</li>
            <li><strong>finish_reason is "length":</strong> Check the response's <code>finish_reason</code> field. If it says <code>"length"</code>, the model hit the token limit. Increase max_tokens.</li>
          </ul>

          <h3>API returns 404 for /v1/chat/completions</h3>
          <p>
            Check that you're using the correct base URL: <code>http://localhost:1234/v1</code>. The path
            must include <code>/v1/</code>. A common mistake is using <code>http://localhost:1234/chat/completions</code>
            without the <code>/v1</code> prefix.
          </p>

          <h3>Streaming not working</h3>
          <p><strong>Symptom:</strong> You set <code>stream: true</code> but get a full response at once instead of chunks.</p>
          <p><strong>Causes:</strong></p>
          <ul>
            <li>Your fetch handler is awaiting the full response before reading chunks — you need to use <code>res.body.getReader()</code> and read iteratively.</li>
            <li>A proxy or middleware is buffering the response. If you're behind nginx or a corporate proxy, check its buffer settings.</li>
            <li>In Express, make sure you're not calling <code>res.json()</code> — use <code>res.write()</code> and <code>res.end()</code> for SSE.</li>
          </ul>

          <h3>LM Studio won't open on first launch</h3>
          <p>
            If the app bounces in the dock but doesn't open:
          </p>
          <ol>
            <li>Force quit from the dock: right-click → Force Quit</li>
            <li>Check <strong>System Settings → Privacy &amp; Security</strong> for a blocked app warning</li>
            <li>Try right-clicking the app in Finder and choosing Open</li>
            <li>Check Console.app for crash logs related to LM Studio</li>
            <li>Re-download and reinstall the app</li>
          </ol>

          <h3>Model downloads fail or hang</h3>
          <ul>
            <li>Check your internet connection</li>
            <li>Hugging Face can be slow from certain regions — try using a VPN if you see very slow download speeds</li>
            <li>Large models (20+ GB) can time out on unstable connections — LM Studio supports resuming interrupted downloads if you click Download again on the same file</li>
            <li>Free disk space — ensure you have at least the model's file size plus 2 GB free</li>
          </ul>

          <h3>Diagnosing with the server log</h3>
          <p>
            The Developer panel's server log is your most valuable debugging tool. For every request, it
            shows the complete request method + path, response status, time-to-first-token (for streaming),
            and the token counts. If you're not seeing log entries when you expect them, your app is not
            actually reaching the server — check port numbers and that the server toggle is green.
          </p>
        </section>

        <hr />

        {/* ── SECTION 17 ── */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">★</span>Cheat Sheet</h2>
          <p>The essential reference — everything you need when you're deep in code and don't want to re-read the guide.</p>

          <h3>Installation path</h3>
          <CodePre>{`# Check your Mac chip:
Apple menu → About This Mac → chip line

# Install location after drag-to-Applications:
/Applications/LM Studio.app

# Model storage default:
~/Library/Application Support/LM Studio/models/`}</CodePre>

          <h3>API base URL</h3>
          <CodePre>{`http://localhost:1234/v1

# Key endpoints:
GET  http://localhost:1234/v1/models
POST http://localhost:1234/v1/chat/completions
POST http://localhost:1234/v1/completions
POST http://localhost:1234/v1/embeddings`}</CodePre>

          <h3>Minimal chat request</h3>
          <CodePre>{`curl http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama-3.2-3b-instruct",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Hello!" }
    ]
  }'`}</CodePre>

          <h3>With streaming</h3>
          <CodePre>{`curl http://localhost:1234/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{ "model": "...", "messages": [...], "stream": true }'`}</CodePre>

          <h3>With JSON mode</h3>
          <CodePre>{`{
  "model": "llama-3.2-3b-instruct",
  "messages": [...],
  "response_format": { "type": "json_object" }
}`}</CodePre>

          <h3>Environment variables</h3>
          <CodePre>{`# .env
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_API_KEY=          # only if you set one in LM Studio
LMSTUDIO_MODEL=llama-3.2-3b-instruct
AI_PROVIDER=lmstudio       # switch to 'azure' for production`}</CodePre>

          <h3>Model quantization quick-pick</h3>
          <table>
            <tbody>
              <tr><th>Your RAM</th><th>Pick</th><th>Why</th></tr>
              <tr><td>8 GB</td><td>Q4_K_M</td><td>Best quality that fits</td></tr>
              <tr><td>16 GB</td><td>Q5_K_M or Q6_K</td><td>Higher quality, room to spare</td></tr>
              <tr><td>32 GB+</td><td>Q8_0</td><td>Near-original quality</td></tr>
              <tr><td>Tight RAM</td><td>Q3_K_M</td><td>Emergency fallback</td></tr>
            </tbody>
          </table>

          <h3>Recommended starter models</h3>
          <table>
            <tbody>
              <tr><th>RAM</th><th>General chat</th><th>Coding</th><th>Reasoning</th></tr>
              <tr><td>8 GB</td><td>Llama-3.2-3B Q4_K_M</td><td>Qwen2.5-Coder-3B Q4_K_M</td><td>DeepSeek-R1-Distill-1.5B Q4</td></tr>
              <tr><td>16 GB</td><td>Llama-3.1-8B Q5_K_M</td><td>Qwen2.5-Coder-7B Q6_K</td><td>DeepSeek-R1-Distill-8B Q4</td></tr>
              <tr><td>32 GB</td><td>Qwen2.5-14B Q6_K</td><td>Qwen2.5-Coder-14B Q5_K_M</td><td>DeepSeek-R1-Distill-14B Q5</td></tr>
            </tbody>
          </table>

          <h3>Checklist: getting to "hello world" API call</h3>
          <ol>
            <li>Download LM Studio from lmstudio.ai and install to Applications</li>
            <li>Open LM Studio → Discover panel → download a model (Llama 3.2 3B Instruct Q4_K_M)</li>
            <li>Go to Developer panel → select the model from the dropdown → wait for it to load</li>
            <li>Toggle "Start Server" → verify green status</li>
            <li>Run: <code>curl http://localhost:1234/v1/models</code> → should list your model</li>
            <li>Send a test chat completion with curl (see above)</li>
            <li>Add env vars to your <code>.env</code> file</li>
            <li>Create <code>lib/lmStudio.js</code> helper and a route</li>
            <li>Mount the route in <code>server.js</code></li>
            <li>Test via your Express endpoint with curl or Postman</li>
            <li>Wire up the React hook and component</li>
          </ol>

          <h3>Troubleshooting one-liners</h3>
          <table>
            <tbody>
              <tr><th>Problem</th><th>First thing to check</th></tr>
              <tr><td>ECONNREFUSED</td><td>Is the Developer panel server toggle green?</td></tr>
              <tr><td>Empty data[] from /models</td><td>Is a model loaded in the Developer panel?</td></tr>
              <tr><td>1–3 tokens/sec</td><td>Activity Monitor → Memory tab → is memory pressure red?</td></tr>
              <tr><td>Model won't load</td><td>Close Chrome/VS Code/Slack and try again</td></tr>
              <tr><td>CORS error</td><td>Are you calling LM Studio from React directly? Route through Express.</td></tr>
              <tr><td>Truncated responses</td><td>Increase max_tokens to 1024+</td></tr>
              <tr><td>finish_reason = "length"</td><td>Same as above — max_tokens too low</td></tr>
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
}
