import { query } from '../db/pool.js';

// Liste les rubriques publiées avec le nombre d'articles et d'exercices publiés.
export async function listRubriques() {
  const { rows } = await query(`
    SELECT r.slug, r.nom, r.introduction,
           r.couleur_fond AS "couleurFond", r.couleur_trait AS "couleurTrait", r.icone_svg AS "iconeSvg",
           (SELECT count(*) FROM articles a WHERE a.rubrique_id = r.id AND a.statut = 'publie')::int AS "nbArticles",
           (SELECT count(*) FROM exercices e WHERE e.rubrique_id = r.id AND e.statut = 'publie')::int AS "nbExercices"
    FROM rubriques r
    WHERE r.statut = 'publie'
    ORDER BY r.ordre, r.nom
  `);
  return rows;
}

// Renvoie une rubrique publiée avec ses articles, exercices et témoignages publiés, ou null.
export async function getRubrique(slug) {
  const { rows } = await query(
    `SELECT r.id, r.slug, r.nom, r.introduction,
            r.couleur_fond AS "couleurFond", r.couleur_trait AS "couleurTrait", r.icone_svg AS "iconeSvg"
     FROM rubriques r
     WHERE r.slug = $1 AND r.statut = 'publie'`,
    [slug],
  );
  const rubrique = rows[0];
  if (!rubrique) return null;

  const [articles, exercices, temoignages] = await Promise.all([
    query(
      `SELECT slug, titre, duree_lecture_min AS "dureeLectureMin"
       FROM articles WHERE rubrique_id = $1 AND statut = 'publie' ORDER BY ordre, titre`,
      [rubrique.id],
    ),
    query(
      `SELECT slug, type, titre, meta, description
       FROM exercices WHERE rubrique_id = $1 AND statut = 'publie' ORDER BY ordre, titre`,
      [rubrique.id],
    ),
    query(
      `SELECT citation, auteur_libelle AS "auteurLibelle"
       FROM temoignages WHERE rubrique_id = $1 AND statut = 'publie' ORDER BY ordre`,
      [rubrique.id],
    ),
  ]);

  const { id: _id, ...publicRubrique } = rubrique;
  return { ...publicRubrique, articles: articles.rows, exercices: exercices.rows, temoignages: temoignages.rows };
}

// Renvoie un article publié et sa rubrique, ou null.
export async function getArticle(slug) {
  const { rows } = await query(
    `SELECT a.slug, a.titre, a.duree_lecture_min AS "dureeLectureMin", a.corps_html AS "corpsHtml",
            a.publie_le AS "publieLe", json_build_object('slug', r.slug, 'nom', r.nom) AS rubrique
     FROM articles a
     JOIN rubriques r ON r.id = a.rubrique_id
     WHERE a.slug = $1 AND a.statut = 'publie' AND r.statut = 'publie'`,
    [slug],
  );
  return rows[0] ?? null;
}

// Renvoie un exercice publié avec sa configuration, ou null.
export async function getExercice(slug) {
  const { rows } = await query(
    `SELECT e.slug, e.type, e.titre, e.meta, e.description, e.config,
            CASE WHEN r.id IS NULL THEN NULL ELSE json_build_object('slug', r.slug, 'nom', r.nom) END AS rubrique
     FROM exercices e
     LEFT JOIN rubriques r ON r.id = e.rubrique_id
     WHERE e.slug = $1 AND e.statut = 'publie'`,
    [slug],
  );
  return rows[0] ?? null;
}

// Liste les contacts d'urgence actifs et vérifiés d'un pays.
export async function listContactsUrgence(codePays) {
  const { rows } = await query(
    `SELECT id, ville, nom, description, telephone, lien
     FROM contacts_urgence
     WHERE code_pays = $1 AND actif AND verifie
     ORDER BY ordre, nom`,
    [codePays],
  );
  return rows;
}
