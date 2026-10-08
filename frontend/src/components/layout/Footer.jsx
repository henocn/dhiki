import { Link } from 'react-router';
import Icon from '../Icon.jsx';
import Logo from './Logo.jsx';
import { NAV_LEGALE, NAV_PRINCIPALE } from './navigation.js';

// Pied de page : rappel « ne remplace pas un professionnel », navigation et liens légaux.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand">
            <Logo size={52} />
          </span>
          <p>Un espace de soutien en santé mentale, gratuit et anonyme, pensé pour les jeunes au Togo.</p>
          <p className="footer-disclaimer">
            <Icon name="info" size={16} />
            DHIKI ne remplace pas un avis médical. En cas de danger immédiat, contacte les services d’urgence.
          </p>
        </div>

        <nav aria-label="Navigation">
          <h2 className="footer-title">Navigation</h2>
          <ul>
            {NAV_PRINCIPALE.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.libelle}</Link>
              </li>
            ))}
            <li>
              <Link to="/mes-ecrits">Mes écrits</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">Informations</h2>
          <ul>
            {NAV_LEGALE.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.libelle}</Link>
              </li>
            ))}
            <li>
              <a href="mailto:contact@dhiki.space">contact@dhiki.space</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} Association DHIKI Togo · Gratuit, anonyme, sans inscription.
      </div>
    </footer>
  );
}
