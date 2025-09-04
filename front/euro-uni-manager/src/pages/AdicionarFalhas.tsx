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
  TextField,
  Button,
  Grid,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

// Dados de exemplo para as unidades
const unidades = [
  { id: 1, nome: 'Unidade A' },
  { id: 2, nome: 'Unidade B' },
  { id: 3, nome: 'Unidade C' },
];

function AdicionarFalhas() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('');
  const [falhaOcorrida, setFalhaOcorrida] = useState<string>('');
  const [dataFalha, setDataFalha] = useState<Date | null>(null);
  const [observacao, setObservacao] = useState<string>('');
  
  // Estados para validação
  const [unidadeError, setUnidadeError] = useState<boolean>(false);
  const [falhaError, setFalhaError] = useState<boolean>(false);
  const [dataError, setDataError] = useState<boolean>(false);
  
  const handleUnidadeChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setUnidadeSelecionada(value);
    setUnidadeError(value === '');
  };
  
  const handleFalhaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFalhaOcorrida(value);
    setFalhaError(value === '');
  };
  
  const handleDataChange = (newValue: Date | null) => {
    setDataFalha(newValue);
    setDataError(newValue === null);
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Validação dos campos obrigatórios
    const unidadeInvalida = unidadeSelecionada === '';
    const falhaInvalida = falhaOcorrida === '';
    const dataInvalida = dataFalha === null;
    
    setUnidadeError(unidadeInvalida);
    setFalhaError(falhaInvalida);
    setDataError(dataInvalida);
    
    if (!unidadeInvalida && !falhaInvalida && !dataInvalida) {
      // Aqui você implementaria a lógica para salvar a falha
      console.log('Falha registrada:', {
        unidadeId: unidadeSelecionada,
        falhaOcorrida,
        dataFalha,
        observacao,
        ativa: true, // Por padrão, a falha é criada como ativa
      });
      
      // Limpar o formulário após o envio
      setFalhaOcorrida('');
      setDataFalha(null);
      setObservacao('');
      // Manter a unidade selecionada para facilitar o registro de múltiplas falhas
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Adicionar Falhas
      </Typography>
      
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={unidadeError}>
                <InputLabel id="unidade-select-label">Selecione uma Unidade</InputLabel>
                <Select
                  labelId="unidade-select-label"
                  id="unidade-select"
                  value={unidadeSelecionada}
                  label="Selecione uma Unidade"
                  onChange={handleUnidadeChange}
                  required
                >
                  <MenuItem value=""><em>Selecione</em></MenuItem>
                  {unidades.map((unidade) => (
                    <MenuItem key={unidade.id} value={unidade.id.toString()}>
                      {unidade.nome}
                    </MenuItem>
                  ))}
                </Select>
                {unidadeError && <FormHelperText>Selecione uma unidade</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="falha-ocorrida"
                label="Falha Ocorrida"
                value={falhaOcorrida}
                onChange={handleFalhaChange}
                error={falhaError}
                helperText={falhaError ? 'Informe a falha ocorrida' : ''}
              />
            </Grid>
            
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data da Falha"
                  value={dataFalha}
                  onChange={handleDataChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: dataError,
                      helperText: dataError ? 'Informe a data da falha' : '',
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="observacao"
                label="Observação"
                multiline
                rows={4}
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Adicione informações relevantes sobre a falha"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Registrar Falha
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarFalhas;