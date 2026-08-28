import assert from 'node:assert/strict';
import test from 'node:test';
import { statePageQuery } from '../../src/app/api/statePageQuery.ts';
import { resolveNextStateCursor } from '../../src/app/api/stateCursor.ts';
import { stateMutationPayload } from '../../src/app/api/stateMutationPayload.ts';

test('state sync pagination sends only the server-issued opaque cursor', () => {
  const opaque = new URLSearchParams(statePageQuery('opaque-cursor', 250));
  assert.equal(opaque.get('limit'), '250');
  assert.equal(opaque.get('cursor'), 'opaque-cursor');
  assert.equal(opaque.has('after'), false);
  assert.equal(opaque.has('afterType'), false);
  assert.equal(opaque.has('afterKey'), false);
});

test('state sync preserves an explicit null next cursor', () => {
  assert.equal(resolveNextStateCursor({ nextCursor: null, cursor: 'legacy-value' }), null);
  assert.equal(resolveNextStateCursor({ cursor: 'legacy-value' }), 'legacy-value');
});

test('queued state delivery preserves its originating expected revision', () => {
  assert.deepEqual(stateMutationPayload('mutation-a', 7, 'local-value', false), {
    mutationId: 'mutation-a',
    expectedRevision: 7,
    value: 'local-value',
  });
  assert.deepEqual(stateMutationPayload('mutation-b', 4, null, true), {
    mutationId: 'mutation-b',
    expectedRevision: 4,
  });
});
