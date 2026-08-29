import assert from 'node:assert/strict';
import test from 'node:test';
import {
  acceptServerConflict,
  retryLocalConflict,
} from '../../src/app/storage/conflictResolution.ts';
import { scopedKey, syncKindForKey } from '../../src/app/storage/keys.ts';
import {
  acknowledgeMutation,
  clearConflict,
  enqueueMutation,
  findCausalDescendants,
  readConflict,
  readConflicts,
  readMutationQueue,
  rebaseQueuedSuccessors,
  replaceMutation,
  replayMutationQueue,
} from '../../src/app/storage/mutationQueue.ts';
import {
  getCacheRevision,
  replaceCacheRevision,
} from '../../src/app/storage/revisionMetadata.ts';
import {
  decodeStateTransportValue,
  serializeStateMutationRequest,
} from '../../src/app/storage/payloadBounds.ts';

class MemoryStorage {
  values = new Map();
  failNextConflictRemoval = false;

  get length() {
    return this.values.size;
  }

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  key(index) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key) {
    if (this.failNextConflictRemoval && key.includes('__lantern-sync-conflict__:')) {
      this.failNextConflictRemoval = false;
      throw new Error('simulated crash before conflict clear');
    }
    this.values.delete(key);
  }
}

const identity = { tenant: 'tenant-a', oid: 'user-a' };
const otherIdentity = { tenant: 'tenant-a', oid: 'user-b' };
const key = 'exam-prep-quiz:SAT';

const mutation = (id, resourceKey = key, enqueuedAt = 1, value = `local-${id}`) => ({
  id,
  kind: 'progress',
  key: resourceKey,
  value,
  identity,
  baseRevision: 0,
  clientId: 'client-a',
  predecessorId: null,
  enqueuedAt,
  attempts: 0,
});

const evidence = (
  resourceKey,
  revision,
  value,
  tombstone = false,
) => ({
  error: 'User state revision conflict',
  current: {
    resourceType: 'progress',
    resourceKey,
    revision,
    value,
    tombstone,
    mutationId: 'remote-mutation',
    updatedAt: '2026-08-28 12:00:00',
  },
});

const reference = (id, resourceKey = key) => ({
  id,
  kind: 'progress',
  key: resourceKey,
});

const linkSuccessors = (predecessor, successors) => {
  let predecessorId = predecessor.id;
  for (const successor of successors) {
    successor.clientId = predecessor.clientId;
    successor.predecessorId = predecessorId;
    predecessorId = successor.id;
  }
};

const resolutionAdapter = storage => ({
  readConflict: (target, id) => readConflict(storage, target, id),
  readMutations: target => readMutationQueue(storage, target),
  replaceMutation: item => replaceMutation(storage, item),
  acknowledge: (target, id) => acknowledgeMutation(storage, target, id),
  clearConflict: (target, id) => clearConflict(storage, target, id),
  descendants: findCausalDescendants,
  rebaseSuccessors: (target, predecessor, revision) =>
    rebaseQueuedSuccessors(storage, target, predecessor, revision),
  readCache: (target, resourceKey) => storage.getItem(scopedKey(target, resourceKey)),
  writeCache: (target, resourceKey, value) => {
    const cacheKey = scopedKey(target, resourceKey);
    if (value === null) storage.removeItem(cacheKey);
    else storage.setItem(cacheKey, value);
  },
  replaceRevision: (target, resourceKey, revision) =>
    replaceCacheRevision(storage, target, resourceKey, revision),
  decodeServerValue: decodeStateTransportValue,
  kindForKey: syncKindForKey,
});

const crashingAdapter = (storage, crashAfter, operations) => {
  const adapter = resolutionAdapter(storage);
  for (const operation of [
    'writeCache',
    'replaceRevision',
    'rebaseSuccessors',
    'acknowledge',
    'replaceMutation',
    'clearConflict',
  ]) {
    const perform = adapter[operation];
    adapter[operation] = (...args) => {
      const result = perform(...args);
      operations.push({ operation, args });
      if (operation === crashAfter) throw new Error(`crash after ${operation}`);
      return result;
    };
  }
  return adapter;
};

