import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { useLang } from '../i18n/LangContext.jsx';
import { sauvegarderEcrit } from '../lib/ecrits.js';
import { exporterEnPdf } from '../lib/pdf.js';
import { ExoHeader, Fin } from './commun.jsx';

// Compte les mots d'un texte.
function compterMots(texte) {
  const propre = texte.trim();
  return propre ? propre.split(/\s+/).length : 0;
}

// Écriture libre (lettre) : texte privé enregistré uniquement sur l'appareil.
export default function Ecriture({ exercice }) {
  const { t } = useLang();
  const [texte, setTexte] = useState('');
  const [termine, setTermine] = useState(null);
  const mots = compterMots(texte);

  // Enregistre la lettre localement et affiche l'écran de fin.
  function terminer() {
    const contenu = texte.trim();
    setTermine({ contenu, sauvegarde: sauvegarderEcrit(t('exo.lettre'), contenu) });
  }

  if (termine) {
    return (
      <Fin
        icone="heart"
        titre={t('exo.ecritureFinTitre')}
        texte={t('exo.ecritureFinTexte')}
        actions={
          <>
            <Link to="/mes-ecrits" className="btn btn-ghost">
              <Icon name="pen" size={16} />
              {t('nav.ecrits')}
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => exporterEnPdf(t('exo.lettre'), termine.contenu)}>
              <Icon name="file" size={16} />
              {t('ecrits.exporter')}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setTexte('');
                setTermine(null);
              }}
            >
              {t('exo.ecrireEncore')}
            </button>
          </>
        }
      >
        <p className={termine.sauvegarde ? 'hint-box' : 'warn-box'}>
          <Icon name={termine.sauvegarde ? 'lock' : 'alert'} size={16} />
          {termine.sauvegarde ? t('exo.sauvegarde') : t('exo.sauvegardeEchec')}
        </p>
      </Fin>
    );
  }

  return (
    <div className="exo-narrow exo-narrow--wide">
      <ExoHeader titre={exercice.titre} sousTitre={t('exo.ecritureSousTitre')} />
      <div className="exo-panel">
        <p className="muted">{t('exo.ecritureAide')}</p>
        <p className="muted">
          {t('exo.ecriturePiste')} <em>« Il y a quelque chose que j'aurais voulu te dire… »</em>
        </p>
      </div>
      <textarea className="textarea textarea--lg" value={texte} onChange={(e) => setTexte(e.target.value)} placeholder={t('exo.ecriturePlaceholder')} aria-label={exercice.titre} />
      <p className="muted small right">{t('exo.mots', { n: mots })}</p>
      <div className="btn-row btn-row--center">
        <button type="button" className="btn btn-primary" disabled={mots === 0} onClick={terminer}>
          {t('exo.jaiTermine')}
        </button>
      </div>
    </div>
  );
}
