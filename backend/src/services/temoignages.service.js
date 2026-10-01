import { query } from '../db/pool.js';

// Compose le libellé public de l'auteur (« Prénom, 20 ans · Ville ») à partir des champs facultatifs.
function buildAuteurLibelle({ prenom, age, ville }) {
  const nom = prenom || 'Anonyme';
  const ageTexte = age ? `, ${age} ans` : '';
  const villeTexte = ville ? ` · ${ville}` : '';
  return `${nom}${ageTexte}${villeTexte}`;
}

// Enregistre un témoignage de visiteur en brouillon : il ne sera visible qu'après modération.
export async function createTemoignageVisiteur({ rubrique, citation, prenom, age, ville }) {
  const { rows } = await query(
    `INSERT INTO temoignages (rubrique_id, citation, auteur_libelle, origine, consentement_donne_le, statut)
     SELECT r.id, $2, $3, 'visiteur', now(), 'brouillon'
     FROM rubriques r
     WHERE r.slug = $1 AND r.statut = 'publie'
     RETURNING statut, cree_le AS "creeLe"`,
    [rubrique, citation, buildAuteurLibelle({ prenom, age, ville })],
  );
  return rows[0] ?? null;
}