const createConflict = async (
  storage,
  conflicted,
  serverEvidence,
  successors = [],
) => {
  enqueueMutation(storage, conflicted);
  linkSuccessors(conflicted, successors);
  successors.forEach(item => enqueueMutation(storage, item));
  await replayMutationQueue(
    storage,
    identity,
    async item => {
      if (item.id !== conflicted.id) throw new Error('blocked successor was delivered');
      const error = new Error('revision conflict');
      error.status = 409;
      error.details = serverEvidence;
      throw error;
    },
    () => false,
    error => error?.status === 409,
    error => error?.details,
  );
};

test('accept server is identity isolated and applies server values and exact revisions', async () => {
  const storage = new MemoryStorage();
  const conflict = mutation('value-conflict');
  await createConflict(storage, conflict, evidence(key, 5, 'server-value'));
  storage.setItem(scopedKey(identity, key), conflict.value);

  assert.throws(
    () => acceptServerConflict(
      resolutionAdapter(storage),
      otherIdentity,
      reference(conflict.id),
    ),
    /no longer exists.*active Lantern account/i,
  );
  assert.equal(readConflicts(storage, identity).length, 1);

  const result = acceptServerConflict(
    resolutionAdapter(storage),
    identity,
    reference(conflict.id),
  );
  assert.equal(result.server.revision, 5);
  assert.equal(storage.getItem(scopedKey(identity, key)), 'server-value');
  assert.equal(getCacheRevision(storage, identity, key), 5);
  assert.equal(readConflicts(storage, identity).length, 0);
});

test('accept server applies tombstones without affecting another conflict', async () => {
  const storage = new MemoryStorage();
  const removedKey = 'exam-prep-completed:SAT';
  const removed = mutation('removed-conflict', removedKey, 1, 'local-value');
  const unrelated = mutation('unrelated-conflict', key, 2);
  await createConflict(storage, removed, evidence(removedKey, 6, null, true));
  await createConflict(storage, unrelated, evidence(key, 4, 'other-server'));
  storage.setItem(scopedKey(identity, removedKey), 'local-value');

  acceptServerConflict(
    resolutionAdapter(storage),
    identity,
    reference(removed.id, removedKey),
  );

  assert.equal(storage.getItem(scopedKey(identity, removedKey)), null);
  assert.equal(getCacheRevision(storage, identity, removedKey), 6);
  assert.deepEqual(readConflicts(storage, identity).map(item => item.id), [
    unrelated.id,
  ]);
});

test('accept server rebases descendants and preserves the latest local successor overlay', async () => {
  const storage = new MemoryStorage();
  const conflicted = mutation('conflict-a', key, 1, 'local-A');
  const successor = mutation('successor-b', key, 2, 'full-local-B');
  await createConflict(storage, conflicted, evidence(key, 3, 'server-value'), [successor]);
  storage.setItem(scopedKey(identity, key), 'full-local-B');

  const result = acceptServerConflict(
    resolutionAdapter(storage),
    identity,
    reference(conflicted.id),
  );

  assert.equal(result.successorCount, 1);
  assert.equal(storage.getItem(scopedKey(identity, key)), 'full-local-B');
  assert.equal(getCacheRevision(storage, identity, key), 3);
  assert.equal(readMutationQueue(storage, identity)[0].baseRevision, 3);

  const delivered = [];
  await replayMutationQueue(storage, identity, async item => {
    delivered.push([item.id, item.baseRevision]);
    return { revision: 4 };
  });
  assert.deepEqual(delivered, [['successor-b', 3]]);
  assert.equal(readMutationQueue(storage, identity).length, 0);
});

