// Study Hub — marketing-style landing that introduces the hub, followed by
// category-grouped exam cards (SC 11th-grade curriculum, SC permit, SAT).
// Click a card to enter that track's study suite. IT certification prep lives
// in the Cairn repo now.

import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  SchoolOutlined,
  QuizOutlined,
  InsightsOutlined,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import { EXAMS } from './exams';
import type { ExamMeta, ExamLevel, ExamCategory } from './types';

const CATEGORY_ORDER: ExamCategory[] = ['High School', 'Misc'];

const CATEGORY_BLURBS: Record<ExamCategory, string> = {
  'High School': 'SC 11th-grade subject prep, the SC permit test, and the SAT.',
  'Misc':        'Everything else.',
};

const SATExam      = lazy(() => import('./exams/SAT'));
const SCPermitExam = lazy(() => import('./exams/SCPERMIT'));
const USHCExam     = lazy(() => import('./exams/USHC'));
const ALG1Exam     = lazy(() => import('./exams/ALG1'));
const ENG2Exam     = lazy(() => import('./exams/ENG2'));
const BIO1Exam     = lazy(() => import('./exams/BIO1'));
const ENG3Exam     = lazy(() => import('./exams/ENG3'));
const ALG2Exam     = lazy(() => import('./exams/ALG2'));
const PRECALCExam  = lazy(() => import('./exams/PRECALC'));
const PROBSTATExam = lazy(() => import('./exams/PROBSTAT'));
const CHEMExam     = lazy(() => import('./exams/CHEM'));
const PHYSExam     = lazy(() => import('./exams/PHYS'));
const ENVSCIExam   = lazy(() => import('./exams/ENVSCI'));
const PFINExam     = lazy(() => import('./exams/PFIN'));

const SERIF = 'var(--hearth-heading)';

interface Feature { Icon: SvgIconComponent; title: string; desc: string }
const FEATURES: Feature[] = [
  {
    Icon: SchoolOutlined,
    title: 'End-of-course classes',
    desc: 'Every SC junior-year EOCEP-tested subject — USHC, Algebra 1, English 2, Biology 1 — with a study guide, glossary, and timed sandbox attempts.',
  },
  {
    Icon: QuizOutlined,
    title: 'Adaptive drill practice',
    desc: 'Section quick-checks plus a practice tab that weighs your weak spots and re-queues missed questions until they stick.',
  },
  {
    Icon: InsightsOutlined,
    title: 'Standardized & permit prep',
    desc: 'SAT and the SC learner’s permit sit alongside your school subjects, so everything you need this year lives in one hub.',
  },
];

interface ExamPrepHubProps {
  examId?: string;
  onExamChange?: (examId: string | null) => void;
}

