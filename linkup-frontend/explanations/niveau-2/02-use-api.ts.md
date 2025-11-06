# 🔌 **USE-API.TS - Hooks API et Logique Métier**

## 🎯 **Rôle du fichier**
Le fichier `hooks/use-api.ts` est le **cœur de la logique API** de LinkUp. Il fournit des hooks génériques et spécialisés pour toutes les interactions avec le backend, gérant les états de chargement, erreurs, et données.

## 🏗️ **Architecture et Structure**

### **1. Imports et Dépendances (Lignes 1-9)**

```typescript
import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient, ApiResponse } from '@/lib/api-client';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';
```

**Explication :**
- **React hooks** : useState, useEffect, useCallback, useMemo
- **apiClient** : Client API centralisé
- **ApiResponse** : Type de réponse standardisé
- **useToast** : Système de notifications
- **useAuth** : Contexte d'authentification

### **2. Hook Générique useApi (Lignes 12-76)**

```typescript
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  autoFetch: boolean = true,
  enabled: boolean = true
) {
  const deps = Array.isArray(dependencies) ? dependencies : [];
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
```

**Explication :**
- **Générique** : `<T>` pour typer les données
- **apiCall** : Fonction qui retourne une Promise
- **dependencies** : Tableau de dépendances pour useCallback
- **autoFetch** : Déclenchement automatique au montage
- **enabled** : Active/désactive le hook
- **États** : data, loading, error pour chaque requête

### **3. Fonction fetchData (Lignes 25-62)**

```typescript
const fetchData = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await apiCall();
    
    if (response.success) {
      setData(response.data || null);
    } else {
      const errorMsg = response.error || 'Une erreur est survenue';
      setError(errorMsg);
      
      // Ne pas afficher de toast pour les erreurs d'authentification
      if (!errorMsg.includes('Token manquant') && !errorMsg.includes('401')) {
        toast({
          title: 'Erreur',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
    setError(errorMessage);
    
    // Ne pas afficher de toast pour les erreurs d'authentification
    if (!errorMessage.includes('Token manquant') && !errorMessage.includes('401')) {
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  } finally {
    setLoading(false);
  }
}, deps);
```

**Explication :**
- **useCallback** : Mémorise la fonction pour éviter les re-renders
- **Gestion d'état** : loading, error, data
- **Gestion des erreurs** : Try/catch avec notifications
- **Filtrage des toasts** : Évite les notifications d'auth
- **Dependencies** : Re-crée la fonction si les deps changent

### **4. useEffect et Retour (Lignes 64-75)**

```typescript
useEffect(() => {
  if (autoFetch && enabled) {
    fetchData();
  }
}, [fetchData, autoFetch, enabled]);

return {
  data,
  loading,
  error,
  refetch: fetchData,
};
```

**Explication :**
- **Déclenchement automatique** : Si autoFetch et enabled
- **Dépendances** : fetchData, autoFetch, enabled
- **Retour** : data, loading, error, refetch
- **refetch** : Fonction pour relancer la requête

## 🔧 **Hook useMutation (Lignes 79-149)**

### **1. Interface et Paramètres**

```typescript
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showToast?: boolean;
  }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
```

**Explication :**
- **Générique** : `<T>` pour le type de retour, `<P>` pour les paramètres
- **mutationFn** : Fonction de mutation (POST, PUT, DELETE)
- **options** : Callbacks de succès/erreur et configuration
- **États** : loading et error pour la mutation

### **2. Fonction mutate**

```typescript
const mutate = useCallback(async (params: P) => {
  setLoading(true);
  setError(null);

  try {
    const response = await mutationFn(params);
    
    if (response.success) {
      if (options?.onSuccess) {
        options.onSuccess(response.data!);
      }
      if (options?.showToast !== false) {
        toast({
          title: 'Succès',
          description: response.message || 'Opération réussie',
          variant: 'default',
        });
      }
      return response.data;
    } else {
      const errorMessage = response.error || 'Une erreur est survenue';
      setError(errorMessage);
      if (options?.onError) {
        options.onError(errorMessage);
      }
      if (options?.showToast !== false) {
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      throw new Error(errorMessage);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
    setError(errorMessage);
    if (options?.onError) {
      options.onError(errorMessage);
    }
    if (options?.showToast !== false) {
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  } finally {
    setLoading(false);
  }
}, [mutationFn, options, toast]);
```

**Explication :**
- **Gestion d'état** : loading, error avec reset
- **Callbacks** : onSuccess, onError si fournis
- **Notifications** : Toast de succès/erreur (configurable)
- **Retour** : Données en cas de succès
- **Gestion d'erreurs** : Try/catch avec propagation

## 🚀 **Hooks Spécialisés**

### **1. Hooks pour les Emplois**

```typescript
export function useJobs(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  industry?: string;
  contract_type?: string;
  company?: string;
  minSalary?: string;
  experience?: string;
  workMode?: string;
  education?: string;
  enabled?: boolean;
}) {
  const memoizedFilters = useMemo(() => filters, [
    filters?.page, 
    filters?.limit, 
    filters?.search, 
    filters?.location, 
    filters?.industry, 
    filters?.contract_type,
    filters?.company,
    filters?.minSalary,
    filters?.experience,
    filters?.workMode,
    filters?.education,
    filters?.enabled
  ]);

  return useApi(
    () => apiClient.getJobs(memoizedFilters),
    [memoizedFilters],
    true,
    filters?.enabled !== false
  );
}
```

**Explication :**
- **Filtres complets** : Tous les paramètres de recherche
- **useMemo** : Mémorise les filtres pour éviter les re-renders
- **Dépendances** : Tous les paramètres de filtres
- **useApi** : Utilise le hook générique

