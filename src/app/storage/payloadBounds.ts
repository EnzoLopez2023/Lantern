export const boundSyncPayload = (
  key: string,
  value: string | null,
  maxBytes = 24_000,
): string | null => {
  if (value === null || !key.startsWith('exam-prep-analytics:')) return value;
  try {
    const attempts: unknown = JSON.parse(value);
    if (!Array.isArray(attempts)) return value;
    const bounded = [...attempts];
    const size = () => new TextEncoder().encode(JSON.stringify(bounded)).byteLength;
    while (bounded.length > 1 && size() > maxBytes) bounded.pop();

    if (bounded.length === 1 && size() > maxBytes) {
      const attempt = bounded[0];
      if (attempt && typeof attempt === 'object' && !Array.isArray(attempt)) {
        const compact = { ...attempt } as Record<string, unknown>;
        if (Array.isArray(compact.perQuestion)) {
          const questions = compact.perQuestion;
          bounded[0] = compact;
          let lower = 0;
          let upper = questions.length;
          while (lower < upper) {
            const candidate = Math.ceil((lower + upper) / 2);
            compact.perQuestion = questions.slice(0, candidate);
            if (size() <= maxBytes) lower = candidate;
            else upper = candidate - 1;
          }
          compact.perQuestion = questions.slice(0, lower);
        }
      }
    }

    const serialized = JSON.stringify(bounded);
    return new TextEncoder().encode(serialized).byteLength <= maxBytes ? serialized : '[]';
  } catch {
    return value;
  }
};

export class StateMutationPayloadTooLargeError extends Error {
  readonly status = 413;

  constructor() {
    super('User-state request exceeds the 24KB transport limit.');
    this.name = 'StateMutationPayloadTooLargeError';
  }
}

const serializedMutation = (
  mutationId: string,
  expectedRevision: number,
  value: string | null,
  deleting: boolean,
): string => JSON.stringify({
  mutationId,
  expectedRevision,
  ...(deleting ? {} : { value }),
});

const byteLength = (value: string): number =>
  new TextEncoder().encode(value).byteLength;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isOptionalNumber = (value: unknown): boolean =>
  value === undefined || isFiniteNumber(value);

const isDrillStat = (stat: Record<string, unknown>): boolean =>
  typeof stat.questionId === 'string'
  && isFiniteNumber(stat.attempts)
  && isFiniteNumber(stat.correct)
  && (stat.lastResult === 'correct' || stat.lastResult === 'wrong' || stat.lastResult === null)
  && (
    stat.lastConfidence === 'guess'
    || stat.lastConfidence === 'unsure'
    || stat.lastConfidence === 'confident'
    || stat.lastConfidence === null
  )
  && isFiniteNumber(stat.lastSeenAt)
  && isOptionalNumber(stat.interval)
  && isOptionalNumber(stat.ease)
  && isOptionalNumber(stat.repetitions)
  && isOptionalNumber(stat.nextReviewAt);

const isFlashcardStat = (stat: Record<string, unknown>): boolean =>
  typeof stat.cardId === 'string'
  && isFiniteNumber(stat.reviews)
  && isFiniteNumber(stat.interval)
  && isFiniteNumber(stat.ease)
  && isFiniteNumber(stat.nextReviewAt)
  && isFiniteNumber(stat.lastReviewedAt);

const compactStateMap = (
  key: string,
  value: string,
): string => {
  const drill = key.startsWith('exam-prep-drill-stats:');
  const flashcards = key.startsWith('exam-prep-flashcard-stats:');
  if (!drill && !flashcards) return value;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return value;
    const allowed = drill
      ? new Set([
          'questionId', 'attempts', 'correct', 'lastResult', 'lastConfidence',
          'lastSeenAt', 'interval', 'ease', 'repetitions', 'nextReviewAt',
        ])
      : new Set([
          'cardId', 'reviews', 'interval', 'ease', 'nextReviewAt', 'lastReviewedAt',
        ]);
    const entries: unknown[][] = [];
    for (const [entryKey, raw] of Object.entries(parsed)) {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return value;
      const stat = raw as Record<string, unknown>;
      if (Object.keys(stat).some(field => !allowed.has(field))) return value;
      if (drill ? !isDrillStat(stat) : !isFlashcardStat(stat)) return value;
      entries.push(drill
        ? [
            entryKey, stat.questionId, stat.attempts, stat.correct, stat.lastResult,
            stat.lastConfidence, stat.lastSeenAt, stat.interval ?? null,
            stat.ease ?? null, stat.repetitions ?? null, stat.nextReviewAt ?? null,
          ]
        : [
            entryKey, stat.cardId, stat.reviews, stat.interval, stat.ease,
            stat.nextReviewAt, stat.lastReviewedAt,
          ]);
    }
    return JSON.stringify({ $: drill ? 'd1' : 'f1', e: entries });
  } catch {
    return value;
  }
};

