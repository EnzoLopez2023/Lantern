import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowBack as StartOverIcon,
  ExpandMore as ExpandMoreIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import type { GuideTTSHandle, AzureVoice } from './useGuideTTS';

interface Props {
  tts: GuideTTSHandle;
}

function formatAge(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hrs = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (days >= 1) return `${days}d ago`;
  if (hrs >= 1) return `${hrs}h ago`;
  if (mins >= 1) return `${mins}m ago`;
  return 'just now';
}

export default function GuideTTSControls({ tts }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const ACCENT   = isDark ? '#C77AA0' : '#5C2A4A';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const BORDER   = isDark ? '#3A3B45' : '#DDCBA8';
  const CARD_BG  = isDark ? '#2E2F38' : '#FBF5E6';

  const [pickerAnchor, setPickerAnchor] = useState<null | HTMLElement>(null);

  const {
    ttsState, play, playFrom, resume, clearSaved, pause, stop,
    sectionIndex, sectionCount, sections, savedPosition,
    voices, selectedVoice, setVoice, error,
  } = tts;

  const openPicker = (e: React.MouseEvent<HTMLElement>) => setPickerAnchor(e.currentTarget);
  const closePicker = () => setPickerAnchor(null);

  const handlePickSection = (idx: number) => {
    closePicker();
    playFrom(idx);
  };
  const errorNotice = error ? (
    <Typography
      role="alert"
      title={error}
      variant="caption"
      sx={{ color: 'error.main', maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
    >
      Read aloud stopped. Resume to retry.
    </Typography>
  ) : null;

  // Section picker menu — shared between idle and active states
  const SectionMenu = (
    <Menu
      anchorEl={pickerAnchor}
      open={Boolean(pickerAnchor)}
      onClose={closePicker}
      slotProps={{
        paper: {
          sx: {
            maxHeight: 360,
            minWidth: 240,
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      }}
    >
      <ListSubheader
        sx={{ backgroundColor: CARD_BG, color: TEXT_SEC, fontSize: '0.7rem', lineHeight: '28px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
      >
        Jump to section
      </ListSubheader>
      {sections.map((s, idx) => (
        <MenuItem
          key={s.id}
          onClick={() => handlePickSection(idx)}
          selected={idx === sectionIndex && ttsState !== 'idle'}
          sx={{
            fontSize: '0.82rem',
            color: idx === sectionIndex && ttsState !== 'idle' ? ACCENT : 'inherit',
            py: 0.75,
          }}
        >
          <Typography component="span" sx={{ color: TEXT_SEC, fontSize: '0.72rem', minWidth: 28, mr: 0.5 }}>
            §{idx + 1}
          </Typography>
          {s.title}
        </MenuItem>
      ))}
    </Menu>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (ttsState === 'loading') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', pr: 0.5 }}>
        <CircularProgress size={20} thickness={4} sx={{ color: ACCENT }} />
      </Box>
    );
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (ttsState === 'idle') {
    // Has a saved position — show resume prompt
    if (savedPosition) {
      return (
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5, pl: 1, borderLeft: `1px solid ${BORDER}` }}>
          {errorNotice}
          {/* Resume button */}
          <Tooltip
            title={`Saved ${formatAge(savedPosition.timestamp)}`}
            placement="bottom"
          >
            <Button
              size="small"
              startIcon={<PlayArrowIcon sx={{ fontSize: '1rem !important' }} />}
              onClick={resume}
              sx={{
                color: ACCENT,
                textTransform: 'none',
                fontSize: '0.78rem',
                fontWeight: 600,
                px: 1,
                py: 0.25,
                maxWidth: 220,
                overflow: 'hidden',
              }}
            >
              <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                §{savedPosition.sectionIndex + 1}: {savedPosition.title}
              </Box>
            </Button>
          </Tooltip>

          {/* Start from beginning */}
          <Tooltip title="Start from beginning" placement="bottom">
            <IconButton
              size="small"
              onClick={() => { clearSaved(); play(); }}
              aria-label="Start from beginning"
              sx={{ color: TEXT_SEC, '&:hover': { color: ACCENT } }}
            >
              <StartOverIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>

          {/* Section picker */}
          {sections.length > 0 && (
            <>
              <Tooltip title="Choose section" placement="bottom">
                <IconButton
                  size="small"
                  onClick={openPicker}
                  aria-label="Choose section to read from"
                  sx={{ color: TEXT_SEC, '&:hover': { color: ACCENT } }}
                >
                  <ExpandMoreIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
              {SectionMenu}
            </>
          )}
        </Box>
      );
    }

    // No saved position — default mic icon + optional section picker
    return (
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
        {errorNotice}
        <Tooltip title="Read article aloud" placement="bottom">
          <IconButton
            size="small"
            onClick={play}
            aria-label="Read article aloud"
            sx={{ color: TEXT_SEC, '&:hover': { color: ACCENT } }}
          >
            <RecordVoiceOverIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {sections.length > 0 && (
          <>
            <Tooltip title="Choose section" placement="bottom">
              <IconButton
                size="small"
                onClick={openPicker}
                aria-label="Choose section to start from"
                sx={{ color: TEXT_SEC, '&:hover': { color: ACCENT }, ml: -0.5 }}
              >
                <ExpandMoreIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
            {SectionMenu}
          </>
        )}
      </Box>
    );
  }

  // ── Playing / Paused ──────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        ml: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 1,
        borderLeft: `1px solid ${BORDER}`,
      }}
    >
      {/* Play / Pause toggle */}
      <Tooltip title={ttsState === 'playing' ? 'Pause' : 'Resume'} placement="bottom">
        <IconButton
          size="small"
          onClick={ttsState === 'playing' ? pause : play}
          aria-label={ttsState === 'playing' ? 'Pause reading' : 'Resume reading'}
          sx={{ color: ACCENT }}
        >
          {ttsState === 'playing' ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* Stop */}
      <Tooltip title="Stop reading" placement="bottom">
        <IconButton
          size="small"
          onClick={stop}
          aria-label="Stop reading"
          sx={{ color: TEXT_SEC, '&:hover': { color: ACCENT } }}
        >
          <StopIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Section counter + picker trigger */}
      {sectionCount > 0 && (
        <>
          <Tooltip title="Jump to section" placement="bottom">
            <Button
              size="small"
              endIcon={<ExpandMoreIcon sx={{ fontSize: '0.85rem !important' }} />}
              onClick={openPicker}
              aria-label="Jump to section"
              sx={{
                color: TEXT_SEC,
                textTransform: 'none',
                fontSize: '0.75rem',
                px: 0.75,
                py: 0.25,
                minWidth: 0,
                '&:hover': { color: ACCENT },
              }}
            >
              {sectionIndex + 1} / {sectionCount}
            </Button>
          </Tooltip>
          {SectionMenu}
        </>
      )}

      {/* Divider before voice selector */}
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: BORDER }} />

      {/* Voice selector */}
      <Select
        size="small"
        value={selectedVoice}
        onChange={e => setVoice(e.target.value)}
        variant="outlined"
        sx={{
          fontSize: '0.72rem',
          height: 28,
          color: TEXT_SEC,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ACCENT },
          '& .MuiSelect-select': { py: 0.25, px: 1 },
        }}
      >
        {(voices as AzureVoice[]).map(v => (
          <MenuItem key={v.name} value={v.name} sx={{ fontSize: '0.8rem' }}>
            {v.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
