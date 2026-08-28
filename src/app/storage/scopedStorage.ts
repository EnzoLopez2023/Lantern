import {
  isClaimableLegacyKey,
  scopedKey,
  scopedPrefix,
  syncKindForKey,
  type StorageIdentity,
} from './keys';
import {
  CONFLICT_QUEUE_KEY,
  DEAD_LETTER_QUEUE_KEY,
  MUTATION_QUEUE_KEY,
  acknowledgeMutation,
  clearConflict,
  enqueueMutation,
  findCausalDescendants,
  findLatestCausalPredecessor,
  readConflict,
  readDeadLetters,
  readConflicts,
  readMutationQueue,
  rebaseQueuedSuccessors,
  replaceMutation,
  replayMutationQueue,
  type QueuedStorageMutation,
  type QueuedStorageConflict,
} from './mutationQueue';
import {
  hydrateCacheFromServer,
  type HydrationRecord,
  type HydrationResult,
} from './hydrate';
import {
  REVISION_ENTRY_PREFIX,
  REVISION_METADATA_KEY,
  getCacheRevision,
  replaceCacheRevision,
  setCacheRevision,
} from './revisionMetadata';
import {
  acceptServerConflict as acceptServerConflictInStorage,
  retryLocalConflict as retryLocalConflictInStorage,
  serverStateFromConflict,
  type ConflictResolutionAdapter,
  type ConflictReference,
} from './conflictResolution';
import {
  commitMutationBeforeCache,
  durableQueueFailureMessage,
} from './orderedCacheMutation';
import { decodeStateTransportValue } from './payloadBounds';

export type StorageMutation = QueuedStorageMutation;
export interface StorageConflictView extends ConflictReference {
  localValue: string | null;
  baseRevision: number;
  serverRevision: number | null;
  serverValue: string | null;
  serverTombstone: boolean | null;
  serverEvidence: unknown;
  evidenceError: string | null;
}

export interface ConflictActionResult {
  ok: boolean;
  error: string | null;
}

export interface StorageSyncAck {
  revision: number;
}
export type StorageSyncHandler = (
  mutation: StorageMutation,
) => void | StorageSyncAck | Promise<void | StorageSyncAck>;

export interface StorageSyncStatus {
  pendingCount: number;
  pendingOverflow: boolean;
  deadLetterCount: number;
  deadLetterOverflow: boolean;
  conflictCount: number;
  conflictOverflow: boolean;
  conflictSummary: string | null;
  conflicts: StorageConflictView[];
  resolutionError: string | null;
  state: 'idle' | 'offline' | 'syncing' | 'error';
  lastError: string | null;
  hydrationState: 'idle' | 'pulling' | 'error';
  hydrationError: string | null;
}

const MAX_REPORTED_PENDING = 999;
let identity: StorageIdentity = { tenant: 'unassigned', oid: 'unassigned' };
let syncHandler: StorageSyncHandler | null = null;
let hydrationRetryHandler: (() => void | Promise<void>) | null = null;
let draining = false;
let drainRequested = false;
let hydrationState: StorageSyncStatus['hydrationState'] = 'idle';
let hydrationError: string | null = null;
let remoteFailure: string | null = null;
let currentDeadLetterCount = 0;
let currentConflictCount = 0;
let currentConflictSummary: string | null = null;
let currentConflicts: StorageConflictView[] = [];
let resolutionError: string | null = null;
let lastEnqueuedAt = 0;
let fallbackClientId: string | null = null;
let status: StorageSyncStatus = {
  pendingCount: 0,
  pendingOverflow: false,
  deadLetterCount: 0,
  deadLetterOverflow: false,
  conflictCount: 0,
  conflictOverflow: false,
  conflictSummary: null,
  conflicts: [],
  resolutionError: null,
  state: 'offline',
  lastError: null,
  hydrationState: 'idle',
  hydrationError: null,
};
const statusListeners = new Set<() => void>();

const backend = (): Storage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

const publishStatus = (next: StorageSyncStatus): void => {
  status = next;
  statusListeners.forEach(listener => listener());
};

