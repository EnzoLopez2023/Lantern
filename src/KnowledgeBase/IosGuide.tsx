import { useRef, useState } from 'react';
import MermaidDiagram from './components/MermaidDiagram';
import { useGuideSearch } from './useGuideSearch';
import { useGuideProgress } from './useGuideProgress';
import './styles/warmGuide.css';

const SECTIONS = [
  { id: 's1',  num: '1',  title: 'Big Picture',                   icon: '🗺️' },
  { id: 's2',  num: '2',  title: 'Mac Setup',                     icon: '💻' },
  { id: 's3',  num: '3',  title: 'Apple Developer Account',       icon: '🍎' },
  { id: 's4',  num: '4',  title: 'Your First iOS App',            icon: '📱' },
  { id: 's5',  num: '5',  title: 'Running on a Real Device',      icon: '🔌' },
  { id: 's6',  num: '6',  title: 'WKWebView Deep Dive',           icon: '🌐' },
  { id: 's7',  num: '7',  title: 'Sign In with Apple',            icon: '🔑' },
  { id: 's8',  num: '8',  title: 'Push Notifications (APNs)',     icon: '🔔' },
  { id: 's9',  num: '9',  title: 'Deep Links & Universal Links',  icon: '🔗' },
  { id: 's10', num: '10', title: 'UserDefaults & Keychain',       icon: '🗝️' },
  { id: 's11', num: '11', title: 'Camera & Photos',               icon: '📷' },
  { id: 's12', num: '12', title: 'Location Services',             icon: '📍' },
  { id: 's13', num: '13', title: 'Background Tasks',              icon: '⏰' },
  { id: 's14', num: '14', title: 'WidgetKit',                     icon: '🖼️' },
  { id: 's15', num: '15', title: 'SwiftData on iOS',              icon: '💾' },
  { id: 's16', num: '16', title: 'Privacy Manifests',             icon: '🔒' },
  { id: 's17', num: '17', title: 'App Capabilities',              icon: '⚙️' },
  { id: 's18', num: '18', title: 'Localization',                  icon: '🌍' },
  { id: 's19', num: '19', title: 'TestFlight',                    icon: '✈️' },
  { id: 's20', num: '20', title: 'App Store Submission',          icon: '🚀' },
  { id: 's21', num: '21', title: 'CI/CD with Xcode Cloud',        icon: '🔄' },
  { id: 's22', num: '22', title: 'App Performance',               icon: '⚡' },
  { id: 's23', num: '23', title: 'Accessibility on iOS',          icon: '♿' },
  { id: 's24', num: '24', title: 'Post-Launch Analytics',         icon: '📊' },
  { id: 's25', num: '?',  title: 'Common Rejections',             icon: '⚠️' },
  { id: 's26', num: '✦',  title: 'Cheat Sheet',                   icon: '📋' },
  { id: 's27', num: '27', title: 'StoreKit 2 — In-App Purchases', icon: '💰' },
  { id: 's28', num: '28', title: 'CloudKit Sync',                  icon: '☁️' },
  { id: 's29', num: '29', title: 'Biometric Auth (Face/Touch ID)', icon: '🪪' },
  { id: 's30', num: '30', title: 'Haptics',                        icon: '📳' },
  { id: 's31', num: '31', title: 'Network Monitoring',             icon: '📶' },
  { id: 's32', num: '32', title: 'App Intents & Shortcuts',        icon: '🗣️' },
  { id: 's33', num: '33', title: 'Live Activities',                icon: '🔴' },
  { id: 's34', num: '34', title: 'App Clips',                      icon: '✂️' },
  { id: 's35', num: '35', title: 'iPadOS & Split View',            icon: '🖥️' },
  { id: 's36', num: '36', title: 'Share Extension',                icon: '↗️' },
  { id: 's37', num: '37', title: 'WKWebView Offline Caching',      icon: '💾' },
  { id: 's38', num: '38', title: 'Request App Review',             icon: '⭐' },
  { id: 's39', num: '39', title: 'Siri & Voice',                   icon: '🎙️' },
  { id: 's40', num: '40', title: 'Shake & Feedback',               icon: '🐛' },
  { id: 's41', num: '41', title: 'Handoff & Continuity',           icon: '🤝' },
  { id: 's42', num: '42', title: 'SFSafariViewController',         icon: '🧭' },
  { id: 's43', num: '43', title: 'Data Protection',                icon: '🔐' },
  { id: 's44', num: '44', title: 'Debugging on Device',            icon: '🔍' },
  { id: 's45', num: '45', title: 'App Thinning & Size',            icon: '🪄' },
  { id: 's46', num: '46', title: 'SwiftUI on Mac (Catalyst)',      icon: '🖥️' },
  { id: 's47', num: '47', title: 'Shortcuts & Focus Filters',      icon: '🎯' },
  { id: 's48', num: '48', title: 'Testing on Multiple Devices',    icon: '🧪' },
  { id: 's49', num: '49', title: 'App Store Optimization (ASO)',   icon: '📈' },
  { id: 's50', num: '50', title: 'Monetization Strategies',        icon: '💵' },
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

function Note({ children, kind = 'info' }: { children: React.ReactNode; kind?: 'info' | 'warn' | 'good' }) {
  const icon = kind === 'warn' ? '⚠️' : kind === 'good' ? '✅' : '💡';
  const cls  = kind === 'warn' ? 'warn'  : kind === 'good' ? 'good' : 'info';
  return (
    <div className={`alert ${cls}`}>
      <span className="alert-icon">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export default function IosGuide() {
  const { readSections, currentSection, setRef, pct } = useGuideProgress(SECTIONS.map(s => s.id));
  const { query, setQuery, filtered: filteredSections } = useGuideSearch(SECTIONS);

  return (
    <div className="kb-warm-guide">
      <aside id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#1C3A5E" />
              <path d="M14 5C9.03 5 5 9.03 5 14s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 2.7a1.35 1.35 0 110 2.7 1.35 1.35 0 010-2.7zm2.7 9.9h-5.4v-1.35h1.8v-4.05h-1.35v-1.35h3.15v5.4h1.8V17.6z" fill="white" opacity="0.9" />
            </svg>
            <span className="sidebar-title">iOS Deployment</span>
          </div>
          <div className="sidebar-sub">Mac · Xcode · App Store · Beyond</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          <div className="progress-label">{readSections.size} of {SECTIONS.length} sections read</div>
        </div>
        <div className="sidebar-search-wrap">
          <input type="search" className="sidebar-search" placeholder="Search this guide…"
            value={query} onChange={e => setQuery(e.target.value)} />
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
                <a key={s.id} href={`#${s.id}`}
                  className={`nav-item${readSections.has(s.id) ? ' done' : ''}${currentSection === s.id ? ' active' : ''}`}>
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
          <div className="hero-tag">📱 iOS · Xcode · App Store · 2026</div>
          <h1>iOS Deployment Guide<br />(Ship to Real Devices &amp; the App Store)</h1>
          <p>
            Everything from setting up your Mac and Apple Developer account, through building native iOS features
            (WebViews, push notifications, deep links, camera, location, widgets), all the way to TestFlight beta
            testing and App Store submission. Written for developers who know the web; bridges to the native iOS
            ecosystem.
          </p>
          <div className="hero-meta">
            <div className="hero-stat"><span className="hero-stat-val">$99/yr</span><span className="hero-stat-label">Developer program cost</span></div>
            <div className="hero-stat"><span className="hero-stat-val">24h</span><span className="hero-stat-label">Typical review time</span></div>
            <div className="hero-stat"><span className="hero-stat-val">APNs</span><span className="hero-stat-label">Push notification service</span></div>
            <div className="hero-stat"><span className="hero-stat-val">WKWebView</span><span className="hero-stat-label">Web inside native</span></div>
          </div>
        </div>

        {/* ─── S1 ─── */}
        <section className="section" id="s1" ref={setRef('s1')}>
          <h2><span className="section-num">1</span>The Big Picture</h2>
          <p>
            iOS app development has three phases: <strong>build</strong> (Xcode + Swift), <strong>distribute for testing</strong>
            (TestFlight), and <strong>distribute publicly</strong> (App Store). You need a Mac and an Apple Developer
            account for all three.
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  CODE[Write Swift/SwiftUI code] --> XCODE[Build in Xcode]
  XCODE --> SIM[Simulator test]
  XCODE --> DEVICE[Real device test]
  XCODE --> ARCHIVE[Archive build]
  ARCHIVE --> TF[TestFlight beta]
  TF --> REVIEW[Apple Review]
  REVIEW --> STORE[App Store]`} />
          <p>There are two ways to build an iOS app:</p>
          <ol>
            <li><strong>Native Swift/SwiftUI</strong> — best performance, full API access. Build entirely in Xcode.</li>
            <li><strong>Hybrid / WebView</strong> — wrap an existing web app in a <code>WKWebView</code> shell. Fastest path if you have a web app. See §6.</li>
          </ol>
          <Note>
            Apple reviews every app before it appears in the App Store. First submission reviews take 1–3 days;
            updates typically review in under 24 hours. Reviews happen automatically — you don't need to schedule them.
          </Note>
        </section>

        <hr />

        {/* ─── S2 ─── */}
        <section className="section" id="s2" ref={setRef('s2')}>
          <h2><span className="section-num">2</span>Mac Setup</h2>

          <h3>What you need</h3>
          <table>
            <tbody>
              <tr><th>Tool</th><th>How to install</th><th>Notes</th></tr>
              <tr><td>Xcode 16+</td><td>Mac App Store</td><td>~14 GB. Accept the license on first launch. Required.</td></tr>
              <tr><td>Xcode CLT</td><td><code>xcode-select --install</code></td><td>Command-line tools. Some scripts need these separately.</td></tr>
              <tr><td>Homebrew</td><td>brew.sh one-liner</td><td>Package manager for everything else.</td></tr>
              <tr><td>Node.js 22+</td><td><code>brew install node</code> or nvm</td><td>Only if you're using React Native or a JS toolchain.</td></tr>
              <tr><td>CocoaPods</td><td><code>sudo gem install cocoapods</code></td><td>Dependency manager. Required by many third-party SDKs.</td></tr>
              <tr><td>Fastlane</td><td><code>brew install fastlane</code></td><td>Optional but very useful for automating signing and uploads.</td></tr>
            </tbody>
          </table>

          <h3>Simulator vs real device</h3>
          <p>
            The Simulator runs on your Mac's CPU. It's fast to launch and great for UI work, but it has significant
            limitations:
          </p>
          <ul>
            <li>No push notifications.</li>
            <li>No camera hardware (uses a test pattern).</li>
            <li>No Bluetooth or NFC.</li>
            <li>Simulated GPS, not real GPS.</li>
            <li>Different performance characteristics than real hardware (often faster, sometimes slower in different ways).</li>
          </ul>
          <p>
            Always test on a real device before submitting to the App Store. Plug in an iPhone via USB,
            select it in Xcode's device picker, and hit Run. You'll need to trust the developer certificate
            on the device (Settings → General → VPN &amp; Device Management).
          </p>

          <h3>Apple Silicon vs Intel Macs</h3>
          <CodePre>{`# Check your Mac's architecture:
uname -m    # arm64 = Apple Silicon (M1/M2/M3/M4), x86_64 = Intel

# On Apple Silicon, Rosetta can cause issues with older tools:
# If a terminal command fails with "bad CPU type", try:
arch -x86_64 /bin/zsh    # run a shell under Rosetta

# Most iOS development tools now run natively on Apple Silicon.
# If you're using CocoaPods < 1.11, you may need:
arch -x86_64 pod install`}</CodePre>
        </section>

        <hr />

        {/* ─── S3 ─── */}
        <section className="section" id="s3" ref={setRef('s3')}>
          <h2><span className="section-num">3</span>Apple Developer Account</h2>

          <h3>Enrollment</h3>
          <p>
            Go to <strong>developer.apple.com/enroll</strong>. Choose Individual ($99/yr) unless you need to publish
            under a company name, in which case choose Organization (also $99/yr but requires a D-U-N-S number,
            which takes 1–2 weeks to obtain).
          </p>
          <p>
            After enrollment, you get access to:
          </p>
          <ul>
            <li><strong>App Store Connect</strong> — where you manage your apps, builds, and TestFlight.</li>
            <li><strong>Certificates, IDs &amp; Profiles</strong> — signing infrastructure.</li>
            <li><strong>CloudKit Dashboard</strong> — if you use CloudKit for sync.</li>
            <li><strong>Instruments</strong> and crash reports from production devices.</li>
          </ul>

          <h3>Signing explained</h3>
          <p>
            Apple uses code signing to verify that apps haven't been tampered with. The chain is:
          </p>
          <MermaidDiagram theme="default" chart={`graph LR
  APPLE[Apple CA] --> CERT[Developer Certificate]
  CERT --> APP[Signed App Binary]
  PROFILE[Provisioning Profile] --> APP
  PROFILE --> DEVICES[Allowed Devices]
  PROFILE --> CAPS[Capabilities / Entitlements]`} />
          <ul>
            <li><strong>Certificate</strong> — proves the binary was signed by you. Lives in your Keychain. Never share the private key.</li>
            <li><strong>App ID</strong> — a unique identifier for your app, e.g. <code>com.yourname.MyApp</code>. Created in the developer portal.</li>
            <li><strong>Provisioning Profile</strong> — ties together: which certificate, which App ID, which devices (for development), and which capabilities.</li>
          </ul>

          <h3>Automatic vs manual signing</h3>
          <CodePre>{`// In Xcode → Signing & Capabilities tab:
// Automatically manage signing: ✅  ← recommended for most developers

// Xcode will:
// 1. Create certificates if you don't have them
// 2. Create App IDs if they don't exist
// 3. Create provisioning profiles and keep them updated
// 4. Register new devices automatically (dev builds)

// Manual signing is only needed when:
// - You're building in a CI environment without Xcode
// - You need to share the exact same profile across a team
// - You're using Fastlane or another automated submission tool`}</CodePre>

          <h3>Common certificate types</h3>
          <table>
            <tbody>
              <tr><th>Certificate</th><th>Used for</th></tr>
              <tr><td>Apple Development</td><td>Installing debug builds on real devices</td></tr>
              <tr><td>Apple Distribution</td><td>Archiving for TestFlight / App Store</td></tr>
              <tr><td>Push Notification (APNs)</td><td>Server-to-device push messages. See §8.</td></tr>
              <tr><td>Pass Type ID</td><td>Apple Wallet passes</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── S4 ─── */}
        <section className="section" id="s4" ref={setRef('s4')}>
          <h2><span className="section-num">4</span>Your First iOS App</h2>

          <h3>Creating the project</h3>
          <ol>
            <li>Open Xcode → File → New → Project.</li>
            <li>Choose <strong>iOS → App</strong>.</li>
            <li>Fill in: Product Name (e.g. <code>MyApp</code>), Team (your Apple ID), Organization Identifier (<code>com.yourname</code>), Bundle Identifier (auto-filled as <code>com.yourname.MyApp</code>).</li>
            <li>Interface: <strong>SwiftUI</strong>. Language: <strong>Swift</strong>. Storage: None (add SwiftData later).</li>
            <li>Choose a location and click Create.</li>
          </ol>

          <h3>Project file structure</h3>
          <CodePre>{`MyApp/
├── MyApp.xcodeproj       ← Xcode project file (or .xcworkspace if using CocoaPods/SPM)
├── MyApp/
│   ├── MyAppApp.swift    ← @main entry point (the App struct)
│   ├── ContentView.swift ← root view
│   ├── Assets.xcassets   ← images, icons, colors
│   └── Info.plist        ← app configuration (permissions, URL schemes, etc.)
└── MyAppTests/           ← XCTest unit tests
    └── MyAppUITests/     ← XCUITest UI tests`}</CodePre>

          <h3>Info.plist — the app manifest</h3>
          <p>
            <code>Info.plist</code> is the metadata manifest for your app. Key entries:
          </p>
          <table>
            <tbody>
              <tr><th>Key</th><th>Purpose</th></tr>
              <tr><td><code>CFBundleIdentifier</code></td><td>Bundle ID — must match App Store Connect</td></tr>
              <tr><td><code>CFBundleShortVersionString</code></td><td>User-visible version (1.0.2)</td></tr>
              <tr><td><code>CFBundleVersion</code></td><td>Build number — must increase for each upload</td></tr>
              <tr><td><code>NSCameraUsageDescription</code></td><td>Camera permission prompt text</td></tr>
              <tr><td><code>NSLocationWhenInUseUsageDescription</code></td><td>Location permission prompt text</td></tr>
              <tr><td><code>NSPhotoLibraryUsageDescription</code></td><td>Photo library access prompt text</td></tr>
              <tr><td><code>UILaunchScreen</code></td><td>Launch screen configuration</td></tr>
              <tr><td><code>LSApplicationQueriesSchemes</code></td><td>URL schemes your app can open (e.g. <code>mailto</code>)</td></tr>
            </tbody>
          </table>
          <Note kind="warn">
            Every permission you declare must have a usage description string. Missing descriptions cause App Store
            rejection. The strings are shown to the user in the system permission dialog.
          </Note>

          <h3>App icons</h3>
          <p>
            In Xcode 15+, one 1024×1024px icon in Assets.xcassets is all you need — Xcode generates all the
            required sizes automatically. The icon must be PNG format, no transparency, no alpha channel, and no
            rounded corners (iOS adds rounding).
          </p>
          <CodePre>{`// Quickly check your icon has no transparency:
sips -g hasAlpha YourIcon.png
// → hasAlpha: no    ✅

// If it shows "yes", strip the alpha in Preview:
// Open in Preview → File → Export → uncheck Alpha → save as PNG`}</CodePre>
        </section>

        <hr />

        {/* ─── S5 ─── */}
        <section className="section" id="s5" ref={setRef('s5')}>
          <h2><span className="section-num">5</span>Running on a Real Device</h2>

          <h3>First time setup</h3>
          <ol>
            <li>Plug in your iPhone with a USB cable.</li>
            <li>Your iPhone appears in Xcode's device selector (top bar, next to the scheme name).</li>
            <li>Select your device.</li>
            <li>Press <strong>Run (⌘R)</strong>.</li>
            <li>First time: Xcode says "Could not launch — codesign error." Go to <strong>Settings → General → VPN &amp; Device Management</strong> on the iPhone and tap "Trust" under your Apple ID.</li>
            <li>Run again. The app installs and launches.</li>
          </ol>

          <h3>Wireless debugging</h3>
          <CodePre>{`// After pairing once over USB, you can go wireless:
// Window → Devices and Simulators → select your device →
// check "Connect via network" → disconnect USB

// Now your phone appears in the device picker over Wi-Fi.
// Both devices must be on the same Wi-Fi network.
// Note: wireless builds are slightly slower to install.`}</CodePre>

          <h3>Crash logs from devices</h3>
          <CodePre>{`// View crash logs in Xcode:
// Window → Devices and Simulators → your device → View Device Logs

// Or: Xcode automatically downloads crash reports for your distribution builds
// in Organizer (Window → Organizer → Crashes)

// For symbolication (to get readable stack traces instead of hex addresses):
// The .dSYM file (debug symbols) must be archived with the build.
// Xcode archives include dSYMs automatically.`}</CodePre>
        </section>

        <hr />

        {/* ─── S6 ─── */}
        <section className="section" id="s6" ref={setRef('s6')}>
          <h2><span className="section-num">6</span>WKWebView Deep Dive</h2>
          <p>
            <code>WKWebView</code> is the modern WebKit engine for iOS. Use it to embed your existing web app
            inside a native shell. This is the fastest path to a native iOS app if you already have a web product.
          </p>

          <h3>Basic WebView app</h3>
          <CodePre>{`import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.contentInsetAdjustmentBehavior = .automatic
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        let request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)
        webView.load(request)
    }
}

struct ContentView: View {
    var body: some View {
        WebView(url: URL(string: "https://hearth.nintek.com")!)
            .ignoresSafeArea()
    }
}`}</CodePre>

          <h3>Navigation delegate — handle redirects and errors</h3>
          <CodePre>{`import WebKit

class WebViewCoordinator: NSObject, WKNavigationDelegate {
    var parent: WebView

    init(_ parent: WebView) { self.parent = parent }

    // Called before every navigation — use to intercept or block URLs:
    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow); return
        }
        // Open external links in Safari:
        if !url.host!.contains("hearth.nintek.com") {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    // Called when a page finishes loading:
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        parent.title = webView.title ?? ""
    }

    // Called on network/navigation errors:
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("Nav failed: \\(error)")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        // Provisional navigation failure = DNS or connection failure
        print("Load failed: \\(error)")
    }
}

// In WebView:
struct WebView: UIViewRepresentable {
    let url: URL
    @Binding var title: String

    func makeCoordinator() -> WebViewCoordinator { WebViewCoordinator(self) }

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.load(URLRequest(url: url))
    }
}`}</CodePre>

          <h3>JavaScript bridge — call Swift from JS</h3>
          <CodePre>{`// Register a message handler that JS can call:
let userContentController = WKUserContentController()
let config = WKWebViewConfiguration()
config.userContentController = userContentController

class MessageHandler: NSObject, WKScriptMessageHandler {
    func userContentController(_ controller: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard message.name == "nativeAction" else { return }
        if let body = message.body as? [String: Any] {
            let action = body["action"] as? String ?? ""
            switch action {
            case "haptic":
                UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            case "openSettings":
                UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!)
            default:
                break
            }
        }
    }
}

let handler = MessageHandler()
userContentController.add(handler, name: "nativeAction")

// In your web app's JavaScript:
// window.webkit.messageHandlers.nativeAction.postMessage({ action: 'haptic' });`}</CodePre>

          <h3>Injecting JavaScript from Swift</h3>
          <CodePre>{`// Run JS in the page context:
webView.evaluateJavaScript("document.title") { result, error in
    if let title = result as? String {
        print("Page title: \\(title)")
    }
}

// Inject a script that runs on every page load:
let script = WKUserScript(
    source: "window.isNativeApp = true; window.appVersion = '2.1';",
    injectionTime: .atDocumentStart,    // or .atDocumentEnd
    forMainFrameOnly: true
)
config.userContentController.addUserScript(script)`}</CodePre>

          <h3>Cookies and session sharing</h3>
          <CodePre>{`// Share cookies with Safari (for SSO / same-domain session):
// WKWebView uses a separate cookie store from Safari by default.

// To get a cookie from the web view:
webView.configuration.websiteDataStore.httpCookieStore.getAllCookies { cookies in
    for cookie in cookies where cookie.name == "sessionToken" {
        print("Session: \\(cookie.value)")
    }
}

// To inject a cookie (e.g., from Keychain into a new WKWebView session):
let cookie = HTTPCookie(properties: [
    .name: "sessionToken",
    .value: storedToken,
    .domain: ".hearth.nintek.com",
    .path: "/",
    .secure: "TRUE",
    .expires: NSDate(timeIntervalSinceNow: 86400 * 30)
])!
webView.configuration.websiteDataStore.httpCookieStore.setCookie(cookie)`}</CodePre>

          <h3>Pull-to-refresh in WKWebView</h3>
          <CodePre>{`func makeUIView(context: Context) -> WKWebView {
    let webView = WKWebView()
    let refreshControl = UIRefreshControl()
    refreshControl.addTarget(context.coordinator,
                             action: #selector(WebViewCoordinator.handleRefresh(_:)),
                             for: .valueChanged)
    webView.scrollView.addSubview(refreshControl)
    webView.scrollView.bounces = true
    return webView
}

// In coordinator:
@objc func handleRefresh(_ sender: UIRefreshControl) {
    webView?.reload()
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
        sender.endRefreshing()
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S7 ─── */}
        <section className="section" id="s7" ref={setRef('s7')}>
          <h2><span className="section-num">7</span>Sign In with Apple</h2>
          <p>
            Apps that offer third-party login (Google, Facebook) must also offer Sign In with Apple. It's required
            by App Store Review Guideline 4.8. Apple's implementation is privacy-first — users can hide their email.
          </p>

          <h3>Enable the capability</h3>
          <p>
            In Xcode → Signing &amp; Capabilities → + Capability → Sign In with Apple. This adds the entitlement
            and registers it with your App ID automatically when using automatic signing.
          </p>

          <h3>SwiftUI implementation</h3>
          <CodePre>{`import AuthenticationServices
import SwiftUI

struct SignInView: View {
    @State private var errorMessage: String?

    var body: some View {
        VStack(spacing: 20) {
            Text("Welcome").font(.largeTitle)

            SignInWithAppleButton(.signIn) { request in
                // Configure what you're requesting:
                request.requestedScopes = [.fullName, .email]
                // .fullName is only returned on first sign-in
                // .email can be hidden by the user (Apple provides a relay address)
            } onCompletion: { result in
                handleAppleSignIn(result)
            }
            .frame(height: 50)
            .signInWithAppleButtonStyle(.black)   // .white, .whiteOutline

            if let error = errorMessage {
                Text(error).foregroundStyle(.red).font(.caption)
            }
        }
        .padding()
    }

    func handleAppleSignIn(_ result: Result<ASAuthorization, Error>) {
        switch result {
        case .success(let auth):
            guard let credential = auth.credential as? ASAuthorizationAppleIDCredential else { return }

            let userID = credential.user             // stable, unique per app per user
            let email = credential.email             // nil on subsequent sign-ins
            let fullName = credential.fullName       // nil on subsequent sign-ins
            let identityToken = credential.identityToken  // JWT — verify server-side

            // Save userID to Keychain for future sign-ins:
            saveToKeychain(key: "appleUserID", value: userID)

            // Send identityToken to your backend to verify and create a session:
            Task { await authenticateWithServer(token: identityToken) }

        case .failure(let error):
            errorMessage = error.localizedDescription
        }
    }
}`}</CodePre>

          <h3>Checking credential state on launch</h3>
          <CodePre>{`// On every app launch, verify the Apple ID credential is still valid:
@main
struct MyApp: App {
    @StateObject private var authManager = AuthManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authManager)
                .task { await authManager.checkAppleSignInState() }
        }
    }
}

extension AuthManager {
    func checkAppleSignInState() async {
        guard let savedUserID = loadFromKeychain(key: "appleUserID") else { return }
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        do {
            let state = try await appleIDProvider.credentialState(forUserID: savedUserID)
            switch state {
            case .authorized:
                isLoggedIn = true
            case .revoked, .notFound:
                // User revoked or Apple ID not found — sign out:
                signOut()
            default:
                break
            }
        } catch {
            print("Error checking Apple ID state: \\(error)")
        }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S8 ─── */}
        <section className="section" id="s8" ref={setRef('s8')}>
          <h2><span className="section-num">8</span>Push Notifications (APNs)</h2>
          <p>
            Apple Push Notification service (APNs) delivers messages from your server to user devices. The flow:
          </p>
          <MermaidDiagram theme="default" chart={`sequenceDiagram
  participant App as iOS App
  participant APNs as Apple APNs
  participant Server as Your Server

  App->>APNs: Request push permission
  APNs->>App: Device token (64-char hex)
  App->>Server: Send device token
  Server->>APNs: POST /3/device/{token} (JWT auth)
  APNs->>App: Push notification delivered`} />

          <h3>Enable the capability</h3>
          <p>
            Xcode → Signing &amp; Capabilities → + Capability → Push Notifications. Also add Background Modes if
            you want silent/background pushes.
          </p>

          <h3>Request permission and get the device token</h3>
          <CodePre>{`import UserNotifications
import UIKit

@main
struct MyApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    var body: some Scene {
        WindowGroup { ContentView() }
    }
}

class AppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        UNUserNotificationCenter.current().delegate = self

        // Request permission:
        Task {
            let granted = try await UNUserNotificationCenter.current().requestAuthorization(
                options: [.alert, .badge, .sound]
            )
            if granted {
                await MainActor.run { application.registerForRemoteNotifications() }
            }
        }
        return true
    }

    // Called with the device token on successful registration:
    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        print("Device token: \\(token)")

        // Send this token to your server:
        Task { await sendTokenToServer(token) }
    }

    func application(_ application: UIApplication,
                     didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("Failed to register: \\(error)")
    }

    // Handle notification received while app is in foreground:
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification) async
                                -> UNNotificationPresentationOptions {
        return [.banner, .sound, .badge]   // show banner even when app is open
    }

    // Handle tap on notification:
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse) async {
        let userInfo = response.notification.request.content.userInfo
        // Navigate based on the notification payload…
    }
}`}</CodePre>

          <h3>Sending a push from your server (Node.js)</h3>
          <CodePre>{`// Using the apn npm package with APNs HTTP/2 API:
import apn from '@parse/node-apn';

const provider = new apn.Provider({
    token: {
        key: process.env.APNS_KEY,           // .p8 file content
        keyId: process.env.APNS_KEY_ID,      // 10-char Key ID
        teamId: process.env.APNS_TEAM_ID,    // 10-char Team ID
    },
    production: process.env.NODE_ENV === 'production',
});

async function sendPush(deviceToken, title, body, data = {}) {
    const note = new apn.Notification({
        alert: { title, body },
        badge: 1,
        sound: 'default',
        payload: data,             // custom data (available in notification handler)
        topic: 'com.yourname.MyApp',  // your bundle ID
    });

    const result = await provider.send(note, deviceToken);
    if (result.failed.length > 0) {
        console.error('Push failed:', result.failed[0].response);
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S9 ─── */}
        <section className="section" id="s9" ref={setRef('s9')}>
          <h2><span className="section-num">9</span>Deep Links &amp; Universal Links</h2>

          <h3>Custom URL schemes</h3>
          <p>
            Custom URL schemes (<code>myapp://</code>) open your app from Safari, email, or other apps. Simple
            to set up, but not secure — any app can register the same scheme.
          </p>
          <CodePre>{`// 1. Register the scheme in Info.plist:
// CFBundleURLTypes → CFBundleURLSchemes → "myapp"

// 2. Handle in AppDelegate:
func application(_ app: UIApplication,
                 open url: URL,
                 options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    // url = "myapp://recipe/42"
    let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
    // components.host = "recipe"
    // components.path = "/42"
    navigate(to: url)
    return true
}

// 3. In SwiftUI:
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    navigate(to: url)
                }
        }
    }
}`}</CodePre>

          <h3>Universal Links — HTTP URLs that open your app</h3>
          <p>
            Universal Links are <code>https://</code> URLs that iOS intercepts and opens in your app instead of
            Safari. They're more secure (verified via your domain) and provide a graceful fallback to Safari if
            the app isn't installed.
          </p>
          <CodePre>{`// 1. Enable Associated Domains capability in Xcode.
