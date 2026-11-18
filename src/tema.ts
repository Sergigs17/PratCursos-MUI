// PAS 1 · El tema de PratCursos
// El TEMA és el lloc on diem a MUI els colors, la lletra i les formes.
// AMPLIACIÓ A6 · ColorSchemes permet canviar entre clar i fosc.
import { createTheme } from '@mui/material/styles';

export const tema = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#E1211D' }, // vermell PratFP
        secondary: { main: '#1F2A30' }, // gris fosc
        background: { default: '#F6F7F9' }, // fons gris clar
      },
    },
    dark: {
      palette: {
        primary: { main: '#FF6965' }, // vermell amb contrast sobre fons fosc
        secondary: { main: '#26343C', contrastText: '#FFFFFF' },
        background: { default: '#111820', paper: '#1E2933' },
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    h3: { fontWeight: 800 },
    // botons sense MAJÚSCULES i en negreta
    button: { textTransform: 'none', fontWeight: 700 },
  },
});
