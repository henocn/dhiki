// Renvoie une copie mélangée d'un tableau (Fisher-Yates).
export function melanger(tableau) {
  const copie = [...tableau];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

// Formate une date ISO en français (ex. : 08 octobre 2026).
export function formaterDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Formate un nombre de secondes en mm:ss.
export function formaterMinutes(secondes) {
  const m = String(Math.floor(secondes / 60)).padStart(2, '0');
  const s = String(secondes % 60).padStart(2, '0');
  return `${m}:${s}`;
}
