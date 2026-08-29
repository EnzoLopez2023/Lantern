// Flashcards tab — concept cards with SM-2 spacing. Rate each card
// (forgot / almost / got it) to update the review interval.

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  Refresh as ResetIcon,
  Shuffle as ShuffleIcon,
  School as DeckIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { flashcards, type Flashcard } from './flashcardDeck';
import {
  loadFlashcardStats,
  saveFlashcardStats,
  recordFlashcardRating,
  buildFlashcardDueQueue,
  countDueFlashcards,
  type FlashcardRating,
} from '../../shared/flashcardStats';

const EXAM_ID = 'PHYS';

type Mode = 'all' | 'due';

const RATINGS: { id: FlashcardRating; label: string; emoji: string; tone: 'bad' | 'warn' | 'good' }[] = [
  { id: 'forgot',  label: 'Forgot',   emoji: '❌', tone: 'bad' },
  { id: 'almost',  label: 'Almost',   emoji: '🤔', tone: 'warn' },
  { id: 'got-it',  label: 'Got it',   emoji: '✅', tone: 'good' },
];

export default function Flashcards() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT   = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG  = isDark ? '#2E2F38' : '#FBF5E6';
  const SURFACE  = isDark ? '#1E0F06' : '#FBF7F2';
  const BORDER   = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const GOOD     = isDark ? '#7BAF85' : '#3C6E4B';
  const WARN     = isDark ? '#E2B26B' : '#B08139';
  const BAD      = isDark ? '#D88366' : '#C75A2D';

  const [stats, setStats] = useState(() => loadFlashcardStats(EXAM_ID));
  const [mode, setMode] = useState<Mode>('all');
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const fresh = loadFlashcardStats(EXAM_ID);
    let next: Flashcard[];
    if (mode === 'due') {
      next = buildFlashcardDueQueue(flashcards, fresh);
    } else {
      next = [...flashcards].sort(() => Math.random() - 0.5);
    }
    setQueue(next);
    setIndex(0);
    setFlipped(false);
  }, [mode]);

  const shuffleDeck = () => {
    setQueue(prev => [...prev].sort(() => Math.random() - 0.5));
    setIndex(0);
    setFlipped(false);
  };

  const reset = () => {
    setIndex(0);
    setFlipped(false);
  };

  const current = queue[index];

  const dueCount = useMemo(() => countDueFlashcards(flashcards, stats), [stats]);

  const reviewedCards = Object.values(stats).filter(s => s.reviews > 0).length;
  const masteredCards = Object.values(stats).filter(s => (s.interval ?? 0) >= 14).length;

  const handleRate = (rating: FlashcardRating) => {
    if (!current) return;
    const next = recordFlashcardRating(stats, current.id, rating);
    setStats(next);
    saveFlashcardStats(EXAM_ID, next);
    if (index < queue.length - 1) {
      setIndex(i => i + 1);
      setFlipped(false);
    } else {
      setIndex(queue.length);
      setFlipped(false);
    }
  };

  if (queue.length === 0) {
    return (
      <Box sx={{ pb: 6 }}>
        <Paper elevation={0} sx={{ p: 4, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, textAlign: 'center' }}>
          <Typography sx={{ color: TEXT_SEC }}>
            {mode === 'due'
              ? '🎉 Nothing due right now. Come back later or switch to "All cards".'
              : 'No flashcards yet.'}
          </Typography>
          {mode === 'due' && (
            <Button sx={{ mt: 2, color: ACCENT, textTransform: 'none' }} onClick={() => setMode('all')}>
              Browse all cards
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  if (index >= queue.length) {
    return (
      <Box sx={{ pb: 6 }}>
        <Paper elevation={0} sx={{ p: 4, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 1 }}>
            🎉 Deck complete
          </Typography>
          <Typography sx={{ color: TEXT_SEC, mb: 3 }}>
            You reviewed {queue.length} cards. Cards you marked "Got it" will return less frequently. Cards you marked "Forgot" will come back tomorrow.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
            <Button variant="contained" startIcon={<ResetIcon />} onClick={reset}
              sx={{ backgroundColor: ACCENT, '&:hover': { backgroundColor: ACCENT, opacity: 0.9 } }}>
              Restart deck
            </Button>
            <Button variant="outlined" onClick={() => setMode(mode === 'all' ? 'due' : 'all')}
              sx={{ borderColor: BORDER, color: TEXT_PRI }}>
              {mode === 'all' ? 'Switch to due-only' : 'Switch to all cards'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Chip icon={<DeckIcon fontSize="small" />} label={`All cards (${flashcards.length})`}
              onClick={() => setMode('all')} variant={mode === 'all' ? 'filled' : 'outlined'}
              sx={mode === 'all' ? { backgroundColor: ACCENT, color: '#fff', fontWeight: 700 } : { borderColor: BORDER, color: TEXT_PRI }} />
            <Chip label={`Due now (${dueCount})`} onClick={() => setMode('due')} variant={mode === 'due' ? 'filled' : 'outlined'}
              sx={mode === 'due' ? { backgroundColor: ACCENT, color: '#fff', fontWeight: 700 } : { borderColor: BORDER, color: TEXT_PRI }} />
            <Chip icon={<ShuffleIcon fontSize="small" />} label="Shuffle" onClick={shuffleDeck} variant="outlined"
              sx={{ borderColor: BORDER, color: TEXT_SEC }} />
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip size="small" label={`${reviewedCards}/${flashcards.length} seen`} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
            {masteredCards > 0 && (
              <Chip size="small" label={`${masteredCards} mastered`} sx={{ backgroundColor: alpha(GOOD, 0.18), color: GOOD, fontWeight: 700 }} />
            )}
          </Stack>
        </Stack>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: TEXT_SEC }}>Card {index + 1} of {queue.length}</Typography>
          <Typography variant="caption" sx={{ color: TEXT_SEC }}>{current.topic}</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={((index + 1) / queue.length) * 100}
          sx={{ height: 6, borderRadius: 2, backgroundColor: alpha(ACCENT, 0.15), '& .MuiLinearProgress-bar': { backgroundColor: ACCENT } }} />
      </Box>

      <Paper elevation={0} onClick={() => setFlipped(f => !f)}
        sx={{
          p: { xs: 3, md: 5 }, minHeight: { xs: 240, md: 320 },
          backgroundColor: flipped ? SURFACE : CARD_BG,
          border: `1px solid ${flipped ? alpha(ACCENT, 0.5) : BORDER}`,
          borderRadius: 2, cursor: 'pointer', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          transition: 'border-color 0.18s, background-color 0.18s',
          '&:hover': { borderColor: ACCENT },
        }}
      >
        <Chip size="small" label={flipped ? 'ANSWER' : 'QUESTION'}
          sx={{ mb: 2, backgroundColor: flipped ? alpha(ACCENT, 0.18) : alpha(ACCENT, 0.1), color: ACCENT, fontWeight: 800, letterSpacing: 1, fontSize: '0.65rem' }} />
        <Typography sx={{
          fontFamily: 'var(--hearth-heading)',
          fontSize: { xs: '1.2rem', md: '1.4rem' },
          fontWeight: flipped ? 600 : 700, color: TEXT_PRI, lineHeight: 1.5, maxWidth: 700,
        }}>
          {flipped ? current.back : current.front}
        </Typography>
        <Typography variant="caption" sx={{ color: TEXT_SEC, mt: 3, fontSize: '0.78rem' }}>
          (Click anywhere on the card to {flipped ? 'see the question' : 'reveal the answer'})
        </Typography>
      </Paper>

      {flipped && (
        <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {RATINGS.map(r => {
            const color = r.tone === 'good' ? GOOD : r.tone === 'warn' ? WARN : BAD;
            return (
              <Button key={r.id} variant="outlined"
                onClick={(e) => { e.stopPropagation(); handleRate(r.id); }}
                sx={{ borderColor: color, color, fontWeight: 700, textTransform: 'none', minWidth: 130, '&:hover': { backgroundColor: alpha(color, 0.08), borderColor: color } }}>
                {r.emoji} {r.label}
              </Button>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
