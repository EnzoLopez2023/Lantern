import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../app/api/apiFetch';
import { reportStorageSyncFailure, scopedStorage } from '../app/storage/scopedStorage';
import {
  cleanupTTSGenerationResources,
  cleanupTTSResources,
  consumePrefetchedTTSUrl,
  getTTSSectionDisposition,
  shouldAcceptTTSPrefetch,
  shouldIgnorePlaybackFailure,
} from './ttsCleanup';
import { nextTTSChunkCursor, splitTTSChunks } from './ttsChunks';

export type TTSState = 'idle' | 'loading' | 'playing' | 'paused';

interface TTSSection {
  id: string;
  title: string;
  chunks: string[];
}

export interface SavedPosition {
  sectionIndex: number;
  sentenceIndex: number; // always 0 with Azure TTS; kept for API compat
  title: string;
  timestamp: number;
}

export interface AzureVoice {
  name: string;
  label: string;
}

export const AZURE_VOICES: AzureVoice[] = [
  { name: 'en-US-JennyNeural',   label: 'Jenny (US)' },
  { name: 'en-US-AriaNeural',    label: 'Aria (US)' },
  { name: 'en-US-SaraNeural',    label: 'Sara (US)' },
  { name: 'en-US-NancyNeural',   label: 'Nancy (US)' },
  { name: 'en-US-DavisNeural',   label: 'Davis (US)' },
  { name: 'en-US-GuyNeural',     label: 'Guy (US)' },
  { name: 'en-US-TonyNeural',    label: 'Tony (US)' },
  { name: 'en-GB-SoniaNeural',   label: 'Sonia (UK)' },
  { name: 'en-GB-RyanNeural',    label: 'Ryan (UK)' },
  { name: 'en-AU-NatashaNeural', label: 'Natasha (AU)' },
];

const DEFAULT_VOICE = AZURE_VOICES[0].name;
const progressKey = (guideId: string) => `kb-tts-progress:${guideId}`;

export interface GuideTTSHandle {
  ttsState: TTSState;
  sectionIndex: number;
  sectionCount: number;
  sections: { id: string; title: string }[];
  savedPosition: SavedPosition | null;
  voices: AzureVoice[];
  selectedVoice: string;
  error: string | null;
  setVoice: (name: string) => void;
  play: () => void;
  playFrom: (secIdx: number) => void;
  resume: () => void;
  clearSaved: () => void;
  pause: () => void;
  stop: () => void;
}

// ── Server-side persistence ────────────────────────────────────────────────────

async function loadSaved(guideId: string): Promise<SavedPosition | null> {
  const key = progressKey(guideId);
  const cached = scopedStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached) as SavedPosition;
    } catch (error) {
      reportStorageSyncFailure(error);
      scopedStorage.removeItem(key);
    }
  }

  return null;
}

function saveToDisk(guideId: string, pos: SavedPosition) {
  scopedStorage.setItem(progressKey(guideId), JSON.stringify(pos));
}

function clearFromDisk(guideId: string) {
  scopedStorage.removeItem(progressKey(guideId));
}

// ── Azure TTS fetch ────────────────────────────────────────────────────────────

