// SAT Question Bank — type definitions and barrel exports.

export type SATSection = 'reading-writing' | 'math';

export type SATDomain =
  | 'information-and-ideas'
  | 'craft-and-structure'
  | 'expression-of-ideas'
  | 'standard-english-conventions'
  | 'algebra'
  | 'advanced-math'
  | 'problem-solving-data'
  | 'geometry-trig';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SATQuestion {
  id: string;
  section: SATSection;
  domain: SATDomain;
  subdomain: string;
  difficulty: Difficulty;
  passage?: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  tip?: string;
}

// Domain metadata for display and scoring
export const DOMAIN_META: Record<SATDomain, { label: string; section: SATSection; weight: number }> = {
  'information-and-ideas':        { label: 'Information and Ideas',        section: 'reading-writing', weight: 0.26 },
  'craft-and-structure':          { label: 'Craft and Structure',          section: 'reading-writing', weight: 0.28 },
  'expression-of-ideas':          { label: 'Expression of Ideas',          section: 'reading-writing', weight: 0.20 },
  'standard-english-conventions': { label: 'Standard English Conventions', section: 'reading-writing', weight: 0.26 },
  'algebra':                      { label: 'Algebra',                      section: 'math',            weight: 0.35 },
  'advanced-math':                { label: 'Advanced Math',                section: 'math',            weight: 0.35 },
  'problem-solving-data':         { label: 'Problem Solving & Data Analysis', section: 'math',         weight: 0.15 },
  'geometry-trig':                { label: 'Geometry & Trigonometry',       section: 'math',           weight: 0.15 },
};

// Lazy-loaded question arrays (imported at runtime to avoid massive bundle)
import { rwInformationQuestions } from './rw-information';
import { rwCraftQuestions } from './rw-craft';
import { rwExpressionQuestions } from './rw-expression';
import { rwConventionsQuestions } from './rw-conventions';
import { mathAlgebraQuestions } from './math-algebra';
import { mathAdvancedQuestions } from './math-advanced';
import { mathProblemQuestions } from './math-problem';
import { mathGeometryQuestions } from './math-geometry';

export const allQuestions: SATQuestion[] = [
  ...rwInformationQuestions,
  ...rwCraftQuestions,
  ...rwExpressionQuestions,
  ...rwConventionsQuestions,
  ...mathAlgebraQuestions,
  ...mathAdvancedQuestions,
  ...mathProblemQuestions,
  ...mathGeometryQuestions,
];

export const rwQuestions: SATQuestion[] = [
  ...rwInformationQuestions,
  ...rwCraftQuestions,
  ...rwExpressionQuestions,
  ...rwConventionsQuestions,
];

export const mathQuestions: SATQuestion[] = [
  ...mathAlgebraQuestions,
  ...mathAdvancedQuestions,
  ...mathProblemQuestions,
  ...mathGeometryQuestions,
];

// Helper to get questions by domain
export function getByDomain(domain: SATDomain): SATQuestion[] {
  return allQuestions.filter(q => q.domain === domain);
}

// Helper to get questions by difficulty
export function getByDifficulty(difficulty: Difficulty): SATQuestion[] {
  return allQuestions.filter(q => q.difficulty === difficulty);
}

// Shuffle helper
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
