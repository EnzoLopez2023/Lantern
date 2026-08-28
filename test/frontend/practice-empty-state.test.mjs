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
