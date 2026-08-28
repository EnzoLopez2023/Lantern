export interface ManagedTTSAudio {
  onended: unknown;
  onerror: unknown;
  pause(): void;
}

export interface PrefetchedTTSUrl {
  secIdx: number;
  chunkIdx: number;
  voiceVersion: number;
  generation: number;
  url: string;
}

export function consumePrefetchedTTSUrl(
  prefetched: PrefetchedTTSUrl | null,
  requestedSection: number,
  requestedChunk: number,
  voiceVersion: number,
  generation: number,
  revokeObjectUrl: (url: string) => void,
): string | null {
  if (!prefetched) return null;
  if (
    prefetched.secIdx === requestedSection
    && prefetched.chunkIdx === requestedChunk
    && prefetched.voiceVersion === voiceVersion
    && prefetched.generation === generation
  ) return prefetched.url;
  revokeObjectUrl(prefetched.url);
  return null;
}

export function cleanupTTSResources(
  audio: ManagedTTSAudio | null,
  blobUrls: Array<string | null | undefined>,
  revokeObjectUrl: (url: string) => void,
  clearHighlights: () => void,
): void {
  if (audio) {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
  }
  for (const url of new Set(blobUrls.filter((value): value is string => Boolean(value)))) {
    revokeObjectUrl(url);
  }
  clearHighlights();
}

export function cleanupTTSGenerationResources(
  expectedGeneration: number,
  currentGeneration: number,
  audio: ManagedTTSAudio | null,
  blobUrls: Array<string | null | undefined>,
  revokeObjectUrl: (url: string) => void,
  clearHighlights: () => void,
): boolean {
  if (expectedGeneration !== currentGeneration) return false;
  cleanupTTSResources(audio, blobUrls, revokeObjectUrl, clearHighlights);
  return true;
}

export const shouldIgnorePlaybackFailure = (
  playbackState: string,
  error: unknown,
): boolean => playbackState === 'paused'
  && Boolean(error && typeof error === 'object' && (error as { name?: unknown }).name === 'AbortError');

export const shouldAcceptTTSPrefetch = (
  requestGeneration: number,
  currentGeneration: number,
  requestVoiceVersion: number,
  currentVoiceVersion: number,
): boolean => requestGeneration === currentGeneration
  && requestVoiceVersion === currentVoiceVersion;

export type TTSSectionDisposition = 'unavailable' | 'ready' | 'complete';

export const getTTSSectionDisposition = (
  sectionCount: number,
  requestedSection: number,
): TTSSectionDisposition => {
  if (sectionCount === 0) return 'unavailable';
  return requestedSection >= sectionCount ? 'complete' : 'ready';
};
