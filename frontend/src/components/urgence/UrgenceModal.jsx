import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLang } from '../../i18n/LangContext.jsx';
import { useApi } from '../../lib/api.js';
import Icon from '../Icon.jsx';
import { useUrgence } from './UrgenceContext.jsx';

// Fenêtre d'aide immédiate : respiration guidée, proche de confiance et contacts vérifiés uniquement.
export default function UrgenceModal() {
  const { t } = useLang();
  const { ouvert, fermerUrgence } = useUrgence();
  const navigate = useNavigate();
  const closeRef = useRef(null);
  const { data: contacts } = useApi(ouvert ? '/urgence/contacts?pays=TG' : null);

  useEffect(() => {
    if (!ouvert) return undefined;
    closeRef.current?.focus();
    document.body.classList.add('no-scroll');
    // Ferme la fenêtre avec la touche Échap.
    const onKey = (event) => event.key === 'Escape' && fermerUrgence();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [ouvert, fermerUrgence]);

  if (!ouvert) return null;

  // Lance l'exercice de respiration d'urgence dans un écran visible.
  function commencerRespiration() {
    fermerUrgence();
    navigate('/exercices/respiration-urgence');
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && fermerUrgence()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="urgence-titre">
        <button ref={closeRef} type="button" className="sheet-close icon-btn" aria-label={t('commun.fermer')} onClick={fermerUrgence}>
          <Icon name="x" size={20} />
        </button>
        <div className="sheet-icon sheet-icon--coral">
          <Icon name="lifebuoy" size={26} />
        </div>
        <h2 id="urgence-titre">{t('urgence.titre')}</h2>
        <p className="muted">{t('urgence.intro')}</p>

        <ul className="crisis-list">
          <li>
            <div className="crisis-icon">
              <Icon name="wind" size={20} />
            </div>
            <div>
              <strong>{t('urgence.respiration')}</strong>
              <span>{t('urgence.respirationTexte')}</span>
              <button type="button" className="btn btn-sage btn-sm" onClick={commencerRespiration}>
                <Icon name="play" size={14} />
                {t('urgence.commencer')}
              </button>
            </div>
          </li>
          <li>
            <div className="crisis-icon">
              <Icon name="users" size={20} />
            </div>
            <div>
              <strong>{t('urgence.proche')}</strong>
              <span>{t('urgence.procheTexte')}</span>
            </div>
          </li>
          {contacts?.map((c) => (
            <li key={c.id}>
              <div className="crisis-icon">
                <Icon name="phone" size={20} />
              </div>
              <div>
                <strong>{c.nom}</strong>
                {(c.ville || c.description) && <span>{[c.ville, c.description].filter(Boolean).join(' · ')}</span>}
                {c.telephone && (
                  <a className="crisis-link" href={`tel:${c.telephone.replace(/\s/g, '')}`}>
                    {t('urgence.appeler')} {c.telephone}
                  </a>
                )}
                {c.lien && (
                  <a className="crisis-link" href={c.lien} target="_blank" rel="noreferrer">
                    {t('urgence.siteWeb')}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="danger-note">
          <Icon name="alert" size={18} />
          {t('urgence.danger')}
        </p>
      </div>
    </div>
  );
}
