/**
 * Page de gestion des candidatures - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des candidatures
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyApplications, useUpdateApplicationStatusByCompany } from "@/hooks/use-api";
import CompanyHeader from "@/components/layout/company-header";
import { InterviewScheduler } from "@/components/ui/interview-scheduler";
import { Pagination } from "@/components/ui/pagination";
import { calculateMatchScore } from "@/utils/match-score";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  Calendar,
  User,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Clock3,
  Download,
  Mail,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  FileText,
  FileImage,
  X,
  Maximize2,
  File
} from "lucide-react";

export default function ApplicationsPage() {
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

  // Fonction simple pour formater un numéro de téléphone (ajoute des espaces pour la lisibilité)
  const formatPhoneForDisplay = (phone: string | null | undefined): string => {
    if (!phone) return 'Non renseigné';
    
    // Si le numéro contient déjà des espaces, tirets ou autres caractères, le laisser tel quel
    if (/[\s\-\.\(\)]/.test(phone)) {
      return phone;
    }
    
    // Sinon, ajouter des espaces tous les 2 chiffres pour améliorer la lisibilité
    // Format: XX XX XX XX XX ou XXX XX XX XX XX
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      // Format français: 06 12 34 56 78
      return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8)}`;
    } else if (cleaned.length === 11) {
      // Format avec indicatif: +33 6 12 34 56 78
      if (cleaned.startsWith('33')) {
        return `+33 ${cleaned.substring(2, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9)}`;
      }
    }
    
    // Pour les autres formats, ajouter des espaces tous les 2 chiffres
    return cleaned.match(/.{1,2}/g)?.join(' ') || phone;
  };

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
  const jobs = [
    { id: "all", title: "Toutes les offres" },
    ...Array.from(new Set(applications.map((app: any) => app.jobTitle)))
      .map((title, index) => ({ id: title, title })) // Utiliser le titre comme ID pour éviter les conflits
  ];

  const statusOptions = [
    { id: "all", label: "Tous les statuts", color: "bg-gray-100 text-gray-800" },
    { id: "pending", label: "En attente", color: "bg-yellow-100 text-yellow-800" },
    { id: "interview", label: "Entretien", color: "bg-blue-100 text-blue-800" },
    { id: "accepted", label: "Accepté", color: "bg-green-100 text-green-800" },
    { id: "rejected", label: "Refusé", color: "bg-red-100 text-red-800" }
  ];

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock3 className="h-4 w-4" />;
      case "interview": return <Calendar className="h-4 w-4" />;
      case "accepted": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      default: return <Clock3 className="h-4 w-4" />;
    }
  };

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
      console.error('Erreur lors de la mise à jour du statut:', error);
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
      console.error('Erreur lors de la programmation de l\'entretien:', error);
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
            {/* Header de la page */}
          <div className="py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/company-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au dashboard
                </Button>
              </Link>
              <div>
                <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
                  Gestion des candidatures
                </Typography>
                <Typography variant="muted" className="text-lg">
                    Gérez et suivez toutes les candidatures reçues
                </Typography>
                {!applicationsLoading && (
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {filteredApplications.length} candidature{filteredApplications.length > 1 ? 's' : ''} 
                      {filteredApplications.length !== applications.length && ` (filtrée${filteredApplications.length > 1 ? 's' : ''} sur ${applications.length})`}
                    </span>
                    {totalPages > 1 && (
                      <span>• Page {currentPage} sur {totalPages}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Rechercher</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Nom, poste..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Statut</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Offre d'emploi</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                    >
                      {jobs.map((job: any) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Actions</label>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => refetchApplications()}
                      disabled={applicationsLoading}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {applicationsLoading ? 'Actualisation...' : 'Actualiser'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-4 mb-8">
            {paginatedApplications.map((application: any, index: number) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {application.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Typography variant="h4" className="font-semibold text-foreground">
                            {application.candidateName}
                          </Typography>
                          <Typography variant="muted" className="text-sm">
                            {application.candidateTitle} • {application.experience} • {application.location}
                          </Typography>
                          <Typography variant="muted" className="text-xs">
                            Candidature pour {application.jobTitle} • {application.appliedDate}
                          </Typography>
                          
                          {/* Informations de contact directement visibles */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate max-w-[150px]">{application.candidateEmail}</span>
                            </div>
                            {application.candidatePhone && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{formatPhoneForDisplay(application.candidatePhone)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium text-foreground">
                              {application.matchScore}% match
                            </span>
                          </div>
                          <Badge className={getStatusColor(application.status)}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1">{getStatusLabel(application.status)}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedApplication(
                              expandedApplication === application.id ? null : application.id
                            )}
                            className="min-w-[100px]"
                          >
                            {expandedApplication === application.id ? (
                              <>
                                <ChevronDown className="h-4 w-4 mr-1" />
                                Réduire
                              </>
                            ) : (
                              <>
                                <ChevronRight className="h-4 w-4 mr-1" />
                                Voir détails
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (application.hasDocuments.cv && application.cvUrl) {
                                setViewingDocument({ type: 'cv', url: application.cvUrl, fileName: application.cvFileName || 'CV.pdf' });
                              } else {
                                setExpandedApplication(application.id);
                              }
                            }}
                            className="min-w-[100px]"
                            disabled={!application.hasDocuments.cv && !application.coverLetter}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Voir le CV
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleContactCandidate(application.candidateEmail)}
                            className="min-w-[100px]"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Contacter
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedApplication === application.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-border"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Candidate Info & Documents */}
                          <div className="space-y-4">
                            {/* Informations du candidat - Version compacte */}
                            <div>
                              <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
                                Informations du candidat
                              </Typography>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate">{application.candidateEmail}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate">{formatPhoneForDisplay(application.candidatePhone)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate">{application.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-3 w-3 text-muted-foreground" />
                                  <span className="truncate">{application.experience}</span>
                                </div>
                              </div>
                            </div>

                            {/* Compétences - Version compacte */}
                            {application.skills.length > 0 && (
                              <div>
                                <Typography variant="h4" className="font-semibold text-foreground mb-2 text-base">
                                  Compétences
                                </Typography>
                                <div className="flex flex-wrap gap-1">
                                  {application.skills.slice(0, 6).map((skill: any, skillIndex: number) => (
                                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {application.skills.length > 6 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{application.skills.length - 6}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Documents - Version améliorée avec visualisation */}
                            <div>
                              <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
                                Documents
                              </Typography>
                              <div className="space-y-2">
                                {/* CV */}
                                {application.hasDocuments.cv && application.cvUrl ? (
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => setViewingDocument({ type: 'cv', url: application.cvUrl, fileName: application.cvFileName || 'CV.pdf' })}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Voir le CV
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        if (application.cvUrl) {
                                          const link = document.createElement('a');
                                          link.href = application.cvUrl;
                                          link.download = application.cvFileName || 'CV.pdf';
                                          link.click();
                                        }
                                      }}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button variant="outline" size="sm" className="w-full" disabled>
                                    <File className="h-4 w-4 mr-2" />
                                    CV non disponible
                                  </Button>
                                )}

                                {/* Lettre de motivation */}
                                {application.hasDocuments.coverLetter && application.coverLetterUrl ? (
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => setViewingDocument({ type: 'cover_letter', url: application.coverLetterUrl, fileName: application.coverLetterFileName || 'Lettre.pdf' })}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Voir la lettre
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        if (application.coverLetterUrl) {
                                          const link = document.createElement('a');
                                          link.href = application.coverLetterUrl;
                                          link.download = application.coverLetterFileName || 'Lettre.pdf';
                                          link.click();
                                        }
                                      }}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button variant="outline" size="sm" className="w-full" disabled>
                                    <File className="h-4 w-4 mr-2" />
                                    Lettre non disponible
                                  </Button>
                                )}

                                {/* Portfolio */}
                                {application.portfolioUrl && application.portfolioUrl !== "#" && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                      if (application.portfolioUrl) {
                                        window.open(application.portfolioUrl, '_blank');
                                      }
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Voir le portfolio
                                  </Button>
                                )}
                              </div>

                              {/* Contact */}
                              <div className="mt-4 pt-4 border-t border-border">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full"
                                  onClick={() => handleContactCandidate(application.candidateEmail)}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Contacter le candidat
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Lettre de motivation & Décision */}
                          <div className="space-y-4">
                            {/* Lettre de motivation - Version compacte */}
                            <div>
                              <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
                                Lettre de motivation
                              </Typography>
                              <div className="bg-muted/30 p-3 rounded-lg border border-border">
                                {/* Texte de la lettre s'il existe */}
                                {application.coverLetter && application.coverLetter !== "Aucune lettre de motivation fournie" ? (
                                  <div className="max-h-48 overflow-y-auto mb-3">
                                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                      {application.coverLetter}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground italic mb-3">
                                    Aucune lettre de motivation fournie
                                  </p>
                                )}
                                
                                {/* Bouton pour voir le document si disponible */}
                                {application.hasDocuments.coverLetter && application.coverLetterUrl && (
                                  <div className="pt-3 border-t border-border">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="w-full"
                                      onClick={() => setViewingDocument({ type: 'cover_letter', url: application.coverLetterUrl, fileName: application.coverLetterFileName || 'Lettre.pdf' })}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Voir le document complet
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Décision - Version compacte */}
                            <div>
                              <Typography variant="h4" className="font-semibold text-foreground mb-3 text-base">
                                Décision
                              </Typography>
                              
                              {/* Statut actuel - Version compacte */}
                              <div className="mb-3 p-2 rounded-lg bg-muted/30 border border-border">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(application.status)}
                                  <span className="text-xs font-medium text-foreground">
                                    {getStatusLabel(application.status)}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Actions - Version compacte en grille */}
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                  onClick={() => handleStatusChange(application.id, "accepted")}
                                  disabled={application.status === "accepted" || application.status === "rejected" || isUpdatingStatus}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Accepter
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                  onClick={() => application.status === "interview" ? handleRescheduleInterview(application) : handleScheduleInterview(application)}
                                  disabled={application.status === "accepted" || application.status === "rejected" || isUpdatingStatus}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Entretien
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                                  onClick={() => handleStatusChange(application.id, "rejected")}
                                  disabled={application.status === "accepted" || application.status === "rejected" || isUpdatingStatus}
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Refuser
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => handleStatusChange(application.id, "pending")}
                                  disabled={application.status === "pending" || application.status === "accepted" || application.status === "rejected" || isUpdatingStatus}
                                >
                                  <Clock3 className="h-3 w-3 mr-1" />
                                  Attente
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
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
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <Typography variant="h3" className="text-foreground mb-2">
                  {applications.length === 0 ? "Aucune candidature reçue" : "Aucune candidature trouvée"}
                </Typography>
                <Typography variant="muted" className="mb-6">
                  {applications.length === 0 
                    ? "Vous n'avez pas encore reçu de candidatures. Créez des offres d'emploi pour attirer des candidats."
                    : "Aucune candidature ne correspond à vos critères de recherche"
                  }
                </Typography>
                {applications.length === 0 ? (
                  <div className="flex gap-3 justify-center">
                    <Button asChild>
                      <Link href="/company-dashboard/jobs">
                        Créer une offre d'emploi
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/company-dashboard">
                        Retour au dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("all");
                    setSelectedJob("all");
                  }}
                >
                  Effacer les filtres
                </Button>
                )}
              </CardContent>
            </Card>
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
        {viewingDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setViewingDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-primary" />
                  <div>
                    <Typography variant="h4" className="font-semibold text-foreground">
                      {viewingDocument.type === 'cv' ? 'CV' : viewingDocument.type === 'cover_letter' ? 'Lettre de motivation' : 'Portfolio'}
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      {viewingDocument.fileName}
                    </Typography>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = viewingDocument.url;
                      link.download = viewingDocument.fileName;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingDocument(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Document Viewer */}
              <div className="flex-1 overflow-hidden">
                {viewingDocument.url && (
                  <iframe
                    src={viewingDocument.url}
                    className="w-full h-full min-h-[600px] border-0"
                    title={viewingDocument.fileName}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}