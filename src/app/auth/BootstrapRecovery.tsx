import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { authEnvironment, msalInstance } from './config';

export function BootstrapRecovery({ error }: { error: string }) {
  const clearAndRetry = async () => {
    try {
      await msalInstance.clearCache();
    } catch {
      // Reloading still provides the recovery path when cache clearing fails.
    } finally {
      window.location.assign('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper variant="outlined" sx={{ width: 'min(100%, 560px)', p: { xs: 3, md: 5 } }}>
        <Stack spacing={2.5}>
          <Typography component="h1" variant="h4">Lantern could not start sign-in</Typography>
          <Alert severity="error">{error}</Alert>
          <Typography color="text.secondary">
            Retry first. If a redirect was interrupted, clear the cached sign-in and begin again.
          </Typography>
          {!authEnvironment.configured && (
            <Alert severity="warning">
              Configure AZURE_AD_TENANT_ID, AZURE_AD_CLIENT_ID, and AZURE_AD_API_SCOPE on the Lantern server before retrying.
            </Alert>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
            <Button variant="outlined" onClick={() => void clearAndRetry()}>Clear sign-in and retry</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
