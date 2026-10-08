import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { ExoHeader, Fin, Progression } from './commun.jsx';
import { ANCRAGE_ETAPES } from './data.js';

// Ancrage sensoriel 5-4-3-2-1 : un sens par écran, réponses facultatives non enregistrées.
export default function Ancrage({ exercice }) {
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState(() => ANCRAGE_ETAPES.map(() => ''));

  if (etape >= ANCRAGE_ETAPES.length) {
    return (
      <Fin
        titre="Te voilà ancré·e"
        texte="Tu as ramené ton attention dans le moment présent. Tu peux refaire cet exercice dès que l’angoisse monte."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setReponses(ANCRAGE_ETAPES.map(() => ''));
              setEtape(0);
            }}
          >
            Recommencer
          </button>
        }
      >
        <ul className="answer-list">
          {ANCRAGE_ETAPES.map((s, i) => (
            <li key={s.n}>
              <span>
                <Icon name={s.icone} size={15} /> {s.n} {s.label}
              </span>
              <p>{reponses[i] || '—'}</p>
            </li>
          ))}
        </ul>
      </Fin>
    );
  }

  const s = ANCRAGE_ETAPES[etape];
  return (
    <div className="exo-narrow">
      <ExoHeader titre={exercice.titre} sousTitre="Utilise tes sens pour revenir ici et maintenant." />
      <Progression total={ANCRAGE_ETAPES.length} courant={etape} />
      <div className="exo-panel">
        <div className="sense-head">
          <span className="tile-icon tile-icon--tc">
            <Icon name={s.icone} size={26} />
          </span>
          <div>
            <span className="sense-n">{s.n}</span>
            <span className="muted">{s.label}</span>
          </div>
        </div>
        <label className="field">
          <span className="exo-question">{s.instruction}</span>
          <textarea
            rows={4}
            value={reponses[etape]}
            placeholder="Note ce que tu remarques…"
            onChange={(e) => setReponses((r) => r.map((v, i) => (i === etape ? e.target.value : v)))}
          />
        </label>
      </div>
      <div className="btn-row btn-row--center">
        {etape > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => setEtape((e) => e - 1)}>
            <Icon name="arrowLeft" size={16} />
            Précédent
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={() => setEtape((e) => e + 1)}>
          Continuer
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}
