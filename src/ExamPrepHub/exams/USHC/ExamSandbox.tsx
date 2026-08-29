// ExamSandbox v2 — modeled on the Microsoft Certifications exam sandbox demo
// (aka.ms/examdemo). Full-screen immersive mode, counting-down timer,
// mark-for-review, numbered navigation grid, submit confirmation,
// scaled-score results with domain + subdomain breakdown.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  Select,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AccessTime as TimerIcon,
  Flag as FlagIcon,
  FlagOutlined as FlagOutlinedIcon,
  HelpOutline as HelpIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Cancel as XIcon,
  PlayArrow as StartIcon,
  Replay as RetryIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { questions, type Question } from './questions';
import { loadStats, recordAnswer, saveStats } from '../../shared/drillStats';
import {
  clearSandboxSnapshot,
  isSnapshotResumable,
  loadSandboxSnapshot,
  saveSandboxSnapshot,
  type SandboxSnapshot,
} from '../../shared/sandboxResume';
import { saveAttempt, type PerQuestion } from '../../shared/analytics';
import { apiWrite } from '../../../app/api/apiFetch';
import { reportStorageSyncFailure } from '../../../app/storage/scopedStorage';
import { availableQuestionDomains, filterQuestionsByDomain, scaleEocepScore } from '../../shared/eocepSandbox';
import './examSandbox.css';

const EXAM_ID = 'USHC';

type Phase = 'setup' | 'exam' | 'review' | 'submitted';
type Length = 'full' | 'short';
type DomainPick = 'both' | 1 | 2;
type PracticeMode = 'strict' | 'practice';

interface ExamConfig {
  length: Length;
  domain: DomainPick;
  durationSec: number;
  practiceMode: PracticeMode;
}

interface AnswerState {
  questionId: string;
  selected: number[]; // for ordering, indices in user's ordering; for match, flat pairs [left0,right0,left1,right1...]; for hot-area, target indices
  subAnswers?: number[][]; // for case-study only: subAnswers[i] = selected for sub-question i
  flagged: boolean;
  revealed?: boolean; // practice mode: explanation shown for this question
}

interface ResultRow {
  question: Question;
  selected: number[];
  correct: boolean;
  flagged: boolean;
}

interface FinalResults {
  scoreScaled: number; // 0..1000
  passed: boolean;
  correctCount: number;
  totalCount: number;
  d1Correct: number;
  d1Total: number;
  d2Correct: number;
  d2Total: number;
  timeSpentSec: number;
  rows: ResultRow[];
}

const PASS = 700;

const formatTime = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  return `${m}:${String(r).padStart(2, '0')}`;
};

