import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { ExamImage } from './signs';
import { EXAM_IMAGE_CATALOG, CATEGORY_LABELS, type ExamImageCategory, type ExamImageKey } from './signs/catalog';

const CHEAT_SHEET = [
  '30 questions total. Need 24 right = 80% to pass.',
  'Red means DEAD stop. Not a rolling crawl. A full stop.',
  'Parking 15-20-30: hydrant, crosswalk, stop sign.',
  'Following distance: 2-second rule in good weather.',
  'Hands-Free SC Act: do not hold your phone while driving.',
  'Under 21 + alcohol = zero tolerance. Do not risk it.',
  'Work zone fines can be doubled. Slow down and pay attention.',
] as const;

const SECTIONS = [
  {
    title: '🚦 Traffic Signals',
    summary: "Lights are basically the road's scoreboard. Know what each color is telling you to do right now.",
    facts: [
      'Red = stop completely. Think: Red means DEAD stop.',
      'Green = go only if the intersection is clear.',
      'Yellow = the light is changing. Slow down and prepare to stop if you safely can.',
      'Flashing red = treat it like a stop sign.',
      'Flashing yellow = slow down and be extra careful.',
      'Green arrows mean protected turns. Red arrows mean no turn that way.',
    ],
    tip: 'If you are guessing, pick the answer that is calmer and safer. The DMV loves safe choices.',
  },
  {
    title: '🛑 Road Signs',
    summary: 'Shapes and colors are clues. You should know many signs before you even read the words.',
    facts: [
      'Octagon = STOP. Only one sign shape gets that much drama.',
      'Triangle = YIELD. Give the other driver the turn first.',
      'Diamond = warning. Something unusual is ahead.',
      'Red signs usually mean stop, yield, or prohibition.',
      'Yellow = caution. White = rules. Orange = work zone.',
      'If a sign and a traffic light disagree, follow the one actively directing traffic.',
    ],
    tip: 'See the shape first, then the words. That trick helps on fast test questions.',
  },
  {
    title: '🔄 Right of Way',
    summary: 'Think of it like taking turns in a group chat. Someone goes first, and everyone else waits.',
    facts: [
      'At a 4-way stop, the first vehicle to stop goes first.',
      'If two cars stop at the same time, the driver on the right usually goes first.',
      'Drivers turning left must yield to oncoming traffic.',
      'Pedestrians in crosswalks get the space they need.',
      'Emergency vehicles with lights or sirens get the road. Pull over safely.',
      'Never fight for right of way. If needed, let the other driver be wrong somewhere else.',
    ],
    tip: 'Right of way is given, not taken. That sentence shows up in driver ed for a reason.',
  },
  {
    title: '⚡ Speed Limits',
    summary: 'Default speeds are the baseline when no sign tells you otherwise.',
    facts: [
      'South Carolina defaults: 30 mph in city or town areas.',
      '40 mph on unpaved roads unless posted differently.',
      '55 mph on highways unless signs say otherwise.',
      '70 mph on interstates in many areas where posted.',
      'Bad weather, traffic, or construction = slow down even if the sign stays the same.',
      'Going too fast for conditions can still get you in trouble.',
    ],
    tip: 'Speed limit does not mean speed mission. Conditions matter.',
  },
  {
    title: '🚌 School Bus Rules',
    summary: 'This is a huge test topic. The safest answer wins here every single time.',
    facts: [
      'When a school bus has flashing red lights, stop.',
      'Stop because kids may cross in front of or behind the bus.',
      'Stay stopped until the lights stop flashing and the bus moves or the driver signals you on.',
      'Be extra alert in school zones and near bus stops.',
      'Think back to riding the bus: drivers often cannot see every child right away.',
    ],
    tip: 'If you see bus + red flashing lights, your brain should instantly yell STOP.',
  },
  {
    title: '🅿️ Parking Rules',
    summary: 'These are the magic numbers students forget. Do not be that person.',
    facts: [
      '15 feet from a fire hydrant.',
      '20 feet from a crosswalk at an intersection.',
      '30 feet from a stop sign, yield sign, or traffic signal.',
      'Do not block driveways, sidewalks, or intersections.',
      'Park where your car is visible and not creating a hazard.',
    ],
    tip: 'Remember the 15-20-30 rule: hydrant, crosswalk, stop sign.',
  },
  {
    title: '📱 Phone & Distracted Driving',
    summary: 'South Carolina is serious about phones. No holding it while driving. Period.',
    facts: [
      'The Hands-Free SC Act means you cannot hold or support a phone while driving.',
      'Texting, scrolling, and hand-held calling are all bad ideas and can be illegal.',
      'Set directions and music before you move.',
      'If you truly need your phone, pull over somewhere safe first.',
      'A few seconds looking down is enough to miss a stop light, a kid, or a bike.',
    ],
    tip: 'Your eyes belong on the road, not on a screen.',
  },
  {
    title: '🍺 DUI & Zero Tolerance',
    summary: 'For drivers under 21, the rule is simple: zero alcohol. No excuses.',
    facts: [
      'Under 21 = zero tolerance for alcohol and driving.',
      'For adults, a BAC of 0.08% is the common DUI threshold.',
      'Alcohol slows reaction time, judgment, and coordination.',
      'Drugs can also make you an unsafe and illegal driver.',
      'A ride home is always cheaper than a DUI.',
    ],
    tip: 'If someone has been drinking, they should not be driving. End of story.',
  },
  {
    title: '🌧️ Driving in Bad Weather',
    summary: 'Rain, fog, and storms make everything harder. More space and less speed are your best friends.',
    facts: [
      'Slow down when the road is wet, foggy, or slick.',
      'Turn on headlights when visibility drops.',
      'Increase your following distance beyond the normal 2 seconds.',
      'Brake gently and avoid sudden moves.',
      'If you cannot see well, pulling over safely is smarter than guessing.',
    ],
    tip: 'Bad weather = less grip, less sight, less speed.',
  },
  {
    title: '💡 Headlights & Visibility',
    summary: 'Headlights help you see and help other people see you.',
    facts: [
      'Use headlights when you cannot see 500 feet ahead.',
      'Use them in rain, fog, smoke, or other low-visibility situations.',
      'Use them from 30 minutes after sunset until 30 minutes before sunrise.',
      'Dim high beams when approaching other vehicles.',
      'Clean windows and mirrors so your view stays sharp.',
    ],
    tip: 'If the world looks gray and blurry, lights on.',
  },
  {
    title: '🚗 Following Distance',
    summary: 'Tailgating is basically asking for a bad day. Give yourself time to react.',
    facts: [
      'Use the 2-second rule in normal conditions.',
      'Pick a sign or pole. When the car ahead passes it, count one-Mississippi, two-Mississippi.',
      'If you reach the marker too soon, back off.',
      'Add more space in rain, at night, or behind motorcycles and trucks.',
      'More room = more time to brake smoothly.',
    ],
    tip: 'Space is safety. The extra gap is not wasted road.',
  },
  {
    title: '🔀 Passing & Lane Changes',
    summary: 'Passing is not just about speed. It is about clear space, clear sight, and smart timing.',
    facts: [
      'Check mirrors and blind spots before changing lanes.',
      'Signal before you move. Let people know your plan.',
      'A solid yellow line means no passing on your side.',
      'Do not pass when you cannot see far enough ahead.',
      'Return to your lane only when you can see the passed vehicle in your mirror.',
    ],
    tip: 'If the line is solid yellow, the answer is easy: NO passing.',
  },
  {
    title: '⚠️ Work Zones & Special Situations',
    summary: 'Construction areas, emergency scenes, and weird traffic setups need extra patience.',
    facts: [
      'Slow down in work zones and watch for workers, cones, and sudden lane shifts.',
      'Fines can be doubled in work zones.',
      'Obey flaggers even if signs seem different. They are controlling traffic in real time.',
      'Move over or slow down for emergency vehicles and roadside incidents when it is safe to do so.',
      'Expect the unexpected. Work zones change fast.',
    ],
    tip: 'Orange means attention. Work zones are not the place to zone out.',
  },
] as const;

