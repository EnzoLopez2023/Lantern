import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

// Client-side analytics store. Captures attempt summaries with
// per-question time tracking — the existing backend schema doesn't
// store time-per-question, so we keep this locally as a circular
// buffer of the last 20 attempts.

const STORAGE_PREFIX = 'exam-prep-analytics:';
const MAX_ATTEMPTS = 20;

export interface PerQuestion {
  questionId: string;
  timeSec: number;
  correct: boolean;
  domain: number; // 1 | 2 for AI-901; 1 | 2 | 3 for AZ-900; allow any vendor scheme
  subdomain: string;
}

export interface AttemptSummary {
  id: string;             // local-only id (timestamp)
  completedAt: number;    // epoch ms
  scoreScaled: number;    // 0-1000
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  timeSpentSec: number;
  mode: 'full' | 'practice';
  practiceMode: 'strict' | 'practice';
  perQuestion: PerQuestion[];
}

export function loadAttempts(examId: string): AttemptSummary[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + examId);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveAttempt(examId: string, attempt: AttemptSummary): void {
  try {
    const list = loadAttempts(examId);
    list.push(attempt);
    list.sort((a, b) => b.completedAt - a.completedAt);
    const trimmed = list.slice(0, MAX_ATTEMPTS);
    localStorage.setItem(STORAGE_PREFIX + examId, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

// Activity heatmap data: count of questions answered per local day.
// Returns the last `days` entries, oldest first, with date in YYYY-MM-DD.
export function activityHeatmap(examId: string, days: number = 84): { date: string; count: number }[] {
  const attempts = loadAttempts(examId);
  const counts = new Map<string, number>();

  for (const a of attempts) {
    if (a.perQuestion.length > 0) {
      const d = new Date(a.completedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
      // We only credit one day per attempt's per-question entry — using completedAt is good enough.
    }
  }

  const out: { date: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    out.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return out;
}

// Subdomain mastery over time: returns latest-attempt accuracy per subdomain
// across the last N attempts.
export function subdomainOverTime(examId: string, lastN: number = 5): {
  subdomain: string;
  series: Array<{ attemptId: string; date: number; accuracy: number; total: number }>;
}[] {
  const attempts = loadAttempts(examId).slice(0, lastN).reverse(); // oldest-first
  const subMap = new Map<string, { attemptId: string; date: number; accuracy: number; total: number }[]>();

  for (const a of attempts) {
    const bySub = new Map<string, { correct: number; total: number }>();
    for (const q of a.perQuestion) {
      if (!bySub.has(q.subdomain)) bySub.set(q.subdomain, { correct: 0, total: 0 });
      const s = bySub.get(q.subdomain)!;
      s.total += 1;
      if (q.correct) s.correct += 1;
    }
    for (const [sub, { correct, total }] of bySub) {
      if (!subMap.has(sub)) subMap.set(sub, []);
      subMap.get(sub)!.push({
        attemptId: a.id,
        date: a.completedAt,
        accuracy: total === 0 ? 0 : correct / total,
        total,
      });
    }
  }

  return [...subMap.entries()]
    .map(([subdomain, series]) => ({ subdomain, series }))
    .sort((a, b) => a.subdomain.localeCompare(b.subdomain));
}
