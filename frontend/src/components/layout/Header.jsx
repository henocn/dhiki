import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import Icon from '../Icon.jsx';
import { useUrgence } from '../urgence/UrgenceContext.jsx';
import Logo from './Logo.jsx';
import { NAV_LEGALE, NAV_PRINCIPALE } from './navigation.js';

// En-tête collant : navigation complète sur grand écran, bouton menu + tiroir en dessous de 1100 px.
export default function Header() {
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
        <Link to="/" className="brand" aria-label="DHIKI, retour à l’accueil">
          <Logo size={42} />
        </Link>

        <nav className="nav-desktop" aria-label="Navigation principale">
          {NAV_PRINCIPALE.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
              {item.libelle}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button type="button" className="btn-urgence" onClick={ouvrirUrgence}>
            <Icon name="lifebuoy" size={18} />
            <span>Urgence</span>
          </button>
          <button
            type="button"
            className="btn-burger"
            aria-label="Ouvrir le menu"
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
        aria-label="Navigation principale"
        aria-hidden={!menuOuvert}
        inert={!menuOuvert}
      >
        <div className="drawer-head">
          <span className="brand">
            <Logo size={38} />
          </span>
          <button type="button" className="icon-btn" aria-label="Fermer le menu" onClick={() => setMenuOuvert(false)}>
            <Icon name="x" size={22} />
          </button>
        </div>

        <nav className="drawer-nav">
          {NAV_PRINCIPALE.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="drawer-link">
              <Icon name={item.icone} size={20} />
              {item.libelle}
            </NavLink>
          ))}
          <NavLink to="/mes-ecrits" className="drawer-link">
            <Icon name="pen" size={20} />
            Mes écrits
          </NavLink>
        </nav>

        <div className="drawer-legal">
          {NAV_LEGALE.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.libelle}
            </Link>
          ))}
        </div>
      </aside>
    </header>
  );
}
