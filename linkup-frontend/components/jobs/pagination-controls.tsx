/**
 * Composant de contrôles de pagination
 * Interface utilisateur pour naviguer entre les pages
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { PaginationState, PaginationActions } from '@/types/jobs';

interface PaginationControlsProps {
  pagination: PaginationState;
  actions: PaginationActions;
  className?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  actions,
  className = ""
}) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
  const { goToPage, goToNextPage, goToPreviousPage } = actions;

  // Calculer les pages à afficher
  const getVisiblePages = () => {
    const delta = 2; // Nombre de pages à afficher de chaque côté
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // Informations de pagination
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null; // Pas de pagination si une seule page
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Informations */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Typography variant="small">
          Affichage de {startItem} à {endItem} sur {totalItems} offres
        </Typography>
      </div>

      {/* Contrôles de pagination */}
      <div className="flex items-center gap-1">
        {/* Première page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Page précédente */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Pages numérotées */}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <div key={`dots-${index}`} className="flex items-center justify-center h-8 w-8">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(pageNumber)}
              className={`h-8 w-8 p-0 ${
                isCurrentPage 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
            >
              {pageNumber}
            </Button>
          );
        })}

        {/* Page suivante */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Dernière page */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
