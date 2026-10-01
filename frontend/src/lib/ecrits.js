import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'dhiki_ecrits';
const EVENT = 'dhiki:ecrits';
export const MAX_ECRITS = 50;

let cacheBrut = null;
let cacheListe = [];

// Lit les écrits stockés sur l'appareil (jamais envoyés au serveur).
function lire() {
  let brut = '[]';
  try {
    brut = localStorage.getItem(STORAGE_KEY) || '[]';
  } catch {
    /* stockage indisponible */
  }
  if (brut !== cacheBrut) {
    cacheBrut = brut;
    try {
      cacheListe = JSON.parse(brut);
    } catch {
      cacheListe = [];
    }
  }
  return cacheListe;
}

// Écrit la liste et prévient les composants abonnés.
function ecrire(liste) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(liste));
  window.dispatchEvent(new Event(EVENT));
}

// Abonne un composant aux changements (même onglet ou autre onglet).
function subscribe(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

// Renvoie la liste à jour des écrits pour un composant React.
export function useEcrits() {
  return useSyncExternalStore(subscribe, lire, () => []);
}

// Indique si la limite est atteinte (le prochain enregistrement supprimera le plus ancien).
export function limiteAtteinte() {
  return lire().length >= MAX_ECRITS;
}

// Enregistre un écrit en tête de liste ; renvoie false si le stockage a échoué.
export function sauvegarderEcrit(label, contenu) {
  try {
    const liste = [{ id: crypto.randomUUID(), label, contenu, date: new Date().toISOString() }, ...lire()];
    ecrire(liste.slice(0, MAX_ECRITS));
    return true;
  } catch {
    return false;
  }
}

// Supprime définitivement un écrit de l'appareil.
export function supprimerEcrit(id) {
  try {
    ecrire(lire().filter((e) => e.id !== id));
  } catch {
    /* ignoré */
  }
}
