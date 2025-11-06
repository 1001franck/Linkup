/**
 * Gestion des Offres d'Emploi - Admin Dashboard
 * Interface complète de gestion des offres d'emploi
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAdminJobs, AdminJob } from "@/hooks/use-admin";
import { 
  Briefcase, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Building2, 
  MapPin, 
  Calendar,
  RefreshCw,
  Filter,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Clock,
  Users
} from "lucide-react";

export default function AdminJobsPage() {
  const { toast } = useToast();
  
  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Hook admin
  const { 
    jobs, 
    total, 
    isLoading, 
    error, 
    refetch, 
    createJob, 
    updateJob, 
    deleteJob 
  } = useAdminJobs({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateJob = async (jobData: Partial<AdminJob>) => {
    try {
      await createJob(jobData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUpdateJob = async (jobId: number, jobData: Partial<AdminJob>) => {
    try {
      await updateJob(jobId, jobData);
      setIsEditDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      setIsDeleteDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      closed: { color: "bg-red-100 text-red-800", icon: AlertCircle },
      draft: { color: "bg-yellow-100 text-yellow-800", icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date invalide";
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Non spécifié";
    if (min && max) return `${min.toLocaleString()}€ - ${max.toLocaleString()}€`;
    if (min) return `À partir de ${min.toLocaleString()}€`;
    if (max) return `Jusqu'à ${max.toLocaleString()}€`;
    return "Non spécifié";
  };

  return (
    <div className="py-8">
      {/* Header de la page */}
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <div>
                <Typography variant="h1" className="font-bold">
                  Gestion des Offres d'Emploi
                </Typography>
                <Typography variant="muted">
                  {total} offre{total > 1 ? 's' : ''} au total
                </Typography>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle offre
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une offre d'emploi</DialogTitle>
                  <DialogDescription>
                    Ajouter une nouvelle offre d'emploi à la plateforme
                  </DialogDescription>
                </DialogHeader>
                <CreateJobForm onSubmit={handleCreateJob} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Container>

      <Container>
        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par titre, entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des offres */}
        <Card>
          <CardHeader>
            <CardTitle>Offres d'emploi ({total})</CardTitle>
            <CardDescription>
              Gestion complète des offres d'emploi de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg animate-pulse">
                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <Typography variant="h3" className="font-semibold mb-2">
                  Erreur de chargement
                </Typography>
                <Typography variant="muted" className="mb-4">
                  {error}
                </Typography>
                <Button onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            ) : !jobs || !Array.isArray(jobs) || jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h3" className="font-semibold mb-2">
                  Aucune offre trouvée
                </Typography>
                <Typography variant="muted" className="mb-4">
                  {searchTerm ? 'Aucune offre ne correspond à votre recherche.' : 'Commencez par créer votre première offre.'}
                </Typography>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une offre
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {jobs && Array.isArray(jobs) && jobs.map((job, index) => (
                  <motion.div
                    key={job.id_job_offer || job.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Typography variant="sm" className="font-medium truncate">
                          {job.title}
                        </Typography>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{job.company_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Publiée le {formatDate(job.published_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {job.contract_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>0 candidatures</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Dialogs */}
      <EditJobDialog
        job={selectedJob}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateJob}
      />
      
      <DeleteJobDialog
        job={selectedJob}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteJob}
      />
      
      <Toaster />
    </div>
  );
}

// ========================================
// COMPOSANTS DE FORMULAIRES
// ========================================

function CreateJobForm({ onSubmit }: { onSubmit: (data: Partial<AdminJob>) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary_min: '',
    salary_max: '',
    contract_type: 'CDI',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
      company_name: "Entreprise Admin", // À remplacer par une vraie sélection
      company_id: 1 // À remplacer par une vraie sélection
    };
    onSubmit(jobData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Titre du poste</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="contract_type">Type de contrat</Label>
          <Select value={formData.contract_type} onValueChange={(value) => setFormData({ ...formData, contract_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="Stage">Stage</SelectItem>
              <SelectItem value="Alternance">Alternance</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="salary_min">Salaire minimum (€)</Label>
          <Input
            id="salary_min"
            type="number"
            value={formData.salary_min}
            onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="salary_max">Salaire maximum (€)</Label>
          <Input
            id="salary_max"
            type="number"
            value={formData.salary_max}
            onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="status">Statut</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Fermée</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit">Créer</Button>
      </div>
    </form>
  );
}

function EditJobDialog({ 
  job, 
  open, 
  onOpenChange, 
  onSubmit 
}: { 
  job: AdminJob | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (id: number, data: Partial<AdminJob>) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary_min: '',
    salary_max: '',
    contract_type: 'CDI',
    status: 'active'
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        salary_min: job.salary_min?.toString() || '',
        salary_max: job.salary_max?.toString() || '',
        contract_type: job.contract_type,
        status: job.status
      });
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (job) {
      const jobData = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined
      };
      onSubmit(job.id_job_offer || job.id, jobData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'offre d'emploi</DialogTitle>
          <DialogDescription>
            Modifier les informations de {job?.title}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Titre du poste</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-location">Localisation</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-contract_type">Type de contrat</Label>
              <Select value={formData.contract_type} onValueChange={(value) => setFormData({ ...formData, contract_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                  <SelectItem value="Alternance">Alternance</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-salary_min">Salaire minimum (€)</Label>
              <Input
                id="edit-salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-salary_max">Salaire maximum (€)</Label>
              <Input
                id="edit-salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="edit-status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Fermée</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Modifier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteJobDialog({ 
  job, 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  job: AdminJob | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onConfirm: (id: number) => void;
}) {
  const handleConfirm = () => {
    if (job) {
      onConfirm(job.id_job_offer || job.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'offre d'emploi</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l'offre "{job?.title}" ? 
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
