# 📁 CONTEXTS - AuthContext.tsx

## 🎯 **OBJECTIF PRINCIPAL**
Le `AuthContext` est le **cœur de l'authentification** de l'application LinkUp. Il gère centralement l'état de connexion des utilisateurs, entreprises et administrateurs.

---

## 🏗️ **ARCHITECTURE ET STRUCTURE**

### **1. Imports et Dépendances**
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { User, Company } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
```

**Explication :**
- **React Hooks** : `createContext`, `useContext` pour la gestion d'état global
- **apiClient** : Client API centralisé pour les requêtes backend
- **Types** : `User` et `Company` pour le typage strict
- **useToast** : Système de notifications

### **2. Interface du Contexte**
```typescript
interface AuthContextType {
  user: User | Company | null;           // Utilisateur connecté
  isAuthenticated: boolean;              // État de connexion
  isLoading: boolean;                    // État de chargement
  login: (email: string, password: string) => Promise<boolean>;
  loginCompany: (recruiter_mail: string, password: string) => Promise<boolean>;
  logout: () => void;                    // Déconnexion
  updateUser: (userData: Partial<User | Company>) => void;
  refreshUser: () => Promise<void>;      // Rafraîchir les données
}
```

**Points clés :**
- **Union Type** : `User | Company | null` pour supporter différents types d'utilisateurs
- **Méthodes asynchrones** : `login` et `loginCompany` retournent des `Promise<boolean>`
- **Méthodes de mise à jour** : `updateUser` et `refreshUser` pour la synchronisation

---

## 🔐 **FONCTIONNALITÉS PRINCIPALES**

### **1. Vérification Automatique d'Authentification**
```typescript
useEffect(() => {
  const checkAuth = async () => {
    const token = apiClient.getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    // Décoder le token JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    
    // Redirection selon le rôle
    if (userRole === 'admin') {
      // Logique admin
    } else if (userRole === 'company') {
      // Logique entreprise
    } else {
      // Logique utilisateur normal
    }
  };
  checkAuth();
}, []);
```

**Explication :**
- **Auto-vérification** : Au chargement de l'app, vérifie si un token existe
- **Décodage JWT** : Utilise `atob()` pour décoder le payload du token
- **Routage par rôle** : Appelle la bonne API selon le type d'utilisateur

### **2. Connexion Utilisateur**
```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setIsLoading(true);
    apiClient.clearToken(); // Nettoyer avant nouvelle connexion
    
    const response = await apiClient.loginUser({ email, password });
    
    if (response.success && response.data?.token) {
      if (response.data.user) {
        const userWithRole = { ...response.data.user, role: response.data.user.role };
        setUser(userWithRole);
        
        toast({
          title: 'Connexion réussie',
          description: `Bienvenue ${response.data.user.firstname} !`,
          variant: 'default',
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    // Gestion d'erreur avec toast
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

**Points clés :**
- **Nettoyage préalable** : `apiClient.clearToken()` avant nouvelle connexion
- **Gestion des rôles** : S'assure que le rôle est propagé correctement
- **Feedback utilisateur** : Toast de confirmation/erreur
- **Gestion d'erreur robuste** : Try/catch avec nettoyage

### **3. Connexion Entreprise**
```typescript
const loginCompany = async (recruiter_mail: string, password: string): Promise<boolean> => {
  try {
    setIsLoading(true);
    const response = await apiClient.loginCompany({ recruiter_mail, password });
    
    if (response.success && response.data?.token) {
      if (response.data.company) {
        setUser(response.data.company);
        toast({
          title: 'Connexion réussie',
          description: `Bienvenue ${response.data.company.name} !`,
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    // Gestion d'erreur
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

**Différences avec login utilisateur :**
- **Paramètre différent** : `recruiter_mail` au lieu de `email`
- **API différente** : `apiClient.loginCompany()` au lieu de `loginUser()`
- **Type de données** : `Company` au lieu de `User`

### **4. Déconnexion Intelligente**
```typescript
const logout = async () => {
  try {
    // Détection du type d'utilisateur
    let isCompany = false;
    
    if (user) {
      isCompany = 'id_company' in user || 'recruiter_mail' in user;
    } else {
      // Fallback : vérifier le token
      const token = apiClient.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        isCompany = payload.role === 'company';
      }
    }
    
    // Appel de la bonne route de déconnexion
    if (isCompany) {
      await apiClient.logoutCompany();
    } else {
      await apiClient.logout();
    }
    
    // Nettoyage et redirection
    setUser(null);
    window.location.href = '/';
  } catch (error) {
    // Nettoyage forcé en cas d'erreur
    apiClient.setToken(null);
    setUser(null);
    window.location.href = '/';
  }
};
```

**Intelligence de la déconnexion :**
- **Détection automatique** : Détermine le type d'utilisateur
- **Double fallback** : Vérifie d'abord l'état, puis le token
- **API appropriée** : Appelle la bonne route de déconnexion
- **Nettoyage complet** : État + token + redirection

---

## 🔄 **GESTION D'ÉTAT ET SYNCHRONISATION**

### **1. Mise à Jour des Données**
```typescript
const updateUser = (userData: Partial<User | Company>) => {
  if (user) {
    setUser({ ...user, ...userData });
  }
};
```

**Utilisation :**
- **Mise à jour optimiste** : Met à jour l'état local immédiatement
- **Type partiel** : `Partial<User | Company>` permet des mises à jour partielles
- **Merge intelligent** : `{ ...user, ...userData }` préserve les données existantes

### **2. Rafraîchissement du Profil**
```typescript
const refreshUser = async () => {
  try {
    const token = apiClient.getToken();
    if (!token) return;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    
    if (userRole === 'company') {
      const response = await apiClient.getCurrentCompany();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } else {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    }
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error);
  }
};
```

**Cas d'usage :**
- **Synchronisation** : Après modification du profil
- **Récupération d'erreur** : En cas de problème de synchronisation
- **Mise à jour des rôles** : Si les permissions ont changé

---

## 🎣 **HOOK D'UTILISATION**

### **Hook useAuth()**
```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}
```

**Sécurité :**
- **Vérification de contexte** : S'assure que le hook est utilisé dans un `AuthProvider`
- **Erreur explicite** : Message d'erreur clair si mal utilisé
- **Type safety** : Retourne le bon type `AuthContextType`

---

## 🔧 **INTÉGRATION DANS L'APPLICATION**

### **1. Dans layout.tsx**
```typescript
<AuthProvider>
  <ProfilePictureProvider>
    <CompanyLogoProvider>
      <JobsInteractionsProvider>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </JobsInteractionsProvider>
    </CompanyLogoProvider>
  </ProfilePictureProvider>
</AuthProvider>
```

### **2. Utilisation dans les composants**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();

if (!isAuthenticated) {
  return <LoginForm onLogin={login} />;
}

return <Dashboard user={user} onLogout={logout} />;
```

---

## 🚀 **POINTS FORTS DE L'ARCHITECTURE**

### **1. Sécurité**
- **JWT décodage** : Vérification côté client du token
- **Nettoyage automatique** : Token supprimé en cas d'erreur
- **Validation des rôles** : Vérification constante du type d'utilisateur

### **2. Performance**
- **État local** : Pas de re-render inutile
- **Lazy loading** : Vérification d'auth seulement au chargement
- **Mise à jour optimiste** : UI réactive immédiatement

### **3. Maintenabilité**
- **Types stricts** : TypeScript pour la sécurité
- **Séparation des responsabilités** : Chaque méthode a un rôle précis
- **Gestion d'erreur centralisée** : Logs et toasts cohérents

### **4. Expérience Utilisateur**
- **Feedback immédiat** : Toasts pour toutes les actions
- **Redirection intelligente** : Selon le type d'utilisateur
- **Persistance de session** : Reconnexion automatique

---

## ⚠️ **POINTS D'ATTENTION**

### **1. Sécurité**
- **JWT côté client** : Le décodage se fait côté client (normal pour JWT)
- **Token storage** : Stocké dans les cookies (géré par apiClient)
- **Validation backend** : Le vrai contrôle se fait côté serveur

### **2. Performance**
- **Re-renders** : Chaque changement d'état provoque un re-render
- **API calls** : Vérification d'auth à chaque chargement
- **Memory leaks** : Pas de cleanup des listeners (normal pour ce cas)

### **3. Gestion d'erreur**
- **Fallback robuste** : En cas d'erreur, nettoyage forcé
- **Logs détaillés** : Console.error pour le debugging
- **UX dégradée** : Redirection même en cas d'erreur

---

## 📊 **RÉSUMÉ TECHNIQUE**

| Aspect | Détail |
|--------|--------|
| **Lignes de code** | 486 lignes |
| **Complexité** | Élevée (gestion multi-rôles) |
| **Dépendances** | apiClient, useToast, types |
| **Performance** | Bonne (état local) |
| **Sécurité** | Bonne (JWT + validation) |
| **Maintenabilité** | Excellente (types + docs) |

**Le AuthContext est le pilier central de l'authentification dans LinkUp, gérant de manière robuste et sécurisée l'état de connexion des utilisateurs, entreprises et administrateurs.**
