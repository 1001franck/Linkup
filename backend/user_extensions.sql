-- Ajout des 6 colonnes manquantes
ALTER TABLE user_ ADD COLUMN description TEXT;                    -- Description détaillée
ALTER TABLE user_ ADD COLUMN skills TEXT[];                       -- Compétences (array)
ALTER TABLE user_ ADD COLUMN job_title VARCHAR(100);              -- Titre du poste
ALTER TABLE user_ ADD COLUMN experience_level VARCHAR(20);        -- Niveau d'expérience
ALTER TABLE user_ ADD COLUMN availability BOOLEAN DEFAULT false;  -- Disponibilité
ALTER TABLE user_ ADD COLUMN portfolio_link VARCHAR(255);         -- Lien portfolio
ALTER TABLE user_ ADD COLUMN linkedin_link VARCHAR(255);          -- Lien LinkedIn