function arraysEqualInOrder(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function arraysEqualAsSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

function isAnswerCorrect(q: Question, selected: number[], subAnswers?: number[][]): boolean {
  if (q.type === 'case-study') {
    if (!q.caseStudy || !subAnswers) return false;
    return q.caseStudy.subQuestions.every((sub, i) => {
      const sel = subAnswers[i] ?? [];
      if (sel.length === 0) return false;
      return arraysEqualAsSet(sel, sub.correctAnswers);
    });
  }
  if (selected.length === 0) return false;
  if (q.type === 'ordering') return arraysEqualInOrder(selected, q.correctAnswers);
  if (q.type === 'match') {
    if (!q.match) return false;
    // selected is flat pairs [l0, r0, l1, r1, ...]; build a Set of "l-r" strings
    const userPairs = new Set<string>();
    for (let i = 0; i + 1 < selected.length; i += 2) {
      userPairs.add(`${selected[i]}-${selected[i + 1]}`);
    }
    const correctPairs = new Set(q.match.correctPairs.map(p => `${p[0]}-${p[1]}`));
    if (userPairs.size !== correctPairs.size) return false;
    for (const p of correctPairs) if (!userPairs.has(p)) return false;
    return true;
  }
  if (q.type === 'hot-area') {
    if (!q.hotArea) return false;
    const userIds = selected.map(i => q.hotArea!.targets[i]?.id).filter(Boolean);
    if (q.hotArea.selectAll) {
      const correct = new Set(q.hotArea.correctTargetIds);
      const user = new Set(userIds);
      if (user.size !== correct.size) return false;
      for (const id of correct) if (!user.has(id)) return false;
      return true;
    }
    // Single-correct hot area: any selected ID must be in correctTargetIds
    return userIds.length === 1 && q.hotArea.correctTargetIds.includes(userIds[0]);
  }
  return arraysEqualAsSet(selected, q.correctAnswers);
}

export default function ExamSandbox() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [phase, setPhase] = useState<Phase>('setup');
  const [config, setConfig] = useState<ExamConfig>({ length: 'full', domain: 'both', durationSec: 60 * 60, practiceMode: 'strict' });
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [index, setIndex] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [results, setResults] = useState<FinalResults | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const [resumableSnapshot, setResumableSnapshot] = useState<SandboxSnapshot | null>(() => {
    const snap = loadSandboxSnapshot(EXAM_ID);
    return snap && isSnapshotResumable(snap) ? snap : null;
  });
  // Time tracking: time spent on each question in the current exam.
  const questionEnterRef = useRef<number>(0);
  const questionTimesRef = useRef<Record<string, number>>({});

  const remaining = Math.max(0, config.durationSec - elapsed);

  // Build the question pool when starting
  const startExam = useCallback(() => {
    const pool = filterQuestionsByDomain(questions, config.domain);
    if (pool.length === 0) {
      setSetupError('No questions are available for that domain. Choose an available domain and try again.');
      return;
    }
    setSetupError(null);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const targetCount = config.length === 'full' ? 50 : 25;
    const picked = shuffled.slice(0, Math.min(targetCount, shuffled.length));
    setExamQuestions(picked);
    setAnswers({});
    setIndex(0);
    setResults(null);
    setElapsed(0);
    startTimeRef.current = Date.now();
    questionEnterRef.current = Date.now();
    questionTimesRef.current = {};
    setResumableSnapshot(null);
    clearSandboxSnapshot(EXAM_ID);
    setPhase('exam');
  }, [config]);

  // Resume a previous in-progress attempt
  const resumeExam = useCallback((snap: SandboxSnapshot) => {
    const restored = snap.questionIds
      .map(id => questions.find(q => q.id === id))
      .filter((q): q is Question => !!q);
    if (restored.length === 0) {
      // Snapshot references missing questions — discard it
      clearSandboxSnapshot(EXAM_ID);
      setResumableSnapshot(null);
      return;
    }
    setExamQuestions(restored);
    setAnswers(
      Object.fromEntries(
        Object.entries(snap.answers).map(([qid, a]) => [
          qid,
          { questionId: qid, selected: a.selected, flagged: a.flagged },
        ])
      )
    );
    setIndex(snap.index);
    setResults(null);
    setConfig(prev => ({ ...prev, length: snap.configLength, domain: snap.configDomain, durationSec: snap.durationSec }));
    setElapsed(Math.floor((Date.now() - snap.startedAt) / 1000));
    startTimeRef.current = snap.startedAt;
    setResumableSnapshot(null);
    setPhase('exam');
  }, []);

  const discardSnapshot = () => {
    clearSandboxSnapshot(EXAM_ID);
    setResumableSnapshot(null);
  };

  // Submit logic
  const submitExam = useCallback(() => {
    const timeSpentSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
    let correctCount = 0;
    let d1Correct = 0, d1Total = 0, d2Correct = 0, d2Total = 0;
    const rows: ResultRow[] = [];

    for (const q of examQuestions) {
      const a = answers[q.id];
      const selected = a?.selected ?? [];
      const correct = isAnswerCorrect(q, selected, a?.subAnswers);
      if (correct) correctCount++;
      if (q.domain === 1) { d1Total++; if (correct) d1Correct++; }
      else { d2Total++; if (correct) d2Correct++; }
      rows.push({ question: q, selected, correct, flagged: a?.flagged ?? false });
    }

    const scoreScaled = scaleEocepScore(correctCount, examQuestions.length);
    const passed = scoreScaled >= PASS;

    const final: FinalResults = {
      scoreScaled,
      passed,
      correctCount,
      totalCount: examQuestions.length,
      d1Correct, d1Total, d2Correct, d2Total,
      timeSpentSec,
      rows,
    };
    setResults(final);
    setPhase('submitted');

    // Submitted — discard the resume snapshot
    clearSandboxSnapshot(EXAM_ID);

    // Save analytics snapshot (local, per-attempt with time-per-question)
    // Attribute current question's elapsed time before computing finals
    const currentId = examQuestions[index]?.id;
    if (currentId) {
      const elapsedSec = Math.floor((Date.now() - questionEnterRef.current) / 1000);
      questionTimesRef.current[currentId] = (questionTimesRef.current[currentId] ?? 0) + Math.max(0, elapsedSec);
    }
    const perQuestion: PerQuestion[] = rows.map(r => ({
      questionId: r.question.id,
      timeSec: questionTimesRef.current[r.question.id] ?? 0,
      correct: r.correct,
      domain: r.question.domain,
      subdomain: r.question.subdomain,
    }));
    saveAttempt(EXAM_ID, {
      id: String(Date.now()),
      completedAt: Date.now(),
      scoreScaled,
      passed,
      totalQuestions: examQuestions.length,
      correctCount,
      timeSpentSec,
      mode: config.length === 'full' ? 'full' : 'practice',
      practiceMode: config.practiceMode,
      perQuestion,
    });

    // Feed drill stats so Diagnostic sees these answers
    let drillStats = loadStats(EXAM_ID);
    for (const r of rows) {
      drillStats = recordAnswer(drillStats, r.question.id, r.correct, 'unsure');
    }
    saveStats(EXAM_ID, drillStats);

    // POST to backend (shared with v1)
    void apiWrite('/api/exam-prep/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: config.length === 'full' ? 'full' : 'practice',
        score: scoreScaled,
        totalQuestions: examQuestions.length,
        correctCount,
        domain1Score: d1Correct,
        domain1Total: d1Total,
        domain2Score: d2Correct,
        domain2Total: d2Total,
        passed,
        timeSpentSec,
        results: rows.map(r => ({ questionId: r.question.id, selected: r.selected, correct: r.correct })),
      }),
    }).catch(reportStorageSyncFailure);
  }, [examQuestions, answers, config.length]);

  // Tick timer during exam phase
  useEffect(() => {
    if (phase !== 'exam') {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase]);

  // Auto-submit when timer runs out
  useEffect(() => {
    if (phase === 'exam' && remaining === 0 && examQuestions.length > 0) {
      submitExam();
    }
  }, [phase, remaining, examQuestions.length, submitExam]);

  // Keyboard shortcuts during the exam: ← → for nav, F flag, R review, 1-9 select option
  useEffect(() => {
    if (phase !== 'exam') return;
    const cur = examQuestions[index];
    if (!cur) return;
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.key === 'ArrowRight' && index < examQuestions.length - 1) {
        e.preventDefault();
        setIndex(i => Math.min(examQuestions.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        setIndex(i => Math.max(0, i - 1));
      } else if ((e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        toggleFlag(cur.id);
      } else if ((e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        setPhase('review');
      } else if (/^[1-9]$/.test(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (cur.type === 'single' || cur.type === 'yesno') {
          if (optIdx < cur.options.length) {
            e.preventDefault();
            setSelectSingle(cur.id, optIdx);
          }
        } else if (cur.type === 'multi') {
          if (optIdx < cur.options.length) {
            e.preventDefault();
            toggleSelectMulti(cur.id, optIdx);
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, index, examQuestions]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save snapshot on every change during exam / review phase
  useEffect(() => {
    if ((phase !== 'exam' && phase !== 'review') || examQuestions.length === 0) return;
    saveSandboxSnapshot({
      examId: EXAM_ID,
      startedAt: startTimeRef.current,
      durationSec: config.durationSec,
      questionIds: examQuestions.map(q => q.id),
      answers: Object.fromEntries(
        Object.entries(answers).map(([qid, a]) => [qid, { selected: a.selected, flagged: a.flagged }])
      ),
      index,
      configLength: config.length,
      configDomain: config.domain,
    });
  }, [phase, examQuestions, answers, index, config]);

  const current = examQuestions[index];

  // Record time spent on the previous question when index advances
  useEffect(() => {
    if (phase !== 'exam' || !current) return;
    const prevId = examQuestions[index]?.id;
    questionEnterRef.current = Date.now();
    return () => {
      // On unmount or index change, attribute elapsed seconds to the question we were on
      if (prevId) {
        const elapsedSec = Math.floor((Date.now() - questionEnterRef.current) / 1000);
        questionTimesRef.current[prevId] = (questionTimesRef.current[prevId] ?? 0) + Math.max(0, elapsedSec);
      }
    };
  }, [index, phase, current, examQuestions]);

  // Helpers
  const toggleSelectMulti = (qid: string, optIdx: number) => {
    setAnswers(prev => {
      const existing = prev[qid] ?? { questionId: qid, selected: [], flagged: false };
      const has = existing.selected.includes(optIdx);
      const next = has ? existing.selected.filter(i => i !== optIdx) : [...existing.selected, optIdx].sort((a, b) => a - b);
      return { ...prev, [qid]: { ...existing, selected: next } };
    });
  };

  const setSelectSingle = (qid: string, optIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [qid]: { ...(prev[qid] ?? { questionId: qid, selected: [], flagged: false }), selected: [optIdx] },
    }));
  };

  // For ordering questions, build a positions array (size N, filled with -1 when unset)
  const orderingPositions = (q: Question, selected: number[]): number[] => {
    const positions: number[] = new Array(q.options.length).fill(-1);
    selected.forEach((optIdx, posIdx) => {
      if (optIdx >= 0 && optIdx < q.options.length) positions[optIdx] = posIdx;
    });
    return positions;
  };

  const setOrderingPosition = (qid: string, optionIdx: number, position: number | null) => {
    setAnswers(prev => {
      const existing = prev[qid] ?? { questionId: qid, selected: [], flagged: false };
      // selected is an array where selected[pos] = optionIdx
      const order = [...existing.selected];
      // Remove this option from wherever it is
      const currentPos = order.indexOf(optionIdx);
      if (currentPos !== -1) order.splice(currentPos, 1);
      // If user set a position, place it; otherwise just remove
      if (position !== null) {
        // Make sure no other option occupies that position
        while (order.length < position) order.push(-1 as number);
        order.splice(position, 0, optionIdx);
        // Compact: remove any -1 entries that are extraneous
      }
      // Filter out invalid placeholders
      const compact = order.filter(x => x !== -1);
      return { ...prev, [qid]: { ...existing, selected: compact } };
    });
  };

  const toggleFlag = (qid: string) => {
    setAnswers(prev => {
      const existing = prev[qid] ?? { questionId: qid, selected: [], flagged: false };
      return { ...prev, [qid]: { ...existing, flagged: !existing.flagged } };
    });
  };

  // ============ RENDER ============

  // SETUP
  if (phase === 'setup') {
    return <SetupScreen
      config={config}
      onChange={setConfig}
      onStart={startExam}
      isDark={isDark}
      resumable={resumableSnapshot}
      onResume={resumeExam}
      onDiscardSnapshot={discardSnapshot}
      error={setupError}
    />;
  }

  // RESULTS
  if (phase === 'submitted' && results) {
    return <ResultsScreen
      results={results}
      onRetake={() => setPhase('setup')}
      isDark={isDark}
    />;
  }

  // REVIEW
  if (phase === 'review') {
    return <ReviewScreen
      questions={examQuestions}
      answers={answers}
      remaining={remaining}
      onJumpTo={(i) => { setIndex(i); setPhase('exam'); }}
      onSubmit={() => setShowSubmitConfirm(true)}
      onBackToExam={() => setPhase('exam')}
      isDark={isDark}
    />;
  }

  // EXAM (active)
  if (phase === 'exam' && current) {
    const answer = answers[current.id] ?? { questionId: current.id, selected: [], flagged: false };
    const answeredCount = examQuestions.filter(q => (answers[q.id]?.selected.length ?? 0) > 0).length;
    return (
      <Box className={`exam-sandbox ${isDark ? 'sandbox-dark' : 'sandbox-light'}`}>
        {/* Top bar */}
        <Box className="sb-topbar">
          <Box className="sb-topbar-left">
            <Typography className="sb-exam-title">USHC · U.S. History and the Constitution — Practice Exam</Typography>
          </Box>
          <Box className="sb-topbar-right">
            <Tooltip title={
              <Box sx={{ fontSize: '0.78rem', lineHeight: 1.6 }}>
                <strong>Keyboard shortcuts:</strong><br />
                ←/→ navigate · F flag · R review · 1–9 select option
              </Box>
            }>
              <IconButton size="small" className="sb-help-btn">
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box className={`sb-timer ${remaining < 300 ? 'sb-timer-warn' : ''}`}>
              <TimerIcon fontSize="small" />
              <Typography sx={{ fontWeight: 700, fontFamily: 'ui-monospace, monospace', fontSize: '0.95rem' }}>
                {formatTime(remaining)}
              </Typography>
            </Box>
            <Tooltip title="Exit exam">
              <IconButton size="small" className="sb-exit-btn" onClick={() => setShowExitConfirm(true)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Progress line */}
        <LinearProgress
          variant="determinate"
          value={(answeredCount / examQuestions.length) * 100}
          className="sb-progress"
        />

        {/* Question meta */}
        <Box className="sb-meta">
          <Typography className="sb-qnum">Question {index + 1} of {examQuestions.length}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                icon={<FlagOutlinedIcon fontSize="small" />}
                checkedIcon={<FlagIcon fontSize="small" />}
                checked={answer.flagged}
                onChange={() => toggleFlag(current.id)}
                sx={{ '&.Mui-checked': { color: '#C75A2D' } }}
              />
            }
            label="Mark for review"
            slotProps={{ typography: { fontSize: '0.82rem', fontWeight: 600 } }}
          />
        </Box>

        {/* Question body */}
        <Box className="sb-body">
          <Typography className="sb-question-stem">{current.question}</Typography>
          {current.codeSnippet && (
            <Box className="sb-code">{current.codeSnippet}</Box>
          )}

          <Box className="sb-instruction">
            {current.type === 'single' && 'Select the best answer.'}
            {current.type === 'multi' && `Select all that apply. (Correct answer requires ${current.correctAnswers.length} selections.)`}
            {current.type === 'yesno' && 'Select Yes or No.'}
            {current.type === 'ordering' && 'Set the correct position for each step.'}
            {current.type === 'match' && 'Match each item on the left with the correct item on the right.'}
            {current.type === 'hot-area' && 'Click the correct region in the diagram below.'}
            {current.type === 'case-study' && 'Read the scenario, then answer all sub-questions.'}
          </Box>

          {current.type === 'ordering' && (
            <OrderingAnswerArea
              question={current}
              positions={orderingPositions(current, answer.selected)}
              onSet={(optIdx, pos) => setOrderingPosition(current.id, optIdx, pos)}
            />
          )}

          {current.type === 'match' && current.match && (
            <MatchAnswerArea
              question={current}
              selected={answer.selected}
              onSet={(pairs) => setAnswers(prev => ({
                ...prev,
                [current.id]: { ...(prev[current.id] ?? { questionId: current.id, selected: [], flagged: false }), selected: pairs },
              }))}
            />
          )}

          {current.type === 'hot-area' && current.hotArea && (
            <HotAreaAnswerArea
              question={current}
              selected={answer.selected}
              onSet={(idx) => setAnswers(prev => ({
                ...prev,
                [current.id]: { ...(prev[current.id] ?? { questionId: current.id, selected: [], flagged: false }), selected: [idx] },
              }))}
            />
          )}

          {current.type === 'case-study' && current.caseStudy && (
            <CaseStudyAnswerArea
              question={current}
              subAnswers={answer.subAnswers ?? []}
              onSetSub={(subIdx, sel) => setAnswers(prev => {
                const existing = prev[current.id] ?? { questionId: current.id, selected: [], flagged: false };
                const subAnswers = [...(existing.subAnswers ?? [])];
                subAnswers[subIdx] = sel;
                // also flag answered: selected length > 0 if any sub answered
                const flatLen = subAnswers.reduce((acc, s) => acc + s.length, 0);
                return {
                  ...prev,
                  [current.id]: { ...existing, subAnswers, selected: flatLen > 0 ? [1] : [] },
                };
              })}
            />
          )}

          {(current.type === 'single' || current.type === 'multi' || current.type === 'yesno') && (
            <Stack spacing={1}>
              {current.options.map((opt, i) => {
                const selected = answer.selected.includes(i);
                return (
                  <Box
                    key={i}
                    className={`sb-option ${selected ? 'sb-option-selected' : ''}`}
                    onClick={() => {
                      if (current.type === 'multi') toggleSelectMulti(current.id, i);
                      else setSelectSingle(current.id, i);
                    }}
                  >
                    {current.type === 'multi' ? (
                      <Checkbox size="small" checked={selected} sx={{ p: 0.5, mr: 1 }} />
                    ) : (
                      <Radio size="small" checked={selected} sx={{ p: 0.5, mr: 1 }} />
                    )}
                    <Typography className="sb-option-text">{opt}</Typography>
                  </Box>
                );
              })}
            </Stack>
          )}

          {/* Practice mode — show explanation after answering, before Next */}
          {config.practiceMode === 'practice' && answer.selected.length > 0 && (
            <Box sx={{ mt: 2, p: 2, borderRadius: 1.5, backgroundColor: 'rgba(160, 82, 45, 0.08)', border: '1px solid rgba(160, 82, 45, 0.3)' }}>
              <Typography variant="caption" sx={{ color: '#A0522D', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                Practice mode · explanation
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', mt: 0.5, lineHeight: 1.6 }}>
                {isAnswerCorrect(current, answer.selected, answer.subAnswers) ? '✅ Correct.' : '❌ Not quite.'} {current.explanation}
              </Typography>
              {current.examTip && (
                <Typography sx={{ fontSize: '0.85rem', mt: 1, lineHeight: 1.6, fontStyle: 'italic' }}>
                  💡 {current.examTip}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Bottom nav */}
        <Box className="sb-footer">
          <Button
            variant="outlined"
            disabled={index === 0}
            onClick={() => setIndex(i => Math.max(0, i - 1))}
            className="sb-nav-btn"
          >
            ← Previous
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPhase('review')}
            className="sb-nav-btn sb-review-btn"
          >
            Review Answers
          </Button>
          {index < examQuestions.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setIndex(i => Math.min(examQuestions.length - 1, i + 1))}
              className="sb-nav-btn sb-next-btn"
            >
              Next →
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPhase('review')}
              className="sb-nav-btn sb-next-btn"
            >
              Review &amp; Submit →
            </Button>
          )}
        </Box>

        {/* Submit confirmation */}
        <Dialog open={showSubmitConfirm} onClose={() => setShowSubmitConfirm(false)}>
          <DialogTitle>Submit exam?</DialogTitle>
          <DialogContent>
            <Typography>
              Once submitted, you cannot change your answers. Time used: {formatTime(elapsed)}.
            </Typography>
            <Typography sx={{ mt: 1, color: '#C75A2D', fontWeight: 600 }}>
              {examQuestions.length - answeredCount} unanswered{' '}
              · {examQuestions.filter(q => answers[q.id]?.flagged).length} flagged
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSubmitConfirm(false)}>Keep working</Button>
            <Button variant="contained" color="primary" onClick={() => { setShowSubmitConfirm(false); submitExam(); }}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Exit confirmation */}
        <Dialog open={showExitConfirm} onClose={() => setShowExitConfirm(false)}>
          <DialogTitle>Exit without submitting?</DialogTitle>
          <DialogContent>
            <Typography>You'll lose all answers for this attempt. Continue?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowExitConfirm(false)}>Cancel</Button>
            <Button color="error" onClick={() => { setShowExitConfirm(false); setPhase('setup'); }}>
              Exit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return null;
}

// ============ SUB-COMPONENTS ============

function SetupScreen({
  config, onChange, onStart, isDark, resumable, onResume, onDiscardSnapshot, error,
}: {
  config: ExamConfig;
  onChange: (c: ExamConfig) => void;
  onStart: () => void;
  isDark: boolean;
  resumable: SandboxSnapshot | null;
  onResume: (snap: SandboxSnapshot) => void;
  onDiscardSnapshot: () => void;
  error: string | null;
}) {
  const ACCENT = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';

  const lengthOptions: { id: Length; label: string; sub: string; count: number; duration: number }[] = [
    { id: 'full',  label: 'Full simulation',       sub: 'Closest to real exam',   count: 50, duration: 60 * 60 },
    { id: 'short', label: 'Short practice (25 Q)', sub: 'Half-length, half-time', count: 25, duration: 35 * 60 },
  ];

  const availableDomains = availableQuestionDomains(questions)
    .filter((domain): domain is Exclude<DomainPick, 'both'> => domain === 1 || domain === 2);
  const domainOptions: { id: DomainPick; label: string }[] = [
    { id: 'both', label: 'All topics' },
    ...availableDomains.map(domain => ({
      id: domain,
      label: domain === 1 ? 'U.S. History topics' : `Domain ${domain}`,
    })),
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {resumable && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2,
            backgroundColor: CARD_BG,
            border: `1px solid ${ACCENT}`,
            borderLeft: `4px solid ${ACCENT}`,
            borderRadius: 2,
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: ACCENT, fontSize: '1rem', mb: 0.25 }}>
                ⏸️ In-progress exam found
              </Typography>
              <Typography variant="caption" sx={{ color: TEXT_SEC }}>
                Started {Math.round((Date.now() - resumable.startedAt) / 60000)} min ago · question {resumable.index + 1} of {resumable.questionIds.length} · {Math.floor((resumable.durationSec - (Date.now() - resumable.startedAt) / 1000) / 60)} min left on the clock
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={() => onResume(resumable)}
                sx={{ backgroundColor: ACCENT, '&:hover': { backgroundColor: ACCENT, opacity: 0.9 }, fontWeight: 700, textTransform: 'none' }}
              >
                Resume exam
              </Button>
              <Button
                variant="text"
                onClick={onDiscardSnapshot}
                sx={{ color: TEXT_SEC, textTransform: 'none' }}
              >
                Discard
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Paper elevation={0} sx={{ p: 3, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, color: TEXT_PRI, mb: 1, fontSize: '0.92rem' }}>Exam length</Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {lengthOptions.map(opt => {
            const active = opt.id === config.length;
            return (
              <Box
                key={opt.id}
                onClick={() => onChange({ ...config, length: opt.id, durationSec: opt.duration })}
                sx={{
                  cursor: 'pointer',
                  p: 1.5,
                  borderRadius: 1.5,
                  border: `1px solid ${active ? ACCENT : BORDER}`,
                  backgroundColor: active ? alpha(ACCENT, 0.1) : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': { borderColor: ACCENT },
                }}
              >
                <Radio size="small" checked={active} sx={{ p: 0.5 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: TEXT_PRI, fontSize: '0.95rem' }}>{opt.label}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SEC }}>{opt.sub}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, color: ACCENT, fontSize: '0.9rem' }}>{opt.count} Q</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SEC }}>{Math.floor(opt.duration / 60)} min</Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>

        <Typography sx={{ fontWeight: 700, color: TEXT_PRI, mb: 1, fontSize: '0.92rem' }}>Domain coverage</Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {domainOptions.map(opt => {
            const active = opt.id === config.domain;
            return (
              <Box
                key={String(opt.id)}
                onClick={() => onChange({ ...config, domain: opt.id })}
                sx={{
                  cursor: 'pointer',
                  p: 1.25,
                  borderRadius: 1.5,
                  border: `1px solid ${active ? ACCENT : BORDER}`,
                  backgroundColor: active ? alpha(ACCENT, 0.1) : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': { borderColor: ACCENT },
                }}
              >
                <Radio size="small" checked={active} sx={{ p: 0.5 }} />
                <Typography sx={{ color: TEXT_PRI, fontSize: '0.9rem' }}>{opt.label}</Typography>
              </Box>
            );
          })}
        </Stack>

        <Typography sx={{ fontWeight: 700, color: TEXT_PRI, mb: 1, fontSize: '0.92rem' }}>Mode</Typography>
        <Stack spacing={1} sx={{ mb: 2 }}>
          {([
            { id: 'strict', label: 'Strict — like the real exam', sub: 'No feedback until you submit. Most realistic.' },
            { id: 'practice', label: 'Practice — show explanation after each answer', sub: 'See whether you got it right before moving on. Best for learning.' },
          ] as const).map(opt => {
            const active = opt.id === config.practiceMode;
            return (
              <Box
                key={opt.id}
                onClick={() => onChange({ ...config, practiceMode: opt.id })}
                sx={{
                  cursor: 'pointer',
                  p: 1.25,
                  borderRadius: 1.5,
                  border: `1px solid ${active ? ACCENT : BORDER}`,
                  backgroundColor: active ? alpha(ACCENT, 0.1) : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  '&:hover': { borderColor: ACCENT },
                }}
              >
                <Radio size="small" checked={active} sx={{ p: 0.5 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: TEXT_PRI, fontSize: '0.95rem' }}>{opt.label}</Typography>
                  <Typography variant="caption" sx={{ color: TEXT_SEC }}>{opt.sub}</Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>

        <Divider sx={{ my: 2, borderColor: BORDER }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip size="small" label="Pass = 700/1000" sx={{ backgroundColor: alpha(ACCENT, 0.15), color: ACCENT, fontWeight: 700 }} />
          <Chip size="small" label="Auto-submits at time-up" variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
          <Chip size="small" label="Free question navigation" variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
          <Chip size="small" label="Resumes after reload" variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC }} />
        </Box>

        {error && (
          <Typography role="alert" variant="body2" sx={{ color: 'error.main', mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          startIcon={<StartIcon />}
          onClick={onStart}
          sx={{
            backgroundColor: ACCENT,
            py: 1.25,
            fontWeight: 700,
            fontSize: '0.95rem',
            '&:hover': { backgroundColor: ACCENT, opacity: 0.9 },
          }}
        >
          Start Exam
        </Button>
      </Paper>

      <Paper elevation={0} sx={{ p: 2.5, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Typography variant="caption" sx={{ color: TEXT_SEC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          What this simulates
        </Typography>
        <Box component="ul" sx={{ color: TEXT_PRI, fontSize: '0.85rem', pl: 2, mt: 1, lineHeight: 1.7 }}>
          <li>Full-screen immersive mode, like Microsoft's real exam delivery</li>
          <li>Counting-down timer (warning under 5 minutes)</li>
          <li>Mark questions for review and jump around freely</li>
          <li>Review-answers screen with question grid before final submit</li>
          <li>Auto-submit if the timer hits zero</li>
          <li>Scaled score on Microsoft's 0–1000 scale, with domain and subdomain breakdown</li>
        </Box>
      </Paper>
    </Box>
  );
}

function OrderingAnswerArea({
  question, positions, onSet,
}: {
  question: Question;
  positions: number[]; // positions[optionIdx] = position number (0-based) or -1 if unset
  onSet: (optIdx: number, pos: number | null) => void;
}) {
  const n = question.options.length;
  return (
    <Stack spacing={1}>
      {question.options.map((opt, optIdx) => {
        const pos = positions[optIdx];
        return (
          <Box
            key={optIdx}
            sx={{
              p: 1.25,
              borderRadius: 1.5,
              border: '1px solid var(--sb-border, #EDE8E3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: pos !== -1 ? 'var(--sb-option-selected, rgba(92,42,74,0.10))' : 'transparent',
            }}
          >
            <Select
              size="small"
              value={pos === -1 ? '' : pos}
              onChange={(e) => {
                const v = String(e.target.value ?? '');
                onSet(optIdx, v === '' ? null : Number(v));
              }}
              displayEmpty
              sx={{ minWidth: 110, fontSize: '0.85rem' }}
            >
              <MenuItem value=""><em>Position…</em></MenuItem>
              {Array.from({ length: n }, (_, i) => (
                <MenuItem key={i} value={i}>Position {i + 1}</MenuItem>
              ))}
            </Select>
            <Typography sx={{ fontSize: '0.92rem', flexGrow: 1 }}>{opt}</Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

function ReviewScreen({
  questions: examQuestions, answers, remaining, onJumpTo, onSubmit, onBackToExam, isDark,
}: {
  questions: Question[];
  answers: Record<string, AnswerState>;
  remaining: number;
  onJumpTo: (i: number) => void;
  onSubmit: () => void;
  onBackToExam: () => void;
  isDark: boolean;
}) {
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'flagged'>('all');

  const answeredSet = new Set(
    examQuestions.filter(q => (answers[q.id]?.selected.length ?? 0) > 0).map(q => q.id)
  );
  const flaggedSet = new Set(
    examQuestions.filter(q => answers[q.id]?.flagged).map(q => q.id)
  );

  const filtered = examQuestions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => {
      if (filter === 'unanswered') return !answeredSet.has(q.id);
      if (filter === 'flagged') return flaggedSet.has(q.id);
      return true;
    });

  return (
    <Box className={`exam-sandbox ${isDark ? 'sandbox-dark' : 'sandbox-light'}`}>
      <Box className="sb-topbar">
        <Box className="sb-topbar-left">
          <Typography className="sb-exam-title">Review Answers</Typography>
        </Box>
        <Box className="sb-topbar-right">
          <Box className={`sb-timer ${remaining < 300 ? 'sb-timer-warn' : ''}`}>
            <TimerIcon fontSize="small" />
            <Typography sx={{ fontWeight: 700, fontFamily: 'ui-monospace, monospace', fontSize: '0.95rem' }}>
              {formatTime(remaining)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="sb-review-body">
        <Box className="sb-review-summary">
          <Box className="sb-stat-chip">
            <Typography className="sb-stat-num">{examQuestions.length}</Typography>
            <Typography className="sb-stat-label">Total</Typography>
          </Box>
          <Box className="sb-stat-chip" sx={{ borderColor: '#3C6E4B' }}>
            <Typography className="sb-stat-num" sx={{ color: '#3C6E4B' }}>{answeredSet.size}</Typography>
            <Typography className="sb-stat-label">Answered</Typography>
          </Box>
          <Box className="sb-stat-chip" sx={{ borderColor: '#C75A2D' }}>
            <Typography className="sb-stat-num" sx={{ color: '#C75A2D' }}>{examQuestions.length - answeredSet.size}</Typography>
            <Typography className="sb-stat-label">Unanswered</Typography>
          </Box>
          <Box className="sb-stat-chip" sx={{ borderColor: '#B08139' }}>
            <Typography className="sb-stat-num" sx={{ color: '#B08139' }}>{flaggedSet.size}</Typography>
            <Typography className="sb-stat-label">Flagged</Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={`All (${examQuestions.length})`}
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'primary' : 'default'}
            variant={filter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Unanswered (${examQuestions.length - answeredSet.size})`}
            onClick={() => setFilter('unanswered')}
            color={filter === 'unanswered' ? 'primary' : 'default'}
            variant={filter === 'unanswered' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Flagged (${flaggedSet.size})`}
            onClick={() => setFilter('flagged')}
            color={filter === 'flagged' ? 'primary' : 'default'}
            variant={filter === 'flagged' ? 'filled' : 'outlined'}
          />
        </Stack>

        <Box className="sb-question-grid">
          {filtered.map(({ q, i }) => {
            const answered = answeredSet.has(q.id);
            const flagged = flaggedSet.has(q.id);
            return (
              <Box
                key={q.id}
                className={`sb-grid-cell ${answered ? 'sb-grid-answered' : 'sb-grid-unanswered'} ${flagged ? 'sb-grid-flagged' : ''}`}
                onClick={() => onJumpTo(i)}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{i + 1}</Typography>
                {flagged && <FlagIcon className="sb-grid-flag" />}
              </Box>
            );
          })}
        </Box>

        <Box className="sb-review-footer">
          <Button variant="outlined" onClick={onBackToExam} className="sb-nav-btn">
            ← Back to exam
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            className="sb-nav-btn sb-submit-btn"
            color="primary"
          >
            Submit Exam
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function ResultsScreen({
  results, onRetake, isDark,
}: {
  results: FinalResults;
  onRetake: () => void;
  isDark: boolean;
}) {
  const ACCENT = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const GOOD = isDark ? '#7BAF85' : '#3C6E4B';
  const BAD = isDark ? '#D88366' : '#C75A2D';
  const VERDICT_COLOR = results.passed ? GOOD : BAD;

  const subdomainBreakdown = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const r of results.rows) {
      const key = r.question.subdomain;
      if (!map.has(key)) map.set(key, { total: 0, correct: 0 });
      const e = map.get(key)!;
      e.total += 1;
      if (r.correct) e.correct += 1;
    }
    return [...map.entries()]
      .map(([subdomain, v]) => ({ subdomain, ...v, accuracy: v.correct / v.total }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [results]);

  const [reviewOpen, setReviewOpen] = useState(false);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: { xs: 2, md: 3 }, pb: 6 }}>
      {/* Verdict hero */}
      <Paper elevation={0} sx={{ p: 4, backgroundColor: CARD_BG, border: `2px solid ${VERDICT_COLOR}`, borderRadius: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 140, height: 140, borderRadius: '50%',
              backgroundColor: alpha(VERDICT_COLOR, 0.15),
              border: `5px solid ${VERDICT_COLOR}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '2.2rem', color: VERDICT_COLOR, fontFamily: 'var(--hearth-heading)', lineHeight: 1 }}>
                {results.scoreScaled}
              </Typography>
              <Typography variant="caption" sx={{ color: TEXT_SEC, fontSize: '0.7rem' }}>
                /1000
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: VERDICT_COLOR, fontFamily: 'var(--hearth-heading)' }}>
              {results.passed ? 'PASS' : 'FAIL'}
            </Typography>
            <Typography sx={{ color: TEXT_PRI, fontSize: '1rem', mt: 0.5 }}>
              {results.correctCount} of {results.totalCount} correct ({((results.correctCount / results.totalCount) * 100).toFixed(0)}%) · {formatTime(results.timeSpentSec)} used
            </Typography>
            <Typography variant="body2" sx={{ color: TEXT_SEC, mt: 1.5, maxWidth: 500 }}>
              {results.passed
                ? results.scoreScaled >= 800
                  ? "Solid pass — you're consistently in command of the material. You're ready for the real exam."
                  : "Pass, but on the lower end. Use Diagnostic to find your weak subdomains and drill them before scheduling."
                : "Not yet. Use the subdomain breakdown below to identify gaps, then drill them in the Drill tab. Re-take when subdomain accuracy is above 75%."}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Domain breakdown */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 2 }}>By domain</Typography>
        <Stack spacing={2}>
          {results.d1Total > 0 && (
            <DomainBar
              label="Domain 1 — AI Fundamentals"
              correct={results.d1Correct}
              total={results.d1Total}
              colors={{ ACCENT, TEXT_PRI, TEXT_SEC, GOOD, BAD }}
            />
          )}
          {results.d2Total > 0 && (
            <DomainBar
              label="Domain 2 — Generative AI on Azure"
              correct={results.d2Correct}
              total={results.d2Total}
              colors={{ ACCENT, TEXT_PRI, TEXT_SEC, GOOD, BAD }}
            />
          )}
        </Stack>
      </Paper>

      {/* Subdomain breakdown */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI, mb: 0.5 }}>By subdomain</Typography>
        <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', mb: 2 }}>
          Sorted weakest first — these are your study priorities.
        </Typography>
        <Stack spacing={1.5}>
          {subdomainBreakdown.map(s => {
            const color = s.accuracy >= 0.8 ? GOOD : s.accuracy >= 0.65 ? '#B08139' : BAD;
            return (
              <Box key={s.subdomain}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 600, color: TEXT_PRI, fontSize: '0.9rem' }}>{s.subdomain}</Typography>
                  <Typography sx={{ fontWeight: 700, color, fontSize: '0.88rem' }}>
                    {(s.accuracy * 100).toFixed(0)}% · {s.correct}/{s.total}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={s.accuracy * 100}
                  sx={{
                    height: 8, borderRadius: 2,
                    backgroundColor: alpha(color, 0.2),
                    '& .MuiLinearProgress-bar': { backgroundColor: color },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </Paper>

      {/* Review questions */}
      <Paper elevation={0} sx={{ p: 3, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_PRI }}>Question-by-question review</Typography>
          <Button size="small" variant="text" onClick={() => setReviewOpen(o => !o)} sx={{ color: ACCENT, textTransform: 'none' }}>
            {reviewOpen ? 'Collapse' : 'Expand'}
          </Button>
        </Stack>
        {reviewOpen && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {results.rows.map((r, i) => (
              <Box key={r.question.id} sx={{
                p: 2,
                borderRadius: 1.5,
                border: `1px solid ${r.correct ? alpha(GOOD, 0.5) : alpha(BAD, 0.5)}`,
                backgroundColor: alpha(r.correct ? GOOD : BAD, 0.05),
              }}>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1 }}>
                  {r.correct ? <CheckIcon sx={{ color: GOOD }} /> : <XIcon sx={{ color: BAD }} />}
                  <Typography sx={{ fontWeight: 700, color: TEXT_PRI, fontSize: '0.9rem' }}>
                    Q{i + 1}
                  </Typography>
                  <Chip size="small" label={`D${r.question.domain}`} sx={{ backgroundColor: alpha(ACCENT, 0.15), color: ACCENT, fontWeight: 700, height: 20 }} />
                  <Chip size="small" label={r.question.subdomain} variant="outlined" sx={{ borderColor: BORDER, color: TEXT_SEC, height: 20 }} />
                  {r.flagged && <Chip size="small" icon={<FlagIcon sx={{ fontSize: 14 }} />} label="Flagged" sx={{ backgroundColor: alpha('#B08139', 0.15), color: '#B08139', fontWeight: 700, height: 20 }} />}
                </Stack>
                <Typography sx={{ color: TEXT_PRI, fontSize: '0.9rem', mb: 1, lineHeight: 1.5 }}>{r.question.question}</Typography>
                <Box sx={{ pl: 2 }}>
                  {r.question.options.map((opt, j) => {
                    const wasSelected = r.selected.includes(j);
                    const isCorrect = r.question.correctAnswers.includes(j);
                    return (
                      <Typography
                        key={j}
                        sx={{
                          fontSize: '0.85rem',
                          color: isCorrect ? GOOD : wasSelected ? BAD : TEXT_SEC,
                          fontWeight: isCorrect || wasSelected ? 600 : 400,
                          py: 0.25,
                        }}
                      >
                        {isCorrect ? '✓' : wasSelected ? '✗' : ' '} {opt}
                        {isCorrect && !wasSelected && <span style={{ color: TEXT_SEC, fontWeight: 400 }}> (correct answer)</span>}
                        {wasSelected && !isCorrect && <span style={{ color: TEXT_SEC, fontWeight: 400 }}> (your answer)</span>}
                      </Typography>
                    );
                  })}
                </Box>
                <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, backgroundColor: isDark ? '#1E0F06' : '#FBF7F2' }}>
                  <Typography variant="caption" sx={{ color: TEXT_SEC, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Explanation
                  </Typography>
                  <Typography sx={{ color: TEXT_PRI, fontSize: '0.85rem', mt: 0.5, lineHeight: 1.5 }}>
                    {r.question.explanation}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          startIcon={<RetryIcon />}
          onClick={onRetake}
          sx={{ backgroundColor: ACCENT, '&:hover': { backgroundColor: ACCENT, opacity: 0.9 } }}
        >
          Take another exam
        </Button>
      </Box>
    </Box>
  );
}

function DomainBar({
  label, correct, total, colors,
}: {
  label: string; correct: number; total: number;
  colors: { ACCENT: string; TEXT_PRI: string; TEXT_SEC: string; GOOD: string; BAD: string };
}) {
  const acc = total === 0 ? 0 : correct / total;
  const color = acc >= 0.75 ? colors.GOOD : acc >= 0.6 ? '#B08139' : colors.BAD;
  return (
    <Box>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontWeight: 700, color: colors.TEXT_PRI, fontSize: '0.95rem' }}>{label}</Typography>
        <Typography sx={{ fontWeight: 700, color, fontSize: '1rem' }}>
          {(acc * 100).toFixed(0)}% · {correct}/{total}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={acc * 100}
        sx={{ height: 10, borderRadius: 2, backgroundColor: alpha(color, 0.2), '& .MuiLinearProgress-bar': { backgroundColor: color } }}
      />
    </Box>
  );
}

// =============== NEW FORMAT COMPONENTS ===============

function MatchAnswerArea({
  question, selected, onSet,
}: {
  question: Question;
  selected: number[]; // flat pairs [leftIdx0, rightIdx0, ...]
  onSet: (pairs: number[]) => void;
}) {
  if (!question.match) return null;
  const { leftItems, rightItems } = question.match;

  // Decode current pairs map (leftIdx → rightIdx)
  const pairs: Record<number, number> = {};
  for (let i = 0; i + 1 < selected.length; i += 2) {
    pairs[selected[i]] = selected[i + 1];
  }

  const setPair = (leftIdx: number, rightIdx: number | null) => {
    const newPairs = { ...pairs };
    if (rightIdx === null) delete newPairs[leftIdx];
    else newPairs[leftIdx] = rightIdx;
    const flat: number[] = [];
    for (const k of Object.keys(newPairs)) {
      flat.push(Number(k), newPairs[Number(k)]);
    }
    onSet(flat);
  };

  return (
    <Stack spacing={1}>
      {leftItems.map((left, leftIdx) => {
        const currentRight = pairs[leftIdx];
        return (
          <Box
            key={leftIdx}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: '1px solid var(--sb-border, #DCD3C7)',
              backgroundColor: currentRight !== undefined ? 'var(--sb-option-selected, rgba(0,120,212,0.12))' : 'var(--sb-surface, #FFFFFF)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography sx={{ flexGrow: 1, fontSize: '0.92rem', color: 'var(--sb-text, #1C0F07)' }}>{left}</Typography>
            <Typography variant="caption" sx={{ color: 'var(--sb-text-sec, #6B5A48)' }}>→</Typography>
            <Select
              size="small"
              value={currentRight ?? ''}
              displayEmpty
              onChange={(e) => {
                const v = String(e.target.value ?? '');
                setPair(leftIdx, v === '' ? null : Number(v));
              }}
              sx={{ minWidth: 220, fontSize: '0.88rem' }}
            >
              <MenuItem value=""><em>Select match…</em></MenuItem>
              {rightItems.map((right, rIdx) => (
                <MenuItem key={rIdx} value={rIdx}>{right}</MenuItem>
              ))}
            </Select>
          </Box>
        );
      })}
    </Stack>
  );
}

function HotAreaAnswerArea({
  question, selected, onSet,
}: {
  question: Question;
  selected: number[];
  onSet: (idx: number) => void;
}) {
  if (!question.hotArea) return null;
  const { svg, targets } = question.hotArea;

  // Use a ref + effect to wire up click handlers on the rendered SVG
  const svgRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = svgRef.current;
    if (!container) return;
    const elements = container.querySelectorAll<SVGElement>('[data-target]');
    const selectedTargetId = selected[0] !== undefined ? targets[selected[0]]?.id : null;
    const handlers: { el: SVGElement; handler: (e: Event) => void }[] = [];
    elements.forEach(el => {
      const id = el.getAttribute('data-target');
      if (!id) return;
      const idx = targets.findIndex(t => t.id === id);
      const isSelected = id === selectedTargetId;
      el.style.outline = isSelected ? '3px solid #A0522D' : '';
      el.style.outlineOffset = isSelected ? '2px' : '';
      const handler = () => onSet(idx);
      el.addEventListener('click', handler);
      handlers.push({ el, handler });
    });
    return () => {
      handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler));
    };
  }, [svg, targets, selected, onSet]);

  return (
    <Box>
      <Box
        ref={svgRef}
        sx={{
          p: 2,
          backgroundColor: 'var(--sb-surface, #FFFFFF)',
          border: '1px solid var(--sb-border, #DCD3C7)',
          borderRadius: 1.5,
          '& svg': { width: '100%', maxWidth: 700, height: 'auto', display: 'block', mx: 'auto' },
          '--ha-surface': 'var(--sb-surface, #FFFFFF)',
          '--ha-border': 'var(--sb-border, #DCD3C7)',
          '--ha-accent': 'var(--sb-accent, #A0522D)',
          '--ha-text': 'var(--sb-text, #1C0F07)',
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {selected[0] !== undefined && targets[selected[0]] && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: 'var(--sb-text-sec, #6B5A48)' }}>
          Selected: <strong>{targets[selected[0]].label}</strong>
        </Typography>
      )}
    </Box>
  );
}

function CaseStudyAnswerArea({
  question, subAnswers, onSetSub,
}: {
  question: Question;
  subAnswers: number[][];
  onSetSub: (subIdx: number, selected: number[]) => void;
}) {
  if (!question.caseStudy) return null;
  const { scenario, subQuestions } = question.caseStudy;

  return (
    <Stack spacing={2}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: 'var(--sb-bg, #FAF7F2)',
          border: '1px solid var(--sb-border, #DCD3C7)',
          borderRadius: 1.5,
        }}
      >
        <Typography variant="caption" sx={{ color: 'var(--sb-accent, #A0522D)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
          Scenario
        </Typography>
        <Typography sx={{ fontSize: '0.92rem', mt: 0.5, lineHeight: 1.65, color: 'var(--sb-text, #1C0F07)' }}>
          {scenario}
        </Typography>
      </Paper>

      {subQuestions.map((sub, subIdx) => {
        const sel = subAnswers[subIdx] ?? [];
        const isMulti = sub.type === 'multi';
        const toggle = (i: number) => {
          if (isMulti) {
            const next = sel.includes(i) ? sel.filter(x => x !== i) : [...sel, i].sort((a, b) => a - b);
            onSetSub(subIdx, next);
          } else {
            onSetSub(subIdx, [i]);
          }
        };
        return (
          <Box key={subIdx}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 1, color: 'var(--sb-text, #1C0F07)' }}>
              {subIdx + 1}. {sub.question}
            </Typography>
            <Stack spacing={1}>
              {sub.options.map((opt, i) => {
                const selected = sel.includes(i);
                return (
                  <Box
                    key={i}
                    onClick={() => toggle(i)}
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      border: `1px solid ${selected ? 'var(--sb-accent, #A0522D)' : 'var(--sb-border, #DCD3C7)'}`,
                      backgroundColor: selected ? 'var(--sb-option-selected, rgba(92,42,74,0.12))' : 'var(--sb-surface, #FFFFFF)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {isMulti ? (
                      <Checkbox size="small" checked={selected} sx={{ p: 0.5, mr: 1 }} />
                    ) : (
                      <Radio size="small" checked={selected} sx={{ p: 0.5, mr: 1 }} />
                    )}
                    <Typography sx={{ fontSize: '0.9rem' }}>{opt}</Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
