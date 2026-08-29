// PRECALC Study Guide — accordion-based layout for SC Pre-Calculus (11th grade).
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

const READING_PROGRESS_KEY = 'exam-prep-reading:PRECALC';
const COMPLETION_KEY = 'exam-prep-completed:PRECALC';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:PRECALC';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Functions & Transformations',
  s3: 'Polynomial & Rational Functions',
  s4: 'Exponential & Logarithmic Functions',
  s5: 'Trigonometric Functions',
  s6: 'Analytic Trigonometry',
  s7: 'Vectors & Parametrics',
  s8: 'Sequences & Series',
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
  { id: 's1',      num: '1',  title: 'The Big Picture',                     icon: '🗺️' },
  { id: 's2',      num: '2',  title: 'Functions & Transformations',         icon: '🔄' },
  { id: 's3',      num: '3',  title: 'Polynomial & Rational Functions',     icon: '📐' },
  { id: 's4',      num: '4',  title: 'Exponential & Logarithmic Functions', icon: '📈' },
  { id: 's5',      num: '5',  title: 'Trigonometric Functions',             icon: '🌀' },
  { id: 's6',      num: '6',  title: 'Analytic Trigonometry',               icon: '🔢' },
  { id: 's7',      num: '7',  title: 'Vectors & Parametric Equations',      icon: '➡️' },
  { id: 's8',      num: '8',  title: 'Sequences & Series',                  icon: '∞'  },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',                   icon: '🎯' },
  { id: 's-gloss', num: '📚', title: 'Glossary',                            icon: '📚' },
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
    case 's2':      return <Section2Functions />;
    case 's3':      return <Section3Polynomials />;
    case 's4':      return <Section4ExpLog />;
    case 's5':      return <Section5Trig />;
    case 's6':      return <Section6AnalyticTrig />;
    case 's7':      return <Section7Vectors />;
    case 's8':      return <Section8Sequences />;
    case 's-strat': return <SectionStrategy />;
    case 's-gloss': return <SectionGlossary />;
    default:        return null;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Section 1: Big Picture
