import { Container, Typography, Box } from '@mui/material';

function AdicionarUnidades() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Adicionar Unidades
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Esta página será implementada em breve. Por enquanto, aqui está uma imagem temporária.
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
        }}
      >
        <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f5f5f5" />
          <circle cx="200" cy="150" r="80" fill="#dc004e" />
          <text x="200" y="155" fontSize="20" textAnchor="middle" fill="white">
            Adicionar Unidades
          </text>
        </svg>
      </Box>
    </Container>
  );
}

export default AdicionarUnidades;