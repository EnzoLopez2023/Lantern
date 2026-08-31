import { useState, useSyncExternalStore } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  acceptConflictServerValue,
  claimLegacyEntries,
  getStorageIdentity,
  getStorageSyncStatus,
  retryStorageHydration,
  retryConflictLocalValue,
  retryStorageSync,
  subscribeStorageSyncStatus,
  type LegacyClaimResult,
} from '../storage/scopedStorage';
import { useThemeMode } from '../../context/ThemeContext';
import { SignOutButton } from '../auth/SignOutButton';

const conflictValue = (value: string | null, tombstone: boolean): string => {
  if (tombstone) return 'Deleted (tombstone)';
  if (value === null) return 'Unavailable';
  return value.length > 600 ? `${value.slice(0, 600)}…` : value;
};

const evidenceText = (evidence: unknown): string => {
  try {
    const serialized = JSON.stringify(evidence, null, 2);
    return serialized.length > 4_000 ? `${serialized.slice(0, 4_000)}…` : serialized;
  } catch {
    return String(evidence ?? 'Unavailable');
  }
};

export function SettingsPage() {
  const { mode, toggleMode } = useThemeMode();
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<LegacyClaimResult | null>(null);
  const identity = getStorageIdentity();
  const syncStatus = useSyncExternalStore(
    subscribeStorageSyncStatus,
    getStorageSyncStatus,
    getStorageSyncStatus,
  );
  const pendingLabel = `${syncStatus.pendingCount}${syncStatus.pendingOverflow ? '+' : ''}`;

  return (
    <Box component="main" className="app-page">
      <Typography component="h1" variant="h3">Settings</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Manage appearance, identity, and the optional one-time import of browser data from Hearth.
      </Typography>

      <Stack spacing={3} sx={{ mt: 4 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography component="h2" variant="h5">Appearance</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Lantern is currently using {mode} mode.
          </Typography>
          <Button variant="outlined" onClick={toggleMode}>Use {mode === 'dark' ? 'light' : 'dark'} mode</Button>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography component="h2" variant="h5">Signed-in storage</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Tenant: <code>{identity.tenant}</code><br />
            User: <code>{identity.oid}</code>
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            New browser data is stored under a tenant-and-user namespace. Existing Hearth keys are never read or claimed automatically.
          </Alert>
          <Alert
            severity={syncStatus.state === 'error' ? 'warning' : syncStatus.pendingCount ? 'info' : 'success'}
            sx={{ mt: 2 }}
            action={
              syncStatus.hydrationState === 'error'
                ? <Button color="inherit" size="small" onClick={retryStorageHydration}>Retry hydration</Button>
                : syncStatus.state === 'error' && syncStatus.pendingCount > 0
                ? <Button color="inherit" size="small" onClick={retryStorageSync}>Retry</Button>
                : undefined
            }
          >
            {syncStatus.hydrationState === 'pulling' && 'Loading signed-in state from the server…'}
            {syncStatus.hydrationState === 'error' && `Initial server hydration failed; local data remains available. ${syncStatus.hydrationError ?? ''}`}
            {syncStatus.hydrationState !== 'pulling' && syncStatus.hydrationState !== 'error' && syncStatus.state === 'syncing' && `Syncing ${pendingLabel} pending change${syncStatus.pendingCount === 1 ? '' : 's'}…`}
            {syncStatus.hydrationState !== 'pulling' && syncStatus.hydrationState !== 'error' && syncStatus.state === 'offline' && `${pendingLabel} change${syncStatus.pendingCount === 1 ? '' : 's'} safely queued on this device.`}
            {syncStatus.hydrationState !== 'pulling' && syncStatus.hydrationState !== 'error' && syncStatus.state === 'idle' && (syncStatus.pendingCount
              ? `${pendingLabel} change${syncStatus.pendingCount === 1 ? '' : 's'} waiting to sync.`
              : 'All local changes are synced.')}
            {syncStatus.hydrationState !== 'error' && syncStatus.state === 'error' && (syncStatus.pendingCount
              ? `${pendingLabel} change${syncStatus.pendingCount === 1 ? '' : 's'} preserved for retry. ${syncStatus.lastError ?? ''}`
              : `Server sync needs attention; local data remains available. ${syncStatus.lastError ?? ''}`)}
            {syncStatus.deadLetterCount > 0 && ` ${syncStatus.deadLetterCount}${syncStatus.deadLetterOverflow ? '+' : ''} rejected change${syncStatus.deadLetterCount === 1 ? '' : 's'} require review.`}
            {syncStatus.conflictCount > 0 && (
              ` ${syncStatus.conflictCount}${syncStatus.conflictOverflow ? '+' : ''} conflicted change${syncStatus.conflictCount === 1 ? '' : 's'} retained for user action; server state was not overwritten. ${syncStatus.conflictSummary ?? ''}`
            )}
          </Alert>
          {syncStatus.conflicts.length > 0 && (
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Box>
                <Typography component="h3" variant="h6">Resolve sync conflicts</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                  Review both versions. Accepting the server keeps any later queued edits; retrying local sends this device’s conflicted version against the shown server revision.
                </Typography>
              </Box>
              {syncStatus.resolutionError && (
                <Alert severity="error">{syncStatus.resolutionError}</Alert>
              )}
              {syncStatus.conflicts.map(conflict => {
                const selected = {
                  id: conflict.id,
                  kind: conflict.kind,
                  key: conflict.key,
                };
                return (
                  <Paper
                    key={conflict.id}
                    variant="outlined"
                    sx={{ p: 2.5, bgcolor: 'background.default' }}
                  >
                    <Stack spacing={2}>
                      <Box>
                        <Typography component="h4" variant="subtitle1" fontWeight={700}>
                          {conflict.key}
                        </Typography>
                        <Typography color="text.secondary" variant="caption">
                          {conflict.kind} · conflict {conflict.id}
                        </Typography>
                      </Box>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="overline" color="text.secondary">
                            This device · base revision {conflict.baseRevision}
                          </Typography>
                          <Box
                            component="pre"
                            sx={{ m: 0, mt: 0.5, p: 1.5, borderRadius: 1, overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12 }}
                          >
                            {conflictValue(conflict.localValue, conflict.localValue === null)}
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="overline" color="text.secondary">
                            Server · revision {conflict.serverRevision ?? 'unknown'}
                          </Typography>
                          <Box
                            component="pre"
                            sx={{ m: 0, mt: 0.5, p: 1.5, borderRadius: 1, overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 12 }}
                          >
                            {conflictValue(
                              conflict.serverValue,
                              conflict.serverTombstone === true,
                            )}
                          </Box>
                        </Box>
                      </Stack>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Server evidence
                        </Typography>
                        <Box
                          component="pre"
                          sx={{ m: 0, mt: 0.5, maxHeight: 180, p: 1.5, borderRadius: 1, overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 11 }}
                        >
                          {evidenceText(conflict.serverEvidence)}
                        </Box>
                      </Box>
                      {conflict.evidenceError && (
                        <Alert severity="error">{conflict.evidenceError}</Alert>
                      )}
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button
                          variant="outlined"
                          disabled={Boolean(conflict.evidenceError)}
                          onClick={() => acceptConflictServerValue(selected)}
                        >
                          Accept server
                        </Button>
                        <Button
                          color="warning"
                          variant="contained"
                          disabled={Boolean(conflict.evidenceError)}
                          onClick={() => {
                            const confirmedRetry = window.confirm(
                              `Retry this device’s value for “${conflict.key}” against server revision ${conflict.serverRevision}?`,
                            );
                            if (confirmedRetry) retryConflictLocalValue(selected, true);
                          }}
                        >
                          Retry local
                        </Button>
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography component="h2" variant="h5">Claim legacy Hearth data</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Copy recognized analytics, bookmarks, study stats, notes, resume snapshots, streaks, guide progress, quizzes, and checklist data into this signed-in Lantern profile. Original keys remain untouched after verification.
          </Typography>
          <FormControlLabel
            sx={{ mt: 2, alignItems: 'flex-start' }}
            control={<Checkbox checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />}
            label="I confirm this browser’s legacy Hearth study data belongs to my current Lantern account."
          />
          <Box>
            <Button
              variant="contained"
              disabled={!confirmed}
              onClick={() => setResult(claimLegacyEntries(true))}
            >
              Copy and verify legacy data
            </Button>
          </Box>
          {result && (
            <Alert severity={result.failed.length ? 'warning' : 'success'} sx={{ mt: 2 }}>
              Found {result.found}; copied {result.copied}; already present {result.alreadyPresent}.
              {result.failed.length ? ` Failed: ${result.failed.join(', ')}` : ' Legacy keys were preserved.'}
            </Alert>
          )}
        </Paper>

        <Box>
          <SignOutButton />
        </Box>
      </Stack>
    </Box>
  );
}
