# 🏢 Mise à jour du bouton "Découvrir" - Page Entreprises

## 📋 Résumé des modifications

Le bouton "Suivre" a été remplacé par "Découvrir" et redirige maintenant vers la page de présentation de l'entreprise au lieu d'ouvrir un modal.

## 🔧 Fichiers modifiés

### 1. **CompanyCard (`company-card.tsx`)**
- ✅ **Supprimé** : Props `onViewDetails` et `isFollowed`
- ✅ **Modifié** : `handleViewDetails` redirige vers `/companies/{id}`
- ✅ **Simplifié** : Interface des props nettoyée

### 2. **useCompaniesInteractions (`use-companies-interactions.ts`)**
- ✅ **Supprimé** : Action `showCompanyDetails`
- ✅ **Nettoyé** : Interface des actions simplifiée

### 3. **CompaniesPage (`page.tsx`)**
- ✅ **Supprimé** : Prop `onViewDetails` des CompanyCard

## 🎯 Fonctionnalité du bouton "Découvrir"

### **Comportement :**
```typescript
const handleViewDetails = useCallback(() => {
  // Redirection vers la page de présentation de l'entreprise
  window.location.href = `/companies/${company.id}`;
}, [company.id]);
```

### **URL générée :**
- **Format** : `/companies/{id}`
- **Exemple** : `/companies/123` pour l'entreprise avec l'ID 123

## 🚀 Actions disponibles sur chaque carte d'entreprise

1. **"Voir les offres"** → Redirige vers `/jobs?company={id}`
2. **"Découvrir"** → Redirige vers `/companies/{id}` (page de présentation)
3. **"Contacter"** → Ouvre le formulaire de contact (modal)
4. **"Partager"** → Partage l'entreprise (clipboard/navigator.share)

## 📝 Notes techniques

- **Redirection** : Utilise `window.location.href` pour une navigation complète
- **Performance** : Pas d'impact sur les performances (redirection simple)
- **UX** : Navigation cohérente vers une page dédiée
- **SEO** : URLs propres et indexables

## 🎉 Résultat

Le bouton "Découvrir" offre maintenant une expérience utilisateur plus cohérente en redirigeant vers une page de présentation dédiée de l'entreprise, plutôt qu'un modal limité.
