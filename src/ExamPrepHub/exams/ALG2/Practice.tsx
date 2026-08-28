import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Refresh as ResetIcon,
  Lightbulb as TipIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  NoteAlt as NoteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { questions, type Question } from './questions';
import {
  loadStats,
  saveStats,
  recordAnswer,
  summarizeBySubdomain,
  buildWeakSpotQueue,
  buildAdaptiveQueue,
  buildDueQueue,
  countDue,
  rollingAccuracy,
  type StatsMap,
  type Confidence,
} from '../../shared/drillStats';
import {
  isDoneToday,
  loadStreak,
  recordDailyCompletion,
} from '../../shared/streak';
import { loadBookmarks, toggleBookmark } from '../../shared/bookmarks';
import { loadNote, saveNote } from '../../shared/notes';
import { IconButton, TextField } from '@mui/material';
import { PracticeEmptyState } from '../../shared/PracticeEmptyState';

type Mode = 'browse' | 'weak' | 'adaptive' | 'due' | 'daily' | 'bookmarks';
type SubdomainFilter = 'all' | string;
const EXAM_ID = 'ALG2';
const DAILY_WARMUP_COUNT = 5;

const CONFIDENCE_OPTIONS: { id: Confidence; label: string; emoji: string }[] = [
  { id: 'guess',     label: 'Guessed',   emoji: '🎲' },
  { id: 'unsure',    label: 'Unsure',    emoji: '🤔' },
  { id: 'confident', label: 'Confident', emoji: '💪' },
];

