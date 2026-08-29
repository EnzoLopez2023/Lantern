import type { StorageIdentity, SyncKind } from './keys';

export const MUTATION_QUEUE_KEY = '__lantern-sync-mutations__';
export const DEAD_LETTER_QUEUE_KEY = '__lantern-sync-dead-letters__';
export const CONFLICT_QUEUE_KEY = '__lantern-sync-conflicts__';
const MUTATION_ENTRY_PREFIX = '__lantern-sync-mutation__:';
const DEAD_LETTER_ENTRY_PREFIX = '__lantern-sync-dead-letter__:';
const CONFLICT_ENTRY_PREFIX = '__lantern-sync-conflict__:';

export interface QueuedStorageMutation {
  id: string;
  kind: SyncKind;
  key: string;
  value: string | null;
  identity: StorageIdentity;
  baseRevision: number;
  clientId: string | null;
  predecessorId: string | null;
  enqueuedAt: number;
  attempts: number;
  lastError?: string;
}

export interface QueuedStorageConflict extends QueuedStorageMutation {
  conflictAt: number;
  serverEvidence: unknown;
}

export interface QueueStorage {
  readonly length: number;
  getItem(key: string): string | null;
  key(index: number): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const namespace = (identity: StorageIdentity): string =>
  `lantern:v1:${encodeURIComponent(identity.tenant.trim() || 'unknown')}:${encodeURIComponent(identity.oid.trim() || 'unknown')}:`;

export const mutationQueueStorageKey = (identity: StorageIdentity): string =>
  `${namespace(identity)}${MUTATION_QUEUE_KEY}`;

export const deadLetterStorageKey = (identity: StorageIdentity): string =>
  `${namespace(identity)}${DEAD_LETTER_QUEUE_KEY}`;

type EntryKind = 'mutation' | 'dead-letter' | 'conflict';

const entryPrefix = (kind: EntryKind): string => {
  if (kind === 'dead-letter') return DEAD_LETTER_ENTRY_PREFIX;
  if (kind === 'conflict') return CONFLICT_ENTRY_PREFIX;
  return MUTATION_ENTRY_PREFIX;
};

const entryKey = (identity: StorageIdentity, id: string, kind: EntryKind = 'mutation'): string =>
  `${namespace(identity)}${entryPrefix(kind)}${encodeURIComponent(id)}`;

const sameIdentity = (left: StorageIdentity, right: StorageIdentity): boolean =>
  left.tenant === right.tenant && left.oid === right.oid;

const resourceIdentity = (mutation: Pick<QueuedStorageMutation, 'kind' | 'key'>): string =>
  `${mutation.kind}:${mutation.key}`;

const isLegacyMutation = (value: unknown): value is Omit<
  QueuedStorageMutation,
  'baseRevision' | 'clientId' | 'predecessorId'
> & {
  baseRevision?: number;
  clientId?: string | null;
  predecessorId?: string | null;
} => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<QueuedStorageMutation>;
  return typeof item.id === 'string'
    && typeof item.kind === 'string'
    && typeof item.key === 'string'
    && (typeof item.value === 'string' || item.value === null)
    && typeof item.identity?.tenant === 'string'
    && typeof item.identity?.oid === 'string'
    && (item.baseRevision === undefined
      || (Number.isSafeInteger(item.baseRevision) && item.baseRevision >= 0))
    && (item.clientId === undefined || item.clientId === null || typeof item.clientId === 'string')
    && (item.predecessorId === undefined
      || item.predecessorId === null
      || typeof item.predecessorId === 'string')
    && typeof item.enqueuedAt === 'number'
    && typeof item.attempts === 'number';
};

const normalizeMutation = (
  value: unknown,
): QueuedStorageMutation | null => isLegacyMutation(value)
  ? {
      ...value,
      baseRevision: value.baseRevision ?? 0,
      clientId: value.clientId ?? null,
      predecessorId: value.predecessorId ?? null,
    }
  : null;

const parseMutation = (raw: string | null): QueuedStorageMutation | null => {
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  return normalizeMutation(parsed);
};

