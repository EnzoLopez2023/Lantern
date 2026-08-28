// PFIN Study Guide — accordion-based layout for SC Personal Finance (11th grade).
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

const READING_PROGRESS_KEY = 'exam-prep-reading:PFIN';
const COMPLETION_KEY = 'exam-prep-completed:PFIN';
const QUIZ_STORAGE_KEY = 'exam-prep-quiz:PFIN';

const SECTION_SUBDOMAINS: Record<string, string> = {
  s2: 'Earning Income',
  s3: 'Budgeting & Spending',
  s4: 'Saving & Banking',
  s5: 'Credit & Debt',
  s6: 'Investing & Markets',
  s7: 'Insurance & Risk Management',
  s8: 'Taxes & Government Programs',
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
  { id: 's1',      num: '1',  title: 'The Big Picture',              icon: '🗺️' },
  { id: 's2',      num: '2',  title: 'Earning Income',               icon: '💰' },
  { id: 's3',      num: '3',  title: 'Budgeting & Spending',         icon: '📊' },
  { id: 's4',      num: '4',  title: 'Saving & Banking',             icon: '🏦' },
  { id: 's5',      num: '5',  title: 'Credit & Debt',                icon: '💳' },
  { id: 's6',      num: '6',  title: 'Investing & Markets',          icon: '📈' },
  { id: 's7',      num: '7',  title: 'Insurance & Risk Management',  icon: '🛡️' },
  { id: 's8',      num: '8',  title: 'Taxes & Government Programs',  icon: '🏛️' },
  { id: 's-strat', num: '★',  title: 'Exam-Day Strategy',            icon: '🎯' },
  { id: 's-gloss', num: '📚', title: 'Glossary',                     icon: '📚' },
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
    case 's2':      return <Section2EarningIncome />;
    case 's3':      return <Section3Budgeting />;
    case 's4':      return <Section4SavingBanking />;
    case 's5':      return <Section5CreditDebt />;
    case 's6':      return <Section6Investing />;
    case 's7':      return <Section7Insurance />;
    case 's8':      return <Section8Taxes />;
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Why Personal Finance?</Typography>

      <Analogy title="The instruction manual for your own life's business">
        Every business — even a tiny one-person shop — needs an operating plan: how much money comes in, how much goes
        out, what gets saved for slow months, what gets invested to grow the operation, and how to handle risk. Most
        businesses that fail do so not because they make a bad product, but because they mismanage the money side.
        You are your own life's business. Your income is revenue. Your spending is expenses. Your savings are retained
        earnings. Your investments are capital allocation. Personal finance is the instruction manual for running that
        business — and unlike a corporate finance course, this one is entirely about decisions you will make starting
        in the next few years.
      </Analogy>

      <Typography sx={{ mb: 2, lineHeight: 1.75 }}>
        Personal finance covers every decision individuals and households make about earning, spending, saving,
        borrowing, investing, and protecting money. Unlike accounting (which describes what happened) or economics
        (which describes how markets and governments work), personal finance is prescriptive — it tells you what
        to do and in what order. The goal is not to maximize wealth at all costs; it's to give you enough financial
        security and flexibility that money stops being a source of stress and starts being a tool for the life
        you actually want.
      </Typography>

      <Callout kind="why-it-matters">
        The average American carries over $6,000 in credit card debt, has less than $1,000 saved for emergencies,
        and will spend more on interest over a lifetime than on a college education. These outcomes are not caused
        mainly by low income — they're caused by financial habits formed without a foundation. Most adults were never
        taught this material in school. You are getting it now, which is a significant head start.
      </Callout>

      <Analogy title="Knowing this material is a superpower most adults never got in school">
        Imagine two people starting identical jobs at 22 with identical salaries. One knows about compound interest,
        credit scores, tax-advantaged accounts, and the difference between an insurance deductible and a premium.
        The other doesn't. By 45, the financially literate one will have dramatically more wealth, lower debt costs,
        and fewer financial crises — not because they earned more, but because they understood the rules of the game.
        This course hands you the rulebook early.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Seven Domains</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        The course is organized into seven interconnected domains. Each builds on the others — you can't invest wisely
        without first budgeting, can't use credit responsibly without understanding interest, and taxes affect almost
        every other domain. Think of them as seven gears in a single machine: all must mesh for the system to run well.
        Weakness in one creates friction everywhere else.
      </Typography>

      <GuideTable
        headers={['Domain', 'Core question', 'Why it matters now']}
        rows={[
          ['Earning Income', 'How do I maximize and understand my paycheck?', 'Your first full-time job is closer than you think'],
          ['Budgeting & Spending', 'Where does my money go — and where should it?', 'Habits formed now compound for decades'],
          ['Saving & Banking', 'How do I grow money I don\'t spend?', 'Compound interest rewards early starters dramatically'],
          ['Credit & Debt', 'How do I borrow without trapping myself?', 'Your credit score follows you everywhere from age 18'],
          ['Investing & Markets', 'How do I make money work for me over time?', 'Time is your single biggest investing advantage'],
          ['Insurance & Risk', 'How do I protect against financial catastrophe?', 'One uninsured accident can wipe out years of savings'],
          ['Taxes & Government', 'How does the government affect my money?', 'You will owe taxes every year of your working life'],
        ]}
      />

      <MermaidDiagram chart={`flowchart TD
  A["Personal Finance"] --> B["Earning Income\n(your paycheck foundation)"]
  A --> C["Budgeting & Spending\n(directing every dollar)"]
  A --> D["Saving & Banking\n(compound growth)"]
  A --> E["Credit & Debt\n(borrowing responsibly)"]
  A --> F["Investing & Markets\n(long-term wealth)"]
  A --> G["Insurance & Risk\n(protecting what you build)"]
  A --> H["Taxes & Government\n(the rules of the game)"]`} />

      <Analogy title="Every paycheck decision compounds — in both directions">
        A dollar saved at 17 invested at 8% becomes roughly $35 at age 65. A dollar borrowed at 22% APR and carried
        for years costs you several dollars by the time it's repaid. Decisions that seem tiny — skip the savings
        transfer this month, carry the credit card balance for one more statement cycle — compound just like interest
        does, for better or worse. This is why the order of financial decisions matters as much as the decisions
        themselves.
      </Analogy>

      <Typography variant="h6" sx={{ fontWeight: 700, mt: 3, mb: 1 }}>The Financial Priority Ladder</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.7 }}>
        When money is limited, you need a priority order. Most financial planners agree on the sequence below because
        each step creates the foundation the next step rests on. Trying to invest before you have an emergency fund,
        for example, usually means liquidating investments at the worst time when an unexpected expense hits.
      </Typography>

      <GuideTable
        headers={['Priority', 'Action', 'Why this order']}
        rows={[
          ['1', 'Meet basic needs (rent, food, utilities, minimum debt payments)', 'Without these, nothing else functions'],
          ['2', 'Build a starter emergency fund ($500–$1,000)', 'Prevents new debt when small emergencies hit'],
          ['3', 'Capture any employer retirement match', 'Guaranteed 50–100% return — beats all alternatives'],
          ['4', 'Pay down high-interest debt (credit cards first)', 'Guaranteed risk-free return equal to the rate'],
          ['5', 'Build full emergency fund (3–6 months of expenses)', 'Covers job loss and major unexpected expenses'],
          ['6', 'Invest for long-term goals (retirement, college)', 'Time and compound growth do the heavy lifting'],
          ['7', 'Save for medium-term goals and protect with insurance', 'Preserve wealth you\'ve already built'],
        ]}
      />

      <Callout kind="make-it-stick">
        As you study each domain, ask yourself: "What decision will I actually make about this in the next 2–5 years?"
        That real-world connection is what turns information into financial judgment. The goal isn't to memorize
        definitions — it's to make better choices automatically when real situations arrive.
      </Callout>

      <Callout kind="coachs-note">
        The seven domains are tested as one integrated subject, not as seven separate silos. Questions often blend
        two domains — a paycheck question that also tests tax knowledge, or a savings question that involves
        understanding bank account types. Read every scenario question carefully and identify every financial
        concept it touches before choosing an answer.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 2: Earning Income
