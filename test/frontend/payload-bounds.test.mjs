import assert from 'node:assert/strict';
import test from 'node:test';
import { boundSyncPayload } from '../../src/app/storage/payloadBounds.ts';

test('bounds analytics history without changing unrelated state', () => {
  const attempts = Array.from({ length: 20 }, (_, index) => ({
    id: `attempt-${index}`,
    detail: 'x'.repeat(4_000),
  }));
  const bounded = boundSyncPayload('exam-prep-analytics:SAT', JSON.stringify(attempts));
  const parsed = JSON.parse(bounded);

  assert.ok(new TextEncoder().encode(bounded).byteLength <= 24_000);
  assert.equal(parsed[0].id, 'attempt-0');
  assert.ok(parsed.length < attempts.length);
  assert.equal(boundSyncPayload('exam-prep-notes:SAT:q1', 'unchanged'), 'unchanged');
});

test('bounds one oversized analytics attempt by trimming per-question detail', () => {
  const attempt = {
    id: 'attempt-large',
    completedAt: 1,
    scoreScaled: 900,
    perQuestion: Array.from({ length: 1_000 }, (_, index) => ({
      questionId: `question-${index}`,
      subdomain: 'x'.repeat(100),
    })),
  };
  const bounded = boundSyncPayload('exam-prep-analytics:SAT', JSON.stringify([attempt]));
  const parsed = JSON.parse(bounded);

  assert.ok(new TextEncoder().encode(bounded).byteLength <= 24_000);
  assert.equal(parsed[0].id, attempt.id);
  assert.ok(parsed[0].perQuestion.length < attempt.perQuestion.length);
});
