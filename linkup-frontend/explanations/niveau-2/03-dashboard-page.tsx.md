# 📊 **DASHBOARD PAGE.TSX - Dashboard Candidat**

## 🎯 **Rôle du fichier**
Le fichier `app/(routes)/dashboard/page.tsx` est la **page principale** du candidat dans LinkUp. Il affiche un tableau de bord complet avec statistiques, recommandations personnalisées, candidatures récentes, et actions rapides.

## 🏗️ **Architecture et Structure**

### **1. Imports et Dépendances (Lignes 1-60)**

```typescript
"use client";  // Composant côté client

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Composants UI
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";

// Authentification et sécurité
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

// Hooks API
import { useJobs, useMyApplications, useSavedJobs, useUserTrends, useMatchingJobs } from "@/hooks/use-api";
import { useConversations } from "@/hooks/use-messages";
import { useProfileCompletion } from "@/hooks/use-profile-completion";

// Contextes
import { useProfilePictureContext } from "@/contexts/ProfilePictureContext";

// Composants
import { UserAvatar, CompanyAvatar } from "@/components/ui/user-avatar";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Icônes
import { 
  TrendingUp, Briefcase, Heart, MessageCircle, Star, ArrowRight,
  Plus, Filter, Search, User, Settings, Bookmark, Send,
  CheckCircle, AlertCircle, Target, Award, Zap, DollarSign,
  Globe, FileText, Camera, Edit3, Share2, Download, Trash2,
  MoreHorizontal, MapPin, Clock, RefreshCw
} from "lucide-react";
```

**Explication :**
- **"use client"** : Composant côté client (nécessaire pour Next.js 13+)
- **React hooks** : useState, useEffect, useMemo pour la gestion d'état
- **Framer Motion** : Animations fluides
- **Next.js** : Link et useRouter pour la navigation
- **Composants UI** : Système de design cohérent
- **Authentification** : ProtectedRoute et useAuth
- **Hooks API** : Tous les hooks pour les données
- **Contextes** : ProfilePicture pour les avatars
- **Icônes** : Lucide React pour l'interface

### **2. Composant Principal DashboardContent (Lignes 62-1095)**

```typescript
function DashboardContent() {
  const [activeTab, setActiveTab] = useState("jobs");
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Condition pour déclencher les hooks API
  const shouldFetchData = !authLoading && isAuthenticated && !!authUser;
```

**Explication :**
- **État local** : activeTab pour la navigation
- **Hooks** : toast, router, auth
- **Condition** : shouldFetchData pour optimiser les appels API
- **Sécurité** : Vérification de l'authentification

### **3. Hooks API Conditionnels (Lignes 78-100)**

```typescript
// Récupérer les données depuis l'API - SEULEMENT si l'utilisateur est authentifié
const { data: jobs, loading: jobsLoading } = useJobs({ 
  limit: 5,
  enabled: shouldFetchData // Ne déclencher que si authentification complète
});

// Utiliser l'algorithme de matching réel
const { data: matchingJobs, loading: matchingJobsLoading } = useMatchingJobs({ 
  limit: 5, 
  minScore: 50, // Seulement les offres avec un score >= 50%
  enabled: shouldFetchData
});

// Hooks conditionnels - seulement si l'utilisateur est authentifié
const { data: applications, loading: applicationsLoading } = useMyApplications({
  enabled: shouldFetchData
});

const { data: conversations, loading: conversationsLoading } = useConversations({
  enabled: shouldFetchData
});

const { data: savedJobs, loading: savedJobsLoading } = useSavedJobs({
  enabled: shouldFetchData
});
```

**Explication :**
- **Optimisation** : Hooks conditionnels avec enabled
- **Sécurité** : Ne fait les appels que si authentifié
- **Performance** : Évite les appels inutiles
- **Données** : Jobs, matching, applications, conversations, saved

## 🔍 **Fonctionnalités Principales**

### **1. Algorithme de Matching (Lignes 84-89)**

```typescript
// MODIFICATION FRONTEND: Utiliser l'algorithme de matching réel
const { data: matchingJobs, loading: matchingJobsLoading } = useMatchingJobs({ 
  limit: 5, 
  minScore: 50, // Seulement les offres avec un score >= 50%
  enabled: shouldFetchData
});
```

**Explication :**
- **Algorithme réel** : Score de correspondance basé sur le profil
- **Filtrage** : Seulement les offres avec score >= 50%
- **Personnalisation** : Recommandations adaptées au profil
- **Performance** : Limite à 5 offres pour l'affichage

### **2. Complétion du Profil (Lignes 67-73)**

```typescript
const { 
  completion, 
  isProfileComplete, 
  profileCompletionPercentage, 
  nextSteps,
  refreshCompletion
} = useProfileCompletion();
```

