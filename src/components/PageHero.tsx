import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useThemeMode } from '../context/ThemeContext';
import { tokensFor } from '../theme/tokens';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  accentPhrase?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  compact?: boolean;
}

export default function PageHero({
  eyebrow,
  title,
  accentPhrase,
  subtitle,
  actions,
  compact = false,
}: PageHeroProps) {
  const { mode, palette } = useThemeMode();
  const t = tokensFor(mode === 'dark', palette);
  const segments = accentPhrase && title.includes(accentPhrase)
    ? title.split(accentPhrase)
    : null;

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: 3,
        py: compact ? 2 : { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: 720 }}>
        <Typography sx={{ color: t.rust, fontWeight: 800, letterSpacing: '.16em', fontSize: '.72rem', textTransform: 'uppercase' }}>
          {eyebrow}
        </Typography>
        <Typography component="h1" sx={{ mt: 1, color: t.ink, fontFamily: 'var(--hearth-heading)', fontSize: { xs: '2rem', md: '2.7rem' }, fontWeight: 700, lineHeight: 1.12 }}>
          {segments ? <>{segments[0]}<Box component="span" sx={{ color: t.rust }}>{accentPhrase}</Box>{segments.slice(1).join(accentPhrase)}</> : title}
        </Typography>
        {subtitle && <Typography sx={{ mt: 1.5, color: t.inkSoft, lineHeight: 1.7, maxWidth: '68ch' }}>{subtitle}</Typography>}
      </Box>
      {actions}
    </Box>
  );
}
