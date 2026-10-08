import { Link } from 'react-router';
import { useLang } from '../../i18n/LangContext.jsx';
import Icon from '../Icon.jsx';
import Logo from './Logo.jsx';
import { NAV_LEGALE, NAV_PRINCIPALE } from './navigation.js';

// Pied de page : rappel « ne remplace pas un professionnel », navigation et liens légaux.
export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand">
            <Logo size={52} />
          </span>
          <p>{t('footer.mission')}</p>
          <p className="footer-disclaimer">
            <Icon name="info" size={16} />
            {t('footer.disclaimer')}
          </p>
        </div>

        <nav aria-label={t('footer.navigation')}>
          <h2 className="footer-title">{t('footer.navigation')}</h2>
          <ul>
            {NAV_PRINCIPALE.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{t(item.cle)}</Link>
              </li>
            ))}
            <li>
              <Link to="/mes-ecrits">{t('nav.ecrits')}</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="footer-title">{t('footer.infos')}</h2>
          <ul>
            {NAV_LEGALE.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{t(item.cle)}</Link>
              </li>
            ))}
            <li>
              <a href="mailto:contact@dhiki.space">contact@dhiki.space</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} Association DHIKI Togo · {t('footer.gratuit')}
      </div>
    </footer>
  );
}
