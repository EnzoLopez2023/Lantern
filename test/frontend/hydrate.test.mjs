import assert from 'node:assert/strict';
import test from 'node:test';
import { hydrateCacheFromServer } from '../../src/app/storage/hydrate.ts';

class MemoryCache {
  values = new Map();
  revisions = new Map();

  getItem(key) {
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }

  removeItem(key) {
    this.values.delete(key);
  }

  getRevision(key) {
    return this.revisions.get(key) ?? 0;
  }

  setRevision(key, revision) {
    this.revisions.set(key, revision);
  }
}

test('server revision wins over stale local cache while pending writes win', () => {
  const cache = new MemoryCache();
  cache.setItem('exam-prep-streak:SAT', 'stale-local');
  cache.setRevision('exam-prep-streak:SAT', 2);
  cache.setItem('exam-prep-notes:SAT:question:q1', 'offline-note');

  const result = hydrateCacheFromServer([
    {
      resourceKey: 'exam-prep-streak:SAT',
      revision: 3,
      value: 'server-streak',
      tombstone: false,
    },
    {
      resourceKey: 'exam-prep-notes:SAT:question:q1',
      revision: 8,
      value: 'stale-server-note',
      tombstone: false,
    },
  ], cache, new Set(['exam-prep-notes:SAT:question:q1']));

  assert.equal(cache.getItem('exam-prep-streak:SAT'), 'server-streak');
  assert.equal(cache.getRevision('exam-prep-streak:SAT'), 3);
  assert.equal(cache.getItem('exam-prep-notes:SAT:question:q1'), 'offline-note');
  assert.equal(result.overwrittenLocal, 1);
  assert.equal(result.preservedPending, 1);
});

test('stale server revisions never replace newer hydrated cache', () => {
  const cache = new MemoryCache();
  cache.setItem('kb-tts-progress:azure', '{"sectionIndex":9}');
  cache.setRevision('kb-tts-progress:azure', 12);

  const result = hydrateCacheFromServer([
    {
      resourceKey: 'kb-tts-progress:azure',
      revision: 11,
      value: '{"sectionIndex":2}',
      tombstone: false,
    },
  ], cache, new Set());

  assert.equal(cache.getItem('kb-tts-progress:azure'), '{"sectionIndex":9}');
  assert.equal(result.preservedNewer, 1);
});

test('explicit tombstones apply by revision but preserve pending TTS progress', () => {
  const cache = new MemoryCache();
  cache.setItem('remove-me', 'old');
  cache.setItem('kb-tts-progress:ios', '{"sectionIndex":4}');
  const result = hydrateCacheFromServer([
    { resourceKey: 'remove-me', revision: 2, value: null, tombstone: true },
    { resourceKey: 'kb-tts-progress:ios', revision: 3, value: null, tombstone: true },
  ], cache, new Set(['kb-tts-progress:ios']));

  assert.equal(cache.getItem('remove-me'), null);
  assert.equal(cache.getRevision('remove-me'), 2);
  assert.equal(cache.getItem('kb-tts-progress:ios'), '{"sectionIndex":4}');
  assert.equal(result.removed, 1);
  assert.equal(result.preservedPending, 1);
});

test('a newer acknowledged TTS clear cannot be resurrected by stale server progress', () => {
  const cache = new MemoryCache();
  cache.setRevision('kb-tts-progress:azure', 9);

  const result = hydrateCacheFromServer([
    {
      resourceKey: 'kb-tts-progress:azure',
      revision: 8,
      value: '{"sectionIndex":2}',
      tombstone: false,
    },
  ], cache, new Set());

  assert.equal(cache.getItem('kb-tts-progress:azure'), null);
  assert.equal(cache.getRevision('kb-tts-progress:azure'), 9);
  assert.equal(result.preservedNewer, 1);
});
