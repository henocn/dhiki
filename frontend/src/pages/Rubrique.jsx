import { Link, useParams, useSearchParams } from 'react-router';
import Icon from '../components/Icon.jsx';
import TemoignageForm from '../components/TemoignageForm.jsx';
import { ArticleCard, BackLink, ErrorState, Loader, RubriqueIcon } from '../components/ui.jsx';
import { COULEUR_PAR_TYPE, ICONE_PAR_TYPE } from '../exercices/types.js';
import { useLang } from '../i18n/LangContext.jsx';
import { useApi } from '../lib/api.js';

const SECTIONS = [
  { id: 'comprendre', libelle: 'Comprendre', icone: 'book', champ: 'articles' },
  { id: 'exercices', libelle: 'S’exercer', icone: 'wind', champ: 'exercices' },
];

// Fait défiler en douceur jusqu'à un bloc de la page.
function defilerVers(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Détail d'une rubrique : présentation avec photo, contenu Comprendre / S'exercer (conservé dans l'URL), puis témoignages.
export default function Rubrique() {
  const { slug } = useParams();
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const section = params.get('onglet') === 'exercices' ? 'exercices' : 'comprendre';
  const { data: rubrique, error, loading, reload } = useApi(`/rubriques/${encodeURIComponent(slug)}`);

  // Affiche la section choisie et la fait apparaître à l'écran.
  function choisirSection(id) {
    setParams(id === 'comprendre' ? {} : { onglet: id }, { replace: true });
    setTimeout(() => defilerVers('rd-contenu'), 30);
  }

  if (!rubrique) {
    return (
      <div className="container page">
        <BackLink fallback="/rubriques" label={t('rubrique.retourRubriques')} />
        {loading && <Loader />}
        {error && <ErrorState error={error} onRetry={reload} />}
      </div>
    );
  }

  return (
    <>
      <section className="rd-hero">
        <div className="container rd-hero-grid">
          <div className="rd-hero-text">
            <h1>{rubrique.nom}</h1>
            {rubrique.accroche && <p className="rd-accroche">{rubrique.accroche}</p>}
            <p className="rd-intro-texte">{rubrique.introduction}</p>
            <div className="rd-actions">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`rd-action ${section === s.id ? 'is-active' : ''}`}
                  aria-pressed={section === s.id}
                  onClick={() => choisirSection(s.id)}
                >
                  <Icon name={s.icone} size={18} />
                  {s.libelle}
                  <span className="rd-action-n">{rubrique[s.champ].length}</span>
                </button>
              ))}
              <button type="button" className="rd-action" onClick={() => defilerVers('temoignages')}>
                <Icon name="quote" size={18} />
                Témoignages
                <span className="rd-action-n">{rubrique.temoignages.length}</span>
              </button>
            </div>
          </div>
          <figure className="rd-photo" style={{ background: rubrique.couleurFond }}>
            {rubrique.imageUrl ? (
              <img src={rubrique.imageUrl} alt="" />
            ) : (
              <RubriqueIcon rubrique={rubrique} size="lg" />
            )}
          </figure>
        </div>
      </section>

      <div className="container rd-body">
        <section id="rd-contenu" className="rd-section" aria-label={section === 'comprendre' ? 'Comprendre' : 'S’exercer'}>
          {section === 'comprendre' && (
            <div className="article-grid">
              {rubrique.articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}

          {section === 'exercices' && (
            <ul className="rd-exos">
              {rubrique.exercices.map((e) => (
                <li key={e.slug}>
                  <Link to={`/exercices/${e.slug}`} className="res-item exo-item">
                    <span className={`tile-icon tile-icon--${COULEUR_PAR_TYPE[e.type] ?? 'sage'} tile-icon--sm`}>
                      <Icon name={ICONE_PAR_TYPE[e.type] ?? 'sparkles'} size={20} />
                    </span>
                    <span className="res-info">
                      <span className="res-title">{e.titre}</span>
                      <span className="res-meta">{e.description}</span>
                    </span>
                    <span className="exo-go">
                      <Icon name="play" size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="temoignages" className="rd-section rd-temoignages" aria-labelledby="titre-temoignages">
          <h2 id="titre-temoignages">Ils et elles en parlent</h2>
          {rubrique.temoignages.length === 0 ? (
            <p className="muted">{t('rubrique.aucunTemoignage')}</p>
          ) : (
            <ul className="rd-temo-grid">
              {rubrique.temoignages.map((tm, i) => (
                <li key={i} className="temo-card">
                  <Icon name="quote" size={22} className="temo-quote" />
                  <blockquote>{tm.citation}</blockquote>
                  <span className="temo-who">— {tm.auteurLibelle}</span>
                </li>
              ))}
            </ul>
          )}
          <TemoignageForm rubriqueSlug={rubrique.slug} rubriqueNom={rubrique.nom} />
        </section>

        <aside className="rd-soutien">
          <div>
            <h2>Tu n’es pas seul·e face à ça.</h2>
            <p>Pose ta question en toute confidentialité : un·e psychologue bénévole te répond.</p>
          </div>
          <Link to="/questions" className="btn btn-clair btn-lg">
            Poser une question
            <Icon name="arrowRight" size={18} />
          </Link>
        </aside>
      </div>
    </>
  );
}
