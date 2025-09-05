import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Interfaces
interface Unidade {
  id: number;
  nome_unidade: string;
  grupo_unidade: string;
  tecnico_unidade: string;
  id_unidade: string;
  observacoes: string;
  created_at?: string;
  updated_at?: string;
}

interface Falha {
  id: number;
  falha_ocorrida: string;
  data_falha: string;
  ativa: boolean;
  observacao?: string;
  unidade: number;
  created_at?: string;
  updated_at?: string;
}

interface UnidadeComFalha extends Unidade {
  ultimaFalha?: Falha;
}

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.primary.main, 0.2)
    : alpha(theme.palette.primary.main, 0.1),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5),
  color: theme.palette.text.primary,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? alpha(theme.palette.primary.main, 0.2)
    : alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.mode === 'dark' 
    ? theme.palette.primary.light
    : theme.palette.primary.main,
  fontWeight: 'bold',
  borderBottom: `2px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.05)
      : alpha(theme.palette.primary.main, 0.02),
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.primary.main, 0.05),
  },
}));

function Home() {
  const [unidades, setUnidades] = useState<UnidadeComFalha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Função para buscar dados do backend
  const fetchDados = async () => {
    try {
      setLoading(true);
      setError('');

      // Buscar unidades
      const unidadesResponse = await fetch('http://127.0.0.1:8000/api/unidades/');
      if (!unidadesResponse.ok) {
        throw new Error('Erro ao carregar unidades');
      }
      const unidadesData: Unidade[] = await unidadesResponse.json();

      // Buscar falhas
      const falhasResponse = await fetch('http://127.0.0.1:8000/api/falhas/');
      if (!falhasResponse.ok) {
        throw new Error('Erro ao carregar falhas');
      }
      const falhasData: Falha[] = await falhasResponse.json();

      // Combinar dados e pegar apenas as 5 unidades mais recentes
      const unidadesComFalhas: UnidadeComFalha[] = unidadesData
        .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
        .slice(0, 5)
        .map(unidade => {
          // Encontrar a falha mais recente para cada unidade
          const falhasUnidade = falhasData
            .filter(falha => falha.unidade === unidade.id)
            .sort((a, b) => new Date(b.data_falha).getTime() - new Date(a.data_falha).getTime());
          
          return {
            ...unidade,
            ultimaFalha: falhasUnidade[0] || undefined
          };
        });

      setUnidades(unidadesComFalhas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  // Função para formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
          Gerenciamento de Unidades
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          Bem-vindo ao sistema de gerenciamento de unidades. Abaixo estão listadas as 5 unidades mais recentes com suas respectivas informações.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell>Unidade</StyledHeaderCell>
                <StyledHeaderCell>Grupo</StyledHeaderCell>
                <StyledHeaderCell>Técnico</StyledHeaderCell>
                <StyledHeaderCell>ID Unidade</StyledHeaderCell>
                <StyledHeaderCell>Última Falha</StyledHeaderCell>
                <StyledHeaderCell>Data da Falha</StyledHeaderCell>
                <StyledHeaderCell>Status</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ ml: 2 }}>Carregando dados...</Typography>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ) : unidades.length > 0 ? (
                unidades.map((unidade) => (
                  <StyledTableRow key={unidade.id}>
                    <StyledTableCell>
                      <Typography variant="body2" fontWeight="medium">{unidade.nome_unidade}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        label={unidade.grupo_unidade} 
                        size="small" 
                        sx={({ palette }) => ({ 
                          bgcolor: alpha('#00B388', palette.mode === 'dark' ? 0.2 : 0.1), 
                          color: palette.mode === 'dark' ? '#4ade80' : '#00B388',
                          fontWeight: 'medium',
                          fontSize: '0.75rem'
                        })} 
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      {unidade.tecnico_unidade || '-'}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        label={unidade.id_unidade} 
                        size="small" 
                        sx={({ palette }) => ({ 
                          bgcolor: palette.mode === 'dark' ? alpha(palette.grey[400], 0.2) : '#f0f0f0',
                          color: palette.mode === 'dark' ? palette.grey[300] : palette.text.primary,
                          fontWeight: 'medium',
                          fontSize: '0.75rem'
                        })} 
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      {unidade.ultimaFalha ? unidade.ultimaFalha.falha_ocorrida : '-'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {unidade.ultimaFalha ? formatarData(unidade.ultimaFalha.data_falha) : '-'}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        label={unidade.ultimaFalha?.ativa ? 'Ativa' : 'Sem Falhas'} 
                        size="small" 
                        sx={({ palette }) => ({ 
                          bgcolor: unidade.ultimaFalha?.ativa 
                            ? alpha('#f44336', palette.mode === 'dark' ? 0.2 : 0.1) 
                            : alpha('#4caf50', palette.mode === 'dark' ? 0.2 : 0.1), 
                          color: unidade.ultimaFalha?.ativa 
                            ? (palette.mode === 'dark' ? '#ff6b6b' : '#f44336') 
                            : (palette.mode === 'dark' ? '#51cf66' : '#4caf50'),
                          fontWeight: 'medium',
                          fontSize: '0.75rem'
                        })} 
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Nenhuma unidade encontrada
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>

      {/* Estatísticas resumidas */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="h4" color="primary" fontWeight="bold">
              {unidades.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unidades Recentes
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="h4" color="error" fontWeight="bold">
              {unidades.filter(u => u.ultimaFalha?.ativa).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Falhas Ativas
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {unidades.filter(u => !u.ultimaFalha?.ativa).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sem Falhas
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;