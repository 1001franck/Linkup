/**
 * Page d'édition d'offre d'emploi - LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique de l'édition d'offres
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import logger from "@/lib/logger";
import CompanyHeader from "@/components/layout/company-header";
import { Country, City } from "country-state-city";
import { 
  ArrowLeft, 
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  FileText,
  Check,
  Plus,
  X,
  Save,
  Loader2
} from "lucide-react";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { user: company, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);
  const [formData, setFormData] = useState({
    // Informations de base
    title: "",
    location: "",
    country: "",
    city: "",
    contractType: "CDI",
    salaryMin: "",
    salaryMax: "",
    experience: "Non spécifié",
    industry: "Non spécifié",
    remote: false,
    urgency: "medium",
    
    // Description et détails
    description: "",
    requirements: [] as string[],
    benefits: [] as string[],
    education: "Non spécifié",
    contractDuration: "Non spécifié",
    workingTime: "Non spécifié",
    formationRequired: "Non spécifié"
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  // Charger les données de l'offre
  useEffect(() => {
    const loadJobData = async () => {
      if (!params.id) return;
      
      try {
        setIsLoading(true);
        const response = await apiClient.getJob(Number(params.id));
        
        if (response.success && response.data) {
          const job = response.data as any;
          setJobData(job);
          
          // Mapper les données de l'offre vers le formulaire
          setFormData({
            title: job.title || "",
            location: job.location || "",
            country: job.country || "",
            city: job.city || "",
            contractType: job.contractType || job.type || "CDI",
            salaryMin: job.salary?.min?.toString() || "",
            salaryMax: job.salary?.max?.toString() || "",
            experience: job.experience || "Non spécifié",
            industry: job.industry || job.department || "Non spécifié",
            remote: job.remote || false,
            urgency: job.urgency || "medium",
            description: job.description || "",
            requirements: job.requirements || [],
            benefits: job.benefits || [],
            education: job.education || "Non spécifié",
            contractDuration: job.contractDuration || "Non spécifié",
            workingTime: job.workingTime || "Non spécifié",
            formationRequired: job.formationRequired || "Non spécifié"
          });
        } else {
          throw new Error("Offre introuvable");
        }
      } catch (error) {
        logger.error("Erreur lors du chargement de l'offre:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'offre.",
          variant: "destructive",
          duration: 3000,
        });
        router.push("/company-dashboard/jobs");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadJobData();
    }
  }, [params.id, isAuthenticated, router, toast]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de l'offre est obligatoire.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        country: formData.country,
        city: formData.city,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        experience: formData.experience,
        industry: formData.industry,
        remote: formData.remote,
        urgency: formData.urgency,
        requirements: formData.requirements,
        benefits: formData.benefits,
        education: formData.education,
        contractDuration: formData.contractDuration,
        workingTime: formData.workingTime,
        formationRequired: formData.formationRequired
      };

      const response = await apiClient.updateJob(Number(params.id), jobData);

      if (response.success) {
        toast({
          title: "Offre mise à jour",
          description: "Votre offre d'emploi a été mise à jour avec succès.",
          duration: 3000,
        });
        router.push("/company-dashboard/jobs");
      } else {
        throw new Error(response.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de l'offre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'offre. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Chargement...</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        <div className="pt-20 pb-16">
          <Container>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="muted">Chargement de l'offre...</Typography>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        <div className="pt-20 pb-16">
          <Container>
            <div className="text-center py-12">
              <Typography variant="h4" className="font-semibold text-foreground mb-2">
                Offre introuvable
              </Typography>
              <Typography variant="muted" className="text-sm max-w-sm mx-auto mb-4">
                Cette offre d'emploi n'existe pas ou a été supprimée.
              </Typography>
              <Link href="/company-dashboard/jobs">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux offres
                </Button>
              </Link>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      <CompanyHeader />
      
      <div className="pt-20 pb-16">
        <Container>
          {/* Header */}
          <div className="py-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/company-dashboard/jobs">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux offres
                </Button>
              </Link>
              <div className="flex-1">
                <Typography variant="h1" className="text-3xl font-bold text-foreground mb-2">
                  Modifier l'offre
                </Typography>
                <Typography variant="muted">
                  Modifiez les détails de votre offre d'emploi
                </Typography>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Informations de base
                </CardTitle>
                <CardDescription>
                  Les informations essentielles de votre offre d'emploi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Titre du poste *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Ex: Développeur Full Stack"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de contrat</label>
                    <select
                      value={formData.contractType}
                      onChange={(e) => handleInputChange("contractType", e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Alternance">Alternance</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pays</label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="">Sélectionner un pays</option>
                      {Country.getAllCountries().map((country) => (
                        <option key={country.isoCode} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ville</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Ex: Paris"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Localisation complète</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Ex: Paris, France"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salaire minimum (€)</label>
                    <Input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      placeholder="Ex: 35000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salaire maximum (€)</label>
                    <Input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      placeholder="Ex: 50000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expérience requise</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="Non spécifié">Non spécifié</option>
                      <option value="Débutant (0-2 ans)">Débutant (0-2 ans)</option>
                      <option value="Intermédiaire (2-5 ans)">Intermédiaire (2-5 ans)</option>
                      <option value="Expérimenté (5-10 ans)">Expérimenté (5-10 ans)</option>
                      <option value="Expert (10+ ans)">Expert (10+ ans)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secteur d'activité</label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      placeholder="Ex: Technologies"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Urgence</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange("urgency", e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={formData.remote}
                    onChange={(e) => handleInputChange("remote", e.target.checked)}
                    className="rounded border-border"
                  />
                  <label htmlFor="remote" className="text-sm font-medium">
                    Télétravail possible
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description du poste
                </CardTitle>
                <CardDescription>
                  Décrivez les missions et responsabilités du poste
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Décrivez les missions, responsabilités et défis du poste..."
                    className="w-full p-3 border border-border rounded-md bg-background min-h-[200px] resize-y"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Exigences */}
            <Card>
              <CardHeader>
                <CardTitle>Exigences</CardTitle>
                <CardDescription>
                  Les compétences et qualifications requises
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Ajouter une exigence..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="flex-1 text-sm">{req}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avantages */}
            <Card>
              <CardHeader>
                <CardTitle>Avantages</CardTitle>
                <CardDescription>
                  Les avantages et bénéfices offerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Ajouter un avantage..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button type="button" onClick={addBenefit} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="flex-1 text-sm">{benefit}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Link href="/company-dashboard/jobs">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Mettre à jour l'offre
                  </>
                )}
              </Button>
            </div>
          </form>
        </Container>
      </div>
      
      <Toaster />
    </div>
  );
}