const setPendingStatus = (
  actualCount: number,
  state: StorageSyncStatus['state'],
  lastError: string | null = null,
): void => {
  const effectiveError = lastError
    ?? hydrationError
    ?? resolutionError
    ?? currentConflictSummary
    ?? remoteFailure;
  publishStatus({
    pendingCount: Math.min(actualCount, MAX_REPORTED_PENDING),
    pendingOverflow: actualCount > MAX_REPORTED_PENDING,
    deadLetterCount: Math.min(currentDeadLetterCount, MAX_REPORTED_PENDING),
    deadLetterOverflow: currentDeadLetterCount > MAX_REPORTED_PENDING,
    conflictCount: Math.min(currentConflictCount, MAX_REPORTED_PENDING),
    conflictOverflow: currentConflictCount > MAX_REPORTED_PENDING,
    conflictSummary: currentConflictSummary,
    conflicts: currentConflicts,
    resolutionError,
    state: effectiveError ? 'error' : state,
    lastError: effectiveError,
    hydrationState,
    hydrationError,
  });
};

const conflictSummary = (conflict: QueuedStorageConflict | null): string | null => {
  if (!conflict) return null;
  let evidence = '';
  try {
    evidence = JSON.stringify(conflict.serverEvidence);
  } catch {
    evidence = String(conflict.serverEvidence ?? '');
  }
  const detail = evidence && evidence !== 'null'
    ? ` Server evidence: ${evidence.slice(0, 400)}`
    : '';
  return `Conflict retained for ${conflict.key}: local base revision ${conflict.baseRevision} is stale.${detail}`;
};

const pendingCount = (store: Storage, target: StorageIdentity): number =>
  readMutationQueue(store, target).length;

const conflictResolutionAdapter = (store: Storage): ConflictResolutionAdapter => ({
  readConflict: (target, id) => readConflict(store, target, id),
  readMutations: target => readMutationQueue(store, target),
  replaceMutation: mutation => replaceMutation(store, mutation),
  acknowledge: (target, id) => {
    acknowledgeMutation(store, target, id);
  },
  clearConflict: (target, id) => clearConflict(store, target, id),
  descendants: findCausalDescendants,
  rebaseSuccessors: (target, predecessor, revision) => {
    rebaseQueuedSuccessors(store, target, predecessor, revision);
  },
  readCache: (target, key) => store.getItem(scopedKey(target, key)),
  writeCache: (target, key, value) => {
    const cacheKey = scopedKey(target, key);
    if (value === null) store.removeItem(cacheKey);
    else store.setItem(cacheKey, value);
  },
  replaceRevision: (target, key, revision) => {
    replaceCacheRevision(store, target, key, revision);
  },
  decodeServerValue: decodeStateTransportValue,
  kindForKey: syncKindForKey,
});

const conflictView = (conflict: QueuedStorageConflict): StorageConflictView => {
  try {
    const server = serverStateFromConflict(conflict);
    const serverValue = server.value === null
      ? null
      : decodeStateTransportValue(conflict.key, server.value);
    return {
      id: conflict.id,
      kind: conflict.kind,
      key: conflict.key,
      localValue: conflict.value,
      baseRevision: conflict.baseRevision,
      serverRevision: server.revision,
      serverValue,
      serverTombstone: server.tombstone,
      serverEvidence: conflict.serverEvidence,
      evidenceError: null,
    };
  } catch (error) {
    return {
      id: conflict.id,
      kind: conflict.kind,
      key: conflict.key,
      localValue: conflict.value,
      baseRevision: conflict.baseRevision,
      serverRevision: null,
      serverValue: null,
      serverTombstone: null,
      serverEvidence: conflict.serverEvidence,
      evidenceError: error instanceof Error
        ? error.message
        : 'Server conflict evidence could not be read.',
    };
  }
};

const refreshStatus = (): void => {
  const store = backend();
  if (!store) {
    setPendingStatus(0, 'error', 'Browser storage is unavailable.');
    return;
  }
  try {
    const pending = pendingCount(store, identity);
    currentDeadLetterCount = readDeadLetters(store, identity).length;
    const conflicts = readConflicts(store, identity);
    currentConflictCount = conflicts.length;
    currentConflictSummary = conflictSummary(conflicts.at(-1) ?? null);
    currentConflicts = conflicts.map(conflictView);
    setPendingStatus(pending, syncHandler ? 'idle' : 'offline');
  } catch (error) {
    setPendingStatus(0, 'error', error instanceof Error ? error.message : 'Unable to read sync queue.');
  }
};

