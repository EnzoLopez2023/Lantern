import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { AuthRoot } from './app/auth/AuthRoot';
import { msalInstance } from './app/auth/config';
import { ThemeModeProvider } from './context/ThemeContext';
import { BootstrapRecovery } from './app/auth/BootstrapRecovery';
import { bootstrapErrorMessage, prepareAuthClient } from './app/auth/bootstrapError';
import { runtimeConfig } from './app/config/runtimeConfig';
import './index.css';

async function bootstrap() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Lantern root element was not found.');
  const root = createRoot(rootElement);
  try {
    if (runtimeConfig.configurationError) throw new Error(runtimeConfig.configurationError);
    await prepareAuthClient(msalInstance);
    root.render(
      <StrictMode>
        <AuthRoot>
          <ThemeModeProvider>
            <App />
          </ThemeModeProvider>
        </AuthRoot>
      </StrictMode>,
    );
  } catch (error) {
    root.render(
      <ThemeModeProvider>
        <BootstrapRecovery error={bootstrapErrorMessage(error)} />
      </ThemeModeProvider>,
    );
  }
}

void bootstrap();
