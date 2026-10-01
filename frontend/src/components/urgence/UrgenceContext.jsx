import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UrgenceContext = createContext(null);

// Partage l'état d'ouverture de la fenêtre « Besoin d'aide immédiate » entre toutes les pages.
export function UrgenceProvider({ children }) {
  const [ouvert, setOuvert] = useState(false);
  const ouvrirUrgence = useCallback(() => setOuvert(true), []);
  const fermerUrgence = useCallback(() => setOuvert(false), []);
  const value = useMemo(() => ({ ouvert, ouvrirUrgence, fermerUrgence }), [ouvert, ouvrirUrgence, fermerUrgence]);
  return <UrgenceContext.Provider value={value}>{children}</UrgenceContext.Provider>;
}

// Accède à l'ouverture / fermeture de la fenêtre d'urgence.
export function useUrgence() {
  const context = useContext(UrgenceContext);
  if (!context) throw new Error('useUrgence doit être utilisé dans <UrgenceProvider>.');
  return context;
}
