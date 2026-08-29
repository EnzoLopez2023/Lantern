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
import {
  isHydrationActivationReady,
  isCurrentHydrationRequest,
  storageIdentityForAccount,
  storageIdentityKey as makeStorageIdentityKey,
} from './authIdentity';
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
  const [configuredActivation, setConfiguredActivation] = useState<{
    key: string;
    generation: number;
  } | null>(null);
  const [hydratedActivation, setHydratedActivation] = useState<{
    key: string;
    generation: number;
  } | null>(null);
  const [loginFailure, setLoginFailure] = useState<string | null>(null);
  const initialPulls = useRef(new Map<string, Promise<StateRecord[]>>());
  const hydrationGeneration = useRef(0);

  useLayoutEffect(() => {
    const generation = hydrationGeneration.current + 1;
    hydrationGeneration.current = generation;
    setHydratedActivation(null);
    if (!storageIdentityKey || !storageTenant || !storageOid) {
      setConfiguredActivation(null);
      return;
    }
    configureStorageIdentity({ tenant: storageTenant, oid: storageOid });
    setConfiguredActivation({ key: storageIdentityKey, generation });
  }, [storageIdentityKey, storageOid, storageTenant]);

  useEffect(() => {
    if (configuredActivation?.key !== storageIdentityKey) return;
    if (!storageIdentityKey || !storageTenant || !storageOid) return;
    const capturedIdentity = { tenant: storageTenant, oid: storageOid };
    const generation = configuredActivation.generation;
    if (hydrationGeneration.current !== generation) return;
    let active = true;
    const currentIdentityKey = (): string | null => bypass
      ? makeStorageIdentityKey(authEnvironment.developmentIdentity)
      : makeStorageIdentityKey(storageIdentityForAccount(
          instance.getActiveAccount(),
          authEnvironment.tenantId,
        ));
    const isCurrent = (): boolean => active
      && isCurrentHydrationRequest(
        storageIdentityKey,
        generation,
        hydrationGeneration.current,
        currentIdentityKey(),
      );
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
    const pullRecords = (force = false): Promise<StateRecord[]> =>
      retryableRequest(
        initialPulls.current,
        storageIdentityKey,
        () => sync.listAll(force),
      );
    const hydrate = async (force = false): Promise<boolean> => {
      if (!isCurrent()) return false;
      reportStoragePullStarted();
      try {
        const records = await pullRecords(force);
        if (!isCurrent()) return false;
        hydrateScopedStorage(records, capturedIdentity);
        clearStoragePullFailure();
      } catch (error) {
        if (!isCurrent()) return false;
        reportStoragePullFailure(error);
      }
      return isCurrent();
    };
    configureHydrationRetry(async () => {
      if (isCurrent()) await hydrate(true);
    });
    void (async () => {
      const current = await hydrate();
      if (current && isCurrent()) {
        configureStorageSync(mutation => sync.pushMutation(mutation));
        setHydratedActivation({ key: storageIdentityKey, generation });
      }
    })();
    return () => {
      active = false;
      if (hydrationGeneration.current === generation) {
        configureHydrationRetry(null);
        configureApiTokenProvider(null);
        configureStorageSync(null);
      }
    };
  }, [
    bypass,
    configuredActivation,
    instance,
    storageIdentityKey,
    storageOid,
    storageTenant,
  ]);

  if (loginFailure) return <BootstrapRecovery error={loginFailure} />;

  if (bypass || account) {
    if (!isHydrationActivationReady(
      storageIdentityKey,
      hydrationGeneration.current,
      configuredActivation,
      hydratedActivation,
    )) {
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
