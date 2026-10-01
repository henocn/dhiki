import { query } from '../db/pool.js';

const INTERVALLE_MS = 6 * 60 * 60 * 1000;

// Supprime définitivement les questions confidentielles dont la date d'expiration est dépassée.
export async function purgerQuestionsExpirees() {
  const { rowCount } = await query('DELETE FROM questions_confidentielles WHERE expire_le <= now()');
  if (rowCount > 0) console.log(`Purge : ${rowCount} question(s) confidentielle(s) expirée(s) supprimée(s).`);
  return rowCount;
}

// Lance la purge au démarrage puis toutes les 6 heures ; renvoie une fonction d'arrêt.
export function demarrerPurgePeriodique() {
  // Exécute une purge en journalisant l'erreur éventuelle sans arrêter le serveur.
  const executer = () => purgerQuestionsExpirees().catch((error) => console.error('Échec de la purge :', error.message));
  executer();
  const id = setInterval(executer, INTERVALLE_MS);
  id.unref();
  return () => clearInterval(id);
}
