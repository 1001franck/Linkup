/**
 * Composant Header du Dashboard Entreprise
 * Affiche le titre, description et actions (export, publier offre)
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Download, Plus } from "lucide-react";

interface CompanyDashboardHeaderProps {
  companyName: string | null;
  isLoading: boolean;
  error: string | null;
  onExport: () => void;
  truncateName: (name: string, maxLength?: number) => string;
}

export function CompanyDashboardHeader({
  companyName,
  isLoading,
  error,
  onExport,
  truncateName,
}: CompanyDashboardHeaderProps) {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
            Dashboard{" "}
            {companyName && companyName.length > 20 ? (
              <span
                className="cursor-help border-b border-dotted border-muted-foreground/30"
                title={companyName}
              >
                {truncateName(companyName)}
              </span>
            ) : (
              truncateName(companyName || "")
            )}
            {isLoading && (
              <span className="ml-2 text-sm text-muted-foreground">(Chargement...)</span>
            )}
          </Typography>
          <Typography variant="muted" className="text-lg">
            Gérez vos offres d'emploi et vos candidatures
          </Typography>
          {error && (
            <Typography variant="muted" className="text-sm text-red-500 mt-1">
              Erreur lors du chargement des statistiques: {error}
            </Typography>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={onExport}>
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Link href="/company-dashboard/create-job">
            <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Publier une offre
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}



