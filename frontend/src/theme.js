import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4f46e5' },
    secondary: { main: '#0891b2' },
    background: { default: '#f4f6fb', paper: '#ffffff' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: '1px solid #e5e7eb' },
      },
    },
  },
});

export default theme;

// Shared chart colours, kept here so every chart matches the MUI theme.
export const chartColors = ['#4f46e5', '#0891b2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
