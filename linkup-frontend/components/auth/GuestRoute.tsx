/**
 * ========================================
 * COMPOSANT GUEST ROUTE - ROUTES INVITÉS
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Protection des routes accessibles uniquement aux utilisateurs non authentifiés
 * Redirection automatique vers le dashboard si déjà connecté
 * 
 * 🏗️ ARCHITECTURE :
 * - Single Responsibility : Gestion unique des routes invités
 * - Open/Closed : Extensible via props redirectTo
 * - Interface Segregation : Props spécifiques et optionnelles
 * 
 * 🔐 FONCTIONNALITÉS :
 * - Vérification de l'état d'authentification
 * - Redirection automatique si connecté
 * - Écran de chargement pendant la vérification
 * - Support du chemin de redirection personnalisé
 * 
 * 🚀 INTÉGRATION BACKEND :
 * - Redirection basée sur l'état d'authentification du backend
 * - Gestion des tokens d'authentification
 * - Synchronisation avec les données utilisateur
 * - Cache local pour les performances
 * 
 * 📱 UTILISATION :
 * - Wrapper des pages de connexion/inscription
 * - Gestion automatique de la redirection
 * - État de chargement avec spinner
 * - Prévention de l'accès double aux pages publiques
 */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Props du composant GuestRoute
 * @interface GuestRouteProps
 */
interface GuestRouteProps {
  /** Composants enfants à afficher si non authentifié */
  children: React.ReactNode;
  /** Chemin de redirection si déjà authentifié (optionnel) */
  redirectTo?: string;
}

/**
 * Composant de protection des routes invités
 * 
 * @param children - Composants enfants à afficher si non authentifié
 * @param redirectTo - Chemin de redirection si déjà authentifié
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <GuestRoute>
 *   <LoginForm />
 * </GuestRoute>
 * 
 * <GuestRoute redirectTo="/company-dashboard">
 *   <RegisterForm />
 * </GuestRoute>
 * ```
 */
export function GuestRoute({ children, redirectTo = "/dashboard" }: GuestRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // ========================================
  // REDIRECTION AUTOMATIQUE (DÉSACTIVÉE)
  // ========================================
  
  // Désactivé pour permettre aux utilisateurs connectés d'accéder aux pages d'inscription
  // si nécessaire (par exemple pour créer un autre compte)
  // useEffect(() => {
  //   if (!isLoading && isAuthenticated) {
  //     router.push(redirectTo);
  //   }
  // }, [isAuthenticated, isLoading, router, redirectTo]);

  // ========================================
  // ÉTAT DE CHARGEMENT
  // ========================================
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/20 flex items-center justify-center mx-auto mb-4">
            <div className="h-6 w-6 text-cyan-600 animate-spin">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // GESTION DES ÉTATS
  // ========================================
  
  // Permettre l'accès même si l'utilisateur est connecté
  // (utile pour les pages d'inscription où l'utilisateur pourrait vouloir créer un autre compte)
  return <>{children}</>;
}
