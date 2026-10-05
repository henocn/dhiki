import { query } from '../db/pool.js';
import { envoyerAlerteEquipe } from './mail.service.js';

// Construit le texte de l'email d'alerte envoyé à l'équipe.
function texteAlerte(d) {
  if (d.type === 'inconnu') {
    return [
      `Demande n° ${d.id} — ${d.creeLe.toISOString()}`,
      '',
      'Un·e visiteur·se a ouvert l’aide d’urgence et choisi de parler à un·e professionnel·le.',
      'Le numéro du professionnel lui a été affiché. Aucune donnée personnelle n’a été collectée.',
      'Merci de vous assurer que la ligne est joignable en ce moment.',
    ].join('\n');
  }
  return [
    `Demande n° ${d.id} — ${d.creeLe.toISOString()}`,
    '',
    'Un·e jeune demande que l’équipe contacte une personne de confiance pour la mettre en relation, avec douceur.',
    '',
    `Prénom du jeune : ${d.prenom ?? 'non précisé'}`,
    `Personne à contacter : ${d.procheNom}${d.procheLien ? ` (${d.procheLien})` : ''}`,
    `Téléphone : ${d.procheTelephone}`,
    d.message ? `Message du jeune : ${d.message}` : 'Pas de message.',
    '',
    'Ces données sont supprimées automatiquement 30 jours après la demande.',
  ].join('\n');
}

// Enregistre une demande d'aide puis prévient l'équipe par email, sans faire attendre le visiteur.
export async function createDemandeUrgence(body) {
  const proche = body.type === 'proche';
  const { rows } = await query(
    `INSERT INTO demandes_urgence (type, prenom, proche_nom, proche_lien, proche_telephone, message, consentement_le)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, type, cree_le`,
    [
      body.type,
      proche ? (body.prenom ?? null) : null,
      proche ? body.procheNom : null,
      proche ? (body.procheLien ?? null) : null,
      proche ? body.procheTelephone : null,
      proche ? (body.message ?? null) : null,
      proche ? new Date() : null,
    ],
  );

  const demande = { ...body, id: rows[0].id, creeLe: rows[0].cree_le };
  const sujet = proche ? `[DHIKI] Mise en relation demandée (n° ${demande.id})` : `[DHIKI] Alerte urgence anonyme (n° ${demande.id})`;
  envoyerAlerteEquipe(sujet, texteAlerte(demande)).catch((error) => console.error('Échec de l’email d’alerte :', error.message));

  return { id: demande.id, type: demande.type };
}
