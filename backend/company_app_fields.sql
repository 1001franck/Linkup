-- Logo entreprise
ALTER TABLE company ADD COLUMN logo VARCHAR(255);

-- Notes candidature
ALTER TABLE apply ADD COLUMN notes TEXT;

-- Date d'entretien
ALTER TABLE apply ADD COLUMN interview_date TIMESTAMP;

-- Candidature archivée
ALTER TABLE apply ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;