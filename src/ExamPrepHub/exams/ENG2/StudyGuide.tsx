// ENG2 Study Guide — accordion-based layout for SC's English 2 course (and
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

const READING_PROGRESS_KEY = 'exam-prep-reading:ENG2';
const COMPLETION_KEY = 'exam-prep-completed:ENG2';
// Section-quiz storage is separate from drillStats. Quizzes are quick recall
// checks and don't influence the readiness signal.
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:ENG2';

// Maps each non-exempt section to a question-bank subdomain. Sections in this
// map get a SectionQuiz at the end pulling 3–4 questions from that subdomain.
const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Reading Literature',
  s3: 'Reading Informational Text',
  s4: 'Literary Devices & Figurative Language',
  s5: 'Author’s Craft & Structure',
  s6: 'Argument & Evidence',
  s7: 'Language Conventions',
  s8: 'Vocabulary in Context',
  s9: 'Writing & Revision',
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
  { id: 's2',       num: '2',  title: 'Reading Literature',                    icon: '📖' },
  { id: 's3',       num: '3',  title: 'Reading Informational Text',            icon: '📰' },
  { id: 's4',       num: '4',  title: 'Literary Devices & Figurative Language',icon: '🌹' },
  { id: 's5',       num: '5',  title: "Author's Craft & Structure",            icon: '✒️' },
  { id: 's6',       num: '6',  title: 'Argument & Evidence',                   icon: '⚖️' },
  { id: 's7',       num: '7',  title: 'Language Conventions',                  icon: '📝' },
  { id: 's8',       num: '8',  title: 'Vocabulary in Context',                 icon: '🔤' },
  { id: 's9',       num: '9',  title: 'Writing & Revision',                    icon: '✏️' },
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
// Real English 2 content. Mixed Callout kinds. Analogies open conceptual
// sections. Mermaid diagrams where a decision tree or flow helps.
// ──────────────────────────────────────────────────────────────────────

function SectionContent({ id }: { id: string }) {
  switch (id) {
    case 's1':       return <Section1BigPicture />;
    case 's2':       return <Section2ReadingLit />;
    case 's3':       return <Section3ReadingInfo />;
    case 's4':       return <Section4Devices />;
    case 's5':       return <Section5Craft />;
    case 's6':       return <Section6Argument />;
    case 's7':       return <Section7Language />;
    case 's8':       return <Section8Vocab />;
    case 's9':       return <Section9Writing />;
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
        English 2 is the second high-school English course in the South Carolina sequence, and the
        EOCEP at the end of it is where the state checks whether you can do four things consistently:
        read literary and nonfiction passages closely, recognize how authors use language and structure
        to make meaning, evaluate arguments and evidence, and write and revise clear, well-organized
        prose. Every section of this guide maps to one slice of that work. None of the skills are
        magical — they are a small set of habits, applied carefully, across a lot of different texts.
      </Typography>

      <Analogy title="English 2 as the language of attention">
        Think of every text on the EOCEP — a poem, a magazine article, a Shakespeare excerpt, a
        political speech — as a piece of wiring laid out on a table. Your job is not to memorize the
        finished circuit; it is to recognize the components: the metaphors that carry feeling, the
        topic sentences that anchor paragraphs, the rhetorical appeals that try to persuade you, the
        commas and semicolons that hold ideas together. Once you can name the parts, you can answer
        any question the test throws at you, even on a passage you have never seen before.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        How to use this guide
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Each subdomain section has the same shape: a short intro that connects the topic to something
        you already understand, key terms and worked examples, callouts that flag traps and connections,
        and a "quick check" at the bottom — 3 or 4 questions pulled from the practice bank so you can
        verify the ideas landed. The quick check is formative; it does not move your Diagnostic
        readiness number. Take it freely.
      </Typography>

      <Callout kind="why-it-matters">
        The English 2 EOCEP counts <strong>20% of your final course grade</strong> in South Carolina.
        That is not decorative — a student with a 90 class average and a 50 EOCEP ends up with about
        an 82 final grade. Treating this exam as low-stakes is the most expensive mistake you can
        make. The good news: it is a well-defined test on a finite list of skills, and steady study
        from now to test day is enough to do well.
      </Callout>

      <Callout kind="coachs-note">
        Do not try to memorize every term in every textbook. The EOCEP rewards understanding what
        kind of move an author is making (is this metaphor or hyperbole? is this an appeal to logos
        or pathos?), the ability to spot it inside a passage you have never read before, and the
        ability to write briefly about WHY the author chose that move. Practice that kind of
        recognition and reasoning, not vocabulary recall in isolation.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The eight topics at a glance
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[English 2] --> B[Reading Literature - plot, character, theme, POV]
    A --> C[Reading Informational Text - central idea, evidence, structure]
    A --> D[Literary Devices and Figurative Language]
    A --> E[Author Craft and Structure - pacing, allusion, narrative choices]
    A --> F[Argument and Evidence - claim counterclaim ethos pathos logos]
    A --> G[Language Conventions - grammar punctuation sentence structure]
    A --> H[Vocabulary in Context - roots prefixes connotation]
    A --> I[Writing and Revision - thesis transitions citation editing]
        `}
      />

      <Callout kind="in-plain-words">
        Most of English 2 boils down to four jobs: <strong>read closely</strong> (notice what the
        author actually did), <strong>name the move</strong> (metaphor? counterclaim? topic
        sentence?), <strong>explain the effect</strong> (what does this choice DO for the reader?),
        and <strong>write clearly</strong> (with a thesis, evidence, and clean grammar). Get good at
        all four and you've got the EOCEP covered.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three habits that pay off for the whole year
      </Typography>
      <GuideTable
        headers={['Habit', 'Why it matters', 'How to build it']}
        rows={[
          ['Always anchor a claim about a text to a specific quote or detail', 'Forces evidence-based reading, exactly what the EOCEP rewards', 'Whenever you state an interpretation, point to the line that proves it'],
          ['Read every passage twice — once for plot, once for craft', 'First pass catches WHAT happens; second pass catches HOW the author tells it', 'Treat the first read as a flyover and the second as the close-up'],
          ['When you write, draft fast and revise slow', 'First drafts are about getting ideas down; revision is where good writing actually happens', 'Schedule a deliberate revision pass for every paper, not just a proofread'],
        ]}
      />

      <Callout kind="try-this">
        Pick any short paragraph in a book or article today. Read it once for content. Then re-read
        and write down five things the author did at the craft level: a metaphor, a sentence-length
        shift, a transition, a vivid verb, a deliberate piece of dialogue. The more you make this a
        habit, the faster you will spot moves on EOCEP passages you have never seen before.
      </Callout>

      <Callout kind="connect">
        The four jobs above carry forward into every later English class, every college course, every
        professional email. Reading closely, naming the move, explaining the effect, and writing
        clearly are the skills behind law school analysis, journalism, scientific writing, and the
        cover letter you will send for your first job. English 2 is foundation work.
      </Callout>
    </Box>
  );
}

// ── Section 2: Reading Literature ─────────────────────────────────────
function Section2ReadingLit() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Literature — fiction, drama, poetry — is the work of authors using imagined situations to
        explore real human concerns: love, loyalty, fear, ambition, loss, courage. To read literature
        well, you have to track several layers at once: the literal events (plot), the people
        involved (character), the time and place (setting), who is telling the story (point of view),
        and the underlying idea the work is exploring (theme). The EOCEP will give you a passage you
        have never seen and ask you about all of these.
      </Typography>

      <Analogy title="A literary text as a layered cake">
        Most readers eat the top layer of a story — what happens, who wins, who loses. The skilled
        reader cuts through to the layers underneath: the characters' motivations, the author's tone,
        the recurring symbol, the irony of the ending. Each layer is a different reading. On the
        EOCEP, the questions will rarely be about the surface layer; they will be about what is
        underneath. Practice tasting every layer.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The five stages of plot
      </Typography>
      <MermaidDiagram
        chart={`
flowchart LR
    A[Exposition - setup, characters, world] --> B[Rising Action - conflict and complications]
    B --> C[Climax - turning point, highest tension]
    C --> D[Falling Action - consequences play out]
    D --> E[Resolution - new normal]
        `}
      />
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        This shape is sometimes called Freytag's pyramid. Almost every short story, novel, play, or
        film follows it in some form. The EOCEP will often ask you to identify which stage a given
        excerpt is in — practice matching small passages to the right stage.
      </Typography>

      <GuideTable
        headers={['Stage', 'What happens', 'Sample EOCEP signal phrase']}
        rows={[
          ['Exposition', 'Characters, setting, and ordinary situation are introduced before the central conflict starts', '"Maya had lived in the small fishing town for ten years before…"'],
          ['Rising action', 'Complications build, conflicts intensify, choices narrow', '"As the weeks passed, the disagreement deepened, and Maya found herself…"'],
          ['Climax', 'The turning point — the central conflict reaches its peak', '"With everyone watching, Maya finally stood up and said…"'],
          ['Falling action', 'The consequences of the climax unfold', '"After her speech, the room emptied, and Maya walked home in silence…"'],
          ['Resolution', 'A new normal settles in', '"By the next spring, the town had changed and so had she."'],
        ]}
      />

      <Callout kind="watch-for">
        A common trap: the EOCEP will ask "what is the CLIMAX of this passage?" and offer an
        emotional or violent scene that is actually rising action. The climax is the TURNING POINT —
        the moment the central conflict tips. A loud fight scene before the turning point is rising
        action, not climax. Ask yourself: AFTER this moment, do things change direction?
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Character — protagonist, antagonist, and how authors reveal them
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The <strong>protagonist</strong> is the central character whose journey the story follows.
        The <strong>antagonist</strong> is whoever or whatever opposes the protagonist — often a
        person, sometimes society or nature or the protagonist's own internal struggle. Most modern
        stories rely on <strong>indirect characterization</strong>: the author SHOWS personality
        through actions, words, thoughts, appearance, and how other characters react, rather than
        telling you directly.
      </Typography>

      <Analogy title="Characterization as evidence-gathering">
        Think of yourself as a detective. The author rarely says outright "Mara was insecure." Instead
        you piece it together — Mara apologizes for things that are not her fault, she over-explains
        herself, she lets her sister speak for her in restaurants. Each piece of evidence is part of
        the case for "insecure." That is indirect characterization — the author SHOWS through
        Speech, Thoughts, Effect on others, Actions, and Looks (the STEAL method).
      </Analogy>

      <GuideTable
        headers={['Method', 'What the author shows you', 'Example']}
        rows={[
          ['Speech', 'How a character talks — vocabulary, slang, formality, tone', 'A character who says "yes, ma\'am" to everyone reveals deference or upbringing'],
          ['Thoughts', 'The character\'s internal monologue, often via narration', '"He smiled, but inwardly he hated her" reveals a hidden conflict'],
          ['Effect on others', 'How other characters react to this character', 'If everyone falls silent when she walks in, she has power or fear-presence'],
          ['Actions', 'What the character chooses to do under pressure', 'Choosing to lie under pressure reveals fear or self-protection'],
          ['Looks', 'Physical appearance, dress, posture — often used symbolically', 'A character who is always tidy may be controlling, anxious, or careful'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>STEAL: Speech, Thoughts, Effect on others, Actions, Looks.</strong> Every time an EOCEP
        passage asks "What does this paragraph suggest about the character?" run STEAL — what does the
        character say, think, cause others to do, do themselves, and look like? At least one of those
        five usually contains the answer.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Point of view (POV) — who is telling the story
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Who is the narrator?] --> B{Does the narrator say I?}
    B -->|Yes| C[First Person - narrator is a character inside the story]
    B -->|No| D{How many minds can the narrator see into?}
    D -->|One| E[Third Person Limited - outside narrator but locked to one character]
    D -->|Many| F[Third Person Omniscient - outside narrator who knows all minds]
    A --> G{Does the narrator say you?}
    G -->|Yes| H[Second Person - rare outside instructions and choose-your-own]
        `}
      />

      <GuideTable
        headers={['POV', 'Pronouns', 'Effect', 'Limitation']}
        rows={[
          ['First person', 'I, me, my', 'Intimate access to one mind, distinctive voice', 'Reader only sees what the narrator can see; possibly unreliable'],
          ['Second person', 'You', 'Reader becomes the character', 'Rare and hard to sustain — feels unnatural for long fiction'],
          ['Third person limited', 'He, she, they (one character)', 'Outside view + access to one character\'s thoughts', 'Cannot see into other minds'],
          ['Third person omniscient', 'He, she, they (all characters)', 'Can move between minds and times', 'Less intimate; can feel distanced'],
        ]}
      />

      <Callout kind="watch-for">
        The most common POV mistake is calling first-person "third-person limited" because both follow
        one character. The simple rule: if the narrator says "I," it is first person, no matter how
        much they describe other characters. If the narrator says "she" but only ever shows ONE
        person's thoughts, it is third-person limited.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Theme — the heart of the work
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Theme is the most-misunderstood literary element. It is NOT the topic. The topic of a story
        might be "love" or "war" or "growing up," but the THEME is a full statement — the author's
        claim about that topic. "First love permanently changes how you see yourself." "War
        dehumanizes both sides." "Growing up requires losing innocence." On the EOCEP, theme answer
        choices that are one or two words are usually traps; the correct answer is almost always a
        complete sentence with a claim.
      </Typography>

      <Analogy title="Topic vs. theme as ingredient vs. recipe">
        The TOPIC is an ingredient — "tomato." The THEME is the recipe — "Tomatoes ripen best on the
        vine; impatience produces a bland fruit." The ingredient alone doesn't make a meal; the
        recipe takes the ingredient somewhere. When you analyze theme, you have to ask not just
        "what is this about?" but "what is the author SAYING about it?"
      </Analogy>

      <Callout kind="in-plain-words">
        A working test: try to write the theme of any story you have read as one sentence. If it has a
        subject and a verb and makes a claim, it is probably a theme. If it is just two words, it is
        still a topic. "Family." → topic. "Family obligations can become a cage." → theme.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — finding theme in a tiny passage
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7, fontStyle: 'italic' }}>
        "She had wanted to leave for years. Now the house was empty, her mother was in the ground,
        and she stood on the porch with nothing stopping her. She closed the front door, locked it,
        and sat down on the steps to wait for sunrise."
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        TOPIC: leaving home / parental loss. THEME (one possibility): The freedom we crave for years
        sometimes turns into paralysis when it finally arrives. Notice that the theme is a CLAIM, not
        a summary — it takes a position about what the story shows.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Conflict — internal and external
      </Typography>
      <GuideTable
        headers={['Conflict type', 'Definition', 'Example']}
        rows={[
          ['Character vs. self', 'Internal struggle — values, fears, doubts in tension', 'A character debating whether to tell the truth that will break a friendship'],
          ['Character vs. character', 'Two people in direct opposition', 'Protagonist trying to win a contest against a rival'],
          ['Character vs. nature', 'A force of the natural world threatens the character', 'Survival story in a blizzard or shipwreck'],
          ['Character vs. society', 'Character fighting laws, traditions, expectations', 'Activist challenging unjust laws or family expectations'],
          ['Character vs. supernatural / technology', 'Forces beyond the natural world or human-made systems', 'Sci-fi or horror — battling AI, ghosts, or alien forces'],
        ]}
      />

      <Callout kind="connect">
        Stories often layer MULTIPLE conflicts. A war novel might combine character vs. character
        (two soldiers), character vs. nature (the cold), and character vs. self (the moral cost of
        violence). On the EOCEP, "which type of conflict is most clearly at the center?" questions
        ask you to identify the DOMINANT conflict — the one driving the story\'s central tension.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Setting — more than time and place
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Setting is when and where a story happens, but in skilled writing it also shapes character
        and theme. A story set in a rural South Carolina town in the 1960s carries assumptions about
        race, class, and political moment. A story set on a generation ship in deep space brings
        different assumptions. Setting is a craft choice, not just background.
      </Typography>

      <Callout kind="try-this">
        Pick a story you read this year and rewrite the FIRST PARAGRAPH in a different setting —
        same characters, different time and place. Notice what has to change. Does the dialogue
        still work? Do the conflicts still make sense? That sensitivity is exactly the skill the
        EOCEP tests when it asks about the role of setting in shaping meaning.
      </Callout>
    </Box>
  );
}

