/**
 * Composants d'états d'erreur améliorés
 * Fournissent des actions de récupération et une meilleure UX
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { 
  AlertTriangle, 
  Wifi, 
  RefreshCw, 
  Search, 
  Filter,
  X,
  Home
} from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onGoHome?: () => void;
}

export const NetworkErrorState = ({ error, onRetry, onGoHome }: ErrorStateProps) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <Card className="backdrop-blur-sm border-0 shadow-lg max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <Wifi className="h-8 w-8 text-orange-600" />
          </div>
          <Typography variant="h4" className="text-xl font-semibold mb-2 text-orange-600">
            Problème de connexion
          </Typography>
          <Typography variant="muted" className="mb-6">
            {error}
          </Typography>
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <Button 
                onClick={onRetry} 
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            )}
            {onGoHome && (
              <Button 
                onClick={onGoHome} 
                variant="outline"
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ServerErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <Card className="backdrop-blur-sm border-0 shadow-lg max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <Typography variant="h4" className="text-xl font-semibold mb-2 text-red-600">
            Erreur du serveur
          </Typography>
          <Typography variant="muted" className="mb-6">
            {error}
          </Typography>
          {onRetry && (
            <Button 
              onClick={onRetry} 
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const NoResultsState = ({ 
  onClearFilters, 
  onNewSearch 
}: { 
  onClearFilters?: () => void;
  onNewSearch?: () => void;
}) => {
  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <Typography variant="h3" className="mb-2">
              Aucune offre trouvée
            </Typography>
            <Typography variant="muted" className="text-base">
              Aucune offre d'emploi ne correspond à vos critères de recherche.
            </Typography>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {onClearFilters && (
              <Button 
                variant="outline"
                onClick={onClearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Effacer tous les filtres
              </Button>
            )}
            {onNewSearch && (
              <Button 
                onClick={onNewSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Nouvelle recherche
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const EmptyState = ({ 
  title = "Aucune donnée disponible",
  description = "Il n'y a actuellement aucune information à afficher.",
  actionLabel = "Actualiser",
  onAction
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) => {
  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <Typography variant="h3" className="mb-2">
              {title}
            </Typography>
            <Typography variant="muted" className="text-base">
              {description}
            </Typography>
          </div>
          {onAction && (
            <Button 
              onClick={onAction}
              className="mt-6"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
