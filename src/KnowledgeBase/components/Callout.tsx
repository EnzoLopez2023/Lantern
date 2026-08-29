import type { ReactNode } from 'react';

type CalloutVariant = 'info' | 'warn' | 'bad' | 'good' | 'tip';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

export default function Callout({ variant = 'info', title, children }: CalloutProps) {
  const cls = variant === 'info' ? 'callout' : `callout ${variant}`;
  return (
    <div className={cls}>
      {title && <h5>{title}</h5>}
      {children}
    </div>
  );
}
