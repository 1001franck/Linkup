-- Ajout du champ founded_year pour la date de fondation réelle de l'entreprise
ALTER TABLE company ADD COLUMN IF NOT EXISTS founded_year INTEGER;

-- Commentaire pour documenter le champ
COMMENT ON COLUMN company.founded_year IS 'Année de fondation réelle de l''entreprise (renseignée par l''entreprise elle-même)';

