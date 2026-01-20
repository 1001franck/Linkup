/**
 * Composant État Vide pour les Candidatures
 * Affiche un message quand il n'y a pas de candidatures
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { User } from "lucide-react";

interface ApplicationsEmptyStateProps {
  hasApplications: boolean;
  onClearFilters: () => void;
}

export function ApplicationsEmptyState({
  hasApplications,
  onClearFilters,
}: ApplicationsEmptyStateProps) {
  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <Typography variant="h3" className="text-foreground mb-2">
          {hasApplications ? "Aucune candidature trouvée" : "Aucune candidature reçue"}
        </Typography>
        <Typography variant="muted" className="mb-6">
          {hasApplications
            ? "Aucune candidature ne correspond à vos critères de recherche"
            : "Vous n'avez pas encore reçu de candidatures. Créez des offres d'emploi pour attirer des candidats."}
        </Typography>
        {hasApplications ? (
          <Button variant="outline" onClick={onClearFilters}>
            Effacer les filtres
          </Button>
        ) : (
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/company-dashboard/jobs">Créer une offre d'emploi</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/company-dashboard">Retour au dashboard</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}