async function fetchAudio(text: string, voice: string): Promise<string> {
  try {
    const res = await apiFetch('/api/tts/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });
    if (!res.ok) throw new Error(`Speech synthesis failed (${res.status}).`);
    return URL.createObjectURL(await res.blob());
  } catch (error) {
    throw error instanceof Error ? error : new Error('Speech synthesis failed.');
  }
}

// ── DOM section extraction ─────────────────────────────────────────────────────

function extractSections(): TTSSection[] {
  const els = document.querySelectorAll<HTMLElement>('.kb-warm-guide section.section');
  return Array.from(els).map(el => {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('pre, button.copy-btn, .section-num, .mermaid').forEach(n => n.remove());
    const h2 = el.querySelector('h2');
    const title = h2?.textContent?.replace(/^\d+/, '').trim() ?? el.id;
    const text = (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
    return { id: el.id, title, chunks: splitTTSChunks(text) };
  });
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useGuideTTS(active: string | null): GuideTTSHandle {
  const [ttsState, setTTSState]       = useState<TTSState>('idle');
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE);
  const [sectionIndex, setSectionIndex]   = useState(0);
  const [sections, setSections]           = useState<{ id: string; title: string }[]>([]);
  const [savedPosition, setSavedPosition] = useState<SavedPosition | null>(null);
  const [ttsError, setTTSError] = useState<string | null>(null);

  const sectionsRef  = useRef<TTSSection[]>([]);
  const secIdxRef    = useRef(0);
  const chunkIdxRef  = useRef(0);
  const stateRef     = useRef<TTSState>('idle');
  const voiceRef     = useRef(DEFAULT_VOICE);
  const cancelledRef = useRef(false);
  const generationRef = useRef(0);
  const voiceVersionRef = useRef(0);
  const activeRef    = useRef<string | null>(null);

  // Audio element + blob URL management
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef  = useRef<string | null>(null);
  const prefetchRef = useRef<{
    secIdx: number;
    chunkIdx: number;
    voiceVersion: number;
    generation: number;
    url: string;
  } | null>(null);

  // ── Teardown current audio ────────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  const cleanupSession = useCallback(() => {
    cancelledRef.current = true;
    generationRef.current += 1;
    cleanupTTSResources(
      audioRef.current,
      [blobUrlRef.current, prefetchRef.current?.url],
      url => URL.revokeObjectURL(url),
      () => document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading')),
    );
    audioRef.current = null;
    blobUrlRef.current = null;
    prefetchRef.current = null;
    stateRef.current = 'idle';
  }, []);

  const cleanupFailedPlayback = useCallback((
    generation: number,
    expectedAudio: HTMLAudioElement | null,
    message: string,
  ) => {
    if (expectedAudio && audioRef.current !== expectedAudio) return;
    const cleaned = cleanupTTSGenerationResources(
      generation,
      generationRef.current,
      audioRef.current,
      [blobUrlRef.current, prefetchRef.current?.url],
      url => URL.revokeObjectURL(url),
      () => document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading')),
    );
    if (!cleaned) return;
    generationRef.current += 1;
    audioRef.current = null;
    blobUrlRef.current = null;
    prefetchRef.current = null;
    stateRef.current = 'idle';
    setTTSState('idle');
    setTTSError(message);
  }, []);

  // ── Reset when guide changes ──────────────────────────────────────────────────
  useEffect(() => {
    cleanupSession();
    sectionsRef.current = [];
    secIdxRef.current   = 0;
    chunkIdxRef.current = 0;
    setSectionIndex(0);
    setSections([]);
    setSavedPosition(null);
    setTTSError(null);
    stateRef.current = 'idle';
    setTTSState('idle');
    activeRef.current    = active;
    cancelledRef.current = false;
    const generation = generationRef.current;

    if (active) {
      loadSaved(active).then(saved => {
        if (generationRef.current === generation && activeRef.current === active) setSavedPosition(saved);
      });
    }
    if (!active) return;

    // Eagerly discover sections so the picker is ready before the user clicks play
    let attempts = 0;
    const tryDiscover = () => {
      if (cancelledRef.current || generationRef.current !== generation || activeRef.current !== active) return;
      const found = extractSections();
      if (found.length === 0 && attempts < 20) { attempts++; requestAnimationFrame(tryDiscover); return; }
      if (found.length > 0) {
        sectionsRef.current = found;
        setSections(found.map(s => ({ id: s.id, title: s.title })));
      }
    };
    requestAnimationFrame(tryDiscover);

    return cleanupSession;
  }, [active, cleanupSession]);

  // ── Ensure sections discovered (waits up to 20 RAF frames) ───────────────────
  const ensureSections = useCallback((): Promise<TTSSection[]> => {
    if (sectionsRef.current.length > 0) return Promise.resolve(sectionsRef.current);
    const generation = generationRef.current;
    return new Promise(resolve => {
      let attempts = 0;
      const tryDiscover = () => {
        if (cancelledRef.current || generationRef.current !== generation) {
          resolve([]);
          return;
        }
        const found = extractSections();
        if (found.length === 0 && attempts < 20) { attempts++; requestAnimationFrame(tryDiscover); return; }
        sectionsRef.current = found;
        setSections(found.map(s => ({ id: s.id, title: s.title })));
        resolve(found);
      };
      requestAnimationFrame(tryDiscover);
    });
  }, []);

  // ── Core: fetch + play one section chunk ─────────────────────────────────────
  const playSection = useCallback((secIdx: number, chunkIdx = 0): void => {
    const secs = sectionsRef.current;
    const generation = generationRef.current;
    const disposition = getTTSSectionDisposition(secs.length, secIdx);

    if (disposition === 'unavailable') {
      stateRef.current = 'idle';
      setTTSState('idle');
      return;
    }

    if (disposition === 'complete') {
      stopAudio();
      document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading'));
      if (activeRef.current) clearFromDisk(activeRef.current);
      setSavedPosition(null);
      stateRef.current = 'idle';
      setTTSState('idle');
      setSectionIndex(0);
      secIdxRef.current = 0;
      chunkIdxRef.current = 0;
      return;
    }

    const section = secs[secIdx];
    const chunkCounts = secs.map(item => item.chunks.length);
    if (chunkIdx >= section.chunks.length) {
      const next = nextTTSChunkCursor(chunkCounts, {
        sectionIndex: secIdx,
        chunkIndex: chunkIdx - 1,
      });
      if (next) playSection(next.sectionIndex, next.chunkIndex);
      else playSection(secs.length, 0);
      return;
    }
    const chunk = section.chunks[chunkIdx];

    if (chunkIdx === 0) {
      document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading'));
      const el = document.getElementById(section.id);
      if (el) { el.classList.add('tts-reading'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    secIdxRef.current = secIdx;
    chunkIdxRef.current = chunkIdx;
    setSectionIndex(secIdx);
    setTTSError(null);

    // Progress remains section-level even while its chunks advance.
    if (chunkIdx === 0 && activeRef.current) {
      const pos: SavedPosition = { sectionIndex: secIdx, sentenceIndex: 0, title: section.title, timestamp: Date.now() };
      saveToDisk(activeRef.current, pos);
      setSavedPosition(pos);
    }

    // Check prefetch cache first, otherwise fetch now (shows loading)
    const cached = consumePrefetchedTTSUrl(
      prefetchRef.current,
      secIdx,
      chunkIdx,
      voiceVersionRef.current,
      generation,
      url => URL.revokeObjectURL(url),
    );
    prefetchRef.current = null;

    const proceed = (blobUrl: string) => {
      if (
        cancelledRef.current
        || generationRef.current !== generation
        || stateRef.current === 'idle'
      ) {
        URL.revokeObjectURL(blobUrl);
        return;
      }
      stopAudio();
      const audio = new Audio(blobUrl);
      audioRef.current   = audio;
      blobUrlRef.current = blobUrl;
      stateRef.current   = 'playing';
      setTTSState('playing');

      audio.onended = () => {
        if (
          cancelledRef.current
          || generationRef.current !== generation
          || audioRef.current !== audio
          || stateRef.current !== 'playing'
        ) return;
        URL.revokeObjectURL(blobUrl);
        blobUrlRef.current = null;
        audioRef.current   = null;
        const next = nextTTSChunkCursor(chunkCounts, { sectionIndex: secIdx, chunkIndex: chunkIdx });
        if (next) playSection(next.sectionIndex, next.chunkIndex);
        else playSection(secs.length, 0);
      };
      audio.onerror = () => {
        cleanupFailedPlayback(
          generation,
          audio,
          `Read aloud stopped in “${section.title}”. Retry to continue.`,
        );
      };
      audio.play().catch(error => {
        if (shouldIgnorePlaybackFailure(stateRef.current, error)) return;
        cleanupFailedPlayback(
          generation,
          audio,
          `Read aloud stopped in “${section.title}”: ${error instanceof Error ? error.message : 'playback failed'}.`,
        );
      });

      // Prefetch the exact next chunk while the current chunk plays.
      const next = nextTTSChunkCursor(chunkCounts, { sectionIndex: secIdx, chunkIndex: chunkIdx });
      if (next) {
        const voiceVersion = voiceVersionRef.current;
        const nextText = secs[next.sectionIndex].chunks[next.chunkIndex];
        fetchAudio(nextText, voiceRef.current).then(url => {
          if (
            cancelledRef.current
            || !shouldAcceptTTSPrefetch(
              generation,
              generationRef.current,
              voiceVersion,
              voiceVersionRef.current,
            )
          ) {
            URL.revokeObjectURL(url);
            return;
          }
          if (secIdxRef.current === secIdx && chunkIdxRef.current === chunkIdx) {
            if (prefetchRef.current) URL.revokeObjectURL(prefetchRef.current.url);
            prefetchRef.current = {
              secIdx: next.sectionIndex,
              chunkIdx: next.chunkIndex,
              voiceVersion,
              generation,
              url,
            };
          } else URL.revokeObjectURL(url);
        }).catch(() => {
          // Prefetch is opportunistic; the foreground request reports failures.
        });
      }
    };

    if (cached) {
      proceed(cached);
    } else {
      if (stateRef.current !== 'loading') { stateRef.current = 'loading'; setTTSState('loading'); }
      const voiceVersion = voiceVersionRef.current;
      fetchAudio(chunk, voiceRef.current).then(url => {
        if (generationRef.current !== generation || cancelledRef.current) {
          URL.revokeObjectURL(url);
          return;
        }
        if (voiceVersionRef.current !== voiceVersion) {
          URL.revokeObjectURL(url);
          playSection(secIdx, chunkIdx);
          return;
        }
        proceed(url);
      }).catch(error => {
        if (generationRef.current !== generation || cancelledRef.current) return;
        stateRef.current = 'idle';
        setTTSState('idle');
        setTTSError(`Read aloud stopped in “${section.title}”: ${error instanceof Error ? error.message : 'speech synthesis failed'}.`);
      });
    }
  }, [cleanupFailedPlayback, stopAudio]);

  // ── Public API ─────────────────────────────────────────────────────────────────
  const play = useCallback((): void => {
    if (stateRef.current === 'idle') {
      stateRef.current = 'loading';
      setTTSState('loading');
      ensureSections().then(() => {
        if (cancelledRef.current) return;
        secIdxRef.current = 0;
        playSection(0);
      });
    } else if (stateRef.current === 'paused') {
      const generation = generationRef.current;
      const audio = audioRef.current;
      stateRef.current = 'playing';
      setTTSState('playing');
      audio?.play().catch(error => {
        if (shouldIgnorePlaybackFailure(stateRef.current, error)) return;
        cleanupFailedPlayback(
          generation,
          audio,
          `Read aloud stopped: ${error instanceof Error ? error.message : 'playback failed'}.`,
        );
      });
    }
  }, [cleanupFailedPlayback, ensureSections, playSection]);

  const playFrom = useCallback((secIdx: number): void => {
    generationRef.current += 1;
    cancelledRef.current = false;
    stopAudio();
    document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading'));
    if (prefetchRef.current) { URL.revokeObjectURL(prefetchRef.current.url); prefetchRef.current = null; }
    stateRef.current = 'loading';
    setTTSState('loading');
    setTTSError(null);
    ensureSections().then(() => {
      if (cancelledRef.current) return;
      secIdxRef.current = secIdx;
      chunkIdxRef.current = 0;
      playSection(secIdx, 0);
    });
  }, [stopAudio, ensureSections, playSection]);

  const resume = useCallback((): void => {
    const saved = savedPosition;
    if (!saved) { play(); return; }
    playFrom(saved.sectionIndex);
  }, [savedPosition, play, playFrom]);

  const clearSaved = useCallback((): void => {
    if (activeRef.current) clearFromDisk(activeRef.current);
    setSavedPosition(null);
  }, []);

  const pause = useCallback((): void => {
    if (stateRef.current !== 'playing') return;
    stateRef.current = 'paused';
    setTTSState('paused');
    audioRef.current?.pause();
  }, []);

  const stop = useCallback((): void => {
    generationRef.current += 1;
    stopAudio();
    if (prefetchRef.current) { URL.revokeObjectURL(prefetchRef.current.url); prefetchRef.current = null; }
    document.querySelectorAll('.tts-reading').forEach(el => el.classList.remove('tts-reading'));
    cancelledRef.current = false; // allow play() to work again after stop
    stateRef.current     = 'idle';
    setTTSState('idle');
    secIdxRef.current = 0;
    chunkIdxRef.current = 0;
    setSectionIndex(0);
    setTTSError(null);
  }, [stopAudio]);

  const setVoice = useCallback((name: string): void => {
    voiceVersionRef.current += 1;
    voiceRef.current = name;
    setSelectedVoice(name);
    // Discard any prefetch cached with the old voice
    if (prefetchRef.current) { URL.revokeObjectURL(prefetchRef.current.url); prefetchRef.current = null; }
  }, []);

  return {
    ttsState,
    sectionIndex,
    sectionCount: sectionsRef.current.length,
    sections,
    savedPosition,
    voices: AZURE_VOICES,
    selectedVoice,
    error: ttsError,
    setVoice,
    play,
    playFrom,
    resume,
    clearSaved,
    pause,
    stop,
  };
}