export default function StudyGuide() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const ACCENT = isDark ? '#4DD0B3' : '#0F9D8A';
  const PAGE_BG = isDark ? '#081916' : '#F2FBF8';
  const CARD_BG = isDark ? '#0F2420' : '#FFFFFF';
  const BORDER = isDark ? '#1D4E47' : '#CFEDE6';
  const TEXT_PRI = isDark ? '#E9FFF9' : '#10332E';
  const TEXT_SEC = isDark ? '#9ED7CC' : '#4D7A72';

  return (
    <Box sx={{ pb: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, mb: 2.5, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: TEXT_PRI, mb: 0.75 }}>
              Quick Cheat Sheet 📋
            </Typography>
            <Typography variant="body2" sx={{ color: TEXT_SEC, maxWidth: 760 }}>
              These are the facts students miss the most. If you remember this box, you are already helping future-you.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {CHEAT_SHEET.map((fact) => (
              <Chip
                key={fact}
                label={fact}
                sx={{
                  height: 'auto',
                  '& .MuiChip-label': { display: 'block', whiteSpace: 'normal', py: 1 },
                  bgcolor: alpha(ACCENT, isDark ? 0.18 : 0.1),
                  color: TEXT_PRI,
                  border: `1px solid ${alpha(ACCENT, 0.25)}`,
                  borderRadius: 2,
                  maxWidth: 320,
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, borderRadius: 2, bgcolor: alpha(ACCENT, isDark ? 0.14 : 0.08), border: `1px solid ${alpha(ACCENT, 0.24)}` }}>
        <Typography variant="subtitle1" fontWeight={800} sx={{ color: TEXT_PRI, mb: 0.5 }}>
          Memory tricks that actually help 🧠
        </Typography>
        <Typography variant="body2" sx={{ color: TEXT_SEC, lineHeight: 1.7 }}>
          <strong>Red means DEAD stop.</strong> <strong>15-20-30</strong> for parking. <strong>2-second rule</strong> for following.
          The test loves these repeat facts, so let them live rent-free in your brain.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, mb: 2.5, borderRadius: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: TEXT_PRI, mb: 0.5 }}>
              🪧 Sign &amp; Signal Gallery
            </Typography>
            <Typography variant="body2" sx={{ color: TEXT_SEC, lineHeight: 1.6, maxWidth: 760 }}>
              Quick visual reference. Tap an image to remember the shape and color first — that's how the test wants you to recognize it.
            </Typography>
          </Box>

          {(Object.keys(CATEGORY_LABELS) as ExamImageCategory[]).map((category) => {
            const keys = (Object.entries(EXAM_IMAGE_CATALOG) as Array<[ExamImageKey, typeof EXAM_IMAGE_CATALOG[ExamImageKey]]>)
              .filter(([, meta]) => meta.category === category)
              .map(([key]) => key);
            if (!keys.length) return null;
            return (
              <Box key={category}>
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: TEXT_PRI, mb: 1.25 }}>
                  {CATEGORY_LABELS[category]}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' },
                    gap: 1.5,
                  }}
                >
                  {keys.map((key) => (
                    <Box
                      key={key}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        border: `1px solid ${alpha(ACCENT, 0.18)}`,
                        bgcolor: alpha(ACCENT, isDark ? 0.08 : 0.04),
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.75,
                      }}
                    >
                      <ExamImage imageKey={key} alt={EXAM_IMAGE_CATALOG[key].label} size={84} />
                      <Typography
                        variant="caption"
                        sx={{ color: TEXT_PRI, fontWeight: 700, lineHeight: 1.25 }}
                      >
                        {EXAM_IMAGE_CATALOG[key].label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}

          <Typography variant="caption" sx={{ color: TEXT_SEC, fontStyle: 'italic' }}>
            Illustrations are simplified MUTCD-style study aids, not official DMV materials.
          </Typography>
        </Stack>
      </Paper>

      <Stack spacing={1.5} sx={{ bgcolor: PAGE_BG, borderRadius: 2 }}>
        {SECTIONS.map((section, index) => (
          <Accordion
            key={section.title}
            defaultExpanded={index === 0}
            disableGutters
            elevation={0}
            sx={{
              bgcolor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: '18px !important',
              overflow: 'hidden',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: TEXT_SEC }} />}>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ color: TEXT_PRI }}>
                  {section.title}
                </Typography>
                <Typography variant="body2" sx={{ color: TEXT_SEC, mt: 0.5 }}>
                  {section.summary}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.25}>
                {section.facts.map((fact) => (
                  <Box
                    key={fact}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(ACCENT, isDark ? 0.14 : 0.07),
                      border: `1px solid ${alpha(ACCENT, 0.2)}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: TEXT_PRI, lineHeight: 1.7 }}>
                      • {fact}
                    </Typography>
                  </Box>
                ))}
                <Paper elevation={0} sx={{ p: 1.75, borderRadius: 2, bgcolor: alpha('#FFD54F', isDark ? 0.12 : 0.18), border: `1px solid ${alpha('#FFD54F', 0.28)}` }}>
                  <Typography variant="body2" sx={{ color: TEXT_PRI, fontWeight: 700 }}>
                    Memory tip: {section.tip}
                  </Typography>
                </Paper>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
}
