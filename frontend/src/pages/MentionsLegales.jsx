import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { BackLink } from '../components/ui.jsx';
import { EDITEUR, EQUIPE, HEBERGEUR } from '../content/equipe.js';

// Mentions légales : éditeur, hébergeur, équipe et professionnels, limites de responsabilité.
export default function MentionsLegales() {
  return (
    <div className="container page page--narrow">
      <BackLink />
      <header className="page-head">
        <h1>Mentions légales</h1>
        <p className="muted">Les éléments entre crochets sont à compléter par l'association avant la mise en ligne.</p>
      </header>

      <div className="prose legal">
        <h2>Éditeur du site</h2>
        <ul className="plain-list">
          <li>
            <strong>{EDITEUR.nom}</strong>
          </li>
          <li>Siège : {EDITEUR.siege}</li>
          <li>Enregistrement : {EDITEUR.enregistrement}</li>
          <li>Responsable de la publication : {EDITEUR.responsablePublication}</li>
          <li>
            Contact : <a href={`mailto:${EDITEUR.contact}`}>{EDITEUR.contact}</a>
          </li>
        </ul>

        <h2>Hébergement</h2>
        <ul className="plain-list">
          <li>{HEBERGEUR.nom}</li>
          <li>{HEBERGEUR.adresse}</li>
          <li>{HEBERGEUR.site}</li>
        </ul>
      </div>

      <section id="equipe" className="prose-section">
        <h2>L'équipe et les professionnels</h2>
        <p className="muted">
          Les réponses aux questions sont rédigées par des professionnels de santé mentale habilités. Les articles et exercices sont relus par
          l'équipe éditoriale avant publication.
        </p>
        <div className="team-grid">
          {EQUIPE.map((m) => (
            <article key={m.role} className={`team-card ${m.aCompleter ? 'is-draft' : ''}`}>
              <span className="tile-icon tile-icon--sage tile-icon--sm">
                <Icon name={m.role.toLowerCase().includes('psycho') ? 'shieldCheck' : 'user'} size={20} />
              </span>
              <span className="team-role">{m.role}</span>
              <strong>{m.nom}</strong>
              <span className="muted small">{m.details}</span>
            </article>
          ))}
        </div>
      </section>

      <div className="prose legal">
        <h2>Nature du service</h2>
        <p>
          DHIKI est un service d'information et d'accompagnement en bien-être mental. Il <strong>ne remplace pas</strong> un diagnostic, une
          consultation ou un traitement par un professionnel de santé, ni les services d'urgence. En cas de danger immédiat, contacte les services
          d'urgence de ton pays ou une personne de confiance.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, exercices, illustrations et le logo DHIKI sont la propriété de l'Association DHIKI Togo, sauf mention contraire. Toute
          reproduction à des fins commerciales est interdite sans autorisation. Le partage à des fins non commerciales est encouragé avec mention de
          la source.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Voir la <Link to="/confidentialite">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
