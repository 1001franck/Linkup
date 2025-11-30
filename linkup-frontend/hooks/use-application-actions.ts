import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  useWithdrawApplication,
  useArchiveApplication,
  useRequestApplicationFeedback
} from '@/hooks/use-api';
import { Application, ApplicationActions } from '@/types/application';

/**
 * Hook personnalisé pour la gestion des actions sur les candidatures
 * Centralise la logique des actions utilisateur
 */
export function useApplicationActions(
  applications: Application[],
  openConfirmationModal: (title: string, description: string, onConfirm: () => void, variant?: any, confirmText?: string, cancelText?: string) => void,
  refetchApplications?: () => void,
  updateJobsInteractions?: (jobId: number, status: 'applied' | 'withdrawn') => void
) {
  const { toast } = useToast();
  
  // Hooks pour les mutations
  const withdrawApplicationMutation = useWithdrawApplication();
  const archiveApplicationMutation = useArchiveApplication();
  const requestFeedbackMutation = useRequestApplicationFeedback();


  // Action pour retirer une candidature
  const withdrawApplication = useCallback((applicationId: string) => {
    const application = applications.find(a => a.metadata.id === applicationId);
    
    openConfirmationModal(
      "Retirer ma candidature",
      `Êtes-vous sûr de vouloir retirer votre candidature pour "${application?.jobOffer.title}" chez ${application?.company.name} ?\n\nCette action ne peut pas être annulée.`,
      async () => {
        try {
          await withdrawApplicationMutation.mutate(parseInt(applicationId));
          
          // Mettre à jour l'état des jobs interactions
          if (updateJobsInteractions) {
            updateJobsInteractions(parseInt(applicationId), 'withdrawn');
          }
          
          // Rafraîchir les données après le retrait
          if (refetchApplications) {
            refetchApplications();
          }
          
          toast({
            title: "Candidature retirée",
            description: `Votre candidature pour "${application?.jobOffer.title}" chez ${application?.company.name} a été retirée avec succès.`,
            variant: "default",
            duration: 4000,
          });
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Impossible de retirer la candidature. Veuillez réessayer.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      "warning",
      "Retirer",
      "Annuler"
    );
  }, [applications, withdrawApplicationMutation, toast, openConfirmationModal]);

  // Action pour demander un retour
  const requestFeedback = useCallback((applicationId: string) => {
    const application = applications.find(a => a.metadata.id === applicationId);
    
    openConfirmationModal(
      "Demander un retour",
      `Voulez-vous demander un retour détaillé pour votre candidature "${application?.jobOffer.title}" chez ${application?.company.name} ?\n\nUn email sera envoyé au recruteur pour obtenir des informations sur votre candidature.`,
      async () => {
        try {
          await requestFeedbackMutation.mutate(parseInt(applicationId));
          
          toast({
            title: "Demande de retour envoyée",
            description: `Votre demande de retour détaillé a été envoyée à ${application?.company.name} pour votre candidature "${application?.jobOffer.title}". Vous recevrez une réponse dans les plus brefs délais.`,
            variant: "default",
            duration: 4000,
          });
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Impossible d'envoyer la demande de retour. Veuillez réessayer.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      "info",
      "Envoyer la demande",
      "Annuler"
    );
  }, [applications, requestFeedbackMutation, toast, openConfirmationModal]);

  // Action pour archiver/désarchiver
  const toggleArchive = useCallback((applicationId: string) => {
    const application = applications.find(a => a.metadata.id === applicationId);
    const action = application?.metadata.isArchived ? "désarchiver" : "archiver";
    const actionPast = application?.metadata.isArchived ? "désarchivée" : "archivée";
    
    openConfirmationModal(
      application?.metadata.isArchived ? "Désarchiver la candidature" : "Archiver la candidature",
      `Êtes-vous sûr de vouloir ${action} votre candidature pour "${application?.jobOffer.title}" chez ${application?.company.name} ?\n\n${application?.metadata.isArchived ? "Elle redeviendra visible dans vos candidatures actives." : "Elle sera déplacée vers vos candidatures archivées."}`,
      async () => {
        try {
          await archiveApplicationMutation.mutate({
            jobId: parseInt(applicationId),
            isArchived: !application?.metadata.isArchived
          });
          
          // Rafraîchir les données après l'archivage
          if (refetchApplications) {
            refetchApplications();
          }
          
          toast({
            title: application?.metadata.isArchived ? "Candidature désarchivée" : "Candidature archivée",
            description: `Votre candidature pour "${application?.jobOffer.title}" chez ${application?.company.name} a été ${actionPast} avec succès.`,
            variant: "default",
            duration: 3000,
          });
        } catch (error) {
          toast({
            title: "Erreur",
            description: `Impossible de ${action} la candidature. Veuillez réessayer.`,
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      "default",
      application?.metadata.isArchived ? "Désarchiver" : "Archiver",
      "Annuler"
    );
  }, [applications, archiveApplicationMutation, toast, openConfirmationModal]);

  // Action pour voir les détails d'entretien
  const viewInterviewDetails = useCallback((applicationId: string) => {
    const application = applications.find(a => a.metadata.id === applicationId);
    if (application?.metadata.interviewDate) {
      toast({
        title: "Détails de l'entretien",
        description: `Entretien programmé le ${application.metadata.interviewDate} pour "${application.jobOffer.title}" chez ${application.company.name}. Préparez-vous bien et bonne chance !`,
        variant: "default",
        duration: 5000,
      });
    }
  }, [applications, toast]);

  // Actions exportées
  const actions: ApplicationActions = {
    withdrawApplication,
    requestFeedback,
    toggleArchive,
    viewInterviewDetails
  };

  return {
    actions,
    // État des mutations pour l'UI
    isLoading: {
      withdraw: withdrawApplicationMutation.loading,
      archive: archiveApplicationMutation.loading,
      feedback: requestFeedbackMutation.loading
    }
  };
}
