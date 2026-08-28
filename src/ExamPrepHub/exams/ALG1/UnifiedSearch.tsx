// Unified search dialog for ALG1 — searches across glossary, study guide
// sections, flashcards, and the question bank in one place.

import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  School as GuideIcon,
  Quiz as QuestionIcon,
  Style as FlashcardIcon,
  MenuBook as GlossaryIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { questions } from './questions';
import { flashcards } from './flashcardDeck';
import { glossary } from './glossary';

interface SearchResult {
  type: 'glossary' | 'question' | 'flashcard' | 'section';
  title: string;
  snippet: string;
}

const SECTIONS_INDEX: { title: string; keywords: string }[] = [
  { title: 'The Big Picture',                 keywords: 'overview algebra variable equation function graph solve real world model unknown letter' },
  { title: 'Number & Quantity',               keywords: 'real numbers rational irrational integer whole natural fraction decimal scientific notation exponent square root cube root absolute value units conversion' },
  { title: 'Linear Equations & Inequalities', keywords: 'linear equation inequality solve slope intercept y-intercept x-intercept point slope form standard form parallel perpendicular distribute combine like terms isolate variable absolute value' },
  { title: 'Functions',                       keywords: 'function notation f(x) domain range input output independent dependent variable vertical line test mapping diagram evaluate identify table relation' },
  { title: 'Systems of Equations',            keywords: 'system equations substitution elimination graphing intersection point one solution no solution infinite solutions parallel coincident two variables' },
  { title: 'Polynomials',                     keywords: 'polynomial monomial binomial trinomial degree leading coefficient term constant FOIL distribute add subtract multiply factor GCF greatest common factor difference of squares' },
  { title: 'Quadratic Functions',             keywords: 'quadratic parabola vertex axis of symmetry roots zeros x-intercepts factoring quadratic formula completing the square discriminant standard form vertex form maximum minimum' },
  { title: 'Exponential Functions',           keywords: 'exponential growth decay base exponent compound interest half life doubling time linear vs exponential rate of change percent increase decrease initial value' },
  { title: 'Statistics & Data',               keywords: 'mean median mode range standard deviation outlier histogram box plot dot plot scatter plot correlation coefficient line of best fit regression causation two-way frequency table' },
  { title: 'EOCEP Exam-Day Strategy',         keywords: 'eocep timing eliminate wrong answers show work calculator policy substitute check plug and check chronology counts 20 percent grade' },
];

export default function UnifiedSearch({ open, onClose, onNavigate }: {
  open: boolean;
  onClose: () => void;
  onNavigate?: (target: { type: SearchResult['type']; title: string }) => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const ACCENT = isDark ? '#C77AA0' : '#5C2A4A';
  const TEXT_PRI = isDark ? '#F5EFE3' : '#2D1B26';
  const TEXT_SEC = isDark ? '#A6A4AE' : '#6E5E40';
  const BORDER = isDark ? '#3A3B45' : '#DDCBA8';
  const SURFACE = isDark ? '#1E0F06' : '#FBF7F2';

  const [q, setQ] = useState('');

  const results: SearchResult[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query.length < 2) return [];
    const out: SearchResult[] = [];

    for (const g of glossary) {
      if (g.term.toLowerCase().includes(query) || g.definition.toLowerCase().includes(query)) {
        out.push({ type: 'glossary', title: g.term, snippet: g.definition });
      }
    }
    for (const s of SECTIONS_INDEX) {
      if (s.title.toLowerCase().includes(query) || s.keywords.includes(query)) {
        out.push({ type: 'section', title: s.title, snippet: 'Study Guide section' });
      }
    }
    for (const f of flashcards) {
      if (f.front.toLowerCase().includes(query) || f.back.toLowerCase().includes(query) || f.topic.toLowerCase().includes(query)) {
        out.push({ type: 'flashcard', title: f.front, snippet: f.back });
      }
    }
    for (const qn of questions) {
      if (qn.question.toLowerCase().includes(query) || qn.explanation.toLowerCase().includes(query)) {
        out.push({ type: 'question', title: qn.question, snippet: qn.explanation });
      }
    }

    return out.slice(0, 40);
  }, [q]);

  const iconFor = (t: SearchResult['type']) => {
    switch (t) {
      case 'glossary':  return <GlossaryIcon fontSize="small" />;
      case 'section':   return <GuideIcon fontSize="small" />;
      case 'flashcard': return <FlashcardIcon fontSize="small" />;
      case 'question':  return <QuestionIcon fontSize="small" />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { backgroundColor: SURFACE, border: `1px solid ${BORDER}` } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BORDER}` }}>
        <Typography sx={{ fontWeight: 700, color: TEXT_PRI }}>Search Algebra 1 content</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          autoFocus
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search sections, glossary, flashcards, questions…"
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />
        {results.length === 0 ? (
          <Typography sx={{ color: TEXT_SEC, fontSize: '0.9rem' }}>
            {q.length < 2 ? 'Type at least 2 characters.' : 'No matches.'}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {results.map((r, i) => (
              <Box
                key={i}
                onClick={() => { onNavigate?.({ type: r.type, title: r.title }); onClose(); }}
                sx={{
                  p: 1.5, borderRadius: 1.5, cursor: 'pointer',
                  border: `1px solid ${BORDER}`,
                  '&:hover': { borderColor: ACCENT, backgroundColor: alpha(ACCENT, 0.05) },
                }}
              >
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.3 }}>
                  <Chip
                    size="small"
                    icon={iconFor(r.type)}
                    label={r.type}
                    sx={{ backgroundColor: alpha(ACCENT, 0.15), color: ACCENT, fontWeight: 700, textTransform: 'capitalize', fontSize: '0.7rem', height: 20 }}
                  />
                  <Typography sx={{ color: TEXT_PRI, fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</Typography>
                </Stack>
                <Typography sx={{ color: TEXT_SEC, fontSize: '0.82rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {r.snippet}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
