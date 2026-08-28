import { useState, type ReactNode } from 'react';

export interface TabDef {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

interface TabGroupProps {
  tabs: TabDef[];
  initialId?: string;
}

export default function TabGroup({ tabs, initialId }: TabGroupProps) {
  const [activeId, setActiveId] = useState(initialId ?? tabs[0]?.id);

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={activeId === tab.id ? 'active' : ''}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map(tab => (
          <div key={tab.id} className={activeId === tab.id ? 'active' : ''}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
