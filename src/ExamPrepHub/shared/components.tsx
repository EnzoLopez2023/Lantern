// Reusable content components for exam prep guides. All MUI-based so they
// inherit the app's theme automatically and work without a special CSS wrapper.

import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import {
  LightbulbOutlined as IdeaIcon,
  EmojiObjectsOutlined as TipIcon,
  CategoryOutlined as ServiceIcon,
  WarningAmberOutlined as WarnIcon,
  ScienceOutlined as LabIcon,
  QuizOutlined as QuizIcon,
  CheckCircleOutline as CorrectIcon,
  HighlightOff as WrongIcon,
  ReplayOutlined as RetryIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useMemo, useState, type ReactNode } from 'react';
import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';
import { resolveAnalogyContent } from './analogyContent';

const useTokens = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return {
    isDark,
    accent:    isDark ? '#C77AA0' : '#5C2A4A',
    surface:   isDark ? '#1E0F06' : '#FBF7F2',
    surfaceAlt:isDark ? '#2E2F38' : '#FBF5E6',
    border:    isDark ? '#3A3B45' : '#DDCBA8',
    text:      isDark ? '#F5EFE3' : '#2D1B26',
    textSec:   isDark ? '#A6A4AE' : '#6E5E40',
    good:      isDark ? '#7BAF85' : '#3C6E4B',
    warn:      isDark ? '#E2B26B' : '#B08139',
    bad:       isDark ? '#D88366' : '#C75A2D',
  };
};

export function Analogy({
  title,
  children,
  body,
}: {
  title: string;
  children?: ReactNode;
  body?: ReactNode;
}) {
  const t = useTokens();
  const content = resolveAnalogyContent(children, body);
  return (
    <Paper
      elevation={0}
      sx={{
        my: 2,
        p: 2,
        backgroundColor: alpha(t.accent, t.isDark ? 0.1 : 0.06),
        borderLeft: `4px solid ${t.accent}`,
        border: `1px solid ${alpha(t.accent, 0.25)}`,
        borderLeftWidth: 4,
        borderRadius: 1.5,
      }}
    >
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
        <IdeaIcon sx={{ color: t.accent, fontSize: '1rem' }} />
        <Typography
          variant="caption"
          sx={{ color: t.accent, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', fontSize: '0.68rem' }}
        >
          Think of it like…
        </Typography>
      </Stack>
      <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: t.text, mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ color: t.text, fontSize: '0.92rem', lineHeight: 1.65 }}>{content}</Typography>
    </Paper>
  );
}

