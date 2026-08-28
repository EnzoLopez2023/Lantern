// Flashcard deck for CHEM — SC Chemistry (11th-grade).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Matter & Measurement ===
  {
    id: 'mm-fc-1',
    topic: 'Matter & Measurement',
    front: 'What is the difference between a physical change and a chemical change?',
    back: 'Physical change: alters form or appearance but NOT chemical identity (melting ice, tearing paper). Chemical change: produces new substances with different properties (burning, rusting, cooking). Key clue — chemical changes are usually irreversible and produce new smells, gases, color, or light.',
  },
  {
    id: 'mm-fc-2',
    topic: 'Matter & Measurement',
    front: 'What are the rules for counting significant figures?',
    back: 'Non-zero digits are always significant. Zeros BETWEEN nonzeros are significant (1007 = 4 sig figs). Leading zeros are NEVER significant (0.0032 = 2 sig figs). Trailing zeros AFTER a decimal ARE significant (3.40 = 3 sig figs). Trailing zeros WITHOUT a decimal are ambiguous (use scientific notation to clarify).',
  },
  {
    id: 'mm-fc-3',
    topic: 'Matter & Measurement',
    front: 'What is the difference between accuracy and precision?',
    back: 'Accuracy: how close a measurement is to the TRUE value. Precision: how REPRODUCIBLE (consistent) measurements are with each other. A dartboard analogy: accurate = near the bullseye. Precise = clustered tightly together (even if away from bullseye). You want both.',
  },
  {
    id: 'mm-fc-4',
    topic: 'Matter & Measurement',
    front: 'What is the difference between intensive and extensive properties?',
    back: 'Intensive properties do NOT depend on the amount of substance: density, temperature, boiling point, color, hardness. Extensive properties DO depend on amount: mass, volume, length, energy. A drop and an ocean of water both have density 1.00 g/cm³ (intensive), but very different volumes (extensive).',
  },
  {
    id: 'mm-fc-5',
    topic: 'Matter & Measurement',
    front: 'How do you convert between Celsius and Kelvin?',
    back: 'K = °C + 273.15 (or use 273 for most problems). The Kelvin scale starts at absolute zero (0 K = −273°C), the coldest possible temperature. All gas law calculations require Kelvin — never plug in Celsius. 0°C = 273 K, 25°C = 298 K, 100°C = 373 K.',
  },
  {
    id: 'mm-fc-6',
    topic: 'Matter & Measurement',
    front: 'What is the difference between a homogeneous and a heterogeneous mixture?',
    back: 'Homogeneous (solution): uniform composition throughout — you cannot see the parts (salt water, air, brass). Heterogeneous: visibly non-uniform — you can see distinct phases or components (sand and water, trail mix, oil and water). Pure substances (elements and compounds) are NOT mixtures.',
  },

  // === Atomic Structure ===
  {
    id: 'at-fc-1',
    topic: 'Atomic Structure',
    front: 'What are the three subatomic particles and their charges, masses, and locations?',
    back: 'Proton: charge +1, mass ≈ 1 amu, located in the nucleus. Neutron: charge 0, mass ≈ 1 amu, located in the nucleus. Electron: charge −1, mass ≈ 1/1836 amu, located in electron shells outside the nucleus. Nearly all the atom\'s mass is in the nucleus; nearly all its volume is empty space.',
  },
  {
    id: 'at-fc-2',
    topic: 'Atomic Structure',
    front: 'What is the difference between atomic number and mass number?',
    back: 'Atomic number (Z) = number of protons — defines the element. Mass number (A) = protons + neutrons. Isotopes have the same Z (same element) but different A (different neutron count). Example: C-12 has Z=6, A=12 (6 neutrons); C-14 has Z=6, A=14 (8 neutrons).',
  },
  {
    id: 'at-fc-3',
    topic: 'Atomic Structure',
    front: 'How do you write an electron configuration? What is the order of filling subshells?',
    back: 'Fill in order of increasing energy using the Aufbau principle: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p… Each s holds 2e, each p holds 6e, each d holds 10e. Example — Cl (Z=17): 1s²2s²2p⁶3s²3p⁵. Valence electrons are in the highest n level (3s²3p⁵ for Cl = 7 valence electrons).',
  },
  {
    id: 'at-fc-4',
    topic: 'Atomic Structure',
    front: 'What are the four quantum numbers and what does each describe?',
    back: 'n (principal): energy level / shell (1, 2, 3…). l (angular momentum): subshell shape (0=s, 1=p, 2=d, 3=f); values 0 to n−1. mₗ (magnetic): orbital orientation; values −l to +l. mₛ (spin): electron spin, +½ or −½ only. No two electrons can have all four quantum numbers identical (Pauli Exclusion Principle).',
  },
  {
    id: 'at-fc-5',
    topic: 'Atomic Structure',
    front: 'How did Rutherford\'s gold foil experiment change the atomic model?',
    back: 'Rutherford fired alpha particles at thin gold foil. Expected: particles pass straight through (Thomson\'s plum-pudding model). Observed: most passed through, but some deflected sharply or bounced back. Conclusion: the atom is mostly empty space with a tiny, dense, positively charged nucleus. Replaced the plum-pudding model.',
  },
  {
    id: 'at-fc-6',
    topic: 'Atomic Structure',
    front: 'What is average atomic mass and how is it calculated?',
    back: 'Average atomic mass = weighted average of all naturally occurring isotopes, based on their relative abundances. Formula: Σ (mass × fractional abundance). Example: chlorine — (35 × 0.7577) + (37 × 0.2423) ≈ 35.45 amu. This is the value on the periodic table.',
  },

  // === Periodic Table ===
  {
    id: 'pt-fc-1',
    topic: 'Periodic Table',
    front: 'Summarize the main periodic trends in atomic radius, ionization energy, and electronegativity.',
    back: 'Atomic radius: increases DOWN a group (more shells), DECREASES across a period (more protons pull electrons in). Ionization energy: INCREASES across a period, decreases down a group. Electronegativity: INCREASES up and to the right (fluorine is highest). All three trends are driven by nuclear charge vs. electron shielding.',
  },
  {
    id: 'pt-fc-2',
    topic: 'Periodic Table',
    front: 'What is ionization energy, and why does it increase across a period?',
    back: 'First ionization energy: the energy required to remove the outermost electron from a neutral gaseous atom. Increases across a period because more protons hold electrons more tightly (greater effective nuclear charge). Decreases down a group because valence electrons are farther from the nucleus and more shielded.',
  },
  {
    id: 'pt-fc-3',
    topic: 'Periodic Table',
    front: 'What makes an element a metal, nonmetal, or metalloid?',
    back: 'Metals (left/center of table): shiny, malleable, ductile, conduct heat and electricity, tend to lose electrons. Nonmetals (upper right): dull, brittle as solids, poor conductors, tend to gain electrons. Metalloids (staircase boundary, e.g., Si, Ge, As): intermediate properties, semiconductors. Hydrogen is a special case — nonmetal despite being in Group 1.',
  },
  {
    id: 'pt-fc-4',
    topic: 'Periodic Table',
    front: 'What do elements in the same GROUP have in common, and what do elements in the same PERIOD have in common?',
    back: 'Same GROUP: same number of valence electrons → similar chemical properties (e.g., all alkali metals have 1 valence electron). Same PERIOD: valence electrons in the same principal energy level (same n). Moving across a period, electrons are added to the same shell while protons increase.',
  },
  {
    id: 'pt-fc-5',
    topic: 'Periodic Table',
    front: 'Why are noble gases (Group 18) essentially nonreactive?',
    back: 'Noble gases (He, Ne, Ar, Kr, Xe, Rn) have completely filled outer electron shells (8 valence electrons, or 2 for helium). This configuration is the most stable possible — they have no tendency to gain, lose, or share electrons. They have the highest ionization energies and lowest electron affinities of their periods.',
  },

  // --- First 20 elements: symbol recognition (symbol → identity) ---
  {
    id: 'pt-el-h-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol H stand for, and where does it sit on the table?',
    back: 'Hydrogen. Atomic number 1, atomic mass 1.008 amu. Period 1, printed above Group 1 — but it is a NONMETAL, not an alkali metal. Configuration 1s¹, so 1 valence electron. Lightest element and the most abundant in the universe; exists as diatomic H₂ gas.',
  },
  {
    id: 'pt-el-he-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol He stand for, and where does it sit on the table?',
    back: 'Helium. Atomic number 2, atomic mass 4.003 amu. Period 1, Group 18 — a noble gas. Configuration 1s², which fills the entire first shell. Helium is the exception to the octet rule: it needs only 2 valence electrons to be full, so it is chemically inert and monatomic.',
  },
  {
    id: 'pt-el-li-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Li stand for, and where does it sit on the table?',
    back: 'Lithium. Atomic number 3, atomic mass 6.94 amu. Period 2, Group 1 — the first true alkali metal. Configuration [He]2s¹, so 1 valence electron; it loses it to form Li⁺. Lightest of all metals and the least reactive alkali metal (reactivity increases DOWN Group 1).',
  },
  {
    id: 'pt-el-be-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Be stand for, and where does it sit on the table?',
    back: 'Beryllium. Atomic number 4, atomic mass 9.012 amu. Period 2, Group 2 — an alkaline earth metal. Configuration [He]2s², so 2 valence electrons; forms Be²⁺. It is the smallest Group 2 atom, which gives it the highest ionization energy in its group.',
  },
  {
    id: 'pt-el-b-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol B stand for, and where does it sit on the table?',
    back: 'Boron. Atomic number 5, atomic mass 10.81 amu. Period 2, Group 13. Configuration [He]2s²2p¹, so 3 valence electrons. Boron is the FIRST metalloid — it sits at the top of the staircase that divides metals from nonmetals.',
  },
  {
    id: 'pt-el-c-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol C stand for, and where does it sit on the table?',
    back: 'Carbon. Atomic number 6, atomic mass 12.01 amu. Period 2, Group 14 — a nonmetal. Configuration [He]2s²2p², so 4 valence electrons, meaning it forms 4 covalent bonds. Carbon is the backbone of all organic chemistry, and its allotropes include diamond, graphite, and graphene.',
  },
  {
    id: 'pt-el-n-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol N stand for, and where does it sit on the table?',
    back: 'Nitrogen. Atomic number 7, atomic mass 14.01 amu. Period 2, Group 15 — a nonmetal. Configuration [He]2s²2p³, so 5 valence electrons; gains 3 to form the nitride ion N³⁻. Diatomic N₂ makes up about 78% of the atmosphere and is very unreactive because of its strong triple bond.',
  },
  {
    id: 'pt-el-o-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol O stand for, and where does it sit on the table?',
    back: 'Oxygen. Atomic number 8, atomic mass 16.00 amu. Period 2, Group 16 (the chalcogens) — a nonmetal. Configuration [He]2s²2p⁴, so 6 valence electrons; gains 2 to form the oxide ion O²⁻. Diatomic O₂ is about 21% of the atmosphere, and oxygen is the most abundant element in the crust of the Earth.',
  },
  {
    id: 'pt-el-f-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol F stand for, and where does it sit on the table?',
    back: 'Fluorine. Atomic number 9, atomic mass 19.00 amu. Period 2, Group 17 — a halogen. Configuration [He]2s²2p⁵, so 7 valence electrons; gains 1 to form fluoride, F⁻. Fluorine is the MOST electronegative element (about 4.0) and the most reactive nonmetal. Exists as diatomic F₂.',
  },
  {
    id: 'pt-el-ne-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Ne stand for, and where does it sit on the table?',
    back: 'Neon. Atomic number 10, atomic mass 20.18 amu. Period 2, Group 18 — a noble gas. Configuration [He]2s²2p⁶, a complete octet of 8 valence electrons. That full shell is why neon is inert and monatomic, and why the [Ne] core shows up in every Period 3 configuration.',
  },
  {
    id: 'pt-el-na-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Na stand for, and where does it sit on the table?',
    back: 'Sodium. Atomic number 11, atomic mass 22.99 amu. Period 3, Group 1 — an alkali metal. Configuration [Ne]3s¹, so 1 valence electron; forms Na⁺. The symbol comes from the Latin natrium, not the English name — a classic memorization trap. Reacts violently with water.',
  },
  {
    id: 'pt-el-mg-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Mg stand for, and where does it sit on the table?',
    back: 'Magnesium. Atomic number 12, atomic mass 24.31 amu. Period 3, Group 2 — an alkaline earth metal. Configuration [Ne]3s², so 2 valence electrons; forms Mg²⁺. Burns with a brilliant white flame and is the central atom in chlorophyll.',
  },
  {
    id: 'pt-el-al-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Al stand for, and where does it sit on the table?',
    back: 'Aluminum. Atomic number 13, atomic mass 26.98 amu. Period 3, Group 13 — a post-transition metal (NOT a metalloid; the staircase passes to its right). Configuration [Ne]3s²3p¹, so 3 valence electrons; forms Al³⁺. Most abundant METAL in the crust of the Earth.',
  },
  {
    id: 'pt-el-si-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Si stand for, and where does it sit on the table?',
    back: 'Silicon. Atomic number 14, atomic mass 28.09 amu. Period 3, Group 14 — a metalloid on the staircase. Configuration [Ne]3s²3p², so 4 valence electrons. Its metalloid character makes it a semiconductor, which is why it is the basis of computer chips. Second most abundant element in the crust.',
  },
  {
    id: 'pt-el-p-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol P stand for, and where does it sit on the table?',
    back: 'Phosphorus. Atomic number 15, atomic mass 30.97 amu. Period 3, Group 15 — a nonmetal. Configuration [Ne]3s²3p³, so 5 valence electrons; gains 3 to form phosphide, P³⁻. Essential to DNA and ATP; its allotropes include white and red phosphorus.',
  },
  {
    id: 'pt-el-s-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol S stand for, and where does it sit on the table?',
    back: 'Sulfur. Atomic number 16, atomic mass 32.06 amu. Period 3, Group 16 (the chalcogens) — a nonmetal. Configuration [Ne]3s²3p⁴, so 6 valence electrons; gains 2 to form sulfide, S²⁻. A yellow solid that exists as puckered S₈ rings.',
  },
  {
    id: 'pt-el-cl-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Cl stand for, and where does it sit on the table?',
    back: 'Chlorine. Atomic number 17, atomic mass 35.45 amu. Period 3, Group 17 — a halogen. Configuration [Ne]3s²3p⁵, so 7 valence electrons; gains 1 to form chloride, Cl⁻. The odd 35.45 mass is a weighted AVERAGE of roughly 75% Cl-35 and 25% Cl-37 — the standard isotope-abundance example.',
  },
  {
    id: 'pt-el-ar-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Ar stand for, and where does it sit on the table?',
    back: 'Argon. Atomic number 18, atomic mass 39.95 amu. Period 3, Group 18 — a noble gas. Configuration [Ne]3s²3p⁶, a complete octet. Makes up about 1% of the atmosphere and is used as an inert shielding gas in welding. The [Ar] core opens every Period 4 configuration.',
  },
  {
    id: 'pt-el-k-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol K stand for, and where does it sit on the table?',
    back: 'Potassium. Atomic number 19, atomic mass 39.10 amu. Period 4, Group 1 — an alkali metal. Configuration [Ar]4s¹, so 1 valence electron; forms K⁺. The symbol comes from the Latin kalium. More reactive than sodium because its valence electron is farther from the nucleus and better shielded.',
  },
  {
    id: 'pt-el-ca-sym',
    topic: 'Periodic Table',
    front: 'What element does the symbol Ca stand for, and where does it sit on the table?',
    back: 'Calcium. Atomic number 20, atomic mass 40.08 amu. Period 4, Group 2 — an alkaline earth metal. Configuration [Ar]4s², so 2 valence electrons; forms Ca²⁺. Structural component of bones and teeth, and the metal in limestone, CaCO₃.',
  },

  // --- First 20 elements: reverse recall (name → symbol, number, ion) ---
  {
    id: 'pt-el-h-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for hydrogen.',
    back: 'H, atomic number 1. One proton, and one electron when neutral. Usually forms H⁺ (a bare proton — this is what defines an acid), but it can also gain an electron to form the hydride ion H⁻ when bonded to an active metal. Group 1 by position, nonmetal by behavior.',
  },
  {
    id: 'pt-el-he-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for helium.',
    back: 'He, atomic number 2. Two protons, two electrons. Forms NO common ion — its 1s² shell is already full, so it neither gains nor loses electrons. Note the lowercase second letter: He is helium, but H + E as separate symbols would be something else entirely.',
  },
  {
    id: 'pt-el-li-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for lithium.',
    back: 'Li, atomic number 3. Three protons. Loses its single 2s electron to form Li⁺, which is isoelectronic with helium. As a 1+ cation it is much SMALLER than the neutral atom, because losing the 2s electron removes an entire shell.',
  },
  {
    id: 'pt-el-be-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for beryllium.',
    back: 'Be, atomic number 4. Four protons. Loses both 2s electrons to form Be²⁺, isoelectronic with helium. Group 2, so the charge is 2+ — the pattern for every alkaline earth metal.',
  },
  {
    id: 'pt-el-b-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and valence electron count for boron.',
    back: 'B, atomic number 5, 3 valence electrons (Group 13 → 13 minus 10 = 3). Boron rarely forms simple ions; with only 3 valence electrons it usually bonds covalently and ends up electron-deficient, as in BF₃. It is a metalloid.',
  },
  {
    id: 'pt-el-c-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and bonding behavior for carbon.',
    back: 'C, atomic number 6, 4 valence electrons (Group 14). Carbon almost never forms ions — gaining or losing 4 electrons costs too much energy. Instead it shares, forming 4 covalent bonds, which is exactly why it can build the enormous chains and rings of organic chemistry.',
  },
  {
    id: 'pt-el-n-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for nitrogen.',
    back: 'N, atomic number 7. Five valence electrons (Group 15), so it gains 3 to reach an octet, forming the nitride ion N³⁻. Elemental nitrogen is diatomic N₂ with a triple bond, one of the strongest bonds in chemistry — that is why N₂ is so inert.',
  },
  {
    id: 'pt-el-o-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for oxygen.',
    back: 'O, atomic number 8. Six valence electrons (Group 16), so it gains 2 to form the oxide ion O²⁻. Second most electronegative element after fluorine. Elemental form is diatomic O₂; the ozone allotrope is O₃.',
  },
  {
    id: 'pt-el-f-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for fluorine.',
    back: 'F, atomic number 9. Seven valence electrons (Group 17), so it gains exactly 1 to form fluoride, F⁻ — isoelectronic with neon. Highest electronegativity of any element, which makes it the reference point for the whole trend.',
  },
  {
    id: 'pt-el-ne-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for neon.',
    back: 'Ne, atomic number 10. Eight valence electrons — a full octet — so it forms NO ion and no compounds under normal conditions. Its configuration is the target that Na⁺, Mg²⁺, Al³⁺, N³⁻, O²⁻, and F⁻ are all reaching for.',
  },
  {
    id: 'pt-el-na-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for sodium.',
    back: 'Na (from Latin natrium), atomic number 11. One valence electron (Group 1), lost to form Na⁺, isoelectronic with neon. A neutral sodium atom has 11 electrons; Na⁺ has 10. Its most common isotope, mass number 23, has 12 neutrons.',
  },
  {
    id: 'pt-el-mg-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for magnesium.',
    back: 'Mg, atomic number 12. Two valence electrons (Group 2), both lost to form Mg²⁺, isoelectronic with neon. Mg²⁺ is noticeably smaller than Na⁺ even though both have 10 electrons, because magnesium has one more proton pulling them in.',
  },
  {
    id: 'pt-el-al-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for aluminum.',
    back: 'Al, atomic number 13. Three valence electrons (Group 13), all lost to form Al³⁺ — the highest common cation charge you will meet among the first 20 elements. Al³⁺ is also isoelectronic with neon and is the smallest of the Na⁺ / Mg²⁺ / Al³⁺ set.',
  },
  {
    id: 'pt-el-si-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and valence electron count for silicon.',
    back: 'Si, atomic number 14, 4 valence electrons (Group 14). Like carbon it bonds covalently rather than forming simple ions. Sitting directly below carbon means it shares the same valence count, which is exactly what group membership predicts.',
  },
  {
    id: 'pt-el-p-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for phosphorus.',
    back: 'P, atomic number 15. Five valence electrons (Group 15), so it gains 3 to form phosphide, P³⁻, isoelectronic with argon. Do not confuse the element P with the phosphate polyatomic ion, PO₄³⁻.',
  },
  {
    id: 'pt-el-s-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for sulfur.',
    back: 'S, atomic number 16. Six valence electrons (Group 16), so it gains 2 to form sulfide, S²⁻, isoelectronic with argon. Directly below oxygen, so it mirrors oxygen chemistry — compare H₂O with H₂S.',
  },
  {
    id: 'pt-el-cl-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for chlorine.',
    back: 'Cl, atomic number 17. Seven valence electrons (Group 17), so it gains 1 to form chloride, Cl⁻, isoelectronic with argon. Elemental chlorine is diatomic Cl₂, a greenish-yellow gas. Cl⁻ is the anion in table salt, NaCl.',
  },
  {
    id: 'pt-el-ar-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for argon.',
    back: 'Ar, atomic number 18. Eight valence electrons — a full octet — so it forms NO ion. Argon is the noble-gas configuration that P³⁻, S²⁻, Cl⁻, K⁺, and Ca²⁺ all match, which makes it the anchor for isoelectronic questions in Period 3 and 4.',
  },
  {
    id: 'pt-el-k-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for potassium.',
    back: 'K (from Latin kalium), atomic number 19. One valence electron in the 4s orbital (Group 1), lost to form K⁺, isoelectronic with argon. Nineteen protons; a neutral atom has 19 electrons, K⁺ has 18.',
  },
  {
    id: 'pt-el-ca-name',
    topic: 'Periodic Table',
    front: 'Give the symbol, atomic number, and common ion for calcium.',
    back: 'Ca, atomic number 20. Two valence electrons (Group 2), both lost to form Ca²⁺, isoelectronic with argon. Twenty protons. Ca²⁺ is smaller than K⁺ despite both having 18 electrons, because calcium has one more proton.',
  },

  // --- First 20 elements: patterns and families ---
  {
    id: 'pt-pat-order',
    topic: 'Periodic Table',
    front: 'List the first 20 elements in order by atomic number.',
    back: 'H, He, Li, Be, B, C, N, O, F, Ne, Na, Mg, Al, Si, P, S, Cl, Ar, K, Ca. They break into rows: Period 1 is just H and He (2 elements); Period 2 runs Li through Ne (8 elements); Period 3 runs Na through Ar (8 elements); K and Ca open Period 4. That 2-8-8 pattern is shell capacity showing up as table structure.',
  },
  {
    id: 'pt-pat-alkali',
    topic: 'Periodic Table',
    front: 'Which of the first 20 elements are alkali metals, and what do they share?',
    back: 'Li, Na, and K. Hydrogen is PRINTED in Group 1 but is a nonmetal and does not count. All alkali metals have 1 valence electron, form 1+ ions, are soft and highly reactive, and react with water to produce hydrogen gas plus a strong base. Reactivity INCREASES down the group, so K is more reactive than Na, which is more reactive than Li.',
  },
  {
    id: 'pt-pat-alkaline',
    topic: 'Periodic Table',
    front: 'Which of the first 20 elements are alkaline earth metals, and what do they share?',
    back: 'Be, Mg, and Ca. Group 2, so 2 valence electrons and 2+ ions in every case. They are harder, denser, and less reactive than the alkali metals next door, because removing two electrons costs more energy than removing one. Reactivity still increases down the group: Ca reacts with water, Mg barely does, Be does not.',
  },
  {
    id: 'pt-pat-halogens',
    topic: 'Periodic Table',
    front: 'Which of the first 20 elements are halogens, and what do they share?',
    back: 'Fluorine and chlorine (bromine, iodine, and astatine come later). Group 17, so 7 valence electrons — they need just one more for an octet, which makes them the most reactive nonmetals. They form 1− ions, exist as diatomic molecules, and combine with metals to make salts. Reactivity DECREASES down the group, the opposite of the metals.',
  },
  {
    id: 'pt-pat-noble',
    topic: 'Periodic Table',
    front: 'Which of the first 20 elements are noble gases, and what do they share?',
    back: 'He, Ne, and Ar. Group 18, all with full outer shells — 8 valence electrons for neon and argon, but only 2 for helium, which fills the entire first shell. They form no common ions, have the highest ionization energies in their periods, and end every period on the table.',
  },
  {
    id: 'pt-pat-metalloids',
    topic: 'Periodic Table',
    front: 'Which of the first 20 elements are metalloids, and where are they on the table?',
    back: 'Boron and silicon. They sit on the staircase line that separates metals (left) from nonmetals (right), so they show intermediate properties: they look metallic but are brittle, and they conduct electricity only partly, which makes them semiconductors. Aluminum touches the staircase but is a true metal, not a metalloid.',
  },
  {
    id: 'pt-pat-latin',
    topic: 'Periodic Table',
    front: 'Which symbols among the first 20 elements do not match their English names, and what is the capitalization rule?',
    back: 'Sodium is Na (Latin natrium) and potassium is K (Latin kalium). Everything else in the first 20 is the first letter or first two letters of the English name. Capitalization rule: the first letter is ALWAYS uppercase and the second is ALWAYS lowercase. Co is the element cobalt, but CO is the compound carbon monoxide — the case carries meaning.',
  },
  {
    id: 'pt-pat-mass-anomaly',
    topic: 'Periodic Table',
    front: 'Argon comes before potassium on the table, yet argon has the greater atomic mass. Why is that not an error?',
    back: 'Argon is 39.95 amu and potassium is 39.10 amu, so mass order is reversed — but the table is ordered by ATOMIC NUMBER (proton count), not mass. Argon has 18 protons and potassium has 19. Mendeleev originally ordered by mass and had to swap a few pairs by hand; Moseley resolved it in 1913 by showing that atomic number is the true organizing property.',
  },
  {
    id: 'pt-pat-valence',
    topic: 'Periodic Table',
    front: 'How do you read valence electron count straight off the group number for the first 20 elements?',
    back: 'Group 1 → 1 valence electron. Group 2 → 2. For Groups 13 through 18, subtract 10: Group 13 → 3, Group 14 → 4, Group 15 → 5, Group 16 → 6, Group 17 → 7, Group 18 → 8 (helium is the exception at 2). Because valence count resets each period, chemical properties repeat down each group — that repetition is the periodic law itself.',
  },
  {
    id: 'pt-pat-diatomic',
    topic: 'Periodic Table',
    front: 'Which of the first 20 elements exist as diatomic molecules in their standard state?',
    back: 'H₂, N₂, O₂, F₂, and Cl₂. The full list of seven diatomics adds Br₂ and I₂ from later periods. Mnemonic: Have No Fear Of Ice Cold Beer — Hydrogen, Nitrogen, Fluorine, Oxygen, Iodine, Chlorine, Bromine. This matters for equation balancing: writing O instead of O₂ for oxygen gas is a common mistake.',
  },

  // === Chemical Bonding ===
  {
    id: 'cb-fc-1',
    topic: 'Chemical Bonding',
    front: 'What are the three types of chemical bonds and when does each form?',
    back: 'Ionic: metal + nonmetal — electron TRANSFER, forms cations (+) and anions (−). Covalent: nonmetal + nonmetal — electron SHARING. Metallic: metal + metal — "sea of delocalized electrons." Rule of thumb: large electronegativity difference (> ~1.7) → ionic; small difference → nonpolar covalent; intermediate → polar covalent.',
  },
  {
    id: 'cb-fc-2',
    topic: 'Chemical Bonding',
    front: 'Explain VSEPR theory and how it predicts molecular geometry.',
    back: 'VSEPR (Valence Shell Electron Pair Repulsion): electron pairs (bonding + lone pairs) around a central atom repel each other and spread out to maximize separation. Lone pairs repel more strongly than bonding pairs. Count total electron pairs to get electron geometry; count only atom positions for molecular geometry.',
  },
  {
    id: 'cb-fc-3',
    topic: 'Chemical Bonding',
    front: 'Give the electron geometry and molecular geometry for a molecule with 4 bonding pairs and 0 lone pairs vs. 3 bonding pairs and 1 lone pair.',
    back: '4 bonding + 0 lone pairs: electron geometry = tetrahedral, molecular geometry = tetrahedral (e.g., CH₄), bond angles 109.5°. 3 bonding + 1 lone pair: electron geometry = tetrahedral, molecular geometry = trigonal pyramidal (e.g., NH₃), bond angles ≈107° because lone pair compresses the bonds.',
  },
  {
    id: 'cb-fc-4',
    topic: 'Chemical Bonding',
    front: 'What is electronegativity, and how does it determine bond polarity?',
    back: 'Electronegativity: the ability of an atom to attract bonding electrons. ΔEN = 0 → nonpolar covalent (identical atoms). ΔEN 0.1–1.7 → polar covalent (unequal sharing, partial charges δ+ and δ−). ΔEN > 1.7 → ionic (electron transfer). Fluorine (EN = 4.0) is the most electronegative element.',
  },
  {
    id: 'cb-fc-5',
    topic: 'Chemical Bonding',
    front: 'What are the three main types of intermolecular forces, from weakest to strongest?',
    back: 'London dispersion forces (van der Waals): present in ALL molecules, caused by temporary dipoles; stronger in larger, heavier molecules. Dipole-dipole: between polar molecules. Hydrogen bonds: strongest — H bonded to N, O, or F, creating unusually strong dipole interactions. IMFs explain differences in boiling points and solubility.',
  },
  {
    id: 'cb-fc-6',
    topic: 'Chemical Bonding',
    front: 'What is a Lewis structure, and what is the octet rule?',
    back: 'A Lewis structure (electron dot structure) shows valence electrons as dots around atomic symbols and shared electron pairs as lines (bonds). The octet rule: most atoms are most stable with 8 valence electrons (like a noble gas). Exceptions: H needs 2 (duet), B can have 6, and some elements like P and S can have more than 8 (expanded octet).',
  },

  // === Stoichiometry ===
  {
    id: 'st-fc-1',
    topic: 'Stoichiometry',
    front: 'What is the mole, and why is it useful in chemistry?',
    back: '1 mole = 6.022 × 10²³ particles (Avogadro\'s number). It is the "chemist\'s dozen" — a convenient counting unit that links the atomic scale (too small to see) to the laboratory scale (grams you can weigh). 1 mol of any element = its atomic mass in grams.',
  },
  {
    id: 'st-fc-2',
    topic: 'Stoichiometry',
    front: 'Describe the four-step mass-to-mass stoichiometry roadmap.',
    back: '1) Write and balance the chemical equation. 2) Convert given mass to moles: moles = mass ÷ molar mass. 3) Use the mole ratio from the balanced equation to find moles of wanted substance. 4) Convert moles of wanted substance to grams: mass = moles × molar mass. The mole ratio is the "bridge" between reactant and product.',
  },
  {
    id: 'st-fc-3',
    topic: 'Stoichiometry',
    front: 'How do you find the limiting reagent in a reaction?',
    back: 'Method: convert all reactants to moles, then divide each by its stoichiometric coefficient. The reactant with the SMALLEST result is limiting. Alternatively, calculate how much product each reactant would produce — the one that gives LESS product is the limiting reagent. The other reactant(s) are in excess.',
  },
  {
    id: 'st-fc-4',
    topic: 'Stoichiometry',
    front: 'What is the difference between empirical formula and molecular formula?',
    back: 'Empirical formula: lowest whole-number ratio of atoms in a compound (CH₂O for glucose). Molecular formula: actual count of each type of atom in one molecule (C₆H₁₂O₆ for glucose = 6 × CH₂O). To find molecular formula: divide molar mass by empirical formula mass to get n, then multiply all subscripts by n.',
  },
  {
    id: 'st-fc-5',
    topic: 'Stoichiometry',
    front: 'What is percent yield and why is it almost never 100%?',
    back: 'Percent yield = (actual yield / theoretical yield) × 100%. Theoretical yield: maximum amount calculated from stoichiometry assuming complete reaction. Actual yield: what you measure in the lab. Yield falls below 100% due to: side reactions, incomplete reactions, material loss during transfer, or reactant impurities.',
  },

  // === States of Matter & Thermodynamics ===
  {
    id: 'sm-fc-1',
    topic: 'States of Matter & Thermodynamics',
    front: 'State the three basic gas laws and the variable each holds constant.',
    back: 'Boyle\'s Law: P₁V₁ = P₂V₂ (constant T and n — pressure and volume are inversely proportional). Charles\'s Law: V₁/T₁ = V₂/T₂ (constant P and n — volume and temperature are directly proportional; T in Kelvin). Gay-Lussac\'s Law: P₁/T₁ = P₂/T₂ (constant V and n — pressure and temperature are directly proportional).',
  },
  {
    id: 'sm-fc-2',
    topic: 'States of Matter & Thermodynamics',
    front: 'State the ideal gas law and identify each variable.',
    back: 'PV = nRT. P = pressure (atm or Pa), V = volume (L or m³), n = moles of gas, R = gas constant (0.08206 L·atm/mol·K or 8.314 J/mol·K), T = temperature in Kelvin. Use R = 0.08206 when P is in atm and V in liters. The ideal gas law combines Boyle\'s, Charles\'s, and Avogadro\'s laws into one equation.',
  },
  {
    id: 'sm-fc-3',
    topic: 'States of Matter & Thermodynamics',
    front: 'What are the key assumptions of kinetic molecular theory (KMT)?',
    back: 'Gas molecules: (1) are point masses — volume is negligible compared to the container. (2) have no intermolecular forces. (3) move in constant, random, straight-line motion. (4) collide elastically (no net energy loss). (5) have average kinetic energy directly proportional to Kelvin temperature (KE_avg ∝ T). Real gases deviate from KMT at high pressure or low temperature.',
  },
  {
    id: 'sm-fc-4',
    topic: 'States of Matter & Thermodynamics',
    front: 'What is the difference between exothermic and endothermic reactions?',
    back: 'Exothermic: system releases heat to surroundings. ΔH < 0 (negative). Products have lower energy than reactants. Examples: combustion, hand warmers, neutralization. Endothermic: system absorbs heat FROM surroundings. ΔH > 0 (positive). Products have higher energy than reactants. Examples: photosynthesis, cold packs, baking bread.',
  },
  {
    id: 'sm-fc-5',
    topic: 'States of Matter & Thermodynamics',
    front: 'What is Hess\'s Law and how is it applied?',
    back: 'Hess\'s Law: the enthalpy change (ΔH) of a reaction is the same whether it occurs in one step or a series of steps — enthalpy is a state function. To apply: add or reverse known reactions (and their ΔH values) to obtain the target reaction. When you reverse a reaction, flip the sign of ΔH. When you multiply, multiply ΔH too.',
  },
  {
    id: 'sm-fc-6',
    topic: 'States of Matter & Thermodynamics',
    front: 'What is a phase diagram and what are the triple point and critical point?',
    back: 'A phase diagram plots pressure (y-axis) vs. temperature (x-axis) and shows which phase (solid, liquid, gas) is stable at each P-T combination. Triple point: unique P and T where all three phases coexist in equilibrium. Critical point: above this T and P, the liquid-gas distinction disappears and the substance becomes a supercritical fluid.',
  },

  // === Reaction Kinetics, Equilibrium & Acids/Bases ===
  {
    id: 'rk-fc-1',
    topic: 'Reaction Kinetics, Equilibrium & Acids/Bases',
    front: 'What is activation energy and how does a catalyst affect it?',
    back: 'Activation energy (Ea): the minimum energy that colliding reactants must have to break bonds and form products — the energy barrier of the reaction. A catalyst provides an alternative reaction pathway with a LOWER Ea, increasing the fraction of collisions that are successful. A catalyst is NOT consumed and does not change ΔH or Keq.',
  },
  {
    id: 'rk-fc-2',
    topic: 'Reaction Kinetics, Equilibrium & Acids/Bases',
    front: 'State Le Chatelier\'s Principle and explain what "stress" means in this context.',
    back: 'Le Chatelier\'s Principle: if a system at equilibrium is disturbed (stressed), it shifts in the direction that partially counteracts the disturbance. Stresses: (1) add/remove a reactant or product — shifts away from what was added, toward what was removed. (2) change pressure (gases) — shifts toward fewer moles of gas. (3) change temperature — shifts in endothermic direction if heated.',
  },
  {
    id: 'rk-fc-3',
    topic: 'Reaction Kinetics, Equilibrium & Acids/Bases',
    front: 'What is the equilibrium constant Kc, and what does its value tell you?',
    back: 'For aA + bB ⇌ cC + dD: Kc = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ) — concentrations at equilibrium, raised to stoichiometric powers. Kc >> 1 → products strongly favored (reaction goes nearly to completion). Kc << 1 → reactants strongly favored. Kc ≈ 1 → significant amounts of both reactants and products at equilibrium. Kc depends on temperature only.',
  },
  {
    id: 'rk-fc-4',
    topic: 'Reaction Kinetics, Equilibrium & Acids/Bases',
    front: 'Compare the Arrhenius and Brønsted-Lowry definitions of acids and bases.',
    back: 'Arrhenius: acid produces H⁺ in water; base produces OH⁻ in water. (Only applies to aqueous solutions.) Brønsted-Lowry (broader): acid = H⁺ donor; base = H⁺ acceptor. Works in non-aqueous systems. Every acid has a conjugate base (acid minus H⁺); every base has a conjugate acid (base plus H⁺). HCl donates H⁺ → conjugate base Cl⁻.',
  },
  {
    id: 'rk-fc-5',
    topic: 'Reaction Kinetics, Equilibrium & Acids/Bases',
    front: 'Explain the pH scale. What pH values correspond to acidic, neutral, and basic solutions?',
    back: 'pH = −log[H⁺] (negative log of the hydrogen ion concentration). Scale: 0–14. pH < 7: acidic (more H⁺ than OH⁻). pH = 7: neutral (pure water at 25°C). pH > 7: basic/alkaline. Each 1-unit change in pH = 10× change in [H⁺]. pH 3 is 100× more acidic than pH 5. pOH + pH = 14 (at 25°C).',
  },
  {
    id: 'rk-fc-6',
    topic: 'Reaction Kinetics, Equilibrium & Acids/Bases',
    front: 'What is a buffer solution and why does it resist pH changes?',
    back: 'A buffer is a solution containing a weak acid and its conjugate base (or a weak base and its conjugate acid) in comparable amounts. Adding H⁺: the base component neutralizes it. Adding OH⁻: the acid component neutralizes it. Blood (pH 7.35–7.45) is buffered by the carbonic acid/bicarbonate system — even small pH swings outside this range can be life-threatening.',
  },
];
