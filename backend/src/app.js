import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
import contenusRoutes from './routes/contenus.routes.js';
import questionsRoutes from './routes/questions.routes.js';
import santeRoutes from './routes/sante.routes.js';
import temoignagesRoutes from './routes/temoignages.routes.js';
import urgenceRoutes from './routes/urgence.routes.js';

const allowedOrigins = new Set([env.FRONTEND_ORIGIN, env.BACKOFFICE_ORIGIN]);

// Construit l'application Express avec la sécurité de base et les routes publiques.
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '20kb' }));

  if (env.NODE_ENV === 'development') {
    // Journalise méthode, chemin (sans query string) et statut, jamais le corps des requêtes.
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => console.log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`));
      next();
    });
  }

  app.use(
    '/api',
    rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }),
  );

  app.use('/api/sante', santeRoutes);
  app.use('/api', contenusRoutes);
  app.use('/api/questions', questionsRoutes);
  app.use('/api/temoignages', temoignagesRoutes);
  app.use('/api/urgence', urgenceRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
