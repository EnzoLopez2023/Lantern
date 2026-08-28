import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSectionScoreStats } from '../../src/ExamPrepHub/exams/SAT/scoreSummary.ts';

test('SAT estimated score counts one current outcome per distinct question', () => {
  const questions = [
    { id: 'rw-1', section: 'reading-writing' },
    { id: 'math-1', section: 'math' },
  ];
  const result = calculateSectionScoreStats(questions, {
    'rw-1': { attempts: 8, correct: 7, lastResult: 'correct' },
    'math-1': { attempts: 4, correct: 3, lastResult: 'wrong' },
  });

  assert.deepEqual(result.rw, { correct: 1, attempted: 1, total: 1 });
  assert.deepEqual(result.math, { correct: 0, attempted: 1, total: 1 });
});
