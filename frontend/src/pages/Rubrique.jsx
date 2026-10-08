import { useCallback, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import Icon from '../components/Icon.jsx';
import TemoignageModal from '../components/TemoignageForm.jsx';
import { ArticleCard, BackLink, ErrorState, Loader, RubriqueIcon } from '../components/ui.jsx';
import { COULEUR_PAR_TYPE, ICONE_PAR_TYPE } from '../exercices/types.js';
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
  const [params, setParams] = useSearchParams();
  const section = params.get('onglet') === 'exercices' ? 'exercices' : 'comprendre';
  const { data: rubrique, error, loading, reload } = useApi(`/rubriques/${encodeURIComponent(slug)}`);
  const [temoOuvert, setTemoOuvert] = useState(false);
  const fermerTemo = useCallback(() => setTemoOuvert(false), []);

  // Affiche la section choisie et la fait apparaître à l'écran.
  function choisirSection(id) {
    setParams(id === 'comprendre' ? {} : { onglet: id }, { replace: true });
    setTimeout(() => defilerVers('rd-contenu'), 30);
  }

  if (!rubrique) {
    return (
      <div className="container page">
        <BackLink fallback="/rubriques" label="Toutes les rubriques" />
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
          <div className="rd-temo-head">
            <h2 id="titre-temoignages">Ils et elles en parlent</h2>
            <button type="button" className="btn btn-primary" onClick={() => setTemoOuvert(true)}>
              <Icon name="pen" size={16} />
              Partager mon témoignage
            </button>
          </div>
          {rubrique.temoignages.length === 0 ? (
            <p className="muted">Pas encore de témoignage pour ce thème. Tu peux être le ou la premier·ère.</p>
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
        </section>
      </div>

      <TemoignageModal
        ouvert={temoOuvert}
        onFermer={fermerTemo}
        rubriqueSlug={rubrique.slug}
        rubriqueNom={rubrique.nom}
      />
    </>
  );
}
