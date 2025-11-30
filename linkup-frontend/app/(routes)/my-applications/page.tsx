
/**
 * Page Mes Candidatures - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des candidatures de l'utilisateur
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { 
  Search,
  Filter,
  Briefcase,
  Calendar,
  Clock,
  TrendingUp,
  Bookmark,
  Zap,
  DollarSign,
  User,
  ChevronDown,
  ChevronUp,
  CalendarCheck,
  CircleCheck,
  CircleX,
  CircleHelp,
  CheckCircle,
  TrendingDown,
  Archive,
  FileText,
  Download,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useMyApplications } from "@/hooks/use-api";
import { useApplicationTransformer } from "@/hooks/use-application-transformer";
import { useApplicationFilters } from "@/hooks/use-application-filters";
import { useApplicationActions } from "@/hooks/use-application-actions";
// import { useApplicationUtils } from "@/hooks/use-application-utils";
import { useJobsInteractionsContext } from "@/contexts/JobsInteractionsContext";
import { Application } from "@/types/application";

// Interface Application importée depuis @/types/application

function MyApplicationsContent() {
  // États locaux
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(5);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "default" | "warning" | "danger" | "success" | "info";
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "default",
  });

  // Récupérer les candidatures depuis l'API
  const { data: apiApplications, loading: applicationsLoading, error: applicationsError, refetch: refetchApplications } = useMyApplications();

  // Rafraîchir automatiquement les candidatures toutes les 30 secondes
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetchApplications();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [refetchApplications]);

  // Contexte des interactions jobs
  const { state: interactionsState, actions: jobsInteractionsActions } = useJobsInteractionsContext();

  // Hooks personnalisés
  const { transformApiApplications } = useApplicationTransformer(interactionsState.savedJobs);
  const { filtersState, filtersActions, filterAndSortApplications, filterStats } = useApplicationFilters();
  
  // Détecter le paramètre filter dans l'URL
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Fonction pour mettre à jour l'URL avec le filtre sélectionné
  const updateURLWithFilter = (filter: string) => {
    const url = new URL(window.location.href);
    if (filter === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', filter);
    }
    router.replace(url.pathname + url.search);
  };

  // Appliquer automatiquement le filtre depuis l'URL
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam === 'bookmarked') {
      filtersActions.setSelectedFilter('bookmarked');
    } else if (filterParam === 'all') {
      filtersActions.setSelectedFilter('all');
    } else if (filterParam === 'pending') {
      filtersActions.setSelectedFilter('pending');
    } else if (filterParam === 'reviewed') {
      filtersActions.setSelectedFilter('reviewed');
    } else if (filterParam === 'accepted') {
      filtersActions.setSelectedFilter('accepted');
    } else if (filterParam === 'rejected') {
      filtersActions.setSelectedFilter('rejected');
    }
  }, [searchParams, filtersActions]);

  // Mettre à jour l'URL quand le filtre change manuellement (éviter la boucle infinie)
  useEffect(() => {
    const currentFilter = searchParams.get('filter');
    if (filtersState.selectedFilter !== currentFilter && filtersState.selectedFilter !== 'all') {
      updateURLWithFilter(filtersState.selectedFilter);
    } else if (filtersState.selectedFilter === 'all' && currentFilter !== null) {
      updateURLWithFilter('all');
    }
  }, [filtersState.selectedFilter]);
  // Fonctions utilitaires pour les statuts (temporairement intégrées)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "interview": return <CalendarCheck className="h-4 w-4 text-blue-500" />;
      case "accepted": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <CircleX className="h-4 w-4 text-red-500" />;
      case "withdrawn": return <CircleHelp className="h-4 w-4 text-gray-500" />;
      default: return <CircleHelp className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En cours";
      case "interview": return "Entretien programmé";
      case "accepted": return "Acceptée";
      case "rejected": return "Refusée";
      case "withdrawn": return "Retirée";
      default: return "Inconnu";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "interview": return "bg-blue-100 text-blue-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "withdrawn": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };


  // Transformer les données de l'API - Gestion robuste des cas
  let applications: Application[] = [];
  
  if (apiApplications) {
    if (Array.isArray(apiApplications)) {
      // Cas direct : apiApplications est un tableau
      applications = transformApiApplications(apiApplications);
    } else if (typeof apiApplications === 'object' && apiApplications !== null) {
      // Cas normal : apiApplications.data contient le tableau
      const apiData = (apiApplications as any).data;
      if (Array.isArray(apiData)) {
        applications = transformApiApplications(apiData);
      }
    }
  }

  // Filtrer et trier les candidatures
  const filteredApplications = filterAndSortApplications(applications);

  // Calculer les statistiques des filtres
  const filters = filterStats(applications);

  // Helper pour ouvrir les modales de confirmation
  const openConfirmationModal = (
    title: string,
    description: string,
    onConfirm: () => void,
    variant: "default" | "warning" | "danger" | "success" | "info" = "default",
    confirmText?: string,
    cancelText?: string
  ) => {
    setConfirmationModal({
      isOpen: true,
      title,
      description,
      onConfirm,
      variant,
      confirmText,
      cancelText,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  // Hook pour les actions
  const { actions } = useApplicationActions(
    applications, 
    openConfirmationModal, 
    refetchApplications,
    jobsInteractionsActions.updateApplicationStatus
  );

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
  const startIndex = (currentPage - 1) * applicationsPerPage;
  const endIndex = startIndex + applicationsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  // Actions gérées par le hook useApplicationActions





  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary/5 to-secondary/5 py-12">
          <Container>
            <div className="text-center mb-8">
              <Typography variant="h1" className="mb-4">
                Mes Candidatures
              </Typography>
              <Typography variant="lead" className="text-muted-foreground max-w-2xl mx-auto">
                Suivez l'état de vos candidatures et gérez vos opportunités professionnelles en un seul endroit.
              </Typography>
            </div>

          </Container>
        </section>

        <Container className="py-8">


          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filtres et recherche */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <Card className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-sm mb-6 sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-cyan-600" />
                    Filtres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Recherche */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Rechercher..."
                      className="pl-9"
                      value={filtersState.searchTerm}
                      onChange={(e) => filtersActions.setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filtres de statut */}
                  <div className="space-y-2 mb-4">
                    {filters.map((filter) => (
                      <Button
                        key={filter.id}
                        variant={filtersState.selectedFilter === filter.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          filtersState.selectedFilter === filter.id
                            ? "bg-cyan-500 text-white hover:bg-cyan-600"
                            : "hover:bg-muted"
                        )}
                        onClick={() => filtersActions.setSelectedFilter(filter.id)}
                      >
                        {filter.label}
                        {filter.count !== undefined && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-auto",
                              filtersState.selectedFilter === filter.id
                                ? "bg-white text-cyan-600"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {filter.count}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>

                  {/* Tri simple */}
                  <div className="space-y-2 mb-4">
                    <Button
                      variant={filtersState.showRecentFirst ? "default" : "outline"}
                      size="sm"
                      onClick={() => filtersActions.setShowRecentFirst(!filtersState.showRecentFirst)}
                      className="w-full"
                    >
                      {filtersState.showRecentFirst ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                      {filtersState.showRecentFirst ? "Les plus récents" : "Les plus anciens"}
                    </Button>
                  </div>

                  {/* Toggle archivées */}
                  <div className="space-y-2">
                    <Button
                      variant={filtersState.showArchived ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        filtersActions.setShowArchived(!filtersState.showArchived);
                        setCurrentPage(1); // Reset à la première page
                      }}
                      className="w-full"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      {filtersState.showArchived ? "Candidatures actives" : "Candidatures archivées"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contenu principal - Liste des candidatures */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {/* État de chargement */}
              {applicationsLoading && (
                <Card className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                    <Typography variant="h4" className="text-xl font-semibold mb-2">
                      Chargement de vos candidatures...
                    </Typography>
                    <Typography variant="muted">
                      Veuillez patienter pendant que nous récupérons vos données.
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* État d'erreur */}
              {applicationsError && !applicationsLoading && (
                <Card className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <CircleX className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <Typography variant="h4" className="text-xl font-semibold mb-2 text-red-600">
                      Erreur de chargement
                    </Typography>
                    <Typography variant="muted" className="mb-4">
                      {applicationsError}
                    </Typography>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline"
                    >
                      Réessayer
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Liste des candidatures ou message vide */}
              {!applicationsLoading && !applicationsError && paginatedApplications.length === 0 ? (
                <Card className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <Typography variant="h4" className="text-xl font-semibold mb-2">
                      Aucune candidature trouvée
                    </Typography>
                    <Typography variant="muted">
                      Ajustez vos filtres ou commencez à postuler !
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {paginatedApplications.map((application, index) => (
                    <Card
                      key={application.metadata.id}
                      className="relative bg-background/95 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                      style={{ zIndex: paginatedApplications.length - index }}
                    >
                      <CardContent className="p-6">
                        {/* Header de la candidature */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <img
                              src={application.company.logo}
                              alt={`Logo entreprise ${application.company.id || 'unknown'}`}
                              className="h-12 w-12 rounded-lg object-cover border border-border"
                            />
                            <div>
                              <Typography variant="h4" className="text-lg font-bold text-foreground">
                                {application.jobOffer.title}
                              </Typography>
                              <Typography variant="muted" className="text-sm text-muted-foreground">
                                {application.company.name} • {application.jobOffer.location}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={cn("flex items-center gap-1", getStatusColor(application.metadata.status))}>
                              {getStatusIcon(application.metadata.status)}
                              {getStatusLabel(application.metadata.status)}
                            </Badge>
                            {application.jobOffer.urgency === "high" && (
                              <Badge className="bg-red-100 text-red-800">
                                <Zap className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Informations de base */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-cyan-500" />
                            <span>{application.jobOffer.contractType}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-cyan-500" />
                            <span>{application.jobOffer.salaryRange}</span>
                          </div>
                        </div>

                        {/* Date de postulation */}
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4 mr-2 text-cyan-500" />
                          <span>Postulé le {application.metadata.appliedDate}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedApplication(
                                expandedApplication === application.metadata.id ? null : application.metadata.id
                              )}
                            >
                              {expandedApplication === application.metadata.id ? (
                                <ChevronUp className="h-4 w-4 mr-2" />
                              ) : (
                                <ChevronDown className="h-4 w-4 mr-2" />
                              )}
                              {expandedApplication === application.metadata.id ? 'Masquer' : 'Détails'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => jobsInteractionsActions.toggleBookmark(parseInt((application.jobOffer as any).id))}
                              className={application.metadata.isBookmarked ? "text-primary border-primary" : ""}
                            >
                              <Bookmark className={`h-4 w-4 mr-2 ${application.metadata.isBookmarked ? "fill-current" : ""}`} />
                              {application.metadata.isBookmarked ? 'Sauvegardée' : 'Sauvegarder'}
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            {application.metadata.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => actions.withdrawApplication(application.metadata.id)}
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              >
                                <CircleX className="h-4 w-4 mr-2" />
                                Retirer ma candidature
                              </Button>
                            )}
                            {application.metadata.status === "interview" && application.metadata.interviewDate && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => actions.viewInterviewDetails(application.metadata.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <CalendarCheck className="h-4 w-4 mr-2" />
                                Entretien programmé le {application.metadata.interviewDate}
                              </Button>
                            )}
                            {application.metadata.status === "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => actions.requestFeedback(application.metadata.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Demander un retour
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => actions.toggleArchive(application.metadata.id)}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              {application.metadata.isArchived ? "Désarchiver" : "Archiver"}
                            </Button>
                          </div>
                        </div>

                        {/* Détails expandables */}
                        {expandedApplication === application.metadata.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 pt-6 border-t border-border/50 bg-muted/20 -mx-6 px-6 pb-6"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Description du poste */}
                              <div>
                                <Typography variant="h5" className="text-sm font-semibold mb-2">
                                  Description du poste
                                </Typography>
                                <Typography variant="muted" className="text-sm">
                                  {application.jobOffer.description}
                                </Typography>
                              </div>

                              {/* Compétences requises */}
                              <div>
                                <Typography variant="h5" className="text-sm font-semibold mb-2">
                                  Compétences requises
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                  {application.jobOffer.requirements.map((req, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {req}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Avantages */}
                              <div>
                                <Typography variant="h5" className="text-sm font-semibold mb-2">
                                  Avantages
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                  {application.jobOffer.benefits.map((benefit, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {benefit}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Informations recruteur */}
                              {application.company.recruiterName && (
                                <div>
                                  <Typography variant="h5" className="text-sm font-semibold mb-2">
                                    Contact recruteur
                                  </Typography>
                                  <div className="space-y-1">
                                    <div className="flex items-center text-sm">
                                      <User className="h-4 w-4 mr-2 text-cyan-500" />
                                      <span>{application.company.recruiterName}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Documents joints */}
                              <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                  <Typography variant="h5" className="text-sm font-semibold">
                                  Documents envoyés
                                </Typography>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* CV */}
                                  {application.documents.cv && (
                                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-cyan-500" />
                                        <div>
                                          <p className="text-sm font-medium text-foreground">CV</p>
                                          <p className="text-xs text-muted-foreground">
                                            {application.documents.cv.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Envoyé le {application.documents.cv.uploadedAt}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(application.documents.cv!.url, '_blank')}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = application.documents.cv!.url;
                                            link.download = application.documents.cv!.name;
                                            link.click();
                                          }}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Lettre de motivation */}
                                  {application.documents.coverLetter && (
                                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-cyan-500" />
                                        <div>
                                          <p className="text-sm font-medium text-foreground">Lettre de motivation</p>
                                          <p className="text-xs text-muted-foreground">
                                            {application.documents.coverLetter.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Envoyée le {application.documents.coverLetter.uploadedAt}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(application.documents.coverLetter!.url, '_blank')}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = application.documents.coverLetter!.url;
                                            link.download = application.documents.coverLetter!.name;
                                            link.click();
                                          }}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Portfolio */}
                                  {application.documents.portfolio && (
                                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                                      <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4 text-cyan-500" />
                                        <div>
                                          <p className="text-sm font-medium text-foreground">Portfolio</p>
                                          <p className="text-xs text-muted-foreground">
                                            {application.documents.portfolio.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Envoyé le {application.documents.portfolio.uploadedAt}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(application.documents.portfolio!.url, '_blank')}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Eye className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = application.documents.portfolio!.url;
                                            link.download = application.documents.portfolio!.name;
                                            link.click();
                                          }}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Les documents sont ajoutés automatiquement lors de la candidature */}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                    Précédent
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2"
                  >
                    Suivant
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              )}

              {/* Info pagination */}
              {filteredApplications.length > 0 && (
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, filteredApplications.length)} sur {filteredApplications.length} candidatures
                </div>
              )}
            </motion.div>
          </div>
        </Container>
        <Toaster />
        
        {/* Modal de confirmation */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          description={confirmationModal.description}
          variant={confirmationModal.variant}
          confirmText={confirmationModal.confirmText}
          cancelText={confirmationModal.cancelText}
        />
      </div>
    </ProtectedRoute>
  );
}

export default function MyApplicationsPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <Typography variant="muted">Chargement...</Typography>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <MyApplicationsContent />
    </Suspense>
  );
}