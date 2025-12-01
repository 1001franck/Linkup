
/**
 * ========================================
 * CONTEXTE D'AUTHENTIFICATION - AUTHCONTEXT
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Gestion centralisée de l'authentification utilisateur
 * Support des rôles : user, company, admin
 * Intégration avec l'API backend
 * 
 * 🏗️ ARCHITECTURE :
 * - Context API React pour l'état global
 * - API Client pour les requêtes backend
 * - Types TypeScript stricts
 * 
 * 🔐 FONCTIONNALITÉS :
 * - Connexion/Déconnexion utilisateurs et entreprises
 * - Gestion des rôles utilisateur
 * - Persistance de session via JWT
 * - Validation des données
 * 
 * 📱 UTILISATION :
 * - Wrapper de l'application avec AuthProvider
 * - Hook useAuth() pour accéder au contexte
 * - Redirection automatique selon le rôle
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { User, Company } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import logger from '@/lib/logger';

// ========================================
// INTERFACES TYPESCRIPT
// ========================================

// Types importés depuis l'API
export type { User, Company } from '@/types/api';

/**
 * Interface du contexte d'authentification
 * @interface AuthContextType
 */
interface AuthContextType {
  /** Utilisateur actuellement connecté (null si non connecté) */
  user: User | Company | null;
  /** Indique si l'utilisateur est authentifié */
  isAuthenticated: boolean;
  /** Indique si le chargement est en cours */
  isLoading: boolean;
  /** Fonction de connexion utilisateur */
  login: (email: string, password: string) => Promise<boolean>;
  /** Fonction de connexion entreprise */
  loginCompany: (recruiter_mail: string, password: string) => Promise<boolean>;
  /** Fonction de déconnexion */
  logout: () => void;
  /** Fonction de mise à jour des données utilisateur */
  updateUser: (userData: Partial<User | Company>) => void;
  /** Fonction de rafraîchissement du profil */
  refreshUser: () => Promise<void>;
}

// ========================================
// CRÉATION DU CONTEXTE
// ========================================

