import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

dotenv.config({ path: path.join(backendRoot, '.env'), quiet: true });

const booleanString = z
  .enum(['true', 'false'])
  .optional()
  .transform((value) => value === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).optional().transform((v) => v ?? 'development'),
  PORT: z.coerce.number().int().positive().optional().transform((v) => v ?? 4000),

  FRONTEND_ORIGIN: z.url(),
  BACKOFFICE_ORIGIN: z.url(),

  PGHOST: z.string().min(1),
  PGPORT: z.coerce.number().int().positive().optional().transform((v) => v ?? 5432),
  PGDATABASE: z.string().min(1),
  PGUSER: z.string().min(1),
  PGPASSWORD: z.string().min(1),
  PGSSL: booleanString,
  PGPOOL_MAX: z.coerce.number().int().positive().optional().transform((v) => v ?? 10),
  PGIDLE_TIMEOUT_MS: z.coerce.number().int().nonnegative().optional().transform((v) => v ?? 30000),
  PGCONNECTION_TIMEOUT_MS: z.coerce.number().int().nonnegative().optional().transform((v) => v ?? 2000),

  SESSION_SECRET: z.string().min(16),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional().transform((v) => v ?? 587),
  SMTP_SECURE: booleanString,
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional().transform((v) => v || 'DHIKI <no-reply@dhiki.space>'),
  ALERTE_EMAIL: z.string().optional(),
});

// Valide les variables d'environnement et arrête le processus avec un message clair si elles sont invalides.
function loadEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    console.error(`Configuration invalide dans backend/.env :\n${details}`);
    process.exit(1);
  }

  const env = result.data;

  if (env.NODE_ENV === 'production') {
    const weakSecret = env.SESSION_SECRET.length < 32 || /replace|change_me|dev_only/i.test(env.SESSION_SECRET);
    if (weakSecret) {
      console.error('SESSION_SECRET doit être une valeur aléatoire d\'au moins 32 caractères en production.');
      process.exit(1);
    }
  }

  return Object.freeze(env);
}

export const env = loadEnv();
