// ALG2 Study Guide — accordion-based layout for SC Algebra 2 (11th grade).
// No EOCEP. Content uses shared MUI components — Callout, Analogy, GuideTable,
// MermaidDiagram, SectionQuiz — no special CSS wrapper needed.

import { useEffect, useRef, useState } from 'react';
import { scopedStorage as localStorage } from '../../../app/storage/scopedStorage';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  ExpandMore as ExpandMoreIcon,
  Print as PrintIcon,
  RadioButtonUnchecked as IncompleteIcon,
  Replay as ResetIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import MermaidDiagram from '../../../KnowledgeBase/components/MermaidDiagram';
import { Analogy, GuideTable, SectionQuiz, type QuizQuestion } from '../../shared/components';
import { Callout } from '../../shared/Callout';
import { glossary } from './glossary';
import { questions } from './questions';

const READING_PROGRESS_KEY = 'exam-prep-reading:ALG2';
const COMPLETION_KEY = 'exam-prep-completed:ALG2';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:ALG2';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Polynomial & Rational Functions',
  s3: 'Complex Numbers',
  s4: 'Exponential & Logarithmic Functions',
  s5: 'Systems & Matrices',
  s6: 'Conic Sections',
  s7: 'Sequences & Series',
  s8: 'Statistics & Probability',
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
  { id: 's1',      num: '1',  title: 'The Big Picture',                       icon: '🗺️' },
  { id: 's2',      num: '2',  title: 'Polynomial & Rational Functions',        icon: '📐' },
  { id: 's3',      num: '3',  title: 'Complex Numbers',                        icon: 'ℂ'  },
  { id: 's4',      num: '4',  title: 'Exponential & Logarithmic Functions',    icon: '📈' },
  { id: 's5',      num: '5',  title: 'Systems of Equations & Matrices',        icon: '⚡' },
  { id: 's6',      num: '6',  title: 'Conic Sections',                         icon: '⭕' },
  { id: 's7',      num: '7',  title: 'Sequences & Series',                     icon: '🔢' },
  { id: 's8',      num: '8',  title: 'Statistics & Probability',               icon: '📊' },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',                      icon: '🎯' },
  { id: 's-gloss', num: '📚', title: 'Glossary',                               icon: '📚' },
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
    try { localStorage.setItem(COMPLETION_KEY, JSON.stringify([...completed])); } catch { /* ignore */ }
  }, [completed]);

  useEffect(() => {
    try { localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify([...openSections])); } catch { /* ignore */ }
  }, [openSections]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const openAll = () => setOpenSections(new Set(SECTIONS.map(s => s.id)));

  const toggleComplete = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
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
    return <SectionQuiz sectionId={id} storageKey={QUIZ_STORAGE_KEY} questions={quiz} />;
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 1.5, mb: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: TEXT_PRI, fontSize: '0.95rem' }}>
              Reading progress — {completed.size} of {SECTIONS.length} sections
            </Typography>
            <Typography sx={{ color: TEXT_SEC, fontSize: '0.8rem' }}>
              Mark each section complete as you finish it. Quick checks at the end of each section don't count toward the Diagnostic.
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
          sx={{ height: 8, borderRadius: 2, backgroundColor: alpha(ACCENT, 0.15), '& .MuiLinearProgress-bar': { backgroundColor: ACCENT } }}
        />
      </Paper>

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
                    <Chip size="small" label={s.num}
                      sx={{ backgroundColor: alpha(ACCENT, 0.15), color: ACCENT, fontWeight: 800, height: 22, minWidth: 38 }} />
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