// Add domain: applinks:yoursite.com

// 2. Host apple-app-site-association file at https://yoursite.com/.well-known/apple-app-site-association
// (or at the root, but /.well-known/ is preferred)
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAMID.com.yourname.MyApp",
        "paths": ["/recipe/*", "/share/*", "/invite"]
      }
    ]
  }
}

// 3. Handle in SwiftUI (same as custom URL schemes):
.onOpenURL { url in
    // url = "https://yoursite.com/recipe/42"
    routeDeepLink(url)
}`}</CodePre>

          <Note>
            Apple fetches the <code>apple-app-site-association</code> file when the app is installed, not at runtime.
            The file must be served over HTTPS with a valid certificate, and <strong>without redirects</strong>.
            Content-Type should be <code>application/json</code>.
          </Note>
        </section>

        <hr />

        {/* ─── S10 ─── */}
        <section className="section" id="s10" ref={setRef('s10')}>
          <h2><span className="section-num">10</span>UserDefaults &amp; Keychain</h2>

          <h3>UserDefaults — simple preferences</h3>
          <CodePre>{`// UserDefaults stores small, non-sensitive data:
// Suitable for: app settings, user preferences, feature flags, onboarding state.
// NOT suitable for: passwords, tokens, private keys.

// Write:
UserDefaults.standard.set(true, forKey: "hasCompletedOnboarding")
UserDefaults.standard.set(42, forKey: "selectedThemeIndex")
UserDefaults.standard.set("Ada", forKey: "username")

