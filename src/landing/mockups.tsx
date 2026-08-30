import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import type { LandingPalette } from './theme';
import { MONO_FONT, UI_FONT, panelShadow } from './theme';

/* ------------------------------------------------------------------ frame - */

interface FrameProps {
  p: LandingPalette;
  tab: string;
  children: ReactNode;
  lifted?: boolean;
  maxWidth?: number;
}

export function MockFrame({ p, tab, children, lifted, maxWidth }: FrameProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth,
        fontFamily: UI_FONT,
        bgcolor: p.panel,
        border: `1px solid ${p.panelLine}`,
        borderRadius: '14px',
        boxShadow: panelShadow(p.isDark, lifted),
        overflow: 'hidden',
        color: p.ink,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.75,
          height: 38,
          borderBottom: `1px solid ${p.panelLine}`,
          bgcolor: p.panelSoft,
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.6 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: p.panelLine }} />
          ))}
        </Box>
        <Typography
          sx={{
            fontFamily: MONO_FONT,
            fontSize: 11,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: p.muted,
            ml: 0.5,
          }}
        >
          {tab}
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>{children}</Box>
    </Box>
  );
}

/* ----------------------------------------------------------------- atoms -- */

function Tag({ p, children }: { p: LandingPalette; children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        fontFamily: MONO_FONT,
        fontSize: 10.5,
        letterSpacing: '0.03em',
        px: 0.75,
        py: '2px',
        borderRadius: '5px',
        color: p.rust,
        bgcolor: p.isDark ? 'rgba(199,122,160,0.14)' : 'rgba(92,42,74,0.08)',
      }}
    >
      {children}
    </Box>
  );
}

function Line({ p, w = '100%', dim = false }: { p: LandingPalette; w?: number | string; dim?: boolean }) {
  return (
    <Box
      sx={{
        height: 7,
        width: w,
        borderRadius: 3,
        bgcolor: p.panelLine,
        opacity: dim ? 0.55 : 1,
      }}
    />
  );
}