// ── Section 3: Reading Informational Text ─────────────────────────────
function Section3ReadingInfo() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Informational text — articles, essays, speeches, biographies, news, opinion pieces — is the
        nonfiction half of your reading life. Where literature uses imagined situations to explore
        human concerns, informational text uses facts, arguments, and explanations to inform or
        persuade. The reading skills are similar (close attention, evidence-based thinking) but the
        author moves are different: there are claims and counterclaims instead of plots, central
        ideas instead of themes, and text structures instead of plot stages.
      </Typography>

      <Analogy title="Informational text as a building you walk through">
        Imagine each nonfiction text as a building. The introduction is the lobby — it tells you
        where you are and where you are about to go. Each body paragraph is a room with its own
        purpose, with a topic sentence on the doorframe. The transitions are the hallways connecting
        rooms. The conclusion is the exit — it should hand you something to carry out. Good readers
        feel the architecture; poor readers wander hoping for a landmark.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Central idea — the main point, in a full sentence
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The CENTRAL IDEA of an informational text is the single most important thing the author wants
        the reader to take away — usually expressible as one sentence. It is not the topic. "Climate
        change" is a topic; "Coastal communities in South Carolina face accelerating risk from
        climate-driven sea-level rise" is a central idea. The first is a noun phrase; the second is a
        claim. EOCEP answers shaped like noun phrases are usually traps.
      </Typography>

      <Callout kind="make-it-stick">
        <strong>Topic = a noun phrase. Central idea = a complete sentence with a claim.</strong> If a
        candidate answer is short and noun-only, suspect it. The correct central idea answer almost
        always makes a claim that you could agree or disagree with.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Where to find the central idea
      </Typography>
      <GuideTable
        headers={['Location', 'How to use it', 'Caution']}
        rows={[
          ['Introduction', 'Skilled writers preview the central idea in the intro — often in the last sentence', 'Some intros use a hook first; the central idea may come a few sentences in'],
          ['Topic sentences', 'Each body paragraph\'s topic sentence usually supports the central idea — assemble them and the pattern emerges', 'Some authors bury topic sentences mid-paragraph — read each carefully'],
          ['Conclusion', 'Skilled writers restate the central idea in fresh wording at the end', 'Conclusions often extend or generalize — make sure you read the actual claim'],
          ['Title and headings', 'Often signal the topic directly; sometimes hint at the central idea', 'Headlines exaggerate; do not stop at the title alone'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Author's purpose — the PIE acronym
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Every informational text has a PURPOSE — a reason the author wrote it. The classic acronym
        is PIE: <strong>P</strong>ersuade, <strong>I</strong>nform, <strong>E</strong>ntertain. Many
        texts also Explain or Describe. Identifying purpose tells you how skeptically to read.
      </Typography>
      <GuideTable
        headers={['Purpose', 'Author goal', 'Read-it-like-this']}
        rows={[
          ['Persuade', 'Convince the reader of a particular position', 'Track the claim and evidence; watch for selective evidence and emotional appeals'],
          ['Inform', 'Convey accurate facts about a topic', 'Cross-check; expect a more neutral tone'],
          ['Entertain', 'Engage the reader with humor, story, or vivid language', 'Enjoy it; do not expect rigorous evidence'],
          ['Explain', 'Make a complex concept understandable', 'Watch for clear structure, definitions, examples'],
          ['Describe', 'Paint a detailed picture of something', 'Notice the sensory and concrete language'],
        ]}
      />

      <Callout kind="watch-for">
        A persuasive piece can LOOK informative — strong persuasive writers cite statistics and quote
        experts. The giveaway is selective evidence: do you notice the piece presenting only one
        side, or framing data in a way that supports a single conclusion? Persuasion is not always
        bad — it is often legitimate — but readers should KNOW when they are being persuaded.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Text structure — how the piece is organized
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Nonfiction writers choose one (or several) organizational patterns. Spotting the structure
        early helps you predict what comes next and locate key information faster. The five most
        common structures on the EOCEP are:
      </Typography>
      <GuideTable
        headers={['Structure', 'Signal words to watch for', 'Common purposes']}
        rows={[
          ['Chronological / sequence', 'first, next, then, after, by 1990, finally', 'Histories, biographies, how-to articles'],
          ['Cause and effect', 'because, as a result, consequently, leads to, therefore', 'Science articles, news analyses'],
          ['Compare and contrast', 'however, unlike, in contrast, similarly, on the other hand', 'Reviews, side-by-side analyses'],
          ['Problem and solution', 'problem, issue, the solution is, one approach is, to address this', 'Op-eds, policy pieces, scientific journalism'],
          ['Description / spatial', 'next to, above, beside, in the foreground, around', 'Travel writing, place-based reporting'],
        ]}
      />

      <Callout kind="connect">
        Many real-world articles MIX structures — an op-ed might use problem/solution overall but
        compare/contrast within one paragraph. On the EOCEP, ask which structure DOMINATES, but
        recognize that mixing is normal in skilled writing.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Evidence — what to look for, how to evaluate
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Strong evidence supports a claim with verifiable, specific information. Common categories
        on the EOCEP:
      </Typography>
      <GuideTable
        headers={['Evidence type', 'Strengths', 'Weaknesses']}
        rows={[
          ['Statistics from credible studies', 'Hard to argue with; show patterns at scale', 'Can be cherry-picked; numbers can mislead without context'],
          ['Expert testimony', 'Carries authority; signals depth of knowledge', 'Experts can be biased or wrong; check credentials'],
          ['Anecdotes and personal stories', 'Emotionally engaging; humanize abstract issues', 'A single story is not statistically representative'],
          ['Historical examples', 'Show patterns over time; harder to dispute', 'Context may not transfer cleanly to today'],
          ['Direct quotations', 'Preserve the source\'s exact wording', 'Can be taken out of context; check for selective quotation'],
        ]}
      />

      <Callout kind="why-it-matters">
        The EOCEP often asks "which piece of evidence BEST supports the claim?" The answer is rarely
        the most emotional one. The strongest evidence is usually the most specific, verifiable,
        large-in-scale, and from a credible source. Anecdotes can be powerful openers, but they are
        rarely the strongest stand-alone evidence.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Inference vs. explicit statement
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        An EXPLICIT statement is something the text comes right out and says. An INFERENCE is a
        conclusion you draw by combining what the text says with what you already know — reading
        between the lines. Strong inferences are always anchored to specific evidence in the passage.
        On the EOCEP, "the passage suggests" and "the reader can infer" are signals that you should
        look for evidence in the passage AND combine it with reasoning.
      </Typography>

      <Callout kind="try-this">
        Read any news article today. Underline three explicit statements (things the text actually
        says) and write two inferences (things you concluded but were not directly stated). Then for
        each inference, write the sentence or detail from the article that supports it. That is the
        exact structure the EOCEP wants from you on inference questions.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Objective summary — the discipline of neutrality
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        An OBJECTIVE summary restates the central idea and key supporting details WITHOUT injecting
        the reader's own opinion. It is one of the harder skills to develop because most of us want
        to argue back. Practice writing two-sentence summaries of any nonfiction text without using
        words like "good," "bad," "should," or "wrong."
      </Typography>

      <Callout kind="coachs-note">
        Objectivity does not mean believing the author. It means accurately RESTATING what the
        author claimed before evaluating it. Critical thinkers do both: summarize the argument
        fairly, then critique it. Strong writers and readers separate the two steps cleanly.
      </Callout>
    </Box>
  );
}

// ── Section 4: Literary Devices & Figurative Language ─────────────────
function Section4Devices() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Literary devices are the tools authors use to make ordinary language do extraordinary work.
        A metaphor turns one thing into another; a simile holds two things side by side; imagery
        engages the senses; symbols carry meaning across a whole work. The EOCEP will quiz you on
        identifying devices in passages you have never read — so memorizing the names is only step
        one. Step two is recognizing them in the wild.
      </Typography>

      <Analogy title="Devices as a writer's toolkit">
        Imagine a writer at a workbench with a row of tools laid out. Metaphor is the hammer — direct,
        forceful, used for the big work. Simile is the screwdriver — more delicate, used for precise
        comparison. Imagery is the paintbrush — used to color a scene. Personification is the chisel
        — used to give shape to abstract or non-human things. Hyperbole is the megaphone — used for
        emphasis. A skilled writer reaches for the right tool for each job; a skilled reader can name
        each tool the moment it appears in the text.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The figurative-language taxonomy
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Figurative Language] --> B[Comparison-based]
    A --> C[Sound-based]
    A --> D[Meaning-based]
    A --> E[Sensory-based]
    B --> B1[Simile - uses like or as]
    B --> B2[Metaphor - says one thing IS another]
    B --> B3[Personification - human qualities to non-human]
    B --> B4[Allusion - reference to known work or person]
    C --> C1[Alliteration - repeated initial consonants]
    C --> C2[Assonance - repeated vowel sounds]
    C --> C3[Onomatopoeia - words that sound like meaning]
    D --> D1[Hyperbole - deliberate exaggeration]
    D --> D2[Understatement - deliberate de-emphasis]
    D --> D3[Irony - gap between expectation and reality]
    D --> D4[Symbolism - object stands for something larger]
    E --> E1[Imagery - language appealing to the five senses]
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Comparison devices — metaphor, simile, personification
      </Typography>
      <GuideTable
        headers={['Device', 'How it works', 'Example']}
        rows={[
          ['Simile', 'Direct comparison using "like" or "as"', '"Her voice was like silk" — holds voice and silk side by side'],
          ['Metaphor', 'Equates one thing with another, without "like" or "as"', '"Her voice was silk" — fuses voice and silk into one thing'],
          ['Personification', 'Gives human qualities to non-human things', '"The wind whispered through the pines"'],
          ['Extended metaphor', 'A metaphor that runs across multiple lines or a whole passage', 'Emily Dickinson casting hope as a bird across many lines'],
          ['Allusion', 'Brief reference to a well-known work, person, place, or event', '"She had the patience of Job" — Bible'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Like / as = simile. No like / as = metaphor.</strong> Both compare; only one uses the
        word. If a sentence equates two things without "like" or "as," it is a metaphor every time.
        Personification is a specialized metaphor — one of the two compared things is human-like and
        the other is not.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Worked example — naming the device
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7, fontStyle: 'italic' }}>
        Excerpt: "Time crawled through the afternoon. By three o'clock, the clock had given up
        entirely. The classroom was a furnace."
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Three devices in three sentences. "Time crawled" — personification (time given the human-like
        action of crawling). "The clock had given up entirely" — personification (a clock given a
        human-like state). "The classroom was a furnace" — metaphor (classroom and furnace equated
        directly, no "like"). Strong readers can name multiple devices in a single short passage.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Sensory imagery — the five-sense scan
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        IMAGERY is descriptive language that appeals to the five senses. Strong writers do not just
        rely on sight — they engage sound, smell, taste, and touch too. When analyzing imagery on the
        EOCEP, identify which senses the author is engaging.
      </Typography>
      <GuideTable
        headers={['Sense', 'Example phrase']}
        rows={[
          ['Sight', '"The neon sign threw red light across the wet pavement"'],
          ['Sound', '"Wheels crunched over frozen gravel; somewhere a dog howled"'],
          ['Smell', '"Wood smoke and coffee mixed in the cold air"'],
          ['Taste', '"The metallic tang of blood filled her mouth"'],
          ['Touch', '"The wool sweater scratched against her sunburned shoulders"'],
        ]}
      />

      <Callout kind="try-this">
        Write three sentences describing your school cafeteria using DIFFERENT senses — one for sound,
        one for smell, one for touch. Resist sight; everyone defaults to it. The result will feel more
        vivid because you have engaged senses readers rarely encounter in writing.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Symbolism and motif
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A SYMBOL is when an object, place, or action stands for something larger than itself. A flag
        for a country; a dove for peace; a green light at the end of a dock for an unreachable dream.
        Symbols often recur across a work, accumulating meaning each time. When a symbol or image
        recurs deliberately, it is also called a MOTIF.
      </Typography>

      <Analogy title="A symbol as a packed suitcase">
        A symbol is a small object that carries a large meaning packed inside it. The green light in
        "The Great Gatsby" is just a light bulb — but Fitzgerald packs into it longing, dreams, the
        American myth of self-reinvention, the distance between desire and reality. When you read,
        ask of any object that the author lingers on: what is packed inside?
      </Analogy>

      <Callout kind="watch-for">
        Not every object is a symbol. EOCEP traps include calling normal setting details "symbols"
        when the author has not lingered on them. A symbol usually recurs, gets emphasized, or is
        named in a thematically charged moment. If the object appears once in a list of furniture and
        is never mentioned again, it is probably not a symbol — it is just furniture.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Irony — the three flavors
      </Typography>
      <GuideTable
        headers={['Type', 'Definition', 'Example']}
        rows={[
          ['Verbal irony', 'Speaker says the opposite of what they mean (often sarcastic)', '"Oh, perfect — another flat tire" (when nothing is perfect)'],
          ['Situational irony', 'The outcome is the opposite of what was expected', 'The fire station burns down'],
          ['Dramatic irony', 'The audience knows something the character does not', 'Romeo thinks Juliet is dead, but the audience knows she is only sleeping'],
        ]}
      />

      <Callout kind="in-plain-words">
        Irony is always about a GAP — between what is said vs. meant (verbal), expected vs. happened
        (situational), or known vs. unknown (dramatic). When you spot a gap, identify which kind. The
        EOCEP loves to put all three into one passage and ask you to label each one correctly.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Sound-based devices — alliteration, assonance, onomatopoeia
      </Typography>
      <GuideTable
        headers={['Device', 'Definition', 'Example']}
        rows={[
          ['Alliteration', 'Repeated initial consonant sounds in nearby words', '"Peter Piper picked a peck of pickled peppers"'],
          ['Assonance', 'Repeated vowel sounds in nearby words', '"The rain in Spain stays mainly on the plain"'],
          ['Consonance', 'Repeated consonant sounds (not just at the start)', '"The lumpy, bumpy road" — repeated -mp-'],
          ['Onomatopoeia', 'Words that imitate the sound they describe', 'buzz, hiss, crash, click, hum, pop'],
        ]}
      />

      <Callout kind="connect">
        Sound devices live especially in poetry, but skilled prose writers use them too. When you read
        a memorable line aloud and the rhythm feels deliberate, listen for alliteration, assonance,
        and consonance. They are why great writing sounds like music even when it is making an
        argument.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Hyperbole and understatement
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        HYPERBOLE is deliberate exaggeration not meant literally ("I have told you a million times").
        UNDERSTATEMENT is deliberately downplaying something ("It was just a small inconvenience"
        when discussing a major fire). Both create effect by pulling AWAY from the literal — hyperbole
        upward, understatement downward. Authors use them for humor, emphasis, irony, or to manage
        emotional tone.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Tone and mood — the twin emotions
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        TONE is the AUTHOR\'S attitude toward the subject (ironic, mournful, reverent, urgent, dry).
        MOOD is the emotional atmosphere the reader FEELS while reading (tense, peaceful, hopeful,
        oppressive). They are related but distinct. A detached, almost cold tone can still produce a
        terrifying mood — as in some horror writing.
      </Typography>

      <Analogy title="Tone vs. mood as speaker vs. room">
        Picture a person describing a haunted house. TONE is how the speaker SOUNDS — maybe sarcastic,
        maybe matter-of-fact, maybe nervous. MOOD is how the room FEELS — maybe tense, maybe ominous,
        maybe oddly comic. A sarcastic tone can still produce a tense mood if the underlying events
        are scary. Train yourself to track both.
      </Analogy>

      <Callout kind="make-it-stick">
        Tone questions usually ask you to pick the right ADJECTIVE for the author\'s attitude. Be
        specific — "sad" is weak; "mournful," "wistful," "bitter," and "despairing" are better
        choices. Build a tone vocabulary so you can answer with precision.
      </Callout>
    </Box>
  );
}

