# 📊 Logique des Statistiques d'Entreprise

## 🎯 Vue d'ensemble

Ce document explique la logique métier implémentée pour les statistiques du dashboard entreprise.

## 📈 Statistiques Principales

### 1. **Offres Actives** 
```
Logique : Nombre d'offres que l'entreprise a postées mais auxquelles elle n'a pas encore accepté de candidats
Calcul : Total des offres - Offres avec candidats acceptés
```

**Exemple :**
- Entreprise a posté 10 offres
- 3 offres ont des candidats acceptés
- **Résultat : 7 offres actives**

### 2. **Nouvelles Candidatures**
```
Logique : Nombre de candidatures reçues au cours des 7 derniers jours
Calcul : Candidatures avec application_date >= (aujourd'hui - 7 jours)
```

**Exemple :**
- Total candidatures : 50
- Candidatures des 7 derniers jours : 8
- **Résultat : 8 nouvelles candidatures**

### 3. **Entretiens Programmés**
```
Logique : Nombre total de candidatures ayant le statut 'interview'
Calcul : COUNT(*) WHERE status = 'interview'
Note : Compte le TOTAL, pas seulement cette semaine
```

**Exemple :**
- 5 candidatures avec statut 'interview'
- **Résultat : 5 entretiens programmés**

### 4. **Candidats Embauchés**
```
Logique : Nombre total de candidatures ayant le statut 'accepted'
Calcul : COUNT(*) WHERE status = 'accepted'
Note : Compte le TOTAL de tous les temps
```

**Exemple :**
- 12 candidatures avec statut 'accepted'
- **Résultat : 12 candidats embauchés**

## 🔄 Comportement Dynamique

### Gestion des Statuts
- Quand un candidat passe de 'interview' à 'accepted' → **Entretiens programmés** diminue, **Candidats embauchés** augmente
- Quand un candidat passe de 'interview' à 'rejected' → **Entretiens programmés** diminue
- Quand un candidat est accepté → **Offres actives** peut diminuer (si c'est le premier candidat accepté pour cette offre)

## 📊 Structure des Données

### Réponse API `/company-stats/dashboard`
```json
{
  "success": true,
  "data": {
    "totalJobs": 10,           // Total des offres postées
    "activeJobs": 7,           // Offres sans candidats acceptés
    "totalApplications": 50,   // Total des candidatures reçues
    "newApplications": 8,      // Candidatures des 7 derniers jours
    "interviewsScheduled": 5,  // Total des entretiens programmés
    "hiredCandidates": 12,     // Total des candidats embauchés
    "recentApplications": [...], // Détails des candidatures récentes
    "activeJobs": [...],       // Détails des offres actives
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "companyId": 1
  }
}
```

## 🛠️ Implémentation Technique

### Fichiers Modifiés
- `backend/src/services/companyStatsStore.js` - Logique métier
- `backend/src/routes/companyStats.routes.js` - Routes API
- `backend/test-company-stats.js` - Script de test

### Fonctions Principales
- `getJobsStats()` - Statistiques des offres
- `getApplicationsStats()` - Statistiques des candidatures
- `getInterviewsStats()` - Statistiques des entretiens
- `getHiredStats()` - Statistiques des embauches
- `getCompanyDashboardStats()` - Statistiques complètes

## 🧪 Tests

Pour tester la logique :
```bash
cd backend
node test-company-stats.js
```

## 📝 Notes Importantes

1. **Performance** : Les requêtes utilisent des index optimisés
2. **Cohérence** : Les statistiques sont calculées en temps réel
3. **Sécurité** : Seules les entreprises authentifiées peuvent accéder à leurs statistiques
4. **Évolutivité** : La logique peut être étendue pour d'autres métriques

## 🔧 Configuration

### Variables d'Environnement Requises
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### Base de Données
- Table `job_offer` - Offres d'emploi
- Table `apply` - Candidatures
- Table `company` - Entreprises
- Index optimisés pour les performances