const migrateLegacyArray = (
  storage: QueueStorage,
  identity: StorageIdentity,
  kind: 'mutation' | 'dead-letter',
): void => {
  const legacyKey = kind === 'dead-letter'
    ? deadLetterStorageKey(identity)
    : mutationQueueStorageKey(identity);
  const raw = storage.getItem(legacyKey);
  if (!raw) return;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isLegacyMutation)) {
    throw new Error(`The durable ${kind === 'dead-letter' ? 'dead-letter' : 'sync'} queue is invalid.`);
  }
  parsed.forEach(mutation => {
    const normalized = normalizeMutation(mutation)!;
    const destination = entryKey(identity, normalized.id, kind);
    if (storage.getItem(destination) === null) {
      storage.setItem(destination, JSON.stringify(normalized));
    }
  });
  storage.removeItem(legacyKey);
};

const readEntries = (
  storage: QueueStorage,
  identity: StorageIdentity,
  kind: 'mutation' | 'dead-letter',
): QueuedStorageMutation[] => {
  migrateLegacyArray(storage, identity, kind);
  const prefix = `${namespace(identity)}${entryPrefix(kind)}`;
  const byId = new Map<string, QueuedStorageMutation>();
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith(prefix)) continue;
    const raw = storage.getItem(key);
    const mutation = parseMutation(raw);
    if (mutation) {
      byId.set(mutation.id, mutation);
      const parsed = raw ? JSON.parse(raw) as Record<string, unknown> : null;
      if (
        parsed
        && (
          !Object.hasOwn(parsed, 'baseRevision')
          || !Object.hasOwn(parsed, 'clientId')
          || !Object.hasOwn(parsed, 'predecessorId')
        )
      ) {
        storage.setItem(key, JSON.stringify(mutation));
      }
    }
  }
  return [...byId.values()].sort((a, b) =>
    a.enqueuedAt - b.enqueuedAt || a.id.localeCompare(b.id));
};

export const readMutationQueue = (
  storage: QueueStorage,
  identity: StorageIdentity,
): QueuedStorageMutation[] => readEntries(storage, identity, 'mutation');

export const readDeadLetters = (
  storage: QueueStorage,
  identity: StorageIdentity,
): QueuedStorageMutation[] => readEntries(storage, identity, 'dead-letter');

export const readConflicts = (
  storage: QueueStorage,
  identity: StorageIdentity,
): QueuedStorageConflict[] => {
  const prefix = `${namespace(identity)}${CONFLICT_ENTRY_PREFIX}`;
  const conflicts: QueuedStorageConflict[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith(prefix)) continue;
    const raw = storage.getItem(key);
    if (!raw) continue;
    const parsed: unknown = JSON.parse(raw);
    const mutation = normalizeMutation(parsed);
    if (
      mutation
      && sameIdentity(mutation.identity, identity)
      && parsed
      && typeof parsed === 'object'
      && typeof (parsed as Partial<QueuedStorageConflict>).conflictAt === 'number'
    ) {
      conflicts.push({
        ...mutation,
        conflictAt: (parsed as QueuedStorageConflict).conflictAt,
        serverEvidence: (parsed as QueuedStorageConflict).serverEvidence,
      });
    }
  }
  return conflicts.sort((a, b) => a.enqueuedAt - b.enqueuedAt || a.id.localeCompare(b.id));
};

export const readConflict = (
  storage: QueueStorage,
  identity: StorageIdentity,
  id: string,
): QueuedStorageConflict | null =>
  readConflicts(storage, identity).find(conflict => conflict.id === id) ?? null;

export const clearConflict = (
  storage: QueueStorage,
  identity: StorageIdentity,
  id: string,
): void => {
  storage.removeItem(entryKey(identity, id, 'conflict'));
};

export const enqueueMutation = (
  storage: QueueStorage,
  mutation: QueuedStorageMutation,
): number => {
  const key = entryKey(mutation.identity, mutation.id);
  if (storage.getItem(key) === null) storage.setItem(key, JSON.stringify(mutation));
  return readMutationQueue(storage, mutation.identity).length;
};