// ── Section 5: Author's Craft & Structure ─────────────────────────────
function Section5Craft() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Craft and structure are about HOW the author chose to tell the story or build the argument.
        Why this point of view? Why this opening? Why this sentence length? Why this order of events?
        Every choice an author makes can be analyzed as craft. On the EOCEP, you will be asked
        "why did the author...?" and "what is the effect of...?" questions — both are craft questions.
      </Typography>

      <Analogy title="Craft as the camera in a movie">
        A film tells the same story very differently depending on whether the camera is up close on
        one character\'s face or pulled wide on the whole room. Where the camera is, how long it
        lingers, what it cuts to next — these are craft choices. A novelist makes the same kinds of
        choices with point of view, pacing, and structure. Two writers handed the same plot would
        produce two very different books, because their craft choices would differ. Always ask: where
        is the camera, and why is it there?
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Point of view as a craft choice
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Authors choose POV deliberately. First person creates intimacy and voice, but limits the
        reader to one perspective and can make the narrator unreliable. Third person limited gives
        outside framing while keeping psychological focus. Third person omniscient lets the author
        move between minds. Each choice has trade-offs.
      </Typography>
      <GuideTable
        headers={['POV choice', 'What it BUYS the author', 'What it COSTS the author']}
        rows={[
          ['First person', 'Voice, intimacy, the possibility of unreliable narration', 'No access to other minds; reader sees only what the narrator can see'],
          ['Third limited', 'Outside frame plus access to one character\'s thoughts', 'Cannot enter other minds; reader still mostly sees one perspective'],
          ['Third omniscient', 'Movement between minds; broad scope; dramatic irony', 'Less intimacy; can feel distant or detached'],
          ['Second person', 'Pulls reader into the story; immediate, unusual feel', 'Hard to sustain over long works; can feel gimmicky'],
        ]}
      />

      <Callout kind="why-it-matters">
        EOCEP "why did the author choose ___ point of view?" questions are testing whether you can
        explain the trade-off. The correct answer almost always names a specific effect — intimacy,
        suspense, dramatic irony, unreliability, breadth of view — not just "to tell the story."
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Pacing — the elastic of story time
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        PACING is the author\'s control of how much PROSE space is spent on each chunk of STORY
        time. Stretching a five-minute moment over three pages signals that the moment matters
        emotionally; compressing three months into a sentence says "just get past this." Authors use
        pacing to direct the reader\'s attention.
      </Typography>

      <GuideTable
        headers={['Pacing move', 'Signal', 'Effect']}
        rows={[
          ['Scene (slow)', 'Detailed dialogue, sensory description, real-time events', 'Pulls reader into the moment, emotional intensity'],
          ['Summary (fast)', 'Sentences that compress weeks, months, or years', 'Moves through low-importance time quickly'],
          ['Flashback', 'Past events inserted into a present-tense narrative', 'Provides backstory; can build empathy or context'],
          ['Flashforward', 'Future events shown ahead of time', 'Creates suspense, irony, or sense of fate'],
          ['Cliffhanger', 'Chapter ends mid-action with a question hanging', 'Forces the reader to keep going'],
        ]}
      />

      <Callout kind="try-this">
        Open any novel chapter you have read. Take a pencil and bracket the parts that are SCENE
        (slow, detailed) and the parts that are SUMMARY (fast, compressed). Notice how the author
        SPEEDS UP for travel and routine, SLOWS DOWN for emotionally important conversations. That
        rhythm IS craft — and EOCEP questions about author choice often hinge on it.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Foreshadowing and flashback — playing with time
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        FORESHADOWING plants hints early that pay off later. The classic example is "Chekhov\'s gun":
        if a hunting rifle is mentioned on the wall in Act I, it must be fired by Act III. The author
        does not waste setup. FLASHBACK does the reverse — bringing in past events to color the
        present.
      </Typography>

      <Callout kind="make-it-stick">
        When you re-read a story, foreshadowing is what makes earlier scenes feel newly weighted.
        That is the test: if a small detail in chapter 2 becomes important in chapter 14, the
        chapter-2 mention was probably foreshadowing — even if it felt incidental the first time.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Diction and syntax — the small craft choices
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        DICTION is the author\'s choice of words. SYNTAX is the author\'s arrangement of those words
        into sentences. Both shape voice and tone. Short, plain words and short sentences produce
        urgency or simplicity. Long Latinate words and complex sentences produce formality or
        density.
      </Typography>
      <GuideTable
        headers={['Diction choice', 'Effect', 'Example']}
        rows={[
          ['Plain Anglo-Saxon words (dog, run, tree, dark)', 'Down-to-earth, immediate, often emotional', 'Hemingway\'s prose'],
          ['Latinate vocabulary (incident, exacerbated, propensity)', 'Formal, academic, distancing', 'Most legal and scientific writing'],
          ['Slang and dialect', 'Regional, specific, character-rooted', 'Mark Twain\'s Mississippi voices'],
          ['Sensory verbs (crash, slither, drift)', 'Vivid, kinesthetic, energizing', 'Sports and adventure writing'],
          ['Abstract nouns (justice, longing, identity)', 'Conceptual, philosophical, idea-driven', 'Essay and philosophical prose'],
        ]}
      />

      <Callout kind="connect">
        Diction signals AUDIENCE. A children\'s book uses short, plain words because the audience is
        children. A scholarly article uses Latinate vocabulary because the audience expects formal
        precision. When the EOCEP asks about diction, also ask "who is this written FOR?" — that
        will narrow down the right answer fast.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Anaphora, parallelism, and rhetorical questions — speaker craft
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        These three devices show up especially in speeches and persuasive writing.
      </Typography>
      <GuideTable
        headers={['Device', 'Definition', 'Example']}
        rows={[
          ['Anaphora', 'Repeating the same word/phrase at the beginning of successive clauses', '"We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields…" — Churchill'],
          ['Parallelism', 'Using the same grammatical structure for items in a series', '"…of the people, by the people, for the people" — Lincoln'],
          ['Rhetorical question', 'A question asked for effect, not for an actual answer', '"How long? Not long, because the arc of the moral universe is long, but it bends toward justice." — MLK'],
        ]}
      />

      <Callout kind="watch-for">
        Anaphora is easy to confuse with simple repetition. The KEY is that anaphora repeats at the
        BEGINNING of consecutive clauses — same word in the same position. Random repetition of a
        word elsewhere is not anaphora.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Structural choices in nonfiction
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        In essays and articles, structure is itself a craft choice. Does the writer open with an
        anecdote and pull back to the broader claim (specific-to-general)? Or open with a sweeping
        claim and zoom in on a specific example (general-to-specific)? Where does the thesis appear?
        How does the conclusion connect to the opening?
      </Typography>

      <Analogy title="Essay structure as a road trip">
        An essay opening is like the first mile of a road trip — it should make you want to keep
        going. The thesis is the destination. Each body paragraph is a stop along the way, with a
        topic sentence as the road sign. Transitions are the GPS voice telling you where you are
        going next. The conclusion brings you home — same destination as the thesis, but you have
        seen the country between.
      </Analogy>

      <Callout kind="coachs-note">
        On the EOCEP, when a question asks "why did the author begin with an anecdote?" the right
        answer almost always names a specific rhetorical purpose — to engage the reader, to humanize
        an abstract issue, to set up the thesis. Vague answers like "to start the essay" are usually
        wrong.
      </Callout>
    </Box>
  );
}

