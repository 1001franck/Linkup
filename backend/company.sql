-- ========================================
-- ENRICHISSEMENT TABLE COMPANY POUR /companies
-- ========================================

-- 1. AJOUTER LE CHAMP RATING (note de l'entreprise)
ALTER TABLE company 
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.0 
CHECK (rating >= 0 AND rating <= 5);

-- 2. AJOUTER LE CHAMP BENEFITS (avantages proposés)
ALTER TABLE company 
ADD COLUMN IF NOT EXISTS benefits TEXT[];

-- 3. AJOUTER DES COMMENTAIRES POUR LA DOCUMENTATION
COMMENT ON COLUMN company.rating IS 'Note de l''entreprise (0.0 à 5.0)';
COMMENT ON COLUMN company.benefits IS 'Liste des avantages proposés par l''entreprise';

-- 4. OPTIONNEL: AJOUTER UN INDEX POUR LE RATING (pour les tris)
CREATE INDEX IF NOT EXISTS idx_company_rating ON company(rating);