/**
 * Composant de filtres simple et moderne pour les entreprises
 * Inspiré du design de la section jobs
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { 
  Search, 
  MapPin, 
  Building2,
  X,
  Filter
} from 'lucide-react';
import { CompaniesFiltersState, CompaniesFiltersActions } from '@/hooks/use-companies-filters';

interface SimpleCompanyFiltersProps {
  filters: CompaniesFiltersState;
  actions: CompaniesFiltersActions;
}

export const SimpleCompanyFilters: React.FC<SimpleCompanyFiltersProps> = ({
  filters,
  actions
}) => {
  // Filtres actifs
  const activeFilters = [];
  
  if (filters.searchTerm) {
    activeFilters.push({
      key: 'search',
      label: 'Recherche',
      value: filters.searchTerm,
      onRemove: () => actions.setSearchTerm('')
    });
  }
  
  if (filters.selectedIndustry) {
    activeFilters.push({
      key: 'industry',
      label: 'Secteur',
      value: filters.selectedIndustry,
      onRemove: () => actions.setSelectedIndustry('')
    });
  }
  
  if (filters.selectedCity) {
    activeFilters.push({
      key: 'city',
      label: 'Ville',
      value: filters.selectedCity,
      onRemove: () => actions.setSelectedCity('')
    });
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Barre de recherche principale */}
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Recherche */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <Input
                placeholder="Rechercher une entreprise..."
                value={filters.searchTerm}
                onChange={(e) => actions.setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 border-0 bg-muted/30 focus:bg-background transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Secteur d'activité - Input simple */}
            <div className="relative flex-1 sm:flex-initial sm:w-48 min-w-0">
              <Building2 className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <Input
                placeholder="Secteur (ex: IT, Finance)"
                value={filters.selectedIndustry}
                onChange={(e) => actions.setSelectedIndustry(e.target.value)}
                className="pl-8 sm:pl-10 w-full sm:w-48 border-0 bg-muted/30 focus:bg-background transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Ville - Input simple */}
            <div className="relative flex-1 sm:flex-initial sm:w-48 min-w-0">
              <MapPin className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <Input
                placeholder="Ville (ex: Paris, Lyon)"
                value={filters.selectedCity}
                onChange={(e) => actions.setSelectedCity(e.target.value)}
                className="pl-8 sm:pl-10 w-full sm:w-48 border-0 bg-muted/30 focus:bg-background transition-colors text-sm sm:text-base"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <Typography variant="small" className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            Filtres actifs:
          </Typography>
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-1 sm:gap-2 bg-primary/10 text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <span className="font-medium truncate max-w-[80px] sm:max-w-none">{filter.label}:</span>
              <span className="truncate max-w-[100px] sm:max-w-none">{filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={filter.onRemove}
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 p-0 hover:bg-primary/30 flex-shrink-0"
              >
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.clearAllFilters}
            className="text-muted-foreground hover:text-foreground text-xs sm:text-sm whitespace-nowrap"
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
};
