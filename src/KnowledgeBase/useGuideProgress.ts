// Per-guide scroll tracking. Returns:
//   - readSections: Set of every section id that has crossed the viewport
//     (additive — used for the progress bar + "done" nav state).
//   - currentSection: id of the section the reader is currently on (single-
//     valued — used to mark one nav item as active, like the app sidebar).
//   - setRef: callback to attach to each <section ref={setRef(id)}>.
//
// Uses two observers — one with a high threshold for "read" tracking, one
// with a centered rootMargin for "current section" scrollspy.

import { useEffect, useRef, useState } from 'react';

export function useGuideProgress(sectionIds: string[]) {
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const [currentSection, setCurrentSection] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const readObserver = new IntersectionObserver(
      entries => {
        setReadSections(prev => {
          const next = new Set(prev);
          let changed = false;
          entries.forEach(e => {
            if (e.isIntersecting && !next.has(e.target.id)) {
              next.add(e.target.id);
              changed = true;
            }
          });
          return changed ? next : prev;
        });
      },
      { threshold: 0.3 }
    );
    const spyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setCurrentSection(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    Object.values(sectionRefs.current).forEach(el => {
      if (el) {
        readObserver.observe(el);
        spyObserver.observe(el);
      }
    });

    return () => {
      readObserver.disconnect();
      spyObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const pct = sectionIds.length === 0
    ? 0
    : Math.round((readSections.size / sectionIds.length) * 100);

  return { readSections, currentSection, setRef, pct };
}
