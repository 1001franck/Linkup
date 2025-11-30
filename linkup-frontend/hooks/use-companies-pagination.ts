import { useState, useCallback, useMemo } from 'react';
import { useCompanies } from './use-api';
import { Company, ApiCompany } from '@/types/company';
import { transformApiCompanies, getTransformationStats } from '@/lib/company-transformer';

export interface CompaniesPaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface CompaniesPaginationActions {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export interface CompaniesPaginationResult {
  companies: Company[];
  loading: boolean;
  error: string | null;
  pagination: CompaniesPaginationState;
  actions: CompaniesPaginationActions;
  refetch: () => void;
}

export function useCompaniesPagination(
  initialItemsPerPage: number = 12,
  filters?: {
    search?: string;
    industry?: string;
    city?: string;
  }
): CompaniesPaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Transformation optimisée des données API
  const transformCompanies = useCallback((apiCompanies: ApiCompany[]): Company[] => {
    return transformApiCompanies(apiCompanies);
  }, []);

  // Récupérer les entreprises depuis l'API avec pagination et filtres
  const { data: apiCompanies, loading, error, refetch } = useCompanies({
    page: currentPage,
    limit: itemsPerPage,
    search: filters?.search,
    industry: filters?.industry,
    city: filters?.city
  });


  // Transformer les données avec optimisation et debugging
  const companies = useMemo(() => {
    const apiData = (apiCompanies as any)?.data;
    const companiesData = apiData?.data || apiData;
    if (!companiesData || !Array.isArray(companiesData)) {
      return [];
    }
    
    const transformed = transformCompanies(companiesData);
    
    // Debug des statistiques de transformation en développement
    if (process.env.NODE_ENV === 'development') {
      const stats = getTransformationStats(companiesData, transformed); // ✅ CORRECTION
      if (stats.failed > 0 || stats.invalid > 0) {
        // Log conditionnel - Next.js supprimera automatiquement en production
        if (typeof window !== 'undefined') {
          console.warn('📊 Statistiques de transformation des entreprises:', stats);
        }
      }
    }
    
    return transformed;
  }, [(apiCompanies as any)?.data, transformCompanies]); // ✅ CORRECTION

  // Calculer la pagination
  const pagination = useMemo((): CompaniesPaginationState => {
    const apiData = (apiCompanies as any)?.data;
    const totalItems = apiData?.pagination?.total || apiData?.total || 0; // ✅ CORRECTION
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages
    };
  }, [(apiCompanies as any)?.data, currentPage, itemsPerPage]);

  // Actions de pagination
  const actions: CompaniesPaginationActions = {
    setCurrentPage: useCallback((page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
    }, [pagination.totalPages]),

    setItemsPerPage: useCallback((items: number) => {
      setItemsPerPage(items);
      setCurrentPage(1); // Reset à la première page
    }, []),

    nextPage: useCallback(() => {
      if (currentPage < pagination.totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }, [currentPage, pagination.totalPages]),

    prevPage: useCallback(() => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }, [currentPage]),

    goToPage: useCallback((page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
    }, [pagination.totalPages])
  };

  return {
    companies,
    loading,
    error,
    pagination,
    actions,
    refetch
  };
}
