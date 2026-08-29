// Flashcard deck for PRECALC — Pre-Calculus (SC 11th-grade advanced math).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Functions & Transformations ===
  {
    id: 'ft-1',
    topic: 'Functions & Transformations',
    front: 'What does f(x − h) do to the graph of f?',
    back: 'It shifts the graph h units to the RIGHT. The counterintuitive rule: replacing x with (x − h) inside the function moves the graph in the positive x direction. f(x + h) shifts LEFT.',
  },
  {
    id: 'ft-2',
    topic: 'Functions & Transformations',
    front: 'How do you verify that two functions f and g are inverses of each other?',
    back: 'Show that BOTH compositions equal x: f(g(x)) = x AND g(f(x)) = x. One direction is not enough — you need both. Geometrically, the graphs of f and f⁻¹ are reflections of each other over the line y = x.',
  },
  {
    id: 'ft-3',
    topic: 'Functions & Transformations',
    front: 'What is an even function? An odd function?',
    back: 'Even: f(−x) = f(x) — symmetric about the y-axis. Examples: y = x², y = cos(x), y = |x|.\nOdd: f(−x) = −f(x) — 180° rotational symmetry about the origin. Examples: y = x³, y = sin(x), y = x.',
  },
  {
    id: 'ft-4',
    topic: 'Functions & Transformations',
    front: 'What does a·f(x) do to the graph when |a| > 1? When 0 < |a| < 1?',
    back: '|a| > 1: vertical STRETCH (graph gets taller). 0 < |a| < 1: vertical COMPRESSION (graph shrinks toward x-axis). a < 0 also reflects over the x-axis. Vertical changes happen "outside" the function.',
  },
  {
    id: 'ft-5',
    topic: 'Functions & Transformations',
    front: 'What is the parent function y = 1/x called, and what are its asymptotes?',
    back: 'The reciprocal function (rational parent function). It has a vertical asymptote at x = 0 and a horizontal asymptote at y = 0. Its graph forms two hyperbola branches — one in Q1 and one in Q3. It is an odd function.',
  },
  {
    id: 'ft-6',
    topic: 'Functions & Transformations',
    front: 'How do you find f⁻¹(x) algebraically?',
    back: 'Step 1: Write y = f(x). Step 2: Swap x and y to get x = f(y). Step 3: Solve for y. Step 4: Write f⁻¹(x) = your result. Example: f(x) = 3x + 2 → y = 3x + 2 → x = 3y + 2 → y = (x−2)/3 → f⁻¹(x) = (x−2)/3.',
  },
  {
    id: 'ft-7',
    topic: 'Functions & Transformations',
    front: 'What does the Horizontal Line Test determine?',
    back: 'Whether a function is one-to-one (injective) — which is the condition for an inverse to exist. If any horizontal line crosses the graph more than once, the function is NOT one-to-one and has no inverse function without restricting the domain.',
  },

  // === Polynomial & Rational Functions ===
  {
    id: 'pr-1',
    topic: 'Polynomial & Rational Functions',
    front: 'What is the end behavior rule for polynomials?',
    back: 'Determined by the leading term (degree and sign). Odd degree: ends go in opposite directions. Even degree: ends go in the same direction. Positive leading coefficient: right end goes up. Negative: right end goes down.',
  },
  {
    id: 'pr-2',
    topic: 'Polynomial & Rational Functions',
    front: 'What is the Remainder Theorem?',
    back: 'When polynomial f(x) is divided by (x − a), the remainder equals f(a). Corollary (Factor Theorem): (x − a) is a factor of f(x) if and only if f(a) = 0.',
  },
  {
    id: 'pr-3',
    topic: 'Polynomial & Rational Functions',
    front: 'What happens to a graph at a zero of even multiplicity vs. odd multiplicity?',
    back: 'Even multiplicity: graph BOUNCES (touches x-axis, turns around). Odd multiplicity: graph CROSSES through x-axis. Example: f(x) = x²(x − 3) has a bounce at x = 0 (mult. 2) and a crossing at x = 3 (mult. 1).',
  },
  {
    id: 'pr-4',
    topic: 'Polynomial & Rational Functions',
    front: 'When does a rational function have a hole vs. a vertical asymptote?',
    back: 'A HOLE occurs when a factor cancels from numerator and denominator. A VERTICAL ASYMPTOTE occurs when the denominator is zero and the factor does NOT cancel. After canceling, evaluate the simplified function at the hole x-value to find the y-coordinate.',
  },
  {
    id: 'pr-5',
    topic: 'Polynomial & Rational Functions',
    front: 'What determines the horizontal asymptote of a rational function?',
    back: 'Compare degrees: deg(num) < deg(den) → y = 0. deg(num) = deg(den) → y = ratio of leading coefficients. deg(num) > deg(den) → no HA (oblique asymptote when deg(num) = deg(den) + 1).',
  },

  // === Exponential & Logarithmic Functions ===
  {
    id: 'el-1',
    topic: 'Exponential & Logarithmic Functions',
    front: 'State the three logarithm rules.',
    back: 'Product: logb(AB) = logb(A) + logb(B)\nQuotient: logb(A/B) = logb(A) − logb(B)\nPower: logb(Aⁿ) = n·logb(A)\nAll three come from exponent rules. Change of base: logb(x) = log(x)/log(b).',
  },
  {
    id: 'el-2',
    topic: 'Exponential & Logarithmic Functions',
    front: 'What is the continuously compounded interest formula?',
    back: 'A = Pe^(rt), where P = principal, r = annual interest rate (decimal), t = time in years, e ≈ 2.71828. Compared to periodic compounding, continuous compounding gives slightly more because interest is added at every instant.',
  },
  {
    id: 'el-3',
    topic: 'Exponential & Logarithmic Functions',
    front: 'For exponential decay A = A₀e^(−kt), what is the half-life formula?',
    back: 'At one half-life T, A = A₀/2. Solving A₀/2 = A₀e^(−kT): 1/2 = e^(−kT) → ln(1/2) = −kT → k = ln(2)/T. Equivalently, T = ln(2)/k. For doubling time, T = ln(2)/k (same formula, just for growth).',
  },
  {
    id: 'el-4',
    topic: 'Exponential & Logarithmic Functions',
    front: 'What is the logistic growth model and what does K represent?',
    back: 'P(t) = K/(1 + Ae^(−bt)). K is the carrying capacity — the upper limit the population approaches but never exceeds. The curve is S-shaped: rapid growth at first, then slowing as P approaches K. Used for population, disease spread, market saturation.',
  },
  {
    id: 'el-5',
    topic: 'Exponential & Logarithmic Functions',
    front: 'What is the change-of-base formula?',
    back: 'logb(x) = log(x)/log(b) = ln(x)/ln(b). This lets you evaluate any logarithm using a calculator\'s log or ln keys. Example: log₅(30) = log(30)/log(5) ≈ 1.477/0.699 ≈ 2.11.',
  },

  // === Trigonometric Functions ===
  {
    id: 'trig-1',
    topic: 'Trigonometric Functions',
    front: 'What is ASTC and what does it tell you?',
    back: '"All Students Take Calculus" — positive trig functions by quadrant. Q1: All positive. Q2: Sine (and csc) positive. Q3: Tangent (and cot) positive. Q4: Cosine (and sec) positive. Use to determine signs of trig values in any quadrant.',
  },
  {
    id: 'trig-2',
    topic: 'Trigonometric Functions',
    front: 'For y = A·sin(Bx + C) + D, what are the four parameters?',
    back: 'A = amplitude (|A|). Period = 2π/|B|. Phase shift = −C/B (positive = right). D = vertical shift (midline is y = D). The maximum is D + |A|; the minimum is D − |A|.',
  },
  {
    id: 'trig-3',
    topic: 'Trigonometric Functions',
    front: 'State the unit circle coordinates at 0, π/6, π/4, π/3, and π/2.',
    back: '0: (1, 0). π/6 (30°): (√3/2, 1/2). π/4 (45°): (√2/2, √2/2). π/3 (60°): (1/2, √3/2). π/2 (90°): (0, 1). Remember: (cos θ, sin θ). The pattern for sine: 0, 1/2, √2/2, √3/2, 1 — sometimes written as √0, √1, √2, √3, √4 all over 2.',
  },
  {
    id: 'trig-4',
    topic: 'Trigonometric Functions',
    front: 'How do you convert degrees to radians and radians to degrees?',
    back: 'Degrees → radians: multiply by π/180. Radians → degrees: multiply by 180/π. Key conversions: 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2, 180° = π, 360° = 2π.',
  },
  {
    id: 'trig-5',
    topic: 'Trigonometric Functions',
    front: 'What is the period of y = tan(x) and why?',
    back: 'Period is π. The tangent function completes one full cycle between consecutive vertical asymptotes, which occur every π units (at x = π/2 + πk). Compare to sine and cosine whose period is 2π.',
  },

  // === Analytic Trigonometry ===
  {
    id: 'at-1',
    topic: 'Analytic Trigonometry',
    front: 'State the three Pythagorean identities.',
    back: '1. sin²θ + cos²θ = 1\n2. 1 + tan²θ = sec²θ (divide identity 1 by cos²θ)\n3. cot²θ + 1 = csc²θ (divide identity 1 by sin²θ)\nMost frequently used: the first one, often rearranged as sin²θ = 1 − cos²θ or cos²θ = 1 − sin²θ.',
  },
  {
    id: 'at-2',
    topic: 'Analytic Trigonometry',
    front: 'State the sine and cosine addition formulas.',
    back: 'sin(A ± B) = sin A·cos B ± cos A·sin B\ncos(A ± B) = cos A·cos B ∓ sin A·sin B\nNote the sign pattern: for cosine, the sign FLIPS (plus becomes minus and vice versa). For sine, the sign stays the same.',
  },
  {
    id: 'at-3',
    topic: 'Analytic Trigonometry',
    front: 'State the double angle formulas.',
    back: 'sin(2A) = 2 sin A cos A\ncos(2A) = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A\ntan(2A) = 2tan A/(1 − tan²A)\nThe three forms of cos(2A) are all equivalent — choose based on what\'s already in your expression.',
  },
  {
    id: 'at-4',
    topic: 'Analytic Trigonometry',
    front: 'How do you solve a trig equation like sin(x) = √3/2 on [0, 2π)?',
    back: '1. Find the reference angle: sin⁻¹(√3/2) = π/3. 2. Identify quadrants where sin is positive (Q1 and Q2). 3. Q1: x = π/3. Q2: x = π − π/3 = 2π/3. 4. Write all solutions in [0, 2π): x = π/3 and 2π/3. 5. For general solution: add ±2πk.',
  },
  {
    id: 'at-5',
    topic: 'Analytic Trigonometry',
    front: 'What is the Law of Sines and when do you use it?',
    back: 'a/sin A = b/sin B = c/sin C. Use when you know: AAS or ASA (two angles and any side). Also SSA — but check for the ambiguous case. NOT for SAS or SSS (use Law of Cosines for those).',
  },

  // === Sequences & Series ===
  {
    id: 'ss-1',
    topic: 'Sequences & Series',
    front: 'What is the formula for the nth term of an arithmetic sequence?',
    back: 'aₙ = a₁ + (n − 1)d, where a₁ is the first term and d is the common difference. Equivalently: aₙ = a₁ + (n − 1)d. This is a linear function of n — the graph of (n, aₙ) is a straight line with slope d.',
  },
  {
    id: 'ss-2',
    topic: 'Sequences & Series',
    front: 'When does an infinite geometric series converge, and what is its sum?',
    back: 'Converges when |r| < 1. Sum: S = a₁/(1 − r). If |r| ≥ 1, the series diverges. Example: a₁ = 6, r = 1/2 → S = 6/(1 − 1/2) = 12. The series 6 + 3 + 1.5 + 0.75 + … = 12.',
  },
  {
    id: 'ss-3',
    topic: 'Sequences & Series',
    front: 'What is a limit? Give the intuitive definition.',
    back: 'lim(x→a) f(x) = L means f(x) gets arbitrarily close to L as x approaches a, without necessarily equaling it at x = a. A limit can exist even when f(a) is undefined. Left and right limits must agree for a two-sided limit to exist.',
  },

  // === Vectors & Parametrics ===
  {
    id: 'vp-1',
    topic: 'Vectors & Parametrics',
    front: 'What is the dot product formula and what does a dot product of 0 mean?',
    back: 'u·v = u₁v₁ + u₂v₂. The dot product equals |u||v|cosθ. If u·v = 0, the vectors are orthogonal (perpendicular, θ = 90°). The dot product is a scalar, not a vector.',
  },
  {
    id: 'vp-2',
    topic: 'Vectors & Parametrics',
    front: 'How do you convert from polar (r, θ) to Cartesian (x, y)?',
    back: 'x = r·cos θ, y = r·sin θ. Reverse: r = √(x² + y²), θ = arctan(y/x) adjusted for quadrant. Remember: r² = x² + y². So the polar equation r = constant is a circle x² + y² = r².',
  },
  {
    id: 'vp-3',
    topic: 'Vectors & Parametrics',
    front: 'How do you eliminate the parameter from parametric equations?',
    back: 'Solve for t in the simpler equation, then substitute into the other. Example: x = 2t, y = t² → t = x/2 → y = (x/2)² = x²/4. If both equations use trig (x = cos t, y = sin t), use the Pythagorean identity: x² + y² = cos²t + sin²t = 1.',
  },
  {
    id: 'vp-4',
    topic: 'Vectors & Parametrics',
    front: 'What is the magnitude of vector v = ⟨a, b⟩?',
    back: '|v| = √(a² + b²). This is just the Pythagorean theorem — the vector is the hypotenuse of a right triangle with legs a and b. A unit vector has magnitude 1. To find the unit vector in the direction of v: û = v/|v|.',
  },
];
