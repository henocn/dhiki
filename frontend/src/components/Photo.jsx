import { useState } from 'react';

// Photo éditoriale : affiche l'image si elle existe, sinon un fond chaud discret (et son chemin attendu en développement).
export default function Photo({ media, className = '', eager = false }) {
  const [absente, setAbsente] = useState(false);
  return (
    <figure className={`photo ${absente ? 'photo--vide' : ''} ${className}`}>
      {!absente && (
        <img
          src={media.src}
          alt={media.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={media.position ? { objectPosition: media.position } : undefined}
          onError={() => setAbsente(true)}
        />
      )}
      {absente && import.meta.env.DEV && <figcaption className="photo-hint">public{media.src}</figcaption>}
    </figure>
  );
}
