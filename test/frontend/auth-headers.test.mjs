import assert from 'node:assert/strict';
import test from 'node:test';
import { authorizedHeaders } from '../../src/app/api/authHeaders.ts';

test('adds the configured bearer token without losing caller headers', () => {
  const headers = authorizedHeaders({ 'Content-Type': 'application/json' }, 'access-token');
  assert.equal(headers.get('Authorization'), 'Bearer access-token');
  assert.equal(headers.get('Content-Type'), 'application/json');
});

test('development bypass omits authorization and explicit headers win', () => {
  assert.equal(authorizedHeaders(undefined, null).has('Authorization'), false);
  assert.equal(
    authorizedHeaders({ Authorization: 'Custom credential' }, 'access-token').get('Authorization'),
    'Custom credential',
  );
});
