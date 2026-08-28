export interface LanternRuntimeConfig {
  tenantId: string;
  clientId: string;
  apiScope: string;
  apiBaseUrl: string;
  allowDevAuth: boolean;
  devTenantId: string;
  devOid: string;
  configurationError: string | null;
}

export const PUBLIC_RUNTIME_CONFIG_KEYS = [
  'tenantId',
  'clientId',
  'apiScope',
  'apiBaseUrl',
  'allowDevAuth',
  'devTenantId',
  'devOid',
] as const;

const text = (value: unknown): string => typeof value === 'string' ? value.trim() : '';
const isConfiguredApiBase = (value: unknown): boolean =>
  typeof value === 'string' ? value.length > 0 : value != null;

export const sanitizeRuntimeConfig = (value: unknown): Partial<LanternRuntimeConfig> => {
  if (!value || typeof value !== 'object') return {};
  const source = value as Record<string, unknown>;
  return {
    tenantId: text(source.tenantId),
    clientId: text(source.clientId),
    apiScope: text(source.apiScope),
    apiBaseUrl: text(source.apiBaseUrl),
    allowDevAuth: source.allowDevAuth === true,
    devTenantId: text(source.devTenantId),
    devOid: text(source.devOid),
  };
};

export const resolveRuntimeConfig = (
  runtimeValue: unknown,
  localFallback: Partial<LanternRuntimeConfig>,
  isLocalDevelopment: boolean,
): LanternRuntimeConfig => {
  const runtime = sanitizeRuntimeConfig(runtimeValue);
  const fallback = isLocalDevelopment ? localFallback : {};
  const tenantId = runtime.tenantId || text(fallback.tenantId);
  const allowDevAuth = runtime.allowDevAuth === true
    || (runtimeValue == null && fallback.allowDevAuth === true);
  const rawRuntimeApiBase = runtimeValue && typeof runtimeValue === 'object'
    ? (runtimeValue as Record<string, unknown>).apiBaseUrl
    : undefined;
  const apiBaseConfigured =
    isConfiguredApiBase(rawRuntimeApiBase)
    || isConfiguredApiBase(localFallback.apiBaseUrl);

  return {
    tenantId,
    clientId: runtime.clientId || text(fallback.clientId),
    apiScope: runtime.apiScope || text(fallback.apiScope),
    apiBaseUrl: '',
    allowDevAuth,
    devTenantId: runtime.devTenantId || text(fallback.devTenantId) || tenantId,
    devOid: runtime.devOid
      || text(fallback.devOid)
      || '00000000-0000-4000-8000-000000000001',
    configurationError: apiBaseConfigured
      ? 'Lantern API base URLs are not configurable. Leave apiBaseUrl and VITE_API_BASE_URL empty so API requests remain on the current origin.'
      : null,
  };
};
