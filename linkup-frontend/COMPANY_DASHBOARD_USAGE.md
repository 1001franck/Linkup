# 🏢 Utilisation du Dashboard Entreprise

## 📊 Statistiques Implémentées

### 1. **Offres Actives**
```typescript
// Affichage : "7 sur 10 total"
// Logique : Offres sans candidats acceptés
const activeJobs = stats.activeJobs; // 7
const totalJobs = stats.totalJobs;   // 10
```

### 2. **Nouvelles Candidatures**
```typescript
// Affichage : "8 cette semaine"
// Logique : Candidatures des 7 derniers jours
const newApplications = stats.newApplications; // 8
```

### 3. **Entretiens Programmés**
```typescript
// Affichage : "5 total"
// Logique : Total des candidatures avec statut 'interview'
const interviewsScheduled = stats.interviewsScheduled; // 5
```

### 4. **Candidats Embauchés**
```typescript
// Affichage : "12 total"
// Logique : Total des candidatures avec statut 'accepted'
const hiredCandidates = stats.hiredCandidates; // 12
```

## 🔌 Intégration Frontend

### Hook API
```typescript
import { useCompanyDashboardStats } from '@/hooks/use-api';

function CompanyDashboard() {
  const { data: stats, loading, error } = useCompanyDashboardStats();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        title="Offres Actives"
        value={`${stats.activeJobs} sur ${stats.totalJobs} total`}
        icon={<Briefcase />}
      />
      <StatCard
        title="Nouvelles Candidatures"
        value={`${stats.newApplications} cette semaine`}
        icon={<Users />}
      />
      <StatCard
        title="Entretiens Programmés"
        value={`${stats.interviewsScheduled} total`}
        icon={<Calendar />}
      />
      <StatCard
        title="Candidats Embauchés"
        value={`${stats.hiredCandidates} total`}
        icon={<CheckCircle />}
      />
    </div>
  );
}
```

### API Client
```typescript
// Dans api-client.ts
async getCompanyDashboardStats() {
  return this.request('/company-stats/dashboard');
}
```

## 📱 Interface Utilisateur

### Cards de Statistiques
```jsx
function StatCard({ title, value, icon, trend }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="h-8 w-8 text-muted-foreground">
          {icon}
        </div>
      </div>
    </Card>
  );
}
```

## 🔄 Mise à Jour en Temps Réel

### Rafraîchissement Automatique
```typescript
// Rafraîchir les stats toutes les 30 secondes
useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 30000);
  
  return () => clearInterval(interval);
}, [refetch]);
```

### Mise à Jour après Actions
```typescript
// Après avoir accepté un candidat
const handleAcceptCandidate = async (applicationId) => {
  await updateApplicationStatus(applicationId, 'accepted');
  // Les stats se mettront à jour automatiquement
  refetch();
};
```

## 🎨 Exemple Complet

```jsx
import { useCompanyDashboardStats } from '@/hooks/use-api';
import { Card } from '@/components/ui/card';
import { Briefcase, Users, Calendar, CheckCircle } from 'lucide-react';

export function CompanyDashboardStats() {
  const { data: stats, loading, error, refetch } = useCompanyDashboardStats();
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur lors du chargement des statistiques</p>
        <button onClick={refetch} className="mt-2 text-blue-600 hover:underline">
          Réessayer
        </button>
      </div>
    );
  }
  
  const statCards = [
    {
      title: "Offres Actives",
      value: `${stats.activeJobs} sur ${stats.totalJobs} total`,
      icon: <Briefcase className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      title: "Nouvelles Candidatures",
      value: `${stats.newApplications} cette semaine`,
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "Entretiens Programmés",
      value: `${stats.interviewsScheduled} total`,
      icon: <Calendar className="h-6 w-6" />,
      color: "text-orange-600"
    },
    {
      title: "Candidats Embauchés",
      value: `${stats.hiredCandidates} total`,
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-purple-600"
    }
  ];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
            <div className={`h-8 w-8 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

## 🚀 Déploiement

1. **Backend** : Les APIs sont déjà configurées
2. **Frontend** : Utiliser le hook `useCompanyDashboardStats`
3. **Base de données** : Les index sont optimisés pour les performances
4. **Tests** : Exécuter `node test-company-stats.js` pour vérifier

## 📈 Métriques Supplémentaires

Les APIs fournissent aussi :
- `recentApplications` - Détails des candidatures récentes
- `activeJobs` - Détails des offres actives
- `generatedAt` - Timestamp de génération des stats
- `companyId` - ID de l'entreprise
