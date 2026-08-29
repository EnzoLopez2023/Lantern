import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

// Resume support for in-progress exam sandbox attempts. Snapshot the
// minimal state needed to restore mid-exam after a page reload, then
// clear it on submit.

const STORAGE_KEY = 'exam-prep-sandbox-resume:';

export interface SandboxSnapshot {
  examId: string;
  startedAt: number;        // epoch ms when the exam timer started
  durationSec: number;      // total duration
  questionIds: string[];    // order of questions in this attempt
  answers: Record<string, { selected: number[]; flagged: boolean }>;
  index: number;
  configLength: 'full' | 'short';
  configDomain: 'both' | 1 | 2;
}

export function saveSandboxSnapshot(snapshot: SandboxSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY + snapshot.examId, JSON.stringify(snapshot));
  } catch {
    // ignore
  }
}

export function loadSandboxSnapshot(examId: string): SandboxSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + examId);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.startedAt === 'number' &&
      typeof parsed.durationSec === 'number' &&
      Array.isArray(parsed.questionIds) &&
      typeof parsed.index === 'number'
    ) {
      return parsed as SandboxSnapshot;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSandboxSnapshot(examId: string): void {
  try {
    localStorage.removeItem(STORAGE_KEY + examId);
  } catch {
    // ignore
  }
}

// "Still has time" check — if a snapshot's timer has expired, it's not
// resumable.
export function isSnapshotResumable(snapshot: SandboxSnapshot): boolean {
  const elapsed = Math.floor((Date.now() - snapshot.startedAt) / 1000);
  return elapsed < snapshot.durationSec;
}
