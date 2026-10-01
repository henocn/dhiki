import { Router } from 'express';
import { query } from '../db/pool.js';

const router = Router();

// Indique si l'API et la base répondent, sans divulguer d'information de configuration.
router.get('/', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ data: { statut: 'ok', base: 'ok' } });
  } catch {
    res.status(503).json({ data: { statut: 'degrade', base: 'indisponible' } });
  }
});

export default router;
