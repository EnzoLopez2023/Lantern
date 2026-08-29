// SAT Practice Mode — free-form drilling with domain/difficulty filters.
// Reuses the shared drillStats infrastructure for spaced repetition.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  Stack,
  Typography,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CheckCircle as CorrectIcon,
  Cancel as WrongIcon,
  Lightbulb as TipIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  NoteAlt as NoteIcon,
} from '@mui/icons-material';
import {
  allQuestions,
  shuffle,
  DOMAIN_META,
  type SATQuestion,
  type SATSection,
  type SATDomain,
  type Difficulty,
} from './questions';
import {
  loadStats,
  saveStats,
  recordAnswer,
  buildAdaptiveQueue,
  buildWeakSpotQueue,
  buildDueQueue,
  countDue,
  rollingAccuracy,
  type StatsMap,
  type Confidence,
} from '../../shared/drillStats';
import { loadBookmarks, toggleBookmark } from '../../shared/bookmarks';
import { loadNote, saveNote } from '../../shared/notes';
import { PracticeEmptyState } from '../../shared/PracticeEmptyState';
import { canLeavePracticeQuestion, shouldRecordPracticeConfidence } from './practiceAttempt';

type Mode = 'browse' | 'adaptive' | 'weak' | 'due' | 'bookmarks';
const EXAM_ID = 'SAT';

const CONFIDENCE_OPTIONS: { id: Confidence; label: string; emoji: string }[] = [
  { id: 'guess', label: 'Guessed', emoji: '🎲' },
  { id: 'unsure', label: 'Unsure', emoji: '🤔' },
  { id: 'confident', label: 'Confident', emoji: '💪' },
];

