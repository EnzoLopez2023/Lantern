import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canLeavePracticeQuestion,
  shouldRecordPracticeConfidence,
} from '../../src/ExamPrepHub/exams/SAT/practiceAttempt.ts';

test('checked SAT answers cannot navigate until confidence persists exactly once', () => {
  assert.equal(canLeavePracticeQuestion(false, null), true);
  assert.equal(canLeavePracticeQuestion(true, null), false);
  assert.equal(canLeavePracticeQuestion(true, 'unsure'), true);
  assert.equal(shouldRecordPracticeConfidence(true, 'unsure', false), true);
  assert.equal(shouldRecordPracticeConfidence(true, 'confident', true), false);
});