// ── Section 6: Argument & Evidence ────────────────────────────────────
function Section6Argument() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Argument is reasoned persuasion. The writer makes a CLAIM (an arguable statement), supports
        it with EVIDENCE (facts, examples, expert testimony, statistics), and links the evidence to
        the claim with REASONING. Strong arguments name and rebut COUNTERCLAIMS — the opposing
        positions a thoughtful reader might raise. The EOCEP will ask you to identify claims, weigh
        evidence, spot logical fallacies, and recognize the three classic rhetorical appeals.
      </Typography>

      <Analogy title="Argument as a courtroom case">
        Think of a strong argument as a lawyer building a case. The CLAIM is "my client is innocent."
        The EVIDENCE is the witness testimony, alibi receipts, lab results. The REASONING is the
        lawyer\'s explanation of how the evidence proves the claim. The COUNTERCLAIM is the
        prosecutor\'s case — and a strong defense addresses it directly, not by pretending it does
        not exist. The jury weighs all of this and decides what they believe.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The Aristotelian appeals — ethos, pathos, logos
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Persuasive Argument] --> B[Ethos - credibility]
    A --> C[Pathos - emotion]
    A --> D[Logos - logic and evidence]
    B --> B1[Speaker credentials, character, authority]
    C --> C1[Stories, vivid language, emotional appeals]
    D --> D1[Statistics, studies, structured reasoning]
        `}
      />

      <GuideTable
        headers={['Appeal', 'How it works', 'Example']}
        rows={[
          ['Ethos', 'Appeal to the speaker\'s credibility, character, or authority', '"As a board-certified pediatrician with 20 years of practice…"'],
          ['Pathos', 'Appeal to the audience\'s emotions — fear, pity, anger, hope', '"Imagine your own child going to bed hungry tonight."'],
          ['Logos', 'Appeal to logic — statistics, facts, causal reasoning', '"A 12,000-student study found scores rose 22% when…"'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Ethos = who is saying it. Pathos = how it makes you feel. Logos = the numbers and
        reasoning.</strong> Every strong persuasive piece uses all three, but in different
        proportions. A medical pamphlet leans heavily on ethos and logos; a charity fundraiser leans
        heavily on pathos. The EOCEP wants you to name the dominant appeal in a given passage.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Logical fallacies — common reasoning errors
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A FALLACY is a flaw in reasoning that makes an argument unsound, even if it sounds
        persuasive. The EOCEP regularly tests the most common ones. Memorize the names and the
        patterns.
      </Typography>
      <GuideTable
        headers={['Fallacy', 'Definition', 'Example']}
        rows={[
          ['Ad hominem', 'Attacks the speaker instead of the argument', '"You can\'t trust her plan — she\'s only 17."'],
          ['Straw man', 'Distorts the opponent\'s position into something easier to attack', '"You want stricter phones-in-class rules? So you want to ban all technology?"'],
          ['Slippery slope', 'Assumes one step will lead to a chain of dramatic consequences without evidence', '"If we let students re-take tests, soon they won\'t study at all."'],
          ['False dichotomy', 'Presents only two options when more exist', '"Either we cut arts funding or test scores fall."'],
          ['Bandwagon', 'Argues something is correct because many people believe or do it', '"Everyone\'s switching to this app, so it must be the best."'],
          ['Hasty generalization', 'Draws a broad conclusion from too few examples', '"I met two rude drivers from that state — everyone from there is rude."'],
          ['Post hoc', 'Assumes that because B follows A, A caused B', '"I wore my lucky socks and my team won — the socks caused the win."'],
          ['Appeal to authority', 'Cites a famous person as proof, regardless of their actual expertise', '"This actor recommends this medicine, so it must work."'],
          ['Circular reasoning', 'The conclusion is presented as a premise — "X is true because X is true"', '"This book is great because it\'s an excellent read."'],
        ]}
      />

      <Callout kind="why-it-matters">
        Real-world advertising, political messaging, and social-media argument lean heavily on
        fallacies. Learning to NAME them is half the battle in becoming a sharper thinker — once you
        can say "that is a slippery slope" out loud, the argument loses much of its power over you.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Counterclaim and rebuttal
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A COUNTERCLAIM is a position OPPOSED to the writer\'s main argument. Strong argumentative
        writing names the counterclaim and then REBUTS it — explains why the writer\'s position is
        still better despite the counterclaim. Writers who pretend the opposition does not exist look
        one-sided; writers who address it directly look thoughtful and credible.
      </Typography>

      <MermaidDiagram
        chart={`
