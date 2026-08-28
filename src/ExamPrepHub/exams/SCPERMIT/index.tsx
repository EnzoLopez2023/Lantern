import { useState, lazy, Suspense } from 'react';
import { Box, Button, Chip, CircularProgress, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { ArrowBack as BackIcon, AutoStories, DirectionsCar, Quiz } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import type { ExamHubNav } from '../../types';
import { flashcardDeck } from './flashcardDeck';
import { glossary } from './glossary';
import { ExamImage } from './signs';

const Practice = lazy(() => import('./Practice'));
const MockExam = lazy(() => import('./MockExam'));
const StudyGuide = lazy(() => import('./StudyGuide'));

type PermitTab = 'overview' | 'study' | 'practice' | 'mock';

export default function SCPermitExam({ onBackToHub }: ExamHubNav) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState<PermitTab>('overview');

  const ACCENT = isDark ? '#4DB6AC' : '#00796B';
  const PAGE_BG = isDark ? '#091513' : '#F3FBFA';
  const CARD_BG = isDark ? '#102220' : '#FFFFFF';
  const BORDER = isDark ? '#214440' : '#CFEAE7';
  const TEXT_PRI = isDark ? '#E7FFFB' : '#12312D';
  const TEXT_SEC = isDark ? '#9FD4CD' : '#4D6B67';
  const ACCENT_BG = isDark ? 'rgba(77, 182, 172, 0.14)' : '#E0F2F1';

  const featuredCards = flashcardDeck.slice(0, 4);
  const featuredTerms = glossary.slice(0, 6);
  const loading = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
      <CircularProgress sx={{ color: ACCENT }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: PAGE_BG }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
        <Button startIcon={<BackIcon />} onClick={onBackToHub} sx={{ mb: 2, color: TEXT_SEC, textTransform: 'none' }}>
          Exam Hub
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            borderRadius: 2,
            color: '#fff',
            background: isDark
              ? 'linear-gradient(135deg, #0F2E2A 0%, #134E4A 100%)'
              : 'linear-gradient(135deg, #00796B 0%, #26A69A 100%)',
          }}
        >
          <Stack spacing={1.5}>
            <Typography variant="h4" fontWeight={900}>
              South Carolina Learner's Permit Prep
            </Typography>
            <Typography sx={{ opacity: 0.92, maxWidth: 760 }}>
              Teen-friendly study help with a real-test mock, instant-feedback practice, and quick explainers that keep things chill instead of boring.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip label="30-question mock exam" sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' }} />
              <Chip label="Need 24/30 to pass" sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' }} />
              <Chip label={`${flashcardDeck.length} flashcards`} sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' }} />
              <Chip label={`${glossary.length} glossary terms`} sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' }} />
            </Stack>
          </Stack>
        </Paper>

        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: TEXT_SEC, textTransform: 'none', fontWeight: 700 },
            '& .Mui-selected': { color: ACCENT },
            '& .MuiTabs-indicator': { backgroundColor: ACCENT },
          }}
        >
          <Tab value="overview" label="Overview" icon={<AutoStories />} iconPosition="start" />
          <Tab value="study" label="Study Guide" icon={<AutoStories />} iconPosition="start" />
          <Tab value="practice" label="Practice" icon={<Quiz />} iconPosition="start" />
          <Tab value="mock" label="Mock Exam" icon={<DirectionsCar />} iconPosition="start" />
        </Tabs>

        {tab === 'overview' && (
          <Stack spacing={2}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
              <Stack spacing={1.5}>
                <Typography variant="h5" sx={{ color: TEXT_PRI, fontWeight: 800 }}>
                  Here's the move 😎
                </Typography>
                <Typography sx={{ color: TEXT_PRI, lineHeight: 1.7 }}>
                  Start with Practice Mode if you want instant feedback and confidence boosts. Jump into Mock Exam when you want the real DMV-style pressure: 30 questions, no going back, and a 24/30 target.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                  <Button variant="contained" onClick={() => setTab('practice')} sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: ACCENT }, textTransform: 'none', fontWeight: 800 }}>
                    Start Practice
                  </Button>
                  <Button variant="outlined" onClick={() => setTab('mock')} sx={{ borderColor: ACCENT, color: ACCENT, textTransform: 'none', fontWeight: 800 }}>
                    Take Mock Exam
                  </Button>
                  <Button variant="outlined" onClick={() => setTab('study')} sx={{ borderColor: BORDER, color: TEXT_PRI, textTransform: 'none', fontWeight: 700 }}>
                    Review Study Guide
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Paper elevation={0} sx={{ p: 3, flex: 1, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
                <Typography sx={{ color: TEXT_PRI, fontWeight: 800, mb: 1 }}>Flashcard preview</Typography>
                <Stack spacing={1.5}>
                  {featuredCards.map((card) => (
                    <Stack key={card.id} direction="row" spacing={1.5} alignItems="flex-start">
                      {card.imageBack && (
                        <Box sx={{ flexShrink: 0 }}>
                          <ExamImage imageKey={card.imageBack} alt={card.back} size={56} />
                        </Box>
                      )}
                      <Box>
                        <Typography sx={{ color: TEXT_PRI, fontWeight: 700 }}>{card.front}</Typography>
                        <Typography variant="body2" sx={{ color: TEXT_SEC, mt: 0.5 }}>{card.back}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ p: 3, flex: 1, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
                <Typography sx={{ color: TEXT_PRI, fontWeight: 800, mb: 1 }}>Glossary preview</Typography>
                <Stack spacing={1.25}>
                  {featuredTerms.map((entry) => (
                    <Box key={entry.term}>
                      <Typography sx={{ color: TEXT_PRI, fontWeight: 700 }}>{entry.term}</Typography>
                      <Typography variant="body2" sx={{ color: TEXT_SEC }}>{entry.definition}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Stack>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: ACCENT_BG, border: `1px solid ${BORDER}` }}>
              <Typography sx={{ color: TEXT_PRI, fontWeight: 800, mb: 0.75 }}>
                Quick reminder 💚
              </Typography>
              <Typography sx={{ color: TEXT_PRI }}>
                Missing a question in practice is not failing — it's exactly how you get ready to pass.
              </Typography>
            </Paper>
          </Stack>
        )}

        {tab === 'study' && <Suspense fallback={loading}><StudyGuide /></Suspense>}
        {tab === 'practice' && <Suspense fallback={loading}><Practice /></Suspense>}
        {tab === 'mock' && <Suspense fallback={loading}><MockExam /></Suspense>}
      </Box>
    </Box>
  );
}
