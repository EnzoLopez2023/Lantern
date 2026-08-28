import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

// Bookmarks — save questions or flashcards for later review. Separate from
// the in-exam flag (that's transient per-attempt).

const STORAGE_KEY = 'exam-prep-bookmarks:';

export type BookmarkScope = 'question' | 'flashcard';

function storeKey(examId: string, scope: BookmarkScope): string {
  return `${STORAGE_KEY}${examId}:${scope}`;
}

export function loadBookmarks(examId: string, scope: BookmarkScope): Set<string> {
  try {
    const raw = localStorage.getItem(storeKey(examId, scope));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

export function saveBookmarks(examId: string, scope: BookmarkScope, ids: Set<string>): void {
  try {
    localStorage.setItem(storeKey(examId, scope), JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

export function isBookmarked(examId: string, scope: BookmarkScope, id: string): boolean {
  return loadBookmarks(examId, scope).has(id);
}

export function toggleBookmark(examId: string, scope: BookmarkScope, id: string): boolean {
  const set = loadBookmarks(examId, scope);
  let nowOn: boolean;
  if (set.has(id)) {
    set.delete(id);
    nowOn = false;
  } else {
    set.add(id);
    nowOn = true;
  }
  saveBookmarks(examId, scope, set);
  return nowOn;
}
