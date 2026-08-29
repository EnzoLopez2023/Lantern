export const canLeavePracticeQuestion = (
  submitted: boolean,
  confidence: string | null,
): boolean => !submitted || confidence !== null;

export const shouldRecordPracticeConfidence = (
  submitted: boolean,
  confidence: string | null,
  alreadyRecorded: boolean,
): boolean => submitted && confidence !== null && !alreadyRecorded;
