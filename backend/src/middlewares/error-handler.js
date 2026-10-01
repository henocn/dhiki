import { env } from '../config/env.js';
import { HttpError, notFound } from '../utils/http-error.js';

// Transforme toute route inconnue en erreur 404.
export function notFoundHandler(_req, _res, next) {
  next(notFound('Route introuvable.'));
}

// Renvoie les erreurs au format { error: { code, message, details } } sans exposer de données internes.
export function errorHandler(error, req, res, _next) {
  if (error?.type === 'entity.parse.failed') {
    error = new HttpError(400, 'INVALID_JSON', 'Le corps de la requête n\'est pas un JSON valide.');
  } else if (error?.type === 'entity.too.large') {
    error = new HttpError(413, 'PAYLOAD_TOO_LARGE', 'Le corps de la requête est trop volumineux.');
  }

  if (!(error instanceof HttpError)) {
    console.error(`[${req.method} ${req.path}]`, env.NODE_ENV === 'production' ? error.message : error);
    error = new HttpError(500, 'INTERNAL_ERROR', 'Une erreur interne est survenue.');
  }

  res.status(error.status).json({
    error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) },
  });
}
