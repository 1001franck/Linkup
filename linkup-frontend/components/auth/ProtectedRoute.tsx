/**
 * ========================================
 * COMPOSANT PROTECTED ROUTE - ORGANISM
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Protection des routes nécessitant une authentification
 * Redirection automatique vers la page de connexion si non authentifié
 * 
 * 🏗️ ARCHITECTURE :
 * - Single Responsibility : Gestion unique de la protection des routes
 * - Open/Closed : Extensible via props fallback
 * - Interface Segregation : Props spécifiques et optionnelles
 * 
 * 🔐 FONCTIONNALITÉS :
 * - Vérification de l'état d'authentification
 * - Redirection automatique vers /login
 * - Écran de chargement pendant la vérification
 * - Support du fallback personnalisé
 * 
 * 📱 UTILISATION :
 * - Wrapper des pages protégées
 * - Gestion automatique de la redirection
 * - État de chargement avec spinner
 */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Props du composant ProtectedRoute
 * @interface ProtectedRouteProps
 */
interface ProtectedRouteProps {
  /** Composants enfants à protéger */
  children: React.ReactNode;
  /** Composant de fallback à afficher si non authentifié (optionnel) */
  fallback?: React.ReactNode;
}

/**
 * Composant de protection des routes
 * 
 * @param children - Composants enfants à protéger
 * @param fallback - Composant de fallback personnalisé
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardContent />
 * </ProtectedRoute>
 * 
 * <ProtectedRoute fallback={<CustomLoginPrompt />}>
 *   <PrivatePage />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // ========================================
  // REDIRECTION AUTOMATIQUE
  // ========================================
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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
  
  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}
