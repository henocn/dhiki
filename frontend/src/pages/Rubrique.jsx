import { Link, useParams, useSearchParams } from 'react-router';
import Icon from '../components/Icon.jsx';
import TemoignageForm from '../components/TemoignageForm.jsx';
import { ArticleCard, BackLink, ErrorState, Loader, RubriqueIcon } from '../components/ui.jsx';
import { COULEUR_PAR_TYPE, ICONE_PAR_TYPE } from '../exercices/types.js';
import { useLang } from '../i18n/LangContext.jsx';
import { useApi } from '../lib/api.js';

const ONGLETS = [
  { id: 'comprendre', icone: 'book', champ: 'articles' },
  { id: 'exercices', icone: 'wind', champ: 'exercices' },
  { id: 'temoignages', icone: 'quote', champ: 'temoignages' },
];

// Détail d'une rubrique : onglets Comprendre / Exercices / Témoignages, l'onglet actif est conservé dans l'URL.
export default function Rubrique() {
  const { slug } = useParams();
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const onglet = ONGLETS.some((o) => o.id === params.get('onglet')) ? params.get('onglet') : 'comprendre';
  const { data: rubrique, error, loading, reload } = useApi(`/rubriques/${encodeURIComponent(slug)}`);

  // Change d'onglet sans ajouter d'entrée dans l'historique.
  function changerOnglet(id) {
    setParams(id === 'comprendre' ? {} : { onglet: id }, { replace: true });
  }

  return (
    <div className="container page">
      <BackLink fallback="/rubriques" label={t('rubrique.retourRubriques')} />
      {loading && <Loader />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {rubrique && (
        <>
          <section className="rub-hero">
            <RubriqueIcon rubrique={rubrique} size="lg" />
            <div>
              <h1>{rubrique.nom}</h1>
              {rubrique.accroche && <p className="rub-hero-accroche">{rubrique.accroche}</p>}
              <p>{rubrique.introduction}</p>
            </div>
          </section>

          <div className="tabs" role="tablist">
            {ONGLETS.map((o) => (
              <button
                key={o.id}
                type="button"
                role="tab"
                id={`tab-${o.id}`}
                aria-selected={onglet === o.id}
                aria-controls={`panel-${o.id}`}
                className={`tab ${onglet === o.id ? 'is-active' : ''}`}
                onClick={() => changerOnglet(o.id)}
              >
                <Icon name={o.icone} size={16} />
                {t(`rubrique.onglet.${o.id}`)}
                <span className="tab-count">{rubrique[o.champ].length}</span>
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`panel-${onglet}`} aria-labelledby={`tab-${onglet}`}>
            {onglet === 'comprendre' && (
              <div className="article-grid">
                {rubrique.articles.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}

            {onglet === 'exercices' && (
              <ul className="list">
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

            {onglet === 'temoignages' && (
              <>
                <TemoignageForm rubriqueSlug={rubrique.slug} rubriqueNom={rubrique.nom} />
                {rubrique.temoignages.length === 0 && <p className="muted">{t('rubrique.aucunTemoignage')}</p>}
                <ul className="list">
                  {rubrique.temoignages.map((tm, i) => (
                    <li key={i} className="temo-card">
                      <Icon name="quote" size={22} className="temo-quote" />
                      <blockquote>{tm.citation}</blockquote>
                      <span className="temo-who">— {tm.auteurLibelle}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
