import { Link, useNavigate } from 'react-router';
import Icon from './Icon.jsx';

// Lien « retour » : revient à la page précédente si elle existe dans le site, sinon vers fallback.
export function BackLink({ fallback = '/', label }) {
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
      {label ?? 'Retour'}
    </a>
  );
}

// Indicateur de chargement accessible.
export function Loader() {
  return (
    <div className="state-box" role="status">
      <span className="spinner" aria-hidden="true" />
      Chargement…
    </div>
  );
}

// Message d'erreur avec bouton « Réessayer » ; affiche une page introuvable pour les 404.
export function ErrorState({ error, onRetry }) {
  if (error?.status === 404) {
    return (
      <div className="state-box">
        <Icon name="info" size={28} />
        <p>Ce contenu est introuvable.</p>
        <Link to="/" className="btn btn-primary">
          Retour à l’accueil
        </Link>
      </div>
    );
  }
  return (
    <div className="state-box" role="alert">
      <Icon name="alert" size={28} />
      <p>{error?.code === 'NETWORK_ERROR' ? 'Impossible de joindre le serveur. Vérifie ta connexion puis réessaie.' : 'Une erreur est survenue. Réessaie dans un instant.'}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          <Icon name="refresh" size={16} />
          Réessayer
        </button>
      )}
    </div>
  );
}

// Icône de rubrique fournie par l'API (SVG éditorial stocké en base).
export function RubriqueIcon({ rubrique, size = 'md', className = '' }) {
  const taille = size === 'lg' ? 'h-14 w-14' : 'h-[50px] w-[50px]';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[14px] ${taille} ${className}`}
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

// Carte d'article : seulement le titre et une courte description, les détails sont dans l'article.
export function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-bd px-0 py-[26px] [counter-increment:article] before:row-span-2 before:pt-0.5 before:font-title before:text-base before:font-medium before:text-tc before:content-[counter(article,decimal-leading-zero)]"
    >
      <h3 className="text-[1.22rem] leading-[1.3] font-semibold tracking-[-0.01em] text-coal underline decoration-transparent decoration-1 underline-offset-[5px] transition-[color,text-decoration-color] duration-200 ease-[ease] group-hover:text-tc group-hover:decoration-current">
        {article.titre}
      </h3>
      {article.description && <p className="line-clamp-2 text-[0.95rem] leading-[1.6] text-ts">{article.description}</p>}
    </Link>
  );
}

// Carte de rubrique cliquable (accueil, liste, suggestions).
export function RubriqueCard({ rubrique }) {
  return (
    <Link
      to={`/rubriques/${rubrique.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border-0 bg-white p-0 text-left shadow-[0_1px_2px_rgba(44,26,18,0.04),0_8px_24px_rgba(44,26,18,0.06)] transition-[box-shadow,translate] duration-[350ms] ease-[ease] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(44,26,18,0.05),0_18px_40px_rgba(44,26,18,0.12)]"
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(to_top,rgba(44,26,18,0.18),transparent_45%)] after:content-[''] max-[560px]:aspect-[16/10]"
        style={{ background: rubrique.couleurFond }}
      >
        {rubrique.imageUrl ? (
          <img
            src={rubrique.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover saturate-[0.88] contrast-[0.98] [transition:scale_0.8s_ease,filter_0.5s_ease] group-hover:scale-[1.04] group-hover:saturate-100 group-hover:contrast-100"
          />
        ) : (
          <RubriqueIcon rubrique={rubrique} className="border-0 bg-white/70!" />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-[22px] pt-5 pb-[18px]">
        <h3 className="m-0 text-[1.22rem] font-semibold tracking-[-0.01em] text-coal">{rubrique.nom}</h3>
        {rubrique.accroche && (
          <p className="flex-1 font-body text-[0.93rem] leading-[1.55] tracking-normal text-ts normal-case">{rubrique.accroche}</p>
        )}
      </div>
    </Link>
  );
}