export function ExamTip({ children }: { children: ReactNode }) {
  const t = useTokens();
  return (
    <Paper
      elevation={0}
      sx={{
        my: 1.5,
        p: 1.5,
        backgroundColor: alpha(t.good, 0.08),
        border: `1px solid ${alpha(t.good, 0.3)}`,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
      }}
    >
      <TipIcon sx={{ color: t.good, fontSize: '1.15rem', mt: 0.15 }} />
      <Box>
        <Typography
          variant="caption"
          sx={{ color: t.good, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', mb: 0.25 }}
        >
          Exam tip
        </Typography>
        <Typography sx={{ color: t.text, fontSize: '0.9rem', lineHeight: 1.6 }}>{children}</Typography>
      </Box>
    </Paper>
  );
}

// Try-It-in-Foundry callout — concrete hands-on step list. Modeled after
// the Exercise units in Microsoft Learn's AI-901 path.
export function TryItBox({ title, steps }: { title: string; steps: React.ReactNode[] }) {
  const t = useTokens();
  // Use a distinct blue tint (not warm/accent) so it's visually different from
  // Analogy / ExamTip callouts.
  const blue = t.isDark ? '#7BA8D8' : '#3D6FA6';
  return (
    <Paper
      elevation={0}
      sx={{
        my: 2,
        p: 2,
        backgroundColor: alpha(blue, t.isDark ? 0.12 : 0.06),
        borderLeft: `4px solid ${blue}`,
        border: `1px solid ${alpha(blue, 0.25)}`,
        borderLeftWidth: 4,
        borderRadius: 1.5,
      }}
    >
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 0.5 }}>
        <LabIcon sx={{ color: blue, fontSize: '1rem' }} />
        <Typography
          variant="caption"
          sx={{ color: blue, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', fontSize: '0.68rem' }}
        >
          Try it in Foundry
        </Typography>
      </Stack>
      <Typography sx={{ fontWeight: 700, fontSize: '0.98rem', color: t.text, mb: 1 }}>{title}</Typography>
      <Box component="ol" sx={{ pl: 3, m: 0, '& li': { fontSize: '0.88rem', lineHeight: 1.65, mb: 0.4, color: t.text } }}>
        {steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </Box>
    </Paper>
  );
}

export interface MnemonicExpansion {
  letter: string;
  word: string;
}

export function Mnemonic({ phrase, expansion }: { phrase: string; expansion: MnemonicExpansion[] }) {
  const t = useTokens();
  return (
    <Paper
      elevation={0}
      sx={{
        my: 2,
        p: 2,
        backgroundColor: alpha(t.accent, t.isDark ? 0.12 : 0.06),
        border: `1px dashed ${alpha(t.accent, 0.45)}`,
        borderRadius: 1.5,
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'var(--hearth-heading)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: t.accent,
          mb: 1.25,
        }}
      >
        {phrase}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: 1,
        }}
      >
        {expansion.map(e => (
          <Box
            key={e.letter}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              p: 0.75,
              backgroundColor: t.isDark ? alpha('#000', 0.2) : alpha('#FFF', 0.65),
              borderRadius: 1,
              fontSize: '0.82rem',
            }}
          >
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: 0.75,
                backgroundColor: t.accent,
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.78rem',
                flexShrink: 0,
              }}
            >
              {e.letter}
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: t.text }}>{e.word}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export function ServiceCard({
  name,
  purpose,
  useWhen,
  watchOut,
}: {
  name: string;
  purpose: string;
  useWhen: string;
  watchOut?: string;
}) {
  const t = useTokens();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        backgroundColor: t.surfaceAlt,
        border: `1px solid ${t.border}`,
        borderRadius: 1.5,
      }}
    >
      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', mb: 1 }}>
        <ServiceIcon sx={{ color: t.accent, fontSize: '0.95rem' }} />
        <Typography sx={{ fontWeight: 700, color: t.accent, fontSize: '0.95rem' }}>{name}</Typography>
      </Stack>
      <Row label="What it does" value={purpose} t={t} />
      <Row label="Reach for it when" value={useWhen} t={t} />
      {watchOut && <Row label="Watch out" value={watchOut} t={t} warn />}
    </Paper>
  );
}

function Row({
  label, value, t, warn,
}: { label: string; value: string; t: ReturnType<typeof useTokens>; warn?: boolean }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '130px 1fr' },
        gap: 0.5,
        py: 0.5,
        borderTop: `1px solid ${alpha(t.border, 0.6)}`,
        '&:first-of-type': { borderTop: 'none' },
      }}
    >
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        {warn && <WarnIcon sx={{ color: t.bad, fontSize: '0.85rem' }} />}
        <Typography
          variant="caption"
          sx={{
            color: warn ? t.bad : t.textSec,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            fontSize: '0.65rem',
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography sx={{ color: t.text, fontSize: '0.85rem', lineHeight: 1.55 }}>{value}</Typography>
    </Box>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  const t = useTokens();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        backgroundColor: alpha(t.accent, t.isDark ? 0.12 : 0.07),
        border: `1px solid ${alpha(t.accent, 0.25)}`,
        borderRadius: 1.5,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontWeight: 800, color: t.accent, fontSize: '1.1rem', lineHeight: 1.2 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: t.textSec, fontSize: '0.7rem' }}>{label}</Typography>
    </Paper>
  );
}

