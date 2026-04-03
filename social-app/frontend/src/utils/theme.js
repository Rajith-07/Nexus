import { createTheme } from '@mui/material/styles';

/**
 * Custom MUI theme inspired by modern social apps.
 * Deep navy/slate dark theme with vivid teal accent.
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00C9A7',       // Vibrant teal — action color
      light: '#4DFFD4',
      dark: '#009B7E',
      contrastText: '#0A0F1E',
    },
    secondary: {
      main: '#FF6B9D',       // Coral pink — likes & highlights
      light: '#FF9EBF',
      dark: '#CC4475',
      contrastText: '#fff',
    },
    background: {
      default: '#080D1A',    // Near-black navy
      paper: '#0F1629',      // Card background
    },
    surface: {
      card: '#151E35',       // Slightly lighter card
      input: '#1A2340',      // Input fields
      border: '#252F4A',     // Borders and dividers
    },
    text: {
      primary: '#E8EDF5',
      secondary: '#8A99BB',
      muted: '#4A5778',
    },
    error: { main: '#FF5252' },
    warning: { main: '#FFB830' },
    success: { main: '#00C9A7' },
    divider: '#1E2B45',
  },
  typography: {
    fontFamily: "'Sora', 'DM Sans', sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 600, letterSpacing: '0.02em', textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { background: #080D1A; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0F1E; }
        ::-webkit-scrollbar-thumb { background: #1E2B45; border-radius: 3px; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00C9A7 0%, #009B7E 100%)',
          boxShadow: '0 4px 20px rgba(0, 201, 167, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0, 201, 167, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderColor: '#00C9A7',
          '&:hover': { backgroundColor: 'rgba(0, 201, 167, 0.08)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#0F1629',
          border: '1px solid #1E2B45',
          borderRadius: 20,
          boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
          '&:hover': { borderColor: '#252F4A' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: '#1A2340',
            borderRadius: 12,
            '& fieldset': { borderColor: '#252F4A' },
            '&:hover fieldset': { borderColor: '#3D4F70' },
            '&.Mui-focused fieldset': { borderColor: '#00C9A7' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#00C9A7' },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #00C9A7, #0066FF)',
          fontWeight: 700,
          fontSize: '0.9rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#1E2B45' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'scale(1.1)' },
        },
      },
    },
  },
});

export default theme;
