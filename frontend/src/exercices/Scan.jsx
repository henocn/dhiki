import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { ExoHeader, Fin, Progression } from './commun.jsx';
import { SCAN_SECONDES, SCAN_ZONES } from './data.js';

// Scan corporel : chaque zone dure 30 s puis passe automatiquement à la suivante (minuteur nettoyé en quittant la page).
export default function Scan({ exercice }) {
  const [zone, setZone] = useState(0);
  const [restant, setRestant] = useState(SCAN_SECONDES);
  const [enPause, setEnPause] = useState(false);
  const termine = zone >= SCAN_ZONES.length;

  useEffect(() => {
    if (termine || enPause) return undefined;
    const id = setInterval(() => setRestant((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [zone, termine, enPause]);

  useEffect(() => {
    if (restant <= 0) {
      setZone((z) => z + 1);
      setRestant(SCAN_SECONDES);
    }
  }, [restant]);

  // Passe directement à la zone suivante.
  function suivante() {
    setZone((z) => z + 1);
    setRestant(SCAN_SECONDES);
  }

  if (termine) {
    return (
      <Fin
        titre="Scan terminé"
        texte="Tu as parcouru tout ton corps. Remarque les zones plus détendues qu’au début."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setZone(0);
              setRestant(SCAN_SECONDES);
              setEnPause(false);
            }}
          >
            Recommencer
          </button>
        }
      />
    );
  }

  const z = SCAN_ZONES[zone];
  return (
    <div className="exo-narrow">
      <ExoHeader titre={exercice.titre} sousTitre={`Zone ${zone + 1} sur ${SCAN_ZONES.length}`} />
      <Progression total={SCAN_ZONES.length} courant={zone} />
      <div className="exo-panel">
        <h2 className="exo-zone">{z.label}</h2>
        <p>{z.instruction}</p>
        <div className="timer-row">
          <span className="timer-bubble" aria-live="off">
            {restant}
          </span>
          <span className="muted small">Porte ton attention sur cette zone, sans chercher à changer quoi que ce soit.</span>
        </div>
      </div>
      <div className="btn-row btn-row--center">
        <button type="button" className="btn btn-ghost" onClick={() => setEnPause((p) => !p)}>
          <Icon name={enPause ? 'play' : 'pause'} size={16} />
          {enPause ? 'Reprendre' : 'Pause'}
        </button>
        <button type="button" className="btn btn-primary" onClick={suivante}>
          Zone suivante
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
