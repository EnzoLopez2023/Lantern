import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

interface QuickLink { href: string; label: string; }

interface CloudGuideShellProps {
  themeStorageKey: string;
  wizardStorageKeyPrefix: string;
  title: ReactNode;
  versionTag?: ReactNode;
  subtitle?: ReactNode;
  quickLinks: QuickLink[];
  children: ReactNode;
  onThemeChange?: (theme: 'default' | 'dark') => void;
  /** Optional accent color overrides per theme — applied as CSS variable. */
  accentDark?: string;
  accentLight?: string;
}

export default function CloudGuideShell({
  themeStorageKey,
  wizardStorageKeyPrefix,
  title,
  versionTag,
  subtitle,
  quickLinks,
  children,
  onThemeChange,
  accentDark,
  accentLight,
}: CloudGuideShellProps) {
  const [isLight, setIsLight] = useState(() => {
    try {
      return localStorage.getItem(themeStorageKey) === 'light';
    } catch {
      return false;
    }
  });
  const [tocItems, setTocItems] = useState<{ id: string; text: string; isH2: boolean }[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    onThemeChange?.(isLight ? 'default' : 'dark');
    try {
      localStorage.setItem(themeStorageKey, isLight ? 'light' : 'dark');
    } catch {
      // ignore
    }
  }, [isLight, themeStorageKey, onThemeChange]);

  // Build TOC dynamically from h2[id] and details>summary[id] in main
  useEffect(() => {
    if (!mainRef.current) return;
    const items: { id: string; text: string; isH2: boolean }[] = [];
    mainRef.current.querySelectorAll('h2[id], details.section > summary[id]').forEach(el => {
      const id = el.id;
      const isH2 = el.tagName === 'H2';
      // Skip .pill children when computing label text — they're badges, not part of the title
      const text = Array.from(el.childNodes)
        .filter(n => !(n.nodeType === 1 && (n as Element).classList?.contains('pill')))
        .map(n => n.textContent ?? '')
        .join('')
        .replace('▸', '')
        .trim();
      items.push({ id, text, isH2 });
    });
    setTocItems(items);
  }, [children]);

  // IntersectionObserver to highlight active section
  useEffect(() => {
    if (tocItems.length === 0) return;
    const targets = tocItems
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, [tocItems]);

  // Auto-open the <details> when navigating via hash
  useEffect(() => {
    const handler = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      const details = el.closest('details');
      if (details && !details.open) details.open = true;
    };
    window.addEventListener('hashchange', handler);
    handler();
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const expandAll = () => {
    mainRef.current?.querySelectorAll('details.section').forEach(d => {
      (d as HTMLDetailsElement).open = true;
    });
  };
  const collapseAll = () => {
    mainRef.current?.querySelectorAll('details.section').forEach(d => {
      (d as HTMLDetailsElement).open = false;
    });
  };
  const resetWizards = () => {
    if (!window.confirm('Reset all wizard checkboxes for this guide?')) return;
    try {
      localStorage.keys()
        .filter(k => k.startsWith(wizardStorageKeyPrefix))
        .forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    window.location.reload();
  };

  const cls = useMemo(() => `kb-cloud-guide${isLight ? ' light' : ''}`, [isLight]);
  const accentOverride = isLight ? accentLight : accentDark;
  const accentStyle = accentOverride
    ? ({ '--accent': accentOverride } as React.CSSProperties)
    : undefined;

  return (
    <div className={cls} style={accentStyle}>
      <div className="layout">
        <aside>
          <div className="controls">
            <button className="btn" type="button" title="Toggle light/dark" onClick={() => setIsLight(v => !v)}>
              🌓
            </button>
            <button className="btn" type="button" onClick={expandAll}>Expand all</button>
            <button className="btn" type="button" onClick={collapseAll}>Collapse</button>
            <button className="btn" type="button" title="Reset all wizard checkbox state" onClick={resetWizards}>
              ↺ Reset
            </button>
          </div>
          <h2>Contents</h2>
          <ul>
            {tocItems.map(item => (
              <li
                key={item.id}
                style={{
                  marginLeft: item.isH2 ? 0 : 12,
                  marginTop: item.isH2 ? 6 : 0,
                }}
              >
                <a
                  href={`#${item.id}`}
                  className={activeId === item.id ? 'active' : ''}
                  style={item.isH2 ? { fontWeight: 600, color: 'var(--text)' } : undefined}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
          <h2>Quick links</h2>
          <ul>
            {quickLinks.map(l => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </aside>

        <main ref={mainRef}>
          <div className="topbar">
            <h1>{title}</h1>
            {versionTag && <span className="pill">{versionTag}</span>}
          </div>
          {subtitle && <p className="subtitle">{subtitle}</p>}
          <div className="legend">
            <span><span className="swatch" style={{ background: 'var(--accent)' }}></span> click to jump</span>
            <span><span className="swatch" style={{ background: 'var(--good)' }}></span> recommended</span>
            <span><span className="swatch" style={{ background: 'var(--warn)' }}></span> caveat</span>
            <span><span className="swatch" style={{ background: 'var(--bad)' }}></span> pitfall</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
