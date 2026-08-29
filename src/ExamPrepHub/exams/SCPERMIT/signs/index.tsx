import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { EXAM_IMAGE_CATALOG, type ExamImageKey } from './catalog';

// ---------------------------------------------------------------------------
// Shared SVG primitives
// ---------------------------------------------------------------------------

const STROKE = '#111111';
const SIGN_WHITE = '#FFFFFF';
const SIGN_RED = '#D81E0E';
const SIGN_YELLOW = '#FFD300';
const SIGN_ORANGE = '#FF8C1A';
const SIGN_GREEN = '#197D3F';
const SIGN_BLUE = '#175CB7';
const SIGN_BROWN = '#6E4B2A';
const ASPHALT = '#3A3A3A';
const ROAD_LINE_YELLOW = '#F2C200';
const ROAD_LINE_WHITE = '#F4F4F4';

const SignSvg = ({ children, viewBox = '0 0 100 100' }: { children: ReactNode; viewBox?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    style={{ width: '100%', height: '100%', display: 'block' }}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const Diamond = ({ fill = SIGN_YELLOW, stroke = STROKE }: { fill?: string; stroke?: string }) => (
  <>
    <polygon points="50,4 96,50 50,96 4,50" fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
    <polygon
      points="50,11 89,50 50,89 11,50"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeOpacity="0.55"
      strokeLinejoin="round"
    />
  </>
);

const Pentagon = ({ fill = SIGN_YELLOW }: { fill?: string }) => (
  <polygon
    points="50,4 92,30 78,94 22,94 8,30"
    fill={fill}
    stroke={STROKE}
    strokeWidth="3"
    strokeLinejoin="round"
  />
);

const RegRect = ({ fill = SIGN_WHITE, stroke = STROKE }: { fill?: string; stroke?: string }) => (
  <rect x="14" y="8" width="72" height="84" rx="3" fill={fill} stroke={stroke} strokeWidth="3" />
);

const ProhibitionOverlay = ({ cx = 50, cy = 50, r = 36 }: { cx?: number; cy?: number; r?: number }) => (
  <>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={SIGN_RED} strokeWidth="8" />
    <line
      x1={cx - r * Math.SQRT1_2}
      y1={cy - r * Math.SQRT1_2}
      x2={cx + r * Math.SQRT1_2}
      y2={cy + r * Math.SQRT1_2}
      stroke={SIGN_RED}
      strokeWidth="8"
      strokeLinecap="round"
    />
  </>
);

// ---------------------------------------------------------------------------
// Regulatory signs
// ---------------------------------------------------------------------------

const StopSign = () => (
  <SignSvg>
    <polygon
      points="29.3,2 70.7,2 98,29.3 98,70.7 70.7,98 29.3,98 2,70.7 2,29.3"
      fill={SIGN_RED}
      stroke="#FFFFFF"
      strokeWidth="3"
    />
    <polygon
      points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.5"
    />
    <text
      x="50"
      y="61"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="30"
      fill="#FFFFFF"
      letterSpacing="1"
    >
      STOP
    </text>
  </SignSvg>
);

const YieldSign = () => (
  <SignSvg>
    <polygon points="6,12 94,12 50,94" fill={SIGN_RED} stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
    <polygon points="16,20 84,20 50,82" fill={SIGN_WHITE} />
    <text
      x="50"
      y="48"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="18"
      fill={SIGN_RED}
    >
      YIELD
    </text>
  </SignSvg>
);

const DoNotEnterSign = () => (
  <SignSvg>
    <rect x="4" y="4" width="92" height="92" rx="3" fill={SIGN_RED} stroke={STROKE} strokeWidth="2" />
    <rect x="14" y="40" width="72" height="20" fill={SIGN_WHITE} />
    <text
      x="50"
      y="80"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="9"
      fill={SIGN_WHITE}
    >
      DO NOT ENTER
    </text>
  </SignSvg>
);

const WrongWaySign = () => (
  <SignSvg viewBox="0 0 100 60">
    <rect x="3" y="3" width="94" height="54" rx="3" fill={SIGN_RED} stroke={STROKE} strokeWidth="2" />
    <text
      x="50"
      y="38"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="18"
      fill={SIGN_WHITE}
      letterSpacing="2"
    >
      WRONG WAY
    </text>
  </SignSvg>
);

const NoPassingZoneSign = () => (
  <SignSvg viewBox="0 0 100 100">
    <polygon points="6,6 94,50 6,94" fill={SIGN_YELLOW} stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
    <text
      x="32"
      y="44"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="10"
      fill={STROKE}
    >
      NO
    </text>
    <text
      x="34"
      y="56"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="10"
      fill={STROKE}
    >
      PASSING
    </text>
    <text
      x="32"
      y="68"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="10"
      fill={STROKE}
    >
      ZONE
    </text>
  </SignSvg>
);

const UTurnArrow = ({ color = STROKE }: { color?: string }) => (
  <path
    d="M 32 70 L 32 50 A 18 18 0 0 1 68 50 L 68 64 L 78 64 L 62 80 L 46 64 L 56 64 L 56 50 A 6 6 0 0 0 44 50 L 44 70 Z"
    fill={color}
  />
);

const NoUTurnSign = () => (
  <SignSvg>
    <rect x="4" y="4" width="92" height="92" rx="3" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="2" />
    <UTurnArrow />
    <ProhibitionOverlay cx={50} cy={56} r={36} />
  </SignSvg>
);

const LeftTurnArrow = ({ color = STROKE }: { color?: string }) => (
  <path d="M 80 56 L 36 56 L 36 38 L 18 60 L 36 82 L 36 66 L 80 66 Z" fill={color} />
);

const RightTurnArrow = ({ color = STROKE }: { color?: string }) => (
  <path d="M 20 56 L 64 56 L 64 38 L 82 60 L 64 82 L 64 66 L 20 66 Z" fill={color} />
);

const NoLeftTurnSign = () => (
  <SignSvg>
    <rect x="4" y="4" width="92" height="92" rx="3" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="2" />
    <LeftTurnArrow />
    <ProhibitionOverlay cx={50} cy={60} r={36} />
  </SignSvg>
);

const NoRightTurnSign = () => (
  <SignSvg>
    <rect x="4" y="4" width="92" height="92" rx="3" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="2" />
    <RightTurnArrow />
    <ProhibitionOverlay cx={50} cy={60} r={36} />
  </SignSvg>
);

const OneWaySign = ({ direction }: { direction: 'left' | 'right' }) => (
  <SignSvg viewBox="0 0 120 50">
    <rect x="2" y="2" width="116" height="46" rx="2" fill={STROKE} />
    {direction === 'left' ? (
      <path d="M 78 25 L 30 25 L 30 14 L 12 25 L 30 36 L 30 25 Z" fill={SIGN_WHITE} />
    ) : (
      <path d="M 42 25 L 90 25 L 90 14 L 108 25 L 90 36 L 90 25 Z" fill={SIGN_WHITE} />
    )}
    <text
      x={direction === 'left' ? 92 : 28}
      y="29"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="10"
      fill={SIGN_WHITE}
    >
      ONE WAY
    </text>
  </SignSvg>
);

const KeepRightSign = () => (
  <SignSvg>
    <rect x="14" y="8" width="72" height="84" rx="3" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="3" />
    <path d="M 36 30 L 60 30 L 60 56 L 70 56 L 50 80 L 30 56 L 40 56 L 40 38 L 36 38 Z" fill={STROKE} />
  </SignSvg>
);

const RightLaneMustTurnRightSign = () => (
  <SignSvg viewBox="0 0 100 100">
    <rect x="6" y="14" width="88" height="72" rx="3" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="3" />
    <text x="50" y="32" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="10" fill={STROKE}>
      RIGHT LANE
    </text>
    <text x="50" y="46" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="10" fill={STROKE}>
      MUST
    </text>
    <text x="50" y="60" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="10" fill={STROKE}>
      TURN RIGHT
    </text>
    <path d="M 32 72 L 56 72 L 56 66 L 70 76 L 56 84 L 56 78 L 32 78 Z" fill={STROKE} />
  </SignSvg>
);

const SpeedLimitSign = ({ value }: { value: number }) => (
  <SignSvg viewBox="0 0 80 100">
    <rect x="4" y="4" width="72" height="92" rx="3" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="3" />
    <text
      x="40"
      y="26"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="13"
      fill={STROKE}
    >
      SPEED
    </text>
    <text
      x="40"
      y="42"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="13"
      fill={STROKE}
    >
      LIMIT
    </text>
    <text
      x="40"
      y="84"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="44"
      fill={STROKE}
    >
      {value}
    </text>
  </SignSvg>
);

const RegulatoryBlankSign = () => (
  <SignSvg>
    <RegRect />
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="10"
      fill={STROKE}
    >
      REGULATORY
    </text>
  </SignSvg>
);

// ---------------------------------------------------------------------------
// Warning signs
// ---------------------------------------------------------------------------

const WarningBlank = () => (
  <SignSvg>
    <Diamond />
  </SignSvg>
);

const CurveAheadSign = () => (
  <SignSvg>
    <Diamond />
    <path
      d="M 36 80 Q 36 50 60 50 L 60 38"
      fill="none"
      stroke={STROKE}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <polygon points="60,28 52,42 68,42" fill={STROKE} />
  </SignSvg>
);

const MergeSign = () => (
  <SignSvg>
    <Diamond />
    <path d="M 50 86 L 50 36" stroke={STROKE} strokeWidth="6" strokeLinecap="round" />
    <path
      d="M 68 70 Q 60 56 50 50"
      fill="none"
      stroke={STROKE}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <polygon points="50,28 42,40 58,40" fill={STROKE} />
  </SignSvg>
);

const LaneEndsSign = () => (
  <SignSvg>
    <Diamond />
    <path d="M 38 86 L 38 30" stroke={STROKE} strokeWidth="5" strokeLinecap="round" />
    <path d="M 62 86 L 62 60 Q 62 46 50 38" stroke={STROKE} strokeWidth="5" strokeLinecap="round" fill="none" />
    <polygon points="38,22 30,34 46,34" fill={STROKE} />
  </SignSvg>
);

const DeerCrossingSign = () => (
  <SignSvg>
    <Diamond />
    {/* Stylized leaping deer */}
    <path
      d="M 26 70
         L 30 56
         L 38 52
         L 44 42
         L 52 38
         L 58 30
         L 60 36
         L 56 42
         L 64 44
         L 72 36
         L 74 42
         L 70 48
         L 66 52
         L 68 64
         L 72 78
         L 66 78
         L 62 66
         L 50 66
         L 46 78
         L 40 78
         L 44 64
         L 36 60
         L 30 78
         L 24 78 Z"
      fill={STROKE}
    />
    {/* antlers */}
    <path d="M 58 30 L 54 22 M 60 32 L 64 22 M 62 28 L 60 18" stroke={STROKE} strokeWidth="2" />
  </SignSvg>
);

const SlipperyWhenWetSign = () => (
  <SignSvg>
    <Diamond />
    {/* car silhouette */}
    <path
      d="M 28 60
         L 32 50
         L 42 46
         L 56 46
         L 66 50
         L 72 60
         L 72 68
         L 28 68 Z"
      fill={STROKE}
    />
    <circle cx="38" cy="70" r="5" fill={STROKE} />
    <circle cx="62" cy="70" r="5" fill={STROKE} />
    {/* skid marks */}
    <path d="M 28 80 Q 36 78 30 84 Q 38 82 32 88" stroke={STROKE} strokeWidth="2" fill="none" />
    <path d="M 70 80 Q 62 78 68 84 Q 60 82 66 88" stroke={STROKE} strokeWidth="2" fill="none" />
  </SignSvg>
);

const Pedestrian = ({ x = 50, scale = 1 }: { x?: number; scale?: number }) => (
  <g transform={`translate(${x} 28) scale(${scale})`}>
    <circle cx="0" cy="0" r="4.5" fill={STROKE} />
    <path d="M -5 6 L 5 6 L 7 22 L 2 22 L 1 14 L -1 14 L -2 22 L -7 22 Z" fill={STROKE} />
    <path d="M -7 22 L -10 36 L -6 36 L -3 22" fill={STROKE} />
    <path d="M 7 22 L 10 36 L 6 36 L 3 22" fill={STROKE} />
    <path d="M -5 8 L -14 14 L -12 18 L -3 12" fill={STROKE} />
  </g>
);

const PedestrianCrossingSign = () => (
  <SignSvg>
    <Diamond />
    <Pedestrian x={50} scale={1.6} />
  </SignSvg>
);

const SchoolZoneSign = () => (
  <SignSvg>
    <Pentagon />
    <Pedestrian x={40} scale={1.2} />
    <Pedestrian x={62} scale={1} />
  </SignSvg>
);

const TrafficSignalAheadSign = () => (
  <SignSvg>
    <Diamond />
    <rect x="40" y="30" width="20" height="44" rx="3" fill={STROKE} />
    <circle cx="50" cy="40" r="5" fill={SIGN_RED} />
    <circle cx="50" cy="52" r="5" fill={SIGN_YELLOW} />
    <circle cx="50" cy="64" r="5" fill="#2ECC55" />
    <rect x="48" y="74" width="4" height="8" fill={STROKE} />
  </SignSvg>
);

const TwoWayTrafficSign = () => (
  <SignSvg>
    <Diamond />
    <path d="M 42 26 L 42 70 L 36 70 L 44 82 L 52 70 L 46 70 L 46 26 Z" fill={STROKE} />
    <path d="M 58 82 L 58 38 L 52 38 L 60 26 L 68 38 L 62 38 L 62 82 Z" fill={STROKE} />
  </SignSvg>
);

const SchoolBusStopAheadSign = () => (
  <SignSvg>
    <Diamond />
    <rect x="22" y="44" width="56" height="22" rx="2" fill={STROKE} />
    <rect x="26" y="48" width="10" height="8" fill={SIGN_YELLOW} />
    <rect x="40" y="48" width="10" height="8" fill={SIGN_YELLOW} />
    <rect x="54" y="48" width="10" height="8" fill={SIGN_YELLOW} />
    <rect x="68" y="48" width="6" height="8" fill={SIGN_YELLOW} />
    <circle cx="32" cy="70" r="4" fill={STROKE} />
    <circle cx="66" cy="70" r="4" fill={STROKE} />
  </SignSvg>
);

const StopAheadSign = () => (
  <SignSvg>
    <Diamond />
    {/* mini stop sign */}
    <g transform="translate(50 48) scale(0.32)">
      <polygon
        points="-21,-50 21,-50 50,-21 50,21 21,50 -21,50 -50,21 -50,-21"
        fill={SIGN_RED}
        stroke={STROKE}
        strokeWidth="3"
      />
      <text
        x="0"
        y="14"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="38"
        fill={SIGN_WHITE}
      >
        STOP
      </text>
    </g>
    <text
      x="50"
      y="82"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="10"
      fill={STROKE}
    >
      AHEAD
    </text>
  </SignSvg>
);

const RailroadCircularSign = () => (
  <SignSvg>
    <circle cx="50" cy="50" r="46" fill={SIGN_YELLOW} stroke={STROKE} strokeWidth="3" />
    <line x1="14" y1="14" x2="86" y2="86" stroke={STROKE} strokeWidth="8" />
    <line x1="86" y1="14" x2="14" y2="86" stroke={STROKE} strokeWidth="8" />
    <text
      x="34"
      y="58"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="18"
      fill={STROKE}
    >
      R
    </text>
    <text
      x="66"
      y="58"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="18"
      fill={STROKE}
    >
      R
    </text>
  </SignSvg>
);

const RailroadCrossbuckSign = () => (
  <SignSvg viewBox="0 0 100 100">
    <g transform="rotate(45 50 50)">
      <rect x="8" y="44" width="84" height="12" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="2" />
    </g>
    <g transform="rotate(-45 50 50)">
      <rect x="8" y="44" width="84" height="12" fill={SIGN_WHITE} stroke={STROKE} strokeWidth="2" />
    </g>
    <text
      x="50"
      y="46"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="7"
      fill={STROKE}
      transform="rotate(-45 50 50)"
    >
      RAILROAD
    </text>
    <text
      x="50"
      y="46"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="7"
      fill={STROKE}
      transform="rotate(45 50 50)"
    >
      CROSSING
    </text>
  </SignSvg>
);

// ---------------------------------------------------------------------------
// Work zone
// ---------------------------------------------------------------------------

const WorkZoneSign = () => (
  <SignSvg>
    <Diamond fill={SIGN_ORANGE} />
    {/* worker silhouette + shovel */}
    <circle cx="44" cy="34" r="5" fill={STROKE} />
    <path d="M 39 40 L 49 40 L 52 60 L 46 60 L 45 50 L 43 50 L 42 60 L 36 60 Z" fill={STROKE} />
    <path d="M 36 60 L 32 76 L 38 76 L 41 60" fill={STROKE} />
    <path d="M 52 60 L 56 76 L 50 76 L 47 60" fill={STROKE} />
    <line x1="52" y1="44" x2="74" y2="68" stroke={STROKE} strokeWidth="3" />
    <polygon points="70,66 78,66 76,76 70,76" fill={STROKE} />
  </SignSvg>
);

// ---------------------------------------------------------------------------
// Guide signs (by color)
// ---------------------------------------------------------------------------

const GuideSign = ({ color, label }: { color: string; label: string }) => (
  <SignSvg viewBox="0 0 100 70">
    <rect x="3" y="3" width="94" height="64" rx="3" fill={color} stroke={STROKE} strokeWidth="2" />
    <text
      x="50"
      y="42"
      textAnchor="middle"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight="900"
      fontSize="14"
      fill={SIGN_WHITE}
      letterSpacing="1"
    >
      {label}
    </text>
  </SignSvg>
);

const GuideServiceSign = () => <GuideSign color={SIGN_BLUE} label="GAS  FOOD" />;
const GuideRecreationSign = () => <GuideSign color={SIGN_BROWN} label="PARK" />;
const GuideGreenSign = () => <GuideSign color={SIGN_GREEN} label="EXIT  24" />;

// ---------------------------------------------------------------------------
// Traffic signals
// ---------------------------------------------------------------------------

type SignalBulb = 'red' | 'yellow' | 'green' | 'red-arrow-left' | 'green-arrow-left' | 'flashing-red' | 'flashing-yellow' | 'dark';

const SignalHousing = ({ active }: { active: SignalBulb }) => {
  const redLit = active === 'red' || active === 'flashing-red';
  const yellowLit = active === 'yellow' || active === 'flashing-yellow';
  const greenLit = active === 'green';
  const redArrow = active === 'red-arrow-left';
  const greenArrow = active === 'green-arrow-left';
  const flashing = active === 'flashing-red' || active === 'flashing-yellow';

  const RED = '#ff2a1d';
  const YELLOW = '#ffd400';
  const GREEN = '#2ecc55';
  const DIM = '#2a2a2a';

  return (
    <SignSvg viewBox="0 0 60 140">
      <rect x="6" y="6" width="48" height="128" rx="6" fill="#1b1b1b" stroke={STROKE} strokeWidth="2" />
      {/* visors */}
      <rect x="8" y="22" width="44" height="4" fill="#000" />
      <rect x="8" y="62" width="44" height="4" fill="#000" />
      <rect x="8" y="102" width="44" height="4" fill="#000" />
      {/* red */}
      <circle
        cx="30"
        cy="34"
        r="14"
        fill={redLit || redArrow ? RED : DIM}
        opacity={redArrow ? 1 : redLit ? 1 : 0.6}
      >
        {flashing && redLit ? (
          <animate attributeName="opacity" values="1;0.15;1" dur="1s" repeatCount="indefinite" />
        ) : null}
      </circle>
      {redArrow ? (
        <path d="M 38 34 L 22 34 M 22 34 L 28 28 M 22 34 L 28 40" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : null}
      {/* yellow */}
      <circle
        cx="30"
        cy="74"
        r="14"
        fill={yellowLit ? YELLOW : DIM}
        opacity={yellowLit ? 1 : 0.6}
      >
        {flashing && yellowLit ? (
          <animate attributeName="opacity" values="1;0.15;1" dur="1s" repeatCount="indefinite" />
        ) : null}
      </circle>
      {/* green */}
      <circle
        cx="30"
        cy="114"
        r="14"
        fill={greenLit || greenArrow ? GREEN : DIM}
        opacity={greenArrow ? 1 : greenLit ? 1 : 0.6}
      />
      {greenArrow ? (
        <path d="M 38 114 L 22 114 M 22 114 L 28 108 M 22 114 L 28 120" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : null}
    </SignSvg>
  );
};

// ---------------------------------------------------------------------------
// Lane markings (driver's view, looking forward)
// ---------------------------------------------------------------------------

const RoadBackdrop = ({ children }: { children: ReactNode }) => (
  <SignSvg viewBox="0 0 120 120">
    <rect x="0" y="0" width="120" height="120" fill={ASPHALT} />
    {/* horizon hint */}
    <rect x="0" y="0" width="120" height="22" fill="#1f2933" />
    {children}
  </SignSvg>
);

const DashedLine = ({ x1, x2, y1, y2, color = ROAD_LINE_YELLOW, width = 4 }: { x1: number; x2: number; y1: number; y2: number; color?: string; width?: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray="8 8" strokeLinecap="butt" />
);

const SolidLine = ({ x1, x2, y1, y2, color = ROAD_LINE_YELLOW, width = 4 }: { x1: number; x2: number; y1: number; y2: number; color?: string; width?: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="butt" />
);

const LaneDashedYellow = () => (
  <RoadBackdrop>
    <DashedLine x1={60} y1={22} x2={60} y2={120} />
  </RoadBackdrop>
);

const LaneSolidYellowYourSide = () => (
  <RoadBackdrop>
    <SolidLine x1={60} y1={22} x2={60} y2={120} />
    <text x="92" y="80" textAnchor="middle" fontSize="9" fill="#f4f4f4" fontFamily="Arial, sans-serif">you →</text>
  </RoadBackdrop>
);

const LaneDoubleYellow = () => (
  <RoadBackdrop>
    <SolidLine x1={56} y1={22} x2={56} y2={120} />
    <SolidLine x1={64} y1={22} x2={64} y2={120} />
  </RoadBackdrop>
);

const LaneSolidLeftDashedRight = () => (
  <RoadBackdrop>
    <SolidLine x1={56} y1={22} x2={56} y2={120} />
    <DashedLine x1={64} y1={22} x2={64} y2={120} />
  </RoadBackdrop>
);

const LaneDashedLeftSolidRight = () => (
  <RoadBackdrop>
    <DashedLine x1={56} y1={22} x2={56} y2={120} />
    <SolidLine x1={64} y1={22} x2={64} y2={120} />
  </RoadBackdrop>
);

const LaneSolidWhite = () => (
  <RoadBackdrop>
    <SolidLine x1={60} y1={22} x2={60} y2={120} color={ROAD_LINE_WHITE} width={4} />
  </RoadBackdrop>
);

const LaneDashedWhite = () => (
  <RoadBackdrop>
    <DashedLine x1={60} y1={22} x2={60} y2={120} color={ROAD_LINE_WHITE} width={4} />
  </RoadBackdrop>
);

const LaneCenterTurnLane = () => (
  <RoadBackdrop>
    {/* left edge solid white */}
    <SolidLine x1={20} y1={22} x2={20} y2={120} color={ROAD_LINE_WHITE} />
    {/* left side of center turn lane: solid outside, dashed inside */}
    <SolidLine x1={48} y1={22} x2={48} y2={120} />
    <DashedLine x1={56} y1={22} x2={56} y2={120} />
    {/* right side of center turn lane: dashed inside, solid outside */}
    <DashedLine x1={64} y1={22} x2={64} y2={120} />
    <SolidLine x1={72} y1={22} x2={72} y2={120} />
    {/* right edge */}
    <SolidLine x1={100} y1={22} x2={100} y2={120} color={ROAD_LINE_WHITE} />
    {/* turn arrows */}
    <path d="M 60 70 L 60 50 M 60 50 L 54 56 M 60 50 L 66 56 L 58 50 L 60 50" stroke={ROAD_LINE_YELLOW} strokeWidth="2" fill="none" />
    <path d="M 60 100 L 60 120 M 60 120 L 54 114 M 60 120 L 66 114" stroke={ROAD_LINE_YELLOW} strokeWidth="2" fill="none" />
  </RoadBackdrop>
);

const LaneStopLine = () => (
  <RoadBackdrop>
    <DashedLine x1={60} y1={22} x2={60} y2={70} />
    <rect x="20" y="78" width="80" height="8" fill={ROAD_LINE_WHITE} />
  </RoadBackdrop>
);

const LaneCrosswalk = () => (
  <RoadBackdrop>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={22 + i * 13} y="64" width="9" height="36" fill={ROAD_LINE_WHITE} />
    ))}
  </RoadBackdrop>
);

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

const RENDERERS: Record<ExamImageKey, () => ReactNode> = {
  'sign:stop': StopSign,
  'sign:yield': YieldSign,
  'sign:do-not-enter': DoNotEnterSign,
  'sign:wrong-way': WrongWaySign,
  'sign:no-passing-zone': NoPassingZoneSign,
  'sign:no-u-turn': NoUTurnSign,
  'sign:no-left-turn': NoLeftTurnSign,
  'sign:no-right-turn': NoRightTurnSign,
  'sign:one-way-left': () => <OneWaySign direction="left" />,
  'sign:one-way-right': () => <OneWaySign direction="right" />,
  'sign:keep-right': KeepRightSign,
  'sign:right-lane-must-turn-right': RightLaneMustTurnRightSign,
  'sign:speed-limit-25': () => <SpeedLimitSign value={25} />,
  'sign:speed-limit-35': () => <SpeedLimitSign value={35} />,
  'sign:speed-limit-45': () => <SpeedLimitSign value={45} />,
  'sign:speed-limit-55': () => <SpeedLimitSign value={55} />,
  'sign:speed-limit-70': () => <SpeedLimitSign value={70} />,
  'sign:regulatory-blank': RegulatoryBlankSign,
  'sign:warning-blank': WarningBlank,
  'sign:curve-ahead': CurveAheadSign,
  'sign:merge': MergeSign,
  'sign:lane-ends': LaneEndsSign,
  'sign:deer-crossing': DeerCrossingSign,
  'sign:slippery-when-wet': SlipperyWhenWetSign,
  'sign:pedestrian-crossing': PedestrianCrossingSign,
  'sign:school-zone': SchoolZoneSign,
  'sign:traffic-signal-ahead': TrafficSignalAheadSign,
  'sign:two-way-traffic': TwoWayTrafficSign,
  'sign:school-bus-stop-ahead': SchoolBusStopAheadSign,
  'sign:stop-ahead': StopAheadSign,
  'sign:railroad-crossing-circular': RailroadCircularSign,
  'sign:railroad-crossbuck': RailroadCrossbuckSign,
  'sign:work-zone': WorkZoneSign,
  'sign:guide-service': GuideServiceSign,
  'sign:guide-recreation': GuideRecreationSign,
  'sign:guide-green': GuideGreenSign,
  'signal:red': () => <SignalHousing active="red" />,
  'signal:yellow': () => <SignalHousing active="yellow" />,
  'signal:green': () => <SignalHousing active="green" />,
  'signal:flashing-red': () => <SignalHousing active="flashing-red" />,
  'signal:flashing-yellow': () => <SignalHousing active="flashing-yellow" />,
  'signal:green-arrow-left': () => <SignalHousing active="green-arrow-left" />,
  'signal:red-arrow-left': () => <SignalHousing active="red-arrow-left" />,
  'signal:dark': () => <SignalHousing active="dark" />,
  'lane:dashed-yellow': LaneDashedYellow,
  'lane:solid-yellow-your-side': LaneSolidYellowYourSide,
  'lane:double-yellow': LaneDoubleYellow,
  'lane:solid-left-dashed-right': LaneSolidLeftDashedRight,
  'lane:dashed-left-solid-right': LaneDashedLeftSolidRight,
  'lane:solid-white': LaneSolidWhite,
  'lane:dashed-white': LaneDashedWhite,
  'lane:center-turn-lane': LaneCenterTurnLane,
  'lane:stop-line': LaneStopLine,
  'lane:crosswalk': LaneCrosswalk,
};

export interface ExamImageProps {
  imageKey: ExamImageKey;
  /** Override the screen-reader label. Defaults to the catalog's `visualDescription` so the answer isn't spoiled in quizzes. */
  alt?: string;
  /** Max width in px. The image scales down on narrow screens. */
  size?: number;
}

export function ExamImage({ imageKey, alt, size = 140 }: ExamImageProps) {
  const meta = EXAM_IMAGE_CATALOG[imageKey];
  const Render = RENDERERS[imageKey];
  if (!Render || !meta) return null;
  const ariaLabel = alt ?? meta.visualDescription;
  return (
    <Box
      role="img"
      aria-label={ariaLabel}
      sx={{
        width: '100%',
        maxWidth: size,
        aspectRatio: '1 / 1',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Render()}
    </Box>
  );
}
