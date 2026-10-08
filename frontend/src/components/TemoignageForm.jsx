import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { api } from '../lib/api.js';
import Icon from './Icon.jsx';

const VIDE = { citation: '', prenom: '', age: '', consentement: false };

// Fenêtre de dépôt d'un témoignage (pseudo, âge, texte) : relu par l'équipe avant publication, consentement obligatoire.
export default function TemoignageModal({ ouvert, onFermer, rubriqueSlug, rubriqueNom }) {
  const [valeurs, setValeurs] = useState(VIDE);
  const [etat, setEtat] = useState({ envoi: false, erreur: null, envoye: false });
  const premierChamp = useRef(null);

  useEffect(() => {
    if (!ouvert) return undefined;
    setEtat({ envoi: false, erreur: null, envoye: false });
    premierChamp.current?.focus();
    document.body.classList.add('no-scroll');
    // Ferme la fenêtre avec la touche Échap.
    const onKey = (event) => event.key === 'Escape' && onFermer();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [ouvert, onFermer]);

  if (!ouvert) return null;

  // Met à jour un champ du formulaire.
  function maj(champ) {
    return (event) => {
      const valeur = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setValeurs((v) => ({ ...v, [champ]: valeur }));
    };
  }

  // Envoie le témoignage à l'API.
  async function envoyer(event) {
    event.preventDefault();
    setEtat({ envoi: true, erreur: null, envoye: false });
    try {
      await api('/temoignages', {
        method: 'POST',
        body: {
          rubrique: rubriqueSlug,
          citation: valeurs.citation,
          prenom: valeurs.prenom || undefined,
          age: valeurs.age ? Number(valeurs.age) : undefined,
          consentement: valeurs.consentement,
        },
      });
      setValeurs(VIDE);
      setEtat({ envoi: false, erreur: null, envoye: true });
    } catch (error) {
      setEtat({ envoi: false, erreur: error, envoye: false });
    }
  }

  const longueur = valeurs.citation.trim().length;
  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onFermer()}>
      <div className="sheet temo-modal" role="dialog" aria-modal="true" aria-labelledby="temo-titre">
        <button type="button" className="sheet-close icon-btn" aria-label="Fermer" onClick={onFermer}>
          <Icon name="x" size={20} />
        </button>

        {etat.envoye ? (
          <div className="temo-merci">
            <Icon name="checkCircle" size={36} />
            <h2 id="temo-titre">Merci pour ton témoignage</h2>
            <p className="muted">Il sera relu par notre équipe avant d’être publié, pour protéger ton anonymat.</p>
            <button type="button" className="btn btn-primary" onClick={onFermer}>
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={envoyer} noValidate>
            <h2 id="temo-titre">{`Témoigner sur « ${rubriqueNom} »`}</h2>
            <p className="muted temo-intro">Aucun nom de famille, numéro ou adresse : ton témoignage est relu avant publication.</p>

            <div className="field-row temo-ligne">
              <label className="field">
                <span>Pseudo (facultatif)</span>
                <input
                  ref={premierChamp}
                  type="text"
                  value={valeurs.prenom}
                  onChange={maj('prenom')}
                  maxLength={40}
                  placeholder="Ex. : Ama"
                />
              </label>
              <label className="field field--sm">
                <span>Âge</span>
                <input type="number" inputMode="numeric" min={12} max={99} value={valeurs.age} onChange={maj('age')} />
              </label>
            </div>

            <label className="field">
              <span>Ton témoignage</span>
              <textarea
                value={valeurs.citation}
                onChange={maj('citation')}
                rows={6}
                maxLength={1200}
                required
                placeholder="Raconte ce que tu as vécu et ce qui t’a aidé…"
              />
              <span className="field-hint">{`${longueur} / ${1200} caractères`}</span>
            </label>

            <label className="checkbox">
              <input type="checkbox" checked={valeurs.consentement} onChange={maj('consentement')} />
              <span>
                J’accepte que ce témoignage soit publié anonymement sur DHIKI après relecture.{' '}
                <Link to="/confidentialite#temoignages" onClick={onFermer}>
                  En savoir plus
                </Link>
              </span>
            </label>

            {etat.erreur && <FormError error={etat.erreur} />}

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={onFermer}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={etat.envoi || longueur < 20 || !valeurs.consentement}>
                <Icon name="send" size={16} />
                {etat.envoi ? 'Envoi…' : 'Envoyer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Affiche une erreur d'API sous un formulaire (détails de validation si disponibles).
export function FormError({ error }) {
  const message =
    error.code === 'NETWORK_ERROR'
      ? 'Impossible de joindre le serveur. Vérifie ta connexion puis réessaie.'
      : error.code === 'TOO_MANY_REQUESTS'
        ? 'Trop d’envois en peu de temps. Patiente quelques minutes avant de réessayer.'
        : error.details?.[0]?.message ?? error.message;
  return (
    <p className="form-error" role="alert">
      <Icon name="alert" size={16} />
      {message}
    </p>
  );
}
