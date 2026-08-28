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
