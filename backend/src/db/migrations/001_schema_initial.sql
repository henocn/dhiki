-- Schéma initial DHIKI : contenus publics, questions, backoffice, urgence et audit.

CREATE DOMAIN statut_publication AS TEXT
  CHECK (VALUE IN ('brouillon', 'relecture', 'publie', 'archive'));

-- Met à jour automatiquement la colonne modifie_le à chaque modification de ligne.
CREATE FUNCTION maj_modifie_le() RETURNS trigger AS $$
BEGIN
  NEW.modifie_le = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── Backoffice ──────────────────────────────────────────────

CREATE TABLE utilisateurs_backoffice (
  id                     SERIAL PRIMARY KEY,
  email                  TEXT NOT NULL,
  nom_affiche            TEXT NOT NULL,
  mot_de_passe_hash      TEXT NOT NULL,
  role                   TEXT NOT NULL CHECK (role IN ('admin', 'editeur', 'moderateur', 'professionnel')),
  actif                  BOOLEAN NOT NULL DEFAULT true,
  derniere_connexion_le  TIMESTAMPTZ,
  cree_le                TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le             TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX utilisateurs_backoffice_email_unique ON utilisateurs_backoffice (lower(email));


-- ── Contenus ────────────────────────────────────────────────

CREATE TABLE rubriques (
  id             SERIAL PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  nom            TEXT NOT NULL,
  introduction   TEXT NOT NULL,
  couleur_fond   TEXT NOT NULL,
  couleur_trait  TEXT NOT NULL,
  icone_svg      TEXT NOT NULL,
  ordre          INTEGER NOT NULL DEFAULT 0,
  statut         statut_publication NOT NULL DEFAULT 'brouillon',
  cree_le        TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE articles (
  id                 SERIAL PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,
  rubrique_id        INTEGER NOT NULL REFERENCES rubriques (id) ON DELETE RESTRICT,
  titre              TEXT NOT NULL,
  duree_lecture_min  SMALLINT CHECK (duree_lecture_min > 0),
  corps_html         TEXT NOT NULL,
  ordre              INTEGER NOT NULL DEFAULT 0,
  statut             statut_publication NOT NULL DEFAULT 'brouillon',
  publie_le          TIMESTAMPTZ,
  auteur_id          INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  cree_le            TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX articles_rubrique_statut_idx ON articles (rubrique_id, statut, ordre);

-- rubrique_id est facultatif : certains exercices (ex. respiration d'urgence) ne dépendent d'aucune rubrique.
CREATE TABLE exercices (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  rubrique_id  INTEGER REFERENCES rubriques (id) ON DELETE RESTRICT,
  type         TEXT NOT NULL CHECK (type IN (
                 'respiration', 'journal', 'ancrage', 'scan', 'valeurs',
                 'ecriture', 'ecoute', 'limites', 'pomodoro'
               )),
  titre        TEXT NOT NULL,
  meta         TEXT,
  description  TEXT,
  config       JSONB NOT NULL DEFAULT '{}'::jsonb,
  ordre        INTEGER NOT NULL DEFAULT 0,
  statut       statut_publication NOT NULL DEFAULT 'brouillon',
  cree_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX exercices_rubrique_statut_idx ON exercices (rubrique_id, statut, ordre);

CREATE TABLE temoignages (
  id                    SERIAL PRIMARY KEY,
  rubrique_id           INTEGER NOT NULL REFERENCES rubriques (id) ON DELETE CASCADE,
  citation              TEXT NOT NULL,
  auteur_libelle        TEXT NOT NULL,
  consentement_verifie  BOOLEAN NOT NULL DEFAULT false,
  ordre                 INTEGER NOT NULL DEFAULT 0,
  statut                statut_publication NOT NULL DEFAULT 'brouillon',
  cree_le               TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX temoignages_rubrique_statut_idx ON temoignages (rubrique_id, statut, ordre);


-- ── Questions (tables séparées : aucun accès croisé public/confidentiel) ──

-- Une question publique n'est visible qu'après modération (statut 'publiee' ou 'repondue').
CREATE TABLE questions_publiques (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contenu      TEXT NOT NULL CHECK (char_length(contenu) BETWEEN 10 AND 2000),
  pseudo       TEXT CHECK (pseudo IS NULL OR char_length(pseudo) BETWEEN 2 AND 40),
  statut       TEXT NOT NULL DEFAULT 'en_attente'
                 CHECK (statut IN ('en_attente', 'publiee', 'repondue', 'rejetee')),
  reponse      TEXT,
  repondu_par  INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  repondu_le   TIMESTAMPTZ,
  modere_par   INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  modere_le    TIMESTAMPTZ,
  cree_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (statut <> 'repondue' OR reponse IS NOT NULL)
);
CREATE INDEX questions_publiques_statut_idx ON questions_publiques (statut, cree_le DESC);

-- Le code de suivi n'est jamais stocké en clair : seule son empreinte SHA-256 est conservée.
CREATE TABLE questions_confidentielles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contenu          TEXT NOT NULL CHECK (char_length(contenu) BETWEEN 10 AND 2000),
  code_suivi_hash  TEXT NOT NULL UNIQUE,
  statut           TEXT NOT NULL DEFAULT 'en_attente'
                     CHECK (statut IN ('en_attente', 'attribuee', 'repondue', 'close')),
  attribuee_a      INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  reponse          TEXT,
  repondu_par      INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  repondu_le       TIMESTAMPTZ,
  expire_le        TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '90 days'),
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (statut <> 'repondue' OR reponse IS NOT NULL)
);
CREATE INDEX questions_confidentielles_statut_idx ON questions_confidentielles (statut, cree_le);
CREATE INDEX questions_confidentielles_expiration_idx ON questions_confidentielles (expire_le);


-- ── Urgence ─────────────────────────────────────────────────

-- Seuls les contacts vérifiés sont exposés publiquement.
CREATE TABLE contacts_urgence (
  id           SERIAL PRIMARY KEY,
  code_pays    CHAR(2) NOT NULL DEFAULT 'TG',
  ville        TEXT,
  nom          TEXT NOT NULL,
  description  TEXT,
  telephone    TEXT,
  lien         TEXT,
  verifie      BOOLEAN NOT NULL DEFAULT false,
  verifie_le   TIMESTAMPTZ,
  actif        BOOLEAN NOT NULL DEFAULT true,
  ordre        INTEGER NOT NULL DEFAULT 0,
  cree_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  modifie_le   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (telephone IS NOT NULL OR lien IS NOT NULL)
);
CREATE INDEX contacts_urgence_pays_idx ON contacts_urgence (code_pays, actif, verifie, ordre);


-- ── Audit ───────────────────────────────────────────────────

-- Ne jamais écrire le contenu d'une question confidentielle dans details.
CREATE TABLE journal_audit (
  id              BIGSERIAL PRIMARY KEY,
  utilisateur_id  INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  entite          TEXT NOT NULL,
  entite_id       TEXT,
  details         JSONB NOT NULL DEFAULT '{}'::jsonb,
  cree_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX journal_audit_cree_le_idx ON journal_audit (cree_le DESC);
CREATE INDEX journal_audit_entite_idx ON journal_audit (entite, entite_id);


-- ── Triggers modifie_le ─────────────────────────────────────

CREATE TRIGGER utilisateurs_backoffice_modifie_le BEFORE UPDATE ON utilisateurs_backoffice FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
CREATE TRIGGER rubriques_modifie_le BEFORE UPDATE ON rubriques FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
CREATE TRIGGER articles_modifie_le BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
CREATE TRIGGER exercices_modifie_le BEFORE UPDATE ON exercices FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
CREATE TRIGGER temoignages_modifie_le BEFORE UPDATE ON temoignages FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
CREATE TRIGGER questions_publiques_modifie_le BEFORE UPDATE ON questions_publiques FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
CREATE TRIGGER questions_confidentielles_modifie_le BEFORE UPDATE ON questions_confidentielles FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
CREATE TRIGGER contacts_urgence_modifie_le BEFORE UPDATE ON contacts_urgence FOR EACH ROW EXECUTE FUNCTION maj_modifie_le();
