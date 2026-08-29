import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

// Per-question stats store with SM-2 spaced repetition + adaptive difficulty.
// Exam-scoped via the `examId` argument on load/save/clear; builder functions
// take the per-exam question list as a parameter so this module is
// exam-agnostic.
//
// SM-2 lite — each answer updates the question's ease factor, interval until
// next review, and next-review timestamp. Subsequent practice sessions can
// pull from the "due" queue or use adaptive difficulty based on rolling
// accuracy.

const STORAGE_KEY_PREFIX = 'exam-prep-drill-stats:';
// Pre-refactor key (AI-901 only). Migrated on first load when the new
// per-exam key is empty.
const LEGACY_AI901_KEY = 'ai-901-v2-drill-stats';

function storageKey(examId: string): string {
  return `${STORAGE_KEY_PREFIX}${examId}`;
}

// Minimal structural shape the builder functions need. Each exam's full
// Question type extends this, so callers can pass their own typed array and
// get back the same type via the generic.
export interface DrillQuestion {
  id: string;
  subdomain: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Confidence = 'guess' | 'unsure' | 'confident';

export interface QuestionStat {
  questionId: string;
  attempts: number;
  correct: number;
  lastResult: 'correct' | 'wrong' | null;
  lastConfidence: Confidence | null;
  lastSeenAt: number; // epoch ms

  // SM-2 spaced repetition fields (defaults applied when missing)
  interval?: number;       // days until next review
  ease?: number;           // 0.1..1.0 — lower = harder for this user
  repetitions?: number;    // consecutive correct answers
  nextReviewAt?: number;   // epoch ms — due when this <= now
}

export type StatsMap = Record<string, QuestionStat>;
const observations = new WeakMap<StatsMap, { value: string | null; revision: number }>();

const bindObservation = (
  stats: StatsMap,
  observation: { value: string | null; revision: number },
): StatsMap => {
  observations.set(stats, observation);
  return stats;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function loadStats(examId: string): StatsMap {
  try {
    const key = storageKey(examId);
    const observation = localStorage.observeItem(key);
    const raw = observation.value;
    if (raw) {
      const parsed = JSON.parse(raw);
      return bindObservation(typeof parsed === 'object' && parsed ? parsed : {}, observation);
    }
    // One-time migration: when the AI901 per-exam key is empty, pull from
    // the legacy hardcoded key so existing users don't lose history.
    if (examId === 'AI901') {
      const legacy = localStorage.getItem(LEGACY_AI901_KEY);
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (parsed && typeof parsed === 'object') {
            localStorage.setItem(storageKey(examId), legacy);
            return bindObservation(parsed, localStorage.observeItem(key));
          }
        } catch { /* fall through to {} */ }
      }
    }
    return bindObservation({}, observation);
  } catch {
    return bindObservation({}, { value: null, revision: 0 });
  }
}

export function saveStats(examId: string, stats: StatsMap) {
  try {
    const key = storageKey(examId);
    const value = JSON.stringify(stats);
    const observed = observations.get(stats);
    if (observed) {
      const result = localStorage.setItemIfObserved(key, value, observed);
      if (result.saved) {
        bindObservation(stats, result.observation);
      }
      return;
    }
    localStorage.setItem(key, value);
    bindObservation(stats, localStorage.observeItem(key));
  } catch {
    // ignore quota errors
  }
}

// SM-2 update rule. Mutates and returns a new stat. Confidence weights how
// much we trust a correct answer (lucky guess → small interval bump;
// confident-and-correct → big bump).
function applySM2(stat: QuestionStat, correct: boolean, confidence: Confidence): QuestionStat {
  const now = Date.now();
  const prevEase = stat.ease ?? 0.5;
  const prevInterval = stat.interval ?? 0;
  const prevReps = stat.repetitions ?? 0;

  let ease: number;
  let interval: number;
  let repetitions: number;

  if (!correct) {
    ease = Math.max(0.1, prevEase * 0.8);
    interval = 1;
    repetitions = 0;
  } else {
    repetitions = prevReps + 1;
    const baseInterval = Math.max(1, prevInterval);
    if (confidence === 'guess') {
      interval = Math.max(1, Math.round(baseInterval * 1.2));
      ease = Math.max(0.1, prevEase * 0.95);
    } else if (confidence === 'unsure') {
      interval = Math.max(1, Math.round(baseInterval * 2));
      ease = prevEase;
    } else {
      interval = Math.max(2, Math.round(baseInterval * 3));
      ease = Math.min(1.0, prevEase * 1.15);
    }
  }

  interval = Math.min(60, interval);

  return {
    ...stat,
    ease,
    interval,
    repetitions,
    nextReviewAt: now + interval * DAY_MS,
  };
}

export function recordAnswer(
  stats: StatsMap,
  questionId: string,
  correct: boolean,
  confidence: Confidence
): StatsMap {
  const existing = stats[questionId] ?? {
    questionId,
    attempts: 0,
    correct: 0,
    lastResult: null as 'correct' | 'wrong' | null,
    lastConfidence: null as Confidence | null,
    lastSeenAt: 0,
  };
  const withCount: QuestionStat = {
    ...existing,
    attempts: existing.attempts + 1,
    correct: existing.correct + (correct ? 1 : 0),
    lastResult: correct ? 'correct' : 'wrong',
    lastConfidence: confidence,
    lastSeenAt: Date.now(),
  };
  const withSM2 = applySM2(withCount, correct, confidence);
  const next = { ...stats, [questionId]: withSM2 };
  const observation = observations.get(stats);
  if (observation) bindObservation(next, observation);
  return next;
}

