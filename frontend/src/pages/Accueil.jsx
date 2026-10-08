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
      <section className="home-hero">
        <Photo media={MEDIAS.accueilHero} className="home-hero-fond" eager />
        <div className="container home-hero-grid">
          <div className="home-hero-text">
            <h1>
              Un endroit pour parler de ce qui pèse, <em>sans être jugé·e.</em>
            </h1>
            <p className="home-hero-lead">
              Stress, sommeil, confiance, relations : DHIKI aide les jeunes à comprendre ce qu’ils ressentent et à
              trouver du soutien, gratuitement et en toute discrétion.
            </p>
            <div className="hero-actions">
              <Link to="/faire-le-point" className="btn btn-primary btn-lg">
                Faire le point
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/questions" className="btn btn-link btn-lg">
                Poser une question
              </Link>
            </div>
            <p className="home-hero-note">
              <Icon name="lock" size={15} />
              Gratuit, anonyme, sans inscription.
            </p>
          </div>
        </div>
      </section>

      <section className="home-now" aria-labelledby="titre-maintenant">
        <div className="container home-now-grid">
          <div>
            <h2 id="titre-maintenant">Ça ne va pas, là, maintenant ?</h2>
            <p>Choisis un exercice. Pas besoin de compte, ça commence tout de suite.</p>
          </div>
          <ul className="home-now-list">
            {OUTILS_RAPIDES.map((o) => (
              <li key={o.to}>
                <Link to={o.to}>
                  <span>{o.titre}</span>
                  <span className="home-now-duree">{o.duree}</span>
                  <Icon name="arrowRight" size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section" aria-labelledby="titre-themes">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Rubriques</p>
              <h2 id="titre-themes">De quoi as-tu besoin de parler ?</h2>
            </div>
          </div>
          {rubriques.loading && <Loader />}
          {rubriques.error && <ErrorState error={rubriques.error} onRetry={rubriques.reload} />}
          {rubriques.data && (
            <>
              <div className="rub-grid rub-grid--une">
                {rubriquesALaUne(rubriques.data).map((r) => (
                  <RubriqueCard key={r.slug} rubrique={r} />
                ))}
              </div>
              {rubriques.data.length > RUBRIQUES_A_LA_UNE.length && (
                <div className="voir-plus">
                  <Link to="/rubriques" className="btn btn-secondary">
                    Voir toutes les rubriques ({rubriques.data.length})
                    <Icon name="arrowRight" size={16} />
                  </Link>
                </div>
              )}
            </>
          )}
          {ecrits.length > 0 && (
            <Link to="/mes-ecrits" className="row-card">
              <span className="tile-icon tile-icon--violet tile-icon--sm">
                <Icon name="book" size={20} />
              </span>
              <span className="row-card-text">
                <strong>Mes écrits</strong>
                <span>{(ecrits.length === 1 ? `${ecrits.length} écrit sur cet appareil` : `${ecrits.length} écrits sur cet appareil`)}</span>
              </span>
              <Icon name="chevronRight" size={18} />
            </Link>
          )}
        </div>
      </section>

      <section className="home-section home-section--sand" aria-labelledby="titre-etapes">
        <div className="container home-split">
          <Photo media={MEDIAS.accueilEcoute} className="photo--portrait" />
          <div>
            <p className="eyebrow">Comment DHIKI t’accompagne</p>
            <h2 id="titre-etapes">Trois façons d’avancer, à ton rythme.</h2>
            <ol className="etapes">
              {ETAPES.map((e) => (
                <li key={e.numero}>
                  <span className="etape-num">{e.numero}</span>
                  <div>
                    <h3>{e.titre}</h3>
                    <p>{e.texte}</p>
                    <Link to={e.to} className="lien-fleche">
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

      <section className="home-equipe" aria-labelledby="titre-equipe">
        <div className="container home-equipe-grid">
          <div>
            <p className="eyebrow eyebrow--clair">L’équipe</p>
            <h2 id="titre-equipe">Derrière chaque contenu, des psychologues engagé·es.</h2>
            <p>
              Les articles, les exercices et les réponses aux questions sont écrits ou relus par des professionnel·les
              de la santé mentale, bénévoles, qui connaissent la réalité des jeunes au Togo.
            </p>
            <Link to="/a-propos" className="btn btn-clair">
              Découvrir l’association
            </Link>
          </div>
          <Photo media={MEDIAS.accueilEquipe} className="photo--paysage" />
        </div>
      </section>

      <section className="home-final">
        <div className="container home-final-inner">
          <h2>Tu préfères en parler à quelqu’un ?</h2>
          <p>Écris-nous en toute confidentialité. Si tu es en danger, l’aide d’urgence est à un clic.</p>
          <div className="hero-actions">
            <Link to="/questions" className="btn btn-primary btn-lg">
              Poser une question
            </Link>
            <button type="button" className="btn btn-secondary btn-lg" onClick={ouvrirUrgence}>
              <Icon name="lifebuoy" size={18} />
              J’ai besoin d’aide maintenant
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