function SectionContent({ id }: { id: string }) {
  switch (id) {
    case 's1':      return <Section1BigPicture />;
    case 's2':      return <Section2Polynomials />;
    case 's3':      return <Section3Complex />;
    case 's4':      return <Section4ExpLog />;
    case 's5':      return <Section5Matrices />;
    case 's6':      return <Section6Conics />;
    case 's7':      return <Section7Sequences />;
    case 's8':      return <Section8Stats />;
    case 's-strat': return <SectionStrategy />;
    case 's-gloss': return <SectionGlossary />;
    default:        return null;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Section 1: The Big Picture
// ─────────────────────────────────────────────────────────────────────
function Section1BigPicture() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>What Is Algebra 2 — and Why Does It Matter?</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Algebra 2 is the bridge between Algebra 1 and Pre-Calculus. Where Algebra 1 introduced you to linear
        and quadratic relationships, Algebra 2 expands the function toolkit dramatically: polynomials of any
        degree, rational functions, complex numbers, exponentials, logarithms, conic sections, sequences, and
        probability. Each of these is a different mathematical language for describing a different kind of
        real-world behavior. By the end of this course you'll be fluent in all of them.
      </Typography>

      <Analogy title="Highway driving after the parking lot">
        Algebra 1 taught you to drive in a parking lot — linear equations, basic functions, simple parabolas.
        Algebra 2 puts you on the highway. Same vehicle (algebra), but now you're navigating steep curves
        (higher-degree polynomials), merging lanes (systems of 3 equations), thick fog (complex numbers where
        √(−1) exists), and hills that seem flat but suddenly skyrocket (exponential growth). Every rule from
        Algebra 1 still applies — you're just using those rules in far more demanding conditions, and the
        destinations you reach are far more interesting.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Seven Content Areas — How They Build</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The seven main topics of Algebra 2 are not independent islands. They're a network where each area
        enriches the others. Polynomials require factoring skills from Algebra 1 and then lead directly into
        rational functions. Complex numbers emerge from polynomials when the discriminant goes negative.
        Exponentials and logarithms are inverses of each other. Matrices provide a compact language for systems.
        Conics unify parabolas (from Algebra 1) with ellipses and hyperbolas. Sequences formalize the patterns
        of growth and decay you studied in exponentials.
      </Typography>

      <MermaidDiagram chart={`graph TD
  A[Algebra 1 Foundation] --> B[Polynomial & Rational Functions]
  A --> C[Complex Numbers]
  B --> C
  B --> D[Exponential & Logarithmic Functions]
  A --> E[Systems & Matrices]
  A --> F[Conic Sections]
  B --> F
  D --> G[Sequences & Series]
  E --> G
  B --> H[Statistics & Probability]
  G --> H`} />

      <Callout kind="why-it-matters">
        Every scientific model, financial projection, and engineering design you'll encounter in college or a
        career uses at least one of these function families. Exponentials power population models and compound
        interest. Logarithms appear on the Richter scale, in pH, in decibels. Matrices drive computer graphics,
        machine learning, and structural engineering. Sequences underlie music theory, cryptography, and loan
        amortization. This course is applied math disguised as abstract symbols.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Function Toolkit at a Glance</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Think of the function families as specialized tools. A surgeon carries many instruments because each
        procedure needs a different one. A mathematician reaches for the right function family based on the
        structure of the problem. Here's the full toolkit you'll build this year:
      </Typography>

      <GuideTable
        headers={['Function family', 'Graph shape', 'Key feature', 'Real-world example']}
        rows={[
          ['Linear (Alg 1 review)', 'Straight line', 'Constant rate of change', 'Distance = speed × time'],
          ['Quadratic (Alg 1 review)', 'Parabola', 'Vertex, axis of symmetry', 'Projectile height'],
          ['Polynomial (degree ≥ 3)', 'Multiple hills and valleys', 'Zeros with multiplicity', 'Roller coaster profile'],
          ['Rational', 'Curves with asymptotes', 'Domain restrictions', 'Speed vs. travel time (fixed distance)'],
          ['Exponential', 'Rapid growth or decay', 'Constant percent change', 'Compound interest, viral spread'],
          ['Logarithmic', 'Slow, ever-increasing', 'Inverse of exponential', 'Richter scale, pH, decibels'],
          ['Conic', 'Circles, ellipses, parabolas, hyperbolas', 'Focus and directrix', 'Planetary orbits, satellite dishes'],
          ['Sequence/Series', 'Discrete points', 'Explicit and recursive rules', 'Loan payments, population models'],
        ]}
      />

      <Analogy title="Algebra 2 as a language with a growing vocabulary">
        In your first year of a foreign language you learned a few hundred words and basic sentences. In the
        second year, the vocabulary doubles and the grammar grows more nuanced — but the same underlying
        logic applies. Algebra 2 is the second year of the language of mathematics. The verbs (solving,
        graphing, factoring) are the same ones from Algebra 1. What changes is the vocabulary: new function
        families, new number systems, new notation. Don't be intimidated by the new words — the grammar is
        still algebra.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>What "Higher Math" Really Means</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Students often hear "higher math" and picture an impenetrable wall of symbols. In reality, "higher"
        means more general: instead of solving one specific equation, you study the behavior of a whole family
        of equations. Instead of finding the slope of one line, you study all possible slopes. The power of
        abstraction — reasoning about an entire category of objects at once — is what separates Algebra 2
        thinking from arithmetic. It's the same leap you made when you went from "what is 3 + 5?" to
        "what is x + 5 = 8?"
      </Typography>

      <Callout kind="coachs-note">
        You already know linear and quadratic deeply from Algebra 1. Every new topic in Algebra 2 has a
        connection back to what you already know. Logs look nothing like anything before — but they follow
        the same inverse logic as square roots. Rational functions have asymptotes — but they're just polynomials
        divided by polynomials, and you can factor both. When something feels new and scary, ask: "Is there
        an Algebra 1 analogy?" There almost always is.
      </Callout>

      <Callout kind="make-it-stick">
        For each new function family, build a personal reference card with: standard form, domain and range,
        key graph features, transformations (shifts, stretches, reflections), and one concrete real-world
        application. By the end of the course you'll have eight cards. Keep them. Pre-Calculus will add two
        more (trig) and expect you to already own the first eight.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Polynomial & Rational Functions
// ─────────────────────────────────────────────────────────────────────
function Section2Polynomials() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Polynomial Functions</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A polynomial function has the form f(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀ where all exponents are
        non-negative integers and aₙ ≠ 0. The <strong>degree</strong> is the highest power; the <strong>leading
        coefficient</strong> is the coefficient of that highest-power term. These two pieces of information
        completely determine the function's end behavior — what happens as x → +∞ and x → −∞.
      </Typography>

      <Analogy title="A polynomial as a landscape of hills and valleys">
        Drive across the country and look at the horizon. The terrain rises and falls — mountains, valleys,
        ridges. A polynomial of degree n creates exactly that kind of landscape: up to n − 1 "turns" (local
        maxima and minima), separated by stretches going up or down. The leading coefficient determines
        whether the terrain ultimately climbs forever (positive) or descends forever (negative) as you drive
        to the far left or far right. The zeros are the places where the terrain crosses sea level (y = 0).
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>End Behavior — Four Cases</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        End behavior depends only on the leading term. The other terms are "noise" that disappears when x is
        very large or very negative — the leading term dominates everything.
      </Typography>

      <GuideTable
        headers={['Degree', 'Leading coefficient', 'Left end (x → −∞)', 'Right end (x → +∞)', 'Memory image']}
        rows={[
          ['Even', 'Positive (+)', 'Up ↑', 'Up ↑', 'U-shape — both arms rise'],
          ['Even', 'Negative (−)', 'Down ↓', 'Down ↓', 'Arch — both arms fall'],
          ['Odd', 'Positive (+)', 'Down ↓', 'Up ↑', 'Forward-slash / shape'],
          ['Odd', 'Negative (−)', 'Up ↑', 'Down ↓', 'Backslash \\ shape'],
        ]}
      />

      <Callout kind="watch-for">
        Students routinely check the constant term (a₀, the y-intercept) instead of the leading coefficient
        to determine end behavior. End behavior depends ONLY on the leading term — the term with the
        highest exponent. The constant term affects where the graph sits vertically, not what happens
        at the far ends. Always identify the leading term first.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Zeros and Multiplicity — With Examples</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A zero (root, x-intercept) is a value c where f(c) = 0. If (x − c) appears k times as a factor,
        the zero has <strong>multiplicity k</strong>. Multiplicity controls the graph's behavior at that zero.
        Consider f(x) = (x − 2)²(x + 1)³(x − 5):
      </Typography>

      <GuideTable
        headers={['Zero', 'Multiplicity', 'Even or odd?', 'Graph behavior', 'Visual description']}
        rows={[
          ['x = 2', '2', 'Even', 'Bounces off the x-axis', 'Touches zero, curves back without crossing'],
          ['x = −1', '3', 'Odd', 'Crosses with an S-curve flattening', 'Crosses, but flattens momentarily at the axis'],
          ['x = 5', '1', 'Odd', 'Clean crossing', 'Crosses straight through, sharp angle'],
        ]}
      />

      <Callout kind="in-plain-words">
        Think of the x-axis as a trampoline. A zero with <strong>even</strong> multiplicity is like a ball that
        rolls to the trampoline, touches it, and bounces straight back up without going through. A zero with
        <strong> odd</strong> multiplicity is like a ball that punches through the trampoline — the graph crosses
        to the other side. Higher odd multiplicity (3, 5, …) means the graph flattens out at the crossing point,
        like it hesitates briefly before committing to crossing.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Descartes' Rule of Signs</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Count sign changes in f(x) to find the maximum number of positive real zeros (subtract 2 until you
        reach 0 or 1 for the other possible counts). Then substitute −x and count sign changes to find the
        maximum number of negative real zeros. Example: f(x) = x⁴ − 3x³ + 2x² + x − 1.
        Sign pattern: +, −, +, +, − → sign changes at positions 1→2 (+ to −), 2→3 (− to +), 4→5 (+ to −)
        = 3 sign changes → 3 or 1 positive real zeros.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Rational Zeros Theorem and Synthetic Division</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        If p(x) has integer coefficients, every rational zero has the form <strong>p/q</strong> where p divides
        the constant term and q divides the leading coefficient. This gives a finite list of candidates to test.
        Use synthetic division to test each candidate efficiently.
      </Typography>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>Synthetic division step-by-step: divide 2x³ − 3x² + x − 5 by (x − 2)</Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'   2 | 2  -3   1  -5'}<br />
        {'     |     4   2   6'}<br />
        {'     +---------------'}<br />
        {'       2   1   3   1  ← remainder (so p(2) = 1)'}
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Quotient: 2x² + x + 3, remainder: 1. Confirmed by Remainder Theorem: p(2) = 2(8) − 3(4) + 2 − 5 = 1 ✓.
        If the remainder were 0, then 2 is a zero and (x − 2) is a factor — that's the Factor Theorem.
      </Typography>

      <Callout kind="try-this">
        Complete factoring algorithm for a polynomial with rational coefficients: (1) list all p/q candidates
        from the Rational Zeros Theorem; (2) test them with synthetic division until a zero is found;
        (3) the quotient is a lower-degree polynomial — repeat until fully factored. Any unfactorable quadratic
        remaining can be solved with the quadratic formula, possibly yielding complex roots.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Rational Functions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A rational function is f(x) = p(x)/q(x) where p and q are polynomials. The domain excludes all values
        where q(x) = 0. But before identifying asymptotes, always simplify by cancelling common factors —
        cancelled factors create <strong>holes</strong>, not vertical asymptotes.
      </Typography>

      <Analogy title="Asymptotes as forbidden zones the function can never enter">
        Imagine a city with certain streets permanently blocked. Your car (the function's graph) must navigate
        around those streets — getting very close but never actually crossing into the blocked zone. Vertical
        asymptotes are streets blocked by a city ordinance (the denominator equals zero and the factor
        doesn't cancel). Horizontal asymptotes are the city limits in the distance — no matter how far you
        drive (x → ±∞), you never quite reach the edge of town.
      </Analogy>

      <GuideTable
        headers={['Feature', 'How to find it', 'What it means geometrically']}
        rows={[
          ['Domain', 'Exclude zeros of the denominator', 'All x where the function is defined'],
          ['Holes (removable discontinuity)', 'Factors that cancel from both num and den', 'A single missing point in an otherwise continuous curve'],
          ['Vertical asymptotes', 'Zeros of denominator that do NOT cancel', 'The graph explodes to ±∞ on either side'],
          ['x-intercepts', 'Zeros of the numerator (in the domain)', 'Where the graph crosses the horizontal axis'],
          ['y-intercept', 'f(0) — evaluate the simplified function at x = 0', 'Where the graph crosses the vertical axis'],
          ['Horizontal asymptote', 'Compare degrees of num and den (see table below)', 'What y-value the graph approaches as x → ±∞'],
          ['Slant asymptote', 'Polynomial long division when deg(num) = deg(den) + 1', 'The graph approaches a line (not horizontal) at the ends'],
        ]}
      />

      <GuideTable
        headers={['Degree comparison', 'Horizontal asymptote', 'Example', 'Intuition']}
        rows={[
          ['deg(num) < deg(den)', 'y = 0', 'f(x) = (x+1)/(x²+2)', 'Den grows faster → fraction → 0'],
          ['deg(num) = deg(den)', 'y = ratio of leading coefficients', 'f(x) = (3x²)/(5x²+1) → y = 3/5', 'Leading terms dominate, ratio stabilizes'],
          ['deg(num) > deg(den)', 'None (may have slant asymptote)', 'f(x) = (x²+1)/(x−2)', 'Num grows faster → function grows without bound'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  A[Graphing a Rational Function] --> B[Step 1: Factor num and den]
  B --> C[Step 2: Cancel common factors → mark HOLES]
  C --> D[Step 3: Vertical asymptotes from remaining den zeros]
  D --> E[Step 4: Horizontal or slant asymptote from degree comparison]
  E --> F[Step 5: Find x-intercepts from simplified numerator zeros]
  F --> G[Step 6: Find y-intercept — evaluate at x=0]
  G --> H[Step 7: Test sign in each interval between zeros and asymptotes]
  H --> I[Step 8: Sketch, placing the curve in each region]`} />

      <Callout kind="connect">
        Horizontal asymptotes tell you about the function's behavior at infinity (large x). Vertical asymptotes
        tell you about its behavior near specific x-values (local explosions). These are "infinity" behaviors
        in two perpendicular directions. Master both separately, then combine them: the asymptotes form a
        coordinate framework, and the curve lives between them, crossing the x-axis at the numerator zeros.
      </Callout>

      <Callout kind="watch-for">
        The graph CAN cross a horizontal asymptote — horizontal asymptotes only describe end behavior,
        not the behavior of the entire graph. The graph can NEVER cross a vertical asymptote. If a problem
        asks whether the graph crosses y = 3 (its horizontal asymptote), set f(x) = 3 and solve — there
        may be an x-value that produces it in the middle of the domain.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Polynomial Long Division and the Remainder Theorem</Typography>

      <Analogy title="Polynomial long division is just long division with variables">
        Numeric long division of 137 ÷ 5 repeatedly asks "how many times does 5 fit into the leading digits?" Polynomial long division does the same thing with terms: divide the leading term of the dividend by the leading term of the divisor, multiply through, subtract, and repeat with the remainder. The only difference is that "fitting" means "what times the leading term of the divisor gives the leading term of the current remainder?" The algorithm is identical.
      </Analogy>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Divide (2x³ − 5x² + 3x − 1) ÷ (x − 2) using long division:
      </Typography>
      <Box sx={{ p: 1.5, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2, overflowX: 'auto' }}>
        {'           2x² − x + 1'}<br />
        {'       ─────────────────────'}<br />
        {'x − 2  │  2x³ − 5x² + 3x − 1'}<br />
        {'          2x³ − 4x²'}<br />
        {'          ─────────'}<br />
        {'               −x² + 3x'}<br />
        {'               −x² + 2x'}<br />
        {'               ─────────'}<br />
        {'                    x − 1'}<br />
        {'                    x − 2'}<br />
        {'                    ─────'}<br />
        {'                        1   ← remainder'}
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Result: (2x³ − 5x² + 3x − 1) = (x − 2)(2x² − x + 1) + 1. <strong>Remainder Theorem:</strong> the remainder when dividing p(x) by (x − c) equals p(c). Here, p(2) = 2(8) − 5(4) + 3(2) − 1 = 16 − 20 + 6 − 1 = 1 ✓. <strong>Factor Theorem:</strong> (x − c) is a factor of p(x) if and only if p(c) = 0.
      </Typography>

      <Callout kind="connect">
        The Remainder and Factor Theorems connect evaluation and factoring. Testing whether x = 3 is a zero of p(x) is exactly the same as checking whether (x − 3) is a factor — both reduce to computing p(3). Synthetic division computes p(c) faster than substitution for large polynomials. Use the Rational Zeros Theorem to generate candidate values, then synthetic division to test each one efficiently.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Function Transformations — The Universal Template</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every function family in Algebra 2 obeys the same transformation rules. If f(x) is any parent function, then y = a · f(b(x − h)) + k transforms it in four ways. Mastering this template once gives you control over all eight function families.
      </Typography>

      <GuideTable
        headers={['Parameter', 'Transformation', 'Effect on graph', 'Example (f(x) = x²)']}
        rows={[
          ['h', 'Horizontal shift', 'Shifts right h units (left if h < 0)', 'y = (x − 3)² shifts right 3'],
          ['k', 'Vertical shift', 'Shifts up k units (down if k < 0)', 'y = x² + 5 shifts up 5'],
          ['a (|a| > 1)', 'Vertical stretch', 'Graph is taller/narrower', 'y = 3x² is 3× taller'],
          ['a (0 < |a| < 1)', 'Vertical compression', 'Graph is shorter/wider', 'y = 0.5x² is half as tall'],
          ['a < 0', 'Vertical reflection', 'Graph flips over x-axis', 'y = −x² opens downward'],
          ['b (|b| > 1)', 'Horizontal compression', 'Graph is narrower (happens faster)', 'y = (2x)² compresses by 2'],
          ['b (0 < |b| < 1)', 'Horizontal stretch', 'Graph is wider (happens slower)', 'y = (0.5x)² stretches by 2'],
          ['b < 0', 'Horizontal reflection', 'Graph flips over y-axis', 'y = (−x)² — same as x² here'],
        ]}
      />

      <Callout kind="watch-for">
        Horizontal transformations work OPPOSITE to what you'd expect. In y = f(x − 3), the "−3" shifts the graph RIGHT (positive direction), not left. In y = f(2x), the "×2 inside" compresses the graph horizontally (divides the x-values by 2). The rule: horizontal transformations work on the input before the function acts on it, so they're the inverse of what you see. Vertical transformations work directly on the output, so they match intuition.
      </Callout>

      <GuideTable
        headers={['Transformation', 'What you see', 'Intuition']}
        rows={[
          ['f(x) + k', 'Add k to every output', 'Lifts or drops the graph — straightforward'],
          ['f(x + h)', 'Replace x with (x + h)', 'Shifts LEFT h (because (x + h) = c when x = c − h)'],
          ['f(x − h)', 'Replace x with (x − h)', 'Shifts RIGHT h — the OPPOSITE of the sign'],
          ['a · f(x)', 'Multiply every output by a', 'Stretches vertically — straightforward'],
          ['f(bx)', 'Replace x with bx', 'Compresses horizontally by factor b — OPPOSITE intuition'],
          ['−f(x)', 'Negate every output', 'Reflects over the x-axis'],
          ['f(−x)', 'Negate every input', 'Reflects over the y-axis'],
        ]}
      />

      <Callout kind="make-it-stick">
        Build a transformation checklist for every graphing problem: (1) Identify the parent function. (2) Find h and k from the form a · f(b(x − h)) + k. (3) Apply h (horizontal shift) and k (vertical shift) to the key points of the parent. (4) Apply a (vertical scale/flip) to those shifted points. (5) Apply b (horizontal scale/flip). This order guarantees you don't miss a transformation.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Complex Numbers
// ─────────────────────────────────────────────────────────────────────
function Section3Complex() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Why We Need Complex Numbers</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Real numbers cannot satisfy x² = −1 — no real number squared gives a negative result. For centuries,
        mathematicians dismissed equations with negative discriminants as "impossible." Then, in the 16th
        century, Gerolamo Cardano realized that by allowing √(−1) as a new kind of number, entire systems
        of equations that had no solution suddenly acquired solutions. The key insight: just because a number
        doesn't exist on the familiar number line doesn't mean it can't be useful.
      </Typography>

      <Analogy title="Inventing i is like inventing negative numbers">
        When someone first proposed negative numbers, the objection was obvious: "How can you have negative
        three apples?" Yet negatives turned out essential for describing debt, temperature below freezing,
        and direction. Complex numbers are the same idea one level deeper. When we ask "what squares to −1?"
        the real number line says "impossible." So we invent a new kind of number — i — and see where the
        logic leads. It leads to electrical engineering, quantum mechanics, signal processing, and fractal
        geometry. The "impossible" turned out to be everywhere.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Imaginary Unit and Complex Form</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The imaginary unit <strong>i</strong> is defined by <strong>i² = −1</strong>. A complex number has the form
        <strong> a + bi</strong> where a is the real part and b is the imaginary part. When b = 0 you have a
        real number; when a = 0 you have a pure imaginary number. Real numbers are a subset of complex numbers,
        not a separate system.
      </Typography>

      <Callout kind="why-it-matters">
        "Imaginary" is a misleading historical name. Complex numbers are no less "real" than negative numbers.
        They are essential in AC circuit analysis (impedance is complex), quantum mechanics (the Schrödinger
        equation uses complex amplitudes), control systems engineering, and computer graphics (2D rotations
        are multiplication by complex numbers). Every time you use a smartphone, you benefit from algorithms
        built on complex arithmetic.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Powers of i — A Four-Cycle</Typography>
      <GuideTable
        headers={['Power', 'Value', 'Remainder when divided by 4', 'Quick test']}
        rows={[
          ['i¹', 'i', '1', 'Exponent mod 4 = 1'],
          ['i²', '−1', '2', 'Exponent mod 4 = 2'],
          ['i³', '−i', '3', 'Exponent mod 4 = 3'],
          ['i⁴', '1', '0', 'Exponent mod 4 = 0'],
          ['i⁵', 'i', '1', 'Same as i¹ — cycle restarts every 4 steps'],
          ['i²³', '−i', '3', '23 ÷ 4 = 5 remainder 3 → i³ = −i'],
          ['i¹⁰⁰', '1', '0', '100 ÷ 4 = 25 remainder 0 → i⁴ = 1'],
          ['i⁴⁷', '−i', '3', '47 ÷ 4 = 11 remainder 3 → i³ = −i'],
        ]}
      />

      <Callout kind="make-it-stick">
        To simplify iⁿ: divide the exponent by 4 and look at the remainder. Remainder 1 → i. Remainder 2 → −1.
        Remainder 3 → −i. Remainder 0 → 1. This cycle never changes. Memorize these four values and you can
        simplify any power of i in seconds.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Arithmetic with Complex Numbers</Typography>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>Addition and Subtraction — combine real parts and imaginary parts separately</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        (3 + 2i) + (5 − 4i) = (3 + 5) + (2 − 4)i = 8 − 2i<br />
        (7 − i) − (3 + 6i) = (7 − 3) + (−1 − 6)i = 4 − 7i
      </Box>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>Multiplication — FOIL, then replace i² = −1</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        (2 + 3i)(1 − 4i)<br />
        {'= 2·1 + 2·(−4i) + 3i·1 + 3i·(−4i)'}<br />
        {'= 2 − 8i + 3i − 12i²'}<br />
        {'= 2 − 8i + 3i − 12(−1)       ← replace i² with −1'}<br />
        {'= 2 + 12 + (−8 + 3)i'}<br />
        {'= 14 − 5i'}
      </Box>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>Division — multiply numerator and denominator by the conjugate</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        {'(3 + i) / (2 − i)    ← conjugate of denominator is (2 + i)'}<br />
        {'= (3 + i)(2 + i) / ((2 − i)(2 + i))'}<br />
        {'= (6 + 3i + 2i + i²) / (4 − i²)'}<br />
        {'= (6 + 5i − 1) / (4 + 1)'}<br />
        {'= (5 + 5i) / 5'}<br />
        {'= 1 + i'}
      </Box>

      <Callout kind="in-plain-words">
        Why multiply by the conjugate? Because (a − bi)(a + bi) = a² − (bi)² = a² + b² — a real number with
        no i. The conjugate "rationalizes" the denominator of a complex fraction, just like multiplying by
        √2/√2 clears a radical from a denominator. The denominator becomes a real number, and you can then
        separate real and imaginary parts cleanly.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Complex Plane (Argand Diagram)</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Complex numbers can be plotted on a plane: the horizontal axis is the real axis, the vertical axis is
        the imaginary axis. The point a + bi sits at coordinates (a, b). The <strong>modulus</strong> (absolute
        value) is |a + bi| = √(a² + b²) — the straight-line distance from the origin to the point.
      </Typography>

      <MermaidDiagram chart={`graph LR
  subgraph ArgandPlane["Argand Plane (Complex Plane)"]
    O["Origin: 0 + 0i"]
    R["Real axis (horizontal) ↔"]
    I["Imaginary axis (vertical) ↕"]
    P["Point: a + bi plotted at (a, b)"]
    M["Modulus = √(a² + b²) = distance from O to P"]
    C["Conjugate of a+bi is a−bi: reflected over real axis"]
  end
  O --> R
  O --> I
  O --> P
  P --> M
  P --> C`} />

      <Analogy title="The imaginary unit i as a 90-degree rotation">
        On the real number line, multiplying by −1 is a 180-degree rotation (1 → −1). Multiplying by i is
        a 90-degree rotation: 1 → i → −1 → −i → 1. That's exactly the cycle i¹, i², i³, i⁴. This isn't
        just a pretty picture — it's why complex numbers are the natural tool for describing rotations in
        physics and engineering. The complex plane turns multiplication into rotation and stretching.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Complex Roots of Quadratics and Polynomials</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        When the discriminant b² − 4ac &lt; 0, the quadratic formula produces complex conjugate roots.
        Example: solve x² − 4x + 13 = 0.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        {'x = (4 ± √(16 − 52)) / 2'}<br />
        {'  = (4 ± √(−36)) / 2'}<br />
        {'  = (4 ± 6i) / 2'}<br />
        {'  = 2 ± 3i'}
      </Box>

      <Callout kind="connect">
        <strong>Complex Conjugate Root Theorem:</strong> if a polynomial has real coefficients and a + bi
        (with b ≠ 0) is a root, then a − bi must also be a root. Complex roots always come in conjugate pairs
        when working with real-coefficient polynomials. Consequence: a real polynomial of odd degree always has
        at least one real root. A real polynomial of even degree might have all complex roots (example: x² + 1).
        This theorem lets you build polynomials from complex roots: if 2 + 3i is a root, multiply out
        (x − (2+3i))(x − (2−3i)) = x² − 4x + 13 to get a real quadratic factor.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Fundamental Theorem of Algebra</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The <strong>Fundamental Theorem of Algebra</strong> states: every polynomial of degree n ≥ 1 with complex coefficients has exactly n roots in the complex numbers (counting multiplicity). This means a degree-4 polynomial always has exactly 4 roots — they may be real, complex, or repeated, but there are always exactly 4.
      </Typography>

      <GuideTable
        headers={['Polynomial degree', 'Total roots (with multiplicity)', 'Possible real/complex split', 'Example']}
        rows={[
          ['2', '2 roots', '2 real, or 0 real + 2 complex conjugates', 'x² − 4 = (x−2)(x+2) [2 real]; x² + 4 [0 real, 2 complex]'],
          ['3', '3 roots', '3 real, or 1 real + 2 complex conjugates', 'x³ − 8 = (x−2)(x²+2x+4) [1 real + 2 complex]'],
          ['4', '4 roots', '4 real, 2 real + 2 complex, or 0 real + 4 complex', 'x⁴ − 1 = (x²−1)(x²+1) [2 real + 2 complex]'],
          ['n (odd)', 'n roots', 'At least 1 real root guaranteed', 'Real polynomials of odd degree always cross the x-axis'],
          ['n (even)', 'n roots', 'May have 0 real roots', 'x² + 1 has no real roots at all'],
        ]}
      />

      <Callout kind="make-it-stick">
        The key consequence for Algebra 2: when you fully factor a real polynomial of degree n, you'll have exactly n linear factors over the complex numbers. Some factors will be real (giving real zeros), and any remaining factors come in conjugate pairs (giving complex zeros that are always paired). Count your roots: if you've found fewer than n, you haven't finished factoring — look for complex roots using the quadratic formula on any unfactorable quadratic factor.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Absolute Value and Modulus of Complex Numbers</Typography>
      <GuideTable
        headers={['Concept', 'Definition', 'Geometric meaning', 'Example']}
        rows={[
          ['Modulus |z|', '|a + bi| = √(a² + b²)', 'Distance from the origin to the point (a, b) in the complex plane', '|3 + 4i| = √(9 + 16) = 5'],
          ['Argument θ', 'The angle from the positive real axis to the vector z', 'Direction in the complex plane', '3 + 4i: θ = arctan(4/3) ≈ 53.1°'],
          ['Conjugate', 'a + bi → a − bi', 'Reflection of the point over the real axis', 'Conjugate of 3 + 4i is 3 − 4i'],
          ['|z|²', '(a + bi)(a − bi) = a² + b²', 'Product of a complex number with its conjugate is always real and positive', '(3 + 4i)(3 − 4i) = 9 + 16 = 25'],
        ]}
      />

      <Callout kind="why-it-matters">
        The modulus |z| behaves like absolute value for real numbers — it measures "size" without direction. Key property: |z₁ · z₂| = |z₁| · |z₂|. When you multiply two complex numbers, their moduli multiply and their arguments add. This is why complex multiplication in polar form is elegant: it separates the "size scaling" from the "rotation" cleanly. AC circuit analysis exploits exactly this: impedances multiply via complex multiplication, and the modulus gives the magnitude while the argument gives the phase shift.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 4: Exponential & Logarithmic Functions
// ─────────────────────────────────────────────────────────────────────
function Section4ExpLog() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Exponential Functions</Typography>

      <Analogy title="Bacteria doubling vs. steady rainfall">
        Steady rainfall adds the same volume of water every hour — a linear process. Bacteria doubling every
        hour is completely different. In hour 1 you gain 1 bacterium, in hour 2 you gain 2, in hour 3 you
        gain 4, in hour 10 you gain 512. Each doubling produces more new bacteria than all previous doublings
        combined — because you're always multiplying the current (growing) population. That's exponential
        growth: not "plus a constant" but "times a constant." The difference between the two processes
        becomes catastrophically large over time. This is why compound interest makes the patient rich and
        why unchecked infections overwhelm hospitals.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        An exponential function has the form <strong>f(x) = a · bˣ</strong> where b &gt; 0 and b ≠ 1. The
        parameter a is the initial value (the function's value when x = 0). If b &gt; 1: exponential growth.
        If 0 &lt; b &lt; 1: exponential decay. The base b is the growth/decay factor per unit of x.
      </Typography>

      <GuideTable
        headers={['Feature', 'Exponential Growth (b > 1)', 'Exponential Decay (0 < b < 1)']}
        rows={[
          ['Domain', 'All real numbers', 'All real numbers'],
          ['Range', 'y > 0 (always positive)', 'y > 0 (always positive)'],
          ['y-intercept', 'a (the initial value)', 'a (the initial value)'],
          ['Horizontal asymptote', 'y = 0 as x → −∞', 'y = 0 as x → +∞'],
          ['Graph shape', 'Curves upward steeply', 'Curves downward, approaching but never reaching 0'],
          ['Real-world example', 'Population growth, compound interest', 'Radioactive decay, drug clearance'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Number e</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The natural base <strong>e ≈ 2.71828…</strong> arises from continuous compounding. If you compound
        $1 at 100% interest continuously for 1 year, you get exactly e dollars. More precisely:
        e = lim (n→∞) (1 + 1/n)ⁿ. The natural exponential f(x) = eˣ is its own derivative — the only
        function with this property — which makes it indispensable in calculus.
      </Typography>

      <Callout kind="why-it-matters">
        Exponential functions model any process where the rate of change is proportional to the current
        amount. Population growth (more people = more births), compound interest (more money = more
        interest earned), radioactive decay (more atoms = more decay events per second), temperature
        cooling (greater temperature difference = faster heat loss). If you see "proportional to current
        amount" in a problem, the model is exponential.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Logarithmic Functions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The logarithm answers the question: <em>to what power do I raise the base to get this number?</em>
        The defining equivalence is: <strong>logₐ(x) = y ↔ aʸ = x</strong>.
        The two most common bases: log₁₀(x) = log(x) (common log), and logₑ(x) = ln(x) (natural log).
        The logarithm is the <strong>inverse function</strong> of the exponential with the same base.
      </Typography>

      <GuideTable
        headers={['Log form', 'Equivalent exponential form', 'Read as', 'Value']}
        rows={[
          ['log₂(8) = 3', '2³ = 8', '"Log base 2 of 8 equals 3"', 'Because 2 to the 3rd is 8'],
          ['log₁₀(1000) = 3', '10³ = 1000', '"Log of 1000 equals 3"', 'Because 10³ = 1000'],
          ['log₅(1) = 0', '5⁰ = 1', '"Log base 5 of 1 equals 0"', 'Because anything to the 0 is 1'],
          ['log₃(1/9) = −2', '3⁻² = 1/9', '"Log base 3 of one-ninth is −2"', 'Negative exponent → fraction'],
          ['ln(e²) = 2', 'e² = e²', '"Natural log of e-squared is 2"', 'Inverse undoes the function'],
          ['log₇(7) = 1', '7¹ = 7', '"Log base 7 of 7 equals 1"', 'logₐ(a) = 1 always'],
        ]}
      />

      <Analogy title="Logarithms as the undo button for exponentiation">
        If exponentiation is the action of raising to a power, then the logarithm is the undo button. Just as
        subtraction undoes addition (7 + 3 = 10, so 10 − 3 = 7), the log undoes the exponential: 2³ = 8, so
        log₂(8) = 3. Every time you're stuck in an exponential equation and need to "peel off" the exponent,
        the logarithm is the tool. The same inverse logic applies to ln and eˣ: ln(eˣ) = x and e^(ln x) = x.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Log Laws — Derived from Exponent Laws</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every log law is the exponent law in disguise. If logₐ(M) = m and logₐ(N) = n, then aᵐ = M and
        aⁿ = N. All three log laws follow from the exponent rules applied to these substitutions.
      </Typography>

      <GuideTable
        headers={['Law name', 'Formula', 'Derivation idea', 'Example']}
        rows={[
          ['Product rule', 'log(MN) = log M + log N', 'aᵐ · aⁿ = aᵐ⁺ⁿ, so logs add', 'log(100 · 1000) = log 100 + log 1000 = 2 + 3 = 5'],
          ['Quotient rule', 'log(M/N) = log M − log N', 'aᵐ / aⁿ = aᵐ⁻ⁿ, so logs subtract', 'log(1000/10) = log 1000 − log 10 = 3 − 1 = 2'],
          ['Power rule', 'log(Mⁿ) = n · log M', '(aᵐ)ⁿ = aᵐⁿ, so exponent slides out', 'log(10⁵) = 5 · log 10 = 5 · 1 = 5'],
          ['Change of base', 'log_b(x) = log(x)/log(b)', 'Convert any base to base 10 or e', 'log₃(7) = log(7)/log(3) ≈ 1.771'],
        ]}
      />

      <Callout kind="watch-for">
        There is NO log rule for log(M + N) or log(M − N). Students frequently write log(A + B) = log A + log B —
        this is always wrong. The product rule applies to log(A · B), not log(A + B). If you see a sum or
        difference inside a log, you cannot split it. This is one of the most common errors in Algebra 2
        and it shows up on nearly every assessment.
      </Callout>

      <MermaidDiagram chart={`graph LR
  A["Exponential: aʸ = x"] <-->|"Switch form"| B["Logarithm: y = logₐ(x)"]
  A --> C["Solve: 3^x = 81"]
  C --> D["Both sides same base? 3^x = 3^4 → x = 4"]
  C --> E["Different bases: take log of both sides"]
  E --> F["x·log(3) = log(81) → x = log(81)/log(3) = 4"]
  B --> G["Solve: log₂(x+3) = 5"]
  G --> H["Rewrite in exponential form: 2^5 = x+3"]
  H --> I["32 = x+3 → x = 29. Check: x+3 = 32 > 0 ✓"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Solving Exponential and Logarithmic Equations</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Exponential equations — two cases:</strong>
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.75, fontSize: '0.92rem' } }}>
        <li><strong>Same base:</strong> rewrite both sides with matching bases, then equate exponents. Example: 4^(x+1) = 64 → 4^(x+1) = 4³ → x + 1 = 3 → x = 2.</li>
        <li><strong>Different bases:</strong> take log of both sides and apply the power rule. Example: 5^x = 12 → x · log 5 = log 12 → x = log(12)/log(5) ≈ 1.544.</li>
      </Box>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Logarithmic equations — always check for extraneous solutions:</strong> the argument of a log
        must be positive. After solving, substitute back into the original to verify no argument becomes
        zero or negative.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        {'Solve: log(x) + log(x − 3) = 1'}<br />
        {'log(x(x−3)) = 1         ← product rule'}<br />
        {'x(x−3) = 10             ← rewrite as exponential (base 10)'}<br />
        {'x² − 3x − 10 = 0'}<br />
        {'(x−5)(x+2) = 0  →  x = 5 or x = −2'}<br />
        {'Check x = −2: log(−2) undefined ← REJECT'}<br />
        {'Check x = 5: log(5) + log(2) = log(10) = 1 ✓  →  x = 5'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Real-World Application Formulas</Typography>

      <GuideTable
        headers={['Application', 'Formula', 'Variables', 'Notes']}
        rows={[
          ['Compound interest', 'A = P(1 + r/n)^(nt)', 'P = principal, r = annual rate, n = compoundings/year, t = years', 'Larger n → faster growth'],
          ['Continuous compounding', 'A = Peʳᵗ', 'P = principal, r = rate, t = time in years', 'Theoretical limit as n → ∞'],
          ['Population growth', 'P(t) = P₀ · eᵏᵗ', 'P₀ = initial population, k = growth constant', 'k > 0 growth, k < 0 decay'],
          ['Radioactive half-life', 'A(t) = A₀ · (1/2)^(t/h)', 'A₀ = initial amount, h = half-life period', 'At t = h, exactly half remains'],
          ['pH scale', 'pH = −log[H⁺]', '[H⁺] = molar concentration of hydrogen ions', 'Each unit = 10× more acidic'],
          ['Richter scale', 'M = log(I/I₀)', 'I = intensity, I₀ = reference intensity', 'M 7 is 10× stronger than M 6'],
          ['Decibels', 'dB = 10 · log(I/I₀)', 'I = sound intensity, I₀ = threshold of hearing', 'Human perception is logarithmic'],
        ]}
      />

      <Callout kind="connect">
        Notice that all the real-world log applications involve measuring quantities that span enormous ranges:
        earthquake intensities vary by a factor of a trillion, sound intensities span 10 orders of magnitude,
        hydrogen ion concentrations span 14 orders of magnitude. The logarithm is a <em>zoom tool</em> — it
        compresses extreme ranges into a manageable scale. A pH scale from 0 to 14 is vastly easier to work
        with than a concentration scale from 1 to 0.00000000000001.
      </Callout>

      <Callout kind="coachs-note">
        On any problem involving exponential or log equations, write both forms — the log form and the
        exponential form — before deciding which to work with. Often the equation looks hard in one form
        and trivial in the other. Switching between logₐ(x) = y and aʸ = x is free — it costs you zero
        work and often reveals the solution immediately.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>The Natural Base e and Natural Logarithm</Typography>

      <Analogy title="e is the universe's favorite growth rate">
        If you could design a savings account with 100% annual interest, compounding would increase the total. Compounding monthly gives more. Compounding daily, more still. Compounding every millisecond, even more — but not infinitely more. As compounding periods go to infinity, the multiplier converges exactly to e ≈ 2.71828. Euler's number e is the universal "natural" base for growth because it describes what happens when something grows continuously at a constant rate. It's not an arbitrary constant — it emerges from the fundamental limit of continuous compounding.
      </Analogy>

      <GuideTable
        headers={['Fact about e', 'Meaning']}
        rows={[
          ['e ≈ 2.71828...', 'Irrational (and transcendental) — its decimal expansion never repeats'],
          ['e = lim(1 + 1/n)ⁿ as n → ∞', 'The limit that defines e — arises from continuous compounding'],
          ['The derivative of eˣ is eˣ', 'The exponential function is its own rate of change — unique to base e. This is why e is "natural" in calculus.'],
          ['ln(x) = logₑ(x)', 'The natural logarithm is the inverse of eˣ: if eˣ = y then ln(y) = x'],
          ['eˡⁿ⁽ˣ⁾ = x and ln(eˣ) = x', 'e and ln are inverse functions — they cancel each other'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Change of Base Formula</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Most calculators only have log (base 10) and ln (base e) buttons. To evaluate a log in any other base, use the <strong>change of base formula</strong>: <strong>logₐ(x) = log(x)/log(a) = ln(x)/ln(a)</strong>. You can use any base in the denominator as long as you use the same base in both numerator and denominator.
      </Typography>
      <Box sx={{ p: 1.5, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        {'log₃(17) = log(17)/log(3) = ln(17)/ln(3) ≈ 1.2304/0.4771 ≈ 2.5789'}<br />
        {'Verify: 3^2.5789 ≈ 17 ✓'}<br /><br />
        {'log₂(100) = log(100)/log(2) = 2/0.30103 ≈ 6.644'}<br />
        {'This means 2^6.644 ≈ 100, confirming that 2⁶ = 64 and 2⁷ = 128 bracket 100.'}
      </Box>

      <Callout kind="try-this">
        To check your change-of-base answer: raise the base to your computed exponent and see if you get the original argument. If log₃(17) ≈ 2.579, then 3^2.579 should ≈ 17. A calculator verifies this instantly. This substitution check takes five seconds and catches any arithmetic mistakes in the fraction computation.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Growth vs. Decay — Recognizing the Pattern</Typography>

      <MermaidDiagram chart={`graph TD
  A["f(x) = aˣ or f(x) = a·bˣ + c"] --> B{"What is the base b?"}
  B --> C{"b > 1?"}
  C -->|Yes| D["Exponential GROWTH\\nGraph rises steeply to the right\\nHorizontal asymptote on the LEFT"]
  C -->|No| E{"0 < b < 1?"}
  E -->|Yes| F["Exponential DECAY\\nGraph falls steeply to the right\\nHorizontal asymptote on the RIGHT"]
  E -->|No| G["b < 0 or b = 0 or b = 1 → not exponential"]
  D --> H["Examples: compound interest, viral spread, population growth"]
  F --> I["Examples: radioactive decay, cooling, drug concentration"]`} />

      <GuideTable
        headers={['Scenario', 'Model', 'Key insight']}
        rows={[
          ['Population doubling every d years', 'P(t) = P₀ · 2^(t/d)', 'After d years: P(d) = P₀·2 ✓. After 2d years: P₀·4. Doublings multiply.'],
          ['Radioactive half-life h', 'A(t) = A₀ · (1/2)^(t/h)', 'After h: half remains. After 2h: a quarter. After 3h: an eighth.'],
          ['Continuous growth rate k', 'P(t) = P₀·eᵏᵗ', 'k > 0: growth; k < 0: decay. Used when rate is continuous (bacteria, money at continuous APR)'],
          ['Finding the growth rate k', 'k = ln(b) where b is the base', 'Convert: 1.05ᵗ = e^(ln(1.05)·t) = e^(0.04879t) — continuous equivalent of 5%/year'],
        ]}
      />

      <Callout kind="why-it-matters">
        The choice between discrete (bᵗ) and continuous (eᵏᵗ) models matters in real applications. Bacteria divide at discrete moments; money in a savings account accrues daily. The continuous model is the mathematical limit as compounding becomes infinitely frequent. When in doubt, both models give very close answers for moderate time scales — but for large t, small differences in rate compound into large differences in outcome.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Systems of Equations & Matrices
// ─────────────────────────────────────────────────────────────────────
function Section5Matrices() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Systems of Three Equations</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Two equations in two unknowns correspond to two lines in a plane — they can intersect at one point
        (unique solution), be parallel (no solution), or be the same line (infinite solutions). Three equations
        in three unknowns correspond to three <em>planes</em> in 3D space, and the same three outcomes are
        possible, but now the geometry is harder to visualize. The algebraic method — elimination combined
        with back-substitution — scales directly from 2×2 to 3×3.
      </Typography>

      <Analogy title="Three planes in a room — finding where they meet">
        Imagine standing inside a room. The floor, one wall, and the ceiling are three planes. In a perfect
        rectangular room they meet at exactly one corner — that's the unique solution. But if two walls are
        parallel (impossible in a room, but imagine it), they never meet — no solution. If you stacked two
        floors on top of each other (the same plane twice), every point on the floor is a solution —
        infinitely many. Three-variable systems are just this 3D geometry expressed as algebra.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Matrices — The Compact Language for Systems</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>matrix</strong> is a rectangular array of numbers with m rows and n columns (an m × n matrix).
        Any system of linear equations can be written as an augmented matrix [A | b] — the coefficient matrix
        A next to the constant vector b, separated by a vertical bar. Once in this form, you can manipulate
        rows systematically instead of rewriting equations repeatedly.
      </Typography>

      <GuideTable
        headers={['Matrix concept', 'Definition', 'Key rule']}
        rows={[
          ['Dimension (size)', 'm × n = rows × columns', 'Always state rows first, columns second'],
          ['Square matrix', 'n × n — same number of rows and columns', 'Required for determinants and inverses'],
          ['Identity matrix I', 'Square matrix with 1s on the diagonal and 0s elsewhere', 'A · I = I · A = A (like multiplying by 1)'],
          ['Zero matrix', 'All entries are 0', 'A + 0 = A (additive identity for matrices)'],
          ['Transpose Aᵀ', 'Rows and columns swapped: row i becomes column i', 'If A is m×n then Aᵀ is n×m'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Matrix Operations</Typography>

      <MermaidDiagram chart={`graph TD
  A[Matrix Operations] --> B[Addition and Subtraction]
  A --> C[Scalar Multiplication]
  A --> D[Matrix Multiplication]
  A --> E[Inverse and Determinant]
  B --> B1["Requires same dimensions\\nAdd or subtract corresponding entries"]
  C --> C1["Multiply every entry by the scalar\\nWorks for any dimensions"]
  D --> D1["Requires inner dims match: (m×n)(n×p) = m×p\\nNOT commutative: AB ≠ BA in general"]
  E --> E1["Only for square matrices\\ndet ≠ 0 → invertible, det = 0 → singular"]`} />

      <Typography sx={{ mt: 1.5, mb: 1, fontWeight: 600 }}>Matrix multiplication — a worked example</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'A = [[1, 2], [3, 4]]   B = [[5, 6], [7, 8]]'}<br />
        <br />
        {'AB = [[(1·5 + 2·7)  (1·6 + 2·8)],    = [[19, 22],'}<br />
        {'      (3·5 + 4·7)  (3·6 + 4·8)]           [43, 50]]'}<br />
        <br />
        {'Each entry (i, j) = dot product of row i of A with column j of B'}
      </Box>

      <Callout kind="watch-for">
        Matrix multiplication is NOT commutative — AB ≠ BA in general, even when both products are defined
        and have the same dimensions. This is the most important difference between matrix algebra and
        ordinary arithmetic. When setting up AX = B to solve a system, you must multiply A⁻¹ on the LEFT:
        X = A⁻¹B, not BA⁻¹.
      </Callout>

      <Analogy title="The determinant as a measure of flatness">
        The determinant of a 2×2 matrix [[a, b], [c, d]] equals ad − bc. Geometrically, it's the area of
        the parallelogram formed by the two row vectors. If det = 0, the parallelogram has collapsed to a
        line (zero area) — the two row vectors are parallel, the matrix is "flat," and there's no unique
        solution to the corresponding system. If det ≠ 0, the parallelogram has positive area, the matrix
        is full-rank, and the system has exactly one solution.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Determinants</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>2×2 determinant:</strong> det([[a, b], [c, d]]) = ad − bc. (Down-diagonal minus up-diagonal.)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>3×3 determinant (cofactor expansion along the first row):</strong>
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'det([[a, b, c], [d, e, f], [g, h, i]])'}<br />
        {'= a·det([[e, f], [h, i]]) − b·det([[d, f], [g, i]]) + c·det([[d, e], [g, h]])'}<br />
        {'= a(ei−fh) − b(di−fg) + c(dh−eg)'}
      </Box>

      <GuideTable
        headers={['Determinant value', 'What it means for the matrix', 'What it means for the system AX = B']}
        rows={[
          ['det(A) ≠ 0', 'Matrix is invertible (non-singular)', 'Unique solution: X = A⁻¹B'],
          ['det(A) = 0', 'Matrix is singular — no inverse', 'Either no solution or infinitely many — check augmented matrix'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Gaussian Elimination — Row Reduction</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Write the system as an augmented matrix, then apply elementary row operations to reach row echelon
        form (upper triangular with leading 1s), then back-substitute. The three legal operations are:
      </Typography>
      <GuideTable
        headers={['Operation', 'Notation', 'Effect']}
        rows={[
          ['Swap two rows', 'Rᵢ ↔ Rⱼ', 'Changes order only — same solution set'],
          ['Multiply a row by a nonzero constant k', 'kRᵢ → Rᵢ', 'Scales one equation — same solution set'],
          ['Add a multiple of one row to another', 'Rᵢ + kRⱼ → Rᵢ', 'Eliminates a variable from equation i'],
        ]}
      />

      <Callout kind="coachs-note">
        During row reduction, two special rows reveal special outcomes: a row of the form [0  0  0 | k] where
        k ≠ 0 represents "0 = k" — a contradiction. This means <strong>no solution</strong>. A row of the form
        [0  0  0 | 0] represents "0 = 0" — always true, meaning a free variable exists. This means
        <strong> infinitely many solutions</strong>. These two patterns are what you're watching for during
        every row reduction.
      </Callout>

      <Callout kind="connect">
        Matrix equations AX = B are solved by X = A⁻¹B when A is invertible. This is the matrix analogue of
        solving ax = b by dividing both sides by a (multiplying by 1/a). Cramer's Rule is an alternative:
        replace each column of A with the constant vector b in turn, compute the determinant, and divide
        by det(A). Cramer's Rule is elegant but slow for large systems — Gaussian elimination is usually faster.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Cramer's Rule — A Worked Example</Typography>

      <Analogy title="Cramer's Rule as solving one variable at a time using substitution boxes">
        Cramer's Rule replaces one column of the coefficient matrix with the constant vector, computes the determinant ratio, and extracts one variable. Each variable gets its own determinant computation — like solving the system once for each unknown simultaneously. It's elegant and works well for 2×2 or 3×3 by hand, though Gaussian elimination scales better to larger systems.
      </Analogy>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Solve the system: 2x + y = 5, 3x − 2y = 4 using Cramer's Rule.
      </Typography>
      <Box sx={{ p: 1.5, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2, overflowX: 'auto' }}>
        {'Coefficient matrix A = [[2, 1], [3, -2]]; constant vector b = [5, 4]'}<br />
        {'det(A) = (2)(−2) − (1)(3) = −4 − 3 = −7'}<br /><br />
        {'For x: replace column 1 with b:'}<br />
        {'  det([[5, 1], [4, -2]]) = (5)(−2) − (1)(4) = −10 − 4 = −14'}<br />
        {'  x = −14 / −7 = 2'}<br /><br />
        {'For y: replace column 2 with b:'}<br />
        {'  det([[2, 5], [3, 4]]) = (2)(4) − (5)(3) = 8 − 15 = −7'}<br />
        {'  y = −7 / −7 = 1'}<br /><br />
        {'Solution: (x, y) = (2, 1)'}<br />
        {'Verify: 2(2) + 1 = 5 ✓   3(2) − 2(1) = 4 ✓'}
      </Box>

      <Callout kind="watch-for">
        Cramer's Rule requires det(A) ≠ 0. If det(A) = 0, the system is either inconsistent (no solution) or dependent (infinitely many solutions) — you must use Gaussian elimination to determine which. Also, Cramer's Rule gives the wrong answer if you accidentally replace the wrong column. Label your matrices carefully: Aₓ has the b vector in column 1 (where x's coefficients were); A_y has b in column 2 (where y's coefficients were).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>2×2 Matrix Inverse — The Formula</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        For a 2×2 matrix A = [[a, b], [c, d]], the inverse is:
        <strong> A⁻¹ = (1/det(A)) · [[d, −b], [−c, a]]</strong> when det(A) = ad − bc ≠ 0.
      </Typography>
      <Box sx={{ p: 1.5, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'A = [[3, 1], [5, 2]]   det(A) = (3)(2)−(1)(5) = 6−5 = 1'}<br />
        {'A⁻¹ = (1/1)·[[2, -1], [-5, 3]] = [[2, -1], [-5, 3]]'}<br /><br />
        {'Verify: A·A⁻¹ = [[3,1],[5,2]]·[[2,-1],[-5,3]]'}<br />
        {'       = [[(6-5),(−3+3)],[(10-10),(−5+6)]]'}<br />
        {'       = [[1,0],[0,1]] = I ✓'}
      </Box>

      <Callout kind="in-plain-words">
        The 2×2 inverse formula has a memorable pattern: swap the diagonal elements (a and d switch places), negate the off-diagonal elements (b → −b, c → −c), then divide everything by the determinant. This formula only works for 2×2 matrices. For 3×3, use the row-reduction method (augmenting the identity and row-reducing simultaneously) or the cofactor matrix approach.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Nonlinear Systems — When Curves Intersect</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Systems of nonlinear equations have solutions wherever the graphs intersect. Unlike linear systems (always 0 or 1 or ∞ solutions), nonlinear systems can have multiple distinct solutions.
      </Typography>

      <GuideTable
        headers={['System type', 'Possible number of solutions', 'Method', 'Example']}
        rows={[
          ['Line + parabola', '0, 1, or 2', 'Substitution: solve the linear equation for one variable, substitute into the quadratic', 'y = x + 1 and y = x²'],
          ['Two parabolas', '0, 1, 2, or 4', 'Substitution or elimination — often subtract equations first', 'y = x² and y = −x² + 8'],
          ['Circle + line', '0, 1, or 2', 'Substitution: substitute the linear expression into the circle equation', 'x² + y² = 25 and y = x + 1'],
          ['Circle + parabola', '0, 1, 2, 3, or 4', 'Substitution; may require the quadratic formula on the resulting equation', 'x² + y² = 10 and y = x²'],
        ]}
      />

      <Callout kind="try-this">
        For any nonlinear system: (1) Sketch both curves roughly — it tells you how many intersections to expect and whether your algebraic answers are reasonable. (2) Use substitution when one equation is already solved for a variable. (3) Use elimination when both equations have the same degree term (e.g., both have x²). (4) Check every solution in BOTH original equations — nonlinear systems often produce extraneous solutions.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Conic Sections
// ─────────────────────────────────────────────────────────────────────
function Section6Conics() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>What Are Conic Sections?</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A conic section is the curve formed when a plane slices through a double cone (two cones touching
        point-to-point). The angle of the cut determines which of four curves you get: a circle, an ellipse,
        a parabola, or a hyperbola. These four curves have been studied for over 2,000 years and appear
        everywhere in nature and engineering — planetary orbits (ellipses), satellite dishes (paraboloids),
        navigation systems (hyperbolas), and gears (circles).
      </Typography>

      <Analogy title="A flashlight on a wall — four shadows from one beam">
        Shine a flashlight straight at a wall — you get a circle. Tilt it slightly — an ellipse. Tilt it
        until the beam is parallel to the wall's edge — a parabola (the shadow stretches to infinity on
        one end). Tilt it past that — a hyperbola (the shadow splits into two branches on opposite sides
        of the wall). Same flashlight, same cone of light, four completely different shapes depending on
        the cutting angle. That's the unifying idea behind all four conics.
      </Analogy>

      <MermaidDiagram chart={`graph TD
  A["General equation: Ax² + Bxy + Cy² + Dx + Ey + F = 0"] --> B["Compute discriminant B² − 4AC"]
  B --> C{Value of B² − 4AC}
  C -->|"< 0"| D{Are A and C equal?}
  C -->|"= 0"| E["Parabola"]
  C -->|"> 0"| F["Hyperbola"]
  D -->|Yes| G["Circle"]
  D -->|No| H["Ellipse"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Circle</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Standard form: <strong>(x − h)² + (y − k)² = r²</strong>. Center: (h, k). Radius: r.
        The center coordinates are the OPPOSITE of the signs inside the parentheses — a common source of
        sign errors. Example: (x − 3)² + (y + 2)² = 25 has center (3, −2) and radius 5.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Completing the square</strong> converts general form to standard form:
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'x² + 6x + y² − 4y = 12'}<br />
        {'(x² + 6x + 9) + (y² − 4y + 4) = 12 + 9 + 4   ← add same to both sides'}<br />
        {'(x + 3)² + (y − 2)² = 25   →  center (−3, 2), r = 5'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Parabola</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Parabolas can open in four directions. The parameter p is the signed distance from the vertex to the
        focus (and from the vertex to the directrix, in the opposite direction). Every point on a parabola
        is equidistant from the focus and the directrix.
      </Typography>
      <GuideTable
        headers={['Form', 'Opens', 'Focus', 'Directrix', 'Condition']}
        rows={[
          ['(x − h)² = 4p(y − k)', 'Up (p > 0) or Down (p < 0)', '(h, k + p)', 'y = k − p', 'Vertical axis of symmetry'],
          ['(y − k)² = 4p(x − h)', 'Right (p > 0) or Left (p < 0)', '(h + p, k)', 'x = h − p', 'Horizontal axis of symmetry'],
        ]}
      />

      <Callout kind="in-plain-words">
        The focus and directrix are what make a parabola a parabola. Every point P on the parabola satisfies
        |distance from P to focus| = |distance from P to directrix|. Satellite dishes and headlights use this
        property: place a signal source (or a light bulb) at the focus, and the parabolic shape reflects all
        the waves/light into a perfect parallel beam — or vice versa, concentrates all incoming parallel waves
        at the focus.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Ellipse</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Standard form (horizontal major axis, a &gt; b): <strong>(x − h)²/a² + (y − k)²/b² = 1</strong>.
        Center: (h, k). Semi-major axis: a (along the longer direction). Semi-minor axis: b.
        Focal distance: c, where <strong>c² = a² − b²</strong>. Eccentricity: e = c/a (0 ≤ e &lt; 1 —
        closer to 0 means rounder, closer to 1 means more elongated).
      </Typography>

      <Analogy title="An ellipse as a circle with two center points">
        A circle is defined by one center — every point on it is the same distance from that single center.
        An ellipse has two centers (called foci). The defining property is that every point on the ellipse
        has the same <em>combined</em> distance to both foci. Grab two thumbtacks (the foci), a piece of string
        (tied between the tacks with some slack), and a pencil. Pull the string taut and trace. The pencil
        traces an ellipse — because the total string length (distance to focus 1 + distance to focus 2) is
        constant. Planetary orbits are ellipses with the sun at one focus.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Hyperbola</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Standard form (opens left and right): <strong>(x − h)²/a² − (y − k)²/b² = 1</strong>.
        Standard form (opens up and down): <strong>(y − k)²/a² − (x − h)²/b² = 1</strong>.
        Focal distance: c, where <strong>c² = a² + b²</strong>. Asymptotes: y − k = ±(b/a)(x − h).
      </Typography>

      <Callout kind="watch-for">
        For ellipses: c² = a² − b² (c is the smallest — the foci are inside the ellipse). For hyperbolas:
        c² = a² + b² (c is the largest — the foci are outside the vertices). The relationship FLIPS between
        the two curves. A reliable mnemonic: the ellipse letter (E) looks round and closed — so c is small.
        The hyperbola letter (H) has branches flying outward — so c is large, outside the curve.
      </Callout>

      <GuideTable
        headers={['Conic', 'Standard form (centered at origin)', 'Key relationship', 'Identifying feature']}
        rows={[
          ['Circle', 'x² + y² = r²', 'r = radius (constant)', 'Both squared terms have equal, same-sign coefficients'],
          ['Ellipse', 'x²/a² + y²/b² = 1 (a ≠ b)', 'c² = a² − b², a > b', 'Both squared terms have unequal, same-sign coefficients; set = 1'],
          ['Parabola', 'y = ax² or x = ay²', 'Only ONE variable is squared', 'Exactly one squared term'],
          ['Hyperbola', 'x²/a² − y²/b² = 1', 'c² = a² + b²', 'Squared terms have OPPOSITE signs; set = 1'],
        ]}
      />

      <Callout kind="connect">
        Real-world conic connections: satellite dish antennas are paraboloids (3D parabolas) — the focal
        point is where the receiver sits. Earth's orbit around the sun is an ellipse (Kepler's First Law)
        with the sun at one focus. LORAN navigation used hyperbolas — the ship's position satisfies
        |distance to station 1 − distance to station 2| = constant, which is the hyperbola definition.
        Whispering galleries (like in the Capitol dome) are ellipsoidal — a whisper at one focus is
        perfectly reflected to the other focus, inaudible anywhere else.
      </Callout>

      <Callout kind="coachs-note">
        The fastest way to identify a conic from a general equation: count the squared terms. One squared
        term → parabola. Two squared terms with the same sign → circle or ellipse (equal coefficients =
        circle; unequal coefficients = ellipse). Two squared terms with opposite signs → hyperbola.
        Then complete the square to find center and size parameters.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Completing the Square to Identify Conics</Typography>

      <Analogy title="Completing the square is like packaging irregular items into standard boxes">
        A polynomial like x² + 6x + 5 is "irregularly shaped" — it's hard to see where the vertex is. Completing the square repackages it into (x + 3)² − 4, which has a clear vertex form. For conics, completing the square on both x and y repackages a messy general equation into a standard form where the center, axes, and type are immediately readable. Same quantity, better packaging.
      </Analogy>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Convert 4x² − 8x + 9y² + 36y + 4 = 0 to standard form. Identify the conic.
      </Typography>
      <Box sx={{ p: 1.5, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2, overflowX: 'auto' }}>
        {'Group and factor out leading coefficients:'}<br />
        {'4(x² − 2x) + 9(y² + 4y) = −4'}<br /><br />
        {'Complete the square for x: take half of −2 = −1, square it = 1'}<br />
        {'4(x² − 2x + 1) + 9(y² + 4y) = −4 + 4(1)'}<br /><br />
        {'Complete the square for y: take half of 4 = 2, square it = 4'}<br />
        {'4(x − 1)² + 9(y + 2)² = −4 + 4 + 36 = 36'}<br /><br />
        {'Divide by 36:'}<br />
        {'(x − 1)²/9 + (y + 2)²/4 = 1'}<br /><br />
        {'Ellipse centered at (1, −2). a² = 9 → a = 3 (horizontal). b² = 4 → b = 2 (vertical).'}<br />
        {'c² = a² − b² = 9 − 4 = 5 → c = √5. Foci at (1 ± √5, −2).'}
      </Box>

      <Callout kind="try-this">
        Completing-the-square protocol for conics: (1) Group x-terms and y-terms; move the constant to the right. (2) Factor the leading coefficient out of each group. (3) Complete the square inside each group — but add the coefficient × the square to the right side as well. (4) Write each group in squared form. (5) Divide both sides by the right-hand side to get = 1. Then identify center, a, b, c from the standard form. The most common error is forgetting to multiply the completed square by the factored-out coefficient when balancing the equation.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Eccentricity — One Number That Classifies All Conics</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The eccentricity e (not Euler's number) measures how much a conic deviates from a perfect circle. It is defined as e = c/a for ellipses and hyperbolas. For all four conics:
      </Typography>

      <GuideTable
        headers={['Conic', 'Eccentricity range', 'Intuition']}
        rows={[
          ['Circle', 'e = 0 (exactly)', 'Both foci coincide at the center; perfectly symmetric'],
          ['Ellipse', '0 < e < 1', 'The closer to 0, the rounder; the closer to 1, the more elongated (cigar-shaped)'],
          ['Parabola', 'e = 1 (exactly)', 'The "boundary" between ellipses and hyperbolas — one focus is at infinity'],
          ['Hyperbola', 'e > 1', 'The larger e, the more "open" the branches (wider-spreading curves)'],
        ]}
      />

      <Callout kind="connect">
        Earth's orbit is an ellipse with eccentricity ≈ 0.017 — nearly circular. Pluto's orbit has eccentricity ≈ 0.249 — noticeably elliptical. Comets have very high eccentricities (Halley's Comet ≈ 0.967), meaning their orbits are highly elongated. An eccentricity of exactly 1 would be a parabolic orbit — the comet would make one pass and never return. E &gt; 1 would be a hyperbolic orbit — one-time flyby, then gone forever. These are not just math curiosities: the four conic types correspond to the four possible trajectories of a body moving through a gravitational field.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: Sequences & Series
// ─────────────────────────────────────────────────────────────────────
function Section7Sequences() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Sequences: Formalizing Patterns</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A sequence is an ordered list of numbers. Each number is a <strong>term</strong>. A sequence can be
        defined by an <strong>explicit formula</strong> (giving the nth term directly in terms of n) or a
        <strong> recursive formula</strong> (giving each term in terms of previous terms). The two most
        important families are arithmetic (constant difference) and geometric (constant ratio).
      </Typography>

      <Analogy title="Arithmetic sequences as a staircase; geometric sequences as a ramp that keeps changing slope">
        An arithmetic sequence is like a staircase: every step adds the same height. 5, 8, 11, 14 — you
        climb 3 with each step. A geometric sequence is like a path on a hill where each step is a fixed
        multiple of the previous: 2, 6, 18, 54 — you multiply by 3 each time. At first the geometric path
        looks like a gentle staircase, but because each step is proportional to where you are, it quickly
        outpaces any staircase. That's why compound interest (geometric) dwarfs simple interest (arithmetic)
        over long periods.
      </Analogy>

      <MermaidDiagram chart={`graph LR
  A["Given a sequence of terms"] --> B{"Subtract consecutive terms\\nIs the difference constant?"}
  B -->|"Yes: d = a₂−a₁ = a₃−a₂"| C["Arithmetic Sequence\\naₙ = a₁ + (n−1)d"]
  B -->|No| D{"Divide consecutive terms\\nIs the ratio constant?"}
  D -->|"Yes: r = a₂/a₁ = a₃/a₂"| E["Geometric Sequence\\naₙ = a₁ · rⁿ⁻¹"]
  D -->|No| F["Neither — look for another pattern\\n(e.g. quadratic, Fibonacci, etc.)"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Arithmetic Sequences and Series</Typography>

      <GuideTable
        headers={['Formula', 'What it computes', 'Variables', 'Example']}
        rows={[
          ['aₙ = a₁ + (n−1)d', 'The nth term (explicit formula)', 'a₁ = first term, d = common difference, n = position', 'a₁=3, d=5: a₈ = 3 + 7·5 = 38'],
          ['aₙ = aₙ₋₁ + d', 'The nth term (recursive formula)', 'Each term equals the previous plus d', 'a₁=3, aₙ=aₙ₋₁+5'],
          ['Sₙ = n(a₁ + aₙ)/2', 'Sum of first n terms (need first and last)', 'n = number of terms', '1+2+…+100: S₁₀₀=100(1+100)/2=5050'],
          ['Sₙ = n[2a₁ + (n−1)d]/2', 'Sum of first n terms (need only a₁ and d)', 'Alternative formula — no need for aₙ', 'a₁=5, d=3, n=10: S₁₀=10(10+27)/2=185'],
        ]}
      />

      <Callout kind="make-it-stick">
        The sum formula Sₙ = n(a₁ + aₙ)/2 is elegant: it's n times the average of the first and last terms.
        This works because arithmetic terms increase symmetrically — term 1 and term n, term 2 and term n−1,
        etc. always pair up to the same sum. The young Gauss used this insight to sum 1 + 2 + … + 100 = 5050
        in seconds. The formula just packages that insight.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Geometric Sequences and Series</Typography>

      <GuideTable
        headers={['Formula', 'What it computes', 'Condition', 'Example']}
        rows={[
          ['aₙ = a₁ · rⁿ⁻¹', 'The nth term', 'r is the common ratio (multiply each term by r to get the next)', 'a₁=2, r=3: a₅ = 2·3⁴ = 162'],
          ['Sₙ = a₁(1 − rⁿ)/(1 − r)', 'Sum of first n terms (finite)', 'r ≠ 1', 'a₁=1, r=2, n=5: S₅=1(1−32)/(1−2)=31'],
          ['S∞ = a₁/(1 − r)', 'Sum of the INFINITE series', 'Only converges when |r| < 1', 'a₁=1, r=1/2: S∞=1/(1−1/2)=2'],
          ['Diverges', '—', 'When |r| ≥ 1, the sum grows without bound', 'a₁=1, r=2: 1+2+4+8+… → ∞'],
        ]}
      />

      <Analogy title="The infinite geometric series as forever halving a pizza slice">
        You eat half a pizza slice. Then half of what remains (a quarter). Then half of that (an eighth).
        You keep going forever. Remarkably, the total amount eaten converges to exactly 1 whole slice —
        because the formula S∞ = (1/2)/(1 − 1/2) = 1. Each step adds less and less, and the sum
        approaches a finite limit. Whenever |r| &lt; 1, an infinite geometric series converges. When |r| ≥ 1,
        the terms don't shrink — the sum blows up.
      </Analogy>

      <Callout kind="why-it-matters">
        Geometric sequences are fundamental to finance. A mortgage's monthly payment schedule is a geometric
        series. The present value of an annuity is an infinite geometric series (with the ratio being the
        discount factor 1/(1+r) where r is the interest rate). The convergence of infinite series is what
        makes all of actuarial science and financial modeling mathematically rigorous.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sigma Notation</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The capital Greek letter sigma (Σ) means "sum." The notation {'Σ_{k=m}^{n}'} f(k) means: evaluate f(k)
        for each integer k from m to n, then add all the results. The variable k is called the index;
        m is the lower bound; n is the upper bound.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        {'Σ(k=1 to 5) 2k = 2(1) + 2(2) + 2(3) + 2(4) + 2(5) = 2+4+6+8+10 = 30'}<br />
        {'Σ(k=0 to 3) 3·(1/2)ᵏ = 3 + 3/2 + 3/4 + 3/8 = 45/8  (geometric with a₁=3, r=1/2, 4 terms)'}
      </Box>

      <Callout kind="in-plain-words">
        Reading sigma notation: "the sum, as k goes from m to n, of f(k)." The index k is a dummy
        variable — you could call it i, j, or anything. The lower and upper bounds tell you where to start
        and stop. Just substitute each integer value of k into f(k) and add the results. On exams, you're
        often asked to either expand sigma notation into a list, or collapse a list into sigma notation.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Binomial Theorem and Pascal's Triangle</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The Binomial Theorem gives a formula for expanding (a + b)ⁿ without repeated multiplication:
        <strong>{' (a + b)ⁿ = Σ_{k=0}^{n} C(n, k) · aⁿ⁻ᵏ · bᵏ'}</strong>. The coefficients C(n, k) = n!/(k!(n−k)!)
        are the binomial coefficients, which form the rows of Pascal's Triangle.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Pascal\'s Triangle rows (n = 0 through 5):'}<br />
        {'n=0:   1'}<br />
        {'n=1:   1  1'}<br />
        {'n=2:   1  2  1'}<br />
        {'n=3:   1  3  3  1'}<br />
        {'n=4:   1  4  6  4  1'}<br />
        {'n=5:   1  5  10 10  5  1'}<br />
        <br />
        {'(a+b)⁴ = 1·a⁴ + 4·a³b + 6·a²b² + 4·ab³ + 1·b⁴'}
      </Box>
      <Typography sx={{ mt: 1.5, mb: 1, lineHeight: 1.75 }}>
        <strong>Finding a specific term</strong>: the (k+1)th term of (a + b)ⁿ is C(n, k) · aⁿ⁻ᵏ · bᵏ.
        Example: find the 4th term of (2x − 3)⁵. The 4th term uses k = 3:
        C(5, 3) · (2x)² · (−3)³ = 10 · 4x² · (−27) = −1080x².
      </Typography>

      <Analogy title="The Binomial Theorem as organized combinatorics">
        When you expand (a + b)³ by multiplying (a+b)(a+b)(a+b), you choose either a or b from each factor.
        The term a²b appears whenever you chose "a" from two of the three factors and "b" from one —
        exactly C(3, 1) = 3 ways. So the coefficient of a²b is 3. The Binomial Theorem is just this
        combinatorial counting made systematic for any power n. C(n, k) counts the number of ways to choose
        b from exactly k of the n factors.
      </Analogy>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 8: Statistics & Probability
// ─────────────────────────────────────────────────────────────────────
function Section8Stats() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Normal Distribution and the Empirical Rule</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The normal distribution is the symmetric, bell-shaped curve that appears whenever a quantity is
        determined by many small independent factors. Height, exam scores, measurement errors, and countless
        biological measurements follow approximately normal distributions. The curve is completely described
        by two parameters: the mean μ (center) and the standard deviation σ (spread).
      </Typography>

      <GuideTable
        headers={['Range', 'Approx. % of data', 'Example: IQ with μ=100, σ=15', 'Interpretation']}
        rows={[
          ['μ ± 1σ', '≈ 68%', 'IQ from 85 to 115', 'About 2 out of 3 people'],
          ['μ ± 2σ', '≈ 95%', 'IQ from 70 to 130', 'About 19 out of 20 people'],
          ['μ ± 3σ', '≈ 99.7%', 'IQ from 55 to 145', 'Nearly everyone — only 3 in 1000 outside'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Z-Scores</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A <strong>z-score</strong> converts a raw value x to the number of standard deviations it sits from
        the mean: <strong>z = (x − μ) / σ</strong>. Positive z: above the mean. Negative z: below the mean.
        z = 0: exactly at the mean. A z-score of 2.5 means "2.5 standard deviations above average" — a
        statement that applies regardless of the original units.
      </Typography>

      <Callout kind="in-plain-words">
        Z-scores are a universal translation. A test score of 78 in a class with mean 70 and standard
        deviation 8 is the same relative performance as a test score of 54 in a class with mean 50 and
        standard deviation 4 — both have z = 1.0. Once converted to z-scores, you can compare performances
        across different scales, different classes, different measurements. That's the power of standardizing.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Counting Principles</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Counting the number of ways events can occur is the foundation of probability. Three main tools:
      </Typography>

      <Analogy title="Counting as organized list-making at scale">
        When you need to count how many 3-digit passwords can be made from digits 1–9 (no repeats), you could
        list them all — that's 504 entries. Or you could reason: 9 choices for the first digit, then 8
        remaining for the second, then 7 for the third. The Multiplication Principle gives 9 × 8 × 7 = 504
        in three seconds. Counting formulas are just systematic ways to apply this multiplicative reasoning
        when the list would be too long to write out.
      </Analogy>

      <GuideTable
        headers={['Concept', 'Formula', 'When to use it', 'Example']}
        rows={[
          ['Multiplication Principle', 'n₁ × n₂ × … × nₖ', 'Independent choices at each stage (repetition allowed)', '3 shirt colors × 4 pants = 12 outfits'],
          ['Permutation ₙPᵣ', 'n! / (n − r)!', 'Order MATTERS; choosing r from n without repetition', 'Top-3 finishers from 8 runners: ₈P₃ = 336'],
          ['Combination ₙCᵣ', 'n! / (r!(n − r)!)', 'Order DOES NOT matter; choosing r from n without repetition', 'Committee of 3 from 8 people: ₈C₃ = 56'],
        ]}
      />

      <Callout kind="connect">
        Permutation or combination? Ask: "If I swap two chosen items, do I get a different outcome?"
        Picking Alice, Bob, Carol for a committee — swap them all you want, it's the same committee: use
        Combination. Ranking Alice 1st, Bob 2nd, Carol 3rd for medals — swapping changes who gets gold:
        use Permutation. "P stands for Position" — if position matters, use Permutation.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Probability Rules</Typography>

      <MermaidDiagram chart={`graph TD
  A["Probability problem"] --> B{"One event or two?"}
  B -->|"One event A"| C{"Find P(not A)?"}
  C -->|Yes| D["Complement: P(Aᶜ) = 1 − P(A)"]
  C -->|No| E["P(A) = favorable outcomes / total outcomes"]
  B -->|"Two events A and B"| F{"Are they mutually exclusive?"}
  F -->|"Yes: A∩B = ∅"| G["P(A∪B) = P(A) + P(B)"]
  F -->|No| H["P(A∪B) = P(A) + P(B) − P(A∩B)"]
  H --> I{"Are A and B independent?"}
  I -->|Yes| J["P(A∩B) = P(A)·P(B)"]
  I -->|No| K["P(A∩B) = P(A)·P(B|A)  ← conditional"]`} />

      <GuideTable
        headers={['Rule', 'Formula', 'When it applies', 'Key condition to check']}
        rows={[
          ['Complement rule', 'P(Aᶜ) = 1 − P(A)', 'Always', '"At least one" problems always use complement'],
          ['Addition — mutually exclusive', 'P(A∪B) = P(A) + P(B)', 'A and B cannot both occur', 'Drawing a heart OR a spade (not both possible)'],
          ['Addition — general', 'P(A∪B) = P(A) + P(B) − P(A∩B)', 'A and B can overlap', 'Drawing a heart OR a face card (overlap: heart face cards)'],
          ['Multiplication — independent', 'P(A∩B) = P(A) · P(B)', 'A does not affect B', 'Flipping a coin AND rolling a die'],
          ['Multiplication — dependent', 'P(A∩B) = P(A) · P(B|A)', 'A affects B', 'Drawing two cards WITHOUT replacement'],
          ['Conditional probability', 'P(A|B) = P(A∩B) / P(B)', '"Given B happened, find P(A)"', 'The sample space shrinks to B'],
        ]}
      />

      <Callout kind="watch-for">
        Independent vs. mutually exclusive are NOT the same thing. Mutually exclusive events (A∩B = ∅) are
        actually DEPENDENT — knowing A occurred means B definitely didn't. Two events can be independent
        (knowing one gives no info about the other) while both having nonzero probability of occurring
        together. Don't confuse these two concepts — they appear in separate rules.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Expected Value</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The expected value of a discrete random variable X is: <strong>E(X) = Σ x · P(x)</strong> — the sum
        of each outcome value multiplied by its probability. Expected value is the long-run average if the
        experiment is repeated infinitely many times.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        {'Example: You pay $2 to roll a die. You win $10 if you roll a 6, otherwise $0.'}<br />
        {'Net gain if 6: 10 − 2 = $8.  Net gain otherwise: 0 − 2 = −$2.'}<br />
        {'E(X) = 8·(1/6) + (−2)·(5/6) = 8/6 − 10/6 = −2/6 ≈ −$0.33 per play'}<br />
        {'The casino expects to keep 33 cents per play on average — a losing game for you.'}
      </Box>

      <Analogy title="Expected value as the casino's business model">
        Every casino game is engineered so the expected value for the player is slightly negative. For
        individual games this means sometimes winning, sometimes losing — but over millions of plays the
        law of large numbers guarantees the casino collects its share. Expected value doesn't predict
        individual outcomes; it predicts the long-run average. Insurance companies, lotteries, and investment
        funds all run on expected value calculations. Understanding E(X) is understanding how those
        industries actually work.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Two-Way Tables and Conditional Probability</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A two-way (contingency) table organizes data from two categorical variables. Rows represent one
        variable, columns the other, cells contain counts or frequencies. Marginal totals are the row and
        column sums. Joint frequencies are individual cell counts. Conditional frequencies answer questions
        like "given that a person is female, what fraction prefers jazz?"
      </Typography>

      <Callout kind="coachs-note">
        Two-way tables make conditional probability visual. To find P(A | B), focus only on the B column (or
        row) — that's your new sample space. Divide the A∩B cell by the B total. Practice reading tables
        both horizontally (row conditional) and vertically (column conditional). Exam questions often give
        you a table and ask for several different conditional probabilities — be clear which total you're
        dividing by each time.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Fundamental Counting Principle — Deeper Applications</Typography>

      <GuideTable
        headers={['Scenario', 'Setup', 'Calculation', 'Answer']}
        rows={[
          ['How many 5-letter strings using letters A–Z, no repeats?', '26 choices for letter 1, 25 for 2, 24 for 3, 23 for 4, 22 for 5', '26 × 25 × 24 × 23 × 22', '7,893,600 strings'],
          ['How many ways to arrange 7 books on a shelf?', '7 choices for position 1, 6 for 2, ..., 1 for 7', '7! = 7 × 6 × 5 × 4 × 3 × 2 × 1', '5,040 arrangements'],
          ['How many 4-digit PINs with no repeated digits?', '10 choices for first digit, 9 for second, 8, 7', '10 × 9 × 8 × 7 = ₁₀P₄', '5,040 PINs'],
          ['In how many ways can 3 officers (P, VP, Sec) be chosen from 12 members?', 'Order matters — President ≠ VP', '₁₂P₃ = 12!/9! = 12 × 11 × 10', '1,320 ways'],
          ['How many 5-card hands from a 52-card deck?', 'Order doesn\'t matter (hand is a hand)', '₅₂C₅ = 52!/(5!·47!)', '2,598,960 hands'],
        ]}
      />

      <Callout kind="make-it-stick">
        The critical question for every counting problem: "Does order matter?" If swapping two items creates a different outcome — use Permutation (ₙPᵣ). If swapping creates the same outcome — use Combination (ₙCᵣ). Permutation = Position matters. Practice this question until it becomes automatic: "If I swap Alice and Bob in my arrangement, do I get something new or the same thing?"
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Binomial Probability Distribution</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The <strong>Binomial distribution</strong> models the number of successes in n independent trials where each trial has exactly two outcomes (success/failure) and the probability of success p is constant. The formula for exactly k successes is:
        <strong> P(X = k) = C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ</strong>.
      </Typography>

      <Analogy title="Binomial probability as counting weighted paths through a tree">
        Imagine a tree diagram for 5 coin flips. Each flip branches into H (probability 0.5) or T (probability 0.5). Each complete path — say HHTHT — has probability (0.5)⁵. How many paths have exactly 3 Hs? That's C(5, 3) = 10 paths. So P(X = 3) = 10 × (0.5)³ × (0.5)² = 10/32. The binomial formula is just this path-counting logic: C(n, k) counts the paths with exactly k successes, and pᵏ(1−p)ⁿ⁻ᵏ is the probability of each such path.
      </Analogy>

      <GuideTable
        headers={['Problem type', 'Formula', 'Example: P = 0.3, n = 5']}
        rows={[
          ['Exactly k successes', 'C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ', 'P(X=2) = C(5,2)·0.3²·0.7³ = 10·0.09·0.343 ≈ 0.309'],
          ['At most k successes', 'P(X≤k) = Σ P(X=j) for j=0 to k', 'P(X≤1) = P(X=0) + P(X=1) ≈ 0.168 + 0.360 = 0.528'],
          ['At least k successes', 'P(X≥k) = 1 − P(X≤k−1)', 'P(X≥3) = 1 − P(X≤2) ≈ 1 − 0.837 = 0.163'],
          ['Mean of binomial', 'μ = np', 'μ = 5·0.3 = 1.5 successes expected'],
          ['Standard deviation', 'σ = √(np(1−p))', 'σ = √(5·0.3·0.7) = √1.05 ≈ 1.025'],
        ]}
      />

      <Callout kind="connect">
        The mean of the binomial (μ = np) makes intuitive sense: if each trial has a 30% chance of success and you run 5 trials, you expect 1.5 successes on average. The standard deviation measures how much the count varies around that mean. For probability word problems, "at least one" is almost always solved via complement: P(at least 1 success) = 1 − P(0 successes) = 1 − (1−p)ⁿ. This avoids summing many terms.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Geometric Probability and Area Models</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Geometric probability computes the probability of a random event using areas (or lengths or volumes) rather than counting outcomes. When outcomes are continuous (a random point, a random time), we cannot enumerate them — instead:
        <strong> P(event) = (favorable area) / (total area)</strong>.
      </Typography>

      <GuideTable
        headers={['Problem type', 'Setup', 'Key formula']}
        rows={[
          ['Point in a region', 'A point is chosen at random inside a large shape. What is the probability it falls in a smaller sub-region?', 'P = area of sub-region / total area'],
          ['Random time overlap', 'Two people each arrive at a random time in a 60-minute window. What is the probability they overlap?', 'Draw a 60×60 square; the "overlap" region is an area — compute its fraction of the total square'],
          ['Random chord length', 'A chord is drawn at random on a circle. What is the probability it is longer than the radius?', 'Depends on exactly how "random" is defined — different models give different answers (Bertrand\'s paradox illustrates this)'],
        ]}
      />

      <Callout kind="why-it-matters">
        Geometric probability connects algebra (areas of circles, squares, triangles) to probability concepts. It appears frequently in standardized math competitions and is a bridge to integral calculus, where continuous probability is computed using areas under curves. The key insight: in a continuous probability model, probability IS area (scaled by the total area). This reframes many counting problems into geometry problems.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section: Exam-Day Strategy
// ─────────────────────────────────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Algebra 2 Exam-Day Strategy</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Algebra 2 assessments test a wide range of topics in a single sitting. The skills below apply to
        every Algebra 2 exam — in-class tests, semester finals, and any college-placement exam that covers
        this material. Use them to maximize partial credit, catch errors before they cost you, and manage
        your time across a long problem set.
      </Typography>

      <Callout kind="coachs-note">
        Show all work — even on multiple-choice questions. Writing intermediate steps serves two purposes:
        it catches sign errors and arithmetic mistakes before you commit to an answer, and it makes your
        reasoning visible. On free-response questions this earns partial credit. On multiple-choice, it
        gives you a paper trail to revisit if you're unsure. Solving in your head and circling an answer
        is the riskiest approach for Algebra 2.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Identify the Function Family First</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Before doing any algebra, classify the equation or graph. Polynomial? Rational? Exponential?
        Logarithmic? Conic? Each family has its own standard strategies — applying the wrong one wastes
        time and usually produces a wrong answer. Look for: exponents with variable bases (exponential),
        variables in denominators (rational), two squared terms (conic), logarithm notation (log equation).
        Classification takes five seconds and saves five minutes.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Factor Before You Simplify Rational Expressions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Never cancel terms without factoring first. The expression (x² − 4)/(x − 2) cannot be simplified
        by canceling x² and x. Instead, factor: (x − 2)(x + 2)/(x − 2) = x + 2 (with a hole at x = 2).
        Canceling terms that aren't factors is one of the most catastrophic algebraic errors — it produces
        an entirely different function. Always factor completely first, then cancel common factors.
      </Typography>

      <Callout kind="watch-for">
        The most frequent Algebra 2 errors — memorize these and actively guard against them:
        (1) Replacing i² with +1 instead of −1 mid-computation. (2) Applying log rules to sums: log(A+B) ≠ log A + log B.
        (3) Flipping even/odd multiplicity behavior at zeros. (4) Using AB = BA for matrix multiplication.
        (5) Writing r² instead of r² (the circle equation uses r² on the right — make sure your value of r is the radius, not r²).
        (6) Forgetting to check for extraneous solutions in logarithmic and rational equations.
        (7) Misidentifying which conic corresponds to which equation form.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Check Answers by Substitution</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For every equation you solve, substitute your answer back into the original equation before moving
        on. This is especially critical for: logarithmic equations (extraneous solutions from taking logs
        of negatives), rational equations (extraneous solutions from undefined denominators), and radical
        equations (extraneous solutions from squaring both sides). The substitution check costs 30 seconds
        and prevents an entire problem from being wrong.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Domain Restrictions Are Non-Negotiable</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Rational functions: state domain restrictions explicitly. Logarithmic functions: the argument must
        be strictly positive (log(0) is undefined; log of a negative is undefined in the reals). Radical
        functions: the radicand must be non-negative (for even roots). On any problem involving these
        function families, write down the domain at the start — then every answer you produce will
        automatically respect it.
      </Typography>

      <Callout kind="make-it-stick">
        On conic problems: check the ± between squared terms first (same sign = circle or ellipse;
        opposite signs = hyperbola; one squared = parabola). On sequence problems: test whether the
        difference is constant (arithmetic) or the ratio is constant (geometric) before applying any
        formula. On probability problems: draw a Venn diagram or a two-way table before computing.
        Thirty seconds of setup prevents five minutes of wrong-formula work.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Strategic Use of Answer Choices</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        On multiple-choice exams, the answer choices contain information. If all options are integers,
        a messy decimal is a signal you made an error. If options are in vertex form (x − h)² + k,
        completing the square is the indicated method. If options span a wide range (e.g., −100, −2, 2, 100),
        elimination by reasonableness can rule out extreme options quickly. Let the answer format guide
        your approach when you're uncertain how to start.
      </Typography>

      <Callout kind="connect">
        Every strategy above reduces to one meta-habit: slow down during setup and speed up during execution.
        Algebra 2 errors almost never happen in the middle of a well-set-up computation — they happen at the
        start, when students misidentify the function family, skip the domain check, or forget to factor before
        simplifying. The math itself is fast once the setup is correct. Invest the extra twenty seconds in
        reading and classifying. It pays off every time.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Key Formulas Reference</Typography>

      <GuideTable
        headers={['Topic', 'Formula / Rule', 'When to use it']}
        rows={[
          ['Quadratic formula', 'x = (−b ± √(b²−4ac)) / 2a', 'Any quadratic ax² + bx + c = 0 that doesn\'t factor cleanly'],
          ['Discriminant', 'b² − 4ac: > 0 → 2 real; = 0 → 1 real; < 0 → 2 complex', 'Before deciding HOW to solve a quadratic'],
          ['Log change of base', 'logₐ(x) = log(x)/log(a)', 'Evaluating logs with a calculator that only has log or ln'],
          ['Compound interest', 'A = P(1 + r/n)^(nt)', 'Finite compounding periods; n = periods per year'],
          ['Continuous compounding', 'A = Peʳᵗ', 'Continuous growth/decay; when n → ∞'],
          ['Geometric series (finite)', 'Sₙ = a₁(1 − rⁿ)/(1 − r)', 'Sum of first n terms of a geometric sequence (r ≠ 1)'],
          ['Geometric series (infinite)', 'S∞ = a₁/(1 − r)', 'Only when |r| < 1; otherwise diverges'],
          ['Binomial theorem k+1 term', 'C(n,k) · aⁿ⁻ᵏ · bᵏ', 'Finding a specific term in (a + b)ⁿ without full expansion'],
          ['Complex modulus', '|a + bi| = √(a² + b²)', 'Distance from origin in the complex plane; "size" of a complex number'],
          ['Z-score', 'z = (x − μ) / σ', 'Standardizing a value for use with the normal distribution or 68-95-99.7 rule'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Glossary Section
// ─────────────────────────────────────────────────────────────────────
function SectionGlossary() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const ACCENT = isDark ? '#C77AA0' : '#5C2A4A';
  const BORDER = isDark ? '#3A3B45' : '#DDCBA8';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';

  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Algebra 2 Glossary</Typography>
      <Stack spacing={1}>
        {glossary.map(entry => (
          <Paper
            key={entry.term}
            elevation={0}
            sx={{ p: 1.5, border: `1px solid ${BORDER}`, borderRadius: 1.5 }}
          >
            <Typography sx={{ fontWeight: 700, color: ACCENT, fontSize: '0.95rem', mb: 0.25 }}>
              {entry.term}
            </Typography>
            <Typography sx={{ color: TEXT_PRI, fontSize: '0.88rem', lineHeight: 1.6 }}>
              {entry.definition}
            </Typography>
          </Paper>
        ))}
      </Stack>
      <Typography variant="caption" sx={{ color: TEXT_SEC, display: 'block', mt: 2 }}>
        {glossary.length} terms · Use Ctrl+K to search all glossary entries, flashcards, and questions.
      </Typography>
    </Box>
  );
}
