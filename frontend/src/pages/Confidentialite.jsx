import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { BackLink } from '../components/ui.jsx';

const RESUME = [
  { icone: 'user', texte: 'Aucun compte, aucun nom, aucun e-mail demandé pour utiliser DHIKI.' },
  { icone: 'lock', texte: '« Faire le point » et « Mes écrits » restent sur ton appareil : nous ne les voyons jamais.' },
  { icone: 'shieldCheck', texte: 'Pas de publicité, pas de revente de données, pas de traceurs publicitaires.' },
  { icone: 'trash', texte: 'Les questions confidentielles sont supprimées automatiquement après 90 jours.' },
];

// Politique de confidentialité : ce qui est collecté, où, pourquoi et pendant combien de temps.
export default function Confidentialite() {
  return (
    <div className="container page page--narrow">
      <BackLink />
      <header className="page-head">
        <h1>Politique de confidentialité</h1>
        <p className="muted">Dernière mise à jour : 1er octobre 2026 · Version de travail, à faire valider juridiquement avant la mise en ligne.</p>
      </header>

      <section className="summary-box" aria-label="En bref">
        <h2>En bref</h2>
        <ul>
          {RESUME.map((r) => (
            <li key={r.texte}>
              <Icon name={r.icone} size={18} />
              {r.texte}
            </li>
          ))}
        </ul>
      </section>

      <div className="prose legal">
        <h2>1. Qui est responsable de tes données ?</h2>
        <p>
          Le responsable du traitement est l'Association DHIKI Togo (coordonnées dans les <Link to="/mentions-legales">mentions légales</Link>).
          Pour toute question : <a href="mailto:contact@dhiki.space">contact@dhiki.space</a>.
        </p>

        <h2>2. Ce qui reste uniquement sur ton appareil</h2>
        <p>Ces informations sont enregistrées dans ton navigateur (« stockage local ») et ne nous sont jamais transmises :</p>
        <ul>
          <li>tes réponses au parcours « Faire le point » (elles ne sont même pas conservées après la fin du parcours) ;</li>
          <li>tes journaux, lettres et autres écrits (« Mes écrits ») ;</li>
          <li>ta préférence de langue.</li>
        </ul>
        <p>
          <strong>Traduction automatique.</strong> Le site est rédigé en français. Si tu choisis l'anglais ou l'éwé, le texte des pages est
          traduit par Google Traduction : il est alors transmis à Google. Rien n'est envoyé tant que tu restes en français.
        </p>
        <p>
          Tu peux supprimer un écrit à tout moment depuis « Mes écrits », ou tout effacer en vidant les données du site dans ton navigateur.
          Attention : sur un appareil partagé, une autre personne utilisant le même navigateur pourrait les voir.
        </p>

        <h2 id="questions">3. Les questions que tu nous envoies</h2>
        <p>
          <strong>Question publique.</strong> Nous enregistrons ton texte, le pseudo facultatif que tu choisis et la date. La question n'est
          publiée qu'après relecture par un modérateur, puis reste visible avec la réponse du professionnel. N'y mets aucune information qui
          permettrait de te reconnaître.
        </p>
        <p>
          <strong>Question confidentielle.</strong> Seuls ton texte et la date sont enregistrés. Elle n'est lue que par le professionnel chargé de
          te répondre. Tu reçois un code de suivi : nous n'en gardons qu'une empreinte chiffrée, nous ne pouvons donc pas le retrouver si tu le
          perds. La question et sa réponse sont supprimées automatiquement 90 jours après l'envoi.
        </p>

        <h2 id="temoignages">4. Les témoignages</h2>
        <p>
          Si tu partages un témoignage, nous enregistrons ton texte, ainsi que le prénom (ou pseudo), l'âge et la ville si tu choisis de les
          indiquer, avec la date de ton accord. Il n'est publié qu'après relecture par l'équipe, qui peut le raccourcir ou retirer un détail
          permettant de t'identifier. Tu peux demander son retrait à tout moment par e-mail.
        </p>

        <h2 id="urgence">4 bis. L'aide d'urgence</h2>
        <p>
          <strong>Mise en relation avec un proche.</strong> Si tu nous demandes de contacter une personne de confiance, nous enregistrons son
          prénom, son numéro, le lien que vous avez, ainsi que ton prénom et ton message si tu les indiques. Seule l'équipe d'écoute y a accès,
          uniquement pour l'appeler. Ces informations sont supprimées automatiquement 30 jours après ta demande.
        </p>
        <p>
          <strong>Parler à un·e professionnel·le.</strong> Quand tu choisis cette option, l'équipe reçoit un signal anonyme (sans aucune
          donnée sur toi) pour s'assurer que la ligne d'écoute est disponible.
        </p>

        <h2>5. Données techniques</h2>
        <p>
          Pour protéger le service contre les abus (envois massifs, attaques), notre serveur utilise temporairement l'adresse IP de ton appareil
          afin de limiter le nombre d'envois. Elle n'est pas associée au contenu de tes questions et n'est pas conservée dans notre base de données.
          Les polices de caractères sont hébergées sur nos propres serveurs : aucun service tiers n'est contacté pendant ta visite.
        </p>

        <h2>6. Ce que nous ne faisons jamais</h2>
        <ul>
          <li>vendre, louer ou partager tes données à des fins commerciales ;</li>
          <li>afficher de la publicité ou utiliser des traceurs publicitaires ;</li>
          <li>poser un diagnostic à partir de tes réponses.</li>
        </ul>

        <h2>7. Si tu es mineur·e</h2>
        <p>
          DHIKI est pensé pour les jeunes dès 12 ans et ne demande aucune donnée d'identité. Si un message laisse penser qu'une personne est en
          danger immédiat, l'équipe suivra la procédure de protection définie avec ses professionnels. Cette procédure sera détaillée ici avant la
          mise en ligne.
        </p>

        <h2>8. Tes droits</h2>
        <p>
          Conformément à la loi togolaise n° 2019-014 du 29 octobre 2019 relative à la protection des données à caractère personnel, tu peux
          demander l'accès, la rectification ou la suppression des informations te concernant en écrivant à{' '}
          <a href="mailto:contact@dhiki.space">contact@dhiki.space</a>. Pour une question confidentielle, indique-nous ton code de suivi : c'est
          le seul moyen de la retrouver.
        </p>

        <h2>9. Sécurité</h2>
        <p>
          Les échanges avec le site sont chiffrés (HTTPS). L'accès aux questions est limité aux personnes habilitées selon leur rôle, et les accès
          sensibles sont tracés sans jamais enregistrer le contenu des questions confidentielles.
        </p>
      </div>
    </div>
  );
}
