// USHC Study Guide — accordion-based layout for SC's U.S. History and the
// Constitution course (and EOCEP). Each section is collapsible; the first
// is open by default. Content uses shared MUI components — Callout (HS-only),
// Analogy, GuideTable, SectionQuiz — so no special CSS wrapper is needed.

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

const READING_PROGRESS_KEY = 'exam-prep-reading:USHC';
const COMPLETION_KEY = 'exam-prep-completed:USHC';
// Section-quiz storage is separate from drillStats. Quizzes are quick recall
// checks and don't influence the readiness signal.
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:USHC';

// Maps each non-exempt section to a question-bank subdomain. Sections in this
// map get a SectionQuiz at the end pulling 3–4 questions from that subdomain.
const SECTION_SUBDOMAINS: Record<string, string> = {
  s2:  'Foundations & Constitution',
  s3:  'Reconstruction',
  s4:  'Industrialization & Gilded Age',
  s5:  'Progressive Era',
  s6:  'World War I & 1920s',
  s7:  'Great Depression & New Deal',
  s8:  'World War II',
  s9:  'Cold War & Containment',
  s10: 'Civil Rights Movement',
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
  { id: 's1',       num: '1',  title: 'The Big Picture',                icon: '🗺️' },
  { id: 's2',       num: '2',  title: 'Foundations & Constitution',     icon: '📜' },
  { id: 's3',       num: '3',  title: 'Reconstruction',                 icon: '🔨' },
  { id: 's4',       num: '4',  title: 'Industrialization & Gilded Age', icon: '🏭' },
  { id: 's5',       num: '5',  title: 'Progressive Era',                icon: '⚖️' },
  { id: 's6',       num: '6',  title: 'World War I & 1920s',            icon: '🌍' },
  { id: 's7',       num: '7',  title: 'Great Depression & New Deal',    icon: '📉' },
  { id: 's8',       num: '8',  title: 'World War II',                   icon: '🛩️' },
  { id: 's9',       num: '9',  title: 'Cold War & Containment',         icon: '☢️' },
  { id: 's10',      num: '10', title: 'Civil Rights Movement',          icon: '✊' },
  { id: 's-court',  num: '⚖️', title: 'Supreme Court Landmark Cases',    icon: '⚖️' },
  { id: 's-pres',   num: '🏛️', title: 'Presidents Quick Reference',      icon: '🏛️' },
  { id: 's-amend',  num: '📜', title: 'Constitutional Amendments Quick Reference', icon: '📜' },
  { id: 's-acts',   num: '📋', title: 'Significant Acts of Congress (Quick Reference)', icon: '📋' },
  { id: 's-strat',  num: '★',  title: 'EOCEP Exam-Day Strategy',        icon: '🎯' },
  { id: 's-gloss',  num: '📚', title: 'Glossary',                       icon: '📚' },
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
// Real US history content. Mixed Callout kinds (curriculum context, not
// cert-prep framing). Analogies open conceptual sections. Mermaid diagrams
// where a timeline or causal chain helps.
// ──────────────────────────────────────────────────────────────────────

function SectionContent({ id }: { id: string }) {
  switch (id) {
    case 's1':       return <Section1BigPicture />;
    case 's2':       return <Section2Foundations />;
    case 's3':       return <Section3Reconstruction />;
    case 's4':       return <Section4Industrialization />;
    case 's5':       return <Section5Progressive />;
    case 's6':       return <Section6WWI />;
    case 's7':       return <Section7NewDeal />;
    case 's8':       return <Section8WWII />;
    case 's9':       return <Section9ColdWar />;
    case 's10':      return <Section10CivilRights />;
    case 's-court':  return <SectionSupremeCourt />;
    case 's-pres':   return <SectionPresidents />;
    case 's-amend':  return <SectionAmendments />;
    case 's-acts':   return <SectionActsOfCongress />;
    case 's-strat':  return <SectionStrategy />;
    case 's-gloss':  return <SectionGlossary />;
    default:         return null;
  }
}

// ── Section 1: Big Picture ────────────────────────────────────────────
function Section1BigPicture() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        U.S. History from the Constitution to today is a story of <strong>who gets included</strong> in the American
        promise — and how the country argues, fights, legislates, and sometimes goes to war over the answer. Every
        era we cover is a chapter in that argument: the Constitution writes down the promise; Reconstruction tries
        to extend it after the Civil War; the Gilded Age tests whether industrial wealth and democratic equality can
        coexist; the New Deal redefines what the federal government owes its citizens; the Civil Rights movement
        finally forces the law to keep the promise the 14th Amendment made in 1868.
      </Typography>

      <Analogy title="History as an argument the country keeps having">
        Imagine a family that wrote down its values 250 years ago and has been arguing about how to live up to them
        ever since. Each generation reinterprets the original document under new pressures — industrialization,
        depression, war, technological change — and either expands or contracts who gets full membership in the
        family. Every era you'll study is another round of that argument.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        How to use this guide
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Each era section has the same shape: a short context paragraph, an analogy that connects the era to
        something you already understand, the key people and events, a callout or two flagging traps and connections,
        and a "quick check" at the bottom — 3 or 4 questions pulled from the practice bank so you can verify the
        ideas landed. The quick check is formative; it doesn't move your Diagnostic readiness number. Take it
        freely.
      </Typography>

      <Callout kind="why-it-matters">
        The U.S. History EOCEP counts <strong>20% of your final course grade</strong> in South Carolina. That's not
        decorative — a student with a 90 average and a 50 EOCEP ends up with about an 82 final. Treating this exam
        as low-stakes is the most expensive mistake you can make. The good news: it's a well-defined test, and steady
        study from now to test day is enough.
      </Callout>

      <Callout kind="coachs-note">
        Don't try to memorize every fact in the textbook — that's not how the EOCEP scores. It rewards understanding
        cause-and-effect chains (why did Reconstruction collapse?), being able to read primary-source excerpts (what
        is this letter from FDR arguing for?), and connecting events to constitutional principles (which amendment
        does this conflict trigger?). Practice that kind of thinking, not flashcard recall.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The arc at a glance
      </Typography>
      <MermaidDiagram
        chart={`
timeline
    title U.S. History eras covered on the EOCEP
    1787  : Constitutional Convention
    1865  : Civil War ends, Reconstruction begins
    1877  : Compromise of 1877 ends Reconstruction
    1900  : Gilded Age peak, Progressive Era begins
    1917  : U.S. enters WWI
    1929  : Stock Market Crash, Great Depression begins
    1933  : FDR inaugurated, New Deal begins
    1941  : Pearl Harbor, U.S. enters WWII
    1947  : Truman Doctrine, Cold War begins
    1954  : Brown v. Board of Education
    1965  : Voting Rights Act
    1991  : Soviet Union dissolves, Cold War ends
        `}
      />
    </Box>
  );
}

