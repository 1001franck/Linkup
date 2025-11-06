# 🚀 Guide de Démarrage - Plateforme de Recrutement

## 📋 Vue d'ensemble du projet

Notre équipe développe une plateforme de recrutement similaire à Indeed ou Welcome to the Jungle avec :

- **Backend/API** (Yousra) : Node.js + Express
- **Frontend** (Frank) : À développer
- **Base de données** (Sara) : PostgreSQL

## 🗄️ Base de données Supabase

L'API est maintenant entièrement connectée à Supabase avec :
- `user_` - Utilisateurs (candidats, recruteurs, admins)
- `company` - Entreprises
- `job_offer` - Offres d'emploi
- `apply` - Candidatures
- `message` - Messagerie
- `filter_` - Filtres de recherche (table manquante dans le schéma actuel)

## 🛠️ API Développée

### ✅ Fonctionnalités implémentées

1. **Authentification complète**
   - Inscription/Connexion avec cookies sécurisés
   - Gestion des rôles (user, admin, company)
   - Middleware d'authentification
   - Déconnexion avec révocation de tokens
   - Suppression de comptes (users/companies)

2. **Gestion des utilisateurs et entreprises**
   - Profil utilisateur (GET/PUT/DELETE /users/me)
   - Profil entreprise (GET/PUT/DELETE /companies/me)
   - Adaptation au schéma (firstname, lastname, phone)
   - Suppression de comptes avec nettoyage des cookies

3. **Système d'offres d'emploi**
   - CRUD complet
   - Recherche et filtrage
   - Gestion des vues
   - Association avec les entreprises

4. **Gestion des entreprises**
   - CRUD complet
   - Recherche par nom/description

5. **Système de candidatures**
   - Postuler aux offres
   - Suivi des candidatures
   - Gestion des statuts
   - Statistiques

6. **Messagerie**
   - Envoi de messages
   - Conversations
   - Marquer comme lu

7. **Système de filtres**
   - Filtres prédéfinis
   - Gestion admin

8. **Upload de fichiers**
   - Upload CV/Photos avec Supabase Storage
   - Gestion des fichiers utilisateurs
   - Suppression sécurisée des fichiers

9. **Administration**
   - Dashboard admin
   - Gestion des utilisateurs/entreprises
   - Système de bannissement
   - Statistiques complètes

### 📁 Structure des fichiers

```
backend/
├── src/
│   ├── app.js                 # Configuration Express + cookies
│   ├── server.js             # Point d'entrée
│   ├── database/
│   │   └── db.js            # Configuration Supabase
│   ├── middlewares/
│   │   └── auth.js          # Middleware d'authentification
│   ├── routes/              # Toutes les routes API
│   │   ├── auth.users.routes.js
│   │   ├── auth.companies.routes.js
│   │   ├── users.routes.js
│   │   ├── companies.routes.js
│   │   ├── jobs.routes.js
│   │   ├── applications.routes.js
│   │   ├── messages.routes.js
│   │   ├── filters.routes.js
│   │   ├── userFiles.routes.js
│   │   ├── jobSave.routes.js
│   │   ├── stats.routes.js
│   │   └── admin.routes.js
│   ├── services/            # Logique métier
│   │   ├── userStore.js
│   │   ├── companyStore.js
│   │   ├── jobStore.js
│   │   ├── applicationStore.js
│   │   ├── messageStore.js
│   │   ├── filterStore.js
│   │   ├── userFilesStore.js
│   │   ├── jobSaveStore.js
│   │   ├── statsStore.js
│   │   ├── adminStore.js
│   │   └── tokenRevokeStore.js
│   └── types/               # Déclarations TypeScript
│       └── module.d.ts
├── bdd.sql                  # Schéma de base de données
├── test.js                  # Tests de l'API
├── test-hybrid-auth.js      # Tests d'authentification
├── package.json
└── API_DOCUMENTATION.md     # Documentation complète
```

## 🚀 Démarrage rapide

### 1. Installation
```bash
cd backend
npm install
```

### 2. Configuration
Créez un fichier `.env` dans le dossier `backend/` :
```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-anon-key-ici
SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key-ici
SUPABASE_BUCKET=user_files
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3000
```

### 3. Lancement
```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000`

