import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// Dados de exemplo para a tabela
const unidades = [
  { id: 1, nome: 'Unidade A', dataFalha: '10/05/2024', observacao: 'Falha no sistema de refrigeração' },
  { id: 2, nome: 'Unidade B', dataFalha: '15/05/2024', observacao: 'Manutenção preventiva' },
  { id: 3, nome: 'Unidade C', dataFalha: '20/05/2024', observacao: 'Troca de equipamentos' },
  { id: 4, nome: 'Unidade D', dataFalha: '25/05/2024', observacao: 'Atualização de software' },
  { id: 5, nome: 'Unidade E', dataFalha: '30/05/2024', observacao: 'Inspeção de rotina' },
];

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Gerenciamento de Unidades
      </Typography>
      
      <Typography variant="body1" paragraph align="center">
        Bem-vindo ao sistema de gerenciamento de unidades. Abaixo estão listadas as 5 unidades com suas respectivas informações.
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Unidade</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Data da Falha</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Observação</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unidades.map((unidade) => (
              <TableRow key={unidade.id}>
                <TableCell>{unidade.nome}</TableCell>
                <TableCell>{unidade.dataFalha}</TableCell>
                <TableCell>{unidade.observacao}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Home;