test('accept server never rebases an independent-tab mutation', async () => {
  const storage = new MemoryStorage();
  const conflicted = mutation('causal-conflict', key, 1, 'local-A');
  const descendant = mutation('causal-descendant', key, 2, 'local-B');
  const concurrent = {
    ...mutation('independent-tab', key, 3, 'local-C'),
    clientId: 'client-b',
  };
  await createConflict(
    storage,
    conflicted,
    evidence(key, 5, 'server-value'),
    [descendant],
  );
  enqueueMutation(storage, concurrent);
  storage.setItem(scopedKey(identity, key), concurrent.value);

  acceptServerConflict(
    resolutionAdapter(storage),
    identity,
    reference(conflicted.id),
  );

  assert.deepEqual(readMutationQueue(storage, identity).map(item => [
    item.id,
    item.baseRevision,
  ]), [
    ['causal-descendant', 5],
    ['independent-tab', 0],
  ]);

  let remoteRevision = 5;
  const result = await replayMutationQueue(
    storage,
    identity,
    async item => {
      if (item.baseRevision !== remoteRevision) {
        const error = new Error('revision conflict');
        error.status = 409;
        error.details = evidence(key, remoteRevision, 'local-B');
        throw error;
      }
      remoteRevision += 1;
      return { revision: remoteRevision };
    },
    () => false,
    error => error?.status === 409,
    error => error?.details,
  );
  assert.equal(result.conflictCount, 1);
  assert.equal(readConflicts(storage, identity)[0].id, concurrent.id);
});

test('accept server never overwrites a concurrent successor added after enumeration', async () => {
  const storage = new MemoryStorage();
  const conflicted = mutation('interleave-a', key, 1, 'local-A');
  const successorB = mutation('interleave-b', key, 2, 'local-B');
  const successorC = mutation('interleave-c', key, 3, 'local-C');
  await createConflict(storage, conflicted, evidence(key, 5, 'server-value'), [successorB]);
  storage.setItem(scopedKey(identity, key), successorB.value);
  const adapter = resolutionAdapter(storage);
  const readMutations = adapter.readMutations;
  let reads = 0;
  adapter.readMutations = target => {
    reads += 1;
    const snapshot = readMutations(target);
    if (reads === 2) {
      linkSuccessors(successorB, [successorC]);
      enqueueMutation(storage, successorC);
      storage.setItem(scopedKey(identity, key), successorC.value);
    }
    return snapshot;
  };
  const cacheWrites = [];
  const writeCache = adapter.writeCache;
  adapter.writeCache = (...args) => {
    cacheWrites.push(args);
    return writeCache(...args);
  };

  acceptServerConflict(adapter, identity, reference(conflicted.id));

  assert.deepEqual(cacheWrites, []);
  assert.equal(storage.getItem(scopedKey(identity, key)), 'local-C');
  assert.equal(readConflicts(storage, identity).length, 0);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => [
    item.id,
    item.baseRevision,
  ]), [
    ['interleave-b', 5],
    ['interleave-c', 5],
  ]);

  const delivered = [];
  await replayMutationQueue(storage, identity, async item => {
    delivered.push([item.id, item.baseRevision]);
    return { revision: item.id === 'interleave-b' ? 6 : 7 };
  });
  assert.deepEqual(delivered, [
    ['interleave-b', 5],
    ['interleave-c', 6],
  ]);
  assert.equal(storage.getItem(scopedKey(identity, key)), 'local-C');
});

