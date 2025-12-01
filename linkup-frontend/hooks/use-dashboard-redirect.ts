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
        logger.debug('🏢 Redirection entreprise vers:', redirectPath);
      } else if ('id_user' in user || userRole === 'user') {
        // C'est un utilisateur
        redirectPath = '/dashboard';
        logger.debug('👤 Redirection utilisateur vers:', redirectPath);
      } else {
        // Fallback: essayer de récupérer les infos utilisateur depuis l'API
        // Le cookie httpOnly sera automatiquement envoyé
        // Timeout pour éviter que l'application reste bloquée
        try {
          // Créer une fonction avec timeout
          const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number) => {
            const timeout = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeoutMs)
            );
            return Promise.race([promise, timeout]);
          };
          
          const userResponse = await fetchWithTimeout(
            apiClient.getCurrentUser(),
            5000
          ) as any;
          
          if (userResponse && userResponse.success && userResponse.data) {
            const userData = userResponse.data as any;
            const userRoleFromApi = userData.role;
            if (userRoleFromApi === 'admin') {
              redirectPath = '/admin-dashboard';
            } else if (userRoleFromApi === 'company') {
              redirectPath = '/company-dashboard';
            } else {
              redirectPath = '/dashboard';
            }
          } else {
            // Essayer entreprise si pas utilisateur
            const companyResponse = await fetchWithTimeout(
              apiClient.getCurrentCompany(),
              5000
            ) as any;
            
            if (companyResponse && companyResponse.success && companyResponse.data) {
              redirectPath = '/company-dashboard';
            }
          }
        } catch (error) {
          logger.debug('Impossible de déterminer le type d\'utilisateur, utilisation du dashboard par défaut');
          redirectPath = '/dashboard'; // Fallback par défaut
        }
      }
      
      router.push(redirectPath);
    };
    
    determineRedirect();
  }, [isAuthenticated, isLoading, user, router]); // Retiré isRedirecting des dépendances pour éviter la boucle

  return { isRedirecting };
}
