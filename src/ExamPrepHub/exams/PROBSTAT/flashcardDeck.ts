// Flashcard deck for PROBSTAT — SC Probability & Statistics (11th grade).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Data Collection & Design ===
  {
    id: 'dc-fc-1',
    topic: 'Data Collection & Design',
    front: 'What is the difference between a population and a sample?',
    back: 'A population is the entire group being studied. A sample is a subset drawn from the population. We use sample statistics (x̄, p̂) to estimate population parameters (μ, p). Samples are practical; studying the entire population is usually impossible.',
  },
  {
    id: 'dc-fc-2',
    topic: 'Data Collection & Design',
    front: 'Name the four main sampling methods and briefly describe each.',
    back: '1. Simple Random Sample (SRS): every individual equally likely. 2. Stratified: divide into strata, random sample each. 3. Cluster: divide into clusters, randomly select entire clusters. 4. Systematic: select every kth individual. SRS and stratified are generally least biased.',
  },
  {
    id: 'dc-fc-3',
    topic: 'Data Collection & Design',
    front: 'What is voluntary response bias?',
    back: 'Occurs when participation is self-selected — people with strong opinions (often negative) respond more than others. Call-in polls and online surveys suffer from this. Results over-represent the most motivated segment of the population.',
  },
  {
    id: 'dc-fc-4',
    topic: 'Data Collection & Design',
    front: 'What is the key difference between an experiment and an observational study?',
    back: 'Experiment: researchers actively assign subjects to treatments — can establish causation. Observational study: researchers only observe existing conditions without intervention — can only show association. Randomized experiments are the gold standard for causation.',
  },
  {
    id: 'dc-fc-5',
    topic: 'Data Collection & Design',
    front: 'What are the three core principles of a well-designed experiment?',
    back: '1. Randomization: randomly assign subjects to treatments to distribute confounders. 2. Replication: use enough subjects to detect real effects. 3. Control: hold non-treatment variables constant so only the treatment differs between groups.',
  },
  {
    id: 'dc-fc-6',
    topic: 'Data Collection & Design',
    front: 'What is a confounding (lurking) variable? Give an example.',
    back: 'A variable correlated with both the explanatory and response variables that can make a false causal relationship appear. Example: hot weather correlates with both ice cream sales and drowning rates — weather is the confounder, not ice cream causing drownings.',
  },
  {
    id: 'dc-fc-7',
    topic: 'Data Collection & Design',
    front: 'What is the difference between single-blind and double-blind experiments?',
    back: 'Single-blind: subjects do not know which treatment they receive (prevents placebo effect). Double-blind: neither subjects NOR researchers know until data is analyzed (also prevents researcher expectation bias). Double-blind is the stronger design.',
  },

  // === Descriptive Statistics ===
  {
    id: 'desc-fc-1',
    topic: 'Descriptive Statistics',
    front: 'What are the three measures of center and when is each most appropriate?',
    back: 'Mean (x̄): best for symmetric distributions without outliers. Median: best when outliers or skewness are present — it is resistant. Mode: best for categorical data or identifying the most common value. Skewed or outlier-heavy data → use median.',
  },
  {
    id: 'desc-fc-2',
    topic: 'Descriptive Statistics',
    front: 'How is standard deviation calculated conceptually?',
    back: 'Standard deviation = the average distance of data values from the mean. Formally: s = √[Σ(xᵢ − x̄)²/(n−1)]. It is 0 only when all values are identical, and grows as values spread out. Squaring removes sign issues; the square root converts back to original units.',
  },
  {
    id: 'desc-fc-3',
    topic: 'Descriptive Statistics',
    front: 'What is the IQR and how is it calculated?',
    back: 'IQR = Q3 − Q1 (the range of the middle 50% of data). Q1 is the median of the lower half; Q3 is the median of the upper half. IQR is resistant to outliers — useful when describing spread for skewed distributions.',
  },
  {
    id: 'desc-fc-4',
    topic: 'Descriptive Statistics',
    front: 'What are the outlier fences and how do you detect outliers?',
    back: 'Lower fence = Q1 − 1.5×IQR. Upper fence = Q3 + 1.5×IQR. Any value below the lower fence or above the upper fence is an outlier. These values are plotted as separate points on a boxplot beyond the whiskers.',
  },
  {
    id: 'desc-fc-5',
    topic: 'Descriptive Statistics',
    front: 'How do you read a boxplot? What does each line and whisker represent?',
    back: 'Left whisker: minimum (or lower fence). Left box edge: Q1. Middle line: median (Q2). Right box edge: Q3. Right whisker: maximum (or upper fence). Points beyond whiskers: outliers. The box spans the IQR (middle 50%).',
  },
  {
    id: 'desc-fc-6',
    topic: 'Descriptive Statistics',
    front: 'For a right-skewed distribution, what is the relationship between mean, median, and mode?',
    back: 'Mode < Median < Mean. The long right tail pulls the mean upward past the median. Income distributions are a classic example — a few high earners pull the mean above what most people earn. When a distribution is skewed, use the median to describe center.',
  },

  // === Probability ===
  {
    id: 'prob-fc-1',
    topic: 'Probability',
    front: 'What are the three interpretations of probability?',
    back: '1. Classical: P(A) = favorable outcomes / total equally likely outcomes (theory). 2. Empirical (relative frequency): P(A) = observed frequency over many trials (experiment). 3. Subjective: P(A) = personal belief/judgment (e.g., weather forecast). Most statistics courses focus on classical and empirical.',
  },
  {
    id: 'prob-fc-2',
    topic: 'Probability',
    front: 'State the addition rule for any two events A and B.',
    back: 'P(A or B) = P(A) + P(B) − P(A and B). Subtract the intersection to avoid double-counting. Special case: if A and B are mutually exclusive (disjoint), P(A and B) = 0, so P(A or B) = P(A) + P(B).',
  },
  {
    id: 'prob-fc-3',
    topic: 'Probability',
    front: 'State the multiplication rule for independent events vs. dependent events.',
    back: 'Independent: P(A and B) = P(A)·P(B). Dependent (general): P(A and B) = P(A)·P(B|A). Test for independence: P(A|B) = P(A). Drawing without replacement creates dependence; flipping coins creates independence.',
  },
  {
    id: 'prob-fc-4',
    topic: 'Probability',
    front: 'What is the complement rule and when is it most useful?',
    back: 'P(Aᶜ) = 1 − P(A). Most useful for "at least one" problems: P(at least one success) = 1 − P(no successes). Also useful when the complement is simpler to calculate than the event itself.',
  },
  {
    id: 'prob-fc-5',
    topic: 'Probability',
    front: 'What is conditional probability P(A|B)?',
    back: 'P(A|B) = P(A∩B)/P(B). Read: "probability of A given B has occurred." Restricts the sample space to B. Think: "I already know B happened — out of all B outcomes, how many are also A?" If P(A|B) = P(A), the events are independent.',
  },
  {
    id: 'prob-fc-6',
    topic: 'Probability',
    front: 'Explain Bayes\' Theorem in plain language and give its formula.',
    back: 'Bayes updates a prior belief with new evidence. Formula: P(A|B) = P(B|A)·P(A) / P(B). Classic use: disease testing. Even a 95% accurate test produces many false positives when the disease is rare — because most positives come from the large healthy population, not the small sick one.',
  },

  // === Probability Distributions ===
  {
    id: 'pdist-fc-1',
    topic: 'Probability Distributions',
    front: 'What is the expected value E(X) of a discrete probability distribution?',
    back: 'E(X) = Σ x·P(x) — the weighted average of all outcomes using probabilities as weights. It represents the long-run average per trial. If a lottery ticket pays $100 with P = 0.01 and $0 with P = 0.99, E(ticket) = $1.00.',
  },
  {
    id: 'pdist-fc-2',
    topic: 'Probability Distributions',
    front: 'What are the BINS conditions for a binomial distribution?',
    back: 'B — Binary outcomes (success/failure). I — Independent trials. N — Number of trials n is fixed. S — Same probability p of success each trial. If all four hold, X ~ B(n, p) is appropriate.',
  },
  {
    id: 'pdist-fc-3',
    topic: 'Probability Distributions',
    front: 'What are the mean and standard deviation formulas for a binomial distribution?',
    back: 'Mean: μ = np. Standard deviation: σ = √(np(1−p)). Example: B(20, 0.3) → μ = 6, σ = √(20·0.3·0.7) = √4.2 ≈ 2.05. These formulas let you describe the center and spread of success counts without listing every probability.',
  },
  {
    id: 'pdist-fc-4',
    topic: 'Probability Distributions',
    front: 'State the Empirical Rule (68-95-99.7 rule) for normal distributions.',
    back: 'For any normal distribution: ≈68% of data falls within 1σ of μ. ≈95% within 2σ. ≈99.7% within 3σ. Example: IQ ~ N(100, 15): about 68% have IQ 85–115; 95% have IQ 70–130; virtually all (99.7%) have IQ 55–145.',
  },
  {
    id: 'pdist-fc-5',
    topic: 'Probability Distributions',
    front: 'What is a z-score and how do you use it with a normal distribution?',
    back: 'z = (x − μ)/σ. Converts any value to standard deviations from the mean. Then use z-table: P(Z < z) = area to the left. To find P(a < X < b): compute zₐ and z_b, find table areas, subtract. Standardizing collapses all normal distributions to N(0,1).',
  },

  // === Sampling Distributions ===
  {
    id: 'sd-fc-1',
    topic: 'Sampling Distributions',
    front: 'State the Central Limit Theorem (CLT) in plain language.',
    back: 'When you take many random samples of size n from any population with mean μ and standard deviation σ, the distribution of sample means x̄ is approximately N(μ, σ/√n) for large n (rule of thumb: n ≥ 30). The CLT works regardless of the population\'s shape — that\'s what makes it so powerful.',
  },
  {
    id: 'sd-fc-2',
    topic: 'Sampling Distributions',
    front: 'What is the standard error of the sample mean, and what does it measure?',
    back: 'SE(x̄) = σ/√n. It measures how much sample means vary from sample to sample — the "precision" of using x̄ to estimate μ. A larger n produces a smaller SE, meaning sample means cluster more tightly around the true μ.',
  },
  {
    id: 'sd-fc-3',
    topic: 'Sampling Distributions',
    front: 'What does it mean for an estimator to be unbiased?',
    back: 'An unbiased estimator has E(estimator) = parameter. Over many samples, estimates average out to the true value. x̄ is unbiased for μ; p̂ is unbiased for p. Bias is a systematic error — more data doesn\'t fix it. Only better design does.',
  },
  {
    id: 'sd-fc-4',
    topic: 'Sampling Distributions',
    front: 'What are the conditions for the sampling distribution of p̂ to be approximately normal?',
    back: 'np ≥ 10 AND n(1−p) ≥ 10 (at least 10 expected successes AND 10 expected failures). When met: p̂ ~ N(p, √(p(1−p)/n)) approximately. If either condition fails, the distribution may be too skewed for the normal approximation.',
  },

  // === Confidence Intervals ===
  {
    id: 'ci-fc-1',
    topic: 'Confidence Intervals',
    front: 'What is the correct interpretation of a 95% confidence interval?',
    back: 'If we repeated the procedure many times, 95% of such intervals would capture the true population parameter. The parameter is fixed — we cannot say "there\'s a 95% chance μ is in THIS interval." Confidence refers to the long-run reliability of the method, not to any one interval.',
  },
  {
    id: 'ci-fc-2',
    topic: 'Confidence Intervals',
    front: 'What is the margin of error and what factors affect its size?',
    back: 'ME = z*(σ/√n) or z*(s/√n). ME increases when: confidence level rises (larger z*), σ is larger, or n decreases. ME decreases when: confidence level drops, σ is smaller, or n increases. To halve ME, quadruple n.',
  },
  {
    id: 'ci-fc-3',
    topic: 'Confidence Intervals',
    front: 'What are the common critical values z* for confidence intervals?',
    back: '90% CI: z* = 1.645. 95% CI: z* = 1.960. 99% CI: z* = 2.576. Higher confidence → larger z* → wider interval. Memorize these three. On the AP exam, z* = 1.96 is the most commonly used.',
  },
  {
    id: 'ci-fc-4',
    topic: 'Confidence Intervals',
    front: 'When do you use a t-distribution instead of the z-distribution for a CI?',
    back: 'Use t when: σ is unknown and you use the sample s instead. Use z when: σ is known (rare) or n is large enough that s ≈ σ. The t-distribution has heavier tails than z, reflecting the added uncertainty. Degrees of freedom = n − 1.',
  },

  // === Hypothesis Testing & Bivariate Data ===
  {
    id: 'ht-fc-1',
    topic: 'Hypothesis Testing & Bivariate Data',
    front: 'What is the null hypothesis H₀ and the alternative hypothesis Hₐ?',
    back: 'H₀ (null): states no effect, no difference, or the status quo — what you assume is true and try to disprove. Hₐ (alternative): what you are trying to find evidence for. Example: H₀: μ = 50; Hₐ: μ > 50. You never prove H₀ true — you either reject it or fail to reject it.',
  },
  {
    id: 'ht-fc-2',
    topic: 'Hypothesis Testing & Bivariate Data',
    front: 'What is a p-value and how do you use it to make a decision?',
    back: 'p-value = P(observed result or more extreme | H₀ is true). If p < α (significance level), reject H₀ — the result is statistically significant. If p ≥ α, fail to reject H₀. A small p-value means the data would be very unlikely if H₀ were true.',
  },
  {
    id: 'ht-fc-3',
    topic: 'Hypothesis Testing & Bivariate Data',
    front: 'Distinguish Type I and Type II errors.',
    back: 'Type I (α): Reject H₀ when H₀ is actually true — false positive. Probability = α (significance level). Type II (β): Fail to reject H₀ when Hₐ is actually true — false negative. Power = 1 − β = probability of correctly detecting a real effect. Reducing α increases β; they trade off.',
  },
  {
    id: 'ht-fc-4',
    topic: 'Hypothesis Testing & Bivariate Data',
    front: 'What does the correlation coefficient r measure?',
    back: 'r measures the strength and direction of the LINEAR relationship between two quantitative variables. Range: −1 ≤ r ≤ 1. |r| near 1: strong linear relationship. |r| near 0: weak or no linear relationship. r > 0: positive direction. r < 0: negative direction. r only measures linear association.',
  },
  {
    id: 'ht-fc-5',
    topic: 'Hypothesis Testing & Bivariate Data',
    front: 'What does the slope of the least-squares regression line tell you?',
    back: 'The slope b represents the average change in ŷ for each 1-unit increase in x. Example: ŷ = 30 + 2.5x (x = hours studied, y = score) → each additional hour predicts 2.5 more points. Always interpret slope in context with units. Formula: b = r(Sy/Sx).',
  },
  {
    id: 'ht-fc-6',
    topic: 'Hypothesis Testing & Bivariate Data',
    front: 'What is R² and what does it tell you about a regression model?',
    back: 'R² = r² = coefficient of determination. It measures the proportion of variability in y explained by the linear relationship with x. R² = 0.81 → 81% of the variation in y is accounted for by the model. R² = 1 → perfect fit. R² = 0 → the linear model explains nothing.',
  },
];
