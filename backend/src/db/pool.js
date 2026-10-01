import pg from 'pg';
import { env } from '../config/env.js';

export const pool = new pg.Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  database: env.PGDATABASE,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  ssl: env.PGSSL ? { rejectUnauthorized: true } : false,
  max: env.PGPOOL_MAX,
  idleTimeoutMillis: env.PGIDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.PGCONNECTION_TIMEOUT_MS,
});

pool.on('error', (error) => {
  console.error('Erreur inattendue sur une connexion PostgreSQL inactive :', error.message);
});

// Exécute une requête SQL paramétrée sur le pool partagé.
export function query(text, params) {
  return pool.query(text, params);
}

// Exécute une fonction dans une transaction et annule tout en cas d'erreur.
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
