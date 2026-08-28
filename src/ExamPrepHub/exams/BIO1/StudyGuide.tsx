// BIO1 Study Guide — accordion-based layout for SC's Biology 1 course (and
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

const READING_PROGRESS_KEY = 'exam-prep-reading:BIO1';
const COMPLETION_KEY = 'exam-prep-completed:BIO1';
// Section-quiz storage is separate from drillStats. Quizzes are quick recall
// checks and don't influence the readiness signal.
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:BIO1';

// Maps each non-exempt section to a question-bank subdomain. Sections in this
// map get a SectionQuiz at the end pulling 3–4 questions from that subdomain.
const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Cells & Cell Processes',
  s3: 'Biochemistry & Energy',
  s4: 'Genetics & Heredity',
  s5: 'Evolution & Natural Selection',
  s6: 'Ecology & Ecosystems',
  s7: 'Classification & Biodiversity',
  s8: 'Homeostasis & Body Systems',
  s9: 'Scientific Inquiry & Lab Skills',
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
  { id: 's1',       num: '1',  title: 'The Big Picture',                       icon: '🗺️' },
  { id: 's2',       num: '2',  title: 'Cells & Cell Processes',                icon: '🔬' },
  { id: 's3',       num: '3',  title: 'Biochemistry & Energy',                 icon: '⚡' },
  { id: 's4',       num: '4',  title: 'Genetics & Heredity',                   icon: '🧬' },
  { id: 's5',       num: '5',  title: 'Evolution & Natural Selection',         icon: '🦎' },
  { id: 's6',       num: '6',  title: 'Ecology & Ecosystems',                  icon: '🌱' },
  { id: 's7',       num: '7',  title: 'Classification & Biodiversity',         icon: '🦋' },
  { id: 's8',       num: '8',  title: 'Homeostasis & Body Systems',            icon: '❤️' },
  { id: 's9',       num: '9',  title: 'Scientific Inquiry & Lab Skills',       icon: '🧪' },
  { id: 's-strat',  num: '★',  title: 'EOCEP Exam-Day Strategy',               icon: '🎯' },
  { id: 's-gloss',  num: '📚', title: 'Glossary',                              icon: '📚' },
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
// Real Biology 1 content. Mixed Callout kinds. Analogies open conceptual
// sections. Mermaid diagrams where a decision tree, cycle, or flow helps.
// ──────────────────────────────────────────────────────────────────────

function SectionContent({ id }: { id: string }) {
  switch (id) {
    case 's1':       return <Section1BigPicture />;
    case 's2':       return <Section2Cells />;
    case 's3':       return <Section3Biochem />;
    case 's4':       return <Section4Genetics />;
    case 's5':       return <Section5Evolution />;
    case 's6':       return <Section6Ecology />;
    case 's7':       return <Section7Classification />;
    case 's8':       return <Section8Homeostasis />;
    case 's9':       return <Section9Inquiry />;
    case 's-strat':  return <SectionStrategy />;
    case 's-gloss':  return <SectionGlossary />;
    default:         return null;
  }
}

