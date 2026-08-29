import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  enqueueMutation,
  readConflicts,
  replayMutationQueue,
} from '../../src/app/storage/mutationQueue.ts';
import {
  resolveObservedWrite,
  storageObservationMatches,
} from '../../src/app/storage/storageObservation.ts';

class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  key(index) { return [...this.values.keys()][index] ?? null; }
  removeItem(key) { this.values.delete(key); }
}

test('two stale stat maps preserve latest cache and surface independent intent as conflict', async () => {
  const storage = new MemoryStorage();
  const identity = { tenant: 'tenant', oid: 'user' };
  const key = 'exam-prep-drill-stats:PHYS';
  const observed = { value: '{"q1":{"correct":1}}', revision: 0 };
  let cache = observed.value;
  const firstValue = '{"q1":{"correct":2}}';
  const staleValue = '{"q1":{"correct":1},"q2":{"correct":1}}';

  assert.equal(storageObservationMatches({ value: cache, revision: 0 }, observed), true);
  enqueueMutation(storage, {
    id: 'tab-a', kind: 'progress', key, value: firstValue, identity,
    baseRevision: 0, clientId: 'writer-a', predecessorId: null, enqueuedAt: 1, attempts: 0,
  });

  cache = firstValue;
  assert.equal(storageObservationMatches({ value: cache, revision: 0 }, observed), false);
  enqueueMutation(storage, {
    id: 'tab-b', kind: 'progress', key, value: staleValue, identity,
    baseRevision: 0, clientId: 'writer-b', predecessorId: null, enqueuedAt: 2, attempts: 0,
  });

  let serverRevision = 0;
  const result = await replayMutationQueue(
    storage,
    identity,
    async mutation => {
      if (mutation.baseRevision !== serverRevision) {
        const error = new Error('conflict');
        error.status = 409;
        throw error;
      }
      serverRevision += 1;
      return { revision: serverRevision };
    },
    () => false,
    error => error?.status === 409,
  );

  assert.equal(cache, firstValue);
  assert.equal(result.conflictCount, 1);
  assert.equal(readConflicts(storage, identity)[0].value, staleValue);
});

for (const [label, key] of [
  ['drill', 'exam-prep-drill-stats:PHYS'],
  ['flashcard', 'exam-prep-flashcard-stats:PHYS'],
]) {
  test(`${label} stats adopt an acknowledged matching cache revision`, async () => {
    const storage = new MemoryStorage();
    const identity = { tenant: 'tenant', oid: 'user' };
    let observed = { value: '{}', revision: 0 };
    let cache = { ...observed };
    let server = { value: '{}', revision: 0 };
    const answer1 = '{"item-1":{"reviews":1}}';
    const answer2 = '{"item-1":{"reviews":1},"item-2":{"reviews":1}}';

    const first = resolveObservedWrite(cache, observed);
    assert.deepEqual(first, { canWriteCache: true, baseRevision: 0 });
    enqueueMutation(storage, {
      id: `${label}-1`, kind: 'progress', key, value: answer1, identity,
      baseRevision: first.baseRevision, clientId: 'writer', predecessorId: null,
      enqueuedAt: 1, attempts: 0,
    });
    cache = { value: answer1, revision: 0 };
    observed = { ...cache };
    await replayMutationQueue(storage, identity, async mutation => {
      assert.equal(mutation.baseRevision, server.revision);
      server = { value: mutation.value, revision: server.revision + 1 };
      return { revision: server.revision };
    });
    cache.revision = server.revision;

    const second = resolveObservedWrite(cache, observed);
    assert.deepEqual(second, { canWriteCache: true, baseRevision: 1 });
    enqueueMutation(storage, {
      id: `${label}-2`, kind: 'progress', key, value: answer2, identity,
      baseRevision: second.baseRevision, clientId: 'writer', predecessorId: null,
      enqueuedAt: 2, attempts: 0,
    });
    cache = { value: answer2, revision: second.baseRevision };
    observed = { ...cache };
    const result = await replayMutationQueue(storage, identity, async mutation => {
      assert.equal(mutation.baseRevision, server.revision);
      server = { value: mutation.value, revision: server.revision + 1 };
      return { revision: server.revision };
    });

    assert.equal(result.conflictCount, 0);
    assert.equal(cache.value, answer2);
    assert.equal(server.value, answer2);
    assert.equal(server.revision, 2);
    assert.deepEqual(observed, { value: answer2, revision: 1 });
  });
}

test('divergent cache values retain the original stale base', () => {
  assert.deepEqual(resolveObservedWrite(
    { value: '{"newer":true}', revision: 4 },
    { value: '{"older":true}', revision: 2 },
  ), {
    canWriteCache: false,
    baseRevision: 2,
  });
});

test('drill and flashcard stores use observed compare-and-enqueue writes', async () => {
  for (const path of [
    'src/ExamPrepHub/shared/drillStats.ts',
    'src/ExamPrepHub/shared/flashcardStats.ts',
  ]) {
    const source = await readFile(path, 'utf8');
    assert.match(source, /observeItem\(key\)/, path);
    assert.match(source, /setItemIfObserved\(key, value, observed\)/, path);
    assert.match(source, /bindObservation\(stats, result\.observation\)/, path);
  }
});
