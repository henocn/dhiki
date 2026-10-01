import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const migrationsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

// Applique dans l'ordre, chacune dans sa transaction, les migrations SQL pas encore exécutées.
async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      nom         TEXT PRIMARY KEY,
      applique_le TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query('SELECT nom FROM schema_migrations');
  const applied = new Set(rows.map((row) => row.nom));
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();
  const pending = files.filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log('Base à jour, aucune migration à appliquer.');
    return;
  }

  for (const file of pending) {
    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (nom) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`Migration appliquée : ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Échec de la migration ${file} : ${error.message}`);
    } finally {
      client.release();
    }
  }
}

migrate()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
