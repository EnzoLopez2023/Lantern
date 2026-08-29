// ALG1 Study Guide — accordion-based layout for SC's Algebra 1 course (and
// EOCEP). Each section is collapsible; the first is open by default. Content
// uses shared MUI components — Callout (HS-only), Analogy, GuideTable,
// SectionQuiz — so no special CSS wrapper is needed.

import { useEffect, useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../../../app/storage/scopedStorage';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Print as PrintIcon,
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Replay as ResetIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import MermaidDiagram from '../../../KnowledgeBase/components/MermaidDiagram';
import {
  Analogy,
  GuideTable,
  SectionQuiz,
  type QuizQuestion,
} from '../../shared/components';
import { Callout } from '../../shared/Callout';
import { glossary } from './glossary';
import { questions } from './questions';

const READING_PROGRESS_KEY = 'exam-prep-reading:ALG1';
const COMPLETION_KEY = 'exam-prep-completed:ALG1';
// Section-quiz storage is separate from drillStats. Quizzes are quick recall
// checks and don't influence the readiness signal.
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:ALG1';

// Maps each non-exempt section to a question-bank subdomain. Sections in this
// map get a SectionQuiz at the end pulling 3–4 questions from that subdomain.
const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Number & Quantity',
  s3: 'Linear Equations & Inequalities',
  s4: 'Functions',
  s5: 'Systems of Equations',
  s6: 'Polynomials',
  s7: 'Quadratic Functions',
  s8: 'Exponential Functions',
  s9: 'Statistics & Data',
};

function getQuizQuestions(sectionId: string): QuizQuestion[] {
  const subdomain = SECTION_SUBDOMAINS[sectionId];
  if (!subdomain) return [];
  return questions
    .filter(q => q.subdomain === subdomain && (q.type === 'single' || q.type === 'multi' || q.type === 'yesno'))
    .slice(0, 4)
    .map(q => ({
      id: q.id,
      type: q.type as 'single' | 'multi' | 'yesno',
      question: q.question,
      options: q.options,
      correctAnswers: q.correctAnswers,
      explanation: q.explanation,
    }));
}

type SectionDef = { id: string; num: string; title: string; icon: string };

const SECTIONS: SectionDef[] = [
  { id: 's1',       num: '1',  title: 'The Big Picture',                icon: '🗺️' },
  { id: 's2',       num: '2',  title: 'Number & Quantity',              icon: '🔢' },
  { id: 's3',       num: '3',  title: 'Linear Equations & Inequalities',icon: '📈' },
  { id: 's4',       num: '4',  title: 'Functions',                      icon: '🔄' },
  { id: 's5',       num: '5',  title: 'Systems of Equations',           icon: '⚖️' },
  { id: 's6',       num: '6',  title: 'Polynomials',                    icon: '➕' },
  { id: 's7',       num: '7',  title: 'Quadratic Functions',            icon: '🪃' },
  { id: 's8',       num: '8',  title: 'Exponential Functions',          icon: '📊' },
  { id: 's9',       num: '9',  title: 'Statistics & Data',              icon: '📉' },
  { id: 's-strat',  num: '★',  title: 'EOCEP Exam-Day Strategy',        icon: '🎯' },
  { id: 's-gloss',  num: '📚', title: 'Glossary',                       icon: '📚' },
];

