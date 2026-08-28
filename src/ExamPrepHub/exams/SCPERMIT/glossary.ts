export interface GlossaryEntry {
  term: string;
  definition: string;
  category: 'signs' | 'laws' | 'driving' | 'vehicle';
}

export const glossary: GlossaryEntry[] = [
  {
    term: 'BAC (Blood Alcohol Content)',
    definition: 'The number used to measure how much alcohol is in someone\'s body after drinking.',
    category: 'laws',
  },
  {
    term: 'Blind spot',
    definition: 'The areas around your car that your mirrors do not fully show.',
    category: 'driving',
  },
  {
    term: 'Yield',
    definition: 'Slow down and let other traffic or people go first.',
    category: 'laws',
  },
  {
    term: 'Right of way',
    definition: 'Whose turn it is to go.',
    category: 'laws',
  },
  {
    term: 'Hydroplaning',
    definition: 'When your tires slide on water like a slip-n-slide and lose grip.',
    category: 'driving',
  },
  {
    term: 'Tailgating',
    definition: 'Following another car way too closely. Do not be that driver.',
    category: 'driving',
  },
  {
    term: 'Implied consent',
    definition: 'By driving, you have already agreed to take a breath, blood, or urine test if lawfully asked.',
    category: 'laws',
  },
  {
    term: 'Crosswalk',
    definition: 'The part of the road where people are supposed to walk across.',
    category: 'laws',
  },
  {
    term: 'Intersection',
    definition: 'Where two or more roads meet.',
    category: 'driving',
  },
  {
    term: 'Speed limit',
    definition: 'The fastest legal speed for that road when conditions are normal.',
    category: 'laws',
  },
  {
    term: 'Defensive driving',
    definition: 'Driving in a way that helps you avoid trouble even when other people mess up.',
    category: 'driving',
  },
  {
    term: 'Following distance',
    definition: 'The space between your car and the one ahead of you.',
    category: 'driving',
  },
  {
    term: 'Lane',
    definition: 'One section of the road for a line of traffic.',
    category: 'driving',
  },
  {
    term: 'Merge',
    definition: 'To move into another lane by matching traffic speed and fitting into a safe gap.',
    category: 'driving',
  },
  {
    term: 'No passing zone',
    definition: 'A stretch of road where you are not allowed to pass another vehicle.',
    category: 'signs',
  },
  {
    term: 'Regulatory sign',
    definition: 'A sign that tells you a rule you must follow.',
    category: 'signs',
  },
  {
    term: 'Warning sign',
    definition: 'A sign that alerts you to something ahead, like a curve or crossing.',
    category: 'signs',
  },
  {
    term: 'Guide sign',
    definition: 'A sign that helps you with directions, routes, exits, or distances.',
    category: 'signs',
  },
  {
    term: 'Work zone',
    definition: 'An area where road work is happening, so traffic patterns may change fast.',
    category: 'signs',
  },
  {
    term: 'Do Not Enter',
    definition: 'A sign that means you cannot go that way at all.',
    category: 'signs',
  },
  {
    term: 'Wrong Way',
    definition: 'A sign warning that you are heading in the opposite direction of traffic.',
    category: 'signs',
  },
  {
    term: 'School zone',
    definition: 'An area near a school where you need to slow down and watch hard for kids.',
    category: 'laws',
  },
  {
    term: 'Pedestrian',
    definition: 'A person walking, running, or using a wheelchair on or near the road.',
    category: 'laws',
  },
  {
    term: 'Emergency vehicle',
    definition: 'A police car, ambulance, or fire truck using lights or sirens.',
    category: 'laws',
  },
  {
    term: 'Seat belt',
    definition: 'The safety belt that helps keep you from getting thrown around in a crash.',
    category: 'vehicle',
  },
  {
    term: 'Airbag',
    definition: 'A cushion that pops out in a crash to help protect you.',
    category: 'vehicle',
  },
  {
    term: 'Anti-lock brakes (ABS)',
    definition: 'A brake system that helps stop your wheels from locking up during hard braking.',
    category: 'vehicle',
  },
  {
    term: 'Parking brake',
    definition: 'The brake used to help keep a parked car from rolling. It can also help in an emergency.',
    category: 'vehicle',
  },
  {
    term: 'Headlights',
    definition: 'The front lights on your car used to help you see and be seen.',
    category: 'vehicle',
  },
  {
    term: 'High beams',
    definition: 'The brighter headlight setting for dark roads when no one is close in front of you.',
    category: 'vehicle',
  },
  {
    term: 'Turn signal',
    definition: 'The blinking light that shows other people you are about to turn or change lanes.',
    category: 'vehicle',
  },
  {
    term: 'Brake lights',
    definition: 'The red lights on the back of a car that come on when the driver brakes.',
    category: 'vehicle',
  },
  {
    term: 'Tread',
    definition: 'The grooves in your tire that help it grip the road.',
    category: 'vehicle',
  },
  {
    term: 'Skid',
    definition: 'When your tires lose grip and the car starts sliding.',
    category: 'driving',
  },
  {
    term: 'Traction',
    definition: 'How well your tires grip the road.',
    category: 'driving',
  },
  {
    term: 'Overcorrecting',
    definition: 'Turning the wheel too much when trying to fix a skid or drift, which can make things worse.',
    category: 'driving',
  },
  {
    term: 'DUI',
    definition: 'Driving under the influence of alcohol or drugs.',
    category: 'laws',
  },
  {
    term: 'Zero tolerance',
    definition: 'For underage drivers, even a tiny amount of alcohol can mean big legal trouble.',
    category: 'laws',
  },
  {
    term: 'Flashing red light',
    definition: 'A signal that means stop completely, then go when it is safe.',
    category: 'laws',
  },
  {
    term: 'Flashing yellow light',
    definition: 'A signal that means slow down and move carefully.',
    category: 'laws',
  },
  {
    term: 'Railroad crossing',
    definition: 'The place where train tracks cross the road.',
    category: 'signs',
  },
  {
    term: 'Roundabout',
    definition: 'A circular intersection where traffic moves one way around a center island.',
    category: 'driving',
  },
  {
    term: 'Merging traffic',
    definition: 'Cars from another lane or ramp joining your lane.',
    category: 'driving',
  },
  {
    term: 'Road rage',
    definition: 'Angry driving behavior that can turn a bad moment into a dangerous one fast.',
    category: 'driving',
  },
  {
    term: 'Stopping distance',
    definition: 'The total distance your car travels from the moment you notice danger until it fully stops.',
    category: 'driving',
  },
  {
    term: 'Reaction time',
    definition: 'How long it takes your brain and body to notice something and start responding.',
    category: 'driving',
  },
];
