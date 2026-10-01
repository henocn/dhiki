import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { ExoHeader } from './commun.jsx';

const ECHELLE_MIN = 0.55;
const ECHELLE_MAX = 1;

// Calcule l'échelle du cercle : il grandit à la première phase, rétrécit à la dernière et reste stable entre les deux.
function echellePourPhase(index, total) {
  if (index === total - 1 && total > 1) return ECHELLE_MIN;
  return ECHELLE_MAX;
}

// Exercice de respiration guidée : le cercle s'anime exactement sur la durée de chaque phase.
export default function Respiration({ exercice }) {
  const { t } = useLang();
  const { phases, cycles, sousTitre } = exercice.config;
  const [session, setSession] = useState(1);
  const [actif, setActif] = useState(true);
  const [etat, setEtat] = useState({ cycle: 0, phase: 0, restant: phases[0].dur, fini: false, pret: false });

  useEffect(() => {
    if (!actif) return undefined;
    let cycle = 0;
    let phase = 0;
    let restant = phases[0].dur;
    setEtat({ cycle, phase, restant, fini: false, pret: false });
    const demarrage = setTimeout(() => setEtat((s) => ({ ...s, pret: true })), 60);

    const id = setInterval(() => {
      restant -= 1;
      if (restant <= 0) {
        phase += 1;
        if (phase >= phases.length) {
          phase = 0;
          cycle += 1;
          if (cycle >= cycles) {
            clearInterval(id);
            setActif(false);
            setEtat((s) => ({ ...s, fini: true }));
            return;
          }
        }
        restant = phases[phase].dur;
      }
      setEtat({ cycle, phase, restant, fini: false, pret: true });
    }, 1000);

    return () => {
      clearTimeout(demarrage);
      clearInterval(id);
    };
  }, [actif, session, phases, cycles]);

  // Relance une nouvelle session complète.
  function recommencer() {
    setSession((s) => s + 1);
    setActif(true);
  }

  const enCours = actif && !etat.fini;
  const echelle = enCours && etat.pret ? echellePourPhase(etat.phase, phases.length) : ECHELLE_MIN;
  const duree = enCours && etat.pret ? phases[etat.phase].dur : 0.6;

  return (
    <div className="breath">
      <ExoHeader titre={exercice.titre} sousTitre={sousTitre} />

      <div className="breath-stage">
        <div className="breath-ring" style={{ transform: `scale(${echelle})`, transitionDuration: `${duree}s` }} />
        <div className="breath-core" aria-live="polite">
          {etat.fini ? (
            <>
              <Icon name="check" size={30} strokeWidth={2.4} />
              <span className="breath-label">{t('exo.termine')}</span>
            </>
          ) : enCours ? (
            <>
              <span className="breath-label">{phases[etat.phase].label}</span>
              <span className="breath-count">{etat.restant}</span>
            </>
          ) : (
            <span className="breath-label">{t('exo.enPause')}</span>
          )}
        </div>
      </div>

      <ol className="breath-steps">
        {phases.map((p, i) => (
          <li key={i} className={enCours && i === etat.phase ? 'is-current' : ''}>
            <span className="step-dot" />
            {p.label} · {p.dur} s
          </li>
        ))}
      </ol>

      <p className="muted small center">
        {etat.fini ? t('exo.cyclesTermines', { n: cycles }) : t('exo.cycle', { n: etat.cycle + 1, total: cycles })}
      </p>

      <div className="btn-row btn-row--center">
        {enCours ? (
          <button type="button" className="btn btn-ghost" onClick={() => setActif(false)}>
            <Icon name="pause" size={16} />
            {t('exo.arreter')}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={recommencer}>
            <Icon name="refresh" size={16} />
            {t('commun.recommencer')}
          </button>
        )}
      </div>
    </div>
  );
}
