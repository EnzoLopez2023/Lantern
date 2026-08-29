import assert from 'node:assert/strict';
import test from 'node:test';
import { DocumentWriterIdentity } from '../../src/app/storage/writerIdentity.ts';
import {
  enqueueMutation,
  replayMutationQueue,
} from '../../src/app/storage/mutationQueue.ts';

class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  key(index) { return [...this.values.keys()][index] ?? null; }
  removeItem(key) { this.values.delete(key); }
}

test('duplicated tabs receive distinct writers and concurrent same-base writes conflict', async () => {
  const clonedSessionStorage = new Map([['lantern:v1:sync-client-id', 'cloned-id']]);
  let sequence = 0;
  const factory = () => `document-${++sequence}`;
  const first = new DocumentWriterIdentity(factory);
  const duplicate = new DocumentWriterIdentity(factory);

  assert.equal(clonedSessionStorage.get('lantern:v1:sync-client-id'), 'cloned-id');
  assert.notEqual(first.id, duplicate.id);

  const storage = new MemoryStorage();
  const identity = { tenant: 'tenant', oid: 'user' };
  for (const [index, writer] of [first, duplicate].entries()) {
    enqueueMutation(storage, {
      id: `mutation-${index}`,
      kind: 'bookmarks',
      key: 'exam-prep-bookmarks:SAT',
      value: `value-${index}`,
      identity,
      baseRevision: 0,
      clientId: writer.id,
      predecessorId: null,
      enqueuedAt: index,
      attempts: 0,
    });
  }
  let revision = 0;
  const result = await replayMutationQueue(
    storage,
    identity,
    async mutation => {
      if (mutation.baseRevision !== revision) {
        const error = new Error('conflict');
        error.status = 409;
        throw error;
      }
      revision += 1;
      return { revision };
    },
    () => false,
    error => error?.status === 409,
  );
  assert.equal(result.conflictCount, 1);
});
