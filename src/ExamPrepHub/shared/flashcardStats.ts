import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

// SM-2 spaced repetition state for flashcards. Separate store from MCQ drill
// stats so cards and questions don't interfere. Exam-scoped via the
// `examId` argument on load/save.

const STORAGE_KEY_PREFIX = 'exam-prep-flashcard-stats:';
// Pre-refactor key (AI-901 only). Migrated on first load when the new
// per-exam key is empty.
const LEGACY_AI901_KEY = 'ai-901-flashcard-stats';

function storageKey(examId: string): string {
  return `${STORAGE_KEY_PREFIX}${examId}`;
}

export type FlashcardRating = 'forgot' | 'almost' | 'got-it';

export interface FlashcardStat {
  cardId: string;
  reviews: number;
  interval: number;       // days until next review
  ease: number;           // 0.1..1.0
  nextReviewAt: number;   // epoch ms
  lastReviewedAt: number; // epoch ms
}

export type FlashcardStatsMap = Record<string, FlashcardStat>;
const observations = new WeakMap<FlashcardStatsMap, { value: string | null; revision: number }>();

const bindObservation = (
  stats: FlashcardStatsMap,
  observation: { value: string | null; revision: number },
): FlashcardStatsMap => {
  observations.set(stats, observation);
  return stats;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function loadFlashcardStats(examId: string): FlashcardStatsMap {
  try {
    const key = storageKey(examId);
    const observation = localStorage.observeItem(key);
    const raw = observation.value;
    if (raw) {
      const parsed = JSON.parse(raw);
      return bindObservation(typeof parsed === 'object' && parsed ? parsed : {}, observation);
    }
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

export function saveFlashcardStats(examId: string, stats: FlashcardStatsMap) {
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
    // ignore
  }
}

export function recordFlashcardRating(
  stats: FlashcardStatsMap,
  cardId: string,
  rating: FlashcardRating
): FlashcardStatsMap {
  const now = Date.now();
  const prev = stats[cardId] ?? {
    cardId, reviews: 0, interval: 0, ease: 0.5, nextReviewAt: 0, lastReviewedAt: 0,
  };

  let ease = prev.ease;
  let interval = prev.interval;
  const reviews = prev.reviews + 1;

  if (rating === 'forgot') {
    ease = Math.max(0.1, ease * 0.7);
    interval = 1;
  } else if (rating === 'almost') {
    ease = Math.max(0.1, ease * 0.95);
    interval = Math.max(1, Math.round(Math.max(1, interval) * 1.5));
  } else { // got-it
    ease = Math.min(1.0, ease * 1.15);
    interval = Math.max(2, Math.round(Math.max(1, interval) * 3));
  }
  interval = Math.min(60, interval);

  const next: FlashcardStat = {
    cardId,
    reviews,
    interval,
    ease,
    nextReviewAt: now + interval * DAY_MS,
    lastReviewedAt: now,
  };
  const result = { ...stats, [cardId]: next };
  const observation = observations.get(stats);
  if (observation) bindObservation(result, observation);
  return result;
}

// Cards due now (or never reviewed yet)
export function buildFlashcardDueQueue<T extends { id: string }>(
  cards: T[],
  stats: FlashcardStatsMap
): T[] {
  const now = Date.now();
  const dueWithOverdue: { card: T; overdue: number }[] = [];
  for (const c of cards) {
    const st = stats[c.id];
    if (!st || st.nextReviewAt <= now) {
      const overdue = st ? now - st.nextReviewAt : Number.MAX_SAFE_INTEGER;
      dueWithOverdue.push({ card: c, overdue });
    }
  }
  dueWithOverdue.sort((a, b) => b.overdue - a.overdue);
  return dueWithOverdue.map(x => x.card);
}

export function countDueFlashcards<T extends { id: string }>(cards: T[], stats: FlashcardStatsMap): number {
  return buildFlashcardDueQueue(cards, stats).length;
}
