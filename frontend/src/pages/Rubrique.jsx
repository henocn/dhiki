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

const blocSection = 'pt-[clamp(32px,5vw,48px)] scroll-mt-[calc(var(--header-h)+12px)]';
const ombreCarte = 'shadow-[0_1px_2px_rgba(44,26,18,0.04),0_8px_24px_rgba(44,26,18,0.06)]';
const action =
  'inline-flex items-center gap-[7px] min-h-[46px] px-3.5 py-[9px] border-[1.5px] rounded-full font-semibold text-[0.9rem] whitespace-nowrap transition-[background,border-color,color,translate] duration-200 hover:border-tc hover:-translate-y-px max-[480px]:justify-center max-[480px]:px-3 max-[480px]:py-2.5 max-[480px]:last:col-span-full';
const actionInactive = 'bg-white border-bd text-coal [&>svg]:text-tc';
const actionActive = 'bg-tc border-tc text-white [&>svg]:text-white';

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
      <section className="pt-[clamp(20px,4vw,48px)] pb-[clamp(32px,5vw,56px)] bg-[linear-gradient(to_bottom,var(--sand),var(--cr))]">
        <div className="container grid gap-7 items-center min-[900px]:grid-cols-[1.12fr_1fr] min-[900px]:gap-14 max-[900px]:flex max-[900px]:flex-col-reverse max-[900px]:items-stretch">
          <div>
            <h1 className="mb-3 font-semibold text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-coal">
              {rubrique.nom}
            </h1>
            {rubrique.accroche && (
              <p className="mb-[18px] font-title italic font-medium text-[clamp(1.2rem,2.2vw,1.5rem)] leading-[1.35] text-tc">
                {rubrique.accroche}
              </p>
            )}
            <p className="max-w-[54ch] mb-7 text-[clamp(1rem,1.5vw,1.08rem)] leading-[1.75] text-ts">{rubrique.introduction}</p>
            <div className="flex flex-wrap gap-2 max-[480px]:grid max-[480px]:grid-cols-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`${action} ${section === s.id ? actionActive : actionInactive}`}
                  aria-pressed={section === s.id}
                  onClick={() => choisirSection(s.id)}
                >
                  <Icon name={s.icone} size={18} />
                  {s.libelle}
                  <span
                    className={`min-w-6 px-[7px] rounded-full text-[0.76rem] leading-[22px] text-center ${
                      section === s.id ? 'bg-[rgba(255,255,255,0.25)] text-white' : 'bg-cr text-ts'
                    }`}
                  >
                    {rubrique[s.champ].length}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <figure
            className="relative flex items-center justify-center m-0 aspect-[4/3] overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(44,26,18,0.16)] min-[900px]:aspect-auto min-[900px]:h-full min-[900px]:min-h-[380px] max-[900px]:aspect-[16/10] max-[900px]:rounded-[22px]"
            style={{ background: rubrique.couleurFond }}
          >
            {rubrique.imageUrl ? (
              <img src={rubrique.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <RubriqueIcon rubrique={rubrique} size="lg" />
            )}
          </figure>
        </div>
      </section>

      <div className="container pb-6">
        <section id="rd-contenu" className={blocSection} aria-label={section === 'comprendre' ? 'Comprendre' : 'S’exercer'}>
          {section === 'comprendre' && (
            <div className="article-grid">
              {rubrique.articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}

          {section === 'exercices' && (
            <ul className="grid gap-3.5 min-[760px]:grid-cols-2">
              {rubrique.exercices.map((e) => (
                <li key={e.slug}>
                  <Link
                    to={`/exercices/${e.slug}`}
                    className={`flex items-center gap-3.5 h-full p-[18px] bg-white rounded-[18px] ${ombreCarte} transition-[translate,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(44,26,18,0.05),0_16px_36px_rgba(44,26,18,0.1)]`}
                  >
                    <span className={`tile-icon tile-icon--${COULEUR_PAR_TYPE[e.type] ?? 'sage'} tile-icon--sm`}>
                      <Icon name={ICONE_PAR_TYPE[e.type] ?? 'sparkles'} size={20} />
                    </span>
                    <span className="flex flex-1 flex-col min-w-0">
                      <span className="font-semibold text-[0.94rem]">{e.titre}</span>
                      <span className="text-[0.78rem] text-ts line-clamp-2">{e.description}</span>
                    </span>
                    <span className="inline-flex items-center justify-center w-[38px] h-[38px] shrink-0 rounded-full bg-tc text-white">
                      <Icon name="play" size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="temoignages" className={blocSection} aria-labelledby="titre-temoignages">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 mb-5">
            <h2 id="titre-temoignages" className="font-semibold text-[clamp(1.5rem,3vw,2rem)]">
              Ils et elles en parlent
            </h2>
            <button type="button" className="btn btn-primary max-[480px]:w-full" onClick={() => setTemoOuvert(true)}>
              <Icon name="pen" size={16} />
              Partager mon témoignage
            </button>
          </div>
          {rubrique.temoignages.length === 0 ? (
            <p className="muted">Pas encore de témoignage pour ce thème. Tu peux être le ou la premier·ère.</p>
          ) : (
            <ul className="grid gap-3.5 mb-5 min-[760px]:grid-cols-2">
              {rubrique.temoignages.map((tm, i) => (
                <li key={i} className={`relative h-full p-[18px] bg-white rounded-[18px] ${ombreCarte}`}>
                  <Icon name="quote" size={22} className="text-tcl mb-1.5" />
                  <blockquote className="italic mb-2">{tm.citation}</blockquote>
                  <span className="text-[0.82rem] font-semibold text-ts">— {tm.auteurLibelle}</span>
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