// ── Section 2: Foundations & Constitution ────────────────────────────
function Section2Foundations() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The Constitution didn't appear fully formed in 1787. It was the SECOND attempt — a response to the failure
        of the <strong>Articles of Confederation</strong> (1781–89), which had created a federal government too weak
        to tax, raise an army, or settle disputes between states. <strong>Shays' Rebellion</strong> in 1786–87 —
        an armed uprising of Massachusetts farmers protesting debt and taxes — exposed the problem in vivid terms:
        the federal government couldn't help put it down. Massachusetts had to do it alone. The Constitutional
        Convention met in Philadelphia the next summer.
      </Typography>

      <Analogy title="Articles → Constitution as a software rewrite">
        The Articles of Confederation were version 1.0 of the U.S. government — shipped fast, missing critical
        features (no tax engine, no executive, no enforcement mechanism), and crashing under load (Shays'). The
        Constitution was version 2.0: same goal, far stronger architecture. Three independent branches (legislative,
        executive, judicial) check each other. Powers are split between the federal government and the states.
        Amendments provide an update mechanism. Most of the 1.0 design got replaced.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Three core principles
      </Typography>
      <GuideTable
        headers={['Principle', 'What it means', 'Why it was new']}
        rows={[
          ['Federalism', 'Power split between national government and the states.', 'Most countries had one central government. The Founders distrusted concentrated power.'],
          ['Separation of powers', 'Legislative writes laws, executive enforces, judicial interprets.', 'Britain mixed monarch + parliament; the Founders wanted distinct, jealous-of-each-other branches.'],
          ['Checks and balances', 'Each branch can limit the others.', 'Without this, separation alone wouldn\'t prevent tyranny — one branch would absorb the others.'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>The "Three E's" of constitutional safeguards:</strong> Election (citizens choose representatives),
        Enumeration (the Constitution lists what powers the federal government has — anything not listed stays with
        the states or the people, per the 10th Amendment), and Equality of branches (no branch is supreme; each can
        check the others). When a question asks about "limited government," it's pointing at one of these three.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Bill of Rights
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The Bill of Rights (first 10 amendments, ratified 1791) was the price the Federalists paid to get the
        Constitution ratified. Anti-Federalists (Patrick Henry, George Mason) refused to support the document
        without explicit protections for individual liberty. Madison drafted them. The most exam-relevant: 1st
        (speech, religion, press, assembly, petition), 4th (search and seizure), 5th (due process, self-incrimination),
        6th (jury trial, counsel), 8th (cruel and unusual punishment), 10th (powers not delegated to the federal
        government stay with the states or people).
      </Typography>

      <Analogy title="Bill of Rights as a contract addendum">
        The original Constitution is the main contract — it sets up the structure of the federal government. The
        Bill of Rights is the addendum the Anti-Federalists demanded before they'd sign: "Add these protections for
        individuals before we agree to the main deal." Like a renter insisting on a no-eviction-without-cause clause
        before signing a lease. The addendum isn't an afterthought — it's the price of getting the main contract
        ratified at all.
      </Analogy>

      <Callout kind="watch-for">
        <strong>The Bill of Rights originally applied ONLY to the federal government.</strong> States could (and
        often did) restrict speech, search citizens without warrants, or run established churches well into the 1800s.
        The 14th Amendment (1868) plus a long series of Supreme Court "incorporation" cases over the 20th century
        is what eventually made the Bill of Rights binding on state and local governments. Easy EOCEP trap.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Compromises that built the original Constitution
      </Typography>
      <GuideTable
        headers={['Compromise', 'The disagreement', 'The resolution']}
        rows={[
          ['Great (Connecticut) Compromise', 'Big states wanted representation by population; small states wanted equal representation.', 'Bicameral Congress: House by population, Senate equal (2 per state).'],
          ['Three-Fifths Compromise', 'Southern states wanted enslaved people counted for representation; Northern states said no.', 'Each enslaved person counted as 3/5 of a person for both representation and direct taxation.'],
          ['Slave trade compromise', 'Some delegates wanted to abolish the international slave trade immediately; Southern states refused.', 'Congress could not ban the trade until 1808.'],
        ]}
      />

      <Callout kind="connect">
        The Three-Fifths Compromise gave Southern states roughly a third more House seats and electoral votes than
        their free population alone would have justified. That bloc — sometimes called the "slave power" by 19th-
        century critics — shaped American politics for 70 years, from the Missouri Compromise through Dred Scott to
        the Civil War. The 13th Amendment finally ended both slavery and the Three-Fifths math in 1865.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Marbury v. Madison and judicial review
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Article III of the Constitution created the Supreme Court but said almost nothing about its power. In
        <strong> Marbury v. Madison (1803)</strong>, Chief Justice <strong>John Marshall</strong> declared that the
        Court could strike down federal laws as unconstitutional. This is <strong>judicial review</strong> — the
        foundation of the Court's modern authority. Without Marbury, every later landmark ruling (Brown, Roe,
        Obergefell, Citizens United) would lack legal grounding.
      </Typography>
    </Box>
  );
}

// ── Section 3: Reconstruction ────────────────────────────────────────
function Section3Reconstruction() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Reconstruction (1865–77) was the federal government's attempt to rebuild the South after the Civil War and
        determine the status of nearly 4 million newly-freed people. It produced the most consequential constitutional
        amendments since the Bill of Rights — the <strong>13th</strong> (abolishing slavery), <strong>14th</strong>
        (citizenship and equal protection), and <strong>15th</strong> (voting rights regardless of race). It also
        ended in catastrophic failure: by 1877, federal commitment had collapsed and Southern states were free to
        construct the Jim Crow system that would last nearly a century.
      </Typography>

      <Analogy title="Reconstruction as a re-onboarding that got abandoned halfway">
        Think of Reconstruction as a new employee onboarding program for 4 million people who'd been excluded from
        full citizenship. The 13/14/15 Amendments are the employment contract. The Freedmen's Bureau was HR. Federal
        troops were the security team enforcing the rules. Then in 1877 the company decided onboarding was too
        expensive and pulled out — leaving the new employees with a contract on paper but no enforcement and an
        increasingly hostile workplace. That's Jim Crow.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The Reconstruction Amendments
      </Typography>
      <GuideTable
        headers={['Amendment', 'Year', 'What it did', 'Why it still matters']}
        rows={[
          ['13th', '1865', 'Abolished slavery and involuntary servitude (except as punishment for a crime).', 'Ended the legal basis for slavery. The "punishment exception" became a loophole for convict-leasing in the late 1800s.'],
          ['14th', '1868', 'Birthright citizenship. Equal protection of the laws. Due process AGAINST STATE governments.', 'The most-litigated amendment in U.S. history. Foundation for Brown, Loving, Obergefell, and most civil rights cases.'],
          ['15th', '1870', 'No denial of vote based on race, color, or previous condition of servitude.', 'Foundational but toothless without enforcement — Southern states found a hundred workarounds. Took the 1965 Voting Rights Act to give it teeth.'],
        ]}
      />

      <Callout kind="make-it-stick">
        <strong>"13-14-15: Free / Equal / Vote."</strong> Three amendments, three rights. 13 freed enslaved people.
        14 made them citizens with equal protection. 15 said race couldn't bar them from voting. Memorize this and
        you'll never confuse them on the EOCEP. The order matches the urgency: first freedom, then citizenship, then
        the ballot.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        How Reconstruction unraveled
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[1865 Civil War ends, 13th Amendment ratified] --> B[1866-67 Black Codes in Southern states]
    B --> C[1868 14th Amendment ratified to override Black Codes]
    C --> D[1870 15th Amendment ratified, federal troops occupy South]
    D --> E[1870s Ku Klux Klan violence, Northern war fatigue]
    E --> F[1876 Disputed Hayes-Tilden election]
    F --> G[1877 Compromise of 1877 - troops withdraw, Reconstruction ends]
    G --> H[1880s-1965 Jim Crow segregation, Plessy v. Ferguson 1896]
        `}
      />

      <Callout kind="why-it-matters">
        Reconstruction's collapse is the most consequential domestic-policy failure in U.S. history. The 14th and
        15th Amendments were textually clear — citizenship and the vote regardless of race. But the federal
        government walked away from enforcement after 1877, and it took until 1954 (Brown) and 1964–65 (Civil Rights
        Act and Voting Rights Act) for those amendments to mean what they say. Three generations of Black Americans
        lived under formal legal segregation. The EOCEP will test that you understand this gap between text and
        enforcement.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Plessy v. Ferguson (1896)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Homer Plessy, a Louisiana man classified as 1/8 Black under state law, deliberately sat in a "whites only"
        railroad car to challenge a segregation statute. The Supreme Court ruled 7–1 that segregation was
        constitutional as long as facilities were "separate but equal." In practice, facilities were never equal —
        Black schools received a fraction of the per-pupil funding of white schools, Black hospitals were
        catastrophically under-resourced, and so on. Plessy gave Jim Crow legal armor for 58 years until Brown v.
        Board overturned it in 1954.
      </Typography>

      <Callout kind="watch-for">
        Don't confuse the <strong>Black Codes</strong> (post-Civil-War Southern laws restricting freedmen) with
        <strong> Jim Crow</strong> (the broader segregation system after Reconstruction). Black Codes came first
        (1865–66), provoked the 14th Amendment, and were technically illegal afterward. Jim Crow came after
        Reconstruction collapsed (1877+) and used different mechanisms — segregation, literacy tests, poll taxes —
        that the Plessy Court ruled were constitutional. The EOCEP often pairs these as wrong-answer options.
      </Callout>
    </Box>
  );
}

// ── Section 4: Industrialization & Gilded Age ────────────────────────
function Section4Industrialization() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Between the end of the Civil War and 1900, the U.S. went from being mostly agrarian to being the world's
        largest industrial economy. Steel, oil, railroads, and electricity reshaped daily life. Cities exploded —
        New York, Chicago, Pittsburgh tripled or quadrupled in size. <strong>22 million immigrants</strong>, mostly
        from Southern and Eastern Europe, arrived between 1880 and 1920. And a small number of industrialists —
        Rockefeller, Carnegie, Morgan, Vanderbilt — accumulated wealth on a scale no Americans had ever seen.
        Mark Twain called the era the "Gilded Age" — gold on the surface, rot underneath.
      </Typography>

      <Analogy title="The Gilded Age as Silicon Valley with smokestacks">
        Imagine a 30-year stretch where a handful of founders captured most of the economic gains from a new
        general-purpose technology (then: steel, oil, rail. now: software, networks, AI). They built genuine value,
        but also crushed competitors with predatory tactics, lobbied governments into favorable rules, and pulled
        wealth share away from the workers who actually built the stuff. Sound familiar? That's the Gilded Age —
        same structural story, different machinery.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The big four industrialists
      </Typography>
      <GuideTable
        headers={['Person', 'Industry', 'Tactic']}
        rows={[
          ['John D. Rockefeller', 'Oil — Standard Oil', 'Horizontal integration. Bought out or undercut every refiner. At peak: 90% of U.S. oil refining.'],
          ['Andrew Carnegie', 'Steel — Carnegie Steel', 'Vertical integration. Owned the mines, the railroads, the mills, and the ships. Eventually sold to J.P. Morgan, forming U.S. Steel — the first billion-dollar company.'],
          ['J.P. Morgan', 'Banking and finance', 'Created U.S. Steel by merging Carnegie\'s and 9 other firms. Reorganized failing railroads. Personally bailed out the U.S. Treasury during the 1907 Panic.'],
          ['Cornelius Vanderbilt', 'Railroads', 'Consolidated competing rail lines into the New York Central system. Aggressive price-cutting then monopoly pricing.'],
        ]}
      />

      <Analogy title="Vertical integration as owning every link in the chain">
        Imagine you make pizza. Horizontal integration means buying every pizza place in town. Vertical integration
        means owning the wheat fields, the flour mill, the tomato farm, the cheese factory, the trucks that deliver
        ingredients, the ovens, AND the storefront. If any one supplier raises prices on you, you don't care —
        you own them. Carnegie did this for steel. Standard Oil eventually did it for oil. It's the long-term path
        to monopoly power.
      </Analogy>

      <Callout kind="in-plain-words">
        <strong>Horizontal integration</strong> means buying competitors at the same level of production — like
        Rockefeller buying every other oil refinery. <strong>Vertical integration</strong> means controlling every
        step of the supply chain — like Carnegie owning the iron mines, the railroads carrying ore, the steel mills,
        and the ships shipping the steel. Horizontal makes you a monopolist; vertical insulates you from being
        squeezed by suppliers or distributors. Sometimes the same firm does both.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Labor pushback
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Industrial workers faced 12-hour shifts, dangerous machinery, and no safety regulation. Labor unions formed
        in response — the <strong>Knights of Labor</strong> (peak ~1880s), the <strong>American Federation of Labor</strong>
        (Samuel Gompers, founded 1886). Major strikes punctuated the era: the <strong>Haymarket Affair</strong>
        (Chicago, 1886 — a bomb killed police at a labor rally, sparking a backlash against unions), the
        <strong>Pullman Strike</strong> (1894 — President Cleveland sent federal troops to break it), and the
        <strong>Homestead Strike</strong> (1892 — Carnegie's manager Henry Frick hired Pinkertons to crush a steel
        strike). The federal government usually sided with management.
      </Typography>

      <Callout kind="connect">
        Many of the conditions that produced the Gilded Age — extreme inequality, lax regulation, immigrant labor
        exploitation, anti-union violence — would drive the next era's reform movement, the <strong>Progressive
        Era</strong>. Section 5 is the corrective. The two eras are inseparable: you cannot understand Progressive
        reforms without understanding what they were reforming.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Sherman Antitrust Act (1890) — and its ironic early use
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Congress passed the Sherman Antitrust Act in 1890, banning monopolies and "restraints of trade." For its
        first decade, federal courts mostly used it to prosecute <strong>labor unions</strong> (whose strikes were
        ruled illegal restraints of trade) rather than the trusts it was supposedly aimed at. Only when Theodore
        Roosevelt took office in 1901 did the Sherman Act start busting actual trusts — Standard Oil's breakup in
        1911 was the most famous.
      </Typography>

      <Callout kind="watch-for">
        Easy trap: the Sherman Antitrust Act (1890) was passed during the Gilded Age but doesn't really "do anything"
        about trusts until the Progressive Era. If an EOCEP question asks about the most effective anti-trust action
        in the Gilded Age, the honest answer is usually "very little — the law existed but wasn't enforced against
        the trusts it was named for."
      </Callout>
    </Box>
  );
}

// ── Section 5: Progressive Era ───────────────────────────────────────
function Section5Progressive() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The Progressive Era (roughly 1900–1920) was the bipartisan reform wave that tried to clean up what the
        Gilded Age made. Three presidents — <strong>Theodore Roosevelt</strong> (R, 1901–09), <strong>William Howard
        Taft</strong> (R, 1909–13), and <strong>Woodrow Wilson</strong> (D, 1913–21) — pursued overlapping but
        distinct reform agendas. The era's defining feature: bottom-up pressure from journalists, women's groups,
        and city-level reformers eventually broke through to federal action. Four constitutional amendments were
        ratified.
      </Typography>

      <Analogy title="Progressives as the cleanup crew">
        If the Gilded Age was a great-but-chaotic startup that grew too fast and ran roughshod over employees and
        customers, the Progressive Era is the operating-officer phase — process, audit, regulation. Different
        leaders push different priorities (Roosevelt is the trust-buster, Wilson is the banking-and-tariff reformer),
        but they all share the conviction that the government has to actively constrain concentrated economic power
        instead of standing back.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Muckraking journalism
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The era's reform engine was investigative journalism. <strong>Muckrakers</strong> exposed corporate and
        political corruption in ways that produced legislative responses:
      </Typography>
      <GuideTable
        headers={['Muckraker', 'Work', 'Resulting law / impact']}
        rows={[
          ['Upton Sinclair', 'The Jungle (1906) — Chicago meatpacking', 'Pure Food and Drug Act + Meat Inspection Act, both 1906.'],
          ['Ida Tarbell', 'History of Standard Oil (1904)', 'Helped fuel the public case for Standard Oil\'s breakup (1911).'],
          ['Jacob Riis', 'How the Other Half Lives (1890) — tenement photography', 'Led to housing reform in NYC and elsewhere; established photojournalism as advocacy.'],
          ['Lincoln Steffens', 'The Shame of the Cities (1904) — city political machines', 'Fueled the city-level "good government" reform movement.'],
        ]}
      />

      <Callout kind="why-it-matters">
        Muckrakers prove a recurring American pattern: federal reform often follows public outrage triggered by
        journalism, not the other way around. The same dynamic produced the New Deal financial reforms (after
        public outrage over the 1929 crash), civil rights legislation (after televised brutality in Birmingham and
        Selma), and modern environmental regulation (after Silent Spring exposed pesticide harm). Expect EOCEP
        questions on cause-and-effect chains starting with media exposure.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The four Progressive Amendments (1913–1920)
      </Typography>
      <MermaidDiagram
        chart={`
timeline
    title Progressive Era constitutional amendments
    1913 : 16th - Federal income tax
    1913 : 17th - Direct election of senators
    1919 : 18th - Prohibition of alcohol
    1920 : 19th - Women's suffrage
        `}
      />

      <Callout kind="make-it-stick">
        <strong>"16-17-18-19: Tax, Senators, Drink, Women."</strong> One year for each of the four amendments to
        memorize. 16: income tax (1913). 17: direct election of senators (1913). 18: Prohibition (1919). 19: women's
        suffrage (1920). Three of them changed the political system permanently; only Prohibition was repealed (21st
        Amendment, 1933). When the EOCEP asks which amendment was later repealed, the answer is always 18.
      </Callout>

      <Analogy title="Muckrakers as the era's investigative podcast">
        Imagine a generation of journalists who lived in immigrant tenements, worked undercover in meatpacking
        plants, and read corporate financial filings until they found the conspiracies — then wrote about it in
        magazines that millions of Americans actually read. That was muckraking. The closest modern equivalent is
        long-form investigative journalism or documentaries: same job, different medium. The political effect was
        unique to its era — federal laws often passed within a year or two of major exposés.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Trust-busting and the Square Deal
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Theodore Roosevelt's "Square Deal" promised fair treatment for consumers, workers, and businesses alike. His
        most visible action: actually using the Sherman Antitrust Act. He broke up the Northern Securities Company
        (a railroad trust) in 1904 and pursued Standard Oil, which the Court eventually broke into 34 companies
        in 1911. Wilson followed with the <strong>Clayton Antitrust Act</strong> (1914) — strengthening the Sherman
        Act and explicitly exempting labor unions from prosecution under it (fixing the Gilded Age irony from
        Section 4).
      </Typography>

      <Callout kind="connect">
        Wilson's <strong>Federal Reserve Act (1913)</strong> created the modern central bank — the institution that
        manages U.S. monetary policy to this day. Combined with the 16th Amendment (income tax), 1913 is arguably
        the single most consequential year for the structure of the modern federal government. Pre-1913 federal
        revenue depended on tariffs; post-1913 it depended on income tax — a fundamentally different fiscal
        machine.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Women's suffrage
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The fight for women's suffrage spanned 70+ years — from the <strong>Seneca Falls Convention</strong> in
        1848 to the <strong>19th Amendment</strong> in 1920. Key figures: Elizabeth Cady Stanton, Susan B. Anthony,
        Alice Paul (more militant tactics, modeled on British suffragettes). Western states granted women the vote
        decades before the federal amendment — Wyoming first in 1869. Black women, though included in the 19th
        Amendment's text, were largely disenfranchised by Jim Crow voting laws until 1965 — a critical detail the
        EOCEP often tests.
      </Typography>

      <Callout kind="watch-for">
        The 19th Amendment guaranteed women the vote on its face — but Black women in the South were still
        prevented from voting until the 1965 Voting Rights Act ended literacy tests and poll taxes. Be careful with
        any EOCEP question that asks when "all women" got the vote. Strictly: 1920. Practically for Black women in
        Jim Crow states: 1965.
      </Callout>
    </Box>
  );
}

// ── Section 6: WWI & 1920s ───────────────────────────────────────────
function Section6WWI() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        World War I (1914–18) began in Europe over imperial rivalries, alliance entanglements, and the assassination
        of Archduke Franz Ferdinand. The U.S. stayed out for nearly three years, then entered in April 1917 — tipped
        in by German <strong>unrestricted submarine warfare</strong>, the sinking of the <strong>Lusitania</strong>
        (1915, 128 Americans dead), and the <strong>Zimmermann Telegram</strong> (a German offer to Mexico of the
        U.S. Southwest if Mexico joined the Central Powers). The 1920s — the decade that followed — would be defined
        by isolationism, cultural ferment, and the seeds of economic crisis.
      </Typography>

      <Analogy title="WWI as a small-town brawl that suburbs got dragged into">
        Pre-1914 Europe was a tangle of mutual-defense alliances — like several neighbors who'd each promised to
        come to each other's aid if anyone started a fight. When Austria-Hungary attacked Serbia, the alliance
        chains pulled everyone in within weeks. The U.S. lived a couple of streets over and tried to stay out — but
        German submarines kept sinking American ships, and eventually the U.S. couldn't stay neutral while losing
        people. American troops decisively shifted the Western Front in 1918.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Why the U.S. entered
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[1914 War begins in Europe] --> B[1915 Lusitania sunk, 128 Americans killed]
    B --> C[Germany pauses unrestricted submarine warfare]
    C --> D[1917 Germany resumes unrestricted submarine warfare]
    D --> E[Feb 1917 Zimmermann Telegram intercepted]
    E --> F[April 1917 Congress declares war]
        `}
      />

      <Callout kind="make-it-stick">
        Three triggers for U.S. entry into WWI, easy to memorize as <strong>SUB-LUS-ZIM</strong>: <strong>Sub</strong>marine
        warfare, the <strong>Lus</strong>itania, the <strong>Zim</strong>mermann Telegram. Any EOCEP question that
        asks for an immediate cause of U.S. entry will have one of these three as the right answer.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Wilson's Fourteen Points and the Treaty of Versailles
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Woodrow Wilson laid out his post-war vision in <strong>Fourteen Points</strong> — including self-determination
        for nations, free trade, and a "general association of nations" (the future League of Nations). When the
        Treaty of Versailles was negotiated in 1919, the European Allies imposed far harsher terms on Germany than
        Wilson wanted — war guilt, massive reparations, lost territory, military restrictions. Wilson got his
        League. But the <strong>U.S. Senate REJECTED the Treaty</strong>, led by Henry Cabot Lodge and other
        senators wary of European entanglements. The U.S. never joined the League — a fatal weakness that helped
        doom the inter-war peace.
      </Typography>

      <Callout kind="why-it-matters">
        The Senate's rejection of the Treaty of Versailles is the textbook example of the constitutional check on
        presidential foreign policy. Wilson negotiated and signed the treaty; the Senate's role was to ratify it
        (Article II, Section 2 — treaties require 2/3 Senate approval). Without that, the agreement is dead for
        U.S. purposes. The same constitutional choke point would shape later presidents' approach to international
        agreements (e.g., FDR\'s wartime arrangements were largely executive agreements, partly to avoid Senate
        ratification).
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The 1920s — boom, contradiction, and undertow
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The 1920s saw a consumer-driven economic boom: cars, radios, electricity, washing machines became
        widespread. But the prosperity wasn't evenly distributed — farmers and Black Americans were largely left
        out, and the decade ended in catastrophic crash. Cultural tensions defined the era:
      </Typography>
      <GuideTable
        headers={['Tension', 'Surface dispute', 'What was actually at stake']}
        rows={[
          ['Urban vs. rural', 'The 1920 census showed urban majority for the first time.', 'Cultural authority — were "American values" defined by cities (jazz, modernism, immigration) or rural traditions (Prohibition, fundamentalism)?'],
          ['Old immigration vs. new', '22M immigrants from southern/eastern Europe arrived 1880–1920.', 'Nativism. The Immigration Act of 1924 imposed strict quotas favoring northern Europeans.'],
          ['Modernism vs. fundamentalism', 'The Scopes "Monkey" Trial (1925) — could public schools teach evolution?', 'Whether scientific authority or religious authority would shape education.'],
          ['Black Renaissance vs. KKK revival', 'Harlem Renaissance flourishes; KKK reaches second peak (~5M members).', 'Black cultural assertion vs. white backlash; both intensified.'],
        ]}
      />

      <Callout kind="connect">
        The <strong>Harlem Renaissance</strong> — Langston Hughes, Zora Neale Hurston, Duke Ellington, Louis
        Armstrong — was the first time Black art and literature reached broad mainstream American audiences. It set
        the cultural stage for the post-WWII Civil Rights Movement: a generation of Black intellectuals and artists
        had built institutions, audiences, and confidence. EOCEP often asks you to connect cultural movements to
        later political ones — this is the canonical example.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Red Scare and Prohibition
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Two ugly themes of the era: the <strong>Red Scare</strong> (1919–20) — Attorney General A. Mitchell Palmer
        led raids deporting hundreds of suspected anarchists and communists, riding fear from the Bolshevik
        Revolution. And <strong>Prohibition</strong> (18th Amendment, 1919) — the nationwide ban on alcohol that
        catastrophically failed in practice, fueling organized crime (Al Capone in Chicago) and ultimately repealed
        by the 21st Amendment in 1933. The only constitutional amendment ever repealed.
      </Typography>
    </Box>
  );
}

