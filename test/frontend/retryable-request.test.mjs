import assert from 'node:assert/strict';
import test from 'node:test';
import { retryableRequest } from '../../src/app/api/retryableRequest.ts';

test('deduplicates active hydration and evicts failures for explicit retry', async () => {
  const requests = new Map();
  let attempts = 0;
  const factory = async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('offline');
    return ['hydrated'];
  };

  const first = retryableRequest(requests, 'tenant:user', factory);
  assert.equal(retryableRequest(requests, 'tenant:user', factory), first);
  await assert.rejects(first, /offline/);
  await Promise.resolve();
  assert.equal(requests.has('tenant:user'), false);

  assert.deepEqual(
    await retryableRequest(requests, 'tenant:user', factory, true),
    ['hydrated'],
  );
  assert.equal(attempts, 2);
});
