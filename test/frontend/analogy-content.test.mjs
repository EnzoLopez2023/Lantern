import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAnalogyContent } from '../../src/ExamPrepHub/shared/analogyContent.ts';

test('Analogy preserves children and supports legacy body callers', () => {
  assert.equal(resolveAnalogyContent('children', 'body'), 'children');
  assert.equal(resolveAnalogyContent(undefined, 'body'), 'body');
  assert.equal(resolveAnalogyContent(undefined, undefined), undefined);
});
