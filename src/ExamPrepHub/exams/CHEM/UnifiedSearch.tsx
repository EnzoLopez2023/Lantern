// Unified search dialog for CHEM — searches across glossary, study guide
// sections, flashcards, and the question bank in one place.

import { useMemo, useState } from 'react';
import {
  Box, Chip, Dialog, DialogContent, DialogTitle, IconButton,
  InputAdornment, TextField, Typography, Stack,
} from '@mui/material';
import {
  Search as SearchIcon, Close as CloseIcon, School as GuideIcon,
  Quiz as QuestionIcon, Style as FlashcardIcon, MenuBook as GlossaryIcon,
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

const EXAM_ID = 'CHEM';
void EXAM_ID;

const SECTIONS_INDEX: { title: string; keywords: string }[] = [
  { title: 'The Big Picture',                         keywords: 'overview chemistry matter energy atoms molecules compounds reactions measurement lab safety SI units' },
  { title: 'Matter and Measurement',                  keywords: 'matter pure substance mixture element compound physical chemical property change phase solid liquid gas plasma density mass volume significant figures dimensional analysis conversion SI metric' },
  { title: 'Atomic Structure',                        keywords: 'atom proton neutron electron nucleus electron configuration orbital subshell shell Bohr model quantum Dalton Thomson Rutherford Bohr isotope mass number atomic number' },
  { title: 'The Periodic Table',                      keywords: 'periodic table period group metal nonmetal metalloid alkali alkaline earth transition halogen noble gas valence electron trend electronegativity ionization energy atomic radius ionic radius' },
  { title: 'Chemical Bonding',                        keywords: 'ionic bond covalent bond metallic bond polar nonpolar Lewis structure VSEPR geometry electronegativity dipole molecular shape hydrogen bond van der Waals' },
  { title: 'Stoichiometry',                           keywords: 'mole Avogadro molar mass formula unit empirical molecular formula percent composition limiting reagent excess theoretical yield actual percent yield balanced equation' },
  { title: 'States of Matter and Thermodynamics',     keywords: 'gas laws Boyle Charles Gay-Lussac ideal gas law PV=nRT kinetic molecular theory intermolecular forces phase diagram vapor pressure heat enthalpy entropy thermodynamics calorimetry specific heat' },
  { title: 'Reaction Kinetics, Equilibrium, Acids and Bases', keywords: 'reaction rate activation energy catalyst equilibrium Le Chatelier Kc Kp acid base pH pOH Arrhenius Brønsted-Lowry Lewis strong weak buffer neutralization titration' },
  { title: 'Exam-Day Strategy',                       keywords: 'strategy formula dimensional analysis unit cancel balance equation time management' },
  { title: 'Glossary',                                keywords: 'definitions terms vocabulary reference' },
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
      if (g.term.toLowerCase().includes(query) || g.definition.toLowerCase().includes(query))
        out.push({ type: 'glossary', title: g.term, snippet: g.definition });
    }
    for (const s of SECTIONS_INDEX) {
      if (s.title.toLowerCase().includes(query) || s.keywords.includes(query))
        out.push({ type: 'section', title: s.title, snippet: 'Study Guide section' });
    }
    for (const f of flashcards) {
      if (f.front.toLowerCase().includes(query) || f.back.toLowerCase().includes(query) || f.topic.toLowerCase().includes(query))
        out.push({ type: 'flashcard', title: f.front, snippet: f.back });
    }
    for (const qn of questions) {
      if (qn.question.toLowerCase().includes(query) || qn.explanation.toLowerCase().includes(query))
        out.push({ type: 'question', title: qn.question, snippet: qn.explanation });
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
        <Typography sx={{ fontWeight: 700, color: TEXT_PRI }}>Search Chemistry content</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField fullWidth autoFocus value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search sections, glossary, flashcards, questions…"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          sx={{ mb: 2 }} />
        {results.length === 0 ? (
          <Typography sx={{ color: TEXT_SEC, fontSize: '0.9rem' }}>{q.length < 2 ? 'Type at least 2 characters.' : 'No matches.'}</Typography>
        ) : (
          <Stack spacing={1}>
            {results.map((r, i) => (
              <Box key={i} onClick={() => { onNavigate?.({ type: r.type, title: r.title }); onClose(); }}
                sx={{ p: 1.5, borderRadius: 1.5, cursor: 'pointer', border: `1px solid ${BORDER}`, '&:hover': { borderColor: ACCENT, backgroundColor: alpha(ACCENT, 0.05) } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.3 }}>
                  <Chip size="small" icon={iconFor(r.type)} label={r.type}
                    sx={{ backgroundColor: alpha(ACCENT, 0.15), color: ACCENT, fontWeight: 700, textTransform: 'capitalize', fontSize: '0.7rem', height: 20 }} />
                  <Typography sx={{ color: TEXT_PRI, fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</Typography>
                </Stack>
                <Typography sx={{ color: TEXT_SEC, fontSize: '0.82rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.snippet}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
