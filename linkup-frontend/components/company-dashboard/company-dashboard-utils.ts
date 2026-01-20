/**
 * Utilitaires pour le Dashboard Entreprise
 * Fonctions de formatage et helpers
 */

/**
 * Retourne la couleur CSS pour un statut
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "interview":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

/**
 * Retourne le label français pour un statut
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "En attente";
    case "interview":
      return "Entretien";
    case "accepted":
      return "Accepté";
    case "rejected":
      return "Refusé";
    default:
      return "Inconnu";
  }
}

/**
 * Tronque un nom d'entreprise si trop long
 */
export function truncateCompanyName(name: string, maxLength: number = 20): string {
  if (!name) return "Entreprise";
  if (name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}...`;
}






