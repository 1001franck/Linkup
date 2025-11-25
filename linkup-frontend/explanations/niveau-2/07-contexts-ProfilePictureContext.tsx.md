# 📁 CONTEXTS - ProfilePictureContext.tsx

## 🎯 **OBJECTIF PRINCIPAL**
Le `ProfilePictureContext` gère l'**état global de la photo de profil** de l'utilisateur connecté. Il synchronise automatiquement la photo avec les données récupérées depuis l'API.

---

## 🏗️ **ARCHITECTURE ET STRUCTURE**

### **1. Imports et Dépendances**
```typescript
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProfilePicture } from '@/hooks/use-api';
```

**Explication :**
- **"use client"** : Directive Next.js pour le rendu côté client
- **React Hooks** : `createContext`, `useContext` pour l'état global
- **useProfilePicture** : Hook personnalisé pour récupérer la photo depuis l'API
- **useState/useEffect** : Gestion d'état local et effets de bord

### **2. Interface du Contexte**
```typescript
interface ProfilePictureContextType {
  profilePicture: string | null;                    // URL de la photo
  setProfilePicture: (url: string | null) => void; // Fonction de mise à jour
  loading: boolean;                                 // État de chargement
}
```

**Points clés :**
- **Type simple** : Interface minimaliste avec 3 propriétés
- **URL nullable** : `string | null` pour gérer l'absence de photo
- **Fonction de setter** : Permet la mise à jour manuelle de la photo
- **État de chargement** : Pour l'UX (récupéré depuis le hook)

---

## 🔄 **FONCTIONNALITÉS PRINCIPALES**

### **1. Création du Contexte**
```typescript
const ProfilePictureContext = createContext<ProfilePictureContextType | undefined>(undefined);
```

**Explication :**
- **Type strict** : `ProfilePictureContextType | undefined`
- **Valeur par défaut** : `undefined` pour forcer l'utilisation du Provider
- **Pattern standard** : Suit les conventions React Context

### **2. Provider Component**
```typescript
export function ProfilePictureProvider({ children }: { children: React.ReactNode }) {
  const { data: profilePictureData, loading } = useProfilePicture();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
```

**Dépendances :**
- **useProfilePicture** : Hook pour récupérer la photo depuis l'API
- **État local** : `profilePicture` pour la gestion interne
- **Props children** : Pour le rendu des composants enfants

### **3. Synchronisation avec l'API**
```typescript
// Mettre à jour la photo depuis l'API
useEffect(() => {
  if (profilePictureData?.data?.profile_picture) {
    setProfilePicture(profilePictureData.data.profile_picture);
  } else {
    setProfilePicture(null);
  }
}, [profilePictureData]);
```

**Logique de synchronisation :**
- **Vérification des données** : `profilePictureData?.data?.profile_picture`
- **Chaining optionnel** : `?.` pour éviter les erreurs si les données sont undefined
- **Fallback** : `setProfilePicture(null)` si pas de photo
- **Dépendances** : `[profilePictureData]` pour réagir aux changements de l'API

---

## 🎣 **HOOK D'UTILISATION**

### **Hook useProfilePictureContext()**
```typescript
export function useProfilePictureContext() {
  const context = useContext(ProfilePictureContext);
  if (context === undefined) {
    throw new Error('useProfilePictureContext must be used within a ProfilePictureProvider');
  }
  return context;
}
```

**Sécurité :**
- **Vérification de contexte** : S'assure que le hook est utilisé dans un Provider
- **Erreur explicite** : Message d'erreur clair si mal utilisé
- **Type safety** : Retourne le bon type `ProfilePictureContextType`

---

## 🔧 **INTÉGRATION DANS L'APPLICATION**

### **1. Dans layout.tsx**
```typescript
<AuthProvider>
  <ProfilePictureProvider>  {/* Ici */}
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

**Ordre des Providers :**
- **AuthProvider** : Doit être en premier (dépendance)
- **ProfilePictureProvider** : Après AuthProvider (utilise l'API)
- **Autres Providers** : Peuvent utiliser ProfilePictureContext

### **2. Utilisation dans les composants**
```typescript
const { profilePicture, setProfilePicture, loading } = useProfilePictureContext();

