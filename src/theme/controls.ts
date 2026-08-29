import type { SxProps, Theme } from '@mui/material/styles';

export const CARD_RADIUS = '14px';
export const SHAPE_BORDER_RADIUS = 7;
export const PAGE_MAX_WIDTH = 1280;

export const pageShellSx = (wide = false): SxProps<Theme> => ({
  width: '100%',
  maxWidth: wide ? 1600 : PAGE_MAX_WIDTH,
  mx: 'auto',
  px: { xs: 2, sm: 3, lg: 4 },
  py: { xs: 2, md: 3 },
});

export const cardShadow = (isDark: boolean) =>
  isDark ? '0 12px 32px rgba(0,0,0,.24)' : '0 10px 28px rgba(76,49,35,.10)';

export const cardShadowHover = (isDark: boolean) =>
  isDark ? '0 16px 40px rgba(0,0,0,.32)' : '0 14px 36px rgba(76,49,35,.16)';