export function GuideTable({
  title,
  headers,
  rows,
}: {
  title?: string;
  headers: string[];
  rows: ReactNode[][];
}) {
  const t = useTokens();
  return (
    <Box sx={{ my: 2 }}>
      {title && (
        <Typography sx={{ mb: 1, color: t.text, fontSize: '0.95rem', fontWeight: 700 }}>
          {title}
        </Typography>
      )}
      <Box
        sx={{
          overflowX: 'auto',
          border: `1px solid ${t.border}`,
          borderRadius: 1.5,
        }}
      >
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
        <Box component="thead">
          <Box component="tr" sx={{ backgroundColor: alpha(t.accent, t.isDark ? 0.1 : 0.06) }}>
            {headers.map(h => (
              <Box
                key={h}
                component="th"
                sx={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  fontWeight: 700,
                  color: t.accent,
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  borderBottom: `1px solid ${t.border}`,
                }}
              >
                {h}
              </Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row, i) => (
            <Box component="tr" key={i}>
              {row.map((cell, j) => (
                <Box
                  key={j}
                  component="td"
                  sx={{
                    padding: '8px 12px',
                    color: t.text,
                    borderBottom: i < rows.length - 1 ? `1px solid ${alpha(t.border, 0.6)}` : 'none',
                    verticalAlign: 'top',
                    lineHeight: 1.55,
                  }}
                >
                  {cell}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
      </Box>
    </Box>
  );
}

export function PrincipleBlock({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  const t = useTokens();
  return (
    <Box
      sx={{
        borderLeft: `3px solid ${alpha(t.accent, 0.4)}`,
        pl: 2,
        my: 2.5,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
        <Chip
          label={number}
          size="small"
          sx={{
            backgroundColor: t.accent,
            color: '#fff',
            fontWeight: 800,
            minWidth: 28,
            height: 22,
          }}
        />
        <Typography sx={{ fontWeight: 700, color: t.accent, fontSize: '1rem' }}>{title}</Typography>
      </Stack>
      {children}
    </Box>
  );
}

export function Alert({
  variant,
  children,
}: {
  variant: 'good' | 'warn' | 'info';
  children: ReactNode;
}) {
  const t = useTokens();
  const color = variant === 'good' ? t.good : variant === 'warn' ? t.bad : t.accent;
  const icon = variant === 'good' ? '✅' : variant === 'warn' ? '⚠️' : 'ℹ️';
  return (
    <Paper
      elevation={0}
      sx={{
        my: 2,
        p: 1.75,
        backgroundColor: alpha(color, 0.08),
        border: `1px solid ${alpha(color, 0.3)}`,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
      }}
    >
      <Box sx={{ fontSize: '1.05rem' }}>{icon}</Box>
      <Typography sx={{ color: t.text, fontSize: '0.92rem', lineHeight: 1.6 }}>{children}</Typography>
    </Paper>
  );
}

// ============ SECTION QUIZ ============
// Short end-of-section recall check. Pulls questions in from the per-exam
// practice bank (filtered to single/multi/yesno only) so we don't author
// twice. Answers are NOT fed into drillStats — they're scoped to the
// per-exam quiz storage key the caller passes in. Diagnostic stays clean.

export type QuizQuestion = {
  id: string;
  type: 'single' | 'multi' | 'yesno';
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
};

type QuizState =
  | { phase: 'idle' }
  | { phase: 'answering'; selected: Record<string, number[]> }
  | { phase: 'reviewing'; selected: Record<string, number[]>; score: number };

type QuizRecord = { score: number; total: number; takenAt: number };

function readQuizRecord(storageKey: string, sectionId: string): QuizRecord | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object' && obj[sectionId]) return obj[sectionId] as QuizRecord;
  } catch { /* ignore */ }
  return null;
}

function writeQuizRecord(storageKey: string, sectionId: string, record: QuizRecord) {
  try {
    const raw = localStorage.getItem(storageKey);
    const obj = raw ? JSON.parse(raw) : {};
    obj[sectionId] = record;
    localStorage.setItem(storageKey, JSON.stringify(obj));
  } catch { /* ignore */ }
}

function arraysEqualAsSets(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  for (const v of b) if (!set.has(v)) return false;
  return true;
}

export function SectionQuiz({
  sectionId,
  storageKey,
  title = 'Quick check',
  questions,
}: {
  sectionId: string;
  storageKey: string;
  title?: string;
  questions: QuizQuestion[];
}) {
  const t = useTokens();
  const accent = t.accent;
  const lastRecord = useMemo(() => readQuizRecord(storageKey, sectionId), [storageKey, sectionId]);
  const [state, setState] = useState<QuizState>({ phase: 'idle' });

  if (questions.length === 0) return null;

  const start = () => {
    const selected: Record<string, number[]> = {};
    questions.forEach(q => { selected[q.id] = []; });
    setState({ phase: 'answering', selected });
  };

  const reset = () => setState({ phase: 'idle' });

  const toggleOption = (qid: string, optIdx: number, multi: boolean) => {
    if (state.phase !== 'answering') return;
    setState(prev => {
      if (prev.phase !== 'answering') return prev;
      const cur = prev.selected[qid] || [];
      let next: number[];
      if (multi) {
        next = cur.includes(optIdx) ? cur.filter(i => i !== optIdx) : [...cur, optIdx];
      } else {
        next = [optIdx];
      }
      return { ...prev, selected: { ...prev.selected, [qid]: next } };
    });
  };

  const submit = () => {
    if (state.phase !== 'answering') return;
    let score = 0;
    for (const q of questions) {
      if (arraysEqualAsSets(state.selected[q.id] || [], q.correctAnswers)) score += 1;
    }
    writeQuizRecord(storageKey, sectionId, { score, total: questions.length, takenAt: Date.now() });
    setState({ phase: 'reviewing', selected: state.selected, score });
  };

  // Idle: prompt to start.
  if (state.phase === 'idle') {
    return (
      <Paper
        elevation={0}
        sx={{
          my: 2,
          p: 2,
          backgroundColor: alpha(accent, t.isDark ? 0.1 : 0.05),
          border: `1px solid ${alpha(accent, 0.3)}`,
          borderRadius: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
          <QuizIcon sx={{ color: accent, fontSize: '1.15rem' }} />
          <Typography sx={{ fontWeight: 700, color: accent, fontSize: '0.98rem' }}>{title}</Typography>
          <Chip
            size="small"
            label={`${questions.length} ${questions.length === 1 ? 'question' : 'questions'}`}
            sx={{ backgroundColor: alpha(accent, 0.15), color: accent, fontWeight: 600, height: 20, fontSize: '0.7rem' }}
          />
          {lastRecord && (
            <Chip
              size="small"
              label={`Last: ${lastRecord.score}/${lastRecord.total}`}
              sx={{
                backgroundColor: lastRecord.score === lastRecord.total
                  ? alpha(t.good, 0.15)
                  : alpha(t.warn, 0.15),
                color: lastRecord.score === lastRecord.total ? t.good : t.warn,
                fontWeight: 700,
                height: 20,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Stack>
        <Typography sx={{ color: t.textSec, fontSize: '0.85rem', mb: 1.5, lineHeight: 1.55 }}>
          Reinforces what you just read. Doesn't count toward your Diagnostic — practice freely.
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={start}
          startIcon={<QuizIcon />}
          sx={{ backgroundColor: accent, '&:hover': { backgroundColor: accent, opacity: 0.9 }, textTransform: 'none', fontWeight: 700 }}
        >
          {lastRecord ? 'Retake quick check' : 'Start quick check'}
        </Button>
      </Paper>
    );
  }

  // Answering or reviewing — render each question with options.
  const reviewing = state.phase === 'reviewing';
  const allAnswered = state.phase === 'answering'
    ? questions.every(q => (state.selected[q.id]?.length ?? 0) > 0)
    : true;

  return (
    <Paper
      elevation={0}
      sx={{
        my: 2,
        p: 2,
        backgroundColor: alpha(accent, t.isDark ? 0.1 : 0.05),
        border: `1px solid ${alpha(accent, 0.3)}`,
        borderRadius: 1.5,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5, flexWrap: 'wrap' }}>
        <QuizIcon sx={{ color: accent, fontSize: '1.15rem' }} />
        <Typography sx={{ fontWeight: 700, color: accent, fontSize: '0.98rem' }}>{title}</Typography>
        {reviewing && state.phase === 'reviewing' && (
          <Chip
            size="small"
            label={`${state.score} / ${questions.length}`}
            sx={{
              backgroundColor: state.score === questions.length ? alpha(t.good, 0.18) : alpha(accent, 0.15),
              color: state.score === questions.length ? t.good : accent,
              fontWeight: 700,
            }}
          />
        )}
      </Stack>

      {questions.map((q, qi) => {
        const sel = state.selected[q.id] || [];
        const correctSet = new Set(q.correctAnswers);
        const wasCorrect = reviewing && arraysEqualAsSets(sel, q.correctAnswers);
        const multi = q.type === 'multi';
        return (
          <Box key={q.id} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', mb: 0.75 }}>
              <Chip size="small" label={`Q${qi + 1}`} sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700, backgroundColor: alpha(accent, 0.18), color: accent }} />
              <Typography sx={{ fontWeight: 600, color: t.text, fontSize: '0.92rem', lineHeight: 1.55, flexGrow: 1 }}>
                {q.question}
              </Typography>
              {reviewing && (wasCorrect
                ? <CorrectIcon sx={{ color: t.good, fontSize: '1.2rem', flexShrink: 0 }} />
                : <WrongIcon sx={{ color: t.bad, fontSize: '1.2rem', flexShrink: 0 }} />
              )}
            </Stack>
            {multi && !reviewing && (
              <Typography variant="caption" sx={{ color: t.textSec, display: 'block', mb: 0.5, ml: 0.5 }}>
                Select all that apply
              </Typography>
            )}
            <Stack spacing={0.5} sx={{ pl: 0.5 }}>
              {q.options.map((opt, oi) => {
                const selected = sel.includes(oi);
                const isCorrect = correctSet.has(oi);
                let bg = 'transparent';
                let border = t.border;
                let color = t.text;
                if (reviewing) {
                  if (isCorrect) {
                    bg = alpha(t.good, 0.12);
                    border = alpha(t.good, 0.55);
                    color = t.text;
                  } else if (selected && !isCorrect) {
                    bg = alpha(t.bad, 0.1);
                    border = alpha(t.bad, 0.5);
                  }
                } else if (selected) {
                  bg = alpha(accent, 0.14);
                  border = alpha(accent, 0.55);
                }
                return (
                  <Box
                    key={oi}
                    onClick={() => !reviewing && toggleOption(q.id, oi, multi)}
                    sx={{
                      p: '8px 12px',
                      border: `1px solid ${border}`,
                      borderRadius: 1.25,
                      backgroundColor: bg,
                      color,
                      fontSize: '0.88rem',
                      cursor: reviewing ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': !reviewing ? { borderColor: alpha(accent, 0.5) } : undefined,
                    }}
                  >
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        border: `2px solid ${selected ? accent : t.border}`,
                        borderRadius: multi ? 0.5 : '50%',
                        backgroundColor: selected ? accent : 'transparent',
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>{opt}</Box>
                    {reviewing && isCorrect && <CorrectIcon sx={{ color: t.good, fontSize: '1rem' }} />}
                    {reviewing && selected && !isCorrect && <WrongIcon sx={{ color: t.bad, fontSize: '1rem' }} />}
                  </Box>
                );
              })}
            </Stack>
            {reviewing && (
              <Paper
                elevation={0}
                sx={{
                  mt: 1,
                  p: 1.25,
                  backgroundColor: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" sx={{ color: t.accent, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 0.25 }}>
                  Why
                </Typography>
                <Typography sx={{ color: t.text, fontSize: '0.85rem', lineHeight: 1.55 }}>{q.explanation}</Typography>
              </Paper>
            )}
          </Box>
        );
      })}

      <Divider sx={{ my: 1.5 }} />
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {!reviewing && (
          <Button
            size="small"
            variant="contained"
            onClick={submit}
            disabled={!allAnswered}
            sx={{ backgroundColor: accent, '&:hover': { backgroundColor: accent, opacity: 0.9 }, textTransform: 'none', fontWeight: 700 }}
          >
            Submit answers
          </Button>
        )}
        {reviewing && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<RetryIcon />}
            onClick={start}
            sx={{ borderColor: accent, color: accent, textTransform: 'none', fontWeight: 700 }}
          >
            Retake
          </Button>
        )}
        <Button
          size="small"
          variant="text"
          onClick={reset}
          sx={{ color: t.textSec, textTransform: 'none' }}
        >
          {reviewing ? 'Close' : 'Cancel'}
        </Button>
      </Stack>
    </Paper>
  );
}

// ============ LAB ============
// A multi-step optional walkthrough that lives at the end of a section
// where hands-on reinforces the exam content. Heavier than TryItBox —
// labs have a title, intro, multiple ordered steps each with body + verify,
// and an optional conclusion. Marked optional in the UI so users know
// they can skip it and still mark the section complete.

export type LabStep = {
  title: string;
  body: ReactNode;
  verify?: ReactNode; // "you'll know it worked when…"
};

export function Lab({
  title,
  durationMin,
  intro,
  steps,
  conclusion,
}: {
  title: string;
  durationMin?: number;
  intro?: ReactNode;
  steps: LabStep[];
  conclusion?: ReactNode;
}) {
  const t = useTokens();
  const blue = t.isDark ? '#7BA8D8' : '#3D6FA6';
  const [open, setOpen] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        my: 2,
        p: 2,
        backgroundColor: alpha(blue, t.isDark ? 0.1 : 0.05),
        border: `1px solid ${alpha(blue, 0.3)}`,
        borderLeft: `4px solid ${blue}`,
        borderRadius: 1.5,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.75, flexWrap: 'wrap' }}>
        <LabIcon sx={{ color: blue, fontSize: '1.2rem' }} />
        <Typography variant="caption" sx={{ color: blue, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', fontSize: '0.68rem' }}>
          Optional lab
        </Typography>
        {durationMin != null && (
          <Chip
            size="small"
            label={`~${durationMin} min`}
            sx={{ backgroundColor: alpha(blue, 0.14), color: blue, fontWeight: 600, height: 20, fontSize: '0.7rem' }}
          />
        )}
      </Stack>
      <Typography sx={{ fontWeight: 700, fontSize: '1.02rem', color: t.text, mb: 0.5 }}>{title}</Typography>
      {!open && (
        <>
          <Typography sx={{ color: t.textSec, fontSize: '0.85rem', mb: 1.25, lineHeight: 1.55 }}>
            Hands-on walkthrough — reinforces the section, but not required to mark this section complete.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setOpen(true)}
            sx={{ borderColor: blue, color: blue, textTransform: 'none', fontWeight: 700 }}
          >
            Open lab
          </Button>
        </>
      )}
      {open && (
        <Box>
          {intro && (
            <Typography sx={{ color: t.text, fontSize: '0.9rem', lineHeight: 1.65, mb: 1.5 }}>
              {intro}
            </Typography>
          )}
          <Box sx={{ position: 'relative' }}>
            {steps.map((step, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: '50%',
                    backgroundColor: blue,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {i + 1}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: t.text, fontSize: '0.94rem', mb: 0.4 }}>
                    {step.title}
                  </Typography>
                  <Box sx={{ color: t.text, fontSize: '0.88rem', lineHeight: 1.65, '& code': { fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace', fontSize: '0.82rem', backgroundColor: alpha(blue, 0.12), padding: '1px 5px', borderRadius: 0.5 } }}>
                    {step.body}
                  </Box>
                  {step.verify && (
                    <Paper
                      elevation={0}
                      sx={{
                        mt: 0.75,
                        p: 1,
                        backgroundColor: alpha(t.good, 0.08),
                        border: `1px solid ${alpha(t.good, 0.3)}`,
                        borderRadius: 1,
                      }}
                    >
                      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'flex-start' }}>
                        <CorrectIcon sx={{ color: t.good, fontSize: '1rem', mt: 0.1 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: t.good, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.64rem', display: 'block' }}>
                            You'll know it worked when
                          </Typography>
                          <Typography sx={{ color: t.text, fontSize: '0.82rem', lineHeight: 1.55 }}>
                            {step.verify}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          {conclusion && (
            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: 1.5,
                backgroundColor: alpha(blue, 0.1),
                border: `1px solid ${alpha(blue, 0.3)}`,
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" sx={{ color: blue, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 0.25 }}>
                What you should now understand
              </Typography>
              <Typography sx={{ color: t.text, fontSize: '0.88rem', lineHeight: 1.6 }}>
                {conclusion}
              </Typography>
            </Paper>
          )}
          <Button
            size="small"
            variant="text"
            onClick={() => setOpen(false)}
            sx={{ mt: 1, color: t.textSec, textTransform: 'none' }}
          >
            Close lab
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export { useTokens };
