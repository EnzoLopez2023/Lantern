// Glossary for ENG3 — English Language Arts 3 (11th grade SC).
// Terms covering literary analysis, rhetoric, grammar, and research writing.

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [

  // ── Reading Literature ────────────────────────────────────────────
  { term: 'Freytag\'s Pyramid', definition: 'A five-stage narrative structure: Exposition (background), Rising Action (conflict builds), Climax (peak tension), Falling Action (consequences), Resolution (conclusion). Applies to most stories regardless of genre.' },
  { term: 'Point of view', definition: 'The perspective from which a story is narrated. First person uses "I" and is a character. Third-person limited stays inside one character\'s head. Third-person omniscient knows all characters\' thoughts. Second person uses "you" and is rare.' },
  { term: 'Tone', definition: 'The author\'s attitude toward the subject or audience — communicated through word choice, sentence structure, and selection of detail. Examples: sardonic, reverent, melancholic, playful. Tone belongs to the author; mood belongs to the reader.' },
  { term: 'Mood', definition: 'The emotional atmosphere a text creates in the reader — the feeling a piece evokes. A Gothic horror story might have a mood of dread. A romantic comedy creates lightness. Mood is crafted through setting, imagery, and diction.' },
  { term: 'Theme', definition: 'The central idea or insight about human experience that a literary work explores. Not the same as subject (subject = war; theme = "War destroys the humanity of combatants"). Themes are expressed as full statements, not just nouns. A work can have multiple themes.' },
  { term: 'Dynamic character', definition: 'A character who undergoes significant internal change as a result of the story\'s events. The protagonist in a coming-of-age story is classically dynamic — they start one way and end changed.' },
  { term: 'Static character', definition: 'A character who remains essentially unchanged throughout the story. Static does not mean unimportant — some supporting characters are intentionally static to provide contrast or stability against the protagonist\'s change.' },
  { term: 'Foil', definition: 'A character whose traits contrast with and highlight those of another character, usually the protagonist. Laertes is Hamlet\'s foil — both lose their fathers, but one acts immediately while the other delays.' },
  { term: 'Volta', definition: 'The "turn" in a poem — a shift in thought, emotion, or direction. Common in sonnets: the octave (first 8 lines) presents a problem; the volta leads into the sestet (last 6 lines) that responds or resolves. Often signaled by "but," "yet," or "however."' },
  { term: 'Iambic pentameter', definition: 'A meter consisting of five iambs per line (da-DUM × 5 = 10 syllables). An iamb is one unstressed syllable followed by one stressed syllable. Used extensively in Shakespeare\'s plays and sonnets.' },
  { term: 'Enjambment', definition: 'The continuation of a sentence or phrase from one line of poetry to the next without punctuation. Creates forward momentum and can delay or surprise. Opposite of end-stopping (line that ends with punctuation).' },
  { term: 'Epistolary', definition: 'A narrative form told through letters, diary entries, or other documents written by characters. Creates intimacy and multiple limited perspectives. Examples: Dracula (Bram Stoker), The Color Purple (Alice Walker).' },
  { term: 'In medias res', definition: 'Latin for "in the middle of things." Beginning a narrative in the middle of the action rather than at the chronological start. Creates immediate engagement; backstory is filled in through flashbacks or exposition.' },

  // ── Literary Devices & Craft ──────────────────────────────────────
  { term: 'Metaphor', definition: 'A direct comparison stating one thing IS another without using "like" or "as." "Life is a journey." Metaphors create meaning by mapping qualities of one thing onto another. An extended metaphor sustains the comparison throughout a work.' },
  { term: 'Simile', definition: 'A comparison using "like" or "as." "Her voice was like honey." Similes signal the comparison explicitly; metaphors state it as fact. Both create vivid imagery and illuminate abstract qualities through concrete comparisons.' },
  { term: 'Personification', definition: 'Giving human qualities to non-human things. "The wind whispered." "Justice is blind." "The sun smiled down." Creates emotional resonance and makes abstract concepts or natural forces more relatable.' },
  { term: 'Hyperbole', definition: 'Deliberate, dramatic exaggeration not meant literally. "I\'ve told you a million times." Used for emphasis, humor, or emotional effect. The opposite is understatement (litotes) — minimizing something to make a point.' },
  { term: 'Oxymoron', definition: 'A figure of speech combining two contradictory terms for effect. "Deafening silence." "Bittersweet." "Living death." Creates a compressed paradox that forces the reader to reconcile opposing ideas.' },
  { term: 'Alliteration', definition: 'Repetition of the same initial consonant sound in closely spaced words. "Peter Piper picked a peck of pickled peppers." Creates musicality, emphasis, and memorability. A sound device.' },
  { term: 'Assonance', definition: 'Repetition of similar vowel sounds in nearby words. "The rain in Spain stays mainly in the plain." Creates internal rhyme and musicality without full rhyme. A sound device.' },
  { term: 'Onomatopoeia', definition: 'Words that sound like what they describe. Buzz, crack, hiss, sizzle, murmur, clang. Creates sensory immediacy and rhythm in poetry and prose. A sound device.' },
  { term: 'Allusion', definition: 'An indirect reference to a well-known person, event, work, or myth, relying on shared cultural knowledge to add meaning. "He had a Midas touch" alludes to the Greek myth of King Midas.' },
  { term: 'Allegory', definition: 'An extended narrative in which characters, events, and settings represent abstract ideas on a second level throughout the entire work. Animal Farm allegorizes Soviet Russia; Lord of the Flies allegorizes civilization vs. savagery.' },
  { term: 'Symbol', definition: 'A concrete object, person, place, or event that represents an abstract idea. The green light in The Great Gatsby represents Gatsby\'s dreams. Unlike allegory, individual symbols don\'t define the whole narrative structure.' },
  { term: 'Irony', definition: 'The gap between appearance and reality, or between what is said and what is meant. Three types: verbal (saying the opposite of what you mean), situational (events are the opposite of what\'s expected), dramatic (the audience knows what a character doesn\'t).' },
  { term: 'Foreshadowing', definition: 'Hints or clues about future events, building anticipation or dread. When readers revisit a foreshadowed moment, they understand it was planted earlier. Works best when subtle — obvious foreshadowing feels like a spoiler.' },
  { term: 'Anaphora', definition: 'Repetition of a word or phrase at the beginning of successive clauses for emphasis and rhythm. "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields…" Creates a cumulative, rhetorical effect.' },
  { term: 'Chiasmus', definition: 'Reversal of grammatical structure in successive phrases (A-B | B-A). "Ask not what your country can do for you — ask what you can do for your country." Creates balance and memorability by mirroring ideas in reverse.' },

  // ── Argument & Rhetoric ───────────────────────────────────────────
  { term: 'Ethos', definition: 'Aristotle\'s appeal to the credibility and authority of the speaker or author. "Trust me because I am qualified, experienced, or trustworthy." Established through credentials, tone, fair treatment of opponents, and demonstrated knowledge.' },
  { term: 'Pathos', definition: 'Aristotle\'s appeal to the emotions of the audience. Using vivid imagery, personal stories, or emotional language to create empathy, fear, compassion, or outrage. Effective but can become manipulative if used without logos.' },
  { term: 'Logos', definition: 'Aristotle\'s appeal to logic, reason, and evidence. Statistics, peer-reviewed studies, logical reasoning, expert findings. The backbone of academic argument. Without logos, an argument is merely persuasive in tone but not in substance.' },
  { term: 'Logical fallacy', definition: 'An error in reasoning that makes an argument invalid or weak, even if the conclusion happens to be true. Common fallacies: ad hominem, straw man, false dichotomy, slippery slope, hasty generalization, appeal to authority, circular reasoning, bandwagon.' },
  { term: 'Ad hominem', definition: 'Attacking the person making an argument rather than the argument itself. "You can\'t trust her opinion on economics — she failed math once." The attack may be true but is irrelevant to the argument\'s validity.' },
  { term: 'Straw man', definition: 'Misrepresenting an opponent\'s position as weaker than it actually is, then attacking the misrepresentation. Makes it look like you\'ve defeated their argument when you\'ve only defeated a distorted version of it.' },
  { term: 'Toulmin model', definition: 'A framework for analyzing arguments: Claim (what is being argued) + Data/Evidence + Warrant (the assumption linking data to claim) + Backing (support for warrant) + Qualifier (limits on claim) + Rebuttal (counterarguments). More nuanced than simple thesis-evidence structure.' },

  // ── Research Writing ──────────────────────────────────────────────
  { term: 'Plagiarism', definition: 'Presenting someone else\'s words or ideas as your own without attribution. Includes copying text verbatim, paraphrasing without citation, and submitting another\'s work as your own. Applies even to ideas — not just exact words.' },
  { term: 'Paraphrase', definition: 'Restating another\'s writing in your own words at approximately the same length, capturing specific details. Still requires citation. Different from summary (which condenses to main idea) and quotation (which uses exact words).' },
  { term: 'MLA format', definition: 'Modern Language Association citation style. Used in English and humanities. In-text citation: (Author LastName PageNumber) — no comma, no "p." Works Cited page at end with full source information. Double-spaced, 1-inch margins, 12pt font.' },
  { term: 'Signal phrase', definition: 'An introduction to quoted or paraphrased material that names the source and integrates the evidence smoothly. "According to Smith...", "As the CDC reports..." Signal phrases and in-text citations work together — one doesn\'t replace the other.' },
  { term: 'Annotated bibliography', definition: 'A list of sources that includes not just the citation but also a brief paragraph evaluating each source\'s content, credibility, and relevance to your research question. Used to demonstrate source evaluation skills.' },
];
