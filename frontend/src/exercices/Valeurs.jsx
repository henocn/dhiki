import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { ExoHeader, Fin } from './commun.jsx';
import { VALEURS, VALEURS_MAX } from './data.js';

// Clarifier ses valeurs : choisir jusqu'à 5 valeurs parmi une liste, puis les afficher par ordre de choix.
export default function Valeurs({ exercice }) {
  const { t } = useLang();
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
        titre={t('exo.valeursFinTitre')}
        texte={t('exo.valeursFinTexte')}
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setChoisies([]);
              setFini(false);
            }}
          >
            {t('commun.recommencer')}
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
          {t('exo.valeursBoussole')}
        </p>
      </Fin>
    );
  }

  return (
    <div className="exo-narrow exo-narrow--wide">
      <ExoHeader titre={exercice.titre} sousTitre={t('exo.valeursSousTitre', { max: VALEURS_MAX })} />
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
        {t('exo.valeursCompte', { n: choisies.length, max: VALEURS_MAX })}
      </p>
      <div className="btn-row btn-row--center">
        <button type="button" className="btn btn-primary" disabled={choisies.length === 0} onClick={() => setFini(true)}>
          {t('exo.voirValeurs')}
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
