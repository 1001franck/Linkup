/**
 * Hook pour la redirection automatique vers le bon dashboard
 * Gère la détection du type d'utilisateur et la redirection appropriée
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import logger from '@/lib/logger';

export function useDashboardRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const userRole = user && 'role' in user ? user.role : null;
    logger.debug('🔄 useDashboardRedirect - État:', { isLoading, isAuthenticated, isRedirecting, user: user ? { role: userRole, type: typeof user } : null });
    
    if (!isLoading && isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      
      // Fonction async pour déterminer le type d'utilisateur
      const determineRedirect = async () => {
        let redirectPath = '/dashboard'; // Par défaut pour les utilisateurs
        
        if (user) {
          logger.debug('👤 Données utilisateur:', user);
          // Vérifier le rôle depuis les données utilisateur
          const userRole = 'role' in user ? user.role : null;
          if (userRole === 'admin') {
            redirectPath = '/admin-dashboard';
            logger.debug('🛡️ Redirection admin vers:', redirectPath);
          } else if ('id_company' in user || 'recruiter_mail' in user || userRole === 'company') {
            // C'est une entreprise
            redirectPath = '/company-dashboard';
            logger.debug('🏢 Redirection entreprise vers:', redirectPath);
          } else if ('id_user' in user || userRole === 'user') {
            // C'est un utilisateur
            redirectPath = '/dashboard';
            logger.debug('👤 Redirection utilisateur vers:', redirectPath);
          } else {
            // Fallback: essayer de récupérer les infos utilisateur depuis l'API
            // Le cookie httpOnly sera automatiquement envoyé
            try {
              const userResponse = await apiClient.getCurrentUser();
              if (userResponse.success && userResponse.data) {
                const userData = userResponse.data as any;
                const userRole = userData.role;
                if (userRole === 'admin') {
                  redirectPath = '/admin-dashboard';
                } else if (userRole === 'company') {
                  redirectPath = '/company-dashboard';
                } else {
                  redirectPath = '/dashboard';
                }
              } else {
                // Essayer entreprise si pas utilisateur
                const companyResponse = await apiClient.getCurrentCompany();
                if (companyResponse.success && companyResponse.data) {
                  redirectPath = '/company-dashboard';
                }
              }
            } catch (error) {
              logger.debug('Impossible de déterminer le type d\'utilisateur, utilisation du dashboard par défaut');
              redirectPath = '/dashboard'; // Fallback par défaut
            }
          }
        }
        router.push(redirectPath);
      };
      
      determineRedirect();
    }
  }, [isAuthenticated, isLoading, user, router, isRedirecting]);

  return { isRedirecting };
}
