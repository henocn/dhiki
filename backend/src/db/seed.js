import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { pool, withTransaction } from './pool.js';

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'seed-data');

// Lit un fichier JSON du dossier seed-data.
async function readData(file) {
  return JSON.parse(await fs.readFile(path.join(dataDir, file), 'utf8'));
}

// Insère ou met à jour les rubriques et renvoie la correspondance slug → id.
async function seedRubriques(client, rubriques) {
  const ids = new Map();
  for (const r of rubriques) {
    const { rows } = await client.query(
      `INSERT INTO rubriques (slug, nom, introduction, couleur_fond, couleur_trait, icone_svg, ordre, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'publie')
       ON CONFLICT (slug) DO UPDATE SET
         nom = EXCLUDED.nom, introduction = EXCLUDED.introduction, couleur_fond = EXCLUDED.couleur_fond,
         couleur_trait = EXCLUDED.couleur_trait, icone_svg = EXCLUDED.icone_svg, ordre = EXCLUDED.ordre
       RETURNING id`,
      [r.slug, r.nom, r.introduction, r.couleurFond, r.couleurTrait, r.iconeSvg, r.ordre],
    );
    ids.set(r.slug, rows[0].id);
  }
  return ids;
}

// Insère ou met à jour les articles rattachés à leur rubrique.
async function seedArticles(client, articles, rubriqueIds) {
  for (const a of articles) {
    await client.query(
      `INSERT INTO articles (slug, rubrique_id, titre, duree_lecture_min, corps_html, ordre, statut, publie_le)
       VALUES ($1, $2, $3, $4, $5, $6, 'publie', now())
       ON CONFLICT (slug) DO UPDATE SET
         rubrique_id = EXCLUDED.rubrique_id, titre = EXCLUDED.titre, duree_lecture_min = EXCLUDED.duree_lecture_min,
         corps_html = EXCLUDED.corps_html, ordre = EXCLUDED.ordre`,
      [a.slug, rubriqueIds.get(a.rubrique), a.titre, a.dureeLectureMin, a.corpsHtml, a.ordre],
    );
  }
}

// Insère ou met à jour les exercices et leur configuration.
async function seedExercices(client, exercices, rubriqueIds) {
  for (const e of exercices) {
    await client.query(
      `INSERT INTO exercices (slug, rubrique_id, type, titre, meta, description, config, ordre, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'publie')
       ON CONFLICT (slug) DO UPDATE SET
         rubrique_id = EXCLUDED.rubrique_id, type = EXCLUDED.type, titre = EXCLUDED.titre, meta = EXCLUDED.meta,
         description = EXCLUDED.description, config = EXCLUDED.config, ordre = EXCLUDED.ordre`,
      [e.slug, e.rubrique ? rubriqueIds.get(e.rubrique) : null, e.type, e.titre, e.meta, e.description, e.config, e.ordre],
    );
  }
}

// Remplace les témoignages d'exemple de l'équipe (les dépôts des visiteurs ne sont jamais touchés).
async function seedTemoignages(client, temoignages, rubriqueIds) {
  await client.query("DELETE FROM temoignages WHERE origine = 'equipe' AND consentement_verifie = false");
  for (const t of temoignages) {
    await client.query(
      `INSERT INTO temoignages (rubrique_id, citation, auteur_libelle, ordre, statut)
       VALUES ($1, $2, $3, $4, 'publie')`,
      [rubriqueIds.get(t.rubrique), t.citation, t.auteurLibelle, t.ordre],
    );
  }
}

// Remplace les contacts d'urgence non vérifiés par ceux du jeu de données.
async function seedContactsUrgence(client, contacts) {
  await client.query('DELETE FROM contacts_urgence WHERE verifie = false');
  for (const c of contacts) {
    await client.query(
      `INSERT INTO contacts_urgence (code_pays, ville, nom, description, telephone, verifie, ordre)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [c.codePays, c.ville, c.nom, c.description, c.telephone, c.verifie, c.ordre],
    );
  }
}

// Charge le jeu de données de développement extrait du prototype.
async function seed() {
  if (env.NODE_ENV === 'production') {
    throw new Error('Le seed de développement ne doit pas être exécuté en production.');
  }

  const [rubriques, articles, exercices, temoignages, contacts] = await Promise.all([
    readData('rubriques.json'),
    readData('articles.json'),
    readData('exercices.json'),
    readData('temoignages.json'),
    readData('contacts-urgence.json'),
  ]);

  await withTransaction(async (client) => {
    const rubriqueIds = await seedRubriques(client, rubriques);
    await seedArticles(client, articles, rubriqueIds);
    await seedExercices(client, exercices, rubriqueIds);
    await seedTemoignages(client, temoignages, rubriqueIds);
    await seedContactsUrgence(client, contacts);
  });

  console.log(
    `Seed terminé : ${rubriques.length} rubriques, ${articles.length} articles, ` +
      `${exercices.length} exercices, ${temoignages.length} témoignages, ${contacts.length} contact(s) d'urgence.`,
  );
}

seed()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
