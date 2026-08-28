import assert from 'node:assert/strict';
import test from 'node:test';
import {
  commitMutationBeforeCache,
  durableQueueFailureMessage,
} from '../../src/app/storage/orderedCacheMutation.ts';

test('durably enqueues before setting or removing cache values', () => {
  for (const cacheOperation of ['set', 'remove']) {
    const events = [];
    const result = commitMutationBeforeCache(
      () => {
        events.push('enqueue');
        return 'mutation-id';
      },
      () => {
        events.push(cacheOperation);
      },
      () => {
        throw new Error('unexpected cache failure');
      },
    );

    assert.equal(result, 'mutation-id');
    assert.deepEqual(events, ['enqueue', cacheOperation]);
  }
});

test('an enqueue crash prevents the cache mutation', () => {
  const events = [];
  assert.throws(
    () => commitMutationBeforeCache(
      () => {
        events.push('enqueue');
        throw new Error('queue unavailable');
      },
      () => events.push('cache'),
      () => events.push('cache-failure'),
    ),
    /queue unavailable/,
  );
  assert.deepEqual(events, ['enqueue']);
  assert.equal(
    durableQueueFailureMessage(new Error('quota exceeded')),
    'The change could not be durably queued, so browser cache was not changed. quota exceeded',
  );
});

test('a cache crash leaves the mutation durable and reports the failure', () => {
  const durableMutations = new Map();
  const failures = [];

  assert.throws(
    () => commitMutationBeforeCache(
      () => {
        durableMutations.set('mutation-id', { value: 'new-value' });
        return 'mutation-id';
      },
      () => {
        throw new Error('quota exceeded');
      },
      (error, mutationId) => failures.push([error.message, mutationId]),
    ),
    /quota exceeded/,
  );

  assert.deepEqual(durableMutations.get('mutation-id'), { value: 'new-value' });
  assert.deepEqual(failures, [['quota exceeded', 'mutation-id']]);
});
