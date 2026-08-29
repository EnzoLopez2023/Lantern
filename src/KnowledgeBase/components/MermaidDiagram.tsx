import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

let mermaidInitialized = false;
let currentTheme: 'default' | 'dark' = 'dark';

function ensureInit(theme: 'default' | 'dark') {
  if (!mermaidInitialized || theme !== currentTheme) {
    mermaid.initialize({
      startOnLoad: false,
      theme,
      themeVariables: { fontFamily: 'system-ui, sans-serif' },
      flowchart: { useMaxWidth: true, htmlLabels: true },
      sequence: { useMaxWidth: true },
    });
    mermaidInitialized = true;
    currentTheme = theme;
  }
}

interface MermaidDiagramProps {
  chart: string;
  theme?: 'default' | 'dark';
}

let diagramCounter = 0;

export default function MermaidDiagram({ chart, theme = 'dark' }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mmd-${++diagramCounter}`);

  useEffect(() => {
    let cancelled = false;
    ensureInit(theme);
    mermaid
      .render(idRef.current, chart)
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      })
      .catch(err => {
        if (!cancelled && ref.current) {
          ref.current.textContent = `Mermaid render error: ${err?.message ?? err}`;
        }
      });
    return () => {
      cancelled = true;
    };
  }, [chart, theme]);

  return <div className="mermaid" ref={ref} />;
}
