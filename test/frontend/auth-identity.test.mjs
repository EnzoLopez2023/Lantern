import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isHydrationActivationReady,
  isCurrentHydrationRequest,
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

test('A to B to A readiness requires the fresh A activation generation', () => {
  const oldA = { key: 'A', generation: 1 };
  const pendingB = { key: 'B', generation: 2 };
  const freshA = { key: 'A', generation: 3 };

  assert.equal(isHydrationActivationReady('A', 1, oldA, oldA), true);
  assert.equal(isHydrationActivationReady('B', 2, pendingB, oldA), false);
  assert.equal(isHydrationActivationReady('A', 3, freshA, oldA), false);
  assert.equal(isHydrationActivationReady('A', 3, freshA, freshA), true);
});

test('hydration generation rejects stale account and retry requests', () => {
  assert.equal(isCurrentHydrationRequest('tenant-a\u0000oid-a', 4, 4, 'tenant-a\u0000oid-a'), true);
  assert.equal(isCurrentHydrationRequest('tenant-a\u0000oid-a', 3, 4, 'tenant-a\u0000oid-a'), false);
  assert.equal(isCurrentHydrationRequest('tenant-a\u0000oid-a', 4, 4, 'tenant-b\u0000oid-b'), false);
});
