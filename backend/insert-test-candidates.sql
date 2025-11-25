-- Script SQL pour créer des candidatures de test
-- À exécuter dans votre base de données Supabase

-- 1. Vérifier les données existantes
SELECT 'Entreprises:' as info;
SELECT id_company, name FROM company LIMIT 3;

SELECT 'Offres d\'emploi:' as info;
SELECT id_job_offer, title, id_company FROM job_offer LIMIT 5;

SELECT 'Utilisateurs:' as info;
SELECT id_user, firstname, lastname, email FROM user_ LIMIT 5;

SELECT 'Candidatures existantes:' as info;
SELECT a.id_user, a.id_job_offer, a.status, a.application_date, u.firstname, u.lastname, j.title
FROM apply a
JOIN user_ u ON a.id_user = u.id_user
JOIN job_offer j ON a.id_job_offer = j.id_job_offer
LIMIT 10;

-- 2. Insérer des candidatures de test (remplacez les IDs par les vrais)
-- Exemple d'insertion (à adapter selon vos données) :

/*
INSERT INTO apply (id_user, id_job_offer, status, application_date)
VALUES 
  (1, 1, 'pending', NOW() - INTERVAL '1 day'),
  (2, 1, 'interview', NOW() - INTERVAL '2 days'),
  (3, 1, 'accepted', NOW() - INTERVAL '3 days');
*/

-- 3. Vérifier les candidatures après insertion
SELECT 'Candidatures après insertion:' as info;
SELECT a.id_user, a.id_job_offer, a.status, a.application_date, u.firstname, u.lastname, j.title
FROM apply a
JOIN user_ u ON a.id_user = u.id_user
JOIN job_offer j ON a.id_job_offer = j.id_job_offer
ORDER BY a.application_date DESC
LIMIT 10;
