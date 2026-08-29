// Shared types for the Study Hub.

export type ExamLevel =
  | 'Standardized Test'      // SAT, SCPERMIT
  | 'High School Required'   // SC junior-year core classes — full deep-dive content floors
  | 'High School Elective';  // SC electives — same section structure, lighter quantity floors

// Top-level grouping on the hub landing page. Each category renders as its
// own section. New categories: extend this union, then add the heading to
// CATEGORY_ORDER in ExamPrepHub/index.tsx.
export type ExamCategory = 'High School' | 'Misc';

export interface ExamMeta {
  id: string;              // slug used in URLs / state, e.g. 'USHC'
  code: string;            // public exam code, e.g. 'USHC'
  vendor: string;          // 'SC Department of Education', 'College Board', etc.
  title: string;
  tagline: string;         // short blurb shown on the card
  status: 'active' | 'coming-soon';
  category?: ExamCategory; // hub grouping — defaults to 'Misc' if omitted
  level?: ExamLevel;       // surfaces as a chip on the hub card
  isEOCEP?: boolean;       // true → SC End-of-Course Examination Program tested. QC requires/permits the timed ExamSandbox file only when this is true.
  domains?: { label: string; weight: string }[]; // optional domain weight chips
  durationMin?: number;    // exam length
  passScore?: number;      // /1000 for scaled exams (rarely used now that IT certs are gone)
  questionCount?: number;  // number of practice questions available
}

// The shell component for each exam receives this — back-to-hub callback.
// Each exam folder exports a default React component that accepts this prop.
export interface ExamHubNav {
  onBackToHub: () => void;
}
