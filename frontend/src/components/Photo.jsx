import { useState } from 'react';

const photoBase =
  'relative m-0 overflow-hidden rounded-[var(--rad-lg)] [background:radial-gradient(circle_at_25%_30%,rgba(232,161,132,0.45),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(168,196,172,0.55),transparent_55%),var(--cr)]';

// Photo éditoriale : affiche l'image si elle existe, sinon un fond chaud discret (et son chemin attendu en développement).
export default function Photo({ media, className = '', eager = false }) {
  const [absente, setAbsente] = useState(false);
  return (
    <figure className={`${photoBase} ${className}`}>
      {!absente && (
        <img
          src={media.src}
          alt={media.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={media.position ? { objectPosition: media.position } : undefined}
          onError={() => setAbsente(true)}
        />
      )}
      {absente && import.meta.env.DEV && (
        <figcaption className="absolute top-3 left-3 rounded-[6px] bg-white/85 px-2.5 py-1 text-[0.72rem] text-ts">
          public{media.src}
        </figcaption>
      )}
    </figure>
  );
}
