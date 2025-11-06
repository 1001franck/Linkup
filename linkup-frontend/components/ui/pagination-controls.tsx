/**
 * Composants de contrôle de pagination élégants
 * Respect des principes SOLID, KISS et DRY
 */

"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

/**
 * Composant de contrôles de pagination élégant
 * Single Responsibility: Gestion uniquement de la pagination
 * Open/Closed: Extensible via props
 */
export function PaginationControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  className = ""
}: PaginationControlsProps) {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Bouton Précédent */}
      <Button
        onClick={onPrevious}
        disabled={isFirstPage}
        variant="outline"
        size="lg"
        className={`
          group flex items-center gap-3 px-6 py-3 rounded-2xl border-2 
          transition-all duration-300 ease-out
          ${isFirstPage 
            ? 'opacity-40 cursor-not-allowed border-muted-foreground/20' 
            : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 cursor-pointer'
          }
        `}
      >
        <div className={`
          p-2 rounded-xl transition-all duration-300
          ${isFirstPage 
            ? 'bg-muted-foreground/10' 
            : 'bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110'
          }
        `}>
          <ChevronLeft className={`h-4 w-4 ${isFirstPage ? 'text-muted-foreground' : 'text-primary'}`} />
        </div>
        <span className={`font-medium ${isFirstPage ? 'text-muted-foreground' : 'text-foreground'}`}>
          Précédent
        </span>
      </Button>

      {/* Indicateur de page */}
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-primary">
            {currentPage + 1} / {totalPages}
          </span>
        </div>
      </div>

      {/* Bouton Suivant */}
      <Button
        onClick={onNext}
        disabled={isLastPage}
        variant="outline"
        size="lg"
        className={`
          group flex items-center gap-3 px-6 py-3 rounded-2xl border-2 
          transition-all duration-300 ease-out
          ${isLastPage 
            ? 'opacity-40 cursor-not-allowed border-muted-foreground/20' 
            : 'border-primary/30 hover:border-primary/60 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 cursor-pointer'
          }
        `}
      >
        <span className={`font-medium ${isLastPage ? 'text-muted-foreground' : 'text-foreground'}`}>
          Suivant
        </span>
        <div className={`
          p-2 rounded-xl transition-all duration-300
          ${isLastPage 
            ? 'bg-muted-foreground/10' 
            : 'bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110'
          }
        `}>
          <ChevronRight className={`h-4 w-4 ${isLastPage ? 'text-muted-foreground' : 'text-primary'}`} />
        </div>
      </Button>
    </div>
  );
}
