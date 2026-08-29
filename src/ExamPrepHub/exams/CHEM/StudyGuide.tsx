// CHEM Study Guide — accordion-based layout for SC Chemistry (11th grade).
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

const READING_PROGRESS_KEY = 'exam-prep-reading:CHEM';
const COMPLETION_KEY = 'exam-prep-completed:CHEM';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:CHEM';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Matter & Measurement',
  s3: 'Atomic Structure',
  s4: 'Periodic Table',
  s5: 'Chemical Bonding',
  s6: 'Stoichiometry',
  s7: 'States of Matter & Thermodynamics',
  s8: 'Reaction Kinetics, Equilibrium & Acids/Bases',
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
  { id: 's1',      num: '1',  title: 'The Big Picture',                         icon: '🗺️' },
  { id: 's2',      num: '2',  title: 'Matter & Measurement',                    icon: '⚗️' },
  { id: 's3',      num: '3',  title: 'Atomic Structure',                        icon: '⚛️' },
  { id: 's4',      num: '4',  title: 'The Periodic Table',                      icon: '🔢' },
  { id: 's5',      num: '5',  title: 'Chemical Bonding',                        icon: '🔗' },
  { id: 's6',      num: '6',  title: 'Stoichiometry',                           icon: '⚖️' },
  { id: 's7',      num: '7',  title: 'States of Matter & Thermodynamics',       icon: '🌡️' },
  { id: 's8',      num: '8',  title: 'Reaction Kinetics, Equilibrium & Acids/Bases', icon: '🧪' },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',                       icon: '🎯' },
  { id: 's-gloss', num: '📚', title: 'Glossary',                                icon: '📚' },
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
    case 's2':      return <Section2Matter />;
    case 's3':      return <Section3Atomic />;
    case 's4':      return <Section4Periodic />;
    case 's5':      return <Section5Bonding />;
    case 's6':      return <Section6Stoichiometry />;
    case 's7':      return <Section7States />;
    case 's8':      return <Section8Kinetics />;
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Chemistry: The Central Science</Typography>

      <Analogy title="Chemistry as the universal translator">
        Physics describes forces and energy at the most fundamental level. Biology describes living systems.
        Geology describes the Earth. Engineering designs machines. But all of them speak the language of chemistry —
        because matter is made of atoms and molecules, and understanding how they interact is what chemistry does.
        A biologist studying how a drug works in a cell is doing chemistry. A geologist dating a rock by radioactive
        decay is doing chemistry. Chemistry is the bridge between the subatomic and the macroscopic, the connector
        that links every other science together.
      </Analogy>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        Chemistry is the scientific study of matter — what it is made of, what properties it has, and how it
        changes. Everything you can touch, smell, taste, or see is matter. The air you breathe, the food you
        eat, the phone in your pocket, and your own body are all collections of atoms bonded together in
        specific arrangements. Understanding chemistry means understanding the rules that govern those arrangements
        and transformations.
      </Typography>

      <Callout kind="why-it-matters">
        Chemistry explains why medicines heal, why metals rust, why bread rises, why batteries power devices,
        and why the ozone layer matters. Every career in health care, engineering, environmental science,
        materials science, food science, or forensics relies on chemical reasoning. Even if you never work
        in a lab, you will make better decisions about nutrition, medications, cleaning products, and the
        environment because you understand chemistry.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>How the Eight Sections Connect</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        This guide is organized to mirror the logical flow of chemistry — from what matter is, all the way to
        how fast and far reactions proceed. Each section builds on the previous ones, so the map below shows
        how ideas connect:
      </Typography>

      <MermaidDiagram chart={`graph LR
  A["Section 2\nMatter & Measurement\n(What is matter? How do we measure it?)"]
  B["Section 3\nAtomic Structure\n(What are atoms made of?)"]
  C["Section 4\nPeriodic Table\n(How are elements organized? What patterns emerge?)"]
  D["Section 5\nChemical Bonding\n(How do atoms join to form compounds?)"]
  E["Section 6\nStoichiometry\n(How much of each substance reacts?)"]
  F["Section 7\nStates of Matter & Thermodynamics\n(How does energy affect matter?)"]
  G["Section 8\nKinetics, Equilibrium & Acids/Bases\n(How fast? How far? Which direction?)"]
  A --> B --> C --> D --> E --> F --> G`} />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>What Chemists Actually Do</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Chemists ask three kinds of questions: (1) <strong>What is it?</strong> (analysis and identification);
        (2) <strong>How much is there?</strong> (quantitative measurement); and (3) <strong>What happens when it reacts?</strong>
        (reactivity, synthesis, and prediction). This guide covers all three types of questions.
      </Typography>

      <GuideTable
        headers={['Section', 'Core Question', 'Key Concepts']}
        rows={[
          ['Matter & Measurement', 'What is matter and how do we describe it precisely?', 'Pure substances, mixtures, sig figs, SI units, density'],
          ['Atomic Structure', 'What are atoms made of and how are electrons arranged?', 'Subatomic particles, electron configuration, isotopes'],
          ['Periodic Table', 'How are elements organized and what patterns emerge?', 'Periods, groups, periodic trends'],
          ['Chemical Bonding', 'How do atoms combine to form compounds?', 'Ionic, covalent, Lewis structures, VSEPR, IMFs'],
          ['Stoichiometry', 'How much of each substance reacts?', 'Moles, molar mass, limiting reagent, percent yield'],
          ['States of Matter & Thermodynamics', 'How does energy affect matter and reactions?', 'Gas laws, phase changes, calorimetry, Hess\'s law'],
          ['Kinetics, Equilibrium & Acids/Bases', 'How fast, how far, and which direction?', 'Reaction rates, Le Chatelier, K, pH, buffers'],
        ]}
      />

      <Callout kind="coachs-note">
        As you read, look for connections between sections. The periodic trends you learn in Section 4 directly
        explain bond types in Section 5. The mole concept from Section 2 is the foundation of every calculation
        in Section 6. Electron configurations from Section 3 explain reactivity patterns in Section 8.
        Chemistry is a web, not a list.
      </Callout>

      <Callout kind="make-it-stick">
        Before each section, ask yourself: "What do I already know from real life about this topic?" Chemistry
        is everywhere — you already have intuitions. Identifying those intuitions and then sharpening them with
        precise vocabulary and equations is the core learning strategy for this course.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Scientific Method in Chemistry</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Chemistry is an experimental science, meaning every claim must be supported by reproducible
        experimental evidence. The scientific method is the structured process chemists use to build
        reliable knowledge:
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li><strong>Observation:</strong> Notice a phenomenon or question in the natural world.</li>
        <li><strong>Hypothesis:</strong> Propose a testable explanation (an "if…then" statement).</li>
        <li><strong>Experiment:</strong> Design and conduct a controlled experiment to test the hypothesis. Change only one variable (the independent variable), measure its effect (the dependent variable), and hold everything else constant (controlled variables).</li>
        <li><strong>Data collection and analysis:</strong> Record data quantitatively, apply statistical analysis, look for patterns.</li>
        <li><strong>Conclusion:</strong> Determine whether the data support or refute the hypothesis. Communicate results.</li>
        <li><strong>Peer review and replication:</strong> Other scientists repeat the experiment. If results consistently hold across many experiments, the hypothesis may become a theory.</li>
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>scientific theory</strong> is not a guess — it is a well-substantiated explanation of
        some aspect of the natural world, based on a body of evidence. Atomic theory, kinetic molecular
        theory, and collision theory are all examples. A <strong>scientific law</strong> describes what
        happens (often in mathematical form) without explaining why: the Law of Conservation of Mass,
        Boyle's Law, and Charles's Law are descriptions of observed regularities.
      </Typography>

      <Callout kind="in-plain-words">
        The difference between a theory and a law is not a matter of certainty — both are well-established.
        The difference is what they do: laws describe patterns ("when pressure doubles, volume halves"),
        while theories explain the mechanisms behind those patterns ("the pressure-volume relationship is
        explained by kinetic molecular theory — particles hitting a smaller volume hit the walls more
        often, increasing pressure"). You need both: laws to predict, theories to understand.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Laboratory Safety Principles</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Chemistry lab work involves hazardous materials and equipment. Key safety principles that appear
        in the SC curriculum:
      </Typography>
      <GuideTable
        headers={['Safety principle', 'Details']}
        rows={[
          ['Personal protective equipment (PPE)', 'Safety goggles protect eyes from splashes; lab coats/aprons protect skin and clothing; gloves protect hands when handling corrosives or toxins'],
          ['Chemical disposal', 'Never pour chemicals down the drain without authorization; follow waste disposal protocols; acids and bases must be neutralized before disposal'],
          ['Fume hoods', 'Use when handling volatile, toxic, or flammable substances — the ventilation prevents inhalation of harmful vapors'],
          ['Fire safety', 'Know the location of fire extinguishers, fire blankets, and emergency showers; tie back hair and wear close-toed shoes; keep flammables away from heat sources'],
          ['Reading labels and SDS', 'Safety Data Sheets (SDS) provide hazard information, first aid measures, and proper handling for every chemical'],
          ['Never taste or smell directly', 'Waft vapors carefully toward you rather than inhaling directly from a container'],
        ]}
      />

      <Callout kind="watch-for">
        Diluting concentrated acid: always add acid to water, NEVER water to acid. When concentrated
        sulfuric acid (H₂SO₄) contacts water, a large amount of heat is released. Adding acid to water
        means the small amount of acid is immediately diluted and the heat is absorbed by the large
        amount of water — safe. Adding water to acid concentrates the released heat in a small volume
        and can cause spattering of acid — dangerous. The mnemonic: "Do as you oughter — add acid to water."
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Matter & Measurement
// ─────────────────────────────────────────────────────────────────────
function Section2Matter() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Classifying Matter</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        All matter is either a <strong>pure substance</strong> or a <strong>mixture</strong>. Pure substances
        have a definite, fixed composition. They are either <strong>elements</strong> (cannot be broken down
        by chemical means — e.g., gold Au, oxygen O₂) or <strong>compounds</strong> (two or more elements
        chemically combined in fixed ratios — e.g., water H₂O, table salt NaCl). Mixtures combine two or
        more pure substances without a fixed composition and can be separated by physical means.
      </Typography>

      <Analogy title="Classifying matter like sorting laundry">
        Imagine your laundry basket after a week. A white sock by itself is like a pure element — it's one type,
        nothing else mixed in. A fabric blend shirt (60% cotton, 40% polyester, always in that ratio) is like a
        compound — two materials chemically locked into a fixed proportion. A basket with socks, shirts, and jeans
        all thrown together is a mixture — you can sort them out physically. And if you tossed in a sand-and-glitter
        mix where the components clump separately, that's a heterogeneous mixture. If you dissolved salt in water
        so it looks uniform throughout, that's a homogeneous mixture (solution). Same principle — just at the
        molecular scale.
      </Analogy>

      <MermaidDiagram chart={`graph TD
  M["Matter"]
  M --> PS["Pure Substance\n(fixed composition)"]
  M --> MX["Mixture\n(variable composition, separable)"]
  PS --> EL["Element\n(one type of atom)\ne.g., Fe, O₂, Ne"]
  PS --> CO["Compound\n(two+ elements, fixed ratio)\ne.g., H₂O, NaCl, CO₂"]
  MX --> HO["Homogeneous (Solution)\n(uniform throughout)\ne.g., salt water, air"]
  MX --> HE["Heterogeneous\n(visibly non-uniform)\ne.g., sand & water, salad"]`} />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Physical vs. Chemical Properties and Changes</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>physical property</strong> can be observed or measured without changing the chemical identity
        of the substance: color, melting point, density, solubility, electrical conductivity. A <strong>chemical
        property</strong> describes how a substance reacts to form new substances: flammability, reactivity with
        acid, tendency to rust.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>physical change</strong> alters the form or appearance of matter but does not change its
        chemical composition: melting ice, tearing paper, dissolving sugar. A <strong>chemical change</strong>
        produces one or more new substances with different properties: burning wood, rusting iron, baking a cake,
        digesting food.
      </Typography>

      <Callout kind="watch-for">
        Dissolving looks like a chemical change because it seems to "disappear," but dissolving NaCl in water
        is a physical change — you can recover the salt by evaporation. Burning, however, is always chemical
        (new substances form). Key clues for chemical changes: color change that doesn't reverse, gas production,
        precipitate formation, significant heat/light released, or an odor produced.
      </Callout>

      <GuideTable
        headers={['Property/Change', 'Type', 'Examples', 'Is the substance different after?']}
        rows={[
          ['Color, density, melting point', 'Physical property', 'Ice is white; water density = 1.0 g/mL', 'No'],
          ['Flammability, reactivity', 'Chemical property', 'Gasoline is flammable; iron rusts', 'Not until it actually reacts'],
          ['Melting, dissolving, cutting', 'Physical change', 'Ice melts; sugar dissolves', 'No — same substance'],
          ['Burning, rusting, cooking', 'Chemical change', 'Wood + O₂ → CO₂ + H₂O + ash', 'Yes — new substance(s)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>SI Units and Metric Prefixes</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Science uses the International System of Units (SI), which is a standardized metric system. Every
        measurement has a number and a unit — without units, a number is meaningless. The seven SI base units
        cover all physical measurements, and prefixes let you express very large or very small quantities.
      </Typography>

      <GuideTable
        headers={['Quantity', 'SI Base Unit', 'Symbol', 'Common in chemistry?']}
        rows={[
          ['Length', 'Meter', 'm', 'Yes — bond lengths in pm, lab scale in cm/m'],
          ['Mass', 'Kilogram', 'kg', 'Yes — but grams (g) used most in lab'],
          ['Time', 'Second', 's', 'Yes — reaction rates, half-life'],
          ['Temperature', 'Kelvin', 'K', 'Yes — gas laws require Kelvin'],
          ['Amount of substance', 'Mole', 'mol', 'Yes — the most important unit in chemistry!'],
          ['Electric current', 'Ampere', 'A', 'Electrochemistry'],
          ['Luminous intensity', 'Candela', 'cd', 'Rarely in this course'],
        ]}
      />

      <GuideTable
        headers={['Prefix', 'Symbol', 'Multiplier', 'Example']}
        rows={[
          ['Giga-', 'G', '10⁹', '1 Gm = 10⁹ m'],
          ['Mega-', 'M', '10⁶', '1 MHz = 10⁶ Hz'],
          ['Kilo-', 'k', '10³', '1 kg = 1,000 g'],
          ['(Base unit)', '—', '10⁰ = 1', 'gram, meter, liter'],
          ['Deci-', 'd', '10⁻¹', '1 dL = 0.1 L'],
          ['Centi-', 'c', '10⁻²', '1 cm = 0.01 m'],
          ['Milli-', 'm', '10⁻³', '1 mL = 0.001 L'],
          ['Micro-', 'μ', '10⁻⁶', '1 μg = 10⁻⁶ g'],
          ['Nano-', 'n', '10⁻⁹', '1 nm = 10⁻⁹ m (atomic scale!)'],
          ['Pico-', 'p', '10⁻¹²', '1 pm = 10⁻¹² m (bond lengths)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Significant Figures</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Significant figures (sig figs) communicate the precision of a measurement. Every measured value has
        uncertainty, and sig figs tell the reader which digits are meaningful. The rules for identifying
        significant figures:
      </Typography>

      <Analogy title="Sig figs as precision tools — bathroom scale vs. analytical balance">
        A bathroom scale reads "165 lb" — three significant figures. If your friend steps on and reads "165 lb"
        too, you can't tell if they're 164.7 or 165.3 pounds. An analytical balance in a chemistry lab reads
        "74.8321 g" — six significant figures. That instrument is far more precise. When you record a measurement,
        sig figs are your honest declaration of how precise your instrument was. Reporting "74.8321 g" from a
        bathroom scale would be lying about your instrument's capability.
      </Analogy>

      <GuideTable
        headers={['Rule', 'Example', 'Sig Figs', 'Explanation']}
        rows={[
          ['All non-zero digits are significant', '4,527', '4', 'No zeros involved'],
          ['Zeros sandwiched between non-zeros: significant', '3,007', '4', 'The two zeros are "captive" — they must be there'],
          ['Trailing zeros WITH a decimal point: significant', '25.00', '4', 'The zeros tell us precision to the hundredths place'],
          ['Trailing zeros WITHOUT a decimal: ambiguous/not sig', '2,500', '2 (or 3 or 4?)', 'Write 2.500 × 10³ to remove ambiguity'],
          ['Leading zeros: NEVER significant', '0.0047', '2', 'The leading zeros just locate the decimal — they\'re placeholders'],
        ]}
      />

      <Callout kind="in-plain-words">
        The easiest way to count sig figs in a decimal number: start counting from the first non-zero digit
        and count every digit to the right (including trailing zeros after the decimal). For whole numbers
        without a decimal point, trailing zeros are ambiguous — use scientific notation to be unambiguous.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sig Figs in Calculations</Typography>
      <GuideTable
        headers={['Operation', 'Rule', 'Example']}
        rows={[
          ['Multiplication / Division', 'Answer has as many sig figs as the factor with the fewest', '4.52 × 1.3 = 5.9 (2 sig figs, limited by 1.3)'],
          ['Addition / Subtraction', 'Answer has as many decimal places as the addend with the fewest decimal places', '12.11 + 18.0 = 30.1 (limited by 18.0 — only 1 decimal place)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Scientific Notation</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Scientific notation expresses very large or very small numbers as M × 10ⁿ where 1 ≤ M &lt; 10.
        It also eliminates ambiguity about significant figures.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'602,200,000,000,000,000,000,000 = 6.022 × 10²³  (Avogadro\'s number, 4 sig figs)'}<br />
        {'0.000000000529 m = 5.29 × 10⁻¹⁰ m  (Bohr radius, 3 sig figs)'}<br />
        {'To multiply: (2.0 × 10³)(3.0 × 10⁴) = 6.0 × 10⁷'}<br />
        {'To divide: (8.4 × 10⁶)/(2.1 × 10²) = 4.0 × 10⁴'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Density</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Density relates mass to volume: <strong>d = m/V</strong>. Units are typically g/mL for liquids and
        solids, or g/L for gases. Density is an intensive property — it does not depend on how much of the
        substance you have (a small gold coin and a large gold bar have the same density: 19.3 g/mL).
        This makes density useful for identifying unknown substances.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: A 45.5 g sample occupies 17.2 mL. What is the density?'}<br />
        {'d = m/V = 45.5 g / 17.2 mL = 2.65 g/mL  (3 sig figs)'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Temperature Conversions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Three temperature scales appear in chemistry. <strong>Kelvin (K)</strong> is the SI unit and the
        only scale used in gas law and thermodynamics calculations because it starts at absolute zero —
        there are no negative Kelvin values.
      </Typography>
      <GuideTable
        headers={['Conversion', 'Formula', 'Example']}
        rows={[
          ['Celsius → Kelvin', 'K = °C + 273.15 (use 273 in most problems)', '25°C → 298 K'],
          ['Kelvin → Celsius', '°C = K − 273', '373 K → 100°C'],
          ['Celsius → Fahrenheit', '°F = (9/5)°C + 32', '100°C → 212°F'],
          ['Fahrenheit → Celsius', '°C = (5/9)(°F − 32)', '32°F → 0°C'],
        ]}
      />

      <Callout kind="try-this">
        A metal block has a mass of 128.4 g. When submerged in a graduated cylinder, the water level rises
        from 50.0 mL to 65.6 mL. What is the density of the metal, and what might it be?
        d = 128.4 g / (65.6 − 50.0) mL = 128.4 / 15.6 = 8.23 g/mL. That is close to the density of
        nickel (8.91 g/mL) or possibly cobalt (8.90 g/mL). Density is a fingerprint for matter.
      </Callout>

      <Callout kind="connect">
        Density explains why ice floats on water (ice is less dense: 0.917 g/mL vs. water's 1.00 g/mL),
        why oil and water separate in layers, and why a helium balloon rises. Every time you see objects
        floating or sinking, density is the explanation.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Accuracy vs. Precision</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        These two terms are often used interchangeably in everyday language, but they have precise meanings
        in science. <strong>Accuracy</strong> describes how close a measured value is to the true (accepted)
        value. <strong>Precision</strong> describes how close repeated measurements are to each other —
        reproducibility. A measurement can be precise without being accurate (all measurements cluster
        together but far from the true value — like a consistently miscalibrated scale). It can be accurate
        without being precise (average near the true value but individual measurements scattered). Good
        science requires both.
      </Typography>

      <GuideTable
        headers={['Scenario', 'Accurate?', 'Precise?', 'Analogy']}
        rows={[
          ['Darts all near bullseye, clustered together', 'Yes', 'Yes', 'Best case — consistent and correct'],
          ['Darts far from bullseye but tightly clustered', 'No', 'Yes', 'Systematic error — like a wind pushing all darts the same wrong way'],
          ['Darts near bullseye on average but scattered', 'Yes', 'No', 'Random error — good average, poor reproducibility'],
          ['Darts scattered everywhere, away from bullseye', 'No', 'No', 'Worst case — random and systematic errors both present'],
        ]}
      />

      <Callout kind="make-it-stick">
        When scientists report measurements, they use error analysis to quantify both accuracy (percent error:
        |experimental − accepted| / accepted × 100%) and precision (standard deviation of repeated measurements).
        A percent error below 5% is generally considered acceptable in a high school chemistry lab. Always
        report percent error when comparing your experimental result to a known accepted value.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Dimensional Analysis (Factor-Label Method)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Dimensional analysis is the systematic method of converting between units by multiplying by
        conversion factors. A conversion factor is a ratio equal to 1 (e.g., 100 cm / 1 m = 1 exactly).
        Units cancel just like algebraic variables — set up the problem so that unwanted units are in the
        denominator and wanted units are in the numerator.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Convert 55.0 miles/hour to meters/second:'}<br />
        {'55.0 mi  ×  1609 m  ×  1 hr  ×  1 min  =  24.6 m/s'}<br />
        {'  hr        1 mi      60 min   60 sec'}
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Dimensional analysis is essential throughout chemistry — unit conversions between metric prefixes,
        converting grams to moles, finding density when given mass and volume, and even multi-step
        stoichiometry problems are all applications of the same systematic cancellation method.
      </Typography>

      <Callout kind="try-this">
        A sample of copper has a volume of 3.50 cm³. Given that 1 cm³ = 1 mL and the density of copper
        is 8.96 g/mL, find the mass. Then convert that mass to kilograms. Step 1: m = dV = (8.96 g/mL)
        × 3.50 mL = 31.4 g. Step 2: 31.4 g × (1 kg / 1000 g) = 0.0314 kg. Always multiply by conversion
        factors — never divide by hand if you can avoid it, since setting up the factor-label method
        automatically tracks units.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Atomic Structure
// ─────────────────────────────────────────────────────────────────────
function Section3Atomic() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The History of the Atom</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Our modern model of the atom was built piece by piece over more than a century. Each scientist's
        experiment destroyed the previous model and replaced it with something better supported by evidence.
        Understanding this history helps you remember the model itself.
      </Typography>

      <GuideTable
        headers={['Scientist', 'Year', 'Experiment / Contribution', 'Model introduced']}
        rows={[
          ['John Dalton', '1803', 'Analyzed mass ratios in chemical reactions', 'Solid sphere — atom is the smallest indivisible particle; elements differ by atomic mass'],
          ['J.J. Thomson', '1897', 'Cathode ray tube — discovered the electron (negative particle)', '"Plum pudding" — negative electrons embedded in a positive cloud'],
          ['Ernest Rutherford', '1911', 'Gold foil experiment — most alpha particles passed through, a few deflected sharply', 'Nuclear model — tiny dense positive nucleus surrounded by mostly empty space'],
          ['Niels Bohr', '1913', 'Atomic emission spectra of hydrogen', 'Planetary model — electrons orbit nucleus in fixed energy levels (shells)'],
          ['Schrödinger/Heisenberg', '1920s', 'Quantum mechanics — wave functions and uncertainty principle', 'Quantum mechanical model — electrons exist in probability clouds called orbitals'],
        ]}
      />

      <Analogy title="The atom as a stadium">
        If the nucleus of an atom were the size of a marble sitting at the center of a football field,
        the nearest electrons would be buzzing around somewhere in the upper bleachers. The atom is
        overwhelmingly empty space. The nucleus contains essentially all the mass but occupies an almost
        impossibly tiny fraction of the atom's volume. This is what Rutherford's gold foil experiment proved:
        most alpha particles sailed straight through the "empty" gold atoms as if nothing were there,
        while the rare ones that aimed directly at a nucleus bounced back.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Subatomic Particles</Typography>

      <GuideTable
        headers={['Particle', 'Symbol', 'Charge', 'Mass (amu)', 'Location']}
        rows={[
          ['Proton', 'p⁺', '+1', '1.007', 'Inside the nucleus'],
          ['Neutron', 'n⁰', '0 (neutral)', '1.008', 'Inside the nucleus'],
          ['Electron', 'e⁻', '−1', '0.000549 (~1/1836 of proton)', 'Outside nucleus, in orbitals'],
        ]}
      />

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The <strong>atomic number (Z)</strong> = number of protons. It uniquely identifies the element and
        never changes (changing Z = changing the element). The <strong>mass number (A)</strong> = protons +
        neutrons. An atom in nuclear notation is written: ᴬ_Z X, e.g., ¹²_₆C means carbon-12 (Z=6, A=12,
        neutrons = 12 − 6 = 6). A neutral atom has equal protons and electrons.
      </Typography>

      <Callout kind="watch-for">
        Protons define the element. Neutrons change the isotope. Electrons change the charge (ion vs. neutral
        atom). Memorize this hierarchy: p⁺ → which element; n⁰ → which isotope; e⁻ → what charge (ion or not).
        On a test, if they tell you the element and the mass number, you can calculate neutrons: A − Z = neutrons.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Isotopes and Atomic Mass</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Isotopes</strong> are atoms of the same element (same Z) with different numbers of neutrons
        (different A). For example: carbon-12 (⁶ p, ⁶ n), carbon-13 (⁶ p, ⁷ n), carbon-14 (⁶ p, ⁸ n).
        All are carbon; all behave nearly identically chemically. Carbon-14 is radioactive and used for
        radiocarbon dating.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The <strong>atomic mass</strong> on the periodic table is the <em>weighted average</em> of all
        naturally occurring isotopes based on their percent abundances.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Chlorine: 75.77% ³⁵Cl (mass = 34.969) + 24.23% ³⁷Cl (mass = 36.966)'}<br />
        {'Atomic mass = (0.7577)(34.969) + (0.2423)(36.966)'}<br />
        {'           = 26.496 + 8.957 = 35.453 amu  ✓ (matches periodic table)'}
      </Box>

      <Callout kind="in-plain-words">
        The atomic mass on the periodic table is NOT a whole number because it's an average of isotopes.
        Chlorine is listed as 35.45 — there is no atom of chlorine with 35.45 neutrons. It's like saying
        "the average American family has 2.3 children" — no family actually has 2.3 children. The 35.45
        is the average over a huge sample of chlorine atoms weighted by abundance.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Electron Configuration</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In the quantum mechanical model, electrons occupy <strong>orbitals</strong> — regions of space where
        there is a high probability of finding the electron. Orbitals come in four types: <strong>s</strong>
        (spherical, holds 2 electrons), <strong>p</strong> (dumbbell-shaped, 3 orientations, holds 6),
        <strong>d</strong> (complex shapes, 5 orientations, holds 10), and <strong>f</strong> (even more
        complex, 7 orientations, holds 14).
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Three rules govern how electrons fill orbitals:
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li><strong>Aufbau Principle:</strong> Electrons fill the lowest available energy orbital first. The order is: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p… (follow the diagonal arrow diagram).</li>
        <li><strong>Pauli Exclusion Principle:</strong> No two electrons in an atom can have the same set of four quantum numbers. In practice: each orbital holds at most 2 electrons, and they must have opposite spins (one ↑, one ↓).</li>
        <li><strong>Hund's Rule:</strong> When filling orbitals of equal energy (like the three 2p orbitals), electrons spread out one per orbital before any orbital gets a second electron — and all single electrons in these orbitals have the same spin direction.</li>
      </Box>

      <Analogy title="Orbitals as apartment rooms">
        Think of each orbital as a room in an apartment building. The Pauli Exclusion Principle says each room
        holds at most 2 roommates, and they must sleep with their heads pointing in opposite directions (opposite
        spins). Hund's Rule says before you put two people in one room, you first put one person in every empty
        room on that floor — people prefer their own space if it's available. The Aufbau Principle says you fill
        the ground floor completely before moving to the second floor.
      </Analogy>

      <MermaidDiagram chart={`graph LR
  subgraph "Filling Order (Aufbau)"
    A["1s"] --> B["2s"] --> C["2p"] --> D["3s"] --> E["3p"] --> F["4s"] --> G["3d"] --> H["4p"] --> I["5s"] --> J["4d"] --> K["5p"]
  end
  subgraph "Capacity"
    S["s sublevel: 1 orbital → max 2 e⁻"]
    P["p sublevel: 3 orbitals → max 6 e⁻"]
    D2["d sublevel: 5 orbitals → max 10 e⁻"]
    F2["f sublevel: 7 orbitals → max 14 e⁻"]
  end`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Writing Electron Configurations</Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Carbon (Z=6, 6 electrons):  1s² 2s² 2p²'}<br />
        {'Chlorine (Z=17):            1s² 2s² 2p⁶ 3s² 3p⁵'}<br />
        {'Iron (Z=26):                1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶'}<br />
        {'Shorthand (noble gas core): Fe = [Ar] 4s² 3d⁶  (Ar ends at Z=18)'}
      </Box>

      <Callout kind="try-this">
        Write the electron configuration of phosphorus (Z=15) and identify how many valence electrons it has.
        Answer: 1s² 2s² 2p⁶ 3s² 3p³. The valence electrons are in the outermost shell (n=3): 3s² 3p³ = 5
        valence electrons. That is why phosphorus forms five bonds in many compounds (like PCl₅).
      </Callout>

      <Callout kind="connect">
        The number of valence electrons (electrons in the outermost shell) directly determines an element's
        chemical behavior. Elements in the same group of the periodic table have the same number of valence
        electrons — which is exactly why they behave similarly chemically. Electron configuration is the
        atomic-level explanation for all of the periodic table's patterns.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Ions: Atoms with a Charge</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A neutral atom has equal protons and electrons. When electrons are gained or lost, the atom becomes
        an <strong>ion</strong>. Losing electrons → fewer electrons than protons → net positive charge →
        <strong>cation</strong> (e.g., Na loses 1 e⁻ → Na⁺). Gaining electrons → more electrons than
        protons → net negative charge → <strong>anion</strong> (e.g., Cl gains 1 e⁻ → Cl⁻).
      </Typography>
      <GuideTable
        headers={['Element', 'Z (protons)', 'Neutral e⁻', 'Common Ion', 'Electrons in ion', 'Isoelectronic with']}
        rows={[
          ['Sodium (Na)', '11', '11', 'Na⁺', '10', 'Ne (Z=10)'],
          ['Magnesium (Mg)', '12', '12', 'Mg²⁺', '10', 'Ne (Z=10)'],
          ['Chlorine (Cl)', '17', '17', 'Cl⁻', '18', 'Ar (Z=18)'],
          ['Oxygen (O)', '8', '8', 'O²⁻', '10', 'Ne (Z=10)'],
          ['Aluminum (Al)', '13', '13', 'Al³⁺', '10', 'Ne (Z=10)'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Notice that when main-group metals lose their valence electrons, they end up with the same electron
        configuration as the preceding noble gas. When nonmetals gain electrons to fill their valence shell,
        they match the next noble gas. This explains why Na⁺ and Cl⁻ (and Ne) are all isoelectronic —
        they each have 10 electrons, but different numbers of protons give them different charges and sizes.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Electromagnetic Radiation and Atomic Spectra</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Bohr's model was proposed to explain a puzzling observation: when hydrogen gas is energized (by
        electricity or heat), it emits light only at very specific wavelengths — a <strong>line emission
        spectrum</strong> — not a continuous rainbow. Bohr explained this by proposing that electrons
        can only exist in discrete energy levels. When an electron in an excited (high-energy) state falls
        to a lower energy level, it emits a photon of light with energy equal to the difference between
        those levels: ΔE = hf (h = Planck's constant = 6.626 × 10⁻³⁴ J·s, f = frequency of light).
        Different energy drops → different frequencies → different colors. The visible lines of hydrogen
        are called the <strong>Balmer series</strong> (electron falls to n=2 from n=3, 4, 5, 6).
      </Typography>

      <Callout kind="why-it-matters">
        Atomic emission spectra are the fingerprints of elements. Each element emits a unique set of
        wavelengths, allowing astronomers to identify the chemical composition of stars millions of
        light-years away without ever visiting them. Astronomers identified helium in the Sun's spectrum
        in 1868 — 27 years before helium was isolated on Earth. The same spectroscopic technique is used
        in forensics, environmental monitoring, and analytical chemistry labs today.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Quantum Numbers</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Each electron in an atom is fully described by four quantum numbers that specify its energy level,
        sublevel, orbital orientation, and spin:
      </Typography>
      <GuideTable
        headers={['Quantum Number', 'Symbol', 'Values', 'What it describes']}
        rows={[
          ['Principal', 'n', '1, 2, 3, 4, … (positive integers)', 'Energy level (shell); larger n = farther from nucleus = higher energy'],
          ['Angular momentum (sublevel)', 'l', '0 to n−1', 'Sublevel: l=0 (s), l=1 (p), l=2 (d), l=3 (f)'],
          ['Magnetic (orbital)', 'mₗ', '−l to +l (integers)', 'Specific orbital orientation within a sublevel; there are (2l+1) orbitals per sublevel'],
          ['Spin', 'mₛ', '+½ or −½ only', 'Electron spin direction: +½ = "spin up" (↑), −½ = "spin down" (↓)'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The Pauli Exclusion Principle states that no two electrons in an atom can have the same set of
        all four quantum numbers. Since mₛ can only be +½ or −½, each orbital (defined by n, l, mₗ)
        can hold at most 2 electrons — one spin-up and one spin-down. This is why each orbital has a
        capacity of exactly 2.
      </Typography>

      <Callout kind="watch-for">
        A common error: students write electron configurations for ions without adjusting the electron count.
        For Fe²⁺, start with Fe (1s²2s²2p⁶3s²3p⁶4s²3d⁶) and remove 2 electrons. But which ones?
        For transition metals, always remove from the 4s orbital first (the highest principal quantum number),
        not from the 3d, even though 4s filled before 3d during configuration. Fe²⁺: [Ar] 3d⁶ (not [Ar] 4s²3d⁴).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Nuclear Chemistry</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Nuclear reactions involve changes to the nucleus itself — unlike chemical reactions, which only
        involve the rearrangement of electrons. Nuclear reactions release enormous amounts of energy
        (from Einstein's E = mc²: even tiny mass changes correspond to huge energy). Three main types
        of natural radioactive decay:
      </Typography>
      <GuideTable
        headers={['Radiation type', 'Symbol', 'Composition', 'Penetrating power', 'Stopped by']}
        rows={[
          ['Alpha (α)', 'α or ⁴₂He', '2 protons + 2 neutrons (helium-4 nucleus)', 'Lowest', 'Paper, dead skin cells'],
          ['Beta (β)', 'β or ⁰₋₁e', 'High-speed electron emitted from nucleus (neutron → proton + electron)', 'Moderate', 'Aluminum sheet'],
          ['Gamma (γ)', 'γ', 'High-energy electromagnetic radiation (photon)', 'Highest — very penetrating', 'Lead, thick concrete'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In alpha decay, the parent nucleus loses an alpha particle: mass number decreases by 4,
        atomic number decreases by 2. In beta decay, a neutron converts to a proton and an electron:
        mass number unchanged, atomic number increases by 1.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Alpha decay: ²³⁸₉₂U → ⁴₂He + ²³⁴₉₀Th'}<br />
        {'(U: A=238,Z=92 → alpha: A=4,Z=2 + Th: A=234,Z=90)'}<br />
        {'Beta decay: ¹⁴₆C → ⁰₋₁e + ¹⁴₇N'}<br />
        {'(C: A=14,Z=6 → beta: A=0,Z=−1 + N: A=14,Z=7)'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Half-Life</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The <strong>half-life (t₁/₂)</strong> is the time required for half of a sample of a radioactive
        isotope to decay. After n half-lives, the fraction remaining is (1/2)ⁿ.
        Amount remaining = original amount × (1/2)^(t / t₁/₂).
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Carbon-14 has t₁/₂ = 5,730 years.'}<br />
        {'After 17,190 years (3 half-lives):'}<br />
        {'Fraction remaining = (1/2)³ = 1/8 = 12.5% of original sample'}
      </Box>

      <Callout kind="why-it-matters">
        Half-life is the foundation of radiocarbon dating (¹⁴C, t₁/₂ = 5,730 yr — useful for organic
        materials up to about 50,000 years old), uranium-lead dating (²³⁸U, t₁/₂ = 4.47 billion years —
        used to date rocks and the age of the Earth), and medical imaging (technetium-99m, t₁/₂ = 6 hours
        — long enough for imaging, short enough to minimize radiation dose to patients). Half-life also
        determines how long nuclear waste remains hazardous — some isotopes have half-lives of thousands
        of years, creating difficult long-term storage challenges.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 4: The Periodic Table
// ─────────────────────────────────────────────────────────────────────
function Section4Periodic() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Organization of the Periodic Table</Typography>

      <Analogy title="The periodic table as an apartment building">
        Picture a tall apartment building. The floors are the <strong>periods</strong> (horizontal rows) —
        floor 1 has only 2 apartments (2 elements), floor 2 has 8, floor 3 has 8, and the higher floors have
        18 or more. Each column is a <strong>group</strong> (vertical family) — everyone in the same column has
        the same number of windows facing the street (valence electrons), so they all have the same style of
        interacting with the outside world (chemical behavior). Families share traits. The Alkali Metals (column 1)
        are the ones who always leave their front door unlocked — they give away an electron instantly to anyone.
        The Noble Gases (column 18) are the recluses who never interact with anyone.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The periodic table has 118 confirmed elements arranged in order of increasing <strong>atomic number (Z)</strong>.
        <strong>Periods</strong> are horizontal rows (Period 1 has 2 elements; Period 2 has 8; Period 3 has 8;
        Periods 4 and 5 have 18; Periods 6 and 7 have 32). <strong>Groups</strong> (or families) are vertical
        columns numbered 1–18 (or by the older VIIIA, IA, IIA system). Elements in the same group have the
        same number of valence electrons and similar chemical properties.
      </Typography>

      <GuideTable
        headers={['Group / Family', 'Name', 'Valence Electrons', 'Key Properties']}
        rows={[
          ['Group 1', 'Alkali Metals', '1', 'Soft, very reactive, form +1 ions, react violently with water'],
          ['Group 2', 'Alkaline Earth Metals', '2', 'Harder than Group 1, reactive, form +2 ions'],
          ['Groups 3–12', 'Transition Metals', '1–2 (in d orbitals)', 'Hard, high melting points, often colored ions, multiple oxidation states'],
          ['Group 17', 'Halogens', '7', 'Very reactive nonmetals, form −1 ions, exist as diatomic molecules (F₂, Cl₂, Br₂, I₂)'],
          ['Group 18', 'Noble Gases', '8 (He has 2)', 'Full valence shells — almost no reactivity, exist as monatomic gases'],
          ['Staircase (B, Si, Ge, As, Sb, Te, At)', 'Metalloids / Semimetals', 'Varies', 'Intermediate properties — semiconductors, used in electronics'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Periodic Trends</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Periodic trends are predictable patterns in element properties that arise from the changing number of
        protons (nuclear charge) and the number of electron shells (shielding). Two competing forces drive
        most trends: <strong>effective nuclear charge (Zeff)</strong> — the net positive pull felt by valence
        electrons after inner electrons shield them — and <strong>atomic radius</strong> (how far out the
        valence electrons are from the nucleus).
      </Typography>

      <Analogy title="Periodic trends as a tug-of-war">
        Imagine the nucleus pulling electrons toward it (nuclear charge = the team pulling one way) and the
        inner-shell electrons pushing the valence electrons out and shielding them from the nucleus (like
        the opposing team). As you go across a period from left to right, the nuclear charge team gets
        stronger (more protons added) but the shielding team barely changes (electrons are added to the
        same shell, which shields poorly). Nuclear charge wins — electrons get pulled in closer, atomic
        radius shrinks. As you go down a group, new floors of electrons are added below the valence shell —
        more shielding — so the nucleus can't grip as tightly, and atoms get bigger.
      </Analogy>

      <MermaidDiagram chart={`graph TB
  subgraph "Atomic Radius"
    AR1["Increases DOWN a group\n(more electron shells → bigger)"]
    AR2["Decreases ACROSS a period →\n(more protons pull electrons in)"]
  end
  subgraph "Ionization Energy (energy to remove 1 e⁻)"
    IE1["Decreases DOWN a group\n(easier to remove outer e⁻ farther out)"]
    IE2["Increases ACROSS a period →\n(harder to remove e⁻ held tighter)"]
  end
  subgraph "Electronegativity (Pauling scale)"
    EN1["Decreases DOWN a group\n(valence e⁻ farther from nucleus)"]
    EN2["Increases ACROSS a period →\n(F = 4.0, highest of all)"]
  end`} />

      <GuideTable
        headers={['Trend', 'Across a Period (left → right)', 'Down a Group (top → bottom)', 'Explanation']}
        rows={[
          ['Atomic Radius', 'Decreases', 'Increases', 'More protons pull e⁻ in across; more shells push e⁻ out going down'],
          ['Ionization Energy (IE₁)', 'Increases', 'Decreases', 'Opposite of radius — small atoms hold their e⁻ tighter'],
          ['Electronegativity (EN)', 'Increases (F = 4.0, highest)', 'Decreases', 'Atoms that are small and have many protons attract shared e⁻ most strongly'],
          ['Electron Affinity', 'Generally increases', 'Generally decreases', 'Halogens have very high EA — they "want" one more e⁻ to complete their octet'],
          ['Metallic character', 'Decreases', 'Increases', 'Metals on left/bottom, nonmetals on upper right'],
        ]}
      />

      <Callout kind="watch-for">
        Exceptions to ionization energy trend: IE₁ of boron (Group 13) is slightly LOWER than beryllium
        (Group 2) because boron's outer electron is in a 2p orbital (higher energy, easier to remove) vs.
        beryllium's 2s. Similarly, oxygen has lower IE₁ than nitrogen because removing one electron from
        oxygen relieves electron-electron repulsion in a paired 2p orbital. These two exceptions appear
        on tests more often than any other trend anomaly.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Reactivity Trends</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Metals become MORE reactive going down the group</strong> — lower ionization energy means
        it is easier to lose electrons (which is what metals do when they react). Cesium and francium at
        the bottom of Group 1 are the most reactive metals on Earth — they explode in contact with water.
        <strong>Nonmetals become MORE reactive going UP the group</strong> — higher electronegativity and
        electron affinity mean they attract electrons more strongly. Fluorine (top of Group 17) is the most
        reactive nonmetal, reacting with almost everything including glass and noble gases.
      </Typography>

      <Callout kind="make-it-stick">
        A powerful memory device for all four main trends: atomic radius is the "anchor" trend. All the
        other major trends (IE, EN, electron affinity) are essentially OPPOSITE to atomic radius. Smaller
        atom = higher IE, higher EN, higher electron affinity. Larger atom = lower IE, lower EN, lower
        electron affinity. Once you know which direction radius goes, you know them all.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Ion Size: Cations vs. Anions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When a metal atom loses electrons to become a cation, it loses its entire outermost shell.
        The result is a dramatically smaller ion: Na (atomic radius ≈ 186 pm) → Na⁺ (radius ≈ 102 pm).
        The remaining electrons are now in lower shells, and the same nuclear charge (11 protons) pulls
        fewer electrons more tightly. Conversely, when a nonmetal gains electrons to become an anion,
        the extra electrons increase electron-electron repulsion without adding protons, so the electron
        cloud expands. Cl (atomic radius ≈ 99 pm) → Cl⁻ (radius ≈ 181 pm). In isoelectronic series
        (same number of electrons), more protons = smaller radius: O²⁻ &gt; F⁻ &gt; Ne &gt; Na⁺ &gt; Mg²⁺
        (all have 10 electrons, but increasing protons from 8 to 12 pull the same electrons closer).
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Successive Ionization Energies</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Every element has multiple ionization energies: IE₁ (remove the first electron), IE₂ (remove the
        second from the resulting cation), and so on. Successive IEs always increase (harder to remove each
        electron from an increasingly positive ion). However, there is a dramatic jump when you try to remove
        a core electron (an electron from a completed inner shell). This jump reveals the element's group:
        sodium shows a large jump between IE₁ and IE₂ (it has 1 valence electron — group 1); magnesium
        shows its jump between IE₂ and IE₃ (2 valence electrons — group 2). This is one way to identify
        group number from ionization energy data.
      </Typography>

      <GuideTable
        headers={['Element', 'IE₁ (kJ/mol)', 'IE₂ (kJ/mol)', 'IE₃ (kJ/mol)', 'Group (big jump before which IE?)']}
        rows={[
          ['Na', '496', '4,562 (big jump!)', '6,912', 'Group 1 — big jump between IE₁ and IE₂'],
          ['Mg', '738', '1,451', '7,733 (big jump!)', 'Group 2 — big jump between IE₂ and IE₃'],
          ['Al', '577', '1,817', '2,745', 'Big jump between IE₃ and IE₄ (group 13)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Naming Ionic Compounds</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Naming ionic compounds follows predictable rules: (1) name the cation first, then the anion;
        (2) for monatomic cations with fixed charges (Groups 1, 2, Al, Zn), just use the element name;
        (3) for transition metals with variable charges, use Roman numerals: Fe²⁺ = iron(II), Fe³⁺ = iron(III);
        (4) monatomic anions end in -ide; (5) polyatomic anions have special names to memorize.
      </Typography>
      <GuideTable
        headers={['Formula', 'Cation', 'Anion', 'Name']}
        rows={[
          ['NaCl', 'Na⁺ (sodium)', 'Cl⁻ (chloride)', 'Sodium chloride'],
          ['MgO', 'Mg²⁺ (magnesium)', 'O²⁻ (oxide)', 'Magnesium oxide'],
          ['FeCl₃', 'Fe³⁺ (iron(III))', 'Cl⁻ (chloride)', 'Iron(III) chloride'],
          ['CuSO₄', 'Cu²⁺ (copper(II))', 'SO₄²⁻ (sulfate)', 'Copper(II) sulfate'],
          ['Ca(NO₃)₂', 'Ca²⁺ (calcium)', 'NO₃⁻ (nitrate)', 'Calcium nitrate'],
          ['NH₄Cl', 'NH₄⁺ (ammonium)', 'Cl⁻ (chloride)', 'Ammonium chloride'],
        ]}
      />

      <Callout kind="try-this">
        Practice the periodic table trends by picturing them as a map. Atomic radius: starts large in the
        bottom-left (Cs, Fr, Rb) and shrinks toward the top-right (He, F, Ne). Electronegativity: starts
        highest at top-right (F = 4.0) and decreases toward bottom-left. The two trends are mirror images.
        Ionization energy mirrors electronegativity almost exactly. If you can visualize these gradient maps,
        you'll be able to answer any trend comparison question without memorizing individual values.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Common Polyatomic Ions to Memorize</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Polyatomic ions are groups of covalently bonded atoms that carry a net charge. They behave as a
        single unit in ionic compounds. These are the most commonly encountered polyatomic ions in
        SC Chemistry:
      </Typography>
      <GuideTable
        headers={['Name', 'Formula', 'Charge', 'Memory tip']}
        rows={[
          ['Ammonium', 'NH₄⁺', '+1', 'Only common positive polyatomic ion'],
          ['Hydroxide', 'OH⁻', '−1', 'Bases often release OH⁻'],
          ['Nitrate', 'NO₃⁻', '−1', 'N + 3 oxygens → −1'],
          ['Nitrite', 'NO₂⁻', '−1', 'Less oxygens than nitrate → -ite suffix'],
          ['Sulfate', 'SO₄²⁻', '−2', 'S + 4 oxygens → −2'],
          ['Sulfite', 'SO₃²⁻', '−2', 'Less oxygens than sulfate → -ite'],
          ['Phosphate', 'PO₄³⁻', '−3', 'P + 4 oxygens → −3'],
          ['Carbonate', 'CO₃²⁻', '−2', 'C + 3 oxygens → −2'],
          ['Bicarbonate (hydrogen carbonate)', 'HCO₃⁻', '−1', 'Carbonate that gained H⁺'],
          ['Acetate', 'CH₃COO⁻ (or C₂H₃O₂⁻)', '−1', 'Vinegar ion — CH₃COOH (acetic acid) loses H⁺'],
          ['Permanganate', 'MnO₄⁻', '−1', 'Deep purple color — used in oxidation reactions'],
          ['Dichromate', 'Cr₂O₇²⁻', '−2', 'Orange — used in oxidation reactions'],
          ['Chlorate', 'ClO₃⁻', '−1', 'Cl + 3 oxygens'],
          ['Perchlorate', 'ClO₄⁻', '−1', 'Cl + 4 oxygens — per- means one more than -ate'],
        ]}
      />

      <Callout kind="make-it-stick">
        A reliable pattern for oxyanions: the -ate form always has more oxygens than the -ite form
        (both have the same charge). The per- prefix means one oxygen more than -ate. The hypo- prefix
        means one oxygen less than -ite. For chlorine: hypochlorite (ClO⁻), chlorite (ClO₂⁻),
        chlorate (ClO₃⁻), perchlorate (ClO₄⁻). This pattern repeats for sulfur, nitrogen, bromine, and iodine.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Writing Chemical Formulas for Ionic Compounds</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        To write the formula of an ionic compound: (1) write the cation first, then the anion;
        (2) the compound must be electrically neutral — the total positive charge must equal the total
        negative charge; (3) use subscripts to balance charges. The "criss-cross method" is a shortcut:
        the charge number of each ion becomes the subscript of the other ion (then simplify if possible).
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: aluminum (Al³⁺) and sulfate (SO₄²⁻)'}<br />
        {'Criss-cross: Al subscript = 2 (from SO₄²⁻ charge); SO₄ subscript = 3 (from Al³⁺ charge)'}<br />
        {'Formula: Al₂(SO₄)₃'}<br />
        {'Check: 2×(+3) + 3×(−2) = +6 − 6 = 0  ✓ neutral'}<br />
        {''}<br />
        {'Do NOT criss-cross if the ratio simplifies:'}<br />
        {'Mg²⁺ and O²⁻ → criss-cross gives Mg₂O₂, but simplify to MgO'}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Chemical Bonding
// ─────────────────────────────────────────────────────────────────────
function Section5Bonding() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Why Do Atoms Bond?</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Atoms bond to achieve a lower energy, more stable state. For most elements, stability means having
        a full outer shell — 8 electrons for main-group elements (the <strong>octet rule</strong>), 2 for
        hydrogen and helium. Noble gases are already stable — they essentially never bond. Every other
        element bonds to achieve that full-shell configuration.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Determining Bond Type from Electronegativity</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The type of bond between two atoms is determined by the <strong>electronegativity difference (ΔEN)</strong>
        between them. Electronegativity measures how strongly an atom attracts shared electrons toward itself.
      </Typography>

      <GuideTable
        headers={['ΔEN Range', 'Bond Type', 'What happens to electrons', 'Example']}
        rows={[
          ['0 to <0.4', 'Nonpolar covalent', 'Shared equally — electron cloud centered between atoms', 'H₂ (0.0), Cl₂ (0.0), CH₄ (0.4)'],
          ['0.4 to 1.7', 'Polar covalent', 'Shared unequally — electron cloud shifted toward more EN atom', 'H₂O (1.4), HCl (0.9), NH₃ (0.9)'],
          ['>1.7', 'Ionic', 'Electron(s) transferred completely from metal to nonmetal', 'NaCl (2.1), MgO (2.3), CaF₂ (3.0)'],
        ]}
      />

      <Analogy title="Ionic bonding: giving away the car keys">
        Imagine sodium (Na) and chlorine (Cl) as two people. Sodium barely holds onto its one valence
        electron — ionization energy is low (it's easy to take). Chlorine desperately wants one more
        electron to complete its octet — electron affinity is high. So sodium effectively hands its
        car keys (electron) to chlorine. Now sodium is Na⁺ (lost a negative charge → positive ion) and
        chlorine is Cl⁻ (gained a negative charge → negative ion). Opposite charges attract strongly —
        that attraction is the ionic bond. The "car keys" don't go back. The transfer is permanent.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Ionic Bonds</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Ionic bonds form between a metal and a nonmetal through complete electron transfer. The resulting
        ions are attracted by electrostatic force and arrange into a 3D <strong>crystal lattice</strong>
        — an orderly, repeating structure. Properties of ionic compounds: high melting points (strong
        lattice energy), brittle (displacing a layer causes like-charges to align and repel), conduct
        electricity when dissolved or melted (free ions carry charge), but not when solid (ions are
        locked in place).
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Covalent Bonds</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Covalent bonds form between two nonmetals through electron sharing. Atoms each contribute one
        electron to a shared pair. A single bond shares one pair (2 electrons), a double bond shares
        two pairs (4 electrons), and a triple bond shares three pairs (6 electrons). Double and triple
        bonds are shorter and stronger than single bonds.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Lewis Dot Structures</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A Lewis structure shows all valence electrons in a molecule — both bonding pairs (shared) and
        lone pairs (non-bonding). Steps to draw a Lewis structure:
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>Count total valence electrons (add all valence electrons from each atom; add 1 for each negative charge; subtract 1 for each positive charge)</li>
        <li>Connect all atoms with single bonds (each uses 2 electrons)</li>
        <li>Place remaining electrons as lone pairs on outer atoms to complete their octets first</li>
        <li>Place any remaining electrons on the central atom</li>
        <li>If the central atom still needs electrons, convert lone pairs on outer atoms to double or triple bonds</li>
        <li>Check: all octets satisfied (except H = 2, and expanded octets for Period 3+ elements like S, P, Cl)</li>
      </Box>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'CO₂: valence electrons = 4 (C) + 6(O)×2 = 16 e⁻'}<br />
        {'Single bond structure:  O−C−O  uses 4 e⁻, leaves 12'}<br />
        {'Complete octets on O:   :Ö−C−Ö: (C still needs 4 more!)'}<br />
        {'Convert lone pairs → double bonds: O=C=O  ✓ all octets satisfied'}
      </Box>

      <Callout kind="watch-for">
        Exceptions to the octet rule: (1) Hydrogen — always gets exactly 2 electrons, never 8.
        (2) Boron — commonly forms compounds with only 6 electrons (e.g., BF₃ — it's stable but electron-deficient).
        (3) Expanded octets — Period 3 and beyond elements (P, S, Cl, Br) can hold more than 8 electrons
        because they have available d orbitals. PCl₅ has 10 electrons around P; SF₆ has 12 around S.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Naming Covalent Compounds</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Covalent (molecular) compounds between nonmetals are named with Greek prefixes to indicate the
        number of each atom. The second element always ends in -ide.
      </Typography>
      <GuideTable
        headers={['Prefix', 'Number', 'Example formula', 'Name']}
        rows={[
          ['Mono-', '1', 'CO', 'Carbon monoxide'],
          ['Di-', '2', 'CO₂', 'Carbon dioxide'],
          ['Tri-', '3', 'SO₃', 'Sulfur trioxide'],
          ['Tetra-', '4', 'CCl₄', 'Carbon tetrachloride'],
          ['Penta-', '5', 'PCl₅', 'Phosphorus pentachloride'],
          ['Hexa-', '6', 'SF₆', 'Sulfur hexafluoride'],
          ['Hepta-', '7', 'N₂O₇', 'Dinitrogen heptoxide'],
        ]}
      />
      <Callout kind="in-plain-words">
        The prefix mono- is typically omitted for the first element (we say "carbon dioxide," not
        "monocarbon dioxide") but is kept for the second element (carbon monoxide, not "carbon oxide").
        This is just a historical naming convention — don't overthink it. Whenever you see a compound
        between two nonmetals, reach for the Greek prefix system.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>VSEPR Theory and Molecular Geometry</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        VSEPR (Valence Shell Electron Pair Repulsion) predicts the 3D shape of a molecule based on the
        principle that electron pairs — whether bonding or lone — repel each other and spread as far apart
        as possible. Lone pairs take up more space than bonding pairs, compressing bond angles.
      </Typography>

      <Analogy title="VSEPR as balloons tied together">
        Tie several balloons to the same point and release them. They spread apart as far as possible to
        minimize contact. Two balloons point 180° apart (linear). Three balloons spread to 120° (trigonal
        planar). Four balloons arrange in a tetrahedron at 109.5°. These are the electron-group geometries.
        If one of those "balloons" is a lone pair (invisible in the molecular geometry), it pushes the
        bonding pairs closer together, shrinking the bond angle.
      </Analogy>

      <GuideTable
        headers={['Bonding pairs', 'Lone pairs', 'Electron geometry', 'Molecular geometry', 'Bond angle', 'Example']}
        rows={[
          ['2', '0', 'Linear', 'Linear', '180°', 'CO₂, BeCl₂'],
          ['3', '0', 'Trigonal planar', 'Trigonal planar', '120°', 'BF₃, SO₃'],
          ['2', '1', 'Trigonal planar', 'Bent', '<120°', 'SO₂'],
          ['4', '0', 'Tetrahedral', 'Tetrahedral', '109.5°', 'CH₄, CCl₄'],
          ['3', '1', 'Tetrahedral', 'Trigonal pyramidal', '<109.5°', 'NH₃'],
          ['2', '2', 'Tetrahedral', 'Bent', '<109.5°', 'H₂O (104.5°)'],
          ['5', '0', 'Trigonal bipyramidal', 'Trigonal bipyramidal', '90°/120°', 'PCl₅'],
          ['6', '0', 'Octahedral', 'Octahedral', '90°', 'SF₆'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  Q1["What is the electronegativity\ndifference (ΔEN)?"]
  Q1 -->|"ΔEN < 0.4"| NPC["Nonpolar Covalent\n(e.g., H₂, Cl₂, N₂)"]
  Q1 -->|"0.4 ≤ ΔEN ≤ 1.7"| PC["Polar Covalent\n(e.g., HCl, H₂O, NH₃)"]
  Q1 -->|"ΔEN > 1.7"| ION["Ionic\n(e.g., NaCl, MgO)"]
  PC --> Q2["Is the molecule symmetric?"]
  Q2 -->|"Yes → dipoles cancel"| NPM["Nonpolar molecule\n(e.g., CO₂, CCl₄)"]
  Q2 -->|"No → dipoles don't cancel"| PM["Polar molecule\n(e.g., H₂O, NH₃)"]`} />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Intermolecular Forces (IMFs)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        IMFs are the attractions between molecules (not within them — those are intramolecular bonds).
        IMFs determine physical properties: boiling point, melting point, vapor pressure, surface tension,
        and viscosity. Stronger IMFs → higher boiling point.
      </Typography>
      <GuideTable
        headers={['IMF', 'Strength', 'Present in', 'Boiling point effect']}
        rows={[
          ['London Dispersion Forces (LDF)', 'Weakest (but always present)', 'ALL molecules — even nonpolar ones; increases with molar mass', 'Low for small nonpolar molecules; higher for large ones (octane vs. methane)'],
          ['Dipole–Dipole', 'Moderate', 'Polar molecules (with permanent dipoles)', 'Higher BP than nonpolar molecules of similar mass'],
          ['Hydrogen Bonding (H-bond)', 'Strongest', 'Molecules with N–H, O–H, or F–H bonds', 'Dramatically higher BP — explains why water (18 g/mol) boils at 100°C while H₂S (34 g/mol) boils at −60°C'],
        ]}
      />

      <Callout kind="connect">
        The reason water is so uniquely suited to support life is primarily hydrogen bonding. Water has
        an unusually high boiling point, high heat capacity, high surface tension, and can dissolve
        polar and ionic substances — all because of the strong network of hydrogen bonds between H₂O
        molecules. Hydrogen bonding is also why DNA's double helix holds together (H-bonds between
        complementary base pairs) while still being able to unzip for replication.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Metallic Bonding</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In metals, valence electrons are not held by any one atom — they are delocalized and free to move
        throughout the entire metallic lattice. Picture metal cations (positive ions) arranged in an ordered
        structure, with a "sea of electrons" flowing freely around and through them. This model explains
        all the characteristic properties of metals: electrical conductivity (free electrons carry charge),
        thermal conductivity (free electrons transfer kinetic energy), malleability and ductility (layers of
        metal ions can slide past each other without breaking the bond — the electron sea just flows around
        them), and luster (free electrons absorb and re-emit light efficiently).
      </Typography>

      <Callout kind="in-plain-words">
        The key difference between ionic, covalent, and metallic bonding comes down to what happens to
        electrons: ionic bonds TRANSFER electrons (one atom gives, one receives); covalent bonds SHARE
        electrons (both atoms hold on, together); metallic bonds DELOCALIZE electrons (electrons belong
        to everyone — the whole structure shares them collectively). This explains why metals conduct
        electricity (delocalized electrons flow freely) while ionic compounds only conduct when dissolved
        or melted (ions must be free to move) and most covalent compounds don't conduct at all (no free
        charges).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Resonance Structures</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Sometimes a molecule cannot be accurately represented by a single Lewis structure. When two or more
        valid Lewis structures differ only in the placement of electrons (not atoms), they are called
        <strong> resonance structures</strong>. The actual molecule is a hybrid of all contributing structures —
        the real bond is intermediate between the structures shown.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Ozone (O₃): two resonance structures'}<br />
        {'Structure 1: O=O−O:  (double bond on left, single on right)'}<br />
        {'Structure 2: :O−O=O  (single bond on left, double on right)'}<br />
        {'Reality: both O−O bonds are equivalent, bond order = 1.5 (intermediate between single and double)'}
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Other important examples of resonance: benzene (C₆H₆), where the six C–C bonds alternate double
        and single in each structure but are actually all equivalent with bond order 1.5; nitrate ion
        (NO₃⁻), with three equivalent N–O bonds; and carbonate ion (CO₃²⁻). Resonance stabilizes
        molecules — having electrons delocalized over more atoms lowers the overall energy.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Formal Charge</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Formal charge helps identify the best Lewis structure when multiple arrangements are possible.
        <strong> Formal charge = (valence electrons) − (non-bonding electrons) − ½(bonding electrons)</strong>.
        The best Lewis structure minimizes formal charges overall and places any negative formal charge
        on the most electronegative atom.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'CO₂ (O=C=O): formal charge on C = 4 − 0 − ½(8) = 0  ✓'}<br />
        {'             formal charge on each O = 6 − 4 − ½(4) = 0  ✓'}<br />
        {'All formal charges = 0 → this is the best structure'}
      </Box>

      <GuideTable
        headers={['Bond', 'Bond Order', 'Relative Length', 'Relative Strength (energy to break)']}
        rows={[
          ['C–C single bond', '1', 'Longest', 'Weakest (~347 kJ/mol)'],
          ['C=C double bond', '2', 'Medium', 'Intermediate (~614 kJ/mol)'],
          ['C≡C triple bond', '3', 'Shortest', 'Strongest (~839 kJ/mol)'],
        ]}
      />

      <Callout kind="make-it-stick">
        Triple bonds are shorter and stronger than double bonds, which are shorter and stronger than single
        bonds. This makes intuitive sense: sharing more electrons pulls the nuclei closer together (shorter)
        and requires more energy to pull them apart (stronger). Bond length and bond energy are inversely
        related: shorter = stronger. This rule holds within the same type of bond (C–C vs C=C vs C≡C) but
        NOT between different elements (C–F is shorter AND stronger than C–I despite both being single bonds —
        F is simply a smaller, more electronegative atom).
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Stoichiometry
// ─────────────────────────────────────────────────────────────────────
function Section6Stoichiometry() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The Mole: Chemistry's Counting Unit</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Atoms and molecules are impossibly small — a single carbon atom has a mass of about
        2 × 10⁻²³ grams. To work with chemically useful amounts, chemists use the <strong>mole</strong>.
        One mole = <strong>6.022 × 10²³</strong> particles (Avogadro's number, Nₐ). This is the number
        of atoms in exactly 12 grams of carbon-12 — it was chosen so that the molar mass in grams
        equals the atomic mass in amu. Molar mass = g/mol, read directly from the periodic table.
      </Typography>

      <Analogy title="Stoichiometry as following a recipe">
        A recipe for pancakes might call for 2 cups flour, 1 cup milk, and 1 egg. You can't make pancakes
        with just one ingredient — you need all three in the right ratio. If you have 4 cups of flour,
        you'll use 2 cups milk and 2 eggs and get two batches. Stoichiometry is exactly this: a balanced
        chemical equation is the recipe, mole ratios are the ingredient ratios, and the "cups" are moles.
        The only trick is that you have to convert grams → moles first (using molar mass as the conversion
        factor), then apply the recipe ratio, then convert back if needed.
      </Analogy>

      <GuideTable
        headers={['Conversion', 'Multiply by (conversion factor)', 'Example']}
        rows={[
          ['grams → moles', '1 mol / molar mass (g/mol)', '36.0 g H₂O × (1 mol / 18.02 g) = 1.998 mol ≈ 2.00 mol'],
          ['moles → grams', 'molar mass (g/mol) / 1 mol', '2.50 mol NaCl × (58.44 g/mol) = 146 g'],
          ['moles → particles', '6.022×10²³ particles / 1 mol', '0.500 mol × 6.022×10²³ = 3.01×10²³ molecules'],
          ['particles → moles', '1 mol / 6.022×10²³', '1.20×10²⁴ atoms × (1 mol / 6.022×10²³) = 1.99 mol'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Balanced Chemical Equations</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A balanced chemical equation obeys the <strong>Law of Conservation of Mass</strong>: matter cannot
        be created or destroyed. The number of atoms of each element must be equal on both sides of the
        equation. Coefficients (the large numbers in front of formulas) are adjusted to achieve this balance —
        subscripts within formulas are NEVER changed.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Unbalanced: CH₄ + O₂ → CO₂ + H₂O'}<br />
        {'C: 1=1 ✓   H: 4≠2 ✗   O: 2≠3 ✗'}<br />
        {'Balanced:  CH₄ + 2O₂ → CO₂ + 2H₂O'}<br />
        {'C: 1=1 ✓   H: 4=4 ✓   O: 4=4 ✓'}
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The coefficients also represent mole ratios. In the balanced combustion of methane above:
        1 mol CH₄ reacts with 2 mol O₂ to produce 1 mol CO₂ and 2 mol H₂O.
        These mole ratios are the conversion factors for stoichiometry calculations.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Stoichiometry Roadmap</Typography>

      <MermaidDiagram chart={`graph LR
  A["Mass of A\n(grams)"] -->|"÷ molar mass A"| B["Moles of A"]
  B -->|"× mole ratio\n(from balanced equation)"| C["Moles of B"]
  C -->|"× molar mass B"| D["Mass of B\n(grams)"]
  B -->|"× 6.022×10²³"| E["Particles of A"]
  C -->|"× 6.022×10²³"| F["Particles of B"]`} />

      <Callout kind="in-plain-words">
        Every stoichiometry problem follows the same three-step path: (1) convert given amount to moles,
        (2) use the mole ratio from the balanced equation to find moles of the target substance, (3) convert
        moles to the desired unit (grams, particles, liters at STP). The mole ratio is always coefficient
        of target ÷ coefficient of given, read from the balanced equation.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Limiting and Excess Reagents</Typography>

      <Analogy title="The sandwich shop that runs out of bread">
        Imagine you run a sandwich shop with 10 slices of bread and 8 slices of cheese. Each sandwich
        needs 2 slices of bread and 1 slice of cheese. You can make 5 sandwiches before you run out of
        bread — even though you still have 3 slices of cheese left over. Bread is the limiting reagent.
        Cheese is the excess reagent. You can NEVER make more sandwiches than the bread allows, no matter
        how much cheese you have. In chemistry: the limiting reagent (LR) runs out first and determines
        the maximum product formed. The excess reagent has some left over when the reaction ends.
      </Analogy>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        To identify the limiting reagent:
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>Convert all given masses to moles.</li>
        <li>Divide each reactant's moles by its coefficient in the balanced equation.</li>
        <li>The reactant with the <strong>smallest quotient</strong> is the limiting reagent.</li>
        <li>Use the limiting reagent's moles to calculate the theoretical yield of product.</li>
      </Box>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: N₂ + 3H₂ → 2NH₃'}<br />
        {'Given: 28.0 g N₂ and 9.0 g H₂'}<br />
        {'Moles N₂ = 28.0/28.02 = 0.999 mol; moles H₂ = 9.0/2.02 = 4.46 mol'}<br />
        {'Divide by coefficient: N₂: 0.999/1 = 0.999; H₂: 4.46/3 = 1.49'}<br />
        {'Smallest quotient → N₂ is the limiting reagent'}<br />
        {'Theoretical yield NH₃ = 0.999 mol N₂ × (2 mol NH₃/1 mol N₂) = 1.998 mol NH₃'}<br />
        {'Mass NH₃ = 1.998 mol × 17.03 g/mol = 34.0 g'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Percent Yield</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In real reactions, side reactions, incomplete reactions, and losses during transfer mean the
        actual yield is always less than the theoretical yield. Percent yield measures efficiency:
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'% yield = (actual yield / theoretical yield) × 100%'}<br />
        {'Example: If we actually collected 28.5 g NH₃:'}<br />
        {'% yield = (28.5 / 34.0) × 100% = 83.8%'}
      </Box>

      <Callout kind="why-it-matters">
        Percent yield matters enormously in industrial chemistry. A pharmaceutical company synthesizing
        an antibiotic over multiple steps might find that even a 90% yield at each of 10 steps gives
        an overall yield of only 0.90¹⁰ = 35%. Optimizing each step's yield is the difference between
        a drug being affordable and being prohibitively expensive. Green chemistry's goal is reactions
        with near-100% atom economy and high percent yield to reduce waste.
      </Callout>

      <Callout kind="try-this">
        2Al + 3Cl₂ → 2AlCl₃. If you start with 54 g of Al and 213 g of Cl₂, find the limiting reagent
        and the theoretical yield of AlCl₃. Moles Al = 54/26.98 = 2.00 mol; moles Cl₂ = 213/70.90 = 3.00 mol.
        Divide by coefficients: Al: 2.00/2 = 1.00; Cl₂: 3.00/3 = 1.00. They're exactly equal — no limiting
        reagent, both used completely. Theoretical yield AlCl₃ = 2.00 mol × 133.33 g/mol = 267 g.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Molar Volume and Gas Stoichiometry</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        At standard temperature and pressure (STP: 0°C and 1 atm), one mole of any ideal gas occupies
        exactly <strong>22.4 liters</strong>. This molar volume provides a direct mole-to-volume conversion
        for gases at STP, without needing the ideal gas law:
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'How many liters of CO₂ are produced at STP when 44.0 g of CO₂ forms?'}<br />
        {'44.0 g CO₂ × (1 mol / 44.01 g) × (22.4 L / 1 mol) = 22.4 L'}<br />
        {'(Makes sense — exactly 1 mol of CO₂ at STP = 22.4 L)'}
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For gas stoichiometry problems at STP, you can use 22.4 L/mol as a conversion factor in your
        dimensional analysis chain. For gases NOT at STP, use the ideal gas law (PV = nRT) to find the
        volume from the moles.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Types of Chemical Reactions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Recognizing reaction types helps you predict products and balance equations more efficiently. The
        five main reaction types in introductory chemistry:
      </Typography>
      <GuideTable
        headers={['Type', 'General Form', 'Example', 'Key indicator']}
        rows={[
          ['Synthesis (combination)', 'A + B → AB', '2H₂ + O₂ → 2H₂O', 'Two or more substances combine into one product'],
          ['Decomposition', 'AB → A + B', '2H₂O₂ → 2H₂O + O₂', 'One compound breaks into simpler substances'],
          ['Single replacement', 'A + BC → AC + B', 'Zn + 2HCl → ZnCl₂ + H₂↑', 'One element replaces another in a compound'],
          ['Double replacement (metathesis)', 'AB + CD → AD + CB', 'NaCl + AgNO₃ → AgCl↓ + NaNO₃', 'Cations and anions switch partners; often forms precipitate'],
          ['Combustion', 'CₓHᵧ + O₂ → CO₂ + H₂O', 'CH₄ + 2O₂ → CO₂ + 2H₂O', 'Hydrocarbon + oxygen → CO₂ + H₂O (complete combustion)'],
        ]}
      />

      <Callout kind="watch-for">
        For single replacement reactions, use the <strong>activity series</strong> to determine if the
        reaction occurs. A more active metal displaces a less active metal from solution. The activity
        series (from most to least reactive): Li &gt; K &gt; Ca &gt; Na &gt; Mg &gt; Al &gt; Zn &gt; Fe
        &gt; Ni &gt; Sn &gt; Pb &gt; H &gt; Cu &gt; Ag &gt; Au. If you place iron (Fe) in copper sulfate
        solution (CuSO₄), iron displaces copper because Fe is above Cu in the activity series.
        Fe + CuSO₄ → FeSO₄ + Cu. If you place copper in iron sulfate, nothing happens.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Mole Fraction and Solution Concentration</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Molarity (M)</strong> is the most common concentration unit in chemistry:
        M = moles of solute / liters of solution. It connects grams (through molar mass) to moles to volume,
        making it ideal for stoichiometry in solution.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Prepare 250 mL of 0.500 M NaCl:'}<br />
        {'moles NaCl needed = M × V = 0.500 mol/L × 0.250 L = 0.125 mol'}<br />
        {'mass NaCl = 0.125 mol × 58.44 g/mol = 7.31 g'}<br />
        {'→ weigh 7.31 g NaCl, dissolve in water, dilute to exactly 250.0 mL in a volumetric flask'}
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Dilution formula:</strong> M₁V₁ = M₂V₂. When you dilute a solution (add more solvent),
        the moles of solute don't change, so M₁V₁ (initial moles) = M₂V₂ (final moles).
      </Typography>

      <Callout kind="connect">
        Molarity ties directly into titration — a technique for determining the unknown concentration
        of an acid or base by reacting it with a standard solution of known concentration. At the
        equivalence point, moles of acid = moles of base (for 1:1 ratios). If you know the molarity
        and volume of one, you can calculate the molarity of the other using M₁V₁ = M₂V₂ (adjusted
        for stoichiometric ratios). Titrations appear in pharmaceutical quality control, food science,
        environmental monitoring, and virtually every analytical chemistry lab in the world.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: States of Matter & Thermodynamics
// ─────────────────────────────────────────────────────────────────────
function Section7States() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The Three States of Matter</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The <strong>Kinetic Molecular Theory (KMT)</strong> explains the behavior of matter in all three
        states. All matter consists of particles in constant random motion. Temperature is a measure of
        the average kinetic energy of those particles. Higher temperature = faster-moving particles.
      </Typography>

      <GuideTable
        headers={['Property', 'Solid', 'Liquid', 'Gas']}
        rows={[
          ['Particle arrangement', 'Highly ordered lattice', 'Close but disordered', 'Far apart, random'],
          ['Particle motion', 'Vibrate in place', 'Slide past each other', 'Move freely at high speed'],
          ['Shape', 'Definite', 'Takes shape of container', 'Takes shape of container'],
          ['Volume', 'Definite', 'Definite', 'Expands to fill container'],
          ['Compressibility', 'Nearly incompressible', 'Nearly incompressible', 'Highly compressible'],
          ['IMF strength', 'Very strong (hold in place)', 'Moderate (allow flow)', 'Very weak (negligible)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Phase Changes and Energy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Phase changes occur when enough energy is added or removed to overcome the intermolecular forces
        holding particles together. Phase changes involve no temperature change while the change is
        occurring — all energy goes into breaking or forming intermolecular attractions.
      </Typography>

      <MermaidDiagram chart={`graph LR
  SOL["SOLID"]
  LIQ["LIQUID"]
  GAS["GAS"]
  SOL -->|"Melting\n(absorbs heat)"| LIQ
  LIQ -->|"Freezing\n(releases heat)"| SOL
  LIQ -->|"Vaporization/Evaporation\n(absorbs heat)"| GAS
  GAS -->|"Condensation\n(releases heat)"| LIQ
  SOL -->|"Sublimation\n(absorbs heat)"| GAS
  GAS -->|"Deposition\n(releases heat)"| SOL`} />

      <Callout kind="in-plain-words">
        A heating curve shows flat plateaus at phase changes. When you heat ice at 0°C, the temperature
        stays at 0°C until all the ice melts — all the energy is breaking hydrogen bonds, not speeding
        up molecules. Then temperature rises again as a liquid. At 100°C, it plateaus again while water
        vaporizes. The flat part on a heating curve = phase change in progress. The sloped part = temperature
        rising within one phase.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Gas Laws</Typography>

      <Analogy title="Gas laws as a balloon in a hot car on a summer day">
        You leave a balloon in a hot car. The temperature inside rises from 20°C to 40°C. The air molecules
        inside move faster (higher temperature → higher average KE). They hit the walls harder and more
        often. The balloon expands — volume increases as temperature increases (Charles's Law). Now squeeze
        the balloon — you decrease the volume, so the same molecules hit a smaller area more often, increasing
        pressure (Boyle's Law). Temperature, pressure, and volume are all linked: change one and at least
        one other must change in response.
      </Analogy>

      <GuideTable
        headers={['Law', 'Variables', 'Equation', 'What it says']}
        rows={[
          ['Boyle\'s Law', 'P and V (constant T, n)', 'P₁V₁ = P₂V₂', 'Pressure and volume are inversely proportional at constant temperature'],
          ['Charles\'s Law', 'V and T (constant P, n)', 'V₁/T₁ = V₂/T₂', 'Volume and temperature are directly proportional (T in Kelvin!)'],
          ['Gay-Lussac\'s Law', 'P and T (constant V, n)', 'P₁/T₁ = P₂/T₂', 'Pressure and temperature are directly proportional (T in Kelvin!)'],
          ['Combined Gas Law', 'P, V, and T', 'P₁V₁/T₁ = P₂V₂/T₂', 'Combines Boyle\'s + Charles\'s + Gay-Lussac\'s'],
          ['Ideal Gas Law', 'P, V, n, T', 'PV = nRT', 'R = 0.08206 L·atm/mol·K; relates all four variables simultaneously'],
          ['Dalton\'s Law', 'Partial pressures', 'P_total = P₁ + P₂ + P₃ + …', 'Total pressure = sum of partial pressures of each gas'],
        ]}
      />

      <Callout kind="watch-for">
        ALWAYS convert temperature to Kelvin before using any gas law formula. Using Celsius will give
        wrong answers — and the error can be dramatic near 0°C. K = °C + 273. Standard conditions
        for gas calculations: STP = 0°C (273 K) and 1 atm; at STP, 1 mole of any ideal gas occupies
        22.4 liters (molar volume). This is a useful shortcut for converting between moles and volume.
      </Callout>

      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Ideal Gas Law Example:'}<br />
        {'How many moles of gas are in a 5.00 L container at 2.00 atm and 27°C?'}<br />
        {'T = 27 + 273 = 300 K'}<br />
        {'n = PV / RT = (2.00 atm × 5.00 L) / (0.08206 L·atm/mol·K × 300 K)'}<br />
        {'n = 10.00 / 24.62 = 0.406 mol'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Gas Law Problem-Solving Strategy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Before applying any gas law, identify which variables are given and which are asked for:
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>List knowns: pressure (P), volume (V), temperature (T, in Kelvin!), moles (n).</li>
        <li>If n is constant and only two of P, V, T change: use the combined gas law P₁V₁/T₁ = P₂V₂/T₂. Cancel any variable that doesn't change (e.g., if T is constant, cancel T to get Boyle's Law).</li>
        <li>If moles are involved or you have absolute (one-state) conditions: use PV = nRT.</li>
        <li>For mixtures: use Dalton's Law for partial pressures. Remember mole fraction: Χₐ = nₐ/n_total, and Pₐ = Χₐ × P_total.</li>
      </Box>

      <GuideTable
        headers={['Scenario', 'Which law to use', 'What to watch for']}
        rows={[
          ['Volume changes, T and n constant', 'Boyle\'s Law: P₁V₁ = P₂V₂', 'Inverse relationship — pressure goes up, volume goes down'],
          ['Temperature changes, P and n constant', 'Charles\'s Law: V₁/T₁ = V₂/T₂', 'T must be in Kelvin'],
          ['Temperature changes, V and n constant', 'Gay-Lussac\'s: P₁/T₁ = P₂/T₂', 'T must be in Kelvin'],
          ['Two of P, V, T change, n constant', 'Combined: P₁V₁/T₁ = P₂V₂/T₂', 'T must be in Kelvin; identify which variable stays constant'],
          ['Find P, V, T, or n from absolute conditions', 'Ideal Gas Law: PV = nRT', 'R = 0.08206 L·atm/mol·K when P is in atm and V in L'],
          ['Gas mixture — find one component\'s pressure', 'Dalton\'s Law: P_total = ΣPᵢ', 'Each gas behaves independently in the mixture'],
        ]}
      />

      <Callout kind="try-this">
        A sealed container of nitrogen gas at 1.50 atm and 25°C is heated to 150°C. Volume is constant.
        What is the new pressure? Gay-Lussac's Law: P₁/T₁ = P₂/T₂.
        T₁ = 25 + 273 = 298 K; T₂ = 150 + 273 = 423 K.
        P₂ = P₁ × (T₂/T₁) = 1.50 atm × (423 K / 298 K) = 2.13 atm.
        Sense check: temperature increased (in Kelvin), so pressure should increase. It did. Always
        sense-check gas law answers — if temperature goes up at constant volume, pressure must go up.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Thermochemistry</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Thermochemistry studies the energy changes in chemical reactions. The <strong>enthalpy change (ΔH)</strong>
        tells us whether a reaction absorbs or releases heat at constant pressure.
      </Typography>

      <Analogy title="Exothermic reaction as a campfire">
        A campfire is a classic exothermic reaction: the combustion of wood releases energy in the form
        of heat and light. The products (CO₂, H₂O vapor, ash) have less stored energy than the reactants
        (cellulose + oxygen). That energy difference is released to the surroundings as the warmth you feel.
        ΔH is negative (energy flows out of the system). An endothermic reaction does the opposite — like
        an instant cold pack, it absorbs heat from the surroundings (ΔH positive), which is why the pack
        feels cold: heat is flowing from your hand into the reaction.
      </Analogy>

      <GuideTable
        headers={['Type', 'ΔH Sign', 'Energy flow', 'Example', 'Product energy vs. Reactant energy']}
        rows={[
          ['Exothermic', 'ΔH < 0 (negative)', 'Heat flows OUT of system to surroundings', 'Combustion, respiration, neutralization', 'Products at LOWER energy (more stable)'],
          ['Endothermic', 'ΔH > 0 (positive)', 'Heat flows INTO system from surroundings', 'Melting ice, photosynthesis, cooking', 'Products at HIGHER energy'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Calorimetry</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Calorimetry measures heat flow using the equation: <strong>q = mcΔT</strong> where q = heat (J),
        m = mass (g), c = specific heat capacity (J/g·°C), and ΔT = change in temperature (T_final − T_initial).
        For water, c = 4.184 J/g·°C.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: 150 g of water is heated from 22.0°C to 45.0°C. How much heat was absorbed?'}<br />
        {'q = mcΔT = (150 g)(4.184 J/g·°C)(45.0 − 22.0)°C'}<br />
        {'q = (150)(4.184)(23.0) = 14,434 J = 14.4 kJ'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Hess's Law</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Hess's Law:</strong> The total enthalpy change of a reaction is the sum of the enthalpy
        changes of any sequence of steps that lead from reactants to products. Enthalpy is a state function —
        it doesn't matter what path you take, only where you start and where you end.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        To use Hess's Law: if you reverse a step, flip the sign of ΔH. If you multiply a step by n,
        multiply ΔH by n. Combine the adjusted steps so intermediate compounds cancel out, leaving the
        target equation.
      </Typography>

      <Callout kind="connect">
        Hess's Law and calorimetry connect to everyday energy: the Calorie on a food label is actually
        a kilocalorie (1 Cal = 1000 cal = 4,184 J). Food labels measure energy by burning food in a
        "bomb calorimeter." The heat released by complete combustion of a food sample equals the Calories
        your body can extract from it (approximately). Thermochemistry literally applies to what you eat.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Bond Energy and Thermochemistry</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Every chemical bond stores potential energy. When a bond breaks, energy is <em>absorbed</em> from
        the surroundings (endothermic process). When a bond forms, energy is <em>released</em> to the
        surroundings (exothermic process). The enthalpy change for a reaction can be estimated from average
        bond energies:
        <br /><strong>ΔH_rxn ≈ Σ(bond energies of bonds broken) − Σ(bond energies of bonds formed)</strong>
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'H₂ + Cl₂ → 2HCl'}<br />
        {'Bonds broken: H–H (436 kJ) + Cl–Cl (243 kJ) = +679 kJ'}<br />
        {'Bonds formed: 2×H–Cl (2×432 = 864 kJ released) = −864 kJ'}<br />
        {'ΔH ≈ 679 − 864 = −185 kJ  (exothermic ✓)'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Entropy and Spontaneity (Introduction)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Entropy (S)</strong> is a measure of disorder or randomness in a system. The second law of
        thermodynamics states that the entropy of the universe always increases in a spontaneous process.
        Reactions that increase disorder (more gas molecules, mixing of substances, breaking apart of a solid
        crystal into ions) are favored by entropy. Reactions that decrease disorder (gas → solid, forming a
        precipitate) are disfavored by entropy alone.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Gibbs Free Energy (G)</strong> combines enthalpy and entropy to predict spontaneity:
        <strong> ΔG = ΔH − TΔS</strong>. If ΔG &lt; 0, the reaction is spontaneous (thermodynamically
        favored). If ΔG &gt; 0, the reaction is non-spontaneous under those conditions.
      </Typography>

      <GuideTable
        headers={['ΔH', 'ΔS', 'ΔG = ΔH − TΔS', 'Spontaneous?']}
        rows={[
          ['Negative (exothermic)', 'Positive (more disorder)', 'Always negative', 'Always spontaneous at all temperatures'],
          ['Positive (endothermic)', 'Negative (less disorder)', 'Always positive', 'Never spontaneous at any temperature'],
          ['Negative (exothermic)', 'Negative (less disorder)', 'Depends on T (negative at low T)', 'Spontaneous at LOW temperature'],
          ['Positive (endothermic)', 'Positive (more disorder)', 'Depends on T (negative at high T)', 'Spontaneous at HIGH temperature'],
        ]}
      />

      <Callout kind="why-it-matters">
        Understanding entropy and spontaneity explains many everyday phenomena: why you can't un-scramble
        an egg (entropy increase of cooking is irreversible), why ice melts spontaneously above 0°C
        (the entropy gain of liquid water outweighs the endothermic melting at those temperatures), and
        why explosions are irreversible (enormous entropy increase + large negative ΔH). Gibbs free energy
        is also the key quantity in biochemistry — cells run reactions with positive ΔG by coupling them
        to ATP hydrolysis (ΔG ≈ −30 kJ/mol) so the combined ΔG is negative.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Heating and Cooling Curves — Full Analysis</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A heating curve tracks temperature over time as you uniformly add heat to a substance. The slope
        of the rising portions depends on the specific heat capacity of each phase. The flat portions
        (plateaus) occur during phase changes, where temperature is constant while the intermolecular
        forces are being overcome (melting) or restored (freezing).
      </Typography>
      <GuideTable
        headers={['Segment of heating curve', 'What is happening', 'Equation to use']}
        rows={[
          ['Rising slope (solid)', 'Solid warms up; KE of particles increases', 'q = mc_solid ΔT'],
          ['Flat plateau at melting point', 'Solid → liquid; PE of particles increases (IMFs breaking)', 'q = n × ΔH_fus'],
          ['Rising slope (liquid)', 'Liquid warms up', 'q = mc_liquid ΔT'],
          ['Flat plateau at boiling point', 'Liquid → gas; PE of particles increases sharply', 'q = n × ΔH_vap (much larger than ΔH_fus)'],
          ['Rising slope (gas)', 'Gas warms up', 'q = mc_gas ΔT'],
        ]}
      />

      <Callout kind="watch-for">
        ΔH_vap is always much larger than ΔH_fus for the same substance — it takes far more energy to
        completely separate liquid particles into a gas than to just give solid particles enough freedom
        to slide past each other. For water: ΔH_fus = 6.01 kJ/mol (melting), ΔH_vap = 40.7 kJ/mol
        (vaporization). The boiling plateau on a heating curve is much longer than the melting plateau
        if the same heat rate is applied. This is why steam burns are so much more severe than boiling
        water burns — steam carries 40.7 kJ/mol of extra energy that releases as it condenses on skin.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Vapor Pressure and Boiling Point</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Vapor pressure</strong> is the pressure exerted by a vapor in equilibrium with its liquid
        at a given temperature. All liquids have vapor pressure. Increasing temperature increases vapor pressure
        because more molecules have enough kinetic energy to escape to the gas phase. A liquid <strong>boils</strong>
        when its vapor pressure equals the surrounding atmospheric pressure — this is why water boils at
        100°C at sea level (1 atm) but at lower temperatures at high altitude where atmospheric pressure is
        reduced (e.g., water boils at about 90°C at 3,000 meters elevation).
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Substances with stronger intermolecular forces have lower vapor pressures (molecules don't escape
        the liquid as easily) and higher boiling points. This is the connection between IMFs (Section 5)
        and the physical properties of States of Matter:
      </Typography>
      <GuideTable
        headers={['Substance', 'Dominant IMF', 'BP (°C)', 'Relative vapor pressure at 25°C']}
        rows={[
          ['Methane (CH₄)', 'London dispersion forces (weak, small molecule)', '−161', 'Very high (gases at room temp)'],
          ['Propane (C₃H₈)', 'London dispersion forces (moderate, larger)', '−42', 'High'],
          ['Acetone (CH₃COCH₃)', 'Dipole–dipole', '+56', 'Moderate (evaporates fast — nail polish remover)'],
          ['Ethanol (C₂H₅OH)', 'Hydrogen bonding', '+78', 'Lower'],
          ['Water (H₂O)', 'Hydrogen bonding (extensive network)', '+100', 'Low at 25°C'],
          ['Acetic acid (CH₃COOH)', 'Hydrogen bonding + dimerization', '+118', 'Very low'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Colligative Properties</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Colligative properties depend only on the number of dissolved particles, not on the identity of the
        solute. Adding any nonvolatile solute to a solvent produces the same four effects:
      </Typography>
      <GuideTable
        headers={['Colligative property', 'Direction of change', 'Explanation', 'Example']}
        rows={[
          ['Vapor pressure lowering', 'Decreases', 'Solute particles occupy the liquid surface, reducing the rate of evaporation', 'Saltwater has lower vapor pressure than pure water'],
          ['Boiling point elevation', 'Increases', 'Higher vapor pressure required to boil means higher temperature needed', 'Saltwater boils above 100°C — relevant to pasta cooking'],
          ['Freezing point depression', 'Decreases', 'Solute particles disrupt the crystal lattice formation of the solid', 'Salt on icy roads melts ice; antifreeze lowers car coolant freezing point'],
          ['Osmotic pressure', 'Increases', 'Solvent flows through a semipermeable membrane from low to high concentration', 'Relevant to kidney function, intravenous fluids, desalination'],
        ]}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For ionic compounds, the colligative effect is multiplied by the number of ions produced per
        formula unit. NaCl dissociates into 2 ions (Na⁺ and Cl⁻), so it depresses the freezing point
        twice as much as a non-electrolyte at the same molality. CaCl₂ produces 3 ions → three times
        the effect. This is why road crews prefer CaCl₂ over NaCl for ice removal in very cold weather.
      </Typography>

      <Callout kind="connect">
        Colligative properties connect directly to medicine. Intravenous (IV) fluids must be isotonic
        with blood — the same concentration of dissolved particles (≈ 0.9% NaCl saline). If IV fluid
        is too dilute (hypotonic), water moves into red blood cells by osmosis and they burst (hemolysis).
        If too concentrated (hypertonic), water moves out of the cells and they shrink (crenation).
        Both are life-threatening. Colligative properties — seemingly abstract chemistry — are a literal
        life-or-death consideration in clinical medicine.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 8: Reaction Kinetics, Equilibrium & Acids/Bases
// ─────────────────────────────────────────────────────────────────────
function Section8Kinetics() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Reaction Kinetics: How Fast?</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Chemical kinetics studies the <strong>rate</strong> of reactions — how quickly reactants are
        consumed and products are formed. Reaction rate depends on several factors, all explained by
        <strong> collision theory</strong>: for a reaction to occur, molecules must collide with enough
        energy (at least the activation energy, Eₐ) and with the correct orientation.
      </Typography>

      <GuideTable
        headers={['Factor', 'Effect on Rate', 'Explanation (Collision Theory)']}
        rows={[
          ['Temperature', 'Increases rate', 'Higher T → faster molecules → more collisions with sufficient energy to exceed Eₐ'],
          ['Concentration', 'Increases rate', 'More particles per volume → more frequent collisions'],
          ['Surface area', 'Increases rate', 'More exposed particles → more frequent collisions (powder reacts faster than a chunk)'],
          ['Catalyst', 'Increases rate', 'Provides an alternative pathway with lower activation energy — more collisions have enough energy to react'],
          ['Nature of reactants', 'Varies', 'Ionic reactions in solution are nearly instantaneous; breaking strong covalent bonds is slow'],
        ]}
      />

      <Callout kind="why-it-matters">
        Catalysts are among the most economically important concepts in chemistry. Industrial catalysts
        (like platinum in catalytic converters or iron in the Haber process for making ammonia) allow
        reactions to run at lower temperatures with far less energy input — saving enormous costs.
        Enzymes are biological catalysts that make life possible by speeding up reactions millions of times.
        Without enzymes, your metabolism would proceed too slowly to sustain life.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Chemical Equilibrium: How Far?</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Most chemical reactions are <strong>reversible</strong> — they can proceed in both the forward
        and reverse direction. At <strong>equilibrium</strong>, the forward and reverse reaction rates
        are equal, so the concentrations of reactants and products remain constant (but not necessarily
        equal). Equilibrium is a dynamic state — reactions are still occurring, but at the same rate in
        both directions.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>The Equilibrium Constant (K)</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        For a reaction: aA + bB ⇌ cC + dD, the equilibrium constant expression is:
        <strong> K = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ</strong> (products over reactants, each raised to its coefficient).
        Square brackets denote molar concentration. Pure solids and pure liquids are NOT included in K expressions.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)'}<br />
        {'K = [NH₃]² / ([N₂][H₂]³)'}<br />
        {'If K >> 1 → equilibrium favors PRODUCTS (reaction goes mostly to completion)'}<br />
        {'If K << 1 → equilibrium favors REACTANTS (very little product formed)'}<br />
        {'If K ≈ 1   → significant amounts of both reactants and products at equilibrium'}
      </Box>

      <Callout kind="watch-for">
        K changes ONLY when temperature changes. Adding more reactant, changing pressure, or adding a
        catalyst does NOT change K. The equilibrium position shifts (concentrations change), but the
        numerical value of K at that temperature stays the same. This is a favorite test trick.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Le Chatelier's Principle</Typography>

      <Analogy title="Le Chatelier's principle as crowd-shifting on a boat">
        Imagine a boat carrying passengers. If too many people crowd to the left, the boat tilts left.
        Instinctively, people shift right to balance — they respond to the stress by counteracting it.
        Le Chatelier's Principle says equilibrium systems do exactly the same thing: when you impose a
        stress (add a reactant, remove a product, increase pressure), the system shifts in the direction
        that partially counteracts that stress. It doesn't eliminate the stress — it partially undoes it,
        like the passengers shifting but not running to the opposite side of the boat.
      </Analogy>

      <GuideTable
        headers={['Stress applied', 'Equilibrium shift', 'Why']}
        rows={[
          ['Add reactant', 'Shifts RIGHT (→ more product)', 'System reduces excess reactant by producing more product'],
          ['Remove reactant', 'Shifts LEFT (→ more reactant)', 'System replenishes the removed reactant'],
          ['Add product', 'Shifts LEFT (→ more reactant)', 'System reduces excess product'],
          ['Remove product', 'Shifts RIGHT (→ more product)', 'System replenishes the removed product'],
          ['Increase pressure (decrease volume)', 'Shifts toward fewer moles of gas', 'System reduces total pressure by making fewer gas molecules'],
          ['Decrease pressure (increase volume)', 'Shifts toward more moles of gas', 'System increases pressure by making more gas molecules'],
          ['Increase temperature', 'Endothermic reaction shifts RIGHT; exothermic shifts LEFT', 'System "absorbs" added heat by favoring the endothermic direction'],
          ['Decrease temperature', 'Endothermic reaction shifts LEFT; exothermic shifts RIGHT', 'System "releases" heat to compensate for the decrease'],
          ['Add catalyst', 'No shift in equilibrium position', 'Catalyst speeds up BOTH directions equally — K is unchanged'],
        ]}
      />

      <Callout kind="connect">
        The Haber process (N₂ + 3H₂ ⇌ 2NH₃) is Le Chatelier's Principle in industrial action.
        The forward reaction is exothermic. To maximize ammonia production: use high pressure
        (shifts toward fewer moles of gas — NH₃ side has 2 mol vs. 4 mol on reactant side),
        use moderate temperature (low T favors products but slows rate — a compromise around 450°C),
        remove NH₃ as it forms (shifts equilibrium right), and use an iron catalyst to speed up
        attainment of equilibrium. Every design choice reflects Le Chatelier's Principle.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Acids and Bases</Typography>

      <GuideTable
        headers={['Definition', 'Acid', 'Base', 'Example']}
        rows={[
          ['Arrhenius', 'Produces H⁺ (or H₃O⁺) in water', 'Produces OH⁻ in water', 'HCl → H⁺ + Cl⁻; NaOH → Na⁺ + OH⁻'],
          ['Brønsted-Lowry', 'Proton (H⁺) DONOR', 'Proton (H⁺) ACCEPTOR', 'HCl donates H⁺ to water; NH₃ accepts H⁺ from water'],
          ['Lewis', 'Electron pair ACCEPTOR', 'Electron pair DONOR', 'BF₃ accepts lone pair from NH₃'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Strong vs. Weak Acids and Bases</Typography>

      <Analogy title="Strong acid: handing over all the keys; weak acid: keeping most of them">
        A strong acid like HCl is like a person who immediately hands their house key (proton) to everyone
        they meet — full ionization, 100% dissociation in water. A weak acid like acetic acid (CH₃COOH)
        is like someone who clings to most of their keys — only a small percentage dissociate in water
        (acetic acid is only about 1.3% ionized at typical concentrations). The distinction matters
        enormously: the same molarity of HCl and acetic acid has very different pH and reactivity
        because strong acids fully ionize and weak ones don't.
      </Analogy>

      <GuideTable
        headers={['Strength', 'Behavior', 'Common Examples']}
        rows={[
          ['Strong acids', 'Fully ionize in water (→ 100%)', 'HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄'],
          ['Weak acids', 'Partially ionize (equilibrium, Ka)', 'CH₃COOH (acetic), HF, H₂CO₃, H₃PO₄'],
          ['Strong bases', 'Fully dissociate in water', 'Group 1 hydroxides: NaOH, KOH, LiOH; Group 2: Ca(OH)₂, Ba(OH)₂'],
          ['Weak bases', 'Partially react with water (Kb)', 'NH₃ (ammonia), most amines'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The pH Scale</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        pH measures the acidity of an aqueous solution: <strong>pH = −log[H⁺]</strong> (or −log[H₃O⁺]).
        Similarly, <strong>pOH = −log[OH⁻]</strong>. At 25°C, pH + pOH = 14 always.
        In pure water at 25°C: [H⁺] = [OH⁻] = 1.0 × 10⁻⁷ M, so pH = 7 (neutral).
      </Typography>

      <MermaidDiagram chart={`graph LR
  subgraph "pH Scale at 25°C"
    A["pH 0\nStrongly Acidic\n1 M HCl"]
    B["pH 1\n0.1 M HCl"]
    C["pH 3\nVinegar, soft drink"]
    D["pH 7\nPure water (neutral)"]
    E["pH 10\nMilk of magnesia"]
    F["pH 13\nOven cleaner"]
    G["pH 14\nStrongly Basic\n1 M NaOH"]
  end
  A --- B --- C --- D --- E --- F --- G`} />

      <GuideTable
        headers={['Relationship', 'Formula', 'Example']}
        rows={[
          ['pH from [H⁺]', 'pH = −log[H⁺]', '[H⁺] = 0.001 M → pH = −log(10⁻³) = 3'],
          ['[H⁺] from pH', '[H⁺] = 10⁻ᵖᴴ', 'pH = 4.5 → [H⁺] = 10⁻⁴·⁵ = 3.16 × 10⁻⁵ M'],
          ['pOH from [OH⁻]', 'pOH = −log[OH⁻]', '[OH⁻] = 10⁻⁵ → pOH = 5'],
          ['pH + pOH = 14', 'Always at 25°C', 'pH 3 → pOH = 11'],
          ['[H⁺][OH⁻] = Kw', 'Kw = 1.0 × 10⁻¹⁴ at 25°C', '(1.0 × 10⁻⁷)(1.0 × 10⁻⁷) = 10⁻¹⁴'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Conjugate Acid-Base Pairs</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In Brønsted-Lowry theory, every acid-base reaction involves two conjugate pairs. When an acid donates
        a proton, what remains is the conjugate base. When a base accepts a proton, what forms is the conjugate
        acid. A strong acid has a very weak conjugate base (HCl donates H⁺ → Cl⁻ is an extremely weak base).
        A weak acid has a stronger conjugate base.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'HF (acid) + H₂O (base) ⇌ F⁻ (conj. base) + H₃O⁺ (conj. acid)'}<br />
        {'Pair 1: HF / F⁻  (HF donates proton, F⁻ can accept it back)'}<br />
        {'Pair 2: H₂O / H₃O⁺  (H₂O accepts proton, H₃O⁺ can donate it back)'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Neutralization and Buffers</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>neutralization reaction</strong> occurs when an acid and a base react: the H⁺ from
        the acid combines with OH⁻ from the base to form water, and the remaining ions form a salt.
        Strong acid + strong base → neutral salt (pH 7). Weak acid + strong base → basic salt (pH &gt; 7).
        Strong acid + weak base → acidic salt (pH &lt; 7).
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>buffer</strong> is a solution that resists changes in pH when small amounts of acid or
        base are added. Buffers contain a weak acid and its conjugate base (or a weak base and its conjugate
        acid) in comparable amounts. Blood is buffered at pH 7.35–7.45 by the carbonic acid / bicarbonate
        system (H₂CO₃ / HCO₃⁻). If blood pH deviates significantly from this range, the result is
        acidosis or alkalosis — both life-threatening.
      </Typography>

      <Callout kind="make-it-stick">
        The big-picture logic for this section: Kinetics answers "how fast?" (collision theory, Eₐ, catalysts).
        Equilibrium answers "how far?" (K, Le Chatelier, shifts). Acids and bases give a specific application
        of equilibrium where the key species are H⁺ and OH⁻. pH is just a logarithmic shorthand for [H⁺]
        concentration. These three topics form a complete picture of reaction behavior — not just whether
        a reaction happens, but how quickly, how completely, and what the solution properties are.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Energy Diagrams and Activation Energy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A potential energy diagram (reaction coordinate diagram) shows the energy of the system as the
        reaction progresses. The <strong>activation energy (Eₐ)</strong> is the minimum energy collision
        must have for the reaction to occur — it is the height of the "energy hill" (the transition state
        or activated complex) above the reactants. <strong>ΔH</strong> is the difference in energy between
        products and reactants (negative = exothermic, positive = endothermic). A catalyst lowers Eₐ —
        it provides a pathway with a shorter hill — but does NOT change ΔH (the start and end points
        are the same).
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Exothermic reaction energy diagram:'}<br />
        {'                ‡ Transition state (highest point)'}<br />
        {'               /\\'}<br />
        {'              /  \\'}<br />
        {'Reactants ___/    \\_____ Products (lower energy)'}<br />
        {'         |  Eₐ →  |  ← −ΔH|'}<br />
        {'  Reactants       Products'}<br />
        {'Eₐ (forward) > Eₐ (reverse) for exothermic reactions'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Rate Laws and Reaction Order</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The <strong>rate law</strong> expresses how the reaction rate depends on concentrations of reactants:
        <strong> rate = k[A]ⁿ[B]ᵐ</strong>, where k is the rate constant, n is the order with respect to A,
        and m is the order with respect to B. The <strong>overall reaction order</strong> is n + m.
        Reaction order CANNOT be determined from the balanced equation — it must be determined experimentally
        by measuring how rate changes when concentrations change.
      </Typography>
      <GuideTable
        headers={['Order', 'Rate law form', 'Effect of doubling [A]', 'Common example']}
        rows={[
          ['Zero order', 'rate = k', 'No effect on rate', 'Some enzyme-catalyzed reactions at saturation'],
          ['First order', 'rate = k[A]', 'Rate doubles', 'Radioactive decay: rate = k[N]'],
          ['Second order', 'rate = k[A]²', 'Rate quadruples (2² = 4)', 'NO₂ decomposition'],
          ['Second order (two reactants)', 'rate = k[A][B]', 'Doubling A doubles rate; doubling B doubles rate', 'Many bimolecular reactions'],
        ]}
      />

      <Callout kind="try-this">
        Experimental data: Experiment 1 — [A]=0.10 M, [B]=0.10 M, rate = 2.0 × 10⁻⁴ M/s.
        Experiment 2 — [A]=0.20 M, [B]=0.10 M, rate = 4.0 × 10⁻⁴ M/s. Experiment 3 — [A]=0.10 M,
        [B]=0.20 M, rate = 2.0 × 10⁻⁴ M/s. Comparing Exp 1 and 2: doubling [A] doubled the rate →
        first order in A. Comparing Exp 1 and 3: doubling [B] had no effect on rate → zero order in B.
        Rate law: rate = k[A]¹[B]⁰ = k[A]. Solving for k: k = rate/[A] = 2.0×10⁻⁴/0.10 = 2.0×10⁻³ s⁻¹.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Acid-Base Titrations and the Equivalence Point</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In a titration, a solution of known concentration (the <strong>titrant</strong>) is gradually added
        to a solution of unknown concentration (the <strong>analyte</strong>) until the reaction is complete.
        The <strong>equivalence point</strong> is when the moles of acid equal the moles of base (for 1:1
        stoichiometry). An indicator changes color near the equivalence point to signal the endpoint.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Titration calculation:'}<br />
        {'25.0 mL of HCl is titrated with 0.100 M NaOH. It takes 32.5 mL NaOH to reach equivalence point.'}<br />
        {'moles NaOH = 0.0325 L × 0.100 mol/L = 3.25 × 10⁻³ mol'}<br />
        {'HCl + NaOH → NaCl + H₂O  (1:1 ratio)'}<br />
        {'moles HCl = 3.25 × 10⁻³ mol'}<br />
        {'Molarity HCl = 3.25×10⁻³ mol / 0.0250 L = 0.130 M'}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Solubility and Precipitation Reactions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When two aqueous ionic solutions are mixed, a <strong>precipitate</strong> (insoluble solid) may form
        if the product compound has low solubility. Use the solubility rules to predict precipitate formation:
      </Typography>
      <GuideTable
        headers={['Ion', 'Solubility', 'Exceptions']}
        rows={[
          ['Group 1 (Li⁺, Na⁺, K⁺, etc.)', 'Always soluble', 'No common exceptions'],
          ['NH₄⁺', 'Always soluble', 'No common exceptions'],
          ['NO₃⁻, ClO₃⁻, ClO₄⁻, CH₃COO⁻', 'Always soluble', 'No common exceptions'],
          ['Cl⁻, Br⁻, I⁻', 'Soluble', 'Except with Ag⁺, Hg₂²⁺, Pb²⁺ → precipitate'],
          ['SO₄²⁻', 'Soluble', 'Except with Ba²⁺, Pb²⁺, Ca²⁺, Sr²⁺ → precipitate'],
          ['OH⁻', 'Insoluble (precipitate)', 'Except Group 1, Ba²⁺, Ca²⁺, Sr²⁺ → soluble'],
          ['CO₃²⁻, PO₄³⁻, S²⁻', 'Insoluble (precipitate)', 'Except Group 1 and NH₄⁺ → soluble'],
        ]}
      />

      <Callout kind="connect">
        Solubility rules are a practical application of ionic equilibrium. Every "insoluble" compound
        actually has a tiny but nonzero solubility — described by the solubility product constant Ksp.
        For AgCl: AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq), Ksp = [Ag⁺][Cl⁻] = 1.8 × 10⁻¹⁰. The extremely
        small Ksp means almost no AgCl dissolves — it is "effectively insoluble" for practical purposes.
        If the ion product Q = [Ag⁺][Cl⁻] exceeds Ksp, precipitation occurs until equilibrium is restored.
        This is why qualitative analysis in the lab can separate and identify unknown ions by selectively
        precipitating them.
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Chemistry Exam-Day Strategy</Typography>

      <Callout kind="coachs-note">
        Chemistry tests reward careful, systematic work. The biggest point-losses aren't from not knowing
        the concept — they're from rushing, forgetting units, skipping the balanced equation, or using
        Celsius instead of Kelvin. Slow down on setup. The calculation is the easy part once the setup
        is right.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>The Most Common Errors — and How to Avoid Them</Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>1. Forgetting to balance the equation before doing stoichiometry.</strong> Every mole ratio
        comes from the coefficients of a balanced equation. If you skip balancing and use a 1:1 ratio when
        the real ratio is 1:3 (like in N₂ + 3H₂ → 2NH₃), your answer will be completely wrong. Always
        balance first, even if it seems obvious.
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>2. Confusing the limiting reagent with the excess reagent.</strong> Students frequently
        identify the reactant present in smaller grams as the limiting reagent. That is wrong — the limiting
        reagent is the one with the smaller quotient after dividing moles by coefficient. You must convert
        to moles and then divide by the coefficient before comparing.
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>3. Mixing up ΔH sign conventions.</strong> Exothermic = ΔH negative (heat released to
        surroundings, system loses energy). Endothermic = ΔH positive. A common mnemonic: EXOthermic =
        "EXits" — energy exits the system. ENDOthermic = "ENters" — energy enters the system.
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>4. Forgetting that K changes only with temperature.</strong> Adding reactants, adding
        products, changing pressure, or adding a catalyst shifts the equilibrium position but does NOT
        change the value of K. Only changing temperature changes K. If a test question asks "which of
        the following changes K?" — the answer is always temperature change.
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>5. Using Celsius instead of Kelvin in gas law problems.</strong> K = °C + 273. Forgetting
        this is one of the most common errors on gas law problems. If T₁ = 27°C, use 300 K, not 27.
        A helpful check: temperatures in gas laws should never be negative in problems that make physical
        sense (since negative Kelvin doesn't exist).
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>6. Counting sig figs incorrectly on zeros.</strong> Leading zeros (0.0047 = 2 sig figs)
        are never significant. Trailing zeros with a decimal (2.500 = 4 sig figs) are significant. Trailing
        zeros without a decimal (2500 = ambiguous) — assume the minimum (2) unless told otherwise.
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>7. Lewis structures: missing lone pairs or misplacing double bonds.</strong> After drawing
        single bonds between all atoms, count remaining electrons and use them as lone pairs on outer atoms
        first. If the central atom still needs electrons to complete its octet, convert lone pairs on outer
        atoms to multiple bonds. Always verify the total electron count equals the valence electron total.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Test-Taking Tactics</Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        For calculation problems: always write the formula, show substitution with units, and carry units
        through the calculation. Units are a built-in error check — if your units don't simplify to the
        expected unit, your setup is wrong.
      </Typography>

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        For multiple-choice: eliminate obviously wrong answers first. On equilibrium questions, ask:
        "What direction would this shift according to Le Chatelier?" On bonding questions: "What is the
        ΔEN?" On stoichiometry: "Did I balance the equation?"
      </Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        On percent yield and limiting reagent problems: mark which substance is limiting and circle the
        theoretical yield as soon as you calculate it, before moving on to the percent yield step — this
        prevents plugging in the wrong number.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Last-Minute Concept Review Checklist</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Use this list the night before or morning of a chemistry exam to confirm your key knowledge:
      </Typography>
      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>Can I classify any given substance as element, compound, homogeneous mixture, or heterogeneous mixture?</li>
        <li>Can I distinguish physical from chemical changes and properties?</li>
        <li>Do I know how to count significant figures in all types of numbers (with zeros in various positions)?</li>
        <li>Can I apply sig fig rules to multiplication/division AND addition/subtraction?</li>
        <li>Do I know the SI base units and common prefixes (nano, micro, milli, kilo)?</li>
        <li>Can I describe the contributions of Dalton, Thomson, Rutherford, and Bohr to atomic theory?</li>
        <li>Can I write the electron configuration for any element in the first four periods, including ions?</li>
        <li>Can I explain all four major periodic trends and their directions across a period and down a group?</li>
        <li>Can I determine bond type from electronegativity difference?</li>
        <li>Can I draw Lewis structures for simple molecules and polyatomic ions?</li>
        <li>Can I apply VSEPR to predict molecular geometry and bond angles?</li>
        <li>Can I identify the strongest intermolecular forces present in a substance?</li>
        <li>Can I perform a complete stoichiometry calculation from grams → moles → mole ratio → moles → grams?</li>
        <li>Can I identify the limiting reagent and calculate theoretical and percent yield?</li>
        <li>Can I apply all five gas laws (Boyle's, Charles's, Gay-Lussac's, combined, ideal) correctly, with T in Kelvin?</li>
        <li>Can I calculate q = mcΔT and apply Hess's Law?</li>
        <li>Can I apply Le Chatelier's Principle to all types of stresses?</li>
        <li>Can I calculate pH from [H⁺] and [H⁺] from pH?</li>
        <li>Do I know the difference between strong and weak acids/bases and their ionization behavior?</li>
        <li>Do I know the solubility rules for common ion combinations?</li>
      </Box>

      <Callout kind="connect">
        All of chemistry ultimately connects to one central theme: the structure of matter at the atomic
        and molecular level determines the properties and behavior of that matter at the macroscopic level.
        Why does salt dissolve in water? Ionic structure + water's polarity. Why does diamond scratch
        everything? Its covalent network structure. Why does iron rust but gold not? Different reactivity
        driven by electron configuration and ionization energy. When you deeply understand the atomic
        picture, the macroscopic behavior stops being memorization and starts being logical prediction.
        That is the real goal of chemistry.
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Chemistry Glossary</Typography>
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
