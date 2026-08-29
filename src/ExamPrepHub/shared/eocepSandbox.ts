export const availableQuestionDomains = <Question extends { domain: number }>(
  questions: Question[],
): number[] => [...new Set(questions.map(question => question.domain))].sort((a, b) => a - b);

export const filterQuestionsByDomain = <Question extends { domain: number }>(
  questions: Question[],
  domain: 'both' | number,
): Question[] => domain === 'both'
  ? questions
  : questions.filter(question => question.domain === domain);

export const scaleEocepScore = (correct: number, total: number): number => {
  if (total <= 0) return 0;
  const raw = Math.min(1, Math.max(0, correct / total));
  const scaled = raw <= 0.7
    ? 200 + (raw / 0.7) * 500
    : 700 + ((raw - 0.7) / 0.3) * 250;
  return Math.round(scaled);
};
