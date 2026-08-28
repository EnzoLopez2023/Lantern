// Question bank for ENVSCI — SC Environmental Science (11th grade).
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
  // Earth Systems & Biogeochemical Cycles
  // ══════════════════════════════════════════════════════════════
  {
    id: 'es-01', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'easy',
    question: 'The four major Earth systems are:',
    options: ['Atmosphere, hydrosphere, geosphere, biosphere', 'Ocean, land, sky, life', 'Troposphere, stratosphere, mesosphere, thermosphere', 'Land, water, air, fire'],
    correctAnswers: [0],
    explanation: 'The four Earth systems: Atmosphere (air/gases), Hydrosphere (all water), Geosphere (rocks, soil, Earth\'s layers), Biosphere (all living things). These systems interact constantly — changes in one affect all others. Environmental science studies these interactions.',
  },
  {
    id: 'es-02', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'easy',
    question: 'In the water cycle, what is the process by which water vapor in the atmosphere becomes liquid water?',
    options: ['Evaporation', 'Condensation', 'Precipitation', 'Transpiration'],
    correctAnswers: [1],
    explanation: 'Condensation is when water vapor cools and changes to liquid, forming clouds and fog. Evaporation is the reverse (liquid → vapor). Precipitation is water falling (rain, snow). Transpiration is water vapor released by plants.',
  },
  {
    id: 'es-03', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'medium',
    question: 'In the carbon cycle, which process removes CO₂ from the atmosphere?',
    options: ['Cellular respiration', 'Combustion of fossil fuels', 'Photosynthesis', 'Decomposition'],
    correctAnswers: [2],
    explanation: 'Photosynthesis converts CO₂ + H₂O into glucose using sunlight — it\'s the main biological mechanism removing carbon from the atmosphere and storing it in organic matter. Respiration, combustion, and decomposition all release CO₂ back to the atmosphere.',
  },
  {
    id: 'es-04', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'medium',
    question: 'Nitrogen fixation is important because:',
    options: ['It converts N₂ gas into usable nitrogen compounds that plants can absorb', 'It removes nitrogen from soil to prevent excess fertility', 'It converts nitrates into N₂ gas, completing the cycle', 'It stores nitrogen in rocks for millions of years'],
    correctAnswers: [0],
    explanation: 'N₂ makes up 78% of air but most organisms can\'t use it directly. Nitrogen-fixing bacteria (in root nodules of legumes and in soil) convert N₂ into ammonium (NH₄⁺), which plants can absorb. Without nitrogen fixation, life as we know it couldn\'t exist.',
  },
  {
    id: 'es-05', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'yesno', difficulty: 'easy',
    question: 'True or False: The rock cycle demonstrates that Earth\'s rocks are continuously formed, broken down, and reformed over geological time.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The rock cycle converts rocks among three types: igneous (from magma cooling), sedimentary (from compacted sediments), and metamorphic (from heat and pressure changing existing rock). Each type can transform into the others through geological processes over millions of years.',
  },
  {
    id: 'es-06', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'medium',
    question: 'What is eutrophication?',
    options: ['The process of soil forming from bedrock', 'Excess nutrient (often N and P) enrichment causing algae blooms and oxygen depletion in water bodies', 'The evaporation of water from soil surfaces', 'Geological uplift of mountain ranges'],
    correctAnswers: [1],
    explanation: 'Eutrophication occurs when fertilizer runoff enriches water with nitrogen and phosphorus. Algae blooms, then die and decompose — decomposers consume oxygen, creating "dead zones" where fish and other organisms suffocate. The Chesapeake Bay and Gulf of Mexico have major eutrophication problems.',
  },
  {
    id: 'es-07', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'multi', difficulty: 'medium',
    question: 'Which processes release carbon into the atmosphere? (Select all that apply)',
    options: ['Combustion of fossil fuels', 'Photosynthesis', 'Decomposition of organic matter', 'Cellular respiration'],
    correctAnswers: [0, 2, 3],
    explanation: 'Carbon enters the atmosphere through: combustion (burning coal, oil, natural gas), decomposition (bacteria/fungi breaking down dead organisms releasing CO₂), and cellular respiration (all living things releasing CO₂). Photosynthesis removes CO₂ from the atmosphere.',
  },
  {
    id: 'es-08', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'easy',
    question: 'Which layer of soil is richest in organic matter and supports most plant growth?',
    options: ['Bedrock (R horizon)', 'Subsoil (B horizon)', 'Topsoil (A horizon)', 'Parent material (C horizon)'],
    correctAnswers: [2],
    explanation: 'Topsoil (A horizon) is the uppermost layer, rich in organic matter (humus) from decomposed plants and animals. It supports most plant life. Topsoil formation takes hundreds of years — erosion and poor agricultural practices can destroy it quickly, making conservation critical.',
  },
  {
    id: 'es-09', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'ordering', difficulty: 'medium',
    question: 'Order the soil horizons from TOP to BOTTOM:',
    options: ['B horizon (subsoil)', 'A horizon (topsoil)', 'C horizon (parent material)', 'O horizon (organic layer)'],
    correctAnswers: [3, 1, 0, 2],
    explanation: 'Soil profile from top to bottom: O (organic litter/humus) → A (topsoil, rich in organic matter) → B (subsoil, mineral-rich, some leached materials from above) → C (partially weathered parent material) → R (bedrock).',
  },
  {
    id: 'es-10', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'hard',
    question: 'Why does the phosphorus cycle differ from the carbon and nitrogen cycles?',
    options: ['Phosphorus doesn\'t cycle at all', 'Phosphorus has no significant atmospheric stage — it cycles primarily through rock weathering, soil, water, and organisms', 'Phosphorus is only found in living organisms', 'Phosphorus cycling is faster than other cycles'],
    correctAnswers: [1],
    explanation: 'Unlike carbon (CO₂) and nitrogen (N₂), phosphorus has no significant atmospheric reservoir. It cycles through rocks (weathering releases phosphates), soil, water, and organisms. This makes phosphorus a limiting nutrient in many ecosystems — often the bottleneck for plant and algae growth.',
  },
  {
    id: 'es-11', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'easy',
    question: 'What is transpiration?',
    options: ['Water moving from soil to groundwater', 'Evaporation of water from plant leaves through stomata', 'Condensation of water on leaves at night', 'Water absorbed by roots from soil'],
    correctAnswers: [1],
    explanation: 'Transpiration is plants releasing water vapor through tiny pores (stomata) in their leaves. Forests transpire enormous amounts of water, contributing significantly to local precipitation patterns. Deforestation reduces transpiration, affecting local water cycles.',
  },
  {
    id: 'es-12', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Human activities have significantly accelerated the carbon cycle by releasing ancient stored carbon (fossil fuels) faster than natural sinks can absorb it.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Fossil fuels represent carbon stored over millions of years. Burning them releases this ancient carbon in decades, far exceeding the capacity of forests and oceans (carbon sinks) to reabsorb it. This imbalance drives rising atmospheric CO₂ and climate change.',
  },
  {
    id: 'es-13', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'medium',
    question: 'What is the primary driver of the water cycle?',
    options: ['Gravity alone', 'Solar energy (drives evaporation) and gravity (pulls water back down)', 'Wind patterns', 'Biological processes (transpiration only)'],
    correctAnswers: [1],
    explanation: 'The water cycle is driven by solar energy (heats water causing evaporation) and gravity (pulls precipitation back down). Wind distributes water vapor. The cycle continuously purifies water and distributes it around the planet.',
  },
  {
    id: 'es-14', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'easy',
    question: 'Decomposers play what critical role in biogeochemical cycles?',
    options: ['They produce oxygen through photosynthesis', 'They break down dead organic matter, releasing nutrients back into the soil and atmosphere for reuse', 'They convert N₂ into nitrates', 'They build organic compounds from inorganic materials'],
    correctAnswers: [1],
    explanation: 'Decomposers (bacteria and fungi) break down dead organisms and waste, releasing nutrients (carbon, nitrogen, phosphorus) back into usable forms. Without decomposers, nutrients would be locked in dead matter and ecosystems would collapse — they are the ultimate recyclers.',
  },
  {
    id: 'es-15', domain: 1, subdomain: 'Earth Systems & Biogeochemical Cycles', type: 'single', difficulty: 'medium',
    question: 'What is the role of the ozone layer in the stratosphere?',
    options: ['It traps heat from escaping Earth', 'It absorbs most ultraviolet (UV) radiation from the sun, protecting life on Earth', 'It produces oxygen through photosynthesis', 'It regulates global temperatures by reflecting sunlight'],
    correctAnswers: [1],
    explanation: 'Ozone (O₃) in the stratosphere absorbs 97-99% of the sun\'s harmful UV radiation. Without it, UV radiation would damage DNA, increase cancer rates, and harm ecosystems. CFCs (chlorofluorocarbons) catalytically destroy ozone — why they were banned by the Montreal Protocol.',
  },

  // ══════════════════════════════════════════════════════════════
  // Ecology & Ecosystems
  // ══════════════════════════════════════════════════════════════
  {
    id: 'eco-01', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'easy',
    question: 'What is an ecosystem?',
    options: ['A group of organisms of the same species', 'All organisms in a region plus their nonliving environment', 'Only the physical environment without organisms', 'A type of biome characterized by tropical climate'],
    correctAnswers: [1],
    explanation: 'An ecosystem includes all living organisms (community) plus the abiotic (nonliving) environment — water, temperature, soil, light. Ecosystems can be as small as a pond or as large as a forest. Energy flows through ecosystems; matter cycles.',
  },
  {
    id: 'eco-02', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'easy',
    question: 'Producers (autotrophs) are at the base of food webs because they:',
    options: ['Eat the most organisms', 'Convert sunlight (or chemical energy) into organic matter through photosynthesis (or chemosynthesis)', 'Decompose dead matter into inorganic nutrients', 'Regulate temperature in the ecosystem'],
    correctAnswers: [1],
    explanation: 'Producers make their own food using energy from sunlight (plants, algae, cyanobacteria) or chemicals (bacteria in deep sea vents). All other organisms depend on producers directly or indirectly for energy. Without producers, food webs collapse.',
  },
  {
    id: 'eco-03', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'medium',
    question: 'Only about 10% of energy is transferred from one trophic level to the next. This means:',
    options: ['90% of energy is always lost to decomposition', 'Food chains are typically short because there is little energy left at higher trophic levels', 'Carnivores have the most energy available', 'Producers have the least energy'],
    correctAnswers: [1],
    explanation: 'The 10% rule: only ~10% of energy moves up each trophic level; 90% is lost as heat, waste, and metabolic processes. After 4 trophic levels, only 0.1% of original energy remains. This is why long food chains (>4-5 links) are rare and why eating lower on the food chain is more energy-efficient.',
  },
  {
    id: 'eco-04', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'medium',
    question: 'What is a "keystone species"?',
    options: ['The most abundant species in an ecosystem', 'A species that has a disproportionately large impact on ecosystem structure relative to its abundance', 'The apex predator in a food web', 'An invasive species that dominates a new ecosystem'],
    correctAnswers: [1],
    explanation: 'A keystone species has an outsized effect on its ecosystem — removing it causes dramatic changes. Sea otters (eating sea urchins that would otherwise destroy kelp forests), wolves (regulating deer populations), and beavers (creating wetlands) are classic examples.',
  },
  {
    id: 'eco-05', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'easy',
    question: 'What is ecological succession?',
    options: ['When one species replaces another through competition', 'The gradual, directional change in species composition over time in an ecosystem', 'The extinction of dominant species', 'A predator-prey cycle'],
    correctAnswers: [1],
    explanation: 'Succession is the predictable sequence of species and community change over time. Primary succession occurs on bare rock (e.g., after a lava flow); secondary succession occurs after disturbance where soil remains (e.g., after a forest fire). Both eventually approach a stable climax community.',
  },
  {
    id: 'eco-06', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'medium',
    question: 'The "niche" of an organism includes:',
    options: ['Only the physical location where it lives', 'Its role in the ecosystem — what it eats, when it\'s active, how it interacts with other species', 'The total geographic range of the species', 'Only the food it eats'],
    correctAnswers: [1],
    explanation: 'A niche is a species\' complete ecological role — its habitat, diet, activity patterns, interactions, and more. Two species cannot occupy the exact same niche in the same place (competitive exclusion principle) — one will outcompete the other or they will evolve to differ.',
  },
  {
    id: 'eco-07', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'multi', difficulty: 'medium',
    question: 'Which types of symbiotic relationships involve benefit to at least one organism? (Select all that apply)',
    options: ['Mutualism (+/+)', 'Commensalism (+/0)', 'Parasitism (+/−)', 'Competition (−/−)'],
    correctAnswers: [0, 1, 2],
    explanation: 'Mutualism: both benefit (clownfish/anemone). Commensalism: one benefits, other unaffected (barnacles on whales). Parasitism: one benefits, one harmed (tapeworm/host). Competition: both harmed by resource reduction. Predation (+/−) is similar to parasitism in sign.',
  },
  {
    id: 'eco-08', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Biomes are large-scale ecosystems characterized by similar climate, vegetation, and wildlife.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Biomes are the world\'s major ecosystems defined by climate (temperature + precipitation) and the characteristic plant life adapted to those conditions. Tropical rainforest, temperate deciduous forest, grassland, desert, tundra, and taiga are major terrestrial biomes.',
  },
  {
    id: 'eco-09', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'hard',
    question: 'After a forest fire, pioneer species (like mosses and lichens) colonize first. This is because they:',
    options: ['Are the largest and outcompete others', 'Can survive harsh conditions with few resources and modify the environment for future species', 'Arrived before the fire and survived underground', 'Are resistant to fire and spread quickly from roots'],
    correctAnswers: [1],
    explanation: 'Pioneer species tolerate extreme conditions (bare rock, intense sun, poor soil). They begin building soil through decomposition and weathering, creating conditions for the next successional stage. Over time, more complex communities replace pioneers in a predictable sequence.',
  },
  {
    id: 'eco-10', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'medium',
    question: 'What is "carrying capacity" (K) in ecology?',
    options: ['The maximum number of individuals a population can physically occupy', 'The maximum population size an environment can sustainably support given its resources', 'The rate at which a population grows exponentially', 'The geographic range of a species'],
    correctAnswers: [1],
    explanation: 'Carrying capacity is the population size at which birth rate equals death rate — the environmental limit. Populations tend to fluctuate around K, with density-dependent factors (disease, competition, predation) pushing them back down when they overshoot.',
  },
  {
    id: 'eco-11', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'easy',
    question: 'Which of the following best describes the relationship between a lion (predator) and a zebra (prey)?',
    options: ['Mutualism — both benefit', 'Parasitism — lion benefits at zebra\'s expense but doesn\'t kill immediately', 'Predation — lion (+) kills zebra (−) for food', 'Competition — both lose resources'],
    correctAnswers: [2],
    explanation: 'Predation is a +/− interaction where one organism (predator) kills and consumes another (prey). Predation keeps prey populations in check, preventing overgrazing, and drives evolutionary adaptations (speed, camouflage, etc.) in both predator and prey.',
  },
  {
    id: 'eco-12', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'medium',
    question: 'Energy pyramids taper toward the top because:',
    options: ['Top predators are physically larger', 'Energy is lost at each trophic level, leaving less available at higher levels', 'Plants produce more energy than animals', 'Predators reproduce more slowly'],
    correctAnswers: [1],
    explanation: 'The 10% rule means each level contains roughly 10% of the energy of the level below. An energy pyramid visualizes this: a wide base (producers) supporting progressively narrower levels. This explains why there are always more prey animals than predators in a healthy ecosystem.',
  },
  {
    id: 'eco-13', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'yesno', difficulty: 'medium',
    question: 'True or False: A "food web" is more realistic than a "food chain" because most organisms eat multiple species and are eaten by multiple predators.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Food chains show simple linear energy flow. Food webs show the complex, interconnected feeding relationships in real ecosystems. Removing one species from a food web affects many others — the interconnections provide stability, but they also mean cascading effects from disturbances.',
  },

  // ══════════════════════════════════════════════════════════════
  // Biodiversity & Conservation
  // ══════════════════════════════════════════════════════════════
  {
    id: 'bd-01', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'easy',
    question: 'Biodiversity includes all of the following EXCEPT:',
    options: ['Genetic diversity within species', 'Species diversity', 'Ecosystem diversity', 'Temperature diversity of a region'],
    correctAnswers: [3],
    explanation: 'Biodiversity has three levels: genetic (variation within a species), species (variety of species), and ecosystem (variety of habitats/communities). Temperature is an abiotic factor, not a type of biodiversity. Higher biodiversity generally means greater ecosystem resilience.',
  },
  {
    id: 'bd-02', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'easy',
    question: 'The MAIN current driver of species extinction is:',
    options: ['Asteroid impacts', 'Natural climate change', 'Habitat loss due to human activities', 'Disease outbreaks'],
    correctAnswers: [2],
    explanation: 'Habitat loss (primarily from agriculture, development, and deforestation) is the leading cause of current biodiversity loss — affecting about 85% of threatened species. Other major drivers include invasive species, overexploitation, pollution, and climate change.',
  },
  {
    id: 'bd-03', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'multi', difficulty: 'medium',
    question: 'What are "ecosystem services" provided by biodiversity? (Select all that apply)',
    options: ['Pollination of crops', 'Water purification by wetlands', 'Climate regulation by forests', 'Economic value only (no ecological value)'],
    correctAnswers: [0, 1, 2],
    explanation: 'Ecosystem services are benefits humans get from healthy ecosystems: pollination (essential for 75% of food crops), water filtration (wetlands), climate regulation (forests as carbon sinks), soil formation, flood control, and natural medicines.',
  },
  {
    id: 'bd-04', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'medium',
    question: 'An invasive species is one that:',
    options: ['Is native to a region and dominates it', 'Is introduced (intentionally or accidentally) to a new ecosystem where it spreads and causes harm', 'Has been endangered but is recovering', 'Only lives in isolated island ecosystems'],
    correctAnswers: [1],
    explanation: 'Invasive species are non-native organisms that spread rapidly in new environments because they lack natural predators, parasites, or competitors. Examples: kudzu vine in the SE US, emerald ash borer, zebra mussels. They can outcompete native species and cause billions in damage.',
  },
  {
    id: 'bd-05', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Conservation biology aims to preserve biodiversity and restore damaged ecosystems.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Conservation biology is the scientific study and practice of protecting biodiversity. It combines ecology, genetics, economics, and policy to preserve species and habitats. Strategies include protected areas, captive breeding programs, habitat restoration, and corridors connecting habitat fragments.',
  },
  {
    id: 'bd-06', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'medium',
    question: 'What is "habitat fragmentation"?',
    options: ['Complete destruction of a habitat', 'The breaking of a large continuous habitat into smaller isolated patches', 'The gradual improvement of degraded habitat', 'When animals leave their habitat seasonally'],
    correctAnswers: [1],
    explanation: 'Habitat fragmentation (from roads, development, agriculture) breaks continuous habitats into isolated fragments. Smaller patches support fewer species, edge effects penetrate further, and animal movement between fragments is blocked. It\'s a major driver of extinction even when some habitat remains.',
  },
  {
    id: 'bd-07', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'hard',
    question: 'Why are coral reefs considered "biodiversity hotspots"?',
    options: ['They are physically hot due to shallow water temperatures', 'They support extraordinarily high species diversity despite covering <1% of the ocean floor', 'They are only found in tropical hotspots', 'They have the lowest biodiversity of any marine ecosystem'],
    correctAnswers: [1],
    explanation: 'Coral reefs support about 25% of all marine species despite covering less than 0.1% of the ocean. They provide habitat, nursery grounds, and food for thousands of species. Climate-driven bleaching (from rising ocean temperatures) and ocean acidification threaten these critical ecosystems.',
  },
  {
    id: 'bd-08', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'ordering', difficulty: 'medium',
    question: 'Order these conservation strategies from MOST LOCAL to MOST GLOBAL:',
    options: ['International treaties (CITES, Paris Agreement)', 'National protected areas (US National Parks)', 'Local habitat restoration projects', 'State endangered species programs'],
    correctAnswers: [2, 3, 1, 0],
    explanation: 'Scale: local restoration (backyard or river) → state programs (state wildlife agencies) → national protected areas (USFWS, National Parks) → international agreements (CITES governs trade in endangered species across nations).',
  },
  {
    id: 'bd-09', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'easy',
    question: 'The "sixth mass extinction" refers to:',
    options: ['The extinction of dinosaurs 66 million years ago', 'The current, ongoing rapid loss of species primarily driven by human activities', 'A predicted future extinction event', 'The extinction of megafauna 10,000 years ago'],
    correctAnswers: [1],
    explanation: 'Scientists estimate the current extinction rate is 100–1,000 times the natural background rate due to human activities. This level, comparable to the five major prehistoric mass extinctions, is called the sixth mass extinction. Unlike previous events, this one has a biological cause (us) and is happening very fast.',
  },
  {
    id: 'bd-10', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Protecting a single large habitat reserve generally supports more species than several small reserves of the same total area.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Island biogeography principles apply to habitat fragments: larger patches support more species (area effect) and experience less harmful edge effects. Species needing large home ranges (wolves, grizzlies) cannot survive in small fragments. SLOSS debate (Single Large Or Several Small) generally favors single large reserves.',
  },

  // ══════════════════════════════════════════════════════════════
  // Human Population & Land Use
  // ══════════════════════════════════════════════════════════════
  {
    id: 'hp-01', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'easy',
    question: 'The current global human population is approximately:',
    options: ['1 billion', '4 billion', '8 billion', '12 billion'],
    correctAnswers: [2],
    explanation: 'Earth\'s human population reached 8 billion in late 2022. It took until 1800 to reach 1 billion, just 130 more years to reach 2 billion (1930), then accelerated with each subsequent billion. Growth is slowing but the population continues to rise.',
  },
  {
    id: 'hp-02', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'medium',
    question: 'The "demographic transition model" describes:',
    options: ['How immigration patterns shift in countries', 'The transition from high birth/death rates to low birth/death rates as countries develop economically', 'How populations migrate between continents', 'The pattern of resource consumption in developing nations'],
    correctAnswers: [1],
    explanation: 'The demographic transition: Stage 1 (high birth and death rates, pre-industrial) → Stage 2 (death rates fall as medicine improves, population grows quickly) → Stage 3 (birth rates also fall as countries develop) → Stage 4 (both low, stable population). Most developed countries are in Stage 4.',
  },
  {
    id: 'hp-03', domain: 1, subdomain: 'Human Population & Land Use', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Deforestation reduces soil quality and increases erosion because tree roots stabilize soil and leaf litter builds organic matter.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Forests protect soil in two ways: roots hold soil in place (preventing erosion), and leaf litter decomposes into humus (building organic matter). After deforestation, exposed soil erodes rapidly in rain, loses fertility, and can become essentially unusable within years.',
  },
  {
    id: 'hp-04', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'medium',
    question: 'What is "desertification"?',
    options: ['The natural expansion of deserts due to geological processes', 'The degradation of dryland areas into desert-like conditions due to overgrazing, deforestation, and poor agricultural practices', 'The conversion of desert land into productive farmland through irrigation', 'Increased rainfall in arid regions'],
    correctAnswers: [1],
    explanation: 'Desertification affects about 1/3 of Earth\'s land surface. Overgrazing, clearing vegetation, and poor irrigation destroy soil structure and groundwater. Sahel region in Africa is a severe example — millions face food insecurity as productive land becomes desert.',
  },
  {
    id: 'hp-05', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'medium',
    question: 'Which agricultural practice can significantly reduce soil erosion?',
    options: ['Conventional tilling (turning soil each season)', 'Monoculture farming without cover crops', 'No-till agriculture, contour farming, and cover crops', 'Irrigation with saline water'],
    correctAnswers: [2],
    explanation: 'No-till leaves crop residue in place, protecting soil from rain impact. Contour farming (plowing across slopes) slows runoff. Cover crops hold soil during off-seasons. These practices reduce erosion by 50-90% compared to conventional tilling.',
  },
  {
    id: 'hp-06', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'easy',
    question: 'Which of the following is the leading use of freshwater globally?',
    options: ['Industrial manufacturing', 'Drinking and household use', 'Agriculture (irrigation)', 'Hydroelectric power generation'],
    correctAnswers: [2],
    explanation: 'Agriculture accounts for approximately 70% of global freshwater withdrawals, primarily for irrigation. Industrial use is ~20%; domestic/drinking water is ~10%. As food demand grows with population, water scarcity becomes increasingly critical — agriculture is central to the water-food nexus.',
  },
  {
    id: 'hp-07', domain: 1, subdomain: 'Human Population & Land Use', type: 'multi', difficulty: 'medium',
    question: 'Which are environmental consequences of urbanization? (Select all that apply)',
    options: ['Increased impervious surfaces (streets, buildings) causing more runoff', 'Loss of natural habitat', 'Urban heat island effect', 'Reduced car use and emissions'],
    correctAnswers: [0, 1, 2],
    explanation: 'Urbanization creates impervious surfaces (more flooding), destroys habitat, and creates urban heat islands (dark surfaces absorb heat, less vegetation to cool via evapotranspiration). Urban areas typically have MORE vehicle traffic and emissions, not less.',
  },
  {
    id: 'hp-08', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'hard',
    question: 'What is the "tragedy of the commons"?',
    options: ['The overuse of privately owned resources', 'When individual users deplete a shared resource because each acts in self-interest, harming the collective', 'The failure of government regulation to protect natural resources', 'When urban areas expand into rural common lands'],
    correctAnswers: [1],
    explanation: 'Garret Hardin\'s concept (1968): when a resource is shared (fisheries, clean air, groundwater), individuals rationally overuse it since the benefit is personal but the cost is shared. Without collective management or regulation, commons are depleted. Solutions: privatization, regulation, or community management.',
  },
  {
    id: 'hp-09', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'easy',
    question: 'Which of the following is an example of non-point source pollution?',
    options: ['Discharge from a factory wastewater pipe', 'Runoff from agricultural fields carrying pesticides and fertilizers', 'Spill from an identified oil tanker', 'Sewage from a specific treatment plant'],
    correctAnswers: [1],
    explanation: 'Non-point source (NPS) pollution comes from diffuse sources — agricultural runoff, urban stormwater, road salts. It\'s harder to regulate than point source pollution (from a specific, identifiable discharge pipe). Agricultural NPS is the leading cause of water quality problems in US rivers and lakes.',
  },
  {
    id: 'hp-10', domain: 1, subdomain: 'Human Population & Land Use', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Countries with high economic development tend to have lower fertility rates than developing countries.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'The demographic transition model shows that as countries develop economically (education improves, child mortality decreases, women gain economic opportunities), birth rates fall. Most European countries now have fertility rates below replacement level (2.1 children/woman).',
  },

  // ══════════════════════════════════════════════════════════════
  // Climate Change & Atmosphere
  // ══════════════════════════════════════════════════════════════
  {
    id: 'cc-01', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'easy',
    question: 'The "greenhouse effect" refers to:',
    options: ['Plants growing in greenhouses', 'The trapping of heat by greenhouse gases in the atmosphere, warming Earth\'s surface', 'The reflection of sunlight by clouds', 'Deforestation creating fields where heat increases'],
    correctAnswers: [1],
    explanation: 'The natural greenhouse effect is essential for life — without it, Earth would average −18°C instead of +15°C. Greenhouse gases (CO₂, water vapor, methane, N₂O) absorb infrared radiation (heat) re-emitted by Earth\'s surface and re-radiate it back, warming the planet.',
  },
  {
    id: 'cc-02', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'easy',
    question: 'Which human activity is the primary source of increased CO₂ in the atmosphere?',
    options: ['Breathing (respiration)', 'Burning fossil fuels (coal, oil, natural gas)', 'Deforestation only', 'Water evaporation'],
    correctAnswers: [1],
    explanation: 'Fossil fuel combustion accounts for ~75% of human-caused CO₂ emissions. Deforestation contributes about 10-15%. Transportation, electricity generation, and industrial processes (cement, steel) are the primary fossil fuel uses. CO₂ levels have risen from ~280 ppm (pre-industrial) to 420+ ppm today.',
  },
  {
    id: 'cc-03', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'multi', difficulty: 'medium',
    question: 'Which are documented consequences of global warming? (Select all that apply)',
    options: ['Rising sea levels', 'More frequent extreme weather events', 'Ocean acidification', 'Decreased biodiversity in all regions'],
    correctAnswers: [0, 1, 2],
    explanation: 'Documented climate impacts: sea level rise (from ice melt + thermal expansion), more intense storms/droughts/heat waves, and ocean acidification (CO₂ dissolving in oceans forming carbonic acid). Biodiversity effects are mixed — some regions gain species while others lose them.',
  },
  {
    id: 'cc-04', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'medium',
    question: 'What is "ocean acidification"?',
    options: ['Pollution from acid rain falling into oceans', 'The decrease in ocean pH as oceans absorb increased atmospheric CO₂', 'Volcanic activity acidifying deep ocean water', 'Salt water becoming more acidic near desalination plants'],
    correctAnswers: [1],
    explanation: 'Oceans absorb ~30% of human CO₂ emissions. CO₂ + H₂O → H₂CO₃ (carbonic acid), lowering ocean pH. Since 1750, ocean pH has dropped from 8.2 to 8.1 — seemingly small, but a 25% increase in acidity (logarithmic scale). This dissolves calcium carbonate shells, threatening corals, oysters, and marine food webs.',
  },
  {
    id: 'cc-05', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'yesno', difficulty: 'easy',
    question: 'True or False: The scientific consensus among climate scientists is that current climate change is primarily driven by human activities.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Multiple independent lines of evidence — rising CO₂ matching fossil fuel emissions, warming patterns consistent with greenhouse gas physics, satellite measurements, ice cores — all converge on human causation. 97%+ of active climate scientists accept human-driven climate change.',
  },
  {
    id: 'cc-06', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'medium',
    question: 'What is the difference between weather and climate?',
    options: ['Weather is global; climate is local', 'Weather is short-term atmospheric conditions; climate is long-term patterns over decades or more', 'They are the same thing', 'Weather is human-caused; climate is natural'],
    correctAnswers: [1],
    explanation: '"Climate is what you expect; weather is what you get." Weather is the day-to-day state of the atmosphere (temperature, precipitation, wind). Climate is the long-term (30-year) average patterns. A single cold winter doesn\'t disprove global warming — it\'s weather, not climate.',
  },
  {
    id: 'cc-07', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'hard',
    question: 'Why does methane (CH₄) have a larger short-term climate impact per molecule than CO₂?',
    options: ['Methane is more abundant in the atmosphere', 'Methane is 80× more potent as a greenhouse gas over 20 years due to its molecular structure, though it breaks down faster than CO₂', 'Methane only affects the troposphere; CO₂ affects the entire atmosphere', 'Methane is produced only by natural sources'],
    correctAnswers: [1],
    explanation: 'Methane has a global warming potential (GWP) of ~80 over 20 years and ~28 over 100 years (versus CO₂ = 1). It\'s more potent but shorter-lived (lasts ~12 years vs CO₂\'s centuries). Sources: livestock, landfills, natural gas leaks, wetlands. Reducing methane is an important near-term climate strategy.',
  },
  {
    id: 'cc-08', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'medium',
    question: 'What is "albedo" and how does it relate to climate?',
    options: ['The amount of CO₂ absorbed by vegetation', 'The reflectivity of a surface — high albedo surfaces (snow, ice) reflect sunlight; low albedo (oceans, forests) absorb it', 'The temperature at which greenhouse gases form', 'The rate of ocean circulation that distributes heat globally'],
    correctAnswers: [1],
    explanation: 'Albedo is the fraction of solar energy reflected by a surface. Ice and snow have high albedo (~0.8); forests and oceans have low albedo (~0.1). As Arctic ice melts (climate feedback), it reveals darker ocean, absorbing more heat and accelerating warming. This is a positive (amplifying) feedback loop.',
  },
  {
    id: 'cc-09', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'ordering', difficulty: 'hard',
    question: 'Order these greenhouse gases from HIGHEST to LOWEST global warming potential (per molecule, 100-year):',
    options: ['CO₂', 'Water vapor (H₂O)', 'Nitrous oxide (N₂O)', 'Methane (CH₄)'],
    correctAnswers: [2, 3, 0, 1],
    explanation: 'GWP (100-year): N₂O ≈ 298, CH₄ ≈ 28, CO₂ = 1. Water vapor is a greenhouse gas but not directly rated this way since it\'s a feedback rather than a forcing. N₂O from agriculture is a powerful, long-lived greenhouse gas.',
  },
  {
    id: 'cc-10', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'medium',
    question: 'The distinction between climate "mitigation" and "adaptation" is:',
    options: ['Mitigation means accepting climate change; adaptation means preventing it', 'Mitigation reduces greenhouse gas emissions to slow climate change; adaptation adjusts to climate impacts that are already occurring or inevitable', 'They are the same strategy', 'Mitigation is for developing countries; adaptation is for developed countries'],
    correctAnswers: [1],
    explanation: 'Mitigation: reduce emissions (renewable energy, energy efficiency, reforestation). Adaptation: adjust to changes already occurring (seawalls for sea level rise, drought-resistant crops, heat emergency plans). Both are needed — mitigation prevents future damage; adaptation manages what\'s already unavoidable.',
  },

  // ══════════════════════════════════════════════════════════════
  // Water Resources
  // ══════════════════════════════════════════════════════════════
  {
    id: 'wr-01', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'easy',
    question: 'What percentage of Earth\'s water is freshwater available for human use (not frozen in ice caps)?',
    options: ['97%', '10%', '3% total freshwater (about 0.3% accessible liquid)', '50%'],
    correctAnswers: [2],
    explanation: '97% of Earth\'s water is saltwater. Of the 3% freshwater, ~69% is frozen in glaciers and ice caps. Only about 0.3% of all Earth\'s water is surface freshwater (rivers, lakes) accessible for most human uses. This scarcity makes water conservation critical.',
  },
  {
    id: 'wr-02', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'medium',
    question: 'An aquifer is:',
    options: ['A body of surface water like a lake or river', 'An underground layer of rock or sediment that holds groundwater', 'An ocean current carrying freshwater', 'A dam designed to store water'],
    correctAnswers: [1],
    explanation: 'Aquifers are underground formations of porous rock or sediment saturated with water. They supply wells and springs. The Ogallala Aquifer under the Great Plains provides water for 30% of US groundwater irrigation. Overdrafting aquifers faster than recharge causes subsidence and depletion.',
  },
  {
    id: 'wr-03', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'medium',
    question: 'Point source water pollution comes from:',
    options: ['Agricultural field runoff after heavy rain', 'A factory\'s wastewater discharge pipe', 'Stormwater from parking lots', 'Sediment from road construction across a large area'],
    correctAnswers: [1],
    explanation: 'Point source pollution comes from a single, identifiable location — a pipe, drain, or discharge outlet. It\'s regulated by the Clean Water Act through permits (NPDES). Non-point source (like agricultural runoff) is diffuse and harder to regulate, making it the dominant remaining water quality problem.',
  },
  {
    id: 'wr-04', domain: 1, subdomain: 'Water Resources', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Wetlands naturally filter pollutants and recharge groundwater aquifers.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Wetlands provide critical ecosystem services: they filter pollutants (plants and microbes absorb nutrients and heavy metals), recharge groundwater, reduce flooding (absorbing storm surges), and provide wildlife habitat. Despite this, 50%+ of US wetlands have been drained for development and agriculture.',
  },
  {
    id: 'wr-05', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'medium',
    question: 'What causes hypoxic "dead zones" in coastal waters?',
    options: ['Oil spills blocking gas exchange', 'Excess nutrients (N and P) causing algae blooms that deplete oxygen when they die and decompose', 'Overfishing removing all marine life', 'Temperature changes causing gases to leave the water'],
    correctAnswers: [1],
    explanation: 'Dead zones (hypoxic zones) form when nutrient runoff (from agriculture, sewage) triggers massive algae blooms. When algae die, bacteria decompose them using oxygen — depleting it faster than it can be replenished. Fish and other organisms suffocate and flee or die. The Gulf of Mexico dead zone (fed by Mississippi River fertilizers) is one of the world\'s largest.',
  },
  {
    id: 'wr-06', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'medium',
    question: 'Which of these is a renewable water conservation strategy?',
    options: ['Mining deeper groundwater from ancient fossil aquifers', 'Drip irrigation delivering water directly to plant roots', 'Damming all rivers for maximum storage', 'Importing water from distant regions indefinitely'],
    correctAnswers: [1],
    explanation: 'Drip irrigation delivers water directly to roots with 90%+ efficiency (vs. 50-60% for traditional irrigation). It reduces evaporation losses and can cut agricultural water use dramatically. Conservation strategies work with natural water cycles rather than depleting finite resources.',
  },
  {
    id: 'wr-07', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'hard',
    question: 'Why is groundwater contamination particularly serious compared to surface water contamination?',
    options: ['Groundwater is more abundant than surface water', 'Groundwater purifies itself quickly through sunlight exposure', 'Groundwater moves slowly and lacks UV exposure, so it can remain contaminated for decades and is difficult to remediate', 'Groundwater contamination is always reversible within a year'],
    correctAnswers: [2],
    explanation: 'Groundwater moves very slowly (inches per year) and lacks the self-purification mechanisms of surface water (UV sunlight, oxygen, turbulent mixing). Once contaminated with nitrates, heavy metals, or organic compounds, cleanup can take decades and cost billions. Prevention is far more cost-effective than remediation.',
  },
  {
    id: 'wr-08', domain: 1, subdomain: 'Water Resources', type: 'ordering', difficulty: 'medium',
    question: 'Order these water uses from HIGHEST to LOWEST freshwater consumption globally:',
    options: ['Industrial (manufacturing, cooling)', 'Municipal (drinking, sanitation)', 'Agriculture (irrigation)', 'Energy production (hydroelectric)'],
    correctAnswers: [2, 0, 1, 3],
    explanation: 'Agriculture uses ~70% of global freshwater withdrawals. Industry uses ~20%. Municipal/domestic uses ~10%. Hydroelectric power generation doesn\'t actually consume much water — it passes through turbines and continues in the river.',
  },

  // ══════════════════════════════════════════════════════════════
  // Energy Resources & Sustainability
  // ══════════════════════════════════════════════════════════════
  {
    id: 'er-01', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'easy',
    question: 'Which energy source is renewable?',
    options: ['Coal', 'Natural gas', 'Crude oil', 'Solar power'],
    correctAnswers: [3],
    explanation: 'Renewable energy sources replenish naturally on human timescales — solar, wind, hydroelectric, geothermal, and biomass. Fossil fuels (coal, oil, natural gas) took millions of years to form and are finite. Renewable energy is essential for long-term energy sustainability.',
  },
  {
    id: 'er-02', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'medium',
    question: 'What is the biggest environmental advantage of solar and wind energy compared to fossil fuels?',
    options: ['They produce more electricity per unit area', 'They produce no greenhouse gas emissions during operation', 'They are always cheaper than fossil fuels', 'They don\'t require any materials to manufacture'],
    correctAnswers: [1],
    explanation: 'Solar panels and wind turbines produce no CO₂ or other greenhouse gases during operation — their lifetime emissions (including manufacturing) are 10-50× lower per kWh than fossil fuels. This makes them critical for decarbonizing the electricity sector.',
  },
  {
    id: 'er-03', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'multi', difficulty: 'medium',
    question: 'Which are environmental disadvantages of fossil fuels? (Select all that apply)',
    options: ['Greenhouse gas emissions causing climate change', 'Air pollutants (SO₂, NOₓ, particulates)', 'Finite supply that will eventually run out', 'Producing radioactive waste'],
    correctAnswers: [0, 1, 2],
    explanation: 'Fossil fuels cause: climate change (CO₂ and methane), air pollution (sulfur dioxide → acid rain, nitrogen oxides → smog, particulates → respiratory disease), and depletion (non-renewable). Nuclear power (not fossil fuels) produces radioactive waste.',
  },
  {
    id: 'er-04', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'easy',
    question: 'What is the primary advantage of nuclear power for electricity generation?',
    options: ['It produces no waste', 'It generates large amounts of electricity with minimal greenhouse gas emissions', 'It is cheaper than all other energy sources', 'Uranium is unlimited and renewable'],
    correctAnswers: [1],
    explanation: 'Nuclear power generates ~10% of world electricity with very low lifecycle greenhouse gas emissions (comparable to wind and solar). It operates 24/7 regardless of weather. Challenges include high construction costs, radioactive waste management, and public safety concerns (though serious accidents are rare).',
  },
  {
    id: 'er-05', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'medium',
    question: 'What is "energy efficiency"?',
    options: ['Using only renewable energy', 'Reducing waste — getting more useful work from the same amount of energy input', 'Increasing energy production to meet demand', 'Using energy only during off-peak hours'],
    correctAnswers: [1],
    explanation: 'Energy efficiency means reducing energy waste. LED bulbs use 75% less energy than incandescent bulbs for the same light output. Efficient cars, buildings, and appliances reduce energy demand without reducing services. Efficiency is often the cheapest "source" of energy — negawatts (watts not needed).',
  },
  {
    id: 'er-06', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'medium',
    question: 'What is the "EROI" (Energy Return on Investment)?',
    options: ['The financial profit from selling energy', 'The ratio of energy produced to energy required to obtain it', 'The efficiency of energy storage systems', 'The tax incentive for renewable energy investment'],
    correctAnswers: [1],
    explanation: 'EROI = (energy delivered) / (energy invested to produce it). Early oil wells had EROI of 100:1 — 1 unit of energy invested yielded 100. Today\'s oil is ~10:1. Solar is ~20-40:1. Higher EROI means more net energy available for society. EROI declining for fossil fuels as easy sources are depleted.',
  },
  {
    id: 'er-07', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Burning biomass (wood, crop waste) releases CO₂ but is considered potentially carbon-neutral because the plants absorbed CO₂ when they grew.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Biomass combustion can be carbon-neutral IF plants are regrown — the carbon released was recently captured from the atmosphere. However, it must be managed sustainably: cutting old-growth forests for biomass is not carbon-neutral, as old forests hold far more carbon than new ones.',
  },
  {
    id: 'er-08', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'hard',
    question: 'What is "sustainability" in the context of resource use?',
    options: ['Using as many resources as possible before they run out', 'Meeting the needs of the present without compromising the ability of future generations to meet their own needs', 'Eliminating all human impact on the environment', 'Using only renewable resources and nothing else'],
    correctAnswers: [1],
    explanation: 'The Brundtland Commission\'s definition (1987): sustainability means development that meets today\'s needs without undermining future generations\' ability to meet theirs. It balances economic, social, and environmental goals — sometimes called the "three pillars of sustainability."',
  },
  {
    id: 'er-09', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'ordering', difficulty: 'medium',
    question: 'Order these energy sources from HIGHEST to LOWEST lifecycle greenhouse gas emissions per kWh:',
    options: ['Natural gas', 'Wind', 'Coal', 'Nuclear'],
    correctAnswers: [2, 0, 3, 1],
    explanation: 'Lifecycle GHG per kWh (approximately): Coal (~820 g CO₂eq) > Natural gas (~490 g) > Nuclear (~12 g) > Wind (~11 g). The low nuclear and wind values reflect minimal operational emissions despite embodied energy in construction.',
  },
  {
    id: 'er-10', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'medium',
    question: 'What is the circular economy?',
    options: ['An economy based purely on circular agriculture', 'A model that aims to eliminate waste by keeping materials in use as long as possible through reuse, repair, and recycling', 'An economic system where money flows in circles through government programs', 'Trade exclusively between neighboring countries'],
    correctAnswers: [1],
    explanation: 'The circular economy contrasts with the linear "take-make-waste" model. In a circular economy, products are designed for longevity, reuse, repair, and recycling — keeping materials in circulation. It reduces raw material extraction, energy use, and waste while creating economic opportunities.',
  },
  {
    id: 'er-11', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Acid rain is primarily caused by sulfur dioxide (SO₂) and nitrogen oxides (NOₓ) from burning fossil fuels reacting with water in the atmosphere.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Acid rain forms when SO₂ and NOₓ (from coal power plants, vehicles) react with water, oxygen, and other chemicals in the atmosphere to form sulfuric and nitric acids. Acid rain damages forests, acidifies lakes (killing fish), corrodes stone buildings (monuments), and harms soil chemistry.',
  },

  // ══════════════════════════════════════════════════════════════
  // Ecology & Ecosystems — 2 new questions (eco-14, eco-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'eco-14', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'single', difficulty: 'medium',
    question: 'What distinguishes primary succession from secondary succession?',
    options: [
      'Primary succession happens faster than secondary succession',
      'Primary succession begins on bare substrate with no soil; secondary succession begins in an area where soil already exists after a disturbance',
      'Primary succession only occurs in marine environments; secondary succession only occurs on land',
      'Secondary succession starts from bare rock; primary succession starts from disturbed soil',
    ],
    correctAnswers: [1],
    explanation: 'Primary succession starts on barren substrate (lava rock, glacial till) where no soil or seed bank exists — pioneer species like lichens slowly build soil. Secondary succession follows a disturbance (fire, flood, abandoned farmland) where soil and seed banks remain, so it proceeds much faster. Both lead toward a climax community.',
  },
  {
    id: 'eco-15', domain: 1, subdomain: 'Ecology & Ecosystems', type: 'multi', difficulty: 'hard',
    question: 'Which of the following are characteristics of a biome with HIGH net primary productivity? (Select all that apply)',
    options: [
      'Warm temperatures year-round',
      'Abundant precipitation',
      'High availability of sunlight',
      'Extremely cold temperatures with permafrost',
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Net primary productivity (NPP) is the rate at which producers build biomass. Tropical rainforests have the highest NPP because they combine warm temperatures (fast metabolism), abundant rainfall (no water stress), and year-round solar energy. Tundra has extremely low NPP due to cold temperatures and frozen soil that limits nutrient availability.',
  },

  // ══════════════════════════════════════════════════════════════
  // Biodiversity & Conservation — 5 new questions (bio-11 to bio-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'bio-11', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'medium',
    question: 'What is genetic diversity and why does it matter for species survival?',
    options: [
      'The number of different species in an area; more species means better survival',
      'The variety of alleles and genotypes within a species; greater genetic diversity helps populations adapt to environmental changes and resist disease',
      'The physical diversity of individuals in a population; taller organisms survive better',
      'The number of chromosomes a species has; more chromosomes equals more genetic diversity',
    ],
    correctAnswers: [1],
    explanation: 'Genetic diversity is the range of different inherited traits within a species. It is the raw material for natural selection — populations with high genetic diversity are more likely to include individuals who can survive new diseases, climate shifts, or other stresses. Inbreeding in small, isolated populations reduces genetic diversity and raises extinction risk.',
  },
  {
    id: 'bio-12', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'yesno', difficulty: 'easy',
    question: 'True or False: Biodiversity hotspots are regions that have both high species richness and face significant threats from human activity.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Conservation International defines hotspots as areas with at least 1,500 endemic plant species and having lost at least 70% of their original habitat. The Amazon basin, Madagascar, the Western Ghats of India, and the Philippines all qualify. Protecting hotspots delivers the greatest conservation return per dollar spent.',
  },
  {
    id: 'bio-13', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'medium',
    question: 'Why are island species particularly vulnerable to extinction from invasive species?',
    options: [
      'Island species are always smaller and physically weaker than mainland species',
      'Island species evolved in the absence of certain predators and competitors, leaving them without defenses against introduced threats',
      'Islands have more habitat for invasive species to exploit',
      'Island species have higher reproductive rates that attract more predators',
    ],
    correctAnswers: [1],
    explanation: 'Island species evolved in isolation, often without mammalian predators. When humans introduce rats, cats, or snakes, island birds (for example) have no instinctive fear response and cannot escape. Roughly 80% of all recorded bird extinctions since 1500 occurred on islands. Hawaii has lost more species to invasive species than any other US state.',
  },
  {
    id: 'bio-14', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'multi', difficulty: 'medium',
    question: 'Which conservation approaches help species survive habitat fragmentation? (Select all that apply)',
    options: [
      'Wildlife corridors connecting habitat patches',
      'Increasing road density to allow animals to cross more quickly',
      'Creating buffer zones around protected core areas',
      'Reducing patch size to concentrate populations',
    ],
    correctAnswers: [0, 2],
    explanation: 'Wildlife corridors (strips of habitat linking isolated patches) allow gene flow, migration, and recolonization. Buffer zones around core preserves reduce edge effects and human encroachment. Increasing road density worsens fragmentation. Reducing patch size is harmful — larger patches support more species and larger home ranges.',
  },
  {
    id: 'bio-15', domain: 1, subdomain: 'Biodiversity & Conservation', type: 'single', difficulty: 'hard',
    question: 'The Endangered Species Act (ESA) protects species by:',
    options: [
      'Paying landowners to release captive animals into the wild',
      'Listing threatened and endangered species, prohibiting their harm or take, and requiring recovery plans and critical habitat designation',
      'Requiring all businesses to conduct environmental audits annually',
      'Mandating that zoos maintain breeding populations of all at-risk species',
    ],
    correctAnswers: [1],
    explanation: 'The ESA (1973) lists species as threatened or endangered based on scientific criteria, prohibits "taking" (harming, harassing, killing) listed species, requires federal agencies to consult on activities affecting them, and mandates recovery plans. The ESA has helped prevent the extinction of the bald eagle, California condor, gray wolf, and many others.',
  },

  // ══════════════════════════════════════════════════════════════
  // Human Population & Land Use — 5 new questions (pop-11 to pop-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'pop-11', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'medium',
    question: 'What is an "ecological footprint"?',
    options: [
      'The physical area of land that a human community occupies',
      'A measure of how much biologically productive land and water is needed to produce the resources a person or population uses and absorb its waste',
      'The number of endangered species in a given region',
      'The carbon emissions per square mile of a country',
    ],
    correctAnswers: [1],
    explanation: 'The ecological footprint quantifies human demand on nature in terms of bioproductive area (measured in global hectares). If a country\'s footprint exceeds its biocapacity, it is in "ecological deficit." Currently, humanity\'s global footprint exceeds Earth\'s biocapacity by about 75% — we are using 1.75 Earths worth of resources.',
  },
  {
    id: 'pop-12', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'easy',
    question: 'What is the replacement fertility rate, and why does it matter?',
    options: [
      'A rate of 1.0 children per woman — one child for each parent',
      'A rate of approximately 2.1 children per woman — enough to replace both parents with a small margin for child mortality',
      'A rate of 3.5 children per woman — needed for population growth',
      'A rate of 4.0 children per woman — the historic average before modern medicine',
    ],
    correctAnswers: [1],
    explanation: 'The replacement fertility rate (~2.1 in developed nations; slightly higher in nations with higher child mortality) is the average number of children per woman needed to keep population stable over generations. Countries below replacement (most of Europe, Japan, South Korea) face aging populations and eventual decline. Countries well above replacement grow rapidly.',
  },
  {
    id: 'pop-13', domain: 1, subdomain: 'Human Population & Land Use', type: 'multi', difficulty: 'medium',
    question: 'Which land-use practices reduce biodiversity? (Select all that apply)',
    options: [
      'Converting tropical rainforest to cattle ranching',
      'Draining wetlands for agriculture',
      'Establishing wildlife corridors between protected areas',
      'Suburban sprawl replacing meadows and forests',
    ],
    correctAnswers: [0, 1, 3],
    explanation: 'Deforestation for cattle ranching destroys rainforest habitat (the Amazon has lost 20%+ of its original forest). Draining wetlands removes habitat for countless species. Suburban sprawl converts natural lands to impervious surfaces. Wildlife corridors are a conservation tool that preserves connectivity — they increase, not decrease, biodiversity.',
  },
  {
    id: 'pop-14', domain: 1, subdomain: 'Human Population & Land Use', type: 'single', difficulty: 'hard',
    question: 'What is "soil salinization" and what causes it?',
    options: [
      'The natural addition of salt to coastal soils from sea spray — beneficial for crop growth',
      'The accumulation of salts in soil from evaporation of irrigation water, eventually making soil too salty for crops to grow',
      'The process of adding mineral salts as fertilizer to improve crop yield',
      'A type of soil erosion caused by wind in desert regions',
    ],
    correctAnswers: [1],
    explanation: 'Salinization occurs when irrigation water evaporates and leaves behind dissolved salts. Over time, salt concentrations rise until plants cannot absorb water (osmotic stress). An estimated 20% of irrigated agricultural land worldwide is affected. Parts of the Tigris-Euphrates valley (the ancient Fertile Crescent) became unproductive from salinization thousands of years ago.',
  },
  {
    id: 'pop-15', domain: 1, subdomain: 'Human Population & Land Use', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Access to education for women is one of the most reliable predictors of lower fertility rates in developing countries.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Research consistently shows that women\'s education is among the strongest predictors of fertility decline. Educated women tend to delay marriage, understand family planning, have greater economic autonomy, and have better access to healthcare. This relationship holds across cultures and income levels and is a cornerstone of demographic development policy.',
  },

  // ══════════════════════════════════════════════════════════════
  // Climate Change & Atmosphere — 5 new questions (clim-11 to clim-15)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'clim-11', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'medium',
    question: 'What is a "positive feedback loop" in the context of climate change?',
    options: [
      'A feedback that has a positive effect on human economies',
      'A process in which an initial warming triggers changes that cause further warming, amplifying the original effect',
      'A government policy that positively reinforces emission reductions',
      'A stable loop in which warming is counterbalanced by cooling effects',
    ],
    correctAnswers: [1],
    explanation: 'In climate science, "positive" means amplifying, not beneficial. Example: warming melts Arctic ice → darker ocean absorbs more heat → more warming → more ice melts (the ice-albedo feedback). Another: warming thaws permafrost → releasing trapped methane → more warming. These feedbacks are why scientists warn that climate change may accelerate beyond linear projections.',
  },
  {
    id: 'clim-12', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'easy',
    question: 'Which layer of the atmosphere contains the weather and is most directly heated by Earth\'s surface?',
    options: ['Stratosphere', 'Mesosphere', 'Troposphere', 'Thermosphere'],
    correctAnswers: [2],
    explanation: 'The troposphere is the lowest atmospheric layer (0–12 km), where virtually all weather occurs. It is heated mainly from below by Earth\'s surface re-radiating solar energy as infrared radiation. Temperature generally decreases with altitude in the troposphere. The greenhouse effect operates primarily in the troposphere.',
  },
  {
    id: 'clim-13', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'multi', difficulty: 'medium',
    question: 'Which of the following are examples of climate change mitigation strategies? (Select all that apply)',
    options: [
      'Transitioning the electricity grid to renewable energy sources',
      'Building sea walls to protect coastal cities from sea level rise',
      'Reforestation to increase forest carbon sinks',
      'Planting drought-resistant crops to adapt to less rainfall',
    ],
    correctAnswers: [0, 2],
    explanation: 'Mitigation reduces greenhouse gas emissions or enhances carbon sinks to slow climate change. Renewable energy and reforestation are mitigation. Sea walls and drought-resistant crops are adaptation — adjusting to changes already occurring. Both are necessary, but mitigation reduces future risk while adaptation manages what is already locked in.',
  },
  {
    id: 'clim-14', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'single', difficulty: 'hard',
    question: 'Why are scientists more confident that human activity is causing current climate change compared to explaining past ice ages?',
    options: [
      'Past ice ages were not real — they are a myth',
      'Past climate changes had natural causes (orbital cycles, volcanic activity); current warming is occurring 10× faster than past natural rates and isotopic analysis of CO₂ confirms the carbon is from fossil fuels',
      'Modern computers can model the atmosphere better than scientists could in the past',
      'Scientists are less certain about human causation than about past ice ages',
    ],
    correctAnswers: [1],
    explanation: 'Milankovitch cycles (Earth\'s orbital variations) drove past ice ages over tens of thousands of years. Current warming is happening in decades — 10× faster. The "fingerprint" of isotopically lighter carbon (from fossil fuels) in atmospheric CO₂ directly links warming to combustion. The pattern of warming (stratosphere cooling while troposphere warms) also matches greenhouse gas physics, not solar forcing.',
  },
  {
    id: 'clim-15', domain: 1, subdomain: 'Climate Change & Atmosphere', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Rising sea levels result from both melting ice sheets/glaciers AND the thermal expansion of warming ocean water.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Both mechanisms contribute. Thermal expansion (water expands as it warms) currently accounts for about half of observed sea level rise. Melting land ice (Greenland and Antarctic ice sheets, mountain glaciers) accounts for the other half. Sea ice melting (like Arctic sea ice) does NOT raise sea levels because floating ice already displaces water — like ice in a glass.',
  },

  // ══════════════════════════════════════════════════════════════
  // Water Resources — 5 new questions (water-09 to water-13)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'water-09', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'medium',
    question: 'What is "water scarcity" and what regions face it most severely?',
    options: [
      'Any region that receives less than 20 inches of annual rainfall',
      'When the demand for freshwater exceeds the available supply, affecting the Middle East, North Africa, and parts of South Asia most severely',
      'Countries that have no rivers or lakes within their borders',
      'Areas where water is only available through desalination',
    ],
    correctAnswers: [1],
    explanation: 'Water scarcity occurs when demand outstrips supply — either due to low rainfall (physical scarcity) or inadequate infrastructure (economic scarcity). The Middle East and North Africa are most affected; 17 countries face extreme water stress. Climate change is projected to intensify scarcity in already-dry regions while increasing flooding in wet regions.',
  },
  {
    id: 'water-10', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'easy',
    question: 'What is the difference between surface water and groundwater?',
    options: [
      'Surface water is salty; groundwater is fresh',
      'Surface water includes rivers, lakes, and streams visible on land; groundwater is stored in underground aquifers in rock and soil',
      'Groundwater is above-ground water that sits on impermeable rock surfaces',
      'There is no difference — they are the same water at different stages of the water cycle',
    ],
    correctAnswers: [1],
    explanation: 'Surface water (rivers, lakes, wetlands, reservoirs) is water visible on Earth\'s surface. Groundwater is stored in aquifers below the surface. Both are connected — precipitation recharges both. Groundwater tends to be cleaner (filtered through soil) but moves slowly. Surface water is more immediately renewable but more vulnerable to pollution.',
  },
  {
    id: 'water-11', domain: 1, subdomain: 'Water Resources', type: 'multi', difficulty: 'medium',
    question: 'Which practices help reduce water pollution from agriculture? (Select all that apply)',
    options: [
      'Riparian buffer strips (vegetated areas along streams)',
      'Applying more fertilizer to compensate for runoff losses',
      'Constructed wetlands to filter agricultural runoff',
      'Precision agriculture using sensors to apply only needed inputs',
    ],
    correctAnswers: [0, 2, 3],
    explanation: 'Riparian buffers absorb runoff and filter nutrients before they reach streams. Constructed wetlands use natural biological processes to remove nitrogen, phosphorus, and sediment. Precision agriculture minimizes over-application of fertilizers and pesticides. Applying excess fertilizer worsens runoff pollution — the opposite of a solution.',
  },
  {
    id: 'water-12', domain: 1, subdomain: 'Water Resources', type: 'single', difficulty: 'hard',
    question: 'What is "virtual water" (also called embedded water)?',
    options: [
      'Water that exists only in computer climate models',
      'The total freshwater consumed to produce a product, including water used at every stage of production',
      'Water vapor in the atmosphere that has not yet precipitated',
      'Artificially produced water through desalination processes',
    ],
    correctAnswers: [1],
    explanation: 'Virtual water is the hidden water embedded in products. Producing 1 kg of beef requires about 15,000 liters of water (for feed crops, drinking, and processing). Trading "virtual water" in food allows water-scarce nations to import food rather than grow it. Understanding virtual water is critical for global water resource management and dietary sustainability choices.',
  },
  {
    id: 'water-13', domain: 1, subdomain: 'Water Resources', type: 'yesno', difficulty: 'medium',
    question: 'True or False: Desalination (removing salt from seawater) could theoretically solve global freshwater scarcity, but current technology is expensive and energy-intensive.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'Desalination technology works and is used in water-scarce regions like Saudi Arabia and Israel, but it requires large amounts of energy, making it expensive and currently dependent on fossil fuels. The concentrated brine waste also poses disposal challenges for marine ecosystems. As renewable energy costs fall, desalination may become more viable at scale.',
  },

  // ══════════════════════════════════════════════════════════════
  // Energy Resources & Sustainability — 3 new questions (energy-12 to energy-14)
  // ══════════════════════════════════════════════════════════════
  {
    id: 'energy-12', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'medium',
    question: 'What is the main challenge with solar and wind energy for grid reliability?',
    options: [
      'Solar and wind produce too much electricity — more than grids can handle',
      'Intermittency — solar and wind only produce electricity when the sun shines or wind blows, requiring storage or backup generation',
      'Solar panels and wind turbines release greenhouse gases during operation',
      'Wind and solar are too expensive to ever compete with fossil fuels',
    ],
    correctAnswers: [1],
    explanation: 'Intermittency is the core challenge: solar produces nothing at night or on cloudy days; wind produces nothing during calm periods. Solutions include battery storage, pumped hydro, demand management, and grid interconnection across large geographic areas. As battery costs have fallen 90% since 2010, storage is becoming economically viable.',
  },
  {
    id: 'energy-13', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'single', difficulty: 'easy',
    question: 'What is geothermal energy?',
    options: [
      'Energy generated from burning plant material and agricultural waste',
      'Heat energy from Earth\'s interior, accessed through steam wells and hot springs to generate electricity or heat buildings',
      'Solar energy stored in the ground and released at night',
      'Energy from ocean tides driven by the Moon\'s gravitational pull',
    ],
    correctAnswers: [1],
    explanation: 'Geothermal energy taps Earth\'s internal heat (from radioactive decay and original planetary formation). In geothermally active areas (Iceland, parts of California, New Zealand), steam or hot water from the Earth can drive turbines. Iceland gets ~25% of its electricity and ~90% of space heating from geothermal — a nearly carbon-free, always-on resource.',
  },
  {
    id: 'energy-14', domain: 1, subdomain: 'Energy Resources & Sustainability', type: 'multi', difficulty: 'medium',
    question: 'Which of the following represent examples of reducing energy demand through efficiency? (Select all that apply)',
    options: [
      'Replacing incandescent bulbs with LED lighting',
      'Adding insulation to buildings to reduce heating and cooling loads',
      'Building larger power plants to supply more electricity',
      'Using public transit instead of individual car trips',
    ],
    correctAnswers: [0, 1, 3],
    explanation: 'Energy efficiency reduces the energy needed to deliver the same service. LEDs use 75% less energy than incandescent bulbs. Building insulation directly reduces heating and cooling demand. Public transit moves many people per unit of energy (far more efficient per passenger-mile than individual cars). Building larger power plants increases supply — that is the opposite of demand reduction.',
  },

  // ── Additional Ecology & Ecosystems ───────────────────────────────
  {
    id: 'eco-16',
    domain: 1,
    subdomain: 'Ecology & Ecosystems',
    type: 'single',
    difficulty: 'medium',
    question: 'The 10% rule of ecological efficiency states that when energy moves from one trophic level to the next, approximately what percentage is available to the next level?',
    options: ['50%', '25%', '10%', '1%'],
    correctAnswers: [2],
    explanation: 'Only about 10% of energy stored at one trophic level is transferred to the next. The remaining 90% is lost as heat through cellular respiration, used for the organism\'s own metabolic processes, or left in indigestible material. This is why food chains are rarely longer than 4-5 levels — energy dissipates so quickly that higher trophic levels become unsustainable. It also explains why eating lower on the food chain (plants vs. meat) is far more energy-efficient.',
  },
  {
    id: 'eco-17',
    domain: 1,
    subdomain: 'Ecology & Ecosystems',
    type: 'single',
    difficulty: 'hard',
    question: 'In primary succession, what is the role of pioneer species?',
    options: [
      'They immediately replace the climax community',
      'They establish themselves first on bare substrate, modify the environment, and make it suitable for later species',
      'They compete with and eliminate native species',
      'They only appear in secondary succession, not primary',
    ],
    correctAnswers: [1],
    explanation: 'Pioneer species colonize bare rock or other harsh substrates where virtually nothing lives. Examples include lichens and mosses. Through their life cycles, they contribute organic matter, trap soil particles, and break down rock through chemical weathering. This gradual modification creates conditions — richer soil, moisture retention, reduced wind — that allow less hardy species to follow. Pioneer species are typically replaced by the very communities they helped establish. They are present only in primary succession by definition.',
  },
  {
    id: 'eco-18',
    domain: 1,
    subdomain: 'Ecology & Ecosystems',
    type: 'yesno',
    difficulty: 'easy',
    question: 'True or False: When a population reaches its carrying capacity (K), the birth rate equals the death rate and the population stops growing.',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. Carrying capacity (K) is the equilibrium population size where births and deaths balance. In the logistic growth model, population growth rate (r) is effectively zero at K because the rate of increase is multiplied by the term (1 − N/K), which equals zero when N = K. In reality, populations rarely hold exactly at K — they fluctuate around it due to environmental variability — but K represents the theoretical equilibrium where net growth ceases.',
  },
  {
    id: 'eco-19',
    domain: 1,
    subdomain: 'Ecology & Ecosystems',
    type: 'multi',
    difficulty: 'medium',
    question: 'Which of the following are examples of mutualistic relationships? Select ALL that apply.',
    options: [
      'Mycorrhizal fungi exchanging phosphorus with plant roots in exchange for sugars',
      'A lion hunting and killing a zebra',
      'Clownfish living in anemones, protecting them from predators while gaining shelter',
      'Nitrogen-fixing bacteria (Rhizobium) living in legume root nodules',
    ],
    correctAnswers: [0, 2, 3],
    explanation: 'Mutualism benefits both species. Mycorrhizal fungi receive plant sugars while delivering mineral nutrients — a classic mutualism. Clownfish-anemone relationships benefit both: fish gain shelter and protection; fish defend anemones from predators. Rhizobium bacteria fix atmospheric nitrogen for legumes while receiving carbohydrates — essential for both partners. A lion hunting a zebra is predation (one organism benefits at direct cost to another), not mutualism.',
  },

  // ── Additional Climate Change & Atmosphere ─────────────────────────
  {
    id: 'cc-16',
    domain: 1,
    subdomain: 'Climate Change & Atmosphere',
    type: 'single',
    difficulty: 'medium',
    question: 'Which greenhouse gas, though present in very small concentrations, has a global warming potential (GWP) approximately 84 times greater than CO₂ over a 20-year period?',
    options: ['Nitrous oxide (N₂O)', 'Methane (CH₄)', 'Water vapor (H₂O)', 'Ozone (O₃)'],
    correctAnswers: [1],
    explanation: 'Methane (CH₄) has a global warming potential about 84 times that of CO₂ over 20 years (and about 28 times over 100 years). It is produced by livestock digestion (enteric fermentation), rice paddies, landfills, and natural gas leaks. Despite being present in far smaller concentrations than CO₂, its high per-molecule warming effect makes it a critical target for climate mitigation. Methane also has a shorter atmospheric lifetime (~12 years) than CO₂, meaning reducing methane emissions has faster climate benefits.',
  },
  {
    id: 'cc-17',
    domain: 1,
    subdomain: 'Climate Change & Atmosphere',
    type: 'single',
    difficulty: 'hard',
    question: 'The ice-albedo feedback loop is a positive feedback that accelerates climate change. Which sequence correctly describes this mechanism?',
    options: [
      'More ice → more solar reflection → lower temperatures → more ice forms',
      'Higher temperatures → ice melts → darker ocean exposed → more heat absorbed → higher temperatures',
      'Higher temperatures → more cloud formation → more solar reflection → lower temperatures',
      'More CO₂ → more ocean absorption → reduced CO₂ → lower temperatures',
    ],
    correctAnswers: [1],
    explanation: 'This is the ice-albedo positive feedback: warming melts sea ice and glaciers, exposing darker ocean water or land beneath. Ice reflects ~80-90% of incoming solar radiation (high albedo); open ocean reflects only ~6% (low albedo). The newly exposed surface absorbs much more solar energy, warming further, melting more ice, exposing more dark surface — a self-reinforcing cycle. Option A describes a negative feedback (stabilizing). Option C is a negative cloud feedback hypothesis. Option D describes ocean carbon uptake, a different process.',
  },
  {
    id: 'cc-18',
    domain: 1,
    subdomain: 'Climate Change & Atmosphere',
    type: 'single',
    difficulty: 'medium',
    question: 'Ocean acidification is primarily caused by:',
    options: [
      'Industrial acid dumping into the ocean',
      'CO₂ dissolving in seawater and forming carbonic acid',
      'Increased temperatures reducing the ocean\'s buffering capacity',
      'Nitrogen runoff from fertilizers creating acidic dead zones',
    ],
    correctAnswers: [1],
    explanation: 'When CO₂ dissolves in seawater, it reacts with water to form carbonic acid (H₂CO₃), which then dissociates to release hydrogen ions, lowering pH. Ocean pH has already decreased from ~8.2 to ~8.1 since the Industrial Revolution — a 26% increase in acidity. This threatens calcifying organisms (coral, mollusks, some plankton) whose calcium carbonate shells dissolve in acidic water. Nitrogen runoff creates hypoxic dead zones but by a different mechanism (eutrophication, not direct acidification).',
  },

  // ── Additional Biodiversity & Conservation ────────────────────────
  {
    id: 'bio-16',
    domain: 1,
    subdomain: 'Biodiversity & Conservation',
    type: 'single',
    difficulty: 'medium',
    question: 'The removal of wolves from Yellowstone in the early 20th century caused elk populations to overgraze riverbanks, leading to stream erosion and degradation. The reintroduction of wolves in 1995 reversed these effects. This phenomenon is known as:',
    options: ['Competitive exclusion', 'A trophic cascade', 'Ecological succession', 'Island biogeography'],
    correctAnswers: [1],
    explanation: 'A trophic cascade occurs when changes at one trophic level ripple down through the food web, affecting organisms at lower levels and even the physical environment. In Yellowstone, wolves (top predators) limited elk movement and reduced overgrazing, allowing riparian vegetation to recover, which stabilized streambanks, cooled water temperatures, and created habitat for beavers and songbirds. This is one of the best-documented examples of a trophic cascade triggered by a keystone predator.',
  },
  {
    id: 'bio-17',
    domain: 1,
    subdomain: 'Biodiversity & Conservation',
    type: 'multi',
    difficulty: 'medium',
    question: 'Which of the following correctly distinguish between threatened and endangered species under the U.S. Endangered Species Act (ESA)? Select ALL that apply.',
    options: [
      'Endangered species face imminent risk of extinction throughout all or a significant portion of their range',
      'Threatened species are likely to become endangered in the foreseeable future',
      'Only vertebrate animals can be listed under the ESA',
      'Both threatened and endangered species receive federal protections once listed',
    ],
    correctAnswers: [0, 1, 3],
    explanation: 'Endangered means the species is at risk of extinction NOW; threatened means it\'s likely to become endangered if trends continue. Both categories receive federal protection once listed under the ESA, including protection from "take" (harm, harassment, pursuit, capture, or killing). The ESA protects plants, invertebrates, fish, reptiles, birds, and mammals — not just vertebrates. Listing decisions are supposed to be based purely on biological status, without economic consideration.',
  },
  {
    id: 'bio-18',
    domain: 1,
    subdomain: 'Biodiversity & Conservation',
    type: 'single',
    difficulty: 'hard',
    question: 'The HIPPO acronym is used to summarize the main drivers of biodiversity loss. What does HIPPO stand for?',
    options: [
      'Hunting, Invasives, Pollution, Population growth, Overexploitation',
      'Habitat destruction, Invasive species, Pollution, human Population growth, Overexploitation',
      'Habitat loss, Introduced species, Pesticides, Predation, Overgrazing',
      'Human impact, Isolation, Pollution, Predation, Overharvesting',
    ],
    correctAnswers: [1],
    explanation: 'HIPPO: Habitat destruction (most significant — loss of native habitat is the #1 driver of biodiversity loss worldwide), Invasive species (outcompete native species), Pollution (chemical, plastic, light, noise), human Population growth (drives all other pressures), and Overexploitation (overfishing, poaching, hunting). The order roughly reflects relative impact, with habitat destruction — particularly tropical deforestation — being by far the most significant single threat to global biodiversity.',
  },

  // ── Additional Water Resources ────────────────────────────────────
  {
    id: 'wr-09',
    domain: 1,
    subdomain: 'Water Resources',
    type: 'single',
    difficulty: 'medium',
    question: 'Eutrophication in a lake begins with nutrient runoff. Which sequence correctly traces the chain of effects?',
    options: [
      'Nutrients → algal bloom → sunlight penetration increases → more aquatic plants grow',
      'Nutrients → algal bloom → algae die and decompose → oxygen depleted → fish suffocate',
      'Nutrients → pH rises → fish become hyperactive → ecosystem becomes more productive',
      'Nutrients → algal bloom → increased evaporation → lake water level drops',
    ],
    correctAnswers: [1],
    explanation: 'Eutrophication follows a chain: excess nutrients (nitrogen and phosphorus, primarily from fertilizer runoff) → explosive algal growth (algal bloom) → algae cover the surface, blocking sunlight for submerged plants → when algae die, bacteria decompose the organic matter using oxygen → dissolved oxygen drops to near zero (hypoxia) → fish and other aquatic organisms suffocate. The resulting hypoxic area is called a dead zone. Large dead zones exist in the Gulf of Mexico and Chesapeake Bay from agricultural runoff.',
  },
  {
    id: 'wr-10',
    domain: 1,
    subdomain: 'Water Resources',
    type: 'single',
    difficulty: 'easy',
    question: 'Which of the following is the PRIMARY difference between point source and nonpoint source water pollution?',
    options: [
      'Point source is always more harmful than nonpoint source',
      'Point source comes from a specific, identifiable location; nonpoint source comes from diffuse, hard-to-trace origins',
      'Point source only affects groundwater; nonpoint source only affects surface water',
      'Nonpoint source pollution is always natural; point source is always industrial',
    ],
    correctAnswers: [1],
    explanation: 'The defining difference is specificity: point source pollution can be traced to a single, identifiable discharge point — a factory outflow pipe, a sewage treatment plant outlet, an oil spill location. Nonpoint source pollution comes from many diffuse sources across a landscape — agricultural runoff carrying fertilizers and pesticides, urban stormwater carrying motor oil and pet waste, suburban lawn chemical leaching. Nonpoint source is responsible for most water quality problems in the U.S. because it\'s much harder to regulate and treat.',
  },

  // ── Additional Energy Resources & Sustainability ───────────────────
  {
    id: 'energy-15',
    domain: 1,
    subdomain: 'Energy Resources & Sustainability',
    type: 'single',
    difficulty: 'medium',
    question: 'Which energy source has the highest energy return on investment (EROI) among the options listed?',
    options: ['Corn ethanol (biofuel)', 'Solar photovoltaic', 'Conventional oil and gas', 'Tar sands oil'],
    correctAnswers: [2],
    explanation: 'Conventional oil and gas has historically had EROIs of 20:1 to 40:1 — you get 20-40 units of energy for every unit invested in extraction. Tar sands oil is much lower (~3:1 to 5:1) because extraction requires enormous energy inputs. Solar PV has improved dramatically (~10:1 to 30:1 over its lifecycle in high-sunlight areas). Corn ethanol often has an EROI near or below 1:1 — barely energy-positive or actually energy-negative — making it among the least efficient liquid fuels. EROI helps evaluate the net energy value of different sources.',
  },
  {
    id: 'energy-16',
    domain: 1,
    subdomain: 'Energy Resources & Sustainability',
    type: 'yesno',
    difficulty: 'medium',
    question: 'True or False: Nuclear power produces significant greenhouse gas emissions during electricity generation.',
    options: ['True', 'False'],
    correctAnswers: [1],
    explanation: 'False. Nuclear power produces essentially zero greenhouse gas emissions during operation — the fission process does not combust carbon-containing fuels. Life-cycle analyses (including uranium mining, plant construction, and decommissioning) show nuclear has one of the lowest carbon footprints per kilowatt-hour of any electricity source, comparable to wind and solar. The primary concerns about nuclear are safety (accident risk), waste storage (radioactive waste persists for thousands of years), and high capital costs — not direct carbon emissions.',
  },
  {
    id: 'energy-17',
    domain: 1,
    subdomain: 'Energy Resources & Sustainability',
    type: 'single',
    difficulty: 'hard',
    question: 'The Brundtland Commission definition of sustainable development (1987) focuses on:',
    options: [
      'Achieving zero economic growth to prevent resource depletion',
      'Meeting the needs of the present without compromising the ability of future generations to meet their own needs',
      'Protecting ecosystems even if it means reducing human welfare in the short term',
      'Replacing all fossil fuels with renewables within 20 years',
    ],
    correctAnswers: [1],
    explanation: 'The Brundtland Commission (formally the World Commission on Environment and Development) defined sustainable development as "development that meets the needs of the present without compromising the ability of future generations to meet their own needs." This definition intentionally balances three pillars: economic development (meeting present needs), social equity (for all people now), and environmental protection (for future generations). It rejects both "no growth" and "unlimited growth" extremes in favor of development that stays within planetary boundaries.',
  },
];
