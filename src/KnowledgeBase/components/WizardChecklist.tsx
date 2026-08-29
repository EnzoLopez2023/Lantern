import { useEffect, useState, type ReactNode } from 'react';
import { scopedStorage as localStorage } from '../../app/storage/scopedStorage';

export interface WizardItem {
  id: string;
  label: ReactNode;
}

export interface WizardGroup {
  heading: string;
  items: WizardItem[];
}

interface WizardChecklistProps {
  storageKey: string;
  groups: WizardGroup[];
}

export default function WizardChecklist({ storageKey, groups }: WizardChecklistProps) {
  const [state, setState] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, storageKey]);

  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const done = Object.values(state).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggle = (id: string) =>
    setState(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="wizard">
      {groups.map((group, gi) => (
        <div key={gi}>
          <h4>{group.heading}</h4>
          <ul>
            {group.items.map(item => {
              const isDone = !!state[item.id];
              return (
                <li key={item.id} className={isDone ? 'done' : ''}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggle(item.id)}
                    />
                    {item.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="progress">
        {done} / {total} complete ({pct}%)
      </div>
    </div>
  );
}
