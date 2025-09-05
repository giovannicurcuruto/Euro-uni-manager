import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import ptBR from 'date-fns/locale/pt-BR';

interface UnidadeFormData {
  nome_unidade: string;
  grupo_unidade: string;
  tecnico_unidade: string;
  id_unidade: string;
  observacoes: string;
}

function AdicionarUnidades() {
  const [unidadeData, setUnidadeData] = useState<UnidadeFormData>({
    nome_unidade: '',
    grupo_unidade: '',
    tecnico_unidade: '',
    id_unidade: '',
    observacoes: '',
  });

  const [unidadeErrors, setUnidadeErrors] = useState<Partial<Record<keyof UnidadeFormData, string>>>({
    nome_unidade: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUnidadeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUnidadeData({
      ...unidadeData,
      [name]: value,
    });

    if (unidadeErrors[name as keyof UnidadeFormData]) {
      setUnidadeErrors({
        ...unidadeErrors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setUnidadeData({
      ...unidadeData,
      [name]: value,
    });
  };

  const handleUnidadeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof UnidadeFormData, string>> = {};
    
    if (!unidadeData.nome_unidade.trim()) {
      newErrors.nome_unidade = 'Nome é obrigatório';
    }
    
    if (!unidadeData.id_unidade.trim()) {
      newErrors.id_unidade = 'ID da Unidade é obrigatório';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setUnidadeErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/unidades/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unidadeData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Unidade criada:', result);
        
        setSuccessMessage('Unidade adicionada com sucesso!');
        setUnidadeData({
          nome_unidade: '',
          grupo_unidade: '',
          tecnico_unidade: '',
          id_unidade: '',
          observacoes: '',
        });
        setUnidadeErrors({});
      } else {
        const errorData = await response.json();
        console.error('Erro ao criar unidade:', errorData);
        setErrorMessage('Erro ao adicionar unidade. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setErrorMessage('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 3 }}>
          Adicionar Unidade
        </Typography>
        
        <Box 
          component="form" 
          onSubmit={handleUnidadeSubmit} 
          noValidate
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            '& .full-width': {
              gridColumn: { xs: '1', md: '1 / -1' }
            },
            '& .buttons-row': {
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2
            }
          }}
        >
          {/* Primeira linha: Nome *, Grupo */}
          <TextField
            required
            fullWidth
            id="nome_unidade"
            name="nome_unidade"
            label="Nome da Unidade"
            value={unidadeData.nome_unidade}
            onChange={handleUnidadeChange}
            error={!!unidadeErrors.nome_unidade}
            helperText={unidadeErrors.nome_unidade}
            disabled={loading}
          />
          
          <TextField
            fullWidth
            id="grupo_unidade"
            name="grupo_unidade"
            label="Grupo"
            value={unidadeData.grupo_unidade}
            onChange={handleUnidadeChange}
            disabled={loading}
          />
          
          {/* Segunda linha: Técnico da Unidade, Id da Unidade */}
          <TextField
            fullWidth
            id="tecnico_unidade"
            name="tecnico_unidade"
            label="Técnico da Unidade (Opcional)"
            value={unidadeData.tecnico_unidade}
            onChange={handleUnidadeChange}
            disabled={loading}
          />
          
          <TextField
            required
            fullWidth
            id="id_unidade"
            name="id_unidade"
            label="ID da Unidade"
            value={unidadeData.id_unidade}
            onChange={handleUnidadeChange}
            error={!!unidadeErrors.id_unidade}
            helperText={unidadeErrors.id_unidade}
            disabled={loading}
          />
          
          {/* Terceira linha: Observações (textarea ocupando toda a largura) */}
          <TextField
            fullWidth
            className="full-width"
            id="observacoes"
            name="observacoes"
            label="Observações"
            multiline
            rows={4}
            value={unidadeData.observacoes}
            onChange={handleUnidadeChange}
            disabled={loading}
          />
          
          {/* Quarta linha: Botões alinhados à direita */}
          <Box className="buttons-row">
            <Button
              variant="outlined"
              color="primary"
              type="button"
              disabled={loading}
              onClick={() => {
                setUnidadeData({
                  nome_unidade: '',
                  grupo_unidade: '',
                  tecnico_unidade: '',
                  id_unidade: '',
                  observacoes: '',
                });
                setUnidadeErrors({});
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Adicionando...' : 'Adicionar unidade'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Snackbars para feedback */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdicionarUnidades;