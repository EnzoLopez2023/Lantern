// SAT Adaptive Test Simulator — mirrors the real SAT's multistage adaptive testing.
// Module 1: mixed difficulty → score determines Module 2 difficulty band.

import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Timer as TimerIcon,
  CheckCircle as DoneIcon,
  NavigateNext as NextIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import {
  rwQuestions,
  mathQuestions,
  shuffle,
  type SATQuestion,
  type SATSection,
  type Difficulty,
} from './questions';
import {
  adaptiveResultSummary,
  countCurrentModuleAnswers,
  scoreAdaptiveTest,
  type AdaptiveScoreResults,
  type AdaptiveTestMode,
} from './adaptiveScore';

// Configuration matching real SAT structure
const MODULE_CONFIG = {
  'reading-writing': { questionsPerModule: 27, timePerModule: 32 * 60 }, // 32 min
  math: { questionsPerModule: 22, timePerModule: 35 * 60 }, // 35 min
};

interface TestState {
  phase: 'setup' | 'testing' | 'break' | 'results';
  section: SATSection;
  module: 1 | 2;
  questions: SATQuestion[];
  currentIndex: number;
  answers: Record<string, number | null>;
  flagged: Set<string>;
  timeRemaining: number;
  mod1Score: number | null; // raw score from module 1
  mod2Difficulty: Difficulty | null;
  presentedQuestionIds: string[];
  routes: Partial<Record<SATSection, Difficulty>>;
}

type TestResults = AdaptiveScoreResults;

function buildModule(
  pool: SATQuestion[],
  count: number,
  difficulty?: Difficulty | null
): SATQuestion[] {
  let filtered: SATQuestion[];
  if (!difficulty) {
    // Module 1: mix of all difficulties
    const easy = shuffle(pool.filter(q => q.difficulty === 'easy')).slice(0, Math.ceil(count * 0.3));
    const med = shuffle(pool.filter(q => q.difficulty === 'medium')).slice(0, Math.ceil(count * 0.4));
    const hard = shuffle(pool.filter(q => q.difficulty === 'hard')).slice(0, Math.ceil(count * 0.3));
    filtered = shuffle([...easy, ...med, ...hard]).slice(0, count);
  } else {
    // Module 2: weighted toward target difficulty
    const targetWeight = 0.6;
    const targetCount = Math.ceil(count * targetWeight);
    const otherCount = count - targetCount;
    const target = shuffle(pool.filter(q => q.difficulty === difficulty)).slice(0, targetCount);
    const others = shuffle(pool.filter(q => q.difficulty !== difficulty)).slice(0, otherCount);
    filtered = shuffle([...target, ...others]).slice(0, count);
  }
  return filtered.length >= count ? filtered : shuffle(pool).slice(0, count);
}

function determineMod2Difficulty(mod1Score: number, totalQuestions: number): Difficulty {
  const pct = mod1Score / totalQuestions;
  if (pct >= 0.7) return 'hard';
  if (pct >= 0.4) return 'medium';
  return 'easy';
}

