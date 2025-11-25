/**
 * ========================================
 * COMPOSANT THEME PROVIDER - ORGANISM
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Wrapper pour le système de thème next-themes
 * Gestion du mode sombre/clair avec persistance
 * 
 * 🏗️ ARCHITECTURE :
 * - Single Responsibility : Gestion unique du thème
 * - Open/Closed : Extensible via props
 * - Interface Segregation : Props spécifiques et optionnelles
 * 
 * 🎨 FONCTIONNALITÉS :
 * - Support du mode sombre/clair
 * - Persistance des préférences utilisateur
 * - Détection automatique du thème système
 * - Transition fluide entre les thèmes
 * 
 * 📱 UTILISATION :
 * - Wrapper de l'application dans layout.tsx
 * - Accès via useTheme() dans les composants
 * - Configuration via props (attribute, defaultTheme, etc.)
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

/**
 * Composant ThemeProvider pour la gestion des thèmes
 * 
 * @param children - Composants enfants à wrapper
 * @param props - Props du ThemeProvider next-themes
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <ThemeProvider
 *   attribute="class"
 *   defaultTheme="system"
 *   enableSystem
 *   disableTransitionOnChange
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
