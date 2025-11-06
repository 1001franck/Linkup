# 🚀 Guide de Déploiement - Vercel (Frontend) + Render (Backend)

Guide complet pour déployer votre application LinkUp en production.

---

## 📋 Prérequis

- ✅ Compte GitHub avec votre code poussé
- ✅ Compte Render (gratuit) : https://render.com
- ✅ Compte Vercel (gratuit) : https://vercel.com
- ✅ Compte Supabase (gratuit) : https://supabase.com
- ✅ Toutes les variables d'environnement prêtes

---

## 🔧 ÉTAPE 1 : Déploiement du Backend sur Render

### 1.1 Créer le service sur Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Configurez le service :
   - **Name** : `linkup-backend`
   - **Region** : `Frankfurt (EU Central)` (ou la région la plus proche)
   - **Branch** : `main` ou `master` (selon votre repo)
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free` (pour commencer)

5. Cliquez sur **"Create Web Service"**

### 1.2 Configurer les variables d'environnement dans Render

Dans votre service Render → **Environment** → **Add Environment Variable** :

| Variable | Valeur | Où trouver |
|----------|--------|------------|
| `NODE_ENV` | `production` | - |
| `PORT` | *(Laissé vide - Render le définit automatiquement)* | - |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard → Settings → API |
| `JWT_SECRET` | *(Générez avec `openssl rand -base64 32`)* | Terminal |
| `JWT_EXPIRES_IN` | `7d` | - |
| `FRONTEND_URL` | `https://votre-app.vercel.app` | *(À mettre à jour après déploiement frontend)* |
| `CREATE_DEFAULT_ADMIN` | `false` | - |

**⚠️ Important** :
- Pour générer `JWT_SECRET` : exécutez `openssl rand -base64 32` dans votre terminal
- Pour `FRONTEND_URL` : vous pourrez la mettre à jour après avoir déployé le frontend sur Vercel
- Ne mettez PAS de guillemets autour des valeurs

### 1.3 Déployer et tester

1. Render va automatiquement déployer votre service
2. Attendez que le statut soit **"Live"** (2-5 minutes)
3. Notez l'URL de votre backend : `https://linkup-backend-xxxxx.onrender.com`
4. Testez le backend :
   ```
   https://linkup-backend-xxxxx.onrender.com/health
   ```
   Vous devriez voir : `{"status":"ok","uptime":...}`

---

## 🎨 ÉTAPE 2 : Déploiement du Frontend sur Vercel

### 2.1 Créer le projet sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur **"Add New..."** → **"Project"**
3. Importez votre repository GitHub
4. Configurez le projet :
   - **Framework Preset** : `Next.js` (détecté automatiquement)
   - **Root Directory** : `linkup-frontend` ⚠️ **IMPORTANT**
   - **Build Command** : `npm run build` (automatique)
   - **Output Directory** : `.next` (automatique)
   - **Install Command** : `npm install` (automatique)

5. Cliquez sur **"Deploy"**

### 2.2 Configurer les variables d'environnement dans Vercel

**AVANT** de déployer (ou après, dans Settings) :

1. Dans la page de configuration du projet, section **"Environment Variables"**
2. Cliquez sur **"Add"** et ajoutez :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `NEXT_PUBLIC_API_URL` | `https://linkup-backend-xxxxx.onrender.com` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_NAME` | `LinkUp` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | Production, Preview, Development |

**⚠️ Important** :
- Remplacez `linkup-backend-xxxxx.onrender.com` par l'URL réelle de votre backend Render
- Les variables `NEXT_PUBLIC_*` sont exposées au navigateur

### 2.3 Déployer

1. Vercel va automatiquement builder et déployer votre projet
2. Attendez la fin du build (2-5 minutes)
3. Notez l'URL de votre frontend : `https://linkup-xxxxx.vercel.app`

### 2.4 Mettre à jour FRONTEND_URL dans Render

1. Retournez sur Render Dashboard
2. Votre service backend → **Environment**
3. Trouvez `FRONTEND_URL` et modifiez-la avec l'URL Vercel de votre frontend :
   - Exemple : `https://linkup-xxxxx.vercel.app`
4. Render redéploiera automatiquement le backend

---

## ✅ Checklist de Vérification

### Backend Render
- [ ] Service créé et statut "Live"
- [ ] Route `/health` répond avec `{"status":"ok"}`
- [ ] Toutes les variables d'environnement sont configurées
- [ ] `FRONTEND_URL` contient l'URL Vercel (avec `https://`)
- [ ] `JWT_SECRET` est défini et fort (minimum 32 caractères)
- [ ] `SUPABASE_URL` et les clés Supabase sont correctes

### Frontend Vercel
- [ ] Root Directory configuré : `linkup-frontend`
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée avec l'URL Render
- [ ] Build réussi (plusieurs minutes, pas quelques secondes)
- [ ] Site accessible et fonctionnel
- [ ] Pas d'erreurs dans les logs de build

