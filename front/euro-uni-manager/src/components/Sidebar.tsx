import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Collapse,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import MonitorIcon from '@mui/icons-material/Monitor';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Largura do drawer
const drawerWidth = 240;

interface MenuItemProps {
  title: string;
  path: string;
  icon: React.ReactNode;
}

interface MenuGroupProps {
  title: string;
  icon: React.ReactNode;
  items: MenuItemProps[];
}

const menuItems: (MenuItemProps | MenuGroupProps)[] = [
  { title: 'Início', path: '/', icon: <HomeIcon /> },
  {
    title: 'Unidades',
    icon: <BusinessIcon />,
    items: [
      { title: 'Visualizar Unidades', path: '/visualizar-unidades', icon: <BusinessIcon /> },
      { title: 'Adicionar Unidades', path: '/adicionar-unidades', icon: <AddBusinessIcon /> },
      { title: 'Monitoramento da Unidade', path: '/monitoramento-unidade', icon: <MonitorIcon /> },
    ],
  },
  {
    title: 'Falhas',
    icon: <ErrorIcon />,
    items: [
      { title: 'Adicionar Falhas', path: '/adicionar-falhas', icon: <ErrorIcon /> },
    ],
  },
];

function Sidebar() {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Unidades': true,
    'Falhas': true,
  });

  const handleGroupClick = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/src/assets/eurotec-logo.svg" alt="Eurotec Logo" style={{ height: 40 }} />
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>
        {menuItems.map((item) => {
          // Verificar se é um item de menu simples ou um grupo
          if ('path' in item) {
            // Item simples
            return (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 179, 136, 0.1)',
                      color: '#00B388',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 179, 136, 0.2)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#00B388',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            );
          } else {
            // Grupo de itens
            const isGroupOpen = openGroups[item.title];
            return (
              <Box key={item.title}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleGroupClick(item.title)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                    {isGroupOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isGroupOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items.map((subItem) => (
                      <ListItem key={subItem.title} disablePadding>
                        <ListItemButton
                          component={RouterLink}
                          to={subItem.path}
                          selected={isActive(subItem.path)}
                          sx={{
                            pl: 4,
                            borderRadius: 1,
                            mb: 0.5,
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(0, 179, 136, 0.1)',
                              color: '#00B388',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 179, 136, 0.2)',
                              },
                              '& .MuiListItemIcon-root': {
                                color: '#00B388',
                              },
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText primary={subItem.title} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;