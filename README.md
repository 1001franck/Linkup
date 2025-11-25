# LinkUp - Plateforme de Recrutement Moderne

## 🎯 Description
Plateforme complète de recrutement avec authentification sécurisée, gestion des offres d'emploi, candidatures, messagerie, et administration. Développée avec Next.js 15, Node.js, et Supabase.

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v18+)
- npm
- Base de données Supabase configurée

### Installation
```bash
# Backend
cd backend
npm install

# Frontend
cd ../linkup-frontend
npm install
```

### Configuration
1. Copier `.env.example` vers `.env` dans le dossier `backend`
2. Configurer les variables d'environnement Supabase
3. Importer le schéma de base de données (`bdd.sql`)

### Lancement

#### Option 1 : Scripts automatiques (Windows)
```bash
# Démarrer le backend
start-backend.bat
# ou
powershell -ExecutionPolicy Bypass -File start-backend.ps1

# Démarrer le frontend (dans un autre terminal)
start-frontend.bat
# ou
powershell -ExecutionPolicy Bypass -File start-frontend.ps1
```

#### Option 2 : Commandes manuelles
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd linkup-frontend
npm run dev
```

### URLs d'accès
- **Frontend** : http://localhost:3001
- **Backend** : http://localhost:3000
- **Health Check** : http://localhost:3000/health

## 📚 Documentation

- [Guide de démarrage](GUIDE_DEMARRAGE.md)
- [Documentation API](backend/API_DOCUMENTATION.md)

## 🏗️ Architecture

### Backend
```
backend/
├── src/
│   ├── routes/          # Routes API (auth, users, companies, jobs, admin)
│   ├── services/        # Logique métier (stores)
│   ├── middlewares/     # Middlewares (auth, performance)
│   ├── database/        # Configuration Supabase
│   ├── utils/           # Utilitaires (cache, validation)
│   ├── app.js          # Configuration Express
│   └── server.js       # Point d'entrée
├── API_DOCUMENTATION.md # Documentation complète
└── bdd.sql             # Schéma de base de données
```

### Frontend
```
linkup-frontend/
├── app/                 # Pages Next.js 15 (App Router)
│   ├── (routes)/        # Routes protégées
│   │   ├── admin-dashboard/    # Dashboard administrateur
│   │   ├── company-dashboard/  # Dashboard entreprise
│   │   ├── jobs/              # Offres d'emploi
│   │   ├── companies/         # Liste des entreprises
│   │   └── profile/           # Profils utilisateurs
│   └── layout.tsx       # Layout principal
├── components/          # Composants React
│   ├── ui/             # Composants UI (Radix UI)
│   ├── auth/           # Composants d'authentification
│   ├── companies/      # Composants entreprises
│   ├── jobs/           # Composants offres d'emploi
│   └── layout/         # Composants de layout
├── hooks/              # Hooks personnalisés
├── contexts/           # Contextes React
├── lib/                # Utilitaires et configuration
└── types/              # Types TypeScript
```

## 🔐 Authentification

L'API utilise des **cookies sécurisés** pour l'authentification web responsive :

- **Login** : Crée automatiquement un cookie `token` sécurisé
- **Accès** : Le cookie est envoyé automatiquement par le navigateur  
- **Logout** : Supprime le cookie et révoque le token

**Note** : Plus besoin de gérer manuellement les tokens côté client !

## 📊 Endpoints principaux

### Authentification
- `POST /auth/users/signup` - Inscription utilisateur
- `POST /auth/users/login` - Connexion utilisateur
- `POST /auth/companies/signup` - Inscription entreprise
- `POST /auth/companies/login` - Connexion entreprise
- `POST /auth/users/logout` - Déconnexion
- `POST /auth/companies/logout` - Déconnexion entreprise

### Gestion des comptes
- `GET /users/me` - Profil utilisateur
- `PUT /users/me` - Modifier profil
- `DELETE /users/me` - Supprimer compte utilisateur
- `DELETE /companies/me` - Supprimer compte entreprise

### Offres et candidatures
- `GET /jobs` - Liste des offres avec filtres
- `POST /jobs` - Créer une offre
- `GET /companies` - Liste des entreprises avec filtres
- `POST /applications` - Postuler
- `GET /applications/my` - Mes candidatures

### Administration
- `GET /admin/stats/dashboard` - Statistiques admin
- `GET /admin/users` - Gestion des utilisateurs
- `GET /admin/companies` - Gestion des entreprises
- `GET /admin/jobs` - Gestion des offres
- `GET /admin/applications` - Gestion des candidatures

### Fichiers et messagerie
- `POST /user-files/upload` - Upload CV/Photo
- `POST /companies/:id/logo` - Upload logo entreprise
- `POST /messages` - Envoyer message
- `GET /messages/conversations` - Conversations

Voir [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) pour la liste complète.

## 🚀 Fonctionnalités

### ✅ Implémentées

#### Authentification & Sécurité
- **Authentification multi-rôles** : Utilisateurs, Entreprises, Administrateurs
- **Cookies sécurisés** : JWT avec cookies httpOnly
- **Protection CSRF** : Middleware de sécurité
- **Gestion des sessions** : Déconnexion et révocation de tokens

#### Gestion des Comptes
- **Profils utilisateurs** : Création, modification, suppression
- **Profils entreprises** : Gestion complète avec logo
- **Upload de fichiers** : CV, photos de profil, logos d'entreprise
- **Validation des données** : Contrôles côté client et serveur

#### Offres d'Emploi
- **CRUD complet** : Création, lecture, modification, suppression
- **Recherche avancée** : Filtres par secteur, ville, type de contrat
- **Pagination** : Navigation efficace dans les résultats
- **Statistiques** : Vues, candidatures, performances

#### Candidatures
- **Postulation** : Système de candidature complet
- **Suivi des candidatures** : Statuts, notes, documents
- **Gestion des entretiens** : Programmation et suivi
- **Documents** : Upload et gestion des CV et lettres de motivation

#### Messagerie
- **Conversations** : Système de messagerie entre utilisateurs
- **Notifications** : Alertes en temps réel
- **Historique** : Conservation des échanges

#### Administration
- **Dashboard admin** : Vue d'ensemble des statistiques
- **Gestion des utilisateurs** : CRUD complet
- **Gestion des entreprises** : Validation et suivi
- **Gestion des offres** : Modération et statistiques
- **Gestion des candidatures** : Suivi et analyse

#### Interface Utilisateur
- **Design moderne** : Interface élégante avec Radix UI
- **Mode sombre** : Thème adaptatif
- **Responsive** : Compatible mobile et desktop
- **Accessibilité** : Composants accessibles
- **Animations** : Transitions fluides avec Framer Motion

### 🔧 Technologies

#### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **Supabase** : Base de données PostgreSQL
- **JWT** : Authentification par tokens
- **bcryptjs** : Hachage des mots de passe
- **Multer** : Upload de fichiers

#### Frontend
- **Next.js 15** : Framework React avec App Router
- **React 18** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS
- **Radix UI** : Composants accessibles
- **Framer Motion** : Animations
- **React Query** : Gestion d'état serveur

#### Base de Données
- **PostgreSQL** : Base de données relationnelle
- **Supabase** : Backend-as-a-Service
- **Storage** : Stockage de fichiers
- **Auth** : Authentification intégrée

## 🎨 Interface Utilisateur

### Pages Principales
- **Accueil** : Landing page avec présentation
- **Offres d'emploi** : Liste et détails des offres
- **Entreprises** : Découverte des entreprises
- **Dashboard utilisateur** : Tableau de bord personnel
- **Dashboard entreprise** : Gestion des offres et candidatures
- **Dashboard admin** : Administration complète

### Composants UI
- **Design System** : Composants cohérents
- **Thème adaptatif** : Mode clair/sombre
- **Responsive** : Mobile-first design
- **Accessibilité** : Standards WCAG

## 📱 Responsive Design

- **Mobile** : Interface optimisée pour smartphones
- **Tablet** : Adaptation pour tablettes
- **Desktop** : Expérience complète sur ordinateur
- **PWA Ready** : Prêt pour installation

## 🔒 Sécurité

- **Authentification** : JWT avec cookies sécurisés
- **Autorisation** : Middleware de contrôle d'accès
- **Validation** : Contrôles côté client et serveur
- **Protection CSRF** : Tokens de sécurité
- **HTTPS** : Chiffrement des communications

## 📊 Performance

- **Optimisation** : Code nettoyé et optimisé
- **Cache** : Mise en cache des requêtes
- **Pagination** : Chargement progressif
- **Lazy Loading** : Chargement à la demande
- **Compression** : Optimisation des assets

## 👥 Équipe
- **Yousra Arroui** - Développement API Node.js Express
- **Harel Frank** - Front-End React Next.js
- **Sara Colombel** - Base de données Supabase et services

## 📝 Notes de Production

- **Base de données** : Supabase (PostgreSQL)
- **Admin par défaut** : admin@test.com / admin123
- **Authentification** : Cookies sécurisés pour app web responsive
- **Code nettoyé** : Prêt pour la production
- **Logs optimisés** : Debug en développement, erreurs en production

## 🚀 Déploiement

Le projet est prêt pour le déploiement en production avec :
- Code nettoyé et optimisé
- Logs de debug supprimés
- Gestion d'erreurs robuste
- Sécurité renforcée
- Performance optimisée

## 📈 Statistiques

- **Backend** : 15+ routes API
- **Frontend** : 20+ pages
- **Composants** : 50+ composants réutilisables
- **Hooks** : 20+ hooks personnalisés
- **Types** : 100% TypeScript
- **Tests** : Prêt pour les tests automatisés
