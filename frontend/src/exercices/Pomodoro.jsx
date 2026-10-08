import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { formaterMinutes } from '../lib/utils.js';
import { ExoHeader } from './commun.jsx';

const DUREES = { travail: 25 * 60, pause: 5 * 60 };
const RAYON = 80;
const CIRCONFERENCE = 2 * Math.PI * RAYON;

// Minuteur Pomodoro (25 min de travail / 5 min de pause), arrêté automatiquement en quittant la page.
export default function Pomodoro({ exercice }) {
  const [mode, setMode] = useState('travail');
  const [restant, setRestant] = useState(DUREES.travail);
  const [actif, setActif] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!actif) return undefined;
    const id = setInterval(() => setRestant((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [actif]);

  useEffect(() => {
    if (restant > 0) return;
    setActif(false);
    if (mode === 'travail') {
      setCycles((c) => c + 1);
      setMode('pause');
      setRestant(DUREES.pause);
    } else {
      setMode('travail');
      setRestant(DUREES.travail);
    }
  }, [restant, mode]);

  // Remet le minuteur au début d'une session de travail.
  function reinitialiser() {
    setActif(false);
    setMode('travail');
    setRestant(DUREES.travail);
  }

  const progression = 1 - restant / DUREES[mode];
  return (
    <div className="exo-narrow center">
      <ExoHeader titre={exercice.titre} sousTitre={cycles > 0 ? (cycles === 1 ? `${cycles} session terminée` : `${cycles} sessions terminées`) : '25 minutes de concentration, 5 minutes de pause.'} />
      <div className="pomodoro">
        <svg viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r={RAYON} className="pomodoro-track" />
          <circle
            cx="90"
            cy="90"
            r={RAYON}
            className={`pomodoro-bar pomodoro-bar--${mode}`}
            strokeDasharray={CIRCONFERENCE}
            strokeDashoffset={CIRCONFERENCE * (1 - progression)}
          />
        </svg>
        <div className="pomodoro-center">
          <span className="pomodoro-mode">{mode === 'travail' ? 'Concentration' : 'Pause'}</span>
          <span className="pomodoro-time" role="timer">
            {formaterMinutes(restant)}
          </span>
        </div>
      </div>
      <div className="btn-row btn-row--center">
        <button type="button" className="btn btn-primary" onClick={() => setActif((a) => !a)}>
          <Icon name={actif ? 'pause' : 'play'} size={16} />
          {actif ? 'Pause' : 'Démarrer'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={reinitialiser}>
          <Icon name="refresh" size={16} />
          Réinitialiser
        </button>
      </div>
      <p className="muted small">{mode === 'travail' ? 'Range ton téléphone et concentre-toi sur une seule tâche.' : 'Lève-toi, bois de l’eau, étire-toi.'}</p>
    </div>
  );
}
