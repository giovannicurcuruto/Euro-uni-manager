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
} from '@mui/material';

// Dados de exemplo para as unidades
const unidades = [
  { id: 1, nome: 'Unidade A' },
  { id: 2, nome: 'Unidade B' },
  { id: 3, nome: 'Unidade C' },
];

// Dados de exemplo para as falhas
const falhasUnidades = {
  1: [
    { id: 1, falhaOcorrida: 'Falha no sistema de refrigeração', dataFalha: '10/05/2024' },
    { id: 2, falhaOcorrida: 'Problema na rede elétrica', dataFalha: '15/04/2024' },
    { id: 3, falhaOcorrida: 'Manutenção preventiva', dataFalha: '20/03/2024' },
  ],
  2: [
    { id: 1, falhaOcorrida: 'Manutenção preventiva', dataFalha: '15/05/2024' },
    { id: 2, falhaOcorrida: 'Atualização de software', dataFalha: '10/04/2024' },
  ],
  3: [
    { id: 1, falhaOcorrida: 'Troca de equipamentos', dataFalha: '20/05/2024' },
    { id: 2, falhaOcorrida: 'Falha no sistema de segurança', dataFalha: '05/05/2024' },
    { id: 3, falhaOcorrida: 'Problema na conexão de internet', dataFalha: '01/05/2024' },
    { id: 4, falhaOcorrida: 'Manutenção preventiva', dataFalha: '15/04/2024' },
  ],
};

function MonitoramentoUnidade() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('');
  const [falhas, setFalhas] = useState<Array<{ id: number; falhaOcorrida: string; dataFalha: string }>>([]);

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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {falhas.map((falha) => (
                      <TableRow key={falha.id}>
                        <TableCell>{falha.falhaOcorrida}</TableCell>
                        <TableCell>{falha.dataFalha}</TableCell>
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
    </Container>
  );
}

export default MonitoramentoUnidade;