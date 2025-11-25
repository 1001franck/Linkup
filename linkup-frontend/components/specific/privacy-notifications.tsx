/**
 * Composant PrivacyNotifications - Molecule
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des notifications de confidentialité
 * - Open/Closed : Extensible via composition et props
 * - Interface Segregation : Props spécifiques et optionnelles
 */

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export interface PrivacyNotificationProps {
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export const usePrivacyNotifications = () => {
  const { toast } = useToast();

  const showSuccess = React.useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 3000,
    });
  }, [toast]);

  const showError = React.useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      duration: 5000,
    });
  }, [toast]);

  const showInfo = React.useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 4000,
    });
  }, [toast]);

  return {
    showSuccess,
    showError,
    showInfo,
  };
};

// Hook personnalisé pour les notifications de préférences
export const usePrivacyPreferenceNotifications = () => {
  const { showSuccess, showError, showInfo } = usePrivacyNotifications();

  const notifyPreferencesSaved = React.useCallback(() => {
    showSuccess(
      "Préférences sauvegardées",
      "Vos préférences de confidentialité ont été mises à jour avec succès."
    );
  }, [showSuccess]);

  const notifyPreferencesReset = React.useCallback(() => {
    showInfo(
      "Préférences réinitialisées",
      "Vos préférences ont été restaurées aux valeurs par défaut."
    );
  }, [showInfo]);

  const notifySaveError = React.useCallback(() => {
    showError(
      "Erreur de sauvegarde",
      "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer."
    );
  }, [showError]);

  const notifyPreferenceChanged = React.useCallback((preferenceName: string, enabled: boolean) => {
    showInfo(
      "Préférence modifiée",
      `${preferenceName} a été ${enabled ? 'activée' : 'désactivée'}.`
    );
  }, [showInfo]);

  return {
    notifyPreferencesSaved,
    notifyPreferencesReset,
    notifySaveError,
    notifyPreferenceChanged,
  };
};
