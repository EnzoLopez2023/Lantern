// Flashcard deck for ALG2 — Algebra 2 (SC 11th-grade).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Polynomial & Rational Functions ===
  {
    id: 'poly-fc-1',
    topic: 'Polynomial & Rational Functions',
    front: 'What determines the end behavior of a polynomial?',
    back: 'The leading term (highest-degree term). Even degree: both arms go same direction. Odd degree: arms go opposite directions. Positive leading coeff: right arm goes up. Negative: right arm goes down.',
  },
  {
    id: 'poly-fc-2',
    topic: 'Polynomial & Rational Functions',
    front: 'What does multiplicity tell you about a zero of a polynomial?',
    back: 'Even multiplicity → graph TOUCHES the x-axis and bounces back (doesn\'t cross). Odd multiplicity → graph CROSSES through the x-axis. Higher multiplicity = the graph is flatter near that zero.',
  },
  {
    id: 'poly-fc-3',
    topic: 'Polynomial & Rational Functions',
    front: 'State the Factor Theorem.',
    back: '(x − a) is a factor of polynomial p(x) if and only if p(a) = 0. Finding a zero (root) and finding a factor are the same thing — just two sides of the same coin.',
  },
  {
    id: 'poly-fc-4',
    topic: 'Polynomial & Rational Functions',
    front: 'When does a rational function have a HOLE vs. a vertical asymptote at x = a?',
    back: 'HOLE: the factor (x − a) cancels from both numerator and denominator. Vertical ASYMPTOTE: (x − a) is only in the denominator and does not cancel. Check for cancellation first.',
  },
  {
    id: 'poly-fc-5',
    topic: 'Polynomial & Rational Functions',
    front: 'What are the three horizontal asymptote rules for rational functions?',
    back: 'Compare degrees: deg(num) < deg(den) → y = 0. deg(num) = deg(den) → y = ratio of leading coefficients. deg(num) > deg(den) → no horizontal asymptote (slant asymptote if diff is 1).',
  },
  {
    id: 'poly-fc-6',
    topic: 'Polynomial & Rational Functions',
    front: 'What does the Rational Zeros Theorem say?',
    back: 'If a polynomial has integer coefficients, any rational zero p/q must have p dividing the constant term and q dividing the leading coefficient. Generates a finite list of candidates to test.',
  },
  {
    id: 'poly-fc-7',
    topic: 'Polynomial & Rational Functions',
    front: 'What is synthetic division and when do you use it?',
    back: 'A shortcut for dividing a polynomial by a linear factor (x − a). List coefficients, bring down, multiply by a and add, repeat. Use it to test zeros (zero remainder → factor) and to reduce degree.',
  },

  // === Complex Numbers ===
  {
    id: 'cx-fc-1',
    topic: 'Complex Numbers',
    front: 'What is i, and what are the four values in the cycle of powers of i?',
    back: 'i = √(−1). Cycle: i¹ = i, i² = −1, i³ = −i, i⁴ = 1, then repeats. To simplify iⁿ, divide n by 4 and use the remainder: remainder 1→i, 2→−1, 3→−i, 0→1.',
  },
  {
    id: 'cx-fc-2',
    topic: 'Complex Numbers',
    front: 'What is the complex conjugate, and why is it useful?',
    back: 'Conjugate of a + bi is a − bi (flip the imaginary sign). Multiply a complex number by its conjugate to get a real number: (a+bi)(a−bi) = a² + b². Essential for dividing complex numbers.',
  },
  {
    id: 'cx-fc-3',
    topic: 'Complex Numbers',
    front: 'How do you divide complex numbers? Example: (3+i)/(2−i)',
    back: 'Multiply top and bottom by the conjugate of the denominator. (3+i)(2+i) / ((2−i)(2+i)) = (6+3i+2i+i²)/(4+1) = (6+5i−1)/5 = (5+5i)/5 = 1+i.',
  },
  {
    id: 'cx-fc-4',
    topic: 'Complex Numbers',
    front: 'What is the modulus (absolute value) of a complex number a + bi?',
    back: '|a + bi| = √(a² + b²). It\'s the distance from the origin to the point (a, b) in the complex plane — just the Pythagorean theorem. Example: |3 + 4i| = √(9+16) = 5.',
  },
  {
    id: 'cx-fc-5',
    topic: 'Complex Numbers',
    front: 'State the Complex Conjugate Root Theorem.',
    back: 'If a polynomial has real coefficients and a + bi (b ≠ 0) is a root, then a − bi must also be a root. Complex roots of real-coefficient polynomials always come in conjugate pairs.',
  },

  // === Exponential & Logarithmic Functions ===
  {
    id: 'el-fc-1',
    topic: 'Exponential & Logarithmic Functions',
    front: 'Convert between log and exponential form: logₐ(b) = c ↔ ?',
    back: 'logₐ(b) = c ↔ aᶜ = b. The base of the log becomes the base of the exponent, the exponent c goes to the power, and b is the result. Practice until the conversion is automatic.',
  },
  {
    id: 'el-fc-2',
    topic: 'Exponential & Logarithmic Functions',
    front: 'State the three laws of logarithms.',
    back: '1. Product: log(AB) = log A + log B. 2. Quotient: log(A/B) = log A − log B. 3. Power: log(Aⁿ) = n·log A. Warning: there is NO rule for log(A+B).',
  },
  {
    id: 'el-fc-3',
    topic: 'Exponential & Logarithmic Functions',
    front: 'What is the change-of-base formula?',
    back: 'log_b(x) = log(x)/log(b) = ln(x)/ln(b). Converts any log to base 10 or base e for calculator use. Example: log₅(17) = log(17)/log(5) ≈ 1.204/0.699 ≈ 1.72.',
  },
  {
    id: 'el-fc-4',
    topic: 'Exponential & Logarithmic Functions',
    front: 'How do you solve an exponential equation like 5^x = 40?',
    back: 'Take log of both sides: log(5^x) = log(40), so x·log(5) = log(40), giving x = log(40)/log(5) ≈ 1.602/0.699 ≈ 2.29. Or use ln: x = ln(40)/ln(5).',
  },
  {
    id: 'el-fc-5',
    topic: 'Exponential & Logarithmic Functions',
    front: 'What is the half-life formula for exponential decay?',
    back: 'A(t) = A₀·(1/2)^(t/h) where h is the half-life. Equivalently, A(t) = A₀·e^(−kt) where k = ln2/h. The key: at t = h, exactly half the original amount remains.',
  },
  {
    id: 'el-fc-6',
    topic: 'Exponential & Logarithmic Functions',
    front: 'What is the domain of f(x) = log(x)? Why?',
    back: 'Domain: x > 0. You can only take the log of a positive number — the equation logₐ(x) = y means aʸ = x, and since a > 0 and a ≠ 1, the result aʸ is always positive. Log of zero or a negative number is undefined.',
  },

  // === Systems & Matrices ===
  {
    id: 'mat-fc-1',
    topic: 'Systems & Matrices',
    front: 'What is the dimension rule for matrix multiplication AB?',
    back: 'A must be m×n and B must be n×p (inner dimensions match). The result AB is m×p (outer dimensions). If the inner dimensions don\'t match, multiplication is undefined.',
  },
  {
    id: 'mat-fc-2',
    topic: 'Systems & Matrices',
    front: 'For the 2×2 matrix [[a,b],[c,d]], what is the determinant?',
    back: 'det = ad − bc. "Diagonal down minus diagonal up." If det ≠ 0, the matrix is invertible. If det = 0, the matrix is singular (no inverse) and the corresponding system has no unique solution.',
  },
  {
    id: 'mat-fc-3',
    topic: 'Systems & Matrices',
    front: 'What are the three elementary row operations in Gaussian elimination?',
    back: '1. Swap two rows. 2. Multiply a row by a non-zero scalar. 3. Add a multiple of one row to another row. These operations preserve the solution set and are used to create zeros below the diagonal.',
  },
  {
    id: 'mat-fc-4',
    topic: 'Systems & Matrices',
    front: 'What does it mean for a 3×3 system to be inconsistent?',
    back: 'No solution exists — the three planes (equations) have no common point. In row echelon form, you\'ll see a row like [0 0 0 | 5], which says 0 = 5 — a contradiction.',
  },

  // === Conic Sections ===
  {
    id: 'con-fc-1',
    topic: 'Conic Sections',
    front: 'Give the standard form of a circle with center (h, k) and radius r.',
    back: '(x − h)² + (y − k)² = r². Note the MINUS signs: the center coordinates appear with opposite signs inside the parentheses. The right side is r² (radius squared), not r.',
  },
  {
    id: 'con-fc-2',
    topic: 'Conic Sections',
    front: 'How do you distinguish an ellipse from a hyperbola in standard form?',
    back: 'Ellipse: (x−h)²/a² + (y−k)²/b² = 1 → PLUS between fractions. Hyperbola: (x−h)²/a² − (y−k)²/b² = 1 → MINUS between fractions. The plus vs. minus is the key.',
  },
  {
    id: 'con-fc-3',
    topic: 'Conic Sections',
    front: 'For an ellipse, what are a, b, and c, and how do they relate?',
    back: 'a = semi-major axis (longest), b = semi-minor axis (shortest), c = focal distance from center. Relationship: c² = a² − b² (a is always the largest). Foci lie along the major axis at distance c from center.',
  },
  {
    id: 'con-fc-4',
    topic: 'Conic Sections',
    front: 'What is completing the square used for with conic sections?',
    back: 'Converting from general form (Ax² + By² + Cx + Dy + E = 0) to standard form. Group x-terms and y-terms, then complete the square on each group to write as (x−h)² and (y−k)².',
  },
  {
    id: 'con-fc-5',
    topic: 'Conic Sections',
    front: 'For a hyperbola x²/a² − y²/b² = 1, what are the asymptotes?',
    back: 'Asymptotes: y = ±(b/a)x (through the origin). The hyperbola approaches but never reaches these lines. The "±" gives both branches their own asymptote direction.',
  },

  // === Sequences & Series ===
  {
    id: 'seq-fc-1',
    topic: 'Sequences & Series',
    front: 'State the nth-term formula for an arithmetic sequence.',
    back: 'aₙ = a₁ + (n−1)d, where a₁ is the first term and d is the common difference. To find d: subtract any term from the next. The sequence increases by d each step.',
  },
  {
    id: 'seq-fc-2',
    topic: 'Sequences & Series',
    front: 'State the sum formula for the first n terms of an arithmetic series.',
    back: 'Sₙ = n(a₁ + aₙ)/2 = n[2a₁ + (n−1)d]/2. The first formula is easier if you know the last term. Gauss\'s trick: the first and last terms add to the same sum as any symmetric pair.',
  },
  {
    id: 'seq-fc-3',
    topic: 'Sequences & Series',
    front: 'State the nth-term formula for a geometric sequence.',
    back: 'aₙ = a₁ · rⁿ⁻¹, where a₁ is the first term and r is the common ratio. To find r: divide any term by the previous one. Each term is r times the previous.',
  },
  {
    id: 'seq-fc-4',
    topic: 'Sequences & Series',
    front: 'Under what condition does an infinite geometric series converge, and what is its sum?',
    back: 'Converges when |r| < 1. Sum S = a₁/(1 − r). When |r| ≥ 1, terms don\'t shrink to zero and the series diverges (goes to infinity). Examples: r = 1/2 → converges; r = 2 → diverges.',
  },
  {
    id: 'seq-fc-5',
    topic: 'Sequences & Series',
    front: 'What does the Binomial Theorem tell you?',
    back: '(a+b)ⁿ = Σ C(n,k)·aⁿ⁻ᵏ·bᵏ for k=0 to n. The kth term (starting at k=0) is C(n,k)·aⁿ⁻ᵏ·bᵏ. Pascal\'s Triangle gives the coefficients C(n,k). Useful for expanding powers of binomials without repeated multiplication.',
  },

  // === Statistics & Probability ===
  {
    id: 'sp-fc-1',
    topic: 'Statistics & Probability',
    front: 'State the empirical (68-95-99.7) rule for normal distributions.',
    back: 'In a normal distribution: ≈68% of data falls within 1σ of the mean, ≈95% within 2σ, ≈99.7% within 3σ. Useful for quick probability estimates without a z-table.',
  },
  {
    id: 'sp-fc-2',
    topic: 'Statistics & Probability',
    front: 'What is the z-score formula, and what does a z-score tell you?',
    back: 'z = (x − μ)/σ. A z-score tells you how many standard deviations a value is from the mean. z > 0 → above mean; z < 0 → below mean. Standardizes any normal distribution to N(0,1).',
  },
  {
    id: 'sp-fc-3',
    topic: 'Statistics & Probability',
    front: 'What is the difference between nPr and nCr?',
    back: 'nPr = n!/(n−r)! — permutations, ORDER MATTERS. nCr = n!/(r!(n−r)!) — combinations, ORDER DOESN\'T MATTER. nCr = nPr / r! because we divide out the r! orderings that don\'t count.',
  },
  {
    id: 'sp-fc-4',
    topic: 'Statistics & Probability',
    front: 'State the binomial probability formula.',
    back: 'P(X=k) = C(n,k)·pᵏ·(1−p)ⁿ⁻ᵏ. n = number of trials, k = number of successes, p = probability of success. Requires: fixed n, binary outcome, constant p, independent trials (BINS).',
  },
  {
    id: 'sp-fc-5',
    topic: 'Statistics & Probability',
    front: 'What is conditional probability P(A|B)?',
    back: 'P(A|B) = P(A∩B)/P(B) — the probability of A given that B has already occurred. "Restrict the sample space to B, then find what fraction of B is also A." If A and B are independent, P(A|B) = P(A).',
  },
];
