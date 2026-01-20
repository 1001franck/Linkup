/**
 * Hook pour la redirection automatique vers le bon dashboard
 * Gère la détection du type d'utilisateur et la redirection appropriée
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/lib/logger';

export function useDashboardRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Ne pas exécuter si on est en train de charger ou si on a déjà redirigé
    if (isLoading || isRedirecting) {
      return;
    }

    // Ne pas exécuter si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      return;
    }

    // Ne pas exécuter si on n'a pas d'utilisateur
    if (!user) {
      return;
    }

    setIsRedirecting(true);
    
    const userRole = user && ('role' in user) ? user.role : null;
    
    // Fonction async pour déterminer le type d'utilisateur
    const determineRedirect = async () => {
      let redirectPath = '/dashboard'; // Par défaut pour les utilisateurs
      
      logger.debug('👤 Données utilisateur:', user);
      // Vérifier le rôle depuis les données utilisateur
      if (userRole === 'admin') {
        redirectPath = '/admin-dashboard';
        logger.debug('🛡️ Redirection admin vers:', redirectPath);
      } else if ('id_company' in user || 'Id_company' in user || 'recruiter_mail' in user || userRole === 'company') {
        // C'est une entreprise
        redirectPath = '/company-dashboard';
        logger.debug('Redirection entreprise vers:', redirectPath);
      } else if ('id_user' in user || userRole === 'user') {
        // C'est un utilisateur
        redirectPath = '/dashboard';
        logger.debug('👤 Redirection utilisateur vers:', redirectPath);
      } else {
        // Fallback: utiliser le dashboard par défaut si le type n'est pas déterminable
        // AuthContext a déjà récupéré les données, pas besoin de refaire des appels API
        logger.debug('Type d\'utilisateur non déterminable depuis les données, utilisation du dashboard par défaut');
        redirectPath = '/dashboard'; // Fallback par défaut
      }
      
      router.push(redirectPath);
    };
    
    determineRedirect();
  }, [isAuthenticated, isLoading, user, router]); // Retiré isRedirecting des dépendances pour éviter la boucle

  return { isRedirecting };
}
