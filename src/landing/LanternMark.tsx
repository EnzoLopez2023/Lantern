import { Box } from '@mui/material';
import type { LandingPalette } from './theme';

interface Props {
  p: LandingPalette;
  size?: number;
  animate?: boolean;
}

/** A carried lantern: wine casing, a champagne flame that breathes unless motion is reduced. */
export default function LanternMark({ p, size = 30, animate = true }: Props) {
  const flame = p.champagne;
  const casing = p.isDark ? p.ink : p.rust;
  return (
    <Box
      component="svg"
      viewBox="0 0 40 44"
      role="img"
      aria-label="Lantern"
      sx={{
        width: size,
        height: (size * 44) / 40,
        display: 'block',
        flexShrink: 0,
        '@media (prefers-reduced-motion: no-preference)': animate
          ? { '& .flame': { animation: 'lanternFlicker 3.2s ease-in-out infinite' } }
          : undefined,
        '@keyframes lanternFlicker': {
          '0%, 100%': { opacity: 0.92, transform: 'scaleY(1) translateY(0)' },
          '38%': { opacity: 1, transform: 'scaleY(1.09) translateY(-0.4px)' },
          '62%': { opacity: 0.85, transform: 'scaleY(0.97) translateY(0.3px)' },
        },
      }}
    >
      <defs>
        <radialGradient id="lanternGlow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor={flame} stopOpacity="0.55" />
          <stop offset="100%" stopColor={flame} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="22" r="18" fill="url(#lanternGlow)" />
      {/* bail */}
      <path d="M14 8c0-4 12-4 12 0" fill="none" stroke={casing} strokeWidth="2" strokeLinecap="round" />
      {/* cap */}
      <path d="M12 10h16l-2.4 3.4H14.4z" fill={casing} />
      {/* body frame */}
      <path
        d="M13.6 13.6h12.8l1.2 18.2a2 2 0 0 1-2 2.1H14.4a2 2 0 0 1-2-2.1z"
        fill="none"
        stroke={casing}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* base */}
      <rect x="12.4" y="34.4" width="15.2" height="3.4" rx="1.2" fill={casing} />
      {/* flame */}
      <path
        className="flame"
        d="M20 17.4c2.7 2 4 4.2 4 6.6a4 4 0 1 1-8 0c0-1.3.5-2.6 1.5-3.8.3 1 .9 1.7 1.7 2 0-1.8.3-3.4 2.8-4.8z"
        fill={flame}
        style={{ transformOrigin: '20px 27px' }}
      />
      <circle cx="20" cy="24.4" r="1.6" fill={p.isDark ? '#fff6e6' : '#fffdf6'} opacity="0.9" />
    </Box>
  );
}
