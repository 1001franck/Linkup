"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si peu de pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            className="w-8 h-8 p-0"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Logique pour afficher seulement quelques pages
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      // Première page
      if (startPage > 1) {
        pages.push(
          <Button
            key={1}
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            className="w-8 h-8 p-0"
          >
            1
          </Button>
        );
        if (startPage > 2) {
          pages.push(<span key="ellipsis1" className="px-2 text-muted-foreground">...</span>);
        }
      }
      
      // Pages autour de la page actuelle
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i)}
            className="w-8 h-8 p-0"
          >
            {i}
          </Button>
        );
      }
      
      // Dernière page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(<span key="ellipsis2" className="px-2 text-muted-foreground">...</span>);
        }
        pages.push(
          <Button
            key={totalPages}
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 p-0"
          >
            {totalPages}
          </Button>
        );
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-8 mb-6">
      <div className="text-sm text-muted-foreground">
        Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems} candidatures
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
        
        <div className="flex items-center gap-1">
          {renderPageNumbers()}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