flowchart TD
    A[Strong Argumentative Paragraph] --> B[State the CLAIM clearly]
    B --> C[Provide EVIDENCE supporting it]
    C --> D[Explain REASONING - how evidence proves the claim]
    D --> E[Acknowledge the COUNTERCLAIM]
    E --> F[REBUT the counterclaim - explain why the original claim is still better]
        `}
      />

      <Callout kind="try-this">
        Take any opinion you hold strongly. Try writing the BEST possible counterclaim to your own
        position — the version that a smart, thoughtful person on the other side might actually
        say. Then write a rebuttal. The exercise sharpens your own argument AND teaches you what
        thoughtful disagreement looks like.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Evaluating evidence
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Not all evidence is equal. On the EOCEP, "which is the STRONGEST piece of evidence?"
        questions are common. Use this hierarchy as a rough guide:
      </Typography>
      <GuideTable
        headers={['Strength', 'Type of evidence']}
        rows={[
          ['Strongest', 'Peer-reviewed studies with large samples; multiple corroborating sources; government data with transparent methodology'],
          ['Strong', 'Single peer-reviewed study; reputable expert testimony; credible journalistic reporting with named sources'],
          ['Moderate', 'Expert opinion in mainstream publications; case studies; historical examples'],
          ['Weak', 'Single anecdote; testimonial from one person; uncredentialed expert'],
          ['Weakest', 'Anonymous online comment; viral meme; unverified social-media claim'],
        ]}
      />

      <Callout kind="watch-for">
        A piece of evidence can sound persuasive but be weak. A heart-wrenching anecdote about ONE
        person is powerful pathos but weak logos. A specific number ("87% of students report…") is
        only as strong as the study behind it — how many people surveyed? how were they chosen?
        Always read for METHOD, not just for emotional impact.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Correlation vs. causation
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Two things happening together does not prove one caused the other. Ice cream sales rise in
        summer; drowning rates rise in summer; ice cream does not cause drowning — both are caused by
        a third variable (warm weather). The EOCEP often plants causal-sounding language in
        passages where the underlying evidence shows only correlation.
      </Typography>

      <Callout kind="connect">
        Strong arguments require strong methodology to claim causation: controlled experiments,
        random assignment, large samples. In real life, most arguments you encounter are working
        from correlational data — and skilled readers know to ask "could there be a third
        explanation?"
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Building a short argument — example
      </Typography>
      <Typography sx={{ mb: 1.5, pl: 2, lineHeight: 1.7, fontStyle: 'italic' }}>
        Claim: South Carolina schools should not start before 8:30 AM.<br />
        Evidence: A 2014 American Academy of Pediatrics policy review found that adolescents need
        8–10 hours of sleep, and that early start times correlate with reduced academic performance
        and increased traffic accidents.<br />
        Reasoning: If we know teens need more sleep, and we know early start times are associated
        with reduced performance and crashes, then moving start times later is a low-cost
        intervention with measurable health and safety benefits.<br />
        Counterclaim: Later start times complicate parents\' work schedules and after-school
        athletics.<br />
        Rebuttal: While valid, scheduling can adapt; the safety and academic gains across an entire
        student population outweigh logistical inconvenience for a portion of families.
      </Typography>

      <Callout kind="coachs-note">
        Notice in the example: the claim is specific, the evidence names a credible source, the
        reasoning links the two, the counterclaim is granted as valid, and the rebuttal is
        proportional rather than dismissive. That structure — claim, evidence, reasoning,
        counterclaim, rebuttal — is the spine of every strong argumentative paragraph the EOCEP will
        ever expect you to write.
      </Callout>
    </Box>
  );
}

// ── Section 7: Language Conventions ───────────────────────────────────
function Section7Language() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Language conventions are the rules of standard written English: grammar, sentence structure,
        punctuation, parts of speech, agreement. They are not arbitrary — they make sentences clear
        and unambiguous. The EOCEP grammar questions test whether you can spot errors, choose the
        correct form, and edit a sentence for standard usage. Mastering this section is one of the
        highest-leverage uses of study time: the rules are finite, and getting them right is mostly
        about recognition and habit.
      </Typography>

      <Analogy title="Grammar as the wiring of a sentence">
        Imagine a sentence as wiring inside a wall. When everything is connected correctly, the
        lights come on and you do not notice the wiring at all. When something is loose — a comma
        splice, a dangling modifier, a subject-verb disagreement — the lights flicker, the meaning
        flickers, and the reader stops to figure out what is wrong. Good grammar is invisible; bad
        grammar interrupts the message. The goal is invisible wiring.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Parts of speech — the building blocks
      </Typography>
      <GuideTable
        headers={['Part of speech', 'What it does', 'Example']}
        rows={[
          ['Noun', 'Names a person, place, thing, or idea', 'student, Charleston, freedom'],
          ['Pronoun', 'Replaces a noun', 'she, they, who, anyone'],
          ['Verb', 'Names an action or state of being', 'run, was, become'],
          ['Adjective', 'Modifies a noun or pronoun', 'tall, blue, exhausted'],
          ['Adverb', 'Modifies a verb, adjective, or other adverb (often ends -ly)', 'quickly, very, rather'],
          ['Preposition', 'Shows relationship of a noun to another part of the sentence', 'in, on, at, of, with, before'],
          ['Conjunction', 'Joins words or clauses', 'and, but, because, although'],
          ['Interjection', 'Expresses emotion', 'Wow! Ouch! Hey!'],
        ]}
      />

      <Callout kind="make-it-stick">
        Adverbs often (but not always) end in -ly: quickly, slowly, carefully. But not every -ly word
        is an adverb — "friendly" is an adjective ("a friendly dog"). The real test is what the word
        modifies. If it modifies a verb, adjective, or other adverb, it is an adverb.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Sentence structure — clauses and four sentence types
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A CLAUSE is a group of words with a subject and a verb. An INDEPENDENT clause expresses a
        complete thought and can stand alone as a sentence. A DEPENDENT (subordinate) clause cannot
        stand alone — it relies on an independent clause. Combining these gives four sentence types.
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Sentence Type Decision] --> B{How many independent clauses?}
    B -->|One| C{Any dependent clauses?}
    C -->|No| D[SIMPLE - one independent clause only]
    C -->|Yes| E[COMPLEX - one independent + at least one dependent]
    B -->|Two or more| F{Any dependent clauses?}
    F -->|No| G[COMPOUND - two or more independent, no dependent]
    F -->|Yes| H[COMPOUND-COMPLEX - two or more independent AND at least one dependent]
        `}
      />

      <GuideTable
        headers={['Type', 'Pattern', 'Example']}
        rows={[
          ['Simple', '1 independent', 'She studied.'],
          ['Compound', '2+ independent (joined by comma + FANBOYS, semicolon, or period split)', 'She studied, and she passed.'],
          ['Complex', '1 independent + 1+ dependent', 'Because she studied, she passed.'],
          ['Compound-complex', '2+ independent + 1+ dependent', 'Because she studied, she passed, and her teacher was impressed.'],
        ]}
      />

      <Callout kind="watch-for">
        Knowing FANBOYS — For, And, Nor, But, Or, Yet, So — is essential. These are the coordinating
        conjunctions. The standard pattern for joining two independent clauses is comma + FANBOYS:
        "She ran fast, but she lost the race." Without the comma it can become a run-on; without
        the FANBOYS it can become a comma splice.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The big three errors — fragment, run-on, comma splice
      </Typography>
      <GuideTable
        headers={['Error', 'What it is', 'Fix']}
        rows={[
          ['Sentence fragment', 'A group of words missing a subject, verb, or complete thought', 'Add what is missing OR attach to a complete sentence'],
          ['Run-on (fused sentence)', 'Two independent clauses with NO punctuation between them', 'Period, semicolon, or comma + FANBOYS'],
          ['Comma splice', 'Two independent clauses joined with ONLY a comma', 'Same three fixes — change the comma to a period, a semicolon, or add a FANBOYS conjunction'],
        ]}
      />

      <Analogy title="A comma splice as two cars sharing one parking spot">
        Imagine each independent clause as a car that needs its own parking spot. A comma is a tiny
        spot — only one car fits. A period is a separate garage. A semicolon is a tandem driveway
        where two cars can park nose-to-tail. A comma + FANBOYS is like a spot with a connecting
        bridge. Trying to fit two independent clauses with only a comma is like double-parking — you
        cannot do it and expect things to work smoothly.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Subject-verb agreement
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Singular subjects take singular verbs; plural subjects take plural verbs. The trap is when
        intervening words hide the real subject.
      </Typography>
      <GuideTable
        headers={['Subject', 'Verb', 'Why']}
        rows={[
          ['The dog runs', 'singular', 'Singular noun → singular verb'],
          ['The dogs run', 'plural', 'Plural noun → plural verb'],
          ['The box of cookies IS empty', 'singular', 'Subject is "box," not "cookies" — ignore the prepositional phrase'],
          ['Each of the students WAS nervous', 'singular', '"Each" is singular even with a plural prepositional phrase'],
          ['Neither the teacher nor the students WERE ready', 'plural', 'With "neither/nor," the verb agrees with the CLOSER subject'],
          ['Either Maria or her brothers ARE bringing snacks', 'plural', 'Same rule — agree with the closer subject ("brothers")'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>Find the real subject. Ignore intervening phrases.</strong> "The bag of apples is on
        the counter" — subject is BAG (singular), so IS. Cover the prepositional phrase with your
        thumb if you have to. This single trick prevents most subject-verb agreement mistakes.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Pronoun-antecedent agreement
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A pronoun must agree with its antecedent (the noun it replaces) in number and (when
        relevant) gender. "Every student" is singular — formally takes "his or her" (though singular
        "they" is increasingly accepted in modern English). "The students" is plural — takes "their."
      </Typography>

      <Callout kind="watch-for">
        Indefinite pronouns like EVERY, EACH, NEITHER, EITHER, ANYONE, EVERYONE, NOBODY, SOMEONE
        are SINGULAR for formal agreement. "Everyone should bring his or her own water bottle." On
        the EOCEP, indefinite pronouns paired with "their" can be technically wrong in formal
        contexts even though they are common in everyday speech.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Punctuation rules you must know
      </Typography>
      <GuideTable
        headers={['Punctuation', 'When to use it', 'Example']}
        rows={[
          ['Period', 'Ends a complete declarative sentence', 'She studied for the test.'],
          ['Semicolon (;)', 'Joins two closely-related independent clauses', 'She studied; she passed.'],
          ['Colon (:)', 'Introduces a list, explanation, or quotation', 'She studied three subjects: math, English, biology.'],
          ['Comma in a list', 'Separates items in a series (Oxford comma optional but recommended)', 'She studied math, English, and biology.'],
          ['Comma after intro element', 'After a long introductory phrase or dependent clause', 'After dinner, she studied for an hour.'],
          ['Comma before FANBOYS', 'When joining two independent clauses with for/and/nor/but/or/yet/so', 'She studied, but she still felt nervous.'],
          ['Pair of commas', 'Around non-restrictive (non-essential) clauses or appositives', 'My oldest sister, who lives in Charleston, is a teacher.'],
          ['Apostrophe', 'Shows possession or contraction', "the student's book; she's tired"],
        ]}
      />

      <Callout kind="why-it-matters">
        Apostrophes are one of the most-tested EOCEP rules. Three patterns to memorize: singular
        possessive = "the student\'s book." Plural possessive (regular plural ending in -s) = "the
        students\' book." Plural possessive (irregular plural, no -s) = "the children\'s book."
        Apostrophes never make a noun plural — "the student\'s" is never plural.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Modifiers — placement matters
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A MISPLACED MODIFIER is a descriptive phrase that is too far from the word it should modify.
        A DANGLING MODIFIER has nothing in the sentence to attach to logically. Both produce
        accidental humor and confusion.
      </Typography>
      <GuideTable
        headers={['Error', 'Sentence', 'Fix']}
        rows={[
          ['Dangling', 'Walking to school, the rain started.', 'Walking to school, I noticed the rain start.'],
          ['Misplaced', 'She only ate cookies for breakfast.', 'She ate only cookies for breakfast.'],
          ['Dangling', 'After studying all night, the test felt easy.', 'After studying all night, she found the test easy.'],
          ['Misplaced', 'The teacher gave the assignment to the student that was due Friday.', 'The teacher gave the student the assignment that was due Friday.'],
        ]}
      />

      <Callout kind="try-this">
        Read a paragraph of your own writing out loud. Listen for any sentence where the opening
        phrase ("Walking down the street…" / "Frustrated by the noise…") attaches to the wrong noun.
        If the noun right after the comma is not what you meant the phrase to describe, you have a
        dangling modifier. Fix by rewording.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Parallelism — items in a list match
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        When you list things, they should be in the same grammatical form. Pair nouns with nouns,
        verbs with verbs, infinitives with infinitives, -ing forms with -ing forms.
      </Typography>
      <GuideTable
        headers={['Not parallel', 'Parallel']}
        rows={[
          ['She likes reading, writing, and to edit.', 'She likes reading, writing, and editing.'],
          ['He came to study, work, and for the food.', 'He came to study, to work, and to eat.'],
          ['The job requires honesty, hard work, and being on time.', 'The job requires honesty, hard work, and punctuality.'],
        ]}
      />

      <Callout kind="connect">
        Parallelism is not just a grammar rule — it is a rhetorical tool. "Of the people, by the
        people, for the people" is parallel, and the parallelism is what makes the line memorable.
        Strong speakers and writers use parallelism for both clarity AND rhythm.
      </Callout>
    </Box>
  );
}

// ── Section 8: Vocabulary in Context ──────────────────────────────────
function Section8Vocab() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Vocabulary on the EOCEP is rarely tested in isolation. Instead, the test gives you a
        sentence and asks what an unfamiliar word means based on context. To do this well, you need
        two parallel skills: reading the surrounding sentence carefully for context clues, and
        knowing enough about word parts (roots, prefixes, suffixes) to decode words you have never
        seen before. The combination is powerful — together they let you guess accurately even when
        you do not know the word in isolation.
      </Typography>

      <Analogy title="Vocabulary as a detective\'s toolkit">
        A detective walks into a crime scene with two sources of information: clues at the scene
        (context) and prior knowledge of patterns (training). Together they can identify a suspect
        without a confession. A reader who encounters an unfamiliar word has the same toolkit:
        clues from the sentence around the word, and prior knowledge of Greek and Latin roots,
        prefixes, and suffixes. Combine both and you rarely need to reach for a dictionary.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Context clue types
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Unknown word in a sentence] --> B[Look for definition clue]
    B --> B1[Words like meaning, defined as, or, that is]
    A --> C[Look for example clue]
    C --> C1[Phrases like such as, including, for example, like]
    A --> D[Look for contrast clue]
    D --> D1[Words like unlike, however, despite, although, on the other hand]
    A --> E[Look for inference clue]
    E --> E1[Combine surrounding details to deduce meaning]
        `}
      />

      <GuideTable
        headers={['Type', 'Signal words', 'Example']}
        rows={[
          ['Definition', 'meaning, defined as, that is, or', '"Stoic, meaning unaffected by emotion, he sat through the criticism."'],
          ['Example', 'such as, including, for example, like', '"Carnivores, such as lions and wolves, are the focus of the chapter."'],
          ['Contrast', 'unlike, however, despite, although', '"Unlike her gregarious sister, Mara was reserved."'],
          ['Inference', '(no signal words — combine surrounding details)', '"His tenacity in the face of repeated failure inspired his teammates." (You infer "persistence" from the failure-but-inspires context.)'],
        ]}
      />

      <Callout kind="make-it-stick">
        Before guessing the meaning of an unfamiliar word, scan the surrounding sentence for any of
        these signals: "meaning," "such as," "unlike," "however." If any are present, the meaning is
        almost spelled out for you nearby. If none are present, fall back on inference and word
        parts.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Greek and Latin roots — multipliers of vocabulary
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        English borrowed thousands of words from Greek and Latin. Learning even a handful of roots
        lets you decode hundreds of words.
      </Typography>
      <GuideTable
        headers={['Root', 'Meaning', 'English words it appears in']}
        rows={[
          ['BIO-', 'life', 'biology, biography, biopsy, antibiotic'],
          ['GEO-', 'earth', 'geology, geography, geometry'],
          ['SCRIB- / SCRIPT-', 'write', 'scribe, scripture, manuscript, transcribe, prescribe'],
          ['PHOTO-', 'light', 'photograph, photosynthesis, photon'],
          ['TELE-', 'far', 'telephone, television, telescope'],
          ['CHRONO-', 'time', 'chronological, chronicle, synchronize'],
          ['PORT-', 'carry', 'portable, transport, import, export'],
          ['DICT-', 'speak / say', 'dictate, predict, contradict, dictionary'],
          ['AUD-', 'hear', 'audio, audience, audible, auditorium'],
          ['SPEC- / VIS-', 'see / look', 'spectator, inspect, vision, evident'],
          ['JECT-', 'throw', 'eject, inject, project, reject'],
          ['LOQU- / LOC-', 'speak', 'eloquent, loquacious, soliloquy, colloquial'],
        ]}
      />

      <MermaidDiagram
        chart={`
