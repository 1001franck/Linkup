/**
 * Hook personnalisé pour les interactions avec les emplois
 * Gère les favoris, sauvegardes, partage et suivi d'entreprises
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedJobs, useSaveJob, useUnsaveJob, useApplyToJob, useMyApplications } from './use-api';
import logger from '@/lib/logger';

export interface JobInteractionsState {
  savedJobs: Set<number>;
  appliedJobs: Set<number>;
  withdrawnJobs: Set<number>;
  savedJobsLoading: boolean;
}

export interface JobInteractionsActions {
  toggleBookmark: (jobId: number) => void;
  applyToJob: (jobId: number) => void;
  shareJob: (job: any) => Promise<void>;
  isSaved: (jobId: number) => boolean;
  isApplied: (jobId: number) => boolean;
  isWithdrawn: (jobId: number) => boolean;
  canApply: (jobId: number) => boolean;
  updateApplicationStatus: (jobId: number, status: 'applied' | 'withdrawn') => void;
  refreshData: () => void;
}

export function useJobsInteractions() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Hooks backend pour les sauvegardes et candidatures
  const { data: savedJobsData, loading: savedJobsLoading, refetch: refetchSavedJobs } = useSavedJobs();
  const { data: applicationsData, loading: applicationsLoading, refetch: refetchApplications } = useMyApplications();
  const saveJobMutation = useSaveJob();
  const unsaveJobMutation = useUnsaveJob();
  const applyToJobMutation = useApplyToJob();
  
  // États des interactions
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [withdrawnJobs, setWithdrawnJobs] = useState<Set<number>>(new Set());

  // Charger les données depuis le backend
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Charger les sauvegardes depuis le backend
      // savedJobsData peut être un objet avec une propriété data ou directement un tableau
      const savedJobsDataTyped = savedJobsData as any;
      const savedJobs = savedJobsDataTyped?.data || savedJobsDataTyped;
      if (savedJobs && Array.isArray(savedJobs)) {
        const savedJobIds = savedJobs.map((savedJob: any) => 
          savedJob.job_offer?.id_job_offer || savedJob.id_job_offer
        ).filter(Boolean);
        setSavedJobs(new Set(savedJobIds));
        
      }
      
      // Charger les candidatures depuis le backend
      // applicationsData peut être un objet avec une propriété data ou directement un tableau
      const applicationsDataTyped = applicationsData as any;
      const applications = applicationsDataTyped?.data || applicationsDataTyped;
      if (applications && Array.isArray(applications)) {
        const appliedJobIds: number[] = [];
        const withdrawnJobIds: number[] = [];
        
        applications.forEach((application: any) => {
          const jobId = application.job_offer?.id_job_offer || application.id_job_offer;
          if (jobId) {
            if (application.status === 'withdrawn') {
              withdrawnJobIds.push(jobId);
            } else {
              appliedJobIds.push(jobId);
            }
          }
        });
        
        setAppliedJobs(new Set(appliedJobIds));
        setWithdrawnJobs(new Set(withdrawnJobIds));
        
      }
    } catch (error) {
      logger.error('Erreur lors du chargement des données:', error);
    }
  }, [savedJobsData, applicationsData]);

  // Nettoyer localStorage au démarrage pour éviter les conflits
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Supprimer les anciennes données localStorage
      localStorage.removeItem('appliedJobs');
      localStorage.removeItem('savedJobs');
      
      // Vérifier si l'utilisateur est connecté avant de rafraîchir
      const token = document.cookie.includes('linkup_token=');
      if (token) {
        // Forcer le rafraîchissement des données depuis le backend
        if (refetchSavedJobs) {
          refetchSavedJobs();
        }
        if (refetchApplications) {
          refetchApplications();
        }
      }
    }
  }, [refetchSavedJobs, refetchApplications]);

  // Fonction pour forcer le rafraîchissement des données
  const refreshData = useCallback(() => {
    // Vérifier si l'utilisateur est connecté avant de rafraîchir
    const token = document.cookie.includes('linkup_token=');
    if (token) {
      if (refetchSavedJobs) {
        refetchSavedJobs();
      }
      if (refetchApplications) {
        refetchApplications();
      }
    }
  }, [refetchSavedJobs, refetchApplications]);

  // Toggle sauvegarde avec backend
  const toggleBookmark = useCallback(async (jobId: number) => {
    // Vérifier l'authentification avant de sauvegarder
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour sauvegarder des offres",
        variant: "default"
      });
      // Utiliser usePathname serait mieux mais nécessiterait un hook, on utilise router.asPath ou on passe le path en param
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/jobs';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    try {
      if (savedJobs.has(jobId)) {
        // Supprimer la sauvegarde
        await unsaveJobMutation.mutate(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast({
          title: "Sauvegarde supprimée",
          description: "Cette offre a été retirée de vos sauvegardes",
          variant: "default"
        });
      } else {
        // Ajouter la sauvegarde
        await saveJobMutation.mutate(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.add(jobId);
          return newSet;
        });
        toast({
          title: "Offre sauvegardée",
          description: "Cette offre a été sauvegardée pour plus tard",
          variant: "default"
        });
      }
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder cette offre",
        variant: "destructive"
      });
    }
  }, [savedJobs, saveJobMutation, unsaveJobMutation, toast, isAuthenticated, authLoading, router]);

  // Postuler à un emploi avec le backend
  const applyToJob = useCallback(async (jobId: number) => {
    // Vérifier l'authentification avant de postuler
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour postuler à une offre",
        variant: "default"
      });
      // Utiliser usePathname serait mieux mais nécessiterait un hook, on utilise router.asPath ou on passe le path en param
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/jobs';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    try {
      if (appliedJobs.has(jobId) || withdrawnJobs.has(jobId)) {
        // Déjà candidaté ou retiré - ne rien faire
        return;
      }

      // Appeler l'API backend pour créer la candidature
      await applyToJobMutation.mutate(jobId);
      
      // Mettre à jour l'état local
      const newAppliedJobs = new Set(appliedJobs);
      newAppliedJobs.add(jobId);
      setAppliedJobs(newAppliedJobs);
      
      // Toast de succès simple
      toast({
        title: "Candidature envoyée !",
        description: "Votre candidature a été transmise avec succès.",
        variant: "default"
      });
    } catch (error: any) {
      logger.error('Erreur lors de la candidature:', error);
      
      // Toast d'erreur simple
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre candidature. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [appliedJobs, withdrawnJobs, applyToJobMutation, toast, isAuthenticated, authLoading, router]);

  // Partager un emploi
  const shareJob = useCallback(async (job: any) => {
    const shareData = {
      title: `${job.title} chez ${job.company}`,
      text: `Découvrez cette offre d'emploi : ${job.title} chez ${job.company} - ${job.location}`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "Offre partagée",
          description: "L'offre a été partagée avec succès",
          variant: "default"
        });
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast({
          title: "Lien copié",
          description: "Le lien de l'offre a été copié dans le presse-papiers",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de partager cette offre",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Vérificateurs d'état
  const isSaved = useCallback((jobId: number) => savedJobs.has(jobId), [savedJobs]);
  const isApplied = useCallback((jobId: number) => appliedJobs.has(jobId), [appliedJobs]);
  const isWithdrawn = useCallback((jobId: number) => withdrawnJobs.has(jobId), [withdrawnJobs]);
  const canApply = useCallback((jobId: number) => !appliedJobs.has(jobId) && !withdrawnJobs.has(jobId), [appliedJobs, withdrawnJobs]);
  
  // Fonction pour mettre à jour le statut d'une candidature
  const updateApplicationStatus = useCallback((jobId: number, status: 'applied' | 'withdrawn') => {
    if (status === 'applied') {
      // Retirer de withdrawnJobs et ajouter à appliedJobs
      setWithdrawnJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      setAppliedJobs(prev => {
        const newSet = new Set(prev);
        newSet.add(jobId);
        return newSet;
      });
    } else if (status === 'withdrawn') {
      // Retirer de appliedJobs et ajouter à withdrawnJobs
      setAppliedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      setWithdrawnJobs(prev => {
        const newSet = new Set(prev);
        newSet.add(jobId);
        return newSet;
      });
    }
  }, []);

  // État complet
  const state: JobInteractionsState = {
    savedJobs,
    appliedJobs,
    withdrawnJobs,
    savedJobsLoading: savedJobsLoading || applicationsLoading || saveJobMutation.loading || unsaveJobMutation.loading || applyToJobMutation.loading
  };

  // Actions
  const actions: JobInteractionsActions = {
    toggleBookmark,
    applyToJob,
    shareJob,
    isSaved,
    isApplied,
    isWithdrawn,
    canApply,
    updateApplicationStatus,
    refreshData
  };

  return {
    state,
    actions
  };
}