// ── Section 7: Great Depression & New Deal ───────────────────────────
function Section7NewDeal() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The Great Depression (1929–39) was the worst economic crisis in U.S. history. Unemployment hit 25%. About
        9,000 banks failed. The federal government's response under Hoover was thin and slow. Franklin D. Roosevelt,
        elected in 1932, ran on a "New Deal for the American people" and in his first 100 days launched the most
        sweeping federal program in U.S. history. The New Deal didn't end the Depression — WWII did — but it
        permanently redefined what the federal government owes its citizens.
      </Typography>

      <Analogy title="The New Deal as the founding of the modern federal government">
        Before 1933, the federal government was small. It collected tariffs and a small income tax, ran the post
        office and the army, and otherwise stayed out of citizens' daily lives. After 1933, the federal government
        guaranteed retirement (Social Security), insured bank deposits (FDIC), regulated stock markets (SEC), built
        public-works infrastructure across the country (WPA, TVA), and put millions of unemployed people to work
        directly. We still live in the world the New Deal created. Every president since — Republican and Democrat
        — has operated inside its framework.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Causes of the Depression
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The 1929 Crash didn't cause the Depression by itself. Underlying weaknesses had been building through the
        1920s:
      </Typography>
      <GuideTable
        headers={['Cause', 'How it worked']}
        rows={[
          ['Stock speculation on margin', 'Investors borrowed up to 90% of stock purchase price. When prices fell, brokers demanded payment; investors couldn\'t cover; mass selling cascaded into the crash.'],
          ['Bank failures', 'No FDIC. When banks failed, depositors lost everything. Bank runs forced even healthy banks to close.'],
          ['Agricultural overproduction', 'Farmers had expanded during WWI to feed Europe; post-war demand collapsed; debt and falling prices crushed them through the 1920s.'],
          ['Wealth inequality', 'Top 1% held 23% of wealth in 1929. Most Americans couldn\'t sustain consumer demand after wages stagnated.'],
          ['Smoot-Hawley Tariff (1930)', 'Hoover signed massive tariff hikes; other countries retaliated; world trade collapsed by ~65% between 1929 and 1934.'],
        ]}
      />

      <Callout kind="watch-for">
        The 1929 crash itself was painful but recoverable. What made it the Great Depression was the cascade of
        bank failures (~9,000 banks failed, no deposit insurance) and the failure of monetary policy. The Federal
        Reserve actually tightened money supply at the worst moment — a mistake economists have studied for almost
        a century. Don't confuse "the crash" with "the Depression" — they're connected events but different
        problems.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The Three Rs
      </Typography>
      <MermaidDiagram
        chart={`
flowchart LR
    A[Three Rs of New Deal] --> R1[Relief - immediate help]
    A --> R2[Recovery - rebuild the economy]
    A --> R3[Reform - prevent another crash]
    R1 --> CCC[CCC - Civilian Conservation Corps]
    R1 --> WPA[WPA - Works Progress Administration]
    R1 --> FERA[FERA - Federal Emergency Relief]
    R2 --> NRA[NRA - National Recovery Administration]
    R2 --> AAA[AAA - Agricultural Adjustment Act]
    R2 --> TVA[TVA - Tennessee Valley Authority]
    R3 --> SSA[SSA - Social Security 1935]
    R3 --> FDIC[FDIC - bank deposit insurance]
    R3 --> SEC[SEC - stock market regulation]
        `}
      />

      <Callout kind="make-it-stick">
        <strong>Relief, Recovery, Reform.</strong> Three Rs, in that order — short-term, medium-term, long-term.
        Relief programs put money in people's hands NOW (CCC, WPA). Recovery programs tried to restart specific
        sectors (NRA for industry, AAA for agriculture, TVA for the Tennessee Valley). Reform programs were
        permanent structural changes to prevent another crash (Social Security, FDIC, SEC). When the EOCEP asks
        you to categorize a New Deal program, work down this list.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Why Social Security is the most enduring legacy
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Most New Deal programs ended during WWII (CCC, WPA, NRA) or were struck down by the Supreme Court (NRA).
        <strong>Social Security</strong> (1935) survived because it created a politically untouchable constituency:
        every retired worker had a stake in its continuation. It started with retirement pensions, added
        unemployment insurance and Aid to Dependent Children, and over the decades has expanded into the dominant
        federal program by spending. Every president since FDR — including Republican ones — has expanded rather
        than shrunk Social Security.
      </Typography>

      <Callout kind="connect">
        Social Security's payroll-tax-funded structure (workers pay in throughout their careers; retirees draw out)
        is sometimes called "the third rail of American politics" — touch it and you die politically. That
        durability is what FDR architects designed for. Compare with the Affordable Care Act (2010) — the
        political battle over health care for the next 70+ years is partly an extended argument about whether
        health insurance should be the next thing put on a Social-Security-style permanent footing.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Court-packing and the Switch in Time
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        A conservative Supreme Court struck down major New Deal programs (NRA in 1935, AAA in 1936). Frustrated,
        FDR proposed in 1937 to add up to six new justices, framing it as needed because the Court was overworked.
        The plan was widely seen as a power grab and failed in Congress. But the Court itself began upholding New
        Deal programs that year — Justice Owen Roberts switched his vote in West Coast Hotel v. Parrish, sometimes
        called "the switch in time that saved nine." FDR lost the battle and won the war.
      </Typography>
    </Box>
  );
}

