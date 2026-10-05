-- Articles rédigés par les psychologues bénévoles depuis le back-office (éditeur de texte riche).
ALTER TABLE articles
  ADD COLUMN description TEXT CHECK (char_length(description) <= 300),
  ADD COLUMN nb_lectures INTEGER NOT NULL DEFAULT 0 CHECK (nb_lectures >= 0);

-- Titre affiché sous le nom de l'auteur·rice (ex. « Psychologue clinicienne »).
ALTER TABLE utilisateurs_backoffice
  ADD COLUMN titre_professionnel TEXT CHECK (char_length(titre_professionnel) <= 80);
