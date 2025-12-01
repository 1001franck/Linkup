/**
 * Page de présentation d'entreprise - LinkUp
 * Affiche les détails complets d'une entreprise de manière organisée et professionnelle
 */

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2,
  MapPin,
  Users,
  Calendar,
  Globe,
  Briefcase,
  Mail,
  Phone,
  Share2,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface CompanyDetails {
  id_company: number;
  name: string;
  description: string;
  industry?: string;
  city?: string;
  zip_code?: string;
  country?: string;
  website?: string;
  logo?: string;
  employees_number?: string;
  founded_year?: number;
  recruiter_mail?: string;
  recruiter_firstname?: string;
  recruiter_lastname?: string;
  recruiter_phone?: string;
  created_at?: string;
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (!companyId || isNaN(companyId)) {
      setError("ID d'entreprise invalide");
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.getCompany(companyId);
        
        if (response.success && response.data) {
          // Le backend retourne { data: company }, donc response.data contient { data: company }
          // ou directement company selon le format de l'API client
          const companyData = (response.data as any).data || response.data;
          setCompany(companyData);
        } else {
          setError(response.error || "Entreprise non trouvée");
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement de l'entreprise:", err);
        setError(err.message || "Erreur lors du chargement de l'entreprise");
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de l'entreprise",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, toast]);

  const handleShare = () => {
    if (typeof window !== 'undefined' && company) {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: `${company.name} - LinkUp`,
          text: `Découvrez ${company.name} sur LinkUp`,
          url: url,
        }).catch(() => {
          // Fallback si l'utilisateur annule
        });
      } else {
        // Fallback: copier dans le presse-papiers
        navigator.clipboard.writeText(url);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers",
        });
      }
    }
  };

  const handleViewJobs = () => {
    if (company) {
      router.push(`/jobs?company=${company.id_company}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container className="py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <Typography variant="h4" className="mb-2">Chargement...</Typography>
              <Typography variant="muted">Récupération des informations de l'entreprise</Typography>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container className="py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
            <Typography variant="h3" className="mb-2">Entreprise non trouvée</Typography>
            <Typography variant="muted" className="mb-6 text-center max-w-md">
              {error || "L'entreprise que vous recherchez n'existe pas ou a été supprimée."}
            </Typography>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/companies')}>
                Retour aux entreprises
              </Button>
              <Button onClick={() => router.push('/')}>
                Accueil
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const location = [company.city, company.zip_code, company.country]
    .filter(Boolean)
    .join(', ');

  const isImageUrl = company.logo && 
    (company.logo.startsWith('http://') || company.logo.startsWith('https://'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
      {/* Header avec bouton retour */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-40">
        <Container>
          <div className="flex items-center justify-between py-4">
            <BackButton fallbackPath="/companies" />
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Hero - En-tête de l'entreprise */}
          <Card className="backdrop-blur-sm border-0 shadow-lg mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-2xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center overflow-hidden">
                    {isImageUrl ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-primary" />
                    )}
                  </div>
                </div>

                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Typography variant="h1" className="text-3xl font-bold">
                      {company.name}
                    </Typography>
                    {company.industry && (
                      <Badge variant="outline" className="text-sm">
                        {company.industry}
                      </Badge>
                    )}
                  </div>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{location}</span>
                      </div>
                    )}
                    {company.employees_number && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{company.employees_number} employés</span>
                      </div>
                    )}
                    {company.founded_year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Fondée en {company.founded_year}</span>
                      </div>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Site web</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button 
                    onClick={handleViewJobs}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Voir les offres
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Grille de contenu */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale - Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    À propos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="body" className="whitespace-pre-line leading-relaxed">
                    {company.description || "Aucune description disponible pour le moment."}
                  </Typography>
                </CardContent>
              </Card>

              {/* Informations supplémentaires */}
              {(company.recruiter_mail || company.recruiter_phone) && (
                <Card className="backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {company.recruiter_mail && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <a
                          href={`mailto:${company.recruiter_mail}`}
                          className="text-primary hover:underline"
                        >
                          {company.recruiter_mail}
                        </a>
                      </div>
                    )}
                    {company.recruiter_phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <a
                          href={`tel:${company.recruiter_phone}`}
                          className="text-primary hover:underline"
                        >
                          {company.recruiter_phone}
                        </a>
                      </div>
                    )}
                    {company.recruiter_firstname && company.recruiter_lastname && (
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span>
                          {company.recruiter_firstname} {company.recruiter_lastname}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Colonne latérale - Informations clés */}
            <div className="space-y-6">
              {/* Informations clés */}
              <Card className="backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Informations clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {company.industry && (
                    <div>
                      <Typography variant="muted" className="text-xs mb-1">
                        Secteur d'activité
                      </Typography>
                      <Typography variant="small" className="font-medium">
                        {company.industry}
                      </Typography>
                    </div>
                  )}
                  {location && (
                    <div>
                      <Typography variant="muted" className="text-xs mb-1">
                        Localisation
                      </Typography>
                      <Typography variant="small" className="font-medium">
                        {location}
                      </Typography>
                    </div>
                  )}
                  {company.employees_number && (
                    <div>
                      <Typography variant="muted" className="text-xs mb-1">
                        Taille
                      </Typography>
                      <Typography variant="small" className="font-medium">
                        {company.employees_number} employés
                      </Typography>
                    </div>
                  )}
                  {company.founded_year && (
                    <div>
                      <Typography variant="muted" className="text-xs mb-1">
                        Fondée en
                      </Typography>
                      <Typography variant="small" className="font-medium">
                        {company.founded_year}
                      </Typography>
                    </div>
                  )}
                  {company.website && (
                    <div>
                      <Typography variant="muted" className="text-xs mb-1">
                        Site web
                      </Typography>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
                      >
                        Visiter le site
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="backdrop-blur-sm border-0 shadow-lg bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
                    <div>
                      <Typography variant="h4" className="mb-2">
                        Intéressé par cette entreprise ?
                      </Typography>
                      <Typography variant="muted" className="text-sm mb-4">
                        Découvrez toutes les offres d'emploi disponibles
                      </Typography>
                    </div>
                    <Button 
                      onClick={handleViewJobs}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Voir les offres
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

