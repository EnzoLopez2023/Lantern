import { MsalProvider } from '@azure/msal-react';
import type { ReactNode } from 'react';
import { msalInstance } from './config';

export function AuthRoot({ children }: { children: ReactNode }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
