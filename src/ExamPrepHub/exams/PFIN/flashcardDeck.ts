// Flashcard deck for PFIN — SC Personal Finance (11th grade).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Earning Income ===
  {
    id: 'earn-fc-1',
    topic: 'Earning Income',
    front: 'What is the difference between gross pay and net pay?',
    back: 'Gross pay is your total earnings BEFORE any deductions (taxes, insurance, retirement). Net pay is what you actually receive after all deductions. Net pay = gross pay − withholdings. Always budget with net pay.',
  },
  {
    id: 'earn-fc-2',
    topic: 'Earning Income',
    front: 'What are the W-4 and W-2 forms, and when do you use each?',
    back: 'W-4: filled out when you START a job — tells your employer how much tax to withhold. W-2: received each January — summarizes the whole year\'s wages and taxes withheld. W-4 is prospective; W-2 is retrospective.',
  },
  {
    id: 'earn-fc-3',
    topic: 'Earning Income',
    front: 'What is FICA, and what two programs does it fund?',
    back: 'FICA = Federal Insurance Contributions Act. It funds Social Security (6.2% from employee) and Medicare (1.45% from employee). Employers match both amounts. Total FICA = 15.3% of wages split equally between employee and employer.',
  },
  {
    id: 'earn-fc-4',
    topic: 'Earning Income',
    front: 'How do you calculate overtime pay for a non-exempt hourly employee?',
    back: 'Under the Fair Labor Standards Act, hours over 40/week are paid at 1.5× the regular rate. Example: $14/hour regular, 45 hours worked. Pay = (40 × $14) + (5 × $21) = $560 + $105 = $665 gross.',
  },
  {
    id: 'earn-fc-5',
    topic: 'Earning Income',
    front: 'What is "human capital" and why does it matter for earning income?',
    back: 'Human capital is the value of your education, skills, experience, and abilities. Higher human capital = higher earning potential. Investing in education or training is investing in yourself — it typically raises wages and expands career options over a lifetime.',
  },
  {
    id: 'earn-fc-6',
    topic: 'Earning Income',
    front: 'What is total compensation, and why is it broader than just salary?',
    back: 'Total compensation = salary + benefits (health insurance, retirement match, paid time off, etc.). A job paying $50,000 with $8,000 in benefits is worth $58,000 total. Always compare total compensation — not just the dollar figure on the offer letter.',
  },

  // === Budgeting & Spending ===
  {
    id: 'budget-fc-1',
    topic: 'Budgeting & Spending',
    front: 'What does the 50/30/20 budget rule say?',
    back: '50% of after-tax income → Needs (housing, food, utilities, transportation). 30% → Wants (entertainment, dining out, subscriptions). 20% → Savings and debt repayment. Use net pay as the base — taxes are already gone.',
  },
  {
    id: 'budget-fc-2',
    topic: 'Budgeting & Spending',
    front: 'What is the difference between a fixed, variable, and periodic expense?',
    back: 'Fixed: same amount each month (rent, car payment). Variable: fluctuates monthly (groceries, gas, utilities). Periodic: doesn\'t occur monthly but is predictable (car registration, holiday gifts, annual subscriptions). Budget for all three.',
  },
  {
    id: 'budget-fc-3',
    topic: 'Budgeting & Spending',
    front: 'What is the difference between a "need" and a "want" in budgeting?',
    back: 'Need: required for survival or to keep your job — housing, food, medications, basic transportation. Want: improves quality of life but isn\'t essential — streaming services, eating out, vacations, video games. The line helps prioritize cuts when money is tight.',
  },
  {
    id: 'budget-fc-4',
    topic: 'Budgeting & Spending',
    front: 'What is "opportunity cost" in spending decisions?',
    back: 'The opportunity cost of a choice is the value of the BEST alternative you gave up. If you spend $200 on concert tickets, the opportunity cost might be $200 toward an emergency fund or debt payoff. Every spending decision has a hidden trade-off.',
  },
  {
    id: 'budget-fc-5',
    topic: 'Budgeting & Spending',
    front: 'What is "lifestyle inflation" (lifestyle creep)?',
    back: 'The tendency to increase spending as income rises — upgrading your car, apartment, wardrobe, and dining out more whenever you get a raise. Lifestyle inflation prevents wealth accumulation even with growing income. The fix: save raises before you adjust spending.',
  },
  {
    id: 'budget-fc-6',
    topic: 'Budgeting & Spending',
    front: 'In zero-based budgeting, what does "zero" mean?',
    back: 'Every dollar of income is assigned a purpose: expenses + savings + debt payments = total income, leaving $0 unaccounted for. It doesn\'t mean you spend everything — savings is a budget category. Zero-based budgeting prevents money from "disappearing."',
  },

  // === Saving & Banking ===
  {
    id: 'save-fc-1',
    topic: 'Saving & Banking',
    front: 'What is compound interest, and how does it differ from simple interest?',
    back: 'Simple interest: earned only on the original principal. Compound interest: earned on the principal PLUS all previously earned interest. Formula: A = P(1+r)ⁿ. Example: $1,000 at 5% for 2 years compounded = $1,102.50 vs. $1,100 simple.',
  },
  {
    id: 'save-fc-2',
    topic: 'Saving & Banking',
    front: 'What is the Rule of 72, and how do you apply it?',
    back: 'Divide 72 by the annual interest rate to estimate years to double your money. At 6%: 72 ÷ 6 = 12 years. At 4%: 72 ÷ 4 = 18 years. A quick mental shortcut for understanding compound growth without a calculator.',
  },
  {
    id: 'save-fc-3',
    topic: 'Saving & Banking',
    front: 'What is APY, and why is it more useful than the stated interest rate?',
    back: 'APY (Annual Percentage Yield) reflects the actual yearly return including the effect of compounding frequency. A 5% rate compounded daily has a higher APY than 5% compounded annually. Always compare APYs — not just nominal rates — when shopping for savings accounts.',
  },
  {
    id: 'save-fc-4',
    topic: 'Saving & Banking',
    front: 'What does FDIC insurance cover, and up to how much?',
    back: 'The FDIC (Federal Deposit Insurance Corporation) insures deposits at member banks up to $250,000 per depositor, per bank, per ownership category. Covers checking, savings, money markets, and CDs. Does NOT cover investments, crypto, or insurance products.',
  },
  {
    id: 'save-fc-5',
    topic: 'Saving & Banking',
    front: 'What is a Certificate of Deposit (CD), and what is the tradeoff?',
    back: 'A CD pays a fixed interest rate for a set term (3 months to 5 years). Higher rate than savings accounts, but early withdrawal incurs a penalty. Tradeoff: higher return for lower liquidity. Best for money you won\'t need until the term ends.',
  },
  {
    id: 'save-fc-6',
    topic: 'Saving & Banking',
    front: 'How large should an emergency fund be, and where should it be kept?',
    back: '3–6 months of essential living expenses, kept in a highly liquid account (savings or money market). Liquid = easy to access without penalty. Emergency funds should NOT be in CDs or investments where accessing money takes time or causes losses.',
  },

  // === Credit & Debt ===
  {
    id: 'credit-fc-1',
    topic: 'Credit & Debt',
    front: 'What are the five factors of a FICO credit score and their weights?',
    back: 'Payment history 35% (biggest factor — never miss a payment). Amounts owed / utilization 30%. Length of credit history 15%. New credit / inquiries 10%. Credit mix 10%. Income is NOT a factor.',
  },
  {
    id: 'credit-fc-2',
    topic: 'Credit & Debt',
    front: 'What is credit utilization, and what ratio is recommended?',
    back: 'Credit utilization = (total balances ÷ total credit limits) × 100. Keep it below 30% to avoid hurting your score. Example: $900 balance on a $3,000 limit = 30% utilization. Lower is better — under 10% is ideal.',
  },
  {
    id: 'credit-fc-3',
    topic: 'Credit & Debt',
    front: 'What is the difference between the debt avalanche and debt snowball methods?',
    back: 'Avalanche: pay minimums on all debts, then put extra money on the HIGHEST interest rate debt first. Mathematically saves the most interest. Snowball: pay extra on the SMALLEST balance first for quick wins and motivation. Snowball costs more but keeps people on track.',
  },
  {
    id: 'credit-fc-4',
    topic: 'Credit & Debt',
    front: 'What is the difference between a secured and unsecured loan?',
    back: 'Secured: backed by collateral — the lender can seize the asset if you default (mortgage = house, auto loan = car). Unsecured: no collateral — higher interest rates because the lender has no asset to reclaim (credit cards, student loans, personal loans).',
  },
  {
    id: 'credit-fc-5',
    topic: 'Credit & Debt',
    front: 'What is APR on a credit card, and how do you avoid paying it?',
    back: 'APR (Annual Percentage Rate) is the yearly cost of carrying a balance. Credit card APRs average 20%+. Pay your statement balance IN FULL each month by the due date and you pay zero interest — the grace period means you get free short-term credit.',
  },

  // === Investing & Markets ===
  {
    id: 'invest-fc-1',
    topic: 'Investing & Markets',
    front: 'What is the difference between a stock and a bond?',
    back: 'Stock = equity (ownership) in a company. Stockholders share in profits and losses. Bond = debt (a loan to a company or government). Bondholders receive fixed interest and are repaid principal. Bonds are generally safer; stocks offer higher long-term growth potential.',
  },
  {
    id: 'invest-fc-2',
    topic: 'Investing & Markets',
    front: 'What is diversification and why does it reduce risk?',
    back: 'Diversification = spreading investments across different asset types, sectors, and geographies. If one investment loses value, others may offset the loss. "Don\'t put all your eggs in one basket." Index funds and ETFs are easy ways to achieve instant diversification.',
  },
  {
    id: 'invest-fc-3',
    topic: 'Investing & Markets',
    front: 'What is the key difference between a traditional 401(k) and a Roth IRA?',
    back: 'Traditional 401(k): pre-tax contributions reduce your income now; withdrawals in retirement are taxed. Roth IRA: contributions are after-tax; qualified withdrawals are completely tax-free. Use traditional if you expect lower taxes in retirement; Roth if you expect higher taxes later.',
  },
  {
    id: 'invest-fc-4',
    topic: 'Investing & Markets',
    front: 'What is an index fund, and why do most experts recommend it for long-term investors?',
    back: 'An index fund passively tracks a market index (like the S&P 500), holding all the stocks in that index. Benefits: very low fees, instant diversification across hundreds of companies, historically outperforms most actively managed funds over the long term.',
  },
  {
    id: 'invest-fc-5',
    topic: 'Investing & Markets',
    front: 'What is the risk-return tradeoff in investing?',
    back: 'Higher potential return = higher potential risk (loss). Savings accounts: safe but earn little. Bonds: moderate safety, moderate return. Stocks: volatile short-term, but highest long-term returns. Aligning your investments with your time horizon and risk tolerance is the core of investing strategy.',
  },
  {
    id: 'invest-fc-6',
    topic: 'Investing & Markets',
    front: 'Why is starting to invest early so powerful?',
    back: 'Compound growth over time is dramatic. $1,000 at 8% for 40 years ≈ $21,725. For 20 years ≈ $4,661. The extra 20 years is worth $17,000+ from a single $1,000 investment. Time in the market — not timing the market — is the biggest advantage young investors have.',
  },

  // === Insurance & Risk Management ===
  {
    id: 'ins-fc-1',
    topic: 'Insurance & Risk Management',
    front: 'What is the relationship between a premium and a deductible?',
    back: 'They trade off against each other. Higher deductible = lower monthly premium (you accept more risk). Lower deductible = higher monthly premium (the insurer accepts more risk). Choose based on your emergency fund — if you can cover a $2,000 deductible, a high-deductible plan saves money.',
  },
  {
    id: 'ins-fc-2',
    topic: 'Insurance & Risk Management',
    front: 'Explain the health insurance sequence: deductible → coinsurance → out-of-pocket maximum.',
    back: 'You pay the deductible first (e.g., $1,500). Then coinsurance splits costs — insurer pays 80%, you pay 20%. Once your total out-of-pocket hits the maximum (e.g., $5,000), insurance pays 100% of covered costs for the rest of the year.',
  },
  {
    id: 'ins-fc-3',
    topic: 'Insurance & Risk Management',
    front: 'What are the four types of auto insurance coverage?',
    back: 'Liability: covers damage/injury YOU cause to others (required by law). Collision: covers YOUR car in a collision. Comprehensive: covers non-collision events (theft, weather). Uninsured motorist: covers you when the other driver has no insurance.',
  },
  {
    id: 'ins-fc-4',
    topic: 'Insurance & Risk Management',
    front: 'Why is renters insurance important even though you don\'t own the building?',
    back: 'The landlord\'s insurance covers the BUILDING — not your personal belongings inside. Renters insurance covers your furniture, electronics, clothing, etc. against theft, fire, or water damage. It also provides liability protection. Cost: roughly $15–30/month — a small price for significant protection.',
  },
  {
    id: 'ins-fc-5',
    topic: 'Insurance & Risk Management',
    front: 'What is a "beneficiary" in life insurance?',
    back: 'The person or entity who receives the death benefit when the insured dies. Can be a spouse, child, parent, trust, or charity. Update beneficiary designations after major life events (marriage, divorce, birth of a child) — they override your will.',
  },

  // === Taxes & Government Programs ===
  {
    id: 'tax-fc-1',
    topic: 'Taxes & Government Programs',
    front: 'What is the difference between a marginal tax rate and an effective (average) tax rate?',
    back: 'Marginal rate: the rate applied to your LAST dollar of income (the rate of your highest bracket). Effective rate: your total tax ÷ total income — what you actually pay on average. A person in the 22% bracket does NOT pay 22% on all income — only on income within that bracket.',
  },
  {
    id: 'tax-fc-2',
    topic: 'Taxes & Government Programs',
    front: 'What is the standard deduction, and when would someone itemize instead?',
    back: 'The standard deduction is a flat amount subtracted from gross income ($14,600 for single filers in 2024). Itemizing means listing actual deductions (mortgage interest, large medical expenses, charitable donations). Itemize only if your actual deductions EXCEED the standard deduction — most people don\'t.',
  },
  {
    id: 'tax-fc-3',
    topic: 'Taxes & Government Programs',
    front: 'What is the difference between a tax deduction and a tax credit?',
    back: 'Deduction: reduces your TAXABLE INCOME. A $1,000 deduction saves $220 if you\'re in the 22% bracket. Credit: reduces your TAX BILL dollar-for-dollar. A $1,000 credit saves $1,000 regardless of your bracket. Credits are more valuable per dollar.',
  },
  {
    id: 'tax-fc-4',
    topic: 'Taxes & Government Programs',
    front: 'What are Social Security and Medicare, and how are they funded?',
    back: 'Social Security: provides retirement, disability, and survivor benefits. Medicare: provides health coverage for those 65+. Both are funded by FICA payroll taxes — 6.2% Social Security + 1.45% Medicare from employee wages, matched by employers. Workers earn benefits through years of contributions.',
  },
  {
    id: 'tax-fc-5',
    topic: 'Taxes & Government Programs',
    front: 'What is FAFSA, and why is it important for students?',
    back: 'FAFSA (Free Application for Federal Student Aid) determines eligibility for federal grants (Pell Grant — doesn\'t need repayment), work-study jobs, and federal student loans. It\'s free to file, filed annually, and is the gateway to most college financial aid. Missing the deadline can cost thousands.',
  },
  {
    id: 'tax-fc-6',
    topic: 'Taxes & Government Programs',
    front: 'What is filing status on a tax return and why does it matter?',
    back: 'Filing status (Single, Married Filing Jointly, Head of Household, etc.) determines your tax bracket thresholds and standard deduction amount. Married Filing Jointly typically offers the most favorable rates. Head of Household (unmarried with a qualifying dependent) is better than Single. Choosing correctly can save hundreds of dollars.',
  },
];
