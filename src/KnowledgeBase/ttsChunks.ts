export const TTS_CHUNK_LIMIT = 9_000;

export interface TTSChunkCursor {
  sectionIndex: number;
  chunkIndex: number;
}

const lastBoundary = (text: string, pattern: RegExp): number => {
  let boundary = -1;
  for (const match of text.matchAll(pattern)) {
    boundary = (match.index ?? 0) + match[0].length;
  }
  return boundary;
};

export const splitTTSChunks = (
  text: string,
  maxLength = TTS_CHUNK_LIMIT,
): string[] => {
  if (!Number.isSafeInteger(maxLength) || maxLength < 1) {
    throw new Error('TTS chunk length must be a positive integer.');
  }
  if (text.length === 0) return [];

  const chunks: string[] = [];
  let offset = 0;
  while (offset < text.length) {
    const remaining = text.length - offset;
    if (remaining <= maxLength) {
      chunks.push(text.slice(offset));
      break;
    }

    const candidate = text.slice(offset, offset + maxLength);
    const splitAt = [
      lastBoundary(candidate, /\n[^\S\n]*\n+/g),
      lastBoundary(candidate, /[.!?](?:["')\]]*)\s+/g),
      lastBoundary(candidate, /\s+/g),
    ].find(boundary => boundary > 0) ?? maxLength;
    chunks.push(text.slice(offset, offset + splitAt));
    offset += splitAt;
  }
  return chunks;
};

export const nextTTSChunkCursor = (
  chunkCounts: number[],
  current: TTSChunkCursor | null,
): TTSChunkCursor | null => {
  let sectionIndex = current?.sectionIndex ?? 0;
  let chunkIndex = current ? current.chunkIndex + 1 : 0;
  while (sectionIndex < chunkCounts.length) {
    if (chunkIndex < chunkCounts[sectionIndex]) return { sectionIndex, chunkIndex };
    sectionIndex += 1;
    chunkIndex = 0;
  }
  return null;
};
