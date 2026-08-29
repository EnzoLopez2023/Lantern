// ENVSCI Study Guide — accordion-based layout for SC Environmental Science (11th grade).
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

const READING_PROGRESS_KEY = 'exam-prep-reading:ENVSCI';
const COMPLETION_KEY = 'exam-prep-completed:ENVSCI';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:ENVSCI';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Earth Systems & Biogeochemical Cycles',
  s3: 'Ecology & Ecosystems',
  s4: 'Biodiversity & Conservation',
  s5: 'Human Population & Land Use',
  s6: 'Climate Change & Atmosphere',
  s7: 'Water Resources',
  s8: 'Energy Resources & Sustainability',
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
  { id: 's1',      num: '1',  title: 'The Big Picture',                      icon: '🗺️' },
  { id: 's2',      num: '2',  title: 'Earth Systems & Biogeochemical Cycles', icon: '🌍' },
  { id: 's3',      num: '3',  title: 'Ecology & Ecosystems',                 icon: '🌿' },
  { id: 's4',      num: '4',  title: 'Biodiversity & Conservation',          icon: '🦁' },
  { id: 's5',      num: '5',  title: 'Human Population & Land Use',          icon: '👥' },
  { id: 's6',      num: '6',  title: 'Climate Change & the Atmosphere',      icon: '🌡️' },
  { id: 's7',      num: '7',  title: 'Water Resources',                      icon: '💧' },
  { id: 's8',      num: '8',  title: 'Energy Resources & Sustainability',    icon: '⚡' },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',                    icon: '🎯' },
  { id: 's-gloss', num: '📚', title: 'Glossary',                             icon: '📚' },
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
    case 's2':      return <Section2EarthSystems />;
    case 's3':      return <Section3Ecology />;
    case 's4':      return <Section4Biodiversity />;
    case 's5':      return <Section5HumanPopulation />;
    case 's6':      return <Section6ClimateChange />;
    case 's7':      return <Section7WaterResources />;
    case 's8':      return <Section8Energy />;
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>What Is Environmental Science?</Typography>

      <Analogy title="A detective with five specialties">
        A crime scene investigator doesn't pick one forensic specialty and ignore the rest. They need chemistry
        to analyze residues, biology to examine tissue, geology to read soil samples, physics to reconstruct impact
        trajectories, and social science to understand human motives. Environmental science works exactly the same
        way — it's a multi-disciplinary detective agency investigating Earth's most pressing problems. No single
        lens is enough. Climate change isn't just chemistry; it involves physics, biology, economics, and politics
        all at once. Environmental science is the discipline that holds all those lenses simultaneously.
      </Analogy>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        Environmental science is the study of how the natural world works, how the environment affects humans and
        other organisms, and how humans affect the environment. It draws on <strong>biology</strong> to understand
        living systems, <strong>chemistry</strong> to track molecules through cycles and reactions,
        <strong>geology</strong> to understand Earth's physical processes, <strong>physics</strong> to explain
        energy flows, and <strong>social science</strong> (economics, policy, ethics) to connect human decisions
        to natural consequences.
      </Typography>

      <Callout kind="why-it-matters">
        Environmental science is one of the most urgent fields of the 21st century. Climate change, freshwater
        scarcity, biodiversity loss, and energy transitions are not future problems — they are happening now.
        Understanding the science behind these issues equips you to evaluate news, vote on policy, and make
        choices as a consumer, voter, and citizen. This isn't just a class; it's a toolkit for understanding
        the world you'll actually live in.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>How the Seven Sections Connect</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        This guide has a deliberate sequence. Each section builds on the one before it. Think of it as a story
        about one planet — told in seven chapters that escalate from the physical stage to the human drama playing
        out on it.
      </Typography>

      <MermaidDiagram chart={`graph TD
  S2["🌍 Section 2: Earth Systems & Biogeochemical Cycles\n(The physical and chemical stage — matter cycling through spheres)"]
  S3["🌿 Section 3: Ecology & Ecosystems\n(Life on the stage — energy flows, food webs, populations)"]
  S4["🦁 Section 4: Biodiversity & Conservation\n(Life's richness — and what we're losing)"]
  S5["👥 Section 5: Human Population & Land Use\n(The driver of pressure — agriculture, deforestation, sprawl)"]
  S6["🌡️ Section 6: Climate Change & the Atmosphere\n(The amplifier — how human emissions disrupt the whole system)"]
  S7["💧 Section 7: Water Resources\n(The tightening constraint — scarcity, pollution, overuse)"]
  S8["⚡ Section 8: Energy Resources & Sustainability\n(The choice point — what we burn determines our future)"]
  S2 --> S3
  S3 --> S4
  S4 --> S5
  S5 --> S6
  S6 --> S7
  S7 --> S8`} />

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Section 2 — Earth Systems & Biogeochemical Cycles</strong> sets the physical stage: how matter
        flows between the four Earth spheres, and why those cycles matter for everything that lives. Carbon, nitrogen,
        water, and phosphorus are the currencies of life — you need to know how they circulate.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Section 3 — Ecology & Ecosystems</strong> explains how life organizes itself on that stage.
        Food webs, energy pyramids, biomes, succession, and population dynamics tell you how ecosystems function
        when left alone — the baseline against which human impacts are measured.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Section 4 — Biodiversity & Conservation</strong> quantifies life's richness: the genetic,
        species, and ecosystem diversity that makes the biosphere resilient. It also catalogs the threats —
        habitat loss, invasive species, overexploitation — and the conservation tools we use to fight back.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Section 5 — Human Population & Land Use</strong> introduces the human driver. Eight billion
        people need food, shelter, and resources. The demographic transition model explains how and why population
        growth is slowing, while agricultural expansion, deforestation, and urbanization reshape land use globally.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Section 6 — Climate Change & the Atmosphere</strong> explains how burning fossil fuels disrupts
        the carbon cycle and amplifies every environmental problem: sea-level rise accelerates habitat loss,
        warming water stresses ecosystems, and extreme weather destabilizes agriculture.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Section 7 — Water Resources</strong> tightens the constraints further. Freshwater is already
        scarce for hundreds of millions of people, and climate change, agriculture, and pollution are making it
        scarcer. Understanding eutrophication, aquifer depletion, and water policy is critical.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Section 8 — Energy Resources & Sustainability</strong> closes the loop: the energy choices
        human civilization makes in the next few decades will determine whether the trends in sections 5–7
        accelerate or reverse. EROI, renewables vs. fossil fuels, and sustainability frameworks give you the
        vocabulary to evaluate those choices.
      </Typography>

      <Callout kind="make-it-stick">
        As you move through each section, keep asking: "How does this connect to what I already read?" The
        nitrogen cycle (s2) feeds into eutrophication (s7). Deforestation (s5) reduces biodiversity (s4) and
        releases carbon (s6). Energy choices (s8) drive climate change (s6). Environmental science is not
        a list of separate topics — it is one interconnected system, and the connections are the exam content.
      </Callout>

      <GuideTable
        headers={['Section', 'Core question it answers', 'Key concept to master']}
        rows={[
          ['2 — Earth Systems', 'How does matter move through Earth?', 'Carbon, nitrogen, water, phosphorus cycles'],
          ['3 — Ecology', 'How does energy flow through life?', '10% rule, succession, carrying capacity'],
          ['4 — Biodiversity', 'What is life\'s richness and what threatens it?', 'Keystone species, extinction drivers'],
          ['5 — Human Population', 'How many people, and what do they need?', 'Demographic transition model'],
          ['6 — Climate Change', 'How are humans changing the atmosphere?', 'Greenhouse effect, feedback loops'],
          ['7 — Water Resources', 'Where is freshwater and how is it threatened?', 'Eutrophication, aquifer depletion'],
          ['8 — Energy', 'What powers civilization and at what cost?', 'EROI, renewables vs. fossil fuels'],
        ]}
      />

      <Callout kind="coachs-note">
        SC Environmental Science questions often present a scenario — a graph, a data table, a real-world case
        study — and ask you to apply content from multiple sections at once. The student who memorizes sections
        in isolation will struggle. The student who understands how the sections link will recognize the thread
        in any scenario question and pull the right concepts together.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Earth Systems & Biogeochemical Cycles
