import { useState } from 'react';
import { Link } from 'react-router';
import Icon from '../components/Icon.jsx';
import { BackLink } from '../components/ui.jsx';
import { MAX_ECRITS, supprimerEcrit, useEcrits } from '../lib/ecrits.js';
import { exporterEnPdf } from '../lib/pdf.js';
import { formaterDate } from '../lib/utils.js';

// Écrits personnels (journaux, lettres) conservés uniquement dans ce navigateur.
export default function MesEcrits() {
  const ecrits = useEcrits();
  const [ouverts, setOuverts] = useState(() => new Set());

  // Déplie ou replie un écrit.
  function basculer(id) {
    setOuverts((s) => {
      const copie = new Set(s);
      if (copie.has(id)) copie.delete(id);
      else copie.add(id);
      return copie;
    });
  }

  // Supprime un écrit après confirmation.
  function supprimer(id) {
    if (window.confirm('Supprimer définitivement cet écrit ?')) supprimerEcrit(id);
  }

  return (
    <div className="container page page--narrow">
      <BackLink />
      <header className="page-head">
        <h1>Mes écrits</h1>
        <p className="hint-box">
          <Icon name="lock" size={16} />
          Tes écrits sont enregistrés uniquement sur cet appareil. Personne d’autre ne peut les lire.
        </p>
      </header>

      {ecrits.length >= MAX_ECRITS - 5 && (
        <p className="warn-box">
          <Icon name="alert" size={16} />
          {`${ecrits.length} / ${MAX_ECRITS} écrits. Supprime-en pour en ajouter de nouveaux.`}
        </p>
      )}

      {ecrits.length === 0 ? (
        <div className="state-box">
          <Icon name="pen" size={32} />
          <p>Aucun écrit pour le moment. Ceux que tu sauvegardes depuis les exercices apparaîtront ici.</p>
          <Link to="/rubriques" className="btn btn-primary">
            Voir les rubriques
          </Link>
        </div>
      ) : (
        <ul className="list">
          {ecrits.map((e) => (
            <li key={e.id} className="ecrit-card">
              <div className="ecrit-top">
                <span className="tag tag--tc">{e.label}</span>
                <span className="ecrit-date">{formaterDate(e.date)}</span>
              </div>
              <p className={`ecrit-preview ${ouverts.has(e.id) ? 'is-open' : ''}`}>{e.contenu}</p>
              <div className="ecrit-actions">
                <button type="button" className="link-btn" onClick={() => basculer(e.id)} aria-expanded={ouverts.has(e.id)}>
                  {ouverts.has(e.id) ? 'Réduire' : 'Lire tout'}
                </button>
                <button type="button" className="link-btn" onClick={() => exporterEnPdf(e.label, e.contenu, e.date)}>
                  <Icon name="file" size={15} />
                  Exporter en PDF
                </button>
                <button type="button" className="link-btn link-btn--danger" onClick={() => supprimer(e.id)}>
                  <Icon name="trash" size={15} />
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
