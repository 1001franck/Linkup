/**
 * Header propre et simple pour la page Jobs
 * Pas de données mockées, interface claire
 */

import React from 'react';
import { Container } from '@/components/layout/container';
import { Typography } from '@/components/ui/typography';
import { SimpleFilters } from './simple-filters';
import { JobsFiltersState, JobsFiltersActions } from '@/hooks/use-jobs-filters';

interface CleanJobsHeaderProps {
  filters: JobsFiltersState;
  actions: JobsFiltersActions;
}

export const CleanJobsHeader: React.FC<CleanJobsHeaderProps> = ({
  filters,
  actions
}) => {
  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
      <Container>
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Trouvez votre emploi idéal
          </Typography>
          <Typography variant="lead" className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez des milliers d'opportunités professionnelles 
            et connectez-vous avec les meilleures entreprises.
          </Typography>
        </div>

        {/* Filtres simples */}
        <div className="max-w-5xl mx-auto">
          <SimpleFilters
            filters={filters}
            actions={actions}
          />
        </div>
      </Container>
    </section>
  );
};