export const decodeStateTransportValue = (
  key: string,
  value: string,
): string => {
  const drill = key.startsWith('exam-prep-drill-stats:');
  const flashcards = key.startsWith('exam-prep-flashcard-stats:');
  if (!drill && !flashcards) return value;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return value;
    const compact = parsed as { $?: unknown; e?: unknown };
    if (
      !Array.isArray(compact.e)
      || (drill ? compact.$ !== 'd1' : compact.$ !== 'f1')
    ) return value;
    const expanded: Record<string, Record<string, unknown>> = {};
    for (const entry of compact.e) {
      if (!Array.isArray(entry) || typeof entry[0] !== 'string') return value;
      if (drill && entry.length === 11) {
        const stat: Record<string, unknown> = {
          questionId: entry[1],
          attempts: entry[2],
          correct: entry[3],
          lastResult: entry[4],
          lastConfidence: entry[5],
          lastSeenAt: entry[6],
        };
        if (entry[7] !== null) stat.interval = entry[7];
        if (entry[8] !== null) stat.ease = entry[8];
        if (entry[9] !== null) stat.repetitions = entry[9];
        if (entry[10] !== null) stat.nextReviewAt = entry[10];
        expanded[entry[0]] = stat;
      } else if (flashcards && entry.length === 7) {
        expanded[entry[0]] = {
          cardId: entry[1],
          reviews: entry[2],
          interval: entry[3],
          ease: entry[4],
          nextReviewAt: entry[5],
          lastReviewedAt: entry[6],
        };
      } else {
        return value;
      }
    }
    return JSON.stringify(expanded);
  } catch {
    return value;
  }
};

export const serializeStateMutationRequest = (
  mutationId: string,
  expectedRevision: number,
  key: string,
  value: string | null,
  deleting: boolean,
  maxBytes = 24_000,
): string => {
  const transportValue = value === null ? null : compactStateMap(key, value);
  const exact = serializedMutation(mutationId, expectedRevision, transportValue, deleting);
  if (byteLength(exact) <= maxBytes) return exact;
  if (deleting || transportValue === null || !key.startsWith('exam-prep-analytics:')) {
    throw new StateMutationPayloadTooLargeError();
  }

  let attempts: unknown;
  try {
    attempts = JSON.parse(transportValue);
  } catch {
    throw new StateMutationPayloadTooLargeError();
  }
  if (!Array.isArray(attempts)) throw new StateMutationPayloadTooLargeError();

  const bounded = [...attempts];
  const body = (): string =>
    serializedMutation(mutationId, expectedRevision, JSON.stringify(bounded), false);
  while (bounded.length > 1 && byteLength(body()) > maxBytes) bounded.pop();

  if (bounded.length === 1 && byteLength(body()) > maxBytes) {
    const attempt = bounded[0];
    if (attempt && typeof attempt === 'object' && !Array.isArray(attempt)) {
      const compact = { ...attempt } as Record<string, unknown>;
      if (Array.isArray(compact.perQuestion)) {
        const questions = compact.perQuestion;
        bounded[0] = compact;
        let lower = 0;
        let upper = questions.length;
        while (lower < upper) {
          const candidate = Math.ceil((lower + upper) / 2);
          compact.perQuestion = questions.slice(0, candidate);
          if (byteLength(body()) <= maxBytes) lower = candidate;
          else upper = candidate - 1;
        }
        compact.perQuestion = questions.slice(0, lower);
      }
    }
  }

  if (byteLength(body()) > maxBytes) bounded.splice(0);
  const boundedBody = body();
  if (byteLength(boundedBody) > maxBytes) throw new StateMutationPayloadTooLargeError();
  return boundedBody;
};
