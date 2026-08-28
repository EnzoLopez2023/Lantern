// Question bank for CHEM — SC Chemistry (11th grade).
// ≥100 questions across 7 subdomains. All explanations ≥80 chars.

export type QuestionType = 'single' | 'multi' | 'ordering' | 'yesno';

export interface Question {
  id: string;
  domain: 1;
  subdomain: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  codeSnippet?: string;
  examTip?: string;
}

export const questions: Question[] = [

  // ══════════════════════════════════════════════════════════════
  // Matter & Measurement
  // ══════════════════════════════════════════════════════════════
  {
    id: 'mm-01', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'easy',
    question: 'Which of the following is a chemical change?',
    options: ['Melting ice', 'Dissolving salt in water', 'Burning wood', 'Tearing paper'],
    correctAnswers: [2],
    explanation: 'Burning wood is a chemical change — new substances form (CO₂, water vapor, ash) and the change is not easily reversible. Physical changes (melting, dissolving, tearing) alter form but not chemical identity.',
  },
  {
    id: 'mm-02', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'easy',
    question: 'What is the SI base unit for mass?',
    options: ['Gram (g)', 'Kilogram (kg)', 'Pound (lb)', 'Milligram (mg)'],
    correctAnswers: [1],
    explanation: 'The kilogram (kg) is the SI base unit for mass. The gram is derived (1 kg = 1,000 g). All other SI mass units are multiples or fractions of the kilogram.',
  },
  {
    id: 'mm-03', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'medium',
    question: 'How many significant figures are in 0.00307?',
    options: ['5', '6', '3', '2'],
    correctAnswers: [2],
    explanation: '0.00307 has 3 significant figures (3, 0, 7). Leading zeros are never significant — they only show place value. The zero between 3 and 7 IS significant because it\'s between significant figures. Trailing zeros after a decimal ARE significant.',
  },
  {
    id: 'mm-04', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'medium',
    question: 'A block has mass 42.5 g and volume 15.0 cm³. What is its density?',
    options: ['2.83 g/cm³', '637.5 g/cm³', '0.353 g/cm³', '57.5 g/cm³'],
    correctAnswers: [0],
    explanation: 'Density = mass/volume = 42.5 g / 15.0 cm³ = 2.83 g/cm³. Density is an intensive property — it identifies a substance regardless of how much is present. Water\'s density is 1.00 g/cm³; substances denser than water sink.',
  },
  {
    id: 'mm-05', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'easy',
    question: 'Which of the following is a homogeneous mixture?',
    options: ['Sand and water', 'Trail mix', 'Salt dissolved in water (saline solution)', 'Oil and water'],
    correctAnswers: [2],
    explanation: 'A homogeneous mixture (solution) has uniform composition throughout — you can\'t distinguish its parts visually. Salt water appears uniform at all points. Heterogeneous mixtures (sand in water, trail mix, oil/water) have visibly distinct components.',
  },
  {
    id: 'mm-06', domain: 1, subdomain: 'Matter & Measurement', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Temperature and density are intensive properties — they do not depend on the amount of substance.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Intensive properties (density, temperature, boiling point, color) are independent of amount. Extensive properties (mass, volume, length) depend on how much substance is present. A drop and an ocean of water both have the same density (1.00 g/cm³).',
  },
  {
    id: 'mm-07', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'medium',
    question: 'Convert 25.0°C to Kelvin.',
    options: ['298 K', '248 K', '-248 K', '25 K'],
    correctAnswers: [0],
    explanation: 'K = °C + 273.15 ≈ 25.0 + 273 = 298 K. The Kelvin scale starts at absolute zero (0 K = −273.15°C). Kelvin is required for all gas law calculations because ratios of temperatures only make physical sense in absolute (Kelvin) units.',
  },
  {
    id: 'mm-08', domain: 1, subdomain: 'Matter & Measurement', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are examples of pure substances? (Select all that apply)',
    options: ['Distilled water (H₂O)', 'Diamond (pure carbon)', 'Air', 'Table salt (NaCl)'],
    correctAnswers: [0, 1, 3],
    explanation: 'Pure substances have fixed composition and properties — elements (diamond, carbon) and compounds (H₂O, NaCl). Air is a mixture of N₂, O₂, CO₂, Ar, and other gases with variable composition.',
  },
  {
    id: 'mm-09', domain: 1, subdomain: 'Matter & Measurement', type: 'ordering', difficulty: 'medium',
    question: 'Order these metric prefixes from LARGEST to SMALLEST:',
    options: ['milli (m)', 'kilo (k)', 'micro (μ)', 'centi (c)'],
    correctAnswers: [1, 3, 0, 2],
    explanation: 'kilo = 10³, centi = 10⁻², milli = 10⁻³, micro = 10⁻⁶. So largest to smallest: kilo, centi, milli, micro.',
  },
  {
    id: 'mm-10', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'hard',
    question: 'Which measurement represents an accuracy error (systematic), not a precision error (random)?',
    options: ['Three measurements of 5.2, 5.3, and 5.1 mL for a true value of 5.2 mL', 'Three measurements of 6.8, 6.9, and 6.7 mL for a true value of 5.2 mL', 'Three measurements of 5.0, 6.0, and 4.0 mL for a true value of 5.2 mL', 'Three measurements of 5.2, 5.2, and 5.2 mL for a true value of 5.2 mL'],
    correctAnswers: [1],
    explanation: 'Accuracy = how close to the true value. Precision = reproducibility. The second set (6.8, 6.9, 6.7) is precise (clustered) but not accurate (far from 5.2) — this is systematic error (like an uncalibrated instrument). The third set is neither precise nor accurate.',
  },
  {
    id: 'mm-11', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'easy',
    question: 'Which phase of matter has definite volume but no definite shape?',
    options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
    correctAnswers: [1],
    explanation: 'Liquids have definite volume (molecules are close together, like solids) but take the shape of their container (molecules can flow). Solids have definite shape AND volume. Gases have neither definite shape nor volume.',
  },
  {
    id: 'mm-12', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'medium',
    question: 'Which separation technique is best for separating a mixture of sand and salt?',
    options: ['Distillation', 'Filtration (then evaporation)', 'Chromatography', 'Magnetic separation'],
    correctAnswers: [1],
    explanation: 'Dissolve the mixture in water (salt dissolves, sand doesn\'t). Filter to remove sand. Evaporate the water to recover the salt. This uses the different solubilities of the two components — a classic physical separation technique.',
  },
  {
    id: 'mm-13', domain: 1, subdomain: 'Matter & Measurement', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Scientific notation 6.022 × 10²³ represents 6.022 multiplied by 10 raised to the 23rd power.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: '6.022 × 10²³ = 602,200,000,000,000,000,000,000. This is Avogadro\'s number — the number of particles in one mole of substance. Scientific notation is essential for very large or very small numbers in chemistry.',
  },
  {
    id: 'mm-14', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'easy',
    question: 'What does the Law of Conservation of Mass state?',
    options: ['Mass can be created during a reaction but not destroyed', 'Mass is neither created nor destroyed in a chemical reaction — total mass of reactants equals total mass of products', 'Mass equals energy times the speed of light squared', 'Mass always decreases during combustion'],
    correctAnswers: [1],
    explanation: 'Conservation of mass (Lavoisier): total mass is conserved in chemical reactions. Atoms are rearranged, not created or destroyed. This is why equations must be balanced — same number of each type of atom on both sides.',
  },
  {
    id: 'mm-15', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'medium',
    question: 'Which property changes when you cut a piece of iron in half?',
    options: ['Melting point', 'Density', 'Mass', 'Chemical reactivity'],
    correctAnswers: [2],
    explanation: 'Cutting changes extensive properties (mass, volume, length) but not intensive properties (density, melting point, chemical reactivity). Mass decreases because you now have half as much iron.',
  },

  // ══════════════════════════════════════════════════════════════
  // Atomic Structure
  // ══════════════════════════════════════════════════════════════
  {
    id: 'at-01', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'easy',
    question: 'What is the atomic number of an element?',
    options: ['The number of neutrons in the nucleus', 'The number of protons in the nucleus', 'The total number of protons + neutrons', 'The number of electrons in the outer shell'],
    correctAnswers: [1],
    explanation: 'Atomic number (Z) = number of protons. It uniquely defines an element — all carbon atoms have 6 protons, all oxygen atoms have 8. The atomic number determines where an element sits on the periodic table.',
  },
  {
    id: 'at-02', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'easy',
    question: 'Two atoms of carbon-12 and carbon-14 are isotopes. What do they have in common?',
    options: ['Same number of neutrons', 'Same number of protons (6), different number of neutrons', 'Same mass number', 'Same number of electrons in all energy levels'],
    correctAnswers: [1],
    explanation: 'Isotopes of the same element have identical proton counts (same atomic number = same element) but different neutron counts (different mass numbers). Carbon-12 has 6 neutrons; carbon-14 has 8 neutrons. Both are carbon.',
  },
  {
    id: 'at-03', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'An atom of element X has 17 protons, 18 neutrons, and 17 electrons. What is its mass number?',
    options: ['17', '18', '35', '34'],
    correctAnswers: [2],
    explanation: 'Mass number = protons + neutrons = 17 + 18 = 35. (This is chlorine-35, ³⁵Cl.) The atomic number is 17 (protons only). For neutral atoms, electrons = protons; this atom is neutral since electrons = protons = 17.',
  },
  {
    id: 'at-04', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'What is the electron configuration of oxygen (Z = 8)?',
    options: ['1s² 2s² 2p²', '1s² 2s² 2p⁴', '1s² 2s⁶', '1s⁸'],
    correctAnswers: [1],
    explanation: 'Oxygen has 8 electrons. Fill in order: 1s² (2e), 2s² (2e), 2p⁴ (4e) = 8 total. The 2p subshell can hold 6 electrons but oxygen only has 4 in it. Oxygen\'s 6 valence electrons explain its -2 oxidation state in most compounds.',
  },
  {
    id: 'at-05', domain: 1, subdomain: 'Atomic Structure', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Most of the mass of an atom is concentrated in the nucleus.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Protons and neutrons (in the nucleus) account for virtually all atomic mass. Electrons are ~1/1836 the mass of a proton. Rutherford\'s gold foil experiment (1911) proved the nucleus contains nearly all the mass in a tiny, dense volume.',
  },
  {
    id: 'at-06', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'What did Rutherford\'s gold foil experiment demonstrate?',
    options: ['Atoms are indivisible', 'Atoms consist of electrons embedded in a positive sphere (plum pudding)', 'Atoms have a tiny, dense, positively charged nucleus with mostly empty space around it', 'Electrons orbit in fixed paths like planets'],
    correctAnswers: [2],
    explanation: 'Rutherford bombarded gold foil with alpha particles. Most passed through (atom is mostly empty), but a few deflected sharply — proving a tiny, dense, positive nucleus. This disproved Thomson\'s "plum pudding" model.',
  },
  {
    id: 'at-07', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'What is a "valence electron"?',
    options: ['An electron in the innermost energy level', 'An electron in the outermost energy level, involved in bonding', 'A proton in the nucleus', 'An electron that has been removed from the atom'],
    correctAnswers: [1],
    explanation: 'Valence electrons occupy the outermost occupied energy level. They determine chemical behavior — how atoms bond and react. Atoms tend to gain, lose, or share electrons to achieve 8 valence electrons (the octet rule).',
  },
  {
    id: 'at-08', domain: 1, subdomain: 'Atomic Structure', type: 'ordering', difficulty: 'medium',
    question: 'Order these atomic models from EARLIEST to LATEST historically:',
    options: ['Rutherford model (nuclear)', 'Dalton\'s model (indivisible spheres)', 'Bohr model (planetary orbits)', 'Quantum mechanical model (electron clouds)'],
    correctAnswers: [1, 0, 2, 3],
    explanation: 'Dalton (1803): solid spheres. Rutherford (1911): nuclear. Bohr (1913): planetary orbits. Quantum mechanical model (1920s, Schrödinger): electron probability clouds. Each model was revised as new evidence emerged.',
  },
  {
    id: 'at-09', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'hard',
    question: 'An element\'s average atomic mass is 35.45 amu. Two isotopes exist: ³⁵Cl (75%) and ³⁷Cl (25%). What does this calculation use?',
    options: ['Simple average of 35 and 37', 'Weighted average: (35 × 0.75) + (37 × 0.25)', 'The mass of the most common isotope only', 'The geometric mean of the two masses'],
    correctAnswers: [1],
    explanation: 'Average atomic mass = Σ (mass × fractional abundance) = (35 × 0.75) + (37 × 0.25) = 26.25 + 9.25 = 35.50. (Using the rounded 75 / 25 abundances given in the problem gives 35.50; the more precise real-world abundances 75.77% / 24.23% give the periodic table value 35.45 amu.)',
  },
  {
    id: 'at-10', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'Which subatomic particles are found in the nucleus?',
    options: ['Electrons and protons', 'Protons and neutrons', 'Electrons and neutrons', 'Protons only'],
    correctAnswers: [1],
    explanation: 'The nucleus contains protons (positive charge) and neutrons (no charge). Electrons occupy the space around the nucleus in energy levels. The strong nuclear force holds protons and neutrons together despite proton-proton repulsion.',
  },
  {
    id: 'at-11', domain: 1, subdomain: 'Atomic Structure', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Ions form when atoms gain or lose electrons, changing their charge.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Ions form when atoms gain electrons (becoming anions, negative) or lose electrons (becoming cations, positive). The proton count stays fixed — only electrons are transferred. Na⁺ loses 1 electron; Cl⁻ gains 1 electron.',
  },
  {
    id: 'at-12', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'Sodium (Na) has Z = 11. What is the electron configuration of Na⁺?',
    options: ['1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁶', '1s² 2s² 2p⁵', '1s² 2s² 2p⁶ 3s² 3p⁶'],
    correctAnswers: [1],
    explanation: 'Na has 11 electrons: 1s² 2s² 2p⁶ 3s¹. Na⁺ has lost 1 electron (10 electrons total): 1s² 2s² 2p⁶ — the same as neon. Cations form when atoms lose enough electrons to reach the noble gas configuration below them.',
  },
  {
    id: 'at-13', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'easy',
    question: 'What is the charge of a proton?',
    options: ['+1', '−1', '0', '+2'],
    correctAnswers: [0],
    explanation: 'Protons carry a charge of +1 (in elementary charge units). Electrons carry −1. Neutrons are neutral (0). The number of protons equals the number of electrons in a neutral atom, balancing the charge.',
  },

  // ══════════════════════════════════════════════════════════════
  // Periodic Table
  // ══════════════════════════════════════════════════════════════
  {
    id: 'pt-01', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'easy',
    question: 'Elements in the same GROUP (column) of the periodic table have:',
    options: ['Same number of protons', 'Same number of valence electrons', 'Same mass number', 'Same number of neutrons'],
    correctAnswers: [1],
    explanation: 'Elements in the same group share the same number of valence electrons, which gives them similar chemical properties. Group 1 (alkali metals) all have 1 valence electron. Group 17 (halogens) all have 7. This is the basis of the periodic law.',
  },
  {
    id: 'pt-02', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'medium',
    question: 'Moving left to right across a period, what happens to atomic radius?',
    options: ['Increases', 'Decreases', 'Stays the same', 'First increases, then decreases'],
    correctAnswers: [1],
    explanation: 'Across a period (left to right), more protons are added while electrons stay in the same shell. The greater nuclear charge pulls electrons closer, decreasing atomic radius. Down a group, each new period adds a new electron shell, increasing radius.',
  },
  {
    id: 'pt-03', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'medium',
    question: 'Which periodic table trend increases across a period and up a group?',
    options: ['Atomic radius', 'Electronegativity', 'Metallic character', 'Atomic mass'],
    correctAnswers: [1],
    explanation: 'Electronegativity (tendency to attract electrons in a bond) increases across periods (more protons pull more strongly) and decreases down groups (electrons are farther from the nucleus). Fluorine (top-right) is the most electronegative element.',
  },
  {
    id: 'pt-04', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'easy',
    question: 'Alkali metals (Group 1) are reactive because they:',
    options: ['Have 7 valence electrons and easily gain one more', 'Have 1 valence electron and easily lose it to form 1+ ions', 'Are non-metals', 'Have full outer electron shells'],
    correctAnswers: [1],
    explanation: 'Alkali metals (Li, Na, K, Rb, Cs, Fr) each have 1 valence electron. Losing this electron requires little energy and achieves the stable noble gas configuration. This makes them very reactive — they react violently with water and oxygen.',
  },
  {
    id: 'pt-05', domain: 1, subdomain: 'Periodic Table', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Noble gases (Group 18) are generally unreactive because they have full outer electron shells.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Noble gases (He, Ne, Ar, Kr, Xe, Rn) have 8 valence electrons (He has 2) — a completely filled outer shell. This stable configuration gives them very low chemical reactivity. They were historically called "inert gases."',
  },
  {
    id: 'pt-06', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'medium',
    question: 'First ionization energy generally increases across a period because:',
    options: ['Atomic mass increases', 'Increasing nuclear charge holds electrons more tightly, requiring more energy to remove them', 'The atom gets bigger', 'Valence electrons are added'],
    correctAnswers: [1],
    explanation: 'First ionization energy = energy to remove the first electron from a neutral gas-phase atom. Across a period, more protons pull electrons more tightly. Down a group, electrons are farther from the nucleus and easier to remove — ionization energy decreases.',
  },
  {
    id: 'pt-07', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'medium',
    question: 'Where are metalloids (semimetals) found on the periodic table?',
    options: ['Far left (Group 1-2)', 'Far right (Group 17-18)', 'Along the staircase between metals and nonmetals', 'Bottom two rows (lanthanides and actinides)'],
    correctAnswers: [2],
    explanation: 'Metalloids (B, Si, Ge, As, Sb, Te, Po, At) lie along a diagonal staircase between metals (left/bottom) and nonmetals (right/top). They have intermediate properties — semiconductors like silicon are critical for electronics.',
  },
  {
    id: 'pt-08', domain: 1, subdomain: 'Periodic Table', type: 'ordering', difficulty: 'medium',
    question: 'Order these elements from SMALLEST to LARGEST atomic radius:',
    options: ['Cesium (Cs)', 'Lithium (Li)', 'Sodium (Na)', 'Fluorine (F)'],
    correctAnswers: [3, 1, 2, 0],
    explanation: 'Radius increases down a group and left across a period. F is smallest (right side, period 2). Li is next (left, period 2). Na (period 3). Cs is largest (Group 1, period 6 — very bottom left).',
  },
  {
    id: 'pt-09', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'hard',
    question: 'Why does Cl (Z=17) form Cl⁻ ions but Na (Z=11) forms Na⁺ ions?',
    options: ['Cl has fewer electrons than Na', 'Cl needs to gain 1 electron to fill its shell; Na can lose 1 electron to expose its filled inner shell', 'Cl is a metal; Na is a nonmetal', 'They form the same type of ion'],
    correctAnswers: [1],
    explanation: 'Cl has 7 valence electrons — gaining 1 gives the stable 8-electron noble gas configuration (like Ar). Na has 1 valence electron — losing it exposes a full inner shell (like Ne). Each achieves an octet by the chemically easiest route.',
  },
  {
    id: 'pt-10', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'easy',
    question: 'Elements in the same period (row) of the periodic table have the same:',
    options: ['Number of valence electrons', 'Chemical properties', 'Highest occupied principal energy level (same period = same row = same n)', 'Number of neutrons'],
    correctAnswers: [2],
    explanation: 'Elements in the same period have their valence electrons in the same principal energy level (n). Period 2 elements (Li, Be, B, C, N, O, F, Ne) all have valence electrons in n=2. Moving right across the period fills that level.',
  },

  // ══════════════════════════════════════════════════════════════
  // Chemical Bonding
  // ══════════════════════════════════════════════════════════════
  {
    id: 'cb-01', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'easy',
    question: 'What type of bond forms between a metal and a nonmetal?',
    options: ['Covalent bond', 'Ionic bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswers: [1],
    explanation: 'Ionic bonds form between metals (which readily lose electrons to form cations) and nonmetals (which readily gain electrons to form anions). The electrostatic attraction between oppositely charged ions holds the compound together. Example: NaCl.',
  },
  {
    id: 'cb-02', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'easy',
    question: 'What is a covalent bond?',
    options: ['Transfer of electrons from metal to nonmetal', 'Sharing of electron pairs between atoms, typically between two nonmetals', 'Sea of delocalized electrons in a metal', 'Attraction between dipoles in adjacent molecules'],
    correctAnswers: [1],
    explanation: 'Covalent bonds form when atoms share electron pairs to achieve stable octets. Occur between nonmetals (H₂O, CO₂, CH₄). Sharing allows each atom to "count" the shared electrons as their own toward their octet.',
  },
  {
    id: 'cb-03', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'In the Lewis structure of water (H₂O), how many lone pairs does the oxygen atom have?',
    options: ['0', '1', '2', '3'],
    correctAnswers: [2],
    explanation: 'Oxygen has 6 valence electrons. In H₂O, it uses 2 of them to form bonds with the two H atoms (one electron per single bond from O\'s side). The remaining 4 electrons form 2 lone pairs on oxygen. These two lone pairs push the H–O–H angle to about 104.5°, giving water its bent shape and its strong polarity.',
  },
  {
    id: 'cb-04', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'A molecule has the formula BF₃. Using VSEPR theory, what is its shape?',
    options: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Bent'],
    correctAnswers: [1],
    explanation: 'B has 3 valence electrons, forms 3 bonds with F, and has no lone pairs. Three bonding regions around B → trigonal planar shape, bond angles 120°. No lone pairs means no distortion. BF₃ is an exception to the octet rule (only 6 electrons around B).',
  },
  {
    id: 'cb-05', domain: 1, subdomain: 'Chemical Bonding', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A polar covalent bond occurs when two atoms of different electronegativity share electrons unequally.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'When the electronegativity difference between two bonded atoms is significant (roughly 0.4–1.7), the more electronegative atom attracts more electron density, creating a partial negative charge (δ−) and leaving the less electronegative atom with a partial positive charge (δ+).',
  },
  {
    id: 'cb-06', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'What is the shape of CH₄ (methane) according to VSEPR theory?',
    options: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Bent'],
    correctAnswers: [2],
    explanation: 'C has 4 valence electrons, forms 4 single bonds with H, and has no lone pairs. Four bonding pairs repel equally → tetrahedral shape, bond angles 109.5°. Tetrahedral is the most common geometry in organic chemistry.',
  },
  {
    id: 'cb-07', domain: 1, subdomain: 'Chemical Bonding', type: 'ordering', difficulty: 'hard',
    question: 'Order these bonds from WEAKEST to STRONGEST:',
    options: ['Triple covalent bond (N≡N)', 'Single covalent bond (H-H)', 'Ionic bond (NaCl)', 'Double covalent bond (O=O)'],
    correctAnswers: [1, 3, 2, 0],
    explanation: 'Bond strength generally: single < double < triple for covalent bonds. Ionic bonds vary but are comparable to strong covalent bonds. H-H single bond (~432 kJ/mol), O=O double bond (~498 kJ/mol), N≡N triple bond (~945 kJ/mol) is the strongest.',
  },
  {
    id: 'cb-08', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'What determines the geometry of a molecule according to VSEPR theory?',
    options: ['Only the number of bonding pairs', 'The total number of electron pairs (bonding + lone pairs) around the central atom', 'The size of the central atom', 'The number of different elements present'],
    correctAnswers: [1],
    explanation: 'VSEPR (Valence Shell Electron Pair Repulsion): electron pairs (bonding AND lone pairs) repel each other and adopt the geometry that maximizes their separation. Lone pairs repel more strongly than bonding pairs, causing distortions from ideal geometry.',
  },
  {
    id: 'cb-09', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'easy',
    question: 'NaCl dissolves in water to form Na⁺ and Cl⁻ ions. What type of compound is NaCl?',
    options: ['Covalent molecular compound', 'Ionic compound', 'Metallic compound', 'Network covalent compound'],
    correctAnswers: [1],
    explanation: 'NaCl is an ionic compound — composed of oppositely charged ions held together by electrostatic attraction. Ionic compounds typically have high melting points, conduct electricity when dissolved or melted, and form crystalline lattice structures.',
  },
  {
    id: 'cb-10', domain: 1, subdomain: 'Chemical Bonding', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Electronegativity difference of 0 between two atoms always results in a nonpolar covalent bond.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'When both atoms have the same electronegativity (ΔEN = 0), electrons are shared equally → nonpolar covalent bond. H₂, O₂, N₂, Cl₂ all have identical atoms and therefore nonpolar bonds. The molecule as a whole may still be polar if the geometry is asymmetric.',
  },

  // ══════════════════════════════════════════════════════════════
  // Stoichiometry
  // ══════════════════════════════════════════════════════════════
  {
    id: 'stoich-01', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'easy',
    question: 'One mole of a substance contains approximately how many particles?',
    options: ['6.022 × 10²³', '6.022 × 10¹²', '3.14 × 10²³', '1.00 × 10³'],
    correctAnswers: [0],
    explanation: 'Avogadro\'s number: 6.022 × 10²³ particles/mol. This allows chemists to convert between atoms/molecules (too small to count directly) and moles (practical laboratory amounts). One mole of any substance contains the same number of particles.',
  },
  {
    id: 'stoich-02', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'The molar mass of water (H₂O) is approximately:',
    options: ['18 g/mol', '16 g/mol', '20 g/mol', '10 g/mol'],
    correctAnswers: [0],
    explanation: 'Molar mass of H₂O = 2(H) + 1(O) = 2(1.008) + 16.00 ≈ 18.02 g/mol. To find molar mass, sum the atomic masses of all atoms in the formula using the periodic table. 18 g of water contains 6.022 × 10²³ water molecules.',
  },
  {
    id: 'stoich-03', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'In the reaction 2H₂ + O₂ → 2H₂O, if you have 4 mol H₂ and excess O₂, how many moles of H₂O form?',
    options: ['2 mol', '4 mol', '8 mol', '1 mol'],
    correctAnswers: [1],
    explanation: 'The mole ratio is 2 H₂ : 2 H₂O (1:1 ratio for H₂ to H₂O). 4 mol H₂ × (2 mol H₂O / 2 mol H₂) = 4 mol H₂O. O₂ is in excess so it doesn\'t limit the reaction.',
  },
  {
    id: 'stoich-04', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'hard',
    question: 'N₂ + 3H₂ → 2NH₃. If 28 g of N₂ (molar mass 28 g/mol) reacts with excess H₂, how many grams of NH₃ (molar mass 17 g/mol) are produced?',
    options: ['17 g', '34 g', '28 g', '51 g'],
    correctAnswers: [1],
    explanation: 'Moles N₂ = 28 g ÷ 28 g/mol = 1 mol. Mole ratio N₂:NH₃ = 1:2. Moles NH₃ = 2 mol. Mass NH₃ = 2 mol × 17 g/mol = 34 g. This is a gram-to-mole-to-mole-to-gram stoichiometry calculation.',
  },
  {
    id: 'stoich-05', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'The "limiting reagent" in a reaction is:',
    options: ['The reactant present in the greatest amount', 'The reactant that is completely consumed first and limits the amount of product formed', 'The product that forms in the greatest quantity', 'The least expensive reactant'],
    correctAnswers: [1],
    explanation: 'The limiting reagent is consumed first — it determines the maximum product possible. The excess reagent has some left over after the limiting reagent runs out. Think of making sandwiches: if you have 6 slices of bread and 10 slices of cheese, bread is limiting.',
  },
  {
    id: 'stoich-06', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'The percent yield of a reaction is calculated as:',
    options: ['(actual yield / theoretical yield) × 100%', '(theoretical yield / actual yield) × 100%', '(actual yield − theoretical yield) × 100%', 'actual yield × theoretical yield'],
    correctAnswers: [0],
    explanation: 'Percent yield = (actual yield / theoretical yield) × 100%. Theoretical yield is the maximum possible (calculated from stoichiometry). Actual yield is what you obtain experimentally. Side reactions, incomplete reactions, and material loss reduce percent yield below 100%.',
  },
  {
    id: 'stoich-07', domain: 1, subdomain: 'Stoichiometry', type: 'yesno', difficulty: 'easy',
    question: 'True or False: In a balanced chemical equation, the number of atoms of each element must be equal on both sides.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Balancing equations follows conservation of mass — atoms are neither created nor destroyed. The same number of each type of atom must appear on the reactant and product sides. Only coefficients (not subscripts) can be changed to balance.',
  },
  {
    id: 'stoich-08', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'What is the empirical formula of a compound with 40.0% C, 6.7% H, and 53.3% O by mass?',
    options: ['C₂H₄O₂', 'CH₂O', 'C₃H₆O₃', 'CHO'],
    correctAnswers: [1],
    explanation: 'Assume 100 g: C=40.0g ÷ 12=3.33 mol, H=6.7g ÷ 1=6.7 mol, O=53.3g ÷ 16=3.33 mol. Divide by smallest (3.33): C=1, H=2, O=1. Empirical formula: CH₂O. This is glucose\'s empirical formula (molecular formula C₆H₁₂O₆ = 6 × CH₂O).',
  },
  {
    id: 'stoich-09', domain: 1, subdomain: 'Stoichiometry', type: 'ordering', difficulty: 'hard',
    question: 'Order these steps in a mass-to-mass stoichiometry calculation:',
    options: ['Convert moles of product to grams', 'Convert grams of reactant to moles', 'Use mole ratio from balanced equation', 'Write and balance the chemical equation'],
    correctAnswers: [3, 1, 2, 0],
    explanation: 'Mass-to-mass stoichiometry: 1) Balance the equation, 2) Convert given mass to moles (÷ molar mass), 3) Apply mole ratio, 4) Convert moles of product to grams (× molar mass).',
  },
  {
    id: 'stoich-10', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'easy',
    question: 'How many moles are in 54 g of water (molar mass = 18 g/mol)?',
    options: ['3 mol', '0.33 mol', '972 mol', '18 mol'],
    correctAnswers: [0],
    explanation: 'Moles = mass / molar mass = 54 g / 18 g/mol = 3 mol. The factor-label (dimensional analysis) method: 54 g × (1 mol / 18 g) = 3 mol. Always check that units cancel correctly.',
  },

  // ══════════════════════════════════════════════════════════════
  // States of Matter & Thermodynamics
  // ══════════════════════════════════════════════════════════════
  {
    id: 'sm-01', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'easy',
    question: 'Boyle\'s Law states that at constant temperature, the pressure and volume of a gas are:',
    options: ['Directly proportional (P ∝ V)', 'Inversely proportional (P ∝ 1/V)', 'Unrelated', 'Both equal to the number of moles × temperature'],
    correctAnswers: [1],
    explanation: 'Boyle\'s Law: P₁V₁ = P₂V₂ (at constant T and n). Squeezing a gas decreases volume and increases pressure. Think of a syringe: push the plunger and pressure builds. This is the basis of many applications from bicycle pumps to lungs.',
  },
  {
    id: 'sm-02', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'A gas at STP occupies 2.5 L. If the pressure doubles at constant temperature, what is the new volume?',
    options: ['5.0 L', '2.5 L', '1.25 L', '0.625 L'],
    correctAnswers: [2],
    explanation: 'Boyle\'s Law: P₁V₁ = P₂V₂. P₁V₁ = P×2.5. P₂ = 2P, so V₂ = P×2.5/(2P) = 1.25 L. Doubling pressure halves the volume — this inverse relationship is key to understanding gas behavior under compression.',
  },
  {
    id: 'sm-03', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'The ideal gas law is PV = nRT. What does R represent?',
    options: ['Rate of reaction', 'Universal gas constant (8.314 J/mol·K)', 'Radius of gas molecules', 'Ratio of pressure to volume'],
    correctAnswers: [1],
    explanation: 'R is the universal gas constant = 8.314 J/(mol·K) = 0.08206 L·atm/(mol·K). It connects all gas variables (pressure, volume, moles, temperature) in the ideal gas law. The value to use depends on the units of P and V.',
  },
  {
    id: 'sm-04', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Heat flows from objects of higher temperature to objects of lower temperature until equilibrium is reached.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Heat always flows spontaneously from hot to cold (second law of thermodynamics). Thermal equilibrium is reached when both objects reach the same temperature. Refrigerators and air conditioners work against this natural flow, requiring energy input.',
  },
  {
    id: 'sm-05', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'An exothermic reaction:',
    options: ['Absorbs heat from the surroundings', 'Releases heat to the surroundings (ΔH < 0)', 'Has no change in enthalpy', 'Always requires high temperatures to proceed'],
    correctAnswers: [1],
    explanation: 'Exothermic reactions release energy (ΔH < 0) — the products are at lower energy than the reactants. Examples: combustion, rusting, hand warmers. Endothermic reactions absorb energy (ΔH > 0) — cold packs and photosynthesis.',
  },
  {
    id: 'sm-06', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'Which gas law describes the direct relationship between temperature and volume at constant pressure?',
    options: ['Boyle\'s Law', 'Charles\'s Law', 'Gay-Lussac\'s Law', 'Dalton\'s Law'],
    correctAnswers: [1],
    explanation: 'Charles\'s Law: V₁/T₁ = V₂/T₂ (at constant P and n, T in Kelvin). Heating a gas causes it to expand; cooling causes contraction. A hot air balloon rises because heated air expands — the gas becomes less dense and the balloon rises.',
  },
  {
    id: 'sm-07', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'hard',
    question: 'What is the specific heat capacity of water, and why is it important?',
    options: ['0.24 J/(g·°C) — water heats very quickly', '4.18 J/(g·°C) — water resists temperature change, moderating climate', '1.00 J/(g·°C) — convenient reference value', '100 J/(g·°C) — water boils at 100°C'],
    correctAnswers: [1],
    explanation: 'Water\'s specific heat is 4.18 J/(g·°C) — among the highest of any common substance. This means water absorbs large amounts of heat with small temperature change. This moderates Earth\'s climate, keeps coastal regions temperate, and makes water a critical coolant in living systems.',
  },
  {
    id: 'sm-08', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'ordering', difficulty: 'medium',
    question: 'Order these phase transitions from LOWEST to HIGHEST energy (heat required):',
    options: ['Melting (solid → liquid)', 'Sublimation (solid → gas)', 'Condensation (gas → liquid)', 'Vaporization (liquid → gas)'],
    correctAnswers: [2, 0, 3, 1],
    explanation: 'Condensation releases heat (negative). Melting requires less heat than vaporization. Vaporization requires breaking all intermolecular attractions at the surface. Sublimation requires going directly from solid to gas — the most energy-intensive transition.',
  },

  // ══════════════════════════════════════════════════════════════
  // Reaction Kinetics, Equilibrium & Acids/Bases
  // ══════════════════════════════════════════════════════════════
  {
    id: 'rk-01', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'easy',
    question: 'What is activation energy?',
    options: ['The energy released during a reaction', 'The minimum energy required for reactants to collide and form products', 'The total energy in all reactant molecules', 'The energy difference between reactants and products'],
    correctAnswers: [1],
    explanation: 'Activation energy (Ea) is the energy barrier that must be overcome for a reaction to occur. Even exothermic reactions require an initial energy input to start. Catalysts lower the activation energy, speeding up reactions without being consumed.',
  },
  {
    id: 'rk-02', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'multi', difficulty: 'medium',
    question: 'Which factors increase the rate of a chemical reaction? (Select all that apply)',
    options: ['Increasing temperature', 'Adding a catalyst', 'Increasing concentration of reactants', 'Decreasing surface area'],
    correctAnswers: [0, 1, 2],
    explanation: 'Reaction rate increases with: higher temperature (more kinetic energy → more frequent, energetic collisions), catalyst (lowers Ea), and higher concentration (more particles → more collisions). Decreasing surface area slows reactions by reducing collision opportunities.',
  },
  {
    id: 'rk-03', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'Le Chatelier\'s Principle states that if a stress is applied to a system at equilibrium, the system will:',
    options: ['Stop the reaction', 'Shift in the direction that relieves the stress', 'Always produce more products', 'Change the value of the equilibrium constant K'],
    correctAnswers: [1],
    explanation: 'Le Chatelier\'s Principle: equilibrium shifts to counteract stresses (concentration changes, temperature changes, pressure changes). Adding product shifts the reaction toward reactants. Increasing temperature favors the endothermic direction.',
  },
  {
    id: 'rk-04', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'easy',
    question: 'According to the Arrhenius definition, an acid is a substance that:',
    options: ['Donates a proton (H⁺) to another substance', 'Accepts a proton (H⁺)', 'Donates a hydroxide ion (OH⁻)', 'Produces H⁺ ions when dissolved in water'],
    correctAnswers: [3],
    explanation: 'Arrhenius acid: produces H⁺ (or H₃O⁺) ions in water (HCl → H⁺ + Cl⁻). Arrhenius base: produces OH⁻ in water. The Brønsted-Lowry definition is broader: acid = H⁺ donor, base = H⁺ acceptor (works in non-aqueous systems too).',
  },
  {
    id: 'rk-05', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'A solution with pH = 3 compared to a solution with pH = 5 is:',
    options: ['100 times more basic', '2 times more acidic', '100 times more acidic', '2 times more basic'],
    correctAnswers: [2],
    explanation: 'pH is a logarithmic scale. Each pH unit represents a 10× change in H⁺ concentration. pH 3 vs pH 5 = 2 units difference = 10² = 100 times more acidic (more H⁺ ions). pH 7 is neutral; below 7 is acidic; above 7 is basic.',
  },
  {
    id: 'rk-06', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'yesno', difficulty: 'easy',
    question: 'True or False: A catalyst is consumed during a chemical reaction.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'A catalyst speeds up a reaction by providing an alternative pathway with lower activation energy, but it is NOT consumed — it is regenerated. Enzymes in our bodies are biological catalysts that can participate in millions of reactions without being used up.',
  },
  {
    id: 'rk-07', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'hard',
    question: 'For the reaction A + B ⇌ C + D at equilibrium with Kc = 100, what does this tell you?',
    options: ['The reaction is very fast', 'Products are strongly favored — at equilibrium, much more C and D than A and B', 'Reactants are favored over products', 'The reaction requires a catalyst to proceed'],
    correctAnswers: [1],
    explanation: 'Kc = [products]/[reactants] (at equilibrium). Kc = 100 >> 1 means products are greatly favored — the numerator (products) is much larger than the denominator (reactants). Kc >> 1: products favored. Kc << 1: reactants favored. Kc ≈ 1: roughly equal.',
  },
  {
    id: 'rk-08', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'What is a buffer solution?',
    options: ['A solution with pH = 7 (neutral)', 'A solution that resists changes in pH when small amounts of acid or base are added', 'Any strong acid dissolved in water', 'A solution at equilibrium with no net reaction'],
    correctAnswers: [1],
    explanation: 'A buffer contains a weak acid and its conjugate base (or a weak base and its conjugate acid). Adding H⁺ to a buffer: the base neutralizes it. Adding OH⁻: the acid neutralizes it. Blood (pH 7.35–7.45) is a buffered system essential for life.',
  },
  {
    id: 'rk-09', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'easy',
    question: 'In a neutralization reaction between an acid and a base, the products are:',
    options: ['Two new acids', 'Salt and water', 'Two new bases', 'A metal and a gas'],
    correctAnswers: [1],
    explanation: 'Acid-base neutralization: HX + MOH → MX (salt) + H₂O. HCl + NaOH → NaCl + H₂O. The H⁺ from the acid combines with the OH⁻ from the base to form water. The remaining ions form the salt.',
  },
  {
    id: 'rk-10', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'ordering', difficulty: 'medium',
    question: 'Order these solutions from MOST ACIDIC to MOST BASIC:',
    options: ['pH = 7 (pure water)', 'pH = 1 (stomach acid)', 'pH = 11 (bleach)', 'pH = 4 (orange juice)'],
    correctAnswers: [1, 3, 0, 2],
    explanation: 'Lower pH = more acidic. pH 1 (stomach acid) is most acidic. pH 4 (orange juice) is acidic. pH 7 is neutral. pH 11 (bleach) is most basic. The pH scale runs from 0 (strongest acid) to 14 (strongest base).',
  },

  // ══════════════════════════════════════════════════════════════
  // Atomic Structure — 2 additional questions (atom-14, atom-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'atom-14', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'hard',
    question: 'Which set of four quantum numbers is VALID for an electron in a 3d subshell?',
    options: ['n=3, l=3, mₗ=0, mₛ=+½', 'n=3, l=2, mₗ=−2, mₛ=+½', 'n=3, l=2, mₗ=3, mₛ=−½', 'n=3, l=1, mₗ=2, mₛ=+½'],
    correctAnswers: [1],
    explanation: 'For 3d: n=3, l=2 (d subshell has l=2). mₗ must be from −l to +l (−2 to +2), so mₗ=−2 is valid. mₛ = ±½ always. In option A, l cannot equal n. In C, mₗ=3 exceeds l=2. In D, l=1 is p not d.',
  },
  {
    id: 'atom-15', domain: 1, subdomain: 'Atomic Structure', type: 'multi', difficulty: 'medium',
    question: 'Which statements about the Bohr model of the atom are correct? (Select all that apply)',
    options: ['Electrons travel in circular orbits at fixed distances from the nucleus', 'Electrons emit energy (light) when they drop from a higher to a lower energy level', 'The Bohr model accurately describes all atoms with more than one electron', 'The ground state is the lowest possible energy level for an electron'],
    correctAnswers: [0, 1, 3],
    explanation: 'The Bohr model has electrons in fixed circular orbits (shells). Electrons release photons when dropping to lower levels (emission spectrum). The ground state is the lowest energy orbit. However, the Bohr model only works well for hydrogen (1 electron); it fails for multi-electron atoms.',
  },

  // ══════════════════════════════════════════════════════════════
  // Periodic Table — 5 additional questions (per-11 through per-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'per-11', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'medium',
    question: 'Electron affinity is the energy change when an atom GAINS an electron. Across a period from left to right, electron affinity generally:',
    options: ['Decreases — the atom becomes less willing to gain electrons', 'Increases (becomes more negative) — the atom more readily accepts an electron', 'Stays constant within a period', 'First decreases then increases (U-shape)'],
    correctAnswers: [1],
    explanation: 'Across a period, increasing nuclear charge draws electrons in more strongly, so atoms more readily gain electrons (higher, more negative, electron affinity). Nonmetals on the right side have the highest electron affinities. Chlorine has one of the highest electron affinities of any element.',
  },
  {
    id: 'per-12', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'easy',
    question: 'Which group of elements is known as the halogens?',
    options: ['Group 1', 'Group 2', 'Group 17', 'Group 18'],
    correctAnswers: [2],
    explanation: 'Group 17 elements (F, Cl, Br, I, At) are halogens. They have 7 valence electrons and readily gain one electron to form −1 ions (F⁻, Cl⁻, Br⁻, I⁻). Halogens are the most reactive nonmetals and form salts when reacting with metals.',
  },
  {
    id: 'per-13', domain: 1, subdomain: 'Periodic Table', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Transition metals are found in groups 3 through 12 and can form multiple oxidation states because electrons are removed from d orbitals.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Transition metals (Groups 3–12, d-block) can lose varying numbers of d electrons, giving them multiple stable oxidation states. For example, iron forms Fe²⁺ and Fe³⁺; manganese forms Mn²⁺, Mn³⁺, Mn⁴⁺, Mn⁷⁺. This also gives them colorful compounds.',
  },
  {
    id: 'per-14', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'hard',
    question: 'Which of the following elements has the highest first ionization energy?',
    options: ['Sodium (Na)', 'Magnesium (Mg)', 'Chlorine (Cl)', 'Argon (Ar)'],
    correctAnswers: [3],
    explanation: 'First ionization energy generally increases across a period and up a group. Argon (Group 18, Period 3) has a full outer shell and the highest first ionization energy in Period 3. Removing an electron from a noble gas configuration requires the most energy. Cl is close but Ar is higher.',
  },
  {
    id: 'per-15', domain: 1, subdomain: 'Periodic Table', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are properties of metals? (Select all that apply)',
    options: ['Good conductors of heat and electricity', 'Malleable and ductile', 'Tend to gain electrons in reactions', 'Have a lustrous (shiny) appearance'],
    correctAnswers: [0, 1, 3],
    explanation: 'Metals conduct heat and electricity (delocalized electrons), can be hammered into sheets (malleable) and drawn into wires (ductile), and have a characteristic metallic luster. Metals LOSE electrons (form cations) — they do NOT gain electrons. Nonmetals tend to gain electrons.',
  },

  // ══════════════════════════════════════════════════════════════
  // Chemical Bonding — 5 additional questions (bond-11 through bond-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'bond-11', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'NH₃ (ammonia) has one lone pair on nitrogen and three N−H bonds. According to VSEPR, what is the molecular geometry?',
    options: ['Trigonal planar', 'Tetrahedral', 'Trigonal pyramidal', 'Linear'],
    correctAnswers: [2],
    explanation: 'Nitrogen has 4 electron regions (3 bonding pairs + 1 lone pair) → electron geometry is tetrahedral. But molecular geometry describes ONLY atom positions, so we see 3 bonds arranged below N in a pyramid → trigonal pyramidal. The lone pair compresses bond angles to about 107° (below the 109.5° ideal).',
  },
  {
    id: 'bond-12', domain: 1, subdomain: 'Chemical Bonding', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A molecule can have polar bonds but still be nonpolar overall if the bond dipoles cancel due to molecular symmetry.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'CO₂ has two polar C=O bonds, but they point in exactly opposite directions (180° apart) and cancel → nonpolar molecule. CCl₄ has four polar C−Cl bonds that point symmetrically in all directions and cancel → nonpolar. Polarity depends on both bond polarity AND geometry.',
  },
  {
    id: 'bond-13', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'easy',
    question: 'Metallic bonding is best described as:',
    options: ['Transfer of electrons from one metal atom to another forming ions', 'Sharing of electrons between two specific metal atoms', 'A "sea" of delocalized electrons surrounding positively charged metal cations', 'Electrostatic attraction between oppositely charged ions'],
    correctAnswers: [2],
    explanation: 'In metallic bonding, valence electrons are released from all metal atoms and move freely throughout the structure — a "sea of electrons." The positive metal cations are held in place by attraction to this electron sea. This explains high conductivity, malleability, and ductility of metals.',
  },
  {
    id: 'bond-14', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'hard',
    question: 'What is the correct Lewis structure for CO₂ — how many lone pairs does the carbon have, and what type of bonds are present?',
    options: ['Carbon has 2 lone pairs; single bonds to each oxygen', 'Carbon has 0 lone pairs; double bonds to each oxygen', 'Carbon has 1 lone pair; one single and one double bond to oxygen', 'Carbon has 0 lone pairs; triple bond to one oxygen, single to the other'],
    correctAnswers: [1],
    explanation: 'In CO₂, carbon forms a double bond with each oxygen (O=C=O), using all 4 of carbon\'s valence electrons. Carbon has no lone pairs — this is the key. Each oxygen uses 4 electrons in its double bond and has 2 lone pairs. CO₂ is linear with 180° bond angles.',
  },
  {
    id: 'bond-15', domain: 1, subdomain: 'Chemical Bonding', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are examples of intermolecular forces (forces BETWEEN molecules, NOT within them)? (Select all that apply)',
    options: ['Hydrogen bonding between H₂O molecules', 'Van der Waals (London dispersion) forces between nonpolar molecules', 'Covalent bond within an O₂ molecule', 'Dipole-dipole forces between HCl molecules'],
    correctAnswers: [0, 1, 3],
    explanation: 'Intermolecular forces act between molecules: hydrogen bonds (H bonded to N, O, or F), London dispersion (temporary dipoles in all molecules), and dipole-dipole forces (between polar molecules). The covalent bond within O₂ is an INTRAmolecular force — it holds atoms together within the molecule.',
  },

  // ══════════════════════════════════════════════════════════════
  // Stoichiometry — 5 additional questions (stoich-11 through stoich-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'stoich-11', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'For the reaction 2Al + 3Cl₂ → 2AlCl₃: if 54 g of Al (molar mass 27 g/mol) reacts with 106 g of Cl₂ (molar mass 71 g/mol), which is the limiting reagent?',
    options: ['Al, because it has less mass', 'Cl₂, because it requires 3 moles to every 2 moles of Al', 'Al, because 2 mol Al requires 3 mol Cl₂ but only 1.49 mol Cl₂ is available', 'Neither — both are used up exactly'],
    correctAnswers: [2],
    explanation: 'Moles Al = 54/27 = 2 mol. Moles Cl₂ = 106/71 = 1.49 mol. Ratio needed: 2 mol Al requires 3 mol Cl₂. For 2 mol Al, need 3 mol Cl₂ — but only 1.49 mol available. Cl₂ is insufficient → Cl₂ is limiting. Always compare MOLE RATIOS, not just masses.',
  },
  {
    id: 'stoich-12', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'A student expected to produce 10.0 g of product but only obtained 7.5 g. What is the percent yield?',
    options: ['133%', '75.0%', '25.0%', '7.50%'],
    correctAnswers: [1],
    explanation: 'Percent yield = (actual yield / theoretical yield) × 100% = (7.5 g / 10.0 g) × 100% = 75.0%. Percent yield is always ≤ 100% in practice (except for measurement errors). Common causes of low yield: incomplete reaction, side reactions, or material loss.',
  },
  {
    id: 'stoich-13', domain: 1, subdomain: 'Stoichiometry', type: 'yesno', difficulty: 'easy',
    question: 'True or False: The molecular formula of a compound is always a whole-number multiple of its empirical formula.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The empirical formula gives the simplest whole-number ratio of atoms. The molecular formula = n × (empirical formula), where n is a positive integer. Glucose: empirical = CH₂O, molecular = C₆H₁₂O₆ (n=6). Benzene: empirical = CH, molecular = C₆H₆ (n=6).',
  },
  {
    id: 'stoich-14', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'hard',
    question: 'How many grams of CO₂ (molar mass 44 g/mol) are produced from burning 24 g of carbon (molar mass 12 g/mol)? Reaction: C + O₂ → CO₂',
    options: ['44 g', '88 g', '24 g', '12 g'],
    correctAnswers: [1],
    explanation: 'Moles C = 24 g ÷ 12 g/mol = 2 mol. Mole ratio C:CO₂ = 1:1. Moles CO₂ = 2 mol. Mass CO₂ = 2 mol × 44 g/mol = 88 g. Each carbon atom combines with one oxygen molecule to make one CO₂ molecule — a 1:1 molar relationship.',
  },
  {
    id: 'stoich-15', domain: 1, subdomain: 'Stoichiometry', type: 'multi', difficulty: 'medium',
    question: 'Which of the following correctly describe the mole concept? (Select all that apply)',
    options: ['One mole of any substance contains 6.022 × 10²³ particles', 'The molar mass of an element equals its atomic mass in grams per mole', 'One mole always has a volume of 22.4 L regardless of substance', 'Moles = mass (g) divided by molar mass (g/mol)'],
    correctAnswers: [0, 1, 3],
    explanation: 'The mole bridges atomic and laboratory scales: 1 mol = 6.022×10²³ particles (Avogadro\'s number). Molar mass (g/mol) = atomic mass from the periodic table. moles = mass/molar mass. The 22.4 L/mol applies ONLY to ideal gases at STP — not to liquids or solids.',
  },

  // ══════════════════════════════════════════════════════════════
  // States of Matter & Thermodynamics — 5 additional questions (states-09 through states-13)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'states-09', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'Gay-Lussac\'s Law describes the relationship between pressure and temperature at constant volume. If a gas at 300 K has pressure 1.5 atm, what is the pressure at 600 K?',
    options: ['0.75 atm', '3.0 atm', '1.5 atm', '4.5 atm'],
    correctAnswers: [1],
    explanation: 'Gay-Lussac\'s Law: P₁/T₁ = P₂/T₂ (constant V, n; T in Kelvin). P₂ = P₁ × T₂/T₁ = 1.5 × 600/300 = 3.0 atm. Doubling absolute temperature doubles pressure (directly proportional). This is why tire pressure changes with temperature — hot tires have higher pressure.',
  },
  {
    id: 'states-10', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'The kinetic molecular theory of gases assumes which of the following?',
    options: ['Gas molecules have significant volume compared to the container', 'Gas molecules exert strong attractive forces on each other', 'The average kinetic energy of gas molecules is directly proportional to absolute temperature', 'Gas molecules collide inelastically, losing energy with each collision'],
    correctAnswers: [2],
    explanation: 'Kinetic molecular theory postulates: gas molecules have negligible volume, no intermolecular forces, and move in random straight lines. They collide elastically (no net energy loss). The key quantitative result: average KE = (3/2)kT — average kinetic energy is proportional to Kelvin temperature.',
  },
  {
    id: 'states-11', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'yesno', difficulty: 'easy',
    question: 'True or False: During a phase change (e.g., melting), the temperature of a pure substance remains constant even though heat is being added.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'During a phase change, added heat is used to break intermolecular forces rather than increase kinetic energy — so temperature stays constant. This "hidden" heat is called latent heat. On a heating curve, the flat plateaus represent melting (at the melting point) and boiling (at the boiling point).',
  },
  {
    id: 'states-12', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'hard',
    question: 'Hess\'s Law states that the enthalpy change of a reaction is:',
    options: ['Always negative (exothermic)', 'Equal to the sum of enthalpy changes of the individual steps, regardless of pathway', 'Proportional to the activation energy', 'Zero for all chemical reactions at equilibrium'],
    correctAnswers: [1],
    explanation: 'Hess\'s Law: ΔH for a reaction is the same regardless of whether it occurs in one step or multiple steps (enthalpy is a state function — path independent). This lets us calculate ΔH for reactions that are difficult to measure directly by adding or reversing known reactions.',
  },
  {
    id: 'states-13', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'What does a phase diagram show?',
    options: ['How quickly a substance changes phase over time', 'The states of matter of a substance at various temperatures and pressures, including the triple point and critical point', 'The electron configuration changes during phase transitions', 'The enthalpy changes for melting and boiling'],
    correctAnswers: [1],
    explanation: 'A phase diagram is a pressure-versus-temperature graph with regions showing which phase (solid, liquid, gas) is stable. The triple point is where all three phases coexist. The critical point is above which liquid and gas become indistinct (supercritical fluid). Boundary lines show where two phases coexist.',
  },

  // ══════════════════════════════════════════════════════════════
  // Reaction Kinetics, Equilibrium & Acids/Bases — 3 additional questions (kinetic-11 through kinetic-13)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'kinetic-11', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'For the equilibrium N₂(g) + 3H₂(g) ⇌ 2NH₃(g): if the pressure is increased by decreasing volume, the equilibrium will shift:',
    options: ['Toward reactants (left) — to produce more gas molecules', 'Toward products (right) — to reduce the number of gas molecules', 'There is no shift — pressure does not affect equilibrium', 'The reaction stops completely'],
    correctAnswers: [1],
    explanation: 'Le Chatelier\'s Principle: increasing pressure favors the side with FEWER gas molecules. Left side: 1 + 3 = 4 mol gas. Right side: 2 mol gas. Shifting right reduces moles of gas, relieving the pressure increase. This is why the Haber process for ammonia uses high pressure.',
  },
  {
    id: 'kinetic-12', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'A Brønsted-Lowry acid is defined as a substance that:',
    options: ['Produces OH⁻ ions in water', 'Accepts a proton (H⁺) from another substance', 'Donates a proton (H⁺) to another substance', 'Has a pH greater than 7'],
    correctAnswers: [2],
    explanation: 'Brønsted-Lowry definition: acid = proton (H⁺) donor; base = proton acceptor. This extends the Arrhenius definition beyond water solutions. In the reaction HCl + NH₃ → Cl⁻ + NH₄⁺, HCl donates H⁺ (acid) and NH₃ accepts H⁺ (base). After donating, HCl becomes its conjugate base Cl⁻.',
  },
  {
    id: 'kinetic-13', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'multi', difficulty: 'hard',
    question: 'Which of the following correctly describe how increasing temperature affects a chemical reaction? (Select all that apply)',
    options: ['Increases the average kinetic energy of molecules', 'Increases the reaction rate for both forward and reverse reactions', 'For an exothermic reaction, the equilibrium shifts toward reactants', 'Lowers the activation energy of the reaction'],
    correctAnswers: [0, 1, 2],
    explanation: 'Higher temperature increases average kinetic energy (more molecules exceed Ea → faster rate). Both forward and reverse rates increase, but the endothermic direction benefits more — so for an exothermic reaction, equilibrium shifts left (toward reactants). Temperature does NOT change activation energy — only a catalyst does that.',
  },

  // ══════════════════════════════════════════════════════════════
  // Round 2 expansion: 42 additional questions across 7 subdomains
  // ══════════════════════════════════════════════════════════════

  // ─── Stoichiometry ─────────────────────────────────────────────
  {
    id: 'stoich-16', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'In the reaction 2 H₂ + O₂ → 2 H₂O, how many moles of water are produced from 4 moles of H₂ (with excess O₂)?',
    options: ['2 moles', '4 moles', '6 moles', '8 moles'],
    correctAnswers: [1],
    explanation: 'The coefficients give the mole ratio: 2 mol H₂ produces 2 mol H₂O — a 1:1 ratio. So 4 mol H₂ produces 4 mol H₂O. The key insight: even though the chemical formula has subscript-2 in H₂O, the answer comes from coefficients, not subscripts. Coefficients tell you ratios of WHOLE molecules.',
  },
  {
    id: 'stoich-17', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'medium',
    question: 'What is the molar mass of CO₂? (C = 12.01 g/mol, O = 16.00 g/mol)',
    options: ['28.01 g/mol', '44.01 g/mol', '56.02 g/mol', '32.00 g/mol'],
    correctAnswers: [1],
    explanation: 'CO₂ = 1 carbon + 2 oxygens = 12.01 + 2(16.00) = 12.01 + 32.00 = 44.01 g/mol. Always multiply by the subscript before summing. Molar mass equals the formula mass in g/mol — it tells you the mass of one mole (6.022×10²³ formula units) of the substance.',
  },
  {
    id: 'stoich-18', domain: 1, subdomain: 'Stoichiometry', type: 'multi', difficulty: 'medium',
    question: 'Which steps are required to convert grams of reactant to grams of product? (Select all that apply)',
    options: ['Convert grams of reactant to moles using molar mass', 'Use coefficient ratio to find moles of product', 'Convert moles of product to grams using molar mass', 'Always multiply by Avogadro\'s number'],
    correctAnswers: [0, 1, 2],
    explanation: 'The three-step stoichiometry path: (1) grams reactant → moles via molar mass, (2) moles reactant → moles product via mole ratio (coefficients), (3) moles product → grams via molar mass. Avogadro\'s number is needed only when converting between moles and number of individual molecules — not for gram-to-gram problems.',
  },
  {
    id: 'stoich-19', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'hard',
    question: 'In a reaction with 5 mol A (need 1) and 3 mol B (need 2), which reagent is limiting?',
    options: ['A — it has more moles', 'B — divide moles by coefficient: A gives 5, B gives 1.5; B is smaller', 'Neither — they react in equal amounts', 'Cannot determine without molar masses'],
    correctAnswers: [1],
    explanation: 'Limiting reagent = smaller quotient when moles are divided by coefficients. A: 5/1 = 5. B: 3/2 = 1.5. B is smaller, so B is limiting. The reaction stops when B runs out. The common student error is picking whichever has fewer total moles — but coefficient ratios decide it, not raw mole counts.',
  },
  {
    id: 'stoich-20', domain: 1, subdomain: 'Stoichiometry', type: 'yesno', difficulty: 'easy',
    question: 'Does the law of conservation of mass require a balanced chemical equation?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes — conservation of mass means atoms are neither created nor destroyed in a chemical reaction. A balanced equation has equal numbers of each type of atom on both sides, which is exactly what conservation of mass requires. Unbalanced equations are useful for showing reactants and products but cannot be used for stoichiometric calculations.',
  },
  {
    id: 'stoich-21', domain: 1, subdomain: 'Stoichiometry', type: 'single', difficulty: 'hard',
    question: 'Theoretical yield = 50.0 g. Actual yield = 38.0 g. What is the percent yield?',
    options: ['12.0%', '76.0%', '88.0%', '131.6%'],
    correctAnswers: [1],
    explanation: 'Percent yield = (actual / theoretical) × 100 = (38.0 / 50.0) × 100 = 76.0%. Percent yield is always between 0% and 100% (practically). Yields above 100% indicate impure product or measurement error — actual cannot exceed theoretical because conservation of mass limits what the reaction can produce.',
  },

  // ─── Atomic Structure ──────────────────────────────────────────
  {
    id: 'atom-16', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'easy',
    question: 'Which subatomic particle determines the identity (element) of an atom?',
    options: ['Neutron', 'Electron', 'Proton', 'Quark'],
    correctAnswers: [2],
    explanation: 'The number of protons (the atomic number Z) defines the element. Carbon always has 6 protons; oxygen always has 8. Changing the proton count creates a different element. Changing neutron count creates an isotope (same element, different mass); changing electron count creates an ion (same element, different charge).',
  },
  {
    id: 'atom-17', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'An atom of magnesium-24 has how many neutrons? (Mg atomic number = 12)',
    options: ['12', '24', '36', '6'],
    correctAnswers: [0],
    explanation: 'Neutrons = mass number − atomic number = 24 − 12 = 12. The mass number (24) tells the total protons + neutrons; subtract protons (Z=12) to isolate neutrons. Carbon-12 has 6+6, carbon-14 has 6+8 — the proton count is fixed by element identity; neutrons vary by isotope.',
  },
  {
    id: 'atom-18', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'medium',
    question: 'Which of the following correctly describes electron configuration for ground-state oxygen (Z = 8)?',
    options: ['1s² 2s² 2p⁴', '1s² 2s⁴ 2p²', '1s² 2s² 2p⁶', '1s⁴ 2s⁴'],
    correctAnswers: [0],
    explanation: 'Oxygen has 8 electrons filled by the Aufbau order: 1s² (2) → 2s² (4) → 2p⁴ (8). The 2p subshell holds up to 6 electrons; oxygen fills only 4 of them. This unfilled p subshell explains oxygen\'s tendency to gain 2 electrons (forming O²⁻) — completing the octet.',
  },
  {
    id: 'atom-19', domain: 1, subdomain: 'Atomic Structure', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are TRUE about isotopes of the same element? (Select all that apply)',
    options: ['Same number of protons', 'Different number of neutrons', 'Different number of electrons', 'Same chemical behavior'],
    correctAnswers: [0, 1, 3],
    explanation: 'Isotopes share atomic number (protons) but differ in mass number (neutrons). They have the SAME number of electrons in the neutral state, so chemistry is essentially identical. Only the mass differs significantly — useful in carbon-14 dating, MRI (hydrogen isotopes), and nuclear reactions.',
  },
  {
    id: 'atom-20', domain: 1, subdomain: 'Atomic Structure', type: 'yesno', difficulty: 'easy',
    question: 'In a neutral atom, do the number of protons and electrons match?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes. Protons carry +1 charge; electrons carry −1 charge. For an atom to be electrically neutral, these must balance — equal counts of each. When an atom loses electrons it becomes a positive cation; when it gains electrons it becomes a negative anion. Protons rarely change outside of nuclear reactions.',
  },
  {
    id: 'atom-21', domain: 1, subdomain: 'Atomic Structure', type: 'single', difficulty: 'hard',
    question: 'A neutral atom has the configuration [Ne] 3s² 3p⁵. What element is it, and what ion does it tend to form?',
    options: ['Sulfur, S²⁻', 'Chlorine, Cl⁻', 'Argon, no ion', 'Sodium, Na⁺'],
    correctAnswers: [1],
    explanation: '[Ne] is 10 electrons, then 3s² 3p⁵ adds 7 more, for 17 total — atomic number 17 = chlorine. Chlorine needs just one more electron to complete the 3p subshell (octet), so it readily forms Cl⁻. This is why chlorine is a strong oxidizer and forms salts like NaCl.',
  },

  // ─── Chemical Bonding ──────────────────────────────────────────
  {
    id: 'bond-16', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'Which type of bond forms when one atom transfers an electron to another?',
    options: ['Covalent bond', 'Ionic bond', 'Metallic bond', 'Hydrogen bond'],
    correctAnswers: [1],
    explanation: 'In ionic bonding, one atom (typically a metal) donates electrons to another (typically a nonmetal), creating oppositely-charged ions held together by electrostatic attraction. Covalent bonds share electrons rather than transfer. NaCl is the classic ionic compound: Na donates, Cl accepts.',
  },
  {
    id: 'bond-17', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'A polar covalent bond forms between which two atoms in the following list?',
    options: ['Two oxygen atoms (O–O)', 'Hydrogen and chlorine (H–Cl)', 'Two sodium atoms (Na–Na)', 'Sodium and chlorine (Na–Cl)'],
    correctAnswers: [1],
    explanation: 'A polar covalent bond requires electron sharing between atoms with different electronegativities. H–Cl has ΔEN ≈ 0.96 — covalent (electrons shared) but unequally (chlorine pulls harder). O–O has ΔEN = 0 (nonpolar covalent). Na–Cl has ΔEN ≈ 2.1, large enough to be ionic. Na–Na is metallic.',
  },
  {
    id: 'bond-18', domain: 1, subdomain: 'Chemical Bonding', type: 'multi', difficulty: 'medium',
    question: 'Which properties are typical of ionic compounds at room temperature? (Select all that apply)',
    options: ['High melting and boiling points', 'Conduct electricity when dissolved in water', 'Tend to be soft and waxy', 'Form crystalline solids'],
    correctAnswers: [0, 1, 3],
    explanation: 'Ionic compounds have strong electrostatic attractions, giving them high melting/boiling points and crystalline lattice structures. When dissolved (or melted), ions become mobile and conduct electricity. They are NOT soft and waxy — that\'s typical of molecular (covalent) solids like wax or sugar. Ionic crystals are hard and brittle.',
  },
  {
    id: 'bond-19', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'medium',
    question: 'How many electrons does carbon need to gain or share to complete its octet?',
    options: ['1', '2', '3', '4'],
    correctAnswers: [3],
    explanation: 'Carbon has 4 valence electrons (group 14). To reach the octet of 8, it needs 4 more — typically by sharing (forming 4 covalent bonds). This explains methane (CH₄), carbon dioxide (CO₂), and the entire diversity of organic chemistry. Carbon almost never forms ionic bonds because gaining or losing 4 electrons is energetically prohibitive.',
  },
  {
    id: 'bond-20', domain: 1, subdomain: 'Chemical Bonding', type: 'yesno', difficulty: 'easy',
    question: 'Are hydrogen bonds considered chemical bonds (like ionic or covalent) or intermolecular forces?',
    options: ['Chemical bonds', 'Intermolecular forces'],
    correctAnswers: [1],
    explanation: 'Hydrogen bonds are intermolecular forces (between molecules), not true chemical bonds. They are much weaker than covalent or ionic bonds, but stronger than other intermolecular forces. Hydrogen bonds explain water\'s high boiling point, ice\'s lower density than water, and DNA\'s double-helix structure.',
  },
  {
    id: 'bond-21', domain: 1, subdomain: 'Chemical Bonding', type: 'single', difficulty: 'hard',
    question: 'Carbon dioxide (CO₂) has polar C=O bonds, yet the molecule itself is nonpolar. Why?',
    options: ['The polar bonds cancel because the molecule is linear and symmetric', 'CO₂ does not actually have polar bonds', 'CO₂ is ionic, not covalent', 'Oxygen is more electronegative than carbon, making the whole molecule negative'],
    correctAnswers: [0],
    explanation: 'CO₂ has a linear O=C=O geometry. The two C=O bond dipoles point in opposite directions and cancel, giving zero net dipole moment. Compare to water (H₂O), which is bent — the dipoles don\'t cancel, so water is polar. Molecular polarity depends on BOTH bond polarities AND molecular geometry.',
  },

  // ─── Periodic Table ────────────────────────────────────────────
  {
    id: 'per-16', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'easy',
    question: 'Going LEFT to RIGHT across a period, atomic radius generally:',
    options: ['Increases', 'Decreases', 'Stays the same', 'Varies randomly'],
    correctAnswers: [1],
    explanation: 'Atomic radius decreases left to right across a period because protons are being added without adding shells, so the increased nuclear charge pulls existing electrons closer. Going down a group, radius increases (more shells). Memorize this trend — it\'s the basis for ionization energy and electronegativity trends.',
  },
  {
    id: 'per-17', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'medium',
    question: 'Which element has the HIGHEST ionization energy?',
    options: ['Sodium (Na)', 'Chlorine (Cl)', 'Helium (He)', 'Cesium (Cs)'],
    correctAnswers: [2],
    explanation: 'Ionization energy peaks at the upper-right of the periodic table because small atoms with full or nearly-full valence shells hold their electrons tightly. Helium (top of group 18) has the highest IE of any element — its 1s² shell is small, complete, and tightly held. Cesium (bottom-left) has among the lowest IEs.',
  },
  {
    id: 'per-18', domain: 1, subdomain: 'Periodic Table', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are noble gases? (Select all that apply)',
    options: ['Neon (Ne)', 'Argon (Ar)', 'Nitrogen (N)', 'Krypton (Kr)'],
    correctAnswers: [0, 1, 3],
    explanation: 'Noble gases occupy group 18: He, Ne, Ar, Kr, Xe, Rn, Og. Nitrogen is in group 15, NOT group 18 — though both nitrogen and the noble gases are unreactive, nitrogen is unreactive due to its strong triple bond (N₂), while noble gases are unreactive due to full valence shells. Different reasons for similar behavior.',
  },
  {
    id: 'per-19', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'medium',
    question: 'The alkali metals (Group 1) share which common characteristic?',
    options: ['They are unreactive', 'They have 1 valence electron and readily lose it to form +1 ions', 'They are gases at room temperature', 'They have 7 valence electrons'],
    correctAnswers: [1],
    explanation: 'Group 1 elements (Li, Na, K, Rb, Cs, Fr — excluding H) all have one valence electron in an ns¹ configuration. They easily lose this electron to form +1 cations, making them the most reactive metals — sodium reacts violently with water, cesium even more so. Their common chemistry comes directly from that single valence electron.',
  },
  {
    id: 'per-20', domain: 1, subdomain: 'Periodic Table', type: 'yesno', difficulty: 'easy',
    question: 'Are atoms with more protons necessarily larger than atoms with fewer protons?',
    options: ['Yes', 'No'],
    correctAnswers: [1],
    explanation: 'No — within a period, more protons actually means SMALLER atoms (radius decreases left to right because added nuclear charge pulls electrons in tighter, with no new shells). Atomic size depends on both proton count and which electron shells are occupied. Element by element across a period, the trend can be counterintuitive.',
  },
  {
    id: 'per-21', domain: 1, subdomain: 'Periodic Table', type: 'single', difficulty: 'hard',
    question: 'Which trend in electronegativity is correct?',
    options: ['Increases down a group', 'Increases left to right across a period AND decreases down a group', 'Stays constant across a period', 'Highest at the bottom of the periodic table'],
    correctAnswers: [1],
    explanation: 'Electronegativity (ability to attract electrons in a bond) increases left-to-right (more protons, smaller atom = stronger pull) and decreases top-to-bottom (more shells, larger atom = weaker pull). Fluorine has the highest electronegativity. The trend mirrors ionization energy and explains polarity and ionic character of bonds.',
  },

  // ─── Matter & Measurement ──────────────────────────────────────
  {
    id: 'mm-16', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'easy',
    question: 'A solid melting into a liquid is what kind of change?',
    options: ['Chemical change — new substance formed', 'Physical change — same substance, different state', 'Nuclear change', 'Both chemical and physical'],
    correctAnswers: [1],
    explanation: 'Melting is a physical change — the molecular identity is unchanged (H₂O is still H₂O, whether ice or water). Phase changes (melting, freezing, evaporating, condensing) and dissolving are physical changes. Chemical changes break and form bonds, producing new substances with new properties (combustion, rusting, neutralization).',
  },
  {
    id: 'mm-17', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'medium',
    question: 'How many significant figures are in the measurement 0.0420 g?',
    options: ['2', '3', '4', '5'],
    correctAnswers: [1],
    explanation: 'Three sig figs: 4, 2, and the trailing 0 (after the decimal). Leading zeros (the 0.0 part) are placeholders and do not count. Trailing zeros to the right of the decimal DO count because they indicate measurement precision. Rules: nonzero digits always count; captive zeros count; leading zeros never count; trailing zeros count only after a decimal.',
  },
  {
    id: 'mm-18', domain: 1, subdomain: 'Matter & Measurement', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are mixtures (not pure substances)? (Select all that apply)',
    options: ['Saltwater', 'Air', 'Pure gold (Au)', 'Concrete'],
    correctAnswers: [0, 1, 3],
    explanation: 'Mixtures contain two or more substances physically combined (not chemically bonded). Saltwater (salt + water), air (N₂, O₂, Ar, CO₂…), and concrete (cement, sand, gravel, water) are all mixtures. Pure gold is an element — a pure substance composed of only one type of atom. Mixtures can be heterogeneous (concrete) or homogeneous (saltwater).',
  },
  {
    id: 'mm-19', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'medium',
    question: 'Convert 25 °C to Kelvin.',
    options: ['25 K', '248 K', '298 K', '323 K'],
    correctAnswers: [2],
    explanation: 'K = °C + 273.15 ≈ °C + 273. So 25 °C + 273 = 298 K. The Kelvin scale starts at absolute zero (−273.15 °C), the theoretical lowest temperature possible. Always use Kelvin in gas-law calculations (PV=nRT) — using Celsius gives wildly wrong answers because gas equations require absolute temperature.',
  },
  {
    id: 'mm-20', domain: 1, subdomain: 'Matter & Measurement', type: 'yesno', difficulty: 'easy',
    question: 'Is the density of a substance an intensive (not depending on amount) property?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes — density (mass/volume) is intensive. The density of water at 25 °C is 0.997 g/mL whether you have 1 mL or 1000 mL. Other intensive properties: melting point, boiling point, color. Extensive properties depend on amount: mass, volume, total energy. Intensive properties are useful for identifying unknown substances.',
  },
  {
    id: 'mm-21', domain: 1, subdomain: 'Matter & Measurement', type: 'single', difficulty: 'hard',
    question: 'A rock has mass 75.0 g and displaces 25.0 mL of water. What is its density?',
    options: ['1.0 g/mL', '3.0 g/mL', '50.0 g/mL', '0.33 g/mL'],
    correctAnswers: [1],
    explanation: 'Density = mass/volume = 75.0 g / 25.0 mL = 3.0 g/mL. The water-displacement method finds volume of irregular solids: place the object in water and measure how much the water level rises. Most rocks have densities between 2.5 and 5 g/mL; gold is about 19.3; lead is 11.3; ice is 0.92.',
  },

  // ─── States of Matter & Thermodynamics ─────────────────────────
  {
    id: 'states-14', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'Which gas law relates pressure and volume at constant temperature?',
    options: ['Charles\'s Law', 'Boyle\'s Law', 'Gay-Lussac\'s Law', 'Avogadro\'s Law'],
    correctAnswers: [1],
    explanation: 'Boyle\'s Law: P₁V₁ = P₂V₂ at constant T and n. Pressure and volume are inversely related — squeeze a gas and pressure rises proportionally. Charles\'s Law relates V and T at constant P. Gay-Lussac\'s relates P and T at constant V. Avogadro\'s says equal V at same T and P contain equal moles.',
  },
  {
    id: 'states-15', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'In the ideal gas law PV = nRT, what does R represent?',
    options: ['Reaction rate', 'The ideal gas constant', 'Radius', 'Reactant ratio'],
    correctAnswers: [1],
    explanation: 'R is the universal gas constant — the same for all ideal gases. Common values: R = 0.0821 L·atm/(mol·K) when using atm/liters, or R = 8.314 J/(mol·K) for SI energy units. The ideal gas law works well at low pressure and high temperature; real gases deviate at high P and low T.',
  },
  {
    id: 'states-16', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'multi', difficulty: 'medium',
    question: 'Which statements about ΔH (enthalpy change) are TRUE? (Select all that apply)',
    options: ['ΔH < 0 means the reaction releases heat (exothermic)', 'ΔH > 0 means the reaction absorbs heat (endothermic)', 'Exothermic reactions feel cold to the touch', 'A combustion reaction has ΔH < 0'],
    correctAnswers: [0, 1, 3],
    explanation: 'ΔH negative (exothermic): system releases heat to surroundings; reaction feels HOT. ΔH positive (endothermic): system absorbs heat from surroundings; feels COLD. Combustion is the classic exothermic example. Endothermic example: dissolving ammonium nitrate in water (cold-pack).',
  },
  {
    id: 'states-17', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'yesno', difficulty: 'easy',
    question: 'Does sublimation refer to a substance going directly from solid to gas without passing through liquid?',
    options: ['Yes', 'No'],
    correctAnswers: [0],
    explanation: 'Yes. Sublimation: solid → gas directly (skipping liquid). Examples: dry ice (CO₂ solid sublimes to CO₂ gas), iodine crystals at room temperature, snow on a dry sunny day. The reverse process (gas → solid) is called deposition. Both require specific temperature-pressure combinations.',
  },
  {
    id: 'states-18', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'hard',
    question: 'A gas at 2.0 atm and 300 K is compressed to half its volume at constant temperature. What is the new pressure?',
    options: ['1.0 atm', '2.0 atm', '4.0 atm', '8.0 atm'],
    correctAnswers: [2],
    explanation: 'Boyle\'s Law at constant T: P₁V₁ = P₂V₂. If V₂ = V₁/2, then P₂ = 2·P₁ = 4.0 atm. Halve the volume, double the pressure. The relationship is exactly inverse — useful for understanding why scuba divers must equalize ear pressure as depth increases, or why a closed syringe gets harder to compress.',
  },
  {
    id: 'states-19', domain: 1, subdomain: 'States of Matter & Thermodynamics', type: 'single', difficulty: 'medium',
    question: 'What is the FIRST LAW of thermodynamics, in plain terms?',
    options: ['Heat always flows from hot to cold', 'Entropy of an isolated system always increases', 'Energy is conserved — cannot be created or destroyed, only transformed', 'Absolute zero cannot be reached'],
    correctAnswers: [2],
    explanation: 'First Law = conservation of energy. Energy can change form (kinetic ↔ potential, chemical ↔ heat) but the total energy of an isolated system is constant. The Second Law is about entropy increase. The Third Law is about absolute zero being unreachable. The First Law is the most-cited because it underpins all energy accounting.',
  },

  // ─── Reaction Kinetics, Equilibrium & Acids/Bases ──────────────
  {
    id: 'kinetic-14', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'What is the pH of a solution with [H⁺] = 1 × 10⁻⁴ M?',
    options: ['4', '10', '−4', '14'],
    correctAnswers: [0],
    explanation: 'pH = −log[H⁺] = −log(10⁻⁴) = 4. A pH of 4 is acidic (less than 7). The scale runs 0–14: 0–6 acidic, 7 neutral, 8–14 basic. Each pH unit corresponds to a 10× change in [H⁺] — so pH 2 has 100× more H⁺ than pH 4. Familiar pH values: stomach acid ≈ 2, lemon juice ≈ 2.5, milk ≈ 6.5, blood ≈ 7.4.',
  },
  {
    id: 'kinetic-15', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'A reaction is at equilibrium with the equation A + B ⇌ C. What happens to [C] if more A is added?',
    options: ['Decreases', 'Increases', 'Stays the same', 'Becomes zero'],
    correctAnswers: [1],
    explanation: 'Le Chatelier\'s Principle: a system at equilibrium responds to disturbance by shifting to counteract the change. Adding A shifts equilibrium right (toward products), so [C] increases. Similarly, removing C would also shift right; adding C would shift left. This is how chemists drive reactions in desired directions.',
  },
  {
    id: 'kinetic-16', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'multi', difficulty: 'medium',
    question: 'Which factors can change the rate of a chemical reaction? (Select all that apply)',
    options: ['Temperature', 'Concentration of reactants', 'Surface area (for solid reactants)', 'Presence of a catalyst'],
    correctAnswers: [0, 1, 2, 3],
    explanation: 'All four factors affect reaction rate. Higher T = more molecules with energy ≥ Ea = faster rate. Higher [reactant] = more collisions per second = faster rate. Greater surface area exposes more particles for collision. A catalyst lowers Ea, allowing more molecules to react — without itself being consumed.',
  },
  {
    id: 'kinetic-17', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'yesno', difficulty: 'medium',
    question: 'Does a catalyst change the equilibrium position of a reaction?',
    options: ['Yes', 'No'],
    correctAnswers: [1],
    explanation: 'No — a catalyst speeds up BOTH forward and reverse reactions equally, so equilibrium is reached faster but the final position is unchanged. The equilibrium constant K depends only on temperature, not catalyst presence. Catalysts are used to make reactions practical (faster) but cannot make energetically unfavorable reactions happen.',
  },
  {
    id: 'kinetic-18', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'hard',
    question: 'A solution has pH = 11. What is its [OH⁻]?',
    options: ['1 × 10⁻¹¹ M', '1 × 10⁻³ M', '1 × 10³ M', '11 M'],
    correctAnswers: [1],
    explanation: 'pH + pOH = 14, so pOH = 14 − 11 = 3. [OH⁻] = 10⁻³ M. Alternatively: [H⁺] = 10⁻¹¹, and [H⁺][OH⁻] = 10⁻¹⁴, so [OH⁻] = 10⁻¹⁴ / 10⁻¹¹ = 10⁻³ M. pH 11 is moderately basic — about the pH of household ammonia.',
  },
  {
    id: 'kinetic-19', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'Which of the following is a strong acid?',
    options: ['Acetic acid (CH₃COOH)', 'Carbonic acid (H₂CO₃)', 'Hydrochloric acid (HCl)', 'Ammonia (NH₃)'],
    correctAnswers: [2],
    explanation: 'HCl is one of the seven strong acids: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₃, HClO₄. Strong acids dissociate completely in water — every HCl molecule donates its H⁺. Weak acids (acetic, carbonic, hydrofluoric) dissociate only partially, reaching an equilibrium. Ammonia (NH₃) is a weak base, not an acid.',
  },
  {
    id: 'kinetic-20', domain: 1, subdomain: 'Reaction Kinetics, Equilibrium & Acids/Bases', type: 'single', difficulty: 'medium',
    question: 'In an acid-base neutralization reaction (e.g., HCl + NaOH → NaCl + H₂O), what are the products?',
    options: ['A salt and water', 'A new acid and a new base', 'Two new acids', 'Just water'],
    correctAnswers: [0],
    explanation: 'A neutralization reaction produces a salt (ionic compound from the acid\'s anion and the base\'s cation) plus water. HCl + NaOH gives NaCl (table salt) and H₂O. The defining feature: H⁺ from the acid combines with OH⁻ from the base to make water; the leftover ions form the salt. The pH moves toward 7 — neutral — hence the name.',
  },
];
