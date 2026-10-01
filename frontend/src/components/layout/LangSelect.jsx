import { useEffect, useRef, useState } from 'react';
import { useLang } from '../../i18n/LangContext.jsx';
import Icon from '../Icon.jsx';

// Sélecteur de langue compact (liste déroulante) pour l'en-tête.
export function LangDropdown() {
  const { langue, setLangue, langues, t } = useLang();
  const [ouvert, setOuvert] = useState(false);
  const ref = useRef(null);
  const courante = langues.find((l) => l.code === langue);

  useEffect(() => {
    if (!ouvert) return undefined;
    // Ferme la liste au clic extérieur ou à la touche Échap.
    const fermer = (event) => {
      if (event.type === 'keydown' ? event.key === 'Escape' : !ref.current?.contains(event.target)) setOuvert(false);
    };
    document.addEventListener('mousedown', fermer);
    document.addEventListener('keydown', fermer);
    return () => {
      document.removeEventListener('mousedown', fermer);
      document.removeEventListener('keydown', fermer);
    };
  }, [ouvert]);

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        aria-label={t('lang.choisir')}
        onClick={() => setOuvert((o) => !o)}
      >
        <Icon name="globe" size={17} />
        <span>{courante?.court}</span>
        <Icon name="chevronDown" size={14} />
      </button>
      {ouvert && (
        <ul className="lang-menu" role="listbox" aria-label={t('lang.choisir')}>
          {langues.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === langue}
                className={l.code === langue ? 'is-active' : ''}
                onClick={() => {
                  setLangue(l.code);
                  setOuvert(false);
                }}
              >
                <span className="lang-code">{l.court}</span>
                {l.nom}
                {l.code === langue && <Icon name="check" size={15} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Sélecteur de langue en boutons segmentés (menu mobile).
export function LangSegmented() {
  const { langue, setLangue, langues, t } = useLang();
  return (
    <div className="lang-segmented" role="group" aria-label={t('lang.choisir')}>
      {langues.map((l) => (
        <button
          key={l.code}
          type="button"
          aria-pressed={l.code === langue}
          className={l.code === langue ? 'is-active' : ''}
          onClick={() => setLangue(l.code)}
        >
          {l.nom}
        </button>
      ))}
    </div>
  );
}
