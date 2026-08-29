export interface ScoreQuestion {
  id: string;
  section: 'reading-writing' | 'math';
}

export interface ScoreStat {
  attempts: number;
  lastResult: 'correct' | 'wrong' | null;
}

export const calculateSectionScoreStats = (
  questions: ScoreQuestion[],
  stats: Record<string, ScoreStat | undefined>,
) => {
  const result = {
    rw: { correct: 0, total: 0, attempted: 0 },
    math: { correct: 0, total: 0, attempted: 0 },
  };
  for (const question of questions) {
    const section = question.section === 'reading-writing' ? result.rw : result.math;
    section.total += 1;
    const stat = stats[question.id];
    if (stat && stat.attempts > 0) {
      section.attempted += 1;
      section.correct += stat.lastResult === 'correct' ? 1 : 0;
    }
  }
  return result;
};
