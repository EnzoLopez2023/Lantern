import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const standardTracks = [
  'ALG1',
  'ALG2',
  'BIO1',
  'CHEM',
  'ENG2',
  'ENG3',
  'ENVSCI',
  'PFIN',
  'PHYS',
  'PRECALC',
  'PROBSTAT',
  'USHC',
];

test('every standard Practice surface retains controls for an empty queue', async () => {
  for (const track of standardTracks) {
    const source = await readFile(
      `src/ExamPrepHub/exams/${track}/Practice.tsx`,
      'utf8',
    );
    const emptyBranch = source.slice(
      source.indexOf('if (!current)'),
      source.indexOf('// ── Render'),
    );

    assert.match(source, /import \{ PracticeEmptyState \}/, track);
    assert.match(emptyBranch, /<PracticeEmptyState/, track);
    assert.match(emptyBranch, /onModeChange=\{setMode\}/, track);
    assert.match(emptyBranch, /dueCount=\{dueCount\}/, track);
    assert.doesNotMatch(emptyBranch, /CircularProgress|Loading questions/, track);
  }
});

test('SAT empty bookmarks, due, and filtered queues retain controls and recover to browse all', async () => {
  const source = await readFile('src/ExamPrepHub/exams/SAT/Practice.tsx', 'utf8');
  const controlsStart = source.indexOf('const controls = (');
  const emptyStart = source.indexOf('\n  if (!currentQ) {');
  const emptyBranch = source.slice(
    emptyStart,
    source.indexOf('\n  const isCorrect = submitted', emptyStart),
  );
  const recovery = source.slice(
    source.indexOf('const showAllQuestions'),
    controlsStart,
  );
  const controls = source.slice(controlsStart, emptyStart);

  assert.ok(controlsStart > 0 && controlsStart < emptyStart);
  assert.match(emptyBranch, /\{controls\}/);
  assert.match(emptyBranch, /mode === 'bookmarks'/);
  assert.match(emptyBranch, /mode === 'due'/);
  assert.match(emptyBranch, /No questions match your filters/);
  assert.match(emptyBranch, /onBrowseAll=\{showAllQuestions\}/);

  assert.match(controls, /value=\{mode\}/);
  assert.match(controls, /value=\{sectionFilter\}/);
  assert.match(controls, /value=\{domainFilter\}/);
  assert.match(controls, /value=\{difficultyFilter\}/);
  assert.match(recovery, /setMode\('browse'\)/);
  assert.equal((recovery.match(/Filter\('all'\)/g) ?? []).length, 3);
});
