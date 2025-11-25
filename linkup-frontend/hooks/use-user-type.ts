/**
 * ========================================
 * HOOK USE USER TYPE - DÉTECTION DE RÔLE
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Hook centralisé pour la détection du type d'utilisateur
 * Gestion des rôles : user, company, admin
 * Préparation pour l'intégration backend
 * 
 * 🏗️ ARCHITECTURE :
 * - Single Responsibility : Détection unique du type utilisateur
 * - Open/Closed : Extensible pour nouveaux rôles
 * - Interface Segregation : Types spécifiques et optionnels
 * 
 * 🔐 FONCTIONNALITÉS :
 * - Détection automatique du rôle utilisateur
 * - Gestion des états de chargement
 * - Fallback vers localStorage
 * - Types TypeScript stricts
 * 
 * 🚀 INTÉGRATION BACKEND :
 * - Récupération des données utilisateur via API
 * - Gestion des tokens d'authentification
 * - Synchronisation avec le backend
 * - Cache local pour les performances
 * 
 * 📱 UTILISATION :
 * - Détection de rôle dans les composants
 * - Logique de redirection conditionnelle
 * - Affichage conditionnel d'éléments UI
 * - Gestion des permissions
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Types de rôles utilisateur supportés
 * @type UserType
 */
export type UserType = 'user' | 'company' | 'admin' | null;

/**
 * Hook pour la détection du type d'utilisateur
 * 
 * @returns Object contenant le type utilisateur et les helpers
 * 
 * @example
 * ```tsx
 * const { userType, isCompany, isUser, isLoading } = useUserType();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (isCompany) return <CompanyDashboard />;
 * if (isUser) return <UserDashboard />;
 * ```
 */
export function useUserType() {
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // ========================================
  // DÉTECTION DU TYPE UTILISATEUR
  // ========================================
  
  useEffect(() => {
    const detectUserType = () => {
      if (!isAuthenticated) {
        setUserType(null);
        setIsLoading(false);
        return;
      }

      try {
        // ========================================
        // PRIORITÉ 1: DONNÉES DU CONTEXTE AUTH
        // ========================================
        
        if (user?.role) {
          setUserType(user.role as UserType);
          setIsLoading(false);
          return;
        }

        // ========================================
        // PRIORITÉ 2: FALLBACK VERS LOCALSTORAGE
        // ========================================
        
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserType(parsedUser.role as UserType);
          } else {
            setUserType(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la détection du type d\'utilisateur:', error);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    };

    detectUserType();
  }, [user, isAuthenticated]);

  // ========================================
  // HELPERS DE DÉTECTION
  // ========================================
  
  const isCompany = userType === 'company';
  const isUser = userType === 'user';
  const isAdmin = userType === 'admin';

  // ========================================
  // RETOUR DU HOOK
  // ========================================
  
  return {
    userType,
    isCompany,
    isUser,
    isAdmin,
    isLoading
  };
}


