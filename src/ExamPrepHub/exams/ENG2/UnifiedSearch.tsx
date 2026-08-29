// Unified search dialog for ENG2 — searches across glossary, study guide
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
  { title: 'The Big Picture',                       keywords: 'overview english language arts reading writing literature passage author thesis argument evidence claim text genre fiction nonfiction' },
  { title: 'Reading Literature',                    keywords: 'theme topic characterization protagonist antagonist plot exposition rising action climax falling action resolution point of view first person third person limited omniscient narrator setting conflict fiction poetry drama steal direct indirect' },
  { title: 'Reading Informational Text',            keywords: 'central idea main idea author purpose pie persuade inform entertain explain describe text structure cause effect compare contrast chronological problem solution sequence nonfiction expository article essay speech inference summary objective evidence' },
  { title: 'Literary Devices & Figurative Language', keywords: 'metaphor simile personification imagery symbolism motif hyperbole understatement irony verbal situational dramatic allusion alliteration assonance consonance onomatopoeia tone mood diction sensory' },
  { title: "Author's Craft & Structure",            keywords: 'pacing flashback foreshadowing narrative structure diction syntax point of view choice anaphora parallelism rhetorical question setting unreliable narrator frame story in medias res essay organization' },
  { title: 'Argument & Evidence',                   keywords: 'ethos pathos logos rhetorical appeals counterclaim rebuttal logical fallacy ad hominem straw man slippery slope bandwagon false dichotomy hasty generalization post hoc appeal to authority circular reasoning claim evidence reasoning correlation causation' },
  { title: 'Language Conventions',                  keywords: 'grammar punctuation parts of speech noun verb adjective adverb pronoun preposition conjunction interjection sentence simple compound complex compound-complex clause independent dependent subject predicate phrase parallelism modifier dangling misplaced subject verb agreement pronoun antecedent agreement comma semicolon colon apostrophe fragment run-on splice fanboys' },
  { title: 'Vocabulary in Context',                 keywords: 'greek latin roots prefix suffix tele photo geo bio chrono scrib script port dict aud spec ject loqu un re pre dis sub super inter trans -tion -able -ly -ness -ology context clues definition example contrast inference denotation connotation synonym antonym homophone homograph' },
  { title: 'Writing & Revision',                    keywords: 'thesis statement organization introduction body conclusion topic sentence transition evidence integration revising editing active passive voice concision wordiness mla in-text citation works cited paraphrase summary quotation plagiarism craap test source evaluation hook rebuttal counterclaim' },
  { title: 'EOCEP Exam-Day Strategy',               keywords: 'eocep timing three pass strategy eliminate wrong answers reread passage process of elimination counts 20 percent grade test taking strategies multiple choice answer every question line reference qualifier' },
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
        <Typography sx={{ fontWeight: 700, color: TEXT_PRI }}>Search English 2 content</Typography>
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
