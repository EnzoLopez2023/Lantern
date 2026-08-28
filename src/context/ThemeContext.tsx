import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { tokensFor, type PaletteName } from '../theme/tokens';
import { CARD_RADIUS, SHAPE_BORDER_RADIUS, cardShadow, cardShadowHover } from '../theme/controls';

type Mode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: Mode;
  toggleMode: () => void;
  palette: PaletteName;
  setPalette: (palette: PaletteName) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  toggleMode: () => undefined,
  palette: 'wine',
  setPalette: () => undefined,
});

// The hook intentionally lives beside its provider to preserve Hearth's public import.
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(ThemeModeContext);

const readMode = (): Mode => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem('lantern:theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(readMode);
  const [palette, setPalette] = useState<PaletteName>('wine');
  const isDark = mode === 'dark';
  const t = tokensFor(isDark, palette);

  const toggleMode = useCallback(() => {
    setMode(previous => {
      const next = previous === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('lantern:theme', next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: t.rust, light: t.rustLight, dark: t.rustDark },
      secondary: { main: t.champagne },
      background: { default: t.bg, paper: t.paper },
      text: { primary: t.ink, secondary: t.muted },
      divider: t.line,
    },
    shape: { borderRadius: SHAPE_BORDER_RADIUS },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700 },
      h2: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700 },
      h3: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            '--hearth-heading': 'Georgia, "Times New Roman", serif',
            '--hearth-body': 'Inter, ui-sans-serif, system-ui, sans-serif',
            '--card-shadow': cardShadow(isDark),
            '--card-shadow-hover': cardShadowHover(isDark),
          },
          body: {
            minHeight: '100vh',
            background: isDark
              ? 'radial-gradient(circle at 85% 0%, rgba(199,122,160,.12), transparent 34%), #20212a'
              : 'radial-gradient(circle at 85% 0%, rgba(200,165,105,.18), transparent 34%), #efe4d2',
          },
        },
      },
      MuiButton: {
        styleOverrides: { root: { borderRadius: 999, textTransform: 'none' } },
        defaultProps: { disableElevation: true },
      },
      MuiCard: {
        styleOverrides: { root: { borderRadius: CARD_RADIUS, backgroundImage: 'none' } },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
    },
  }), [isDark, mode, t]);

  const value = useMemo(
    () => ({ mode, toggleMode, palette, setPalette }),
    [mode, toggleMode, palette],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
