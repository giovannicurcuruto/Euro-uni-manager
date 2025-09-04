


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import VisualizarUnidades from './pages/VisualizarUnidades';
import AdicionarUnidades from './pages/AdicionarUnidades';
import MonitoramentoUnidade from './pages/MonitoramentoUnidade';
import AdicionarFalhas from './pages/AdicionarFalhas';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00B388', // Verde Eurotec
      light: '#4ce5b6',
      dark: '#00835e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f5f5f5', // Cinza claro para contraste
      light: '#ffffff',
      dark: '#c2c2c2',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#00B388',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#333333',
    },
    h5: {
      fontWeight: 600,
      color: '#333333',
    },
    h6: {
      fontWeight: 600,
      color: '#333333',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          backgroundColor: '#00B388',
          '&:hover': {
            backgroundColor: '#00835e',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        outlinedPrimary: {
          borderColor: '#00B388',
          color: '#00B388',
          '&:hover': {
            backgroundColor: 'rgba(0, 179, 136, 0.04)',
            borderColor: '#00835e',
          },
        },
        textPrimary: {
          color: '#00B388',
          '&:hover': {
            backgroundColor: 'rgba(0, 179, 136, 0.04)',
          },
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#00B388',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Importando o Sidebar
import Sidebar from './components/Sidebar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 0 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/visualizar-unidades" element={<VisualizarUnidades />} />
                <Route path="/adicionar-unidades" element={<AdicionarUnidades />} />
                <Route path="/monitoramento-unidade" element={<MonitoramentoUnidade />} />
                <Route path="/adicionar-falhas" element={<AdicionarFalhas />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
