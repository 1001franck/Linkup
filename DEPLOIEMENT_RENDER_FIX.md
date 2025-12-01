# 🔧 Fix Déploiement Render - Problème dépendances

## Problème
Les dépendances ne sont pas installées correctement. Erreur : `Cannot find package 'dotenv'`

## Solution 1 : Configuration manuelle dans Render Dashboard (RECOMMANDÉ)

### Dans Render Dashboard → Settings → Build & Deploy :

1. **Root Directory** : `backend`
2. **Build Command** : `npm ci`
3. **Start Command** : `npm start`

### Pourquoi `npm ci` ?
- Installation plus rapide et fiable en production
- Utilise exactement les versions du `package-lock.json`
- Ne modifie pas le `package-lock.json`

## Solution 2 : Vérifier que package-lock.json est commité

```bash
# Vérifier que package-lock.json est dans Git
git ls-files backend/package-lock.json

# Si pas présent, l'ajouter
cd backend
npm install
git add package-lock.json
git commit -m "Add package-lock.json for Render deployment"
git push origin main
```

## Solution 3 : Alternative avec build command explicite

Si le `rootDir` ne fonctionne pas, utilisez cette configuration dans Render :

- **Root Directory** : `.` (racine)
- **Build Command** : `cd backend && npm ci`
- **Start Command** : `cd backend && npm start`

## Vérification

Après le déploiement, vérifiez les logs Render :
- Le build doit montrer : `added XXX packages`
- Pas d'erreurs `ERR_MODULE_NOT_FOUND`

## Si le problème persiste

1. **Clear build cache** dans Render Dashboard
2. **Manual Deploy** → "Clear build cache & deploy"
3. Vérifier les logs de build pour voir où les dépendances sont installées


