import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { createTemoignageVisiteur } from '../services/temoignages.service.js';
import { HttpError, notFound } from '../utils/http-error.js';

const router = Router();

const limiteEnvoi = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new HttpError(429, 'TOO_MANY_REQUESTS', 'Trop de témoignages envoyés. Réessaie un peu plus tard.')),
});

const champCourt = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((v) => (v ? v : undefined));

const temoignageBody = z.object({
  rubrique: z.string().trim().min(1).max(60),
  citation: z.string().trim().min(20, 'Le témoignage doit contenir au moins 20 caractères.').max(1200),
  prenom: champCourt,
  age: z.coerce.number().int().min(12).max(99).optional(),
  ville: champCourt,
  consentement: z.literal(true, { message: 'Le consentement à la publication est obligatoire.' }),
});

// Dépôt d'un témoignage par un visiteur, publié seulement après relecture par l'équipe.
router.post('/', limiteEnvoi, validate(temoignageBody), async (req, res) => {
  const temoignage = await createTemoignageVisiteur(req.valid.body);
  if (!temoignage) throw notFound('Rubrique introuvable.');
  res.status(201).json({ data: temoignage });
});

export default router;
