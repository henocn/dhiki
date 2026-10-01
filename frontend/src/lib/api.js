import { useCallback, useEffect, useState } from 'react';

const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  // Erreur renvoyée par l'API, avec le statut HTTP et le code machine.
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Appelle l'API DHIKI et renvoie le champ data, ou lève une ApiError.
export async function api(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'Connexion impossible au serveur.');
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const e = payload?.error ?? {};
    throw new ApiError(response.status, e.code ?? 'HTTP_ERROR', e.message ?? 'Erreur inattendue.', e.details);
  }
  return payload?.data;
}

// Charge une ressource de l'API au montage (et quand path change) avec états de chargement et d'erreur.
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: null, loading: Boolean(path) });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path, { signal: controller.signal })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ data: null, error, loading: false });
      });
    return () => controller.abort();
  }, [path, version]);

  // Relance la requête (bouton « Réessayer »).
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
