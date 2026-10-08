import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import Icon from './Icon.jsx';

const VIDE = { citation: '', prenom: '', age: '', consentement: false };

const titre = 'mb-7 pr-10 font-semibold text-[1.7rem]';
const etiquette = 'text-ts font-medium text-[0.78rem] tracking-[0.06em] uppercase';
const saisie = 'border border-bd rounded-none focus:border-tc';

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
      <div
        className="sheet max-w-[540px] pt-9 px-9 pb-[30px] rounded-none shadow-[0_30px_80px_rgba(44,26,18,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="temo-titre"
      >
        <button
          type="button"
          className="sheet-close icon-btn top-[18px] right-[18px] rounded-none bg-transparent"
          aria-label="Fermer"
          onClick={onFermer}
        >
          <Icon name="x" size={20} />
        </button>

        {etat.envoye ? (
          <div className="flex flex-col items-center gap-2.5 pt-3 pb-1 text-center">
            <Icon name="checkCircle" size={36} className="text-sage" />
            <h2 id="temo-titre" className={titre}>
              Merci pour ton témoignage
            </h2>
            <p className="muted">Il sera relu par notre équipe avant d’être publié, pour protéger ton anonymat.</p>
            <button type="button" className="btn btn-primary mt-2" onClick={onFermer}>
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={envoyer} noValidate>
            <p className="mb-1 text-tc font-medium text-[0.8rem] tracking-[0.08em] uppercase">{rubriqueNom}</p>
            <h2 id="temo-titre" className={titre}>
              Ton témoignage
            </h2>

            <div className="grid grid-cols-[1fr_90px] gap-6">
              <label className="field">
                <span className={etiquette}>Pseudo</span>
                <input
                  ref={premierChamp}
                  type="text"
                  value={valeurs.prenom}
                  onChange={maj('prenom')}
                  maxLength={40}
                  placeholder="Ex. : Ama"
                  className={saisie}
                />
              </label>
              <label className="field">
                <span className={etiquette}>Âge</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={12}
                  max={99}
                  value={valeurs.age}
                  onChange={maj('age')}
                  className={saisie}
                />
              </label>
            </div>

            <label className="field">
              <span className={etiquette}>Ce que tu as vécu</span>
              <textarea
                value={valeurs.citation}
                onChange={maj('citation')}
                rows={6}
                maxLength={1200}
                required
                placeholder="Et ce qui t’a aidé…"
                className={`${saisie} min-h-[130px]`}
              />
              <span className="field-hint">{`${longueur} / 1200`}</span>
            </label>

            <label className="checkbox">
              <input type="checkbox" checked={valeurs.consentement} onChange={maj('consentement')} className="rounded-none" />
              <span>
                J’accepte une publication anonyme, après relecture.
              </span>
            </label>

            {etat.erreur && <FormError error={etat.erreur} />}

            <div className="form-actions mt-[22px] pt-5 border-t border-bdl">
              <button type="button" className="btn btn-ghost rounded-none border-transparent bg-transparent" onClick={onFermer}>
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary rounded-none"
                disabled={etat.envoi || longueur < 20 || !valeurs.consentement}
              >
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
