import type { ExamImageKey } from './signs/catalog';

export type PermitDomain = 'road-signs' | 'traffic-laws' | 'safe-driving';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PermitQuestion {
  id: string;
  domain: PermitDomain;
  subdomain: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswers: number[];
  explanation: string;
  tip?: string;
  /** Optional visual reference (sign, signal, or lane marking) rendered above the question. */
  image?: ExamImageKey;
  /** Optional screen-reader override for the image. Defaults to a visual description from the catalog so the answer isn't spoiled. */
  imageAlt?: string;
}

type Seed = {
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tip?: string;
  image?: ExamImageKey;
  imageAlt?: string;
};

const buildQuestion = (
  idNumber: number,
  domain: PermitDomain,
  subdomain: string,
  seed: Seed,
): PermitQuestion => ({
  id: `sc-${String(idNumber).padStart(3, '0')}`,
  domain,
  subdomain,
  difficulty: seed.difficulty,
  question: seed.question,
  options: seed.options,
  correctAnswers: [seed.correctAnswer],
  explanation: seed.explanation,
  tip: seed.tip,
  image: seed.image,
  imageAlt: seed.imageAlt,
});

const appendSeeds = (
  list: PermitQuestion[],
  domain: PermitDomain,
  subdomain: string,
  seeds: Seed[],
) => {
  seeds.forEach(seed => list.push(buildQuestion(list.length + 1, domain, subdomain, seed)));
};

