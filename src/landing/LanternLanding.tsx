import { useMemo, type ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';
import { useThemeMode } from '../context/ThemeContext';
import { tokensFor } from '../theme/tokens';
import {
  DISPLAY_FONT,
  EASE_OUT,
  MONO_FONT,
  PAGE_WIDTH,
  UI_FONT,
  landingPalette,
  lightPool,
  ruledGround,
} from './theme';
import {
  useParallaxLayer,
  usePointerParallax,
  usePrefersReducedMotion,
  useReveal,
} from './useParallax';
import LanternMark from './LanternMark';
import { FIGURES, MARQUEE_ITEMS, STATS, TRUST } from './content';
import {
  DashboardMock,
  DiagnosticMock,
  FlashcardsMock,
  GuideReaderMock,
  SandboxMock,
  SearchMock,
} from './mockups';

interface Props {
  configured: boolean;
  onSignIn: () => void;
}

/* --------------------------------------------------------------- shared -- */

function MicrosoftGlyph({ size = 15 }: { size?: number }) {
  return (
    <Box component="svg" viewBox="0 0 20 20" sx={{ width: size, height: size, flexShrink: 0 }} aria-hidden>
      <rect x="1" y="1" width="8.4" height="8.4" fill="#F25022" />
      <rect x="10.6" y="1" width="8.4" height="8.4" fill="#7FBA00" />
      <rect x="1" y="10.6" width="8.4" height="8.4" fill="#00A4EF" />
      <rect x="10.6" y="10.6" width="8.4" height="8.4" fill="#FFB900" />
    </Box>
  );
}

type PaletteArg = ReturnType<typeof landingPalette>;

function SignInButton({
  p,
  configured,
  onSignIn,
  variant = 'solid',
}: {
  p: PaletteArg;
  configured: boolean;
  onSignIn: () => void;
  variant?: 'solid' | 'invert';
}) {
  const invert = variant === 'invert';
  return (
    <Box
      component="button"
      type="button"
      disabled={!configured}
      onClick={onSignIn}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 2.5,
        py: 1.25,
        border: 'none',
        borderRadius: '999px',
        cursor: configured ? 'pointer' : 'not-allowed',
        fontFamily: UI_FONT,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        color: invert ? p.rustDark : '#fff8ef',
        bgcolor: invert ? p.champagne : p.rust,
        opacity: configured ? 1 : 0.55,
        boxShadow: invert
          ? '0 10px 24px -10px rgba(200,165,105,0.6)'
          : `0 10px 26px -10px ${p.isDark ? 'rgba(0,0,0,0.6)' : 'rgba(92,42,74,0.5)'}`,
        transition: `transform 180ms ${EASE_OUT}, box-shadow 180ms ${EASE_OUT}, background-color 180ms ${EASE_OUT}`,
        '&:hover': configured
          ? { transform: 'translateY(-2px)', bgcolor: invert ? p.champagne : p.rustLight }
          : undefined,
        '&:active': configured ? { transform: 'translateY(0)' } : undefined,
        '&:focus-visible': { outline: `3px solid ${invert ? p.rustDark : p.champagne}`, outlineOffset: 3 },
      }}
    >
      <MicrosoftGlyph />
      Sign in with Microsoft
    </Box>
  );
}

function SectionShell({
  children,
  sx,
  id,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
  id?: string;
}) {
  return (
    <Box
      id={id}
      component="section"
      sx={[
        {
          position: 'relative',
          zIndex: 1,
          px: { xs: 3, md: 5 },
          mx: 'auto',
          maxWidth: PAGE_WIDTH,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

function FigureRow({
  p,
  figure,
  mock,
  flip,
}: {
  p: PaletteArg;
  figure: (typeof FIGURES)[number];
  mock: ReactNode;
  flip: boolean;
}) {
  const reveal = useReveal();
  const mockLayer = useParallaxLayer<HTMLDivElement>(flip ? 0.05 : 0.08);
  return (
    <Box
      ref={reveal}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 4, md: 7 },
        alignItems: 'center',
        py: { xs: 5, md: 7.5 },
      }}
    >
      <Box sx={{ order: { xs: 2, md: flip ? 2 : 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.25, mb: 2 }}>
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, letterSpacing: '0.14em', color: p.rust }}>
            {figure.n}
          </Typography>
          <Box sx={{ width: 28, height: '1px', bgcolor: p.ruleStrong }} />
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, letterSpacing: '0.1em', color: p.muted }}>
            {figure.kicker}
          </Typography>
        </Box>
        <Typography
          component="h2"
          sx={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 500,
            fontSize: { xs: '1.7rem', md: '2.05rem' },
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            color: p.ink,
            maxWidth: '18ch',
          }}
        >
          {figure.title}
        </Typography>
        <Typography sx={{ mt: 2, fontSize: 15.5, lineHeight: 1.7, color: p.inkSoft, maxWidth: '60ch' }}>
          {figure.body}
        </Typography>
        <Stack spacing={1.25} sx={{ mt: 2.5 }}>
          {figure.points.map((point) => (
            <Box key={point} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
              <Box
                sx={{
                  mt: '2px',
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: p.isDark ? 'rgba(220,184,122,0.16)' : 'rgba(200,165,105,0.22)',
                }}
              >
                <CheckRoundedIcon sx={{ fontSize: 11, color: p.isDark ? p.champagne : p.rust }} />
              </Box>
              <Typography sx={{ fontSize: 14, lineHeight: 1.55, color: p.inkSoft }}>{point}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ order: { xs: 1, md: flip ? 1 : 2 }, display: 'flex', justifyContent: 'center' }}>
        <Box ref={mockLayer} sx={{ width: '100%', maxWidth: 460, position: 'relative' }}>
          <CropTicks p={p} />
          {mock}
        </Box>
      </Box>
    </Box>
  );
}

