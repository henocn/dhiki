import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';

// Page affichée pour toute URL inconnue.
export default function NotFound() {
  return (
    <div className="container page">
      <div className="state-box state-box--lg">
        <Icon name="compass" size={36} />
        <h1>Page introuvable</h1>
        <p>Cette page n’existe pas ou a été déplacée.</p>
        <Link to="/" className="btn btn-primary">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
