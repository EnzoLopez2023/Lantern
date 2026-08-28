// Glossary for CHEM — Chemistry (SC 11th-grade).

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // ── Matter & Measurement ──────────────────────────────────────────
  { term: 'Matter',                   definition: 'Anything that has mass and takes up space. Classified as pure substances (elements or compounds) or mixtures (homogeneous or heterogeneous). All chemistry is the study of matter and its transformations.' },
  { term: 'Physical property',        definition: 'A characteristic that can be observed or measured without changing the composition of the substance. Examples: melting point, density, color, solubility. Physical changes alter form but not chemical identity.' },
  { term: 'Chemical property',        definition: 'A characteristic that describes how a substance reacts or transforms into a different substance. Examples: flammability, reactivity with acid, ability to rust. Observed only when a chemical change occurs.' },
  { term: 'Significant figures',      definition: 'The meaningful digits in a measurement, reflecting the precision of the measuring instrument. When multiplying/dividing, round to the fewest sig figs in any measurement. When adding/subtracting, align by decimal places.' },
  { term: 'Density',                  definition: 'Mass per unit volume: d = m/V. An intensive property — it does not change with sample size. Used to identify substances and predict whether objects sink or float. SI unit: kg/m³ (or g/mL in lab work).' },
  { term: 'SI units',                 definition: 'The International System of Units — the metric system used in science. Base units include meter (length), kilogram (mass), second (time), kelvin (temperature), and mole (amount of substance).' },

  // ── Atomic Structure ──────────────────────────────────────────────
  { term: 'Atom',                     definition: 'The smallest particle of an element that retains the chemical properties of that element. Composed of a nucleus (protons + neutrons) surrounded by electrons in orbitals.' },
  { term: 'Proton',                   definition: 'Positively charged subatomic particle in the nucleus. The number of protons = atomic number, which defines the element. Protons have a relative mass of 1 amu.' },
  { term: 'Neutron',                  definition: 'Electrically neutral subatomic particle in the nucleus. Mass ≈ 1 amu. The number of neutrons = mass number − atomic number. Isotopes differ in neutron count.' },
  { term: 'Electron',                 definition: 'Negatively charged subatomic particle orbiting the nucleus. Mass ≈ 1/1836 amu (negligible). Valence electrons (outermost shell) determine chemical behavior and bonding.' },
  { term: 'Isotope',                  definition: 'Atoms of the same element with different numbers of neutrons, hence different mass numbers. ¹²C and ¹⁴C are isotopes of carbon. Isotopes of an element have the same chemical properties but different masses.' },
  { term: 'Electron configuration',   definition: 'The arrangement of electrons in an atom\'s orbitals, written in shorthand (e.g., 1s²2s²2p⁶ for neon). Follows the Aufbau principle (lowest energy first), Pauli exclusion principle (max 2 e⁻/orbital), and Hund\'s rule (fill orbitals singly first).' },
  { term: 'Valence electrons',        definition: 'Electrons in the outermost principal energy level. Determine bonding behavior and chemical reactivity. Elements in the same group of the periodic table have the same number of valence electrons.' },

  // ── Periodic Table ────────────────────────────────────────────────
  { term: 'Period',                   definition: 'A horizontal row in the periodic table. Elements in the same period have the same highest principal energy level (n) for their valence electrons. Atomic number increases left to right across a period.' },
  { term: 'Group',                    definition: 'A vertical column in the periodic table. Elements in the same group have the same number of valence electrons and similar chemical properties. Also called a "family" (e.g., alkali metals, halogens, noble gases).' },
  { term: 'Atomic radius',            definition: 'Half the distance between nuclei of bonded atoms of the same element. Decreases left-to-right across a period (increasing nuclear charge pulls electrons in) and increases top-to-bottom down a group (more electron shells added).' },
  { term: 'Ionization energy',        definition: 'The energy required to remove the outermost electron from a gaseous atom. Increases left-to-right across a period and decreases top-to-bottom down a group. High IE → atom holds electrons tightly → tends toward nonmetal behavior.' },
  { term: 'Electronegativity',        definition: 'The tendency of an atom to attract shared electrons in a bond. Increases left-to-right and bottom-to-top (fluorine is highest). The difference in electronegativity determines bond polarity.' },

  // ── Chemical Bonding ──────────────────────────────────────────────
  { term: 'Ionic bond',               definition: 'A chemical bond formed by the electrostatic attraction between oppositely charged ions. Occurs when electronegativity difference is large (typically > 1.7). Metal atoms lose electrons → cations; nonmetals gain electrons → anions.' },
  { term: 'Covalent bond',            definition: 'A chemical bond formed by the sharing of electron pairs between atoms. Occurs between nonmetals with similar electronegativities. Can be single (2 e⁻ shared), double (4 e⁻), or triple (6 e⁻).' },
  { term: 'Polar covalent bond',      definition: 'A covalent bond where electrons are shared unequally because of an electronegativity difference. The more electronegative atom has a partial negative charge (δ−) and the other a partial positive (δ+). Creates a bond dipole.' },
  { term: 'Lewis structure',          definition: 'A diagram showing all valence electrons of a molecule as dots or lines, revealing which atoms are bonded and which electrons are lone pairs. Used to predict molecular geometry via VSEPR theory.' },
  { term: 'VSEPR theory',             definition: 'Valence Shell Electron Pair Repulsion: electron pairs (bonding and lone pairs) around a central atom repel each other and arrange to maximize separation. Predicts molecular geometry (linear, bent, trigonal planar, tetrahedral, etc.).' },
  { term: 'Molecular polarity',       definition: 'Whether a molecule has a net dipole moment. A molecule is polar if it has polar bonds AND an asymmetric geometry (lone pairs break symmetry). Symmetric molecules (e.g., CO₂, CH₄) are nonpolar despite polar bonds.' },

  // ── Stoichiometry ─────────────────────────────────────────────────
  { term: 'Mole',                     definition: 'The SI unit for amount of substance. 1 mol = 6.022 × 10²³ particles (Avogadro\'s number). Like a "dozen" for atoms. Allows chemists to count atoms by weighing them.' },
  { term: 'Molar mass',               definition: 'The mass in grams of one mole of a substance. Numerically equal to the atomic/molecular mass in amu. Unit: g/mol. Used to convert between grams and moles: n = m / M.' },
  { term: 'Stoichiometry',            definition: 'The calculation of reactant and product quantities using balanced chemical equations and mole ratios. The coefficients in the equation give mole ratios. Mass → moles → moles → mass is the standard roadmap.' },
  { term: 'Limiting reagent',         definition: 'The reactant that is completely consumed first in a reaction, determining how much product can form. The excess reagent is left over. Identify it by calculating moles of product each reactant could produce.' },
  { term: 'Percent yield',            definition: 'Percent yield = (actual yield / theoretical yield) × 100%. Compares what was actually produced to what stoichiometry predicts. Less than 100% due to incomplete reactions, side reactions, or product loss.' },

  // ── States of Matter & Thermodynamics ────────────────────────────
  { term: 'Ideal gas law',            definition: 'PV = nRT, where P = pressure, V = volume, n = moles, R = 8.314 J/(mol·K), T = temperature in kelvin. Describes the behavior of an ideal (perfectly elastic, point-mass) gas. Real gases deviate at high pressure and low temperature.' },
  { term: 'Enthalpy (ΔH)',            definition: 'The heat transferred at constant pressure. ΔH < 0: exothermic reaction (releases heat to surroundings). ΔH > 0: endothermic (absorbs heat from surroundings). Measured in kJ/mol.' },
  { term: 'Hess\'s Law',             definition: 'The total enthalpy change for a reaction is the same regardless of the pathway taken. Allows calculation of ΔH for reactions that cannot be measured directly by combining known ΔH values (add or reverse and flip sign).' },

  // ── Kinetics, Equilibrium & Acids/Bases ──────────────────────────
  { term: 'Activation energy',        definition: 'The minimum energy that colliding particles must have to initiate a chemical reaction. Catalysts lower activation energy, speeding up reactions without being consumed. Higher temperature increases the fraction of molecules exceeding Eₐ.' },
  { term: 'Le Chatelier\'s principle',definition: 'When a system at equilibrium is disturbed (concentration change, pressure change, temperature change), it shifts to partially counteract the disturbance and re-establish equilibrium. Used to predict how equilibrium position responds to changes.' },
  { term: 'Equilibrium constant (K)', definition: 'K = [products]^p / [reactants]^r at equilibrium (concentrations raised to stoichiometric coefficients). K > 1: products favored. K < 1: reactants favored. K does not change unless temperature changes.' },
  { term: 'Acid',                     definition: 'Arrhenius: produces H⁺ in water. Brønsted-Lowry: a proton (H⁺) donor. Strong acids fully ionize (HCl, HNO₃, H₂SO₄); weak acids partially ionize. Acids turn blue litmus red and have pH < 7.' },
  { term: 'Base',                     definition: 'Arrhenius: produces OH⁻ in water. Brønsted-Lowry: a proton (H⁺) acceptor. Strong bases fully dissociate (NaOH, KOH); weak bases partially react. Bases turn red litmus blue and have pH > 7.' },
  { term: 'pH',                       definition: 'pH = −log[H⁺]. A measure of acidity: pH 7 is neutral, pH < 7 is acidic, pH > 7 is basic. Each unit change represents a 10-fold change in [H⁺]. At 25°C, pH + pOH = 14.' },
];