export default function ExamPrepHub({ examId, onExamChange }: ExamPrepHubProps = {}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const initialExam = EXAMS.some(exam => exam.id === examId && exam.status === 'active') ? examId ?? null : null;
  const [activeExamId, setActiveExamId] = useState<string | null>(initialExam);
  const tracksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveExamId(EXAMS.some(exam => exam.id === examId && exam.status === 'active') ? examId ?? null : null);
  }, [examId]);

  const selectExam = (next: string | null) => {
    setActiveExamId(next);
    onExamChange?.(next);
  };

  const ACCENT   = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG  = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER   = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const WHITE    = isDark ? '#F5EFE3' : '#FFFFFF';
  const ACCENT_HOVER = isDark ? '#9E5C84' : '#3F1A33';

  const renderActiveExam = () => {
    const wrap = (node: React.ReactNode) => (
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress sx={{ color: ACCENT }} />
          </Box>
        }
      >
        {node}
      </Suspense>
    );
    const back = () => selectExam(null);
    switch (activeExamId) {
      case 'SAT':      return wrap(<SATExam onBackToHub={back} />);
      case 'SCPERMIT': return wrap(<SCPermitExam onBackToHub={back} />);
      case 'USHC':     return wrap(<USHCExam onBackToHub={back} />);
      case 'ALG1':     return wrap(<ALG1Exam onBackToHub={back} />);
      case 'ENG2':     return wrap(<ENG2Exam onBackToHub={back} />);
      case 'BIO1':     return wrap(<BIO1Exam onBackToHub={back} />);
      case 'ENG3':     return wrap(<ENG3Exam onBackToHub={back} />);
      case 'ALG2':     return wrap(<ALG2Exam onBackToHub={back} />);
      case 'PRECALC':  return wrap(<PRECALCExam onBackToHub={back} />);
      case 'PROBSTAT': return wrap(<PROBSTATExam onBackToHub={back} />);
      case 'CHEM':     return wrap(<CHEMExam onBackToHub={back} />);
      case 'PHYS':     return wrap(<PHYSExam onBackToHub={back} />);
      case 'ENVSCI':   return wrap(<ENVSCIExam onBackToHub={back} />);
      case 'PFIN':     return wrap(<PFINExam onBackToHub={back} />);
      default:         return null;
    }
  };

  if (activeExamId) return renderActiveExam();

  const scrollToTracks = () => {
    tracksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeTrackCount = EXAMS.filter(e => e.status === 'active').length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // Transparent so the themed 'scholar' wallpaper (App-level) shows through.
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        '@keyframes hubFadeUp': {
          from: { opacity: 0, transform: 'translateY(14px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      {/* Background blobs — soft warm gradients sitting behind the hero */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute', top: -140, left: -140,
          width: 520, height: 520, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(199,122,160,0.16) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(200,165,105,0.14) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }} />
        <Box sx={{
          position: 'absolute', top: 80, right: -120,
          width: 460, height: 460, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(220,184,122,0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(92,42,74,0.10) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }} />
        <Box sx={{
          position: 'absolute', top: '38%', left: '20%',
          width: 320, height: 320, borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(199,122,160,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(92,42,74,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </Box>

      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          px: { xs: 2.5, md: 6 },
          pt: { xs: 5, md: 8 },
          pb: { xs: 5, md: 7 },
          maxWidth: 900,
          mx: 'auto',
        }}
      >
        <Box sx={{ animation: 'hubFadeUp 0.5s ease-out both' }}>
          <Typography sx={{
            fontSize: { xs: '0.62rem', md: '0.68rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: ACCENT,
            fontWeight: 700,
            mb: { xs: 2, md: 2.5 },
          }}>
            SC high school · SAT · permit
          </Typography>
        </Box>

        <Box sx={{ animation: 'hubFadeUp 0.5s ease-out 0.08s both' }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: SERIF,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              fontWeight: 700,
              color: TEXT_PRI,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              maxWidth: 720,
              mx: 'auto',
              mb: 0.5,
            }}
          >
            Your personal study coach for
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontFamily: SERIF,
              fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
              fontWeight: 700,
              color: ACCENT,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              maxWidth: 720,
              mx: 'auto',
              mb: { xs: 2.5, md: 3 },
            }}
          >
            junior year and beyond.
          </Typography>
        </Box>

        <Box sx={{ animation: 'hubFadeUp 0.5s ease-out 0.16s both' }}>
          <Typography sx={{
            fontSize: { xs: '0.95rem', md: '1.08rem' },
            color: TEXT_SEC,
            maxWidth: 560,
            mx: 'auto',
            lineHeight: 1.75,
            mb: { xs: 3, md: 4 },
          }}>
            End-of-course prep for the SC 11th-grade curriculum, the SC learner&apos;s permit, and the SAT —
            with study guides, drilled practice, flashcards, and timed sandbox exams.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={scrollToTracks}
            endIcon={<ArrowDownIcon sx={{ fontSize: '1rem !important' }} />}
            sx={{
              backgroundColor: ACCENT,
              color: WHITE,
              borderRadius: 10,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: { xs: '0.95rem', md: '1rem' },
              px: { xs: 3.5, md: 4.5 },
              py: { xs: 1.2, md: 1.4 },
              boxShadow: isDark
                ? '0 8px 24px rgba(199,122,160,0.32)'
                : '0 8px 24px rgba(92,42,74,0.30)',
              '&:hover': {
                backgroundColor: ACCENT_HOVER,
                boxShadow: isDark
                  ? '0 12px 32px rgba(199,122,160,0.42)'
                  : '0 12px 32px rgba(92,42,74,0.38)',
              },
            }}
          >
            Start studying
          </Button>

          <Typography sx={{
            mt: 2,
            color: TEXT_SEC,
            fontSize: '0.75rem',
          }}>
            {activeTrackCount} track{activeTrackCount === 1 ? '' : 's'} ready · progress saves locally
          </Typography>
        </Box>
      </Box>

      {/* Feature cards */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 5 },
          pb: { xs: 5, md: 8 },
          maxWidth: 1000,
          mx: 'auto',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, md: 2.5 }}
        >
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <Box
              key={title}
              sx={{
                flex: 1,
                animation: `hubFadeUp 0.5s ease-out ${0.22 + i * 0.08}s both`,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: '100%',
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 2,
                }}
              >
                <Box sx={{
                  width: 40, height: 40, borderRadius: '10px',
                  backgroundColor: alpha(ACCENT, isDark ? 0.18 : 0.10),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: ACCENT, mb: 1.75,
                }}>
                  <Icon sx={{ fontSize: 20 }} />
                </Box>
                <Typography sx={{
                  fontFamily: SERIF,
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  color: TEXT_PRI,
                  mb: 0.75,
                  lineHeight: 1.3,
                }}>
                  {title}
                </Typography>
                <Typography sx={{ color: TEXT_SEC, fontSize: '0.86rem', lineHeight: 1.7 }}>
                  {desc}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Tracks — preserved category-grouped grid */}
      <Box
        ref={tracksRef}
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1100,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          pb: 6,
          scrollMarginTop: '16px',
        }}
      >
        <Box sx={{ mb: 3, textAlign: { xs: 'left', md: 'center' } }}>
          <Typography sx={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: TEXT_SEC,
            mb: 1,
          }}>
            Pick a track
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: { xs: '1.6rem', md: '2rem' },
              color: TEXT_PRI,
              letterSpacing: '-0.015em',
              lineHeight: 1.2,
            }}
          >
            Available study tracks
          </Typography>
        </Box>

        {CATEGORY_ORDER.map(category => {
          const examsInCategory = EXAMS.filter(e => (e.category ?? 'Misc') === category);
          if (examsInCategory.length === 0) return null;
          return (
            <Box key={category} sx={{ mb: 4 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography
                  sx={{
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: TEXT_PRI,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {category}
                </Typography>
                <Typography sx={{ color: TEXT_SEC, fontSize: '0.82rem' }}>
                  {CATEGORY_BLURBS[category]}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                {examsInCategory.map(exam => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onOpen={() => selectExam(exam.id)}
                    colors={{ ACCENT, CARD_BG, BORDER, TEXT_PRI, TEXT_SEC, isDark }}
                  />
                ))}
              </Box>
            </Box>
          );
        })}

        <Box sx={{ mt: 4, p: 2.5, borderRadius: 2, border: `1px dashed ${BORDER}`, backgroundColor: 'transparent' }}>
          <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem' }}>
            <strong style={{ color: TEXT_PRI }}>More tracks coming.</strong> The hub is built to host any number of
            exams — drop a new folder under <code>src/ExamPrepHub/exams/&lt;code&gt;</code>, register it in{' '}
            <code>exams.ts</code>, and it shows up here.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function ExamCard({
  exam,
  onOpen,
  colors,
}: {
  exam: ExamMeta;
  onOpen: () => void;
  colors: { ACCENT: string; CARD_BG: string; BORDER: string; TEXT_PRI: string; TEXT_SEC: string; isDark: boolean };
}) {
  const { ACCENT, CARD_BG, BORDER, TEXT_PRI, TEXT_SEC, isDark } = colors;
  const disabled = exam.status !== 'active';
  return (
    <Paper
      elevation={0}
      onClick={disabled ? undefined : onOpen}
      sx={{
        p: 3,
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'border-color 0.15s, transform 0.1s, box-shadow 0.15s',
        '&:hover': disabled
          ? {}
          : {
              borderColor: ACCENT,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(ACCENT, isDark ? 0.25 : 0.15)}`,
            },
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', rowGap: 0.5 }}>
            <Chip
              size="small"
              label={exam.code}
              sx={{
                backgroundColor: alpha(ACCENT, 0.15),
                color: ACCENT,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            />
            <Typography variant="caption" sx={{ color: TEXT_SEC, fontWeight: 600 }}>
              {exam.vendor}
            </Typography>
            {exam.level && <LevelChip level={exam.level} accent={ACCENT} border={BORDER} textSec={TEXT_SEC} isDark={isDark} />}
          </Stack>
          <Typography
            sx={{
              fontFamily: 'var(--hearth-heading)',
              fontSize: '1.3rem',
              fontWeight: 700,
              color: TEXT_PRI,
              lineHeight: 1.2,
            }}
          >
            {exam.title}
          </Typography>
        </Box>
        {exam.status === 'coming-soon' && (
          <Chip size="small" label="Coming soon" variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
        )}
      </Stack>

      <Typography sx={{ color: TEXT_SEC, fontSize: '0.88rem', lineHeight: 1.6, mb: 2 }}>
        {exam.tagline}
      </Typography>

      {exam.domains && exam.domains.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {exam.domains.map(d => (
            <Chip
              key={d.label}
              size="small"
              label={`${d.label} · ${d.weight}`}
              variant="outlined"
              sx={{ borderColor: BORDER, color: TEXT_SEC, fontSize: '0.72rem' }}
            />
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {exam.questionCount != null && (
          <Stat label="Practice questions" value={exam.questionCount.toString()} color={TEXT_PRI} sub={TEXT_SEC} />
        )}
        {exam.durationMin != null && (
          <Stat label="Duration" value={`${exam.durationMin} min`} color={TEXT_PRI} sub={TEXT_SEC} />
        )}
        {exam.passScore != null && (
          <Stat label="Pass score" value={`${exam.passScore}/1000`} color={ACCENT} sub={TEXT_SEC} />
        )}
      </Stack>
    </Paper>
  );
}

function Stat({ label, value, color, sub }: { label: string; value: string; color: string; sub: string }) {
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, color, fontSize: '1rem', lineHeight: 1 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: sub, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

function LevelChip({
  level,
  accent,
  border,
  textSec,
  isDark,
}: {
  level: ExamLevel;
  accent: string;
  border: string;
  textSec: string;
  isDark: boolean;
}) {
  const styles: Record<ExamLevel, { bg: string; fg: string; borderColor: string }> = {
    'Standardized Test':     { bg: alpha(accent, isDark ? 0.12 : 0.08),    fg: accent,  borderColor: alpha(accent, 0.25) },
    'High School Required':  { bg: alpha(accent, isDark ? 0.18 : 0.10),    fg: accent,  borderColor: alpha(accent, 0.35) },
    'High School Elective':  { bg: 'transparent',                          fg: textSec, borderColor: border },
  };
  const s = styles[level];
  return (
    <Chip
      size="small"
      label={level}
      sx={{
        backgroundColor: s.bg,
        color: s.fg,
        border: `1px solid ${s.borderColor}`,
        fontWeight: 700,
        fontSize: '0.68rem',
        height: 20,
        letterSpacing: 0.3,
      }}
    />
  );
}
