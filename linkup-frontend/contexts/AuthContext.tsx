
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
      console.log('🟡 [AUTH CHECK] Déjà vérifié, skip');
      return;
    }

    console.log('🟡 [AUTH CHECK] Début vérification authentification');
    
    const checkAuth = async () => {
      setHasCheckedAuth(true);
      console.log('🟡 [AUTH CHECK] hasCheckedAuth = true');
      
      // Timeout pour éviter que l'application reste bloquée si le backend ne répond pas
      const timeoutId = setTimeout(() => {
        logger.warn('Timeout lors de la vérification de l\'authentification - backend non accessible');
        setUser(null);
        setIsLoading(false);
      }, 10000); // 10 secondes de timeout

      try {
        // Essayer d'abord avec getCurrentUser() pour éviter les appels inutiles
        // Si l'utilisateur est un 'user', on n'appellera pas getCurrentCompany()
        const userResponse = await apiClient.getCurrentUser();
        
        clearTimeout(timeoutId);

        // Si on a trouvé un utilisateur
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data as User;
          const userRole = userData.role;
          
          console.log('🟢 [AUTH CHECK] Utilisateur trouvé:', { email: userData.email, role: userRole });
          
          if (userRole === 'admin') {
            const adminUser: User = { ...userData, role: 'admin' };
            setUser(adminUser);
          } else if (userRole === 'company') {
            // Si le rôle est 'company', récupérer les données complètes de l'entreprise
            try {
              const companyResponse = await apiClient.getCurrentCompany();
              if (companyResponse.success && companyResponse.data) {
                console.log('🟢 [AUTH CHECK] Données entreprise récupérées');
                setUser(companyResponse.data as Company);
              } else {
                // Fallback sur les données utilisateur si l'entreprise n'est pas disponible
                setUser(userData);
              }
            } catch (companyError) {
              // Si l'appel échoue, utiliser les données utilisateur
              logger.debug('Impossible de récupérer les données entreprise, utilisation des données utilisateur');
              setUser(userData);
            }
          } else {
            // Utilisateur normal - on s'arrête ici, pas besoin d'appeler getCurrentCompany()
            setUser(userData);
          }
        } 
        // Si getCurrentUser() a échoué (401/404), essayer getCurrentCompany()
        else {
          // Vérifier si c'est une erreur 401 (non autorisé) - cela signifie que le token est invalide/expiré
          // Dans ce cas, ne pas essayer getCurrentCompany() car le token est invalide
          const isUnauthorized = userResponse.error?.includes('401') || userResponse.error?.includes('Unauthorized');
          
          if (isUnauthorized) {
            console.log('🔴 [AUTH CHECK] Token invalide/expiré (401), pas d\'appel à getCurrentCompany()');
            setUser(null);
          } else {
            console.log('🟡 [AUTH CHECK] Pas d\'utilisateur, essai avec entreprise...');
            const companyResponse = await apiClient.getCurrentCompany();
            
            if (companyResponse.success && companyResponse.data) {
              console.log('🟢 [AUTH CHECK] Entreprise trouvée:', { name: companyResponse.data.name });
              setUser(companyResponse.data as Company);
            } else {
              // Aucun utilisateur connecté
              console.log('🔴 [AUTH CHECK] Aucun utilisateur connecté');
              setUser(null);
            }
          }
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
    console.log('🔴 [LOGOUT] Début déconnexion');
    console.log('🔴 [LOGOUT] État avant:', { user: user?.email || user?.recruiter_mail, isAuthenticated: !!user });
    
    // Nettoyer l'état immédiatement
    setUser(null);
    setIsLoading(false);
    // NE PAS remettre hasCheckedAuth à false - cela évitera que checkAuth() se relance après redirection
    // On garde hasCheckedAuth = true pour empêcher une nouvelle vérification
    setHasCheckedAuth(true);
    
    console.log('🔴 [LOGOUT] État nettoyé:', { user: null, isAuthenticated: false, hasCheckedAuth: true });
    
    // Nettoyer localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userSkills');
        localStorage.removeItem('profileCompleted');
        console.log('🔴 [LOGOUT] localStorage nettoyé');
      } catch (error) {
        console.error('🔴 [LOGOUT] Erreur lors du nettoyage:', error);
      }
    }
    
    // Appeler l'API de déconnexion et attendre qu'elle se termine
    try {
      const isCompany = user && ('id_company' in user || 'recruiter_mail' in user);
      console.log('🔴 [LOGOUT] Appel API logout, isCompany:', isCompany);
      
      if (isCompany) {
        await apiClient.logoutCompany();
      } else {
        await apiClient.logout();
      }
      
      console.log('🔴 [LOGOUT] API logout réussie');
      
      // Attendre un peu pour s'assurer que le cookie est bien supprimé côté serveur
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('🔴 [LOGOUT] Erreur logout API:', error);
      // Continuer quand même la déconnexion même si l'API échoue
    }
    
    console.log('🔴 [LOGOUT] Redirection vers /');
    // Utiliser window.location.replace() au lieu de href pour éviter l'historique
    window.location.replace('/');
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
        const userData = userResponse.data as User;
        // Si c'est une entreprise, récupérer les données complètes
        if (userData.role === 'company') {
          try {
            const companyResponse = await apiClient.getCurrentCompany();
            if (companyResponse.success && companyResponse.data) {
              setUser(companyResponse.data as Company);
              return;
            }
          } catch (companyError) {
            logger.debug('Impossible de récupérer les données entreprise lors du refresh');
          }
        }
        setUser(userData);
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
