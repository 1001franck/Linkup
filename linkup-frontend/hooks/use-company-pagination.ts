/**
 * Hook personnalisé pour la pagination des entreprises
 * Respect des principes SOLID, KISS et DRY
 */

import { useState, useEffect } from "react";
import { Company } from "@/types/company";

interface UseCompanyPaginationProps {
  companies: Company[];
  itemsPerPage?: number;
}

interface UseCompanyPaginationReturn {
  currentPage: number;
  totalPages: number;
  currentItems: Company[];
  goToPage: (page: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  resetPagination: () => void;
}

/**
 * Hook pour gérer la pagination des entreprises
 * Single Responsibility: Gestion uniquement de la pagination
 * Open/Closed: Extensible via paramètres
 */
export function useCompanyPagination({
  companies,
  itemsPerPage = 4
}: UseCompanyPaginationProps): UseCompanyPaginationReturn {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = companies.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetPagination = () => {
    setCurrentPage(0);
  };

  // Réinitialiser la pagination quand la liste change
  useEffect(() => {
    resetPagination();
  }, [companies.length]);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    goToNext,
    goToPrevious,
    resetPagination
  };
}