export const replaceMutation = (
  storage: QueueStorage,
  mutation: QueuedStorageMutation,
): void => {
  storage.setItem(entryKey(mutation.identity, mutation.id), JSON.stringify(mutation));
};

export const acknowledgeMutation = (
  storage: QueueStorage,
  identity: StorageIdentity,
  id: string,
): number => {
  storage.removeItem(entryKey(identity, id));
  return readMutationQueue(storage, identity).length;
};

export const recordMutationFailure = (
  storage: QueueStorage,
  identity: StorageIdentity,
  id: string,
  error: unknown,
): number => {
  const key = entryKey(identity, id);
  const mutation = parseMutation(storage.getItem(key));
  if (mutation) {
    const message = error instanceof Error ? error.message : 'Synchronization failed.';
    storage.setItem(key, JSON.stringify({
      ...mutation,
      attempts: mutation.attempts + 1,
      lastError: message,
    }));
  }
  return readMutationQueue(storage, identity).length;
};

export interface QueueReplayResult {
  delivered: number;
  deadLettered: number;
  deadLetterCount: number;
  conflicted: number;
  conflictCount: number;
  latestConflict: QueuedStorageConflict | null;
  pending: number;
  error: string | null;
}

export interface MutationDeliveryAck {
  revision: number;
}

const isLaterMutation = (
  candidate: QueuedStorageMutation,
  acknowledged: QueuedStorageMutation,
): boolean => candidate.enqueuedAt > acknowledged.enqueuedAt
  || (
    candidate.enqueuedAt === acknowledged.enqueuedAt
    && candidate.id.localeCompare(acknowledged.id) > 0
  );

export const isQueuedSuccessor = (
  candidate: QueuedStorageMutation,
  predecessor: QueuedStorageMutation,
): boolean => candidate.id !== predecessor.id
  && resourceIdentity(candidate) === resourceIdentity(predecessor)
  && isLaterMutation(candidate, predecessor)
  && predecessor.clientId !== null
  && candidate.clientId === predecessor.clientId
  && candidate.predecessorId === predecessor.id;

export const findCausalDescendants = (
  mutations: QueuedStorageMutation[],
  predecessor: QueuedStorageMutation,
): QueuedStorageMutation[] => {
  if (predecessor.clientId === null) return [];
  const descendants: QueuedStorageMutation[] = [];
  const descendantIds = new Set([predecessor.id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const candidate of mutations) {
      if (
        !descendantIds.has(candidate.id)
        && candidate.clientId === predecessor.clientId
        && candidate.predecessorId !== null
        && descendantIds.has(candidate.predecessorId)
        && resourceIdentity(candidate) === resourceIdentity(predecessor)
        && isLaterMutation(candidate, predecessor)
      ) {
        descendantIds.add(candidate.id);
        descendants.push(candidate);
        changed = true;
      }
    }
  }
  return descendants.sort((a, b) =>
    a.enqueuedAt - b.enqueuedAt || a.id.localeCompare(b.id));
};

export const findLatestCausalPredecessor = (
  mutations: QueuedStorageMutation[],
  clientId: string,
  kind: SyncKind,
  key: string,
): QueuedStorageMutation | null => mutations
  .filter(candidate =>
    candidate.kind === kind
    && candidate.key === key
    && candidate.clientId === clientId)
  .sort((left, right) =>
    left.enqueuedAt - right.enqueuedAt || left.id.localeCompare(right.id))
  .at(-1) ?? null;

