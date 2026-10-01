import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';
import * as contenus from '../services/contenus.service.js';
import { notFound } from '../utils/http-error.js';

const router = Router();

const paysQuery = z.object({
  pays: z.string().trim().length(2).toUpperCase().optional().transform((v) => v ?? 'TG'),
});

// Liste des rubriques publiées.
router.get('/rubriques', async (_req, res) => {
  res.json({ data: await contenus.listRubriques() });
});

// Détail d'une rubrique : articles, exercices et témoignages.
router.get('/rubriques/:slug', async (req, res) => {
  const rubrique = await contenus.getRubrique(req.params.slug);
  if (!rubrique) throw notFound('Rubrique introuvable.');
  res.json({ data: rubrique });
});

// Contenu complet d'un article publié.
router.get('/articles/:slug', async (req, res) => {
  const article = await contenus.getArticle(req.params.slug);
  if (!article) throw notFound('Article introuvable.');
  res.json({ data: article });
});

// Détail et configuration d'un exercice publié.
router.get('/exercices/:slug', async (req, res) => {
  const exercice = await contenus.getExercice(req.params.slug);
  if (!exercice) throw notFound('Exercice introuvable.');
  res.json({ data: exercice });
});

// Contacts d'urgence vérifiés pour un pays (Togo par défaut).
router.get('/urgence/contacts', validate(paysQuery, 'query'), async (req, res) => {
  res.json({ data: await contenus.listContactsUrgence(req.valid.query.pays) });
});

export default router;