export const questions: PermitQuestion[] = (() => {
  const list: PermitQuestion[] = [];

  appendSeeds(list, 'road-signs', 'Stop and Yield Signs', [
    {
      difficulty: 'easy',
      question: 'What should you do when you see a red octagon-shaped (8-sided) sign?',
      options: ['Speed up to clear the area', 'Come to a complete stop', 'Only slow down a little', 'Honk and keep going'],
      correctAnswer: 1,
      explanation: 'A red octagon is always a stop sign. You must stop fully before moving.',
      tip: 'Think of the stop sign as the road\'s big red pause button.',
      image: 'sign:stop',
    },
    {
      difficulty: 'easy',
      question: 'At a stop sign, where should you stop?',
      options: ['Past the crosswalk', 'At the stop line, crosswalk, or before entering traffic', 'Only if another car is coming', 'In the middle of the intersection'],
      correctAnswer: 1,
      explanation: 'Stop at the marked line. If there is no line, stop before you roll into the intersection.',
      tip: 'Your front bumper should not sneak into the crossing area.',
      image: 'sign:stop',
    },
    {
      difficulty: 'medium',
      question: 'You come to a stop sign and the road looks empty. What do you do?',
      options: ['Roll through carefully', 'Stop fully, look, then go when safe', 'Speed up so nobody hits you', 'Flash your lights and keep going'],
      correctAnswer: 1,
      explanation: 'A stop sign always means a full stop first. After that, go only when the way is clear.',
      tip: 'No cars around does not cancel the stop sign.',
      image: 'sign:stop',
    },
    {
      difficulty: 'medium',
      question: 'At a 4-way stop, who goes first?',
      options: ['The biggest vehicle', 'The driver who gets there first', 'The driver on the left', 'The fastest driver'],
      correctAnswer: 1,
      explanation: 'At a 4-way stop, first to stop is first to go. If two arrive together, the driver on the right goes first.',
      tip: '4-way stop = first come, first served.',
    },
    {
      difficulty: 'hard',
      question: 'Two cars stop at a 4-way stop at the same time. Who should go first?',
      options: ['The driver on the right', 'The driver on the left', 'Both should go together', 'Whoever waves first'],
      correctAnswer: 0,
      explanation: 'When drivers arrive at the same time, the driver on the left yields to the driver on the right.',
      tip: 'Remember: right beats left at the tie.',
    },
    {
      difficulty: 'easy',
      question: 'What does a red and white upside-down triangle sign mean?',
      options: ['Stop', 'Railroad crossing', 'Yield', 'No passing'],
      correctAnswer: 2,
      explanation: 'That sign means yield. Slow down, look carefully, and let other traffic go first when needed.',
      tip: 'Yield means “my turn only if it\'s clear.”',
      image: 'sign:yield',
    },
    {
      difficulty: 'medium',
      question: 'What does a yield sign tell you to do?',
      options: ['Stop every time no matter what', 'Slow down and give the right of way if needed', 'Turn around', 'Speed up to merge first'],
      correctAnswer: 1,
      explanation: 'A yield sign means be ready to let other vehicles or pedestrians go first. Stop only if traffic makes it necessary.',
      tip: 'Yield is like joining a conversation politely instead of interrupting.',
      image: 'sign:yield',
    },
    {
      difficulty: 'medium',
      question: 'You see a yield sign before joining a larger road. What should you watch for?',
      options: ['Only the car behind you', 'Cross traffic and pedestrians', 'Just the speedometer', 'Only the center line'],
      correctAnswer: 1,
      explanation: 'When you yield, check for vehicles and people already using the road. They get the right of way.',
      tip: 'Before joining the flow, make sure you are not cutting someone off.',
      image: 'sign:yield',
    },
    {
      difficulty: 'hard',
      question: 'If no cars are coming at a yield sign, what should you still do?',
      options: ['Ignore the sign', 'Slow down and be ready to stop', 'Come to a full stop in every case', 'Drive on the shoulder'],
      correctAnswer: 1,
      explanation: 'A yield sign does not always require a full stop, but it does require you to slow down and look carefully.',
      tip: 'Yield means “check first,” not “guess and go.”',
      image: 'sign:yield',
    },
    {
      difficulty: 'easy',
      question: 'Which sign is shaped like an upside-down triangle?',
      options: ['Speed limit', 'Yield', 'Stop', 'No passing'],
      correctAnswer: 1,
      explanation: 'The yield sign is the upside-down triangle. Its shape helps you recognize it fast.',
      tip: 'Triangle down = slow down and share.',
    },
  ]);

  appendSeeds(list, 'road-signs', 'Warning Signs', [
    {
      difficulty: 'easy',
      question: 'What do most yellow diamond-shaped signs mean?',
      options: ['Laws you must obey', 'Warnings about road conditions ahead', 'Gas station ahead', 'Parking rules only'],
      correctAnswer: 1,
      explanation: 'Yellow warning signs alert you to a hazard or change ahead. They tell you to be ready.',
      tip: 'Yellow signs are like a heads-up from the road.',
      image: 'sign:warning-blank',
    },
    {
      difficulty: 'easy',
      question: 'What does a curve ahead sign warn you about?',
      options: ['A stop sign ahead', 'A bend in the road', 'A school bus stop', 'A one-way street'],
      correctAnswer: 1,
      explanation: 'A curve ahead sign warns that the road bends. You may need to slow down before the curve.',
      tip: 'Brake before the bend, not in the middle of it.',
      image: 'sign:curve-ahead',
    },
    {
      difficulty: 'medium',
      question: 'When you see a curve ahead sign, what is the best first move?',
      options: ['Speed up to get through faster', 'Slow down before you reach the curve', 'Move into the oncoming lane', 'Turn on your hazards'],
      correctAnswer: 1,
      explanation: 'Curves can surprise you if you enter too fast. Slow down before the turn starts.',
      tip: 'Set your speed early, like getting ready before a roller coaster drop.',
      image: 'sign:curve-ahead',
    },
    {
      difficulty: 'easy',
      question: 'A merge sign means:',
      options: ['The road ends immediately', 'Traffic from another lane is joining your lane', 'You must stop', 'No one can change lanes'],
      correctAnswer: 1,
      explanation: 'A merge sign means another lane is joining yours. Be ready to adjust speed and space.',
      tip: 'Think of two zippers coming together into one.',
      image: 'sign:merge',
    },
    {
      difficulty: 'medium',
      question: 'What should you do when you see a merge sign?',
      options: ['Block the other lane', 'Watch traffic and make room if you can', 'Drive on the shoulder', 'Ignore it'],
      correctAnswer: 1,
      explanation: 'A merge sign means traffic patterns are changing. Stay alert and leave room for safe merging.',
      tip: 'A little space now prevents a big problem later.',
      image: 'sign:merge',
    },
    {
      difficulty: 'easy',
      question: 'What does a deer crossing sign mean?',
      options: ['You may see animals near the road', 'A zoo is nearby', 'You may hunt from your car', 'Only trucks use the road'],
      correctAnswer: 0,
      explanation: 'A deer crossing sign warns that deer may enter the road suddenly. Slow down and stay alert.',
      tip: 'Deer do not check traffic before crossing.',
      image: 'sign:deer-crossing',
    },
    {
      difficulty: 'medium',
      question: 'If you see a deer crossing sign at night, what should you do?',
      options: ['Keep normal speed and hope for the best', 'Scan the road edges and be ready to brake', 'Flash your lights nonstop', 'Drive in the middle of both lanes'],
      correctAnswer: 1,
      explanation: 'Animals often appear fast and without warning. Look ahead and along the shoulders for movement.',
      tip: 'Your eyes should sweep side to side like a flashlight beam.',
      image: 'sign:deer-crossing',
    },
    {
      difficulty: 'easy',
      question: 'What does a slippery when wet sign warn you about?',
      options: ['The road may be slick in rain', 'A car wash ahead', 'Flooded bridges only', 'Snow chains required'],
      correctAnswer: 0,
      explanation: 'This sign warns that the road may lose traction when wet. Slow down and avoid sudden moves.',
      tip: 'Treat wet pavement like a gym floor in socks.',
      image: 'sign:slippery-when-wet',
    },
    {
      difficulty: 'medium',
      question: 'You see a slippery when wet sign and it starts raining. What should you do?',
      options: ['Brake hard on every turn', 'Reduce speed and steer smoothly', 'Turn off your headlights', 'Drive closer to the car ahead'],
      correctAnswer: 1,
      explanation: 'Wet roads can make tires lose grip. Smooth steering and slower speed help you stay in control.',
      tip: 'Smooth is safe when the road gets slick.',
      image: 'sign:slippery-when-wet',
    },
    {
      difficulty: 'easy',
      question: 'A railroad crossing warning sign means:',
      options: ['A train station is nearby for parking', 'Tracks are ahead and you should watch for trains', 'You may pass any vehicle', 'The road becomes one way'],
      correctAnswer: 1,
      explanation: 'The sign warns that railroad tracks are ahead. Slow down, look, and listen for a train.',
      tip: 'Trains are much faster and closer than they seem.',
      image: 'sign:railroad-crossing-circular',
    },
    {
      difficulty: 'hard',
      question: 'Why should you never try to beat a train at a crossing?',
      options: ['Trains can stop quickly', 'Trains are smaller than cars', 'Trains take a long distance to stop', 'Crossing gates are optional'],
      correctAnswer: 2,
      explanation: 'A train needs a very long distance to stop. If you guess wrong, you lose.',
      tip: 'You can brake fast. A train cannot.',
      image: 'sign:railroad-crossing-circular',
    },
    {
      difficulty: 'easy',
      question: 'What does a school zone or school crossing warning sign mean?',
      options: ['Road closed to cars', 'Children may be near or crossing the road', 'Only buses may enter', 'You should honk'],
      correctAnswer: 1,
      explanation: 'School area signs warn that children may be near the street. Slow down and stay extra alert.',
      tip: 'Kids can move suddenly, so give yourself extra time.',
      image: 'sign:school-zone',
    },
    {
      difficulty: 'medium',
      question: 'When you see a school crossing warning sign, what should you expect?',
      options: ['Construction workers only', 'Pedestrians and lower speeds', 'A green arrow only', 'A passing zone'],
      correctAnswer: 1,
      explanation: 'School areas often have crossing pedestrians and reduced speeds. Watch for kids, buses, and crossing guards.',
      tip: 'School zones need your full attention, not just your foot on the brake.',
      image: 'sign:school-zone',
    },
    {
      difficulty: 'medium',
      question: 'What does a lane ends warning sign mean?',
      options: ['Your lane continues forever', 'You must be ready to merge', 'You must turn around', 'The speed limit doubles'],
      correctAnswer: 1,
      explanation: 'A lane ends sign means your lane will stop ahead. Plan early so you can merge safely.',
      tip: 'Late lane changes create stress and mistakes.',
      image: 'sign:lane-ends',
    },
    {
      difficulty: 'hard',
      question: 'A traffic signal ahead warning sign tells you to:',
      options: ['Ignore the next light', 'Be ready to slow or stop for a signal ahead', 'Pass the car in front of you', 'Move into a bike lane'],
      correctAnswer: 1,
      explanation: 'This warning sign tells you there is a traffic light ahead. Check traffic and be ready to stop.',
      tip: 'A yellow warning sign before a light means “don\'t get surprised.”',
      image: 'sign:traffic-signal-ahead',
    },
  ]);

  appendSeeds(list, 'road-signs', 'Regulatory Signs', [
    {
      difficulty: 'easy',
      question: 'What do most white rectangular signs mean?',
      options: ['They give directions only', 'They are regulatory signs that show rules', 'They mark scenic views', 'They warn of weather'],
      correctAnswer: 1,
      explanation: 'White rectangular signs usually show traffic laws or rules you must follow.',
      tip: 'White signs are the rulebook signs.',
      image: 'sign:regulatory-blank',
    },
    {
      difficulty: 'easy',
      question: 'What does a speed limit sign tell you?',
      options: ['The slowest legal speed only', 'The maximum legal speed under good conditions', 'How fast race cars go', 'How fast trucks must go'],
      correctAnswer: 1,
      explanation: 'A speed limit sign shows the top legal speed when conditions are good. You may need to drive slower in bad weather or traffic.',
      tip: 'The sign gives a ceiling, not a target you must hit.',
      image: 'sign:speed-limit-35',
    },
    {
      difficulty: 'medium',
      question: 'If the road is wet, should you still drive the posted speed limit?',
      options: ['Always yes', 'Only if conditions make it safe', 'Yes, because signs cannot change', 'Only if other cars are faster'],
      correctAnswer: 1,
      explanation: 'Posted limits are for good conditions. Rain, fog, or traffic may mean you should drive slower.',
      tip: 'Safe speed changes when the road changes.',
      image: 'sign:speed-limit-45',
    },
    {
      difficulty: 'easy',
      question: 'A no passing zone sign or solid yellow line means:',
      options: ['Passing is fine if you are in a hurry', 'You should not pass there', 'Only trucks may pass', 'You may pass on the shoulder'],
      correctAnswer: 1,
      explanation: 'No passing zones are marked where passing would be unsafe. Stay in your lane.',
      tip: 'If the road says no passing, listen the first time.',
      image: 'sign:no-passing-zone',
    },
    {
      difficulty: 'hard',
      question: 'Why are no passing zones usually placed in certain areas?',
      options: ['Because the road is extra wide', 'Because visibility is limited or conditions are risky', 'Because police are parked there', 'Because speed limits are higher'],
      correctAnswer: 1,
      explanation: 'No passing zones are used where hills, curves, or other hazards make passing dangerous.',
      tip: 'If you cannot clearly see, you cannot safely pass.',
      image: 'sign:no-passing-zone',
    },
    {
      difficulty: 'easy',
      question: 'What does a no U-turn sign mean?',
      options: ['Make a U-turn quickly', 'U-turns are not allowed there', 'Only buses may turn', 'Turn left only'],
      correctAnswer: 1,
      explanation: 'A no U-turn sign means exactly that: do not turn around there.',
      tip: 'If the sign says no U-turn, do not try to be the exception.',
      image: 'sign:no-u-turn',
    },
    {
      difficulty: 'medium',
      question: 'If you miss your street and there is a no U-turn sign, what should you do?',
      options: ['Make the U-turn anyway', 'Keep going and turn around where it is legal and safe', 'Back up in the lane', 'Stop in the road'],
      correctAnswer: 1,
      explanation: 'Do not break the rule because you missed your turn. Find a safe, legal place to turn around.',
      tip: 'A longer route is better than a risky shortcut.',
      image: 'sign:no-u-turn',
    },
    {
      difficulty: 'easy',
      question: 'What does a one way sign mean?',
      options: ['Traffic moves in one direction only', 'Only one car may use the road', 'The road ends soon', 'Passing is allowed'],
      correctAnswer: 0,
      explanation: 'A one way sign means all traffic on that road moves in the same direction.',
      tip: 'One way means everyone flows the same way, like water in a pipe.',
      image: 'sign:one-way-right',
    },
    {
      difficulty: 'medium',
      question: 'Before turning onto a street with a one way sign, what should you check?',
      options: ['If your music is loud enough', 'That you are entering in the allowed direction', 'Only your gas gauge', 'Whether the road is painted yellow'],
      correctAnswer: 1,
      explanation: 'One-way streets only allow traffic in one direction. Entering the wrong way is dangerous.',
      tip: 'One wrong turn on a one-way street can create head-on danger fast.',
      image: 'sign:one-way-right',
    },
    {
      difficulty: 'easy',
      question: 'What does a do not enter sign mean?',
      options: ['You may enter if no cars are coming', 'You are about to enter from the wrong side', 'The road is a school zone', 'The road is under water'],
      correctAnswer: 1,
      explanation: 'A do not enter sign means you must not go into that roadway from your direction.',
      tip: 'Do not enter means exactly what it says.',
      image: 'sign:do-not-enter',
    },
    {
      difficulty: 'hard',
      question: 'You see a do not enter sign at the mouth of a road. What should you do?',
      options: ['Turn in carefully', 'Find another legal way', 'Honk and continue', 'Drive in the bike lane instead'],
      correctAnswer: 1,
      explanation: 'That sign protects you from entering traffic the wrong way. Turn around or choose another route.',
      tip: 'If the sign blocks your plan, change the plan—not the rule.',
      image: 'sign:do-not-enter',
    },
    {
      difficulty: 'easy',
      question: 'A wrong way sign warns that:',
      options: ['You are driving against traffic', 'You are near a park', 'Your lane is ending', 'A train is coming'],
      correctAnswer: 0,
      explanation: 'A wrong way sign means you are going opposite the proper traffic direction. You need to get out of there safely.',
      tip: 'Wrong way is an emergency message, not a suggestion.',
      image: 'sign:wrong-way',
    },
    {
      difficulty: 'hard',
      question: 'If you see a wrong way sign in front of you, what is the safest choice?',
      options: ['Keep going slowly', 'Stop and safely turn around or back out if possible', 'Speed up to escape', 'Change nothing'],
      correctAnswer: 1,
      explanation: 'A wrong way sign means you must not continue. Leave the roadway in a safe legal way as soon as you can.',
      tip: 'If the road says wrong way, do not debate it.',
      image: 'sign:wrong-way',
    },
    {
      difficulty: 'easy',
      question: 'What does a keep right sign mean?',
      options: ['Stay to the right of a divider or obstacle', 'Always turn right', 'Pass on the right shoulder', 'Park on the right side only'],
      correctAnswer: 0,
      explanation: 'Keep right signs guide traffic around an island, divider, or obstacle. Follow the arrow.',
      tip: 'The arrow is telling you where the safe side is.',
      image: 'sign:keep-right',
    },
    {
      difficulty: 'medium',
      question: 'If a sign says right lane must turn right, what must you do?',
      options: ['Go straight if traffic is light', 'Turn right from that lane', 'Switch lanes in the intersection', 'Ignore the sign'],
      correctAnswer: 1,
      explanation: 'Turn-only lane signs tell you what movement that lane is for. Use the lane for its marked purpose.',
      tip: 'Lane-use signs are like labels on drawers—use the right one for the right job.',
      image: 'sign:right-lane-must-turn-right',
    },
  ]);

  appendSeeds(list, 'road-signs', 'Traffic Signals', [
    {
      difficulty: 'easy',
      question: 'What does a steady red traffic light mean?',
      options: ['Go if the intersection looks empty', 'Stop before entering the intersection', 'Slow down only', 'Speed up before it changes'],
      correctAnswer: 1,
      explanation: 'A steady red light means stop. Do not enter until the signal allows you to go.',
      tip: 'Red means full stop, just like a stop sign.',
      image: 'signal:red',
    },
    {
      difficulty: 'medium',
      question: 'At a steady red light, when may you turn right?',
      options: ['Any time without stopping', 'After stopping, unless a sign says no, and only when safe', 'Only if cars behind you honk', 'Never in South Carolina'],
      correctAnswer: 1,
      explanation: 'Right turn on red is allowed in many places after a full stop unless a sign prohibits it. You still must yield.',
      tip: 'Right on red works only after a real stop and a careful look.',
      image: 'signal:red',
    },
    {
      difficulty: 'easy',
      question: 'What does a steady yellow light mean?',
      options: ['Speed up quickly', 'The light is about to turn red', 'Go if you feel confident', 'Stop in the middle of the intersection'],
      correctAnswer: 1,
      explanation: 'A yellow light warns that the signal is changing to red. Prepare to stop if you can do so safely.',
      tip: 'Yellow means “decision time,” not “floor it.”',
      image: 'signal:yellow',
    },
    {
      difficulty: 'medium',
      question: 'If a light turns yellow and you can stop safely, what should you do?',
      options: ['Speed up', 'Stop smoothly', 'Swerve around traffic', 'Close your eyes and guess'],
      correctAnswer: 1,
      explanation: 'Yellow means the green phase is ending. If you can stop safely, that is the correct move.',
      tip: 'A calm stop beats a rushed gamble.',
      image: 'signal:yellow',
    },
    {
      difficulty: 'easy',
      question: 'What does a steady green light mean?',
      options: ['Go without looking', 'Go if the intersection is clear', 'Turn only', 'Speed is unlimited'],
      correctAnswer: 1,
      explanation: 'Green means you may go, but only after checking that the intersection is clear.',
      tip: 'Green means permission, not a free pass.',
      image: 'signal:green',
    },
    {
      difficulty: 'hard',
      question: 'You have a green light but traffic is blocking the intersection. What should you do?',
      options: ['Enter anyway', 'Wait until there is room to clear the intersection', 'Use the shoulder', 'Honk until traffic moves'],
      correctAnswer: 1,
      explanation: 'Do not enter an intersection unless you can get through it. Blocking the intersection creates danger for everyone.',
      tip: 'Do not trap yourself in the box.',
      image: 'signal:green',
    },
    {
      difficulty: 'easy',
      question: 'A flashing red light means:',
      options: ['Slow only', 'Treat it like a stop sign', 'Go first every time', 'Traffic behind you must stop'],
      correctAnswer: 1,
      explanation: 'A flashing red light means stop fully, then go when it is safe.',
      tip: 'Flashing red = stop sign with electricity.',
      image: 'signal:flashing-red',
    },
    {
      difficulty: 'easy',
      question: 'A flashing yellow light means:',
      options: ['Stop fully', 'Proceed with caution', 'Make a U-turn', 'Back up'],
      correctAnswer: 1,
      explanation: 'A flashing yellow light means slow down and proceed carefully. You do not need to stop unless traffic requires it.',
      tip: 'Flashing yellow means eyes up and foot ready.',
      image: 'signal:flashing-yellow',
    },
    {
      difficulty: 'medium',
      question: 'What does a green arrow mean?',
      options: ['You may turn in the arrow direction', 'All traffic must stop', 'Pedestrians always have no rights', 'You must speed up'],
      correctAnswer: 0,
      explanation: 'A green arrow means protected movement in the arrow direction. Still watch for people or vehicles that may be in your path.',
      tip: 'The arrow is a special green light just for that direction.',
      image: 'signal:green-arrow-left',
    },
    {
      difficulty: 'hard',
      question: 'If traffic lights are not working at an intersection, how should you treat the intersection?',
      options: ['Like a yield sign', 'Like a 4-way stop', 'Like a green light', 'Like a passing zone'],
      correctAnswer: 1,
      explanation: 'When signals are dark or not working, treat the intersection as a 4-way stop.',
      tip: 'No working light? Go back to stop-sign rules.',
      image: 'signal:dark',
    },
  ]);

  appendSeeds(list, 'road-signs', 'Lane Markings', [
    {
      difficulty: 'easy',
      question: 'What does a dashed yellow line beside your lane usually mean?',
      options: ['No passing allowed', 'Passing is allowed if the way is clear', 'Traffic goes one way only', 'You must stop'],
      correctAnswer: 1,
      explanation: 'A broken yellow line means passing is allowed when safe. You still need clear sight distance.',
      tip: 'Broken yellow = maybe pass, but only if it is truly safe.',
      image: 'lane:dashed-yellow',
    },
    {
      difficulty: 'easy',
      question: 'What does a solid yellow line on your side mean?',
      options: ['Passing is allowed anytime', 'Do not pass on that side', 'The road is one way', 'The lane is closing'],
      correctAnswer: 1,
      explanation: 'A solid yellow line on your side means passing is not allowed there.',
      tip: 'Solid means stay put.',
      image: 'lane:solid-yellow-your-side',
    },
    {
      difficulty: 'medium',
      question: 'What do double solid yellow lines in the center of the road mean?',
      options: ['Both directions may pass', 'No passing in either direction', 'Only trucks may cross', 'The road ends soon'],
      correctAnswer: 1,
      explanation: 'Double solid yellow lines mean traffic in neither direction may pass by crossing them.',
      tip: 'Double solid = double no.',
      image: 'lane:double-yellow',
    },
    {
      difficulty: 'medium',
      question: 'If the center has one solid yellow line and one dashed yellow line, who may pass?',
      options: ['Drivers next to the dashed line when safe', 'Drivers next to the solid line only', 'Everyone', 'No one'],
      correctAnswer: 0,
      explanation: 'Passing is allowed only for drivers on the side with the broken line, and only when clear.',
      tip: 'Dashed side decides the passing side.',
      image: 'lane:solid-left-dashed-right',
    },
    {
      difficulty: 'easy',
      question: 'What do white lane lines separate?',
      options: ['Traffic moving in opposite directions', 'Traffic moving in the same direction', 'Railroad tracks', 'Parking lots only'],
      correctAnswer: 1,
      explanation: 'White lines separate lanes going the same way. Yellow lines separate opposite directions.',
      tip: 'White = same direction team.',
      image: 'lane:dashed-white',
    },
    {
      difficulty: 'easy',
      question: 'A broken white line means:',
      options: ['Lane changes are allowed when safe', 'No lane changes ever', 'Opposite traffic ahead', 'Stop ahead'],
      correctAnswer: 0,
      explanation: 'A broken white line means you may change lanes if it is safe.',
      tip: 'Broken white = lane change possible, not automatic.',
      image: 'lane:dashed-white',
    },
    {
      difficulty: 'medium',
      question: 'A solid white line usually means:',
      options: ['Passing oncoming traffic is okay', 'Lane changes are discouraged or not allowed in that area', 'The lane is for parking', 'The road is one way only'],
      correctAnswer: 1,
      explanation: 'A solid white line often means stay in your lane, especially near intersections or ramps.',
      tip: 'Solid white means hold your lane unless signs say otherwise.',
      image: 'lane:solid-white',
    },
    {
      difficulty: 'easy',
      question: 'What is the purpose of a stop line painted across your lane?',
      options: ['It shows where to stop at a sign or light', 'It marks a passing zone', 'It marks a bike lane', 'It shows where to park'],
      correctAnswer: 0,
      explanation: 'A stop line shows where your vehicle should stop. It keeps the crosswalk and intersection clear.',
      tip: 'Think “front tires stop here.”',
      image: 'lane:stop-line',
    },
    {
      difficulty: 'easy',
      question: 'What do crosswalk lines mean for drivers?',
      options: ['A place where passing is allowed', 'A place where pedestrians may cross', 'A place to park briefly', 'A loading zone'],
      correctAnswer: 1,
      explanation: 'Crosswalk lines mark where pedestrians may cross. Drivers should watch carefully and yield when required.',
      tip: 'Crosswalks belong to walkers first.',
      image: 'lane:crosswalk',
    },
    {
      difficulty: 'hard',
      question: 'What is a shared center turn lane used for?',
      options: ['Regular driving', 'Left turns from either direction', 'Passing slower traffic', 'Parking while texting'],
      correctAnswer: 1,
      explanation: 'The center lane is for left turns by traffic from either direction, not for regular travel or passing.',
      tip: 'Center turn lane = turning lane, not a shortcut lane.',
      image: 'lane:center-turn-lane',
    },
  ]);

  appendSeeds(list, 'traffic-laws', 'Right of Way', [
    {
      difficulty: 'easy',
      question: 'If two cars reach an uncontrolled intersection at the same time, who usually has the right of way?',
      options: ['The driver on the left', 'The driver on the right', 'The driver with brighter headlights', 'The driver going faster'],
      correctAnswer: 1,
      explanation: 'At the same time, the driver on the left yields to the driver on the right.',
      tip: 'At a tie, look right.',
    },
    {
      difficulty: 'medium',
      question: 'When turning left at an intersection, who must you yield to?',
      options: ['Only cars behind you', 'Oncoming traffic and pedestrians', 'Only trucks', 'Nobody if your signal is on'],
      correctAnswer: 1,
      explanation: 'A left turn crosses the path of other traffic, so you must wait until the way is clear.',
      tip: 'Left turns ask you to cross traffic, so patience matters.',
    },
    {
      difficulty: 'easy',
      question: 'If a pedestrian is in a crosswalk, what must you do?',
      options: ['Keep driving if you can fit', 'Yield and let the person cross', 'Honk so they hurry', 'Drive around them'],
      correctAnswer: 1,
      explanation: 'Pedestrians in a crosswalk have the right of way. Stop and let them cross safely.',
      tip: 'People always beat paint on the road.',
    },
    {
      difficulty: 'medium',
      question: 'What should you do when an emergency vehicle with lights and siren is approaching?',
      options: ['Keep pace with it', 'Pull over and stop so it can pass', 'Race to the next light', 'Block the lane'],
      correctAnswer: 1,
      explanation: 'Emergency vehicles need a clear path. Move right and stop until it passes safely.',
      tip: 'Make space fast, but do it calmly.',
    },
    {
      difficulty: 'medium',
      question: 'If you are backing out of a parking space, who has the right of way?',
      options: ['You do', 'Traffic already moving in the lane', 'Whichever driver honks first', 'Nobody'],
      correctAnswer: 1,
      explanation: 'Drivers already traveling in the lane have the right of way. Back out only when clear.',
      tip: 'When backing, you are the one joining traffic.',
    },
    {
      difficulty: 'medium',
      question: 'When entering a road from a driveway, who must yield?',
      options: ['Traffic on the road', 'The driver leaving the driveway', 'The larger vehicle', 'Whoever is late'],
      correctAnswer: 1,
      explanation: 'Drivers entering from a driveway or alley must yield to traffic already on the road.',
      tip: 'If you are entering, you are the guest.',
    },
    {
      difficulty: 'easy',
      question: 'At a 4-way stop, if you arrived first and stopped first, what should happen?',
      options: ['You should go first when safe', 'You must wait for everyone else', 'The car on your left goes first', 'The biggest vehicle goes first'],
      correctAnswer: 0,
      explanation: 'First to stop is first to go at a 4-way stop, as long as the move is safe.',
      tip: 'Order matters at 4-way stops.',
    },
    {
      difficulty: 'medium',
      question: 'If a driver is already in the intersection, what should you do?',
      options: ['Try to beat them through', 'Let that driver clear the intersection first', 'Go if your car is smaller', 'Use your horn as right of way'],
      correctAnswer: 1,
      explanation: 'A vehicle already in the intersection should be allowed to clear it. Enter only when your path is open.',
      tip: 'Do not pile into a busy box.',
    },
    {
      difficulty: 'easy',
      question: 'At a T-intersection without signs, who usually has the right of way?',
      options: ['Traffic on the terminating road', 'Traffic on the through road', 'The car turning left', 'Whichever driver flashes lights'],
      correctAnswer: 1,
      explanation: 'Drivers on the road that continues through have the right of way. The driver on the ending road must yield.',
      tip: 'If your road ends, your turn waits.',
    },
    {
      difficulty: 'hard',
      question: 'If two cars arrive at a 4-way stop together and one is turning left, what is still true?',
      options: ['The left-turning car always goes first', 'The driver on the left still yields to the driver on the right', 'Both should turn at once', 'The smaller car must yield'],
      correctAnswer: 1,
      explanation: 'The basic tie rule still applies: the driver on the left yields to the driver on the right.',
      tip: 'Do not let the turn confuse the right-side rule.',
    },
    {
      difficulty: 'medium',
      question: 'When a blind pedestrian is using a white cane or guide dog, what should drivers do?',
      options: ['Proceed if the light is green', 'Stop and give the person the right of way', 'Honk to warn them', 'Go around quickly'],
      correctAnswer: 1,
      explanation: 'Drivers must stop and yield to blind pedestrians using a white cane or guide dog.',
      tip: 'A white cane means give extra care and extra time.',
    },
    {
      difficulty: 'hard',
      question: 'You are turning right on red and a pedestrian steps into the crosswalk. What now?',
      options: ['Turn quickly before they reach you', 'Yield to the pedestrian', 'Honk and keep turning', 'Use the next lane instead'],
      correctAnswer: 1,
      explanation: 'Even when a right turn on red is allowed, you must still yield to pedestrians in the crosswalk.',
      tip: 'Your legal turn never outranks a person in the crosswalk.',
    },
    {
      difficulty: 'medium',
      question: 'When entering a roundabout, who do you yield to?',
      options: ['Cars already in the roundabout', 'Only trucks', 'Nobody', 'Cars behind you'],
      correctAnswer: 0,
      explanation: 'Traffic already moving inside the roundabout has the right of way. Enter when there is a safe gap.',
      tip: 'Roundabouts work like a moving circle—join only when there is room.',
    },
    {
      difficulty: 'hard',
      question: 'If you are on a private road entering a public street, what must you do?',
      options: ['Take the right of way', 'Yield to all public-road traffic and pedestrians', 'Only watch for cars from the left', 'Use the center lane to merge'],
      correctAnswer: 1,
      explanation: 'Drivers entering from private roads must yield before joining public traffic.',
      tip: 'The road you are joining gets priority.',
    },
    {
      difficulty: 'easy',
      question: 'Who has the right of way: a car or a person crossing legally in a crosswalk?',
      options: ['The car', 'The pedestrian', 'Whoever is faster', 'Whoever arrives first'],
      correctAnswer: 1,
      explanation: 'Pedestrians crossing legally in a crosswalk have the right of way.',
      tip: 'Crosswalk = people first.',
    },
    {
      difficulty: 'medium',
      question: 'If another driver does not give you the right of way, what is the safest choice?',
      options: ['Insist on your turn', 'Yield and avoid a crash', 'Race them', 'Block the road'],
      correctAnswer: 1,
      explanation: 'Even if you should have the right of way, your safest move is to avoid a collision.',
      tip: 'Being right is not worth being hit.',
    },
  ]);

  const speedFacts = [
    {
      place: 'an urban district or city street',
      speed: '30 mph',
      explanation: 'In South Carolina, the usual speed limit in an urban district is 30 mph unless posted otherwise.',
      tip: 'City streets need lower speeds because there are more cars, driveways, and people.',
      secondDifficulty: 'easy' as Difficulty,
    },
    {
      place: 'a rural unpaved road',
      speed: '40 mph',
      explanation: 'The usual speed limit on a rural unpaved road is 40 mph unless a sign says otherwise.',
      tip: 'Loose gravel and dust mean unpaved roads need extra caution.',
      secondDifficulty: 'easy' as Difficulty,
    },
    {
      place: 'a state highway',
      speed: '55 mph',
      explanation: 'The usual speed limit on a state highway is 55 mph unless posted differently.',
      tip: 'Highways move faster, but signs can still change the limit.',
      secondDifficulty: 'easy' as Difficulty,
    },
    {
      place: 'an interstate highway',
      speed: '70 mph',
      explanation: 'The usual speed limit on a South Carolina interstate is 70 mph unless signs say otherwise.',
      tip: 'Interstates are built for higher speeds, but weather can still make you slow down.',
      secondDifficulty: 'easy' as Difficulty,
    },
    {
      place: 'a posted school zone',
      speed: 'the posted school-zone speed',
      explanation: 'In a school zone, obey the lower posted speed. The school-zone sign controls there.',
      tip: 'School zones are about protecting kids, not keeping traffic moving fast.',
      secondDifficulty: 'hard' as Difficulty,
    },
    {
      place: 'a work zone with temporary speed signs',
      speed: 'the temporary posted limit',
      explanation: 'Temporary work-zone speed signs are the limit you must follow while the work zone is active.',
      tip: 'Orange-zone speed signs count just like regular ones.',
      secondDifficulty: 'hard' as Difficulty,
    },
  ];

  speedFacts.forEach((fact, index) => {
    appendSeeds(list, 'traffic-laws', 'Speed Limits', [
      {
        difficulty: index < 4 ? 'easy' : 'medium',
        question: `What is the usual speed limit on ${fact.place} unless signs say otherwise?`,
        options: ['25 mph', fact.speed, '60 mph', '75 mph'],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.secondDifficulty,
        question: `You do not see a speed sign on ${fact.place}. What speed should you expect to use?`,
        options: [fact.speed, '5 mph over what feels right', 'Whatever speed other drivers choose', 'Only 20 mph everywhere'],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'When signs are missing, know the default rule.',
      },
    ]);
  });

  const parkingFacts = [
    {
      question: 'How close may you park to a fire hydrant?',
      correct: 'At least 15 feet away',
      wrong: ['At least 5 feet away', 'At least 30 feet away', 'You may park beside it briefly'],
      explanation: 'Stay at least 15 feet from a fire hydrant so emergency crews can reach it quickly.',
      tip: 'Hydrants need breathing room for firefighters.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'easy' as Difficulty,
    },
    {
      question: 'How close may you park to a crosswalk?',
      correct: 'At least 20 feet away',
      wrong: ['At least 5 feet away', 'At least 10 feet away', 'At least 50 feet away'],
      explanation: 'Stay at least 20 feet from a crosswalk so drivers and walkers can see each other.',
      tip: 'Crosswalk corners need a clear view.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'easy' as Difficulty,
    },
    {
      question: 'How close may you park to a stop sign or traffic signal?',
      correct: 'At least 30 feet away',
      wrong: ['At least 10 feet away', 'At least 15 feet away', 'As close as you want if the street is quiet'],
      explanation: 'Stay at least 30 feet from stop signs and signals so drivers can see them clearly.',
      tip: 'Signs do their job only if parked cars do not hide them.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      question: 'How should you park on a normal street?',
      correct: 'With your car facing the same direction as traffic',
      wrong: ['Facing oncoming traffic', 'Half on the sidewalk', 'At an angle across two spaces'],
      explanation: 'Park facing the direction traffic moves on that side of the road.',
      tip: 'Your parked car should line up with the street, not fight it.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      question: 'Can you double park beside another parked vehicle?',
      correct: 'No, double parking is illegal and unsafe',
      wrong: ['Yes, for one minute', 'Yes, if flashers are on', 'Yes, if a friend stays in the car'],
      explanation: 'Double parking blocks traffic and creates danger. Do not do it.',
      tip: 'If your car blocks a travel lane, it is not really parked safely.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'easy' as Difficulty,
    },
  ];

  parkingFacts.forEach(fact => {
    appendSeeds(list, 'traffic-laws', 'Parking', [
      {
        difficulty: fact.difficulty1,
        question: fact.question,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: 'Which parking choice follows the rule best?',
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'The legal space is the one that keeps traffic, signs, and walkers clear.',
      },
    ]);
  });

  appendSeeds(list, 'traffic-laws', 'School Bus', [
    {
      difficulty: 'easy',
      question: 'What must you do when a stopped school bus has flashing red lights?',
      options: ['Keep driving if you are late', 'Stop until the lights stop flashing', 'Pass slowly', 'Honk and go around'],
      correctAnswer: 1,
      explanation: 'When a school bus is stopped with red lights flashing, you must stop. Children may be entering or leaving the bus.',
      tip: 'Red bus lights mean kids could appear from anywhere.',
    },
    {
      difficulty: 'easy',
      question: 'On a two-lane road, if a school bus stops with red lights flashing, who must stop?',
      options: ['Only traffic behind the bus', 'Traffic in both directions', 'Only traffic facing the bus', 'Nobody unless children are visible'],
      correctAnswer: 1,
      explanation: 'On an undivided road, vehicles in both directions must stop for a school bus with red lights flashing.',
      tip: 'No divider means everybody stops.',
    },
    {
      difficulty: 'medium',
      question: 'What do the yellow flashing lights on a school bus mean?',
      options: ['Speed up before it stops', 'Slow down and prepare to stop', 'You may pass now', 'The route is ending'],
      correctAnswer: 1,
      explanation: 'Yellow flashing bus lights are an early warning that the bus is about to stop.',
      tip: 'Yellow means get ready, not get around.',
    },
    {
      difficulty: 'medium',
      question: 'When may you move again after stopping for a school bus?',
      options: ['As soon as one child is off the bus', 'When the red lights stop flashing and the road is clear', 'When another driver goes first', 'Only after honking twice'],
      correctAnswer: 1,
      explanation: 'Do not move until the bus lights stop flashing and it is safe. Children may still be nearby.',
      tip: 'Wait for the signal to end, then check carefully.',
    },
    {
      difficulty: 'hard',
      question: 'What is the main exception to stopping for a school bus with red lights flashing?',
      options: ['You are in a pickup truck', 'You are on the opposite side of a divided highway with a median or barrier', 'You are running late', 'You are turning right'],
      correctAnswer: 1,
      explanation: 'On a divided highway with a median or barrier, traffic on the opposite side does not have to stop for the bus.',
      tip: 'A real divider changes the rule; paint alone does not.',
    },
    {
      difficulty: 'hard',
      question: 'Does a center turn lane or painted area count as a divided highway that lets you pass a school bus?',
      options: ['Yes', 'No', 'Only at noon', 'Only for cars'],
      correctAnswer: 1,
      explanation: 'A painted center area is not the same as a physical median or barrier. If there is no true divider, stop.',
      tip: 'Paint is not a wall.',
    },
    {
      difficulty: 'medium',
      question: 'If you are behind a school bus and its red lights start flashing, what should you do?',
      options: ['Pass quickly on the left', 'Stop and wait', 'Drive onto the shoulder', 'Get very close to the bumper'],
      correctAnswer: 1,
      explanation: 'Red bus lights mean stop. Passing or squeezing by puts children at risk.',
      tip: 'The safest place is stopped and patient.',
    },
    {
      difficulty: 'easy',
      question: 'Why is it so important to stop for a school bus?',
      options: ['To protect children getting on or off', 'To save fuel', 'To help the bus driver park', 'To keep traffic moving faster'],
      correctAnswer: 0,
      explanation: 'Children can cross unexpectedly around a bus. Stopping protects them.',
      tip: 'Kids are the reason for the rule.',
    },
    {
      difficulty: 'medium',
      question: 'A school bus is stopped on the other side of a four-lane road with no median barrier. What do you do?',
      options: ['Keep driving', 'Stop', 'Only slow down', 'Pass on the shoulder'],
      correctAnswer: 1,
      explanation: 'If the road is not divided by a physical median or barrier, traffic in both directions must stop.',
      tip: 'Four lanes do not matter as much as the divider does.',
    },
    {
      difficulty: 'easy',
      question: 'If a school bus has stopped and children are nearby, what kind of driving attitude should you have?',
      options: ['Impatient', 'Extra cautious', 'Competitive', 'Aggressive'],
      correctAnswer: 1,
      explanation: 'Children can be unpredictable. Slow, patient, careful driving is the safest choice.',
      tip: 'Near school buses, expect the unexpected.',
    },
  ]);

  appendSeeds(list, 'traffic-laws', 'Turning', [
    {
      difficulty: 'easy',
      question: 'Can you turn right at a red light in South Carolina?',
      options: ['Yes, after stopping, unless a sign says no, and only when safe', 'Yes, without stopping', 'No, never', 'Only between midnight and sunrise'],
      correctAnswer: 0,
      explanation: 'A right turn on red is often allowed after a full stop unless a sign prohibits it. You still must yield.',
      tip: 'Right on red starts with stop, not roll.',
      image: 'signal:red',
    },
    {
      difficulty: 'medium',
      question: 'When turning left on a green light without an arrow, what must you do?',
      options: ['Go first because green means go', 'Yield to oncoming traffic and pedestrians', 'Turn from any lane', 'Ignore crosswalks'],
      correctAnswer: 1,
      explanation: 'A plain green light does not give a protected left turn. Wait for a safe gap.',
      tip: 'Green circle is not the same as green arrow.',
      image: 'signal:green',
    },
    {
      difficulty: 'medium',
      question: 'Before turning, when should you signal?',
      options: ['At the last second', 'Far enough ahead to warn others, about 100 feet before the turn', 'Only after starting the turn', 'Only if another car is behind you'],
      correctAnswer: 1,
      explanation: 'Signal early so other drivers and pedestrians know what you plan to do.',
      tip: 'Your signal is your road text message—send it early.',
    },
    {
      difficulty: 'easy',
      question: 'From what lane should you usually make a right turn?',
      options: ['The left lane', 'The lane closest to the right curb', 'Any lane you want', 'The center turn lane'],
      correctAnswer: 1,
      explanation: 'Right turns should usually be made from the lane nearest the right curb unless signs say otherwise.',
      tip: 'Right turn, right-side lane.',
    },
    {
      difficulty: 'easy',
      question: 'From what lane should you usually start a left turn?',
      options: ['The right lane', 'The lane closest to the center line or left-turn lane', 'The shoulder', 'Any lane at the last second'],
      correctAnswer: 1,
      explanation: 'Start a left turn from the proper left-positioned lane so the turn is predictable and safe.',
      tip: 'Left turn starts from the left side, not a surprise lane change.',
    },
    {
      difficulty: 'medium',
      question: 'What is a safe rule for making a U-turn?',
      options: ['Make one anywhere there is enough road', 'Only where it is legal, safe, and not prohibited by a sign', 'Always use the shoulder', 'Never check traffic'],
      correctAnswer: 1,
      explanation: 'U-turns are allowed only where they are legal and safe. Signs, traffic, and visibility matter.',
      tip: 'A U-turn needs space, time, and a clear legal green light.',
    },
    {
      difficulty: 'hard',
      question: 'If there is a no U-turn sign, what should you do even if the road looks empty?',
      options: ['Make the U-turn quickly', 'Keep going and turn around somewhere legal', 'Back up instead', 'Use the opposite shoulder'],
      correctAnswer: 1,
      explanation: 'A no U-turn sign means do not make the turn there, even if traffic seems light.',
      tip: 'Empty road does not cancel a posted rule.',
      image: 'sign:no-u-turn',
    },
    {
      difficulty: 'medium',
      question: 'Before turning right or left, what should you check for besides cars?',
      options: ['Only your radio', 'Pedestrians and cyclists', 'Only the speed limit sign', 'Just your mirrors'],
      correctAnswer: 1,
      explanation: 'Turns can cross the path of pedestrians and cyclists. Check mirrors, blind spots, and the crosswalk.',
      tip: 'A safe turn checks the whole scene, not just traffic lanes.',
    },
    {
      difficulty: 'hard',
      question: 'A red arrow means:',
      options: ['Turn carefully if nobody is coming', 'Stop and do not go in that arrow direction until allowed', 'Go faster', 'Yield only'],
      correctAnswer: 1,
      explanation: 'A red arrow means the turn or movement shown by the arrow is not allowed until the signal changes.',
      tip: 'Red arrow is stricter than a green wish.',
      image: 'signal:red-arrow-left',
    },
    {
      difficulty: 'easy',
      question: 'Why is it important not to swing wide into another lane during a turn?',
      options: ['It can confuse others and cause a crash', 'It saves fuel', 'It is faster', 'It helps you see better'],
      correctAnswer: 0,
      explanation: 'Wide turns can put you in the wrong lane or into another road user\'s path.',
      tip: 'Stay in your lane through the turn like you are staying between rails.',
    },
  ]);

  const followingFacts = [
    {
      label: 'the normal following-distance rule',
      correct: 'Use at least a 2-second gap',
      wrong: ['Stay one car length behind', 'Stay as close as possible', 'Follow based only on your speedometer'],
      explanation: 'A simple rule is to stay at least 2 seconds behind the vehicle ahead in good conditions.',
      tip: 'Pick a roadside object and count “one-thousand-one, one-thousand-two.”',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'rain, fog, or slick roads',
      correct: 'Increase your following distance',
      wrong: ['Use the same 2-second gap', 'Follow closer for better visibility', 'Turn off your headlights'],
      explanation: 'Bad weather increases stopping distance, so you need more space than normal.',
      tip: 'Bad weather needs bigger bubbles of space.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'following a large truck or bus',
      correct: 'Leave extra space so you can see and stop safely',
      wrong: ['Drive close to reduce wind', 'Stay in its blind spot', 'Pass without looking'],
      explanation: 'Large vehicles block your view and need longer stopping distance. Give them extra room.',
      tip: 'If you cannot see around the truck, you are too close.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'someone tailgating you',
      correct: 'Increase the space ahead of your car',
      wrong: ['Brake-check them', 'Speed up above the limit', 'Ignore the road ahead'],
      explanation: 'A bigger cushion in front gives you more room to slow down smoothly if needed.',
      tip: 'More space ahead can calm the mess behind you.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
  ];

  followingFacts.forEach(fact => {
    appendSeeds(list, 'traffic-laws', 'Following Distance', [
      {
        difficulty: fact.difficulty1,
        question: `What should you do for ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which choice best shows safe following distance for ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Space gives you time, and time saves you.',
      },
    ]);
  });

  const passingFacts = [
    {
      label: 'normal passing on a two-lane road',
      correct: 'Pass on the left when it is legal and safe',
      wrong: ['Pass on the shoulder', 'Pass in any no-passing zone', 'Pass without checking mirrors'],
      explanation: 'Passing is normally done on the left and only when signs, markings, and traffic conditions allow it.',
      tip: 'Passing is a planned move, not a sudden one.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'a solid yellow no-passing line on your side',
      correct: 'Do not pass',
      wrong: ['Pass if you can finish fast', 'Pass if no police are around', 'Pass on curves only'],
      explanation: 'A solid yellow line on your side means passing is not allowed there.',
      tip: 'Solid yellow means stay home in your lane.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'a car ahead waiting to turn left and enough room exists on the right',
      correct: 'Passing on the right may be allowed if it can be done safely',
      wrong: ['Passing on the right is always illegal', 'Use the shoulder to pass no matter what', 'Pass without slowing'],
      explanation: 'Passing on the right is allowed only in limited situations and only when it can be done safely.',
      tip: 'Right-side passes are exceptions, not the rule.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'another driver passing you',
      correct: 'Stay in your lane and do not speed up',
      wrong: ['Speed up so they cannot pass', 'Move left toward them', 'Brake hard for fun'],
      explanation: 'If someone is passing you, keep steady and let them complete the pass safely.',
      tip: 'Do not turn passing into a race.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
  ];

  passingFacts.forEach(fact => {
    appendSeeds(list, 'traffic-laws', 'Passing', [
      {
        difficulty: fact.difficulty1,
        question: `What is the safe rule for ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which answer matches the law for ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Passing should lower risk, not raise it.',
      },
    ]);
  });

  const headlightFacts = [
    {
      label: 'when you cannot see 500 feet ahead clearly',
      correct: 'Turn on your headlights',
      wrong: ['Drive by memory', 'Only use parking lights', 'Speed up to improve airflow'],
      explanation: 'If you cannot see at least 500 feet ahead, headlights should be on.',
      tip: 'If your eyes are working harder, your headlights should too.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'rain, fog, or other low-visibility weather',
      correct: 'Use headlights, and use low beams in fog',
      wrong: ['Turn lights off to reduce glare', 'Use only hazard lights', 'Follow the taillights in front closely'],
      explanation: 'Headlights help you see and help others see you. In fog, low beams work better than high beams.',
      tip: 'Low visibility = lights on, speed down.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'meeting oncoming traffic or following another car closely at night',
      correct: 'Dim your high beams',
      wrong: ['Use brighter lights', 'Turn off all lights', 'Look straight into the other headlights'],
      explanation: 'High beams can blind other drivers. Dim them for oncoming traffic and when following closely.',
      tip: 'Your high beams should help you, not hurt someone else.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
  ];

  headlightFacts.forEach(fact => {
    appendSeeds(list, 'traffic-laws', 'Headlights', [
      {
        difficulty: fact.difficulty1,
        question: `What should you do ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which choice is safest ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Seeing and being seen are a package deal.',
      },
    ]);
  });

  const duiFacts = [
    {
      label: 'the legal BAC limit for most adult drivers',
      correct: '0.08%',
      wrong: ['0.10%', '0.15%', 'There is no limit'],
      explanation: 'A BAC of 0.08% or more is over the legal limit for adult drivers.',
      tip: 'The legal line comes before “I feel fine.”',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'drivers under 21 and alcohol',
      correct: 'South Carolina has zero tolerance—do not drink and drive',
      wrong: ['A little alcohol is always okay', 'Only beer counts', 'Rules start at age 18'],
      explanation: 'Drivers under 21 should not drink and drive at all. South Carolina uses a zero-tolerance approach for underage drinking and driving.',
      tip: 'Under 21 means the safest BAC is 0.00.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'prescription drugs or marijuana before driving',
      correct: 'They can still make driving impaired and dangerous',
      wrong: ['They never affect driving', 'Only alcohol counts as DUI', 'They are safe if you are confident'],
      explanation: 'Impaired driving is not just about alcohol. Drugs, including legal prescriptions, can make driving unsafe.',
      tip: 'If it changes your brain or body, it can change your driving.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'refusing a chemical test after a DUI arrest',
      correct: 'It can lead to license consequences under implied consent laws',
      wrong: ['Nothing happens', 'It guarantees no DUI charge', 'You automatically get a warning only'],
      explanation: 'South Carolina drivers are subject to implied consent rules. Refusing testing can bring license penalties.',
      tip: 'Driving on SC roads comes with testing rules attached.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'a friend who has been drinking and wants to drive',
      correct: 'Do not let them drive; find a safe ride',
      wrong: ['Let them drive slowly', 'Follow them home and hope', 'Give them coffee and keys'],
      explanation: 'The safest choice is to stop an impaired friend from driving and help them get a safe ride.',
      tip: 'A real friend protects the future, not just the moment.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'trying to sober up fast with coffee, a shower, or fresh air',
      correct: 'Those do not make you safe to drive',
      wrong: ['They quickly erase alcohol', 'They lower BAC right away', 'They make DUI impossible'],
      explanation: 'Only time lowers BAC. Coffee or a shower may wake you up, but they do not remove alcohol.',
      tip: 'You cannot hack the clock.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
  ];

  duiFacts.forEach(fact => {
    appendSeeds(list, 'safe-driving', 'DUI Laws', [
      {
        difficulty: fact.difficulty1,
        question: `What is true about ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which answer best matches South Carolina law or safe driving for ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Impaired driving choices can change your life in seconds.',
      },
    ]);
  });

  const distractedFacts = [
    {
      label: 'the Hands-Free South Carolina law',
      correct: 'You may not hold or use a handheld phone while driving',
      wrong: ['Phones are fine if traffic is slow', 'Only texting is banned', 'You may hold the phone at red lights'],
      explanation: 'South Carolina\'s hands-free law means drivers should not hold or use handheld devices while driving.',
      tip: 'If it is in your hand, it should not be while you drive.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'texting or reading messages while driving',
      correct: 'It is dangerous and illegal to do while driving',
      wrong: ['It is fine if you are quick', 'It is only illegal on highways', 'It is safe at 30 mph or less'],
      explanation: 'Looking at a phone takes your eyes and brain off the road. That is dangerous even for a few seconds.',
      tip: 'A 3-second text can send your car the length of a football field.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'setting your GPS or music',
      correct: 'Do it before you start driving or after you pull over safely',
      wrong: ['Do it while moving fast', 'Ask the car beside you', 'Use both hands on the phone'],
      explanation: 'Set devices before you move or after safely pulling over. That keeps your attention on the road.',
      tip: 'Set it, then drive it.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'eating, grooming, or reaching for things while driving',
      correct: 'Those actions can also distract you from safe driving',
      wrong: ['They do not count as distraction', 'They are safer than looking ahead', 'They are fine with cruise control'],
      explanation: 'Distraction is anything that takes your hands, eyes, or mind away from driving.',
      tip: 'If the task is not driving, it can wait.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'a real emergency call to 911',
      correct: 'Emergency exceptions may apply, but stay as safe as possible',
      wrong: ['Use that excuse for any call', 'Never call for help', 'Drive faster while calling'],
      explanation: 'Emergency calls can be different, but safety still matters. If possible, pull over before calling.',
      tip: 'Emergency help is important, but safe driving still matters.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
  ];

  distractedFacts.forEach(fact => {
    appendSeeds(list, 'safe-driving', 'Distracted Driving', [
      {
        difficulty: fact.difficulty1,
        question: `What is the safe rule for ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which answer best follows South Carolina's distracted-driving rules for ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Hands on wheel, eyes up, brain on the road.',
      },
    ]);
  });

  const beltFacts = [
    {
      label: 'seat belts in South Carolina',
      correct: 'All occupants should be buckled up',
      wrong: ['Only front-seat riders matter', 'Belts are optional on short trips', 'Belts are only for highways'],
      explanation: 'Seat belts are required and protect everyone in the vehicle.',
      tip: 'The trip is not too short for a crash.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'airbags and seat belts',
      correct: 'Airbags work best with seat belts, not instead of them',
      wrong: ['Airbags make seat belts unnecessary', 'You should choose one or the other', 'Airbags protect rear passengers only'],
      explanation: 'Seat belts hold you in place so airbags can protect you correctly.',
      tip: 'Seat belts and airbags are a team.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'how a lap belt should fit',
      correct: 'Low and snug across the hips',
      wrong: ['High across the stomach', 'Loose for comfort', 'Under one arm'],
      explanation: 'A lap belt should fit low across the hips, not across the soft stomach area.',
      tip: 'Low on the hips = strong bones doing the work.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'sharing one seat belt between two people',
      correct: 'Never do it',
      wrong: ['It is fine for short trips', 'It works in the back seat only', 'It is okay if the car is slow'],
      explanation: 'One belt is designed for one person. Sharing a belt is unsafe.',
      tip: 'One person, one belt, every time.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'easy' as Difficulty,
    },
  ];

  beltFacts.forEach(fact => {
    appendSeeds(list, 'safe-driving', 'Seat Belts', [
      {
        difficulty: fact.difficulty1,
        question: `What is true about ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which choice is safest for ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Buckle first, drive second.',
      },
    ]);
  });

  const accidentFacts = [
    {
      label: 'being involved in a crash',
      correct: 'Stop right away and stay at the scene',
      wrong: ['Drive away if damage looks small', 'Only stop if someone saw it', 'Keep going to avoid traffic'],
      explanation: 'You must stop after a crash. Leaving the scene can bring serious trouble.',
      tip: 'First rule after a crash: stop.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'someone being hurt in a crash',
      correct: 'Call 911 and get help',
      wrong: ['Move them without thinking', 'Argue about who caused it', 'Leave before police arrive'],
      explanation: 'If anyone is hurt, call 911 and get emergency help right away.',
      tip: 'People first, paperwork second.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'a minor crash where vehicles can move safely',
      correct: 'Move to a safe spot if possible and exchange information',
      wrong: ['Leave the cars blocking traffic forever', 'Refuse to share information', 'Race home first'],
      explanation: 'If the crash is minor and the cars can move, get out of the traffic lane if it is safe and exchange information.',
      tip: 'Safety first, then details.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'information you should exchange after a crash',
      correct: 'Name, contact details, and insurance information',
      wrong: ['Your social media handle only', 'Nothing if you say sorry', 'Only your favorite playlist'],
      explanation: 'After a crash, exchange the key facts: name, contact information, and insurance details.',
      tip: 'Think ID, contact, and insurance.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'proof of insurance while driving',
      correct: 'Keep proof of insurance in the vehicle',
      wrong: ['Memorize it instead', 'Leave it at home', 'Only show it after a second crash'],
      explanation: 'South Carolina drivers should carry proof of insurance in the vehicle.',
      tip: 'Insurance proof belongs in the car, like your spare tire.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
  ];

  accidentFacts.forEach(fact => {
    appendSeeds(list, 'safe-driving', 'Accidents', [
      {
        difficulty: fact.difficulty1,
        question: `What should you do about ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which choice best follows the rules for ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Clear head, safe scene, correct info.',
      },
    ]);
  });

  const weatherFacts = [
    {
      label: 'the first part of a rain shower',
      correct: 'Roads can be extra slick, so slow down',
      wrong: ['Roads get more grip right away', 'You can follow more closely', 'Hydroplaning becomes impossible'],
      explanation: 'The first rain can lift oil and dirt, making the road especially slippery.',
      tip: 'First rain often means first slick spot.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'your car starting to hydroplane',
      correct: 'Ease off the gas and steer smoothly',
      wrong: ['Slam the brakes hard', 'Turn the wheel wildly', 'Speed up to cut through'],
      explanation: 'If you hydroplane, ease off the gas and keep steering calm until the tires regain contact.',
      tip: 'Hydroplaning needs calm hands, not panic.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'driving in fog',
      correct: 'Use low beams and slow down',
      wrong: ['Use high beams only', 'Turn off all lights', 'Drive faster to get out of it'],
      explanation: 'Low beams work better in fog. High beams can bounce light back and make it harder to see.',
      tip: 'Fog likes low beams, not bright beams.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'bridges and overpasses in freezing weather',
      correct: 'They can freeze before other roads',
      wrong: ['They stay warmer than all roads', 'Ice never forms there', 'You can ignore them'],
      explanation: 'Bridges and overpasses cool faster and often freeze first.',
      tip: 'Think “bridge first, freeze first.”',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'driving at night with bright headlights coming toward you',
      correct: 'Look toward the right edge of your lane and avoid staring at the lights',
      wrong: ['Look straight into the lights', 'Close your eyes for a second', 'Turn on your dome light'],
      explanation: 'Looking to the right edge helps you stay in your lane without being blinded by glare.',
      tip: 'Use the right edge line like a guide rail for your eyes.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'skidding on a slippery road',
      correct: 'Do not panic; slow down and steer carefully',
      wrong: ['Overcorrect sharply', 'Hit the gas hard', 'Ignore where the car is pointing'],
      explanation: 'Sharp panic moves can make a skid worse. Smooth control is the key.',
      tip: 'Skids get worse when your hands and feet get wild.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
  ];

  weatherFacts.forEach(fact => {
    appendSeeds(list, 'safe-driving', 'Weather Driving', [
      {
        difficulty: fact.difficulty1,
        question: `What is the safe rule for ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which choice best handles ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Bad weather punishes rushed moves.',
      },
    ]);
  });

  const workZoneFacts = [
    {
      label: 'speed in a work zone',
      correct: 'Slow down and obey the posted work-zone signs',
      wrong: ['Drive normal speed if workers are not visible', 'Speed up to get through', 'Ignore orange signs'],
      explanation: 'Work zones often have lower temporary speeds. Obey the signs and stay alert.',
      tip: 'Orange signs deserve the same respect as any other sign.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'a flagger directing traffic in a work zone',
      correct: 'Follow the flagger\'s instructions',
      wrong: ['Ignore them if you see no workers', 'Only follow the nearest car', 'Drive around the flagger'],
      explanation: 'Flaggers direct traffic to keep everyone safe. Follow their instructions.',
      tip: 'In work zones, the flagger is the human traffic light.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'medium' as Difficulty,
    },
    {
      label: 'space around workers and construction equipment',
      correct: 'Leave extra space and avoid sudden lane changes',
      wrong: ['Drive close for a better view', 'Crowd the cones', 'Pass heavy equipment on the shoulder'],
      explanation: 'Workers and machines need room. Sudden moves in work zones can cause serious crashes.',
      tip: 'Cones are not decorations—they are your warning buffer.',
      difficulty1: 'medium' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
    {
      label: 'a lane closed ahead in a work zone',
      correct: 'Merge safely and early when needed',
      wrong: ['Wait until the last second and force your way in', 'Stop in the open lane', 'Drive through the closed lane'],
      explanation: 'When a lane closes, merge in a controlled safe way and follow signs.',
      tip: 'Smooth merges beat last-second drama.',
      difficulty1: 'easy' as Difficulty,
      difficulty2: 'hard' as Difficulty,
    },
  ];

  workZoneFacts.forEach(fact => {
    appendSeeds(list, 'safe-driving', 'Work Zones', [
      {
        difficulty: fact.difficulty1,
        question: `What should you do about ${fact.label}?`,
        options: [fact.wrong[0], fact.correct, fact.wrong[1], fact.wrong[2]],
        correctAnswer: 1,
        explanation: fact.explanation,
        tip: fact.tip,
      },
      {
        difficulty: fact.difficulty2,
        question: `Which choice is safest in a work zone for ${fact.label}?`,
        options: [fact.correct, fact.wrong[0], fact.wrong[1], fact.wrong[2]],
        correctAnswer: 0,
        explanation: fact.explanation,
        tip: 'Work zones change fast, so calm driving matters even more.',
      },
    ]);
  });

  return list;
})();