export default function AdaptiveTest() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT = isDark ? '#5B9BD5' : '#003366';
  const CARD_BG = isDark ? '#1B2838' : '#FFFFFF';
  const BORDER = isDark ? '#2D4A6A' : '#D4E3F5';
  const TEXT_PRI = isDark ? '#E8F0FE' : '#0D1B2A';
  const TEXT_SEC = isDark ? '#8BACC8' : '#4A6D8C';
  const GOOD = isDark ? '#7BAF85' : '#2E7D32';
  const BAD = isDark ? '#D88366' : '#C62828';

  const [state, setState] = useState<TestState>({
    phase: 'setup',
    section: 'reading-writing',
    module: 1,
    questions: [],
    currentIndex: 0,
    answers: {},
    flagged: new Set(),
    timeRemaining: 0,
    mod1Score: null,
    mod2Difficulty: null,
    presentedQuestionIds: [],
    routes: {},
  });

  const [results, setResults] = useState<TestResults | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [testType, setTestType] = useState<AdaptiveTestMode>('full');

  // Timer
  useEffect(() => {
    if (state.phase !== 'testing' || state.timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.phase, state.timeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (state.phase === 'testing' && state.timeRemaining === 0) {
      handleModuleComplete();
    }
  }, [state.timeRemaining]);

  const startTest = useCallback(() => {
    const section: SATSection = testType === 'math-only' ? 'math' : 'reading-writing';
    const pool = section === 'reading-writing' ? rwQuestions : mathQuestions;
    const config = MODULE_CONFIG[section];
    const questions = buildModule(pool, config.questionsPerModule);

    setState({
      phase: 'testing',
      section,
      module: 1,
      questions,
      currentIndex: 0,
      answers: {},
      flagged: new Set(),
      timeRemaining: config.timePerModule,
      mod1Score: null,
      mod2Difficulty: null,
      presentedQuestionIds: questions.map(question => question.id),
      routes: {},
    });
  }, [testType]);

  const handleAnswer = (questionId: string, answerIdx: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answerIdx },
    }));
  };

  const handleFlag = (questionId: string) => {
    setState(prev => {
      const newFlagged = new Set(prev.flagged);
      if (newFlagged.has(questionId)) newFlagged.delete(questionId);
      else newFlagged.add(questionId);
      return { ...prev, flagged: newFlagged };
    });
  };

  const handleModuleComplete = useCallback(() => {
    const { section, module, questions, answers } = state;

    // Score module 1
    const correct = questions.filter(
      q => answers[q.id] !== undefined && answers[q.id] !== null && q.correctAnswers.includes(answers[q.id]!)
    ).length;

    if (module === 1) {
      const mod2Diff = determineMod2Difficulty(correct, questions.length);
      const pool = section === 'reading-writing' ? rwQuestions : mathQuestions;
      // Exclude already-used questions
      const usedIds = new Set(questions.map(q => q.id));
      const remainingPool = pool.filter(q => !usedIds.has(q.id));
      const config = MODULE_CONFIG[section];
      const mod2Questions = buildModule(remainingPool, config.questionsPerModule, mod2Diff);

      setState(prev => ({
        ...prev,
        phase: 'break',
        mod1Score: correct,
        mod2Difficulty: mod2Diff,
        routes: { ...prev.routes, [section]: mod2Diff },
        questions: mod2Questions,
        presentedQuestionIds: [
          ...prev.presentedQuestionIds,
          ...mod2Questions.map(question => question.id),
        ],
        currentIndex: 0,
        timeRemaining: config.timePerModule,
      }));
    } else {
      // Module 2 complete — either move to next section or show results
      if (section === 'reading-writing' && testType === 'full') {
        // Start math section
        const mathPool = mathQuestions;
        const config = MODULE_CONFIG.math;
        const mod1Questions = buildModule(mathPool, config.questionsPerModule);

        setState(prev => ({
          ...prev,
          phase: 'testing',
          section: 'math',
          module: 1,
          questions: mod1Questions,
          currentIndex: 0,
          timeRemaining: config.timePerModule,
          mod1Score: null,
          mod2Difficulty: null,
          presentedQuestionIds: [
            ...prev.presentedQuestionIds,
            ...mod1Questions.map(question => question.id),
          ],
        }));
      } else {
        // Calculate final results
        calculateResults();
      }
    }
  }, [state, testType]);

  const startModule2 = () => {
    setState(prev => ({
      ...prev,
      phase: 'testing',
      module: 2,
      answers: { ...prev.answers },
    }));
  };

  const calculateResults = () => {
    setResults(scoreAdaptiveTest(
      [...rwQuestions, ...mathQuestions],
      state.presentedQuestionIds,
      state.answers,
      state.routes,
    ));
    setState(prev => ({ ...prev, phase: 'results' }));
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- Render ---

  if (state.phase === 'setup') {
    return (
      <Stack spacing={3}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: TEXT_PRI, mb: 2 }}>
            🎯 Adaptive Test Simulator
          </Typography>
          <Typography variant="body1" sx={{ color: TEXT_SEC, mb: 3 }}>
            This test mirrors the real Digital SAT's adaptive structure. Module 1 presents mixed-difficulty
            questions. Based on your performance, Module 2 adjusts its difficulty — just like the real exam.
          </Typography>

          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI, mb: 1 }}>
            Choose test type:
          </Typography>
          <Stack spacing={1} sx={{ mb: 3 }}>
            {[
              { value: 'full', label: 'Full SAT (R&W + Math)', desc: '~134 minutes, 4 modules' },
              { value: 'rw-only', label: 'Reading & Writing Only', desc: '~64 minutes, 2 modules' },
              { value: 'math-only', label: 'Math Only', desc: '~70 minutes, 2 modules' },
            ].map(opt => (
              <Paper
                key={opt.value}
                elevation={0}
                onClick={() => setTestType(opt.value as typeof testType)}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  border: `2px solid ${testType === opt.value ? ACCENT : BORDER}`,
                  bgcolor: testType === opt.value ? (isDark ? '#1E3A5F' : '#E8F4FD') : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>
                  {opt.label}
                </Typography>
                <Typography variant="caption" sx={{ color: TEXT_SEC }}>{opt.desc}</Typography>
              </Paper>
            ))}
          </Stack>

          <Button
            variant="contained"
            size="large"
            onClick={startTest}
            sx={{
              bgcolor: ACCENT,
              '&:hover': { bgcolor: isDark ? '#4A8AC4' : '#004080' },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Start Adaptive Test
          </Button>
        </Paper>
      </Stack>
    );
  }

  if (state.phase === 'break') {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: TEXT_PRI, mb: 2 }}>
          ⏸️ Module Break
        </Typography>
        <Typography variant="body1" sx={{ color: TEXT_SEC, mb: 1 }}>
          Module 1 complete! You answered {state.mod1Score} of {MODULE_CONFIG[state.section].questionsPerModule} correctly.
        </Typography>
        <Chip
          label={`Module 2 Difficulty: ${state.mod2Difficulty?.toUpperCase()}`}
          sx={{
            bgcolor: state.mod2Difficulty === 'hard' ? BAD : state.mod2Difficulty === 'medium' ? ACCENT : GOOD,
            color: '#fff',
            fontWeight: 600,
            mb: 3,
          }}
        />
        <Typography variant="body2" sx={{ color: TEXT_SEC, mb: 3 }}>
          Just like the real SAT, your Module 2 difficulty has been adjusted based on Module 1 performance.
          Take a moment, then continue when ready.
        </Typography>
        <Button
          variant="contained"
          onClick={startModule2}
          sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: isDark ? '#4A8AC4' : '#004080' }, textTransform: 'none' }}
        >
          Start Module 2
        </Button>
      </Paper>
    );
  }

  if (state.phase === 'results' && results) {
    const summary = adaptiveResultSummary(testType, results);
    return (
      <Stack spacing={3}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: TEXT_PRI, mb: 1 }}>
            {summary.heading}
          </Typography>
          <Typography variant="h2" fontWeight={800} sx={{ color: ACCENT, mb: 2 }}>
            {summary.score}
          </Typography>
          <Typography variant="body2" sx={{ color: TEXT_SEC, mb: 3 }}>out of {summary.maxScore}</Typography>

          <Stack direction="row" justifyContent="center" spacing={4} sx={{ mb: 3 }}>
            {summary.sectionScores.map(sectionScore => (
              <Box key={sectionScore.label}>
                <Typography variant="h5" fontWeight={700} sx={{ color: TEXT_PRI }}>{sectionScore.score}</Typography>
                <Typography variant="caption" sx={{ color: TEXT_SEC }}>{sectionScore.label}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Domain breakdown */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
          <Typography variant="h6" fontWeight={600} sx={{ color: TEXT_PRI, mb: 2 }}>
            Domain Performance
          </Typography>
          <Stack spacing={1.5}>
            {Object.entries(results.domainBreakdown).map(([domain, { correct, total }]) => (
              <Box key={domain}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: TEXT_PRI, textTransform: 'capitalize' }}>
                    {domain.replace(/-/g, ' ')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: correct / total >= 0.7 ? GOOD : BAD }}>
                    {correct}/{total} ({Math.round((correct / total) * 100)}%)
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={(correct / total) * 100}
                  sx={{
                    height: 6,
                    borderRadius: 2,
                    bgcolor: isDark ? '#2D4A6A' : '#E0E8F0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: correct / total >= 0.7 ? GOOD : correct / total >= 0.4 ? ACCENT : BAD,
                    },
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Button
          variant="outlined"
          onClick={() => {
            setState({ phase: 'setup', section: 'reading-writing', module: 1, questions: [], currentIndex: 0, answers: {}, flagged: new Set(), timeRemaining: 0, mod1Score: null, mod2Difficulty: null, presentedQuestionIds: [], routes: {} });
            setResults(null);
          }}
          sx={{ color: ACCENT, borderColor: ACCENT, textTransform: 'none' }}
        >
          Take Another Test
        </Button>
      </Stack>
    );
  }

  // Testing phase
  const currentQ = state.questions[state.currentIndex];
  if (!currentQ) return null;

  const progress = ((state.currentIndex + 1) / state.questions.length) * 100;
  const isTimeWarning = state.timeRemaining < 300; // 5 min warning

  return (
    <Stack spacing={2}>
      {/* Timer and progress bar */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${state.section === 'reading-writing' ? 'R&W' : 'Math'} • Module ${state.module}`}
              size="small"
              sx={{ bgcolor: ACCENT, color: '#fff' }}
            />
            <Typography variant="body2" sx={{ color: TEXT_SEC }}>
              Q{state.currentIndex + 1} of {state.questions.length}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <TimerIcon sx={{ fontSize: 18, color: isTimeWarning ? BAD : TEXT_SEC }} />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: isTimeWarning ? BAD : TEXT_PRI }}
            >
              {formatTime(state.timeRemaining)}
            </Typography>
          </Stack>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            borderRadius: 2,
            bgcolor: isDark ? '#2D4A6A' : '#E0E8F0',
            '& .MuiLinearProgress-bar': { bgcolor: ACCENT },
          }}
        />
      </Paper>

      {/* Question */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
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

        <Typography variant="body1" fontWeight={500} sx={{ color: TEXT_PRI, mb: 2 }}>
          {currentQ.question}
        </Typography>

        <RadioGroup
          value={state.answers[currentQ.id] ?? ''}
          onChange={(e) => handleAnswer(currentQ.id, parseInt(e.target.value))}
        >
          {currentQ.options.map((opt, idx) => (
            <FormControlLabel
              key={idx}
              value={idx}
              control={<Radio sx={{ color: TEXT_SEC, '&.Mui-checked': { color: ACCENT } }} />}
              label={
                <Typography variant="body2" sx={{ color: TEXT_PRI }}>
                  {String.fromCharCode(65 + idx)}. {opt}
                </Typography>
              }
              sx={{
                mb: 0.5,
                p: 1,
                borderRadius: 1,
                border: `1px solid ${state.answers[currentQ.id] === idx ? ACCENT : 'transparent'}`,
                bgcolor: state.answers[currentQ.id] === idx ? (isDark ? '#1E3A5F' : '#E8F4FD') : 'transparent',
              }}
            />
          ))}
        </RadioGroup>
      </Paper>

      {/* Navigation */}
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="outlined"
          size="small"
          startIcon={<FlagIcon />}
          onClick={() => handleFlag(currentQ.id)}
          sx={{
            color: state.flagged.has(currentQ.id) ? '#E8A838' : TEXT_SEC,
            borderColor: state.flagged.has(currentQ.id) ? '#E8A838' : BORDER,
            textTransform: 'none',
          }}
        >
          {state.flagged.has(currentQ.id) ? 'Flagged' : 'Flag for Review'}
        </Button>

        <Stack direction="row" spacing={1}>
          {state.currentIndex > 0 && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }))}
              sx={{ color: TEXT_SEC, borderColor: BORDER, textTransform: 'none' }}
            >
              Previous
            </Button>
          )}
          {state.currentIndex < state.questions.length - 1 ? (
            <Button
              variant="contained"
              size="small"
              endIcon={<NextIcon />}
              onClick={() => setState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }))}
              sx={{ bgcolor: ACCENT, textTransform: 'none' }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              endIcon={<DoneIcon />}
              onClick={() => setShowConfirm(true)}
              sx={{ bgcolor: GOOD, textTransform: 'none' }}
            >
              Submit Module
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Confirm dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Submit Module {state.module}?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {countCurrentModuleAnswers(state.questions, state.answers)} of {state.questions.length} questions answered.
            {state.flagged.size > 0 && ` ${state.flagged.size} flagged for review.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Go Back</Button>
          <Button
            variant="contained"
            onClick={() => { setShowConfirm(false); handleModuleComplete(); }}
            sx={{ bgcolor: ACCENT }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
