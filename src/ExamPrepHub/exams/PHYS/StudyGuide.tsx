// PHYS Study Guide — accordion-based layout for SC Physics (11th grade).
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

const READING_PROGRESS_KEY = 'exam-prep-reading:PHYS';
const COMPLETION_KEY = 'exam-prep-completed:PHYS';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:PHYS';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Kinematics',
  s3: 'Energy & Momentum',
  s4: 'Waves & Sound',
  s5: 'Light & Optics',
  s6: 'Electricity & Circuits',
  s7: 'Magnetism',
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
  { id: 's1',      num: '1',  title: 'The Big Picture',        icon: '🗺️' },
  { id: 's2',      num: '2',  title: 'Kinematics',             icon: '🏃' },
  { id: 's3',      num: '3',  title: 'Energy & Momentum',      icon: '⚡' },
  { id: 's4',      num: '4',  title: 'Waves & Sound',          icon: '🌊' },
  { id: 's5',      num: '5',  title: 'Light & Optics',         icon: '💡' },
  { id: 's6',      num: '6',  title: 'Electricity & Circuits', icon: '🔌' },
  { id: 's7',      num: '7',  title: 'Magnetism',              icon: '🧲' },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',      icon: '🎯' },
  { id: 's-gloss', num: '📚', title: 'Glossary',               icon: '📚' },
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
    case 's2':      return <Section2Kinematics />;
    case 's3':      return <Section3EnergyMomentum />;
    case 's4':      return <Section4WavesSound />;
    case 's5':      return <Section5LightOptics />;
    case 's6':      return <Section6ElectricityCircuits />;
    case 's7':      return <Section7Magnetism />;
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>What Is Physics?</Typography>

      <Analogy title="Physics as the universal language of nature">
        If mathematics is the grammar, physics is the language that describes every process in the universe —
        from the spin of an electron to the orbit of a galaxy. Chemistry speaks physics at the molecular scale.
        Biology speaks physics at the cellular scale. Engineering applies physics to build things. No matter
        which science you pursue, you are reading sentences written in the language of physics.
        Learning physics is learning how to read and write in that universal tongue.
      </Analogy>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        Physics is the study of matter, energy, and the interactions between them. It is the most
        fundamental of the natural sciences because its laws underpin chemistry, biology, astronomy,
        and engineering. The word "physics" comes from the Greek word for nature, and the mission of
        physicists has always been the same: find the simplest, most general rules that describe how
        the physical world behaves.
      </Typography>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        At the high school level, physics is organized into six major domains. Each domain focuses on a
        different aspect of the physical world, but they are deeply interconnected — understanding one
        makes the others easier. Electricity and magnetism are literally the same force viewed from
        different reference frames. Waves appear in both sound and light. Energy links kinematics to
        every other domain. You are not learning six separate subjects; you are learning six chapters
        of one story.
      </Typography>

      <Callout kind="why-it-matters">
        Physics is behind every technology you interact with daily. Smartphones use quantum mechanics
        (transistors), classical mechanics (accelerometers), electromagnetism (antennas and screens),
        and optics (cameras). GPS satellites require relativistic corrections to work accurately. MRI
        machines use magnetism to image soft tissue without radiation. Physics is not abstract theory —
        it is the foundation of the modern world.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Six Subdomains of This Course</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        This study guide covers six content areas, each of which builds on the previous ones.
        Here is a bird's-eye view of what each subdomain is about and how they connect:
      </Typography>

      <MermaidDiagram chart={`graph TD
  A["Physics"] --> B["Kinematics\nDescribes HOW things move\n(position, velocity, acceleration)"]
  A --> C["Energy & Momentum\nDescribes the capacity to do work\nand the product mv"]
  A --> D["Waves & Sound\nDisturbances that carry energy\nthrough a medium or vacuum"]
  A --> E["Light & Optics\nElectromagnetic waves —\nreflection, refraction, lenses"]
  A --> F["Electricity & Circuits\nCharge, current, voltage,\nresistance — Ohm's Law"]
  A --> G["Magnetism\nMagnetic fields, forces on charges,\ninduction, transformers"]
  B -->|"Work, KE"| C
  C -->|"EM induction\n uses energy"| G
  F -->|"Moving charges\ncreate fields"| G
  D -->|"Light IS an EM wave"| E`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>How the Subdomains Connect</Typography>
      <GuideTable
        headers={['Subdomain', 'Core question', 'Key quantities', 'Real-world example']}
        rows={[
          ['Kinematics', 'How does position change over time?', 'displacement, velocity, acceleration', 'Braking distance of a car'],
          ['Energy & Momentum', 'What is the capacity to do work? What resists changes in motion?', 'KE, PE, work, power, momentum', 'Crash safety design, roller coasters'],
          ['Waves & Sound', 'How does energy travel through a medium?', 'wavelength, frequency, amplitude, speed', 'Musical instruments, ultrasound imaging'],
          ['Light & Optics', 'How does light reflect, bend, and focus?', 'angle of incidence, index of refraction', 'Glasses, cameras, fiber optics'],
          ['Electricity & Circuits', 'How do charges move and do work?', 'voltage, current, resistance, power', 'Household circuits, batteries'],
          ['Magnetism', 'How do moving charges and fields interact?', 'magnetic field, flux, EMF', 'Motors, generators, transformers'],
        ]}
      />

      <Analogy title="Formulas as recipes, not magic spells">
        Students sometimes treat physics formulas as incantations — plug in numbers and hope the right
        answer appears. But a formula is really a recipe: it tells you exactly which ingredients
        (variables) you need and in what proportion to combine them. Just as a baker needs to understand
        why flour and fat create flakiness before improvising a recipe, a physics student should understand
        why each formula works before applying it. When you understand the recipe, you can adapt it when
        you're missing an ingredient — because you know what role each ingredient plays.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Scalars vs. Vectors: The Most Important Distinction in Physics</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Before diving into any subdomain, you must understand the difference between scalars and vectors.
        This distinction is threaded through all of physics and causes more confusion than almost any other concept.
      </Typography>

      <GuideTable
        headers={['Property', 'Scalar', 'Vector']}
        rows={[
          ['Definition', 'Has magnitude (size) only', 'Has magnitude AND direction'],
          ['Examples', 'Distance, speed, mass, energy, temperature', 'Displacement, velocity, acceleration, force, momentum'],
          ['How to add', 'Ordinary arithmetic', 'Tip-to-tail vector addition (or component method)'],
          ['Can be negative?', 'Not usually (mass, distance are always ≥ 0)', 'Yes — negative means opposite direction'],
          ['Notation', 'Plain letter: v (speed)', 'Arrow on top or bold: v⃗ or v'],
        ]}
      />

      <Callout kind="make-it-stick">
        Every time you see a physics quantity, ask yourself: "Is this a scalar or a vector?" If it is a vector,
        direction matters — you MUST specify which way. A car going 30 m/s north and a car going 30 m/s south
        have the same speed (scalar) but opposite velocities (vector). This distinction determines whether
        they will meet at the same point or travel in opposite directions.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Units and Dimensional Analysis</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Physics is a quantitative science — every answer has units. The SI (International System) base units
        used throughout this course are: meters (m) for length, kilograms (kg) for mass, seconds (s) for time,
        amperes (A) for electric current, and kelvin (K) for temperature. All other units are derived from these.
        Dimensional analysis — tracking units through a calculation — is one of the most powerful self-checking
        tools in physics. If your units do not match the expected units of the answer, you made an error.
      </Typography>

      <Callout kind="coachs-note">
        Dimensional analysis catches errors that algebra alone cannot. If you compute a "velocity" and the
        units come out as m²/s instead of m/s, you know you squared something you should not have, or
        forgot a square root. Before you start any problem, write down what units the answer should have.
        After computing, check that your units match. This habit alone is worth several points per test.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Newton's Laws: The Backbone of Mechanics</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Even though forces are technically their own topic (dynamics), Newton's Three Laws provide the
        conceptual backbone for every mechanics problem in this course. You will need them to understand
        WHY kinematic quantities change the way they do.
      </Typography>

      <GuideTable
        headers={['Law', 'Statement', 'Implication']}
        rows={[
          ['1st Law (Inertia)', 'An object at rest stays at rest; an object in motion stays in motion at constant velocity unless acted on by a net force.', 'Net force = 0 means no acceleration. Constant velocity ≠ no force; it means balanced forces.'],
          ['2nd Law (F = ma)', 'The net force on an object equals its mass times its acceleration: F_net = ma.', 'The greater the mass, the more force needed to produce the same acceleration. Acceleration is always in the direction of the net force.'],
          ['3rd Law (Action-Reaction)', 'For every action force, there is an equal and opposite reaction force acting on a different object.', 'Forces always come in pairs on DIFFERENT objects. The reaction force does not cancel the action force because they act on different bodies.'],
        ]}
      />

      <Callout kind="watch-for">
        A persistent misconception: "The reaction force cancels the action force." It does NOT —
        action and reaction forces act on DIFFERENT objects, so they cannot cancel each other.
        When a horse pulls a cart, the horse exerts a forward force on the cart (action) and the cart
        pulls the horse backward equally (reaction). The cart accelerates because the net force ON THE CART
        is forward. The forces acting on different objects are never in the same free-body diagram.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Free-Body Diagrams</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A free-body diagram (FBD) is a sketch of a single object showing all external forces acting on it
        as arrows pointing away from the object's center. The length of the arrow represents the magnitude
        of the force; the direction represents the direction. FBDs are essential for applying Newton's 2nd Law:
        once you have identified all forces, sum them vectorially to find F_net, then solve for a = F_net/m.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Common forces to include: weight W = mg (always downward), normal force N (perpendicular to surface),
        friction f = μN (opposing relative motion), tension T (along the rope/string), applied force F_app
        (in the direction of push or pull), and air resistance (opposing velocity direction).
      </Typography>

      <Callout kind="try-this">
        Practice drawing FBDs for these scenarios: (1) a book resting on a flat table — weight down,
        normal up, net force = 0; (2) a box sliding down a frictionless ramp — weight down, normal
        perpendicular to ramp surface, net force along the ramp; (3) a ball swinging on a string —
        weight down, tension along the string toward the pivot. For each, check: does the net force
        match the observed acceleration (including zero acceleration)?
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>How Physics Domains Connect to Each Other</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The six domains in this course are not isolated — they are chapters of one story.
        Kinematics (how things move) feeds into energy (the capacity to do work depends on velocity and position).
        Energy flows through circuits (electrical energy = charge × voltage). Moving charges produce magnetic fields
        (connecting electricity to magnetism). Changing magnetic fields produce electric fields (connecting magnetism
        back to electricity through induction). Waves carry energy (tying into both mechanics and electromagnetism
        for light). Every domain you master makes the next domain easier to understand.
      </Typography>

      <Analogy title="Physics domains as floors of a building — each rests on the one below">
        Think of the six physics domains as floors of a building. Kinematics is the ground floor:
        everything rests on understanding motion. Energy and Momentum is the second floor, built
        directly on kinematics (kinetic energy depends on velocity; momentum is mass times velocity).
        Waves and Sound rise from energy principles. Light and Optics is wave physics applied to
        electromagnetic waves. Electricity and Circuits add charge and current. Magnetism is the
        top floor, synthesizing moving charges (electricity) with field theory. Each floor is
        usable on its own, but the building only stands because every floor supports the next.
      </Analogy>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Kinematics
// ─────────────────────────────────────────────────────────────────────
function Section2Kinematics() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Kinematics: Describing Motion</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Kinematics is the branch of physics that describes HOW objects move — their position, velocity,
        and acceleration — without asking WHY they move (that comes later with forces). The tools of
        kinematics are the SUVAT equations, which relate five quantities: displacement (s), initial
        velocity (u), final velocity (v), acceleration (a), and time (t). Mastery of kinematics is the
        foundation for every other area of mechanics.
      </Typography>

      <Analogy title="GPS tracking for displacement vs. distance">
        Imagine you walk from home to school by taking a winding path through the park — your GPS app
        records 2.3 km of total distance traveled. But the straight-line distance from home to school
        is only 1.1 km. Displacement is that straight-line measurement with a direction: "1.1 km north-east."
        Distance is the total path length: 2.3 km. If you walk to school and back, your distance is 4.6 km
        but your displacement is exactly zero — you ended where you started.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Core Kinematic Quantities</Typography>

      <GuideTable
        headers={['Quantity', 'Symbol', 'Type', 'SI unit', 'Definition']}
        rows={[
          ['Distance', 'd', 'Scalar', 'm', 'Total path length traveled — always ≥ 0'],
          ['Displacement', 's or Δx', 'Vector', 'm', 'Straight-line change in position; can be negative'],
          ['Speed', 'v (or v̄)', 'Scalar', 'm/s', 'Distance divided by time — always ≥ 0'],
          ['Velocity', 'v⃗', 'Vector', 'm/s', 'Displacement divided by time; direction matters'],
          ['Acceleration', 'a', 'Vector', 'm/s²', 'Rate of change of velocity; can be negative'],
          ['Time', 't', 'Scalar', 's', 'Duration of the motion'],
        ]}
      />

      <Callout kind="watch-for">
        Negative acceleration does NOT always mean "slowing down." If an object is moving in the negative
        direction and has a negative acceleration, it is actually speeding up (moving faster in the negative
        direction). To determine if an object is slowing down, check whether the velocity and acceleration
        have OPPOSITE signs — that is the condition for deceleration.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The SUVAT Equations</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The four SUVAT equations describe motion with constant acceleration. Each equation links four of the
        five kinematic quantities (s, u, v, a, t). Identify which quantity is unknown and which equation
        is missing the one variable you are not given — that is the equation to use.
      </Typography>

      <GuideTable
        headers={['Equation', 'Missing variable', 'When to use it']}
        rows={[
          ['v = u + at', 'Displacement s', 'Given u, a, t — find v'],
          ['s = ut + ½at²', 'Final velocity v', 'Given u, a, t — find displacement'],
          ['v² = u² + 2as', 'Time t', 'Given u, a, s — find v (or vice versa)'],
          ['s = ½(u + v)t', 'Acceleration a', 'Given u, v, t — find displacement'],
        ]}
      />

      <Analogy title="SUVAT equations as a recipe — you choose which one fits your ingredients">
        A chef has four recipes for potato dishes. Each recipe calls for a different combination of
        ingredients. If you have butter, cream, and potatoes but no rosemary, you pick the recipe that
        does not need rosemary. SUVAT equations work the same way: identify which of the five quantities
        (s, u, v, a, t) you do NOT have and do NOT need, then pick the equation that omits that variable.
        Always start a kinematics problem by listing what you know and what you want to find.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>SUVAT Equation Selection Flowchart</Typography>

      <MermaidDiagram chart={`graph TD
  A["List your known quantities:\ns, u, v, a, t"] --> B{"Which quantity\nis unknown/unneeded?"}
  B -->|"No s given or needed"| C["v = u + at"]
  B -->|"No v given or needed"| D["s = ut + ½at²"]
  B -->|"No t given or needed"| E["v² = u² + 2as"]
  B -->|"No a given or needed"| F["s = ½(u + v)t"]
  C --> G["Solve and check units"]
  D --> G
  E --> G
  F --> G`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Worked Example: Constant Acceleration</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A car accelerates from rest at 3.0 m/s² for 8.0 s. How far does it travel?
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Known: u = 0 m/s (starts from rest), a = 3.0 m/s², t = 8.0 s'}<br />
        {'Unknown: s'}<br />
        {'No v needed → use s = ut + ½at²'}<br />
        {'s = (0)(8.0) + ½(3.0)(8.0)²'}<br />
        {'s = 0 + ½(3.0)(64)'}<br />
        {'s = 96 m'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Free Fall: When Gravity Is the Only Force</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Free fall means the only acceleration acting on an object is due to gravity:
        <strong> g = 9.8 m/s² downward</strong> (often written as −9.8 m/s² when downward is negative).
        All objects near Earth's surface fall with the same acceleration regardless of mass — a feather
        and a bowling ball would fall identically if there were no air resistance (as famously demonstrated
        on the Moon by Apollo 15 astronauts).
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For free-fall problems, use SUVAT with a = −9.8 m/s² (taking up as positive).
        Key facts: at the top of a throw, v = 0 m/s but a is still −9.8 m/s².
        The time up equals the time down for symmetric throws.
      </Typography>

      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: A ball is thrown upward at 20 m/s. How high does it go?'}<br />
        {'Known: u = +20 m/s, v = 0 (at peak), a = −9.8 m/s²'}<br />
        {'Use: v² = u² + 2as → 0 = (20)² + 2(−9.8)s'}<br />
        {'0 = 400 − 19.6s → s = 400/19.6 ≈ 20.4 m'}
      </Box>

      <Callout kind="in-plain-words">
        At the very top of its arc, a thrown ball has zero velocity — but it still has acceleration
        downward at 9.8 m/s². Many students think acceleration must also be zero at the peak because
        the ball "stops for a moment." It does not stop for a moment — it is only instantaneously at zero
        velocity while continuously being pulled downward. Think of it like a car at a traffic light that
        still has an engine ready to push it.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Projectile Motion: Two Independent Components</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Projectile motion is two-dimensional motion under gravity. The critical insight is that the
        horizontal and vertical components of motion are <strong>completely independent</strong>:
      </Typography>
      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li><strong>Horizontal:</strong> No horizontal force (ignoring air resistance) → constant horizontal velocity: x = v₀ₓ · t</li>
        <li><strong>Vertical:</strong> Gravity acts downward → SUVAT applies vertically with a = −9.8 m/s²</li>
        <li>Both components share the same <strong>time of flight</strong> — that is how they are linked</li>
      </Box>

      <Typography sx={{ mt: 1.5, mb: 1, lineHeight: 1.75 }}>
        <strong>Example:</strong> A ball is launched horizontally at 15 m/s from a cliff 45 m high.
        How far from the base of the cliff does it land?
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Step 1: Find time using vertical: s = ut + ½at²'}<br />
        {'45 = 0·t + ½(9.8)t²  →  t² = 45/4.9 ≈ 9.18  →  t ≈ 3.03 s'}<br />
        {'Step 2: Find horizontal distance: x = v₀ₓ · t = 15 × 3.03 ≈ 45.5 m'}
      </Box>

      <Callout kind="try-this">
        Set up every projectile problem in a two-column table: one column for horizontal quantities
        (vₓ, x, t) and one column for vertical quantities (u_y, v_y, y, a, t). The time t is the
        bridge between the two columns. Solve whichever column has enough information first, find t,
        then use t to solve the other column. This structured approach prevents confusing horizontal
        and vertical components — the most common error in projectile problems.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Velocity-Time Graphs</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Velocity-time (v-t) graphs are powerful analysis tools. The slope of a v-t graph at any point
        equals the acceleration at that moment. The area under a v-t graph between two times equals
        the displacement in that interval. A horizontal line means constant velocity (zero acceleration).
        A straight sloped line means constant acceleration. A curved line means changing acceleration.
      </Typography>

      <GuideTable
        headers={['Graph feature', 'Physical meaning']}
        rows={[
          ['Positive slope on v-t graph', 'Positive acceleration (speeding up in + direction)'],
          ['Negative slope on v-t graph', 'Negative acceleration (slowing down or speeding up in − direction)'],
          ['Zero slope (horizontal) on v-t graph', 'Constant velocity, zero acceleration'],
          ['Area above x-axis on v-t graph', 'Positive displacement (moving in + direction)'],
          ['Area below x-axis on v-t graph', 'Negative displacement (moving in − direction)'],
          ['Crossing the x-axis on v-t graph', 'Object reverses direction'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Position-Time Graphs</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A position-time (x-t) graph shows how an object's position changes over time.
        The <strong>slope</strong> of an x-t graph at any instant equals the instantaneous velocity at that moment.
        A straight line on an x-t graph means constant velocity (zero acceleration).
        A curved line means changing velocity (non-zero acceleration). Concave up = positive acceleration;
        concave down = negative acceleration.
      </Typography>

      <GuideTable
        headers={['Position-time graph feature', 'Physical meaning']}
        rows={[
          ['Positive slope', 'Moving in the positive direction (positive velocity)'],
          ['Negative slope', 'Moving in the negative direction (negative velocity)'],
          ['Zero slope (horizontal line)', 'Object is stationary (v = 0)'],
          ['Steep slope', 'High speed'],
          ['Shallow slope', 'Low speed'],
          ['Straight line with any slope', 'Constant velocity (no acceleration)'],
          ['Curved upward (concave up)', 'Accelerating in positive direction'],
          ['Curved downward (concave down)', 'Decelerating (negative acceleration)'],
        ]}
      />

      <Callout kind="connect">
        The three kinematic graphs (x-t, v-t, a-t) are mathematical derivatives of each other.
        The slope of the x-t graph gives you the v-t graph. The slope of the v-t graph gives you
        the a-t graph. Working in reverse (integration): the area under the v-t graph gives
        displacement; the area under the a-t graph gives velocity change. If you are given one graph,
        you can always construct the others — this is a powerful test-taking skill.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Relative Motion and Reference Frames</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Velocity is always measured relative to a reference frame. A passenger walking at 2 m/s toward
        the front of a train moving at 20 m/s relative to the ground is moving at 22 m/s relative to
        the ground. To find the velocity of A relative to C: v(A→C) = v(A→B) + v(B→C).
        In other words, you can chain reference frames by adding (vectorially) the velocities.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: Boat crosses a river.'}<br />
        {'Boat speed relative to water: 5 m/s east'}<br />
        {'River current speed: 3 m/s south'}<br />
        {'Boat speed relative to ground: √(5² + 3²) = √34 ≈ 5.83 m/s at angle south of east'}<br />
        {'θ = arctan(3/5) ≈ 31° south of east'}
      </Box>

      <Callout kind="make-it-stick">
        In kinematics, always establish your sign convention explicitly before solving: typically
        "right is positive, left is negative" or "up is positive, down is negative." Write this at
        the top of your work. Then apply it consistently — if an object moves left, its velocity
        is negative. If gravity pulls down and you chose up as positive, g = −9.8 m/s².
        Inconsistent sign conventions are the number one source of sign errors in kinematics.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Circular Motion Preview</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For an object moving in a circle at constant speed, the speed is constant but the velocity is
        not — direction continuously changes. This means there is acceleration: centripetal acceleration
        directed toward the center of the circle. <strong>a_c = v²/r</strong> where v is the speed and r
        is the radius. The centripetal force (the net force causing this acceleration) is
        <strong> F_c = mv²/r</strong>. Centripetal force is not a new kind of force — it is the label
        for whatever force (tension, gravity, normal force, friction) is directed toward the center.
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Energy & Momentum
// ─────────────────────────────────────────────────────────────────────
function Section3EnergyMomentum() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Work, Energy, and Power</Typography>

      <Analogy title="Energy as currency — it changes hands but is never created or destroyed">
        Think of energy as money in the universe's bank account. You can transfer money between accounts
        (convert energy forms), you can owe money (negative work), and you can earn interest (add energy
        from an external source). But the total amount of money in the entire system never changes —
        energy is conserved. Kinetic energy is cash in your wallet; potential energy is money in a
        savings account; thermal energy is coins that spilled on the floor and are hard to collect
        back — but they are still money.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Work</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Work is done when a force causes a displacement in the direction of the force.
        The definition: <strong>W = F · d · cosθ</strong> where θ is the angle between the force vector
        and the displacement vector. Work is a scalar measured in joules (J = N·m).
      </Typography>

      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>θ = 0° (force parallel to motion): W = Fd — maximum positive work</li>
        <li>θ = 90° (force perpendicular to motion): W = 0 — no work done (e.g., normal force on horizontal surface)</li>
        <li>θ = 180° (force opposite to motion): W = −Fd — negative work (friction, braking)</li>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Kinetic Energy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Kinetic energy is the energy an object has because of its motion:
        <strong> KE = ½mv²</strong>. Mass is in kg, speed in m/s, energy in J.
        The Work-Energy Theorem states that the net work done on an object equals its change in kinetic energy:
        <strong> W_net = ΔKE = KE_f − KE_i</strong>.
      </Typography>

      <Callout kind="watch-for">
        In the formula KE = ½mv², the velocity is squared. This means doubling the speed quadruples
        the kinetic energy. A car going 60 mph has FOUR times the kinetic energy of a car going 30 mph,
        not twice. This is why high-speed collisions are so much more destructive — and why speed limits
        matter so much more than people intuitively expect.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Potential Energy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Gravitational potential energy is stored energy due to height:
        <strong> PE = mgh</strong> where m is mass (kg), g = 9.8 m/s², and h is height above the chosen
        reference level (m). The reference level (where PE = 0) is arbitrary — only changes in PE matter.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Elastic potential energy is stored in a stretched or compressed spring:
        <strong> PE_spring = ½kx²</strong> where k is the spring constant (N/m) and x is the displacement
        from the natural length (m). Springs obey Hooke's Law: F = −kx (the restoring force is
        proportional to and opposite to displacement).
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Conservation of Mechanical Energy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In a system with no non-conservative forces (no friction, no air resistance), total mechanical
        energy E = KE + PE is conserved:
        <strong> KE_i + PE_i = KE_f + PE_f</strong>.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: A 2 kg ball rolls off a shelf 5 m high. What is its speed at the bottom?'}<br />
        {'PE_i = mgh = 2 × 9.8 × 5 = 98 J,  KE_i = 0'}<br />
        {'At bottom: PE_f = 0,  KE_f = 98 J'}<br />
        {'½mv² = 98  →  v² = 98/1 = 98  →  v ≈ 9.9 m/s'}
      </Box>

      <MermaidDiagram chart={`graph LR
  A["Gravitational PE\n(height, stationary)"] -->|"Object falls"| B["Kinetic Energy\n(moving)"]
  B -->|"Object rises"| A
  B -->|"Friction acts"| C["Thermal Energy\n(heat — dispersed)"]
  A -->|"Spring compressed"| D["Elastic PE\n(spring)"]
  D -->|"Spring releases"| B
  B -->|"Generator"| E["Electrical Energy"]
  E -->|"Light bulb"| F["Light + Heat"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Power</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Power is the rate at which work is done (or energy is transferred):
        <strong> P = W/t = ΔE/t</strong>. Unit: watt (W = J/s).
        Equivalently, P = F · v (force times velocity) for a constant force.
        A 100 W light bulb uses 100 joules of energy every second.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Momentum and Impulse</Typography>

      <Analogy title="Momentum as a freight train — hard to start, harder to stop">
        A ping-pong ball moving at 10 m/s is easy to catch barehanded. A 10,000 kg freight train
        moving at 10 m/s would destroy you. Both have the same speed, but the train has millions of times
        more momentum (p = mv). Momentum captures not just how fast something moves, but how much mass
        is behind that motion — which determines how hard it is to change that motion. The more momentum,
        the larger the force or the longer the time needed to stop it.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Momentum and Impulse Formulas</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Linear momentum: <strong>p = mv</strong> (vector, kg·m/s). Direction of momentum = direction of velocity.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Impulse: <strong>J = FΔt = Δp</strong> (vector, N·s = kg·m/s). The impulse-momentum theorem states
        that the impulse applied to an object equals its change in momentum. This is why airbags save lives:
        they increase the time Δt of impact, which reduces the force F needed to produce the same change in momentum.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Conservation of Momentum</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        In a closed system (no external forces), total momentum is conserved:
        <strong> p_total_before = p_total_after</strong>.
        For two objects: <strong>m₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f</strong>.
        This law holds regardless of whether the collision is elastic or inelastic.
      </Typography>

      <GuideTable
        headers={['Collision type', 'Definition', 'What is conserved', 'Example']}
        rows={[
          ['Elastic', 'Objects bounce off — no permanent deformation', 'Both momentum AND kinetic energy', 'Billiard balls, atomic collisions'],
          ['Inelastic', 'Objects deform — some KE lost to heat/sound', 'Momentum only (not KE)', 'Clay hitting a wall, car crash'],
          ['Perfectly inelastic', 'Objects stick together after collision', 'Momentum only; maximum KE lost', 'Football tackle, coupling train cars'],
        ]}
      />

      <Callout kind="in-plain-words">
        In any collision, momentum is always conserved (if there is no external force). Kinetic energy
        is NOT always conserved — in real collisions, some energy goes into deforming metal, making
        sound, and generating heat. The total energy is still conserved (First Law of Thermodynamics),
        but the mechanical kinetic energy decreases. Only perfectly elastic collisions conserve both.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Worked Collision Example</Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Perfectly inelastic: 3 kg cart at 4 m/s hits 1 kg cart at rest. They stick together.'}<br />
        {'Before: p = 3×4 + 1×0 = 12 kg·m/s'}<br />
        {'After: (3+1)v_f = 12  →  v_f = 3 m/s'}<br />
        {'KE before: ½(3)(16) = 24 J'}<br />
        {'KE after: ½(4)(9) = 18 J'}<br />
        {'KE lost = 6 J → became heat/sound/deformation'}
      </Box>

      <Callout kind="connect">
        The law of conservation of momentum is a consequence of Newton's Third Law: when two objects
        collide, they exert equal and opposite forces on each other for the same duration, producing
        equal and opposite impulses. The momentum gained by one object equals the momentum lost by the
        other — so the total is unchanged. Conservation laws always have a deeper symmetry behind them.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Simple Machines and Mechanical Advantage</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A simple machine is a device that changes the magnitude or direction of a force. Simple machines
        do not create energy — they trade force for distance (or vice versa) while keeping work constant
        (W = Fd; to reduce F, you must increase d proportionally).
        The <strong>mechanical advantage (MA)</strong> of a machine = output force / input force = d_in / d_out.
      </Typography>

      <GuideTable
        headers={['Simple machine', 'Mechanical advantage', 'Trade-off', 'Real example']}
        rows={[
          ['Lever (1st class)', 'MA = effort arm / load arm', 'Longer effort arm → less force, more distance', 'Seesaw, crowbar, scissors'],
          ['Inclined plane (ramp)', 'MA = length / height', 'Longer ramp → less force, more distance traveled', 'Loading ramp, wheelchair ramp'],
          ['Pulley (single fixed)', 'MA = 1 (redirects force)', 'Changes direction only, not magnitude', 'Flagpole, well bucket'],
          ['Pulley (multiple)', 'MA = number of ropes supporting load', 'Each additional rope halves force needed', 'Block and tackle systems'],
          ['Wheel and axle', 'MA = radius of wheel / radius of axle', 'Large wheel → large MA', 'Steering wheel, screwdriver'],
          ['Wedge', 'MA = length / width', 'Narrow wedge → less force needed', 'Knife, axe, doorstop'],
        ]}
      />

      <Callout kind="why-it-matters">
        The concept of mechanical advantage is at the heart of all engineering. Every tool ever invented
        is essentially a way to redirect or multiply force while conserving energy. When you use a wrench
        to turn a bolt, the wrench acts as a lever — a longer wrench requires less force for the same
        turning moment (torque = force × lever arm length). Torque = F × r, the rotational equivalent
        of force. Understanding simple machines connects the abstract physics of energy conservation to
        the practical world of tools and technology.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Gravitational Potential Energy and Roller Coasters</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A roller coaster is a perfect energy conversion machine. At the top of the first hill, the coaster
        has maximum gravitational PE (all stored energy). As it descends, PE converts to KE (speed increases).
        At the bottom, KE is maximum. Going up the next hill, KE converts back to PE. In a frictionless
        ideal system, the coaster could return to the exact same height. In reality, friction and air
        resistance convert some mechanical energy to heat — this is why each subsequent hill must be
        lower than the one before.
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Coaster (mass 500 kg) starts from rest at height 30 m. Find speed at height 10 m.'}<br />
        {'Assume no friction: KE_i + PE_i = KE_f + PE_f'}<br />
        {'0 + mgh_i = ½mv² + mgh_f'}<br />
        {'(9.8)(30) = ½v² + (9.8)(10)'}<br />
        {'294 = ½v² + 98'}<br />
        {'½v² = 196  →  v² = 392  →  v ≈ 19.8 m/s'}
      </Box>

      <Callout kind="coachs-note">
        On energy conservation problems, mass often cancels out — set it up algebraically first before
        substituting numbers. If you divide both sides by m at the start, the calculation becomes
        simpler. This is a neat time-saver that also reveals something profound: in the absence of
        friction, all objects — regardless of mass — reach the same speed at the same height. A marble
        and a bowling ball starting from the same height on a frictionless ramp arrive at the bottom
        with identical speeds. (This mirrors Galileo's free-fall insight.)
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 4: Waves & Sound
// ─────────────────────────────────────────────────────────────────────
function Section4WavesSound() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Waves: Energy Without Matter Transport</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A wave is a disturbance that transfers energy through a medium (or through empty space) without
        permanently moving the medium itself. When you throw a stone into a pond, the water ripples
        outward — energy travels, but the water molecules themselves only oscillate up and down
        around their original positions. Waves are one of the most fundamental mechanisms in nature for
        transporting energy.
      </Typography>

      <Analogy title="Waves as a stadium 'wave' — energy travels, people stay put">
        At a sports stadium, fans do the "wave": row after row stands up and sits down in sequence.
        The wave of motion travels all the way around the stadium at high speed, but no individual
        fan moves more than a meter. The wave carries something (the disturbance, the energy of the
        motion) around the stadium without any fan actually traveling to a new seat. That is exactly
        what a mechanical wave does through matter.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Wave Properties</Typography>

      <GuideTable
        headers={['Property', 'Symbol', 'Definition', 'Unit']}
        rows={[
          ['Wavelength', 'λ (lambda)', 'Distance from one crest to the next crest (or trough to trough)', 'm'],
          ['Frequency', 'f', 'Number of complete wave cycles per second', 'Hz (1 Hz = 1 cycle/s)'],
          ['Period', 'T', 'Time for one complete wave cycle — T = 1/f', 's'],
          ['Amplitude', 'A', 'Maximum displacement from the rest position — determines energy/loudness', 'm'],
          ['Wave speed', 'v', 'Speed at which the wave pattern moves: v = fλ', 'm/s'],
        ]}
      />

      <Typography sx={{ mt: 1.5, mb: 1.5, lineHeight: 1.75 }}>
        The fundamental wave equation: <strong>v = fλ</strong>. For a given medium, wave speed is constant.
        If frequency increases, wavelength must decrease proportionally to keep v constant.
        This is why high-pitched sound (high frequency) has shorter wavelength than low-pitched sound.
      </Typography>

      <Callout kind="make-it-stick">
        v = fλ is your go-to wave equation. Memorize it as "velocity equals frequency times lambda."
        The speed of sound in air at room temperature is approximately 343 m/s. The speed of light
        in a vacuum is c = 3 × 10⁸ m/s. These are constants that tell you the wave speed for a given
        medium — plug them in with either f or λ to find the other.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Transverse vs. Longitudinal Waves</Typography>

      <GuideTable
        headers={['Wave type', 'Direction of oscillation', 'Examples', 'Medium needed?']}
        rows={[
          ['Transverse', 'Perpendicular to wave travel direction', 'Light, water surface waves, string vibrations', 'No (light travels in vacuum)'],
          ['Longitudinal', 'Parallel to wave travel direction (compressions and rarefactions)', 'Sound, seismic P-waves', 'Yes — needs a medium to compress'],
        ]}
      />

      <MermaidDiagram chart={`graph LR
  A["Wave Types"] --> B["Transverse\nOscillation ⊥ to travel\n(e.g., light, rope wave)"]
  A --> C["Longitudinal\nOscillation ∥ to travel\n(e.g., sound in air)"]
  B --> D["Has crests and troughs\nWavelength measured\ncrest to crest"]
  C --> E["Has compressions (high pressure)\nand rarefactions (low pressure)\nWavelength = compression to compression"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Standing Waves</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When two identical waves travel in opposite directions and overlap, they produce a standing wave —
        a pattern that appears stationary. Standing waves form at specific resonant frequencies determined
        by the length of the medium (string, air column).
      </Typography>
      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li><strong>Nodes:</strong> Points of zero displacement — the wave always has zero amplitude here</li>
        <li><strong>Antinodes:</strong> Points of maximum displacement — the wave oscillates with maximum amplitude</li>
        <li><strong>Fundamental frequency (1st harmonic):</strong> Lowest resonant frequency — half a wavelength fits in the medium (for a fixed-fixed string)</li>
        <li>Harmonics are integer multiples of the fundamental: 2f₁, 3f₁, 4f₁ ...</li>
      </Box>

      <Callout kind="why-it-matters">
        Standing waves are why musical instruments work. A guitar string vibrates in standing wave
        patterns. The fundamental and overtones (harmonics) all vibrate simultaneously — the mix of
        harmonics determines the "timbre" (tone quality) that makes a guitar sound different from a
        piano. Longer strings produce lower fundamentals (lower pitch). Tightening a string raises the
        wave speed and thus the fundamental frequency — that is how you tune a guitar.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Doppler Effect</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The Doppler effect is the change in observed frequency when a wave source and observer are
        moving relative to each other. When the source moves toward you, wave crests are compressed
        together (shorter wavelength) → higher observed frequency (higher pitch). When the source
        moves away, crests are spread apart (longer wavelength) → lower observed frequency.
      </Typography>

      <Analogy title="Doppler effect as a passing ambulance siren">
        You are standing at a street corner. An ambulance approaches you with its siren on.
        As it comes toward you, the siren sounds higher in pitch than its true frequency —
        the motion compresses the sound waves in front of the ambulance. The moment it passes
        and moves away, the pitch drops noticeably. You did not change position; the frequency
        of the siren did not change. Only the relative motion changed, and that changed what you heard.
        Police radar guns and weather radar use this same principle to measure speed.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sound Intensity and Decibels</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Sound intensity is the power per unit area (W/m²). The human ear perceives intensity on a
        logarithmic scale — we sense equal ratios of intensity as equal steps of loudness.
        Decibels (dB) quantify loudness: <strong>dB = 10 · log(I/I₀)</strong> where I₀ = 10⁻¹² W/m² is
        the threshold of hearing. Every increase of 10 dB represents a tenfold increase in intensity.
      </Typography>

      <GuideTable
        headers={['Sound', 'Approximate dB', 'Intensity (W/m²)']}
        rows={[
          ['Threshold of hearing', '0 dB', '10⁻¹² W/m²'],
          ['Whisper', '30 dB', '10⁻⁹ W/m²'],
          ['Normal conversation', '60 dB', '10⁻⁶ W/m²'],
          ['Rock concert', '110 dB', '10⁻¹ W/m²'],
          ['Jet engine at 30 m', '140 dB', '10² W/m²'],
        ]}
      />

      <Callout kind="watch-for">
        A common mistake is thinking that "double the loudness" means "double the decibels."
        It does not. The decibel scale is logarithmic. Doubling the intensity adds only about 3 dB.
        To double the perceived loudness (which our brains interpret subjectively), you need about
        10 dB more — which means 10 times more intensity. Logarithmic scales compress a huge range
        of values into a manageable scale.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Resonance</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Resonance occurs when an object is driven at its natural frequency, causing it to vibrate
        with maximum amplitude. Every object has one or more natural frequencies determined by its
        physical properties (mass, stiffness, shape). When an external force matches one of these
        frequencies, energy is added most efficiently and amplitude grows rapidly.
        Famous examples include: the Tacoma Narrows Bridge (collapsed due to wind-driven resonance),
        opera singers shattering wine glasses (resonant frequency of glass), and microwave ovens
        (water molecules resonate at the microwave frequency, generating heat from inside).
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Wave Behavior: Reflection, Refraction, Diffraction, and Interference</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        All waves — mechanical and electromagnetic — exhibit four behaviors when they encounter
        obstacles or boundaries:
      </Typography>
      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.75, fontSize: '0.92rem' } }}>
        <li>
          <strong>Reflection:</strong> The wave bounces off a surface. The angle of incidence equals
          the angle of reflection (same law as for light). Echoes are sound reflections;
          sonar and radar both use wave reflection to detect objects.
        </li>
        <li>
          <strong>Refraction:</strong> The wave changes direction when it moves from one medium to another
          due to a change in wave speed. Sound refracts — it bends toward cooler air (where it travels
          slower), which is why sounds carry further on cold nights.
        </li>
        <li>
          <strong>Diffraction:</strong> The wave bends around the edges of an obstacle or through a small
          opening. Significant when the wavelength is comparable to the obstacle size. This is why you
          can hear someone talking around a corner (sound wavelengths are similar in scale to doorways)
          but cannot see them (light wavelengths are far smaller than doorways, so light diffracts negligibly).
        </li>
        <li>
          <strong>Interference:</strong> When two waves overlap, they superpose. Constructive interference
          (crest meets crest) produces larger amplitude. Destructive interference (crest meets trough)
          reduces amplitude. Noise-canceling headphones use destructive interference to cancel environmental
          sound by generating an anti-phase sound wave.
        </li>
      </Box>

      <GuideTable
        headers={['Wave behavior', 'Occurs when...', 'Key rule or formula', 'Example']}
        rows={[
          ['Reflection', 'Wave hits a boundary and bounces back', 'θ_incidence = θ_reflection', 'Echo, sonar, radar'],
          ['Refraction', 'Wave enters a new medium with different speed', 'Wave bends toward slower medium', 'Sound bending around temperature layers'],
          ['Diffraction', 'Wave passes through small opening or around edge', 'Most significant when λ ≈ gap size', 'Sound around corners; radio waves over hills'],
          ['Constructive interference', 'Two waves arrive in phase (crests align)', 'Amplitude_total = A₁ + A₂', 'Loud spots at concert (acoustic hot spots)'],
          ['Destructive interference', 'Two waves arrive out of phase (crest meets trough)', 'Amplitude_total = |A₁ − A₂|', 'Noise-canceling headphones, quiet spots in room'],
        ]}
      />

      <Callout kind="make-it-stick">
        The principle of superposition: when two waves overlap, the total displacement at each point
        is the algebraic sum of the individual displacements. This principle underlies all of wave
        physics — interference, diffraction, standing waves. It holds as long as the waves are in a
        linear medium (small amplitudes). For sound waves in air and light waves in most situations,
        superposition holds perfectly.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Speed of Sound in Different Media</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The speed of sound depends on the medium — specifically on its elasticity (restoring force)
        and density. In general: stiffer and lighter materials carry sound faster.
        Sound travels about 4× faster in water than in air, and about 15× faster in steel than in air.
        This is why you can hear a train coming by placing your ear on the rail long before you hear
        it through the air.
      </Typography>

      <GuideTable
        headers={['Medium', 'Approximate speed of sound', 'Notes']}
        rows={[
          ['Air (20°C)', '343 m/s', 'Increases by ~0.6 m/s per °C increase in temperature'],
          ['Water (25°C)', '~1480 m/s', 'Used in sonar and underwater communication'],
          ['Concrete', '~3100 m/s', 'Building structures transmit vibration efficiently'],
          ['Steel', '~5100 m/s', 'Why you can hear trains through the rail'],
          ['Vacuum', '0 m/s', 'Sound cannot travel — no medium to compress'],
        ]}
      />

      <Callout kind="watch-for">
        Sound CANNOT travel through a vacuum — it is a mechanical wave that requires a medium of
        particles to compress and rarify. Light CAN travel through a vacuum — it is an electromagnetic
        wave that requires no medium. The dramatic space battle scenes in movies with loud explosions
        are physically impossible: in the vacuum of space, those explosions would be completely silent.
        "In space, no one can hear you scream" — Alien (1979) — is scientifically correct.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Light & Optics
// ─────────────────────────────────────────────────────────────────────
function Section5LightOptics() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Light: An Electromagnetic Wave</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Light is an electromagnetic (EM) wave — oscillating electric and magnetic fields that travel
        through space at c = 3 × 10⁸ m/s in a vacuum. Unlike mechanical waves, light requires no
        medium. The visible spectrum is a tiny slice of the full EM spectrum, ranging from
        violet (λ ≈ 400 nm, f ≈ 7.5 × 10¹⁴ Hz) to red (λ ≈ 700 nm, f ≈ 4.3 × 10¹⁴ Hz).
      </Typography>

      <GuideTable
        headers={['EM radiation type', 'Wavelength range', 'Frequency range', 'Common use']}
        rows={[
          ['Radio waves', '> 1 mm', '< 3 × 10¹¹ Hz', 'AM/FM radio, TV, WiFi'],
          ['Microwaves', '1 mm – 1 m', '3×10⁸ – 3×10¹¹ Hz', 'Microwave ovens, radar'],
          ['Infrared', '700 nm – 1 mm', '3×10¹¹ – 4×10¹⁴ Hz', 'Heat sensing, TV remotes'],
          ['Visible light', '400 – 700 nm', '4×10¹⁴ – 7.5×10¹⁴ Hz', 'Vision, photography'],
          ['Ultraviolet', '10 – 400 nm', '7.5×10¹⁴ – 3×10¹⁶ Hz', 'Sterilization, sunburn'],
          ['X-rays', '0.01 – 10 nm', '3×10¹⁶ – 3×10¹⁹ Hz', 'Medical imaging'],
          ['Gamma rays', '< 0.01 nm', '> 3×10¹⁹ Hz', 'Cancer treatment, nuclear physics'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Reflection</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The Law of Reflection: <strong>angle of incidence = angle of reflection (θᵢ = θᵣ)</strong>.
        Both angles are measured from the normal (a line perpendicular to the surface at the point of reflection).
        Specular reflection occurs on smooth surfaces (mirror-like); diffuse reflection occurs on rough
        surfaces (the light scatters in many directions — this is why most objects are visible from any angle).
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Refraction and Snell's Law</Typography>

      <Analogy title="Light bending at a medium boundary — the straw-in-water illusion">
        Place a straw in a glass of water at an angle. The straw appears bent at the water surface.
        This is refraction: light changes speed when it moves between media of different densities,
        and this change in speed causes a change in direction (like a car's front wheel hitting mud
        on one side before the other, causing it to turn). Light slows down in denser media.
        The bending follows a precise mathematical law — Snell's Law.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Snell's Law: <strong>n₁ sin θ₁ = n₂ sin θ₂</strong>. The index of refraction n = c/v
        (where v is the speed of light in the medium). Higher n means slower light, more bending.
        Vacuum: n = 1. Air: n ≈ 1.0003. Water: n ≈ 1.33. Glass: n ≈ 1.5. Diamond: n ≈ 2.42.
      </Typography>

      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: Light travels from water (n=1.33) into glass (n=1.5).'}<br />
        {'Angle of incidence = 40°. Find the angle of refraction.'}<br />
        {'1.33 × sin(40°) = 1.5 × sin(θ₂)'}<br />
        {'1.33 × 0.643 = 1.5 × sin(θ₂)'}<br />
        {'0.855 = 1.5 × sin(θ₂)'}<br />
        {'sin(θ₂) = 0.570  →  θ₂ = 34.7°'}<br />
        {'Light bends toward the normal (into denser medium → smaller angle) ✓'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Total Internal Reflection</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When light travels from a denser medium to a less dense medium, it bends away from the normal.
        At the critical angle θ_c, the refracted ray runs exactly along the interface (θ₂ = 90°).
        Beyond this angle, all light is reflected back into the denser medium — total internal reflection.
        sin θ_c = n₂/n₁ (where n₁ &gt; n₂). Fiber optic cables work by trapping light inside a glass core
        using total internal reflection, allowing nearly lossless signal transmission over thousands of kilometers.
      </Typography>

      <Callout kind="connect">
        Total internal reflection also explains why diamonds sparkle so brilliantly. Diamond has a
        very high index of refraction (n = 2.42), so its critical angle is only about 24°. Light
        entering the diamond from many angles undergoes total internal reflection multiple times before
        exiting — each bounce disperses it into rainbow colors because n varies slightly with wavelength.
        Diamond cutters angle the facets precisely to maximize this effect.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Mirrors</Typography>

      <Analogy title="Concave mirror as a magnifying glass for light — focusing it to a point">
        A concave (converging) mirror is like a satellite dish. Parallel rays coming in bounce off
        the curved surface and all converge at one point — the focal point. This is why a concave
        mirror can burn paper (focus sunlight to a point of intense heat) and why car headlights
        use concave mirrors to focus light into a beam. A convex (diverging) mirror spreads rays
        outward — the image is always smaller and virtual, which is why convex mirrors are used
        as wide-angle security mirrors and car side mirrors ("objects may be closer than they appear").
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The mirror equation: <strong>1/f = 1/d_o + 1/d_i</strong> where f is focal length,
        d_o is object distance, d_i is image distance (all measured from the mirror vertex).
        Magnification: <strong>m = −d_i/d_o = h_i/h_o</strong>.
      </Typography>

      <GuideTable
        headers={['Quantity', 'Sign convention', 'Meaning']}
        rows={[
          ['f (focal length)', 'Positive for concave (converging) mirror', 'Focus is in front of the mirror'],
          ['f (focal length)', 'Negative for convex (diverging) mirror', 'Focus is behind the mirror'],
          ['d_i (image distance)', 'Positive: real image (in front of mirror)', 'Image can be projected on a screen'],
          ['d_i (image distance)', 'Negative: virtual image (behind mirror)', 'Image cannot be projected on a screen'],
          ['m (magnification)', 'Positive: upright image', 'Same orientation as object'],
          ['m (magnification)', 'Negative: inverted image', 'Upside down relative to object'],
          ['|m| > 1', 'Magnified (larger than object)', '|m| < 1 means reduced (smaller)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Lenses</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The thin lens equation is the same as the mirror equation: <strong>1/f = 1/d_o + 1/d_i</strong>.
        A converging (convex) lens has positive focal length; a diverging (concave) lens has negative focal length.
        The sign conventions are the same as for mirrors, except that "behind the lens" is now on the
        transmission side (where real images form for converging lenses when object is beyond f).
      </Typography>

      <MermaidDiagram chart={`graph LR
  A["Optics device"] --> B{Type?}
  B -->|"Mirror"| C{Concave or Convex?}
  B -->|"Lens"| D{Converging or Diverging?}
  C -->|"Concave"| E["f > 0, can form real OR virtual image\n1/f = 1/do + 1/di"]
  C -->|"Convex"| F["f < 0, always virtual, upright, reduced image\n1/f = 1/do + 1/di"]
  D -->|"Converging (convex lens)"| G["f > 0, forms real image if do > f\nUsed in cameras, projectors, eyes"]
  D -->|"Diverging (concave lens)"| H["f < 0, always virtual, upright, reduced\nUsed for nearsightedness correction"]`} />

      <Callout kind="try-this">
        Memorize the four key image cases for a converging lens: (1) object very far away → real image
        at f; (2) object beyond 2f → real, inverted, reduced image between f and 2f; (3) object between
        f and 2f → real, inverted, magnified image beyond 2f; (4) object inside f → virtual, upright,
        magnified image on same side as object (like a magnifying glass). Draw ray diagrams for each case —
        two rays are enough: one parallel to the axis (refracts through f) and one through the center (straight through).
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Real vs. Virtual Images</Typography>
      <GuideTable
        headers={['Property', 'Real image', 'Virtual image']}
        rows={[
          ['Light rays', 'Actually converge at the image location', 'Appear to diverge from image — rays do not actually meet there'],
          ['Image location', 'In front of a mirror; on far side of a converging lens', 'Behind a mirror; same side as object for diverging lens'],
          ['Projectable?', 'Yes — can be cast on a screen', 'No — cannot be projected on a screen'],
          ['Orientation', 'Usually inverted', 'Usually upright'],
          ['d_i sign', 'Positive', 'Negative'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Dispersion and Color</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        White light is a mixture of all visible wavelengths (colors). When white light enters a glass prism,
        different wavelengths refract by different amounts — violet refracts most, red refracts least.
        This is <strong>dispersion</strong>: the separation of light into its component colors.
        The index of refraction is slightly different for each wavelength in glass (a property called
        chromatic dispersion), causing the angular spread. A rainbow is dispersion by raindrops:
        each drop refracts, internally reflects, and refracts again, with each wavelength exiting
        at a slightly different angle.
      </Typography>

      <GuideTable
        headers={['Color', 'Wavelength (nm)', 'Relative refraction in glass', 'Mnemonic']}
        rows={[
          ['Violet', '~400', 'Most (bends most)', 'ROY G BIV — read backwards for increasing wavelength'],
          ['Indigo', '~445', 'Second most', ''],
          ['Blue', '~475', 'High', ''],
          ['Green', '~510', 'Medium', ''],
          ['Yellow', '~580', 'Medium-low', ''],
          ['Orange', '~600', 'Low', ''],
          ['Red', '~700', 'Least (bends least)', ''],
        ]}
      />

      <Callout kind="in-plain-words">
        The order of colors in a rainbow (red at top, violet at bottom) is the result of different
        refraction angles. Red bends least, so it exits at a shallower angle — appearing at the top of
        the arc. Violet bends most, exiting at a steeper angle — appearing at the bottom. The mnemonic
        ROY G BIV (Red, Orange, Yellow, Green, Blue, Indigo, Violet) gives the order from outside to
        inside the rainbow arc — and from longest to shortest wavelength.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Polarization</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Light is a transverse electromagnetic wave — the electric field oscillates perpendicular to the
        direction of travel. Ordinary (unpolarized) light has electric field oscillations in all
        perpendicular directions. A <strong>polarizing filter</strong> transmits only those waves whose
        electric field is aligned with the filter's polarization axis, blocking all others.
        This reduces intensity by 50% for unpolarized light. Passing polarized light through a second
        filter (the "analyzer") at angle θ further reduces intensity by cos²θ (Malus's Law: I = I₀cos²θ).
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Polarization has practical applications: polarized sunglasses reduce glare from horizontal
        surfaces (reflected light is horizontally polarized; the vertical-axis filter blocks it).
        LCD screens use two crossed polarizers with a liquid crystal layer that can rotate the
        polarization to control which pixels appear bright or dark.
      </Typography>

      <Callout kind="connect">
        The fact that light can be polarized is direct evidence that it is a transverse wave (oscillating
        perpendicular to propagation). Longitudinal waves like sound CANNOT be polarized — because their
        oscillations are parallel to propagation, there is only one direction of oscillation by definition.
        If a wave can be polarized, it must be transverse. This reasoning helped Maxwell and Hertz
        confirm the transverse nature of electromagnetic waves.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Electricity & Circuits
// ─────────────────────────────────────────────────────────────────────
function Section6ElectricityCircuits() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Electric Charge and Current</Typography>

      <Analogy title="Circuits as water pipes — voltage is pressure, current is flow rate, resistance is pipe narrowness">
        Imagine water flowing through a pipe system. The water pressure driving the flow is like
        voltage (V) — the higher the pressure, the harder water is pushed through. The flow rate
        (liters per second) is like current (I) — how much charge passes per second. A narrow pipe
        restricts flow — that is resistance (R). Ohm's Law (V = IR) is then obvious: for the same
        pressure (voltage), a narrower pipe (higher resistance) gives less flow (lower current).
        A wider pipe (lower resistance) gives more flow. The analogy breaks down for complex circuits,
        but it is a perfect starting point.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Basic Electrical Quantities</Typography>

      <GuideTable
        headers={['Quantity', 'Symbol', 'Unit', 'Definition']}
        rows={[
          ['Electric charge', 'Q', 'Coulomb (C)', 'Property of matter that causes electromagnetic force; elementary charge e = 1.6 × 10⁻¹⁹ C'],
          ['Electric current', 'I', 'Ampere (A)', 'Rate of charge flow: I = Q/t. Conventional current flows from + to − (opposite to electrons)'],
          ['Voltage (potential difference)', 'V', 'Volt (V = J/C)', 'Energy per unit charge; the "electrical pressure" driving current'],
          ['Resistance', 'R', 'Ohm (Ω)', 'Opposition to current flow; depends on material, length, cross-section, temperature'],
          ['Electric power', 'P', 'Watt (W)', 'Rate of energy transfer: P = IV = I²R = V²/R'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Ohm's Law</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>V = IR</strong> — voltage equals current times resistance. This relationship holds for
        ohmic conductors (metals at constant temperature). It can be rearranged as I = V/R (current =
        voltage divided by resistance) or R = V/I (resistance = voltage divided by current).
        Ohm's Law is the most frequently used equation in circuit analysis.
      </Typography>

      <Callout kind="watch-for">
        Power comes in three equivalent forms: P = IV, P = I²R, P = V²/R. Choose the form that uses
        the quantities you know. If you know current and resistance but not voltage, use P = I²R.
        If you know voltage and resistance but not current, use P = V²/R. Forgetting to choose the
        right form — or confusing which quantities to square — is one of the most common circuit errors.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Series vs. Parallel Circuits</Typography>

      <GuideTable
        headers={['Property', 'Series circuit', 'Parallel circuit']}
        rows={[
          ['Resistor connection', 'End-to-end in a single path', 'Side-by-side between two common nodes'],
          ['Total resistance', 'R_total = R₁ + R₂ + R₃ + ...', '1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + ...  (R_total < smallest R)'],
          ['Current', 'Same current I through all resistors', 'Splits — different current through each branch'],
          ['Voltage', 'Splits — V₁ + V₂ + V₃ = V_total', 'Same voltage across all resistors = V_total'],
          ['If one component fails (open)', 'Entire circuit goes dead', 'Other branches continue to work'],
          ['Real-world examples', 'Simple flashlights, old Christmas lights', 'Household wiring, electronics'],
        ]}
      />

      <Analogy title="Parallel circuits as a highway with multiple lanes — each lane carries its own traffic">
        A series circuit is like a single-lane road: all cars (electrons) must go through every
        toll booth (resistor) in sequence. If one booth closes, all traffic stops. A parallel
        circuit is like a multi-lane highway: cars can choose any lane. More lanes means less
        overall resistance (more routes for current to flow). Close one lane and traffic just
        redistributes to the remaining lanes — the circuit keeps working.
      </Analogy>

      <MermaidDiagram chart={`graph LR
  subgraph Series
    S1["Battery V"] --> S2["R₁"] --> S3["R₂"] --> S4["R₃"] --> S5["Back to −"]
  end
  subgraph Parallel
    P1["Battery V"] --> P2["Node A"]
    P2 --> P3["R₁"] --> P6["Node B"]
    P2 --> P4["R₂"] --> P6
    P2 --> P5["R₃"] --> P6
    P6 --> P7["Back to −"]
  end`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Worked Series Circuit Example</Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'3 resistors in series: R₁ = 4Ω, R₂ = 6Ω, R₃ = 2Ω. Battery V = 24 V.'}<br />
        {'R_total = 4 + 6 + 2 = 12 Ω'}<br />
        {'I = V/R = 24/12 = 2 A  (same everywhere in series)'}<br />
        {'V₁ = IR₁ = 2×4 = 8 V'}<br />
        {'V₂ = IR₂ = 2×6 = 12 V'}<br />
        {'V₃ = IR₃ = 2×2 = 4 V'}<br />
        {'Check: 8 + 12 + 4 = 24 V ✓'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Worked Parallel Circuit Example</Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'2 resistors in parallel: R₁ = 6Ω, R₂ = 12Ω. Battery V = 12 V.'}<br />
        {'1/R_total = 1/6 + 1/12 = 2/12 + 1/12 = 3/12  →  R_total = 4 Ω'}<br />
        {'I_total = V/R_total = 12/4 = 3 A'}<br />
        {'I₁ = V/R₁ = 12/6 = 2 A'}<br />
        {'I₂ = V/R₂ = 12/12 = 1 A'}<br />
        {'Check: 2 + 1 = 3 A = I_total ✓  (currents add at junction)'}
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Kirchhoff's Laws</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For complex circuits with multiple loops and junctions, Kirchhoff's Laws are the systematic tools:
      </Typography>
      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li><strong>Kirchhoff's Current Law (KCL):</strong> The sum of all currents entering a junction equals the sum of all currents leaving that junction. Current is conserved (charge cannot accumulate at a node). Think: what goes in must come out.</li>
        <li><strong>Kirchhoff's Voltage Law (KVL):</strong> The sum of all voltage changes around any closed loop equals zero. Energy is conserved — if you walk around a loop and return to the start, the net change in potential must be zero.</li>
      </Box>

      <Callout kind="in-plain-words">
        KCL is conservation of charge at a junction. KVL is conservation of energy around a loop.
        Together they are powerful enough to solve ANY circuit, no matter how complex. Series and
        parallel rules are just shortcuts that arise from applying KCL and KVL to simple topologies.
        When a circuit is too complex for the shortcut rules, always fall back to writing KCL and KVL equations.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Electrical Safety and Power</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Household circuits in the US run at 120 V (RMS). A circuit breaker interrupts current flow when
        current exceeds a safe level (e.g., 15 A or 20 A). The power dissipated in a resistor becomes
        heat — this is why overloaded circuits cause fires. Total power in a circuit:
        P_total = P₁ + P₂ + P₃ + ... (power always adds, regardless of series or parallel connection).
      </Typography>

      <Callout kind="coachs-note">
        On multiple-choice circuit problems, the fastest strategy is: (1) identify series vs. parallel;
        (2) find equivalent resistance; (3) find total current from Ohm's Law; (4) distribute voltage
        or current to individual components. Write down every intermediate value — do not try to hold
        numbers in your head. Circuit problems that span 4+ steps are easy to lose if you rush.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Capacitors: Storing Charge</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A capacitor stores electric charge (and electrical energy) by accumulating opposite charges on
        two conducting plates separated by an insulator. Capacitance C = Q/V (charge stored per volt of
        potential difference). Unit: Farad (F). In practice, capacitors are microfarads (μF = 10⁻⁶ F)
        or picofarads (pF = 10⁻¹² F). Energy stored in a capacitor: E = ½CV².
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Capacitors in series: 1/C_total = 1/C₁ + 1/C₂ + ... (total capacitance decreases — opposite
        of resistors!). Capacitors in parallel: C_total = C₁ + C₂ + ... (total capacitance increases).
        Note that these rules are reversed compared to resistors: capacitors in parallel add directly;
        capacitors in series add as reciprocals.
      </Typography>

      <Callout kind="watch-for">
        The rules for combining capacitors are the OPPOSITE of the rules for combining resistors.
        Resistors in series add directly (R_total = R₁ + R₂). Capacitors in series add as reciprocals
        (1/C = 1/C₁ + 1/C₂). Resistors in parallel add as reciprocals. Capacitors in parallel add directly.
        This is a classic trap on physics tests — do not apply resistor rules to capacitors or vice versa.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Electric Fields and Coulomb's Law</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Two electrically charged objects exert forces on each other via Coulomb's Law:
        <strong> F = k·q₁q₂/r²</strong> where k = 8.99 × 10⁹ N·m²/C² is Coulomb's constant,
        q₁ and q₂ are the charges (in coulombs), and r is the distance between them (in meters).
        Like charges repel; opposite charges attract. The force follows an inverse-square law —
        double the distance → one-quarter the force. This is the same mathematical form as Newton's
        Law of Universal Gravitation (F = Gm₁m₂/r²), which is why electric and gravitational fields
        share many mathematical properties.
      </Typography>

      <GuideTable
        headers={['Quantity', 'Gravity analogy', 'Coulomb\'s Law', 'Key difference']}
        rows={[
          ['Force law', 'F = Gm₁m₂/r²', 'F = kq₁q₂/r²', 'Electric can repel; gravity always attracts'],
          ['Field strength', 'g = GM/r² (gravitational field)', 'E = kQ/r² (electric field)', 'Electric field points away from +, toward −'],
          ['Constant', 'G = 6.67×10⁻¹¹ N·m²/kg²', 'k = 8.99×10⁹ N·m²/C²', 'k is vastly larger — electric force is far stronger than gravity at atomic scales'],
          ['Source', 'Mass (always positive)', 'Charge (positive or negative)', 'Charge can cancel; mass cannot'],
        ]}
      />

      <Callout kind="why-it-matters">
        The electric force is approximately 10³⁶ times stronger than gravity at the atomic scale —
        that is a trillion trillion trillion times stronger. The reason we do not notice this in
        everyday life is that matter is almost perfectly electrically neutral (equal amounts of positive
        and negative charge), so the forces cancel. Gravity dominates at large scales only because
        it has no negative "charge" — mass is always positive, so gravitational forces always add up.
        Understanding this helps explain why atoms hold together so tightly and why planets hold galaxies.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: Magnetism
// ─────────────────────────────────────────────────────────────────────
function Section7Magnetism() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Magnetic Fields</Typography>

      <Analogy title="Magnetic field as an invisible force field surrounding the magnet">
        Imagine a magnet wrapped in an invisible bubble of arrows — each arrow pointing in the
        direction a tiny compass needle would point if placed there. That invisible arrangement of
        directional arrows IS the magnetic field. Field lines exit from the north pole, curve through
        space, and re-enter at the south pole (outside the magnet). Inside the magnet, field lines
        run from south to north, completing closed loops. Wherever field lines are densely packed,
        the field is strong; where they are spread out, the field is weak. You cannot see this field,
        but iron filings make it visible by aligning with it.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A magnetic field (B) is a vector field — at every point in space, it has both a magnitude
        (measured in Tesla, T) and a direction. The field exerts forces only on moving charges and
        on current-carrying conductors; a stationary charge in a magnetic field feels no magnetic force.
        This is one of the key differences between electric and magnetic fields.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Magnetic Field Lines — Key Rules</Typography>
      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>Field lines run from <strong>N pole to S pole</strong> outside the magnet</li>
        <li>Field lines never cross each other</li>
        <li>Closer lines = stronger field; farther apart = weaker field</li>
        <li>Magnetic monopoles (isolated N or S poles) do not exist — break a magnet in half and you get two complete magnets, each with a N and S pole</li>
        <li>A current-carrying straight wire creates circular field lines around it (right-hand rule: thumb points in direction of current, fingers curl in direction of field)</li>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Force on a Moving Charge</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The magnetic force on a charge q moving with velocity v in a field B:
        <strong> F = qvB sinθ</strong> where θ is the angle between the velocity and the field vectors.
        Maximum force when v ⊥ B (θ = 90°). Zero force when v ∥ B (θ = 0° or 180°).
        The force is always perpendicular to both v and B — found using the right-hand rule.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Because the magnetic force is always perpendicular to velocity, it does no work on the charge
        — it cannot speed up or slow down the charge, only change its direction. This is why a charged
        particle moving in a uniform magnetic field traces a circular path (the force acts as centripetal force).
      </Typography>

      <Callout kind="in-plain-words">
        The right-hand rule for F = qvB: point your right hand's fingers in the direction of v (velocity),
        curl them toward B (field direction), and your thumb points in the direction of force on a
        positive charge. For a negative charge, the force is opposite — use your left hand instead,
        or flip the result of the right-hand rule. This rule is needed whenever a problem involves
        force on a charged particle moving through a magnetic field.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Force on a Current-Carrying Wire</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A wire carrying current I in a magnetic field B experiences a force:
        <strong> F = BIL sinθ</strong> where L is the length of wire in the field and θ is the angle
        between the current direction and the field. This force is the operating principle behind
        electric motors — the magnetic force on current-carrying coils creates rotation.
      </Typography>

      <GuideTable
        headers={['Scenario', 'Force formula', 'Key point']}
        rows={[
          ['Moving charge in field', 'F = qvB sinθ', 'Zero force if charge is stationary (v = 0)'],
          ['Current-carrying wire in field', 'F = BIL sinθ', 'Maximum force when wire is perpendicular to B'],
          ['Parallel wires with currents', 'Force ∝ I₁I₂/d', 'Same-direction currents attract; opposite-direction currents repel'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Electromagnetic Induction</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Faraday's Law of Electromagnetic Induction: a changing magnetic flux through a conductor induces
        an electromotive force (EMF) in the conductor.
        <strong> EMF = −ΔΦ/Δt</strong> where Φ = B · A · cosθ is the magnetic flux (B = field strength,
        A = area of loop, θ = angle between field and normal to loop). The negative sign enforces Lenz's Law.
      </Typography>

      <Callout kind="why-it-matters">
        Faraday's Law is the principle behind every generator on Earth. Rotating a coil in a magnetic
        field continuously changes the flux through the coil (as the angle between B and the coil normal
        changes), inducing an alternating EMF — alternating current (AC). Power plants, bicycle dynamos,
        wind turbines, and hydroelectric dams all use this principle. Without electromagnetic induction,
        there would be no electrical grid and no modern civilization.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Lenz's Law</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Lenz's Law: the induced current always flows in the direction that opposes the change in flux that
        caused it. If the flux is increasing, the induced current creates a field opposing the increase.
        If the flux is decreasing, the induced current creates a field opposing the decrease.
        Lenz's Law is a consequence of energy conservation — if induced currents reinforced the changing flux,
        they would generate unlimited energy from nothing (violating conservation of energy).
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Practical demonstration:</strong> Drop a strong magnet through a copper tube. The magnet
        falls much more slowly than normal. As the magnet moves, it induces currents in the copper that
        create a magnetic field opposing the magnet's motion — electromagnetic braking. No mechanical
        friction is involved; it is purely electromagnetic.
      </Typography>

      <MermaidDiagram chart={`graph TD
  A["Changing magnetic flux\nthrough a conducting loop"] -->|"Faraday's Law:\nEMF = −ΔΦ/Δt"| B["Induced EMF in the loop"]
  B -->|"If circuit is closed"| C["Induced current flows"]
  C -->|"Lenz's Law"| D["Induced current creates\na field that OPPOSES\nthe change in flux"]
  D --> E["Net effect: change in flux\nis slowed (never reversed)"]
  B --> F["Applications:\nGenerators, transformers,\ninduction stoves, MRI"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Transformers</Typography>

      <Analogy title="Transformer as a gear ratio for voltage — trade voltage for current or vice versa">
        A bicycle gear system lets you trade pedaling speed for torque: in a high gear (big rear
        sprocket), your wheel turns faster but you have to push harder. In a low gear, the wheel turns
        slower but you need less force. A transformer does the same for electricity: you can trade
        voltage for current (step-up: more voltage, less current) or current for voltage (step-down:
        less voltage, more current). The total power (V × I) stays the same — energy is conserved.
        This is why the electrical grid transmits power at extremely high voltage: less current means
        less energy lost to resistance in the wires (P_loss = I²R, so lower I means far less waste).
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A transformer has two coils (primary and secondary) wound around an iron core.
        The turn ratio determines the voltage ratio:
        <strong> V₁/V₂ = N₁/N₂</strong> (primary voltage / secondary voltage = primary turns / secondary turns).
        Conservation of energy gives: <strong>V₁I₁ = V₂I₂</strong> (assuming 100% efficiency).
      </Typography>
      <Box sx={{ fontFamily: 'monospace', fontSize: '0.88rem', p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflowX: 'auto', lineHeight: 2 }}>
        {'Example: Step-down transformer. N₁ = 2000 turns, N₂ = 100 turns, V₁ = 240 V.'}<br />
        {'V₂ = V₁ × (N₂/N₁) = 240 × (100/2000) = 240 × 0.05 = 12 V'}<br />
        {'If I₁ = 0.5 A: I₂ = V₁I₁/V₂ = (240 × 0.5)/12 = 10 A'}<br />
        {'Check: P_in = 240 × 0.5 = 120 W = P_out = 12 × 10 = 120 W ✓'}
      </Box>

      <GuideTable
        headers={['Transformer type', 'Turn ratio N₁:N₂', 'Voltage change', 'Current change', 'Use']}
        rows={[
          ['Step-up', 'N₁ < N₂', 'V₂ > V₁', 'I₂ < I₁', 'Power plant → transmission lines'],
          ['Step-down', 'N₁ > N₂', 'V₂ < V₁', 'I₂ > I₁', 'Transmission lines → homes, phone chargers'],
          ['Isolation (1:1)', 'N₁ = N₂', 'V₂ = V₁', 'I₂ = I₁', 'Safety isolation, medical equipment'],
        ]}
      />

      <Callout kind="watch-for">
        Transformers work ONLY with alternating current (AC), not with direct current (DC).
        AC continuously changes direction, so the magnetic flux through the core continuously changes,
        continuously inducing EMF in the secondary. DC creates a constant flux — no change means no
        induction. This is one reason Edison's DC power system lost out to Tesla's AC system in the
        "War of Currents" — AC can be efficiently transformed to different voltages for transmission,
        DC (at that time) could not.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Magnetic Fields from Current-Carrying Conductors</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A long, straight current-carrying wire creates circular magnetic field lines around it.
        The right-hand rule: point your right thumb in the direction of conventional current flow;
        your curled fingers show the direction of the magnetic field lines curling around the wire.
        Field strength decreases with distance from the wire: B = μ₀I/(2πr) where μ₀ = 4π × 10⁻⁷ T·m/A
        is the permeability of free space and r is the distance from the wire.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A current-carrying loop creates a magnetic field that looks like a bar magnet — field lines
        pass through the center of the loop in one direction and loop back outside. Stacking many loops
        makes a <strong>solenoid</strong>, which creates a nearly uniform magnetic field inside (like
        a bar magnet) with field strength B = μ₀nI where n is the number of turns per meter.
        Electromagnets, electric motors, MRI machines, and particle accelerators all rely on solenoids.
      </Typography>

      <GuideTable
        headers={['Configuration', 'Field pattern', 'Formula', 'Application']}
        rows={[
          ['Long straight wire', 'Circular rings around wire', 'B = μ₀I/(2πr)', 'Overhead power lines, detection of current'],
          ['Single circular loop', 'Like a bar magnet (dipole field)', 'B = μ₀I/(2r) at center', 'Compass deflection experiments'],
          ['Solenoid (many turns)', 'Uniform inside, weak outside', 'B = μ₀nI inside', 'Electromagnets, MRI machines, transformers'],
          ['Toroid (solenoid bent into ring)', 'Confined entirely inside the ring', 'B = μ₀NI/(2πr)', 'Inductors in electronics, tokamak fusion reactors'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Electric Motors and Generators: Magnetism at Work</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        An <strong>electric motor</strong> converts electrical energy into mechanical energy using the
        force on current-carrying conductors in a magnetic field (F = BIL sinθ). A coil of wire
        (armature) carrying current sits inside a magnetic field. The forces on opposite sides of the
        coil are in opposite directions, creating a torque that rotates the armature.
        Commutators reverse the current direction each half-turn to maintain continuous rotation in
        the same direction.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A <strong>generator</strong> is a motor in reverse: mechanical rotation of a coil inside a
        magnetic field produces a continuously changing flux, inducing an alternating EMF (Faraday's Law).
        The AC generator (alternator) produces sinusoidally varying voltage — the 60 Hz alternating
        current used in US household electricity. Motors and generators use identical hardware —
        the direction of energy conversion is simply reversed.
      </Typography>

      <Callout kind="connect">
        The deep symmetry between electricity and magnetism — moving charges create magnetic fields;
        changing magnetic fields create electric fields — is captured in Maxwell's Equations.
        James Clerk Maxwell unified electricity, magnetism, and optics into one coherent theory in
        1865, predicting electromagnetic waves and deriving the speed of light from electric and
        magnetic constants. This was one of the greatest intellectual achievements in the history of
        physics: three seemingly unrelated phenomena (electricity, magnetism, light) turned out to
        be aspects of one underlying reality. Einstein later called Maxwell's Equations the most
        important physical theory since Newton's laws of motion.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Applications of Electromagnetic Induction</Typography>
      <GuideTable
        headers={['Technology', 'How it uses induction', 'Key principle']}
        rows={[
          ['AC generator', 'Rotating coil in magnetic field induces alternating EMF', 'Faraday\'s Law: EMF = −ΔΦ/Δt'],
          ['Transformer', 'AC in primary coil induces AC in secondary coil via changing flux in iron core', 'V₁/V₂ = N₁/N₂; power conserved'],
          ['Induction stove', 'High-frequency AC in coil induces eddy currents in pot, which heat the pot', 'Lenz\'s Law: induced currents oppose change'],
          ['Wireless charging', 'Coil in charger induces current in coil in device', 'Mutual induction between resonant coils'],
          ['MRI machine', 'Rapidly switching magnetic fields induce signals from hydrogen nuclei in body', 'Nuclear magnetic resonance + Faraday induction'],
          ['Metal detector', 'Transmitted field induces eddy currents in metal objects; those currents create detectable field', 'Mutual induction + Lenz\'s Law'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section: Exam-Day Strategy
// ─────────────────────────────────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Physics Exam-Day Strategy</Typography>

      <Callout kind="coachs-note">
        Physics tests are as much about process as they are about memorized formulas. A student who
        follows a systematic problem-solving approach will consistently outperform a student who just
        "knows the formulas" but applies them carelessly. Use these strategies to maximize points —
        even on problems you are not fully confident about.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 1: Draw a diagram first</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Before writing a single equation, sketch the physical situation. Label all given quantities
        directly on the sketch with their units. Indicate direction with arrows for vectors. A clear
        diagram forces you to interpret the problem correctly and gives you a visual check later.
        In projectile motion, draw the trajectory. In circuit problems, redraw the circuit cleanly
        with labeled components. In optics, draw the ray diagram with the principal axis and focal points.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 2: List given, find, and formula</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Write a three-item setup before solving:
        (1) <strong>Given:</strong> list all known quantities with symbols and units;
        (2) <strong>Find:</strong> state exactly what you are solving for;
        (3) <strong>Formula:</strong> write the relevant equation(s) before plugging in numbers.
        This prevents the most common error — substituting numbers before you know what equation to use.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 3: Check units (dimensional analysis)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        After computing, verify that your answer has the correct units. For example, if you compute
        a distance and the units come out as m/s instead of m, you made an algebraic error. Units
        track through every step just like variables. Common unit checks:
        velocity → m/s; acceleration → m/s²; force → N = kg·m/s²; energy → J = kg·m²/s²;
        power → W = J/s; charge → C; current → A = C/s; resistance → Ω = V/A.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Step 4: Significant figures and scientific notation</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Report answers to the appropriate number of significant figures — typically the same number
        as the least precise given value. If a problem gives data to 2 sig figs, your answer should
        have 2 sig figs. Do not write 6 decimal places when the data supports only 2 significant
        figures — that implies false precision. Use scientific notation for very large or very small
        numbers (c = 3 × 10⁸ m/s, not 300,000,000 m/s).
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Common mistakes to avoid</Typography>

      <Box component="ul" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.75, fontSize: '0.92rem' } }}>
        <li>
          <strong>Forgetting to square v in KE = ½mv²</strong> — this is the most frequent energy error.
          Write the formula first, then substitute, to avoid dropping the exponent.
        </li>
        <li>
          <strong>Mixing up series and parallel resistance rules</strong> — in parallel, R_total is always
          LESS than the smallest individual resistor. If your computed R_total is larger than the smallest R,
          you used the series formula when you should have used parallel (or vice versa).
        </li>
        <li>
          <strong>Forgetting cosθ in W = Fd cosθ</strong> — if force and displacement are not parallel,
          only the component of force along the displacement does work. A force perpendicular to motion
          does zero work (like the normal force).
        </li>
        <li>
          <strong>Using the wrong sign convention in mirror/lens equations</strong> — real images have
          positive d_i; virtual images have negative d_i. Concave mirrors and converging lenses have
          positive focal length; convex mirrors and diverging lenses have negative focal length.
          Always state your sign convention before solving.
        </li>
        <li>
          <strong>Confusing displacement and distance</strong> — if a problem asks "how far" it might
          mean distance (total path) or displacement (straight-line). Read carefully.
          For free fall or projectile problems returning to the starting height, displacement = 0
          but distance is definitely not zero.
        </li>
        <li>
          <strong>Ignoring direction in momentum and velocity</strong> — momentum is a vector.
          In collision problems, establish a positive direction and assign negative values to
          objects moving the opposite way. A car moving left at 20 m/s has a negative velocity
          if rightward is positive.
        </li>
        <li>
          <strong>Applying SUVAT equations when acceleration is not constant</strong> — SUVAT works
          ONLY for uniform (constant) acceleration. If acceleration changes during the motion, SUVAT does not apply.
        </li>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>When you are stuck on a multiple-choice question</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        First, eliminate obviously wrong answers — usually you can eliminate 1–2 choices immediately.
        Second, check units of the answer choices to identify what formula structure is implied.
        Third, estimate the order of magnitude — can you tell if the answer should be "about 10" or
        "about 1000"? Eliminating implausible values narrows your guess to better odds.
        Never leave a question blank if there is no penalty for wrong answers.
      </Typography>

      <Callout kind="make-it-stick">
        The two most tested physics concepts at the high school level are: (1) energy conservation
        (set up KE_i + PE_i = KE_f + PE_f and solve) and (2) Ohm's Law in circuit analysis
        (V = IR, with series/parallel rules). Master these two frameworks cold — together they cover
        at least 30–40% of a typical physics assessment. Practice them until the setup is automatic,
        then spend remaining study time on waves, optics, and magnetism.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Quick Reference: The Most Frequently Tested Formulas</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        This table condenses the formulas most likely to appear on a physics test into one place.
        Bookmark this for final review — if you can write each formula from memory and state what
        each variable represents, you are well-prepared.
      </Typography>

      <GuideTable
        headers={['Domain', 'Formula', 'Variables', 'Quick check']}
        rows={[
          ['Kinematics', 'v = u + at', 'v=final vel, u=initial vel, a=accel, t=time', 'Units: m/s = m/s + (m/s²)(s) ✓'],
          ['Kinematics', 's = ut + ½at²', 's=displacement, u=initial vel, a=accel, t=time', 'Units: m = (m/s)(s) + (m/s²)(s²) ✓'],
          ['Kinematics', 'v² = u² + 2as', 'v=final vel, u=initial vel, a=accel, s=displacement', 'Eliminates time — use when t is not given or needed'],
          ['Energy', 'KE = ½mv²', 'm=mass (kg), v=speed (m/s)', 'Double v → 4× KE (v is squared!)'],
          ['Energy', 'PE = mgh', 'm=mass, g=9.8 m/s², h=height (m)', 'Reference height is your choice — only ΔPE matters'],
          ['Energy', 'W = Fd cosθ', 'F=force, d=displacement, θ=angle between F and d', 'θ=90° → cos90°=0 → W=0 (perpendicular force does no work)'],
          ['Momentum', 'p = mv', 'm=mass (kg), v=velocity (m/s)', 'Vector: direction of p = direction of v'],
          ['Momentum', 'J = FΔt = Δp', 'J=impulse, F=force, Δt=time interval', 'Airbags: increase Δt → decrease F for same Δp'],
          ['Waves', 'v = fλ', 'v=wave speed, f=frequency (Hz), λ=wavelength (m)', 'f and λ are inversely related for constant v'],
          ['Optics', 'n₁sinθ₁ = n₂sinθ₂', 'n=index of refraction, θ=angle from normal', 'Denser medium (higher n) → smaller angle'],
          ['Optics', '1/f = 1/d_o + 1/d_i', 'f=focal length, d_o=object distance, d_i=image distance', 'Positive f: converging; negative d_i: virtual image'],
          ['Circuits', 'V = IR', 'V=voltage (V), I=current (A), R=resistance (Ω)', 'The single most used formula in electricity'],
          ['Circuits', 'P = IV = I²R = V²/R', 'P=power (W)', 'Choose the form with the knowns you have'],
          ['Magnetism', 'F = qvB sinθ', 'q=charge, v=velocity, B=field strength (T)', 'F=0 when v∥B (θ=0°); F max when v⊥B (θ=90°)'],
          ['Magnetism', 'V₁/V₂ = N₁/N₂', 'V=voltage, N=number of turns', 'Step-up: N₂>N₁; step-down: N₂<N₁'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Approach for Multi-Step Quantitative Problems</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Multi-step problems — the kind worth the most points — require a systematic approach:
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.8, mb: 0.75, fontSize: '0.92rem' } }}>
        <li><strong>Read the entire problem first.</strong> Identify all given information and what is being asked before writing anything.</li>
        <li><strong>Draw and label a diagram.</strong> Sketch the situation. Label all given quantities with symbols and units.</li>
        <li><strong>Identify the relevant domain and formula.</strong> What kind of problem is this? Kinematics, energy, circuits, optics?</li>
        <li><strong>List your "given" and "find" explicitly.</strong> This prevents you from solving for the wrong thing.</li>
        <li><strong>Select the appropriate equation(s).</strong> Choose based on which variable is unknown and which variables you have.</li>
        <li><strong>Solve algebraically first, then substitute numbers.</strong> This way, if you make an arithmetic error, you still get partial credit for the correct setup.</li>
        <li><strong>Check units and order of magnitude.</strong> Does the answer make physical sense? A speed of 10⁶ m/s for a ball is impossible; that is a clue you made an error.</li>
        <li><strong>Re-read the question to ensure you answered what was asked.</strong> Did they ask for velocity or speed? Distance or displacement? Power or energy?</li>
      </Box>

      <Callout kind="why-it-matters">
        Physics is a problem-solving discipline as much as a content-knowledge discipline. Colleges and
        employers who value physics education are not primarily interested in whether you memorized v = u + at.
        They care whether you can read a complex situation, identify the relevant principles, and reason
        your way to a solution you can defend. Developing systematic problem-solving habits now —
        diagrams, clear setups, unit checks, sanity checks — will serve you in every quantitative
        field for the rest of your life.
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Physics Glossary</Typography>
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