// ── Section 8: WWII ──────────────────────────────────────────────────
function Section8WWII() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        WWII (1939–45) was the largest war in human history, killing roughly 70–85 million people worldwide. The U.S.
        stayed out for over two years after war began in Europe, then was thrust in by <strong>Japan's attack on
        Pearl Harbor</strong> on December 7, 1941. American industrial mobilization was the war's decisive factor —
        the U.S. produced more military equipment in 1944 alone than Germany, Italy, and Japan combined produced
        in the entire war. WWII also reshaped the U.S. economy (ending the Depression), expanded federal power
        permanently, and set up the next 50 years of geopolitics.
      </Typography>

      <Analogy title="WWII as the Depression's accidental cure">
        The federal government had spent eight years and billions of dollars trying to end the Depression with
        New Deal programs, with limited success — unemployment was still 14% in 1940. Wartime mobilization did
        what no peacetime program could: it spent unlimited amounts of money on production, drafted millions of
        men into the military, and put millions of women into factories. By 1944 unemployment was below 2%. The
        Depression ended not through clever economic policy but through the world's largest jobs program in
        human history.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The path to U.S. entry
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        FDR knew the U.S. needed to support the Allies but couldn't get an isolationist Congress to declare war.
        He worked around it incrementally: <strong>Cash and Carry</strong> (1939, sell weapons to Allies if they
        paid cash and transported them), <strong>Destroyers for Bases</strong> (1940, 50 old destroyers to Britain
        in exchange for naval bases), the <strong>Lend-Lease Act</strong> (1941, lend war material to "any nation
        whose defense is vital to U.S."). Pearl Harbor ended the debate the next December.
      </Typography>

      <Callout kind="why-it-matters">
        Pearl Harbor wasn't just a military attack — it was the political event that ended American isolationism
        for the rest of the 20th century. From December 8, 1941 onward, no U.S. administration argued for staying
        out of world affairs. NATO, the U.N., the IMF, the World Bank, sustained military presence in Europe and
        Asia — all of it grew from the certainty that a great power couldn't safely retreat from the world. That
        consensus held through the Cold War and beyond.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Major U.S. campaigns
      </Typography>
      <GuideTable
        headers={['Theater', 'Key moments']}
        rows={[
          ['Pacific', 'Pearl Harbor (Dec 1941). Battle of Midway (June 1942 — naval turning point). Island-hopping campaign (1942–45). Iwo Jima and Okinawa (1945). Atomic bombs on Hiroshima and Nagasaki (August 1945).'],
          ['European', 'North Africa campaign (1942–43). Italy (1943). D-Day Normandy invasion (June 6, 1944 — largest amphibious assault in history). Battle of the Bulge (Dec 1944, last major German offensive). VE Day (May 8, 1945).'],
          ['Home front', 'Rosie the Riveter — millions of women entered factory work. War bonds. Rationing of food and gasoline. Japanese-American internment (Executive Order 9066, ~120,000 forcibly relocated).'],
        ]}
      />

      <Callout kind="watch-for">
        Easy chronology trap: the European war ended FIRST (VE Day, May 8, 1945) and the Pacific war ended FOUR
        MONTHS LATER (VJ Day, September 2, 1945). The atomic bombs were dropped in August. If a question asks
        "when did WWII end," the answer depends on which theater — but the U.S. effort ended with Japan\'s
        surrender in September.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The Manhattan Project and the atomic bomb
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The <strong>Manhattan Project</strong> (1942–45) was a top-secret $2 billion program (~$30 billion today)
        that built the first nuclear weapons. Led by physicist <strong>Robert Oppenheimer</strong> at Los Alamos,
        with sites at Oak Ridge, Tennessee and Hanford, Washington. The first test was Trinity (July 16, 1945). The
        bomb was dropped on <strong>Hiroshima</strong> (August 6, ~140,000 dead) and <strong>Nagasaki</strong>
        (August 9, ~70,000 dead). Japan surrendered six days later. Truman's decision to use the bomb remains
        intensely debated to this day.
      </Typography>

      <Analogy title="The Manhattan Project as the original moonshot">
        The U.S. government spent $2 billion (~$30 billion today), built three secret cities, hired 130,000 people,
        and produced a working atomic bomb in three years — all kept quiet from the public, Congress, and even Vice
        President Truman until FDR\'s death. It\'s the prototype for every later "big science" federal project:
        Apollo, the Human Genome Project, Operation Warp Speed. When a question's mood is "U.S. government applied
        massive resources to a single scientific goal in wartime," the answer is Manhattan Project.
      </Analogy>

      <Callout kind="connect">
        The Manhattan Project marks the start of the <strong>nuclear age</strong> — and with it the Cold War's
        defining feature, mutually-assured destruction. Within four years (1949) the Soviets had their own bomb.
        Within fifteen years (1960s) several other countries did too. The decision to use atomic weapons in 1945
        directly shaped every subsequent decade — see Section 9.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Japanese-American internment
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        In February 1942, FDR issued <strong>Executive Order 9066</strong>, authorizing the forced relocation of
        roughly 120,000 Japanese Americans (two-thirds were U.S. citizens) from the West Coast to internment camps
        in the interior. The Supreme Court upheld it in <strong>Korematsu v. United States (1944)</strong> — a
        decision now widely considered one of the worst in the Court\'s history. The U.S. government formally
        apologized in 1988 (Civil Liberties Act) and paid reparations of $20,000 to each surviving internee.
      </Typography>
    </Box>
  );
}

// ── Section 9: Cold War & Containment ────────────────────────────────
function Section9ColdWar() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The Cold War (roughly 1947–91) was a 44-year ideological, economic, and proxy-military struggle between the
        U.S. and the Soviet Union. No direct U.S.-USSR war ever occurred — both sides had nuclear weapons by 1949,
        making total war suicidal. Instead, the rivalry played out through alliances (NATO vs. Warsaw Pact),
        proxy wars (Korea, Vietnam, Afghanistan), competition for influence in the developing world, and an arms
        race that consumed enormous resources on both sides. The U.S. doctrine throughout was <strong>containment</strong>
        — preventing the spread of Soviet influence without attempting to roll back what already existed.
      </Typography>

      <Analogy title="The Cold War as a 44-year game of chess">
        Imagine a chess game between two grandmasters who are also constantly arming the spectators. Each move is
        defensive and watched obsessively; nobody can attack the king directly because the consequences are too
        large. So they fight for control of squares around the board — small countries, satellite states, allied
        regimes. Some of those proxy battles get extremely bloody (Korea, Vietnam) but the central confrontation
        never erupts. The game ends in 1991 when one player\'s economy collapses and they resign.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Containment doctrine and its instruments
      </Typography>
      <GuideTable
        headers={['Tool', 'Year', 'What it did']}
        rows={[
          ['Truman Doctrine', '1947', 'Pledged U.S. support to "free peoples resisting subjugation." First applied to Greece and Turkey.'],
          ['Marshall Plan', '1948–52', '$13 billion to rebuild Western Europe. Combined humanitarian goals with containing communism by stabilizing democracies.'],
          ['NATO', '1949', 'Mutual-defense alliance: U.S. + Canada + Western Europe. Attack on one = attack on all.'],
          ['Warsaw Pact', '1955', 'Soviet response to NATO. USSR + Eastern European satellite states.'],
          ['Korean War', '1950–53', 'First hot proxy war. U.N. (mostly U.S.) forces vs. North Korea + China. Ended in stalemate at the 38th parallel.'],
          ['Vietnam War', '1955–75', 'Containment of communism in Southeast Asia. Ended with U.S. withdrawal and North Vietnamese victory.'],
        ]}
      />

      <Callout kind="make-it-stick">
        Memorize the early containment sequence: <strong>1947 Truman Doctrine → 1948 Marshall Plan → 1949 NATO →
        1950 Korean War</strong>. That\'s the structure of Cold War America in four years — declare the strategy,
        rebuild allies, formalize alliances, fight the first proxy war. Each step builds on the previous.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Crisis points
      </Typography>
      <MermaidDiagram
        chart={`
timeline
    title Major Cold War crisis points
    1948 : Berlin Blockade and Airlift
    1949 : Soviet atomic bomb
    1950 : Korean War begins
    1957 : Sputnik
    1961 : Berlin Wall built
    1962 : Cuban Missile Crisis
    1965 : Major US escalation in Vietnam
    1973 : US withdraws from Vietnam
    1979 : Soviet invasion of Afghanistan
    1989 : Berlin Wall falls
    1991 : Soviet Union dissolves
        `}
      />

      <Callout kind="why-it-matters">
        The <strong>Cuban Missile Crisis</strong> (October 1962) was the closest the Cold War came to nuclear war.
        Soviet missiles were placed in Cuba; Kennedy ordered a naval blockade. After 13 days of tense back-channel
        negotiation, the USSR removed the missiles in exchange for U.S. removal of missiles from Turkey and a
        promise not to invade Cuba. The crisis pushed both superpowers toward direct communication (the Moscow-
        Washington "hot line") and arms-control agreements (Limited Test Ban Treaty, 1963). It also defined how
        future nuclear standoffs would be managed.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        McCarthyism — the home-front cost
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Cold War paranoia at home produced its own ugliness. Senator <strong>Joseph McCarthy</strong> of Wisconsin
        led sensational hearings (1950–54) accusing State Department officials, army officers, and Hollywood figures
        of being communist agents — usually with little evidence. Careers were destroyed. The <strong>Hollywood
        Blacklist</strong> excluded suspected sympathizers from work. The Senate finally censured McCarthy in
        December 1954 after he attacked the Army. "McCarthyism" entered the language as a synonym for unfounded
        accusation used to silence dissent.
      </Typography>

      <Callout kind="connect">
        The Red Scare of 1919–20 (Section 6) and McCarthyism (1950s) share a structure: external Soviet threat +
        political opportunism + collapse of due process. The pattern is one the EOCEP loves to test as parallel
        cases — moments when American institutions failed to protect individual rights against political fear.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        How the Cold War ended
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Multiple factors converged in the late 1980s. Soviet economic stagnation made the arms race unsustainable.
        Mikhail Gorbachev (general secretary from 1985) pursued <strong>glasnost</strong> (openness) and
        <strong>perestroika</strong> (restructuring), which inadvertently destabilized the system. Ronald Reagan's
        military buildup increased the economic pressure. Eastern European satellite states broke away in 1989 —
        the <strong>Berlin Wall fell</strong> on November 9, 1989. The Soviet Union itself dissolved on December
        26, 1991. The Cold War ended not with a war but with bankruptcy and reform.
      </Typography>
    </Box>
  );
}

