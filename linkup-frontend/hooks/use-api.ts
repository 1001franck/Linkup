/**
 * Hooks personnalisés pour l'API
 * Gestion des états de chargement, erreurs et données
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient, ApiResponse } from '@/lib/api-client';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';
import logger from '@/lib/logger';

// Hook générique pour les requêtes API
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  autoFetch: boolean = true,
  enabled: boolean = true
) {
  // S'assurer que dependencies est toujours un tableau
  const deps = Array.isArray(dependencies) ? dependencies : [];
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        setData(response.data || null);
      } else {
        const errorMsg = response.error || 'Une erreur est survenue';
        setError(errorMsg);
        
        // Ne pas afficher de toast pour les erreurs d'authentification
        if (!errorMsg.includes('Token manquant') && !errorMsg.includes('401')) {
          toast({
            title: 'Erreur',
            description: errorMsg,
            variant: 'destructive',
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      // Ne pas afficher de toast pour les erreurs d'authentification
      if (!errorMessage.includes('Token manquant') && !errorMessage.includes('401')) {
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (autoFetch && enabled) {
      fetchData();
    }
  }, [fetchData, autoFetch, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook pour les mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    showToast?: boolean;
  }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const mutate = useCallback(async (params: P) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutationFn(params);
      
      if (response.success) {
        if (options?.onSuccess) {
          options.onSuccess(response.data!);
        }
        if (options?.showToast !== false) {
          toast({
            title: 'Succès',
            description: response.message || 'Opération réussie',
            variant: 'default',
          });
        }
        return response.data;
      } else {
        const errorMessage = response.error || 'Une erreur est survenue';
        setError(errorMessage);
        if (options?.onError) {
          options.onError(errorMessage);
        }
        if (options?.showToast !== false) {
          toast({
            title: 'Erreur',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      if (options?.onError) {
        options.onError(errorMessage);
      }
      if (options?.showToast !== false) {
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options, toast]);

  return {
    mutate,
    loading,
    error,
  };
}

// Note: useAuth est maintenant géré par AuthContext.tsx
// Ce hook a été supprimé pour éviter la duplication

// Hook pour les emplois
export function useJobs(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  industry?: string;
  contract_type?: string;
  company?: string;
  minSalary?: string;
  experience?: string;
  workMode?: string;
  education?: string;
  enabled?: boolean;
}) {
  // Mémoriser les filtres pour éviter les re-renders inutiles
  const memoizedFilters = useMemo(() => filters, [
    filters?.page, 
    filters?.limit, 
    filters?.search, 
    filters?.location, 
    filters?.industry, 
    filters?.contract_type,
    filters?.company,
    filters?.minSalary,
    filters?.experience,
    filters?.workMode,
    filters?.education,
    filters?.enabled
  ]);

  return useApi(
    () => apiClient.getJobs(memoizedFilters),
    [memoizedFilters],
    true,
    filters?.enabled !== false // enabled par défaut à true
  );
}

// Hook pour un job spécifique
export function useJob(jobId: number | null) {
  return useApi(
    () => jobId ? apiClient.getJob(jobId) : Promise.resolve({ success: false, error: 'ID manquant' }),
    [jobId],
    !!jobId
  );
}

// Hooks pour les emplois supprimés car inutilisés :
// - useCreateJob (fonctionnalité non implémentée)
// - useUpdateJob (fonctionnalité non implémentée)  
// - useDeleteJob (fonctionnalité non implémentée)

// Hook pour les candidatures
export function useMyApplications(options?: { enabled?: boolean }) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getMyApplications(),
    [],
    isAuthenticated && (options?.enabled !== false),
    isAuthenticated && (options?.enabled !== false)
  );
}

export function useCompanyApplications(companyId: number, filters?: { status?: string; jobId?: number }, options?: { enabled?: boolean }) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyApplications(companyId, filters),
    [`company-applications-${companyId}`, JSON.stringify(filters || {})],
    isAuthenticated && !!companyId && (options?.enabled !== false),
    isAuthenticated && !!companyId && (options?.enabled !== false)
  );
}

export function useApplyToJob() {
  return useMutation(
    (jobId: number) => apiClient.applyToJob(jobId),
    {
      showToast: true,
    }
  );
}

export function useUpdateApplicationStatus() {
  return useMutation(
    ({ jobId, status, additionalData }: { jobId: number; status: string; additionalData?: any }) => 
      apiClient.updateApplicationStatus(jobId, status, additionalData),
    {
      showToast: true,
    }
  );
}

export function useUpdateApplicationStatusByCompany() {
  return useMutation(
    ({ jobId, status, additionalData }: { jobId: number; status: string; additionalData?: any }) => 
      apiClient.updateApplicationStatusByCompany(jobId, status, additionalData),
    {
      showToast: true,
    }
  );
}

// Nouveaux hooks pour les actions my-applications
export function useWithdrawApplication() {
  return useMutation(
    (jobId: number) => apiClient.withdrawApplication(jobId),
    {
      showToast: true,
    }
  );
}

export function useArchiveApplication() {
  return useMutation(
    ({ jobId, isArchived }: { jobId: number; isArchived: boolean }) => 
      apiClient.archiveApplication(jobId, isArchived),
    {
      showToast: true,
    }
  );
}

export function useRequestApplicationFeedback() {
  return useMutation(
    (jobId: number) => apiClient.requestApplicationFeedback(jobId),
    {
      showToast: true,
    }
  );
}

export function useToggleApplicationBookmark() {
  return useMutation(
    ({ jobId, isBookmarked }: { jobId: number; isBookmarked: boolean }) => 
      apiClient.toggleApplicationBookmark(jobId, isBookmarked),
    {
      showToast: true,
    }
  );
}

// Hooks pour la gestion des documents
export function useApplicationDocuments(jobId: number | null) {
  return useApi(
    () => jobId ? apiClient.getApplicationDocuments(jobId) : Promise.resolve({ success: false, error: 'ID manquant' }),
    [jobId],
    !!jobId
  );
}

export function useAddApplicationDocument() {
  return useMutation(
    ({ jobId, documentType, fileName, fileUrl }: { 
      jobId: number; 
      documentType: string; 
      fileName: string; 
      fileUrl: string; 
    }) => apiClient.addApplicationDocument(jobId, documentType, fileName, fileUrl),
    {
      showToast: true,
    }
  );
}

export function useDeleteApplicationDocument() {
  return useMutation(
    (documentId: number) => apiClient.deleteApplicationDocument(documentId),
    {
      showToast: true,
    }
  );
}

// useUpdateApplicationStatus supprimé - doublon (voir ligne 461)

// Hook pour les entreprises
/**
 * Hook pour récupérer les entreprises avec filtres et pagination
 * 
 * AMÉLIORATION : Support complet des filtres industry et city
 * 
 * @param filters - Filtres de recherche et pagination
 * @param filters.page - Numéro de page
 * @param filters.limit - Nombre d'éléments par page
 * @param filters.search - Recherche textuelle
 * @param filters.industry - Filtre par secteur d'activité ✅ NOUVEAU
 * @param filters.city - Filtre par ville ✅ NOUVEAU
 * @returns Hook avec data, loading, error, refetch
 */