flowchart LR
    A[Prefix] --> B[Root]
    B --> C[Suffix]
    A1[un- not] --> B1[believ root believe] --> C1[-able suffix able]
    B1 --> X[unbelievable]
        `}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Common prefixes
      </Typography>
      <GuideTable
        headers={['Prefix', 'Meaning', 'Example']}
        rows={[
          ['UN-', 'not', 'unhappy, unsafe, unbelievable'],
          ['IM- / IN-', 'not / into', 'impartial, impossible, inject'],
          ['RE-', 'again', 'rewrite, recall, return'],
          ['PRE-', 'before', 'preview, prefix, precaution'],
          ['DIS-', 'opposite / not', 'disagree, dishonest, disconnect'],
          ['MIS-', 'wrong', 'mistake, misunderstand, misuse'],
          ['SUB-', 'under', 'submarine, subtitle, subtotal'],
          ['SUPER-', 'above / beyond', 'superhero, supervise, supernatural'],
          ['INTER-', 'between', 'international, intersect, interview'],
          ['TRANS-', 'across', 'transport, translate, transfer'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Common suffixes
      </Typography>
      <GuideTable
        headers={['Suffix', 'Meaning', 'Example']}
        rows={[
          ['-TION / -SION', 'act or state of', 'creation, decision, completion'],
          ['-ABLE / -IBLE', 'able to be', 'readable, edible, comfortable'],
          ['-LY', 'in a (manner) way', 'quickly, slowly, carefully'],
          ['-NESS', 'state of being', 'kindness, happiness, darkness'],
          ['-MENT', 'result of action', 'enjoyment, agreement, government'],
          ['-OLOGY', 'study of', 'biology, geology, psychology'],
          ['-IST', 'one who practices', 'biologist, artist, scientist'],
          ['-ISM', 'belief or practice', 'capitalism, optimism, realism'],
        ]}
      />

      <Callout kind="try-this">
        Pick a long, unfamiliar word — say "uninterruptible." Break it: UN (not) + INTER (between)
        + RUPT (break) + IBLE (able to be). Literally: "not able to be broken between." That is
        very close to the real meaning ("cannot be interrupted"). Word-part decoding works
        surprisingly well on most multi-syllable Latinate words.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Denotation vs. connotation
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        DENOTATION is a word\'s literal, dictionary definition. CONNOTATION is the emotional or
        cultural associations the word carries on top of that definition. Two words can share a
        denotation and have very different connotations.
      </Typography>
      <GuideTable
        headers={['Pair', 'Shared denotation', 'Different connotations']}
        rows={[
          ['Childlike vs. Childish', 'Having qualities of a child', 'Childlike → innocent. Childish → immature.'],
          ['Confident vs. Arrogant', 'Self-assured', 'Confident → positive. Arrogant → negative.'],
          ['Thrifty vs. Cheap', 'Not spending money freely', 'Thrifty → wise. Cheap → stingy.'],
          ['Slim vs. Skinny', 'Not heavy', 'Slim → flattering. Skinny → bony, almost unhealthy.'],
          ['House vs. Home', 'A residential building', 'House → neutral structure. Home → warmth, belonging.'],
        ]}
      />

      <Callout kind="connect">
        Skilled authors choose words with attention to connotation, not just denotation. When the
        EOCEP asks "why did the author use the word ___?" or "how would the meaning change if you
        replaced X with Y?" — the question is often about CONNOTATION, not strict meaning. Tracking
        emotional weight is a 10th-grade reading skill.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Homophones, homographs, and false friends
      </Typography>
      <GuideTable
        headers={['Term', 'Definition', 'Example']}
        rows={[
          ['Homophone', 'Words that SOUND the same but have different meanings (and sometimes spellings)', 'their / there / they\'re; to / too / two'],
          ['Homograph', 'Words that LOOK the same but have different meanings (and sometimes pronunciations)', 'lead (metal) vs. lead (to guide); bow (front of ship) vs. bow (to bend)'],
          ['False friend', 'A word that LOOKS like a familiar word but means something different', '"Disinterested" (impartial) vs. "uninterested" (bored)'],
        ]}
      />

      <Callout kind="watch-for">
        Common homophone errors on the EOCEP: <strong>your/you\'re, its/it\'s, their/there/they\'re,
        loose/lose, affect/effect.</strong> Memorize the difference — these are easy points if you
        do, and easy losses if you do not. "Its" is possessive (the dog and its collar); "it\'s" is
        a contraction (it is).
      </Callout>
    </Box>
  );
}

// ── Section 9: Writing & Revision ─────────────────────────────────────
function Section9Writing() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Writing well in English 2 means producing clear, well-organized prose with a defensible
        claim, supporting evidence, and smooth transitions — and then revising it. The EOCEP tests
        writing through multiple-choice revision questions (asked to spot the best version of a
        sentence, or to choose a transition, or to fix an error) and sometimes through a brief
        constructed-response. The skills divide into two clusters: PROCESS (planning, drafting,
        revising, editing) and PRODUCT (thesis, organization, evidence, citation).
      </Typography>

      <Analogy title="A thesis as a map for your essay">
        Before a road trip, you decide on a destination and a route. The thesis is the destination;
        each body paragraph is a planned stop along the route; the transitions tell the driver
        (reader) which way to turn. An essay without a thesis is a road trip with no destination —
        you might drive for hours but you will not arrive anywhere. A focused thesis is the single
        most important thing in argumentative or informational writing.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The thesis statement — what a strong one looks like
      </Typography>
      <GuideTable
        headers={['Quality', 'Weak thesis', 'Strong thesis']}
        rows={[
          ['Specific', 'Schools are important.', 'South Carolina schools should start no earlier than 8:30 AM to align with adolescent sleep needs.'],
          ['Arguable', 'Lots of people read books.', 'High schools should require independent-choice reading time three days a week to boost literacy.'],
          ['Focused (one claim)', 'Sleep, nutrition, exercise, and screen time all matter for teens.', 'Inadequate sleep is the single most-overlooked factor in adolescent academic performance.'],
          ['Previews the structure', 'Sleep helps teens do well.', 'Adequate sleep improves academic performance, athletic performance, and traffic safety for adolescent drivers.'],
        ]}
      />

      <Callout kind="make-it-stick">
        A thesis must be: a single SENTENCE, ARGUABLE (someone could reasonably disagree), SPECIFIC
        (no vague claims), and ideally a quick PREVIEW of the supporting reasons. If your thesis
        could be the topic sentence of someone else\'s essay too, it is probably too general.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Essay structure — the standard five-part shape
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Introduction] --> B[Hook]
    A --> C[Brief context]
    A --> D[Thesis statement at end of intro]
    A --> E[Body Paragraph 1]
    E --> E1[Topic sentence]
    E --> E2[Evidence]
    E --> E3[Reasoning/Analysis]
    A --> F[Body Paragraph 2]
    A --> G[Body Paragraph 3 - often includes counterclaim + rebuttal]
    A --> H[Conclusion - restate thesis, synthesize reasons, final insight]
        `}
      />

      <GuideTable
        headers={['Section', 'Job', 'Common rookie mistake']}
        rows={[
          ['Introduction', 'Hook + brief context + thesis at end', 'Starting with the thesis without a hook — boring opening'],
          ['Body paragraphs', 'Each one topic sentence + evidence + reasoning', 'Stuffing two ideas into one paragraph'],
          ['Counterclaim + rebuttal', 'Acknowledge the strongest opposing view and answer it', 'Pretending the counterclaim does not exist'],
          ['Conclusion', 'Restate thesis in fresh words; synthesize; offer final insight or call to action', 'Just copying the thesis back word-for-word; introducing new evidence'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Transitions — the connective tissue
      </Typography>
      <GuideTable
        headers={['Relationship', 'Transitions']}
        rows={[
          ['Addition', 'furthermore, in addition, moreover, also, similarly, likewise'],
          ['Contrast', 'however, on the other hand, in contrast, although, despite, yet'],
          ['Cause / effect', 'because, therefore, as a result, consequently, thus, due to'],
          ['Example', 'for example, for instance, such as, to illustrate, specifically'],
          ['Sequence', 'first, next, then, after that, finally, meanwhile'],
          ['Conclusion', 'in conclusion, in summary, ultimately, to sum up, overall'],
        ]}
      />

      <Callout kind="why-it-matters">
        EOCEP revision questions often give you a paragraph with a missing transition word, and you
        pick the best replacement. Reading the sentences ON BOTH SIDES of the blank — and asking
        "is this an addition, a contrast, a cause-effect, or an example?" — gets you the right
        answer almost every time.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Revising vs. editing — two distinct passes
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        REVISING is big-picture rework — sharpening the thesis, reorganizing paragraphs, adding or
        cutting evidence, replacing weak verbs. EDITING is sentence-level cleanup — fixing grammar,
        spelling, punctuation, and word choice. Revise FIRST; edit LAST. Polishing a paragraph you
        might delete is a waste of time.
      </Typography>

      <Analogy title="Revising as renovating, editing as cleaning">
        Imagine a house. REVISING is renovating — knocking down walls, moving rooms, adding a porch.
        EDITING is cleaning — wiping the counters, vacuuming the floors, polishing the windows.
        You renovate first and clean last. Cleaning a room you are about to demolish is silly. Same
        with writing: revise the structure first, then polish the sentences.
      </Analogy>

      <Callout kind="coachs-note">
        The single most common writing-process mistake is editing too early — trying to fix
        every comma during the first draft. That kills momentum and produces stiff, over-thought
        prose. Drafting should be fast and loose. Save the precision work for revision and editing
        passes after the draft is complete.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Concision — saying more with fewer words
      </Typography>
      <GuideTable
        headers={['Wordy', 'Concise']}
        rows={[
          ['Due to the fact that', 'Because'],
          ['In order to', 'To'],
          ['For the purpose of', 'For'],
          ['At this point in time', 'Now'],
          ['In the event that', 'If'],
          ['The end result', 'The result'],
          ['Really very important', 'Important (or "critical")'],
          ['It is clear that', '(usually just delete)'],
        ]}
      />

      <Callout kind="make-it-stick">
        Most wordiness has the same fix: delete the qualifier. "Really" and "very" add nothing;
        "in order to" is just "to"; "the end result" is "the result." Each cut sharpens the
        sentence and shows respect for the reader\'s time.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Active vs. passive voice
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        ACTIVE voice: subject does the verb. PASSIVE voice: subject receives the verb. Active is
        usually clearer and more direct.
      </Typography>
      <GuideTable
        headers={['Voice', 'Sentence', 'When to use']}
        rows={[
          ['Active', 'The committee approved the plan.', 'Default; clearer, more direct, more concise'],
          ['Passive', 'The plan was approved by the committee.', 'When the DOER is unknown, unimportant, or deliberately downplayed'],
          ['Passive (deliberate)', 'Mistakes were made.', 'Politicians love this — it hides the doer; readers should notice'],
        ]}
      />

      <Callout kind="watch-for">
        Passive voice has legitimate uses (scientific writing where the action matters more than the
        actor, situations where the doer is unknown). But on the EOCEP, when a revision question
        offers an active and a passive version of the same sentence with equal content, ACTIVE is
        usually the better choice.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        MLA citation basics
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[MLA Citation] --> B[In-text]
    A --> C[Works Cited at end of paper]
    B --> B1[Author last name + page in parentheses]
    B --> B2[Example: Smith 47]
    C --> C1[Author. Title. Container, contributors, version, number, publisher, date, location.]
    C --> C2[Alphabetized by author last name]
        `}
      />

      <GuideTable
        headers={['MLA element', 'Format', 'Example']}
        rows={[
          ['In-text citation', '(Author Page)', '"Adolescents need 8–10 hours of sleep (Smith 47)."'],
          ['In-text, author named in signal phrase', '(Page only)', 'According to Smith, "adolescents need 8–10 hours" (47).'],
          ['Online source (no page)', '(Author)', '(Garcia).'],
          ['Works Cited entry — book', 'Author Last, First. Title. Publisher, Year.', 'Smith, Jane. Sleep and Adolescence. Norton, 2018.'],
          ['Works Cited entry — article', 'Author. "Title." Container, vol., no., date, pages.', 'Garcia, Maria. "Later School Start Times." Education Today, vol. 12, no. 3, 2020, pp. 22-29.'],
        ]}
      />

      <Callout kind="connect">
        Citation rules are not arbitrary — they exist so a reader can locate your source. Every
        element of an MLA entry helps a future reader find the original. When you cite something,
        you are not just protecting yourself from plagiarism — you are giving credit AND inviting
        readers to follow up.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Source evaluation — the CRAAP test
      </Typography>
      <GuideTable
        headers={['Letter', 'Stands for', 'Ask yourself']}
        rows={[
          ['C', 'Currency', 'Is the information recent enough for the topic?'],
          ['R', 'Relevance', 'Does it actually relate to your specific question?'],
          ['A', 'Authority', 'Who wrote it? What are their credentials? Is the publisher reputable?'],
          ['A', 'Accuracy', 'Are the claims verifiable? Are sources cited?'],
          ['P', 'Purpose', 'Is the source informing, persuading, selling, or entertaining? Is there bias?'],
        ]}
      />

      <Callout kind="try-this">
        Before your next research-based essay, run every source you cite through the CRAAP test in
        writing. It takes five minutes per source and protects you from citing something that turns
        out to be biased, outdated, or unreliable. Many real-world embarrassments — including
        professional ones — come from skipping this step.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Integrating quotations smoothly
      </Typography>
      <GuideTable
        headers={['Approach', 'Example']}
        rows={[
          ['Signal phrase + quote', 'According to Smith, "adolescents need 8–10 hours of sleep" (47).'],
          ['Smooth integration', 'Smith argues that "adolescents need 8–10 hours of sleep" (47), a target most American teens miss.'],
          ['Brackets to fit grammar', 'Smith concludes that "[m]ost American teens fall short" of the recommended sleep range (47).'],
          ['Ellipsis for omission', 'Smith notes that adolescents need "8–10 hours of sleep . . . on a regular schedule" (47).'],
        ]}
      />

      <Callout kind="watch-for">
        A "dropped quote" — a quotation pasted into the middle of a paragraph with no signal phrase
        and no explanation — is one of the most common errors in student writing. Every quotation
        should be introduced (signal phrase) AND explained (a sentence after telling the reader what
        the quote shows).
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Paraphrasing vs. summarizing vs. quoting
      </Typography>
      <GuideTable
        headers={['Technique', 'Definition', 'Citation required?']}
        rows={[
          ['Quotation', 'The source\'s exact words inside quotation marks', 'Yes — always'],
          ['Paraphrase', 'Restating the source\'s idea in your own words, roughly the same length', 'Yes — the IDEA is still borrowed'],
          ['Summary', 'Compressing the source\'s main points into a much shorter version', 'Yes — the IDEA is still borrowed'],
          ['Common knowledge', 'Facts widely known and accepted (e.g., "The American Civil War ended in 1865")', 'No — universally known facts do not need citation'],
        ]}
      />

      <Callout kind="why-it-matters">
        Forgetting to cite a paraphrase or summary is one of the most common forms of accidental
        plagiarism. Students often think "I put it in my own words, so I don\'t need to cite." That
        is wrong — the IDEA is still borrowed. Citation is for the IDEA, not just the wording.
      </Callout>
    </Box>
  );
}

// ── Section: EOCEP Strategy ───────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The SC EOCEP for English 2 is a timed multiple-choice exam covering everything in Sections
        2–9 of this guide. It is administered at the end of your English 2 course, and your score
        counts <strong>20% of your final grade in the class</strong>. The exam tests close-reading
        of literary and informational passages, language and grammar conventions, vocabulary in
        context, and writing/revision skills. A dictionary is typically NOT permitted; check your
        school\'s policy. The biggest controllable factor on test day is not raw skill — it is
        strategy and pacing.
      </Typography>

      <Callout kind="try-this">
        Before exam day, take the EOCEP Sandbox tab at least twice — full timed runs, no pauses.
        Your goal is not to score perfectly on the first one; it is to learn how the time pressure
        feels and where YOU run out of time. Time management is the single biggest controllable
        factor on test day.
      </Callout>

      <Callout kind="coachs-note">
        Read each passage CAREFULLY. EOCEP questions often hinge on small details — a word like
        "primarily" vs. "exclusively," a word in a contrast clause, a specific line referenced by
        line number. Skim once for the passage\'s big picture, then read each question, then return
        to the passage with the question in mind. That two-pass approach saves time on the long
        passages.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        What is heavily tested
      </Typography>
      <GuideTable
        headers={['Topic', 'Why it shows up so much']}
        rows={[
          ['Identifying literary devices in unfamiliar passages', 'Foundational. The EOCEP tests metaphor, simile, personification, irony, symbolism heavily.'],
          ['Theme vs. topic', 'A favorite trap. Theme answers must be CLAIMS, not noun phrases.'],
          ['Central idea of informational text', 'Expect 4–6 questions across the test asking you to identify or restate the central idea.'],
          ['Author\'s purpose and tone', 'A perennial focus — "why did the author do X?" questions are everywhere.'],
          ['Identifying rhetorical appeals (ethos/pathos/logos) and logical fallacies', 'Argument-analysis questions test these directly.'],
          ['Grammar and conventions in revision questions', 'Comma splices, run-ons, subject-verb agreement, parallel structure, apostrophes — all heavily tested.'],
          ['Vocabulary in context', 'Always present. Roots, prefixes, and context clues are your tools.'],
          ['Choosing the best revision', 'Selecting the clearest, most concise version of a sentence.'],
        ]}
      />

      <Callout kind="watch-for">
        Common procedural traps:
        <ul>
          <li>Choosing a TOPIC (one or two words) instead of a THEME (a full claim sentence).</li>
          <li>Confusing TONE (author\'s attitude) with MOOD (reader\'s feeling).</li>
          <li>Calling first-person narration "third-person limited" because both follow one character.</li>
          <li>Picking the most emotional answer to a "which evidence is strongest" question — the strongest evidence is usually the largest and most verifiable, not the most emotional.</li>
          <li>Reading too quickly past the qualifier on a question ("primarily," "most directly," "best supports").</li>
        </ul>
      </Callout>

      <Callout kind="connect">
        English 2 skills compound into every later English class, every history course, every
        college essay, every professional email. Reading closely, naming the move, evaluating
        evidence, writing clearly — these are the foundation. Investing now in real fluency, not
        just procedural memorization, pays back across years of academic work.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Time management
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The EOCEP gives you about 90–120 minutes for roughly 50–60 multiple-choice questions plus
        possible constructed-response items. That is roughly 1.5–2 minutes per question. Some will
        take 30 seconds; some will take 4–5 minutes. Do not fixate on any single problem — flag it,
        move on, and come back at the end. A 50-question exam is decided by the questions you
        ANSWER, not the one you got stuck on.
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
        Practice the three-pass strategy in the EOCEP Sandbox. Do not treat the first run as a "real
        test" attempt — treat it as practice for your strategy. Notice which question types eat your
        time, and plan to skip them during the first pass on test day.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Multiple-choice tactics
      </Typography>
      <GuideTable
        headers={['Tactic', 'How to use it']}
        rows={[
          ['Eliminate obvious wrong answers first', 'Even if you cannot pick the right answer, ruling out two raises your guess from 25% to 50%.'],
          ['Watch for absolute language', '"Always," "never," "all," "none" — extreme claims are usually wrong because real texts and arguments are nuanced.'],
          ['Re-read the line referenced by line number', 'If a question cites a line, GO BACK and read that line plus a sentence before and after.'],
          ['Trust your first instinct on close calls', 'Second-guessing a careful first read usually makes things worse, not better.'],
          ['Answer every question', 'There is no guessing penalty on the EOCEP. A blank is always wrong; a guess has at least a 25% chance.'],
        ]}
      />

      <Callout kind="why-it-matters">
        On a 50-question multiple-choice test, eliminating even ONE wrong answer per question raises
        your guess accuracy from 25% to 33%. Eliminating two raises it to 50%. Over 10 guessed
        questions, that is the difference between an extra 1–2 questions right vs. an extra 3–4.
        Add that to the questions you actually solve, and elimination becomes a meaningful score
        booster.
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
          ['1 day out', 'Rest your brain. Light review of key terms (literary devices, fallacies, MLA basics). Get to bed early.'],
          ['Exam day', 'Eat a real breakfast. Bring two sharpened pencils and a watch. Arrive early.'],
        ]}
      />

      <Callout kind="coachs-note">
        On exam day, your job is to perform — not to learn. Do not try to absorb new material in
        the last 12 hours; you are likely to confuse yourself and lose sleep. Trust the work you
        have already done. The students who do best on standardized tests are not necessarily the
        smartest — they are the ones who arrive rested, calm, and confident.
      </Callout>
    </Box>
  );
}

// ── Glossary section (renders the imported glossary as a table) ───────
function SectionGlossary() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Terms a 10th grader is expected to recognize on the SC EOCEP. Use the Practice tab and
        Flashcards tab to drill these into memory; here they are organized in one place for quick
        reference.
      </Typography>
      <GuideTable
        headers={['Term', 'Definition']}
        rows={glossary.map(g => [g.term, g.definition])}
      />
    </Box>
  );
}
