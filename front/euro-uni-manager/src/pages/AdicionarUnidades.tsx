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
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 3 }}>
          Adicionar unidade
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Primeira linha com os selects */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="tipo-usuario-label">Tipos de usuários</InputLabel>
                <Select
                  labelId="tipo-usuario-label"
                  id="tipo-usuario"
                  label="Tipos de usuários"
                  value=""
                  onChange={handleSelectChange}
                >
                  <MenuItem value=""><em>Selecione alguma opção...</em></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="grupo-label">Grupo</InputLabel>
                <Select
                  labelId="grupo-label"
                  id="grupoUnidade"
                  name="grupoUnidade"
                  label="Grupo"
                  value={formData.grupoUnidade}
                  onChange={handleSelectChange}
                >
                  <MenuItem value=""><em>Selecione alguma opção...</em></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="unidade-label">Unidade</InputLabel>
                <Select
                  labelId="unidade-label"
                  id="unidade"
                  label="Unidade"
                  value=""
                  onChange={handleSelectChange}
                >
                  <MenuItem value=""><em>Selecione alguma opção...</em></MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Segunda linha com campos de texto */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="nomeUnidade"
                name="nomeUnidade"
                label="Nome"
                value={formData.nomeUnidade}
                onChange={handleChange}
                error={!!errors.nomeUnidade}
                helperText={errors.nomeUnidade}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="E-mail"
                type="email"
                onChange={handleChange}
              />
            </Grid>
            
            {/* Terceira linha */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="tipoUsuario"
                name="tipoUsuario"
                label="Tipo de Usuário"
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="telefone"
                name="telefone"
                label="Telefone"
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="tecnicoUnidade"
                name="tecnicoUnidade"
                label="Técnico da Unidade"
                value={formData.tecnicoUnidade}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Quarta linha */}
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
            
            {/* Botões de ação */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Adicionar unidade
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AdicionarUnidades;