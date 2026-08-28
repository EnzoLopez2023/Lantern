import assert from 'node:assert/strict';
import test from 'node:test';
import {
  enqueueMutation,
  deadLetterStorageKey,
  findLatestCausalPredecessor,
  mutationQueueStorageKey,
  readConflicts,
  readDeadLetters,
  readMutationQueue,
  replayMutationQueue,
} from '../../src/app/storage/mutationQueue.ts';

class MemoryStorage {
  #values = new Map();

  get length() {
    return this.#values.size;
  }

  getItem(key) {
    return this.#values.get(key) ?? null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  key(index) {
    return [...this.#values.keys()][index] ?? null;
  }

  removeItem(key) {
    this.#values.delete(key);
  }
}

const identity = { tenant: 'tenant-a', oid: 'user-a' };
const mutation = (id, key) => ({
  id,
  kind: 'progress',
  key,
  value: `value-${id}`,
  identity,
  baseRevision: 0,
  clientId: 'client-a',
  predecessorId: null,
  enqueuedAt: 1,
  attempts: 0,
});

test('serializes mutations in a tenant and OID scoped queue', () => {
  const storage = new MemoryStorage();
  enqueueMutation(storage, mutation('mutation-1', 'exam-prep-quiz:SAT'));

  assert.match(mutationQueueStorageKey(identity), /^lantern:v1:tenant-a:user-a:/);
  assert.deepEqual(readMutationQueue(storage, identity), [
    mutation('mutation-1', 'exam-prep-quiz:SAT'),
  ]);
  assert.deepEqual(readMutationQueue(storage, { tenant: 'tenant-a', oid: 'user-b' }), []);
});

test('two-tab interleaving cannot lose entries and stable IDs are idempotent', async () => {
  const sharedStorage = new MemoryStorage();
  const tabA = { ...mutation('mutation-a', 'a'), clientId: 'tab-a', enqueuedAt: 20 };
  const tabB = { ...mutation('mutation-b', 'b'), clientId: 'tab-b', enqueuedAt: 10 };

  enqueueMutation(sharedStorage, tabA);
  enqueueMutation(sharedStorage, tabB);
  enqueueMutation(sharedStorage, tabA);

  assert.deepEqual(readMutationQueue(sharedStorage, identity).map(item => item.id), [
    'mutation-b',
    'mutation-a',
  ]);
  const delivered = [];
  await replayMutationQueue(sharedStorage, identity, async item => delivered.push(item.id));
  assert.deepEqual(delivered, ['mutation-b', 'mutation-a']);
});

test('same-tab writes chain while independent same-base tabs conflict', async () => {
  const storage = new MemoryStorage();
  const first = {
    ...mutation('tab-a-first', 'exam-prep-bookmarks:SAT'),
    clientId: 'tab-a',
    enqueuedAt: 1,
  };
  const sameTab = {
    ...mutation('tab-a-second', 'exam-prep-bookmarks:SAT'),
    clientId: 'tab-a',
    predecessorId: first.id,
    enqueuedAt: 2,
  };
  const otherTab = {
    ...mutation('tab-b-concurrent', 'exam-prep-bookmarks:SAT'),
    clientId: 'tab-b',
    enqueuedAt: 3,
  };
  assert.equal(
    findLatestCausalPredecessor([first], 'tab-a', first.kind, first.key)?.id,
    first.id,
  );
  assert.equal(
    findLatestCausalPredecessor([first], 'tab-b', first.kind, first.key),
    null,
  );
  [first, sameTab, otherTab].forEach(item => enqueueMutation(storage, item));
  let remoteRevision = 0;
  const delivered = [];

  const result = await replayMutationQueue(
    storage,
    identity,
    async item => {
      delivered.push([item.id, item.baseRevision]);
      if (item.baseRevision !== remoteRevision) {
        const error = new Error('revision conflict');
        error.status = 409;
        error.details = { currentRevision: remoteRevision };
        throw error;
      }
      remoteRevision += 1;
      return { revision: remoteRevision };
    },
    () => false,
    error => error?.status === 409,
    error => error?.details,
  );

  assert.deepEqual(delivered, [
    ['tab-a-first', 0],
    ['tab-a-second', 1],
    ['tab-b-concurrent', 0],
  ]);
  assert.equal(result.conflictCount, 1);
  assert.equal(remoteRevision, 2);
});

test('migrates legacy shared-array queues without dropping mutations', () => {
  const storage = new MemoryStorage();
  const legacyA = mutation('legacy-a', 'a');
  const legacyB = mutation('legacy-b', 'b');
  delete legacyA.baseRevision;
  delete legacyA.clientId;
  delete legacyA.predecessorId;
  delete legacyB.baseRevision;
  delete legacyB.clientId;
  delete legacyB.predecessorId;
  storage.setItem(mutationQueueStorageKey(identity), JSON.stringify([
    legacyA,
    legacyB,
  ]));
  assert.deepEqual(readMutationQueue(storage, identity).map(item => item.id), ['legacy-a', 'legacy-b']);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => item.baseRevision), [0, 0]);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => [
    item.clientId,
    item.predecessorId,
  ]), [[null, null], [null, null]]);
  assert.equal(storage.getItem(mutationQueueStorageKey(identity)), null);
});

test('rapid same-resource writes are causally rebased while unrelated revisions stay unchanged', async () => {
  const storage = new MemoryStorage();
  const rapidA = { ...mutation('rapid-a', 'shared'), value: 'A', enqueuedAt: 1 };
  const rapidB = {
    ...mutation('rapid-b', 'shared'),
    value: 'B',
    predecessorId: 'rapid-a',
    enqueuedAt: 2,
  };
  const unrelated = { ...mutation('unrelated', 'other'), value: 'independent', enqueuedAt: 2.5 };
  const rapidC = {
    ...mutation('rapid-c', 'shared'),
    value: 'C',
    predecessorId: 'rapid-b',
    enqueuedAt: 3,
  };
  [rapidA, rapidB, unrelated, rapidC].forEach(item => enqueueMutation(storage, item));

  const remote = new Map();
  const delivered = [];
  const result = await replayMutationQueue(
    storage,
    identity,
    async item => {
      delivered.push([item.id, item.baseRevision]);
      const current = remote.get(item.key) ?? { revision: 0, value: null };
      if (item.baseRevision !== current.revision) {
        const error = new Error('revision conflict');
        error.status = 409;
        error.details = { currentRevision: current.revision, currentValue: current.value };
        throw error;
      }
      const revision = current.revision + 1;
      remote.set(item.key, { revision, value: item.value });
      return { revision };
    },
  );

  assert.deepEqual(delivered, [
    ['rapid-a', 0],
    ['rapid-b', 1],
    ['unrelated', 0],
    ['rapid-c', 2],
  ]);
  assert.deepEqual(remote.get('shared'), { revision: 3, value: 'C' });
  assert.deepEqual(remote.get('other'), { revision: 1, value: 'independent' });
  assert.equal(result.conflictCount, 0);
  assert.equal(result.pending, 0);
});

test('a same-resource mutation enqueued during delivery inherits the acknowledged revision', async () => {
  const storage = new MemoryStorage();
  enqueueMutation(storage, { ...mutation('in-flight-a', 'shared'), value: 'A', enqueuedAt: 1 });
  const delivered = [];

  const result = await replayMutationQueue(storage, identity, async item => {
    delivered.push([item.id, item.baseRevision]);
    if (item.id === 'in-flight-a') {
      enqueueMutation(storage, {
        ...mutation('in-flight-b', 'shared'),
        value: 'B',
        predecessorId: 'in-flight-a',
        enqueuedAt: 2,
      });
      await Promise.resolve();
      return { revision: 1 };
    }
    return { revision: 2 };
  });

  assert.deepEqual(delivered, [
    ['in-flight-a', 0],
    ['in-flight-b', 1],
  ]);
  assert.equal(result.pending, 0);
});

