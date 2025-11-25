/**
 * Hook personnalisé pour la pagination des emplois
 * Gère la pagination côté client avec le backend existant
 */

import { useState, useMemo, useCallback } from 'react';
import { useJobs } from './use-api';

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  hasMore: boolean;
  hasPrevious: boolean;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setItemsPerPage: (count: number) => void;
  resetPagination: () => void;
}

export interface UseJobsPaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
  filters?: {
    search?: string;
    location?: string;
    contract_type?: string;
  };
}

export function useJobsPagination(options: UseJobsPaginationOptions = {}) {
  const {
    initialPage = 1,
    initialItemsPerPage = 10,
    filters = {}
  } = options;

  // États de pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Récupération des données avec pagination
  const { data, loading, error, refetch } = useJobs({
    ...filters,
    page: currentPage,
    limit: itemsPerPage
  });


  // Calcul des métadonnées de pagination
  const paginationState = useMemo((): PaginationState => {
    const totalItems = data?.data?.total || data?.total || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasMore = currentPage < totalPages;
    const hasPrevious = currentPage > 1;

    return {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems,
      hasMore,
      hasPrevious
    };
  }, [data?.data?.total, data?.total, currentPage, itemsPerPage]);

  // Actions de pagination
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= paginationState.totalPages) {
      setCurrentPage(page);
    }
  }, [paginationState.totalPages]);

  const goToNextPage = useCallback(() => {
    if (paginationState.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationState.hasMore]);

  const goToPreviousPage = useCallback(() => {
    if (paginationState.hasPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationState.hasPrevious]);

  const setItemsPerPageAndReset = useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset à la première page
  }, []);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setItemsPerPage(initialItemsPerPage);
  }, [initialItemsPerPage]);

  // Actions
  const actions: PaginationActions = {
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setItemsPerPage: setItemsPerPageAndReset,
    resetPagination
  };

  // Récupération des jobs avec support de la structure imbriquée
  const jobs = data?.data?.items || data?.items || [];

  return {
    // Données
    jobs,
    loading,
    error,
    refetch,
    
    // Pagination
    pagination: paginationState,
    actions
  };
}
