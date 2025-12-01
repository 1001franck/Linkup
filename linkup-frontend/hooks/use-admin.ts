/**
 * Hook Admin - LinkUp
 * Gestion centralisée des fonctionnalités admin
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des opérations admin
 * - Open/Closed : Extensible pour nouvelles fonctionnalités
 * - Interface Segregation : Hooks spécifiques et optionnels
 */

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import logger from '@/lib/logger';

// ========================================
// TYPES ADMIN
// ========================================

export interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  newUsers24h: number;
  newCompanies24h: number;
  newJobs24h: number;
  newApplications24h: number;
  recentActivity: any[];
  generatedAt: string;
}

export interface AdminUser {
  id: number;
  id_user?: number; // Alias pour compatibilité
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  phone?: string;
  created_at: string;
  last_login?: string;
}

export interface AdminCompany {
  id: number;
  name: string;
  description: string;
  website?: string;
  created_at: string;
  recruiter_mail: string;
  recruiter_phone?: string;
}

export interface AdminJob {
  id: number;
  id_job_offer?: number; // Alias pour compatibilité
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  contract_type: string;
  created_at: string;
  status: string;
}

export interface AdminApplication {
  id: string;
  id_user?: number; // Alias pour compatibilité
  id_job_offer?: number; // Alias pour compatibilité
  user_name: string;
  job_title: string;
  company_name: string;
  status: string;
  application_date: string;
  match_percentage?: number;
}

// ========================================
// HOOK STATISTIQUES ADMIN
// ========================================

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getAdminStats();
      
      if (response.success) {
        const responseData = response.data as any;
        setStats(responseData?.data || responseData);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des statistiques');
      }
    } catch (error) {
      logger.error('❌ useAdminStats - Erreur chargement stats admin:', error);
      // Ne pas exposer le message d'erreur exact à l'utilisateur
      const errorMessage = 'Erreur lors du chargement des statistiques';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: loadStats
  };
}

// ========================================
// HOOK ACTIVITÉ ADMIN
// ========================================

export function useAdminActivity() {
  const [activity, setActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getAdminActivity();
      if (response.success) {
        const responseData = response.data as any;
        setActivity(responseData || []);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement de l\'activité');
      }
    } catch (error) {
      logger.error('Erreur chargement activité admin:', error);
      const errorMessage = 'Erreur lors du chargement de l\'activité';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return {
    activity,
    isLoading,
    error,
    refetch: loadActivity
  };
}

// ========================================
// HOOK GESTION UTILISATEURS
// ========================================

export function useAdminUsers(params?: { page?: number; limit?: number; search?: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getAdminUsers(params);
      
      if (response.success) {
        const responseData = response.data as any;
        setUsers(responseData?.data?.data || responseData?.data || []);
        setTotal(responseData?.data?.pagination?.total || responseData?.pagination?.total || 0);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des utilisateurs');
      }
    } catch (error) {
      logger.error('Erreur chargement utilisateurs admin:', error);
      const errorMessage = 'Erreur lors du chargement des utilisateurs';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Partial<AdminUser>) => {
    try {
      const response = await apiClient.createAdminUser(userData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès",
          variant: "default",
        });
        loadUsers(); // Recharger la liste
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la création');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUser = async (userId: number, userData: Partial<AdminUser>) => {
    try {
      const response = await apiClient.updateAdminUser(userId, userData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès",
          variant: "default",
        });
        loadUsers(); // Recharger la liste
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await apiClient.deleteAdminUser(userId);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
          variant: "default",
        });
        loadUsers(); // Recharger la liste
        return true;
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const changePassword = async (userId: number, newPassword: string) => {
    try {
      const response = await apiClient.changeUserPassword(userId, newPassword);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Mot de passe modifié avec succès",
          variant: "default",
        });
        return true;
      } else {
        throw new Error(response.error || 'Erreur lors du changement de mot de passe');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadUsers();
  }, [params?.page, params?.limit, params?.search]);

  return {
    users,
    total,
    isLoading,
    error,
    refetch: loadUsers,
    createUser,
    updateUser,
    deleteUser,
    changePassword
  };
}

// ========================================
// HOOK GESTION ENTREPRISES
// ========================================

