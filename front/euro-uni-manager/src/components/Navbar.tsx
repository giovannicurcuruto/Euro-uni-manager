import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

// Importando o logo
import logoSvg from '../assets/eurotec-logo.svg';

const pages = [
  { title: 'Unidades', path: '/visualizar-unidades' },
  { title: 'Falhas', path: '/adicionar-falhas' },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

// Estilo para a barra de pesquisa
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

  return (
    <AppBar position="static" sx={{ boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64 }}>
          {/* Logo para desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, alignItems: 'center' }}>
            <img src={logoSvg} alt="Eurotec Logo" style={{ height: 40, marginRight: 10 }} />
            <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'white' }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 'bold', letterSpacing: '.1rem' }}
            >
              Gerenciador do Suporte
            </Typography>
          </Box>

          {/* Menu para mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu de navegação"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          {/* Logo para mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1, alignItems: 'center' }}>
            <img src={logoSvg} alt="Eurotec Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography
              variant="subtitle1"
              noWrap
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              Gerenciador do Suporte
            </Typography>
          </Box>
          
          {/* Barra de pesquisa */}
          <Search sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 0.5, mx: 2 }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Digite um grupo ou unidade para pesquisar..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          
          {/* Links de navegação para desktop */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  mx: 0.5, 
                  color: 'white', 
                  display: 'block',
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.1),
                  }
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          
          {/* Avatar do usuário */}
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <IconButton sx={{ p: 0 }}>
              <Avatar alt="User" sx={{ bgcolor: alpha('#ffffff', 0.3), width: 32, height: 32 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;