export interface SubdomainSummary {
  subdomain: string;
  total: number;
  attempted: number;
  correct: number;
  accuracy: number; // 0..1, NaN if no attempts
}

export function summarizeBySubdomain(stats: StatsMap, questions: DrillQuestion[]): SubdomainSummary[] {
  const map = new Map<string, SubdomainSummary>();
  for (const q of questions) {
    if (!map.has(q.subdomain)) {
      map.set(q.subdomain, { subdomain: q.subdomain, total: 0, attempted: 0, correct: 0, accuracy: NaN });
    }
    const s = map.get(q.subdomain)!;
    s.total += 1;
    const st = stats[q.id];
    if (st && st.attempts > 0) {
      s.attempted += 1;
      if (st.lastResult === 'correct') s.correct += 1;
    }
  }
  for (const s of map.values()) {
    s.accuracy = s.attempted === 0 ? NaN : s.correct / s.attempted;
  }
  return [...map.values()].sort((a, b) => {
    if (Number.isNaN(a.accuracy) && Number.isNaN(b.accuracy)) return 0;
    if (Number.isNaN(a.accuracy)) return 1;
    if (Number.isNaN(b.accuracy)) return -1;
    return a.accuracy - b.accuracy;
  });
}

// Weak-spot queue — questions you've gotten wrong recently, then unattempted,
// then long-ago-correct.
export function buildWeakSpotQueue<Q extends DrillQuestion>(stats: StatsMap, questions: Q[], max: number = 20): Q[] {
  const wrong: Q[] = [];
  const unattempted: Q[] = [];
  const stale: Q[] = [];
  const now = Date.now();
  const STALE_AGE = 1000 * 60 * 60 * 24 * 7;

  for (const q of questions) {
    const st = stats[q.id];
    if (!st || st.attempts === 0) {
      unattempted.push(q);
    } else if (st.lastResult === 'wrong') {
      wrong.push(q);
    } else if (now - st.lastSeenAt > STALE_AGE) {
      stale.push(q);
    }
  }

  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  return [
    ...shuffle(wrong),
    ...shuffle(unattempted),
    ...shuffle(stale),
  ].slice(0, max);
}

// Due-for-review queue — questions whose SM-2 next-review is now or past,
// sorted by overdue-ness (longest overdue first).
export function buildDueQueue<Q extends DrillQuestion>(stats: StatsMap, questions: Q[], max: number = 20): Q[] {
  const now = Date.now();
  const dueWithOverdue: { q: Q; overdueMs: number }[] = [];

  for (const q of questions) {
    const st = stats[q.id];
    if (!st || !st.nextReviewAt || st.nextReviewAt <= now) {
      const overdue = st?.nextReviewAt ? now - st.nextReviewAt : Number.MAX_SAFE_INTEGER;
      dueWithOverdue.push({ q, overdueMs: overdue });
    }
  }
  dueWithOverdue.sort((a, b) => b.overdueMs - a.overdueMs);
  return dueWithOverdue.slice(0, max).map(x => x.q);
}

// Adaptive queue — weight questions by rolling accuracy. If you're doing well,
// bias toward harder difficulty; if struggling, bias toward easier.
export function buildAdaptiveQueue<Q extends DrillQuestion>(stats: StatsMap, questions: Q[], max: number = 20): Q[] {
  const recent = Object.values(stats)
    .filter(s => s.attempts > 0)
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    .slice(0, 20);
  const rollingAcc =
    recent.length === 0
      ? 0.6
      : recent.filter(s => s.lastResult === 'correct').length / recent.length;

  let weights: { easy: number; medium: number; hard: number };
  if (rollingAcc >= 0.8) {
    weights = { easy: 0.1, medium: 0.3, hard: 0.6 };
  } else if (rollingAcc >= 0.6) {
    weights = { easy: 0.3, medium: 0.4, hard: 0.3 };
  } else {
    weights = { easy: 0.6, medium: 0.3, hard: 0.1 };
  }

  const byDifficulty: Record<DrillQuestion['difficulty'], Q[]> = {
    easy: questions.filter(q => q.difficulty === 'easy'),
    medium: questions.filter(q => q.difficulty === 'medium'),
    hard: questions.filter(q => q.difficulty === 'hard'),
  };
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const easyCount = Math.round(max * weights.easy);
  const mediumCount = Math.round(max * weights.medium);
  const hardCount = max - easyCount - mediumCount;

  const picked = [
    ...shuffle(byDifficulty.easy).slice(0, easyCount),
    ...shuffle(byDifficulty.medium).slice(0, mediumCount),
    ...shuffle(byDifficulty.hard).slice(0, hardCount),
  ];
  return shuffle(picked);
}

// Rolling accuracy from the last N stats answers
export function rollingAccuracy(stats: StatsMap, n: number = 20): { accuracy: number; n: number } {
  const recent = Object.values(stats)
    .filter(s => s.attempts > 0)
    .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    .slice(0, n);
  if (recent.length === 0) return { accuracy: NaN, n: 0 };
  const correct = recent.filter(s => s.lastResult === 'correct').length;
  return { accuracy: correct / recent.length, n: recent.length };
}

// Count due questions right now (for the badge on the Due-for-review chip)
export function countDue(stats: StatsMap, questions: DrillQuestion[]): number {
  const now = Date.now();
  let count = 0;
  for (const q of questions) {
    const st = stats[q.id];
    if (!st || !st.nextReviewAt || st.nextReviewAt <= now) count++;
  }
  return count;
}

export function clearStats(examId: string) {
  try {
    localStorage.removeItem(storageKey(examId));
  } catch {
    // ignore
  }
}
