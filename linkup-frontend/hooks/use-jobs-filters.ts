/**
 * Hook personnalisé pour la gestion des filtres d'emplois
 * Centralise toute la logique de filtrage et de recherche
 */

import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from './use-debounce';

export interface JobsFilters {
  search: string;
  location: string;
  contractType: string;
  company: string | null;
}

export interface JobsFiltersState {
  searchTerm: string;
  selectedLocation: string;
  selectedType: string;
  companyFilter: string | null;
  companyName: string | null;
  showAdvancedFilters: boolean;
  minSalary: string;
  experience: string;
  industry: string;
  workMode: string;
  education: string;
}

export interface JobsFiltersActions {
  setSearchTerm: (term: string) => void;
  setSelectedLocation: (location: string) => void;
  setSelectedType: (type: string) => void;
  setCompanyFilter: (company: string | null) => void;
  setCompanyName: (name: string | null) => void;
  setShowAdvancedFilters: (show: boolean) => void;
  setMinSalary: (salary: string) => void;
  setExperience: (experience: string) => void;
  setIndustry: (industry: string) => void;
  setWorkMode: (workMode: string) => void;
  setEducation: (education: string) => void;
  clearAllFilters: () => void;
}

export function useJobsFilters() {
  // États des filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [minSalary, setMinSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [education, setEducation] = useState("");

  // Debounce pour optimiser les performances
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedLocation = useDebounce(selectedLocation, 300);


  // Actions des filtres
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedType("");
    setCompanyFilter(null);
    setCompanyName(null);
    setShowAdvancedFilters(false);
    setMinSalary("");
    setExperience("");
    setIndustry("");
    setWorkMode("");
    setEducation("");
  }, []);

  // Filtres pour l'API (conversion vers le format attendu par le backend)
  const apiFilters = useMemo(() => ({
    search: debouncedSearchTerm,
    location: debouncedLocation,
    contractType: selectedType, // Format attendu par le backend
    company: companyFilter,
    minSalary: minSalary,
    experience: experience,
    industry: industry,
    workMode: workMode,
    education: education
  }), [debouncedSearchTerm, debouncedLocation, selectedType, companyFilter, minSalary, experience, industry, workMode, education]);

  // État complet
  const state: JobsFiltersState = {
    searchTerm,
    selectedLocation,
    selectedType,
    companyFilter,
    companyName,
    showAdvancedFilters,
    minSalary,
    experience,
    industry,
    workMode,
    education
  };

  // Actions
  const actions: JobsFiltersActions = {
    setSearchTerm,
    setSelectedLocation,
    setSelectedType,
    setCompanyFilter,
    setCompanyName,
    setShowAdvancedFilters,
    setMinSalary,
    setExperience,
    setIndustry,
    setWorkMode,
    setEducation,
    clearAllFilters
  };

  return {
    state,
    actions,
    apiFilters
  };
}
