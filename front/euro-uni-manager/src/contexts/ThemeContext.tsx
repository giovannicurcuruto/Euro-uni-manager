import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Verifica se há uma preferência salva no localStorage
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Cria o tema baseado no modo atual
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#00B388', // Verde Eurotec
        light: '#4ce5b6',
        dark: '#00835e',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#f5f5f5', // Cinza claro para contraste
        light: '#ffffff',
        dark: '#c2c2c2',
        contrastText: '#000000',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#333333' : '#ffffff',
        secondary: mode === 'light' ? '#666666' : '#b0b0b0',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      info: {
        main: '#2196f3',
      },
      success: {
        main: '#00B388',
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
        color: mode === 'light' ? '#333333' : '#ffffff',
      },
      h5: {
        fontWeight: 600,
        color: mode === 'light' ? '#333333' : '#ffffff',
      },
      h6: {
        fontWeight: 600,
        color: mode === 'light' ? '#333333' : '#ffffff',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
          },
          containedPrimary: {
            backgroundColor: '#00B388',
            '&:hover': {
              backgroundColor: '#00835e',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          },
          outlinedPrimary: {
            borderColor: '#00B388',
            color: '#00B388',
            '&:hover': {
              backgroundColor: 'rgba(0, 179, 136, 0.04)',
              borderColor: '#00835e',
            },
          },
          textPrimary: {
            color: '#00B388',
            '&:hover': {
              backgroundColor: 'rgba(0, 179, 136, 0.04)',
            },
          },
          sizeSmall: {
            padding: '4px 12px',
            fontSize: '0.8125rem',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#00B388',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          elevation1: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  // Atualiza o tema quando o modo mudar
  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o contexto do tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};