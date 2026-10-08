import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { LIENS_PROCHE, PRO_URGENCE } from '../../content/urgence.js';
import { api } from '../../lib/api.js';
import Icon from '../Icon.jsx';
import { FormError } from '../TemoignageForm.jsx';
import { useUrgence } from './UrgenceContext.jsx';

const VIDE = { prenom: '', procheNom: '', procheLien: '', procheTelephone: '', message: '', consentement: false };

// Fenêtre d'aide immédiate : le jeune choisit de parler à un proche (mise en relation par l'équipe) ou à un·e professionnel·le.
export default function UrgenceModal() {
  const { ouvert, fermerUrgence } = useUrgence();
  const [etape, setEtape] = useState('choix');
  const closeRef = useRef(null);

  useEffect(() => {
    if (!ouvert) return undefined;
    setEtape('choix');
    closeRef.current?.focus();
    document.body.classList.add('no-scroll');
    // Ferme la fenêtre avec la touche Échap.
    const onKey = (event) => event.key === 'Escape' && fermerUrgence();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [ouvert, fermerUrgence]);

  if (!ouvert) return null;

  // Affiche le numéro du professionnel et prévient discrètement l'équipe.
  function choisirInconnu() {
    setEtape('inconnu');
    api('/urgence/demandes', { method: 'POST', body: { type: 'inconnu' } }).catch(() => {});
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && fermerUrgence()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="urgence-titre">
        <button ref={closeRef} type="button" className="sheet-close icon-btn" aria-label="Fermer" onClick={fermerUrgence}>
          <Icon name="x" size={20} />
        </button>

        {etape !== 'choix' && etape !== 'envoye' && (
          <button type="button" className="back-link" onClick={() => setEtape('choix')}>
            <Icon name="arrowLeft" size={16} />
            Retour
          </button>
        )}

        {etape === 'choix' && (
          <>
            <div className="sheet-icon sheet-icon--coral">
              <Icon name="lifebuoy" size={26} />
            </div>
            <h2 id="urgence-titre">Tu veux parler à quelqu’un ?</h2>
            <p className="muted">Tu n’es pas seul·e. Choisis avec qui tu te sens le plus à l’aise.</p>
            <div className="urgence-choix">
              <button type="button" className="urgence-option" onClick={() => setEtape('proche')}>
                <span className="tile-icon tile-icon--sage">
                  <Icon name="users" size={22} />
                </span>
                <span>
                  <strong>Quelqu’un que je connais</strong>
                  <span>On l’appelle pour vous mettre en contact, avec douceur.</span>
                </span>
                <Icon name="chevronRight" size={18} />
              </button>
              <button type="button" className="urgence-option" onClick={choisirInconnu}>
                <span className="tile-icon tile-icon--violet">
                  <Icon name="ear" size={22} />
                </span>
                <span>
                  <strong>Quelqu’un que je ne connais pas</strong>
                  <span>Un·e professionnel·le t’écoute, sans jugement.</span>
                </span>
                <Icon name="chevronRight" size={18} />
              </button>
            </div>
          </>
        )}

        {etape === 'proche' && <ProcheForm onSent={() => setEtape('envoye')} />}

        {etape === 'envoye' && (
          <div className="urgence-ok">
            <div className="sheet-icon sheet-icon--sage">
              <Icon name="checkCircle" size={26} />
            </div>
            <h2 id="urgence-titre">C’est noté, merci</h2>
            <p className="muted">
              Quelqu’un de notre équipe va contacter cette personne très vite pour qu’elle puisse être là pour toi. Respire, tu as bien fait de demander.
            </p>
            <button type="button" className="btn btn-ghost" onClick={choisirInconnu}>
              <Icon name="phone" size={16} />
              Parler à un·e pro en attendant
            </button>
          </div>
        )}

        {etape === 'inconnu' && (
          <>
            <h2 id="urgence-titre">Parle à un·e professionnel·le</h2>
            <p className="muted">{PRO_URGENCE.description}</p>
            <div className="pro-card">
              <span className="tile-icon tile-icon--violet">
                <Icon name="phone" size={22} />
              </span>
              <div>
                <strong>{PRO_URGENCE.nom}</strong>
                {PRO_URGENCE.horaires && <span className="muted small">{PRO_URGENCE.horaires}</span>}
                {PRO_URGENCE.telephone ? (
                  <a className="btn btn-primary" href={`tel:${PRO_URGENCE.telephone.replace(/\s/g, '')}`}>
                    <Icon name="phone" size={16} />
                    Appeler le {PRO_URGENCE.telephone}
                  </a>
                ) : (
                  <span className="pro-numero">Numéro bientôt disponible</span>
                )}
              </div>
            </div>
            <p className="muted small">
              Tu préfères écrire ? <Link to="/questions" onClick={fermerUrgence}>Pose une question confidentielle</Link>.
            </p>
          </>
        )}

        <p className="danger-note">
          <Icon name="alert" size={18} />
          Si ta vie ou celle de quelqu’un est en danger, appelle immédiatement les secours (police : 117, pompiers : 118).
        </p>
      </div>
    </div>
  );
}

// Formulaire de mise en relation : coordonnées de la personne de confiance que l'équipe va contacter.
function ProcheForm({ onSent }) {
  const [valeurs, setValeurs] = useState(VIDE);
  const [etat, setEtat] = useState({ envoi: false, erreur: null });

  // Met à jour un champ du formulaire.
  function maj(champ) {
    return (event) => {
      const valeur = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setValeurs((v) => ({ ...v, [champ]: valeur }));
    };
  }

  // Envoie la demande de mise en relation à l'API.
  async function envoyer(event) {
    event.preventDefault();
    setEtat({ envoi: true, erreur: null });
    try {
      await api('/urgence/demandes', { method: 'POST', body: { type: 'proche', ...valeurs } });
      onSent();
    } catch (error) {
      setEtat({ envoi: false, erreur: error });
    }
  }

  const pret = valeurs.procheNom.trim() && valeurs.procheTelephone.trim().length >= 8 && valeurs.consentement;

  return (
    <form onSubmit={envoyer} noValidate>
      <h2 id="urgence-titre">Qui veux-tu qu’on appelle ?</h2>
      <p className="muted">On contacte cette personne avec tact pour qu’elle vienne vers toi.</p>

      <div className="field-row">
        <label className="field">
          <span>Son prénom</span>
          <input type="text" value={valeurs.procheNom} onChange={maj('procheNom')} maxLength={80} autoComplete="off" required />
        </label>
        <label className="field">
          <span>Qui est-ce ?</span>
          <select value={valeurs.procheLien} onChange={maj('procheLien')}>
            <option value="">—</option>
            {LIENS_PROCHE.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Son numéro de téléphone</span>
        <input type="tel" inputMode="tel" value={valeurs.procheTelephone} onChange={maj('procheTelephone')} maxLength={20} placeholder="+228 90 00 00 00" autoComplete="off" required />
      </label>
      <label className="field">
        <span>Ton prénom (pour qu’elle sache que c’est toi)</span>
        <input type="text" value={valeurs.prenom} onChange={maj('prenom')} maxLength={40} autoComplete="off" />
      </label>
      <label className="field">
        <span>Un mot à lui transmettre ? (facultatif)</span>
        <textarea value={valeurs.message} onChange={maj('message')} rows={2} maxLength={600} />
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={valeurs.consentement} onChange={maj('consentement')} />
        <span>
          J’accepte que l’équipe DHIKI contacte cette personne. <Link to="/confidentialite#urgence">En savoir plus</Link>
        </span>
      </label>

      {etat.erreur && <FormError error={etat.erreur} />}

      <button type="submit" className="btn btn-primary btn-block" disabled={!pret || etat.envoi}>
        <Icon name="send" size={16} />
        {etat.envoi ? 'Envoi…' : 'Envoyer la demande'}
      </button>
    </form>
  );
}
