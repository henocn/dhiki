import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { melanger } from '../lib/utils.js';
import { ExoHeader, Fin, Progression } from './commun.jsx';
import { ECOUTE_CLES, ECOUTE_SCENARIOS, LIMITES_CLES, LIMITES_SCENARIOS } from './data.js';

const PAR_SESSION = 3;

// Mises en situation à choix multiples : 3 scénarios tirés au hasard, retour expliqué après chaque choix.
function Quiz({ exercice, scenarios, cles, icone }) {
  const [tirage, setTirage] = useState(() => melanger(scenarios).slice(0, PAR_SESSION));
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState(null);

  // Nouvelle session avec d'autres scénarios.
  function nouvelleSession() {
    setTirage(melanger(scenarios).slice(0, PAR_SESSION));
    setIndex(0);
    setChoix(null);
  }

  // Passe au scénario suivant.
  function suivant() {
    setIndex((i) => i + 1);
    setChoix(null);
  }

  if (index >= tirage.length) {
    return (
      <Fin
        icone={icone}
        titre="Bravo"
        texte="Tu as parcouru toutes les situations. Voici ce qu’il faut retenir."
        actions={
          <button type="button" className="btn btn-primary" onClick={nouvelleSession}>
            Nouvelles situations
            <Icon name="arrowRight" size={16} />
          </button>
        }
      >
        <ul className="keys-list">
          {cles.map((c) => (
            <li key={c.texte} className={c.ok ? 'is-ok' : 'is-ko'}>
              <Icon name={c.ok ? 'check' : 'x'} size={16} strokeWidth={2.4} />
              {c.texte}
            </li>
          ))}
        </ul>
      </Fin>
    );
  }

  const s = tirage[index];
  const bonne = s.choix.find((c) => c.ok);
  return (
    <div className="exo-narrow exo-narrow--wide">
      <ExoHeader titre={exercice.titre} sousTitre={`Situation ${index + 1} sur ${tirage.length}`} />
      <Progression total={tirage.length} courant={index} />
      <div className="exo-panel">
        <p className="muted small">{s.contexte}</p>
        <blockquote className="scenario-quote">{s.message}</blockquote>
      </div>
      <div className="choices">
        {s.choix.map((c, i) => {
          const revele = choix !== null;
          const classe = revele ? (c.ok ? 'is-ok' : i === choix ? 'is-ko' : 'is-dim') : '';
          return (
            <button key={i} type="button" className={`choice ${classe}`} disabled={revele} onClick={() => setChoix(i)}>
              {c.texte}
              {revele && (c.ok || i === choix) && (
                <span className="choice-feedback">
                  <Icon name={c.ok ? 'check' : 'x'} size={15} strokeWidth={2.4} />
                  {c.ok ? 'Bonne approche' : c.pourquoi}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {choix !== null && (
        <>
          <p className="hint-box hint-box--sage">
            <Icon name="sparkles" size={16} />
            <span>
              <strong>À retenir</strong> {bonne.pourquoi}
            </span>
          </p>
          <div className="btn-row btn-row--center">
            <button type="button" className="btn btn-primary" onClick={suivant}>
              {index === tirage.length - 1 ? 'Terminer' : 'Situation suivante'}
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Exercice « L'écoute active ».
export function EcouteActive({ exercice }) {
  return <Quiz exercice={exercice} scenarios={ECOUTE_SCENARIOS} cles={ECOUTE_CLES} icone="ear" />;
}

// Exercice « Poser des limites ».
export function PoserLimites({ exercice }) {
  return <Quiz exercice={exercice} scenarios={LIMITES_SCENARIOS} cles={LIMITES_CLES} icone="shield" />;
}
