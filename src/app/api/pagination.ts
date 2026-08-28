export type StateCursor = string;

export interface StatePage<T> {
  resources: T[];
  nextCursor?: StateCursor | null;
}

export const collectStatePages = async <T>(
  fetchPage: (cursor: StateCursor | null, limit: number) => Promise<StatePage<T>>,
  pageSize = 500,
  maxPages = 200,
): Promise<T[]> => {
  const records: T[] = [];
  const seenCursors = new Set<string>();
  let cursor: StateCursor | null = null;

  for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
    const page = await fetchPage(cursor, pageSize);
    records.push(...page.resources);
    if (page.resources.length === 0) return records;

    if (page.nextCursor === null) return records;
    if (page.nextCursor === undefined) {
      if (page.resources.length < pageSize) return records;
      throw new Error('User-state pagination omitted a cursor for a full page.');
    }
    if (seenCursors.has(page.nextCursor)) {
      throw new Error('User-state pagination returned a repeated cursor.');
    }
    seenCursors.add(page.nextCursor);
    cursor = page.nextCursor;
  }

  throw new Error(`User-state pagination exceeded ${maxPages} pages.`);
};