// ── Section 10: Civil Rights Movement ────────────────────────────────
function Section10CivilRights() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The Civil Rights Movement (roughly 1954–68) was the long-delayed enforcement of the 14th and 15th Amendments.
        It was strategically brilliant — combining federal courts, mass nonviolent direct action, and media coverage
        — and it produced the two most important civil rights laws since Reconstruction: the <strong>Civil Rights
        Act of 1964</strong> and the <strong>Voting Rights Act of 1965</strong>. Together they ended the legal
        framework of Jim Crow, though informal discrimination and its consequences continue to shape American life.
      </Typography>

      <Analogy title="The Civil Rights Movement as the bill finally coming due">
        The 14th and 15th Amendments wrote a check in 1868 and 1870. For nearly a century, Southern states refused
        to cash it — using Plessy v. Ferguson, literacy tests, poll taxes, and outright violence to keep Black
        citizens from full citizenship. The Civil Rights Movement was the long, organized campaign that finally
        forced cashing the check. Brown v. Board (1954) said the check was real. The 1964 and 1965 acts wrote the
        enforcement mechanism Reconstruction never had.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Brown v. Board of Education (1954)
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Thurgood Marshall (later the first Black Supreme Court Justice) led the NAACP\'s legal strategy. The case
        consolidated five lawsuits challenging school segregation. Chief Justice <strong>Earl Warren</strong>
        delivered a unanimous opinion: "Separate educational facilities are inherently unequal." Plessy was
        overturned. <strong>Brown II (1955)</strong> ordered desegregation "with all deliberate speed" — a vague
        phrase that Southern states used to delay enforcement for years (sometimes decades).
      </Typography>

      <Callout kind="why-it-matters">
        Brown is sometimes called the most important Supreme Court ruling of the 20th century — not because it
        immediately desegregated schools (it didn\'t — many Southern districts resisted into the 1970s) but
        because it announced a new constitutional commitment. The federal government would no longer accept Jim
        Crow. The slow but real implementation that followed shaped every subsequent civil rights argument.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Mass nonviolent direct action — the chronology
      </Typography>
      <MermaidDiagram
        chart={`
timeline
    title Civil Rights Movement chronology
    1954 : Brown v. Board of Education
    1955 : Montgomery Bus Boycott (Rosa Parks, MLK leads)
    1957 : Little Rock Nine - Eisenhower sends 101st Airborne
    1960 : Greensboro lunch counter sit-ins
    1961 : Freedom Rides
    1963 : Birmingham campaign, MLK Letter from Birmingham Jail, March on Washington
    1964 : Civil Rights Act signed
    1965 : Selma to Montgomery marches, Voting Rights Act signed
    1968 : Fair Housing Act, MLK assassinated
        `}
      />

      <Callout kind="make-it-stick">
        <strong>1954–55–57–60–63–64–65: court → bus → school → lunch counter → mass march → CRA → VRA.</strong>
        Brown made the legal claim; Montgomery, Little Rock, Greensboro proved nonviolent direct action could move
        local segregation; the 1963 March on Washington and Birmingham campaign created the political moment for
        federal action; Civil Rights Act (1964) banned discrimination in employment and public accommodations;
        Voting Rights Act (1965) put teeth in the 15th Amendment.
      </Callout>

      <Analogy title="Brown v. Board as the Court cashing the 1868 check">
        Imagine you have a contract signed in 1868 promising you something — and the other party refuses to deliver
        for 86 years. Brown v. Board is the court ruling that finally said: yes, the contract is real, you have to
        deliver. The Equal Protection Clause of the 14th Amendment had been on the books since 1868; Brown
        unanimously held in 1954 that segregated schools violated it. Most of the Civil Rights Movement's legal
        victories afterward built on this single decision.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Key figures and tactics
      </Typography>
      <GuideTable
        headers={['Figure', 'Role / tactic']}
        rows={[
          ['Martin Luther King Jr.', 'Southern Christian Leadership Conference. Mass nonviolent direct action. Letter from Birmingham Jail (1963). "I Have a Dream" speech (March on Washington, 1963).'],
          ['Rosa Parks', 'NAACP secretary in Montgomery. Refused to give up bus seat (December 1955). Spark for Montgomery Bus Boycott.'],
          ['Thurgood Marshall', 'NAACP lead attorney. Won Brown v. Board (1954). Later Supreme Court Justice (1967–91).'],
          ['John Lewis', 'SNCC chair. Lead organizer of Selma marches (1965). Brutalized on the Edmund Pettus Bridge — televised footage drove federal action.'],
          ['Malcolm X', 'Nation of Islam, later independent. Argued for self-defense and Black nationalism rather than nonviolent integration. Assassinated 1965.'],
          ['Lyndon B. Johnson', 'President (1963–69). Pushed through Civil Rights Act (1964) and Voting Rights Act (1965). His Great Society programs expanded civil rights into economic policy.'],
        ]}
      />

      <Callout kind="watch-for">
        The Civil Rights Movement wasn\'t monolithic. Tension between MLK\'s nonviolent integrationism, Malcolm X\'s
        Black nationalism, and SNCC\'s evolving radicalism is part of the era\'s texture. EOCEP questions often
        ask you to distinguish these strands or to identify which figure\'s arguments most closely match a given
        primary-source excerpt. Don\'t flatten them into one movement.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Civil Rights Act of 1964 vs. Voting Rights Act of 1965
      </Typography>
      <GuideTable
        headers={['Act', 'What it banned', 'Constitutional basis']}
        rows={[
          ['Civil Rights Act 1964', 'Discrimination by race/color/religion/sex/national origin in EMPLOYMENT, PUBLIC ACCOMMODATIONS, FEDERALLY-FUNDED PROGRAMS.', '14th Amendment Equal Protection + Commerce Clause (which justified reaching private businesses).'],
          ['Voting Rights Act 1965', 'Literacy tests. Authorized federal oversight of elections in jurisdictions with histories of discrimination.', '15th Amendment.'],
        ]}
      />

      <Callout kind="connect">
        The Civil Rights Act used the <strong>Commerce Clause</strong> as well as the 14th Amendment to reach private
        businesses (hotels, restaurants) — because the 14th Amendment by itself only constrains STATE action, not
        private discrimination. The Court accepted the Commerce Clause argument in Heart of Atlanta Motel v. U.S.
        (1964). This is the kind of constitutional doctrine the EOCEP loves to test through scenario questions.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        After 1965
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The movement continued — the <strong>Fair Housing Act (1968)</strong> banned discrimination in housing,
        passed right after MLK\'s assassination. But the movement also fragmented: the Voting Rights Act\'s passage
        removed the most galvanizing legal targets, and tensions between integrationists and Black nationalists
        sharpened. Urban riots in the late 1960s (Watts 1965, Newark and Detroit 1967, the wave after King\'s
        assassination in 1968) signaled that the legal victories hadn\'t resolved underlying economic and structural
        problems. The EOCEP\'s coverage of the post-1968 era is typically lighter, but the movement\'s long shadow
        runs through every modern civil rights debate.
      </Typography>
    </Box>
  );
}

// ── Section: EOCEP Strategy ───────────────────────────────────────────
function SectionStrategy() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The SC EOCEP for U.S. History and the Constitution is a timed multiple-choice exam covering everything in
        Sections 2–10 of this guide. It\'s administered at the end of your USHC course; scores count <strong>20% of
        your final grade in the class</strong>. The exam combines factual recall, primary-source reading
        comprehension, cause-and-effect analysis, and constitutional-principle application.
      </Typography>

      <Callout kind="try-this">
        Before exam day, take the EOCEP Sandbox tab at least twice — full timed runs, no pauses. Your goal isn\'t
        to score perfectly on the first one; it\'s to learn how the time pressure feels and where YOU run out of
        time. Time-management is the biggest controllable factor on exam day.
      </Callout>

      <Callout kind="coachs-note">
        On exam day, read each question CAREFULLY. EOCEP questions often hinge on a single word — "primarily,"
        "most directly," "best supports." Skim once for the structure, then read again to catch the qualifier.
        When two answer choices both look plausible, the qualifier usually picks between them.
      </Callout>

      <Callout kind="try-this">
        For chronology questions, use the timeline diagrams in this guide as memory anchors. Picture the timeline,
        then locate the events. Most chronology mistakes happen when students try to reason from facts they half-
        remember instead of from the visual.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        What\'s heavily tested
      </Typography>
      <GuideTable
        headers={['Topic', 'Why it shows up']}
        rows={[
          ['The Reconstruction Amendments (13/14/15)', 'Foundational to modern constitutional law. Equal Protection (14) is the most-litigated clause in the Constitution.'],
          ['Federalism vs. state action', 'Tested through scenarios — when does the federal government have the power to act?'],
          ['Cause-and-effect chains', 'WWI → Treaty of Versailles → Great Depression → WWII → Cold War. Each step caused the next.'],
          ['Constitutional principles in practice', 'Checks and balances, judicial review, federalism — applied to specific historical conflicts.'],
          ['Civil Rights chronology', 'Brown → bus boycotts → school desegregation → sit-ins → marches → CRA → VRA.'],
        ]}
      />

      <Callout kind="watch-for">
        Common trap: confusing the 14th and 15th Amendments. 14 = citizenship + equal protection + due process.
        15 = voting rights regardless of race. If the question is about who can vote, the answer is 15. If the
        question is about who counts as a citizen or what rights they have, the answer is 14.
      </Callout>
    </Box>
  );
}

