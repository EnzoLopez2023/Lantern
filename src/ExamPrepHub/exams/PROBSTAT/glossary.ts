// Glossary for PROBSTAT — Probability & Statistics (SC 11th-grade).

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // ── Data Collection & Design ──────────────────────────────────────
  { term: 'Population',               definition: 'The entire group being studied. Because surveying every member is often impractical, we draw a sample instead. All conclusions drawn from a sample are intended to describe the population.' },
  { term: 'Sample',                   definition: 'A subset of the population selected for measurement. A good sample is representative — its characteristics mirror the population so that conclusions generalize.' },
  { term: 'Simple random sample',     definition: 'Every member of the population has an equal probability of being chosen. Lottery draws and random-number generators produce SRS. Eliminates selection bias.' },
  { term: 'Stratified sample',        definition: 'The population is divided into groups (strata) that share a characteristic, then a random sample is drawn from each stratum. Improves representation when subgroups differ significantly.' },
  { term: 'Cluster sample',           definition: 'The population is divided into clusters (often geographic), some clusters are selected at random, and every member of those clusters is sampled. Less costly for geographically spread populations.' },
  { term: 'Systematic sample',        definition: 'Every k-th member of a list is selected after a random start. For example, every 10th customer. Simple to implement; can introduce bias if the list has periodic patterns.' },
  { term: 'Sampling bias',            definition: 'A systematic error that makes the sample unrepresentative of the population. Causes include voluntary response (only motivated people respond) and convenience sampling (selecting whoever is easiest to reach).' },
  { term: 'Observational study',      definition: 'Researchers observe and record data without intervening or assigning treatments. Can show association but not causation — lurking variables may explain relationships.' },
  { term: 'Experiment',               definition: 'Researchers deliberately impose a treatment on subjects and measure the response. Proper randomization and control groups allow causal conclusions that observational studies cannot support.' },
  { term: 'Control group',            definition: 'The group in an experiment that does not receive the treatment (or receives a placebo). Its outcomes serve as the baseline against which the treatment group is compared.' },
  { term: 'Confounding variable',     definition: 'A variable associated with both the explanatory and response variables that can distort an apparent relationship. Randomization is the primary tool for controlling confounders.' },

  // ── Descriptive Statistics ────────────────────────────────────────
  { term: 'Mean',                     definition: 'The arithmetic average: sum of all values divided by the count. Sensitive to outliers — one extreme value can pull the mean far from the center of the bulk of data.' },
  { term: 'Median',                   definition: 'The middle value when data are ordered. For even n, average the two middle values. Resistant to outliers, making it a better center measure for skewed distributions.' },
  { term: 'Mode',                     definition: 'The value (or values) that appear most frequently in a dataset. A distribution can be unimodal, bimodal, or multimodal. Useful for categorical data.' },
  { term: 'Standard deviation',       definition: 'Measures the average spread of data values from the mean. A larger standard deviation means data are more dispersed. Formula: s = √(Σ(xᵢ − x̄)² / (n−1)) for samples.' },
  { term: 'Variance',                 definition: 'The square of the standard deviation. Variance = s². While it shares units squared (not the original units), it is mathematically convenient and additive for independent variables.' },
  { term: 'Interquartile range (IQR)',definition: 'IQR = Q3 − Q1. The spread of the middle 50% of data. Resistant to outliers. Used in the 1.5·IQR rule to define outlier fences: Lower fence = Q1 − 1.5·IQR, Upper = Q3 + 1.5·IQR.' },
  { term: 'Quartiles',                definition: 'Q1 is the median of the lower half; Q3 is the median of the upper half. Together with the median (Q2), minimum, and maximum, they form the five-number summary used in boxplots.' },
  { term: 'Outlier',                  definition: 'A data point that falls more than 1.5·IQR below Q1 or above Q3. Outliers may indicate data-entry errors, extreme events, or genuinely interesting cases — always investigate before removing.' },
  { term: 'Skewness',                 definition: 'A measure of distribution asymmetry. Right (positive) skew: long tail to the right, mean > median. Left (negative) skew: long tail to the left, mean < median. Symmetric: mean ≈ median.' },

  // ── Probability ───────────────────────────────────────────────────
  { term: 'Probability',              definition: 'A number between 0 and 1 representing how likely an event is. P = 0 means impossible; P = 1 means certain. Empirical probability is observed relative frequency; theoretical is the ratio of favorable to total equally-likely outcomes.' },
  { term: 'Sample space',             definition: 'The set of all possible outcomes of a random experiment. For rolling a die: {1, 2, 3, 4, 5, 6}. The probability of the entire sample space is always 1.' },
  { term: 'Complement rule',          definition: 'P(Aᶜ) = 1 − P(A). The probability that event A does NOT happen equals one minus the probability it does. Useful when computing P(at least one) = 1 − P(none).' },
  { term: 'Addition rule',            definition: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B). For mutually exclusive events, P(A ∩ B) = 0, so P(A ∪ B) = P(A) + P(B). Subtract the intersection to avoid double-counting.' },
  { term: 'Multiplication rule',      definition: 'P(A ∩ B) = P(A) · P(B|A). For independent events, P(B|A) = P(B), simplifying to P(A) · P(B). Checks whether two events happening together is just the product of their individual probabilities.' },
  { term: 'Conditional probability',  definition: 'P(B|A) = P(A ∩ B) / P(A). The probability of B given that A has already occurred. Reduces the sample space to only outcomes where A happened.' },
  { term: 'Independent events',       definition: 'Events where P(A ∩ B) = P(A) · P(B), equivalently P(B|A) = P(B). Knowing A occurred gives no information about B. Contrast with dependent events where knowing A changes the probability of B.' },

  // ── Probability Distributions ─────────────────────────────────────
  { term: 'Binomial distribution',    definition: 'Models the number of successes in n independent trials each with probability p of success. Mean = np, SD = √(np(1−p)). Formula: P(X=k) = C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ.' },
  { term: 'Normal distribution',      definition: 'A symmetric, bell-shaped continuous distribution fully described by mean μ and standard deviation σ. The 68-95-99.7 empirical rule describes what fraction of data falls within 1, 2, or 3 standard deviations of the mean.' },
  { term: 'Z-score',                  definition: 'Standardizes a value: z = (x − μ) / σ. Tells you how many standard deviations x is from the mean. A z-score table (standard normal) gives P(Z < z) for any z.' },

  // ── Sampling Distributions & Inference ───────────────────────────
  { term: 'Central Limit Theorem',    definition: 'For sufficiently large n (usually n ≥ 30), the sampling distribution of the sample mean is approximately normal with mean μ and standard error σ/√n, regardless of the shape of the population distribution.' },
  { term: 'Standard error',           definition: 'The standard deviation of the sampling distribution: SE = σ/√n (for means) or √(p(1−p)/n) (for proportions). Decreases as sample size grows — bigger samples give more precise estimates.' },
  { term: 'Confidence interval',      definition: 'An interval estimate for a population parameter: point estimate ± margin of error. A 95% CI means: if we repeated the process many times, 95% of the resulting intervals would capture the true parameter.' },
  { term: 'Margin of error',          definition: 'Half the width of a confidence interval. Margin of error = z* × SE. A wider CI → larger margin of error → less precision. Increasing sample size is the main way to reduce margin of error.' },
  { term: 'Hypothesis test',          definition: 'A formal procedure for deciding between two competing claims: H₀ (null hypothesis, the status quo) and Hₐ (alternative hypothesis). Based on how surprising the data would be if H₀ were true.' },
  { term: 'P-value',                  definition: 'The probability of observing results at least as extreme as those in the sample, assuming H₀ is true. A small p-value (typically < 0.05) is evidence against H₀. The p-value is NOT the probability that H₀ is true.' },
  { term: 'Type I error',             definition: 'Rejecting H₀ when it is actually true (a "false positive"). Probability of a Type I error = α, the significance level. Setting α = 0.05 means a 5% chance of wrongly rejecting a true null hypothesis.' },
  { term: 'Type II error',            definition: 'Failing to reject H₀ when it is actually false (a "false negative"). Probability = β. Power of a test = 1 − β. Larger samples and larger true effect sizes increase power.' },
  { term: 'Correlation coefficient r',definition: 'A number between −1 and 1 measuring the strength and direction of a linear relationship. r close to ±1 → strong linear relationship; r near 0 → weak or no linear relationship. Correlation does not imply causation.' },
  { term: 'Least-squares regression line', definition: 'The line ŷ = a + bx that minimizes the sum of squared residuals. The slope b = r·(sy/sx) and the intercept a = ȳ − b·x̄. Used to predict y for a given x within the data range.' },
];