function CropTicks({ p }: { p: PaletteArg }) {
  const tick = {
    position: 'absolute' as const,
    width: 12,
    height: 12,
    borderColor: p.ruleStrong,
    borderStyle: 'solid',
    pointerEvents: 'none' as const,
  };
  return (
    <>
      <Box sx={{ ...tick, top: -7, left: -7, borderWidth: '1px 0 0 1px' }} />
      <Box sx={{ ...tick, top: -7, right: -7, borderWidth: '1px 1px 0 0' }} />
      <Box sx={{ ...tick, bottom: -7, left: -7, borderWidth: '0 0 1px 1px' }} />
      <Box sx={{ ...tick, bottom: -7, right: -7, borderWidth: '0 1px 1px 0' }} />
    </>
  );
}

/* ----------------------------------------------------------------- page -- */

export default function LanternLanding({ configured, onSignIn }: Props) {
  const { mode, toggleMode, palette } = useThemeMode();
  const isDark = mode === 'dark';
  const p = useMemo(() => landingPalette(tokensFor(isDark, palette), isDark), [isDark, palette]);
  const reduced = usePrefersReducedMotion();

  const heroReveal = useReveal();
  const poolLayer = useParallaxLayer<HTMLDivElement>(0.05);
  const deviceLayer = useParallaxLayer<HTMLDivElement>(0.11);
  const noteLayer = useParallaxLayer<HTMLDivElement>(0.12);
  const pointer = usePointerParallax(true);

  const scrollToTour = () => {
    const el = document.getElementById('tour');
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <Box
      onPointerMove={pointer.onPointerMove}
      onPointerLeave={pointer.reset}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'clip',
        bgcolor: p.bg,
        color: p.ink,
        fontFamily: UI_FONT,
        '&::selection, & ::selection': {
          background: p.isDark ? 'rgba(220,184,122,0.32)' : 'rgba(200,165,105,0.4)',
          color: p.ink,
        },
        '& *::-webkit-scrollbar': { width: 10, height: 10 },
        '& *::-webkit-scrollbar-thumb': {
          background: p.ruleStrong,
          borderRadius: 999,
          border: `2px solid ${p.bg}`,
        },
      }}
    >
      {/* fixed ruled ground */}
      <Box
        aria-hidden
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: ruledGround(p),
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 90px)',
          pointerEvents: 'none',
        }}
      />
      {/* top-left crop tick for the whole page */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 74,
          left: { xs: 14, md: 30 },
          width: 16,
          height: 16,
          borderTop: `1.5px solid ${p.ruleStrong}`,
          borderLeft: `1.5px solid ${p.ruleStrong}`,
          zIndex: 1,
        }}
      />

      {/* ---------------------------------------------------------- nav -- */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          backgroundColor: p.isDark ? 'rgba(32,33,42,0.72)' : 'rgba(239,228,210,0.72)',
          borderBottom: `1px solid ${p.rule}`,
        }}
      >
        <Box
          sx={{
            maxWidth: PAGE_WIDTH,
            mx: 'auto',
            px: { xs: 3, md: 5 },
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <LanternMark p={p} size={26} />
          <Typography
            sx={{ fontFamily: DISPLAY_FONT, fontSize: '1.32rem', fontWeight: 600, letterSpacing: '-0.02em', color: p.ink }}
          >
            Lantern
          </Typography>
          <Box sx={{ width: '1px', height: 18, bgcolor: p.ruleStrong, mx: 0.5, display: { xs: 'none', sm: 'block' } }} />
          <Typography
            sx={{
              fontFamily: MONO_FONT,
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: p.muted,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Knowledge Base &amp; Study Hub
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Box
            component="button"
            type="button"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            onClick={toggleMode}
            sx={{
              display: 'grid',
              placeItems: 'center',
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid ${p.ruleStrong}`,
              bgcolor: 'transparent',
              color: p.inkSoft,
              cursor: 'pointer',
              '&:hover': { bgcolor: p.isDark ? 'rgba(245,239,227,0.06)' : 'rgba(92,42,74,0.06)' },
              '&:focus-visible': { outline: `3px solid ${p.rust}`, outlineOffset: 2 },
            }}
          >
            {isDark ? <LightModeOutlinedIcon sx={{ fontSize: 18 }} /> : <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />}
          </Box>
          <Box
            component="button"
            type="button"
            onClick={onSignIn}
            disabled={!configured}
            sx={{
              px: 1.75,
              py: 0.75,
              borderRadius: '999px',
              border: `1px solid ${p.rust}`,
              bgcolor: 'transparent',
              color: p.rust,
              fontFamily: UI_FONT,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: configured ? 'pointer' : 'not-allowed',
              opacity: configured ? 1 : 0.5,
              '&:hover': configured
                ? { bgcolor: p.isDark ? 'rgba(199,122,160,0.12)' : 'rgba(92,42,74,0.06)' }
                : undefined,
              '&:focus-visible': { outline: `3px solid ${p.rust}`, outlineOffset: 2 },
            }}
          >
            Sign in
          </Box>
        </Box>
      </Box>

      {/* --------------------------------------------------------- hero -- */}
      <SectionShell sx={{ pt: { xs: 5, md: 10 }, pb: { xs: 8, md: 6 } }}>
        <Box
          ref={heroReveal}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.04fr 0.96fr' },
            gap: { xs: 6, md: 6 },
            alignItems: 'center',
          }}
        >
          {/* left */}
          <Box>
            <Typography
              sx={{
                fontFamily: MONO_FONT,
                fontSize: 12,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: p.rust,
                mb: 2.5,
              }}
            >
              A private library, lit
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 500,
                fontSize: 'clamp(2.6rem, 6vw, 4.15rem)',
                lineHeight: 1.04,
                letterSpacing: '-0.025em',
                color: p.ink,
              }}
            >
              Every guide.
              <br />
              Every track.
              <br />
              <Box component="em" sx={{ fontStyle: 'italic', color: p.rust }}>
                One light.
              </Box>
            </Typography>
            <Typography sx={{ mt: 3, fontSize: 17, lineHeight: 1.7, color: p.inkSoft, maxWidth: '52ch' }}>
              Lantern is the independent Knowledge Base and Study Hub carried over from Hearth —
              every version-pinned guide and every study track, with your progress sealed to your
              Microsoft identity.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4, alignItems: { sm: 'center' } }}>
              <SignInButton p={p} configured={configured} onSignIn={onSignIn} />
              <Box
                component="button"
                type="button"
                onClick={scrollToTour}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: UI_FONT,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: p.inkSoft,
                  py: 1,
                  '&:hover .arr': { transform: 'translateY(3px)' },
                  '&:focus-visible': { outline: `3px solid ${p.rust}`, outlineOffset: 3, borderRadius: 4 },
                }}
              >
                See what’s inside
                <SouthRoundedIcon
                  className="arr"
                  sx={{ fontSize: 15, transition: `transform 200ms ${EASE_OUT}` }}
                />
              </Box>
            </Stack>

            <Typography sx={{ mt: 3, fontFamily: MONO_FONT, fontSize: 11.5, color: p.muted, lineHeight: 1.7 }}>
              {configured
                ? 'Microsoft Entra sign-in · progress isolated by tenant and user ID · no separate password'
                : 'Sign-in is not configured in this environment yet · set the Entra tenant, client, and API scope'}
            </Typography>
          </Box>

          {/* right — device cluster */}
          <Box sx={{ position: 'relative', minHeight: { md: 520 } }}>
            <Box
              ref={poolLayer}
              aria-hidden
              sx={{ position: 'absolute', inset: '-18% -22% -18% -10%', pointerEvents: 'none' }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: lightPool(p),
                  filter: 'blur(4px)',
                  transform: reduced
                    ? undefined
                    : `translate3d(${pointer.offset.x * -10}px, ${pointer.offset.y * -8}px, 0)`,
                  transition: 'transform 400ms ease-out',
                }}
              />
            </Box>
            <Box ref={deviceLayer} sx={{ position: 'relative' }}>
              <Box
                sx={{
                  transform: {
                    xs: 'none',
                    md: reduced
                      ? 'rotate(-1.4deg)'
                      : `rotate(-1.4deg) translate3d(${pointer.offset.x * 6}px, ${pointer.offset.y * 5}px, 0)`,
                  },
                  transition: 'transform 400ms ease-out',
                }}
              >
                <GuideReaderMock p={p} />
              </Box>
            </Box>

            {/* floating pinned chip */}
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                top: { xs: 6, md: -14 },
                right: { xs: 2, md: -8 },
                px: 1,
                py: 0.5,
                borderRadius: '7px',
                bgcolor: p.panel,
                border: `1px solid ${p.panelLine}`,
                boxShadow: p.isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(76,49,35,0.18)',
                fontFamily: MONO_FONT,
                fontSize: 10,
                color: p.muted,
              }}
            >
              content pinned · Hearth f0b05fc
            </Box>

            {/* marginalia note */}
            <Box
              ref={noteLayer}
              aria-hidden
              sx={{
                position: 'absolute',
                bottom: { md: -30 },
                left: { md: 18 },
                display: { xs: 'none', md: 'flex' },
                alignItems: 'flex-end',
                gap: 1,
              }}
            >
              <Box component="svg" viewBox="0 0 44 26" sx={{ width: 40, height: 24 }}>
                <path
                  d="M42 24C30 24 12 20 4 4M4 4l1 9M4 4l9 1"
                  fill="none"
                  stroke={p.rust}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: DISPLAY_FONT,
                  fontStyle: 'italic',
                  fontSize: 15,
                  color: p.rust,
                  transform: 'rotate(-3deg)',
                  textShadow: p.isDark ? 'none' : '0 1px 0 rgba(251,245,230,0.7)',
                }}
              >
                reads aloud — Azure Speech
              </Typography>
            </Box>
          </Box>
        </Box>
      </SectionShell>

      {/* ------------------------------------------------------- marquee -- */}
      <Box
        id="tour"
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: { xs: 2, md: 6 },
          py: 1.75,
          borderTop: `1px solid ${p.ruleStrong}`,
          borderBottom: `1px solid ${p.ruleStrong}`,
          overflow: 'hidden',
          bgcolor: p.isDark ? 'rgba(245,239,227,0.03)' : 'rgba(251,245,230,0.5)',
          maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            gap: 0,
            animation: reduced ? 'none' : 'lanternMarquee 68s linear infinite',
            '&:hover': { animationPlayState: 'paused' },
            '@keyframes lanternMarquee': { to: { transform: 'translateX(-50%)' } },
          }}
        >
          {[0, 1].map((copy) => (
            <Box key={copy} sx={{ display: 'flex', flexShrink: 0 }} aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map((item, i) => (
                <Box key={`${copy}-${item}-${i}`} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      fontFamily: MONO_FONT,
                      fontSize: 12,
                      letterSpacing: '0.02em',
                      color: p.inkSoft,
                      whiteSpace: 'nowrap',
                      px: 2,
                    }}
                  >
                    {item}
                  </Typography>
                  <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: p.champagne, flexShrink: 0 }} />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* --------------------------------------------------------- stats -- */}
      <SectionShell sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            borderTop: `1px solid ${p.ruleStrong}`,
          }}
        >
          {STATS.map((stat, i) => (
            <Box
              key={stat.label}
              sx={{
                px: { xs: 2, md: 3 },
                py: 3,
                borderLeft: { md: i === 0 ? 'none' : `1px solid ${p.rule}` },
                borderTop: { xs: i > 1 ? `1px solid ${p.rule}` : 'none', md: 'none' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 500,
                  fontSize: 'clamp(1.7rem, 3vw, 2.3rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: p.rust,
                }}
              >
                {stat.value}
              </Typography>
              <Typography sx={{ mt: 1.25, fontSize: 13, lineHeight: 1.55, color: p.inkSoft }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </SectionShell>

      {/* ------------------------------------------------------ figures -- */}
      <SectionShell>
        <FigureRow p={p} figure={FIGURES[0]} mock={<GuideReaderMock p={p} />} flip={false} />
        <FigureRow p={p} figure={FIGURES[1]} mock={<SearchMock p={p} />} flip />
        <FigureRow p={p} figure={FIGURES[2]} mock={<DiagnosticMock p={p} />} flip={false} />
      </SectionShell>

      {/* quiet beat */}
      <SectionShell sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          sx={{
            fontFamily: DISPLAY_FONT,
            fontStyle: 'italic',
            fontWeight: 400,
            textAlign: 'center',
            fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)',
            lineHeight: 1.4,
            color: p.inkSoft,
            maxWidth: '24ch',
            mx: 'auto',
          }}
        >
          Preserve learning outcomes before improving architecture.
        </Typography>
      </SectionShell>

      <SectionShell>
        <FigureRow p={p} figure={FIGURES[3]} mock={<FlashcardsMock p={p} />} flip />
        <FigureRow p={p} figure={FIGURES[4]} mock={<SandboxMock p={p} />} flip={false} />
        <FigureRow p={p} figure={FIGURES[5]} mock={<DashboardMock p={p} />} flip />
      </SectionShell>

      {/* --------------------------------------------------------- trust -- */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          borderTop: `1px solid ${p.ruleStrong}`,
          borderBottom: `1px solid ${p.ruleStrong}`,
          bgcolor: p.isDark ? 'rgba(245,239,227,0.03)' : 'rgba(251,245,230,0.5)',
        }}
      >
        <Box
          sx={{
            maxWidth: PAGE_WIDTH,
            mx: 'auto',
            px: { xs: 3, md: 5 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          }}
        >
          {TRUST.map((item, i) => (
            <Box
              key={item.head}
              sx={{
                px: { xs: 2, md: 3 },
                py: { xs: 3, md: 4 },
                borderLeft: { md: i === 0 ? 'none' : `1px solid ${p.rule}` },
                borderTop: { xs: i > 1 ? `1px solid ${p.rule}` : 'none', md: 'none' },
              }}
            >
              <Typography sx={{ fontFamily: DISPLAY_FONT, fontSize: '1.05rem', fontWeight: 600, color: p.ink }}>
                {item.head}
              </Typography>
              <Typography sx={{ mt: 1, fontSize: 12.5, lineHeight: 1.6, color: p.inkSoft }}>
                {item.body}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* --------------------------------------------------------- close -- */}
      <ClosingCta p={p} configured={configured} onSignIn={onSignIn} />

      {/* -------------------------------------------------------- footer -- */}
      <Box
        component="footer"
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: PAGE_WIDTH,
          mx: 'auto',
          px: { xs: 3, md: 5 },
          py: 4,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanternMark p={p} size={18} animate={false} />
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, color: p.muted }}>
            Lantern · independent Knowledge Base &amp; Study Hub · v0.1.0
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, color: p.muted }}>
          Content pinned from Hearth 2.13.2
        </Typography>
      </Box>
    </Box>
  );
}

function ClosingCta({ p, configured, onSignIn }: { p: PaletteArg; configured: boolean; onSignIn: () => void }) {
  const reveal = useReveal();
  const glow = useParallaxLayer<HTMLDivElement>(0.06);
  return (
    <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 5 }, py: { xs: 6, md: 10 } }}>
      <Box
        ref={reveal}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: PAGE_WIDTH,
          mx: 'auto',
          borderRadius: '20px',
          px: { xs: 4, md: 10 },
          py: { xs: 7, md: 11 },
          textAlign: 'center',
          bgcolor: p.rustDark,
          border: `1px solid ${p.isDark ? 'rgba(220,184,122,0.2)' : p.rust}`,
        }}
      >
        <Box
          ref={glow}
          aria-hidden
          sx={{
            position: 'absolute',
            inset: '-30% 0 -30% 0',
            background:
              'radial-gradient(40% 50% at 50% 40%, rgba(220,184,122,0.32) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <LanternMark p={{ ...p, isDark: true }} size={40} />
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 500,
              fontSize: 'clamp(2rem, 5vw, 3.1rem)',
              letterSpacing: '-0.02em',
              color: '#fbf5e6',
            }}
          >
            Pick up the lantern.
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontSize: 16,
              lineHeight: 1.7,
              color: 'rgba(251,245,230,0.78)',
              maxWidth: '46ch',
              mx: 'auto',
            }}
          >
            One Microsoft sign-in brings back every guide, every track, and the exact section or
            question you stopped on.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <SignInButton p={p} configured={configured} onSignIn={onSignIn} variant="invert" />
          </Box>
          <Typography sx={{ mt: 2.5, fontFamily: MONO_FONT, fontSize: 11, color: 'rgba(251,245,230,0.6)' }}>
            {configured ? 'Redirects to Microsoft, then straight to your hub' : 'Configure Entra to enable sign-in'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
