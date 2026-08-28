// Glossary for ALG1 — Algebra 1. Terms a 9th grader is expected to recognize
// on the SC EOCEP. Shown as a Glossary section in the Study Guide and indexed
// by the unified search.

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // ── Number & Quantity ─────────────────────────────────────────────
  { term: 'Variable',              definition: 'A letter that stands in for an unknown number. In 2x + 5 = 11, the variable is x. Solving the equation means finding the value of the variable that makes the statement true.' },
  { term: 'Coefficient',           definition: 'The number multiplied by a variable. In 7x, the coefficient is 7. A coefficient of 1 is usually not written (x means 1·x). A negative coefficient like in -3x means -3 times x.' },
  { term: 'Constant',              definition: 'A number on its own, with no variable attached. In 3x + 8, the constant is 8. Constants don\'t change when x changes.' },
  { term: 'Term',                  definition: 'A single number, variable, or product of numbers and variables, separated by + or - signs. 4x² - 7x + 2 has three terms.' },
  { term: 'Expression',            definition: 'A combination of numbers, variables, and operations with no equals sign. 3x + 5 is an expression. You can simplify or evaluate expressions but you can\'t solve them.' },
  { term: 'Equation',              definition: 'A statement that two expressions are equal, joined by an = sign. 3x + 5 = 14 is an equation. You can solve equations to find variable values.' },
  { term: 'Inequality',            definition: 'A statement comparing two expressions with <, >, ≤, or ≥ instead of =. 2x + 3 < 11 is an inequality. The solution is a range of values, not just one number.' },
  { term: 'Rational number',       definition: 'Any number that can be written as a fraction p/q where p and q are integers and q ≠ 0. Includes integers, fractions, and terminating or repeating decimals. Example: 7, -2/3, 0.25, 0.333…' },
  { term: 'Irrational number',     definition: 'A number that cannot be written as a fraction of integers. Its decimal goes on forever without repeating. Examples: π, √2, √3, e.' },
  { term: 'Integer',               definition: 'A whole number, positive, negative, or zero. The set is {…, -3, -2, -1, 0, 1, 2, 3, …}. Fractions and decimals are not integers.' },
  { term: 'Absolute value',        definition: 'The distance of a number from zero on the number line, always non-negative. |−7| = 7 and |7| = 7. Distance can\'t be negative.' },
  { term: 'Scientific notation',   definition: 'Writing a number as a × 10ⁿ where 1 ≤ |a| < 10 and n is an integer. 47,000 = 4.7 × 10⁴. Useful for very big or very small numbers.' },

  // ── Linear Equations & Inequalities ───────────────────────────────
  { term: 'Linear equation',       definition: 'An equation whose graph is a straight line. The variables appear only to the first power (no x², no 1/x). General form: ax + by = c.' },
  { term: 'Slope',                 definition: 'The steepness of a line. Slope = (change in y) / (change in x) = rise/run. A line through (1,2) and (3,8) has slope (8−2)/(3−1) = 6/2 = 3.' },
  { term: 'y-intercept',           definition: 'The y-coordinate where a line crosses the y-axis — the value of y when x = 0. In y = mx + b, the y-intercept is b.' },
  { term: 'x-intercept',           definition: 'The x-coordinate where a graph crosses the x-axis — the value of x when y = 0. Also called a "zero" or "root" of the equation.' },
  { term: 'Slope-intercept form',  definition: 'A linear equation written as y = mx + b, where m is the slope and b is the y-intercept. The cleanest form for graphing a line.' },
  { term: 'Point-slope form',      definition: 'A linear equation written as y − y₁ = m(x − x₁), where m is the slope and (x₁, y₁) is a point on the line. Best when you know a slope and a point.' },
  { term: 'Standard form',         definition: 'A linear equation written as Ax + By = C, where A, B, C are integers and A is non-negative. Useful for finding intercepts quickly.' },
  { term: 'Parallel lines',        definition: 'Two lines with the same slope and different y-intercepts. They never meet. Slopes m₁ = m₂.' },
  { term: 'Perpendicular lines',   definition: 'Two lines that meet at a 90° angle. Their slopes are negative reciprocals: m₁ · m₂ = −1. Example: slopes 2 and −1/2.' },

  // ── Functions ─────────────────────────────────────────────────────
  { term: 'Function',              definition: 'A rule that assigns to each input exactly one output. Picture a vending machine: push button A, you always get snack A; you cannot push A and get both snack A and snack B.' },
  { term: 'Function notation',     definition: 'Writing y as f(x) — read "f of x" — to emphasize that y depends on x. f(3) means "the output of f when the input is 3."' },
  { term: 'Domain',                definition: 'The set of all valid inputs (x-values) of a function. For y = √x the domain is x ≥ 0, because you can\'t take the square root of a negative number in the real numbers.' },
  { term: 'Range',                 definition: 'The set of all possible outputs (y-values) of a function. For y = x² the range is y ≥ 0, because squaring never gives a negative.' },
  { term: 'Vertical line test',    definition: 'A graph represents a function if and only if no vertical line crosses it more than once. A vertical line crossing twice means one x maps to two y-values — not a function.' },

  // ── Systems of Equations ──────────────────────────────────────────
  { term: 'System of equations',   definition: 'Two or more equations being considered together. A solution to the system is a point (x, y) that makes all the equations true at once. Geometrically, it\'s the intersection of the graphs.' },
  { term: 'Substitution method',   definition: 'Solving a system by isolating one variable in one equation, then "substituting" that expression into the other equation, leaving a single-variable equation to solve.' },
  { term: 'Elimination method',    definition: 'Solving a system by adding or subtracting the equations (sometimes after multiplying one by a constant) to cancel out one variable. Then solve for what\'s left.' },

  // ── Polynomials ───────────────────────────────────────────────────
  { term: 'Polynomial',            definition: 'A sum of terms with non-negative integer exponents on the variables. 3x² + 5x − 7 is a polynomial. 1/x and √x are not.' },
  { term: 'Monomial',              definition: 'A polynomial with exactly one term. 4x³ is a monomial. So is 7 (a constant counts).' },
  { term: 'Binomial',              definition: 'A polynomial with exactly two terms. x + 5 is a binomial. So is 3x² − 7.' },
  { term: 'Trinomial',             definition: 'A polynomial with exactly three terms. x² + 5x + 6 is a trinomial. The most common factoring targets in Algebra 1.' },
  { term: 'Degree',                definition: 'The highest exponent on the variable in a polynomial. 5x³ + 2x − 1 has degree 3. The degree controls the overall shape of the graph.' },
  { term: 'FOIL',                  definition: 'Mnemonic for multiplying two binomials: First, Outer, Inner, Last. (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6.' },
  { term: 'Factor (verb)',         definition: 'To rewrite an expression as a product. Factoring x² + 5x + 6 gives (x + 2)(x + 3). The reverse of FOIL.' },
  { term: 'GCF (Greatest Common Factor)', definition: 'The largest expression that divides every term of a polynomial. The first step in factoring: pull out the GCF. GCF of 6x² + 9x is 3x, giving 3x(2x + 3).' },
  { term: 'Difference of squares', definition: 'A binomial of the form a² − b², which factors as (a + b)(a − b). Example: x² − 25 = (x + 5)(x − 5). Sum of squares does NOT factor over the reals.' },

  // ── Quadratic Functions ───────────────────────────────────────────
  { term: 'Quadratic equation',    definition: 'An equation of the form ax² + bx + c = 0, with a ≠ 0. Its graph is a parabola. It has 0, 1, or 2 real solutions.' },
  { term: 'Parabola',              definition: 'The U-shaped graph of a quadratic function. Opens up if a > 0, down if a < 0. Symmetric about its axis of symmetry.' },
  { term: 'Vertex',                definition: 'The highest or lowest point of a parabola — its turning point. For y = ax² + bx + c, the x-coordinate of the vertex is x = −b/(2a).' },
  { term: 'Axis of symmetry',      definition: 'The vertical line through the vertex of a parabola. The parabola is a mirror image across this line. Equation: x = −b/(2a).' },
  { term: 'Roots / zeros',         definition: 'The x-values where a quadratic equals zero — the x-intercepts of its parabola. Found by factoring, by the quadratic formula, or by completing the square.' },
  { term: 'Quadratic formula',     definition: 'The formula that solves any ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) / (2a). Works even when factoring fails. Memorize it cold.' },
  { term: 'Discriminant',          definition: 'The expression b² − 4ac under the radical in the quadratic formula. Positive → 2 real roots. Zero → 1 repeated real root. Negative → no real roots (2 complex roots).' },
  { term: 'Completing the square', definition: 'A method that rewrites ax² + bx + c in the form a(x − h)² + k. Useful for finding the vertex and for deriving the quadratic formula.' },

  // ── Exponential Functions ─────────────────────────────────────────
  { term: 'Exponential function',  definition: 'A function of the form f(x) = a · bˣ, where a is the initial value and b > 0, b ≠ 1 is the base. Grows (or decays) by a constant FACTOR per step — not by a constant amount.' },
  { term: 'Growth factor',         definition: 'The base b in an exponential function when b > 1. If b = 1.05, the quantity grows 5% per step. 1.05 = 1 + 0.05.' },
  { term: 'Decay factor',          definition: 'The base b in an exponential function when 0 < b < 1. If b = 0.92, the quantity shrinks by 8% per step. 0.92 = 1 − 0.08.' },
  { term: 'Half-life',             definition: 'The time it takes for an exponentially-decaying quantity to drop to half its previous value. Constant for the whole decay — same half-life from any starting point.' },

  // ── Statistics & Data ─────────────────────────────────────────────
  { term: 'Mean',                  definition: 'The arithmetic average — sum of the values divided by the count. Sensitive to outliers: one extreme value can pull the mean far from the bulk of the data.' },
  { term: 'Median',                definition: 'The middle value when the data are sorted. With an even count, take the average of the two middle values. Resistant to outliers — a better center for skewed data.' },
  { term: 'Mode',                  definition: 'The value that appears most often in the data set. A set can have one mode, multiple modes, or no mode. The only "center" that works for non-numeric (categorical) data.' },
  { term: 'Range (stats)',         definition: 'In statistics, the difference between the maximum and minimum value in a data set. Range = max − min. A rough measure of spread.' },
  { term: 'Outlier',               definition: 'A data value that lies far from the rest of the set. Can distort the mean and the line of best fit. Investigate outliers — they\'re often errors or interesting cases, not noise.' },
  { term: 'Scatter plot',          definition: 'A graph showing paired (x, y) data as dots. Reveals whether two variables are associated — positively, negatively, or not at all.' },
  { term: 'Correlation coefficient', definition: 'A number r between −1 and 1 measuring the linear association between two variables. r near 1 = strong positive; r near −1 = strong negative; r near 0 = no linear relationship.' },
  { term: 'Line of best fit',      definition: 'A line drawn through a scatter plot to model the trend. The "least-squares" line minimizes the sum of squared vertical distances from the data points to the line.' },
  { term: 'Correlation vs. causation', definition: 'Two variables can be correlated without one causing the other — a third variable, coincidence, or reverse causation may explain the link. "Ice cream sales and shark attacks both rise in summer" doesn\'t mean one causes the other.' },
];
