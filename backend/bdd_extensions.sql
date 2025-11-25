-- ========================================
-- EXTENSION BACKEND POUR /my-applications
-- ========================================

-- 1. AJOUTER LES CHAMPS MANQUANTS À LA TABLE job_offer
ALTER TABLE job_offer 
ADD COLUMN IF NOT EXISTS urgency VARCHAR(10) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS benefits TEXT[],
ADD COLUMN IF NOT EXISTS requirements TEXT[],
ADD COLUMN IF NOT EXISTS education VARCHAR(255);

-- 2. AJOUTER LES CHAMPS MANQUANTS À LA TABLE company
ALTER TABLE company 
ADD COLUMN IF NOT EXISTS recruiter_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS recruiter_email VARCHAR(100);

-- 3. CRÉER UNE TABLE POUR LES DOCUMENTS DE CANDIDATURE
CREATE TABLE IF NOT EXISTS application_documents (
    id_document SERIAL PRIMARY KEY,
    id_user INT NOT NULL REFERENCES user_ (id_user) ON DELETE CASCADE,
    id_job_offer INT NOT NULL REFERENCES job_offer (id_job_offer) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('cv', 'cover_letter', 'portfolio')),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(id_user, id_job_offer, document_type)
);

-- 4. CRÉER UN INDEX POUR OPTIMISER LES REQUÊTES
CREATE INDEX IF NOT EXISTS idx_application_documents_user_job 
ON application_documents(id_user, id_job_offer);

-- 5. AJOUTER DES COMMENTAIRES POUR LA DOCUMENTATION
COMMENT ON COLUMN job_offer.urgency IS 'Niveau d''urgence du poste: low, medium, high';
COMMENT ON COLUMN job_offer.benefits IS 'Liste des avantages du poste';
COMMENT ON COLUMN job_offer.requirements IS 'Liste des compétences/exigences requises';
COMMENT ON COLUMN job_offer.education IS 'Niveau d''éducation requis';
COMMENT ON COLUMN company.recruiter_name IS 'Nom du recruteur principal';
COMMENT ON COLUMN company.recruiter_email IS 'Email du recruteur principal';
COMMENT ON TABLE application_documents IS 'Documents joints aux candidatures (CV, lettre de motivation, portfolio)';

-- 6. INSÉRER DES DONNÉES D'EXEMPLE (OPTIONNEL)
-- Vous pouvez décommenter ces lignes pour tester avec des données d'exemple

/*
-- Exemple d'ajout d'urgence à des offres existantes
UPDATE job_offer SET urgency = 'high' WHERE id_job_offer IN (1, 2);
UPDATE job_offer SET urgency = 'low' WHERE id_job_offer IN (3, 4);

-- Exemple d'ajout d'avantages
UPDATE job_offer SET benefits = ARRAY['Télétravail', 'Mutuelle', 'Tickets restaurant'] WHERE id_job_offer = 1;
UPDATE job_offer SET benefits = ARRAY['Équipe jeune', 'Formations', 'Stock options'] WHERE id_job_offer = 2;

-- Exemple d'ajout d'exigences
UPDATE job_offer SET requirements = ARRAY['React', 'TypeScript', 'CSS', 'Git'] WHERE id_job_offer = 1;
UPDATE job_offer SET requirements = ARRAY['Product Management', 'Agile', 'Analytics'] WHERE id_job_offer = 2;

-- Exemple d'ajout d'éducation
UPDATE job_offer SET education = 'Bac+3 minimum' WHERE id_job_offer = 1;
UPDATE job_offer SET education = 'Bac+5' WHERE id_job_offer = 2;
*/