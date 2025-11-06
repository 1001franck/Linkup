/**
 * Composant de filtres avancés simple
 * Permet de définir des critères supplémentaires sans données mockées
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { 
  X, 
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  GraduationCap
} from 'lucide-react';
import { JobsFiltersState, JobsFiltersActions } from '@/hooks/use-jobs-filters';

interface AdvancedFiltersProps {
  filters: JobsFiltersState;
  actions: JobsFiltersActions;
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  actions,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Filtres avancés
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              {/* Type de contrat */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Type de contrat
                </Typography>
                <Input
                  placeholder="Ex: CDI, CDD, Freelance..."
                  value={filters.selectedType}
                  onChange={(e) => actions.setSelectedType(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Localisation */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localisation
                </Typography>
                <Input
                  placeholder="Ex: Paris, Lyon, Remote..."
                  value={filters.selectedLocation}
                  onChange={(e) => actions.setSelectedLocation(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Entreprise */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Entreprise
                </Typography>
                <Input
                  placeholder="Nom de l'entreprise..."
                  value={filters.companyFilter || ''}
                  onChange={(e) => actions.setCompanyFilter(e.target.value || null)}
                  className="w-full"
                />
              </div>

              {/* Salaire minimum */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Salaire minimum
                </Typography>
                <Input
                  placeholder="Ex: 30000 (€)"
                  type="number"
                  value={filters.minSalary}
                  onChange={(e) => actions.setMinSalary(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              {/* Expérience requise */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Expérience requise
                </Typography>
                <Input
                  placeholder="Ex: 2-5 ans, Senior..."
                  value={filters.experience}
                  onChange={(e) => actions.setExperience(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Secteur d'activité */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Secteur d'activité
                </Typography>
                <Input
                  placeholder="Ex: IT, Finance, Marketing..."
                  value={filters.industry}
                  onChange={(e) => actions.setIndustry(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Mode de travail */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Mode de travail
                </Typography>
                <Input
                  placeholder="Ex: Présentiel, Hybride..."
                  value={filters.workMode}
                  onChange={(e) => actions.setWorkMode(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Niveau d'études */}
              <div>
                <Typography variant="h4" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Niveau d'études
                </Typography>
                <Input
                  placeholder="Ex: Bac+2, Bac+5, Master..."
                  value={filters.education}
                  onChange={(e) => actions.setEducation(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t">
            <Button
              variant="outline"
              onClick={actions.clearAllFilters}
              className="flex-1"
            >
              Effacer tout
            </Button>
            <Button
              onClick={onClose}
              className="flex-1"
            >
              Appliquer les filtres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
