# 📁 CONTEXTS - CompanyLogoContext.tsx

## 🎯 **OBJECTIF PRINCIPAL**
Le `CompanyLogoContext` gère l'**état global du logo d'entreprise** dans l'application. Il synchronise automatiquement le logo avec les données de l'entreprise connectée.

---

## 🏗️ **ARCHITECTURE ET STRUCTURE**

### **1. Imports et Dépendances**
```typescript
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
```

**Explication :**
- **"use client"** : Directive Next.js pour le rendu côté client
- **React Hooks** : `createContext`, `useContext` pour l'état global
- **useAuth** : Dépendance sur le contexte d'authentification
- **useState/useEffect** : Gestion d'état local et effets de bord

### **2. Interface du Contexte**
```typescript
interface CompanyLogoContextType {
  logo: string | null;                    // URL du logo
  setLogo: (url: string | null) => void; // Fonction de mise à jour
  loading: boolean;                       // État de chargement
}
```

**Points clés :**
- **Type simple** : Interface minimaliste avec 3 propriétés
- **URL nullable** : `string | null` pour gérer l'absence de logo
- **Fonction de setter** : Permet la mise à jour manuelle du logo
- **État de chargement** : Pour l'UX (bien que non utilisé actuellement)

---

## 🔄 **FONCTIONNALITÉS PRINCIPALES**

### **1. Création du Contexte**
```typescript
const CompanyLogoContext = createContext<CompanyLogoContextType | undefined>(undefined);
```

**Explication :**
- **Type strict** : `CompanyLogoContextType | undefined`
- **Valeur par défaut** : `undefined` pour forcer l'utilisation du Provider
- **Pattern standard** : Suit les conventions React Context

### **2. Provider Component**
```typescript
export function CompanyLogoProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
```

**Dépendances :**
- **useAuth** : Accès aux données d'authentification
- **État local** : `logo` et `loading` pour la gestion interne
- **Props children** : Pour le rendu des composants enfants

### **3. Synchronisation Automatique**
```typescript
// Mettre à jour le logo depuis les données de l'entreprise
useEffect(() => {
  if (isAuthenticated && user && 'logo' in user) {
    setLogo(user.logo || null);
  } else {
    setLogo(null);
  }
}, [user, isAuthenticated]);
```

**Logique de synchronisation :**
- **Vérification d'auth** : `isAuthenticated && user`
- **Type guard** : `'logo' in user` pour s'assurer que c'est une entreprise
- **Fallback** : `user.logo || null` pour gérer les valeurs undefined
- **Nettoyage** : `setLogo(null)` si pas d'entreprise connectée
- **Dépendances** : `[user, isAuthenticated]` pour réagir aux changements

---

## 🎣 **HOOK D'UTILISATION**

### **Hook useCompanyLogoContext()**
```typescript
export function useCompanyLogoContext() {
  const context = useContext(CompanyLogoContext);
  if (context === undefined) {
    throw new Error('useCompanyLogoContext must be used within a CompanyLogoProvider');
  }
  return context;
}
```

**Sécurité :**
- **Vérification de contexte** : S'assure que le hook est utilisé dans un Provider
- **Erreur explicite** : Message d'erreur clair si mal utilisé
- **Type safety** : Retourne le bon type `CompanyLogoContextType`

---

## 🔧 **INTÉGRATION DANS L'APPLICATION**

### **1. Dans layout.tsx**
```typescript
<AuthProvider>
  <ProfilePictureProvider>
    <CompanyLogoProvider>  {/* Ici */}
      <JobsInteractionsProvider>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </JobsInteractionsProvider>
    </CompanyLogoProvider>
  </ProfilePictureProvider>
</AuthProvider>
```

**Ordre des Providers :**
- **AuthProvider** : Doit être en premier (dépendance)
- **CompanyLogoProvider** : Après AuthProvider (utilise useAuth)
- **Autres Providers** : Peuvent utiliser CompanyLogoContext

### **2. Utilisation dans les composants**
```typescript
const { logo, setLogo, loading } = useCompanyLogoContext();

return (
  <div>
    {logo ? (
      <img src={logo} alt="Logo entreprise" />
    ) : (
      <div>Pas de logo</div>
    )}
  </div>
);
```

---

## 🚀 **POINTS FORTS DE L'ARCHITECTURE**

### **1. Simplicité**
- **Interface minimaliste** : Seulement 3 propriétés nécessaires
- **Logique claire** : Synchronisation automatique simple
- **Code concis** : 45 lignes seulement

