import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, Drawer, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import {
  AdminPanelSettingsOutlined,
  CloseRounded,
  DarkModeOutlined,
  LightModeOutlined,
  MenuRounded,
  MenuBookOutlined,
  SchoolOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AuthGate } from './auth/AuthGate';
import { useThemeMode } from '../context/ThemeContext';
import { KnowledgeBaseRoute } from './pages/KnowledgeBaseRoute';
import { StudyHubRoute } from './pages/StudyHubRoute';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { SignOutButton } from './auth/SignOutButton';

const links = [
  { to: '/knowledge-base', label: 'Knowledge Base', Icon: MenuBookOutlined },
  { to: '/study-hub', label: 'Study Hub', Icon: SchoolOutlined },
  { to: '/settings', label: 'Settings', Icon: SettingsOutlined },
  { to: '/admin', label: 'Admin', Icon: AdminPanelSettingsOutlined },
];

const SIDEBAR_WIDTH = 260;

interface SideNavigationProps {
  mode: 'light' | 'dark';
  pathname: string;
  toggleMode: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}

function SideNavigation({
  mode,
  pathname,
  toggleMode,
  onNavigate,
  onClose,
}: SideNavigationProps) {
  return (
    <Stack sx={{ height: '100%', gap: 2, px: 1.5, py: 2 }}>
      <Box
        sx={{
          minHeight: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
        }}
      >
        <Typography
          component={NavLink}
          to="/knowledge-base"
          className="brand-link"
          onClick={onNavigate}
        >
          Lantern
        </Typography>
        {onClose && (
          <IconButton aria-label="Close navigation" size="small" onClick={onClose}>
            <CloseRounded fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Stack component="nav" aria-label="Primary navigation" sx={{ gap: 0.5 }}>
        {links.map(({ to, label, Icon }) => {
          const active = pathname === to || pathname.startsWith(`${to}/`);
          return (
            <Button
              key={to}
              component={NavLink}
              to={to}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
              startIcon={<Icon />}
              sx={{
                minHeight: 44,
                justifyContent: 'flex-start',
                px: 1.5,
                borderRadius: '14px',
                color: active ? 'primary.main' : 'text.secondary',
                backgroundColor: active ? 'action.selected' : 'transparent',
                fontWeight: active ? 700 : 600,
                '&:hover': {
                  color: 'text.primary',
                  backgroundColor: 'action.hover',
                },
                '& .MuiButton-startIcon': {
                  ml: 0,
                  mr: 1.25,
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 20,
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Stack>

      <Box sx={{ flex: 1, minHeight: 16 }} />

      <Stack
        sx={{
          gap: 0.5,
          pt: 1.25,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          aria-label={`Use ${mode === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleMode}
          startIcon={mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
          sx={{
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
            '& .MuiSvgIcon-root': {
              fontSize: 20,
            },
          }}
        >
          Use {mode === 'dark' ? 'light' : 'dark'} mode
        </Button>
        <SignOutButton inSidebar />
      </Stack>
    </Stack>
  );
}

function AuthedShell({ children }: { children: ReactNode }) {
  const { mode, toggleMode } = useThemeMode();
  const { pathname } = useLocation();
  const theme = useTheme();
  const permanent = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
    noSsr: true,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (permanent) setDrawerOpen(false);
  }, [permanent]);

  const sidebarShadow = mode === 'dark'
    ? '0 12px 32px -14px rgba(0,0,0,.72), 0 4px 10px -6px rgba(0,0,0,.55)'
    : '0 12px 32px -14px rgba(45,27,38,.28), 0 4px 10px -6px rgba(45,27,38,.18)';
  const chromeSurface = {
    backgroundColor: alpha(theme.palette.background.paper, mode === 'dark' ? 0.9 : 0.86),
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, mode === 'dark' ? 0.88 : 0.72),
    boxShadow: sidebarShadow,
    '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))': {
      backgroundColor: theme.palette.background.paper,
    },
  } as const;

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'fixed',
          top: -64,
          left: 12,
          zIndex: theme.zIndex.drawer + 2,
          px: 2,
          py: 1,
          borderRadius: '14px',
          color: 'text.primary',
          backgroundColor: 'background.paper',
          boxShadow: sidebarShadow,
          textDecoration: 'none',
          '&:focus': { top: 12 },
        }}
      >
        Skip to content
      </Box>

      {permanent ? (
        <Box
          component="aside"
          sx={{
            ...chromeSurface,
            position: 'sticky',
            top: 12,
            width: SIDEBAR_WIDTH,
            height: 'calc(100dvh - 24px)',
            flexShrink: 0,
            alignSelf: 'flex-start',
            m: 1.5,
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <SideNavigation
            mode={mode}
            pathname={pathname}
            toggleMode={toggleMode}
          />
        </Box>
      ) : (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            id: 'primary-navigation-drawer',
            sx: {
              ...chromeSurface,
              width: SIDEBAR_WIDTH,
              maxWidth: 'calc(100% - 24px)',
              height: 'calc(100% - 24px)',
              m: 1.5,
              borderRadius: '14px',
              backgroundImage: 'none',
              overflow: 'hidden',
            },
          }}
        >
          <SideNavigation
            mode={mode}
            pathname={pathname}
            toggleMode={toggleMode}
            onNavigate={() => setDrawerOpen(false)}
            onClose={() => setDrawerOpen(false)}
          />
        </Drawer>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {!permanent && (
          <Box
            component="header"
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: theme.zIndex.appBar,
              p: 1.5,
              pb: 0,
            }}
          >
            <Box
              sx={{
                ...chromeSurface,
                minHeight: 56,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.25,
                borderRadius: '14px',
              }}
            >
              <IconButton
                aria-label="Open navigation"
                aria-controls="primary-navigation-drawer"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuRounded />
              </IconButton>
              <Typography component={NavLink} to="/knowledge-base" className="brand-link">
                Lantern
              </Typography>
            </Box>
          </Box>
        )}
        <Box
          id="main-content"
          tabIndex={-1}
          sx={{
            minWidth: 0,
            '&:focus': { outline: 'none' },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function AppFrame() {
  return (
    <AuthGate>
      <AuthedShell>
        <Outlet />
      </AuthedShell>
    </AuthGate>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppFrame />}>
          <Route index element={<Navigate replace to="/knowledge-base" />} />
          <Route path="/knowledge-base" element={<KnowledgeBaseRoute />} />
          <Route path="/knowledge-base/:guideId" element={<KnowledgeBaseRoute />} />
          <Route path="/study-hub" element={<StudyHubRoute />} />
          <Route path="/study-hub/:examId/*" element={<StudyHubRoute />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate replace to="/knowledge-base" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
