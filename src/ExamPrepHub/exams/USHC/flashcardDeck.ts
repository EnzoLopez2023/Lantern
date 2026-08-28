// Flashcard deck for USHC — U.S. History and the Constitution.
// Concept cards used by the Flashcards tab with SM-2 spaced repetition.

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export const flashcards: Flashcard[] = [
  // === Foundations & Constitution ===
  {
    id: 'found-1',
    topic: 'Foundations',
    front: 'What weakness of the Articles of Confederation made a new Constitution necessary?',
    back: 'No power to tax, no executive, no national court, and no power to regulate interstate commerce. Shays\' Rebellion (1786–87) exposed how helpless the federal government was — Massachusetts had to put down the revolt itself.',
  },
  {
    id: 'found-2',
    topic: 'Foundations',
    front: 'What is federalism?',
    back: 'Power is divided between the national government and the states. Some powers belong to one (declaring war = federal; running schools = state), some are shared (taxing, building roads).',
  },
  {
    id: 'found-3',
    topic: 'Foundations',
    front: 'What are the three branches of the federal government and what does each do?',
    back: 'Legislative (Congress) writes laws. Executive (President) enforces laws. Judicial (Supreme Court) interprets laws and judges their constitutionality.',
  },
  {
    id: 'found-4',
    topic: 'Foundations',
    front: 'Give one example of a check the legislative branch has on the executive.',
    back: 'Congress can override a presidential veto with a 2/3 majority in both houses. The Senate confirms presidential appointments and ratifies treaties. The House can impeach; the Senate convicts.',
  },
  {
    id: 'found-5',
    topic: 'Foundations',
    front: 'What did Marbury v. Madison (1803) establish?',
    back: 'Judicial review — the Supreme Court\'s power to declare federal laws unconstitutional. This is the foundation of the Court\'s modern authority. Chief Justice John Marshall wrote the opinion.',
  },
  {
    id: 'found-6',
    topic: 'Foundations',
    front: 'What was the Three-Fifths Compromise?',
    back: 'At the 1787 Convention, enslaved people would count as 3/5 of a person for both representation in Congress and direct taxation. A pro-slavery concession that inflated Southern political power until the 13th Amendment.',
  },

  // === Reconstruction ===
  {
    id: 'recon-1',
    topic: 'Reconstruction',
    front: 'What did the 13th, 14th, and 15th Amendments do?',
    back: '13th (1865): abolished slavery. 14th (1868): citizenship + equal protection + due process. 15th (1870): right to vote regardless of race. Together, the "Reconstruction Amendments."',
  },
  {
    id: 'recon-2',
    topic: 'Reconstruction',
    front: 'Why is the 14th Amendment the most-cited in modern civil rights cases?',
    back: 'Its Equal Protection Clause is the legal foundation for Brown v. Board, Loving v. Virginia, Obergefell, and countless other rulings. It applies to STATE actions, which is where most civil rights conflicts play out.',
  },
  {
    id: 'recon-3',
    topic: 'Reconstruction',
    front: 'What ended Reconstruction?',
    back: 'The Compromise of 1877. The disputed Hayes-Tilden election was resolved when Hayes got the presidency in exchange for withdrawing federal troops from the South. Southern states immediately began enacting Jim Crow laws.',
  },
  {
    id: 'recon-4',
    topic: 'Reconstruction',
    front: 'What was Plessy v. Ferguson (1896)?',
    back: 'The Supreme Court ruling that "separate but equal" facilities were constitutional. Legally entrenched Jim Crow segregation for 58 years until Brown v. Board overturned it.',
  },

  // === Industrial / Progressive ===
  {
    id: 'ind-1',
    topic: 'Industrialization',
    front: 'Name three "robber barons" and the industry each dominated.',
    back: 'John D. Rockefeller — oil (Standard Oil). Andrew Carnegie — steel. J.P. Morgan — finance/banking. Cornelius Vanderbilt — railroads.',
  },
  {
    id: 'ind-2',
    topic: 'Industrialization',
    front: 'What did the Sherman Antitrust Act do?',
    back: 'Outlawed monopolies and trusts that restrained interstate commerce. Initially used against labor unions; Theodore Roosevelt revived it to bust Standard Oil and the railroad trusts in the 1900s.',
  },
  {
    id: 'prog-1',
    topic: 'Progressive Era',
    front: 'Who were the muckrakers?',
    back: 'Investigative journalists exposing corruption and abuse. Upton Sinclair (The Jungle — meatpacking), Ida Tarbell (Standard Oil), Jacob Riis (tenement photography), Lincoln Steffens (city machines).',
  },
  {
    id: 'prog-2',
    topic: 'Progressive Era',
    front: 'What did the four Progressive amendments accomplish? (16, 17, 18, 19)',
    back: '16th (1913): federal income tax. 17th (1913): direct election of senators. 18th (1919): Prohibition. 19th (1920): women\'s suffrage. Three remain; only Prohibition was repealed (21st Amendment, 1933).',
  },

  // === WWI / 1920s / Depression ===
  {
    id: 'wwi-1',
    topic: 'World War I',
    front: 'Why did the U.S. enter WWI in 1917?',
    back: 'German unrestricted submarine warfare (sinking U.S. ships like the Lusitania) and the Zimmermann Telegram, in which Germany offered Mexico the U.S. Southwest if it joined the Central Powers.',
  },
  {
    id: 'wwi-2',
    topic: 'World War I',
    front: 'Why didn\'t the U.S. join the League of Nations?',
    back: 'The U.S. Senate rejected the Treaty of Versailles. Senators (led by Henry Cabot Lodge) feared it would tie the U.S. to European wars. The League went on without America.',
  },
  {
    id: '20s-1',
    topic: '1920s',
    front: 'What was the Harlem Renaissance?',
    back: 'A flowering of Black art, literature, and music in Harlem during the 1920s. Langston Hughes, Zora Neale Hurston, Duke Ellington, Louis Armstrong. First major Black cultural movement to win mainstream attention.',
  },
  {
    id: 'dep-1',
    topic: 'Great Depression',
    front: 'What were the three Rs of the New Deal?',
    back: 'Relief (immediate help — CCC, WPA, FERA), Recovery (rebuilding the economy — NRA, AAA, TVA), Reform (preventing another crash — SSA, FDIC, SEC, Glass-Steagall).',
  },
  {
    id: 'dep-2',
    topic: 'Great Depression',
    front: 'Why is Social Security the most lasting New Deal program?',
    back: 'It created retirement pensions and unemployment insurance funded by payroll taxes. It became politically untouchable — every administration since has expanded it. Other New Deal programs were rolled back, but SSA endures.',
  },

  // === WWII / Cold War ===
  {
    id: 'wwii-1',
    topic: 'WWII',
    front: 'What event brought the U.S. into WWII?',
    back: 'Japan attacked Pearl Harbor on December 7, 1941. Congress declared war on Japan the next day. Germany and Italy declared war on the U.S. three days later.',
  },
  {
    id: 'wwii-2',
    topic: 'WWII',
    front: 'What was D-Day?',
    back: 'June 6, 1944 — the Allied invasion of Nazi-occupied France. The largest amphibious assault in history opened the Western Front and started the rollback of the Third Reich.',
  },
  {
    id: 'wwii-3',
    topic: 'WWII',
    front: 'What was the Manhattan Project?',
    back: 'The top-secret U.S. program (1942–45) that built the atomic bomb. Led by physicist Robert Oppenheimer at Los Alamos. Bombs dropped on Hiroshima (Aug 6) and Nagasaki (Aug 9), 1945; Japan surrendered Sept 2.',
  },
  {
    id: 'cw-1',
    topic: 'Cold War',
    front: 'What was the Truman Doctrine?',
    back: '1947 policy committing the U.S. to support nations resisting communism. First major application: aid to Greece and Turkey. Started the active phase of the Cold War.',
  },
  {
    id: 'cw-2',
    topic: 'Cold War',
    front: 'What was the Marshall Plan?',
    back: '$13 billion in U.S. aid (1948–52) to rebuild Western Europe. Combined humanitarian goals with containing communism by stabilizing democracies. Hugely successful — Western Europe boomed.',
  },
  {
    id: 'cw-3',
    topic: 'Cold War',
    front: 'What was the Cuban Missile Crisis?',
    back: 'October 1962. Soviet nuclear missiles in Cuba prompted JFK to impose a naval blockade. After 13 tense days, the USSR removed the missiles in exchange for U.S. removal of missiles from Turkey. Closest the Cold War came to nuclear war.',
  },

  // === Civil Rights ===
  {
    id: 'cr-1',
    topic: 'Civil Rights',
    front: 'What did Brown v. Board of Education (1954) decide?',
    back: 'Segregated public schools were inherently unequal and unconstitutional under the 14th Amendment. Overturned Plessy v. Ferguson. Chief Justice Earl Warren wrote a unanimous opinion.',
  },
  {
    id: 'cr-2',
    topic: 'Civil Rights',
    front: 'What did the Civil Rights Act of 1964 do?',
    back: 'Banned discrimination based on race, color, religion, sex, or national origin in employment, public accommodations (hotels, restaurants), and federally-funded programs. Signed by Lyndon Johnson.',
  },
  {
    id: 'cr-3',
    topic: 'Civil Rights',
    front: 'Why was the Voting Rights Act of 1965 necessary if the 15th Amendment already existed?',
    back: 'Southern states used literacy tests, poll taxes, grandfather clauses, and intimidation to disenfranchise Black voters for nearly a century. The 1965 Act banned literacy tests and authorized federal election oversight where discrimination was systemic.',
  },
  {
    id: 'cr-4',
    topic: 'Civil Rights',
    front: 'What was the strategy of the Montgomery Bus Boycott?',
    back: 'After Rosa Parks\' arrest in Dec 1955, Black residents (about 75% of bus riders) refused to ride for 381 days. Economic pressure forced desegregation. Launched Martin Luther King Jr. to national prominence.',
  },

  // === Modern Era ===
  {
    id: 'mod-1',
    topic: 'Modern Era',
    front: 'Why did Nixon resign?',
    back: 'The Watergate scandal — Nixon\'s campaign burglarized DNC headquarters, then he obstructed the investigation. Facing certain impeachment and conviction, he resigned August 9, 1974. First president to resign.',
  },
  {
    id: 'mod-2',
    topic: 'Modern Era',
    front: 'What ended the Cold War?',
    back: 'The Soviet Union collapsed in 1991 under economic strain, internal reform (Gorbachev\'s glasnost and perestroika), and the inability to keep pace with U.S. military spending. The Berlin Wall fell in 1989; the USSR formally dissolved Dec 26, 1991.',
  },
];