export default function Practice() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const GOOD = isDark ? '#7BAF85' : '#3C6E4B';
  const BAD = isDark ? '#D88366' : '#C75A2D';

  const [stats, setStats] = useState<StatsMap>(() => loadStats(EXAM_ID));
  const [mode, setMode] = useState<Mode>('browse');
  const [subdomain, setSubdomain] = useState<SubdomainFilter>('all');
  const [queue, setQueue] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(() => loadStreak(EXAM_ID));
  const [doneToday, setDoneToday] = useState(() => isDoneToday(EXAM_ID));
  const [dailyJustCompleted, setDailyJustCompleted] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => loadBookmarks(EXAM_ID, 'question'));
  const [noteText, setNoteText] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);

  const subdomains = useMemo(() => {
    const set = new Set<string>();
    for (const q of questions) set.add(q.subdomain);
    return [...set];
  }, []);

  // Build the queue based on mode/filter
  useEffect(() => {
    const freshStats = loadStats(EXAM_ID);
    let next: Question[];
    if (mode === 'weak') {
      next = buildWeakSpotQueue(freshStats, questions, 30);
    } else if (mode === 'adaptive') {
      next = buildAdaptiveQueue(freshStats, questions, 30);
    } else if (mode === 'due') {
      next = buildDueQueue(freshStats, questions, 30);
    } else if (mode === 'daily') {
      next = buildDueQueue(freshStats, questions, DAILY_WARMUP_COUNT);
      if (next.length < DAILY_WARMUP_COUNT) {
        const extras = buildAdaptiveQueue(freshStats, questions, DAILY_WARMUP_COUNT - next.length);
        const seen = new Set(next.map(q => q.id));
        next = [...next, ...extras.filter(q => !seen.has(q.id))].slice(0, DAILY_WARMUP_COUNT);
      }
    } else if (mode === 'bookmarks') {
      const set = loadBookmarks(EXAM_ID, 'question');
      next = questions.filter(q => set.has(q.id));
    } else if (subdomain !== 'all') {
      next = questions.filter(q => q.subdomain === subdomain);
    } else {
      next = [...questions];
    }
    setQueue(next);
    setIndex(0);
    setSelected([]);
    setConfidence(null);
    setRevealed(false);
    setDailyJustCompleted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, subdomain]);

  const current = queue[index];

  useEffect(() => {
    if (current) {
      setNoteText(loadNote(EXAM_ID, 'question', current.id));
      setNoteOpen(false);
    }
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBookmarkToggle = () => {
    if (!current) return;
    const nowOn = toggleBookmark(EXAM_ID, 'question', current.id);
    setBookmarks(prev => {
      const next = new Set(prev);
      if (nowOn) next.add(current.id);
      else next.delete(current.id);
      return next;
    });
  };

  const handleNoteSave = () => {
    if (!current) return;
    saveNote(EXAM_ID, 'question', current.id, noteText);
  };

  const isBookmarked = current ? bookmarks.has(current.id) : false;

  const isMulti = current?.type === 'multi';
  const checkCorrect = (sel: number[], q: Question): boolean => {
    if (sel.length !== q.correctAnswers.length) return false;
    return sel.every(s => q.correctAnswers.includes(s));
  };

  const toggleOption = (i: number) => {
    if (revealed || !current) return;
    if (isMulti) {
      setSelected(prev => prev.includes(i) ? prev.filter(p => p !== i) : [...prev, i]);
    } else {
      setSelected([i]);
    }
  };

  const handleReveal = () => {
    if (!current || selected.length === 0 || !confidence) return;
    const correct = checkCorrect(selected, current);
    const nextStats = recordAnswer(stats, current.id, correct, confidence);
    setStats(nextStats);
    saveStats(EXAM_ID, nextStats);
    setRevealed(true);
  };

  const handleNext = () => {
    if (index < queue.length - 1) {
      setIndex(i => i + 1);
      setSelected([]);
      setConfidence(null);
      setRevealed(false);
    } else if (mode === 'daily' && revealed && index === queue.length - 1) {
      const newStreak = recordDailyCompletion(EXAM_ID);
      setStreak(newStreak);
      setDoneToday(true);
      setDailyJustCompleted(true);
    }
  };

  const handleSkip = () => {
    if (index < queue.length - 1) {
      setIndex(i => i + 1);
      setSelected([]);
      setConfidence(null);
      setRevealed(false);
    }
  };

  const correct = current && revealed ? checkCorrect(selected, current) : null;

  const summary = useMemo(() => summarizeBySubdomain(stats, questions), [stats]);
  const overallAttempted = summary.reduce((acc, s) => acc + s.attempted, 0);
  const overallCorrect = summary.reduce((acc, s) => acc + s.correct, 0);
  const overallAcc = overallAttempted === 0 ? null : overallCorrect / overallAttempted;
  const weakestVisible = summary.filter(s => s.attempted >= 3 && s.accuracy < 0.7);
  const dueCount = useMemo(() => countDue(stats, questions), [stats]);
  const rolling = useMemo(() => rollingAccuracy(stats, 20), [stats]);

  const startDailyWarmup = () => {
    setMode('daily');
  };

  const containerSx = { pb: 6 };

  if (!current) {
    return (
      <Box sx={containerSx}>
        <PracticeEmptyState
          mode={mode}
          dueCount={dueCount}
          onModeChange={setMode}
          cardBackground={CARD_BG}
          borderColor={BORDER}
          textColor={TEXT_PRI}
          secondaryTextColor={TEXT_SEC}
          accentColor={ACCENT}
        />
      </Box>
    );
  }

  return (
    <Box sx={containerSx}>
      {/* Daily Warmup card */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: CARD_BG,
          border: `1px solid ${doneToday ? GOOD : ACCENT}`,
          borderLeft: `4px solid ${doneToday ? GOOD : ACCENT}`,
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: TEXT_PRI }}>
                {doneToday ? '✅ Daily warmup done' : '🔥 Daily Warmup'}
              </Typography>
              {streak.currentStreak > 0 && (
                <Chip
                  size="small"
                  label={`${streak.currentStreak}-day streak`}
                  sx={{ backgroundColor: `${ACCENT}22`, color: ACCENT, fontWeight: 700 }}
                />
              )}
              {streak.longestStreak > streak.currentStreak && (
                <Chip
                  size="small"
                  label={`Best: ${streak.longestStreak}`}
                  variant="outlined"
                  sx={{ borderColor: BORDER, color: TEXT_SEC }}
                />
              )}
            </Stack>
            <Typography variant="caption" sx={{ color: TEXT_SEC }}>
              {doneToday
                ? dailyJustCompleted
                  ? `Nice — see you tomorrow to keep the streak alive. Total days: ${streak.totalDays}.`
                  : `You've already done today's 5 questions. Come back tomorrow.`
                : `5 questions, sourced from your spaced-repetition due queue. Keeps the habit alive between cram sessions.`}
            </Typography>
          </Box>
          {!doneToday && (
            <Button
              variant="contained"
              onClick={startDailyWarmup}
              sx={{ backgroundColor: ACCENT, '&:hover': { backgroundColor: ACCENT, opacity: 0.9 }, fontWeight: 700, textTransform: 'none', flexShrink: 0 }}
            >
              Start today's 5 questions →
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Top meta bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
          <ModeChip id="browse" label="Browse" current={mode} setMode={setMode} accent={ACCENT} border={BORDER} text={TEXT_PRI} />
          <ModeChip id="adaptive" label={`Adaptive${rolling.n > 0 ? ` · ${(rolling.accuracy * 100).toFixed(0)}%` : ''}`} current={mode} setMode={setMode} accent={ACCENT} border={BORDER} text={TEXT_PRI} tooltip="Difficulty adjusts to your rolling accuracy" />
          <ModeChip id="weak" label="Weak spots" current={mode} setMode={setMode} accent={ACCENT} border={BORDER} text={TEXT_PRI} tooltip="Wrong answers + unattempted questions, shuffled" />
          <ModeChip
            id="due"
            label={`Due review (${dueCount})`}
            current={mode}
            setMode={setMode}
            accent={ACCENT}
            border={BORDER}
            text={TEXT_PRI}
            tooltip="Spaced repetition — questions whose next-review date has arrived"
          />
          <ModeChip
            id="bookmarks"
            label={`Bookmarks (${bookmarks.size})`}
            current={mode}
            setMode={setMode}
            accent={ACCENT}
            border={BORDER}
            text={TEXT_PRI}
            tooltip="Questions you've starred to revisit"
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            {mode === 'browse' && (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: TEXT_SEC }}>Filter by subdomain</InputLabel>
                <Select
                  value={subdomain}
                  label="Filter by subdomain"
                  onChange={(e) => setSubdomain(e.target.value)}
                  sx={{ color: TEXT_PRI, '.MuiOutlinedInput-notchedOutline': { borderColor: BORDER } }}
                >
                  <MenuItem value="all">All ({questions.length})</MenuItem>
                  {subdomains.map(sd => (
                    <MenuItem key={sd} value={sd}>{sd}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {mode === 'daily' && (
              <Chip
                size="small"
                label={`Daily warmup · ${index + 1}/${queue.length}`}
                sx={{ backgroundColor: `${ACCENT}22`, color: ACCENT, fontWeight: 700 }}
              />
            )}
          </Stack>

          {overallAcc !== null && (
            <Chip
              label={`${(overallAcc * 100).toFixed(0)}% all-time (${overallAttempted})`}
              sx={{ backgroundColor: overallAcc >= 0.75 ? `${GOOD}22` : `${BAD}22`, color: overallAcc >= 0.75 ? GOOD : BAD, fontWeight: 700 }}
            />
          )}
        </Stack>

        {weakestVisible.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" sx={{ color: TEXT_SEC, fontWeight: 600 }}>Weak areas:</Typography>
            {weakestVisible.slice(0, 4).map(s => (
              <Chip
                key={s.subdomain}
                size="small"
                label={`${s.subdomain} (${(s.accuracy * 100).toFixed(0)}%)`}
                onClick={() => { setMode('browse'); setSubdomain(s.subdomain); }}
                sx={{ borderColor: BAD, color: BAD, backgroundColor: 'transparent', border: `1px solid ${BAD}`, cursor: 'pointer' }}
              />
            ))}
          </Stack>
        )}
      </Paper>

      {/* Progress bar */}
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: TEXT_SEC }}>
            Question {index + 1} of {queue.length}
            {mode === 'weak' && <span> · weak-spot queue</span>}
            {mode === 'browse' && subdomain !== 'all' && <span> · {subdomain}</span>}
          </Typography>
          <Typography variant="caption" sx={{ color: TEXT_SEC }}>
            {current.difficulty} · {isMulti ? 'multi-select' : 'single answer'}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={((index + 1) / queue.length) * 100}
          sx={{ height: 6, borderRadius: 2, backgroundColor: `${ACCENT}22`, '& .MuiLinearProgress-bar': { backgroundColor: ACCENT } }}
        />
      </Box>

      {/* Question card */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
          <Chip size="small" label={`Domain ${current.domain}`} sx={{ backgroundColor: `${ACCENT}22`, color: ACCENT, fontWeight: 700 }} />
          <Chip size="small" label={current.subdomain} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Save for later'}>
            <IconButton size="small" onClick={handleBookmarkToggle} sx={{ color: isBookmarked ? ACCENT : TEXT_SEC }}>
              {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 600, color: TEXT_PRI, mb: 2, lineHeight: 1.45 }}>
          {current.question}
        </Typography>

        {current.codeSnippet && (
          <Box
            sx={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
              fontSize: '0.82rem',
              p: 1.5,
              mb: 2,
              borderRadius: 1.5,
              backgroundColor: isDark ? '#0E0805' : '#FBF7F2',
              border: `1px solid ${BORDER}`,
              color: TEXT_PRI,
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
            }}
          >
            {current.codeSnippet}
          </Box>
        )}

        <Stack spacing={1} sx={{ mb: 2 }}>
          {current.options.map((opt, i) => {
            const isSelected = selected.includes(i);
            const isAnswer = current.correctAnswers.includes(i);
            let borderColor = BORDER;
            let bgColor = 'transparent';
            if (revealed) {
              if (isAnswer) { borderColor = GOOD; bgColor = `${GOOD}14`; }
              else if (isSelected && !isAnswer) { borderColor = BAD; bgColor = `${BAD}14`; }
            } else if (isSelected) {
              borderColor = ACCENT; bgColor = `${ACCENT}14`;
            }
            return (
              <Box
                key={i}
                onClick={() => toggleOption(i)}
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  border: `1px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  cursor: revealed ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  transition: 'all 0.12s',
                  '&:hover': revealed ? {} : { borderColor: ACCENT },
                }}
              >
                <Box sx={{
                  width: 22, height: 22, flexShrink: 0,
                  borderRadius: isMulti ? '4px' : '50%',
                  border: `2px solid ${isSelected || (revealed && isAnswer) ? (revealed && isAnswer ? GOOD : ACCENT) : BORDER}`,
                  backgroundColor: isSelected ? (revealed ? (isAnswer ? GOOD : BAD) : ACCENT) : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                }}>
                  {isSelected ? (isMulti ? '✓' : '●') : ''}
                </Box>
                <Typography sx={{ color: TEXT_PRI, fontSize: '0.92rem', lineHeight: 1.5 }}>{opt}</Typography>
                {revealed && isAnswer && <CorrectIcon sx={{ color: GOOD, ml: 'auto' }} />}
                {revealed && isSelected && !isAnswer && <WrongIcon sx={{ color: BAD, ml: 'auto' }} />}
              </Box>
            );
          })}
        </Stack>

        {!revealed && (
          <>
            <Divider sx={{ my: 2, borderColor: BORDER }} />
            <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', mb: 1, fontWeight: 600 }}>
              Before revealing — how confident are you?
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {CONFIDENCE_OPTIONS.map(opt => (
                <Chip
                  key={opt.id}
                  label={`${opt.emoji} ${opt.label}`}
                  onClick={() => setConfidence(opt.id)}
                  variant={confidence === opt.id ? 'filled' : 'outlined'}
                  sx={
                    confidence === opt.id
                      ? { backgroundColor: ACCENT, color: '#fff', fontWeight: 700 }
                      : { borderColor: BORDER, color: TEXT_PRI }
                  }
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleReveal}
                disabled={selected.length === 0 || !confidence}
                sx={{ backgroundColor: ACCENT, '&:hover': { backgroundColor: ACCENT, opacity: 0.9 } }}
              >
                Reveal answer
              </Button>
              <Button variant="text" onClick={handleSkip} sx={{ color: TEXT_SEC }}>Skip</Button>
            </Stack>
          </>
        )}

        {revealed && (
          <>
            <Divider sx={{ my: 2, borderColor: BORDER }} />
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
              {correct ? (
                <Chip icon={<CorrectIcon />} label="Correct" sx={{ backgroundColor: `${GOOD}22`, color: GOOD, fontWeight: 700 }} />
              ) : (
                <Chip icon={<WrongIcon />} label="Not quite" sx={{ backgroundColor: `${BAD}22`, color: BAD, fontWeight: 700 }} />
              )}
              {confidence && (
                <Chip
                  size="small"
                  label={`You were ${CONFIDENCE_OPTIONS.find(c => c.id === confidence)?.label.toLowerCase()}`}
                  variant="outlined"
                  sx={{ borderColor: BORDER, color: TEXT_SEC }}
                />
              )}
              {confidence === 'confident' && !correct && (
                <Chip size="small" label="🚨 Confidently wrong — review this concept" sx={{ backgroundColor: `${BAD}22`, color: BAD, fontWeight: 700 }} />
              )}
              {confidence === 'guess' && correct && (
                <Chip size="small" label="🍀 Lucky guess — keep studying" sx={{ backgroundColor: `${ACCENT}22`, color: ACCENT, fontWeight: 700 }} />
              )}
            </Stack>

            <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5, borderColor: BORDER, backgroundColor: isDark ? '#1E0F06' : '#FBF7F2' }}>
              <Typography variant="caption" sx={{ color: TEXT_SEC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Why
              </Typography>
              <Typography sx={{ color: TEXT_PRI, fontSize: '0.92rem', mt: 0.5, lineHeight: 1.6 }}>
                {current.explanation}
              </Typography>
            </Paper>

            {current.examTip && (
              <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5, borderColor: ACCENT, backgroundColor: `${ACCENT}11` }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
                  <TipIcon sx={{ color: ACCENT, fontSize: 18, mt: 0.3 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: ACCENT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Tip
                    </Typography>
                    <Typography sx={{ color: TEXT_PRI, fontSize: '0.9rem', mt: 0.5, lineHeight: 1.6 }}>
                      {current.examTip}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            )}

            {/* Personal note */}
            <Box sx={{ mb: 1.5 }}>
              <Button
                size="small"
                startIcon={<NoteIcon fontSize="small" />}
                endIcon={noteOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                onClick={() => setNoteOpen(o => !o)}
                sx={{ color: noteText ? ACCENT : TEXT_SEC, textTransform: 'none', fontSize: '0.8rem' }}
              >
                {noteText ? 'Edit note' : 'Add a personal note'}
                {noteText && !noteOpen && ' — saved'}
              </Button>
              {noteOpen && (
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={6}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onBlur={handleNoteSave}
                  placeholder="Why I missed this · the mnemonic that worked · etc."
                  size="small"
                  sx={{ mt: 1, '& .MuiInputBase-root': { fontSize: '0.88rem' } }}
                />
              )}
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  index >= queue.length - 1 &&
                  !(mode === 'daily' && !doneToday)
                }
                sx={{ backgroundColor: ACCENT, '&:hover': { backgroundColor: ACCENT, opacity: 0.9 } }}
              >
                {mode === 'daily' && index === queue.length - 1
                  ? 'Finish daily warmup'
                  : 'Next question'}
              </Button>
              <Button
                variant="text"
                startIcon={<ResetIcon />}
                onClick={() => { setIndex(0); setSelected([]); setConfidence(null); setRevealed(false); }}
                sx={{ color: TEXT_SEC }}
              >
                Restart queue
              </Button>
            </Stack>
          </>
        )}
      </Paper>
    </Box>
  );
}

function ModeChip({
  id, label, current, setMode, accent, border, text, tooltip,
}: {
  id: Mode; label: string;
  current: Mode; setMode: (m: Mode) => void;
  accent: string; border: string; text: string;
  tooltip?: string;
}) {
  const active = current === id;
  const chip = (
    <Chip
      label={label}
      onClick={() => setMode(id)}
      variant={active ? 'filled' : 'outlined'}
      sx={
        active
          ? { backgroundColor: accent, color: '#fff', fontWeight: 700 }
          : { borderColor: border, color: text }
      }
    />
  );
  return tooltip ? <Tooltip title={tooltip}>{chip}</Tooltip> : chip;
}