// Read:
let done = UserDefaults.standard.bool(forKey: "hasCompletedOnboarding")
let theme = UserDefaults.standard.integer(forKey: "selectedThemeIndex")
let name = UserDefaults.standard.string(forKey: "username") ?? "Guest"

// Remove:
UserDefaults.standard.removeObject(forKey: "username")

// In SwiftUI, use @AppStorage (wrapper around UserDefaults):
@AppStorage("selectedThemeIndex") var selectedTheme = 0
@AppStorage("hasCompletedOnboarding") var onboarded = false`}</CodePre>

          <h3>Keychain — secure storage</h3>
          <CodePre>{`// Keychain is encrypted, persists across app reinstalls, and can sync via iCloud.
// Use for: passwords, API tokens, session tokens, private keys.

import Security

enum KeychainError: Error {
    case unhandledError(status: OSStatus)
    case itemNotFound
    case unexpectedData
}

struct KeychainHelper {
    static let service = "com.yourname.MyApp"

    static func save(_ value: String, for key: String) throws {
        guard let data = value.data(using: .utf8) else { return }

        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: service,
            kSecAttrAccount: key,
            kSecValueData: data,
        ]

        // Delete existing before saving:
        SecItemDelete(query as CFDictionary)

        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.unhandledError(status: status)
        }
    }

    static func load(for key: String) throws -> String {
        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: service,
            kSecAttrAccount: key,
            kSecReturnData: true,
            kSecMatchLimit: kSecMatchLimitOne,
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess else {
            if status == errSecItemNotFound { throw KeychainError.itemNotFound }
            throw KeychainError.unhandledError(status: status)
        }

        guard let data = result as? Data,
              let string = String(data: data, encoding: .utf8) else {
            throw KeychainError.unexpectedData
        }
        return string
    }

    static func delete(for key: String) {
        let query: [CFString: Any] = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrService: service,
            kSecAttrAccount: key,
        ]
        SecItemDelete(query as CFDictionary)
    }
}

// Usage:
try KeychainHelper.save(sessionToken, for: "sessionToken")
let token = try KeychainHelper.load(for: "sessionToken")`}</CodePre>
        </section>

        <hr />

        {/* ─── S11 ─── */}
        <section className="section" id="s11" ref={setRef('s11')}>
          <h2><span className="section-num">11</span>Camera &amp; Photos</h2>

          <h3>Photo picker (modern, no permission needed)</h3>
          <CodePre>{`import PhotosUI
import SwiftUI

struct AvatarPickerView: View {
    @State private var selectedPhoto: PhotosPickerItem?
    @State private var avatarImage: Image?

    var body: some View {
        VStack {
            if let avatarImage {
                avatarImage
                    .resizable()
                    .scaledToFill()
                    .frame(width: 100, height: 100)
                    .clipShape(.circle)
            } else {
                Image(systemName: "person.circle")
                    .font(.system(size: 80))
                    .foregroundStyle(.secondary)
            }

            PhotosPicker(selection: $selectedPhoto,
                         matching: .images,     // .videos, .any, etc.
                         photoLibrary: .shared()) {
                Label("Choose Photo", systemImage: "photo")
            }
        }
        .onChange(of: selectedPhoto) {
            Task {
                if let data = try? await selectedPhoto?.loadTransferable(type: Data.self),
                   let uiImage = UIImage(data: data) {
                    avatarImage = Image(uiImage: uiImage)
                }
            }
        }
    }
}`}</CodePre>

          <h3>Camera capture</h3>
          <CodePre>{`// Camera requires permission — add NSCameraUsageDescription to Info.plist

struct CameraView: UIViewControllerRepresentable {
    @Binding var capturedImage: UIImage?
    @Environment(\\.dismiss) var dismiss

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.allowsEditing = true
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ vc: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: CameraView

        init(_ parent: CameraView) { self.parent = parent }

        func imagePickerController(_ picker: UIImagePickerController,
                                   didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            parent.capturedImage = info[.editedImage] as? UIImage
                                ?? info[.originalImage] as? UIImage
            parent.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}

// Usage:
@State private var showCamera = false
@State private var photo: UIImage?

Button("Take Photo") { showCamera = true }
    .fullScreenCover(isPresented: $showCamera) {
        CameraView(capturedImage: $photo)
    }`}</CodePre>
        </section>

        <hr />

        {/* ─── S12 ─── */}
        <section className="section" id="s12" ref={setRef('s12')}>
          <h2><span className="section-num">12</span>Location Services</h2>

          <h3>Permission strings (required in Info.plist)</h3>
          <table>
            <tbody>
              <tr><th>Key</th><th>When to use</th></tr>
              <tr><td><code>NSLocationWhenInUseUsageDescription</code></td><td>App uses location only while in the foreground</td></tr>
              <tr><td><code>NSLocationAlwaysAndWhenInUseUsageDescription</code></td><td>App uses location in background too</td></tr>
            </tbody>
          </table>

          <h3>Getting the user's location</h3>
          <CodePre>{`import CoreLocation
import SwiftUI

class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()

    @Published var location: CLLocation?
    @Published var authorizationStatus: CLAuthorizationStatus

    override init() {
        authorizationStatus = CLLocationManager.authorizationStatus()
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
    }

    func requestPermission() {
        manager.requestWhenInUseAuthorization()
    }

    func startUpdating() {
        manager.startUpdatingLocation()
    }

    func stopUpdating() {
        manager.stopUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        location = locations.last
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        authorizationStatus = manager.authorizationStatus
    }
}

struct NearbyView: View {
    @StateObject private var locationManager = LocationManager()

    var body: some View {
        VStack {
            switch locationManager.authorizationStatus {
            case .notDetermined:
                Button("Allow Location Access") { locationManager.requestPermission() }
            case .denied, .restricted:
                Label("Location access denied", systemImage: "location.slash")
                Button("Open Settings") {
                    UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!)
                }
            case .authorizedWhenInUse, .authorizedAlways:
                if let location = locationManager.location {
                    Text("Lat: \\(location.coordinate.latitude, format: .number.precision(.fractionLength(4)))")
                    Text("Lon: \\(location.coordinate.longitude, format: .number.precision(.fractionLength(4)))")
                } else {
                    ProgressView("Getting location…")
                }
            @unknown default: EmptyView()
            }
        }
        .onAppear { locationManager.startUpdating() }
        .onDisappear { locationManager.stopUpdating() }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S13 ─── */}
        <section className="section" id="s13" ref={setRef('s13')}>
          <h2><span className="section-num">13</span>Background Tasks</h2>
          <p>
            iOS aggressively suspends apps when they're in the background. Background Tasks API lets you schedule
            short work to run when the OS decides (typically at night, when the device is on power).
          </p>

          <h3>Register background tasks</h3>
          <CodePre>{`// 1. Add Background Modes capability in Xcode →
//    check "Background fetch" and "Background processing"

// 2. Add to Info.plist:
// BGTaskSchedulerPermittedIdentifiers → "com.yourname.app.refresh"

// 3. In AppDelegate, register your tasks BEFORE app finishes launching:
import BackgroundTasks

func application(_ application: UIApplication,
                 didFinishLaunchingWithOptions...) -> Bool {
    BGTaskScheduler.shared.register(
        forTaskWithIdentifier: "com.yourname.app.refresh",
        using: nil
    ) { task in
        Task { await self.handleRefresh(task: task as! BGAppRefreshTask) }
    }
    return true
}

func handleRefresh(task: BGAppRefreshTask) async {
    // Schedule the next refresh:
    scheduleAppRefresh()

    // Do the work (must finish quickly — typically < 30 seconds):
    do {
        try await syncData()
        task.setTaskCompleted(success: true)
    } catch {
        task.setTaskCompleted(success: false)
    }

    // The expiration handler is called if you run out of time:
    task.expirationHandler = {
        // Cancel any ongoing work
    }
}

func scheduleAppRefresh() {
    let request = BGAppRefreshTaskRequest(identifier: "com.yourname.app.refresh")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60)   // 15 min minimum
    try? BGTaskScheduler.shared.submit(request)
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S14 ─── */}
        <section className="section" id="s14" ref={setRef('s14')}>
          <h2><span className="section-num">14</span>WidgetKit</h2>
          <p>
            Widgets show glanceable content on the Home Screen and Lock Screen. They're built with SwiftUI and
            WidgetKit. Widgets are <strong>not</strong> mini-apps — they update on a schedule, not continuously.
          </p>

          <h3>Create a widget extension</h3>
          <p>File → New → Target → Widget Extension. Give it a name and check "Include Configuration Intent" for configurable widgets.</p>

          <h3>Widget structure</h3>
          <CodePre>{`import WidgetKit
import SwiftUI

// 1. The data model for a single timeline entry:
struct RecipeEntry: TimelineEntry {
    let date: Date
    let recipeName: String
    let recipeCount: Int
}

// 2. Provider: tells WidgetKit what to show and when:
struct RecipeProvider: TimelineProvider {
    // Placeholder shown during first load (use dummy data):
    func placeholder(in context: Context) -> RecipeEntry {
        RecipeEntry(date: Date(), recipeName: "Pasta Carbonara", recipeCount: 42)
    }

    // Snapshot shown in widget gallery:
    func getSnapshot(in context: Context, completion: @escaping (RecipeEntry) -> Void) {
        completion(RecipeEntry(date: Date(), recipeName: "Pasta Carbonara", recipeCount: 42))
    }

    // Timeline: provide entries for the next refresh window:
    func getTimeline(in context: Context, completion: @escaping (Timeline<RecipeEntry>) -> Void) {
        // Fetch real data:
        let entry = RecipeEntry(date: Date(),
                                recipeName: fetchTodaysRecipe(),
                                recipeCount: fetchRecipeCount())

        // Refresh at midnight:
        let midnight = Calendar.current.startOfDay(for: Date().addingTimeInterval(86400))
        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }
}

// 3. The SwiftUI view:
struct RecipeWidgetView: View {
    var entry: RecipeEntry
    @Environment(\\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            SmallWidgetView(entry: entry)
        case .systemMedium:
            MediumWidgetView(entry: entry)
        default:
            SmallWidgetView(entry: entry)
        }
    }
}

// 4. The widget configuration:
@main
struct RecipeWidget: Widget {
    let kind = "RecipeWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: RecipeProvider()) { entry in
            RecipeWidgetView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Recipes")
        .description("See your recipe stats at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}`}</CodePre>

          <h3>Deep link from widget tap</h3>
          <CodePre>{`// Each widget view can have a Link that opens a URL in the app:
struct SmallWidgetView: View {
    var entry: RecipeEntry

    var body: some View {
        Link(destination: URL(string: "myapp://recipe/today")!) {
            VStack(alignment: .leading) {
                Text("Today's Recipe").font(.caption).foregroundStyle(.secondary)
                Text(entry.recipeName).font(.headline)
            }
            .padding()
        }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S15 ─── */}
        <section className="section" id="s15" ref={setRef('s15')}>
          <h2><span className="section-num">15</span>SwiftData on iOS</h2>
          <p>
            SwiftData's App Group configuration lets widgets and the main app share the same database.
          </p>
          <CodePre>{`// 1. Enable App Groups capability in both targets (main app + widget extension).
//    Add a group like: group.com.yourname.MyApp

// 2. Configure the model container to use the shared container:
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Recipe.self, isAutosaveEnabled: true) { result in
            // Move DB to App Group container so widget can read it:
            if case .success(let container) = result {
                // The container is in the default Documents directory.
                // To share with widget, specify a URL in the App Group:
            }
        }
    }
}

// Better: specify the URL at container creation:
let groupContainer = FileManager.default
    .containerURL(forSecurityApplicationGroupIdentifier: "group.com.yourname.MyApp")!
    .appending(path: "MyApp.sqlite")

let schema = Schema([Recipe.self])
let config = ModelConfiguration(url: groupContainer)
let container = try ModelContainer(for: schema, configurations: config)`}</CodePre>
        </section>

        <hr />

        {/* ─── S16 ─── */}
        <section className="section" id="s16" ref={setRef('s16')}>
          <h2><span className="section-num">16</span>Privacy Manifests</h2>
          <p>
            Since Spring 2024, Apple requires a <code>PrivacyInfo.xcprivacy</code> file in every app and
            third-party SDK. Missing this file causes App Store rejection.
          </p>

          <h3>Create the file</h3>
          <p>
            File → New File → search for "App Privacy" → select "App Privacy File" → Save as
            <code>PrivacyInfo.xcprivacy</code>.
          </p>

          <h3>What to declare</h3>
          <CodePre>{`// Example PrivacyInfo.xcprivacy (XML / plist format):
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>                    <!-- not using App Tracking Transparency -->

    <key>NSPrivacyTrackingDomains</key>
    <array/>

    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeName</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
    </array>

    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <!-- Declare any "required reason" APIs you use.
             UserDefaults requires this: -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>   <!-- reading/writing app preferences -->
            </array>
        </dict>
    </array>
</dict>
</plist>`}</CodePre>

          <h3>Common required-reason APIs</h3>
          <table>
            <tbody>
              <tr><th>API</th><th>Common reason code</th><th>Meaning</th></tr>
              <tr><td>UserDefaults</td><td>CA92.1</td><td>App preferences</td></tr>
              <tr><td>File timestamp APIs</td><td>C617.1</td><td>App file management</td></tr>
              <tr><td>System boot time</td><td>35F9.1</td><td>Measure elapsed time</td></tr>
              <tr><td>Disk space APIs</td><td>E174.1</td><td>Write files to disk</td></tr>
            </tbody>
          </table>
        </section>

        <hr />

        {/* ─── S17 ─── */}
        <section className="section" id="s17" ref={setRef('s17')}>
          <h2><span className="section-num">17</span>App Capabilities</h2>
          <p>
            Capabilities add entitlements — special permissions that must be registered with your App ID.
            Adding a capability in Xcode's Signing &amp; Capabilities tab automatically updates the entitlements
            file and the App ID in the developer portal (with automatic signing).
          </p>
          <table>
            <tbody>
              <tr><th>Capability</th><th>Use case</th></tr>
              <tr><td>Push Notifications</td><td>APNs push messages (§8)</td></tr>
              <tr><td>Sign In with Apple</td><td>Apple identity login (§7)</td></tr>
              <tr><td>Associated Domains</td><td>Universal Links, Handoff (§9)</td></tr>
              <tr><td>App Groups</td><td>Share data between app and extensions (widget, share, etc.)</td></tr>
              <tr><td>iCloud (CloudKit)</td><td>Sync user data across devices</td></tr>
              <tr><td>Background Modes</td><td>Background fetch, audio, location (§13)</td></tr>
              <tr><td>In-App Purchase</td><td>StoreKit subscriptions and one-time purchases</td></tr>
              <tr><td>HealthKit</td><td>Read/write health data</td></tr>
              <tr><td>GameKit</td><td>Game Center leaderboards and achievements</td></tr>
              <tr><td>Network Extension</td><td>VPN, DNS proxy, content filters</td></tr>
            </tbody>
          </table>
          <Note kind="warn">
            Each capability you enable is part of your provisioning profile. If your profile doesn't include a
            capability, the app will crash at launch with an entitlement error. When using automatic signing, Xcode
            handles this. With manual signing, you must manually add capabilities to your profile in the portal.
          </Note>
        </section>

        <hr />

        {/* ─── S18 ─── */}
        <section className="section" id="s18" ref={setRef('s18')}>
          <h2><span className="section-num">18</span>Localization</h2>

          <h3>Strings files</h3>
          <CodePre>{`// Xcode 15+: String Catalogs (.xcstrings) replace the old .strings files.