const createMutationId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `lantern-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const syncClientId = (): string => {
  const create = (): string => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };
  try {
    if (typeof window !== 'undefined') {
      const key = 'lantern:v1:sync-client-id';
      const existing = window.sessionStorage.getItem(key);
      if (existing) return existing;
      const created = create();
      window.sessionStorage.setItem(key, created);
      return created;
    }
  } catch {
    // Fall back to an in-memory ID when session storage is unavailable.
  }
  fallbackClientId ??= create();
  return fallbackClientId;
};

const createEnqueuedAt = (): number => {
  const clock = typeof performance !== 'undefined'
    ? performance.timeOrigin + performance.now()
    : Date.now();
  lastEnqueuedAt = Math.max(clock, lastEnqueuedAt + 0.001);
  return lastEnqueuedAt;
};

const permanentDeliveryFailure = (error: unknown): boolean => {
  const statusCode = error && typeof error === 'object'
    ? (error as { status?: unknown }).status
    : undefined;
  return statusCode === 400 || statusCode === 413 || statusCode === 422;
};

const conflictDeliveryFailure = (error: unknown): boolean =>
  Boolean(error && typeof error === 'object' && (error as { status?: unknown }).status === 409);

const serverConflictEvidence = (error: unknown): unknown =>
  error && typeof error === 'object' && 'details' in error
    ? (error as { details?: unknown }).details
    : { message: error instanceof Error ? error.message : 'Server state conflict.' };

const drain = async (): Promise<void> => {
  if (draining) {
    drainRequested = true;
    return;
  }
  const store = backend();
  const handler = syncHandler;
  if (!store || !handler) {
    refreshStatus();
    return;
  }
  draining = true;
  const target = { ...identity };
  try {
    setPendingStatus(pendingCount(store, target), 'syncing');
    const result = await replayMutationQueue(store, target, async mutation => {
      const acknowledgement = await handler(mutation);
      if (acknowledgement && Number.isSafeInteger(acknowledgement.revision)) {
        setCacheRevision(store, target, mutation.key, acknowledgement.revision);
      }
      return acknowledgement;
    }, permanentDeliveryFailure, conflictDeliveryFailure, serverConflictEvidence);
    currentDeadLetterCount = result.deadLetterCount;
    const conflicts = readConflicts(store, target);
    currentConflictCount = conflicts.length;
    currentConflictSummary = conflictSummary(conflicts.at(-1) ?? null);
    currentConflicts = conflicts.map(conflictView);
    if (result.deadLettered > 0) {
      remoteFailure = `${result.deadLettered} rejected change${result.deadLettered === 1 ? '' : 's'} moved to the dead-letter queue.`;
    }
    if (result.conflicted > 0) {
      remoteFailure = `${result.conflicted} conflicted change${result.conflicted === 1 ? '' : 's'} retained without overwriting server state.`;
    }
    setPendingStatus(result.pending, result.error ? 'error' : 'idle', result.error);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to replay sync queue.';
    let pending = 0;
    try {
      pending = pendingCount(store, target);
    } catch {
      // The original queue error is the actionable status.
    }
    setPendingStatus(pending, 'error', message);
  } finally {
    draining = false;
    if (drainRequested) {
      drainRequested = false;
      void drain();
    }
  }
};

export const configureStorageIdentity = (next: StorageIdentity): void => {
  if (identity.tenant !== next.tenant || identity.oid !== next.oid) {
    hydrationState = 'idle';
    hydrationError = null;
    remoteFailure = null;
    currentConflictCount = 0;
    currentConflictSummary = null;
    currentConflicts = [];
    resolutionError = null;
  }
  identity = { ...next };
  refreshStatus();
};

export const getStorageIdentity = (): StorageIdentity => ({ ...identity });

export const configureStorageSync = (handler: StorageSyncHandler | null): void => {
  syncHandler = handler;
  refreshStatus();
  if (handler) void drain();
};

export const retryStorageSync = (): void => {
  if (syncHandler) void drain();
};

const resolveConflict = (
  reference: ConflictReference,
  resolution: (
    adapter: ConflictResolutionAdapter,
    target: StorageIdentity,
    selected: ConflictReference,
  ) => unknown,
): ConflictActionResult => {
  const store = backend();
  if (!store) {
    const error = 'Browser storage is unavailable; the conflict remains safely retained.';
    resolutionError = error;
    refreshStatus();
    return { ok: false, error };
  }
  try {
    resolution(conflictResolutionAdapter(store), { ...identity }, reference);
    resolutionError = null;
    remoteFailure = null;
    refreshStatus();
    if (syncHandler) void drain();
    return { ok: true, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Conflict resolution failed.';
    resolutionError = message;
    refreshStatus();
    return { ok: false, error: message };
  }
};

export const acceptConflictServerValue = (
  reference: ConflictReference,
): ConflictActionResult =>
  resolveConflict(reference, acceptServerConflictInStorage);

export const retryConflictLocalValue = (
  reference: ConflictReference,
  confirmed: boolean,
): ConflictActionResult =>
  resolveConflict(
    reference,
    (adapter, target, selected) =>
      retryLocalConflictInStorage(adapter, target, selected, confirmed),
  );

export const reportStoragePullFailure = (error: unknown): void => {
  hydrationState = 'error';
  hydrationError = error instanceof Error ? error.message : 'Initial server sync failed.';
  refreshStatus();
};

export const reportStorageSyncFailure = (error: unknown): void => {
  remoteFailure = error instanceof Error ? error.message : 'Remote synchronization failed.';
  refreshStatus();
};

export const clearStoragePullFailure = (): void => {
  hydrationState = 'idle';
  hydrationError = null;
  refreshStatus();
};

export const reportStoragePullStarted = (): void => {
  hydrationState = 'pulling';
  hydrationError = null;
  refreshStatus();
};

export const configureHydrationRetry = (handler: (() => void | Promise<void>) | null): void => {
  hydrationRetryHandler = handler;
};

export const retryStorageHydration = (): void => {
  if (hydrationRetryHandler) void hydrationRetryHandler();
};

export const getStorageSyncStatus = (): StorageSyncStatus => status;

export const subscribeStorageSyncStatus = (listener: () => void): (() => void) => {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
};

export const hydrateScopedStorage = (records: HydrationRecord[]): HydrationResult => {
  const store = backend();
  if (!store) throw new Error('Browser storage is unavailable.');
  const target = { ...identity };
  const pendingKeys = new Set([
    ...readMutationQueue(store, target).map(mutation => mutation.key),
    ...readConflicts(store, target).map(conflict => conflict.key),
  ]);
  const decodedRecords = records.map(record => ({
    ...record,
    value: record.value === null
      ? null
      : decodeStateTransportValue(record.resourceKey, record.value),
  }));
  return hydrateCacheFromServer(decodedRecords, {
    getItem: key => store.getItem(scopedKey(target, key)),
    setItem: (key, value) => store.setItem(scopedKey(target, key), value),
    removeItem: key => store.removeItem(scopedKey(target, key)),
    getRevision: key => getCacheRevision(store, target, key),
    setRevision: (key, revision) => setCacheRevision(store, target, key, revision),
  }, pendingKeys);
};

const enqueueSyncMutation = (
  store: Storage,
  key: string,
  value: string | null,
): number | null => {
  const kind = syncKindForKey(key);
  if (!kind) return null;
  const clientId = syncClientId();
  const predecessor = findLatestCausalPredecessor(
    [
      ...readMutationQueue(store, identity),
      ...readConflicts(store, identity),
    ],
    clientId,
    kind,
    key,
  );
  const mutation: QueuedStorageMutation = {
    id: createMutationId(),
    kind,
    key,
    value,
    identity: { ...identity },
    baseRevision: getCacheRevision(store, identity, key),
    clientId,
    predecessorId: predecessor?.id ?? null,
    enqueuedAt: createEnqueuedAt(),
    attempts: 0,
  };
  const pending = enqueueMutation(store, mutation);
  setPendingStatus(pending, syncHandler ? 'idle' : 'offline');
  return pending;
};

const persistCacheMutation = (
  key: string,
  value: string | null,
  mutateCache: (store: Storage) => void,
): void => {
  const store = backend();
  if (!store) {
    setPendingStatus(status.pendingCount, 'error', 'Browser storage is unavailable; the change could not be queued.');
    return;
  }
  let cacheFailed = false;
  let pending: number | null = null;
  try {
    pending = commitMutationBeforeCache(
      () => enqueueSyncMutation(store, key, value),
      () => mutateCache(store),
      (error, enqueueResult) => {
        cacheFailed = true;
        const detail = error instanceof Error ? ` ${error.message}` : '';
        setPendingStatus(
          enqueueResult ?? status.pendingCount,
          'error',
          enqueueResult === null
            ? `Browser cache update failed.${detail}`
            : `The server-sync mutation is safely queued, but the browser cache update failed.${detail}`,
        );
      },
    );
  } catch (error) {
    if (!cacheFailed) {
      setPendingStatus(
        status.pendingCount,
        'error',
        durableQueueFailureMessage(error),
      );
    }
    throw error;
  }
  if (pending !== null && syncHandler) void drain();
};

class LanternStorage {
  get length(): number {
    return this.keys().length;
  }

  clear(): void {
    this.keys().forEach(key => this.removeItem(key));
  }

  getItem(key: string): string | null {
    return backend()?.getItem(scopedKey(identity, key)) ?? null;
  }

  key(index: number): string | null {
    return this.keys()[index] ?? null;
  }

  keys(): string[] {
    const store = backend();
    if (!store) return [];
    const prefix = scopedPrefix(identity);
    const keys: string[] = [];
    for (let index = 0; index < store.length; index += 1) {
      const key = store.key(index);
      if (key?.startsWith(prefix)) {
        const legacyKey = key.slice(prefix.length);
        if (
          legacyKey !== MUTATION_QUEUE_KEY
          && legacyKey !== DEAD_LETTER_QUEUE_KEY
          && legacyKey !== CONFLICT_QUEUE_KEY
          && legacyKey !== REVISION_METADATA_KEY
          && !legacyKey.startsWith(REVISION_ENTRY_PREFIX)
          && !legacyKey.startsWith('__lantern-sync-mutation__:')
          && !legacyKey.startsWith('__lantern-sync-dead-letter__:')
          && !legacyKey.startsWith('__lantern-sync-conflict__:')
        ) keys.push(legacyKey);
      }
    }
    return keys.sort();
  }

  removeItem(key: string): void {
    persistCacheMutation(
      key,
      null,
      store => store.removeItem(scopedKey(identity, key)),
    );
  }

  setItem(key: string, value: string): void {
    const localValue = String(value);
    persistCacheMutation(
      key,
      localValue,
      store => store.setItem(scopedKey(identity, key), localValue),
    );
  }
}

export const scopedStorage = new LanternStorage();

export interface LegacyClaimResult {
  found: number;
  copied: number;
  alreadyPresent: number;
  failed: string[];
}

export const claimLegacyEntries = (confirmed: boolean): LegacyClaimResult => {
  if (!confirmed) throw new Error('Legacy claiming requires explicit confirmation.');
  const store = backend();
  const result: LegacyClaimResult = { found: 0, copied: 0, alreadyPresent: 0, failed: [] };
  if (!store) return result;

  const legacyKeys: string[] = [];
  for (let index = 0; index < store.length; index += 1) {
    const key = store.key(index);
    if (key && isClaimableLegacyKey(key)) legacyKeys.push(key);
  }

  result.found = legacyKeys.length;
  legacyKeys.forEach(key => {
    const value = store.getItem(key);
    if (value === null) return;
    const destination = scopedKey(identity, key);
    if (store.getItem(destination) !== null) {
      result.alreadyPresent += 1;
      return;
    }
    try {
      persistCacheMutation(key, value, target => {
        target.setItem(destination, value);
        if (target.getItem(destination) !== value) throw new Error('Verification failed');
      });
      result.copied += 1;
    } catch {
      result.failed.push(key);
    }
  });

  return result;
};
