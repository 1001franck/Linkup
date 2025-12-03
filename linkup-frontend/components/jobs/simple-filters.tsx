/**
 * Composant de filtres simple et moderne
 * Utilise les vraies données de l'API, pas de dropdowns
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { 
  Search, 
  MapPin, 
  Briefcase,
  X,
  Filter
} from 'lucide-react';
import { JobsFiltersState, JobsFiltersActions } from '@/hooks/use-jobs-filters';

interface SimpleFiltersProps {
  filters: JobsFiltersState;
  actions: JobsFiltersActions;
}

export const SimpleFilters: React.FC<SimpleFiltersProps> = ({
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
  
  if (filters.selectedLocation) {
    activeFilters.push({
      key: 'location',
      label: 'Localisation',
      value: filters.selectedLocation,
      onRemove: () => actions.setSelectedLocation('')
    });
  }
  
  if (filters.selectedType) {
    activeFilters.push({
      key: 'type',
      label: 'Type',
      value: filters.selectedType,
      onRemove: () => actions.setSelectedType('')
    });
  }
  
  if (filters.companyFilter) {
    activeFilters.push({
      key: 'company',
      label: 'Entreprise',
      value: filters.companyFilter,
      onRemove: () => actions.setCompanyFilter(null)
    });
  }
  
  if (filters.minSalary) {
    activeFilters.push({
      key: 'salary',
      label: 'Salaire min',
      value: `${filters.minSalary}€`,
      onRemove: () => actions.setMinSalary('')
    });
  }
  
  if (filters.experience) {
    activeFilters.push({
      key: 'experience',
      label: 'Expérience',
      value: filters.experience,
      onRemove: () => actions.setExperience('')
    });
  }
  
  if (filters.industry) {
    activeFilters.push({
      key: 'industry',
      label: 'Secteur',
      value: filters.industry,
      onRemove: () => actions.setIndustry('')
    });
  }
  
  if (filters.workMode) {
    activeFilters.push({
      key: 'workMode',
      label: 'Mode',
      value: filters.workMode,
      onRemove: () => actions.setWorkMode('')
    });
  }
  
  if (filters.education) {
    activeFilters.push({
      key: 'education',
      label: 'Études',
      value: filters.education,
      onRemove: () => actions.setEducation('')
    });
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Rechercher un emploi..."
                value={filters.searchTerm}
                onChange={(e) => actions.setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 text-sm sm:text-base border-0 bg-muted/30 focus:bg-background transition-colors h-9 sm:h-10"
              />
            </div>

            {/* Localisation - Input simple */}
            <div className="relative flex-1 sm:flex-initial">
              <MapPin className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Localisation"
                value={filters.selectedLocation}
                onChange={(e) => actions.setSelectedLocation(e.target.value)}
                className="pl-8 sm:pl-10 w-full sm:w-48 text-sm sm:text-base border-0 bg-muted/30 focus:bg-background transition-colors h-9 sm:h-10"
              />
            </div>

            {/* Type de contrat - Input simple */}
            <div className="relative flex-1 sm:flex-initial">
              <Briefcase className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Type (CDI, CDD...)"
                value={filters.selectedType}
                onChange={(e) => actions.setSelectedType(e.target.value)}
                className="pl-8 sm:pl-10 w-full sm:w-48 text-sm sm:text-base border-0 bg-muted/30 focus:bg-background transition-colors h-9 sm:h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          <Typography variant="small" className="text-muted-foreground text-xs sm:text-sm">
            <span className="hidden sm:inline">Filtres actifs:</span>
            <span className="sm:hidden">Filtres:</span>
          </Typography>
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-1 sm:gap-2 bg-primary/10 text-primary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm border border-primary/20 hover:bg-primary/20 transition-colors max-w-full"
            >
              <span className="font-medium truncate">{filter.label}:</span>
              <span className="truncate">{filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={filter.onRemove}
                className="h-3 w-3 sm:h-4 sm:w-4 p-0 hover:bg-primary/30 flex-shrink-0"
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
