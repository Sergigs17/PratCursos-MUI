import { useEffect, useState } from 'react';
import { Box, Container, FormControl, Pagination, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import { Capcalera } from './components/Capcalera';
import { Presentacio } from './components/Presentacio';
import { Cercador, type Ordre } from './components/Cercador';
import { LlistaCursos } from './components/LlistaCursos';
import { MenuLateral } from './components/MenuLateral';
import { DetallCurs } from './components/DetallCurs';
import { PeuDePagina } from './components/PeuDePagina';
import { cursos, type Curs, type Familia } from './dades/cursos';

export default function App() {
  // --- Estat de la pàgina (viu a App perquè el comparteixen diversos fills) ---
  const [text, setText] = useState('');
  const [familia, setFamilia] = useState<Familia | 'Totes'>('Totes');
  const [preferits, setPreferits] = useState<Set<number>>(new Set());
  const [menuObert, setMenuObert] = useState(false);
  const [cursObert, setCursObert] = useState<Curs | null>(null);
  const [missatge, setMissatge] = useState<string | null>(null);
  // A1-A3 i A7 · Ordenació, places, modalitat i pàgina actual
  const [ordre, setOrdre] = useState<Ordre>('Nom');
  const [nomesPlaces, setNomesPlaces] = useState(false);
  const [modalitat, setModalitat] = useState<'Totes' | Curs['modalitat']>('Totes');
  const [pagina, setPagina] = useState(1);
  // A4 · Simulem una càrrega inicial d'1,5 segons.
  const [carregant, setCarregant] = useState(true);
  useEffect(() => {
    const temporitzador = setTimeout(() => setCarregant(false), 1500);
    return () => clearTimeout(temporitzador);
  }, []);

  // --- Dades derivades ---
  // A1 · sort() modifica l'array; per això primer en fem una còpia.
  // A2 i A3 · Apliquem els filtres de places i modalitat al mateix temps.
  const cursosFiltrats = [...cursos]
    .filter((c) =>
      c.nom.toLowerCase().includes(text.toLowerCase()) &&
      (familia === 'Totes' || c.familia === familia) &&
      (!nomesPlaces || c.places > 0) &&
      (modalitat === 'Totes' || c.modalitat === modalitat),
    )
    .sort((a, b) => {
      if (ordre === 'Hores') return a.hores - b.hores;
      if (ordre === 'Valoració') return b.valoracio - a.valoracio;
      return a.nom.localeCompare(b.nom, 'ca');
    });

  // A7 · Sis cursos per pàgina; si canvien els filtres, tornem a la primera.
  const cursosPerPagina = 6;
  const totalPagines = Math.ceil(cursosFiltrats.length / cursosPerPagina);
  const cursosPagina = cursosFiltrats.slice((pagina - 1) * cursosPerPagina, pagina * cursosPerPagina);
  const reiniciaPagina = () => setPagina(1);

  // --- Accions ---
  const canviaPreferit = (id: number) => {
    setPreferits((anteriors) => {
      // còpia: l'estat no es modifica mai directament
      const nous = new Set(anteriors);
      if (nous.has(id)) nous.delete(id);
      else nous.add(id);
      return nous;
    });
  };

  const inscriu = (curs: Curs) => {
    setCursObert(null);
    setMissatge(`T’has inscrit a «${curs.nom}». Rebràs un correu amb els detalls.`);
  };

  return (
    <>
      <Capcalera preferits={preferits.size} onObrirMenu={() => setMenuObert(true)} />
      <MenuLateral
        obert={menuObert}
        onTancar={() => setMenuObert(false)}
        familia={familia}
        onFamilia={(nova) => { setFamilia(nova); reiniciaPagina(); }}
      />
      <Presentacio />
      <Container maxWidth="lg" id="cursos" sx={{ py: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>Catàleg de cursos</Typography>
        <Cercador
          text={text} onText={(nou) => { setText(nou); reiniciaPagina(); }}
          familia={familia} onFamilia={(nova) => { setFamilia(nova); reiniciaPagina(); }}
          ordre={ordre} onOrdre={(nou) => { setOrdre(nou); reiniciaPagina(); }}
          nomesPlaces={nomesPlaces} onNomesPlaces={(nou) => { setNomesPlaces(nou); reiniciaPagina(); }}
        />
        {/* A3 · Pestanyes de modalitat sobre la graella */}
        <Tabs value={modalitat} onChange={(_, nova: typeof modalitat) => { setModalitat(nova); reiniciaPagina(); }}
          variant="scrollable" scrollButtons="auto" sx={{ mb: 3 }} aria-label="Filtra per modalitat">
          <Tab label="Totes" value="Totes" />
          <Tab label="Presencial" value="Presencial" />
          <Tab label="En línia" value="En línia" />
          <Tab label="Semipresencial" value="Semipresencial" />
        </Tabs>
        {/* A4 · Esquelets durant la càrrega simulada */}
        {carregant ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {Array.from({ length: 9 }, (_, i) => (
              <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Skeleton variant="rectangular" height={96} />
                <Skeleton variant="text" sx={{ fontSize: '1.8rem', mt: 2 }} />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="65%" />
                <Skeleton variant="rounded" height={32} sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>
        ) : <LlistaCursos
          cursos={cursosPagina}
          preferits={preferits}
          onPreferit={canviaPreferit}
          onDetall={setCursObert}
        />}
        {/* A7 · La paginació es calcula després d'aplicar tots els filtres */}
        {!carregant && totalPagines > 1 && (
          <Pagination count={totalPagines} page={pagina} onChange={(_, nova) => setPagina(nova)}
            color="primary" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }} />
        )}
      </Container>
      <PeuDePagina />
      <DetallCurs curs={cursObert} onTancar={() => setCursObert(null)} onInscriure={inscriu} />
      <Snackbar
        open={missatge !== null}
        autoHideDuration={4000}
        onClose={() => setMissatge(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setMissatge(null)}>{missatge}</Alert>
      </Snackbar>
    </>
  );
}
