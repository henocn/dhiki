import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
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
  const [texte, setTexte] = useState('');
  const [termine, setTermine] = useState(null);
  const mots = compterMots(texte);

  // Enregistre la lettre localement et affiche l'écran de fin.
  function terminer() {
    const contenu = texte.trim();
    setTermine({ contenu, sauvegarde: sauvegarderEcrit('Lettre', contenu) });
  }

  if (termine) {
    return (
      <Fin
        icone="heart"
        titre="Merci d’avoir écrit"
        texte="Mettre des mots sur ce qu’on ressent soulage souvent. Tu peux garder ce texte ou le laisser partir."
        actions={
          <>
            <Link to="/mes-ecrits" className="btn btn-ghost">
              <Icon name="pen" size={16} />
              Mes écrits
            </Link>
            <button type="button" className="btn btn-ghost" onClick={() => exporterEnPdf('Lettre', termine.contenu)}>
              <Icon name="file" size={16} />
              Exporter en PDF
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setTexte('');
                setTermine(null);
              }}
            >
              Écrire encore
            </button>
          </>
        }
      >
        <p className={termine.sauvegarde ? 'hint-box' : 'warn-box'}>
          <Icon name={termine.sauvegarde ? 'lock' : 'alert'} size={16} />
          {termine.sauvegarde ? 'Sauvegarder dans Mes écrits' : 'Sauvegarde impossible : la limite est atteinte ou le stockage est indisponible.'}
        </p>
      </Fin>
    );
  }

  return (
    <div className="exo-narrow exo-narrow--wide">
      <ExoHeader titre={exercice.titre} sousTitre="Écris librement, personne d’autre ne lira ce texte." />
      <div className="exo-panel">
        <p className="muted">Pas besoin de bien écrire. Laisse venir les mots.</p>
        <p className="muted">
          Piste <em>« Il y a quelque chose que j'aurais voulu te dire… »</em>
        </p>
      </div>
      <textarea className="textarea textarea--lg" value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Commence ici…" aria-label={exercice.titre} />
      <p className="muted small right">{(mots === 1 ? `${mots} mot` : `${mots} mots`)}</p>
      <div className="btn-row btn-row--center">
        <button type="button" className="btn btn-primary" disabled={mots === 0} onClick={terminer}>
          J’ai terminé
        </button>
      </div>
    </div>
  );
}
