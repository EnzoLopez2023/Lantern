// SAT Exam Prep — Custom shell. Unlike the Microsoft cert tracks, this uses
// a section-based layout matching the SAT's two-section structure.

import { useState, lazy, Suspense } from 'react';
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
import { useTheme } from '@mui/material/styles';
import {
  ArrowBack as BackIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  MenuBook as StudyIcon,
  Analytics as AnalyticsIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import type { ExamHubNav } from '../../types';

const AdaptiveTest = lazy(() => import('./AdaptiveTest'));
const Practice = lazy(() => import('./Practice'));
const StudyGuide = lazy(() => import('./StudyGuide'));
const Analytics = lazy(() => import('./Analytics'));

type SATTab = 'overview' | 'adaptive' | 'practice' | 'study' | 'analytics';

export default function SATExam({ onBackToHub }: ExamHubNav) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [tab, setTab] = useState<SATTab>('overview');

  // SAT-specific color palette (blue/navy theme — College Board colors)
  const ACCENT = isDark ? '#5B9BD5' : '#003366';
  const ACCENT_LIGHT = isDark ? '#3A6B9F' : '#E8F0FE';
  const PAGE_BG = isDark ? '#0D1B2A' : '#F5F8FC';
  const CARD_BG = isDark ? '#1B2838' : '#FFFFFF';
  const BORDER = isDark ? '#2D4A6A' : '#D4E3F5';
  const TEXT_PRI = isDark ? '#E8F0FE' : '#0D1B2A';
  const TEXT_SEC = isDark ? '#8BACC8' : '#4A6D8C';

  const Loading = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
      <CircularProgress sx={{ color: ACCENT }} />
    </Box>
  );

  const renderTab = () => {
    switch (tab) {
      case 'adaptive':
        return <Suspense fallback={Loading}><AdaptiveTest /></Suspense>;
      case 'practice':
        return <Suspense fallback={Loading}><Practice /></Suspense>;
      case 'study':
        return <Suspense fallback={Loading}><StudyGuide /></Suspense>;
      case 'analytics':
        return <Suspense fallback={Loading}><Analytics /></Suspense>;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <Stack spacing={3}>
      {/* Hero */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          background: isDark
            ? 'linear-gradient(135deg, #1B2838 0%, #0D1B2A 100%)'
            : 'linear-gradient(135deg, #003366 0%, #005599 100%)',
          color: '#fff',
          border: `1px solid ${BORDER}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <SchoolIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>SAT Exam Prep</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Digital Adaptive SAT • College Board • 1000+ Questions
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 700 }}>
          Master the SAT with adaptive practice that mirrors the real exam's Module 1 → Module 2
          difficulty scaling. Covers all domains: Reading & Writing (Information & Ideas, Craft & Structure,
          Expression of Ideas, Conventions) and Math (Algebra, Advanced Math, Problem Solving & Data Analysis,
          Geometry & Trigonometry).
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label="400–1600 Score" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
          <Chip label="134 minutes" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
          <Chip label="Adaptive Testing" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
          <Chip label="No Calculator Needed" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
        </Stack>
      </Paper>

      {/* Quick-start cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <QuickCard
          title="Full Adaptive Test"
          description="Simulate the complete SAT experience: Module 1 sets your baseline, Module 2 adapts to your level."
          icon={<TimerIcon sx={{ fontSize: 32, color: ACCENT }} />}
          onClick={() => setTab('adaptive')}
          cardBg={CARD_BG}
          border={BORDER}
          textPri={TEXT_PRI}
          textSec={TEXT_SEC}
        />
        <QuickCard
          title="Practice by Domain"
          description="Focus on specific areas: drill Reading & Writing or Math questions with difficulty filters."
          icon={<QuizIcon sx={{ fontSize: 32, color: ACCENT }} />}
          onClick={() => setTab('practice')}
          cardBg={CARD_BG}
          border={BORDER}
          textPri={TEXT_PRI}
          textSec={TEXT_SEC}
        />
        <QuickCard
          title="Study Guide"
          description="Comprehensive review of all SAT topics with strategies, formulas, and examples."
          icon={<StudyIcon sx={{ fontSize: 32, color: ACCENT }} />}
          onClick={() => setTab('study')}
          cardBg={CARD_BG}
          border={BORDER}
          textPri={TEXT_PRI}
          textSec={TEXT_SEC}
        />
      </Stack>

      {/* Exam structure overview */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: TEXT_PRI, mb: 2 }}>
          SAT Structure (Digital 2025–2026)
        </Typography>
        <Stack spacing={1.5}>
          <SectionRow
            label="Reading & Writing"
            details="54 questions • 64 minutes • 2 adaptive modules"
            domains="Information & Ideas (26%) • Craft & Structure (28%) • Expression of Ideas (20%) • Conventions (26%)"
            textPri={TEXT_PRI}
            textSec={TEXT_SEC}
          />
          <SectionRow
            label="Math"
            details="44 questions • 70 minutes • 2 adaptive modules"
            domains="Algebra (35%) • Advanced Math (35%) • Problem Solving & Data (15%) • Geometry & Trig (15%)"
            textPri={TEXT_PRI}
            textSec={TEXT_SEC}
          />
          <Box sx={{ mt: 1, p: 1.5, borderRadius: 1, bgcolor: ACCENT_LIGHT }}>
            <Typography variant="body2" sx={{ color: TEXT_PRI, fontWeight: 500 }}>
              💡 The SAT is multistage adaptive: your performance on Module 1 determines the difficulty
              of Module 2 in each section. Our adaptive test mirrors this exact structure.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: PAGE_BG }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
        {/* Top bar */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={onBackToHub}
            sx={{ color: TEXT_SEC, textTransform: 'none' }}
          >
            Exam Hub
          </Button>
        </Stack>

        {/* Navigation tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mb: 3,
            '& .MuiTab-root': { color: TEXT_SEC, textTransform: 'none', fontWeight: 500 },
            '& .Mui-selected': { color: ACCENT },
            '& .MuiTabs-indicator': { backgroundColor: ACCENT },
          }}
        >
          <Tab value="overview" label="Overview" icon={<SchoolIcon />} iconPosition="start" />
          <Tab value="adaptive" label="Adaptive Test" icon={<TimerIcon />} iconPosition="start" />
          <Tab value="practice" label="Practice" icon={<QuizIcon />} iconPosition="start" />
          <Tab value="study" label="Study Guide" icon={<StudyIcon />} iconPosition="start" />
          <Tab value="analytics" label="Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
        </Tabs>

        {renderTab()}
      </Box>
    </Box>
  );
}

// --- Helper components ---

function QuickCard({ title, description, icon, onClick, cardBg, border, textPri, textSec }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  cardBg: string;
  border: string;
  textPri: string;
  textSec: string;
}) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: 3,
        flex: 1,
        borderRadius: 2,
        bgcolor: cardBg,
        border: `1px solid ${border}`,
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
      }}
    >
      {icon}
      <Typography variant="subtitle1" fontWeight={600} sx={{ color: textPri, mt: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: textSec, mt: 0.5 }}>
        {description}
      </Typography>
    </Paper>
  );
}

function SectionRow({ label, details, domains, textPri, textSec }: {
  label: string;
  details: string;
  domains: string;
  textPri: string;
  textSec: string;
}) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ color: textPri }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: textSec }}>{details}</Typography>
      <Typography variant="caption" sx={{ color: textSec, fontStyle: 'italic' }}>{domains}</Typography>
    </Box>
  );
}
