import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';

interface FormData {
  nomeUnidade: string;
  grupoUnidade: string;
  tecnicoUnidade: string;
  falhaOcorrida: string;
  dataFalha: Date | null;
  observacoes: string;
  ticketZendesk: string;
}

function AdicionarUnidades() {
  const [formData, setFormData] = useState<FormData>({
    nomeUnidade: '',
    grupoUnidade: '',
    tecnicoUnidade: '',
    falhaOcorrida: '',
    dataFalha: null,
    observacoes: '',
    ticketZendesk: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({
    nomeUnidade: '',
    falhaOcorrida: '',
    dataFalha: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpar erro quando o campo é preenchido
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dataFalha: date,
    });

    if (date) {
      setErrors({
        ...errors,
        dataFalha: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.nomeUnidade.trim()) {
      newErrors.nomeUnidade = 'Nome da Unidade é obrigatório';
    }
    
    if (!formData.falhaOcorrida.trim()) {
      newErrors.falhaOcorrida = 'Falha ocorrida é obrigatória';
    }
    
    if (!formData.dataFalha) {
      newErrors.dataFalha = 'Data da falha é obrigatória';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Aqui você implementaria a lógica para salvar os dados
    console.log('Dados do formulário:', formData);
    
    // Limpar formulário após envio bem-sucedido
    setFormData({
      nomeUnidade: '',
      grupoUnidade: '',
      tecnicoUnidade: '',
      falhaOcorrida: '',
      dataFalha: null,
      observacoes: '',
      ticketZendesk: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Adicionar Unidades
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="nomeUnidade"
                name="nomeUnidade"
                label="Nome da Unidade"
                value={formData.nomeUnidade}
                onChange={handleChange}
                error={!!errors.nomeUnidade}
                helperText={errors.nomeUnidade}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="grupoUnidade"
                name="grupoUnidade"
                label="Grupo da Unidade"
                value={formData.grupoUnidade}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="tecnicoUnidade"
                name="tecnicoUnidade"
                label="Técnico da Unidade"
                value={formData.tecnicoUnidade}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="falhaOcorrida"
                name="falhaOcorrida"
                label="Falha Ocorrida"
                value={formData.falhaOcorrida}
                onChange={handleChange}
                error={!!errors.falhaOcorrida}
                helperText={errors.falhaOcorrida}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data da Falha *"
                  value={formData.dataFalha}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: !!errors.dataFalha,
                      helperText: errors.dataFalha,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="ticketZendesk"
                name="ticketZendesk"
                label="Ticket Zendesk"
                value={formData.ticketZendesk}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="observacoes"
                name="observacoes"
                label="Observações"
                multiline
                rows={4}
                value={formData.observacoes}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Adicionar Unidade
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarUnidades;