import React from 'react';
import { 
  Clock, 
  CalendarCheck, 
  CircleCheck, 
  CircleX, 
  CircleHelp 
} from 'lucide-react';
import { ApplicationStatus, UrgencyLevel } from '@/types/application';

/**
 * Hook personnalisé pour les utilitaires des candidatures
 * Centralise la logique d'affichage et de formatage
 */
export function useApplicationUtils() {
  
  // Fonction pour obtenir l'icône de statut
  const getStatusIcon = React.useCallback((status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "interview":
        return <CalendarCheck className="h-4 w-4 text-blue-500" />;
      case "accepted":
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <CircleX className="h-4 w-4 text-red-500" />;
      case "withdrawn":
        return <CircleHelp className="h-4 w-4 text-gray-500" />;
      default:
        return <CircleHelp className="h-4 w-4 text-gray-500" />;
    }
  }, []);

  // Fonction pour obtenir le label de statut
  const getStatusLabel = React.useCallback((status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return "En cours";
      case "interview":
        return "Entretien programmé";
      case "accepted":
        return "Acceptée";
      case "rejected":
        return "Refusée";
      case "withdrawn":
        return "Retirée";
      default:
        return "Inconnu";
    }
  }, []);

  // Fonction pour obtenir la couleur de statut
  const getStatusColor = React.useCallback((status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  // Fonction pour obtenir la couleur d'urgence
  const getUrgencyColor = React.useCallback((urgency: UrgencyLevel) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  // Fonction pour parser une date DD-MM-YYYY
  const parseDate = React.useCallback((dateString: string): Date => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, []);

  // Fonction pour formater une date
  const formatDate = React.useCallback((date: Date): string => {
    return date.toLocaleDateString('fr-FR');
  }, []);

  // Fonction pour obtenir le temps écoulé
  const getTimeAgo = React.useCallback((dateString: string): string => {
    const date = parseDate(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
    if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
    return `Il y a ${Math.floor(diffInDays / 365)} ans`;
  }, [parseDate]);

  return {
    getStatusIcon,
    getStatusLabel,
    getStatusColor,
    getUrgencyColor,
    parseDate,
    formatDate,
    getTimeAgo
  };
}
