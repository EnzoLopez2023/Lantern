// USHC prep suite shell. Top-tab UI (Study Guide / Practice / Sandbox /
// Diagnostic) for SC's U.S. History and the Constitution end-of-course exam.

import { useEffect, useState, lazy, Suspense } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  School as StudyIcon,
  Quiz as PracticeIcon,
  Style as FlashcardsIcon,
  Assignment as SandboxIcon,
  TrendingUp as DiagnosticIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import type { ExamHubNav } from '../../types';
import { findExam } from '../../exams';
import UnifiedSearch from './UnifiedSearch';

const StudyGuide = lazy(() => import('./StudyGuide'));
const Practice = lazy(() => import('./Practice'));
const Flashcards = lazy(() => import('./Flashcards'));
const ExamSandbox = lazy(() => import('./ExamSandbox'));
const Diagnostic = lazy(() => import('./Diagnostic'));

const TABS = [
  { id: 'guide',      label: 'Study Guide',  Icon: StudyIcon,       sub: 'Concepts with analogies and quick-checks' },
  { id: 'practice',   label: 'Practice',     Icon: PracticeIcon,    sub: 'Drill + weak-spot training' },
  { id: 'flashcards', label: 'Flashcards',   Icon: FlashcardsIcon,  sub: 'Concept cards with spaced repetition' },
  { id: 'sandbox',    label: 'EOCEP Sandbox',Icon: SandboxIcon,     sub: 'Timed end-of-course exam simulation' },
  { id: 'diagnostic', label: 'Diagnostic',   Icon: DiagnosticIcon,  sub: 'Readiness estimate' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function USHCExam({ onBackToHub }: ExamHubNav) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState<TabId>('guide');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const ACCENT     = isDark ? '#C77AA0' : '#5C2A4A';
  const PAGE_BG    = isDark ? '#20212A' : '#EFE4D2';
  const CARD_BG    = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER     = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI   = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC   = isDark ? '#A6A4AE' : '#6E5E40';

  const exam = findExam('USHC');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: PAGE_BG }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Button
            size="small"
            startIcon={<BackIcon />}
            onClick={onBackToHub}
            sx={{
              color: TEXT_SEC,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent', color: ACCENT },
            }}
          >
            All exams
          </Button>
          <Button
            size="small"
            startIcon={<SearchIcon fontSize="small" />}
            onClick={() => setSearchOpen(true)}
            sx={{
              color: TEXT_SEC,
              textTransform: 'none',
              borderRadius: 1.5,
              border: `1px solid ${BORDER}`,
              px: 1.5,
              '&:hover': { borderColor: ACCENT, color: ACCENT, backgroundColor: 'transparent' },
            }}
          >
            Search <kbd style={{ marginLeft: 8, fontSize: '0.7rem', opacity: 0.6 }}>Ctrl+K</kbd>
          </Button>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 2,
            mb: 2,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v: TabId) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: 56,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.92rem',
                color: TEXT_SEC,
                minHeight: 56,
                px: 2,
                '&.Mui-selected': { color: ACCENT },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: ACCENT,
                height: 3,
              },
            }}
          >
            {TABS.map(t => (
              <Tab key={t.id} value={t.id} icon={<t.Icon fontSize="small" />} iconPosition="start" label={t.label} />
            ))}
          </Tabs>
        </Paper>

        {exam && (
          <Paper
            elevation={0}
            sx={{
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              p: { xs: 2.5, md: 3 },
              mb: 2,
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-start' } }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  <Chip
                    label={exam.code}
                    size="small"
                    sx={{
                      backgroundColor: alpha(ACCENT, 0.15),
                      color: ACCENT,
                      fontWeight: 800,
                      letterSpacing: 0.5,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: TEXT_SEC, fontWeight: 600 }}>
                    {exam.vendor} · {exam.title}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    fontFamily: 'var(--hearth-heading)',
                    fontSize: { xs: '1.6rem', md: '2rem' },
                    fontWeight: 700,
                    color: TEXT_PRI,
                    lineHeight: 1.15,
                    letterSpacing: '-0.01em',
                    mb: 1,
                  }}
                >
                  {currentTabHeading(tab)}
                </Typography>
                <Typography sx={{ color: TEXT_SEC, fontSize: '0.93rem', lineHeight: 1.6 }}>
                  {currentTabSubtitle(tab)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        <Box>
          <Suspense
            fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: ACCENT }} />
              </Box>
            }
          >
            {tab === 'guide' && <StudyGuide />}
            {tab === 'practice' && <Practice />}
            {tab === 'flashcards' && <Flashcards />}
            {tab === 'sandbox' && <ExamSandbox />}
            {tab === 'diagnostic' && <Diagnostic />}
          </Suspense>
        </Box>
      </Box>

      <UnifiedSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(target) => {
          if (target.type === 'glossary' || target.type === 'section') setTab('guide');
          else if (target.type === 'flashcard') setTab('flashcards');
          else if (target.type === 'question') setTab('practice');
        }}
      />
    </Box>
  );
}

function currentTabHeading(tab: TabId): string {
  switch (tab) {
    case 'guide':      return 'U.S. History and the Constitution';
    case 'practice':   return 'Practice Questions';
    case 'flashcards': return 'Concept Flashcards';
    case 'sandbox':    return 'EOCEP Sandbox';
    case 'diagnostic': return 'Readiness Diagnostic';
  }
}

function currentTabSubtitle(tab: TabId): string {
  switch (tab) {
    case 'guide':
      return 'Each era gets context, key people and events, and a "quick check" at the end of every section so you can verify the ideas landed. Callouts mix Watch For, Why It Matters, Make It Stick, In Plain Words, Try This, Connect, and Coach\'s Notes — read every one.';
    case 'practice':
      return 'Four modes: Browse, Adaptive (difficulty tracks your accuracy), Weak Spots (re-serves missed questions), and Due Review (spaced repetition). Daily Warmup with streak tracking.';
    case 'flashcards':
      return 'Short concept cards with SM-2 spaced repetition. Rate each one — forgot, almost, got it — and the deck schedules the next review accordingly.';
    case 'sandbox':
      return 'A timed simulation modeled on the SC EOCEP. Counts down, flags for review, breakdown by era. Your EOCEP counts 20% of your final course grade — practice the time pressure here first.';
    case 'diagnostic':
      return 'Subdomain-weighted accuracy from your last Drill answers, mapped to an estimated readiness number. Tells you if you\'re ready.';
  }
}
