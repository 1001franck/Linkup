# 🔥 **NIVEAU 2 - FONCTIONNALITÉS PRINCIPALES**

## 🎯 **Objectif**
Analyser les fichiers les plus importants pour le fonctionnement de l'application LinkUp :
- Pages principales (Dashboard, Jobs, Companies, Applications)
- Hooks API et logique métier
- Contextes d'état global
- Authentification et sécurité

## 📁 **Fichiers du Niveau 2**

### **Pages Principales**
- `app/(routes)/dashboard/page.tsx` - Dashboard candidat
- `app/(routes)/jobs/page.tsx` - Liste des emplois
- `app/(routes)/companies/page.tsx` - Liste des entreprises
- `app/(routes)/my-applications/page.tsx` - Candidatures utilisateur
- `app/(routes)/company-dashboard/page.tsx` - Dashboard entreprise
- `app/(routes)/login/page.tsx` - Connexion
- `app/(routes)/register/page.tsx` - Inscription

### **Hooks API et Logique Métier**
- `hooks/use-api.ts` - Hooks API génériques
- `hooks/use-jobs-filters.ts` - Filtrage des emplois
- `hooks/use-jobs-pagination.ts` - Pagination des emplois
- `hooks/use-companies-filters.ts` - Filtrage des entreprises
- `hooks/use-companies-pagination.ts` - Pagination des entreprises
- `hooks/use-toast.ts` - Notifications

### **Contextes d'État**
- `contexts/AuthContext.tsx` - Authentification
- `contexts/ProfilePictureContext.tsx` - Photos de profil
- `contexts/CompanyLogoContext.tsx` - Logos d'entreprises
- `contexts/JobsInteractionsContext.tsx` - Interactions emplois
- `hooks/use-profile-completion.ts` - Complétion du profil

## 🚀 **Ordre de lecture recommandé**
1. **Authentification** : AuthContext → login/register
2. **Hooks API** : use-api.ts → hooks spécialisés
3. **Pages principales** : dashboard → jobs → companies → applications
4. **Contextes** : ProfilePicture → CompanyLogo → JobsInteractions

---
*Fichiers critiques pour le fonctionnement de l'application*


