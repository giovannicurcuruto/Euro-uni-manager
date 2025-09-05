import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

// Interfaces para os dados do backend
interface Unidade {
  id: number;
  nome_unidade: string;
  grupo_unidade: string;
  tecnico_unidade: string;
  id_unidade: string;
  created_at: string;
  updated_at: string;
}

interface Falha {
  id: number;
  falha_ocorrida: string;
  data_falha: string;
  ativa: boolean;
  observacao?: string;
  unidade: number;
  created_at: string;
  updated_at: string;
}

interface FalhaComUnidade extends Falha {
  unidade_nome: string;
}

function ListagemFalhas() {
  const navigate = useNavigate();
  const [todasFalhas, setTodasFalhas] = useState<FalhaComUnidade[]>([]);
  const [mostrarEncerradas, setMostrarEncerradas] = useState<boolean>(false);
  const [falhasFiltradas, setFalhasFiltradas] = useState<FalhaComUnidade[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [falhaEditando, setFalhaEditando] = useState<FalhaComUnidade | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  // Função para buscar unidades e falhas do backend
  const fetchFalhasEUnidades = async () => {
    try {
      setLoading(true);
      
      // Busca unidades e falhas em paralelo
      const [unidadesResponse, falhasResponse] = await Promise.all([
        fetch('http://localhost:8000/api/unidades/'),
        fetch('http://localhost:8000/api/falhas/')
      ]);
      
      if (!unidadesResponse.ok || !falhasResponse.ok) {
        throw new Error('Erro ao buscar dados do servidor');
      }
      
      const unidadesData: Unidade[] = await unidadesResponse.json();
      const falhasData: Falha[] = await falhasResponse.json();
      
      setUnidades(unidadesData);
      
      // Combina falhas com nomes das unidades
      const falhasComUnidade: FalhaComUnidade[] = falhasData.map(falha => {
        const unidade = unidadesData.find(u => u.id === falha.unidade);
        return {
          ...falha,
          unidade_nome: unidade?.nome_unidade || 'Unidade Desconhecida'
        };
      });
      
      // Ordena as falhas por data (mais recentes primeiro)
      const falhasOrdenadas = falhasComUnidade.sort((a, b) => {
        const dataA = new Date(a.data_falha);
        const dataB = new Date(b.data_falha);
        return dataB.getTime() - dataA.getTime();
      });
      
      setTodasFalhas(falhasOrdenadas);
    } catch (error) {
      console.error('Erro ao buscar falhas:', error);
      setErrorMessage('Erro ao carregar falhas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carrega todas as falhas de todas as unidades
  useEffect(() => {
    fetchFalhasEUnidades();
  }, []);

  // Filtra as falhas com base na opção de mostrar encerradas
  useEffect(() => {
    if (mostrarEncerradas) {
      setFalhasFiltradas(todasFalhas);
    } else {
      setFalhasFiltradas(todasFalhas.filter(falha => falha.ativa));
    }
  }, [mostrarEncerradas, todasFalhas]);

  const handleEditClick = (falha: FalhaComUnidade) => {
    setFalhaEditando(falha);
    setOpenEditDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setFalhaEditando(null);
  };
  
  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  const handleSaveEdit = async () => {
    if (!falhaEditando) return;
    
    try {
      setLoadingEdit(true);
      
      const response = await fetch(`http://localhost:8000/api/falhas/${falhaEditando.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          falha_ocorrida: falhaEditando.falha_ocorrida,
          data_falha: falhaEditando.data_falha,
          ativa: falhaEditando.ativa,
          observacao: falhaEditando.observacao,
          unidade: falhaEditando.unidade
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar falha');
      }
      
      // Atualiza o estado local
      const updatedTodasFalhas = todasFalhas.map(f => 
        f.id === falhaEditando.id ? falhaEditando : f
      );
      
      setTodasFalhas(updatedTodasFalhas);
      setSuccessMessage('Falha atualizada com sucesso!');
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar falha:', error);
      setErrorMessage('Erro ao salvar falha. Tente novamente.');
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Listagem de Falhas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/adicionar-falhas')}
          sx={{ height: 'fit-content' }}
        >
          Nova Falha
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={mostrarEncerradas}
                onChange={(e) => setMostrarEncerradas(e.target.checked)}
                color="primary"
              />
            }
            label="Mostrar falhas resolvidas"
          />
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ ml: 2 }}>Carregando falhas...</Typography>
          </Box>
        ) : falhasFiltradas.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2" fontWeight="bold">Unidade</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" fontWeight="bold">Falha Ocorrida</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" fontWeight="bold">Data da Falha</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" fontWeight="bold">Status</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" fontWeight="bold">Observação</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2" fontWeight="bold">Ações</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {falhasFiltradas.map((falha) => (
                  <TableRow key={`${falha.id}-${falha.unidade_nome}`}>
                    <TableCell>{falha.unidade_nome}</TableCell>
                    <TableCell>{falha.falha_ocorrida}</TableCell>
                    <TableCell>{new Date(falha.data_falha).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip
                        label={falha.ativa ? 'Ativa' : 'Resolvida'}
                        color={falha.ativa ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{falha.observacao || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditClick(falha)}
                        disabled={loadingEdit}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Nenhuma falha encontrada.
          </Typography>
        )}
      </Paper>
      
      {/* Modal de Edição */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Falha</DialogTitle>
        <DialogContent>
          {falhaEditando && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1">
                Unidade: {falhaEditando.unidade_nome}
              </Typography>
              <TextField
                label="Falha Ocorrida"
                fullWidth
                value={falhaEditando.falha_ocorrida}
                onChange={(e) => setFalhaEditando({...falhaEditando, falha_ocorrida: e.target.value})}
                disabled={loadingEdit}
              />
              <TextField
                label="Data da Falha"
                fullWidth
                type="date"
                value={falhaEditando.data_falha.split('T')[0]}
                onChange={(e) => setFalhaEditando({...falhaEditando, data_falha: e.target.value})}
                disabled={loadingEdit}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Observação"
                fullWidth
                multiline
                rows={4}
                value={falhaEditando.observacao || ''}
                onChange={(e) => setFalhaEditando({...falhaEditando, observacao: e.target.value})}
                disabled={loadingEdit}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!falhaEditando.ativa}
                    onChange={(e) => setFalhaEditando({...falhaEditando, ativa: !e.target.checked})}
                    disabled={loadingEdit}
                  />
                }
                label="Marcar como resolvida"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loadingEdit}>Cancelar</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            color="primary"
            disabled={loadingEdit}
            startIcon={loadingEdit ? <CircularProgress size={20} /> : null}
          >
            {loadingEdit ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars para mensagens de sucesso e erro */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ListagemFalhas;