import { useState } from 'react';
import { Link } from 'react-router';
import { useLang } from '../i18n/LangContext.jsx';
import { api } from '../lib/api.js';
import Icon from './Icon.jsx';

const VIDE = { citation: '', prenom: '', age: '', ville: '', consentement: false };

// Formulaire de dépôt d'un témoignage : relu par l'équipe avant publication, consentement obligatoire.
export default function TemoignageForm({ rubriqueSlug, rubriqueNom }) {
  const { t } = useLang();
  const [ouvert, setOuvert] = useState(false);
  const [valeurs, setValeurs] = useState(VIDE);
  const [etat, setEtat] = useState({ envoi: false, erreur: null, envoye: false });

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
          ville: valeurs.ville || undefined,
          consentement: valeurs.consentement,
        },
      });
      setValeurs(VIDE);
      setEtat({ envoi: false, erreur: null, envoye: true });
    } catch (error) {
      setEtat({ envoi: false, erreur: error, envoye: false });
    }
  }

  if (etat.envoye) {
    return (
      <div className="confirm-box">
        <Icon name="checkCircle" size={32} />
        <h3>{t('temoignage.merciTitre')}</h3>
        <p>{t('temoignage.merciTexte')}</p>
        <button type="button" className="btn btn-ghost" onClick={() => setEtat({ envoi: false, erreur: null, envoye: false })}>
          {t('temoignage.autre')}
        </button>
      </div>
    );
  }

  if (!ouvert) {
    return (
      <div className="cta-box">
        <div>
          <strong>{t('temoignage.ctaTitre')}</strong>
          <span>{t('temoignage.ctaTexte')}</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setOuvert(true)}>
          <Icon name="pen" size={16} />
          {t('temoignage.partager')}
        </button>
      </div>
    );
  }

  const longueur = valeurs.citation.trim().length;
  return (
    <form className="form-card" onSubmit={envoyer} noValidate>
      <h3>{t('temoignage.formTitre', { rubrique: rubriqueNom })}</h3>
      <p className="muted">{t('temoignage.formIntro')}</p>

      <label className="field">
        <span>{t('temoignage.texte')}</span>
        <textarea
          value={valeurs.citation}
          onChange={maj('citation')}
          rows={5}
          maxLength={1200}
          required
          placeholder={t('temoignage.textePlaceholder')}
        />
        <span className="field-hint">{t('commun.caracteres', { n: longueur, max: 1200 })}</span>
      </label>

      <div className="field-row">
        <label className="field">
          <span>{t('temoignage.prenom')}</span>
          <input type="text" value={valeurs.prenom} onChange={maj('prenom')} maxLength={40} placeholder={t('temoignage.prenomPlaceholder')} />
        </label>
        <label className="field field--sm">
          <span>{t('temoignage.age')}</span>
          <input type="number" inputMode="numeric" min={12} max={99} value={valeurs.age} onChange={maj('age')} />
        </label>
        <label className="field">
          <span>{t('temoignage.ville')}</span>
          <input type="text" value={valeurs.ville} onChange={maj('ville')} maxLength={40} />
        </label>
      </div>

      <label className="checkbox">
        <input type="checkbox" checked={valeurs.consentement} onChange={maj('consentement')} />
        <span>
          {t('temoignage.consentement')}{' '}
          <Link to="/confidentialite#temoignages">{t('temoignage.enSavoirPlus')}</Link>
        </span>
      </label>

      {etat.erreur && <FormError error={etat.erreur} />}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setOuvert(false)}>
          {t('commun.annuler')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={etat.envoi || longueur < 20 || !valeurs.consentement}>
          <Icon name="send" size={16} />
          {etat.envoi ? t('commun.envoiEnCours') : t('commun.envoyer')}
        </button>
      </div>
    </form>
  );
}

// Affiche une erreur d'API sous un formulaire (détails de validation si disponibles).
export function FormError({ error }) {
  const { t } = useLang();
  const message =
    error.code === 'NETWORK_ERROR'
      ? t('erreur.reseau')
      : error.code === 'TOO_MANY_REQUESTS'
        ? t('erreur.tropDeRequetes')
        : error.details?.[0]?.message ?? error.message;
  return (
    <p className="form-error" role="alert">
      <Icon name="alert" size={16} />
      {message}
    </p>
  );
}