function Bar({
  p,
  label,
  value,
  weak = false,
}: {
  p: LandingPalette;
  label: string;
  value: number;
  weak?: boolean;
}) {
  const fill = weak ? p.rustLight : p.champagne;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: 12, color: p.inkSoft }}>{label}</Typography>
        <Typography sx={{ fontSize: 12, fontFamily: MONO_FONT, color: weak ? p.rust : p.muted }}>
          {value}%{weak ? ' · weak' : ''}
        </Typography>
      </Box>
      <Box sx={{ height: 8, borderRadius: 4, bgcolor: p.panelSoft, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${value}%`, borderRadius: 4, bgcolor: fill }} />
      </Box>
    </Box>
  );
}

/* -------------------------------------------------------------- FIG. 01 -- */

export function GuideReaderMock({ p }: { p: LandingPalette }) {
  return (
    <MockFrame p={p} tab="knowledge-base / jwt-validation">
      <Stack spacing={1.75}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Tag p={p}>v2.13.2 · pinned</Tag>
          <Tag p={p}>auth</Tag>
          <Tag p={p}>12 min</Tag>
        </Box>
        <Typography sx={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Validating a bearer token
        </Typography>
        <Stack spacing={0.75}>
          <Line p={p} />
          <Line p={p} w="94%" />
          <Line p={p} w="88%" dim />
        </Stack>

        <Box
          sx={{
            border: `1px solid ${p.panelLine}`,
            borderRadius: '10px',
            p: 1.5,
            bgcolor: p.isDark ? 'rgba(199,122,160,0.08)' : 'rgba(200,165,105,0.12)',
          }}
        >
          <Typography
            sx={{ fontFamily: MONO_FONT, fontSize: 10, letterSpacing: '0.08em', color: p.rust, mb: 0.5 }}
          >
            ANALOGY
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: p.inkSoft, lineHeight: 1.55 }}>
            The signing key is the wax seal. You don’t trust the letter because it arrived — you
            trust it because the seal still matches the ring.
          </Typography>
        </Box>

        {/* inline diagram */}
        <Box
          sx={{
            border: `1px solid ${p.panelLine}`,
            borderRadius: '10px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          {['request', 'JWKS', 'verify', 'claims'].map((node, i, arr) => (
            <Box key={node} sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              <Box
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  fontFamily: MONO_FONT,
                  fontSize: 10.5,
                  color: p.inkSoft,
                  py: 0.75,
                  borderRadius: '7px',
                  border: `1px solid ${p.panelLine}`,
                  bgcolor: p.panelSoft,
                }}
              >
                {node}
              </Box>
              {i < arr.length - 1 && (
                <Box sx={{ color: p.muted, fontSize: 12, lineHeight: 1 }}>→</Box>
              )}
            </Box>
          ))}
        </Box>

        {/* checklist */}
        <Stack spacing={0.75}>
          {[
            ['Fetch the JWKS and cache each key by id', true],
            ['Check issuer, audience, and expiry every request', true],
            ['Reject “alg: none” and unexpected algorithms', false],
          ].map(([text, done]) => (
            <Box key={text as string} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '5px',
                  border: `1.5px solid ${done ? p.champagne : p.panelLine}`,
                  bgcolor: done ? p.champagne : 'transparent',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                {done && <CheckRoundedIcon sx={{ fontSize: 12, color: p.isDark ? '#20212a' : '#3f1a33' }} />}
              </Box>
              <Typography
                sx={{ fontSize: 12, color: done ? p.muted : p.inkSoft, textDecoration: done ? 'line-through' : 'none' }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* TTS bar */}
        <Box
          sx={{
            mt: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            p: 1,
            borderRadius: '999px',
            border: `1px solid ${p.panelLine}`,
            bgcolor: p.panelSoft,
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              bgcolor: p.rust,
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ height: 4, borderRadius: 2, bgcolor: p.panelLine, position: 'relative' }}>
              <Box sx={{ position: 'absolute', inset: 0, width: '22%', borderRadius: 2, bgcolor: p.champagne }} />
              <Box
                sx={{
                  position: 'absolute',
                  left: '22%',
                  top: '50%',
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  bgcolor: p.champagne,
                  transform: 'translate(-50%,-50%)',
                }}
              />
            </Box>
          </Box>
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 10.5, color: p.muted, whiteSpace: 'nowrap' }}>
            0:42 / 3:18
          </Typography>
          <GraphicEqRoundedIcon sx={{ fontSize: 15, color: p.rust }} />
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 10, color: p.muted, whiteSpace: 'nowrap' }}>
            JennyNeural
          </Typography>
        </Box>
      </Stack>
    </MockFrame>
  );
}

/* -------------------------------------------------------------- FIG. 02 -- */

export function SearchMock({ p }: { p: LandingPalette }) {
  const mark = (text: string, stem: string) => {
    const re = new RegExp(`${stem}\\w*`, 'i');
    const m = re.exec(text);
    if (!m) return text;
    const idx = m.index;
    const end = idx + m[0].length;
    return (
      <>
        {text.slice(0, idx)}
        <Box
          component="mark"
          sx={{
            bgcolor: p.isDark ? 'rgba(220,184,122,0.28)' : 'rgba(200,165,105,0.4)',
            color: 'inherit',
            borderRadius: '3px',
            px: '2px',
          }}
        >
          {text.slice(idx, end)}
        </Box>
        {text.slice(end)}
      </>
    );
  };
  const results = [
    {
      title: 'Azure Key Vault Patterns',
      sentence: 'Rotate signing keys on a schedule and keep the previous version live until tokens expire.',
      tags: ['secrets', 'rotation'],
      current: true,
    },
    {
      title: 'JWT Validation',
      sentence: 'When keys rotate, the `kid` header tells you which JWKS entry to verify against.',
      tags: ['auth', 'jwks'],
      current: false,
    },
    {
      title: 'Entra ID Deep Dive',
      sentence: 'Microsoft rotates platform signing keys regularly; never pin a single key by value.',
      tags: ['entra', 'oidc'],
      current: false,
    },
  ];
  return (
    <MockFrame p={p} tab="knowledge-base / search">
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.25,
            py: 1,
            borderRadius: '10px',
            border: `1.5px solid ${p.rust}`,
            bgcolor: p.panelSoft,
          }}
        >
          <SearchRoundedIcon sx={{ fontSize: 17, color: p.rust }} />
          <Typography sx={{ fontSize: 13, color: p.ink }}>rotate signing keys</Typography>
          <Box sx={{ width: 1.5, height: 15, bgcolor: p.rust, ml: 0.25, animation: 'lanternCaret 1.1s step-end infinite', '@keyframes lanternCaret': { '50%': { opacity: 0 } } }} />
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 10, color: p.muted }}>18 hits</Typography>
        </Box>

        {results.map((r) => (
          <Box
            key={r.title}
            sx={{
              p: 1.25,
              borderRadius: '10px',
              border: `1px solid ${r.current ? p.rust : p.panelLine}`,
              bgcolor: r.current ? (p.isDark ? 'rgba(199,122,160,0.08)' : 'rgba(200,165,105,0.09)') : 'transparent',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{r.title}</Typography>
              <Box sx={{ flex: 1 }} />
              {r.current && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: p.muted }}>
                  <KeyboardReturnRoundedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontFamily: MONO_FONT, fontSize: 10 }}>open</Typography>
                </Box>
              )}
            </Box>
            <Typography sx={{ fontSize: 12, color: p.inkSoft, lineHeight: 1.5 }}>
              {mark(r.sentence, 'rotat')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.75 }}>
              {r.tags.map((t) => (
                <Tag key={t} p={p}>
                  #{t}
                </Tag>
              ))}
            </Box>
          </Box>
        ))}

        <Typography sx={{ fontFamily: MONO_FONT, fontSize: 10, color: p.muted, textAlign: 'center' }}>
          ↑ ↓ to move · ⏎ to open · esc to close
        </Typography>
      </Stack>
    </MockFrame>
  );
}

/* -------------------------------------------------------------- FIG. 03 -- */

export function DiagnosticMock({ p }: { p: LandingPalette }) {
  return (
    <MockFrame p={p} tab="study-hub / algebra-2 / diagnostic">
      <Stack spacing={1.75}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700 }}>Algebra 2</Typography>
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, color: p.muted }}>36 questions · 4 domains</Typography>
        </Box>

        <Stack spacing={1.1}>
          <Bar p={p} label="Functions & Modeling" value={78} />
          <Bar p={p} label="Polynomials & Rationals" value={61} />
          <Bar p={p} label="Trigonometry" value={44} weak />
          <Bar p={p} label="Statistics & Probability" value={69} />
        </Stack>

        <Box sx={{ borderTop: `1px solid ${p.panelLine}`, pt: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography sx={{ fontSize: 12, color: p.inkSoft }}>Estimated scaled score</Typography>
            <Typography sx={{ fontFamily: MONO_FONT, fontSize: 12, color: p.muted }}>pass = 70</Typography>
          </Box>
          <Box sx={{ position: 'relative', height: 30 }}>
            <Box sx={{ position: 'absolute', top: 13, left: 0, right: 0, height: 4, borderRadius: 2, bgcolor: p.panelSoft }} />
            <Box sx={{ position: 'absolute', top: 13, left: 0, width: '66%', height: 4, borderRadius: 2, bgcolor: p.rustLight }} />
            {/* pass marker */}
            <Box sx={{ position: 'absolute', top: 6, left: '70%', width: 2, height: 18, bgcolor: p.muted }} />
            <Typography sx={{ position: 'absolute', top: 0, left: '70%', transform: 'translateX(-50%)', fontFamily: MONO_FONT, fontSize: 9, color: p.muted }}>
              70
            </Typography>
            {/* you marker */}
            <Box
              sx={{
                position: 'absolute',
                top: 9,
                left: '66%',
                transform: 'translateX(-50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: p.rust,
                border: `2px solid ${p.panel}`,
              }}
            />
          </Box>
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 22, fontWeight: 700, color: p.rust, mt: 0.5 }}>
            66<Box component="span" sx={{ fontSize: 12, color: p.muted }}> / 100</Box>
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            borderRadius: '8px',
            border: `1px solid ${p.panelLine}`,
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: p.rustLight, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 12, color: p.inkSoft }}>
            Not ready yet — Trigonometry is holding the estimate below the line. Next practice set is
            weighted toward it.
          </Typography>
        </Box>
      </Stack>
    </MockFrame>
  );
}

/* -------------------------------------------------------------- FIG. 04 -- */

export function FlashcardsMock({ p }: { p: LandingPalette }) {
  return (
    <MockFrame p={p} tab="study-hub / algebra-2 / flashcards">
      <Stack spacing={1.75}>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          <Tag p={p}>New 12</Tag>
          <Tag p={p}>Learning 7</Tag>
          <Tag p={p}>Review 41</Tag>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, color: p.rust }}>due today · 18</Typography>
        </Box>

        {/* card stack */}
        <Box sx={{ position: 'relative', height: 150 }}>
          <Box
            sx={{
              position: 'absolute',
              inset: '10px 18px 0 6px',
              borderRadius: '12px',
              border: `1px solid ${p.panelLine}`,
              bgcolor: p.panelSoft,
              transform: 'rotate(3deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: '4px 10px 6px 2px',
              borderRadius: '12px',
              border: `1px solid ${p.panelLine}`,
              bgcolor: p.panelSoft,
              transform: 'rotate(-2deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: '0 6px 12px 0',
              borderRadius: '12px',
              border: `1px solid ${p.rust}`,
              bgcolor: p.panel,
              p: 1.75,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: panelShadow(p.isDark),
            }}
          >
            <Typography sx={{ fontFamily: MONO_FONT, fontSize: 9.5, letterSpacing: '0.08em', color: p.muted }}>
              FRONT
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: p.ink, lineHeight: 1.5 }}>
              A polynomial’s end behavior is determined by…
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: p.rust }}>
              … the degree and sign of its leading term. ↵ flip
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {[
            ['Again', '<1m'],
            ['Hard', '2d'],
            ['Good', '4d'],
            ['Easy', '9d'],
          ].map(([label, when], i) => (
            <Box
              key={label}
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 0.75,
                borderRadius: '8px',
                border: `1px solid ${i === 2 ? p.champagne : p.panelLine}`,
                bgcolor: i === 2 ? (p.isDark ? 'rgba(220,184,122,0.12)' : 'rgba(200,165,105,0.16)') : 'transparent',
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: p.inkSoft }}>{label}</Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: 9.5, color: p.muted }}>{when}</Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </MockFrame>
  );
}

/* -------------------------------------------------------------- FIG. 05 -- */

export function SandboxMock({ p }: { p: LandingPalette }) {
  const answered = new Set([1, 2, 3, 5, 6, 8, 9, 10, 12, 13]);
  const flagged = new Set([7, 11]);
  const current = 14;
  return (
    <MockFrame p={p} tab="study-hub / biology-1 / sandbox">
      <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.4,
                borderRadius: '999px',
                bgcolor: p.isDark ? 'rgba(199,122,160,0.14)' : 'rgba(92,42,74,0.08)',
              }}
            >
              <TimerOutlinedIcon sx={{ fontSize: 14, color: p.rust }} />
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: 12, color: p.rust }}>58:12</Typography>
            </Box>
            <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, color: p.muted }}>
              question {current} / 40
            </Typography>
            <Box sx={{ flex: 1 }} />
            <BookmarkRoundedIcon sx={{ fontSize: 16, color: p.champagne }} />
          </Box>

          <Typography sx={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.5 }}>
            Which statements about mitosis are correct? (Select all that apply.)
          </Typography>

          <Stack spacing={0.75}>
            {[
              ['Sister chromatids separate at anaphase', true],
              ['It produces four haploid daughter cells', false],
              ['The nuclear envelope reforms at telophase', true],
              ['Crossing over increases genetic variation', false],
            ].map(([text, checked]) => (
              <Box
                key={text as string}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1,
                  py: 0.85,
                  borderRadius: '8px',
                  border: `1px solid ${checked ? p.rust : p.panelLine}`,
                }}
              >
                <Box
                  sx={{
                    width: 15,
                    height: 15,
                    borderRadius: '4px',
                    flexShrink: 0,
                    border: `1.5px solid ${checked ? p.rust : p.panelLine}`,
                    bgcolor: checked ? p.rust : 'transparent',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {checked && <CheckRoundedIcon sx={{ fontSize: 11, color: '#fff' }} />}
                </Box>
                <Typography sx={{ fontSize: 12, color: p.inkSoft }}>{text}</Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={{ display: 'flex', gap: 1, pt: 0.5 }}>
            <Box sx={{ px: 1.5, py: 0.6, borderRadius: '8px', border: `1px solid ${p.panelLine}`, fontSize: 12, color: p.muted }}>
              Back
            </Box>
            <Box sx={{ px: 1.5, py: 0.6, borderRadius: '8px', bgcolor: p.rust, color: '#fff', fontSize: 12, fontWeight: 600 }}>
              Next
            </Box>
          </Box>
        </Stack>

        {/* navigator */}
        <Box sx={{ flexShrink: 0 }}>
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 9.5, letterSpacing: '0.06em', color: p.muted, mb: 0.75 }}>
            NAVIGATOR
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 16px)', gap: 0.5 }}>
            {Array.from({ length: 40 }, (_, idx) => {
              const n = idx + 1;
              const isCur = n === current;
              const isFlag = flagged.has(n);
              const isAns = answered.has(n);
              return (
                <Box
                  key={n}
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '4px',
                    fontSize: 8,
                    fontFamily: MONO_FONT,
                    display: 'grid',
                    placeItems: 'center',
                    color: isAns ? '#fff' : p.muted,
                    bgcolor: isFlag ? p.champagne : isAns ? p.rust : p.panelSoft,
                    outline: isCur ? `2px solid ${p.rust}` : 'none',
                    outlineOffset: 1,
                  }}
                >
                  {n}
                </Box>
              );
            })}
          </Box>
          <Stack spacing={0.4} sx={{ mt: 1 }}>
            {[
              ['answered', p.rust],
              ['flagged', p.champagne],
            ].map(([label, c]) => (
              <Box key={label as string} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: c as string }} />
                <Typography sx={{ fontSize: 9.5, color: p.muted }}>{label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </MockFrame>
  );
}

/* -------------------------------------------------------------- FIG. 06 -- */

export function DashboardMock({ p }: { p: LandingPalette }) {
  return (
    <MockFrame p={p} tab="lantern / hub" lifted>
      <Stack spacing={1.75}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Welcome back, Enzo.</Typography>
          <Box sx={{ flex: 1 }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
              px: 1,
              py: 0.4,
              borderRadius: '999px',
              bgcolor: p.isDark ? 'rgba(220,184,122,0.14)' : 'rgba(200,165,105,0.18)',
            }}
          >
            <LocalFireDepartmentRoundedIcon sx={{ fontSize: 14, color: p.champagne }} />
            <Typography sx={{ fontFamily: MONO_FONT, fontSize: 11, color: p.inkSoft }}>12-day streak</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {[
            ['37', 'sections cleared'],
            ['412', 'practice questions'],
            ['1180', 'best SAT score'],
          ].map(([v, l]) => (
            <Box key={l} sx={{ p: 1.25, borderRadius: '10px', border: `1px solid ${p.panelLine}`, bgcolor: p.panelSoft }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: 18, fontWeight: 700, color: p.rust }}>{v}</Typography>
              <Typography sx={{ fontSize: 10.5, color: p.muted }}>{l}</Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: '10px',
            border: `1px solid ${p.rust}`,
            bgcolor: p.isDark ? 'rgba(199,122,160,0.08)' : 'rgba(200,165,105,0.09)',
          }}
        >
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: 9.5, letterSpacing: '0.08em', color: p.rust, mb: 0.5 }}>
            RESUME WHERE YOU LEFT
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Postgres + pgvector</Typography>
              <Typography sx={{ fontSize: 11, color: p.muted }}>Knowledge Base · §4 · 64% through</Typography>
              <Box sx={{ mt: 0.75, height: 5, borderRadius: 3, bgcolor: p.panelSoft, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: '64%', bgcolor: p.champagne }} />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.6,
                borderRadius: '8px',
                bgcolor: p.rust,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Continue <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
            </Box>
          </Box>
        </Box>

        <Stack spacing={0.75}>
          {[
            ['Knowledge Base', '18 guides open · 2 in progress'],
            ['Study Hub', '6 tracks · Algebra 2 diagnostic due'],
          ].map(([head, sub]) => (
            <Box
              key={head}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: '8px',
                border: `1px solid ${p.panelLine}`,
              }}
            >
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: p.inkSoft }}>{head}</Typography>
              <Box sx={{ flex: 1 }} />
              <Typography sx={{ fontSize: 11, color: p.muted }}>{sub}</Typography>
              <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: p.muted }} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </MockFrame>
  );
}
