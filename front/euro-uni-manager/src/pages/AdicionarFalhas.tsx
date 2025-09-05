import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';

interface Unidade {
  id: number;
  nome_unidade: string;
  grupo_unidade: string;
  tecnico_unidade: string;
  id_unidade: string;
  observacoes: string;
}

interface FalhaFormData {
  unidade: string;
  falha_ocorrida: string;
  data_falha: Date | null;
  observacao: string;
}

function AdicionarFalhas() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [falhaData, setFalhaData] = useState<FalhaFormData>({
    unidade: '',
    falha_ocorrida: '',
    data_falha: null,
    observacao: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingUnidades, setLoadingUnidades] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [falhaErrors, setFalhaErrors] = useState<Partial<Record<keyof FalhaFormData, string>>>({
    unidade: '',
    falha_ocorrida: '',
    data_falha: '',
  });

  // Carregar unidades do backend
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/unidades/');
        if (response.ok) {
          const data = await response.json();
          setUnidades(data);
        } else {
          setErrorMessage('Erro ao carregar unidades');
        }
      } catch (error) {
        setErrorMessage('Erro ao conectar com o servidor');
      } finally {
        setLoadingUnidades(false);
      }
    };

    fetchUnidades();
  }, []);
  
  const handleFalhaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFalhaData({
      ...falhaData,
      [name]: value,
    });

    if (falhaErrors[name as keyof FalhaFormData]) {
      setFalhaErrors({
        ...falhaErrors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFalhaData({
      ...falhaData,
      [name]: value,
    });

    if (falhaErrors[name as keyof FalhaFormData]) {
      setFalhaErrors({
        ...falhaErrors,
        [name]: '',
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFalhaData({
      ...falhaData,
      data_falha: date,
    });

    if (date) {
      setFalhaErrors({
        ...falhaErrors,
        data_falha: '',
      });
    }
  };
  
  const handleFalhaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof FalhaFormData, string>> = {};
    
    if (!falhaData.unidade.trim()) {
      newErrors.unidade = 'Unidade é obrigatória';
    }
    
    if (!falhaData.falha_ocorrida.trim()) {
      newErrors.falha_ocorrida = 'Falha ocorrida é obrigatória';
    }
    
    if (!falhaData.data_falha) {
      newErrors.data_falha = 'Data da falha é obrigatória';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setFalhaErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const formattedData = {
        unidade: parseInt(falhaData.unidade),
        falha_ocorrida: falhaData.falha_ocorrida,
        data_falha: falhaData.data_falha?.toISOString().split('T')[0], // Format: YYYY-MM-DD
        observacao: falhaData.observacao,
        ativa: true
      };
      
      const response = await fetch('http://127.0.0.1:8000/api/falhas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      if (response.ok) {
        setSuccessMessage('Falha registrada com sucesso!');
        setFalhaData({
          unidade: '',
          falha_ocorrida: '',
          data_falha: null,
          observacao: '',
        });
        setFalhaErrors({});
      } else {
        const errorData = await response.json();
        setErrorMessage('Erro ao registrar falha: ' + (errorData.detail || 'Erro desconhecido'));
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom color="primary" fontWeight="bold" sx={{ mb: 3 }}>
          Registrar Falha
        </Typography>
        
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Box 
             component="form" 
             onSubmit={handleFalhaSubmit} 
             noValidate
             sx={{
               display: 'grid',
               gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
               gap: 3,
               '& .full-width': {
                 gridColumn: { xs: '1', md: '1 / -1' }
               },
               '& .buttons-row': {
                 gridColumn: '1 / -1',
                 display: 'flex',
                 justifyContent: 'flex-end',
                 mt: 2
               }
             }}
           >
             {/* Primeira linha: Unidade *, Falha Ocorrida *, Data da Falha * */}
             <FormControl fullWidth error={!!falhaErrors.unidade}>
               <InputLabel id="unidade-select-label">Unidade *</InputLabel>
               <Select
                 labelId="unidade-select-label"
                 id="unidade"
                 name="unidade"
                 value={falhaData.unidade}
                 label="Unidade *"
                 onChange={handleSelectChange}
                 required
                 disabled={loadingUnidades || loading}
               >
                 <MenuItem value=""><em>Selecione</em></MenuItem>
                 {loadingUnidades ? (
                   <MenuItem disabled>
                     <CircularProgress size={20} /> Carregando unidades...
                   </MenuItem>
                 ) : (
                   unidades.map((unidade) => (
                     <MenuItem key={unidade.id} value={unidade.id.toString()}>
                       {unidade.nome_unidade}
                     </MenuItem>
                   ))
                 )}
               </Select>
               {falhaErrors.unidade && <FormHelperText>{falhaErrors.unidade}</FormHelperText>}
             </FormControl>
             
             <TextField
               required
               fullWidth
               id="falhaOcorrida"
               name="falha_ocorrida"
               label="Falha Ocorrida"
               value={falhaData.falha_ocorrida}
               onChange={handleFalhaChange}
               error={!!falhaErrors.falha_ocorrida}
               helperText={falhaErrors.falha_ocorrida}
               disabled={loading}
             />
             
             <DatePicker
               label="Data da Falha *"
               value={falhaData.data_falha}
               onChange={handleDateChange}
               disabled={loading}
               slotProps={{
                 textField: {
                   fullWidth: true,
                   error: !!falhaErrors.data_falha,
                   helperText: falhaErrors.data_falha,
                 }
               }}
             />
            
            {/* Segunda linha: Observação (textarea ocupando toda a largura) */}
            <TextField
              fullWidth
              id="observacao"
              name="observacao"
              label="Observação"
              multiline
              rows={4}
              value={falhaData.observacao}
              onChange={handleFalhaChange}
              className="full-width"
              disabled={loading}
            />
            
            {/* Terceira linha: Botão Registrar Falha alinhado à direita */}
            <Box className="buttons-row">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || loadingUnidades}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Registrando...' : 'Registrar Falha'}
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Paper>
      
      {/* Snackbars para feedback */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdicionarFalhas;