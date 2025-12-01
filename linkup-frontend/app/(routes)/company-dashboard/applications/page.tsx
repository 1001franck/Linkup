/**
 * Page de gestion des candidatures - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des candidatures
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyApplications, useUpdateApplicationStatusByCompany } from "@/hooks/use-api";
import CompanyHeader from "@/components/layout/company-header";
import { InterviewScheduler } from "@/components/ui/interview-scheduler";
import { Pagination } from "@/components/ui/pagination";
import { calculateMatchScore } from "@/utils/match-score";
import { ApplicationsHeader } from "@/components/company-dashboard/applications-header";
import { ApplicationsFilters } from "@/components/company-dashboard/applications-filters";
import { ApplicationCard } from "@/components/company-dashboard/application-card";
import { DocumentViewer } from "@/components/company-dashboard/document-viewer";
import { ApplicationsEmptyState } from "@/components/company-dashboard/applications-empty-state";
import logger from "@/lib/logger";
import {
  formatPhoneForDisplay,
  getStatusColor,
  getStatusLabel,
  getStatusIcon,
} from "@/components/company-dashboard/application-utils";
import { XCircle } from "lucide-react";

function ApplicationsPageContent() {
  const { toast } = useToast();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedJob, setSelectedJob] = useState("all");
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDocuments, setShowDocuments] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ type: 'cv' | 'cover_letter' | 'portfolio', url: string, fileName: string } | null>(null);
  const itemsPerPage = 5;


  // Gérer les paramètres d'URL pour le filtre
  useEffect(() => {
    const candidateId = searchParams.get('candidate');
    const jobId = searchParams.get('job');
    
    if (candidateId && jobId) {
      // Filtrer pour cette candidature spécifique
      setSelectedJob(jobId);
    }
  }, [searchParams]);

  // Récupérer les candidatures depuis l'API
  // Pour les entreprises, l'ID est dans le JWT 'sub' field
  const companyId = user && 'sub' in user ? user.sub : (user as any)?.id_company || 0;
  
  const { data: apiApplications, loading: applicationsLoading, error: applicationsError, refetch: refetchApplications } = useCompanyApplications(
    companyId,
    {
      status: selectedStatus === "all" ? undefined : selectedStatus,
      jobId: selectedJob === "all" ? undefined : parseInt(selectedJob)
    }
  );

  // Afficher automatiquement les documents si on vient du dashboard
  useEffect(() => {
    const candidateId = searchParams.get('candidate');
    const jobId = searchParams.get('job');
    
    if (candidateId && jobId && apiApplications && typeof apiApplications === 'object' && apiApplications !== null && 'data' in apiApplications) {
      const targetApplication = (apiApplications as any).data.find((app: any) => 
        app.id === `${candidateId}-${jobId}`
      );
      if (targetApplication) {
        setExpandedApplication(targetApplication.id);
      }
    }
  }, [apiApplications, searchParams]);

  // Hook pour mettre à jour le statut des candidatures (pour les entreprises)
  const { mutate: updateStatus, loading: isUpdatingStatus } = useUpdateApplicationStatusByCompany();

  // Rafraîchir les candidatures uniquement lors des actions utilisateur
  // (suppression du rechargement automatique pour améliorer l'UX)


  // Transformer les données de l'API pour l'affichage
  const applications = ((apiApplications as any)?.data || []).map((app: any) => {
    // Extraire les documents
    const documents = app.application_documents || [];
    const cvDocument = documents.find((doc: any) => doc.document_type === 'cv');
    const coverLetterDocument = documents.find((doc: any) => doc.document_type === 'cover_letter');
    const portfolioDocument = documents.find((doc: any) => doc.document_type === 'portfolio');

    return {
      id: `${app.id_user}-${app.id_job_offer}`,
      candidateName: `${app.user_?.firstname || ''} ${app.user_?.lastname || ''}`.trim(),
      candidateTitle: app.user_?.job_title || app.user_?.bio_pro || 'Candidat',
      candidateEmail: app.user_?.email || '',
      candidatePhone: app.user_?.phone || '',
      jobTitle: app.job_offer?.title || 'Offre d\'emploi',
      appliedDate: new Date(app.application_date).toLocaleDateString('fr-FR'),
      status: app.status,
      experience: app.user_?.experience_level || 'Non spécifié',
      location: app.user_?.city || 'Non spécifié',
      matchScore: app.matchScore || calculateMatchScore(app.user_, app.job_offer), // Utiliser le score du backend si disponible, sinon calculer côté frontend
      avatar: `${app.user_?.firstname?.[0] || ''}${app.user_?.lastname?.[0] || ''}`.toUpperCase(),
      skills: Array.isArray(app.user_?.skills) ? app.user_.skills : (app.user_?.skills ? app.user_.skills.split(',').map((s: string) => s.trim()) : []),
      coverLetter: app.notes || (coverLetterDocument ? "Lettre de motivation disponible en document" : "Aucune lettre de motivation fournie"),
      coverLetterUrl: coverLetterDocument?.file_url && coverLetterDocument.file_url !== 'existing_cv' ? coverLetterDocument.file_url : null,
      coverLetterFileName: coverLetterDocument?.file_name || null,
      cvUrl: cvDocument?.file_url && cvDocument.file_url !== 'existing_cv' && cvDocument.file_url !== null ? cvDocument.file_url : null,
      cvFileName: cvDocument?.file_name || null,
      portfolioUrl: portfolioDocument?.file_url && portfolioDocument.file_url !== 'existing_cv' ? portfolioDocument.file_url : (app.user_?.portfolio_link || app.user_?.linkedin_link || null),
      portfolioFileName: portfolioDocument?.file_name || null,
      hasDocuments: {
        cv: !!(cvDocument && cvDocument.file_url && cvDocument.file_url !== 'existing_cv' && cvDocument.file_url !== null),
        coverLetter: !!(coverLetterDocument && coverLetterDocument.file_url && coverLetterDocument.file_url !== 'existing_cv'),
        portfolio: !!(portfolioDocument && portfolioDocument.file_url && portfolioDocument.file_url !== 'existing_cv')
      }
    };
  });

  // Extraire les offres d'emploi uniques des candidatures
  const jobs: Array<{ id: string; title: string }> = [
    { id: "all", title: "Toutes les offres" },
    ...Array.from(new Set(applications.map((app: any) => app.jobTitle)))
      .filter((title): title is string => typeof title === 'string')
      .map((title: string) => ({ id: title, title })) // Utiliser le titre comme ID pour éviter les conflits
  ];

  const statusOptions = [
    { id: "all", label: "Tous les statuts", color: "bg-gray-100 text-gray-800" },
    { id: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    { id: "interview", label: "Entretien", color: "bg-blue-100 text-blue-800" },
    { id: "accepted", label: "Accepté", color: "bg-green-100 text-green-800" },
    { id: "rejected", label: "Refusé", color: "bg-red-100 text-red-800" }
  ];


  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    const matchesJob = selectedJob === "all" || app.jobTitle === selectedJob;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Logique de pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  // Réinitialiser la page quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedJob]);

  // Gestion du loading
  if (applicationsLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
          <CompanyHeader />
          <div className="pt-20 pb-16">
            <Container>
              <div className="py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                    <Typography variant="muted">Chargement des candidatures...</Typography>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Gestion des erreurs
  if (applicationsError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
          <CompanyHeader />
          <div className="pt-20 pb-16">
            <Container>
              <div className="py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <Typography variant="h4" className="text-xl font-semibold mb-2">
                      Erreur de chargement
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                      Impossible de charger les candidatures. Veuillez réessayer.
                    </Typography>
                    <Button onClick={() => refetchApplications()} variant="default">
                      Réessayer
                    </Button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    const [userId, jobId] = applicationId.split('-');
    
    try {
      await updateStatus({ 
        jobId: parseInt(jobId), 
        status: newStatus,
        additionalData: { id_user: parseInt(userId) }
      });
      
      // Rafraîchir immédiatement les données pour voir le changement
      await refetchApplications();
      
      // Afficher un message de confirmation
      const statusLabel = getStatusLabel(newStatus);
      toast({
        title: "Statut mis à jour",
        description: `La candidature a été marquée comme "${statusLabel}"`,
        duration: 3000,
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleScheduleInterview = (application: any) => {
    setSelectedApplication(application);
    setSchedulerOpen(true);
  };

  const handleRescheduleInterview = (application: any) => {
    // Même fonction que handleScheduleInterview, mais avec un message différent
    setSelectedApplication(application);
    setSchedulerOpen(true);
  };

  const handleInterviewScheduled = async (interviewData: {
    date: string;
    time: string;
    type: string;
    location?: string;
    notes?: string;
  }) => {
    if (!selectedApplication) return;

    const [userId, jobId] = selectedApplication.id.split('-');
    
    // Combiner date et heure pour créer un timestamp ISO
    const interviewDateTime = new Date(`${interviewData.date}T${interviewData.time}`).toISOString();
    
    try {
      await updateStatus({ 
        jobId: parseInt(jobId), 
        status: "interview",
        additionalData: { 
          id_user: parseInt(userId),
          interview_date: interviewDateTime,
          notes: interviewData.notes || `Entretien ${interviewData.type} programmé pour le ${interviewData.date} à ${interviewData.time}${interviewData.location ? ` - ${interviewData.location}` : ''}`
        }
      });

      // Rafraîchir immédiatement les données pour voir le changement
      await refetchApplications();

      setSchedulerOpen(false);
      setSelectedApplication(null);
      
      const isRescheduling = selectedApplication.status === "interview";
      
      toast({
        title: isRescheduling ? "Entretien reprogrammé" : "Entretien programmé",
        description: `${isRescheduling ? "Entretien reprogrammé" : "Entretien programmé"} avec ${selectedApplication.candidateName} pour le ${interviewData.date} à ${interviewData.time}`,
        duration: 3000,
      });
    } catch (error) {
      logger.error('Erreur lors de la programmation de l\'entretien:', error);
      toast({
        title: "Erreur",
        description: "Impossible de programmer l'entretien. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleContactCandidate = (candidateEmail: string) => {
    // Ouvrir le client email par défaut
    window.open(`mailto:${candidateEmail}?subject=Candidature - Suivi`, '_blank');
    
    toast({
      title: "Client email ouvert",
      description: `Prêt à envoyer un email à ${candidateEmail}`,
      duration: 2000,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        
        {/* Contenu principal avec padding pour le header fixe */}
        <div className="pt-20 pb-16">
          <Container>
            <ApplicationsHeader
              totalApplications={applications.length}
              filteredApplications={filteredApplications.length}
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={applicationsLoading}
            />

            <ApplicationsFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedJob={selectedJob}
              onJobChange={setSelectedJob}
              statusOptions={statusOptions}
              jobs={jobs}
              onRefresh={refetchApplications}
              isLoading={applicationsLoading}
            />

          {/* Applications List */}
          <div className="space-y-4 mb-8">
            {paginatedApplications.map((application: any, index: number) => (
              <ApplicationCard
                key={application.id}
                application={application}
                index={index}
                isExpanded={expandedApplication === application.id}
                onToggleExpand={() =>
                  setExpandedApplication(
                    expandedApplication === application.id ? null : application.id
                  )
                }
                onViewDocument={(type, url, fileName) =>
                  setViewingDocument({ type, url, fileName })
                }
                onContactCandidate={handleContactCandidate}
                onStatusChange={handleStatusChange}
                onScheduleInterview={handleScheduleInterview}
                onRescheduleInterview={handleRescheduleInterview}
                formatPhone={formatPhoneForDisplay}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                getStatusIcon={getStatusIcon}
                isUpdatingStatus={isUpdatingStatus}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredApplications.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredApplications.length}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
            />
          )}

          {/* Empty State */}
          {filteredApplications.length === 0 && !applicationsLoading && (
            <ApplicationsEmptyState
              hasApplications={applications.length > 0}
              onClearFilters={() => {
                setSearchTerm("");
                setSelectedStatus("all");
                setSelectedJob("all");
              }}
            />
          )}
        </Container>
        </div>
        
        {/* Interview Scheduler Modal */}
        {selectedApplication && (
          <InterviewScheduler
            isOpen={schedulerOpen}
            onClose={() => {
              setSchedulerOpen(false);
              setSelectedApplication(null);
            }}
            onSchedule={handleInterviewScheduled}
            candidateName={selectedApplication.candidateName}
            jobTitle={selectedApplication.jobTitle}
            loading={isUpdatingStatus}
            isRescheduling={selectedApplication.status === "interview"}
          />
        )}

        {/* Document Viewer Modal */}
        <DocumentViewer
          isOpen={!!viewingDocument}
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
        
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}

export default function ApplicationsPage() {
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
      <ApplicationsPageContent />
    </Suspense>
  );
}