// File → New → String Catalog → Localizable.xcstrings

// In code, use String(localized:):
let greeting = String(localized: "welcome.greeting", defaultValue: "Welcome!")
let count = 5
let label = String(localized: "\\(count) items")   // auto-pluralized with Stringsdict

// SwiftUI Text views are localized automatically:
Text("welcome.greeting")   // looks up in Localizable.xcstrings`}</CodePre>

          <h3>Adding a language</h3>
          <ol>
            <li>Project → Info → Localizations → + → choose language.</li>
            <li>Xcode extracts your strings into a new catalog column for that language.</li>
            <li>Fill in the translations.</li>
          </ol>

          <h3>Locale-aware formatting</h3>
          <CodePre>{`// Use Swift's formatting APIs — they handle locale automatically:
let price: Double = 19.99
Text(price, format: .currency(code: "USD"))     // "$19.99" in en-US, "19,99 $" in fr-FR

let date = Date()
Text(date, format: .dateTime.day().month().year())   // locale-aware date

let count = 1234567
Text(count, format: .number)   // "1,234,567" in en-US, "1 234 567" in fr-FR`}</CodePre>
        </section>

        <hr />

        {/* ─── S19 ─── */}
        <section className="section" id="s19" ref={setRef('s19')}>
          <h2><span className="section-num">19</span>TestFlight</h2>
          <p>
            TestFlight is Apple's beta testing platform. Internal testers (your team, up to 100 people) can install
            builds instantly. External testers (up to 10,000 people) require a brief review.
          </p>

          <h3>Create an archive</h3>
          <ol>
            <li>Select <strong>Any iOS Device (arm64)</strong> in the device picker (not a Simulator).</li>
            <li>Product → Archive. Xcode builds and archives the app (takes 1–3 minutes).</li>
            <li>The Organizer window opens automatically when complete.</li>
          </ol>

          <h3>Upload to TestFlight</h3>
          <ol>
            <li>In Organizer, select your archive → Distribute App.</li>
            <li>Choose <strong>TestFlight & App Store</strong>.</li>
            <li>Click Next through the options (automatic signing, strip Swift symbols — keep defaults).</li>
            <li>Click Upload. Xcode uploads to App Store Connect (~2–5 minutes).</li>
          </ol>
          <CodePre>{`# Or use Fastlane (faster for CI and repeated uploads):
fastlane pilot upload --ipa path/to/MyApp.ipa

# Or use xcrun altool (deprecated but still works):
xcrun altool --upload-app --type ios --file MyApp.ipa --apiKey $API_KEY --apiIssuer $ISSUER_ID`}</CodePre>

          <h3>Adding testers</h3>
          <ol>
            <li>Log in to appstoreconnect.apple.com → Your App → TestFlight.</li>
            <li>Internal testers: Users &amp; Access → TestFlight → + to add team members by email.</li>
            <li>External testers: Create a group, add email addresses. The first build for a group goes through a brief review (usually same-day).</li>
            <li>Testers install the TestFlight app from the App Store and accept the invitation email.</li>
          </ol>
        </section>

        <hr />

        {/* ─── S20 ─── */}
        <section className="section" id="s20" ref={setRef('s20')}>
          <h2><span className="section-num">20</span>App Store Submission</h2>

          <h3>Pre-submission checklist</h3>
          <table>
            <tbody>
              <tr><th>Item</th><th>Requirement</th></tr>
              <tr><td>App icon</td><td>1024×1024px PNG, no alpha, no rounded corners</td></tr>
              <tr><td>Screenshots</td><td>6.9" required (1320×2868). Add 6.7" and iPad if applicable.</td></tr>
              <tr><td>Privacy policy URL</td><td>Public URL to your policy. Any host works.</td></tr>
              <tr><td>Privacy manifest</td><td>PrivacyInfo.xcprivacy present and complete (§16)</td></tr>
              <tr><td>Age rating</td><td>Completed questionnaire in App Store Connect</td></tr>
              <tr><td>Export compliance</td><td>"Yes, uses standard encryption" → exemption. No export license needed for HTTPS.</td></tr>
              <tr><td>Bundle ID match</td><td>Info.plist CFBundleIdentifier must match App Store Connect</td></tr>
              <tr><td>Build number</td><td>Must be higher than any previously uploaded build</td></tr>
            </tbody>
          </table>

          <h3>Preparing the listing in App Store Connect</h3>
          <ol>
            <li>App Store Connect → My Apps → + New App.</li>
            <li>Fill in name, bundle ID, primary language, SKU.</li>
            <li>Upload screenshots (drag them in).</li>
            <li>Write description (4000 chars max), subtitle (30 chars), keywords (100 chars — comma separated).</li>
            <li>Set pricing (free or paid).</li>
            <li>Select the build you want to submit (it appears after upload finishes processing, ~15 min).</li>
            <li>Click Submit for Review.</li>
          </ol>

          <h3>After submission</h3>
          <ul>
            <li>Status changes to "Waiting for Review" then "In Review" (typically 24 hours).</li>
            <li>If approved: you get an email; the app goes live immediately if you chose "Automatically release".</li>
            <li>If rejected: App Store Connect shows the specific guideline violated. Fix and resubmit. You can also appeal rejections through the Resolution Center.</li>
          </ul>
        </section>

        <hr />

        {/* ─── S21 ─── */}
        <section className="section" id="s21" ref={setRef('s21')}>
          <h2><span className="section-num">21</span>CI/CD with Xcode Cloud</h2>
          <p>
            Xcode Cloud is Apple's built-in CI/CD — it builds, tests, and distributes your app automatically.
            Integrated with App Store Connect and TestFlight. Free tier: 25 compute hours/month.
          </p>

          <h3>Set up a workflow</h3>
          <ol>
            <li>Xcode → Report navigator (cmd+9) → Cloud → Create Workflow.</li>
            <li>Define triggers: push to <code>main</code>, pull request, scheduled.</li>
            <li>Define actions: build, test, archive.</li>
            <li>Define post-actions: distribute to TestFlight, notify Slack.</li>
          </ol>

          <CodePre>{`# Xcode Cloud workflows are configured in .xcode/workflows/ YAML files.
# Example: .xcode/workflows/release.yml

name: Release Workflow
triggers:
  - branchChanges:
      branch: main
actions:
  - action: build
    scheme: MyApp
    platform: iOS
  - action: test
    scheme: MyApp Tests
  - action: archive
    scheme: MyApp
    platform: iOS
postActions:
  - action: testFlight
    groups:
      - Internal Testers`}</CodePre>

          <h3>Fastlane as an alternative</h3>
          <CodePre>{`# Fastlane runs on any CI system (GitHub Actions, Bitrise, etc.)
# Install: brew install fastlane

# Fastfile example:
lane :beta do
  increment_build_number
  build_app(scheme: "MyApp")
  upload_to_testflight
end

lane :release do
  increment_version_number(bump_type: "minor")
  increment_build_number
  build_app(scheme: "MyApp", configuration: "Release")
  upload_to_app_store(skip_waiting_for_build_processing: true)
end

# Run:
fastlane beta`}</CodePre>
        </section>

        <hr />

        {/* ─── S22 ─── */}
        <section className="section" id="s22" ref={setRef('s22')}>
          <h2><span className="section-num">22</span>App Performance</h2>

          <h3>Instruments — the profiling tool</h3>
          <p>
            Instruments (Xcode → Open Developer Tool → Instruments) lets you profile your running app.
            Key templates:
          </p>
          <table>
            <tbody>
              <tr><th>Template</th><th>What it measures</th></tr>
              <tr><td>Time Profiler</td><td>CPU usage — which methods take the most time</td></tr>
              <tr><td>Allocations</td><td>Memory allocations — find leaks and excessive allocation</td></tr>
              <tr><td>Leaks</td><td>Detects retain cycles and unreleased memory</td></tr>
              <tr><td>Energy Log</td><td>Battery drain — CPU wakeups, network, GPS usage</td></tr>
              <tr><td>Network</td><td>Network requests, latency, data transfer</td></tr>
              <tr><td>SwiftUI</td><td>View updates, body invalidations, render time</td></tr>
            </tbody>
          </table>

          <h3>Launch time</h3>
          <CodePre>{`// Target: < 400ms cold launch (from tap to first frame).

// Measure launch time in Xcode Organizer or with:
// Product → Profile → Time Profiler → record and relaunch

// Common causes of slow launch:
// 1. Too much work in AppDelegate.didFinishLaunching — defer non-critical setup
// 2. Loading large data synchronously at startup — use async loading
// 3. Slow image decoding — use .resizable() + .scaledToFit() with explicit frame
// 4. Excessive Swift initializers running at startup`}</CodePre>

          <h3>Memory</h3>
          <CodePre>{`// Monitor memory in the Debug Navigator (⌘7) while the app is running.
// Watch for steady growth — that indicates a leak.

// Common leak patterns in SwiftUI:
// 1. Strong self capture in closures stored on a class
// 2. @EnvironmentObject retained by a background task
// 3. Timer not invalidated when view disappears

// View memory in Xcode Debug → Debug Memory Graph (memory leak button in debug bar)
// It shows the object graph — you can see what's retaining what`}</CodePre>
        </section>

        <hr />

        {/* ─── S23 ─── */}
        <section className="section" id="s23" ref={setRef('s23')}>
          <h2><span className="section-num">23</span>Accessibility on iOS</h2>

          <h3>Testing with VoiceOver</h3>
          <p>
            Settings → Accessibility → VoiceOver → On. Or use the Accessibility Inspector
            (Xcode → Open Developer Tool → Accessibility Inspector) to inspect elements without enabling
            VoiceOver on your device.
          </p>

          <h3>Dynamic Type testing</h3>
          <CodePre>{`// In Simulator: Settings → Accessibility → Larger Text
// Range: xSmall through AX5 (the largest accessibility size)

// In Xcode: Environment Overrides (bottom bar in canvas)
// Adjust Dynamic Type size without going to Settings

// Test all your text at the largest size — layouts often break at AX3+`}</CodePre>

          <h3>Reduce Motion</h3>
          <CodePre>{`// Some users get motion sickness from parallax and animations.
// Settings → Accessibility → Motion → Reduce Motion

// In code:
@Environment(\\.accessibilityReduceMotion) var reduceMotion

SomeView()
    .animation(reduceMotion ? nil : .spring(), value: someState)`}</CodePre>

          <h3>Color contrast</h3>
          <p>
            WCAG AA requires a 4.5:1 contrast ratio for normal text. iOS Accessibility Inspector has a built-in
            contrast checker. Use semantic colors (primary, secondary, label) instead of hardcoded hex values —
            they automatically adapt to light/dark mode and the "Increase Contrast" accessibility setting.
          </p>
        </section>

        <hr />

        {/* ─── S24 ─── */}
        <section className="section" id="s24" ref={setRef('s24')}>
          <h2><span className="section-num">24</span>Post-Launch Analytics</h2>

          <h3>App Store Connect analytics (free)</h3>
          <p>
            App Store Connect → Analytics shows: impressions, product page views, downloads, sessions,
            active devices, crashes, and revenue. Available without any SDK integration.
          </p>

          <h3>MetricKit — built-in performance telemetry</h3>
          <CodePre>{`import MetricKit

class MetricsSubscriber: NSObject, MXMetricManagerSubscriber {
    override init() {
        super.init()
        MXMetricManager.shared.add(self)
    }

    func didReceive(_ payloads: [MXMetricPayload]) {
        for payload in payloads {
            // Payloads arrive daily:
            let json = payload.jsonRepresentation()
            // Send to your analytics backend
            sendToAnalytics(json)
        }
    }

    func didReceive(_ payloads: [MXDiagnosticPayload]) {
        for payload in payloads {
            // Crash reports, hang reports, disk write exceptions
        }
    }
}

// Register on launch:
let metricsSubscriber = MetricsSubscriber()`}</CodePre>

          <h3>Third-party analytics options</h3>
          <table>
            <tbody>
              <tr><th>Service</th><th>Best for</th></tr>
              <tr><td>Firebase Analytics</td><td>Full event tracking, A/B testing, crash reports</td></tr>
              <tr><td>Mixpanel</td><td>User funnel analysis, cohort retention</td></tr>
              <tr><td>Amplitude</td><td>Product analytics, funnel and retention charts</td></tr>
              <tr><td>Sentry</td><td>Error monitoring, performance tracing</td></tr>
              <tr><td>PostHog</td><td>Open-source, self-hostable, full feature set</td></tr>
            </tbody>
          </table>
          <Note>
            Any analytics SDK must be declared in your Privacy Manifest (§16) if it uses required-reason APIs.
            Many popular SDKs already include their own privacy manifests — verify by checking the SDK's
            documentation or looking for <code>PrivacyInfo.xcprivacy</code> inside the SDK bundle.
          </Note>
        </section>

        <hr />

        {/* ─── S25 ─── */}
        <section className="section" id="s25" ref={setRef('s25')}>
          <h2><span className="section-num">?</span>Common Rejections</h2>
          <table>
            <tbody>
              <tr><th>Guideline</th><th>Reason</th><th>Fix</th></tr>
              <tr><td>2.1 — Crashes</td><td>App crashes during review</td><td>Test on device, check all permission strings are present, no force-unwrapped optionals in fresh-install state</td></tr>
              <tr><td>2.3 — Metadata</td><td>Screenshots don't match the app</td><td>Use actual screenshots from the running app, not mockups</td></tr>
              <tr><td>4.8 — Login</td><td>Offers third-party login but no Sign In with Apple</td><td>Add SIWA (§7)</td></tr>
              <tr><td>5.1.1 — Data collection</td><td>No privacy policy URL</td><td>Add any public privacy policy page</td></tr>
              <tr><td>5.1.2 — Data use</td><td>Missing privacy manifest</td><td>Add PrivacyInfo.xcprivacy (§16)</td></tr>
              <tr><td>3.1 — Business</td><td>Accepted payments outside of IAP</td><td>Digital goods purchased in-app must use StoreKit</td></tr>
              <tr><td>4.2 — Minimum functionality</td><td>App is just a website</td><td>Add at least one native feature; WKWebView apps must justify why native is better</td></tr>
              <tr><td>1.4 — Physical harm</td><td>App encourages risky behavior</td><td>Usually hits wellness / diet apps — add appropriate disclaimers</td></tr>
            </tbody>
          </table>
          <Note>
            When rejected, read the <strong>exact guideline cited</strong>. The Resolution Center in App Store
            Connect lets you respond to the reviewer with questions or clarifications. Most first-submission
            rejections are metadata or missing-feature issues, not app logic — read the message carefully.
          </Note>
        </section>

        <hr />

        {/* ─── S26 ─── */}
        <section className="section" id="s26" ref={setRef('s26')}>
          <h2><span className="section-num">✦</span>Cheat Sheet</h2>

          <h3>Key dates &amp; numbers</h3>
          <table>
            <tbody>
              <tr><th>Item</th><th>Value</th></tr>
              <tr><td>Developer program cost</td><td>$99/year (Individual or Organization)</td></tr>
              <tr><td>TestFlight internal testers</td><td>Up to 100</td></tr>
              <tr><td>TestFlight external testers</td><td>Up to 10,000</td></tr>
              <tr><td>First-time review time</td><td>1–3 days</td></tr>
              <tr><td>Update review time</td><td>Usually under 24 hours</td></tr>
              <tr><td>App Store cut</td><td>30% (15% for subscriptions after year 1, and small businesses)</td></tr>
              <tr><td>Max app description</td><td>4,000 characters</td></tr>
              <tr><td>Max keywords</td><td>100 characters (comma-separated)</td></tr>
              <tr><td>Required screenshot</td><td>6.9" — 1320×2868 px</td></tr>
              <tr><td>App icon size</td><td>1024×1024 px PNG</td></tr>
              <tr><td>Minimum iOS target</td><td>iOS 16 (2026 recommendation — covers 99%+ of devices)</td></tr>
            </tbody>
          </table>

          <h3>Key file locations</h3>
          <table>
            <tbody>
              <tr><th>File</th><th>Purpose</th></tr>
              <tr><td><code>Info.plist</code></td><td>App metadata, permissions, URL schemes</td></tr>
              <tr><td><code>MyApp.entitlements</code></td><td>Capabilities — push, SIWA, associated domains</td></tr>
              <tr><td><code>PrivacyInfo.xcprivacy</code></td><td>Privacy manifest (required since Spring 2024)</td></tr>
              <tr><td><code>Assets.xcassets</code></td><td>Icons, images, colors</td></tr>
              <tr><td><code>Localizable.xcstrings</code></td><td>Localized strings</td></tr>
              <tr><td><code>apple-app-site-association</code></td><td>Hosted on your web server for universal links</td></tr>
            </tbody>
          </table>

          <h3>Key URLs</h3>
          <table>
            <tbody>
              <tr><th>URL</th><th>Purpose</th></tr>
              <tr><td>developer.apple.com/enroll</td><td>Sign up for developer program</td></tr>
              <tr><td>appstoreconnect.apple.com</td><td>Manage apps, TestFlight, analytics</td></tr>
              <tr><td>developer.apple.com/app-store/review/guidelines</td><td>Full App Store Review Guidelines</td></tr>
              <tr><td>developer.apple.com/documentation/xcode/configuring-your-app-to-use-cloudkit</td><td>CloudKit setup docs</td></tr>
            </tbody>
          </table>

          <h3>Deployment quick reference</h3>
          <table>
            <tbody>
              <tr><th>Goal</th><th>How</th></tr>
              <tr><td>Run on Simulator</td><td>Select Simulator in Xcode, press ⌘R</td></tr>
              <tr><td>Run on real device</td><td>Plug in iPhone, select it, press ⌘R, Trust on device</td></tr>
              <tr><td>Create archive</td><td>Device = "Any iOS Device", Product → Archive</td></tr>
              <tr><td>Upload to TestFlight</td><td>Organizer → Distribute → TestFlight &amp; App Store</td></tr>
              <tr><td>Submit for App Store review</td><td>App Store Connect → select build → Submit for Review</td></tr>
              <tr><td>Force crash log download</td><td>Window → Devices and Simulators → View Device Logs</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">
            ★ Core deployment covered. Continue below for advanced iOS features — StoreKit, CloudKit,
            biometrics, Siri, and more.
          </p>
        </section>

        <hr />

        {/* ─── S27 ─── */}
        <section className="section" id="s27" ref={setRef('s27')}>
          <h2><span className="section-num">27</span>StoreKit 2 — In-App Purchases</h2>
          <p>
            StoreKit 2 (iOS 15+) is the modern API for in-app purchases and subscriptions. It uses
            async/await and handles receipt validation on-device, removing the need to call Apple's
            receipt verification endpoint from your server in most cases.
          </p>

          <h3>Configure products in App Store Connect</h3>
          <ol>
            <li>App Store Connect → Your App → In-App Purchases → Manage.</li>
            <li>Create product types: Consumable (spend once), Non-Consumable (permanent unlock), or Auto-Renewable Subscription.</li>
            <li>Set a Product ID (e.g. <code>com.yourname.app.pro_monthly</code>).</li>
            <li>Add a reference name, display name, and price.</li>
          </ol>

          <h3>Add StoreKit configuration for testing</h3>
          <CodePre>{`// In Xcode, create a StoreKit configuration file for local testing:
// File → New → StoreKit Configuration File
// Add your products with the same Product IDs as App Store Connect

// In scheme: Edit Scheme → Run → Options → StoreKit Configuration
// Select your .storekit file to use it during development (no real charges)`}</CodePre>

          <h3>Fetching and displaying products</h3>
          <CodePre>{`import StoreKit

@MainActor
class StoreManager: ObservableObject {
    @Published var products: [Product] = []
    @Published var purchasedProductIDs: Set<String> = []

    private var transactionListener: Task<Void, Error>?

    init() {
        transactionListener = listenForTransactions()
        Task { await loadProducts() }
    }

    func loadProducts() async {
        do {
            products = try await Product.products(for: [
                "com.yourname.app.pro_monthly",
                "com.yourname.app.pro_annual",
                "com.yourname.app.unlock_export",
            ])
            await updatePurchasedProducts()
        } catch {
            print("Failed to load products: \\(error)")
        }
    }

    func purchase(_ product: Product) async throws {
        let result = try await product.purchase()
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await transaction.finish()
            await updatePurchasedProducts()
        case .userCancelled:
            break
        case .pending:
            // Awaiting parental approval
            break
        @unknown default:
            break
        }
    }

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .verified(let value):
            return value
        case .unverified:
            throw StoreError.failedVerification
        }
    }

    private func updatePurchasedProducts() async {
        var purchased: Set<String> = []
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result else { continue }
            if transaction.revocationDate == nil {
                purchased.insert(transaction.productID)
            }
        }
        purchasedProductIDs = purchased
    }

    private func listenForTransactions() -> Task<Void, Error> {
        Task.detached { [weak self] in
            for await result in Transaction.updates {
                if case .verified(let transaction) = result {
                    await transaction.finish()
                    await self?.updatePurchasedProducts()
                }
            }
        }
    }

    var isProUser: Bool {
        purchasedProductIDs.contains("com.yourname.app.pro_monthly") ||
        purchasedProductIDs.contains("com.yourname.app.pro_annual")
    }
}

enum StoreError: Error { case failedVerification }`}</CodePre>

          <h3>Paywall view</h3>
          <CodePre>{`struct PaywallView: View {
    @StateObject private var store = StoreManager()
    @State private var isPurchasing = false
    @State private var error: String?

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Go Pro").font(.largeTitle.bold())
                Text("Unlock all features").foregroundStyle(.secondary)

                ForEach(store.products) { product in
                    Button {
                        Task {
                            isPurchasing = true
                            do { try await store.purchase(product) }
                            catch { self.error = error.localizedDescription }
                            isPurchasing = false
                        }
                    } label: {
                        HStack {
                            VStack(alignment: .leading) {
                                Text(product.displayName).font(.headline)
                                Text(product.description).font(.caption).foregroundStyle(.secondary)
                            }
                            Spacer()
                            Text(product.displayPrice).bold()
                        }
                        .padding()
                        .background(.quaternary)
                        .clipShape(.rect(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)
                }

                Button("Restore Purchases") {
                    Task { try? await AppStore.sync() }
                }
                .foregroundStyle(.secondary)
            }
            .padding()
        }
        .overlay { if isPurchasing { ProgressView() } }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S28 ─── */}
        <section className="section" id="s28" ref={setRef('s28')}>
          <h2><span className="section-num">28</span>CloudKit Sync</h2>
          <p>
            CloudKit lets you sync app data across a user's devices using their iCloud account — no server to
            maintain. It's free up to generous quotas. SwiftData integrates directly with CloudKit.
          </p>

          <h3>Enable CloudKit</h3>
          <ol>
            <li>Xcode → Signing &amp; Capabilities → + Capability → iCloud.</li>
            <li>Check "CloudKit" and create a container (e.g., <code>iCloud.com.yourname.MyApp</code>).</li>
          </ol>

          <h3>SwiftData + CloudKit (the simple path)</h3>
          <CodePre>{`// ModelContainer with CloudKit sync — just add the cloudKitDatabase parameter:
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(
            for: Recipe.self,
            cloudKitDatabase: .automatic   // syncs via iCloud automatically!
        )
    }
}

