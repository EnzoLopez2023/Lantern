import { useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../app/storage/scopedStorage';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1', title: 'The Approach', icon: '🗺️' },
  { id: 's2', title: 'Phase 1 — Prepare Web App', icon: '⚡' },
  { id: 's3', title: 'Phase 2 — Xcode Project', icon: '🛠️' },
  { id: 's4', title: 'Phase 3 — WKWebView Shell', icon: '📱' },
  { id: 's5', title: 'Phase 4 — Azure AD / SSO', icon: '🔐' },
  { id: 's6', title: 'Phase 5 — Updating the App', icon: '🔄' },
  { id: 's7', title: 'Phase 6 — Device & Signing', icon: '🍎' },
  { id: 's8', title: 'Phase 7 — Debugging', icon: '🐛' },
  { id: 's9', title: 'Phase 8 — App Store', icon: '🚀' },
  { id: 's10', title: 'Quick Reference', icon: '📋' },
];

const CHECKLIST_KEY = 'hearth-ios-playbook-checks';

const VITE_CONFIG = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  base: './',   // ← THE ONLY REQUIRED CHANGE

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})`;

const MSAL_CONFIG = `const msalConfig = {
  auth: {
    clientId: "your-client-id",
    authority: "https://login.microsoftonline.com/your-tenant-id",
    redirectUri: "myapp://localhost/",   // ← must match your custom scheme
  },
}`;

const GENERIC_CONTENT_VIEW = String.raw`import SwiftUI
import WebKit

// Serves the bundled dist/ folder at myapp://localhost/
// Custom scheme gives the app a real origin, required for:
//   - OAuth/MSAL redirect URIs (file:// is rejected by Azure AD)
//   - CORS on API token endpoints
//   - Consistent behavior across Xcode versions
private class DistSchemeHandler: NSObject, WKURLSchemeHandler {
    private let distURL: URL
    init(distURL: URL) { self.distURL = distURL }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let requestURL = urlSchemeTask.request.url else {
            urlSchemeTask.didFailWithError(URLError(.badURL)); return
        }
        let requestPath = requestURL.path
        let relativePath = requestPath.isEmpty || requestPath == "/"
            ? "index.html" : String(requestPath.dropFirst())
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
            // React Router SPA fallback: paths without extensions are client-side routes
            if fileURL.pathExtension.isEmpty {
                let indexURL = distURL.appendingPathComponent("index.html")
                guard let data = try? Data(contentsOf: indexURL) else {
                    urlSchemeTask.didFailWithError(error); return
                }
                let response = URLResponse(url: requestURL, mimeType: "text/html",
                    expectedContentLength: data.count, textEncodingName: "utf-8")
                urlSchemeTask.didReceive(response)
                urlSchemeTask.didReceive(data)
                urlSchemeTask.didFinish()
            } else {
                urlSchemeTask.didFailWithError(error)
            }
        }
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {}

    private static func mimeType(for ext: String) -> String {
        switch ext.lowercased() {
        case "html": return "text/html"
        case "js", "mjs": return "text/javascript"
        case "css": return "text/css"
        case "json": return "application/json"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "svg": return "image/svg+xml"
        case "ico": return "image/x-icon"
        case "woff": return "font/woff"
        case "woff2": return "font/woff2"
        default: return "application/octet-stream"
        }
    }
}

private class WeakMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WebView.Coordinator?
    init(_ target: WebView.Coordinator) { self.target = target }
    func userContentController(_ ucc: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(ucc, didReceive: message)
    }
}

struct WebView: UIViewRepresentable {
    // ← Replace "myapp" with your actual custom scheme (lowercase, no spaces)
    private let appScheme = "myapp"

    var onNavigationError: ((Error) -> Void)?
    func makeCoordinator() -> Coordinator { Coordinator(self) }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        if let distURL = Bundle.main.url(forResource: "index", withExtension: "html",
                                         subdirectory: "dist")?.deletingLastPathComponent() {
            configuration.setURLSchemeHandler(DistSchemeHandler(distURL: distURL),
                                              forURLScheme: appScheme)
            print("✅ Serving dist/ at \(appScheme)://localhost/")
        } else {
            print("❌ dist/index.html not found in app bundle")
        }

