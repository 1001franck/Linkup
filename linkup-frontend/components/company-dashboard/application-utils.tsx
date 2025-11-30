/**
 * Utilitaires pour les candidatures
 * Fonctions de formatage et helpers
 */

import React from "react";
import {
  Clock3,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

/**
 * Formate un numéro de téléphone pour l'affichage
 */
export function formatPhoneForDisplay(phone: string | null | undefined): string {
  if (!phone) return "Non renseigné";

  // Si le numéro contient déjà des espaces, tirets ou autres caractères, le laisser tel quel
  if (/[\s\-\.\(\)]/.test(phone)) {
    return phone;
  }

  // Sinon, ajouter des espaces tous les 2 chiffres pour améliorer la lisibilité
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    // Format français: 06 12 34 56 78
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 8)} ${cleaned.substring(8)}`;
  } else if (cleaned.length === 11) {
    // Format avec indicatif: +33 6 12 34 56 78
    if (cleaned.startsWith("33")) {
      return `+33 ${cleaned.substring(2, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9)}`;
    }
  }

  // Pour les autres formats, ajouter des espaces tous les 2 chiffres
  return cleaned.match(/.{1,2}/g)?.join(" ") || phone;
}

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
 * Retourne l'icône pour un statut
 */
export function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock3 className="h-4 w-4" />;
    case "interview":
      return <Calendar className="h-4 w-4" />;
    case "accepted":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock3 className="h-4 w-4" />;
  }
}

