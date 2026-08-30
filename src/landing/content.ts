/** Real Lantern content, used verbatim so the page proves the product instead of describing it. */

export const GUIDE_TITLES: string[] = [
  'React 19 in Production',
  'Entra ID Deep Dive',
  'JWT Validation',
  'SQLite + better-sqlite3',
  'Azure AI Foundry',
  'TypeScript Strict Mode',
  'MSAL React',
  'Vite Build System',
  'Multi-Stage Dockerfile',
  'Vector Embeddings',
  'Application Security',
  'Express 5 Patterns',
  'SwiftUI Fundamentals',
  'Postgres + pgvector',
  'OCR with Azure Vision',
  'Claude Code Power User',
  'Node.js 22 / 24',
  'GitHub Mastery',
];

export const STUDY_TRACKS: string[] = [
  'U.S. History & the Constitution',
  'Algebra 1',
  'Algebra 2',
  'English 2',
  'English 3',
  'Biology 1',
  'Chemistry',
  'Physics',
  'Environmental Science',
  'Pre-Calculus',
  'Probability & Statistics',
  'Personal Finance',
  'SAT College Readiness',
  'SC Learner’s Permit',
];

/** Interleaved scroller for the marquee — library on one pass, study hall on the next. */
export const MARQUEE_ITEMS: string[] = [
  ...GUIDE_TITLES.slice(0, 9),
  ...STUDY_TRACKS.slice(0, 7),
  ...GUIDE_TITLES.slice(9),
  ...STUDY_TRACKS.slice(7),
];

export interface StatItem {
  value: string;
  label: string;
}

export const STATS: StatItem[] = [
  { value: '50+', label: 'Source-controlled guides, from first app to Key Vault.' },
  { value: '14', label: 'Study Hub tracks — school, SAT, and the SC permit.' },
  { value: 'Azure Speech', label: 'Every guide reads aloud; audio is cached outside the database.' },
  { value: 'Offline', label: 'Read, drill, and resume with no connection; sync recovers.' },
];

export interface FigureCopy {
  n: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
}

export const FIGURES: FigureCopy[] = [
  {
    n: 'FIG. 01',
    kicker: 'KNOWLEDGE BASE · THE GUIDE READER',
    title: 'A guide that explains, then checks you understood.',
    body: 'Every guide is long-form and version-pinned: an analogy for the idea, a diagram for the shape of it, an exam-style tip for the wording that trips people up. Azure Speech reads any section aloud while you follow along.',
    points: [
      'Mermaid diagrams render inline, not as flattened screenshots.',
      'Checklists persist per section and unlock the next.',
      'Listen mode streams TTS and remembers where you paused.',
    ],
  },
  {
    n: 'FIG. 02',
    kicker: 'KNOWLEDGE BASE · SEARCH',
    title: 'Find the paragraph, not just the page.',
    body: 'One field searches every guide by title, heading, and body. Results carry the surrounding sentence and the tags that place it, so you land on the exact step instead of scrolling a table of contents.',
    points: [
      'Ranked matches with the sentence in context.',
      'Keyboard-first: open, move, and enter without the mouse.',
      'Tags cross-link related guides across the library.',
    ],
  },
  {
    n: 'FIG. 03',
    kicker: 'STUDY HUB · DIAGNOSTIC',
    title: 'An honest read on whether you’re ready.',
    body: 'The diagnostic weights your accuracy by domain and maps it to an estimated scaled score against the real pass line. No green checkmark until the numbers earn it — and the weak domain is the one it sends you back to.',
    points: [
      'Domain-weighted accuracy, not a raw percentage.',
      'Estimated scaled score against the published pass mark.',
      'Practice queues the subdomain you guessed at.',
    ],
  },
  {
    n: 'FIG. 04',
    kicker: 'STUDY HUB · FLASHCARDS',
    title: 'Cards on a spacing schedule you don’t manage.',
    body: 'Concept cards graduate new → learning → review on an SM-2-style interval. Cards you flunk drop back into tomorrow’s deck; cards you know cold stretch weeks out. The daily deck is just what’s due.',
    points: [
      'Self-graded recall sets the next interval.',
      'Lapses reset to short intervals automatically.',
      'One deck per track, always current.',
    ],
  },
  {
    n: 'FIG. 05',
    kicker: 'STUDY HUB · EXAM SANDBOX',
    title: 'A sitting that feels like exam day.',
    body: 'Timer, question navigator, flagging, and every supported format — multiple response, ordering, drag-match. Mock, adaptive, and sandbox modes each mirror the real domain weights, then hand you a scaled score at the end.',
    points: [
      'Flag and revisit; the navigator tracks answered and flagged.',
      'Adaptive mode re-weights toward your weak domains mid-exam.',
      'Scaled result with a per-domain breakdown.',
    ],
  },
  {
    n: 'FIG. 06',
    kicker: 'AFTER YOU SIGN IN · YOUR HUB',
    title: 'It remembers where you stopped.',
    body: 'Your hub opens on a stat row, a resume card, and your tracks. Progress is isolated to your Microsoft Entra tenant and user ID, so one sign-in carries the same history to every device you open Lantern on.',
    points: [
      'Resume drops you back into the exact section or question.',
      'Streak, sections cleared, and best score up top.',
      'Everything scoped to your identity — never shared.',
    ],
  },
];

export interface TrustItem {
  head: string;
  body: string;
}

export const TRUST: TrustItem[] = [
  {
    head: 'Private by Entra',
    body: 'State is scoped to your tenant and OID. No shared pool, no cross-tenant reads.',
  },
  {
    head: 'One process, one database',
    body: 'A single Express app over one SQLite authority. Nothing else to stand up.',
  },
  {
    head: 'Yours to keep',
    body: 'Generated audio and study progress belong to your account and export cleanly.',
  },
  {
    head: 'Motion & keys respected',
    body: 'Reduced-motion honored, focus visible, long-form content stays readable.',
  },
];
