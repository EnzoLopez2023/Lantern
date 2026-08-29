import assert from 'node:assert/strict';
import test from 'node:test';
import { hydrateCapturedIdentity } from '../../src/app/storage/hydrate.ts';

test('late old-account hydration cannot write into the new account namespace', async () => {
  const values = new Map();
  const revisions = new Map();
  const namespace = identity => `${identity.tenant}:${identity.oid}:`;
  const adapter = {
    pendingKeys: () => new Set(),
    cache: identity => ({
      getItem: key => values.get(`${namespace(identity)}${key}`) ?? null,
      setItem: (key, value) => values.set(`${namespace(identity)}${key}`, value),
      removeItem: key => values.delete(`${namespace(identity)}${key}`),
      getRevision: key => revisions.get(`${namespace(identity)}${key}`) ?? 0,
      setRevision: (key, revision) => revisions.set(`${namespace(identity)}${key}`, revision),
    }),
  };
  const oldIdentity = { tenant: 'tenant-a', oid: 'old-user' };
  const newIdentity = { tenant: 'tenant-a', oid: 'new-user' };
  let activeIdentity = oldIdentity;
  let resolveOld;
  const oldRecords = new Promise(resolve => { resolveOld = resolve; });
  const lateOldHydration = oldRecords.then(records =>
    hydrateCapturedIdentity(records, oldIdentity, adapter));

  activeIdentity = newIdentity;
  hydrateCapturedIdentity([{
    resourceKey: 'exam-prep-streak:SAT',
    revision: 2,
    value: 'new-account-value',
    tombstone: false,
  }], activeIdentity, adapter);

  resolveOld([{
    resourceKey: 'exam-prep-streak:SAT',
    revision: 7,
    value: 'old-account-value',
    tombstone: false,
  }]);
  await lateOldHydration;

  assert.equal(
    values.get(`${namespace(newIdentity)}exam-prep-streak:SAT`),
    'new-account-value',
  );
  assert.equal(
    values.get(`${namespace(oldIdentity)}exam-prep-streak:SAT`),
    'old-account-value',
  );
});
