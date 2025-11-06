/**
 * ========================================
 * UTILITAIRES CSS - UTILS
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Fonction utilitaire pour combiner et optimiser les classes CSS
 * Utilise clsx pour la logique conditionnelle et tailwind-merge pour la déduplication
 * 
 * 🏗️ ARCHITECTURE :
 * - clsx : Gestion intelligente des classes conditionnelles
 * - tailwind-merge : Déduplication des classes Tailwind conflictuelles
 * 
 * 📱 UTILISATION :
 * - Combinaison de classes conditionnelles
 * - Override des classes Tailwind par défaut
 * - Optimisation automatique des classes
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Fonction utilitaire pour combiner les classes CSS
 * 
 * @param inputs - Classes CSS à combiner (string, object, array, etc.)
 * @returns string - Classes CSS optimisées et dédupliquées
 * 
 * @example
 * ```tsx
 * cn("px-4 py-2", "bg-blue-500", { "text-white": isActive })
 * // Résultat : "px-4 py-2 bg-blue-500 text-white"
 * 
 * cn("px-4", "px-6") // Déduplication automatique
 * // Résultat : "px-6" (px-4 est écrasé par px-6)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
