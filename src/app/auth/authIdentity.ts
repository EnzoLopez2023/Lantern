export interface AuthAccountIdentity {
  idTokenClaims?: unknown;
  tenantId?: string;
  localAccountId: string;
}

const claim = (value: unknown, key: string): string | undefined => {
  if (!value || typeof value !== 'object') return undefined;
  const found = (value as Record<string, unknown>)[key];
  return typeof found === 'string' ? found : undefined;
};

export const storageIdentityForAccount = (
  account: AuthAccountIdentity | null,
  fallbackTenant: string,
): { tenant: string; oid: string } | null => account
  ? {
      tenant: claim(account.idTokenClaims, 'tid') || account.tenantId || fallbackTenant,
      oid: claim(account.idTokenClaims, 'oid') || account.localAccountId,
    }
  : null;

export const storageIdentityKey = (
  identity: { tenant: string; oid: string } | null,
): string | null => identity ? `${identity.tenant}\u0000${identity.oid}` : null;

export const isCurrentHydrationRequest = (
  capturedIdentityKey: string,
  capturedGeneration: number,
  currentGeneration: number,
  currentIdentityKey: string | null,
): boolean => capturedGeneration === currentGeneration
  && capturedIdentityKey === currentIdentityKey;

export interface HydrationActivation {
  key: string;
  generation: number;
}

export const isHydrationActivationReady = (
  currentKey: string | null,
  currentGeneration: number,
  configured: HydrationActivation | null,
  hydrated: HydrationActivation | null,
): boolean => Boolean(
  currentKey
  && configured?.key === currentKey
  && configured.generation === currentGeneration
  && hydrated?.key === currentKey
  && hydrated.generation === currentGeneration,
);