return (
  <div>
    {loading ? (
      <div>Chargement de la photo...</div>
    ) : profilePicture ? (
      <img src={profilePicture} alt="Photo de profil" />
    ) : (
      <div>Pas de photo de profil</div>
    )}
  </div>
);
```

---

## 🚀 **POINTS FORTS DE L'ARCHITECTURE**

### **1. Intégration API**
- **Hook dédié** : `useProfilePicture` pour la logique API
- **Synchronisation automatique** : Se met à jour quand l'API change
- **Gestion du loading** : État de chargement récupéré depuis le hook

### **2. Simplicité**
- **Interface minimaliste** : Seulement 3 propriétés nécessaires
- **Logique claire** : Synchronisation simple avec l'API
- **Code concis** : 44 lignes seulement

### **3. Type Safety**
- **TypeScript strict** : Types définis pour toutes les propriétés
- **Vérification de contexte** : Erreur si mal utilisé
- **Chaining optionnel** : Protection contre les erreurs de données

### **4. Performance**
- **État local** : Pas de re-render inutile
- **Dépendances optimisées** : useEffect avec les bonnes dépendances
- **Pas de calculs lourds** : Logique simple et rapide

---

## ⚠️ **POINTS D'ATTENTION**

### **1. Dépendance sur useProfilePicture**
```typescript
const { data: profilePictureData, loading } = useProfilePicture();
```

**Risque :**
- **Couplage fort** : Dépend directement du hook API
- **Propagation d'erreur** : Si le hook échoue, le contexte aussi
- **Ordre d'initialisation** : Le hook doit être initialisé avant le contexte

### **2. Gestion des Données API**
```typescript
if (profilePictureData?.data?.profile_picture) {
  setProfilePicture(profilePictureData.data.profile_picture);
} else {
  setProfilePicture(null);
}
```

**Points d'attention :**
- **Chaining optionnel** : `?.` nécessaire car les données peuvent être undefined
- **Structure imbriquée** : `data.profile_picture` dans la réponse API
- **Fallback** : `setProfilePicture(null)` si pas de photo

### **3. État de Loading Non Utilisé**
```typescript
const [profilePicture, setProfilePicture] = useState<string | null>(null);
// loading est récupéré depuis useProfilePicture mais pas utilisé dans le contexte
```

**Problème :**
- **État inutilisé** : `loading` est récupéré mais pas exposé dans le contexte
- **Incohérence** : L'état existe mais n'est pas accessible
- **UX dégradée** : Pas de feedback de chargement pour l'utilisateur

---

## 🔄 **FLUX DE DONNÉES**

### **1. Initialisation**
```
1. ProfilePictureProvider se monte
2. useProfilePicture() est appelé
3. Hook fait l'appel API
4. profilePictureData est mis à jour
5. useEffect se déclenche
6. setProfilePicture() met à jour l'état local
7. Composants re-rendent avec la photo
```

### **2. Mise à Jour de la Photo**
```
1. Utilisateur change sa photo de profil
2. API est appelée pour sauvegarder
3. useProfilePicture() refetch les données
4. profilePictureData est mis à jour
5. useEffect se déclenche
6. setProfilePicture() met à jour l'état local
7. Composants re-rendent avec la nouvelle photo
```

### **3. Suppression de la Photo**
```
1. Utilisateur supprime sa photo de profil
2. API est appelée pour supprimer
3. useProfilePicture() refetch les données
4. profilePictureData devient null
5. useEffect se déclenche
6. setProfilePicture(null) met à jour l'état local
7. Composants re-rendent sans photo
```

---

## 📊 **COMPARAISON AVEC AUTRES CONTEXTES**

| Aspect | ProfilePictureContext | AuthContext | CompanyLogoContext |
|--------|----------------------|-------------|-------------------|
| **Complexité** | Moyenne | Élevée | Simple |
| **Dépendances** | useProfilePicture | Aucune | AuthContext |
| **API calls** | 1 (useProfilePicture) | Nombreuses | Aucune |
| **Synchronisation** | Automatique | Manuelle | Automatique |
| **État de loading** | Récupéré | Géré | Non utilisé |

---

## 🛠️ **AMÉLIORATIONS POSSIBLES**

### **1. Exposer l'État de Loading**
```typescript
return (
  <ProfilePictureContext.Provider value={{
    profilePicture,
    setProfilePicture,
    loading  // Exposer loading
  }}>
    {children}
  </ProfilePictureContext.Provider>
);
```

### **2. Ajouter la Gestion d'Erreur**
```typescript
const { data: profilePictureData, loading, error } = useProfilePicture();

// Dans le contexte
interface ProfilePictureContextType {
  profilePicture: string | null;
  setProfilePicture: (url: string | null) => void;
  loading: boolean;
  error: string | null;  // Ajouter error
}

// Dans le Provider
return (
  <ProfilePictureContext.Provider value={{
    profilePicture,
    setProfilePicture,
    loading,
    error
  }}>
    {children}
  </ProfilePictureContext.Provider>
);
```

### **3. Ajouter la Validation d'URL**
```typescript
const isValidImageUrl = (url: string | null): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  } catch {
    return false;
  }
};

// Dans le useEffect
if (profilePictureData?.data?.profile_picture && 
    isValidImageUrl(profilePictureData.data.profile_picture)) {
  setProfilePicture(profilePictureData.data.profile_picture);
} else {
  setProfilePicture(null);
}
```

### **4. Ajouter la Mise en Cache**
```typescript
const [cachedPicture, setCachedPicture] = useState<string | null>(null);

// Dans le useEffect
if (profilePictureData?.data?.profile_picture) {
  const newPicture = profilePictureData.data.profile_picture;
  if (newPicture !== cachedPicture) {
    setProfilePicture(newPicture);
    setCachedPicture(newPicture);
  }
} else {
  setProfilePicture(null);
  setCachedPicture(null);
}
```

---

## 📊 **RÉSUMÉ TECHNIQUE**

| Aspect | Détail |
|--------|--------|
| **Lignes de code** | 44 lignes |
| **Complexité** | Moyenne |
| **Dépendances** | useProfilePicture |
| **Performance** | Bonne |
| **Maintenabilité** | Bonne |
| **Réutilisabilité** | Élevée |

**Le ProfilePictureContext est un contexte efficace pour gérer l'état global de la photo de profil, avec une synchronisation automatique basée sur les données de l'API.**
