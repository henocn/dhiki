import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { MEDIAS } from '../content/medias.js';
import { ExoHeader } from './commun.jsx';

const ECHELLE_MIN = 0.55;
const ECHELLE_MAX = 1;

// Calcule l'échelle du cercle : il grandit à la première phase, rétrécit à la dernière et reste stable entre les deux.
function echellePourPhase(index, total) {
  if (index === total - 1 && total > 1) return ECHELLE_MIN;
  return ECHELLE_MAX;
}

// Bouton de son d'ambiance en boucle, masqué si le fichier audio n'est pas encore déposé.
function SonAmbiance({ actif }) {
  const audio = useRef(null);
  const [disponible, setDisponible] = useState(false);
  const [joue, setJoue] = useState(false);

  useEffect(() => {
    let annule = false;
    fetch(MEDIAS.respirationAmbiance.src, { method: 'HEAD' })
      .then((r) => {
        if (!annule) setDisponible(r.ok && (r.headers.get('content-type') ?? '').startsWith('audio'));
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, []);

  useEffect(() => {
    if (!actif && joue) {
      audio.current?.pause();
      setJoue(false);
    }
  }, [actif, joue]);

  // Lance ou coupe la musique d'ambiance.
  function basculer() {
    const el = audio.current;
    if (!el) return;
    if (joue) {
      el.pause();
      setJoue(false);
    } else {
      el.volume = 0.5;
      el.play().then(() => setJoue(true)).catch(() => setDisponible(false));
    }
  }

  if (!disponible) return null;
  return (
    <>
      <audio ref={audio} src={MEDIAS.respirationAmbiance.src} loop preload="none" onError={() => setDisponible(false)} />
      <button type="button" className="btn btn-ghost btn-sm breath-son" onClick={basculer} aria-pressed={joue}>
        <Icon name={joue ? 'volume' : 'volumeOff'} size={16} />
        {joue ? 'Couper le son' : 'Son d’ambiance'}
      </button>
    </>
  );
}

// Exercice de respiration guidée : le cercle s'anime exactement sur la durée de chaque phase.
export default function Respiration({ exercice }) {
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
              <span className="breath-label">Exercice terminé</span>
            </>
          ) : enCours ? (
            <>
              <span className="breath-label">{phases[etat.phase].label}</span>
              <span className="breath-count">{etat.restant}</span>
            </>
          ) : (
            <span className="breath-label">En pause</span>
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
        {etat.fini ? `${cycles} cycles terminés` : `Cycle ${etat.cycle + 1} sur ${cycles}`}
      </p>

      <div className="btn-row btn-row--center">
        {enCours ? (
          <button type="button" className="btn btn-ghost" onClick={() => setActif(false)}>
            <Icon name="pause" size={16} />
            Arrêter
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={recommencer}>
            <Icon name="refresh" size={16} />
            Recommencer
          </button>
        )}
        <SonAmbiance actif={enCours} />
      </div>
    </div>
  );
}
