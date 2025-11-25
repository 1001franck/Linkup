/**
 * Gestion des Entreprises - Admin Dashboard
 * Interface complète de gestion des entreprises
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAdminCompanies, AdminCompany } from "@/hooks/use-admin";
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  RefreshCw,
  Filter,
  AlertCircle,
  CheckCircle,
  Globe,
  MapPin
} from "lucide-react";

export default function AdminCompaniesPage() {
  const { toast } = useToast();
  
  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<AdminCompany | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Hook admin
  const { 
    companies, 
    total, 
    isLoading, 
    error, 
    refetch, 
    createCompany, 
    updateCompany, 
    deleteCompany 
  } = useAdminCompanies({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateCompany = async (companyData: Partial<AdminCompany>) => {
    try {
      await createCompany(companyData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUpdateCompany = async (companyId: number, companyData: Partial<AdminCompany>) => {
    try {
      await updateCompany(companyId, companyData);
      setIsEditDialogOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    try {
      await deleteCompany(companyId);
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="py-8">
      {/* Header de la page */}
      <Container>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <Typography variant="h1" className="font-bold">
                  Gestion des Entreprises
                </Typography>
                <Typography variant="muted">
                  {total} entreprise{total > 1 ? 's' : ''} au total
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
                  Nouvelle entreprise
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer une entreprise</DialogTitle>
                  <DialogDescription>
                    Ajouter une nouvelle entreprise à la plateforme
                  </DialogDescription>
                </DialogHeader>
                <CreateCompanyForm onSubmit={handleCreateCompany} />
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
                    placeholder="Rechercher par nom, email..."
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

        {/* Liste des entreprises */}
        <Card>
          <CardHeader>
            <CardTitle>Entreprises ({total})</CardTitle>
            <CardDescription>
              Gestion complète des entreprises de la plateforme
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
            ) : !companies || !Array.isArray(companies) || companies.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h3" className="font-semibold mb-2">
                  Aucune entreprise trouvée
                </Typography>
                <Typography variant="muted" className="mb-4">
                  {searchTerm ? 'Aucune entreprise ne correspond à votre recherche.' : 'Commencez par créer votre première entreprise.'}
                </Typography>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une entreprise
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {companies && Array.isArray(companies) && companies.map((company, index) => (
                  <motion.div
                    key={company.id_company || company.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Typography variant="sm" className="font-medium truncate">
                          {company.name}
                        </Typography>
                        <Badge className="bg-green-100 text-green-800">
                          Entreprise
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{company.recruiter_mail}</span>
                        </div>
                        {company.recruiter_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{company.recruiter_phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Inscrite le {formatDate(company.created_at)}</span>
                        </div>
                      </div>
                      {company.description && (
                        <Typography variant="xs" className="text-muted-foreground mt-1 line-clamp-2">
                          {company.description}
                        </Typography>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCompany(company);
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
      <EditCompanyDialog
        company={selectedCompany}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleUpdateCompany}
      />
      
      <DeleteCompanyDialog
        company={selectedCompany}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteCompany}
      />
      
      <Toaster />
    </div>
  );
}

// ========================================
// COMPOSANTS DE FORMULAIRES
// ========================================

function CreateCompanyForm({ onSubmit }: { onSubmit: (data: Partial<AdminCompany>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    recruiter_mail: '',
    recruiter_phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'entreprise</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="website">Site web</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="recruiter_mail">Email du recruteur</Label>
        <Input
          id="recruiter_mail"
          type="email"
          value={formData.recruiter_mail}
          onChange={(e) => setFormData({ ...formData, recruiter_mail: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="recruiter_phone">Téléphone du recruteur</Label>
        <Input
          id="recruiter_phone"
          value={formData.recruiter_phone}
          onChange={(e) => setFormData({ ...formData, recruiter_phone: e.target.value })}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit">Créer</Button>
      </div>
    </form>
  );
}

function EditCompanyDialog({ 
  company, 
  open, 
  onOpenChange, 
  onSubmit 
}: { 
  company: AdminCompany | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSubmit: (id: number, data: Partial<AdminCompany>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    recruiter_mail: '',
    recruiter_phone: ''
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description,
        website: company.website || '',
        recruiter_mail: company.recruiter_mail,
        recruiter_phone: company.recruiter_phone || ''
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company) {
      onSubmit(company.id_company || company.id, formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'entreprise</DialogTitle>
          <DialogDescription>
            Modifier les informations de {company?.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Nom de l'entreprise</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="edit-website">Site web</Label>
            <Input
              id="edit-website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="edit-recruiter_mail">Email du recruteur</Label>
            <Input
              id="edit-recruiter_mail"
              type="email"
              value={formData.recruiter_mail}
              onChange={(e) => setFormData({ ...formData, recruiter_mail: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="edit-recruiter_phone">Téléphone du recruteur</Label>
            <Input
              id="edit-recruiter_phone"
              value={formData.recruiter_phone}
              onChange={(e) => setFormData({ ...formData, recruiter_phone: e.target.value })}
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

function DeleteCompanyDialog({ 
  company, 
  open, 
  onOpenChange, 
  onConfirm 
}: { 
  company: AdminCompany | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onConfirm: (id: number) => void;
}) {
  const handleConfirm = () => {
    if (company) {
      onConfirm(company.id_company || company.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'entreprise</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer {company?.name} ? 
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
