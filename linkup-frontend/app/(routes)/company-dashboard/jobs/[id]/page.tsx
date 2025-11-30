/**
 * Page de détail d'une offre d'emploi pour les entreprises
 * Vue spécifique pour les entreprises qui gèrent leurs offres
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useJob } from "@/hooks/use-api";
import { Job } from "@/types/jobs";
import { motion } from "framer-motion";
import Link from "next/link";
import CompanyHeader from "@/components/layout/company-header";
import { apiClient } from "@/lib/api-client";
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Building, 
  Share2,
  Users,
  DollarSign,
  ExternalLink,
  Edit,
  Trash2,
  Calendar,
  Check,
  Briefcase,
  GraduationCap
} from "lucide-react";

export default function CompanyJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const jobId = params.id as string;

  // Récupérer les détails de l'offre
  const { data: jobResponse, loading, error } = useJob(jobId ? Number(jobId) : null);

  // Transformer les données API vers le format attendu
  const jobData = (jobResponse as any)?.data;
  const job: Job | null = jobData ? {
    id: jobData.id_job_offer || jobData.id || Number(jobId),
    title: jobData.title || "Titre non disponible",
    company: jobData.company?.name || jobData.company || "Entreprise",
    companyId: jobData.id_company || jobData.companyId || 0,
    location: jobData.location || "Non spécifié",
    type: jobData.contract_type || "Non spécifié",
    contractType: jobData.contract_type || "Non spécifié",
    remote: jobData.remote === "true" || jobData.remote === true || false,
    salary: (jobData.salary_min || jobData.salary_max) ? {
      min: jobData.salary_min || 0,
      max: jobData.salary_max || 0,
      currency: "EUR"
    } : null,
    salaryRange: (jobData.salary_min && jobData.salary_max) 
      ? `${jobData.salary_min}-${jobData.salary_max}k€`
      : jobData.salary_min 
        ? `${jobData.salary_min}k€+`
        : jobData.salary_max
          ? `Jusqu'à ${jobData.salary_max}k€`
          : "Non spécifié",
    postedAt: jobData.published_at || jobData.created_at || "",
    publishedAt: jobData.published_at || jobData.created_at || "",
    description: jobData.description || "Description non disponible",
    requirements: (() => {
      const req = jobData.requirements;
      if (!req) return [];
      if (Array.isArray(req)) return req;
      if (typeof req === 'string') {
        try {
          if (req.startsWith('[') || req.startsWith('{')) {
            return JSON.parse(req);
          }
          return req.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
        } catch (e) {
          return req.split(',').map((r: string) => r.trim()).filter((r: string) => r.length > 0);
        }
      }
      return [];
    })(),
    benefits: (() => {
      const ben = jobData.benefits;
      if (!ben) return [];
      if (Array.isArray(ben)) return ben;
      if (typeof ben === 'string') {
        try {
          if (ben.startsWith('[') || ben.startsWith('{')) {
            return JSON.parse(ben);
          }
          return ben.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
        } catch (e) {
          return ben.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
        }
      }
      return [];
    })(),
    companyLogo: jobData.company?.logo || jobData.company_logo || null,
    experience: jobData.experience || "Non spécifié",
    education: jobData.education || jobData.formation_required || "Non spécifié",
    urgency: jobData.urgency || jobData.urgent ? 'high' : 'low',
    applications: jobData.applications_count || jobData.applications || 0,
    views: jobData.views || 0,
  } : null;

  const handleEdit = () => {
    // TODO: Implémenter l'édition d'offre
    toast({
      title: "Fonctionnalité à venir",
      description: "L'édition des offres sera bientôt disponible.",
      duration: 3000,
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${job?.title}" ? Cette action est irréversible.`)) {
      return;
    }

    try {
      // Utiliser apiClient pour la suppression (les cookies httpOnly seront envoyés automatiquement)
      const response = await apiClient.deleteJob(Number(jobId));

      if (response.success) {
        toast({
          title: "Offre supprimée",
          description: `L'offre "${job?.title}" a été supprimée avec succès.`,
          duration: 3000,
        });
        router.push('/company-dashboard/jobs');
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Découvrez cette offre d'emploi : ${job?.title}`,
        url: window.location.href.replace('/company-dashboard/jobs/', '/jobs/')
      });
    } else {
      // Fallback : copier le lien
      const publicUrl = window.location.href.replace('/company-dashboard/jobs/', '/jobs/');
      navigator.clipboard.writeText(publicUrl);
      toast({
        title: "Lien copié",
        description: "Le lien public de l'offre a été copié dans le presse-papiers.",
        duration: 2000,
      });
    }
  };

  if (loading) {
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

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <CompanyHeader />
        <div className="pt-20 pb-16">
          <Container>
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
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
                  {job.title}
                </Typography>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{job.company || "Entreprise"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location || "Non spécifié"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{job.contractType || job.type || "Non spécifié"}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions pour l'entreprise */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description du poste</CardTitle>
                </CardHeader>
                <CardContent>
                  <Typography variant="muted" className="whitespace-pre-wrap">
                    {job.description}
                  </Typography>
                </CardContent>
              </Card>

              {/* Exigences */}
              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Exigences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Avantages */}
              {job.benefits && job.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Avantages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Informations clés */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Salaire</span>
                    <span className="font-medium">{job.salaryRange || (job.salary ? `${job.salary.min}-${job.salary.max}k€` : "Non spécifié")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type de contrat</span>
                    <span className="font-medium">{job.contractType || job.type || "Non spécifié"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Expérience</span>
                    <span className="font-medium">{job.experience || "Non spécifié"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Télétravail</span>
                    <span className="font-medium">{job.remote ? "Oui" : "Non"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Urgence</span>
                    <Badge variant={job.urgency === 'high' ? 'destructive' : job.urgency === 'medium' ? 'default' : 'secondary'}>
                      {job.urgency === 'high' ? 'Urgent' : job.urgency === 'medium' ? 'Moyen' : 'Faible'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm text-muted-foreground">Candidatures</span>
                    </div>
                    <span className="font-medium">{job.applications || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Publié le</span>
                    </div>
                    <span className="font-medium">
                      {(() => {
                        if (!job.publishedAt) return "Date non disponible";
                        try {
                          const date = new Date(job.publishedAt);
                          if (isNaN(date.getTime())) return "Date non disponible";
                          return date.toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          });
                        } catch (e) {
                          return "Date non disponible";
                        }
                      })()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href={`/company-dashboard/applications?job=${jobId}`}>
                      <Users className="h-4 w-4 mr-2" />
                      Voir les candidatures
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/jobs/${jobId}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir l'offre publique
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