test('a true cross-device conflict is not rebased and blocks only its resource', async () => {
  const storage = new MemoryStorage();
  const stale = { ...mutation('stale', 'shared'), value: 'stale-client', enqueuedAt: 1 };
  const sameKeyLater = {
    ...mutation('same-later', 'shared'),
    value: 'later-local',
    predecessorId: 'stale',
    enqueuedAt: 2,
  };
  const unrelated = { ...mutation('unrelated', 'other'), value: 'independent', enqueuedAt: 3 };
  [stale, sameKeyLater, unrelated].forEach(item => enqueueMutation(storage, item));

  const remote = new Map([['shared', { revision: 1, value: 'other-device' }]]);
  const delivered = [];
  const result = await replayMutationQueue(
    storage,
    identity,
    async item => {
      delivered.push([item.id, item.baseRevision]);
      const current = remote.get(item.key) ?? { revision: 0, value: null };
      if (item.baseRevision !== current.revision) {
        const error = new Error('revision conflict');
        error.status = 409;
        error.details = { currentRevision: current.revision, currentValue: current.value };
        throw error;
      }
      const revision = current.revision + 1;
      remote.set(item.key, { revision, value: item.value });
      return { revision };
    },
    () => false,
    error => error?.status === 409,
    error => error?.details,
  );

  assert.deepEqual(delivered, [
    ['stale', 0],
    ['unrelated', 0],
  ]);
  assert.deepEqual(remote.get('shared'), { revision: 1, value: 'other-device' });
  assert.deepEqual(remote.get('other'), { revision: 1, value: 'independent' });
  assert.equal(result.conflictCount, 1);
  assert.equal(result.pending, 1);
  assert.equal(readConflicts(storage, identity)[0].serverEvidence.currentRevision, 1);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => [
    item.id,
    item.baseRevision,
  ]), [['same-later', 0]]);
});

test('migrates legacy dead letters into independent durable entries', () => {
  const storage = new MemoryStorage();
  storage.setItem(deadLetterStorageKey(identity), JSON.stringify([
    { ...mutation('rejected-a', 'a'), lastError: 'invalid' },
    { ...mutation('rejected-b', 'b'), lastError: 'too large' },
  ]));

  assert.deepEqual(readDeadLetters(storage, identity).map(item => item.id), [
    'rejected-a',
    'rejected-b',
  ]);
  assert.equal(storage.getItem(deadLetterStorageKey(identity)), null);
});

test('replays sequentially, acknowledges successes, and preserves failures', async () => {
  const storage = new MemoryStorage();
  enqueueMutation(storage, mutation('mutation-1', 'first'));
  enqueueMutation(storage, mutation('mutation-2', 'second'));
  const delivered = [];

  const failed = await replayMutationQueue(storage, identity, async item => {
    delivered.push(item.id);
    if (item.id === 'mutation-2') throw new Error('offline');
  });

  assert.deepEqual(delivered, ['mutation-1', 'mutation-2']);
  assert.equal(failed.pending, 1);
  assert.equal(readMutationQueue(storage, identity)[0].attempts, 1);
  assert.equal(readMutationQueue(storage, identity)[0].lastError, 'offline');

  const recovered = await replayMutationQueue(storage, identity, async item => {
    delivered.push(item.id);
  });
  assert.equal(recovered.pending, 0);
  assert.deepEqual(delivered, ['mutation-1', 'mutation-2', 'mutation-2']);
  assert.deepEqual(readMutationQueue(storage, identity), []);
});

test('dead-letters permanent poison and continues later FIFO entries', async () => {
  const storage = new MemoryStorage();
  enqueueMutation(storage, mutation('mutation-poison', 'oversized'));
  enqueueMutation(storage, mutation('mutation-good', 'later'));
  const delivered = [];

  const result = await replayMutationQueue(
    storage,
    identity,
    async item => {
      if (item.id === 'mutation-poison') {
        const error = new Error('payload too large');
        error.status = 413;
        throw error;
      }
      delivered.push(item.id);
    },
    error => error?.status === 400 || error?.status === 413 || error?.status === 422,
  );

  assert.deepEqual(delivered, ['mutation-good']);
  assert.equal(result.pending, 0);
  assert.equal(result.deadLettered, 1);
  assert.equal(readDeadLetters(storage, identity)[0].id, 'mutation-poison');
});