### **2. Réactivité**
- **Synchronisation automatique** : Se met à jour quand l'utilisateur change
- **Gestion des états** : Auth, pas d'auth, changement d'entreprise
- **Nettoyage automatique** : Logo supprimé si déconnexion

### **3. Type Safety**
- **TypeScript strict** : Types définis pour toutes les propriétés
- **Vérification de contexte** : Erreur si mal utilisé
- **Type guard** : Vérification du type d'utilisateur

### **4. Performance**
- **État local** : Pas de re-render inutile
- **Dépendances optimisées** : useEffect avec les bonnes dépendances
- **Pas de calculs lourds** : Logique simple et rapide

---

## ⚠️ **POINTS D'ATTENTION**

### **1. Dépendance sur AuthContext**
```typescript
const { user, isAuthenticated } = useAuth();
```

**Risque :**
- **Couplage fort** : Dépend directement d'AuthContext
- **Ordre des Providers** : Doit être après AuthProvider
- **Propagation d'erreur** : Si AuthContext échoue, ce contexte aussi

### **2. Gestion des Types**
```typescript
if (isAuthenticated && user && 'logo' in user) {
  setLogo(user.logo || null);
}
```

**Points d'attention :**
- **Type guard** : `'logo' in user` nécessaire car `user` peut être `User | Company`
- **Fallback** : `|| null` pour gérer les valeurs undefined
- **Vérification d'auth** : Double vérification nécessaire

### **3. État de Loading Non Utilisé**
```typescript
const [loading, setLoading] = useState(false);
```

**Problème :**
- **État inutilisé** : `loading` est défini mais jamais modifié
- **API non utilisée** : `setLoading` n'est jamais appelé
- **Incohérence** : L'état existe mais n'est pas fonctionnel

---

## 🔄 **FLUX DE DONNÉES**

### **1. Connexion d'une Entreprise**
```
1. AuthContext détecte connexion entreprise
2. user devient Company avec logo
3. CompanyLogoContext useEffect se déclenche
4. 'logo' in user = true
5. setLogo(user.logo || null)
6. Composants re-rendent avec nouveau logo
```

### **2. Déconnexion**
```
1. AuthContext nettoie user
2. user devient null
3. CompanyLogoContext useEffect se déclenche
4. isAuthenticated = false
5. setLogo(null)
6. Composants re-rendent sans logo
```

### **3. Changement d'Entreprise**
```
1. AuthContext change user
2. Nouvelle Company avec nouveau logo
3. CompanyLogoContext useEffect se déclenche
4. setLogo(nouveauLogo)
5. Composants re-rendent avec nouveau logo
```

---

## 📊 **COMPARAISON AVEC AUTRES CONTEXTES**

| Aspect | CompanyLogoContext | AuthContext | ProfilePictureContext |
|--------|-------------------|-------------|----------------------|
| **Complexité** | Simple | Élevée | Moyenne |
| **Dépendances** | AuthContext | Aucune | useApi |
| **État** | 2 variables | 3 variables | 2 variables |
| **API calls** | Aucune | Nombreuses | 1 (useProfilePicture) |
| **Synchronisation** | Automatique | Manuelle | Automatique |

---

## 🛠️ **AMÉLIORATIONS POSSIBLES**

### **1. Utiliser l'État Loading**
```typescript
// Dans le useEffect
setLoading(true);
if (isAuthenticated && user && 'logo' in user) {
  setLogo(user.logo || null);
} else {
  setLogo(null);
}
setLoading(false);
```

### **2. Ajouter la Validation d'URL**
```typescript
const isValidUrl = (url: string | null): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Dans le useEffect
if (isAuthenticated && user && 'logo' in user && isValidUrl(user.logo)) {
  setLogo(user.logo);
}
```

### **3. Ajouter la Gestion d'Erreur**
```typescript
const [error, setError] = useState<string | null>(null);

// Dans le useEffect
try {
  if (isAuthenticated && user && 'logo' in user) {
    setLogo(user.logo || null);
    setError(null);
  } else {
    setLogo(null);
    setError(null);
  }
} catch (err) {
  setError('Erreur lors du chargement du logo');
  setLogo(null);
}
```

---

## 📊 **RÉSUMÉ TECHNIQUE**

| Aspect | Détail |
|--------|--------|
| **Lignes de code** | 45 lignes |
| **Complexité** | Simple |
| **Dépendances** | AuthContext |
| **Performance** | Excellente |
| **Maintenabilité** | Bonne |
| **Réutilisabilité** | Élevée |

**Le CompanyLogoContext est un contexte simple et efficace pour gérer l'état global du logo d'entreprise, avec une synchronisation automatique basée sur l'état d'authentification.**