// Constraints for CloudKit-compatible @Model:
// 1. All properties must be Optional or have a default value
// 2. Relationships must be Optional
// 3. @Model classes cannot be final
// 4. Unique constraints (@Attribute(.unique)) aren't supported

// CloudKit syncs in background — no code changes needed in views.
// Changes on one device appear on others within seconds.`}</CodePre>

          <h3>CloudKit database types</h3>
          <table>
            <tbody>
              <tr><th>Database</th><th>Who can read/write</th><th>Use for</th></tr>
              <tr><td>Private</td><td>Only the authenticated user</td><td>User's own data (recipes, notes, settings)</td></tr>
              <tr><td>Public</td><td>Any app user (anonymous read)</td><td>Shared content, leaderboards, community posts</td></tr>
              <tr><td>Shared</td><td>Users the owner explicitly shared with</td><td>Collaborative documents, shared shopping lists</td></tr>
            </tbody>
          </table>

          <h3>Checking iCloud availability</h3>
          <CodePre>{`import CloudKit

func checkiCloudStatus() async {
    do {
        let status = try await CKContainer.default().accountStatus()
        switch status {
        case .available:
            print("iCloud available")
        case .noAccount:
            print("User not signed in to iCloud")
        case .restricted:
            print("iCloud restricted by parental controls")
        case .couldNotDetermine:
            print("iCloud status unknown")
        @unknown default:
            break
        }
    } catch {
        print("Error checking iCloud: \\(error)")
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S29 ─── */}
        <section className="section" id="s29" ref={setRef('s29')}>
          <h2><span className="section-num">29</span>Biometric Authentication (Face ID / Touch ID)</h2>

          <h3>Add the usage description</h3>
          <p>
            Add <code>NSFaceIDUsageDescription</code> to Info.plist with a string explaining why your app
            needs Face ID. Touch ID doesn't need a usage description.
          </p>

          <h3>LocalAuthentication</h3>
          <CodePre>{`import LocalAuthentication

class BiometricAuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var errorMessage: String?

    var biometricType: String {
        let context = LAContext()
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            return "passcode"
        }
        switch context.biometryType {
        case .faceID: return "Face ID"
        case .touchID: return "Touch ID"
        case .opticID: return "Optic ID"
        default: return "biometrics"
        }
    }

    func authenticate() async {
        let context = LAContext()
        var error: NSError?

        // Check if biometrics are available:
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else {
            await MainActor.run {
                errorMessage = error?.localizedDescription ?? "Authentication not available"
            }
            return
        }

        do {
            let success = try await context.evaluatePolicy(
                .deviceOwnerAuthentication,    // falls back to passcode if biometrics fail
                localizedReason: "Authenticate to access your secure data"
            )
            await MainActor.run { isAuthenticated = success }
        } catch {
            await MainActor.run {
                errorMessage = error.localizedDescription
            }
        }
    }
}

struct SecureView: View {
    @StateObject private var auth = BiometricAuthManager()

