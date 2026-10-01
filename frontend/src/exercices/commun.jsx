import Icon from '../components/Icon.jsx';

// En-tête d'un exercice : titre, sous-titre et indicateur d'étape facultatif.
export function ExoHeader({ titre, sousTitre, etape }) {
  return (
    <header className="exo-head">
      {etape && <span className="exo-step">{etape}</span>}
      <h1>{titre}</h1>
      {sousTitre && <p className="muted">{sousTitre}</p>}
    </header>
  );
}

// Barre de progression segmentée (une case par étape).
export function Progression({ total, courant }) {
  return (
    <div className="progress-seg" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < courant ? 'is-done' : i === courant ? 'is-current' : ''} />
      ))}
    </div>
  );
}

// Écran de fin d'exercice avec icône, message et actions.
export function Fin({ icone = 'leaf', titre, texte, children, actions }) {
  return (
    <div className="exo-end">
      <span className="exo-end-icon">
        <Icon name={icone} size={30} />
      </span>
      <h1>{titre}</h1>
      {texte && <p className="muted">{texte}</p>}
      {children}
      <div className="btn-row btn-row--center">{actions}</div>
    </div>
  );
}
