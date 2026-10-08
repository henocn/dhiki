import { Link } from 'react-router';
import Icon from '../Icon.jsx';
import Logo from './Logo.jsx';
import { NAV_LEGALE, NAV_PRINCIPALE } from './navigation.js';

const titre = 'mb-2.5 text-[0.8rem] tracking-[0.06em] uppercase text-[#b8a797]';
const liste = 'flex flex-col gap-1.5';
const lien = 'hover:text-white';

// Pied de page : rappel « ne remplace pas un professionnel », navigation et liens légaux.
export default function Footer() {
  return (
    <footer className="bg-coal text-[#d9cbbd] pt-10 pb-[calc(90px+env(safe-area-inset-bottom))] text-[0.9rem]">
      <div className="container grid gap-7 min-[640px]:grid-cols-[2fr_1fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 shrink-0 whitespace-nowrap">
            <Logo size={52} />
          </span>
          <p className="mt-2.5 max-w-[420px] text-[#b8a797]">
            Un espace de soutien en santé mentale, gratuit et anonyme, pensé pour les jeunes au Togo.
          </p>
        </div>

        <nav aria-label="Navigation">
          <h2 className={titre}>Navigation</h2>
          <ul className={liste}>
            {NAV_PRINCIPALE.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={lien}>
                  {item.libelle}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/mes-ecrits" className={lien}>
                Mes écrits
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className={titre}>Informations</h2>
          <ul className={liste}>
            {NAV_LEGALE.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={lien}>
                  {item.libelle}
                </Link>
              </li>
            ))}
            <li>
              <a href="mailto:contact@dhiki.space" className={lien}>
                contact@dhiki.space
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mt-7 pt-[18px] border-t border-[rgba(255,255,255,0.12)] text-[0.8rem] text-[#b8a797]">
        © {new Date().getFullYear()} Association DHIKI Togo · Gratuit et anonyme.
      </div>
    </footer>
  );
}
