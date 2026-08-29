import assert from 'node:assert/strict';
import test from 'node:test';
import { retryableRequest } from '../../src/app/api/retryableRequest.ts';

test('deduplicates only concurrent requests and evicts successful snapshots', async () => {
  const requests = new Map();
  let attempts = 0;
  let resolveFirst;
  const first = retryableRequest(requests, 'tenant:user', () => {
    attempts += 1;
    return new Promise(resolve => { resolveFirst = resolve; });
  });

  assert.equal(
    retryableRequest(requests, 'tenant:user', async () => {
      attempts += 1;
      return ['duplicate'];
    }),
    first,
  );
  resolveFirst(['hydrated']);
  assert.deepEqual(await first, ['hydrated']);
  await Promise.resolve();
  assert.equal(requests.has('tenant:user'), false);

  assert.deepEqual(await retryableRequest(requests, 'tenant:user', async () => {
    attempts += 1;
    return ['fresh'];
  }), ['fresh']);
  assert.equal(attempts, 2);
});

test('A to B to A activations perform three factories and return current A data', async () => {
  const requests = new Map();
  const calls = [];
  const activate = (identity, value) => retryableRequest(requests, identity, async () => {
    calls.push(identity);
    return value;
  });

  assert.equal(await activate('A', 'A-old'), 'A-old');
  await Promise.resolve();
  assert.equal(await activate('B', 'B-current'), 'B-current');
  await Promise.resolve();
  assert.equal(await activate('A', 'A-current'), 'A-current');
  assert.deepEqual(calls, ['A', 'B', 'A']);
});

test('rejected requests are evicted and can retry', async () => {
  const requests = new Map();
  let attempts = 0;
  const factory = async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('offline');
    return 'recovered';
  };

  await assert.rejects(retryableRequest(requests, 'A', factory), /offline/);
  await Promise.resolve();
  assert.equal(await retryableRequest(requests, 'A', factory), 'recovered');
  assert.equal(attempts, 2);
});
