import assert from 'node:assert/strict';
import test from 'node:test';
import { hasSectionCrossedReadingPosition } from '../../src/KnowledgeBase/guideProgressTracking.ts';

test('a section taller than 3.3 viewports becomes read on positional crossing', () => {
  assert.equal(hasSectionCrossedReadingPosition({
    isIntersecting: true,
    intersectionRatio: 0.05,
    boundingClientRect: { top: -120, bottom: 3_280 },
    rootBounds: { top: 0, bottom: 1_000 },
  }), true);
  assert.equal(hasSectionCrossedReadingPosition({
    isIntersecting: false,
    intersectionRatio: 0,
    boundingClientRect: { top: 250, bottom: 3_650 },
    rootBounds: { top: 0, bottom: 1_000 },
  }), true);
});
