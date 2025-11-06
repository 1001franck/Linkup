import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './use-debounce';
import { CompanyFilters } from '@/types/company';

export interface CompaniesFiltersState {
  searchTerm: string;
  selectedIndustry: string;
  selectedCity: string;
}

export interface CompaniesFiltersActions {
  setSearchTerm: (term: string) => void;
  setSelectedIndustry: (industry: string) => void;
  setSelectedCity: (city: string) => void;
  clearAllFilters: () => void;
}

export function useCompaniesFilters() {
  // États des filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Debounce pour optimiser les performances
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedIndustry = useDebounce(selectedIndustry, 300);
  const debouncedCity = useDebounce(selectedCity, 300);

  // Actions des filtres
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedIndustry("");
    setSelectedCity("");
  }, []);

  // Filtres pour l'API
  const apiFilters = useMemo((): CompanyFilters => ({
    search: debouncedSearchTerm,
    industry: debouncedIndustry,
    city: debouncedCity
  }), [debouncedSearchTerm, debouncedIndustry, debouncedCity]);

  // État complet
  const state: CompaniesFiltersState = {
    searchTerm,
    selectedIndustry,
    selectedCity
  };

  // Actions
  const actions: CompaniesFiltersActions = {
    setSearchTerm,
    setSelectedIndustry,
    setSelectedCity,
    clearAllFilters
  };

  return {
    state,
    actions,
    apiFilters
  };
}
