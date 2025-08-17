import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import ChatInterface from './components/ChatInterface';
import ApplicationForm from './components/ApplicationForm';
import DocumentUpload from './components/DocumentUpload';
import Results from './components/Results';
import DocumentsPage from './components/DocumentsPage';
import RawResults from './components/RawResults';
import { useAppStore } from './store/appStore';

// Create professional banking theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Professional blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // Accent red
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          padding: '10px 24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

function App() {
  const { currentView } = useAppStore();

  const renderMainContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'chat':
        return <ChatInterface />;
      case 'application':
        return <ApplicationForm />;
      case 'upload':
        return <DocumentUpload />;
      case 'results':
        return <Results />;
      case 'rawResults':
        return <RawResults />;
      case 'docs':
        return <DocumentsPage />;
      default:
        return <HomePage />;
    }
  };

  // Show sidebar only for internal pages, not for home page
  const showSidebar = currentView !== 'home';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'background.default' }}>
          {showSidebar && <Sidebar />}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: 'background.default',
              overflow: 'auto',
            }}
          >
            <Routes>
              <Route path="/" element={renderMainContent()} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/application" element={<ApplicationForm />} />
              <Route path="/upload" element={<DocumentUpload />} />
              <Route path="/results" element={<Results />} />
              <Route path="/docs" element={<DocumentsPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
