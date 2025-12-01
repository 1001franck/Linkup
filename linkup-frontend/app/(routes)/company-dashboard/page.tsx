/**
 * Dashboard Entreprise - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du dashboard entreprise
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import CompanyHeader from "@/components/layout/company-header";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyDashboardStats, useCompanyRecentApplications, useCompanyActiveJobs, useCompanyUpcomingInterviews } from "@/hooks/use-api";
import { useSearchParams } from "next/navigation";
import { Typography } from "@/components/ui/typography";
import { apiClient } from "@/lib/api-client";
import logger from "@/lib/logger";
import { CompanyDashboardHeader } from "@/components/company-dashboard/company-dashboard-header";
import { CompanyDashboardStats } from "@/components/company-dashboard/company-dashboard-stats";
import { RecentApplicationsSection } from "@/components/company-dashboard/recent-applications-section";
import { ActiveJobsSection } from "@/components/company-dashboard/active-jobs-section";
import { UpcomingInterviewsSection } from "@/components/company-dashboard/upcoming-interviews-section";
import { 
  getStatusColor,
  getStatusLabel,
  truncateCompanyName,
} from "@/components/company-dashboard/company-dashboard-utils";

function CompanyDashboardPageContent() {
  const { toast } = useToast();
  const { user: company, isAuthenticated, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const refreshParam = searchParams.get('refresh');


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

  // Transformer les données pour les composants
  const recentApplications = (Array.isArray((apiRecentApplications as any)?.data)
    ? (apiRecentApplications as any).data
    : []
  ).map((app: any) => ({
    id: `${app.id_user}-${app.id_job_offer}`,
    candidateName: `${app.user_?.firstname || ""} ${app.user_?.lastname || ""}`.trim() || "Candidat",
    candidateTitle: app.user_?.job_title || app.user_?.bio_pro || "Candidat",
    experience: app.user_?.experience_level || "Non spécifié",
    location: app.user_?.city || "Non spécifié",
    jobTitle: app.job_offer?.title || "Offre d'emploi",
    appliedDate: app.application_date
      ? new Date(app.application_date).toLocaleDateString("fr-FR")
      : "Date inconnue",
    status: app.status || "pending",
    matchScore: app.matchScore || 0,
    avatar: `${app.user_?.firstname?.[0] || ""}${app.user_?.lastname?.[0] || ""}`.toUpperCase(),
    profilePicture: app.user_?.profile_picture_url || null,
  }));

  const activeJobs = (Array.isArray((apiActiveJobs as any)?.data)
    ? (apiActiveJobs as any).data
    : []
  ).map((job: any) => ({
    id: String(job.id_job_offer),
    title: job.title || "Titre non disponible",
    department: job.industry || "Non spécifié",
    location: job.location || "Non spécifié",
    type: job.contract_type || "Non spécifié",
    salary:
      job.salary_min && job.salary_max
        ? `${job.salary_min}-${job.salary_max}k€`
        : "Salaire non spécifié",
    status: job.status || "active",
    applications: job.applications_count || 0,
  }));

  const upcomingInterviews = (Array.isArray((apiUpcomingInterviews as any)?.data)
    ? (apiUpcomingInterviews as any).data
    : []
  ).map((interview: any) => ({
    id: `${interview.id_user}-${interview.id_job_offer}`,
    candidateName: `${interview.user_?.firstname || ""} ${interview.user_?.lastname || ""}`.trim() || "Candidat",
    jobTitle: interview.job_offer?.title || "Offre d'emploi",
    interviewer: (company as any)?.name || "Recruteur",
    date: interview.interview_date
      ? new Date(interview.interview_date).toLocaleDateString("fr-FR")
      : "Date non spécifiée",
    time: interview.interview_date
      ? new Date(interview.interview_date).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Heure non spécifiée",
    type: interview.interview_type || "Entretien",
    avatar: `${interview.user_?.firstname?.[0] || ""}${interview.user_?.lastname?.[0] || ""}`.toUpperCase(),
    profilePicture: interview.user_?.profile_picture_url || null,
  }));
  
  
  



  // Fonction pour exporter les données du dashboard en CSV
  const handleExportData = () => {
    try {
      // Préparer les données à exporter
      const exportData = {
        company: (company && 'name' in company) ? company.name : "Entreprise",
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
          candidate: app.candidateName || "Non renseigné",
          email: "", // Email non disponible dans les données transformées
          jobTitle: app.jobTitle || "Non renseigné",
          status: getStatusLabel(app.status || "pending"),
          matchScore: app.matchScore || 0,
          appliedDate: app.appliedDate || "Non renseigné",
        })),
        activeJobs: activeJobs.map((job: any) => ({
          title: job.title || "Non renseigné",
          location: job.location || "Non renseigné",
          contractType: job.type || "Non renseigné",
          publishedDate: "", // Date non disponible dans les données transformées
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
      logger.error("Erreur lors de l'export:", error);
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
        <div className="pt-20">
          <Container>
            <CompanyDashboardHeader
              companyName={(company as any)?.name || null}
              isLoading={statsLoading}
              error={statsError}
              onExport={handleExportData}
              truncateName={truncateCompanyName}
            />

          {/* Dashboard Content */}
          <div className="space-y-8 pb-8">
            <CompanyDashboardStats stats={companyStats} isLoading={statsLoading} />

            <RecentApplicationsSection
              applications={recentApplications}
              isLoading={applicationsLoading}
              error={applicationsError}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />

            <ActiveJobsSection
              jobs={activeJobs}
              isLoading={jobsLoading}
              error={jobsError}
              onViewJob={handleViewJob}
              onEditJob={handleEditJob}
              onDeleteJob={handleDeleteJob}
            />

            <UpcomingInterviewsSection
              interviews={upcomingInterviews}
              isLoading={interviewsLoading}
              error={interviewsError}
            />
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

export default function CompanyDashboardPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
          <CompanyHeader />
          <div className="pt-20 pb-16">
            <Container>
              <div className="py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                    <Typography variant="muted">Chargement...</Typography>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <CompanyDashboardPageContent />
    </Suspense>
  );
}
