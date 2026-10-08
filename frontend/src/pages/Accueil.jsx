import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import Photo from '../components/Photo.jsx';
import { ErrorState, Loader, RubriqueCard } from '../components/ui.jsx';
import { useUrgence } from '../components/urgence/UrgenceContext.jsx';
import { MEDIAS } from '../content/medias.js';
import { useApi } from '../lib/api.js';
import { useEcrits } from '../lib/ecrits.js';

const OUTILS_RAPIDES = [
  { to: '/exercices/respiration-4-7-8', titre: 'Respirer pour faire redescendre la pression', duree: '2 min' },
  { to: '/exercices/ancrage-5', titre: 'Revenir au présent avec ses cinq sens', duree: '3 min' },
  { to: '/exercices/journal-emotions', titre: 'Mettre des mots sur ce que je ressens', duree: '5 min' },
];

const ETAPES = [
  {
    numero: '01',
    titre: 'Comprendre',
    texte: 'Des articles courts, écrits par des psychologues, pour mettre des mots sur ce que tu vis.',
    to: '/rubriques',
    lien: 'Lire les rubriques',
  },
  {
    numero: '02',
    titre: 'Agir',
    texte: 'Des exercices guidés de quelques minutes pour retrouver un peu de calme, quand tu en as besoin.',
    to: '/faire-le-point',
    lien: 'Faire le point',
  },
  {
    numero: '03',
    titre: 'En parler',
    texte: 'Pose ta question en toute confidentialité : un·e psychologue bénévole te répond.',
    to: '/questions',
    lien: 'Poser une question',
  },
];

const RUBRIQUES_A_LA_UNE = ['anxiete', 'confiance', 'relations'];

const espaceSection = 'py-[clamp(56px,8vw,96px)]';
const titreSection = 'font-semibold text-[clamp(1.7rem,3.6vw,2.5rem)] leading-[1.15] tracking-[-0.015em]';
const surTitre = 'text-[0.78rem] font-medium tracking-[0.12em] uppercase';
const grilleDeuxColonnes = 'grid items-center gap-10';
const boutonPleineLargeur = 'max-[480px]:w-full';

// Retourne les trois rubriques mises en avant, complétées par les premières si l'une manque.
function rubriquesALaUne(liste) {
  const choisies = RUBRIQUES_A_LA_UNE.map((slug) => liste.find((r) => r.slug === slug)).filter(Boolean);
  const reste = liste.filter((r) => !choisies.includes(r));
  return [...choisies, ...reste].slice(0, RUBRIQUES_A_LA_UNE.length);
}

