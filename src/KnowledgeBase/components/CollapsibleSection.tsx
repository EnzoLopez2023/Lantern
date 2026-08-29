import { useEffect, useRef, type ReactNode } from 'react';

interface CollapsibleSectionProps {
  id?: string;
  summaryId?: string;
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CollapsibleSection({
  id,
  summaryId,
  title,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const detailsEl = ref.current;
    if (!detailsEl || !summaryId) return;
    const handler = () => {
      if (window.location.hash.slice(1) === summaryId && !detailsEl.open) {
        detailsEl.open = true;
      }
    };
    window.addEventListener('hashchange', handler);
    handler();
    return () => window.removeEventListener('hashchange', handler);
  }, [summaryId]);

  return (
    <details ref={ref} className="section" id={id} open={defaultOpen}>
      <summary id={summaryId}>{title}</summary>
      <div className="body">{children}</div>
    </details>
  );
}
