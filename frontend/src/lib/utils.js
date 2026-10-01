// Renvoie une copie mélangée d'un tableau (Fisher-Yates).
export function melanger(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

// Formate une date ISO selon la langue de l'interface.
export function formaterDate(iso, langue = 'fr') {
  const locale = langue === 'en' ? 'en-GB' : 'fr-FR';
  return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
}

// Formate un nombre de secondes en mm:ss.
export function formaterMinutes(secondes) {
  const m = String(Math.floor(secondes / 60)).padStart(2, '0');
  const s = String(secondes % 60).padStart(2, '0');
  return `${m}:${s}`;
}
