import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

// Daily warmup streak tracker. Keeps consecutive-day completion count for
// each exam in localStorage. Used by the Daily Warmup card in Practice.

export interface StreakState {
  lastDate: string;          // YYYY-MM-DD of last completion (local time)
  currentStreak: number;     // consecutive days
  longestStreak: number;     // best run ever
  totalDays: number;         // total distinct days completed
}

const STORAGE_PREFIX = 'exam-prep-streak:';

function todayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function yesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export function loadStreak(examId: string): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + examId);
    if (!raw) return { lastDate: '', currentStreak: 0, longestStreak: 0, totalDays: 0 };
    const parsed = JSON.parse(raw);
    return {
      lastDate: parsed.lastDate ?? '',
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      totalDays: parsed.totalDays ?? 0,
    };
  } catch {
    return { lastDate: '', currentStreak: 0, longestStreak: 0, totalDays: 0 };
  }
}

export function saveStreak(examId: string, state: StreakState) {
  try {
    localStorage.setItem(STORAGE_PREFIX + examId, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// Record that today's daily warmup is done. Returns the new state with an
// extra `delta` field showing what happened.
export function recordDailyCompletion(examId: string): StreakState & { wasAlreadyDoneToday: boolean } {
  const prev = loadStreak(examId);
  const today = todayDateString();

  // Already done today — no-op
  if (prev.lastDate === today) {
    return { ...prev, wasAlreadyDoneToday: true };
  }

  const yesterday = yesterdayDateString();
  const continued = prev.lastDate === yesterday;

  const currentStreak = continued ? prev.currentStreak + 1 : 1;
  const longestStreak = Math.max(prev.longestStreak, currentStreak);
  const totalDays = prev.totalDays + 1;

  const next: StreakState = { lastDate: today, currentStreak, longestStreak, totalDays };
  saveStreak(examId, next);
  return { ...next, wasAlreadyDoneToday: false };
}

export function isDoneToday(examId: string): boolean {
  return loadStreak(examId).lastDate === todayDateString();
}
