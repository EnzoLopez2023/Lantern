import {
  BrowserCacheLocation,
  PublicClientApplication,
  type Configuration,
} from '@azure/msal-browser';
import { runtimeConfig } from '../config/runtimeConfig';

const { tenantId, clientId, apiScope } = runtimeConfig;

export const authEnvironment = {
  tenantId,
  clientId,
  apiScope,
  configured: Boolean(tenantId && clientId && apiScope),
  developmentBypass: runtimeConfig.allowDevAuth,
  developmentIdentity: {
    tenant: runtimeConfig.devTenantId,
    oid: runtimeConfig.devOid,
  },
} as const;

const configuration: Configuration = {
  auth: {
    clientId: clientId || 'lantern-unconfigured',
    authority: `https://login.microsoftonline.com/${tenantId || 'organizations'}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};

export const msalInstance = new PublicClientApplication(configuration);

export const loginRequest = {
  scopes: apiScope ? [apiScope] : ['openid', 'profile'],
};