test('accept server converges on successors added during read, write, and verification', async t => {
  for (const phase of ['read', 'write', 'verify']) {
    await t.test(phase, async () => {
      const storage = new MemoryStorage();
      const conflicted = mutation('converge-a', key, 1, 'local-A');
      const successorB = mutation('converge-b', key, 2, 'local-B');
      const successorC = mutation('converge-c', key, 3, 'local-C');
      const successorD = mutation('converge-d', key, 4, 'local-D');
      await createConflict(
        storage,
        conflicted,
        evidence(key, 5, 'server-value'),
        [successorB, successorC],
      );
      storage.setItem(scopedKey(identity, key), successorB.value);
      const adapter = resolutionAdapter(storage);
      let insertedD = false;
      const insertD = () => {
        if (insertedD) return;
        insertedD = true;
        linkSuccessors(successorC, [successorD]);
        enqueueMutation(storage, successorD);
      };

      if (phase === 'read') {
        const readCache = adapter.readCache;
        adapter.readCache = (...args) => {
          const value = readCache(...args);
          insertD();
          return value;
        };
      } else if (phase === 'write') {
        const writeCache = adapter.writeCache;
        adapter.writeCache = (...args) => {
          const result = writeCache(...args);
          insertD();
          return result;
        };
      } else {
        const readMutations = adapter.readMutations;
        let reads = 0;
        adapter.readMutations = target => {
          reads += 1;
          const snapshot = readMutations(target);
          if (reads === 4) insertD();
          return snapshot;
        };
      }

      acceptServerConflict(adapter, identity, reference(conflicted.id));

      assert.equal(storage.getItem(scopedKey(identity, key)), 'local-D');
      assert.deepEqual(readMutationQueue(storage, identity).map(item => [
        item.id,
        item.baseRevision,
      ]), [
        ['converge-b', 5],
        ['converge-c', 5],
        ['converge-d', 5],
      ]);
      const delivered = [];
      await replayMutationQueue(storage, identity, async item => {
        delivered.push([item.id, item.baseRevision]);
        return { revision: item.baseRevision + 1 };
      });
      assert.deepEqual(delivered, [
        ['converge-b', 5],
        ['converge-c', 6],
        ['converge-d', 7],
      ]);
      assert.equal(storage.getItem(scopedKey(identity, key)), 'local-D');
    });
  }
});

test('accept server keeps conflicts blocked on cache failure or continuous churn', async t => {
  await t.test('cache failure', async () => {
    const storage = new MemoryStorage();
    const conflicted = mutation('failure-a', key, 1, 'local-A');
    const successor = mutation('failure-b', key, 2, 'local-B');
    await createConflict(storage, conflicted, evidence(key, 5, 'server-value'), [successor]);
    storage.setItem(scopedKey(identity, key), conflicted.value);
    const adapter = resolutionAdapter(storage);
    adapter.writeCache = () => {
      throw new Error('cache unavailable');
    };

    assert.throws(
      () => acceptServerConflict(adapter, identity, reference(conflicted.id)),
      /cache unavailable/,
    );
    assert.equal(readConflicts(storage, identity).length, 1);
  });

  await t.test('continuous churn', async () => {
    const storage = new MemoryStorage();
    const conflicted = mutation('churn-a', key, 1, 'local-A');
    const successor = mutation('churn-b', key, 2, 'local-B');
    await createConflict(storage, conflicted, evidence(key, 5, 'server-value'), [successor]);
    storage.setItem(scopedKey(identity, key), conflicted.value);
    const adapter = resolutionAdapter(storage);
    const writeCache = adapter.writeCache;
    let sequence = 3;
    let latest = successor;
    adapter.writeCache = (...args) => {
      const result = writeCache(...args);
      const next = mutation(`churn-${sequence}`, key, sequence, `local-${sequence}`);
      linkSuccessors(latest, [next]);
      enqueueMutation(
        storage,
        next,
      );
      latest = next;
      sequence += 1;
      return result;
    };

    assert.throws(
      () => acceptServerConflict(adapter, identity, reference(conflicted.id)),
      /changes kept arriving/i,
    );
    assert.equal(readConflicts(storage, identity).length, 1);
    assert.ok(readMutationQueue(storage, identity).length > 2);
  });
});

