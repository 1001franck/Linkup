/**
 * ========================================
 * HOOK USE REDIRECT - GESTION DES REDIRECTIONS
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Hook centralisé pour la gestion des redirections
 * Logique de redirection basée sur les rôles utilisateur
 * Préparation pour l'intégration backend
 * 
 * 🏗️ ARCHITECTURE :
 * - Single Responsibility : Gestion unique des redirections
 * - Open/Closed : Extensible pour nouveaux types de redirection
 * - Interface Segregation : Fonctions spécifiques et optionnelles
 * 
 * 🔐 FONCTIONNALITÉS :
 * - Redirection automatique vers le bon dashboard
 * - Gestion des rôles utilisateur
 * - Redirection vers la page de connexion
 * - Support des paramètres de redirection
 * 
 * 🚀 INTÉGRATION BACKEND :
 * - Redirection basée sur les données utilisateur du backend
 * - Gestion des tokens d'authentification
 * - Synchronisation avec les permissions backend
 * - Cache local pour les performances
 * 
 * 📱 UTILISATION :
 * - Redirection après connexion/inscription
 * - Navigation conditionnelle selon le rôle
 * - Gestion des accès non autorisés
 * - Redirection après déconnexion
 */

import { useRouter } from 'next/navigation';

/**
 * Hook pour la gestion des redirections
 * 
 * @returns Object contenant les fonctions de redirection
 * 
 * @example
 * ```tsx
 * const { redirectToDashboard, redirectToLogin } = useRedirect();
 * 
 * // Redirection automatique selon le rôle
 * redirectToDashboard();
 * 
 * // Redirection avec rôle spécifique
 * redirectToDashboard('company');
 * 
 * // Redirection vers login avec retour
 * redirectToLogin('/dashboard');
 * ```
 */
export function useRedirect() {
  const router = useRouter();

  /**
   * Redirige vers le dashboard approprié selon le rôle utilisateur
   * 
   * @param userRole - Rôle utilisateur (optionnel, sera détecté automatiquement)
   * @param fallbackPath - Chemin de fallback (optionnel)
   * 
   * @example
   * ```tsx
   * // Redirection automatique
   * redirectToDashboard();
   * 
   * // Redirection avec rôle spécifique
   * redirectToDashboard('company');
   * 
   * // Redirection avec fallback
   * redirectToDashboard('postulant', '/profile');
   * ```
   */
  const redirectToDashboard = (userRole?: string, fallbackPath?: string) => {
    // ========================================
    // DÉTECTION DU RÔLE UTILISATEUR
    // ========================================
    
    let role = userRole;
    if (!role && typeof window !== 'undefined') {
      try {
        const userData = localStorage.getItem('user');
        console.log('🐛 DEBUG: Données utilisateur dans redirectToDashboard:', userData);
        if (userData) {
          const user = JSON.parse(userData);
          role = user.role;
          console.log('🐛 DEBUG: Rôle extrait:', role);
        }
      } catch (error) {
        console.error('Erreur lors de la lecture du rôle utilisateur:', error);
      }
    }

    // ========================================
    // DÉTERMINATION DU CHEMIN DE REDIRECTION
    // ========================================
    
    let dashboardPath = '/dashboard';
    if (role === 'admin') {
      dashboardPath = '/admin-dashboard';
    } else if (role === 'company') {
      dashboardPath = '/company-dashboard';
    }
    const finalPath = fallbackPath || dashboardPath;
    
    console.log(`🐛 DEBUG: Redirection vers: ${finalPath} (rôle: ${role})`);
    
    // ========================================
    // EXÉCUTION DE LA REDIRECTION
    // ========================================
    
    // Utiliser window.location.href pour une redirection plus fiable
    if (typeof window !== 'undefined') {
      window.location.href = finalPath;
    } else {
      router.push(finalPath);
    }
  };

  /**
   * Redirige vers la page de connexion
   * 
   * @param redirectPath - Chemin de redirection après connexion (optionnel)
   * 
   * @example
   * ```tsx
   * // Redirection simple vers login
   * redirectToLogin();
   * 
   * // Redirection avec retour après connexion
   * redirectToLogin('/dashboard');
   * ```
   */
  const redirectToLogin = (redirectPath?: string) => {
    const loginPath = redirectPath ? `/login?redirect=${redirectPath}` : '/login';
    router.push(loginPath);
  };

  // ========================================
  // RETOUR DU HOOK
  // ========================================
  
  return {
    redirectToDashboard,
    redirectToLogin
  };
}
