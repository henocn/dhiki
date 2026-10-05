-- Demandes d'aide envoyées depuis la fenêtre « Urgence ».
-- « proche » : le jeune demande que l'équipe contacte une personne de confiance.
-- « inconnu » : alerte anonyme envoyée quand le jeune choisit de parler à un·e professionnel·le.
CREATE TABLE demandes_urgence (
  id               BIGSERIAL PRIMARY KEY,
  type             TEXT NOT NULL CHECK (type IN ('proche', 'inconnu')),
  prenom           TEXT CHECK (char_length(prenom) <= 40),
  proche_nom       TEXT CHECK (char_length(proche_nom) <= 80),
  proche_lien      TEXT CHECK (char_length(proche_lien) <= 40),
  proche_telephone TEXT CHECK (char_length(proche_telephone) <= 25),
  message          TEXT CHECK (char_length(message) <= 600),
  consentement_le  TIMESTAMPTZ,
  statut           TEXT NOT NULL DEFAULT 'nouvelle' CHECK (statut IN ('nouvelle', 'en_cours', 'traitee')),
  traite_par       INTEGER REFERENCES utilisateurs_backoffice (id) ON DELETE SET NULL,
  traite_le        TIMESTAMPTZ,
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT now(),
  expire_le        TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '30 days',
  CONSTRAINT demandes_urgence_proche_complet CHECK (
    type <> 'proche' OR (proche_nom IS NOT NULL AND proche_telephone IS NOT NULL AND consentement_le IS NOT NULL)
  )
);

CREATE INDEX demandes_urgence_statut_idx ON demandes_urgence (statut, cree_le DESC);
CREATE INDEX demandes_urgence_expire_idx ON demandes_urgence (expire_le);
