/**
 * Composants d'états d'erreur améliorés
 * Fournissent des actions de récupération et une meilleure UX
 */

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/contexts/AuthContext';
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
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleLoginRedirect = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/jobs';
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}&message=explorer`);
  };

  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Search className="h-8 w-8 text-cyan-600" />
          </div>
          <div>
            <Typography variant="h3" className="mb-2">
              Aucune offre trouvée
            </Typography>
            <Typography variant="muted" className="text-base mb-4">
              Aucune offre d'emploi ne correspond à vos critères de recherche.
            </Typography>
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-lg p-4 mt-4 border border-cyan-200 dark:border-cyan-800">
                <Typography variant="small" className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                  Connectez-vous pour explorer une panoplie d'offres !
                </Typography>
                <Typography variant="muted" className="text-sm text-cyan-700 dark:text-cyan-300 mb-4">
                  Accédez à des milliers d'opportunités personnalisées et trouvez le poste qui vous ressemble.
                </Typography>
                <Button 
                  onClick={handleLoginRedirect}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
                >
                  Se connecter pour explorer
                </Button>
              </div>
            )}
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
                variant="outline"
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
