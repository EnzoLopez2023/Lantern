import { useState, useEffect, useMemo } from 'react';
import { Box, Button, Chip, FormControlLabel, Paper, Radio, RadioGroup, Stack, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CheckCircle, Cancel, NavigateNext } from '@mui/icons-material';
import { questions, type PermitQuestion, type PermitDomain } from './questions';
import { loadStats, saveStats, recordAnswer, type StatsMap } from '../../shared/drillStats';
import { ExamImage } from './signs';

const DOMAIN_LABELS: Record<PermitDomain, string> = {
  'road-signs': 'Road Signs & Signals',
  'traffic-laws': 'Traffic Laws & Rules',
  'safe-driving': 'Safe Driving & SC Laws',
};

const EXAM_ID = 'SCPERMIT';
const TOPICS: Array<'all' | PermitDomain> = ['all', 'road-signs', 'traffic-laws', 'safe-driving'];
const DIFFICULTIES: Array<'all' | PermitQuestion['difficulty']> = ['all', 'easy', 'medium', 'hard'];

const NICE_MESSAGES = ['Nice job! 🎉', 'Let’s gooo — that was solid! 😎', 'You’re cooking now! 🔥'];
const OOPS_MESSAGES = ['Oops! But now you know! 💪', 'Missed it this time — next one is yours. 🚀', 'No stress. That’s exactly how practice helps. 🙌'];
const KEEP_GOING_MESSAGES = ['Keep going, you’ve got this! 🚀', 'One question at a time — easy money. 😌', 'You’re building real DMV confidence right now. 💚'];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function scoreMessage(correct: number, answered: number) {
  if (answered === 0) return '0/0 correct so far — let’s warm up! 🚗';
  const pct = Math.round((correct / answered) * 100);
  if (pct >= 85) return `${correct}/${answered} correct so far — you’re crushing it! 🔥`;
  if (pct >= 70) return `${correct}/${answered} correct so far — looking strong! 😎`;
  return `${correct}/${answered} correct so far — keep stacking wins! 💪`;
}

