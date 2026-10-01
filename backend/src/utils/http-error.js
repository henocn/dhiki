export class HttpError extends Error {
  // Crée une erreur HTTP portant un statut, un code machine et des détails facultatifs.
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Raccourci pour une ressource introuvable.
export function notFound(message = 'Ressource introuvable.') {
  return new HttpError(404, 'NOT_FOUND', message);
}
