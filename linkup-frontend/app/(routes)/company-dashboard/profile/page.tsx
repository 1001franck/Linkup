/**
 * Page Profil Entreprise - LinkUp
 * Gestion du profil et du logo de l'entreprise
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { CompanyLogoUpload } from "@/components/companies/company-logo-upload";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import CompanyHeader from "@/components/layout/company-header";
import { 
  Building2, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  MapPin,
  Globe,
  Users,
  Mail,
  Phone
} from "lucide-react";

export default function CompanyProfilePage() {
  const { user: company, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    website: "",
    city: "",
    country: "",
    recruiter_name: "",
    recruiter_email: "",
    recruiter_phone: "",
  });

  // Charger les données de l'entreprise
  useEffect(() => {
    if (company && isAuthenticated) {
      setFormData({
        name: (company && 'name' in company) ? (company.name || "") : "",
        description: (company && 'description' in company) ? (company.description || "") : "",
        industry: (company && 'industry' in company) ? (company.industry || "") : "",
        website: (company && 'website' in company) ? (company.website || "") : "",
        city: (company && 'city' in company) ? (company.city || "") : "",
        country: (company && 'country' in company) ? (company.country || "") : "",
        recruiter_name: (company && 'recruiter_firstname' in company && 'recruiter_lastname' in company) 
          ? `${(company as any).recruiter_firstname} ${(company as any).recruiter_lastname}` : "",
        recruiter_email: (company && 'recruiter_mail' in company) ? (company as any).recruiter_mail : "",
        recruiter_phone: (company && 'recruiter_phone' in company) ? (company as any).recruiter_phone : "",
      });
    }
  }, [company, isAuthenticated]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const companyId = (company && ('id_company' in company || 'Id_company' in company)) 
      ? (company.id_company || (company as any).Id_company) 
      : null;
    if (!companyId) return;

    setIsSaving(true);
    try {
      const response = await apiClient.updateCompany(companyId, formData);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        });
      } else {
        throw new Error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur mise à jour profil:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <Typography variant="h2" className="font-bold mb-2">
            Accès Refusé
          </Typography>
          <Typography variant="muted">
            Vous devez être connecté pour accéder à cette page.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      <CompanyHeader />
      <main className="pt-16">
        <div className="py-8">
          <Container>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <Typography variant="h1" className="font-bold">
                    Profil de l'entreprise
                  </Typography>
                  <Typography variant="muted">
                    Gérez les informations et le logo de votre entreprise
                  </Typography>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Logo Upload */}
              <div className="lg:col-span-1">
                <CompanyLogoUpload
                  companyId={(company as any).id_company || (company as any).Id_company || 0}
                  currentLogo={(company && 'logo' in company) ? (company.logo || "") : ""}
                />
              </div>

              {/* Informations de l'entreprise */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Informations générales
                    </CardTitle>
                    <CardDescription>
                      Les informations de base de votre entreprise
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom de l'entreprise *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="industry">Secteur d'activité</Label>
                        <Input
                          id="industry"
                          value={formData.industry}
                          onChange={(e) => handleInputChange("industry", e.target.value)}
                          placeholder="Ex: Technologie, Finance, Santé..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Décrivez votre entreprise..."
                        className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Site web</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                            placeholder="https://www.example.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="Ville"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations de contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Informations de contact
                    </CardTitle>
                    <CardDescription>
                      Coordonnées du recruteur principal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recruiter_name">Nom du recruteur</Label>
                        <Input
                          id="recruiter_name"
                          value={formData.recruiter_name}
                          onChange={(e) => handleInputChange("recruiter_name", e.target.value)}
                          placeholder="Prénom Nom"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recruiter_email">Email de contact</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="recruiter_email"
                            type="email"
                            value={formData.recruiter_email}
                            onChange={(e) => handleInputChange("recruiter_email", e.target.value)}
                            placeholder="contact@entreprise.com"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recruiter_phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="recruiter_phone"
                          value={formData.recruiter_phone}
                          onChange={(e) => handleInputChange("recruiter_phone", e.target.value)}
                          placeholder="+33 1 23 45 67 89"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                  <Button variant="outline" disabled={isSaving}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 mr-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </motion.div>
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
          <Toaster />
        </div>
      </main>
    </div>
  );
}