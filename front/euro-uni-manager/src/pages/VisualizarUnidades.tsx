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
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Pagination,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

// Interface para os dados da unidade do backend
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

// Interface para falhas
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

// Interface para dados da unidade com falhas calculadas
interface UnidadeComFalhas extends Unidade {
  falhasPendentes: number;
  ultimaFalha?: Falha;
}

// Estilizando componentes da tabela
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

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

const VisualizarUnidades = () => {
  const navigate = useNavigate();
  const [unidades, setUnidades] = useState<UnidadeComFalhas[]>([]);
  const [falhas, setFalhas] = useState<Falha[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [unidadeParaExcluir, setUnidadeParaExcluir] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para o modal de edição
  const [openEditModal, setOpenEditModal] = useState(false);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<UnidadeComFalhas | null>(null);
  const [unidadeEditData, setUnidadeEditData] = useState<Unidade | null>(null);
  
  // Estados para paginação das falhas
  const [paginaAtualFalhas, setPaginaAtualFalhas] = useState(1);
  const falhasPorPagina = 5;
  
  // Estados para loading e mensagens
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Carregar dados do backend
  useEffect(() => {
    fetchUnidadesEFalhas();
  }, []);

  const fetchUnidadesEFalhas = async () => {
    setLoading(true);
    try {
      // Carregar unidades e falhas em paralelo
      const [unidadesResponse, falhasResponse] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/unidades/'),
        fetch('http://127.0.0.1:8000/api/falhas/')
      ]);

      if (unidadesResponse.ok && falhasResponse.ok) {
        const unidadesData: Unidade[] = await unidadesResponse.json();
        const falhasData: Falha[] = await falhasResponse.json();
        
        setFalhas(falhasData);
        
        // Calcular falhas pendentes e última falha para cada unidade
        const unidadesComFalhas: UnidadeComFalhas[] = unidadesData.map(unidade => {
          const falhasUnidade = falhasData.filter(falha => falha.unidade === unidade.id);
          const falhasPendentes = falhasUnidade.filter(falha => falha.ativa).length;
          const ultimaFalha = falhasUnidade
            .sort((a, b) => new Date(b.data_falha).getTime() - new Date(a.data_falha).getTime())[0];
          
          return {
            ...unidade,
            falhasPendentes,
            ultimaFalha
          };
        });
        
        setUnidades(unidadesComFalhas);
      } else {
        setErrorMessage('Erro ao carregar dados');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id: number) => {
    const unidade = unidades.find(u => u.id === id);
    if (unidade) {
      setUnidadeSelecionada(unidade);
      setUnidadeEditData({ 
        id: unidade.id,
        nome_unidade: unidade.nome_unidade,
        grupo_unidade: unidade.grupo_unidade,
        tecnico_unidade: unidade.tecnico_unidade,
        id_unidade: unidade.id_unidade,
        observacoes: unidade.observacoes
      });
      setPaginaAtualFalhas(1);
      setOpenEditModal(true);
    }
  };

  const handleDeleteClick = (id: number) => {
    setUnidadeParaExcluir(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (unidadeParaExcluir !== null) {
      setLoadingDelete(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/unidades/${unidadeParaExcluir}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUnidades(unidades.filter(unidade => unidade.id !== unidadeParaExcluir));
          setSuccessMessage('Unidade excluída com sucesso!');
        } else {
          setErrorMessage('Erro ao excluir unidade');
        }
      } catch (error) {
        setErrorMessage('Erro ao conectar com o servidor');
      } finally {
        setLoadingDelete(false);
        setOpenDialog(false);
        setUnidadeParaExcluir(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setUnidadeParaExcluir(null);
  };

  // Filtrar unidades com base no termo de pesquisa
  const filteredUnidades = unidades.filter(unidade => 
    unidade.nome_unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unidade.grupo_unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unidade.tecnico_unidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Funções para o modal de edição
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setUnidadeSelecionada(null);
    setUnidadeEditData(null);
    setPaginaAtualFalhas(1);
  };

  const handleEditFieldChange = (field: keyof Unidade, value: string) => {
    if (unidadeEditData) {
      setUnidadeEditData({
        ...unidadeEditData,
        [field]: value
      });
    }
  };

  const handleSaveEdit = async () => {
    if (unidadeEditData) {
      setLoadingEdit(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/unidades/${unidadeEditData.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome_unidade: unidadeEditData.nome_unidade,
            grupo_unidade: unidadeEditData.grupo_unidade,
            tecnico_unidade: unidadeEditData.tecnico_unidade,
            id_unidade: unidadeEditData.id_unidade,
            observacoes: unidadeEditData.observacoes,
          }),
        });

        if (response.ok) {
          const updatedUnidade = await response.json();
          // Atualizar a unidade na lista mantendo as falhas calculadas
          setUnidades(unidades.map(u => 
            u.id === updatedUnidade.id ? { ...u, ...updatedUnidade } : u
          ));
          setSuccessMessage('Unidade atualizada com sucesso!');
          handleCloseEditModal();
        } else {
          setErrorMessage('Erro ao atualizar unidade');
        }
      } catch (error) {
        setErrorMessage('Erro ao conectar com o servidor');
      } finally {
        setLoadingEdit(false);
      }
    }
  };

  // Função para obter falhas da unidade selecionada
  const getFalhasUnidade = () => {
    if (!unidadeSelecionada) return [];
    return falhas.filter(falha => falha.unidade === unidadeSelecionada.id);
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Paginação das falhas
  const falhasUnidade = getFalhasUnidade();
  const totalPaginasFalhas = Math.ceil(falhasUnidade.length / falhasPorPagina);
  const falhasPaginadas = falhasUnidade.slice(
    (paginaAtualFalhas - 1) * falhasPorPagina,
    paginaAtualFalhas * falhasPorPagina
  );

  const handleChangePaginaFalhas = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaAtualFalhas(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
          Visualizar Unidades
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/adicionar-unidades')}
        >
          Nova Unidade
        </Button>
      </Box>
      
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={({ palette }) => ({ 
          p: 2, 
          bgcolor: palette.mode === 'dark' ? alpha(palette.primary.main, 0.05) : '#f5f5f5', 
          borderBottom: `1px solid ${palette.divider}` 
        })}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Pesquisar unidades..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={({ palette }) => ({
                  backgroundColor: palette.background.paper,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                })}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                sx={{ borderRadius: 2, mr: 1 }}
              >
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell>Unidade</StyledHeaderCell>
                <StyledHeaderCell>Grupo</StyledHeaderCell>
                <StyledHeaderCell>Técnico</StyledHeaderCell>
                <StyledHeaderCell>Última Falha</StyledHeaderCell>
                <StyledHeaderCell>Data da Última Falha</StyledHeaderCell>
                <StyledHeaderCell>ID Unidade</StyledHeaderCell>
                <StyledHeaderCell>Falhas Pendentes</StyledHeaderCell>
                <StyledHeaderCell align="center">Ações</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={8} align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ ml: 2 }}>Carregando unidades...</Typography>
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ) : filteredUnidades.length > 0 ? (
                filteredUnidades.map((unidade) => (
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
                    <StyledTableCell>{unidade.tecnico_unidade}</StyledTableCell>
                    <StyledTableCell>
                      {unidade.ultimaFalha ? unidade.ultimaFalha.falha_ocorrida : 'Nenhuma falha'}
                    </StyledTableCell>
                    <StyledTableCell>
                      {unidade.ultimaFalha ? new Date(unidade.ultimaFalha.data_falha).toLocaleDateString('pt-BR') : '-'}
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
                      <Chip 
                        label={unidade.falhasPendentes} 
                        size="small" 
                        sx={({ palette }) => ({ 
                          bgcolor: unidade.falhasPendentes > 0 
                            ? alpha('#f44336', palette.mode === 'dark' ? 0.2 : 0.1) 
                            : alpha('#4caf50', palette.mode === 'dark' ? 0.2 : 0.1), 
                          color: unidade.falhasPendentes > 0 
                            ? (palette.mode === 'dark' ? '#ff6b6b' : '#f44336') 
                            : (palette.mode === 'dark' ? '#51cf66' : '#4caf50'),
                          fontWeight: 'medium',
                          fontSize: '0.75rem'
                        })} 
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <ActionButton 
                        color="primary" 
                        aria-label="editar" 
                        onClick={() => handleEditClick(unidade.id)}
                        size="small"
                        disabled={loadingEdit || loadingDelete}
                      >
                        <EditIcon fontSize="small" />
                      </ActionButton>
                      <ActionButton 
                        color="error" 
                        aria-label="excluir" 
                        onClick={() => handleDeleteClick(unidade.id)}
                        size="small"
                        disabled={loadingEdit || loadingDelete}
                      >
                        <DeleteIcon fontSize="small" />
                      </ActionButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={8} align="center">
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

      {/* Diálogo de confirmação para exclusão */}
      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Confirmar exclusão
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelDelete} 
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
            disabled={loadingDelete}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2, textTransform: 'none' }}
            disabled={loadingDelete}
            startIcon={loadingDelete ? <CircularProgress size={20} /> : null}
          >
            {loadingDelete ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edição de unidade */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Editar Unidade - {unidadeSelecionada?.nome_unidade}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {unidadeEditData && (
            <Box>
              {/* Formulário de edição */}
               <Grid container spacing={3} sx={{ mb: 3 }}>
                 <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField
                     fullWidth
                     label="Nome da Unidade"
                     value={unidadeEditData.nome_unidade}
                     onChange={(e) => handleEditFieldChange('nome_unidade', e.target.value)}
                     variant="outlined"
                     disabled={loadingEdit}
                   />
                 </Grid>
                 <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField
                     fullWidth
                     label="Grupo"
                     value={unidadeEditData.grupo_unidade}
                     disabled
                     variant="outlined"
                     sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.secondary' } }}
                   />
                 </Grid>
                 <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField
                     fullWidth
                     label="Técnico da Unidade"
                     value={unidadeEditData.tecnico_unidade}
                     onChange={(e) => handleEditFieldChange('tecnico_unidade', e.target.value)}
                     variant="outlined"
                     disabled={loadingEdit}
                   />
                 </Grid>
                 <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField
                     fullWidth
                     label="ID da Unidade"
                     value={unidadeEditData.id_unidade}
                     disabled
                     variant="outlined"
                     sx={{ '& .MuiInputBase-input.Mui-disabled': { color: 'text.secondary' } }}
                   />
                 </Grid>
                 <Grid size={12}>
                   <TextField
                     fullWidth
                     label="Observações"
                     value={unidadeEditData.observacoes}
                     onChange={(e) => handleEditFieldChange('observacoes', e.target.value)}
                     variant="outlined"
                     multiline
                     rows={3}
                     disabled={loadingEdit}
                   />
                 </Grid>
               </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Lista de falhas */}
              <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                Falhas da Unidade ({falhasUnidade.length})
              </Typography>
              
              {falhasUnidade.length > 0 ? (
                <Box>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    {falhasPaginadas.map((falha, index) => (
                       <Box key={falha.id} sx={{ mb: index < falhasPaginadas.length - 1 ? 2 : 0 }}>
                         <Grid container spacing={2}>
                           <Grid size={{ xs: 12, sm: 6 }}>
                             <Typography variant="body2" color="text.secondary">
                               Descrição:
                             </Typography>
                             <Typography variant="body1" fontWeight="medium">
                               {falha.falha_ocorrida}
                             </Typography>
                           </Grid>
                           <Grid size={{ xs: 12, sm: 3 }}>
                             <Typography variant="body2" color="text.secondary">
                               Data:
                             </Typography>
                             <Typography variant="body1">
                               {new Date(falha.data_falha).toLocaleDateString('pt-BR')}
                             </Typography>
                           </Grid>
                           <Grid size={{ xs: 12, sm: 3 }}>
                             <Typography variant="body2" color="text.secondary">
                               Status:
                             </Typography>
                             <Chip
                               label={falha.ativa ? 'Ativo' : 'Resolvido'}
                               size="small"
                               sx={{
                                 bgcolor: falha.ativa ? alpha('#f44336', 0.1) : alpha('#4caf50', 0.1),
                                 color: falha.ativa ? '#f44336' : '#4caf50',
                                 fontWeight: 'medium'
                               }}
                             />
                           </Grid>
                         </Grid>
                         {index < falhasPaginadas.length - 1 && <Divider sx={{ mt: 2 }} />}
                       </Box>
                     ))}
                  </Paper>
                  
                  {totalPaginasFalhas > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Pagination
                        count={totalPaginasFalhas}
                        page={paginaAtualFalhas}
                        onChange={handleChangePaginaFalhas}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma falha encontrada para esta unidade
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseEditModal} 
            variant="outlined" 
            sx={{ mr: 1 }}
            disabled={loadingEdit}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            color="primary"
            disabled={loadingEdit}
            startIcon={loadingEdit ? <CircularProgress size={20} /> : null}
          >
            {loadingEdit ? 'Salvando...' : 'Salvar Alterações'}
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

export default VisualizarUnidades;