// Page d'accueil éditoriale : promesse, aide immédiate, thèmes, accompagnement, équipe et appel final.
export default function Accueil() {
  const { ouvrirUrgence } = useUrgence();
  const rubriques = useApi('/rubriques');
  const ecrits = useEcrits();

  return (
    <>
      <section className="home-hero relative overflow-hidden pt-[300px] pb-[clamp(48px,7vw,88px)] min-[900px]:flex min-[900px]:min-h-[min(640px,calc(100vh_-_var(--header-h)))] min-[900px]:items-center min-[900px]:pt-[clamp(32px,6vw,72px)]">
        <Photo
          media={MEDIAS.accueilHero}
          className="absolute! inset-y-0 right-0 left-auto w-[min(72%,1100px)] rounded-none! [background:none]! [mask-image:linear-gradient(to_left,#000_35%,rgba(0,0,0,0.55)_60%,transparent_90%)] [&_img]:object-[70%_center] max-[900px]:bottom-auto max-[900px]:left-0 max-[900px]:h-[340px] max-[900px]:w-full max-[900px]:[mask-image:linear-gradient(to_bottom,#000_45%,transparent_100%)] max-[900px]:[&_img]:object-[center_30%]"
          eager
        />
        <div className={`container relative z-[1] ${grilleDeuxColonnes} min-[900px]:grid-cols-[minmax(0,540px)_1fr] min-[900px]:gap-16`}>
          <div>
            <h1 className="mb-5 text-[clamp(2.2rem,5.2vw,3.6rem)] leading-[1.08] font-semibold tracking-[-0.02em] text-coal">
              Un endroit pour parler de ce qui pèse, <em className="font-medium text-tc italic">sans être jugé·e.</em>
            </h1>
            <p className="mb-[30px] max-w-[50ch] text-[1.1rem] leading-[1.65] text-ts">
              Stress, sommeil, confiance, relations : DHIKI aide les jeunes à comprendre ce qu’ils ressentent et à
              trouver du soutien, gratuitement et en toute discrétion.
            </p>
            <div className="flex flex-wrap items-center justify-start gap-3">
              <Link to="/faire-le-point" className={`btn btn-primary btn-lg ${boutonPleineLargeur}`}>
                Faire le point
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link
                to="/questions"
                className={`btn btn-lg px-2 text-coal underline decoration-tcl decoration-2 underline-offset-[6px] hover:text-tc ${boutonPleineLargeur}`}
              >
                Poser une question
              </Link>
            </div>
            <p className="mt-[26px] flex items-center gap-2 text-[0.88rem] text-ts">
              <Icon name="lock" size={15} />
              Gratuit et anonyme.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-tc py-[clamp(36px,5vw,56px)] text-white" aria-labelledby="titre-maintenant">
        <div className="container grid items-center gap-6 min-[900px]:grid-cols-[1fr_1.4fr] min-[900px]:gap-16">
          <div>
            <h2 id="titre-maintenant" className="mb-2 text-[clamp(1.5rem,3vw,2rem)] font-semibold">
              Ça ne va pas, là, maintenant ?
            </h2>
            <p className="opacity-85">Choisis un exercice. Pas besoin de compte, ça commence tout de suite.</p>
          </div>
          <ul className="border-t border-white/30">
            {OUTILS_RAPIDES.map((o) => (
              <li key={o.to}>
                <Link
                  to={o.to}
                  className="flex items-center gap-4 border-b border-white/30 px-1 py-4 text-[1.02rem] font-medium transition-[padding] duration-[180ms] ease-[ease] hover:pl-3"
                >
                  <span className="flex-1">{o.titre}</span>
                  <span className="text-[0.82rem] opacity-80">{o.duree}</span>
                  <Icon name="arrowRight" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={espaceSection} aria-labelledby="titre-themes">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div>
              <p className={`mb-3 text-tc ${surTitre}`}>Rubriques</p>
              <h2 id="titre-themes" className={titreSection}>
                De quoi as-tu besoin de parler ?
              </h2>
            </div>
          </div>
          {rubriques.loading && <Loader />}
          {rubriques.error && <ErrorState error={rubriques.error} onRetry={rubriques.reload} />}
          {rubriques.data && (
            <>
              <div className="rub-grid">
                {rubriquesALaUne(rubriques.data).map((r) => (
                  <RubriqueCard key={r.slug} rubrique={r} />
                ))}
              </div>
              {rubriques.data.length > RUBRIQUES_A_LA_UNE.length && (
                <div className="mt-9 flex justify-center">
                  <Link to="/rubriques" className="btn btn-secondary">
                    Voir toutes les rubriques ({rubriques.data.length})
                    <Icon name="arrowRight" size={16} />
                  </Link>
                </div>
              )}
            </>
          )}
          {ecrits.length > 0 && (
            <Link
              to="/mes-ecrits"
              className="relative mt-[18px] mb-0 flex items-center gap-3.5 rounded-[var(--rad)] border-[1.5px] border-bdl bg-white px-[18px] py-3.5 transition-[translate,box-shadow] duration-[180ms] ease-[ease] hover:-translate-y-[3px] hover:shadow-[var(--shm)]"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#f0ebf8] text-[#6c58bd]">
                <Icon name="book" size={20} />
              </span>
              <span className="flex flex-1 flex-col">
                <strong>Mes écrits</strong>
                <span className="text-[0.82rem] text-ts">{(ecrits.length === 1 ? `${ecrits.length} écrit sur cet appareil` : `${ecrits.length} écrits sur cet appareil`)}</span>
              </span>
              <Icon name="chevronRight" size={18} />
            </Link>
          )}
        </div>
      </section>

      <section className={`${espaceSection} border-y border-bdl bg-sand`} aria-labelledby="titre-etapes">
        <div className={`container ${grilleDeuxColonnes} min-[900px]:grid-cols-[0.9fr_1.1fr] min-[900px]:gap-[72px]`}>
          <Photo media={MEDIAS.accueilEcoute} className="aspect-[4/5]" />
          <div>
            <p className={`mb-3 text-tc ${surTitre}`}>Comment DHIKI t’accompagne</p>
            <h2 id="titre-etapes" className={titreSection}>
              Trois façons d’avancer, à ton rythme.
            </h2>
            <ol className="mt-7">
              {ETAPES.map((e) => (
                <li key={e.numero} className="flex gap-[22px] border-t border-bd py-[22px] last:border-b">
                  <span className="font-title text-[1.1rem] font-semibold text-tc">{e.numero}</span>
                  <div>
                    <h3 className="mb-1.5 text-[1.25rem] font-semibold">{e.titre}</h3>
                    <p className="mb-2.5 text-ts">{e.texte}</p>
                    <Link to={e.to} className="inline-flex items-center gap-1.5 font-medium text-tc hover:gap-2.5 hover:text-tc-dark">
                      {e.lien}
                      <Icon name="arrowRight" size={15} />
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`${espaceSection} bg-coal text-[#f3e9dd]`} aria-labelledby="titre-equipe">
        <div className={`container ${grilleDeuxColonnes} min-[900px]:grid-cols-2 min-[900px]:gap-[72px]`}>
          <div>
            <p className={`mb-7 max-w-[52ch] leading-[1.7] text-tcl opacity-85 ${surTitre}`}>L’équipe</p>
            <h2 id="titre-equipe" className={`mb-[18px] text-white ${titreSection}`}>
              Derrière chaque contenu, des psychologues engagé·es.
            </h2>
            <p className="mb-7 max-w-[52ch] leading-[1.7] opacity-85">
              Les articles, les exercices et les réponses aux questions sont écrits ou relus par des professionnel·les
              de la santé mentale, bénévoles, qui connaissent la réalité des jeunes au Togo.
            </p>
            <Link to="/a-propos" className="btn bg-white text-coal hover:bg-cr">
              Découvrir l’association
            </Link>
          </div>
          <Photo
            media={MEDIAS.accueilEquipe}
            className="aspect-[3/2] [background:radial-gradient(circle_at_30%_30%,rgba(194,98,63,0.5),transparent_55%),radial-gradient(circle_at_75%_70%,rgba(95,130,101,0.55),transparent_55%),#3a271d]!"
          />
        </div>
      </section>

      <section className={espaceSection}>
        <div className="container max-w-[720px] text-center">
          <h2 className="mb-3 text-[clamp(1.7rem,3.6vw,2.5rem)] font-semibold">Tu préfères en parler à quelqu’un ?</h2>
          <p className="mb-7 text-ts">Écris-nous en toute confidentialité. Si tu es en danger, l’aide d’urgence est à un clic.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/questions" className={`btn btn-primary btn-lg ${boutonPleineLargeur}`}>
              Poser une question
            </Link>
            <button type="button" className={`btn btn-secondary btn-lg ${boutonPleineLargeur}`} onClick={ouvrirUrgence}>
              <Icon name="lifebuoy" size={18} />
              J’ai besoin d’aide maintenant
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
