// Question bank for PFIN — SC Personal Finance (11th grade).
// ≥100 questions across 7 subdomains. All explanations ≥80 chars.

export type QuestionType = 'single' | 'multi' | 'ordering' | 'yesno';

export interface Question {
  id: string;
  domain: 1;
  subdomain: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  codeSnippet?: string;
  examTip?: string;
}

export const questions: Question[] = [

  // ══════════════════════════════════════════════════════════════
  // Earning Income
  // ══════════════════════════════════════════════════════════════
  {
    id: 'earn-01', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'easy',
    question: 'What is the difference between gross pay and net pay?',
    options: ['Gross pay is after taxes; net pay is before taxes', 'Gross pay is before any deductions; net pay is the amount actually received after deductions', 'They are the same thing', 'Gross pay includes benefits; net pay does not'],
    correctAnswers: [1],
    explanation: 'Gross pay is your total earnings before any taxes or deductions. Net pay (take-home pay) is what remains after taxes, Social Security, Medicare, insurance premiums, and other deductions are withheld.',
  },
  {
    id: 'earn-02', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'easy',
    question: 'An employee works 45 hours in a week at $12/hour. Overtime (hours over 40) is paid at 1.5× the regular rate. What is gross pay?',
    options: ['$540', '$510', '$570', '$600'],
    correctAnswers: [2],
    explanation: 'Regular pay: 40 × $12 = $480. Overtime pay: 5 × ($12 × 1.5) = 5 × $18 = $90. Total: $480 + $90 = $570. The Fair Labor Standards Act requires overtime for non-exempt employees.',
  },
  {
    id: 'earn-03', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'medium',
    question: 'Which form does an employer provide at the end of the year to summarize annual wages and taxes withheld?',
    options: ['W-4', 'W-2', '1099', 'Form 1040'],
    correctAnswers: [1],
    explanation: 'The W-2 (Wage and Tax Statement) is issued by employers each January. The W-4 is filled out by employees to set withholding. 1099 forms report non-employment income. Form 1040 is the individual tax return.',
  },
  {
    id: 'earn-04', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'medium',
    question: 'A salesperson earns 4% commission on all sales. If they sell $25,000 worth of products, what is their commission income?',
    options: ['$250', '$1,000', '$2,500', '$4,000'],
    correctAnswers: [1],
    explanation: 'Commission = rate × sales = 0.04 × $25,000 = $1,000. Commission pay is variable — high performers earn more but income can fluctuate based on sales volume.',
  },
  {
    id: 'earn-05', domain: 1, subdomain: 'Earning Income', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Investing in education and skills training is considered building "human capital."',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Human capital refers to the knowledge, skills, and abilities a person possesses that make them more productive and valuable in the labor market. Education, training, and experience all increase human capital.',
  },
  {
    id: 'earn-06', domain: 1, subdomain: 'Earning Income', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are typically withheld from an employee\'s paycheck? (Select all that apply)',
    options: ['Federal income tax', 'Social Security (FICA)', 'Medicare tax', 'Homeowner\'s insurance'],
    correctAnswers: [0, 1, 2],
    explanation: 'Federal income tax, Social Security, and Medicare (FICA taxes) are standard payroll deductions. Homeowner\'s insurance is a personal expense paid directly, not through payroll, unless set up through an employer benefit.',
  },
  {
    id: 'earn-07', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'medium',
    question: 'Which form do employees complete to tell their employer how much federal income tax to withhold from each paycheck?',
    options: ['Form 1040', 'W-2', 'W-4', '1099-MISC'],
    correctAnswers: [2],
    explanation: 'The W-4 (Employee\'s Withholding Certificate) is submitted to your employer when you start a job. The allowances or adjustments you claim determine how much tax is withheld per paycheck.',
  },
  {
    id: 'earn-08', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'hard',
    question: 'An employee earns $50,000 annually. Their employer contributes $200/month toward health insurance premiums. What is the true total compensation value annually?',
    options: ['$50,000', '$52,400', '$47,600', '$54,000'],
    correctAnswers: [1],
    explanation: 'Total compensation includes salary plus benefits. Employer health contribution: $200 × 12 = $2,400/year. Total: $50,000 + $2,400 = $52,400. Benefits are a significant part of compensation that employees often overlook when comparing jobs.',
  },
  {
    id: 'earn-09', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'easy',
    question: 'What does "FICA" stand for?',
    options: ['Federal Income Collection Act', 'Federal Insurance Contributions Act', 'Financial Independence Credit Account', 'Fiscal Investment Contributions Adjustment'],
    correctAnswers: [1],
    explanation: 'FICA stands for Federal Insurance Contributions Act. It funds Social Security and Medicare. Employees and employers each pay 6.2% for Social Security and 1.45% for Medicare — totaling 15.3% split between them.',
  },
  {
    id: 'earn-10', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'medium',
    question: 'A job pays $18/hour for 40 hours/week. Approximately what is the annual gross income (assume 52 weeks)?',
    options: ['$28,800', '$37,440', '$40,000', '$33,280'],
    correctAnswers: [1],
    explanation: 'Annual gross = hourly rate × hours/week × weeks/year = $18 × 40 × 52 = $37,440. This calculation is important for comparing job offers and creating a realistic annual budget.',
  },
  {
    id: 'earn-11', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'hard',
    question: 'Which type of employee income is NOT subject to FICA withholding?',
    options: ['Hourly wages', 'Annual salary', 'Tips reported to employer', 'Investment gains (capital gains)'],
    correctAnswers: [3],
    explanation: 'FICA applies to earned income — wages, salaries, and tips. Capital gains (profits from selling investments) are not earned income and are not subject to FICA. They are taxed differently as investment income.',
  },
  {
    id: 'earn-12', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'medium',
    question: 'If a worker earns $15/hour and works 50 hours in a week, their overtime rate for hours 41-50 is:',
    options: ['$15.00/hour', '$20.00/hour', '$22.50/hour', '$30.00/hour'],
    correctAnswers: [2],
    explanation: 'Overtime rate = regular rate × 1.5 = $15 × 1.5 = $22.50/hour. The Fair Labor Standards Act mandates time-and-a-half for non-exempt employees working more than 40 hours per week.',
  },
  {
    id: 'earn-13', domain: 1, subdomain: 'Earning Income', type: 'ordering', difficulty: 'medium',
    question: 'Order these income sources from MOST stable/predictable to LEAST stable:',
    options: ['Commission-only sales income', 'Annual salary with benefits', 'Freelance/gig work', 'Hourly wage with guaranteed hours'],
    correctAnswers: [1, 3, 2, 0],
    explanation: 'Salary is most stable (fixed regardless of output). Guaranteed hourly is next. Freelance varies by project availability. Commission-only fluctuates entirely with sales performance.',
  },
  {
    id: 'earn-14', domain: 1, subdomain: 'Earning Income', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A higher education level generally correlates with higher lifetime earnings.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Bureau of Labor Statistics data consistently shows that more education correlates with higher median weekly earnings and lower unemployment rates. A bachelor\'s degree earner typically earns significantly more over a lifetime than a high school graduate.',
  },
  {
    id: 'earn-15', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'easy',
    question: 'Which of the following is an example of a "benefit" rather than direct wage compensation?',
    options: ['Weekly paycheck', 'Overtime pay', 'Employer-sponsored health insurance', 'Commission bonus'],
    correctAnswers: [2],
    explanation: 'Benefits are non-wage compensation provided by employers — they include health insurance, retirement contributions, paid time off, and tuition assistance. These have real monetary value beyond the hourly/salary rate.',
  },

  // ══════════════════════════════════════════════════════════════
  // Budgeting & Spending
  // ══════════════════════════════════════════════════════════════
  {
    id: 'budget-01', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'easy',
    question: 'In the 50/30/20 budgeting rule, what percentage is allocated to needs?',
    options: ['20%', '30%', '50%', '70%'],
    correctAnswers: [2],
    explanation: 'The 50/30/20 rule allocates 50% of after-tax income to needs (housing, food, utilities, transportation), 30% to wants (entertainment, dining out, hobbies), and 20% to savings and debt repayment.',
  },
  {
    id: 'budget-02', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'easy',
    question: 'Which of the following is a FIXED expense?',
    options: ['Grocery bill', 'Monthly rent payment', 'Electricity bill', 'Clothing purchases'],
    correctAnswers: [1],
    explanation: 'Fixed expenses are the same amount each month — rent, mortgage, car payments, or subscription fees with set amounts. Variable expenses fluctuate — groceries, utilities, and clothing change month to month based on use.',
  },
  {
    id: 'budget-03', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'medium',
    question: 'A student earns $1,200/month after taxes. Using the 50/30/20 rule, how much should go toward savings and debt repayment?',
    options: ['$240', '$360', '$600', '$120'],
    correctAnswers: [0],
    explanation: '20% of $1,200 = $0.20 × $1,200 = $240. This amount should fund an emergency fund first, then other savings goals, then extra debt payments beyond minimums.',
  },
  {
    id: 'budget-04', domain: 1, subdomain: 'Budgeting & Spending', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A "want" is something you need to survive or maintain employment, like rent and transportation.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Needs are necessities required for survival or employment: housing, food, utilities, basic transportation, and medication. Wants are discretionary — streaming services, eating out, vacations. The distinction matters for budgeting priorities.',
  },
  {
    id: 'budget-05', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'medium',
    question: 'In a zero-based budget, the goal is that income minus all allocated expenses and savings equals:',
    options: ['$0', 'A surplus of 10%', 'At least 3 months of expenses', '$100 cushion'],
    correctAnswers: [0],
    explanation: 'In zero-based budgeting every dollar is assigned a purpose — expenses + savings + investments = total income. The result is $0 "unaccounted for." This doesn\'t mean you spend everything; savings is a category.',
  },
  {
    id: 'budget-06', domain: 1, subdomain: 'Budgeting & Spending', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are benefits of keeping a monthly budget? (Select all that apply)',
    options: ['Identifies where money is actually going', 'Prevents overspending on wants', 'Helps prioritize savings goals', 'Guarantees a pay raise'],
    correctAnswers: [0, 1, 2],
    explanation: 'Budgets provide visibility into spending patterns, create spending boundaries for discretionary categories, and keep savings goals funded. A budget can\'t guarantee income increases — it only manages what you have.',
  },
  {
    id: 'budget-07', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'hard',
    question: 'A family\'s monthly income is $4,000. Rent: $1,200; car payment: $350; groceries: $400; utilities: $150; eating out: $300; streaming subscriptions: $50; clothing: $200; savings: $350. Which category should be adjusted FIRST if they need to save more?',
    options: ['Rent (fixed)', 'Car payment (fixed)', 'Eating out (discretionary)', 'Groceries (necessity)'],
    correctAnswers: [2],
    explanation: 'Discretionary (want) categories are easiest to adjust without affecting basic needs. Eating out ($300) is significantly higher than necessary for nutrition and is the most flexible. Fixed costs require contract changes; necessities can only be optimized, not eliminated.',
  },
  {
    id: 'budget-08', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'easy',
    question: 'What is the "opportunity cost" of a financial decision?',
    options: ['The total price of a purchase including taxes', 'The next best alternative you give up when making a choice', 'The interest charged on credit card spending', 'The cost of reversing a financial mistake'],
    correctAnswers: [1],
    explanation: 'Opportunity cost is the value of the best alternative foregone. If you spend $200 on new shoes, the opportunity cost might be the concert tickets you couldn\'t afford. Every spending decision has an implicit trade-off.',
  },
  {
    id: 'budget-09', domain: 1, subdomain: 'Budgeting & Spending', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A budget should be created based on expected income, not actual take-home (net) pay.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Budgets should be based on actual net (take-home) pay — the money you actually receive after taxes and deductions. Using gross income leads to over-spending because you won\'t have those pre-tax dollars available.',
  },
  {
    id: 'budget-10', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'medium',
    question: 'Which budgeting strategy involves envelopes (physical or digital) with set spending limits for each category?',
    options: ['Zero-based budgeting', 'Envelope method', '50/30/20 rule', 'Pay-yourself-first'],
    correctAnswers: [1],
    explanation: 'The envelope method assigns cash (or a digital equivalent) to labeled categories. Once an envelope is empty, spending in that category stops for the month. It creates tangible spending boundaries and prevents category overspending.',
  },
  {
    id: 'budget-11', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'easy',
    question: 'Which of the following is an example of a VARIABLE expense?',
    options: ['Monthly apartment rent', 'Car loan payment', 'Monthly electric bill', 'Annual insurance premium'],
    correctAnswers: [2],
    explanation: 'Electricity is a variable expense because usage changes based on season and behavior — it\'s different each month. Rent and car loans are fixed (same amount). Insurance premiums paid annually are fixed if they don\'t change.',
  },
  {
    id: 'budget-12', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'hard',
    question: 'If a person\'s monthly housing costs exceed 30% of gross monthly income, what financial risk increases?',
    options: ['Risk of bank account fees', 'Risk of being "house poor" — unable to afford other necessities', 'Risk of losing a job', 'Risk of credit card fraud'],
    correctAnswers: [1],
    explanation: 'Financial experts use 30% of gross income as a housing affordability guideline. Exceeding this leaves insufficient income for food, transportation, savings, and emergencies — a condition called being "house poor."',
  },
  {
    id: 'budget-13', domain: 1, subdomain: 'Budgeting & Spending', type: 'ordering', difficulty: 'medium',
    question: 'Order these steps in creating a personal budget from FIRST to LAST:',
    options: ['Track actual spending for one month', 'Set spending limits per category', 'Calculate monthly net income', 'List all fixed and variable expenses'],
    correctAnswers: [2, 3, 0, 1],
    explanation: 'Start with income (what you have), then list all expenses (what you owe), then track spending to understand actual patterns, then set realistic limits based on that data.',
  },
  {
    id: 'budget-14', domain: 1, subdomain: 'Budgeting & Spending', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Subscriptions (streaming, music, apps) should be categorized as "needs" in a budget.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Subscriptions for entertainment (Netflix, Spotify, gaming apps) are "wants" — discretionary spending that improves quality of life but isn\'t required for survival or employment. They\'re some of the easiest expenses to cut when budgets are tight.',
  },
  {
    id: 'budget-15', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'medium',
    question: 'What is "lifestyle inflation"?',
    options: ['Rising prices due to general inflation', 'The tendency to increase spending when income increases', 'A government measure of cost of living', 'Charging more for luxury goods'],
    correctAnswers: [1],
    explanation: 'Lifestyle inflation (lifestyle creep) is the pattern of increasing discretionary spending as income rises — upgrading cars, eating out more, buying more clothes. It prevents wealth accumulation even as income grows significantly.',
  },

  // ══════════════════════════════════════════════════════════════
  // Saving & Banking
  // ══════════════════════════════════════════════════════════════
  {
    id: 'save-01', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'easy',
    question: 'What is the recommended size of an emergency fund?',
    options: ['1 week of expenses', '1 month of income', '3–6 months of living expenses', '$1,000 exactly'],
    correctAnswers: [2],
    explanation: 'Most financial advisors recommend 3–6 months of essential living expenses in an easily accessible account. This cushion covers job loss, medical emergencies, or major repairs without going into debt.',
  },
  {
    id: 'save-02', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'medium',
    question: 'You deposit $1,000 in an account earning 5% simple interest for 3 years. How much interest do you earn?',
    options: ['$50', '$150', '$157.63', '$200'],
    correctAnswers: [1],
    explanation: 'Simple interest = Principal × Rate × Time = $1,000 × 0.05 × 3 = $150. Simple interest is calculated only on the principal, not on accumulated interest.',
  },
  {
    id: 'save-03', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'medium',
    question: 'What does APY stand for, and why does it matter?',
    options: ['Annual Percentage Yield — it shows the real annual return including compounding', 'Annual Payment Yearly — the scheduled payment amount', 'Average Portfolio Yield — investment return', 'Adjusted Principal Yearly — the balance after fees'],
    correctAnswers: [0],
    explanation: 'APY (Annual Percentage Yield) includes the effect of compounding — it shows what you\'ll actually earn or pay over a year. Always compare APYs, not just stated interest rates, when choosing savings accounts or loans.',
  },
  {
    id: 'save-04', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'easy',
    question: 'What does FDIC insurance protect?',
    options: ['Investments in the stock market', 'Cash in bank deposit accounts up to $250,000 per depositor per bank', 'Cash under your mattress', 'All financial products offered by banks'],
    correctAnswers: [1],
    explanation: 'The FDIC (Federal Deposit Insurance Corporation) insures deposits up to $250,000 per depositor, per FDIC-insured bank, per ownership category. This protects savings, checking, and CDs if a bank fails.',
  },
  {
    id: 'save-05', domain: 1, subdomain: 'Saving & Banking', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Compound interest earns interest on both the principal and the previously earned interest.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Compound interest is "interest on interest." Your balance grows faster because each period\'s interest is added to the principal and earns interest in subsequent periods. This is why starting to save early is so powerful.',
  },
  {
    id: 'save-06', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'medium',
    question: 'Which savings vehicle typically offers the highest interest rate but requires keeping money deposited for a fixed term?',
    options: ['Checking account', 'Basic savings account', 'Money market account', 'Certificate of Deposit (CD)'],
    correctAnswers: [3],
    explanation: 'CDs offer higher interest rates because you commit to leaving money deposited for a fixed term (3 months to 5 years). Early withdrawal usually incurs a penalty. The tradeoff: higher return for lower liquidity.',
  },
  {
    id: 'save-07', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'easy',
    question: 'What is "liquidity" in personal finance?',
    options: ['The interest rate on a savings account', 'How easily an asset can be converted to cash without significant loss of value', 'The total balance in your bank account', 'The monthly fee charged by a bank'],
    correctAnswers: [1],
    explanation: 'Liquidity measures how quickly and easily you can access your money. Cash is perfectly liquid. A savings account is highly liquid. Real estate is illiquid — selling takes time. Emergency funds must be in liquid accounts.',
  },
  {
    id: 'save-08', domain: 1, subdomain: 'Saving & Banking', type: 'ordering', difficulty: 'medium',
    question: 'Order these savings vehicles from HIGHEST to LOWEST typical interest rate:',
    options: ['Basic checking account', 'High-yield savings account', 'Certificate of Deposit (CD)', 'Traditional savings account'],
    correctAnswers: [2, 1, 3, 0],
    explanation: 'CDs lock your money in for a term and earn the most. High-yield savings accounts (often online) beat traditional savings. Traditional savings accounts earn modest interest. Checking accounts typically earn nothing.',
  },
  {
    id: 'save-09', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'hard',
    question: '$500 is invested at 6% annual interest compounded annually for 2 years. What is the balance?',
    options: ['$560.00', '$562.00', '$561.80', '$600.00'],
    correctAnswers: [2],
    explanation: 'Year 1: $500 × 1.06 = $530. Year 2: $530 × 1.06 = $561.80. Using the formula: A = P(1+r)ⁿ = 500(1.06)² = 500 × 1.1236 = $561.80. Note: simple interest would give only $560.',
  },
  {
    id: 'save-10', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'easy',
    question: 'What is the main difference between a credit union and a traditional bank?',
    options: ['Credit unions are for-profit; banks are non-profit', 'Credit unions are non-profit cooperatives owned by members; banks are for-profit', 'Credit unions are insured by FDIC; banks are not', 'Banks offer lower interest rates on loans'],
    correctAnswers: [1],
    explanation: 'Credit unions are member-owned non-profit cooperatives that often offer lower loan rates and higher savings rates. Banks are for-profit institutions. Credit unions are insured by NCUA (equivalent of FDIC for credit unions).',
  },
  {
    id: 'save-11', domain: 1, subdomain: 'Saving & Banking', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are true about a checking account? (Select all that apply)',
    options: ['Designed for everyday transactions', 'Typically earns little or no interest', 'Money can be withdrawn via debit card', 'Insured by FDIC up to $250,000'],
    correctAnswers: [0, 1, 2, 3],
    explanation: 'All four are true. Checking accounts are transaction accounts — not designed for growing savings. They earn minimal interest but provide convenient access through debit cards, checks, and electronic transfers, and are FDIC insured.',
  },
  {
    id: 'save-12', domain: 1, subdomain: 'Saving & Banking', type: 'yesno', difficulty: 'medium',
    question: 'True or False: The "Rule of 72" can be used to estimate how many years it takes to double your money at a given interest rate.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The Rule of 72 states: Years to double ≈ 72 ÷ annual interest rate. At 6%, money doubles in about 12 years. At 4%, about 18 years. It\'s a quick mental math shortcut for understanding compound growth.',
  },
  {
    id: 'save-13', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'easy',
    question: 'What is the "pay yourself first" savings strategy?',
    options: ['Pay all bills before spending on anything else', 'Transfer a set amount to savings immediately when paid, before spending on anything else', 'Negotiate a salary increase before creating a budget', 'Pay off debt before saving anything'],
    correctAnswers: [1],
    explanation: '"Pay yourself first" means automating savings transfers as soon as you receive your paycheck, before discretionary spending. This treats savings as a non-negotiable expense rather than an afterthought.',
  },
  {
    id: 'save-14', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'medium',
    question: 'A savings account earns 4% APY. Approximately how many years will it take to double the balance (use Rule of 72)?',
    options: ['4 years', '18 years', '28.8 years', '288 years'],
    correctAnswers: [1],
    explanation: 'Rule of 72: Years to double = 72 ÷ interest rate = 72 ÷ 4 = 18 years. Higher rates compound faster — at 8%, money doubles in just 9 years.',
  },
  {
    id: 'save-15', domain: 1, subdomain: 'Saving & Banking', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Money in a savings account loses purchasing power if the inflation rate exceeds the account\'s interest rate.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'If inflation is 3% and your savings account earns 1%, your real purchasing power decreases by ~2% annually. The balance grows in dollars, but each dollar buys less. This is why some savings should be invested in growth assets.',
  },

  // ══════════════════════════════════════════════════════════════
  // Credit & Debt
  // ══════════════════════════════════════════════════════════════
  {
    id: 'credit-01', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'easy',
    question: 'What is a credit score, and what range does FICO use?',
    options: ['A measure of income, range 0–100', 'A measure of creditworthiness, range 300–850', 'A measure of net worth, range 0–1,000', 'A measure of debt, range 100–1,000'],
    correctAnswers: [1],
    explanation: 'A FICO credit score ranges from 300 to 850. Higher is better. Scores above 740 are generally considered "very good" and qualify for the best interest rates. Scores below 580 are considered poor and may lead to loan denial.',
  },
  {
    id: 'credit-02', domain: 1, subdomain: 'Credit & Debt', type: 'multi', difficulty: 'medium',
    question: 'Which factors make up your FICO credit score? (Select all that apply)',
    options: ['Payment history', 'Amounts owed (credit utilization)', 'Length of credit history', 'Your annual income'],
    correctAnswers: [0, 1, 2],
    explanation: 'FICO\'s five factors: Payment history (35%), Amounts owed (30%), Length of credit history (15%), New credit (10%), Credit mix (10%). Income is NOT a factor — you could have high income and a poor score due to missed payments.',
  },
  {
    id: 'credit-03', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'medium',
    question: 'What is a "credit utilization ratio"?',
    options: ['Your total debt divided by your annual income', 'The percentage of your available credit that you are currently using', 'The number of credit cards you own', 'Your monthly minimum payment divided by your balance'],
    correctAnswers: [1],
    explanation: 'Credit utilization = (total credit card balances ÷ total credit limits) × 100. Financial experts recommend keeping it below 30%. High utilization signals financial stress to lenders and lowers your score.',
  },
  {
    id: 'credit-04', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'easy',
    question: 'What is APR in the context of credit cards?',
    options: ['Annual Profit Rate earned by the bank', 'Annual Percentage Rate — the yearly interest rate charged on balances', 'Automatic Payment Requirement', 'Accumulated Principal Reduction'],
    correctAnswers: [1],
    explanation: 'APR (Annual Percentage Rate) is the yearly cost of borrowing expressed as a percentage. Credit card APRs average 20%+. If you carry a balance, APR determines how much interest you pay. Paying in full monthly avoids interest entirely.',
  },
  {
    id: 'credit-05', domain: 1, subdomain: 'Credit & Debt', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Making only the minimum payment on a credit card is the most efficient way to pay off debt.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Minimum payments are designed to maximize interest paid to the lender, not to help you pay off debt quickly. A $3,000 balance at 20% APR with minimum payments can take 10+ years and cost twice the original balance in interest.',
  },
  {
    id: 'credit-06', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'medium',
    question: 'What are the three major credit bureaus that maintain your credit report?',
    options: ['Visa, Mastercard, American Express', 'Equifax, Experian, TransUnion', 'FDIC, NCUA, CFPB', 'Moody\'s, S&P, Fitch'],
    correctAnswers: [1],
    explanation: 'Equifax, Experian, and TransUnion are the three major credit bureaus. They collect payment history, account information, and public records. You can get a free annual report from each at AnnualCreditReport.com.',
  },
  {
    id: 'credit-07', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'hard',
    question: 'You owe $5,000 on a card at 18% APR. You can pay $100/month. Which strategy gets you out of debt faster with less interest paid?',
    options: ['Pay minimum each month then large payment at year end', 'Pay exactly $100 every month consistently', 'Use debt avalanche — put extra money to highest-APR debt first', 'Pay the minimum only and invest the rest'],
    correctAnswers: [2],
    explanation: 'The debt avalanche method targets the highest-interest debt first, minimizing total interest paid. After the highest-rate debt is cleared, roll that payment to the next highest rate. This is mathematically optimal compared to minimum-only or unstrategic payments.',
  },
  {
    id: 'credit-08', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'medium',
    question: 'What is the difference between secured and unsecured debt?',
    options: ['Secured debt has lower interest rates; unsecured has higher', 'Secured debt is backed by collateral; unsecured debt is not', 'Secured debt is for businesses; unsecured is for individuals', 'Secured debt has fixed rates; unsecured has variable rates'],
    correctAnswers: [1],
    explanation: 'Secured debt uses collateral (an asset the lender can seize if you default) — mortgages use homes, auto loans use vehicles. Unsecured debt (credit cards, student loans, personal loans) has no collateral, so lenders charge higher interest rates for the extra risk.',
  },
  {
    id: 'credit-09', domain: 1, subdomain: 'Credit & Debt', type: 'ordering', difficulty: 'medium',
    question: 'Order these debt payoff methods from HIGHEST total interest saved to LOWEST:',
    options: ['Pay minimum only', 'Debt snowball (smallest balance first)', 'Debt avalanche (highest interest first)', 'Pay double minimum each month'],
    correctAnswers: [2, 3, 1, 0],
    explanation: 'Debt avalanche minimizes total interest mathematically. Double minimum still beats snowball for most scenarios. Snowball provides psychological wins but isn\'t optimal for interest savings. Minimum only is the most expensive approach.',
  },
  {
    id: 'credit-10', domain: 1, subdomain: 'Credit & Debt', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Closing old credit card accounts generally helps your credit score.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Closing old accounts typically hurts your score in two ways: it reduces total available credit (increasing utilization ratio) and reduces average age of accounts (shorter credit history). Keeping old accounts open and rarely used is usually better.',
  },
  {
    id: 'credit-11', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'easy',
    question: 'How often can you request a free credit report from each of the three major bureaus per year?',
    options: ['Once every 3 years', 'Once per year (weekly during COVID relief policies)', 'Once per month', 'Only when denied credit'],
    correctAnswers: [1],
    explanation: 'Under the Fair Credit Reporting Act, you can get one free annual credit report from each bureau. During COVID relief, access was expanded to weekly. Visit AnnualCreditReport.com — never pay for your basic credit report.',
  },
  {
    id: 'credit-12', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'medium',
    question: 'A credit card has a $2,000 limit. The balance is $700. What is the utilization ratio?',
    options: ['35%', '28.6%', '70%', '3.5%'],
    correctAnswers: [0],
    explanation: 'Credit utilization = balance ÷ limit = $700 ÷ $2,000 = 0.35 = 35%. Experts recommend keeping this below 30% to minimize negative impact on your credit score.',
  },

  // ══════════════════════════════════════════════════════════════
  // Investing & Markets
  // ══════════════════════════════════════════════════════════════
  {
    id: 'invest-01', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'easy',
    question: 'What does "diversification" mean in investing?',
    options: ['Putting all money in the single best investment', 'Spreading investments across different asset types to reduce risk', 'Investing only in government bonds', 'Changing investments every month'],
    correctAnswers: [1],
    explanation: 'Diversification spreads risk across many investments so poor performance by one doesn\'t devastate the entire portfolio. "Don\'t put all your eggs in one basket" — if you hold stocks, bonds, and real estate, a stock market crash doesn\'t wipe out everything.',
  },
  {
    id: 'invest-02', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'easy',
    question: 'What is a stock?',
    options: ['A loan to a company repaid with interest', 'Ownership shares in a company that may pay dividends and appreciate in value', 'A savings account with guaranteed returns', 'A government-issued debt instrument'],
    correctAnswers: [1],
    explanation: 'A stock represents partial ownership (equity) in a company. Stockholders may receive dividends (profit distributions) and benefit if the stock price rises. Stocks carry more risk than bonds but historically provide higher long-term returns.',
  },
  {
    id: 'invest-03', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is an index fund?',
    options: ['A fund managed by an expert to outperform the market', 'A fund that tracks a market index (like S&P 500) and holds all stocks in that index', 'A guaranteed-return government investment', 'A fund that invests only in international companies'],
    correctAnswers: [1],
    explanation: 'Index funds passively track a market index — an S&P 500 index fund holds all 500 companies in that index. They have very low fees and historically outperform most actively managed funds over the long term due to low costs.',
  },
  {
    id: 'invest-04', domain: 1, subdomain: 'Investing & Markets', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Historically, investing in a diversified stock portfolio over 30 years has been riskier than keeping money in a savings account.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Over long periods (20+ years), diversified stock market investments have historically outperformed savings accounts and beaten inflation. Short-term stock investing is risky; long-term diversified investing has been relatively reliable for wealth building.',
  },
  {
    id: 'invest-05', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is the main tax advantage of a traditional 401(k) retirement account?',
    options: ['Contributions are made post-tax, withdrawals are tax-free', 'Contributions reduce taxable income now; withdrawals are taxed in retirement', 'There are no taxes ever on 401(k) money', 'Employer contributions are always taxable to the employee immediately'],
    correctAnswers: [1],
    explanation: 'Traditional 401(k) contributions are pre-tax, reducing your taxable income today. The money grows tax-deferred. Withdrawals in retirement are taxed as ordinary income. This is beneficial if you expect to be in a lower tax bracket in retirement.',
  },
  {
    id: 'invest-06', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is a Roth IRA\'s key tax advantage?',
    options: ['Contributions are tax-deductible now', 'Contributions are after-tax, but qualified withdrawals in retirement are completely tax-free', 'There are no contribution limits', 'Employers can match Roth IRA contributions'],
    correctAnswers: [1],
    explanation: 'Roth IRA contributions are made with after-tax money, but growth and qualified withdrawals are tax-free. This is advantageous if you expect to be in a higher tax bracket in retirement — you pay taxes now at a lower rate.',
  },
  {
    id: 'invest-07', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'hard',
    question: 'You invest $1,000 at age 20 at 8% annual return. Your friend invests $1,000 at age 40 at the same rate. At age 65, approximately how much more will you have than your friend?',
    options: ['Slightly more — only 20 years difference', 'About twice as much', 'About 5 times as much', 'Nearly 7 times as much'],
    correctAnswers: [3],
    explanation: 'At 8% for 45 years: $1,000 × (1.08)^45 ≈ $31,920. For 25 years: $1,000 × (1.08)^25 ≈ $6,848. Ratio ≈ 4.7. With additional starting contributions, 20 extra years of compounding creates dramatic differences — the core lesson of starting early.',
  },
  {
    id: 'invest-08', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'easy',
    question: 'What is the general relationship between investment risk and potential return?',
    options: ['Higher risk means lower potential return', 'Higher risk generally means higher potential return (but also higher potential loss)', 'Risk and return are unrelated', 'Government bonds always outperform stocks because they\'re safer'],
    correctAnswers: [1],
    explanation: 'The risk-return tradeoff is fundamental to investing. To have a chance at higher returns, you must accept the possibility of larger losses. Savings accounts are safe but earn little. Stocks are volatile but historically earn more over the long term.',
  },
  {
    id: 'invest-09', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is an "employer match" in a 401(k) plan?',
    options: ['The percentage of salary you must contribute', 'Free money the employer contributes to match employee contributions up to a certain percentage', 'The maximum amount you are allowed to invest', 'The fee the employer charges for managing the account'],
    correctAnswers: [1],
    explanation: 'An employer match is essentially free money. If your employer matches 50% of contributions up to 6% of salary, contributing 6% gets you an extra 3% from your employer. Not capturing the full match is like refusing part of your salary.',
  },
  {
    id: 'invest-10', domain: 1, subdomain: 'Investing & Markets', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A bond represents an ownership stake in a company, similar to a stock.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'A bond is debt, not equity. When you buy a bond, you\'re lending money to a company or government, which promises to pay interest and return the principal. Stocks represent ownership; bonds represent loans. Bonds are generally less risky and earn less over time.',
  },
  {
    id: 'invest-11', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What does "inflation" mean for the purchasing power of money?',
    options: ['Inflation increases purchasing power over time', 'Inflation decreases purchasing power — the same amount of money buys less over time', 'Inflation only affects investments, not savings', 'Inflation means interest rates are always rising'],
    correctAnswers: [1],
    explanation: 'Inflation erodes purchasing power. $100 in 2000 buys far less in 2025. At 3% annual inflation, prices roughly double every 24 years. This is why simply saving in low-yield accounts isn\'t sufficient for long-term financial health — investments must outpace inflation.',
  },
  {
    id: 'invest-12', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'hard',
    question: 'What is a mutual fund and what advantage does it offer individual investors?',
    options: ['A fund requiring minimum $10,000 investment', 'A pooled investment vehicle that provides instant diversification across many securities', 'A type of savings account with variable interest', 'A fund exclusively for government bonds'],
    correctAnswers: [1],
    explanation: 'Mutual funds pool money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities. This gives small investors access to diversification that would be impossible to achieve with limited capital buying individual stocks.',
  },

  // ══════════════════════════════════════════════════════════════
  // Insurance & Risk Management
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ins-01', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'easy',
    question: 'What is an insurance "premium"?',
    options: ['The maximum amount insurance will pay for a claim', 'The amount you pay out-of-pocket before insurance pays', 'The regular payment made to maintain insurance coverage', 'The fee charged when you file a claim'],
    correctAnswers: [2],
    explanation: 'A premium is the recurring payment (monthly, quarterly, or annually) you make to keep your insurance policy active. Even if you never file a claim, premiums are owed to maintain coverage.',
  },
  {
    id: 'ins-02', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'easy',
    question: 'What is a "deductible" in insurance?',
    options: ['The maximum benefit the insurer pays per year', 'The amount you pay out-of-pocket before insurance begins paying', 'The monthly premium for coverage', 'The percentage the insurer pays after the deductible'],
    correctAnswers: [1],
    explanation: 'A deductible is the amount you pay first for covered services before insurance kicks in. A $1,000 deductible means you pay the first $1,000 of covered costs. Higher deductibles mean lower premiums — you accept more risk in exchange for lower monthly payments.',
  },
  {
    id: 'ins-03', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'medium',
    question: 'If your car insurance deductible is $500 and you have an accident causing $2,000 in damage, how much does insurance pay?',
    options: ['$2,000', '$1,500', '$500', '$2,500'],
    correctAnswers: [1],
    explanation: 'Insurance pays: total damage − deductible = $2,000 − $500 = $1,500. You pay the first $500 (deductible), then insurance covers the remaining $1,500. If damage were only $300 (below deductible), you\'d pay everything yourself.',
  },
  {
    id: 'ins-04', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'medium',
    question: 'What is "coinsurance" in health insurance?',
    options: ['The premium you split with your employer', 'The percentage of costs you pay AFTER meeting your deductible', 'Having two health insurance policies', 'The maximum you ever pay in a calendar year'],
    correctAnswers: [1],
    explanation: 'After meeting your deductible, coinsurance is the percentage you continue to share with the insurer. 80/20 coinsurance means the insurer pays 80%, you pay 20% of covered costs. This continues until you hit your out-of-pocket maximum.',
  },
  {
    id: 'ins-05', domain: 1, subdomain: 'Insurance & Risk Management', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are common types of insurance people typically need? (Select all that apply)',
    options: ['Health insurance', 'Auto insurance', 'Life insurance (especially with dependents)', 'Vacation insurance for every trip'],
    correctAnswers: [0, 1, 2],
    explanation: 'Health, auto, and life insurance are core coverage most people need. Vacation/travel insurance is situational and often optional. Renters and homeowners insurance are also commonly essential but not listed here.',
  },
  {
    id: 'ins-06', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'hard',
    question: 'Health insurance has a $1,500 deductible, 80/20 coinsurance, and $5,000 out-of-pocket maximum. You have a $10,000 medical bill. How much do you pay?',
    options: ['$10,000', '$3,200', '$5,000', '$2,000'],
    correctAnswers: [1],
    explanation: 'You pay the $1,500 deductible first. Remaining bill: $8,500. Your coinsurance share is 20% × $8,500 = $1,700. Total out of pocket: $1,500 + $1,700 = $3,200. The $5,000 out-of-pocket maximum is a CAP — it only kicks in if costs would otherwise exceed it. Since $3,200 < $5,000, you stop at $3,200.',
  },
  {
    id: 'ins-07', domain: 1, subdomain: 'Insurance & Risk Management', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A higher deductible typically results in lower insurance premiums.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Higher deductibles mean you pay more out-of-pocket if something goes wrong, so the insurer\'s risk is lower — they charge lower premiums in return. This tradeoff makes high-deductible plans attractive for healthy people with sufficient emergency savings.',
  },
  {
    id: 'ins-08', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'medium',
    question: 'What is the purpose of life insurance?',
    options: ['To fund your retirement account', 'To protect dependents financially if the insured person dies', 'To insure against personal injury lawsuits', 'To cover medical expenses during illness'],
    correctAnswers: [1],
    explanation: 'Life insurance provides a death benefit to beneficiaries if the policyholder dies. Its primary purpose is income replacement — protecting spouses, children, or others who depend on the insured\'s income. Those without dependents have less need for it.',
  },
  {
    id: 'ins-09', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'easy',
    question: 'Which auto insurance coverage pays for damage to other people\'s property when you cause an accident?',
    options: ['Comprehensive coverage', 'Collision coverage', 'Liability coverage', 'Uninsured motorist coverage'],
    correctAnswers: [2],
    explanation: 'Liability insurance covers damage you cause to others — their vehicles, property, or medical bills. It\'s legally required in most states. Collision covers your car in an accident. Comprehensive covers non-collision events (theft, weather). Uninsured motorist covers you when the other driver is uninsured.',
  },
  {
    id: 'ins-10', domain: 1, subdomain: 'Insurance & Risk Management', type: 'yesno', difficulty: 'medium',
    question: 'True or False: An "out-of-pocket maximum" in health insurance means once you hit that amount, insurance covers 100% of additional covered costs for the year.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The out-of-pocket maximum is a cap on your total annual spending for covered services. Once reached, the insurer pays 100% of covered costs for the rest of the year. This protects against catastrophic medical bills.',
  },
  {
    id: 'ins-11', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'easy',
    question: 'A renter should purchase what type of insurance to protect personal belongings from theft or fire?',
    options: ['Homeowner\'s insurance', 'Renters insurance', 'Umbrella insurance', 'The landlord\'s insurance covers tenants\' belongings'],
    correctAnswers: [1],
    explanation: 'Renters insurance protects your personal property in a rented home. The landlord\'s insurance only covers the building structure, NOT your belongings. Renters insurance is inexpensive ($15–30/month) and covers theft, fire, water damage, and sometimes liability.',
  },

  // ══════════════════════════════════════════════════════════════
  // Taxes & Government Programs
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tax-01', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'easy',
    question: 'What is a "progressive tax" system?',
    options: ['Everyone pays the same percentage of income', 'Higher earners pay a higher percentage of income in taxes', 'Taxes decrease as income increases', 'Only businesses pay taxes, not individuals'],
    correctAnswers: [1],
    explanation: 'The U.S. federal income tax is progressive — income is taxed at increasing rates as it exceeds threshold amounts (tax brackets). Higher earners pay higher rates on income above each bracket threshold, not on all their income.',
  },
  {
    id: 'tax-02', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'medium',
    question: 'If someone is in the 22% tax bracket, this means:',
    options: ['They pay 22% on ALL their income', 'They pay 22% on income within that bracket range only, with lower rates on income in lower brackets', 'They receive a 22% tax refund', 'Their employer pays 22% of their taxes for them'],
    correctAnswers: [1],
    explanation: 'Marginal tax rates apply to income within each bracket, not to all income. A person in the 22% bracket pays 10% on the first ~$11,000, 12% on the next ~$33,000, and 22% only on income above ~$44,000 (2023 single filer brackets).',
  },
  {
    id: 'tax-03', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'easy',
    question: 'What does it mean to receive a "tax refund"?',
    options: ['The government giving you a bonus for paying taxes', 'The government returning money you overpaid in withholding throughout the year', 'Your employer returning withheld taxes', 'A reward for filing taxes on time'],
    correctAnswers: [1],
    explanation: 'A tax refund means you had more withheld from paychecks throughout the year than you actually owed. The IRS returns the overpayment. A refund is NOT free money — you\'re getting back your own money that was withheld interest-free.',
  },
  {
    id: 'tax-04', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'medium',
    question: 'What is the "standard deduction" on a federal tax return?',
    options: ['The minimum tax everyone must pay', 'A set dollar amount subtracted from gross income to reduce taxable income, without itemizing', 'A tax credit given to low-income filers', 'The percentage of Social Security taxes withheld'],
    correctAnswers: [1],
    explanation: 'The standard deduction reduces taxable income without itemizing individual deductions. For 2024, it\'s $14,600 (single). Most taxpayers take the standard deduction. You only itemize if your actual deductible expenses exceed the standard deduction.',
  },
  {
    id: 'tax-05', domain: 1, subdomain: 'Taxes & Government Programs', type: 'yesno', difficulty: 'easy',
    question: 'True or False: FAFSA is a government program that helps students apply for federal financial aid for college.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'FAFSA (Free Application for Federal Student Aid) determines eligibility for federal grants (Pell Grant), work-study, and loans. Filing it is essential for most students seeking financial aid. It\'s free to complete and is filed annually.',
  },
  {
    id: 'tax-06', domain: 1, subdomain: 'Taxes & Government Programs', type: 'multi', difficulty: 'medium',
    question: 'Which of the following government programs are funded primarily by FICA payroll taxes? (Select all that apply)',
    options: ['Social Security', 'Medicare', 'Medicaid', 'The Pell Grant'],
    correctAnswers: [0, 1],
    explanation: 'Social Security and Medicare are funded by FICA taxes (6.2% + 1.45% from employee, matched by employer). Medicaid is funded through general tax revenues (federal and state). Pell Grants are federally appropriated education funds.',
  },
  {
    id: 'tax-07', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'medium',
    question: 'What is the federal income tax return deadline for most individual taxpayers?',
    options: ['March 15', 'April 15', 'June 30', 'January 31'],
    correctAnswers: [1],
    explanation: 'Federal income tax returns are typically due April 15. If April 15 falls on a weekend or holiday, the deadline shifts to the next business day. Extensions give 6 additional months for filing (but not for paying — taxes owed must be paid by April 15).',
  },
  {
    id: 'tax-08', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'hard',
    question: 'What is the difference between a tax "deduction" and a tax "credit"?',
    options: ['They are the same thing', 'A deduction reduces taxable income; a credit directly reduces tax owed (more valuable dollar-for-dollar)', 'A credit reduces income; a deduction reduces tax owed', 'Credits are only for businesses; deductions are for individuals'],
    correctAnswers: [1],
    explanation: 'A $1,000 deduction saves you $1,000 × your marginal rate (e.g., $220 if in 22% bracket). A $1,000 tax credit saves you $1,000 regardless of your bracket — it comes directly off your tax bill. Credits are more valuable dollar-for-dollar.',
  },
  {
    id: 'tax-09', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'easy',
    question: 'What government program provides income support to retired and disabled Americans?',
    options: ['Medicare', 'Medicaid', 'Social Security', 'SNAP'],
    correctAnswers: [2],
    explanation: 'Social Security provides retirement, disability, and survivor benefits. Workers earn credits through payroll taxes over their careers. Benefits are available at age 62 (reduced) or full retirement age (66–67 depending on birth year).',
  },
  {
    id: 'tax-10', domain: 1, subdomain: 'Taxes & Government Programs', type: 'yesno', difficulty: 'medium',
    question: 'True or False: If you owe taxes when you file your return, it means you committed a tax violation.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Owing taxes at filing is normal — it just means insufficient withholding or estimated payments during the year. It\'s not a violation unless you deliberately under-withhold to gain an interest-free loan. Some people prefer to owe slightly rather than over-withhold.',
  },
  {
    id: 'tax-11', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'medium',
    question: 'What does SNAP provide to eligible low-income Americans?',
    options: ['Monthly cash payments', 'Health insurance', 'Benefits to purchase food at approved retailers', 'Rent assistance'],
    correctAnswers: [2],
    explanation: 'SNAP (Supplemental Nutrition Assistance Program, formerly food stamps) provides electronic benefits on a debit-like card that can be used to purchase food at approved grocery stores and markets. It\'s the largest federal nutrition assistance program.',
  },
  {
    id: 'tax-12', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'easy',
    question: 'Which federal program provides health insurance for people aged 65 and older?',
    options: ['Medicaid', 'Medicare', 'CHIP', 'The ACA Marketplace'],
    correctAnswers: [1],
    explanation: 'Medicare is the federal health insurance program for people 65+, and for certain younger people with disabilities. Medicaid covers low-income individuals of all ages. CHIP covers children in low-income families not eligible for Medicaid.',
  },

  // ══════════════════════════════════════════════════════════════
  // Credit & Debt — additional questions (cred-13 to cred-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'cred-13', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'medium',
    question: 'What is the "debt snowball" method?',
    options: [
      'Pay off the highest-interest debt first to minimize total interest',
      'Pay off the smallest balance first to build momentum, then roll payments to the next debt',
      'Pay equal amounts to all debts simultaneously',
      'Consolidate all debts into a single loan',
    ],
    correctAnswers: [1],
    explanation: 'The debt snowball method targets the smallest balance first regardless of interest rate. Once paid off, that monthly payment "rolls" to the next smallest. The psychological wins of eliminating accounts quickly help people stay motivated, though the debt avalanche is mathematically cheaper.',
  },
  {
    id: 'cred-14', domain: 1, subdomain: 'Credit & Debt', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Applying for several new credit cards within a short time period will lower your credit score.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Each credit card application triggers a "hard inquiry," which temporarily lowers your score by a few points. Multiple hard inquiries in a short window signal financial distress to lenders. The "new credit" category makes up 10% of your FICO score.',
  },
  {
    id: 'cred-15', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'hard',
    question: 'A student loan has a $15,000 balance at 5% annual interest. The borrower makes only $50 monthly payments. What financial risk does this create?',
    options: [
      'The balance will be paid off faster than expected',
      'Monthly interest accrual (~$62.50) exceeds the payment, causing the balance to grow — negative amortization',
      'The interest rate will automatically increase',
      'The lender will forgive the remaining balance after 10 years',
    ],
    correctAnswers: [1],
    explanation: 'Monthly interest = $15,000 × 0.05 / 12 ≈ $62.50. A $50 payment is less than the interest charge, so the unpaid interest (~$12.50) is added to the balance each month. This is negative amortization — debt grows despite making payments. Income-driven repayment plans are designed to avoid this trap.',
  },

  // ══════════════════════════════════════════════════════════════
  // Investing & Markets — additional questions (inv-13 to inv-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'inv-13', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is an ETF (Exchange-Traded Fund)?',
    options: [
      'A savings account with a fixed interest rate set by the government',
      'A fund that trades on stock exchanges like a stock but holds a basket of underlying securities',
      'An emergency fund deposited with a credit union',
      'A type of bond issued by the federal government',
    ],
    correctAnswers: [1],
    explanation: 'An ETF (Exchange-Traded Fund) holds a basket of assets (stocks, bonds, commodities) and trades on an exchange throughout the day like a single stock. ETFs typically have lower fees than mutual funds, offer instant diversification, and can be bought or sold any time the market is open.',
  },
  {
    id: 'inv-14', domain: 1, subdomain: 'Investing & Markets', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are generally true about investing in bonds compared to stocks? (Select all that apply)',
    options: [
      'Bonds typically carry lower risk than stocks',
      'Bonds pay a fixed interest (coupon) payment',
      'Bondholders are paid before stockholders if a company goes bankrupt',
      'Bonds historically produce higher long-term returns than stocks',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Bonds are loans to companies or governments and are generally less risky than stocks. They pay fixed coupon interest and bondholders have priority over stockholders in bankruptcy. However, bonds historically produce lower long-term returns than stocks — the tradeoff for lower risk.',
  },
  {
    id: 'inv-15', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'easy',
    question: 'What is "risk tolerance" in personal investing?',
    options: [
      'The maximum amount of money you are allowed to invest per year',
      'An investor\'s ability and willingness to endure investment losses in pursuit of higher potential returns',
      'The percentage of income the government allows you to invest tax-free',
      'The minimum return required to beat inflation',
    ],
    correctAnswers: [1],
    explanation: 'Risk tolerance is how much investment volatility and potential loss you can emotionally and financially handle. Younger investors often have higher risk tolerance (long time horizon to recover from downturns). Someone nearing retirement typically needs lower risk since they cannot wait out a long market decline.',
  },

  // ══════════════════════════════════════════════════════════════
  // Insurance & Risk Management — additional questions (ins-12 to ins-13)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ins-12', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'medium',
    question: 'What is "liability" coverage in homeowner\'s or auto insurance?',
    options: [
      'Coverage that pays to repair your own vehicle after a collision',
      'Coverage that protects you financially if you are legally responsible for injury or property damage to others',
      'Coverage that pays your medical bills after an accident regardless of fault',
      'Coverage for theft of personal belongings',
    ],
    correctAnswers: [1],
    explanation: 'Liability coverage pays on your behalf when you are legally responsible (liable) for bodily injury or property damage to other people. For example, if you cause a car accident and injure another driver, your liability coverage pays their medical bills and car repair up to your policy limit.',
  },
  {
    id: 'ins-13', domain: 1, subdomain: 'Insurance & Risk Management', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A "beneficiary" is the person or entity who receives the payout from a life insurance policy when the insured person dies.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'A beneficiary is designated in the policy by the policyholder and receives the death benefit. Beneficiaries can be a spouse, child, other family member, or even a charity or trust. It is important to keep beneficiary designations updated after major life events like marriage, divorce, or having children.',
  },

  // ══════════════════════════════════════════════════════════════
  // Taxes & Government Programs — additional questions (tax-13 to tax-14)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tax-13', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'medium',
    question: 'What is "filing status" on a federal income tax return, and why does it matter?',
    options: [
      'Whether you filed on time or requested an extension',
      'A category (Single, Married Filing Jointly, Head of Household, etc.) that determines your tax brackets and standard deduction amount',
      'Whether you are a U.S. citizen or resident alien',
      'The type of income you earned during the year',
    ],
    correctAnswers: [1],
    explanation: 'Filing status determines which tax brackets and standard deduction apply to your return. Married Filing Jointly typically offers the most favorable rates. Head of Household (for unmarried taxpayers supporting a dependent) offers better rates than Single. Choosing the correct status is one of the most impactful decisions on your tax return.',
  },
  {
    id: 'tax-14', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'hard',
    question: 'What is the key difference between a traditional IRA and a Roth IRA regarding taxes?',
    options: [
      'Traditional IRA has no contribution limit; Roth IRA is capped at $500/year',
      'Traditional IRA contributions may be tax-deductible now with taxes paid on withdrawal; Roth IRA contributions are after-tax with tax-free qualified withdrawals',
      'Traditional IRA is for self-employed only; Roth IRA is for employees only',
      'They are identical — both offer the same tax treatment',
    ],
    correctAnswers: [1],
    explanation: 'Traditional IRA: contribute pre-tax dollars (reducing current taxable income), pay taxes when you withdraw in retirement. Roth IRA: contribute after-tax dollars (no current deduction), but qualified withdrawals in retirement are completely tax-free. The better choice depends on whether you expect higher taxes now or in retirement.',
  },

  // ══════════════════════════════════════════════════════════════
  // Saving & Banking — additional questions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sb-16', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'easy',
    question: 'What does FDIC insurance protect?',
    options: [
      'Stock market investments up to $250,000',
      'Bank deposits up to $250,000 per depositor, per institution, per ownership category',
      'All money held in any financial account regardless of amount',
      'Only savings accounts, not checking accounts',
    ],
    correctAnswers: [1],
    explanation: 'The FDIC (Federal Deposit Insurance Corporation) insures bank deposits up to $250,000 per depositor per insured bank per ownership category. This covers checking, savings, money market deposit accounts, and CDs. Investment products like stocks, bonds, and mutual funds are NOT covered.',
  },
  {
    id: 'sb-17', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'medium',
    question: 'If you deposit $5,000 into a savings account earning 4% APY, how much will you have after one year?',
    options: ['$5,040', '$5,200', '$5,204', '$5,400'],
    correctAnswers: [1],
    explanation: 'APY (Annual Percentage Yield) is the effective annual return AFTER compounding is factored in. So 4% APY on $5,000 gives exactly $5,000 × 1.04 = $5,200 after one year, regardless of how often the bank compounds. (If "4%" referred to the APR — nominal rate — and the bank compounded monthly, you\'d end up around $5,204, with an APY of roughly 4.07%.) Always compare savings accounts on APY, not APR.',
  },
  {
    id: 'sb-18', domain: 1, subdomain: 'Saving & Banking', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are benefits of a high-yield savings account compared to a traditional savings account? (Select all that apply.)',
    options: [
      'Higher interest rate on deposits',
      'FDIC insured just like traditional savings accounts',
      'No risk of losing principal due to market fluctuations',
      'Guaranteed returns that always beat inflation',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'High-yield savings accounts typically offer interest rates 10–20× higher than traditional savings accounts, are FDIC insured (same protection), and carry no market risk — your principal is safe. They do NOT guarantee returns that beat inflation; when inflation is high, even a 4–5% HYSA may lose real purchasing power.',
  },
  {
    id: 'sb-19', domain: 1, subdomain: 'Saving & Banking', type: 'single', difficulty: 'medium',
    question: 'What is the primary purpose of a certificate of deposit (CD)?',
    options: [
      'To invest in the stock market with bank backing',
      'To lock in a fixed interest rate for a set term in exchange for not withdrawing the money early',
      'To provide unlimited withdrawals with no fees',
      'To serve as a replacement for a checking account',
    ],
    correctAnswers: [1],
    explanation: 'A CD locks your deposit for a fixed term (e.g., 6 months, 1 year, 5 years) in exchange for a guaranteed, typically higher interest rate than a savings account. Early withdrawal usually triggers a penalty — often 3–6 months of interest — so CDs work best when you know you won\'t need the money until maturity.',
  },
  {
    id: 'sb-20', domain: 1, subdomain: 'Saving & Banking', type: 'yesno', difficulty: 'easy',
    question: 'Is it true that a money market account (MMA) at a bank is FDIC insured?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Bank money market accounts (MMAs) are FDIC insured up to $250,000 per depositor per bank. Do not confuse them with money market mutual funds (offered by investment companies), which are NOT FDIC insured. Both offer check-writing privileges but the insurance distinction is critical.',
  },

  // ══════════════════════════════════════════════════════════════
  // Investing & Markets — additional questions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'inv-16', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is dollar-cost averaging?',
    options: [
      'Buying only when the market is at its lowest price of the year',
      'Investing a fixed dollar amount at regular intervals regardless of the asset\'s price',
      'Converting all investments to cash during market downturns',
      'Calculating the average cost of goods in an economy',
    ],
    correctAnswers: [1],
    explanation: 'Dollar-cost averaging (DCA) means investing a fixed amount (e.g., $200/month) on a regular schedule regardless of market price. When prices are low you buy more shares; when prices are high you buy fewer. Over time this averages out your cost per share and reduces the risk of investing a large lump sum at the wrong time.',
  },
  {
    id: 'inv-17', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'hard',
    question: 'A stock pays a $2 annual dividend and currently trades at $40. What is its dividend yield?',
    options: ['2%', '4%', '5%', '8%'],
    correctAnswers: [2],
    explanation: 'Dividend yield = Annual dividend per share ÷ Current stock price × 100. Here: $2 ÷ $40 = 0.05 = 5%. Dividend yield tells investors how much cash income they receive per dollar invested. A 5% dividend yield means you earn $5 in dividends for every $100 invested (before any price change).',
  },
  {
    id: 'inv-18', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is a mutual fund?',
    options: [
      'A government-sponsored retirement account',
      'A pooled investment vehicle where many investors\' money is combined and managed by a professional to buy a diversified portfolio of securities',
      'A bank account that earns interest based on stock market performance',
      'A bond issued by a corporation to raise capital',
    ],
    correctAnswers: [1],
    explanation: 'A mutual fund pools money from many investors and a professional fund manager uses the combined assets to buy a diversified portfolio of stocks, bonds, or other securities. This gives small investors access to diversification and professional management. Returns are shared proportionally among all investors based on the number of shares owned.',
  },
  {
    id: 'inv-19', domain: 1, subdomain: 'Investing & Markets', type: 'ordering', difficulty: 'hard',
    question: 'Rank the following asset classes from LOWEST to HIGHEST typical long-term risk/return:',
    options: [
      'U.S. Treasury bonds (short-term)',
      'Large-cap U.S. stocks (S&P 500)',
      'Small-cap growth stocks',
      'Investment-grade corporate bonds',
    ],
    correctAnswers: [0, 3, 1, 2],
    explanation: 'Risk/return spectrum from lowest to highest: (1) T-bills/short-term government bonds — safest, lowest return; (2) investment-grade corporate bonds — slightly more risk than government bonds; (3) large-cap stocks — higher long-term return with more volatility; (4) small-cap growth stocks — highest historical long-run return but also greatest volatility and risk of loss.',
  },
  {
    id: 'inv-20', domain: 1, subdomain: 'Investing & Markets', type: 'single', difficulty: 'medium',
    question: 'What is an expense ratio in the context of mutual funds or ETFs?',
    options: [
      'The percentage of profits the fund distributes as dividends',
      'The annual fee charged by the fund as a percentage of assets under management',
      'The ratio of the fund\'s gains to its losses over the past year',
      'A government tax on investment fund earnings',
    ],
    correctAnswers: [1],
    explanation: 'The expense ratio is the annual operating cost of a fund expressed as a percentage of its total assets. A 0.03% expense ratio on a $10,000 investment costs $3/year; a 1.0% ratio costs $100/year. Over decades, this difference compounds significantly — a 1% higher expense ratio can reduce final wealth by 20–30% over a 30-year career.',
  },

  // ══════════════════════════════════════════════════════════════
  // Earning Income — additional questions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'earn-16', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'medium',
    question: 'What is a W-2 form and who sends it?',
    options: [
      'A form sent by banks to report interest income',
      'A tax form sent by employers to employees summarizing wages earned and taxes withheld during the year',
      'A form you fill out when you start a new job to claim allowances',
      'A quarterly estimated tax payment form sent by the IRS',
    ],
    correctAnswers: [1],
    explanation: 'Your employer sends you a W-2 by January 31 each year. It shows your total wages, federal and state income taxes withheld, Social Security and Medicare taxes withheld, and other compensation. You use this form to complete your annual tax return. A W-4 (not W-2) is what you fill out when starting a new job.',
  },
  {
    id: 'earn-17', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'medium',
    question: 'What is the overtime rate that federal law (FLSA) requires for non-exempt employees who work more than 40 hours in a week?',
    options: ['1.0× (same as regular pay)', '1.25× regular pay', '1.5× regular pay', '2.0× regular pay'],
    correctAnswers: [2],
    explanation: 'The Fair Labor Standards Act (FLSA) requires employers to pay at least 1.5 times (time-and-a-half) the regular hourly rate for each hour worked beyond 40 in a workweek for non-exempt employees. Some states have stricter rules. Salaried employees classified as "exempt" (typically managers earning above a salary threshold) are not entitled to overtime.',
  },
  {
    id: 'earn-18', domain: 1, subdomain: 'Earning Income', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are typically deducted from an employee\'s gross pay before they receive their paycheck? (Select all that apply.)',
    options: [
      'Federal income tax withholding',
      'Social Security and Medicare taxes (FICA)',
      'Health insurance premiums (if enrolled)',
      'State sales tax on purchases',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Pre-paycheck deductions include: federal income tax (based on your W-4 withholding elections), FICA taxes (6.2% Social Security + 1.45% Medicare), and any benefit premiums you\'ve elected (health, dental, vision, life insurance, 401k contributions). Sales tax is charged at the point of sale — it has nothing to do with your paycheck.',
  },
  {
    id: 'earn-19', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'easy',
    question: 'What is the difference between a salary and an hourly wage?',
    options: [
      'A salary is always higher than an hourly wage',
      'A salary is a fixed annual pay regardless of hours worked; an hourly wage is paid per hour and fluctuates with hours worked',
      'Salary workers always receive overtime; hourly workers never do',
      'They are the same — both describe total annual compensation',
    ],
    correctAnswers: [1],
    explanation: 'A salary is a fixed predetermined annual compensation (e.g., $52,000/year) divided into equal pay periods regardless of how many hours you work. An hourly wage is paid for each hour worked (e.g., $25/hour × 40 hrs = $1,000/week) and therefore varies. Salaried workers may or may not be eligible for overtime depending on their exemption status.',
  },
  {
    id: 'earn-20', domain: 1, subdomain: 'Earning Income', type: 'single', difficulty: 'hard',
    question: 'An employee earns $18/hour and works 46 hours in a week. What is their gross pay for that week?',
    options: ['$828', '$882', '$918', '$972'],
    correctAnswers: [1],
    explanation: 'Regular pay: 40 hours × $18 = $720. Overtime: 6 hours × ($18 × 1.5) = 6 × $27 = $162. Total gross pay: $720 + $162 = $882. Remember: overtime rate is 1.5× for all hours over 40 in a workweek under the FLSA.',
  },

  // ══════════════════════════════════════════════════════════════
  // Credit & Debt — additional questions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'cd-16', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'easy',
    question: 'What is a credit score and what range do most scoring models use?',
    options: [
      'A measure of your annual income, ranging from $0 to $999,999',
      'A three-digit number (typically 300–850) that summarizes your creditworthiness based on your credit history',
      'A score assigned by banks ranging from 1–10 based on your savings balance',
      'A government-issued rating between A and F indicating your financial health',
    ],
    correctAnswers: [1],
    explanation: 'A credit score (most commonly FICO or VantageScore) is a three-digit number typically ranging from 300 to 850. Higher scores signal lower risk to lenders. Generally: 800+ = exceptional, 740–799 = very good, 670–739 = good, 580–669 = fair, below 580 = poor. Your score affects loan approval, interest rates, and sometimes employment and housing applications.',
  },
  {
    id: 'cd-17', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'medium',
    question: 'Which factor has the LARGEST impact on your FICO credit score?',
    options: [
      'Credit utilization ratio (amounts owed)',
      'Length of credit history',
      'Payment history (on-time vs. late payments)',
      'New credit inquiries',
    ],
    correctAnswers: [2],
    explanation: 'FICO score breakdown: Payment history = 35% (largest factor), Amounts owed/utilization = 30%, Length of credit history = 15%, Credit mix = 10%, New credit = 10%. A single late payment can drop your score significantly because payment history is weighted most heavily. Consistently paying on time is the single most important thing you can do for your credit.',
  },
  {
    id: 'cd-18', domain: 1, subdomain: 'Credit & Debt', type: 'single', difficulty: 'medium',
    question: 'What is the Annual Percentage Rate (APR) on a credit card?',
    options: [
      'The monthly interest rate multiplied by 100',
      'The yearly cost of borrowing expressed as a percentage, including interest and certain fees',
      'The maximum credit limit divided by your annual income',
      'The percentage of your balance you must pay each month',
    ],
    correctAnswers: [1],
    explanation: 'APR (Annual Percentage Rate) is the yearly interest cost of carrying a balance on your credit card, including interest and certain fees. If your APR is 24%, you\'re charged approximately 2% per month on unpaid balances. Paying your full balance each month means you pay $0 in interest regardless of the APR. APR is the key number to compare when choosing a credit card.',
  },
  {
    id: 'cd-19', domain: 1, subdomain: 'Credit & Debt', type: 'yesno', difficulty: 'easy',
    question: 'True or false: Closing old credit card accounts will always improve your credit score.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. Closing old credit accounts often HURTS your credit score for two reasons: (1) it reduces your total available credit, increasing your credit utilization ratio; (2) it may shorten your average credit history length. Unless a card has a high annual fee with no benefit, keeping old accounts open (even unused) is usually better for your score.',
  },
  {
    id: 'cd-20', domain: 1, subdomain: 'Credit & Debt', type: 'multi', difficulty: 'hard',
    question: 'Which of the following repayment strategies reduce the total interest paid on a debt? (Select all that apply.)',
    options: [
      'Making only minimum payments each month',
      'Paying more than the minimum required payment each month',
      'Making biweekly payments instead of monthly payments',
      'Refinancing to a lower interest rate',
    ],
    correctAnswers: [1, 2, 3],
    explanation: 'Paying more than the minimum reduces principal faster, saving significant interest. Biweekly payments (26 half-payments per year) effectively make 13 full monthly payments instead of 12, reducing principal faster. Refinancing to a lower APR directly reduces interest cost. Making only minimum payments is the costliest strategy — a $5,000 balance at 24% APR with minimum payments can take 20+ years and cost thousands in interest.',
  },

  // ══════════════════════════════════════════════════════════════
  // Budgeting & Spending — additional questions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'bud-16', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'easy',
    question: 'What is the "50/30/20" budgeting rule?',
    options: [
      '50% to savings, 30% to investments, 20% to spending',
      '50% of income to needs, 30% to wants, 20% to savings and debt repayment',
      '50% to housing, 30% to food, 20% to entertainment',
      '50% to retirement, 30% to emergencies, 20% to current living expenses',
    ],
    correctAnswers: [1],
    explanation: 'The 50/30/20 rule divides after-tax income into three buckets: 50% for needs (housing, utilities, groceries, transportation, minimum debt payments), 30% for wants (dining out, entertainment, subscriptions, hobbies), and 20% for financial goals (savings, investing, extra debt repayment). It\'s a flexible guideline, not a rigid rule — adjust ratios based on your income level and goals.',
  },
  {
    id: 'bud-17', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'medium',
    question: 'What is the difference between a fixed expense and a variable expense?',
    options: [
      'Fixed expenses are optional; variable expenses are required',
      'Fixed expenses stay the same each month (rent, car payment); variable expenses change (groceries, gas, entertainment)',
      'Fixed expenses are paid annually; variable expenses are paid monthly',
      'Fixed expenses are paid by credit card; variable expenses are paid by cash',
    ],
    correctAnswers: [1],
    explanation: 'Fixed expenses are predictable amounts due each billing cycle: rent/mortgage, car loan, insurance premiums, subscription services. Variable expenses fluctuate based on usage or choice: groceries, gas, utilities, dining out, clothing. Budgeting is easier when you identify fixed costs first (they\'re non-negotiable short-term) and then control variable expenses to reach savings goals.',
  },
  {
    id: 'bud-18', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'medium',
    question: 'You earn $3,000 per month after taxes. Using the 50/30/20 rule, how much should go to savings and debt repayment?',
    options: ['$300', '$450', '$600', '$900'],
    correctAnswers: [2],
    explanation: '$3,000 × 20% = $600. The 20% savings/debt repayment category includes emergency fund contributions, retirement savings (IRA, 401k), other investment accounts, and any debt payments above the minimums. Starting to save even small amounts early is critical because of compound interest — $600/month invested at 7% for 30 years grows to over $680,000.',
  },
  {
    id: 'bud-19', domain: 1, subdomain: 'Budgeting & Spending', type: 'ordering', difficulty: 'medium',
    question: 'Arrange the following steps in the correct order for creating a personal budget:',
    options: [
      'Track all expenses for one month',
      'Calculate total monthly after-tax income',
      'Set spending limits for each category',
      'Identify and categorize spending (needs vs. wants)',
    ],
    correctAnswers: [1, 0, 3, 2],
    explanation: 'Best practice budget order: (1) Calculate income — know what you have to work with; (2) Track actual expenses for a month — see where money really goes; (3) Categorize spending into needs vs. wants — identify patterns; (4) Set realistic spending limits by category. Skipping the tracking step leads to budgets based on guesses that fail when real expenses arrive.',
  },
  {
    id: 'bud-20', domain: 1, subdomain: 'Budgeting & Spending', type: 'single', difficulty: 'easy',
    question: 'What is an emergency fund, and what is the commonly recommended size?',
    options: [
      'A fund for vacations and fun; should contain at least $500',
      'A savings buffer for unexpected expenses; typically 3–6 months of living expenses',
      'A retirement account that can be accessed penalty-free in emergencies',
      'A line of credit from your bank; should equal 10% of your annual income',
    ],
    correctAnswers: [1],
    explanation: 'An emergency fund is liquid savings (in a savings account, not invested) set aside exclusively for unexpected expenses: job loss, medical bills, car repairs, home emergencies. Most financial experts recommend 3–6 months of essential living expenses. Those with variable income, dependents, or less job security should aim for the higher end. The fund prevents you from taking on high-interest debt when emergencies hit.',
  },

  // ══════════════════════════════════════════════════════════════
  // Taxes & Government Programs — additional questions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'tax-15', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'medium',
    question: 'What is a tax deduction and how does it reduce your tax bill?',
    options: [
      'A tax deduction reduces your tax bill dollar-for-dollar',
      'A tax deduction reduces your taxable income, which then reduces your tax bill by your marginal rate times the deduction amount',
      'A tax deduction is only available to business owners, not individuals',
      'A tax deduction and a tax credit work identically',
    ],
    correctAnswers: [1],
    explanation: 'A deduction reduces your taxable income, not your tax bill directly. Example: a $1,000 deduction for someone in the 22% bracket saves 22% × $1,000 = $220 in taxes. A tax credit, by contrast, reduces your tax bill dollar-for-dollar ($1,000 credit = $1,000 less tax owed). This is why credits are generally more valuable than deductions of equal size.',
  },
  {
    id: 'tax-16', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'medium',
    question: 'What is the standard deduction and who benefits from taking it?',
    options: [
      'A fixed amount set by the IRS that reduces taxable income; most beneficial when it exceeds your total itemized deductions',
      'A deduction that only applies to itemized expenses like mortgage interest and charitable donations',
      'A deduction automatically applied only to low-income taxpayers',
      'A deduction for standard business expenses claimed by self-employed workers',
    ],
    correctAnswers: [0],
    explanation: 'The standard deduction is a flat amount (2024: $14,600 for single filers, $29,200 for married filing jointly) that reduces your taxable income without requiring you to document individual deductions. You should itemize only when your actual qualifying deductions (mortgage interest, state taxes, charitable giving, medical expenses) exceed the standard amount. About 90% of taxpayers use the standard deduction.',
  },
  {
    id: 'tax-17', domain: 1, subdomain: 'Taxes & Government Programs', type: 'single', difficulty: 'hard',
    question: 'Marcus has $50,000 in taxable income (single filer). Using the 2024 brackets (10% on first $11,600, 12% on $11,601–$47,150, 22% on $47,151–$100,525), what is his approximate total federal income tax?',
    options: ['$5,500', '$6,053', '$6,617', '$11,000'],
    correctAnswers: [2],
    explanation: '10% bracket: $11,600 × 10% = $1,160. 12% bracket: ($47,150 − $11,600) × 12% = $35,550 × 12% = $4,266. 22% bracket: ($50,000 − $47,150) × 22% = $2,850 × 22% = $627. Total: $1,160 + $4,266 + $627 = $6,053. Note: Marcus\'s marginal rate is 22% but his effective rate is $6,053 ÷ $50,000 ≈ 12.1% — a key distinction for financial planning.',
  },
  {
    id: 'tax-18', domain: 1, subdomain: 'Taxes & Government Programs', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are federal government programs funded at least partly by payroll taxes (FICA)? (Select all that apply.)',
    options: [
      'Social Security retirement benefits',
      'Medicare health insurance',
      'SNAP (food assistance)',
      'Unemployment insurance benefits',
    ],
    correctAnswers: [0, 1],
    explanation: 'FICA (Federal Insurance Contributions Act) payroll taxes fund Social Security (6.2% employee + 6.2% employer) and Medicare (1.45% each). SNAP (Supplemental Nutrition Assistance Program) is funded by general federal revenues through the Farm Bill. Unemployment insurance is funded by employer payroll taxes (FUTA) — employees do not pay into unemployment insurance through their paychecks.',
  },

  // ══════════════════════════════════════════════════════════════
  // Insurance & Risk Management — additional questions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ins-14', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'easy',
    question: 'What is a deductible in an insurance policy?',
    options: [
      'The monthly fee you pay to maintain your insurance coverage',
      'The amount you pay out-of-pocket for a covered loss before your insurance begins to pay',
      'The maximum amount your insurance will pay per year',
      'The percentage of losses that insurance never covers',
    ],
    correctAnswers: [1],
    explanation: 'A deductible is the amount YOU pay first on a covered claim before your insurer starts paying. Example: $1,000 car insurance deductible + $4,000 repair bill = you pay $1,000, insurer pays $3,000. Higher deductibles mean lower monthly premiums (you take on more risk). Lower deductibles mean higher premiums (insurer takes on more risk). Choose a deductible you could actually afford to pay in an emergency.',
  },
  {
    id: 'ins-15', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'medium',
    question: 'What is liability coverage in an auto insurance policy?',
    options: [
      'Coverage that pays for repairs to YOUR vehicle after an accident',
      'Coverage that pays for medical bills and property damage you cause to OTHER people in an accident where you are at fault',
      'Coverage that pays your medical bills after any accident regardless of fault',
      'Coverage for theft or vandalism of your vehicle',
    ],
    correctAnswers: [1],
    explanation: 'Liability coverage pays for damages and injuries you cause to other people and their property when you are at fault. Most states require minimum liability limits (e.g., 25/50/25 = $25,000 per person/$50,000 per accident for bodily injury/$25,000 property damage). Liability does NOT cover your own injuries or vehicle damage — that requires collision and comprehensive (for your car) and medical payments or PIP (for your injuries).',
  },
  {
    id: 'ins-16', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'medium',
    question: 'What is the difference between term life insurance and whole life insurance?',
    options: [
      'Term life covers you for a specific period and is generally less expensive; whole life covers you for your entire life and builds cash value but costs more',
      'Term life is for the elderly; whole life is for young people',
      'Term life pays out only for accidental death; whole life pays for any cause',
      'They are identical except for their names',
    ],
    correctAnswers: [0],
    explanation: 'Term life insurance: pure death benefit protection for a fixed term (10, 20, or 30 years) at a relatively low cost. If you outlive the term, coverage ends with no payout. Whole life insurance: permanent coverage that never expires, includes a savings/investment component (cash value) that grows tax-deferred, but premiums are 5–15× more expensive. For most young people, term life + separate investing is more cost-effective.',
  },
  {
    id: 'ins-17', domain: 1, subdomain: 'Insurance & Risk Management', type: 'yesno', difficulty: 'easy',
    question: 'Is it true that renter\'s insurance covers your personal belongings if they are stolen from your apartment?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes. Renter\'s insurance typically covers personal property (theft, fire, vandalism, certain water damage), personal liability (if someone is injured in your home), and additional living expenses if you must temporarily relocate. It does NOT cover damage to the building itself — that is the landlord\'s responsibility. Renter\'s insurance is often very affordable ($15–$30/month) and highly recommended for any renter.',
  },
  {
    id: 'ins-18', domain: 1, subdomain: 'Insurance & Risk Management', type: 'multi', difficulty: 'medium',
    question: 'Which of the following factors typically INCREASE your auto insurance premium? (Select all that apply.)',
    options: [
      'Having a history of at-fault accidents',
      'Adding comprehensive and collision coverage to a liability-only policy',
      'Being a teenager or young driver (under 25)',
      'Driving fewer miles per year than average',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Premiums increase for: at-fault accidents (you are now statistically higher risk), adding more coverage types (more coverage = insurer pays more = higher premium), and being a young driver under 25 (statistically highest accident rates). Driving fewer miles DECREASES risk and can lower premiums — many insurers offer low-mileage or usage-based discounts. Understanding what raises and lowers premiums helps you make cost-effective coverage decisions.',
  },
  {
    id: 'ins-19', domain: 1, subdomain: 'Insurance & Risk Management', type: 'single', difficulty: 'hard',
    question: 'What does the concept of "insurable interest" mean?',
    options: [
      'The interest rate charged by insurance companies on unpaid premiums',
      'The financial stake a person must have in the insured item or person for the insurance contract to be valid',
      'The government\'s interest in regulating insurance companies',
      'The portion of a claim that the insurance company retains as profit',
    ],
    correctAnswers: [1],
    explanation: 'Insurable interest means you must stand to suffer a real financial loss if the insured event occurs. You can insure your own car, home, or life because you\'d be financially harmed by their loss. You cannot insure a stranger\'s car or take out a life insurance policy on a celebrity — you have no financial stake in those losses. Insurable interest prevents insurance from being used as a gambling contract.',
  },
];
