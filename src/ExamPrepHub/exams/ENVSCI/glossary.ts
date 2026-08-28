// Glossary for ENVSCI — Environmental Science (SC 11th-grade).

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // ── Earth Systems & Biogeochemical Cycles ─────────────────────────
  { term: 'Biogeochemical cycle',     definition: 'The cycling of chemical elements through the biotic (living) and abiotic (nonliving) components of an ecosystem. Key cycles include carbon, nitrogen, water, and phosphorus. Matter is recycled; energy is not.' },
  { term: 'Carbon cycle',             definition: 'The movement of carbon through the atmosphere (CO₂), oceans (dissolved carbon), lithosphere (fossil fuels, limestone), and biosphere (living organisms). Photosynthesis removes CO₂; respiration, combustion, and decomposition release it.' },
  { term: 'Nitrogen cycle',           definition: 'The conversion of nitrogen among atmospheric N₂, ammonia (NH₃), nitrates (NO₃⁻), and organic compounds. Key processes: nitrogen fixation (N₂→NH₃ by bacteria), nitrification, assimilation, and denitrification.' },
  { term: 'Water cycle',              definition: 'The continuous movement of water through evaporation, transpiration, condensation, precipitation, runoff, and groundwater infiltration. Solar energy drives evaporation; gravity drives precipitation and runoff.' },
  { term: 'Phosphorus cycle',         definition: 'The cycling of phosphorus through soil, water, and organisms. Unlike carbon and nitrogen, phosphorus has no significant atmospheric reservoir — it moves primarily through weathering of rocks and runoff. Often the limiting nutrient in aquatic systems.' },
  { term: 'Rock cycle',               definition: 'The continuous process of rock formation and transformation among igneous, sedimentary, and metamorphic rocks through processes of melting, cooling, weathering, erosion, deposition, compaction, cementation, and heat/pressure.' },

  // ── Ecology & Ecosystems ──────────────────────────────────────────
  { term: 'Ecosystem',                definition: 'A community of living organisms (biotic) interacting with their nonliving environment (abiotic — soil, water, air, sunlight) as a system. Ecosystems process energy and cycle matter. Scale ranges from a puddle to a biome.' },
  { term: 'Producer',                 definition: 'An autotroph — an organism that makes its own food through photosynthesis or chemosynthesis. Plants, algae, and cyanobacteria are primary producers. They form the base of every food web.' },
  { term: 'Consumer',                 definition: 'A heterotroph that obtains energy by eating other organisms. Primary consumers eat producers; secondary eat primary; tertiary eat secondary. Omnivores eat multiple trophic levels.' },
  { term: 'Decomposer',               definition: 'An organism (fungi, bacteria) that breaks down dead organic matter into inorganic nutrients, returning them to the soil and water. Essential for nutrient cycling — without decomposers, nutrients would stay locked in dead matter.' },
  { term: 'Food web',                 definition: 'An interconnected network of feeding relationships in an ecosystem. More realistic than a simple food chain because most organisms eat and are eaten by multiple species. Shows energy flow and species interdependence.' },
  { term: 'Trophic level',            definition: 'A feeding level in an ecosystem. Producers are level 1; primary consumers level 2; secondary consumers level 3; etc. Only ~10% of energy transfers between trophic levels — the 10% rule (ecological efficiency).' },
  { term: 'Ecological succession',    definition: 'The gradual replacement of one community by another over time. Primary succession starts on bare rock (no soil); secondary starts after a disturbance where soil remains. Ends at a stable climax community.' },
  { term: 'Carrying capacity (K)',    definition: 'The maximum population size an environment can sustainably support given available resources. When a population reaches K, growth slows — represented by the S-shaped (logistic) growth curve.' },

  // ── Biodiversity & Conservation ───────────────────────────────────
  { term: 'Biodiversity',             definition: 'The variety of life on Earth at three levels: genetic diversity (variation within species), species diversity (number and abundance of species in an area), and ecosystem diversity (variety of habitats and communities).' },
  { term: 'Keystone species',         definition: 'A species that has a disproportionately large effect on its ecosystem relative to its abundance. Removing a keystone species triggers dramatic changes — it holds the ecosystem\'s structure together (like a keystone in an arch).' },
  { term: 'Invasive species',         definition: 'A non-native species introduced to a new habitat where it spreads aggressively, often outcompeting native species, altering food webs, and degrading the ecosystem. Examples: kudzu vine, zebra mussels, pythons in the Everglades.' },
  { term: 'Habitat fragmentation',    definition: 'The division of a continuous habitat into smaller, isolated patches by human activities (roads, agriculture, development). Reduces habitat area, isolates populations, limits gene flow, and increases edge effects.' },
  { term: 'Extinction',               definition: 'The permanent disappearance of a species. Current extinction rates are estimated to be 100–1,000 times the background rate due to habitat loss, overexploitation, invasive species, pollution, and climate change.' },
  { term: 'Ecosystem services',       definition: 'Benefits that humans receive from functioning ecosystems. Provisioning: food, water, timber. Regulating: climate regulation, flood control, pollination. Cultural: recreation, tourism. Supporting: nutrient cycling, soil formation.' },

  // ── Human Population & Land Use ──────────────────────────────────
  { term: 'Demographic transition model', definition: 'A model describing how birth rates and death rates shift as countries develop. Stage 1: high birth + high death rates. Stage 2: death rates fall, population grows rapidly. Stage 3: birth rates fall. Stage 4: low birth + low death rates, stable population.' },
  { term: 'Deforestation',            definition: 'The large-scale removal of forests, primarily for agriculture, logging, and urban expansion. Consequences include habitat loss, reduced carbon sequestration, soil erosion, altered water cycles, and decreased biodiversity.' },
  { term: 'Desertification',          definition: 'The process by which fertile land becomes desert due to overgrazing, deforestation, and poor agricultural practices. Removes vegetation that holds soil in place; exacerbated by drought. Affects drylands worldwide.' },

  // ── Climate Change & Atmosphere ───────────────────────────────────
  { term: 'Greenhouse effect',        definition: 'The natural warming of Earth\'s surface when greenhouse gases (CO₂, CH₄, N₂O, H₂O vapor) trap heat radiated from the surface. Without it, Earth\'s average temperature would be about −18°C. Enhanced by human emissions → global warming.' },
  { term: 'Greenhouse gas',           definition: 'A gas that absorbs and re-emits infrared radiation, warming the atmosphere. CO₂ (from combustion), CH₄ (from livestock and wetlands), N₂O (from fertilizers), and water vapor are the major greenhouse gases.' },
  { term: 'Positive feedback loop',   definition: 'A feedback where a change amplifies itself. Example: warming melts sea ice → less reflective ocean absorbs more solar energy → more warming. Positive feedbacks accelerate climate change beyond initial forcing.' },
  { term: 'Ocean acidification',      definition: 'Decrease in ocean pH as CO₂ dissolves in seawater, forming carbonic acid. Threatens marine organisms (corals, oysters, plankton) that build calcium carbonate shells, which dissolve in acidic water.' },

  // ── Water Resources ───────────────────────────────────────────────
  { term: 'Aquifer',                  definition: 'An underground layer of permeable rock, sediment, or soil that holds and transmits groundwater. Recharged by precipitation infiltrating the surface. Overuse causes water table decline; contamination can render aquifers unusable.' },
  { term: 'Eutrophication',           definition: 'Excessive nutrient enrichment (usually nitrogen and phosphorus from fertilizer runoff) in a water body. Triggers algal blooms, which decompose and deplete dissolved oxygen, creating dead zones that suffocate aquatic life.' },
  { term: 'Point source pollution',   definition: 'Pollution from a single, identifiable source — a pipe, chimney, or tank. Examples: factory wastewater discharge, oil spills. Easier to regulate and treat than nonpoint source pollution.' },
  { term: 'Nonpoint source pollution',definition: 'Pollution from dispersed, hard-to-identify sources spread across a landscape. Examples: agricultural runoff, urban stormwater, lawn fertilizers. Responsible for most water quality problems in the U.S.' },

  // ── Energy Resources & Sustainability ────────────────────────────
  { term: 'Fossil fuels',             definition: 'Coal, oil (petroleum), and natural gas — formed over millions of years from the compressed remains of ancient organisms. Energy-dense and currently the dominant global energy source. Combustion releases CO₂, SO₂, and NOₓ.' },
  { term: 'Renewable energy',         definition: 'Energy from sources that are replenished naturally on human timescales: solar, wind, hydroelectric, geothermal, and biomass. Unlike fossil fuels, renewable resources are not depleted by use (though infrastructure has limits).' },
  { term: 'EROI (Energy Return on Investment)', definition: 'The ratio of energy delivered by a fuel to the energy required to obtain it. High EROI (conventional oil ~30:1) means efficient; low EROI (some biofuels) means you get little net energy back. A measure of energy quality, not just quantity.' },
  { term: 'Ecological footprint',     definition: 'The area of biologically productive land and water needed to sustain a population\'s consumption and absorb its waste. If humanity\'s footprint exceeds Earth\'s biocapacity, we are in "ecological overshoot" — depleting resources faster than they regenerate.' },
  { term: 'Sustainability',           definition: 'Meeting the needs of the present without compromising the ability of future generations to meet their own needs (Brundtland Commission, 1987). Requires balancing economic development, social equity, and environmental protection.' },
];
