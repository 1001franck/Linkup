# Test de Redirection Admin

## 🧪 Guide de Test Complet

### **1. Préparation**

#### **Démarrer les serveurs**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd linkup-frontend
npm run dev
```

#### **Vérifier la création de l'admin**
Le backend devrait afficher :
```
Administrateur par défaut créé : admin@example.com / admin123
```

### **2. Test de Connexion Admin**

#### **Étape 1 : Aller sur la page de connexion**
```
http://localhost:3001/login
```

#### **Étape 2 : Se connecter avec l'admin**
```
Email: admin@example.com
Mot de passe: admin123
```

#### **Étape 3 : Vérifier la redirection automatique**
Après connexion, vous devriez être automatiquement redirigé vers :
```
http://localhost:3001/admin-dashboard
```

### **3. Vérifications dans la Console**

#### **Console Backend**
Vous devriez voir :
```
POST /auth/users/login -> findByEmail result: { id_user: X, email: 'admin@example.com', password_present: true }
POST /auth/users/login -> bcrypt.compare result: true
```

#### **Console Frontend**
Vous devriez voir :
```
🔐 Token décodé - Role: admin, User ID: X
✅ Admin connecté automatiquement: Admin
🛡️ Redirection admin vers: /admin-dashboard
```

### **4. Test des Autres Rôles**

#### **Test Utilisateur Normal**
1. Créer un compte utilisateur normal
2. Se connecter
3. Vérifier la redirection vers `/dashboard`

#### **Test Entreprise**
1. Créer un compte entreprise
2. Se connecter
3. Vérifier la redirection vers `/company-dashboard`

### **5. Test de Navigation Admin**

Une fois sur `/admin-dashboard`, vérifier :

#### **Header Admin**
- ✅ Logo "LinkUp Admin" visible
- ✅ Badge "Admin" affiché
- ✅ Navigation vers toutes les sections

#### **Sections Accessibles**
- ✅ Dashboard : `http://localhost:3001/admin-dashboard`
- ✅ Utilisateurs : `http://localhost:3001/admin-dashboard/users`
- ✅ Entreprises : `http://localhost:3001/admin-dashboard/companies`
- ✅ Offres : `http://localhost:3001/admin-dashboard/jobs`
- ✅ Candidatures : `http://localhost:3001/admin-dashboard/applications`
- ✅ Analytics : `http://localhost:3001/admin-dashboard/analytics`

### **6. Test de Protection des Routes**

#### **Test Accès Non-Autorisé**
1. Se déconnecter
2. Aller directement sur `http://localhost:3001/admin-dashboard`
3. Vérifier la redirection vers la page d'accueil

#### **Test Accès avec Rôle Incorrect**
1. Se connecter avec un utilisateur normal
2. Aller sur `http://localhost:3001/admin-dashboard`
3. Vérifier le message "Accès Refusé"

### **7. Debug en Cas de Problème**

#### **Vérifier le Token JWT**
Dans la console du navigateur :
```javascript
const token = localStorage.getItem('linkup_token');
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('Role:', payload.role);
}
```

#### **Vérifier les Données Utilisateur**
```javascript
const user = localStorage.getItem('user');
if (user) {
  console.log('User data:', JSON.parse(user));
}
```

#### **Vérifier l'État d'Authentification**
```javascript
// Dans la console React DevTools
// Chercher le composant AuthProvider
// Vérifier les valeurs de user, isAuthenticated, isLoading
```

### **8. Résultat Attendu**

✅ **Connexion admin** : Redirection automatique vers `/admin-dashboard`
✅ **Interface admin** : Toutes les sections accessibles
✅ **Navigation** : Header admin avec toutes les fonctionnalités
✅ **Protection** : Accès refusé pour les non-admins
✅ **Données** : Statistiques et données chargées correctement

## 🎯 **Résumé du Flux**

1. **Connexion** → Backend vérifie le rôle dans la DB
2. **Token JWT** → Contient le rôle `admin`
3. **Frontend** → Décode le token et détecte le rôle
4. **Redirection** → Automatique vers `/admin-dashboard`
5. **Interface** → Dashboard admin complet et fonctionnel

**Le système détecte maintenant correctement le rôle depuis la base de données et redirige vers la bonne page !** 🚀
