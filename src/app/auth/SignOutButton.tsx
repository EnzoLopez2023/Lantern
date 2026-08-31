import { useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Snackbar, Stack } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { useMsal } from '@azure/msal-react';
import { authEnvironment } from './config';
import { authRedirectFailure } from './bootstrapError';

export function SignOutButton({
  inHeader = false,
  inSidebar = false,
}: {
  inHeader?: boolean;
  inSidebar?: boolean;
}) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const signingOutRef = useRef(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const inShell = inHeader || inSidebar;

  if (authEnvironment.developmentBypass || !activeAccount) return null;

  const signOut = async () => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;
    setIsSigningOut(true);
    setFailure(null);

    const error = await authRedirectFailure(
      () => instance.logoutRedirect({ account: activeAccount }),
      'Microsoft sign-out could not be started.',
    );
    if (error) {
      signingOutRef.current = false;
      setIsSigningOut(false);
      setFailure(error);
    }
  };

  const button = (
    <Button
      aria-label={isSigningOut ? 'Signing out of Lantern' : 'Sign out of Lantern'}
      color={inShell ? 'inherit' : 'primary'}
      disabled={isSigningOut}
      onClick={() => void signOut()}
      startIcon={
        isSigningOut
          ? <CircularProgress color="inherit" size={18} />
          : <LogoutOutlined />
      }
      variant={inShell ? 'text' : 'outlined'}
      sx={inSidebar ? {
        width: '100%',
        minHeight: 44,
        justifyContent: 'flex-start',
        px: 1.5,
        borderRadius: '14px',
        color: 'text.secondary',
        '&:hover': {
          color: 'text.primary',
          backgroundColor: 'action.hover',
        },
        '& .MuiButton-startIcon': {
          ml: 0,
          mr: 1.25,
        },
      } : inHeader ? {
        flexShrink: 0,
        minWidth: { xs: 40, md: 'auto' },
        px: { xs: 1, md: 1.5 },
        '& .MuiButton-startIcon': {
          m: { xs: 0, md: '0 8px 0 -4px' },
        },
      } : undefined}
    >
      <Box component="span" sx={inHeader ? { display: { xs: 'none', md: 'inline' } } : undefined}>
        {isSigningOut ? 'Signing out…' : 'Sign out'}
      </Box>
    </Button>
  );

  if (inShell) {
    return (
      <>
        {button}
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(failure)}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setFailure(null)}
          >
            We couldn’t sign you out. {failure} Try again.
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      {button}
      {failure && (
        <Alert severity="error" onClose={() => setFailure(null)}>
          We couldn’t sign you out. {failure} Try again.
        </Alert>
      )}
    </Stack>
  );
}
