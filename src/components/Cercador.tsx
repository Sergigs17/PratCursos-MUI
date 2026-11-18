// PASSOS 6 i 7 · Cercador i filtre de família
// AMPLIACIONS A1 i A2 · Ordenació i filtre de places disponibles
import { FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, Select, Stack, Switch, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { families, type Familia } from '../dades/cursos';

export type Ordre = 'Nom' | 'Hores' | 'Valoració';
type Props = {
  text: string;
  onText: (nou: string) => void;
  familia: Familia | 'Totes';
  onFamilia: (nova: Familia | 'Totes') => void;
  ordre: Ordre;
  onOrdre: (nou: Ordre) => void;
  nomesPlaces: boolean;
  onNomesPlaces: (nou: boolean) => void;
};

export function Cercador({ text, onText, familia, onFamilia, ordre, onOrdre, nomesPlaces, onNomesPlaces }: Props) {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          label="Cerca un curs" placeholder="React, SQL, comptabilitat…"
          value={text} onChange={(e) => onText(e.target.value)} fullWidth
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
        />
        <FormControl sx={{ minWidth: { md: 205 } }} fullWidth>
          <InputLabel id="etiqueta-familia">Família</InputLabel>
          <Select labelId="etiqueta-familia" label="Família" value={familia}
            onChange={(e) => onFamilia(e.target.value as Familia | 'Totes')}>
            <MenuItem value="Totes">Totes les famílies</MenuItem>
            {families.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </Select>
        </FormControl>
        {/* A1 · Ordenar sense modificar l'array original de cursos */}
        <FormControl sx={{ minWidth: { md: 175 } }} fullWidth>
          <InputLabel id="etiqueta-ordre">Ordenar per</InputLabel>
          <Select labelId="etiqueta-ordre" label="Ordenar per" value={ordre}
            onChange={(e) => onOrdre(e.target.value as Ordre)}>
            <MenuItem value="Nom">Nom</MenuItem>
            <MenuItem value="Hores">Hores</MenuItem>
            <MenuItem value="Valoració">Valoració</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {/* A2 · Filtre opcional de places disponibles */}
      <FormControlLabel control={<Switch checked={nomesPlaces} onChange={(e) => onNomesPlaces(e.target.checked)} />}
        label="Només cursos amb places" />
    </Stack>
  );
}
