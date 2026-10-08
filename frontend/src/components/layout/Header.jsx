import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import Icon from '../Icon.jsx';
import { useUrgence } from '../urgence/UrgenceContext.jsx';
import Logo from './Logo.jsx';
import { NAV_LEGALE, NAV_PRINCIPALE } from './navigation.js';

const marque = 'inline-flex items-center gap-2 shrink-0 whitespace-nowrap';
const lienNav =
  "relative px-[13px] py-[7px] text-[0.92rem] font-medium whitespace-nowrap transition-colors duration-180 hover:text-coal after:content-[''] after:absolute after:left-[13px] after:right-[13px] after:bottom-0 after:h-0.5 after:rounded-[2px] after:bg-tc after:transition-transform after:duration-200 hover:after:scale-x-100";
const lienTiroir = 'flex items-center gap-3.5 min-h-[50px] px-3.5 py-2.5 rounded-(--rad) font-semibold text-[1.02rem]';

// Classes d'un lien de la navigation principale (soulignement animé, renforcé quand la page est active).
function classeLienNav({ isActive }) {
  return `${lienNav} ${isActive ? 'text-coal after:scale-x-100' : 'text-ts after:scale-x-0'}`;
}

// Classes d'un lien du tiroir mobile (fond terre cuite quand la page est active).
function classeLienTiroir({ isActive }) {
  return `${lienTiroir} ${isActive ? 'bg-tc text-white [&>svg]:text-white' : 'hover:bg-sand [&>svg]:text-ts'}`;
}

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
    <header className="sticky top-0 z-100 bg-cr border-b-[1.5px] border-bd">
      <div className="container flex items-center gap-3 h-(--header-h)">
        <Link to="/" className={marque} aria-label="DHIKI, retour à l’accueil">
          <Logo size={42} />
        </Link>

        <nav className="hidden min-[1100px]:flex min-[1100px]:gap-0.5 min-[1100px]:ml-3" aria-label="Navigation principale">
          {NAV_PRINCIPALE.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={classeLienNav}>
              {item.libelle}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto min-[400px]:gap-2.5">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 min-h-10 px-3.5 py-2 rounded-[20px] bg-(--coral) text-white font-bold text-[0.88rem] whitespace-nowrap transition-opacity duration-180 hover:opacity-90 max-[340px]:w-10 max-[340px]:p-0"
            onClick={ouvrirUrgence}
          >
            <Icon name="lifebuoy" size={18} />
            <span className="max-[340px]:sr-only">Urgence</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-coal hover:bg-bdl min-[1100px]:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOuvert}
            aria-controls="menu-mobile"
            onClick={() => setMenuOuvert(true)}
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-140 bg-[rgba(44,26,18,0.4)] transition-opacity duration-250 min-[1100px]:hidden ${
          menuOuvert ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOuvert(false)}
      />
      <aside
        id="menu-mobile"
        className={`fixed top-0 right-0 bottom-0 z-150 flex flex-col gap-[18px] w-[min(360px,88vw)] pt-3.5 px-[18px] pb-[calc(20px+env(safe-area-inset-bottom))] bg-cr shadow-(--shm) overflow-y-auto min-[1100px]:hidden ${
          menuOuvert
            ? 'visible [clip-path:inset(0)] [transition:clip-path_0.3s_var(--ease)]'
            : 'invisible [clip-path:inset(0_0_0_100%)] [transition:clip-path_0.3s_var(--ease),visibility_0s_linear_0.3s]'
        }`}
        aria-label="Navigation principale"
        aria-hidden={!menuOuvert}
        inert={!menuOuvert}
      >
        <div className="flex items-center justify-between">
          <span className={marque}>
            <Logo size={38} />
          </span>
          <button type="button" className="icon-btn" aria-label="Fermer le menu" onClick={() => setMenuOuvert(false)}>
            <Icon name="x" size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV_PRINCIPALE.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={classeLienTiroir}>
              <Icon name={item.icone} size={20} />
              {item.libelle}
            </NavLink>
          ))}
          <NavLink to="/mes-ecrits" className={classeLienTiroir}>
            <Icon name="pen" size={20} />
            Mes écrits
          </NavLink>
        </nav>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-auto pt-3 border-t border-bd text-[0.85rem] text-ts">
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
