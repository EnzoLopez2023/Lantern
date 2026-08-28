export type ExamImageCategory =
  | 'regulatory'
  | 'warning'
  | 'guide'
  | 'work-zone'
  | 'signal'
  | 'lane-marking';

export type ExamImageKey =
  // Regulatory signs (white/red/black, traffic rules)
  | 'sign:stop'
  | 'sign:yield'
  | 'sign:do-not-enter'
  | 'sign:wrong-way'
  | 'sign:no-passing-zone'
  | 'sign:no-u-turn'
  | 'sign:no-left-turn'
  | 'sign:no-right-turn'
  | 'sign:one-way-left'
  | 'sign:one-way-right'
  | 'sign:keep-right'
  | 'sign:right-lane-must-turn-right'
  | 'sign:speed-limit-25'
  | 'sign:speed-limit-35'
  | 'sign:speed-limit-45'
  | 'sign:speed-limit-55'
  | 'sign:speed-limit-70'
  | 'sign:regulatory-blank'
  // Warning signs (yellow diamonds + special shapes)
  | 'sign:warning-blank'
  | 'sign:curve-ahead'
  | 'sign:merge'
  | 'sign:lane-ends'
  | 'sign:deer-crossing'
  | 'sign:slippery-when-wet'
  | 'sign:pedestrian-crossing'
  | 'sign:school-zone'
  | 'sign:traffic-signal-ahead'
  | 'sign:two-way-traffic'
  | 'sign:school-bus-stop-ahead'
  | 'sign:stop-ahead'
  | 'sign:railroad-crossing-circular'
  | 'sign:railroad-crossbuck'
  // Work zone
  | 'sign:work-zone'
  // Guide signs (color recognition)
  | 'sign:guide-service'
  | 'sign:guide-recreation'
  | 'sign:guide-green'
  // Traffic signals
  | 'signal:red'
  | 'signal:yellow'
  | 'signal:green'
  | 'signal:flashing-red'
  | 'signal:flashing-yellow'
  | 'signal:green-arrow-left'
  | 'signal:red-arrow-left'
  | 'signal:dark'
  // Lane markings (driver's view, looking down the road)
  | 'lane:dashed-yellow'
  | 'lane:solid-yellow-your-side'
  | 'lane:double-yellow'
  | 'lane:solid-left-dashed-right'
  | 'lane:dashed-left-solid-right'
  | 'lane:solid-white'
  | 'lane:dashed-white'
  | 'lane:center-turn-lane'
  | 'lane:stop-line'
  | 'lane:crosswalk';

export interface ExamImageMeta {
  /** Short answer-style label, e.g. "Stop sign". Used in galleries. */
  label: string;
  /** Pure visual description that does NOT name the sign. Used as default alt in quizzes so screen-reader users aren't spoiled. */
  visualDescription: string;
  /** Grouping for the Sign Gallery. */
  category: ExamImageCategory;
}

