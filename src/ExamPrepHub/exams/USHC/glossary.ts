// Glossary for USHC — U.S. History and the Constitution. Terms an 11th
// grader is expected to recognize on the SC EOCEP. Shown as a Glossary
// accordion in the Study Guide and indexed by the unified search.

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export const glossary: GlossaryEntry[] = [
  // ── Foundations & Constitution ────────────────────────────────────
  { term: 'Articles of Confederation',  definition: 'The first U.S. national government (1781–89). Weak central government, no power to tax, no executive, no national court. Failed under Shays\' Rebellion — replaced by the Constitution.' },
  { term: 'Bill of Rights',             definition: 'The first ten amendments to the Constitution, ratified 1791. Guarantees individual liberties: speech, religion, assembly, due process, jury trial, protection from unreasonable searches.' },
  { term: 'Federalism',                 definition: 'Power is split between the national (federal) government and the states. Some powers belong to one, some to the other, some are shared.' },
  { term: 'Separation of Powers',       definition: 'The three federal branches — legislative, executive, judicial — each have distinct powers so no single branch dominates.' },
  { term: 'Checks and Balances',        definition: 'Each branch can limit the others — Congress can override a veto, the President appoints judges, the Supreme Court can rule laws unconstitutional. Keeps any one branch from running away with power.' },
  { term: 'Three-Fifths Compromise',    definition: '1787 deal at the Constitutional Convention counting an enslaved person as 3/5 of a person for representation and taxation. A pro-slavery concession that inflated Southern congressional power until the 13th Amendment.' },
  { term: 'Electoral College',          definition: 'The body that actually elects the president. Each state gets electors equal to its House + Senate seats. Created to balance popular vote with state-level power.' },
  { term: 'Federalist Papers',          definition: 'Series of 85 essays by Hamilton, Madison, and Jay arguing for ratification of the Constitution. Federalist 10 and 51 are the most exam-relevant.' },
  { term: 'Marbury v. Madison',         definition: '1803 Supreme Court case (John Marshall) that established judicial review — the Court\'s power to declare laws unconstitutional.' },

  // ── Reconstruction ────────────────────────────────────────────────
  { term: '13th Amendment',             definition: 'Ratified 1865. Abolished slavery and involuntary servitude (except as punishment for a crime).' },
  { term: '14th Amendment',             definition: 'Ratified 1868. Guarantees citizenship to anyone born in the U.S., equal protection of the laws, and due process. The most-cited amendment in modern civil rights cases.' },
  { term: '15th Amendment',             definition: 'Ratified 1870. The right to vote cannot be denied based on race, color, or previous condition of servitude. (Sex was not added until the 19th Amendment, 1920.)' },
  { term: 'Freedmen\'s Bureau',          definition: 'Federal agency 1865–72 that provided food, schools, medical care, and labor contracts for formerly enslaved people. Underfunded but built historically Black colleges.' },
  { term: 'Black Codes',                definition: 'Southern state laws (1865–66) restricting freedmen — vagrancy arrests, labor contracts, no land ownership. Designed to recreate slavery in all but name. Provoked the 14th Amendment.' },
  { term: 'Jim Crow',                   definition: 'The system of state and local laws enforcing racial segregation in the South from Reconstruction\'s end (1877) until the Civil Rights Movement. Codified by Plessy v. Ferguson (1896).' },
  { term: 'Compromise of 1877',         definition: 'Resolved the disputed 1876 election: Hayes became president in exchange for ending Reconstruction and removing federal troops from the South. Began the Jim Crow era.' },

  // ── Industrialization & Progressive Era ───────────────────────────
  { term: 'Robber baron',               definition: 'Pejorative for late-1800s industrialists (Rockefeller, Carnegie, Vanderbilt, Morgan) who built empires through ruthless tactics. "Captain of industry" is the positive framing.' },
  { term: 'Sherman Antitrust Act',      definition: '1890 law banning monopolies and restraint of trade. Initially used against labor unions; later weaponized by Theodore Roosevelt against Standard Oil and the railroads.' },
  { term: 'Muckraker',                  definition: 'Early-1900s investigative journalists who exposed corporate and political corruption. Examples: Upton Sinclair (meatpacking), Ida Tarbell (Standard Oil), Jacob Riis (tenement housing).' },
  { term: '16th Amendment',             definition: 'Ratified 1913. Created the federal income tax. Made the modern federal government possible — funded the New Deal, WWII, and everything after.' },
  { term: '17th Amendment',             definition: 'Ratified 1913. Direct popular election of U.S. Senators (previously chosen by state legislatures).' },
  { term: '18th Amendment',             definition: 'Ratified 1919. National Prohibition — banned the manufacture, sale, and transport of alcohol. Repealed by the 21st Amendment in 1933 — the only amendment ever repealed.' },
  { term: '19th Amendment',             definition: 'Ratified 1920. Women\'s suffrage. Capstone of the long suffrage movement led by Susan B. Anthony, Elizabeth Cady Stanton, and Alice Paul.' },

  // ── WWI, 1920s, Depression, New Deal ──────────────────────────────
  { term: 'Treaty of Versailles',       definition: '1919 treaty ending WWI. Imposed harsh terms on Germany (war guilt, reparations, lost territory). The U.S. Senate REJECTED it — the country never joined the League of Nations.' },
  { term: 'Harlem Renaissance',         definition: '1920s flowering of Black art, literature, music, and intellectual life in Harlem. Langston Hughes, Zora Neale Hurston, Duke Ellington.' },
  { term: 'New Deal',                   definition: 'FDR\'s 1933–39 response to the Great Depression. Programs to provide Relief (CCC, WPA), Recovery (NRA, AAA), and Reform (SSA, FDIC, SEC). Permanently expanded federal government scope.' },
  { term: 'Social Security Act',        definition: '1935 New Deal program creating retirement pensions, unemployment insurance, and aid for dependent children. The most durable New Deal program — still core federal policy.' },

  // ── WWII & Cold War ───────────────────────────────────────────────
  { term: 'Pearl Harbor',               definition: 'Japanese surprise attack on the U.S. Pacific Fleet at Hawaii on December 7, 1941. Brought the U.S. into WWII the next day.' },
  { term: 'Manhattan Project',          definition: 'Top-secret WWII program (1942–45) that developed the atomic bomb. Led by Robert Oppenheimer at Los Alamos. Bombs dropped on Hiroshima and Nagasaki in August 1945.' },
  { term: 'Truman Doctrine',            definition: '1947 policy committing the U.S. to "support free peoples resisting subjugation" — i.e., contain Soviet influence. Started the Cold War in earnest.' },
  { term: 'Marshall Plan',              definition: '1948–52 U.S. aid program ($13 billion) rebuilding Western Europe after WWII. Combined humanitarian goals with containing communism by stabilizing democracies.' },
  { term: 'NATO',                       definition: 'North Atlantic Treaty Organization, founded 1949. A mutual-defense alliance of the U.S., Canada, and Western European democracies — an attack on one is an attack on all.' },

  // ── Civil Rights & Modern Era ─────────────────────────────────────
  { term: 'Brown v. Board of Education',definition: '1954 Supreme Court case (Warren Court) declaring segregated public schools unconstitutional. Overturned Plessy v. Ferguson\'s "separate but equal" doctrine.' },
  { term: 'Civil Rights Act of 1964',   definition: 'Banned discrimination in employment, public accommodations, and federally-funded programs based on race, color, religion, sex, or national origin. Signed by Lyndon Johnson.' },
  { term: 'Voting Rights Act of 1965',  definition: 'Banned literacy tests and other devices used to disenfranchise Black voters. Authorized federal oversight of elections in jurisdictions with histories of discrimination.' },
];
