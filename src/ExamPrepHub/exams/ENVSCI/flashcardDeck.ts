// Flashcard deck for ENVSCI — SC Environmental Science (11th grade).
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [

  // === Earth Systems & Biogeochemical Cycles ===
  {
    id: 'es-fc-01',
    topic: 'Earth Systems & Biogeochemical Cycles',
    front: 'What are the four major Earth systems and how do they interact?',
    back: 'Atmosphere (gases), Hydrosphere (all water), Geosphere (rock and soil), Biosphere (all life). They constantly exchange matter and energy — volcanoes (geosphere) release CO₂ into the atmosphere; plants (biosphere) pull it back out; rain (hydrosphere) weathers rock (geosphere) releasing minerals.',
  },
  {
    id: 'es-fc-02',
    topic: 'Earth Systems & Biogeochemical Cycles',
    front: 'Describe the carbon cycle: which processes release CO₂ and which remove it?',
    back: 'RELEASES: combustion, cellular respiration, decomposition, volcanic activity. REMOVES: photosynthesis (plants, algae), dissolution in oceans. Human burning of fossil fuels releases ancient carbon far faster than natural sinks can absorb it, causing net CO₂ increase in the atmosphere.',
  },
  {
    id: 'es-fc-03',
    topic: 'Earth Systems & Biogeochemical Cycles',
    front: 'What is nitrogen fixation, and why can\'t plants absorb N₂ directly from the air?',
    back: 'N₂ (78% of air) has a very strong triple bond most organisms cannot break. Nitrogen-fixing bacteria (in soil and legume root nodules) break it, converting N₂ → ammonium (NH₄⁺) plants can absorb. Without this, nitrogen would be locked in the atmosphere even though it\'s abundant.',
  },
  {
    id: 'es-fc-04',
    topic: 'Earth Systems & Biogeochemical Cycles',
    front: 'How does the phosphorus cycle differ from the carbon and nitrogen cycles?',
    back: 'Phosphorus has NO significant atmospheric stage. It cycles through rock weathering → soil → plants/animals → water/sediment → rock again. This makes it a "slow" cycle (millions of years) and a frequent limiting nutrient in ecosystems. Fertilizer runoff short-circuits the cycle, causing eutrophication.',
  },
  {
    id: 'es-fc-05',
    topic: 'Earth Systems & Biogeochemical Cycles',
    front: 'What is eutrophication and what is its end result in water bodies?',
    back: 'Excess nitrogen and phosphorus (from fertilizer runoff) → explosive algae growth → algae die → decomposers break them down using oxygen → oxygen levels crash → fish and other organisms suffocate. The resulting oxygen-depleted zone is called a "dead zone" or hypoxic zone.',
  },
  {
    id: 'es-fc-06',
    topic: 'Earth Systems & Biogeochemical Cycles',
    front: 'Name the three rock types and how they convert in the rock cycle.',
    back: 'Igneous (from cooling magma/lava), Sedimentary (from compacted sediments), Metamorphic (from heat/pressure changing existing rock). Conversions: magma cools → igneous; weathering + compaction → sedimentary; heat/pressure → metamorphic; melting any rock → magma. All types can become any other type given the right conditions.',
  },
  {
    id: 'es-fc-07',
    topic: 'Earth Systems & Biogeochemical Cycles',
    front: 'What role do decomposers play in biogeochemical cycles?',
    back: 'Decomposers (bacteria, fungi) break down dead organic matter and release nutrients (C, N, P) back into the soil and atmosphere in forms other organisms can reuse. They are the ultimate recyclers — without them, nutrients would be permanently locked in dead tissue and life as we know it would halt.',
  },

  // === Ecology & Ecosystems ===
  {
    id: 'eco-fc-01',
    topic: 'Ecology & Ecosystems',
    front: 'What is the 10% energy rule, and what does it imply about food chain length?',
    back: 'Only ~10% of energy transfers from one trophic level to the next; 90% is lost as heat, waste, and metabolic processes. This limits practical food chain length to 4–5 links. After 4 levels, only 0.01% of original energy remains. It also explains why there are always more prey than predators.',
  },
  {
    id: 'eco-fc-02',
    topic: 'Ecology & Ecosystems',
    front: 'What is the difference between a food chain and a food web?',
    back: 'A food chain is a single linear sequence (grass → rabbit → fox). A food web shows all the complex, interconnected feeding relationships in an ecosystem. Food webs are more realistic — most organisms eat multiple species. Disrupting one node in a web can ripple through many species.',
  },
  {
    id: 'eco-fc-03',
    topic: 'Ecology & Ecosystems',
    front: 'What is a keystone species? Give an example.',
    back: 'A species with a disproportionately large effect on ecosystem structure relative to its abundance. Remove it and the ecosystem dramatically changes. Example: sea otters eat sea urchins — without otters, urchins explode and destroy kelp forests, collapsing the entire kelp ecosystem. Wolves in Yellowstone are another classic example.',
  },
  {
    id: 'eco-fc-04',
    topic: 'Ecology & Ecosystems',
    front: 'Compare primary and secondary ecological succession.',
    back: 'Primary: begins on bare substrate (lava, glacial till) with no soil. Pioneer species (lichens, mosses) slowly build soil. Very slow — hundreds of years to reach climax. Secondary: begins after disturbance (fire, flood) where soil remains. Proceeds much faster because soil and seed banks are present. Both lead toward a stable climax community.',
  },
  {
    id: 'eco-fc-05',
    topic: 'Ecology & Ecosystems',
    front: 'What is carrying capacity (K) and what happens when a population exceeds it?',
    back: 'K is the maximum population size an environment can sustainably support given available resources. When a population overshoots K, resources become insufficient: food, water, or space runs out, and density-dependent factors (disease, starvation, competition) drive the population back down. Populations tend to fluctuate around K.',
  },
  {
    id: 'eco-fc-06',
    topic: 'Ecology & Ecosystems',
    front: 'What are the three types of symbiosis? Give an example of each.',
    back: 'Mutualism (+/+): both benefit — clownfish and sea anemone. Commensalism (+/0): one benefits, other unaffected — barnacles on a whale. Parasitism (+/−): one benefits, one harmed — tapeworm in a host. Predation is similar (+/−) but the prey is killed, not just harmed.',
  },

  // === Biodiversity & Conservation ===
  {
    id: 'bio-fc-01',
    topic: 'Biodiversity & Conservation',
    front: 'What are the three levels of biodiversity?',
    back: '1. Genetic diversity: variety of alleles within a species. 2. Species diversity: variety of species in an area. 3. Ecosystem diversity: variety of habitats, communities, and ecological processes. All three levels are important — losing genetic diversity can doom a species even if individuals survive.',
  },
  {
    id: 'bio-fc-02',
    topic: 'Biodiversity & Conservation',
    front: 'What are the four major threats to biodiversity? (Use the acronym HIPPO)',
    back: 'H — Habitat loss (leading cause, ~85% of threatened species). I — Invasive species. P — Pollution. P — Population growth (human). O — Overexploitation (overhunting, overfishing). Habitat loss is by far the dominant driver. Climate change is increasingly considered a sixth major threat.',
  },
  {
    id: 'bio-fc-03',
    topic: 'Biodiversity & Conservation',
    front: 'What is habitat fragmentation and how does it increase extinction risk?',
    back: 'Fragmentation splits large continuous habitats into smaller isolated patches via roads, agriculture, and development. Effects: smaller populations (lower genetic diversity, more vulnerable to disease), edge effects (altered microclimate, invasive species penetration), and blocked animal movement. Species needing large home ranges often cannot survive in fragments.',
  },
  {
    id: 'bio-fc-04',
    topic: 'Biodiversity & Conservation',
    front: 'What is an invasive species and why are they so damaging?',
    back: 'A non-native organism introduced to a new ecosystem where it spreads rapidly. Invasive species lack natural predators, parasites, or competitors in their new home, so nothing keeps them in check. They outcompete native species for food and space. Examples: kudzu, emerald ash borer, zebra mussels, Burmese pythons in Florida.',
  },
  {
    id: 'bio-fc-05',
    topic: 'Biodiversity & Conservation',
    front: 'What are ecosystem services and why do they have economic value?',
    back: 'Ecosystem services are benefits humans receive from healthy ecosystems: pollination (75% of food crops depend on it), water purification (wetlands filter pollutants), climate regulation (forests store carbon), flood control, soil formation, and natural medicines. The global value is estimated at trillions of dollars per year — far exceeding the cost of conservation.',
  },
  {
    id: 'bio-fc-06',
    topic: 'Biodiversity & Conservation',
    front: 'What does "endemic species" mean, and why do endemic species face higher extinction risk?',
    back: 'Endemic species are found ONLY in one specific geographic area and nowhere else. Because their entire population exists in one place, habitat destruction or a single invasive species can eliminate them globally. Islands have the highest proportions of endemic species — and the highest extinction rates.',
  },

  // === Human Population & Land Use ===
  {
    id: 'pop-fc-01',
    topic: 'Human Population & Land Use',
    front: 'Describe the four stages of the Demographic Transition Model.',
    back: 'Stage 1: High birth + high death rates → stable but small population (pre-industrial). Stage 2: Death rates fall (medicine, sanitation) but birth rates stay high → rapid growth. Stage 3: Birth rates also fall as women\'s education and economic opportunities increase. Stage 4: Both low → stable, aging population. Most developed nations are in Stage 4.',
  },
  {
    id: 'pop-fc-02',
    topic: 'Human Population & Land Use',
    front: 'What is the tragedy of the commons?',
    back: 'When a shared resource (fishery, clean air, groundwater) is open-access, each individual rationally over-uses it because they capture all the benefit while sharing the cost of depletion. Result: the resource is destroyed even when no single user intends that outcome. Solutions: regulation, privatization, or community-managed agreements.',
  },
  {
    id: 'pop-fc-03',
    topic: 'Human Population & Land Use',
    front: 'What are the main environmental impacts of modern industrial agriculture?',
    back: 'Soil erosion (tilling + monoculture), nutrient runoff causing eutrophication, pesticide/herbicide contamination, groundwater depletion, greenhouse gas emissions (N₂O from fertilizers, CH₄ from livestock), biodiversity loss from habitat conversion, and water pollution. Agriculture accounts for ~25% of global greenhouse gas emissions.',
  },
  {
    id: 'pop-fc-04',
    topic: 'Human Population & Land Use',
    front: 'What is desertification and what human activities cause it?',
    back: 'The degradation of fertile dryland into desert-like conditions. Causes: overgrazing (removes vegetation, compacts soil), deforestation (exposes soil to erosion), unsustainable irrigation (salinization, waterlogging), and climate change reducing rainfall. Affects 1/3 of Earth\'s land, threatening food security for hundreds of millions.',
  },
  {
    id: 'pop-fc-05',
    topic: 'Human Population & Land Use',
    front: 'What is an ecological footprint?',
    back: 'A measure of how much bioproductive land and water an individual or population needs to produce their resources and absorb their waste. Measured in global hectares. Currently humanity uses about 1.75 Earths — we are in "ecological overshoot," depleting resources faster than they regenerate.',
  },

  // === Climate Change & Atmosphere ===
  {
    id: 'clim-fc-01',
    topic: 'Climate Change & Atmosphere',
    front: 'How does the greenhouse effect work? What is the analogy?',
    back: 'Like a car window on a sunny day: sunlight (short-wave radiation) passes through glass (atmosphere) and heats the interior. Heat (infrared/long-wave radiation) cannot escape through the glass as easily, so the interior warms. GHGs (CO₂, CH₄, N₂O, water vapor) are the "glass" — they absorb outgoing heat and re-radiate it back to Earth.',
  },
  {
    id: 'clim-fc-02',
    topic: 'Climate Change & Atmosphere',
    front: 'What is the difference between climate mitigation and climate adaptation?',
    back: 'Mitigation: reducing greenhouse gas emissions or increasing carbon sinks to slow the rate of climate change (e.g., renewable energy, reforestation, electric vehicles). Adaptation: adjusting to climate impacts already occurring or unavoidable (e.g., sea walls, drought-resistant crops, heat emergency plans). Both are necessary.',
  },
  {
    id: 'clim-fc-03',
    topic: 'Climate Change & Atmosphere',
    front: 'What is ocean acidification and why does it threaten marine life?',
    back: 'CO₂ dissolves in seawater forming carbonic acid (H₂CO₃), lowering ocean pH. Since 1750, ocean pH dropped from 8.2 to 8.1 — a 25% increase in acidity (log scale). Lower pH dissolves calcium carbonate shells, threatening corals, oysters, clams, and the entire marine food web that depends on them.',
  },
  {
    id: 'clim-fc-04',
    topic: 'Climate Change & Atmosphere',
    front: 'What is the ice-albedo feedback loop and why is it a "positive" feedback?',
    back: 'As Arctic ice melts from warming, it exposes darker ocean water. Dark ocean has low albedo (absorbs ~90% of sunlight) vs. white ice (reflects ~80%). More absorption → more warming → more ice melts. "Positive" means amplifying — the initial warming is made larger. This is one reason Arctic warming is happening 4× faster than the global average.',
  },
  {
    id: 'clim-fc-05',
    topic: 'Climate Change & Atmosphere',
    front: 'Why is methane a more potent short-term greenhouse gas than CO₂?',
    back: 'Methane (CH₄) has a global warming potential ~80× that of CO₂ over 20 years due to its molecular structure efficiently absorbing infrared radiation. However, it breaks down in 12 years vs. centuries for CO₂. Sources: livestock digestion, rice paddies, landfills, natural gas leaks. Reducing methane is one of the fastest ways to slow near-term warming.',
  },

  // === Water Resources ===
  {
    id: 'water-fc-01',
    topic: 'Water Resources',
    front: 'How much of Earth\'s water is accessible freshwater, and where is most freshwater stored?',
    back: '97% of Earth\'s water is saltwater. Of the 3% freshwater: ~69% is locked in glaciers and ice caps, ~30% is groundwater, and only ~0.3% is surface freshwater (lakes, rivers, swamps) accessible to most human uses. This tiny fraction must supply all human drinking, agriculture, and industry.',
  },
  {
    id: 'water-fc-02',
    topic: 'Water Resources',
    front: 'What is an aquifer, and what is the concern about overdrafting?',
    back: 'An aquifer is an underground layer of permeable rock or sediment that holds groundwater. Overdrafting means withdrawing groundwater faster than natural recharge (rain and snowmelt percolating down). Consequences: wells run dry, land subsidence, saltwater intrusion in coastal areas. The Ogallala Aquifer under the US Great Plains is being depleted at alarming rates.',
  },
  {
    id: 'water-fc-03',
    topic: 'Water Resources',
    front: 'What is the difference between point source and non-point source water pollution?',
    back: 'Point source: pollution from a single, identifiable location — a pipe, drain, factory outlet. Regulated by NPDES permits under the Clean Water Act. Non-point source (NPS): diffuse pollution with no single identifiable origin — agricultural runoff, urban stormwater, road salts. NPS is the leading remaining water quality problem and is much harder to regulate.',
  },
  {
    id: 'water-fc-04',
    topic: 'Water Resources',
    front: 'Why are wetlands considered a critical resource?',
    back: 'Wetlands provide multiple ecosystem services: filtering pollutants (plants and microbes remove nitrogen, phosphorus, heavy metals), recharging groundwater aquifers, reducing flooding (absorbing storm surges like sponges), storing carbon, and providing habitat for 40%+ of world\'s species. Despite this, 50%+ of US wetlands have been drained.',
  },
  {
    id: 'water-fc-05',
    topic: 'Water Resources',
    front: 'What is drip irrigation and why is it more sustainable than flood or sprinkler irrigation?',
    back: 'Drip irrigation delivers water directly to plant roots through tubes with small emitters, achieving 90%+ efficiency. Traditional flood irrigation loses 50-60% to evaporation and runoff. Sprinkler loses 70-80%. Drip can reduce agricultural water use by 30-50% while maintaining or improving crop yields — critical as water stress increases globally.',
  },

  // === Energy Resources & Sustainability ===
  {
    id: 'energy-fc-01',
    topic: 'Energy Resources & Sustainability',
    front: 'What is EROI (Energy Return on Investment) and why does it matter?',
    back: 'EROI = energy delivered ÷ energy required to obtain it. Early oil had EROI of 100:1; today\'s conventional oil is ~10:1. Solar is ~20-40:1; wind ~18-34:1. An EROI below ~3:1 means most energy goes to getting the energy — society needs high-EROI sources to have surplus energy for economic activity. Declining EROI for fossil fuels is an argument for renewables.',
  },
  {
    id: 'energy-fc-02',
    topic: 'Energy Resources & Sustainability',
    front: 'Compare the lifecycle greenhouse gas emissions of coal, natural gas, solar, wind, and nuclear.',
    back: 'Per kWh of electricity (approximate gCO₂eq): Coal ~820, Natural gas ~490, Solar ~40-50, Nuclear ~12, Wind ~11. Solar and wind have embodied carbon in manufacturing but zero operational emissions. Nuclear has very low lifecycle emissions despite fuel processing. Coal is roughly 75× more carbon-intensive than wind per unit of electricity.',
  },
  {
    id: 'energy-fc-03',
    topic: 'Energy Resources & Sustainability',
    front: 'What is the definition of sustainability from the Brundtland Commission?',
    back: '"Development that meets the needs of the present without compromising the ability of future generations to meet their own needs." (1987 UN Brundtland Report). The three pillars: environmental protection, social equity, and economic development. Sustainability requires balancing all three simultaneously.',
  },
  {
    id: 'energy-fc-04',
    topic: 'Energy Resources & Sustainability',
    front: 'What is a "negative externality" in environmental economics?',
    back: 'A cost of economic activity paid by third parties, not by the producer or consumer. Example: a coal plant pays for coal but not for health costs (asthma, cancer) or climate damage borne by society. When externalities aren\'t priced in, the market overproduces polluting goods. Carbon taxes or cap-and-trade systems attempt to "internalize" these costs.',
  },
  {
    id: 'energy-fc-05',
    topic: 'Energy Resources & Sustainability',
    front: 'What are the main advantages and challenges of nuclear energy?',
    back: 'ADVANTAGES: Very low lifecycle GHG emissions, high energy density (small land footprint), reliable 24/7 baseload power, no air pollution. CHALLENGES: High upfront construction cost and time, radioactive waste requires safe storage for thousands of years, public concerns about accidents (Chernobyl, Fukushima), uranium is finite (though abundant).',
  },
];
