export interface HydrationRecord {
  resourceKey: string;
  revision: number;
  value: string | null;
  tombstone: boolean;
}

export interface HydrationCache {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  getRevision(key: string): number;
  setRevision(key: string, revision: number): void;
}

export interface HydrationResult {
  applied: number;
  removed: number;
  overwrittenLocal: number;
  preservedPending: number;
  preservedNewer: number;
}

export const hydrateCacheFromServer = (
  records: HydrationRecord[],
  cache: HydrationCache,
  pendingKeys: ReadonlySet<string>,
): HydrationResult => {
  const result: HydrationResult = {
    applied: 0,
    removed: 0,
    overwrittenLocal: 0,
    preservedPending: 0,
    preservedNewer: 0,
  };

  records.forEach(record => {
    if (pendingKeys.has(record.resourceKey)) {
      result.preservedPending += 1;
      return;
    }

    const localValue = cache.getItem(record.resourceKey);
    const localRevision = cache.getRevision(record.resourceKey);
    if (localRevision > record.revision) {
      result.preservedNewer += 1;
      return;
    }

    if (record.tombstone) {
      if (localValue !== null) {
        cache.removeItem(record.resourceKey);
        result.removed += 1;
      }
      cache.setRevision(record.resourceKey, record.revision);
      return;
    }

    if (record.value === null) return;
    if (localValue !== null) result.overwrittenLocal += 1;
    cache.setItem(record.resourceKey, record.value);
    cache.setRevision(record.resourceKey, record.revision);
    result.applied += 1;
  });

  return result;
};

export interface CapturedIdentityHydrationAdapter<Identity> {
  pendingKeys(identity: Identity): ReadonlySet<string>;
  cache(identity: Identity): HydrationCache;
}

export const hydrateCapturedIdentity = <Identity>(
  records: HydrationRecord[],
  capturedIdentity: Identity,
  adapter: CapturedIdentityHydrationAdapter<Identity>,
): HydrationResult => hydrateCacheFromServer(
  records,
  adapter.cache(capturedIdentity),
  adapter.pendingKeys(capturedIdentity),
);