// ─────────────────────────────────────────────────────────────────────
function Section2EarningIncome() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Your Paycheck Is Not What You Think</Typography>

      <Analogy title="Gross pay as a whole fruit — net pay is what you actually eat after peeling">
        Imagine picking a mango off a tree. The whole mango is your gross pay — the total fruit you earned. Before
        you can eat it, you peel the skin (federal income tax), trim the fibrous part near the pit (Social Security),
        remove a small slice for the neighbor who helped you plant the tree (Medicare), and your state might take
        another wedge too. What remains after all that peeling and slicing is your net pay — the actual fruit you
        get to eat. Budgeting with gross pay is like planning meals using the whole mango including the skin.
        Always plan with net.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Gross pay</strong> is your total earnings before any deductions. <strong>Net pay</strong> (take-home
        pay) is what you receive after all withholdings. The gap between them surprises most people on their first
        paycheck — it can be 25–35% of gross. Understanding what comes out and why is the first step to actually
        controlling your finances.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Types of Compensation</Typography>

      <GuideTable
        headers={['Compensation type', 'How it works', 'Predictability', 'Common industries']}
        rows={[
          ['Salary', 'Fixed annual amount paid in equal installments (biweekly, semimonthly, or monthly). Same amount regardless of hours worked in a week.', 'Very high', 'Management, office, professional roles'],
          ['Hourly wage', 'Rate × hours worked. Overtime at 1.5× the regular rate for hours over 40 in a week (federal law).', 'High if hours are stable', 'Retail, food service, manufacturing, trades'],
          ['Commission', 'Percentage of sales closed. Example: 5% commission on $20,000 in sales = $1,000.', 'Variable — tied to performance', 'Sales, real estate, insurance'],
          ['Tips', 'Voluntary payments from customers. Must be reported as taxable income. Employers may credit tips toward minimum wage in some states.', 'Variable', 'Restaurant, hospitality, delivery'],
          ['Bonus', 'One-time additional payment tied to performance, company results, or milestones. Not guaranteed.', 'Irregular', 'Finance, tech, corporate roles'],
          ['Profit sharing', 'Employees receive a share of company profits, often quarterly or annually. Amount varies.', 'Variable', 'Manufacturing, partnerships'],
          ['Gig / freelance', 'Project-based payment. No employer FICA withholding — the worker pays both halves of FICA (15.3%) as self-employment tax.', 'Low — no guaranteed income', 'Rideshare, creative, consulting'],
        ]}
      />

      <Callout kind="watch-for">
        Overtime is calculated on hours over 40 per <em>week</em>, not hours over 8 per day (federal law — some
        states are stricter). The overtime rate is 1.5 times the <em>regular hourly rate</em>, not 1.5 times net
        pay. Always calculate overtime on gross hourly before any deductions. Example: regular rate $16/hour,
        overtime rate = $24/hour. If an employee works 45 hours: (40 × $16) + (5 × $24) = $640 + $120 = $760 gross.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Paycheck Anatomy: What Gets Deducted</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every paycheck has two categories of deductions: <strong>mandatory</strong> (required by law — you can't
        opt out) and <strong>voluntary</strong> (elected by the employee for benefits or savings). Understanding
        both helps you verify your paycheck is correct and make smart elections during benefits enrollment.
      </Typography>

      <GuideTable
        headers={['Deduction type', 'Examples', 'Who controls it', 'Notes']}
        rows={[
          ['Federal income tax (mandatory)', 'Withheld based on your W-4 and current tax brackets', 'IRS determines rates; you control amount via W-4 elections', 'Reconciled on Form 1040 in April'],
          ['State income tax (mandatory)', 'Varies by state; some states have no income tax (TX, FL, SD, WA, etc.)', 'State government', 'South Carolina has a graduated income tax up to 6.5%'],
          ['Social Security / OASDI (mandatory)', '6.2% of wages up to the annual wage base', 'Required by FICA; no employee option', 'Builds your future Social Security retirement benefit'],
          ['Medicare (mandatory)', '1.45% of all wages (no wage cap; additional 0.9% over $200,000)', 'Required by FICA', 'Funds Medicare coverage starting at age 65'],
          ['Health insurance premium (voluntary)', 'Employee share of employer-sponsored health plan', 'Employee elects during open enrollment', 'Often pre-tax, reducing taxable income'],
          ['401(k) / 403(b) contribution (voluntary)', 'Percentage of pay contributed to retirement account', 'Employee sets percentage (up to IRS annual limit)', 'Pre-tax contribution lowers taxable income'],
          ['FSA / HSA contribution (voluntary)', 'Pre-tax dollars for qualified medical or dependent care expenses', 'Employee elects; FSA is use-it-or-lose-it mostly', 'HSA rolls over indefinitely — a powerful savings tool'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  A["Gross Pay (Total Earnings Before Deductions)"]
  A --> B["Mandatory Deductions\n• Federal income tax (W-4-based)\n• State income tax\n• Social Security 6.2%\n• Medicare 1.45%"]
  A --> C["Voluntary Deductions\n• 401k / 403b contribution\n• Health insurance premium\n• Dental / vision premium\n• FSA / HSA contribution"]
  B --> D["Net Pay (Take-Home Pay)\nThe amount deposited to your account"]
  C --> D`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>FICA: Social Security and Medicare Taxes</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        FICA (Federal Insurance Contributions Act) taxes fund Social Security (6.2% of wages) and Medicare (1.45% of
        wages). Every employed American pays these, and their employer matches the same amounts — so together, 15.3%
        of wages flows into these programs per employee. Freelancers and self-employed workers pay the full 15.3%
        themselves (called self-employment tax) because there is no employer to match.
      </Typography>

      <Callout kind="connect">
        FICA isn't "lost" money — it directly builds your future. Each year of Social Security-taxed wages earns
        you up to four Social Security "credits." You need 40 credits (roughly 10 years of work) to qualify for
        retirement benefits. Higher lifetime earnings = higher monthly benefit. The Medicare portion funds the
        health coverage you'll receive starting at age 65. Think of FICA as a mandatory retirement savings
        and insurance contribution, not just a tax.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The W-4 and W-2: Two Different Documents</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The <strong>W-4 (Employee's Withholding Certificate)</strong> is filled out when you start a job and any
        time your situation changes. It tells your employer how much federal income tax to withhold from each
        paycheck. Claiming more allowances reduces withholding (you get more each check but may owe in April);
        claiming fewer allowances increases withholding (smaller checks but likely a refund).
      </Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The <strong>W-2 (Wage and Tax Statement)</strong> is what your employer sends every January. It summarizes
        your total wages and every dollar withheld during the prior year. You use it to file your tax return. Key
        boxes: Box 1 (taxable wages), Box 2 (federal income tax withheld), Boxes 3–6 (Social Security and Medicare
        wages and taxes). If Box 2 is higher than your actual tax liability, you get a refund. If it's lower, you owe.
      </Typography>

      <Callout kind="in-plain-words">
        W-4: filled out at the <em>start</em> of employment — "Here's how much to withhold from each check going
        forward." W-2: received in January for the <em>prior</em> year — "Here's a summary of everything withheld
        all year." One is prospective, one is retrospective. You will never fill out a W-2; you will fill out a W-4.
        You will receive a W-2 but never submit it — you use it to prepare your 1040.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Total Compensation: The Benefits You Don't See on Your Paycheck</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Salary is only one part of what an employer offers. Benefits — health insurance, dental and vision coverage,
        employer retirement contributions, paid time off, disability insurance, and other perks — often add 25–40%
        of additional value on top of base salary. Smart job comparisons always calculate <strong>total compensation</strong>,
        not just the salary number on the offer letter.
      </Typography>

      <Analogy title="Benefits as the invisible salary that doesn't appear on your paycheck">
        If your employer pays $500/month toward your health insurance premium, contributes 4% of your salary to
        your 401(k), and gives you 15 days of paid vacation worth about 6% of your salary — none of that appears
        in your take-home pay. But it is absolutely real compensation. A job offering $42,000 salary with those
        benefits is often worth more than a $47,000 salary with no benefits. The benefits are a salary you
        receive in a different form — lower out-of-pocket costs and future wealth rather than a bigger direct deposit.
      </Analogy>

      <GuideTable
        headers={['Benefit', 'Approximate value', 'What it replaces']}
        rows={[
          ['Employer health insurance contribution', '$400–$700/month ($4,800–$8,400/year)', 'Individual plan premiums you\'d pay yourself'],
          ['Employer 401(k) match (4% on $40k salary)', '$1,600/year', 'Investment you\'d have to fund entirely yourself'],
          ['Paid time off (15 days on $40k salary)', '≈ $2,300/year', 'Unpaid days or vacation you can\'t afford'],
          ['Short-term disability insurance', 'Varies; 60% of salary for covered period', 'Income lost if you can\'t work temporarily'],
          ['Life insurance (1–2× salary)', 'Term coverage worth $40,000–$80,000', 'Policy you\'d buy independently'],
          ['FMLA leave (unpaid but job-protected)', 'Job security during family/medical leave', 'Having to quit to deal with major life events'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Salary Negotiation Basics</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Negotiating your starting salary is one of the highest-value financial decisions you can make, because
        raises and future offers are often anchored to your current compensation. Key principles: research the
        market rate for the role in your area before negotiating (sites like Glassdoor, Bureau of Labor Statistics,
        and LinkedIn Salary); negotiate after receiving an offer, not during the interview; ask for the full package
        (salary, signing bonus, extra PTO, remote work flexibility) not just base pay; never give your current
        or expected salary first — let them offer first.
      </Typography>

      <Callout kind="try-this">
        Practice total compensation math. Job A: $40,000 salary, employer pays $450/month health premium, 4%
        401(k) match. Job B: $45,000 salary, no benefits. Job A total compensation: $40,000 + ($450 × 12) +
        ($40,000 × 0.04) = $40,000 + $5,400 + $1,600 = $47,000 effective compensation. Job A is actually worth
        more. Now factor in that 401(k) match is pre-tax growth — it's worth even more long-term. Always run
        the full calculation before deciding which offer to accept.
      </Callout>

      <Callout kind="make-it-stick">
        The four numbers every paycheck reader must know: (1) gross pay — total earned before any deductions;
        (2) FICA total — 7.65% of gross (6.2% + 1.45%); (3) federal and state income tax withheld — varies by
        your W-4 and bracket; (4) net pay — the amount actually deposited. If gross − all deductions ≠ net,
        your paycheck has an error worth investigating. Payroll mistakes do happen.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 3: Budgeting & Spending
// ─────────────────────────────────────────────────────────────────────
function Section3Budgeting() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>A Budget Is Just a Plan — But Plans Change Everything</Typography>

      <Analogy title="A budget as a game plan for your money — without one, money goes wherever and you wonder where it went">
        A sports team with no game plan doesn't automatically lose — but they'll be reacting to the other team
        instead of executing their own strategy. After the game, they'll struggle to explain why things went wrong.
        Money without a budget works the same way: it disappears into coffee runs, streaming services, and impulse
        purchases, and at the end of the month you genuinely can't account for where it went. A budget isn't a cage —
        it's a game plan. You still get to choose how to play. But you choose intentionally, before the money is spent,
        instead of wondering afterward.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        A budget is a written plan that allocates income to spending categories <em>before</em> the money is spent.
        The critical word is "before." A record of what you already spent is just accounting. A budget is a decision
        made in advance. Always build your budget on <strong>net income</strong> (take-home pay after taxes and
        deductions) — you cannot spend money that goes to taxes before you ever see it.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Needs vs. Wants: The Foundation of Every Budget</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        A <strong>need</strong> is something required for survival or to maintain your ability to work and function:
        housing, food, water, utilities, basic transportation to work, essential medication, and minimum debt payments.
        A <strong>want</strong> is anything that improves comfort or enjoyment beyond the functional minimum:
        streaming subscriptions, dining out, gaming equipment, new clothing beyond basic necessity, vacations,
        and entertainment.
      </Typography>

      <Callout kind="in-plain-words">
        The need/want line is genuinely blurry in practice. A cell phone is almost certainly a need in modern
        life — an employer expects to reach you, and many jobs require smartphone access. But the newest iPhone
        model when a $200 smartphone covers every need is a want. A car may be a need if public transit can't
        get you to work; a brand-new car with a $500/month payment when a $150/month used car would do the job
        is a want. The useful question is: "What's the cheapest version of this I could genuinely function with?"
        The difference between that floor and what you're buying is want territory.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Types of Expenses</Typography>

      <GuideTable
        headers={['Expense type', 'Definition', 'Examples', 'How to budget for it']}
        rows={[
          ['Fixed', 'Same dollar amount every month; doesn\'t change with usage', 'Rent, mortgage, car payment, loan minimum payments, subscription at a set price', 'List the exact amount — easy and predictable'],
          ['Variable', 'Fluctuates month to month based on usage or choices', 'Groceries, gas, electricity, dining out, clothing', 'Estimate a monthly average; track actual vs. estimated; adjust quarterly'],
          ['Periodic', 'Doesn\'t happen every month but is predictable and should be expected', 'Car registration, holiday gifts, annual subscriptions, car insurance paid semi-annually, school supplies', 'Total all periodic costs for the year, divide by 12, set aside that amount monthly'],
        ]}
      />

      <Callout kind="watch-for">
        Periodic expenses are the single most common reason "good budgets" fail. People budget perfectly for
        fixed and variable expenses, then November hits with holiday gifts, or March brings car registration,
        and the budget blows up. The fix is simple: list every expense that happens at least once per year,
        total them, divide by 12, and treat that monthly piece as a non-negotiable savings line item called
        "sinking fund." When the periodic bill arrives, the money is already waiting.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The 50/30/20 Rule</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The 50/30/20 rule is a popular starting framework: allocate 50% of after-tax income to needs, 30% to wants,
        and 20% to savings and debt repayment. It's not a rigid law — housing costs in expensive cities may push
        needs above 50%, and people with high debt may temporarily redirect the wants slice to debt payoff — but
        it's a quick diagnostic check. If your needs are eating 75% of your income, something needs to change.
      </Typography>

      <Analogy title="The 50/30/20 rule as dividing a pizza — each slice has a purpose">
        Imagine your monthly take-home pay as a large pizza. Before anyone touches it, you pre-cut it into three
        sections: half goes to the table (needs — these people eat first, every time, no matter what); three tenths
        goes to the enjoyment zone (wants — this is your life, not just your survival); two tenths goes into a
        sealed box for later (savings and debt repayment — future-you's share). The sealed box is what separates
        people who build wealth from people who wonder where it all went. You can renegotiate slice sizes as your
        life changes, but every slice needs a destination before the first bite.
      </Analogy>

      <MermaidDiagram chart={`graph TD
  A["Step 1: Calculate monthly net income\n(after-tax take-home pay)"]
  A --> B["Step 2: List ALL monthly expenses\n(fixed + variable + periodic/12)"]
  B --> C["Step 3: Categorize each expense\n(need or want)"]
  C --> D["Step 4: Compare totals to 50/30/20 benchmark\n(or your chosen allocation)"]
  D --> E{Income ≥ Total Expenses?}
  E -->|Yes — surplus| F["Allocate surplus to savings,\ninvestments, or extra debt payoff"]
  E -->|No — deficit| G["Identify wants to cut\nor income to increase"]
  F --> H["Track actual spending monthly\n(apps, spreadsheet, or manual log)"]
  G --> H`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Budgeting Methods Compared</Typography>

      <GuideTable
        headers={['Method', 'How it works', 'Best for', 'Main challenge']}
        rows={[
          ['50/30/20', 'Broad percentages: half needs, three-tenths wants, one-fifth savings', 'First-time budgeters needing a simple framework', 'May not catch specific spending leaks'],
          ['Zero-based budget', 'Every dollar gets assigned a job; income minus all allocations equals zero', 'People who want total control of each dollar', 'Time-intensive; requires monthly recreation'],
          ['Envelope method', 'Cash or digital "envelopes" per category; when the envelope is empty, spending stops', 'People who overspend in specific variable categories', 'Inconvenient for cashless transactions'],
          ['Pay yourself first', 'Transfer savings automatically on payday before any discretionary spending', 'People who save "whatever\'s left" (usually nothing)', 'Doesn\'t address spending categories explicitly'],
          ['Values-based budget', 'Align spending priorities with personal values and life goals explicitly', 'People motivated by meaning, not math', 'Requires self-awareness and periodic reflection'],
        ]}
      />

      <Callout kind="why-it-matters">
        "Lifestyle inflation" is the quiet budget destroyer that strikes when income rises. Every raise, every
        promotion, every new job — spending tends to rise to match the new income immediately. Nicer apartment,
        newer car, more dining out. The trap: savings never grows even as income does, because the entire raise
        gets absorbed into a higher lifestyle. The proven fix: when your income rises, automatically increase
        your savings transfer before you adjust your lifestyle. Save at least half of every raise before spending
        any of it.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Opportunity Cost and Mindful Spending</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every spending decision has a hidden cost: the next best thing you could have done with that money. This
        is opportunity cost. Spending $1,500 on a gaming setup means not having $1,500 as part of an emergency fund,
        not having it invested for retirement (where at 8% over 40 years it becomes over $32,000), and not using it
        to pay down debt at 20% APR (a guaranteed 20% return). You're not just choosing to buy the gaming setup —
        you're choosing NOT to do everything else that money could do.
      </Typography>

      <Callout kind="make-it-stick">
        Before any unplanned purchase over $50, pause for 24 hours. Behavioral finance research shows that
        most impulse purchase desire fades significantly within 24 hours. If you still want the item tomorrow
        and it fits your budget, buy it without guilt. If the desire evaporated, you just kept your money.
        This single habit, applied consistently, can save hundreds to thousands of dollars per year with almost
        no sacrifice of genuine enjoyment.
      </Callout>

      <Callout kind="connect">
        Budgeting is the hub that connects every other personal finance domain. Without a budget, you can't
        know how much you can save, how fast you can pay off debt, whether you can afford an insurance plan
        change, or when you'll be ready to invest. Every other section of this course assumes you have a
        working budget as the foundation. Get this domain right and the others become much easier.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 4: Saving & Banking
// ─────────────────────────────────────────────────────────────────────
function Section4SavingBanking() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Money That Makes Money</Typography>

      <Analogy title="Compound interest as a snowball rolling downhill — the longer it rolls, the faster it grows">
        Picture a small snowball at the top of a long hill. It's not impressive. But as it rolls downhill, it
        picks up a thin layer of new snow on every rotation. The layer it adds on rotation 500 is much bigger
        than the layer it added on rotation 5, because now there's much more surface area. That's compound
        interest. In year 1, your interest earned is tiny. In year 30, you earn interest on decades of accumulated
        interest, not just on your original deposit. The snowball doesn't grow because you add more snow at the
        top — it grows because you let it roll. Time is the hill.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The difference between <strong>simple interest</strong> (earned only on the original principal) and
        <strong> compound interest</strong> (earned on principal plus accumulated interest) seems small at first
        and enormous over time. This is why starting to save early — even with small amounts — produces dramatically
        better outcomes than saving larger amounts later. The math is not intuitive; the numbers have to be seen
        to be believed.
      </Typography>

      <GuideTable
        headers={['Concept', 'Formula', '$1,000 at 5% for 10 years', '$1,000 at 5% for 30 years']}
        rows={[
          ['Simple interest', 'I = P × r × t', '$500 interest → $1,500 total', '$1,500 interest → $2,500 total'],
          ['Compound (annually)', 'A = P(1 + r)ⁿ', '$628.89 interest → $1,628.89', '$3,321.94 interest → $4,321.94'],
          ['Compound (monthly)', 'A = P(1 + r/12)^(12t)', '$647.01 interest → $1,647.01', '$3,467.74 interest → $4,467.74'],
          ['Compound (daily)', 'A = P(1 + r/365)^(365t)', '$648.67 interest → $1,648.67', '$3,481.97 interest → $4,481.97'],
        ]}
      />

      <Callout kind="try-this">
        The Rule of 72 is a mental math shortcut: divide 72 by the annual interest rate to estimate how many
        years it takes your money to double. At 4% APY: 72 ÷ 4 = 18 years to double. At 6%: 72 ÷ 6 = 12 years.
        At 9%: 72 ÷ 9 = 8 years. At 2% (many traditional savings accounts): 72 ÷ 2 = 36 years to double.
        At 5% (high-yield savings): 72 ÷ 5 ≈ 14 years. The difference between a 2% and 5% account is not
        just 3 percentage points — it's 22 extra years of waiting to double your money.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Bank Account Types Compared</Typography>

      <GuideTable
        headers={['Account type', 'Purpose', 'Typical interest', 'Liquidity', 'Key limitation', 'Best use']}
        rows={[
          ['Checking account', 'Daily transactions: bills, debit purchases, direct deposit', 'Near 0%', 'Unlimited access', 'Little to no earnings', 'Paying bills; receiving paycheck'],
          ['Traditional savings account', 'Short-term savings goals; emergency fund', '0.01%–0.5% at big banks', 'High (may limit monthly withdrawals)', 'Low interest at traditional banks', 'Accessible savings; not growing quickly'],
          ['High-yield savings account (HYSA)', 'Emergency fund; short-term goals that need real return', '4%–5%+ (varies with Fed rate)', 'High', 'Usually online-only; transfer delays', 'Emergency fund that earns meaningful interest'],
          ['Money market account (MMA)', 'Higher-return savings with limited check-writing ability', '3%–5%', 'High (with restrictions)', 'Often requires higher minimum balance', 'Larger short-term balances needing flexibility'],
          ['Certificate of Deposit (CD)', 'Fixed-rate savings for a set term (3 months to 5 years)', '4%–6%+ depending on term', 'Low — early withdrawal penalty', 'Cannot access without penalty before maturity', 'Money you won\'t need for a defined period'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  A["You have money to save. When will you need it?"]
  A --> B{Within 1 month?}
  B -->|Yes| C["Checking Account\n— daily access, near-zero interest"]
  B -->|No| D{Within 1 year\n(could need it anytime)?}
  D -->|Yes| E["High-Yield Savings / HYSA\n— easy access + real interest"]
  D -->|No| F{Will you need it\non a specific date?}
  F -->|Yes, specific date| G["Certificate of Deposit (CD)\n— locked rate for your timeline"]
  F -->|No specific date| H["Money Market Account\n— higher balance, higher return"]`} />

      <Analogy title="An emergency fund as a spare tire — you hope you never need it but it saves you when you do">
        You don't drive around thinking about your spare tire. You didn't buy it because you expect a blowout —
        you bought it because you know that eventually, somewhere, the unexpected will happen, and you want to
        be able to keep moving without being stranded. An emergency fund is the financial equivalent. You don't
        save three to six months of expenses because you expect to lose your job next month. You save it because
        at some point in the next few years, something will go wrong — a medical bill, a car repair, a job loss —
        and without the spare tire, you'll be calling for a financial tow truck at 20% APR.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Emergency Fund: Your Financial First Line of Defense</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Financial planners universally recommend keeping 3–6 months of essential living expenses in a liquid,
        FDIC-insured account. "Essential expenses" means the costs you'd have to pay even during a financial
        emergency: rent, utilities, groceries, minimum debt payments, and basic transportation. Entertainment,
        dining out, and subscriptions are suspended during a true emergency — they don't count toward the target.
      </Typography>

      <Callout kind="why-it-matters">
        Research from the Federal Reserve consistently shows that Americans who have even $400–$1,000 in
        accessible savings are dramatically less likely to take on high-interest debt after unexpected expenses.
        The emergency fund is not just savings — it's the firewall between a bad week and a bad decade. Build
        it before investing for long-term goals, before paying extra on low-interest debt, before almost anything
        except minimum debt payments. It's the foundation everything else rests on.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>FDIC and NCUA: Your Deposit Insurance</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        The <strong>FDIC</strong> (Federal Deposit Insurance Corporation) insures deposits at member banks up to
        $250,000 per depositor, per bank, per ownership category. Credit unions are covered by the <strong>NCUA</strong>
        (National Credit Union Administration) with the same $250,000 limit. If your bank fails, the government
        makes you whole — typically within days. This protection is automatic and free; you don't apply for it.
      </Typography>

      <Callout kind="watch-for">
        FDIC covers deposit accounts: checking, savings, money market accounts, and CDs. It does NOT cover
        stocks, bonds, mutual funds, cryptocurrency, insurance products, or annuities — even if you purchased
        them through a bank branch. This distinction is frequently tested. If a question asks whether an
        investment account is FDIC-insured, the answer is always no. Only deposit accounts get FDIC protection.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>APY vs. APR: Comparing Savings Accounts Correctly</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>APY (Annual Percentage Yield)</strong> accounts for compounding frequency and shows the true
        annual return on a savings account. A 5% nominal rate compounded daily has a higher APY than 5% compounded
        monthly. Banks are legally required to disclose APY for savings products, making it the correct number
        to compare when shopping for accounts. <strong>APR (Annual Percentage Rate)</strong> is used for loans
        and credit — it does not account for compounding and is always lower than the true cost of carrying debt.
      </Typography>

      <Callout kind="coachs-note">
        "Pay yourself first" is the most powerful and most underused savings strategy. Set up an automatic
        transfer to your savings account for the same day your paycheck arrives — before you pay discretionary
        bills, before you check your balance, before any spending decisions. When savings is automated, you
        adjust your spending to whatever remains. When you try to save "whatever's left at the end of the month,"
        the answer is almost always nothing. Automate it once; benefit for decades.
      </Callout>

      <GuideTable
        headers={['Compounding frequency', 'Times compounded per year', 'Effective APY at 5% nominal', 'Vs. simple interest at 5%']}
        rows={[
          ['Annual', '1', '5.000%', '+$0.00 per $1,000 in year 1'],
          ['Quarterly', '4', '5.095%', '+$0.95 per $1,000 in year 1'],
          ['Monthly', '12', '5.116%', '+$1.16 per $1,000 in year 1'],
          ['Daily', '365', '5.127%', '+$1.27 per $1,000 in year 1'],
        ]}
      />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 5: Credit & Debt
// ─────────────────────────────────────────────────────────────────────
function Section5CreditDebt() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Credit: The Tool That Works for You or Against You</Typography>

      <Analogy title="A credit score as your financial GPA — built over time by consistent behavior">
        Your academic GPA isn't set by any single test. It's built over years by consistent performance on every
        assignment, quiz, project, and exam. One failed class hurts it. Years of strong grades build it. And just
        like a GPA, a credit score can be rebuilt — but it takes time, because the whole point is to measure
        your <em>pattern</em> of behavior, not a single moment. A credit score is your financial GPA: built by
        years of on-time payments, responsible borrowing, and account management. One missed payment is an F
        in an important class. Starting to build it early, carefully, gives you the most time to establish
        a strong average before it matters most.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Your <strong>credit score</strong> is a number between 300 and 850 (on the FICO scale) that summarizes
        how reliably you have repaid borrowed money. Lenders use it to decide whether to approve loans and at
        what interest rate. Landlords use it to decide whether to rent to you. Employers in some industries check it.
        Insurance companies use it. A high score saves you tens of thousands of dollars over a lifetime in lower
        interest rates. A low score can cost you opportunities — loan denials, higher deposits, worse rates on everything.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Five FICO Score Factors</Typography>

      <MermaidDiagram chart={`pie title FICO Score Components
  "Payment History (35%)" : 35
  "Amounts Owed / Utilization (30%)" : 30
  "Length of Credit History (15%)" : 15
  "New Credit / Inquiries (10%)" : 10
  "Credit Mix (10%)" : 10`} />

      <GuideTable
        headers={['Factor', 'Weight', 'What improves it', 'What hurts it']}
        rows={[
          ['Payment History', '35%', 'Every on-time payment; older accounts paid perfectly', 'Any late or missed payment (7-year damage); collections; bankruptcy'],
          ['Amounts Owed / Utilization', '30%', 'Keeping total credit card balances below 30% of total limits; paying in full monthly', 'High balances relative to limits; maxed-out cards'],
          ['Length of Credit History', '15%', 'Keeping old accounts open even if unused; starting credit early', 'Closing old accounts; having a very new credit file'],
          ['New Credit / Inquiries', '10%', 'Limiting applications; rate shopping within a short window (treated as one inquiry)', 'Multiple applications in a short period; many hard inquiries'],
          ['Credit Mix', '10%', 'Having both revolving (credit cards) and installment (auto loan, student loan) accounts', 'Having only one type of credit account'],
        ]}
      />

      <Callout kind="watch-for">
        Payment history is 35% of your score — by far the largest single factor. One missed payment can drop
        a good score by 50–100 points and stays on your credit report for seven years. The fix is simple and
        must be automated: set up autopay for at least the minimum payment on every account. You can always
        pay more manually, but autopay ensures you never accidentally miss a due date because of a busy week.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Credit Score Ranges and What They Mean</Typography>

      <GuideTable
        headers={['Score range', 'Category', 'Typical mortgage rate premium', 'Real-world impact']}
        rows={[
          ['800–850', 'Exceptional', 'Best available rates', 'Approved for virtually anything; lowest rates'],
          ['740–799', 'Very Good', 'Near-best rates', 'Strong approvals; favorable terms on most products'],
          ['670–739', 'Good', 'Average rates', 'Generally approved; room for improvement on terms'],
          ['580–669', 'Fair', '1–3% higher than exceptional', 'Approved for less; significantly worse interest rates'],
          ['300–579', 'Poor', 'May be declined or subprime only', 'Frequent denials; deposits required; predatory lenders target this range'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Credit Utilization: The Most Actionable Factor</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Credit utilization is the ratio of your total credit card balances to your total credit card limits.
        If you have $1,200 in balances across cards with a combined $5,000 limit, your utilization is 24%.
        Keeping it <strong>below 30%</strong> protects your score; below 10% is ideal for the highest scores.
        Utilization is recalculated every time your lender reports to the bureaus (usually monthly), so it
        can move quickly in either direction.
      </Typography>

      <Analogy title="APR as the price tag on borrowed money that you don't see until after you've already used it">
        Imagine going to a restaurant where the menu has no prices. You order a burger and eat it. Then the
        check arrives and it's $25 for a burger you thought was maybe $12. APR works similarly: you use the
        credit card before you feel the cost. The "price tag" on that balance is 20%, 25%, or even 30% APR —
        applied to whatever you leave on the card after the due date. The cost is real, but it arrives on
        the next statement, not at the moment of purchase. That delay is what makes credit card debt so
        psychologically easy to accumulate and so painfully expensive to repay.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>The Minimum Payment Trap</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Credit card companies set minimum payments low on purpose. A 2% minimum on a $3,000 balance at 22% APR
        is about $60/month. Paying only that minimum means you'll spend roughly 15 years paying off that purchase
        and pay more than $3,000 in interest — effectively buying the original item twice. The minimum payment
        keeps you in the debt relationship as long as possible, which maximizes the lender's profit.
      </Typography>

      <GuideTable
        headers={['Debt: $3,000 at 22% APR', 'Monthly payment', 'Months to payoff', 'Total interest paid', 'Total cost']}
        rows={[
          ['Minimum only (~2%)', '$60 to start', '~180 months (15 years)', '$3,210', '$6,210'],
          ['$100/month fixed', '$100', '47 months (~4 years)', '$671', '$3,671'],
          ['$150/month fixed', '$150', '27 months (~2 years)', '$367', '$3,367'],
          ['$200/month fixed', '$200', '19 months', '$245', '$3,245'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Debt Payoff Strategies</Typography>

      <GuideTable
        headers={['Strategy', 'Approach', 'Best for', 'Interest saved vs. minimum']}
        rows={[
          ['Debt Avalanche', 'Pay minimums on all; apply extra to highest-APR debt first', 'Mathematically optimal — minimizes total interest paid', 'Highest savings overall'],
          ['Debt Snowball', 'Pay minimums on all; apply extra to smallest balance first regardless of APR', 'Behavioral — quick wins build motivation and momentum', 'Lower than avalanche but still dramatic vs. minimum'],
          ['Debt Consolidation', 'Combine multiple debts into one loan at a lower APR', 'People with high-interest debt and good enough credit to qualify for lower rate', 'Varies — depends on new rate and fees'],
          ['Debt Avalanche + Automation', 'Avalanche order with automatic overpayments', 'Disciplined planners who won\'t be tempted to spend the extra', 'Maximum savings with minimum temptation'],
        ]}
      />

      <Callout kind="connect">
        Secured vs. unsecured debt affects both interest rates and consequences of default. A <strong>secured</strong>
        debt is backed by collateral: a mortgage is secured by the house, an auto loan is secured by the car.
        If you default, the lender can repossess the asset. Because lenders have recourse, rates are lower.
        An <strong>unsecured</strong> debt (credit card, personal loan, student loan for federal loans) has no
        collateral. Lenders charge higher rates to compensate for higher risk. Defaulting damages your credit
        and can result in collection lawsuits and wage garnishment, but doesn't immediately take property.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Your Free Credit Report</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Three credit bureaus — Equifax, Experian, and TransUnion — each maintain a credit report on you. Under
        federal law (the Fair Credit Reporting Act), you can get one free report from each bureau every 12 months
        at <strong>AnnualCreditReport.com</strong>. Review your report regularly for errors: incorrect late payments,
        accounts you didn't open (possible identity theft), outdated negative information, and incorrect personal data.
        Errors can be disputed and removed if they're wrong.
      </Typography>

      <Callout kind="coachs-note">
        Build credit now, even as a student. Two low-risk entry points: (1) a secured credit card, where you
        deposit an amount equal to your credit limit — the bank holds it as collateral while you build a payment
        history; (2) becoming an authorized user on a parent's account in good standing, which adds their
        history to your report. Use either card for small purchases you'd make anyway, pay the full balance
        each month, and you'll enter adulthood with an established history. This takes years to build and
        minutes to damage.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Major Loan Types Compared</Typography>

      <Analogy title="Loans as rental contracts on money — the APR is the rent you pay">
        When you rent an apartment, you pay monthly rent for the right to use that space. When you borrow money, you pay interest — effectively "renting" the money from the lender. The APR is the annual "rent rate" expressed as a percentage of the amount borrowed. Higher APR = more expensive rent on the same amount of money. Just as you'd compare apartments by cost per square foot, compare loans by APR — it's the single number that lets you compare apples to apples across different loan amounts and terms.
      </Analogy>

      <GuideTable
        headers={['Loan type', 'Typical APR range', 'Term length', 'Collateral', 'Key feature']}
        rows={[
          ['Federal student loan (subsidized)', '5–7% (fixed by Congress)', '10–25 years', 'None', 'No interest accrues while enrolled half-time; income-driven repayment options'],
          ['Federal student loan (unsubsidized)', '5–8% (fixed)', '10–25 years', 'None', 'Interest accrues from day 1, even during school; capitalize at repayment'],
          ['Private student loan', '4–16% (variable or fixed)', '5–20 years', 'None (usually)', 'No federal protections; no income-driven repayment; credit-based rates'],
          ['Auto loan (new, good credit)', '4–7%', '36–72 months', 'The vehicle', 'Shorter term = higher payment but less interest; longer term = more interest paid'],
          ['Auto loan (used, good credit)', '6–11%', '24–60 months', 'The vehicle', 'Used cars often have higher rates and shorter terms than new'],
          ['Personal loan (good credit)', '7–15%', '1–5 years', 'None', 'Useful for consolidating high-interest debt; unsecured'],
          ['Credit card (carrying balance)', '18–30%+', 'Revolving (no set end)', 'None', 'Most expensive common borrowing; avoid carrying balances'],
          ['Payday loan', '300–400%+ APR equivalent', '2 weeks', 'Next paycheck', 'Predatory; traps borrowers in debt cycles; avoid entirely'],
        ]}
      />

      <Callout kind="why-it-matters">
        The difference between federal and private student loans is enormous — and often misunderstood. Federal loans come with income-driven repayment plans (payments capped as a percentage of income), deferment and forbearance options, and potential forgiveness programs. Private loans have none of these protections. Exhaust all federal loan options before taking a single dollar of private loans. Once you graduate, you cannot convert private loans to federal loans.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Understanding a Car Loan: Total Cost vs. Monthly Payment</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Dealerships often focus your attention on monthly payments — not total cost. A lower monthly payment achieved by extending the loan term actually costs you more in total. Understanding both numbers protects you from this common manipulation.
      </Typography>

      <GuideTable
        headers={['Same $25,000 car, 6% APR', 'Monthly payment', 'Total interest paid', 'Total cost of vehicle']}
        rows={[
          ['36-month (3-year) term', '$760/month', '$1,360', '$26,360'],
          ['48-month (4-year) term', '$587/month', '$1,810', '$26,810'],
          ['60-month (5-year) term', '$483/month', '$2,980', '$27,980'],
          ['72-month (6-year) term', '$414/month', '$4,800', '$29,800'],
        ]}
      />

      <Callout kind="watch-for">
        "Focus on the monthly payment" is a dealer tactic that shifts your attention from the total cost of the purchase. At the 36-month and 72-month options above, the monthly payment difference is $346 — but the total cost difference is $3,440. For the same car, the 72-month buyer pays $3,440 more than the 36-month buyer. Additionally, a 72-month loan creates a long window where you may be "underwater" — owing more than the car is worth — if the car depreciates faster than the loan balance decreases.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 6: Investing & Markets
// ─────────────────────────────────────────────────────────────────────
function Section6Investing() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Time Is Your Unfair Advantage</Typography>

      <Analogy title="Diversification as a sports team — you don't want your whole team to be one type of player">
        A basketball team that's all point guards — no centers, no forwards, no defensive specialists — looks like
        it should work on paper. Every player is good. But basketball requires different skills for different
        situations, and a one-dimensional team loses when the game demands something they don't have. An investment
        portfolio of all one type of investment has the same problem. All stocks means maximum volatility — when
        the stock market drops 40%, everything drops. Diversification across stocks, bonds, real estate, and other
        asset classes means different holdings respond differently to the same economic event. The portfolio
        doesn't soar as high in bull markets, but it doesn't crash as hard in bear markets either. That's the tradeoff,
        and for most people it's exactly the right one.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        <strong>Saving</strong> preserves money safely but typically earns less than inflation over long periods —
        meaning the purchasing power of saved money slowly erodes. <strong>Investing</strong> accepts some risk
        of loss in exchange for potential returns that outpace inflation and grow wealth meaningfully over time.
        The key variables: time horizon (when do you need the money?), risk tolerance (how much loss can you
        emotionally and practically handle?), and return expectations (what growth rate is realistic?).
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Types of Investments</Typography>

      <GuideTable
        headers={['Investment type', 'What you\'re buying', 'Risk level', 'Typical long-term return', 'Key characteristic']}
        rows={[
          ['Savings account / HYSA / CD', 'A deposit account at a bank', 'Very low', '1–5%', 'FDIC insured; no loss of principal possible'],
          ['U.S. Treasury bonds', 'A loan to the U.S. federal government', 'Very low', '3–5%', 'Backed by the "full faith and credit" of the U.S. government'],
          ['Corporate bonds', 'A loan to a corporation', 'Low–medium', '4–7%', 'Higher yield than Treasuries; risk depends on company credit rating'],
          ['Index funds (S&P 500)', 'Fractional ownership of 500 large U.S. companies', 'Medium', '≈10% historical annual average', 'Passive, low-cost, instant diversification'],
          ['Mutual funds (active)', 'Pooled investment managed by professional fund manager', 'Medium', 'Varies; often trails index funds after fees', 'Higher fees reduce returns; actively managed'],
          ['ETFs (Exchange-Traded Funds)', 'Basket of securities traded like a stock on an exchange', 'Varies by fund', 'Depends on underlying holdings', 'Lower costs than most mutual funds; more flexible trading'],
          ['Individual stocks', 'Ownership shares in a single company', 'High', 'Highly variable', 'Potential for large gains AND large losses; requires research'],
          ['Cryptocurrency', 'Digital currency or token on a blockchain', 'Very high', 'Highly unpredictable', 'Speculative; not FDIC insured; extreme volatility'],
        ]}
      />

      <MermaidDiagram chart={`graph LR
  A["Investment Risk Spectrum"]
  A --> B["LOW RISK / LOW RETURN\n• FDIC savings accounts\n• U.S. Treasury bonds\n• CDs"]
  A --> C["MEDIUM RISK / MEDIUM RETURN\n• Corporate bonds\n• Index funds (S&P 500)\n• ETFs\n• Balanced mutual funds"]
  A --> D["HIGH RISK / HIGH POTENTIAL RETURN\n• Individual stocks\n• Sector-specific funds\n• International emerging markets"]
  A --> E["VERY HIGH RISK / SPECULATIVE\n• Cryptocurrency\n• Options and derivatives\n• Penny stocks"]`} />

      <Analogy title="Compound growth as planting a tree — the best time was 20 years ago, the second best is now">
        A dollar invested at age 17 at an 8% average annual return grows to about $35 by age 65. That same
        dollar invested at age 37 grows to about $6.85 by age 65. Same dollar, same rate, completely different
        outcome — because the 17-year-old's dollar had 48 years to compound and the 37-year-old's had only 28.
        The tree planted earlier didn't use better soil or more water. It just had more time. The second best
        time to plant any tree — or start any investment — is always today, not next year.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Asset Allocation and Diversification</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        <strong>Asset allocation</strong> is how you divide your portfolio among different asset classes: stocks,
        bonds, cash, real estate, and others. The classic rule of thumb for stocks vs. bonds: subtract your age
        from 110 (or 120 for aggressive investors) to get your approximate stock percentage. At 20, that's 90%
        stocks, 10% bonds. At 60, that's 50% stocks, 50% bonds — more stability as retirement approaches.
        <strong> Diversification</strong> means spreading within each asset class: across sectors (tech, healthcare,
        energy), geographies (domestic, international), and company sizes (large-cap, mid-cap, small-cap).
      </Typography>

      <Callout kind="why-it-matters">
        Dollar-cost averaging (DCA) removes the danger of timing the market. Instead of trying to invest a
        lump sum at the "right" moment (which even professionals can't predict reliably), you invest a fixed
        amount on a regular schedule — for example, $200 every month on the 15th. When prices are high, you
        buy fewer shares. When prices are low, you buy more. Over time, this averages out your purchase price
        and removes the emotional temptation to wait for a "perfect" entry point that may never come.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Retirement Accounts: Tax-Advantaged Investing</Typography>

      <GuideTable
        headers={['Account type', 'Who offers it', 'Contribution tax treatment', 'Withdrawal tax treatment', '2025 contribution limit', 'Key feature']}
        rows={[
          ['Traditional 401(k)', 'Employer', 'Pre-tax (lowers taxable income now)', 'Taxed as ordinary income', '$23,500 ($31,000 age 50+; $34,750 ages 60–63 via SECURE 2.0)', 'Often includes employer match — always capture the full match first'],
          ['Roth 401(k)', 'Employer', 'After-tax (no deduction now)', 'Tax-free qualified withdrawals', '$23,500 (combined with Traditional)', 'Great when you expect higher tax rate in retirement'],
          ['Traditional IRA', 'Individual', 'May be deductible depending on income and workplace plan', 'Taxed as ordinary income', '$7,000 ($8,000 age 50+)', 'Deductibility phases out at higher incomes'],
          ['Roth IRA', 'Individual', 'After-tax (no deduction)', 'Tax-free qualified withdrawals', '$7,000 ($8,000 age 50+)', 'Income limits apply; contributions (not earnings) can be withdrawn anytime'],
        ]}
      />

      <GuideTable
        headers={['Roth vs. Traditional IRA — when each wins']}
        rows={[
          ['Choose Roth IRA when you\'re in a lower tax bracket now than you expect to be in retirement (typically when young/early-career). Pay taxes now at the low rate; withdraw tax-free at the higher rate later.'],
          ['Choose Traditional IRA when you\'re in a higher tax bracket now and expect a lower bracket in retirement. Get the deduction now when it\'s worth more; pay taxes later at the lower rate.'],
          ['As a high school student or early worker — Roth is almost always better. Your income and tax rate are at their lowest point in your life. The tax-free growth over 40+ years is extraordinary.'],
        ]}
      />

      <Callout kind="make-it-stick">
        Always capture the full employer 401(k) match before doing anything else with investable money. A 50%
        match on up to 6% of salary is a guaranteed 50% return on those dollars before the market does anything.
        No investment reliably beats a guaranteed 50% return. Not capturing the match is equivalent to turning
        down part of your salary — money that was offered to you and you declined.
      </Callout>

      <Callout kind="coachs-note">
        Market volatility — periods when prices drop significantly — feels catastrophic but is historically
        normal. The S&P 500 has dropped more than 20% on multiple occasions over the past century and has
        recovered every single time, typically reaching new all-time highs within a few years. For a long-term
        investor (10+ year horizon), a market crash is actually an opportunity to buy more shares at lower
        prices. The mistake investors make is selling during drops and buying during peaks — the exact opposite
        of "buy low, sell high."
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Index Funds vs. Active Management</Typography>

      <Analogy title="Active investing vs. index investing is a race where most runners try to beat the bus">
        A city bus runs a fixed route on a fixed schedule. You could try to take shortcuts through traffic, avoid red lights, and beat the bus to the next stop. But across hundreds of attempts, the bus — steady, predictable, low-cost — wins more often than not. Index funds are the bus: they track the entire market at minimal cost. Active funds are the drivers trying to beat the bus by picking the right stocks at the right time. Most — after accounting for fees — fall behind the bus. Not all, not always, but most, over time. Decades of evidence support the bus.
      </Analogy>

      <GuideTable
        headers={['Feature', 'Index fund (passive)', 'Actively managed fund']}
        rows={[
          ['Investment strategy', 'Tracks an index (e.g., S&P 500) — owns every stock in proportion', 'Professional managers pick stocks trying to beat the market'],
          ['Expense ratio (annual fee)', 'Typically 0.03%–0.20%', 'Typically 0.5%–1.5%+ annually'],
          ['Turnover (trading activity)', 'Low — only changes when the index changes', 'High — frequent buying and selling generates tax events'],
          ['Historical performance vs. benchmark', '~90% of active funds underperform their index over 15+ years (per SPIVA data)', 'Some outperform short-term; few maintain long-term advantage'],
          ['Tax efficiency', 'Higher — fewer capital gains distributions', 'Lower — frequent trades generate taxable distributions'],
          ['Best for', 'Long-term investors prioritizing low cost and diversification', 'Specific situations where active management adds verifiable value'],
        ]}
      />

      <Callout kind="connect">
        The expense ratio difference seems small but compounds dramatically. A $10,000 investment at 7% average return over 30 years: with a 0.05% index fund expense ratio → ~$74,700. With a 1.0% active fund expense ratio → ~$57,400. The 0.95% annual fee difference costs $17,300 in final wealth — nearly $17,300 in fees over 30 years on a $10,000 initial investment. This is why Warren Buffett has repeatedly recommended low-cost index funds for individual investors.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Behavioral Finance: Why Investors Underperform Their Own Funds</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Studies consistently show that the average investor earns significantly less than the average fund — even though they own the same funds. The reason: behavioral biases cause people to buy high (after reading about gains) and sell low (after experiencing fear during drops). Understanding these biases is the first step to overcoming them.
      </Typography>

      <GuideTable
        headers={['Bias', 'Definition', 'How it destroys returns']}
        rows={[
          ['Loss aversion', 'Losses feel ~2× more painful than equivalent gains feel good', 'Causes premature selling during temporary market dips to avoid the painful feeling of watching numbers fall'],
          ['Recency bias', 'Overweighting recent events when predicting the future', 'Chasing last year\'s top-performing fund (which often reverts to average the following year)'],
          ['Overconfidence', 'Believing you can predict market moves better than you actually can', 'Excessive trading; concentrated bets; underestimating risk'],
          ['Herd behavior', 'Following what "everyone else" is doing because it feels safer', 'Buying into bubbles at peaks; panic-selling at bottoms along with the crowd'],
          ['Status quo bias', 'Preferring the current state over change, even when change would be beneficial', 'Leaving too much money in a low-interest account; not rebalancing a portfolio'],
          ['Mental accounting', 'Treating money differently based on its source or label', 'Spending a tax refund frivolously because it feels like "found money" rather than earned income'],
        ]}
      />

      <Callout kind="make-it-stick">
        The cure for most behavioral finance biases is automation and pre-commitment. Set up automatic contributions to your retirement account on payday. Set a written investment policy: "I will not sell any fund during a market decline of less than 30%, and I will review my portfolio only twice per year." Automation removes the daily decision from your behavioral biology. Pre-commitment forces the rational you (today) to constrain the fearful you (during the next crash). Both work better than willpower.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 7: Insurance & Risk Management
// ─────────────────────────────────────────────────────────────────────
function Section7Insurance() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Trading a Small Certain Loss for Protection Against a Large Uncertain One</Typography>

      <Analogy title="Insurance as a financial firewall — it limits your downside when disaster strikes">
        A firewall in a building doesn't prevent fire from starting. It contains the damage — the fire burns
        on one side, but the firewall stops it from consuming the whole structure. Insurance works the same way.
        It doesn't prevent car accidents, medical emergencies, or house fires. It contains the financial damage
        so that a single bad event doesn't burn down everything you've built. The premium you pay is the cost
        of maintaining that firewall. The alternative — being "self-insured" by accident — means bearing the
        entire loss yourself when disaster strikes. For large, unpredictable losses, most people can't afford
        to be their own insurer.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Insurance works by pooling risk across many people. Everyone pays a small, predictable premium. When a
        loss occurs for any individual, the pool of collected premiums covers the cost. The insurer makes a
        profit by collecting more in premiums than it pays in claims (on average, across everyone). The insured
        benefits from predictability — they know exactly what their maximum loss can be in any given year.
        The three core variables in every policy: <strong>premium</strong> (what you pay to stay covered),
        <strong> deductible</strong> (what you pay first when a claim occurs), and <strong>coverage limit</strong>
        (the maximum the insurer will pay).
      </Typography>

      <Analogy title="The deductible as the amount you self-insure before the company kicks in">
        Think of a deductible as the "first-loss" layer you agree to absorb yourself. A $1,500 health insurance
        deductible means you pay the first $1,500 of any covered medical bills each year entirely on your own —
        before the insurance company writes a single check. In exchange for accepting that first-loss layer,
        your monthly premium is lower. Higher deductible = you absorb more first-loss = lower premium. Lower
        deductible = insurer absorbs more immediately = higher premium. The right balance depends on how much
        you have in your emergency fund to cover that first layer if needed.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Types of Insurance and What They Cover</Typography>

      <GuideTable
        headers={['Insurance type', 'What it covers', 'Required by law?', 'Key consideration']}
        rows={[
          ['Health insurance', 'Medical expenses: doctor visits, hospital stays, surgery, prescriptions', 'No (ACA eliminated individual mandate penalty federally)', 'Understand deductible + copay + coinsurance + OOP max before using'],
          ['Auto — liability', 'Damage and injury you cause to other people and their property', 'Yes — required in most states including SC', 'Minimum limits may be too low; consider higher limits'],
          ['Auto — collision', 'Your vehicle damaged in a collision regardless of fault', 'No, but lenders require it on financed vehicles', 'Worth less as vehicle ages; consider dropping on older paid-off cars'],
          ['Auto — comprehensive', 'Non-collision losses: theft, weather, fire, animals, vandalism', 'No, but lenders require it on financed vehicles', 'Often cheaper than collision; covers more scenarios'],
          ['Renters insurance', 'Your personal property + liability in a rented home', 'No, but landlords increasingly require it', '$15–30/month for valuable protection most young people skip'],
          ['Homeowners insurance', 'Structure + personal property + liability for owned homes', 'Required by mortgage lenders', 'Covers dwelling, contents, and liability in one policy'],
          ['Term life insurance', 'Death benefit for a set term (10, 20, 30 years)', 'No', 'Only needed if others depend on your income; very affordable when young'],
          ['Whole life insurance', 'Lifetime death benefit + cash value component', 'No', 'Expensive; often oversold; usually inferior to term + investing separately'],
          ['Disability insurance', 'Replaces 60–70% of income if unable to work due to illness or injury', 'No', 'Most overlooked coverage; your income-earning ability is your biggest asset'],
          ['Umbrella insurance', 'Extra liability coverage above auto and homeowners limits', 'No', 'Affordable ($150–$300/year) protection against large lawsuits'],
        ]}
      />

      <MermaidDiagram chart={`graph TD
  A["Choosing Insurance Coverage"]
  A --> B["What is the maximum\npossible loss?"]
  B --> C{Can I afford this loss\nfrom savings?}
  C -->|Yes, easily| D["Self-insure (skip coverage)\nor carry high deductible"]
  C -->|No — it would be catastrophic| E["Buy insurance to transfer\nthis risk to an insurer"]
  E --> F["What deductible can I absorb\nfrom my emergency fund?"]
  F --> G["Set deductible at emergency\nfund level or just below"]
  G --> H["Compare premiums across\ninsurers for same coverage"]`} />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Health Insurance Key Terms</Typography>

      <GuideTable
        headers={['Term', 'Definition', 'Example ($1,500 deductible, 80/20 coinsurance, $5,000 OOP max)']}
        rows={[
          ['Premium', 'Monthly payment to maintain coverage regardless of whether you use medical services', 'You pay $280/month = $3,360/year; insurer stays active'],
          ['Deductible', 'Amount you pay first before insurance pays anything (resets annually)', '$1,500 total before insurer writes any check for most services'],
          ['Copay', 'Flat fee you pay at time of service for specific visit types', '$30 per primary care visit (copays often don\'t count toward deductible)'],
          ['Coinsurance', 'Your percentage of costs after the deductible is met', 'After $1,500 deductible: you pay 20%, insurer pays 80% of remaining bills'],
          ['Out-of-pocket maximum (OOP max)', 'The most you pay in a plan year for covered in-network services; insurer covers 100% above this', '$5,000 OOP max: after you\'ve spent $5,000, insurer covers everything for the rest of the year'],
          ['Network', 'Providers (doctors, hospitals) contracted with your insurer at negotiated rates', 'In-network: lower cost-sharing. Out-of-network: much higher or not covered at all'],
          ['HSA (Health Savings Account)', 'Tax-advantaged account for medical expenses paired with high-deductible health plan (HDHP)', 'Contribute pre-tax; spend on qualifying medical costs tax-free; unused funds roll over forever'],
        ]}
      />

      <Callout kind="try-this">
        Work through this health insurance math: $1,500 deductible, 80/20 coinsurance, $5,000 out-of-pocket max.
        You need an emergency appendectomy — total covered bill is $22,000. What do you pay? Step 1: deductible
        — you pay $1,500. Remaining: $20,500. Step 2: coinsurance — you pay 20% × $20,500 = $4,100. Total
        so far: $5,600. But the OOP max is $5,000 — so your bill is capped at $5,000. The insurer pays the
        remaining $17,000. Your maximum liability for any amount of medical care in that plan year is now $0
        for the rest of the year.
      </Callout>

      <Callout kind="watch-for">
        Beneficiary designations on life insurance policies (and retirement accounts) are legally binding
        and override your will. If you name someone as beneficiary and don't update it after a major life
        event — marriage, divorce, the birth of children, death of the named beneficiary — the original
        designation stands regardless of your intent. Courts have consistently upheld ex-spouse beneficiary
        designations over the objections of current families. Review beneficiary designations annually
        and after every major life event.
      </Callout>

      <Analogy
        title="Insurance is a membership in a shared loss pool"
        body="Picture a neighborhood of 1,000 households, each contributing $1,000 a year into a communal vault. On average, 5 houses burn down each year — each worth about $200,000 to rebuild. The vault collects $1,000,000 and pays out $1,000,000. Nobody can afford a $200,000 loss alone, but $1,000 is painless. The insurer manages the vault, keeps its operating expenses, and prices premiums so collections exceed expected payouts. When you pay a premium, you're buying certainty — a capped loss — in exchange for giving up money you might not need. The only question is whether the certainty is worth the price."
      />

      <GuideTable
        title="Life Insurance: Term vs. Permanent"
        headers={['Feature', 'Term Life', 'Whole Life', 'Universal Life']}
        rows={[
          ['Coverage period', 'Fixed term (10, 20, 30 years)', 'Lifetime (as long as premiums paid)', 'Lifetime — flexible premiums'],
          ['Premium cost', 'Lowest — most affordable', 'Highest — covers death benefit + forced savings', 'Middle — flexible but complex'],
          ['Cash value', 'None — pure death benefit only', 'Builds slowly at guaranteed rate', 'Builds in investment sub-account'],
          ['Best for', 'Income replacement during working years; mortgage coverage', 'Estate planning; lifelong coverage need', 'Those wanting flexibility + some investment'],
          ['Exam trap', 'Does NOT build wealth; is NOT an investment', '"Buy term, invest the difference" usually beats whole life financially', 'Hidden costs from complexity'],
        ]}
      />

      <GuideTable
        title="Auto Insurance Coverage Types — What Each Pays For"
        headers={['Coverage', 'What It Covers', 'Required?', 'Key Detail']}
        rows={[
          ['Bodily Injury Liability (BI)', 'Injuries you cause to OTHER people', 'Yes in almost all states', 'Limits written as 25/50: $25K per person / $50K per accident'],
          ['Property Damage Liability (PD)', 'Damage you cause to OTHER people\'s property', 'Yes', 'The last number in 25/50/25 limits'],
          ['Collision', 'Damage to YOUR car from a collision (any fault)', 'No — lender usually requires it', 'Subject to your deductible; you pay first $X'],
          ['Comprehensive', 'Damage to YOUR car from non-collision: theft, fire, flood, hail, deer', 'No — lender usually requires it', 'Also has deductible; pays Actual Cash Value if totaled'],
          ['Uninsured Motorist (UM)', 'YOUR injuries if hit by uninsured driver', 'Required in some states', 'Buy at least as much UM as your BI limit'],
          ['Med Pay / PIP', 'YOUR medical bills regardless of fault; PIP also covers lost wages', 'Required in no-fault states', 'PIP is broader — covers income too, not just medical'],
        ]}
      />

      <GuideTable
        title="Property & Other Insurance Types"
        headers={['Type', 'What It Covers', 'Key Concept']}
        rows={[
          ['Homeowner\'s', 'Dwelling + personal property + liability + additional living expenses', 'Replacement cost (rebuild at today\'s prices) > ACV (subtract depreciation) — always prefer replacement cost'],
          ['Renter\'s', 'Personal property + liability inside a rented unit — NOT the building', 'Cheap (~$15–30/month); landlord\'s policy covers the building, not your belongings'],
          ['Umbrella', 'Excess liability above auto + homeowner\'s limits', '~$150–300/year for $1M extra coverage; critical for protecting assets from lawsuits'],
          ['Disability', 'Replaces ~60% of income if unable to work due to illness/injury', 'Short-term: 90–180 days. Long-term: months to years. SSDI is government fallback, hard to qualify for'],
          ['Long-Term Care', 'Nursing home, assisted living, in-home care costs', 'Medicare covers short-term skilled nursing only; Medicaid covers LTC only after nearly all assets are spent down'],
        ]}
      />

      <Callout kind="make-it-stick">
        The central insurance decision: how much risk can you afford to self-insure? Set deductibles as high as you can pay out of pocket — lowers premiums. Keep liability limits as high as you can afford — protects future assets. Never skimp on liability; always shop on deductibles.
      </Callout>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Section 8: Taxes & Government Programs
// ─────────────────────────────────────────────────────────────────────
function Section8Taxes() {
  return (
    <Box sx={{ pb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>The Rules of the Game You're Already Playing</Typography>

      <Analogy title="The marginal tax rate as a ladder — only the feet on each rung pay that rung's rate">
        Imagine a ladder with five rungs, each painted a different color. The first rung is light blue (10%),
        the second is blue (12%), the third is medium blue (22%), and so on. Your income climbs this ladder
        dollar by dollar. The first dollars that land on the light blue rung pay 10%. When your income climbs
        past that rung onto the blue one, only the new dollars pay 12% — the ones already on the first rung
        still pay 10%. You never "go back" and reprice the lower rungs. The common misconception — "a raise
        pushed me into a higher bracket so I'll take home less" — is impossible. You are taxed on the portion
        of income in each bracket, never on all your income at the highest rate.
      </Analogy>

      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        The U.S. uses a <strong>progressive marginal tax system</strong>: income is taxed at increasing rates
        as it passes through successive brackets. Higher rates apply only to the income within each bracket —
        not to all of your income. Your <strong>marginal rate</strong> is the rate on the last dollar earned.
        Your <strong>effective rate</strong> is total taxes paid divided by total income — always lower than
        your marginal rate. Both numbers matter, but for different purposes.
      </Typography>

      <MermaidDiagram chart={`graph TD
  A["W-2 / 1099 Income (Gross Wages)"]
  A --> B["Subtract: Adjustments to Income\n(student loan interest, HSA, traditional IRA)"]
  B --> C["= Adjusted Gross Income (AGI)"]
  C --> D["Subtract: Standard or Itemized Deduction\n(standard for most: $15,000 single / $30,000 MFJ in 2025)"]
  D --> E["= Taxable Income\n(apply marginal tax brackets to this number)"]
  E --> F["= Tax Calculated from Brackets\n(10%, 12%, 22%, 24%, 32%, 35%, 37%)"]
  F --> G["Subtract: Tax Credits\n(Child Tax Credit, education credits, EITC)"]
  G --> H["= Tax Owed or Refund\nCompare to withholding already paid (W-2 Box 2)"]`} />

      <Analogy title="A tax credit as a store coupon that comes straight off your bill vs. a deduction as a coupon that changes what shelf you shop from">
        Imagine you're buying a $100 sweater. A store coupon worth $20 off your total bill — that's a tax credit:
        $20 directly off what you owe at the register. Now imagine instead a coupon that says "shop from the
        $80 rack instead of the $100 rack" — that's a deduction: it lowers the price you're taxed on, not
        the tax itself. If you're in the 22% bracket, a $1,000 deduction saves $220 in taxes. But a $1,000
        tax credit saves $1,000 in taxes — five times as valuable per dollar. Tax credits are always more
        powerful than deductions of the same dollar amount. Know the difference cold.
      </Analogy>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Standard Deduction vs. Itemized Deductions</Typography>
      <Typography sx={{ mb: 1, lineHeight: 1.75 }}>
        Every taxpayer automatically qualifies for the <strong>standard deduction</strong> — a flat amount
        subtracted from gross income before calculating taxable income. In 2025: $15,000 for single filers,
        $30,000 for married filing jointly. You can instead <strong>itemize</strong> — list your actual
        deductible expenses (mortgage interest, state and local taxes up to $10,000, charitable contributions,
        large medical expenses). Choose whichever is larger. Most Americans — especially those without mortgages
        — take the standard deduction.
      </Typography>

      <GuideTable
        headers={['Tax filing document', 'Who sends it', 'What it shows', 'When received', 'How it\'s used']}
        rows={[
          ['W-2', 'Employer', 'Total wages + every dollar withheld (federal, state, FICA)', 'By January 31', 'Enter on Form 1040 to report wage income and credit withholding'],
          ['1099-NEC', 'Client / payer', 'Non-employee (freelance/gig) income ≥$600', 'By January 31', 'Report as self-employment income; subject to self-employment tax (15.3%)'],
          ['1099-INT', 'Bank or lender', 'Interest income earned (savings, CDs)', 'By January 31', 'Taxable interest income on Form 1040'],
          ['1099-DIV', 'Investment firm', 'Dividends and capital gains distributions', 'By January 31', 'Taxable dividend/capital gain income; may qualify for lower tax rate'],
          ['Form 1098', 'Mortgage lender', 'Mortgage interest paid', 'By January 31', 'Used if itemizing deductions — deduct mortgage interest paid'],
          ['Form 1040', 'IRS (you complete it)', 'Your complete federal tax return', 'Due April 15 (file by this date)', 'The master return that calculates your total tax and any refund or amount owed'],
        ]}
      />

      <Callout kind="watch-for">
        A very common and costly misconception: "If my raise pushed me into a higher bracket, I'll actually
        take home less money." This is mathematically impossible under a marginal tax system. Only the income
        in the new bracket is taxed at the higher rate. Your take-home pay always increases with a raise.
        A second trap: confusing a large tax refund with "free money from the government." A refund means
        you overpaid your taxes through withholding — the government is returning your own money, interest-free.
        Ideally, you'd rather owe a small amount (meaning you kept and could have invested that money all year).
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Tax Credits vs. Tax Deductions</Typography>

      <GuideTable
        headers={['Tax reducer', 'Reduces', 'Value of $1,000 at 22% bracket', 'Example credits and deductions']}
        rows={[
          ['Standard deduction ($15,000 single)', 'Taxable income', '$15,000 × 22% = $3,300 savings', 'Available to all filers; no receipts needed'],
          ['Itemized deduction (e.g., $18,000 in mortgage interest + taxes)', 'Taxable income', '$18,000 × 22% = $3,960 savings', 'Only worth it when itemizable expenses exceed standard deduction'],
          ['Tax credit — non-refundable', 'Actual tax bill, dollar-for-dollar', '$1,000 saves $1,000 in taxes', 'Child Tax Credit, American Opportunity Credit (education)'],
          ['Tax credit — refundable', 'Tax bill; can result in refund even if no tax owed', '$1,000 saves $1,000 or generates refund', 'Earned Income Tax Credit (EITC); designed to benefit low-income workers'],
        ]}
      />

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2.5, mb: 1 }}>Government Benefit Programs</Typography>

      <GuideTable
        headers={['Program', 'Who it serves', 'How it\'s funded', 'Key facts']}
        rows={[
          ['Social Security (OASDI)', 'Retirees (62+), disabled workers, survivors of deceased workers', 'FICA: employee 6.2% + employer 6.2% = 12.4%', 'Benefit based on 35 highest earning years; full retirement age is 67 for those born after 1960'],
          ['Medicare', 'Americans 65+ and certain disabled persons', 'FICA: 1.45% each from employee and employer', 'Part A: hospital (usually no premium); Part B: medical (premium); Part D: prescription drugs'],
          ['Medicaid', 'Low-income individuals and families (eligibility varies by state)', 'Federal + state general tax revenue', 'SC expanded Medicaid under ACA; covers many low-income adults, children, pregnant women'],
          ['CHIP', 'Children in families above Medicaid limits but below marketplace premium thresholds', 'Federal + state general revenue', 'Covers pediatric care for millions of children who fall between programs'],
          ['SNAP', 'Low-income households for food purchases', 'Federal general revenue (USDA)', 'Electronic benefits card accepted at most grocery stores; income and asset limits apply'],
          ['FAFSA / Pell Grant', 'College students demonstrating financial need', 'Federal appropriations', 'Pell Grant does not require repayment; FAFSA is free to file; submit early each October'],
          ['EITC (Earned Income Tax Credit)', 'Low-to-moderate income workers, especially with children', 'Tax expenditure (reduces tax revenue)', 'Refundable — can generate a refund even if no tax owed; one of the most valuable credits for low-income workers'],
        ]}
      />

      <Callout kind="connect">
        FICA taxes fund two programs you will personally use later in life. Social Security retirement
        benefits start as early as age 62 (reduced) or age 67 (full), based on your 35 highest-earning years.
        Medicare provides health coverage starting at 65. Every year you work and pay FICA, you earn credits
        toward both. Think of the 7.65% FICA on every paycheck not as money lost, but as mandatory contributions
        to a retirement pension (Social Security) and lifetime health coverage (Medicare) — programs that together
        will likely be worth hundreds of thousands of dollars to you over your lifetime.
      </Callout>

      <Callout kind="make-it-stick">
        FAFSA is the gateway to federal financial aid for college. It opens every October for the following
        academic year, and many colleges award institutional grants on a first-come, first-served basis —
        filing early matters. The form is always free at studentaid.gov. It asks for family income and asset
        information to calculate the Expected Family Contribution (now called the Student Aid Index). The
        lower your family's financial resources, the more aid you qualify for — including Pell Grants, which
        do not require repayment, and subsidized loans, which don't accrue interest while you're in school.
      </Callout>

      <Callout kind="in-plain-words">
        Tax filing in plain steps: (1) Gather your income documents (W-2, 1099s). (2) Choose your filing
        status (single, married filing jointly, head of household — affects your standard deduction and rates).
        (3) Add up all income sources. (4) Subtract adjustments and your standard or itemized deduction to get
        taxable income. (5) Apply the tax brackets to calculate tax owed. (6) Subtract any credits. (7) Compare
        to withholding already paid (W-2 Box 2 and equivalent). If withholding &gt; tax owed = refund. If
        withholding &lt; tax owed = balance due. File by April 15.
      </Callout>

      <GuideTable
        title="Tax Credits vs. Tax Deductions — The Critical Distinction"
        headers={['Feature', 'Tax Deduction', 'Tax Credit']}
        rows={[
          ['Definition', 'Reduces your taxable income', 'Reduces your tax bill dollar-for-dollar'],
          ['Value depends on', 'Your marginal tax rate', 'Fixed — same value regardless of bracket'],
          ['Example', '$1,000 deduction in the 22% bracket saves $220', '$1,000 credit saves exactly $1,000'],
          ['Which is better?', 'Always the credit, dollar-for-dollar', 'A $1,000 credit beats a $1,000 deduction in every bracket below 100%'],
          ['Refundable credit', 'N/A', 'Refundable credits pay you back even if credit > tax owed (e.g., Earned Income Tax Credit)'],
          ['Non-refundable credit', 'N/A', 'Reduces tax to $0 but no refund beyond that (e.g., Child Tax Credit — partially refundable)'],
          ['Key deductions', 'Standard (single: ~$15,000 in 2025; MFJ: ~$30,000) OR itemized (mortgage interest, charitable, state taxes)', 'N/A'],
          ['Key credits', 'N/A', 'Child Tax Credit, Earned Income Tax Credit, American Opportunity Credit (college), Lifetime Learning Credit'],
        ]}
      />

      <Analogy
        title="Tax brackets are a ladder — each rung only taxes the income on that step"
        body="Imagine you earn $50,000. The tax bracket table has rungs: 10% on income up to ~$11,600, then 12% on the next chunk up to ~$47,150, then 22% on income above that. Your marginal rate is 22% — but you do NOT pay 22% on all $50,000. You pay 10% on the first $11,600, 12% on the next $35,550, and 22% only on the last $2,850. This is called a progressive tax. The effective tax rate — total tax divided by total income — is always lower than the marginal rate. Every dollar you earn still moves you up the ladder one rung at a time; only the new dollars touch the new rate."
      />

      <GuideTable
        title="Payroll Tax Calculation — Full Worked Example"
        headers={['Item', 'Calculation', 'Result']}
        rows={[
          ['Gross pay (weekly)', '$800 salary + 5 overtime hours × ($20 × 1.5)', '$800 + $150 = $950 gross'],
          ['Social Security tax', '$950 × 6.2%', '$58.90'],
          ['Medicare tax', '$950 × 1.45%', '$13.78'],
          ['Total FICA withheld', '$58.90 + $13.78', '$72.68 from employee; employer matches same amount'],
          ['Federal income tax withheld', 'Depends on W-4 allowances — assume $85 withheld', '$85.00'],
          ['State income tax withheld', 'Depends on state — assume $30', '$30.00'],
          ['Net pay (take-home)', '$950 − $72.68 − $85 − $30', '$762.32'],
          ['Employer\'s total cost', '$950 + $72.68 employer FICA match', '$1,022.68 — employee earns $950, costs employer ~$1,023'],
        ]}
      />

      <GuideTable
        title="Government Programs — Purpose, Funding, and Eligibility"
        headers={['Program', 'What It Provides', 'Funded By', 'Key Eligibility']}
        rows={[
          ['Social Security (OASDI)', 'Retirement income, disability benefits, survivor benefits', 'FICA payroll tax (6.2% employee + 6.2% employer)', '40 quarters (10 years) of work credits to qualify for retirement benefit; full retirement age 67 for those born after 1960'],
          ['Medicare', 'Health insurance for those 65+ and certain disabled individuals', 'FICA payroll tax (1.45% each) + Part B/D premiums', 'Automatic at 65 if eligible for Social Security; Parts B and D require separate enrollment and premium payment'],
          ['Medicaid', 'Health coverage for low-income individuals, families, pregnant women, elderly in nursing homes', 'Federal + state general tax revenue (shared funding)', 'Income- and asset-based — varies by state; expanded under ACA in most states'],
          ['Unemployment Insurance (UI)', 'Temporary income replacement for workers who lose jobs through no fault of their own', 'Employer payroll tax (FUTA + SUTA) — employees don\'t pay this', 'Must have worked enough hours, be actively seeking work, not have quit voluntarily or been fired for cause'],
          ['SNAP (Food Stamps)', 'Electronic benefits for grocery purchases at authorized retailers', 'Federal general revenue (USDA)', 'Gross income ≤ 130% of federal poverty level; asset limits apply'],
          ['FAFSA / Pell Grant', 'Federal student aid allocation; Pell Grant is the largest need-based grant (up to ~$7,395/year)', 'Federal general revenue', 'Pell Grant: demonstrated financial need + enrolled at least half-time; complete FAFSA annually'],
          ['CHIP (Children\'s Health Insurance)', 'Health coverage for children in families above Medicaid limits but lacking employer insurance', 'Federal + state revenue', 'Income-based; covers children up to 19 in most states'],
        ]}
      />

      <Callout kind="connect">
        Social Security and Medicare are funded entirely by the FICA taxes you see on every paycheck — not by general income tax. When the question asks "who pays FICA?" — both employer and employee pay equal shares (6.2% SS + 1.45% Medicare each). Self-employed people pay the full 15.3% combined but can deduct the employer half from their taxable income.
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Personal Finance Exam Strategy</Typography>

      <Callout kind="coachs-note">
        Personal finance questions almost always test application, not just recall. You won't be asked "What is
        a deductible?" — you'll be given a scenario with a specific insurance policy, a specific medical bill,
        and asked what the patient pays. Or you'll be given a paycheck scenario and asked to calculate net pay.
        Read every question carefully to identify: (1) What domain is this? (2) What specific concept is being
        tested? (3) What calculation or decision does the question require? Answer those three questions before
        evaluating any answer choices.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Domain 1 — Earning Income: What to watch for</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Identify all parties in a compensation scenario: employer, employee, government. Know both FICA
        numbers cold: Social Security = 6.2%, Medicare = 1.45%, total employee FICA = 7.65%. The employer
        matches exactly. Self-employed workers pay 15.3% (both halves). Overtime is 1.5× the regular
        <em> hourly rate</em>, applied to hours <em>over 40 per week</em>. Salary questions often include
        benefit valuation — remember total compensation = salary + benefits, and benefits often add 25–40%.
        W-4 is filled at hire; W-2 is received in January.
      </Typography>

      <Callout kind="watch-for">
        Common earning income traps: (1) Calculating overtime on net pay instead of gross hourly rate —
        always use gross. (2) Forgetting that tips are taxable income. (3) Confusing W-2 with W-4 —
        you fill out the W-4, you receive the W-2. (4) Treating salary as the whole picture without
        considering benefits. (5) Applying FICA at the wrong rate for self-employed workers — they
        pay 15.3%, not 7.65%.
      </Callout>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Domain 2 — Credit & Debt: The 35% Rule</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Credit score questions usually hinge on the single biggest factor: payment history at 35%. When
        a question asks "what is the most important thing to do to improve a credit score?" — the answer
        is almost always "make all payments on time." When asked about credit utilization, the correct
        target is below 30% (ideally below 10%). Never close old accounts to improve your score —
        closing accounts reduces your total available credit (increasing utilization) and eliminates
        account age (reducing average length of history). Both effects hurt your score.
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Domain 3 — Taxes: The Marginal Rate Reality</Typography>
      <Typography sx={{ mb: 1.5, lineHeight: 1.75 }}>
        Watch for any answer choice that says a raise causes someone to "take home less" — this is always
        wrong under a progressive tax system. Watch for confusion between deductions (reduce taxable income)
        and credits (reduce tax owed dollar-for-dollar). Credits are always more valuable per dollar. Know
        the key documents: W-4 (withholding elections), W-2 (year-end wage summary), 1099-NEC (freelance
        income), and 1040 (the federal return). FICA taxes fund Social Security (6.2%) and Medicare (1.45%) —
        these are on every employment income question involving deductions.
      </Typography>

      <Callout kind="make-it-stick">
        The "which comes first" questions appear constantly across all domains. Memorize this priority order:
        (1) Meet basic needs. (2) Build starter emergency fund. (3) Capture employer 401(k) match. (4) Pay
        high-interest debt. (5) Build full emergency fund. (6) Invest for long-term goals. Questions like
        "Maria has extra money each month — what should she do first?" are answered by this hierarchy.
        Security before growth. Guaranteed returns before market returns. Foundation before superstructure.
      </Callout>

      <GuideTable
        title="Quick-Reference: Rates and Numbers You Must Know Cold"
        headers={['Concept', 'Key Number / Rule', 'Context']}
        rows={[
          ['Social Security FICA rate', '6.2% employee + 6.2% employer = 12.4% total', 'Self-employed pay 12.4% (both halves)'],
          ['Medicare FICA rate', '1.45% employee + 1.45% employer = 2.9% total', 'Self-employed pay 2.9%; combined FICA = 15.3%'],
          ['Overtime threshold', '> 40 hours per workweek at 1.5× regular rate', 'Applied to hourly rate, not salary'],
          ['Emergency fund target', '3–6 months of expenses', 'Liquid, accessible — savings account, not investments'],
          ['Credit utilization target', '< 30% of available credit (ideally < 10%)', 'Applies per card AND across all cards total'],
          ['Credit score: payment history weight', '35% of FICO score', 'Single biggest factor — pay on time above all else'],
          ['Rule of 72', 'Years to double = 72 ÷ interest rate', 'At 8% return: 72 ÷ 8 = 9 years to double'],
          ['Standard deduction 2025 (single)', '~$15,000', 'Most people take standard; itemize only if deductions exceed this'],
          ['Pell Grant maximum', '~$7,395/year (2024–25)', 'Need-based; does not require repayment'],
          ['Roth IRA income phase-out (single)', 'Begins at $150,000 (2025)', 'Above limit → reduced contribution; above $165K → cannot contribute directly'],
          ['401(k) contribution limit (2025)', '$23,500 ($31,000 if 50+; $34,750 ages 60–63)', 'SECURE 2.0 added the elevated 60–63 catch-up tier'],
          ['Deductible vs. OOP max', 'Deductible: first-dollar threshold; OOP max: annual liability cap', 'After OOP max, insurance pays 100% for remainder of year'],
          ['Term life vs. whole life', 'Term = pure protection; whole = protection + forced savings (usually worse ROI)', 'Buy term, invest the difference is the dominant financial planning advice'],
          ['Capital gains tax (long-term)', '0%, 15%, or 20% depending on income bracket', 'Long-term = held > 1 year; short-term taxed as ordinary income'],
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Personal Finance Glossary</Typography>
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
