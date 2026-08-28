export type PaletteName = 'wine' | 'scholar';

export interface HearthTokens {
  bg: string;
  paper: string;
  surface: string;
  line: string;
  ink: string;
  inkSoft: string;
  muted: string;
  rust: string;
  rustLight: string;
  rustDark: string;
  champagne: string;
}

const light: HearthTokens = {
  bg: '#efe4d2',
  paper: '#fbf5e6',
  surface: '#f6ecd9',
  line: '#ddcba8',
  ink: '#2d1b26',
  inkSoft: '#564348',
  muted: '#6e5e40',
  rust: '#5c2a4a',
  rustLight: '#8c4f71',
  rustDark: '#3f1a33',
  champagne: '#c8a569',
};

const dark: HearthTokens = {
  bg: '#20212a',
  paper: '#2e2f38',
  surface: '#282932',
  line: '#454650',
  ink: '#f5efe3',
  inkSoft: '#d8d0c5',
  muted: '#b8b3be',
  rust: '#c77aa0',
  rustLight: '#e1a8c3',
  rustDark: '#9e5c84',
  champagne: '#dcb87a',
};

export const tokensFor = (isDark: boolean, palette: PaletteName = 'wine'): HearthTokens => {
  void palette;
  return isDark ? dark : light;
};

export const tokens = tokensFor;