### **2. Hooks pour les Entreprises**

```typescript
export function useCompanies(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  city?: string;
}) {
  return useApi(
    () => apiClient.getCompanies(filters),
    [
      filters?.page, 
      filters?.limit, 
      filters?.search, 
      filters?.industry,
      filters?.city
    ]
  );
}
```

**Explication :**
- **Filtres entreprise** : search, industry, city
- **Pagination** : page, limit
- **Dépendances** : Tous les paramètres de filtres

### **3. Hooks pour les Candidatures**

```typescript
export function useMyApplications(options?: { enabled?: boolean }) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getMyApplications(),
    [],
    isAuthenticated && (options?.enabled !== false),
    isAuthenticated && (options?.enabled !== false)
  );
}
```

**Explication :**
- **Authentification requise** : Vérifie isAuthenticated
- **Options** : enabled pour activer/désactiver
- **Sécurité** : Ne fait l'appel que si authentifié

### **4. Hooks de Mutation**

```typescript
export function useApplyToJob() {
  return useMutation(
    (jobId: number) => apiClient.applyToJob(jobId),
    {
      showToast: true,
    }
  );
}

export function useSaveJob() {
  return useMutation(
    (jobId: number) => apiClient.saveJob(jobId),
    {
      showToast: true,
    }
  );
}
```

**Explication :**
- **Mutations simples** : Une seule action
- **Notifications** : Toast de succès/erreur
- **Types** : Paramètres typés (jobId: number)

## 🔍 **Hooks Avancés**

### **1. Hooks avec Callbacks**

```typescript
export function useCreateJob() {
  return useMutation(
    (jobData: {
      title: string;
      description: string;
      location?: string;
      contract_type?: string;
      salary_min?: number;
      salary_max?: number;
      remote?: boolean;
      experience?: string;
      industry?: string;
      contract_duration?: string;
      working_time?: string;
      formation_required?: string;
      requirements?: string[];
      benefits?: string[];
      urgency?: string;
      education?: string;
      id_company?: number;
    }) => apiClient.createJob(jobData),
    {
      onSuccess: () => {
        console.log('Offre créée avec succès, les statistiques seront mises à jour');
      }
    }
  );
}
```

**Explication :**
- **Types complexes** : Interface détaillée pour jobData
- **onSuccess** : Callback personnalisé
- **Logique métier** : Actions après création

### **2. Hooks avec Authentification**

```typescript
export function useUserTrends(options?: { enabled?: boolean }) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.request('/users/me/stats/trends'),
    [],
    isAuthenticated && (options?.enabled !== false),
    isAuthenticated && (options?.enabled !== false)
  );
}
```

**Explication :**
- **Authentification** : Vérifie isAuthenticated
- **Route personnalisée** : /users/me/stats/trends
- **Sécurité** : Ne fait l'appel que si authentifié

## 🎯 **Patterns et Bonnes Pratiques**

### **1. Mémorisation des Filtres**

```typescript
const memoizedFilters = useMemo(() => filters, [
  filters?.page, 
  filters?.limit, 
  filters?.search,
  // ... autres dépendances
]);
```

**Avantages :**
- **Performance** : Évite les re-renders inutiles
- **Stabilité** : Référence stable des filtres
- **Optimisation** : useCallback avec deps stables

### **2. Gestion des Erreurs**

```typescript
// Ne pas afficher de toast pour les erreurs d'authentification
if (!errorMsg.includes('Token manquant') && !errorMsg.includes('401')) {
  toast({
    title: 'Erreur',
    description: errorMsg,
    variant: 'destructive',
  });
}
```

**Avantages :**
- **UX** : Évite les notifications d'auth
- **Sécurité** : Ne révèle pas les erreurs d'auth
- **Cohérence** : Gestion uniforme des erreurs

### **3. Types Stricts**

```typescript
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  autoFetch: boolean = true,
  enabled: boolean = true
)
```

**Avantages :**
- **Type safety** : Types stricts pour les données
- **IntelliSense** : Autocomplétion dans l'IDE
- **Erreurs à la compilation** : Détection précoce des erreurs

## 📊 **États et Flux de Données**

### **États d'un Hook API**
```typescript
interface ApiState<T> {
  data: T | null;           // Données récupérées
  loading: boolean;         // État de chargement
  error: string | null;     // Message d'erreur
  refetch: () => void;      // Fonction de rechargement
}
```

### **États d'une Mutation**
```typescript
interface MutationState<T> {
  mutate: (params: P) => Promise<T>;  // Fonction de mutation
  loading: boolean;                    // État de chargement
  error: string | null;                // Message d'erreur
}
```

### **Flux d'une Requête API**
```
1. Hook monté
   ↓
2. Vérification enabled
   ↓
3. Déclenchement autoFetch
   ↓
4. Appel API
   ↓
5. Gestion de la réponse
   ↓
6. Mise à jour de l'état
   ↓
7. Notification (si erreur)
```

## 🎯 **Résumé**

Le fichier `use-api.ts` est **essentiel** pour LinkUp car il :

1. **Centralise la logique API** : Hooks génériques et spécialisés
2. **Gère les états** : loading, error, data de manière cohérente
3. **Optimise les performances** : Mémorisation et dépendances
4. **Gère les erreurs** : Notifications et fallbacks
5. **Fournit la sécurité** : Authentification et autorisation
6. **Simplifie l'utilisation** : Interface simple pour les composants

C'est le **cœur de la communication** avec le backend et doit être maîtrisé pour comprendre toute l'application.

