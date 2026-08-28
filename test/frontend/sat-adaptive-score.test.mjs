import assert from 'node:assert/strict';
import test from 'node:test';
import {
  scoreAdaptiveTest,
} from '../../src/ExamPrepHub/exams/SAT/adaptiveScore.ts';

const questions = [
  ...Array.from({ length: 4 }, (_, index) => ({
    id: `rw-${index}`,
    section: 'reading-writing',
    domain: 'rw-domain',
    correctAnswers: [0],
  })),
  ...Array.from({ length: 4 }, (_, index) => ({
    id: `math-${index}`,
    section: 'math',
    domain: 'math-domain',
    correctAnswers: [0],
  })),
];
const presented = questions.map(question => question.id);

test('unanswered presented SAT questions count as incorrect', () => {
  const result = scoreAdaptiveTest(questions, presented, { 'rw-0': 0 });

  assert.equal(result.rwRaw, 1);
  assert.equal(result.mathRaw, 0);
  assert.ok(result.totalScaled < 1600);
  assert.deepEqual(result.domainBreakdown, {
    'rw-domain': { correct: 1, total: 4 },
    'math-domain': { correct: 0, total: 4 },
  });
});

test('fully answered adaptive tests preserve full-score behavior', () => {
  const answers = Object.fromEntries(presented.map(id => [id, 0]));
  const result = scoreAdaptiveTest(questions, presented, answers);

  assert.equal(result.rwRaw, 4);
  assert.equal(result.mathRaw, 4);
  assert.equal(result.totalScaled, 1600);
});
