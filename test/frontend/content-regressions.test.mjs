import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { questions as algebraQuestions } from '../../src/ExamPrepHub/exams/ALG1/questions.ts';

test('ALG1 stat-18 has unique options and retains 25 as the correct value', () => {
  const question = algebraQuestions.find(item => item.id === 'stat-18');
  assert.ok(question);
  assert.equal(new Set(question.options).size, question.options.length);
  assert.equal(question.options[question.correctAnswers[0]], '25');
});

test('CHEM table data uses literal comparison characters instead of entity text', async () => {
  const source = await readFile('src/ExamPrepHub/exams/CHEM/StudyGuide.tsx', 'utf8');
  assert.doesNotMatch(source, /'(?:0 to &lt;0\.4|&gt;1\.7|&lt;120°|&lt;109\.5°)'/);
  assert.match(source, /'0 to <0\.4'/);
  assert.match(source, /'>1\.7'/);
});
