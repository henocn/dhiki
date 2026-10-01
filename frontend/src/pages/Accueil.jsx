import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { ErrorState, Loader, RubriqueCard } from '../components/ui.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { useApi } from '../lib/api.js';
import { useEcrits } from '../lib/ecrits.js';

const OUTILS_RAPIDES = [
  { to: '/exercices/respiration-4-7-8', icone: 'wind', titre: 'Respirer', duree: '2 min', couleur: 'sage' },
  { to: '/exercices/ancrage-5', icone: 'anchor', titre: 'Revenir au présent', duree: '3 min', couleur: 'tc' },
  { to: '/exercices/journal-emotions', icone: 'pen', titre: 'Écrire ce que je ressens', duree: '5 min', couleur: 'violet' },
];

// Page d'accueil : deux actions principales, outils immédiats, puis tous les thèmes.
export default function Accueil() {
  const { t } = useLang();
  const rubriques = useApi('/rubriques');
  const ecrits = useEcrits();

  return (
    <div className="container">
      <section className="hero">
        <h1>{t('home.titre')}</h1>
        <p>{t('home.sousTitre')}</p>
        <div className="hero-actions">
          <Link to="/faire-le-point" className="btn btn-primary btn-lg">
            <Icon name="pulse" size={20} />
            {t('home.ctaFlp')}
          </Link>
          <Link to="/questions" className="btn btn-secondary btn-lg">
            <Icon name="message" size={20} />
            {t('home.ctaQuestion')}
          </Link>
        </div>
        <ul className="trust-row">
          <li><Icon name="heart" size={16} />Gratuit</li>
          <li><Icon name="lock" size={16} />Anonyme</li>
          <li><Icon name="shieldCheck" size={16} />Relu par des pros</li>
        </ul>
      </section>

      <section aria-labelledby="titre-outils">
        <h2 id="titre-outils" className="sec-title">{t('home.outils')}</h2>
        <div className="tools">
          {OUTILS_RAPIDES.map((o) => (
            <Link key={o.to} to={o.to} className="tool">
              <span className={`tile-icon tile-icon--${o.couleur}`}>
                <Icon name={o.icone} size={22} />
              </span>
              <span className="tool-text">
                <strong>{o.titre}</strong>
                <span>{o.duree}</span>
              </span>
              <Icon name="play" size={18} className="tool-play" />
            </Link>
          ))}
        </div>
      </section>

      {ecrits.length > 0 && (
        <Link to="/mes-ecrits" className="row-card">
          <span className="tile-icon tile-icon--violet tile-icon--sm">
            <Icon name="book" size={20} />
          </span>
          <span className="row-card-text">
            <strong>{t('nav.ecrits')}</strong>
            <span>{t('home.ecritsCompte', { n: ecrits.length })}</span>
          </span>
          <Icon name="chevronRight" size={18} />
        </Link>
      )}

      <section aria-labelledby="titre-themes">
        <h2 id="titre-themes" className="sec-title">{t('home.themes')}</h2>
        {rubriques.loading && <Loader />}
        {rubriques.error && <ErrorState error={rubriques.error} onRetry={rubriques.reload} />}
        {rubriques.data && (
          <div className="rub-grid">
            {rubriques.data.map((r) => (
              <RubriqueCard key={r.slug} rubrique={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