// ── Supreme Court Landmark Cases ───────────────────────────────────────
function SectionSupremeCourt() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Supreme Court rulings are not optional history — they ARE history. Brown v. Board changed millions of
        lives. Marbury v. Madison created the Court's modern power. Plessy v. Ferguson kept Jim Crow legal for
        58 years. Dred Scott helped trigger the Civil War. This section consolidates the landmark cases the SC
        EOCEP loves to test, grouped by era and by what they decided.
      </Typography>

      <Analogy title="The Supreme Court as the Constitution's editor">
        Imagine the Constitution as a 250-year-old contract. Every generation, new disputes force someone to read
        the contract and decide what its words mean for situations the original drafters never imagined — air
        traffic, social media, genetic testing. That someone is the Supreme Court. Its opinions are how the
        contract actually works in practice. Knowing the major opinions IS knowing how the Constitution operates.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Founding-era cases (1803–1857)
      </Typography>
      <GuideTable
        headers={['Case', 'Year', 'Court', 'What it decided', 'Why it matters']}
        rows={[
          ['Marbury v. Madison', '1803', 'Marshall', 'Established judicial review — the Court can declare federal laws unconstitutional.', 'Foundation of the Court\'s modern authority. Without Marbury, every later landmark would lack legal grounding.'],
          ['McCulloch v. Maryland', '1819', 'Marshall', 'Congress has implied powers under the Necessary and Proper Clause. States cannot tax federal institutions.', 'Cemented broad federal power. Without it, the New Deal, the Civil Rights Acts, and the modern administrative state would all be on weaker ground.'],
          ['Gibbons v. Ogden', '1824', 'Marshall', 'Federal power over interstate commerce is exclusive and broad.', 'Foundation of modern federal economic regulation. The Commerce Clause is the most-used federal power.'],
          ['Dred Scott v. Sandford', '1857', 'Taney', 'African Americans (free or enslaved) could not be citizens. Congress could not ban slavery in the territories.', 'Widely considered the WORST decision in Court history. Helped trigger the Civil War. Overturned by the 13th and 14th Amendments.'],
        ]}
      />

      <Callout kind="watch-for">
        Dred Scott v. Sandford is the canonical example of a Supreme Court ruling that was so wrong it had to be
        overturned by constitutional amendment, not just future Court rulings. The 13th (1865) abolished slavery;
        the 14th (1868) made African Americans citizens. The case is also why the EOCEP asks about citizenship
        clauses so often — they exist specifically to repudiate Dred Scott.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Civil Rights / Reconstruction-era cases (1873–1896)
      </Typography>
      <GuideTable
        headers={['Case', 'Year', 'What it decided', 'Why it matters']}
        rows={[
          ['Slaughter-House Cases', '1873', 'Read the 14th Amendment\'s Privileges or Immunities Clause so narrowly that it became nearly useless.', 'Crippled one of Reconstruction\'s key tools. The Due Process and Equal Protection Clauses had to carry the load instead.'],
          ['Civil Rights Cases', '1883', 'Struck down the Civil Rights Act of 1875 — the 14th Amendment limits STATE action, not private discrimination.', 'Cleared the way for Jim Crow. Modern federal civil rights laws (1964 CRA) use the Commerce Clause to reach private discrimination.'],
          ['Plessy v. Ferguson', '1896', 'Established "separate but equal" — segregation is constitutional if facilities are nominally equal.', 'Gave Jim Crow legal armor for 58 years. Justice Harlan\'s lone dissent (\"Our Constitution is color-blind\") is one of the most famous in the Court\'s history.'],
        ]}
      />

      <Callout kind="connect">
        The Civil Rights Cases (1883) explain a constitutional subtlety the EOCEP often tests: the 14th Amendment
        constrains STATE governments, not private businesses. So when Congress wanted to ban discrimination in
        hotels and restaurants in 1964, it used the Commerce Clause (Heart of Atlanta Motel v. U.S., 1964) — which
        reaches private commerce — instead of relying solely on the 14th Amendment.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Progressive Era and New Deal cases (1905–1944)
      </Typography>
      <GuideTable
        headers={['Case', 'Year', 'What it decided']}
        rows={[
          ['Lochner v. New York', '1905', 'Struck down a state law limiting bakers\' working hours, finding a constitutional "liberty of contract." Began the "Lochner era" of striking down economic regulations.'],
          ['Schenck v. United States', '1919', 'Upheld Espionage Act convictions. Justice Holmes coined the "clear and present danger" test for limits on free speech.'],
          ['Schechter Poultry Corp. v. United States', '1935', 'Struck down the National Industrial Recovery Act (the centerpiece of FDR\'s First New Deal). Helped trigger FDR\'s court-packing attempt.'],
          ['West Coast Hotel v. Parrish', '1937', 'Upheld a minimum-wage law for women, abandoning Lochner. The "switch in time that saved nine."'],
          ['Korematsu v. United States', '1944', 'Upheld the wartime internment of Japanese Americans. Widely considered one of the Court\'s worst decisions; effectively repudiated in Trump v. Hawaii (2018).'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Civil Rights and Warren Court era (1954–1969)
      </Typography>
      <GuideTable
        headers={['Case', 'Year', 'What it decided']}
        rows={[
          ['Brown v. Board of Education', '1954', 'Unanimous: segregated public schools are inherently unequal and unconstitutional under the 14th Amendment. Overturned Plessy.'],
          ['Brown II', '1955', 'Ordered desegregation "with all deliberate speed" — a vague phrase used by Southern states to delay for years.'],
          ['Mapp v. Ohio', '1961', 'Extended the Fourth Amendment\'s exclusionary rule (evidence from illegal searches cannot be used at trial) to state criminal trials.'],
          ['Engel v. Vitale', '1962', 'School-sponsored prayer in public schools violates the Establishment Clause.'],
          ['Gideon v. Wainwright', '1963', 'Indigent state-court felony defendants have a Sixth Amendment right to court-appointed counsel.'],
          ['Heart of Atlanta Motel v. U.S.', '1964', 'Upheld Title II of the Civil Rights Act of 1964 (public accommodations) under the Commerce Clause.'],
          ['Miranda v. Arizona', '1966', 'Police must inform suspects of their right to remain silent, right to an attorney, and that statements can be used against them.'],
          ['Loving v. Virginia', '1967', 'Unanimous: state laws banning interracial marriage violate the 14th Amendment.'],
          ['Tinker v. Des Moines', '1969', 'Students don\'t "shed their constitutional rights to freedom of speech at the schoolhouse gate" — upheld armband protest of Vietnam War.'],
        ]}
      />

      <Callout kind="make-it-stick">
        The Warren Court (1953–69, Chief Justice Earl Warren) is the most expansive civil-liberties Court in U.S.
        history. Memorize these as a CLUSTER: <strong>Brown / Mapp / Engel / Gideon / Miranda / Loving / Tinker</strong>
        — desegregation, search-and-seizure protection, no school prayer, right to counsel, Miranda rights, no
        interracial-marriage bans, student speech. Every one expanded individual rights against state power.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Modern era (post-1970)
      </Typography>
      <GuideTable
        headers={['Case', 'Year', 'What it decided']}
        rows={[
          ['New York Times Co. v. United States', '1971', 'The "Pentagon Papers" case. Held that the government had not met the heavy burden of justifying prior restraint on publication.'],
          ['United States v. Nixon', '1974', 'Executive privilege is not absolute. Nixon had to turn over the Watergate tapes. He resigned 16 days later.'],
          ['Bush v. Gore', '2000', 'Halted the Florida recount, effectively deciding the 2000 presidential election for George W. Bush. Controversial both for the ruling and for the Court\'s involvement in election administration.'],
          ['District of Columbia v. Heller', '2008', 'Second Amendment protects an individual right to keep firearms in the home, distinct from the militia clause.'],
          ['Citizens United v. FEC', '2010', 'Corporate and union political spending (as "independent expenditures") is protected by the First Amendment. Reshaped campaign finance.'],
          ['Obergefell v. Hodges', '2015', 'Same-sex couples have a constitutional right to marry under the 14th Amendment.'],
          ['Trump v. Hawaii', '2018', 'Upheld the third version of the travel ban. Also formally repudiated Korematsu as "gravely wrong the day it was decided."'],
          ['Dobbs v. Jackson Women\'s Health', '2022', 'Overturned Roe v. Wade (1973) and Planned Parenthood v. Casey (1992). Returned abortion regulation to the states.'],
          ['Students for Fair Admissions v. Harvard', '2023', 'Struck down race-conscious affirmative action in college admissions.'],
        ]}
      />

      <Callout kind="why-it-matters">
        The Court can — and does — overturn its own precedents. <strong>Brown</strong> overturned Plessy.
        <strong> Lawrence v. Texas</strong> (2003) overturned Bowers v. Hardwick (1986). <strong>Dobbs</strong>
        overturned Roe. These reversals are rare but they shape entire eras of American life. When the EOCEP asks
        about a case "establishing" or "overturning" something, it\'s testing whether you understand that
        precedent is a STRONG default — but not unbreakable.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        How a case reaches the Supreme Court
      </Typography>
      <MermaidDiagram
        chart={`
flowchart TD
    A[Federal trial court / state highest court] --> B[Federal appeals court / state appeal]
    B --> C[Cert petition to Supreme Court]
    C --> D{Court grants cert?}
    D -->|No| E[Lower-court ruling stands]
    D -->|Yes - 4 of 9 justices agree| F[Briefs, oral argument]
    F --> G[Conference vote]
    G --> H[Opinion writing, dissent, concurrence]
    H --> I[Ruling published]
        `}
      />

      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The Court receives about 7,000 cert petitions per year and grants only ~70 (about 1%). Cases that combine
        unsettled constitutional questions, deep circuit splits (where federal appeals courts disagree), and big
        practical stakes are most likely to be heard. The Court controls its own docket — most appeals to it are
        declined without comment.
      </Typography>
    </Box>
  );
}

// ── Presidents Quick Reference ─────────────────────────────────────────
function SectionPresidents() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The EOCEP doesn't ask you to memorize all 46 presidents (Joe Biden being the 46th, Trump\'s second term
        making him the 45th AND 47th). But it absolutely asks about the major ones — what era they led, what
        they did, what they\'re remembered for. This is a quick reference for the era-defining presidents in
        each section of the course.
      </Typography>

      <Analogy title="Presidents as eras">
        Each major president is shorthand for a chunk of American history. Saying "the New Deal" really means
        "FDR's response to the Depression." Saying "the Great Society" means "LBJ's expansion of civil rights
        and federal programs." Saying "the Reagan Revolution" means "the conservative pivot in the 1980s." The
        president is the headline — the era is the story.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Founding through Civil War
      </Typography>
      <GuideTable
        headers={['President', 'Years', 'Party', 'Best remembered for']}
        rows={[
          ['George Washington', '1789–97', 'None', 'Setting precedents (two-term limit, peaceful power transfer, neutrality in foreign wars). His Farewell Address warned against political parties and foreign entanglements.'],
          ['Thomas Jefferson', '1801–09', 'Democratic-Republican', 'Louisiana Purchase (1803) doubled U.S. territory. Sent the Lewis and Clark expedition west. Author of the Declaration of Independence.'],
          ['Andrew Jackson', '1829–37', 'Democratic', 'Expanded executive power. Indian Removal Act (1830) and Trail of Tears. Vetoed the rechartering of the Second Bank. "Common-man" populist style.'],
          ['Abraham Lincoln', '1861–65', 'Republican', 'Led the Union through the Civil War. Issued the Emancipation Proclamation (1863). Pushed the 13th Amendment. Assassinated by John Wilkes Booth April 14, 1865.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Reconstruction through Progressive Era
      </Typography>
      <GuideTable
        headers={['President', 'Years', 'Party', 'Best remembered for']}
        rows={[
          ['Andrew Johnson', '1865–69', 'Democratic', 'Lenient Reconstruction; impeached for violating the Tenure of Office Act; survived removal by one vote.'],
          ['Ulysses S. Grant', '1869–77', 'Republican', 'Civil War general turned president. Enforced Reconstruction with federal troops. Administration plagued by corruption.'],
          ['Rutherford B. Hayes', '1877–81', 'Republican', 'Won the 1876 election via the Compromise of 1877; agreed to end Reconstruction and withdraw federal troops from the South in exchange.'],
          ['Theodore Roosevelt', '1901–09', 'Republican', 'Trust-busting (Standard Oil, Northern Securities). Pure Food and Drug Act. Square Deal. Conservation (National Parks). Mediated Russo-Japanese War — Nobel Peace Prize.'],
          ['William Howard Taft', '1909–13', 'Republican', 'Quietly broke MORE trusts than TR. Dollar Diplomacy. Later Chief Justice of the Supreme Court (1921–30) — only person to hold both top jobs.'],
          ['Woodrow Wilson', '1913–21', 'Democratic', 'Federal Reserve Act (1913). Clayton Antitrust Act (1914). League of Nations (rejected by Senate). 19th Amendment (women\'s suffrage). Segregated federal workforce — significant regression for civil rights.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Depression through WWII
      </Typography>
      <GuideTable
        headers={['President', 'Years', 'Party', 'Best remembered for']}
        rows={[
          ['Herbert Hoover', '1929–33', 'Republican', 'In office when the 1929 crash hit. Federal response widely seen as inadequate. Smoot-Hawley Tariff worsened the global economy. Lost in a 1932 landslide.'],
          ['Franklin D. Roosevelt', '1933–45', 'Democratic', 'Only president elected to FOUR terms. New Deal — Social Security, FDIC, SEC, WPA, CCC, TVA. Led the U.S. through WWII. Court-packing attempt. Japanese internment (Executive Order 9066). Died in office April 12, 1945.'],
          ['Harry Truman', '1945–53', 'Democratic', 'Decided to drop atomic bombs on Japan. Truman Doctrine (1947). Marshall Plan (1948). Established NATO (1949). Desegregated the armed forces by executive order (1948). "The buck stops here."'],
        ]}
      />

      <Callout kind="make-it-stick">
        FDR served 12+ years — March 1933 to April 1945. The 22nd Amendment (1951) put a two-term limit on
        future presidents specifically to prevent another long tenure like his. So no one else can ever match
        FDR\'s record on time-in-office, no matter how popular.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Cold War, Civil Rights, Modern era
      </Typography>
      <GuideTable
        headers={['President', 'Years', 'Party', 'Best remembered for']}
        rows={[
          ['Dwight D. Eisenhower', '1953–61', 'Republican', 'WWII supreme allied commander. Ended the Korean War. Federalized the National Guard at Little Rock (1957). Built the Interstate Highway System (1956). Warned of the "military-industrial complex" in his farewell address.'],
          ['John F. Kennedy', '1961–63', 'Democratic', 'Cuban Missile Crisis (October 1962). "New Frontier." Bay of Pigs disaster (1961). Pushed civil rights legislation in 1963. Assassinated in Dallas November 22, 1963.'],
          ['Lyndon B. Johnson', '1963–69', 'Democratic', 'Civil Rights Act (1964). Voting Rights Act (1965). Medicare, Medicaid (1965). "Great Society" anti-poverty programs. Escalated U.S. involvement in Vietnam. Did not seek reelection in 1968.'],
          ['Richard Nixon', '1969–74', 'Republican', 'Opened relations with China (1972). Ended draft, withdrew U.S. ground forces from Vietnam (1973). EPA, OSHA, Clean Air Act, Title IX. Watergate scandal — first president to resign (August 9, 1974).'],
          ['Jimmy Carter', '1977–81', 'Democratic', 'Camp David Accords (Israel–Egypt peace, 1978). Iran Hostage Crisis (1979–81). High inflation and stagflation. Post-presidency: humanitarian work, Nobel Peace Prize (2002).'],
          ['Ronald Reagan', '1981–89', 'Republican', '"Reagan Revolution" — supply-side economics, tax cuts, deregulation. Massive military buildup. "Tear down this wall!" speech (1987). Iran-Contra scandal. INF Treaty with Gorbachev (1987).'],
          ['George H. W. Bush', '1989–93', 'Republican', 'In office for Berlin Wall fall (1989), Soviet dissolution (1991), Gulf War (1991). Americans with Disabilities Act (1990). "Read my lips: no new taxes" (broken pledge).'],
          ['Bill Clinton', '1993–2001', 'Democratic', 'Welfare reform. NAFTA (1994). Family and Medical Leave Act. Budget surpluses. Impeached over Lewinsky affair; acquitted by Senate. Don\'t Ask Don\'t Tell military policy.'],
          ['George W. Bush', '2001–09', 'Republican', '9/11 attacks. War in Afghanistan (2001) and Iraq (2003). Patriot Act. No Child Left Behind. Created Department of Homeland Security. 2008 financial crisis response.'],
          ['Barack Obama', '2009–17', 'Democratic', 'First Black president. Affordable Care Act (2010). Killing of Bin Laden (2011). Paris Climate Agreement (2015). Obergefell era. Iran nuclear deal (2015).'],
        ]}
      />

      <Callout kind="watch-for">
        EOCEP questions on modern presidents often pair the president with a SPECIFIC SIGNATURE POLICY. Examples:
        Truman with the atomic-bomb decision and NATO; Eisenhower with the Interstate Highway System and Little
        Rock; JFK with Cuban Missile Crisis; LBJ with the Civil Rights Act and Great Society; Nixon with
        Watergate and the EPA; Reagan with the Cold War endgame and supply-side economics. Memorize the pairings.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Lines of succession and key precedents
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Eight presidents have died in office (four by assassination — Lincoln, Garfield, McKinley, Kennedy; four
        from natural causes — W. H. Harrison, Taylor, Harding, FDR). Each time, the vice president took over
        immediately under what is now codified in the 25th Amendment (1967). The 25th also formalized procedures
        for presidential incapacity — used in modern times for routine medical procedures (Reagan, G. W. Bush)
        where the VP temporarily holds power.
      </Typography>

      <Callout kind="connect">
        The 22nd Amendment (1951, two-term limit) was a direct reaction to FDR\'s 12 years. The 25th Amendment
        (1967, succession and incapacity) was a direct reaction to the JFK assassination — for 14 months after
        Kennedy\'s death, there was no vice president and no procedure for filling the vacancy. The Constitution
        evolves in reaction to specific events; amendments are usually responding to a recent crisis.
      </Callout>
    </Box>
  );
}

// ── Constitutional Amendments Quick Reference ──────────────────────────
function SectionAmendments() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Twenty-seven amendments have been ratified since 1789. The first ten — the Bill of Rights — were
        ratified together in 1791. The remaining seventeen span over 230 years, each ratified in response to
        a specific historical pressure: war, social movement, technological change, or political crisis. The
        EOCEP loves to ask which amendment did what, and when it was ratified.
      </Typography>

      <Analogy title="Amendments as scar tissue">
        Each amendment is a scar from a specific wound in American history. The 13/14/15 from the Civil War.
        The 16/17/18/19 from Progressive Era reforms. The 24 from Jim Crow. The 26 from Vietnam. When you
        memorize an amendment, also memorize what was happening that made it necessary — that\'s usually the
        key to a tricky EOCEP question.
      </Analogy>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The Bill of Rights (1791)
      </Typography>
      <GuideTable
        headers={['Amendment', 'Right protected', 'EOCEP-relevant detail']}
        rows={[
          ['1st', 'Freedom of religion, speech, press, assembly, petition', 'The "five freedoms." Establishment Clause + Free Exercise Clause. Modern landmarks: Schenck (clear and present danger), Tinker (student speech), Citizens United (corporate political speech).'],
          ['2nd', 'Right to keep and bear arms', 'Originally read as a collective/militia right. Heller (2008) and McDonald (2010) established it as an INDIVIDUAL right binding on states.'],
          ['3rd', 'No quartering of soldiers in private homes during peacetime', 'Essentially obsolete. Almost no Supreme Court litigation. Useful EOCEP trivia.'],
          ['4th', 'No unreasonable searches and seizures; warrants require probable cause', 'Modern landmarks: Mapp v. Ohio (exclusionary rule applies to states), Terry v. Ohio (stop-and-frisk standard), Carpenter v. U.S. (cell-phone location data).'],
          ['5th', 'Grand jury, no double jeopardy, no self-incrimination ("plead the 5th"), no taking of property without just compensation, due process', 'The "Takings Clause" requires compensation when government takes private property. "Pleading the 5th" = refusing to incriminate oneself in court.'],
          ['6th', 'Speedy trial, public trial, impartial jury, right to confront witnesses, right to counsel', 'Gideon v. Wainwright (1963) extended right to counsel to indigent state-court defendants.'],
          ['7th', 'Right to civil jury trial in federal cases', 'Threshold is currently $20 in dispute. NOT incorporated against the states.'],
          ['8th', 'No excessive bail, no excessive fines, no cruel and unusual punishment', 'Major modern application: death-penalty restrictions for juveniles (Roper v. Simmons, 2005) and the intellectually disabled (Atkins v. Virginia, 2002).'],
          ['9th', 'Rights not listed in the Constitution still belong to the people', 'Catch-all preventing the Bill of Rights from being read as exhaustive. Cited in Griswold v. Connecticut (1965) on contraception privacy.'],
          ['10th', 'Powers not delegated to the federal government are reserved to states or to the people', 'Foundation of federalism. Cited frequently in modern federalism cases.'],
        ]}
      />

      <Callout kind="make-it-stick">
        Memorize the first five as the most-tested: <strong>1st = the five freedoms, 4th = search/seizure,
        5th = self-incrimination + due process, 6th = right to counsel and jury, 8th = no cruel/unusual</strong>.
        2nd, 3rd, 7th, 9th, 10th show up less often. Save your memorization energy for what the EOCEP actually
        asks.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Civil War / Reconstruction Amendments (1865–1870)
      </Typography>
      <GuideTable
        headers={['Amendment', 'Year', 'What it did']}
        rows={[
          ['11th', '1795', 'Limits federal-court jurisdiction over suits against states by citizens of other states. (Pre-Civil-War, listed here only because of its proximity to the Reconstruction Amendments.)'],
          ['12th', '1804', 'Separate Electoral College votes for President and Vice President. Replaced the original system that produced the 1800 Jefferson-Burr tie.'],
          ['13th', '1865', 'Abolished slavery and involuntary servitude (except as punishment for crime).'],
          ['14th', '1868', 'Birthright citizenship. Equal protection of the laws. Due process against STATE governments.'],
          ['15th', '1870', 'Voting rights cannot be denied based on race, color, or previous condition of servitude.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Progressive Era Amendments (1913–1920)
      </Typography>
      <GuideTable
        headers={['Amendment', 'Year', 'What it did']}
        rows={[
          ['16th', '1913', 'Federal income tax. Made the modern federal government fiscally possible.'],
          ['17th', '1913', 'Direct popular election of U.S. Senators (previously chosen by state legislatures).'],
          ['18th', '1919', 'National Prohibition of alcohol. REPEALED by the 21st Amendment in 1933.'],
          ['19th', '1920', 'Women\'s suffrage. 70+ years of organizing finally enshrined nationally.'],
        ]}
      />

      <Callout kind="watch-for">
        The 18th and 21st are the only amendment-pair where one explicitly repeals another. If an EOCEP question
        asks "which amendment was repealed?" — the answer is always 18 (Prohibition), repealed by 21 in 1933.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        20th-century reform Amendments (1933–1992)
      </Typography>
      <GuideTable
        headers={['Amendment', 'Year', 'What it did']}
        rows={[
          ['20th', '1933', 'Shortened "lame duck" period — president now inaugurated January 20 instead of March 4.'],
          ['21st', '1933', 'Repealed Prohibition. The only amendment ever to repeal another.'],
          ['22nd', '1951', 'Two-term limit on presidents. Direct response to FDR\'s four-term run.'],
          ['23rd', '1961', 'Gave D.C. residents electoral votes in presidential elections (3 electoral votes).'],
          ['24th', '1964', 'Banned poll taxes in federal elections. (Harper v. Virginia, 1966, extended to state elections.)'],
          ['25th', '1967', 'Presidential succession and disability procedures. Direct response to JFK\'s assassination, which left a 14-month vacancy in the VP slot.'],
          ['26th', '1971', 'Voting age lowered to 18. Direct response to Vietnam — "old enough to fight, old enough to vote."'],
          ['27th', '1992', 'Congressional pay raises take effect only after the NEXT election. Originally proposed by Madison in 1789 — ratified 202 years later.'],
        ]}
      />

      <Callout kind="connect">
        Three 20th-century amendments responded directly to specific events: 22nd (FDR\'s four terms), 25th (JFK
        assassination), 26th (Vietnam draft). This is a recurring pattern in U.S. constitutional history —
        amendments tend to ratify what already feels obvious in hindsight, after a specific crisis exposes a gap
        in the existing text.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        The amendment process — why so few?
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Only 27 amendments in 235+ years isn\'t an accident — the Founders deliberately made amendment HARD.
        Article V requires a 2/3 vote in both houses of Congress (or a convention called by 2/3 of state
        legislatures) AND ratification by 3/4 of state legislatures (or state conventions). Thousands of
        amendments have been proposed; almost all die in committee. The Equal Rights Amendment came closest —
        proposed in 1972, ratified by 35 of 38 needed states by the 1979 deadline, then stalled.
      </Typography>

      <MermaidDiagram
        chart={`
flowchart TD
    A[Proposal stage] --> B{Method 1: 2/3 of House AND 2/3 of Senate}
    A --> C{Method 2: Convention called by 2/3 of state legislatures}
    C --> D[Never used in U.S. history]
    B --> E[Ratification stage]
    E --> F{3/4 of state legislatures}
    E --> G{3/4 of state conventions}
    F --> H[Amendment ratified]
    G --> H
        `}
      />

      <Callout kind="why-it-matters">
        Method 2 — a constitutional convention called by 2/3 of state legislatures — has NEVER been used. The
        only convention in U.S. history (1787 in Philadelphia) wrote the original Constitution. There is
        ongoing debate about whether a modern Article V convention could be limited to a single topic or
        whether it could become a "runaway convention" rewriting larger portions of the Constitution.
        Practical caution explains why this path stays untried.
      </Callout>
    </Box>
  );
}

// ── Significant Acts of Congress Quick Reference ───────────────────────
function SectionActsOfCongress() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Congressional statutes (laws) often shape American history as decisively as constitutional amendments
        or Supreme Court rulings. The EOCEP regularly asks "what did the X Act do?" or "in what context was Y
        Act passed?" — here is the cheat sheet of the most-tested acts in U.S. history.
      </Typography>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Reconstruction and Gilded Age
      </Typography>
      <GuideTable
        headers={['Act', 'Year', 'What it did']}
        rows={[
          ['Civil Rights Act of 1866', '1866', 'First federal definition of citizenship; equal rights regardless of race. Constitutionalized as 14th Amendment in 1868.'],
          ['Reconstruction Acts', '1867–68', 'Divided the former Confederacy into 5 military districts; required new state constitutions ratifying the 14th Amendment.'],
          ['Pendleton Civil Service Act', '1883', 'Replaced patronage hiring (the "spoils system") with merit-based federal civil service. A reaction to President Garfield\'s assassination by a disappointed office-seeker.'],
          ['Interstate Commerce Act', '1887', 'Created the Interstate Commerce Commission (ICC) — first federal regulatory agency. Regulated railroad rates.'],
          ['Sherman Antitrust Act', '1890', 'Banned monopolies and "restraints of trade." Initially used against labor unions; later weaponized by Theodore Roosevelt against industrial trusts.'],
          ['Chinese Exclusion Act', '1882', 'First federal law restricting immigration by nationality. Banned almost all Chinese immigration. Not repealed until 1943.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Progressive Era
      </Typography>
      <GuideTable
        headers={['Act', 'Year', 'What it did']}
        rows={[
          ['Pure Food and Drug Act', '1906', 'Federal food and drug regulation. Direct response to Upton Sinclair\'s The Jungle.'],
          ['Meat Inspection Act', '1906', 'Federal inspection of meatpacking plants. Also a response to The Jungle.'],
          ['Federal Reserve Act', '1913', 'Created the modern central bank (the Fed). 12 regional Reserve Banks + Board of Governors.'],
          ['Clayton Antitrust Act', '1914', 'Strengthened the Sherman Act. Explicitly exempted labor unions from antitrust prosecution.'],
          ['Federal Trade Commission Act', '1914', 'Created the FTC to regulate "unfair methods of competition."'],
          ['Selective Service Act', '1917', 'Created WWI draft.'],
          ['Espionage and Sedition Acts', '1917–18', 'Criminalized anti-war speech. Used to convict Eugene Debs.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        New Deal
      </Typography>
      <GuideTable
        headers={['Act', 'Year', 'What it did']}
        rows={[
          ['Emergency Banking Act', '1933', 'FDR\'s first New Deal law (passed Day 5). Halted bank runs and restored confidence.'],
          ['Glass-Steagall Act', '1933', 'Separated commercial from investment banking; created the FDIC.'],
          ['National Industrial Recovery Act', '1933', 'Created the NRA. Struck down by Supreme Court in 1935 (Schechter case).'],
          ['Agricultural Adjustment Act', '1933', 'Paid farmers to reduce production. Struck down 1936 (United States v. Butler).'],
          ['Tennessee Valley Authority Act', '1933', 'Created TVA — public hydroelectric power, flood control, regional development.'],
          ['Social Security Act', '1935', 'Old-age pensions, unemployment insurance, aid to dependent children. The most enduring New Deal program.'],
          ['Wagner Act (NLRA)', '1935', 'Guaranteed labor rights to organize, bargain collectively, and strike. Created the National Labor Relations Board.'],
          ['Fair Labor Standards Act', '1938', 'Minimum wage, 40-hour workweek, child labor restrictions. Framework still in force today.'],
        ]}
      />

      <Callout kind="make-it-stick">
        Three New Deal acts have lasted the test of time and define modern American economic life: <strong>Social
        Security (1935)</strong>, <strong>Wagner Act (1935)</strong>, <strong>Fair Labor Standards Act (1938)</strong>.
        These three established the federal floor for retirement security, labor rights, and minimum-wage / hours
        regulation — and all three remain in force.
      </Callout>

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        WWII and Postwar
      </Typography>
      <GuideTable
        headers={['Act', 'Year', 'What it did']}
        rows={[
          ['Lend-Lease Act', '1941', 'Authorized FDR to lend or lease war supplies to any nation whose defense the President deemed vital to U.S. security. End-ran around isolationist Neutrality Acts.'],
          ['G.I. Bill', '1944', 'Education, home-loan, and unemployment benefits for returning WWII veterans. Built postwar middle class.'],
          ['Taft-Hartley Act', '1947', 'Restricted union activities; permitted state "right-to-work" laws. Republican response to growing labor militancy.'],
          ['National Security Act', '1947', 'Created the modern Department of Defense, the CIA, and the National Security Council.'],
          ['Marshall Plan', '1948–52', '$13 billion in aid to rebuild Western Europe (Economic Recovery Act of 1948).'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Civil Rights era
      </Typography>
      <GuideTable
        headers={['Act', 'Year', 'What it did']}
        rows={[
          ['Civil Rights Act of 1957', '1957', 'First civil rights legislation since Reconstruction. Created the Civil Rights Division at DOJ.'],
          ['Civil Rights Act of 1964', '1964', 'Banned discrimination in employment, public accommodations, and federally-funded programs based on race, color, religion, sex, or national origin.'],
          ['Voting Rights Act', '1965', 'Banned literacy tests; authorized federal observers; required preclearance of voting rule changes in covered jurisdictions.'],
          ['Immigration and Nationality Act', '1965', 'Replaced national-origin quotas with family-reunification preferences. Dramatically reshaped U.S. demographics.'],
          ['Fair Housing Act (Civil Rights Act of 1968)', '1968', 'Banned discrimination in housing sales, rentals, and financing. Signed days after MLK\'s assassination.'],
        ]}
      />

      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 2.5, mb: 1, fontSize: '1.05rem' }}>
        Great Society and modern era
      </Typography>
      <GuideTable
        headers={['Act', 'Year', 'What it did']}
        rows={[
          ['Social Security Amendments (Medicare/Medicaid)', '1965', 'Medicare (health insurance for seniors) and Medicaid (federal-state health insurance for the poor). LBJ\'s signature Great Society programs.'],
          ['Elementary and Secondary Education Act', '1965', 'Major federal funding for K-12 education. Title I directs federal aid to high-poverty schools.'],
          ['Clean Air Act / Clean Water Act / Endangered Species Act', '1970, 1972, 1973', 'Foundation of modern federal environmental law. Created the EPA (1970) and dramatically reduced industrial pollution.'],
          ['Title IX (Education Amendments)', '1972', 'Banned sex discrimination in federally-funded education. Transformed school athletics and addresses harassment.'],
          ['War Powers Resolution', '1973', 'Required president to notify Congress within 48 hours of committing armed forces abroad. Reaction to Vietnam-era unilateralism.'],
          ['Americans with Disabilities Act', '1990', 'Banned discrimination based on disability in employment, public accommodations, and government services.'],
        ]}
      />

      <Callout kind="connect">
        Note the clustering: 1964–65 and 1970–73 are the most concentrated bursts of major federal legislation
        since the New Deal. Both responded to specific social movements (civil rights / Vietnam-era environmental
        and consumer activism) AND benefited from large Democratic majorities in Congress. The political
        opportunity windows that produce huge legislative outputs are rare and brief.
      </Callout>
    </Box>
  );
}

// ── Glossary section (renders the imported glossary as a table) ───────
function SectionGlossary() {
  return (
    <Box>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        Terms an 11th grader is expected to recognize on the SC EOCEP. Use the Practice tab and Flashcards tab to
        drill these into memory; here they\'re organized in one place for quick reference.
      </Typography>
      <GuideTable
        headers={['Term', 'Definition']}
        rows={glossary.map(g => [g.term, g.definition])}
      />
    </Box>
  );
}
