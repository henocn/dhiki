import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { appliquerTraduction, langueTraduite } from '../lib/traduction.js';
import { LANGUES, TEXTES } from './index.js';

const LangContext = createContext(null);

// Remplace les variables {nom} d'un texte.
function interpoler(texte, vars) {
  if (!vars) return texte;
  return texte.replace(/\{(\w+)\}/g, (_, cle) => (cle in vars ? String(vars[cle]) : `{${cle}}`));
}

// Fournit les textes (français) et la langue de traduction automatique choisie.
export function LangProvider({ children }) {
  const [langue] = useState(langueTraduite);

  // Bascule la traduction automatique vers la langue demandée (recharge la page).
  const setLangue = useCallback((code) => code !== langue && appliquerTraduction(code), [langue]);

  // Renvoie le texte français d'une clé (variante « _un » si vars.n vaut 1).
  const t = useCallback((cle, vars) => {
    const texte = (vars?.n === 1 && TEXTES[`${cle}_un`]) || TEXTES[cle] || cle;
    return interpoler(texte, vars);
  }, []);

  const value = useMemo(() => ({ langue, setLangue, t, langues: LANGUES }), [langue, setLangue, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// Accède à la langue et à la fonction t() depuis un composant.
export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang doit être utilisé dans <LangProvider>.');
  return context;
}
