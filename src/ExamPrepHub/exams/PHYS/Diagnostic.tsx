import { useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CheckCircle as ReadyIcon,
  Warning as AlmostIcon,
  TrendingDown as NotYetIcon,
  Insights as InsightsIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { loadStats, summarizeBySubdomain } from '../../shared/drillStats';
import { questions } from './questions';
import { activityHeatmap, loadAttempts } from '../../shared/analytics';

const EXAM_ID = 'PHYS';

function accuracyToScore(acc: number): number {
  const clamped = Math.max(0, Math.min(1, acc));
  return Math.round(350 + clamped * 600);
}

interface DomainAgg {
  attempted: number;
  correct: number;
}

export default function Diagnostic() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const GOOD = isDark ? '#7BAF85' : '#3C6E4B';
  const WARN = isDark ? '#E2B26B' : '#B08139';
  const BAD = isDark ? '#D88366' : '#C75A2D';

  const { stats, summary, overall, attemptedCount } = useMemo(() => {
    const stats = loadStats(EXAM_ID);
    const summary = summarizeBySubdomain(stats, questions);

    const agg: DomainAgg = { attempted: 0, correct: 0 };
    for (const q of questions) {
      const st = stats[q.id];
      if (st && st.attempts > 0) {
        agg.attempted += 1;
        if (st.lastResult === 'correct') agg.correct += 1;
      }
    }

    const overall = {
      attempted: agg.attempted,
      correct: agg.correct,
      accuracy: agg.attempted === 0 ? NaN : agg.correct / agg.attempted,
    };

    return { stats, summary, overall, attemptedCount: agg.attempted };
  }, []);

  const hasEnoughData = attemptedCount >= 10;

  let estimatedScore = 0;
  let verdict: 'ready' | 'almost' | 'not-yet' | 'unknown' = 'unknown';

  if (!Number.isNaN(overall.accuracy)) {
    estimatedScore = accuracyToScore(overall.accuracy);
    if (estimatedScore >= 800) verdict = 'ready';
    else if (estimatedScore >= 700) verdict = 'almost';
    else verdict = 'not-yet';
  }

  const confidenceBreakdown = useMemo(() => {
    let confidentCorrect = 0, confidentWrong = 0, unsureCorrect = 0, unsureWrong = 0, guessCorrect = 0, guessWrong = 0;
    for (const s of Object.values(stats)) {
      if (s.attempts === 0 || !s.lastConfidence) continue;
      const correct = s.lastResult === 'correct';
      if (s.lastConfidence === 'confident') correct ? confidentCorrect++ : confidentWrong++;
      else if (s.lastConfidence === 'unsure') correct ? unsureCorrect++ : unsureWrong++;
      else if (s.lastConfidence === 'guess') correct ? guessCorrect++ : guessWrong++;
    }
    return { confidentCorrect, confidentWrong, unsureCorrect, unsureWrong, guessCorrect, guessWrong };
  }, [stats]);

  const verdictMeta = {
    ready:     { icon: <ReadyIcon />,   color: GOOD,   label: "You're ready",         blurb: 'Your practice accuracy maps to a strong score. Keep reviewing weak subdomains.' },
    almost:    { icon: <AlmostIcon />,  color: WARN,   label: 'Almost there',         blurb: 'Close to a strong score. Drill your weakest Physics subdomains before the test.' },
    'not-yet': { icon: <NotYetIcon />,  color: BAD,    label: 'Not yet — keep going', blurb: 'Below target. Focus on the weak subdomains below and revisit the study guide.' },
    unknown:   { icon: <InsightsIcon/>, color: ACCENT, label: 'Need more data',       blurb: 'Answer at least 10 questions in Practice mode to get a readiness estimate.' },
  }[verdict];

  const containerSx = { pb: 6 };

  return (
    <Box sx={containerSx}>
      <Paper elevation={0} sx={{ p: 3, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
          <Box sx={{ width: 110, height: 110, borderRadius: '50%', backgroundColor: `${verdictMeta.color}22`, border: `4px solid ${verdictMeta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: verdictMeta.color, fontFamily: 'var(--hearth-heading)' }}>
                {hasEnoughData ? estimatedScore : '—'}
              </Typography>
              <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', fontSize: '0.65rem' }}>/1000 est.</Typography>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ color: verdictMeta.color, display: 'flex' }}>{verdictMeta.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: verdictMeta.color }}>{verdictMeta.label}</Typography>
            </Stack>
            <Typography sx={{ color: TEXT_PRI, fontSize: '0.95rem', mb: 1.5, lineHeight: 1.5 }}>{verdictMeta.blurb}</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip size="small" label={`${attemptedCount} of ${questions.length} questions answered`}
                sx={{ borderColor: BORDER, color: TEXT_SEC, backgroundColor: 'transparent', border: `1px solid ${BORDER}` }} />
              {hasEnoughData && (
                <Chip size="small" label={`Overall accuracy ${(overall.accuracy * 100).toFixed(0)}%`}
                  sx={{ backgroundColor: `${ACCENT}22`, color: ACCENT, fontWeight: 700 }} />
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {!hasEnoughData ? (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 1 }}>How this works</Typography>
          <Typography sx={{ color: TEXT_PRI, fontSize: '0.92rem', lineHeight: 1.7, mb: 1.5 }}>
            Go to the <strong>Practice</strong> tab and answer at least 10 questions. Your accuracy across the
            seven Physics subdomains gets mapped to an estimated readiness score on a 0–1000 scale.
            Focus especially on your weakest subdomains — those move the number the most.
          </Typography>
          <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem', lineHeight: 1.6 }}>
            The estimate is intentionally conservative. If this dashboard says you're ready, you're <em>actually</em> ready.
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper elevation={0} sx={{ p: 3, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 1 }}>By subdomain</Typography>
            <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', mb: 2 }}>
              Sorted weakest first. Items with fewer than 3 attempts are shown gray — drill them to get a real read.
            </Typography>
            <Stack spacing={1.5}>
              {summary.map(s => {
                const insufficient = s.attempted < 3;
                const color = insufficient ? TEXT_SEC : s.accuracy >= 0.8 ? GOOD : s.accuracy >= 0.65 ? WARN : BAD;
                return (
                  <Box key={s.subdomain}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, color: TEXT_PRI, fontSize: '0.9rem' }}>{s.subdomain}</Typography>
                      <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
                        {insufficient
                          ? `${s.attempted}/${s.total} attempted`
                          : `${(s.accuracy * 100).toFixed(0)}% · ${s.correct}/${s.attempted} correct (${s.total} total)`}
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate"
                      value={insufficient ? (s.attempted / s.total) * 100 : s.accuracy * 100}
                      sx={{ height: 8, borderRadius: 2, backgroundColor: `${color}22`, '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
                  </Box>
                );
              })}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 0.5 }}>Confidence calibration</Typography>
            <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', mb: 2 }}>
              How well your gut tracks reality. <em>Confidently wrong</em> = concepts to revisit. <em>Lucky guesses</em> = exam-day risk.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 2 }}>
              <CalibrationCell label="💪 Confident" correct={confidenceBreakdown.confidentCorrect} wrong={confidenceBreakdown.confidentWrong}
                goodColor={GOOD} badColor={BAD} muted={TEXT_SEC}
                hint={confidenceBreakdown.confidentWrong > 0 ? `Review ${confidenceBreakdown.confidentWrong} confidently-wrong answers — those are concept gaps` : 'Your confident calls are landing'} />
              <CalibrationCell label="🤔 Unsure" correct={confidenceBreakdown.unsureCorrect} wrong={confidenceBreakdown.unsureWrong}
                goodColor={GOOD} badColor={BAD} muted={TEXT_SEC} />
              <CalibrationCell label="🎲 Guessed" correct={confidenceBreakdown.guessCorrect} wrong={confidenceBreakdown.guessWrong}
                goodColor={GOOD} badColor={BAD} muted={TEXT_SEC}
                hint={confidenceBreakdown.guessCorrect > 5 ? `${confidenceBreakdown.guessCorrect} correct guesses — re-study these, don't bank on luck` : ''} />
            </Stack>
          </Paper>

          <Divider sx={{ my: 3, borderColor: BORDER }} />
          <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', textAlign: 'center', mb: 2 }}>
            This estimate is based on your <strong>most recent</strong> attempt at each question. Re-take a missed question to update the number.
          </Typography>
        </>
      )}

      <AnalyticsBlock isDark={isDark} />
    </Box>
  );
}

function AnalyticsBlock({ isDark }: { isDark: boolean }) {
  const ACCENT   = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG  = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER   = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const GOOD     = isDark ? '#7BAF85' : '#3C6E4B';
  const BAD      = isDark ? '#D88366' : '#C75A2D';

  const attempts = useMemo(() => loadAttempts(EXAM_ID), []);
  const heatmap  = useMemo(() => activityHeatmap(EXAM_ID, 84), []);

  if (attempts.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, mt: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 1 }}>Activity analytics</Typography>
        <Typography variant="body2" sx={{ color: TEXT_SEC }}>
          Complete practice sessions to populate attempt history and the activity heatmap.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI }}>Attempt history</Typography>
          <Button size="small" variant="outlined" startIcon={<PrintIcon />} onClick={() => window.print()}
            sx={{ borderColor: ACCENT, color: ACCENT, textTransform: 'none' }}>Export report</Button>
        </Stack>
        <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', mb: 2 }}>
          {attempts.length} attempt{attempts.length === 1 ? '' : 's'} · score trend (most recent on the right)
        </Typography>
        <ScoreChart attempts={[...attempts].reverse()} accent={ACCENT} good={GOOD} bad={BAD} border={BORDER} muted={TEXT_SEC} />
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 0.5 }}>Activity (last 12 weeks)</Typography>
        <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', mb: 2 }}>
          One cell per day. Darker = more questions answered that day.
        </Typography>
        <ActivityHeatmap data={heatmap} accent={ACCENT} muted={TEXT_SEC} border={BORDER} />
      </Paper>
    </Box>
  );
}

