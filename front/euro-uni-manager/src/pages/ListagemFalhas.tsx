import { useState, useEffect } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { falhasUnidades } from './MonitoramentoUnidade';
import { Falha } from './MonitoramentoUnidade';

function ListagemFalhas() {
  const [todasFalhas, setTodasFalhas] = useState<(Falha & { unidadeNome: string })[]>([]);
  const [mostrarEncerradas, setMostrarEncerradas] = useState<boolean>(false);
  const [falhasFiltradas, setFalhasFiltradas] = useState<(Falha & { unidadeNome: string })[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [falhaEditando, setFalhaEditando] = useState<(Falha & { unidadeNome: string }) | null>(null);

  // Dados de exemplo para as unidades
  const unidades = [
    { id: 1, nome: 'Unidade A' },
    { id: 2, nome: 'Unidade B' },
    { id: 3, nome: 'Unidade C' },
  ];

  // Carrega todas as falhas de todas as unidades
  useEffect(() => {
    const falhasComUnidade: (Falha & { unidadeNome: string })[] = [];
    
    // Percorre todas as unidades e suas falhas
    Object.keys(falhasUnidades).forEach(unidadeId => {
      const unidadeNome = unidades.find(u => u.id === Number(unidadeId))?.nome || 'Unidade Desconhecida';
      
      // Adiciona o nome da unidade a cada falha
      falhasUnidades[Number(unidadeId)].forEach(falha => {
        falhasComUnidade.push({
          ...falha,
          unidadeNome
        });
      });
    });
    
    // Ordena as falhas por data (mais recentes primeiro)
    const falhasOrdenadas = falhasComUnidade.sort((a, b) => {
      const dataA = new Date(a.dataFalha.split('/').reverse().join('-'));
      const dataB = new Date(b.dataFalha.split('/').reverse().join('-'));
      return dataB.getTime() - dataA.getTime();
    });
    
    setTodasFalhas(falhasOrdenadas);
  }, []);

  // Filtra as falhas com base na opção de mostrar encerradas
  useEffect(() => {
    if (mostrarEncerradas) {
      setFalhasFiltradas(todasFalhas);
    } else {
      setFalhasFiltradas(todasFalhas.filter(falha => falha.ativa));
    }
  }, [mostrarEncerradas, todasFalhas]);

  const handleEditClick = (falha: Falha & { unidadeNome: string }) => {
    setFalhaEditando(falha);
    setOpenEditDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setFalhaEditando(null);
  };
  
  const handleSaveEdit = () => {
    if (falhaEditando) {
      // Encontra a unidade da falha
      const unidadeId = Object.keys(falhasUnidades).find(id => {
        return falhasUnidades[Number(id)].some(f => f.id === falhaEditando.id);
      });

      if (unidadeId) {
        // Atualiza a falha no objeto global
        const updatedFalhas = falhasUnidades[Number(unidadeId)].map(f => 
          f.id === falhaEditando.id ? {
            id: falhaEditando.id,
            falhaOcorrida: falhaEditando.falhaOcorrida,
            dataFalha: falhaEditando.dataFalha,
            ativa: falhaEditando.ativa,
            observacao: falhaEditando.observacao
          } : f
        );
        
        falhasUnidades[Number(unidadeId)] = updatedFalhas;
        
        // Atualiza o estado local
        const updatedTodasFalhas = todasFalhas.map(f => 
          f.id === falhaEditando.id && f.unidadeNome === falhaEditando.unidadeNome ? falhaEditando : f
        );
        
        setTodasFalhas(updatedTodasFalhas);
      }
      
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Listagem de Falhas
      </Typography>
      
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
            label="Mostrar falhas encerradas"
          />
        </Box>
        
        {falhasFiltradas.length > 0 ? (
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
                  <TableRow key={`${falha.id}-${falha.unidadeNome}`}>
                    <TableCell>{falha.unidadeNome}</TableCell>
                    <TableCell>{falha.falhaOcorrida}</TableCell>
                    <TableCell>{falha.dataFalha}</TableCell>
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
                Unidade: {falhaEditando.unidadeNome}
              </Typography>
              <TextField
                label="Falha Ocorrida"
                fullWidth
                value={falhaEditando.falhaOcorrida}
                onChange={(e) => setFalhaEditando({...falhaEditando, falhaOcorrida: e.target.value})}
              />
              <TextField
                label="Data da Falha"
                fullWidth
                value={falhaEditando.dataFalha}
                onChange={(e) => setFalhaEditando({...falhaEditando, dataFalha: e.target.value})}
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
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ListagemFalhas;