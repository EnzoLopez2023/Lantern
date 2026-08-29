import type { StorageIdentity, SyncKind } from './keys';
import type {
  QueuedStorageConflict,
  QueuedStorageMutation,
} from './mutationQueue';

export interface ConflictReference {
  id: string;
  kind: SyncKind;
  key: string;
}

export interface ServerConflictState {
  revision: number;
  value: string | null;
  tombstone: boolean;
}

export interface ConflictResolutionResult {
  conflictId: string;
  key: string;
  server: ServerConflictState;
  successorCount: number;
}

export interface ConflictResolutionAdapter {
  readConflict(identity: StorageIdentity, id: string): QueuedStorageConflict | null;
  readMutations(identity: StorageIdentity): QueuedStorageMutation[];
  replaceMutation(mutation: QueuedStorageMutation): void;
  acknowledge(identity: StorageIdentity, id: string): void;
  clearConflict(identity: StorageIdentity, id: string): void;
  descendants(
    mutations: QueuedStorageMutation[],
    predecessor: QueuedStorageMutation,
  ): QueuedStorageMutation[];
  rebaseSuccessors(
    identity: StorageIdentity,
    predecessor: QueuedStorageMutation,
    revision: number,
  ): void;
  readCache(identity: StorageIdentity, key: string): string | null;
  writeCache(identity: StorageIdentity, key: string, value: string | null): void;
  replaceRevision(identity: StorageIdentity, key: string, revision: number): void;
  decodeServerValue(key: string, value: string): string;
  kindForKey(key: string): SyncKind | null;
}

const record = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' ? value as Record<string, unknown> : null;

const validRevision = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;

const sameIdentity = (left: StorageIdentity, right: StorageIdentity): boolean =>
  left.tenant === right.tenant && left.oid === right.oid;

const evidenceError = (): Error =>
  new Error('Server conflict evidence is incomplete. Retry hydration or sync before resolving this conflict.');

export const serverStateFromConflict = (
  conflict: QueuedStorageConflict,
): ServerConflictState => {
  const evidence = record(conflict.serverEvidence);
  if (!evidence) throw evidenceError();

  if (Object.hasOwn(evidence, 'current')) {
    if (evidence.current === null) {
      if (evidence.currentRevision !== undefined && !validRevision(evidence.currentRevision)) {
        throw evidenceError();
      }
      return {
        revision: validRevision(evidence.currentRevision) ? evidence.currentRevision : 0,
        value: null,
        tombstone: true,
      };
    }

    const current = record(evidence.current);
    if (!current || !validRevision(current.revision) || typeof current.tombstone !== 'boolean') {
      throw evidenceError();
    }
    if (
      current.resourceType !== conflict.kind
      || current.resourceKey !== conflict.key
    ) {
      throw new Error('Server conflict evidence belongs to a different resource. The conflict was not changed.');
    }
    if (current.tombstone) {
      if (current.value !== null) throw evidenceError();
      return { revision: current.revision, value: null, tombstone: true };
    }
    if (typeof current.value !== 'string') throw evidenceError();
    return { revision: current.revision, value: current.value, tombstone: false };
  }

  throw evidenceError();
};

const validatedConflict = (
  adapter: ConflictResolutionAdapter,
  identity: StorageIdentity,
  reference: ConflictReference,
): QueuedStorageConflict => {
  const conflict = adapter.readConflict(identity, reference.id);
  if (!conflict) throw new Error('This conflict no longer exists for the active Lantern account.');
  if (
    !sameIdentity(conflict.identity, identity)
    || conflict.kind !== reference.kind
    || conflict.key !== reference.key
    || adapter.kindForKey(conflict.key) !== conflict.kind
  ) {
    throw new Error('Conflict identity or resource validation failed. No local state was changed.');
  }
  return conflict;
};

const successorsFor = (
  adapter: ConflictResolutionAdapter,
  identity: StorageIdentity,
  conflict: QueuedStorageConflict,
  serverRevision: number,
): QueuedStorageMutation[] => {
  const successors = adapter.descendants(adapter.readMutations(identity), conflict)
    .filter(mutation =>
      (
      mutation.baseRevision === conflict.baseRevision
      || mutation.baseRevision === serverRevision
      ));
  if (successors.some(mutation => !sameIdentity(mutation.identity, conflict.identity))) {
    throw new Error('A queued successor belongs to a different identity. The conflict was not changed.');
  }
  return successors;
};

const overlaysFor = (
  adapter: ConflictResolutionAdapter,
  identity: StorageIdentity,
  conflict: QueuedStorageConflict,
): QueuedStorageMutation[] => {
  const overlays = adapter.readMutations(identity)
    .filter(mutation =>
      mutation.id !== conflict.id
      && mutation.kind === conflict.kind
      && mutation.key === conflict.key);
  if (overlays.some(mutation => !sameIdentity(mutation.identity, conflict.identity))) {
    throw new Error('A queued local overlay belongs to a different identity. The conflict was not changed.');
  }
  return overlays;
};

