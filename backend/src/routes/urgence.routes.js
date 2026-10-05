import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import { createDemandeUrgence } from '../services/urgence.service.js';
import { HttpError } from '../utils/http-error.js';

const router = Router();

const limiteEnvoi = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 6,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new HttpError(429, 'TOO_MANY_REQUESTS', 'Trop de demandes envoyées. Si c’est urgent, appelle directement le numéro affiché.')),
});

const optionnel = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const demandeBody = z.discriminatedUnion('type', [
  z.object({ type: z.literal('inconnu') }),
  z.object({
    type: z.literal('proche'),
    prenom: optionnel(40),
    procheNom: z.string().trim().min(1, 'Indique le prénom de la personne à contacter.').max(80),
    procheLien: optionnel(40),
    procheTelephone: z
      .string()
      .trim()
      .regex(/^\+?[0-9 ().-]{8,20}$/, 'Ce numéro de téléphone ne semble pas valide.'),
    message: optionnel(600),
    consentement: z.literal(true, { message: 'Ton accord est nécessaire pour que nous contactions cette personne.' }),
  }),
]);

// Enregistre une demande d'aide (mise en relation avec un proche, ou alerte anonyme) et prévient l'équipe.
router.post('/demandes', limiteEnvoi, validate(demandeBody), async (req, res) => {
  const demande = await createDemandeUrgence(req.valid.body);
  res.status(201).json({ data: demande });
});

export default router;