export function useCompanies(filters?: {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;  // ✅ NOUVEAU : Filtre par secteur
  city?: string;      // ✅ NOUVEAU : Filtre par ville
}) {
  return useApi(
    () => apiClient.getCompanies(filters),
    [
      filters?.page, 
      filters?.limit, 
      filters?.search, 
      filters?.industry,  // ✅ NOUVEAU : Dépendance ajoutée
      filters?.city       // ✅ NOUVEAU : Dépendance ajoutée
    ]
  );
}

export function useCompany(id: number) {
  return useApi(
    () => apiClient.getCompany(id),
    [id],
    !!id
  );
}

export function useTopCompanies(limit: number = 3) {
  return useApi(
    () => apiClient.getTopCompanies(limit),
    [limit],
    true
  );
}

// Hook pour les messages
export function useConversations() {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getConversations(),
    [],
    isAuthenticated // Ne faire l'appel que si l'utilisateur est authentifié
  );
}

export function useMessagesWithUser(userId: number) {
  return useApi(
    () => apiClient.getMessagesWithUser(userId),
    [userId],
    !!userId
  );
}

export function useSendMessage() {
  return useMutation(
    (messageData: { id_receiver: number; content: string }) => 
      apiClient.sendMessage(messageData),
    {
      showToast: false, // Pas de toast pour les messages
    }
  );
}

