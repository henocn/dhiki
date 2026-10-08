import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import Icon from '../Icon.jsx';
import { useUrgence } from '../urgence/UrgenceContext.jsx';
import Logo from './Logo.jsx';
import { NAV_LEGALE, NAV_PRINCIPALE } from './navigation.js';

const lienNav =
  "relative py-2 text-[0.95rem] font-medium whitespace-nowrap transition-colors duration-200 hover:text-coal after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-px after:h-[1.5px] after:bg-tc after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";
const lienTiroir = 'group flex items-baseline justify-between py-3.5 border-b border-bdl font-title font-semibold text-[1.7rem] leading-tight transition-colors';

// Classes d'un lien de la navigation principale (fin soulignement terre cuite, visible quand la page est active).
function classeLienNav({ isActive }) {
  return `${lienNav} ${isActive ? 'text-coal after:scale-x-100' : 'text-ts after:scale-x-0'}`;
}

// Classes d'un lien du menu mobile (terre cuite quand la page est active).
function classeLienTiroir({ isActive }) {
  return `${lienTiroir} ${isActive ? 'text-tc' : 'text-coal hover:text-tc'}`;
}

// En-tête collant : logo, navigation centrée et bouton d'urgence ; menu plein écran en dessous de 1100 px.
export default function Header() {
  const { ouvrirUrgence } = useUrgence();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOuvert(false), [location.pathname]);

  useEffect(() => {
    // Signale que la page a défilé pour afficher le filet sous l'en-tête.
    const onScroll = () => setDefile(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOuvert) return undefined;
    document.body.classList.add('no-scroll');
    // Ferme le menu avec la touche Échap.
    const onKey = (event) => event.key === 'Escape' && setMenuOuvert(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOuvert]);

  return (
    <>
      <header
        className={`sticky top-0 z-100 border-b bg-cr/85 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
          defile ? 'border-bd shadow-[0_1px_18px_rgba(44,26,18,0.06)]' : 'border-transparent'
        }`}
      >
        <div className="container relative flex items-center gap-3 h-(--header-h)">
          <Link to="/" className="inline-flex shrink-0" aria-label="DHIKI, retour à l’accueil">
            <Logo size={40} />
          </Link>

          <nav className="hidden min-[1100px]:flex gap-9 absolute left-1/2 -translate-x-1/2" aria-label="Navigation principale">
            {NAV_PRINCIPALE.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={classeLienNav}>
                {item.libelle}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 ml-auto">
            <NavLink
              to="/mes-ecrits"
              className={({ isActive }) =>
                `hidden min-[1100px]:inline-flex items-center gap-2 px-3 py-2 text-[0.9rem] font-medium transition-colors ${isActive ? 'text-tc' : 'text-ts hover:text-coal'}`
              }
            >
              <Icon name="pen" size={16} />
              Mes écrits
            </NavLink>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 border border-(--coral) text-(--coral) font-semibold text-[0.88rem] whitespace-nowrap transition-colors duration-200 hover:bg-(--coral) hover:text-white max-[340px]:w-10 max-[340px]:px-0"
              onClick={ouvrirUrgence}
            >
              <span className="relative flex size-2 max-[340px]:hidden" aria-hidden="true">
                <span className="absolute inset-0 rounded-full bg-current opacity-60 animate-ping motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-current" />
              </span>
              <Icon name="lifebuoy" size={18} className="hidden max-[340px]:block" />
              <span className="max-[340px]:sr-only">Urgence</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center size-11 text-coal hover:text-tc min-[1100px]:hidden"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOuvert}
              aria-controls="menu-mobile"
              onClick={() => setMenuOuvert(true)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-270 bg-[rgba(44,26,18,0.4)] transition-opacity duration-300 min-[1100px]:hidden ${
          menuOuvert ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOuvert(false)}
      />
      <aside
        id="menu-mobile"
        className={`fixed top-0 right-0 bottom-0 z-280 flex flex-col w-[min(420px,100vw)] px-7 pt-4 pb-[calc(24px+env(safe-area-inset-bottom))] bg-cr overflow-y-auto min-[1100px]:hidden ${
          menuOuvert
            ? 'visible [clip-path:inset(0)] [transition:clip-path_0.35s_var(--ease)]'
            : 'invisible [clip-path:inset(0_0_0_100%)] [transition:clip-path_0.35s_var(--ease),visibility_0s_linear_0.35s]'
        }`}
        aria-label="Navigation principale"
        aria-hidden={!menuOuvert}
        inert={!menuOuvert}
      >
        <div className="flex items-center justify-between h-12 mb-6">
          <Logo size={38} />
          <button
            type="button"
            className="inline-flex items-center justify-center size-11 -mr-2 text-coal hover:text-tc"
            aria-label="Fermer le menu"
            onClick={() => setMenuOuvert(false)}
          >
            <Icon name="x" size={24} />
          </button>
        </div>

        <nav className="flex flex-col border-t border-bdl">
          {[...NAV_PRINCIPALE, { to: '/mes-ecrits', libelle: 'Mes écrits' }].map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={classeLienTiroir}>
              {item.libelle}
              <Icon name="arrowRight" size={18} className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-auto pt-6 text-[0.85rem] text-ts">
          {NAV_LEGALE.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-coal">
              {item.libelle}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
