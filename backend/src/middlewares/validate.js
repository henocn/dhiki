import { HttpError } from '../utils/http-error.js';

// Valide req[source] avec un schéma zod et remplace la valeur par la version nettoyée.
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({ champ: issue.path.join('.'), message: issue.message }));
      return next(new HttpError(400, 'VALIDATION_ERROR', 'Données invalides.', details));
    }
    req.valid = { ...req.valid, [source]: result.data };
    return next();
  };
}