export default function Practice() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT = isDark ? '#4DB6AC' : '#00796B';
  const CARD_BG = isDark ? '#102220' : '#FFFFFF';
  const BORDER = isDark ? '#214440' : '#CFEAE7';
  const TEXT_PRI = isDark ? '#E7FFFB' : '#12312D';
  const TEXT_SEC = isDark ? '#9FD4CD' : '#4D6B67';
  const GOOD = isDark ? '#66BB6A' : '#2E7D32';
  const BAD = isDark ? '#EF5350' : '#C62828';
  const GOOD_BG = isDark ? 'rgba(102, 187, 106, 0.18)' : '#E8F5E9';
  const BAD_BG = isDark ? 'rgba(239, 83, 80, 0.18)' : '#FFEBEE';
  const ACCENT_BG = isDark ? 'rgba(77, 182, 172, 0.14)' : '#E0F2F1';

  const [stats, setStats] = useState<StatsMap>(() => loadStats(EXAM_ID));
  const [topicFilter, setTopicFilter] = useState<'all' | PermitDomain>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | PermitQuestion['difficulty']>('all');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const filteredQuestions = useMemo(() => {
    return shuffle(
      questions.filter((question) => {
        const topicMatch = topicFilter === 'all' || question.domain === topicFilter;
        const difficultyMatch = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
        return topicMatch && difficultyMatch;
      }),
    );
  }, [topicFilter, difficultyFilter]);

  useEffect(() => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setChecked(false);
    setStats(loadStats(EXAM_ID));
  }, [topicFilter, difficultyFilter]);

  const currentQuestion = filteredQuestions[questionIndex] ?? null;
  const correctAnswer = currentQuestion?.correctAnswers[0] ?? -1;
  const isCorrect = checked && currentQuestion ? selectedOption === correctAnswer : false;
  const encouragement = checked
    ? (isCorrect ? NICE_MESSAGES[sessionAnswered % NICE_MESSAGES.length] : OOPS_MESSAGES[sessionAnswered % OOPS_MESSAGES.length])
    : KEEP_GOING_MESSAGES[questionIndex % KEEP_GOING_MESSAGES.length];

  const lifetime = useMemo(() => {
    const totals = Object.values(stats).reduce(
      (acc, entry) => {
        acc.attempts += entry.attempts;
        acc.correct += entry.correct;
        return acc;
      },
      { attempts: 0, correct: 0 },
    );
    return totals;
  }, [stats]);

  const handleCheck = () => {
    if (!currentQuestion || selectedOption === null || checked) return;

    const correct = selectedOption === correctAnswer;
    const nextStats = recordAnswer(stats, currentQuestion.id, correct, correct ? 'confident' : 'unsure');

    setStats(nextStats);
    saveStats(EXAM_ID, nextStats);
    setSessionAnswered((value) => value + 1);
    if (correct) setSessionCorrect((value) => value + 1);
    setChecked(true);
  };

  const handleNext = () => {
    if (!filteredQuestions.length) return;
    setQuestionIndex((value) => (value + 1) % filteredQuestions.length);
    setSelectedOption(null);
    setChecked(false);
  };

  if (!currentQuestion) {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: TEXT_PRI, fontWeight: 700, mb: 1 }}>
          No questions match those filters yet 👀
        </Typography>
        <Typography sx={{ color: TEXT_SEC }}>
          Try a different topic or difficulty and we’ll get you right back in the game.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'stretch', md: 'center' } }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Topic</InputLabel>
              <Select value={topicFilter} label="Topic" onChange={(event) => setTopicFilter(event.target.value as 'all' | PermitDomain)}>
                {TOPICS.map((topic) => (
                  <MenuItem key={topic} value={topic}>
                    {topic === 'all' ? 'All topics' : DOMAIN_LABELS[topic]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select value={difficultyFilter} label="Difficulty" onChange={(event) => setDifficultyFilter(event.target.value as 'all' | PermitQuestion['difficulty'])}>
                {DIFFICULTIES.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All levels' : difficulty[0].toUpperCase() + difficulty.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flex: 1 }} />
            <Chip label={scoreMessage(sessionCorrect, sessionAnswered)} sx={{ bgcolor: ACCENT_BG, color: TEXT_PRI, fontWeight: 700 }} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Chip label={`${filteredQuestions.length} questions in this drill set`} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
            <Chip label={`Lifetime practice: ${lifetime.correct}/${lifetime.attempts || 0} correct`} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
            <Chip label={encouragement} sx={{ bgcolor: ACCENT_BG, color: ACCENT, fontWeight: 700 }} />
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Stack direction="row" spacing={1}>
              <Chip label={DOMAIN_LABELS[currentQuestion.domain]} sx={{ bgcolor: ACCENT, color: '#fff', fontWeight: 700 }} />
              <Chip label={currentQuestion.subdomain} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC, fontWeight: 700 }} />
              <Chip label={currentQuestion.difficulty.toUpperCase()} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC, fontWeight: 700 }} />
            </Stack>
            <Typography variant="body2" sx={{ color: TEXT_SEC }}>
              Question {questionIndex + 1} of {filteredQuestions.length}
            </Typography>
          </Stack>

          <Typography variant="h5" sx={{ color: TEXT_PRI, fontWeight: 800 }}>
            {currentQuestion.question}
          </Typography>

          {currentQuestion.image && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
              <ExamImage imageKey={currentQuestion.image} alt={currentQuestion.imageAlt} size={160} />
            </Box>
          )}

          <RadioGroup value={selectedOption ?? ''} onChange={(event) => !checked && setSelectedOption(Number(event.target.value))}>
            <Stack spacing={1.25}>
              {currentQuestion.options.map((option, index) => {
                const isChosen = selectedOption === index;
                const isAnswer = correctAnswer === index;
                const borderColor = checked
                  ? isAnswer
                    ? GOOD
                    : isChosen
                      ? BAD
                      : BORDER
                  : isChosen
                    ? ACCENT
                    : BORDER;
                const backgroundColor = checked
                  ? isAnswer
                    ? GOOD_BG
                    : isChosen
                      ? BAD_BG
                      : 'transparent'
                  : isChosen
                    ? ACCENT_BG
                    : 'transparent';

                return (
                  <Box key={option} sx={{ border: `1px solid ${borderColor}`, borderRadius: 2, px: 1.5, py: 0.5, bgcolor: backgroundColor, transition: 'all 0.2s ease' }}>
                    <FormControlLabel
                      value={index}
                      disabled={checked}
                      control={<Radio sx={{ color: TEXT_SEC, '&.Mui-checked': { color: ACCENT } }} />}
                      label={<Typography sx={{ color: TEXT_PRI }}>{String.fromCharCode(65 + index)}. {option}</Typography>}
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>

          {checked && (
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: isCorrect ? GOOD_BG : BAD_BG, border: `1px solid ${isCorrect ? GOOD : BAD}` }}>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
                {isCorrect ? <CheckCircle sx={{ color: GOOD }} /> : <Cancel sx={{ color: BAD }} />}
                <Box>
                  <Typography sx={{ color: isCorrect ? GOOD : BAD, fontWeight: 800, mb: 0.5 }}>
                    {isCorrect ? 'Correct — nice work! 🎉' : 'Not this one — but now you know! 💪'}
                  </Typography>
                  <Typography sx={{ color: TEXT_PRI, lineHeight: 1.65 }}>
                    {currentQuestion.explanation}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button
              variant="contained"
              onClick={handleCheck}
              disabled={selectedOption === null || checked}
              sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: ACCENT }, textTransform: 'none', fontWeight: 700 }}
            >
              Check
            </Button>
            <Button
              variant="outlined"
              onClick={handleNext}
              disabled={!checked}
              endIcon={<NavigateNext />}
              sx={{ borderColor: ACCENT, color: ACCENT, textTransform: 'none', fontWeight: 700 }}
            >
              Next Question
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
