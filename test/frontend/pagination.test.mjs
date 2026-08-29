import assert from 'node:assert/strict';
import test from 'node:test';
import { collectStatePages } from '../../src/app/api/pagination.ts';

const record = (updatedAt, resourceType, resourceKey) => ({
  updatedAt,
  resourceType,
  resourceKey,
});

test('collects every page using server-issued opaque cursors', async () => {
  const cursors = [];
  const pages = [
    {
      resources: [
        record('2026-01-01T00:00:00Z', 'notes', 'a'),
        record('2026-01-01T00:00:00Z', 'notes', 'b'),
      ],
      nextCursor: 'cursor-page-2',
    },
    {
      resources: [
        record('2026-01-01T00:00:00Z', 'progress', 'a'),
        record('2026-01-02T00:00:00Z', 'streak', 'a'),
      ],
      nextCursor: 'cursor-page-3',
    },
    { resources: [record('2026-01-03T00:00:00Z', 'resume', 'a')], nextCursor: null },
  ];

  const all = await collectStatePages(async cursor => {
    cursors.push(cursor);
    return pages[cursors.length - 1];
  }, 2, 10);

  assert.equal(all.length, 5);
  assert.deepEqual(cursors[1], pages[0].nextCursor);
  assert.deepEqual(cursors[2], pages[1].nextCursor);
});

test('rejects repeated cursors and bounded-page overflow', async () => {
  const item = record('2026-01-01T00:00:00Z', 'notes', 'a');
  await assert.rejects(
    collectStatePages(async () => ({ resources: [item], nextCursor: 'repeated' }), 1, 3),
    /repeated cursor/,
  );
  let page = 0;
  await assert.rejects(
    collectStatePages(async () => ({
      resources: [record(`2026-01-0${++page}T00:00:00Z`, 'notes', 'a')],
      nextCursor: `cursor-${page}`,
    }), 1, 2),
    /exceeded 2 pages/,
  );
});

test('preserves explicit null on an exact 500-record final page', async () => {
  const page = Array.from({ length: 500 }, (_, index) =>
    record('2026-01-01T00:00:00Z', 'notes', `note-${index}`));
  let calls = 0;
  const all = await collectStatePages(async () => {
    calls += 1;
    return { resources: page, nextCursor: null };
  });

  assert.equal(all.length, 500);
  assert.equal(calls, 1);
});

test('collects 1000 records across two exact pages without truncation', async () => {
  const first = Array.from({ length: 500 }, (_, index) =>
    record('2026-01-01T00:00:00Z', 'progress', `first-${index}`));
  const second = Array.from({ length: 500 }, (_, index) =>
    record('2026-01-02T00:00:00Z', 'progress', `second-${index}`));
  const cursors = [];
  const all = await collectStatePages(async cursor => {
    cursors.push(cursor);
    return cursor === null
      ? { resources: first, nextCursor: 'base64url-page-2' }
      : { resources: second, nextCursor: null };
  });

  assert.equal(all.length, 1000);
  assert.deepEqual(cursors, [null, 'base64url-page-2']);
});
