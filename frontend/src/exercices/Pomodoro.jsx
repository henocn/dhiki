import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { formaterMinutes } from '../lib/utils.js';
import { ExoHeader } from './commun.jsx';

const DUREES = { travail: 25 * 60, pause: 5 * 60 };
const RAYON = 80;
const CIRCONFERENCE = 2 * Math.PI * RAYON;

// Minuteur Pomodoro (25 min de travail / 5 min de pause), arrêté automatiquement en quittant la page.
export default function Pomodoro({ exercice }) {
  const { t } = useLang();
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
      <ExoHeader titre={exercice.titre} sousTitre={cycles > 0 ? t('exo.pomodoroCycles', { n: cycles }) : t('exo.pomodoroSousTitre')} />
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
          <span className="pomodoro-mode">{t(`exo.pomodoro.${mode}`)}</span>
          <span className="pomodoro-time" role="timer">
            {formaterMinutes(restant)}
          </span>
        </div>
      </div>
      <div className="btn-row btn-row--center">
        <button type="button" className="btn btn-primary" onClick={() => setActif((a) => !a)}>
          <Icon name={actif ? 'pause' : 'play'} size={16} />
          {actif ? t('exo.pause') : t('exo.demarrer')}
        </button>
        <button type="button" className="btn btn-ghost" onClick={reinitialiser}>
          <Icon name="refresh" size={16} />
          {t('exo.reinitialiser')}
        </button>
      </div>
      <p className="muted small">{mode === 'travail' ? t('exo.pomodoroConseilTravail') : t('exo.pomodoroConseilPause')}</p>
    </div>
  );
}