export function useAdminCompanies(params?: { page?: number; limit?: number; search?: string }) {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getAdminCompanies(params);
      
      if (response.success) {
        const responseData = response.data as any;
        setCompanies(responseData?.data?.data || responseData?.data || []);
        setTotal(responseData?.data?.pagination?.total || responseData?.pagination?.total || 0);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des entreprises');
      }
    } catch (error) {
      logger.error('Erreur chargement entreprises admin:', error);
      const errorMessage = 'Erreur lors du chargement des entreprises';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCompany = async (companyData: Partial<AdminCompany>) => {
    try {
      const response = await apiClient.createAdminCompany(companyData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Entreprise créée avec succès",
          variant: "default",
        });
        loadCompanies(); // Recharger la liste
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la création');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCompany = async (companyId: number, companyData: Partial<AdminCompany>) => {
    try {
      const response = await apiClient.updateAdminCompany(companyId, companyData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Entreprise mise à jour avec succès",
          variant: "default",
        });
        loadCompanies(); // Recharger la liste
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCompany = async (companyId: number) => {
    try {
      const response = await apiClient.deleteAdminCompany(companyId);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Entreprise supprimée avec succès",
          variant: "default",
        });
        loadCompanies(); // Recharger la liste
        return true;
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [params?.page, params?.limit, params?.search]);

  return {
    companies,
    total,
    isLoading,
    error,
    refetch: loadCompanies,
    createCompany,
    updateCompany,
    deleteCompany
  };
}

// ========================================
// HOOK GESTION OFFRES D'EMPLOI
// ========================================

export function useAdminJobs(params?: { page?: number; limit?: number; search?: string }) {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getAdminJobs(params);
      
      if (response.success) {
        const responseData = response.data as any;
        setJobs(responseData?.data?.items || responseData?.items || []);
        setTotal(responseData?.data?.total || responseData?.total || 0);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des offres');
      }
    } catch (error) {
      logger.error('Erreur chargement offres admin:', error);
      const errorMessage = 'Erreur lors du chargement des offres';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createJob = async (jobData: Partial<AdminJob>) => {
    try {
      const response = await apiClient.createAdminJob(jobData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Offre d'emploi créée avec succès",
          variant: "default",
        });
        loadJobs(); // Recharger la liste
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la création');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateJob = async (jobId: number, jobData: Partial<AdminJob>) => {
    try {
      const response = await apiClient.updateAdminJob(jobId, jobData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Offre d'emploi mise à jour avec succès",
          variant: "default",
        });
        loadJobs(); // Recharger la liste
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteJob = async (jobId: number) => {
    try {
      const response = await apiClient.deleteAdminJob(jobId);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Offre d'emploi supprimée avec succès",
          variant: "default",
        });
        loadJobs(); // Recharger la liste
        return true;
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadJobs();
  }, [params?.page, params?.limit, params?.search]);

  return {
    jobs,
    total,
    isLoading,
    error,
    refetch: loadJobs,
    createJob,
    updateJob,
    deleteJob
  };
}

// ========================================
// HOOK GESTION CANDIDATURES
// ========================================

export function useAdminApplications(params?: { page?: number; limit?: number; search?: string }) {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.getAdminApplications(params);
      
      if (response.success) {
        const responseData = response.data as any;
        setApplications(responseData?.data?.data || responseData?.data || []);
        setTotal(responseData?.data?.pagination?.total || responseData?.pagination?.total || 0);
      } else {
        logger.error('❌ useAdminApplications - Erreur dans la réponse:', response.error);
        throw new Error('Erreur lors du chargement des candidatures');
      }
    } catch (error) {
      logger.error('❌ useAdminApplications - Erreur chargement candidatures admin:', error);
      const errorMessage = 'Erreur lors du chargement des candidatures';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplication = async (applicationId: string, applicationData: Partial<AdminApplication>) => {
    try {
      const response = await apiClient.updateAdminApplication(applicationId, applicationData);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Candidature mise à jour avec succès",
          variant: "default",
        });
        loadApplications(); // Recharger la liste
        return response.data;
      } else {
        throw new Error(response.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      const response = await apiClient.deleteAdminApplication(applicationId);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Candidature supprimée avec succès",
          variant: "default",
        });
        loadApplications(); // Recharger la liste
        return true;
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadApplications();
  }, [params?.page, params?.limit, params?.search]);

  return {
    applications,
    total,
    isLoading,
    error,
    refetch: loadApplications,
    updateApplication,
    deleteApplication
  };
}