/**
 * Contexte React pour l'authentification
 * Utilisé par le hook useAuth() pour accéder aux données d'authentification
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // Protection contre les appels répétés
  const { toast } = useToast();

  // Vérifier l'authentification au chargement
  // Le cookie httpOnly est automatiquement envoyé par le navigateur
  useEffect(() => {
    // Ne pas vérifier plusieurs fois
    if (hasCheckedAuth) {
      return;
    }

    const checkAuth = async () => {
      setHasCheckedAuth(true);
      
      // Timeout pour éviter que l'application reste bloquée si le backend ne répond pas
      const timeoutId = setTimeout(() => {
        logger.warn('Timeout lors de la vérification de l\'authentification - backend non accessible');
        setUser(null);
        setIsLoading(false);
      }, 10000); // 10 secondes de timeout

      try {
        // Utiliser Promise.allSettled pour appeler les deux endpoints en parallèle
        // Cela évite les appels séquentiels qui peuvent déclencher le rate limiting
        // Les erreurs 401/404 sont attendues si l'utilisateur n'est pas connecté
        const [userResult, companyResult] = await Promise.allSettled([
          apiClient.getCurrentUser(),
          apiClient.getCurrentCompany()
        ]);

        clearTimeout(timeoutId);

        // Vérifier d'abord si c'est un utilisateur
        if (userResult.status === 'fulfilled' && userResult.value.success && userResult.value.data) {
          const userData = userResult.value.data as User;
          const userRole = userData.role;
          
          if (userRole === 'admin') {
            const adminUser: User = { ...userData, role: 'admin' };
            setUser(adminUser);
          } else if (userRole === 'company') {
            // Pour les entreprises, utiliser les données de l'entreprise si disponibles
            if (companyResult.status === 'fulfilled' && companyResult.value.success && companyResult.value.data) {
              setUser(companyResult.value.data as Company);
            } else {
              // Fallback sur les données utilisateur si l'entreprise n'est pas disponible
              setUser(userData);
            }
          } else {
            // Utilisateur normal
            setUser(userData);
          }
        } 
        // Sinon, vérifier si c'est une entreprise
        else if (companyResult.status === 'fulfilled' && companyResult.value.success && companyResult.value.data) {
          setUser(companyResult.value.data as Company);
        } 
        // Aucun utilisateur connecté
        else {
          setUser(null);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        logger.error('Erreur lors de la vérification de l\'authentification:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [hasCheckedAuth]);

  /**
   * ========================================
   * FONCTION DE CONNEXION UTILISATEUR
   * ========================================
   * 
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Promise<boolean> - true si connexion réussie, false sinon
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Appeler le backend pour se connecter
      const response = await apiClient.loginUser({ email, password });
      
      if (response.success) {
        // Connexion réussie - le cookie est défini par le backend
        // Essayer de récupérer les infos utilisateur immédiatement
        try {
          await new Promise(resolve => setTimeout(resolve, 500)); // Attendre que le cookie soit propagé
          const userResponse = await apiClient.getCurrentUser();
          if (userResponse.success && userResponse.data) {
            setUser(userResponse.data as User);
          }
        } catch (userError) {
          // Si ça échoue, ce n'est pas grave, le useEffect récupérera les infos
          logger.debug('Impossible de récupérer les infos immédiatement, le useEffect s\'en chargera');
        }
        
        return true;
      } else {
        // Connexion échouée - afficher le message d'erreur du backend
        const errorMessage = response.error || 'Email ou mot de passe incorrect';
        toast({
          title: 'Erreur de connexion',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      toast({
        title: 'Erreur de connexion',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ========================================
   * FONCTION DE CONNEXION ENTREPRISE
   * ========================================
   * 
   * @param recruiter_mail - Email du recruteur
   * @param password - Mot de passe
   * @returns Promise<boolean> - true si connexion réussie, false sinon
   */
  const loginCompany = async (recruiter_mail: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Appeler le backend pour se connecter
      const response = await apiClient.loginCompany({ recruiter_mail, password });
      
      if (response.success) {
        // Connexion réussie - le cookie est défini par le backend
        // Essayer de récupérer les infos entreprise immédiatement
        try {
          await new Promise(resolve => setTimeout(resolve, 500)); // Attendre que le cookie soit propagé
          const companyResponse = await apiClient.getCurrentCompany();
          if (companyResponse.success && companyResponse.data) {
            setUser(companyResponse.data as Company);
          }
        } catch (companyError) {
          // Si ça échoue, ce n'est pas grave, le useEffect récupérera les infos
          logger.debug('Impossible de récupérer les infos immédiatement, le useEffect s\'en chargera');
        }
        
        return true;
      } else {
        // Connexion échouée - afficher le message d'erreur du backend
        const errorMessage = response.error || 'Email ou mot de passe incorrect';
        toast({
          title: 'Erreur de connexion',
          description: errorMessage,
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      logger.error('Erreur lors de la connexion entreprise:', error);
      toast({
        title: 'Erreur de connexion',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ========================================
   * FONCTION DE DÉCONNEXION DYNAMIQUE
   * ========================================
   * 
   * Nettoie toutes les données d'authentification et redirige vers l'accueil
   * Détecte automatiquement le type d'utilisateur pour utiliser la bonne route
   */
  const logout = async () => {
    try {
      // ========================================
      // DÉTECTION DU TYPE D'UTILISATEUR
      // ========================================
      
      let isCompany = false;
      
      if (user) {
        // Vérifier si c'est une entreprise
        isCompany = 'id_company' in user || 'recruiter_mail' in user;
      } else {
        // Si pas d'utilisateur, essayer de récupérer les infos entreprise pour détecter le type
        try {
          const companyResponse = await apiClient.getCurrentCompany();
          if (companyResponse.success && companyResponse.data) {
            isCompany = true;
          }
        } catch {
          // Pas une entreprise, continuer avec la déconnexion utilisateur
        }
      }
      
      // ========================================
      // APPEL DE LA BONNE ROUTE DE DÉCONNEXION
      // ========================================
      
      if (isCompany) {
        await apiClient.logoutCompany();
      } else {
        await apiClient.logout();
      }
      
      // ========================================
      // NETTOYAGE DE L'ÉTAT ET LOCALSTORAGE
      // ========================================
      
      setUser(null);
      
      // Nettoyer toutes les données sensibles de localStorage
      if (typeof window !== 'undefined') {
        try {
          // Supprimer les données utilisateur sensibles
          localStorage.removeItem('user');
          localStorage.removeItem('userProfile');
          localStorage.removeItem('userSkills');
          localStorage.removeItem('profileCompleted');
          // Nettoyer les autres données liées à l'utilisateur
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('favoriteResources_') || key.startsWith('viewedResources_'))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
          console.error('Erreur lors du nettoyage de localStorage:', error);
        }
      }
      
      toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté avec succès',
        variant: 'default',
      });
      
      // ========================================
      // REDIRECTION
      // ========================================
      
      // Rediriger vers la page d'accueil
      window.location.href = '/';
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      // En cas d'erreur, nettoyer l'état local
      setUser(null);
      
      toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté (nettoyage local)',
        variant: 'default',
      });
      
      window.location.href = '/';
    }
  };

  /**
   * ========================================
   * FONCTION DE MISE À JOUR UTILISATEUR
   * ========================================
   * 
   * @param userData - Données partielles à mettre à jour
   */
  const updateUser = (userData: Partial<User | Company>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  /**
   * ========================================
   * FONCTION DE RAFRAÎCHISSEMENT DU PROFIL
   * ========================================
   * 
   * Récupère les dernières données utilisateur depuis l'API
   */
  const refreshUser = async () => {
    try {
      // Essayer d'abord avec utilisateur normal
      const userResponse = await apiClient.getCurrentUser();
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data as User);
        return;
      }
      
      // Si échec, essayer avec entreprise
      const companyResponse = await apiClient.getCurrentCompany();
      if (companyResponse.success && companyResponse.data) {
        setUser(companyResponse.data as Company);
      }
    } catch (error) {
      logger.error('Erreur lors du rafraîchissement du profil:', error);
    }
  };

  // ========================================
  // VALEUR DU CONTEXTE
  // ========================================
  
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    loginCompany,
    logout,
    updateUser,
    refreshUser,
  };

  // ========================================
  // RENDU DU PROVIDER
  // ========================================
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * ========================================
 * HOOK D'UTILISATION DU CONTEXTE
 * ========================================
 * 
 * Hook personnalisé pour accéder au contexte d'authentification
 * Vérifie que le hook est utilisé dans un AuthProvider
 * 
 * @returns AuthContextType - Contexte d'authentification
 * @throws Error si utilisé en dehors d'un AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}
