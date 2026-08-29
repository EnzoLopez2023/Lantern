import { AppBar, Box, Button, Container, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import {
  AdminPanelSettingsOutlined,
  DarkModeOutlined,
  LightModeOutlined,
  MenuBookOutlined,
  SchoolOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
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

const links = [
  { to: '/knowledge-base', label: 'Knowledge Base', Icon: MenuBookOutlined },
  { to: '/study-hub', label: 'Study Hub', Icon: SchoolOutlined },
  { to: '/settings', label: 'Settings', Icon: SettingsOutlined },
  { to: '/admin', label: 'Admin', Icon: AdminPanelSettingsOutlined },
];

function AppFrame() {
  const { mode, toggleMode } = useThemeMode();
  const { pathname } = useLocation();
  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 }, gap: 2 }}>
            <Typography component={NavLink} to="/knowledge-base" className="brand-link">
              Lantern
            </Typography>
            <Stack component="nav" aria-label="Primary navigation" direction="row" spacing={0.5} sx={{ ml: 'auto', overflowX: 'auto' }}>
              {links.map(({ to, label, Icon }) => (
                <Button
                  key={to}
                  component={NavLink}
                  to={to}
                  startIcon={<Icon />}
                  className={pathname === to || pathname.startsWith(`${to}/`) ? 'nav-link active' : 'nav-link'}
                >
                  <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>{label}</Box>
                </Button>
              ))}
            </Stack>
            <IconButton aria-label={`Use ${mode === 'dark' ? 'light' : 'dark'} mode`} onClick={toggleMode}>
              {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <AuthGate>
        <Outlet />
      </AuthGate>
    </>
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
