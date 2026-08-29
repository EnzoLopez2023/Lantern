import type { StateCursor } from './pagination';

export interface StateCursorResponse {
  nextCursor?: StateCursor | null;
  cursor?: StateCursor | null;
}

export const resolveNextStateCursor = (
  response: StateCursorResponse,
): StateCursor | null | undefined =>
  Object.hasOwn(response, 'nextCursor') ? response.nextCursor : response.cursor;