// ─────────────────────────────────────────────────────────────────────
function Section2EarthSystems() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The Four Earth Systems (Spheres)</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Earth operates through four interconnected systems, or "spheres." Nothing stays in just one sphere —
        matter flows constantly between them, driven by energy from the sun and Earth's interior.
      </Typography>

      <GuideTable
        headers={['Sphere', 'What it includes', 'Example interaction']}
        rows={[
          ['Lithosphere (Geosphere)', 'Rocks, soil, Earth\'s crust and mantle, minerals', 'Weathering breaks rocks into soil; soil anchors plants'],
          ['Hydrosphere', 'All water: oceans, rivers, lakes, ice caps, groundwater, water vapor', 'Ocean absorbs CO₂; rain weathers rock; glaciers reflect sunlight'],
          ['Atmosphere', 'All gases surrounding Earth: N₂, O₂, CO₂, water vapor, trace gases', 'CO₂ traps heat; O₂ enables respiration; ozone blocks UV'],
          ['Biosphere', 'All living organisms and their immediate environments (any sphere life touches)', 'Plants pull CO₂ from atmosphere; decomposers return nutrients to soil'],
        ]}
      />

      <Callout kind="in-plain-words">
        The four spheres are not separate containers with walls between them. They are overlapping zones that
        constantly exchange matter and energy. A raindrop starts in the atmosphere, falls into the hydrosphere,
        soaks into the lithosphere, is taken up by a plant (biosphere), and evaporates back into the atmosphere —
        all in a few weeks. Environmental problems always involve disruptions to these flows.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Biogeochemical Cycles: Nature's Recycling System</Typography>

      <Analogy title="Nature's recycling bins that never overflow">
        A city landfill has a problem: matter goes in and never really comes out. Nature solved this problem
        billions of years ago with biogeochemical cycles — closed loops in which every atom of carbon, nitrogen,
        water, or phosphorus gets used, broken down, and reused again. The same carbon atom in your body today
        may have been in a dinosaur 100 million years ago, dissolved in seawater 50 million years ago, buried
        as limestone 20 million years ago, released by a volcano 1 million years ago, fixed by a plant 10 years
        ago, and eaten by you last week. Nature doesn't landfill matter — it recycles it forever.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Carbon Cycle</Typography>

      <Analogy title="Carbon as a bank account">
        Think of the carbon cycle as a planetary bank account. Photosynthesis makes deposits — plants pull CO₂
        from the atmosphere and lock it into organic molecules (glucose, wood, soil organic matter). Respiration,
        combustion, and decomposition make withdrawals — they release that locked carbon back to the atmosphere
        as CO₂. For millions of years the account was roughly balanced. Human burning of fossil fuels is making
        massive extra withdrawals — withdrawing carbon that was deposited (as compressed organic matter) over
        hundreds of millions of years, and releasing it in centuries. The balance is now deeply negative,
        and the excess CO₂ is accumulating in the atmospheric "account."
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Carbon moves between four major reservoirs: the <strong>atmosphere</strong> (CO₂ gas),
        <strong>biosphere</strong> (living organisms and soil organic matter), <strong>hydrosphere</strong>
        (dissolved CO₂ and carbonate in oceans — the largest active reservoir), and <strong>lithosphere</strong>
        (fossil fuels, limestone, marble — the largest total reservoir but slowest to exchange).
      </Typography>

      <GuideTable
        headers={['Process', 'Direction of carbon movement', 'Sphere interaction']}
        rows={[
          ['Photosynthesis', 'Atmosphere → Biosphere', 'Plants fix CO₂ into glucose using sunlight'],
          ['Cellular respiration', 'Biosphere → Atmosphere', 'All organisms release CO₂ as they break down glucose'],
          ['Combustion (burning)', 'Biosphere/Lithosphere → Atmosphere', 'Burning wood or fossil fuels releases stored carbon rapidly'],
          ['Decomposition', 'Biosphere → Atmosphere/Lithosphere', 'Decomposers break down dead matter, releasing CO₂ and forming soil carbon'],
          ['Ocean uptake', 'Atmosphere → Hydrosphere', 'CO₂ dissolves in seawater; forms H₂CO₃, HCO₃⁻, CO₃²⁻'],
          ['Fossil fuel formation', 'Biosphere → Lithosphere', 'Buried organic matter compressed over millions of years into coal, oil, gas'],
          ['Volcanic outgassing', 'Lithosphere → Atmosphere', 'Plate tectonics and volcanic activity release CO₂ slowly'],
        ]}
      />

      <MermaidDiagram chart={`graph LR
  ATM["Atmosphere (CO₂)"]
  BIO["Biosphere (organisms, soil)"]
  OCN["Hydrosphere (oceans)"]
  LIT["Lithosphere (fossil fuels, limestone)"]

  ATM -->|"Photosynthesis\n(removes CO₂)"| BIO
  BIO -->|"Respiration\n(releases CO₂)"| ATM
  BIO -->|"Combustion\n(releases CO₂ fast)"| ATM
  BIO -->|"Decomposition"| ATM
  BIO -->|"Burial over\nmillions of years"| LIT
  LIT -->|"Burning fossil fuels\n(human activity)"| ATM
  LIT -->|"Volcanic\noutgassing (slow)"| ATM
  ATM -->|"CO₂ dissolves\nin seawater"| OCN
  OCN -->|"Outgassing\nwhen warm"| ATM`} />

      <Callout kind="watch-for">
        A critical distinction for exams: photosynthesis removes CO₂ from the atmosphere; respiration and
        combustion add it back. Decomposition also releases CO₂. Human fossil fuel burning is special because
        it taps the lithosphere reservoir (carbon stored for millions of years) and dumps it into the atmosphere
        in decades — far faster than natural processes can remove it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Nitrogen Cycle</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Nitrogen (N₂) makes up 78% of the atmosphere, yet most organisms cannot use atmospheric N₂ directly —
        they need "fixed" nitrogen in the form of ammonia (NH₃) or nitrate (NO₃⁻). The nitrogen cycle converts
        N₂ into usable forms and eventually returns it to the atmosphere.
      </Typography>

      <GuideTable
        headers={['Step', 'Process', 'Who/what does it']}
        rows={[
          ['Nitrogen fixation', 'N₂ → NH₃ (ammonia)', 'Nitrogen-fixing bacteria (Rhizobium in legume root nodules; free-living Azotobacter); lightning'],
          ['Nitrification', 'NH₃ → NO₂⁻ → NO₃⁻ (nitrate)', 'Nitrifying bacteria in soil (Nitrosomonas, Nitrobacter)'],
          ['Assimilation', 'NO₃⁻ absorbed by plant roots → amino acids, proteins', 'Plants; then consumed by animals'],
          ['Ammonification', 'Organic N in dead matter → NH₃', 'Decomposers (bacteria, fungi) break down proteins'],
          ['Denitrification', 'NO₃⁻ → N₂ (back to atmosphere)', 'Denitrifying bacteria in waterlogged/anaerobic soils'],
        ]}
      />

      <Callout kind="why-it-matters">
        Human disruption of the nitrogen cycle is one of the most severe environmental problems you've never
        heard about. Industrial nitrogen fixation (the Haber-Bosch process) to make synthetic fertilizers now
        fixes more nitrogen than all natural processes combined. Excess nitrates wash off agricultural fields
        into streams and coastal waters, triggering algal blooms, oxygen depletion (hypoxia), and "dead zones"
        where fish cannot survive. The Gulf of Mexico Dead Zone — caused by Mississippi River nitrogen runoff
        from Midwest farms — is the size of New Jersey.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Water Cycle (Hydrological Cycle)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The water cycle redistributes fresh water across Earth's surface. Unlike the carbon and nitrogen cycles,
        the water cycle is driven almost entirely by solar energy and gravity, with no significant biological
        transformation of the water molecule itself.
      </Typography>

      <GuideTable
        headers={['Process', 'What happens', 'Driving force']}
        rows={[
          ['Evaporation', 'Liquid water → water vapor (from oceans, lakes, soil)', 'Solar energy'],
          ['Transpiration', 'Water vapor released by plant leaves through stomata', 'Solar energy + plant physiology'],
          ['Evapotranspiration', 'Combined evaporation + transpiration (key term for land)', 'Solar energy'],
          ['Condensation', 'Water vapor cools → liquid droplets (clouds, fog)', 'Cooling of air as it rises'],
          ['Precipitation', 'Water falls as rain, snow, sleet, hail', 'Gravity, once droplets become heavy enough'],
          ['Surface runoff', 'Water flows over land surface into streams/rivers/lakes', 'Gravity, slope, soil saturation'],
          ['Infiltration', 'Water soaks into soil → becomes groundwater', 'Gravity, soil porosity'],
          ['Groundwater flow', 'Water moves slowly through rock/soil to emerge at springs or feed oceans', 'Gravity, pressure gradients'],
        ]}
      />

      <Callout kind="connect">
        The water cycle links directly to every other topic in this guide. Deforestation (s5) reduces
        transpiration and increases surface runoff, worsening floods and droughts. Climate change (s6) intensifies
        evaporation in some regions and shifts precipitation patterns globally, threatening agriculture.
        Groundwater depletion (s7) is essentially withdrawing water from the "groundwater reservoir" of the
        water cycle faster than precipitation can recharge it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Phosphorus Cycle</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Phosphorus is unique among major biogeochemical cycles: <strong>there is no atmospheric reservoir</strong>.
        Phosphorus cycles through lithosphere, soil, water, and biosphere without ever becoming a gas under
        normal conditions. This makes the phosphorus cycle the slowest of the major cycles — and makes phosphorus
        the most common limiting nutrient in freshwater aquatic systems.
      </Typography>

      <GuideTable
        headers={['Step', 'Process']}
        rows={[
          ['Weathering', 'Phosphate (PO₄³⁻) is released from phosphate rock (apatite) by water and acids — the only entry point into the biological cycle'],
          ['Uptake', 'Plant roots absorb dissolved phosphate ions; animals get phosphorus by eating plants or other animals'],
          ['Return', 'Decomposers break down dead organisms, releasing phosphate back to soil and water'],
          ['Sedimentation', 'Phosphate washed into oceans can be incorporated into sediment, eventually forming new rock (extremely slow — millions of years)'],
          ['Human disruption', 'Mining phosphate rock for fertilizer; runoff of phosphorus → eutrophication in lakes and coastal waters'],
        ]}
      />

      <Callout kind="make-it-stick">
        Remember: phosphorus has NO gas phase — that's the key fact that sets it apart from carbon, nitrogen,
        and water cycles. Because there's no atmospheric reservoir to replenish soil phosphorus quickly,
        phosphorus is called a "limiting nutrient" — the nutrient most likely to limit plant growth in aquatic
        systems. Agricultural phosphorus runoff causes the same eutrophication problems as nitrogen runoff,
        but the mechanism is slightly different (phosphorus is limiting in fresh water; nitrogen is limiting
        in coastal marine waters).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Rock Cycle</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The rock cycle slowly transforms rock material among three types: <strong>igneous</strong> (formed from
        cooled magma — granite, basalt), <strong>sedimentary</strong> (formed from compressed sediment —
        sandstone, limestone, shale; where most fossils and fossil fuels are found), and
        <strong>metamorphic</strong> (formed when existing rock is subjected to extreme heat and pressure —
        marble, slate, quartzite). Weathering and erosion break rocks into sediment; burial and pressure compact
        sediment into sedimentary rock; heat/pressure metamorphose rocks; melting produces magma that solidifies
        into igneous rock. This cycle operates over millions to billions of years and is the ultimate source of
        mineral nutrients in soils. Phosphorus enters the biosphere almost exclusively through the weathering
        of phosphate-bearing rock — making the rock cycle the gateway for phosphorus into the food chain.
      </Typography>

      <GuideTable
        headers={['Rock type', 'How it forms', 'Environmental relevance']}
        rows={[
          ['Igneous', 'Magma or lava cools and solidifies', 'Source of many mineral nutrients after weathering; basalt weathers to rich tropical soils'],
          ['Sedimentary', 'Sediment compacted and cemented over time', 'Contains fossil fuels (coal, oil, gas); limestone stores vast amounts of carbon as CaCO₃; most fossils found here'],
          ['Metamorphic', 'Existing rock transformed by heat and pressure (but not melted)', 'Marble (metamorphosed limestone) is a carbon store; metamorphism drives plate tectonics at subduction zones'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Comparing the Four Major Biogeochemical Cycles</Typography>

      <GuideTable
        headers={['Cycle', 'Atmospheric reservoir?', 'Key human disruption', 'Main environmental consequence']}
        rows={[
          ['Carbon', 'YES (CO₂, CH₄)', 'Burning fossil fuels; deforestation', 'Climate change; ocean acidification'],
          ['Nitrogen', 'YES (N₂ — 78% of atmosphere)', 'Synthetic fertilizer production (Haber-Bosch); combustion releases NOₓ', 'Eutrophication; dead zones; nitrous oxide (GHG) emissions; air quality'],
          ['Water', 'YES (water vapor)', 'Deforestation reduces transpiration; irrigation depletes aquifers; impervious surfaces increase runoff', 'Altered precipitation patterns; flooding; water scarcity; droughts'],
          ['Phosphorus', 'NO (no gas phase)', 'Mining phosphate rock; agricultural runoff', 'Eutrophication of freshwater lakes; finite global phosphate reserves (mining is non-renewable)'],
        ]}
      />

      <Callout kind="coachs-note">
        Cycle comparison is a high-probability question type. Know: (1) which cycles have an atmospheric reservoir
        (carbon, nitrogen, water — YES; phosphorus — NO); (2) which processes remove CO₂ from the atmosphere
        (photosynthesis, ocean uptake) vs. add it (respiration, combustion, decomposition); (3) which organisms
        perform nitrogen fixation (bacteria — especially Rhizobium in legumes); (4) why phosphorus is the
        limiting nutrient in fresh water while nitrogen limits coastal marine systems. Those four anchors
        will cover virtually every cycle question you face.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Ecology & Ecosystems
// ─────────────────────────────────────────────────────────────────────
function Section3Ecology() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Biotic vs. Abiotic Factors</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Every ecosystem is defined by the interaction of two categories of factors:
        <strong> biotic factors</strong> (all living components — plants, animals, fungi, bacteria, and their
        interactions) and <strong>abiotic factors</strong> (all nonliving physical and chemical components —
        temperature, sunlight, water, soil type, pH, wind, salinity). Together they determine which organisms
        can live in a place and how many can be supported.
      </Typography>

      <Callout kind="in-plain-words">
        A coral reef's biotic factors include the corals themselves, the fish, algae, sea urchins, and bacteria.
        Its abiotic factors include water temperature, salinity, pH, light penetration, and water current.
        When ocean temperatures rise 1–2°C (abiotic change), corals expel their symbiotic algae and bleach —
        a perfect example of an abiotic change devastating biotic communities. Every environmental problem
        involves this biotic-abiotic feedback.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Biomes: Major Ecosystem Types</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A biome is a large region of Earth with similar climate, vegetation, and animal life. Biomes are
        defined primarily by temperature and precipitation patterns (abiotic) which then determine the
        characteristic plant and animal communities (biotic).
      </Typography>

      <GuideTable
        headers={['Biome', 'Climate', 'Key features & examples']}
        rows={[
          ['Tropical Rainforest', 'Hot and wet year-round; little seasonal variation', 'Highest biodiversity on Earth; layered canopy; Amazon, Congo, Southeast Asia; rapid nutrient cycling; poor soil (nutrients locked in biomass)'],
          ['Temperate Deciduous Forest', 'Warm summers, cold winters; moderate rainfall', 'Deciduous trees (oak, maple, beech) lose leaves in winter; four seasons; Eastern US, Europe, East Asia'],
          ['Boreal Forest (Taiga)', 'Long cold winters, short cool summers; moderate precipitation', 'Coniferous trees (spruce, fir, pine); largest terrestrial biome; Canada, Russia, Scandinavia; permafrost beneath'],
          ['Tundra', 'Extremely cold; very low precipitation (technically a desert); permafrost', 'Arctic and alpine; treeless; low shrubs, mosses, lichens; important carbon store (frozen peat)'],
          ['Desert', 'Very low precipitation (<25 cm/yr); extreme temperature swings', 'Hot deserts (Sahara, Sonoran) or cold deserts (Gobi); specialized drought-adapted species; sparse vegetation'],
          ['Grassland/Savanna', 'Seasonal rainfall; fire-maintained; too dry for forest, too wet for desert', 'Temperate grasslands (prairies, steppes); tropical savanna with scattered trees; great diversity of grazing animals'],
          ['Freshwater (lakes, rivers)', 'Variable; defined by aquatic chemistry and flow', 'Low salt (<0.5 ppt); primary producers: algae, aquatic plants; threatened by eutrophication and pollution'],
          ['Marine (ocean)', 'Defined by salinity, depth, light, temperature zones', 'Covers 71% of Earth; coral reefs (highest marine diversity), open ocean, deep sea, estuaries'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Ecosystem Structure: Who Eats Whom</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Every ecosystem has a feeding hierarchy. Energy enters as sunlight, is captured by producers, and
        flows through consumers — with most energy lost as heat at each step.
      </Typography>

      <GuideTable
        headers={['Trophic level', 'Organism type', 'Example']}
        rows={[
          ['1st (producers)', 'Autotrophs: make own food via photosynthesis or chemosynthesis', 'Grasses, trees, algae, phytoplankton, cyanobacteria'],
          ['2nd (primary consumers)', 'Herbivores: eat producers', 'Deer, rabbits, grasshoppers, zooplankton, many fish'],
          ['3rd (secondary consumers)', 'Carnivores or omnivores: eat primary consumers', 'Frogs, small fish, foxes, many birds'],
          ['4th (tertiary consumers)', 'Top carnivores: eat secondary consumers', 'Hawks, large predatory fish, wolves, sharks'],
          ['Decomposers (all levels)', 'Break down dead organic matter at any trophic level', 'Bacteria, fungi (critical for nutrient cycling — return nutrients to soil)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The 10% Rule and Energy Pyramids</Typography>

      <Analogy title="Energy as money leaking out of your wallet">
        Imagine every trophic level as a person in a transaction chain. The farmer (producer) earns $1,000.
        They keep $900 for their own expenses (metabolism, heat) and pass $100 to the wholesaler (primary
        consumer). The wholesaler keeps $90 and passes $10 to the retailer (secondary consumer). The retailer
        keeps $9 and passes $1 to you (tertiary consumer). You started with $1,000 in the system but only
        receive $1. This is the 10% rule in action — only about 10% of the energy in each trophic level
        passes to the next one. The rest is "spent" as heat through metabolism and cellular activity.
        This is why it takes roughly 10 kg of grain to produce 1 kg of beef — the cow burns 90% of the
        grain's energy just staying alive.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Because of the 10% rule, energy pyramids are always widest at the base (producers) and narrowest at the
        top (apex predators). This has profound implications: feeding lower on the food chain is more
        energy-efficient. A vegetarian diet requires roughly 10× less land and energy per calorie than a
        meat-based diet (for beef specifically).
      </Typography>

      <MermaidDiagram chart={`graph BT
  P["Producers (plants, algae)\n~10,000 units of energy"]
  PC["Primary Consumers (herbivores)\n~1,000 units (10% of producers)"]
  SC["Secondary Consumers (small carnivores)\n~100 units (10% of primary)"]
  TC["Tertiary Consumers (apex predators)\n~10 units (10% of secondary)"]
  HEAT["🔥 ~90% lost as heat at each level\n(respiration, movement, body heat)"]
  P --> PC
  PC --> SC
  SC --> TC
  P --> HEAT
  PC --> HEAT
  SC --> HEAT`} />

      <Callout kind="watch-for">
        Three types of ecological pyramids — be clear which type a question is asking about. Energy pyramids
        always show a pyramid shape (10% rule is universal). Biomass pyramids usually show the same pyramid
        shape on land, but can be inverted in open ocean (where phytoplankton biomass is small because
        they reproduce so fast). Number pyramids can be inverted when parasites or insects are the consumer
        (one tree hosts thousands of caterpillars).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Ecological Succession</Typography>

      <Analogy title="Rebuilding a burned building — in nature">
        After a fire levels a building to bare concrete, you don't immediately move in fancy furniture.
        First, framers come to build the structural skeleton (pioneer species). Then electricians and plumbers
        install systems (intermediate species that modify the habitat). Finally, the finishers and decorators
        arrive (climax community) — but only because the earlier workers made the space habitable.
        Ecological succession follows the same logic. Pioneer species are the "framers" of bare rock or
        disturbed soil — they tolerate harsh conditions, build soil, and gradually make the site hospitable
        to more demanding species, until a stable climax community is established.
      </Analogy>

      <GuideTable
        headers={['Type', 'Starting condition', 'Pioneer species', 'Timescale', 'Example']}
        rows={[
          ['Primary succession', 'Bare rock or substrate — no soil, no life', 'Lichens (break down rock), then mosses', 'Hundreds to thousands of years', 'Lava flow from a volcano; glacier retreat revealing bare rock'],
          ['Secondary succession', 'Disturbed land with soil intact', 'Annual weeds and grasses', 'Decades to centuries', 'Abandoned farm field; forest after a fire or hurricane'],
        ]}
      />

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The sequence in secondary succession is roughly: bare soil → annual weeds → perennial grasses and
        shrubs → pioneer trees (fast-growing, light-tolerant, like pines or birches) → shade-tolerant
        climax species (oaks, maples, hickories in temperate forests). Each stage modifies conditions
        (adds soil organic matter, shade, moisture retention) that favor the next stage.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Population Ecology</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Population size changes according to four variables: <strong>births</strong> (B) and
        <strong>immigration</strong> (I) increase population; <strong>deaths</strong> (D) and
        <strong>emigration</strong> (E) decrease it. Population change = (B + I) − (D + E).
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Two idealized growth models describe population dynamics:
      </Typography>

      <GuideTable
        headers={['Growth model', 'Shape', 'Conditions', 'Key feature']}
        rows={[
          ['Exponential growth (J-curve)', 'J-shaped; accelerates indefinitely', 'Unlimited resources; no predation; invasive species in new habitat', 'Growth rate is constant — each individual adds the same proportional amount. Unsustainable in real ecosystems.'],
          ['Logistic growth (S-curve)', 'S-shaped; levels off at K', 'Limited resources; as population grows, growth rate slows', 'Carrying capacity (K) = maximum population size the environment can support long-term. Growth slows as resources are depleted.'],
        ]}
      />

      <Callout kind="connect">
        The concept of carrying capacity is central to human population discussions (s5) and sustainability (s8).
        Earth has a carrying capacity for humans — we just don't know exactly what it is, because it depends
        on technology, consumption patterns, and resource management. The question of whether Earth's 8 billion
        people are close to or past carrying capacity is one of the central debates in environmental science.
      </Callout>

      <Callout kind="try-this">
        A population of deer in a forest has: birth rate 45 per 1,000 individuals/year, death rate 30 per 1,000,
        immigration rate 5 per 1,000, emigration rate 10 per 1,000. Net change = (45 + 5) − (30 + 10) = +10 per
        1,000 individuals/year = 1% annual growth rate. At 1,000 deer, this adds 10 individuals per year.
        At 5,000 deer (approaching carrying capacity), the same rate still adds 50 deer/year, but resources
        become limiting and rates shift. That's the transition from J to S curve in action.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Species Interactions: How Organisms Relate</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Organisms in ecosystems don't just eat each other — they interact in a rich variety of ways, each
        shaping the community structure and the evolutionary trajectories of the species involved. These
        interactions are classified by whether each participant benefits (+), is harmed (−), or is unaffected (0).
      </Typography>

      <GuideTable
        headers={['Interaction type', 'Effect on Species A / B', 'Description', 'Example']}
        rows={[
          ['Predation', '+  /  −', 'One organism (predator) kills and eats another (prey); drives evolutionary arms races', 'Wolf (predator) hunts elk (prey); cheetah hunts gazelle; sea star eats mussels'],
          ['Competition', '−  /  −', 'Both species compete for the same limited resource; may lead to competitive exclusion (one outcompetes the other locally)', 'Two bird species competing for the same insect prey or nest sites; invasive kudzu competing with native plants for light'],
          ['Mutualism', '+  /  +', 'Both species benefit; often tightly co-evolved', 'Bees pollinate flowers (both get food/reproduction); Rhizobium bacteria fix nitrogen for legumes (bacteria get carbohydrates); clownfish protect sea anemones'],
          ['Commensalism', '+  /  0', 'One species benefits; the other is neither helped nor harmed', 'Cattle egrets eat insects stirred up by grazing cattle (bird benefits; cattle unaffected); barnacles on whale skin (barnacles transported to feeding grounds; whale unaffected)'],
          ['Parasitism', '+  /  −', 'One organism (parasite) benefits at the expense of the host; usually doesn\'t kill host immediately', 'Tapeworms in intestines; ticks on deer; mistletoe growing on oak trees; brood parasitism (cuckoo lays eggs in other birds\' nests)'],
          ['Amensalism', '0  /  −', 'One species is harmed; the other is unaffected', 'Large tree shades out smaller plants beneath it (tree unaffected; smaller plants harmed); penicillin mold killing bacteria'],
        ]}
      />

      <Callout kind="watch-for">
        Competitive exclusion principle (Gause's Law): two species competing for exactly the same resources
        in exactly the same way cannot coexist indefinitely — one will outcompete and exclude the other.
        In practice, coexisting species avoid full competitive exclusion through niche differentiation —
        they partition resources slightly differently (different food sizes, different foraging times, different
        microhabitats). This is why biodiversity (s4) is partly maintained by niche partitioning:
        more species can coexist in diverse environments with many ecological niches than in simple, uniform ones.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Trophic Cascades: When Removing One Species Changes Everything</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A trophic cascade occurs when a change at one trophic level (especially removal of a top predator)
        sends effects rippling down through the entire food web — often with dramatic and unexpected consequences.
        The classic example is the reintroduction of wolves to Yellowstone National Park in 1995:
      </Typography>
      <Box component="ol" sx={{ pl: 3, '& li': { lineHeight: 1.9, mb: 0.5, fontSize: '0.92rem' } }}>
        <li>Wolves were absent from Yellowstone for 70 years. Elk populations grew large and grazed heavily along riverbanks.</li>
        <li>Heavy elk grazing denuded willows, aspens, and cottonwoods along streams. Rivers eroded banks with no root systems holding soil.</li>
        <li>Wolves returned in 1995. Elk avoided open areas near rivers (fear of predation), allowing vegetation to recover.</li>
        <li>Willows and aspens recovered. Beavers returned (they need willows). Beaver dams created wetlands.</li>
        <li>Wetlands improved water quality and provided habitat for fish, birds, and amphibians. River banks stabilized. Fish populations rebounded.</li>
        <li>The wolves had literally "changed the rivers" — not by eating fish or beavers, but by changing elk behavior, which changed vegetation, which changed hydrology.</li>
      </Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        This is why protecting apex predators and keystone species matters far beyond the individual species:
        their presence or absence restructures entire ecosystems. It also illustrates the concept of a
        <strong> trophic cascade</strong> — indirect effects cascading across trophic levels.
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 4: Biodiversity & Conservation
// ─────────────────────────────────────────────────────────────────────
function Section4Biodiversity() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Three Levels of Biodiversity</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Biodiversity is not just "how many species are there?" It operates at three distinct levels, each
        essential for ecosystem health and resilience.
      </Typography>

      <GuideTable
        headers={['Level', 'What it measures', 'Why it matters']}
        rows={[
          ['Genetic diversity', 'Variation in DNA among individuals within a species', 'Populations with high genetic diversity can adapt to disease, climate change, and new stressors; inbred populations are vulnerable'],
          ['Species diversity', 'Number and relative abundance of species in an area', 'Species richness = how many species; species evenness = how equally abundant they are. Both matter for ecosystem stability.'],
          ['Ecosystem diversity', 'Variety of habitats, communities, and ecological processes in a region', 'Diverse landscapes provide more ecosystem services and buffer against regional disturbances'],
        ]}
      />

      <Callout kind="in-plain-words">
        Here's a classic exam trick: a forest with 100 trees of one species and 100 trees of another species
        has higher species evenness than a forest with 195 trees of one species and 5 of another — even though
        both forests have the same species richness (2 species). Evenness tells you how the abundance is
        distributed. A healthy, stable ecosystem typically has both high richness and high evenness.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Keystone, Indicator, and Umbrella Species</Typography>

      <Analogy title="The keystone of an arch">
        In ancient stone arches, the keystone is the wedge-shaped stone at the very top of the arch. Remove
        any other stone and the arch weakens. Remove the keystone and the entire arch collapses — even though
        the keystone may be the smallest stone. Keystone species in ecosystems have a disproportionately large
        impact relative to their abundance — far larger than you'd predict from how many of them there are.
        Sea otters are a famous example: they eat sea urchins. Remove the otters and urchin populations
        explode. Urchins eat kelp. The entire kelp forest — habitat for hundreds of species of fish, marine
        mammals, and invertebrates — collapses because of the absence of one species of otter.
      </Analogy>

      <GuideTable
        headers={['Species type', 'Definition', 'Classic example']}
        rows={[
          ['Keystone species', 'Species with disproportionately large impact on ecosystem structure relative to its abundance', 'Sea otters (eat urchins → protect kelp forests); wolves in Yellowstone (trophic cascade)'],
          ['Indicator species', 'Species sensitive to environmental conditions; used to assess ecosystem health', 'Amphibians (permeable skin → sensitive to pollutants, pH, UV); lichens (sensitive to air pollution)'],
          ['Umbrella species', 'Species with large habitat requirements; protecting them automatically protects many others', 'Grizzly bears; Spotted owls; Giant pandas — protecting their habitat shelters thousands of co-occurring species'],
          ['Invasive species', 'Non-native species that spread rapidly and harm native species, economies, or human health', 'Kudzu (outcompetes native plants), Burmese pythons (prey on native wildlife in Everglades), zebra mussels (clog waterways, filter phytoplankton needed by natives)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Threats to Biodiversity: The "Evil Quartet" + Climate</Typography>

      <Analogy title="Biodiversity as a financial portfolio">
        Financial advisors recommend diversified investment portfolios because if one sector crashes, the
        others cushion the blow. A portfolio of only one stock is high-risk. Biodiversity is Earth's portfolio
        of life. A diverse ecosystem can withstand the loss of some species without collapsing — other species
        can fill functional roles. But a simplified ecosystem (like a monoculture farm or a forest reduced to
        one or two dominant species) is fragile: one disease, one drought, one invasive species can destroy it.
        Loss of biodiversity is like concentrating all your money in one stock — catastrophic when that stock
        crashes. And we're actively liquidating Earth's diversified portfolio.
      </Analogy>

      <GuideTable
        headers={['Threat', 'Mechanism', 'Scale & examples']}
        rows={[
          ['Habitat loss', '#1 driver of extinction globally; destroys species\' homes and food sources', 'Tropical deforestation, wetland drainage, grassland conversion to agriculture; affects thousands of species simultaneously'],
          ['Habitat fragmentation', 'Large habitats broken into disconnected patches; reduces gene flow, increases inbreeding, blocks migration', 'Roads, subdivisions, and farms carve forest into isolated islands; edge effects increase (hotter, drier, more invasive species at edges)'],
          ['Invasive species', 'Non-native species outcompete or prey on natives who have no evolutionary defenses', 'Brown tree snake eliminated 9 of 12 native forest birds in Guam; zebra mussels transformed Great Lakes ecosystems'],
          ['Overexploitation', 'Hunting, fishing, or harvesting faster than populations can reproduce', 'Atlantic cod collapse (overfishing drove 95% decline); African elephant ivory trade; shark finning'],
          ['Pollution', 'Chemical contamination reduces survival and reproduction of native species', 'DDT caused reproductive failure in eagles and falcons (eggshell thinning); acid rain kills aquatic life; plastic ingestion harms seabirds and sea turtles'],
          ['Climate change', 'Shifting temperatures, precipitation, and sea levels alter or eliminate habitats faster than species can adapt or migrate', 'Coral bleaching events; polar bear habitat loss; range shifts pushing species into unsuitable zones; phenological mismatches (flowers bloom before pollinators arrive)'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  A["Biodiversity Loss — Causes"]
  A --> B["1. Habitat Loss & Destruction\n(#1 driver globally)"]
  A --> C["2. Invasive Species\n(outcompete, prey on natives)"]
  A --> D["3. Overexploitation\n(hunting, fishing, harvesting)"]
  A --> E["4. Pollution\n(chemical, plastic, noise, light)"]
  A --> F["5. Climate Change\n(amplifies all other threats)"]
  B --> G["Habitat Fragmentation\n(edge effects, isolation)"]
  F --> B
  F --> C
  F --> E`} />

      <Callout kind="watch-for">
        The current extinction rate is estimated at 100 to 1,000 times the natural background extinction rate.
        The background rate (before humans) was roughly 1–5 species per year globally. Current estimates
        suggest we may be losing dozens of species per day. This has led scientists to call our current
        period the "Sixth Mass Extinction" or Holocene/Anthropocene extinction — the first mass extinction
        driven by a single species (humans). Know this number: 100-1,000× the background rate.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The IUCN Red List</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The International Union for Conservation of Nature (IUCN) Red List categorizes species by extinction risk:
        Least Concern → Near Threatened → Vulnerable → Endangered → Critically Endangered → Extinct in the Wild
        → Extinct. Each category has specific quantitative criteria (population size, rate of decline, geographic
        range). "Threatened" is often used informally to mean Vulnerable + Endangered + Critically Endangered.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Conservation Strategies</Typography>
      <GuideTable
        headers={['Strategy', 'Description', 'Examples']}
        rows={[
          ['Protected areas', 'National parks, wildlife refuges, marine protected areas (MPAs) that restrict human activity', 'Yellowstone, Great Barrier Reef Marine Park; roughly 17% of land and 10% of oceans are currently protected'],
          ['Wildlife corridors', 'Habitat linkages connecting fragmented patches, allowing gene flow and migration', 'Florida Panther corridor; wildlife overpasses/underpasses across highways'],
          ['Captive breeding', 'Breeding endangered species in zoos/aquariums for eventual reintroduction', 'California condor (reduced to 27 in 1987; now >500 with captive breeding); Arabian oryx'],
          ['Seed banks', 'Storing genetic material (seeds, DNA, sperm, eggs) of plant and animal species', 'Svalbard Global Seed Vault (Arctic, Norway) — backup for world\'s crop diversity'],
          ['Restoration ecology', 'Actively rehabilitating degraded ecosystems to functional state', 'Wetland restoration, reforestation projects, wolf reintroduction in Yellowstone'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Ecosystem Services: Why Biodiversity Has Economic Value</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Ecosystem services are the benefits humans receive from functioning ecosystems. They are often invisible
        until they are lost — like clean water, until a watershed is deforested and floods contaminate it.
      </Typography>

      <GuideTable
        headers={['Category', 'What it includes', 'Example']}
        rows={[
          ['Provisioning', 'Material goods from ecosystems', 'Food, clean water, timber, fiber, genetic resources, medicines (80% of pharmaceuticals have natural origins)'],
          ['Regulating', 'Regulation of natural processes', 'Climate regulation by forests; water purification by wetlands; pollination by bees (~75% of food crops depend on pollinators); flood control by mangroves'],
          ['Cultural', 'Non-material benefits (spiritual, aesthetic, educational)', 'Recreation in national parks; spiritual values of natural places; aesthetic value; ecotourism revenues'],
          ['Supporting', 'Services that underpin all other ecosystem services', 'Photosynthesis (oxygen production); soil formation; nutrient cycling; primary production'],
        ]}
      />

      <Callout kind="coachs-note">
        Ecosystem services arguments are powerful in policy debates because they translate ecological value
        into economic terms that decision-makers understand. The Catskill-Delaware watershed supplies New York
        City with clean drinking water — when studies showed that protecting this watershed cost $1–1.5 billion,
        compared to $8 billion for a water filtration plant, NYC invested in watershed protection instead.
        Nature delivered a service that would have cost 5–8× more to engineer artificially. Know this logic
        for scenario questions about why conservation has economic justification, not just moral justification.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Human Population & Land Use
// ─────────────────────────────────────────────────────────────────────
function Section5HumanPopulation() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Human Population: 8 Billion and Counting</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The human population reached 8 billion in 2022 — up from 1 billion around 1800, 2 billion in 1927,
        and 6 billion in 1999. The doubling time from 3 to 6 billion was only 39 years (1960–1999).
        Yet the growth rate is now slowing: the global fertility rate has dropped from about 5 children per
        woman in the 1960s to about 2.3 today. Understanding why — and what happens next — is the core of
        human population ecology.
      </Typography>

      <Callout kind="why-it-matters">
        Population size multiplied by per-capita consumption equals total environmental impact. A country with
        1 billion people consuming very little may have a smaller environmental footprint than a country
        with 300 million people consuming at American rates. This is captured in the IPAT equation:
        Impact = Population × Affluence × Technology. Population growth concentrating in developing nations
        amplifies the need for sustainable development — meeting human needs without the environmental
        footprint of the wealthiest nations.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Demographic Transition Model</Typography>

      <Analogy title="A country's life story — from poverty to stability">
        The demographic transition model tells the story of how countries change as they develop economically.
        Think of Stage 1 as a tribal community where life is short and hard — many babies are born, many die.
        Stage 2 is when modern medicine arrives (vaccines, clean water, antibiotics): deaths plummet, but
        birth rates stay high — population explodes. Stage 3 is when education, women's rights, and
        economic opportunity change the culture: families choose to have fewer children. Stage 4 is stability:
        births and deaths are both low, population stabilizes. Some wealthy nations are entering Stage 5:
        fertility below replacement, with aging and shrinking populations. Every developed country has
        traveled this arc. The question for the 21st century is how quickly developing nations can make
        this transition — and what the planet looks like if they can't.
      </Analogy>

      <MermaidDiagram chart={`graph LR
  S1["Stage 1\nHigh Birth Rate\nHigh Death Rate\nSlow/No Growth\n(Pre-industrial)"]
  S2["Stage 2\nHigh Birth Rate\nFALLING Death Rate\nRapid Population Growth\n(Early industrial)"]
  S3["Stage 3\nFALLING Birth Rate\nLow Death Rate\nSlowing Growth\n(Industrial)"]
  S4["Stage 4\nLow Birth Rate\nLow Death Rate\nStable Population\n(Post-industrial)"]
  S5["Stage 5 (some models)\nBirth Rate below\nReplacement (~2.1)\nDeclining Population\n(e.g. Japan, Germany)"]
  S1 --> S2
  S2 --> S3
  S3 --> S4
  S4 --> S5`} />

      <GuideTable
        headers={['Stage', 'Birth rate', 'Death rate', 'Population trend', 'Examples today']}
        rows={[
          ['Stage 1', 'High (~40–50/1,000)', 'High (~40–50/1,000)', 'Slow growth, stable but high mortality', 'No current nations; historical pre-industrial societies'],
          ['Stage 2', 'High (~40–50/1,000)', 'Falling (~20–30/1,000)', 'Rapid increase (population explosion)', 'Parts of sub-Saharan Africa; historically: 1800s Europe'],
          ['Stage 3', 'Falling (~20–30/1,000)', 'Low (~10/1,000)', 'Still growing but slowing', 'India, parts of Latin America and Southeast Asia'],
          ['Stage 4', 'Low (~10–15/1,000)', 'Low (~10/1,000)', 'Near-stable', 'USA, UK, Australia, Canada'],
          ['Stage 5', 'Below replacement (<10/1,000)', 'Low', 'Declining; aging population', 'Japan, Germany, South Korea, most of Eastern Europe'],
        ]}
      />

      <Callout kind="watch-for">
        Replacement fertility rate = 2.1 children per woman (slightly above 2.0 to account for infant
        mortality and the fact that not all children survive to reproduce). A country with fertility rate
        above 2.1 grows; below 2.1 shrinks (eventually). The US is currently near replacement, and
        population growth is largely driven by immigration.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Age Structure Diagrams</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Age structure diagrams (population pyramids) show the proportion of a population in each age group,
        divided by sex. The shape predicts the future: a wide base means many young people → future
        growth; a narrow base means fewer young people → stabilization or decline; an inverted (narrow
        base, wide top) means an aging population with fewer workers supporting more retirees.
      </Typography>

      <GuideTable
        headers={['Shape', 'Name', 'Population trend', 'Example country']}
        rows={[
          ['Wide base, narrow top', 'True pyramid / expansive', 'Rapid growth; young, fast-growing population', 'Nigeria, Afghanistan, Mali'],
          ['Roughly rectangular', 'Columnar / stable', 'Stable population; roughly equal age groups', 'United States, Sweden (near-stable)'],
          ['Narrow base, wide middle/top', 'Inverted pyramid / constrictive', 'Declining; aging population; fewer children than working-age adults', 'Japan, Germany, Italy'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Agricultural Impacts on Land</Typography>

      <Analogy title="Monoculture as a single-stock portfolio bet">
        A farmer growing only one crop across thousands of acres is essentially betting everything on a single
        stock. Good years are profitable. But when a pathogen evolves that targets that specific crop — as
        happened with the Irish Potato Famine in the 1840s (Phytophthora infestans destroyed virtually all
        potatoes because every plant was the same genetic clone) — there's nothing to buffer the loss.
        The entire crop fails. The Irish Famine killed approximately 1 million people and drove another
        million to emigrate. Genetic diversity in crops is not an abstraction — it is food security.
        Modern monocultures of corn, wheat, soy, and rice create the same vulnerability at global scale.
      </Analogy>

      <GuideTable
        headers={['Agricultural practice', 'Environmental impact']}
        rows={[
          ['Monoculture (single crop over large area)', 'Vulnerable to pests and disease; requires massive pesticide use; depletes specific soil nutrients; reduces habitat and biodiversity'],
          ['Synthetic pesticides', 'Kill non-target species (pollinators, soil organisms); bioaccumulation in food chains; insect resistance develops; water contamination'],
          ['Synthetic fertilizers (nitrogen, phosphorus)', 'Runoff causes eutrophication in waterways; nitrous oxide (N₂O) emissions (potent greenhouse gas); energy-intensive production'],
          ['Irrigation', 'Accounts for ~70% of freshwater withdrawals globally; salinization (salt accumulates in soil as water evaporates); aquifer depletion; waterlogging'],
          ['Soil erosion', 'Plowing + rain + wind remove topsoil; loses centuries of soil formation; reduces fertility; clogs waterways with sediment'],
          ['Desertification', 'Degradation of dryland ecosystems by overgrazing, deforestation, and poor farming; 1/3 of Earth\'s land surface is now degraded'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Deforestation</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        About 10 million hectares of forest are lost per year globally (net, after accounting for reforestation).
        Primary drivers are agricultural expansion (especially cattle ranching and soy in the Amazon), commercial
        logging, fuelwood collection, and infrastructure development. Consequences include: loss of biodiversity
        habitat, release of stored carbon (forests contain ~45% of terrestrial carbon), disruption of regional
        water cycles (Amazon rainfall is partly sustained by tree transpiration — "flying rivers"), soil erosion,
        and loss of ecosystem services.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Sustainable Agriculture</Typography>
      <GuideTable
        headers={['Practice', 'How it helps']}
        rows={[
          ['Crop rotation', 'Alternating crops between growing seasons restores soil nutrients (legumes fix nitrogen), breaks pest cycles, reduces need for synthetic inputs'],
          ['Cover crops', 'Planting crops like clover between harvest and planting season protects soil from erosion, adds organic matter, fixes nitrogen'],
          ['Integrated Pest Management (IPM)', 'Uses biological controls (predator insects), traps, resistant varieties, and minimal chemical pesticides — targets pests specifically'],
          ['Organic farming', 'No synthetic pesticides or fertilizers; relies on compost, manure, crop rotation; lower yields but reduced environmental impact'],
          ['Conservation tillage / no-till', 'Reduces plowing; keeps soil structure intact; reduces erosion and carbon release; improves water retention'],
          ['GMOs (genetically modified organisms)', 'Controversy: potential for drought resistance, pest resistance, higher yields; concerns about biodiversity, corporate control, unintended ecological effects'],
        ]}
      />

      <Callout kind="connect">
        Sustainable agriculture directly addresses the nitrogen cycle (s2) by reducing fertilizer runoff,
        water resources (s7) by reducing irrigation and eutrophication, biodiversity (s4) by reducing
        pesticide use and monoculture vulnerability, and climate change (s6) by reducing N₂O emissions
        and maintaining carbon in soil. Sustainable farming is simultaneously an answer to multiple
        environmental problems — which is why it appears so frequently on exams.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Climate Change & the Atmosphere
// ─────────────────────────────────────────────────────────────────────
function Section6ClimateChange() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The Atmosphere: Earth's Protective Blanket</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Earth's atmosphere is a thin layer of gases held by gravity. By volume, it is approximately
        <strong> 78% nitrogen (N₂)</strong>, <strong>21% oxygen (O₂)</strong>, <strong>0.93% argon (Ar)</strong>,
        and trace amounts of carbon dioxide (CO₂, currently ~422 ppm), water vapor (variable 0–4%), methane,
        nitrous oxide, and other gases. Despite their tiny concentrations, CO₂ and CH₄ have outsized effects
        on climate through the greenhouse effect.
      </Typography>

      <GuideTable
        headers={['Atmospheric layer', 'Altitude (approx.)', 'Key feature']}
        rows={[
          ['Troposphere', '0–12 km', 'Where weather happens; temperature decreases with altitude; contains most air mass; where we live'],
          ['Stratosphere', '12–50 km', 'Contains the ozone layer (O₃), which absorbs harmful UV radiation; temperature increases with altitude (UV absorption warms it)'],
          ['Mesosphere', '50–80 km', 'Temperature decreases again; meteors burn up here; coldest part of atmosphere'],
          ['Thermosphere (Ionosphere)', '80–700 km', 'Absorbs X-rays and UV; very high temperatures (up to 2,500°C) but low density (few molecules); auroras occur here'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Natural Greenhouse Effect</Typography>

      <Analogy title="Your car windows on a sunny day">
        Park your car in summer sunlight with the windows up. Sunlight (short-wave radiation) passes easily
        through glass and heats the interior. The heated seats and dashboard emit longer-wave infrared radiation
        (heat) — but glass is much less transparent to infrared than to visible light. So the heat is trapped
        inside, and the car gets dangerously hot. Earth's greenhouse gases work exactly the same way: sunlight
        passes through the atmosphere and heats Earth's surface; the surface radiates infrared back upward;
        greenhouse gases absorb that infrared and re-emit it in all directions — including back toward the surface.
        Without any greenhouse effect, Earth's average temperature would be around −18°C (0°F) instead of the
        current +15°C (59°F). The greenhouse effect itself is natural and essential — it's the enhancement
        of that effect by human emissions that is the problem.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The natural greenhouse effect keeps Earth's average temperature 33°C warmer than it would be otherwise.
        The enhanced (human-driven) greenhouse effect is warming the planet beyond its natural baseline.
        Since the Industrial Revolution began (~1750), atmospheric CO₂ has risen from ~280 ppm to ~422 ppm —
        a 50% increase, faster than at any point in at least 800,000 years of ice core records.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Greenhouse Gases: Sources and Potency</Typography>

      <GuideTable
        headers={['Greenhouse gas', 'Source', 'Global Warming Potential (vs CO₂ = 1)', 'Lifetime in atmosphere']}
        rows={[
          ['Carbon dioxide (CO₂)', 'Burning fossil fuels, deforestation, cement production', '1 (reference)', '20–200 years (some stays thousands of years)'],
          ['Methane (CH₄)', 'Livestock (enteric fermentation), landfills, wetlands, natural gas leaks, rice paddies', '~28–36× (100-year GWP)', '~12 years (more potent but shorter-lived)'],
          ['Nitrous oxide (N₂O)', 'Agricultural fertilizers, livestock manure, combustion', '~265–298× (100-year GWP)', '~114 years'],
          ['Water vapor (H₂O)', 'Evaporation from oceans and land (natural)', 'Strong amplifier (feedback gas)', 'Days to weeks (rapid cycling)'],
          ['Hydrofluorocarbons (HFCs)', 'Refrigerants (replaced CFCs), industrial processes', 'Up to 14,800×', 'Decades to centuries'],
        ]}
      />

      <Callout kind="watch-for">
        CO₂ is the most important greenhouse gas for climate change despite not being the most potent per
        molecule, because it is emitted in enormous quantities and persists for centuries. Methane is
        ~80× more potent than CO₂ over a 20-year period, making it critical for near-term climate action.
        Water vapor is the most abundant greenhouse gas but is a feedback (amplifier), not a driver — human
        activities don't directly increase water vapor; warming does, which then amplifies further warming.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Feedback Loops: Amplifiers and Dampeners</Typography>

      <Analogy title="A microphone near a speaker">
        Positive feedback in electronics: place a microphone too close to a speaker in an auditorium. A tiny
        sound enters the microphone, gets amplified through the speaker, re-enters the microphone louder,
        gets amplified again — within seconds you have a screaming whine that drowns everything out. That
        feedback loop amplified a small signal into a deafening roar. Positive climate feedback loops work
        the same way: a small warming triggers a change that causes more warming, which triggers more of
        that change, which causes more warming. The ice-albedo feedback is the clearest example: slight
        warming → Arctic ice melts → darker ocean water exposed → ocean absorbs more heat (darker surfaces
        absorb more sunlight than bright ice) → more warming → more ice melts → faster. A small initial
        warming amplifies itself into a much larger warming.
      </Analogy>

      <MermaidDiagram chart={`graph LR
  subgraph Positive Feedbacks ["Positive Feedbacks (amplify warming)"]
    A1["↑ Temperature"]
    A2["Arctic sea ice melts\n(less reflective surface)"]
    A3["Ocean absorbs MORE heat\n(dark water vs. white ice)"]
    A1 --> A2 --> A3 --> A1
    B1["↑ Temperature"]
    B2["Permafrost thaws\n(releases stored CH₄ and CO₂)"]
    B3["More greenhouse gases\nin atmosphere"]
    B1 --> B2 --> B3 --> B1
  end
  subgraph Negative Feedbacks ["Negative Feedbacks (dampen warming)"]
    C1["↑ Temperature"]
    C2["↑ Evaporation → more clouds"]
    C3["Some cloud types reflect\nsunlight back to space"]
    C4["Slight cooling effect"]
    C1 --> C2 --> C3 --> C4
  end`} />

      <GuideTable
        headers={['Feedback type', 'Mechanism', 'Effect on warming']}
        rows={[
          ['Ice-albedo feedback (positive)', 'Ice melts → dark ocean/land exposed → absorbs more solar energy → more warming', 'Amplifies warming — accelerating Arctic warming'],
          ['Permafrost methane feedback (positive)', 'Warming thaws permafrost → releases stored organic carbon as CH₄ and CO₂ → more warming', 'Amplifies warming — tipping point risk'],
          ['Water vapor feedback (positive)', 'Warming evaporates more water → water vapor (GHG) increases → more warming', 'Strongest amplifier — roughly doubles warming from CO₂ alone'],
          ['Cloud feedback (mixed)', 'Warming → more evaporation → more clouds; low clouds cool (reflect sunlight); high clouds warm (trap heat)', 'Net effect still debated; one of biggest uncertainties in climate models'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Consequences of Climate Change</Typography>
      <GuideTable
        headers={['Consequence', 'Mechanism', 'Current evidence']}
        rows={[
          ['Sea level rise', 'Thermal expansion of seawater + melting glaciers and ice sheets', 'Global sea level has risen ~20 cm since 1900; accelerating; threatens coastal cities and island nations'],
          ['Extreme weather', 'Warmer atmosphere holds more moisture → more intense precipitation events; higher baseline temperatures → more heat waves', 'Documented increases in extreme heat, heavy rainfall, and drought intensity'],
          ['Coral bleaching', 'Ocean warming → corals expel symbiotic algae (zooxanthellae) → bleach white; if prolonged, corals die', 'Great Barrier Reef has experienced mass bleaching events in 2016, 2017, 2020, 2022, 2024'],
          ['Species range shifts', 'Species track their climate envelope poleward and to higher elevations', 'Many species migrating ~6 km poleward per decade; some unable to move fast enough → local extinction'],
          ['Ocean acidification', 'CO₂ + H₂O → H₂CO₃ (carbonic acid) → lowers ocean pH; dissolves carbonate shells of marine organisms', 'Ocean pH dropped from 8.2 to 8.1 since industrialization — a 30% increase in hydrogen ion concentration'],
          ['Agricultural disruption', 'Shifting precipitation, heat stress on crops, new pest ranges', 'Yield reductions in wheat and maize projected in many regions by 2050'],
        ]}
      />

      <Callout kind="connect">
        Ocean acidification is a direct consequence of increased CO₂ absorption (the same ocean that helps
        slow climate change by absorbing CO₂ is damaged by that absorption). It threatens shellfish
        (oysters, clams, mussels), coral reefs, and pteropods (sea snails that are food for salmon and
        whales). The chemistry: CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻. Lower pH means more H⁺, which
        reacts with carbonate ions (CO₃²⁻) that shell-building organisms need. Shells literally dissolve.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Mitigation vs. Adaptation</Typography>
      <GuideTable
        headers={['Approach', 'Goal', 'Examples']}
        rows={[
          ['Mitigation', 'Reduce greenhouse gas emissions to slow or stop climate change', 'Renewable energy, energy efficiency, electric vehicles, reforestation, carbon capture and storage (CCS), methane capture from landfills'],
          ['Adaptation', 'Adjust to changes that are already happening or are locked in', 'Sea walls and elevated infrastructure; drought-resistant crops; early-warning systems for extreme weather; relocating vulnerable communities; managed retreat from coasts'],
        ]}
      />

      <Callout kind="make-it-stick">
        Mitigation addresses the cause (reducing emissions); adaptation addresses the effects (adjusting to
        a changed climate). Both are necessary because some warming is already locked in — even if emissions
        stopped today, the climate would continue warming for decades due to the thermal inertia of the oceans
        and the long atmospheric lifetime of CO₂. The IPCC (Intergovernmental Panel on Climate Change) is the
        international body that assesses climate science — know this acronym.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: Water Resources
// ─────────────────────────────────────────────────────────────────────
function Section7WaterResources() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The Distribution of Earth's Water</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Earth is the "blue planet," but the distribution of that water is profoundly skewed against human use.
        Knowing these numbers is essential — they appear on nearly every environmental science exam.
      </Typography>

      <GuideTable
        headers={['Category', 'Percentage of all Earth\'s water', 'Notes']}
        rows={[
          ['Saltwater (oceans, seas)', '~97%', 'Not directly usable without energy-intensive desalination'],
          ['Fresh water (total)', '~3%', 'All fresh water, most inaccessible'],
          ['Ice caps and glaciers', '~69% of fresh water (~2.1% of all water)', 'Mostly locked in Antarctic and Greenland ice sheets; melting adds to sea level rise'],
          ['Groundwater', '~30% of fresh water (~0.9% of all water)', 'Most accessible fresh water reserve; recharged slowly by precipitation'],
          ['Surface water (lakes, rivers)', '<1% of fresh water (<0.01% of all water)', 'Most easily accessible; most threatened by pollution and overuse'],
          ['Soil moisture, atmosphere, biota', 'Tiny fractions', 'Essential for agriculture and climate regulation despite small volume'],
        ]}
      />

      <Callout kind="in-plain-words">
        The math is brutal: of all Earth's water, only 3% is fresh. Of that 3%, 69% is locked in ice.
        Of the remaining ~1%, most is groundwater buried underground. The easily accessible surface water
        in rivers and lakes — the water most people picture when they think of "fresh water" — is less than
        0.01% of all Earth's water. We are critically dependent on a vanishingly small slice of Earth's water.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Groundwater: Aquifers and Their Vulnerabilities</Typography>

      <Analogy title="An aquifer as a giant underground savings account">
        An aquifer works exactly like a bank account — with a critical difference. A bank account is backed
        by the full faith of the banking system; you can deposit and withdraw freely. An aquifer's "deposits"
        come from precipitation slowly percolating through soil over years to decades, and its "withdrawals"
        come from wells pumping water to the surface. If withdrawals exceed deposits (recharge rate), the
        account balance drops — the water table falls, wells go dry, land can subside, and saltwater can
        intrude into coastal aquifers. The Ogallala (High Plains) Aquifer under the Great Plains of the
        United States feeds about 30% of US groundwater irrigated agriculture. It took thousands of years
        to fill with glacial meltwater. In some areas, we are drawing it down 10 times faster than it
        recharges. When it's gone, the breadbasket of America faces a crisis with no quick fix.
      </Analogy>

      <GuideTable
        headers={['Aquifer type', 'Characteristics', 'Recharge']}
        rows={[
          ['Unconfined aquifer', 'Directly connected to the surface; water table can rise and fall; recharged by local precipitation', 'Relatively rapid recharge (years to decades) if recharge zone is protected'],
          ['Confined aquifer', 'Trapped between impermeable rock layers; under pressure (artesian); sometimes very old water (fossil water)', 'Very slow recharge — the confining layer blocks rapid infiltration; some fossil aquifers barely recharge at all'],
        ]}
      />

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Key groundwater vocabulary: <strong>water table</strong> = the upper boundary of the saturated zone
        in an unconfined aquifer; <strong>recharge zone</strong> = the area where precipitation infiltrates
        down to refill an aquifer (must be protected from contamination and impervious surfaces);
        <strong>cone of depression</strong> = the funnel-shaped drop in water table around a heavily pumped well.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Water Use: Where Does It All Go?</Typography>
      <GuideTable
        headers={['Sector', 'Global freshwater use (approx.)', 'Key issues']}
        rows={[
          ['Agriculture', '~70%', 'Irrigation; much water lost to evaporation; salinization from over-irrigation; aquifer depletion'],
          ['Industry', '~20%', 'Cooling of power plants; manufacturing processes; mining; much water returned but often polluted'],
          ['Municipal/domestic', '~10%', 'Drinking, cooking, sanitation, landscaping; major inequities — high-income households use 10× more than low-income households in same cities'],
        ]}
      />

      <Callout kind="connect">
        "Virtual water" is the hidden water embedded in products we consume. A 1 kg beef burger requires
        approximately 15,000 liters of water to produce (water for growing feed crops, drinking water for
        cattle, water for processing). A cotton T-shirt takes about 2,700 liters. This concept connects
        water resources (s7) to human population and consumption patterns (s5) and to sustainability (s8).
        When a country imports food-heavy products, it is effectively importing the water used to produce them.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Water Pollution: Types and Sources</Typography>

      <GuideTable
        headers={['Category', 'Definition', 'Examples']}
        rows={[
          ['Point source pollution', 'Pollution from a single, identifiable location; easier to regulate and monitor', 'Factory discharge pipes, municipal sewage treatment plant outfalls, oil spills from tankers'],
          ['Nonpoint source pollution', 'Pollution from diffuse, scattered sources over large areas; much harder to control', 'Agricultural runoff (pesticides, fertilizers, animal waste), urban stormwater (oil, heavy metals, trash), construction site erosion'],
          ['Agricultural runoff', 'Nitrogen (N) and phosphorus (P) from fertilizers; pesticides; sediment from erosion; pathogens from animal waste', 'Largest contributor to water quality problems in US — triggers eutrophication in lakes and coastal zones'],
          ['Industrial discharge', 'Heavy metals (mercury, lead, cadmium), solvents, acids, radioactive materials', 'Mercury methylation in aquatic food chains → bioaccumulation → neurological damage in fish-eating wildlife and people'],
          ['Municipal wastewater', 'Treated or untreated sewage containing pathogens (bacteria, viruses, parasites), nutrients, pharmaceuticals', 'Even treated wastewater contains pharmaceuticals (hormones, antibiotics) that affect aquatic life'],
          ['Thermal pollution', 'Industrial cooling water released at higher temperatures than receiving water', 'Reduces dissolved oxygen in water; stresses aquatic organisms that need cold water (salmonids)'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Eutrophication: When Too Many Nutrients Choke a Lake</Typography>

      <Analogy title="An overfertilized fish tank">
        Imagine your fish tank is beautifully clear and your fish are healthy. Now you dump two pounds of
        fertilizer into it. Within days, algae explode — the water turns green, then murky, then foul.
        The algae bloom eventually dies. Decomposing bacteria consume all the dissolved oxygen in the water
        breaking down the dead algae. Your fish suffocate — not from poison, but from lack of oxygen.
        That's eutrophication in a lake, river, or coastal bay. The fertilizer came from agricultural runoff
        upstream. The algae bloom came first; the dead zone came after. The mechanism is indirect but devastating:
        excess nutrients → algal bloom → algae die → decomposition → oxygen depletion (hypoxia) → aquatic dead zone.
      </Analogy>

      <MermaidDiagram chart={`graph TD
  A["Agricultural / Urban Runoff\n(excess nitrogen N and phosphorus P)"]
  B["Algal Bloom\n(rapid growth of algae and cyanobacteria\nin nutrient-rich water)"]
  C["Algae Die\n(when nutrients depleted or season changes)"]
  D["Bacterial Decomposition\n(bacteria break down dead algae —\nhighly oxygen-consuming)"]
  E["Hypoxia / Anoxia\n(dissolved oxygen drops below\nlevel fish and invertebrates need)"]
  F["Dead Zone\n(aquatic organisms die or flee;\nfisheries collapse locally)"]
  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  F -->|"Ongoing runoff\nperpetuates cycle"| B`} />

      <Callout kind="why-it-matters">
        The Gulf of Mexico Dead Zone is one of the largest human-caused dead zones on Earth. It forms each
        spring and summer when Mississippi River water (carrying nitrogen and phosphorus from Midwest farms)
        reaches the Gulf. In 2017, it measured about 22,700 km² — roughly the size of New Jersey. Shrimp,
        fish, and crabs flee or die. The fishing industry of Louisiana and the Gulf Coast suffers economically.
        This is a direct, traceable line from a decision made by a farmer in Iowa to a collapsed fishery
        in the Gulf of Mexico — illustrating how distant land use and water pollution are intimately connected.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Water Scarcity and Solutions</Typography>
      <GuideTable
        headers={['Type of scarcity', 'Cause', 'Where']}
        rows={[
          ['Physical water scarcity', 'Insufficient water in the region to meet demand — true hydrological deficit', 'Middle East, North Africa, sub-Saharan Africa, parts of Central Asia'],
          ['Economic water scarcity', 'Water exists but infrastructure, governance, or capital is lacking to access it', 'Parts of sub-Saharan Africa, South Asia — the "water poor" live near rivers they cannot safely tap'],
        ]}
      />

      <GuideTable
        headers={['Solution', 'Description & trade-offs']}
        rows={[
          ['Water conservation', 'Drip irrigation (reduces agricultural use by 30–50% vs. flood irrigation); low-flow fixtures; pricing water to reflect true cost'],
          ['Desalination', 'Removing salt from seawater or brackish water; energy-intensive (currently costs 3–5× treated freshwater); concentrated brine byproduct must be managed; used heavily in Middle East and Israel'],
          ['Water recycling / reclamation', 'Treating wastewater to drinking standards (potable reuse) or irrigation standards (non-potable reuse); increasingly common in water-scarce regions'],
          ['Watershed protection', 'Protecting forests and wetlands in watersheds maintains water quality and regulation naturally (cheaper than engineered treatment)'],
          ['Rainwater harvesting', 'Capturing and storing roof runoff for local use; especially important in regions with seasonal rainfall'],
        ]}
      />

      <Callout kind="coachs-note">
        The Clean Water Act (1972) is the primary US federal law protecting surface water quality. It regulates
        point source discharges (requires permits — NPDES permits), sets water quality standards, and has
        largely eliminated the most egregious industrial water pollution. Nonpoint source pollution (agricultural
        runoff) is far harder to regulate under the CWA and remains the leading cause of water quality
        problems in the US. Know this distinction: CWA controls point sources well, but nonpoint sources
        are the ongoing challenge.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 8: Energy Resources & Sustainability
// ─────────────────────────────────────────────────────────────────────
function Section8Energy() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Nonrenewable vs. Renewable Energy</Typography>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Energy resources fall into two broad categories based on whether they can be replenished on human
        timescales. <strong>Nonrenewable resources</strong> (fossil fuels + nuclear) are finite — once used,
        gone for millions of years. <strong>Renewable resources</strong> (solar, wind, hydro, geothermal, biomass)
        are replenished naturally on timescales compatible with human use.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>EROI: Energy Return on Investment</Typography>

      <Analogy title="Farming calories to survive">
        Imagine a subsistence farmer who must spend 1,000 calories of physical labor to harvest 1,500 calories
        of grain. Their EROI (energy return on investment) is 1.5:1. After eating enough to sustain their own
        labor, almost nothing is left over to feed anyone else — no surplus for a city, an army, or a university.
        Now compare to modern mechanized agriculture with an EROI of 10:1 (or to conventional oil at 30:1):
        for every unit of energy invested, you get 30 back. That enormous surplus is what built modern
        civilization — it powered factories, universities, hospitals, and everything else, because we didn't
        need everyone farming just to survive. As conventional oil fields deplete and we move to harder-to-extract
        unconventional sources (tar sands, EROI ~3:1) or some biofuels (EROI ~1.5:1), the energy surplus
        available to civilization shrinks. High EROI is not just an efficiency metric — it is the foundation
        of complex society.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        EROI = energy output ÷ energy input to extract/produce it. Higher EROI = more useful energy delivered
        per unit invested. When EROI falls toward 1:1, the energy source is barely worth producing.
      </Typography>

      <GuideTable
        headers={['Energy source', 'Approximate EROI', 'Notes']}
        rows={[
          ['Conventional oil (1950s)', '~100:1', 'Historical peak; easily extracted, enormous surplus'],
          ['Conventional oil (today, global avg)', '~25–30:1', 'Still high but declining as easy fields deplete'],
          ['Natural gas', '~20–30:1', 'High EROI; cleaner than coal but still fossil fuel'],
          ['Coal', '~40–80:1', 'Varies widely; historically high EROI; highest CO₂ per energy unit'],
          ['Nuclear', '~14–30:1', 'High EROI; no CO₂ in operation; uranium mining and waste storage costs'],
          ['Large hydroelectric', '~40–100:1', 'Among highest EROI of any energy source; site-specific'],
          ['Wind (modern turbines)', '~20–30:1', 'High EROI and improving; intermittent; manufacturing costs'],
          ['Solar PV (modern)', '~10–20:1', 'Improving rapidly; intermittent; manufacturing energy costs declining'],
          ['Tar sands / oil sands', '~3–5:1', 'Heavy environmental impact; low EROI marginal'],
          ['Corn ethanol (US)', '~1.3–1.5:1', 'Barely above 1:1; uses enormous land and water resources; controversial'],
        ]}
      />

      <Analogy title="Fossil fuels as Earth's savings account">
        Coal, oil, and natural gas are the compressed remains of ancient organic matter — plants and marine
        organisms that captured solar energy via photosynthesis over hundreds of millions of years, died,
        were buried, and under heat and pressure were transformed into carbon-dense fuels. Think of them as
        Earth's savings account: deposits made over 300–500 million years, locked securely underground.
        In roughly 300 years of industrialization, humanity is withdrawing that entire savings account —
        burning in centuries what took epochs to accumulate. The interest rate on that account (solar energy
        reaching Earth every day) is what renewables tap. We can live off the interest (renewables) or
        spend the savings (fossil fuels). Spending the savings also releases the carbon back to the atmosphere
        all at once, with consequences we're now measuring.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Costs and Benefits of Each Energy Source</Typography>

      <MermaidDiagram chart={`graph TD
  EN["Energy Sources"]
  EN --> FF["Fossil Fuels\n(coal, oil, natural gas)"]
  EN --> NUC["Nuclear"]
  EN --> SOL["Solar"]
  EN --> WND["Wind"]
  EN --> HYD["Hydroelectric"]
  EN --> GEO["Geothermal"]
  EN --> BIO["Biomass"]
  FF --> FF1["✓ High EROI, existing infrastructure\n✗ CO₂, SO₂, NOₓ, oil spills, mining impacts"]
  NUC --> NUC1["✓ Low emissions, reliable baseload\n✗ Radioactive waste storage, accident risk, high cost"]
  SOL --> SOL1["✓ Clean, increasingly cheap, distributed\n✗ Intermittent (night/clouds), land use, storage needed"]
  WND --> WND1["✓ Clean, low water use, cheapest new electricity\n✗ Intermittent, location-specific, bird/bat mortality"]
  HYD --> HYD1["✓ Reliable, low emissions, storage (reservoir)\n✗ Habitat disruption, fish passage, displaces communities"]
  GEO --> GEO1["✓ Consistent baseload, small footprint\n✗ Geographic limits (volcanic/tectonic zones)"]
  BIO --> BIO1["✓ Can use waste, carbon-neutral if managed\n✗ Land and water competition with food, low EROI biofuels"]`} />

      <GuideTable
        headers={['Energy source', 'Key environmental impacts']}
        rows={[
          ['Coal', 'Highest CO₂ emissions per unit energy; SO₂ and NOₓ → acid rain; mercury emissions; mountaintop removal mining devastates ecosystems; coal ash ponds can leak heavy metals'],
          ['Oil', 'CO₂ emissions; oil spills devastate marine and coastal ecosystems (Deepwater Horizon 2010 spilled 4.9 million barrels); air pollution from combustion; pipeline leaks'],
          ['Natural gas', 'Lower CO₂ than coal/oil but methane leaks from wells and pipelines (high GWP); fracking risks: induced seismicity, water contamination of aquifers, habitat fragmentation'],
          ['Nuclear', 'Low operating emissions; radioactive waste must be stored securely for thousands of years; accident risk (Chernobyl, Fukushima); uranium mining impacts; high construction cost'],
          ['Solar PV', 'Manufacturing energy and materials (silicon, rare metals); land use for large solar farms; end-of-life panel disposal; no emissions in operation'],
          ['Wind', 'Bird and bat mortality (turbine blade strikes); noise and visual impacts; large land footprint (though land can be co-used for farming); intermittency'],
          ['Hydroelectric', 'Dam construction floods large areas (habitat, farmland, communities); blocks fish migration; alters river sediment and thermal regimes; methane from decomposing vegetation in reservoirs'],
          ['Geothermal', 'Low surface impact; some hydrogen sulfide (H₂S) emissions; water use in some plants; geographic constraints'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Sustainability: The Brundtland Definition</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The most widely cited definition of sustainability comes from the 1987 Brundtland Commission report
        "Our Common Future": <strong>"Sustainable development is development that meets the needs of the
        present without compromising the ability of future generations to meet their own needs."</strong>
        Three pillars of sustainability: environmental (ecological integrity), social (equity, health),
        and economic (prosperity) — the "triple bottom line." All three must be addressed simultaneously;
        progress on one at the expense of another is not truly sustainable.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Key Sustainability Concepts</Typography>

      <GuideTable
        headers={['Concept', 'Definition', 'Example / application']}
        rows={[
          ['Ecological footprint', 'The amount of biologically productive land and water area needed to support a person\'s (or nation\'s) consumption and absorb their waste', 'US ecological footprint ~8 global hectares/person; global biocapacity ~1.6 gha/person → US lifestyle would require ~5 Earths if everyone lived that way'],
          ['Biocapacity', 'The ability of an ecosystem to regenerate resources and absorb waste', 'When ecological footprint > biocapacity, overshoot occurs — we\'re drawing down natural capital (like spending savings)'],
          ['Circular economy', 'Economic model in which waste is designed out — materials are reused, recycled, or composted in closed loops rather than discarded', 'Contrast with linear "take-make-dispose" model; cradle-to-cradle product design; industrial symbiosis (one factory\'s waste is another\'s feedstock)'],
          ['Tragedy of the commons', 'When a shared resource (commons) is depleted because each individual acts in their own rational short-term interest, ignoring collective long-term harm', 'Garret Hardin, 1968; examples: overfishing international waters, overgrazing shared pasture, CO₂ emissions; solution requires either privatization, regulation, or community governance (Elinor Ostrom)'],
          ['Net-zero emissions', 'Balancing the amount of greenhouse gases emitted with the amount removed from the atmosphere (through natural sinks or carbon capture)', 'Goal of the Paris Agreement for mid-century; requires massive energy transition and possibly carbon capture technology'],
        ]}
      />

      <Callout kind="connect">
        The tragedy of the commons (s8) is the underlying logic of climate change (s6): each nation (or person)
        has a short-term incentive to emit CO₂ freely, since the costs are distributed globally and the
        benefits (cheap energy) are local. Every open-access shared resource — ocean fisheries (s4),
        atmospheric CO₂ absorption capacity (s6), shared aquifers (s7) — faces the same tragedy.
        Solving environmental problems requires collective action, governance, and institutions that align
        individual incentives with collective outcomes.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>Air Pollution and Energy</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Burning fossil fuels releases a suite of air pollutants beyond CO₂ — each with its own environmental
        and health consequences. Understanding these is key to evaluating energy trade-offs.
      </Typography>

      <GuideTable
        headers={['Pollutant', 'Source', 'Environmental/health impact']}
        rows={[
          ['SO₂ (sulfur dioxide)', 'Coal combustion (coal contains sulfur impurities)', 'Combines with water vapor → H₂SO₄ (sulfuric acid) → acid rain; damages forests, aquatic ecosystems, stone buildings; respiratory irritant'],
          ['NOₓ (nitrogen oxides)', 'Combustion at high temperatures (vehicles, power plants)', 'Contributes to acid rain (HNO₃); reacts with VOCs in sunlight → tropospheric ozone (smog); respiratory damage'],
          ['Particulate matter (PM 2.5)', 'Combustion, dust, construction, wildfires', 'Penetrates deep into lungs; largest contributor to air pollution deaths (7 million/year globally); cardiovascular and respiratory disease'],
          ['CO (carbon monoxide)', 'Incomplete combustion (vehicles, wood burning)', 'Binds to hemoglobin more strongly than O₂; reduces blood oxygen transport; lethal at high concentrations'],
          ['Mercury (Hg)', 'Coal combustion, industrial processes', 'Converted to methylmercury in aquatic environments; bioaccumulates through food chains; neurotoxin especially for developing brains'],
          ['VOCs (volatile organic compounds)', 'Evaporation of gasoline, solvents, industrial chemicals', 'Precursors to ozone and secondary particulates; many are carcinogens'],
        ]}
      />

      <Callout kind="why-it-matters">
        Acid rain is formed when SO₂ and NOₓ from burning coal and vehicles react with water vapor in the
        atmosphere to form H₂SO₄ and HNO₃ — sulfuric and nitric acids. These acids fall as precipitation
        (rain, snow, fog) hundreds to thousands of miles from their sources. Effects include: acidification
        of lakes and streams (killing sensitive fish species), leaching of aluminum from soils (toxic to tree
        roots), damage to forest ecosystems across the Appalachians and Europe, and corrosion of limestone
        and marble buildings and monuments. The US Clean Air Act amendments of 1990 created a cap-and-trade
        system for SO₂ that successfully reduced acid rain — one of the greatest environmental policy successes
        of the late 20th century.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Energy Transition: Where the World Is Heading</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Global energy systems are in transition. Between 2010 and 2023, the cost of solar photovoltaic electricity
        fell by over 90%, making solar the cheapest source of new electricity generation in most of the world.
        Wind costs also fell dramatically. This cost revolution is driving rapid deployment, but several
        structural challenges must be solved to complete the energy transition:
      </Typography>

      <GuideTable
        headers={['Challenge', 'Description', 'Emerging solutions']}
        rows={[
          ['Intermittency', 'Solar and wind only generate when the sun shines or wind blows', 'Battery storage (lithium-ion and next-generation chemistries); pumped hydro storage; hydrogen; smart grids that balance supply and demand in real time'],
          ['Grid infrastructure', 'Existing transmission lines were built for centralized fossil fuel plants, not distributed renewables', 'New long-distance transmission to connect windy/sunny regions to population centers; microgrids for resilience'],
          ['Electrification of "hard to decarbonize" sectors', 'Steel, cement, shipping, aviation are difficult to electrify directly', 'Green hydrogen (made from water using renewable electricity); direct electrification; carbon capture for remaining emissions'],
          ['Land and material use', 'Large-scale wind and solar require land and raw materials (lithium, cobalt, rare earths)', 'Offshore wind; agrivoltaics (solar panels over farmland); recycling of materials; next-generation battery chemistries'],
          ['Equity and just transition', 'Workers and communities dependent on fossil fuel industries face economic disruption', 'Retraining programs; economic diversification in coal communities; fair distribution of benefits of clean energy'],
        ]}
      />

      <Callout kind="make-it-stick">
        For exams, know these EROI comparisons: conventional oil ~25–30:1 (high surplus), corn ethanol ~1.5:1
        (nearly break-even), modern wind/solar ~20:1 (high and improving). Know the three pillars of
        sustainability (environmental, social, economic). Know the Brundtland definition. Know what the
        tragedy of the commons is and be able to apply it to an example. Know that SO₂ → acid rain and
        CO₂ → climate change are distinct problems from burning coal (two different pollutants, two
        different environmental impacts). These are the conceptual anchors for nearly every energy and
        sustainability question you'll encounter.
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Environmental Science Exam Strategy</Typography>

      <Callout kind="coachs-note">
        Environmental science exams are heavily scenario-based. You'll be given data, graphs, maps, or case
        studies and asked to interpret, analyze, or apply content — not just recall definitions. The student
        who understands concepts in context outperforms the student who memorized terms but can't apply them.
        These strategies are designed for that kind of applied exam.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>1. Read graphs and data tables carefully</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Before answering a graph-based question, check: (a) What is on each axis and what are the units?
        (b) What is the trend — increasing, decreasing, leveling off? (c) Are there any anomalies or
        notable points? (d) Does the graph show correlation or can you infer causation from the context?
        Environmental science loves graphs showing CO₂ over time (Keeling Curve), temperature anomalies,
        population growth curves, and energy production by source.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>2. Distinguish correlation from causation</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Two variables can trend together for many reasons: one causes the other (causation), both are caused
        by a third variable (confounding variable), or it's coincidence. Sea surface temperatures and hurricane
        intensity are correlated and causally linked (warm water fuels hurricanes). Ice cream sales and
        drowning deaths are correlated but not causally linked (both rise in summer because of heat and outdoor
        activity). Environmental science questions often require you to distinguish these — especially when
        evaluating competing explanations for observed trends.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>3. Know your cycles cold (no pun intended)</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The four biogeochemical cycles (carbon, nitrogen, water, phosphorus) are the most frequently tested
        content area. Know which processes move elements in which direction, which processes are biotic vs.
        abiotic, which organisms play key roles, and which human activities disrupt each cycle. A two-minute
        mental review of each cycle before the exam is worth more than rereading any individual section.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>4. Common confusions to avoid</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Food web vs. food chain:</strong> A food chain is a single linear sequence (grass → rabbit → fox).
        A food web is the realistic overlapping network of all food chains in an ecosystem. Real ecosystems
        are webs, not chains — and webs are more resilient because they have more redundancy.
      </Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Biome vs. ecosystem:</strong> A biome is a large geographic region defined by climate and
        characteristic vegetation (tropical rainforest, tundra, etc.). An ecosystem is any area where living
        organisms interact with each other and their nonliving environment — a pond is an ecosystem, a rotting
        log is an ecosystem, but they're not biomes. Biomes contain many ecosystems.
      </Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Weather vs. climate:</strong> Weather is the short-term (days to weeks) atmospheric conditions
        in a specific place. Climate is the long-term (30+ year) average pattern of weather for a region.
        "Climate change" means the average pattern is shifting — not that every day is hotter, but that
        the distribution of temperatures is shifting toward higher averages and more extreme events.
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Photosynthesis vs. respiration (directions):</strong> Photosynthesis: CO₂ IN, O₂ OUT, energy stored.
        Respiration: O₂ IN, CO₂ OUT, energy released. Only producers (plants, algae, cyanobacteria) photosynthesize.
        ALL living things respire. On a net basis, healthy ecosystems are net carbon sinks (photosynthesis
        exceeds respiration); disturbed or degraded ecosystems can become net carbon sources.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>5. Use the connections between sections</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Scenario questions often cross section boundaries. When you see a scenario about a farmer applying
        fertilizer, think: nitrogen cycle (s2) → eutrophication (s7) → algal bloom and dead zone (s7) →
        biodiversity loss in aquatic ecosystem (s4). When you see a scenario about deforestation, think:
        habitat loss (s4) → carbon release (s2, s6) → disrupted water cycle (s2, s7) → soil erosion (s5).
        Practice mapping each scenario to its web of connections rather than a single section.
      </Typography>
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Environmental Science Glossary</Typography>
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
