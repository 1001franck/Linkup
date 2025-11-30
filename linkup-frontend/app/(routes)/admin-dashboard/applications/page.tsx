/**
 * Gestion des Candidatures - Admin Dashboard
 * Interface complète de gestion des candidatures
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
import { useAdminApplications, AdminApplication } from "@/hooks/use-admin";
import { 
  FileText, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  User, 
  Briefcase, 
  Building2, 
  Calendar,
  RefreshCw,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Check,
  Users,
  Percent
} from "lucide-react";

export default function AdminApplicationsPage() {
  const { toast } = useToast();
  
  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<AdminApplication | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Hook admin
  const { 
    applications, 
    total, 
    isLoading, 
    error, 
    refetch, 
    updateApplication, 
    deleteApplication 
  } = useAdminApplications({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined
  });


  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleUpdateApplication = async (applicationId: string, applicationData: Partial<AdminApplication>) => {
    try {
      await updateApplication(applicationId, applicationData);
      setIsEditDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    try {
      await deleteApplication(applicationId);
      setIsDeleteDialogOpen(false);
      setSelectedApplication(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      accepted: { color: "bg-green-100 text-green-800", icon: Check },
      rejected: { color: "bg-red-100 text-red-800", icon: X },
      interview: { color: "bg-blue-100 text-blue-800", icon: Calendar },
      withdrawn: { color: "bg-gray-100 text-gray-800", icon: X }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      pending: "En attente",
      accepted: "Accepté",
      rejected: "Refusé",
      interview: "Entretien programmé",
      withdrawn: "Retiré"
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  return (
    <div className="py-8">
      {/* Header de la page */}
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <Typography variant="h1" className="font-bold">
                  Gestion des Candidatures
                </Typography>
                <Typography variant="muted">
                  {total} candidature{total > 1 ? 's' : ''} au total
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
                    placeholder="Rechercher par candidat, entreprise, poste..."
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

        {/* Liste des candidatures */}
        <Card>
          <CardHeader>
            <CardTitle>Candidatures ({total})</CardTitle>
            <CardDescription>
              Gestion complète des candidatures de la plateforme
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
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
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
            ) : !applications || !Array.isArray(applications) || applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <Typography variant="h3" className="font-semibold mb-2">
                  Aucune candidature trouvée
                </Typography>
                <Typography variant="muted" className="mb-4">
                  {searchTerm ? 'Aucune candidature ne correspond à votre recherche.' : 'Aucune candidature n\'a encore été soumise.'}
                </Typography>
              </div>
            ) : (
              <div className="space-y-4">
                {applications && Array.isArray(applications) && applications.map((application, index) => (
                  <motion.div
                    key={(application as any).id_user && (application as any).id_job_offer ? `${(application as any).id_user}-${(application as any).id_job_offer}` : index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Typography variant="sm" className="font-medium truncate">
                          {application.user_name}
                        </Typography>
                        {getStatusBadge(application.status)}
                        {application.match_percentage && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Percent className="h-3 w-3 mr-1" />
                            {application.match_percentage}%
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          <span className="truncate">{application.job_title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{application.company_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Candidaté le {formatDate(application.application_date)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {application.id_user && application.id_job_offer ? `${application.id_user}-${application.id_job_offer}` : 'N/A'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
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
      <EditApplicationDialog
        application={selectedApplication}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateApplication}
      />
      
      <DeleteApplicationDialog
        application={selectedApplication}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteApplication}
      />
      
      <Toaster />
    </div>
  );
}

// ========================================
// COMPOSANTS DE FORMULAIRES
// ========================================

function EditApplicationDialog({ 
  application, 
  open, 
  onOpenChange, 
  onSubmit 
}: { 
  application: AdminApplication | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (id: string, data: Partial<AdminApplication>) => void;
}) {
  const [formData, setFormData] = useState({
    status: 'pending',
    match_percentage: ''
  });

  useEffect(() => {
    if (application) {
      setFormData({
        status: application.status,
        match_percentage: application.match_percentage?.toString() || ''
      });
    }
  }, [application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (application) {
      const applicationData = {
        ...formData,
        match_percentage: formData.match_percentage ? parseInt(formData.match_percentage) : undefined
      };
      onSubmit(application.id_user && application.id_job_offer ? `${application.id_user}-${application.id_job_offer}` : '', applicationData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la candidature</DialogTitle>
          <DialogDescription>
            Modifier le statut de la candidature de {application?.user_name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="rejected">Refusé</SelectItem>
                <SelectItem value="interview">Entretien programmé</SelectItem>
                <SelectItem value="withdrawn">Retiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="match_percentage">Pourcentage de correspondance (%)</Label>
            <Input
              id="match_percentage"
              type="number"
              min="0"
              max="100"
              value={formData.match_percentage}
              onChange={(e) => setFormData({ ...formData, match_percentage: e.target.value })}
              placeholder="Ex: 85"
            />
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

function DeleteApplicationDialog({ 
  application, 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  application: AdminApplication | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onConfirm: (id: string) => void;
}) {
  const handleConfirm = () => {
    if (application) {
      onConfirm(application.id_user && application.id_job_offer ? `${application.id_user}-${application.id_job_offer}` : '');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la candidature</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la candidature de {application?.user_name} pour le poste "{application?.job_title}" ? 
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
