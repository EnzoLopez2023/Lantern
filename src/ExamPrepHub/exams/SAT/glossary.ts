export interface GlossaryEntry {
  term: string;
  definition: string;
  category: 'test-format' | 'reading-writing' | 'math' | 'strategy';
}

export const glossary: GlossaryEntry[] = [
  // Test format
  {
    term: 'adaptive testing',
    definition: 'A test design in which performance on an earlier module influences the difficulty of the next module.',
    category: 'test-format',
  },
  {
    term: 'multistage adaptive testing',
    definition: 'The SAT format in which each section contains Module 1 and Module 2, and Module 2 adjusts in difficulty based on Module 1 results.',
    category: 'test-format',
  },
  {
    term: 'module',
    definition: 'One timed part of an SAT section. Reading and Writing has two modules, and Math has two modules.',
    category: 'test-format',
  },
  {
    term: 'section',
    definition: 'A major part of the SAT: Reading and Writing or Math.',
    category: 'test-format',
  },
  {
    term: 'Bluebook app',
    definition: 'The College Board application used to take the digital SAT on test day and for official practice tests.',
    category: 'test-format',
  },
  {
    term: 'scaled score',
    definition: 'The reported score after raw performance is converted to the SAT scoring scale.',
    category: 'test-format',
  },
  {
    term: 'raw score',
    definition: 'The unscaled count of questions answered correctly before score conversion.',
    category: 'test-format',
  },
  {
    term: 'section score',
    definition: 'A score from 200 to 800 earned on one section of the SAT.',
    category: 'test-format',
  },
  {
    term: 'total score',
    definition: 'The combined SAT score from 400 to 1600, found by adding the two section scores.',
    category: 'test-format',
  },
  {
    term: 'score range',
    definition: 'A small band around a reported score that reflects normal measurement variation.',
    category: 'test-format',
  },
  {
    term: 'student-produced response',
    definition: 'A math question type in which you enter your own answer instead of choosing from options.',
    category: 'test-format',
  },
  {
    term: 'multiple-choice',
    definition: 'A question type in which you choose the best answer from the listed options.',
    category: 'test-format',
  },
  {
    term: 'reference sheet',
    definition: 'The built-in math formula page available on the SAT, containing selected formulas such as circle and geometry relationships.',
    category: 'test-format',
  },
  {
    term: 'desmos calculator',
    definition: 'The embedded graphing calculator available throughout the digital SAT Math section.',
    category: 'test-format',
  },

  // Reading and Writing
  {
    term: 'inference',
    definition: 'A conclusion that is strongly supported by the text even if it is not stated directly.',
    category: 'reading-writing',
  },
  {
    term: 'central idea',
    definition: 'The main point or overall message of a passage.',
    category: 'reading-writing',
  },
  {
    term: 'command of evidence',
    definition: 'The skill of identifying which details or quotations best support an answer or claim.',
    category: 'reading-writing',
  },
  {
    term: 'words in context',
    definition: 'Questions that ask for the meaning or effect of a word or phrase as it is used in a specific passage.',
    category: 'reading-writing',
  },
  {
    term: 'rhetoric',
    definition: 'The use of language and structure to achieve a purpose, persuade an audience, or shape tone.',
    category: 'reading-writing',
  },
  {
    term: 'tone',
    definition: 'The author\'s attitude toward the subject, audience, or topic.',
    category: 'reading-writing',
  },
  {
    term: 'diction',
    definition: 'An author\'s choice of words, often analyzed for precision, connotation, and tone.',
    category: 'reading-writing',
  },
  {
    term: 'transition',
    definition: 'A word or phrase that shows how one idea connects to the next, such as contrast, cause, or addition.',
    category: 'reading-writing',
  },
  {
    term: 'parallel structure',
    definition: 'A grammatical pattern in which similar ideas are expressed in matching forms.',
    category: 'reading-writing',
  },
  {
    term: 'modifier',
    definition: 'A word or phrase that describes another word in a sentence.',
    category: 'reading-writing',
  },
  {
    term: 'independent clause',
    definition: 'A group of words with a subject and verb that can stand alone as a complete sentence.',
    category: 'reading-writing',
  },
  {
    term: 'dependent clause',
    definition: 'A group of words with a subject and verb that cannot stand alone as a complete sentence.',
    category: 'reading-writing',
  },
  {
    term: 'punctuation',
    definition: 'Marks such as commas, semicolons, and colons that clarify sentence structure and meaning.',
    category: 'reading-writing',
  },
  {
    term: 'synthesis',
    definition: 'The skill of combining information from notes, bullets, or sources into a clear and relevant sentence.',
    category: 'reading-writing',
  },

  // Math
  {
    term: 'slope',
    definition: 'The rate of change of a line, often written as rise over run.',
    category: 'math',
  },
  {
    term: 'y-intercept',
    definition: 'The point where a graph crosses the y-axis.',
    category: 'math',
  },
  {
    term: 'system of equations',
    definition: 'A set of two or more equations solved using the same variable values.',
    category: 'math',
  },
  {
    term: 'function',
    definition: 'A relation in which each input has exactly one output.',
    category: 'math',
  },
  {
    term: 'domain',
    definition: 'The set of all possible input values of a function.',
    category: 'math',
  },
  {
    term: 'range',
    definition: 'The set of all possible output values of a function.',
    category: 'math',
  },
  {
    term: 'linear function',
    definition: 'A function with a constant rate of change that graphs as a straight line.',
    category: 'math',
  },
  {
    term: 'quadratic function',
    definition: 'A function of degree 2, usually written in the form y = ax² + bx + c.',
    category: 'math',
  },
  {
    term: 'vertex',
    definition: 'The highest or lowest point of a parabola.',
    category: 'math',
  },
  {
    term: 'axis of symmetry',
    definition: 'The vertical line that divides a parabola into two mirror-image halves.',
    category: 'math',
  },
  {
    term: 'discriminant',
    definition: 'The expression b² - 4ac, used to determine how many real solutions a quadratic equation has.',
    category: 'math',
  },
  {
    term: 'exponential function',
    definition: 'A function in which a variable appears in the exponent, often modeling growth or decay.',
    category: 'math',
  },
  {
    term: 'mean',
    definition: 'The arithmetic average of a set of values.',
    category: 'math',
  },
  {
    term: 'median',
    definition: 'The middle value in an ordered data set, or the average of the two middle values if there are an even number of values.',
    category: 'math',
  },
  {
    term: 'standard deviation',
    definition: 'A measure of how spread out data values are from the mean.',
    category: 'math',
  },
  {
    term: 'probability',
    definition: 'The likelihood that an event will occur, often expressed as favorable outcomes over total outcomes.',
    category: 'math',
  },
  {
    term: 'ratio',
    definition: 'A comparison of two quantities by division.',
    category: 'math',
  },
  {
    term: 'percent',
    definition: 'A ratio out of 100.',
    category: 'math',
  },
  {
    term: 'similar triangles',
    definition: 'Triangles with the same angle measures and proportional side lengths.',
    category: 'math',
  },
  {
    term: 'Pythagorean theorem',
    definition: 'The relationship a² + b² = c² for the side lengths of a right triangle.',
    category: 'math',
  },
  {
    term: 'circle equation',
    definition: 'An equation that represents a circle on the coordinate plane, often involving a center and radius.',
    category: 'math',
  },
  {
    term: 'nonlinear function',
    definition: 'A function whose graph is not a straight line because its rate of change is not constant.',
    category: 'math',
  },

  // Strategy
  {
    term: 'process of elimination',
    definition: 'A strategy of crossing out clearly wrong answer choices to improve the odds of selecting the correct one.',
    category: 'strategy',
  },
  {
    term: 'backsolving',
    definition: 'A math strategy of plugging answer choices into the problem to see which one works.',
    category: 'strategy',
  },
  {
    term: 'plugging in numbers',
    definition: 'A strategy of substituting simple numerical values for variables to test algebraic relationships.',
    category: 'strategy',
  },
  {
    term: 'annotation',
    definition: 'Brief marking of key words, shifts, or evidence while reading to stay engaged with the passage.',
    category: 'strategy',
  },
  {
    term: 'pacing',
    definition: 'Managing time across a module so that one difficult question does not cost easier points later.',
    category: 'strategy',
  },
  {
    term: 'time management',
    definition: 'The practice of budgeting minutes and deciding when to move on from a question.',
    category: 'strategy',
  },
  {
    term: 'distractor',
    definition: 'A tempting wrong answer choice designed to exploit a common mistake.',
    category: 'strategy',
  },
  {
    term: 'evidence-based reading',
    definition: 'A reading approach that requires answers to be supported directly by the passage rather than by outside knowledge.',
    category: 'strategy',
  },
  {
    term: 'guess strategically',
    definition: 'To make the best possible guess after eliminating as many incorrect choices as possible.',
    category: 'strategy',
  },
  {
    term: 'error log',
    definition: 'A record of missed questions, the reason each was missed, and the pattern to fix before the next test.',
    category: 'strategy',
  },
  {
    term: 'pattern recognition',
    definition: 'The habit of noticing repeated question types, grammar traps, or algebra setups that appear often on practice tests.',
    category: 'strategy',
  },
  {
    term: 'precision',
    definition: 'The strategy of checking units, labels, signs, and wording carefully so a nearly correct answer does not become wrong.',
    category: 'strategy',
  },
  {
    term: 'cross-checking',
    definition: 'Verifying that an answer matches the question actually asked, especially in multi-step math problems.',
    category: 'strategy',
  },
  {
    term: 'best evidence',
    definition: 'The specific sentence, data point, or phrase in a passage that most directly supports an answer choice.',
    category: 'strategy',
  },
];