// ─────────────────────────────────────────────────────────────────────
function Section1BigPicture() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>What Is Pre-Calculus?</Typography>

      <Analogy title="Building the on-ramp before the highway">
        If Algebra 2 was learning to drive on a highway, Pre-Calculus is learning all the on-ramps — the curved, angled
        approaches that get you from flat surface roads onto the fast lane of Calculus. You're not on the highway yet,
        but every concept here (limits, rates of change, infinite sums, trigonometric waves) is a ramp you'll need the
        moment you get there. Skip any ramp and the merge will be brutal.
      </Analogy>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        Pre-Calculus bridges Algebra 2 and Calculus. It deepens your understanding of functions — adding trigonometry,
        vectors, parametric curves, and a first look at limits and sequences. Every topic is chosen because Calculus needs
        it: derivatives need function transformations and limits; integrals need areas under curves that often involve
        trig; differential equations need exponential and logarithmic models.
      </Typography>

      <Callout kind="why-it-matters">
        Pre-Calculus is not just one more math class. It is the master key for STEM fields: physics uses trig and
        vectors constantly; engineering uses exponential models and series; computer science uses logarithms for
        algorithm analysis; economics uses limit arguments. Even if you never take Calculus, Pre-Calc pays dividends
        in reasoning, modeling, and quantitative thinking.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Seven Topics — and Why They Connect</Typography>

      <GuideTable
        headers={['Topic', 'Core idea', 'Calculus connection']}
        rows={[
          ['Functions & Transformations', 'Manipulating and composing input-output machines', 'Derivatives operate on functions; you must read transformations instantly'],
          ['Polynomial & Rational Functions', 'Curves with multiple bends, holes, and asymptotes', 'Limits of rational functions; polynomial approximation (Taylor series)'],
          ['Exponential & Logarithmic Functions', 'Growth/decay and their inverses', 'Derivatives of eˣ and ln(x) are the two most important in Calculus'],
          ['Trigonometric Functions', 'Unit circle, waves, periodic behavior', 'Derivatives of sin and cos; all of physics and engineering'],
          ['Analytic Trigonometry', 'Identities, equations, and inverse trig', 'Trig substitution in integrals; solving differential equations'],
          ['Vectors & Parametric Equations', 'Quantities with magnitude and direction; paths over time', 'Multi-variable Calculus; physics motion equations'],
          ['Sequences & Series', 'Ordered lists and their sums, limits of patterns', 'Infinite series; Taylor series; integral approximation'],
        ]}
      />

      <Callout kind="coachs-note">
        The single most important skill in Pre-Calculus is reading a function fluently: given f(x) = 3sin(2x − π/4) + 1,
        you should immediately know the amplitude (3), period (π), phase shift (π/8 right), and vertical shift (up 1).
        That kind of "function fluency" saves minutes on every test and is the foundation of Calculus thinking.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>How to Use This Guide</Typography>
      <Typography sx={{ lineHeight: 1.75 }}>
        Each section below covers one topic area. Read the analogy first — it anchors the abstract concept in
        something familiar. Then work through the tables and examples. At the end of each section, use the Quick Check
        questions to test recall before moving on. Mark a section complete only when you can explain the key idea
        in your own words without looking.
      </Typography>

      <Callout kind="make-it-stick">
        Before each section, write a one-sentence prediction: "I think this section is about ___." After reading,
        compare your prediction to reality. The gap between prediction and outcome is where learning happens.
        This metacognitive habit is the single highest-leverage study technique backed by research.
      </Callout>

      <GuideTable
        title="Algebra 2 Prerequisites — You Should Know These Cold"
        headers={['Concept', 'What to recall', 'Why Pre-Calc needs it']}
        rows={[
          ['Quadratic formula', 'x = [−b ± √(b²−4ac)] / 2a', 'You\'ll use this to solve for zeros of polynomials and to factor irreducible quadratics'],
          ['Completing the square', 'x² + bx = (x + b/2)² − (b/2)²', 'Converts conic sections to standard form; needed for circles, parabolas, ellipses'],
          ['Exponent rules', 'xᵃ·xᵇ = xᵃ⁺ᵇ; (xᵃ)ᵇ = xᵃᵇ; x⁻ⁿ = 1/xⁿ; x^(1/n) = ⁿ√x', 'Exponential functions and log transformations build on these constantly'],
          ['Factoring patterns', '(a+b)² = a²+2ab+b²; (a−b)(a+b) = a²−b²; a³−b³ = (a−b)(a²+ab+b²)', 'Factoring polynomials, simplifying rational expressions, verifying trig identities'],
          ['Systems of equations', 'Substitution and elimination; 2×2 and 3×3 systems', 'Solving trig equations with multiple unknowns; linear systems with vectors'],
          ['Interval notation', '(a,b) = open; [a,b] = closed; (−∞, b] = everything up to b', 'Expressing domains, ranges, and solution sets throughout Pre-Calc'],
          ['Function notation', 'f(x) means "evaluate at x"; f(a) means "substitute a for x"', 'Composition, inverses, and all function operations use this notation'],
          ['Rational expressions', 'Factor numerator and denominator, then cancel common factors', 'Simplifying rational functions before finding asymptotes and holes'],
        ]}
      />

      <Analogy
        title="Pre-Calculus as a toolbox audit before the big job"
        body="Imagine you're about to build a house (that's Calculus). Pre-Calculus is the morning where you lay out every tool on the workbench, check that each one works, and practice using it quickly. The hammer (polynomial algebra), the level (logarithms and inverse functions), the angle finder (trigonometry), the blueprint reader (function notation) — you don't build the house today, but by the end of Pre-Calc every tool should feel like an extension of your hand, not something you have to think about. The house building starts in Calculus."
      />

      <GuideTable
        title="Domain Restrictions — When to Exclude Values"
        headers={['Situation', 'Restriction required', 'Example']}
        rows={[
          ['Denominator of a fraction', 'Exclude any x that makes denominator = 0', 'f(x) = 1/(x−2): domain is x ≠ 2, or (−∞,2)∪(2,∞)'],
          ['Even root (√, ⁴√, etc.)', 'Radicand (expression under radical) must be ≥ 0', 'f(x) = √(x−3): domain x ≥ 3, or [3,∞)'],
          ['Logarithm', 'Argument of log must be strictly > 0', 'f(x) = ln(x+5): domain x > −5, or (−5,∞)'],
          ['Combination', 'Apply ALL restrictions simultaneously', 'f(x) = √(x−1)/(x−4): need x ≥ 1 AND x ≠ 4'],
          ['Inverse trig', 'sin⁻¹ and cos⁻¹ require −1 ≤ x ≤ 1', 'sin⁻¹(2x): domain −1 ≤ 2x ≤ 1, so −1/2 ≤ x ≤ 1/2'],
          ['No restriction needed', 'Polynomials, eˣ, sin, cos — defined everywhere', 'f(x) = x⁵ − 3x + 1: domain = all real numbers'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Functions & Transformations
// ─────────────────────────────────────────────────────────────────────
function Section2Functions() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Functions: The Language of Mathematics</Typography>

      <Analogy title="Sliding and stretching a photo">
        A function is like a photograph. Transformations are like the editing tools in a photo app:
        you can slide the photo left or right (horizontal shift), up or down (vertical shift), flip it
        over a mirror (reflection), or stretch/squish it (dilation). The photo itself — the shape — stays
        the same. Only its position, orientation, or size changes. Transformation rules tell you exactly
        which editing tool does what.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A function f maps every input x to exactly one output f(x). The <strong>domain</strong> is the set of
        valid inputs; the <strong>range</strong> is the set of all possible outputs. The vertical line test
        distinguishes functions (each x maps to at most one y) from non-functions (some x maps to two or more y).
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Transformation Rules — the Complete Reference</Typography>

      <MermaidDiagram chart={`graph TD
  A["Start with parent function f(x)"]
  A --> B["Horizontal shift\nf(x − h): shift RIGHT h\nf(x + h): shift LEFT h"]
  A --> C["Vertical shift\nf(x) + k: shift UP k\nf(x) − k: shift DOWN k"]
  A --> D["Reflection\n−f(x): flip over x-axis\nf(−x): flip over y-axis"]
  A --> E["Vertical dilation\na·f(x): stretch if |a|>1\ncompress if 0<|a|<1"]
  A --> F["Horizontal dilation\nf(bx): compress if |b|>1\nstretch if 0<|b|<1"]`} />

      <Callout kind="watch-for">
        The horizontal rules are counterintuitive. In f(x − 3), the "minus 3" inside the function shifts
        the graph TO THE RIGHT — opposite the sign. Think of it this way: to get the same y-value the
        original function would produce at x = 0, you now need x = 3. So the whole graph moves right.
        This trips up nearly every student the first time.
      </Callout>

      <GuideTable
        headers={['Transformation', 'Notation', 'Effect on key points (x, y)']}
        rows={[
          ['Shift right h', 'f(x − h)', '(x, y) → (x + h, y)'],
          ['Shift left h', 'f(x + h)', '(x, y) → (x − h, y)'],
          ['Shift up k', 'f(x) + k', '(x, y) → (x, y + k)'],
          ['Shift down k', 'f(x) − k', '(x, y) → (x, y − k)'],
          ['Reflect over x-axis', '−f(x)', '(x, y) → (x, −y)'],
          ['Reflect over y-axis', 'f(−x)', '(x, y) → (−x, y)'],
          ['Vertical stretch by a', 'a·f(x), a > 1', '(x, y) → (x, ay)'],
          ['Vertical compress by a', 'a·f(x), 0 < a < 1', '(x, y) → (x, ay)'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Composition of Functions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>(f ∘ g)(x) = f(g(x))</strong>: apply g first, then apply f to the result.
        Think of it as an assembly line — g is the first station, f is the second.
        Order matters: (f ∘ g)(x) is usually not equal to (g ∘ f)(x).
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {'f(x) = x + 1,  g(x) = x²'}<br />
        {'(f ∘ g)(3) = f(g(3)) = f(9) = 10'}<br />
        {'(g ∘ f)(3) = g(f(3)) = g(4) = 16   ← different result!'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Inverse Functions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The inverse function f⁻¹ reverses the action of f. If f maps 2 to 7, then f⁻¹ maps 7 back to 2.
        To find f⁻¹ algebraically: (1) write y = f(x), (2) swap x and y, (3) solve for y.
        Verification: f(f⁻¹(x)) = x AND f⁻¹(f(x)) = x — both compositions must work.
      </Typography>

      <Callout kind="in-plain-words">
        An inverse function exists only if f is one-to-one — no two inputs share the same output.
        The horizontal line test is the visual check: if any horizontal line crosses the graph more than once,
        the function is NOT one-to-one and does not have an inverse over its full domain.
        (You can restrict the domain to force an inverse — that's exactly what we do for trig functions.)
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Even and Odd Functions</Typography>
      <GuideTable
        headers={['Type', 'Algebraic test', 'Geometric test', 'Examples']}
        rows={[
          ['Even', 'f(−x) = f(x)', 'Symmetric about the y-axis', 'x², cos(x), |x|'],
          ['Odd', 'f(−x) = −f(x)', '180° rotational symmetry about the origin', 'x³, sin(x), x'],
          ['Neither', 'Neither condition holds', 'No special symmetry', 'x² + x, eˣ, √x'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Piecewise Functions</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A piecewise function uses different formulas for different parts of the domain. Always check WHICH
        piece applies based on the x-value before evaluating.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {'f(x) = { x²      if x ≥ 0'}<br />
        {'        { 2x + 1  if x < 0'}<br />
        {''}<br />
        {'f(3)  = 3² = 9          (use top piece, 3 ≥ 0)'}<br />
        {'f(−2) = 2(−2)+1 = −3    (use bottom piece, −2 < 0)'}
      </Box>

      <Callout kind="try-this">
        Given g(x) = 2f(x − 3) + 1 where f(x) = x², identify each transformation:
        (x − 3) inside → shift right 3; coefficient 2 outside → vertical stretch by 2; +1 outside → shift up 1.
        The vertex of f at (0, 0) moves to (3, 1). The new function is g(x) = 2(x−3)² + 1.
        Practice naming each transformation before graphing — the naming IS the understanding.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Common Parent Functions — Domain, Range, and Shape</Typography>
      <GuideTable
        headers={['Parent Function', 'Domain', 'Range', 'Key Feature']}
        rows={[
          ['f(x) = x (linear)', 'All reals', 'All reals', 'Straight line through origin, slope 1'],
          ['f(x) = x² (quadratic)', 'All reals', 'y ≥ 0', 'Parabola opening up, vertex at origin'],
          ['f(x) = x³ (cubic)', 'All reals', 'All reals', 'S-curve through origin; odd function'],
          ['f(x) = √x (square root)', 'x ≥ 0', 'y ≥ 0', 'Starts at origin, increases right; not defined for x < 0'],
          ['f(x) = ∛x (cube root)', 'All reals', 'All reals', 'Defined for all x, including negatives'],
          ['f(x) = |x| (absolute value)', 'All reals', 'y ≥ 0', 'V-shape with vertex at origin'],
          ['f(x) = 1/x (reciprocal)', 'x ≠ 0', 'y ≠ 0', 'Two branches; asymptotes at x = 0 and y = 0'],
          ['f(x) = eˣ (exponential)', 'All reals', 'y > 0', 'Passes through (0,1); always positive; never touches x-axis'],
          ['f(x) = ln(x) (natural log)', 'x > 0', 'All reals', 'Passes through (1,0); undefined for x ≤ 0'],
          ['f(x) = sin(x)', 'All reals', '−1 ≤ y ≤ 1', 'Wave; period 2π; odd function'],
          ['f(x) = cos(x)', 'All reals', '−1 ≤ y ≤ 1', 'Wave; period 2π; even function'],
        ]}
      />

      <Analogy
        title="Composition of functions as a factory assembly line"
        body="Imagine a two-station factory. Station g receives raw material (input x) and processes it into an intermediate product g(x). Station f receives that intermediate product and transforms it into the final output f(g(x)). The order matters critically: if you reverse the stations, you get a different product. (f ∘ g)(x) means 'g processes first, then f' — always trace the flow from innermost to outermost, like unwrapping nested parentheses."
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Finding Inverse Functions — Full Worked Process</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Find the inverse of f(x) = (3x − 2) / (x + 1)'}<br />
        {''}<br />
        {'Step 1: Write y = (3x − 2) / (x + 1)'}<br />
        {'Step 2: Swap x and y: x = (3y − 2) / (y + 1)'}<br />
        {'Step 3: Solve for y:'}<br />
        {'  x(y + 1) = 3y − 2'}<br />
        {'  xy + x = 3y − 2'}<br />
        {'  xy − 3y = −2 − x'}<br />
        {'  y(x − 3) = −x − 2'}<br />
        {'  y = (−x − 2) / (x − 3)   ← this is f⁻¹(x)'}<br />
        {''}<br />
        {'Verify: f(f⁻¹(0)) = f(2/3) = (3·2/3 − 2)/(2/3 + 1) = (2−2)/(5/3) = 0 ✓'}
      </Box>

      <Callout kind="watch-for">
        The notation f⁻¹(x) means "the inverse function of f" — it does NOT mean 1/f(x). This
        is one of the most common notational confusions in Pre-Calculus. Context always clarifies: if you see
        sin⁻¹(x), that's arcsin — the inverse function. If you need the reciprocal of sin, write 1/sin(x) = csc(x).
      </Callout>

      <GuideTable
        title="Function Properties Quick Reference"
        headers={['Property', 'Definition', 'Test', 'Example']}
        rows={[
          ['One-to-one', 'Each output comes from exactly one input', 'Horizontal line test — no line hits graph twice', 'f(x) = x³ is one-to-one; f(x) = x² is not'],
          ['Even function', 'f(−x) = f(x) for all x', 'Graph symmetric about y-axis', 'cos(x), x², |x|'],
          ['Odd function', 'f(−x) = −f(x) for all x', '180° rotational symmetry about origin', 'sin(x), x³, 1/x'],
          ['Continuous', 'No holes, jumps, or vertical asymptotes on the interval', 'Can trace graph without lifting pen', 'Polynomials are continuous everywhere'],
          ['Increasing', 'f(a) < f(b) whenever a < b on the interval', 'Graph rises left to right', 'eˣ is always increasing'],
          ['Decreasing', 'f(a) > f(b) whenever a < b on the interval', 'Graph falls left to right', 'e⁻ˣ is always decreasing'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Arithmetic Operations on Functions</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Given two functions f and g, you can build four new functions using standard arithmetic. Each new function
        inherits domain restrictions from BOTH parents — the new domain is the intersection of the two original domains,
        with additional exclusions where the denominator (in division) equals zero.
      </Typography>
      <GuideTable
        headers={['Operation', 'Notation', 'Formula', 'Domain note']}
        rows={[
          ['Sum', '(f + g)(x)', 'f(x) + g(x)', 'Domain of f ∩ domain of g'],
          ['Difference', '(f − g)(x)', 'f(x) − g(x)', 'Domain of f ∩ domain of g'],
          ['Product', '(f · g)(x)', 'f(x) · g(x)', 'Domain of f ∩ domain of g'],
          ['Quotient', '(f/g)(x)', 'f(x)/g(x)', 'Domain of f ∩ domain of g, EXCLUDING x where g(x) = 0'],
          ['Composition', '(f ∘ g)(x)', 'f(g(x))', 'All x in domain of g such that g(x) is in domain of f'],
        ]}
      />

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'f(x) = √(x − 1),   g(x) = x + 2'}<br />
        {''}<br />
        {'(f + g)(x) = √(x − 1) + x + 2'}<br />
        {'  Domain of f: x ≥ 1;  Domain of g: all reals'}<br />
        {'  Intersection: x ≥ 1  →  domain of (f + g) is [1, ∞)'}<br />
        {''}<br />
        {'(f/g)(x) = √(x − 1) / (x + 2)'}<br />
        {'  Same intersection, but also exclude where g = 0: x ≠ −2'}<br />
        {'  x ≥ 1 already excludes −2, so domain is still [1, ∞)'}<br />
        {''}<br />
        {'(f ∘ g)(x) = f(g(x)) = √(g(x) − 1) = √(x + 2 − 1) = √(x + 1)'}<br />
        {'  Need x + 1 ≥ 0 → x ≥ −1  →  domain is [−1, ∞)'}
      </Box>

      <Callout kind="watch-for">
        The domain of (f ∘ g)(x) is NOT simply "domain of f ∩ domain of g." You need: (1) x must be in the domain
        of g, AND (2) g(x) must be in the domain of f. Always substitute and find the actual domain of the
        composed function — the substitution often changes the restriction significantly.
      </Callout>

      <GuideTable
        title="Transformation Summary — Applied to Any Parent Function"
        headers={['Written form', 'Transformation applied', 'Effect on y = f(x)']}
        rows={[
          ['f(x) + k, k > 0', 'Shift up k', 'All y-values increase by k; asymptotes shift up'],
          ['f(x) − k, k > 0', 'Shift down k', 'All y-values decrease by k'],
          ['f(x − h), h > 0', 'Shift right h', 'All x-values increase by h; domain shifts right'],
          ['f(x + h), h > 0', 'Shift left h', 'All x-values decrease by h'],
          ['a · f(x), a > 1', 'Vertical stretch', 'All y-values multiplied by a; graph taller'],
          ['a · f(x), 0 < a < 1', 'Vertical compression', 'All y-values multiplied by a; graph shorter'],
          ['−f(x)', 'Reflect over x-axis', 'All y-values negate; flips vertically'],
          ['f(−x)', 'Reflect over y-axis', 'All x-values negate; flips horizontally'],
          ['f(bx), b > 1', 'Horizontal compression', 'Period/width shrinks by factor 1/b; graph narrower'],
          ['f(bx), 0 < b < 1', 'Horizontal stretch', 'Period/width grows by factor 1/b; graph wider'],
          ['f(bx), b < 0', 'Horizontal reflection + compression/stretch', 'Apply f(|b|x) first, then flip over y-axis'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Polynomial & Rational Functions
// ─────────────────────────────────────────────────────────────────────
function Section3Polynomials() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Polynomial Functions</Typography>

      <Analogy title="A roller coaster profile">
        A linear function is a ramp — one slope, no turns. A quadratic is a simple hill — one peak or one valley.
        A polynomial of degree n can have up to n−1 turns — like a roller coaster with multiple peaks and valleys.
        The degree controls how "wild" the ride can be, and the leading coefficient determines whether the coaster
        ends going up or down as you look far left or right.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>End Behavior Rules</Typography>

      <MermaidDiagram chart={`graph LR
  A["Leading term aₙxⁿ"] --> B{"n even or odd?"}
  B -->|Even| C{"aₙ positive?"}
  B -->|Odd| D{"aₙ positive?"}
  C -->|Yes| E["Both ends UP ↑↑\n(like x²)"]
  C -->|No| F["Both ends DOWN ↓↓\n(like −x²)"]
  D -->|Yes| G["Left DOWN, Right UP ↓↑\n(like x³)"]
  D -->|No| H["Left UP, Right DOWN ↑↓\n(like −x³)"]`} />

      <Callout kind="watch-for">
        End behavior is determined ONLY by the leading term — the highest-power term. The constant and
        middle terms are noise when x is very large. Check the degree (even/odd) and the leading coefficient
        sign (positive/negative) — those two facts tell you everything about end behavior.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Multiplicity of Zeros</Typography>
      <GuideTable
        headers={['Multiplicity', 'Even or Odd?', 'Graph behavior at that zero']}
        rows={[
          ['1 (simple)', 'Odd', 'Crosses through — like a line crossing the x-axis'],
          ['2', 'Even', 'Bounces back — like the vertex of a parabola touching the axis'],
          ['3', 'Odd', 'Crosses with a flattened S-curve'],
          ['4+', 'Depends on parity', 'Same even/odd rule, but flatter near the axis'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Remainder and Factor Theorems</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Remainder Theorem:</strong> When p(x) is divided by (x − a), the remainder equals p(a).
        <br />
        <strong>Factor Theorem:</strong> (x − a) is a factor of p(x) ↔ p(a) = 0.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Rational Zeros Theorem:</strong> If p(x) has integer coefficients, any rational zero p/q satisfies:
        p divides the constant term and q divides the leading coefficient. This gives a finite candidate list.
      </Typography>

      <Callout kind="connect">
        The Rational Zeros Theorem + synthetic division is your complete factoring algorithm for polynomials
        with rational coefficients: list candidates, test with synthetic division, factor out confirmed zeros,
        reduce the degree, repeat. A degree-4 polynomial becomes degree-3 after finding one zero, then degree-2
        (quadratic formula finishes it), then fully factored.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Rational Functions</Typography>

      <MermaidDiagram chart={`graph TD
  A["Rational function f(x) = p(x)/q(x)"]
  A --> B["Find zeros of q(x)"]
  B --> C{"Does the factor also cancel in p(x)?"}
  C -->|Yes| D["HOLE at that x-value\nPlug into simplified form for y"]
  C -->|No| E["VERTICAL ASYMPTOTE\nx = that value"]
  A --> F["Compare degrees of p and q"]
  F --> G{"deg p < deg q?"}
  G -->|Yes| H["HA: y = 0"]
  G -->|No| I{"deg p = deg q?"}
  I -->|Yes| J["HA: y = (leading coeff ratio)"]
  I -->|No| K["No HA — oblique asymptote\n(do polynomial long division)"]`} />

      <GuideTable
        headers={['Feature', 'How to find it', 'Quick example: f(x) = (x²−4)/(x−2)(x+3)']}
        rows={[
          ['Domain', 'Exclude zeros of denominator', 'x ≠ 2, x ≠ −3'],
          ['Holes', 'Factor cancels from both num and den', 'x=2 is a hole (cancel (x−2)); y-value: evaluate simplified function at x=2'],
          ['Vertical asymptotes', 'Non-canceling zeros of den', 'x = −3 (does not cancel)'],
          ['Horizontal asymptote', 'Degree comparison', 'deg(num)=2 = deg(den)=2 → y = 1/1 = 1'],
          ['x-intercepts', 'Zeros of numerator (after simplification)', 'Simplified: (x+2)/(x+3), zero at x=−2'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Partial Fraction Decomposition</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Partial fractions reverse the process of combining fractions. Given a rational expression with distinct
        linear factors in the denominator, write it as a sum of simpler fractions — one per factor.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'(3x + 5) / [(x+1)(x+2)] = A/(x+1) + B/(x+2)'}<br />
        {'Multiply both sides by (x+1)(x+2):'}<br />
        {'3x + 5 = A(x+2) + B(x+1)'}<br />
        {'Let x = −1: 2 = A(1) → A = 2'}<br />
        {'Let x = −2: −1 = B(−1) → B = 1'}<br />
        {'Result: 2/(x+1) + 1/(x+2)'}
      </Box>

      <Callout kind="make-it-stick">
        For partial fractions: the number of constants (A, B, C...) equals the number of distinct factors in
        the denominator. Repeated linear factors (x−a)² need two terms: A/(x−a) + B/(x−a)².
        Irreducible quadratic factors need Ax+B in the numerator, not just A.
        These rules feel arbitrary until you remember that partial fractions must be able to recombine
        back to any possible numerator — that's why the numerator forms are structured as they are.
      </Callout>

      <Analogy
        title="Synthetic division as short-hand long division"
        body="Polynomial long division is like dividing multi-digit numbers — write out every step explicitly. Synthetic division is the calculator shortcut: instead of writing out the x's and powers, you just keep track of the coefficients in a row and do arithmetic on them. It only works when dividing by a linear factor (x − c), but that covers 90% of factoring problems. The zero at the bottom right of the synthetic division table is the remainder — and if it's 0, you've found a factor."
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Synthetic Division — Full Worked Example</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Divide p(x) = 2x³ − 3x² − 11x + 6  by  (x − 3)  [testing if x = 3 is a zero]'}<br />
        {''}<br />
        {'    3 |  2   −3   −11    6'}<br />
        {'      |       6     9   −6'}<br />
        {'      |  2    3    −2    0   ← remainder = 0 → (x − 3) IS a factor'}<br />
        {''}<br />
        {'Quotient: 2x² + 3x − 2  (one degree lower)'}<br />
        {'Factor quotient: (2x − 1)(x + 2)'}<br />
        {'Full factored form: (x − 3)(2x − 1)(x + 2)'}<br />
        {'Zeros: x = 3,  x = 1/2,  x = −2'}
      </Box>

      <GuideTable
        title="Complex Zeros and the Conjugate Pairs Theorem"
        headers={['Theorem', 'Statement', 'Implication']}
        rows={[
          ['Conjugate Pairs Theorem', 'If a + bi is a zero of a polynomial with real coefficients, then a − bi is also a zero', 'Complex zeros always come in conjugate pairs — you can never have just one complex zero'],
          ['Fundamental Theorem of Algebra', 'Every polynomial of degree n ≥ 1 has exactly n zeros (counting multiplicity) in the complex numbers', 'A degree-4 polynomial has exactly 4 zeros total (some may be repeated, some complex)'],
          ['Real-coefficient polynomials', 'The number of real zeros and the number of pairs of complex conjugate zeros must sum to the degree', 'A degree-5 polynomial can have 5, 3, or 1 real zeros (the rest come in complex pairs)'],
          ['Irreducible quadratics', 'Quadratics with negative discriminant (b²−4ac < 0) have no real zeros; they contribute 2 complex zeros', 'Factor fully over reals: linear factors for real zeros, irreducible quadratics for complex conjugate pairs'],
        ]}
      />

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Find a degree-4 polynomial with real coefficients having zeros at x = 2, x = −1, and 3 + i.'}<br />
        {''}<br />
        {'Conjugate pairs: 3 + i must pair with 3 − i'}<br />
        {'Zeros: 2, −1, 3+i, 3−i  (four zeros for degree 4 ✓)'}<br />
        {''}<br />
        {'p(x) = (x − 2)(x + 1)(x − (3+i))(x − (3−i))'}<br />
        {'     = (x − 2)(x + 1)[(x−3) − i][(x−3) + i]'}<br />
        {'     = (x − 2)(x + 1)[(x−3)² + 1]'}<br />
        {'     = (x − 2)(x + 1)(x² − 6x + 10)'}
      </Box>

      <GuideTable
        title="Graphing Polynomial Functions — Complete Checklist"
        headers={['Step', 'What to find', 'How to find it']}
        rows={[
          ['1', 'Degree and leading coefficient', 'Read from the polynomial; determines end behavior'],
          ['2', 'End behavior', 'Even degree: both ends same direction. Odd degree: opposite directions. Sign of leading term sets which direction'],
          ['3', 'y-intercept', 'Evaluate p(0) = constant term'],
          ['4', 'Real zeros', 'Factor completely; use Rational Zeros Theorem + synthetic division'],
          ['5', 'Multiplicity of each zero', 'Count how many times each factor appears; determines crossing vs. bouncing at that x'],
          ['6', 'Turning points', 'Degree n polynomial has at most n − 1 turning points; use to check your graph\'s plausibility'],
          ['7', 'Sketch', 'Plot zeros and y-intercept; use end behavior to connect, honoring multiplicity behavior at each zero'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Rational Function Sketching — Extended Worked Example</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'f(x) = (x² − x − 6) / (x² − 4)'}<br />
        {''}<br />
        {'Step 1: Factor completely'}<br />
        {'  Numerator: (x − 3)(x + 2)'}<br />
        {'  Denominator: (x − 2)(x + 2)'}<br />
        {''}<br />
        {'Step 2: Cancel common factors'}<br />
        {'  f(x) = (x − 3)(x + 2) / [(x − 2)(x + 2)]  →  HOLE at x = −2'}<br />
        {'  Simplified: (x − 3) / (x − 2)  for x ≠ −2'}<br />
        {''}<br />
        {'Step 3: Vertical asymptote — remaining denominator zero'}<br />
        {'  x − 2 = 0  →  VA at x = 2'}<br />
        {''}<br />
        {'Step 4: Horizontal asymptote — degree comparison'}<br />
        {'  deg(num) = deg(den) = 1 (after simplification)'}<br />
        {'  HA: y = (leading coeff ratio) = 1/1 = 1'}<br />
        {''}<br />
        {'Step 5: x-intercept — zero of simplified numerator'}<br />
        {'  x − 3 = 0  →  x = 3  →  x-intercept at (3, 0)'}<br />
        {''}<br />
        {'Step 6: y-intercept — f(0)'}<br />
        {'  f(0) = (0 − 3)/(0 − 2) = −3/−2 = 3/2  →  y-intercept at (0, 3/2)'}<br />
        {''}<br />
        {'Step 7: Hole coordinates — evaluate simplified form at x = −2'}<br />
        {'  (−2 − 3)/(−2 − 2) = −5/−4 = 5/4  →  hole at (−2, 5/4)'}
      </Box>

      <GuideTable
        title="Oblique (Slant) Asymptotes — When Degree of Num > Degree of Den by 1"
        headers={['Step', 'Process', 'Example: f(x) = (x² + 3x + 1)/(x + 2)']}
        rows={[
          ['Check', 'deg(numerator) must be exactly 1 more than deg(denominator)', 'deg(num) = 2, deg(den) = 1 — qualifies for oblique'],
          ['Divide', 'Do polynomial long division of numerator ÷ denominator', '(x² + 3x + 1) ÷ (x + 2) = x + 1 remainder −1'],
          ['Asymptote', 'The quotient (without remainder) is the oblique asymptote equation y = ...', 'Oblique asymptote: y = x + 1'],
          ['Verify', 'As x → ±∞, the remainder/denominator → 0, so f(x) approaches y = quotient', 'The −1/(x+2) → 0 as x → ∞, confirming y = x + 1 is the asymptote'],
        ]}
      />

      <GuideTable
        title="Asymptote Summary — All Types and How to Find Them"
        headers={['Asymptote type', 'For which functions?', 'How to find', 'Does graph cross it?']}
        rows={[
          ['Vertical asymptote (VA)', 'Rational functions', 'Non-canceling zeros of the denominator: set den = 0, factor out any common factors first', 'Never — VA marks where function is undefined'],
          ['Horizontal asymptote (HA)', 'Rational functions; exponential/log in limits', 'Compare degrees: deg num < deg den → y = 0; equal degrees → y = ratio of leading coefficients; deg num > deg den → no HA', 'CAN cross at interior points, but approaches asymptote as x → ±∞'],
          ['Oblique (slant) asymptote', 'Rational functions where deg(num) = deg(den) + 1', 'Polynomial long division — the non-remainder quotient', 'Can cross at interior points'],
          ['Hole (removable discontinuity)', 'Rational functions where a factor cancels', 'Canceling factors from numerator and denominator; substitute the excluded x into simplified form for y-coordinate', 'N/A — hole is a single missing point, not an asymptote'],
          ['End behavior asymptote (exp)', 'Exponential functions', 'The horizontal line approached as x → −∞ (for growth) or x → +∞ (for decay)', 'Approached but never reached for basic exponentials'],
        ]}
      />
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

      <Analogy title="Doubling pennies vs. earning a dollar a day">
        If someone offers you $1 a day for 30 days, you'd earn $30. If instead they offer you one penny on day 1,
        doubled each day, you'd have over $10 million by day 30. That is exponential growth in action —
        not "plus a constant" but "times a constant." The multiplication is what makes it explode.
        Exponential functions feel slow at first, then suddenly dominate everything.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        An exponential function has the form <strong>f(x) = a · bˣ</strong> where b {'>'} 0 and b ≠ 1.
        If b {'>'} 1: growth. If 0 {'<'} b {'<'} 1: decay. The <strong>natural base e ≈ 2.718</strong> arises
        from continuous compounding and appears throughout science as the most natural base for exponential functions.
      </Typography>

      <Callout kind="why-it-matters">
        Every real-world growth or decay situation uses exponential functions: compound interest, population growth,
        drug clearance from the bloodstream, radioactive decay, viral spread, and even the brightness of stars.
        If the rate of change is proportional to the current amount — "the more you have, the faster it grows" —
        the model is exponential.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Logarithmic Functions — Undoing Exponentiation</Typography>

      <Analogy title="Subtraction undoes addition; logarithm undoes exponentiation">
        If someone says "I added 7 to get 12," you undo it: 12 − 7 = 5. If someone says "I raised 10 to a power
        and got 1000," you undo it with a logarithm: log₁₀(1000) = 3. The logarithm IS the undo operation for
        exponentiation — exactly as subtraction is the undo for addition. Log and exponential are inverse functions.
      </Analogy>

      <MermaidDiagram chart={`graph LR
  A["Exponential: y = bˣ"] <-->|"Inverse functions\n(reflections over y = x)"| B["Logarithm: x = logb(y)"]
  A --> C["Maps exponents → values\ne.g. 2³ = 8"]
  B --> D["Maps values → exponents\ne.g. log₂(8) = 3"]
  C --> E["Domain: all reals\nRange: y > 0"]
  D --> F["Domain: x > 0\nRange: all reals"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Three Logarithm Laws</Typography>
      <GuideTable
        headers={['Law', 'Formula', 'Memory bridge']}
        rows={[
          ['Product rule', 'logb(MN) = logb M + logb N', 'Multiplication of inputs → addition of logs'],
          ['Quotient rule', 'logb(M/N) = logb M − logb N', 'Division of inputs → subtraction of logs'],
          ['Power rule', 'logb(Mⁿ) = n · logb M', 'Exponent slides out to become a coefficient'],
          ['Change of base', 'logb(x) = log(x)/log(b) = ln(x)/ln(b)', 'Any base → base 10 or base e for calculator'],
        ]}
      />

      <Callout kind="watch-for">
        There is NO log rule for log(M + N). Students frequently write log(M + N) = log M + log N — this is
        completely false. The product rule applies to log(M · N), not log(M + N). When you see a sum inside
        a log, you generally cannot simplify it further.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Solving Exponential Equations</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Case 1 — Same base:</strong> Write both sides with the same base, then equate exponents.
        2^(x+1) = 16 → 2^(x+1) = 2⁴ → x + 1 = 4 → x = 3.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Case 2 — Different bases:</strong> Take log of both sides, apply the power rule.
        5^x = 30 → x·log(5) = log(30) → x = log(30)/log(5) ≈ 2.11.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Real-World Formulas</Typography>
      <GuideTable
        headers={['Application', 'Formula', 'Key detail']}
        rows={[
          ['Compound interest', 'A = P(1 + r/n)^(nt)', 'n = compoundings per year'],
          ['Continuous compounding', 'A = Peʳᵗ', 'n → ∞; uses natural base e'],
          ['Half-life decay', 'A(t) = A₀·(1/2)^(t/h)', 'h = half-life time'],
          ['Continuous decay/growth', 'A(t) = A₀eᵏᵗ', 'k > 0 growth; k < 0 decay'],
          ['Doubling time T', 'T = ln(2)/k', 'From A₀eᵏᵀ = 2A₀'],
        ]}
      />

      <Callout kind="connect">
        The natural logarithm ln is simply log base e. All the log rules apply to ln just as to log base 10.
        Whenever you see e in an equation, ln is your undo tool — and whenever you see ln in an equation,
        e is your undo tool. They are a matched pair, like addition and subtraction.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Solving Logarithmic Equations — Two Core Strategies</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Strategy 1: Combine logs, then exponentiate'}<br />
        {'  log₂(x) + log₂(x − 2) = 3'}<br />
        {'  log₂(x(x − 2)) = 3         ← product rule'}<br />
        {'  x(x − 2) = 2³ = 8          ← exponentiate both sides'}<br />
        {'  x² − 2x − 8 = 0'}<br />
        {'  (x − 4)(x + 2) = 0'}<br />
        {'  x = 4  or  x = −2'}<br />
        {'  CHECK: log₂(−2) is undefined → reject x = −2'}<br />
        {'  Answer: x = 4'}<br />
        {''}<br />
        {'Strategy 2: Same base on both sides → equate arguments'}<br />
        {'  log₅(2x + 1) = log₅(3x − 4)'}<br />
        {'  2x + 1 = 3x − 4   → x = 5'}
      </Box>

      <Callout kind="watch-for">
        ALWAYS check your logarithm solutions by substituting back into the ORIGINAL equation — not a
        simplified form. Logarithms are undefined for non-positive arguments, and algebraic manipulations
        can introduce extraneous solutions where a log argument becomes zero or negative. Rejecting extraneous
        solutions is required for full credit.
      </Callout>

      <GuideTable
        title="Real-World Logarithmic Scales — Why Logs Matter"
        headers={['Application', 'Formula', 'What it means']}
        rows={[
          ['pH (chemistry)', 'pH = −log₁₀[H⁺]', 'Each pH unit = 10× change in H⁺ concentration; pH 4 is 10× more acidic than pH 5'],
          ['Richter scale (earthquakes)', 'M = log₁₀(I/I₀)', 'A magnitude 7 earthquake has 10× the amplitude of magnitude 6 — and about 32× the energy'],
          ['Decibels (sound)', 'dB = 10·log₁₀(I/I₀)', 'Every 10 dB = 10× intensity; 20 dB = 100× intensity'],
          ['Exponential growth problems', 'A = A₀eᵏᵗ; solve for t: t = ln(A/A₀)/k', 'Logarithm isolates the exponent when solving for time'],
          ['Half-life problems', 't₁/₂ = ln(2)/k ≈ 0.693/k', 'The time for any exponential decay to reach 50% of original value'],
        ]}
      />

      <Analogy
        title="Logarithmic scales as magnifying glasses for huge ranges"
        body="If you tried to plot both a bacterium (0.000001 meters) and a galaxy (1,000,000,000,000,000,000,000 meters) on the same linear axis, the galaxy would be a trillion trillion times further right — you couldn't see the bacterium at all. A logarithmic scale compresses enormous ranges into something visible by displaying the exponent instead of the value. That's why scientists use log scales for sound intensity, earthquake magnitude, pH, and star brightness — the underlying quantities span many orders of magnitude."
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Graphing Exponential and Logarithmic Functions — Transformation Pairs</Typography>
      <GuideTable
        headers={['Parent', 'Transformed', 'What changed', 'Effect on graph']}
        rows={[
          ['y = eˣ', 'y = eˣ + 3', 'Vertical shift +3', 'Graph moves up 3; asymptote y = 0 becomes y = 3'],
          ['y = eˣ', 'y = e^(x−2)', 'Horizontal shift +2 (right)', 'Graph moves right 2; y-intercept was (0,1), now (2,1)'],
          ['y = eˣ', 'y = −eˣ', 'Reflection over x-axis', 'Graph flips; now approaches y = 0 from below'],
          ['y = eˣ', 'y = e^(−x)', 'Reflection over y-axis', 'Converts growth to decay; mirrors the graph'],
          ['y = ln(x)', 'y = ln(x) + 4', 'Vertical shift', 'Graph moves up 4; x-intercept was (1,0), now (e⁻⁴, 0)'],
          ['y = ln(x)', 'y = ln(x − 1)', 'Horizontal shift right 1', 'Domain becomes x > 1; asymptote x = 0 moves to x = 1'],
          ['y = ln(x)', 'y = 2 ln(x)', 'Vertical stretch by 2', 'Same x-intercept (1,0); all other points twice as high'],
        ]}
      />

      <GuideTable
        title="Exponential vs. Linear Growth — Recognizing the Difference"
        headers={['Pattern in data', 'Model type', 'How to identify']}
        rows={[
          ['Constant differences between consecutive y-values', 'Linear: y = mx + b', 'Subtract consecutive terms — difference is constant'],
          ['Constant ratios between consecutive y-values', 'Exponential: y = a·bˣ', 'Divide consecutive terms — ratio is constant'],
          ['Fits perfectly on a semi-log plot (log y vs. x)', 'Exponential', 'Take ln of y-values; if they\'re linear in x, original was exponential'],
          ['Double in equal time intervals', 'Exponential with r = 2 (doubling)', 'Every fixed time step multiplies by the same factor'],
          ['Rate of change proportional to current value', 'Exponential', 'dy/dt = ky means y = y₀eᵏᵗ — foundational in biology, chemistry, finance'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Trigonometric Functions
// ─────────────────────────────────────────────────────────────────────
function Section5Trig() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The Unit Circle — Your Trig Home Base</Typography>

      <Analogy title="A clock face for angle measurement">
        Imagine a clock with radius 1 centered at the origin. The minute hand starts at (1, 0) — the 3 o'clock
        position — and sweeps counterclockwise. The angle swept is the angle θ. The x-coordinate of the
        hand's tip is cos(θ); the y-coordinate is sin(θ). The clock face is the unit circle, and every trig
        value is just a coordinate on that clock.
      </Analogy>

      <GuideTable
        headers={['Angle (degrees)', 'Angle (radians)', 'cos θ', 'sin θ', 'tan θ']}
        rows={[
          ['0°', '0', '1', '0', '0'],
          ['30°', 'π/6', '√3/2', '1/2', '1/√3 = √3/3'],
          ['45°', 'π/4', '√2/2', '√2/2', '1'],
          ['60°', 'π/3', '1/2', '√3/2', '√3'],
          ['90°', 'π/2', '0', '1', 'undefined'],
          ['180°', 'π', '−1', '0', '0'],
          ['270°', '3π/2', '0', '−1', 'undefined'],
          ['360°', '2π', '1', '0', '0'],
        ]}
      />

      <Callout kind="in-plain-words">
        To convert: degrees → radians, multiply by π/180. Radians → degrees, multiply by 180/π.
        The "benchmark" conversion to lock in: 180° = π radians. Everything else follows from that.
        In Pre-Calc and Calculus, radians are almost always preferred because they make derivative formulas cleaner.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Graphing Sinusoidal Functions</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        For <strong>y = A · sin(Bx + C) + D</strong> (and the cosine equivalent):
      </Typography>
      <GuideTable
        headers={['Parameter', 'Name', 'Formula', 'Effect']}
        rows={[
          ['A', 'Amplitude', '|A|', 'Half the height of the wave; max = D + |A|, min = D − |A|'],
          ['B', 'Period factor', 'Period = 2π/|B|', 'Larger B → shorter (compressed) period'],
          ['C', 'Phase shift factor', 'Phase shift = −C/B', 'Negative = shift right; positive = shift left'],
          ['D', 'Vertical shift', 'D', 'Moves the midline up (D > 0) or down (D < 0)'],
        ]}
      />

      <MermaidDiagram chart={`graph LR
  A["y = A·sin(Bx + C) + D"]
  A --> B["Amplitude = |A|\nMax and min distances from midline"]
  A --> C["Period = 2π / |B|\nLength of one complete cycle"]
  A --> D["Phase shift = −C/B\nHorizontal starting point"]
  A --> E["Vertical shift = D\nMidline y = D"]
  A --> F["Reflection: A < 0 flips\nthe wave over the midline"]`} />

      <Callout kind="try-this">
        For y = −3cos(2x − π/3) + 1: amplitude = 3 (the negative reflects, doesn't change amplitude);
        period = 2π/2 = π; phase shift = (π/3)/2 = π/6 to the right; midline y = 1.
        Practice this decomposition until it takes under 30 seconds — it comes up on every test.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Signs by Quadrant (ASTC)</Typography>
      <GuideTable
        headers={['Quadrant', 'sin', 'cos', 'tan', 'Memory']}
        rows={[
          ['I (0° to 90°)', '+', '+', '+', 'All positive'],
          ['II (90° to 180°)', '+', '−', '−', 'Sine only'],
          ['III (180° to 270°)', '−', '−', '+', 'Tangent only'],
          ['IV (270° to 360°)', '−', '+', '−', 'Cosine only'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Inverse Trig Functions</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Inverse trig functions (arcsin, arccos, arctan) answer the question "what angle has this trig value?"
        To define them as functions (one output per input), we restrict the domain of the original function:
      </Typography>
      <GuideTable
        headers={['Inverse function', 'Notation', 'Restricted domain of original', 'Range (output angles)']}
        rows={[
          ['arcsine', 'sin⁻¹(x) or arcsin(x)', '[−π/2, π/2]', '[−π/2, π/2]'],
          ['arccosine', 'cos⁻¹(x) or arccos(x)', '[0, π]', '[0, π]'],
          ['arctangent', 'tan⁻¹(x) or arctan(x)', '(−π/2, π/2)', '(−π/2, π/2)'],
        ]}
      />

      <Callout kind="coachs-note">
        Inverse trig functions only return angles in their specified range. sin⁻¹(1/2) = π/6 (30°), NOT 5π/6
        (150°) — even though sin(5π/6) = 1/2 as well. Always give the principal value (the one in the
        restricted range). This is the most common inverse-trig error on tests.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Arc Length and Sector Area</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        When the central angle is in radians, formulas become beautifully simple (another reason radians are preferred):
      </Typography>
      <GuideTable
        headers={['Formula', 'Variables', 'Example (r = 6, θ = 2π/3)']}
        rows={[
          ['Arc length: s = rθ', 'r = radius, θ = central angle in radians', 's = 6 · (2π/3) = 4π ≈ 12.57 units'],
          ['Sector area: A = ½r²θ', 'r = radius, θ = central angle in radians', 'A = ½ · 36 · (2π/3) = 12π ≈ 37.7 units²'],
          ['Arc length (degrees): s = (θ°/360°) · 2πr', 'Convert to fraction of full circle', 'Same result: (120/360) · 12π = 4π'],
        ]}
      />

      <Analogy
        title="Trig functions from a right triangle — SOH-CAH-TOA as a direction key"
        body="SOH-CAH-TOA isn't just a mnemonic — it's the definition of trig functions for acute angles. Place an angle θ at the bottom left of a right triangle. The side across from θ is Opposite; the side next to θ (not the hypotenuse) is Adjacent; the longest side is Hypotenuse. Sin θ = O/H (climb opposite, run hypotenuse). Cos θ = A/H. Tan θ = O/A. The unit circle extends these definitions to all angles, not just acute ones — but for right triangle problems, SOH-CAH-TOA is your starting point every time."
      />

      <GuideTable
        title="Special Right Triangles — Exact Values Without a Calculator"
        headers={['Triangle', '30°-60°-90°', '45°-45°-90°']}
        rows={[
          ['Sides (ratios)', '1 : √3 : 2  (short : long : hyp)', '1 : 1 : √2  (leg : leg : hyp)'],
          ['sin of smaller angle', 'sin 30° = 1/2', 'sin 45° = √2/2'],
          ['cos of smaller angle', 'cos 30° = √3/2', 'cos 45° = √2/2'],
          ['tan of smaller angle', 'tan 30° = 1/√3 = √3/3', 'tan 45° = 1'],
          ['How to remember', '"1 short, 2 long, √3 between" — the 30° angle has the shortest opposite side', 'Both legs equal; hypotenuse is leg × √2'],
        ]}
      />

      <GuideTable
        title="Reciprocal Trig Functions — Definitions and Common Values"
        headers={['Function', 'Definition', 'Value at 30°', 'Value at 45°', 'Value at 60°']}
        rows={[
          ['csc θ (cosecant)', '1/sin θ', '2', '√2', '2√3/3'],
          ['sec θ (secant)', '1/cos θ', '2√3/3', '√2', '2'],
          ['cot θ (cotangent)', '1/tan θ = cos/sin', '√3', '1', '√3/3'],
          ['When undefined?', 'When the denominator function = 0', 'csc undefined when sin = 0: θ = 0, π, 2π...', 'sec undefined when cos = 0: θ = π/2, 3π/2...', 'cot undefined when tan undefined: θ = π/2...'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Graphing Sinusoidal Functions — Step-by-Step Process</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Graph y = −2 cos(3x + π) + 1  on one full period'}<br />
        {''}<br />
        {'Step 1: Identify parameters'}<br />
        {'  A = −2  →  amplitude = 2, reflection over midline (starts at minimum)'}<br />
        {'  B = 3  →  period = 2π/3'}<br />
        {'  C = π  →  phase shift = −π/B = −π/3 (shift LEFT π/3)'}<br />
        {'  D = 1  →  midline at y = 1; max = 3, min = −1'}<br />
        {''}<br />
        {'Step 2: Find key x-values for one period starting at phase shift'}<br />
        {'  Start: x = −π/3  (left edge of period; reflected cos starts at min = −1)'}<br />
        {'  Quarter period: period/4 = (2π/3)/4 = π/6'}<br />
        {'  Key points: −π/3, −π/3+π/6 = −π/6, −π/3+π/3 = 0, −π/3+π/2 = π/6, −π/3+2π/3 = π/3'}<br />
        {''}<br />
        {'Step 3: Evaluate y at key points (reflected cos: min, mid, max, mid, min)'}<br />
        {'  x = −π/3: y = −1 (minimum)'}<br />
        {'  x = −π/6: y = 1 (midline, going up)'}<br />
        {'  x = 0:    y = 3 (maximum)'}<br />
        {'  x = π/6:  y = 1 (midline, going down)'}<br />
        {'  x = π/3:  y = −1 (minimum — completes one period)'}
      </Box>

      <GuideTable
        title="Graphs of Tangent, Cotangent, Secant, and Cosecant"
        headers={['Function', 'Period', 'Asymptotes', 'Key shape feature']}
        rows={[
          ['y = tan(x)', 'π', 'x = π/2 + nπ (where cos x = 0)', 'S-curves between asymptotes; passes through (0,0); increasing on each interval'],
          ['y = cot(x)', 'π', 'x = nπ (where sin x = 0)', 'Mirror of tangent shape; passes through (π/2, 0); decreasing on each interval'],
          ['y = sec(x)', '2π', 'x = π/2 + nπ (where cos x = 0)', 'U-shapes opening up and down; minimum at cos x = +1, maximum at cos x = −1'],
          ['y = csc(x)', '2π', 'x = nπ (where sin x = 0)', 'U-shapes opening up and down; relationship to the sine wave identical to sec/cos'],
          ['tan transformation: y = a tan(bx)', 'π/|b|', 'Same as tan but stretched/compressed', '|a| controls steepness; b controls how fast the period completes'],
        ]}
      />

      <Callout kind="connect">
        The graphs of sec and csc are easiest to draw by first sketching their reciprocals (cos and sin) lightly,
        then drawing U-curves opening away from each arch of the base graph, with asymptotes through each zero of
        the base. Where the base reaches a maximum of 1, the sec/csc curve just touches that point from above;
        where the base reaches a minimum of −1, the sec/csc curve just touches from below.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Analytic Trigonometry
// ─────────────────────────────────────────────────────────────────────
function Section6AnalyticTrig() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Trig Identities — the Algebraic Side of Trig</Typography>

      <Analogy title="Algebraic shortcuts for trig expressions">
        A trig identity is like a currency exchange — you trade one form for another of equal value.
        sin²θ + cos²θ = 1 is always true, so you can substitute either form whenever it helps.
        Identity proofs are like a puzzle: start on one side and convert it, piece by piece, until
        it looks like the other side — without touching the other side.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>The Pythagorean Identity Family</Typography>
      <GuideTable
        headers={['Identity', 'Derived from', 'Useful form']}
        rows={[
          ['sin²θ + cos²θ = 1', 'Unit circle: x² + y² = 1', 'sin²θ = 1 − cos²θ or cos²θ = 1 − sin²θ'],
          ['1 + tan²θ = sec²θ', 'Divide first identity by cos²θ', 'tan²θ = sec²θ − 1'],
          ['cot²θ + 1 = csc²θ', 'Divide first identity by sin²θ', 'cot²θ = csc²θ − 1'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sum and Difference Formulas</Typography>
      <GuideTable
        headers={['Identity', 'Formula']}
        rows={[
          ['sin(A + B)', 'sin A cos B + cos A sin B'],
          ['sin(A − B)', 'sin A cos B − cos A sin B'],
          ['cos(A + B)', 'cos A cos B − sin A sin B'],
          ['cos(A − B)', 'cos A cos B + sin A sin B'],
          ['tan(A + B)', '(tan A + tan B)/(1 − tan A tan B)'],
          ['tan(A − B)', '(tan A − tan B)/(1 + tan A tan B)'],
        ]}
      />

      <Callout kind="make-it-stick">
        Sine sum/difference: "sin cos ± cos sin" (both products, same sign as the original ±).
        Cosine sum/difference: "cos cos ∓ sin sin" (the ∓ flips — opposite sign from the original ±).
        Forgetting which one flips is the single most common sum/difference mistake. Write these
        on flashcards and drill them until they feel automatic.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Double-Angle Formulas</Typography>
      <GuideTable
        headers={['Formula', 'All forms']}
        rows={[
          ['sin(2A)', 'sin(2A) = 2 sin A cos A (only one form)'],
          ['cos(2A)', 'cos(2A) = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A (three equivalent forms)'],
          ['tan(2A)', 'tan(2A) = 2 tan A / (1 − tan²A)'],
        ]}
      />

      <Callout kind="why-it-matters">
        The three forms of cos(2A) let you pick the most convenient one depending on what other trig functions
        appear in the problem. If you see only sin in the target, use 1 − 2sin²A. If you see only cos, use
        2cos²A − 1. If you see both, use cos²A − sin²A. The ability to choose the right form separates
        fluent trig students from struggling ones.
      </Callout>

      <MermaidDiagram chart={`graph TD
  A["Trig Identity Families"]
  A --> B["Pythagorean\nsin²+cos²=1\ntan²+1=sec²\ncot²+1=csc²"]
  A --> C["Reciprocal\ncsc=1/sin\nsec=1/cos\ncot=1/tan"]
  A --> D["Quotient\ntan=sin/cos\ncot=cos/sin"]
  A --> E["Sum/Difference\nsin(A±B), cos(A±B)\ntan(A±B)"]
  A --> F["Double Angle\nsin(2A)=2sinAcosA\ncos(2A)=3 forms"]
  A --> G["Cofunction\nsin(π/2−θ)=cos θ\ntan(π/2−θ)=cot θ"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Solving Trigonometric Equations</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Step 1: Isolate the trig function (use algebra/identities to get sin(x) = k or similar).
        Step 2: Find the reference angle using inverse trig.
        Step 3: Identify ALL solutions in the given interval using the ASTC quadrant rules.
        Step 4: Write the general solution if requested (add 2πk for sin/cos, πk for tan).
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.8 }}>
        {'Solve: 2cos²x − 1 = 0 on [0, 2π)'}<br />
        {'cos²x = 1/2  →  cos x = ±√2/2'}<br />
        {'cos x = +√2/2: x = π/4 (Q1), x = 7π/4 (Q4)'}<br />
        {'cos x = −√2/2: x = 3π/4 (Q2), x = 5π/4 (Q3)'}<br />
        {'All four solutions: π/4, 3π/4, 5π/4, 7π/4'}
      </Box>

      <Callout kind="connect">
        Notice that 2cos²x − 1 = cos(2x) by the double-angle identity. So the equation above is really
        cos(2x) = 0, which means 2x = π/2 + nπ, giving x = π/4 + nπ/2. This shortcut yields the same
        four solutions with less work — knowing identities creates shortcuts throughout.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Verifying Identities — The Rules</Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.9, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>Work on <strong>ONE side only</strong> — never move terms from one side to the other</li>
        <li>Usually start with the more complicated side</li>
        <li>Convert everything to sines and cosines if stuck</li>
        <li>Factor, multiply by conjugates, or find common denominators as needed</li>
        <li>The other side is your <strong>target</strong> — navigate toward it, don't touch it</li>
      </Box>

      <GuideTable
        title="Half-Angle Formulas — Derived from Double-Angle"
        headers={['Formula', 'All forms', 'Sign rule']}
        rows={[
          ['sin(A/2)', '±√[(1 − cos A)/2]', 'Sign depends on which quadrant A/2 lies in'],
          ['cos(A/2)', '±√[(1 + cos A)/2]', 'Sign depends on which quadrant A/2 lies in'],
          ['tan(A/2)', '(1 − cos A)/sin A = sin A/(1 + cos A)', 'Both alternate forms are sign-free — prefer these'],
          ['Power-reduction (sin²)', 'sin²A = (1 − cos 2A)/2', 'Used in integration to lower powers of trig functions'],
          ['Power-reduction (cos²)', 'cos²A = (1 + cos 2A)/2', 'Used in integration to lower powers of trig functions'],
        ]}
      />

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Half-angle example: Find sin(π/8) exactly (without a calculator)'}<br />
        {''}<br />
        {'π/8 is in Q1, so sin(π/8) > 0'}<br />
        {'sin(π/8) = sin(π/4 ÷ 2) = √[(1 − cos(π/4))/2]'}<br />
        {'         = √[(1 − √2/2)/2]'}<br />
        {'         = √[(2 − √2)/4]'}<br />
        {'         = √(2 − √2) / 2   ← exact form'}
      </Box>

      <GuideTable
        title="Product-to-Sum and Sum-to-Product Identities"
        headers={['Identity', 'Formula', 'When useful']}
        rows={[
          ['Product → Sum: sin A sin B', '½[cos(A−B) − cos(A+B)]', 'Converts product into sum; used in physics for beats and in integration'],
          ['Product → Sum: cos A cos B', '½[cos(A−B) + cos(A+B)]', 'Same use cases'],
          ['Product → Sum: sin A cos B', '½[sin(A+B) + sin(A−B)]', 'Mixed product → sum of sines'],
          ['Sum → Product: sin A + sin B', '2 sin((A+B)/2) cos((A−B)/2)', 'Converts sum back to product; useful in solving equations'],
          ['Sum → Product: cos A + cos B', '2 cos((A+B)/2) cos((A−B)/2)', 'Useful in simplifying expressions and solving equations'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Law of Sines and Law of Cosines — Solving Non-Right Triangles</Typography>

      <Analogy
        title="Solving non-right triangles — the right tool for each job"
        body="The Pythagorean theorem and SOH-CAH-TOA only work when you have a right angle to anchor everything. For any other triangle — obtuse, acute, scalene — you need the two universal laws. The Law of Sines is like a proportion machine: it works when you know an angle and the side opposite it. The Law of Cosines is like a powered-up Pythagorean theorem: it works when you know two sides and the angle between them (or all three sides). Pick the law that matches what you're given."
      />

      <GuideTable
        headers={['Law', 'Formula', 'Use when you know', 'Ambiguous case?']}
        rows={[
          ['Law of Sines', 'a/sin A = b/sin B = c/sin C', 'AAS, ASA, or SSA (angle-angle-side / side-side-angle)', 'Yes — SSA can produce 0, 1, or 2 valid triangles (see below)'],
          ['Law of Cosines', 'a² = b² + c² − 2bc·cos A', 'SAS or SSS (side-angle-side / three sides)', 'No ambiguity — one unique solution always (when a solution exists)'],
          ['Area from SAS', 'Area = ½ ab sin C', 'Two sides and the included angle', 'Not applicable'],
          ['Area from Heron\'s', 'A = √(s(s−a)(s−b)(s−c)) where s = (a+b+c)/2', 'All three sides, no angle needed', 'Not applicable'],
        ]}
      />

      <GuideTable
        title="The Ambiguous Case (SSA) — Deciding How Many Triangles"
        headers={['Given', 'Condition', 'Number of Triangles']}
        rows={[
          ['Acute angle A, side a, side b', 'a < b·sin A', '0 triangles (a too short to reach)'],
          ['Acute angle A, side a, side b', 'a = b·sin A', '1 triangle (exactly one — right angle formed)'],
          ['Acute angle A, side a, side b', 'b·sin A < a < b', '2 triangles (two possible positions for vertex C)'],
          ['Acute angle A, side a, side b', 'a ≥ b', '1 triangle (large enough that only one triangle possible)'],
          ['Obtuse angle A, side a, side b', 'a ≤ b', '0 triangles (angle too large)'],
          ['Obtuse angle A, side a, side b', 'a > b', '1 triangle'],
        ]}
      />

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Law of Cosines worked example: a = 8, b = 5, C = 60°'}<br />
        {'  c² = a² + b² − 2ab·cos C'}<br />
        {'     = 64 + 25 − 2(8)(5)cos(60°)'}<br />
        {'     = 89 − 80(0.5)'}<br />
        {'     = 89 − 40 = 49'}<br />
        {'  c = 7'}<br />
        {''}<br />
        {'Now use Law of Sines to find angle A:'}<br />
        {'  a/sin A = c/sin C  →  8/sin A = 7/sin 60°'}<br />
        {'  sin A = 8·sin(60°)/7 = 8(√3/2)/7 = 4√3/7 ≈ 0.990'}<br />
        {'  A = arcsin(0.990) ≈ 81.8°  (check: 81.8 + 60 + B = 180 → B ≈ 38.2°)'}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: Vectors & Parametric Equations
// ─────────────────────────────────────────────────────────────────────
function Section7Vectors() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Vectors — Arrows with Meaning</Typography>

      <Analogy title="Arrows showing force and direction">
        A scalar is just a number — like "5 miles per hour." A vector is a number with a direction attached —
        "5 miles per hour heading northeast." Wind velocity, force, and displacement are all vectors: the
        magnitude tells you how strong, and the direction tells you where. In math, we draw vectors as arrows:
        the length of the arrow is the magnitude, and the arrowhead points in the direction.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A vector <strong>v = ⟨a, b⟩</strong> in component form has horizontal component a and vertical component b.
        This means "go a units right and b units up." The <strong>magnitude</strong> (length) is |v| = √(a² + b²).
        The <strong>direction angle</strong> θ satisfies tan(θ) = b/a — adjust for the correct quadrant using the signs of a and b.
      </Typography>

      <MermaidDiagram chart={`graph LR
  A["Vector Operations"]
  A --> B["Addition: add components\n⟨a,b⟩ + ⟨c,d⟩ = ⟨a+c, b+d⟩"]
  A --> C["Scalar multiplication: multiply each component\nk⟨a,b⟩ = ⟨ka, kb⟩"]
  A --> D["Magnitude: √(a²+b²)"]
  A --> E["Unit vector: v/|v|\n(same direction, length = 1)"]
  A --> F["Dot product: a₁b₁ + a₂b₂\n(scalar result)"]
  F --> G["u·v = |u||v|cosθ\nIf u·v = 0 → perpendicular"]`} />

      <GuideTable
        headers={['Operation', 'Formula', 'Key property']}
        rows={[
          ['Vector addition', '⟨a,b⟩ + ⟨c,d⟩ = ⟨a+c, b+d⟩', 'Commutative and associative'],
          ['Scalar multiplication', 'k⟨a,b⟩ = ⟨ka, kb⟩', 'Scales magnitude; k < 0 reverses direction'],
          ['Dot product', 'u·v = u₁v₁ + u₂v₂', 'Scalar output; 0 means perpendicular'],
          ['Magnitude', '|v| = √(a² + b²)', 'Always non-negative'],
          ['Unit vector', 'v̂ = v/|v|', 'Magnitude = 1; preserves direction'],
          ['Direction angle', 'θ = arctan(b/a) + quadrant adjustment', 'Check quadrant from signs of a and b'],
        ]}
      />

      <Callout kind="in-plain-words">
        The dot product u · v tells you "how much of u goes in the direction of v." When it's zero,
        the vectors are perfectly perpendicular — no component of one goes in the direction of the other.
        When it's positive and large, the vectors point in roughly the same direction. When it's negative,
        they point in roughly opposite directions.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Parametric Equations</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Parametric equations describe a curve by expressing both x and y as functions of a third variable t
        (the parameter). Think of t as time: as t increases, you trace out the path of a moving object.
        Unlike y = f(x), parametric equations can describe curves that cross themselves, go backward, or
        spiral — giving a much richer toolkit for motion problems.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.8 }}>
        {'Parametric: x = 2t,  y = t² − 1'}<br />
        {'Eliminate t: solve for t from the simpler equation'}<br />
        {'  x = 2t  →  t = x/2'}<br />
        {'  Substitute into y: y = (x/2)² − 1 = x²/4 − 1'}<br />
        {'Rectangular form: y = x²/4 − 1  (a parabola)'}
      </Box>

      <Callout kind="watch-for">
        When eliminating the parameter, always check the direction of motion and any domain restrictions.
        The parametric form x = cos(t), y = sin(t) for t ∈ [0, 2π) traces the full unit circle
        counterclockwise — but x = cos(2t), y = sin(2t) traces it twice as fast. The rectangular form
        x² + y² = 1 is the same for both, so the rectangular form loses information about speed and direction.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Polar Coordinates</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Polar coordinates (r, θ) locate a point by its distance r from the origin and angle θ from the positive x-axis.
        Converting: x = r·cos(θ), y = r·sin(θ); r = √(x²+y²), θ = arctan(y/x) + quadrant fix.
      </Typography>
      <GuideTable
        headers={['Polar equation', 'Rectangular form', 'Curve type']}
        rows={[
          ['r = 3', 'x² + y² = 9', 'Circle of radius 3 centered at origin'],
          ['θ = π/4', 'y = x (x ≥ 0)', 'Ray from origin at 45°'],
          ['r = 2cos(θ)', 'x² + y² = 2x → (x−1)² + y² = 1', 'Circle of radius 1, center (1,0)'],
          ['r = a(1 + cos θ)', 'Heart-shaped curve', 'Cardioid'],
        ]}
      />

      <Callout kind="connect">
        Parametric and polar coordinates are connected: any polar equation r = f(θ) can be written
        parametrically as x = f(θ)·cos(θ), y = f(θ)·sin(θ), with θ as the parameter. Both systems
        shine where Cartesian coordinates are awkward — circles, spirals, and motion along curves.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Vector Applications — Work, Projection, and Navigation</Typography>

      <Analogy
        title="Vector projection as casting a shadow"
        body="Imagine shining a flashlight straight down onto a hill. The shadow of a stick on the hill's surface is the projection of the stick onto the direction of the hill — it shows 'how much' of the stick's length runs parallel to the slope. The dot product gives you the length of that shadow: proj_u v = (u·v / |u|²) · u. The dot product is large when the vectors are mostly aligned; it's zero when they're perfectly perpendicular (the shadow has no length — the stick is pointing straight up into the air)."
      />

      <GuideTable
        title="Dot Product Applications"
        headers={['Application', 'Formula', 'Interpretation']}
        rows={[
          ['Angle between vectors', 'cos θ = (u·v) / (|u||v|)', 'θ = arccos of that ratio; range [0°, 180°]'],
          ['Test for perpendicularity', 'u·v = 0', 'The vectors are orthogonal (perpendicular) if and only if their dot product is zero'],
          ['Scalar projection of v onto u', 'comp_u v = (u·v) / |u|', 'How much of v lies in the direction of u — a scalar (positive, negative, or zero)'],
          ['Vector projection of v onto u', 'proj_u v = ((u·v) / |u|²) · u', 'The vector component of v that runs parallel to u'],
          ['Work (physics)', 'W = F · d = |F||d|cos θ', 'Work = force times displacement in the direction of force; only the component of force along displacement does work'],
        ]}
      />

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Navigation example: A plane heads N60°E at 400 mph. Wind is blowing due east at 50 mph.'}<br />
        {'Express as vectors and find true velocity:'}<br />
        {''}<br />
        {'Plane vector: 400 at 60° from north = 400⟨sin 60°, cos 60°⟩ = ⟨200√3, 200⟩'}<br />
        {'Wind vector: 50 due east = ⟨50, 0⟩'}<br />
        {'True velocity: ⟨200√3 + 50, 200⟩ ≈ ⟨396.4, 200⟩'}<br />
        {''}<br />
        {'Ground speed = |true velocity| = √(396.4² + 200²) ≈ 443.8 mph'}<br />
        {'True bearing: θ from north = arctan(396.4/200) ≈ 63.3° east of north'}
      </Box>

      <GuideTable
        title="Common Polar Curves and Their Shapes"
        headers={['Polar Equation', 'Shape', 'Key Feature']}
        rows={[
          ['r = a', 'Circle', 'Center at origin, radius a'],
          ['r = a cos θ', 'Circle', 'Center on x-axis at (a/2, 0), radius a/2'],
          ['r = a sin θ', 'Circle', 'Center on y-axis at (0, a/2), radius a/2'],
          ['r = a(1 + cos θ)', 'Cardioid', 'Heart-shaped; passes through origin; rightward orientation'],
          ['r = a(1 + b cos θ), b > 1', 'Limaçon with inner loop', 'More complex shape with inner loop'],
          ['r = a cos(2θ)', 'Rose curve (4 petals)', 'n petals when n is even (2n petals); n petals when n is odd'],
          ['r² = a² cos(2θ)', 'Lemniscate', 'Figure-eight shape; symmetric about origin and both axes'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Converting Between Forms — Worked Examples</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Convert polar r = 4 cos θ to rectangular:'}<br />
        {'  Multiply both sides by r: r² = 4r cos θ'}<br />
        {'  Substitute: x² + y² = 4x'}<br />
        {'  Complete the square: (x−2)² + y² = 4'}<br />
        {'  Circle of radius 2 centered at (2, 0) ✓'}<br />
        {''}<br />
        {'Convert rectangular (x−1)² + y² = 1 to polar:'}<br />
        {'  Expand: x² − 2x + 1 + y² = 1'}<br />
        {'  Substitute r² = x² + y²: r² − 2r cos θ = 0'}<br />
        {'  Factor: r(r − 2 cos θ) = 0'}<br />
        {'  Polar form: r = 2 cos θ (r = 0 is just the origin, already included)'}
      </Box>

      <GuideTable
        title="Parametric Equations — Eliminating the Parameter for Common Curves"
        headers={['Parametric form', 'Rectangular form', 'Curve']}
        rows={[
          ['x = a cos t, y = b sin t', 'x²/a² + y²/b² = 1', 'Ellipse with semi-axes a (horizontal) and b (vertical)'],
          ['x = a cos t, y = a sin t', 'x² + y² = a²', 'Circle of radius a centered at origin'],
          ['x = t², y = t (t ≥ 0)', 'x = y² (x ≥ 0)', 'Right half of parabola x = y²; t maps to y'],
          ['x = t, y = t² − 4t', 'y = x² − 4x', 'Full parabola; parameter t equals x directly'],
          ['x = cos t, y = 2 sin t, t∈[0,2π)', 'x²/1 + y²/4 = 1', 'Ellipse; traced once counterclockwise as t increases'],
          ['x = r cos(at), y = r sin(bt)', 'Lissajous figure', 'Complex parametric curve; shape depends on ratio a/b'],
        ]}
      />

      <Callout kind="why-it-matters">
        Parametric equations add the dimension of time to curve descriptions. The same ellipse x²/4 + y² = 1
        can be traced clockwise (x = 2 cos t, y = −sin t), counterclockwise (x = 2 cos t, y = sin t), twice
        as fast (x = 2 cos(2t), y = sin(2t)), or starting at a different point. The rectangular form hides
        all this motion information — it just shows the shape. Parametric form shows the full story.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 8: Sequences & Series
// ─────────────────────────────────────────────────────────────────────
function Section8Sequences() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Sequences — Ordered Lists with a Pattern</Typography>

      <Analogy title="Recipes for patterns">
        A sequence is a recipe that tells you how to generate numbers, one after another. An arithmetic sequence
        says "keep adding the same amount" — like adding 3 cups of flour to a recipe batch every time you scale up.
        A geometric sequence says "keep multiplying by the same amount" — like doubling a recipe. The recipe (the rule)
        determines every term. Know the recipe, know the sequence.
      </Analogy>

      <MermaidDiagram chart={`graph LR
  A["Sequence"] --> B{"Subtract consecutive terms\naₙ − aₙ₋₁ = constant?"}
  B -->|Yes| C["Arithmetic\nCommon difference d\naₙ = a₁ + (n−1)d"]
  B -->|No| D{"Divide consecutive terms\naₙ/aₙ₋₁ = constant?"}
  D -->|Yes| E["Geometric\nCommon ratio r\naₙ = a₁·rⁿ⁻¹"]
  D -->|No| F["Neither — look for another pattern\n(or it may be neither type)"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Arithmetic Sequences</Typography>
      <GuideTable
        headers={['Formula', 'What it finds', 'Example (a₁ = 5, d = 3)']}
        rows={[
          ['aₙ = a₁ + (n−1)d', 'nth term (explicit formula)', 'a₁₀ = 5 + 9(3) = 32'],
          ['Sₙ = n/2 · (a₁ + aₙ)', 'Sum of first n terms', 'S₁₀ = 10/2 · (5 + 32) = 185'],
          ['Sₙ = n/2 · (2a₁ + (n−1)d)', 'Same sum, alternate form', 'S₁₀ = 5(10 + 27) = 185 ✓'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Geometric Sequences</Typography>
      <GuideTable
        headers={['Formula', 'What it finds', 'Example (a₁ = 2, r = 3)']}
        rows={[
          ['aₙ = a₁ · rⁿ⁻¹', 'nth term', 'a₅ = 2 · 3⁴ = 162'],
          ['Sₙ = a₁(1 − rⁿ)/(1 − r)', 'Sum of first n terms (r ≠ 1)', 'S₄ = 2(1−81)/(1−3) = 80'],
          ['S∞ = a₁/(1 − r)', 'Sum of infinite series', 'Only when |r| < 1 (converges)'],
        ]}
      />

      <Callout kind="why-it-matters">
        Infinite geometric series appear everywhere: compound interest accumulation over infinitely many
        compounding periods, the total distance a bouncing ball travels (each bounce is a fraction of the
        previous), the decimal 0.999... = 9/10 + 9/100 + ... = (9/10)/(1 − 1/10) = 1. Yes, 0.999... = 1
        exactly — the infinite series converges to 1.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sigma Notation</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Sigma (Σ) is compact notation for a sum. The variable under Σ is the index; the numbers below and above
        are the starting and ending values; the expression to the right of Σ is what gets summed.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.9 }}>
        {'Σ(k=1 to 5) (2k + 1)  =  3 + 5 + 7 + 9 + 11  =  35'}<br />
        {''}<br />
        {'Σ(k=1 to 4) 3·(1/2)^(k−1)  =  3 + 3/2 + 3/4 + 3/8  =  45/8'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Limits of Sequences</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A sequence {'{'}aₙ{'}'} converges if its terms approach a finite value L as n → ∞. It diverges otherwise.
        To find the limit: divide numerator and denominator by the highest power of n.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.8 }}>
        {'aₙ = (2n + 1) / n'}<br />
        {'     = (2 + 1/n) / 1'}<br />
        {'As n → ∞: 1/n → 0,  so  aₙ → 2'}<br />
        {''}<br />
        {'Geometric: aₙ = (1/2)ⁿ → 0  (since |1/2| < 1)'}
      </Box>

      <Callout kind="connect">
        The convergence of infinite geometric series and the limit of geometric sequences are the same idea:
        a geometric sequence with |r| &lt; 1 has terms approaching zero (sequence converges to 0), and the series
        (sum of all terms) converges to a finite value a₁/(1 − r). Both rely on the same condition: |r| &lt; 1.
      </Callout>

      <MermaidDiagram chart={`graph TD
  A["Does the infinite geometric series converge?"]
  A --> B{"Is |r| < 1?"}
  B -->|Yes| C["Converges!\nS∞ = a₁ / (1 − r)"]
  B -->|No: |r| ≥ 1| D{"Is r = 1?"}
  D -->|Yes| E["All terms equal a₁\nSum grows without bound → diverges"]
  D -->|No| F["Terms grow or oscillate\n→ diverges (no finite sum)"]`} />

      <Callout kind="try-this">
        A ball is dropped from 10 meters and bounces back to 80% of its height each time. Total distance
        traveled (up and down) after the first bounce: S = 10 + 2·(8) + 2·(6.4) + 2·(5.12) + ...
        = 10 + 2·Σ(k=1 to ∞) 10·(0.8)ᵏ = 10 + 2·(8/(1−0.8)) = 10 + 80 = 90 meters.
        Infinite bounces, finite total distance — because |0.8| &lt; 1.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Binomial Theorem — Expanding (a + b)ⁿ</Typography>

      <Analogy
        title="The Binomial Theorem as an organized gift-wrapping system"
        body="When you expand (a + b)³ by hand, you multiply three copies of (a + b) together and collect like terms. Pascal's Triangle is a shortcut: each row gives the coefficients for the corresponding power, so you never have to multiply everything out by brute force. The Binomial Theorem generalizes this with combination notation C(n,k) — the coefficient of each term is a 'how many ways can I choose k copies of b from n factors' count. The exponents of a decrease from n to 0 while the exponents of b increase from 0 to n."
      />

      <GuideTable
        title="Pascal's Triangle — First Six Rows"
        headers={['n', 'Row values', 'Expansion coefficients']}
        rows={[
          ['0', '1', '(a+b)⁰ = 1'],
          ['1', '1  1', '(a+b)¹ = a + b'],
          ['2', '1  2  1', '(a+b)² = a² + 2ab + b²'],
          ['3', '1  3  3  1', '(a+b)³ = a³ + 3a²b + 3ab² + b³'],
          ['4', '1  4  6  4  1', '(a+b)⁴ = a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴'],
          ['5', '1  5  10  10  5  1', '(a+b)⁵ = a⁵ + 5a⁴b + 10a³b² + 10a²b³ + 5ab⁴ + b⁵'],
        ]}
      />

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The <strong>Binomial Theorem</strong>: (a + b)ⁿ = Σ(k=0 to n) C(n,k) · aⁿ⁻ᵏ · bᵏ
        where C(n,k) = n! / (k!(n−k)!) is the binomial coefficient "n choose k."
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 1.9 }}>
        {'Expand (2x − 3)⁴ using the Binomial Theorem with a = 2x, b = −3, n = 4:'}<br />
        {''}<br />
        {'k=0: C(4,0)(2x)⁴(−3)⁰ = 1 · 16x⁴ · 1     =  16x⁴'}<br />
        {'k=1: C(4,1)(2x)³(−3)¹ = 4 · 8x³ · (−3)   = −96x³'}<br />
        {'k=2: C(4,2)(2x)²(−3)² = 6 · 4x² · 9       = 216x²'}<br />
        {'k=3: C(4,3)(2x)¹(−3)³ = 4 · 2x · (−27)   = −216x'}<br />
        {'k=4: C(4,4)(2x)⁰(−3)⁴ = 1 · 1 · 81        =   81'}<br />
        {''}<br />
        {'Result: 16x⁴ − 96x³ + 216x² − 216x + 81'}
      </Box>

      <Callout kind="watch-for">
        When b is negative, the signs in the expansion alternate (−, +, −, +, ...). Keep the negative
        inside the b term throughout — do NOT apply the sign separately. The b in C(n,k)aⁿ⁻ᵏbᵏ should
        be −3, not 3, so (−3)² = +9 naturally. Forgetting the sign on odd powers of b is the most
        common Binomial Theorem error.
      </Callout>

      <GuideTable
        title="Mathematical Induction — Proof by Dominos"
        headers={['Step', 'What to do', 'Purpose']}
        rows={[
          ['Base case', 'Verify the statement is true for n = 1 (or the starting value)', 'Knocks down the first domino'],
          ['Inductive hypothesis', 'Assume the statement is true for n = k (arbitrary but fixed k)', 'Temporarily accept that the kth domino is knocked down'],
          ['Inductive step', 'Prove the statement is true for n = k + 1 using the hypothesis', 'Show that if domino k falls, domino k+1 must follow'],
          ['Conclusion', 'By the principle of mathematical induction, the statement is true for all positive integers n', 'All dominoes fall — the proof is complete'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Permutations and Combinations — Counting Techniques</Typography>

      <Analogy
        title="Permutations as choosing an order; combinations as choosing a group"
        body="Suppose you want to choose 3 students from a class of 20 to be president, vice-president, and treasurer. Order matters — president first is different from president second. This is a permutation: P(20,3) = 20 × 19 × 18. Now suppose you just want a 3-person committee with no ranks. Order doesn't matter — the same three students form one committee regardless of order. Divide out the number of orderings of 3 people (3! = 6) to get a combination: C(20,3) = P(20,3)/3! = 1140."
      />

      <GuideTable
        headers={['Concept', 'Formula', 'When order matters?', 'Example']}
        rows={[
          ['Permutation P(n, r)', 'n! / (n−r)!', 'YES — each arrangement is different', 'Number of ways to arrange 4 of 8 books: P(8,4) = 8!/4! = 1680'],
          ['Combination C(n, r)', 'n! / [r!(n−r)!]', 'NO — only selection matters', 'Ways to choose 4 of 8 books: C(8,4) = 70'],
          ['Relationship', 'C(n,r) = P(n,r) / r!', 'Divide by r! to remove order', 'C counts unordered groups; P counts ordered arrangements'],
          ['Complement rule', 'C(n,r) = C(n, n−r)', 'Choosing r is same as leaving out n−r', 'C(10,7) = C(10,3) = 120 — easier computation'],
          ['Pascal\'s identity', 'C(n,r) = C(n−1,r−1) + C(n−1,r)', 'Adding two entries gives next row\'s entry', 'Foundation of Pascal\'s Triangle construction'],
          ['Total selections from n items', '2ⁿ subsets (including empty set)', 'Each item is either in or out: 2 choices each', 'From {A, B, C}: 8 subsets — ∅, {A}, {B}, {C}, {AB}, {AC}, {BC}, {ABC}'],
        ]}
      />

      <GuideTable
        title="Sequences, Series, and Finance — Key Connections"
        headers={['Financial concept', 'Math model', 'Formula']}
        rows={[
          ['Simple interest', 'Arithmetic sequence — interest added each period', 'A = P(1 + rt); same amount added each year'],
          ['Compound interest', 'Geometric sequence — balance multiplied each period', 'A = P(1 + r/n)^(nt); constant multiplier each compounding'],
          ['Annuity (regular deposits)', 'Geometric series sum — each deposit grows differently', 'FV = PMT · [(1 + r)ⁿ − 1] / r'],
          ['Loan amortization', 'Present value of annuity — working backwards', 'PV = PMT · [1 − (1+r)⁻ⁿ] / r; solve for PMT to find payment'],
          ['Perpetuity (payments forever)', 'Infinite geometric series S∞ = a/(1−r)', 'PV = PMT / r; valid when r > 0 (rate per period)'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section: Strategy
// ─────────────────────────────────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Pre-Calculus Exam-Day Strategy</Typography>

      <Callout kind="coachs-note">
        Pre-Calculus tests cover a wide range of unrelated-looking topics in one sitting. The most valuable
        exam skill is topic identification: within 10 seconds of reading a question, know which section it
        belongs to and which formula set applies. The rest is execution.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 1: Classify before you calculate</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Every Pre-Calculus question belongs to one of the seven topic areas. Read the question and ask: Is this
        about a function transformation? A polynomial zero? A log equation? A trig identity? A vector? A series?
        Choosing the wrong category almost guarantees the wrong method.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 2: Transformation problems — read the notation</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For transformation questions, identify what is inside the function (horizontal effects) versus outside
        (vertical effects). Write down each transformation in order: horizontal shifts, reflections, stretches,
        vertical shifts. Apply them to key points rather than recomputing the whole graph.
      </Typography>

      <Callout kind="watch-for">
        The five most common Pre-Calculus mistakes: (1) confusing horizontal and vertical transformation rules
        (inside vs. outside); (2) applying log rules to sums instead of products; (3) giving the wrong
        principal value for inverse trig (forgetting the restricted range); (4) using the wrong form of cos(2A)
        for the context; (5) confusing "converges" with "diverges" on the |r| &lt; 1 threshold for geometric series.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 3: Trig identity strategy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When you see a complex trig expression: convert everything to sin and cos as a starting point.
        Look for Pythagorean substitutions (sin²θ = 1 − cos²θ). Factor before expanding.
        If you're stuck, multiply numerator and denominator by the conjugate of the denominator.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 4: For sequences, write out the first four terms</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When given a recursive or explicit sequence formula, compute the first four terms.
        Arithmetic sequences have a constant difference; geometric sequences have a constant ratio.
        Seeing the actual numbers makes the pattern visible and the formula verification fast.
      </Typography>

      <Callout kind="make-it-stick">
        For the formula sheet you're allowed (if any): know WHERE the formulas are, not just that they exist.
        On a timed test, hunting for a formula costs valuable minutes. During your study sessions, practice
        finding each formula in under 5 seconds. If you're not allowed a formula sheet, the seven hardest
        formulas to memorize are: sum/difference for cos, law of cosines, geometric series sum (finite and infinite),
        double-angle forms for cos, and the inverse trig ranges.
      </Callout>

      <GuideTable
        title="Topic Classification Practice — Read the Question, Name the Method"
        headers={['Question type / keywords', 'Topic', 'First move']}
        rows={[
          ['"f(x−2) + 3" or "shifted", "stretched"', 'Function Transformations (§2)', 'Identify A, B, C, D parameters; apply transformation rules to key points'],
          ['"zeros", "roots", "factors of polynomial"', 'Polynomial Functions (§3)', 'Rational Zeros Theorem → synthetic division → quadratic formula for remainder'],
          ['"holes", "asymptotes", "rational function"', 'Rational Functions (§3)', 'Factor both, cancel commons → holes; remaining zeros of den → VA; degree comparison → HA'],
          ['"exponential growth", "compound interest", "half-life"', 'Exponential Functions (§4)', 'Write A = P·bᵗ or A = Peʳᵗ; isolate the exponent; take log of both sides'],
          ['"solve for x", "log equation", "expand logarithm"', 'Logarithmic Functions (§4)', 'Apply log rules to simplify; exponentiate to remove log; check for extraneous solutions'],
          ['"unit circle value", "exact value", "sin/cos/tan of angle"', 'Trig Functions (§5)', 'Identify the reference angle, quadrant, and ASTC sign; use special triangle values'],
          ['"amplitude", "period", "phase shift", "midline"', 'Sinusoidal Graphing (§5)', 'Read A, B, C, D from y = A sin(Bx+C)+D; period = 2π/|B|; phase = −C/B'],
          ['"prove identity", "verify", "simplify trig expression"', 'Analytic Trig (§6)', 'Start on more complex side; convert to sin/cos; look for Pythagorean substitution'],
          ['"solve trig equation", "find all solutions"', 'Analytic Trig (§6)', 'Isolate trig function; find reference angle; list all solutions in given interval'],
          ['"triangle with no right angle", "law of sines/cosines"', 'Analytic Trig — Laws (§6)', 'SSA or AAS → Law of Sines (check ambiguous case); SAS or SSS → Law of Cosines'],
          ['"component form", "dot product", "perpendicular vectors"', 'Vectors (§7)', 'Dot product = 0 means perpendicular; angle θ: cos θ = u·v/(|u||v|)'],
          ['"eliminate the parameter", "parametric to rectangular"', 'Parametric Equations (§7)', 'Solve one equation for t; substitute into the other; simplify to y = f(x) form'],
          ['"polar to rectangular", "r = ...", "cardioid"', 'Polar Coordinates (§7)', 'Use x = r cos θ, y = r sin θ, r² = x²+y²; complete the square if needed'],
          ['"arithmetic sequence", "common difference", "sum of terms"', 'Sequences (§8)', 'Identify a₁ and d; use aₙ = a₁+(n−1)d for nth term; Sₙ = n/2(a₁+aₙ)'],
          ['"geometric sequence", "common ratio", "infinite series"', 'Sequences (§8)', 'Check |r| < 1 for convergence; S∞ = a₁/(1−r); Sₙ = a₁(1−rⁿ)/(1−r)'],
          ['"expand", "binomial", "C(n,k)"', 'Binomial Theorem (§8)', 'Term k: C(n,k)·aⁿ⁻ᵏ·bᵏ; signs follow from b (keep negative in b, not separate)'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 5: Use the answer choices as clues</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        If all answer choices are in the form (a ± √b)/c, the method involves a quadratic or a radical.
        If the choices are like π/6, π/4, π/3, π/2, you're solving a trig equation.
        If choices are pure integers or simple fractions, check your arithmetic before assuming you got it wrong.
      </Typography>

      <Callout kind="in-plain-words">
        Partial credit is real on many Pre-Calc tests. Even if you can't finish a problem, write down:
        the formula you're using, the substitution you made, and the setup. A correct setup with an arithmetic
        error in the final step often earns most of the points. Never leave a problem completely blank
        if you know the topic — write what you know.
      </Callout>

      <GuideTable
        title="Quick-Reference: Every Essential Formula"
        headers={['Topic', 'Formula / Rule', 'When to use']}
        rows={[
          ['Transformation: shift right h', 'f(x − h) → graph moves RIGHT h', 'See (x − h) INSIDE the function'],
          ['Transformation: vertical stretch a', 'a·f(x) → multiply all y-values by a', 'See coefficient OUTSIDE the function'],
          ['Composition', '(f ∘ g)(x) = f(g(x)) — apply g first', 'Nested functions; unpack inside-out'],
          ['Inverse', 'Swap x and y, solve for y; verify f(f⁻¹(x)) = x', 'Find f⁻¹; check one-to-one first'],
          ['End behavior (even degree, + lead)', 'Both ends UP: x → ±∞, f(x) → +∞', 'Like y = x²'],
          ['End behavior (odd degree, + lead)', 'Left DOWN, Right UP', 'Like y = x³'],
          ['Multiplicity (even)', 'Graph BOUNCES at that zero', 'Factor appears an even number of times'],
          ['Rational Zeros Theorem', 'Candidates: ±(factors of constant)/(factors of leading coeff)', 'Finding rational zeros of integer-coefficient polynomial'],
          ['Synthetic division', 'Divide by (x − c): bring down, multiply by c, add', 'Test a candidate zero; c goes in the box'],
          ['Log product rule', 'log(MN) = log M + log N', 'Multiplication inside → addition outside'],
          ['Log quotient rule', 'log(M/N) = log M − log N', 'Division inside → subtraction outside'],
          ['Log power rule', 'log(Mⁿ) = n·log M', 'Exponent slides out as coefficient'],
          ['Change of base', 'logb(x) = log(x)/log(b)', 'Convert any base to base 10 or e for calculator'],
          ['Compound interest', 'A = P(1 + r/n)^(nt)', 'n compoundings/year; grows to A from principal P'],
          ['Continuous compounding', 'A = Peʳᵗ', 'n → ∞; uses e'],
          ['Amplitude (sinusoidal)', '|A| in y = A sin(Bx + C) + D', 'Half the total height of the wave'],
          ['Period (sinusoidal)', '2π/|B|', 'Length of one complete cycle'],
          ['Phase shift', '−C/B (right if positive)', 'Horizontal starting point of the wave'],
          ['Pythagorean identity', 'sin²θ + cos²θ = 1', 'Foundation of all trig algebra; memorize first'],
          ['sin(A ± B)', 'sin A cos B ± cos A sin B', '"sin cos ± cos sin"; sign matches ±'],
          ['cos(A ± B)', 'cos A cos B ∓ sin A sin B', '"cos cos ∓ sin sin"; sign FLIPS'],
          ['sin(2A)', '2 sin A cos A', 'Only one form — must know cold'],
          ['cos(2A)', 'cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A', 'Three forms — pick the one matching other terms in problem'],
          ['Law of Sines', 'a/sin A = b/sin B = c/sin C', 'AAS, ASA, or SSA (ambiguous case)'],
          ['Law of Cosines', 'a² = b² + c² − 2bc cos A', 'SAS or SSS; also use to find missing angle'],
          ['Triangle area (SAS)', 'Area = ½ ab sin C', 'Two sides and the included angle'],
          ['Dot product', 'u·v = u₁v₁ + u₂v₂ = |u||v|cos θ', 'Find angle between vectors; check perpendicularity (= 0)'],
          ['Arc length', 's = rθ (θ in radians)', 'Central angle in radians × radius'],
          ['Sector area', 'A = ½r²θ (θ in radians)', 'Same structure as arc length'],
          ['Arithmetic nth term', 'aₙ = a₁ + (n−1)d', 'Linear pattern; d = common difference'],
          ['Arithmetic sum', 'Sₙ = n/2 · (a₁ + aₙ)', 'Average of first and last times count'],
          ['Geometric nth term', 'aₙ = a₁ · rⁿ⁻¹', 'Exponential pattern; r = common ratio'],
          ['Geometric sum (finite)', 'Sₙ = a₁(1 − rⁿ)/(1 − r)', 'r ≠ 1; finite number of terms'],
          ['Geometric sum (infinite)', 'S∞ = a₁/(1 − r), only if |r| < 1', 'Converges only when |r| < 1'],
          ['Binomial theorem kth term', 'C(n,k) · aⁿ⁻ᵏ · bᵏ (k starts at 0)', 'Find specific term in expansion without expanding all of it'],
          ['Convert polar to rectangular', 'x = r cos θ, y = r sin θ', 'From (r, θ) to (x, y)'],
          ['Convert rectangular to polar', 'r = √(x²+y²), θ = arctan(y/x) + quadrant fix', 'From (x, y) to (r, θ); fix quadrant based on signs of x and y'],
        ]}
      />

      <GuideTable
        title="Topic-by-Topic Error Prevention Checklist"
        headers={['Topic', 'Trap to avoid', 'Safe habit']}
        rows={[
          ['Function transformations', 'Inside-outside confusion — thinking (x−3) shifts left', 'Horizontal effects inside the function are OPPOSITE the sign: (x−3) → shift RIGHT 3'],
          ['Log rules', 'log(M + N) ≠ log M + log N', 'Log rules apply to products and quotients, never to sums or differences of arguments'],
          ['Log equations', 'Forgetting to check for extraneous solutions', 'Always substitute back; reject any x making a log argument ≤ 0'],
          ['Inverse trig', 'Giving both possible angles (e.g., 30° AND 150°) when asked for arcsin', 'Inverse trig returns the PRINCIPAL VALUE only — the one in the restricted range'],
          ['Trig identities', 'Moving terms from one side to the other', 'Work on ONE side only; the other side is a target, not a workspace'],
          ['Rational functions', 'Missing holes — calling every denominator zero a vertical asymptote', 'If a factor cancels from numerator and denominator, it\'s a HOLE, not an asymptote'],
          ['Synthetic division', 'Wrong sign for c — using +3 when dividing by (x−3)', 'Synthetic division uses the VALUE of c (what makes the factor zero): (x−3) → c = +3'],
          ['Complex zeros', 'Thinking a real-coefficient polynomial can have just one complex zero', 'Complex zeros come in conjugate pairs — never alone'],
          ['Law of Sines (SSA)', 'Assuming there\'s always exactly one triangle', 'SSA is ambiguous: compute b·sin A and compare to a to determine 0, 1, or 2 solutions'],
          ['Geometric series convergence', 'Forgetting to check |r| < 1 before using S∞ formula', 'If |r| ≥ 1, there is no finite sum — the series diverges'],
          ['Binomial theorem', 'Getting the sign wrong when b is negative', 'Keep the negative inside: b = −3, then (−3)² = +9 comes out naturally'],
          ['Parametric equations', 'Losing direction/speed information when converting to rectangular form', 'Rectangular form is the curve shape; parametric form also gives direction and rate of traversal'],
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Pre-Calculus Glossary</Typography>
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
