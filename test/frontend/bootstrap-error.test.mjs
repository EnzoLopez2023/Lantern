import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bootstrapErrorMessage,
  authRedirectFailure,
  prepareAuthClient,
} from '../../src/app/auth/bootstrapError.ts';

test('normalizes MSAL bootstrap failures for recovery UI', () => {
  assert.equal(bootstrapErrorMessage(new Error('redirect failed')), 'redirect failed');
  assert.equal(bootstrapErrorMessage(null), 'Microsoft sign-in could not be initialized.');
});

test('captures login redirect rejection for the recoverable auth UI', async () => {
  assert.equal(
    await authRedirectFailure(async () => { throw new Error('popup blocked'); }),
    'popup blocked',
  );
  assert.equal(await authRedirectFailure(async () => undefined), null);
  assert.equal(
    await authRedirectFailure(
      async () => { throw null; },
      'Microsoft sign-out could not be started.',
    ),
    'Microsoft sign-out could not be started.',
  );
});

test('initializes MSAL before handling redirects and propagates recovery errors', async () => {
  const calls = [];
  await prepareAuthClient({
    initialize: async () => { calls.push('initialize'); },
    handleRedirectPromise: async () => { calls.push('redirect'); return null; },
    getActiveAccount: () => null,
    getAllAccounts: () => [],
    setActiveAccount: () => {},
  });
  assert.deepEqual(calls, ['initialize', 'redirect']);

  await assert.rejects(
    prepareAuthClient({
      initialize: async () => undefined,
      handleRedirectPromise: async () => { throw new Error('bad redirect'); },
      getActiveAccount: () => null,
      getAllAccounts: () => [],
      setActiveAccount: () => {},
    }),
    /bad redirect/,
  );
});

test('selects redirect and sole cached accounts but rejects ambiguous caches', async () => {
  const redirectAccount = { homeAccountId: 'redirect' };
  let active = null;
  assert.equal(await prepareAuthClient({
    initialize: async () => {},
    handleRedirectPromise: async () => ({ account: redirectAccount }),
    getActiveAccount: () => active,
    getAllAccounts: () => [],
    setActiveAccount: account => { active = account; },
  }), redirectAccount);
  assert.equal(active, redirectAccount);

  const soleAccount = { homeAccountId: 'sole' };
  active = null;
  assert.equal(await prepareAuthClient({
    initialize: async () => {},
    handleRedirectPromise: async () => null,
    getActiveAccount: () => active,
    getAllAccounts: () => [soleAccount],
    setActiveAccount: account => { active = account; },
  }), soleAccount);
  assert.equal(active, soleAccount);

  await assert.rejects(prepareAuthClient({
    initialize: async () => {},
    handleRedirectPromise: async () => null,
    getActiveAccount: () => null,
    getAllAccounts: () => [{ homeAccountId: 'one' }, { homeAccountId: 'two' }],
    setActiveAccount: () => {},
  }), /Multiple cached Microsoft accounts/);
});
