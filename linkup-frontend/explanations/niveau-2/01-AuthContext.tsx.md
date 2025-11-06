# 🔐 **AUTHCONTEXT.TSX - Gestion de l'Authentification**

## 🎯 **Rôle du fichier**
Le fichier `contexts/AuthContext.tsx` est le **cœur de l'authentification** de l'application LinkUp. Il gère la connexion/déconnexion des utilisateurs et entreprises, la persistance des sessions, et l'état d'authentification global.

## 🏗️ **Architecture et Structure**

### **1. Imports et Dépendances (Lignes 1-35)**

```typescript
"use client";  // Composant côté client

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { User, Company } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
```

**Explication :**
- **"use client"** : Composant côté client (nécessaire pour Next.js 13+)
- **React hooks** : useState, useEffect pour la gestion d'état
- **apiClient** : Client API pour les requêtes backend
- **Types** : User et Company pour le typage strict
- **useToast** : Système de notifications

### **2. Interface TypeScript (Lignes 47-64)**

```typescript
interface AuthContextType {
  /** Utilisateur actuellement connecté (null si non connecté) */
  user: User | Company | null;
  /** Indique si l'utilisateur est authentifié */
  isAuthenticated: boolean;
  /** Indique si le chargement est en cours */
  isLoading: boolean;
  /** Fonction de connexion utilisateur */
  login: (email: string, password: string) => Promise<boolean>;
  /** Fonction de connexion entreprise */
  loginCompany: (recruiter_mail: string, password: string) => Promise<boolean>;
  /** Fonction de déconnexion */
  logout: () => void;
  /** Fonction de mise à jour des données utilisateur */
  updateUser: (userData: Partial<User | Company>) => void;
  /** Fonction de rafraîchissement du profil */
  refreshUser: () => Promise<void>;
}
```

**Explication :**
- **user** : Utilisateur connecté (User ou Company)
- **isAuthenticated** : Boolean calculé automatiquement
- **isLoading** : État de chargement pour les requêtes
- **login/loginCompany** : Connexion selon le type d'utilisateur
- **logout** : Déconnexion et nettoyage
- **updateUser/refreshUser** : Gestion des données utilisateur

### **3. Création du Contexte (Lignes 70-79)**

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
```

**Explication :**
- **createContext** : Création du contexte React
- **AuthProvider** : Composant provider qui enveloppe l'app
- **useState** : Gestion de l'état local (user, loading)
- **useToast** : Hook pour les notifications

## 🔍 **Fonctionnalités Principales**

### **1. Vérification d'Authentification au Chargement (Lignes 82-159)**

```typescript
useEffect(() => {
  const checkAuth = async () => {
    try {
      const token = apiClient.getToken();
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Décoder le token pour déterminer le type d'utilisateur
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;
      
      if (userRole === 'admin') {
        // Pour les admins, récupérer les données utilisateur
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          const adminUser = { ...response.data, role: 'admin' };
          setUser(adminUser);
        }
      } else if (userRole === 'company') {
        // Pour les entreprises
        const response = await apiClient.getCurrentCompany();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } else {
        // Utilisateur normal
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      apiClient.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  checkAuth();
}, []);
```

**Explication :**
- **useEffect** : Se déclenche au montage du composant
- **getToken()** : Récupère le token depuis les cookies
- **Décodage JWT** : Parse le token pour déterminer le rôle
- **Gestion des rôles** : Admin, Company, User avec routes différentes
- **Gestion d'erreurs** : Nettoyage en cas d'erreur

### **2. Connexion Utilisateur (Lignes 170-246)**

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setIsLoading(true);
    
    // Nettoyer tout token existant
    apiClient.clearToken();
    
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
      } else {
        // Fallback : récupérer les infos utilisateur
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          return true;
        }
      }
    } else {
      toast({
        title: 'Erreur de connexion',
        description: response.error || 'Erreur lors de la connexion',
        variant: 'destructive',
      });
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    apiClient.clearToken();
    
    toast({
      title: 'Erreur de connexion',
      description: errorMessage,
      variant: 'destructive',
    });
    
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

**Explication :**
- **clearToken()** : Nettoie les tokens existants
- **loginUser()** : Appel API de connexion
- **Gestion des réponses** : Succès avec données utilisateur
- **Fallback** : Récupération des infos si pas dans la réponse
- **Notifications** : Toast de succès/erreur
- **Gestion d'erreurs** : Try/catch avec nettoyage

### **3. Connexion Entreprise (Lignes 257-316)**

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
          variant: 'default',
        });
        
        return true;
      } else {
        // Fallback : récupérer les infos entreprise
        const companyResponse = await apiClient.getCurrentCompany();
        if (companyResponse.success && companyResponse.data) {
          setUser(companyResponse.data);
          return true;
        }
      }
    } else {
      toast({
        title: 'Erreur de connexion',
        description: response.error || 'Erreur lors de la connexion',
        variant: 'destructive',
      });
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la connexion entreprise:', error);
    
    toast({
      title: 'Erreur de connexion',
      description: errorMessage,
      variant: 'destructive',
    });
    
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

**Explication :**
- **loginCompany()** : Route spécifique pour les entreprises
- **recruiter_mail** : Email du recruteur (pas l'email utilisateur)
- **Gestion des données** : Company au lieu de User
- **Même logique** : Fallback et gestion d'erreurs identiques

### **4. Déconnexion Dynamique (Lignes 326-394)**

```typescript
const logout = async () => {
  try {
    // Détection du type d'utilisateur
    let isCompany = false;
    
    if (user) {
      // Vérifier si c'est une entreprise
      isCompany = 'id_company' in user || 'recruiter_mail' in user;
    } else {
      // Fallback : vérifier le token
      const token = apiClient.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          isCompany = payload.role === 'company';
        } catch (error) {
          console.warn('Impossible de décoder le token');
        }
      }
    }
    
    // Appel de la bonne route de déconnexion
    if (isCompany) {
      await apiClient.logoutCompany();
    } else {
      await apiClient.logout();
    }
    
    // Nettoyage de l'état
    setUser(null);
    
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès',
      variant: 'default',
    });
    
    // Redirection vers l'accueil
    window.location.href = '/';
    
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    
    // En cas d'erreur, forcer le nettoyage côté client
    apiClient.setToken(null);
    setUser(null);
    
    window.location.href = '/';
  }
};
```

**Explication :**
- **Détection automatique** : Détermine le type d'utilisateur
- **Routes différentes** : logout() vs logoutCompany()
- **Nettoyage complet** : État local + cookies + API
- **Redirection** : Retour à la page d'accueil
- **Gestion d'erreurs** : Nettoyage forcé en cas d'échec

### **5. Gestion des Données Utilisateur (Lignes 403-438)**

```typescript
const updateUser = (userData: Partial<User | Company>) => {
  if (user) {
    setUser({ ...user, ...userData });
  }
};

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

