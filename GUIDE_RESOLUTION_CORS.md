# 🔧 Guide de Résolution des Problèmes CORS - Vercel + Render

Ce guide vous aide à résoudre les erreurs CORS entre votre frontend Vercel et votre backend Render.

---

## 🐛 Problèmes Identifiés

### 1. Erreur CORS
```
Access to fetch at 'https://linkup-backend-13lp.onrender.com//users/me' 
from origin 'https://linkupfront-gdi2njdr3-1001francks-projects.vercel.app' 
has been blocked by CORS policy: Response to preflight request doesn't pass 
access control check: No 'Access-Control-Allow-Origin' header is present
```

### 2. Double Slash dans les URLs
Les URLs contiennent un double slash (`//users/me` au lieu de `/users/me`)

---

## ✅ Solutions Appliquées

### 1. Correction du Double Slash (Frontend)
✅ **Corrigé dans** `linkup-frontend/lib/api-client.ts`

Le code normalise maintenant automatiquement les URLs pour éviter les doubles slashes.

### 2. Amélioration de la Configuration CORS (Backend)
✅ **Corrigé dans** `backend/src/app.js`

Le backend autorise maintenant automatiquement tous les sous-domaines `*.vercel.app` en production.

---

## 🔧 Configuration Requise

### Sur Render (Backend)

1. **Allez sur votre dashboard Render** : https://dashboard.render.com
2. **Sélectionnez votre service backend** (`linkup-backend`)
3. **Allez dans l'onglet "Environment"**
4. **Vérifiez/Configurez ces variables** :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NODE_ENV` | `production` | ⚠️ **OBLIGATOIRE** - Active la configuration CORS pour production |
| `FRONTEND_URL` | `https://linkupfront-gdi2njdr3-1001francks-projects.vercel.app` | URL de votre frontend Vercel (optionnel, car les `*.vercel.app` sont auto-autorisés) |

**⚠️ Important** :
- Si vous avez un domaine personnalisé Vercel, ajoutez-le dans `FRONTEND_URL`
- Vous pouvez mettre plusieurs URLs séparées par des virgules : `https://app1.vercel.app,https://app2.vercel.app`
- Les sous-domaines `*.vercel.app` sont **automatiquement autorisés** même sans `FRONTEND_URL`

### Sur Vercel (Frontend)

1. **Allez sur votre dashboard Vercel** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** (`linkup-frontend`)
3. **Allez dans "Settings" → "Environment Variables"**
4. **Vérifiez/Configurez cette variable** :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://linkup-backend-13lp.onrender.com` | ⚠️ **OBLIGATOIRE** - URL de votre backend Render (sans slash final) |

**⚠️ Important** :
- **Ne mettez PAS de slash final** : `https://linkup-backend-13lp.onrender.com` ✅ (pas `/` à la fin)
- Le code normalise automatiquement les URLs, mais c'est mieux sans slash final

---

## 🔄 Étapes de Redéploiement

### 1. Redéployer le Backend (Render)

Après avoir mis à jour les variables d'environnement sur Render :

1. **Allez dans votre service Render**
2. **Cliquez sur "Manual Deploy" → "Deploy latest commit"**
3. **Attendez que le déploiement se termine** (2-3 minutes)

### 2. Redéployer le Frontend (Vercel)

Après avoir mis à jour les variables d'environnement sur Vercel :

1. **Vercel redéploie automatiquement** après chaque changement de variable d'environnement
2. **OU** allez dans "Deployments" → cliquez sur "..." → "Redeploy"

---

## 🧪 Vérification

### 1. Vérifier que le Backend répond

Ouvrez dans votre navigateur :
```
https://linkup-backend-13lp.onrender.com/health
```

Vous devriez voir :
```json
{"status":"ok","uptime":123.456}
```

### 2. Vérifier les Headers CORS

Ouvrez la console développeur (F12) dans votre navigateur et allez sur votre site Vercel.

Dans l'onglet **Network**, cliquez sur une requête vers le backend, puis regardez les **Response Headers**. Vous devriez voir :

```
Access-Control-Allow-Origin: https://linkupfront-gdi2njdr3-1001francks-projects.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### 3. Tester une Requête API

Dans la console du navigateur (F12 → Console), exécutez :

```javascript
fetch('https://linkup-backend-13lp.onrender.com/health', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('✅ Backend accessible:', data))
.catch(err => console.error('❌ Erreur:', err));
```

Si vous voyez `✅ Backend accessible: {status: "ok", ...}`, tout fonctionne !

---

## 🐛 Dépannage

### Problème : Toujours des erreurs CORS

1. **Vérifiez que `NODE_ENV=production` est défini sur Render**
   - C'est crucial car la configuration CORS diffère entre dev et production

2. **Vérifiez les logs Render**
   - Allez dans "Logs" de votre service Render
   - Cherchez les messages `[CORS] Origine autorisée` ou `[CORS] Origine non autorisée`
   - Cela vous dira si l'origine est reconnue

3. **Vérifiez l'URL exacte de votre frontend Vercel**
   - L'URL peut changer à chaque déploiement sur Vercel
   - Les sous-domaines `*.vercel.app` sont automatiquement autorisés maintenant

### Problème : Double slash toujours présent

1. **Vérifiez la variable `NEXT_PUBLIC_API_URL` sur Vercel**
   - Elle ne doit **PAS** se terminer par `/`
   - Exemple : `https://linkup-backend-13lp.onrender.com` ✅
   - Pas : `https://linkup-backend-13lp.onrender.com/` ❌

2. **Le code normalise automatiquement**, mais c'est mieux de corriger à la source

### Problème : Le backend ne démarre pas

1. **Vérifiez les logs Render**
   - Allez dans "Logs" de votre service
   - Cherchez les erreurs de démarrage

2. **Vérifiez que toutes les variables d'environnement sont définies** :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `NODE_ENV=production`

---

## 📝 Résumé des Modifications

### Frontend (`linkup-frontend/lib/api-client.ts`)
- ✅ Normalisation des URLs pour éviter les doubles slashes
- ✅ Correction de la méthode `testConnection()`

### Backend (`backend/src/app.js`)
- ✅ Autorisation automatique des sous-domaines `*.vercel.app` en production
- ✅ Amélioration de la gestion des origines CORS

---

## 🎯 Prochaines Étapes

1. ✅ Mettre à jour les variables d'environnement sur Render et Vercel
2. ✅ Redéployer les deux services
3. ✅ Tester la connexion
4. ✅ Vérifier que les erreurs CORS ont disparu

Si vous avez toujours des problèmes après ces étapes, vérifiez les logs Render et la console du navigateur pour plus de détails.

