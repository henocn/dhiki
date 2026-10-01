import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import * as questions from '../services/questions.service.js';
import { HttpError, notFound } from '../utils/http-error.js';

const router = Router();

const limiteEnvoi = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new HttpError(429, 'TOO_MANY_REQUESTS', 'Trop de questions envoyées. Réessaie un peu plus tard.')),
});

const limiteSuivi = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new HttpError(429, 'TOO_MANY_REQUESTS', 'Trop de tentatives. Réessaie dans quelques minutes.')),
});

const contenu = z.string().trim().min(10, 'La question doit contenir au moins 10 caractères.').max(2000);

const listeQuery = z.object({
  page: z.coerce.number().int().min(1).optional().transform((v) => v ?? 1),
  parPage: z.coerce.number().int().min(1).max(50).optional().transform((v) => v ?? 20),
});

const questionPubliqueBody = z.object({
  contenu,
  pseudo: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v && v.length >= 2 ? v : undefined)),
});

const questionConfidentielleBody = z.object({ contenu });

const suiviBody = z.object({
  code: z.string().trim().min(16).max(32),
});

// Questions publiques modérées, paginées.
router.get('/publiques', validate(listeQuery, 'query'), async (req, res) => {
  const { page, parPage } = req.valid.query;
  res.json({ data: await questions.listQuestionsPubliques({ page, parPage }), meta: { page, parPage } });
});

// Dépôt d'une question publique (visible seulement après modération).
router.post('/publiques', limiteEnvoi, validate(questionPubliqueBody), async (req, res) => {
  res.status(201).json({ data: await questions.createQuestionPublique(req.valid.body) });
});

// Dépôt d'une question confidentielle : renvoie un code de suivi à conserver par l'utilisateur.
router.post('/confidentielles', limiteEnvoi, validate(questionConfidentielleBody), async (req, res) => {
  res.status(201).json({ data: await questions.createQuestionConfidentielle(req.valid.body) });
});

// Consultation d'une question confidentielle via son code (POST pour ne pas exposer le code dans les URL/logs).
router.post('/confidentielles/suivi', limiteSuivi, validate(suiviBody), async (req, res) => {
  const question = await questions.getQuestionConfidentielleParCode(req.valid.body.code);
  if (!question) throw notFound('Aucune question ne correspond à ce code.');
  res.json({ data: question });
});

export default router;
