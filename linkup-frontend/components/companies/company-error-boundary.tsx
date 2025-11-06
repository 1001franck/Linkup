/**
 * Composant de gestion d'erreurs spécialisé pour les entreprises
 * Améliore l'UX en cas de problèmes de transformation ou d'API
 */

import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class CompanyErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Erreur dans CompanyErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <Typography variant="h4" className="text-xl font-semibold mb-2 text-red-600">
              Erreur de chargement des entreprises
            </Typography>
            <Typography variant="muted" className="mb-6">
              Une erreur inattendue s'est produite lors du chargement des données d'entreprises.
            </Typography>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
                  Détails de l'erreur (développement)
                </summary>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="default"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Composant d'erreur simple pour les cas spécifiques
 */
interface CompanyErrorProps {
  error: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showDetails?: boolean;
}

export const CompanyError: React.FC<CompanyErrorProps> = ({
  error,
  onRetry,
  onGoHome,
  showDetails = false
}) => {
  const isNetworkError = error.includes('network') || error.includes('fetch');
  const isNotFoundError = error.includes('404');
  const isServerError = error.includes('500');

  const getErrorMessage = () => {
    if (isNetworkError) return 'Problème de connexion';
    if (isNotFoundError) return 'Aucune entreprise trouvée';
    if (isServerError) return 'Erreur serveur';
    return 'Erreur de chargement';
  };

  const getErrorDescription = () => {
    if (isNetworkError) return 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    if (isNotFoundError) return 'Aucune entreprise trouvée avec ces critères de recherche.';
    if (isServerError) return 'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.';
    return error;
  };

  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <Typography variant="h4" className="text-xl font-semibold mb-2 text-red-600">
          {getErrorMessage()}
        </Typography>
        <Typography variant="muted" className="mb-6">
          {getErrorDescription()}
        </Typography>
        
        {showDetails && process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
              Détails de l'erreur
            </summary>
            <pre className="text-xs bg-muted p-3 rounded overflow-auto">
              {error}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          )}
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="default"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
