import type { HearthTokens } from '../theme/tokens';

/** Display voice for the marketing surface — a bookish screen serif, not the app's system Georgia. */
export const DISPLAY_FONT = '"Spectral", Georgia, "Times New Roman", serif';
/** UI voice, matched to the product chrome shown inside the mockups. */
export const UI_FONT =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace';

export const PAGE_WIDTH = 1200;

export interface LandingPalette extends HearthTokens {
  isDark: boolean;
  /** warm lamplight used for the hero light-pool and glows */
  glow: string;
  glowSoft: string;
  /** hairline for ruled ground */
  rule: string;
  ruleStrong: string;
  /** panel fill for product mockups */
  panel: string;
  panelSoft: string;
  panelLine: string;
}

export function landingPalette(t: HearthTokens, isDark: boolean): LandingPalette {
  return {
    ...t,
    isDark,
    glow: isDark ? 'rgba(220, 184, 122, 0.34)' : 'rgba(200, 165, 105, 0.52)',
    glowSoft: isDark ? 'rgba(199, 122, 160, 0.2)' : 'rgba(140, 79, 113, 0.2)',
    rule: isDark ? 'rgba(220, 184, 122, 0.07)' : 'rgba(92, 42, 74, 0.06)',
    ruleStrong: isDark ? 'rgba(220, 184, 122, 0.16)' : 'rgba(92, 42, 74, 0.16)',
    panel: isDark ? '#33343f' : '#fffaf0',
    panelSoft: isDark ? '#2b2c35' : '#f7eeda',
    panelLine: isDark ? 'rgba(245, 239, 227, 0.12)' : 'rgba(92, 42, 74, 0.12)',
  };
}

/**
 * The full-bleed ruled-ledger ground: a wine margin rule down the left, faint
 * manuscript horizontal rules, and a wide champagne baseline grid.
 */
export function ruledGround(p: LandingPalette): string {
  const h = p.rule;
  const v = p.rule;
  return [
    `linear-gradient(${p.ruleStrong}, ${p.ruleStrong}) 88px 0 / 1.5px 100% no-repeat`,
    `repeating-linear-gradient(to bottom, ${h} 0 1px, transparent 1px 34px)`,
    `repeating-linear-gradient(to right, ${v} 0 1px, transparent 1px 136px)`,
  ].join(', ');
}

export function lightPool(p: LandingPalette): string {
  return `radial-gradient(46% 42% at 62% 40%, ${p.glow} 0%, transparent 70%), radial-gradient(60% 60% at 30% 80%, ${p.glowSoft} 0%, transparent 72%)`;
}

export const panelShadow = (isDark: boolean, lifted = false): string => {
  if (isDark) {
    return lifted
      ? '0 40px 80px -24px rgba(0,0,0,0.6), 0 12px 28px -12px rgba(0,0,0,0.5)'
      : '0 24px 56px -20px rgba(0,0,0,0.55), 0 6px 16px -8px rgba(0,0,0,0.4)';
  }
  return lifted
    ? '0 44px 80px -28px rgba(76,49,35,0.34), 0 14px 30px -14px rgba(76,49,35,0.22)'
    : '0 26px 54px -24px rgba(76,49,35,0.26), 0 8px 18px -10px rgba(76,49,35,0.16)';
};

export const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';
