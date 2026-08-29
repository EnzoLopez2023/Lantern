// Question bank for PROBSTAT — SC Probability & Statistics (11th grade).
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
  // Data Collection & Design
  // ══════════════════════════════════════════════════════════════
  {
    id: 'dc-01', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'easy',
    question: 'What is the difference between a population and a sample?',
    options: ['A population is small; a sample is large', 'A population is the entire group of interest; a sample is a subset of the population selected for study', 'A population is selected randomly; a sample is not', 'They are the same thing'],
    correctAnswers: [1],
    explanation: 'A population includes every member of the group being studied. A sample is a smaller group drawn from the population to make data collection practical. Inference uses sample results to draw conclusions about the population.',
  },
  {
    id: 'dc-02', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'easy',
    question: 'In a simple random sample, how are individuals selected?',
    options: ['By the researcher\'s preference', 'Every member of the population has an equal chance of being selected', 'The most convenient individuals are chosen', 'The population is divided into strata, then sampled proportionally'],
    correctAnswers: [1],
    explanation: 'In a simple random sample (SRS), every individual in the population has an equal probability of selection. This eliminates systematic bias and ensures the sample is representative. Methods include random number tables or computer randomization.',
  },
  {
    id: 'dc-03', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'What is "voluntary response bias"?',
    options: ['When researchers refuse to respond to survey questions', 'When a sample over-represents people with strong opinions because they self-select to participate', 'When all respondents answer questions voluntarily without payment', 'When the sample size is too small'],
    correctAnswers: [1],
    explanation: 'Voluntary response bias occurs when participation is voluntary and people with strong opinions (especially negative ones) are more likely to respond. Call-in polls and online surveys often suffer from this bias, making results unrepresentative.',
  },
  {
    id: 'dc-04', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'What is the key difference between an observational study and an experiment?',
    options: ['Observational studies use larger samples', 'An experiment assigns subjects to treatments; an observational study only records existing conditions without intervention', 'Observational studies are more accurate', 'Experiments only use animals as subjects'],
    correctAnswers: [1],
    explanation: 'In an experiment, researchers actively assign subjects to treatment groups and control conditions. In an observational study, researchers only observe and record existing data without manipulating variables. Only well-designed experiments can establish causation.',
  },
  {
    id: 'dc-05', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'What is a "confounding variable"?',
    options: ['A variable that is deliberately varied in an experiment', 'A variable that is correlated with both the explanatory and response variables, making causation difficult to determine', 'The same as the response variable', 'A variable with too many categories'],
    correctAnswers: [1],
    explanation: 'A confounding variable (lurking variable) is associated with both the explanatory variable and the outcome, creating a false appearance of causation. Example: ice cream sales and drowning rates are both high in summer — summer is the confounding variable, not ice cream causing drownings.',
  },
  {
    id: 'dc-06', domain: 1, subdomain: 'Data Collection & Design', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Randomization in an experiment helps control for confounding variables.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Randomization distributes potential confounding variables roughly equally across treatment groups by chance. This is the key reason experiments with randomization can establish causation while observational studies cannot.',
  },
  {
    id: 'dc-07', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'In a stratified random sample, the population is divided into:',
    options: ['Random clusters selected entirely', 'Groups based on a characteristic, then a random sample is drawn from each group', 'The first N individuals encountered', 'Groups by convenience, then one is selected'],
    correctAnswers: [1],
    explanation: 'Stratified sampling divides the population into subgroups (strata) based on a shared characteristic (e.g., grade level, gender), then randomly samples from each stratum. This ensures representation of every subgroup, often making estimates more precise.',
  },
  {
    id: 'dc-08', domain: 1, subdomain: 'Data Collection & Design', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are principles of a well-designed experiment? (Select all that apply)',
    options: ['Randomization of treatment assignment', 'Replication (using multiple subjects)', 'Controlling extraneous variables', 'Ensuring all subjects volunteer willingly'],
    correctAnswers: [0, 1, 2],
    explanation: 'Good experiments use randomization (to distribute confounders), replication (to detect real effects), and control (to hold non-treatment variables constant). Voluntary participation avoids ethical problems but isn\'t the key to experimental validity.',
  },
  {
    id: 'dc-09', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'easy',
    question: 'What is "bias" in statistical sampling?',
    options: ['When the sample is too large', 'A systematic tendency for sample results to consistently over- or under-estimate a population parameter', 'When two variables are correlated', 'A measurement error that happens randomly'],
    correctAnswers: [1],
    explanation: 'Bias is systematic, directional error — not random variation. A biased sampling method consistently favors certain outcomes, making results unrepresentative of the population. More data won\'t fix bias; only better design will.',
  },
  {
    id: 'dc-10', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'hard',
    question: 'A pharmaceutical company tests a new drug by giving the actual pill to 50 patients and a sugar pill (placebo) to 50 patients, without patients knowing which they received. This is a:',
    options: ['Stratified random sample', 'Single-blind experiment', 'Double-blind experiment', 'Cluster sample'],
    correctAnswers: [1],
    explanation: 'Single-blind means subjects don\'t know whether they\'re in the treatment or control group (prevents placebo effect bias). Double-blind means neither subjects NOR researchers know until the data is analyzed (also prevents researcher expectation bias). The description given is single-blind.',
  },
  {
    id: 'dc-11', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'What type of data is collected when you ask "What is your favorite color?"',
    options: ['Quantitative continuous', 'Quantitative discrete', 'Categorical (qualitative)', 'Ordinal'],
    correctAnswers: [2],
    explanation: 'Categorical (qualitative) data represents group membership or categories — answers are names or labels, not numbers you can do arithmetic with. Quantitative data has numerical values that can be measured and averaged. Color is a category, not a quantity.',
  },
  {
    id: 'dc-12', domain: 1, subdomain: 'Data Collection & Design', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Correlation in observational data is sufficient to conclude causation.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Correlation does not imply causation. Two variables can be correlated because of a confounding third variable, or by coincidence. Only a well-controlled randomized experiment provides evidence of causation.',
  },
  {
    id: 'dc-13', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'easy',
    question: 'A survey asks only students in one lunch period about cafeteria food quality. This is an example of:',
    options: ['Simple random sampling', 'Stratified sampling', 'Convenience sampling', 'Cluster sampling'],
    correctAnswers: [2],
    explanation: 'Convenience sampling selects individuals based on ease of access rather than randomness. It\'s fast and cheap but produces biased results — only one lunch period likely doesn\'t represent all students\' opinions.',
  },
  {
    id: 'dc-14', domain: 1, subdomain: 'Data Collection & Design', type: 'ordering', difficulty: 'hard',
    question: 'Rank these sampling methods from MOST representative (least biased) to LEAST representative:',
    options: ['Voluntary response sample', 'Simple random sample', 'Stratified random sample', 'Convenience sample'],
    correctAnswers: [2, 1, 3, 0],
    explanation: 'Stratified random sampling ensures representation of all subgroups and is often most precise. SRS is unbiased. Convenience samples may miss many groups. Voluntary response is typically the most biased because only motivated people respond.',
  },
  {
    id: 'dc-15', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'What is an "explanatory" variable in a study?',
    options: ['The variable that the researcher measures as an outcome', 'The variable suspected to influence or predict the response variable', 'The variable that is randomly selected', 'The control group\'s measurement'],
    correctAnswers: [1],
    explanation: 'The explanatory variable (independent variable, predictor) is the variable hypothesized to cause or explain changes in the response variable. In studying whether studying time affects test scores, studying time is explanatory; test score is the response.',
  },

  // ══════════════════════════════════════════════════════════════
  // Descriptive Statistics
  // ══════════════════════════════════════════════════════════════
  {
    id: 'desc-01', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'easy',
    question: 'For the data set {3, 7, 7, 9, 4}, what is the median?',
    options: ['6', '7', '4', '9'],
    correctAnswers: [1],
    explanation: 'Sort the data: {3, 4, 7, 7, 9}. With n=5 (odd), the median is the middle value — the 3rd value = 7. The median is resistant to outliers, unlike the mean.',
  },
  {
    id: 'desc-02', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'easy',
    question: 'Which measure of center is most affected by extreme outliers?',
    options: ['Median', 'Mode', 'Mean', 'IQR'],
    correctAnswers: [2],
    explanation: 'The mean is affected by every value in the data set, so a single extreme outlier can pull it significantly. The median and mode are resistant measures — they don\'t change much when outliers are present.',
  },
  {
    id: 'desc-03', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'For the data set {2, 4, 4, 6, 8, 10}, what is the interquartile range (IQR)?',
    options: ['5', '4', '8', '6'],
    correctAnswers: [1],
    explanation: 'Sorted: {2, 4, 4, 6, 8, 10}. Q1 = median of lower half {2, 4, 4} = 4. Q3 = median of upper half {6, 8, 10} = 8. IQR = Q3 − Q1 = 8 − 4 = 4. The IQR measures spread of the middle 50% and is resistant to outliers.',
  },
  {
    id: 'desc-04', domain: 1, subdomain: 'Descriptive Statistics', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A distribution is "right-skewed" when there is a long tail extending to the right and the mean is pulled above the median.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Right-skewed (positively skewed) distributions have the tail extending to the right. Extreme high values pull the mean up above the median. Income distributions are classically right-skewed — a few billionaires raise the mean income well above what most people earn.',
  },
  {
    id: 'desc-05', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'A student scored 80 on an exam where the mean was 70 and the standard deviation was 10. What is the z-score?',
    options: ['1', '−1', '0.8', '10'],
    correctAnswers: [0],
    explanation: 'z-score = (value − mean) / standard deviation = (80 − 70) / 10 = 1.0. A z-score of 1 means the score is 1 standard deviation above the mean. Positive z-scores are above average; negative are below.',
  },
  {
    id: 'desc-06', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'In a five-number summary, what are the five values?',
    options: ['Mean, Median, Mode, Range, IQR', 'Minimum, Q1, Median, Q3, Maximum', 'Min, Mean, Max, SD, Variance', 'Q1, Q2, Q3, Q4, Mean'],
    correctAnswers: [1],
    explanation: 'The five-number summary is: Minimum, Q1 (25th percentile), Median (Q2, 50th percentile), Q3 (75th percentile), Maximum. This summary is displayed visually in a boxplot and provides a complete picture of distribution shape and spread.',
  },
  {
    id: 'desc-07', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'What does standard deviation measure?',
    options: ['The distance between the minimum and maximum values', 'The average distance of data values from the mean', 'The middle value of a data set', 'The most common value in a data set'],
    correctAnswers: [1],
    explanation: 'Standard deviation measures the average spread of data values around the mean. A larger SD means values are more spread out; a smaller SD means values cluster closely around the mean. It\'s the square root of variance.',
  },
  {
    id: 'desc-08', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'hard',
    question: 'An outlier is defined as a value that falls below Q1 − 1.5×IQR or above Q3 + 1.5×IQR. For Q1=10, Q3=30, IQR=20, which values are outliers?',
    options: ['Values below −20 or above 60', 'Values below −5 or above 50', 'Values below 0 or above 50', 'Values below 5 or above 45'],
    correctAnswers: [0],
    explanation: 'Lower fence = Q1 − 1.5×IQR = 10 − 1.5×20 = 10 − 30 = −20. Upper fence = Q3 + 1.5×IQR = 30 + 1.5×20 = 30 + 30 = 60. Values below −20 or above 60 are outliers. Answer: values below −20 or above 60.',
  },
  {
    id: 'desc-09', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'easy',
    question: 'When a distribution is symmetric and bell-shaped, which statement is true?',
    options: ['Mean < Median < Mode', 'Mean > Median > Mode', 'Mean = Median = Mode (approximately)', 'The mode is always greater than the mean'],
    correctAnswers: [2],
    explanation: 'In a perfectly symmetric, bell-shaped distribution, the mean, median, and mode are all equal (at the center). Skewness pulls the mean in the direction of the tail, creating separation among these measures.',
  },
  {
    id: 'desc-10', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'A dataset has values {100, 102, 101, 99, 98, 200}. Which measure of spread best describes the "typical" spread, ignoring the outlier?',
    options: ['Range', 'Standard deviation', 'Variance', 'IQR'],
    correctAnswers: [3],
    explanation: 'The IQR (interquartile range) is resistant to outliers because it only considers the middle 50% of the data. The range and standard deviation are heavily influenced by the outlier (200). When outliers are present, the five-number summary and IQR are more informative than mean and SD.',
  },
  {
    id: 'desc-11', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'easy',
    question: 'In a data set, the value that appears most often is called the:',
    options: ['Median', 'Mean', 'Mode', 'Range'],
    correctAnswers: [2],
    explanation: 'The mode is the value (or values) that appears most frequently. A data set can have one mode (unimodal), two modes (bimodal), or no mode if all values appear equally. The mode is the only measure of center applicable to categorical data.',
  },
  {
    id: 'desc-12', domain: 1, subdomain: 'Descriptive Statistics', type: 'ordering', difficulty: 'medium',
    question: 'Order these steps for constructing a boxplot correctly:',
    options: ['Draw a box from Q1 to Q3', 'Mark a line at the median inside the box', 'Draw whiskers to min and max (or fences)', 'Calculate the five-number summary'],
    correctAnswers: [3, 0, 1, 2],
    explanation: 'First calculate the five-number summary (min, Q1, median, Q3, max). Then draw the box from Q1 to Q3 with a line at the median. Finally extend whiskers to the min/max or to the fences if outliers are present.',
  },
  {
    id: 'desc-13', domain: 1, subdomain: 'Descriptive Statistics', type: 'yesno', difficulty: 'medium',
    question: 'True or False: For a left-skewed distribution, the mean is typically less than the median.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'In a left-skewed distribution, the long tail extends to the left. Extremely low values pull the mean below the median. The median stays near the bulk of the data, while the mean is dragged toward the tail.',
  },
  {
    id: 'desc-14', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'Adding a constant of 5 to every data value in a set changes which measures?',
    options: ['Only the spread (SD and IQR)', 'Only the center (mean and median)', 'Both center and spread', 'Neither center nor spread'],
    correctAnswers: [1],
    explanation: 'Adding a constant shifts all values equally — the mean and median increase by 5, but the spread (SD, IQR, range) is unchanged because relative distances between values stay the same. Multiplying by a constant changes both center and spread.',
  },
  {
    id: 'desc-15', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'hard',
    question: 'A student scored in the 90th percentile on a standardized test. This means:',
    options: ['They answered 90% of questions correctly', 'They scored higher than 90% of all test-takers', 'Their score was 90 out of 100', 'They are in the top 10 students in their school'],
    correctAnswers: [1],
    explanation: 'A percentile rank of 90 means the score exceeds 90% of all scores in the reference group — not that 90% of questions were correct. Percentiles describe relative position within a distribution.',
  },

  // ══════════════════════════════════════════════════════════════
  // Probability
  // ══════════════════════════════════════════════════════════════
  {
    id: 'prob-01', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'easy',
    question: 'A fair six-sided die is rolled. What is the probability of rolling a number greater than 4?',
    options: ['1/6', '1/3', '1/2', '2/3'],
    correctAnswers: [1],
    explanation: 'Numbers greater than 4 on a die: {5, 6} — two outcomes. Total outcomes: 6. P(>4) = 2/6 = 1/3. Probability = (favorable outcomes) / (total equally likely outcomes).',
  },
  {
    id: 'prob-02', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'easy',
    question: 'Two events are "mutually exclusive" if:',
    options: ['They always occur together', 'They cannot occur at the same time', 'They are independent of each other', 'One always causes the other'],
    correctAnswers: [1],
    explanation: 'Mutually exclusive events cannot occur simultaneously — if one happens, the other cannot. Rolling a 3 and rolling a 4 on the same die roll are mutually exclusive. For mutually exclusive events: P(A or B) = P(A) + P(B).',
  },
  {
    id: 'prob-03', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'A bag has 4 red and 6 blue marbles. If two marbles are drawn WITHOUT replacement, what is the probability both are red?',
    options: ['4/10 × 3/9', '4/10 × 4/10', '4/10 × 3/10', '2/10 × 2/10'],
    correctAnswers: [0],
    explanation: 'Without replacement, the second draw changes. P(1st red) = 4/10. After removing a red: P(2nd red | 1st red) = 3/9. P(both red) = (4/10)(3/9) = 12/90 = 2/15. This is conditional probability for dependent events.',
  },
  {
    id: 'prob-04', domain: 1, subdomain: 'Probability', type: 'yesno', difficulty: 'easy',
    question: 'True or False: If two events are independent, P(A and B) = P(A) × P(B).',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The multiplication rule for independent events: P(A ∩ B) = P(A) × P(B). Independence means knowing one event occurred gives no information about whether the other occurred. Coin flips are independent; drawing without replacement is not.',
  },
  {
    id: 'prob-05', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'What is the probability of rolling an even number OR a number greater than 4 on a fair six-sided die?',
    options: ['5/6', '4/6', '3/6', '2/6'],
    correctAnswers: [1],
    explanation: 'Even: {2,4,6}. Greater than 4: {5,6}. Using the addition rule: P(A∪B) = P(A) + P(B) − P(A∩B) = 3/6 + 2/6 − 1/6 (the number 6 is in both sets) = 4/6 = 2/3. The union {2,4,5,6} has 4 elements out of 6, so P = 4/6.',
  },
  {
    id: 'prob-06', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'A card is drawn from a standard deck. What is P(King | face card)?',
    options: ['4/52', '4/12', '1/4', '4/16'],
    correctAnswers: [1],
    explanation: 'P(King | face card) = P(King and face card) / P(face card). There are 4 kings; all 4 are face cards. There are 12 face cards (J, Q, K in 4 suits). P(K | face card) = 4/12 = 1/3. Conditional probability restricts the sample space to the condition.',
  },
  {
    id: 'prob-07', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'easy',
    question: 'The complement of event A (written A\' or Aᶜ) has probability:',
    options: ['P(A) − 1', '1 − P(A)', 'P(A) + 1', '1/P(A)'],
    correctAnswers: [1],
    explanation: 'The complement of A is "A does not occur." Since all probabilities must sum to 1: P(A) + P(Aᶜ) = 1, so P(Aᶜ) = 1 − P(A). Using complements often makes probability calculations easier (especially for "at least one" problems).',
  },
  {
    id: 'prob-08', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'hard',
    question: 'A test for a disease is 90% accurate. 1% of the population has the disease. If a person tests positive, what is the approximate probability they actually have the disease?',
    options: ['90%', 'about 8.3%', 'about 50%', 'about 1%'],
    correctAnswers: [1],
    explanation: 'This is Bayes\' theorem. True positive rate: 0.01 × 0.90 = 0.009. False positive rate: 0.99 × 0.10 = 0.099. P(disease | positive) = 0.009 / (0.009 + 0.099) ≈ 0.009/0.108 ≈ 8.3%. This counterintuitive result shows that rare diseases cause many false positives.',
  },
  {
    id: 'prob-09', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'How many ways can 5 students be arranged in a line (ordered)?',
    options: ['5', '20', '120', '25'],
    correctAnswers: [2],
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120. This is a permutation — order matters when arranging people in a line. Permutations count ordered arrangements; combinations count groups where order doesn\'t matter.',
  },
  {
    id: 'prob-10', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'How many ways can a committee of 3 be chosen from 7 people (order doesn\'t matter)?',
    options: ['21', '35', '210', '343'],
    correctAnswers: [1],
    explanation: 'C(7,3) = 7! / (3! × 4!) = (7 × 6 × 5) / (3 × 2 × 1) = 210/6 = 35. Combinations (C(n,r) or "n choose r") count unordered selections. Choosing 3 people for a committee (no roles) is a combination, not a permutation.',
  },
  {
    id: 'prob-11', domain: 1, subdomain: 'Probability', type: 'yesno', difficulty: 'medium',
    question: 'True or False: If P(A|B) = P(A), then events A and B are independent.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'If knowing B occurred doesn\'t change the probability of A, then A and B are independent. P(A|B) = P(A) is the formal definition of independence — information about one event gives no information about the other.',
  },
  {
    id: 'prob-12', domain: 1, subdomain: 'Probability', type: 'ordering', difficulty: 'hard',
    question: 'Order these from HIGHEST to LOWEST probability for rolling a fair die twice:',
    options: ['Getting sum = 7', 'Getting two 6s', 'Getting sum ≥ 11', 'Getting at least one 6'],
    correctAnswers: [3, 0, 2, 1],
    explanation: 'P(at least one 6) = 1 − (5/6)² = 11/36 ≈ 0.306. P(sum=7) = 6/36 ≈ 0.167. P(sum≥11): only sums 11 (2 ways) and 12 (1 way) = 3/36 ≈ 0.083. P(two 6s) = 1/36 ≈ 0.028. Notice how the complement rule makes "at least one" much easier — direct counting would require enumerating 11 specific outcomes.',
  },
  {
    id: 'prob-13', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'easy',
    question: 'A probability of 0 means:',
    options: ['The event is unlikely but possible', 'The event is certain to occur', 'The event is impossible', 'The event occurs 50% of the time'],
    correctAnswers: [2],
    explanation: 'P = 0 means the event cannot occur. P = 1 means the event is certain. All probabilities fall between 0 and 1 inclusive. "Unlikely" events have small but non-zero probabilities.',
  },

  // ══════════════════════════════════════════════════════════════
  // Probability Distributions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'pd-01', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'easy',
    question: 'What is the expected value (mean) of a discrete probability distribution?',
    options: ['The most likely outcome', 'The weighted average of all outcomes using their probabilities as weights', 'The median of the distribution', 'The outcome that occurs most often'],
    correctAnswers: [1],
    explanation: 'E(X) = Σ x × P(x). Multiply each outcome by its probability and sum. If a game pays $10 with P=0.3 and $0 with P=0.7, E(payout) = 10(0.3) + 0(0.7) = $3. This is the long-run average per trial.',
  },
  {
    id: 'pd-02', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'What are the conditions for a binomial distribution?',
    options: ['Any random variable with two possible outcomes', 'Fixed number of trials (n), each trial independent, constant probability of success (p), two outcomes per trial', 'Continuous outcomes with a bell shape', 'Any distribution with mean = variance'],
    correctAnswers: [1],
    explanation: 'Binomial: B-I-N-S. Binary outcomes (success/failure). Independent trials. n trials fixed in advance. Same probability p of success each trial. Counts the number of successes in n trials.',
  },
  {
    id: 'pd-03', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'In a normal distribution, approximately what percentage of data falls within 2 standard deviations of the mean?',
    options: ['68%', '95%', '99.7%', '50%'],
    correctAnswers: [1],
    explanation: 'The Empirical Rule (68-95-99.7 rule): 68% within 1σ, 95% within 2σ, 99.7% within 3σ. This applies to approximately normal distributions and is used extensively in quality control and inference.',
  },
  {
    id: 'pd-04', domain: 1, subdomain: 'Probability Distributions', type: 'yesno', difficulty: 'easy',
    question: 'True or False: The standard normal distribution has a mean of 0 and a standard deviation of 1.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The standard normal distribution N(0,1) is the reference distribution. Any normal distribution can be converted to standard normal by calculating z-scores: z = (x − μ) / σ. Then z-tables give probabilities.',
  },
  {
    id: 'pd-05', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'If X ~ B(10, 0.3), what is the mean (expected number of successes)?',
    options: ['3', '0.3', '7', '1.45'],
    correctAnswers: [0],
    explanation: 'For a binomial distribution, mean μ = n × p = 10 × 0.3 = 3. The standard deviation is σ = √(npq) = √(10 × 0.3 × 0.7) = √2.1 ≈ 1.45. You can expect about 3 successes on average.',
  },
  {
    id: 'pd-06', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'hard',
    question: 'Heights are normally distributed with μ = 68 inches and σ = 3 inches. What percentage of people are between 65 and 71 inches tall?',
    options: ['34%', '68%', '95%', '47.5%'],
    correctAnswers: [1],
    explanation: '65 = μ − 1σ and 71 = μ + 1σ. By the Empirical Rule, 68% of data falls within 1 standard deviation of the mean. So approximately 68% of people are between 65 and 71 inches.',
  },
  {
    id: 'pd-07', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'What does a z-score of −2.5 indicate?',
    options: ['The value is 2.5 standard deviations above the mean', 'The value is 2.5 standard deviations below the mean', 'The value equals the mean', 'The value is in the 2.5th percentile range'],
    correctAnswers: [1],
    explanation: 'A negative z-score means the value is below the mean. z = −2.5 means the value is 2.5 standard deviations below the mean. About 98.7% of values in a normal distribution fall above this point (left area ≈ 0.006).',
  },
  {
    id: 'pd-08', domain: 1, subdomain: 'Probability Distributions', type: 'ordering', difficulty: 'medium',
    question: 'Order these requirements for the binomial distribution (BINS mnemonic) from B to S:',
    options: ['Same probability of success on each trial', 'Independent trials', 'n (number of trials) is fixed', 'Binary outcomes (success/failure)'],
    correctAnswers: [3, 1, 2, 0],
    explanation: 'BINS: Binary outcomes → Independent trials → n fixed → Same probability. All four must be met for a binomial model to be appropriate.',
  },
  {
    id: 'pd-09', domain: 1, subdomain: 'Probability Distributions', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A normal distribution is always symmetric around its mean.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The normal distribution is perfectly symmetric — the mean, median, and mode are all equal. The bell curve is mirror-image symmetric around μ. This symmetry makes probability calculations easier and underlies many statistical methods.',
  },
  {
    id: 'pd-10', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'hard',
    question: 'If scores are N(75, 10), what score separates the bottom 16% from the top 84%?',
    options: ['55', '65', '85', '70'],
    correctAnswers: [1],
    explanation: 'The bottom 16% corresponds to about 1 standard deviation below the mean (from the Empirical Rule, 68% within 1σ means 16% below μ − σ). Score = μ − 1σ = 75 − 10 = 65. Using z-tables: P(Z < −1) ≈ 0.1587 ≈ 16%.',
  },
  {
    id: 'pd-11', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'easy',
    question: 'The total area under a probability density curve equals:',
    options: ['0', '0.5', '1', 'It varies by distribution'],
    correctAnswers: [2],
    explanation: 'The total area under any probability density function (PDF) must equal 1, representing 100% probability. Areas under sections of the curve represent probabilities for ranges of values.',
  },
  {
    id: 'pd-12', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'For B(20, 0.5), the mean is 10 and the standard deviation is √5 ≈ 2.24. Using the Empirical Rule, most outcomes fall between:',
    options: ['8 and 12', '5.52 and 14.48', '7.76 and 12.24', '0 and 20'],
    correctAnswers: [1],
    explanation: 'Approximately 95% of values fall within 2 standard deviations: μ ± 2σ = 10 ± 2(2.24) = 10 ± 4.48 = [5.52, 14.48]. This confirms that having fewer than 5 or more than 15 heads in 20 fair coin flips is unusual (outside 2σ).',
  },

  // ══════════════════════════════════════════════════════════════
  // Sampling Distributions
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sd-01', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'The Central Limit Theorem (CLT) states that for large sample sizes, the sampling distribution of x̄ is:',
    options: ['Identical to the population distribution', 'Approximately normal, regardless of the shape of the population distribution', 'Always skewed right', 'Identical to a t-distribution'],
    correctAnswers: [1],
    explanation: 'The CLT is one of the most important theorems in statistics: as sample size n increases, the distribution of sample means x̄ approaches normality, even if the population is not normal. Rule of thumb: n ≥ 30 is usually sufficient.',
  },
  {
    id: 'sd-02', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'The standard error of x̄ (SE) is:',
    options: ['σ / n', 'σ / √n', 'σ × √n', 'σ²/n'],
    correctAnswers: [1],
    explanation: 'Standard error = σ/√n. It measures the variability of sample means — how much x̄ varies from sample to sample. Larger samples have smaller standard error (sample means cluster more tightly around the true population mean).',
  },
  {
    id: 'sd-03', domain: 1, subdomain: 'Sampling Distributions', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Increasing sample size reduces the standard error of the sample mean.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Since SE = σ/√n, increasing n decreases SE. More data → less variability in estimates → more precise inference. This is why larger studies produce more reliable results and why statistical power increases with sample size.',
  },
  {
    id: 'sd-04', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'hard',
    question: 'A population has μ = 50 and σ = 12. Samples of n = 36 are taken. What is the standard error of x̄?',
    options: ['12', '2', '0.33', '72'],
    correctAnswers: [1],
    explanation: 'SE = σ/√n = 12/√36 = 12/6 = 2. The distribution of sample means x̄ is N(50, 2) — much less spread than the population distribution N(50, 12). This reduced variability is why averages are more stable than individual values.',
  },
  {
    id: 'sd-05', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'What does it mean for an estimator to be "unbiased"?',
    options: ['The estimate is always exactly right', 'On average across many samples, the estimator equals the true population parameter', 'The estimate has the smallest possible standard error', 'The sample is randomly selected'],
    correctAnswers: [1],
    explanation: 'An unbiased estimator has an expected value equal to the parameter being estimated — it\'s right on average, even if individual estimates differ. The sample mean x̄ is an unbiased estimator of μ. The sample proportion p̂ is an unbiased estimator of p.',
  },
  {
    id: 'sd-06', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'For the sampling distribution of a sample proportion p̂, the conditions for normal approximation require:',
    options: ['n ≥ 30', 'np ≥ 10 AND n(1−p) ≥ 10', 'n ≥ 100', 'p ≥ 0.5'],
    correctAnswers: [1],
    explanation: 'For proportions, the normal approximation is valid when np ≥ 10 (at least 10 expected successes) and n(1−p) ≥ 10 (at least 10 expected failures). This ensures the distribution isn\'t too skewed to approximate as normal.',
  },
  {
    id: 'sd-07', domain: 1, subdomain: 'Sampling Distributions', type: 'yesno', difficulty: 'medium',
    question: 'True or False: The sampling distribution of x̄ has the same mean as the population, regardless of sample size.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The mean of the sampling distribution of x̄ is always μ (the population mean) — this is what makes x̄ an unbiased estimator. What changes with sample size is the standard error (spread), not the center.',
  },
  {
    id: 'sd-08', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'easy',
    question: 'The "Law of Large Numbers" says that as sample size increases:',
    options: ['Sample results become more variable', 'The sample mean gets closer and closer to the population mean', 'The population distribution becomes normal', 'The sample standard deviation equals the population standard deviation'],
    correctAnswers: [1],
    explanation: 'The Law of Large Numbers: as n → ∞, x̄ → μ. More data produces more accurate estimates. This is why casinos always win in the long run — with millions of bets, their average outcome approaches the expected (profitable) value.',
  },
  {
    id: 'sd-09', domain: 1, subdomain: 'Sampling Distributions', type: 'ordering', difficulty: 'hard',
    question: 'Order from MOST variable to LEAST variable sampling distributions of x̄ for the same population:',
    options: ['n = 100', 'n = 25', 'n = 400', 'n = 4'],
    correctAnswers: [3, 1, 0, 2],
    explanation: 'SE = σ/√n. Larger n → smaller SE → less variability. n=4: SE = σ/2. n=25: SE = σ/5. n=100: SE = σ/10. n=400: SE = σ/20. So n=4 is most variable, n=400 is least.',
  },

  // ══════════════════════════════════════════════════════════════
  // Confidence Intervals
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ci-01', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'easy',
    question: 'A 95% confidence interval means:',
    options: ['There is a 95% chance the population mean is in this interval', 'If we repeated the procedure many times, 95% of such intervals would contain the true parameter', 'The sample mean has a 95% chance of being correct', 'We are 95% confident our sample is representative'],
    correctAnswers: [1],
    explanation: 'A 95% CI means the procedure used to construct it captures the true parameter 95% of the time. The parameter is fixed (not random) — it either is or isn\'t in any particular interval. The "confidence" refers to the method\'s long-run reliability.',
  },
  {
    id: 'ci-02', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'medium',
    question: 'The margin of error of a confidence interval equals:',
    options: ['The sample mean', 'The critical value × standard error', 'The z-score × sample size', 'The standard deviation alone'],
    correctAnswers: [1],
    explanation: 'Margin of error (ME) = critical value (z* or t*) × standard error. The CI is then: estimate ± ME. A larger critical value (higher confidence) or smaller n (larger SE) produces a wider interval.',
  },
  {
    id: 'ci-03', domain: 1, subdomain: 'Confidence Intervals', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Increasing confidence level (e.g., from 90% to 99%) widens the confidence interval.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'To be more confident, you need a wider interval — you "cast a wider net." A 99% CI uses z* = 2.576 while a 90% CI uses z* = 1.645. More confidence requires capturing more possible values, producing a wider, less precise interval.',
  },
  {
    id: 'ci-04', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'medium',
    question: 'To cut the margin of error in half, you must increase the sample size by a factor of:',
    options: ['2', '4', '√2', '8'],
    correctAnswers: [1],
    explanation: 'ME = z*(σ/√n). To halve ME, you need √n to double, meaning n must quadruple. Halving the margin of error requires 4× the sample size — this is why large precision improvements are expensive.',
  },
  {
    id: 'ci-05', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'hard',
    question: 'A sample of 100 students has mean test score x̄ = 78 with s = 10. The 95% CI for μ is approximately:',
    options: ['78 ± 1.96', '78 ± 1.645', '78 ± 2.576', '78 ± 19.6'],
    correctAnswers: [0],
    explanation: 'SE = s/√n = 10/√100 = 1.0. 95% CI uses z* = 1.96. ME = 1.96 × 1 = 1.96. CI: 78 ± 1.96 = (76.04, 79.96). We use z (not t) because n = 100 is large enough. We are 95% confident the true mean is between approximately 76 and 80.',
  },
  {
    id: 'ci-06', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'medium',
    question: 'When is the t-distribution used instead of the z-distribution for a confidence interval?',
    options: ['Always, because t is more accurate', 'When the population standard deviation (σ) is unknown and we use s from the sample', 'When the sample size is greater than 30', 'When the population is not normal'],
    correctAnswers: [1],
    explanation: 'We use t when σ is unknown and we estimate it with the sample s. The t-distribution has heavier tails than z, reflecting the added uncertainty of estimating σ. As n increases, t approaches z (the z-distribution is the limiting case of t).',
  },
  {
    id: 'ci-07', domain: 1, subdomain: 'Confidence Intervals', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A narrower confidence interval always indicates a better, more useful estimate of the population parameter.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'A narrower CI is more precise, but that precision comes at a cost — either lower confidence level or larger sample size. A 50% confidence interval would be narrow but nearly useless. The best CI balances adequate confidence with acceptable precision.',
  },

  // ══════════════════════════════════════════════════════════════
  // Hypothesis Testing & Bivariate Data
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ht-01', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'easy',
    question: 'In hypothesis testing, the null hypothesis (H₀) typically states:',
    options: ['What the researcher hopes to prove', 'No effect, no difference, or the status quo', 'The alternative to what is being tested', 'That the sample is representative'],
    correctAnswers: [1],
    explanation: 'The null hypothesis represents "nothing new" — no effect, no difference, no relationship. It\'s what you assume is true and try to find evidence against. The alternative hypothesis (Hₐ) is what you\'re trying to show evidence for.',
  },
  {
    id: 'ht-02', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'The p-value in a hypothesis test represents:',
    options: ['The probability that H₀ is true', 'The probability of getting results at least as extreme as observed, assuming H₀ is true', 'The probability that the alternative hypothesis is true', 'The sample size needed for significance'],
    correctAnswers: [1],
    explanation: 'The p-value = P(data this extreme or more | H₀ is true). A small p-value means the observed data would be very unlikely if H₀ were true — evidence against H₀. P-value does NOT measure the probability H₀ is true.',
  },
  {
    id: 'ht-03', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'easy',
    question: 'If p-value < α (significance level), you should:',
    options: ['Fail to reject H₀', 'Reject H₀ in favor of Hₐ', 'Accept H₀ as true', 'Increase the sample size'],
    correctAnswers: [1],
    explanation: 'If p < α, the result is statistically significant — the evidence against H₀ is strong enough to reject it. Common significance levels: α = 0.05 (5%), α = 0.01 (1%). You never "accept" H₀ — you either reject it or fail to reject it.',
  },
  {
    id: 'ht-04', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'A Type I error occurs when:',
    options: ['You fail to reject H₀ when H₀ is actually false', 'You reject H₀ when H₀ is actually true (false positive)', 'You fail to collect enough data', 'The p-value equals exactly α'],
    correctAnswers: [1],
    explanation: 'Type I error: rejecting a true null hypothesis — a false positive. The probability of a Type I error is α (the significance level). Type II error: failing to reject a false null hypothesis (false negative). Reducing α reduces Type I error but increases Type II error.',
  },
  {
    id: 'ht-05', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A correlation coefficient of r = 0.95 indicates a strong positive linear relationship between two variables.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The correlation coefficient r ranges from −1 to +1. |r| close to 1 indicates a strong linear relationship; |r| close to 0 indicates a weak relationship. r = 0.95 is very strong positive correlation — as x increases, y tends to increase strongly.',
  },
  {
    id: 'ht-06', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'In a regression equation ŷ = 3 + 2x, the slope of 2 means:',
    options: ['The y-intercept is 2', 'For every 1-unit increase in x, y is predicted to increase by 2 units', 'x starts at 2', 'The correlation is 0.2'],
    correctAnswers: [1],
    explanation: 'The slope (2) is the rate of change — for each additional unit of x, the predicted value of y increases by 2. The intercept (3) is the predicted y when x = 0. Slope interpretation always requires context (units and what x and y represent).',
  },
  {
    id: 'ht-07', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'hard',
    question: 'What does R² = 0.81 tell you about a regression model?',
    options: ['The slope is 0.81', 'The correlation coefficient is 0.81', '81% of the variability in y is explained by the linear relationship with x', 'The model makes errors 81% of the time'],
    correctAnswers: [2],
    explanation: 'R² (coefficient of determination) measures the proportion of variation in y explained by the regression on x. R² = 0.81 means 81% of the variability in y is accounted for by the linear model. R = √R² = √0.81 = 0.90 (in this case).',
  },
  {
    id: 'ht-08', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'A test statistic is significant at α = 0.05. Which conclusion is correct?',
    options: ['The null hypothesis is true', 'There is statistically significant evidence against the null hypothesis', 'The alternative hypothesis is definitely true', 'The result has practical importance'],
    correctAnswers: [1],
    explanation: 'Statistical significance at α = 0.05 means p < 0.05 — the data would be unlikely if H₀ were true, providing evidence against H₀. Statistical significance does not prove the alternative is true, and does not necessarily mean the result is practically important.',
  },
  {
    id: 'ht-09', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'yesno', difficulty: 'hard',
    question: 'True or False: A strong correlation (r close to ±1) proves that one variable causes the other to change.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'Correlation is not causation. Two variables can be strongly correlated because: one causes the other, both are caused by a third variable (confounding), or by coincidence. Only controlled experiments with randomization establish causation.',
  },
  {
    id: 'ht-10', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'ordering', difficulty: 'hard',
    question: 'Order the steps of a hypothesis test correctly:',
    options: ['Calculate the test statistic and p-value', 'State H₀ and Hₐ', 'Draw a conclusion in context', 'Check conditions / state significance level α'],
    correctAnswers: [1, 3, 0, 2],
    explanation: 'Hypothesis testing steps: State hypotheses → Check conditions and set α → Calculate test statistic and p-value → Draw conclusion (reject or fail to reject H₀, with context).',
  },

  // ══════════════════════════════════════════════════════════════
  // Probability — 3 new questions (prob-14 to prob-16)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'prob-14', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'A jar has 3 red, 2 blue, and 5 green marbles. One marble is drawn at random. What is P(not green)?',
    options: ['3/10', '1/2', '7/10', '1/5'],
    correctAnswers: [1],
    explanation: 'P(green) = 5/10 = 1/2. By the complement rule, P(not green) = 1 − 1/2 = 1/2. Alternatively count directly: 3 red + 2 blue = 5 non-green marbles out of 10 total, giving 5/10 = 1/2. The complement rule is the faster path when "not X" appears in a probability question.',
  },
  {
    id: 'prob-15', domain: 1, subdomain: 'Probability', type: 'multi', difficulty: 'hard',
    question: 'Which of the following are true statements about Bayes\' Theorem? (Select all that apply)',
    options: ['It calculates P(A|B) using P(B|A), P(A), and P(B)', 'It is most surprising when the base rate of the event is very low', 'It proves that correlation implies causation', 'It updates the probability of an event based on new evidence'],
    correctAnswers: [0, 1, 3],
    explanation: 'Bayes\' Theorem formula: P(A|B) = P(B|A)·P(A)/P(B). It is a tool for updating prior probabilities with new evidence (posterior probability). The low-base-rate effect makes it counterintuitive — even a highly accurate test produces many false positives when the disease is rare. Causation is unrelated to Bayes.',
  },
  {
    id: 'prob-16', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'easy',
    question: 'Two fair coins are flipped. What is the probability of getting exactly one head?',
    options: ['1/4', '1/2', '3/4', '1'],
    correctAnswers: [1],
    explanation: 'Sample space: {HH, HT, TH, TT} — four equally likely outcomes. Outcomes with exactly one head: {HT, TH} — two outcomes. P(exactly one head) = 2/4 = 1/2. Listing the sample space is the most reliable method for small experiments.',
  },

  // ══════════════════════════════════════════════════════════════
  // Probability Distributions — 3 new questions (pdist-13 to pdist-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'pdist-13', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'A fair coin is flipped 8 times. Using the binomial distribution, what is the standard deviation of the number of heads?',
    options: ['2', '√2', '4', '1'],
    correctAnswers: [1],
    explanation: 'For B(8, 0.5): σ = √(np(1−p)) = √(8 × 0.5 × 0.5) = √2 ≈ 1.41. The standard deviation measures how spread out the number of heads is. With mean μ = np = 4, most outcomes (within 2σ) fall between about 1.17 and 6.83 heads.',
  },
  {
    id: 'pdist-14', domain: 1, subdomain: 'Probability Distributions', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A binomial random variable can take any value between 0 and n, inclusive, where n is the number of trials.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'A binomial random variable X ~ B(n, p) counts successes in n trials, so X can equal 0, 1, 2, …, n. Each value is a non-negative integer. Unlike a continuous distribution, every intermediate real value between 0 and n is not possible — only the integer values.',
  },
  {
    id: 'pdist-15', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'hard',
    question: 'IQ scores are normally distributed with μ = 100 and σ = 15. What is the approximate probability that a randomly selected person has an IQ above 130?',
    options: ['About 2.5%', 'About 16%', 'About 5%', 'About 0.3%'],
    correctAnswers: [0],
    explanation: '130 is 2 standard deviations above the mean: z = (130−100)/15 = 2. By the Empirical Rule, 95% of data falls within 2σ, leaving 5% in the two tails combined. Since the normal distribution is symmetric, 2.5% falls above z = 2. So about 2.5% of people have IQ > 130.',
  },

  // ══════════════════════════════════════════════════════════════
  // Sampling Distributions — 4 new questions (sd-10 to sd-13)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sd-10', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'According to the Central Limit Theorem, what sample size is generally considered large enough for the sampling distribution of x̄ to be approximately normal?',
    options: ['n ≥ 5', 'n ≥ 10', 'n ≥ 30', 'n ≥ 100'],
    correctAnswers: [2],
    explanation: 'The rule of thumb for the CLT is n ≥ 30. With 30 or more observations, the sampling distribution of x̄ is approximately normal for most population shapes. If the population is already normal, any sample size works. For very skewed populations, a larger n may be needed.',
  },
  {
    id: 'sd-11', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'hard',
    question: 'A population is heavily right-skewed with μ = 20 and σ = 8. Random samples of n = 64 are taken repeatedly. What is the shape of the sampling distribution of x̄?',
    options: ['Heavily right-skewed, same as the population', 'Approximately normal with mean 20 and SE = 1', 'Approximately normal with mean 20 and SE = 8', 'Uniform distribution'],
    correctAnswers: [1],
    explanation: 'By the CLT, with n = 64 ≥ 30, the sampling distribution of x̄ is approximately normal regardless of the population shape. Mean of x̄: μ = 20. SE = σ/√n = 8/√64 = 8/8 = 1. So x̄ ~ N(20, 1) approximately — much less spread than the original population.',
  },
  {
    id: 'sd-12', domain: 1, subdomain: 'Sampling Distributions', type: 'yesno', difficulty: 'medium',
    question: 'True or False: The standard error of the sample mean equals the population standard deviation divided by the square root of the sample size.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'SE = σ/√n is the defining formula for the standard error of the sample mean. It captures how much x̄ varies from sample to sample. Doubling n reduces SE by a factor of √2, not by a factor of 2 — this is why reducing variability gets expensive.',
  },
  {
    id: 'sd-13', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'If the population proportion is p = 0.4 and sample size is n = 100, what is the standard error of the sample proportion p̂?',
    options: ['0.04', '0.049', '0.4', '0.16'],
    correctAnswers: [1],
    explanation: 'SE(p̂) = √(p(1−p)/n) = √(0.4 × 0.6 / 100) = √(0.24/100) = √0.0024 ≈ 0.049. The sampling distribution of p̂ is approximately normal (since np = 40 ≥ 10 and n(1−p) = 60 ≥ 10), with mean 0.4 and SE ≈ 0.049.',
  },

  // ══════════════════════════════════════════════════════════════
  // Confidence Intervals — 5 new questions (ci-08 to ci-12)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ci-08', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'easy',
    question: 'In the formula CI = x̄ ± z*(σ/√n), what does z* represent?',
    options: ['The sample mean', 'The critical value corresponding to the desired confidence level', 'The population standard deviation', 'The p-value'],
    correctAnswers: [1],
    explanation: 'z* (read "z-star") is the critical value — the z-score that cuts off the desired percentage of the standard normal distribution. Common values: z* = 1.645 (90% CI), 1.96 (95% CI), 2.576 (99% CI). A higher confidence level requires a larger z* and thus a wider interval.',
  },
  {
    id: 'ci-09', domain: 1, subdomain: 'Confidence Intervals', type: 'multi', difficulty: 'medium',
    question: 'Which of the following actions would reduce the margin of error in a confidence interval? (Select all that apply)',
    options: ['Increasing the sample size n', 'Decreasing the confidence level', 'Using a smaller population standard deviation (if applicable)', 'Increasing the confidence level'],
    correctAnswers: [0, 1, 2],
    explanation: 'ME = z*(σ/√n). ME decreases when: n increases (larger denominator), z* decreases (lower confidence level), or σ is smaller (less population variability). Increasing the confidence level raises z* and thus increases the margin of error — the opposite of what you want for precision.',
  },
  {
    id: 'ci-10', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'hard',
    question: 'A 95% CI for the proportion of students who prefer online learning is (0.42, 0.58). What is the sample proportion p̂ and the margin of error?',
    options: ['p̂ = 0.42, ME = 0.16', 'p̂ = 0.50, ME = 0.08', 'p̂ = 0.58, ME = 0.08', 'p̂ = 0.50, ME = 0.16'],
    correctAnswers: [1],
    explanation: 'The interval (0.42, 0.58) is centered at the sample proportion: p̂ = (0.42 + 0.58)/2 = 0.50. The margin of error = half-width = (0.58 − 0.42)/2 = 0.08. So we are 95% confident the true proportion is 0.50 ± 0.08, i.e., between 42% and 58%.',
  },
  {
    id: 'ci-11', domain: 1, subdomain: 'Confidence Intervals', type: 'yesno', difficulty: 'medium',
    question: 'True or False: If a 95% confidence interval for a mean does not include the value 0, we have evidence that the true mean is different from 0 at the 5% significance level.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'There is a direct duality between confidence intervals and hypothesis tests. A 95% CI not containing 0 is equivalent to rejecting H₀: μ = 0 at α = 0.05 (two-tailed). If 0 were the true mean, it would be implausible to observe our sample result — hence statistical significance.',
  },
  {
    id: 'ci-12', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'medium',
    question: 'A researcher wants a margin of error of no more than 3 points with 95% confidence. If σ = 15, what minimum sample size is needed?',
    options: ['n = 25', 'n = 97', 'n = 96', 'n = 100'],
    correctAnswers: [1],
    explanation: 'ME = z*(σ/√n) → n = (z*σ/ME)². With z* = 1.96, σ = 15, ME = 3: n = (1.96 × 15/3)² = (9.8)² = 96.04 → round up to 97. Always round up for sample size calculations to ensure the margin of error is at most the target value.',
  },

  // ══════════════════════════════════════════════════════════════
  // Hypothesis Testing & Bivariate Data — 5 new questions (ht-11 to ht-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ht-11', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'A Type II error (β) occurs when:',
    options: ['You reject H₀ when it is actually true', 'You fail to reject H₀ when it is actually false (missed a real effect)', 'Your p-value is exactly equal to α', 'Your sample size is too small to collect data'],
    correctAnswers: [1],
    explanation: 'Type II error (false negative): you fail to reject H₀ even though Hₐ is actually true — you missed a real effect. The probability of a Type II error is β. Statistical power = 1 − β is the probability of correctly detecting a real effect. Power increases with larger sample size.',
  },
  {
    id: 'ht-12', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'A residual in regression is defined as:',
    options: ['The slope of the regression line', 'The difference between an observed y-value and the predicted ŷ-value', 'The correlation coefficient r', 'The y-intercept of the regression line'],
    correctAnswers: [1],
    explanation: 'A residual = y − ŷ (observed minus predicted). Positive residuals mean the actual value is above the regression line; negative residuals mean it\'s below. The least-squares regression line minimizes the sum of squared residuals. Residual plots help check if a linear model is appropriate.',
  },
  {
    id: 'ht-13', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A p-value of 0.03 means there is a 3% chance the null hypothesis is true.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'This is one of the most common misinterpretations. The p-value is P(data this extreme | H₀ is true) — not P(H₀ is true | data). The p-value assumes H₀ is true and asks how likely the observed data would be. It says nothing about the probability that H₀ is actually true.',
  },
  {
    id: 'ht-14', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'hard',
    question: 'In a scatterplot, the points follow a curved (non-linear) pattern. Which statement best describes the correlation coefficient r?',
    options: ['r will accurately capture the strong relationship', 'r may be close to 0 even though a strong non-linear relationship exists', 'r will be negative for any curved pattern', 'r = 1 for any consistent pattern'],
    correctAnswers: [1],
    explanation: 'The correlation coefficient r measures the strength of LINEAR relationships only. A strong curved (non-linear) pattern can produce r near 0, because r looks for straight-line association. Always make a scatterplot first — r alone does not tell the whole story.',
  },
  {
    id: 'ht-15', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'multi', difficulty: 'hard',
    question: 'Which of the following are true about the least-squares regression line ŷ = a + bx? (Select all that apply)',
    options: ['It always passes through the point (x̄, ȳ)', 'The slope b equals the correlation r times (Sy/Sx)', 'It minimizes the sum of the absolute residuals', 'It minimizes the sum of the squared residuals'],
    correctAnswers: [0, 1, 3],
    explanation: 'The least-squares line always passes through (x̄, ȳ) — the means of both variables. The slope formula is b = r(Sy/Sx). It minimizes the sum of SQUARED residuals (not absolute residuals — that would be a different method called least absolute deviations). These three properties define the unique least-squares line.',
  },

  // ══════════════════════════════════════════════════════════════
  // Round 2 expansion: 42 additional questions across all 7 subdomains
  // ══════════════════════════════════════════════════════════════

  // ─── Probability ──────────────────────────────────────────────
  {
    id: 'prob-17', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'A bag contains 5 red marbles and 3 blue marbles. You draw two marbles WITHOUT replacement. What is the probability both are red?',
    options: ['25/64', '10/28', '5/14', '20/56'],
    correctAnswers: [2],
    explanation: 'Without replacement, the first draw is 5/8 and the second is 4/7 (one red and one marble gone). P(both red) = (5/8)(4/7) = 20/56 = 5/14. The "without replacement" detail is critical — with replacement it would be (5/8)(5/8) = 25/64. Always identify which model the problem uses.',
  },
  {
    id: 'prob-18', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'P(A) = 0.6, P(B) = 0.5, and P(A and B) = 0.3. What is P(A or B)?',
    options: ['1.1', '0.8', '0.9', '0.3'],
    correctAnswers: [1],
    explanation: 'Use the addition rule: P(A or B) = P(A) + P(B) − P(A and B) = 0.6 + 0.5 − 0.3 = 0.8. Subtracting the intersection prevents double-counting events that are in both A and B. Probabilities can never exceed 1, so 1.1 is automatically wrong.',
  },
  {
    id: 'prob-19', domain: 1, subdomain: 'Probability', type: 'yesno', difficulty: 'medium',
    question: 'If events A and B are independent, does P(A | B) = P(A)?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes — that is the formal definition of independence: knowing B occurred does not change the probability of A. Equivalently, P(A and B) = P(A) × P(B) for independent events. Many problems test whether you recognize independence from context (e.g., separate coin flips are independent; drawing without replacement is not).',
  },
  {
    id: 'prob-20', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'hard',
    question: 'A medical test is 95% accurate. Only 1% of the population has the disease. If a randomly-chosen person tests positive, what is the probability they actually have the disease?',
    options: ['About 95%', 'About 50%', 'About 16%', 'About 1%'],
    correctAnswers: [2],
    explanation: 'This is a Bayes-rule problem. Of 10,000 people: 100 have the disease (95 test positive); 9,900 do not (5% × 9,900 = 495 false positives). Total positive tests = 95 + 495 = 590. P(disease | positive) = 95/590 ≈ 16%. The base rate dominates because the disease is rare. This counterintuitive result is why screening accuracy is misleading for rare conditions.',
  },
  {
    id: 'prob-21', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'easy',
    question: 'You roll a standard six-sided die once. What is the probability of rolling an even number OR a number greater than 4?',
    options: ['3/6', '4/6', '5/6', '6/6'],
    correctAnswers: [1],
    explanation: 'Even numbers: {2, 4, 6}. Greater than 4: {5, 6}. Union: {2, 4, 5, 6} — four outcomes out of six = 4/6 = 2/3. Notice 6 appears in both sets but only counted once. Use the addition rule with care: P(even) + P(>4) − P(both) = 3/6 + 2/6 − 1/6 = 4/6.',
  },
  {
    id: 'prob-22', domain: 1, subdomain: 'Probability', type: 'multi', difficulty: 'medium',
    question: 'Which of the following situations describe MUTUALLY EXCLUSIVE events? (Select all that apply)',
    options: ['Drawing a card that is a heart AND a club', 'Rolling an even number AND a number greater than 4 on a single die roll', 'Flipping a coin and getting heads AND tails on the same flip', 'A person being both under 18 AND over 65 right now'],
    correctAnswers: [0, 2, 3],
    explanation: 'Mutually exclusive = both cannot happen simultaneously. A card cannot be both a heart and a club, a single coin flip cannot be both heads and tails, and a person cannot be under 18 and over 65 at the same time. Rolling an even number AND >4 share the outcome 6, so they CAN both happen — not mutually exclusive.',
  },

  // ─── Probability Distributions ─────────────────────────────────
  {
    id: 'pd-13', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'A binomial random variable X has n = 10 trials and p = 0.3. What is the expected value E(X)?',
    options: ['0.3', '3.0', '7.0', '10'],
    correctAnswers: [1],
    explanation: 'For a binomial distribution, E(X) = np. With n = 10 and p = 0.3, E(X) = 10(0.3) = 3.0. This means in many repetitions, the average number of successes per 10 trials would be 3. The variance formula np(1−p) gives 2.1, so SD ≈ 1.45.',
  },
  {
    id: 'pd-14', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'Which of the following best describes the Normal distribution?',
    options: ['Skewed to the right, with no upper limit', 'Bell-shaped, symmetric about the mean, with parameters μ (mean) and σ (standard deviation)', 'Uniform across all values', 'Always centered at 0 with σ = 1'],
    correctAnswers: [1],
    explanation: 'The Normal distribution is the bell-shaped, symmetric distribution determined by its mean (center) and standard deviation (spread). It is NOT always centered at 0 — that\'s the STANDARD Normal, a specific case. The Normal distribution is foundational because the Central Limit Theorem guarantees sample means approach normality regardless of the underlying distribution.',
  },
  {
    id: 'pd-15', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'In a Normal distribution, approximately what percentage of values fall within 2 standard deviations of the mean?',
    options: ['68%', '95%', '99.7%', '50%'],
    correctAnswers: [1],
    explanation: 'The Empirical Rule (68–95–99.7): about 68% of values lie within 1 SD of the mean, 95% within 2 SDs, 99.7% within 3 SDs. This is one of the most-tested facts on the EOCEP. Memorize the three percentages — they show up in confidence-interval setup, z-score interpretation, and outlier detection.',
  },
  {
    id: 'pd-16', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'hard',
    question: 'SAT scores are approximately Normal with μ = 1050 and σ = 200. A student scores 1450. What is their z-score, and is this score unusual?',
    options: ['z = 2.0; not unusual (within 2 SD)', 'z = 2.0; unusual (top ~2.5%)', 'z = 1.5; in the top 25%', 'z = 0.5; very common'],
    correctAnswers: [1],
    explanation: 'z = (x − μ)/σ = (1450 − 1050)/200 = 2.0. A z-score of +2.0 means the student scored 2 SDs above the mean — by the Empirical Rule, this is in the top ~2.5% of test-takers. Z-scores standardize values from any Normal distribution onto a common scale where comparisons are direct.',
  },
  {
    id: 'pd-17', domain: 1, subdomain: 'Probability Distributions', type: 'yesno', difficulty: 'medium',
    question: 'For a discrete probability distribution, must the sum of all probabilities equal exactly 1?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes — this is one of the two requirements for a valid probability distribution: (1) every individual probability is between 0 and 1, AND (2) all probabilities sum to exactly 1. The second condition reflects that SOME outcome must occur. If sums exceed or fall short of 1, the table is not a valid distribution.',
  },
  {
    id: 'pd-18', domain: 1, subdomain: 'Probability Distributions', type: 'single', difficulty: 'medium',
    question: 'You flip a fair coin 4 times. What probability distribution models the number of heads?',
    options: ['Normal with μ = 2, σ = 1', 'Binomial with n = 4, p = 0.5', 'Uniform from 0 to 4', 'Geometric with p = 0.5'],
    correctAnswers: [1],
    explanation: 'A fixed number of independent trials (n = 4 flips), each with the same probability of success (p = 0.5 for heads), with a count of successes — this is precisely the Binomial setup. The distribution gives P(X = 0), P(X = 1), …, P(X = 4) using the binomial formula. Normal approximations work for large n but exact answers come from the binomial PMF.',
  },

  // ─── Descriptive Statistics ────────────────────────────────────
  {
    id: 'desc-16', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'easy',
    question: 'Which measure of center is MOST affected by extreme outliers?',
    options: ['Mean', 'Median', 'Mode', 'They are all equally affected'],
    correctAnswers: [0],
    explanation: 'The mean uses every value in the dataset, so a single extreme outlier can pull it significantly toward that extreme. The median (middle value when ordered) is resistant — adding an outlier shifts the median by at most one position. The mode (most-frequent value) is unaffected unless the outlier creates a new high-frequency value.',
  },
  {
    id: 'desc-17', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'In a five-number summary, what does the IQR (interquartile range) measure?',
    options: ['The range between maximum and minimum', 'The middle 50% of the data — from Q1 to Q3', 'The standard deviation', 'The mean of the upper and lower halves'],
    correctAnswers: [1],
    explanation: 'IQR = Q3 − Q1, capturing the spread of the middle 50% of the data. Because Q1 and Q3 are based on rank position rather than value, the IQR is resistant to outliers. The 1.5×IQR rule defines outliers: any value below Q1 − 1.5·IQR or above Q3 + 1.5·IQR is flagged as potentially unusual.',
  },
  {
    id: 'desc-18', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'medium',
    question: 'A distribution is described as "skewed right" (positively skewed). Which of the following is typically TRUE?',
    options: ['Mean < Median < Mode', 'Mean > Median > Mode', 'Mean = Median = Mode', 'The data is symmetric'],
    correctAnswers: [1],
    explanation: 'In a right-skewed distribution, the long tail extends to the right (high values). The mean gets pulled toward the tail, so Mean > Median > Mode is typical. Examples include income distributions and home prices. For left-skewed data, the relationship reverses: Mean < Median < Mode.',
  },
  {
    id: 'desc-19', domain: 1, subdomain: 'Descriptive Statistics', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are resistant (robust) to outliers? (Select all that apply)',
    options: ['Mean', 'Median', 'Standard deviation', 'IQR (interquartile range)'],
    correctAnswers: [1, 3],
    explanation: 'Median and IQR are based on positions (ranks) rather than the values themselves, so they are resistant — changing one outlier value affects them minimally. Mean and standard deviation both use every value directly, so a single extreme outlier shifts them substantially. Choose resistant statistics when reporting summaries of skewed data.',
  },
  {
    id: 'desc-20', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'hard',
    question: 'A dataset has Q1 = 20, Q3 = 80. Using the 1.5×IQR rule, what is the threshold for an upper outlier?',
    options: ['80', '90', '110', '170'],
    correctAnswers: [3],
    explanation: 'IQR = Q3 − Q1 = 80 − 20 = 60. Upper outlier threshold = Q3 + 1.5(IQR) = 80 + 1.5(60) = 80 + 90 = 170. Any value above 170 is flagged as a potential outlier. The lower threshold is Q1 − 1.5(IQR) = 20 − 90 = −70 (so any value below −70 is also unusual, though for many real datasets the lower threshold is below the actual minimum).',
  },
  {
    id: 'desc-21', domain: 1, subdomain: 'Descriptive Statistics', type: 'single', difficulty: 'easy',
    question: 'What is the difference between population standard deviation (σ) and sample standard deviation (s)?',
    options: ['σ divides by n; s divides by n − 1', 'σ divides by n − 1; s divides by n', 'They are computed identically', 'σ uses the median; s uses the mean'],
    correctAnswers: [0],
    explanation: 'The sample standard deviation s divides by n − 1 instead of n (Bessel\'s correction) to produce an unbiased estimate of the population variance. For populations, σ uses the full count n in the denominator. On calculators, this is the distinction between σ-mode and s-mode. In nearly all real statistics work, you use sample standard deviation s.',
  },

  // ─── Data Collection & Design ──────────────────────────────────
  {
    id: 'dc-16', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'A researcher uses a list of all registered voters and selects every 50th name. What sampling method is this?',
    options: ['Simple random sample', 'Systematic sample', 'Stratified sample', 'Cluster sample'],
    correctAnswers: [1],
    explanation: 'Systematic sampling selects every k-th element from an ordered list after a random starting point. It is easier than SRS but can introduce bias if the list has periodic patterns matching the interval k. As long as no such pattern exists, systematic sampling produces results comparable to SRS.',
  },
  {
    id: 'dc-17', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'A high school divides students by grade (9, 10, 11, 12) and randomly selects 25 from each grade. What sampling method is this?',
    options: ['Cluster sampling', 'Stratified sampling', 'Convenience sampling', 'Systematic sampling'],
    correctAnswers: [1],
    explanation: 'Stratified sampling divides the population into homogeneous subgroups (strata) and randomly samples within each. This guarantees representation from each stratum, which is especially valuable when stratum size or characteristics differ. Stratification typically REDUCES variance compared to SRS of the same total size.',
  },
  {
    id: 'dc-18', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'medium',
    question: 'A pollster surveys only people leaving the local gym. What type of bias is most likely?',
    options: ['Nonresponse bias', 'Selection bias (convenience sampling)', 'Response bias from interview questions', 'Randomization bias'],
    correctAnswers: [1],
    explanation: 'Sampling only at a gym overrepresents people who exercise. This is convenience sampling, a classic form of selection bias — the sample is systematically different from the population on the variable of interest. The result cannot be generalized to the broader public no matter how large the sample size becomes.',
  },
  {
    id: 'dc-19', domain: 1, subdomain: 'Data Collection & Design', type: 'yesno', difficulty: 'easy',
    question: 'In a true experiment, must treatment groups be randomly assigned?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes — random assignment is what separates an experiment from an observational study. By assigning subjects to treatments by chance, researchers control for confounding variables on average, enabling causal conclusions. Without random assignment, you have at best an observational study and cannot conclude causation.',
  },
  {
    id: 'dc-20', domain: 1, subdomain: 'Data Collection & Design', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are required principles of a well-designed experiment? (Select all that apply)',
    options: ['Random assignment of subjects to treatments', 'Use of a control group', 'Replication (multiple subjects per treatment)', 'Allowing subjects to choose their preferred treatment'],
    correctAnswers: [0, 1, 2],
    explanation: 'Random assignment, control groups, and replication are the three core principles of experimental design. Allowing subjects to self-select treatments destroys random assignment and creates confounding (people who choose Treatment A may differ systematically from those who choose B in ways unrelated to the treatment itself).',
  },
  {
    id: 'dc-21', domain: 1, subdomain: 'Data Collection & Design', type: 'single', difficulty: 'hard',
    question: 'A study finds that people who eat breakfast daily weigh less than those who skip breakfast. Why is this NOT proof that breakfast causes lower weight?',
    options: ['The sample was too small', 'It\'s an observational study, so confounding variables (exercise, overall diet, sleep) could be the real cause', 'The data was collected incorrectly', 'Correlation is always coincidence'],
    correctAnswers: [1],
    explanation: 'Observational studies show associations but cannot establish causation because confounding variables may explain the link. Breakfast eaters might also exercise more, sleep better, or eat overall healthier diets. The only way to confirm causation would be a randomized experiment assigning subjects to eat or skip breakfast.',
  },

  // ─── Hypothesis Testing & Bivariate Data ──────────────────────
  {
    id: 'ht-16', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'In a hypothesis test with α = 0.05, your p-value = 0.03. What is the correct conclusion?',
    options: ['Accept the null hypothesis', 'Reject the null hypothesis — the result is statistically significant at the 0.05 level', 'The null hypothesis is proven true', 'The alternative hypothesis is proven false'],
    correctAnswers: [1],
    explanation: 'When p-value < α (0.03 < 0.05), reject the null hypothesis. The result is statistically significant at the chosen α level. Note we never "accept" or "prove" the null — only fail to reject. Hypothesis tests provide evidence, not proof.',
  },
  {
    id: 'ht-17', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'What does a p-value of 0.04 actually mean in a one-sample test?',
    options: ['There is a 4% chance the null hypothesis is true', 'There is a 4% chance of seeing a result at least this extreme IF the null hypothesis were true', 'The probability of an error is 4%', 'The treatment has only 4% effect'],
    correctAnswers: [1],
    explanation: 'The p-value is the probability of observing data AT LEAST AS EXTREME as what we got, ASSUMING THE NULL IS TRUE. It is NOT the probability that the null is true (that\'s a Bayesian interpretation that requires prior information). Misinterpreting p-values is one of the most common statistical errors in popular media.',
  },
  {
    id: 'ht-18', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'medium',
    question: 'A Type I error in hypothesis testing is:',
    options: ['Rejecting the null hypothesis when it is actually true (false positive)', 'Failing to reject the null when it is actually false (false negative)', 'Choosing the wrong significance level', 'Using the wrong test statistic'],
    correctAnswers: [0],
    explanation: 'Type I error = rejecting a TRUE null hypothesis (false positive). The probability of Type I error equals α (significance level). Type II error is failing to reject a FALSE null (false negative); its probability is β. Power = 1 − β = probability of correctly detecting a real effect.',
  },
  {
    id: 'ht-19', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'yesno', difficulty: 'medium',
    question: 'If a correlation coefficient r = −0.85, is there a strong relationship between the variables?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes — the SIGN of r tells direction (positive or negative), and the MAGNITUDE tells strength. |r| = 0.85 indicates a strong relationship; only the direction (negative) means high values of one variable pair with low values of the other. Always interpret strength via |r|, not the sign.',
  },
  {
    id: 'ht-20', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'single', difficulty: 'hard',
    question: 'A regression line ŷ = 5 + 2x is fit to study hours vs. test scores. What does the slope 2 mean?',
    options: ['Each additional study hour is associated with 2 more points on the test', 'A student scoring 0 hours will score 2 on the test', 'The correlation is 2', '2 represents the y-intercept'],
    correctAnswers: [0],
    explanation: 'The slope of a regression line gives the predicted change in y for each one-unit increase in x. Here, an additional hour of study is ASSOCIATED with a 2-point increase in the predicted test score. Note "associated" — regression alone cannot establish causation; only a controlled experiment can.',
  },
  {
    id: 'ht-21', domain: 1, subdomain: 'Hypothesis Testing & Bivariate Data', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are required to interpret a regression line meaningfully? (Select all that apply)',
    options: ['The relationship between x and y is approximately linear', 'There are no extreme outliers driving the fit', 'r is positive', 'The data was collected in a way that allows generalization'],
    correctAnswers: [0, 1, 3],
    explanation: 'Linear regression assumes (1) approximate linearity, (2) no influential outliers distorting the fit, and (3) the data must be representative of the population of interest. Positive r is NOT required — negative associations are equally valid for regression; the sign of r just describes direction.',
  },

  // ─── Sampling Distributions ────────────────────────────────────
  {
    id: 'sd-14', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'The Central Limit Theorem states that for sufficiently large samples:',
    options: ['Sample data is always normally distributed', 'The distribution of sample MEANS is approximately Normal, regardless of the underlying population shape', 'The population mean equals the sample mean', 'Standard deviation always decreases with larger n'],
    correctAnswers: [1],
    explanation: 'The Central Limit Theorem (CLT) is foundational: for large enough n (rule of thumb n ≥ 30), the sampling distribution of the mean is approximately Normal — even when the population distribution is skewed or non-Normal. This is what makes statistical inference based on Normal-distribution tools so widely applicable.',
  },
  {
    id: 'sd-15', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'The standard error of the sample mean is given by:',
    options: ['σ × n', 'σ / n', 'σ / √n', 'σ × √n'],
    correctAnswers: [2],
    explanation: 'Standard error of the mean = σ/√n. As n increases, standard error decreases — but slowly (proportional to √n). To halve the standard error you must quadruple the sample size. This is why precise inference often requires large samples.',
  },
  {
    id: 'sd-16', domain: 1, subdomain: 'Sampling Distributions', type: 'yesno', difficulty: 'medium',
    question: 'If you quadruple the sample size, does the standard error of the mean drop by half?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes. SE = σ/√n, so multiplying n by 4 changes √n by √4 = 2. Standard error therefore drops to 1/2 of its previous value. This trade-off — diminishing returns from increasing n — guides how sample-size decisions get made when balancing cost and precision.',
  },
  {
    id: 'sd-17', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'hard',
    question: 'A population has μ = 100 and σ = 20. Samples of size n = 25 are repeatedly drawn. What is the standard error of the mean?',
    options: ['20', '4', '0.8', '5'],
    correctAnswers: [1],
    explanation: 'SE = σ/√n = 20/√25 = 20/5 = 4. The sampling distribution of x̄ is approximately Normal with mean 100 and SD 4. So about 95% of sample means would fall between 92 and 108 (within 2 SEs of the population mean). Compare to the population spread of σ = 20 — sample means are much more concentrated.',
  },
  {
    id: 'sd-18', domain: 1, subdomain: 'Sampling Distributions', type: 'single', difficulty: 'medium',
    question: 'Which of the following is TRUE about the sampling distribution of the sample mean x̄?',
    options: ['Its mean equals the sample mean', 'Its mean equals the population mean μ', 'Its mean equals zero', 'Its mean depends on the sample size'],
    correctAnswers: [1],
    explanation: 'The sampling distribution of x̄ is centered at the population mean μ. This is what makes x̄ an UNBIASED estimator of μ — on average across many samples, it neither overestimates nor underestimates. The spread (standard error = σ/√n) shrinks with sample size, but the center never moves.',
  },
  {
    id: 'sd-19', domain: 1, subdomain: 'Sampling Distributions', type: 'multi', difficulty: 'medium',
    question: 'When can the Central Limit Theorem be relied on for the distribution of the sample mean? (Select all that apply)',
    options: ['When the sample size is large (n ≥ 30 is a common rule of thumb)', 'When the population itself is Normal — then any n works', 'When the population is heavily skewed and n is small', 'When all data values are equal'],
    correctAnswers: [0, 1],
    explanation: 'CLT applies when (1) n is large enough — typically n ≥ 30 for moderately skewed populations — or (2) the underlying population is already Normal, in which case even small samples produce Normal sample means. CLT does NOT save you with small n from heavily-skewed populations; bootstrap methods are sometimes used instead.',
  },

  // ─── Confidence Intervals ──────────────────────────────────────
  {
    id: 'ci-13', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'medium',
    question: 'A 95% confidence interval for a population mean is (62, 78). Which interpretation is CORRECT?',
    options: ['There is a 95% probability the population mean is between 62 and 78', 'If we repeated this procedure many times, about 95% of the resulting intervals would contain the true population mean', 'About 95% of sample data falls between 62 and 78', '95% of the population lies between 62 and 78'],
    correctAnswers: [1],
    explanation: 'The 95% refers to the LONG-RUN BEHAVIOR of the procedure, not the probability for any single interval. A specific interval either contains μ or it doesn\'t — there is no probability statement about that one interval. About 95% of intervals constructed this way (in repeated sampling) would capture the true mean.',
  },
  {
    id: 'ci-14', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'medium',
    question: 'Holding everything else constant, which of the following changes will MAKE a confidence interval narrower?',
    options: ['Decreasing the confidence level (e.g., 95% → 90%)', 'Decreasing the sample size', 'Increasing the variability of the population', 'Using a different sample of the same size'],
    correctAnswers: [0],
    explanation: 'Three factors widen confidence intervals: higher confidence level (more critical value × SE), smaller sample size (larger SE = σ/√n), and higher population variability. The trade-off: narrower intervals are more precise but capture the true value less often. Choose confidence level based on consequence — 95% is the standard default.',
  },
  {
    id: 'ci-15', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'medium',
    question: 'A 95% CI for a proportion is (0.42, 0.58). What is the margin of error?',
    options: ['0.08', '0.16', '0.50', '0.42'],
    correctAnswers: [0],
    explanation: 'Margin of error (ME) is HALF the interval width. Width = 0.58 − 0.42 = 0.16, so ME = 0.08. The interval is constructed as point estimate ± ME, so the center is (0.42 + 0.58)/2 = 0.50 and the ME extends 0.08 in each direction.',
  },
  {
    id: 'ci-16', domain: 1, subdomain: 'Confidence Intervals', type: 'yesno', difficulty: 'easy',
    question: 'If you want a more precise (narrower) confidence interval at the same confidence level, do you need a larger sample size?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes. SE = σ/√n, so larger n means smaller SE, which means a narrower margin of error and narrower interval. To halve the margin of error, you need to quadruple the sample size — diminishing returns are baked into the formula.',
  },
  {
    id: 'ci-17', domain: 1, subdomain: 'Confidence Intervals', type: 'single', difficulty: 'hard',
    question: 'A poll of 1,000 voters finds 56% favor a candidate. The 95% confidence interval is approximately (53%, 59%). The opposing campaign claims their candidate has a real chance because "the polls show it\'s close." Is this claim supported?',
    options: ['Yes — the interval is close to 50%', 'No — the entire interval is above 50%, indicating the leading candidate genuinely leads', 'Yes — polls are always unreliable', 'No — the sample size is too small'],
    correctAnswers: [1],
    explanation: 'Since the ENTIRE 95% confidence interval (53%, 59%) is above 50%, there is statistical evidence the leading candidate truly has majority support. The trailing campaign\'s claim of being "close" is not supported by the data. This is exactly the kind of inference confidence intervals are designed to support.',
  },
  {
    id: 'ci-18', domain: 1, subdomain: 'Confidence Intervals', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are conditions to construct a confidence interval for a population mean using a t-distribution? (Select all that apply)',
    options: ['The sample is randomly selected from the population', 'The population is Normal OR the sample size is large enough for CLT to apply', 'The population standard deviation σ is known', 'Observations within the sample are independent of one another'],
    correctAnswers: [0, 1, 3],
    explanation: 'The t-interval requires (1) random sampling, (2) approximately Normal population or large enough sample for CLT, and (3) independent observations within the sample. The t-distribution is used precisely BECAUSE σ is unknown (we estimate it with s); when σ is known we use a z-interval instead.',
  },
  {
    id: 'prob-23', domain: 1, subdomain: 'Probability', type: 'single', difficulty: 'medium',
    question: 'A standard deck has 52 cards (4 suits, 13 ranks). What is the probability of drawing a face card (J, Q, K) given that you drew a heart?',
    options: ['3/13', '3/52', '12/52', '1/4'],
    correctAnswers: [0],
    explanation: 'This is conditional probability P(face | heart). Among the 13 hearts, there are exactly 3 face cards (J♥, Q♥, K♥). So P(face | heart) = 3/13. Notice that conditioning on "heart" shrinks the sample space from 52 cards to 13. Without the condition, P(face) = 12/52 = 3/13 — the same answer, because being a face card is independent of suit.',
  },
];