export const EXAM_IMAGE_CATALOG: Record<ExamImageKey, ExamImageMeta> = {
  // Regulatory
  'sign:stop': {
    label: 'Stop sign',
    visualDescription: 'red eight-sided sign with the word STOP in white',
    category: 'regulatory',
  },
  'sign:yield': {
    label: 'Yield sign',
    visualDescription: 'red and white upside-down triangle sign with the word YIELD',
    category: 'regulatory',
  },
  'sign:do-not-enter': {
    label: 'Do Not Enter sign',
    visualDescription: 'red square sign with a wide white horizontal bar and the words DO NOT ENTER',
    category: 'regulatory',
  },
  'sign:wrong-way': {
    label: 'Wrong Way sign',
    visualDescription: 'red rectangular sign with the words WRONG WAY in white',
    category: 'regulatory',
  },
  'sign:no-passing-zone': {
    label: 'No Passing Zone sign',
    visualDescription: 'yellow pennant-shaped sign with the words NO PASSING ZONE',
    category: 'regulatory',
  },
  'sign:no-u-turn': {
    label: 'No U-Turn sign',
    visualDescription: 'white square sign with a U-shaped arrow inside a red circle with a red diagonal slash',
    category: 'regulatory',
  },
  'sign:no-left-turn': {
    label: 'No Left Turn sign',
    visualDescription: 'white square sign with a left-turn arrow inside a red circle with a red diagonal slash',
    category: 'regulatory',
  },
  'sign:no-right-turn': {
    label: 'No Right Turn sign',
    visualDescription: 'white square sign with a right-turn arrow inside a red circle with a red diagonal slash',
    category: 'regulatory',
  },
  'sign:one-way-left': {
    label: 'One Way (Left) sign',
    visualDescription: 'black rectangular sign with a white left-pointing arrow and the words ONE WAY',
    category: 'regulatory',
  },
  'sign:one-way-right': {
    label: 'One Way (Right) sign',
    visualDescription: 'black rectangular sign with a white right-pointing arrow and the words ONE WAY',
    category: 'regulatory',
  },
  'sign:keep-right': {
    label: 'Keep Right sign',
    visualDescription: 'black and white sign with a downward-right arrow telling drivers to keep right',
    category: 'regulatory',
  },
  'sign:right-lane-must-turn-right': {
    label: 'Right Lane Must Turn Right sign',
    visualDescription: 'white rectangular sign with the words RIGHT LANE MUST TURN RIGHT and a right-turn arrow',
    category: 'regulatory',
  },
  'sign:speed-limit-25': {
    label: 'Speed Limit 25',
    visualDescription: 'white rectangular sign with black letters reading SPEED LIMIT 25',
    category: 'regulatory',
  },
  'sign:speed-limit-35': {
    label: 'Speed Limit 35',
    visualDescription: 'white rectangular sign with black letters reading SPEED LIMIT 35',
    category: 'regulatory',
  },
  'sign:speed-limit-45': {
    label: 'Speed Limit 45',
    visualDescription: 'white rectangular sign with black letters reading SPEED LIMIT 45',
    category: 'regulatory',
  },
  'sign:speed-limit-55': {
    label: 'Speed Limit 55',
    visualDescription: 'white rectangular sign with black letters reading SPEED LIMIT 55',
    category: 'regulatory',
  },
  'sign:speed-limit-70': {
    label: 'Speed Limit 70',
    visualDescription: 'white rectangular sign with black letters reading SPEED LIMIT 70',
    category: 'regulatory',
  },
  'sign:regulatory-blank': {
    label: 'Regulatory sign (white rectangle)',
    visualDescription: 'plain white rectangular sign with a black border',
    category: 'regulatory',
  },
  // Warning
  'sign:warning-blank': {
    label: 'Warning sign (yellow diamond)',
    visualDescription: 'plain yellow diamond-shaped sign with a black border',
    category: 'warning',
  },
  'sign:curve-ahead': {
    label: 'Curve Ahead sign',
    visualDescription: 'yellow diamond sign with a curved black arrow showing a bend in the road',
    category: 'warning',
  },
  'sign:merge': {
    label: 'Merge sign',
    visualDescription: 'yellow diamond sign with two arrows joining together to show merging traffic',
    category: 'warning',
  },
  'sign:lane-ends': {
    label: 'Lane Ends sign',
    visualDescription: 'yellow diamond sign showing the right lane narrowing into the left lane',
    category: 'warning',
  },
  'sign:deer-crossing': {
    label: 'Deer Crossing sign',
    visualDescription: 'yellow diamond sign with a black silhouette of a leaping deer',
    category: 'warning',
  },
  'sign:slippery-when-wet': {
    label: 'Slippery When Wet sign',
    visualDescription: 'yellow diamond sign with a black car silhouette and wavy skid marks behind it',
    category: 'warning',
  },
  'sign:pedestrian-crossing': {
    label: 'Pedestrian Crossing sign',
    visualDescription: 'yellow diamond sign with a black silhouette of a person walking',
    category: 'warning',
  },
  'sign:school-zone': {
    label: 'School Zone sign',
    visualDescription: 'yellow pentagon sign pointing up with two black silhouettes of children walking',
    category: 'warning',
  },
  'sign:traffic-signal-ahead': {
    label: 'Traffic Signal Ahead sign',
    visualDescription: 'yellow diamond sign showing a black traffic light icon',
    category: 'warning',
  },
  'sign:two-way-traffic': {
    label: 'Two-Way Traffic sign',
    visualDescription: 'yellow diamond sign with two opposing vertical arrows',
    category: 'warning',
  },
  'sign:school-bus-stop-ahead': {
    label: 'School Bus Stop Ahead sign',
    visualDescription: 'yellow diamond sign with a black silhouette of a school bus',
    category: 'warning',
  },
  'sign:stop-ahead': {
    label: 'Stop Ahead sign',
    visualDescription: 'yellow diamond sign with a small red octagon showing a stop sign is ahead',
    category: 'warning',
  },
  'sign:railroad-crossing-circular': {
    label: 'Railroad Crossing (round warning) sign',
    visualDescription: 'round yellow sign with a big black X and the letters R R',
    category: 'warning',
  },
  'sign:railroad-crossbuck': {
    label: 'Railroad Crossbuck sign',
    visualDescription: 'white X-shaped crossbuck sign reading RAILROAD CROSSING',
    category: 'warning',
  },
  // Work zone
  'sign:work-zone': {
    label: 'Work Zone sign',
    visualDescription: 'orange diamond sign with a black silhouette of a worker digging',
    category: 'work-zone',
  },
  // Guide
  'sign:guide-service': {
    label: 'Service sign (blue)',
    visualDescription: 'blue rectangular sign that points to gas, food, lodging, or hospital services',
    category: 'guide',
  },
  'sign:guide-recreation': {
    label: 'Recreation / Historic sign (brown)',
    visualDescription: 'brown rectangular sign that points to parks, beaches, or historic sites',
    category: 'guide',
  },
  'sign:guide-green': {
    label: 'Guide sign (green)',
    visualDescription: 'green rectangular sign with white text giving directions, distances, or exit info',
    category: 'guide',
  },
  // Traffic signals
  'signal:red': {
    label: 'Steady red signal',
    visualDescription: 'traffic light with the top red bulb lit',
    category: 'signal',
  },
  'signal:yellow': {
    label: 'Steady yellow signal',
    visualDescription: 'traffic light with the middle yellow bulb lit',
    category: 'signal',
  },
  'signal:green': {
    label: 'Steady green signal',
    visualDescription: 'traffic light with the bottom green bulb lit',
    category: 'signal',
  },
  'signal:flashing-red': {
    label: 'Flashing red signal',
    visualDescription: 'traffic light with the top red bulb flashing',
    category: 'signal',
  },
  'signal:flashing-yellow': {
    label: 'Flashing yellow signal',
    visualDescription: 'traffic light with the middle yellow bulb flashing',
    category: 'signal',
  },
  'signal:green-arrow-left': {
    label: 'Green left-arrow signal',
    visualDescription: 'traffic light showing a glowing green arrow pointing left',
    category: 'signal',
  },
  'signal:red-arrow-left': {
    label: 'Red left-arrow signal',
    visualDescription: 'traffic light showing a glowing red arrow pointing left',
    category: 'signal',
  },
  'signal:dark': {
    label: 'Dark / non-working signal',
    visualDescription: 'traffic light with no bulbs lit, indicating power is out',
    category: 'signal',
  },
  // Lane markings (looking down the road from the driver's seat)
  'lane:dashed-yellow': {
    label: 'Dashed yellow center line',
    visualDescription: 'two-lane road with a broken yellow line down the center',
    category: 'lane-marking',
  },
  'lane:solid-yellow-your-side': {
    label: 'Solid yellow line on your side',
    visualDescription: 'two-lane road with a solid yellow line on the driver-side edge of the lane',
    category: 'lane-marking',
  },
  'lane:double-yellow': {
    label: 'Double solid yellow center lines',
    visualDescription: 'two-lane road with two solid yellow lines down the center',
    category: 'lane-marking',
  },
  'lane:solid-left-dashed-right': {
    label: 'Solid left / dashed right yellow lines',
    visualDescription: 'two-lane road with a solid yellow line on the left of the center and a broken yellow line on the right',
    category: 'lane-marking',
  },
  'lane:dashed-left-solid-right': {
    label: 'Dashed left / solid right yellow lines',
    visualDescription: 'two-lane road with a broken yellow line on the left of the center and a solid yellow line on the right',
    category: 'lane-marking',
  },
  'lane:solid-white': {
    label: 'Solid white lane line',
    visualDescription: 'roadway with a solid white line separating two same-direction lanes',
    category: 'lane-marking',
  },
  'lane:dashed-white': {
    label: 'Dashed white lane line',
    visualDescription: 'roadway with a broken white line between two same-direction lanes',
    category: 'lane-marking',
  },
  'lane:center-turn-lane': {
    label: 'Shared center turn lane',
    visualDescription: 'three-lane road with a center turn lane marked by yellow lines on both sides, one solid and one broken on each side',
    category: 'lane-marking',
  },
  'lane:stop-line': {
    label: 'Stop line painted across a lane',
    visualDescription: 'roadway with a wide white line painted across the lane at an intersection',
    category: 'lane-marking',
  },
  'lane:crosswalk': {
    label: 'Crosswalk markings',
    visualDescription: 'roadway with parallel white stripes painted across the lane marking a pedestrian crossing',
    category: 'lane-marking',
  },
};

export const CATEGORY_LABELS: Record<ExamImageCategory, string> = {
  regulatory: 'Regulatory Signs',
  warning: 'Warning Signs',
  'work-zone': 'Work Zones',
  guide: 'Guide Signs (by color)',
  signal: 'Traffic Signals',
  'lane-marking': 'Lane Markings',
};
