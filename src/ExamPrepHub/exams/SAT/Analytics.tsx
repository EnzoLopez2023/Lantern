// SAT Analytics — scoring, domain breakdowns, and progress tracking.

import { useMemo } from 'react';
import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  allQuestions,
  DOMAIN_META,
} from './questions';
import {
  loadStats,
  rollingAccuracy,
  countDue,
} from '../../shared/drillStats';
import { loadStreak } from '../../shared/streak';
import { calculateSectionScoreStats } from './scoreSummary';

const EXAM_ID = 'SAT';

// Simplified raw-to-scaled conversion
function estimateScaledScore(correct: number, total: number): number {
  if (total === 0) return 200;
  const pct = correct / total;
  return Math.min(800, Math.max(200, Math.round(200 + pct * 600)));
}

export default function Analytics() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT = isDark ? '#5B9BD5' : '#003366';
  const CARD_BG = isDark ? '#1B2838' : '#FFFFFF';
  const BORDER = isDark ? '#2D4A6A' : '#D4E3F5';
  const TEXT_PRI = isDark ? '#E8F0FE' : '#0D1B2A';
  const TEXT_SEC = isDark ? '#8BACC8' : '#4A6D8C';
  const GOOD = isDark ? '#7BAF85' : '#2E7D32';
  const WARN = isDark ? '#E8A838' : '#ED6C02';
  const BAD = isDark ? '#D88366' : '#C62828';

  const stats = useMemo(() => loadStats(EXAM_ID), []);
  const streak = useMemo(() => loadStreak(EXAM_ID), []);
  const accuracy = useMemo(() => {
    const value = rollingAccuracy(stats).accuracy;
    return Number.isNaN(value) ? 0 : value;
  }, [stats]);
  const dueCount = useMemo(() => countDue(stats, allQuestions), [stats]);

  // Calculate per-section stats
  const sectionStats = useMemo(() => calculateSectionScoreStats(allQuestions, stats), [stats]);

  // Per-domain breakdown
  const domainStats = useMemo(() => {
    const result: Record<string, { correct: number; total: number; attempted: number }> = {};
    for (const q of allQuestions) {
      if (!result[q.domain]) result[q.domain] = { correct: 0, total: 0, attempted: 0 };
      result[q.domain].total++;
      const s = stats[q.id];
      if (s && s.attempts > 0) {
        result[q.domain].attempted++;
        result[q.domain].correct += s.lastResult === 'correct' ? 1 : 0;
      }
    }
    return result;
  }, [stats]);

  const rwScaled = estimateScaledScore(sectionStats.rw.correct, sectionStats.rw.attempted || 1);
  const mathScaled = estimateScaledScore(sectionStats.math.correct, sectionStats.math.attempted || 1);
  const totalScaled = sectionStats.rw.attempted + sectionStats.math.attempted > 0
    ? rwScaled + mathScaled
    : 0;

  const totalAttempted = sectionStats.rw.attempted + sectionStats.math.attempted;
  const totalQuestions = allQuestions.length;

  return (
    <Stack spacing={3}>
      {/* Score overview */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
        <Typography variant="overline" sx={{ color: TEXT_SEC }}>Estimated SAT Score</Typography>
        <Typography variant="h2" fontWeight={800} sx={{ color: totalScaled > 0 ? ACCENT : TEXT_SEC }}>
          {totalScaled > 0 ? totalScaled : '—'}
        </Typography>
        <Typography variant="body2" sx={{ color: TEXT_SEC, mb: 3 }}>
          {totalScaled > 0 ? 'out of 1600' : 'Complete some practice to see your estimated score'}
        </Typography>

        <Stack direction="row" justifyContent="center" spacing={4}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: TEXT_PRI }}>
              {sectionStats.rw.attempted > 0 ? rwScaled : '—'}
            </Typography>
            <Typography variant="caption" sx={{ color: TEXT_SEC }}>Reading & Writing</Typography>
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: TEXT_PRI }}>
              {sectionStats.math.attempted > 0 ? mathScaled : '—'}
            </Typography>
            <Typography variant="caption" sx={{ color: TEXT_SEC }}>Math</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Quick stats row */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <StatCard label="Questions Practiced" value={`${totalAttempted}/${totalQuestions}`} sub={`${Math.round((totalAttempted / totalQuestions) * 100)}% coverage`} cardBg={CARD_BG} border={BORDER} textPri={TEXT_PRI} textSec={TEXT_SEC} />
        <StatCard label="Rolling Accuracy" value={`${Math.round(accuracy * 100)}%`} sub={accuracy >= 0.7 ? 'Strong' : accuracy >= 0.4 ? 'Building' : 'Needs work'} cardBg={CARD_BG} border={BORDER} textPri={TEXT_PRI} textSec={TEXT_SEC} />
        <StatCard label="Due for Review" value={`${dueCount}`} sub="Spaced repetition" cardBg={CARD_BG} border={BORDER} textPri={TEXT_PRI} textSec={TEXT_SEC} />
        <StatCard label="Study Streak" value={`${streak.currentStreak} days`} sub={`Best: ${streak.longestStreak} days`} cardBg={CARD_BG} border={BORDER} textPri={TEXT_PRI} textSec={TEXT_SEC} />
      </Stack>

      {/* Domain breakdown */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: TEXT_PRI, mb: 2 }}>
          Domain Performance
        </Typography>

        {/* Reading & Writing */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: ACCENT, mb: 1, mt: 1 }}>
          📖 Reading & Writing
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {Object.entries(DOMAIN_META)
            .filter(([, m]) => m.section === 'reading-writing')
            .map(([key, meta]) => {
              const ds = domainStats[key] || { correct: 0, total: 0, attempted: 0 };
              const pct = ds.attempted > 0 ? (ds.correct / ds.attempted) * 100 : 0;
              return (
                <DomainBar
                  key={key}
                  label={meta.label}
                  correct={ds.correct}
                  attempted={ds.attempted}
                  total={ds.total}
                  pct={pct}
                  textPri={TEXT_PRI}
                  textSec={TEXT_SEC}
                  good={GOOD}
                  warn={WARN}
                  bad={BAD}
                  isDark={isDark}
                />
              );
            })}
        </Stack>

        {/* Math */}
        <Typography variant="subtitle2" fontWeight={600} sx={{ color: ACCENT, mb: 1 }}>
          🧮 Math
        </Typography>
        <Stack spacing={1.5}>
          {Object.entries(DOMAIN_META)
            .filter(([, m]) => m.section === 'math')
            .map(([key, meta]) => {
              const ds = domainStats[key] || { correct: 0, total: 0, attempted: 0 };
              const pct = ds.attempted > 0 ? (ds.correct / ds.attempted) * 100 : 0;
              return (
                <DomainBar
                  key={key}
                  label={meta.label}
                  correct={ds.correct}
                  attempted={ds.attempted}
                  total={ds.total}
                  pct={pct}
                  textPri={TEXT_PRI}
                  textSec={TEXT_SEC}
                  good={GOOD}
                  warn={WARN}
                  bad={BAD}
                  isDark={isDark}
                />
              );
            })}
        </Stack>
      </Paper>

      {/* Readiness assessment */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: TEXT_PRI, mb: 2 }}>
          📊 Readiness Assessment
        </Typography>
        <ReadinessGauge
          accuracy={accuracy}
          coverage={totalAttempted / totalQuestions}
          textPri={TEXT_PRI}
          textSec={TEXT_SEC}
          good={GOOD}
          warn={WARN}
          bad={BAD}
        />
      </Paper>
    </Stack>
  );
}