    var body: some View {
        Group {
            if auth.isAuthenticated {
                ProtectedContent()
            } else {
                VStack(spacing: 20) {
                    Image(systemName: "lock.shield")
                        .font(.system(size: 60))
                        .foregroundStyle(.blue)
                    Text("Authentication Required")
                        .font(.title2)
                    Button("Unlock with \\(auth.biometricType)") {
                        Task { await auth.authenticate() }
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
        }
        .task { await auth.authenticate() }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S30 ─── */}
        <section className="section" id="s30" ref={setRef('s30')}>
          <h2><span className="section-num">30</span>Haptics</h2>
          <p>
            Haptics (tactile feedback) make interactions feel more physical and responsive. iOS has three
            levels of haptic API; use the highest-level one that fits your need.
          </p>

          <CodePre>{`import UIKit

// Level 1: UIImpactFeedbackGenerator — for physical impact events
UIImpactFeedbackGenerator(style: .light).impactOccurred()    // subtle tap
UIImpactFeedbackGenerator(style: .medium).impactOccurred()   // standard tap
UIImpactFeedbackGenerator(style: .heavy).impactOccurred()    // strong tap
UIImpactFeedbackGenerator(style: .soft).impactOccurred()     // rounded bounce
UIImpactFeedbackGenerator(style: .rigid).impactOccurred()    // sharp click

// Level 2: UINotificationFeedbackGenerator — for notifications / results
let gen = UINotificationFeedbackGenerator()
gen.notificationOccurred(.success)   // success: three ascending taps
gen.notificationOccurred(.warning)   // warning: two taps
gen.notificationOccurred(.error)     // error: two taps + pause + tap

// Level 3: UISelectionFeedbackGenerator — for UI element selection
let selectionGen = UISelectionFeedbackGenerator()
selectionGen.selectionChanged()   // subtle click, use for Picker, DatePicker scrolling

// SwiftUI wrapper:
extension View {
    func hapticFeedback(_ type: UIImpactFeedbackGenerator.FeedbackStyle) -> some View {
        self.onTapGesture {
            UIImpactFeedbackGenerator(style: type).impactOccurred()
        }
    }
}

// Usage:
Button("Delete") { delete() }
    .onTapGesture {
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
        showDeleteConfirmation = true
    }`}</CodePre>

          <Note>
            <strong>Haptics only work on real devices.</strong> The Simulator shows nothing.
            Test on hardware before shipping. Also: always use haptics to <em>reinforce</em> a visual action,
            never as the only signal — some users disable haptics.
          </Note>
        </section>

        <hr />

        {/* ─── S31 ─── */}
        <section className="section" id="s31" ref={setRef('s31')}>
          <h2><span className="section-num">31</span>Network Monitoring</h2>
          <p>
            <code>NWPathMonitor</code> lets your app react to network changes — going offline, switching from
            Wi-Fi to cellular, entering low-data mode.
          </p>

          <CodePre>{`import Network

class NetworkMonitor: ObservableObject {
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")

    @Published var isConnected = true
    @Published var connectionType: ConnectionType = .unknown

    enum ConnectionType { case wifi, cellular, ethernet, unknown }

    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            DispatchQueue.main.async {
                self?.isConnected = path.status == .satisfied

                if path.usesInterfaceType(.wifi) {
                    self?.connectionType = .wifi
                } else if path.usesInterfaceType(.cellular) {
                    self?.connectionType = .cellular
                } else if path.usesInterfaceType(.wiredEthernet) {
                    self?.connectionType = .ethernet
                } else {
                    self?.connectionType = .unknown
                }
            }
        }
        monitor.start(queue: queue)
    }

    deinit { monitor.cancel() }
}

// Use in a view:
struct ContentView: View {
    @StateObject private var network = NetworkMonitor()

    var body: some View {
        NavigationStack {
            RecipeListView()
                .banner(isPresented: !network.isConnected) {
                    Label("No Internet Connection", systemImage: "wifi.slash")
                        .padding()
                        .background(.red.opacity(0.9))
                        .foregroundStyle(.white)
                }
        }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S32 ─── */}
        <section className="section" id="s32" ref={setRef('s32')}>
          <h2><span className="section-num">32</span>App Intents &amp; Shortcuts</h2>
          <p>
            App Intents (iOS 16+) expose app actions to Siri, Spotlight, the Shortcuts app, and now the Action
            Button on iPhone 15 Pro+. Define an intent once and Apple's intelligence surfaces it everywhere.
          </p>

          <CodePre>{`import AppIntents

// Define an app intent — a discrete action the app can perform:
struct AddRecipeIntent: AppIntent {
    static var title: LocalizedStringResource = "Add Recipe"
    static var description = IntentDescription("Add a new recipe to your collection")

    // Parameters the user or Siri can provide:
    @Parameter(title: "Recipe Name")
    var recipeName: String

    @Parameter(title: "Servings", default: 4)
    var servings: Int

    // The actual work:
    func perform() async throws -> some ReturnsValue<RecipeEntity> & ProvidesDialog {
        let recipe = try await RecipeService().create(name: recipeName, servings: servings)
        return .result(value: recipe, dialog: "Added \\(recipeName) to your collection.")
    }
}

// Donate intents when the user performs the action in-app:
// (This helps Siri suggestions learn your usage patterns)
func userDidAddRecipe(_ recipe: Recipe) {
    var intent = AddRecipeIntent()
    intent.recipeName = recipe.title
    intent.servings = recipe.servings
    let interaction = INInteraction(intent: intent, response: nil)
    interaction.donate()
}`}</CodePre>

          <h3>Spotlight search integration</h3>
          <CodePre>{`import CoreSpotlight

// Index your content so it appears in Spotlight:
func indexRecipe(_ recipe: Recipe) {
    let attributeSet = CSSearchableItemAttributeSet(contentType: .item)
    attributeSet.title = recipe.title
    attributeSet.contentDescription = recipe.description
    attributeSet.keywords = recipe.ingredients

    let item = CSSearchableItem(
        uniqueIdentifier: recipe.id.uuidString,
        domainIdentifier: "com.yourname.app.recipes",
        attributeSet: attributeSet
    )

    CSSearchableIndex.default().indexSearchableItems([item]) { error in
        if let error { print("Indexing failed: \\(error)") }
    }
}

// Remove from index when deleted:
func removeRecipeFromIndex(id: UUID) {
    CSSearchableIndex.default().deleteSearchableItems(
        withIdentifiers: [id.uuidString]
    )
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S33 ─── */}
        <section className="section" id="s33" ref={setRef('s33')}>
          <h2><span className="section-num">33</span>Live Activities</h2>
          <p>
            Live Activities (iOS 16.1+) display real-time, updating content on the Lock Screen and in the
            Dynamic Island. Perfect for food delivery status, sports scores, workout progress.
          </p>

          <h3>Setup</h3>
          <ol>
            <li>Add <strong>Background Modes</strong> capability → check "Background processing".</li>
            <li>Widget Extension target already supports Live Activities (no separate target needed).</li>
            <li>In your main app's Info.plist: <code>NSSupportsLiveActivities = YES</code></li>
          </ol>

          <CodePre>{`import ActivityKit
import WidgetKit

// Define the data model:
struct OrderAttributes: ActivityAttributes {
    // Static info (set at start, doesn't change):
    public struct ContentState: Codable, Hashable {
        var status: String           // "Preparing", "Out for delivery", "Delivered"
        var estimatedMinutes: Int
    }

    var orderID: String
    var restaurantName: String
}

// Start a Live Activity from the main app:
func startLiveActivity(order: Order) throws {
    let attributes = OrderAttributes(
        orderID: order.id,
        restaurantName: order.restaurant
    )
    let initialState = OrderAttributes.ContentState(
        status: "Preparing",
        estimatedMinutes: 30
    )
    let content = ActivityContent(state: initialState, staleDate: nil)
    let activity = try Activity.request(attributes: attributes, content: content)
    print("Started Live Activity: \\(activity.id)")
}

// Update a Live Activity:
func updateLiveActivity(activity: Activity<OrderAttributes>, status: String, minutes: Int) async {
    let newState = OrderAttributes.ContentState(status: status, estimatedMinutes: minutes)
    let content = ActivityContent(state: newState, staleDate: Date().addingTimeInterval(3600))
    await activity.update(content)
}

// End a Live Activity:
func endLiveActivity(activity: Activity<OrderAttributes>) async {
    let finalState = OrderAttributes.ContentState(status: "Delivered", estimatedMinutes: 0)
    let content = ActivityContent(state: finalState, staleDate: Date())
    await activity.end(content, dismissalPolicy: .after(Date().addingTimeInterval(120)))
}`}</CodePre>

          <h3>Live Activity widget view</h3>
          <CodePre>{`// In the Widget Extension, define the Live Activity views:
struct OrderLiveActivityView: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: OrderAttributes.self) { context in
            // Lock screen view:
            HStack {
                Image(systemName: "bag.fill").foregroundStyle(.orange)
                VStack(alignment: .leading) {
                    Text(context.attributes.restaurantName).font(.headline)
                    Text(context.state.status).foregroundStyle(.secondary)
                }
                Spacer()
                Text("\\(context.state.estimatedMinutes) min")
                    .font(.title2.bold())
            }
            .padding()
            .activityBackgroundTint(.orange.opacity(0.1))

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded view (long press):
                DynamicIslandExpandedRegion(.leading) {
                    Image(systemName: "fork.knife").font(.title)
                }
                DynamicIslandExpandedRegion(.center) {
                    Text(context.state.status)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("\\(context.state.estimatedMinutes)m")
                        .font(.title2.bold())
                }
            } compactLeading: {
                Image(systemName: "bag.fill").foregroundStyle(.orange)
            } compactTrailing: {
                Text("\\(context.state.estimatedMinutes)m")
            } minimal: {
                Image(systemName: "bag.fill")
            }
        }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S34 ─── */}
        <section className="section" id="s34" ref={setRef('s34')}>
          <h2><span className="section-num">34</span>App Clips</h2>
          <p>
            An App Clip is a small, instant version of your app that users can open from NFC tags, QR codes,
            Safari banners, or Maps — without installing the full app. Maximum size: 15 MB.
          </p>

          <h3>Create an App Clip target</h3>
          <ol>
            <li>File → New → Target → App Clip.</li>
            <li>Add files from the main target that the clip needs (right-click → Add to targets → check App Clip).</li>
            <li>Add the App Clip entitlement to the main app: <code>com.apple.developer.associated-appclip-app-identifiers</code>.</li>
            <li>Configure an App Clip Experience in App Store Connect.</li>
          </ol>

          <CodePre>{`// App Clip entry point:
@main
struct MyAppClip: App {
    var body: some Scene {
        WindowGroup {
            ClipRootView()
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { activity in
                    // Parse the URL that triggered the clip
                    guard let url = activity.webpageURL else { return }
                    handleClipURL(url)
                }
        }
    }
}

struct ClipRootView: View {
    var body: some View {
        VStack(spacing: 20) {
            // Show just the key feature:
            QuickOrderView()

            // Prompt to install the full app:
            Link(destination: URL(string: "https://apps.apple.com/app/id123456")!) {
                Label("Get the Full App", systemImage: "arrow.down.app")
            }
        }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S35 ─── */}
        <section className="section" id="s35" ref={setRef('s35')}>
          <h2><span className="section-num">35</span>iPadOS &amp; Split View</h2>
          <p>
            iOS apps run on iPad but aren't optimized by default. Supporting iPad well means adapting your
            layout to the larger screen and supporting multitasking.
          </p>

          <h3>NavigationSplitView</h3>
          <CodePre>{`// NavigationSplitView adapts automatically:
// - iPad: sidebar + detail side by side
// - iPhone: tab-bar or stack navigation (collapses to NavigationStack)

struct MainView: View {
    @State private var selectedRecipe: Recipe?
    @State private var columnVisibility = NavigationSplitViewVisibility.automatic

    var body: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
            // Sidebar:
            RecipeList(selection: $selectedRecipe)
                .navigationTitle("Recipes")
        } detail: {
            if let recipe = selectedRecipe {
                RecipeDetailView(recipe: recipe)
            } else {
                ContentUnavailableView("Select a Recipe", systemImage: "fork.knife")
            }
        }
    }
}`}</CodePre>

          <h3>Adaptive layouts with horizontal size class</h3>
          <CodePre>{`struct AdaptiveLayout: View {
    @Environment(\\.horizontalSizeClass) var hSizeClass

    var body: some View {
        if hSizeClass == .compact {
            // iPhone-style layout:
            VStack { content }
        } else {
            // iPad / large iPhone landscape:
            HStack { sidebar; content }
        }
    }
}`}</CodePre>

          <h3>Pointer and keyboard support</h3>
          <CodePre>{`// On iPadOS with a trackpad or mouse, add pointer hover effects:
Button("Action") { perform() }
    .hoverEffect(.lift)       // pops the button on hover
    .hoverEffect(.highlight)  // tints the button

// Keyboard shortcuts:
Button("Save") { save() }
    .keyboardShortcut("s", modifiers: .command)   // ⌘S

Button("Close") { dismiss() }
    .keyboardShortcut(.escape)   // Esc`}</CodePre>
        </section>

        <hr />

        {/* ─── S36 ─── */}
        <section className="section" id="s36" ref={setRef('s36')}>
          <h2><span className="section-num">36</span>Share Extension</h2>
          <p>
            A Share Extension adds your app to the iOS Share Sheet — users can share URLs, images, and text
            directly into your app from Safari, Photos, and any other app.
          </p>

          <h3>Create the extension</h3>
          <ol>
            <li>File → New → Target → Share Extension.</li>
            <li>The default template creates a <code>ShareViewController.swift</code>.</li>
            <li>Edit <code>NSExtension</code> in the extension's Info.plist to declare what types you accept.</li>
          </ol>

          <CodePre>{`// ShareViewController.swift — a UIViewController subclass:
import UIKit
import Social

class ShareViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        extractSharedContent()
    }

    func extractSharedContent() {
        guard let extensionContext = self.extensionContext,
              let item = extensionContext.inputItems.first as? NSExtensionItem,
              let attachment = item.attachments?.first else {
            extensionContext?.completeRequest(returningItems: nil)
            return
        }

        // Handle URLs:
        if attachment.hasItemConformingToTypeIdentifier("public.url") {
            attachment.loadItem(forTypeIdentifier: "public.url") { [weak self] url, error in
                guard let url = url as? URL else { return }
                DispatchQueue.main.async {
                    self?.handleSharedURL(url)
                }
            }
        }

        // Handle images:
        if attachment.hasItemConformingToTypeIdentifier("public.image") {
            attachment.loadItem(forTypeIdentifier: "public.image") { [weak self] image, error in
                DispatchQueue.main.async {
                    self?.handleSharedImage(image)
                }
            }
        }
    }

    func handleSharedURL(_ url: URL) {
        // Save to App Group shared container so main app can read it:
        let defaults = UserDefaults(suiteName: "group.com.yourname.MyApp")
        defaults?.set(url.absoluteString, forKey: "sharedURL")
        extensionContext?.completeRequest(returningItems: nil)
    }

    func handleSharedImage(_ image: Any?) { /* … */ }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S37 ─── */}
        <section className="section" id="s37" ref={setRef('s37')}>
          <h2><span className="section-num">37</span>WKWebView Offline Caching</h2>
          <p>
            For a WebView app, offline support means the app remains functional (or at least gracefully degrades)
            when the network is unavailable.
          </p>

          <h3>Service Worker caching (web-side)</h3>
          <CodePre>{`// The best offline strategy for a WebView app is a Service Worker
// registered by your web app. WKWebView supports Service Workers.

// In your web app's service worker (sw.js):
const CACHE_NAME = 'hearth-v2';
const STATIC_ASSETS = ['/', '/index.html', '/app.js', '/styles.css'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached ?? fetch(event.request).then(response => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                return response;
            });
        })
    );
});`}</CodePre>

          <h3>Native offline fallback page</h3>
          <CodePre>{`// Detect navigation failure and show a native offline screen:
class WebViewCoordinator: NSObject, WKNavigationDelegate {
    var parent: WebView

    func webView(_ webView: WKWebView,
                 didFailProvisionalNavigation navigation: WKNavigation!,
                 withError error: Error) {
        let nsError = error as NSError
        // NSURLErrorNotConnectedToInternet = -1009
        // NSURLErrorCannotConnectToHost = -1004
        if nsError.code == NSURLErrorNotConnectedToInternet ||
           nsError.code == NSURLErrorCannotConnectToHost {
            parent.isOffline = true
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        parent.isOffline = false
    }
}

struct WebView: UIViewRepresentable {
    let url: URL
    @Binding var isOffline: Bool
    // …
}

// In the parent view:
ZStack {
    WebView(url: appURL, isOffline: $isOffline)
    if isOffline {
        OfflineBannerView()
    }
}`}</CodePre>

          <h3>Persistent WKWebView cache</h3>
          <CodePre>{`// Use a non-persistent data store to control caching:
let config = WKWebViewConfiguration()

// Default: .defaultNonPersistentDataStore()  ← cache cleared each session
// Use shared persistent store for caching across launches:
config.websiteDataStore = WKWebsiteDataStore.default()   // persistent

// Set cache policy per request:
var request = URLRequest(url: appURL)
request.cachePolicy = .returnCacheDataElseLoad   // use cache if available, only fetch if not
let webView = WKWebView(frame: .zero, configuration: config)
webView.load(request)`}</CodePre>
        </section>

        <hr />

        {/* ─── S38 ─── */}
        <section className="section" id="s38" ref={setRef('s38')}>
          <h2><span className="section-num">38</span>Request App Review</h2>

          <CodePre>{`import StoreKit

// Ask for a review at the right moment — after a success, not on first launch.
// Apple rate-limits this: users see the dialog at most 3 times in 365 days.
// You can't guarantee it shows — Apple decides when.

struct RecipeDetailView: View {
    @Environment(\\.requestReview) var requestReview

    var body: some View {
        RecipeContent()
            .onAppear {
                // Ask after the user has gotten value from the app:
                if UserDefaults.standard.integer(forKey: "successCount") >= 5 {
                    requestReview()
                }
            }
    }
}

// Or trigger from a button:
Button("Rate this App") {
    requestReview()
}`}</CodePre>

          <Note>
            <strong>Don't ask too early.</strong> Prompt after the user has had a meaningful experience — finished
            a recipe, completed an exam section, used the app 5+ times. Asking immediately after install produces
            low ratings and potentially policy violations.
          </Note>
        </section>

        <hr />

        {/* ─── S39 ─── */}
        <section className="section" id="s39" ref={setRef('s39')}>
          <h2><span className="section-num">39</span>Siri &amp; Voice</h2>

          <h3>Siri shortcut donations</h3>
          <CodePre>{`import Intents

// Tell Siri about actions the user performs so it can suggest them:
func donateIntent(recipeName: String) {
    let intent = INSearchForMediaIntent()
    intent.mediaItems = [
        INMediaItem(identifier: recipeName, title: recipeName, type: .music, artwork: nil)
    ]
    let interaction = INInteraction(intent: intent, response: nil)
    interaction.donate { error in
        if let error { print("Intent donation failed: \\(error)") }
    }
}

// After several donations, Siri may suggest "Open [App] → [Action]"
// on the Lock Screen or in Siri suggestions.`}</CodePre>

          <h3>App Intents for Siri</h3>
          <CodePre>{`// With App Intents (iOS 16+), Siri can run your intents directly:
struct FindRecipeIntent: AppIntent {
    static var title: LocalizedStringResource = "Find Recipe"
    static var description = IntentDescription("Search your recipe collection by name")

    // Siri understands: "Hey Siri, find pasta recipe in [AppName]"
    static var openAppWhenRun = false   // can run in background

    @Parameter(title: "Recipe Name")
    var name: String

    func perform() async throws -> some ReturnsValue<[RecipeEntity]> & ProvidesDialog {
        let results = try await RecipeService().search(query: name)
        if results.isEmpty {
            return .result(value: [], dialog: "No recipes found for \\(name)")
        }
        return .result(value: results, dialog: "Found \\(results.count) recipes for \\(name)")
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S40 ─── */}
        <section className="section" id="s40" ref={setRef('s40')}>
          <h2><span className="section-num">40</span>Shake &amp; Feedback</h2>

          <h3>Shake to undo (system default)</h3>
          <CodePre>{`// iOS has built-in shake-to-undo. Enable or disable:
// UIApplication.shared.applicationSupportsShakeToEdit = true  // default

// To detect shake in SwiftUI:
extension UIWindow {
    open override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        if motion == .motionShake {
            NotificationCenter.default.post(name: .deviceShook, object: nil)
        }
    }
}
extension Notification.Name {
    static let deviceShook = Notification.Name("deviceShook")
}

// In a view:
.onReceive(NotificationCenter.default.publisher(for: .deviceShook)) { _ in
    showFeedbackSheet = true
}`}</CodePre>

          <h3>MetricKit crash diagnostics</h3>
          <CodePre>{`// Receive on-device crash reports and CPU hangs:
import MetricKit

class AppMetricsHandler: NSObject, MXMetricManagerSubscriber {
    override init() {
        super.init()
        MXMetricManager.shared.add(self)
    }

    func didReceive(_ payloads: [MXDiagnosticPayload]) {
        for payload in payloads {
            if let crashDiagnostics = payload.crashDiagnostics {
                for crash in crashDiagnostics {
                    // Log crash details to your analytics:
                    sendCrashReport(
                        type: crash.crashMetaData?.crashSignal ?? "unknown",
                        data: crash.jsonRepresentation()
                    )
                }
            }
        }
    }
}`}</CodePre>

          <h3>In-app bug reporting</h3>
          <CodePre>{`struct FeedbackView: View {
    @State private var feedbackText = ""
    @State private var screenshot: UIImage?
    @State private var isSending = false
    @State private var didSend = false
    @Environment(\\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            Form {
                Section("Describe the issue") {
                    TextEditor(text: $feedbackText)
                        .frame(height: 120)
                }

                if let screenshot {
                    Section("Screenshot") {
                        Image(uiImage: screenshot)
                            .resizable().scaledToFit().frame(height: 200)
                    }
                }
            }
            .navigationTitle("Send Feedback")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Send") { Task { await sendFeedback() } }
                        .disabled(feedbackText.isEmpty || isSending)
                }
            }
        }
        .onAppear { screenshot = captureCurrentScreen() }
    }

    func captureCurrentScreen() -> UIImage? {
        // Capture the screen to include with the bug report
        let renderer = UIGraphicsImageRenderer(bounds: UIScreen.main.bounds)
        return renderer.image { ctx in
            UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .first?.windows.first?
                .layer.render(in: ctx.cgContext)
        }
    }

    func sendFeedback() async {
        isSending = true
        // Send feedbackText + screenshot to your endpoint
        try? await FeedbackService().submit(text: feedbackText, image: screenshot)
        isSending = false
        didSend = true
        dismiss()
    }
}

