# ✅ Checklist de Vérification Pré-Déploiement

Utilisez cette checklist pour vérifier que votre code est prêt pour le déploiement sur Vercel (frontend) et Render (backend).

---

## 🔍 Vérifications du Code

### Backend

- [x] **Variables d'environnement critiques vérifiées**
  - `JWT_SECRET` est vérifié au démarrage (`server.js`)
  - `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont vérifiés (`db.js`)
  - Le serveur s'arrête proprement si les variables manquent

- [x] **Configuration CORS**
  - CORS configuré pour accepter `FRONTEND_URL` depuis les variables d'environnement
  - Support des origines multiples (séparées par virgules)
  - `credentials: true` activé pour les cookies

- [x] **Sécurité**
  - Headers de sécurité configurés (X-Frame-Options, XSS Protection, etc.)
  - Rate limiting actif
  - Compression activée
  - Gestion globale des erreurs

- [x] **Health Check**
  - Route `/health` disponible pour les vérifications Render

- [x] **Scripts package.json**
  - `npm start` défini et fonctionne
  - `npm run dev` pour le développement local

### Frontend

- [x] **Configuration API**
  - `NEXT_PUBLIC_API_URL` utilisé dans `lib/api-client.ts`
  - Fallback vers `http://localhost:3000` en développement
  - `credentials: 'include'` pour les cookies

- [x] **Configuration Next.js**
  - `next.config.ts` avec headers de sécurité
  - Build fonctionne localement (`npm run build`)

- [x] **Variables d'environnement**
  - Toutes les variables utilisent le préfixe `NEXT_PUBLIC_*` pour être exposées au navigateur

---

## 📁 Fichiers de Configuration

### Vercel (`vercel.json`)
- [x] `rootDirectory` configuré : `linkup-frontend`
- [x] `buildCommand` : `cd linkup-frontend && npm install && npm run build`
- [x] `outputDirectory` : `linkup-frontend/.next`
- [x] `framework` : `nextjs`

### Render (`render.yaml`)
- [x] `rootDir` : `backend`
- [x] `buildCommand` : `npm install`
- [x] `startCommand` : `npm start`
- [x] `healthCheckPath` : `/health`
- [x] Variables non-sensibles définies (NODE_ENV, CREATE_DEFAULT_ADMIN, JWT_EXPIRES_IN)

---

## 🔐 Variables d'Environnement Requises

### Backend (Render)

**Obligatoires** :
- [ ] `NODE_ENV=production`
- [ ] `SUPABASE_URL` (URL de votre projet Supabase)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (Service Role Key de Supabase)
- [ ] `SUPABASE_ANON_KEY` (Anon Key de Supabase)
- [ ] `JWT_SECRET` (Secret fort, minimum 32 caractères - générer avec `openssl rand -base64 32`)
- [ ] `FRONTEND_URL` (URL du frontend Vercel - à mettre à jour après déploiement)

**Optionnelles** :
- [ ] `JWT_EXPIRES_IN=7d` (déjà dans render.yaml)
- [ ] `CREATE_DEFAULT_ADMIN=false` (déjà dans render.yaml)
- [ ] `PORT` (Render le définit automatiquement, pas besoin de le spécifier)

### Frontend (Vercel)

**Obligatoires** :
- [ ] `NEXT_PUBLIC_API_URL` (URL du backend Render)

**Optionnelles** :
- [ ] `NEXT_PUBLIC_APP_NAME=LinkUp`
- [ ] `NEXT_PUBLIC_APP_VERSION=1.0.0`

---

## 🗄️ Base de Données Supabase

- [ ] Projet Supabase créé
- [ ] Tables créées (exécuter les scripts SQL dans `backend/`)
- [ ] `token_revocation.sql` exécuté (table pour révocation des tokens)
- [ ] Clés API récupérées :
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SUPABASE_ANON_KEY`

---

## 🧪 Tests Locaux

### Backend
- [ ] `cd backend && npm install` fonctionne
- [ ] `npm start` démarre le serveur
- [ ] Route `/health` répond : `{"status":"ok"}`
- [ ] Variables d'environnement chargées correctement

### Frontend
- [ ] `cd linkup-frontend && npm install` fonctionne
- [ ] `npm run build` fonctionne sans erreurs
- [ ] `npm run dev` démarre le serveur de développement
- [ ] Le frontend communique avec le backend local

### Communication
- [ ] Pas d'erreurs CORS en développement
- [ ] Authentification fonctionne (login/logout)
- [ ] Les cookies sont envoyés correctement

---

## 📦 Git

- [ ] Tous les fichiers `.env` sont dans `.gitignore`
- [ ] `node_modules/` est dans `.gitignore`
- [ ] Code poussé sur GitHub
- [ ] Repository accessible depuis Render et Vercel

---

## ✅ Résultat

Si toutes les cases sont cochées, votre code est **prêt pour le déploiement** ! 🚀

Suivez le guide : `GUIDE_DEPLOIEMENT_VERCEL_RENDER.md`

---

## ⚠️ Points d'Attention

1. **Ne commitez JAMAIS** les fichiers `.env` ou `.env.local`
2. **Générez un JWT_SECRET fort** : `openssl rand -base64 32`
3. **Mettez à jour FRONTEND_URL** dans Render après avoir déployé le frontend
4. **Sur le plan gratuit Render**, le backend s'endort après 15 minutes d'inactivité
5. **Vérifiez les logs** après chaque déploiement pour détecter les erreurs

