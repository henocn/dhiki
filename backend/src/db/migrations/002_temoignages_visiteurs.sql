-- Témoignages déposés par les visiteurs : origine, date de consentement, modération.

ALTER TABLE temoignages
  ADD COLUMN origine TEXT NOT NULL DEFAULT 'equipe' CHECK (origine IN ('equipe', 'visiteur')),
  ADD COLUMN consentement_donne_le TIMESTAMPTZ,
  ADD COLUMN modere_par INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  ADD COLUMN modere_le TIMESTAMPTZ,
  ADD CONSTRAINT temoignages_citation_longueur CHECK (char_length(citation) BETWEEN 20 AND 1200),
  ADD CONSTRAINT temoignages_visiteur_consentement CHECK (origine <> 'visiteur' OR consentement_donne_le IS NOT NULL);

CREATE INDEX temoignages_moderation_idx ON temoignages (origine, statut, cree_le DESC);
