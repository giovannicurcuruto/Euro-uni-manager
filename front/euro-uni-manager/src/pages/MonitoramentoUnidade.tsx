import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Interface para o tipo de unidade
interface Unidade {
  id: number;
  nome_unidade: string;
  grupo_unidade: string;
  tecnico_unidade: string;
  id_unidade: string;
  observacoes: string;
}

// Interface para o tipo de falha
export interface Falha {
  id: number;
  falha_ocorrida: string;
  data_falha: string;
  ativa: boolean;
  observacao?: string;
  unidade: number;
  unidade_nome?: string;
  created_at?: string;
  updated_at?: string;
}

function MonitoramentoUnidade() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('');
  const [falhas, setFalhas] = useState<Falha[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [falhaEditando, setFalhaEditando] = useState<Falha | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUnidades, setLoadingUnidades] = useState(true);
  const [loadingFalhas, setLoadingFalhas] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Carregar unidades do backend
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/unidades/');
        if (response.ok) {
          const data = await response.json();
          setUnidades(data);
        } else {
          setErrorMessage('Erro ao carregar unidades');
        }
      } catch (error) {
        setErrorMessage('Erro ao conectar com o servidor');
      } finally {
        setLoadingUnidades(false);
      }
    };

    fetchUnidades();
  }, []);

  // Carregar falhas da unidade selecionada
  const fetchFalhasUnidade = async (unidadeId: string) => {
    setLoadingFalhas(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/falhas/');
      if (response.ok) {
        const data = await response.json();
        // Filtrar falhas da unidade selecionada
        const falhasUnidade = data.filter((falha: Falha) => falha.unidade === parseInt(unidadeId));
        setFalhas(falhasUnidade);
      } else {
        setErrorMessage('Erro ao carregar falhas');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar com o servidor');
    } finally {
      setLoadingFalhas(false);
    }
  };

  const handleUnidadeChange = (event: SelectChangeEvent) => {
    const unidadeId = event.target.value;
    setUnidadeSelecionada(unidadeId);
    
    if (unidadeId) {
      fetchFalhasUnidade(unidadeId);
    } else {
      setFalhas([]);
    }
  };
  
  const handleEditClick = (falha: Falha) => {
    setFalhaEditando({ ...falha });
    setOpenEditDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setFalhaEditando(null);
  };
  
  const handleSaveEdit = async () => {
    if (falhaEditando) {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/falhas/${falhaEditando.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            falha_ocorrida: falhaEditando.falha_ocorrida,
            data_falha: falhaEditando.data_falha,
            ativa: falhaEditando.ativa,
            observacao: falhaEditando.observacao,
            unidade: falhaEditando.unidade,
          }),
        });

        if (response.ok) {
          setFalhas(falhas.map(f => 
            f.id === falhaEditando.id ? falhaEditando : f
          ));
          setSuccessMessage('Falha atualizada com sucesso!');
          handleCloseDialog();
        } else {
          setErrorMessage('Erro ao atualizar falha');
        }
      } catch (error) {
        setErrorMessage('Erro ao conectar com o servidor');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Monitoramento da Unidade
      </Typography>
      
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="unidade-select-label">Selecione uma Unidade</InputLabel>
          <Select
            labelId="unidade-select-label"
            id="unidade-select"
            value={unidadeSelecionada}
            label="Selecione uma Unidade"
            onChange={handleUnidadeChange}
            disabled={loadingUnidades}
          >
            <MenuItem value=""><em>Selecione</em></MenuItem>
            {loadingUnidades ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Carregando unidades...
              </MenuItem>
            ) : (
              unidades.map((unidade) => (
                <MenuItem key={unidade.id} value={unidade.id.toString()}>
                  {unidade.nome_unidade}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        {unidadeSelecionada && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Falhas
            </Typography>
            
            {loadingFalhas ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : falhas.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Falha Ocorrida</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Data da Falha</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Status</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Observação</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Ações</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {falhas.map((falha) => (
                      <TableRow key={falha.id}>
                        <TableCell>{falha.falha_ocorrida}</TableCell>
                        <TableCell>{new Date(falha.data_falha).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <Chip
                            label={falha.ativa ? 'Ativa' : 'Resolvida'}
                            color={falha.ativa ? 'error' : 'success'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{falha.observacao || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(falha)}
                            disabled={loading}
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
                Nenhuma falha registrada para esta unidade.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Modal de Edição */}
      <Dialog open={openEditDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Falha</DialogTitle>
        <DialogContent>
          {falhaEditando && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Falha Ocorrida"
                fullWidth
                value={falhaEditando.falha_ocorrida}
                onChange={(e) => setFalhaEditando({...falhaEditando, falha_ocorrida: e.target.value})}
              />
              <TextField
                label="Data da Falha"
                fullWidth
                value={falhaEditando.data_falha}
                onChange={(e) => setFalhaEditando({...falhaEditando, data_falha: e.target.value})}
              />
              <TextField
                label="Observação"
                fullWidth
                multiline
                rows={4}
                value={falhaEditando.observacao || ''}
                onChange={(e) => setFalhaEditando({...falhaEditando, observacao: e.target.value})}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!falhaEditando.ativa}
                    onChange={(e) => setFalhaEditando({...falhaEditando, ativa: !e.target.checked})}
                  />
                }
                label="Marcar como resolvida"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancelar</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars para mensagens */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default MonitoramentoUnidade;