          ★ This completes the iOS guide — 40 sections covering everything from first device run to advanced
          iOS system features.`}</CodePre>

          <p className="finished-marker">
            ★ Core iOS features covered. Continue for Handoff, SFSafariViewController, data protection, and more.
          </p>
        </section>

        <hr />

        {/* ─── S41 ─── */}
        <section className="section" id="s41" ref={setRef('s41')}>
          <h2><span className="section-num">41</span>Handoff &amp; Continuity</h2>
          <p>
            Handoff lets users start an activity on one device and continue it on another — for example,
            start reading a recipe on iPhone and pick it up on iPad or Mac.
          </p>

          <h3>Enable Handoff</h3>
          <ol>
            <li>Xcode → Signing &amp; Capabilities → + Capability → Associated Domains.</li>
            <li>Add an activity type string (reverse-DNS, e.g. <code>com.yourname.app.viewrecipe</code>).</li>
          </ol>

          <h3>Donate an activity</h3>
          <CodePre>{`import UIKit

class RecipeViewController: UIViewController {
    var recipe: Recipe?

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        donateHandoffActivity()
    }

    func donateHandoffActivity() {
        guard let recipe else { return }

        let activity = NSUserActivity(activityType: "com.yourname.app.viewrecipe")
        activity.title = recipe.title
        activity.isEligibleForHandoff = true
        activity.isEligibleForSearch = true
        activity.isEligibleForPublicIndexing = false

        // Pass the recipe ID so the receiving device knows what to show:
        activity.userInfo = ["recipeID": recipe.id.uuidString]
        activity.webpageURL = URL(string: "https://yoursite.com/recipe/\\(recipe.id)")

        userActivity = activity   // assign to UIViewController to activate
        activity.becomeCurrent()
    }
}

// SwiftUI equivalent:
struct RecipeDetailView: View {
    let recipe: Recipe

    var body: some View {
        RecipeContent(recipe: recipe)
            .userActivity("com.yourname.app.viewrecipe") { activity in
                activity.title = recipe.title
                activity.userInfo = ["recipeID": recipe.id.uuidString]
                activity.isEligibleForHandoff = true
            }
    }
}

