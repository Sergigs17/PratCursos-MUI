// PAS 10 · La fitxa d'un curs dins d'un diàleg
// AMPLIACIÓ A5 · Formulari de confirmació abans de la inscripció
import { useEffect, useState } from 'react';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemIcon, ListItemText, Stack, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Curs } from '../dades/cursos';

type Props = {
  curs: Curs | null; // null = cap diàleg obert
  onTancar: () => void;
  onInscriure: (curs: Curs) => void;
};

export function DetallCurs({ curs, onTancar, onInscriure }: Props) {
  const [nom, setNom] = useState('');
  const [correu, setCorreu] = useState('');
  const [intentat, setIntentat] = useState(false);
  // Neteja el formulari quan s'obre un altre curs.
  useEffect(() => { setNom(''); setCorreu(''); setIntentat(false); }, [curs?.id]);
  const nomValid = nom.trim().length > 0;
  const correuValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correu.trim());
  const potInscriure = nomValid && correuValid;
  return (
    <Dialog open={curs !== null} onClose={onTancar} fullWidth maxWidth="sm">
      {curs && (
        <>
          <DialogTitle>{curs.nom}</DialogTitle>
          <DialogContent>
            <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Chip label={curs.familia} color="primary" size="small" />
              <Chip label={`${curs.hores} hores`} size="small" variant="outlined" />
              <Chip label={curs.modalitat} size="small" variant="outlined" />
            </Stack>
            <DialogContentText>{curs.resum}</DialogContentText>
            <Divider sx={{ my: 2 }}>Programa</Divider>
            <List dense>
              {curs.continguts.map((tema) => (
                <ListItem key={tema}>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary={tema} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }}>Dades d'inscripció</Divider>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField label="Nom i cognoms" value={nom} required fullWidth
                onChange={(e) => setNom(e.target.value)} onBlur={() => setIntentat(true)}
                error={intentat && !nomValid}
                helperText={intentat && !nomValid ? 'Escriu el teu nom.' : ' '} />
              <TextField label="Correu electrònic" type="email" value={correu} required fullWidth
                onChange={(e) => setCorreu(e.target.value)} onBlur={() => setIntentat(true)}
                error={intentat && !correuValid}
                helperText={intentat && !correuValid ? 'Introdueix un correu electrònic vàlid.' : ' '} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onTancar}>Tanca</Button>
            <Button variant="contained" disabled={!potInscriure} onClick={() => onInscriure(curs)}>Inscriu-me</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