test('accept server rechecks successors around its only cache write', async t => {
  const scenarios = [
    {
      name: 'enqueue and cache before server write',
      install({ adapter, enqueueSuccessors }) {
        const readMutations = adapter.readMutations;
        let reads = 0;
        adapter.readMutations = target => {
          reads += 1;
          const snapshot = readMutations(target);
          if (reads === 2) enqueueSuccessors();
          return snapshot;
        };
      },
    },
    {
      name: 'enqueue and cache between server write and recheck',
      install({ adapter, enqueueSuccessors }) {
        const writeCache = adapter.writeCache;
        adapter.writeCache = (...args) => {
          const result = writeCache(...args);
          enqueueSuccessors();
          return result;
        };
      },
    },
    {
      name: 'writer begins after the recheck',
      install({ adapter, enqueueSuccessors }) {
        const readMutations = adapter.readMutations;
        let reads = 0;
        adapter.readMutations = target => {
          reads += 1;
          const snapshot = readMutations(target);
          if (reads === 3) enqueueSuccessors();
          return snapshot;
        };
      },
    },
  ];

  for (const scenario of scenarios) {
    await t.test(scenario.name, async () => {
      const storage = new MemoryStorage();
      const analyticsKey = 'exam-prep-analytics:SAT';
      const conflicted = mutation('window-a', analyticsKey, 1, 'conflicted-A');
      const successorB = mutation('window-b', analyticsKey, 2, 'bounded-B');
      const successorC = mutation('window-c', analyticsKey, 3, 'full-C-history');
      await createConflict(
        storage,
        conflicted,
        evidence(analyticsKey, 5, 'server-value'),
      );
      storage.setItem(scopedKey(identity, analyticsKey), conflicted.value);
      const adapter = resolutionAdapter(storage);
      let enqueued = false;
      const enqueueSuccessors = () => {
        if (enqueued) return;
        enqueued = true;
        linkSuccessors(conflicted, [successorB, successorC]);
        enqueueMutation(storage, successorB);
        enqueueMutation(storage, successorC);
        storage.setItem(scopedKey(identity, analyticsKey), 'full-C-history');
      };
      scenario.install({ adapter, enqueueSuccessors });

      acceptServerConflict(
        adapter,
        identity,
        reference(conflicted.id, analyticsKey),
      );

      assert.equal(storage.getItem(scopedKey(identity, analyticsKey)), 'full-C-history');
      assert.equal(readConflicts(storage, identity).length, 0);
      assert.deepEqual(readMutationQueue(storage, identity).map(item => [
        item.id,
        item.baseRevision,
      ]), [
        ['window-b', 5],
        ['window-c', 5],
      ]);

      const delivered = [];
      await replayMutationQueue(storage, identity, async item => {
        delivered.push([item.id, item.baseRevision]);
        return { revision: item.id === 'window-b' ? 6 : 7 };
      });
      assert.deepEqual(delivered, [
        ['window-b', 5],
        ['window-c', 6],
      ]);
      assert.equal(storage.getItem(scopedKey(identity, analyticsKey)), 'full-C-history');
    });
  }
});

test('concurrent oversized analytics remains exact locally and is bounded only for transport', async () => {
  const storage = new MemoryStorage();
  const analyticsKey = 'exam-prep-analytics:SAT';
  const conflicted = mutation('analytics-a', analyticsKey, 1, 'conflicted-A');
  const fullAnalytics = JSON.stringify(Array.from({ length: 30 }, (_, index) => ({
    id: `attempt-${index}`,
    detail: `${index}:`.repeat(1_500),
  })));
  assert.ok(new TextEncoder().encode(fullAnalytics).byteLength > 24_000);
  const successor = mutation('analytics-b', analyticsKey, 2, fullAnalytics);
  await createConflict(
    storage,
    conflicted,
    evidence(analyticsKey, 5, 'server-value'),
  );
  storage.setItem(scopedKey(identity, analyticsKey), conflicted.value);
  const adapter = resolutionAdapter(storage);
  const readMutations = adapter.readMutations;
  let reads = 0;
  adapter.readMutations = target => {
    reads += 1;
    const snapshot = readMutations(target);
    if (reads === 2) {
      linkSuccessors(conflicted, [successor]);
      enqueueMutation(storage, successor);
      storage.setItem(scopedKey(identity, analyticsKey), fullAnalytics);
    }
    return snapshot;
  };

  acceptServerConflict(
    adapter,
    identity,
    reference(conflicted.id, analyticsKey),
  );

  assert.equal(storage.getItem(scopedKey(identity, analyticsKey)), fullAnalytics);
  assert.equal(readMutationQueue(storage, identity)[0].value, fullAnalytics);
  let serverValue = null;
  let requestBody = null;
  await replayMutationQueue(storage, identity, async item => {
    requestBody = serializeStateMutationRequest(
      item.id,
      item.baseRevision,
      item.key,
      item.value,
      item.value === null,
    );
    serverValue = JSON.parse(requestBody).value;
    return { revision: 6 };
  });

  assert.notEqual(serverValue, fullAnalytics);
  assert.ok(new TextEncoder().encode(requestBody).byteLength <= 24_000);
  assert.equal(storage.getItem(scopedKey(identity, analyticsKey)), fullAnalytics);
  assert.equal(readMutationQueue(storage, identity).length, 0);
});

