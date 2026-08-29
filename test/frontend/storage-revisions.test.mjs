import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getCacheRevision,
  setCacheRevision,
} from '../../src/app/storage/revisionMetadata.ts';

class MemoryStorage {
  values = new Map();

  get length() { return this.values.size; }
  getItem(key) { return this.values.get(key) ?? null; }
  key(index) { return [...this.values.keys()][index] ?? null; }
  removeItem(key) { this.values.delete(key); }
  setItem(key, value) { this.values.set(key, String(value)); }
}

test('resource revisions use independent keys and stale acknowledgements cannot lower them', () => {
  const storage = new MemoryStorage();
  const identity = { tenant: 'tenant-a', oid: 'user-a' };

  setCacheRevision(storage, identity, 'kb-tts-progress:azure', 8);
  setCacheRevision(storage, identity, 'exam-prep-streak:SAT', 3);
  setCacheRevision(storage, identity, 'kb-tts-progress:azure', 7);

  assert.equal(getCacheRevision(storage, identity, 'kb-tts-progress:azure'), 8);
  assert.equal(getCacheRevision(storage, identity, 'exam-prep-streak:SAT'), 3);
  assert.equal(
    [...storage.values.keys()].filter(key => key.includes('__lantern-cache-revision__:')).length,
    2,
  );
});
