import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { getHealth, getVersion, type HealthResponse, type VersionResponse } from '../api/public';

interface ServiceState {
  health?: HealthResponse;
  version?: VersionResponse;
  error?: string;
}

export function AdminPage() {
  const [state, setState] = useState<ServiceState>({});

  useEffect(() => {
    let active = true;
    Promise.all([getHealth(), getVersion()])
      .then(([health, version]) => active && setState({ health, version }))
      .catch(error => active && setState({ error: error instanceof Error ? error.message : 'Unable to load service status' }));
    return () => { active = false; };
  }, []);

  return (
    <Box component="main" className="app-page">
      <Typography component="h1" variant="h3">Service status</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Public deployment metadata and API health.
      </Typography>
      {!state.health && !state.error && <CircularProgress sx={{ mt: 4 }} />}
      {state.error && <Alert severity="error" sx={{ mt: 4 }}>{state.error}</Alert>}
      {state.health && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} sx={{ mt: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
            <Typography component="h2" variant="h5">Health</Typography>
            <Typography component="pre" className="status-json">{JSON.stringify(state.health, null, 2)}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
            <Typography component="h2" variant="h5">Version</Typography>
            <Typography component="pre" className="status-json">{JSON.stringify(state.version, null, 2)}</Typography>
          </Paper>
        </Stack>
      )}
    </Box>
  );
}