**Explication :**
- **updateUser** : Mise à jour locale des données
- **refreshUser** : Récupération depuis l'API
- **Gestion des rôles** : Routes différentes selon le type
- **Optimisation** : Mise à jour seulement si nécessaire

## 🔧 **Hook useAuth (Lignes 477-485)**

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}
```

**Explication :**
- **useContext** : Accès au contexte d'authentification
- **Vérification** : S'assure que le hook est dans un AuthProvider
- **Erreur explicite** : Message d'erreur clair si mal utilisé
- **Type safety** : Retourne le contexte typé

## 🚀 **Utilisation dans l'Application**

### **1. Wrapper de l'Application**
```typescript
// app/layout.tsx
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

### **2. Utilisation dans les Composants**
```typescript
// Dans un composant
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }
  
  return <div>Bonjour {user?.firstname} !</div>;
}
```

### **3. Protection des Routes**
```typescript
// components/auth/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
}
```

## 🔒 **Sécurité et Bonnes Pratiques**

### **1. Gestion des Tokens**
- **Stockage sécurisé** : Cookies avec expiration
- **Nettoyage automatique** : En cas d'erreur ou déconnexion
- **Validation** : Vérification de la validité du token

### **2. Gestion des Rôles**
- **Détection automatique** : Via le payload JWT
- **Routes spécifiques** : API différentes selon le rôle
- **Sécurité** : Vérification côté serveur

### **3. Gestion d'Erreurs**
- **Try/catch** : Gestion complète des erreurs
- **Fallbacks** : Solutions de secours
- **Notifications** : Feedback utilisateur

## 📊 **États et Flux de Données**

### **États du Contexte**
```typescript
interface AuthState {
  user: User | Company | null;        // Utilisateur connecté
  isAuthenticated: boolean;           // Calculé : !!user
  isLoading: boolean;                 // État de chargement
}
```

### **Actions Disponibles**
```typescript
interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  loginCompany: (recruiter_mail: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User | Company>) => void;
  refreshUser: () => Promise<void>;
}
```

### **Flux d'Authentification**
```
1. Chargement de l'app
   ↓
2. Vérification du token
   ↓
3. Décodage du JWT
   ↓
4. Détermination du rôle
   ↓
5. Récupération des données
   ↓
6. Mise à jour de l'état
```

## 🎯 **Résumé**

Le fichier `AuthContext.tsx` est **essentiel** pour LinkUp car il :

1. **Gère l'authentification** : Connexion/déconnexion des utilisateurs et entreprises
2. **Persiste les sessions** : Tokens JWT avec cookies sécurisés
3. **Gère les rôles** : User, Company, Admin avec routes spécifiques
4. **Fournit l'état global** : Accessible dans toute l'application
5. **Gère les erreurs** : Notifications et nettoyage automatique
6. **Optimise les performances** : Évite les re-renders inutiles

C'est le **cœur de la sécurité** de l'application et doit être maîtrisé en priorité.

