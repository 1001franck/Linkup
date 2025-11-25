# 🚀 Guide de Déploiement Complet - LinkUp

Guide étape par étape pour déployer le backend sur Render et le frontend sur Vercel.

## 📋 Prérequis

- Compte GitHub avec le code poussé
- Compte Render (gratuit) : https://render.com
- Compte Vercel (gratuit) : https://vercel.com
- Compte Supabase (gratuit) : https://supabase.com

---

## 🔧 Partie 1 : Déploiement du Backend sur Render

### Étape 1 : Préparer les variables d'environnement

Créez un fichier `.env.example` dans `backend/` avec ces variables (ne pas commit ce fichier) :

```env
NODE_ENV=production
PORT=10000

# Supabase (OBLIGATOIRE)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_ANON_KEY=votre_anon_key

# JWT (OBLIGATOIRE)
JWT_SECRET=votre_secret_jwt_fort_minimum_32_caracteres
JWT_EXPIRES_IN=7d

# CORS (OBLIGATOIRE - sera mis à jour après déploiement frontend)
FRONTEND_URL=https://votre-frontend.vercel.app

# Admin par défaut (DÉSACTIVER EN PRODUCTION)
CREATE_DEFAULT_ADMIN=false
```

### Étape 2 : Créer le service sur Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur "New +" → "Web Service"
3. Connectez votre repository GitHub : `1001franck/Linkup`
4. Configurez le service :

   - **Name** : `linkup-backend`
   - **Region** : `Frankfurt (EU Central)` (ou la région la plus proche)
   - **Branch** : `master`
   - **Root Directory** : `backend`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free` (pour commencer)

5. Cliquez sur "Create Web Service"

### Étape 3 : Configurer les variables d'environnement dans Render

Dans votre service Render → **Environment** :

Ajoutez toutes ces variables (cliquez sur "Add Environment Variable" pour chacune) :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | Environnement de production |
| `PORT` | `10000` | Port utilisé par Render |
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | URL de votre projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Service Role Key de Supabase |
| `SUPABASE_ANON_KEY` | `eyJ...` | Anon Key de Supabase |
| `JWT_SECRET` | `votre_secret_fort` | Secret JWT (générez avec `openssl rand -base64 32`) |
| `JWT_EXPIRES_IN` | `7d` | Durée de validité des tokens |
| `FRONTEND_URL` | `https://votre-app.vercel.app` | URL du frontend (à mettre à jour après déploiement) |
| `CREATE_DEFAULT_ADMIN` | `false` | Désactiver la création d'admin automatique |

**⚠️ Important** : 
- Trouvez vos clés Supabase dans : Supabase Dashboard → Settings → API
- Générez un JWT_SECRET fort : `openssl rand -base64 32`
- Pour `FRONTEND_URL`, vous pourrez la mettre à jour après avoir déployé le frontend

### Étape 4 : Déployer

1. Render va automatiquement déployer votre service
2. Attendez que le statut soit "Live" (peut prendre 2-5 minutes)
3. Notez l'URL de votre backend : `https://linkup-backend-xxxxx.onrender.com`

### Étape 5 : Tester le backend

Ouvrez dans votre navigateur :
```
https://linkup-backend-xxxxx.onrender.com/health
```

Vous devriez voir : `{"status":"ok","uptime":...}`

---

## 🎨 Partie 2 : Déploiement du Frontend sur Vercel

### Étape 1 : Configurer le Root Directory dans Vercel

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet "linkup" (ou créez-en un nouveau)
3. **Settings** → **General**
4. Dans "Root Directory", mettez : `linkup-frontend`
5. Cliquez sur "Save"

### Étape 2 : Configurer les variables d'environnement dans Vercel

1. **Settings** → **Environment Variables**
2. Cliquez sur "Create new"
3. Ajoutez cette variable :

   - **Key** : `NEXT_PUBLIC_API_URL`
   - **Value** : `https://linkup-backend-xxxxx.onrender.com` (l'URL de votre backend Render)
   - **Environments** : Cochez au moins "Production"

4. Cliquez sur "Save"

### Étape 3 : Déployer

1. Allez dans **Deployments**
2. Si vous avez fait des changements, Vercel redéploiera automatiquement
3. Sinon, cliquez sur les 3 points (⋯) → "Redeploy"
4. Attendez la fin du build (2-5 minutes)

### Étape 4 : Mettre à jour FRONTEND_URL dans Render

1. Retournez sur Render Dashboard
2. Votre service backend → **Environment**
3. Trouvez `FRONTEND_URL` et modifiez-la avec l'URL Vercel de votre frontend :
   - Exemple : `https://linkup-beryl.vercel.app`
4. Render redéploiera automatiquement

### Étape 5 : Tester le frontend

1. Ouvrez votre URL Vercel
2. La page d'accueil devrait s'afficher
3. Testez la connexion pour vérifier que le frontend communique avec le backend

---

## ✅ Checklist de Vérification

### Backend Render
- [ ] Service créé et "Live"
- [ ] Route `/health` répond avec `{"status":"ok"}`
- [ ] Toutes les variables d'environnement sont configurées
- [ ] `FRONTEND_URL` contient l'URL Vercel

### Frontend Vercel
- [ ] Root Directory configuré : `linkup-frontend`
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée avec l'URL Render
- [ ] Build réussi (plusieurs minutes, pas 206ms)
- [ ] Site accessible et fonctionnel

### Communication Backend-Frontend
- [ ] Pas d'erreurs CORS dans la console du navigateur
- [ ] Les appels API fonctionnent (testez la connexion)
- [ ] Pas d'erreurs 404 pour les routes API

---

## 🔍 Dépannage

### Backend ne démarre pas
- Vérifiez les logs Render pour les erreurs
- Vérifiez que toutes les variables d'environnement sont définies
- Vérifiez que `JWT_SECRET` et `SUPABASE_URL` sont corrects

### Frontend retourne 404
- Vérifiez que le Root Directory est bien `linkup-frontend`
- Vérifiez les logs de build Vercel
- Redéployez le projet

### Erreurs CORS
- Vérifiez que `FRONTEND_URL` dans Render contient bien l'URL Vercel
- Vérifiez que l'URL est exacte (avec `https://`)
- Redéployez le backend après modification de `FRONTEND_URL`

### Build trop rapide (206ms)
- Le Root Directory n'est pas configuré correctement
- Vérifiez dans Vercel Settings → General → Root Directory

---

## 📝 Notes Importantes

1. **Plan gratuit Render** : Le backend s'endort après 15 minutes d'inactivité. Le premier appel peut prendre 30-50 secondes pour réveiller le service.

2. **Variables sensibles** : Ne commitez JAMAIS vos variables d'environnement dans Git. Utilisez les variables d'environnement des plateformes.

3. **Mises à jour** : Après chaque modification, poussez sur GitHub et les plateformes redéploieront automatiquement.

4. **Logs** : Consultez les logs en cas de problème :
   - Render : Dashboard → Service → Logs
   - Vercel : Dashboard → Projet → Deployments → Logs

---

## 🎉 Félicitations !

Votre application est maintenant déployée en production ! 🚀

