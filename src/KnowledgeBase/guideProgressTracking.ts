export interface SectionIntersection {
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingClientRect?: { top: number; bottom: number };
  rootBounds?: { top: number; bottom: number } | null;
}

export const hasSectionCrossedReadingPosition = (
  entry: SectionIntersection,
): boolean => {
  if (entry.isIntersecting || entry.intersectionRatio > 0) return true;
  if (!entry.boundingClientRect || !entry.rootBounds) return false;
  const readingLine = entry.rootBounds.top
    + (entry.rootBounds.bottom - entry.rootBounds.top) * 0.3;
  return entry.boundingClientRect.top <= readingLine
    && entry.boundingClientRect.bottom >= entry.rootBounds.top;
};
