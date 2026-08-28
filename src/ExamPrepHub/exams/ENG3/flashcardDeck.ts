// Flashcard deck for ENG3 — English Language Arts 3 (11th grade SC).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [

  // === Reading Literature ===
  {
    id: 'rl-f1',
    topic: 'Reading Literature',
    front: 'What are the five stages of Freytag\'s Pyramid in order?',
    back: 'Exposition → Rising Action → Climax → Falling Action → Resolution (denouement). The climax is the moment of highest tension. Everything before it builds; everything after it winds down.',
  },
  {
    id: 'rl-f2',
    topic: 'Reading Literature',
    front: 'What is the difference between tone and mood?',
    back: 'Tone = the author\'s attitude toward the subject (e.g., sarcastic, reverent, melancholy). Mood = the emotional atmosphere the reader experiences. Trick: the Tone belongs to the auThor; the Mood is felt by Me (the reader).',
  },
  {
    id: 'rl-f3',
    topic: 'Reading Literature',
    front: 'What are the four main points of view in fiction?',
    back: '1st person: narrator is a character ("I"). 3rd-person limited: narrator outside story, knows one character\'s thoughts. 3rd-person omniscient: narrator knows all characters\' thoughts. 2nd person: uses "you" (rare). POV controls what information readers can access.',
  },
  {
    id: 'rl-f4',
    topic: 'Reading Literature',
    front: 'What is a volta in poetry?',
    back: 'The "turn" — a shift in a poem\'s thought, emotion, or argument. Often signaled by "but," "yet," "however," or "and yet." Classic in sonnets: the first 8 lines (octave) set up a problem, the final 6 (sestet) respond or resolve it at the volta.',
  },
  {
    id: 'rl-f5',
    topic: 'Reading Literature',
    front: 'What is iambic pentameter?',
    back: 'A meter with five iambs per line. An iamb = unstressed-STRESSED (da-DUM). Pentameter = 5 feet. Pattern: da-DUM da-DUM da-DUM da-DUM da-DUM = 10 syllables. Shakespeare\'s plays and sonnets are written in iambic pentameter.',
  },
  {
    id: 'rl-f6',
    topic: 'Reading Literature',
    front: 'What is enjambment?',
    back: 'When a line of poetry continues without a pause or punctuation into the next line. Creates forward momentum, can build suspense, and mimics natural speech. The opposite is end-stopping (a line that ends with punctuation).',
  },
  {
    id: 'rl-f7',
    topic: 'Reading Literature',
    front: 'What is the difference between a static and dynamic character?',
    back: 'Dynamic character: undergoes significant internal change by the story\'s end. Static character: remains essentially the same. Note: static ≠ boring. Some important characters are intentionally static to contrast dynamic ones. Both types can be "round" (complex) or "flat" (simple).',
  },
  {
    id: 'rl-f8',
    topic: 'Reading Literature',
    front: 'What is a foil character?',
    back: 'A character designed to contrast with another (usually the protagonist) to highlight their traits. Like a foil in gold-working makes the gem stand out. Laertes is Hamlet\'s foil — both lose fathers, but Laertes acts; Hamlet delays.',
  },

  // === Reading Informational Text ===
  {
    id: 'ri-f1',
    topic: 'Reading Informational Text',
    front: 'What is the difference between central idea and main idea?',
    back: 'Central idea = the overarching message of the entire text (what the WHOLE piece is about). Main idea = the primary point of a single paragraph or section. Main ideas support and develop the central idea.',
  },
  {
    id: 'ri-f2',
    topic: 'Reading Informational Text',
    front: 'Name five text structures used in informational writing.',
    back: '1. Chronological/Sequence — events in time order. 2. Cause-Effect — why and what resulted. 3. Compare-Contrast — similarities and differences. 4. Problem-Solution — issue + proposed fix. 5. Descriptive — sensory details about a subject. Signal words reveal structure.',
  },
  {
    id: 'ri-f3',
    topic: 'Reading Informational Text',
    front: 'What is a primary source vs. a secondary source?',
    back: 'Primary source: original, first-hand account (diary, speech, photograph, raw data, interview). Secondary source: analyzes or interprets primary sources (textbook, biography, journal article). Use primary sources for direct evidence; secondary sources for context and analysis.',
  },
  {
    id: 'ri-f4',
    topic: 'Reading Informational Text',
    front: 'What does it mean to synthesize two texts?',
    back: 'Synthesis means combining information from multiple sources into a new, unified understanding — not just summarizing each source separately. Find agreements, contradictions, and gaps, then draw a conclusion that accounts for both perspectives. This is higher-level analysis.',
  },

  // === Literary Devices & Author's Craft ===
  {
    id: 'ld-f1',
    topic: 'Literary Devices',
    front: 'What is the difference between a metaphor and a simile?',
    back: 'Simile uses "like" or "as" to compare: "Her voice was like honey." Metaphor directly states the comparison without like/as: "Her voice was honey." Both compare unlike things, but simile signals the comparison explicitly. Extended metaphor continues through a whole work.',
  },
  {
    id: 'ld-f2',
    topic: 'Literary Devices',
    front: 'What are the three types of irony?',
    back: '1. Verbal irony: saying the opposite of what you mean (sarcasm). 2. Situational irony: an event is the opposite of what\'s expected. 3. Dramatic irony: the audience knows something a character doesn\'t. All three create tension, humor, or pathos.',
  },
  {
    id: 'ld-f3',
    topic: 'Literary Devices',
    front: 'What is anaphora? Give an example.',
    back: 'Anaphora is the repetition of a word or phrase at the beginning of successive clauses for emphasis and rhythm. "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields…" (Churchill). Powerful in speeches and poetry.',
  },
  {
    id: 'ld-f4',
    topic: 'Literary Devices',
    front: 'What is chiasmus? Give an example.',
    back: 'Chiasmus reverses the grammatical structure of parallel phrases (A-B | B-A). "Ask not what your country can do for you — ask what you can do for your country." The structure is inverted in the second half. Creates balance and memorability.',
  },
  {
    id: 'ld-f5',
    topic: 'Literary Devices',
    front: 'What is the difference between allusion and allegory?',
    back: 'Allusion: a brief indirect reference to another text, myth, or event ("He had a Midas touch"). Allegory: an extended narrative where the entire story represents abstract ideas on a second level (Animal Farm represents Soviet Russia throughout). Allegory is sustained; allusion is a single reference.',
  },
  {
    id: 'ld-f6',
    topic: 'Literary Devices',
    front: 'What is the difference between synecdoche and metonymy?',
    back: 'Synecdoche: a part stands for the whole or vice versa. "All hands on deck" (hands = sailors). Metonymy: a related concept substitutes for the actual thing. "The White House announced…" (White House = the president). Synecdoche is a type of metonymy, but the distinction matters in analysis.',
  },
  {
    id: 'ld-f7',
    topic: 'Literary Devices',
    front: 'What are the four main sound devices in poetry?',
    back: '1. Alliteration: repeated initial consonants ("Peter Piper picked…"). 2. Assonance: repeated vowel sounds ("The rain in Spain"). 3. Consonance: repeated consonant sounds within/at end of words. 4. Onomatopoeia: words that sound like what they describe (buzz, crack, hiss).',
  },
  {
    id: 'ld-f8',
    topic: 'Literary Devices',
    front: 'What is foreshadowing, and how does it differ from flashback?',
    back: 'Foreshadowing: hints at future events, creating anticipation or dread. Flashback: interrupts the present narrative to show past events, providing context or backstory. Both manipulate chronology. "In medias res" (starting in the middle) often relies on both flashback and foreshadowing to fill in the story.',
  },

  // === Argument & Rhetoric ===
  {
    id: 'ar-f1',
    topic: 'Argument & Rhetoric',
    front: 'What are the three Aristotelian appeals?',
    back: 'Ethos: credibility/authority — why should we trust the speaker? Pathos: emotion — how does it make us feel? Logos: logic/evidence — does the reasoning hold up? Strong arguments typically use all three. An argument relying only on pathos without logos is manipulative.',
  },
  {
    id: 'ar-f2',
    topic: 'Argument & Rhetoric',
    front: 'Name five logical fallacies and give a one-line example of each.',
    back: '1. Ad hominem: attack the person, not the argument. 2. Straw man: misrepresent the opponent\'s position. 3. False dichotomy: only two choices when more exist. 4. Slippery slope: X leads inevitably to extreme Z. 5. Hasty generalization: broad conclusion from tiny sample. 6. Circular reasoning: the conclusion restates the premise.',
  },
  {
    id: 'ar-f3',
    topic: 'Argument & Rhetoric',
    front: 'What is the Toulmin model of argument?',
    back: 'Claim (what you\'re arguing) + Data/Evidence (your proof) + Warrant (the assumption linking data to claim) + Backing (support for the warrant) + Qualifier (limits: "usually," "in most cases") + Rebuttal (acknowledging counterarguments). Most student essays use only Claim + Evidence, missing the warrant.',
  },
  {
    id: 'ar-f4',
    topic: 'Argument & Rhetoric',
    front: 'What is the difference between a counterargument and a rebuttal?',
    back: 'Counterargument: a viewpoint that opposes your claim — the strongest objection a skeptic would raise. Rebuttal: your response to the counterargument, explaining why it doesn\'t defeat your claim. Including a counterargument + rebuttal shows intellectual honesty and makes your argument stronger, not weaker.',
  },

  // === Language & Conventions ===
  {
    id: 'lc-f1',
    topic: 'Grammar',
    front: 'What is a dangling modifier vs. a misplaced modifier?',
    back: 'Dangling modifier: the word being modified is absent from the sentence. "Running to the bus, the rain began to fall" — the rain wasn\'t running. Misplaced modifier: the modifier is present but in the wrong place. "She served cake to guests on paper plates" — who\'s on paper plates? Both make sentences confusing.',
  },
  {
    id: 'lc-f2',
    topic: 'Grammar',
    front: 'When do you use "who" vs. "whom"?',
    back: '"Who" = subject form (performs the action). "Whom" = object form (receives the action). Trick: substitute "he" or "him." If "he" works → who. If "him" works → whom. "Who called?" = "He called" → who. "To whom did she speak?" = "She spoke to him" → whom.',
  },
  {
    id: 'lc-f3',
    topic: 'Grammar',
    front: 'What is the "fewer vs. less" rule?',
    back: '"Fewer" for countable nouns (fewer students, fewer dollars, fewer errors). "Less" for uncountable/mass nouns (less water, less time, less patience). Memory trick: fewer = countable items you can number one by one; less = bulk amounts with no natural unit.',
  },
  {
    id: 'lc-f4',
    topic: 'Grammar',
    front: 'What are the FANBOYS coordinating conjunctions and how are they used with commas?',
    back: 'FANBOYS: For, And, Nor, But, Or, Yet, So. Use a comma before a FANBOYS when it joins two independent clauses: "She studied hard, so she passed." No comma if the second part is not an independent clause: "She studied hard and passed." (No subject in second part = no comma.)',
  },
  {
    id: 'lc-f5',
    topic: 'Grammar',
    front: 'What is the rule for "affect" vs. "effect"?',
    back: '"Affect" is usually a verb: to influence ("The rain affected my mood"). "Effect" is usually a noun: a result ("The effect was noticeable"). Memory: Affect = Action (verb, A=A); Effect = End result (noun, E=End). Exceptions: "to effect change" (effect as verb = bring about); "affect" as noun = psychology term for emotional state.',
  },

  // === Research Writing ===
  {
    id: 'rw-f1',
    topic: 'Research Writing',
    front: 'What makes a thesis statement strong?',
    back: 'A strong thesis is (1) specific — makes a precise, focused claim, not a vague statement; (2) arguable — someone could reasonably disagree; (3) supportable — can be backed with evidence; (4) appropriately scoped — can be fully developed in the essay. "Pollution exists" is weak. "Stricter corporate emissions regulations would reduce childhood asthma rates in industrial cities" is strong.',
  },
  {
    id: 'rw-f2',
    topic: 'Research Writing',
    front: 'What is the difference between revision, editing, and proofreading?',
    back: 'Revision (big picture): reconsidering argument, structure, evidence, clarity — adding, removing, or reorganizing paragraphs. Editing (sentence level): grammar, word choice, mechanics, sentence variety. Proofreading (final surface check): typos, formatting, final errors. Do them in this order — don\'t proofread a paragraph you might delete.',
  },
  {
    id: 'rw-f3',
    topic: 'Research Writing',
    front: 'What is a signal phrase and why is it used?',
    back: 'A signal phrase introduces quoted or paraphrased material by naming the source: "According to Smith...", "The CDC reports...", "As Chen argues..." Signal phrases smooth the integration of evidence, attribute it clearly, and establish its credibility. They don\'t replace in-text citations — you still need both.',
  },
  {
    id: 'rw-f4',
    topic: 'Research Writing',
    front: 'In MLA format, what goes on the Works Cited page vs. in-text citation?',
    back: 'Works Cited (end of paper): full bibliographic information for every source — author, title, publisher, date, etc. In-text citation (parenthetical, within the text): minimal reference — usually (Author LastName PageNumber). Example: (Smith 47). Together they allow readers to find the original source. MLA uses no comma between name and page.',
  },
];
