// Flashcard deck for ENG2 — SC English 2 (10th grade).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Reading Literary Texts ===
  {
    id: 'lit-1',
    topic: 'Literary Texts',
    front: 'What\'s the difference between TOPIC and THEME?',
    back: 'TOPIC is what the work is about — one or two words ("love," "war," "growing up"). THEME is the author\'s claim ABOUT the topic — a full sentence ("First love permanently changes how you see yourself"). On the EOCEP, answer choices that are one or two words are usually topics, not themes.',
  },
  {
    id: 'lit-2',
    topic: 'Literary Texts',
    front: 'Define DIRECT and INDIRECT characterization.',
    back: 'DIRECT: the narrator tells you outright ("Mara was stubborn"). INDIRECT: the author SHOWS it through Speech, Thoughts, Effect on others, Actions, Looks — the STEAL method. Most modern fiction relies on indirect characterization to feel less heavy-handed.',
  },
  {
    id: 'lit-3',
    topic: 'Literary Texts',
    front: 'Name the five stages of plot structure in order.',
    back: 'Exposition (setup — characters, setting, situation) → Rising Action (complications and conflicts build) → Climax (the turning point of greatest tension) → Falling Action (consequences play out) → Resolution (new normal). Also called Freytag\'s pyramid.',
  },
  {
    id: 'lit-4',
    topic: 'Literary Texts',
    front: 'What\'s the difference between TONE and MOOD?',
    back: 'TONE is the AUTHOR\'S attitude toward the subject (sarcastic, reverent, urgent). MOOD is the emotional atmosphere the reader FEELS (tense, joyful, dread). A detached tone can still create a tense mood. To analyze tone, point to specific word choices; for mood, point to setting and rhythm.',
  },
  {
    id: 'lit-5',
    topic: 'Literary Texts',
    front: 'Define METAPHOR vs. SIMILE — and give an example of each.',
    back: 'SIMILE uses "like" or "as" — "Her voice was LIKE velvet." METAPHOR fuses two things directly — "Her voice WAS velvet." A simile holds the things side-by-side; a metaphor transfers qualities of one onto the other.',
  },
  {
    id: 'lit-6',
    topic: 'Literary Texts',
    front: 'What is IMAGERY? How is it different from a metaphor?',
    back: 'IMAGERY is descriptive language that engages the five senses — sight, sound, smell, taste, touch. "The metallic tang of rain on hot asphalt" uses smell and taste. A metaphor compares two things; imagery paints a sensory picture. Imagery often USES metaphors but isn\'t the same thing.',
  },
  {
    id: 'lit-7',
    topic: 'Literary Texts',
    front: 'What is PERSONIFICATION? Give an example.',
    back: 'Giving human qualities to non-human things. "The wind WHISPERED through the trees." "Time MARCHED on." A specialized form of metaphor that brings inanimate or abstract things to life. Useful for making writing more vivid.',
  },
  {
    id: 'lit-8',
    topic: 'Literary Texts',
    front: 'Name the three main points of view in fiction.',
    back: 'FIRST PERSON ("I") — the narrator is a character in the story. THIRD PERSON LIMITED — outside narrator, but can only see one character\'s thoughts. THIRD PERSON OMNISCIENT — outside narrator who knows every character\'s thoughts. (Second person "you" exists but is rare.)',
  },
  {
    id: 'lit-9',
    topic: 'Literary Texts',
    front: 'Define HYPERBOLE.',
    back: 'Deliberate exaggeration for effect, not meant literally. "I\'ve told you a million times" or "My backpack weighs a ton." Used for humor, emphasis, or emotional intensity. Notice that hyperbole is always non-literal — that\'s the giveaway.',
  },
  {
    id: 'lit-10',
    topic: 'Literary Texts',
    front: 'What are the three types of IRONY?',
    back: 'VERBAL irony: saying the opposite of what you mean ("Lovely weather" during a downpour). SITUATIONAL irony: an outcome opposite to what was expected (a fire station burning down). DRAMATIC irony: the audience knows something a character doesn\'t (Romeo thinks Juliet is dead).',
  },
  {
    id: 'lit-11',
    topic: 'Literary Texts',
    front: 'What is an ALLUSION?',
    back: 'A brief reference to another well-known work, person, place, or event — usually expecting the reader to recognize it. "She had the patience of Job" alludes to the Bible. Compresses meaning by piggy-backing on a shared story. Common allusions on the EOCEP: Greek myth, Shakespeare, the Bible, American history.',
  },

  // === Reading Informational Texts ===
  {
    id: 'info-1',
    topic: 'Informational Texts',
    front: 'How do you find the CENTRAL IDEA of a nonfiction passage?',
    back: 'Look at the topic sentences of each paragraph and ask: "What\'s the single thread that connects them?" That\'s the central idea — usually a full sentence claim, not just a topic. The first and last paragraphs are often the most direct about it.',
  },
  {
    id: 'info-2',
    topic: 'Informational Texts',
    front: 'What is AUTHOR\'S PURPOSE? Name the main types (PIE).',
    back: 'Why the author wrote the text. PIE: to Persuade (change your mind), Inform (give you facts), or Entertain. Often combined — a persuasive editorial may also entertain. Identifying purpose helps you weigh how much to trust the evidence.',
  },
  {
    id: 'info-3',
    topic: 'Informational Texts',
    front: 'Name five common TEXT STRUCTURES in nonfiction.',
    back: 'Cause-and-effect, compare/contrast, chronological/sequence, problem/solution, and description. Spotting the structure helps you predict what comes next. Cue words give it away: "because" → cause-effect; "however" → contrast; "first, then" → sequence.',
  },
  {
    id: 'info-4',
    topic: 'Informational Texts',
    front: 'What\'s the difference between a CLAIM and a FACT?',
    back: 'A FACT is verifiable — "The US has 50 states." A CLAIM is arguable — "The US should have more states." Claims need evidence to support them; facts already are evidence. On the EOCEP, look out for questions asking you to identify a claim hidden among facts.',
  },

  // === Argument & Rhetoric ===
  {
    id: 'arg-1',
    topic: 'Rhetoric',
    front: 'Define ETHOS, PATHOS, and LOGOS.',
    back: 'ETHOS appeals to the speaker\'s CREDIBILITY ("As a board-certified doctor…"). PATHOS appeals to EMOTION ("Imagine your child…"). LOGOS appeals to LOGIC and reason (data, statistics, structured argument). Strong persuasive writing balances all three.',
  },
  {
    id: 'arg-2',
    topic: 'Rhetoric',
    front: 'What is a COUNTERCLAIM, and why include one?',
    back: 'A counterclaim is the opposing view — what someone disagreeing with you would say. Strong argumentative writing NAMES the counterclaim, then REBUTS it. Including a counterclaim makes you look fair-minded and makes your own argument stronger, because you\'ve shown you considered alternatives.',
  },
  {
    id: 'arg-3',
    topic: 'Rhetoric',
    front: 'What is an AD HOMINEM fallacy? Give an example.',
    back: 'Attacking the PERSON instead of the argument. "You can\'t trust her safety proposal — she\'s never even owned a car." Her car-ownership history has nothing to do with whether the proposal works. Latin for "to the man."',
  },
  {
    id: 'arg-4',
    topic: 'Rhetoric',
    front: 'What is a STRAW MAN fallacy?',
    back: 'Distorting your opponent\'s argument into a weaker, easier-to-attack version, then knocking down THAT version. "You want safer streets? So you want to BAN ALL CARS?!" The original claim wasn\'t banning cars — the speaker built a "straw man" easy to demolish.',
  },
  {
    id: 'arg-5',
    topic: 'Rhetoric',
    front: 'What is the BANDWAGON fallacy?',
    back: 'Arguing something is correct or good because lots of people believe or do it. "Everyone\'s switching to brand X — it must be best." Popularity isn\'t proof. Millions once believed the earth was flat; the count didn\'t make it round.',
  },
  {
    id: 'arg-6',
    topic: 'Rhetoric',
    front: 'What is FALSE DICHOTOMY (a.k.a. either-or fallacy)?',
    back: 'Pretending there are only two options when more exist. "Either we cut arts funding or test scores fall." Almost any "either/or" framing in real policy hides a third (or fourth, or fifth) option. Look for binary framing — it\'s usually deceptive.',
  },
  {
    id: 'arg-7',
    topic: 'Rhetoric',
    front: 'What is a SLIPPERY SLOPE fallacy?',
    back: 'Assuming one small step inevitably triggers a chain of dramatic negative consequences. "If we allow phones in class, soon students will stop reading entirely." Each link in the chain needs evidence; without it, it\'s just fear-mongering.',
  },

  // === Language & Grammar ===
  {
    id: 'gram-1',
    topic: 'Grammar',
    front: 'What is SUBJECT-VERB AGREEMENT? Give a tricky example.',
    back: 'Singular subjects take singular verbs; plural subjects take plural verbs. Tricky: "The BOX of cookies IS empty." The subject is BOX (singular), not COOKIES. Always ask "what\'s the actual subject?" — phrases in between are noise.',
  },
  {
    id: 'gram-2',
    topic: 'Grammar',
    front: 'How do you fix a COMMA SPLICE?',
    back: 'A comma splice joins two independent clauses with only a comma: "I love writing, I hate editing." Three fixes: (1) period — "I love writing. I hate editing." (2) semicolon — "I love writing; I hate editing." (3) comma + conjunction — "I love writing, but I hate editing."',
  },
  {
    id: 'gram-3',
    topic: 'Grammar',
    front: 'What is a DANGLING MODIFIER? Fix this one: "Walking to school, the rain started."',
    back: 'A modifier that doesn\'t logically connect to anything in the sentence. Was the rain walking? Fix by rewriting so the subject after the comma is what the modifier describes: "Walking to school, I felt the rain start." Now "I" am the one walking.',
  },
  {
    id: 'gram-4',
    topic: 'Grammar',
    front: 'What is PARALLELISM? Fix this: "She likes reading, writing, and to edit."',
    back: 'Items in a series must share grammatical form. "Reading" and "writing" are -ing nouns; "to edit" is an infinitive. Fix: "She likes reading, writing, and editing." All three are -ing forms now. Always scan lists for non-matching forms.',
  },
  {
    id: 'gram-5',
    topic: 'Grammar',
    front: 'What\'s a SENTENCE FRAGMENT? Why is "Because she was late." a fragment?',
    back: 'A group of words missing either a subject, a verb, or a complete thought. "Because she was late" has both subject (she) and verb (was) but is an incomplete thought — the word "because" makes you wait for the consequence. Fix: "Because she was late, we left without her."',
  },
  {
    id: 'gram-6',
    topic: 'Grammar',
    front: 'Name the four sentence types.',
    back: 'SIMPLE = one independent clause ("She studied."). COMPOUND = two independent clauses joined by a conjunction or semicolon ("She studied, and she passed."). COMPLEX = one independent + one dependent clause ("Because she studied, she passed."). COMPOUND-COMPLEX = two+ independent + one+ dependent ("Because she studied, she passed, and her parents celebrated.").',
  },

  // === Vocabulary in Context ===
  {
    id: 'vocab-1',
    topic: 'Vocabulary',
    front: 'What does the root TELE mean? List three words using it.',
    back: 'TELE means "far" or "distant." Examples: TELEphone (sound from far), TELEvision (vision from far), TELEscope (look at far things), TELEpathy (feeling from far). Knowing the root lets you guess the meaning of unfamiliar TELE- words.',
  },
  {
    id: 'vocab-2',
    topic: 'Vocabulary',
    front: 'What does PHOTO mean? Give three words.',
    back: 'PHOTO means "light." PHOTOgraph (writing with light), PHOTOsynthesis (making with light — how plants use sunlight), PHOTOphobia (fear of light).',
  },
  {
    id: 'vocab-3',
    topic: 'Vocabulary',
    front: 'List five common Greek/Latin roots and one word for each.',
    back: 'BIO (life) → BIOlogy. GEO (earth) → GEOgraphy. CHRONO (time) → CHRONOlogical. SCRIB/SCRIPT (write) → manuSCRIPT. DICT (speak) → DICTionary. PORT (carry) → PORTable. Memorize these — they unlock dozens of vocabulary words.',
  },
  {
    id: 'vocab-4',
    topic: 'Vocabulary',
    front: 'What\'s the difference between DENOTATION and CONNOTATION?',
    back: 'DENOTATION is the dictionary meaning. CONNOTATION is the emotional baggage. "Childlike" and "childish" share a denotation (relating to a child) but differ in connotation — childlike is innocent and pure; childish is immature and annoying.',
  },
  {
    id: 'vocab-5',
    topic: 'Vocabulary',
    front: 'Name four types of CONTEXT CLUES.',
    back: 'DEFINITION ("Stoic, MEANING unaffected by emotion"). EXAMPLE ("Carnivores LIKE lions and wolves"). CONTRAST ("UNLIKE her gregarious sister, Mara was reserved"). INFERENCE (figure it out from the situation). On the EOCEP, look for these signal words.',
  },

  // === Writing — Argumentative & Informational ===
  {
    id: 'write-1',
    topic: 'Writing',
    front: 'What makes a STRONG THESIS STATEMENT?',
    back: 'Three things: (1) ARGUABLE — somebody could disagree with you. (2) SPECIFIC — names the topic AND your stance. (3) Often previews REASONS. Weak: "Schools are important." Strong: "SC schools should start at 8:30 AM because of adolescent sleep cycles, academic performance, and traffic safety."',
  },
  {
    id: 'write-2',
    topic: 'Writing',
    front: 'What\'s the structure of a strong argumentative essay?',
    back: 'INTRO (hook + context + thesis) → BODY PARAGRAPHS (each starting with a topic sentence, then evidence and analysis) → COUNTERCLAIM paragraph (name the opposing view, then rebut it) → CONCLUSION (restate thesis in new words; "so what?" implications).',
  },
  {
    id: 'write-3',
    topic: 'Writing',
    front: 'How do you integrate a quote smoothly into your writing?',
    back: 'Use a SIGNAL PHRASE that names the source and a verb that fits the source\'s purpose: "Smith ARGUES that…" or "According to the CDC, …." Never drop a quote in cold — always introduce it. Then explain/analyze it afterward; don\'t leave it to speak for itself.',
  },

  // === Research & Citation ===
  {
    id: 'res-1',
    topic: 'Research',
    front: 'PRIMARY vs. SECONDARY source — give two examples of each.',
    back: 'PRIMARY (firsthand): a diary entry, an interview transcript, an original lab report, a Supreme Court ruling, a photograph from the event. SECONDARY (analysis or summary): a textbook, an encyclopedia article, a news article ABOUT the event, a biography written years later.',
  },
  {
    id: 'res-2',
    topic: 'Research',
    front: 'What\'s the difference between QUOTING, PARAPHRASING, and SUMMARIZING?',
    back: 'QUOTE: the exact words, in quotation marks, with a citation. PARAPHRASE: someone else\'s idea in YOUR words, roughly the same length, still cited. SUMMARY: someone else\'s idea in your words, much SHORTER, still cited. All three require a citation — only quoting uses quote marks.',
  },
  {
    id: 'res-3',
    topic: 'Research',
    front: 'What does the CRAAP test check?',
    back: 'A source\'s credibility on five dimensions: CURRENCY (recent enough?), RELEVANCE (matches your topic and audience?), AUTHORITY (who\'s the author? what credentials?), ACCURACY (verifiable claims? typo-riddled?), PURPOSE (informing vs. selling vs. propagandizing?). Use it before citing anything from the web.',
  },
  {
    id: 'res-4',
    topic: 'Research',
    front: 'What\'s the MLA in-text citation format for a book quote?',
    back: '(Author\'s Last Name Page#) — no comma between them. "Adolescents need 8–10 hours of sleep" (Smith 47). If you name the author in the sentence, you only need the page: According to Smith, adolescents need 8–10 hours of sleep (47).',
  },

  // === Editing & Revision ===
  {
    id: 'edit-1',
    topic: 'Editing',
    front: 'What\'s the difference between REVISING and EDITING?',
    back: 'REVISING is big-picture: reorganize paragraphs, sharpen the thesis, cut whole sections, add evidence. EDITING is fine-tuning: fix grammar, spelling, word choice, punctuation. ALWAYS revise first, edit last — don\'t polish a sentence you might delete.',
  },
  {
    id: 'edit-2',
    topic: 'Editing',
    front: 'How do you tighten a wordy sentence?',
    back: 'Cut redundancies ("end RESULT" → "result"; "12 AM AT NIGHT" → "12 AM"). Cut filler ("really very" → "very"). Replace wordy phrases ("DUE TO THE FACT THAT" → "because"). Prefer ACTIVE voice over passive when the doer matters. Goal: same meaning, fewer words.',
  },
  {
    id: 'edit-3',
    topic: 'Editing',
    front: 'When should you use PASSIVE voice on purpose?',
    back: 'When the DOER is unknown ("The window was broken sometime overnight"), UNIMPORTANT ("The samples were heated to 60°C"), or DELIBERATELY HIDDEN ("Mistakes were made"). Otherwise prefer active voice — it\'s more direct and easier to read.',
  },
];
