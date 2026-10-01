import { Link, useNavigate } from 'react-router';
import { useLang } from '../i18n/LangContext.jsx';
import Icon from './Icon.jsx';

// Lien « retour » : revient à la page précédente si elle existe dans le site, sinon vers fallback.
export function BackLink({ fallback = '/', label }) {
  const { t } = useLang();
  const navigate = useNavigate();
  // Revient en arrière dans l'historique ou vers la page de repli.
  function retour(event) {
    event.preventDefault();
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(fallback);
  }
  return (
    <a href={fallback} className="back-link" onClick={retour}>
      <Icon name="arrowLeft" size={16} />
      {label ?? t('commun.retour')}
    </a>
  );
}

// Indicateur de chargement accessible.
export function Loader() {
  const { t } = useLang();
  return (
    <div className="state-box" role="status">
      <span className="spinner" aria-hidden="true" />
      {t('commun.chargement')}
    </div>
  );
}

// Message d'erreur avec bouton « Réessayer » ; affiche une page introuvable pour les 404.
export function ErrorState({ error, onRetry }) {
  const { t } = useLang();
  if (error?.status === 404) {
    return (
      <div className="state-box">
        <Icon name="info" size={28} />
        <p>{t('erreur.introuvable')}</p>
        <Link to="/" className="btn btn-primary">
          {t('erreur.retourAccueil')}
        </Link>
      </div>
    );
  }
  return (
    <div className="state-box" role="alert">
      <Icon name="alert" size={28} />
      <p>{error?.code === 'NETWORK_ERROR' ? t('erreur.reseau') : t('erreur.generique')}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          <Icon name="refresh" size={16} />
          {t('commun.reessayer')}
        </button>
      )}
    </div>
  );
}

// Icône de rubrique fournie par l'API (SVG éditorial stocké en base).
export function RubriqueIcon({ rubrique, size = 'md' }) {
  return (
    <span
      className={`rub-icon rub-icon--${size}`}
      style={{ background: rubrique.couleurFond }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: rubrique.iconeSvg }}
    />
  );
}

// Carte de rubrique cliquable (accueil, liste, suggestions).
export function RubriqueCard({ rubrique }) {
  const { t } = useLang();
  return (
    <Link to={`/rubriques/${rubrique.slug}`} className="rub-card">
      <RubriqueIcon rubrique={rubrique} />
      <h3>{rubrique.nom}</h3>
      <p>
        {t('rubrique.compteArticles', { n: rubrique.nbArticles })} · {t('rubrique.compteExercices', { n: rubrique.nbExercices })}
      </p>
    </Link>
  );
}
