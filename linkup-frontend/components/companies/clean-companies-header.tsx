/**
 * Header propre et simple pour la page Companies
 * Inspiré du design de la section jobs
 */

import React from 'react';
import { Container } from '@/components/layout/container';
import { Typography } from '@/components/ui/typography';
import { SimpleCompanyFilters } from './simple-company-filters';
import { CompaniesFiltersState, CompaniesFiltersActions } from '@/hooks/use-companies-filters';

interface CleanCompaniesHeaderProps {
  filters: CompaniesFiltersState;
  actions: CompaniesFiltersActions;
}

export const CleanCompaniesHeader: React.FC<CleanCompaniesHeaderProps> = ({
  filters,
  actions
}) => {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <Container>
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Découvrez les entreprises
          </Typography>
          <Typography variant="lead" className="text-muted-foreground max-w-2xl mx-auto">
            Explorez les entreprises qui recrutent et trouvez celle qui correspond 
            à vos aspirations professionnelles.
          </Typography>
        </div>

        {/* Filtres simples */}
        <div className="max-w-5xl mx-auto">
          <SimpleCompanyFilters
            filters={filters}
            actions={actions}
          />
        </div>
      </Container>
    </section>
  );
};
