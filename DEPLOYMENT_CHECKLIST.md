# ✅ Checklist de Déploiement - LinkUp

Utilisez cette checklist pour vous assurer que tout est correctement configuré.

## 🔧 Backend Render

### Configuration du Service
- [ ] Service créé sur Render
- [ ] Root Directory : `backend`
- [ ] Build Command : `npm install`
- [ ] Start Command : `npm start`
- [ ] Instance Type : Free (ou payant si nécessaire)

### Variables d'Environnement
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `SUPABASE_URL` = URL de votre projet Supabase
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = Service Role Key de Supabase
- [ ] `SUPABASE_ANON_KEY` = Anon Key de Supabase
- [ ] `JWT_SECRET` = Secret JWT fort (32+ caractères)
- [ ] `JWT_EXPIRES_IN` = `7d`
- [ ] `FRONTEND_URL` = URL Vercel du frontend
- [ ] `CREATE_DEFAULT_ADMIN` = `false`

### Déploiement
- [ ] Service déployé et statut "Live"
- [ ] URL du backend notée : `https://linkup-backend-xxxxx.onrender.com`
- [ ] Route `/health` testée et fonctionnelle
- [ ] Logs vérifiés (pas d'erreurs critiques)

---

## 🎨 Frontend Vercel

### Configuration du Projet
- [ ] Projet créé sur Vercel
- [ ] Repository GitHub connecté
- [ ] Root Directory configuré : `linkup-frontend`
- [ ] Framework détecté : Next.js

### Variables d'Environnement
- [ ] `NEXT_PUBLIC_API_URL` = URL du backend Render
- [ ] Variable ajoutée pour au moins l'environnement "Production"

### Déploiement
- [ ] Build réussi (temps de build > 1 minute, pas 206ms)
- [ ] URL du frontend notée : `https://votre-app.vercel.app`
- [ ] Site accessible
- [ ] Page d'accueil s'affiche correctement

---

## 🔗 Communication Backend-Frontend

### CORS
- [ ] `FRONTEND_URL` dans Render = URL Vercel exacte
- [ ] Pas d'erreurs CORS dans la console du navigateur

### API
- [ ] Variable `NEXT_PUBLIC_API_URL` correcte dans Vercel
- [ ] Les appels API fonctionnent (testez la connexion)
- [ ] Pas d'erreurs 404 pour les routes API
- [ ] Les requêtes vont vers `linkup-backend-xxxxx.onrender.com` (pas localhost)

---

## 🧪 Tests Fonctionnels

### Authentification
- [ ] Page de connexion accessible
- [ ] Connexion utilisateur fonctionne
- [ ] Connexion entreprise fonctionne
- [ ] Déconnexion fonctionne

### Navigation
- [ ] Toutes les pages principales accessibles
- [ ] Pas d'erreurs 404 sur les routes principales
- [ ] Redirections fonctionnent correctement

### Fonctionnalités
- [ ] Affichage des offres d'emploi
- [ ] Affichage des entreprises
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent

---

## 📊 Monitoring

### Logs
- [ ] Logs Render consultables et sans erreurs critiques
- [ ] Logs Vercel consultables et sans erreurs critiques
- [ ] Console du navigateur sans erreurs critiques

### Performance
- [ ] Temps de chargement acceptable
- [ ] Backend répond rapidement (hors période d'endormissement)

---

## 🔒 Sécurité

### Variables Sensibles
- [ ] Aucun secret dans le code source
- [ ] Variables d'environnement configurées dans les plateformes
- [ ] `.env` dans `.gitignore`

### Configuration
- [ ] `CREATE_DEFAULT_ADMIN` = `false` en production
- [ ] CORS correctement configuré
- [ ] HTTPS activé (automatique sur Render et Vercel)

---

## 📝 Documentation

- [ ] URLs de production notées
- [ ] Variables d'environnement documentées
- [ ] Guide de déploiement consulté

---

## 🎉 Finalisation

Une fois toutes les cases cochées :
- [ ] Application fonctionnelle en production
- [ ] Tests utilisateur effectués
- [ ] Documentation à jour

---

**Date de déploiement** : _______________

**URLs de production** :
- Backend : `https://____________________.onrender.com`
- Frontend : `https://____________________.vercel.app`

