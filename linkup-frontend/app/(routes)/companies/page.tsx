
/**
 * Page Entreprises - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'affichage des entreprises
 * - Open/Closed : Extensible via props et composition
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { CompanySkeletonList } from "@/components/companies/company-skeleton";
import { CompanyCard } from "@/components/companies/company-card";
import { CleanCompaniesHeader } from "@/components/companies/clean-companies-header";
import { CompanyModal } from "@/components/companies/company-modal";
import { CompanyErrorBoundary, CompanyError } from "@/components/companies/company-error-boundary";
import { useCompaniesFilters } from "@/hooks/use-companies-filters";
import { useCompaniesInteractions } from "@/hooks/use-companies-interactions";
import { useCompaniesPagination } from "@/hooks/use-companies-pagination";
import { Company } from "@/types/company";
import { 
  Building2,
  TrendingUp,
  Briefcase
} from "lucide-react";

function CompaniesContent() {
  const [showStats, setShowStats] = useState(false);
  
  // Hooks personnalisés pour la logique métier
  const { state: filtersState, actions: filtersActions, apiFilters } = useCompaniesFilters();
  const { state: interactionsState, actions: interactionsActions } = useCompaniesInteractions();
  const { companies, loading, error, pagination } = useCompaniesPagination(12, apiFilters);

  // Mémoriser les statistiques pour éviter les recalculs
  const stats = useMemo(() => {
    const totalCompanies = pagination.totalItems;
    const recruitingCompanies = companies.filter(c => c.jobsAvailable > 0).length;
    const totalOffers = companies.reduce((sum, c) => sum + c.jobsAvailable, 0);

    return {
      totalCompanies,
      recruitingCompanies,
      totalOffers
    };
  }, [companies, pagination.totalItems]);

  // Mémoriser le handler pour basculer les statistiques
  const toggleStats = useCallback(() => {
    setShowStats(prev => !prev);
  }, []);





  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      {/* Header avec filtres modernes */}
      <CleanCompaniesHeader
        filters={filtersState}
        actions={filtersActions}
      />

      <Container className="py-8">
        {/* Bouton pour afficher/masquer les stats */}
        <div className="flex justify-center mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleStats}
          >
            {showStats ? 'Masquer' : 'Afficher'} les stats
          </Button>
        </div>
        {/* Statistiques dynamiques */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="muted" className="text-sm mb-1">Total entreprises</Typography>
                    <Typography variant="h3" className="text-2xl font-bold">{stats.totalCompanies}</Typography>
                  </div>
                  <Building2 className="h-8 w-8 text-cyan-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="muted" className="text-sm mb-1">Recrutent actuellement</Typography>
                    <Typography variant="h3" className="text-2xl font-bold">
                      {stats.recruitingCompanies}
                    </Typography>
                  </div>
                  <TrendingUp className="h-8 w-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>
            
            
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="muted" className="text-sm mb-1">Offres disponibles</Typography>
                    <Typography variant="h3" className="text-2xl font-bold">
                      {stats.totalOffers}
                    </Typography>
                  </div>
                  <Briefcase className="h-8 w-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* États de chargement et d'erreur */}
        {loading && (
          <div className="space-y-6">
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-3"></div>
                <Typography variant="h4" className="text-lg font-semibold mb-1">
                  Chargement des entreprises...
                        </Typography>
                        <Typography variant="muted" className="text-sm">
                  Veuillez patienter pendant que nous récupérons les données.
                  </Typography>
                </CardContent>
              </Card>
            <CompanySkeletonList count={6} />
        </div>
        )}

        {error && !loading && (
          <CompanyError
            error={error}
            onRetry={() => window.location.reload()}
            onGoHome={() => window.location.href = '/'}
            showDetails={process.env.NODE_ENV === 'development'}
          />
        )}

        {/* Liste des entreprises */}
        {!loading && !error && (
          <CompanyErrorBoundary>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {companies.length === 0 ? (
                <div className="col-span-full">
                  <Card className="backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <Typography variant="h4" className="text-xl font-semibold mb-2">
                        Aucune entreprise trouvée
                      </Typography>
                      <Typography variant="muted">
                        Ajustez vos filtres ou essayez une autre recherche.
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                companies.map((company, index) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    index={index}
                    onContact={interactionsActions.showContactForm}
                    onShare={interactionsActions.shareCompany}
                    onViewOffers={interactionsActions.viewOffers}
                  />
                ))
              )}
            </div>
          </CompanyErrorBoundary>
        )}

      </Container>

      {/* Modal unifié pour détails et contact */}
      <CompanyModal
        isOpen={interactionsState.showCompanyModal || interactionsState.showContactModal}
        company={interactionsState.selectedCompany}
        isSubmittingContact={interactionsState.isSubmittingContact}
        contactForm={interactionsState.contactForm}
        onClose={interactionsActions.closeModal}
        onContactSubmit={interactionsActions.submitContactForm}
        onContactFormChange={interactionsActions.updateContactForm}
        onViewOffers={interactionsActions.viewOffers}
      />
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <ProtectedRoute>
      <CompaniesContent />
      <Toaster />
    </ProtectedRoute>
  );
}
