// Per-guide search. The guide is fully rendered into the DOM, so we read
// each section's text content directly — no renderToStaticMarkup needed.

import { useEffect, useMemo, useState } from 'react';

interface SectionRef {
  id: string;
  title: string;
}

export function useGuideSearch<S extends SectionRef>(sections: S[]) {
  const [query, setQuery] = useState('');
  const [bodyTexts, setBodyTexts] = useState<Map<string, string>>(new Map());

  // After the guide mounts, harvest each section's plain text once.
  // We don't watch for content changes — guides are static documents.
  useEffect(() => {
    const map = new Map<string, string>();
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      // Clone so we can mutate without affecting the live DOM
      const clone = el.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('button.copy-btn').forEach(b => b.remove());
      map.set(s.id, (clone.textContent || '').toLowerCase());
    });
    setBodyTexts(map);
    // We want this to run exactly once after first mount of the guide content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter(s => {
      if (s.title.toLowerCase().includes(q)) return true;
      const body = bodyTexts.get(s.id);
      return body ? body.includes(q) : false;
    });
  }, [query, bodyTexts, sections]);

  return { query, setQuery, filtered };
}