const sameMutation = (
  left: QueuedStorageMutation,
  right: QueuedStorageMutation,
): boolean => left.id === right.id
  && left.enqueuedAt === right.enqueuedAt
  && left.value === right.value;

const convergeSuccessorOverlay = (
  adapter: ConflictResolutionAdapter,
  identity: StorageIdentity,
  conflict: QueuedStorageConflict,
  maxAttempts = 8,
): QueuedStorageMutation[] => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const successors = overlaysFor(adapter, identity, conflict);
    const latest = successors.at(-1);
    if (!latest) return [];

    if (adapter.readCache(identity, conflict.key) !== latest.value) {
      adapter.writeCache(identity, conflict.key, latest.value);
    }
    const verifiedSuccessors = overlaysFor(adapter, identity, conflict);
    const verifiedLatest = verifiedSuccessors.at(-1);
    const verifiedCache = adapter.readCache(identity, conflict.key);
    if (
      verifiedLatest
      && sameMutation(verifiedLatest, latest)
      && verifiedCache === verifiedLatest.value
    ) {
      return verifiedSuccessors;
    }
  }
  throw new Error('Local changes kept arriving while resolving this conflict. Try again after edits settle; the conflict remains safely blocked.');
};

const assertExactDuplicate = (
  existing: QueuedStorageMutation,
  conflict: QueuedStorageConflict,
): void => {
  if (
    !sameIdentity(existing.identity, conflict.identity)
    || existing.kind !== conflict.kind
    || existing.key !== conflict.key
    || existing.value !== conflict.value
    || existing.enqueuedAt !== conflict.enqueuedAt
    || existing.clientId !== conflict.clientId
    || existing.predecessorId !== conflict.predecessorId
  ) {
    throw new Error('A queued mutation ID does not match this conflict. No conflict was cleared.');
  }
};

export const acceptServerConflict = (
  adapter: ConflictResolutionAdapter,
  identity: StorageIdentity,
  reference: ConflictReference,
): ConflictResolutionResult => {
  const conflict = validatedConflict(adapter, identity, reference);
  const rawServer = serverStateFromConflict(conflict);
  const server = {
    ...rawServer,
    value: rawServer.value === null
      ? null
      : adapter.decodeServerValue(conflict.key, rawServer.value),
  };
  const existingRetry = adapter.readMutations(identity)
    .find(mutation => mutation.id === conflict.id);
  if (existingRetry) assertExactDuplicate(existingRetry, conflict);
  const initialSuccessors = overlaysFor(adapter, identity, conflict);

  if (initialSuccessors.length === 0) {
    adapter.writeCache(identity, conflict.key, server.value);
  }
  convergeSuccessorOverlay(adapter, identity, conflict);
  adapter.replaceRevision(identity, conflict.key, server.revision);
  adapter.rebaseSuccessors(identity, conflict, server.revision);
  if (existingRetry) adapter.acknowledge(identity, existingRetry.id);
  convergeSuccessorOverlay(
    adapter,
    identity,
    conflict,
  );
  const successors = successorsFor(adapter, identity, conflict, server.revision);
  adapter.clearConflict(identity, conflict.id);
  return {
    conflictId: conflict.id,
    key: conflict.key,
    server,
    successorCount: successors.length,
  };
};

export const retryLocalConflict = (
  adapter: ConflictResolutionAdapter,
  identity: StorageIdentity,
  reference: ConflictReference,
  confirmed: boolean,
): ConflictResolutionResult => {
  if (!confirmed) {
    throw new Error('Retrying the local value requires explicit confirmation.');
  }
  const conflict = validatedConflict(adapter, identity, reference);
  const rawServer = serverStateFromConflict(conflict);
  const server = {
    ...rawServer,
    value: rawServer.value === null
      ? null
      : adapter.decodeServerValue(conflict.key, rawServer.value),
  };
  const retry: QueuedStorageMutation = {
    id: conflict.id,
    kind: conflict.kind,
    key: conflict.key,
    value: conflict.value,
    identity: { ...conflict.identity },
    baseRevision: server.revision,
    clientId: conflict.clientId,
    predecessorId: conflict.predecessorId,
    enqueuedAt: conflict.enqueuedAt,
    attempts: 0,
  };
  const existing = adapter.readMutations(identity).find(mutation => mutation.id === retry.id);
  if (existing) assertExactDuplicate(existing, conflict);
  const successors = successorsFor(adapter, identity, conflict, server.revision);
  adapter.replaceMutation(retry);

  adapter.replaceRevision(identity, conflict.key, server.revision);
  adapter.rebaseSuccessors(identity, conflict, server.revision);
  adapter.clearConflict(identity, conflict.id);
  return {
    conflictId: conflict.id,
    key: conflict.key,
    server,
    successorCount: successors.length,
  };
};
