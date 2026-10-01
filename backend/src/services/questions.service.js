import crypto from 'node:crypto';
import { query } from '../db/pool.js';

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 16;

// Génère un code de suivi lisible (sans caractères ambigus) au format XXXX-XXXX-XXXX-XXXX.
function generateCodeSuivi() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[crypto.randomInt(CODE_ALPHABET.length)];
  }
  return code.match(/.{4}/g).join('-');
}

// Calcule l'empreinte stockée en base d'un code de suivi, indépendamment des tirets et de la casse.
function hashCodeSuivi(code) {
  const normalized = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Liste les questions publiques validées par la modération, les plus récentes d'abord.
export async function listQuestionsPubliques({ page, parPage }) {
  const { rows } = await query(
    `SELECT id, contenu, pseudo, statut, reponse, repondu_le AS "reponduLe", cree_le AS "creeLe"
     FROM questions_publiques
     WHERE statut IN ('publiee', 'repondue')
     ORDER BY cree_le DESC
     LIMIT $1 OFFSET $2`,
    [parPage, (page - 1) * parPage],
  );
  return rows;
}

// Enregistre une question publique en attente de modération.
export async function createQuestionPublique({ contenu, pseudo }) {
  const { rows } = await query(
    `INSERT INTO questions_publiques (contenu, pseudo)
     VALUES ($1, $2)
     RETURNING id, statut, cree_le AS "creeLe"`,
    [contenu, pseudo ?? null],
  );
  return rows[0];
}

// Enregistre une question confidentielle et renvoie le code de suivi en clair, une seule fois.
export async function createQuestionConfidentielle({ contenu }) {
  const codeSuivi = generateCodeSuivi();
  const { rows } = await query(
    `INSERT INTO questions_confidentielles (contenu, code_suivi_hash)
     VALUES ($1, $2)
     RETURNING statut, cree_le AS "creeLe", expire_le AS "expireLe"`,
    [contenu, hashCodeSuivi(codeSuivi)],
  );
  return { ...rows[0], codeSuivi };
}

// Retrouve une question confidentielle non expirée à partir de son code de suivi, ou null.
export async function getQuestionConfidentielleParCode(code) {
  const { rows } = await query(
    `SELECT contenu, statut, reponse, repondu_le AS "reponduLe", cree_le AS "creeLe", expire_le AS "expireLe"
     FROM questions_confidentielles
     WHERE code_suivi_hash = $1 AND expire_le > now()`,
    [hashCodeSuivi(code)],
  );
  return rows[0] ?? null;
}
