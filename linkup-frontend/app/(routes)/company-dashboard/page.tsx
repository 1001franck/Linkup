/**
 * Dashboard Entreprise - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du dashboard entreprise
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import CompanyHeader from "@/components/layout/company-header";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyDashboardStats, useCompanyRecentApplications, useCompanyActiveJobs, useCompanyUpcomingInterviews } from "@/hooks/use-api";
import { BackendStatus } from "@/components/ui/backend-status";
import { useSearchParams } from "next/navigation";
import { 
  Users, 
  Briefcase, 
  Eye,
  MessageCircle,
  Bell,
  Calendar,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Plus,
  Filter,
  Search,
  Building2,
  DollarSign,
  Globe,
  Target,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  UserPlus,
  FileText,
  PieChart,
  Activity,
  TrendingDown,
  UserCheck,
  UserX,
  Clock3,
  Mail,
  Phone,
  ExternalLink,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
  Share2,
  Heart,
  Bookmark,
  FileX,
  UserSearch
} from "lucide-react";

export default function CompanyDashboardPage() {
  const { toast } = useToast();
  const { user: company, isAuthenticated, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const refreshParam = searchParams.get('refresh');

  // Fonction utilitaire pour tronquer les noms longs
  const truncateCompanyName = (name: string, maxLength: number = 20) => {
    if (!name) return 'Entreprise';
    if (name.length <= maxLength) return name;
    return `${name.substring(0, maxLength)}...`;
  };

  // Fonctions pour gérer les actions des offres
  const handleViewJob = (jobId: string) => {
    // Rediriger vers la page de détail de l'offre pour les entreprises
    window.open(`/company-dashboard/jobs/${jobId}`, '_blank');
  };

  const handleEditJob = (jobId: string) => {
    // Rediriger vers la page d'édition de l'offre
    window.open(`/company-dashboard/jobs/${jobId}/edit`, '_blank');
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${jobTitle}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      // Utiliser apiClient pour la suppression (les cookies httpOnly seront envoyés automatiquement)
      const response = await apiClient.deleteJob(Number(jobId));

      if (response.success) {
        toast({
          title: "Offre supprimée",
          description: `L'offre "${jobTitle}" a été supprimée avec succès.`,
          duration: 3000,
        });
        // Rafraîchir la page pour mettre à jour la liste
        window.location.reload();
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'offre. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Récupérer les statistiques dynamiques depuis l'API
  const { 
    data: apiStats, 
    loading: statsLoading, 
    error: statsError 
  } = useCompanyDashboardStats({ 
    enabled: isAuthenticated && !authLoading,
    refreshKey: refreshParam // Forcer le rafraîchissement si paramètre présent
  });

  // Récupérer les candidatures récentes depuis l'API
  const { 
    data: apiRecentApplications, 
    loading: applicationsLoading, 
    error: applicationsError 
  } = useCompanyRecentApplications({ 
    enabled: isAuthenticated && !authLoading,
    refreshKey: refreshParam // Forcer le rafraîchissement si paramètre présent
  });

  // Récupérer les offres actives depuis l'API
  const { 
    data: apiActiveJobs, 
    loading: jobsLoading, 
    error: jobsError 
  } = useCompanyActiveJobs({ 
    enabled: isAuthenticated && !authLoading,
    refreshKey: refreshParam // Forcer le rafraîchissement si paramètre présent
  });

  // Récupérer les entretiens à venir depuis l'API
  const { 
    data: apiUpcomingInterviews, 
    loading: interviewsLoading, 
    error: interviewsError 
  } = useCompanyUpcomingInterviews({ 
    enabled: isAuthenticated && !authLoading,
    refreshKey: refreshParam // Forcer le rafraîchissement si paramètre présent
  });

  // Utiliser les données API ou les données par défaut
  const companyStats = (apiStats as any)?.data ? {
    totalJobs: (apiStats as any).data.totalJobs || 0,
    activeJobs: (apiStats as any).data.activeJobs || 0,
    totalApplications: (apiStats as any).data.totalApplications || 0,
    newApplications: (apiStats as any).data.newApplications || 0,
    interviewsScheduled: (apiStats as any).data.interviewsScheduled || 0,
    hiredCandidates: (apiStats as any).data.hiredCandidates || 0,
    pendingReviews: 15, // TODO: Implémenter dans l'API
    companyRating: 4.7, // TODO: Implémenter dans l'API
    profileViews: 1247, // TODO: Implémenter dans l'API
    responseRate: 89 // TODO: Implémenter dans l'API
  } : {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    interviewsScheduled: 0,
    hiredCandidates: 0,
    pendingReviews: 0,
    companyRating: 0,
    profileViews: 0,
    responseRate: 0
  };

  // Utiliser les données API ou les données par défaut pour les candidatures récentes
  const recentApplications = Array.isArray((apiStats as any)?.data?.recentApplications) ? (apiStats as any).data.recentApplications : [];
  
  
  // Utiliser les données API ou les données par défaut pour les offres actives
  const activeJobs = Array.isArray((apiStats as any)?.data?.activeJobsList) ? (apiStats as any).data.activeJobsList : [];
  
  // Utiliser les données API ou les données par défaut pour les entretiens à venir
  const upcomingInterviews = Array.isArray((apiUpcomingInterviews as any)?.data) ? (apiUpcomingInterviews as any).data : [];
  
  
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "interview": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "accepted": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente";
      case "interview": return "Entretien";
      case "accepted": return "Accepté";
      case "rejected": return "Refusé";
      default: return "Inconnu";
    }
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action effectuée",
      description: `${action} en cours de traitement...`,
      duration: 2000,
    });
  };

  // Fonction pour exporter les données du dashboard en CSV
  const handleExportData = () => {
    try {
      // Préparer les données à exporter
      const exportData = {
        company: company?.name || "Entreprise",
        exportDate: new Date().toLocaleString('fr-FR'),
        stats: {
          totalJobs: companyStats.totalJobs,
          activeJobs: companyStats.activeJobs,
          totalApplications: companyStats.totalApplications,
          newApplications: companyStats.newApplications,
          interviewsScheduled: companyStats.interviewsScheduled,
          hiredCandidates: companyStats.hiredCandidates,
        },
        recentApplications: recentApplications.map((app: any) => ({
          candidate: `${app.user_?.firstname || ''} ${app.user_?.lastname || ''}`.trim() || 'Non renseigné',
          email: app.user_?.email || 'Non renseigné',
          jobTitle: app.job_offer?.title || 'Non renseigné',
          status: getStatusLabel(app.status || 'pending'),
          matchScore: app.matchScore || 0,
          appliedDate: app.applied_at ? new Date(app.applied_at).toLocaleDateString('fr-FR') : 'Non renseigné',
        })),
        activeJobs: activeJobs.map((job: any) => ({
          title: job.title || 'Non renseigné',
          location: job.location || 'Non renseigné',
          contractType: job.contract_type || 'Non renseigné',
          publishedDate: job.published_at ? new Date(job.published_at).toLocaleDateString('fr-FR') : 'Non renseigné',
        })),
      };

      // Créer le contenu CSV
      let csvContent = `Dashboard Export - ${exportData.company}\n`;
      csvContent += `Date d'export: ${exportData.exportDate}\n\n`;

      // Section Statistiques
      csvContent += `=== STATISTIQUES ===\n`;
      csvContent += `Total des offres,${exportData.stats.totalJobs}\n`;
      csvContent += `Offres actives,${exportData.stats.activeJobs}\n`;
      csvContent += `Total des candidatures,${exportData.stats.totalApplications}\n`;
      csvContent += `Nouvelles candidatures (cette semaine),${exportData.stats.newApplications}\n`;
      csvContent += `Entretiens programmés,${exportData.stats.interviewsScheduled}\n`;
      csvContent += `Candidats embauchés,${exportData.stats.hiredCandidates}\n\n`;

      // Section Candidatures récentes
      csvContent += `=== CANDIDATURES RÉCENTES ===\n`;
      csvContent += `Candidat,Email,Poste,Statut,Score de match,Date de candidature\n`;
      exportData.recentApplications.forEach((app: any) => {
        csvContent += `"${app.candidate}","${app.email}","${app.jobTitle}","${app.status}",${app.matchScore}%,"${app.appliedDate}"\n`;
      });
      csvContent += `\n`;

      // Section Offres actives
      csvContent += `=== OFFRES ACTIVES ===\n`;
      csvContent += `Titre,Localisation,Type de contrat,Date de publication\n`;
      exportData.activeJobs.forEach((job: any) => {
        csvContent += `"${job.title}","${job.location}","${job.contractType}","${job.publishedDate}"\n`;
      });

      // Créer le blob et télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard-${exportData.company}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        
        {/* Contenu principal avec padding pour le header fixe */}
        <BackendStatus />
        <div className="pt-20">
          <Container>
            {/* Header de la page */}
            <div className="py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
                    Dashboard{' '}
                    {(company as any)?.name && (company as any).name.length > 20 ? (
                      <span 
                        className="cursor-help border-b border-dotted border-muted-foreground/30"
                        title={(company as any).name}
                      >
                        {truncateCompanyName((company as any).name)}
                      </span>
                    ) : (
                      truncateCompanyName((company as any)?.name || '')
                    )}
                    {statsLoading && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Chargement...)
                      </span>
                    )}
                  </Typography>
                  <Typography variant="muted" className="text-lg">
                    Gérez vos offres d'emploi et vos candidatures
                  </Typography>
                  {statsError && (
                    <Typography variant="muted" className="text-sm text-red-500 mt-1">
                      Erreur lors du chargement des statistiques: {statsError}
                    </Typography>
                  )}
                </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleExportData}
                  disabled={statsLoading || applicationsLoading}
                >
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
                <Link href="/company-dashboard/create-job">
                  <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Plus className="h-4 w-4 mr-2" />
                    Publier une offre
                  </Button>
                </Link>
              </div>
            </div>

          </div>

          {/* Dashboard Content */}
          <div className="space-y-8 pb-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="muted" className="text-sm font-medium">
                            Offres actives
                          </Typography>
                          {statsLoading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                              <div className="h-4 bg-muted rounded w-24"></div>
                            </div>
                          ) : (
                            <>
                              <Typography variant="h2" className="text-3xl font-bold text-foreground">
                                {companyStats.activeJobs ?? 0}
                              </Typography>
                              <Typography variant="muted" className="text-sm">
                                sur {companyStats.totalJobs ?? 0} total
                              </Typography>
                            </>
                          )}
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="muted" className="text-sm font-medium">
                            Nouvelles candidatures
                          </Typography>
                          {statsLoading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                              <div className="h-4 bg-muted rounded w-20"></div>
                            </div>
                          ) : (
                            <>
                              <Typography variant="h2" className="text-3xl font-bold text-foreground">
                                {companyStats.newApplications}
                              </Typography>
                              <Typography variant="muted" className="text-sm">
                                cette semaine
                              </Typography>
                            </>
                          )}
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <UserPlus className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="muted" className="text-sm font-medium">
                            Entretiens programmés
                          </Typography>
                          {statsLoading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                              <div className="h-4 bg-muted rounded w-20"></div>
                            </div>
                          ) : (
                            <>
                              <Typography variant="h2" className="text-3xl font-bold text-foreground">
                                {companyStats.interviewsScheduled}
                              </Typography>
                              <Typography variant="muted" className="text-sm">
                                total
                              </Typography>
                            </>
                          )}
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="muted" className="text-sm font-medium">
                            Candidats embauchés
                          </Typography>
                          {statsLoading ? (
                            <div className="animate-pulse">
                              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                              <div className="h-4 bg-muted rounded w-16"></div>
                            </div>
                          ) : (
                            <>
                              <Typography variant="h2" className="text-3xl font-bold text-foreground">
                                {companyStats.hiredCandidates}
                              </Typography>
                              <Typography variant="muted" className="text-sm">
                                total
                              </Typography>
                            </>
                          )}
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <UserCheck className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Recent Applications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground">
                          Candidatures récentes
                        </CardTitle>
                        <CardDescription>
                          Les dernières candidatures reçues
                        </CardDescription>
                      </div>
                      <Link href="/company-dashboard/applications">
                        <Button variant="outline" size="sm">
                          Voir toutes
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {applicationsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-pulse">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-muted rounded-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-48"></div>
                                <div className="h-3 bg-muted rounded w-40"></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-6 bg-muted rounded w-20"></div>
                              <div className="h-4 bg-muted rounded w-16"></div>
                              <div className="h-8 bg-muted rounded w-24"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : applicationsError ? (
                      <div className="text-center py-8">
                        <Typography variant="muted" className="text-red-500">
                          Erreur lors du chargement des candidatures: {applicationsError}
                        </Typography>
                      </div>
                    ) : !Array.isArray(recentApplications) || recentApplications.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                            <UserSearch className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <Typography variant="h4" className="font-semibold text-foreground">
                              Aucune candidature récente
                            </Typography>
                            <Typography variant="muted" className="text-sm max-w-sm">
                              Les candidatures que vous recevrez apparaîtront ici. 
                              Assurez-vous que vos offres d'emploi sont bien publiées et visibles.
                            </Typography>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/company-dashboard/jobs">
                                <Plus className="h-4 w-4 mr-2" />
                                Créer une offre
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/company-dashboard/applications">
                                <Eye className="h-4 w-4 mr-2" />
                                Voir toutes
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentApplications.map((application, index) => (
                        <motion.div
                          key={application.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {application.profilePicture ? (
                              <img 
                                src={application.profilePicture} 
                                alt={`Photo de ${application.candidateName}`}
                                className="h-12 w-12 rounded-full object-cover border-2 border-cyan-500/20"
                                onError={(e) => {
                                  // Fallback vers l'avatar si l'image ne charge pas
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const nextSibling = target.nextSibling as HTMLElement;
                                  if (nextSibling) nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`h-12 w-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold ${application.profilePicture ? 'hidden' : 'flex'}`}
                            >
                              {application.avatar || "??"}
                            </div>
                            <div>
                              <Typography variant="h4" className="font-semibold text-foreground">
                                {application.candidateName}
                              </Typography>
                              <Typography variant="muted" className="text-sm">
                                {application.candidateTitle} • {application.experience} • {application.location}
                              </Typography>
                              <Typography variant="muted" className="text-xs">
                                Candidature pour {application.jobTitle} • {application.appliedDate}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(application.status)}>
                              {getStatusLabel(application.status)}
                            </Badge>
                            <div className="text-right">
                              <Typography variant="muted" className="text-sm">
                                Match: {application.matchScore}%
                              </Typography>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/company-dashboard/applications?candidate=${application.id.split('-')[0]}&job=${application.id.split('-')[1]}`}>
                                <FileText className="h-4 w-4 mr-2" />
                                Voir le CV
                              </Link>
                            </Button>
                          </div>
                        </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Active Jobs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground">
                          Offres actives
                        </CardTitle>
                        <CardDescription>
                          Vos offres d'emploi en cours
                        </CardDescription>
                      </div>
                      <Link href="/company-dashboard/jobs">
                        <Button variant="outline" size="sm">
                          Gérer toutes
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {jobsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 bg-muted/30 rounded-lg animate-pulse">
                            <div className="flex items-start justify-between mb-3">
                              <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                              <div className="h-6 bg-muted rounded w-16"></div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="h-3 bg-muted rounded w-28"></div>
                              <div className="flex gap-4">
                                <div className="h-3 bg-muted rounded w-20"></div>
                                <div className="h-3 bg-muted rounded w-16"></div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <div className="h-8 bg-muted rounded flex-1"></div>
                              <div className="h-8 bg-muted rounded flex-1"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : jobsError ? (
                      <div className="text-center py-8">
                        <Typography variant="muted" className="text-red-500">
                          Erreur lors du chargement des offres: {jobsError}
                        </Typography>
                      </div>
                    ) : !Array.isArray(activeJobs) || activeJobs.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <Typography variant="h4" className="font-semibold text-foreground">
                              Aucune offre active
                            </Typography>
                            <Typography variant="muted" className="text-sm max-w-sm">
                              Créez votre première offre d'emploi pour commencer à recevoir des candidatures.
                            </Typography>
                          </div>
             <div className="flex gap-2 pt-2">
               <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white" size="sm" asChild>
                 <Link href="/company-dashboard/create-job">
                   <Plus className="h-4 w-4 mr-2" />
                   Publier une offre
                 </Link>
               </Button>
               <Button variant="outline" size="sm" asChild>
                 <Link href="/company-dashboard/jobs">
                   <Eye className="h-4 w-4 mr-2" />
                   Gérer toutes
                 </Link>
               </Button>
             </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Typography variant="h4" className="font-semibold text-foreground mb-1">
                                {job.title}
                              </Typography>
                              <Typography variant="muted" className="text-sm">
                                {job.department} • {job.location}
                              </Typography>
                            </div>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              {job.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4" />
                              {job.type} • {job.salary}
                            </div>
                             <div className="flex items-center gap-4 text-sm">
                               <div className="flex items-center gap-1">
                                 <Users className="h-4 w-4 text-cyan-500" />
                                 {job.applications} candidatures
                               </div>
                             </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleViewJob(job.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleEditJob(job.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteJob(job.id, job.title)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Interviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-foreground">
                          Entretiens à venir
                        </CardTitle>
                        <CardDescription>
                          Vos prochains entretiens programmés
                        </CardDescription>
                      </div>
                      <Link href="/company-dashboard/applications?status=interview">
                        <Button variant="outline" size="sm">
                          Voir le planning
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {interviewsLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg animate-pulse">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-muted rounded-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-40"></div>
                                <div className="h-3 bg-muted rounded w-24"></div>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="h-4 bg-muted rounded w-20"></div>
                              <div className="h-3 bg-muted rounded w-16"></div>
                              <div className="h-6 bg-muted rounded w-24"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : interviewsError ? (
                      <div className="text-center py-8">
                        <Typography variant="muted" className="text-red-500">
                          Erreur lors du chargement des entretiens: {interviewsError}
                        </Typography>
                      </div>
                    ) : !Array.isArray(upcomingInterviews) || upcomingInterviews.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <Typography variant="h4" className="font-semibold text-foreground">
                              Aucun entretien programmé
                            </Typography>
                            <Typography variant="muted" className="text-sm max-w-sm">
                              Les entretiens que vous programmerez apparaîtront ici. 
                              Planifiez vos entretiens depuis la section candidatures.
                            </Typography>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/company-dashboard/applications">
                                <Users className="h-4 w-4 mr-2" />
                                Voir candidatures
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href="/company-dashboard/applications?status=interview">
                                <Calendar className="h-4 w-4 mr-2" />
                                Voir le planning
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingInterviews.map((interview, index) => (
                        <motion.div
                          key={interview.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            {interview.profilePicture ? (
                              <img 
                                src={interview.profilePicture} 
                                alt={`Photo de ${interview.candidateName}`}
                                className="h-12 w-12 rounded-full object-cover border-2 border-blue-500/20"
                                onError={(e) => {
                                  // Fallback vers l'avatar si l'image ne charge pas
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const nextSibling = target.nextSibling as HTMLElement;
                                  if (nextSibling) nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold ${interview.profilePicture ? 'hidden' : 'flex'}`}
                            >
                              {interview.avatar || "??"}
                            </div>
                            <div>
                              <Typography variant="h4" className="font-semibold text-foreground">
                                {interview.candidateName}
                              </Typography>
                              <Typography variant="muted" className="text-sm">
                                {interview.jobTitle}
                              </Typography>
                              <Typography variant="muted" className="text-xs">
                                Avec {interview.interviewer}
                              </Typography>
                            </div>
                          </div>
                          <div className="text-right">
                            <Typography variant="h4" className="font-semibold text-foreground">
                              {interview.date}
                            </Typography>
                            <Typography variant="muted" className="text-sm">
                              {interview.time}
                            </Typography>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 mt-1">
                              {interview.type}
                            </Badge>
                          </div>
                        </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          
          {/* Espacement supplémentaire pour éviter que le contenu soit collé au footer */}
          <div className="pb-16"></div>
          </Container>
          <Toaster />
        </div>
      </div>
    </ProtectedRoute>
  );
}
