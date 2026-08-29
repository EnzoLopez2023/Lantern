import { resolveRuntimeConfig } from './resolveRuntimeConfig';

const viteEnvironment = import.meta.env ?? {};

export const runtimeConfig = resolveRuntimeConfig(
  typeof window === 'undefined' ? undefined : window.__LANTERN_RUNTIME_CONFIG__,
  {
    tenantId: viteEnvironment.VITE_AZURE_AD_TENANT_ID,
    clientId: viteEnvironment.VITE_AZURE_AD_CLIENT_ID,
    apiScope: viteEnvironment.VITE_AZURE_AD_API_SCOPE,
    apiBaseUrl: viteEnvironment.VITE_API_BASE_URL,
    allowDevAuth: viteEnvironment.VITE_ALLOW_DEV_AUTH === 'true',
    devTenantId: viteEnvironment.VITE_DEV_AUTH_TENANT_ID,
    devOid: viteEnvironment.VITE_DEV_AUTH_OID,
  },
  viteEnvironment.DEV,
);
