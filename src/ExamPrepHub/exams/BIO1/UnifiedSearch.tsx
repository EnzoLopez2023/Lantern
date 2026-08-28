// Unified search dialog for BIO1 — searches across glossary, study guide
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
  { title: 'The Big Picture',                  keywords: 'overview biology life cell organism characteristics levels organization scientific method hypothesis experiment theory evolution unifying themes' },
  { title: 'Cells & Cell Processes',           keywords: 'cell prokaryote eukaryote organelle nucleus mitochondria chloroplast ribosome endoplasmic reticulum golgi lysosome vacuole cell wall cell membrane phospholipid bilayer cytoplasm plant animal diffusion osmosis active transport passive transport hypotonic hypertonic isotonic mitosis meiosis cell cycle interphase prophase metaphase anaphase telophase cytokinesis chromosome cancer' },
  { title: 'Biochemistry & Energy',            keywords: 'water properties polar hydrogen bond macromolecule carbohydrate lipid protein nucleic acid monomer polymer enzyme substrate active site ATP photosynthesis light dependent calvin cycle cellular respiration glycolysis krebs citric acid electron transport chain aerobic anaerobic fermentation chlorophyll autotroph heterotroph glucose' },
  { title: 'Genetics & Heredity',              keywords: 'DNA double helix base pair adenine thymine guanine cytosine uracil replication transcription translation mRNA tRNA ribosome codon anticodon amino acid mutation point frameshift mendel dominant recessive allele genotype phenotype punnett square monohybrid dihybrid codominance incomplete dominance sex linked pedigree heterozygous homozygous gene chromosome inheritance' },
  { title: 'Evolution & Natural Selection',    keywords: 'darwin natural selection evolution adaptation fitness fossil homologous analogous vestigial embryology molecular evidence biogeography speciation hardy weinberg variation selective pressure descent with modification common ancestor wallace galapagos' },
  { title: 'Ecology & Ecosystems',             keywords: 'ecosystem food chain food web energy pyramid trophic level producer consumer decomposer ten percent rule biotic abiotic mutualism commensalism parasitism predator prey symbiosis carbon cycle nitrogen cycle water cycle biome succession niche population community habitat' },
  { title: 'Classification & Biodiversity',    keywords: 'taxonomy domain kingdom phylum class order family genus species binomial nomenclature linnaeus cladogram phylogeny dichotomous key archaea bacteria eukarya protista fungi plantae animalia characteristics of life six kingdoms three domains' },
  { title: 'Homeostasis & Body Systems',       keywords: 'homeostasis negative feedback positive feedback set point regulation levels of organization cell tissue organ organ system body systems digestive circulatory respiratory nervous endocrine immune skeletal muscular reproductive thermoregulation glucose blood pressure' },
  { title: 'Scientific Inquiry & Lab Skills',  keywords: 'scientific method hypothesis theory law experiment independent variable dependent variable control variable controlled experiment data analysis graph table observation inference conclusion bias replication peer review microscope microscopy slide preparation' },
  { title: 'EOCEP Exam-Day Strategy',          keywords: 'eocep timing eliminate wrong answers process of elimination test taking strategies counts 20 percent grade biology multiple choice diagrams labeled' },
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
        <Typography sx={{ fontWeight: 700, color: TEXT_PRI }}>Search Biology 1 content</Typography>
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
