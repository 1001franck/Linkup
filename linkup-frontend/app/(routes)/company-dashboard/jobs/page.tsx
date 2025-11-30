/**
 * Page de gestion des offres d'emploi - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique des offres d'emploi
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useCompanyAllJobsManagement } from "@/hooks/use-api";
import { BackendStatus } from "@/components/ui/backend-status";
import CompanyHeader from "@/components/layout/company-header";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function CompanyJobsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Récupérer les offres d'emploi depuis l'API
  const { 
    data: apiJobs, 
    loading: jobsLoading, 
    error: jobsError 
  } = useCompanyAllJobsManagement();

  // Utiliser les données API ou un tableau vide par défaut
  const apiJobsData = apiJobs as any;
  const jobs = Array.isArray(apiJobsData?.data) ? apiJobsData.data : [];

  const statusOptions = [
    { id: "all", label: "Tous les statuts", color: "bg-gray-100 text-gray-800" },
    { id: "active", label: "Actives", color: "bg-green-100 text-green-800" },
    { id: "paused", label: "En pause", color: "bg-yellow-100 text-yellow-800" },
    { id: "closed", label: "Fermées", color: "bg-red-100 text-red-800" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "closed": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "paused": return "En pause";
      case "closed": return "Fermée";
      default: return "Inconnu";
    }
  };

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Logique de pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus]);

  const handleViewJob = (jobId: string | number) => {
    // Rediriger vers la page de détail de l'offre pour les entreprises
    const id = typeof jobId === 'number' ? jobId.toString() : jobId;
    router.push(`/company-dashboard/jobs/${id}`);
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${jobTitle}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      // Utiliser apiClient pour la suppression (les cookies httpOnly seront envoyés automatiquement)
      const response = await apiClient.deleteJob(Number(jobId));

      if (response.success) {
        toast({
          title: "Offre supprimée",
          description: `L'offre "${jobTitle}" a été supprimée avec succès.`,
          duration: 3000,
        });
        // Recharger la page pour mettre à jour la liste
        window.location.reload();
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'offre. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        
        {/* Contenu principal avec padding pour le header fixe */}
        <div className="pt-20 pb-16">
          <Container>
            <BackendStatus />
          {/* Header */}
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
                  Mes offres d'emploi
                </Typography>
                <Typography variant="muted" className="text-lg">
                  Gérez et suivez vos offres d'emploi
                </Typography>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="muted" className="text-sm font-medium">
                        Offres actives
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {jobs.filter((job: any) => job.status === 'active').length}
                      </Typography>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="muted" className="text-sm font-medium">
                        Total candidatures
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {jobs.reduce((sum: number, job: any) => sum + (job.applications || 0), 0)}
                      </Typography>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="muted" className="text-sm font-medium">
                        Offres urgentes
                      </Typography>
                      <Typography variant="h2" className="text-3xl font-bold text-foreground">
                        {jobs.filter((job: any) => job.urgent).length}
                      </Typography>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <Card className="backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Rechercher une offre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        {statusOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <Link href="/company-dashboard/create-job">
                    <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle offre
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {/* Loading State */}
            {jobsLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <Typography variant="muted">Chargement des offres...</Typography>
              </div>
            )}

            {/* Error State */}
            {jobsError && (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <Typography variant="h4" className="font-semibold text-foreground mb-2">
                  Erreur de chargement
                </Typography>
                <Typography variant="muted" className="text-sm max-w-sm mx-auto">
                  Impossible de charger les offres d'emploi. Vérifiez votre connexion et réessayez.
                </Typography>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!jobsLoading && !jobsError && filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <Typography variant="h4" className="font-semibold text-foreground mb-2">
                  {searchTerm || selectedStatus !== "all" ? "Aucune offre trouvée" : "Aucune offre d'emploi"}
                </Typography>
                <Typography variant="muted" className="text-sm max-w-sm mx-auto mb-4">
                  {searchTerm || selectedStatus !== "all" 
                    ? "Aucune offre ne correspond à vos critères de recherche."
                    : "Créez votre première offre d'emploi pour commencer à recevoir des candidatures."
                  }
                </Typography>
                <Link href="/company-dashboard/create-job">
                  <Button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une offre
                  </Button>
                </Link>
              </div>
            )}

            {/* Jobs List */}
            {!jobsLoading && !jobsError && filteredJobs.length > 0 && paginatedJobs.map((job: any, index: number) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Typography variant="h4" className="font-semibold text-foreground">
                            {job.title}
                          </Typography>
                          {job.urgent && (
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                              Urgent
                            </Badge>
                          )}
                          <Badge className={getStatusColor(job.status)}>
                            {getStatusLabel(job.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {job.postedDate}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-cyan-500" />
                            {job.applications} candidatures
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewJob(job.id_job_offer || job.id)}
                          title="Voir l'offre"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteJob(job.id_job_offer || job.id, job.title)}
                          title="Supprimer l'offre"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-muted-foreground">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, filteredJobs.length)} sur {filteredJobs.length} offres
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          </Container>
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
