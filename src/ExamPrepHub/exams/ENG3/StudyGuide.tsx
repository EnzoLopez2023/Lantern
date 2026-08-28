// ENG3 Study Guide — accordion-based layout for SC English Language Arts 3 (11th grade).
// Covers: Reading Literature, Reading Informational Text, Argument & Rhetoric,
// Research Writing, Language & Conventions, Speaking & Listening.

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

const READING_PROGRESS_KEY = 'exam-prep-reading:ENG3';
const COMPLETION_KEY = 'exam-prep-completed:ENG3';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:ENG3';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Reading Literature',
  s3: 'Reading Informational Text',
  s4: 'Argument & Rhetoric',
  s5: 'Research Writing',
  s6: 'Language & Conventions',
  s7: 'Speaking & Listening',
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
  { id: 's1',      num: '1',  title: 'The Big Picture',             icon: '🗺️' },
  { id: 's2',      num: '2',  title: 'Reading Literature',          icon: '📖' },
  { id: 's3',      num: '3',  title: 'Reading Informational Text',  icon: '📰' },
  { id: 's4',      num: '4',  title: 'Argument & Rhetoric',         icon: '⚖️' },
  { id: 's5',      num: '5',  title: 'Research Writing',            icon: '✍️' },
  { id: 's6',      num: '6',  title: 'Language & Conventions',      icon: '🔤' },
  { id: 's7',      num: '7',  title: 'Speaking & Listening',        icon: '🎤' },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',           icon: '🎯' },
  { id: 's-gloss', num: '📚', title: 'Glossary',                    icon: '📚' },
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
    case 's2':      return <Section2Literature />;
    case 's3':      return <Section3Informational />;
    case 's4':      return <Section4Rhetoric />;
    case 's5':      return <Section5Research />;
    case 's6':      return <Section6Language />;
    case 's7':      return <Section7Speaking />;
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>What is English 3?</Typography>

      <Analogy title="A toolkit, not a treasure chest">
        Think of English 3 as building a professional toolkit — not memorizing a treasure chest of facts.
        By the end of 11th grade, you should be able to pick up any piece of writing, analyze how it works,
        construct a well-supported argument about it, research a topic from scratch, and communicate your
        ideas clearly in speech and in writing. These are tools you carry for life, not facts you forget after the test.
      </Analogy>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        English 3 draws on everything you've practiced in previous years — reading, writing, grammar — and
        asks you to apply it at a more sophisticated level. You're not just identifying literary devices anymore;
        you're explaining why an author chose them and what effect they create. You're not just writing paragraphs;
        you're constructing arguments backed by evaluated research. And you're not just participating in class;
        you're leading discussions and giving formal presentations.
      </Typography>

      <Callout kind="why-it-matters">
        The skills in this course — analyzing texts, evaluating sources, constructing arguments, and communicating
        persuasively — are exactly what every college professor, employer, and civic institution expects of you.
        Reading literature teaches empathy and perspective-taking. Research writing teaches intellectual honesty.
        Rhetoric teaches you to recognize when someone is trying to manipulate you — and how to be convincing
        without resorting to manipulation yourself.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Six Strands of English 3</Typography>

      <GuideTable
        headers={['Strand', 'Core skill', 'Real-world connection']}
        rows={[
          ['Reading Literature', 'Analyze how authors create meaning through craft', 'Understanding narrative, film, and art'],
          ['Reading Informational Text', 'Evaluate claims, structures, and evidence in nonfiction', 'Navigating news, policy, and professional documents'],
          ['Argument & Rhetoric', 'Identify and construct persuasive arguments', 'Debate, advocacy, and recognizing propaganda'],
          ['Research Writing', 'Develop questions, evaluate sources, and synthesize ideas', 'Journalism, scholarship, and professional research'],
          ['Language & Conventions', 'Apply grammar and usage rules for clear communication', 'Professional writing in any field'],
          ['Speaking & Listening', 'Deliver ideas and evaluate others\' oral arguments', 'Presentations, interviews, and collaboration'],
        ]}
      />

      <Callout kind="coachs-note">
        The six strands are not separate subjects — they overlap constantly. A research essay requires
        language skills (grammar), argument skills (thesis and evidence), and informational reading skills
        (evaluating sources). When you study one strand, you're reinforcing all the others.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>How to Use This Guide</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Each section below covers one strand in depth. Read the content, engage with the analogies and
        examples, take the quick check at the end of each section, and mark it complete when you feel confident.
        The Diagnostic tab tests you across all strands. Use your results to identify which sections to re-read.
      </Typography>

      <Callout kind="make-it-stick">
        Don't try to read everything at once. Study one section per session, do the quick check, and come
        back the next day. Spaced repetition — studying the same material across multiple sessions — is far
        more effective than cramming the night before a test.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Reading Literature