// ── Section 1: The Big Picture ────────────────────────────────────────
function Section1BigPicture() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Biology 1 is the gateway life-science course in the South Carolina sequence, and the
        End-of-Course Examination Program (EOCEP) at the end of it is where the state checks
        whether you can do four things consistently: explain how living things are built and
        run at the cellular level, trace the flow of energy and matter through biological
        systems, predict how traits and populations change across generations, and reason
        like a scientist about evidence. Every section of this guide maps to one slice of
        that work. None of the ideas are magical — they are a small set of recurring
        principles, applied carefully, across every level of life from molecules to
        biomes.
      </Typography>

      <Analogy title="Biology as a nested set of working machines">
        Picture a giant clock tower. Step way back and you see a single object that tells
        time. Step closer and you see the face, the hands, the chimes. Open the door and
        you see gears turning gears. Open one of those gears and you find tinier gears
        still — springs, pivots, escapements. Biology is the same. A forest is made of
        organisms. Each organism is made of organs. Each organ is made of tissues. Each
        tissue is made of cells. Each cell is made of molecules. Every layer is a working
        machine inside a bigger working machine, and the EOCEP will ask you to zoom in and
        out across those layers all day.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        How to use this guide
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Each subdomain section has the same shape: a short intro that connects the topic to
        something you already understand, key terms and worked examples, callouts that flag
        traps and connections, and a "quick check" at the bottom — three or four questions
        pulled from the practice bank so you can verify the ideas landed. The quick check
        is formative; it does not move your Diagnostic readiness number. Take it freely,
        and re-take it after re-reading if you missed something.
      </Typography>

      <Callout kind="why-it-matters">
        The Biology 1 EOCEP counts <strong>20% of your final course grade</strong> in South
        Carolina. That is not decorative — a student with a 90 class average and a 50
        EOCEP ends up with about an 82 final grade. Treating this exam as low-stakes is the
        most expensive mistake you can make. The good news: it is a well-defined test on a
        finite list of skills, and steady study from now to test day is enough to do well.
      </Callout>

      <Callout kind="coachs-note">
        Do not try to memorize every term in every textbook. The EOCEP rewards understanding
        a relatively small set of recurring big ideas: structure determines function, energy
        and matter flow, information is stored and passed on, populations change over time,
        living systems regulate themselves. If you can apply those big ideas to unfamiliar
        examples, you will out-perform a student who memorized vocabulary in isolation.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The eight topics at a glance
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Biology 1] --> B[Cells and Cell Processes - structure, transport, mitosis]
    A --> C[Biochemistry and Energy - macromolecules, enzymes, photosynthesis, respiration]
    A --> D[Genetics and Heredity - DNA, Mendel, Punnett, mutations]
    A --> E[Evolution and Natural Selection - Darwin, evidence, speciation]
    A --> F[Ecology and Ecosystems - food webs, cycles, populations, biomes]
    A --> G[Classification and Biodiversity - taxonomy, domains, dichotomous keys]
    A --> H[Homeostasis and Body Systems - feedback, organ systems]
    A --> I[Scientific Inquiry and Lab Skills - method, variables, microscopes]
        `}
      />

      <Callout kind="in-plain-words">
        Most of Biology 1 boils down to four jobs: <strong>name the parts</strong> (organelle,
        nucleotide, allele, trophic level), <strong>explain what each part does</strong>
        (mitochondria make ATP; tRNA carries amino acids), <strong>trace the process</strong>
        (light → sugar via photosynthesis; sugar → ATP via respiration), and
        <strong> reason with evidence</strong> (does this data support the hypothesis?).
        Get good at all four and the EOCEP becomes much smaller than it looks.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The recurring "big ideas" of biology
      </Typography>
      <GuideTable
        headers={['Big idea', 'What it really means', 'Where it shows up']}
        rows={[
          ['Structure determines function', 'The shape of a biological part tells you what it does — and a change in shape changes the job', 'Enzyme active sites; root hairs; alveoli; the double helix'],
          ['Energy flows; matter cycles', 'Energy enters as sunlight and leaves as heat. Atoms (C, N, O, H) get reused over and over', 'Photosynthesis vs. respiration; food chains; carbon and nitrogen cycles'],
          ['Information is stored, copied, expressed', 'DNA stores instructions; mitosis copies them; transcription and translation use them', 'Replication; the central dogma; mutations; heredity'],
          ['Populations change over generations', 'No individual evolves — populations do, through differential reproduction', 'Natural selection; antibiotic resistance; speciation'],
          ['Living systems regulate themselves', 'Feedback loops keep internal conditions stable enough for life to continue', 'Body temperature; blood glucose; ecosystem balance'],
        ]}
      />

      <Callout kind="try-this">
        Pick any biological system you saw this week — a tomato plant, your own breakfast
        being digested, a backyard bird at a feeder. Try to label which of the five big
        ideas above are at work in that example. Almost every real-world biology question
        you ever face will be an application of one or more of these recurring ideas.
      </Callout>

      <Callout kind="connect">
        The big ideas above are not just for the EOCEP. They show up in every later science
        class — chemistry (energy and matter), AP Biology (information and evolution),
        environmental science (cycles and regulation), and even in real-world choices about
        medicine, food, and public health. Biology 1 is foundation work for everything that
        follows.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three habits that pay off for the whole year
      </Typography>
      <GuideTable
        headers={['Habit', 'Why it matters', 'How to build it']}
        rows={[
          ['Always draw what you are reading', 'Biology lives in diagrams — cells, cycles, pyramids. Words alone leave gaps', 'Re-draw every key figure in your notebook from memory after you read it'],
          ['Translate jargon back into plain English', 'Vocabulary is a barrier; meaning is the goal', 'After every paragraph, write one sentence in your own words explaining what it said'],
          ['Connect every new idea to one you already know', 'Memory holds isolated facts poorly but holds connected concepts well', 'Ask, "What does this remind me of?" or "Where else in biology have I seen this pattern?"'],
        ]}
      />

      <Callout kind="make-it-stick">
        The EOCEP loves to give you a brand-new example (a cell type you have never seen, a
        food web you do not recognize) and ask you to apply a familiar idea. Treat every
        textbook example as a SAMPLE of a deeper pattern, not as the thing to memorize.
        Patterns transfer; isolated facts do not.
      </Callout>

      <Callout kind="watch-for">
        A very common EOCEP trap is to test whether you confuse two similar-sounding
        processes — mitosis vs. meiosis, photosynthesis vs. respiration, diffusion vs.
        active transport. Whenever you learn one of those, IMMEDIATELY learn the contrast
        with its partner. Studying them in pairs prevents the most expensive errors on
        test day.
      </Callout>
    </Box>
  );
}

// ── Section 2: Cells & Cell Processes ─────────────────────────────────
function Section2Cells() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Every living thing is made of cells. That sounds simple, but it is one of the most
        powerful ideas in all of science. A bacterium is one cell. You are about thirty
        trillion of them. A redwood tree is many trillions more. The cell theory — first
        articulated by Schleiden, Schwann, and Virchow in the 1800s — says three things:
        all living things are made of cells, the cell is the basic unit of structure and
        function in life, and all cells come from pre-existing cells. The EOCEP will ask
        you about cell parts, how those parts work together, how things move in and out
        of cells, and how cells divide.
      </Typography>

      <Analogy title="A cell as a factory">
        Imagine a small factory dedicated to making one product. The factory has a manager's
        office that holds the master blueprints (the nucleus with its DNA). It has assembly
        lines that read copies of the blueprints and build products (ribosomes building
        proteins). It has shipping departments that wrap finished products and send them out
        (the Golgi apparatus). It has power plants that burn fuel and generate electricity
        for the whole operation (mitochondria turning food into ATP). It has recycling bins
        that break down worn-out equipment (lysosomes). It has a security fence with gates
        that decide who comes in and who goes out (the cell membrane). Every organelle has
        a job, and the whole factory only works because they cooperate.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Prokaryotic vs. eukaryotic cells — the two great categories
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Every cell ever discovered falls into one of two categories. <strong>Prokaryotic</strong>
        cells (bacteria and archaea) are small, simple, and have no membrane-bound nucleus —
        their DNA floats freely in a region called the nucleoid. <strong>Eukaryotic</strong>
        cells (plants, animals, fungi, protists) are larger, more complex, and have a true
        nucleus plus dozens of other membrane-bound organelles. The distinction is one of
        the most important in all of biology.
      </Typography>
      <GuideTable
        headers={['Feature', 'Prokaryote', 'Eukaryote']}
        rows={[
          ['Size', 'Tiny — typically 1–10 micrometers', 'Larger — typically 10–100 micrometers'],
          ['Nucleus', 'No membrane-bound nucleus; DNA in nucleoid region', 'True membrane-bound nucleus'],
          ['Membrane-bound organelles', 'None', 'Many (mitochondria, ER, Golgi, lysosomes, etc.)'],
          ['DNA shape', 'Usually a single circular chromosome plus plasmids', 'Multiple linear chromosomes inside the nucleus'],
          ['Ribosomes', 'Yes — smaller (70S)', 'Yes — larger (80S)'],
          ['Cell wall', 'Yes — made of peptidoglycan (in bacteria)', 'Plants and fungi have one (cellulose / chitin); animal cells do not'],
          ['Examples', 'E. coli, Streptococcus, methanogens', 'Onion cells, your skin cells, paramecium, yeast'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>"Pro" means before, "eu" means true.</strong> Prokaryotes came first in
        evolutionary history and existed BEFORE the true nucleus. Eukaryotes have a TRUE
        membrane-bound nucleus. If a question asks "which cell has a membrane-bound nucleus
        and other organelles?" the answer is always eukaryote.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The organelles — a working tour
      </Typography>
      <GuideTable
        headers={['Organelle', 'Function', 'Memorable hook']}
        rows={[
          ['Nucleus', 'Stores DNA; directs all cell activity by controlling which genes are expressed', 'The "command center" or "library"'],
          ['Nucleolus', 'A dense region inside the nucleus that makes ribosomes', 'The factory that builds the readers'],
          ['Ribosome', 'Builds proteins by reading mRNA and assembling amino acids', 'The "3D printer" of the cell — assembles a chain of building blocks'],
          ['Rough endoplasmic reticulum (RER)', 'Studded with ribosomes; makes and folds proteins destined for export', 'A protein assembly line'],
          ['Smooth endoplasmic reticulum (SER)', 'No ribosomes; makes lipids and detoxifies drugs and alcohol', 'The chemistry lab'],
          ['Golgi apparatus', 'Modifies, sorts, and ships proteins from the ER to other destinations', 'The "post office" — labels and sends'],
          ['Mitochondrion', 'Site of aerobic cellular respiration; produces ATP from glucose and oxygen', 'The "powerhouse" — the battery factory'],
          ['Chloroplast (plants only)', 'Site of photosynthesis; uses sunlight to make glucose from CO₂ and H₂O', 'The "solar panel" — captures light'],
          ['Lysosome', 'Sacs of digestive enzymes that break down waste, worn organelles, and invaders', 'The "garbage disposal" or "recycling center"'],
          ['Vacuole', 'Stores water, food, or waste. Plant cells have one large central vacuole; animal cells have small ones', 'The storage tank'],
          ['Cytoskeleton', 'Network of protein fibers (microtubules, microfilaments) that give shape and enable movement', 'The "skeleton and muscles" of the cell'],
          ['Cell membrane', 'Phospholipid bilayer with embedded proteins; controls what enters and leaves', 'The "security gate" — selectively permeable'],
          ['Cell wall (plants, fungi, bacteria)', 'A rigid outer layer that gives shape and protection — does not control transport', 'The "brick wall" outside the gate'],
        ]}
      />

      <Callout kind="why-it-matters">
        The EOCEP loves to test whether you can match the organelle to its job from an
        unusual angle — "which organelle would you expect to find in unusual abundance in a
        muscle cell?" (mitochondria, because muscles need lots of ATP). "Which would be
        abundant in a cell that secretes a lot of enzymes?" (rough ER and Golgi, because
        the cell is exporting proteins). Always link the organelle's job to the cell's
        purpose.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Plant cells vs. animal cells — the differences that matter
      </Typography>
      <GuideTable
        headers={['Feature', 'Plant cell', 'Animal cell']}
        rows={[
          ['Cell wall', 'YES — made of cellulose, outside the membrane', 'NO'],
          ['Chloroplasts', 'YES — site of photosynthesis', 'NO'],
          ['Large central vacuole', 'YES — usually huge, holds water and maintains turgor', 'No (small vacuoles only)'],
          ['Lysosomes', 'Rare', 'Common'],
          ['Centrioles', 'No (plants use other structures during division)', 'YES — used in animal cell division'],
          ['Overall shape', 'Rectangular / boxy due to rigid wall', 'Round / variable shape'],
        ]}
      />

      <Callout kind="watch-for">
        A trap: students sometimes say "plant cells don't have mitochondria because they have
        chloroplasts." Wrong. Plant cells have BOTH. They photosynthesize sugar in
        chloroplasts during the day, then burn that sugar in mitochondria for ATP around the
        clock. Chloroplasts are extra; mitochondria are still required.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The cell membrane — the gatekeeper
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Every cell is wrapped in a <strong>phospholipid bilayer</strong>. Each phospholipid
        has a polar (water-loving) phosphate "head" and two nonpolar (water-fearing) fatty-acid
        "tails." In water, they spontaneously line up with heads pointing outward toward water
        and tails pointing inward, forming a two-layer sandwich. Embedded in that sandwich are
        proteins that act as channels, pumps, receptors, and identity tags. The membrane is
        often called the <strong>fluid mosaic model</strong> — fluid because the molecules
        drift around like icebergs, mosaic because of all the different embedded proteins.
      </Typography>

      <Analogy title="The membrane as a soap bubble with stuff stuck in it">
        Imagine a soap bubble — a double layer of soap molecules with their water-loving
        sides facing in and out. Now imagine sticking little gates, doors, and turnstiles
        into the bubble. That is essentially a cell membrane. The bubble itself blocks
        most molecules, but the embedded proteins create selective passages — only certain
        molecules get through, only in certain directions, and sometimes only when the cell
        spends energy to make it happen.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Transport across the membrane
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Does the molecule move WITH or AGAINST its concentration gradient?] --> B{With the gradient - from high to low?}
    B -->|Yes| C[PASSIVE TRANSPORT - no energy needed]
    C --> C1[Simple diffusion - small nonpolar molecules slip through bilayer]
    C --> C2[Osmosis - water across selectively permeable membrane]
    C --> C3[Facilitated diffusion - via channel or carrier protein]
    B -->|No - against the gradient| D[ACTIVE TRANSPORT - requires ATP]
    D --> D1[Pumps - like the sodium-potassium pump]
    D --> D2[Endocytosis - cell engulfs material in a vesicle]
    D --> D3[Exocytosis - vesicle fuses and releases material]
        `}
      />

      <GuideTable
        headers={['Process', 'Direction', 'Energy required?', 'Example']}
        rows={[
          ['Simple diffusion', 'High → low (with gradient)', 'No', 'Oxygen entering, CO₂ leaving a cell'],
          ['Osmosis', 'Water moves from high water (low solute) to low water (high solute)', 'No', 'Root hair cells absorbing water from soil'],
          ['Facilitated diffusion', 'High → low through a protein channel', 'No', 'Glucose entering via GLUT transporters'],
          ['Active transport', 'Low → high (against gradient)', 'YES (ATP)', 'Sodium-potassium pump in neurons'],
          ['Endocytosis', 'Bulk material brought INTO the cell', 'YES', 'White blood cell engulfing a bacterium'],
          ['Exocytosis', 'Bulk material released OUT of the cell', 'YES', 'Neuron releasing neurotransmitters into a synapse'],
        ]}
      />

      <Callout kind="in-plain-words">
        <strong>Passive transport is downhill — no energy.</strong> Just like a ball rolling
        down a hill, particles naturally spread from where they are crowded to where they
        are not. <strong>Active transport is uphill — requires ATP.</strong> Pumping
        particles AGAINST their gradient is like rolling a ball UP a hill, which costs
        energy. If the question mentions ATP being used, it is active. If it mentions a
        protein channel but no ATP, it is facilitated diffusion.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Osmosis and tonicity — what happens when a cell sits in solution
      </Typography>
      <GuideTable
        headers={['Solution outside cell', 'Solute concentration', 'Water movement', 'Animal cell result', 'Plant cell result']}
        rows={[
          ['Hypotonic', 'LESS solute than inside the cell', 'Water moves INTO the cell', 'Cell swells; may burst (lyse)', 'Cell becomes turgid (firm) — ideal for plants'],
          ['Isotonic', 'EQUAL solute concentration', 'Water in = water out (no net change)', 'Cell normal', 'Cell flaccid (limp) — bad for plants'],
          ['Hypertonic', 'MORE solute than inside the cell', 'Water moves OUT of the cell', 'Cell shrivels (crenates)', 'Cell plasmolysis — membrane pulls from wall (wilting)'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Water follows solute.</strong> If salt (or sugar, or any solute) is higher
        on one side of a membrane, water will rush toward that side trying to dilute it.
        "Hyper" = more (solute outside, so water leaves the cell). "Hypo" = less (solute
        outside, so water enters the cell). "Iso" = same (no net movement). This single
        rule explains why salt kills slugs, why your fingers wrinkle in the bath, and why
        wilted plants perk up after watering.
      </Callout>

      <Callout kind="connect">
        Osmosis explains real biology you see every day. Why does soaking celery in water
        make it crisp? Hypotonic environment — water enters the cells, building turgor
        pressure. Why does putting salt on a snail kill it? Hypertonic environment — water
        leaves the snail's cells, causing dehydration. Same principle, two very different
        outcomes.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The cell cycle and mitosis — how cells multiply
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Cells reproduce by dividing. In eukaryotes, most cells go through a regular cycle
        of growth and division called the <strong>cell cycle</strong>. The cycle has two
        main parts: <strong>interphase</strong> (the long phase where the cell grows and
        copies its DNA) and the <strong>mitotic (M) phase</strong> (the relatively short
        phase where the cell actually splits). Mitosis produces two identical daughter
        cells, each with the same number of chromosomes as the parent. Mitosis is how you
        grow from a single fertilized egg to a multicellular adult, and how you replace
        cells that wear out.
      </Typography>

      <MermaidDiagram
        chart={`
flowchart LR
    A[G1 - cell grows, makes proteins] --> B[S - DNA replicated]
    B --> C[G2 - more growth, prepares to divide]
    C --> D[M phase - mitosis and cytokinesis]
    D --> A
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The stages of mitosis — PMAT
      </Typography>
      <GuideTable
        headers={['Stage', 'What happens', 'Quick visual']}
        rows={[
          ['Prophase', 'Chromosomes condense into visible X-shapes; nuclear envelope breaks down; spindle fibers form', '"Packing the bags" — DNA becomes visible'],
          ['Metaphase', 'Chromosomes line up at the center (the metaphase plate) of the cell', '"M for middle" — chromosomes at the equator'],
          ['Anaphase', 'Sister chromatids are pulled apart toward opposite poles', '"A for apart" — pull to the poles'],
          ['Telophase', 'Two new nuclei form at each pole; chromosomes uncoil', '"T for two nuclei" — almost done'],
          ['Cytokinesis', 'The cytoplasm splits into two separate daughter cells', 'In animals: a cleavage furrow pinches in. In plants: a cell plate forms in the middle'],
        ]}
      />

      <Callout kind="make-it-stick">
        Remember PMAT — <strong>P</strong>rophase, <strong>M</strong>etaphase,
        <strong> A</strong>naphase, <strong>T</strong>elophase. Or use the mnemonic "Please
        Make Awesome Tacos." Then attach a one-word memory aid: P = pack, M = middle,
        A = apart, T = two. Almost every EOCEP mitosis question hinges on correctly ordering
        the four stages.
      </Callout>

      <Callout kind="watch-for">
        Mitosis is sometimes confused with meiosis. Mitosis produces TWO IDENTICAL diploid
        daughter cells — used for growth, repair, and asexual reproduction. Meiosis (a
        different process) produces FOUR GENETICALLY DIFFERENT haploid gametes (sperm or
        egg cells) — used for sexual reproduction. If the question is about replacing skin
        cells or healing a cut, it is mitosis. If it is about making sperm or eggs, it is
        meiosis.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        When the cell cycle goes wrong — cancer
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The cell cycle is tightly controlled by checkpoints — molecular "stop lights" that
        verify each step before allowing the next. When the control system breaks — usually
        because mutations damage the genes that build those checkpoints — cells can divide
        uncontrollably, ignoring the body's signals to stop. That uncontrolled growth is
        what we call <strong>cancer</strong>. Cancer is, at its core, a disease of broken
        cell-cycle regulation. Many chemotherapy drugs target rapidly dividing cells for
        exactly this reason — though they unfortunately also damage healthy fast-dividing
        cells like hair follicles and the lining of the gut.
      </Typography>

      <Callout kind="why-it-matters">
        Understanding the cell cycle is not just academic — it directly explains how cancer
        starts, why some treatments work, and why prevention (limiting carcinogen exposure)
        matters. The EOCEP will sometimes use cancer as a real-world hook to test whether
        you understand checkpoint regulation in a normal cell cycle.
      </Callout>

      <Callout kind="try-this">
        Sketch a circle and divide it into the four phases of the cell cycle — G1, S, G2,
        M. In G1 write "grow." In S write "DNA copied." In G2 write "grow more." In M
        write "PMAT + cytokinesis." Re-draw it from memory three times this week and the
        cycle will lock in for the EOCEP.
      </Callout>

      <Callout kind="coachs-note">
        Cells specialize in different ways, but they all share the same basic machinery —
        membrane, ribosomes, DNA, energy production. When you study an unfamiliar cell on
        the EOCEP (a neuron, a root hair, a phloem cell), start by identifying which
        organelles look unusual in number or shape, then ask what that says about the
        cell's job. Structure ALWAYS tells you function.
      </Callout>
    </Box>
  );
}

// ── Section 4: Genetics & Heredity ────────────────────────────────────
function Section4Genetics() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Genetics is the study of heredity — how traits are passed from parents to
        offspring, and how the molecular instructions that code for those traits are
        stored, copied, expressed, and (occasionally) altered. The EOCEP will ask you to
        work with DNA structure, the central dogma of molecular biology, basic Punnett
        squares, several inheritance patterns, and the consequences of mutations.
      </Typography>

      <Analogy title="DNA as a cookbook that never leaves the kitchen library">
        Imagine a master cookbook stored in a locked library (the nucleus). The cookbook
        is huge — it has the instructions to build everything the restaurant has ever
        cooked. The chefs (ribosomes) are not allowed in the library; the original must
        not leave. So the librarian (RNA polymerase) makes a quick copy of just the one
        recipe needed (a single mRNA strand) and hands the copy out to the kitchen. The
        chef reads the copy, makes the dish, and throws the copy away. The master cookbook
        stays safe and intact. That is exactly how DNA, RNA, and the ribosome work
        together.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        DNA structure — the double helix
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        DNA stands for <strong>deoxyribonucleic acid</strong>. Its structure was famously
        worked out by Watson and Crick (using critical data from Rosalind Franklin and
        Maurice Wilkins) in 1953. DNA is a <strong>double helix</strong> — two long
        strands twisted around each other like a spiral staircase. The "railings" of the
        staircase are alternating sugar (deoxyribose) and phosphate groups. The "steps"
        are pairs of <strong>nitrogenous bases</strong> sticking out from each strand and
        meeting in the middle.
      </Typography>

      <GuideTable
        headers={['DNA component', 'What it is', 'Role']}
        rows={[
          ['Sugar (deoxyribose)', 'Five-carbon sugar', 'Part of the sugar-phosphate backbone'],
          ['Phosphate group', 'A phosphorus atom with oxygens', 'Part of the backbone; gives DNA its negative charge'],
          ['Nitrogenous base', 'One of four molecules: A, T, G, C', 'The "letters" that spell the genetic code'],
          ['Nucleotide', 'Sugar + phosphate + one base', 'The repeating monomer of DNA'],
          ['Double helix', 'Two strands wound around each other', 'The full DNA molecule shape'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Base pairing rules — A-T and G-C
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The two strands of DNA are held together by hydrogen bonds between bases on
        opposite strands. The bases pair in a very specific pattern: <strong>adenine (A)
        always pairs with thymine (T)</strong>, and <strong>guanine (G) always pairs with
        cytosine (C)</strong>. This is sometimes called complementary base pairing. If
        one strand reads "ATCG," the other strand must read "TAGC."
      </Typography>

      <Callout kind="make-it-stick">
        <strong>A pairs with T. G pairs with C.</strong> Memorize this — it is the single
        most-tested fact in genetics. One mnemonic: "Apple Tree, Green Car." A is a purine
        with a double-ring structure; T is a pyrimidine with a single-ring structure;
        their shapes fit only each other. Same for G and C. This pairing is what makes
        accurate copying possible.
      </Callout>

      <Callout kind="watch-for">
        In RNA, thymine (T) is replaced by uracil (U). So during transcription, where the
        DNA strand has an A, the RNA copy will have a U. Mixing up "T in DNA, U in RNA"
        is a common EOCEP slip. DNA uses A-T-G-C; RNA uses A-U-G-C.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        DNA replication — making an exact copy
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Before a cell divides (mitosis or meiosis), it must duplicate its DNA so each
        daughter cell gets a complete copy. The process is called <strong>DNA
        replication</strong>. The enzyme <strong>helicase</strong> unwinds the double helix.
        Each separated strand serves as a template — <strong>DNA polymerase</strong>
        reads the template and pairs in complementary bases to build a new partner
        strand. The result is two identical double helices, each containing one old
        strand and one new strand. That pattern is called <strong>semiconservative
        replication</strong>.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The central dogma — DNA to RNA to protein
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The flow of genetic information has a name: the <strong>central dogma of
        molecular biology</strong>. It says:
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7, fontStyle: 'italic', fontSize: '1.05rem', fontWeight: 600 }}>
        DNA → (transcription) → RNA → (translation) → Protein
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        DNA in the nucleus is transcribed into messenger RNA (mRNA). The mRNA travels
        out to a ribosome, where it is translated into a sequence of amino acids — a
        protein. The protein then folds up and does its job. Every trait you have —
        eye color, blood type, the shape of your earlobes — traces back ultimately to
        proteins, which trace back to DNA sequences.
      </Typography>

      <MermaidDiagram
        chart={`
flowchart LR
    A[DNA in nucleus] -->|Transcription by RNA polymerase| B[mRNA copy of one gene]
    B -->|mRNA exits nucleus to ribosome| C[Ribosome reads mRNA in codons]
    C -->|Translation - tRNA brings matching amino acids| D[Polypeptide chain]
    D -->|Folds up| E[Functional protein]
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Transcription — DNA copied into RNA
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Transcription</strong> happens in the nucleus. RNA polymerase binds to a
        gene, unwinds the DNA, and reads one strand. As it reads, it strings together
        complementary RNA nucleotides — substituting uracil (U) for thymine (T). The
        result is a single-stranded mRNA copy of that gene, which then exits the nucleus.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Translation — RNA read into protein
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        At the <strong>ribosome</strong>, the mRNA is read three bases at a time. Each
        three-base group is a <strong>codon</strong>, and each codon codes for one amino
        acid. Transfer RNA (tRNA) molecules carry the correct amino acid to the ribosome
        and match their anticodon to the mRNA codon. The amino acids are chained together
        into a growing polypeptide. When a "stop" codon is reached, the chain releases
        and folds into a finished protein.
      </Typography>

      <GuideTable
        headers={['Term', 'Definition']}
        rows={[
          ['Gene', 'A segment of DNA that codes for one protein (or sometimes one functional RNA)'],
          ['Codon', 'A set of three mRNA bases that codes for one amino acid'],
          ['Anticodon', 'A set of three bases on tRNA that base-pairs with a codon'],
          ['Start codon', 'AUG — codes for methionine and signals the beginning of translation'],
          ['Stop codon', 'UAA, UAG, or UGA — signals translation to end. No amino acid added'],
        ]}
      />

      <Callout kind="why-it-matters">
        The genetic code is essentially universal — the same codons code for the same
        amino acids in bacteria, plants, fungi, and animals. This is powerful evidence
        that all life on Earth shares a common ancestor. It also makes genetic engineering
        possible: scientists can insert a human gene into a bacterium, and the bacterium
        will produce the human protein. That is how we now mass-produce insulin for
        diabetics.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Mutations — when the code changes
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>mutation</strong> is any change in the DNA sequence. Mutations are the
        ultimate source of all genetic variation. Most are harmless. Some are harmful
        (causing diseases like sickle-cell anemia or cystic fibrosis). Very rarely, a
        mutation is beneficial — and those are the raw material on which natural
        selection acts.
      </Typography>
      <GuideTable
        headers={['Type', 'What changes', 'Effect']}
        rows={[
          ['Point (substitution)', 'One base is replaced by another', 'Depending on the change, may not affect the protein (silent), may change one amino acid (missense), or may create a stop codon (nonsense)'],
          ['Insertion', 'One or more bases are added', 'Shifts the reading frame of every codon after the insertion — often disastrous (frameshift)'],
          ['Deletion', 'One or more bases are removed', 'Also shifts the reading frame — frameshift mutation'],
          ['Chromosomal', 'Large-scale rearrangements: duplication, deletion, inversion, translocation of entire chromosome segments', 'Often causes major effects on multiple genes — e.g., Down syndrome from chromosome 21 trisomy'],
        ]}
      />

      <Callout kind="watch-for">
        Not every DNA change leads to a different protein. Because the genetic code is
        "redundant" — multiple codons can code for the same amino acid — a substitution
        like CCU → CCC still codes for proline. That is a SILENT mutation. So the EOCEP
        sometimes shows you a base change and asks whether the protein changed — you need
        to know that silent mutations exist.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Mendel's laws of inheritance
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Gregor Mendel, an Augustinian monk working in the 1860s, was the first to figure
        out the basic rules of inheritance by breeding thousands of pea plants. He did
        not know what DNA was, but he discovered the patterns it produces. His two main
        laws are:
      </Typography>
      <GuideTable
        headers={['Law', 'What it says', 'In modern terms']}
        rows={[
          ['Law of segregation', 'Each parent passes only ONE of its two alleles for each trait to each offspring', 'During meiosis, paired chromosomes separate — each gamete gets one of the two'],
          ['Law of independent assortment', 'Different traits are inherited independently of each other', 'Genes on different chromosomes sort independently during meiosis'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Key genetics vocabulary
      </Typography>
      <GuideTable
        headers={['Term', 'Definition', 'Example']}
        rows={[
          ['Gene', 'A heritable unit that codes for a trait', 'The flower-color gene in pea plants'],
          ['Allele', 'A version of a gene', 'Purple-flower allele vs. white-flower allele'],
          ['Dominant', 'An allele that masks the recessive when both are present', 'Purple (P) is dominant over white (p)'],
          ['Recessive', 'An allele that is masked when paired with a dominant', 'White (p) only shows when paired with another p'],
          ['Homozygous', 'Two identical alleles for a trait', 'PP or pp'],
          ['Heterozygous', 'Two different alleles for a trait', 'Pp'],
          ['Genotype', 'The genetic makeup (the alleles)', 'PP, Pp, or pp'],
          ['Phenotype', 'The observable trait', 'Purple flowers or white flowers'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Genotype = what you HAVE. Phenotype = what you SHOW.</strong> Two plants
        can both have purple flowers (same phenotype) but one is PP and the other is Pp
        (different genotypes). Their offspring will reveal the difference.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — a monohybrid cross with a Punnett square
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Suppose we cross two heterozygous purple-flowered plants: <strong>Pp × Pp</strong>.
        Each parent can pass either P or p. We build a 2×2 grid:
      </Typography>
      <GuideTable
        headers={['', 'P (from parent 2)', 'p (from parent 2)']}
        rows={[
          ['P (from parent 1)', 'PP — homozygous dominant (purple)', 'Pp — heterozygous (purple)'],
          ['p (from parent 1)', 'Pp — heterozygous (purple)', 'pp — homozygous recessive (white)'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Reading the grid: 1 PP : 2 Pp : 1 pp. That is a <strong>3:1 phenotype ratio</strong>
        — three purple to one white. This is the classic Mendelian heterozygous cross
        ratio, and it shows up on the EOCEP constantly.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Dihybrid crosses and the 9:3:3:1 ratio
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        When two genes (on different chromosomes) are followed at once, things get more
        interesting. The classic <strong>dihybrid cross</strong> is two double-heterozygous
        parents — for example, PpYy × PpYy, where P = purple, p = white, Y = yellow seed,
        y = green seed. Working out the 4×4 Punnett square gives a phenotype ratio of
        <strong> 9 : 3 : 3 : 1</strong> — 9 dominant-for-both, 3 dominant-for-trait-1-only,
        3 dominant-for-trait-2-only, and 1 recessive-for-both.
      </Typography>

      <Callout kind="why-it-matters">
        The 9:3:3:1 ratio is the calling card of Mendelian independent assortment. If
        you see it (or close to it) in real data, the two traits are being inherited
        independently. Deviations from 9:3:3:1 often signal that the genes are LINKED
        (on the same chromosome) — a concept beyond Mendel that the EOCEP will introduce
        briefly.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Beyond simple dominance — other inheritance patterns
      </Typography>
      <GuideTable
        headers={['Pattern', 'What happens', 'Example']}
        rows={[
          ['Complete dominance', 'Dominant allele fully masks recessive in heterozygotes', 'Pea-plant flower color: Pp is fully purple'],
          ['Incomplete dominance', 'Heterozygotes show a BLEND of the two phenotypes', 'Red × white snapdragons → pink heterozygotes'],
          ['Codominance', 'Heterozygotes show BOTH phenotypes simultaneously (not blended)', 'Type AB blood: both A and B antigens are present together'],
          ['Multiple alleles', 'A gene has more than two possible alleles in the population', 'Human ABO blood type — alleles I^A, I^B, and i'],
          ['Polygenic inheritance', 'A single trait is influenced by multiple genes', 'Skin color, height — produce a continuous range of phenotypes'],
          ['Sex-linked', 'Gene is on the X (rarely Y) chromosome — affects males and females differently', 'Color blindness, hemophilia (X-linked recessive)'],
        ]}
      />

      <Callout kind="watch-for">
        <strong>Incomplete dominance ≠ codominance.</strong> Both involve heterozygotes
        that look different from either homozygote, but the patterns differ.
        Incomplete = BLEND (red + white = pink). Codominance = BOTH expressed together
        (type AB blood has both A and B antigens). The EOCEP loves to ask you to
        distinguish these two.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Sex-linked traits — why color blindness is more common in males
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        In humans, biological sex is determined by sex chromosomes: females are typically
        XX, males are typically XY. The X chromosome carries many genes that the Y does
        not. So if a male inherits a recessive allele on his X chromosome, he has NO
        backup copy — that recessive trait will be expressed. Females, with two X
        chromosomes, have a backup. This is why <strong>X-linked recessive</strong>
        conditions like red-green color blindness, hemophilia, and Duchenne muscular
        dystrophy are far more common in males than in females.
      </Typography>

      <Callout kind="in-plain-words">
        Think of it as: males play their X chromosome on hard mode. They only have one
        copy, so any defective gene on it will show up. Females effectively have a backup
        save file — if one X has a problem, the other often makes up for it. That is why
        sex-linked recessive traits "skip" generations and tend to appear in grandsons,
        not granddaughters, of the original carrier.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Pedigrees — reading family trees
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>pedigree</strong> is a diagram showing the inheritance of a trait
        across generations of a family. Squares represent males, circles represent
        females. Filled-in shapes have the trait; empty shapes do not. Horizontal lines
        between two shapes mean a couple; vertical lines drop down to their offspring.
        From a pedigree you can deduce whether a trait is dominant or recessive, and
        whether it might be sex-linked.
      </Typography>

      <Callout kind="try-this">
        Draw a quick pedigree for your own family showing one easily observable trait
        (attached vs. detached earlobes, ability to roll your tongue, freckled vs. not).
        Use squares for males, circles for females, filled-in for "has the trait." Three
        generations is enough to see Mendelian patterns at work in your own genes.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Meiosis — making gametes
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Meiosis</strong> is the special form of cell division that produces
        gametes (sperm and egg cells). Unlike mitosis, which makes two identical diploid
        copies, meiosis makes <strong>four genetically different haploid cells</strong>.
        "Haploid" means having one of each chromosome (n=23 in humans); "diploid" means
        having pairs (2n=46). When egg and sperm fuse, the resulting zygote is diploid
        again. Meiosis is also where genetic shuffling happens — through crossing over
        and independent assortment — which is why siblings (other than identical twins)
        look different from each other.
      </Typography>

      <GuideTable
        headers={['Process', 'Number of cells produced', 'Genetic outcome', 'Purpose']}
        rows={[
          ['Mitosis', '2 daughter cells', 'Identical to parent (diploid)', 'Growth, repair, asexual reproduction'],
          ['Meiosis', '4 daughter cells', 'Genetically different (haploid)', 'Production of gametes for sexual reproduction'],
        ]}
      />

      <Callout kind="connect">
        Meiosis is the engine of genetic variation. Crossing over (chromosome segments
        swapping during meiosis I), independent assortment (chromosomes lining up
        randomly), and the random fertilization of one egg by one of millions of sperm
        all combine to ensure that every offspring (other than identical twins) is
        genetically unique. That variation is exactly what natural selection acts on in
        the next section.
      </Callout>

      <Callout kind="coachs-note">
        Genetics on the EOCEP almost always comes down to careful work with Punnett
        squares. Practice ten or twenty crosses by hand — monohybrid, dihybrid, sex-linked
        — until you can set them up automatically. Once the mechanics are second nature,
        the only remaining challenge is reading the question carefully.
      </Callout>
    </Box>
  );
}

// ── Section 5: Evolution & Natural Selection ──────────────────────────
function Section5Evolution() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Evolution is the unifying theory of biology. It is the explanation for why
        organisms are so well-suited to their environments, why we share so many genes
        with other species, why diseases can outsmart antibiotics, and why all life on
        Earth shares the same basic genetic code. Charles Darwin (and, independently,
        Alfred Russel Wallace) figured out the central mechanism in the mid-1800s:
        natural selection. Modern biology has confirmed and extended their work through
        DNA evidence, fossil discoveries, and direct observation of evolution in action.
      </Typography>

      <Analogy title="Natural selection as a relentless job interviewer">
        Imagine an environment as an extremely picky job interviewer, hiring for the
        position of "alive and reproducing in this habitat." Every generation, the
        interviewer rejects applicants who cannot survive long enough, or attract a mate,
        or produce viable offspring. The applicants who pass the interview hand their
        traits (via DNA) to the next generation, who face the same interview. Over many
        generations, the population becomes filled with applicants whose traits match
        what the interviewer wants. Nobody designed this — the interviewer just kept
        firing the wrong fits, generation after generation, until only good fits were
        left.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Darwin's observations and Wallace's contribution
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Darwin spent five years on the HMS Beagle (1831–1836), with a famous stop in the
        Galápagos Islands. He noticed that finches on different islands had different
        beak shapes — long pointed beaks on islands with deep flowers, short heavy beaks
        on islands with tough seeds. The finches looked similar enough to be related,
        but each was adapted to its specific island's food source. That puzzle, plus
        years of additional observation and reading, led him to the theory of evolution
        by natural selection. Alfred Russel Wallace, working independently in Southeast
        Asia, came to the same conclusion at almost the same time. Their joint paper
        was presented in 1858, and Darwin published <em>On the Origin of Species</em> in
        1859.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The four conditions for natural selection
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Natural selection happens automatically whenever four conditions are met. Memorize
        all four — the EOCEP will sometimes give you a scenario and ask which condition
        is missing.
      </Typography>
      <GuideTable
        headers={['Condition', 'What it means', 'Example']}
        rows={[
          ['1. Variation', 'Individuals within a population differ from each other', 'Beetles in a population vary in shell color — some green, some brown'],
          ['2. Heritability', 'Traits can be passed from parent to offspring (via DNA)', 'A green beetle tends to produce green offspring; shell color is genetic'],
          ['3. Overproduction (struggle for existence)', 'Populations produce more offspring than the environment can support', 'A pair of beetles lays hundreds of eggs, but only a few will live to adulthood'],
          ['4. Differential reproductive success', 'Some variations survive and reproduce better than others', 'In a leafy environment, green beetles hide better from birds → more green beetles reach adulthood and reproduce'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>VHOS — Variation, Heritability, Overproduction, Selection.</strong> All
        four conditions are required. If a trait varies but cannot be inherited
        (sunburned skin, for example), natural selection cannot act on it. If a trait is
        heritable but does not vary, there is nothing to select. Remove any of the four
        and selection stops working.
      </Callout>

      <MermaidDiagram
        chart={`
flowchart TD
    A[VARIATION - individuals differ in heritable traits] --> B[OVERPRODUCTION - more offspring than resources support]
    B --> C[STRUGGLE for survival and reproduction]
    C --> D[DIFFERENTIAL REPRODUCTIVE SUCCESS - individuals with favorable traits survive and reproduce more]
    D --> E[NEXT GENERATION - favorable trait frequency increases]
    E --> A
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Fitness and adaptation — what they really mean in biology
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        In biology, <strong>fitness</strong> is NOT how strong or fast an organism is —
        it is how many viable offspring it produces. A male peacock with a giant
        impractical tail that attracts more females has HIGH fitness, even though that
        tail makes him slower. <strong>Adaptation</strong> is a heritable trait that
        improves an organism's fitness in a particular environment. A polar bear's white
        fur is an adaptation. The hollow bones of birds are an adaptation. Cactus spines
        are an adaptation.
      </Typography>

      <Callout kind="watch-for">
        Two common student misconceptions: (1) "Organisms evolve TO meet their needs."
        Wrong — organisms do not consciously adapt. Random variation already exists; the
        environment merely selects from it. (2) "An individual organism evolves."
        Wrong — INDIVIDUALS do not evolve; POPULATIONS do. A single beetle is born with
        whatever traits it has; only over many generations do populations shift.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The four lines of evidence for evolution
      </Typography>
      <GuideTable
        headers={['Evidence type', 'What it shows', 'Classic example']}
        rows={[
          ['Fossils', 'Past life forms preserved in rock layers; can show transitional forms', '<em>Tiktaalik</em> (a fish-like vertebrate with limb-like fins, showing the fish-to-tetrapod transition)'],
          ['Comparative anatomy', 'Similar structures across species reveal common ancestry', 'Homologous limbs: human arm, whale flipper, bat wing all share the same basic bone pattern'],
          ['Comparative embryology', 'Embryos of distantly related vertebrates look strikingly similar early in development', 'Fish, chickens, and humans all have gill arches and tail buds as embryos'],
          ['Molecular biology / DNA', 'More closely related species share more DNA and protein sequences', 'Humans share ~98% of DNA with chimpanzees, ~85% with mice, ~60% with bananas'],
          ['Biogeography', 'Patterns of where species live make sense in light of common ancestry and continental drift', 'Marsupials are concentrated in Australia, which broke off from other landmasses long ago'],
          ['Direct observation', 'Evolution observed in real time in fast-reproducing organisms', 'Antibiotic resistance in bacteria; pesticide resistance in insects; peppered moths in industrial England'],
        ]}
      />

      <Callout kind="why-it-matters">
        Evolution is not just a historical theory — it is testable and observable today.
        Antibiotic-resistant "superbugs" are evolution in action. So is the rapid
        diversification of viruses (which is why a new flu shot is developed every year).
        Understanding evolution is essential for medicine, agriculture, conservation,
        and public health.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Homologous, analogous, and vestigial structures
      </Typography>
      <GuideTable
        headers={['Type', 'Definition', 'Shows what?', 'Example']}
        rows={[
          ['Homologous', 'Similar STRUCTURE due to common ancestry — even if used differently now', 'Common ancestry', 'Forelimbs of human, whale, bat, and cat — same bones, different functions'],
          ['Analogous', 'Similar FUNCTION arising independently — NO common ancestor', 'Convergent evolution (similar environment, similar solution)', 'Wings of birds, bats, and insects — all fly but very different internal structure'],
          ['Vestigial', 'Structure that has lost most or all of its original function', 'A leftover from an ancestor that used it', 'Human appendix; whale hip bones; flightless-bird wings'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Homologous = same structure, different jobs (proves shared ancestor).
        Analogous = different structure, same job (proves similar environment).</strong>
        A whale flipper and a human arm are homologous. A bird wing and an insect wing
        are analogous. The EOCEP loves this distinction.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Types of natural selection — directional, stabilizing, disruptive
      </Typography>
      <GuideTable
        headers={['Type', 'What it does', 'Example']}
        rows=
        {[
          ['Directional', 'Shifts the population mean toward one extreme over time', 'Bacteria becoming antibiotic-resistant — average resistance rises generation after generation'],
          ['Stabilizing', 'Favors the average; selects against both extremes', 'Human birth weight — very small and very large babies have lower survival, average-sized babies do best'],
          ['Disruptive', 'Favors both extremes; selects against the average', 'A bird population where small and large beaks both work but medium beaks find nothing to eat — can lead to speciation'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Speciation — how new species arise
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>species</strong> is traditionally defined as a group of organisms that
        can interbreed and produce fertile offspring. <strong>Speciation</strong> is the
        process by which one species splits into two over time. The most common pathway
        is <strong>allopatric speciation</strong> — a population is split by a physical
        barrier (river, mountain range, ocean), and the two halves evolve in different
        directions until they can no longer interbreed even if reunited. A less common
        pathway is <strong>sympatric speciation</strong>, where new species emerge
        without geographic separation, often through ecological specialization or
        chromosomal changes.
      </Typography>

      <GuideTable
        headers={['Pathway', 'Mechanism', 'Example']}
        rows={[
          ['Allopatric', 'Geographic isolation splits a population; the two halves evolve apart', 'Squirrel populations on either side of the Grand Canyon diverged into separate species'],
          ['Sympatric', 'New species arise within the same area, often via ecological or behavioral isolation', 'Apple maggot flies in the U.S. — some specialized on apples (a new species), others remained on hawthorns'],
        ]}
      />

      <Callout kind="connect">
        Once two populations have been isolated long enough, they may become so genetically
        different that even if they meet again they cannot produce fertile offspring.
        That is the moment a new species exists. Speciation is slow on human timescales —
        usually thousands to millions of years — but it has happened countless times in
        Earth's history, producing the millions of species alive today.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Hardy-Weinberg equilibrium — the "no evolution" baseline
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The <strong>Hardy-Weinberg principle</strong> states that allele frequencies in
        a population remain CONSTANT from generation to generation IF five conditions are
        met: no mutation, random mating, no natural selection, no gene flow (migration),
        and a very large population. Any time evolution is observed, at least one of those
        conditions has been violated. Hardy-Weinberg is essentially the null hypothesis
        of population genetics — the state where nothing is changing — and deviation from
        it is the signature of evolution at work.
      </Typography>

      <Callout kind="in-plain-words">
        Think of Hardy-Weinberg as the "what if nothing happened" baseline. The five
        conditions describe a population that is essentially frozen genetically. In the
        real world, at least one of those conditions is almost ALWAYS violated — which
        is why real populations are nearly always evolving, even if slowly.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Other forces that change allele frequencies
      </Typography>
      <GuideTable
        headers={['Force', 'What it does', 'Example']}
        rows={[
          ['Mutation', 'Random changes in DNA introduce new alleles', 'A new mutation arising at low frequency in a population'],
          ['Genetic drift', 'Random changes in allele frequencies, especially in small populations', 'After a hurricane wipes out most of a beetle population, the survivors\' allele frequencies determine the next generation by chance, not fitness'],
          ['Gene flow (migration)', 'Individuals moving between populations carry their alleles', 'A wolf migrating from one pack to another brings its alleles into the new population'],
          ['Bottleneck effect', 'A dramatic population reduction causes loss of genetic variation', 'Cheetahs today have very low genetic diversity, possibly due to a near-extinction event in the past'],
          ['Founder effect', 'A small group founds a new population, carrying only a slice of the parent population\'s alleles', 'The Amish in Pennsylvania, founded by a small group, have unusually high frequencies of some rare alleles'],
        ]}
      />

      <Callout kind="watch-for">
        Genetic drift is RANDOM — it is evolution by chance, not by fitness. Natural
        selection is NON-RANDOM — it favors traits that improve fitness. The EOCEP
        sometimes mixes these up in answer choices. Drift becomes more important in
        small populations, where chance events can have large effects on allele
        frequencies.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Antibiotic resistance — natural selection right now
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Bacteria reproduce extremely fast — a population can double every 20 minutes
        under good conditions. When antibiotics are introduced, MOST bacteria die, but a
        rare few have a random mutation that lets them survive. Those survivors
        reproduce, and within a few generations, the entire surviving population is
        resistant. This is a textbook example of all four conditions of natural
        selection at work — variation (one bacterium had a resistance mutation),
        heritability (the mutation is passed to offspring), overproduction (millions of
        bacteria are produced), and differential survival (only the resistant ones
        survive the antibiotic).
      </Typography>

      <Callout kind="why-it-matters">
        Antibiotic resistance is a major modern public-health crisis, and it is happening
        because we keep selecting for it — through overuse of antibiotics in medicine
        and agriculture. Each round of antibiotic use is an evolutionary event. The same
        principle drives pesticide resistance in insects and herbicide resistance in
        weeds. The biology is identical; only the chemical changes.
      </Callout>

      <Callout kind="try-this">
        Pick an animal you can observe (a squirrel, a robin, a dog breed). List three of
        its traits that look like adaptations to its environment or lifestyle. For each
        one, propose what selective pressure might have favored it. Doing this exercise
        regularly teaches you to see evolution everywhere — exactly the analytical mindset
        the EOCEP rewards.
      </Callout>

      <Callout kind="coachs-note">
        Evolution-section questions on the EOCEP almost always come back to "can you
        explain a real-world phenomenon using natural selection?" Practice translating
        examples (antibiotic resistance, peppered moths, Galápagos finches, Darwin's
        artificial selection in pigeons) back into the four-condition framework. If you
        can do that fluently, you can answer almost any evolution question they throw.
      </Callout>
    </Box>
  );
}

// ── Section 6: Ecology & Ecosystems ───────────────────────────────────
function Section6Ecology() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Ecology is the study of how organisms interact with each other and with their
        environment. It zooms out from cells and molecules to look at populations,
        communities, ecosystems, biomes, and the entire biosphere. Energy flows through
        these systems, matter cycles through them, populations rise and fall, and
        species form intricate webs of relationships. The EOCEP will ask you about
        levels of organization, food chains and webs, energy pyramids, biogeochemical
        cycles, symbiosis, population dynamics, succession, and biomes.
      </Typography>

      <Analogy title="An ecosystem as a city economy">
        Imagine a city. Energy enters as electricity from the power plant (the sun, in an
        ecosystem). Food and goods circulate (matter cycles). Some residents produce
        things (producers — plants). Others consume what producers make (consumers —
        animals). Garbage collectors break down waste so atoms can be reused
        (decomposers — fungi and bacteria). The whole system has rules of supply,
        demand, and limited resources — and it can be disrupted by drought, disease, or
        human interference. An ecosystem is a city for organisms, and ecology is its
        economics.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Biotic vs. abiotic factors
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Every environment has two kinds of factors. <strong>Biotic</strong> factors are
        the LIVING components — animals, plants, fungi, bacteria, viruses.
        <strong> Abiotic</strong> factors are the NON-LIVING components — sunlight,
        temperature, water, soil, pH, wind, salinity, minerals. Both shape what life
        can survive in a given location.
      </Typography>
      <GuideTable
        headers={['Type', 'Examples']}
        rows={[
          ['Biotic', 'Animals, plants, fungi, bacteria, predators, competitors, mates, parasites, decomposers'],
          ['Abiotic', 'Sunlight, temperature, water, soil composition, pH, oxygen levels, wind, fire, minerals, elevation'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Bio = life. A-bio = without life.</strong> If it is alive (or was alive
        recently and is now its dead body — that is still biotic), it is biotic. If it
        is a physical or chemical condition (temperature, water, sunlight), it is
        abiotic. The EOCEP almost always asks you to sort a list into the two categories.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Levels of ecological organization
      </Typography>
      <MermaidDiagram
        chart={`
flowchart LR
    A[Organism - one individual] --> B[Population - same species, same area]
    B --> C[Community - all populations interacting]
    C --> D[Ecosystem - community plus abiotic factors]
    D --> E[Biome - large region with similar climate and life]
    E --> F[Biosphere - all life on Earth]
        `}
      />
      <GuideTable
        headers={['Level', 'Definition', 'Example']}
        rows={[
          ['Organism', 'One individual living thing', 'A single deer'],
          ['Population', 'All members of ONE species living in the same area', 'All the deer in a forest'],
          ['Community', 'All the populations of DIFFERENT species in the same area', 'Deer + oaks + squirrels + foxes + bacteria in the forest'],
          ['Ecosystem', 'A community PLUS its abiotic environment', 'The forest community + soil + climate + sunlight'],
          ['Biome', 'A large geographic region with a characteristic climate and life community', 'Temperate deciduous forest, desert, tundra, savanna'],
          ['Biosphere', 'All ecosystems on Earth combined — the global "living layer"', 'Earth\'s land, water, and atmosphere where life occurs'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Food chains, food webs, and trophic levels
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>food chain</strong> shows the linear flow of energy from one organism
        to another — for example: grass → grasshopper → frog → snake → hawk. Each
        feeding level in the chain is a <strong>trophic level</strong>. A
        <strong> food web</strong> is a more realistic version — it shows MANY
        interconnected food chains, capturing the fact that most animals eat (and are
        eaten by) several different species.
      </Typography>

      <GuideTable
        headers={['Trophic level', 'What it is', 'Example']}
        rows={[
          ['Producer (autotroph)', 'Captures sunlight (photosynthesis) or chemical energy and makes its own food', 'Grass, algae, oak tree, kelp'],
          ['Primary consumer (herbivore)', 'Eats producers', 'Grasshopper, cow, deer, zebra'],
          ['Secondary consumer', 'Eats primary consumers — usually carnivore or omnivore', 'Frog (eats grasshopper), small fish'],
          ['Tertiary consumer', 'Eats secondary consumers', 'Snake, larger fish'],
          ['Top predator (apex)', 'At the top of the food chain — eaten by nothing (normally)', 'Hawk, lion, shark, orca'],
          ['Decomposer', 'Breaks down dead organisms, returning nutrients to the soil', 'Fungi, bacteria, earthworms'],
          ['Detritivore', 'Eats dead or decaying matter (a kind of consumer)', 'Vultures, dung beetles, crabs'],
        ]}
      />

      <Callout kind="why-it-matters">
        Decomposers are easy to forget but essential. Without fungi and bacteria breaking
        down dead plants and animals, all the carbon, nitrogen, and phosphorus locked in
        those bodies would never be returned to the soil. Plants would run out of
        nutrients within a few generations. Every functioning ecosystem requires
        producers, consumers, AND decomposers.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Energy pyramids and the 10% rule
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        At each trophic level, only about <strong>10%</strong> of the energy from the
        level below is incorporated into new biomass. The other 90% is lost — mostly as
        heat from metabolism, plus undigested matter and movement. This is the famous
        <strong> 10% rule</strong>.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Worked example: imagine a grassland captures 10,000 kJ of sunlight as plant
        biomass. The primary consumers (grasshoppers) take in only about 1,000 kJ. The
        secondary consumers (frogs) take in only about 100 kJ. The tertiary consumers
        (snakes) take in only about 10 kJ. The top predator (hawk) takes in only about
        1 kJ. The pyramid narrows dramatically at each level — which is why top
        predators are always relatively rare.
      </Typography>

      <MermaidDiagram
        chart={`
flowchart TD
    A[Producer level - 10000 kJ] --> B[Primary consumer - 1000 kJ - 10 percent]
    B --> C[Secondary consumer - 100 kJ - 10 percent]
    C --> D[Tertiary consumer - 10 kJ - 10 percent]
    D --> E[Top predator - 1 kJ - 10 percent]
        `}
      />

      <Callout kind="make-it-stick">
        <strong>10% rule = only 10% of energy moves up; 90% is lost as heat.</strong>
        This is why food chains usually have no more than four or five levels — there
        simply is not enough energy to support a sixth. It is also the ecological reason
        eating lower on the food chain (plants and grains) feeds more people than eating
        higher (beef, fish). The same farmland that feeds 1 person on beef can feed about
        10 people on grain.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Biogeochemical cycles — atoms that never leave Earth
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Energy flows ONE WAY through ecosystems — sunlight in, heat out. But matter
        (atoms) cycles. The same carbon, nitrogen, oxygen, and water molecules get used
        and reused endlessly. These movement patterns are called
        <strong> biogeochemical cycles</strong>.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The carbon cycle
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Atmospheric CO2] -->|Photosynthesis| B[Plants store carbon in tissues]
    B -->|Eaten| C[Animals incorporate carbon]
    B -->|Cellular respiration| A
    C -->|Cellular respiration| A
    C -->|Death and decay| D[Decomposers release CO2]
    D --> A
    B -->|Death and burial over millions of years| E[Fossil fuels - oil, coal, gas]
    E -->|Combustion by humans| A
        `}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Carbon enters living things through <strong>photosynthesis</strong> (plants pull
        CO₂ out of the air to build glucose). It returns to the atmosphere through
        <strong> cellular respiration</strong> (every organism), <strong>decomposition</strong>
        (when things die and decay), and <strong>combustion</strong> (when fossil fuels
        or wood are burned). Burning fossil fuels — which represent millions of years of
        stored carbon — is the main reason atmospheric CO₂ levels are rising today,
        driving climate change.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The nitrogen cycle
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        About 78% of the air is nitrogen gas (N₂), but most organisms cannot use that
        form directly. <strong>Nitrogen-fixing bacteria</strong> in soil and in the
        roots of legumes (peas, beans, clover) convert N₂ into ammonia (NH₃), which
        plants can absorb. Plants build amino acids from it; animals get nitrogen by
        eating plants or other animals. <strong>Decomposers</strong> return nitrogen
        to the soil from dead organisms. Finally, <strong>denitrifying bacteria</strong>
        convert soil nitrogen back into atmospheric N₂, closing the cycle.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The water cycle
      </Typography>
      <GuideTable
        headers={['Process', 'What happens']}
        rows={[
          ['Evaporation', 'Liquid water (ocean, lakes, soil) becomes water vapor'],
          ['Transpiration', 'Plants release water vapor through leaves'],
          ['Condensation', 'Water vapor cools and forms clouds'],
          ['Precipitation', 'Rain, snow, sleet, or hail falls from clouds'],
          ['Runoff and infiltration', 'Liquid water returns to surface water or seeps into groundwater'],
        ]}
      />

      <Callout kind="connect">
        Biogeochemical cycles tie back to the photosynthesis-respiration cycle from
        Section 3. Photosynthesis pulls CO₂ from the air and water from soil; respiration
        puts them back. Multiply that across the whole biosphere — billions of trees,
        billions of animals — and you have the global cycles operating at planetary scale.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Symbiosis — the long-term relationships
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Symbiosis</strong> is a close, long-term relationship between two
        different species. There are three classic types — defined by who benefits and
        who is harmed.
      </Typography>
      <GuideTable
        headers={['Type', 'Effect on species A', 'Effect on species B', 'Example']}
        rows={[
          ['Mutualism', 'Benefits', 'Benefits', 'Bees pollinating flowers; gut bacteria in your intestine helping you digest food'],
          ['Commensalism', 'Benefits', 'Unaffected', 'Barnacles attaching to a whale (barnacle gets a free ride; whale neither helped nor harmed)'],
          ['Parasitism', 'Benefits', 'Harmed', 'Tapeworm in a human intestine; fleas on a dog'],
          ['Competition', 'Harmed', 'Harmed', 'Two species of squirrels competing for the same nuts in a forest'],
          ['Predation', 'Benefits (predator eats)', 'Harmed (prey dies)', 'Wolf eating a rabbit'],
        ]}
      />

      <Callout kind="watch-for">
        Symbiosis questions sometimes use unfamiliar species names. Just identify who
        benefits, who is harmed, and who is unaffected, then match to the three classic
        types. The EOCEP also sometimes lists predation and competition alongside the
        symbioses — those are NOT classical symbioses (they are short-term interactions),
        but they are still ecological relationships you should recognize.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Population dynamics — how populations grow and shrink
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Populations do not grow forever. Their size at any moment depends on births,
        deaths, immigration, and emigration. Two classic growth patterns show up:
      </Typography>
      <GuideTable
        headers={['Pattern', 'Shape', 'When it happens']}
        rows={[
          ['Exponential growth (J-curve)', 'Steep upward curve — population doubles in a fixed time period', 'Unlimited resources, no predators — usually short-term, e.g., bacteria invading a new petri dish'],
          ['Logistic growth (S-curve)', 'Rises then levels off at the carrying capacity', 'Realistic — population grows until limited by food, space, predators, or disease'],
        ]}
      />

      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Carrying capacity (K)</strong> is the maximum population size a
        particular environment can sustain indefinitely. Above K, mortality exceeds
        reproduction; below K, reproduction exceeds mortality; at K, they balance. The
        carrying capacity for a species depends on resources (food, water, shelter),
        predators, disease, and competition.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Limiting factors — what keeps populations in check
      </Typography>
      <GuideTable
        headers={['Type', 'Definition', 'Examples']}
        rows={[
          ['Density-dependent', 'Effect increases as population density rises', 'Disease, food shortage, predator-prey ratios, competition for mates'],
          ['Density-independent', 'Effect does NOT depend on population density', 'Natural disasters (fires, floods, hurricanes), extreme temperatures, droughts'],
        ]}
      />

      <Callout kind="in-plain-words">
        A density-dependent factor like disease gets WORSE as the population gets denser
        (germs spread more easily in a crowd). A density-independent factor like a
        hurricane does not care how big the population is — it kills the same fraction
        of a sparse population as a dense one. Knowing which is which lets you predict
        how a population will recover.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Ecological succession — how ecosystems develop and recover
      </Typography>
      <GuideTable
        headers={['Type', 'Starting point', 'Example']}
        rows={[
          ['Primary succession', 'Bare rock or lifeless surface — no soil yet exists', 'A new volcanic island; land exposed by retreating glaciers. Pioneer species (lichens) start the process'],
          ['Secondary succession', 'Soil is already present but the community has been disturbed', 'A forest recovering after a wildfire or after a farm is abandoned'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Succession typically progresses through stages — pioneer species (often lichens,
        mosses, weeds) prepare the ground; small plants and grasses move in; then shrubs
        and pioneer trees; finally a mature <strong>climax community</strong> dominated
        by long-lived species. The whole process can take decades to centuries.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Biomes — the major ecosystems of the world
      </Typography>
      <GuideTable
        headers={['Biome', 'Climate', 'Characteristic life']}
        rows={[
          ['Tropical rainforest', 'Hot, wet year-round (200+ cm rain/yr)', 'Massive biodiversity — broadleaf evergreen trees, monkeys, parrots, jaguars, millions of insect species'],
          ['Desert', 'Very little rain (< 25 cm/yr), wide temperature swings', 'Cacti, succulents, drought-adapted reptiles and small mammals'],
          ['Grassland / savanna', 'Seasonal rain; dry season fires', 'Grasses, scattered trees, large grazing herds (zebras, bison)'],
          ['Temperate deciduous forest', 'Four distinct seasons; moderate rain', 'Trees that drop leaves in winter (oak, maple), deer, squirrels, songbirds'],
          ['Taiga (boreal forest)', 'Long, cold winters; short summers', 'Coniferous evergreens (pine, spruce, fir), wolves, moose, bears'],
          ['Tundra', 'Extremely cold; short growing season; permafrost', 'Low shrubs, lichens, caribou, arctic foxes'],
          ['Freshwater', 'Low salt; lakes, rivers, wetlands', 'Fish, amphibians, waterfowl, aquatic plants'],
          ['Marine', 'Salty; ocean and estuaries', 'Massive diversity — phytoplankton, fish, whales, coral reefs (where light reaches the bottom)'],
        ]}
      />

      <Callout kind="connect">
        Biome distribution on Earth is driven mostly by two abiotic factors: temperature
        (driven by latitude and elevation) and precipitation. Drop the rainfall in a
        rainforest and you get savanna; drop it further and you get desert. Drop the
        temperature in a forest and you get taiga; drop it further and you get tundra.
        Climate sets the stage; life fills it.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Human impact on ecosystems
      </Typography>
      <GuideTable
        headers={['Issue', 'Cause', 'Effect']}
        rows={[
          ['Habitat loss', 'Deforestation, urban sprawl, agriculture', 'Species lose homes and food; biodiversity drops'],
          ['Pollution', 'Industrial chemicals, plastics, oil spills, sewage', 'Toxins enter food webs; biomagnify up trophic levels (e.g., mercury in tuna)'],
          ['Climate change', 'Excess CO₂ from burning fossil fuels traps heat in the atmosphere', 'Warmer temperatures, melting ice, rising seas, shifting biomes'],
          ['Invasive species', 'Non-native species introduced (intentionally or accidentally)', 'Outcompete or eat native species — kudzu in the SC South, fire ants, zebra mussels'],
          ['Overharvesting', 'Hunting, fishing, or logging faster than populations can recover', 'Collapse of cod fisheries; passenger pigeon extinction'],
        ]}
      />

      <Callout kind="why-it-matters">
        Biodiversity is not decorative — it is structural. Ecosystems with more species
        are more resilient to disturbance, produce more total biomass, and provide more
        ecosystem services (pollination, water purification, climate regulation).
        Protecting biodiversity is not just about charismatic species; it is about
        keeping life-support systems running for ALL species, including us.
      </Callout>

      <Callout kind="try-this">
        Pick a local ecosystem near where you live — a backyard, a park, a creek. List
        five organisms you see, classify each by trophic level (producer, primary
        consumer, secondary consumer, decomposer), and sketch a small food web showing
        who probably eats whom. Doing this exercise teaches ecological thinking faster
        than reading any chapter.
      </Callout>

      <Callout kind="coachs-note">
        Ecology rewards visual learners. Re-draw the carbon cycle, the nitrogen cycle, an
        energy pyramid, and a sample food web in your notebook. Practice labeling each
        with the right vocabulary (producer, consumer, decomposer, biotic, abiotic). The
        EOCEP almost always includes one or two questions where you have to interpret a
        diagram you have not seen before — practicing the standard diagrams makes that
        feel routine.
      </Callout>
    </Box>
  );
}

// ── Section 3: Biochemistry & Energy ──────────────────────────────────
function Section3Biochem() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Biochemistry is biology at the molecular level. Every process you have ever heard
        of — heartbeat, digestion, breathing, growing, thinking — is, underneath, a series
        of chemical reactions between molecules. The Biology 1 EOCEP will focus on a small
        but important set: the unique properties of water, the four major macromolecules
        that build living things, the enzymes that speed reactions, the molecule that
        carries energy (ATP), and the two complementary processes that capture and release
        that energy — photosynthesis and cellular respiration.
      </Typography>

      <Analogy title="The cell as a chemistry lab on a coffee budget">
        Imagine a chemistry lab that has to run thousands of reactions every second but
        cannot afford fancy equipment. Instead of furnaces, it uses tiny molecular machines
        called enzymes that hold reactants in just the right position so they react with
        almost no extra heat. Instead of buying batteries, it builds its own from sunlight
        (in plants) or from food (in everyone else). Instead of paying for raw materials,
        it recycles atoms forever. That is your cell. Biochemistry is just the manual for
        how this minimalist lab runs.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Water — the "universal solvent" and its weird properties
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Water (H₂O) is by far the most abundant molecule in living things — your body is
        about 60% water by mass. Its unusual properties make life possible. The key fact
        is that water is a <strong>polar</strong> molecule: its oxygen end is slightly
        negative and its hydrogen ends are slightly positive. That polarity lets water
        molecules form <strong>hydrogen bonds</strong> with each other and with other
        polar molecules.
      </Typography>
      <GuideTable
        headers={['Property', 'What it means', 'Why it matters for life']}
        rows={[
          ['Polarity', 'Uneven sharing of electrons between O and H atoms', 'Allows water to dissolve other polar substances (salts, sugars, amino acids)'],
          ['Hydrogen bonding', 'Weak attractions between H of one water and O of another', 'Causes high boiling point, surface tension, cohesion'],
          ['Cohesion', 'Water sticks to itself', 'Allows tall trees to pull water up via transpiration'],
          ['Adhesion', 'Water sticks to other polar surfaces', 'Helps water climb narrow tubes (capillary action) in plants'],
          ['High specific heat', 'Takes a lot of energy to warm water up or cool it down', 'Stabilizes body and ocean temperatures'],
          ['High heat of vaporization', 'Takes a lot of energy to evaporate water', 'Sweating cools your body very efficiently'],
          ['Less dense as ice', 'Solid water floats on liquid', 'Ice on a pond insulates fish underneath; lakes do not freeze solid'],
          ['Universal solvent', 'Dissolves many polar and ionic substances', 'Blood plasma, cytoplasm, and sap are all water-based mixtures'],
        ]}
      />

      <Callout kind="why-it-matters">
        Almost every weird thing about water — why ice floats, why sweating cools you, why
        a paperclip can float on the surface, why blood is mostly water — traces back to
        polarity and hydrogen bonding. EOCEP questions about water properties almost
        always come back to these two underlying facts.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The four macromolecules — biology's building blocks
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Life on Earth is built from four major classes of large molecules — carbohydrates,
        lipids, proteins, and nucleic acids. Each is made by linking smaller building
        blocks (monomers) into longer chains (polymers). Knowing the monomer, the polymer,
        and the typical function of each class gets you most of the way through any
        EOCEP biochemistry question.
      </Typography>

      <GuideTable
        headers={['Macromolecule', 'Monomer', 'Polymer / examples', 'Main function']}
        rows={[
          ['Carbohydrate', 'Monosaccharide (e.g., glucose, fructose)', 'Disaccharides (sucrose), polysaccharides (starch, glycogen, cellulose)', 'Quick energy; structural support in plants (cellulose)'],
          ['Lipid', 'Fatty acid + glycerol (no true monomer)', 'Triglycerides (fats and oils), phospholipids, steroids (cholesterol)', 'Long-term energy storage; membranes; hormones'],
          ['Protein', 'Amino acid (20 different kinds)', 'Polypeptides folded into functional proteins (enzymes, antibodies, hemoglobin)', 'Enzymes catalyze reactions; structure; transport; signaling'],
          ['Nucleic acid', 'Nucleotide (sugar + phosphate + base)', 'DNA (double helix) and RNA (single strand)', 'Storing and transmitting genetic information'],
        ]}
      />

      <Callout kind="make-it-stick">
        Monomer → polymer is just like beads → necklace. One bead is a monomer (glucose,
        amino acid, nucleotide). String many beads together and you get a polymer (starch,
        protein, DNA). All four macromolecule groups follow this beads-on-a-string
        pattern, except lipids — which use a slightly different assembly (fatty acid +
        glycerol).
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Carbohydrates — the fast-burning fuel
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Carbohydrates are made of carbon, hydrogen, and oxygen — usually in a roughly
        1:2:1 ratio (which is why "carbo-hydrate" — hydrated carbon). Glucose (C₆H₁₂O₆)
        is the most important monosaccharide. Two glucose-like monomers bond to form a
        <strong> disaccharide</strong> (like sucrose). Many bond together to form a
        <strong> polysaccharide</strong> — starch (plant energy storage), glycogen (animal
        energy storage in the liver and muscles), or cellulose (the structural fibers of
        plant cell walls).
      </Typography>

      <Callout kind="watch-for">
        Starch, glycogen, and cellulose are ALL made of glucose units, but they bond in
        different geometries. That tiny structural difference means humans can digest
        starch and glycogen (we have the right enzymes) but not cellulose (we lack the
        enzyme cellulase). Cows can digest cellulose only because microbes living in their
        stomachs make cellulase for them. Same monomer, very different function — a
        beautiful example of "structure determines function."
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Lipids — long-term energy and the membrane builder
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Lipids are the family of mostly nonpolar molecules — fats, oils, waxes, steroids,
        and phospholipids. Because they are nonpolar, they do not mix with water (think
        salad dressing separating). Lipids store about twice as much energy per gram as
        carbohydrates, which is why animals stash long-term energy in fat. Phospholipids
        are special — they have a polar head and nonpolar tails, which is precisely what
        makes them line up into the cell membrane bilayer. Steroids include cholesterol
        and many hormones (testosterone, estrogen).
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Proteins — the workhorses
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Proteins do more different jobs in the cell than any other molecule. They are made
        of amino acids strung together — 20 different amino acids combined in different
        orders. The sequence of amino acids (determined by your DNA) determines how the
        protein folds, which in turn determines what the protein can do. Enzymes are
        proteins. Hemoglobin (the oxygen carrier) is a protein. Antibodies (the immune
        defenders) are proteins. Hair, fingernails, and muscle are mostly protein.
      </Typography>

      <Callout kind="in-plain-words">
        Think of amino acids as 20 different shapes of LEGO blocks. The order in which you
        snap them together determines the final shape of the structure — and the final
        shape is what determines whether the structure works as a wing, a wheel, or a
        wall. Change the order even slightly and the structure changes. That is exactly
        how a mutation can break a protein.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Nucleic acids — the instruction manual
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        DNA and RNA are the two nucleic acids. Both are made of nucleotides — each
        nucleotide is a sugar + a phosphate + a nitrogenous base. DNA stores the long-term
        instructions for building every protein you have. RNA is the messenger that
        carries those instructions out to the ribosome. We will dig much deeper into
        nucleic acids in the Genetics section.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Enzymes — biological catalysts
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        An <strong>enzyme</strong> is a protein (almost always) that speeds up a specific
        chemical reaction without being consumed by it. Enzymes are the reason chemistry
        in the cell can happen fast enough to keep you alive — without them, the same
        reactions would take hours or years to occur at body temperature. Each enzyme
        binds a specific <strong>substrate</strong> (the molecule it acts on) at its
        <strong> active site</strong>. The shape match between active site and substrate
        is so precise that it is often described as a "lock and key."
      </Typography>

      <Analogy title="An enzyme as a matchmaker">
        Imagine a chemical reaction where molecule A and molecule B need to meet in just
        the right orientation to react. On their own, in a chaotic cell, they would only
        bump into each other correctly once in a great while. An enzyme is a tiny
        matchmaker — it holds molecule A in one hand and molecule B in the other, lines
        them up exactly, lets the reaction happen, and then lets go. The enzyme itself is
        unchanged at the end, ready to introduce the next pair.
      </Analogy>

      <GuideTable
        headers={['Factor', 'Effect on enzyme activity']}
        rows={[
          ['Temperature', 'Activity rises with temperature up to an optimum (~37°C for human enzymes), then drops sharply as the enzyme denatures (unfolds) and can no longer hold its shape'],
          ['pH', 'Each enzyme has an optimum pH. Pepsin in your stomach works best at pH ~2; most cellular enzymes prefer pH ~7. Far from optimum, the enzyme denatures'],
          ['Substrate concentration', 'More substrate → faster reaction, up to the point where all enzyme active sites are full. Then the rate plateaus'],
          ['Enzyme concentration', 'More enzyme → faster reaction, assuming substrate is not limiting'],
          ['Inhibitors', 'Molecules that block or distort the active site, slowing the enzyme. Some medications work this way (aspirin, penicillin)'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Lock and key.</strong> The active site is shaped to fit one specific
        substrate, the way a key fits one specific lock. That is why enzymes are SPECIFIC
        — each one usually only catalyzes one kind of reaction. Change the active site's
        shape (with heat, extreme pH, or a mutation) and the key no longer fits.
      </Callout>

      <Callout kind="connect">
        Enzyme denaturation explains everyday biology. Fever above 105°F is dangerous
        because your enzymes start to denature. Sour milk happens because bacterial
        enzymes change the proteins in milk. Lactose intolerance is a real-world example
        of missing enzymes — people who lack lactase cannot break down lactose into
        digestible sugars.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        ATP — the energy currency of the cell
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Adenosine triphosphate (ATP)</strong> is the universal energy currency of
        life. Every cell, in every organism — from bacteria to whales — uses ATP. The
        molecule is built like a battery: a core (adenosine) with three phosphate groups
        chained off of it. The bond between the second and third phosphate stores a lot
        of usable energy. When a cell needs energy, an enzyme snaps that third phosphate
        off, releasing energy and leaving ADP (adenosine diphosphate). Later, the cell
        re-attaches a phosphate to recharge ADP back into ATP. This ATP ↔ ADP cycle runs
        billions of times per second in every cell of your body.
      </Typography>

      <Analogy title="ATP as a rechargeable battery">
        ATP is exactly like a rechargeable battery. When fully charged (three phosphates),
        it can power something — a muscle contraction, an active-transport pump, a
        protein assembly. When discharged (two phosphates), it becomes ADP and needs to be
        recharged. Cellular respiration is the charger — it takes energy from food
        (glucose) and uses it to push that third phosphate back on. Your body cycles a
        body-weight equivalent of ATP every single day.
      </Analogy>

      <Callout kind="watch-for">
        A common misconception: students think ATP is made in your stomach, your blood, or
        your liver. It is not. ATP is made INSIDE every cell, primarily in mitochondria
        (in eukaryotes). Cells make their own ATP locally because ATP does not travel
        well between cells. The "energy" delivered through your blood is GLUCOSE, which
        each cell then converts to ATP.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Photosynthesis — making food from sunlight
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Photosynthesis</strong> is the process plants (and algae, and some
        bacteria) use to convert light energy into chemical energy stored in glucose. It
        happens in <strong>chloroplasts</strong>. The overall equation is:
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7, fontStyle: 'italic', fontSize: '1.05rem', fontWeight: 600 }}>
        6 CO₂ + 6 H₂O + light energy → C₆H₁₂O₆ + 6 O₂
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        In plain English: six carbon-dioxide molecules plus six water molecules plus
        sunlight produce one glucose molecule and six oxygen molecules. The plant uses
        the glucose; the oxygen is released as waste — which is fortunate, since every
        animal on Earth depends on that "waste."
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Two stages of photosynthesis
      </Typography>
      <GuideTable
        headers={['Stage', 'Where in the chloroplast?', 'Inputs', 'Outputs', 'What happens']}
        rows={[
          ['Light-dependent reactions', 'Thylakoid membranes (the green stacks)', 'Light, H₂O', 'ATP, NADPH, O₂', 'Chlorophyll captures sunlight; water is split, releasing O₂; energy is stored as ATP and NADPH'],
          ['Light-independent reactions (Calvin cycle)', 'Stroma (the fluid around the thylakoids)', 'CO₂, ATP, NADPH', 'C₆H₁₂O₆ (glucose)', 'CO₂ is "fixed" into sugar using the ATP and NADPH from stage 1'],
        ]}
      />

      <Callout kind="make-it-stick">
        Light reactions need LIGHT directly — they happen in the thylakoid membranes and
        produce ATP, NADPH, and O₂. The Calvin cycle does NOT need light directly (it is
        "light-independent"), but it relies on the ATP and NADPH produced by the light
        reactions. So in practice, the Calvin cycle only runs efficiently when the
        light-dependent reactions are running too.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Cellular respiration — burning food for ATP
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Cellular respiration</strong> is photosynthesis in reverse — almost.
        Plants and animals alike use respiration to break down glucose and harvest its
        energy as ATP. The overall equation is:
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7, fontStyle: 'italic', fontSize: '1.05rem', fontWeight: 600 }}>
        C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + ATP (~36–38 per glucose)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Glucose plus oxygen produce carbon dioxide, water, and a large amount of ATP.
        Most of this happens inside mitochondria. Notice that the inputs of respiration
        are the outputs of photosynthesis, and vice versa — they are complementary
        processes that together form the foundation of energy flow through life.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The three stages of cellular respiration
      </Typography>
      <GuideTable
        headers={['Stage', 'Where?', 'Net ATP yield', 'What happens']}
        rows={[
          ['Glycolysis', 'Cytoplasm', '2 ATP', 'Glucose (6C) is split into two pyruvate molecules (3C each). Does not require oxygen'],
          ['Krebs cycle (citric acid cycle)', 'Mitochondrial matrix', '2 ATP', 'Pyruvate is broken down further; CO₂ is released; electron carriers (NADH, FADH₂) are loaded with electrons'],
          ['Electron transport chain', 'Inner mitochondrial membrane', '~32–34 ATP', 'Electrons from NADH and FADH₂ pump protons across the membrane; protons flow back through ATP synthase, generating ATP. O₂ is the final electron acceptor (becomes H₂O)'],
        ]}
      />

      <MermaidDiagram
        chart={`
flowchart TD
    A[Photosynthesis - in chloroplasts] -->|Outputs glucose and O2| B[Cellular Respiration - in mitochondria]
    B -->|Outputs CO2 and H2O| A
    A -->|Inputs| C[CO2 + H2O + sunlight]
    B -->|Inputs| D[Glucose + O2]
    B -->|Releases| E[ATP for cellular work]
        `}
      />

      <Callout kind="why-it-matters">
        Photosynthesis and cellular respiration are the two halves of the energy cycle
        that powers nearly all life on Earth. Plants capture sunlight and store it as
        chemical bonds in glucose. Animals (and plants too, at night) break those bonds
        and release the energy as ATP. The CO₂ that respiration releases is recaptured
        by photosynthesis. The O₂ that photosynthesis releases is consumed by respiration.
        It is the same atoms cycling endlessly between the two processes.
      </Callout>

      <Callout kind="watch-for">
        Trap: students sometimes write the photosynthesis equation backwards or confuse
        it with respiration. Memorize it as: "Plants take in CO₂ and water, with light,
        and make sugar and oxygen." Then respiration is the exact reverse. The direction
        of the arrow matters — backward equations on the EOCEP are always wrong.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Anaerobic respiration and fermentation
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        When oxygen is NOT available, cells can still produce a small amount of ATP
        through <strong>fermentation</strong>. There are two main types. In
        <strong> lactic-acid fermentation</strong> (in your muscle cells during intense
        exercise, and in yogurt-making bacteria), pyruvate is converted to lactic acid.
        That is the "burn" you feel in your muscles when oxygen cannot reach them fast
        enough. In <strong>alcoholic fermentation</strong> (in yeast), pyruvate is
        converted to ethanol and CO₂ — the basis of bread rising and beer brewing.
        Fermentation produces only 2 ATP per glucose, compared to 36–38 from aerobic
        respiration — so it is a fallback, not a main strategy.
      </Typography>

      <Callout kind="connect">
        Every loaf of bread, every cup of yogurt, every glass of wine is the product of
        anaerobic fermentation done by microorganisms. Sourdough bread bubbles because
        yeast cells are doing alcoholic fermentation in the dough — the CO₂ they release
        is what makes the bread rise. Same biology, different applications.
      </Callout>

      <Callout kind="try-this">
        Build yourself a one-page "biochem cheat sheet." Top row: the four macromolecules
        and their monomers. Middle row: the photosynthesis equation and where it happens.
        Bottom row: the cellular respiration equation, its three stages, and where each
        stage happens. Re-draw the cheat sheet from memory three times this week. By the
        EOCEP, the whole structure will be automatic.
      </Callout>

      <Callout kind="coachs-note">
        Biochemistry is one of the highest-leverage sections on the Biology 1 EOCEP. The
        same handful of equations and concepts get tested over and over in slightly
        different costumes. Master the macromolecule table, the photosynthesis equation,
        the respiration equation, the ATP/ADP cycle, and the basic enzyme rules — and you
        will own this section.
      </Callout>
    </Box>
  );
}

// ── Section 7: Classification & Biodiversity ──────────────────────────
function Section7Classification() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        With millions of known species on Earth — and tens of millions probably still
        undiscovered — biologists need a system for naming and grouping them. That system
        is <strong>taxonomy</strong>, and the modern version traces back to the Swedish
        botanist Carl Linnaeus in the 1700s. The EOCEP will ask about the levels of
        Linnaean classification, the three domains and six kingdoms of life, the rules
        of binomial nomenclature, and how to use a dichotomous key to identify an
        unfamiliar organism.
      </Typography>

      <Analogy title="Taxonomy as nested folders on a computer">
        Imagine a giant filing system. The biggest folder is "all life." Inside it are
        three sub-folders called Domains. Inside each Domain are sub-folders called
        Kingdoms. Inside each Kingdom: Phyla. Then Classes, Orders, Families, Genera,
        Species. Each level holds organisms more closely related than the level above.
        By the time you reach Species, you have one specific tab — say, "domestic dog" —
        nested inside seven layers of grouping that tell you exactly where dogs fit in
        the whole tree of life.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The Linnaean hierarchy
      </Typography>
      <GuideTable
        headers={['Level', 'What it groups', 'Example for humans']}
        rows={[
          ['Domain', 'The three largest groupings of life', 'Eukarya'],
          ['Kingdom', 'Major life groups: animal, plant, fungus, protist, bacteria, archaea', 'Animalia'],
          ['Phylum', 'Major body plans within a kingdom', 'Chordata (animals with a backbone or notochord)'],
          ['Class', 'Sub-groupings within a phylum', 'Mammalia'],
          ['Order', 'Related families', 'Primates'],
          ['Family', 'Closely related genera', 'Hominidae (great apes)'],
          ['Genus', 'Closely related species', 'Homo'],
          ['Species', 'A single specific kind that can interbreed', 'sapiens'],
        ]}
      />

      <Callout kind="make-it-stick">
        Mnemonic: <strong>D</strong>id <strong>K</strong>ing <strong>P</strong>hilip
        <strong> C</strong>ome <strong>O</strong>ver <strong>F</strong>or
        <strong> G</strong>ood <strong>S</strong>oup? Domain, Kingdom, Phylum, Class,
        Order, Family, Genus, Species. Memorize the order — it shows up on the EOCEP
        almost every year.
      </Callout>

      <Analogy title="A scientific name as a permanent ID number">
        Common names are unreliable. A "robin" in Europe is a tiny red-breasted bird; a
        "robin" in the United States is a much larger thrush. A scientific name like
        <em> Erithacus rubecula</em> (European robin) or <em>Turdus migratorius</em>
        (American robin) is unique worldwide — like a social security number for a
        species. No two species share the same binomial, and every biologist on Earth
        knows exactly which organism is meant.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The three domains and six kingdoms
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[All Life] --> B[Domain Bacteria - prokaryotic, peptidoglycan walls]
    A --> C[Domain Archaea - prokaryotic, extremophiles, unique chemistry]
    A --> D[Domain Eukarya - eukaryotic - all the rest]
    D --> E[Kingdom Protista - mostly single-celled eukaryotes]
    D --> F[Kingdom Fungi - decomposers with chitin walls]
    D --> G[Kingdom Plantae - autotrophs with cellulose walls]
    D --> H[Kingdom Animalia - multicellular heterotrophs]
    B --> I[Kingdom Bacteria]
    C --> J[Kingdom Archaea]
        `}
      />

      <GuideTable
        headers={['Domain', 'Kingdom(s)', 'Cell type', 'Key features']}
        rows={[
          ['Bacteria', 'Bacteria (Eubacteria)', 'Prokaryotic', 'Cell walls of peptidoglycan; very diverse; includes most familiar microbes (E. coli, Streptococcus)'],
          ['Archaea', 'Archaea (Archaebacteria)', 'Prokaryotic', 'Often live in extreme environments — hot springs, salt lakes, deep ocean vents; distinct membrane lipids and ribosomes'],
          ['Eukarya', 'Protista, Fungi, Plantae, Animalia', 'Eukaryotic', 'True nucleus and organelles; ranges from single-celled protists to redwood trees to whales'],
        ]}
      />

      <Callout kind="why-it-matters">
        Splitting prokaryotes into TWO domains (Bacteria and Archaea) was a major
        twentieth-century discovery. At a microscope it is hard to tell them apart, but
        their DNA, RNA, and membrane chemistry are very different. Archaea are actually
        more closely related to YOU than they are to bacteria. Modern classification is
        a story of using molecular evidence to reshape older anatomy-based groupings.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Tour of the four eukaryotic kingdoms
      </Typography>
      <GuideTable
        headers={['Kingdom', 'Cell organization', 'Feeding strategy', 'Cell wall?', 'Examples']}
        rows={[
          ['Protista', 'Mostly single-celled (some colonial or multicellular)', 'Some autotrophic (algae), some heterotrophic (amoebas), some both', 'Variable', 'Amoeba, paramecium, algae, slime molds, kelp'],
          ['Fungi', 'Mostly multicellular (yeast is single-celled)', 'Heterotrophic — absorb nutrients from dead matter (decomposers)', 'Yes — made of chitin', 'Mushrooms, molds, yeasts, bread mold'],
          ['Plantae', 'Multicellular', 'Autotrophic (photosynthetic)', 'Yes — made of cellulose', 'Mosses, ferns, conifers, flowering plants'],
          ['Animalia', 'Multicellular', 'Heterotrophic — ingest food', 'NO cell walls', 'Insects, fish, amphibians, reptiles, birds, mammals'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Binomial nomenclature — the two-word naming system
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Linnaeus's other lasting gift was the system of <strong>binomial
        nomenclature</strong> — every species gets a unique two-word Latin name. The
        first word is the <strong>genus</strong> (capitalized); the second is the
        <strong> species</strong> (lowercase). The whole name is italicized when typed,
        or underlined when handwritten. Examples: <em>Homo sapiens</em> (humans),
        <em> Canis lupus</em> (gray wolf), <em>Quercus alba</em> (white oak),
        <em> Panthera tigris</em> (tiger).
      </Typography>

      <GuideTable
        headers={['Rule', 'Right', 'Wrong']}
        rows={[
          ['Genus is capitalized; species is lowercase', '<em>Homo sapiens</em>', 'homo Sapiens'],
          ['Both words are italicized (or underlined)', '<em>Canis lupus</em>', 'Canis lupus (no italics)'],
          ['After first use, genus may be abbreviated to a single letter', '<em>H. sapiens</em>', '<em>Hsa sapiens</em>'],
          ['Names are Latin (or Latinized)', '<em>Tyrannosaurus rex</em>', 'Tyrant lizard (English)'],
        ]}
      />

      <Callout kind="watch-for">
        The EOCEP often tests whether you can spot a correctly written scientific name.
        Common traps: capitalizing the species word, NOT capitalizing the genus, or
        forgetting italics. The format is strict — Genus species, italicized. Memorize
        the rule with a familiar example like <em>Homo sapiens</em> and check any
        unfamiliar name against that pattern.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Dichotomous keys — identifying unknown organisms
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>dichotomous key</strong> is a tool for identifying an organism by
        answering a series of YES-or-NO (or this-vs-that) questions. Each step has two
        choices that lead to either the next step or a final identification. Field
        biologists use them all the time to identify plants, insects, fish, and other
        organisms encountered in the field.
      </Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Worked example — a tiny key for four leaves:
      </Typography>
      <GuideTable
        headers={['Step', 'Question', 'If yes → ', 'If no → ']}
        rows={[
          ['1', 'Are the leaves needle-shaped?', 'Step 2', 'Step 3'],
          ['2', 'Are the needles in clusters of 2–5?', 'Pine (genus <em>Pinus</em>)', 'Spruce (genus <em>Picea</em>)'],
          ['3', 'Are the leaves lobed (with deep indentations)?', 'Oak (genus <em>Quercus</em>)', 'Maple (genus <em>Acer</em>)'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        To use the key: examine your unknown leaf, answer step 1, follow the arrow to
        the next step, repeat until you reach a final identification.
      </Typography>

      <Callout kind="in-plain-words">
        A dichotomous key is just a flowchart of YES/NO decisions that funnels you down
        to one answer. It feels like a guessing game but it is actually a guided tour
        through a logic tree. The EOCEP loves dichotomous-key questions because they
        test both your reading skills and your understanding of organism features.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Cladograms and phylogenetic trees
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A <strong>cladogram</strong> (or phylogenetic tree) is a diagram showing
        evolutionary relationships among groups of organisms. Branches represent shared
        ancestry; branch points are common ancestors. Organisms that share a more recent
        common ancestor are more closely related. Modern cladograms are built mostly
        from molecular data (DNA, protein sequences), backing up earlier anatomy-based
        groupings.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Biodiversity — why it matters
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Biodiversity</strong> is the variety of life at all levels — genetic
        diversity within a species, species diversity within a community, and ecosystem
        diversity across a region. High biodiversity makes ecosystems more resilient to
        disturbance, more productive, and more useful to humans (food, medicine,
        materials, ecosystem services). Human activity (habitat loss, climate change,
        pollution, invasive species) is currently causing the fastest extinction rate
        in Earth's history outside the great mass extinctions.
      </Typography>

      <GuideTable
        headers={['Level of biodiversity', 'What it means', 'Why it matters']}
        rows={[
          ['Genetic', 'Variety of alleles within a species', 'A genetically diverse population is more resilient to disease and environmental change'],
          ['Species', 'Number and variety of species in a community', 'More species = more functions; more redundancy if one species is lost'],
          ['Ecosystem', 'Variety of ecosystems across a region', 'Different ecosystems support different services (wetlands purify water; forests cycle carbon)'],
        ]}
      />

      <Callout kind="connect">
        Conservation biology — the science of protecting biodiversity — applies every
        idea in this guide. It uses ecology (food webs, populations), evolution (genetic
        diversity), genetics (small-population effects), and classification (deciding
        what counts as an endangered "species"). Almost no real conservation problem can
        be solved without drawing on multiple sections of Biology 1 at once.
      </Callout>

      <Callout kind="try-this">
        Pick three local organisms (a tree, a bird, an insect) and look up the scientific
        name and kingdom/phylum/class of each. Write them down in correct binomial
        format. Doing this four or five times locks the naming conventions in better
        than any flashcard drill.
      </Callout>

      <Callout kind="coachs-note">
        Classification questions on the EOCEP are usually quick points if you know the
        hierarchy mnemonic, the six kingdoms with one or two key features each, and the
        rules for scientific names. The investment in memorizing these is small and the
        payoff is large.
      </Callout>
    </Box>
  );
}

// ── Section 8: Homeostasis & Body Systems ─────────────────────────────
function Section8Homeostasis() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Your body has trillions of cells, dozens of tissues, eleven major organ systems,
        and is constantly bombarded by changing external conditions — heat, cold, food,
        pathogens, exertion. Yet your internal conditions stay remarkably stable: your
        body temperature hovers near 37 °C, your blood glucose stays in a tight range,
        your blood pH stays near 7.4. That ability to maintain a steady internal state
        is called <strong>homeostasis</strong>, and it is one of the defining features
        of life. The EOCEP will ask you about feedback loops, levels of organization
        inside an organism, and the basic functions of the major organ systems.
      </Typography>

      <Analogy title="Homeostasis as a thermostat in your house">
        Imagine a thermostat set to 70 °F. When the room cools below 70, the thermostat
        turns the heater on. When the room warms above 70, the thermostat turns the
        heater off. The room temperature stays near 70, even though the outside weather
        swings from 20 to 95. Your body works the same way. When you get cold, you
        shiver and constrict blood vessels (heat production up, heat loss down). When you
        get hot, you sweat and dilate blood vessels (heat production down, heat loss up).
        The set point — 37 °C — stays the same. The mechanisms are different but the
        principle is identical: a sensor detects a change, a control system fires a
        response, and the system returns to the set point.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The three parts of every feedback loop
      </Typography>
      <GuideTable
        headers={['Component', 'Job', 'Body example (temperature)']}
        rows={[
          ['Sensor (receptor)', 'Detects the change in the variable being regulated', 'Temperature receptors in skin and brain (hypothalamus)'],
          ['Control center (integrator)', 'Compares the current value to the set point and decides what to do', 'Hypothalamus in the brain — the body\'s thermostat'],
          ['Effector', 'Carries out the correction', 'Sweat glands (cool body), muscles (shiver to warm), blood vessels (dilate or constrict)'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Negative feedback — the workhorse of homeostasis
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Negative feedback</strong> is the dominant pattern in homeostasis. When
        the body detects a change AWAY from the set point, it triggers a response that
        REVERSES that change, returning the system toward the set point. The word
        "negative" is technical — it means "opposing the change," not "bad." Negative
        feedback regulates body temperature, blood glucose, blood pressure, water and
        salt balance, and many other variables.
      </Typography>

      <MermaidDiagram
        chart={`
flowchart TD
    A[Body too cold - below set point] --> B[Sensor detects temp drop]
    B --> C[Hypothalamus signals effectors]
    C --> D1[Shivering generates heat]
    C --> D2[Skin vessels constrict to conserve heat]
    D1 --> E[Body temperature rises]
    D2 --> E
    E --> F[Set point restored - feedback turns off]
        `}
      />

      <GuideTable
        headers={['Variable', 'What happens when it rises', 'What happens when it falls']}
        rows={[
          ['Body temperature', 'Sweating, vasodilation, behavior (remove clothing, seek shade)', 'Shivering, vasoconstriction, behavior (add clothing, find warmth)'],
          ['Blood glucose', 'Pancreas releases INSULIN → cells take in glucose and store it', 'Pancreas releases GLUCAGON → liver releases stored glucose into the blood'],
          ['Blood pressure', 'Vessels relax; heart slows; kidneys excrete more water', 'Vessels constrict; heart speeds up; kidneys retain water'],
          ['Blood pH', 'Breathe out CO₂ faster (raises pH back toward 7.4)', 'Hold breath / breathe slower (lowers pH back toward 7.4)'],
          ['Body water', 'Kidneys excrete more urine; thirst decreases', 'Antidiuretic hormone (ADH) tells kidneys to keep water; thirst increases'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Negative feedback = REVERSE the change.</strong> If your glucose rises,
        insulin LOWERS it. If your temperature falls, shivering RAISES it. The body's
        default operating mode is "push back against the change." If you understand this
        single principle, you can predict the regulatory response to nearly any
        homeostatic disturbance.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Positive feedback — the rare amplifier
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        <strong>Positive feedback</strong> is far less common but just as important.
        Instead of opposing a change, positive feedback AMPLIFIES it — driving the
        system further from the starting state until some endpoint is reached. Positive
        feedback is used when the body needs to GET SOMETHING DONE QUICKLY, not when it
        needs to maintain a steady state.
      </Typography>
      <GuideTable
        headers={['Example', 'How positive feedback works']}
        rows={[
          ['Childbirth', 'Baby pushes on the cervix → cervix stretches → signals brain → brain releases oxytocin → contractions intensify → more stretch → more oxytocin → ... → baby is born'],
          ['Blood clotting', 'Platelets stick to a wound and release chemicals that attract MORE platelets, which release MORE chemicals, until a clot forms'],
          ['Action potential in a neuron', 'Sodium channels open → sodium flows in → voltage rises → MORE sodium channels open → MORE sodium flows in → full depolarization'],
          ['Ripening fruit', 'Ripe fruit produces ethylene gas → neighboring fruit ripens → produces more ethylene → cascade through the bushel ("one bad apple")'],
        ]}
      />

      <Callout kind="watch-for">
        Do not confuse "positive feedback = good" and "negative feedback = bad." In
        biology, "positive" and "negative" describe the direction of the response, not
        its value. Most homeostasis uses NEGATIVE feedback (which keeps you alive day to
        day). Positive feedback is reserved for the relatively few moments when the body
        needs an event to go to completion (giving birth, clotting a wound, firing a
        nerve impulse).
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Levels of organization in a multicellular organism
      </Typography>
      <MermaidDiagram
        chart={`
flowchart LR
    A[Cell - smallest unit of life] --> B[Tissue - group of similar cells]
    B --> C[Organ - structure made of multiple tissue types]
    C --> D[Organ system - organs working together]
    D --> E[Organism - the whole individual]
        `}
      />
      <GuideTable
        headers={['Level', 'Definition', 'Example']}
        rows={[
          ['Cell', 'The smallest unit of life', 'A muscle cell'],
          ['Tissue', 'A group of similar cells performing a shared function', 'Muscle tissue, nervous tissue, epithelial tissue, connective tissue'],
          ['Organ', 'A structure made of two or more tissue types working together', 'Heart (cardiac muscle + connective tissue + epithelium + nerves)'],
          ['Organ system', 'A group of organs that cooperate on a major function', 'Circulatory system (heart + arteries + veins + capillaries)'],
          ['Organism', 'A complete individual living thing', 'You'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The eleven major human organ systems
      </Typography>
      <GuideTable
        headers={['System', 'Major job', 'Key organs']}
        rows={[
          ['Integumentary', 'Outer covering — protects body, regulates temperature, senses environment', 'Skin, hair, nails, sweat glands'],
          ['Skeletal', 'Support, protection, movement attachment, blood cell production', 'Bones, joints, cartilage'],
          ['Muscular', 'Movement and posture; generates body heat', 'Skeletal, smooth, and cardiac muscle'],
          ['Nervous', 'Fast communication via electrical signals; sensing, thinking, controlling', 'Brain, spinal cord, nerves, sense organs'],
          ['Endocrine', 'Slow chemical communication via hormones in blood', 'Pituitary, thyroid, adrenals, pancreas, gonads'],
          ['Circulatory (cardiovascular)', 'Transports oxygen, nutrients, hormones, and wastes throughout the body', 'Heart, arteries, veins, capillaries, blood'],
          ['Respiratory', 'Exchanges O₂ and CO₂ between blood and air', 'Lungs, trachea, bronchi, diaphragm'],
          ['Digestive', 'Breaks down food and absorbs nutrients', 'Mouth, stomach, small intestine, large intestine, liver, pancreas'],
          ['Excretory (urinary)', 'Removes nitrogenous wastes and regulates water/salt balance', 'Kidneys, ureters, bladder, urethra'],
          ['Immune (lymphatic)', 'Defends against pathogens', 'White blood cells, lymph nodes, spleen, thymus'],
          ['Reproductive', 'Produces gametes; in females supports developing offspring', 'Ovaries, uterus, testes, etc.'],
        ]}
      />

      <Callout kind="why-it-matters">
        Body systems do not work in isolation — they constantly cooperate. When you
        sprint, your respiratory system pulls in more O₂, your circulatory system speeds
        up to deliver it, your muscular system burns ATP, your nervous system coordinates
        all of this, and your excretory system handles the waste products. EOCEP
        questions sometimes describe a scenario (exercise, dehydration, infection) and
        ask which systems are working together — practice the coordination, not just the
        organ-by-organ lists.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — blood glucose regulation
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        After a meal, your blood glucose rises. Sensors in the pancreas detect the rise
        and signal beta cells to release <strong>insulin</strong>. Insulin tells body
        cells (especially muscle, fat, and liver cells) to take glucose IN and store it
        as glycogen or fat. Blood glucose falls back to the normal range. Later, between
        meals, your blood glucose drops. The pancreas now releases <strong>glucagon</strong>,
        which tells the liver to break down stored glycogen and release glucose back
        into the blood. Blood glucose rises back to normal. The two hormones — insulin
        and glucagon — are antagonists, each opposing the other to maintain the set
        point. This is classic negative feedback at work.
      </Typography>

      <Callout kind="connect">
        Type 1 diabetes is what happens when the immune system destroys insulin-producing
        beta cells. Without insulin, blood glucose stays dangerously high after meals —
        a homeostatic failure. Treatment (injected insulin) is essentially supplying the
        missing piece of the feedback loop. The biology you learn in this section
        directly explains chronic diseases that affect millions of people.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Disease and homeostatic failure
      </Typography>
      <GuideTable
        headers={['Condition', 'What is failing', 'Effect']}
        rows={[
          ['Hyperthermia / heatstroke', 'Cooling system overwhelmed; body cannot lose heat fast enough', 'Body temperature climbs above 40 °C; enzymes start to denature'],
          ['Hypothermia', 'Heat loss exceeds heat production', 'Body temperature falls; metabolism slows; can be fatal'],
          ['Diabetes (type 1)', 'Insulin not produced by pancreas', 'Blood glucose stays too high after meals'],
          ['Dehydration', 'Water output exceeds intake; ADH cannot fully compensate', 'Blood pressure drops; kidneys conserve water; thirst signals trigger'],
          ['High blood pressure (hypertension)', 'Feedback loops fail to relax vessels and keep pressure in healthy range', 'Strain on heart, kidneys, blood vessels over time'],
        ]}
      />

      <Callout kind="in-plain-words">
        Many chronic diseases are best understood as broken homeostasis. The body has a
        target value for temperature, glucose, water, blood pressure, etc. When the
        regulating loop is damaged — by genetic defect, infection, injury, or wear and
        tear — the value drifts outside the safe range. Modern medicine often works by
        helping the broken loop (insulin injections, blood-pressure drugs) or by removing
        the disturbance (treating an infection that is driving fever).
      </Callout>

      <Callout kind="try-this">
        Track ONE homeostatic variable in your body over a single day. Body temperature
        is easiest — take it every two hours with a thermometer. Notice the small swings
        and the strong tendency back toward 36.6–37 °C. Watching your own homeostasis in
        action drives the abstract concept of feedback loops home.
      </Callout>

      <Callout kind="coachs-note">
        The EOCEP usually asks one to two questions about negative feedback (with a
        scenario you have to interpret) and one big-picture question about organ-system
        cooperation. Memorize the three feedback components (sensor, control, effector),
        the contrast between negative and positive feedback, and the brief job
        description of each of the eleven organ systems.
      </Callout>
    </Box>
  );
}

// ── Section 9: Scientific Inquiry & Lab Skills ────────────────────────
function Section9Inquiry() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Science is not a collection of facts — it is a way of asking and answering
        questions about the natural world. The EOCEP will test whether you can design a
        controlled experiment, identify variables, distinguish hypothesis from theory
        from law, interpret data presented in graphs and tables, and recognize good
        versus weak evidence. These skills are not "extra" — they are at the heart of
        what biology is.
      </Typography>

      <Analogy title="The scientific method as a courtroom investigation">
        Think of a scientist as a detective. The detective notices something strange (an
        observation), forms a possible explanation (a hypothesis), tests it by gathering
        evidence (an experiment), and either confirms or revises the explanation. Other
        detectives examine the same evidence (peer review) and either agree or push
        back. If many independent investigations all agree, the explanation becomes
        the working consensus (a theory). Science is essentially an ongoing community
        investigation, where any explanation is only as trustworthy as the evidence and
        the people who have checked the evidence.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The scientific method
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Observation - notice something curious] --> B[Question - what is happening here?]
    B --> C[Hypothesis - testable explanation, often if-then]
    C --> D[Experiment - controlled test of the hypothesis]
    D --> E[Data collection and analysis]
    E --> F{Does the data support the hypothesis?}
    F -->|Yes| G[Conclusion - hypothesis supported, replicate and publish]
    F -->|No| H[Revise the hypothesis, design a new experiment]
    H --> C
    G --> I[Repeated support over many studies = THEORY]
        `}
      />

      <GuideTable
        headers={['Step', 'Description', 'Example']}
        rows={[
          ['Observation', 'Notice something in nature worth explaining', 'My bean plants on the windowsill are taller than my plants in the closet'],
          ['Question', 'Frame the curiosity as a researchable question', 'Does the amount of light affect bean plant growth?'],
          ['Hypothesis', 'A testable proposed answer — often "if … then …"', 'If bean plants get more light, then they will grow taller'],
          ['Experiment', 'A controlled test that isolates ONE variable', 'Grow 20 bean plants in identical pots and soil; expose 10 to 8 hours of light and 10 to 2 hours'],
          ['Data', 'Collect quantitative or qualitative observations', 'Measure plant height after two weeks'],
          ['Analysis and conclusion', 'Compare data to the hypothesis', 'Plants with 8 hours of light grew on average twice as tall — hypothesis supported'],
          ['Replication and peer review', 'Other scientists repeat the experiment to confirm', 'Several labs replicate the result; the finding is published in a journal'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Variables in an experiment
      </Typography>
      <GuideTable
        headers={['Type of variable', 'Definition', 'In the bean experiment']}
        rows={[
          ['Independent variable (IV)', 'The variable you DELIBERATELY change — the "cause" being tested', 'Hours of light per day (2 vs. 8)'],
          ['Dependent variable (DV)', 'The variable you MEASURE in response — the "effect"', 'Plant height after two weeks'],
          ['Controlled variables (constants)', 'All other variables held CONSTANT so they don\'t confuse the result', 'Pot size, soil type, water amount, temperature, bean variety'],
          ['Control group', 'A group that does NOT receive the experimental treatment, used for comparison', 'The plants getting 2 hours of light (a baseline)'],
          ['Experimental group', 'The group that DOES receive the experimental treatment', 'The plants getting 8 hours of light'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>IV = what I change. DV = what I measure.</strong> Or: the IV goes on the
        x-axis (horizontal) of a graph; the DV goes on the y-axis (vertical). "Dependent"
        because it DEPENDS on the IV. Every well-designed experiment changes ONE thing
        (the IV) while holding everything else constant.
      </Callout>

      <Callout kind="watch-for">
        The EOCEP will sometimes describe an experiment with multiple things changing at
        once and ask you why the result is unreliable. The answer is almost always
        "TOO MANY uncontrolled variables — you cannot tell which one caused the effect."
        Good experimental design requires ONE independent variable and many controlled
        variables.
      </Callout>

      <Analogy title="A controlled experiment as a fair race">
        Imagine you want to know whether one runner is faster than another. A FAIR race
        gives both runners the same starting line, the same finish line, the same
        surface, the same shoes, the same weather. The only thing that should differ is
        WHO is running — that is your independent variable. If one runner gets a tailwind
        and the other gets a headwind, you cannot tell whether the difference in time
        was due to the runner or the wind. Controlled experiments are the scientific
        version of a fair race: change ONE thing, hold everything else equal.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Hypothesis vs. theory vs. law — the most-confused trio
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        This is probably the single biggest student misconception about science. In
        EVERYDAY English, "theory" means "a guess." In SCIENCE, "theory" means something
        very different — a well-tested, broadly supported explanation of how a part of
        nature works. The hierarchy is:
      </Typography>
      <GuideTable
        headers={['Term', 'What it really means in science', 'Example']}
        rows={[
          ['Hypothesis', 'A testable, falsifiable proposed explanation — usually for a specific case', '"If I add fertilizer to this soil, the corn will grow taller."'],
          ['Theory', 'A well-supported, broad explanation for a large body of evidence — survives repeated testing', 'Theory of evolution; cell theory; theory of plate tectonics; germ theory of disease'],
          ['Law', 'A consistent observation of nature, often expressible as an equation, that describes WHAT happens (but not WHY)', 'Law of gravity; Mendel\'s laws of segregation and independent assortment'],
        ]}
      />

      <Callout kind="why-it-matters">
        Calling evolution "just a theory" sounds like dismissal in everyday English but
        is actually a huge compliment in scientific English. A scientific theory has
        survived enormous testing and is supported by mountains of evidence. Theories
        do NOT graduate into laws — they are different categories. Laws describe what;
        theories explain why.
      </Callout>

      <Callout kind="in-plain-words">
        A scientific law is like a traffic camera — it tells you what consistently
        happens. A scientific theory is like the engineer's explanation of WHY it
        happens. Mendel's laws describe the 3:1 ratio; the theory of meiosis explains
        WHY that ratio appears. Both are useful; neither is "less scientific" than the
        other.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Bias, replication, and peer review
      </Typography>
      <GuideTable
        headers={['Concept', 'Definition', 'Why it matters']}
        rows={[
          ['Bias', 'A systematic distortion in data collection or interpretation, often unconscious', 'Funded studies sometimes favor the funder; expectations color observations'],
          ['Replication', 'Repeating an experiment to see whether the result holds up', 'A single study is suggestive; many independent replications are convincing'],
          ['Peer review', 'Other qualified scientists evaluate a study before it is published', 'Catches errors, weak methodology, overstated claims'],
          ['Sample size', 'Number of test subjects or trials', 'Bigger samples reduce the role of random variation in results'],
          ['Control of variables', 'Holding everything constant except the IV', 'Without it, you cannot tell which factor caused the effect'],
        ]}
      />

      <Callout kind="watch-for">
        Common signs of weak science: very small sample sizes, no control group, results
        not replicated, lots of "anecdotes" rather than data, financial conflicts of
        interest. The EOCEP will sometimes present a scenario and ask which problem
        weakens the study — be ready to spot all five.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Reading data — tables, graphs, and what they tell you
      </Typography>
      <GuideTable
        headers={['Graph type', 'Best for showing', 'Example']}
        rows={[
          ['Line graph', 'How one variable CHANGES OVER TIME (or with another continuous variable)', 'Plant height vs. days since planting'],
          ['Bar graph', 'COMPARING separate categories or groups', 'Average plant height for 2-hour vs. 8-hour light groups'],
          ['Scatter plot', 'RELATIONSHIP between two continuous variables; spotting correlation', 'Body mass index vs. blood pressure across many people'],
          ['Pie chart', 'PROPORTIONS that make up a whole', 'Percentage of a forest community by trophic level'],
          ['Histogram', 'DISTRIBUTION of a single continuous variable across a population', 'Distribution of bean plant heights in a population'],
        ]}
      />

      <Callout kind="make-it-stick">
        When a question gives you a graph, do four things in order: (1) read the title,
        (2) read the axes labels and units, (3) identify the variables (IV on x, DV on
        y), (4) describe the trend BEFORE looking at the answer choices. Trying to
        match answers to a graph you haven't fully read is how avoidable mistakes happen.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Microscopy — the workhorse tool of biology
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Cells were discovered because microscopes were invented. Today, microscopes
        remain a core lab tool in biology. The Biology 1 EOCEP expects familiarity with
        a few types and their basic functions.
      </Typography>
      <GuideTable
        headers={['Microscope', 'How it works', 'Strengths', 'Limits']}
        rows={[
          ['Compound light microscope', 'Light passes through a thin specimen and through two lenses (ocular and objective)', 'See living cells; up to ~1000× magnification', 'Cannot see fine internal structures of organelles'],
          ['Dissecting (stereo) microscope', 'Low magnification, light reflects off the specimen, 3D view', 'See whole small organisms (insects, plant parts) in 3D', 'Very limited magnification (~20–80×)'],
          ['Transmission electron microscope (TEM)', 'Electrons pass through ultra-thin specimens', 'Resolves internal cell ultrastructure — see ribosomes, membrane layers', 'Specimens must be dead and treated; expensive'],
          ['Scanning electron microscope (SEM)', 'Electrons bounce off specimen surface', 'Stunning 3D surface images of small things', 'Surface only; dead, dried specimens; expensive'],
        ]}
      />

      <GuideTable
        headers={['Microscopy skill', 'Why it matters']}
        rows={[
          ['Calculating total magnification', 'Total = ocular × objective. A 10× ocular and a 40× objective give 400×'],
          ['Focusing safely', 'Start at lowest power; use coarse focus first, then fine focus only at higher power; never use coarse on high power (can crack the slide)'],
          ['Preparing a wet mount', 'Place specimen on slide; add a drop of water; lower coverslip at an angle to avoid bubbles'],
          ['Staining', 'Dyes like iodine or methylene blue make transparent cell structures visible'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Measurement units and scientific notation
      </Typography>
      <GuideTable
        headers={['Unit', 'Equivalent', 'When you use it']}
        rows={[
          ['Meter (m)', 'Standard unit of length', 'Plant heights, organism sizes'],
          ['Centimeter (cm)', '1/100 m', 'Larger leaves, small animals'],
          ['Millimeter (mm)', '1/1000 m', 'Very small specimens, slide measurements'],
          ['Micrometer (μm)', '1/1,000,000 m', 'Cells and large organelles'],
          ['Nanometer (nm)', '1/1,000,000,000 m', 'Viruses, DNA, individual proteins'],
          ['Gram (g) / kilogram (kg)', 'Mass', 'Body weight, biomass, drug doses'],
          ['Liter (L) / milliliter (mL)', 'Volume', 'Solutions, blood volume'],
          ['Celsius (°C)', 'Temperature', 'Body temp 37 °C, freezing 0 °C, boiling 100 °C'],
        ]}
      />

      <Callout kind="connect">
        Lab skills carry forward into every later science class — chemistry, physics,
        anatomy. Mastering microscopy, careful measurement, controlled experimentation,
        and graph reading in Biology 1 makes everything that follows easier. These are
        the foundational moves of an experimental scientist.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Lab safety — the rules that keep you alive
      </Typography>
      <GuideTable
        headers={['Rule', 'Why']}
        rows={[
          ['Wear goggles and lab apron during any chemistry or dissection work', 'Eyes are fragile; spills happen even to careful people'],
          ['Tie back long hair and avoid loose clothing', 'Loose hair and sleeves can catch fire or get caught in equipment'],
          ['Never taste or smell chemicals directly', 'Many lab chemicals are harmful inhaled or ingested'],
          ['Know where the eyewash station, fire extinguisher, and first-aid kit are', 'Seconds matter in an accident'],
          ['Report any accident, spill, or broken equipment immediately', 'Hiding accidents makes them more dangerous'],
          ['Clean up your work area and wash hands when finished', 'Prevents contamination of next user, and prevents you from carrying chemicals home'],
        ]}
      />

      <Callout kind="try-this">
        Pick any experiment from a Biology 1 lab manual — even one you have not done.
        Read it once and then, without looking, write out: the question, the IV, the DV,
        the control group, two controlled variables, and how the data will be
        represented (graph type). If you can do that for five different experiments,
        you have mastered experimental design.
      </Callout>

      <Callout kind="coachs-note">
        The Inquiry section on the EOCEP is one of the highest-leverage. The questions
        are almost always about experimental design (IV/DV, controls), distinguishing
        theory/law/hypothesis, or interpreting a graph. Drill those three skills
        specifically and the section becomes easy points on test day.
      </Callout>
    </Box>
  );
}

// ── Section: EOCEP Strategy ───────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The SC EOCEP for Biology 1 is a timed multiple-choice exam covering everything in
        Sections 2–9 of this guide. It is administered at the end of your Biology 1
        course, and your score counts <strong>20% of your final grade in the class</strong>.
        The exam tests cells, biochemistry, genetics, evolution, ecology, classification,
        homeostasis, and scientific inquiry. A periodic table is sometimes provided;
        calculators usually are NOT permitted; check your school's specific policy. The
        biggest controllable factor on test day is not raw knowledge — it is strategy
        and pacing.
      </Typography>

      <Analogy title="Exam day as a road trip with a fixed gas tank">
        Think of the 90–120 minutes you have as a tank of fuel. Every question costs some
        fuel. If you burn half your tank on the first ten questions, you will run out
        before the finish line — even if you knew the later questions perfectly. The
        whole point of pacing is to spread the fuel across the whole route so you arrive
        with a few drops to spare for the review pass.
      </Analogy>

      <Callout kind="try-this">
        Before exam day, take the EOCEP Sandbox tab at least twice — full timed runs, no
        pauses. Your goal is not to score perfectly on the first one; it is to learn how
        the time pressure feels and where YOU run out of time. Time management is the
        single biggest controllable factor on test day.
      </Callout>

      <Callout kind="coachs-note">
        Read each question CAREFULLY. EOCEP Biology questions often hinge on a single
        word — "primarily," "directly," "only," "BEST." Skim once for the gist of the
        question, then re-read with the answer choices in mind. Many wrong answers are
        wrong because of a small qualifier students glossed over the first time.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        What is heavily tested
      </Typography>
      <GuideTable
        headers={['Topic', 'Why it shows up so much']}
        rows={[
          ['Organelles and their functions', 'Foundational. Expect 3–4 questions on matching organelles to jobs in unusual cell types.'],
          ['Photosynthesis and cellular respiration equations', 'Almost guaranteed. Know the inputs, outputs, locations, and the relationship between the two.'],
          ['Punnett squares (monohybrid and dihybrid)', 'Expect at least one full Punnett to work out. Know the 3:1 and 9:3:3:1 ratios.'],
          ['Mitosis vs. meiosis', 'A classic trap. Know which produces 2 vs. 4 cells; identical vs. different; somatic vs. gametes.'],
          ['Four conditions of natural selection', 'Expect a scenario where you identify which condition is at work.'],
          ['Food webs, trophic levels, and the 10% rule', 'Calculation questions appear. Know that only ~10% of energy moves up.'],
          ['Negative vs. positive feedback', 'Glucose, body temperature, childbirth, and blood clotting all show up as examples.'],
          ['Experimental design — IV, DV, controls', 'A staple. Almost always one or two questions on identifying variables.'],
        ]}
      />

      <Callout kind="watch-for">
        Common procedural traps:
        <ul>
          <li>Confusing MITOSIS (2 identical diploid cells, growth and repair) with MEIOSIS (4 different haploid cells, gametes).</li>
          <li>Writing the PHOTOSYNTHESIS equation backwards or mixing it up with respiration.</li>
          <li>Calling an X-linked recessive trait "common in females" when it is actually more common in males.</li>
          <li>Forgetting that the 10% rule means each successive trophic level holds about TEN TIMES LESS energy than the level below.</li>
          <li>Choosing the "most exciting" example for a Best Evidence question rather than the most rigorous one (a peer-reviewed study with large sample size beats a single anecdote every time).</li>
          <li>Saying populations "evolve to meet their needs" instead of "populations change because the environment selects from existing variation."</li>
        </ul>
      </Callout>

      <Callout kind="connect">
        Biology 1 skills compound into every later science class, every health course,
        every food and medicine choice. Cells, energy flow, genetics, ecology, and
        scientific reasoning are the foundation. Investing now in real understanding,
        not just procedural memorization, pays back across years of school AND the rest
        of your life as a citizen reading about science in the news.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Time management
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The EOCEP gives you about 90–120 minutes for roughly 50–60 multiple-choice
        questions plus possible constructed-response items. That is about 1.5–2 minutes
        per question. Some will take 20 seconds; some will take 4–5 minutes. Do not
        fixate on any single problem — flag it, move on, and come back at the end. A
        50-question exam is decided by the questions you ANSWER, not the one you got
        stuck on.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three-pass strategy
      </Typography>
      <GuideTable
        headers={['Pass', 'Goal', 'Time budget']}
        rows={[
          ['1. Quick sweep', 'Answer every question you know cold. Skip anything that takes more than 90 seconds. Mark the skipped ones.', 'About half the total time'],
          ['2. Deep work', 'Return to the skipped questions. Work them carefully, one at a time.', 'About 40% of the total time'],
          ['3. Review', 'Double-check answers, especially anything you guessed or rushed. Make sure no questions are left blank.', 'About 10% of the total time'],
        ]}
      />

      <Callout kind="try-this">
        Practice the three-pass strategy in the EOCEP Sandbox. Do not treat the first
        run as a "real test" attempt — treat it as practice for your strategy. Notice
        which question types eat your time, and plan to skip them during the first pass
        on test day.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Multiple-choice tactics
      </Typography>
      <GuideTable
        headers={['Tactic', 'How to use it']}
        rows={[
          ['Eliminate obvious wrong answers first', 'Even if you cannot pick the right answer, ruling out two raises your guess from 25% to 50%.'],
          ['Watch for absolute language', '"Always," "never," "all," "none" — extreme claims are usually wrong because biology is messy and rules have exceptions.'],
          ['Translate jargon into plain English', 'If the question says "the hypotonic environment caused plasmolysis," translate to "less solute outside meant water left the plant cell, so the membrane pulled from the wall."'],
          ['Trust your first instinct on close calls', 'Second-guessing a careful first read usually makes things worse, not better.'],
          ['Answer every question', 'There is no guessing penalty on the EOCEP. A blank is always wrong; a guess has at least a 25% chance.'],
        ]}
      />

      <Callout kind="why-it-matters">
        On a 50-question multiple-choice test, eliminating even ONE wrong answer per
        question raises your guess accuracy from 25% to 33%. Eliminating two raises it
        to 50%. Over 10 guessed questions, that is the difference between an extra 1–2
        questions right vs. an extra 3–4. Add that to the questions you actually solve,
        and elimination becomes a meaningful score booster.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The week before the exam
      </Typography>
      <GuideTable
        headers={['Day', 'Activity']}
        rows={[
          ['7 days out', 'Take a full EOCEP Sandbox attempt. Note which subdomains scored lowest.'],
          ['6 days out', 'Drill the weakest subdomain in Practice. Aim for 20 questions, focus on understanding misses.'],
          ['5 days out', 'Drill the second-weakest subdomain.'],
          ['4 days out', 'Take another full Sandbox attempt. Compare to the first.'],
          ['3 days out', 'Re-read the Study Guide sections for any subdomain still below 75%.'],
          ['2 days out', 'Review flashcards. Light practice — do not burn out.'],
          ['1 day out', 'Rest your brain. Light review of key terms (organelles, equations, MLA / scientific naming basics). Get to bed early.'],
          ['Exam day', 'Eat a real breakfast with protein. Bring two sharpened pencils and a watch. Arrive early.'],
        ]}
      />

      <Callout kind="make-it-stick">
        Build a "one-page cheat sheet" for yourself a week before the exam — even though
        you cannot bring it into the test. Photosynthesis equation. Respiration equation.
        Mitosis stages. Punnett ratios (3:1 and 9:3:3:1). The four conditions of natural
        selection. The taxonomic mnemonic. The eleven organ systems. Writing it out by
        hand is itself a powerful study act.
      </Callout>

      <Callout kind="in-plain-words">
        Biology rewards big-picture understanding more than memorization of details. If
        you understand WHY mitochondria have so much surface area inside (more space for
        the electron transport chain), you can answer any question about mitochondria.
        If you understand WHY oxygen is the final electron acceptor (highest
        electronegativity), you can answer any question about respiration. Aim for
        understanding the patterns; the facts come along for the ride.
      </Callout>

      <Callout kind="coachs-note">
        On exam day, your job is to perform — not to learn. Do not try to absorb new
        material in the last 12 hours; you are likely to confuse yourself and lose
        sleep. Trust the work you have already done. The students who do best on
        standardized tests are not necessarily the smartest — they are the ones who
        arrive rested, calm, and confident.
      </Callout>
    </Box>
  );
}

// ── Glossary section (renders the imported glossary as a table) ───────
function SectionGlossary() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Terms a 9th-/10th-grader is expected to recognize on the SC Biology 1 EOCEP. Use
        the Practice tab and Flashcards tab to drill these into memory; here they are
        organized in one place for quick reference.
      </Typography>
      <GuideTable
        headers={['Term', 'Definition']}
        rows={glossary.map(g => [g.term, g.definition])}
      />
    </Box>
  );
}
