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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
    ticketZendesk: 'ZD-1234'
  },
  { 
    id: 2, 
    nomeUnidade: 'Unidade B', 
    grupoUnidade: 'Grupo 2',
    tecnicoUnidade: 'Maria Santos',
    falhaOcorrida: 'Manutenção preventiva',
    dataFalha: '15/05/2024',
    observacoes: 'Agendado para próxima semana',
    ticketZendesk: 'ZD-5678'
  },
  { 
    id: 3, 
    nomeUnidade: 'Unidade C', 
    grupoUnidade: 'Grupo 1',
    tecnicoUnidade: 'Pedro Oliveira',
    falhaOcorrida: 'Troca de equipamentos',
    dataFalha: '20/05/2024',
    observacoes: 'Equipamentos já adquiridos',
    ticketZendesk: 'ZD-9012'
  },
];

function VisualizarUnidades() {
  const [unidades, setUnidades] = useState(unidadesIniciais);
  const [openDialog, setOpenDialog] = useState(false);
  const [unidadeParaExcluir, setUnidadeParaExcluir] = useState<number | null>(null);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Visualizar Unidades
      </Typography>
      
      <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Unidade</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Grupo</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Técnico</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Falha Ocorrida</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Data da Falha</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Ticket</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Ações</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unidades.map((unidade) => (
                <TableRow key={unidade.id}>
                  <TableCell>{unidade.nomeUnidade}</TableCell>
                  <TableCell>{unidade.grupoUnidade}</TableCell>
                  <TableCell>{unidade.tecnicoUnidade}</TableCell>
                  <TableCell>{unidade.falhaOcorrida}</TableCell>
                  <TableCell>{unidade.dataFalha}</TableCell>
                  <TableCell>{unidade.ticketZendesk}</TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      aria-label="editar" 
                      onClick={() => handleEditClick(unidade.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      aria-label="excluir" 
                      onClick={() => handleDeleteClick(unidade.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default VisualizarUnidades;