export const rebaseQueuedSuccessors = (
  storage: QueueStorage,
  identity: StorageIdentity,
  acknowledged: QueuedStorageMutation,
  revision: number,
): number => {
  if (!Number.isSafeInteger(revision) || revision < 0) return 0;
  let rebased = 0;
  findCausalDescendants(readMutationQueue(storage, identity), acknowledged)
    .filter(candidate => candidate.baseRevision === acknowledged.baseRevision)
    .forEach(candidate => {
      const key = entryKey(identity, candidate.id);
      const current = parseMutation(storage.getItem(key));
      if (
        current
        && current.clientId === candidate.clientId
        && current.predecessorId === candidate.predecessorId
        && current.kind === candidate.kind
        && current.key === candidate.key
        && current.baseRevision === acknowledged.baseRevision
      ) {
        storage.setItem(key, JSON.stringify({ ...current, baseRevision: revision }));
        rebased += 1;
      }
    });
  return rebased;
};

export const replayMutationQueue = async (
  storage: QueueStorage,
  identity: StorageIdentity,
  deliver: (
    mutation: QueuedStorageMutation,
  ) => void | MutationDeliveryAck | Promise<void | MutationDeliveryAck>,
  isPermanentFailure: (error: unknown) => boolean = () => false,
  isConflictFailure: (error: unknown) => boolean = () => false,
  conflictEvidence: (error: unknown) => unknown = () => null,
): Promise<QueueReplayResult> => {
  let delivered = 0;
  let deadLettered = 0;
  let conflicted = 0;
  while (true) {
    const queue = readMutationQueue(storage, identity);
    const conflicts = readConflicts(storage, identity);
    const blockedResources = new Set(conflicts.map(resourceIdentity));
    const next = queue.find(mutation => !blockedResources.has(resourceIdentity(mutation)));
    if (!next) {
      return {
        delivered,
        deadLettered,
        deadLetterCount: readDeadLetters(storage, identity).length,
        conflicted,
        conflictCount: conflicts.length,
        latestConflict: conflicts.at(-1) ?? null,
        pending: queue.length,
        error: null,
      };
    }
    try {
      const acknowledgement = await deliver(next);
      if (
        acknowledgement
        && Number.isSafeInteger(acknowledgement.revision)
        && acknowledgement.revision >= 0
      ) {
        rebaseQueuedSuccessors(storage, identity, next, acknowledgement.revision);
      }
      acknowledgeMutation(storage, identity, next.id);
      delivered += 1;
    } catch (error) {
      if (isConflictFailure(error)) {
        const message = error instanceof Error ? error.message : 'Server state conflict.';
        const conflict: QueuedStorageConflict = {
          ...next,
          attempts: next.attempts + 1,
          lastError: message,
          conflictAt: Date.now(),
          serverEvidence: conflictEvidence(error),
        };
        storage.setItem(entryKey(identity, next.id, 'conflict'), JSON.stringify(conflict));
        acknowledgeMutation(storage, identity, next.id);
        conflicted += 1;
        continue;
      }
      if (isPermanentFailure(error)) {
        const message = error instanceof Error ? error.message : 'Permanent synchronization failure.';
        try {
          const deadLetter = {
            ...next,
            attempts: next.attempts + 1,
            lastError: message,
          };
          storage.setItem(entryKey(identity, next.id, 'dead-letter'), JSON.stringify(deadLetter));
          acknowledgeMutation(storage, identity, next.id);
          deadLettered += 1;
          continue;
        } catch (deadLetterError) {
          const pending = recordMutationFailure(storage, identity, next.id, deadLetterError);
          return {
            delivered,
            deadLettered,
            deadLetterCount: readDeadLetters(storage, identity).length,
            conflicted,
            conflictCount: readConflicts(storage, identity).length,
            latestConflict: readConflicts(storage, identity).at(-1) ?? null,
            pending,
            error: deadLetterError instanceof Error ? deadLetterError.message : 'Unable to preserve rejected change.',
          };
        }
      }
      const pending = recordMutationFailure(storage, identity, next.id, error);
      return {
        delivered,
        deadLettered,
        deadLetterCount: readDeadLetters(storage, identity).length,
        conflicted,
        conflictCount: readConflicts(storage, identity).length,
        latestConflict: readConflicts(storage, identity).at(-1) ?? null,
        pending,
        error: error instanceof Error ? error.message : 'Synchronization failed.',
      };
    }
  }
};
