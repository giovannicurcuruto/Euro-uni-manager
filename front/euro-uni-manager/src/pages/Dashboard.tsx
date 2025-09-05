import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
} from '@mui/material';
// Interfaces para os dados do backend
interface Unidade {
  id: number;
  nome_unidade: string;
  grupo_unidade: string;
  tecnico_unidade: string;
  id_unidade: string;
  observacoes: string;
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

function Dashboard() {
  const [mes, setMes] = useState<string>(new Date().getMonth() + 1 + '');
  const [ano, setAno] = useState<string>(new Date().getFullYear() + '');
  const [estatisticas, setEstatisticas] = useState({
    ativas: 0,
    fechadas: 0,
    total: 0
  });
  
  // Estado para controlar o modal
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoFalhaModal, setTipoFalhaModal] = useState<'ativas' | 'fechadas' | 'todas' | null>(null);
  const [falhasFiltradas, setFalhasFiltradas] = useState<FalhaComUnidade[]>([]);
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  // Estados para dados do backend
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [falhas, setFalhas] = useState<Falha[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Função para buscar dados do backend
  const fetchDados = async () => {
    try {
      setLoading(true);
      const [unidadesResponse, falhasResponse] = await Promise.all([
        fetch('http://localhost:8000/api/unidades/'),
        fetch('http://localhost:8000/api/falhas/')
      ]);
      
      if (unidadesResponse.ok && falhasResponse.ok) {
        const unidadesData: Unidade[] = await unidadesResponse.json();
        const falhasData: Falha[] = await falhasResponse.json();
        
        setUnidades(unidadesData);
        setFalhas(falhasData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDados();
  }, []);

  // Função para calcular estatísticas com base no mês e ano selecionados
  const calcularEstatisticas = () => {
    let ativas = 0;
    let fechadas = 0;
    let total = 0;
    const falhasAtivasList: FalhaComUnidade[] = [];
    const falhasFechadasList: FalhaComUnidade[] = [];
    const falhasTotalList: FalhaComUnidade[] = [];

    // Percorre todas as falhas do backend
    falhas.forEach(falha => {
      const unidade = unidades.find(u => u.id === falha.unidade);
      const unidade_nome = unidade?.nome_unidade || 'Unidade Desconhecida';
      
      // Converte a data da falha para objeto Date
      const dataFalha = new Date(falha.data_falha);
      
      // Verifica se a falha ocorreu no mês e ano selecionados
      if (dataFalha.getMonth() + 1 === parseInt(mes) && dataFalha.getFullYear() === parseInt(ano)) {
        const falhaComUnidade: FalhaComUnidade = { ...falha, unidade_nome };
        total++;
        falhasTotalList.push(falhaComUnidade);
        
        if (falha.ativa) {
          ativas++;
          falhasAtivasList.push(falhaComUnidade);
        } else {
          fechadas++;
          falhasFechadasList.push(falhaComUnidade);
        }
      }
    });

    setEstatisticas({ ativas, fechadas, total });
    
    // Ordena as listas por data (mais recentes primeiro)
    const ordenarPorData = (a: FalhaComUnidade, b: FalhaComUnidade) => {
      const dataA = new Date(a.data_falha);
      const dataB = new Date(b.data_falha);
      return dataB.getTime() - dataA.getTime();
    };
    
    falhasAtivasList.sort(ordenarPorData);
    falhasFechadasList.sort(ordenarPorData);
    falhasTotalList.sort(ordenarPorData);
    
    // Armazena as listas para uso no modal
    return { falhasAtivasList, falhasFechadasList, falhasTotalList };
  };

  // Recalcula as estatísticas quando o mês, ano ou dados mudarem
  useEffect(() => {
    if (unidades.length > 0 && falhas.length > 0) {
      calcularEstatisticas();
    }
  }, [mes, ano, unidades, falhas]);

  // Atualiza as falhas filtradas quando o modal é aberto
  useEffect(() => {
    if (modalOpen && tipoFalhaModal && unidades.length > 0 && falhas.length > 0) {
      const { falhasAtivasList, falhasFechadasList, falhasTotalList } = calcularEstatisticas();
      
      if (tipoFalhaModal === 'ativas') {
        setFalhasFiltradas(falhasAtivasList);
      } else if (tipoFalhaModal === 'fechadas') {
        setFalhasFiltradas(falhasFechadasList);
      } else {
        setFalhasFiltradas(falhasTotalList);
      }
    }
  }, [modalOpen, tipoFalhaModal, unidades, falhas]);

  const handleMesChange = (event: SelectChangeEvent) => {
    setMes(event.target.value);
  };

  const handleAnoChange = (event: SelectChangeEvent) => {
    setAno(event.target.value);
  };
  
  // Função para abrir o modal com as falhas filtradas
  const handleOpenModal = (tipo: 'ativas' | 'fechadas' | 'todas') => {
    setTipoFalhaModal(tipo);
    setPage(0); // Reseta a paginação
    
    const { falhasAtivasList, falhasFechadasList, falhasTotalList } = calcularEstatisticas();
    
    if (tipo === 'ativas') {
      setFalhasFiltradas(falhasAtivasList);
    } else if (tipo === 'fechadas') {
      setFalhasFiltradas(falhasFechadasList);
    } else {
      setFalhasFiltradas(falhasTotalList);
    }
    
    setModalOpen(true);
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setTipoFalhaModal(null);
  };
  
  // Funções para controlar a paginação
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gera os últimos 5 anos para o seletor
  const anos = [];
  const anoAtual = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    anos.push(anoAtual - i);
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Dashboard
      </Typography>
      
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="mes-select-label">Mês</InputLabel>
            <Select
              labelId="mes-select-label"
              id="mes-select"
              value={mes}
              label="Mês"
              onChange={handleMesChange}
            >
              <MenuItem value="1">Janeiro</MenuItem>
              <MenuItem value="2">Fevereiro</MenuItem>
              <MenuItem value="3">Março</MenuItem>
              <MenuItem value="4">Abril</MenuItem>
              <MenuItem value="5">Maio</MenuItem>
              <MenuItem value="6">Junho</MenuItem>
              <MenuItem value="7">Julho</MenuItem>
              <MenuItem value="8">Agosto</MenuItem>
              <MenuItem value="9">Setembro</MenuItem>
              <MenuItem value="10">Outubro</MenuItem>
              <MenuItem value="11">Novembro</MenuItem>
              <MenuItem value="12">Dezembro</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="ano-select-label">Ano</InputLabel>
            <Select
              labelId="ano-select-label"
              id="ano-select"
              value={ano}
              label="Ano"
              onChange={handleAnoChange}
            >
              {anos.map((ano) => (
                <MenuItem key={ano} value={ano.toString()}>{ano}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                bgcolor: 'error.light', 
                color: 'error.contrastText',
                transition: 'all 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6, cursor: 'pointer' }
              }}
              onClick={() => handleOpenModal('ativas')}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Falhas Ativas
                </Typography>
                <Typography variant="h3" component="div">
                  {estatisticas.ativas}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Clique para ver detalhes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                bgcolor: 'success.light', 
                color: 'success.contrastText',
                transition: 'all 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6, cursor: 'pointer' }
              }}
              onClick={() => handleOpenModal('fechadas')}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Falhas Resolvidas
                </Typography>
                <Typography variant="h3" component="div">
                  {estatisticas.fechadas}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Clique para ver detalhes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                bgcolor: 'info.light', 
                color: 'info.contrastText',
                transition: 'all 0.3s ease-in-out',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6, cursor: 'pointer' }
              }}
              onClick={() => handleOpenModal('todas')}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Total de Falhas
                </Typography>
                <Typography variant="h3" component="div">
                  {estatisticas.total}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                  Clique para ver detalhes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Modal para exibir as falhas */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {tipoFalhaModal === 'ativas' && 'Falhas Ativas'}
          {tipoFalhaModal === 'fechadas' && 'Falhas Resolvidas'}
          {tipoFalhaModal === 'todas' && 'Todas as Falhas'}
          {` - ${mes}/${ano}`}
        </DialogTitle>
        <DialogContent>
          {falhasFiltradas.length > 0 ? (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Unidade</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Falha Ocorrida</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Data da Falha</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Status</Typography></TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight="bold">Observação</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {falhasFiltradas
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((falha) => (
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
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={falhasFiltradas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              />
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 3 }}>
              Nenhuma falha encontrada para o período selecionado.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;