        let ucc = WKUserContentController()
        ucc.add(WeakMessageHandler(context.coordinator), name: "xcodeBridge")
        ucc.addUserScript(WKUserScript(source: Self.consoleBridgeScript,
                                       injectionTime: .atDocumentStart, forMainFrameOnly: false))
        configuration.userContentController = ucc

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.scrollView.bounces = true
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.allowsLinkPreview = false
        webView.navigationDelegate = context.coordinator
        webView.load(URLRequest(url: URL(string: "\(appScheme)://localhost/")!))
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

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
        console.log   = function() { orig.log.apply(console, arguments); send('LOG', arguments); };
        console.warn  = function() { orig.warn.apply(console, arguments); send('WARN', arguments); };
        console.error = function() { orig.error.apply(console, arguments); send('ERROR', arguments); };
        window.addEventListener('unhandledrejection', function(e) {
            send('ERROR', ['[UnhandledRejection] ' + (e.reason && e.reason.message
                ? e.reason.message : JSON.stringify(e.reason))]);
        });
        window.addEventListener('error', function(e) { send('ERROR', ['[GlobalError] ' + e.message]); });
    })();
    """

    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
        let parent: WebView

        // Add the external domains your app needs. Remove what you don't use.
        private let allowedExternalHosts: [String] = [
            "login.microsoftonline.com",   // Microsoft SSO
            "login.microsoft.com",
            "login.live.com",
            "login.microsoftonline-p.com",
            "graph.microsoft.com",
            "aadcdn.msftauth.net",
            "aadcdn.msauth.net",
            "fonts.googleapis.com",        // Google Fonts (if used)
            "fonts.gstatic.com",
            // "your-api.azurewebsites.net",  // your backend API
            // "accounts.google.com",          // Google OAuth (if needed)
        ]

        init(_ parent: WebView) { self.parent = parent }

        func userContentController(_ ucc: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            guard message.name == "xcodeBridge",
                  let body = message.body as? [String: Any],
                  let level = body["level"] as? String,
                  let msg = body["msg"] as? String else { return }
            print("🌐 JS[\(level)] \(msg)")
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("✅ Loaded: \(webView.url?.absoluteString ?? "unknown")")
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
            if url.scheme == parent.appScheme || url.absoluteString == "about:blank" {
                decisionHandler(.allow); return
            }
            if let host = url.host {
                let isAllowed = allowedExternalHosts.contains {
                    host == $0 || host.hasSuffix(".\($0)")
                }
                if isAllowed { decisionHandler(.allow); return }
            }
            print("⚠️ Blocked: \(url.absoluteString)")
            decisionHandler(.cancel)
        }
    }
}

struct ContentView: View {
    var body: some View {
        WebView().ignoresSafeArea()
    }
}

#Preview { ContentView() }`;

const AZURE_MANIFEST = `"replyUrlsWithType": [
    {
        "url": "myapp://localhost/",
        "type": "Spa"    // ← NOT "InstalledClient"
    }
]`;

const UPDATE_SCRIPT = `# 1. Make changes in MyAppForMac (your iOS-modified copy)
cd /Users/enzo/repos/MyAppForMac

# 2. Rebuild
npm run build

# 3. Replace dist in the Xcode project
rm -rf /Users/enzo/repos/MyApp_iOS/dist
cp -r dist /Users/enzo/repos/MyApp_iOS/dist

# 4. In Xcode, press Cmd+R to rebuild and run`;

const PRIVACY_INFO = `<!-- PrivacyInfo.xcprivacy — required since Spring 2024 -->
<!-- File → New File → search "App Privacy" → App Privacy template -->
<!-- Add to your app target (same folder as ContentView.swift) -->

Privacy Nutrition Label:
  If you collect no personal data beyond app function → "Data Not Collected"
  If SSO stores user identity → declare "User ID" as appropriate

Required Reason APIs (common for WKWebView apps):
  NSUserDefaults → CA92.1 (user-facing settings)
  File timestamp APIs → DDA9.1 (app functionality)`;

const INFOPLIST = `<!-- Info.plist — required additions -->

<!-- Restrict to HTTPS only (required for App Store) -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
</dict>

<!-- Only add the keys for permissions your app actually uses: -->
<!-- Camera via WKWebView -->
<key>NSCameraUsageDescription</key>
<string>Camera is used for [specific feature].</string>

<!-- Microphone -->
<key>NSMicrophoneUsageDescription</key>
<string>Microphone is used for [specific feature].</string>`;

const WEB_CHECKLIST: { id: string; label: React.ReactNode }[] = [
  { id: 'vite-base', label: <><code>base: "./"</code> in <code>vite.config.ts</code></> },
  { id: 'redirect-uri', label: <><code>redirectUri: "myapp://localhost/"</code> in auth config (if using SSO)</> },
  { id: 'build', label: <><code>npm run build</code> ran successfully</> },
  { id: 'paths', label: <><code>dist/index.html</code> — all paths start with <code>./</code></> },
];

const XCODE_CHECKLIST: { id: string; label: React.ReactNode }[] = [
  { id: 'dist-root', label: <><code>dist/</code> is at Xcode project root (NOT inside <code>MyApp_iOS/MyApp_iOS/</code>)</> },
  { id: 'blue', label: <><code>dist/</code> has <strong>blue</strong> folder icon in Project Navigator</> },
  { id: 'bundle-resources', label: <><code>dist/</code> in Build Phases → Copy Bundle Resources</> },
  { id: 'content-view', label: <><code>ContentView.swift</code> uses <code>WKURLSchemeHandler</code> with your custom scheme</> },
  { id: 'scheme-match', label: <><code>appScheme</code> in Swift matches <code>redirectUri</code> scheme in web app</> },
  { id: 'build-ok', label: <>Project builds: <strong>Cmd+B</strong></> },
];

const AZURE_CHECKLIST: { id: string; label: React.ReactNode }[] = [
  { id: 'spa-type', label: <><code>myapp://localhost/</code> in Azure AD manifest <code>replyUrlsWithType</code> with <code>"type": "Spa"</code></> },
];

const STORE_CHECKLIST: { id: string; label: React.ReactNode }[] = [
  { id: 'icon', label: <>App icon: 1024×1024 PNG, no transparency, in <code>Assets.xcassets</code></> },
  { id: 'launch', label: <>Launch screen customized (no blank white flash on startup)</> },
  { id: 'privacy-manifest', label: <><code>PrivacyInfo.xcprivacy</code> added to app target and filled in</> },
  { id: 'ats', label: <><code>NSAllowsArbitraryLoads: false</code> in <code>Info.plist</code></> },
  { id: 'privacy-url', label: <>Privacy Policy URL exists and is publicly accessible</> },
  { id: 'support-url', label: <>Support URL exists and is publicly accessible</> },
  { id: 'screenshots', label: <>Screenshots captured for 6.9" iPhone (iPhone 16 Pro Max, 1320×2868 px)</> },
  { id: 'listing', label: <>App Store Connect listing complete (name, description, keywords, age rating)</> },
  { id: 'export', label: <>Export compliance answered: "Yes, uses standard encryption" → exemption applies</> },
  { id: 'version', label: <>Version <code>1.0</code>, Build <code>1</code> set in Xcode</> },
  { id: 'device-selector', label: <>Device selector set to <strong>"Any iOS Device (arm64)"</strong> before archiving</> },
  { id: 'validated', label: <>Archive validates with no errors in Organizer</> },
  { id: 'uploaded', label: <>Build uploaded and visible in App Store Connect</> },
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

export default function IosPlaybookGuide() {
  const { readSections, currentSection, setRef, pct } = useGuideProgress(SECTIONS.map(s => s.id));
  const { query, setQuery, filtered: filteredSections } = useGuideSearch(SECTIONS);

  return (
    <div className="kb-warm-guide">
      <aside id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#4A2A5C" />
              <path d="M8 7h12v14H8z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9" />
              <path d="M11 11h6M11 14h6M11 17h4" stroke="white" strokeWidth="1.2" opacity="0.7" />
            </svg>
            <span className="sidebar-title">iOS Playbook</span>
          </div>
          <div className="sidebar-sub">Web App → App Store</div>
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
          <div className="hero-tag">📋 Generic Reusable Playbook · June 2026</div>
          <h1>
            iOS WebApp
            <br />
            Deployment Playbook
          </h1>
          <p>
            Wrap any <strong>Vite React app</strong> in a native iOS shell and ship it to the
            App Store. Generic, reusable across all apps in the fleet. Covers every phase from
            project setup to App Store approval.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">8</span><span className="hero-stat-label">Phases</span></div>
            <div className="hero-stat"><span className="hero-stat-val">any</span><span className="hero-stat-label">Vite React app</span></div>
            <div className="hero-stat"><span className="hero-stat-val">$99</span><span className="hero-stat-label">Apple Dev / yr</span></div>
            <div className="hero-stat"><span className="hero-stat-val">offline</span><span className="hero-stat-label">Works fully</span></div>
          </div>
        </div>

        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Approach</h2>

          <p>
            You have a React/Vite web app. You want it on iPhone without rewriting it. The approach:
          </p>
          <div className="timeline">
            {[
              { n: '1', title: 'Bundle the build', desc: 'Run npm run build in an iOS-specific copy of your repo. The compiled dist/ folder becomes part of the .app binary.' },
              { n: '2', title: 'WKWebView shell', desc: 'A minimal Swift app wraps the WKWebView and serves the bundled dist/ at a custom URL scheme (e.g. myapp://localhost/).' },
              { n: '3', title: 'Backend unchanged', desc: 'Your server, database, OID isolation, and auth all stay exactly as-is. API calls go over HTTPS as usual.' },
              { n: '4', title: 'Ship to App Store', desc: 'Bundled content = self-contained app = passes Guideline 4.2. Works offline. No thin-wrapper rejection.' },
            ].map(t => (
              <div className="tl-item" key={t.n}>
                <div className="tl-dot">{t.n}</div>
                <div className="tl-content">
                  <div className="tl-title">{t.title}</div>
                  <div className="tl-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h3>Three-Folder Convention</h3>
          <p>
            Never modify your production repo. Use this structure — substitute your app's name:
          </p>
          <CodePre>{`/Users/enzo/repos/
├── MyApp/              ← Production repo. NEVER touch this.
├── MyAppForMac/        ← Copy of prod repo with ONE change: base: "./" in vite.config.ts
│   └── vite.config.ts  ← The only file that differs from prod
└── MyApp_iOS/          ← Xcode project (the iOS wrapper only)
    ├── MyApp_iOS.xcodeproj
    ├── dist/           ← Built output copied from MyAppForMac
    └── MyApp_iOS/
        └── ContentView.swift`}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>Why three folders?</strong> <code>MyApp</code> stays identical to production.
              <code>MyAppForMac</code> has only the Vite config change needed for WKWebView.{' '}
              <code>MyApp_iOS</code> is the Xcode project that references the built output.
            </div>
          </div>

          <h3>Custom URL Scheme — Pick One Per App</h3>
          <p>
            Every app needs a unique custom URL scheme for serving its content and for OAuth redirect
            URIs. Rules: all lowercase, no spaces, no hyphens, globally unique within your apps.
          </p>
          <table>
            <tbody>
              <tr><th>App</th><th>Scheme</th><th>Serves at</th></tr>
              <tr><td>Cairn</td><td><code>cairn</code></td><td><code>cairn://localhost/</code></td></tr>
              <tr><td>Hearth</td><td><code>hearth</code></td><td><code>hearth://localhost/</code></td></tr>
              <tr><td>GLP1</td><td><code>glpone</code></td><td><code>glpone://localhost/</code></td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Phase 1 — Prepare the Web App Repo</h2>

          <h3>Step 1: Clone or copy your production repo</h3>
          <CodePre>{`# Option A: copy
cp -r /Users/enzo/repos/MyApp /Users/enzo/repos/MyAppForMac

# Option B: fresh clone
git clone <your-repo-url> MyAppForMac`}</CodePre>

          <h3>Step 2: Edit vite.config.ts — add <code>base: "./"</code></h3>
          <CodePre>{VITE_CONFIG}</CodePre>
          <p>
            <strong>Why:</strong> Without this, Vite generates absolute paths like{' '}
            <code>/assets/index.js</code>. WKWebView serves content from{' '}
            <code>myapp://localhost/</code>, so absolute paths resolve to nothing.{' '}
            <code>base: "./"</code> makes all paths relative, so <code>./assets/index.js</code>{' '}
            resolves correctly from any base URL.
          </p>

          <h3>Step 3: Update OAuth redirect URI (if using MSAL or similar)</h3>
          <CodePre>{MSAL_CONFIG}</CodePre>
          <p>
            Replace <code>myapp</code> with your actual custom scheme. The scheme must match exactly
            what you'll register in Azure AD / your auth provider.
          </p>

          <h3>Step 4: Build and verify</h3>
          <CodePre>{`cd /Users/enzo/repos/MyAppForMac
npm install      # first time only
npm run build

# All of these should return no results:
grep -r 'src="/' dist/
grep -r 'href="/' dist/
grep -r 'url(/' dist/`}</CodePre>

          <p>
            Open <code>dist/index.html</code> and confirm every asset path starts with{' '}
            <code>./</code>. If you still see <code>/assets/...</code>, check that{' '}
            <code>base</code> is at the top level of <code>defineConfig</code> (not inside{' '}
            <code>build: {'{}'}</code>).
          </p>
        </section>

        <hr />

        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Phase 2 — Create the Xcode Project</h2>

          <h3>Step 1: New project in Xcode</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>Open Xcode → <strong>File → New → Project</strong></li>
            <li>Choose <strong>iOS → App</strong></li>
            <li>
              Fill in: Product Name: <code>MyApp_iOS</code> · Team: your Apple Developer account ·
              Organization Identifier: <code>com.yourcompany</code> · Interface: <strong>SwiftUI</strong> ·
              Language: <strong>Swift</strong> · uncheck "Include Tests"
            </li>
            <li>Save to <code>/Users/enzo/repos/</code> (NOT inside MyAppForMac)</li>
          </ol>

          <h3>Step 2: Copy dist/ to the Xcode project</h3>
          <CodePre>{`cp -r /Users/enzo/repos/MyAppForMac/dist /Users/enzo/repos/MyApp_iOS/dist`}</CodePre>

          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Xcode 16 warning.</strong> Xcode 16 uses <code>PBXFileSystemSynchronizedRootGroup</code>{' '}
              — if you place <code>dist/</code> inside the app target's synchronized folder, Xcode
              silently excludes <code>.html</code>/<code>.js</code>/<code>.css</code> files or
              flattens the directory structure. Always add <code>dist/</code> at the{' '}
              <strong>project root level</strong>, same directory as <code>.xcodeproj</code>.
            </div>
          </div>

          <h3>Step 3: Add dist/ to Xcode as a Folder Reference</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li><code>Cmd+1</code> to open Project Navigator</li>
            <li>Right-click the <strong>top-level blue project icon</strong> (not the inner target group)</li>
            <li>Choose <strong>"Add Files to 'MyApp_iOS'…"</strong></li>
            <li>Navigate to and select the <code>dist</code> folder</li>
            <li>Select <strong>"Create folder references"</strong> (NOT "Create groups")</li>
            <li>Ensure the app target checkbox is checked → click <strong>Add</strong></li>
            <li>Verify: <code>dist</code> icon is <strong>blue</strong> · it appears in Build Phases → Copy Bundle Resources</li>
          </ol>
        </section>

        <hr />

        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Phase 3 — The WKWebView Shell</h2>

          <p>
            Replace all of <code>ContentView.swift</code> with the following. Substitute{' '}
            <code>myapp</code> in <code>private let appScheme = "myapp"</code> with your actual
            custom scheme.
          </p>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>This is the generic version.</strong> For the Cairn-specific version with
              detailed inline comments, see the <em>WKWebView Integration Guide</em>.
            </div>
          </div>

          <CodePre>{GENERIC_CONTENT_VIEW}</CodePre>

          <h3>Add Your Backend Domain</h3>
          <p>
            If your app calls an external backend (which it almost certainly does), add its domain
            to <code>allowedExternalHosts</code> in the <code>Coordinator</code> class:
          </p>
          <CodePre>{`"your-app.azurewebsites.net",  // or hearth.nintek.com, etc.`}</CodePre>
        </section>

        <hr />

        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Phase 4 — Azure AD / SSO Setup</h2>
          <p>Skip this section if your app doesn't use Microsoft authentication.</p>

          <h3>Why Two Changes Are Needed</h3>
          <table>
            <tbody>
              <tr><th>Problem</th><th>Cause</th><th>Fix</th></tr>
              <tr>
                <td><code>AADSTS50011: invalid scheme</code></td>
                <td>Azure AD rejects <code>file://</code> as redirect URI</td>
                <td>Use custom scheme (<code>myapp://localhost/</code>)</td>
              </tr>
              <tr>
                <td>Login completes but auth code exchange fails</td>
                <td>Token endpoint CORS not enabled for custom scheme</td>
                <td>Register as <code>Spa</code> type in Azure AD manifest</td>
              </tr>
            </tbody>
          </table>

          <h3>Azure AD Manifest Change</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>Azure Portal → Azure Active Directory → App registrations → your app → <strong>Manifest</strong></li>
            <li>Find <code>replyUrlsWithType</code> and update:</li>
          </ol>
          <CodePre>{AZURE_MANIFEST}</CodePre>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              The portal UI only allows <code>https://</code> for SPA platform. Use the Manifest
              editor to register a custom scheme. <code>"Spa"</code> enables CORS on the token
              endpoint — required by MSAL.js running in a browser context.{' '}
              <code>"InstalledClient"</code> (mobile/desktop) does not enable CORS.
            </div>
          </div>

          <h3>React MSAL Config</h3>
          <CodePre>{MSAL_CONFIG}</CodePre>
          <p>Rebuild after this change: <code>npm run build</code>, then copy <code>dist/</code> to the Xcode project.</p>
        </section>

        <hr />

        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>Phase 5 — Updating the App</h2>

          <p>When you ship new features to the web app:</p>
          <CodePre>{UPDATE_SCRIPT}</CodePre>

          <div className="card" style={{ marginTop: 16 }}>
            <strong>Git tip:</strong> In <code>MyAppForMac</code>, commit the vite.config.ts and
            auth config changes once. After each <code>git pull</code> from prod, run{' '}
            <code>git stash pop</code> if they got overwritten — or maintain a separate branch
            that keeps these two changes permanently.
          </div>

          <h3>What Triggers a New App Store Build</h3>
          <table>
            <tbody>
              <tr><th>Change type</th><th>What to do</th><th>App Store review needed?</th></tr>
              <tr><td>Bug fix or new feature in web app</td><td>Rebuild dist, copy to Xcode, increment build number, archive + upload</td><td>Yes</td></tr>
              <tr><td>Native Swift code change</td><td>Same as above</td><td>Yes</td></tr>
              <tr><td>Backend-only change (API, DB)</td><td>Deploy backend as normal</td><td>No</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Phase 6 — Signing & Running on Device</h2>

          <h3>First Time Setup</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>In Xcode, click the project root in the navigator</li>
            <li>Select your target → <strong>Signing & Capabilities</strong></li>
            <li>Under <strong>Team</strong>, select your Apple Developer account</li>
            <li>If you see a provisioning profile error, click <strong>Try Again</strong> or <strong>Fix Issue</strong></li>
          </ol>

          <h3>Running on Your iPhone</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>Connect iPhone via USB</li>
            <li>Select your iPhone in Xcode's device selector (top toolbar)</li>
            <li>Press <strong>Cmd+R</strong></li>
            <li>First time: iPhone shows "Trust This Computer?" — tap Trust</li>
            <li>
              If app fails to launch: iPhone → <strong>Settings → General → VPN & Device
              Management</strong> → trust your developer certificate
            </li>
          </ol>

          <h3>Signing Troubleshooting</h3>
          <table>
            <tbody>
              <tr><th>Error</th><th>Fix</th></tr>
              <tr><td>"No account for team"</td><td>Xcode → Settings → Accounts → add Apple ID</td></tr>
              <tr><td>"Device is not registered"</td><td>Only applies to free accounts (3-device limit). Paid accounts have no limit.</td></tr>
              <tr><td>"Provisioning profile expired"</td><td>Re-run the app — Xcode auto-renews it</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Phase 7 — Debugging</h2>

          <h3>JavaScript Console (Built-in Bridge)</h3>
          <p>The <code>ContentView.swift</code> above includes a console bridge. All JS output:</p>
          <CodePre>{`🌐 JS[LOG] App mounted
🌐 JS[WARN] Slow network detected
🌐 JS[ERROR] [UnhandledRejection] Failed to fetch`}</CodePre>

          <h3>Safari Web Inspector (Full DevTools)</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>iPhone: <strong>Settings → Safari → Advanced → Web Inspector: ON</strong></li>
            <li>Connect to Mac via USB</li>
            <li>Mac Safari: <strong>Develop → [Your iPhone] → [Your App]</strong></li>
          </ol>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            Also works on Simulator: Safari → Develop → Simulator.
          </p>

          <h3>Common Problems</h3>
          <table>
            <tbody>
              <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
              <tr>
                <td>White screen</td>
                <td>Absolute asset paths</td>
                <td>Check <code>base: "./"</code> in vite.config.ts, rebuild</td>
              </tr>
              <tr>
                <td><code>dist/index.html not found</code></td>
                <td>dist not in bundle</td>
                <td>Blue icon + Check Copy Bundle Resources</td>
              </tr>
              <tr>
                <td>Assets 404</td>
                <td>dist structure flattened</td>
                <td>Move dist to project root (not inside synchronized group)</td>
              </tr>
              <tr>
                <td>SSO: invalid scheme error</td>
                <td><code>redirectUri</code> is <code>file://</code></td>
                <td>Set <code>redirectUri: "myapp://localhost/"</code></td>
              </tr>
              <tr>
                <td>SSO: back to landing page after login</td>
                <td>CORS on token endpoint not enabled</td>
                <td>Change Azure AD type from <code>InstalledClient</code> to <code>Spa</code></td>
              </tr>
              <tr>
                <td>API calls fail</td>
                <td>Backend domain blocked by nav policy</td>
                <td>Add domain to <code>allowedExternalHosts</code></td>
              </tr>
              <tr>
                <td>API calls use relative URLs</td>
                <td>No base URL set in React</td>
                <td>Use absolute URL: <code>https://your-backend.com/api/...</code></td>
              </tr>
            </tbody>
          </table>
        </section>

        <hr />

        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Phase 8 — App Store Submission</h2>

          <div className="alert good">
            <span className="alert-icon">✅</span>
            <div>
              <strong>Guideline 4.2 — you're safe.</strong> Your bundled approach is specifically
              what avoids the "thin wrapper" rejection. All content is in the{' '}
              <code>.app</code> binary, the app works offline, and a reviewer can't navigate to the
              same content in Safari. For SSO-gated apps, the content isn't publicly accessible at all.
            </div>
          </div>

          <h3>8A — App Icon</h3>
          <p>
            One 1024×1024 PNG, no transparency, no rounded corners (Apple applies rounding). In
            Xcode: click <code>Assets.xcassets</code> → <code>AppIcon</code> → drag your image
            to the App Store slot. Xcode 15+ generates all sizes automatically.
          </p>

          <h3>8B — Launch Screen</h3>
          <p>
            Set a background color to match your app's theme so there's no blank white flash.
            Xcode → Target → General → Launch Screen File → <code>LaunchScreen</code> →
            edit the storyboard.
          </p>

          <h3>8C — Privacy Manifest (Required Since 2024)</h3>
          <div className="alert warn">
            <span className="alert-icon">⚠️</span>
            <div>
              <strong>Missing this causes a rejection.</strong> WKWebView apps that use
              localStorage/sessionStorage trigger the requirement.
            </div>
          </div>
          <CodePre>{PRIVACY_INFO}</CodePre>

          <h3>8D — Info.plist Additions</h3>
          <CodePre>{INFOPLIST}</CodePre>

          <h3>8E — In-App Purchase Warning</h3>
          <p>
            If your app has any paid tier or paywalled content accessible to individual consumers,
            Apple requires those transactions to go through In-App Purchase (30% fee). Exceptions:
          </p>
          <ul style={{ lineHeight: 2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li><strong>B2B / SSO-gated:</strong> access granted by an organization, not a consumer purchase — no IAP needed</li>
            <li><strong>Free apps:</strong> no IAP needed</li>
            <li><strong>"Reader" pattern:</strong> no purchase option in the app, direct to web to subscribe</li>
          </ul>

          <h3>8F — App Store Connect Setup</h3>
          <ol style={{ lineHeight: 2.2, paddingLeft: 20, fontSize: '0.88rem' }}>
            <li>Go to <strong>appstoreconnect.apple.com</strong> → Apps → + → New App</li>
            <li>Platform: iOS · Name · Bundle ID (from Xcode) · SKU: any unique string</li>
            <li>Fill in the listing: description (up to 4000 chars), keywords (100 chars), support URL, privacy policy URL, age rating</li>
            <li>
              Screenshots: <strong>6.9" iPhone (iPhone 16 Pro Max, 1320×2868 px) required</strong>.
              Easiest: Xcode Simulator → iPhone 16 Pro Max → Cmd+S.
            </li>
          </ol>

          <h3>8G — Archive and Submit</h3>
          <div className="timeline">
            {[
              { n: '1', title: 'Set version and build number', desc: 'Xcode → Target → General: Version e.g. 1.0, Build e.g. 1. Build number must increment with every upload.' },
              { n: '2', title: 'Set device selector', desc: 'Top toolbar → "Any iOS Device (arm64)" — NOT your phone, NOT a simulator.' },
              { n: '3', title: 'Archive', desc: 'Product → Archive. Takes a few minutes. Organizer opens automatically.' },
              { n: '4', title: 'Validate', desc: 'Organizer → your archive → Validate App. Fix any errors, increment build number, re-archive.' },
              { n: '5', title: 'Upload', desc: 'Organizer → Distribute App → App Store Connect → Upload. Appears in App Store Connect within ~10 minutes.' },
              { n: '6', title: 'Submit for review', desc: 'App Store Connect → App Store tab → select build → answer export compliance → Submit for Review. 24–48 hours typical.' },
            ].map(t => (
              <div className="tl-item" key={t.n}>
                <div className="tl-dot">{t.n}</div>
                <div className="tl-content">
                  <div className="tl-title">{t.title}</div>
                  <div className="tl-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="alert tip">
            <span className="alert-icon">💡</span>
            <div>
              <strong>Export compliance:</strong> HTTPS and standard auth token storage counts as
              encryption. Answer "Yes, uses standard encryption" → the exemption applies. No export
              license needed.
            </div>
          </div>
        </section>

        <hr />

        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>Quick Reference Checklists</h2>

          <h3>Web App (MyAppForMac)</h3>
          <Checklist prefix="web" items={WEB_CHECKLIST} />

          <h3>Xcode Project</h3>
          <Checklist prefix="xcode" items={XCODE_CHECKLIST} />

          <h3>Azure AD (if using Microsoft SSO)</h3>
          <Checklist prefix="azure" items={AZURE_CHECKLIST} />

          <h3>App Store Submission</h3>
          <Checklist prefix="store" items={STORE_CHECKLIST} />

          <h3>Update Workflow (Every New Feature)</h3>
          <CodePre>{`# In MyAppForMac:
git pull origin main
# Confirm vite.config.ts still has base: "./"  (git pull may overwrite it)
# Confirm auth redirectUri is still "myapp://localhost/"
npm run build

# Copy to Xcode project:
rm -rf ../MyApp_iOS/dist && cp -r dist ../MyApp_iOS/dist

# In Xcode:
# 1. Increment Build number (required for every upload)
# 2. Optionally increment Version for user-visible changes
# 3. Cmd+R to test on device
# 4. For App Store: archive → validate → upload → submit`}</CodePre>
        </section>

        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: '0.82rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--rust)', marginBottom: 8 }}>
            📋 iOS WebApp Deployment Playbook
          </div>
          Generic reusable guide for all apps in the fleet · Written June 2026
          <br />
          See also: <em>WKWebView Integration Guide</em> for Cairn-specific deep dive
        </div>
      </main>
    </div>
  );
}
