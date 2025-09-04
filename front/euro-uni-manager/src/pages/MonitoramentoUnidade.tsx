import { useState } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

// Interface para o tipo de falha
export interface Falha {
  id: number;
  falhaOcorrida: string;
  dataFalha: string;
  ativa: boolean;
  observacao?: string;
}

// Dados de exemplo para as unidades
const unidades = [
  { id: 1, nome: 'Unidade A' },
  { id: 2, nome: 'Unidade B' },
  { id: 3, nome: 'Unidade C' },
];

// Dados de exemplo para as falhas
export const falhasUnidades = {
  1: [
    { id: 1, falhaOcorrida: 'Falha no sistema de refrigeração', dataFalha: '10/05/2024', ativa: true, observacao: 'Aguardando peças para reparo' },
    { id: 2, falhaOcorrida: 'Problema na rede elétrica', dataFalha: '15/04/2024', ativa: true, observacao: 'Técnico agendado para 25/05' },
    { id: 3, falhaOcorrida: 'Manutenção preventiva', dataFalha: '20/03/2024', ativa: false, observacao: 'Concluída com sucesso' },
  ],
  2: [
    { id: 1, falhaOcorrida: 'Manutenção preventiva', dataFalha: '15/05/2024', ativa: false, observacao: 'Realizada conforme cronograma' },
    { id: 2, falhaOcorrida: 'Atualização de software', dataFalha: '10/04/2024', ativa: false, observacao: 'Versão 2.3 instalada' },
  ],
  3: [
    { id: 1, falhaOcorrida: 'Troca de equipamentos', dataFalha: '20/05/2024', ativa: true, observacao: 'Aguardando entrega dos novos equipamentos' },
    { id: 2, falhaOcorrida: 'Falha no sistema de segurança', dataFalha: '05/05/2024', ativa: true, observacao: 'Em análise pelo suporte' },
    { id: 3, falhaOcorrida: 'Problema na conexão de internet', dataFalha: '01/05/2024', ativa: true, observacao: 'Operadora notificada' },
    { id: 4, falhaOcorrida: 'Manutenção preventiva', dataFalha: '15/04/2024', ativa: false, observacao: 'Concluída sem intercorrências' },
  ],
};

function MonitoramentoUnidade() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('');
  const [falhas, setFalhas] = useState<Falha[]>([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [falhaEditando, setFalhaEditando] = useState<Falha | null>(null);

  const handleUnidadeChange = (event: SelectChangeEvent) => {
    const unidadeId = event.target.value;
    setUnidadeSelecionada(unidadeId);
    
    // Carrega as falhas da unidade selecionada
    if (unidadeId) {
      setFalhas(falhasUnidades[Number(unidadeId)] || []);
    } else {
      setFalhas([]);
    }
  };
  
  const handleEditClick = (falha: Falha) => {
    setFalhaEditando(falha);
    setOpenEditDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setFalhaEditando(null);
  };
  
  const handleSaveEdit = () => {
    if (falhaEditando) {
      // Atualiza a falha no estado local
      const updatedFalhas = falhas.map(f => 
        f.id === falhaEditando.id ? falhaEditando : f
      );
      setFalhas(updatedFalhas);
      
      // Atualiza no objeto global (em uma aplicação real, isso seria uma chamada API)
      if (unidadeSelecionada) {
        falhasUnidades[Number(unidadeSelecionada)] = updatedFalhas;
      }
      
      handleCloseDialog();
    }
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
          >
            <MenuItem value=""><em>Selecione</em></MenuItem>
            {unidades.map((unidade) => (
              <MenuItem key={unidade.id} value={unidade.id.toString()}>
                {unidade.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {unidadeSelecionada && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Falhas
            </Typography>
            
            {falhas.length > 0 ? (
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
                        <TableCell>{falha.falhaOcorrida}</TableCell>
                        <TableCell>{falha.dataFalha}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: falha.ativa ? 'error.light' : 'success.light',
                              color: falha.ativa ? 'error.dark' : 'success.dark',
                              fontWeight: 'medium',
                              fontSize: '0.75rem',
                            }}
                          >
                            {falha.ativa ? 'Ativa' : 'Resolvida'}
                          </Box>
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

export default MonitoramentoUnidade;