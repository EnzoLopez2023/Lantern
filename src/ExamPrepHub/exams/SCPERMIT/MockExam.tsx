import { useState, useMemo } from 'react';
import { Box, Button, Chip, FormControlLabel, LinearProgress, Paper, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { questions, type PermitQuestion, type PermitDomain } from './questions';
import { ExamImage } from './signs';
import type { ExamImageKey } from './signs/catalog';

const TOTAL_QUESTIONS = 30;
const PASS_SCORE = 24;
const DOMAINS: PermitDomain[] = ['road-signs', 'traffic-laws', 'safe-driving'];
const DOMAIN_LABELS: Record<PermitDomain, string> = {
  'road-signs': 'Road Signs & Signals',
  'traffic-laws': 'Traffic Laws & Rules',
  'safe-driving': 'Safe Driving & SC Laws',
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildBalancedExam(bank: PermitQuestion[]) {
  const targetPerDomain = Math.floor(TOTAL_QUESTIONS / DOMAINS.length);
  const chosen: PermitQuestion[] = [];

  for (const domain of DOMAINS) {
    chosen.push(...shuffle(bank.filter((question) => question.domain === domain)).slice(0, targetPerDomain));
  }

  if (chosen.length < TOTAL_QUESTIONS) {
    const used = new Set(chosen.map((question) => question.id));
    const extras = shuffle(bank.filter((question) => !used.has(question.id))).slice(0, TOTAL_QUESTIONS - chosen.length);
    chosen.push(...extras);
  }

  return shuffle(chosen).slice(0, TOTAL_QUESTIONS);
}

export default function MockExam() {
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

  const [examQuestions, setExamQuestions] = useState<PermitQuestion[]>(() => buildBalancedExam(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = examQuestions[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  const results = useMemo(() => {
    const wrong = examQuestions
      .map((question, index) => ({ question, selected: answers[index] }))
      .filter(({ question, selected }) => selected !== question.correctAnswers[0])
      .map(({ question, selected }) => ({
        id: question.id,
        prompt: question.question,
        explanation: question.explanation,
        selectedText: selected === undefined ? 'No answer selected' : question.options[selected],
        correctText: question.options[question.correctAnswers[0]],
        image: question.image as ExamImageKey | undefined,
        imageAlt: question.imageAlt,
      }));

    const correctCount = examQuestions.length - wrong.length;
    const percent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

    return {
      correctCount,
      percent,
      passed: correctCount >= PASS_SCORE,
      wrong,
    };
  }, [answers, examQuestions]);

  const handleNext = () => {
    if (selectedOption === null) return;

    const nextAnswers = [...answers, selectedOption];
    setAnswers(nextAnswers);

    if (currentIndex === examQuestions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentIndex((value) => value + 1);
    setSelectedOption(null);
  };

  const handleRetake = () => {
    setExamQuestions(buildBalancedExam(questions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setFinished(false);
  };

  if (examQuestions.length < TOTAL_QUESTIONS) {
    return (
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: TEXT_PRI, fontWeight: 700, mb: 1 }}>
          Mock exam is almost ready 🛠️
        </Typography>
        <Typography sx={{ color: TEXT_SEC }}>
          We need at least 30 permit questions in the bank before the full DMV-style test can run.
        </Typography>
      </Paper>
    );
  }

  if (finished) {
    return (
      <Stack spacing={2.5}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: results.passed ? GOOD_BG : BAD_BG, border: `1px solid ${results.passed ? GOOD : BAD}` }}>
          <Stack spacing={1.5}>
            <Typography variant="h4" sx={{ color: results.passed ? GOOD : BAD, fontWeight: 900 }}>
              {results.passed ? '🎉🚗 YOU PASSED! 🚗🎉' : 'Almost there! 💪'}
            </Typography>
            <Typography variant="h5" sx={{ color: TEXT_PRI, fontWeight: 800 }}>
              Score: {results.correctCount}/30 ({results.percent}%)
            </Typography>
            <Typography sx={{ color: TEXT_PRI, fontSize: '1rem', lineHeight: 1.7 }}>
              {results.passed
                ? 'You’re ready for the real thing! Go crush it at the DMV!'
                : 'You need 24/30 (80%) to pass. Don’t worry — review the topics you missed and try again. You’ll get it!'}
            </Typography>
            <Chip label="You need 24/30 (80%) to pass" sx={{ alignSelf: 'flex-start', bgcolor: '#fff', color: results.passed ? GOOD : BAD, fontWeight: 800 }} />
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Stack direction="row" spacing={1}>
              <Chip label={`${results.correctCount}/30 correct`} sx={{ bgcolor: ACCENT_BG, color: ACCENT, fontWeight: 800 }} />
              <Chip label={results.passed ? 'PASS' : 'REVIEW & RETAKE'} sx={{ bgcolor: results.passed ? GOOD_BG : BAD_BG, color: results.passed ? GOOD : BAD, fontWeight: 800 }} />
            </Stack>
            <Button variant="contained" onClick={handleRetake} sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: ACCENT }, textTransform: 'none', fontWeight: 800 }}>
              Retake Mock Exam
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
          <Typography variant="h6" sx={{ color: TEXT_PRI, fontWeight: 800, mb: 2 }}>
            Questions to review
          </Typography>
          {results.wrong.length === 0 ? (
            <Typography sx={{ color: TEXT_SEC }}>Perfect score. That was elite. 😎</Typography>
          ) : (
            <Stack spacing={1.5}>
              {results.wrong.map((item, index) => (
                <Paper key={item.id} elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: BAD_BG, border: `1px solid ${BORDER}` }}>
                  <Stack spacing={0.75}>
                    <Typography sx={{ color: TEXT_PRI, fontWeight: 700 }}>
                      {index + 1}. {item.prompt}
                    </Typography>
                    {item.image && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', py: 0.5 }}>
                        <ExamImage imageKey={item.image} alt={item.imageAlt} size={120} />
                      </Box>
                    )}
                    <Typography variant="body2" sx={{ color: TEXT_SEC }}>
                      Your answer: {item.selectedText}
                    </Typography>
                    <Typography variant="body2" sx={{ color: GOOD, fontWeight: 700 }}>
                      Correct answer: {item.correctText}
                    </Typography>
                    <Typography variant="body2" sx={{ color: TEXT_PRI, lineHeight: 1.65 }}>
                      {item.explanation}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
            <Typography variant="h6" sx={{ color: TEXT_PRI, fontWeight: 800 }}>
              Real-test mode: no going back 👀
            </Typography>
            <Chip label={`Question ${currentIndex + 1} of 30`} sx={{ bgcolor: ACCENT_BG, color: ACCENT, fontWeight: 800 }} />
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 999, bgcolor: ACCENT_BG, '& .MuiLinearProgress-bar': { backgroundColor: ACCENT } }} />
          <Typography variant="body2" sx={{ color: TEXT_SEC }}>
            You need 24/30 (80%) to pass. One question at a time — just like the real permit test.
          </Typography>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <Chip label={DOMAIN_LABELS[currentQuestion.domain]} sx={{ bgcolor: ACCENT, color: '#fff', fontWeight: 800 }} />
            <Chip label={currentQuestion.subdomain} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC, fontWeight: 800 }} />
            <Chip label={currentQuestion.difficulty.toUpperCase()} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC, fontWeight: 800 }} />
          </Stack>

          <Typography variant="h5" sx={{ color: TEXT_PRI, fontWeight: 800 }}>
            {currentQuestion.question}
          </Typography>

          {currentQuestion.image && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
              <ExamImage imageKey={currentQuestion.image} alt={currentQuestion.imageAlt} size={160} />
            </Box>
          )}

          <RadioGroup value={selectedOption ?? ''} onChange={(event) => setSelectedOption(Number(event.target.value))}>
            <Stack spacing={1.25}>
              {currentQuestion.options.map((option, index) => {
                const isChosen = selectedOption === index;
                return (
                  <Box key={option} sx={{ border: `1px solid ${isChosen ? ACCENT : BORDER}`, borderRadius: 2, px: 1.5, py: 0.5, bgcolor: isChosen ? ACCENT_BG : 'transparent', transition: 'all 0.2s ease' }}>
                    <FormControlLabel
                      value={index}
                      control={<Radio sx={{ color: TEXT_SEC, '&.Mui-checked': { color: ACCENT } }} />}
                      label={<Typography sx={{ color: TEXT_PRI }}>{String.fromCharCode(65 + index)}. {option}</Typography>}
                      sx={{ m: 0, width: '100%' }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={selectedOption === null}
            sx={{ alignSelf: 'flex-start', bgcolor: ACCENT, '&:hover': { bgcolor: ACCENT }, textTransform: 'none', fontWeight: 800 }}
          >
            {currentIndex === TOTAL_QUESTIONS - 1 ? 'Finish Exam' : 'Lock In Answer'}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
