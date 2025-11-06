-- Script pour créer un administrateur
-- Remplacez les valeurs ci-dessous par vos propres informations

-- Option 1: Créer un admin avec un mot de passe hashé
-- Vous devez d'abord générer le hash du mot de passe avec bcrypt
-- Exemple de hash pour le mot de passe "admin123": $2a$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq

-- Option 2: Utiliser Node.js pour créer l'admin (recommandé)
-- Exécutez: node backend/scripts/create-admin.js

-- Option 3: Via l'interface admin (si vous avez déjà un admin)
-- POST /admin/users avec role: 'admin'

-- Exemple SQL direct (nécessite de hasher le mot de passe d'abord):
-- INSERT INTO user_ (email, password, firstname, lastname, role, phone)
-- VALUES (
--   'admin@linkup.com',
--   '$2a$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', -- Remplacez par votre hash
--   'Admin',
--   'User',
--   'admin',
--   '0123456789'
-- );

