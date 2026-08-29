/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_AD_TENANT_ID?: string;
  readonly VITE_AZURE_AD_CLIENT_ID?: string;
  readonly VITE_AZURE_AD_API_SCOPE?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ALLOW_DEV_AUTH?: string;
  readonly VITE_DEV_AUTH_TENANT_ID?: string;
  readonly VITE_DEV_AUTH_OID?: string;
}

interface Window {
  __LANTERN_RUNTIME_CONFIG__?: {
    tenantId: string;
    clientId: string;
    apiScope: string;
    apiBaseUrl: string;
    allowDevAuth: boolean;
    devTenantId: string;
    devOid: string;
  };
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
