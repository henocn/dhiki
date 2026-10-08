import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { ExoHeader, Fin } from './commun.jsx';
import { VALEURS, VALEURS_MAX } from './data.js';

// Clarifier ses valeurs : choisir jusqu'à 5 valeurs parmi une liste, puis les afficher par ordre de choix.
export default function Valeurs({ exercice }) {
  const [choisies, setChoisies] = useState([]);
  const [refusee, setRefusee] = useState(null);
  const [fini, setFini] = useState(false);

  // Ajoute ou retire une valeur ; secoue le bouton si la limite est atteinte.
  function basculer(valeur) {
    if (choisies.includes(valeur)) {
      setChoisies((c) => c.filter((v) => v !== valeur));
    } else if (choisies.length < VALEURS_MAX) {
      setChoisies((c) => [...c, valeur]);
    } else {
      setRefusee(valeur);
      setTimeout(() => setRefusee(null), 400);
    }
  }

  if (fini) {
    return (
      <Fin
        icone="star"
        titre="Tes valeurs"
        texte="Ces valeurs peuvent t’aider à prendre des décisions qui te ressemblent."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setChoisies([]);
              setFini(false);
            }}
          >
            Recommencer
          </button>
        }
      >
        <ol className="values-result">
          {choisies.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ol>
        <p className="hint-box">
          <Icon name="compass" size={16} />
          Ta boussole
        </p>
      </Fin>
    );
  }

  return (
    <div className="exo-narrow exo-narrow--wide">
      <ExoHeader titre={exercice.titre} sousTitre={`Choisis les ${VALEURS_MAX} valeurs qui comptent le plus pour toi.`} />
      <div className="chips chips--center">
        {VALEURS.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={choisies.includes(v)}
            className={`chip ${choisies.includes(v) ? 'is-selected' : ''} ${refusee === v ? 'is-shaking' : ''}`}
            onClick={() => basculer(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <p className="muted small center" aria-live="polite">
        {`${choisies.length} / ${VALEURS_MAX} sélectionnées`}
      </p>
      <div className="btn-row btn-row--center">
        <button type="button" className="btn btn-primary" disabled={choisies.length === 0} onClick={() => setFini(true)}>
          Voir mes valeurs
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