// Hook pour créer une offre d'emploi
export function useCreateJob() {
  return useMutation(
    (jobData: {
      title: string;
      description: string;
      location?: string;
      contract_type?: string;
      salary_min?: number;
      salary_max?: number;
      remote?: boolean;
      experience?: string;
      industry?: string;
      contract_duration?: string;
      working_time?: string;
      formation_required?: string;
      requirements?: string[];
      benefits?: string[];
      urgency?: string;
      education?: string;
      id_company?: number;
    }) => apiClient.createJob(jobData),
    {
      onSuccess: () => {
        // Rafraîchir automatiquement les statistiques après création
        // Note: Les hooks se rafraîchiront automatiquement au prochain rendu
        logger.debug('Offre créée avec succès, les statistiques seront mises à jour');
      }
    }
  );
}

// Hook pour mettre à jour une offre d'emploi
export function useUpdateJob() {
  return useMutation(
    (params: { jobId: number; jobData: Partial<{
      title: string;
      description: string;
      location: string;
      contract_type: string;
      salary_min: number;
      salary_max: number;
      remote: boolean;
      experience: string;
      industry: string;
      contract_duration: string;
      working_time: string;
      formation_required: string;
    }> }) => apiClient.updateJob(params.jobId, params.jobData)
  );
}

// Hook pour supprimer une offre d'emploi
export function useDeleteJob() {
  return useMutation(
    (jobId: number) => apiClient.deleteJob(jobId)
  );
}

// Hook pour les emplois sauvegardés
export function useSavedJobs(options?: { enabled?: boolean }) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getSavedJobs(),
    [],
    isAuthenticated && (options?.enabled !== false),
    isAuthenticated && (options?.enabled !== false)
  );
}

export function useSaveJob() {
  return useMutation(
    (jobId: number) => apiClient.saveJob(jobId),
    {
      showToast: true,
    }
  );
}

export function useUnsaveJob() {
  return useMutation(
    (jobId: number) => apiClient.unsaveJob(jobId),
    {
      showToast: true,
    }
  );
}

// Hook pour les fichiers utilisateur
export function useMyFiles() {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getMyFiles(),
    [],
    isAuthenticated // Ne faire l'appel que si l'utilisateur est authentifié
  );
}

// Hook pour les statistiques globales
export function useGlobalStats() {
  return useApi(
    () => apiClient.publicRequest('/stats/global'),
    []
  );
}

// Hook pour les statistiques de résumé
export function useStatsSummary() {
  return useApi(
    () => apiClient.publicRequest('/stats/summary'),
    []
  );
}

// Hook pour les tendances de l'utilisateur connecté
export function useUserTrends(options?: { enabled?: boolean }) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.publicRequest('/users/me/stats/trends'),
    [],
    isAuthenticated && (options?.enabled !== false),
    isAuthenticated && (options?.enabled !== false)
  );
}

// Hook pour les statistiques détaillées de l'utilisateur connecté
export function useUserDetailedStats() {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.publicRequest('/users/me/stats/detailed'),
    [],
    isAuthenticated
  );
}


export function useUploadFile() {
  return useMutation(
    ({ file, fileType }: { file: File; fileType: 'pdf' | 'photo' }) => 
      apiClient.uploadFile(file, fileType),
    {
      showToast: true,
    }
  );
}

// MODIFICATION FRONTEND: Hook pour mettre à jour le profil utilisateur
export function useUpdateUser() {
  return useMutation(
    (userData: {
      firstname?: string;
      lastname?: string;
      phone?: string;
      bio_pro?: string;      // ← NOUVEAU: Bio professionnelle
      website?: string;      // ← NOUVEAU: Site web personnel
      city?: string;         // ← NOUVEAU: Ville
      country?: string;      // ← NOUVEAU: Pays
      description?: string;
      skills?: string[];
      job_title?: string;
      experience_level?: string;
      availability?: boolean;
      portfolio_link?: string;
      linkedin_link?: string;
    }) => apiClient.updateUser(userData),
    {
      showToast: true,
    }
  );
}

