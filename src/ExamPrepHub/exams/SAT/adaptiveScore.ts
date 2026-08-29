export interface AdaptiveScoreQuestion {
  id: string;
  section: 'reading-writing' | 'math';
  domain: string;
  correctAnswers: number[];
}

export interface AdaptiveScoreResults {
  rwRaw: number;
  rwScaled: number;
  mathRaw: number;
  mathScaled: number;
  totalScaled: number;
  domainBreakdown: Record<string, { correct: number; total: number }>;
}

export type AdaptiveTestMode = 'full' | 'rw-only' | 'math-only';

export interface AdaptiveResultSummary {
  heading: string;
  score: number;
  maxScore: 800 | 1600;
  sectionScores: Array<{ label: string; score: number }>;
}

export const countCurrentModuleAnswers = (
  questions: Array<{ id: string }>,
  answers: Record<string, number | null>,
): number => questions.reduce(
  (count, question) => count + (typeof answers[question.id] === 'number' ? 1 : 0),
  0,
);

export const adaptiveResultSummary = (
  mode: AdaptiveTestMode,
  results: AdaptiveScoreResults,
): AdaptiveResultSummary => {
  if (mode === 'rw-only') {
    return {
      heading: 'Reading & Writing Score',
      score: results.rwScaled,
      maxScore: 800,
      sectionScores: [],
    };
  }
  if (mode === 'math-only') {
    return {
      heading: 'Math Score',
      score: results.mathScaled,
      maxScore: 800,
      sectionScores: [],
    };
  }
  return {
    heading: 'Your SAT Score',
    score: results.totalScaled,
    maxScore: 1600,
    sectionScores: [
      { label: 'Reading & Writing', score: results.rwScaled },
      { label: 'Math', score: results.mathScaled },
    ],
  };
};

export type AdaptiveRoute = 'easy' | 'medium' | 'hard';

const rawToScaled = (raw: number, total: number, route: AdaptiveRoute = 'medium'): number => {
  const routeAdjustment = route === 'hard' ? 30 : route === 'easy' ? -30 : 0;
  const scaled = Math.round(200 + (raw / total) * 600 + routeAdjustment);
  return Math.min(800, Math.max(200, scaled));
};

export const scoreAdaptiveTest = (
  questions: AdaptiveScoreQuestion[],
  presentedQuestionIds: string[],
  answers: Record<string, number | null>,
  routes: Partial<Record<AdaptiveScoreQuestion['section'], AdaptiveRoute>> = {},
): AdaptiveScoreResults => {
  const byId = new Map(questions.map(question => [question.id, question]));
  const presented = [...new Set(presentedQuestionIds)]
    .map(id => byId.get(id))
    .filter((question): question is AdaptiveScoreQuestion => Boolean(question));
  let rwCorrect = 0;
  let rwTotal = 0;
  let mathCorrect = 0;
  let mathTotal = 0;
  const domainBreakdown: Record<string, { correct: number; total: number }> = {};

  for (const question of presented) {
    const answer = answers[question.id];
    const correct = typeof answer === 'number' && question.correctAnswers.includes(answer);
    if (question.section === 'reading-writing') {
      rwTotal += 1;
      if (correct) rwCorrect += 1;
    } else {
      mathTotal += 1;
      if (correct) mathCorrect += 1;
    }
    domainBreakdown[question.domain] ??= { correct: 0, total: 0 };
    domainBreakdown[question.domain].total += 1;
    if (correct) domainBreakdown[question.domain].correct += 1;
  }

  const rwScaled = rwTotal > 0
    ? rawToScaled(rwCorrect, rwTotal, routes['reading-writing'])
    : 0;
  const mathScaled = mathTotal > 0
    ? rawToScaled(mathCorrect, mathTotal, routes.math)
    : 0;
  return {
    rwRaw: rwCorrect,
    rwScaled,
    mathRaw: mathCorrect,
    mathScaled,
    totalScaled: rwScaled + mathScaled,
    domainBreakdown,
  };
};
