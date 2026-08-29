// SAT Study Guide — comprehensive content review with strategies for all domains.

import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

interface Section {
  id: string;
  title: string;
  icon: string;
  section: 'rw' | 'math' | 'strategy';
  content: React.ReactNode;
}

export default function StudyGuide() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState<string | false>('test-overview');

  const ACCENT = isDark ? '#5B9BD5' : '#003366';
  const CARD_BG = isDark ? '#1B2838' : '#FFFFFF';
  const BORDER = isDark ? '#2D4A6A' : '#D4E3F5';
  const TEXT_PRI = isDark ? '#E8F0FE' : '#0D1B2A';
  const TEXT_SEC = isDark ? '#8BACC8' : '#4A6D8C';
  const TIP_BG = isDark ? '#1E3A5F' : '#E8F4FD';
  const FORMULA_BG = isDark ? '#0D1B2A' : '#F5F8FC';

  const handleChange = (panel: string) => (_: unknown, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const Tip = ({ children }: { children: React.ReactNode }) => (
    <Paper elevation={0} sx={{ p: 2, my: 1, borderRadius: 1, bgcolor: TIP_BG, border: `1px solid ${BORDER}` }}>
      <Typography variant="body2" sx={{ color: TEXT_PRI }}>💡 <strong>SAT Tip:</strong> {children}</Typography>
    </Paper>
  );

  const Formula = ({ children }: { children: React.ReactNode }) => (
    <Paper elevation={0} sx={{ p: 1.5, my: 1, borderRadius: 1, bgcolor: FORMULA_BG, border: `1px solid ${BORDER}`, fontFamily: 'monospace' }}>
      <Typography variant="body2" sx={{ color: TEXT_PRI, fontFamily: 'monospace' }}>{children}</Typography>
    </Paper>
  );

  const sections: Section[] = [
    {
      id: 'test-overview',
      title: 'SAT Test Overview & Format',
      icon: '📋',
      section: 'strategy',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            The Digital SAT is a <strong>multistage adaptive test</strong> administered on the Bluebook™ app.
            It consists of two main sections — Reading & Writing and Math — each split into two modules.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Structure:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • <strong>Reading & Writing:</strong> 54 questions, 64 minutes (Module 1: 27 Qs/32 min, Module 2: 27 Qs/32 min)<br/>
            • <strong>Math:</strong> 44 questions, 70 minutes (Module 1: 22 Qs/35 min, Module 2: 22 Qs/35 min)<br/>
            • <strong>Break:</strong> 10 minutes between sections<br/>
            • <strong>Total:</strong> 98 questions, 134 minutes
          </Typography>
          <Tip>Module 1 is mixed difficulty. If you do well, Module 2 will be harder (but has higher scoring potential). Don't panic if Module 2 feels harder — that's a good sign!</Tip>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Scoring:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • Total score: 400–1600 (sum of two section scores)<br/>
            • Each section: 200–800<br/>
            • No penalty for wrong answers — always guess if unsure!<br/>
            • Scores released within days
          </Typography>
          <Tip>There is NO penalty for guessing. Never leave a question blank. Even a random guess gives you a 25% chance!</Tip>
        </Stack>
      ),
    },
    {
      id: 'rw-info',
      title: 'Information and Ideas',
      icon: '📖',
      section: 'rw',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            This domain tests your ability to understand, analyze, and use information from passages. Think of it as
            "comprehension on steroids" — you need to identify what the text says AND what it implies.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Key Skills:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Central Ideas & Details:</strong><br/>
            • Identify the main idea or purpose of a passage<br/>
            • Locate specific details that support the main idea<br/>
            • Distinguish between primary and secondary points<br/><br/>
            <strong>Inferences:</strong><br/>
            • Draw logical conclusions from evidence in the text<br/>
            • Identify what is implied but not directly stated<br/>
            • Connect ideas across different parts of a passage<br/><br/>
            <strong>Quantitative Information:</strong><br/>
            • Interpret data from tables, charts, or graphs<br/>
            • Connect quantitative data to claims made in the text<br/>
            • Identify trends and patterns in data displays
          </Typography>
          <Tip>For "main idea" questions, read the first and last sentences of the passage carefully — they usually frame the central argument.</Tip>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Strategy:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            1. Read the passage actively — underline key claims<br/>
            2. For inference questions, look for what MUST be true based on the evidence<br/>
            3. Eliminate answers that go beyond what the passage supports<br/>
            4. For data questions, read axis labels and units carefully before looking at answer choices
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'rw-craft',
      title: 'Craft and Structure',
      icon: '🔍',
      section: 'rw',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            This domain focuses on HOW authors write — their word choices, structural decisions, and persuasive techniques.
            Think of yourself as a text detective examining the author's toolkit.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Key Skills:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Words in Context:</strong><br/>
            • Determine meaning of words/phrases based on surrounding context<br/>
            • Identify how word choice affects tone or meaning<br/>
            • Distinguish between similar words with different connotations<br/><br/>
            <strong>Text Structure & Purpose:</strong><br/>
            • Identify organizational patterns (cause/effect, compare/contrast, chronological)<br/>
            • Determine why an author included a specific sentence or paragraph<br/>
            • Analyze how parts of a text relate to the whole<br/><br/>
            <strong>Rhetoric & Arguments:</strong><br/>
            • Identify an author's claim or thesis<br/>
            • Evaluate how evidence supports or undermines an argument<br/>
            • Recognize rhetorical devices (analogy, appeal to authority, counterargument)
          </Typography>
          <Tip>For vocabulary questions, ALWAYS re-read the sentence with each answer choice plugged in. The "obvious" dictionary definition is often a trap — context is everything.</Tip>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Common Vocabulary Traps:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • "Elevated" can mean physically higher OR more sophisticated<br/>
            • "Novel" can mean a book OR something new/unusual<br/>
            • "Grave" can mean a burial site OR serious/solemn<br/>
            • "Conventional" can mean an event OR traditional/expected<br/>
            • "Singular" can mean one OR remarkable/unique
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'rw-expression',
      title: 'Expression of Ideas',
      icon: '✍️',
      section: 'rw',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            This domain is about making writing BETTER. You'll revise sentences and passages for clarity,
            effectiveness, and logical flow. Think: "How would an editor improve this?"
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Key Skills:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Organization:</strong><br/>
            • Choose the best transition between ideas<br/>
            • Determine the most logical placement for a sentence<br/>
            • Select effective introductions and conclusions<br/><br/>
            <strong>Effective Language Use:</strong><br/>
            • Eliminate wordiness and redundancy<br/>
            • Choose the most precise word or phrase<br/>
            • Maintain consistent tone and style<br/><br/>
            <strong>Development:</strong><br/>
            • Add evidence that strengthens an argument<br/>
            • Choose the most relevant example or detail<br/>
            • Ensure claims are adequately supported
          </Typography>
          <Tip>When choosing transitions, ask: "What's the logical relationship?" Addition (furthermore, moreover), contrast (however, nevertheless), cause (therefore, consequently), example (for instance, specifically).</Tip>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Common Transitions:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • <strong>Addition:</strong> furthermore, moreover, additionally, in addition<br/>
            • <strong>Contrast:</strong> however, nevertheless, on the other hand, conversely<br/>
            • <strong>Cause/Effect:</strong> therefore, consequently, as a result, thus<br/>
            • <strong>Example:</strong> for instance, specifically, in particular, notably<br/>
            • <strong>Conclusion:</strong> in summary, ultimately, in conclusion, overall
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'rw-conventions',
      title: 'Standard English Conventions',
      icon: '📝',
      section: 'rw',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            This is the "grammar" domain. You need to know the rules of standard written English —
            sentence structure, usage, and punctuation. The good news: it's the most learnable domain!
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Key Rules:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Sentence Structure:</strong><br/>
            • Fix run-on sentences (two independent clauses need proper joining)<br/>
            • Fix fragments (every sentence needs a subject + verb + complete thought)<br/>
            • Parallel structure (items in a list must match grammatically)<br/>
            • Misplaced modifiers (descriptors must be next to what they describe)<br/><br/>
            <strong>Usage:</strong><br/>
            • Subject-verb agreement (singular subjects → singular verbs)<br/>
            • Pronoun-antecedent agreement (pronouns must match their referent)<br/>
            • Verb tense consistency (don't shift tenses without reason)<br/>
            • Who vs. whom (who = subject, whom = object)<br/><br/>
            <strong>Punctuation:</strong><br/>
            • Commas: after introductory elements, between items in a list, around non-essential info<br/>
            • Semicolons: connect two related independent clauses<br/>
            • Colons: introduce a list or explanation (must follow a complete sentence)<br/>
            • Dashes: set off parenthetical info (like commas but more emphatic)<br/>
            • Apostrophes: possessives (dog's) and contractions (don't) — NOT plurals!
          </Typography>
          <Tip>The #1 tested punctuation rule: use a semicolon (;) between two independent clauses that are closely related. If you can put a period, you can use a semicolon instead.</Tip>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Quick Mnemonics:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • <strong>FANBOYS</strong> (For, And, Nor, But, Or, Yet, So) = coordinating conjunctions. Use comma + FANBOYS to join independent clauses.<br/>
            • <strong>Its vs. It's</strong>: "It's" ALWAYS means "it is." Possessive "its" has NO apostrophe (like "his" or "hers").<br/>
            • <strong>Who/Whom test</strong>: Replace with he/him. "He did it" → who. "Give it to him" → whom.
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'math-algebra',
      title: 'Algebra',
      icon: '📐',
      section: 'math',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            Algebra is the largest math domain (~35% of questions). It focuses on linear equations, inequalities,
            systems, and functions. Think of it as the foundation — master this and you've mastered a third of the math section.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Key Concepts:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Linear Equations:</strong><br/>
            • Slope-intercept form: y = mx + b (m = slope, b = y-intercept)<br/>
            • Point-slope form: y - y₁ = m(x - x₁)<br/>
            • Standard form: Ax + By = C<br/>
            • Slope = rise/run = (y₂ - y₁)/(x₂ - x₁)
          </Typography>
          <Formula>y = mx + b → slope = m, y-intercept = (0, b)</Formula>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Systems of Equations:</strong><br/>
            • Substitution: solve one equation for a variable, plug into the other<br/>
            • Elimination: add/subtract equations to eliminate a variable<br/>
            • No solution: parallel lines (same slope, different y-intercept)<br/>
            • Infinite solutions: same line (identical equations when simplified)
          </Typography>
          <Formula>{'No solution: a₁/a₂ = b₁/b₂ ≠ c₁/c₂'}</Formula>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Linear Inequalities:</strong><br/>
            • Same rules as equations, BUT flip the sign when multiplying/dividing by negative<br/>
            • Graphing: solid line for ≤ or ≥, dashed for {'<'} or {'>'}<br/>
            • Shading: test a point (usually origin) to determine which side to shade
          </Typography>
          <Tip>When a word problem asks "at least," think ≥. "At most" means ≤. "More than" means {'>'}. "Fewer than" means {'<'}.</Tip>
        </Stack>
      ),
    },
    {
      id: 'math-advanced',
      title: 'Advanced Math',
      icon: '🧮',
      section: 'math',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            Advanced Math tests your ability to work with nonlinear expressions — quadratics, polynomials,
            and exponentials. These are the questions that separate 600-level scores from 700+ scores.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Key Concepts:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Quadratic Equations:</strong><br/>
            • Standard form: ax² + bx + c = 0<br/>
            • Factored form: a(x - r₁)(x - r₂) = 0 (r₁, r₂ are roots)<br/>
            • Vertex form: a(x - h)² + k (vertex at (h, k))<br/>
            • Quadratic formula: x = (-b ± √(b² - 4ac)) / 2a
          </Typography>
          <Formula>x = (-b ± √(b² - 4ac)) / 2a</Formula>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Discriminant (b² - 4ac):</strong><br/>
            • Positive → 2 real solutions<br/>
            • Zero → 1 real solution (perfect square)<br/>
            • Negative → no real solutions<br/><br/>
            <strong>Polynomials:</strong><br/>
            • Factor out GCF first<br/>
            • Difference of squares: a² - b² = (a+b)(a-b)<br/>
            • Sum of roots = -b/a, Product of roots = c/a<br/><br/>
            <strong>Exponential Functions:</strong><br/>
            • Growth: f(x) = a · bˣ where b {'>'} 1<br/>
            • Decay: f(x) = a · bˣ where 0 {'<'} b {'<'} 1<br/>
            • Doubling time: f(t) = a · 2^(t/d)
          </Typography>
          <Tip>If a quadratic question asks for the sum or product of solutions, use Vieta's formulas (sum = -b/a, product = c/a) — no need to solve!</Tip>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Function Operations:</strong><br/>
            • f(g(x)) means "plug g(x) into f"<br/>
            • (f + g)(x) = f(x) + g(x)<br/>
            • f(x) = 0 means "find the x-intercepts"<br/>
            • f(0) means "find the y-intercept"
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'math-problem',
      title: 'Problem Solving & Data Analysis',
      icon: '📊',
      section: 'math',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            This domain is all about applying math to real-world situations — ratios, percentages, statistics,
            and data interpretation. Calculator is allowed, but smart setup often beats brute force.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Key Concepts:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Ratios & Proportions:</strong><br/>
            • Cross-multiply to solve: a/b = c/d → ad = bc<br/>
            • Unit rates: divide to find "per one" values<br/>
            • Scale factors: multiply all dimensions by the same factor<br/><br/>
            <strong>Percentages:</strong><br/>
            • Percent change = (new - old) / old × 100<br/>
            • "X is what percent of Y" → X/Y × 100<br/>
            • Successive percents: multiply decimals (e.g., 20% increase then 10% decrease = 1.2 × 0.9 = 1.08)<br/><br/>
            <strong>Statistics:</strong><br/>
            • Mean = sum / count<br/>
            • Median = middle value (or average of two middle values)<br/>
            • Mode = most frequent value<br/>
            • Standard deviation = spread from mean (higher = more spread)<br/>
            • Range = max - min
          </Typography>
          <Formula>Percent change = ((New - Old) / Old) × 100%</Formula>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Probability:</strong><br/>
            • P(event) = favorable outcomes / total outcomes<br/>
            • P(A and B) = P(A) × P(B) [if independent]<br/>
            • P(A or B) = P(A) + P(B) - P(A and B)<br/>
            • Conditional: P(A|B) = P(A and B) / P(B)
          </Typography>
          <Tip>For statistics questions about "adding/removing a data point," think about whether the new value is above or below the current mean. Above → mean increases. Below → mean decreases.</Tip>
        </Stack>
      ),
    },
    {
      id: 'math-geometry',
      title: 'Geometry & Trigonometry',
      icon: '📏',
      section: 'math',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            Geometry & Trig is ~15% of the math section. You need to know key formulas and properties —
            the reference sheet provides some, but knowing them cold saves precious time.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Essential Formulas:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Area:</strong><br/>
            • Rectangle: A = lw<br/>
            • Triangle: A = ½bh<br/>
            • Circle: A = πr²<br/>
            • Trapezoid: A = ½(b₁ + b₂)h
          </Typography>
          <Formula>{'Circle: A = πr², C = 2πr, Arc = (θ/360)×2πr'}</Formula>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Volume:</strong><br/>
            • Rectangular prism: V = lwh<br/>
            • Cylinder: V = πr²h<br/>
            • Cone: V = ⅓πr²h<br/>
            • Sphere: V = ⁴⁄₃πr³<br/><br/>
            <strong>Triangles:</strong><br/>
            • Pythagorean theorem: a² + b² = c²<br/>
            • Special right triangles: 30-60-90 (x, x√3, 2x) and 45-45-90 (x, x, x√2)<br/>
            • Similar triangles: proportional sides, equal angles<br/>
            • Triangle inequality: sum of any two sides {'>'} third side<br/><br/>
            <strong>Trigonometry:</strong><br/>
            • SOH-CAH-TOA:<br/>
            &nbsp;&nbsp;sin θ = opposite / hypotenuse<br/>
            &nbsp;&nbsp;cos θ = adjacent / hypotenuse<br/>
            &nbsp;&nbsp;tan θ = opposite / adjacent<br/>
            • sin²θ + cos²θ = 1<br/>
            • Complementary angles: sin(x) = cos(90° - x)
          </Typography>
          <Formula>{'SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj'}</Formula>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Coordinate Geometry:</strong><br/>
            • Distance: d = √((x₂-x₁)² + (y₂-y₁)²)<br/>
            • Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2)<br/>
            • Circle equation: (x-h)² + (y-k)² = r²<br/>
            • Parallel lines: same slope<br/>
            • Perpendicular lines: slopes are negative reciprocals (m₁ × m₂ = -1)
          </Typography>
          <Tip>Memorize the special right triangles! 3-4-5, 5-12-13, 8-15-17, and 7-24-25 show up frequently as Pythagorean triples.</Tip>
        </Stack>
      ),
    },
    {
      id: 'strategies',
      title: 'Test-Taking Strategies',
      icon: '🎯',
      section: 'strategy',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            Strategy can add 50–100+ points to your score without learning any new content. These techniques
            help you work smarter under time pressure.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Time Management:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • <strong>R&W:</strong> ~1 min 10 sec per question (some faster, some slower)<br/>
            • <strong>Math:</strong> ~1 min 35 sec per question<br/>
            • Flag hard questions and come back — don't get stuck!<br/>
            • Budget: answer easy questions first, then return to flagged ones
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Process of Elimination (POE):</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • Eliminate obviously wrong answers FIRST<br/>
            • Look for extreme language ("always," "never") — usually wrong<br/>
            • If two answers seem similar, one is probably the trap<br/>
            • When stuck between two options, re-read the question prompt carefully
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Math-Specific Strategies:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • <strong>Backsolve:</strong> Plug answer choices into the equation to find which works<br/>
            • <strong>Pick numbers:</strong> For abstract/variable questions, substitute simple values<br/>
            • <strong>Estimate:</strong> Before calculating, estimate the answer to eliminate options<br/>
            • <strong>Draw it:</strong> Sketch graphs and figures — visual reasoning helps<br/>
            • <strong>Use the calculator wisely:</strong> Desmos is powerful for graphing — plot both sides of an equation
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Reading-Specific Strategies:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • Read the question BEFORE the passage (know what to look for)<br/>
            • Passages are short (2–4 sentences) — read every word carefully<br/>
            • The correct answer is ALWAYS supported by evidence in the text<br/>
            • Beware of "half-right" answers that are partially true but not fully supported<br/>
            • For paired passages, understand each one individually before comparing
          </Typography>
          <Tip>On test day: eat a good breakfast, bring approved snacks for the break, arrive early, and trust your preparation. Anxiety is the score-killer — deep breaths and move forward.</Tip>
        </Stack>
      ),
    },
    {
      id: 'pacing',
      title: 'Pacing & Adaptive Strategy',
      icon: '⏱️',
      section: 'strategy',
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: TEXT_PRI }}>
            Understanding the adaptive format gives you a strategic edge. Here's how to maximize your score
            within the SAT's unique Module 1 → Module 2 structure.
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>How Adaptive Scoring Works:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • Module 1: mixed difficulty, sets your baseline<br/>
            • Module 2: difficulty adjusts based on Module 1 performance<br/>
            • Higher Module 2 difficulty = higher scoring ceiling<br/>
            • Questions in harder modules are worth slightly more<br/>
            • You CAN still score well even if Module 2 feels easier
          </Typography>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Pacing Plan:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            <strong>Reading & Writing (27 questions per module, 32 minutes):</strong><br/>
            • First pass (20 min): Answer all questions you can do quickly<br/>
            • Second pass (12 min): Return to flagged questions<br/>
            • Never spend more than 2 minutes on one question<br/><br/>
            <strong>Math (22 questions per module, 35 minutes):</strong><br/>
            • First pass (25 min): Do all straightforward problems<br/>
            • Second pass (10 min): Work on flagged complex problems<br/>
            • Use Desmos for any question involving graphs or systems
          </Typography>
          <Tip>Module 1 is CRITICAL — it determines your Module 2 difficulty and scoring range. Take your time on Module 1 and double-check your work if you finish early. Don't rush through it!</Tip>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: TEXT_PRI }}>Day-Before Checklist:</Typography>
          <Typography variant="body2" sx={{ color: TEXT_PRI }} component="div">
            • ✅ Charge your device (if using personal laptop)<br/>
            • ✅ Download/update the Bluebook app<br/>
            • ✅ Bring photo ID + admission ticket<br/>
            • ✅ Pack calculator (backup), pencils, eraser<br/>
            • ✅ Plan your route — arrive 30 minutes early<br/>
            • ✅ Get 8+ hours of sleep<br/>
            • ✅ Don't cram — review high-level strategies only
          </Typography>
        </Stack>
      ),
    },
  ];

  return (
    <Stack spacing={2}>
      {/* Section headers */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Typography variant="h6" fontWeight={600} sx={{ color: TEXT_PRI }}>
          📚 SAT Study Guide
        </Typography>
        <Typography variant="body2" sx={{ color: TEXT_SEC }}>
          Comprehensive review of all domains with strategies, formulas, and tips. Start with the overview,
          then dive into specific areas where you need practice.
        </Typography>
      </Paper>

      {/* Strategy sections */}
      <Typography variant="overline" fontWeight={600} sx={{ color: ACCENT, px: 1 }}>
        🎯 Strategy & Overview
      </Typography>
      {sections.filter(s => s.section === 'strategy').map(s => (
        <Accordion
          key={s.id}
          expanded={expanded === s.id}
          onChange={handleChange(s.id)}
          elevation={0}
          sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '8px !important', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: TEXT_SEC }} />}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: TEXT_PRI }}>
              {s.icon} {s.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{s.content}</AccordionDetails>
        </Accordion>
      ))}

      {/* R&W sections */}
      <Typography variant="overline" fontWeight={600} sx={{ color: ACCENT, px: 1 }}>
        📖 Reading & Writing
      </Typography>
      {sections.filter(s => s.section === 'rw').map(s => (
        <Accordion
          key={s.id}
          expanded={expanded === s.id}
          onChange={handleChange(s.id)}
          elevation={0}
          sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '8px !important', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: TEXT_SEC }} />}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: TEXT_PRI }}>
              {s.icon} {s.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{s.content}</AccordionDetails>
        </Accordion>
      ))}

      {/* Math sections */}
      <Typography variant="overline" fontWeight={600} sx={{ color: ACCENT, px: 1 }}>
        🧮 Math
      </Typography>
      {sections.filter(s => s.section === 'math').map(s => (
        <Accordion
          key={s.id}
          expanded={expanded === s.id}
          onChange={handleChange(s.id)}
          elevation={0}
          sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '8px !important', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: TEXT_SEC }} />}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: TEXT_PRI }}>
              {s.icon} {s.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{s.content}</AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
