# Guide de Déploiement Production - LinkUp

## 📋 Checklist Pré-Déploiement

### ✅ Configuration Backend

1. **Variables d'environnement** - Créer `backend/.env` avec :
   ```env
   NODE_ENV=production
   PORT=3000
   
   # Supabase (OBLIGATOIRE)
   SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
   
   # JWT (OBLIGATOIRE)
   JWT_SECRET=votre_secret_jwt_fort_minimum_32_caracteres
   JWT_EXPIRES_IN=7d
   
   # CORS (OBLIGATOIRE)
   FRONTEND_URL=https://votre-domaine.com
   
   # Admin par défaut (DÉSACTIVER EN PRODUCTION)
   CREATE_DEFAULT_ADMIN=false
   ```

2. **Base de données** - Exécuter dans Supabase SQL Editor :
   - `backend/token_revocation.sql` (table pour révocation des tokens)

3. **Dépendances** :
   ```bash
   cd backend
   npm install --production
   ```

### ✅ Sécurité

- [x] Headers de sécurité configurés (X-Frame-Options, XSS Protection, etc.)
- [x] X-Powered-By header désactivé
- [x] Rate limiting actif
- [x] CORS configuré pour production
- [x] Validation stricte des entrées
- [x] Token revocation persistante
- [x] Logs conditionnels (désactivés en production)
- [x] Erreurs masquées en production
- [x] Compression activée
- [x] Gestion globale des erreurs

### ✅ Configuration Frontend

1. **Variables d'environnement** - Créer `linkup-frontend/.env.local` :
   ```env
   NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
   NEXT_PUBLIC_APP_NAME=LinkUp
   NODE_ENV=production
   ```

2. **Build** :
   ```bash
   cd linkup-frontend
   npm run build
   ```

## 🚀 Déploiement

### Option 1: PM2 (Recommandé)

```bash
# Installation PM2
npm install -g pm2

# Démarrer le backend
cd backend
pm2 start src/server.js --name linkup-backend

# Démarrer le frontend (si serveur Node.js)
cd ../linkup-frontend
pm2 start npm --name linkup-frontend -- start
```

### Option 2: Docker (Recommandé pour production)

Créer `Dockerfile` dans `backend/` :
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

### Option 3: Système de service (systemd)

Créer `/etc/systemd/system/linkup-backend.service`

## 🔍 Vérifications Post-Déploiement

1. **Health Check** :
   ```bash
   curl https://api.votre-domaine.com/health
   ```

2. **Vérifier les logs** :
   - Les logs debug/info ne doivent PAS apparaître
   - Seules les erreurs doivent être loggées

3. **Tester l'authentification** :
   - Login
   - Logout
   - Vérifier que les tokens sont révoqués

4. **Vérifier les headers de sécurité** :
   ```bash
   curl -I https://api.votre-domaine.com/health
   ```

## 📝 Notes Importantes

- Le fichier `.env` ne doit JAMAIS être commité dans Git
- `CREATE_DEFAULT_ADMIN=false` en production
- `JWT_SECRET` doit être unique et fort (générer avec `openssl rand -base64 32`)
- La table `revoked_tokens` doit exister dans Supabase
- Configurer un reverse proxy (Nginx) avec HTTPS en production

## 🛡️ Sécurité Production

- Utiliser HTTPS uniquement
- Configurer un firewall
- Mettre à jour les dépendances régulièrement (`npm audit`)
- Surveiller les logs d'erreur
- Configurer des sauvegardes automatiques de la base de données

