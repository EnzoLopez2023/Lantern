// PROBSTAT Study Guide — accordion-based layout for SC Probability & Statistics (11th grade).
// Content uses shared MUI components — Callout, Analogy, GuideTable,
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

const READING_PROGRESS_KEY = 'exam-prep-reading:PROBSTAT';
const COMPLETION_KEY = 'exam-prep-completed:PROBSTAT';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:PROBSTAT';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Data Collection & Design',
  s3: 'Descriptive Statistics',
  s4: 'Probability',
  s5: 'Probability Distributions',
  s6: 'Sampling Distributions',
  s7: 'Confidence Intervals',
  s8: 'Hypothesis Testing & Bivariate Data',
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
  { id: 's2',      num: '2',  title: 'Data Collection & Design',            icon: '📋' },
  { id: 's3',      num: '3',  title: 'Descriptive Statistics',              icon: '📊' },
  { id: 's4',      num: '4',  title: 'Probability',                         icon: '🎲' },
  { id: 's5',      num: '5',  title: 'Probability Distributions',           icon: '🔔' },
  { id: 's6',      num: '6',  title: 'Sampling Distributions & the CLT',    icon: '🔄' },
  { id: 's7',      num: '7',  title: 'Confidence Intervals',                icon: '🎯' },
  { id: 's8',      num: '8',  title: 'Hypothesis Testing & Bivariate Data', icon: '⚖️' },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',                   icon: '✨' },
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
    case 's2':      return <Section2DataCollection />;
    case 's3':      return <Section3DescriptiveStats />;
    case 's4':      return <Section4Probability />;
    case 's5':      return <Section5Distributions />;
    case 's6':      return <Section6SamplingDistributions />;
    case 's7':      return <Section7ConfidenceIntervals />;
    case 's8':      return <Section8HypothesisTesting />;
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Statistics: The Science of Decision-Making Under Uncertainty</Typography>

      <Analogy title="A doctor diagnosing a patient they've never fully seen">
        A doctor can't look at every single cell in your body before making a diagnosis. Instead, they take a blood
        sample (a carefully chosen subset), measure key indicators (descriptive statistics), reason about what those
        numbers mean given how the body normally works (probability), and arrive at a conclusion that is likely correct
        but not perfectly certain (inference). Statistics is exactly this process — applied to any question where we
        have data but not the whole picture.
      </Analogy>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        Probability and Statistics answers one fundamental question: <strong>What can we learn from data, and how confident
        can we be in what we learn?</strong> The course is built like an assembly line. Each section produces an output
        that feeds into the next one, and by the end you can take raw data from the world and draw principled
        conclusions about populations you've never fully observed.
      </Typography>

      <Callout kind="why-it-matters">
        Data literacy is arguably the most universally useful mathematical skill in the modern world. Every career
        that touches evidence — medicine, law, business, engineering, education, public policy, journalism — requires
        the ability to interpret statistics without being misled. This course gives you that foundation.
        After this class, you'll never look at a poll, a clinical trial result, or a news graphic the same way.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Statistical Pipeline: How the Eight Sections Connect</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The eight content sections of this course follow a logical sequence from gathering data all the way through
        drawing conclusions. Understanding this pipeline — not just the individual steps — is what separates a
        student who memorizes formulas from one who actually understands statistics.
      </Typography>

      <GuideTable
        headers={['Step', 'Section', 'The Central Question']}
        rows={[
          ['1. Collect data', 'Section 2: Data Collection & Design', 'Did we gather data in a way that is unbiased and representative?'],
          ['2. Describe data', 'Section 3: Descriptive Statistics', 'What does the data look like — center, spread, shape?'],
          ['3. Apply probability', 'Section 4: Probability', 'How do we quantify uncertainty about events?'],
          ['4. Build distributions', 'Section 5: Probability Distributions', 'What are the patterns of random outcomes (binomial, normal)?'],
          ['5. Understand sampling', 'Section 6: Sampling Distributions & CLT', 'How do sample statistics behave across repeated samples?'],
          ['6. Make estimates', 'Section 7: Confidence Intervals', 'What range of values is plausible for the true population parameter?'],
          ['7. Test hypotheses', 'Section 8: Hypothesis Testing & Bivariate Data', 'Is our data strong enough evidence to reject a claim about the population?'],
        ]}
      />

      <Callout kind="connect">
        The pipeline only works if each step is done correctly. A confidence interval built on a biased sample
        is worthless no matter how perfect the math. A hypothesis test using the wrong distribution gives
        misleading p-values. The sections aren't isolated topics — they're stages in a single chain of reasoning.
        Keep asking: "Where did these numbers come from, and what assumptions have I made?"
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Two Branches: Descriptive vs. Inferential Statistics</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Everything in statistics falls into one of two categories:
      </Typography>

      <GuideTable
        headers={['Branch', 'Goal', 'Tools', 'Example']}
        rows={[
          ['Descriptive Statistics', 'Summarize the data you have', 'Mean, median, standard deviation, graphs, boxplots', 'The average score on last week\'s test was 78, with a standard deviation of 9 points.'],
          ['Inferential Statistics', 'Draw conclusions about a population from a sample', 'Confidence intervals, hypothesis tests, regression', 'We are 95% confident that the true average score of all students who take this test is between 74 and 82.'],
        ]}
      />

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Sections 2–3 are primarily <strong>descriptive</strong>. Sections 4–6 build the probability foundation. Sections 7–8
        are the payoff: <strong>inferential statistics</strong>, where we use probability theory to say something meaningful
        about the world beyond our sample.
      </Typography>

      <Callout kind="make-it-stick">
        Before every statistics problem, ask three questions: (1) What is the population of interest?
        (2) What is the sample, and was it collected well? (3) Am I describing the sample I have,
        or am I trying to conclude something about the larger population? This mental checklist will
        prevent most conceptual errors in the entire course.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Parameters vs. Statistics</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        One of the most important vocabulary distinctions in this course is the difference between a
        <strong> parameter</strong> and a <strong>statistic</strong>:
      </Typography>

      <GuideTable
        headers={['Term', 'What it describes', 'Symbol (center/spread)', 'Known or unknown?']}
        rows={[
          ['Parameter', 'The population', 'μ (mu) for mean, σ (sigma) for SD', 'Usually unknown — it\'s what we want to estimate'],
          ['Statistic', 'The sample', 'x̄ (x-bar) for mean, s for SD', 'Known — we compute it from our data'],
        ]}
      />

      <Callout kind="coachs-note">
        A helpful mnemonic: <strong>P</strong>arameter → <strong>P</strong>opulation (both start with P).
        <strong>S</strong>tatistic → <strong>S</strong>ample (both start with S). The entire goal of inferential
        statistics is to use a statistic (which we know) to estimate a parameter (which we don't).
        Keep this distinction clear throughout the entire course — it is the bedrock of everything in Sections 6, 7, and 8.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Where Statistics Shows Up in Real Life</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Understanding where each statistical concept lives in the real world helps you build intuition and remember
        the procedures. Here's a mapping of real-world domains to the statistical tools from this course:
      </Typography>

      <GuideTable
        headers={['Domain', 'Statistical question', 'Tool from this course']}
        rows={[
          ['Medicine', 'Does this new drug reduce blood pressure more than the placebo?', 'Randomized controlled experiment + hypothesis test (Section 8)'],
          ['Public health', 'What proportion of adults in SC are vaccinated?', 'Stratified sampling + confidence interval for proportion (Sections 2, 7)'],
          ['Education', 'Is the average SAT score at this school above the national average?', 'One-sample t-test (Section 8)'],
          ['Business', 'How closely does advertising spending predict sales revenue?', 'Correlation and regression (Section 8)'],
          ['Manufacturing', 'Are the weights of cereal boxes normally distributed with mean 20 oz?', 'Descriptive statistics + normal distribution (Sections 3, 5)'],
          ['Sports analytics', 'What is a basketball player\'s true free-throw percentage?', 'Binomial distribution + confidence interval for proportion (Sections 5, 7)'],
          ['Environmental science', 'Has average ocean temperature increased over the last 50 years?', 'Descriptive statistics + hypothesis testing for mean (Sections 3, 8)'],
        ]}
      />

      <Callout kind="connect">
        Every row in the table above follows the same pipeline: collect data appropriately (Section 2),
        describe what was found (Section 3), apply probability to model uncertainty (Sections 4–5),
        understand sampling variability (Section 6), then estimate parameters or test claims (Sections 7–8).
        Real-world statistics is this pipeline applied to problems that matter. The formulas are just tools;
        the pipeline is the thinking.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>How to Use This Guide Effectively</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        This study guide is organized to mirror the logical progression of the course. Here's the recommended
        approach for different study situations:
      </Typography>

      <GuideTable
        headers={['Situation', 'Recommended approach']}
        rows={[
          ['First exposure / beginning of semester', 'Read Section 1 fully. Then read each content section (2–8) when you first encounter that topic in class. Don\'t skip ahead — each section builds on the prior ones.'],
          ['Reviewing before a unit test', 'Open the relevant section(s). Read the GuideTable summaries first for a quick overview, then dive into the Analogy and Callout boxes that you found confusing in class.'],
          ['Final exam / end-of-course review', 'Work through the Exam-Day Strategy section first. Then use the Glossary to confirm vocabulary. Finally, do the section quizzes for every topic.'],
          ['Practicing with problems', 'After reading a section, close the guide and try to reproduce the key formulas and decision rules from memory. Then open the guide to check. Active recall is the most efficient study method.'],
          ['Weak spots', 'For topics you consistently get wrong, read the section, work through the Try-This callouts by hand, and try to explain the concept out loud before moving on.'],
        ]}
      />

      <Callout kind="make-it-stick">
        Research on learning consistently shows that spacing and retrieval practice outperform re-reading.
        Instead of reading this guide twice in one sitting, read it once, then come back tomorrow and try to
        recall the key ideas for each section without looking. The mild struggle of trying to remember — and
        the feedback when you check — is where actual learning happens. The section quizzes at the end of
        each section are designed exactly for this purpose.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Language of Statistics: Vocabulary Precision Matters</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Statistics has a precise vocabulary, and using terms incorrectly costs points on explanation questions.
        Here are the most commonly confused pairs:
      </Typography>

      <GuideTable
        headers={['Often confused', 'Correct usage', 'Why it matters']}
        rows={[
          ['"Prove" H₀ false vs "Evidence against" H₀', 'We never prove a hypothesis — we find evidence for or against it', 'Statistics operates on probabilistic reasoning, not mathematical proof'],
          ['"Accept" H₀ vs "Fail to reject" H₀', 'Always say "fail to reject H₀" — never "accept H₀"', 'Absence of evidence is not evidence of absence; H₀ might be false but our test lacked power'],
          ['"Correlation" vs "association"', 'Correlation is specifically the linear r value; association is any relationship', '"The variables are correlated" implies linearity; "associated" is more general'],
          ['"Confidence level" vs "probability"', '"We are 95% confident..." not "95% probability that the parameter is..."', 'The parameter is fixed; probability applies to random events, not fixed unknowns'],
          ['"Sample" vs "population"', 'Statistics describe samples; parameters describe populations', 'Using x̄ to describe a population (or μ to describe a sample) is a technical error'],
          ['"Significant" vs "important"', 'Statistically significant means p < α; important/meaningful refers to practical effect size', 'A tiny but precisely measured effect can be significant but not important'],
        ]}
      />

      <Callout kind="coachs-note">
        One practical tip for interpretation questions: before writing your answer, underline the actual
        variable names and population in the problem statement. Then make sure those exact words appear in
        your interpretation. Generic answers like "the mean is between A and B" lose points compared to
        "the true mean daily step count of all SC 11th-grade students is between A and B." Context is everything.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Data Collection & Design
// ─────────────────────────────────────────────────────────────────────
function Section2DataCollection() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Why Data Collection Design Matters</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        All of statistical inference rests on the quality of the data collected. A perfectly constructed confidence
        interval built on biased data is still wrong. Before running a single calculation, a statistician asks:
        "Was this data collected in a way that gives an honest picture of the population?"
      </Typography>

      <Analogy title="Polling your own class versus surveying the whole grade">
        If your teacher wants to know what the average 11th-grader thinks about a new school policy, asking only
        the students in one classroom is risky. Your class might skew toward athletes, or toward students who
        take advanced courses, or toward one friend group. Surveying a truly random sample from the entire grade —
        maybe every 5th name on the roster — gives a far more reliable picture. The <em>method</em> of selection
        is what makes the difference, not just the number of people asked.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Observational Studies vs. Experiments</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The most fundamental distinction in data collection is whether the researcher actively intervenes or simply
        observes what happens naturally.
      </Typography>

      <Analogy title="Watching nature vs. intervening in a controlled setting">
        An ornithologist who hides in a blind and records which birds visit a feeder is conducting an
        observational study — nature runs its course, and they record outcomes. A researcher who randomly assigns
        some people to a new drug and others to a placebo and then measures outcomes is conducting an experiment.
        The key difference is <em>randomized assignment of treatments</em>. Only an experiment can establish cause and effect;
        observational studies can only establish association.
      </Analogy>

      <GuideTable
        headers={['Feature', 'Observational Study', 'Experiment']}
        rows={[
          ['Researcher role', 'Observes, does not intervene', 'Actively assigns treatments to subjects'],
          ['Randomized assignment?', 'No', 'Yes (essential for valid experiments)'],
          ['Can establish causation?', 'No — only association/correlation', 'Yes — if well-designed'],
          ['Confounding risk?', 'High', 'Controlled through randomization'],
          ['Examples', 'Survey, census, medical record review', 'Clinical drug trial, A/B test, fertilizer study'],
        ]}
      />

      <Callout kind="watch-for">
        Confounding variables are a major threat to observational studies. A confounding variable is one that is
        related to both the explanatory variable and the response variable, making it impossible to tell which
        is really responsible for the observed relationship. Ice cream sales and drowning rates are both higher
        in summer — the confounding variable is hot weather, not ice cream causing drowning.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sampling Methods</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>census</strong> surveys every member of the population — accurate but often impractical.
        A <strong>sample</strong> surveys a subset. The method of sampling determines whether the sample is representative.
      </Typography>

      <MermaidDiagram chart={`graph TD
  A["Need to collect data from a population"] --> B{"Can you survey everyone?"}
  B -->|Yes| C["Census — survey every member"]
  B -->|No| D["Choose a sampling method"]
  D --> E["Simple Random Sample (SRS)\nEvery individual equally likely to be selected"]
  D --> F["Stratified Sample\nDivide into strata, SRS from each stratum"]
  D --> G["Cluster Sample\nDivide into clusters, randomly select whole clusters"]
  D --> H["Systematic Sample\nSelect every kth individual from ordered list"]
  D --> I["Convenience Sample\nSelect whoever is easiest to reach\nWARNING: prone to bias"]`} />

      <GuideTable
        headers={['Method', 'How it works', 'Best when', 'Bias risk']}
        rows={[
          ['Simple Random Sample (SRS)', 'Assign numbers to all members; use random number table or computer to select', 'Population is accessible and list is available', 'Low if done correctly'],
          ['Stratified Random Sample', 'Divide population into groups (strata) by a key characteristic; SRS from each stratum', 'Population has known subgroups that differ importantly (e.g., grades in a school)', 'Low; ensures subgroups are represented'],
          ['Cluster Sample', 'Divide population into clusters (often geographic); randomly select entire clusters and survey all members', 'Population is large and spread out; getting a list of all members is hard', 'Moderate; clusters may not be representative'],
          ['Systematic Sample', 'Order the list; choose a random starting point; select every kth member', 'Large ordered list exists (e.g., voter rolls)', 'Low unless a pattern exists in the list at interval k'],
          ['Convenience Sample', 'Use whoever is available and willing', 'Pilot/exploratory work only', 'High — almost always biased'],
          ['Voluntary Response Sample', 'Individuals choose to respond (e.g., online poll)', 'Never for serious inference', 'Very high — strong-opinion people self-select'],
        ]}
      />

      <Callout kind="in-plain-words">
        Stratified sampling is like making sure every food group is on your plate before you start eating — you
        deliberately ensure each important subgroup is represented. Cluster sampling is like picking a random
        neighborhood in a city and surveying every household in it — you get everyone in one chunk, which is
        efficient but the neighborhood might be unusual. Simple random sampling is the gold standard: pure chance
        with no manual structuring.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sources of Bias in Studies</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Bias is any systematic (non-random) error that makes sample results consistently wrong in one direction.
        Unlike random sampling error, bias does not shrink with larger samples — it's baked into the design.
      </Typography>

      <GuideTable
        headers={['Type of Bias', 'Definition', 'Example']}
        rows={[
          ['Voluntary Response Bias', 'People self-select; strong opinions overrepresented', 'Online poll about a controversial topic — the outraged respond; the satisfied stay quiet'],
          ['Undercoverage', 'Some members of the population have no chance of being selected', 'Phone survey of landlines only — excludes younger, mobile-only households'],
          ['Nonresponse Bias', 'Those who don\'t respond are systematically different from those who do', 'Mail survey — busy, lower-income, or disengaged people respond less'],
          ['Response Bias', 'Respondents give inaccurate answers', 'People under-report alcohol consumption when asked by a doctor; social desirability effect'],
          ['Wording/Question Order Bias', 'How the question is phrased influences the answer', '"Do you support wasteful government spending?" vs. "Do you support investing in public services?" — same policy, very different framing'],
          ['Confounding', 'A third variable is related to both explanatory and response variables', 'Ice cream and drowning; shoe size and reading ability in children (age confounds both)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Principles of a Well-Designed Experiment</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A good experiment controls for confounding by using four key principles:
      </Typography>

      <GuideTable
        headers={['Principle', 'What it means', 'Why it matters']}
        rows={[
          ['Randomization', 'Randomly assign subjects to treatment and control groups', 'Distributes unknown confounding variables evenly across groups so they cancel out'],
          ['Control', 'Hold all other variables constant; use a control group that receives no treatment or a placebo', 'Isolates the effect of the treatment — you know what changed and what didn\'t'],
          ['Replication', 'Use enough subjects that results are reliable and repeatable', 'Reduces the impact of random variation; makes results generalizable'],
          ['Blinding', 'Subjects don\'t know which group they\'re in (single-blind); neither do the researchers (double-blind)', 'Prevents the placebo effect and researcher bias from contaminating results'],
        ]}
      />

      <Callout kind="make-it-stick">
        The placebo effect is real and powerful: people who believe they are receiving treatment often show
        measurable improvement even when given an inert substance. Double-blinding eliminates this source
        of error by ensuring neither the patient nor the researcher measuring outcomes knows who got the
        real treatment until data collection is complete. "Double-blind" means both sides are in the dark.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Stratified Sampling vs. Cluster Sampling: Getting the Distinction Right</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        These two methods are frequently confused because both involve dividing a population into groups.
        The critical difference is what you do after dividing:
      </Typography>

      <GuideTable
        headers={['', 'Stratified Sampling', 'Cluster Sampling']}
        rows={[
          ['How groups are formed', 'Based on a characteristic relevant to the study (e.g., grade level, income bracket)', 'Often based on geography or convenience (e.g., classrooms, zip codes, city blocks)'],
          ['After dividing into groups...', 'Take an SRS from EACH group (stratum)', 'Randomly SELECT a few whole groups (clusters) and survey EVERYONE in them'],
          ['Who gets surveyed', 'A subset of people from every stratum', 'All people in the selected clusters; no one from unselected clusters'],
          ['Goal', 'Ensure each subgroup is represented in the sample', 'Make sampling practical when a complete list is unavailable'],
          ['Example', '200 students, 50 from each grade level (9th–12th)', 'Randomly select 5 classrooms and survey all students in those classrooms'],
        ]}
      />

      <Callout kind="in-plain-words">
        Stratified: you sample from ALL groups, just proportionally. Cluster: you randomly pick a FEW groups
        and sample EVERYONE in those groups. Stratified gives better representation; cluster is cheaper and
        more practical. A handy test: "Am I getting data from every group (stratified) or from only
        some groups (cluster)?" If you have reps from every group, it's stratified.
      </Callout>

      <Callout kind="connect">
        Randomized controlled experiments are considered the gold standard of scientific evidence precisely
        because randomization — when the sample is large enough — ensures the groups are equivalent on
        all variables, both measured and unmeasured. That's why the phrase "random assignment" is critically
        different from "random selection." Random selection (sampling) ensures external validity (results
        generalize to the population). Random assignment (experiment) ensures internal validity (the treatment
        caused the effect).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Completely Randomized vs. Block Designs</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In a <strong>completely randomized design</strong>, all subjects are randomly assigned to treatments with no
        pre-grouping. In a <strong>randomized block design</strong>, subjects are first grouped into blocks based on
        a variable that might affect the outcome (like age, sex, or initial health status), and then randomization
        happens within each block. Blocking is like stratification for experiments — it controls for a known source
        of variation, making it easier to detect the treatment effect.
      </Typography>

      <GuideTable
        headers={['Design', 'When to use it', 'Advantage', 'Example']}
        rows={[
          ['Completely Randomized', 'Subjects are relatively homogeneous (similar to each other)', 'Simplest design; easy to implement', 'Randomly assign 60 patients to drug or placebo with no pre-grouping'],
          ['Randomized Block', 'Subjects differ on a known variable that affects the outcome', 'Removes block-to-block variation; more sensitive test', 'Block by age group (under 40 / 40+), then randomize within each block'],
          ['Matched Pairs', 'Each subject is their own control, or subjects are paired by similarity', 'Eliminates individual differences entirely', 'Before/after measurement on same person; twins assigned to different treatments'],
        ]}
      />

      <Callout kind="try-this">
        A pharmaceutical company wants to test a new blood pressure medication. They have 120 patients aged
        20–70. Design a better experiment using blocks: divide patients into two age blocks (20–44 and 45–70),
        then randomly assign half of each block to the new drug and half to placebo. This controls for age
        as a confounding variable — older patients typically have higher baseline blood pressure, which could
        mask or exaggerate the drug's effect if age is unequally distributed across treatment groups.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Scope of Conclusions: What Can You Infer from Each Study Type?</Typography>

      <GuideTable
        headers={['Study Type', 'Random sampling from population?', 'Random assignment to treatment?', 'Can generalize?', 'Can establish causation?']}
        rows={[
          ['Ideal: Random sample + Randomized experiment', 'Yes', 'Yes', 'Yes — to population', 'Yes'],
          ['Randomized experiment (volunteers)', 'No (volunteers)', 'Yes', 'Limited — only to similar subjects', 'Yes'],
          ['Observational study (random sample)', 'Yes', 'No', 'Yes — to population', 'No — only association'],
          ['Observational study (convenience sample)', 'No', 'No', 'No', 'No'],
        ]}
      />

      <Callout kind="make-it-stick">
        Two questions to memorize for scope-of-inference problems: (1) Was it a random SAMPLE? → determines
        whether results generalize to the population. (2) Was there random ASSIGNMENT? → determines whether
        a cause-and-effect conclusion is valid. These are separate, independent questions. An experiment
        with volunteers and random assignment can establish causation but can't be generalized. A survey
        with random sampling can be generalized but can only show association, not causation.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Descriptive Statistics
// ─────────────────────────────────────────────────────────────────────
function Section3DescriptiveStats() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Making Sense of Data: Measures of Center</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Descriptive statistics compress a large dataset into a few numbers that capture its essential character.
        The most fundamental summaries are measures of center (where the data is located) and measures of spread
        (how widely the data varies around that center).
      </Typography>

      <Analogy title="Why the median salary matters more than the mean when CEOs are in the room">
        Imagine a company with 10 employees earning $40,000 each and one CEO earning $1,000,000. The mean salary
        is ($400,000 + $1,000,000) / 11 = $127,273 — higher than any regular employee's pay. The median
        (the middle value when sorted) is $40,000 — which actually reflects a typical employee's experience.
        When there are extreme outliers, the median tells the real story. That's why reports on household income
        always quote median, not mean — a few billionaires would otherwise make everyone look wealthy on average.
      </Analogy>

      <GuideTable
        headers={['Measure', 'Definition', 'Formula', 'When to use']}
        rows={[
          ['Mean (x̄)', 'Arithmetic average', 'x̄ = (Σxᵢ)/n', 'Symmetric distributions with no extreme outliers'],
          ['Median', 'Middle value when data is sorted', 'Middle value; average of two middle values for even n', 'Skewed distributions or when outliers are present'],
          ['Mode', 'Most frequently occurring value(s)', 'Count frequencies', 'Categorical data; identifying the most common outcome'],
        ]}
      />

      <Callout kind="coachs-note">
        In a perfectly symmetric distribution, mean = median = mode. As soon as the distribution skews or
        outliers appear, the mean gets pulled toward the tail while the median stays near the bulk of the data.
        This is why the mean is called <em>non-resistant</em> and the median is called <em>resistant</em> —
        the median resists the pull of extreme values.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Measures of Spread</Typography>

      <Analogy title="Standard deviation as average distance from the party">
        Imagine the mean of a dataset as the location of a party. Each data point is a guest. The standard deviation
        measures, on average, how far away from the party each guest lives. A small SD means everyone lives nearby —
        the data is tightly clustered. A large SD means guests are scattered across the city — the data is highly
        variable. The specific calculation (average squared distance, then square-rooted) is the technical version
        of this intuition.
      </Analogy>

      <GuideTable
        headers={['Measure', 'Definition', 'Formula', 'Resistant to outliers?']}
        rows={[
          ['Range', 'Maximum minus minimum', 'Range = max − min', 'No — one outlier changes it completely'],
          ['Interquartile Range (IQR)', 'Spread of the middle 50% of data', 'IQR = Q3 − Q1', 'Yes — quartiles are not affected by extremes'],
          ['Variance (s²)', 'Average squared deviation from the mean', 's² = Σ(xᵢ − x̄)²/(n−1)', 'No'],
          ['Standard Deviation (s)', 'Square root of variance; typical deviation from mean', 's = √[Σ(xᵢ − x̄)²/(n−1)]', 'No'],
        ]}
      />

      <Callout kind="watch-for">
        The variance formula uses n−1 in the denominator (not n) when computed from a sample. This is called
        Bessel's correction and it makes the sample variance an unbiased estimator of the population variance.
        Your calculator and all statistical software apply n−1 automatically for sample SD. If the formula
        sheet shows s², it means the sample version. If it shows σ², it means the population version (uses n).
        Use s and s² when working with sample data — that's almost always the case on an exam.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Five-Number Summary and Boxplots</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The five-number summary captures the full spread of a distribution using five key values:
        <strong> Minimum, Q1, Median (Q2), Q3, Maximum</strong>. A boxplot displays this summary graphically.
      </Typography>

      <GuideTable
        headers={['Value', 'What it represents', 'How to find it']}
        rows={[
          ['Minimum', 'Smallest value (excluding outliers in modified boxplot)', 'Sort data; first value'],
          ['Q1 (First Quartile)', '25th percentile; median of the lower half', 'Median of the lower 50% of data (not including the median itself for odd n)'],
          ['Median (Q2)', '50th percentile; middle of the data', 'Sort; find middle value'],
          ['Q3 (Third Quartile)', '75th percentile; median of the upper half', 'Median of the upper 50% of data'],
          ['Maximum', 'Largest value (excluding outliers in modified boxplot)', 'Sort data; last value'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Identifying Outliers: The 1.5 · IQR Rule</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A data point is considered a <strong>suspected outlier</strong> if it falls more than 1.5 · IQR below Q1
        or more than 1.5 · IQR above Q3:
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'Lower fence: Q1 − 1.5 · IQR'}<br />
        {'Upper fence: Q3 + 1.5 · IQR'}<br />
        {'Any value below the lower fence or above the upper fence is a potential outlier.'}
      </Box>

      <Callout kind="try-this">
        Dataset: 2, 5, 6, 7, 8, 9, 10, 12, 45. Q1 = 5.5, Q3 = 10.5, IQR = 5. Lower fence = 5.5 − 7.5 = −2.
        Upper fence = 10.5 + 7.5 = 18. The value 45 exceeds 18, so it is a suspected outlier. On a modified
        boxplot, the whisker would stop at 12 (the largest non-outlier) and 45 would appear as an isolated dot.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Shape of a Distribution</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The shape of a distribution tells you where the data clusters, whether it's symmetric, and whether
        extreme values appear on one side. Three shapes appear most on tests:
      </Typography>

      <MermaidDiagram chart={`graph LR
  subgraph Right-Skewed
    RS1["Tail pulls right →\nMean > Median > Mode\nExample: incomes, house prices"]
  end
  subgraph Symmetric
    SY1["Balanced on both sides\nMean ≈ Median ≈ Mode\nExample: heights, test scores"]
  end
  subgraph Left-Skewed
    LS1["← Tail pulls left\nMean < Median < Mode\nExample: age at retirement, time-to-failure of old devices"]
  end`} />

      <GuideTable
        headers={['Shape', 'Tail location', 'Relationship of mean and median', 'Which center to report']}
        rows={[
          ['Symmetric / Bell-shaped', 'No significant tail', 'Mean ≈ Median', 'Either; mean is fine'],
          ['Right-skewed (positively skewed)', 'Long right tail', 'Mean > Median', 'Median — less affected by the high outliers'],
          ['Left-skewed (negatively skewed)', 'Long left tail', 'Mean < Median', 'Median — less affected by the low outliers'],
        ]}
      />

      <Callout kind="in-plain-words">
        The word "skewed" refers to the direction of the tail, not the direction of the hump. Right-skewed
        data has a bump on the left and a long tail stretching right. Think of it as the tail pointing
        in the direction of the skew. Remember: the mean always chases the tail (gets pulled toward it),
        while the median stays near the bulk of the data.
      </Callout>

      <GuideTable
        headers={['Measure', 'Resistant to outliers?', 'Best for']}
        rows={[
          ['Mean (x̄)', 'No — pulled by extreme values', 'Symmetric distributions, further calculation (CI, hypothesis tests)'],
          ['Median', 'Yes — stays near the center', 'Skewed distributions; reporting "typical" value'],
          ['IQR', 'Yes — based on middle 50% only', 'Spread in skewed distributions'],
          ['Standard Deviation (s)', 'No — squared deviations amplify outliers', 'Spread in symmetric distributions; required for inference formulas'],
          ['Range', 'No — uses only max and min', 'Quick, rough sense of total spread'],
        ]}
      />

      <Callout kind="make-it-stick">
        Resistant measures (median, IQR) are best friends with skewed data and outliers. Non-resistant measures
        (mean, standard deviation, range) are best friends with clean, symmetric data. Always describe the shape
        of a distribution before deciding which measures to use — the shape tells you which measures are honest.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Percentiles and Their Relationship to the Five-Number Summary</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A percentile tells you what percentage of the data falls AT OR BELOW a given value.
        The median is the 50th percentile — exactly half the data falls at or below it.
        Q1 is the 25th percentile; Q3 is the 75th percentile.
        Z-scores from the normal distribution table (Section 5) are also percentile lookups — they tell you
        what fraction of a normal distribution falls below a given z-value.
      </Typography>

      <GuideTable
        headers={['Percentile', 'Equivalent name', 'Meaning']}
        rows={[
          ['25th', 'Q1 (First Quartile)', '25% of data falls at or below this value'],
          ['50th', 'Median (Q2)', '50% of data falls at or below this value'],
          ['75th', 'Q3 (Third Quartile)', '75% of data falls at or below this value'],
          ['90th', '—', '90% of data is at or below; top 10% exceeds this value'],
          ['99th', '—', 'Only 1% of data exceeds this value — very high performers'],
        ]}
      />

      <Callout kind="try-this">
        Your score on a standardized test is at the 84th percentile. What does that mean? It means you scored
        as well as or better than 84% of all test-takers. It does NOT mean you got 84% of the questions correct —
        percentile ranks compare you to other people in the distribution, not to a fixed standard.
        If the test is normally distributed and your score is at the 84th percentile, your z-score is approximately
        +1.0 (since P(Z &lt; 1.0) ≈ 0.8413 ≈ 84%). This gives you: your score = μ + 1.0 · σ.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Computing Standard Deviation Step by Step</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Many students memorize the SD formula without ever working through it by hand. Doing it once makes the
        concept stick: SD measures average distance from the mean, with squaring making all deviations positive
        and penalizing large deviations more.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Dataset: 3, 7, 7, 9, 14.  n = 5'}<br />
        {'Step 1: Find mean: x̄ = (3+7+7+9+14)/5 = 40/5 = 8'}<br />
        {'Step 2: Subtract mean from each value (deviations):'}<br />
        {'  3−8=−5,  7−8=−1,  7−8=−1,  9−8=1,  14−8=6'}<br />
        {'Step 3: Square each deviation:'}<br />
        {'  25,  1,  1,  1,  36'}<br />
        {'Step 4: Sum squared deviations: 25+1+1+1+36 = 64'}<br />
        {'Step 5: Divide by n−1 = 4: 64/4 = 16  (this is the sample variance s²)'}<br />
        {'Step 6: Take square root: s = √16 = 4'}<br />
        {'The typical deviation from the mean of 8 is about 4 units.'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Graphical Displays: Choosing the Right Graph</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Descriptive statistics extends beyond numbers to visual displays. Choosing the right graph depends on
        the type of data and the question being asked.
      </Typography>

      <GuideTable
        headers={['Graph Type', 'Data type', 'What it shows', 'When to prefer it']}
        rows={[
          ['Histogram', 'Quantitative', 'Distribution shape, center, spread, gaps, outliers', 'Large datasets; seeing the overall shape clearly'],
          ['Boxplot', 'Quantitative', '5-number summary, IQR, outliers', 'Comparing multiple groups side by side; spotting outliers quickly'],
          ['Stemplot (Stem-and-leaf)', 'Quantitative', 'All individual values plus shape', 'Small datasets; exact values matter'],
          ['Dotplot', 'Quantitative', 'Each individual value', 'Very small datasets; seeing every point'],
          ['Bar chart', 'Categorical', 'Frequency or proportion of each category', 'Comparing category sizes; clear visual of proportions'],
          ['Pie chart', 'Categorical', 'Proportion of each category of the whole', 'When emphasizing that categories add to 100%'],
          ['Scatterplot', 'Two quantitative variables', 'Direction, form, strength of relationship', 'Exploring the relationship between two variables'],
          ['Ogive (Cumulative freq.)', 'Quantitative', 'Cumulative percentages at each value', 'Finding percentiles; what % fall below a given value'],
        ]}
      />

      <Callout kind="watch-for">
        Histograms and bar charts look similar but serve different purposes. A histogram is for quantitative
        data — the bars touch because the data is continuous (or at least ordered). A bar chart is for
        categorical data — the bars can be in any order and don't need to touch. The most common graphic
        error on statistics exams is calling a histogram a bar chart or vice versa.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Comparing Distributions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When a problem asks you to compare two distributions (a very common exam question), always address
        four things: <strong>Shape, Center, Spread, and Outliers</strong> — abbreviated SOCS or CUSS
        (Context, Unusual features, Shape, Spread).
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, lineHeight: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.92rem' }}>Template for comparing two distributions:</Typography>
        <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.85, fontStyle: 'italic' }}>
          "Distribution A is [shape] while Distribution B is [shape]. Distribution A has a [higher/lower] center
          (median/mean ≈ X) compared to Distribution B (median/mean ≈ Y). Distribution A has [more/less] spread
          (IQR/SD = X) than Distribution B (IQR/SD = Y). [Distribution A/B] has suspected outliers at
          [values], while [Distribution A/B] does not."
        </Typography>
      </Box>

      <Callout kind="coachs-note">
        Always use CONTEXT in distribution comparisons. Don't just say "the median of A is greater than the
        median of B" — say "the median test score for Group A (78 points) is higher than the median for Group B
        (71 points), suggesting Group A performed better on average." Examiners award points for connecting
        the statistics to the real-world meaning of the variables.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 4: Probability
// ─────────────────────────────────────────────────────────────────────
function Section4Probability() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>What Is Probability?</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Probability is the mathematical language of uncertainty. It quantifies how likely an event is to occur on
        a scale from 0 (impossible) to 1 (certain). There are two main interpretations:
      </Typography>

      <GuideTable
        headers={['Interpretation', 'Definition', 'Example']}
        rows={[
          ['Classical (Theoretical)', 'P(A) = (# favorable outcomes) / (# equally likely total outcomes)', 'P(rolling a 3 on a fair die) = 1/6'],
          ['Empirical (Relative Frequency)', 'P(A) = (# times A occurred) / (# total trials) — based on observed data', 'In 400 coin flips, heads appeared 198 times: P(H) ≈ 198/400 = 0.495'],
        ]}
      />

      <Analogy title="Probability as a weather forecast percentage">
        When a meteorologist says "70% chance of rain tomorrow," they're not saying it will rain on exactly 70%
        of tomorrow's sky. They mean: in historical situations with exactly the same atmospheric conditions,
        it rained about 70% of the time. Probability is a long-run statement — it describes what would happen
        over many, many repetitions of the same situation, not any single specific outcome. This is called the
        Law of Large Numbers: as the number of trials grows, the observed proportion converges to the true probability.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Vocabulary: Sample Space and Events</Typography>
      <GuideTable
        headers={['Term', 'Definition', 'Example (rolling one die)']}
        rows={[
          ['Sample Space (S)', 'Set of all possible outcomes', 'S = {1, 2, 3, 4, 5, 6}'],
          ['Event (A)', 'Any subset of the sample space', 'A = {even numbers} = {2, 4, 6}'],
          ['Complement (Aᶜ)', 'All outcomes NOT in A', 'Aᶜ = {odd numbers} = {1, 3, 5}'],
          ['Union (A ∪ B)', 'Outcomes in A OR B (or both)', 'A = {1,2}, B = {2,3} → A ∪ B = {1,2,3}'],
          ['Intersection (A ∩ B)', 'Outcomes in BOTH A and B', 'A = {1,2}, B = {2,3} → A ∩ B = {2}'],
          ['Mutually Exclusive', 'A and B cannot both occur', 'A = {1,2,3}, B = {4,5,6}: no overlap'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Fundamental Probability Rules</Typography>

      <GuideTable
        headers={['Rule', 'Formula', 'Key condition']}
        rows={[
          ['Basic probability range', '0 ≤ P(A) ≤ 1 for any event A', 'Always true'],
          ['All outcomes sum to 1', 'P(S) = 1', 'The sample space is exhaustive'],
          ['Complement rule', 'P(Aᶜ) = 1 − P(A)', 'Very useful for "at least one" problems'],
          ['Addition rule (general)', 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', 'Subtract intersection to avoid double-counting'],
          ['Addition rule (mutually exclusive)', 'P(A ∪ B) = P(A) + P(B)', 'Only when A and B cannot both occur'],
          ['Multiplication rule (general)', 'P(A ∩ B) = P(A) · P(B|A)', 'Always valid'],
          ['Multiplication rule (independent)', 'P(A ∩ B) = P(A) · P(B)', 'Only when A and B are independent'],
          ['Conditional probability', 'P(B|A) = P(A ∩ B) / P(A)', '"Given A occurred, what is P(B)?"'],
        ]}
      />

      <Callout kind="watch-for">
        Do not confuse mutually exclusive with independent. Mutually exclusive events CANNOT both occur
        (P(A ∩ B) = 0) — knowing one occurred tells you the other definitely didn't.
        Independent events CAN both occur, but knowing one occurred gives you NO information about the other.
        In fact, mutually exclusive events with nonzero probabilities are always DEPENDENT: if A occurred,
        you know B didn't, so the occurrence of A absolutely affects your probability assessment of B.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Conditional Probability</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Conditional probability P(B|A) is the probability of B given that A has already occurred. It restricts
        the sample space to only the outcomes where A occurred, then asks what fraction of those outcomes are also in B.
      </Typography>

      <Analogy title="Drawing cards from a deck — with and without replacement">
        Draw one card from a standard deck. P(second card is a King) depends entirely on what happened first.
        If you drew without replacement and the first card was a King: P(second is King) = 3/51 (only 3 Kings left
        in 51 remaining cards) — the events are DEPENDENT. If you replaced the card before drawing again:
        P(second is King) = 4/52 — same as the first draw, so the events are INDEPENDENT. The physical act
        of replacing (or not) is what determines independence, and conditional probability captures this precisely.
      </Analogy>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'Example: Two-way table'}<br />
        {'          | Passes | Fails | Total'}<br />
        {'Studied   |   42   |   8   |  50'}<br />
        {'No study  |   18   |  32   |  50'}<br />
        {'Total     |   60   |  40   | 100'}<br /><br />
        {'P(Passes | Studied) = 42/50 = 0.84'}<br />
        {'P(Passes | No study) = 18/50 = 0.36'}<br />
        {'Studying and passing are NOT independent (P(Passes|Studied) ≠ P(Passes)).'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Counting: Permutations and Combinations</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When each outcome in the sample space is equally likely, probability reduces to counting:
        P(A) = (# outcomes in A) / (total # outcomes). Counting methods help when the numbers are large.
      </Typography>

      <GuideTable
        headers={['Method', 'Formula', 'Use when', 'Example']}
        rows={[
          ['Fundamental Counting Principle', 'n₁ × n₂ × … × nₖ', 'Independent choices at each stage', '3 choices of shirt × 4 choices of pants = 12 outfits'],
          ['Factorial (n!)', 'n! = n × (n−1) × … × 2 × 1', 'Arranging all n items in order', '5! = 120 ways to arrange 5 books on a shelf'],
          ['Permutation (nPr)', 'n! / (n−r)!', 'Selecting r items from n where ORDER MATTERS', 'Top-3 finishers from 10 runners: ₁₀P₃ = 720'],
          ['Combination (nCr)', 'n! / (r!(n−r)!)', 'Selecting r items from n where ORDER DOES NOT MATTER', 'Committee of 3 from 10 people: ₁₀C₃ = 120'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  A["Counting problem"] --> B{"Does order matter?"}
  B -->|"Yes — position/rank matters"| C["Permutation\nnPr = n!/(n-r)!"]
  B -->|"No — just selecting a group"| D["Combination\nnCr = n!/(r!(n-r)!)"]
  C --> C1["Example: Assigning president, VP, secretary\nfrom 20 candidates → ₂₀P₃ = 6,840"]
  D --> D1["Example: Choosing 3 members for a committee\nfrom 20 candidates → ₂₀C₃ = 1,140"]`} />

      <Callout kind="make-it-stick">
        Permutation vs. Combination: ask yourself "if I swap two of the selected items, do I have a different
        outcome?" If yes → Permutation (order matters). If no → Combination (it's still the same group).
        Swapping Alice and Bob in a committee gives the same committee. Swapping 1st place and 2nd place
        in a race gives different results. C comes before P alphabetically — Combination is the smaller number
        (because groups are fewer than ordered arrangements of the same size). nCr ≤ nPr always.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Venn Diagrams and the Addition Rule</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Venn diagrams provide a visual model for the addition rule and help avoid the double-counting error.
        When two events overlap (share outcomes), the intersection must be subtracted once to prevent counting
        it twice.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Survey of 100 students: 60 play sports, 40 play music, 15 play both.'}<br />
        {'P(Sports) = 0.60,  P(Music) = 0.40,  P(Sports ∩ Music) = 0.15'}<br /><br />
        {'P(Sports ∪ Music) = 0.60 + 0.40 − 0.15 = 0.85'}<br />
        {'P(Neither) = 1 − 0.85 = 0.15'}<br /><br />
        {'Only sports (not music): 0.60 − 0.15 = 0.45'}<br />
        {'Only music (not sports): 0.40 − 0.15 = 0.25'}<br />
        {'Both: 0.15'}<br />
        {'Neither: 0.15'}<br />
        {'Total: 0.45 + 0.25 + 0.15 + 0.15 = 1.00 ✓'}
      </Box>

      <Callout kind="connect">
        Always check that your probabilities sum to 1. After filling in a Venn diagram or a two-way table,
        add all the regions — they should total exactly 1 (or, if working with counts, the grand total).
        This is a quick error-check that catches arithmetic mistakes before they propagate through the problem.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Tree Diagrams</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Tree diagrams are visual tools for organized counting and for applying the multiplication rule across
        multiple stages. Each branch represents one possible outcome at that stage, and the probability of a path
        through the tree is the product of the probabilities on each branch along that path.
      </Typography>

      <Callout kind="try-this">
        A bag contains 3 red and 2 blue balls. You draw two balls without replacement. Build a tree:
        First draw: P(R₁) = 3/5, P(B₁) = 2/5. After a red first draw: P(R₂|R₁) = 2/4, P(B₂|R₁) = 2/4.
        After a blue first draw: P(R₂|B₁) = 3/4, P(B₂|B₁) = 1/4.
        P(one of each color) = P(R then B) + P(B then R) = (3/5)(2/4) + (2/5)(3/4) = 6/20 + 6/20 = 12/20 = 0.6.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Two-Way Tables and Probability</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Two-way tables (also called contingency tables) display the joint distribution of two categorical variables
        and are a major source of probability questions. From a two-way table you can read off marginal probabilities,
        joint probabilities, and compute conditional probabilities directly.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Survey of 200 students: prefer morning or evening, and grade level.'}<br />
        {'              | 11th | 12th | Total'}<br />
        {'Morning       |  40  |  60  |  100 '}<br />
        {'Evening       |  70  |  30  |  100 '}<br />
        {'Total         | 110  |  90  |  200 '}<br /><br />
        {'Marginal P(Morning) = 100/200 = 0.5'}<br />
        {'Joint P(11th AND Morning) = 40/200 = 0.2'}<br />
        {'Conditional P(Morning | 11th) = 40/110 ≈ 0.364'}<br />
        {'P(Morning) ≠ P(Morning | 11th)  →  Grade and preference are NOT independent.'}
      </Box>

      <GuideTable
        headers={['Probability type', 'How to find from the table', 'Example using table above']}
        rows={[
          ['Marginal probability', 'Row or column total ÷ grand total', 'P(12th grade) = 90/200 = 0.45'],
          ['Joint probability', 'Cell value ÷ grand total', 'P(12th AND Evening) = 30/200 = 0.15'],
          ['Conditional probability', 'Cell value ÷ given condition\'s marginal total', 'P(Evening | 12th) = 30/90 = 1/3'],
          ['Testing independence', 'Check if P(A|B) = P(A) for all combinations', 'P(Morning|11th) ≈ 0.364 ≠ P(Morning) = 0.5 → NOT independent'],
        ]}
      />

      <Callout kind="in-plain-words">
        A two-way table is a probability machine. The grand total is your denominator for everything except
        conditional probabilities — for those, you use the relevant row or column total as the denominator.
        Think of it as zooming in: conditional probability restricts your view to one slice of the table.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Bayes' Theorem and False Positives (Conceptual)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Conditional probability leads naturally to one of the most surprising and important results in applied
        statistics: the false positive problem. Even a highly accurate medical test can produce mostly false
        positives if the condition being tested for is rare.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Example: A disease affects 1% of the population. A test is 99% accurate (sensitivity = specificity = 0.99).'}<br />
        {'In a population of 10,000:'}<br />
        {'  100 actually have the disease → 99 test positive, 1 tests negative (false negative)'}<br />
        {'  9,900 don\'t have disease → 99 test positive (false positives), 9,801 test negative'}<br />
        {'Total positive tests: 99 + 99 = 198'}<br />
        {'P(disease | positive test) = 99/198 = 0.5'}<br />
        {'Even with a 99% accurate test, a positive result means only a 50% chance of disease!'}
      </Box>

      <Callout kind="why-it-matters">
        This is why medical screening for rare conditions always requires a confirmatory test. The mathematics
        of conditional probability — specifically, Bayes' Theorem — shows that when the base rate of a condition
        is very low, even accurate tests produce many false positives. This is not a flaw in the test; it's a
        mathematical consequence of low base rates. Drug tests, cancer screenings, and security screening
        systems all face this challenge. Understanding conditional probability lets you reason clearly about
        these real-world situations that affect policy decisions and individual lives.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Geometric Distribution (Introduction)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The geometric distribution is closely related to the binomial. Both require binary outcomes and constant
        probability p, but the geometric asks a different question: <em>How many trials until the first success?</em>
        The number of trials X until (and including) the first success follows a geometric distribution.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Geometric distribution: P(X = k) = (1−p)^(k−1) · p     for k = 1, 2, 3, ...'}<br />
        {'Mean (expected number of trials): μ = 1/p'}<br />
        {'Standard deviation: σ = √((1−p)/p²)'}<br /><br />
        {'Example: A basketball player makes free throws with p = 0.75.'}<br />
        {'P(first miss on trial 3) = P(success)(success)(failure) = (0.75)(0.75)(0.25) = 0.1406'}<br />
        {'Mean trials to first miss: μ = 1/0.25 = 4 — on average, 4 free throws before missing.'}
      </Box>

      <GuideTable
        headers={['Feature', 'Binomial', 'Geometric']}
        rows={[
          ['What it counts', 'Number of successes in n fixed trials', 'Number of trials until the first success'],
          ['n (number of trials)', 'Fixed before the experiment', 'Not fixed — can be any positive integer'],
          ['P(X = k)', 'C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ', '(1−p)^(k−1)·p'],
          ['Mean', 'np', '1/p'],
          ['Standard deviation', '√(np(1−p))', '√((1−p)/p²)'],
          ['Example question', '"P(exactly 7 heads in 10 flips)"', '"P(first head on the 5th flip)"'],
        ]}
      />

      <Callout kind="coachs-note">
        The geometric distribution is sometimes covered only briefly in SC Probability and Statistics, but the
        conceptual distinction from binomial is frequently tested. The key word to listen for: "until" or
        "before the first" → geometric. "In n trials" or "exactly k successes" → binomial. Read the
        problem carefully to identify which distribution applies before reaching for a formula.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Probability Distributions
// ─────────────────────────────────────────────────────────────────────
function Section5Distributions() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>From Events to Random Variables</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>random variable</strong> assigns a numerical value to each outcome in a sample space.
        It "translates" qualitative randomness into a number we can analyze mathematically.
        There are two types:
      </Typography>

      <GuideTable
        headers={['Type', 'Definition', 'Examples']}
        rows={[
          ['Discrete', 'Takes a finite or countably infinite set of values (usually integers)', 'Number of heads in 10 flips; number of customers in an hour; number of defective items in a batch'],
          ['Continuous', 'Can take any value in an interval — uncountably many possibilities', 'Height, weight, time, temperature, blood pressure — any measurement'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Expected Value of a Discrete Random Variable</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The expected value E(X) is the long-run average outcome — what you'd get as the mean if you repeated
        the random process an infinite number of times.
      </Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'E(X) = Σ [x · P(X = x)] = x₁P(x₁) + x₂P(x₂) + … + xₙP(xₙ)'}<br /><br />
        {'Example: Roll a fair die. X = the value showing.'}<br />
        {'E(X) = 1(1/6) + 2(1/6) + 3(1/6) + 4(1/6) + 5(1/6) + 6(1/6) = 21/6 = 3.5'}<br />
        {'The die never shows 3.5 — but the average over many rolls approaches 3.5.'}
      </Box>

      <Callout kind="in-plain-words">
        Expected value is a weighted average — each outcome is weighted by its probability. If an outcome is
        twice as likely, it contributes twice as much to the average. E(X) is the balance point of the probability
        distribution. For a fair die, the distribution is symmetric, so the balance point is exactly in the middle.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Binomial Distribution</Typography>

      <Analogy title="Flipping a biased coin n times">
        Suppose you have a coin that lands heads 30% of the time (p = 0.30). You flip it 20 times and
        want to know the probability of getting exactly 8 heads. There are C(20, 8) ways to arrange
        8 heads among 20 flips. Each specific arrangement has probability (0.30)⁸ × (0.70)¹² — 8 heads
        each at 30% and 12 tails each at 70%. The binomial formula multiplies these two pieces together.
        Every binomial problem is the same structure: count the arrangements, then multiply by the probability
        of one specific arrangement.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The binomial distribution applies when the following four conditions hold (BINS mnemonic):
      </Typography>

      <GuideTable
        headers={['Letter', 'Condition', 'What to check']}
        rows={[
          ['B', 'Binary outcomes', 'Each trial results in success or failure only'],
          ['I', 'Independent trials', 'The outcome of one trial doesn\'t affect the others (or 10% condition: sample < 10% of population)'],
          ['N', 'Fixed number of trials (n)', 'n is determined before the experiment begins'],
          ['S', 'Same probability of success (p)', 'p is constant across all trials'],
        ]}
      />

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'Binomial Formulas:'}<br />
        {'P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ'}<br />
        {'Mean:  μ = np'}<br />
        {'Std Dev:  σ = √(np(1−p))'}<br /><br />
        {'Example: n=10 flips, p=0.5 (fair coin). P(X=7):'}<br />
        {'= C(10,7) · (0.5)⁷ · (0.5)³ = 120 · (1/128) · (1/8) = 120/1024 ≈ 0.117'}
      </Box>

      <Callout kind="connect">
        The binomial mean μ = np makes intuitive sense: if you flip a coin 100 times and it's fair (p = 0.5),
        you expect about 50 heads. If p = 0.3, you expect 0.3 × 100 = 30. The formula just codifies
        "probability times number of trials." The standard deviation σ = √(np(1−p)) is highest when p = 0.5
        (maximum uncertainty) and smallest when p is near 0 or 1 (outcome is nearly predictable).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Normal Distribution</Typography>

      <Analogy title="Nature's default shape">
        Nature loves the normal distribution. Heights of people, measurement errors in a lab, scores on standardized
        tests, diameters of manufactured parts, the amount of rainfall in a month — all of these, when measured on
        large populations, tend to cluster symmetrically around a center value with fewer and fewer observations
        farther from the center. This isn't a coincidence — the Central Limit Theorem (Section 6) explains mathematically
        why sums and averages of many small random effects converge to the bell curve. The normal distribution
        is nature's default because most real-world quantities are the sum of many small random contributions.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The normal distribution N(μ, σ) is fully described by its mean μ (center) and standard deviation σ (spread).
        It is symmetric and bell-shaped. All normal distributions can be standardized to the Standard Normal N(0, 1)
        using z-scores.
      </Typography>

      <MermaidDiagram chart={`graph LR
  subgraph Normal Distribution Zones
    Z1["μ − 3σ to μ + 3σ\n≈ 99.7% of data"]
    Z2["μ − 2σ to μ + 2σ\n≈ 95% of data"]
    Z3["μ − 1σ to μ + 1σ\n≈ 68% of data"]
    Z4["Center: μ\nMean = Median = Mode"]
  end
  Z1 --> Z2 --> Z3 --> Z4`} />

      <GuideTable
        headers={['Range', '% of data (approx)', 'Example: heights, μ=66 in, σ=3 in']}
        rows={[
          ['μ ± 1σ', '≈ 68%', '63 to 69 inches — about 2 in 3 people'],
          ['μ ± 2σ', '≈ 95%', '60 to 72 inches — about 19 in 20 people'],
          ['μ ± 3σ', '≈ 99.7%', '57 to 75 inches — nearly everyone'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Z-Scores and the Standard Normal Table</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'z = (x − μ) / σ'}<br /><br />
        {'Example: μ = 70, σ = 8. What % score below 82?'}<br />
        {'z = (82 − 70) / 8 = 12/8 = 1.5'}<br />
        {'Look up z = 1.5 in the standard normal table → area to the left = 0.9332'}<br />
        {'About 93.32% of scores fall below 82.'}
      </Box>

      <Callout kind="watch-for">
        The z-table gives the area to the LEFT of the z-score. For "above" problems, subtract from 1.
        For "between" problems, subtract the smaller area from the larger. Always draw a sketch of the
        normal curve and shade the region you want before looking up z-scores — this prevents the most
        common direction errors (looking up the wrong tail).
      </Callout>

      <GuideTable
        headers={['Feature', 'Binomial', 'Normal']}
        rows={[
          ['Type', 'Discrete', 'Continuous'],
          ['Shape', 'Symmetric when p = 0.5; skewed otherwise', 'Always symmetric, bell-shaped'],
          ['Parameters', 'n (trials) and p (success probability)', 'μ (mean) and σ (standard deviation)'],
          ['Key formula', 'P(X=k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ', 'Use z-scores and z-table (no closed formula)'],
          ['Mean', 'np', 'μ'],
          ['SD', '√(np(1−p))', 'σ'],
          ['Normal approx valid?', 'Yes, when np ≥ 10 and n(1−p) ≥ 10', 'Always (it IS the normal)'],
        ]}
      />

      <Callout kind="why-it-matters">
        The normal distribution is the bridge from probability to inference. Confidence intervals and hypothesis
        tests rely on normal distributions (or t-distributions, which are close cousins). Every formula in
        Sections 7 and 8 uses z-scores or the normal curve. Mastering z-score computation and z-table lookup
        now saves enormous time when you reach the inference chapters.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Using the Normal Distribution: A Complete Worked Example</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The heights of adult males in the US are approximately normally distributed with mean μ = 69 inches and
        standard deviation σ = 2.8 inches. Let's answer three common types of normal distribution questions:
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Type 1: What proportion of men are taller than 74 inches?'}<br />
        {'  z = (74 − 69)/2.8 = 5/2.8 ≈ 1.79'}<br />
        {'  Table: P(Z < 1.79) ≈ 0.9633'}<br />
        {'  P(X > 74) = 1 − 0.9633 = 0.0367  →  About 3.67% of men exceed 74 inches.'}<br /><br />
        {'Type 2: What height separates the bottom 10% from the top 90%?'}<br />
        {'  Lookup: What z has 0.10 to its left? → z ≈ −1.28'}<br />
        {'  x = μ + z·σ = 69 + (−1.28)(2.8) = 69 − 3.58 ≈ 65.4 inches'}<br /><br />
        {'Type 3: What proportion are between 66 and 72 inches?'}<br />
        {'  z₁ = (66−69)/2.8 ≈ −1.07  →  P(Z < −1.07) ≈ 0.1423'}<br />
        {'  z₂ = (72−69)/2.8 ≈ 1.07   →  P(Z < 1.07) ≈ 0.8577'}<br />
        {'  P(66 < X < 72) = 0.8577 − 0.1423 = 0.7154  →  About 71.5%'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Rules for Combining Random Variables</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When you work with multiple random variables simultaneously, the expected value and variance follow
        predictable rules. These are tested in more advanced probability and statistics courses, but knowing
        them helps with binomial mean/variance and regression interpretations.
      </Typography>

      <GuideTable
        headers={['Rule', 'Formula', 'Note']}
        rows={[
          ['E(X + Y)', 'E(X) + E(Y)', 'Always true — expected values always add'],
          ['E(X − Y)', 'E(X) − E(Y)', 'Always true'],
          ['Var(X + Y)', 'Var(X) + Var(Y)', 'Only if X and Y are INDEPENDENT'],
          ['Var(X − Y)', 'Var(X) + Var(Y)', 'Variances ADD even when you subtract — always positive!'],
          ['SD(X ± Y)', '√(Var(X) + Var(Y))', 'Take square root of the sum of variances (if independent)'],
          ['E(aX + b)', 'a·E(X) + b', 'Linear transformation: multiplier scales mean, constant shifts it'],
          ['Var(aX + b)', 'a²·Var(X)', 'Constant b disappears; multiplier is squared'],
        ]}
      />

      <Callout kind="watch-for">
        Variances ADD — they do NOT subtract. Even for X − Y (the difference of two independent random
        variables), you add the variances: Var(X − Y) = Var(X) + Var(Y). This surprises almost every student
        the first time. Intuitively, subtracting two uncertain quantities creates at least as much uncertainty
        as adding them — think about the range of possible values for "X minus Y" compared to "X" alone.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Normal Distribution: Finding Probabilities — Full Procedure</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Three question types appear repeatedly on tests. For each, the process is: identify the type,
        convert to z-score(s), use the z-table, then adjust the result if needed.
      </Typography>

      <GuideTable
        headers={['Question type', 'Given', 'Find', 'z-table use']}
        rows={[
          ['"What proportion is BELOW X?"', 'X value', 'Area to the left of X', 'Read directly from table for z = (X−μ)/σ'],
          ['"What proportion is ABOVE X?"', 'X value', 'Area to the right of X', '1 − (table value for z)'],
          ['"What proportion is BETWEEN X₁ and X₂?"', 'Two X values', 'Area between two z-scores', 'Table(z₂) − Table(z₁)'],
          ['"What X corresponds to the kth percentile?"', 'Percentile k', 'X value', 'Find z with area k in table; then X = μ + z·σ'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Normal Approximation to the Binomial</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When the binomial conditions are met and both np ≥ 10 and n(1−p) ≥ 10, the binomial distribution is
        approximately normal. This approximation lets you use z-scores and the z-table instead of computing
        many binomial terms. The binomial X ~ B(n, p) is approximated by N(np, √(np(1−p))).
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Example: A fair coin is flipped 200 times. What is P(X ≥ 110 heads)?'}<br />
        {'Check: np = 200(0.5) = 100 ≥ 10 ✓;  n(1−p) = 100 ≥ 10 ✓'}<br />
        {'Approximate with N(μ = 100, σ = √(200·0.5·0.5) = √50 ≈ 7.07)'}<br />
        {'z = (110 − 100)/7.07 ≈ 1.41'}<br />
        {'P(X ≥ 110) ≈ P(Z ≥ 1.41) = 1 − 0.9207 = 0.0793'}<br />
        {'About 7.9% chance of getting 110 or more heads in 200 flips.'}
      </Box>

      <Callout kind="connect">
        The normal approximation to the binomial is a preview of the Central Limit Theorem in Section 6.
        The binomial distribution X = number of successes in n trials is the sum of n independent Bernoulli(p)
        random variables. The CLT says sums of many independent random variables approach normality — so of
        course the binomial approaches normal for large n. The approximation condition (np ≥ 10 and n(1−p) ≥ 10)
        is simply ensuring n is "large enough" for the CLT to kick in.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Discrete Probability Distribution Tables</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        On exam questions, a discrete random variable is often given as a probability distribution table.
        You need to be able to compute E(X), Var(X), SD(X), and answer probability questions from the table.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'X (prizes won) |  0   |  1   |  2   |  5  '}<br />
        {'P(X)           | 0.50 | 0.25 | 0.20 | 0.05'}<br /><br />
        {'E(X) = 0(0.50) + 1(0.25) + 2(0.20) + 5(0.05)'}<br />
        {'     = 0 + 0.25 + 0.40 + 0.25 = 0.90'}<br /><br />
        {'E(X²) = 0²(0.50) + 1²(0.25) + 2²(0.20) + 5²(0.05)'}<br />
        {'      = 0 + 0.25 + 0.80 + 1.25 = 2.30'}<br /><br />
        {'Var(X) = E(X²) − [E(X)]² = 2.30 − (0.90)² = 2.30 − 0.81 = 1.49'}<br />
        {'SD(X) = √1.49 ≈ 1.22 prizes'}
      </Box>

      <Callout kind="make-it-stick">
        The formula Var(X) = E(X²) − [E(X)]² is often faster than computing squared deviations one by one.
        To use it: (1) compute E(X) as usual; (2) compute E(X²) by squaring each x-value before multiplying
        by its probability; (3) subtract [E(X)]². This shortcut formula appears frequently in AP-style problems
        and is worth memorizing.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Sampling Distributions & the CLT
// ─────────────────────────────────────────────────────────────────────
function Section6SamplingDistributions() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>From Data to Estimators: The Sampling Distribution</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A sampling distribution is the probability distribution of a statistic (like x̄ or p̂) computed from
        all possible samples of a given size n drawn from a population. This is a theoretical concept — we
        don't actually take all possible samples — but it tells us how our statistic would behave if we could.
      </Typography>

      <Analogy title="Repeatedly polling different random samples and plotting the averages">
        Imagine a school of 2,000 students with a true mean GPA of 3.1 (σ = 0.5). You take a random sample of
        50 students and compute x̄ = 3.08. Another group takes a different random sample of 50 and gets x̄ = 3.14.
        A third group gets x̄ = 3.07. If you gathered all possible sample means of n = 50 and plotted them as
        a histogram, that histogram is the sampling distribution of x̄. The Central Limit Theorem tells you
        exactly what shape that histogram will have — and it's normal, centered at 3.1, with a predictable spread.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Central Limit Theorem (CLT)</Typography>

      <Callout kind="why-it-matters">
        The Central Limit Theorem is arguably the most important theorem in all of statistics. It is the reason
        that virtually all inference procedures work. It says that no matter how weird the population distribution
        is — skewed, bimodal, flat, anything — the distribution of sample means x̄ from large enough samples
        will be approximately normal. This is extraordinary: normal distributions emerge from chaos when you
        average enough random values together.
      </Callout>

      <Box sx={{ p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, lineHeight: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Central Limit Theorem — Formal Statement</Typography>
        <Typography sx={{ lineHeight: 1.8 }}>
          If x₁, x₂, …, xₙ is a random sample from a population with mean μ and standard deviation σ,
          then for sufficiently large n, the sampling distribution of x̄ is approximately:
        </Typography>
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.92rem', mt: 1, lineHeight: 2 }}>
          {'x̄ ~ N(μ, σ/√n)'}<br />
          {'Mean of sampling distribution: μ_x̄ = μ'}<br />
          {'Standard deviation of sampling distribution: σ_x̄ = σ/√n (called the Standard Error, SE)'}
        </Box>
        <Typography sx={{ mt: 1, lineHeight: 1.75, fontSize: '0.92rem' }}>
          "Sufficiently large" means n ≥ 30 in most situations. If the population itself is normally distributed,
          any sample size works.
        </Typography>
      </Box>

      <MermaidDiagram chart={`graph TD
  A["Population\n(any shape — could be skewed, bimodal, uniform, etc.)"]
  A --> B["Take random sample of size n"]
  B --> C["Compute x̄ for that sample"]
  C --> D["Repeat for all possible samples of size n"]
  D --> E["Plot all the x̄ values"]
  E --> F["Result: Sampling Distribution of x̄"]
  F --> G["Shape: Approximately NORMAL if n ≥ 30"]
  F --> H["Center: μ (same as population mean)"]
  F --> I["Spread: SE = σ/√n (shrinks as n increases)"]`} />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Standard Error: The GPS Precision of Your Estimate</Typography>

      <Analogy title="Standard error as GPS precision — larger samples, smaller error bars">
        A GPS receiver with a bad antenna might tell you your location within ±50 meters — not very precise.
        An advanced multi-antenna GPS tells you within ±2 meters. The standard error (SE = σ/√n) is exactly
        this kind of precision measure for sample means. A small sample (n = 10) gives an SE of σ/3.16 —
        relatively imprecise. A large sample (n = 900) gives SE = σ/30 — far more precise. Quadrupling the
        sample size cuts the SE in half. You pay four times the data-collection cost for twice the precision.
      </Analogy>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'Population: μ = 500, σ = 100'}<br />
        {'n = 25: SE = 100/√25 = 100/5 = 20'}<br />
        {'n = 100: SE = 100/√100 = 100/10 = 10'}<br />
        {'n = 400: SE = 100/√400 = 100/20 = 5'}<br />
        {'Quadrupling n halves the SE — diminishing returns apply.'}
      </Box>

      <Callout kind="in-plain-words">
        The standard error is the standard deviation of the sampling distribution. It measures how much
        sample means typically vary from sample to sample. A large standard error means sample means jump
        around a lot — each new sample could give a very different answer. A small standard error means
        sample means are tightly clustered around the true population mean — you can trust a single sample's
        x̄ to be close to μ. Larger samples always give smaller standard error.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sampling Distribution of a Proportion (p̂)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When the variable of interest is categorical (success/failure), the sample proportion p̂ = x/n
        (number of successes divided by sample size) is the estimator of the population proportion p.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'Sampling distribution of p̂:'}<br />
        {'Shape: approximately Normal when np ≥ 10 AND n(1−p) ≥ 10'}<br />
        {'Mean: μ_p̂ = p'}<br />
        {'Standard Error: SE_p̂ = √(p(1−p)/n)'}
      </Box>

      <GuideTable
        headers={['Feature', 'Population', 'Sampling Distribution of x̄']}
        rows={[
          ['Center', 'μ (fixed, unknown)', 'μ_x̄ = μ (same)'],
          ['Spread', 'σ (fixed, unknown)', 'σ_x̄ = σ/√n (shrinks with larger n)'],
          ['Shape', 'Could be anything', 'Approximately Normal for n ≥ 30 (CLT)'],
          ['What it describes', 'Individual observations', 'Sample means from repeated sampling'],
        ]}
      />

      <Callout kind="make-it-stick">
        The CLT is why n ≥ 30 appears in almost every inference formula's conditions. Below 30, the normal
        approximation may not be reliable unless you know the population is already normally distributed.
        Above 30, you can safely use normal-distribution methods (z-scores, z-tables) for the sampling
        distribution of x̄ regardless of what the population looks like. This is the most powerful
        result in introductory statistics.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Simulating the CLT: Building Intuition</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The Central Limit Theorem is often demonstrated through simulation, which helps build genuine intuition
        before the theorem itself feels abstract. Here's the mental simulation process:
      </Typography>

      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.75, fontSize: '0.92rem' } }}>
        <li>Start with ANY population distribution — imagine a very right-skewed distribution of household incomes.</li>
        <li>Take a random sample of n = 5 incomes and compute the sample mean x̄₁.</li>
        <li>Take another random sample of n = 5 and compute x̄₂. And another. And another. Do this 1,000 times.</li>
        <li>Plot all 1,000 sample means as a histogram. It looks roughly bell-shaped, but still a bit skewed (n is small).</li>
        <li>Repeat the simulation with n = 30. The histogram of 1,000 sample means now looks much more normal.</li>
        <li>Repeat with n = 100. The histogram looks very close to a normal distribution, tightly clustered around μ.</li>
      </Box>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The simulation reveals three things simultaneously: (1) the sampling distribution's shape approaches
        normal as n grows; (2) the center stays at μ throughout; and (3) the spread (standard error) shrinks
        proportionally to 1/√n. The CLT packages all three of these observations into one mathematical theorem.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Worked Example: Applying the CLT</Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'A bottling company fills bottles with μ = 16 oz and σ = 0.4 oz.'}<br />
        {'Quality control samples 64 bottles. Find P(x̄ < 15.9 oz).'}<br /><br />
        {'By CLT: x̄ ~ N(16, 0.4/√64) = N(16, 0.4/8) = N(16, 0.05)'}<br />
        {'z = (15.9 − 16)/0.05 = −0.1/0.05 = −2.0'}<br />
        {'P(Z < −2.0) = 0.0228'}<br /><br />
        {'Interpretation: There is about a 2.28% chance that a random sample of 64 bottles'}<br />
        {'will have a mean fill below 15.9 oz, if the true mean is really 16 oz.'}
      </Box>

      <GuideTable
        headers={['Condition', 'What to check', 'What to do if condition fails']}
        rows={[
          ['Random sample', 'Was the sample selected randomly from the population?', 'Note limitation; results may not generalize'],
          ['Independence', 'Are observations independent? (Sampling w/o replacement: n < 10% of population)', 'If violated, standard error formula is inaccurate — use finite population correction'],
          ['Large enough n (for CLT)', 'n ≥ 30, OR population known to be normal', 'For small n from non-normal populations, use bootstrap methods or note the limitation'],
          ['For proportions: np and n(1−p)', 'np ≥ 10 and n(1−p) ≥ 10', 'If not met, the normal approximation is poor; use exact binomial methods'],
        ]}
      />

      <Callout kind="connect">
        The 10% condition (n must be less than 10% of the population) ensures that sampling without replacement
        still produces approximately independent observations. If you're sampling 50 people from a town of 200,
        the early draws dramatically affect later ones — you can't treat them as independent. If you're sampling
        50 people from a city of 1,000,000, removing 50 from the pool barely changes anything — independence is
        an excellent approximation. This is why the 10% condition matters.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: Confidence Intervals
// ─────────────────────────────────────────────────────────────────────
function Section7ConfidenceIntervals() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Point Estimates vs. Interval Estimates</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>point estimate</strong> is a single number calculated from a sample that serves as a best guess
        for the population parameter. A <strong>confidence interval</strong> acknowledges uncertainty by providing
        a range of plausible values for the parameter, along with a confidence level that tells you how reliable
        the procedure is across repeated sampling.
      </Typography>

      <Analogy title="A fishing net vs. a single spear">
        Trying to estimate a population parameter with a single point estimate is like trying to spear one specific fish
        in a murky lake — you might hit it, but the chances are slim. A confidence interval is like casting a net:
        you don't know exactly where the fish is, but you know that a net of this size and location will catch the fish
        a certain percentage of the time. A 95% confidence interval is a net that, used correctly, catches the true
        population parameter 95% of the time across all the possible samples you could take. Making the net wider
        (higher confidence level) makes you more likely to catch the fish, but gives you less precise location information.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Confidence Interval Formula</Typography>

      <Box sx={{ p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, lineHeight: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>General Structure</Typography>
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.92rem', lineHeight: 2.2 }}>
          {'CI = Point Estimate ± Margin of Error'}<br />
          {'   = Point Estimate ± (Critical Value) × (Standard Error)'}<br /><br />
          {'For a population mean (σ known): x̄ ± z* · (σ/√n)'}<br />
          {'For a population mean (σ unknown): x̄ ± t* · (s/√n)   [use t-distribution with df = n−1]'}<br />
          {'For a population proportion: p̂ ± z* · √(p̂(1−p̂)/n)'}
        </Box>
      </Box>

      <GuideTable
        headers={['Confidence Level', 'Critical Value z*', 'Interpretation']}
        rows={[
          ['90%', '1.645', '90% of such intervals will capture the true parameter'],
          ['95%', '1.960', '95% of such intervals will capture the true parameter'],
          ['99%', '2.576', '99% of such intervals will capture the true parameter'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  A["Start: Collect random sample of size n"]
  A --> B["Compute point estimate (x̄ or p̂)"]
  B --> C["Verify conditions\n• Random sample? ✓\n• n ≥ 30 (or normal pop)? ✓\n• Independence? ✓"]
  C --> D["Choose confidence level (90%, 95%, 99%)"]
  D --> E["Find critical value z* (or t*)"]
  E --> F["Compute Standard Error (SE = σ/√n or s/√n)"]
  F --> G["Compute Margin of Error = z* × SE"]
  G --> H["Build interval: (estimate − ME, estimate + ME)"]
  H --> I["Interpret in context"]`} />

      <Analogy title="A weather forecast range instead of a single temperature">
        When a meteorologist says "tomorrow's high will be between 68°F and 75°F," they're giving a confidence
        interval, not a point estimate. They're acknowledging the inherent uncertainty in the forecast while still
        giving you useful information. A 95% confidence interval works the same way: "Based on our sample, we're
        95% confident that the true population mean is between 68 and 75" tells you both a plausible range and
        how reliable the estimation procedure is. It's more honest and more useful than claiming "the mean is exactly 71.3."
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Interpreting Confidence Intervals — The Correct Way</Typography>

      <Callout kind="watch-for">
        The single most common misconception in all of statistics: "There is a 95% probability that the true
        mean is in this specific interval." This is WRONG. The true population mean is a fixed number — it either
        is or isn't in your interval, and there's no probability involved for this specific interval.
        The correct interpretation: "We used a procedure that, in repeated sampling, would produce intervals
        capturing the true mean 95% of the time. This specific interval was produced by that procedure."
        The 95% refers to the long-run success rate of the METHOD, not to any specific interval.
      </Callout>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, lineHeight: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}>Correct interpretation template:</Typography>
        <Typography sx={{ fontStyle: 'italic', lineHeight: 1.8 }}>
          "We are [confidence level]% confident that the true population [parameter] is between [lower bound] and [upper bound]."
        </Typography>
        <Typography sx={{ mt: 1, fontSize: '0.88rem', lineHeight: 1.75 }}>
          Example: "We are 95% confident that the true mean test score of all students in the district is between 74.2 and 81.8 points."
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Factors Affecting the Width of a Confidence Interval</Typography>

      <GuideTable
        headers={['Factor', 'Effect on CI Width', 'Why']}
        rows={[
          ['Increase confidence level (e.g., 95% → 99%)', 'WIDER', 'Larger z* multiplies the SE, expanding the margin of error'],
          ['Increase sample size n', 'NARROWER', 'SE = σ/√n shrinks as n grows; more data = more precision'],
          ['Increase variability (σ or s)', 'WIDER', 'More spread in the data → more uncertainty in the estimate'],
          ['Decrease confidence level (e.g., 95% → 90%)', 'NARROWER', 'Smaller z*, smaller margin of error — but less reliable'],
        ]}
      />

      <Callout kind="coachs-note">
        There's always a trade-off between precision and confidence. A very wide interval (like "the mean is
        between 10 and 1,000") is highly likely to be correct but completely useless. A very narrow interval
        gives precise information but might miss the true parameter. Increasing sample size is the only way
        to simultaneously increase precision AND maintain high confidence — it's the only "free lunch" in
        the width trade-off. This is why sample size planning is done before data collection, not after.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>When to Use t* Instead of z*</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The z* critical values assume you know the population standard deviation σ. In practice, σ is almost
        never known, so you substitute the sample standard deviation s. This introduces additional uncertainty,
        which is handled by using the <strong>t-distribution</strong> with degrees of freedom = n − 1.
        The t-distribution has heavier tails than the normal — it's more conservative (wider intervals) to
        account for the extra uncertainty from estimating σ.
      </Typography>

      <GuideTable
        headers={['Condition', 'Critical value to use', 'Notes']}
        rows={[
          ['σ known (rare in practice)', 'z* from standard normal table', 'Requires n ≥ 30 or normal population'],
          ['σ unknown (almost always)', 't* from t-table with df = n − 1', 'More conservative; t → z as n → ∞'],
          ['Proportion p (any n with conditions)', 'z* (use p̂ in SE formula)', 'Need np̂ ≥ 10 and n(1−p̂) ≥ 10'],
        ]}
      />

      <Callout kind="try-this">
        A sample of n = 16 measurements gives x̄ = 42.3 and s = 6.4. Build a 95% CI for the population mean.
        df = 15 → t* ≈ 2.131. SE = 6.4/√16 = 1.6. ME = 2.131 × 1.6 = 3.41.
        CI: (42.3 − 3.41, 42.3 + 3.41) = (38.89, 45.71).
        Interpretation: We are 95% confident the true population mean is between 38.89 and 45.71.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Confidence Intervals for Proportions: A Complete Example</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A poll of 400 randomly selected SC voters finds that 228 approve of a proposed education policy.
        Construct and interpret a 95% confidence interval for the true proportion of all SC voters who approve.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Step 1: Point estimate: p̂ = 228/400 = 0.57'}<br />
        {'Step 2: Check conditions:'}<br />
        {'  Random sample? ✓ (stated as randomly selected)'}<br />
        {'  np̂ = 400 × 0.57 = 228 ≥ 10 ✓'}<br />
        {'  n(1−p̂) = 400 × 0.43 = 172 ≥ 10 ✓'}<br />
        {'  Independence: 400 < 10% of all SC voters ✓'}<br />
        {'Step 3: z* for 95% confidence = 1.960'}<br />
        {'Step 4: SE = √(0.57 × 0.43 / 400) = √(0.2451/400) = √0.000613 ≈ 0.02475'}<br />
        {'Step 5: ME = 1.960 × 0.02475 ≈ 0.0485'}<br />
        {'Step 6: CI: (0.57 − 0.0485, 0.57 + 0.0485) = (0.5215, 0.6185)'}<br />
        {'Interpretation: We are 95% confident that between 52.2% and 61.9% of all SC voters'}<br />
        {'approve of the proposed education policy.'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Determining Required Sample Size</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Before collecting data, researchers often need to determine how large a sample is necessary to achieve
        a desired margin of error. Rearranging the CI formula solves for n:
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'For a mean: n = (z* · σ / ME)²'}<br />
        {'For a proportion: n = (z*/ME)² · p*(1−p*)   [use p* = 0.5 if no prior estimate → gives largest n]'}<br /><br />
        {'Example: Want 95% CI for a proportion within ±3% (ME = 0.03). No prior estimate of p.'}<br />
        {'n = (1.96/0.03)² × 0.5 × 0.5 = (65.33)² × 0.25 = 4268.4 × 0.25 ≈ 1,068'}<br />
        {'Always ROUND UP — you need at least 1,068 respondents.'}
      </Box>

      <Callout kind="in-plain-words">
        Using p* = 0.5 when you have no prior estimate is the conservative choice — it maximizes the required
        sample size, ensuring you don't underestimate. Think of it as asking "What sample size do I need to
        be safe for ANY possible proportion?" The answer is p* = 0.5, because that's where p(1−p) is largest
        (0.25). If you use a prior estimate closer to 0 or 1, you can get away with a smaller sample.
      </Callout>

      <GuideTable
        headers={['If you want...', '...then change...', '...by...']}
        rows={[
          ['Narrower interval (smaller ME)', 'Increase sample size n', 'Quadruple n to halve the ME'],
          ['Higher confidence (wider CI)', 'Use a larger z*', 'Going from 95% to 99% increases ME by ~31%'],
          ['Narrower interval at same confidence', 'Increase n OR accept less variability', 'More data is usually the only controllable option'],
          ['Same width with lower confidence', 'Use a smaller z*', 'Going from 95% to 90% narrows CI by about 16%'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 8: Hypothesis Testing & Bivariate Data
// ─────────────────────────────────────────────────────────────────────
function Section8HypothesisTesting() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Hypothesis Testing: Statistics as a Court of Law</Typography>

      <Analogy title="Hypothesis test as a criminal trial — innocent until proven guilty beyond reasonable doubt">
        In a court of law, the defendant is presumed innocent (H₀: innocent). The prosecution must present
        evidence strong enough to convince a jury beyond a reasonable doubt — only then do we reject the
        presumption of innocence. Similarly, in a hypothesis test, we begin with a null hypothesis H₀ (the
        status quo, the "boring" claim). We collect data and ask: "If H₀ were actually true, how surprising
        would this data be?" Only if the data is surprising enough (p-value below our threshold α) do we
        reject H₀. We never "prove" H₀ true — we either reject it (evidence is strong enough) or fail to
        reject it (evidence is not strong enough). "Fail to reject" is NOT the same as "accept H₀" —
        just as "not guilty" is not the same as "innocent."
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Setting Up Hypotheses</Typography>

      <GuideTable
        headers={['Symbol', 'Name', 'What it claims', 'Contains...']}
        rows={[
          ['H₀', 'Null Hypothesis', 'The default / status quo — no effect, no difference', 'Always an equality: =, ≤, or ≥'],
          ['Hₐ (or H₁)', 'Alternative Hypothesis', 'What the researcher suspects is true — there IS an effect', 'Inequality: <, >, or ≠'],
        ]}
      />

      <GuideTable
        headers={['Type of test', 'Hₐ contains', 'P-value is...']}
        rows={[
          ['Two-tailed test', '≠ (not equal)', 'Area in BOTH tails beyond ±|test stat|'],
          ['Right-tailed test', '> (greater than)', 'Area to the RIGHT of the test statistic'],
          ['Left-tailed test', '< (less than)', 'Area to the LEFT of the test statistic'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Five-Step Hypothesis Testing Procedure</Typography>

      <MermaidDiagram chart={`graph TD
  A["Step 1: State H₀ and Hₐ\n(in terms of the population parameter)"]
  A --> B["Step 2: Verify conditions\n(random sample, independence, large enough n)"]
  B --> C["Step 3: Calculate the test statistic\nz = (x̄ − μ₀) / (σ/√n)\nor t = (x̄ − μ₀) / (s/√n)"]
  C --> D["Step 4: Find the p-value\n(area in the tail(s) beyond the test statistic)"]
  D --> E["Step 5: Make a decision\nIf p-value ≤ α → Reject H₀\nIf p-value > α → Fail to Reject H₀"]
  E --> F["Step 6: State conclusion in context\nDo NOT just say 'reject H₀' — explain what it means"]`} />

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'Example:'}<br />
        {'Claim: the mean filling weight of cereal boxes is μ = 20 oz.'}<br />
        {'Sample: n = 36 boxes, x̄ = 19.7 oz, s = 1.2 oz'}<br />
        {'H₀: μ = 20   Hₐ: μ ≠ 20   (two-tailed)'}<br />
        {'α = 0.05'}<br />
        {'t = (19.7 − 20) / (1.2/√36) = −0.3 / 0.2 = −1.5'}<br />
        {'p-value = 2 × P(t₃₅ < −1.5) ≈ 2 × 0.072 = 0.144'}<br />
        {'0.144 > 0.05 → Fail to reject H₀.'}<br />
        {'Conclusion: We do not have sufficient evidence at α = 0.05 that the true mean differs from 20 oz.'}
      </Box>

      <Callout kind="watch-for">
        The p-value is NOT the probability that H₀ is true. H₀ is either true or false — it's not a random
        variable with a probability. The p-value is: "Assuming H₀ is true, the probability of observing data
        at least as extreme as what we got." A small p-value means our data would be very surprising if H₀
        were true — which gives us reason to doubt H₀. But it doesn't tell us the probability H₀ is false.
        This is one of the most misunderstood concepts in all of statistics.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Choosing the Significance Level α</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The significance level α is the threshold at which we decide evidence is strong enough to reject H₀.
        It is chosen BEFORE collecting data — changing α after seeing the data is considered data dredging or p-hacking
        and invalidates the test. Common choices and their rationale:
      </Typography>

      <GuideTable
        headers={['α value', 'When typically used', 'Interpretation']}
        rows={[
          ['α = 0.10', 'Exploratory research; social sciences; when Type I errors are not catastrophic', 'Willing to be wrong 10% of the time when H₀ is true'],
          ['α = 0.05', 'Default for most scientific research', 'Willing to be wrong 5% of the time — "one in twenty" standard'],
          ['α = 0.01', 'Medical research; safety-critical applications; high cost of false positives', 'Willing to be wrong 1% of the time — strong standard of evidence'],
          ['α = 0.001', 'Physics, genomics, nuclear safety — when stakes are extremely high', 'Require very strong evidence; rarely used outside specialized fields'],
        ]}
      />

      <Callout kind="why-it-matters">
        The choice of α reflects a value judgment about the relative costs of the two types of errors.
        In drug approval, a Type I error (approving an ineffective or harmful drug) can hurt patients,
        so α = 0.01 or lower is standard. In preliminary research aiming to generate hypotheses, a Type II
        error (missing a real effect and abandoning a promising line of inquiry) might be worse,
        so α = 0.10 is more appropriate. Statistical significance is not just a mathematical fact —
        it embeds human values about what kinds of mistakes matter most.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Type I and Type II Errors</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Because we're making decisions under uncertainty, we can make two kinds of errors:
      </Typography>

      <GuideTable
        headers={['Error Type', 'What happened', 'Probability', 'Consequence example']}
        rows={[
          ['Type I Error (False Positive)', 'Rejected H₀ when H₀ was actually true', 'α (significance level)', 'Convicting an innocent person; approving an ineffective drug'],
          ['Type II Error (False Negative)', 'Failed to reject H₀ when H₀ was actually false', 'β (beta)', 'Acquitting a guilty person; missing a real disease in a screening test'],
          ['Power = 1 − β', 'Correctly rejected H₀ when it was false', '1 − β', 'Correctly identifying a real effect or disease'],
        ]}
      />

      <GuideTable
        headers={['', 'H₀ is TRUE (in reality)', 'H₀ is FALSE (in reality)']}
        rows={[
          ['Decision: Reject H₀', 'Type I Error (probability = α)', 'Correct Decision! (Power = 1 − β)'],
          ['Decision: Fail to Reject H₀', 'Correct Decision! (probability = 1 − α)', 'Type II Error (probability = β)'],
        ]}
      />

      <Callout kind="connect">
        Reducing α (making the test more conservative) decreases the Type I error rate but increases the
        Type II error rate β — you're less likely to falsely convict, but more likely to miss a real effect.
        These two error rates trade off against each other. The only way to reduce BOTH simultaneously is
        to increase the sample size — more data makes the test more powerful while keeping α controlled.
        Power increases when: sample size increases, the true effect size is larger, or σ is smaller.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Bivariate Data: Correlation and Regression</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When we have two quantitative variables measured on the same individuals, we're interested in the
        relationship between them. Two key tools: correlation (measures the strength and direction of the
        linear relationship) and regression (finds the best-fit line to model that relationship).
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Correlation Coefficient (r)</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'r ranges from −1 to +1.'}<br />
        {'r = +1: perfect positive linear relationship'}<br />
        {'r = −1: perfect negative linear relationship'}<br />
        {'r = 0: no linear relationship (may still have a curve)'}<br />
        {'|r| close to 1: strong linear relationship'}<br />
        {'|r| close to 0: weak linear relationship'}
      </Box>

      <Callout kind="why-it-matters">
        Correlation measures the strength and direction of a linear relationship only. If the relationship
        is curved (like a U-shape), r could be near 0 even though the variables are strongly related.
        Always plot your data in a scatterplot before calculating r — a scatterplot reveals non-linear
        relationships that correlation misses. And remember: correlation describes association, not causation.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Least-Squares Regression Line</Typography>

      <Analogy title="The best straight path through scattered breadcrumbs">
        Imagine a trail of breadcrumbs scattered in a roughly linear pattern across the floor. You want to
        draw one straight line that stays as close to all the breadcrumbs as possible. The least-squares
        regression line is that line — it minimizes the sum of the squared vertical distances (residuals) from
        each data point to the line. It's the uniquely "best" line by that standard. No other line does a
        better job of tracking the data's linear trend. The word "least-squares" refers to minimizing the sum
        of squared residuals.
      </Analogy>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2 }}>
        {'Regression line: ŷ = a + bx   (ŷ is the predicted value of y)'}<br />
        {'Slope: b = r · (sy / sx)      (sy = SD of y, sx = SD of x)'}<br />
        {'Intercept: a = ȳ − b · x̄     (line always passes through (x̄, ȳ))'}<br /><br />
        {'Residual = Observed y − Predicted ŷ = y − ŷ'}<br />
        {'Positive residual: point is ABOVE the line'}<br />
        {'Negative residual: point is BELOW the line'}<br />
        {'Sum of all residuals = 0 for least-squares line'}
      </Box>

      <GuideTable
        headers={['Term', 'What it tells you']}
        rows={[
          ['Slope b', 'For each 1-unit increase in x, the predicted y changes by b units on average'],
          ['Intercept a', 'The predicted y when x = 0 (may not be meaningful if x = 0 is outside data range)'],
          ['r² (coefficient of determination)', 'The proportion of variation in y explained by the linear relationship with x — e.g., r² = 0.81 means 81% of y\'s variation is explained by x'],
          ['Residual', 'How far an observed point is from the regression line; large residuals indicate the model fits poorly for those points'],
          ['Extrapolation', 'Using the regression line to predict y for x-values outside the range of the data — unreliable and discouraged'],
        ]}
      />

      <Callout kind="watch-for">
        Influential observations are points that, if removed, would substantially change the regression line
        (usually points far from x̄ with high leverage). High-leverage points can "tilt" the line dramatically.
        Outliers in the y-direction may have large residuals but modest leverage. Always look at a residual plot
        (residuals vs. x) to check for patterns — a good linear fit produces a residual plot with no systematic
        pattern (random scatter around zero). Patterns in the residual plot mean the linear model is not appropriate.
      </Callout>

      <Callout kind="make-it-stick">
        Correlation does NOT equal causation — ever. Strong r values (like r = 0.95) mean the variables move
        together, not that one causes the other. There are three explanations for a correlation: (1) X causes Y;
        (2) Y causes X; (3) a lurking/confounding variable causes both. Only a randomized controlled experiment
        can establish causation. When you see a high correlation in observational data, always ask: "What
        lurking variable might explain both variables simultaneously?"
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Connection Between Confidence Intervals and Hypothesis Tests</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Confidence intervals and hypothesis tests are mathematically equivalent procedures — they provide
        the same information in different formats. Understanding this connection helps you check your work
        and interpret results more deeply.
      </Typography>

      <GuideTable
        headers={['Situation', 'Hypothesis test says', 'Confidence interval says', 'They agree?']}
        rows={[
          ['μ₀ = 50, α = 0.05, two-tailed; p-value = 0.03', 'Reject H₀ (p < 0.05)', '95% CI does NOT contain 50', 'Yes — always'],
          ['μ₀ = 50, α = 0.05, two-tailed; p-value = 0.12', 'Fail to reject H₀ (p > 0.05)', '95% CI DOES contain 50', 'Yes — always'],
          ['p-value = 0.05 exactly', 'Borderline — just barely reject at α = 0.05', 'Value is exactly on the CI boundary', 'Yes — edge case'],
        ]}
      />

      <Callout kind="connect">
        The connection: for a two-tailed test at significance level α, if the null hypothesis value μ₀ falls
        outside the (1−α) confidence interval, you reject H₀. If μ₀ falls inside the interval, you fail to
        reject. This means you can perform a hypothesis test simply by constructing a confidence interval —
        a technique called "inverting the test." The CI and the p-value always give the same reject/fail-to-reject
        conclusion. If they disagree, you've made an error somewhere.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Residual Plots: Checking the Linear Model</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        After fitting a regression line, a residual plot (residuals on the y-axis, x-values on the x-axis)
        is the key tool for checking whether the linear model is appropriate.
      </Typography>

      <GuideTable
        headers={['Residual plot pattern', 'What it means', 'What to do']}
        rows={[
          ['Random scatter around residual = 0', 'Linear model fits well — no systematic pattern', 'Good! Report the regression line with confidence.'],
          ['Curved pattern (U-shape or arch)', 'Non-linear relationship — a line is not appropriate', 'Consider a quadratic or other non-linear model'],
          ['Fan shape (residuals spread out as x increases)', 'Non-constant variance (heteroscedasticity)', 'Logarithmic transformation of y may help'],
          ['One extreme outlier residual', 'Influential point or data error', 'Investigate — check for data entry errors or report its influence'],
          ['Systematic wave pattern', 'Possible time-trend or omitted variable', 'Consider adding variables or using time-series methods'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Statistical Significance vs. Practical Significance</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A result can be <strong>statistically significant</strong> (p-value very small, strong evidence against H₀)
        without being <strong>practically significant</strong> (the effect is too small to matter in real life).
        With a large enough sample, even tiny, meaningless effects become statistically significant.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Example: n = 100,000 patients. New drug reduces blood pressure by 0.2 mmHg.'}<br />
        {'p-value = 0.0001 → Statistically significant at any reasonable α.'}<br />
        {'But: 0.2 mmHg is clinically negligible — far below the 5+ mmHg that matters.'}<br />
        {'Statistical significance ≠ practical or clinical significance.'}<br /><br />
        {'Conversely: n = 10 patients. Drug reduces BP by 12 mmHg.'}<br />
        {'p-value = 0.08 → Not statistically significant at α = 0.05.'}<br />
        {'But: 12 mmHg is a large, clinically meaningful effect — just underpowered to detect.'}
      </Box>

      <Callout kind="coachs-note">
        Large samples can make any result statistically significant. Small samples can make meaningful effects
        look non-significant. The p-value tells you how strong the evidence against H₀ is, not whether the
        effect is large enough to care about. Always report the actual effect size (the difference in means,
        the size of the regression slope, the risk reduction) alongside the p-value. Statistics should inform
        judgment, not replace it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Chi-Square Goodness-of-Fit (Brief Introduction)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        While the main hypothesis tests in this course involve means and proportions, some curricula introduce
        the chi-square goodness-of-fit test, which tests whether observed categorical data matches an expected
        distribution. The idea is to measure how far observed counts are from what would be expected under H₀.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'H₀: The distribution of outcomes matches the expected distribution.'}<br />
        {'Hₐ: The distribution does NOT match the expected distribution.'}<br /><br />
        {'Test statistic: χ² = Σ [(Observed − Expected)² / Expected]'}<br /><br />
        {'Example: Roll a die 120 times. Expect 20 of each face. Observed: 18,22,19,21,16,24'}<br />
        {'χ² = (18−20)²/20 + (22−20)²/20 + (19−20)²/20 + (21−20)²/20 + (16−20)²/20 + (24−20)²/20'}<br />
        {'   = 4/20 + 4/20 + 1/20 + 1/20 + 16/20 + 16/20'}<br />
        {'   = 0.2 + 0.2 + 0.05 + 0.05 + 0.8 + 0.8 = 2.1'}<br />
        {'df = k − 1 = 6 − 1 = 5.  p-value > 0.05 → fail to reject H₀ — no evidence the die is unfair.'}
      </Box>

      <Callout kind="in-plain-words">
        The chi-square test computes a single number that measures total discrepancy between what we observed
        and what we expected. Larger χ² means larger discrepancy — more evidence against H₀. The degrees of
        freedom (df = number of categories − 1) account for the fact that if all but one expected count is
        correct, the last one is determined automatically. Like all hypothesis tests: small p-value → reject H₀.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Putting It All Together: A Capstone Problem</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A researcher wants to know whether a new tutoring program increases standardized test scores for
        SC 11th-grade students. She randomly selects 50 students and randomly assigns 25 to the tutoring
        program (treatment) and 25 to the control group. After 8 weeks, she records the score improvement.
        Treatment group: x̄₁ = 14.2 points, s₁ = 6.8. Control group: x̄₂ = 9.1 points, s₂ = 7.2.
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2 }}>
        {'Step 1: Identify the study type.'}<br />
        {'Randomized experiment (random assignment) → can establish causation if significant.'}<br />
        {'Random selection: not stated → results may not generalize to all SC students.'}<br /><br />
        {'Step 2: Set up hypotheses.'}<br />
        {'H₀: μ₁ − μ₂ = 0  (no difference in mean improvement)'}<br />
        {'Hₐ: μ₁ − μ₂ > 0  (tutoring improves scores more — right-tailed)'}<br />
        {'α = 0.05'}<br /><br />
        {'Step 3: Compute test statistic (two-sample t-test).'}<br />
        {'Point estimate: x̄₁ − x̄₂ = 14.2 − 9.1 = 5.1'}<br />
        {'SE = √(s₁²/n₁ + s₂²/n₂) = √(6.8²/25 + 7.2²/25) = √(1.850 + 2.074) = √3.924 ≈ 1.981'}<br />
        {'t = 5.1 / 1.981 ≈ 2.57'}<br /><br />
        {'Step 4: Find p-value.'}<br />
        {'df ≈ 24 (conservative). P(t₂₄ > 2.57) ≈ 0.008'}<br /><br />
        {'Step 5: Decision. 0.008 < 0.05 → Reject H₀.'}<br />
        {'Conclusion: There is convincing evidence at α = 0.05 that the tutoring program produces greater'}<br />
        {'mean score improvement than no tutoring, for students like those in this study.'}
      </Box>

      <Callout kind="try-this">
        Notice the scope-of-inference statement at the end: "for students like those in this study" — not
        "for all SC 11th-graders." Because participants were not randomly selected from the full population
        (only from a specific group), we can't generalize broadly. We CAN say causation (because of random
        assignment), but our generalizability is limited. Always address BOTH random assignment AND
        random selection when stating the conclusion of any hypothesis test.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section: Strategy
// ─────────────────────────────────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Probability & Statistics Exam-Day Strategy</Typography>

      <Callout kind="coachs-note">
        Probability and Statistics exams test both computation and conceptual understanding. Many of the hardest
        questions require you to <em>interpret</em> what a number means — not just calculate it. A student who
        can compute a p-value but misinterprets it will lose points that a student who understands the concepts
        (even imperfectly) will keep. Prioritize conceptual clarity at least as much as formula memorization.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>The Five Most Costly Mistakes</Typography>

      <GuideTable
        headers={['Mistake', 'What to do instead']}
        rows={[
          ['Saying "95% probability the parameter is in this interval"', 'Say "95% confident" — the parameter is fixed; confidence describes the procedure\'s reliability'],
          ['Interpreting p-value as P(H₀ is true)', 'p-value = P(data this extreme | H₀ is true) — always condition on H₀ being true'],
          ['Using the mean to describe skewed data', 'Use the median for skewed distributions; report IQR instead of SD for spread'],
          ['Forgetting to check conditions before inference', 'Every CI and hypothesis test has required conditions (random, large n, independence) — state and verify them'],
          ['Confusing correlation with causation', 'Correlation = association; causation requires randomized experiment; always ask about lurking variables'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Workflow for Multiple-Choice Statistics Problems</Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.75, fontSize: '0.92rem' } }}>
        <li><strong>Identify the parameter and statistic.</strong> What is the population? What was measured from the sample?</li>
        <li><strong>Categorize the data type.</strong> Categorical (proportion) or quantitative (mean)? This determines which formulas to apply.</li>
        <li><strong>Identify the procedure.</strong> Point estimate? Confidence interval? Hypothesis test? Regression?</li>
        <li><strong>Check conditions before calculating.</strong> Random sample? Large enough n (≥ 30 for CLT, or np ≥ 10 for proportions)? Independence?</li>
        <li><strong>Apply the correct formula.</strong> z* vs. t*? Use s not σ if the population SD is unknown.</li>
        <li><strong>Interpret in context.</strong> Write interpretations using the actual variable names and units — not generic "x" and "μ."</li>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Quick Reference: When to Use Each Inference Procedure</Typography>

      <GuideTable
        headers={['Goal', 'Parameter', 'Procedure', 'Critical value']}
        rows={[
          ['Estimate population mean, σ known', 'μ', 'z-interval: x̄ ± z*(σ/√n)', 'z* = 1.645/1.96/2.576'],
          ['Estimate population mean, σ unknown', 'μ', 't-interval: x̄ ± t*(s/√n), df = n−1', 't* from t-table'],
          ['Estimate population proportion', 'p', 'z-interval: p̂ ± z*√(p̂(1−p̂)/n)', 'z* = 1.645/1.96/2.576'],
          ['Test a claim about μ, σ known', 'μ', 'z-test: z = (x̄ − μ₀)/(σ/√n)', 'Compare to z* or find p-value'],
          ['Test a claim about μ, σ unknown', 'μ', 't-test: t = (x̄ − μ₀)/(s/√n), df = n−1', 'Compare to t* or find p-value'],
          ['Test a claim about p', 'p', 'z-test: z = (p̂ − p₀)/√(p₀(1−p₀)/n)', 'Compare to z* or find p-value'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Key Formulas to Have Ready</Typography>
      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.88rem', lineHeight: 2.2 }}>
        {'z-score: z = (x − μ)/σ'}<br />
        {'Standard Error (mean): SE = σ/√n  or  s/√n'}<br />
        {'Standard Error (proportion): SE = √(p̂(1−p̂)/n)'}<br />
        {'IQR = Q3 − Q1'}<br />
        {'Outlier fences: Q1 − 1.5·IQR  and  Q3 + 1.5·IQR'}<br />
        {'Binomial: P(X=k) = C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ;  μ = np;  σ = √(np(1−p))'}<br />
        {'Regression slope: b = r·(sy/sx);  intercept: a = ȳ − b·x̄'}<br />
        {'P(Aᶜ) = 1 − P(A);  P(A∪B) = P(A)+P(B)−P(A∩B);  P(B|A) = P(A∩B)/P(A)'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>On Free-Response and Explanation Questions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Statistics exams frequently ask you to explain your reasoning, not just compute a number.
        On these questions, every word counts. The rubric looks for:
      </Typography>
      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>Using the correct vocabulary precisely (parameter vs. statistic; confidence level vs. probability; reject vs. fail to reject)</li>
        <li>Stating conditions and checking them — not just assuming they're met</li>
        <li>Interpreting results in context — mentioning the actual variable, the actual population, the actual units</li>
        <li>Not overstating conclusions (cannot prove H₀ true; cannot claim causation from observational data)</li>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Interpreting Slopes and Intercepts in Context</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Regression questions almost always ask for a contextual interpretation of the slope and intercept.
        These templates prevent generic answers that cost points:
      </Typography>

      <Box sx={{ p: 1.5, my: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, lineHeight: 2 }}>
        <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.92rem' }}>Slope interpretation template:</Typography>
        <Typography sx={{ fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.85 }}>
          "For each additional [1 unit of x-variable], the predicted [y-variable] [increases/decreases] by [|b|] [units of y]."
        </Typography>
        <Typography sx={{ fontWeight: 700, mt: 1.5, mb: 0.5, fontSize: '0.92rem' }}>Intercept interpretation template:</Typography>
        <Typography sx={{ fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.85 }}>
          "When the [x-variable] equals zero, the predicted [y-variable] is [a] [units of y]."
          Note: Only interpret the intercept if x = 0 is meaningful in context. Otherwise, note that it is not meaningful.
        </Typography>
        <Typography sx={{ fontWeight: 700, mt: 1.5, mb: 0.5, fontSize: '0.92rem' }}>Example:</Typography>
        <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.85 }}>
          ŷ = 2.4 + 0.85x, where x = hours studied and y = exam score.
          Slope: For each additional hour studied, the predicted exam score increases by 0.85 points.
          Intercept: A student who studies 0 hours is predicted to score 2.4 points — this is technically valid
          but near the floor of the scale, so interpret cautiously.
        </Typography>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Most Tested Concepts: Frequency Ranking</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Based on common exam patterns, here is a rough ranking of how often each major concept appears
        on SC Probability and Statistics assessments:
      </Typography>

      <GuideTable
        headers={['Rank', 'Concept', 'Section', 'Typical question types']}
        rows={[
          ['1', 'Normal distribution and z-scores', '5', 'Find probability; find value given percentile; check empirical rule'],
          ['2', 'Confidence intervals (means and proportions)', '7', 'Compute CI; interpret CI; identify factors affecting width'],
          ['3', 'Hypothesis testing (means and proportions)', '8', 'State hypotheses; compute test stat; interpret p-value; state conclusion'],
          ['4', 'Descriptive statistics (center, spread, shape)', '3', 'Compute mean/median; choose appropriate measure; compare distributions'],
          ['5', 'Sampling methods and bias', '2', 'Identify bias; classify sampling method; critique a study design'],
          ['6', 'Probability rules and conditional probability', '4', 'Two-way tables; complement/addition/multiplication rules'],
          ['7', 'Regression and correlation', '8', 'Interpret slope; identify r vs. r²; check residual plot'],
          ['8', 'Central Limit Theorem and sampling distributions', '6', 'Apply CLT to find probability for x̄; identify shape/center/SE'],
          ['9', 'Binomial distribution', '5', 'Identify binomial setting; compute P(X=k); find mean/SD'],
          ['10', 'Type I/II errors and power', '8', 'Identify error type; explain consequences; effect of changing α'],
        ]}
      />

      <Callout kind="watch-for">
        Many students underestimate how much of the exam tests conceptual understanding rather than computation.
        The most common reason for losing points is not the arithmetic — it's the interpretation. Practice
        writing out full sentence answers to "explain" and "describe" questions before your exam. Verbal fluency
        with statistical language is as important as formula fluency.
      </Callout>
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Probability & Statistics Glossary</Typography>
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
