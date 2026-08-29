import { useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../app/storage/scopedStorage';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1', title: 'Why Bundle vs Live URL', icon: '📦' },
  { id: 's2', title: 'Fix Vite Config', icon: '⚡' },
  { id: 's3', title: 'Build & Verify', icon: '🔨' },
  { id: 's4', title: 'Xcode Setup', icon: '🛠️' },
  { id: 's5', title: 'ContentView.swift', icon: '📱' },
  { id: 's6', title: 'Microsoft SSO / MSAL', icon: '🔐' },
  { id: 's7', title: 'Debugging', icon: '🐛' },
  { id: 's8', title: 'Final Checklist', icon: '✅' },
  { id: 's9', title: 'Optional Enhancements', icon: '✨' },
];

const CHECKLIST_KEY = 'hearth-wkwebview-checks';

// String.raw preserves backslashes so Swift string interpolation \(var) is not mangled.
const CONTENT_VIEW_SWIFT = String.raw`import SwiftUI
import WebKit

// Serves the bundled dist/ folder at cairn://localhost/ so Microsoft AAD
// accepts it as a valid OAuth redirect URI (file:// is rejected by AAD).
private class DistSchemeHandler: NSObject, WKURLSchemeHandler {
    private let distURL: URL

    init(distURL: URL) { self.distURL = distURL }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let requestURL = urlSchemeTask.request.url else {
            urlSchemeTask.didFailWithError(URLError(.badURL)); return
        }
        let requestPath = requestURL.path
        let relativePath = requestPath.isEmpty || requestPath == "/"
            ? "index.html"
            : String(requestPath.dropFirst())
        let fileURL = distURL.appendingPathComponent(relativePath)

        do {
            let data = try Data(contentsOf: fileURL)
            let response = URLResponse(url: requestURL,
                mimeType: Self.mimeType(for: fileURL.pathExtension),
                expectedContentLength: data.count, textEncodingName: "utf-8")
            urlSchemeTask.didReceive(response)
            urlSchemeTask.didReceive(data)
            urlSchemeTask.didFinish()
        } catch {
            // SPA fallback: paths with no extension are React routes — serve index.html
            if fileURL.pathExtension.isEmpty {
                serveIndex(for: urlSchemeTask, requestURL: requestURL)
            } else {
                print("❌ DistSchemeHandler: not found: \(relativePath)")
                urlSchemeTask.didFailWithError(error)
            }
        }
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

    private func serveIndex(for urlSchemeTask: WKURLSchemeTask, requestURL: URL) {
        let indexURL = distURL.appendingPathComponent("index.html")
        guard let data = try? Data(contentsOf: indexURL) else {
            urlSchemeTask.didFailWithError(URLError(.fileDoesNotExist)); return
        }
        let response = URLResponse(url: requestURL, mimeType: "text/html",
                                   expectedContentLength: data.count, textEncodingName: "utf-8")
        urlSchemeTask.didReceive(response)
        urlSchemeTask.didReceive(data)
        urlSchemeTask.didFinish()
    }

    private static func mimeType(for ext: String) -> String {
        switch ext.lowercased() {
        case "html":        return "text/html"
        case "js", "mjs":  return "text/javascript"
        case "css":         return "text/css"
        case "json":        return "application/json"
        case "png":         return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "gif":         return "image/gif"
        case "svg":         return "image/svg+xml"
        case "ico":         return "image/x-icon"
        case "woff":        return "font/woff"
        case "woff2":       return "font/woff2"
        case "ttf":         return "font/ttf"
        case "otf":         return "font/otf"
        default:            return "application/octet-stream"
        }
    }
}

// Prevents the retain cycle from WKUserContentController holding
// a strong reference to its message handler.
private class WeakMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WebView.Coordinator?
    init(_ target: WebView.Coordinator) { self.target = target }
    func userContentController(_ ucc: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(ucc, didReceive: message)
    }
}

// MARK: - WebView

struct WebView: UIViewRepresentable {
    var onNavigationError: ((Error) -> Void)?

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        // Register cairn:// scheme to serve the dist folder
        if let distURL = Bundle.main.url(forResource: "index", withExtension: "html",
                                         subdirectory: "dist")?.deletingLastPathComponent() {
            configuration.setURLSchemeHandler(DistSchemeHandler(distURL: distURL),
                                              forURLScheme: "cairn")
            print("✅ DistSchemeHandler registered for cairn://localhost/")
        } else {
            print("❌ Could not locate dist/ in app bundle")
        }

        // Bridge JavaScript console and uncaught errors to Xcode's console
        let ucc = WKUserContentController()
        ucc.add(WeakMessageHandler(context.coordinator), name: "xcodeBridge")
        ucc.addUserScript(WKUserScript(source: Self.consoleBridgeScript,
                                       injectionTime: .atDocumentStart,
                                       forMainFrameOnly: false))
        configuration.userContentController = ucc

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.scrollView.bounces = true
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.allowsLinkPreview = false
        webView.navigationDelegate = context.coordinator

        webView.load(URLRequest(url: URL(string: "cairn://localhost/")!))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    // Bridges console.log/warn/error and uncaught errors to Xcode's debug console.
    // All JS output appears as 🌐 JS[LOG/WARN/ERROR] in Xcode's output.
    static let consoleBridgeScript = """
    (function() {
        function send(level, args) {
            var msg = Array.from(args).map(function(a) {
                try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
                catch(e) { return String(a); }
            }).join(' ');
            window.webkit.messageHandlers.xcodeBridge.postMessage({level: level, msg: msg});
        }
        var orig = {log: console.log, warn: console.warn, error: console.error};
        console.log   = function() { orig.log.apply(console, arguments);   send('LOG',   arguments); };
        console.warn  = function() { orig.warn.apply(console, arguments);  send('WARN',  arguments); };
        console.error = function() { orig.error.apply(console, arguments); send('ERROR', arguments); };
        window.addEventListener('unhandledrejection', function(e) {
            send('ERROR', ['[UnhandledRejection] ' + (e.reason && e.reason.message
                ? e.reason.message : JSON.stringify(e.reason))]);
        });
        window.addEventListener('error', function(e) {
            send('ERROR', ['[GlobalError] ' + e.message]);
        });
    })();
    """

    // MARK: - Coordinator

    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        let parent: WebView

        // Domains required for Microsoft SSO (MSAL) and Google Fonts.
        // All other external navigation is blocked.
        private let allowedExternalHosts: [String] = [
            "login.microsoftonline.com",
            "login.microsoft.com",
            "login.live.com",
            "login.microsoftonline-p.com",
            "graph.microsoft.com",
            "aadcdn.msftauth.net",
            "aadcdn.msauth.net",
            "fonts.googleapis.com",
            "fonts.gstatic.com",
        ]

        init(_ parent: WebView) { self.parent = parent }

        func userContentController(_ userContentController: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            guard message.name == "xcodeBridge",
                  let body = message.body as? [String: Any],
                  let level = body["level"] as? String,
                  let msg = body["msg"] as? String else { return }
            print("🌐 JS[\(level)] \(msg)")
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("✅ WebView finished loading: \(webView.url?.absoluteString ?? "unknown")")
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            print("❌ Navigation failed: \(error.localizedDescription)")
            parent.onNavigationError?(error)
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!,
                     withError error: Error) {
            print("❌ Provisional navigation failed: \(error.localizedDescription)")
            parent.onNavigationError?(error)
        }

        func webView(_ webView: WKWebView,
                     decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.allow); return
            }
            if url.scheme == "cairn" || url.absoluteString == "about:blank" {
                decisionHandler(.allow); return
            }
            if let host = url.host {
                let isAllowed = allowedExternalHosts.contains {
                    host == $0 || host.hasSuffix(".\($0)")
                }
                if isAllowed { decisionHandler(.allow); return }
            }
            print("⚠️ Blocked external URL: \(url.absoluteString)")
            decisionHandler(.cancel)
        }
    }
}

// MARK: - ContentView

struct ContentView: View {
    var body: some View {
        WebView().ignoresSafeArea()
    }
}

#Preview { ContentView() }`;

