import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { InteractionStatus } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { authEnvironment, loginRequest } from './config';
import {
  clearStoragePullFailure,
  configureHydrationRetry,
  configureStorageIdentity,
  configureStorageSync,
  hydrateScopedStorage,
  reportStoragePullFailure,
  reportStoragePullStarted,
} from '../storage/scopedStorage';
import { createStateSyncClient, type StateRecord } from '../api/stateSync';
import { configureApiTokenProvider } from '../api/apiFetch';
import { retryableRequest } from '../api/retryableRequest';
import { storageIdentityForAccount, storageIdentityKey as makeStorageIdentityKey } from './authIdentity';
import { BootstrapRecovery } from './BootstrapRecovery';
import { authRedirectFailure } from './bootstrapError';

export function AuthGate({ children }: { children: ReactNode }) {
  const { instance, inProgress } = useMsal();
  const account = instance.getActiveAccount();
  const bypass = authEnvironment.developmentBypass;
  const storageIdentity = bypass
    ? authEnvironment.developmentIdentity
    : storageIdentityForAccount(account, authEnvironment.tenantId);
  const storageIdentityKey = makeStorageIdentityKey(storageIdentity);
  const storageTenant = storageIdentity?.tenant;
  const storageOid = storageIdentity?.oid;
  const [configuredIdentityKey, setConfiguredIdentityKey] = useState<string | null>(null);
  const [hydratedIdentityKey, setHydratedIdentityKey] = useState<string | null>(null);
  const [loginFailure, setLoginFailure] = useState<string | null>(null);
  const initialPulls = useRef(new Map<string, Promise<StateRecord[]>>());

  useLayoutEffect(() => {
    if (!storageIdentityKey || !storageTenant || !storageOid) {
      setConfiguredIdentityKey(null);
      return;
    }
    configureStorageIdentity({ tenant: storageTenant, oid: storageOid });
    setConfiguredIdentityKey(storageIdentityKey);
  }, [storageIdentityKey, storageOid, storageTenant]);

  useEffect(() => {
    if (configuredIdentityKey !== storageIdentityKey) return;
    if (!storageIdentityKey) return;
    const tokenProvider = async (): Promise<string | null> => {
      if (bypass) return null;
      if (!authEnvironment.apiScope) return null;
      const activeAccount = instance.getActiveAccount();
      const activeIdentity = storageIdentityForAccount(activeAccount, authEnvironment.tenantId);
      if (!activeAccount || makeStorageIdentityKey(activeIdentity) !== storageIdentityKey) {
        throw new Error('The active Microsoft account changed. Reload Lantern before syncing.');
      }
      const result = await instance.acquireTokenSilent({ ...loginRequest, account: activeAccount });
      return result.accessToken;
    };
    configureApiTokenProvider(bypass ? null : tokenProvider);
    const sync = createStateSyncClient(tokenProvider);
    let active = true;
    const pullRecords = (force = false): Promise<StateRecord[]> =>
      retryableRequest(
        initialPulls.current,
        storageIdentityKey,
        () => sync.listAll(force),
        force,
      );
    const hydrate = async (force = false): Promise<void> => {
      reportStoragePullStarted();
      try {
        const records = await pullRecords(force);
        if (!active) return;
        hydrateScopedStorage(records);
        clearStoragePullFailure();
      } catch (error) {
        if (active) reportStoragePullFailure(error);
      }
    };
    configureHydrationRetry(() => hydrate(true));
    void (async () => {
      await hydrate();
      if (active) {
        configureStorageSync(mutation => sync.pushMutation(mutation));
        setHydratedIdentityKey(storageIdentityKey);
      }
    })();
    return () => {
      active = false;
      configureHydrationRetry(null);
      configureApiTokenProvider(null);
      configureStorageSync(null);
    };
  }, [bypass, configuredIdentityKey, instance, storageIdentityKey]);

  if (loginFailure) return <BootstrapRecovery error={loginFailure} />;

  if (bypass || account) {
    if (
      configuredIdentityKey !== storageIdentityKey
      || hydratedIdentityKey !== storageIdentityKey
    ) {
      return <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
    }
    return children;
  }

  if (inProgress !== InteractionStatus.None) {
    return <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ minHeight: '70vh', display: 'grid', placeItems: 'center', px: 2 }}>
      <Paper variant="outlined" sx={{ width: 'min(100%, 520px)', p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Stack spacing={2.5}>
          <Typography component="h1" variant="h4">Sign in to Lantern</Typography>
          <Typography color="text.secondary">
            Your study history is isolated by Microsoft Entra tenant and user ID.
          </Typography>
          {!authEnvironment.configured && (
            <Alert severity="warning">
              Authentication is not configured. Set the tenant, client, and API scope environment values, or explicitly enable the development bypass.
            </Alert>
          )}
          <Button
            variant="contained"
            disabled={!authEnvironment.configured}
            onClick={() => {
              void authRedirectFailure(() => instance.loginRedirect(loginRequest))
                .then(error => {
                  if (error) setLoginFailure(error);
                });
            }}
          >
            Continue with Microsoft
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
