// Glossary for ALG2 — Algebra 2 (SC 11th-grade).
// Terms expected for a standard Algebra 2 course.

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // ── Polynomial & Rational Functions ──────────────────────────────
  { term: 'Polynomial function',      definition: 'A function of the form f(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀ where all exponents are non-negative integers and all coefficients are real numbers. The degree is the highest exponent.' },
  { term: 'Degree of a polynomial',   definition: 'The highest exponent (power) on the variable in the polynomial. The degree determines end behavior and the maximum number of real zeros.' },
  { term: 'Leading coefficient',      definition: 'The coefficient of the highest-degree term. Together with the degree, it determines end behavior. Positive leading coeff → right arm goes up; negative → right arm goes down.' },
  { term: 'End behavior',             definition: 'How a polynomial function behaves as x → +∞ or x → −∞. Determined by the leading term. Even degree: both arms same direction. Odd degree: arms opposite directions.' },
  { term: 'Multiplicity of a zero',   definition: 'How many times a factor (x − a) appears in the factored polynomial. Even multiplicity → graph touches x-axis and bounces back. Odd multiplicity → graph crosses through.' },
  { term: 'Synthetic division',       definition: 'A shorthand method for dividing a polynomial by a linear factor (x − a). Uses only the coefficients. Useful for testing zeros and factoring. Much faster than polynomial long division for linear divisors.' },
  { term: 'Remainder Theorem',        definition: 'When polynomial p(x) is divided by (x − a), the remainder equals p(a). So you can find the remainder by just plugging in x = a. If p(a) = 0, then (x − a) is a factor.' },
  { term: 'Factor Theorem',           definition: '(x − a) is a factor of p(x) if and only if p(a) = 0. Finding a zero is the same as finding a factor. This connects roots and factors of polynomials.' },
  { term: 'Fundamental Theorem of Algebra', definition: 'Every polynomial of degree n ≥ 1 has exactly n complex zeros, counted with multiplicity. A degree-5 polynomial has exactly 5 complex roots (some may be real, some may come in conjugate pairs).' },
  { term: 'Rational Zeros Theorem',   definition: 'For a polynomial with integer coefficients, any rational zero must be of the form p/q where p divides the constant term and q divides the leading coefficient. Generates a finite list of candidates.' },
  { term: 'Rational function',        definition: 'A function f(x) = p(x)/q(x) where p and q are polynomials. The domain excludes x-values where q(x) = 0.' },
  { term: 'Vertical asymptote',       definition: 'A vertical line x = a that a rational function approaches but never crosses, occurring where the denominator equals zero (after reducing). The function values → ±∞ near this line.' },
  { term: 'Horizontal asymptote',     definition: 'A horizontal line y = b that a rational function approaches as x → ±∞. Determined by comparing degrees of numerator and denominator: equal degrees → y = ratio of leading coefficients.' },
  { term: 'Hole (removable discontinuity)', definition: 'A point where a rational function is undefined because a common factor cancels from numerator and denominator. The graph looks like the reduced function with one point missing.' },
  { term: 'Slant asymptote',          definition: 'A non-horizontal, non-vertical line that a rational function approaches as x → ±∞. Occurs when deg(numerator) = deg(denominator) + 1. Found by polynomial long division.' },

  // ── Complex Numbers ────────────────────────────────────────────────
  { term: 'Imaginary unit i',         definition: 'The number i = √(−1), defined so that i² = −1. Extends the real number system to allow square roots of negative numbers.' },
  { term: 'Complex number',           definition: 'A number of the form a + bi, where a and b are real numbers and i = √(−1). a is the real part, b is the imaginary part. Every real number is a complex number (with b = 0).' },
  { term: 'Complex conjugate',        definition: 'The conjugate of a + bi is a − bi (flip the sign of the imaginary part). Their product a² + b² is always a positive real number, making conjugates essential for division.' },
  { term: 'Modulus (complex)',        definition: 'The absolute value of a complex number: |a + bi| = √(a² + b²). Represents the distance from the origin to the point (a, b) in the complex (Argand) plane.' },
  { term: 'Argand plane',             definition: 'The coordinate plane used to represent complex numbers. The horizontal axis is the real axis, the vertical axis is the imaginary axis. The complex number a + bi is plotted at the point (a, b).' },
  { term: 'Complex Conjugate Root Theorem', definition: 'If a polynomial has real coefficients and a + bi (b ≠ 0) is a root, then a − bi is also a root. Complex roots of real-coefficient polynomials come in conjugate pairs.' },

  // ── Exponential & Logarithmic Functions ───────────────────────────
  { term: 'Exponential function',     definition: 'A function of the form f(x) = a·bˣ where b > 0, b ≠ 1, and a ≠ 0. If b > 1: exponential growth. If 0 < b < 1: exponential decay. The variable is in the exponent.' },
  { term: 'Logarithm',                definition: 'The inverse of exponentiation. logₐ(x) = y means aʸ = x. The logarithm answers "what exponent does the base a need to produce x?"' },
  { term: 'Common logarithm',         definition: 'A logarithm with base 10, written log(x) (the base 10 is implied). Used in pH, decibel, and Richter scale formulas. log(10) = 1, log(100) = 2, log(1) = 0.' },
  { term: 'Natural logarithm',        definition: 'A logarithm with base e (≈ 2.71828), written ln(x). Appears naturally in calculus, compound interest, and growth/decay problems. ln(e) = 1, ln(1) = 0.' },
  { term: 'Change of Base Formula',   definition: 'log_b(x) = log(x)/log(b) = ln(x)/ln(b). Converts a log in any base to base 10 or base e for calculator evaluation. Example: log₅(100) = log(100)/log(5) ≈ 2.86.' },

  // ── Systems & Matrices ────────────────────────────────────────────
  { term: 'Matrix',                   definition: 'A rectangular array of numbers arranged in rows and columns. Described by dimensions m × n (m rows, n columns). Used to represent and solve systems of linear equations efficiently.' },
  { term: 'Determinant',              definition: 'A scalar value computed from a square matrix. For 2×2: det = ad − bc. det ≠ 0 → matrix is invertible (unique solution). det = 0 → singular matrix (no unique solution).' },
  { term: 'Identity matrix',          definition: 'A square matrix with 1s on the main diagonal and 0s elsewhere. Written as I. For any compatible matrix A: AI = IA = A. The multiplicative identity for matrices.' },
  { term: 'Row echelon form',         definition: 'A form where each row has more leading zeros than the row above, and all zero rows are at the bottom. Achieved through Gaussian elimination. Enables back-substitution to find solutions.' },
  { term: 'Gaussian elimination',     definition: 'The process of using elementary row operations to convert an augmented matrix to row echelon form, then solving by back-substitution. The standard algorithm for solving linear systems.' },

  // ── Conic Sections ────────────────────────────────────────────────
  { term: 'Conic section',            definition: 'A curve formed by the intersection of a plane and a double cone. The four types are circle, parabola, ellipse, and hyperbola, depending on the angle of the cutting plane.' },
  { term: 'Focus (conic)',            definition: 'A special point used in defining conics. A parabola has one focus; ellipses and hyperbolas have two foci. The definition involves distances to the focus (and directrix for parabolas).' },
  { term: 'Directrix',                definition: 'A fixed line used to define a parabola: the set of points equidistant from the focus and the directrix. The directrix is perpendicular to the axis of symmetry.' },
  { term: 'Major axis (ellipse)',      definition: 'The longest axis of an ellipse, passing through both foci and both vertices. Length = 2a. The semi-major axis (from center to vertex) has length a.' },

  // ── Sequences & Series ────────────────────────────────────────────
  { term: 'Arithmetic sequence',      definition: 'A sequence where each term is obtained by adding a constant (the common difference d) to the previous term. General term: aₙ = a₁ + (n−1)d. Example: 3, 7, 11, 15, … (d = 4).' },
  { term: 'Geometric sequence',       definition: 'A sequence where each term is obtained by multiplying the previous term by a constant (the common ratio r). General term: aₙ = a₁·rⁿ⁻¹. Example: 2, 6, 18, 54, … (r = 3).' },
  { term: 'Sigma notation',           definition: 'A compact way to write a sum: Σ(k=a to b) f(k). The index k runs from a to b, and all values of f(k) are added. Σ(k=1 to 4) k = 1+2+3+4 = 10.' },
  { term: 'Infinite geometric series', definition: 'The sum of infinitely many terms of a geometric sequence. Converges to a/(1−r) when |r| < 1. Diverges (grows without bound) when |r| ≥ 1.' },
  { term: 'Binomial Theorem',         definition: 'A formula for expanding (a+b)ⁿ: (a+b)ⁿ = Σ C(n,k)·aⁿ⁻ᵏ·bᵏ. The coefficients C(n,k) form Pascal\'s Triangle. Avoids repeated multiplication for large powers.' },
];
