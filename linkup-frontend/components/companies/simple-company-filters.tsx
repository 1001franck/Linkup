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
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une entreprise..."
                value={filters.searchTerm}
                onChange={(e) => actions.setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>

            {/* Secteur d'activité - Input simple */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Secteur (ex: IT, Finance, Marketing)"
                value={filters.selectedIndustry}
                onChange={(e) => actions.setSelectedIndustry(e.target.value)}
                className="pl-10 w-48 border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>

            {/* Ville - Input simple */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Ville (ex: Paris, Lyon, Toulouse)"
                value={filters.selectedCity}
                onChange={(e) => actions.setSelectedCity(e.target.value)}
                className="pl-10 w-48 border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Typography variant="small" className="text-muted-foreground">
            Filtres actifs:
          </Typography>
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <span className="font-medium">{filter.label}:</span>
              <span>{filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={filter.onRemove}
                className="h-4 w-4 p-0 hover:bg-primary/30"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.clearAllFilters}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
};
