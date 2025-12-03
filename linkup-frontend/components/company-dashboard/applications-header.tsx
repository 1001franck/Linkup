/**
 * Composant Header de la page Applications
 * Affiche le titre, description et statistiques
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";

interface ApplicationsHeaderProps {
  totalApplications: number;
  filteredApplications: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
}

export function ApplicationsHeader({
  totalApplications,
  filteredApplications,
  currentPage,
  totalPages,
  isLoading,
}: ApplicationsHeaderProps) {
  return (
    <div className="py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/company-dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au dashboard
          </Button>
        </Link>
        <div>
          <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
            Gestion des candidatures
          </Typography>
          <Typography variant="muted" className="text-lg">
            Gérez et suivez toutes les candidatures reçues
          </Typography>
          {!isLoading && (
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                {filteredApplications} candidature{filteredApplications > 1 ? "s" : ""}
                {filteredApplications !== totalApplications &&
                  ` (filtrée${filteredApplications > 1 ? "s" : ""} sur ${totalApplications})`}
              </span>
              {totalPages > 1 && <span>• Page {currentPage} sur {totalPages}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




