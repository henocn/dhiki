import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useLang } from '../../i18n/LangContext.jsx';
import Icon from '../Icon.jsx';
import { useUrgence } from '../urgence/UrgenceContext.jsx';
import { LangDropdown, LangSegmented } from './LangSelect.jsx';
import Logo from './Logo.jsx';
import { NAV_LEGALE, NAV_PRINCIPALE } from './navigation.js';

// En-tête collant : navigation complète sur grand écran, bouton menu + tiroir en dessous de 1100 px.
export default function Header() {
  const { t } = useLang();
  const { ouvrirUrgence } = useUrgence();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOuvert(false), [location.pathname]);

  useEffect(() => {
    if (!menuOuvert) return undefined;
    document.body.classList.add('no-scroll');
    // Ferme le tiroir avec la touche Échap.
    const onKey = (event) => event.key === 'Escape' && setMenuOuvert(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOuvert]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={t('nav.accueilAria')}>
          <Logo />
          <span className="brand-name">DHIKI</span>
        </Link>

        <nav className="nav-desktop" aria-label={t('nav.principale')}>
          {NAV_PRINCIPALE.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
              {t(item.cle)}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <div className="header-lang">
            <LangDropdown />
          </div>
          <button type="button" className="btn-urgence" onClick={ouvrirUrgence}>
            <Icon name="lifebuoy" size={18} />
            <span>{t('nav.urgence')}</span>
          </button>
          <button
            type="button"
            className="btn-burger"
            aria-label={t('nav.ouvrirMenu')}
            aria-expanded={menuOuvert}
            aria-controls="menu-mobile"
            onClick={() => setMenuOuvert(true)}
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      <div className={`drawer-overlay ${menuOuvert ? 'is-open' : ''}`} onClick={() => setMenuOuvert(false)} />
      <aside
        id="menu-mobile"
        className={`drawer ${menuOuvert ? 'is-open' : ''}`}
        aria-label={t('nav.principale')}
        aria-hidden={!menuOuvert}
        inert={!menuOuvert}
      >
        <div className="drawer-head">
          <span className="brand">
            <Logo size={28} />
            <span className="brand-name">DHIKI</span>
          </span>
          <button type="button" className="icon-btn" aria-label={t('nav.fermerMenu')} onClick={() => setMenuOuvert(false)}>
            <Icon name="x" size={22} />
          </button>
        </div>

        <nav className="drawer-nav">
          {NAV_PRINCIPALE.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="drawer-link">
              <Icon name={item.icone} size={20} />
              {t(item.cle)}
            </NavLink>
          ))}
          <NavLink to="/mes-ecrits" className="drawer-link">
            <Icon name="pen" size={20} />
            {t('nav.ecrits')}
          </NavLink>
        </nav>

        <div className="drawer-section">
          <div className="drawer-label">
            <Icon name="globe" size={16} />
            {t('lang.langue')}
          </div>
          <LangSegmented />
        </div>

        <div className="drawer-legal">
          {NAV_LEGALE.map((item) => (
            <Link key={item.to} to={item.to}>
              {t(item.cle)}
            </Link>
          ))}
        </div>
      </aside>
    </header>
  );
}
