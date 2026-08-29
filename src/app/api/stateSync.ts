import { requestJson, type TokenProvider } from './http';
import type { StorageMutation } from '../storage/scopedStorage';
import type { StorageIdentity, SyncKind } from '../storage/keys';
import {
  collectStatePages,
  type StateCursor,
  type StatePage,
} from './pagination';
import { statePageQuery } from './statePageQuery';
import { resolveNextStateCursor } from './stateCursor';
import { serializeStateMutationRequest } from '../storage/payloadBounds';

export interface StateRecord {
  resourceType: SyncKind;
  resourceKey: string;
  revision: number;
  value: string | null;
  tombstone: boolean;
  mutationId: string;
  updatedAt: string;
}

export interface StateSyncPayload {
  key: string;
  value: string;
  expectedRevision?: number;
}

export interface StateSurface {
  list(): Promise<StateRecord[]>;
  put(payload: StateSyncPayload): Promise<StateRecord>;
  remove(identity: StorageIdentity, key: string): Promise<StateRecord>;
}

export interface StateSyncClient {
  listAll(force?: boolean): Promise<StateRecord[]>;
  list(kind: SyncKind): Promise<StateRecord[]>;
  put(kind: SyncKind, payload: StateSyncPayload): Promise<StateRecord>;
  remove(kind: SyncKind, identity: StorageIdentity, key: string): Promise<StateRecord>;
  pushMutation(mutation: StorageMutation): Promise<StateRecord>;
  notes: StateSurface;
  bookmarks: StateSurface;
  progress: StateSurface;
  streak: StateSurface;
  resume: StateSurface;
}

const mutationId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `lantern-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createStateSyncClient = (tokenProvider: TokenProvider): StateSyncClient => {
  let listedRecords: StateRecord[] | null = null;
  let listing: Promise<StateRecord[]> | null = null;

  const listAll = (force = false): Promise<StateRecord[]> => {
    if (force) listedRecords = null;
    if (listedRecords) return Promise.resolve(listedRecords);
    if (listing) return listing;
    listing = collectStatePages<StateRecord>(async (cursor: StateCursor | null, limit) => {
      const response = await requestJson<StatePage<StateRecord> & {
        cursor?: StateCursor | null;
      }>(`/api/user-state?${statePageQuery(cursor, limit)}`, {}, tokenProvider);
      return {
        resources: response.resources,
        nextCursor: resolveNextStateCursor(response),
      };
    }).then(records => {
      listedRecords = records;
      return records;
    }).finally(() => {
      listing = null;
    });
    return listing;
  };
  const list = async (kind: SyncKind): Promise<StateRecord[]> =>
    (await listAll()).filter(record => record.resourceType === kind);

  const mutate = async (
    kind: SyncKind,
    key: string,
    value: string | null,
    deleting: boolean,
    expectedRevision: number,
    stableMutationId = mutationId(),
  ): Promise<StateRecord> => {
    const path = `/api/user-state/${kind}/${encodeURIComponent(key)}`;
    const options = {
      method: deleting ? 'DELETE' : 'PUT',
      body: serializeStateMutationRequest(
        stableMutationId,
        expectedRevision,
        key,
        value,
        deleting,
      ),
    };
    const result = await requestJson<StateRecord>(path, options, tokenProvider);
    listedRecords = null;
    return result;
  };

  const put = (kind: SyncKind, payload: StateSyncPayload) =>
    mutate(kind, payload.key, payload.value, false, payload.expectedRevision ?? 0);
  const remove = (kind: SyncKind, _identity: StorageIdentity, key: string) =>
    mutate(kind, key, null, true, 0);
  const surface = (kind: SyncKind): StateSurface => ({
    list: () => list(kind),
    put: payload => put(kind, payload),
    remove: (identity, key) => remove(kind, identity, key),
  });

  return {
    listAll,
    list,
    put,
    remove,
    pushMutation: async mutation => {
      if (mutation.value === null) {
        return mutate(
          mutation.kind,
          mutation.key,
          null,
          true,
          mutation.baseRevision,
          mutation.id,
        );
      }
      return mutate(
        mutation.kind,
        mutation.key,
        mutation.value,
        false,
        mutation.baseRevision,
        mutation.id,
      );
    },
    notes: surface('notes'),
    bookmarks: surface('bookmarks'),
    progress: surface('progress'),
    streak: surface('streak'),
    resume: surface('resume'),
  };
};
