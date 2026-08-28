import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';

export type StandardPracticeMode =
  | 'browse'
  | 'weak'
  | 'adaptive'
  | 'due'
  | 'daily'
  | 'bookmarks';

interface PracticeEmptyStateProps {
  mode: StandardPracticeMode;
  dueCount: number;
  onModeChange: (mode: StandardPracticeMode) => void;
  cardBackground: string;
  borderColor: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
}

export function PracticeEmptyState({
  mode,
  dueCount,
  onModeChange,
  cardBackground,
  borderColor,
  textColor,
  secondaryTextColor,
  accentColor,
}: PracticeEmptyStateProps) {
  const title = mode === 'bookmarks'
    ? 'No bookmarked questions yet'
    : mode === 'due'
      ? 'No questions are due for review'
      : 'No questions are available in this mode';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        backgroundColor: cardBackground,
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        textAlign: 'center',
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" sx={{ color: textColor }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: secondaryTextColor }}>
          Choose another mode to keep practicing. Your current progress is preserved.
        </Typography>
        <FormControl size="small" sx={{ minWidth: 210 }}>
          <InputLabel id="empty-practice-mode-label">Practice mode</InputLabel>
          <Select
            labelId="empty-practice-mode-label"
            value={mode}
            label="Practice mode"
            onChange={event => onModeChange(event.target.value as StandardPracticeMode)}
          >
            <MenuItem value="browse">Browse all</MenuItem>
            <MenuItem value="weak">Weak spots</MenuItem>
            <MenuItem value="adaptive">Adaptive</MenuItem>
            <MenuItem value="due">Due for review ({dueCount})</MenuItem>
            <MenuItem value="daily">Daily warmup</MenuItem>
            <MenuItem value="bookmarks">Bookmarks</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => onModeChange('browse')}
          sx={{ bgcolor: accentColor, textTransform: 'none' }}
        >
          Browse all questions
        </Button>
      </Stack>
    </Paper>
  );
}
