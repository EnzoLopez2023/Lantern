import type { StateCursor } from './pagination';

export const statePageQuery = (cursor: StateCursor | null, limit: number): string => {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor) query.set('cursor', cursor);
  return query.toString();
};