function StatCard({ label, value, sub, cardBg, border, textPri, textSec }: {
  label: string; value: string; sub: string;
  cardBg: string; border: string; textPri: string; textSec: string;
}) {
  return (
    <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 2, bgcolor: cardBg, border: `1px solid ${border}`, textAlign: 'center' }}>
      <Typography variant="caption" sx={{ color: textSec }}>{label}</Typography>
      <Typography variant="h6" fontWeight={700} sx={{ color: textPri }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: textSec }}>{sub}</Typography>
    </Paper>
  );
}

function DomainBar({ label, correct, attempted, total, pct, textPri, textSec, good, warn, bad, isDark }: {
  label: string; correct: number; attempted: number; total: number; pct: number;
  textPri: string; textSec: string; good: string; warn: string; bad: string; isDark: boolean;
}) {
  const barColor = pct >= 70 ? good : pct >= 40 ? warn : bad;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ color: textPri }}>{label}</Typography>
        <Typography variant="body2" fontWeight={600} sx={{ color: attempted > 0 ? barColor : textSec }}>
          {attempted > 0 ? `${Math.round(pct)}% (${correct}/${attempted})` : `0/${total} practiced`}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={attempted > 0 ? pct : 0}
        sx={{
          height: 6,
          borderRadius: 2,
          bgcolor: isDark ? '#2D4A6A' : '#E0E8F0',
          '& .MuiLinearProgress-bar': { bgcolor: attempted > 0 ? barColor : textSec },
        }}
      />
    </Box>
  );
}

function ReadinessGauge({ accuracy, coverage, textPri, textSec, good, warn, bad }: {
  accuracy: number; coverage: number;
  textPri: string; textSec: string; good: string; warn: string; bad: string;
}) {
  const readiness = (accuracy * 0.6 + coverage * 0.4);
  const level = readiness >= 0.7 ? 'Ready' : readiness >= 0.4 ? 'Building' : 'Early Stage';
  const levelColor = readiness >= 0.7 ? good : readiness >= 0.4 ? warn : bad;
  const tips = readiness >= 0.7
    ? ['You\'re performing well! Focus on hard questions and weak domains.', 'Take a full adaptive test to confirm your score.']
    : readiness >= 0.4
    ? ['Keep practicing — focus on your weakest domains.', 'Use adaptive mode to target areas that need improvement.', 'Aim for 70%+ accuracy before the test.']
    : ['Start with the Study Guide to review core concepts.', 'Practice easy and medium questions first to build confidence.', 'Consistency is key — try to practice daily.'];

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ position: 'relative', width: 80, height: 80 }}>
          <svg width={80} height={80} viewBox="0 0 80 80">
            <circle cx={40} cy={40} r={35} fill="none" stroke={bad} strokeWidth={6} opacity={0.2} />
            <circle
              cx={40} cy={40} r={35}
              fill="none"
              stroke={levelColor}
              strokeWidth={6}
              strokeDasharray={`${readiness * 220} 220`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: levelColor }}
          >
            {Math.round(readiness * 100)}%
          </Typography>
        </Box>
        <Box>
          <Chip label={level} size="small" sx={{ bgcolor: levelColor, color: '#fff', fontWeight: 600, mb: 0.5 }} />
          <Typography variant="body2" sx={{ color: textSec }}>
            Based on {Math.round(accuracy * 100)}% accuracy and {Math.round(coverage * 100)}% question coverage
          </Typography>
        </Box>
      </Stack>
      <Stack spacing={0.5}>
        {tips.map((tip, i) => (
          <Typography key={i} variant="body2" sx={{ color: textPri }}>• {tip}</Typography>
        ))}
      </Stack>
    </Stack>
  );
}