**Explication :**
- **Complétion** : État de complétion du profil
- **Pourcentage** : Barre de progression
- **Étapes suivantes** : Actions recommandées
- **Rafraîchissement** : Mise à jour des données

### **3. Statistiques et Tendances**

```typescript
// Calcul des statistiques
const stats = useMemo(() => {
  const totalApplications = applications?.data?.length || 0;
  const pendingApplications = applications?.data?.filter(app => 
    app.status === 'pending'
  ).length || 0;
  const acceptedApplications = applications?.data?.filter(app => 
    app.status === 'accepted'
  ).length || 0;
  const savedJobsCount = savedJobs?.data?.length || 0;
  const unreadMessages = conversations?.data?.filter(conv => 
    conv.unreadCount > 0
  ).length || 0;

  return {
    totalApplications,
    pendingApplications,
    acceptedApplications,
    savedJobsCount,
    unreadMessages
  };
}, [applications, savedJobs, conversations]);
```

**Explication :**
- **useMemo** : Calcul optimisé des statistiques
- **Filtrage** : Applications par statut
- **Comptage** : Messages non lus, emplois sauvegardés
- **Performance** : Recalcul seulement si les données changent

## 🎨 **Interface Utilisateur**

### **1. Structure du Dashboard**

```typescript
return (
  <Container className="py-8">
    {/* En-tête avec avatar et actions rapides */}
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <UserAvatar user={authUser} size="lg" />
        <div>
          <Typography variant="h2" className="font-bold">
            Bonjour {authUser?.firstname} !
          </Typography>
          <Typography variant="muted">
            Voici votre tableau de bord personnalisé
          </Typography>
        </div>
      </div>
      
      {/* Actions rapides */}
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle candidature
        </Button>
      </div>
    </div>
```

**Explication :**
- **En-tête personnalisé** : Avatar et nom de l'utilisateur
- **Actions rapides** : Boutons pour les actions principales
- **Responsive** : Layout adaptatif
- **Personnalisation** : Message d'accueil personnalisé

### **2. Barre de Progression du Profil**

