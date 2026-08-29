import assert from 'node:assert/strict';
import test from 'node:test';
import {
  adaptiveResultSummary,
  countCurrentModuleAnswers,
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

test('module confirmation ignores accumulated answers from prior modules', () => {
  const priorAnswers = Object.fromEntries(
    Array.from({ length: 54 }, (_, index) => [`prior-${index}`, 0]),
  );
  const currentQuestions = Array.from({ length: 22 }, (_, index) => ({ id: `current-${index}` }));

  assert.equal(countCurrentModuleAnswers(currentQuestions, priorAnswers), 0);
  assert.equal(countCurrentModuleAnswers(currentQuestions, {
    ...priorAnswers,
    'current-3': 1,
    'current-9': 0,
  }), 2);
});

test('section-only result summaries use the tested 200–800 scale without a total', () => {
  for (const [mode, section] of [
    ['rw-only', 'reading-writing'],
    ['math-only', 'math'],
  ]) {
    const selected = questions.filter(question => question.section === section);
    const ids = selected.map(question => question.id);
    const perfect = scoreAdaptiveTest(
      questions,
      ids,
      Object.fromEntries(ids.map(id => [id, 0])),
    );
    const allWrong = scoreAdaptiveTest(
      questions,
      ids,
      Object.fromEntries(ids.map(id => [id, 1])),
    );
    const perfectSummary = adaptiveResultSummary(mode, perfect);
    const wrongSummary = adaptiveResultSummary(mode, allWrong);

    assert.equal(perfectSummary.score, 800);
    assert.equal(wrongSummary.score, 200);
    assert.equal(perfectSummary.maxScore, 800);
    assert.deepEqual(perfectSummary.sectionScores, []);
  }
});

test('full result summaries retain the 400–1600 total and both section scores', () => {
  const perfect = scoreAdaptiveTest(
    questions,
    presented,
    Object.fromEntries(presented.map(id => [id, 0])),
  );
  const allWrong = scoreAdaptiveTest(
    questions,
    presented,
    Object.fromEntries(presented.map(id => [id, 1])),
  );
  const perfectSummary = adaptiveResultSummary('full', perfect);
  const wrongSummary = adaptiveResultSummary('full', allWrong);

  assert.equal(perfectSummary.score, 1600);
  assert.equal(wrongSummary.score, 400);
  assert.equal(perfectSummary.maxScore, 1600);
  assert.deepEqual(perfectSummary.sectionScores, [
    { label: 'Reading & Writing', score: 800 },
    { label: 'Math', score: 800 },
  ]);
});

test('adaptive routing differentiates equal raw totals and remains bounded', () => {
  const answers = { 'rw-0': 0, 'rw-1': 0, 'rw-2': 1, 'rw-3': 1 };
  const ids = questions.filter(question => question.section === 'reading-writing')
    .map(question => question.id);
  const easy = scoreAdaptiveTest(questions, ids, answers, { 'reading-writing': 'easy' });
  const hard = scoreAdaptiveTest(questions, ids, answers, { 'reading-writing': 'hard' });

  assert.ok(hard.rwScaled > easy.rwScaled);
  assert.ok(easy.rwScaled >= 200);
  assert.ok(hard.rwScaled <= 800);
});

test('fully answered adaptive tests preserve full-score behavior', () => {
  const answers = Object.fromEntries(presented.map(id => [id, 0]));
  const result = scoreAdaptiveTest(questions, presented, answers);

  assert.equal(result.rwRaw, 4);
  assert.equal(result.mathRaw, 4);
  assert.equal(result.totalScaled, 1600);
});