// MODIFICATION FRONTEND: Hook pour récupérer les offres avec scores de matching
export function useMatchingJobs(options?: {
  limit?: number;
  minScore?: number;
  industry?: string;
  location?: string;
  enabled?: boolean;
}) {
  // Construire l'URL avec les query params
  const buildUrl = () => {
    const queryParams = new URLSearchParams();
    if (options?.limit) queryParams.append('limit', options.limit.toString());
    if (options?.minScore) queryParams.append('minScore', options.minScore.toString());
    if (options?.industry) queryParams.append('industry', options.industry);
    if (options?.location) queryParams.append('location', options.location);
    const queryString = queryParams.toString();
    return `/matching/jobs${queryString ? `?${queryString}` : ''}`;
  };

  return useApi(
    () => apiClient.publicRequest(buildUrl(), {
      method: 'GET',
    }),
    [options?.limit, options?.minScore, options?.industry, options?.location, options?.enabled],
    true,
    options?.enabled !== false
  );
}

// MODIFICATION FRONTEND: Hook pour calculer le score de matching d'une offre spécifique
// Hook useJobMatchingScore supprimé car inutilisé

// MODIFICATION FRONTEND: Hook pour récupérer les insights de matching
export function useMatchingInsights(userId?: number) {
  return useApi(
    () => apiClient.publicRequest(`/matching/insights/${userId}`, {
      method: 'GET'
    }),
    [userId],
    !!userId
  );
}

export function useDeleteFile() {
  return useMutation(
    (fileId: number) => apiClient.deleteFile(fileId),
    {
      showToast: true,
    }
  );
}

// MODIFICATION FRONTEND: Hook pour supprimer la photo de profil
export function useDeleteProfilePicture() {
  return useMutation(
    () => apiClient.deleteProfilePicture(),
    {
      showToast: true,
    }
  );
}

// Hook pour récupérer la photo de profil de l'utilisateur connecté
export function useProfilePicture() {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.publicRequest('/user-files/profile-picture'),
    [],
    isAuthenticated
  );
}

// ===== HOOKS POUR LES STATISTIQUES ENTREPRISE =====

/**
 * Hook pour récupérer les statistiques complètes du dashboard entreprise
 */
export function useCompanyDashboardStats(options: { enabled?: boolean; refreshKey?: string | null } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyDashboardStats(),
    ['company-dashboard-stats', options.refreshKey], // Inclure refreshKey dans les dépendances
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer les statistiques des offres d'emploi de l'entreprise
 */
export function useCompanyJobsStats(options: { enabled?: boolean } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyJobsStats(),
    [],
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer les statistiques des candidatures de l'entreprise
 */
export function useCompanyApplicationsStats(options: { enabled?: boolean } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyApplicationsStats(),
    [],
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer les statistiques des entretiens de l'entreprise
 */
export function useCompanyInterviewsStats(options: { enabled?: boolean } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyInterviewsStats(),
    [],
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer les statistiques des embauches de l'entreprise
 */
export function useCompanyHiredStats(options: { enabled?: boolean } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyHiredStats(),
    [],
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer les candidatures récentes de l'entreprise
 */
export function useCompanyRecentApplications(options: { enabled?: boolean; refreshKey?: string | null } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyRecentApplications(),
    ['company-recent-applications', options.refreshKey], // Inclure refreshKey dans les dépendances
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer les offres actives de l'entreprise
 */
export function useCompanyActiveJobs(options: { enabled?: boolean; refreshKey?: string | null } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyActiveJobs(),
    ['company-active-jobs', options.refreshKey], // Inclure refreshKey dans les dépendances
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer les entretiens à venir de l'entreprise
 */
export function useCompanyUpcomingInterviews(options: { enabled?: boolean; refreshKey?: string | null } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyUpcomingInterviews(),
    ['company-upcoming-interviews', options.refreshKey], // Inclure refreshKey dans les dépendances
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer toutes les offres d'emploi de l'entreprise (pour le dashboard - limité)
 */
export function useCompanyAllJobs(options: { enabled?: boolean } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyAllJobs(),
    ['company-all-jobs'], // Clé de cache pour invalidation
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

/**
 * Hook pour récupérer toutes les offres d'emploi de l'entreprise pour la page de gestion
 */
export function useCompanyAllJobsManagement(options: { enabled?: boolean } = {}) {
  const { isAuthenticated } = useAuth();
  return useApi(
    () => apiClient.getCompanyAllJobsManagement(),
    ['company-all-jobs-management'], // Clé de cache pour invalidation
    isAuthenticated && (options.enabled !== false),
    isAuthenticated && (options.enabled !== false)
  );
}