### 4. Test
```bash
# Health check
curl http://localhost:3000/health

# Inscription utilisateur
curl -X POST http://localhost:3000/auth/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstname":"Test","lastname":"User","phone":"0123456789"}'

# Connexion utilisateur (retourne un cookie sécurisé)
curl -X POST http://localhost:3000/auth/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test complet d'authentification
cd backend
node test-hybrid-auth.js
```

## 🔗 Intégration avec le Frontend

### Endpoints essentiels pour le frontend

1. **Authentification**
   - `POST /auth/users/signup` - Inscription utilisateur
   - `POST /auth/users/login` - Connexion utilisateur (cookie sécurisé)
   - `POST /auth/companies/signup` - Inscription entreprise
   - `POST /auth/companies/login` - Connexion entreprise (cookie sécurisé)
   - `POST /auth/users/logout` - Déconnexion
   - `POST /auth/companies/logout` - Déconnexion entreprise
   - `GET /users/me` - Profil utilisateur
   - `PUT /users/me` - Mise à jour du profil
   - `DELETE /users/me` - Supprimer compte utilisateur
   - `DELETE /companies/me` - Supprimer compte entreprise

2. **Offres d'emploi**
   - `GET /jobs` - Liste avec filtres
   - `GET /jobs/:id` - Détail d'une offre
   - `POST /jobs` - Créer une offre (recruteurs)

3. **Candidatures**
   - `POST /applications` - Postuler
   - `GET /applications/my` - Mes candidatures
   - `GET /applications/job/:jobId` - Candidatures pour une offre

4. **Messagerie**
   - `GET /messages/conversations` - Conversations
   - `POST /messages` - Envoyer un message

5. **Fichiers utilisateurs**
   - `POST /user-files/upload` - Upload CV/Photo
   - `GET /user-files/me` - Mes fichiers
   - `DELETE /user-files/:id` - Supprimer fichier

6. **Filtres et statistiques**
   - `GET /filters` - Filtres disponibles
   - `GET /stats/global` - Statistiques globales
   - `GET /stats/companies` - Statistiques entreprises

### Authentification par cookies
```javascript
// Plus besoin de gérer les tokens manuellement !
// Les cookies sont envoyés automatiquement par le navigateur
fetch('/users/me', {
  credentials: 'include'  // Important pour envoyer les cookies
})
```

## 🔄 Prochaines étapes

### Pour Moi (API)
1. ✅ **Intégration base de données** : Migration complète vers Supabase terminée
2. ✅ **Système de rôles** : Permissions (admin/user/company) implémentées
3. ✅ **Upload de fichiers** : CV, photos avec Supabase Storage
4. ✅ **Authentification** : Cookies sécurisés pour app web responsive
5. ✅ **Suppression de comptes** : RGPD-compliant avec nettoyage des données
6. **Notifications** : Système de notifications en temps réel
7. **Tests** : Tests unitaires et d'intégration

### Pour l'équipe
1. **Frontend** : Interface utilisateur avec React/Vue/Angular
2. ✅ **Base de données** : Supabase configuré et fonctionnel
3. **Déploiement** : Configuration pour la production

## 📞 Communication avec l'équipe

### Points d'intégration
- **Base de données** : Supabase configuré et synchronisé
- **Documentation API** : `backend/API_DOCUMENTATION.md`
- **Variables d'environnement** : Fichier `.env` dans `backend/`
- **Format des données** : Tous les endpoints retournent du JSON

### Exemples de données
```json
// Utilisateur
{
  "id_user": "uuid",
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "role": "user",
  "gender": "M",
  "created_at": "2024-01-01T00:00:00.000Z"
}

// Offre d'emploi
{
  "id_job_offer": "uuid",
  "title": "Développeur Full Stack",
  "description": "Description...",
  "location": "Paris",
  "contract_type": "CDI",
  "id_company": "uuid",
  "published_at": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Objectifs atteints

✅ **Base de données** : Migration complète vers Supabase  
✅ **Backend/API** : CRUD complet, authentification, messagerie  
✅ **Authentification** : Cookies sécurisés pour app web responsive  
✅ **Upload de fichiers** : Supabase Storage pour CV/Photos  
✅ **Suppression de comptes** : RGPD-compliant avec nettoyage  
✅ **Connexion temps réel** : Synchronisation avec Supabase  
✅ **Admin** : Gestion des données et bannissements  
✅ **Documentation** : Guide complet pour l'équipe  

L'API est entièrement fonctionnelle avec Supabase et prête pour l'intégration avec le frontend ! 🚀