function ScoreChart({ attempts, accent, good, bad, border, muted }: {
  attempts: ReturnType<typeof loadAttempts>; accent: string; good: string; bad: string; border: string; muted: string;
}) {
  const W = 600; const H = 140; const PAD = 24;
  if (attempts.length === 0) return null;
  const scores = attempts.map(a => a.scoreScaled);
  const maxScore = 1000;
  const stepX = attempts.length > 1 ? (W - PAD * 2) / (attempts.length - 1) : 0;
  const passY = PAD + (H - PAD * 2) * (1 - 700 / maxScore);
  const points = scores.map((s, i) => ({ x: PAD + i * stepX, y: PAD + (H - PAD * 2) * (1 - s / maxScore), s }));
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box component="svg" viewBox={`0 0 ${W} ${H}`} sx={{ width: '100%', maxWidth: 600, height: 'auto' }}>
        <line x1={PAD} y1={passY} x2={W - PAD} y2={passY} stroke={border} strokeDasharray="3 3" />
        <text x={W - PAD} y={passY - 4} textAnchor="end" fontSize="10" fill={muted}>Pass · 700</text>
        {points.length > 1 && <polyline fill="none" stroke={accent} strokeWidth={2} points={points.map(p => `${p.x},${p.y}`).join(' ')} />}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={5} fill={p.s >= 700 ? good : bad} stroke="white" strokeWidth={1.5} />
            <text x={p.x} y={p.y - 9} textAnchor="middle" fontSize="10" fill={muted}>{p.s}</text>
          </g>
        ))}
        {points.map((p, i) => (<text key={i} x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill={muted}>#{i + 1}</text>))}
      </Box>
    </Box>
  );
}

function ActivityHeatmap({ data, accent, muted, border }: { data: { date: string; count: number }[]; accent: string; muted: string; border: string; }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ display: 'inline-grid', gridTemplateColumns: `repeat(${Math.ceil(data.length / 7)}, 14px)`, gridAutoFlow: 'column', gap: '3px' }}>
        {data.map((d) => {
          const intensity = d.count === 0 ? 0 : Math.min(1, d.count / max);
          const bg = d.count === 0 ? border : alpha(accent, 0.2 + 0.8 * intensity);
          return (
            <Tooltip key={d.date} title={`${d.date} · ${d.count} questions`}>
              <Box sx={{ width: 14, height: 14, borderRadius: 0.5, backgroundColor: bg, border: d.count > 0 ? `1px solid ${alpha(accent, 0.4)}` : `1px solid ${border}` }} />
            </Tooltip>
          );
        })}
      </Box>
      <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: muted }}>Less</Typography>
        {[0.2, 0.4, 0.6, 0.8, 1.0].map(i => (
          <Box key={i} sx={{ width: 12, height: 12, borderRadius: 0.5, backgroundColor: alpha(accent, i) }} />
        ))}
        <Typography variant="caption" sx={{ color: muted }}>More</Typography>
      </Stack>
    </Box>
  );
}

