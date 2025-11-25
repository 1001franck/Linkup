/**
 * Composant Sidebar pour la page Jobs
 * Affiche les entreprises populaires et autres informations contextuelles
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  RefreshCw
} from 'lucide-react';
import { CompanyStats, JobsDataState, JobsDataActions, PaginationState } from '@/types/jobs';

interface JobsSidebarProps {
  data: JobsDataState;
  actions: JobsDataActions;
}

export const JobsSidebar: React.FC<JobsSidebarProps> = ({ data, actions }) => {
  const { jobs, loading, error, topCompanies, pagination } = data;

  const renderCompanies = () => {
    // État de chargement
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-16"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-muted animate-pulse rounded"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // État d'erreur
    if (error) {
      return (
        <div className="text-center py-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
            <Building className="h-6 w-6 text-red-600" />
          </div>
          <Typography variant="muted" className="text-sm text-red-600">
            Impossible de charger les entreprises
          </Typography>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={actions.retry}
            className="mt-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Réessayer
          </Button>
        </div>
      );
    }

    // État vide - aucune entreprise
    if (topCompanies.length === 0) {
      return (
        <div className="text-center py-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <Building className="h-6 w-6 text-blue-600" />
          </div>
          <Typography variant="muted" className="text-sm text-blue-600">
            Aucune entreprise trouvée
          </Typography>
          <Typography variant="muted" className="text-xs mt-1">
            Les entreprises apparaîtront ici une fois que des offres seront disponibles
          </Typography>
        </div>
      );
    }

    // Rendu des entreprises
    return topCompanies.map((company, index) => (
      <div key={`company-${company.name}-${index}`} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 hover:from-primary/10 hover:to-primary/15 transition-all duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <Typography variant="small" className="font-semibold text-foreground">
              {company.name}
            </Typography>
            <Typography variant="muted" className="text-xs">
              {company.jobs} {company.jobs === 1 ? 'offre disponible' : 'offres disponibles'}
            </Typography>
          </div>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {company.jobs}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6 order-1 lg:order-2">
      {/* Entreprises à la une */}
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            Entreprises à la une
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderCompanies()}
        </CardContent>
      </Card>

      {/* Section des statistiques (optionnelle) */}
      {!loading && !error && jobs.length > 0 && (
        <Card className="backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="muted" className="text-sm">
                Total des offres
              </Typography>
              <Typography variant="small" className="font-medium">
                {pagination?.totalItems || jobs.length}
              </Typography>
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <Typography variant="muted" className="text-sm">
                  Page actuelle
                </Typography>
                <Typography variant="small" className="font-medium">
                  {pagination.currentPage} / {pagination.totalPages}
                </Typography>
              </div>
            )}
            <div className="flex items-center justify-between">
              <Typography variant="muted" className="text-sm">
                Entreprises actives
              </Typography>
              <Typography variant="small" className="font-medium">
                {topCompanies.length}
              </Typography>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
