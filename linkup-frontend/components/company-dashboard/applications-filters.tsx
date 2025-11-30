/**
 * Composant Filtres pour les candidatures
 * Permet de rechercher, filtrer par statut et par offre d'emploi
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock } from "lucide-react";

interface StatusOption {
  id: string;
  label: string;
  color: string;
}

interface JobOption {
  id: string;
  title: string;
}

interface ApplicationsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedJob: string;
  onJobChange: (value: string) => void;
  statusOptions: StatusOption[];
  jobs: JobOption[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function ApplicationsFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedJob,
  onJobChange,
  statusOptions,
  jobs,
  onRefresh,
  isLoading,
}: ApplicationsFiltersProps) {
  return (
    <div className="mb-8">
      <Card className="backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Nom, poste..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Statut</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Offre d'emploi</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedJob}
                onChange={(e) => onJobChange(e.target.value)}
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Actions</label>
              <Button
                variant="outline"
                className="w-full"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <Clock className="h-4 w-4 mr-2" />
                {isLoading ? "Actualisation..." : "Actualiser"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

