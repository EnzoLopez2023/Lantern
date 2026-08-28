import assert from 'node:assert/strict';
import test from 'node:test';
import {
  storageIdentityForAccount,
  storageIdentityKey,
} from '../../src/app/auth/authIdentity.ts';

test('equivalent active-account objects produce one stable auth effect key', () => {
  const first = {
    localAccountId: 'local-a',
    tenantId: 'tenant-fallback',
    idTokenClaims: { tid: 'tenant-a', oid: 'oid-a' },
  };
  const second = {
    ...first,
    idTokenClaims: { ...first.idTokenClaims },
  };

  assert.equal(
    storageIdentityKey(storageIdentityForAccount(first, 'configured-tenant')),
    storageIdentityKey(storageIdentityForAccount(second, 'configured-tenant')),
  );
  assert.equal(
    storageIdentityKey(storageIdentityForAccount(first, 'configured-tenant')),
    'tenant-a\u0000oid-a',
  );
});