test('accept server recheck restores a newly queued tombstone', async () => {
  const storage = new MemoryStorage();
  const removedKey = 'exam-prep-completed:SAT';
  const conflicted = mutation('remove-a', removedKey, 1, 'conflicted-A');
  const successorB = mutation('remove-b', removedKey, 2, 'local-B');
  const successorC = mutation('remove-c', removedKey, 3, null);
  await createConflict(storage, conflicted, evidence(removedKey, 4, 'server-value'));
  storage.setItem(scopedKey(identity, removedKey), conflicted.value);
  const adapter = resolutionAdapter(storage);
  const readMutations = adapter.readMutations;
  let reads = 0;
  adapter.readMutations = target => {
    reads += 1;
    const snapshot = readMutations(target);
    if (reads === 2) {
      linkSuccessors(conflicted, [successorB, successorC]);
      enqueueMutation(storage, successorB);
      enqueueMutation(storage, successorC);
      storage.removeItem(scopedKey(identity, removedKey));
    }
    return snapshot;
  };

  acceptServerConflict(
    adapter,
    identity,
    reference(conflicted.id, removedKey),
  );

  assert.equal(storage.getItem(scopedKey(identity, removedKey)), null);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => [
    item.id,
    item.baseRevision,
    item.value,
  ]), [
    ['remove-b', 4, 'local-B'],
    ['remove-c', 4, null],
  ]);
  const delivered = [];
  await replayMutationQueue(storage, identity, async item => {
    delivered.push([item.id, item.baseRevision]);
    return { revision: item.id === 'remove-b' ? 5 : 6 };
  });
  assert.deepEqual(delivered, [
    ['remove-b', 4],
    ['remove-c', 5],
  ]);
  assert.equal(storage.getItem(scopedKey(identity, removedKey)), null);
});

test('accept server never writes the server value over successors and recovers after every step', async t => {
  for (const crashAfter of [
    'replaceRevision',
    'rebaseSuccessors',
    'acknowledge',
    'clearConflict',
  ]) {
    await t.test(crashAfter, async () => {
      const storage = new MemoryStorage();
      const conflicted = mutation('step-accept-a', key, 1, 'conflicted-A');
      const successor = mutation('step-accept-b', key, 2, 'latest-B');
      await createConflict(storage, conflicted, evidence(key, 5, 'server-value'), [successor]);
      enqueueMutation(storage, conflicted);
      storage.setItem(scopedKey(identity, key), 'latest-B');
      const operations = [];

      assert.throws(
        () => acceptServerConflict(
          crashingAdapter(storage, crashAfter, operations),
          identity,
          reference(conflicted.id),
        ),
        new RegExp(`crash after ${crashAfter}`),
      );
      assert.deepEqual(
        operations.filter(item => item.operation === 'writeCache'),
        [],
      );

      if (readConflicts(storage, identity).length > 0) {
        acceptServerConflict(
          resolutionAdapter(storage),
          identity,
          reference(conflicted.id),
        );
      }
      assert.equal(storage.getItem(scopedKey(identity, key)), 'latest-B');
      assert.equal(readConflicts(storage, identity).length, 0);
      assert.deepEqual(readMutationQueue(storage, identity).map(item => item.id), [
        'step-accept-b',
      ]);

      await replayMutationQueue(storage, identity, async () => ({ revision: 6 }));
      assert.equal(storage.getItem(scopedKey(identity, key)), 'latest-B');
      assert.equal(readMutationQueue(storage, identity).length, 0);
    });
  }
});

