// Cross-guide search index.
//
// Each guide is its own lazy chunk, so on home-page mount we don't want to
// load them. Instead, we trigger indexing only when the user first interacts
// with the search box. The first search takes ~1-3s while we render each
// guide to static markup and parse out the sections; subsequent searches are
// instant against the cached index.

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { GUIDE_SEARCH_REGISTRY } from './guideSearchRegistry';

export interface GuideSection {
  id: string;
  title: string;
  body: string;
}

export interface GuideIndex {
  guideId: string;
  guideTitle: string;
  sections: GuideSection[];
}

let indexPromise: Promise<GuideIndex[]> | null = null;

function extractSections(html: string): GuideSection[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const sections: GuideSection[] = [];

  doc.querySelectorAll('section.section[id], section[id]').forEach(sec => {
    // Strip copy buttons so "Copy" text doesn't pollute the body
    sec.querySelectorAll('button.copy-btn').forEach(b => b.remove());
    // Strip the section-num badge so it doesn't appear at the start of the title
    const numBadge = sec.querySelector('.section-num');
    if (numBadge) numBadge.remove();

    const h2 = sec.querySelector('h2');
    let titleText = (h2?.textContent || sec.id).trim();
    titleText = titleText.replace(/\s+/g, ' ');
    if (!titleText) titleText = sec.id;

    const body = (sec.textContent || '').replace(/\s+/g, ' ').trim();
    sections.push({ id: sec.id, title: titleText, body });
  });

  return sections;
}

async function loadOne(g: typeof GUIDE_SEARCH_REGISTRY[number]): Promise<GuideIndex> {
  try {
    const mod = await g.load();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Guide = (mod as any).default;
    const html = renderToStaticMarkup(createElement(Guide));
    return { guideId: g.id, guideTitle: g.title, sections: extractSections(html) };
  } catch (e) {
    console.warn(`[searchIndex] failed to index ${g.id}:`, e);
    return { guideId: g.id, guideTitle: g.title, sections: [] };
  }
}

export function getSearchIndex(): Promise<GuideIndex[]> {
  if (!indexPromise) {
    indexPromise = Promise.all(GUIDE_SEARCH_REGISTRY.map(loadOne));
  }
  return indexPromise;
}

export interface SearchHit {
  guideId: string;
  guideTitle: string;
  sectionId: string;
  sectionTitle: string;
  snippet: string;
  /** 0 = title hit, 1 = body hit. Used for sorting. */
  rank: number;
}

const SNIPPET_BEFORE = 60;
const SNIPPET_AFTER = 120;
const MAX_HITS = 60;

export function searchAll(index: GuideIndex[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const hits: SearchHit[] = [];

  for (const guide of index) {
    for (const section of guide.sections) {
      const titleLower = section.title.toLowerCase();
      const bodyLower = section.body.toLowerCase();
      const titleHit = titleLower.includes(q);
      const bodyIdx = bodyLower.indexOf(q);

      if (!titleHit && bodyIdx === -1) continue;

      let snippet: string;
      if (bodyIdx !== -1) {
        const start = Math.max(0, bodyIdx - SNIPPET_BEFORE);
        const end = Math.min(section.body.length, bodyIdx + q.length + SNIPPET_AFTER);
        snippet =
          (start > 0 ? '… ' : '') +
          section.body.slice(start, end) +
          (end < section.body.length ? ' …' : '');
      } else {
        snippet = section.body.slice(0, SNIPPET_BEFORE + SNIPPET_AFTER) + (section.body.length > SNIPPET_BEFORE + SNIPPET_AFTER ? ' …' : '');
      }

      hits.push({
        guideId: guide.guideId,
        guideTitle: guide.guideTitle,
        sectionId: section.id,
        sectionTitle: section.title,
        snippet,
        rank: titleHit ? 0 : 1,
      });
    }
  }

  hits.sort((a, b) => a.rank - b.rank);
  return hits.slice(0, MAX_HITS);
}
