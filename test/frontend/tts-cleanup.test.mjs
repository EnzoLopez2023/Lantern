import assert from 'node:assert/strict';
import test from 'node:test';
import {
  cleanupTTSGenerationResources,
  cleanupTTSResources,
  consumePrefetchedTTSUrl,
  getTTSSectionDisposition,
  shouldAcceptTTSPrefetch,
  shouldIgnorePlaybackFailure,
} from '../../src/KnowledgeBase/ttsCleanup.ts';

test('TTS cleanup pauses audio, detaches handlers, revokes every URL, and clears highlighting', () => {
  let paused = 0;
  let highlightsCleared = 0;
  const revoked = [];
  const audio = {
    onended: () => {},
    onerror: () => {},
    pause: () => { paused += 1; },
  };

  cleanupTTSResources(
    audio,
    ['blob:active', 'blob:prefetched', 'blob:active', null],
    url => revoked.push(url),
    () => { highlightsCleared += 1; },
  );

  assert.equal(paused, 1);
  assert.equal(audio.onended, null);
  assert.equal(audio.onerror, null);
  assert.deepEqual(revoked, ['blob:active', 'blob:prefetched']);
  assert.equal(highlightsCleared, 1);
});

test('pause-induced AbortError is ignored without hiding real playback failures', () => {
  assert.equal(shouldIgnorePlaybackFailure('paused', { name: 'AbortError' }), true);
  assert.equal(shouldIgnorePlaybackFailure('playing', { name: 'AbortError' }), false);
  assert.equal(shouldIgnorePlaybackFailure('paused', new Error('decoder failed')), false);
});

test('voice changes invalidate in-flight prefetches', () => {
  assert.equal(shouldAcceptTTSPrefetch(3, 3, 5, 5), true);
  assert.equal(shouldAcceptTTSPrefetch(3, 3, 5, 6), false);
  assert.equal(shouldAcceptTTSPrefetch(3, 4, 5, 5), false);
});

test('zero discovered sections are unavailable rather than completed', () => {
  assert.equal(getTTSSectionDisposition(0, 0), 'unavailable');
  assert.equal(getTTSSectionDisposition(3, 0), 'ready');
  assert.equal(getTTSSectionDisposition(3, 3), 'complete');
});

test('a mismatched prefetched URL is revoked before it is discarded', () => {
  const revoked = [];
  const prefetched = {
    secIdx: 4,
    chunkIdx: 2,
    voiceVersion: 6,
    generation: 8,
    url: 'blob:wrong-section',
  };

  assert.equal(consumePrefetchedTTSUrl(prefetched, 5, 2, 6, 8, url => revoked.push(url)), null);
  assert.deepEqual(revoked, ['blob:wrong-section']);

  assert.equal(consumePrefetchedTTSUrl(prefetched, 4, 2, 6, 8, url => revoked.push(url)), prefetched.url);
  assert.deepEqual(revoked, ['blob:wrong-section']);
});

test('prefetch identity includes section, chunk, voice, and generation', () => {
  const base = {
    secIdx: 2,
    chunkIdx: 3,
    voiceVersion: 4,
    generation: 5,
    url: 'blob:prefetched',
  };
  for (const requested of [
    [1, 3, 4, 5],
    [2, 2, 4, 5],
    [2, 3, 3, 5],
    [2, 3, 4, 6],
  ]) {
    const revoked = [];
    assert.equal(
      consumePrefetchedTTSUrl(base, ...requested, url => revoked.push(url)),
      null,
    );
    assert.deepEqual(revoked, [base.url]);
  }
});

test('playback failure cleans only the generation that owns the resources', () => {
  let paused = 0;
  let highlightsCleared = 0;
  const revoked = [];
  const audio = {
    onended: () => {},
    onerror: () => {},
    pause: () => { paused += 1; },
  };
  const clean = () => cleanupTTSGenerationResources(
    7,
    7,
    audio,
    ['blob:active', 'blob:prefetched'],
    url => revoked.push(url),
    () => { highlightsCleared += 1; },
  );

  assert.equal(clean(), true);
  assert.equal(paused, 1);
  assert.deepEqual(revoked, ['blob:active', 'blob:prefetched']);
  assert.equal(highlightsCleared, 1);

  const newerGenerationAudio = {
    onended: () => {},
    onerror: () => {},
    pause: () => { paused += 1; },
  };
  assert.equal(cleanupTTSGenerationResources(
    7,
    8,
    newerGenerationAudio,
    ['blob:newer-active', 'blob:newer-prefetched'],
    url => revoked.push(url),
    () => { highlightsCleared += 1; },
  ), false);
  assert.equal(paused, 1);
  assert.deepEqual(revoked, ['blob:active', 'blob:prefetched']);
  assert.equal(highlightsCleared, 1);
});
