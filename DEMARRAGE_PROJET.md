# 🚀 Guide de Démarrage - LinkUp

## 📋 Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Base de données PostgreSQL (Supabase)

## 🔧 Installation

### 1. Installation des dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../linkup-frontend
npm install
```

### 2. Configuration de l'environnement
Créez un fichier `.env` dans le dossier `backend` avec :
```env
DATABASE_URL=votre_url_supabase
JWT_SECRET=votre_secret_jwt
```

## 🚀 Démarrage

### Option 1 : Scripts automatiques (Windows)
```bash
# Démarrer le backend
start-backend.bat

# Démarrer le frontend (dans un autre terminal)
start-frontend.bat

# Tester la connectivité
test-backend.bat
```

### Option 2 : Commandes manuelles
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd linkup-frontend
npm run dev
```

## 🌐 URLs d'accès
- **Frontend** : http://localhost:3001
- **Backend** : http://localhost:3000
- **Health Check** : http://localhost:3000/health

## 🔍 Vérification
1. Ouvrez http://localhost:3001
2. Si vous voyez une alerte "Backend non accessible", démarrez le backend
3. Le dashboard entreprise devrait être accessible à http://localhost:3001/company-dashboard

## 🛠️ Dépannage

### Backend non accessible
- Vérifiez que le port 3000 est libre
- Vérifiez les variables d'environnement
- Consultez les logs du backend

### Erreurs de build
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez avec `npm install`
- Vérifiez la version de Node.js

## 📱 Fonctionnalités
- ✅ Authentification utilisateur/entreprise
- ✅ Dashboard entreprise dynamique
- ✅ Création d'offres d'emploi
- ✅ Gestion des candidatures
- ✅ Interface responsive
- ✅ Mode sombre/clair
