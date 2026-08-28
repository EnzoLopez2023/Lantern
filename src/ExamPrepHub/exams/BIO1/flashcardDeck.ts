// Flashcard deck for BIO1 — Biology 1.
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Cell Structure & Function ===
  {
    id: 'cell-1',
    topic: 'Cell Structure & Function',
    front: 'What is the main difference between a prokaryote and a eukaryote?',
    back: 'Eukaryotes have a MEMBRANE-BOUND NUCLEUS and membrane-bound organelles; prokaryotes do not. Prokaryotes (bacteria, archaea) are smaller and simpler. Eukaryotes include plants, animals, fungi, and protists.',
  },
  {
    id: 'cell-2',
    topic: 'Cell Structure & Function',
    front: 'What is the function of the mitochondria?',
    back: 'The mitochondria is the "powerhouse" of the cell — site of cellular respiration. Converts glucose and oxygen into ATP (energy). Found in nearly all eukaryotic cells. Has its own DNA and a double membrane.',
  },
  {
    id: 'cell-3',
    topic: 'Cell Structure & Function',
    front: 'What is the function of the chloroplast?',
    back: 'The chloroplast is where photosynthesis happens. Found only in plant cells and algae. Contains chlorophyll, the green pigment that absorbs sunlight to make glucose from CO₂ and H₂O.',
  },
  {
    id: 'cell-4',
    topic: 'Cell Structure & Function',
    front: 'Name three organelles found in PLANT cells but NOT in animal cells.',
    back: '(1) Cell wall (made of cellulose, gives shape), (2) Chloroplast (for photosynthesis), and (3) Large central vacuole (stores water, gives turgor pressure). Animal cells lack all three.',
  },
  {
    id: 'cell-5',
    topic: 'Cell Structure & Function',
    front: 'What is the difference between diffusion and osmosis?',
    back: 'Both are passive (no energy). DIFFUSION is the movement of any particles from high to low concentration. OSMOSIS is specifically the diffusion of WATER across a selectively permeable membrane.',
  },
  {
    id: 'cell-6',
    topic: 'Cell Structure & Function',
    front: 'What happens to a cell placed in a HYPOTONIC solution?',
    back: 'Water rushes IN because the solution outside has less solute (more water) than the cell. Animal cells swell and may burst (lyse). Plant cells become turgid — the cell wall prevents bursting.',
  },
  {
    id: 'cell-7',
    topic: 'Cell Structure & Function',
    front: 'What makes active transport different from diffusion?',
    back: 'Active transport moves particles AGAINST their concentration gradient (low to high) and REQUIRES ATP energy. Diffusion is passive and moves particles down their gradient (no energy needed).',
  },

  // === Cell Energy ===
  {
    id: 'energy-1',
    topic: 'Cell Energy',
    front: 'Write the balanced equation for photosynthesis.',
    back: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Plants take in carbon dioxide and water and use sunlight to make glucose and oxygen. Happens in the chloroplast.',
  },
  {
    id: 'energy-2',
    topic: 'Cell Energy',
    front: 'Write the balanced equation for cellular respiration.',
    back: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP. Cells break down glucose using oxygen to release energy (ATP). It is the reverse of photosynthesis.',
  },
  {
    id: 'energy-3',
    topic: 'Cell Energy',
    front: 'What are the three stages of cellular respiration, and where does each happen?',
    back: '(1) Glycolysis — in the cytoplasm. (2) Krebs cycle (citric acid cycle) — in the mitochondrial matrix. (3) Electron transport chain — on the inner mitochondrial membrane. Together they produce ~36–38 ATP per glucose.',
  },
  {
    id: 'energy-4',
    topic: 'Cell Energy',
    front: 'What is ATP and why is it important?',
    back: 'ATP (adenosine triphosphate) is the energy currency of the cell. When its third phosphate bond is broken, energy is released to power cellular work — muscle contraction, active transport, protein synthesis, etc.',
  },
  {
    id: 'energy-5',
    topic: 'Cell Energy',
    front: 'What is fermentation and when does it happen?',
    back: 'Fermentation is anaerobic respiration — happens when oxygen is unavailable. After glycolysis, cells switch to fermentation to regenerate NAD⁺. Yeast makes ethanol; muscle cells make lactic acid. Only 2 ATP per glucose.',
  },

  // === Cell Division & Reproduction ===
  {
    id: 'div-1',
    topic: 'Cell Division & Reproduction',
    front: 'List the phases of mitosis in order.',
    back: 'PMAT: Prophase, Metaphase, Anaphase, Telophase. (Then cytokinesis splits the cell.) Memory aid: "Please Make Another Three." Or "P-M-A-T-C" — Prepares, Middle, Apart, Two-nuclei, Cytokinesis.',
  },
  {
    id: 'div-2',
    topic: 'Cell Division & Reproduction',
    front: 'How does meiosis differ from mitosis?',
    back: 'Mitosis: one division, two IDENTICAL diploid daughter cells. Used for growth and repair. Meiosis: two divisions, four GENETICALLY UNIQUE haploid gametes. Used for sexual reproduction.',
  },
  {
    id: 'div-3',
    topic: 'Cell Division & Reproduction',
    front: 'What is the difference between haploid and diploid?',
    back: 'Diploid (2n) cells have TWO sets of chromosomes — one from each parent. Body cells are diploid (humans: 46). Haploid (n) cells have ONE set — gametes (sperm, egg). In humans, n = 23.',
  },
  {
    id: 'div-4',
    topic: 'Cell Division & Reproduction',
    front: 'What happens during fertilization?',
    back: 'A haploid sperm (n) fuses with a haploid egg (n) to form a diploid zygote (2n). The full chromosome count is restored, and the zygote contains genetic material from both parents.',
  },
  {
    id: 'div-5',
    topic: 'Cell Division & Reproduction',
    front: 'What is asexual reproduction? Give an example.',
    back: 'Reproduction involving only ONE parent. Offspring are genetically IDENTICAL to the parent (clones). Examples: bacteria dividing (binary fission), plants making runners, hydra budding. No gametes needed.',
  },

  // === Genetics & Heredity ===
  {
    id: 'gen-1',
    topic: 'Genetics & Heredity',
    front: 'What is the difference between genotype and phenotype?',
    back: 'GENOTYPE is the genetic combination (the letters: TT, Tt, tt). PHENOTYPE is the observable trait that results (tall vs. short). Same phenotype can come from different genotypes (TT and Tt both look tall).',
  },
  {
    id: 'gen-2',
    topic: 'Genetics & Heredity',
    front: 'Cross Tt × Tt — what are the genotype and phenotype ratios?',
    back: 'Genotype ratio: 1 TT : 2 Tt : 1 tt. Phenotype ratio: 3 dominant (tall) : 1 recessive (short). So 75% of offspring show the dominant trait, 25% show the recessive trait.',
  },
  {
    id: 'gen-3',
    topic: 'Genetics & Heredity',
    front: 'What is the difference between homozygous and heterozygous?',
    back: 'Homozygous: two IDENTICAL alleles (TT or tt). Also called "purebred." Heterozygous: two DIFFERENT alleles (Tt). Also called "hybrid" — shows the dominant phenotype but carries the recessive allele.',
  },
  {
    id: 'gen-4',
    topic: 'Genetics & Heredity',
    front: 'What is codominance? Give an example.',
    back: 'Both alleles are FULLY expressed in the heterozygote — neither dominates. Example: a red-and-white speckled flower from red × white parents. Or a person with AB blood type, who expresses both A and B antigens.',
  },
  {
    id: 'gen-5',
    topic: 'Genetics & Heredity',
    front: 'What is incomplete dominance? Give an example.',
    back: 'The heterozygote shows a BLENDED phenotype between the two homozygotes. Example: a red snapdragon × white snapdragon gives PINK offspring (mid-way between red and white).',
  },
  {
    id: 'gen-6',
    topic: 'Genetics & Heredity',
    front: 'Why do males show more sex-linked recessive traits than females?',
    back: 'Males have only ONE X chromosome (XY), so a single recessive allele on it shows the trait. Females have TWO Xs (XX) — they need BOTH copies recessive to show the trait. So color blindness, hemophilia, etc. appear more often in males.',
  },

  // === DNA & Protein Synthesis ===
  {
    id: 'dna-1',
    topic: 'DNA & Protein Synthesis',
    front: 'What are the four bases of DNA? Which pair with which?',
    back: 'A (adenine), T (thymine), G (guanine), C (cytosine). A pairs with T (2 hydrogen bonds), G pairs with C (3 hydrogen bonds). The base-pairing rule is what allows DNA to be copied accurately.',
  },
  {
    id: 'dna-2',
    topic: 'DNA & Protein Synthesis',
    front: 'What is the shape of DNA, and who discovered it?',
    back: 'DNA is a DOUBLE HELIX — two strands of nucleotides wound around each other like a twisted ladder. Discovered by James Watson and Francis Crick in 1953, using Rosalind Franklin\'s X-ray diffraction images.',
  },
  {
    id: 'dna-3',
    topic: 'DNA & Protein Synthesis',
    front: 'What happens during DNA replication?',
    back: 'The double helix unwinds and each strand serves as a template. Free nucleotides pair to each template strand using base-pairing rules. Result: TWO identical DNA molecules, each with one old strand and one new strand (semiconservative).',
  },
  {
    id: 'dna-4',
    topic: 'DNA & Protein Synthesis',
    front: 'What is the central dogma of biology?',
    back: 'DNA → RNA → Protein. DNA is transcribed into mRNA in the nucleus (transcription). mRNA travels to the ribosome and is translated into a protein (translation).',
  },
  {
    id: 'dna-5',
    topic: 'DNA & Protein Synthesis',
    front: 'Where does transcription happen, and where does translation happen?',
    back: 'TRANSCRIPTION (DNA → mRNA) happens in the NUCLEUS. TRANSLATION (mRNA → protein) happens at the RIBOSOME in the cytoplasm (or on the rough ER). mRNA carries the message between them.',
  },
  {
    id: 'dna-6',
    topic: 'DNA & Protein Synthesis',
    front: 'What is a codon?',
    back: 'A codon is a sequence of THREE mRNA bases that codes for one amino acid (or a stop signal). There are 64 codons total, coding for 20 amino acids. AUG is the start codon; UAA, UAG, UGA are stop codons.',
  },
  {
    id: 'dna-7',
    topic: 'DNA & Protein Synthesis',
    front: 'What is a frameshift mutation?',
    back: 'An insertion or deletion of bases that is NOT a multiple of three. Shifts the reading frame, changing EVERY codon downstream. Usually devastating — produces a completely different (and often non-functional) protein.',
  },

  // === Evolution & Natural Selection ===
  {
    id: 'evo-1',
    topic: 'Evolution & Natural Selection',
    front: 'Who proposed the theory of evolution by natural selection?',
    back: 'Charles Darwin. He published "On the Origin of Species" in 1859 after his voyage on HMS Beagle (especially observations in the Galápagos Islands). Alfred Russel Wallace independently arrived at the same idea.',
  },
  {
    id: 'evo-2',
    topic: 'Evolution & Natural Selection',
    front: 'What are the four conditions required for natural selection?',
    back: '(1) Variation among individuals, (2) Heritability — traits passed to offspring, (3) Differential survival/reproduction based on traits, (4) Time (many generations). If all four hold, the population evolves.',
  },
  {
    id: 'evo-3',
    topic: 'Evolution & Natural Selection',
    front: 'What is the difference between homologous and analogous structures?',
    back: 'HOMOLOGOUS structures have the same underlying anatomy (inherited from a common ancestor) but may have different functions. Example: human arm, whale flipper, bat wing. ANALOGOUS structures have similar function but different anatomy — no common ancestor. Example: bird wing vs. insect wing.',
  },
  {
    id: 'evo-4',
    topic: 'Evolution & Natural Selection',
    front: 'What does "fitness" mean in evolutionary biology?',
    back: 'Fitness is the ability to survive AND reproduce — to pass genes to the next generation. NOT physical strength or gym fitness. A small bird that produces many chicks has higher fitness than a strong bird that produces none.',
  },
  {
    id: 'evo-5',
    topic: 'Evolution & Natural Selection',
    front: 'Name three lines of evidence for evolution.',
    back: '(1) Fossil record — shows organisms changing over time. (2) Anatomical homologies — shared body plans like vertebrate limbs. (3) Molecular evidence — similar DNA and proteins across species. Also embryology (similar early embryos) and biogeography (geographic distribution).',
  },

  // === Ecology & Ecosystems ===
  {
    id: 'eco-1',
    topic: 'Ecology & Ecosystems',
    front: 'What is the 10% rule in an energy pyramid?',
    back: 'About 10% of the energy stored at one trophic level is transferred to the next. The other 90% is lost as heat, used in metabolism, or remains undigested. This is why food chains rarely have more than 4–5 levels.',
  },
  {
    id: 'eco-2',
    topic: 'Ecology & Ecosystems',
    front: 'What is the difference between biotic and abiotic factors?',
    back: 'BIOTIC factors are LIVING components of an ecosystem (plants, animals, bacteria, fungi). ABIOTIC factors are NONLIVING components (water, sunlight, temperature, soil, oxygen). Both shape an ecosystem.',
  },
  {
    id: 'eco-3',
    topic: 'Ecology & Ecosystems',
    front: 'Define mutualism, commensalism, and parasitism.',
    back: 'Three types of symbiosis. MUTUALISM: both species benefit (bee + flower). COMMENSALISM: one benefits, the other is unaffected (barnacles on a whale). PARASITISM: one benefits, the other is HARMED (tick on a deer).',
  },
  {
    id: 'eco-4',
    topic: 'Ecology & Ecosystems',
    front: 'What is the role of decomposers in an ecosystem?',
    back: 'Decomposers (bacteria, fungi) break down dead organisms and waste, returning nutrients (carbon, nitrogen, phosphorus) to the soil so producers can reuse them. Without decomposers, ecosystems would run out of available nutrients.',
  },
  {
    id: 'eco-5',
    topic: 'Ecology & Ecosystems',
    front: 'Describe the carbon cycle in two sentences.',
    back: 'Producers take in CO₂ from the atmosphere through photosynthesis and convert it into organic compounds. CO₂ returns to the atmosphere through respiration, decomposition, and combustion of fossil fuels.',
  },
  {
    id: 'eco-6',
    topic: 'Ecology & Ecosystems',
    front: 'What is ecological succession?',
    back: 'The gradual change in species composition of an ecosystem over time. PRIMARY succession starts from bare rock (like after a volcanic eruption). SECONDARY succession follows a disturbance where soil remains (like after a forest fire).',
  },

  // === Classification & Biodiversity ===
  {
    id: 'tax-1',
    topic: 'Classification & Biodiversity',
    front: 'List the levels of taxonomy from broadest to most specific.',
    back: 'Domain → Kingdom → Phylum → Class → Order → Family → Genus → Species. Memory aid: "Dear King Philip Came Over For Good Soup."',
  },
  {
    id: 'tax-2',
    topic: 'Classification & Biodiversity',
    front: 'What are the three domains of life?',
    back: 'Bacteria, Archaea, and Eukarya. Bacteria and Archaea are both prokaryotic but biochemically very different. Eukarya includes all eukaryotes: protists, fungi, plants, and animals.',
  },
  {
    id: 'tax-3',
    topic: 'Classification & Biodiversity',
    front: 'What is binomial nomenclature?',
    back: 'The two-word naming system for species. The first word is the GENUS (capitalized), the second is the SPECIES (lowercase). Both are italicized or underlined. Example: Homo sapiens, Canis lupus, Escherichia coli.',
  },
  {
    id: 'tax-4',
    topic: 'Classification & Biodiversity',
    front: 'What are the six kingdoms of life?',
    back: 'Archaebacteria, Eubacteria, Protista, Fungi, Plantae, Animalia. The first two are prokaryotic; the other four are eukaryotic. Some textbooks combine Archae/Eubacteria into "Monera" for a five-kingdom system.',
  },
  {
    id: 'tax-5',
    topic: 'Classification & Biodiversity',
    front: 'What is a dichotomous key?',
    back: 'An identification tool with pairs of choices at each step. "Dichotomous" means "branching in two." Follow the choice that matches your specimen and you arrive at its identity. Used to identify unknown organisms.',
  },
  {
    id: 'tax-6',
    topic: 'Classification & Biodiversity',
    front: 'What are the seven characteristics of life?',
    back: '(1) Made of cells, (2) Reproduce, (3) Respond to stimuli, (4) Grow and develop, (5) Use energy (metabolism), (6) Maintain homeostasis, (7) Evolve over generations. All living things share these features.',
  },

  // === Homeostasis & Body Systems ===
  {
    id: 'homeo-1',
    topic: 'Homeostasis & Body Systems',
    front: 'What is homeostasis? Give an example.',
    back: 'The maintenance of stable internal conditions despite environmental changes. Example: when body temperature rises, you sweat and blood vessels dilate to lose heat — returning to ~37°C. Other examples: blood glucose, blood pH, hydration.',
  },
  {
    id: 'homeo-2',
    topic: 'Homeostasis & Body Systems',
    front: 'What is the difference between negative and positive feedback?',
    back: 'NEGATIVE feedback REVERSES the change (most common — thermoregulation, glucose control). POSITIVE feedback AMPLIFIES the change (rare — childbirth contractions, blood clotting). Negative feedback keeps things stable; positive feedback drives things to completion.',
  },
  {
    id: 'homeo-3',
    topic: 'Homeostasis & Body Systems',
    front: 'List the levels of biological organization from smallest to largest.',
    back: 'Atom → molecule → organelle → CELL → TISSUE → ORGAN → ORGAN SYSTEM → ORGANISM → population → community → ecosystem → biosphere. Each level emerges from the one below it.',
  },

  // === Scientific Inquiry & Lab Skills ===
  {
    id: 'inq-1',
    topic: 'Scientific Inquiry & Lab Skills',
    front: 'What is the difference between a hypothesis, a theory, and a law?',
    back: 'HYPOTHESIS: a testable, falsifiable explanation for a single observation. THEORY: a well-supported, broad explanation integrating many observations and hypotheses (cell theory, evolution). LAW: a statement of a pattern in nature, often mathematical (law of gravity). Theories do NOT "become" laws — they are different things.',
  },
  {
    id: 'inq-2',
    topic: 'Scientific Inquiry & Lab Skills',
    front: 'What is the difference between independent and dependent variables?',
    back: 'INDEPENDENT variable: what the experimenter CHANGES on purpose (x-axis). DEPENDENT variable: what is MEASURED in response (y-axis). The dependent variable depends on the independent one. Example: independent = light intensity; dependent = plant growth rate.',
  },
  {
    id: 'inq-3',
    topic: 'Scientific Inquiry & Lab Skills',
    front: 'What is the difference between a control variable and a control group?',
    back: 'CONTROL VARIABLE: a factor kept CONSTANT across all experimental groups (same soil, same water amount). CONTROL GROUP: the group that does NOT receive the experimental treatment — used as a baseline for comparison.',
  },
];