export default function Practice() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT = isDark ? '#5B9BD5' : '#003366';
  const CARD_BG = isDark ? '#1B2838' : '#FFFFFF';
  const BORDER = isDark ? '#2D4A6A' : '#D4E3F5';
  const TEXT_PRI = isDark ? '#E8F0FE' : '#0D1B2A';
  const TEXT_SEC = isDark ? '#8BACC8' : '#4A6D8C';
  const GOOD = isDark ? '#7BAF85' : '#2E7D32';
  const BAD = isDark ? '#D88366' : '#C62828';

  const [stats, setStats] = useState<StatsMap>(() => loadStats(EXAM_ID));
  const [mode, setMode] = useState<Mode>('browse');
  const [sectionFilter, setSectionFilter] = useState<SATSection | 'all'>('all');
  const [domainFilter, setDomainFilter] = useState<SATDomain | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [queue, setQueue] = useState<SATQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [, setShowExplanation] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => new Set(loadBookmarks(EXAM_ID, 'question')));
  const [noteText, setNoteText] = useState('');
  const [showNote, setShowNote] = useState(false);
  const confidenceRecordedRef = useRef(false);

  // Build queue when mode/filters change
  useEffect(() => {
    let q: SATQuestion[];
    switch (mode) {
      case 'adaptive':
        q = buildAdaptiveQueue(stats, allQuestions);
        break;
      case 'weak':
        q = buildWeakSpotQueue(stats, allQuestions);
        break;
      case 'due':
        q = buildDueQueue(stats, allQuestions);
        break;
      case 'bookmarks':
        q = allQuestions.filter(qq => bookmarks.has(qq.id));
        break;
      default: {
        let pool = allQuestions;
        if (sectionFilter !== 'all') pool = pool.filter(qq => qq.section === sectionFilter);
        if (domainFilter !== 'all') pool = pool.filter(qq => qq.domain === domainFilter);
        if (difficultyFilter !== 'all') pool = pool.filter(qq => qq.difficulty === difficultyFilter);
        q = shuffle(pool);
      }
    }
    setQueue(q);
    setIndex(0);
    resetQuestion();
  }, [mode, sectionFilter, domainFilter, difficultyFilter, bookmarks]);

  const resetQuestion = () => {
    setSelected(null);
    setSubmitted(false);
    setConfidence(null);
    setShowExplanation(false);
    setShowNote(false);
    confidenceRecordedRef.current = false;
  };

  const currentQ = queue[index];
  const dueCount = useMemo(() => countDue(stats, allQuestions), [stats]);
  const accuracy = useMemo(() => {
    const value = rollingAccuracy(stats).accuracy;
    return Number.isNaN(value) ? 0 : value;
  }, [stats]);

  const handleSubmit = () => {
    if (selected === null || !currentQ) return;
    setSubmitted(true);
    setShowExplanation(true);
  };

  const handleConfidence = (conf: Confidence) => {
    if (
      !currentQ
      || !shouldRecordPracticeConfidence(submitted, conf, confidenceRecordedRef.current)
    ) return;
    confidenceRecordedRef.current = true;
    setConfidence(conf);
    const isCorrect = currentQ.correctAnswers.includes(selected!);
    const newStats = recordAnswer(stats, currentQ.id, isCorrect, conf);
    setStats(newStats);
    saveStats(EXAM_ID, newStats);
  };

  const handleNext = () => {
    if (!canLeavePracticeQuestion(submitted, confidence)) return;
    if (index < queue.length - 1) {
      setIndex(index + 1);
      resetQuestion();
    }
  };

  const handlePrev = () => {
    if (!canLeavePracticeQuestion(submitted, confidence)) return;
    if (index > 0) {
      setIndex(index - 1);
      resetQuestion();
    }
  };

  const handleToggleBookmark = () => {
    if (!currentQ) return;
    toggleBookmark(EXAM_ID, 'question', currentQ.id);
    setBookmarks(new Set(loadBookmarks(EXAM_ID, 'question')));
  };

  const showAllQuestions = () => {
    setMode('browse');
    setSectionFilter('all');
    setDomainFilter('all');
    setDifficultyFilter('all');
  };

  const controls = (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel sx={{ color: TEXT_SEC }}>Mode</InputLabel>
          <Select disabled={!canLeavePracticeQuestion(submitted, confidence)} value={mode} label="Mode" onChange={e => setMode(e.target.value as Mode)} sx={{ color: TEXT_PRI }}>
            <MenuItem value="browse">Browse</MenuItem>
            <MenuItem value="adaptive">Adaptive</MenuItem>
            <MenuItem value="weak">Weak Spots</MenuItem>
            <MenuItem value="due">Due ({dueCount})</MenuItem>
            <MenuItem value="bookmarks">Bookmarks</MenuItem>
          </Select>
        </FormControl>

        {mode === 'browse' && (
          <>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: TEXT_SEC }}>Section</InputLabel>
              <Select disabled={!canLeavePracticeQuestion(submitted, confidence)} value={sectionFilter} label="Section" onChange={e => { setSectionFilter(e.target.value as SATSection | 'all'); setDomainFilter('all'); }} sx={{ color: TEXT_PRI }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="reading-writing">Reading & Writing</MenuItem>
                <MenuItem value="math">Math</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: TEXT_SEC }}>Domain</InputLabel>
              <Select disabled={!canLeavePracticeQuestion(submitted, confidence)} value={domainFilter} label="Domain" onChange={e => setDomainFilter(e.target.value as SATDomain | 'all')} sx={{ color: TEXT_PRI }}>
                <MenuItem value="all">All Domains</MenuItem>
                {Object.entries(DOMAIN_META)
                  .filter(([, m]) => sectionFilter === 'all' || m.section === sectionFilter)
                  .map(([key, m]) => (
                    <MenuItem key={key} value={key}>{m.label}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel sx={{ color: TEXT_SEC }}>Difficulty</InputLabel>
              <Select disabled={!canLeavePracticeQuestion(submitted, confidence)} value={difficultyFilter} label="Difficulty" onChange={e => setDifficultyFilter(e.target.value as Difficulty | 'all')} sx={{ color: TEXT_PRI }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <Box sx={{ flex: 1 }} />
        <Typography variant="body2" sx={{ color: TEXT_SEC }}>
          {queue.length} questions • {Math.round(accuracy * 100)}% accuracy
        </Typography>
      </Stack>
    </Paper>
  );

  if (!currentQ) {
    return (
      <Stack spacing={2}>
        {controls}
        <PracticeEmptyState
          mode={mode}
          dueCount={dueCount}
          onModeChange={nextMode => {
            if (nextMode !== 'daily') setMode(nextMode);
          }}
          onBrowseAll={showAllQuestions}
          showModeSelector={false}
          title={mode === 'bookmarks'
            ? 'No bookmarked questions yet'
            : mode === 'due'
              ? 'No questions are due for review'
              : 'No questions match your filters'}
          description={mode === 'due'
            ? 'Great job. Choose another mode now, or return later for spaced repetition.'
            : 'Change the controls above, or browse all questions to continue.'}
          cardBackground={CARD_BG}
          borderColor={BORDER}
          textColor={TEXT_PRI}
          secondaryTextColor={TEXT_SEC}
          accentColor={ACCENT}
        />
      </Stack>
    );
  }

  const isCorrect = submitted && currentQ.correctAnswers.includes(selected!);

  return (
    <Stack spacing={2}>
      {/* Controls */}
      {controls}

      {/* Question card */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        {/* Question header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" label={DOMAIN_META[currentQ.domain]?.label || currentQ.domain} sx={{ bgcolor: ACCENT, color: '#fff' }} />
            <Chip
              size="small"
              label={currentQ.difficulty}
              sx={{
                bgcolor: currentQ.difficulty === 'hard' ? BAD : currentQ.difficulty === 'medium' ? '#E8A838' : GOOD,
                color: '#fff',
              }}
            />
            <Typography variant="caption" sx={{ color: TEXT_SEC }}>
              #{index + 1} of {queue.length}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={bookmarks.has(currentQ.id) ? 'Remove bookmark' : 'Bookmark'}>
              <IconButton size="small" onClick={handleToggleBookmark}>
                {bookmarks.has(currentQ.id) ? <BookmarkIcon sx={{ color: '#E8A838' }} /> : <BookmarkBorderIcon sx={{ color: TEXT_SEC }} />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notes">
              <IconButton size="small" onClick={() => { setShowNote(!showNote); setNoteText(loadNote(EXAM_ID, 'question', currentQ.id)); }}>
                <NoteIcon sx={{ color: TEXT_SEC }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Passage */}
        {currentQ.passage && (
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 2, borderRadius: 1, bgcolor: isDark ? '#0D1B2A' : '#F5F8FC', border: `1px solid ${BORDER}` }}
          >
            <Typography variant="body2" sx={{ color: TEXT_PRI, fontStyle: 'italic', lineHeight: 1.7 }}>
              {currentQ.passage}
            </Typography>
          </Paper>
        )}

        {/* Question */}
        <Typography variant="body1" fontWeight={500} sx={{ color: TEXT_PRI, mb: 2 }}>
          {currentQ.question}
        </Typography>

        {/* Options */}
        <RadioGroup value={selected ?? ''} onChange={e => !submitted && setSelected(parseInt(e.target.value))}>
          {currentQ.options.map((opt, idx) => {
            let borderColor = 'transparent';
            let bgColor = 'transparent';
            if (submitted) {
              if (currentQ.correctAnswers.includes(idx)) { borderColor = GOOD; bgColor = isDark ? '#1A3A2A' : '#E8F5E9'; }
              else if (idx === selected) { borderColor = BAD; bgColor = isDark ? '#3A1A1A' : '#FFEBEE'; }
            } else if (idx === selected) {
              borderColor = ACCENT; bgColor = isDark ? '#1E3A5F' : '#E8F4FD';
            }
            return (
              <FormControlLabel
                key={idx}
                value={idx}
                disabled={submitted}
                control={<Radio sx={{ color: TEXT_SEC, '&.Mui-checked': { color: ACCENT } }} />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" sx={{ color: TEXT_PRI }}>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </Typography>
                    {submitted && currentQ.correctAnswers.includes(idx) && <CorrectIcon sx={{ fontSize: 18, color: GOOD }} />}
                    {submitted && idx === selected && !currentQ.correctAnswers.includes(idx) && <WrongIcon sx={{ fontSize: 18, color: BAD }} />}
                  </Stack>
                }
                sx={{ mb: 0.5, p: 1, borderRadius: 1, border: `1px solid ${borderColor}`, bgcolor: bgColor }}
              />
            );
          })}
        </RadioGroup>

        {/* Submit / Confidence */}
        {!submitted ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={selected === null}
            sx={{ mt: 2, bgcolor: ACCENT, textTransform: 'none' }}
          >
            Check Answer
          </Button>
        ) : (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Confidence */}
            {!confidence && (
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" sx={{ color: TEXT_SEC }}>
                  Choose confidence to save this result and continue.
                </Typography>
                {CONFIDENCE_OPTIONS.map(c => (
                  <Chip
                    key={c.id}
                    label={`${c.emoji} ${c.label}`}
                    size="small"
                    onClick={() => handleConfidence(c.id)}
                    sx={{ cursor: 'pointer', border: `1px solid ${BORDER}` }}
                  />
                ))}
              </Stack>
            )}

            {/* Result */}
            <Paper
              elevation={0}
              sx={{ p: 2, borderRadius: 1, bgcolor: isCorrect ? (isDark ? '#1A3A2A' : '#E8F5E9') : (isDark ? '#3A1A1A' : '#FFEBEE') }}
            >
              <Typography variant="subtitle2" fontWeight={600} sx={{ color: isCorrect ? GOOD : BAD, mb: 1 }}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </Typography>
              <Typography variant="body2" sx={{ color: TEXT_PRI }}>
                {currentQ.explanation}
              </Typography>
              {currentQ.tip && (
                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1 }}>
                  <TipIcon sx={{ fontSize: 16, color: '#E8A838', mt: 0.3 }} />
                  <Typography variant="body2" sx={{ color: TEXT_SEC, fontStyle: 'italic' }}>
                    {currentQ.tip}
                  </Typography>
                </Stack>
              )}
            </Paper>
          </Stack>
        )}

        {/* Notes panel */}
        {showNote && (
          <Paper elevation={0} sx={{ p: 2, mt: 2, borderRadius: 1, bgcolor: isDark ? '#0D1B2A' : '#FFFDE7', border: `1px solid ${BORDER}` }}>
            <Typography variant="caption" sx={{ color: TEXT_SEC, mb: 1 }}>Personal notes</Typography>
            <TextField
              multiline
              fullWidth
              minRows={2}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onBlur={() => saveNote(EXAM_ID, 'question', currentQ.id, noteText)}
              size="small"
              sx={{ '& .MuiInputBase-root': { color: TEXT_PRI } }}
            />
          </Paper>
        )}
      </Paper>

      {/* Navigation */}
      <Stack direction="row" justifyContent="space-between">
        <Button
          startIcon={<PrevIcon />}
          disabled={index === 0 || !canLeavePracticeQuestion(submitted, confidence)}
          onClick={handlePrev}
          sx={{ color: TEXT_SEC, textTransform: 'none' }}
        >
          Previous
        </Button>
        <Button
          endIcon={<NextIcon />}
          disabled={index >= queue.length - 1 || !canLeavePracticeQuestion(submitted, confidence)}
          onClick={handleNext}
          sx={{ color: TEXT_SEC, textTransform: 'none' }}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
