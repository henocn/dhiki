import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transport = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    })
  : null;

// Envoie une alerte à l'équipe ; sans SMTP configuré, se contente d'un avertissement dans la console.
export async function envoyerAlerteEquipe(sujet, texte) {
  if (!transport || !env.ALERTE_EMAIL) {
    console.warn(`[alerte non envoyée : SMTP_HOST ou ALERTE_EMAIL absent] ${sujet}`);
    return false;
  }
  await transport.sendMail({ from: env.MAIL_FROM, to: env.ALERTE_EMAIL, subject: sujet, text: texte });
  return true;
}
