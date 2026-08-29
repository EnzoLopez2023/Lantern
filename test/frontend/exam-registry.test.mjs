import assert from 'node:assert/strict';
import test from 'node:test';
import { EXAMS } from '../../src/ExamPrepHub/exams.ts';

test('preserves the fourteen pinned study tracks and internal IDs', () => {
  assert.deepEqual(
    EXAMS.map(exam => exam.id),
    [
      'USHC',
      'ALG1',
      'ENG2',
      'BIO1',
      'SCPERMIT',
      'SAT',
      'ENG3',
      'ALG2',
      'PRECALC',
      'PROBSTAT',
      'CHEM',
      'PHYS',
      'ENVSCI',
      'PFIN',
    ],
  );
});
