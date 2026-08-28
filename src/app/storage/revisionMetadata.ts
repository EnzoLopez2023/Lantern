export const REVISION_METADATA_KEY = '__lantern-cache-revisions__';
export const REVISION_ENTRY_PREFIX = '__lantern-cache-revision__:';

export interface RevisionIdentity {
  tenant: string;
  oid: string;
}

export interface RevisionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const cleanSegment = (value: string): string =>
  encodeURIComponent(value.trim() || 'unknown');

const scopedRevisionKey = (
  identity: RevisionIdentity,
  suffix: string,
): string => `lantern:v1:${cleanSegment(identity.tenant)}:${cleanSegment(identity.oid)}:${suffix}`;

const revisionEntryKey = (identity: RevisionIdentity, key: string): string =>
  scopedRevisionKey(identity, `${REVISION_ENTRY_PREFIX}${encodeURIComponent(key)}`);

export const getCacheRevision = (
  storage: RevisionStorage,
  identity: RevisionIdentity,
  key: string,
): number => {
  const entry = storage.getItem(revisionEntryKey(identity, key));
  if (entry !== null) {
    const revision = Number(entry);
    return Number.isSafeInteger(revision) && revision >= 0 ? revision : 0;
  }
  const legacy = storage.getItem(scopedRevisionKey(identity, REVISION_METADATA_KEY));
  if (!legacy) return 0;
  const parsed: unknown = JSON.parse(legacy);
  if (!parsed || typeof parsed !== 'object') return 0;
  const revision = (parsed as Record<string, unknown>)[key];
  if (typeof revision !== 'number' || !Number.isSafeInteger(revision) || revision < 0) return 0;
  storage.setItem(revisionEntryKey(identity, key), String(revision));
  return revision;
};

export const setCacheRevision = (
  storage: RevisionStorage,
  identity: RevisionIdentity,
  key: string,
  revision: number,
): void => {
  if (revision > getCacheRevision(storage, identity, key)) {
    storage.setItem(revisionEntryKey(identity, key), String(revision));
  }
};

export const replaceCacheRevision = (
  storage: RevisionStorage,
  identity: RevisionIdentity,
  key: string,
  revision: number,
): void => {
  if (!Number.isSafeInteger(revision) || revision < 0) {
    throw new Error('Cache revision must be a non-negative safe integer.');
  }
  storage.setItem(revisionEntryKey(identity, key), String(revision));
};