```typescript
{/* Barre de progression du profil */}
{!isProfileComplete && (
  <Card className="mb-6 border-amber-200 bg-amber-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-amber-800">
        <Target className="h-5 w-5" />
        Complétez votre profil
      </CardTitle>
      <CardDescription className="text-amber-700">
        {profileCompletionPercentage}% complété
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="w-full bg-amber-200 rounded-full h-2">
          <div 
            className="bg-amber-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${profileCompletionPercentage}%` }}
          />
        </div>
        
        <div className="space-y-2">
          <Typography variant="small" className="font-medium text-amber-800">
            Prochaines étapes :
          </Typography>
          {nextSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-amber-700">
              <CheckCircle className="h-4 w-4" />
              {step}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

**Explication :**
- **Condition** : Affiché seulement si profil incomplet
- **Progression** : Barre de progression visuelle
- **Étapes** : Liste des actions recommandées
- **Design** : Couleurs amber pour attirer l'attention

### **3. Statistiques Principales**

```typescript
{/* Statistiques principales */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="muted" className="text-sm">
            Candidatures totales
          </Typography>
          <Typography variant="h3" className="font-bold">
            {stats.totalApplications}
          </Typography>
        </div>
        <Briefcase className="h-8 w-8 text-blue-600" />
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="muted" className="text-sm">
            En attente
          </Typography>
          <Typography variant="h3" className="font-bold">
            {stats.pendingApplications}
          </Typography>
        </div>
        <Clock className="h-8 w-8 text-yellow-600" />
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="muted" className="text-sm">
            Acceptées
          </Typography>
          <Typography variant="h3" className="font-bold">
            {stats.acceptedApplications}
          </Typography>
        </div>
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="muted" className="text-sm">
            Emplois sauvegardés
          </Typography>
          <Typography variant="h3" className="font-bold">
            {stats.savedJobsCount}
          </Typography>
        </div>
        <Bookmark className="h-8 w-8 text-purple-600" />
      </div>
    </CardContent>
  </Card>
</div>
```

**Explication :**
- **Grid responsive** : 1 colonne mobile, 4 colonnes desktop
- **Cartes statistiques** : Chaque métrique dans une carte
- **Icônes colorées** : Identification visuelle
- **Données dynamiques** : Calculées depuis les hooks API

### **4. Onglets de Navigation**

```typescript
{/* Onglets de navigation */}
<div className="flex space-x-1 mb-6">
  {[
    { id: "jobs", label: "Emplois recommandés", icon: Star },
    { id: "applications", label: "Mes candidatures", icon: Briefcase },
    { id: "saved", label: "Emplois sauvegardés", icon: Bookmark },
    { id: "messages", label: "Messages", icon: MessageCircle }
  ].map((tab) => (
    <Button
      key={tab.id}
      variant={activeTab === tab.id ? "default" : "outline"}
      onClick={() => setActiveTab(tab.id)}
      className="flex items-center gap-2"
    >
      <tab.icon className="h-4 w-4" />
      {tab.label}
    </Button>
  ))}
</div>
```

**Explication :**
- **Navigation par onglets** : Interface claire
- **États visuels** : Bouton actif/inactif
- **Icônes** : Identification visuelle
- **Gestion d'état** : activeTab pour le contenu

### **5. Contenu des Onglets**

```typescript
{/* Contenu des onglets */}
{activeTab === "jobs" && (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Typography variant="h3" className="font-bold">
        Emplois recommandés pour vous
      </Typography>
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filtrer
      </Button>
    </div>
    
    {matchingJobsLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchingJobs?.data?.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {job.matchingScore}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {job.salary?.min && job.salary?.max 
                      ? `${job.salary.min}€ - ${job.salary.max}€`
                      : 'Salaire non spécifié'
                    }
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Postuler
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )}
  </div>
)}
```

**Explication :**
- **Contenu conditionnel** : Selon l'onglet actif
- **Loading states** : Skeleton loaders pendant le chargement
- **Animations** : Framer Motion pour les transitions
- **Actions** : Boutons d'action sur chaque carte
- **Données** : Affichage des informations de l'emploi

## 🚀 **Fonctionnalités Avancées**

### **1. Algorithme de Matching**

```typescript
// Affichage du score de matching
<Badge variant="outline" className="text-green-600">
  {job.matchingScore}% match
</Badge>
```

**Explication :**
- **Score visuel** : Badge avec pourcentage de correspondance
- **Couleur** : Vert pour indiquer la pertinence
- **Personnalisation** : Basé sur le profil utilisateur

### **2. Actions Rapides**

```typescript
<div className="flex space-x-2">
  <Button size="sm" className="flex-1">
    <Send className="h-4 w-4 mr-2" />
    Postuler
  </Button>
  <Button variant="outline" size="sm">
    <Bookmark className="h-4 w-4" />
  </Button>
</div>
```

**Explication :**
- **Postuler** : Action principale pour candidater
- **Sauvegarder** : Action secondaire pour garder l'emploi
- **Icônes** : Identification visuelle des actions

### **3. Gestion des États de Chargement**

```typescript
{matchingJobsLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </CardContent>
      </Card>
    ))}
  </div>
) : (
  // Contenu réel
)}
```

**Explication :**
- **Skeleton loaders** : Placeholders pendant le chargement
- **Animation** : animate-pulse pour l'effet de chargement
- **Structure** : Même layout que le contenu réel
- **UX** : Feedback visuel pour l'utilisateur

## 🔧 **Optimisations et Performance**

### **1. Hooks Conditionnels**

```typescript
const shouldFetchData = !authLoading && isAuthenticated && !!authUser;

const { data: jobs, loading: jobsLoading } = useJobs({ 
  limit: 5,
  enabled: shouldFetchData // Ne déclencher que si authentification complète
});
```

**Explication :**
- **Condition** : Vérification de l'authentification
- **Performance** : Évite les appels API inutiles
- **Sécurité** : Données seulement si authentifié

### **2. Mémorisation des Calculs**

```typescript
const stats = useMemo(() => {
  const totalApplications = applications?.data?.length || 0;
  const pendingApplications = applications?.data?.filter(app => 
    app.status === 'pending'
  ).length || 0;
  // ... autres calculs
}, [applications, savedJobs, conversations]);
```

**Explication :**
- **useMemo** : Recalcul seulement si les données changent
- **Performance** : Évite les calculs inutiles
- **Dépendances** : Liste des données à surveiller

### **3. Animations Optimisées**

```typescript
<motion.div
  key={job.id}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
>
```

**Explication :**
- **Animation** : Apparition progressive des éléments
- **Délai** : Staggered animation pour l'effet
- **Performance** : Animations légères et fluides

## 🎯 **Résumé**

Le fichier `dashboard/page.tsx` est **essentiel** pour LinkUp car il :

1. **Centralise l'expérience utilisateur** : Point d'entrée principal du candidat
2. **Personnalise l'interface** : Données et recommandations adaptées
3. **Optimise les performances** : Hooks conditionnels et mémorisation
4. **Gère les états** : Loading, erreurs, données
5. **Fournit des actions** : Navigation et interactions
6. **Améliore l'UX** : Animations et feedback visuel

C'est la **page la plus importante** pour l'expérience candidat et doit être maîtrisée pour comprendre l'application.

