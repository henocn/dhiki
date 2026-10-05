-- Phrase d'accroche apaisante affichée sur les cartes de rubrique, et image d'illustration (facultative).
ALTER TABLE rubriques
  ADD COLUMN accroche  TEXT CHECK (char_length(accroche) <= 160),
  ADD COLUMN image_url TEXT CHECK (char_length(image_url) <= 500);