// ─────────────────────────────────────────────────────────────────────
function Section2Literature() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Reading Literature Like a Detective</Typography>

      <Analogy title="Reading literature is detective work">
        A detective doesn't just read a crime scene — they interrogate every detail. Why is that cup placed
        there? What does the arrangement of the room suggest about the victim? Reading literature works
        the same way. Every word an author chose could have been a different word. Every metaphor is a
        deliberate decision. Your job is to ask: Why THIS word? Why THIS image? What is the author
        building toward, and how does each choice contribute to it?
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Point of View</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Point of view is the lens through which the story is told. It shapes what information the reader
        receives and how reliable that information is.
      </Typography>

      <GuideTable
        headers={['POV', 'Signal', 'What the reader gets', 'Limitation']}
        rows={[
          ['First person', '"I" narrator', 'Intimate access to one character\'s thoughts', 'Limited to what this character knows and believes — potentially unreliable'],
          ['Third-person limited', '"He/She/They" + one character\'s thoughts', 'Deeper than omniscient for one character', 'Everything outside this character\'s awareness is hidden'],
          ['Third-person omniscient', '"He/She/They" + all characters\' thoughts', 'Full picture of all characters\' inner lives', 'Can feel distant; requires careful navigation by author'],
          ['Second person', '"You"', 'Immediate, immersive — rare in literary fiction', 'Can feel gimmicky if not handled with care'],
        ]}
      />

      <Callout kind="watch-for">
        An unreliable narrator is a first-person (or limited third-person) narrator whose account cannot be
        fully trusted — because of self-deception, limited knowledge, or deliberate deception. Look for gaps
        between what the narrator tells you and what the evidence of events suggests. Unreliable narration
        is a sophisticated literary technique, not an accident.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Narrative Structure: Freytag's Pyramid</Typography>

      <MermaidDiagram chart={`graph LR
  A["Exposition\n(background, characters, setting)"] --> B["Rising Action\n(conflict builds, complications)"]
  B --> C["Climax\n(peak tension — point of no return)"]
  C --> D["Falling Action\n(consequences unfold)"]
  D --> E["Resolution / Denouement\n(loose ends tied)"]`} />

      <Typography sx={{ mb: 1.5, lineHeight: 1.75, mt: 1.5 }}>
        Freytag's Pyramid maps the emotional arc of most narratives. The climax is not necessarily the
        most dramatic scene — it is the moment of decision or irreversible change that determines the ending.
        In Hamlet, the climax is generally identified in Act 3 — either the play-within-a-play that confirms
        Claudius's guilt, or Hamlet's killing of Polonius, the irreversible act that sets the falling action
        in motion.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Characterization</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Authors reveal character in two ways: direct (telling you) and indirect (showing you). The acronym
        STEAL covers the five channels of indirect characterization:
      </Typography>

      <GuideTable
        headers={['Letter', 'Method', 'Example']}
        rows={[
          ['S', 'Speech — what the character says', '"I don\'t need anyone\'s help," she snapped.'],
          ['T', 'Thoughts — what the character thinks', 'He wondered if he\'d ever deserve happiness.'],
          ['E', 'Effect on others — how others react', 'Every child in the village trusted her without question.'],
          ['A', 'Actions — what the character does', 'He returned the wallet with every bill intact.'],
          ['L', 'Looks — appearance and physical details', 'Her worn shoes told a story of miles walked alone.'],
        ]}
      />

      <Callout kind="in-plain-words">
        Direct characterization: the author tells you. Indirect characterization: the author shows you and
        lets you conclude. Literary analysis rewards attention to indirect characterization because that's
        where authors embed the most meaning. Anyone can say "she was brave." Showing her hands shaking as
        she steps forward anyway is what makes you believe it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Theme vs. Subject — The Most Common Confusion</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Subject is the topic. Theme is what the work says about that topic. Themes are statements, not nouns.
      </Typography>

      <GuideTable
        headers={['Subject (noun)', 'Theme (statement about it)']}
        rows={[
          ['War', '"War destroys the humanity of those who wage it."'],
          ['Ambition', '"Unchecked ambition corrupts even the most righteous person."'],
          ['Identity', '"We construct our identities through the stories we tell about ourselves."'],
          ['Loyalty', '"True loyalty sometimes requires the courage to disagree."'],
        ]}
      />

      <Callout kind="try-this">
        To find a theme: (1) Identify what happens to the main character. (2) Ask what they learn — or fail
        to learn. (3) Generalize that lesson to humanity. If the protagonist's greed destroys them, a theme
        might be "Greed isolates people from what matters most." Always express themes as complete sentences.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Figurative Language & Sound Devices</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Authors use figurative language not just for decoration but to compress meaning, create emotional
        resonance, and guide interpretation.
      </Typography>

      <GuideTable
        headers={['Device', 'Definition', 'Effect']}
        rows={[
          ['Metaphor', 'Direct comparison (A IS B)', 'Maps qualities of one thing onto another; creates insight'],
          ['Simile', 'Comparison using "like" or "as"', 'Signals comparison explicitly; often more accessible'],
          ['Personification', 'Human traits given to non-human things', 'Creates emotional connection to abstract or natural forces'],
          ['Symbolism', 'Concrete object representing abstract idea', 'Deepens meaning; rewards attentive readers'],
          ['Motif', 'Recurring image or idea throughout a work', 'Accumulates meaning with each repetition; reinforces theme'],
          ['Allusion', 'Reference to another work, person, or event', 'Imports meaning from outside the text'],
          ['Hyperbole', 'Deliberate exaggeration', 'Creates emphasis, humor, or emotional intensity'],
          ['Irony', 'Gap between appearance and reality', 'Creates complexity, suspense, or social critique'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Close Reading: A Process</Typography>

      <MermaidDiagram chart={`flowchart TD
  A["Read the passage once for meaning\n(What is happening?)"] --> B["Read again — annotate\n(underline, circle, question)"]
  B --> C["Identify literary devices\n(What techniques are present?)"]
  C --> D["Ask WHY for each device\n(What effect does this choice create?)"]
  D --> E["Connect to theme or character\n(How does this serve the whole?)"]
  E --> F["Draft your analysis\n(Device → Effect → Meaning)"]`} />

      <Callout kind="make-it-stick">
        The formula for literary analysis: Name the device + Quote it + Explain its effect + Connect to
        theme. Weak analysis: "The author uses personification." Strong analysis: "By giving the storm
        human anger ('the sky raged'), the author externalizes the protagonist's internal grief, suggesting
        that her emotions are so overwhelming they have transformed the natural world around her."
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Poetry Essentials</Typography>
      <GuideTable
        headers={['Term', 'Definition']}
        rows={[
          ['Iambic pentameter', '5 iambs per line (da-DUM × 5 = 10 syllables); dominant in Shakespeare'],
          ['Volta', 'The "turn" in a poem — a shift in thought, emotion, or direction'],
          ['Enjambment', 'Line continues without pause into the next; creates momentum'],
          ['Caesura', 'Mid-line pause, often marked by punctuation; slows the reader'],
          ['Rhyme scheme', 'Pattern of end rhymes labeled ABAB, AABB, etc.'],
          ['Shakespearean sonnet', 'ABAB CDCD EFEF GG — three quatrains and a couplet'],
          ['Apostrophe', 'Addressing an absent person or abstract idea as if present'],
        ]}
      />

      <Callout kind="connect">
        Tone and mood are frequently confused. Tone belongs to the author — it is the author's attitude toward
        the subject (detached, reverent, sardonic). Mood belongs to the reader — it is the emotional atmosphere
        the text creates in you (dread, joy, nostalgia). A single text can have a detached, clinical tone
        (author) while creating profound dread (reader mood).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Dynamic vs. Static vs. Round vs. Flat Characters</Typography>
      <GuideTable
        headers={['Term', 'Definition', 'Example']}
        rows={[
          ['Dynamic character', 'Changes significantly over the course of the narrative — learns, grows, or deteriorates', 'Hamlet shifts from paralysis to decisive action; Macbeth descends from noble to tyrannical'],
          ['Static character', 'Remains essentially the same despite events — serves a consistent function', 'Many mentors, villains, and foils are intentionally static to highlight the protagonist\'s change'],
          ['Round character', 'Multi-dimensional — has contradictions, depth, and believable motivations', 'Elizabeth Bennet: witty, perceptive, prideful, and capable of self-correction'],
          ['Flat character', 'One-dimensional — defined by a single trait or function', 'A character who exists only to be rescued or only to provide comic relief'],
        ]}
      />

      <Callout kind="in-plain-words">
        These two axes are independent. A character can be dynamic AND flat (they change, but predictably, from one-note bad to one-note good), or static AND round (they don't change, but they're richly drawn). The most sophisticated characters are both dynamic and round — they change in ways that feel genuinely earned and complicated.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Literary Movements and Periods</Typography>

      <Analogy title="Literary movements are like musical genres">
        Just as you can identify whether a song is jazz, hip-hop, or classical from its style and instrumentation, you can identify a literary movement from its themes, style, and concerns. A Romantic poem celebrates nature and emotion; a Naturalist novel shows humans trapped by social forces they can't control; a Modernist story fragments time and consciousness. Recognizing the movement helps you interpret individual choices as part of a larger conversation.
      </Analogy>

      <GuideTable
        headers={['Period', 'Approx. dates', 'Key characteristics', 'Representative works']}
        rows={[
          ['Romanticism', '1780–1850', 'Individual emotion over reason; nature as spiritual force; imagination; the sublime; rebellion against industrialization', 'Keats, Byron, Shelley; Frankenstein (Shelley)'],
          ['Realism', '1850–1910', 'Accurate depiction of everyday life; social critique; ordinary characters; psychological depth; rejection of idealization', 'Dickens, Twain, Tolstoy; Huckleberry Finn'],
          ['Naturalism', '1880–1920', 'Determinism — humans shaped by heredity, environment, and chance; often bleak outcomes; scientific observation of social conditions', 'Zola, Crane, Dreiser; The Red Badge of Courage'],
          ['Modernism', '1910–1945', 'Stream of consciousness; fragmented narrative; disillusionment; experimentation with form; loss of certainty after WWI', 'Woolf, Joyce, Faulkner, Eliot; The Great Gatsby'],
          ['Postmodernism', '1945–present', 'Self-referential (metafiction); questioning of grand narratives; irony; playful form; blurring of high/low culture', 'Pynchon, Morrison, DFW; Beloved'],
          ['Harlem Renaissance', '1920s–1930s', 'African American cultural flowering; jazz and blues influence; racial pride and identity; social critique', 'Hughes, Hurston, Cullen; Their Eyes Were Watching God'],
        ]}
      />

      <Callout kind="why-it-matters">
        Knowing a text's literary period tells you what questions it's asking. A Romantic poem about a storm isn't just describing weather — it's using nature to explore human emotion and the limits of rationality. A Naturalist novel's tragic ending isn't nihilism — it's arguing that social forces (poverty, prejudice, environment) constrain individual freedom in ways Romanticism ignored. Context is interpretation.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Archetypes: The Recurring Patterns of Story</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Archetypes are universal patterns of character, situation, and symbol that recur across cultures and eras. Carl Jung argued they reflect deep structures of human experience. In literature, recognizing archetypes helps you connect individual texts to larger patterns of meaning.
      </Typography>

      <GuideTable
        headers={['Archetype', 'Description', 'Examples across texts']}
        rows={[
          ['The Hero', 'Called to adventure, faces trials, is transformed by the journey', 'Odysseus, Hamlet, Katniss Everdeen'],
          ['The Mentor', 'Wise guide who prepares the hero but cannot complete the journey for them', 'Gandalf, Atticus Finch, Dumbledore'],
          ['The Shadow / Villain', 'Represents the hero\'s dark side or the forces opposing growth', 'Iago, Sauron, Amy Dunne'],
          ['The Trickster', 'Uses deception and wit to subvert the established order; often provides comic relief with a serious edge', 'Puck (Midsummer Night\'s Dream), Huck Finn'],
          ['The Threshold Guardian', 'Tests the hero before they can enter a new realm', 'The Sphinx in Oedipus; border guards in dystopian fiction'],
          ['The Scapegoat', 'Bears the punishment or blame for the community\'s sins', 'Tessie Hutchinson (The Lottery); Piggy (Lord of the Flies)'],
        ]}
      />

      <Callout kind="connect">
        The Hero's Journey (Joseph Campbell's monomyth) maps the hero archetype across a universal narrative structure: departure (call to adventure → crossing the threshold), initiation (trials → supreme ordeal), and return (with the boon). Whether you're reading Homer, Star Wars, or a contemporary YA novel, this structure underlies most hero-centered narratives. Recognizing it doesn't reduce a text — it illuminates it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Extended Metaphor and Allegory</Typography>
      <GuideTable
        headers={['Device', 'Definition', 'Example', 'Key question']}
        rows={[
          ['Metaphor', 'Single comparison — one moment in the text', '"Life is a journey" used once', 'What does this comparison reveal about the subject?'],
          ['Extended metaphor', 'A metaphor sustained across a passage or entire work — the same comparison elaborated in multiple ways', 'Donne\'s "A Valediction: Forbidding Mourning" (two lovers as the legs of a compass)', 'How does each elaboration develop the central comparison?'],
          ['Allegory', 'An entire narrative that functions simultaneously as a literal story AND a symbolic commentary on something else', 'Animal Farm (Soviet communism); The Scarlet Letter (Puritan guilt)', 'What is the one-to-one correspondence between story elements and the real-world referent?'],
        ]}
      />

      <Callout kind="make-it-stick">
        The difference between a symbol and an allegory: a symbol suggests meanings but doesn't require a one-to-one correspondence — the green light in Gatsby suggests hope, the American Dream, desire, but it doesn't map onto a single external system. Allegory, by contrast, requires a consistent, systematic correspondence between the fictional world and a real one. Every pig in Animal Farm maps onto a specific type of political figure.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Textual Evidence and the Literary Analysis Formula</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every literary claim requires textual evidence — a direct quotation or specific reference to the text. After presenting evidence, you must analyze it. The analysis is the hard part, and the part most students skip.
      </Typography>

      <Box sx={{ p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontSize: '0.88rem', lineHeight: 1.9 }}>
        <strong>Weak analysis</strong> (identifies device only):<br />
        "The author uses a simile in this line."<br /><br />
        <strong>Better analysis</strong> (device + effect):<br />
        "The simile comparing the city to 'a patient etherized upon a table' creates a tone of paralysis and vulnerability."<br /><br />
        <strong>Strong analysis</strong> (device + effect + connection to theme):<br />
        "The simile comparing the city to 'a patient etherized upon a table' creates a tone of paralysis and vulnerability, suggesting that the speaker's alienation is not personal but structural — the modern city itself is unconscious, and moving through it without feeling is unavoidable, not a failure of character."
      </Box>

      <Callout kind="try-this">
        Ask three questions about every piece of evidence: (1) What technique is the author using? (2) What effect does that technique create — what does it make the reader feel, notice, or assume? (3) How does that effect serve the poem's, story's, or play's larger argument or theme? Answering all three turns identification into analysis.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Reading Informational Text
// ─────────────────────────────────────────────────────────────────────
function Section3Informational() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Reading Informational Text: Beyond the Surface</Typography>

      <Analogy title="Reading nonfiction like a lawyer reviewing evidence">
        A good lawyer doesn't just read a document — they interrogate it. Who wrote this? What do they want
        me to believe? What evidence is presented, and is it the right kind? What's missing? What
        assumptions are buried in the language? Reading informational text requires the same disciplined
        skepticism. You're not reading to absorb — you're reading to evaluate.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Author's Purpose</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every informational text was written for a reason. The three primary purposes are:
      </Typography>

      <GuideTable
        headers={['Purpose', 'What the author does', 'Signal words/features']}
        rows={[
          ['Inform', 'Presents facts and explanations without taking a position', 'Neutral language, definitions, statistics, balanced coverage'],
          ['Persuade', 'Argues for a particular position or course of action', 'Claim, evidence, counterargument, calls to action'],
          ['Entertain', 'Engages the reader through narrative or style', 'Personal voice, anecdotes, humor, vivid description'],
        ]}
      />

      <Callout kind="watch-for">
        Most real-world texts mix purposes. A news article primarily informs but may have subtle persuasive
        framing through word choice or which facts are foregrounded. A persuasive essay might inform the
        reader about context before arguing. Always ask: What is the PRIMARY purpose, and where does it shade
        into secondary purposes?
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Text Structure Types</Typography>

      <MermaidDiagram chart={`graph TD
  A["Informational Text Structure"] --> B["Chronological\n(first, then, next, finally)"]
  A --> C["Cause & Effect\n(because, as a result, therefore)"]
  A --> D["Compare & Contrast\n(similarly, however, in contrast)"]
  A --> E["Problem & Solution\n(the issue is, one remedy, to address)"]
  A --> F["Description\n(characteristics, features, for instance)"]`} />

      <Typography sx={{ mt: 1.5, mb: 1, lineHeight: 1.75 }}>
        Recognizing structure helps you locate information efficiently and understand how the author builds
        their argument. The signal words in parentheses above are your clues — they flag which organizational
        pattern is in use.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Central Idea vs. Main Idea</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Central idea:</strong> the overarching claim or message of the entire text.
        <strong> Main idea:</strong> the primary point of a single paragraph or section.
        Each paragraph's main idea should support the central idea.
      </Typography>

      <Callout kind="try-this">
        To find the central idea: read the first and last paragraphs carefully — authors often state or restate
        the central idea in the introduction and conclusion. Then ask: "What single claim do all the body
        paragraphs support?" That's your central idea. Write it as a complete sentence, not a topic noun.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Evaluating Evidence and Claims</Typography>
      <GuideTable
        headers={['Evidence type', 'Strength', 'Watch out for']}
        rows={[
          ['Statistical data from large studies', 'High — quantitative, systematic', 'Sample size, funding source, date'],
          ['Expert testimony', 'High if credentials match the claim', 'Appeal to authority without relevant expertise'],
          ['Personal anecdote', 'Low for broad claims — single case', 'Treating one story as representative data'],
          ['Direct quotation from official documents', 'High — primary source', 'Quote mining — context matters'],
          ['Emotional appeal / vivid story', 'Strong for engagement, weak for proof', 'Conflating emotional impact with logical validity'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Identifying Bias</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Bias is not simply "wrong" or "bad" — all authors have perspectives. Bias becomes problematic when
        it distorts the presentation of evidence. Warning signs:
      </Typography>

      <GuideTable
        headers={['Bias indicator', 'Example']}
        rows={[
          ['One-sided evidence selection', 'Only cites studies that support the author\'s position'],
          ['Emotionally charged language in a neutral context', 'A news article calling a policy "reckless" vs. "controversial"'],
          ['Omission of complicating facts', 'Citing crime statistics without noting they\'ve been declining'],
          ['Caricaturing the opposition', 'Describing opponents as "those who want to destroy everything good"'],
          ['Absence of counter-evidence', 'No acknowledgment of legitimate research on the other side'],
        ]}
      />

      <Callout kind="in-plain-words">
        Bias is like a camera angle. The camera can capture a real event accurately AND still show only one
        angle. Two news outlets covering the same press conference can both be technically accurate while
        emphasizing completely different moments. Your job as a reader is to identify the angle, not just
        accept the image as the whole picture.
      </Callout>

      <Callout kind="why-it-matters">
        Primary sources (diaries, speeches, data, original documents) give you direct evidence.
        Secondary sources (textbooks, documentaries, analyses) interpret primary sources. Both are valuable
        in research, but they serve different purposes. Using only secondary sources means you're always
        reading someone else's interpretation — which is a layer of potential distortion.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Synthesizing Multiple Texts</Typography>

      <Analogy title="Synthesizing texts is like a jazz improvisation session">
        In jazz, multiple musicians play the same chord progression, but each improvises differently around it. When you synthesize sources, you're finding the shared "chord progression" — the central question or theme — that multiple authors riff on. Your synthesis doesn't just list what each one plays; it identifies the conversation they're having and contributes your own perspective.
      </Analogy>

      <GuideTable
        headers={['Synthesis move', 'Signal language', 'What it does']}
        rows={[
          ['Agreement', '"Similarly, both Smith and Jones argue..." / "Like Chen, Patel emphasizes..."', 'Shows where sources converge — strengthens a claim'],
          ['Disagreement', '"However, while Smith argues X, Jones contends Y..."', 'Maps the intellectual debate around an issue'],
          ['Qualification', '"Smith\'s claim holds in urban contexts, but Jones\'s rural data complicates it..."', 'Refines a broad claim with nuance from a second source'],
          ['Extension', '"Building on Smith\'s framework, Jones adds..."', 'Shows how one source develops or elaborates another'],
          ['Contrast of method', '"Unlike Smith\'s historical analysis, Jones takes a statistical approach..."', 'Shows different ways of investigating the same question'],
        ]}
      />

      <Callout kind="try-this">
        Before synthesizing, create a simple matrix: list each source across the top and each key question down the side. Fill in each cell with that source's position. Then read across the rows — the patterns of agreement and disagreement reveal the synthesis you need to write. This technique works for two sources or twenty.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Seminal U.S. Documents</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        11th-grade ELA standards specifically include reading and analyzing seminal U.S. documents — texts that have shaped American civic life. Apply the same critical lens you use for any informational text: author, purpose, audience, argument structure, rhetorical appeals, and historical context.
      </Typography>

      <GuideTable
        headers={['Document', 'Date', 'Central argument', 'Rhetorical strategy']}
        rows={[
          ['Declaration of Independence', '1776', 'Colonial grievances justify separation from Britain; self-evident truths establish natural rights', 'Logos: list of specific grievances; Ethos: speaking for "all men"; Pathos: "long train of abuses"'],
          ['Federalist No. 51 (Madison)', '1788', 'Checks and balances protect liberty by preventing any faction from dominating', 'Logos: structural argument; famous "if men were angels" conditional'],
          ['Gettysburg Address (Lincoln)', '1863', 'The war is a test of democratic self-government; the dead\'s sacrifice demands the living\'s dedication', 'Anaphora ("we cannot dedicate — we cannot consecrate"); epistrophe ("of the people, by the people, for the people")'],
          ['Letter from Birmingham Jail (MLK Jr.)', '1963', 'Unjust laws have no claim on moral conscience; direct action is necessary when negotiation fails', 'All three appeals: Ethos from credentials and shared values; Logos from St. Augustine and natural law; Pathos from vivid description of injustice'],
        ]}
      />

      <Callout kind="why-it-matters">
        These documents are not historical artifacts — they are living arguments that American society continues to interpret and contest. The Declaration established a principle ("all men are created equal") that its authors didn't fulfill, which became the argumentative foundation for abolitionism, suffrage, and civil rights movements. Reading them critically means understanding both their power and their limitations.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Reading Visual and Quantitative Information</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Informational texts frequently embed data in visual forms — graphs, charts, tables, infographics, maps, and photographs. Reading these accurately requires skills distinct from reading prose.
      </Typography>

      <GuideTable
        headers={['Visual type', 'Best for showing', 'Common misreadings']}
        rows={[
          ['Bar chart', 'Comparing discrete categories at one point in time', 'Confusing the height of bars with total quantity; ignoring the Y-axis scale'],
          ['Line graph', 'Showing change over time; trends', 'Assuming correlation implies causation; ignoring axis labels'],
          ['Pie chart', 'Showing proportions of a whole', 'Comparing categories when slices are close in size (unreliable visually)'],
          ['Scatter plot', 'Showing relationships between two variables', 'Reading a correlation as proof of causation; ignoring outliers'],
          ['Table', 'Presenting precise data for comparison', 'Reading only the first row; missing trend patterns across rows/columns'],
          ['Infographic', 'Communicating a narrative with visual emphasis', 'Missing the curated, selective nature of what\'s included'],
        ]}
      />

      <Callout kind="watch-for">
        The most dangerous graph misreading: a truncated Y-axis. If a bar chart starts at 97 instead of 0, a small difference looks enormous. Always check whether the Y-axis starts at zero. If it doesn't, the visual is technically accurate but misleading — and that visual choice is a rhetorical decision. Ask why the author made it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Rhetorical Modes in Informational Writing</Typography>

      <Analogy title="Rhetorical modes are tools in a writer's toolbox">
        A carpenter doesn't use a hammer for every job — they select the right tool for each task. Nonfiction writers do the same with rhetorical modes: narration to establish context, description to help the reader visualize, cause/effect to explain why something happened, and argumentation to advocate for a position. Skilled writers blend modes within a single piece, switching tools as the task requires.
      </Analogy>

      <GuideTable
        headers={['Mode', 'Purpose', 'Common in']}
        rows={[
          ['Narration', 'Tells a story or sequence of events; chronological', 'Memoir, personal essay, longform journalism'],
          ['Description', 'Creates a vivid picture of a person, place, event, or idea; sensory language', 'Travel writing, nature writing, character profiles'],
          ['Exposition', 'Explains how something works or what something is; definition, examples, analysis', 'Textbook chapters, how-to articles, explanatory journalism'],
          ['Cause & Effect', 'Explains why something happened or what will result; causal chains', 'Historical analysis, policy arguments, science journalism'],
          ['Comparison & Contrast', 'Examines similarities and differences; point-by-point or block format', 'Review articles, policy analysis, academic writing'],
          ['Argumentation / Persuasion', 'Advocates for a position on a debatable issue; claim → evidence → reasoning → rebuttal', 'Editorials, op-eds, legal briefs, advocacy documents'],
        ]}
      />

      <Callout kind="coachs-note">
        On standardized tests, "author's purpose" questions often ask you to identify the dominant rhetorical mode of a passage or section. Scan for the structural signals: chronological transitions (narration), sensory details (description), "because/therefore" chains (cause/effect), "similarly/however" (comparison/contrast), claim + evidence structure (argumentation). The mode is usually signaled in the first paragraph.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 4: Argument & Rhetoric
// ─────────────────────────────────────────────────────────────────────
function Section4Rhetoric() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Argument & Rhetoric: The Three-Legged Stool</Typography>

      <Analogy title="The rhetorical triangle is a three-legged stool">
        A stool with three legs is stable because each leg bears weight. Aristotle's three rhetorical appeals —
        ethos, logos, pathos — work the same way. Pull out one leg and the stool tips. A speech built entirely
        on emotion (pathos) without evidence (logos) is manipulation. One built entirely on data (logos) without
        personal credibility (ethos) falls flat. One built on credentials (ethos) without evidence (logos) is
        argument by authority. Strong rhetoric balances all three.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Three Aristotelian Appeals</Typography>

      <MermaidDiagram chart={`graph TD
  R["Rhetorical Triangle"] --> E["ETHOS\n(Credibility)\nWhy should you trust me?"]
  R --> L["LOGOS\n(Logic)\nWhat's the evidence?"]
  R --> P["PATHOS\n(Emotion)\nHow does this affect you?"]
  E --> E1["Credentials, tone, fairness\nto opposition, shared values"]
  L --> L1["Statistics, studies, expert\ncitation, logical structure"]
  P --> P1["Vivid stories, imagery,\nemotional language, shared fears"]`} />

      <GuideTable
        headers={['Appeal', 'Honest use', 'Manipulative version']}
        rows={[
          ['Ethos', 'Cite relevant credentials; treat opponents fairly', 'Fake authority; appeal to celebrity without expertise'],
          ['Logos', 'Peer-reviewed evidence; valid logical structure', 'Cherry-picking data; misleading statistics'],
          ['Pathos', 'Relevant personal story that illustrates a real point', 'Emotional manipulation designed to bypass critical thinking'],
        ]}
      />

      <Callout kind="why-it-matters">
        Understanding the appeals makes you a better writer AND a more resistant reader. When you can
        name the technique being used on you — "this is a pathos appeal without logos backing it" —
        you can choose whether to be moved by it rather than being swept along automatically.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Rhetorical Situation</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every piece of rhetoric exists in a context. The SOAPS framework captures the key variables:
      </Typography>

      <GuideTable
        headers={['Element', 'Question it answers']}
        rows={[
          ['Subject', 'What is the text about?'],
          ['Occasion', 'What event or context prompted this text?'],
          ['Audience', 'Who is the intended reader/listener, and what do they believe?'],
          ['Purpose', 'What does the author want the audience to think, feel, or do?'],
          ['Speaker', 'Who is the author, and what is their relationship to the subject?'],
        ]}
      />

      <Callout kind="in-plain-words">
        Rhetoric is never universal — it's targeted. Lincoln's Gettysburg Address was written for a
        specific occasion (a military cemetery dedication), specific audience (a grieving nation),
        and specific purpose (to reframe the war as a test of democratic ideals). The same speech
        delivered to a different audience in different circumstances would need different choices.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Argument Structure: Claim-Evidence-Warrant</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The Toulmin model breaks every argument into six components. The three essential ones are:
      </Typography>

      <GuideTable
        headers={['Component', 'What it does', 'Example']}
        rows={[
          ['Claim', 'States the position being argued', '"Schools should start later"'],
          ['Evidence (Data)', 'Provides facts, statistics, or expert opinion', '"Studies show teen sleep deprivation peaks with early start times"'],
          ['Warrant', 'Explains the logical connection between evidence and claim', '"Adequate sleep improves learning, and school\'s purpose is learning"'],
          ['Backing', 'Supports the warrant itself', '"Sleep research is well-established in peer-reviewed literature"'],
          ['Qualifier', 'Limits the claim\'s scope', '"In most cases" / "where economically feasible"'],
          ['Rebuttal', 'Acknowledges counterarguments', '"Critics note bus schedule challenges, but staggered starts address this"'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Logical Fallacies — The Most Common Ones</Typography>

      <GuideTable
        headers={['Fallacy', 'Definition', 'Example']}
        rows={[
          ['Ad hominem', 'Attacking the person, not the argument', '"You can\'t trust her opinion — she was fired once."'],
          ['Straw man', 'Misrepresenting the opponent\'s position', '"They want to help immigrants — so they want open borders."'],
          ['False dichotomy', 'Presenting only two options when more exist', '"You\'re either with us or against us."'],
          ['Slippery slope', 'Claiming one step inevitably leads to extreme outcome', '"If we allow phone use, students will never learn anything."'],
          ['Hasty generalization', 'Drawing broad conclusions from too few cases', '"My two friends failed the test — it must be too hard."'],
          ['Appeal to authority', 'Using credentials without relevant expertise', '"A famous actor says this vaccine is dangerous."'],
          ['Circular reasoning', 'Using the conclusion as a premise', '"This book is true because the book says it\'s true."'],
          ['Bandwagon', 'Arguing from popularity', '"Everyone is buying this, so it must be good."'],
        ]}
      />

      <Callout kind="watch-for">
        Fallacies are not always obvious — skilled manipulators embed them in fluent, confident language.
        Ask two diagnostic questions for any claim: (1) Does this evidence actually support this conclusion,
        or just feel like it does? (2) What information would need to be true for this argument to work?
        If the required assumptions are weak or unproven, the argument has a fallacy hiding inside it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Counterargument and Rebuttal</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A strong argument acknowledges the best version of the opposing position — then explains why the
        original claim still holds. This two-step move is called concession and rebuttal.
      </Typography>
      <Box sx={{ p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontSize: '0.9rem', lineHeight: 1.8 }}>
        <strong>Concession:</strong> "Admittedly, staggered school start times create significant challenges for
        families who rely on bus schedules and before-school childcare."<br /><br />
        <strong>Rebuttal:</strong> "However, districts that have implemented phased rollouts — adjusting one grade
        level per year — have resolved scheduling concerns without sacrificing the sleep benefits for older students."
      </Box>

      <Callout kind="make-it-stick">
        The signal words for concession: "Admittedly," "It is true that," "Critics are correct that," "While
        it may be the case that." The signal words for rebuttal: "However," "Nevertheless," "Despite this,"
        "Even so." Mastering this two-move pattern transforms a one-sided essay into a sophisticated argument.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Advanced Rhetorical Devices</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Beyond the three appeals, skilled rhetoricians use specific language patterns to create rhythm, emphasis, and memorability. These devices appear in speeches, essays, and political writing — and are frequently tested in ELA assessments.
      </Typography>

      <GuideTable
        headers={['Device', 'Definition', 'Famous example']}
        rows={[
          ['Anaphora', 'Repetition of a word or phrase at the beginning of successive clauses', '"We shall fight on the beaches... we shall fight on the landing grounds... we shall fight in the fields..." (Churchill)'],
          ['Epistrophe', 'Repetition at the end of successive clauses', '"...of the people, by the people, for the people" (Lincoln)'],
          ['Chiasmus', 'Reversing the grammatical structures in successive clauses (A-B / B-A)', '"Ask not what your country can do for you — ask what you can do for your country" (JFK)'],
          ['Antithesis', 'Placing contrasting ideas in parallel structure', '"It was the best of times, it was the worst of times" (Dickens)'],
          ['Parallelism', 'Using the same grammatical structure for related ideas', '"I came, I saw, I conquered" (Caesar)'],
          ['Rhetorical question', 'A question asked for effect, not to get an answer', '"Are we going to let them take everything we\'ve built?"'],
          ['Tricolon', 'A series of three parallel elements that creates emphasis and rhythm', '"Life, liberty, and the pursuit of happiness"'],
          ['Apophasis', 'Raising an idea by claiming not to raise it', '"I\'m not going to bring up my opponent\'s tax issues..."'],
        ]}
      />

      <Callout kind="try-this">
        To identify anaphora vs. epistrophe vs. chiasmus on a test: look WHERE the repetition occurs. Beginning of clauses = anaphora. End of clauses = epistrophe. Reversed structure (A-B / B-A) = chiasmus. Contrasting ideas in parallel structure = antithesis. Practice labeling each device in a passage and explaining the persuasive effect each creates.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Kairos: The Rhetoric of Timing</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Kairos (Greek for "the right moment") is often called the fourth rhetorical element alongside ethos, logos, and pathos. It refers to the timeliness and appropriateness of an argument — the idea that the same argument can succeed or fail based entirely on when and where it is made.
      </Typography>

      <GuideTable
        headers={['Principle', 'Example']}
        rows={[
          ['The right moment amplifies persuasion', 'Lincoln\'s Gettysburg Address worked because it came after the bloodiest battle of the Civil War, when the nation was questioning whether the sacrifice was worth it'],
          ['Arguing out of time undermines ethos', 'Bringing up a policy failure years after everyone has moved on looks opportunistic rather than principled'],
          ['Context changes meaning', 'A speech about national security resonates differently in the weeks after an attack than in peacetime'],
          ['Kairos requires reading the audience', 'A skilled rhetor senses when an audience is ready for a difficult argument and when they need more groundwork first'],
        ]}
      />

      <Callout kind="connect">
        MLK Jr.'s "Letter from Birmingham Jail" was written in April 1963, from a jail cell, responding to a public letter from white clergymen calling his protests "unwise and untimely." The timing shapes everything: the ethos (writing from jail proves personal commitment), the logos (responding point-by-point to specific objections), and the kairos (the civil rights movement needed to publicly answer the "wait" argument at exactly that moment).
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Deductive vs. Inductive Reasoning</Typography>

      <Analogy title="Deductive reasoning is a funnel; inductive reasoning is a ladder">
        Deductive reasoning starts with a general principle (the wide top of the funnel) and narrows to a specific conclusion. Inductive reasoning starts with specific observations (the bottom rung of the ladder) and climbs up to a general conclusion. Both are valid, but they fail in different ways: deductive reasoning can be logically valid but based on false premises; inductive reasoning can be based on true observations but fail to generalize reliably.
      </Analogy>

      <GuideTable
        headers={['Type', 'Structure', 'Strength', 'Weakness']}
        rows={[
          ['Deductive', 'General premise → Specific conclusion. "All humans are mortal. Socrates is human. Therefore, Socrates is mortal."', 'If premises are true and logic is valid, conclusion must be true', 'Garbage in, garbage out — false premises produce false conclusions even through valid logic'],
          ['Inductive', 'Specific observations → General conclusion. "Every crow I\'ve seen is black. Therefore, all crows are black."', 'Draws conclusions from evidence; the basis of scientific inquiry', 'No matter how many confirming cases, one disconfirming case breaks the generalization'],
          ['Abductive', 'Best available explanation for observations. "The lawn is wet — it probably rained."', 'Practical for everyday inference when certainty is unavailable', 'May miss better explanations; prone to confirmation bias'],
        ]}
      />

      <Callout kind="watch-for">
        Most real-world arguments mix deductive and inductive elements. A politician who says "every time we've cut taxes, growth has followed" is reasoning inductively. If they then add "cutting taxes always causes growth," they've slipped from an inductive observation into a deductive premise without proving it. This move — from "has often followed" to "always causes" — is one of the most common argument weaknesses in political rhetoric.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Analyzing a Speech: The Gettysburg Address</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The Gettysburg Address (1863) is 272 words — shorter than this paragraph — yet it is the most analyzed speech in American history. Breaking it down reveals how concentrated rhetorical technique works.
      </Typography>

      <Box sx={{ p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontSize: '0.88rem', lineHeight: 2 }}>
        <strong>"Four score and seven years ago...":</strong> Kairos — grounds the speech in founding principles, not the war itself. Creates a frame: are we living up to 1776?<br /><br />
        <strong>"...all men are created equal":</strong> Allusion to the Declaration. Ethos — Lincoln borrows Jefferson's authority. Also a reframing: the war is not about union, but equality.<br /><br />
        <strong>Anaphora ("We cannot dedicate — we cannot consecrate — we cannot hallow..."):</strong> The living have no power to honor the dead — their actions have already done so. Inverts the expected relationship between the living and the fallen.<br /><br />
        <strong>"...government of the people, by the people, for the people, shall not perish from the earth":</strong> Tricolon + epistrophe. Memorable, emotionally conclusive. Raises the stakes to a global/historical scale — democracy itself is on trial.
      </Box>

      <Callout kind="make-it-stick">
        When analyzing any speech, break it into its moves: How does it open (establishing context or urgency)? How does it establish ethos? What is the central claim? What evidence or examples does it use? What emotional appeal climaxes it? How does it close (call to action, elevated frame, memorable image)? Every effective speech has answers to all these questions.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Research Writing
// ─────────────────────────────────────────────────────────────────────
function Section5Research() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Research Writing: Building a Case Like a Lawyer</Typography>

      <Analogy title="Research writing is like preparing a legal case">
        A lawyer doesn't just collect any evidence — they collect the right evidence, evaluate its
        admissibility, organize it into a coherent argument, and cite its source so opposing counsel
        can verify it. Research writing works the same way. You identify a question, gather credible
        sources, evaluate what they say and what they're worth, synthesize the best evidence into an
        argument, and document everything so your reader can check your work.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Research Process</Typography>

      <MermaidDiagram chart={`flowchart LR
  A["Develop a\nresearch question"] --> B["Find sources\n(library, databases)"]
  B --> C["Evaluate sources\nwith CRAAP test"]
  C --> D["Take notes &\ntrack citations"]
  D --> E["Develop thesis\nfrom evidence"]
  E --> F["Draft with\nsignal phrases & citations"]
  F --> G["Revise argument\n& structure"]
  G --> H["Edit & format\nWorks Cited"]`} />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Evaluating Sources: The CRAAP Test</Typography>

      <GuideTable
        headers={['Letter', 'Stands for', 'Questions to ask']}
        rows={[
          ['C', 'Currency', 'When was it published? Is this field changing fast enough that older sources are outdated?'],
          ['R', 'Relevance', 'Does it actually address my research question? Is it at the right level (not too basic, not too specialized)?'],
          ['A', 'Authority', 'Who wrote it? What are their credentials? Is it from a reputable publisher?'],
          ['A', 'Accuracy', 'Is information supported by evidence? Are claims cited? Can I verify the facts?'],
          ['P', 'Purpose', 'Why was this written — to inform, sell, advocate, or entertain? Is there a disclosed agenda?'],
        ]}
      />

      <Callout kind="coachs-note">
        Not all sources are created equal for all purposes. A Wikipedia article might be fine for getting
        background on a topic, but it is not citable in an academic paper. A peer-reviewed journal article
        is the gold standard for empirical claims. A newspaper editorial is appropriate for tracking public
        opinion, not for establishing facts. Match the source type to the claim you're making with it.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Primary vs. Secondary Sources</Typography>

      <GuideTable
        headers={['Type', 'Definition', 'Examples']}
        rows={[
          ['Primary', 'First-hand, original record — created at the time or by a direct participant', 'Diary, speech, interview, data set, photograph, novel, court record'],
          ['Secondary', 'Analyzes, interprets, or comments on primary sources', 'Textbook, biography, documentary, literary criticism, review article'],
          ['Tertiary', 'Compiles or indexes secondary sources', 'Encyclopedia, annotated bibliography, database index'],
        ]}
      />

      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Primary sources provide raw evidence; secondary sources provide context and interpretation.
        Strong research papers use both: primary sources for direct evidence, secondary sources to
        situate that evidence in the scholarly conversation.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Thesis Statement Development</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A strong thesis for a research paper is specific, arguable, and supportable. The progression
        from topic to thesis looks like this:
      </Typography>

      <GuideTable
        headers={['Stage', 'Example']}
        rows={[
          ['Broad topic', 'Social media'],
          ['Narrowed topic', 'Social media and teenage mental health'],
          ['Research question', 'Does social media use worsen anxiety in teenagers?'],
          ['Preliminary thesis', 'Social media use correlates with increased anxiety in teenagers'],
          ['Refined thesis', 'Heavy social media use — particularly passive scrolling — significantly worsens anxiety in adolescents by amplifying social comparison, but this effect can be mitigated with structured usage limits and digital literacy education'],
        ]}
      />

      <Callout kind="try-this">
        Test your thesis with these three questions: (1) Is it arguable? (Could a reasonable person disagree?)
        (2) Is it specific? (Does it tell the reader exactly what you'll argue?) (3) Is it supportable?
        (Do you have the sources to back it up?) If the answer is yes to all three, you have a workable thesis.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Integrating Sources: Synthesis vs. Summary</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Summary presents one source's main ideas. Synthesis weaves multiple sources together around
        a single analytical point. Research papers require synthesis.
      </Typography>

      <Box sx={{ p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontSize: '0.88rem', lineHeight: 1.8 }}>
        <strong>Summary (weak):</strong><br />
        "Smith argues that social media increases anxiety. Jones argues that it can be used positively."<br /><br />
        <strong>Synthesis (strong):</strong><br />
        "While Jones acknowledges that social media can facilitate community for isolated teens, Smith's
        longitudinal data demonstrates that passive scrolling — the dominant mode of use — consistently
        predicts worse anxiety outcomes, suggesting that the type of engagement matters more than
        access itself."
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Citation Formats: MLA vs. APA</Typography>

      <GuideTable
        headers={['Feature', 'MLA', 'APA']}
        rows={[
          ['Used in', 'English, humanities', 'Social sciences, psychology, education'],
          ['In-text format', '(Author Page) — no comma, no "p."', '(Author, Year, p. Page) — comma and year required'],
          ['Works Cited / References', '"Works Cited" at end', '"References" at end'],
          ['Emphasis in citation', 'Author and page — where to find the quote', 'Author and year — when it was published'],
          ['Example in-text', '(Morrison 47)', '(Morrison, 1987, p. 47)'],
        ]}
      />

      <Callout kind="watch-for">
        The most common MLA error: adding a comma between the author name and page number. MLA uses
        (Smith 47), not (Smith, 47). The second most common error: including "p." before the page number.
        MLA omits it. APA includes it. Know which style your teacher is requiring before you format a
        single citation.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Avoiding Plagiarism</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Plagiarism is presenting someone else's words or ideas as your own — intentionally or accidentally.
        The three forms:
      </Typography>

      <GuideTable
        headers={['Form', 'Description', 'Fix']}
        rows={[
          ['Direct copying', 'Using exact words without quotation marks and citation', 'Add quotation marks + in-text citation'],
          ['Patchwriting', 'Changing a few words but keeping the structure/ideas', 'Fully restate in your own phrasing, then cite'],
          ['Idea theft', 'Using someone\'s original argument without credit, even in your own words', 'Cite paraphrases and summaries — ideas need credit too'],
        ]}
      />

      <Callout kind="connect">
        The annotated bibliography is not busywork — it is the tool that prevents accidental plagiarism.
        When you write a brief evaluation of each source as you gather it (what it argues, how credible it
        is, how it fits your question), you document your intellectual process and never lose track of
        where an idea came from.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Revision Hierarchy</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Revision and editing are not the same thing. Do them in this order:
      </Typography>

      <GuideTable
        headers={['Stage', 'Focus', 'Questions to ask']}
        rows={[
          ['Revision (first)', 'Big picture: argument, structure, evidence', 'Is my thesis clear? Does each paragraph serve the argument? Is my evidence sufficient and credible?'],
          ['Editing (second)', 'Sentence level: clarity, word choice, transitions', 'Are my sentences clear? Do transitions connect ideas? Is my language precise?'],
          ['Proofreading (last)', 'Surface: grammar, mechanics, formatting', 'Are citations formatted correctly? Any typos, comma splices, or agreement errors?'],
        ]}
      />

      <Callout kind="make-it-stick">
        Many students skip revision and go straight to grammar checking — then wonder why their essays
        get marked down for weak argument and thin evidence. Proofreading a poorly argued essay just
        produces a neatly written poorly argued essay. Always revise the substance before you polish the surface.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Signal Phrases: The Bridge Between Your Words and Your Sources</Typography>

      <Analogy title="Signal phrases are traffic signals for academic writing">
        In traffic, signals tell drivers what's coming — stop, yield, proceed. Signal phrases in academic writing do the same: they alert the reader that outside evidence is arriving, introduce who it's from, and frame how it should be received. Without signal phrases, a quote just sits in a paragraph like a car without a turn signal — the reader doesn't know how to navigate around it.
      </Analogy>

      <GuideTable
        headers={['Signal phrase type', 'Examples', 'When to use']}
        rows={[
          ['Neutral attribution', '"Smith argues..." / "Jones states..." / "According to Chen..."', 'Default — when presenting a source\'s claim without evaluating it'],
          ['Affirming', '"As Smith demonstrates..." / "Jones\'s research confirms..."', 'When the evidence strongly supports your point'],
          ['Contrasting / Conceding', '"Although Smith claims..." / "While Jones contends..."', 'Before presenting a counterargument or complicating evidence'],
          ['Qualifying', '"Smith suggests..." / "Jones\'s data implies..."', 'When the source hedges or when you\'re reading between the lines'],
          ['Method attribution', '"Using survey data, Smith found..." / "In a 2019 study, Jones measured..."', 'When the how of the finding matters to your argument'],
        ]}
      />

      <Callout kind="watch-for">
        The verb you choose in a signal phrase carries meaning. "Smith argues" (active, committed position) differs from "Smith suggests" (hedged, tentative) and from "Smith acknowledges" (conceding a point to your side). Choose verbs that accurately characterize the source's stance. Using "argues" when the source presents neutral data misrepresents the source — which weakens your credibility.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Quoting vs. Paraphrasing vs. Summarizing</Typography>

      <GuideTable
        headers={['Method', 'When to use it', 'How to do it correctly']}
        rows={[
          ['Direct quotation', 'The exact wording is essential — for precise language, literary analysis, or when the source says it better than you could paraphrase', 'Quotation marks + cite page number + signal phrase + explanation afterward'],
          ['Paraphrase', 'You want the specific idea but not the exact words; useful for most evidence in research papers', 'Fully restate in your own syntax and vocabulary — don\'t just swap synonyms; cite author and page'],
          ['Summary', 'You need the main point of a longer passage; establishes context or background', 'Condense the key claim in 1–3 sentences; don\'t include supporting detail unless essential; cite'],
        ]}
      />

      <Callout kind="in-plain-words">
        Patchwriting — the most common plagiarism mistake — looks like paraphrasing but isn't. It replaces individual words with synonyms while keeping the sentence structure intact. "Researchers have discovered that adolescent anxiety is elevated during heavy social media use" → patchwriting: "Scientists have found that teenage stress rises during intense social network engagement." The structure is copied; only the vocabulary changed. True paraphrase rewrites the idea entirely in your own syntax.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Research Paper Structure</Typography>

      <MermaidDiagram chart={`flowchart TD
  A["Introduction\n(Hook → Context → Thesis)"] --> B["Body ¶1\n(First major claim + evidence + analysis)"]
  B --> C["Body ¶2\n(Second major claim + evidence + analysis)"]
  C --> D["Body ¶3\n(Third major claim + evidence + analysis)"]
  D --> E["Counterargument ¶\n(Strongest opposing view → rebuttal)"]
  E --> F["Conclusion\n(Restate thesis → broaden significance → final insight)"]`} />

      <Callout kind="try-this">
        Before writing your introduction, write your conclusion first. Knowing where you're ending tells you how to frame the beginning. Then draft your body paragraphs. Write the introduction last — that way, you know exactly what your essay argues and can introduce it precisely rather than vaguely gesturing at a topic.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Annotated Bibliography</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        An annotated bibliography is a Works Cited list where each entry is followed by a 3–5 sentence annotation. Each annotation answers three questions: What does this source argue? How credible is it? How does it relate to your specific research question?
      </Typography>

      <Box sx={{ p: 2, my: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, fontSize: '0.88rem', lineHeight: 1.9 }}>
        <strong>MLA entry:</strong> Morrison, Toni. <em>Beloved</em>. Plume, 1987.<br /><br />
        <strong>Annotation:</strong> In this novel, Morrison explores the psychological devastation of slavery through the story of Sethe, a former slave haunted by the ghost of her dead daughter. The work argues that slavery's trauma does not end with legal emancipation — it persists in memory, body, and community. As a Pulitzer Prize-winning novel by a Nobel laureate who drew extensively on historical research, this is a highly credible primary source for analyzing how literature represents historical trauma. It will anchor my analysis of how narrative form (nonlinear time, fragmented perspective) enacts the traumatic experience it describes.
      </Box>

      <Callout kind="coachs-note">
        The annotation's most important sentence is the last one: how does this source fit your specific argument? That sentence proves you've thought about the source in relation to your thesis, not in isolation. Research papers fail when sources are just quoted without being connected to the writer's own argument. The annotated bibliography forces you to make that connection explicitly before you write a single body paragraph.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Three-Part Evidence Formula</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every piece of evidence in a research paper needs three elements: introduction (signal phrase), presentation (quote or paraphrase), and analysis (your explanation). An evidence sandwich missing any part is incomplete.
      </Typography>

      <GuideTable
        headers={['Element', 'What it does', 'Example']}
        rows={[
          ['Introduce', 'Names the source and frames the evidence\'s relevance', '"In a 2022 meta-analysis of 47 studies, Huang and colleagues found..."'],
          ['Present', 'Delivers the actual evidence', '"...that passive social media use — scrolling without posting — increased anxiety scores significantly more than active use" (Huang et al. 2022, p. 144).'],
          ['Analyze', 'Connects the evidence back to your claim; explains why it matters', '"This distinction between passive and active use is crucial: the harm is not social media itself, but the specific behavior of consuming others\' curated lives without engaging — a one-way mirror that amplifies comparison without enabling connection."'],
        ]}
      />

      <Callout kind="make-it-stick">
        Many students cut the analysis step short. "This shows that social media causes anxiety" is not analysis — it restates the evidence without adding insight. True analysis explains the mechanism, connects to the thesis, or extends the implication. Ask: "Why does this evidence matter? What would be missing from my argument without it?" Answer those questions and you have real analysis.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Language & Conventions
// ─────────────────────────────────────────────────────────────────────
function Section6Language() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Language & Conventions: Rules of a Game You Play Every Day</Typography>

      <Analogy title="Grammar is the rules of the game">
        Every game has rules — not because rule-following is fun in itself, but because shared rules make
        play possible. If you break a rule in chess, you don't get to finish the game. Grammar works the
        same way: the conventions of standard written English are the shared rules that make communication
        precise and predictable. Understanding the rules lets you break them intentionally and effectively
        — the way a poet uses fragments for rhythm or a novelist writes run-ons to mimic panic.
        Ignorance of the rules just looks like error.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Sentence Types</Typography>

      <GuideTable
        headers={['Type', 'Structure', 'Example']}
        rows={[
          ['Simple', 'One independent clause', '"She studied."'],
          ['Compound', 'Two or more independent clauses joined by FANBOYS or semicolon', '"She studied, and she passed."'],
          ['Complex', 'One independent + one or more dependent clauses', '"Although she was nervous, she passed."'],
          ['Compound-complex', 'Two+ independent + one+ dependent clause', '"Although she was nervous, she studied hard, so she passed."'],
        ]}
      />

      <Callout kind="in-plain-words">
        FANBOYS = For, And, Nor, But, Or, Yet, So. These are the seven coordinating conjunctions.
        They join independent clauses in compound sentences and need a comma before them.
        "She studied and passed" has no comma because "passed" is not its own independent clause —
        there's no second subject. "She studied, and she passed" has a comma because both sides have subjects.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Common Sentence-Level Errors</Typography>

      <MermaidDiagram chart={`graph TD
  E["Sentence-Level Errors"] --> CS["Comma Splice\nTwo independent clauses joined\nby comma alone"]
  E --> FR["Fragment\nA group of words lacking\na subject or complete verb"]
  E --> RO["Run-On\nTwo independent clauses\nwith no punctuation between"]
  E --> SV["Subject-Verb\nAgreement Error\nVerb doesn't match\nits subject in number"]
  CS --> CS1["Fix: add conjunction,\nuse semicolon, or separate sentences"]
  FR --> FR1["Fix: add missing subject/verb\nor attach to nearby sentence"]
  RO --> RO1["Fix: add comma + conjunction,\nsemicolon, or period"]
  SV --> SV1["Fix: identify the true subject,\nignoring prepositional phrases"]`} />

      <GuideTable
        headers={['Error type', 'Example (wrong)', 'Correction']}
        rows={[
          ['Comma splice', '"She studied, she passed."', '"She studied, and she passed." OR "She studied; she passed."'],
          ['Fragment', '"Although she studied hard."', '"Although she studied hard, she still felt nervous."'],
          ['Run-on', '"She studied she passed."', '"She studied, so she passed."'],
          ['S-V agreement', '"The group of students are arguing."', '"The group of students is arguing." (group = singular)'],
          ['Dangling modifier', '"Running to the bus, the rain began."', '"Running to the bus, she got caught in the rain."'],
          ['Misplaced modifier', '"She served cake to guests on paper plates."', '"She served cake on paper plates to the guests."'],
        ]}
      />

      <Callout kind="watch-for">
        Subject-verb agreement errors hide when prepositional phrases sit between the subject and verb.
        "The box of chocolates WAS on the counter" — not "were." "Box" is the subject, not "chocolates."
        Cross out everything between the subject and the verb, then check agreement. This catches
        approximately 90% of agreement errors.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Parallel Structure</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Parallel structure requires that items in a series or paired constructions use the same grammatical form.
      </Typography>

      <GuideTable
        headers={['Wrong (broken parallel)', 'Right (parallel)']}
        rows={[
          ['"She likes hiking, to swim, and runs."', '"She likes hiking, swimming, and running."'],
          ['"The job requires patience, skill, and being organized."', '"The job requires patience, skill, and organization."'],
          ['"He was praised for his courage and because he was honest."', '"He was praised for his courage and his honesty."'],
        ]}
      />

      <Callout kind="try-this">
        To check for parallel structure, list the items in a series and label each one's grammatical form.
        Gerund? Infinitive? Noun? If the labels don't all match, you have a parallel structure problem.
        Fix it by converting all items to the same form. Pick whichever form fits naturally and apply it to all.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Commonly Confused Words</Typography>

      <GuideTable
        headers={['Pair', 'Rule', 'Memory trick']}
        rows={[
          ['affect / effect', 'Affect = verb (to influence); Effect = noun (a result)', 'Affect = Action; Effect = End result'],
          ['fewer / less', 'Fewer = countable nouns; Less = uncountable', '"Fewer students" (can count); "less patience" (can\'t count)'],
          ['its / it\'s', 'Its = possessive; It\'s = it is / it has', 'Expand it: if "it is" fits, use it\'s'],
          ['their / there / they\'re', 'Their = possessive; There = place; They\'re = they are', 'They\'re = contraction; Their = ownership; There = here'],
          ['who / whom', 'Who = subject; Whom = object', 'Substitute he/him: if "he" fits, use who; if "him," use whom'],
          ['lay / lie', 'Lay = to place something (takes object); Lie = to recline (no object)', '"I lay the book down." / "I lie down."'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Punctuation: Semicolons, Colons, and Dashes</Typography>

      <GuideTable
        headers={['Mark', 'Function', 'Correct use', 'Common error']}
        rows={[
          ['Semicolon', 'Joins two closely related independent clauses', '"She studied; she passed."', 'Using before a dependent clause: "She failed; because she didn\'t study."'],
          ['Colon', 'Introduces a list, explanation, or quotation after an independent clause', '"She needed three things: time, focus, and coffee."', 'Using after a verb or preposition: "She needed: time, focus, and coffee."'],
          ['Em dash', 'Signals an interruption, parenthetical, or sharp turn in thought', '"She studied for weeks — then forgot her pencil."', 'Using in place of a comma for every parenthetical (overuse)'],
        ]}
      />

      <Callout kind="connect">
        Active voice (subject performs the action) is generally preferred in academic writing because it
        is clearer and more direct. Passive voice (subject receives the action) is appropriate when
        the actor is unknown, irrelevant, or deliberately withheld — as in scientific writing
        ("The samples were analyzed...") or when you want to emphasize the receiver of the action.
        Neither is universally wrong; knowing why you're choosing one over the other is the point.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Pronoun Case: Subjective, Objective, Possessive</Typography>

      <Analogy title="Pronoun case is about which seat the pronoun sits in">
        In a sentence, the subject sits in the driver's seat — it performs the action. The object sits in the passenger seat — it receives the action. The possessive sits in the glove compartment — it owns something. Pronouns change their form based on which seat they occupy. "I" drives; "me" rides along; "my" owns. Putting "me" in the driver's seat is the most common pronoun error.
      </Analogy>

      <GuideTable
        headers={['Case', 'Use', 'Pronouns', 'Example']}
        rows={[
          ['Subjective (Nominative)', 'Subject of a verb — performs the action', 'I, you, he, she, it, we, they, who', '"She and I went to the library." (both are subjects)'],
          ['Objective', 'Object of a verb or preposition — receives the action; follows to/for/with/from', 'me, you, him, her, it, us, them, whom', '"The teacher gave us and them extra time." / "Between you and me..."'],
          ['Possessive', 'Shows ownership', 'my, your, his, her, its, our, their, whose', '"Its cover is torn." (no apostrophe — "its\'" is wrong)'],
        ]}
      />

      <Callout kind="try-this">
        To check subjective vs. objective case in a compound: remove the other person and test it alone. "Give the award to John and I" → Remove "John and": "Give the award to I" — wrong. Use "me." → "Give the award to John and me." This test catches nearly every I/me error. Apply the same logic to he/him, she/her, we/us, who/whom.
      </Callout>

      <GuideTable
        headers={['Common error', 'Wrong', 'Correct', 'Why']}
        rows={[
          ['"I" in object position', '"Between you and I"', '"Between you and me"', '"Between" is a preposition — use objective case after it'],
          ['"Myself" as substitute', '"Contact John or myself"', '"Contact John or me"', '"Myself" is reflexive — only for self-reference ("I did it myself")'],
          ['Who vs. whom', '"Who did you speak to?"', '"Whom did you speak to?"', 'Test: "Did you speak to him?" (him = objective = whom)'],
          ['Pronoun-antecedent agreement', '"Everyone should bring their lunch" (some style guides once required "his or her")', 'Singular "they" is now accepted in formal writing for gender-neutral reference', 'AP, MLA, and APA all accept singular "they"'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Verb Tense Consistency</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Literary analysis and research papers follow different tense conventions. Shifting between them randomly (or mixing tenses without purpose) creates confusion.
      </Typography>

      <GuideTable
        headers={['Writing context', 'Convention', 'Example']}
        rows={[
          ['Literary analysis', 'LITERARY PRESENT (simple present) — characters and events in fiction exist in an eternal present', '"In Chapter 3, Hamlet hesitates to act because he cannot verify the ghost\'s honesty."'],
          ['Historical events in research', 'PAST TENSE — events that happened have a fixed time', '"The Civil War ended in April 1865."'],
          ['Research findings (ongoing)', 'PRESENT TENSE for conclusions that still hold', '"Smith\'s (2022) research shows that passive scrolling increases anxiety."'],
          ['Personal narrative / memoir', 'PAST TENSE for recalled events, PRESENT TENSE for reflections', '"I didn\'t understand then. Now I see that she was protecting me."'],
        ]}
      />

      <Callout kind="watch-for">
        The most common tense error in literary analysis: slipping into past tense mid-essay. "Hamlet considers his options. Claudius was corrupt, so Hamlet decided..." — the sudden past tense suggests the story is over and Claudius no longer corrupt. In literary present, both remain in the eternal now of the text: "Claudius is corrupt; Hamlet decides..."
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Subjunctive Mood</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The subjunctive mood expresses situations that are hypothetical, wished for, contrary to fact, or dependent on conditions — not statements about reality.
      </Typography>

      <GuideTable
        headers={['Subjunctive use', 'Wrong', 'Correct']}
        rows={[
          ['Contrary to fact ("If...were")', '"If I was you, I would reconsider."', '"If I were you, I would reconsider." ("were" regardless of subject)'],
          ['After "that" + demand/suggestion', '"The coach insisted that he runs every drill."', '"The coach insisted that he run every drill." (base form, no -s)'],
          ['Wishes and desires', '"I wish I was taller."', '"I wish I were taller."'],
          ['Formal recommendations', '"The committee recommends that the proposal is accepted."', '"The committee recommends that the proposal be accepted."'],
        ]}
      />

      <Callout kind="in-plain-words">
        The subjunctive uses "were" for all persons (I/you/he/she/we/they) in contrary-to-fact conditionals. In everyday speech, "was" has largely replaced "were," but in academic and formal writing, maintain the distinction. "If I were rich" is correct in formal writing; "if I was rich" is only appropriate in dialogue or informal contexts.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Register and Diction: Matching Tone to Context</Typography>

      <Analogy title="Register is the dress code of language">
        You don't wear the same clothes to a job interview, a beach, and a formal dinner — even though all three are socially acceptable contexts. Language has the same dress codes. Formal academic writing requires precision, objectivity, and explicit hedging ("suggests," "indicates," "the data implies"). Informal writing allows contractions, first person, and casual vocabulary. The skill is knowing which dress code you're in and honoring it intentionally.
      </Analogy>

      <GuideTable
        headers={['Register', 'Features', 'Appropriate contexts']}
        rows={[
          ['Formal academic', 'No contractions; third person preferred; hedged claims; technical vocabulary; passive voice acceptable', 'Research papers, formal essays, lab reports, legal documents'],
          ['Semi-formal', 'First person acceptable; limited contractions; professional vocabulary; direct claims', 'Journalism, business reports, standardized test responses'],
          ['Informal / colloquial', 'Contractions; slang; first person; fragments acceptable for effect; conversational rhythm', 'Personal narratives, creative nonfiction, blogs, personal essays'],
          ['Dialectal / literary voice', 'Deliberate use of non-standard forms for characterization or artistic effect', 'Fiction dialogue, poetry, memoir — where the "error" is the point'],
        ]}
      />

      <Callout kind="coachs-note">
        Code-switching — the ability to move between registers — is a professional skill, not a concession. African American Vernacular English (AAVE), regional dialects, and non-standard varieties are linguistically valid and complex systems, not errors. The skill ELA teaches is not "your home dialect is wrong" — it's "standard academic English is one register you need for specific contexts, alongside the others you already use." Fluency in multiple registers is an asset.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Transitional Devices: Connecting Ideas Within and Between Paragraphs</Typography>

      <GuideTable
        headers={['Relationship', 'Transitional words/phrases']}
        rows={[
          ['Addition', 'Furthermore, Moreover, In addition, Also, Additionally, Not only...but also'],
          ['Contrast', 'However, Nevertheless, On the other hand, Conversely, Despite this, While'],
          ['Cause/Effect', 'Therefore, As a result, Consequently, Thus, Hence, Because of this'],
          ['Comparison', 'Similarly, Likewise, In the same way, Correspondingly'],
          ['Concession', 'Admittedly, Although, Even though, While it is true that, Granted'],
          ['Sequence', 'First, Subsequently, Next, Finally, Meanwhile, Following this'],
          ['Emphasis', 'In particular, Specifically, Most importantly, Above all, Indeed'],
          ['Illustration', 'For example, For instance, To illustrate, Specifically, As an example'],
          ['Conclusion', 'In conclusion, Ultimately, In sum, To summarize, Taken together'],
        ]}
      />

      <Callout kind="make-it-stick">
        Don't begin every paragraph with a transition word — that becomes mechanical. The strongest paragraph transitions embed the connection in the topic sentence itself: "This structural argument is complemented by Lincoln's use of emotional appeal." That sentence both names what came before (structural argument) and previews what comes next (emotional appeal) without using "However" or "Furthermore" at all.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: Speaking & Listening
// ─────────────────────────────────────────────────────────────────────
function Section7Speaking() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Speaking & Listening: The Two-Way Radio</Typography>

      <Analogy title="Communication is a two-way radio">
        A radio that only transmits isn't a communication tool — it's a loudspeaker. Real communication
        requires both sending and receiving. Great presenters aren't just performing; they're reading
        their audience and adjusting. Active listeners aren't passively absorbing; they're processing,
        questioning, and preparing to build on what they've heard. Speaking and listening are not
        opposite skills — they're the same skill, directed in different directions.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Planning a Formal Presentation</Typography>

      <MermaidDiagram chart={`flowchart TD
  A["1. Identify central claim\nand audience"] --> B["2. Gather and evaluate\nsupporting evidence"]
  B --> C["3. Organize: intro, body,\nconclusion"]
  C --> D["4. Create visual aids\nthat support (not replace) your words"]
  D --> E["5. Practice aloud —\ntime yourself"]
  E --> F["6. Revise based on\npractice run"]`} />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Verbal Delivery Techniques</Typography>

      <GuideTable
        headers={['Element', 'Why it matters', 'How to use it effectively']}
        rows={[
          ['Volume', 'Ensures the audience can hear; signals confidence', 'Project to the back of the room; vary for emphasis — louder for key points'],
          ['Pace', 'Controls comprehension; creates emphasis', 'Slow down for complex or important ideas; speed up slightly to create energy'],
          ['Clarity', 'Articulation makes content accessible', 'Open your mouth fully; avoid trailing off at end of sentences'],
          ['Pauses', 'Draw focus and allow audience to absorb key ideas', 'Pause after your most important point — silence signals significance'],
          ['Tone variation', 'Prevents monotony; signals emotional register', 'Vary pitch and energy; a flat voice loses audiences quickly'],
        ]}
      />

      <Callout kind="in-plain-words">
        Speaking rate matters enormously. Most nervous presenters rush — they feel painfully slow while
        actually being perfectly clear to the audience. Practice at the pace that feels uncomfortably slow.
        That is usually the pace that sounds polished and deliberate to listeners. Pause more than you
        think you need to.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Nonverbal Communication</Typography>

      <GuideTable
        headers={['Element', 'What it signals', 'Common mistakes']}
        rows={[
          ['Eye contact', 'Confidence, engagement, connection', 'Looking at the floor, ceiling, or reading from slides entirely'],
          ['Posture', 'Credibility and ownership of the space', 'Slouching, weight-shifting, or closing in physically (crossed arms)'],
          ['Gestures', 'Emphasis and clarity; reinforce spoken points', 'Fidgeting with notes; hands in pockets; repetitive gestures'],
          ['Facial expression', 'Conveys enthusiasm and emotional register', 'Blank face during passionate content; forced smile'],
          ['Movement', 'Energy and ownership of the room', 'Pacing nervously; rooting in one spot stiffly'],
        ]}
      />

      <Callout kind="watch-for">
        Nonverbal contradictions undermine verbal messages. If you say "I'm confident in this data"
        while avoiding eye contact and touching your face repeatedly, the audience reads the nonverbal
        signal — they believe your body, not your words. Alignment between verbal and nonverbal communication
        is what makes a speaker credible.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Active Listening Strategies</Typography>

      <GuideTable
        headers={['Strategy', 'What it looks like']}
        rows={[
          ['Focus on the speaker', 'Eye contact; phone face-down; body oriented toward speaker'],
          ['Note key points', 'Write down main claims and supporting evidence — not everything'],
          ['Ask clarifying questions', '"Did you mean...?" / "Can you explain what you meant by...?"'],
          ['Suspend judgment', 'Listen to understand the argument before evaluating it'],
          ['Track the claim-evidence structure', 'Identify what the speaker is arguing and what supports it'],
          ['Notice what\'s NOT said', 'What evidence is missing? What counterarguments weren\'t addressed?'],
        ]}
      />

      <Callout kind="why-it-matters">
        Most people think they are better listeners than they are. Research consistently shows that people
        retain only 25–50% of what they hear immediately after hearing it. Active listening is a discipline,
        not a passive state. The strategies above are habits that require deliberate practice, not just
        good intentions.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Socratic Seminar Participation</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A Socratic seminar is a student-led discussion of an open-ended question, grounded in a shared
        text. The goal is collaborative inquiry — building understanding together — not winning a debate.
      </Typography>

      <GuideTable
        headers={['Strong participation looks like', 'Weak participation looks like']}
        rows={[
          ['"Building on what Sofia said, I think the author also implies..."', '"I think X." (ignoring prior speakers)'],
          ['"What do others think about the author\'s use of...?"', 'Dominating with multiple long turns'],
          ['"The text says on line 12... which supports..."', 'Making claims without textual evidence'],
          ['"I understand that point, but the evidence in paragraph 3 complicates it..."', 'Repeating your point louder when challenged'],
          ['Inviting a quieter participant: "Marcus, what do you think?"', 'Only responding to the teacher'],
        ]}
      />

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Using Multimedia Effectively</Typography>

      <MermaidDiagram chart={`graph LR
  A["Multimedia in Presentations"] --> B["Visual slides\n(charts, images, key terms)"]
  A --> C["Video clips\n(brief — illustrate, don't replace)"]
  A --> D["Audio\n(primary source recordings, music)"]
  A --> E["Data visualizations\n(graphs, infographics)"]
  B --> B1["Rule: slides support speech,\nnot substitute for it"]
  C --> C1["Rule: under 90 seconds;\ndebrief immediately after"]
  D --> D1["Rule: clear audio;\ntranscript or context provided"]
  E --> E1["Rule: explain what the\ndata shows — don't assume it speaks for itself"]`} />

      <Callout kind="try-this">
        Before adding a slide, ask: "Does this visual help the audience understand my point better than
        words alone?" If the answer is no, cut it. If yes, design it to be read at a glance —
        no paragraphs on slides. A slide is a visual anchor for your spoken words, not a teleprompter.
        The audience should be listening to you, not reading behind you.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Evaluating a Speaker's Argument</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Listening critically means analyzing the argument, not just enjoying or disliking the delivery.
        Use this checklist:
      </Typography>

      <GuideTable
        headers={['Evaluation question', 'Why it matters']}
        rows={[
          ['What is the speaker\'s central claim?', 'You can\'t evaluate an argument you haven\'t clearly identified'],
          ['What evidence is provided, and is it credible?', 'Evidence type and quality determine argument strength'],
          ['Which rhetorical appeals are used?', 'Identifying ethos/logos/pathos helps you see how the speaker is trying to persuade'],
          ['Are there logical fallacies?', 'Fallacies invalidate reasoning even when conclusions feel right'],
          ['What counterarguments weren\'t addressed?', 'Gaps reveal the limits of the argument'],
          ['Does the evidence logically lead to the conclusion?', 'The warrant — the logical bridge — must be valid'],
        ]}
      />

      <Callout kind="make-it-stick">
        The three questions that separate a critical listener from a passive one: (1) What is the claim?
        (2) What is the evidence? (3) Does the evidence actually support the claim — or does it just feel
        like it does? If you train yourself to ask those three questions every time you hear an argument,
        you will become nearly impossible to manipulate.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Preparing for a Formal Debate</Typography>

      <Analogy title="A debate is like a chess match played with words">
        A chess player doesn't just know their own moves — they anticipate their opponent's. The best debaters do the same: they prepare their own strongest arguments AND the strongest version of the opposing arguments. If you understand why a reasonable person would disagree with you, you can answer their objections before they raise them — and you'll never be blindsided. Preparation beats spontaneity in formal debate.
      </Analogy>

      <GuideTable
        headers={['Debate element', 'What it is', 'Strategy']}
        rows={[
          ['Constructive speech', 'Your team\'s opening argument — lays out your full case', 'Lead with your strongest argument; establish clear claim/evidence/reasoning structure; preview your other points'],
          ['Cross-examination', 'Questions posed to the opposing team after their speech', 'Aim to expose weaknesses, force concessions, or clarify claims that work against them; ask yes/no questions strategically'],
          ['Rebuttal', 'Direct response to arguments raised by the opposition', 'Prioritize — you can\'t answer everything; attack the strongest points, not the weakest; provide counter-evidence, not just denial'],
          ['Flowing (note-taking)', 'The technique of tracking both sides\' arguments column by column as the debate unfolds', 'Organize by argument, not chronology — makes it easy to see which claims have been answered and which are "dropped"'],
        ]}
      />

      <Callout kind="why-it-matters">
        Formal debate teaches you to do three things simultaneously: listen carefully, evaluate logic, and formulate a response — all under time pressure. These are the core skills of legal argument, negotiation, academic discourse, and civic participation. You're not learning to "win arguments" — you're learning to think rigorously under pressure and communicate that thinking clearly.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Discussion Facilitation and Collaborative Inquiry</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Sometimes the speaking/listening role is facilitation — guiding a discussion rather than advocating a position. Facilitators prioritize the group's thinking over their own opinions.
      </Typography>

      <GuideTable
        headers={['Facilitation move', 'Example language']}
        rows={[
          ['Opening a discussion', '"What strikes you most about...?" / "What question does this text leave you with?"'],
          ['Drawing out quieter voices', '"Marcus, we haven\'t heard from you — what do you think about what Sofia just said?"'],
          ['Deepening a point', '"Can you say more about that?" / "What evidence from the text supports that?"'],
          ['Navigating disagreement', '"So we have two positions here — one that says X, and one that says Y. What would it take to resolve that?"'],
          ['Synthesizing', '"I\'m hearing a few threads — would it be fair to say the group agrees on X but diverges on Y?"'],
          ['Bringing it back to the text', '"We\'re getting into interesting territory — can we anchor that in the text? Where specifically does the author...?"'],
        ]}
      />

      <Callout kind="try-this">
        Practice the "wait" move: after asking a discussion question, stay silent for a full five seconds before calling on someone. Most facilitators jump in after two seconds because silence feels awkward. But five seconds is enough for people to formulate a real thought. The ideas that emerge from five-second silence are almost always more considered than the first thing someone says to fill a two-second pause.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Giving and Receiving Presentation Feedback</Typography>

      <GuideTable
        headers={['Feedback type', 'Weak version', 'Strong version']}
        rows={[
          ['General praise', '"Good job!"', '"Your pace was well-controlled, and pausing after the key statistic in the third paragraph was particularly effective."'],
          ['General criticism', '"I couldn\'t follow it."', '"The transition between the second and third points was unclear — I wasn\'t sure how the second point connected to your central claim."'],
          ['Specific suggestion', '"Be louder."', '"Try projecting to the last row — I could hear you well in the middle, but your volume dropped when you looked at your notes."'],
          ['Content feedback', '"Your examples were good."', '"The Gettysburg Address example worked well for anaphora — a second example from a contrasting context (e.g., advertising) would have broadened the application."'],
        ]}
      />

      <Callout kind="make-it-stick">
        The best feedback follows the "warm, cool, warm" pattern. Start with a genuine strength (warm). Give a specific, actionable suggestion (cool). Close with forward-looking encouragement (warm). This structure is not just social nicety: the opening warm helps the receiver stay open rather than defensive, and the closing warm reminds them that growth is possible. Feedback that begins with criticism activates defensiveness before the useful information even arrives.
      </Callout>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Listening Across Difference</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        English 3 includes texts and discussions that bring multiple cultural perspectives — American literature from marginalized communities, nonfiction about contested social issues, and seminal documents with complicated legacies. Listening across difference requires a specific set of practices.
      </Typography>

      <GuideTable
        headers={['Practice', 'What it looks like']}
        rows={[
          ['Charitable interpretation', 'Assume the most reasonable version of what someone is saying before critiquing it; don\'t respond to the worst-case reading'],
          ['Separating argument from speaker', 'Evaluate the claim on its merits, not based on your feelings about the person making it'],
          ['Acknowledging unfamiliarity', '"I\'m not familiar with that context — can you help me understand?"'],
          ['Distinguishing disagreement from dismissal', '"I see it differently" starts dialogue; "That\'s just wrong" ends it'],
          ['Noticing whose voices are centered', 'Who speaks most in the room? Whose silence is never noticed? Active listening includes noticing the meta-conversation'],
        ]}
      />

      <Callout kind="connect">
        The rhetorical concept of "presumption" — the burden of proof rests on whoever is challenging the status quo — is worth examining when listening across difference. If someone describes an experience that contradicts your own, the response "that doesn't match my experience" reverses the burden unfairly. An experience isn't a universal claim; your lack of that experience doesn't disprove theirs. Listening generously means holding your own experience lightly when encountering experiences different from your own.
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>English 3 Exam-Day Strategy</Typography>

      <Callout kind="coachs-note">
        English assessments test how you think, not just what you know. You can't memorize your way through
        a reading passage you've never seen — but you can apply strategies reliably. These strategies work
        because they match how English tests are designed.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Read the questions before the passage</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For reading comprehension passages, scan the questions first. You'll read the passage knowing
        what to look for — which saves time and improves accuracy. You're not reading to absorb everything;
        you're reading with a purpose.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>On literary analysis questions: device → effect → meaning</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        When asked about a literary device, never stop at identification. The test wants you to explain
        WHY the author used it. Always connect the device to its effect and then to the larger meaning
        of the passage. "The metaphor comparing the city to a machine creates a dehumanizing tone,
        suggesting that industrial society strips individuals of their identity."
      </Typography>

      <Callout kind="watch-for">
        The most common errors on ELA tests: (1) Confusing tone (author's attitude) with mood (reader's
        feeling). (2) Confusing theme (statement about the subject) with subject (just a noun). (3) Calling
        a semicolon correct before a dependent clause. (4) Choosing pathos answers when the question asks
        about logos. (5) Treating "more recent" as automatically "more credible."
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>On argument questions: follow the evidence</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Argument questions often ask whether evidence supports a claim, or which answer choice identifies
        a logical fallacy. For fallacy questions, test each answer choice against the definition: Is someone
        being attacked personally (ad hominem)? Are only two options presented (false dichotomy)? Is a tiny
        sample being generalized (hasty generalization)?
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Process of elimination on grammar questions</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        For language and conventions questions, read each option aloud (in your head). Your ear often
        catches agreement errors, misplaced modifiers, and comma splices faster than your analytical mind does.
        Then verify with the rule. Eliminate options that violate clear rules before deciding between
        remaining choices.
      </Typography>

      <Callout kind="make-it-stick">
        For multi-select questions ("select ALL that apply"): treat each option as a separate true/false
        question. Don't try to evaluate them relative to each other. Ask "Is this one true on its own?"
        for each option independently. Most students make errors on multi-select by overthinking the
        relationship between options rather than evaluating each individually.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>For written responses: thesis first, every time</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        If you're asked to write a response, lead with your claim. Graders read dozens of papers and
        quickly identify essays that bury the thesis in paragraph 3. State your position in the first
        two sentences. Then support it with specific textual evidence and explanation. Close by
        connecting the analysis back to the broader significance.
      </Typography>

      <Callout kind="connect">
        The three-part evidence formula for written responses: (1) Signal phrase + quote or paraphrase.
        (2) Explanation of what the evidence shows. (3) Connection back to your thesis. If you can do
        this three times with three different pieces of evidence, you have a complete body paragraph.
        Repeat the pattern for each paragraph.
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>English 3 Glossary</Typography>
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