const VITE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // "./" makes every generated path relative to the HTML file.
  // Required for WKWebView — it has no web server, so absolute paths fail.
  base: './',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})`;

const MSAL_CONFIG = `const msalConfig: Configuration = {
  auth: {
    clientId: "your-client-id",
    authority: "https://login.microsoftonline.com/your-tenant-id",
    redirectUri: "cairn://localhost/",   // ← must match what's in Azure AD
  },
}`;

const AZURE_MANIFEST = `"replyUrlsWithType": [
    {
        "url": "cairn://localhost/",
        "type": "Spa"    // ← NOT "InstalledClient"
    }
]`;

const AUTH_FLOW = `1. App loads at cairn://localhost/
2. User taps Login → MSAL.js calls loginRedirect()
3. WKWebView navigates to login.microsoftonline.com (allowed by nav policy)
4. User authenticates on Microsoft's login page
5. Microsoft redirects to cairn://localhost/#code=...
6. decidePolicyFor allows cairn:// scheme → DistSchemeHandler serves index.html
7. React reloads, MSAL calls handleRedirectPromise(), reads code from URL
8. MSAL POSTs to token endpoint (CORS allowed because cairn:// is SPA type)
9. Tokens stored, user is authenticated ✅`;

const CHECK1_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'vite-base', label: <><code>vite.config.ts</code> has <code>base: "./"</code> at the top level of defineConfig</> },
  { id: 'rebuild', label: <>Ran <code>npm run build</code> after updating vite.config.ts</> },
  { id: 'paths-html', label: <><code>dist/index.html</code> — all <code>src=</code> and <code>href=</code> start with <code>./</code></> },
  { id: 'paths-grep', label: <><code>grep -r 'src="/' dist/</code> returns no results</> },
  { id: 'paths-css', label: <><code>grep -r 'url(/' dist/</code> returns no results</> },
];

const CHECK2_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'dist-location', label: <><code>dist/</code> is at Xcode project root (same level as <code>.xcodeproj</code>), NOT inside the synchronized group</> },
  { id: 'blue-icon', label: <><code>dist/</code> folder icon in Project Navigator is <strong>blue</strong> (not yellow or gray)</> },
  { id: 'bundle-resources', label: <><code>dist/</code> appears in <strong>Target → Build Phases → Copy Bundle Resources</strong></> },
  { id: 'folder-ref', label: <>"Create folder references" was selected when adding dist (not "Create groups")</> },
];

const CHECK3_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'scheme-handler', label: <><code>ContentView.swift</code> uses <code>WKURLSchemeHandler</code> (<code>DistSchemeHandler</code>) serving at <code>cairn://localhost/</code></> },
  { id: 'weak-handler', label: <><code>WeakMessageHandler</code> wraps the coordinator to prevent retain cycle</> },
  { id: 'nav-policy', label: <><code>decidePolicyFor</code> allows <code>cairn://</code> scheme and Microsoft SSO domains</> },
  { id: 'build-ok', label: <>Project builds with no errors (<strong>Cmd+B</strong>)</> },
  { id: 'console-ok', label: <>Xcode console shows <code>✅ DistSchemeHandler registered</code> and <code>✅ WebView finished loading</code></> },
];

const CHECK4_ITEMS: { id: string; label: React.ReactNode }[] = [
  { id: 'redirect-uri', label: <><code>redirectUri: "cairn://localhost/"</code> set in MSAL config</> },
  { id: 'rebuilt', label: <>Rebuilt <code>dist/</code> after changing MSAL config</> },
  { id: 'azure-spa', label: <>Azure AD manifest: <code>cairn://localhost/</code> has <code>"type": "Spa"</code> (not <code>"InstalledClient"</code>)</> },
];

function useChecklist(prefix: string) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}')[prefix] ?? {}; }
    catch { return {}; }
  });
  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    try {
      const all = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}');
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify({ ...all, [prefix]: next }));
    } catch { /* ignore */ }
  };
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
      <button className="copy-btn" type="button" onClick={copy}>{copied ? 'Copied!' : 'Copy'}</button>
      {children}
    </pre>
  );
}

export default function WKWebViewGuide() {
  const { readSections, currentSection, setRef, pct } = useGuideProgress(SECTIONS.map(s => s.id));
  const { query, setQuery, filtered: filteredSections } = useGuideSearch(SECTIONS);

  return (
    <div className="kb-warm-guide">
      <aside id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#2A4A5C" />
              <rect x="6" y="8" width="16" height="12" rx="2" fill="white" opacity="0.9" />
              <rect x="9" y="11" width="10" height="6" rx="1" fill="#2A4A5C" opacity="0.7" />
            </svg>
            <span className="sidebar-title">WKWebView Guide</span>
          </div>
          <div className="sidebar-sub">Vite React → iOS App Bundle</div>
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
              filteredSections.map(s => {
                const i = SECTIONS.findIndex(o => o.id === s.id);
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`nav-item${readSections.has(s.id) ? ' done' : ''}${currentSection === s.id ? ' active' : ''}`}
                  >
                    <span className="nav-num">{i + 1}</span>
                    {s.icon} {s.title}
                  </a>
                );
              })
            )}
          </div>
        </nav>
      </aside>

      <main>
        <div className="hero">
          <div className="hero-tag">📱 Cairn iOS Integration · 2026</div>
          <h1>
            Vite React App
            <br />
            Inside WKWebView
          </h1>
          <p>
            The complete guide to wrapping a Vite/React app in a native iOS shell — bundled assets,
            custom URL scheme, Microsoft SSO via MSAL.js, and Safari DevTools debugging.
            Written from the real Cairn deployment.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">9</span><span className="hero-stat-label">Sections</span></div>
            <div className="hero-stat"><span className="hero-stat-val">cairn://</span><span className="hero-stat-label">URL Scheme</span></div>
            <div className="hero-stat"><span className="hero-stat-val">MSAL.js</span><span className="hero-stat-label">Auth</span></div>
            <div className="hero-stat"><span className="hero-stat-val">offline</span><span className="hero-stat-label">Works fully</span></div>
          </div>
        </div>

        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>Why Bundle vs Live URL</h2>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              <strong>Your instinct was correct.</strong> Loading a live <code>https://</code> URL in WKWebView
              is the approach that gets rejected. Bundling the <code>dist/</code> folder into the
              <code>.app</code> binary is both safer for App Store review and fully offline.
            </div>
          </div>

          <h3>The Two Approaches Compared</h3>
          <table>
            <tbody>
              <tr><th>Approach</th><th>App Store risk</th><th>Offline</th><th>Updates</th></tr>
              <tr>
                <td><strong>WKWebView → live URL</strong> (e.g. <code>https://cairn.nintek.com</code>)</td>
                <td style={{ color: 'var(--rust)' }}>❌ High — Guideline 4.2 rejection</td>
                <td>❌ No</td>
                <td>Deploy only</td>
              </tr>
              <tr>
                <td><strong>Bundled dist/ in .app</strong> (this guide)</td>
                <td style={{ color: 'var(--sage)' }}>✅ Safe — self-contained app</td>
                <td>✅ Yes</td>
                <td>Xcode build</td>
              </tr>
            </tbody>
          </table>

          <h3>What "Bundled" Actually Means</h3>
          <p>
            "Bundled" only refers to the <strong>frontend assets</strong> (HTML, JS, CSS). The backend
            and database are not bundled and don't change at all.
          </p>
          <div className="arch-diagram">
            <span className="highlight">iPhone (.app binary)</span><br />
            <span className="dim">├── dist/ (compiled React — bundled into the app)</span><br />
            <span className="dim">│   ├── index.html</span><br />
            <span className="dim">│   └── assets/*.js *.css</span><br />
            <span className="dim">│</span><br />
            <span className="dim">│  API calls over HTTPS (same as before)</span><br />
            <span className="dim">▼</span><br />
            <span className="highlight">Your backend server</span><br />
            <span className="dim">├── Node.js + Express (unchanged)</span><br />
            <span className="dim">├── SQLite / database (unchanged)</span><br />
            <span className="dim">└── OID isolation, auth — all unchanged</span>
          </div>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>API calls still go to your server.</strong> The only thing that changes is
              where the HTML/JS/CSS is loaded from. User data, auth, and database logic are identical.
              The app needs internet for data — just like the web app does.
            </div>
          </div>

          <h3>Apple Guideline 4.2 — The "Thin Wrapper" Rule</h3>
          <p>The exact rejection text:</p>
          <div className="card" style={{ fontStyle: 'italic', borderLeft: '3px solid var(--rust)', paddingLeft: 16 }}>
            "Your app appears to be a simple webpage or website packaged as an app."
          </div>
          <p style={{ marginTop: 16 }}>
            <strong>Your bundled approach is safe because:</strong> all content is inside the <code>.app</code>,
            the app works offline, and there's no URL a reviewer can open in Safari to see the same thing.
            For SSO-gated apps (like Cairn), the content isn't even publicly accessible — the strongest
            possible position.
          </p>

          <h3>One Required API Change</h3>
          <p>
            In the web app, <code>/api/recipes</code> resolves against the server that served the page.
            In WKWebView it resolves against <code>cairn://localhost/</code> — which goes nowhere.
            Set an absolute base URL in your API layer:
          </p>
          <CodePre>{`// constants/api.ts (or wherever your API base is)
export const API_BASE = 'https://your-backend.com'   // absolute, not relative

// Usage stays the same:
fetch(\`\${API_BASE}/api/recipes\`)`}</CodePre>
          <p>
            Also add your backend domain to <code>allowedExternalHosts</code> in{' '}
            <code>ContentView.swift</code> (Section 5).
          </p>
        </section>

        <hr />

        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Fix Vite Config</h2>

          <h3>Why Absolute Paths Break WKWebView</h3>
          <p>
            A default Vite build produces <code>src="/assets/index.js"</code> — absolute paths that
            assume a web server at the root. WKWebView has no web server. It loads content from a
            custom URL (<code>cairn://localhost/</code>), so <code>/assets/</code> resolves to
            nothing. The fix: make every path <strong>relative</strong>.
          </p>

          <table>
            <tbody>
              <tr><th>Default Vite output</th><th>After fix (<code>base: "./"</code>)</th></tr>
              <tr>
                <td><code>src="/assets/index-ABC.js"</code></td>
                <td><code>src="./assets/index-ABC.js"</code></td>
              </tr>
              <tr>
                <td><code>href="/assets/index-ABC.css"</code></td>
                <td><code>href="./assets/index-ABC.css"</code></td>
              </tr>
            </tbody>
          </table>

          <h3>The One-Line Change</h3>
          <p>
            Open <code>vite.config.ts</code> in the root of your React project (next to{' '}
            <code>package.json</code>) and add <code>base: './'</code>:
          </p>
          <CodePre>{VITE_CONFIG}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Don't put <code>base</code> inside <code>build: {'{}'}</code></strong> — it must be
              at the top level of <code>defineConfig</code>. Putting it inside <code>build</code>
              has no effect and Vite won't warn you.
            </div>
          </div>

          <h3>Separate Repo for iOS Build</h3>
          <p>
            Don't modify your production repo's vite.config.ts. Use a separate copy of the repo
            (e.g. <code>Cairn_test/</code>) with this one change. See the iOS WebApp Deployment
            Playbook guide for the recommended three-folder workflow.
          </p>
        </section>

        <hr />

        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Build & Verify</h2>

          <h3>Run the Build</h3>
          <CodePre>{`# In the root of your React project (with the modified vite.config.ts)
npm install        # if first run
npm run build`}</CodePre>

          <h3>Verify the Output</h3>
          <p>Open <code>dist/index.html</code> and confirm:</p>
          <CodePre>{`<!-- CORRECT — relative paths (what you want) -->
<script type="module" crossorigin src="./assets/index-CLEsADsU.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-iTzr2naf.css">

<!-- WRONG — absolute paths (still broken) -->
<script src="/assets/index-CLEsADsU.js"></script>`}</CodePre>

          <p>Run these grep checks — all three should return no output:</p>
          <CodePre>{`grep -r 'src="/' dist/
grep -r 'href="/' dist/
grep -r 'url(/' dist/`}</CodePre>

          <h3>Expected dist/ Structure</h3>
          <CodePre>{`dist/
├── index.html
├── favicon.svg
└── assets/
    ├── index-XXXXXXXX.js    ← hash changes each build
    └── index-XXXXXXXX.css`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>Google Fonts warning:</strong> If your <code>index.html</code> loads fonts
              from <code>fonts.googleapis.com</code>, the app needs internet to display them.
              For true offline fonts, download <code>.woff2</code> files and self-host them in{' '}
              <code>public/fonts/</code>.
            </div>
          </div>
        </section>

        <hr />

        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Xcode Setup</h2>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Xcode 16 critical warning — Synchronized Root Groups.</strong> Xcode 16
              uses <code>PBXFileSystemSynchronizedRootGroup</code>, a new format that auto-manages
              files inside the app target's folder. If you place <code>dist/</code> inside the
              synchronized group, Xcode will either silently exclude <code>.html</code>,{' '}
              <code>.js</code>, and <code>.css</code> files (unknown types) or flatten the folder
              structure, breaking all relative asset paths.
            </div>
          </div>

          <h3>Where to Place dist/</h3>
          <CodePre>{`Cairn_test/                    ← Xcode project root
├── Cairn_test.xcodeproj
├── dist/                      ← dist goes HERE (project root)
│   ├── index.html
│   └── assets/
└── Cairn_test/                ← synchronized group — DO NOT put dist inside here
    ├── ContentView.swift
    └── ...`}</CodePre>

          <h3>Adding dist/ as a Folder Reference</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>Right-click the <strong>top-level project entry</strong> in the Project Navigator (not the target group)</li>
            <li>Choose <strong>"Add Files to 'Cairn_test'…"</strong></li>
            <li>Navigate to and select the <code>dist</code> folder</li>
            <li>
              In the dialog at the bottom, select{' '}
              <strong>"Create folder references"</strong> (NOT "Create groups")
            </li>
            <li>Ensure the target checkbox is checked</li>
            <li>Click <strong>Add</strong></li>
          </ol>

          <h3>Folder Reference vs Group</h3>
          <table>
            <tbody>
              <tr><th>Option</th><th>Icon</th><th>What Xcode does</th><th>Result</th></tr>
              <tr>
                <td>Create groups</td>
                <td>🟡 Yellow</td>
                <td>Manages each file individually</td>
                <td style={{ color: 'var(--rust)' }}>❌ Loses subfolder structure</td>
              </tr>
              <tr>
                <td>Create folder references</td>
                <td>🔵 Blue</td>
                <td>Copies directory tree intact</td>
                <td style={{ color: 'var(--sage)' }}>✅ dist/assets/index.js stays intact</td>
              </tr>
            </tbody>
          </table>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              After adding, verify: the <code>dist</code> icon in the navigator is <strong>blue</strong>,
              and <code>dist</code> appears in <strong>Target → Build Phases → Copy Bundle Resources</strong>.
              Once set up as a folder reference, Xcode picks up new files automatically — no need to
              re-add after each <code>npm run build</code>.
            </div>
          </div>
        </section>

        <hr />

        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>ContentView.swift</h2>

          <h3>Why Not <code>file://</code></h3>
          <p>
            The simpler approach — <code>webView.loadFileURL(...)</code> — loads content but breaks
            Microsoft SSO. Azure AD rejects <code>file://</code> as an OAuth redirect URI scheme
            (<code>AADSTS50011: invalid scheme</code>). The solution is a{' '}
            <code>WKURLSchemeHandler</code> that serves <code>dist/</code> at{' '}
            <code>cairn://localhost/</code>. This gives the app a real HTTP-like origin that Azure
            AD accepts.
          </p>

          <h3>Key Design Decisions</h3>
          <table>
            <tbody>
              <tr><th>Feature</th><th>Why</th></tr>
              <tr>
                <td><code>DistSchemeHandler</code></td>
                <td>Serves <code>dist/</code> at <code>cairn://localhost/</code> — real origin, not <code>file://</code></td>
              </tr>
              <tr>
                <td><code>WeakMessageHandler</code></td>
                <td>Prevents retain cycle: <code>WKUserContentController</code> holds message handlers strongly</td>
              </tr>
              <tr>
                <td>Console bridge</td>
                <td>All JS <code>console.log/warn/error</code> and uncaught errors appear in Xcode as <code>🌐 JS[...]</code></td>
              </tr>
              <tr>
                <td>SPA fallback</td>
                <td>Paths with no file extension serve <code>index.html</code> — React Router BrowserRouter works</td>
              </tr>
              <tr>
                <td><code>allowedExternalHosts</code></td>
                <td>Whitelist of external domains; everything else is blocked by <code>decidePolicyFor</code></td>
              </tr>
            </tbody>
          </table>

          <h3>Complete ContentView.swift</h3>
          <p>
            Replace the entire contents of <code>ContentView.swift</code> with this. Add your
            backend API domain to <code>allowedExternalHosts</code> if your app calls an external
            server.
          </p>
          <CodePre>{CONTENT_VIEW_SWIFT}</CodePre>
        </section>

        <hr />

        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Microsoft SSO / MSAL</h2>

          <div className="card-grid">
            <div className="stat-card"><div className="stat-card-val">2</div><div className="stat-card-label">Changes needed</div></div>
            <div className="stat-card"><div className="stat-card-val">SPA</div><div className="stat-card-label">Platform type in Azure AD</div></div>
            <div className="stat-card"><div className="stat-card-val">CORS</div><div className="stat-card-label">Why SPA type matters</div></div>
          </div>

          <h3>Why the Two-Part Fix Is Required</h3>
          <p>
            Adding Microsoft domains to <code>allowedExternalHosts</code> lets the WKWebView
            navigate to Microsoft's login page and get redirected back. But then MSAL.js needs to{' '}
            <strong>exchange the auth code for tokens</strong> via a POST to the token endpoint.
            That POST is a <code>fetch()</code> call from JavaScript — it needs{' '}
            <strong>CORS</strong> to be enabled on Microsoft's token endpoint.
          </p>
          <p>
            CORS on the token endpoint is only enabled for redirect URIs registered under the{' '}
            <strong>SPA platform</strong> in Azure AD. The "Mobile and desktop applications"
            platform (<code>InstalledClient</code>) does not configure CORS.
          </p>

          <h3>Part 1 — Update MSAL Config in React</h3>
          <CodePre>{MSAL_CONFIG}</CodePre>

          <p>Rebuild after this change: <code>npm run build</code>, then replace <code>dist/</code> in Xcode.</p>

          <h3>Part 2 — Update Azure AD App Registration Manifest</h3>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              The Azure portal UI only accepts <code>https://</code> URIs for the SPA platform.
              You must use the <strong>Manifest editor</strong> to register a custom scheme as SPA type —
              the portal UI won't let you do it through the Authentication tab.
            </div>
          </div>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>Azure Portal → Azure Active Directory → App registrations → your app</li>
            <li>Click <strong>Manifest</strong> in the left sidebar</li>
            <li>Find <code>replyUrlsWithType</code> and update the entry:</li>
          </ol>
          <CodePre>{AZURE_MANIFEST}</CodePre>
          <ol start={4} style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>Click <strong>Save</strong></li>
          </ol>

          <h3>Full Auth Flow</h3>
          <CodePre>{AUTH_FLOW}</CodePre>

          <h3>sessionStorage Persistence</h3>
          <p>
            MSAL.js stores PKCE state (code verifier, nonce) in <code>sessionStorage</code> before
            redirecting to Microsoft. When WKWebView navigates away to{' '}
            <code>login.microsoftonline.com</code> and back, <code>sessionStorage</code> for{' '}
            <code>cairn://localhost</code> is preserved — the same WKWebView instance maintains a
            single browsing session, just like a browser tab.
          </p>

          <h3>SSO Troubleshooting</h3>
          <table>
            <tbody>
              <tr><th>Error</th><th>Cause</th><th>Fix</th></tr>
              <tr>
                <td><code>AADSTS50011: invalid scheme</code></td>
                <td><code>redirectUri</code> is <code>file://</code> or not set</td>
                <td>Set <code>redirectUri: "cairn://localhost/"</code> in MSAL config</td>
              </tr>
              <tr>
                <td>CORS error / <code>Failed to fetch</code></td>
                <td><code>cairn://localhost/</code> is <code>InstalledClient</code> type</td>
                <td>Change to <code>Spa</code> in Azure AD manifest</td>
              </tr>
              <tr>
                <td><code>state_not_found</code></td>
                <td>sessionStorage cleared between navigations</td>
                <td>Ensure WKWebView instance is not recreated</td>
              </tr>
              <tr>
                <td><code>interaction_in_progress</code></td>
                <td>Previous login wasn't completed</td>
                <td>Clear app data / reinstall</td>
              </tr>
              <tr>
                <td>Blocked URL in console</td>
                <td>Required domain not in allowlist</td>
                <td>Add domain to <code>allowedExternalHosts</code></td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr />

        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Debugging</h2>

          <h3>JavaScript Console Bridge (Built-in)</h3>
          <p>
            The <code>ContentView.swift</code> in Section 5 includes a built-in console bridge.
            All JavaScript output appears in Xcode's debug console:
          </p>
          <CodePre>{`🌐 JS[LOG] MSAL initialized
🌐 JS[ERROR] [UnhandledRejection] Failed to fetch
🌐 JS[WARN] Slow render detected`}</CodePre>

          <h3>Safari Web Inspector (Full DevTools)</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>iPhone: <strong>Settings → Safari → Advanced → Web Inspector: ON</strong></li>
            <li>Connect iPhone to Mac via USB</li>
            <li>Mac Safari: <strong>Develop → [Your iPhone] → [Your App's WebView]</strong></li>
            <li>Full DevTools: Console, Network, Sources</li>
          </ol>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            Also works on Simulator: Safari → Develop → Simulator.
          </p>

          <h3>White Screen — Work Through This in Order</h3>
          <table>
            <tbody>
              <tr><th>Check</th><th>What to look for</th><th>Fix if wrong</th></tr>
              <tr>
                <td>1. Paths in dist/index.html</td>
                <td><code>src="./assets/..."</code> (leading dot)</td>
                <td>Add <code>base: "./"</code> to vite.config.ts, rebuild</td>
              </tr>
              <tr>
                <td>2. dist in bundle</td>
                <td>Add debug print: <code>Bundle.main.resourcePath</code> — <code>dist</code> must appear</td>
                <td>Re-add dist as folder reference at project root</td>
              </tr>
              <tr>
                <td>3. dist icon color</td>
                <td>Blue in Project Navigator</td>
                <td>Delete and re-add with "Create folder references"</td>
              </tr>
              <tr>
                <td>4. dist location</td>
                <td>At project root (same level as <code>.xcodeproj</code>)</td>
                <td>Move dist out of the synchronized group folder</td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr />

        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Final Checklist</h2>

          <h3>Vite Configuration & Build Output</h3>
          <Checklist prefix="vite" items={CHECK1_ITEMS} />

          <h3>Xcode Project Setup</h3>
          <Checklist prefix="xcode" items={CHECK2_ITEMS} />

          <h3>Swift Code & Device</h3>
          <Checklist prefix="swift" items={CHECK3_ITEMS} />

          <h3>Microsoft SSO (skip if not using MSAL)</h3>
          <Checklist prefix="msal" items={CHECK4_ITEMS} />
        </section>

        <hr />

        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Optional Enhancements</h2>

          <h3>JS ↔ Swift Bridge</h3>
          <p>Call native Swift from JavaScript:</p>
          <CodePre>{`// TypeScript — call Swift from React
declare global {
  interface Window {
    webkit?: { messageHandlers?: { nativeBridge?: { postMessage: (msg: object) => void } } }
  }
}
function callNative(action: string, payload?: object) {
  window.webkit?.messageHandlers?.nativeBridge?.postMessage({ action, ...payload })
}
// Usage: <button onClick={() => callNative('hapticFeedback')}>Press</button>`}</CodePre>

          <CodePre>{String.raw`// Swift — receive the message in Coordinator
func userContentController(_ ucc: WKUserContentController,
                            didReceive message: WKScriptMessage) {
    guard let body = message.body as? [String: Any],
          let action = body["action"] as? String else { return }
    switch action {
    case "hapticFeedback":
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
    default:
        break
    }
}`}</CodePre>

          <h3>Call JavaScript from Swift</h3>
          <CodePre>{String.raw`webView.evaluateJavaScript(
    "window.dispatchEvent(new CustomEvent('nativeEvent', { detail: { type: 'userLoggedIn' } }))"
) { _, _ in }`}</CodePre>

          <h3>Performance Tweaks</h3>
          <CodePre>{String.raw`// Pre-warm WebView process on app launch:
let _ = WKWebView(frame: .zero, configuration: WKWebViewConfiguration())

// Enable inline video playback:
configuration.allowsInlineMediaPlayback = true

// DevTools in debug builds only:
#if DEBUG
configuration.preferences.setValue(true, forKey: "developerExtrasEnabled")
#endif`}</CodePre>

          <h3>Offline (No Extra Work Needed)</h3>
          <p>
            Since all assets are bundled in the <code>.app</code>, the UI loads instantly with
            no internet. Service Workers aren't needed — you're already offline-first for the
            frontend. For dynamic data, use <code>localStorage</code>, <code>IndexedDB</code>,
            or your API with appropriate caching.
          </p>
        </section>

        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--rust)', marginBottom: 8 }}>
            📱 WKWebView Integration Guide
          </div>
          Written from the Cairn iOS deployment · June 2026
          <br />
          See also: <em>iOS WebApp Deployment Playbook</em> for the generic multi-app workflow
        </div>
      </main>
    </div>
  );
}
