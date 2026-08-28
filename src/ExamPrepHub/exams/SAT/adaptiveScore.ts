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

const rawToScaled = (raw: number, total: number): number => {
  const scaled = Math.round(200 + (raw / total) * 600);
  return Math.min(800, Math.max(200, scaled));
};

export const scoreAdaptiveTest = (
  questions: AdaptiveScoreQuestion[],
  presentedQuestionIds: string[],
  answers: Record<string, number | null>,
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

  const rwScaled = rwTotal > 0 ? rawToScaled(rwCorrect, rwTotal) : 0;
  const mathScaled = mathTotal > 0 ? rawToScaled(mathCorrect, mathTotal) : 0;
  return {
    rwRaw: rwCorrect,
    rwScaled,
    mathRaw: mathCorrect,
    mathScaled,
    totalScaled: rwScaled + mathScaled,
    domainBreakdown,
  };
};
