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
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un emploi..."
                value={filters.searchTerm}
                onChange={(e) => actions.setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>

            {/* Localisation - Input simple */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Localisation (ex: Paris, Remote)"
                value={filters.selectedLocation}
                onChange={(e) => actions.setSelectedLocation(e.target.value)}
                className="pl-10 w-48 border-0 bg-muted/30 focus:bg-background transition-colors"
              />
            </div>

            {/* Type de contrat - Input simple */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Type (ex: CDI, CDD, Freelance)"
                value={filters.selectedType}
                onChange={(e) => actions.setSelectedType(e.target.value)}
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
