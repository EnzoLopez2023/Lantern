import assert from 'node:assert/strict';
import test from 'node:test';
import {
  decodeStateTransportValue,
  serializeStateMutationRequest,
} from '../../src/app/storage/payloadBounds.ts';
import { stateMutationPayload } from '../../src/app/api/stateMutationPayload.ts';
import {
  enqueueMutation,
  readDeadLetters,
  replayMutationQueue,
} from '../../src/app/storage/mutationQueue.ts';

const bytes = value => new TextEncoder().encode(value).byteLength;

test('normal put and delete serialization remains exact', () => {
  const put = serializeStateMutationRequest(
    'mutation-normal',
    7,
    'exam-prep-notes:SAT:q1',
    'unchanged',
    false,
  );
  assert.equal(put, JSON.stringify(
    stateMutationPayload('mutation-normal', 7, 'unchanged', false),
  ));

  const remove = serializeStateMutationRequest(
    'mutation-delete',
    8,
    'exam-prep-notes:SAT:q1',
    null,
    true,
  );
  assert.equal(remove, JSON.stringify(
    stateMutationPayload('mutation-delete', 8, null, true),
  ));
});

test('escape-heavy analytics fits the final serialized request envelope', () => {
  const attempts = Array.from({ length: 40 }, (_, index) => ({
    id: `attempt-${index}`,
    detail: `quote:" slash:\\ newline:\n ${index}`.repeat(300),
  }));
  const original = JSON.stringify(attempts);
  const body = serializeStateMutationRequest(
    'mutation-escape-heavy',
    12,
    'exam-prep-analytics:SAT',
    original,
    false,
  );
  const envelope = JSON.parse(body);

  assert.ok(bytes(body) <= 24_000);
  assert.ok(JSON.parse(envelope.value).length < attempts.length);
  assert.notEqual(envelope.value, original);
});

test('PHYS drill statistics compact losslessly under the request limit', () => {
  const key = 'exam-prep-drill-stats:PHYS';
  const stats = Object.fromEntries(Array.from({ length: 153 }, (_, index) => {
    const questionId = `phys-question-${String(index + 1).padStart(3, '0')}`;
    return [questionId, {
      questionId,
      attempts: 37 + index,
      correct: 19 + (index % 18),
      lastResult: index % 3 === 0 ? 'wrong' : 'correct',
      lastConfidence: ['guess', 'unsure', 'confident'][index % 3],
      lastSeenAt: 1_777_777_777_000 + index,
      interval: (index % 60) + 1,
      ease: 0.1 + (index % 10) / 10,
      repetitions: index % 12,
      nextReviewAt: 1_777_777_777_000 + index * 86_400_000,
    }];
  }));
  const original = JSON.stringify(stats);
  assert.ok(bytes(JSON.stringify({
    mutationId: 'phys-stats',
    expectedRevision: 4,
    value: original,
  })) > 24_000);

  const body = serializeStateMutationRequest(
    'phys-stats',
    4,
    key,
    original,
    false,
  );
  const transported = JSON.parse(body).value;
  const hydrated = decodeStateTransportValue(key, transported);

  assert.ok(bytes(body) <= 24_000);
  assert.deepEqual(JSON.parse(hydrated), stats);
});

test('largest production flashcard deck stats compact losslessly under the request limit', () => {
  const key = 'exam-prep-flashcard-stats:SAT';
  const stats = Object.fromEntries(Array.from({ length: 100 }, (_, index) => {
    const cardId = `sat-flashcard-${String(index + 1).padStart(3, '0')}`;
    return [cardId, {
      cardId,
      reviews: 100 + index,
      interval: (index % 60) + 1,
      ease: 0.1 + (index % 10) / 10,
      nextReviewAt: 1_888_888_888_000 + index * 86_400_000,
      lastReviewedAt: 1_777_777_777_000 + index,
    }];
  }));
  const original = JSON.stringify(stats);
  const body = serializeStateMutationRequest(
    'sat-flashcard-stats',
    9,
    key,
    original,
    false,
  );
  const transported = JSON.parse(body).value;

  assert.ok(bytes(body) <= 24_000);
  assert.deepEqual(JSON.parse(decodeStateTransportValue(key, transported)), stats);
});

test('malformed stats are not compacted into a lossy representation', () => {
  const malformed = JSON.stringify({
    q1: {
      questionId: 'q1',
      attempts: 2,
      correct: 1,
      lastResult: 'correct',
      lastConfidence: 'confident',
      // lastSeenAt is required production state and intentionally missing.
    },
  });
  const body = serializeStateMutationRequest(
    'malformed-stats',
    0,
    'exam-prep-drill-stats:PHYS',
    malformed,
    false,
  );

  assert.equal(JSON.parse(body).value, malformed);
});

test('irreducible oversized state is a permanent 413 before fetch and later entries continue', async () => {
  const storage = new class {
    values = new Map();
    get length() { return this.values.size; }
    getItem(key) { return this.values.get(key) ?? null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    key(index) { return [...this.values.keys()][index] ?? null; }
    removeItem(key) { this.values.delete(key); }
  }();
  const identity = { tenant: 'tenant-a', oid: 'user-a' };
  enqueueMutation(storage, {
    id: 'oversized-note',
    kind: 'notes',
    key: 'exam-prep-notes:SAT:q1',
    value: 'x'.repeat(30_000),
    identity,
    baseRevision: 0,
    enqueuedAt: 1,
    attempts: 0,
  });
  enqueueMutation(storage, {
    id: 'later-progress',
    kind: 'progress',
    key: 'exam-prep-quiz:SAT',
    value: 'complete',
    identity,
    baseRevision: 0,
    enqueuedAt: 2,
    attempts: 0,
  });
  const fetched = [];

  const result = await replayMutationQueue(
    storage,
    identity,
    async mutation => {
      const body = serializeStateMutationRequest(
        mutation.id,
        mutation.baseRevision,
        mutation.key,
        mutation.value,
        mutation.value === null,
      );
      fetched.push([mutation.id, body]);
      return { revision: 1 };
    },
    error => error?.status === 413,
  );

  assert.deepEqual(fetched.map(([id]) => id), ['later-progress']);
  assert.equal(result.deadLettered, 1);
  assert.equal(readDeadLetters(storage, identity)[0].id, 'oversized-note');
});