### Communication Backend-Frontend
- [ ] Pas d'erreurs CORS dans la console du navigateur (F12)
- [ ] Les appels API fonctionnent (testez la connexion)
- [ ] Pas d'erreurs 404 pour les routes API
- [ ] Les cookies d'authentification sont envoyés correctement

---

## 🔍 Dépannage

### ❌ Backend ne démarre pas sur Render

**Symptômes** : Statut "Failed" ou erreurs dans les logs

**Solutions** :
1. Vérifiez les logs Render : Dashboard → Service → Logs
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que `JWT_SECRET` est défini (minimum 32 caractères)
4. Vérifiez que `SUPABASE_URL` et les clés sont correctes
5. Vérifiez que le `rootDir: backend` est correct dans render.yaml

### ❌ Frontend retourne 404 ou erreur de build

**Symptômes** : Build échoue ou site ne s'affiche pas

**Solutions** :
1. Vérifiez que le **Root Directory** est bien `linkup-frontend` dans Vercel Settings
2. Vérifiez les logs de build Vercel : Dashboard → Projet → Deployments → Logs
3. Vérifiez que `NEXT_PUBLIC_API_URL` est défini
4. Redéployez le projet : Dashboard → Deployments → ⋯ → Redeploy

### ❌ Erreurs CORS

**Symptômes** : Erreur dans la console : `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions** :
1. Vérifiez que `FRONTEND_URL` dans Render contient bien l'URL Vercel
2. Vérifiez que l'URL est exacte (avec `https://`, sans slash final)
3. Si vous avez plusieurs domaines Vercel (production, preview), ajoutez-les tous :
   - Dans Render, vous pouvez définir plusieurs URLs séparées par des virgules :
     ```
     FRONTEND_URL=https://linkup-xxxxx.vercel.app,https://linkup-git-main-xxxxx.vercel.app
     ```
4. Redéployez le backend après modification de `FRONTEND_URL`

### ❌ Build trop rapide (quelques secondes)

**Symptômes** : Build se termine en 206ms ou moins

**Solutions** :
- Le Root Directory n'est pas configuré correctement
- Vérifiez dans Vercel Settings → General → Root Directory
- Doit être : `linkup-frontend`

### ❌ Backend s'endort (plan gratuit Render)

**Symptômes** : Le premier appel après inactivité prend 30-50 secondes

**Explication** :
- Sur le plan gratuit, Render endort le service après 15 minutes d'inactivité
- Le premier appel réveille le service (cold start)
- C'est normal et ne peut pas être évité sur le plan gratuit

**Solutions** :
- Utiliser un service de monitoring (UptimeRobot, etc.) pour ping le backend toutes les 5 minutes
- Passer au plan payant pour éviter l'endormissement

### ❌ Erreurs d'authentification

**Symptômes** : Impossible de se connecter, tokens invalides

**Solutions** :
1. Vérifiez que `JWT_SECRET` est le même partout (si vous avez plusieurs environnements)
2. Vérifiez que les cookies sont bien envoyés (onglet Network dans DevTools)
3. Vérifiez que `credentials: 'include'` est utilisé dans les appels API (déjà configuré dans `api-client.ts`)

---

## 📝 Notes Importantes

### Plan gratuit Render
- ⚠️ Le backend s'endort après **15 minutes d'inactivité**
- ⚠️ Le premier appel peut prendre **30-50 secondes** pour réveiller le service
- ⚠️ Pour éviter cela, utilisez un service de monitoring ou passez au plan payant

### Variables sensibles
- ⚠️ **NE COMMITEZ JAMAIS** vos variables d'environnement dans Git
- ⚠️ Utilisez **uniquement** les variables d'environnement des plateformes (Render, Vercel)
- ⚠️ Les fichiers `.env` doivent être dans `.gitignore`

### Mises à jour
- Après chaque modification, poussez sur GitHub
- Render et Vercel redéploieront automatiquement
- Vérifiez les logs après chaque déploiement

### Logs
- **Render** : Dashboard → Service → Logs
- **Vercel** : Dashboard → Projet → Deployments → Cliquez sur un déploiement → Logs

---

## 🎉 Félicitations !

Votre application LinkUp est maintenant déployée en production ! 🚀

### URLs de votre application :
- **Frontend** : `https://linkup-xxxxx.vercel.app`
- **Backend** : `https://linkup-backend-xxxxx.onrender.com`
- **Health Check** : `https://linkup-backend-xxxxx.onrender.com/health`

### Prochaines étapes :
1. ✅ Tester toutes les fonctionnalités
2. ✅ Configurer un domaine personnalisé (optionnel)
3. ✅ Mettre en place un monitoring (optionnel)
4. ✅ Configurer des sauvegardes automatiques de la base de données Supabase

---

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