export default function StudyGuide() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT   = isDark ? '#C77AA0' : '#5C2A4A';
  const CARD_BG  = isDark ? '#2E2F38' : '#FBF5E6';
  const BORDER   = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';

  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(COMPLETION_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch { /* ignore */ }
    return new Set();
  });

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    let completedSet: Set<string> = new Set();
    try {
      const raw = localStorage.getItem(COMPLETION_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) completedSet = new Set(arr);
      }
    } catch { /* ignore */ }
    const firstIncomplete = SECTIONS.find(s => !completedSet.has(s.id));
    return new Set(firstIncomplete ? [firstIncomplete.id] : ['s1']);
  });
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETION_KEY, JSON.stringify([...completed]));
    } catch { /* ignore */ }
  }, [completed]);

  useEffect(() => {
    try {
      localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify([...openSections]));
    } catch { /* ignore */ }
  }, [openSections]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAll = () => setOpenSections(new Set(SECTIONS.map(s => s.id)));

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resetProgress = () => {
    if (!window.confirm('Reset your reading progress? This clears all "complete" checkmarks for this guide.')) return;
    setCompleted(new Set());
    setOpenSections(new Set(['s1']));
  };

  const pct = Math.round((completed.size / SECTIONS.length) * 100);

  const SectionExtras = ({ id }: { id: string }) => {
    const quiz = getQuizQuestions(id);
    if (quiz.length === 0) return null;
    return (
      <SectionQuiz
        sectionId={id}
        storageKey={QUIZ_STORAGE_KEY}
        questions={quiz}
      />
    );
  };

  return (
    <Box>
      {/* Progress strip */}
      <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 1.5, mb: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: TEXT_PRI, fontSize: '0.95rem' }}>
              Reading progress — {completed.size} of {SECTIONS.length} sections
            </Typography>
            <Typography sx={{ color: TEXT_SEC, fontSize: '0.8rem' }}>
              Mark each section complete as you finish it. Your "quick check" at the bottom of each section doesn't count toward the Diagnostic — practice freely.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button size="small" variant="outlined" onClick={openAll} sx={{ textTransform: 'none', borderColor: BORDER, color: TEXT_SEC }}>
              Expand all
            </Button>
            <Button size="small" variant="outlined" onClick={resetProgress} startIcon={<ResetIcon fontSize="small" />}
              sx={{ textTransform: 'none', borderColor: BORDER, color: TEXT_SEC }}>
              Reset
            </Button>
            <Button size="small" variant="outlined" onClick={() => window.print()} startIcon={<PrintIcon fontSize="small" />}
              sx={{ textTransform: 'none', borderColor: BORDER, color: TEXT_SEC }}>
              Print
            </Button>
          </Stack>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 8, borderRadius: 2,
            backgroundColor: alpha(ACCENT, 0.15),
            '& .MuiLinearProgress-bar': { backgroundColor: ACCENT },
          }}
        />
      </Paper>

      {/* Sections */}
      {SECTIONS.map(s => {
        const isOpen = openSections.has(s.id);
        const isComplete = completed.has(s.id);
        return (
          <Accordion
            key={s.id}
            ref={el => { sectionRefs.current[s.id] = el; }}
            expanded={isOpen}
            onChange={() => toggleSection(s.id)}
            disableGutters
            elevation={0}
            sx={{
              backgroundColor: CARD_BG,
              border: `1px solid ${isComplete ? alpha(ACCENT, 0.4) : BORDER}`,
              borderRadius: 1.5,
              mb: 1.5,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: ACCENT }} />}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', width: '100%' }}>
                <Box sx={{ fontSize: '1.5rem' }}>{s.icon}</Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Chip
                      size="small"
                      label={s.num}
                      sx={{ backgroundColor: alpha(ACCENT, 0.15), color: ACCENT, fontWeight: 800, height: 22, minWidth: 38 }}
                    />
                    <Typography sx={{ fontWeight: 700, color: TEXT_PRI, fontSize: '1.05rem' }}>{s.title}</Typography>
                    {isComplete && <CompleteIcon sx={{ color: ACCENT, fontSize: '1.1rem', ml: 'auto' }} />}
                    {!isComplete && <IncompleteIcon sx={{ color: TEXT_SEC, fontSize: '1.1rem', ml: 'auto', opacity: 0.5 }} />}
                  </Stack>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <SectionContent id={s.id} />
              <SectionExtras id={s.id} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isComplete}
                    onChange={() => toggleComplete(s.id)}
                    sx={{ color: TEXT_SEC, '&.Mui-checked': { color: ACCENT } }}
                  />
                }
                label={
                  <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem' }}>
                    {isComplete ? 'Section complete' : 'Mark this section as complete'}
                  </Typography>
                }
                sx={{ mt: 2 }}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

// ──────────────────────────────────────────────────────────────────────
// SectionContent — the actual study guide content per section.
// Real Algebra 1 content. Mixed Callout kinds. Analogies open conceptual
// sections. Mermaid diagrams where a decision tree or flow helps.
// ──────────────────────────────────────────────────────────────────────

function SectionContent({ id }: { id: string }) {
  switch (id) {
    case 's1':       return <Section1BigPicture />;
    case 's2':       return <Section2NumberQuantity />;
    case 's3':       return <Section3Linear />;
    case 's4':       return <Section4Functions />;
    case 's5':       return <Section5Systems />;
    case 's6':       return <Section6Polynomials />;
    case 's7':       return <Section7Quadratics />;
    case 's8':       return <Section8Exponentials />;
    case 's9':       return <Section9Statistics />;
    case 's-strat':  return <SectionStrategy />;
    case 's-gloss':  return <SectionGlossary />;
    default:         return null;
  }
}

// ── Section 1: Big Picture ────────────────────────────────────────────
function Section1BigPicture() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Algebra 1 is where math stops being only about numbers and starts being about <strong>relationships</strong>. We
        replace specific numbers with letters (variables) and study how quantities depend on each other — how the
        cost of a phone plan depends on minutes used, how the height of a thrown ball depends on time in the air, how
        a savings account balance depends on years of growth. The eight subdomains on this exam are eight different
        kinds of relationship: linear, quadratic, exponential, the statistical correlations of two variables, and the
        algebraic operations that let us manipulate them.
      </Typography>

      <Analogy title="Algebra as the language of patterns">
        Imagine you've spent your whole math education solving puzzles where every number was already given to you.
        Algebra is the moment math finally hands you a notation for what you DON'T know yet — a letter like x — and
        teaches you how to manipulate equations to find that unknown. Once you can do that, suddenly you can describe
        the cost of a phone plan, the path of a thrown ball, the growth of a savings account, and the trend of a
        scatter plot — all with a few lines of symbols. The same machinery works on each.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        How to use this guide
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Each subdomain section has the same shape: a short intro that connects the topic to something you already
        understand, key formulas and worked examples, callouts that flag traps and connections, and a "quick check"
        at the bottom — 3 or 4 questions pulled from the practice bank so you can verify the ideas landed. The quick
        check is formative; it doesn't move your Diagnostic readiness number. Take it freely.
      </Typography>

      <Callout kind="why-it-matters">
        The Algebra 1 EOCEP counts <strong>20% of your final course grade</strong> in South Carolina. That's not
        decorative — a student with a 90 average and a 50 EOCEP ends up with about an 82 final. Treating this exam
        as low-stakes is the most expensive mistake you can make. The good news: it's a well-defined test on a finite
        list of skills, and steady study from now to test day is enough.
      </Callout>

      <Callout kind="coachs-note">
        Don't try to memorize every formula in the textbook — that's not how the EOCEP scores. It rewards
        understanding which type of problem you're looking at (linear? quadratic? exponential?), having the right
        formulas at your fingertips, and being able to <em>interpret</em> answers in context (what does the slope
        MEAN for the phone-plan word problem?). Practice that kind of thinking, not formula recall.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The eight topics at a glance
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Algebra 1] --> B[Number & Quantity - rules of arithmetic, exponents, real numbers]
    A --> C[Linear Equations - lines, slopes, intercepts]
    A --> D[Functions - inputs and outputs, notation, domain/range]
    A --> E[Systems - two equations, two unknowns]
    A --> F[Polynomials - operations and factoring]
    A --> G[Quadratics - parabolas and the quadratic formula]
    A --> H[Exponentials - growth and decay]
    A --> I[Statistics - mean median scatter plots correlation]
        `}
      />

      <Callout kind="in-plain-words">
        Most of Algebra 1 boils down to four jobs: <strong>solving for an unknown</strong> (linear, quadratic,
        exponential equations), <strong>graphing relationships</strong> (lines, parabolas, exponential curves),
        <strong> classifying patterns</strong> (is this linear or exponential? function or not?), and
        <strong> interpreting answers in context</strong> (what does this slope MEAN in real life?). Get good at all
        four and you've got the EOCEP covered.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three habits that pay off for the whole year
      </Typography>
      <GuideTable
        headers={['Habit', 'Why it matters', 'How to build it']}
        rows={[
          ['Always check your answer by substituting back', 'Catches arithmetic and sign errors before they cost you points', 'Make it automatic — every solve ends with "plug it back in"'],
          ['Show every step on scratch paper, even on easy problems', 'Letting yourself skip steps causes silly errors that compound', 'Discipline yourself even when you "see" the answer'],
          ['Translate word problems into equations BEFORE trying to solve', 'Skipping translation leads to guessing instead of solving', 'Underline the unknowns, then write one equation per fact'],
        ]}
      />

      <Callout kind="try-this">
        For each new topic in this guide, ask yourself: "What scenario in real life looks like this?" Linear → cost
        per item. Quadratic → height of a thrown object. Exponential → bank account interest. Once a topic has a
        concrete real-world anchor, you'll remember the math longer and recognize it faster on the test.
      </Callout>
    </Box>
  );
}

// ── Section 2: Number & Quantity ─────────────────────────────────────
function Section2NumberQuantity() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Before you can solve equations, you need to be solid on the number system itself: what counts as a "real
        number," how exponents behave, what absolute value means, and how to handle units and scientific notation.
        These rules aren't optional — they show up inside every other topic. A small slip on a sign or an exponent
        rule cascades into a wrong final answer on the rest of the test.
      </Typography>

      <Analogy title="Numbers as a nested set of buckets">
        Think of the real numbers as a series of nested buckets. The smallest bucket is the <strong>natural numbers</strong>
        (1, 2, 3, …). Add zero and you get the <strong>whole numbers</strong>. Add negatives and you get the
        <strong> integers</strong> (…, −2, −1, 0, 1, 2, …). Add fractions and you get the <strong>rational numbers</strong>.
        Finally, add things like π and √2 that don't fit as fractions, and you've got all the <strong>real numbers</strong>.
        Every bigger bucket contains the smaller ones — every integer is rational, every rational is real.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Rational vs. irrational
      </Typography>
      <GuideTable
        headers={['Type', 'Definition', 'Examples', 'Counter-examples']}
        rows={[
          ['Rational', 'Can be written as a fraction p/q of integers (with q ≠ 0). Decimals terminate OR repeat.', '3 (= 3/1), −2/5, 0.25 (= 1/4), 0.333… (= 1/3), √9 (= 3)', 'π, √2, e — non-terminating, non-repeating decimals'],
          ['Irrational', 'Cannot be written as a fraction of integers. Decimal expansion never terminates and never repeats.', 'π ≈ 3.14159…, √2 ≈ 1.41421…, √7, e ≈ 2.71828…', '0.5, −7, √16, 0.7777…'],
        ]}
      />

      <Callout kind="watch-for">
        A common trap: students see a square root and assume it's automatically irrational. That's wrong — only
        square roots of <strong>non-perfect-square integers</strong> are irrational. √9 = 3 is rational. √16 = 4 is
        rational. But √7, √11, √2 — all irrational. Quick test: try to evaluate the root in your head. If you get a
        clean integer, it's rational.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Exponent rules — memorize these cold
      </Typography>
      <GuideTable
        headers={['Rule', 'Formula', 'Example']}
        rows={[
          ['Product of powers', 'xᵃ · xᵇ = xᵃ⁺ᵇ', 'x³ · x⁴ = x⁷'],
          ['Quotient of powers', 'xᵃ / xᵇ = xᵃ⁻ᵇ', 'x⁵ / x² = x³'],
          ['Power of a power', '(xᵃ)ᵇ = xᵃᵇ', '(x²)³ = x⁶'],
          ['Power of a product', '(xy)ᵃ = xᵃ · yᵃ', '(2x)³ = 8x³'],
          ['Zero exponent', 'x⁰ = 1 (for x ≠ 0)', '17⁰ = 1, (−5)⁰ = 1'],
          ['Negative exponent', 'x⁻ⁿ = 1/xⁿ', 'x⁻³ = 1/x³, 2⁻² = 1/4'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>MULTIPLY adds, POWER multiplies.</strong> The biggest exponent confusion is mixing up the
        product rule (x³ · x⁴ = x⁷ — ADD the exponents) with the power-of-a-power rule ((x³)⁴ = x¹² —
        MULTIPLY the exponents). The trick: when you SEE multiplication (·), ADD; when you SEE a power on
        a power (parentheses with an outer exponent), MULTIPLY.
      </Callout>

      <Analogy title="Negative exponents as upstairs/downstairs">
        Think of a fraction as a building with two floors: the numerator (upstairs) and the denominator (downstairs).
        A negative exponent moves the term to the OPPOSITE floor. x⁻² means x² lives downstairs: 1/x². And 1/x⁻³ means
        x³ lives upstairs: x³. The exponent flips sign when it changes floors. Useful trick when you want to clean
        up an expression so everything has positive exponents.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Absolute value
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Absolute value, written |x|, is the <strong>distance from zero</strong> on the number line. Distance is
        always non-negative, so |x| ≥ 0 for every real x. The bars strip off any negative sign: |−7| = 7 and |7| = 7.
        On the EOCEP, watch for the order of operations — apply absolute value <strong>after</strong> evaluating what's
        inside, not before.
      </Typography>

      <Callout kind="try-this">
        Compute |−3| − |−5| and |−3 − 5|. Are they equal? Solution: |−3| − |−5| = 3 − 5 = −2, but |−3 − 5| = |−8| = 8.
        Different answers — absolute value does NOT distribute over subtraction. The bars apply to one quantity at a
        time. Notice how the second expression first does the subtraction inside the bars, then takes the absolute
        value of the result.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Scientific notation
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Scientific notation writes any number as <strong>a × 10ⁿ</strong>, where 1 ≤ |a| &lt; 10 and n is an integer.
        A positive n means "big number" — move the decimal n places to the right. A negative n means "small number" —
        move the decimal |n| places to the left. Examples: 47,000 = 4.7 × 10⁴ and 0.000047 = 4.7 × 10⁻⁵.
      </Typography>

      <GuideTable
        headers={['Number', 'Scientific notation', 'How to read it']}
        rows={[
          ['6,400,000,000', '6.4 × 10⁹', 'Move decimal 9 places left'],
          ['0.0000023', '2.3 × 10⁻⁶', 'Move decimal 6 places right (negative exponent)'],
          ['384,400 (distance to the moon in km)', '3.844 × 10⁵', 'Move decimal 5 places left'],
          ['9.11 × 10⁻³¹ (electron mass in kg)', 'Already in scientific notation', 'Standard decimal form is essentially unreadable'],
        ]}
      />

      <Callout kind="connect">
        Scientific notation is closely linked to the exponent rules above. When you MULTIPLY two numbers in scientific
        form, you multiply the leading parts AND ADD the exponents: (2 × 10³) · (3 × 10⁵) = 6 × 10⁸. When you DIVIDE,
        you divide the leading parts AND SUBTRACT the exponents. Same rules you just memorized — applied to base 10.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Units and dimensional analysis
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Converting between units (miles to feet, hours to seconds, etc.) is a matter of multiplying by a fraction
        equal to 1 — the conversion factor. The key is to write it so the units you DON'T want cancel out. Example:
        convert 3 miles to feet. 3 mi · (5280 ft / 1 mi) = 15,840 ft. The "mi" units cancel because one is in the
        numerator and the other in the denominator.
      </Typography>

      <Callout kind="watch-for">
        Always sanity-check your unit answer. Converting a SMALLER unit to a LARGER one (feet → miles) should give a
        smaller number. Converting LARGER → SMALLER (miles → feet) should give a bigger number. If your answer is
        going the wrong direction, you probably flipped the conversion fraction. The units that need to cancel
        always go in OPPOSITE positions (top vs. bottom).
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Properties of operations — names worth knowing
      </Typography>
      <GuideTable
        headers={['Property', 'Statement', 'Why it\'s useful']}
        rows={[
          ['Commutative (+ and ×)', 'a + b = b + a, a · b = b · a', 'Reorder terms freely; doesn\'t apply to subtraction or division'],
          ['Associative (+ and ×)', '(a + b) + c = a + (b + c)', 'Regroup parentheses without changing the value'],
          ['Distributive', 'a(b + c) = ab + ac', 'The bridge between addition and multiplication — essential for expanding and factoring'],
          ['Identity (+)', 'a + 0 = a', '0 is the additive identity'],
          ['Identity (×)', 'a · 1 = a', '1 is the multiplicative identity'],
          ['Inverse (+)', 'a + (−a) = 0', 'Every real number has an additive inverse (its negative)'],
          ['Inverse (×)', 'a · (1/a) = 1, for a ≠ 0', 'Every nonzero real number has a multiplicative inverse (its reciprocal)'],
        ]}
      />

      <Callout kind="in-plain-words">
        These property names look formal but the IDEAS are intuitive: order doesn\'t matter for adding or multiplying;
        regrouping doesn\'t change the answer; multiplication distributes over addition. The EOCEP sometimes asks
        you to NAME a property used in a step — so memorize the labels alongside the ideas.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Simplifying radicals
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Square roots like √72 should always be simplified. The trick: find the LARGEST perfect-square factor of the
        radicand, then pull it out of the radical. √72 = √(36 · 2) = √36 · √2 = 6√2. Common perfect squares:
        4, 9, 16, 25, 36, 49, 64, 81, 100. Practice recognizing them inside larger numbers.
      </Typography>
      <GuideTable
        headers={['Radical', 'Factor with a perfect square', 'Simplified']}
        rows={[
          ['√48', '√(16 · 3)', '4√3'],
          ['√50', '√(25 · 2)', '5√2'],
          ['√75', '√(25 · 3)', '5√3'],
          ['√128', '√(64 · 2)', '8√2'],
          ['√200', '√(100 · 2)', '10√2'],
        ]}
      />

      <Callout kind="make-it-stick">
        To simplify √n: find the largest k² (perfect square) that divides n. Then √n = k · √(n/k²). The remaining
        radical √(n/k²) should have no perfect-square factor left. If you don\'t find the biggest perfect square
        on your first try, you can keep peeling: √72 = √(4 · 18) = 2√18 = 2 · √(9 · 2) = 2 · 3 · √2 = 6√2. Same
        answer, two passes. Faster to spot 36 right away, but either works.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Adding and subtracting radicals
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        You can ADD or SUBTRACT only LIKE radicals (same number under the root). Example: 3√5 + 7√5 = 10√5 (treat
        √5 as a "variable" you\'re combining). But 3√5 + 7√2 doesn\'t simplify — different radicals. Sometimes you
        can simplify FIRST and then combine: √8 + √18 = 2√2 + 3√2 = 5√2.
      </Typography>

      <Callout kind="why-it-matters">
        Radical-simplification problems often hide in quadratic-formula answers. When you compute the discriminant
        and get √80, the answer choices usually show 4√5 — your simplified form. If you leave √80 unsimplified,
        none of the choices match and you\'ll waste time second-guessing. Build the habit: always simplify radicals
        to their reduced form before comparing to answer choices.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Common errors with negative numbers and exponents
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Pay careful attention to the difference between (−3)² and −3². The first is (−3) · (−3) = 9 — the negative is
        being squared along with the 3. The second is the negation of 3² — that\'s −9. Same digits, different parses.
        On any problem involving substituting a negative value into a function, always wrap it in parentheses
        BEFORE applying the exponent.
      </Typography>

      <Callout kind="watch-for">
        On a graphing calculator, typing −3^2 gives −9 (the calculator squares 3 first because exponents bind
        tighter than the unary minus, then negates). To get +9, you must type (−3)^2. Same logic on paper:
        parentheses force the negative to be part of the base before the exponent applies. This single source of
        sign errors costs more points across all of Algebra 1 than any other procedural mistake.
      </Callout>
    </Box>
  );
}

// ── Section 3: Linear Equations & Inequalities ───────────────────────
function Section3Linear() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Linear equations describe relationships with a <strong>constant rate of change</strong> — every step in x
        produces the same step in y. Their graph is always a straight line. They're the simplest non-trivial functions,
        and they show up everywhere: cost models (flat fee + per-unit cost), distance-time problems at constant speed,
        depreciation problems with a constant dollar drop per year. Master linear equations and you've got the
        foundation for everything else.
      </Typography>

      <Analogy title="A line as a recipe with two ingredients">
        Every line you'll meet in Algebra 1 has just two ingredients: a <strong>slope</strong> (how fast y changes as
        x changes) and a <strong>y-intercept</strong> (where the line starts when x = 0). That's it. Once you know
        those two numbers, you can write the equation, draw the graph, predict any point on it, and solve any
        related word problem. The whole topic is about finding those two ingredients in different ways.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three forms of a linear equation
      </Typography>
      <GuideTable
        headers={['Form', 'Looks like', 'When to use it']}
        rows={[
          ['Slope-intercept form', 'y = mx + b', 'You know the slope m and the y-intercept b. Best for graphing.'],
          ['Point-slope form', 'y − y₁ = m(x − x₁)', 'You know the slope m and any point (x₁, y₁) on the line. Best for building an equation from given info.'],
          ['Standard form', 'Ax + By = C', 'You want to find intercepts quickly. Set y = 0 to find the x-intercept; set x = 0 to find the y-intercept.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Slope: rise over run
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The slope <strong>m</strong> between two points (x₁, y₁) and (x₂, y₂) is:
      </Typography>
      <Typography sx={{ mb: 1.5, fontFamily: 'ui-monospace, monospace', fontSize: '1.05rem', textAlign: 'center', color: 'text.primary' }}>
        m = (y₂ − y₁) / (x₂ − x₁)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Think of it as <strong>rise over run</strong>: the change in y divided by the change in x. A positive slope
        means the line goes UP from left to right; negative means it goes DOWN. A slope of 0 is a horizontal line.
        A vertical line has an UNDEFINED slope (division by zero in the run).
      </Typography>

      <Callout kind="watch-for">
        Don't confuse "slope is zero" (a horizontal line) with "slope is undefined" (a vertical line). A common
        EOCEP trap: a graph shows a vertical line and asks for the slope. The answer is NOT 0 — it's undefined,
        because the "run" is 0 and you can't divide by zero.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example: building a line from two points
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Find the equation of the line through (2, 5) and (4, 11) in slope-intercept form.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        <strong>Step 1: find the slope.</strong> m = (11 − 5) / (4 − 2) = 6/2 = 3.<br />
        <strong>Step 2: use point-slope form</strong> with one of the points, say (2, 5). y − 5 = 3(x − 2).<br />
        <strong>Step 3: distribute and simplify</strong> to get slope-intercept form. y − 5 = 3x − 6, so y = 3x − 1.<br />
        <strong>Check</strong> with the OTHER point: y = 3(4) − 1 = 11 ✓.
      </Typography>

      <Callout kind="make-it-stick">
        <strong>Slope → point → equation:</strong> once you've got the slope, plug it and any known point into
        point-slope form (y − y₁ = m(x − x₁)). Distribute and rearrange to slope-intercept (y = mx + b). The trick is
        that the y₁ on the LEFT and the m·x₁ from the right combine into the y-intercept b. Don't memorize a separate
        "two-point formula" — derive it each time from point-slope.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Parallel and perpendicular lines
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Two lines with slopes m1 and m2] --> B{m1 equals m2?}
    B -->|Yes, same intercept| C[Same line - infinitely many shared points]
    B -->|Yes, different intercept| D[Parallel - no shared points]
    B -->|No| E{m1 times m2 equals -1?}
    E -->|Yes| F[Perpendicular - meet at 90 degrees]
    E -->|No| G[Just two non-parallel lines - meet at one point]
        `}
      />

      <Callout kind="in-plain-words">
        Parallel = same slope, different intercept. Perpendicular = slopes are <strong>negative reciprocals</strong>
        (flip the fraction AND change the sign). Example: slope 2/3 → perpendicular slope is −3/2. Check by multiplying:
        (2/3) · (−3/2) = −1. The product of perpendicular slopes is always −1 (for non-vertical, non-horizontal lines).
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Solving linear equations
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The core skill: isolate the variable by performing inverse operations. Every operation you do to one side, do
        to the other. Example — solve 3(x − 2) + 7 = 16:
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        1. <strong>Distribute</strong>: 3x − 6 + 7 = 16<br />
        2. <strong>Combine like terms</strong> on the left: 3x + 1 = 16<br />
        3. <strong>Subtract 1</strong> from both sides: 3x = 15<br />
        4. <strong>Divide by 3</strong>: x = 5<br />
        5. <strong>Check</strong>: 3(5 − 2) + 7 = 3·3 + 7 = 16 ✓
      </Typography>

      <Callout kind="coachs-note">
        Three special outcomes when solving linear equations: an ordinary unique solution (like x = 5 above), no
        solution (you end up with a false statement like 0 = 7 — the equation has no x that works), or infinitely
        many solutions (you end up with a true identity like 0 = 0 — every x works). Recognize these endings so
        you don't waste time hunting for an answer that doesn't exist.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Inequalities — one critical rule
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Solve inequalities almost exactly the same way as equations — but with one absolute rule:
        <strong> when you multiply or divide BOTH sides by a NEGATIVE number, FLIP the inequality sign.</strong>
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Example: solve −2x + 5 &gt; 1.<br />
        Subtract 5: −2x &gt; −4. (No flip — subtraction is safe.)<br />
        Divide by −2: x &lt; 2. (FLIP because we divided by a negative.)
      </Typography>

      <Callout kind="watch-for">
        The flip rule is the #1 source of inequality errors on the EOCEP. Train yourself: any time you see "divide by
        a negative" or "multiply by a negative," mentally write "FLIP." If you don't flip, your final answer is wrong
        even if every other step is right.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Word problems and linear models
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Whenever you see a "fixed fee plus per-unit cost" scenario, suspect a linear model: y = mx + b, where b is
        the fixed fee and m is the per-unit rate. Phone plans, taxi fares, gym memberships, depreciation problems —
        all fit this mold.
      </Typography>

      <Analogy title="A linear model as a flat fee plus a meter">
        A taxi has a starting fare ($3 just to get in, regardless of distance) and a per-mile rate ($2/mile). The
        total cost y for x miles is y = 2x + 3. The $3 is the y-intercept — what you pay at zero miles. The $2 is the
        slope — what each additional mile adds. Once you spot this structure in a word problem, the equation
        practically writes itself.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Standard form and finding intercepts quickly
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Standard form Ax + By = C is handy when you want both intercepts FAST. To find the x-intercept, set y = 0 and
        solve for x. To find the y-intercept, set x = 0 and solve for y. You can graph any line in two motions if you
        know its intercepts.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Example: graph 3x + 2y = 12.<br />
        x-intercept (y = 0): 3x = 12 → x = 4. Plot (4, 0).<br />
        y-intercept (x = 0): 2y = 12 → y = 6. Plot (0, 6).<br />
        Draw the line through these two points.
      </Typography>

      <Callout kind="in-plain-words">
        Three forms, three jobs: <strong>slope-intercept</strong> for graphing, <strong>point-slope</strong> for
        building an equation, <strong>standard form</strong> for intercepts. You can convert from any form to any
        other with algebra — no equation is "stuck" in one form. Pick the form that makes YOUR current task
        easiest, then convert later if needed.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Interpreting slope in context
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A slope is more than a number — it carries UNITS. If y is dollars and x is hours, then slope has units of
        dollars per hour. Interpreting slope and y-intercept in real-world context is a major EOCEP skill.
      </Typography>
      <GuideTable
        headers={['Scenario', 'Equation', 'Slope means', 'y-intercept means']}
        rows={[
          ['Cell phone bill', 'B(m) = 0.10m + 40', '$0.10 per minute', '$40 base monthly fee'],
          ['Car depreciation', 'V(t) = 25000 − 2000t', 'Loses $2,000 per year', 'Original purchase price $25,000'],
          ['Plant growth', 'H(d) = 0.5d + 3', 'Grows 0.5 in/day', 'Initial height 3 inches'],
          ['Savings account (linear interest)', 'A(t) = 50t + 1000', 'Adds $50/month', 'Starting balance $1,000'],
        ]}
      />

      <Callout kind="why-it-matters">
        The EOCEP loves "what does the slope MEAN in context?" questions. The wrong answer choices are usually
        plausible-sounding but unit-confused — e.g., describing the y-intercept as a slope, or stating slope without
        proper units. Always attach UNITS to your interpretation: "$2 per mile," "5 dollars per hour," "0.5 inches
        per day."
      </Callout>
    </Box>
  );
}

