import assert from 'node:assert/strict';
import test from 'node:test';
import {
  nextTTSChunkCursor,
  splitTTSChunks,
  TTS_CHUNK_LIMIT,
} from '../../src/KnowledgeBase/ttsChunks.ts';

const exactText = length => {
  const paragraph = 'Lantern reads this sentence in order. It preserves every word and boundary.\n\n';
  return paragraph.repeat(Math.ceil(length / paragraph.length)).slice(0, length);
};

for (const length of [17_767, 11_965]) {
  test(`splits the known ${length.toLocaleString()}-character guide section losslessly`, () => {
    const source = exactText(length);
    const chunks = splitTTSChunks(source);

    assert.equal(source.length, length);
    assert.equal(chunks.join(''), source);
    assert.ok(chunks.length > 1);
    assert.ok(chunks.every(chunk => chunk.length > 0 && chunk.length <= TTS_CHUNK_LIMIT));
  });
}

test('prefers paragraph, sentence, then word boundaries', () => {
  assert.deepEqual(splitTTSChunks('first paragraph\n\nsecond paragraph', 18), [
    'first paragraph\n\n',
    'second paragraph',
  ]);
  assert.deepEqual(splitTTSChunks('First sentence. Second sentence.', 20), [
    'First sentence. ',
    'Second sentence.',
  ]);
  assert.deepEqual(splitTTSChunks('alpha beta gamma', 11), ['alpha beta ', 'gamma']);
});

test('hard-splits only an unavoidable long token without dropping text', () => {
  const source = 'x'.repeat(20_001);
  const chunks = splitTTSChunks(source);

  assert.deepEqual(chunks.map(chunk => chunk.length), [9_000, 9_000, 2_001]);
  assert.equal(chunks.join(''), source);
});

test('chunk playback advances within a section before the next section', () => {
  const counts = [3, 2];
  const sequence = [];
  let cursor = nextTTSChunkCursor(counts, null);
  while (cursor) {
    sequence.push([cursor.sectionIndex, cursor.chunkIndex]);
    cursor = nextTTSChunkCursor(counts, cursor);
  }

  assert.deepEqual(sequence, [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
  ]);
});

test('chunk sequencing safely skips empty sections', () => {
  assert.deepEqual(nextTTSChunkCursor([0, 2], null), { sectionIndex: 1, chunkIndex: 0 });
  assert.equal(nextTTSChunkCursor([0], null), null);
});
