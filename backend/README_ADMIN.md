# Guide de création d'un administrateur

Il existe **3 méthodes** pour créer un administrateur dans LinkUp :

## Méthode 1 : Script Node.js (Recommandé) ⭐

Le plus simple et le plus sûr. Utilisez le script fourni :

```bash
cd backend
node scripts/create-admin.js <email> <password> [firstname] [lastname]
```

**Exemple :**
```bash
node scripts/create-admin.js admin@linkup.com Admin123! Admin User
```

**Fonctionnalités :**
- ✅ Hash automatique du mot de passe avec bcrypt
- ✅ Vérifie si l'utilisateur existe déjà
- ✅ Peut promouvoir un utilisateur existant en admin
- ✅ Messages clairs de succès/erreur

## Méthode 2 : Variables d'environnement (Au démarrage du serveur)

Configurez les variables d'environnement dans votre fichier `.env` :

```env
CREATE_DEFAULT_ADMIN=true
DEFAULT_ADMIN_EMAIL=admin@linkup.com
DEFAULT_ADMIN_PASSWORD=VotreMotDePasseSecurise123!
DEFAULT_ADMIN_FIRSTNAME=Admin
DEFAULT_ADMIN_LASTNAME=User
DEFAULT_ADMIN_PHONE=0123456789
```

Puis redémarrez le serveur. L'admin sera créé automatiquement au démarrage.

**Note :** Cette méthode ne fonctionne qu'une seule fois. Si l'admin existe déjà, il ne sera pas recréé.

## Méthode 3 : Via l'interface admin (Si vous avez déjà un admin)

Si vous avez déjà un compte administrateur, vous pouvez créer d'autres admins via l'interface :

1. Connectez-vous en tant qu'admin
2. Allez dans `/admin-dashboard/users`
3. Cliquez sur "Créer un utilisateur"
4. Remplissez le formulaire avec `role: 'admin'`

**API Endpoint :**
```bash
POST /admin/users
Authorization: Bearer <token_admin>

{
  "email": "admin@linkup.com",
  "password": "MotDePasse123!",
  "firstname": "Admin",
  "lastname": "User",
  "role": "admin",
  "phone": "0123456789"
}
```

## Méthode 4 : Directement dans la base de données (Non recommandé)

⚠️ **Attention :** Cette méthode nécessite de hasher le mot de passe manuellement avec bcrypt.

```sql
-- Vous devez d'abord générer le hash du mot de passe
-- Utilisez Node.js pour cela :
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('votre_mot_de_passe', 10);

INSERT INTO user_ (email, password, firstname, lastname, role, phone)
VALUES (
  'admin@linkup.com',
  '$2a$10$VOTRE_HASH_BCRYPT_ICI', -- ⚠️ Remplacez par le hash réel
  'Admin',
  'User',
  'admin',
  '0123456789'
);
```

## Recommandation

**Utilisez la Méthode 1 (script Node.js)** car elle est :
- ✅ Simple à utiliser
- ✅ Sécurisée (hash automatique)
- ✅ Vérifie les doublons
- ✅ Peut promouvoir des utilisateurs existants

## Vérifier qu'un utilisateur est admin

```sql
SELECT id_user, email, firstname, lastname, role 
FROM user_ 
WHERE role = 'admin';
```

## Promouvoir un utilisateur existant en admin

```sql
UPDATE user_ 
SET role = 'admin' 
WHERE email = 'utilisateur@example.com';
```

Ou utilisez le script :
```bash
node scripts/create-admin.js utilisateur@example.com NouveauMotDePasse
```

Le script détectera que l'utilisateur existe et le promouvra en admin.

