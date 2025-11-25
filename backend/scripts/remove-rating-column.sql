-- Script pour supprimer la colonne rating de la table company
-- ATTENTION: Cette opération supprimera définitivement toutes les données de rating

-- 1. Supprimer l'index sur la colonne rating (si il existe)
DROP INDEX IF EXISTS idx_company_rating;

-- 2. Supprimer la colonne rating
ALTER TABLE company DROP COLUMN IF EXISTS rating;

-- 3. Vérifier que la colonne a été supprimée
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'company' 
AND column_name = 'rating';
