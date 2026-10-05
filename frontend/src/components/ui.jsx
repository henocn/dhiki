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

// Signature d'un article : psychologue bénévole auteur·rice, ou l'équipe DHIKI par défaut.
export function Auteur({ auteur }) {
  const initiales = auteur?.nom
    ? auteur.nom
        .split(/\s+/)
        .map((m) => m[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null;
  return (
    <div className="auteur">
      <span className="auteur-avatar" aria-hidden="true">
        {initiales ?? <Icon name="shieldCheck" size={14} />}
      </span>
      <span className="auteur-text">
        <strong>{auteur?.nom ?? 'Équipe DHIKI'}</strong>
        <span>{auteur?.titre ?? 'Relu par des professionnel·les'}</span>
      </span>
    </div>
  );
}

// Carte d'article : titre, description, auteur·rice, durée de lecture et nombre de lectures (si disponible).
export function ArticleCard({ article }) {
  const { t } = useLang();
  return (
    <Link to={`/articles/${article.slug}`} className="article-card">
      <h3>{article.titre}</h3>
      {article.description && <p className="article-card-desc">{article.description}</p>}
      <div className="article-card-foot">
        <Auteur auteur={article.auteur} />
        <span className="article-card-meta">
          {article.dureeLectureMin && (
            <span>
              <Icon name="clock" size={13} />
              {t('commun.minutes', { n: article.dureeLectureMin })}
            </span>
          )}
          {article.nbLectures > 0 && (
            <span>
              <Icon name="eye" size={13} />
              {article.nbLectures}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}

// Carte de rubrique cliquable (accueil, liste, suggestions).
export function RubriqueCard({ rubrique }) {
  const { t } = useLang();
  return (
    <Link to={`/rubriques/${rubrique.slug}`} className="rub-card">
      <div className="rub-card-media" style={{ background: rubrique.couleurFond }}>
        {rubrique.imageUrl ? <img src={rubrique.imageUrl} alt="" loading="lazy" /> : <RubriqueIcon rubrique={rubrique} />}
      </div>
      <div className="rub-card-body">
        <h3>{rubrique.nom}</h3>
        {rubrique.accroche && <p className="rub-card-accroche">{rubrique.accroche}</p>}
        <p className="rub-card-meta">
          {t('rubrique.compteArticles', { n: rubrique.nbArticles })} · {t('rubrique.compteExercices', { n: rubrique.nbExercices })}
        </p>
      </div>
    </Link>
  );
}