test('retry local requires confirmation then requeues in order and resumes delivery', async () => {
  const storage = new MemoryStorage();
  const conflicted = mutation('retry-a', key, 1, 'local-A');
  const successor = mutation('retry-b', key, 2, 'local-B');
  await createConflict(storage, conflicted, evidence(key, 5, 'server-value'), [successor]);

  assert.throws(
    () => retryLocalConflict(
      resolutionAdapter(storage),
      identity,
      reference(conflicted.id),
      false,
    ),
    /explicit confirmation/i,
  );
  assert.equal(readConflicts(storage, identity).length, 1);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => item.id), ['retry-b']);

  retryLocalConflict(
    resolutionAdapter(storage),
    identity,
    reference(conflicted.id),
    true,
  );
  assert.equal(readConflicts(storage, identity).length, 0);
  assert.equal(getCacheRevision(storage, identity, key), 5);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => [
    item.id,
    item.baseRevision,
  ]), [
    ['retry-a', 5],
    ['retry-b', 5],
  ]);

  const delivered = [];
  await replayMutationQueue(storage, identity, async item => {
    delivered.push([item.id, item.baseRevision]);
    return { revision: item.id === 'retry-a' ? 6 : 7 };
  });
  assert.deepEqual(delivered, [
    ['retry-a', 5],
    ['retry-b', 6],
  ]);
});

test('retry local remains blocked and idempotent across a crash before final clear', async () => {
  const storage = new MemoryStorage();
  const conflicted = mutation('crash-a', key, 1, 'local-A');
  const successor = mutation('crash-b', key, 2, 'local-B');
  await createConflict(storage, conflicted, evidence(key, 8, 'server-value'), [successor]);

  storage.failNextConflictRemoval = true;
  assert.throws(
    () => retryLocalConflict(
      resolutionAdapter(storage),
      identity,
      reference(conflicted.id),
      true,
    ),
    /simulated crash/i,
  );
  assert.equal(readConflicts(storage, identity).length, 1);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => [
    item.id,
    item.baseRevision,
  ]), [
    ['crash-a', 8],
    ['crash-b', 8],
  ]);

  const blocked = [];
  await replayMutationQueue(storage, identity, async item => blocked.push(item.id));
  assert.deepEqual(blocked, []);

  retryLocalConflict(
    resolutionAdapter(storage),
    identity,
    reference(conflicted.id),
    true,
  );
  assert.equal(readConflicts(storage, identity).length, 0);
  assert.deepEqual(readMutationQueue(storage, identity).map(item => item.id), [
    'crash-a',
    'crash-b',
  ]);
});

test('retry local replaces a stale duplicate and recovers after every durable step', async t => {
  for (const crashAfter of [
    'replaceMutation',
    'replaceRevision',
    'rebaseSuccessors',
    'clearConflict',
  ]) {
    await t.test(crashAfter, async () => {
      const storage = new MemoryStorage();
      const conflicted = mutation('step-retry-a', key, 1, 'local-A');
      const successor = mutation('step-retry-b', key, 2, 'local-B');
      await createConflict(storage, conflicted, evidence(key, 7, 'server-value'), [successor]);
      enqueueMutation(storage, conflicted);

      assert.throws(
        () => retryLocalConflict(
          crashingAdapter(storage, crashAfter, []),
          identity,
          reference(conflicted.id),
          true,
        ),
        new RegExp(`crash after ${crashAfter}`),
      );
      if (readConflicts(storage, identity).length > 0) {
        retryLocalConflict(
          resolutionAdapter(storage),
          identity,
          reference(conflicted.id),
          true,
        );
      }

      assert.equal(readConflicts(storage, identity).length, 0);
      assert.deepEqual(readMutationQueue(storage, identity).map(item => [
        item.id,
        item.baseRevision,
      ]), [
        ['step-retry-a', 7],
        ['step-retry-b', 7],
      ]);
      const delivered = [];
      await replayMutationQueue(storage, identity, async item => {
        delivered.push([item.id, item.baseRevision]);
        return { revision: item.id === 'step-retry-a' ? 8 : 9 };
      });
      assert.deepEqual(delivered, [
        ['step-retry-a', 7],
        ['step-retry-b', 8],
      ]);
    });
  }
});

