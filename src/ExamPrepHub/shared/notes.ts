import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

// Personal notes per question or per study-guide section. Stored
// scoped by exam ID so each track has its own notes.

const STORAGE_PREFIX = 'exam-prep-notes:';

export type NoteScope = 'question' | 'section';

function key(examId: string, scope: NoteScope, id: string): string {
  return `${STORAGE_PREFIX}${examId}:${scope}:${id}`;
}

export function loadNote(examId: string, scope: NoteScope, id: string): string {
  try {
    return localStorage.getItem(key(examId, scope, id)) || '';
  } catch {
    return '';
  }
}

export function saveNote(examId: string, scope: NoteScope, id: string, text: string): void {
  try {
    const k = key(examId, scope, id);
    if (text.trim()) localStorage.setItem(k, text);
    else localStorage.removeItem(k);
  } catch {
    // ignore
  }
}

export interface NoteEntry {
  scope: NoteScope;
  id: string;
  text: string;
}

export function listNotes(examId: string): NoteEntry[] {
  const out: NoteEntry[] = [];
  const prefix = `${STORAGE_PREFIX}${examId}:`;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      const rest = k.substring(prefix.length);
      const [scope, ...idParts] = rest.split(':');
      if (scope !== 'question' && scope !== 'section') continue;
      const id = idParts.join(':');
      const text = localStorage.getItem(k) || '';
      if (text.trim()) out.push({ scope: scope as NoteScope, id, text });
    }
  } catch {
    // ignore
  }
  return out;
}
