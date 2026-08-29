// High School curriculum callout component. Replaces <ExamTip> for HS tracks
// where the certification-prep framing doesn't fit.
//
// Use ONE component with a `kind` prop instead of seven separate components
// so the QC script can count callout density with a single regex (<Callout)
// and so authors can sweep label changes in one place.
//
// Cert tracks (AI-901, AZ-900, etc.) keep using <ExamTip> — Callout is only
// for the High School category.

import { Paper, Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';
import {
  VisibilityOutlined as WatchForIcon,
  PublicOutlined as WhyItMattersIcon,
  PsychologyOutlined as MakeItStickIcon,
  RecordVoiceOverOutlined as PlainWordsIcon,
  PlayCircleOutlined as TryThisIcon,
  HubOutlined as ConnectIcon,
  AssistantOutlined as CoachNoteIcon,
} from '@mui/icons-material';

export type CalloutKind =
  | 'watch-for'
  | 'why-it-matters'
  | 'make-it-stick'
  | 'in-plain-words'
  | 'try-this'
  | 'connect'
  | 'coachs-note';

interface KindStyle {
  label: string;
  Icon:  React.ComponentType<{ sx?: object }>;
  tone:  'rust' | 'sage' | 'amber' | 'blue' | 'purple';
}

const KIND_STYLES: Record<CalloutKind, KindStyle> = {
  'watch-for':      { label: 'Watch For',      Icon: WatchForIcon,     tone: 'amber'  },
  'why-it-matters': { label: 'Why It Matters', Icon: WhyItMattersIcon, tone: 'blue'   },
  'make-it-stick':  { label: 'Make It Stick',  Icon: MakeItStickIcon,  tone: 'purple' },
  'in-plain-words': { label: 'In Plain Words', Icon: PlainWordsIcon,   tone: 'sage'   },
  'try-this':       { label: 'Try This',       Icon: TryThisIcon,      tone: 'sage'   },
  'connect':        { label: 'Connect',        Icon: ConnectIcon,      tone: 'blue'   },
  'coachs-note':    { label: "Coach's Note",   Icon: CoachNoteIcon,    tone: 'rust'   },
};

function useTones() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return {
    rust:   isDark ? '#C77AA0' : '#5C2A4A',
    sage:   isDark ? '#7BAF85' : '#3C6E4B',
    amber:  isDark ? '#E2B26B' : '#B08139',
    blue:   isDark ? '#7AA8C4' : '#4A7A9B',
    purple: isDark ? '#9E86C8' : '#6B5A9A',
    text:   isDark ? '#F5EFE3' : '#2D1B26',
    isDark,
  };
}

export function Callout({
  kind,
  children,
  label,
}: {
  kind:    CalloutKind
  children: ReactNode
  label?:   string  // override the default label if a more specific phrasing fits
}) {
  const tones = useTones();
  const style = KIND_STYLES[kind];
  const color = tones[style.tone];
  const { Icon } = style;
  return (
    <Paper
      elevation={0}
      sx={{
        my: 1.5,
        p: 1.5,
        backgroundColor: alpha(color, tones.isDark ? 0.10 : 0.06),
        border: `1px solid ${alpha(color, 0.30)}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.25,
      }}
    >
      <Icon sx={{ color, fontSize: '1.15rem', mt: 0.15 }} />
      <Box>
        <Typography
          variant="caption"
          sx={{ color, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', mb: 0.25 }}
        >
          {label ?? style.label}
        </Typography>
        <Typography sx={{ color: tones.text, fontSize: '0.9rem', lineHeight: 1.6 }}>{children}</Typography>
      </Box>
    </Paper>
  );
}
