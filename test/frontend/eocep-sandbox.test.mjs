import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  availableQuestionDomains,
  filterQuestionsByDomain,
  scaleEocepScore,
} from '../../src/ExamPrepHub/shared/eocepSandbox.ts';

test('sandbox domains are derived from available questions and empty pools stay blocked', () => {
  const questions = [{ id: 'a', domain: 1 }, { id: 'b', domain: 1 }];
  assert.deepEqual(availableQuestionDomains(questions), [1]);
  assert.equal(filterQuestionsByDomain(questions, 2).length, 0);
  assert.equal(filterQuestionsByDomain(questions, 'both').length, 2);
});

test('EOCEP score curve is continuous and hits documented anchors', () => {
  assert.equal(scaleEocepScore(0, 100), 200);
  assert.equal(scaleEocepScore(70, 100), 700);
  assert.equal(scaleEocepScore(100, 100), 950);
  assert.ok(Math.abs(scaleEocepScore(6_999, 10_000) - scaleEocepScore(7_001, 10_000)) <= 1);
});

test('all four EOCEP sandboxes derive domains, block empty starts, and share scoring', async () => {
  for (const track of ['ALG1', 'BIO1', 'ENG2', 'USHC']) {
    const source = await readFile(`src/ExamPrepHub/exams/${track}/ExamSandbox.tsx`, 'utf8');
    assert.match(source, /availableQuestionDomains\(questions\)/, track);
    assert.match(source, /filterQuestionsByDomain\(questions, config\.domain\)/, track);
    assert.match(source, /if \(pool\.length === 0\)/, track);
    assert.match(source, /scaleEocepScore\(correctCount, examQuestions\.length\)/, track);
    assert.doesNotMatch(source, /label: 'Reserved'/, track);
  }
});
