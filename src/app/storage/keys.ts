export interface StorageIdentity {
  tenant: string;
  oid: string;
}

const LEGACY_PREFIXES = [
  'exam-prep-analytics:',
  'exam-prep-bookmarks:',
  'exam-prep-drill-stats:',
  'exam-prep-flashcard-stats:',
  'exam-prep-notes:',
  'exam-prep-sandbox-resume:',
  'exam-prep-streak:',
  'exam-prep-reading:',
  'exam-prep-completed:',
  'exam-prep-quiz:',
  'kb-tts-progress:',
] as const;

const LEGACY_EXACT_KEYS = new Set([
  'ai-901-v2-drill-stats',
  'ai-901-flashcard-stats',
  'azure-guide-checks',
  'workshop-azure-checks',
  'vm-migration-checks',
  'claude-code-checks',
  'hearth-wkwebview-checks',
  'hearth-ios-playbook-checks',
  'ai-features-checks',
]);

export const cleanStorageSegment = (value: string): string =>
  encodeURIComponent(value.trim() || 'unknown');

export const scopedKey = (identity: StorageIdentity, legacyKey: string): string =>
  `lantern:v1:${cleanStorageSegment(identity.tenant)}:${cleanStorageSegment(identity.oid)}:${legacyKey}`;

export const scopedPrefix = (identity: StorageIdentity): string =>
  `lantern:v1:${cleanStorageSegment(identity.tenant)}:${cleanStorageSegment(identity.oid)}:`;

export const isClaimableLegacyKey = (key: string): boolean =>
  LEGACY_EXACT_KEYS.has(key) || LEGACY_PREFIXES.some(prefix => key.startsWith(prefix));

export type SyncKind = 'notes' | 'bookmarks' | 'progress' | 'streak' | 'resume';

export const syncKindForKey = (key: string): SyncKind | null => {
  if (key.startsWith('exam-prep-notes:')) return 'notes';
  if (key.startsWith('exam-prep-bookmarks:')) return 'bookmarks';
  if (key.startsWith('exam-prep-streak:')) return 'streak';
  if (key.startsWith('exam-prep-sandbox-resume:')) return 'resume';
  if (isClaimableLegacyKey(key)) return 'progress';
  return null;
};