// Receive on the other device:
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onContinueUserActivity("com.yourname.app.viewrecipe") { activity in
                    if let id = activity.userInfo?["recipeID"] as? String {
                        navigateToRecipe(id: id)
                    }
                }
        }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S42 ─── */}
        <section className="section" id="s42" ref={setRef('s42')}>
          <h2><span className="section-num">42</span>SFSafariViewController</h2>
          <p>
            <code>SFSafariViewController</code> opens a full Safari browser inside your app — complete with
            Reader mode, content blockers, AutoFill, and <strong>shared cookies with Safari</strong> (unlike
            <code>WKWebView</code>). Use it for OAuth flows, help pages, and links that users may want to
            bookmark.
          </p>

          <CodePre>{`import SafariServices
import SwiftUI

struct SafariView: UIViewControllerRepresentable {
    let url: URL
    var configuration: SFSafariViewController.Configuration?

    func makeUIViewController(context: Context) -> SFSafariViewController {
        let config = configuration ?? {
            let c = SFSafariViewController.Configuration()
            c.entersReaderIfAvailable = false
            c.barCollapsingEnabled = true
            return c
        }()

        let vc = SFSafariViewController(url: url, configuration: config)
        vc.preferredBarTintColor = UIColor.systemBackground
        vc.preferredControlTintColor = UIColor.systemBlue
        vc.dismissButtonStyle = .close
        return vc
    }

    func updateUIViewController(_ vc: SFSafariViewController, context: Context) {}
}

// Usage in SwiftUI:
struct ContentView: View {
    @State private var showSafari = false

    var body: some View {
        Button("Open Help") { showSafari = true }
            .sheet(isPresented: $showSafari) {
                SafariView(url: URL(string: "https://yoursite.com/help")!)
                    .ignoresSafeArea()
            }
    }
}

// For OAuth: SFAuthenticationSession / ASWebAuthenticationSession are better
// because they handle the redirect URL automatically:
import AuthenticationServices

func startOAuthFlow() async throws -> URL {
    let url = URL(string: "https://provider.com/oauth/authorize?client_id=...")!
    let callbackScheme = "myapp"

    return try await withCheckedThrowingContinuation { continuation in
        let session = ASWebAuthenticationSession(url: url, callbackURLScheme: callbackScheme) { url, error in
            if let url { continuation.resume(returning: url) }
            else { continuation.resume(throwing: error ?? URLError(.badURL)) }
        }
        session.prefersEphemeralWebBrowserSession = false   // true = no cookies shared
        session.start()
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S43 ─── */}
        <section className="section" id="s43" ref={setRef('s43')}>
          <h2><span className="section-num">43</span>Data Protection</h2>
          <p>
            iOS automatically encrypts data at rest on devices with a passcode. You can request stronger
            protection classes for sensitive files to ensure they're inaccessible when the device is locked.
          </p>

          <h3>File protection classes</h3>
          <table>
            <tbody>
              <tr><th>Class</th><th>When accessible</th><th>Best for</th></tr>
              <tr><td><code>complete</code></td><td>Only when device is unlocked</td><td>Highly sensitive data (private keys, health data)</td></tr>
              <tr><td><code>completeUnlessOpen</code></td><td>While device is unlocked OR if file was open before lock</td><td>Files that need background access during transfers</td></tr>
              <tr><td><code>completeUntilFirstUserAuthentication</code></td><td>After first unlock until power-off</td><td>Most app data — good balance of security and background access</td></tr>
              <tr><td><code>none</code></td><td>Always</td><td>Non-sensitive data that needs access before first unlock</td></tr>
            </tbody>
          </table>

          <CodePre>{`// Set protection when creating a file:
let data = sensitiveData
let fileURL = documentsDir.appending(path: "private.dat")

try data.write(to: fileURL, options: .completeFileProtection)

// Or set it on an existing file:
try FileManager.default.setAttributes(
    [.protectionKey: FileProtectionType.complete],
    ofItemAtPath: fileURL.path
)

// Enable for the entire App Group container:
// In Xcode → Signing & Capabilities → Data Protection → check "Complete Protection"

// Check current protection:
let attrs = try FileManager.default.attributesOfItem(atPath: fileURL.path)
let protection = attrs[.protectionKey] as? FileProtectionType
// protection == .complete`}</CodePre>

          <h3>Keychain access control</h3>
          <CodePre>{`// Require biometric authentication to access a Keychain item:
let access = SecAccessControlCreateWithFlags(
    nil,
    kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
    .biometryCurrentSet,    // requires Face/Touch ID currently enrolled
    nil
)!

let query: [CFString: Any] = [
    kSecClass: kSecClassGenericPassword,
    kSecAttrAccessControl: access,
    kSecValueData: tokenData,
    kSecAttrLabel: "User Session Token",
]
SecItemAdd(query as CFDictionary, nil)
// Reading this item will trigger a biometric prompt automatically`}</CodePre>
        </section>

        <hr />

        {/* ─── S44 ─── */}
        <section className="section" id="s44" ref={setRef('s44')}>
          <h2><span className="section-num">44</span>Debugging on Device</h2>

          <h3>Console logs</h3>
          <CodePre>{`// Structured logging with OSLog (preferred over print()):
import OSLog

// Create a logger for your subsystem:
let logger = Logger(subsystem: "com.yourname.MyApp", category: "networking")

// Log at different levels:
logger.debug("Request started: \\(url)")      // developer-only, stripped in release
logger.info("Cache hit for \\(key)")          // informational
logger.warning("Slow response: \\(duration)ms") // something seems wrong
logger.error("Request failed: \\(error)")    // something is wrong

// View logs in:
// - Xcode console (while connected)
// - Console.app on Mac (stream from device over USB)
// - Instruments → Logging template`}</CodePre>

          <h3>Assert and precondition</h3>
          <CodePre>{`// assert — only runs in Debug builds, ignored in Release:
assert(!username.isEmpty, "Username must not be empty at this point")
assertionFailure("This code path should never be reached")

// precondition — runs in both Debug and Release, crashes in both:
precondition(index >= 0 && index < array.count, "Index out of bounds")
preconditionFailure("Developer error: \\(reason)")

// fatalError — always crashes (even in Release):
fatalError("Unimplemented: \\(#function)")   // use in protocol stubs`}</CodePre>

          <h3>Breakpoints beyond the basics</h3>
          <CodePre>{`// In Xcode, right-click a breakpoint → Edit Breakpoint:

// 1. Condition: only break when true:
//    self.count > 100  → only breaks on the 101st iteration

// 2. Action: log a message without stopping execution
//    "User tapped \\(buttonTitle), state = \\(currentState)"
//    Check "Automatically continue after evaluating" → acts like a log, not a pause

// 3. Symbolic breakpoint: break when any call to a function name:
//    Symbol: [UIView setHidden:]  → breaks whenever any view is hidden

// 4. Exception breakpoint: break on all Swift/ObjC exceptions
//    Debugger → Breakpoints → + → Exception Breakpoint → Swift

// 5. Runtime issues breakpoint: catch main thread checker, address sanitizer, etc.`}</CodePre>

          <h3>View hierarchy debugger</h3>
          <CodePre>{`// While the app is paused in Xcode debugger:
// Debug → View Debugging → Capture View Hierarchy

// Shows a 3D exploded view of every UIView / SwiftUI view on screen.
// Great for debugging layout issues, finding overlapping transparent views,
// and seeing exactly what's in the view tree.

// Or: Instruments → UI profiling`}</CodePre>
        </section>

        <hr />

        {/* ─── S45 ─── */}
        <section className="section" id="s45" ref={setRef('s45')}>
          <h2><span className="section-num">45</span>App Thinning &amp; Binary Size</h2>
          <p>
            Apple's App Thinning delivers only the resources each device needs, reducing download size. Three
            components: Slicing, Bitcode, and On-Demand Resources.
          </p>

          <h3>Slicing</h3>
          <p>
            The App Store automatically creates variant IPA files for different device types. Each user downloads
            only the assets matching their device's screen resolution and CPU architecture. This happens
            automatically — you don't configure it.
          </p>

          <h3>Measuring your binary size</h3>
          <CodePre>{`// In Xcode Organizer (Window → Organizer → your archive):
// "Distribute App" → ad-hoc or App Store distribution →
// after export, Xcode shows the estimated download size per device class.

// Or check after uploading to App Store Connect:
// My Apps → Your App → a build → "App File Sizes"

// Targets to aim for:
// Initial download: < 200 MB (above this, users can only download on Wi-Fi)
// OTA download threshold Apple warns about: > 200 MB`}</CodePre>

          <h3>On-Demand Resources</h3>
          <CodePre>{`// Tag large assets (videos, level content, fonts) so they download
// only when needed, not at install time:

// 1. In Xcode, select an asset → File inspector → On Demand Resource Tags
//    Add a tag: "level2"

// 2. Download the tag at runtime when needed:
import Foundation

let request = NSBundleResourceRequest(tags: ["level2"])
request.loadingPriority = NSBundleResourceRequestLoadingPriorityUrgent

Task {
    do {
        try await request.beginAccessingResources()
        // Assets with tag "level2" are now available:
        let videoURL = Bundle.main.url(forResource: "intro-level2", withExtension: "mp4")!
        // Use the asset…
        // When done:
        request.endAccessingResources()
    } catch {
        print("Failed to load on-demand resource: \\(error)")
    }
}`}</CodePre>

          <h3>Reducing binary size tips</h3>
          <ul>
            <li><strong>Compress images</strong> — use WebP or HEIF in Asset catalogs instead of PNG where possible.</li>
            <li><strong>Remove unused assets</strong> — Xcode gives warnings; also use tools like FengNiao or LSUnusedResources.</li>
            <li><strong>Dead code stripping</strong> — enabled by default in Release builds. Removes unused Swift/ObjC code from the binary.</li>
            <li><strong>Avoid large SDKs</strong> — each third-party SDK adds to your binary. Prefer lighter alternatives or write the feature yourself if it's small.</li>
            <li><strong>Embed only necessary Swift libraries</strong> — in Build Settings, set "Always Embed Swift Standard Libraries" to No for app extensions that share a container with the main app.</li>
          </ul>

          <p className="finished-marker">
            ★ App size and thinning covered. Continue for Mac Catalyst, Focus Filters, and device testing.
          </p>
        </section>

        <hr />

        {/* ─── S46 ─── */}
        <section className="section" id="s46" ref={setRef('s46')}>
          <h2><span className="section-num">46</span>SwiftUI on Mac (Catalyst &amp; macOS)</h2>
          <p>
            Apple offers two paths to bring an iOS app to Mac: <strong>Mac Catalyst</strong> (runs your iPad app
            with Mac chrome — menus, windows, touchpad support) and building a native <strong>macOS target</strong>
            alongside your iOS target (same SwiftUI code, different platform configuration).
          </p>

          <h3>Mac Catalyst</h3>
          <CodePre>{`// Enable in Xcode → General → Deployment Info:
// Check "Mac" under "Supported Destinations"
// Xcode adds macOS as a build target automatically.

// Adapt specific code for Mac:
#if targetEnvironment(macCatalyst)
    // Mac-specific code:
    let mainMenu = NSMenu(title: "")
    // Add menu items…
#else
    // iOS-only code
#endif

// Scale factor: Mac Catalyst scales iPad UI at 77% by default.
// Override for better Mac integration:
// In Info.plist: UIUserInterfaceIdiom = UIUserInterfaceMac`}</CodePre>

          <h3>macOS-specific SwiftUI</h3>
          <CodePre>{`// Some modifiers are macOS-only:
Text("Menu Item")
    .help("Tooltip text that appears on hover")    // macOS tooltip
    .badge(3)                                       // works on macOS too

// Commands (menu bar items):
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }
            .commands {
                CommandMenu("Recipe") {
                    Button("New Recipe") { newRecipe() }
                        .keyboardShortcut("n", modifiers: .command)
                    Divider()
                    Button("Export…") { export() }
                        .keyboardShortcut("e", modifiers: [.command, .shift])
                }
            }
    }
}

// Multiple windows on macOS:
struct MyApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }

        // Secondary window type:
        Window("Inspector", id: "inspector") {
            InspectorView()
        }
        .defaultSize(width: 300, height: 600)

        // Settings window:
        Settings { SettingsView() }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S47 ─── */}
        <section className="section" id="s47" ref={setRef('s47')}>
          <h2><span className="section-num">47</span>Focus Filters</h2>
          <p>
            Focus Filters (iOS 16+) let users configure how your app behaves when a specific Focus mode is active
            (Work, Personal, Sleep, etc.). For example, a messaging app might hide personal chats during Work Focus.
          </p>

          <CodePre>{`import AppIntents

// Define a Focus filter:
struct RecipeFocusFilter: SetFocusFilterIntent {
    static var title: LocalizedStringResource = "Customize Recipes"
    static var description: IntentDescription? = "Configure which recipes to show during this Focus"

    // The configurable parameter:
    @Parameter(title: "Show Only Favorites", default: false)
    var showOnlyFavorites: Bool

    @Parameter(title: "Category Filter")
    var category: RecipeCategoryEntity?

    // Called when the Focus mode activates:
    func perform() async throws -> some IntentResult {
        // Update app state based on the filter settings:
        FocusState.shared.showOnlyFavorites = showOnlyFavorites
        FocusState.shared.categoryFilter = category?.name
        return .result()
    }
}

// Observe focus changes in the app:
class FocusState: ObservableObject {
    static let shared = FocusState()

    @Published var showOnlyFavorites = false
    @Published var categoryFilter: String?
}

struct RecipeListView: View {
    @ObservedObject private var focusState = FocusState.shared
    @Query var allRecipes: [Recipe]

    var filteredRecipes: [Recipe] {
        var recipes = allRecipes
        if focusState.showOnlyFavorites {
            recipes = recipes.filter { $0.isFavorite }
        }
        if let category = focusState.categoryFilter {
            recipes = recipes.filter { $0.category == category }
        }
        return recipes
    }

    var body: some View {
        List(filteredRecipes) { recipe in RecipeRow(recipe: recipe) }
    }
}`}</CodePre>
        </section>

        <hr />

        {/* ─── S48 ─── */}
        <section className="section" id="s48" ref={setRef('s48')}>
          <h2><span className="section-num">48</span>Testing on Multiple Devices</h2>

          <h3>Simulator device matrix</h3>
          <CodePre>{`# Run UI tests on multiple simulators in parallel:
xcodebuild test \
  -scheme MyApp \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro' \
  -destination 'platform=iOS Simulator,name=iPhone 16' \
  -destination 'platform=iOS Simulator,name=iPad Pro (13-inch) (M4)' \
  -parallel-testing-enabled YES

# The standard device matrix to test against:
# - iPhone SE (3rd gen) — smallest modern screen (375pt)
# - iPhone 16          — mid-size (390pt)
# - iPhone 16 Pro Max  — largest (430pt)
# - iPad (10th gen)    — base iPad
# - iPad Pro 13"       — largest iPad`}</CodePre>

          <h3>Testing accessibility sizes</h3>
          <CodePre>{`// Run snapshot tests at different Dynamic Type sizes:
// Use the Accessibility Inspector or Environment Overrides in Xcode debugger.

// In XCUITest, set accessibility size programmatically:
let app = XCUIApplication()
app.launchArguments = ["--accessibility-size-extra-large"]
app.launch()

// Custom environment override (useful in UI tests):
// XCUIApplication.launchArguments can be read in the app:
if ProcessInfo.processInfo.arguments.contains("--accessibility-size-extra-large") {
    UIApplication.shared.preferredContentSizeCategory = .accessibilityExtraLarge
}`}</CodePre>

          <h3>Device compatibility matrix</h3>
          <table>
            <tbody>
              <tr><th>Minimum iOS</th><th>Devices covered</th><th>Trade-off</th></tr>
              <tr><td>iOS 18</td><td>~85% of active devices</td><td>Can use latest APIs, smaller audience</td></tr>
              <tr><td>iOS 17</td><td>~94% of active devices</td><td>SwiftData, MapKit updates available</td></tr>
              <tr><td>iOS 16</td><td>~97% of active devices</td><td>App Intents, Lock Screen widgets</td></tr>
              <tr><td>iOS 15</td><td>~99% of active devices</td><td>StoreKit 2, async/await support</td></tr>
            </tbody>
          </table>

          <h3>Xcode Simulator tips</h3>
          <CodePre>{`# Delete all Simulators and their data (free up disk space):
xcrun simctl erase all

# Boot a specific simulator:
xcrun simctl boot "iPhone 16 Pro"

# Install an app on a booted Simulator:
xcrun simctl install booted /path/to/MyApp.app

# Trigger a push notification in Simulator (iOS 16+):
# Create apns.json:
# { "aps": { "alert": { "title": "Test", "body": "Hello!" }, "badge": 1 } }
xcrun simctl push booted com.yourname.MyApp apns.json

# Simulate low memory warning:
xcrun simctl notify booted com.apple.UIKit.lowMemory

# Open a URL in Simulator:
xcrun simctl openurl booted "myapp://recipe/42"`}</CodePre>

          <p className="finished-marker">
            ★ Device testing covered. Continue for App Store Optimization and monetization strategy.
          </p>
        </section>

        <hr />

        {/* ─── S49 ─── */}
        <section className="section" id="s49" ref={setRef('s49')}>
          <h2><span className="section-num">49</span>App Store Optimization (ASO)</h2>
          <p>
            ASO is the practice of improving your app's discoverability in the App Store search algorithm.
            Most App Store installs come from search. Small improvements in ranking translate directly to
            more installs.
          </p>

          <h3>The fields that influence search ranking</h3>
          <table>
            <tbody>
              <tr><th>Field</th><th>Characters</th><th>Weight in search</th></tr>
              <tr><td>App Name</td><td>30</td><td>Highest — use your most important keyword here</td></tr>
              <tr><td>Subtitle</td><td>30</td><td>High — second most impactful placement</td></tr>
              <tr><td>Keywords</td><td>100 (comma-separated, no spaces around commas)</td><td>High — hidden from users, purely for search indexing</td></tr>
              <tr><td>Description</td><td>4,000</td><td>Low — Apple's algorithm uses it minimally; it's for conversion, not ranking</td></tr>
              <tr><td>In-App Purchase names</td><td>Varies</td><td>Medium — IAP names are indexed by search</td></tr>
            </tbody>
          </table>

          <h3>Keyword strategy</h3>
          <CodePre>{`// Rules for keywords field:
// - Comma-separated, no spaces after commas: "recipe,cooking,meal,kitchen"
// - Don't repeat words already in the App Name or Subtitle
// - Don't include your own app name, competitors' names, or Apple's trademarks
// - Don't use spaces — Apple treats them as separators but they don't help
// - Do include singular AND plural only if both are commonly searched
//   (usually just singular is sufficient — Apple handles plurals)

// Research keywords:
// - App Store Connect → Keyword Rankings (shows where you rank for each keyword)
// - Competitors' apps → look at their names, subtitles, screenshots
// - Google Play Keyword Tool, Sensor Tower, AppFollow (paid tools)
// - Apple Search Ads keyword suggestions (free)`}</CodePre>

          <h3>Screenshots drive conversion</h3>
          <p>
            The first 2-3 screenshots are shown in search results (before the user taps your app). These
            are the highest-leverage creative asset you control. Tips:
          </p>
          <ul>
            <li>Lead with the value proposition, not the app interface. Users need to understand "what's in it for me" in 2 seconds.</li>
            <li>Use large, legible text overlaid on the screenshot.</li>
            <li>Show the 2-3 most compelling features, in order of importance.</li>
            <li>Test with App Store Connect Experiments — A/B test different screenshot sets on a % of traffic.</li>
            <li>Localize screenshots for major markets (at minimum: US, UK, Australia for English; add DE, FR, JP if applicable).</li>
          </ul>

          <h3>Ratings and reviews</h3>
          <CodePre>{`// Strategies that increase review count:
// 1. Use SKStoreReviewRequest at a natural success moment (§38)
// 2. Reply to reviews in App Store Connect — users see you're responsive
// 3. Ask users who contact support (and got their issue resolved) to leave a review

// Monitor ratings in App Store Connect → Ratings and Reviews
// You can respond to reviews directly in App Store Connect`}</CodePre>
        </section>

        <hr />

        {/* ─── S50 ─── */}
        <section className="section" id="s50" ref={setRef('s50')}>
          <h2><span className="section-num">50</span>Monetization Strategies</h2>

          <h3>The four business models</h3>
          <table>
            <tbody>
              <tr><th>Model</th><th>How it works</th><th>Best for</th></tr>
              <tr><td>Free</td><td>No cost, no IAP. Revenue from ads or brand.</td><td>High-volume utilities, lead generation</td></tr>
              <tr><td>Freemium</td><td>Free core, premium features via IAP</td><td>Productivity apps, tools with power users</td></tr>
              <tr><td>Subscription</td><td>Monthly or annual recurring charge</td><td>Ongoing service, content, or connectivity</td></tr>
              <tr><td>Paid upfront</td><td>One-time purchase before download</td><td>Games, standalone tools, niche professional apps</td></tr>
            </tbody>
          </table>

          <h3>Subscription best practices</h3>
          <CodePre>{`// Subscription tiers (common pattern):
// Monthly: $4.99/month   ← reference price, shows value
// Annual: $29.99/year    ← $2.50/month, 50% off → push this one
// Lifetime: $49.99       ← optional, some users prefer no recurring charges

// Apple's revenue split:
// Year 1: Apple takes 30%, you keep 70%
// After year 1: Apple takes 15%, you keep 85% (for active subscribers)
// Small Business Program: 15% from day 1 if your App Store earnings < $1M/year

// Free trial — critical for subscriptions:
// No trial → users don't trust and don't convert
// 7-day trial is standard; 14 or 30 days for complex apps
// Configure in App Store Connect → In-App Purchases → your subscription → Introductory Offers`}</CodePre>

          <h3>Paywalls that convert</h3>
          <CodePre>{`// High-converting paywall elements:
// 1. Annual plan highlighted as "Best Value" with monthly equivalent price shown
// 2. Social proof: "Join 50,000+ users" or real reviews shown on the paywall
// 3. Feature list: 3-5 bullet points of what Pro unlocks (not what Free doesn't have)
// 4. Prominent free trial CTA: "Start Free Trial — Cancel Anytime"
// 5. Small "Restore Purchases" link at the bottom (required by App Store guidelines)

struct ProPaywallView: View {
    @StateObject private var store = StoreManager()

    var body: some View {
        VStack(spacing: 0) {
            // Hero:
            VStack(spacing: 8) {
                Text("Go Pro").font(.largeTitle.bold())
                Text("Unlock everything in [App]").foregroundStyle(.secondary)
            }
            .padding(.top, 40)

            // Feature bullets:
            VStack(alignment: .leading, spacing: 16) {
                FeatureBullet(icon: "infinity", title: "Unlimited recipes")
                FeatureBullet(icon: "arrow.triangle.2.circlepath", title: "Cloud sync across all devices")
                FeatureBullet(icon: "sparkles", title: "AI-powered meal planning")
            }
            .padding(24)

            Spacer()

            // Plans (annual highlighted):
            VStack(spacing: 12) {
                PlanButton(
                    plan: store.annualProduct,
                    isHighlighted: true,
                    badge: "Best Value"
                ) { Task { try? await store.purchase(store.annualProduct!) } }

                PlanButton(
                    plan: store.monthlyProduct,
                    isHighlighted: false,
                    badge: nil
                ) { Task { try? await store.purchase(store.monthlyProduct!) } }
            }
            .padding()

            // Restore and terms:
            HStack(spacing: 16) {
                Button("Restore Purchases") { Task { try? await AppStore.sync() } }
                Text("·").foregroundStyle(.tertiary)
                Link("Privacy", destination: URL(string: "https://yoursite.com/privacy")!)
                Text("·").foregroundStyle(.tertiary)
                Link("Terms", destination: URL(string: "https://yoursite.com/terms")!)
            }
            .font(.caption)
            .foregroundStyle(.secondary)
            .padding(.bottom)
        }
    }
}`}</CodePre>

          <h3>App Store Search Ads</h3>
          <CodePre>{`// Apple Search Ads Basic:
// - Pay per install, Apple runs the campaign automatically
// - Minimum budget: $20/month (US)
// - Apple uses your existing metadata to target relevant searches
// - Good for: new apps with no brand recognition

// Apple Search Ads Advanced:
// - Full control: keyword bidding, audience targeting, scheduling
// - CPA (cost per acquisition) bidding: you set what you'll pay per install
// - Attribution: see which keywords drive installs and revenue
// - Accessible at searchads.apple.com`}</CodePre>

          <h3>Lifetime deal economics</h3>
          <CodePre>{`// Lifetime pricing math:
// If your average subscriber stays 18 months at $4.99/mo → LTV = $89.82
// Lifetime price should be >= 2x annual ≈ $59.99–$79.99

// Risks of lifetime deals:
// - Revenue front-loaded → cash flow spike now, nothing later
// - Long-term customers who paid once but cost ongoing support
// - Harder to raise prices later for "lifetime" users

// When to offer lifetime:
// - During launch (scarcity creates urgency)
// - As a Patreon/patron tier
// - Never as a permanent storefront option (use limited-time offers)

// Creating a limited-time introductory offer in StoreKit:
// App Store Connect → In-App Purchases → select subscription →
// Introductory Offers → Pay Up Front → set duration and price`}</CodePre>

          <h3>Pricing tiers</h3>
          <p>
            Apple's price tiers are fixed points aligned to local currencies. You don't set an arbitrary price —
            you pick a tier (e.g., Tier 1 = $0.99, Tier 10 = $9.99 in the US). Prices are automatically adjusted
            for other countries based on exchange rates, but you can manually set prices per country/region in
            App Store Connect. Consider local purchasing power when pricing for emerging markets — a $9.99/month
            subscription is prohibitive in India or Brazil; offer a regional price or skip those markets until
            you can price appropriately. Apple introduced "Pricing by Territory" which lets you set per-country
            prices independently rather than relying on the auto-conversion.
          </p>

          <h3>Revenue benchmarks</h3>
          <table>
            <tbody>
              <tr><th>Metric</th><th>Good</th><th>Great</th></tr>
              <tr><td>Free → Trial conversion</td><td>&gt;5%</td><td>&gt;15%</td></tr>
              <tr><td>Trial → Paid conversion</td><td>&gt;20%</td><td>&gt;40%</td></tr>
              <tr><td>Annual subscription rate</td><td>&gt;40%</td><td>&gt;60%</td></tr>
              <tr><td>Monthly churn (subscriptions)</td><td>&lt;10%</td><td>&lt;4%</td></tr>
              <tr><td>App Store rating</td><td>≥4.3</td><td>≥4.7</td></tr>
            </tbody>
          </table>

          <p className="finished-marker">
            ★ Complete iOS guide — 50 sections from Mac setup and Apple Developer enrollment through App Store
            optimization, monetization strategy, and everything in between.
          </p>
        </section>
      </main>
    </div>
  );
}