// ── Section 4: Functions ────────────────────────────────────────────
function Section4Functions() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A function is the most important idea in Algebra 1 and every math class after it. A function is a RULE that
        takes an input and produces ONE output. Not several outputs — exactly one. That's the whole definition. If
        the input is x, the output is some single value that we usually call y or f(x). Functions describe how one
        quantity depends on another, and the rest of Algebra 1 is mostly about studying particular families of
        functions: linear, quadratic, exponential.
      </Typography>

      <Analogy title="A function as a vending machine">
        Picture a vending machine. Press button A and you always get snack A — never sometimes A and sometimes B.
        Press button B and you always get snack B. The button is the INPUT, the snack is the OUTPUT. This machine is
        a function: each input gives exactly one output. A broken machine that gives you a random snack from a list
        when you press A? Not a function — one input mapped to multiple possible outputs.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Function notation
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Instead of writing y = 2x + 3, mathematicians often write f(x) = 2x + 3. Read this as "f of x equals 2x plus
        3." It emphasizes that the output depends on the input. To evaluate the function at a specific input,
        substitute the input wherever you see x: f(4) means "the output when x = 4," which is 2(4) + 3 = 11.
      </Typography>

      <GuideTable
        headers={['Notation', 'Meaning', 'How to read it']}
        rows={[
          ['f(3) = 7', 'When x = 3, the output is 7', '"f of three equals seven"'],
          ['f(x) = x² − 1', 'The function rule', '"f of x equals x squared minus one"'],
          ['f(a) = 5', 'When x = a (some unknown), the output is 5', '"f of a equals five"'],
          ['g(f(2))', 'A composition — first apply f, then apply g', '"g of f of two"'],
        ]}
      />

      <Callout kind="why-it-matters">
        Function notation is the universal language of high school and college math. Calculators, equation editors,
        and every later math class assume you can read it. The EOCEP often hides a simple "plug in the number" task
        inside function notation — students who freeze at f(3) lose points they didn't need to lose. Practice reading
        and substituting until it feels automatic.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Identifying functions
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Given a relation between x and y] --> B{Does each x have exactly one y?}
    B -->|Yes| C[It IS a function]
    B -->|No - some x maps to two or more y values| D[It is NOT a function]
    A --> E{Graph: does a vertical line ever cross the graph more than once?}
    E -->|No| C
    E -->|Yes| D
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The vertical line test
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        On a graph, a relation is a function if and only if <strong>no vertical line crosses the graph more than once</strong>.
        A vertical line represents a fixed x-value; if it crosses the curve twice, that x maps to two y-values — not
        allowed in a function. The vertical line test gives a quick visual check.
      </Typography>

      <GuideTable
        headers={['Graph', 'Function?', 'Why']}
        rows={[
          ['y = 2x + 1 (a line)', 'Yes', 'Every vertical line crosses a non-vertical line exactly once.'],
          ['y = x² (a parabola)', 'Yes', 'Vertical lines hit a U-shape once.'],
          ['x² + y² = 25 (a circle)', 'No', 'Almost every vertical line through the interior hits the circle TWICE — top and bottom.'],
          ['y = √x (right half of a sideways parabola)', 'Yes', 'Only the positive square root — one y per x.'],
        ]}
      />

      <Callout kind="watch-for">
        Two different inputs CAN share the same output and the relation is still a function. f(x) = x² is a function
        even though f(2) = 4 AND f(−2) = 4. The rule is only that one input can\'t give multiple outputs — not the
        other way around. Vending machines can dispense the same snack from two different buttons.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Domain and range
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The <strong>domain</strong> is the set of all valid inputs (x-values). The <strong>range</strong> is the set
        of all possible outputs (y-values). For most polynomial functions, the domain is "all real numbers" — you
        can plug in any x. For functions with square roots, denominators, or other restrictions, the domain shrinks.
      </Typography>

      <GuideTable
        headers={['Function', 'Domain', 'Range']}
        rows={[
          ['f(x) = 2x + 3', 'All real numbers', 'All real numbers'],
          ['f(x) = x²', 'All real numbers', 'y ≥ 0 (squares are never negative)'],
          ['f(x) = √x', 'x ≥ 0 (can\'t take square root of negative in reals)', 'y ≥ 0'],
          ['f(x) = 1/x', 'x ≠ 0 (can\'t divide by zero)', 'y ≠ 0'],
          ['f(x) = √(x − 5)', 'x ≥ 5 (need x − 5 ≥ 0)', 'y ≥ 0'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>"Domain checks the input; range checks the output."</strong> When asked for a domain, look at what
        could BREAK the function: division by zero, square root of a negative, log of a non-positive. Exclude those
        x-values. When asked for a range, think about what y-values the function can actually produce.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Recognizing function families from a table
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Given a table of inputs and outputs, you can often tell whether the function is linear, quadratic, or
        exponential by examining the pattern:
      </Typography>
      <GuideTable
        headers={['Pattern in outputs', 'Function family', 'Example']}
        rows={[
          ['Constant first difference (same amount added each step)', 'Linear: y = mx + b', '5, 8, 11, 14, 17 — adds 3 each time'],
          ['Constant SECOND difference', 'Quadratic: y = ax² + …', '1, 4, 9, 16, 25 — first diffs 3,5,7,9; second diffs all 2'],
          ['Constant RATIO (same factor each step)', 'Exponential: y = a · bˣ', '3, 6, 12, 24, 48 — multiplies by 2 each time'],
        ]}
      />

      <Analogy title="The table test as a fingerprint">
        Different function families leave different fingerprints in their input-output tables. Linear adds a constant.
        Quadratic adds an INCREASING amount (because the rate of increase itself grows linearly). Exponential
        MULTIPLIES by a constant. Once you learn to read these fingerprints, you can identify a function family in
        about 5 seconds without graphing or solving.
      </Analogy>

      <Callout kind="connect">
        Function notation, the vertical line test, domain/range — these aren't just abstract Algebra 1 vocabulary.
        They\'re the language calculus uses to talk about everything: derivatives are about RATES of CHANGE of
        functions, integrals are about AREA under functions, and the way you express any of that depends on being
        fluent in f(x) notation. Get solid here and you save weeks of confusion later.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Function composition (a brief preview)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Sometimes you apply one function to the output of another. This is called <strong>composition</strong>:
        f(g(x)) means "first apply g, then apply f to the result." Always work from the INNERMOST parentheses
        outward. Example: if f(x) = x + 2 and g(x) = 3x, then f(g(4)) = f(3·4) = f(12) = 14. NOT the same as g(f(4))
        = g(4 + 2) = g(6) = 18. Order matters.
      </Typography>

      <Callout kind="watch-for">
        f(g(x)) ≠ g(f(x)) in general. Composition reads RIGHT-TO-LEFT: f(g(x)) means g acts first. The most
        common error is reversing the order. When in doubt, replace the inner function with a variable, evaluate
        that, then plug into the outer function.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — evaluating a function from a word problem
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A printing company charges $0.05 per page plus a $4 setup fee. If C(p) represents the cost for p pages,
        write the function and find C(120) — the cost of printing 120 pages.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        C(p) = 0.05p + 4 (linear function: slope $0.05/page, y-intercept $4).<br />
        C(120) = 0.05(120) + 4 = 6 + 4 = $10.<br />
        Printing 120 pages costs $10. Interpretation: $6 in per-page charges plus $4 setup.
      </Typography>

      <Callout kind="try-this">
        Practice the reverse direction too: given that C(p) = 0.05p + 4 and C(p) = 14.50, find p. Set the equation:
        0.05p + 4 = 14.50. Subtract 4: 0.05p = 10.50. Divide: p = 210 pages. The function went from p (input) to
        cost (output); the reverse question asks "what input produces this output?"
      </Callout>
    </Box>
  );
}

// ── Section 5: Systems of Equations ─────────────────────────────────
function Section5Systems() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>system of equations</strong> is two or more equations being considered together. A solution to the
        system is a point (x, y) that makes EVERY equation true at once. Geometrically: the solution is where the
        graphs of the two equations intersect. Three things can happen: the lines cross at one point (one solution),
        they\'re parallel and never cross (no solution), or they\'re the same line (infinitely many solutions).
      </Typography>

      <Analogy title="A system as a Venn diagram of solutions">
        Each equation, on its own, has a whole set of (x, y) pairs that make it true — for a line, that\'s every
        point ON the line. A system asks: which (x, y) pairs are in BOTH sets at the same time? That\'s the
        intersection of the two sets. For two non-parallel lines, the intersection is exactly one point. For two
        parallel lines, the intersection is empty. For two coincident lines, the intersection is the whole line.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three solving methods
      </Typography>
      <GuideTable
        headers={['Method', 'How it works', 'When it\'s easiest']}
        rows={[
          ['Graphing', 'Graph both equations; the intersection point is the solution.', 'When equations are already in y = mx + b form and you have graph paper.'],
          ['Substitution', 'Solve one equation for a variable, then substitute that expression into the other.', 'When at least one equation is already solved for x or y (or easy to solve).'],
          ['Elimination', 'Add or subtract the equations (after maybe multiplying) to cancel one variable.', 'When variables in the two equations have matching or opposite coefficients.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Decision tree — which method to use
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Given a system of two linear equations] --> B{Is one equation already solved for y or x?}
    B -->|Yes| C[Use substitution - plug it into the other equation]
    B -->|No| D{Do the variables have matching or opposite coefficients?}
    D -->|Yes| E[Use elimination - add or subtract directly]
    D -->|No| F{Are you given graph paper or asked to solve graphically?}
    F -->|Yes| G[Use graphing - graph both lines and read the intersection]
    F -->|No| H[Use elimination - multiply one or both equations first to align coefficients]
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — substitution
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Solve: y = 2x − 1 and 3x + y = 14.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        The first equation is already solved for y. Substitute (2x − 1) for y in the second equation:<br />
        3x + (2x − 1) = 14<br />
        5x − 1 = 14<br />
        5x = 15<br />
        x = 3<br />
        Then y = 2(3) − 1 = 5. Solution: (3, 5).<br />
        Check in both: y = 2(3) − 1 = 5 ✓ and 3(3) + 5 = 14 ✓.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — elimination
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Solve: 2x + y = 10 and x − y = 2.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Notice the y terms have OPPOSITE signs. Add the two equations directly to cancel y:<br />
        (2x + y) + (x − y) = 10 + 2<br />
        3x = 12<br />
        x = 4<br />
        Plug back into either equation: 4 − y = 2, so y = 2. Solution: (4, 2).<br />
        Check: 2(4) + 2 = 10 ✓ and 4 − 2 = 2 ✓.
      </Typography>

      <Callout kind="make-it-stick">
        <strong>Substitution = "isolate then plug." Elimination = "add to cancel."</strong> If one equation already
        has a variable alone on one side, substitution is faster. If the coefficients of one variable in the two
        equations are already opposite or equal, elimination is faster. Otherwise, multiply one equation by a
        constant first to make elimination work.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Special cases — no solution and infinite solutions
      </Typography>
      <GuideTable
        headers={['What you see when solving', 'What it means', 'Geometric picture']}
        rows={[
          ['A unique numerical answer like x = 3, y = 5', 'One solution', 'The two lines cross at one point.'],
          ['A FALSE statement like 0 = 7', 'No solution', 'The two lines are PARALLEL (same slope, different intercepts).'],
          ['A TRUE identity like 0 = 0 or 5 = 5', 'Infinitely many solutions', 'The two equations represent the SAME LINE — every point on it is a solution.'],
        ]}
      />

      <Callout kind="watch-for">
        Don\'t panic when algebra suddenly gives you 0 = 0 or 0 = 7. Those aren\'t mistakes — they\'re the system
        TELLING you what kind of solution set it has. Memorize: false statement → no solution; true identity →
        infinite solutions. EOCEP questions often deliberately set up systems like these to test whether you
        recognize them.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Word problems involving systems
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Many word problems give you TWO pieces of information about TWO unknowns. That\'s exactly the setup for a
        system. Common formats: tickets at two prices summing to a known total; mixtures with two ingredients;
        coin counts adding up to known total value; ages of people whose ages relate in two given ways.
      </Typography>

      <Analogy title="Word problems as story-equation translation">
        A word problem is a sentence in English; the system is the same sentence in algebra. Translation pattern:
        give each unknown a letter. Write one equation for each fact in the problem. Solve. Interpret the answer
        BACK in English. The hardest part is usually the translation — the algebra itself is straightforward once
        the equations are written.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — ticket sales
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Adults pay $8 and students pay $5 for a play. If 200 tickets were sold for $1,300 total, how many adult
        tickets were sold?
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Let a = adult tickets, s = student tickets.<br />
        Total count: a + s = 200<br />
        Total revenue: 8a + 5s = 1300<br />
        Multiply the first by 5: 5a + 5s = 1000<br />
        Subtract from the second: 3a = 300<br />
        a = 100<br />
        And s = 200 − 100 = 100. So 100 adult tickets and 100 student tickets were sold.<br />
        Check: 100 + 100 = 200 ✓ and 8(100) + 5(100) = 800 + 500 = 1300 ✓.
      </Typography>

      <Callout kind="try-this">
        Practice spotting the two facts in a word problem. Each fact becomes one equation. If you can\'t find two
        distinct facts, the problem might not be a system — it might be a single-variable equation in disguise.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Mixture and rate problems
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A common application: combining two solutions of different concentrations or two travelers at different
        speeds. The setup is always two equations — one about total quantity, one about total "stuff" (revenue,
        salt content, distance, etc.).
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Example: how many liters of 30% saline and 60% saline must be mixed to get 12 liters of 40% saline?<br />
        Let x = liters of 30%, y = liters of 60%.<br />
        Total volume: x + y = 12.<br />
        Total saline: 0.30x + 0.60y = 0.40(12) = 4.8.<br />
        From the first equation, y = 12 − x. Substitute: 0.30x + 0.60(12 − x) = 4.8 → 0.30x + 7.2 − 0.60x = 4.8 →
        −0.30x = −2.4 → x = 8. So 8 liters of 30% and 4 liters of 60% saline.
      </Typography>

      <Callout kind="connect">
        Mixture problems are systems disguised as chemistry. The same template works for: coffee blends at different
        prices, alloys with different percentages of metal, investment portfolios with different interest rates.
        The two equations are always "total amount" and "total contribution of the variable quantity."
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Recognizing parallel and coincident lines without solving
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Sometimes you can tell the solution count without solving the system. Convert both equations to slope-intercept
        form and compare slopes and y-intercepts:
      </Typography>
      <GuideTable
        headers={['Slopes', 'y-intercepts', 'Lines', 'Solution count']}
        rows={[
          ['Different', 'Doesn\'t matter', 'Intersect at one point', 'One solution'],
          ['Same', 'Different', 'Parallel', 'No solution'],
          ['Same', 'Same', 'Coincident (same line)', 'Infinitely many'],
        ]}
      />

      <Callout kind="watch-for">
        EOCEP trap: equations that LOOK different but are actually the same line in disguise. Example: y = 2x + 3
        and 4x − 2y = −6. Convert the second: −2y = −4x − 6 → y = 2x + 3. Same line — infinitely many solutions.
        Always check whether one equation is a multiple of the other before declaring "no solution" or "one
        solution."
      </Callout>
    </Box>
  );
}

// ── Section 6: Polynomials ───────────────────────────────────────────
function Section6Polynomials() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>polynomial</strong> is a sum of terms with non-negative integer exponents on the variables.
        Examples: 3x² + 5x − 7, 2x³ − x, and 9 (a constant — yes, it counts). Things that ARE NOT polynomials:
        1/x (negative exponent), √x (fractional exponent), 2ˣ (variable in the exponent). The non-negative integer
        exponent rule is what distinguishes polynomials from other expressions.
      </Typography>

      <Analogy title="Polynomials as Lego sets">
        Think of each term in a polynomial as a Lego brick. Bricks of the same color (same exponent) snap together
        easily — you can combine 3x² and 5x² into 8x². Bricks of different colors don\'t snap together — you can\'t
        combine 3x² and 5x into anything simpler. Adding and subtracting polynomials = combining like-colored
        bricks. Multiplying = building a bigger set by combining every brick of one with every brick of the other.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Vocabulary
      </Typography>
      <GuideTable
        headers={['Term', 'Definition', 'Example']}
        rows={[
          ['Monomial', 'One term', '7x³ or 5'],
          ['Binomial', 'Two terms', 'x + 4 or 3x² − 7'],
          ['Trinomial', 'Three terms', 'x² + 5x + 6'],
          ['Coefficient', 'Number in front of a variable', 'In 7x³, the coefficient is 7'],
          ['Constant', 'Term with no variable', 'In 3x + 8, the constant is 8'],
          ['Degree', 'Highest exponent in the polynomial', '5x³ + 2x − 1 has degree 3'],
          ['Leading coefficient', 'Coefficient of the highest-degree term', '5x³ + 2x − 1 has leading coefficient 5'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Adding and subtracting polynomials
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Combine LIKE TERMS — terms with the same variable raised to the same exponent. Watch the signs carefully when
        subtracting; distribute the negative sign to EVERY term in the second polynomial.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Example: (3x² + 4x − 5) − (x² − 2x + 7)<br />
        Distribute the negative: (3x² + 4x − 5) + (−x² + 2x − 7)<br />
        Combine like terms: (3x² − x²) + (4x + 2x) + (−5 − 7) = 2x² + 6x − 12.
      </Typography>

      <Callout kind="watch-for">
        The biggest mistake when subtracting polynomials is forgetting to distribute the negative sign to EVERY term.
        Students often flip only the first term and leave the rest. Always rewrite −(a + b + c) as −a − b − c
        explicitly before combining like terms.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Multiplying — FOIL and beyond
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        To multiply two binomials, use <strong>FOIL</strong>: First, Outer, Inner, Last. Each pair gets multiplied,
        and the results are combined.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Example: (x + 3)(x + 5)<br />
        First: x · x = x²<br />
        Outer: x · 5 = 5x<br />
        Inner: 3 · x = 3x<br />
        Last: 3 · 5 = 15<br />
        Combine: x² + 5x + 3x + 15 = x² + 8x + 15.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Two special-product patterns to memorize
      </Typography>
      <GuideTable
        headers={['Pattern', 'Result', 'Example']}
        rows={[
          ['Difference of squares: (a + b)(a − b)', 'a² − b²', '(x + 5)(x − 5) = x² − 25'],
          ['Square of a binomial: (a + b)²', 'a² + 2ab + b²', '(x + 3)² = x² + 6x + 9'],
          ['Square of a binomial (negative): (a − b)²', 'a² − 2ab + b²', '(x − 4)² = x² − 8x + 16'],
        ]}
      />

      <Callout kind="make-it-stick">
        Two huge traps with squares of binomials: (1) <strong>(x + 3)² is NOT x² + 9.</strong> The cross-term 2ab is
        what FOIL would give you — never forget the middle term. (2) <strong>(x + y)² ≠ x² + y².</strong> Same idea —
        if you don\'t expand and combine, you\'re missing the cross term. Always treat (binomial)² as (binomial) ·
        (binomial) and FOIL it.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Factoring — the reverse of FOIL
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Factoring means rewriting a polynomial as a product. For a trinomial of the form x² + bx + c, find two
        numbers that <strong>multiply to c</strong> and <strong>add to b</strong>.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Factor x² + 5x + 6. Need two numbers: multiply to 6, add to 5. Options for product 6: (1, 6), (2, 3),
        (−1, −6), (−2, −3). Of these, 2 + 3 = 5 ✓. So x² + 5x + 6 = (x + 2)(x + 3).
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Factoring decision tree
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Given a polynomial to factor] --> B[Step 1: Pull out GCF if any]
    B --> C{How many terms remain?}
    C -->|Two terms| D{Is it a difference of squares - a^2 minus b^2?}
    D -->|Yes| E[Factor as a plus b times a minus b]
    D -->|No| F[Probably already prime - check for sum of squares which does not factor]
    C -->|Three terms| G[Find two numbers that multiply to the constant and add to the middle coefficient]
    G --> H[Write as two binomials]
    C -->|Four or more terms| I[Try grouping - pair up terms with common factors]
        `}
      />

      <Callout kind="coachs-note">
        ALWAYS pull out the GCF first. Otherwise, you may get the wrong answer on "factor completely" problems.
        Example: factoring 2x² + 8x + 6 without pulling the 2 first gives (2x + 6)(x + 1), which is technically a
        factorization, but it\'s NOT fully factored — (2x + 6) still has a common factor of 2. Pull the GCF first,
        then factor what remains. Result: 2(x + 3)(x + 1).
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Signs of the factors
      </Typography>
      <GuideTable
        headers={['Sign of constant (c)', 'Sign of middle coefficient (b)', 'Signs of the two factors']}
        rows={[
          ['Positive', 'Positive', 'Both positive (e.g., x² + 5x + 6 → (x + 2)(x + 3))'],
          ['Positive', 'Negative', 'Both negative (e.g., x² − 5x + 6 → (x − 2)(x − 3))'],
          ['Negative', 'Either sign', 'One positive, one negative; the larger absolute value matches the sign of b'],
        ]}
      />

      <Callout kind="connect">
        Factoring polynomials feels like its own skill, but it\'s really preparation for solving quadratic equations
        (Section 7) — the most common solving strategy is "factor, then set each factor to zero." A polynomial that
        factors as (x − 3)(x + 5) gives roots x = 3 and x = −5 of the corresponding equation. So spend the time
        getting factoring fluent now; it pays back fivefold in the next section.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — multiplying multiple terms
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        FOIL only works for two binomials. For larger products, use the distributive property carefully — multiply
        EVERY term of the first polynomial by EVERY term of the second.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Example: (x + 2)(x² − 3x + 5)<br />
        Distribute the (x + 2) over each term of the trinomial:<br />
        x · (x² − 3x + 5) + 2 · (x² − 3x + 5)<br />
        = x³ − 3x² + 5x + 2x² − 6x + 10<br />
        Combine like terms: x³ + (−3 + 2)x² + (5 − 6)x + 10 = x³ − x² − x + 10.
      </Typography>

      <Callout kind="try-this">
        Set up a grid for multi-term multiplication. Put one polynomial across the top and the other down the side.
        Each cell is the product of the corresponding row and column terms. Then add all the cells, combining like
        terms. This grid method is especially useful for trinomial × trinomial.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Factoring by grouping (4-term polynomials)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        When you have four terms, try GROUPING: pair the terms and factor a GCF out of each pair, hoping the
        leftover binomials match. Example: factor x³ + 2x² + 3x + 6.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Group: (x³ + 2x²) + (3x + 6)<br />
        Factor each group: x²(x + 2) + 3(x + 2)<br />
        Both groups have a common factor of (x + 2). Factor it out:<br />
        (x + 2)(x² + 3)
      </Typography>

      <Callout kind="watch-for">
        Grouping only works if the two pairs leave behind IDENTICAL binomials after factoring the GCF from each. If
        the leftover binomials are different (like (x + 2) and (x + 3)), you may need to rearrange the original
        terms before grouping, or the polynomial may not factor over the integers at all.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Polynomials in standard form
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Convention: write polynomials in DESCENDING order of degree, like 5x³ − 2x² + 7x − 1. The leading term
        comes first, then in order down to the constant. This makes it easy to identify the degree and leading
        coefficient at a glance. EOCEP problems usually present polynomials in standard form, but you may need to
        rewrite a polynomial yourself if it\'s given out of order.
      </Typography>
    </Box>
  );
}

// ── Section 7: Quadratic Functions ───────────────────────────────────
function Section7Quadratics() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>quadratic function</strong> is one of the form f(x) = ax² + bx + c, with a ≠ 0. Its graph is a
        <strong> parabola</strong> — a U-shaped curve that opens up (if a &gt; 0) or down (if a &lt; 0). Quadratics
        describe physical situations involving acceleration (a thrown ball\'s height vs. time), area (length × width
        when one dimension depends on the other), and many optimization problems (find the maximum or minimum value).
        On the EOCEP, expect to solve quadratic equations, find vertices, and interpret quadratic word problems.
      </Typography>

      <Analogy title="A parabola as the path of a thrown ball">
        Toss a ball up into the air and watch its path. Coming up: gravity pulls it back. At the peak: momentum
        balances gravity. Coming down: gravity has won. The path is a parabola — symmetric on the way up and the way
        down. The peak is the VERTEX, the highest point. Every quadratic function describes some "rise, peak, fall"
        pattern (or a flipped "fall, valley, rise" if a is negative).
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Anatomy of a parabola
      </Typography>
      <GuideTable
        headers={['Feature', 'How to find it from y = ax² + bx + c', 'What it means']}
        rows={[
          ['Direction of opening', 'Look at the sign of a', 'a > 0 opens up (vertex is a minimum); a < 0 opens down (vertex is a maximum)'],
          ['Vertex (x-coordinate)', 'x = −b/(2a)', 'The turning point — minimum if opening up, maximum if opening down'],
          ['Vertex (y-coordinate)', 'Plug the vertex x back into the equation', 'The actual minimum or maximum value'],
          ['Axis of symmetry', 'Vertical line x = −b/(2a)', 'The parabola is mirror-symmetric across this line'],
          ['y-intercept', 'Set x = 0; y = c', 'Where the graph crosses the y-axis'],
          ['x-intercepts (roots/zeros)', 'Set y = 0 and solve: factor, quadratic formula, or completing the square', 'Where the graph crosses the x-axis (if at all)'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three ways to solve a quadratic equation
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Solve ax^2 + bx + c = 0] --> B{Can you factor easily?}
    B -->|Yes| C[Factor, set each factor to zero, solve - zero product property]
    B -->|No| D{Is it of the form x^2 = k?}
    D -->|Yes| E[Take square root of both sides - remember plus/minus]
    D -->|No| F[Use the quadratic formula or complete the square]
    F --> G[Compute discriminant b^2 minus 4ac to decide root count first]
    G --> H{Discriminant sign?}
    H -->|Positive| I[Two distinct real roots]
    H -->|Zero| J[One repeated real root]
    H -->|Negative| K[No real roots]
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Method 1: factoring (when possible)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Solve x² − 5x + 6 = 0.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Factor: two numbers multiplying to 6, adding to −5: −2 and −3.<br />
        (x − 2)(x − 3) = 0<br />
        By the <strong>zero product property</strong>, either factor must be zero:<br />
        x − 2 = 0 → x = 2, or x − 3 = 0 → x = 3.<br />
        Two roots: x = 2 and x = 3.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Method 2: the quadratic formula
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7, textAlign: 'center', fontSize: '1.1rem', color: 'text.primary' }}>
        x = (−b ± √(b² − 4ac)) / (2a)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        This formula solves ANY quadratic equation in standard form ax² + bx + c = 0. Memorize it — it\'s the most
        important formula in Algebra 1. Example: solve 2x² + 3x − 2 = 0. Here a = 2, b = 3, c = −2. Discriminant
        = 3² − 4(2)(−2) = 9 + 16 = 25. So x = (−3 ± √25) / (2·2) = (−3 ± 5) / 4. Two roots: x = 2/4 = 1/2 and
        x = −8/4 = −2.
      </Typography>

      <Callout kind="make-it-stick">
        Set the quadratic to <strong>standard form ax² + bx + c = 0</strong> before extracting a, b, c. Forgetting to
        move everything to one side is the #1 quadratic-formula error. Also: be careful with negative signs on b and
        c — the formula has minus signs that interact with whatever sign those coefficients already have.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The discriminant — root count without solving
      </Typography>
      <GuideTable
        headers={['Discriminant b² − 4ac', 'Number of real roots', 'Graph picture']}
        rows={[
          ['Positive', 'Two distinct real roots', 'Parabola crosses x-axis at two distinct points'],
          ['Zero', 'One repeated real root', 'Parabola touches x-axis at exactly one point (the vertex)'],
          ['Negative', 'No real roots (two complex roots, not studied in Algebra 1)', 'Parabola does not cross the x-axis at all'],
        ]}
      />

      <Callout kind="watch-for">
        A discriminant of 0 doesn\'t mean "no solution." It means ONE solution (a repeated root). Compare with the
        negative case, which gives NO real solutions. EOCEP questions often test the difference between these
        two cases. Always compute the discriminant FIRST when you\'re asked how many real roots a quadratic has.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Vertex form
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A second form of a quadratic, useful when you care about the vertex:
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7, textAlign: 'center', color: 'text.primary' }}>
        y = a(x − h)² + k
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Here (h, k) is the vertex of the parabola, and a controls width and direction. Note the SUBTRACTION inside
        the parentheses — the sign of h FLIPS when you read it off. For y = 2(x − 3)² + 5, the vertex is (3, 5), NOT
        (−3, 5). For y = 2(x + 4)² − 1, the vertex is (−4, −1).
      </Typography>

      <Analogy title="Vertex form as latitude-longitude of a parabola">
        Standard form ax² + bx + c is like an address — useful for many things, but not great for telling you exactly
        where the parabola SITS on the coordinate plane. Vertex form y = a(x − h)² + k is the GPS coordinate of the
        vertex: (h, k) is the position. If you ever need to draw a parabola quickly, convert to vertex form first.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Real-world quadratic — projectile motion
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A ball is thrown straight up with initial velocity 32 ft/s from 4 feet off the ground. Its height after t
        seconds is modeled by h(t) = −16t² + 32t + 4. What is the maximum height, and when does the ball hit the
        ground?
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        <strong>Maximum height:</strong> at the vertex. t = −b/(2a) = −32/(2·(−16)) = 1 second.<br />
        h(1) = −16(1)² + 32(1) + 4 = −16 + 32 + 4 = 20 feet. Max height is 20 ft at t = 1 second.<br />
        <strong>When does it hit the ground?</strong> Set h(t) = 0: −16t² + 32t + 4 = 0. Use the quadratic formula
        with a = −16, b = 32, c = 4. Discriminant = 32² − 4(−16)(4) = 1024 + 256 = 1280. t = (−32 ± √1280)/(−32).
        √1280 ≈ 35.78. t ≈ (−32 + 35.78)/(−32) ≈ −0.118 (rejected — time can\'t be negative) or
        t ≈ (−32 − 35.78)/(−32) ≈ 2.118 seconds. The ball hits the ground after about 2.12 seconds.
      </Typography>

      <Callout kind="why-it-matters">
        Quadratic word problems often ask "when does the height equal zero (the ground)?" or "what\'s the maximum
        height?" The first is asking for the x-intercepts; the second is asking for the vertex y-coordinate. These
        come up constantly — in physics, in business (maximum revenue, minimum cost), in geometry (area problems).
        Knowing which feature you\'re hunting for is half the battle.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Completing the square — a brief look
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        "Completing the square" is the technique that transforms ax² + bx + c into vertex form a(x − h)² + k. It\'s
        also where the quadratic formula comes from (applying the technique to the general equation gives the
        formula). On the EOCEP, you may be asked to complete the square in a simple case like x² + 6x + 5. The
        trick: take half the b-coefficient and square it.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        x² + 6x + 5. Half of 6 is 3; 3² is 9. Rewrite: x² + 6x + 9 − 9 + 5 = (x + 3)² − 4. Now in vertex form,
        with vertex at (−3, −4).
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — applying completing the square to solve
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Solve x² + 6x + 5 = 0 by completing the square. We already saw that x² + 6x + 5 = (x + 3)² − 4. Set that
        equal to zero: (x + 3)² − 4 = 0. Move the 4: (x + 3)² = 4. Take the square root of both sides (remembering
        ± both branches): x + 3 = ±2. So x = −3 + 2 = −1 or x = −3 − 2 = −5. Two roots: x = −1 and x = −5.
        Check by FOIL: (x + 1)(x + 5) = x² + 6x + 5 ✓.
      </Typography>

      <Callout kind="connect">
        Completing the square is the bridge between three big ideas: vertex form (it converts standard form INTO
        vertex form), the quadratic formula (you can derive the formula by completing the square on the general
        ax² + bx + c = 0), and graphing (the vertex form tells you exactly where to put your parabola). It\'s
        worth practicing even though the quadratic formula gives you an alternative for solving.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Reading parabola graphs
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Given a graph of a parabola, you should be able to read off:
      </Typography>
      <GuideTable
        headers={['Feature', 'How to read it off the graph']}
        rows={[
          ['Vertex (h, k)', 'The highest or lowest point of the U.'],
          ['Axis of symmetry', 'The vertical line through the vertex. Equation x = h.'],
          ['y-intercept', 'The y-value where the curve crosses the y-axis (x = 0).'],
          ['x-intercepts (roots)', 'The x-values where the curve crosses the x-axis. There may be 0, 1, or 2 of them.'],
          ['Direction of opening', 'Up (a > 0, vertex is minimum) or down (a < 0, vertex is maximum).'],
          ['Maximum / minimum value', 'The y-coordinate of the vertex.'],
        ]}
      />

      <Callout kind="watch-for">
        On a parabola graph, the "maximum value" is NOT the vertex point itself — it\'s the Y-COORDINATE of the
        vertex. If the vertex is at (3, 20), then the maximum value is 20, not (3, 20). The 3 tells you WHERE the
        max occurs (when x = 3); the 20 IS the max. EOCEP questions often ask for one or the other — read carefully.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — when is the ball at height 16 ft?
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Using the same model h(t) = −16t² + 32t + 4 from the previous worked example, at what time(s) is the ball at
        height 16 ft? Setup: −16t² + 32t + 4 = 16. Rearrange: −16t² + 32t − 12 = 0. Divide everything by −4:
        4t² − 8t + 3 = 0. Use the quadratic formula with a = 4, b = −8, c = 3. Discriminant = 64 − 48 = 16.
        t = (8 ± 4) / 8. So t = 12/8 = 1.5 or t = 4/8 = 0.5. The ball is at 16 ft at t = 0.5 seconds (going up) and
        again at t = 1.5 seconds (coming down). Two times — makes sense for a thrown ball that crosses the same
        height twice.
      </Typography>
    </Box>
  );
}

// ── Section 8: Exponential Functions ─────────────────────────────────
function Section8Exponentials() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Exponential functions are of the form f(x) = a · bˣ, where a is the <strong>initial value</strong> and b is
        the <strong>base</strong> (also called the growth or decay factor). They model situations where a quantity
        changes by a constant PERCENT (or factor) per step rather than a constant amount. Bank interest, population
        growth, radioactive decay, and pharmaceutical drug levels in the bloodstream are all exponential.
      </Typography>

      <Analogy title="Linear vs. exponential, side by side">
        Imagine two trees. Tree A grows 2 feet every year — that\'s LINEAR growth, a steady drumbeat. Tree B grows
        by 10% every year — small at first (a 5-foot tree becomes 5.5 ft) but the rate of growth itself grows. After
        20 years, Tree A is 5 + 40 = 45 ft tall. Tree B is 5 · 1.1²⁰ ≈ 5 · 6.73 ≈ 33.6 ft — still smaller. But by
        year 50, Tree A is 5 + 100 = 105 ft, while Tree B is 5 · 1.1⁵⁰ ≈ 5 · 117 ≈ 587 ft. Exponential always wins
        eventually.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Growth vs. decay
      </Typography>
      <GuideTable
        headers={['Base b', 'Behavior', 'Example']}
        rows={[
          ['b > 1', 'Exponential GROWTH', 'y = 100 · 1.05ˣ — grows 5% each step'],
          ['0 < b < 1', 'Exponential DECAY', 'y = 100 · 0.92ˣ — shrinks 8% each step'],
          ['b = 1', 'Constant function (not really exponential)', 'y = 100 · 1ˣ = 100 for all x'],
        ]}
      />

      <Callout kind="in-plain-words">
        Translate "grows by X%" or "shrinks by X%" directly to a base. Grows by 7% → b = 1 + 0.07 = 1.07. Shrinks
        by 7% → b = 1 − 0.07 = 0.93. The "1" stands for "keep the current amount"; the percentage you add or
        subtract is the CHANGE.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — compound interest
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        You deposit $1,000 in a bank account earning 4% interest per year, compounded annually. How much will you
        have after 10 years?
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        A(t) = 1000 · (1.04)¹⁰<br />
        Compute (1.04)¹⁰ ≈ 1.4802.<br />
        A(10) ≈ 1000 · 1.4802 = $1,480.24.<br />
        After 10 years, the account has about $1,480.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — half-life decay
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A radioactive sample of 80 grams has a half-life of 5 days (it loses half its mass every 5 days). How much
        remains after 20 days?
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        20 days / 5 days per half-life = 4 half-lives.<br />
        Halve 4 times: 80 → 40 → 20 → 10 → 5 grams.<br />
        Or use the equation: A(t) = 80 · (1/2)^(t/5). At t = 20: A = 80 · (1/2)⁴ = 80 · (1/16) = 5 grams. ✓
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Linear vs. exponential — the table fingerprint
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Given a table of x and y values] --> B[Compute differences between consecutive y values]
    B --> C{Are differences constant?}
    C -->|Yes| D[Linear function - constant rate of change]
    C -->|No| E[Compute ratios between consecutive y values]
    E --> F{Are ratios constant?}
    F -->|Yes| G[Exponential function - constant growth or decay factor]
    F -->|No| H[Not linear or exponential - possibly quadratic or other]
        `}
      />

      <GuideTable
        headers={['x', 'Linear: y = 3x + 2', 'Exponential: y = 2 · 3ˣ']}
        rows={[
          ['0', '2', '2'],
          ['1', '5 (added 3)', '6 (multiplied by 3)'],
          ['2', '8 (added 3)', '18 (multiplied by 3)'],
          ['3', '11 (added 3)', '54 (multiplied by 3)'],
          ['4', '14 (added 3)', '162 (multiplied by 3)'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Linear: same amount each step. Exponential: same factor each step.</strong> When you see a table on
        the EOCEP, your first move should be to compute either the differences (for linear) or the ratios (for
        exponential) of consecutive outputs. The pattern tells you the family in 10 seconds.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Eventually, exponential wins
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        For large enough x, any exponential function (with base &gt; 1) grows faster than ANY polynomial — including
        linear, quadratic, cubic, etc. This means in the long run, exponentials dwarf polynomial growth. It might
        not feel like it for small x (a linear function with a big slope can outpace a slow exponential for a while),
        but eventually the exponential takes over.
      </Typography>

      <Callout kind="why-it-matters">
        This eventually-wins property is why "compound interest is the eighth wonder of the world" (allegedly
        Einstein\'s words). A small percentage compounded over decades grows enormously. It\'s also why epidemics
        and viral content can explode so fast — they grow exponentially in the early phase. Recognizing exponential
        growth in real-world data is a crucial life skill, not just an exam topic.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — recognizing a function family
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A scientist records data: at t = 0, the population is 100. At t = 1, it\'s 300. At t = 2, it\'s 900. At t = 3,
        it\'s 2700. What kind of function fits this data, and what is its equation?
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Differences: 300 − 100 = 200, 900 − 300 = 600, 2700 − 900 = 1800. NOT constant — not linear.<br />
        Ratios: 300/100 = 3, 900/300 = 3, 2700/900 = 3. CONSTANT ratio of 3 — exponential.<br />
        Equation: P(t) = 100 · 3ᵗ. Initial value 100 (at t = 0), growth factor 3.
      </Typography>

      <Callout kind="connect">
        Exponential, linear, and quadratic functions are the three big families you\'ll see again and again. Knowing
        their fingerprints lets you build an appropriate model for real-world data: constant rate of change → linear,
        constant percent change → exponential, constant SECOND difference → quadratic. The data tells you which
        family to choose; the family tells you which formulas to apply.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Reading exponential graphs
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The graph of y = a · bˣ has a few signature features regardless of the specific numbers:
      </Typography>
      <GuideTable
        headers={['Feature', 'Growth (b > 1)', 'Decay (0 < b < 1)']}
        rows={[
          ['Direction', 'Goes up to the right, very steep eventually', 'Goes down to the right, approaches zero'],
          ['y-intercept', 'a (the value when x = 0)', 'a (same)'],
          ['Behavior as x → −∞', 'Approaches 0 from above (asymptote y = 0)', 'Grows very large'],
          ['Behavior as x → +∞', 'Grows without bound', 'Approaches 0 from above'],
          ['x-intercept', 'None — exponential never reaches 0', 'None — same'],
        ]}
      />

      <Callout kind="watch-for">
        Exponential graphs never touch the x-axis. As x decreases (for growth) or increases (for decay), the curve
        gets closer and closer to 0 but never equals 0. This means an exponential equation a · bˣ = 0 has NO
        solution — the graph never crosses zero. Don\'t waste time hunting for a "zero" of an exponential function.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — population growth and prediction
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A small town has a population of 5,000 in 2020 and is growing at 2% per year. Write an equation for the
        population P after t years, and predict the population in 2030.
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7 }}>
        Initial value a = 5,000. Growth factor b = 1 + 0.02 = 1.02.<br />
        Equation: P(t) = 5000 · (1.02)ᵗ.<br />
        In 2030, t = 10 years from 2020. P(10) = 5000 · (1.02)¹⁰ ≈ 5000 · 1.2190 ≈ 6,095.<br />
        Predicted population in 2030: about 6,095 people.
      </Typography>

      <Callout kind="try-this">
        Use the "rule of 72" as a quick check for exponential problems: at an annual growth rate of r%, money (or
        population, or anything) doubles in approximately 72/r years. At 2%, it doubles in about 36 years. So 5,000
        → 10,000 by 2056. Over 10 years (less than a third of that), expect significantly less than double — and
        our answer 6,095 fits.
      </Callout>
    </Box>
  );
}

// ── Section 9: Statistics & Data ─────────────────────────────────────
function Section9Statistics() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Statistics is about extracting meaningful patterns from data. On the Algebra 1 EOCEP, you\'ll be asked to
        compute measures of CENTER (mean, median, mode), measures of SPREAD (range, IQR), interpret scatter plots
        and lines of best fit, and reason carefully about correlation vs. causation. These topics aren\'t just exam
        material — they\'re the foundation for reading any news story, polling result, or scientific claim you\'ll
        encounter for the rest of your life.
      </Typography>

      <Analogy title="Statistics as a one-paragraph summary of a long book">
        Imagine you\'re asked to describe a 500-page novel in one sentence. You\'d need to pick the most important
        ideas and leave the rest out. Statistics does the same with data: from a list of hundreds or thousands of
        numbers, it extracts a few "summary statistics" — the mean, the median, the spread — that capture the
        important features. You lose information, but you gain the ability to communicate the story of the data
        quickly.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Measures of center
      </Typography>
      <GuideTable
        headers={['Measure', 'How to compute', 'When to use it']}
        rows={[
          ['Mean (average)', 'Sum of values ÷ count', 'When data are roughly symmetric with no big outliers; uses every data point.'],
          ['Median', 'Middle value when sorted (or average of two middle values if even count)', 'When data are skewed or have outliers — the median is RESISTANT to extremes.'],
          ['Mode', 'Most frequently occurring value(s)', 'For categorical data or when you want the "most common" rather than a center.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Mean vs. median — why it matters
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Consider the data set 30, 32, 34, 35, 36, 1000. The mean is (30 + 32 + 34 + 35 + 36 + 1000) / 6 ≈ 194.5 —
        pulled WAY up by the outlier 1000. The median is the average of the two middle values: (34 + 35) / 2 = 34.5
        — barely moved. The median gives a far better sense of the "typical" value when there are outliers.
      </Typography>

      <Callout kind="watch-for">
        Whenever you see a news story comparing "average" something (income, home price, test scores) between two
        groups, ask: was that the mean or the median? Income distributions are famously skewed by the very wealthy;
        means tell one story, medians another. The EOCEP will sometimes give you skewed data and ask which measure
        of center is most appropriate.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Measures of spread
      </Typography>
      <GuideTable
        headers={['Measure', 'Definition', 'Trade-off']}
        rows={[
          ['Range', 'max − min', 'Simple, but ignores everything in between and is heavily affected by outliers.'],
          ['Interquartile range (IQR)', 'Q3 − Q1 (the spread of the middle 50%)', 'Robust to outliers; gives a more reliable picture of typical spread.'],
          ['Standard deviation', 'Roughly, the average distance of data points from the mean', 'Uses every data point; affected by outliers like the mean is.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Scatter plots and correlation
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Two numerical variables, x and y] --> B[Plot them as paired points on a scatter plot]
    B --> C{What pattern do the points show?}
    C -->|Goes up from left to right| D[Positive correlation]
    C -->|Goes down from left to right| E[Negative correlation]
    C -->|No clear up or down trend| F[No correlation or non-linear]
    D --> G[Compute r - closer to plus 1 means stronger positive]
    E --> H[Compute r - closer to minus 1 means stronger negative]
    F --> I[r near zero - little or no linear relationship]
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The correlation coefficient r
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        r is a number between −1 and 1 that measures the STRENGTH and DIRECTION of a LINEAR relationship between
        two variables. SIGN tells direction (+ for positive correlation, − for negative). MAGNITUDE tells strength
        (closer to 1 = stronger).
      </Typography>
      <GuideTable
        headers={['r value', 'Interpretation', 'Picture']}
        rows={[
          ['r ≈ 1', 'Strong positive linear', 'Points tightly cluster around an upward line'],
          ['r ≈ 0.7', 'Moderate positive', 'Upward trend visible but more scatter'],
          ['r ≈ 0', 'No linear relationship', 'Cloud of points with no clear trend'],
          ['r ≈ −0.7', 'Moderate negative', 'Downward trend with some scatter'],
          ['r ≈ −1', 'Strong negative linear', 'Points tightly cluster around a downward line'],
        ]}
      />

      <Callout kind="make-it-stick">
        Two questions to answer about every r value: <strong>sign</strong> (direction) and <strong>magnitude</strong>
        (strength). Sign +/− → relationship goes up or down. Magnitude |r| → strong (close to 1) or weak (close to
        0). r = −0.85 is a STRONG NEGATIVE relationship — the negative sign is direction, the 0.85 is strength.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Line of best fit
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A scatter plot showing a linear trend can be summarized by a <strong>line of best fit</strong> (also called
        a regression line). Its equation is y = mx + b, where m is the slope (how much y typically changes per unit
        increase in x) and b is the y-intercept (predicted value of y when x = 0). The line minimizes the squared
        distances from the data points to the line — the "least squares" criterion.
      </Typography>

      <Callout kind="try-this">
        Once you have a line of best fit, you can <strong>predict</strong> y for a given x by substituting into the
        equation. Example: y = 3x + 10. Predict y when x = 5: y = 3(5) + 10 = 25. But watch out for
        <strong> extrapolation</strong>: predictions OUTSIDE the range of your data may be unreliable. The line
        might fit well from x = 0 to x = 20 but be totally wrong at x = 100.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Correlation vs. causation — the most important idea
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Two variables can be strongly correlated even when neither causes the other. Classic example: ice cream
        sales and shark attacks both spike in summer. Does eating ice cream cause shark attacks? Obviously not. They
        rise together because of a THIRD variable: hot summer weather. Both increase when temperatures rise.
      </Typography>

      <Analogy title="Correlation as two clocks running in sync">
        Two clocks across the room can both show 3:00 PM at the same moment without one causing the other to do so.
        They\'re both driven by something independent — the actual time of day. Correlation is the same kind of
        coincidence in data: two variables move together because of some hidden cause (a "lurking variable"), not
        because one moves the other.
      </Analogy>

      <Callout kind="why-it-matters">
        Confusing correlation with causation is the most common reasoning error in news stories about health,
        education, and economics. "People who eat breakfast have higher test scores" — correlation, not necessarily
        causation. To establish causation, you typically need a controlled experiment with random assignment, not
        just an observational study. The EOCEP loves to test this distinction.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Two-way frequency tables
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        When dealing with two CATEGORICAL variables (rather than two numerical ones), you organize data in a
        two-way frequency table. The rows and columns are the categories; the cells are counts. From a table you can
        compute joint, marginal, and conditional relative frequencies — fancy terms for "what percent of the total
        falls in each cell, in each row total, or in each row."
      </Typography>
      <GuideTable
        headers={['', 'Likes pizza', 'Doesn\'t like pizza', 'Row total']}
        rows={[
          ['9th grade', '45', '15', '60'],
          ['10th grade', '30', '20', '50'],
          ['Column total', '75', '35', '110'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        What percent of 9th graders like pizza? Conditional: 45/60 = 75%. What percent of all surveyed students are
        10th graders who don\'t like pizza? Joint: 20/110 ≈ 18%. Two-way tables are an EOCEP staple — practice
        reading and computing these percentages.
      </Typography>

      <Callout kind="coachs-note">
        Stats word problems often pile up vocabulary — "conditional relative frequency," "marginal distribution,"
        "joint frequency." Don\'t panic. Conditional = "given this condition" (divide by a row or column total).
        Marginal = "in the margin" (the row or column totals). Joint = "two things together" (one cell, divided by
        the grand total). These are just three ways of slicing the same data.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Box plots and the five-number summary
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A box plot (or box-and-whisker plot) visually summarizes the spread of a data set using five numbers: the
        minimum, first quartile (Q1), median (Q2), third quartile (Q3), and maximum. The box runs from Q1 to Q3
        (the IQR), with a line at the median. The whiskers extend out to the min and max (or to the most extreme
        points within 1.5 · IQR of the box, depending on convention).
      </Typography>

      <Analogy title="Box plots as data fingerprints">
        Imagine four classes of 30 students each, with the same average test score. A box plot reveals what the
        average alone hides: maybe one class is tightly bunched (small box), another is spread out (big box), a
        third has outliers (long whiskers), a fourth is skewed (median off-center in the box). Box plots are
        designed to show you the SHAPE of a data set at a glance — far more informative than mean alone.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Histograms, dot plots, and skew
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>histogram</strong> groups numerical data into bins (e.g., test scores 70–79, 80–89, …) and shows
        bars proportional to the count in each bin. A <strong>dot plot</strong> shows individual data values as
        stacks of dots above a number line. Both reveal the SHAPE of a distribution: <strong>symmetric</strong>
        (mirror-balanced around a center), <strong>right-skewed</strong> (long tail to the right), or
        <strong> left-skewed</strong> (long tail to the left).
      </Typography>

      <GuideTable
        headers={['Shape', 'Mean vs. median', 'Common real-world examples']}
        rows={[
          ['Symmetric', 'Mean ≈ median', 'Heights of adults, standardized test scores'],
          ['Right-skewed (tail on the right)', 'Mean > median (mean pulled up by the right tail)', 'Incomes, house prices, response times'],
          ['Left-skewed (tail on the left)', 'Mean < median (mean pulled down by the left tail)', 'Test scores on an easy test, age at death in a developed country'],
        ]}
      />

      <Callout kind="connect">
        Skew is the visual reason why the median is preferred for income or housing data. The right tail (a small
        number of very wealthy or very expensive cases) pulls the MEAN up, exaggerating "typical" wealth. The MEDIAN
        — middle value — is unaffected and reflects what most people actually experience.
      </Callout>
    </Box>
  );
}

// ── Section: EOCEP Strategy ───────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The SC EOCEP for Algebra 1 is a timed multiple-choice exam covering everything in Sections 2–9 of this
        guide. It\'s administered at the end of your Algebra 1 course, and your score counts <strong>20% of your
        final grade in the class</strong>. The exam tests procedural skill (compute, simplify, solve), conceptual
        understanding (which family of function fits this scenario?), and modeling (set up an equation from a word
        problem). A graphing calculator is permitted — confirm your school\'s policy.
      </Typography>

      <Callout kind="try-this">
        Before exam day, take the EOCEP Sandbox tab at least twice — full timed runs, no pauses. Your goal isn\'t
        to score perfectly on the first one; it\'s to learn how the time pressure feels and where YOU run out of
        time. Time-management is the biggest controllable factor on exam day.
      </Callout>

      <Callout kind="coachs-note">
        Read each problem CAREFULLY. EOCEP questions often hinge on small details — a negative sign you missed, a
        ratio vs. a difference, "at least 7" (≥ 7) vs. "more than 7" (&gt; 7). Skim once for the structure, then
        read again to catch the qualifier. When two answer choices both look plausible, the qualifier usually picks
        between them.
      </Callout>

      <Callout kind="try-this">
        Show your work on scratch paper — even on multiple-choice questions. Most algebra errors are tiny sign or
        arithmetic slips. If you\'ve written out the steps, you can spot the slip; if you only thought through it,
        you can\'t. The graphing calculator is helpful, but it doesn\'t catch logic errors.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        What\'s heavily tested
      </Typography>
      <GuideTable
        headers={['Topic', 'Why it shows up so much']}
        rows={[
          ['Linear equations & graphs', 'Foundational for every later topic. EOCEP tests slope, intercepts, and word problems heavily.'],
          ['Functions and function notation', 'The fundamental concept for everything in later math. Expect notation questions.'],
          ['Solving quadratics', 'Three methods (factor, formula, complete the square) — the test will sample all three.'],
          ['Distinguishing linear/exponential/quadratic models', 'Real-world modeling questions ask you to pick the right family. Use the "table fingerprint" test.'],
          ['Correlation vs. causation', 'A favorite "trap" topic. Strong correlation does NOT prove causation.'],
        ]}
      />

      <Callout kind="watch-for">
        Common procedural traps:
        <ul>
          <li>Forgetting to flip the inequality sign when dividing by a negative.</li>
          <li>Confusing the product rule (xᵃ · xᵇ = xᵃ⁺ᵇ — ADD) with the power rule ((xᵃ)ᵇ = xᵃᵇ — MULTIPLY).</li>
          <li>Squaring a binomial and getting only x² + b² (forgetting the middle 2ab cross term).</li>
          <li>Solving x² = 16 and only writing x = 4 (forgetting x = −4 also works).</li>
          <li>Reading the vertex of y = a(x − h)² + k as (−h, k) instead of (h, k) — the sign flips!</li>
        </ul>
      </Callout>

      <Callout kind="connect">
        Algebra 1 connects to almost every later math course — Geometry will use linear equations to find perpendicular
        bisectors; Algebra 2 will extend factoring and quadratics to higher-degree polynomials; Pre-Calc and Calculus
        will treat functions as the central object. Investing now in real fluency, not just procedural memorization,
        pays back across years of math.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Time management
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The EOCEP gives you about 90–120 minutes for ~50–60 multiple-choice questions. That\'s roughly 1.5–2
        minutes per question. Some will take 30 seconds; some will take 4–5 minutes. Don\'t fixate on any single
        problem — flag it, move on, and come back at the end. A 50-question exam is decided by the questions you
        ANSWER, not the one you got stuck on.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three-pass strategy
      </Typography>
      <GuideTable
        headers={['Pass', 'Goal', 'Time budget']}
        rows={[
          ['1. Quick sweep', 'Answer every question you know cold. Skip anything that takes more than 90 seconds. Mark skipped ones.', 'About half the total time'],
          ['2. Deep work', 'Return to the skipped questions. Work them carefully, one at a time.', 'About 40% of the total time'],
          ['3. Review', 'Double-check answers, especially anything you guessed or rushed. Make sure no questions are blank.', 'About 10% of the total time'],
        ]}
      />

      <Callout kind="try-this">
        Practice the three-pass strategy in the EOCEP Sandbox. Don\'t treat the first run as a "real test" attempt
        — treat it as practice for your strategy. Notice which question types eat your time, and plan to skip them
        during the first pass on test day.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Multiple-choice tactics
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Even when you don\'t know how to solve a problem from scratch, you can often eliminate wrong answers:
      </Typography>
      <GuideTable
        headers={['Tactic', 'How to use it']}
        rows={[
          ['Plug answer choices back into the equation', 'If the question gives you 4 numeric choices, test which one makes the equation true. Faster than solving in some cases.'],
          ['Estimate, then pick the closest', 'For "approximately" questions, ballpark in your head and eliminate choices that are way off.'],
          ['Look at units', 'For applied problems, eliminate any choice whose units don\'t match the question.'],
          ['Sanity-check magnitude', 'Population should be a non-negative integer; height should be positive; percentages between 0 and 100.'],
        ]}
      />

      <Callout kind="why-it-matters">
        On a 50-question multiple-choice test, eliminating even ONE wrong answer per question raises your guess
        accuracy from 25% to 33%. Eliminating two raises it to 50%. Over 10 guessed questions, that\'s the difference
        between an extra 1–2 questions right vs. an extra 3–4. Add that to the questions you actually solve, and
        elimination becomes a meaningful score booster.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The week before the exam
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Don\'t cram. Cramming produces short-term recall that fades fast; you need durable understanding for a
        90-minute test. Instead:
      </Typography>
      <GuideTable
        headers={['Day', 'Activity']}
        rows={[
          ['7 days out', 'Take a full EOCEP Sandbox attempt. Note which subdomains scored lowest.'],
          ['6 days out', 'Drill the weakest subdomain in Practice. Aim for 20 questions, focus on understanding misses.'],
          ['5 days out', 'Drill the second-weakest subdomain.'],
          ['4 days out', 'Take another full Sandbox attempt. Compare to the first.'],
          ['3 days out', 'Re-read the Study Guide sections for any subdomain still below 75%.'],
          ['2 days out', 'Review flashcards. Light practice — don\'t burn out.'],
          ['1 day out', 'Rest your brain. Light review of formulas (quadratic formula, slope, exponential growth, etc.). Get to bed early.'],
          ['Exam day', 'Eat a real breakfast. Bring two pencils, your calculator, and water. Arrive early.'],
        ]}
      />

      <Callout kind="coachs-note">
        On exam day, your job is to perform — not to learn. Don\'t try to absorb new material in the last 12 hours;
        you\'re likely to confuse yourself and lose sleep. Trust the work you\'ve already done. The students who do
        best on standardized tests are not necessarily the smartest — they\'re the ones who arrive rested, calm,
        and confident.
      </Callout>
    </Box>
  );
}

// ── Glossary section (renders the imported glossary as a table) ───────
function SectionGlossary() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Terms a 9th grader is expected to recognize on the SC EOCEP. Use the Practice tab and Flashcards tab to
        drill these into memory; here they\'re organized in one place for quick reference.
      </Typography>
      <GuideTable
        headers={['Term', 'Definition']}
        rows={glossary.map(g => [g.term, g.definition])}
      />
    </Box>
  );
}
