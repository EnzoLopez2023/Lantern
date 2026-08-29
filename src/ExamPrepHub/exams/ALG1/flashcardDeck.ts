// Flashcard deck for ALG1 — Algebra 1.
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Number & Quantity ===
  {
    id: 'nq-1',
    topic: 'Number & Quantity',
    front: 'What is a rational number?',
    back: 'Any number that can be written as a fraction p/q of two integers with q ≠ 0. Includes 7 (= 7/1), -2/3, 0.25, and repeating decimals like 0.333… (= 1/3).',
  },
  {
    id: 'nq-2',
    topic: 'Number & Quantity',
    front: 'What is an irrational number? Give two examples.',
    back: 'A number that cannot be written as a fraction of integers — its decimal goes on forever without repeating. Examples: π ≈ 3.14159…, √2 ≈ 1.41421…, √3, e.',
  },
  {
    id: 'nq-3',
    topic: 'Number & Quantity',
    front: 'Is √9 rational or irrational?',
    back: 'Rational. √9 = 3, which is an integer and therefore rational. Square roots are only irrational when the number under the radical is not a perfect square. √2 is irrational; √9, √16, √25 are not.',
  },
  {
    id: 'nq-4',
    topic: 'Number & Quantity',
    front: 'Simplify: x⁵ · x³',
    back: 'x⁸. When multiplying powers with the same base, ADD the exponents. xᵃ · xᵇ = xᵃ⁺ᵇ. Don\'t multiply the exponents.',
  },
  {
    id: 'nq-5',
    topic: 'Number & Quantity',
    front: 'Simplify: (x⁴)³',
    back: 'x¹². When raising a power to a power, MULTIPLY the exponents. (xᵃ)ᵇ = xᵃᵇ. Different rule from multiplying — pay attention to the operation.',
  },

  // === Linear Equations & Inequalities ===
  {
    id: 'lin-1',
    topic: 'Linear Equations',
    front: 'What is the slope formula given two points (x₁, y₁) and (x₂, y₂)?',
    back: 'm = (y₂ − y₁) / (x₂ − x₁). "Rise over run." Sign matters: if y goes down as x goes up, slope is negative. A vertical line has undefined slope (zero in the denominator).',
  },
  {
    id: 'lin-2',
    topic: 'Linear Equations',
    front: 'What is slope-intercept form?',
    back: 'y = mx + b. The slope is m, the y-intercept is b (the point where x = 0). The cleanest form for graphing — start at (0, b), then use the slope to step to the next point.',
  },
  {
    id: 'lin-3',
    topic: 'Linear Equations',
    front: 'What is point-slope form?',
    back: 'y − y₁ = m(x − x₁), where m is the slope and (x₁, y₁) is a known point on the line. Use it when you know a slope and ONE point, but not the y-intercept yet.',
  },
  {
    id: 'lin-4',
    topic: 'Linear Equations',
    front: 'Solve 2x + 5 = 17. What is x?',
    back: 'x = 6. Subtract 5 from both sides: 2x = 12. Divide by 2: x = 6. Check: 2(6) + 5 = 12 + 5 = 17. ✓ Always check by substituting back.',
  },
  {
    id: 'lin-5',
    topic: 'Linear Equations',
    front: 'What is the slope of a horizontal line? A vertical line?',
    back: 'Horizontal line: slope = 0 (no rise as x changes). Vertical line: slope is UNDEFINED (rise over zero run — division by zero). Common test trap.',
  },
  {
    id: 'lin-6',
    topic: 'Linear Equations',
    front: 'How do you flip an inequality?',
    back: 'When you multiply or divide BOTH sides by a NEGATIVE number, flip the inequality sign. Example: -2x > 6 → divide by -2 → x < -3. The < becomes >. Don\'t flip when adding or subtracting.',
  },

  // === Functions ===
  {
    id: 'func-1',
    topic: 'Functions',
    front: 'What makes a relation a function?',
    back: 'Each input (x) maps to exactly one output (y). Picture a vending machine: pressing A always gives snack A; pressing A and getting both A and B would NOT be a function.',
  },
  {
    id: 'func-2',
    topic: 'Functions',
    front: 'What is the vertical line test?',
    back: 'On the graph of a relation, if any vertical line crosses the curve more than once, the relation is NOT a function. A vertical line hitting twice means one x has two y-values — disallowed for functions.',
  },
  {
    id: 'func-3',
    topic: 'Functions',
    front: 'If f(x) = 3x − 4, what is f(2)?',
    back: 'f(2) = 3(2) − 4 = 6 − 4 = 2. To evaluate, substitute the input wherever you see x. f(2) reads "f of two" — it means "the output when the input is 2."',
  },
  {
    id: 'func-4',
    topic: 'Functions',
    front: 'What are the domain and range?',
    back: 'Domain = the set of all valid inputs (x-values). Range = the set of all possible outputs (y-values). For y = √x: domain is x ≥ 0, range is y ≥ 0.',
  },

  // === Systems of Equations ===
  {
    id: 'sys-1',
    topic: 'Systems of Equations',
    front: 'What three methods solve a system of two linear equations?',
    back: 'Graphing (find the intersection), substitution (solve one for a variable, plug into the other), elimination (add/subtract equations to cancel a variable). All three give the same answer; pick the cleanest for the problem.',
  },
  {
    id: 'sys-2',
    topic: 'Systems of Equations',
    front: 'What does "no solution" mean for a system of two linear equations?',
    back: 'The two lines are PARALLEL — same slope, different y-intercepts. They never meet, so no (x, y) pair satisfies both. Algebraically you\'ll get a false statement like 0 = 5 when you try to solve.',
  },
  {
    id: 'sys-3',
    topic: 'Systems of Equations',
    front: 'What does "infinitely many solutions" mean for a system?',
    back: 'The two equations represent the SAME line — every point that satisfies one satisfies the other. Algebraically you\'ll get a true statement like 0 = 0 when you try to solve.',
  },

  // === Polynomials ===
  {
    id: 'poly-1',
    topic: 'Polynomials',
    front: 'What does FOIL stand for?',
    back: 'First, Outer, Inner, Last — the order of pairs to multiply when expanding two binomials. (x + 2)(x + 3) = x·x + x·3 + 2·x + 2·3 = x² + 3x + 2x + 6 = x² + 5x + 6.',
  },
  {
    id: 'poly-2',
    topic: 'Polynomials',
    front: 'Multiply (x + 4)(x − 4) using the difference-of-squares pattern.',
    back: 'x² − 16. The pattern (a + b)(a − b) = a² − b² shortcuts the middle terms cancelling. Here a = x, b = 4, so a² − b² = x² − 16.',
  },
  {
    id: 'poly-3',
    topic: 'Polynomials',
    front: 'Factor x² + 7x + 12.',
    back: '(x + 3)(x + 4). Find two numbers that multiply to 12 (the constant) AND add to 7 (the middle coefficient): 3 and 4 work. Always check by FOILing back.',
  },
  {
    id: 'poly-4',
    topic: 'Polynomials',
    front: 'Factor x² − 5x + 6.',
    back: '(x − 2)(x − 3). Two numbers that multiply to +6 and add to −5: must both be negative. −2 and −3 give product 6 and sum −5. ✓',
  },
  {
    id: 'poly-5',
    topic: 'Polynomials',
    front: 'Factor 3x² + 9x.',
    back: '3x(x + 3). Always pull out the GCF FIRST. The GCF of 3x² and 9x is 3x. After factoring it out, what\'s left is x + 3 inside the parentheses.',
  },

  // === Quadratic Functions ===
  {
    id: 'quad-1',
    topic: 'Quadratic Functions',
    front: 'Write the quadratic formula.',
    back: 'x = (−b ± √(b² − 4ac)) / (2a) — solves any ax² + bx + c = 0 with a ≠ 0. Memorize it cold. It works even when the quadratic doesn\'t factor nicely.',
  },
  {
    id: 'quad-2',
    topic: 'Quadratic Functions',
    front: 'What does the discriminant tell you?',
    back: 'The discriminant is b² − 4ac (under the radical of the quadratic formula). Positive → 2 distinct real roots. Zero → 1 repeated real root (vertex on x-axis). Negative → no real roots.',
  },
  {
    id: 'quad-3',
    topic: 'Quadratic Functions',
    front: 'How do you find the vertex of y = ax² + bx + c?',
    back: 'x-coordinate: x = −b/(2a). Then plug that x back into the equation to get the y-coordinate. The vertex is the minimum if a > 0 (parabola opens up) and the maximum if a < 0 (opens down).',
  },
  {
    id: 'quad-4',
    topic: 'Quadratic Functions',
    front: 'Solve x² − 9 = 0.',
    back: 'x = ±3. Either factor as (x − 3)(x + 3) = 0 → x = 3 or x = −3, or take the square root of both sides: x² = 9, so x = ±√9 = ±3. Two real roots.',
  },
  {
    id: 'quad-5',
    topic: 'Quadratic Functions',
    front: 'What is the axis of symmetry of a parabola y = ax² + bx + c?',
    back: 'The vertical line x = −b/(2a). The parabola is mirror-symmetric across this line. The axis of symmetry always passes through the vertex.',
  },

  // === Exponential Functions ===
  {
    id: 'exp-1',
    topic: 'Exponential Functions',
    front: 'What is the general form of an exponential function?',
    back: 'f(x) = a · bˣ, where a is the initial value (f(0)) and b is the growth or decay factor. b > 1 means growth, 0 < b < 1 means decay.',
  },
  {
    id: 'exp-2',
    topic: 'Exponential Functions',
    front: 'A population grows 5% per year, starting at 1000. Write the equation.',
    back: 'P(t) = 1000 · (1.05)ᵗ. Growth of 5% means b = 1 + 0.05 = 1.05. After t years, multiply 1000 by 1.05 t times.',
  },
  {
    id: 'exp-3',
    topic: 'Exponential Functions',
    front: 'A car loses 15% of its value per year, starting at $20,000. Write the equation.',
    back: 'V(t) = 20000 · (0.85)ᵗ. Decay of 15% means b = 1 − 0.15 = 0.85 (you keep 85% each year). After t years, multiply by 0.85 t times.',
  },
  {
    id: 'exp-4',
    topic: 'Exponential Functions',
    front: 'What\'s the key difference between linear and exponential growth?',
    back: 'Linear adds the SAME AMOUNT each step (constant rate of change). Exponential multiplies by the SAME FACTOR each step (constant percent change). Exponential eventually outgrows any linear function.',
  },

  // === Statistics & Data ===
  {
    id: 'stat-1',
    topic: 'Statistics & Data',
    front: 'When is the median a better center than the mean?',
    back: 'When the data are skewed or have outliers. One extreme value can pull the mean far from the bulk of the data, but the median (the middle value) is unaffected by extreme values.',
  },
  {
    id: 'stat-2',
    topic: 'Statistics & Data',
    front: 'What does a correlation coefficient of r = −0.92 indicate?',
    back: 'A STRONG NEGATIVE linear relationship: as x increases, y tends to decrease, and the trend is very tight. |r| close to 1 means strong; the negative sign means the line slopes downward.',
  },
  {
    id: 'stat-3',
    topic: 'Statistics & Data',
    front: 'Why isn\'t a strong correlation enough to claim causation?',
    back: 'A third variable could be driving both (a "lurking variable"), the direction of causation could be reversed, or it could be coincidence. Causation requires controlled evidence beyond mere correlation.',
  },
  {
    id: 'stat-4',
    topic: 'Statistics & Data',
    front: 'Find the mean of 4, 7, 7, 9, 13.',
    back: '8. Sum = 4 + 7 + 7 + 9 + 13 = 40. Count = 5. Mean = 40 / 5 = 8. (Median would be 7, the middle value when sorted. Mode is 7 — appears twice.)',
  },
];
