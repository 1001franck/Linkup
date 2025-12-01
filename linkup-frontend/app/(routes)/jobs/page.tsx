/**
 * Page Jobs - Version Refactorisée
 * 
 * ARCHITECTURE :
 * - Séparation en composants plus petits
 * - Hooks personnalisés pour la logique métier
 * - Types TypeScript stricts
 * - Code modulaire et testable
 * 
 * PRINCIPES SOLID :
 * - Single Responsibility : Chaque composant a une responsabilité unique
 * - Open/Closed : Extensible sans modification
 * - Liskov Substitution : Composants interchangeables
 * - Interface Segregation : Props spécifiques et optionnelles
 * - Dependency Inversion : Dépendances injectées
 */

"use client";

import { useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CleanJobsHeader } from "@/components/jobs/clean-jobs-header";
import { JobsList } from "@/components/jobs/jobs-list";
import { JobsSidebar } from "@/components/jobs/jobs-sidebar";
import { NetworkErrorState, ServerErrorState } from "@/components/jobs/error-states";
import { AdvancedFilters } from "@/components/jobs/advanced-filters";
import { useJobsFilters } from "@/hooks/use-jobs-filters";
import { useJobsPagination } from "@/hooks/use-jobs-pagination";
import { useJobsInteractionsContext } from "@/contexts/JobsInteractionsContext";
import { useTopCompanies } from "@/hooks/use-api";
import { PaginationControls } from "@/components/jobs/pagination-controls";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Settings, RefreshCw } from "lucide-react";
import { ApplicationModal } from "@/components/jobs/application-modal";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

function JobsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // État pour le modal d'application (comme showAdvancedFilters)
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Hooks personnalisés pour la logique métier
  const { state: filtersState, actions: filtersActions, apiFilters } = useJobsFilters();
  const { state: interactionsState, actions: interactionsActions } = useJobsInteractionsContext();

  // Lire les paramètres de l'URL (company, search, location) AVANT d'initialiser la pagination
  // pour s'assurer que les filtres sont correctement initialisés dès le premier rendu
  useEffect(() => {
    const companyParam = searchParams.get('company');
    const searchParam = searchParams.get('search');
    const locationParam = searchParams.get('location');
    
    if (companyParam) {
      filtersActions.setCompanyFilter(companyParam);
      // Si on a un paramètre search, c'est le nom de l'entreprise
      if (searchParam) {
        filtersActions.setCompanyName(decodeURIComponent(searchParam));
      }
    } else {
      // Si pas de company, réinitialiser
      if (filtersState.companyFilter) {
        filtersActions.setCompanyFilter(null);
      }
      if (filtersState.companyName) {
        filtersActions.setCompanyName(null);
      }
    }
    
    if (searchParam && !companyParam) {
      // Si on a seulement search sans company, c'est une recherche normale
      filtersActions.setSearchTerm(decodeURIComponent(searchParam));
    } else if (!searchParam && !companyParam && filtersState.searchTerm) {
      // Si pas de search et pas de company, réinitialiser seulement si on avait une valeur
      filtersActions.setSearchTerm("");
    }
    
    // Lire le paramètre location depuis l'URL
    if (locationParam) {
      filtersActions.setSelectedLocation(decodeURIComponent(locationParam));
    } else if (filtersState.selectedLocation) {
      // Si pas de location dans l'URL, réinitialiser seulement si on avait une valeur
      filtersActions.setSelectedLocation("");
    }
  }, [searchParams, filtersActions, filtersState.companyFilter, filtersState.companyName, filtersState.searchTerm, filtersState.selectedLocation]);
  
  // Hook de pagination avec cache
  const {
    jobs,
    loading,
    error,
    refetch,
    pagination,
    actions: paginationActions
  } = useJobsPagination({
    filters: apiFilters,
    initialItemsPerPage: 5
  });

  // Hook pour récupérer les top companies depuis le backend
  const { data: topCompaniesData, loading: topCompaniesLoading } = useTopCompanies(3);


  // Transformation des top companies depuis le backend
  const topCompanies = useMemo(() => {
    if (!topCompaniesData || !(topCompaniesData as any)?.data) return [];
    
    return (topCompaniesData as any).data.map((company: any) => ({
      name: company.name,
      jobs: company.jobsAvailable
    }));
  }, [topCompaniesData]);

  // Actions mémorisées pour optimiser les performances
  const handleViewJobDetails = useCallback((jobId: number) => {
    router.push(`/jobs/${jobId}`);
  }, [router]);

  const handleClearFilters = useCallback(() => {
    filtersActions.clearAllFilters();
  }, [filtersActions.clearAllFilters]);

  const handleNewSearch = useCallback(() => {
    filtersActions.setSearchTerm("");
  }, [filtersActions.setSearchTerm]);

  // Fonction pour ouvrir le modal d'application (comme setShowAdvancedFilters)
  const handleOpenApplicationModal = useCallback((job: any) => {
    // Vérifier l'authentification avant d'ouvrir le modal
    if (!authLoading && !isAuthenticated) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/jobs';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  }, [isAuthenticated, authLoading, router]);

  const handleCloseApplicationModal = useCallback(() => {
    setShowApplicationModal(false);
    setSelectedJob(null);
  }, []);

  const handleConfirmApplication = useCallback((jobId: number) => {
    interactionsActions.applyToJob(jobId);
    handleCloseApplicationModal();
  }, [interactionsActions, handleCloseApplicationModal]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      
      {/* États de chargement et d'erreur globaux */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-lg shadow-lg max-w-md mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <Typography variant="h4" className="text-xl font-semibold mb-2 text-center">
              Chargement des emplois...
          </Typography>
            <Typography variant="muted" className="text-center">
              Veuillez patienter pendant que nous récupérons les offres d'emploi.
            </Typography>
          </div>
                    </div>
      )}

      {error && (
        <>
          {error.includes('network') || error.includes('fetch') ? (
            <NetworkErrorState 
              error={error}
              onRetry={handleRetry}
              onGoHome={handleGoHome}
            />
          ) : (
            <ServerErrorState 
              error={error}
              onRetry={handleRetry}
            />
          )}
        </>
      )}

      {/* Header propre et simple */}
      <CleanJobsHeader
        filters={filtersState}
        actions={filtersActions}
      />

      {/* Section de statistiques */}
      <section className="py-6 bg-muted/30 border-b">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total des offres</p>
                  <p className="text-2xl font-bold text-foreground">{pagination.totalItems}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">📋</span>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Candidatures envoyées</p>
                  <p className="text-2xl font-bold text-green-600">{interactionsState.appliedJobs.size}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-semibold">✓</span>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Candidatures retirées</p>
                  <p className="text-2xl font-bold text-red-600">{interactionsState.withdrawnJobs.size}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-semibold">✗</span>
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nouvelles opportunités</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {pagination.totalItems - interactionsState.appliedJobs.size - interactionsState.withdrawnJobs.size}
                  </p>
                </div>
                <div className="h-8 w-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <span className="text-cyan-600 text-sm font-semibold">+</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contenu principal */}
      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
            <Typography variant="h2">
                {pagination.totalItems} offres d'emploi trouvées
            </Typography>
              {filtersState.companyFilter && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Filtré par entreprise:
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {filtersState.companyName || 'Entreprise'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      filtersActions.setCompanyFilter(null);
                      filtersActions.setCompanyName(null);
                      const url = new URL(window.location.href);
                      url.searchParams.delete('company');
                      url.searchParams.delete('search');
                      window.history.replaceState({}, '', url.toString());
                    }}
                    className="text-xs"
                  >
                    ✕ Voir toutes les offres
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => interactionsActions.refreshData()}
                title="Rafraîchir les statistiques"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button 
                variant="outline"
                onClick={() => filtersActions.setShowAdvancedFilters(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des emplois */}
            <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
              <JobsList
                jobs={jobs}
                loading={loading}
                error={error}
                interactions={interactionsState}
                actions={interactionsActions}
                onViewJobDetails={handleViewJobDetails}
                onClearFilters={handleClearFilters}
                onNewSearch={handleNewSearch}
                onOpenApplicationModal={handleOpenApplicationModal}
              />
              
              {/* Contrôles de pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <PaginationControls
                    pagination={pagination}
                    actions={paginationActions}
                  />
                            </div>
              )}
            </div>

            {/* Sidebar */}
            <JobsSidebar
              data={{ jobs, loading, error, topCompanies: topCompanies as any[], pagination }}
              actions={{ retry: refetch }}
            />
          </div>
        </Container>
      </section>

      {/* Modal des filtres avancés */}
      <AdvancedFilters
        filters={filtersState}
        actions={filtersActions}
        isOpen={filtersState.showAdvancedFilters}
        onClose={() => filtersActions.setShowAdvancedFilters(false)}
      />

      {/* Modal de candidature */}
      {selectedJob && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={handleCloseApplicationModal}
          job={{
            id: selectedJob.id,
            title: selectedJob.title,
            company: selectedJob.company,
            location: selectedJob.location,
            salaryRange: selectedJob.salaryRange
          }}
          onApply={handleConfirmApplication}
          isApplying={interactionsState.savedJobsLoading}
        />
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <Typography variant="muted">Chargement...</Typography>
        </div>
      </div>
    }>
      <JobsPageContent />
    </Suspense>
  );
}