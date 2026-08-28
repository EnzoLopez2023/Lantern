// Glossary for PRECALC — Pre-Calculus (SC 11th-grade advanced math).

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // ── Functions & Transformations ───────────────────────────────────
  { term: 'Parent function',        definition: 'The simplest version of a function family, with no shifts, stretches, or reflections applied. Examples: y = x² (quadratic), y = x³ (cubic), y = |x| (absolute value), y = √x (square root), y = 1/x (reciprocal).' },
  { term: 'Transformation',        definition: 'A change applied to a parent function that shifts, stretches, compresses, or reflects its graph. The four types are: horizontal/vertical translations (shifts), vertical/horizontal dilations (stretches/compressions), and reflections over the x- or y-axis.' },
  { term: 'Even function',         definition: 'A function where f(−x) = f(x) for all x in its domain. The graph is symmetric about the y-axis. Examples: f(x) = x², f(x) = cos(x), f(x) = |x|.' },
  { term: 'Odd function',          definition: 'A function where f(−x) = −f(x) for all x in its domain. The graph has 180° rotational symmetry about the origin. Examples: f(x) = x³, f(x) = sin(x), f(x) = x.' },
  { term: 'Composition',           definition: 'Applying one function to the output of another. (f ∘ g)(x) = f(g(x)) — g acts first, then f. Composition is generally not commutative: f(g(x)) ≠ g(f(x)) in most cases.' },
  { term: 'Inverse function',      definition: 'The function f⁻¹ that "undoes" f. If f maps x to y, then f⁻¹ maps y back to x. Verified by f(f⁻¹(x)) = x and f⁻¹(f(x)) = x. Found by swapping x and y in y = f(x) and solving for y. The graphs of f and f⁻¹ are reflections over y = x.' },
  { term: 'Horizontal line test',  definition: 'A visual check for whether a function is one-to-one (and therefore has an inverse). If any horizontal line crosses the graph more than once, the function fails the test and is not one-to-one.' },
  { term: 'Piecewise function',    definition: 'A function defined by different formulas on different parts of its domain. Example: f(x) = {x² if x ≥ 0; 2x + 1 if x < 0}. To evaluate, first identify which piece applies based on the x-value.' },
  { term: 'Phase shift',           definition: 'A horizontal translation of a sinusoidal graph. In y = A·sin(Bx + C) + D, the phase shift is −C/B (positive = right, negative = left). It is the change to the starting point of the cycle.' },

  // ── Polynomial & Rational Functions ──────────────────────────────
  { term: 'Leading term',          definition: 'The term of a polynomial with the highest degree. It controls the end behavior (what happens to the graph as x → ±∞). Example: in 3x⁵ − 2x² + 7, the leading term is 3x⁵.' },
  { term: 'End behavior',          definition: 'What happens to a polynomial\'s graph (y values) as x → +∞ and x → −∞. Determined solely by the degree and the sign of the leading coefficient. Odd degree: opposite ends; even degree: same ends.' },
  { term: 'Multiplicity',          definition: 'The number of times a factor (x − a) appears in a polynomial. Even multiplicity: the graph touches (bounces off) the x-axis at x = a. Odd multiplicity: the graph crosses through the x-axis at x = a.' },
  { term: 'Remainder Theorem',     definition: 'When polynomial f(x) is divided by (x − a), the remainder equals f(a). This lets you evaluate a polynomial at a point by performing polynomial division — or vice versa.' },
  { term: 'Factor Theorem',        definition: 'A corollary of the Remainder Theorem: (x − a) is a factor of f(x) if and only if f(a) = 0. This connects zeros (roots) of a polynomial to its factors.' },
  { term: 'Vertical asymptote',    definition: 'A vertical line x = a that the graph of a rational function approaches but never crosses, where the denominator is zero and the factor does not cancel. The function grows without bound near a vertical asymptote.' },
  { term: 'Horizontal asymptote',  definition: 'A horizontal line y = b that the graph of a rational function approaches as x → ±∞. Determined by comparing the degrees of the numerator and denominator.' },
  { term: 'Oblique asymptote',     definition: 'A slanted (non-horizontal, non-vertical) asymptote that occurs when the degree of the numerator is exactly one more than the degree of the denominator. Found by polynomial long division.' },
  { term: 'Hole (removable discontinuity)', definition: 'A point missing from the graph of a rational function, caused by a common factor canceling from numerator and denominator. The hole\'s x-value is the zero of the canceled factor; its y-value is found by evaluating the simplified function.' },
  { term: 'Synthetic division',    definition: 'A shortcut method for dividing a polynomial by a linear factor (x − a). Much faster than long division. The result also lets you verify zeros via the Remainder Theorem.' },

  // ── Exponential & Logarithmic Functions ──────────────────────────
  { term: 'Natural base e',        definition: 'Euler\'s number, approximately 2.71828. Defined as the limit of (1 + 1/n)ⁿ as n → ∞. The natural exponential eˣ and natural logarithm ln(x) are inverses of each other. e appears naturally in continuous growth and decay.' },
  { term: 'Logarithm',             definition: 'The inverse operation of exponentiation. logb(x) = y means b^y = x. Read: "log base b of x equals y." The common log (base 10) is written log(x); the natural log (base e) is written ln(x).' },
  { term: 'Change of base',        definition: 'The formula logb(x) = log(x)/log(b) = ln(x)/ln(b), used to evaluate any logarithm with a calculator. Converts any base to base 10 or base e.' },
  { term: 'Logistic growth model', definition: 'P(t) = K/(1 + Ae^(−bt)), where K is the carrying capacity, A controls the initial condition, and b controls the growth rate. The S-shaped curve grows quickly at first, then levels off at K.' },
  { term: 'Carrying capacity',     definition: 'In the logistic growth model, the maximum population (or quantity) the environment can support. The logistic curve approaches K asymptotically as t → ∞.' },

  // ── Trigonometric Functions ───────────────────────────────────────
  { term: 'Unit circle',           definition: 'A circle of radius 1 centered at the origin. For any angle θ, the point on the unit circle is (cos θ, sin θ). The unit circle defines all six trig functions for any angle and is the foundation of trigonometry beyond right triangles.' },
  { term: 'Radian',                definition: 'A unit of angle measure. One radian is the angle subtended by an arc equal in length to the radius of the circle. 2π radians = 360°, so 1 radian ≈ 57.3°. The conversion: degrees × π/180 = radians.' },
  { term: 'Amplitude',             definition: 'Half the height of a sinusoidal wave — the distance from the midline to the maximum (or minimum). For y = A·sin(Bx + C) + D, the amplitude is |A|. Amplitude is always positive.' },
  { term: 'Period',                definition: 'The horizontal length of one complete cycle of a periodic function. For y = sin(Bx), the period is 2π/|B|. For y = tan(Bx), the period is π/|B|. A larger |B| compresses the graph, making the period shorter.' },
  { term: 'Reference angle',       definition: 'The acute angle (between 0° and 90°) formed between the terminal side of an angle and the nearest x-axis. Used to find trig values in any quadrant: evaluate the trig function at the reference angle, then apply the correct sign based on the quadrant (ASTC).' },
  { term: 'ASTC',                  definition: '"All Students Take Calculus" — mnemonic for which trig functions are positive in each quadrant. Q1: All. Q2: Sine (and csc). Q3: Tangent (and cot). Q4: Cosine (and sec). Sine is positive above the x-axis; cosine is positive to the right of the y-axis.' },

  // ── Analytic Trigonometry ─────────────────────────────────────────
  { term: 'Pythagorean identity',  definition: 'sin²θ + cos²θ = 1. This is the most fundamental trig identity, derived from the Pythagorean theorem on the unit circle. Two derived forms: 1 + tan²θ = sec²θ, and cot²θ + 1 = csc²θ.' },
  { term: 'Double angle formula',  definition: 'Formulas for trig functions of 2A in terms of functions of A. Key ones: sin(2A) = 2sinA·cosA; cos(2A) = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A. Derived from the addition formulas with B = A.' },
  { term: 'Law of Sines',          definition: 'a/sinA = b/sinB = c/sinC, relating the sides and opposite angles of any triangle. Use for AAS, ASA. The SSA case (ambiguous case) may yield 0, 1, or 2 triangles.' },
  { term: 'Law of Cosines',        definition: 'c² = a² + b² − 2ab·cosC. Generalizes the Pythagorean theorem to any triangle. Use for SAS or SSS. Reduces to the Pythagorean theorem when C = 90°.' },
  { term: 'Ambiguous case (SSA)',  definition: 'When using the Law of Sines with two sides and a non-included angle (SSA), there may be 0, 1, or 2 valid triangles. Compare the known opposite side a to b·sin A to determine the number of solutions.' },

  // ── Sequences, Series & Limits ───────────────────────────────────
  { term: 'Arithmetic sequence',   definition: 'A sequence where each term is obtained by adding a constant (the common difference d) to the previous term. nth term: aₙ = a₁ + (n − 1)d. Example: 3, 7, 11, 15, … has d = 4.' },
  { term: 'Geometric sequence',    definition: 'A sequence where each term is obtained by multiplying the previous term by a constant (the common ratio r). nth term: aₙ = a₁·rⁿ⁻¹. Example: 5, 15, 45, 135, … has r = 3.' },
  { term: 'Convergent series',     definition: 'An infinite series whose partial sums approach a finite limit. For a geometric series, convergence requires |r| < 1, and the sum is S = a₁/(1 − r). A series that does not converge is divergent.' },
  { term: 'Limit',                 definition: 'lim(x→a) f(x) = L means f(x) can be made arbitrarily close to L by choosing x sufficiently close to (but not equal to) a. Limits are the foundation of calculus — derivatives and integrals are both defined as limits.' },

  // ── Vectors & Parametrics ─────────────────────────────────────────
  { term: 'Vector',                definition: 'A quantity with both magnitude and direction. Written as ⟨a, b⟩ in component form or as ai + bj. The magnitude is √(a² + b²). Vectors model forces, velocities, displacements, and more.' },
  { term: 'Dot product',           definition: 'u·v = u₁v₁ + u₂v₂ = |u||v|cosθ. A scalar (not a vector). If u·v = 0, the vectors are orthogonal (perpendicular). If u·v > 0, the angle between them is acute. If u·v < 0, the angle is obtuse.' },
  { term: 'Parametric equations',  definition: 'Equations where x and y are each expressed as functions of a third variable t (the parameter). x = f(t), y = g(t). Useful for describing paths, projectile motion, and curves that are not functions of x alone.' },
  { term: 'Polar coordinates',     definition: 'A coordinate system where a point is described by (r, θ): r is the distance from the origin and θ is the angle from the positive x-axis. Converted to Cartesian by x = r·cosθ, y = r·sinθ.' },
];