function CalibrationCell({ label, correct, wrong, goodColor, badColor, muted, hint }: {
  label: string; correct: number; wrong: number; goodColor: string; badColor: string; muted: string; hint?: string;
}) {
  const total = correct + wrong;
  const accPct = total === 0 ? null : Math.round((correct / total) * 100);
  return (
    <Box sx={{ minWidth: 200, flexBasis: { xs: '100%', md: 240 } }}>
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{label}</Typography>
      <Typography variant="caption" sx={{ color: muted, display: 'block' }}>
        {total === 0 ? 'No answers in this tier yet' : `${accPct}% correct (${correct} of ${total})`}
      </Typography>
      {total > 0 && (
        <Box sx={{ display: 'flex', height: 8, borderRadius: 2, overflow: 'hidden', mt: 0.75 }}>
          <Box sx={{ flex: correct, backgroundColor: goodColor, minWidth: correct > 0 ? 2 : 0 }} />
          <Box sx={{ flex: wrong, backgroundColor: badColor, minWidth: wrong > 0 ? 2 : 0 }} />
        </Box>
      )}
      {hint && <Typography variant="caption" sx={{ color: muted, display: 'block', mt: 0.75, fontSize: '0.72rem' }}>{hint}</Typography>}
    </Box>
  );
}
