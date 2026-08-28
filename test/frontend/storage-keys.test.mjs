import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isClaimableLegacyKey,
  scopedKey,
  syncKindForKey,
} from '../../src/app/storage/keys.ts';

test('scopes legacy keys by tenant and oid', () => {
  assert.equal(
    scopedKey({ tenant: 'tenant-a', oid: 'user/42' }, 'exam-prep-streak:SAT'),
    'lantern:v1:tenant-a:user%2F42:exam-prep-streak:SAT',
  );
});

test('recognizes only product persistence keys for explicit claiming', () => {
  assert.equal(isClaimableLegacyKey('exam-prep-notes:SAT:section:intro'), true);
  assert.equal(isClaimableLegacyKey('hearth-wkwebview-checks'), true);
  assert.equal(isClaimableLegacyKey('my-game-save'), false);
  assert.equal(isClaimableLegacyKey('msal.account.cache'), false);
});

test('maps immediate cache writes to typed sync surfaces', () => {
  assert.equal(syncKindForKey('exam-prep-bookmarks:SAT:question'), 'bookmarks');
  assert.equal(syncKindForKey('exam-prep-streak:SAT'), 'streak');
  assert.equal(syncKindForKey('exam-prep-sandbox-resume:USHC'), 'resume');
  assert.equal(syncKindForKey('exam-prep-quiz:ALG1'), 'progress');
  assert.equal(syncKindForKey('kb-tts-progress:azure'), 'progress');
  assert.equal(syncKindForKey('unrelated'), null);
});
