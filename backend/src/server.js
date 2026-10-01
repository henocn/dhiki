import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';
import { demarrerPurgePeriodique } from './jobs/purge.js';

const server = createApp().listen(env.PORT, () => {
  console.log(`API DHIKI démarrée sur http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

const arreterPurge = demarrerPurgePeriodique();

// Arrête proprement la purge, le serveur HTTP puis le pool PostgreSQL.
function shutdown(signal) {
  console.log(`${signal} reçu, arrêt en cours…`);
  arreterPurge();
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