test('resolution rejects a mismatched duplicate without clearing its conflict', async () => {
  const storage = new MemoryStorage();
  const conflicted = mutation('duplicate-mismatch', key, 1, 'local-A');
  await createConflict(storage, conflicted, evidence(key, 5, 'server-value'));
  replaceMutation(storage, { ...conflicted, value: 'tampered-value' });

  assert.throws(
    () => acceptServerConflict(
      resolutionAdapter(storage),
      identity,
      reference(conflicted.id),
    ),
    /queued mutation ID does not match/i,
  );
  assert.throws(
    () => retryLocalConflict(
      resolutionAdapter(storage),
      identity,
      reference(conflicted.id),
      true,
    ),
    /queued mutation ID does not match/i,
  );
  assert.equal(readConflicts(storage, identity).length, 1);
  assert.equal(readMutationQueue(storage, identity)[0].value, 'tampered-value');
});

test('accept server remains blocked and idempotent across a crash before final clear', async () => {
  const storage = new MemoryStorage();
  const conflicted = mutation('accept-crash-a', key, 1, 'local-A');
  const successor = mutation('accept-crash-b', key, 2, 'full-local-B');
  await createConflict(storage, conflicted, evidence(key, 9, 'server-value'), [successor]);
  storage.setItem(scopedKey(identity, key), 'full-local-B');

  storage.failNextConflictRemoval = true;
  assert.throws(
    () => acceptServerConflict(
      resolutionAdapter(storage),
      identity,
      reference(conflicted.id),
    ),
    /simulated crash/i,
  );
  assert.equal(readConflicts(storage, identity).length, 1);
  assert.equal(storage.getItem(scopedKey(identity, key)), 'full-local-B');
  assert.equal(getCacheRevision(storage, identity, key), 9);
  assert.equal(readMutationQueue(storage, identity)[0].baseRevision, 9);

  acceptServerConflict(
    resolutionAdapter(storage),
    identity,
    reference(conflicted.id),
  );
  assert.equal(readConflicts(storage, identity).length, 0);
  assert.equal(storage.getItem(scopedKey(identity, key)), 'full-local-B');
  assert.deepEqual(readMutationQueue(storage, identity).map(item => item.id), [
    'accept-crash-b',
  ]);
});

test('retry local preserves a conflicted tombstone', async () => {
  const storage = new MemoryStorage();
  const localDelete = mutation('retry-delete', key, 1, null);
  await createConflict(storage, localDelete, evidence(key, 2, 'server-value'));

  retryLocalConflict(
    resolutionAdapter(storage),
    identity,
    reference(localDelete.id),
    true,
  );

  assert.deepEqual(readMutationQueue(storage, identity).map(item => ({
    id: item.id,
    value: item.value,
    baseRevision: item.baseRevision,
  })), [{
    id: 'retry-delete',
    value: null,
    baseRevision: 2,
  }]);
});

test('malformed or mismatched server evidence never clears conflicts', async () => {
  const storage = new MemoryStorage();
  const malformed = mutation('malformed');
  const mismatchedKey = 'exam-prep-completed:SAT';
  const mismatched = mutation('mismatched', mismatchedKey, 2);
  await createConflict(storage, malformed, { error: 'missing current state' });
  await createConflict(storage, mismatched, evidence(key, 4, 'wrong-resource'));
  storage.setItem(scopedKey(identity, key), malformed.value);

  assert.throws(
    () => acceptServerConflict(
      resolutionAdapter(storage),
      identity,
      reference(malformed.id),
    ),
    /evidence is incomplete/i,
  );
  assert.throws(
    () => retryLocalConflict(
      resolutionAdapter(storage),
      identity,
      reference(malformed.id),
      true,
    ),
    /evidence is incomplete/i,
  );
  assert.throws(
    () => acceptServerConflict(
      resolutionAdapter(storage),
      identity,
      reference(mismatched.id, mismatchedKey),
    ),
    /different resource/i,
  );
  assert.deepEqual(readConflicts(storage, identity).map(item => item.id), [
    'malformed',
    'mismatched',
  ]);
  assert.equal(storage.getItem(scopedKey(identity, key)), malformed.value);
});
