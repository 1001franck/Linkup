import { useState, useMemo, useCallback } from 'react';
import { Application, ApplicationFilters } from '@/types/application';

/**
 * Hook personnalisé pour la gestion des filtres des candidatures
 * Centralise la logique de filtrage et de tri
 */
export function useApplicationFilters() {
  
  // États des filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRecentFirst, setShowRecentFirst] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  // Fonction pour parser une date DD/MM/YYYY (format français)
  const parseDate = useCallback((dateString: string): Date => {
    // Gérer le format DD/MM/YYYY (format français)
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    }
    // Gérer le format DD-MM-YYYY (format alternatif)
    else if (dateString.includes('-')) {
      const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    // Fallback : essayer de parser directement
    else {
      return new Date(dateString);
    }
  }, []);

  // Fonction pour filtrer et trier les candidatures
  const filterAndSortApplications = useCallback((applications: Application[]) => {
    return applications
      .filter(application => {
        // Pour "Toutes", on affiche toutes les candidatures (archivées et non archivées)
        // Pour les autres filtres, on respecte le toggle d'archivage
        const matchesArchive = selectedFilter === "all" || application.metadata.isArchived === showArchived;
        
        const matchesSearch = 
          application.jobOffer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          application.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          application.jobOffer.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = 
          selectedFilter === "all" ||
          (selectedFilter === "bookmarked" && application.metadata.isBookmarked) ||
          application.metadata.status === selectedFilter;
        
        return matchesArchive && matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        try {
          const dateA = parseDate(a.metadata.appliedDate);
          const dateB = parseDate(b.metadata.appliedDate);
          
          if (showRecentFirst) {
            // Les plus récents en premier
            return dateB.getTime() - dateA.getTime();
          } else {
            // Les plus anciens en premier
            return dateA.getTime() - dateB.getTime();
          }
        } catch (error) {
          return 0;
        }
      });
  }, [searchTerm, selectedFilter, showArchived, showRecentFirst, parseDate]);

  // Calculer les statistiques des filtres
  const filterStats = useMemo(() => {
    return (applications: Application[]) => {
      const filteredByArchive = applications.filter(a => a.metadata.isArchived === showArchived);
      
      return [
        { id: "all", label: "Toutes", count: applications.length }, // Toutes les candidatures, archivées ou non
        { id: "pending", label: "En cours", count: filteredByArchive.filter(a => a.metadata.status === "pending").length },
        { id: "interview", label: "Entretiens", count: filteredByArchive.filter(a => a.metadata.status === "interview").length },
        { id: "accepted", label: "Acceptées", count: filteredByArchive.filter(a => a.metadata.status === "accepted").length },
        { id: "rejected", label: "Refusées", count: filteredByArchive.filter(a => a.metadata.status === "rejected").length },
        { id: "bookmarked", label: "Sauvegardées", count: filteredByArchive.filter(a => a.metadata.isBookmarked).length }
      ];
    };
  }, [showArchived]);

  // Actions des filtres
  const clearAllFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedFilter("all");
    setShowRecentFirst(true);
    setShowArchived(false);
  }, []);

  const resetToDefaults = useCallback(() => {
    setSearchTerm("");
    setSelectedFilter("all");
    setShowRecentFirst(true);
    setShowArchived(false);
  }, []);

  // État des filtres
  const filtersState: ApplicationFilters = {
    searchTerm,
    selectedFilter,
    showRecentFirst,
    showArchived
  };

  // Actions des filtres
  const filtersActions = {
    setSearchTerm,
    setSelectedFilter,
    setShowRecentFirst,
    setShowArchived,
    clearAllFilters,
    resetToDefaults
  };

  return {
    filtersState,
    filtersActions,
    filterAndSortApplications,
    filterStats
  };
}
