import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import Logo from '../components/layout/Logo.jsx';
import { BackLink } from '../components/ui.jsx';

const OFFRES = [
  { icone: 'wind', titre: 'Exercices guidés', texte: 'Respiration, scan corporel, journaux, ancrage sensoriel.' },
  { icone: 'book', titre: 'Articles et ressources', texte: 'Des contenus clairs, écrits pour notre contexte local.' },
  { icone: 'message', titre: 'Poser une question', texte: 'Publiquement ou de façon confidentielle, en toute sécurité.' },
  { icone: 'lifebuoy', titre: "Aide d'urgence", texte: 'Des gestes simples et des contacts vérifiés en cas de crise.' },
];

const VALEURS = [
  { titre: 'Gratuit', texte: 'Tout le contenu est et restera gratuit, sans exception.' },
  { titre: 'Anonyme', texte: 'Aucun compte requis. Tes écrits restent sur ton appareil, invisibles pour nous.' },
  { titre: 'Ancré', texte: "Né à Lomé, pensé pour les réalités africaines. Conçu pour voyager, d'une ville à l'autre, d'un pays à l'autre." },
  { titre: 'Bienveillant', texte: 'Sans jugement. Chacun avance à son rythme.' },
];

// Page « À propos » : mission, offre, valeurs et structure porteuse.
export default function APropos() {
  return (
    <div className="container page page--narrow">
      <BackLink />
      <header className="about-hero">
        <Logo size={56} />
        <h1>DHIKI</h1>
        <p>Bien-être mental</p>
      </header>

      <section className="prose-section">
        <h2>Notre mission</h2>
        <p>
          DHIKI est née d'un constat simple : le bien-être mental est essentiel, et les jeunes qui se sentent écoutés et compris dans un espace
          sécurisant s'épanouissent mieux, s'expriment plus librement et construisent un rapport à eux-mêmes plus sain.
        </p>
        <p>
          Notre mission est d'offrir cet espace — une safe place, un havre de paix — à toute personne qui en a besoin. Un lieu sans jugement,
          accessible gratuitement, où chacun peut prendre soin de sa santé mentale à son rythme.
        </p>
        <p>
          DHIKI s'adresse d'abord aux jeunes de 12 à 25 ans, mais aussi à tous ceux qui cherchent un moment pour souffler, se retrouver et aller
          un peu mieux. En Afrique et au-delà.
        </p>
      </section>

      <section className="prose-section">
        <h2>Ce que DHIKI propose</h2>
        <div className="feature-grid">
          {OFFRES.map((o) => (
            <div key={o.titre} className="feature">
              <span className="tile-icon tile-icon--tc tile-icon--sm">
                <Icon name={o.icone} size={20} />
              </span>
              <strong>{o.titre}</strong>
              <span>{o.texte}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="prose-section">
        <h2>Nos valeurs</h2>
        <dl className="values-list">
          {VALEURS.map((v) => (
            <div key={v.titre}>
              <dt>{v.titre}</dt>
              <dd>{v.texte}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="prose-section">
        <h2>Qui sommes-nous</h2>
        <p>
          DHIKI est portée par <strong>l'Association DHIKI Togo</strong>, créée pour donner vie à ce projet et accompagner les jeunes Africains
          dans leur bien-être mental. Les contenus sont relus et les réponses aux questions rédigées par des professionnels habilités, présentés
          dans les <Link to="/mentions-legales#equipe">mentions légales</Link>.
        </p>
        <p>
          Nous croyons que des outils accessibles, gratuits et adaptés à nos réalités peuvent transformer des vies — et que des jeunes qui se
          sentent bien en eux-mêmes construisent un avenir meilleur, pour eux et pour leurs communautés.
        </p>
      </section>

      <section className="contact-box">
        <p>Une question, une suggestion ?</p>
        <a href="mailto:contact@dhiki.space">
          <Icon name="mail" size={18} />
          contact@dhiki.space
        </a>
      </section>
    </div>
  );
}
