# 🚀 Guide de Déploiement - LinkUp

## 📋 Vue d'ensemble

- **Backend** : Render (Node.js/Express)
- **Frontend** : Vercel (Next.js)
- **Base de données** : Supabase

---

## 🔧 Partie 1 : Déploiement Backend sur Render

### Étape 1 : Préparer le repository

1. **Vérifier que votre code est sur GitHub/GitLab**
   ```bash
   git status
   git add .
   git commit -m "Préparation déploiement"
   git push origin main
   ```

### Étape 2 : Créer le service sur Render

1. **Aller sur [Render Dashboard](https://dashboard.render.com)**
2. **Cliquer sur "New +" → "Web Service"**
3. **Connecter votre repository GitHub/GitLab**
4. **Configurer le service :**
   - **Name** : `linkup-backend`
   - **Region** : `Frankfurt` (ou plus proche de vos utilisateurs)
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : `Free` (pour commencer) ou `Starter` (recommandé pour production)

### Étape 3 : Configurer les variables d'environnement

Dans le dashboard Render, section **Environment**, ajouter :

```env
# ⚠️ OBLIGATOIRE
NODE_ENV=production
PORT=10000

# Supabase (OBLIGATOIRE)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_ANON_KEY=votre_anon_key

# JWT (OBLIGATOIRE)
JWT_SECRET=votre_secret_jwt_fort_minimum_32_caracteres
JWT_EXPIRES_IN=7d

# CORS (OBLIGATOIRE - à mettre après déploiement frontend)
FRONTEND_URL=https://votre-frontend.vercel.app

# Admin (DÉSACTIVER EN PRODUCTION)
CREATE_DEFAULT_ADMIN=false

# Optionnel
LOG_LEVEL=info
METRICS_API_KEY=cle_super_secret_pour_metrics
```

**⚠️ IMPORTANT** : 
- Générer un `JWT_SECRET` fort : `openssl rand -base64 32`
- Ne jamais commiter ces valeurs dans Git
- Mettre à jour `FRONTEND_URL` après le déploiement du frontend

### Étape 4 : Déployer

1. **Cliquer sur "Create Web Service"**
2. **Attendre la fin du build** (première fois : ~5-10 minutes)
3. **Noter l'URL** : `https://linkup-backend-xxxxx.onrender.com`

### Étape 5 : Vérifier le déploiement

```bash
# Health check
curl https://linkup-backend-xxxxx.onrender.com/health

# Devrait retourner :
# {"status":"healthy","timestamp":"...","checks":{...}}
```

---

## 🎨 Partie 2 : Déploiement Frontend sur Vercel

### Étape 1 : Préparer le repository

Le code doit être sur GitHub/GitLab (même repository ou séparé).

### Étape 2 : Créer le projet sur Vercel

1. **Aller sur [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Cliquer sur "Add New..." → "Project"**
3. **Importer votre repository GitHub/GitLab**
4. **Configurer le projet :**
   - **Framework Preset** : `Next.js`
   - **Root Directory** : `linkup-frontend`
   - **Build Command** : `npm run build` (automatique)
   - **Output Directory** : `.next` (automatique)
   - **Install Command** : `npm install` (automatique)

### Étape 3 : Configurer les variables d'environnement

Dans Vercel, section **Settings → Environment Variables**, ajouter :

```env
# ⚠️ OBLIGATOIRE - URL du backend Render
NEXT_PUBLIC_API_URL=https://linkup-backend-xxxxx.onrender.com

# Configuration
NEXT_PUBLIC_APP_NAME=LinkUp
NEXT_PUBLIC_APP_VERSION=1.0.0

# Upload
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png

# Notifications (optionnel)
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=false
```

**⚠️ IMPORTANT** : 
- Utiliser `NEXT_PUBLIC_` pour les variables exposées au navigateur
- Mettre l'URL complète du backend Render (avec `https://`)

### Étape 4 : Déployer

1. **Cliquer sur "Deploy"**
2. **Attendre la fin du build** (première fois : ~3-5 minutes)
3. **Noter l'URL** : `https://linkup-frontend.vercel.app`

### Étape 5 : Mettre à jour le CORS du backend

**Retourner sur Render** et mettre à jour la variable d'environnement :

```env
FRONTEND_URL=https://linkup-frontend.vercel.app
```

**Redémarrer le service** pour appliquer les changements.

---

## ✅ Vérifications Post-Déploiement

### Backend

```bash
# 1. Health check
curl https://linkup-backend-xxxxx.onrender.com/health

# 2. Vérifier les headers de sécurité
curl -I https://linkup-backend-xxxxx.onrender.com/health

# 3. Tester une route publique (si disponible)
curl https://linkup-backend-xxxxx.onrender.com/api/health
```

### Frontend

1. **Ouvrir** `https://linkup-frontend.vercel.app`
2. **Vérifier la console navigateur** (F12) pour les erreurs
3. **Tester l'authentification** :
   - Inscription
   - Connexion
   - Déconnexion

### Intégration

1. **Vérifier que le frontend peut communiquer avec le backend**
2. **Tester les appels API** depuis le frontend
3. **Vérifier les cookies httpOnly** (dans DevTools → Application → Cookies)

---

## 🔒 Sécurité Production

### Backend (Render)

- ✅ Variables d'environnement sécurisées
- ✅ CORS configuré pour le frontend uniquement
- ✅ Rate limiting actif
- ✅ Headers de sécurité configurés
- ✅ JWT secret fort et unique
- ✅ `CREATE_DEFAULT_ADMIN=false`

### Frontend (Vercel)

- ✅ Headers de sécurité (CSP, HSTS, etc.)
- ✅ Variables `NEXT_PUBLIC_*` uniquement pour les valeurs non sensibles
- ✅ HTTPS forcé (automatique sur Vercel)
- ✅ Source maps désactivées en production

---

## 🐛 Dépannage

### Backend ne démarre pas

1. **Vérifier les logs Render** : Dashboard → Logs
2. **Vérifier les variables d'environnement** : Toutes les variables obligatoires sont présentes
3. **Vérifier la connexion Supabase** : Les clés sont correctes

### Frontend ne se connecte pas au backend

1. **Vérifier `NEXT_PUBLIC_API_URL`** : URL complète avec `https://`
2. **Vérifier CORS** : `FRONTEND_URL` dans le backend correspond à l'URL Vercel
3. **Vérifier la console navigateur** : Erreurs CORS ou réseau

### Erreurs 500

1. **Vérifier les logs** : Render (backend) et Vercel (frontend)
2. **Vérifier Supabase** : Connexion et permissions
3. **Vérifier les variables d'environnement** : Toutes présentes et correctes

---

## 📊 Monitoring

### Render

- **Logs** : Dashboard → Logs (temps réel)
- **Métriques** : Dashboard → Metrics (CPU, RAM, etc.)
- **Health checks** : Automatiques toutes les 5 minutes

### Vercel

- **Logs** : Dashboard → Deployments → View Function Logs
- **Analytics** : Dashboard → Analytics (trafic, performance)
- **Speed Insights** : Performance des pages

---

## 🔄 Mises à jour

### Backend

1. **Pousser les changements** : `git push origin main`
2. **Render déploie automatiquement** (si auto-deploy activé)
3. **Vérifier les logs** après déploiement

### Frontend

1. **Pousser les changements** : `git push origin main`
2. **Vercel déploie automatiquement**
3. **Vérifier le déploiement** : Dashboard → Deployments

---

## 💰 Coûts

### Plan Gratuit

- **Render** : 
  - Service web gratuit (avec limitations)
  - S'endort après 15 min d'inactivité
  - Redémarre en ~30 secondes au premier appel
  
- **Vercel** :
  - 100 GB bandwidth/mois
  - Builds illimités
  - Domaine `.vercel.app` gratuit

### Plan Payant (Recommandé pour production)

- **Render Starter** : ~$7/mois (pas de sleep, meilleures performances)
- **Vercel Pro** : ~$20/mois (bandwidth illimité, domaines personnalisés)

---

## 📝 Checklist Finale

- [ ] Backend déployé sur Render
- [ ] Variables d'environnement backend configurées
- [ ] Health check backend OK
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement frontend configurées
- [ ] `FRONTEND_URL` mis à jour dans le backend
- [ ] CORS fonctionne
- [ ] Authentification testée
- [ ] Upload de fichiers testé
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] HTTPS activé partout
- [ ] Headers de sécurité vérifiés

---

## 🎉 Félicitations !

Votre application LinkUp est maintenant en production ! 🚀

