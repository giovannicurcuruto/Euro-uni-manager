


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider } from './contexts/ThemeContext';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import VisualizarUnidades from './pages/VisualizarUnidades';
import AdicionarUnidades from './pages/AdicionarUnidades';
import MonitoramentoUnidade from './pages/MonitoramentoUnidade';
import AdicionarFalhas from './pages/AdicionarFalhas';
import ListagemFalhas from './pages/ListagemFalhas';
import Dashboard from './pages/Dashboard';

// O tema foi movido para o ThemeContext

// Importando o Sidebar
import Sidebar from './components/Sidebar';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 0 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/visualizar-unidades" element={<VisualizarUnidades />} />
                <Route path="/adicionar-unidades" element={<AdicionarUnidades />} />
                <Route path="/monitoramento-unidade" element={<MonitoramentoUnidade />} />
                <Route path="/adicionar-falhas" element={<AdicionarFalhas />} />
                <Route path="/listagem-falhas" element={<ListagemFalhas />} />
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
