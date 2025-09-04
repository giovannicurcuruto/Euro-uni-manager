import { useState } from 'react';
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
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

// Importando os dados de falhas da página de monitoramento para calcular falhas pendentes
import { falhasUnidades, Falha } from './MonitoramentoUnidade';

// Função para calcular o número de falhas ativas (pendentes) por unidade
const calcularFalhasPendentes = (unidadeId: number) => {
  const falhasDaUnidade = falhasUnidades[unidadeId] || [];
  return falhasDaUnidade.filter(falha => falha.ativa).length;
};

// Dados de exemplo para a tabela
const unidadesIniciais = [
  { 
    id: 1, 
    nomeUnidade: 'Unidade A', 
    grupoUnidade: 'Grupo 1',
    tecnicoUnidade: 'João Silva',
    falhaOcorrida: 'Falha no sistema de refrigeração',
    dataFalha: '10/05/2024',
    observacoes: 'Necessita manutenção urgente',
    ticketZendesk: 'ZD-1234',
    falhasPendentes: calcularFalhasPendentes(1)
  },
  { 
    id: 2, 
    nomeUnidade: 'Unidade B', 
    grupoUnidade: 'Grupo 2',
    tecnicoUnidade: 'Maria Santos',
    falhaOcorrida: 'Manutenção preventiva',
    dataFalha: '15/05/2024',
    observacoes: 'Agendado para próxima semana',
    ticketZendesk: 'ZD-5678',
    falhasPendentes: calcularFalhasPendentes(2)
  },
  { 
    id: 3, 
    nomeUnidade: 'Unidade C', 
    grupoUnidade: 'Grupo 1',
    tecnicoUnidade: 'Pedro Oliveira',
    falhaOcorrida: 'Troca de equipamentos',
    dataFalha: '20/05/2024',
    observacoes: 'Equipamentos já adquiridos',
    ticketZendesk: 'ZD-9012',
    falhasPendentes: calcularFalhasPendentes(3)
  },
];

// Estilizando componentes da tabela
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: theme.spacing(1.5),
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  padding: theme.spacing(1.5),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

function VisualizarUnidades() {
  const [unidades, setUnidades] = useState(unidadesIniciais);
  const [openDialog, setOpenDialog] = useState(false);
  const [unidadeParaExcluir, setUnidadeParaExcluir] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (id: number) => {
    // Aqui você implementaria a navegação para a página de edição
    // ou abriria um modal de edição
    console.log(`Editar unidade ${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setUnidadeParaExcluir(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (unidadeParaExcluir !== null) {
      setUnidades(unidades.filter(unidade => unidade.id !== unidadeParaExcluir));
      setOpenDialog(false);
      setUnidadeParaExcluir(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setUnidadeParaExcluir(null);
  };

  // Filtrar unidades com base no termo de pesquisa
  const filteredUnidades = unidades.filter(unidade => 
    unidade.nomeUnidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unidade.grupoUnidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unidade.tecnicoUnidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
        >
          Nova Unidade
        </Button>
      </Box>
      
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
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
                sx={{
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
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
                <StyledHeaderCell>Falha Ocorrida</StyledHeaderCell>
                <StyledHeaderCell>Data da Falha</StyledHeaderCell>
                <StyledHeaderCell>Ticket</StyledHeaderCell>
                <StyledHeaderCell>Falhas Pendentes</StyledHeaderCell>
                <StyledHeaderCell align="center">Ações</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredUnidades.length > 0 ? (
                filteredUnidades.map((unidade) => (
                  <StyledTableRow key={unidade.id}>
                    <StyledTableCell>
                      <Typography variant="body2" fontWeight="medium">{unidade.nomeUnidade}</Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        label={unidade.grupoUnidade} 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha('#00B388', 0.1), 
                          color: '#00B388',
                          fontWeight: 'medium',
                          fontSize: '0.75rem'
                        }} 
                      />
                    </StyledTableCell>
                    <StyledTableCell>{unidade.tecnicoUnidade}</StyledTableCell>
                    <StyledTableCell>{unidade.falhaOcorrida}</StyledTableCell>
                    <StyledTableCell>{unidade.dataFalha}</StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        label={unidade.ticketZendesk} 
                        size="small" 
                        sx={{ 
                          bgcolor: '#f0f0f0', 
                          fontWeight: 'medium',
                          fontSize: '0.75rem'
                        }} 
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        label={unidade.falhasPendentes} 
                        size="small" 
                        sx={{ 
                          bgcolor: unidade.falhasPendentes > 0 ? alpha('#f44336', 0.1) : alpha('#4caf50', 0.1), 
                          color: unidade.falhasPendentes > 0 ? '#f44336' : '#4caf50',
                          fontWeight: 'medium',
                          fontSize: '0.75rem'
                        }} 
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <ActionButton 
                        color="primary" 
                        aria-label="editar" 
                        onClick={() => handleEditClick(unidade.id)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </ActionButton>
                      <ActionButton 
                        color="error" 
                        aria-label="excluir" 
                        onClick={() => handleDeleteClick(unidade.id)}
                        size="small"
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
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default VisualizarUnidades;