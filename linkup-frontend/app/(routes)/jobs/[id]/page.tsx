/**
 * Page de détail d'une offre d'emploi LinkUp
 * Respect des principes SOLID :
 * - Single Responsibility : Gestion unique du détail d'une offre
 * - Open/Closed : Extensible via props et composition
 * - Interface Segregation : Props spécifiques et optionnelles
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { useToast } from "@/hooks/use-toast";
import { useJobsInteractions } from "@/hooks/use-jobs-interactions";
import { useJob, useApplyToJob } from "@/hooks/use-api";
import { useAuth } from "@/contexts/AuthContext";
import { Job } from "@/types/jobs";
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Building, 
  Share2,
  Bookmark,
  Users,
  DollarSign,
  ExternalLink,
  X,
  RefreshCw,
  Search,
  Briefcase,
  GraduationCap,
  Calendar,
  Check
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
  // Utiliser le hook centralisé pour les interactions
  const { state: interactionsState, actions: interactionsActions } = useJobsInteractions();
  
  // Hook pour postuler à une offre
  const { mutate: applyToJobMutation, isLoading: isApplying } = useApplyToJob();

  // Récupérer le job depuis l'API
  const jobId = parseInt(params.id as string);
  const { data: jobResponse, loading, error } = useJob(isNaN(jobId) ? null : jobId);
  
  // Transformer les données API vers le format frontend
  const job: Job | null = jobResponse?.data ? {
    id: jobResponse.data.id_job_offer || jobResponse.data.id,
    title: jobResponse.data.title || "Titre non disponible",
    company: jobResponse.data.company || "Entreprise non disponible",
    companyId: jobResponse.data.id_company || jobResponse.data.companyId || 1,
    location: jobResponse.data.location || "Localisation non disponible",
    type: jobResponse.data.contract_type || "Type non spécifié",
    remote: jobResponse.data.remote === "true" || jobResponse.data.remote === true,
    salary: (jobResponse.data.salary_min || jobResponse.data.salary_max) ? {
      min: jobResponse.data.salary_min || 0,
      max: jobResponse.data.salary_max || 0,
      currency: "EUR"
    } : null,
    postedAt: jobResponse.data.published_at ? 
      new Date(jobResponse.data.published_at).toLocaleDateString('fr-FR') : 
      "Date non disponible",
    timeAgo: jobResponse.data.timeAgo || "Temps non disponible",
    description: jobResponse.data.description || "Description non disponible",
    requirements: jobResponse.data.requirements ? 
      (Array.isArray(jobResponse.data.requirements) ? jobResponse.data.requirements : 
       JSON.parse(jobResponse.data.requirements)) : [],
    benefits: jobResponse.data.benefits ? 
      (Array.isArray(jobResponse.data.benefits) ? jobResponse.data.benefits : 
       JSON.parse(jobResponse.data.benefits)) : [],
    companyLogo: jobResponse.data.company_logo || "/api/placeholder/60/60",
    experience: jobResponse.data.experience || "Non spécifié",
    education: jobResponse.data.education || "Non spécifié"
  } : (error ? {
    // Fallback avec données mock en cas d'erreur API
    id: jobId,
    title: "Développeur Frontend React",
    company: "TechCorp",
    companyId: 1,
    location: "Paris, France",
    type: "CDI",
    remote: true,
    salary: { min: 45000, max: 65000, currency: "EUR" },
    postedAt: "Il y a 2 jours",
    description: "Nous recherchons un développeur Frontend passionné...",
    requirements: ["React", "TypeScript", "CSS3", "3+ ans d'expérience"],
    benefits: ["Télétravail", "Mutuelle", "Tickets restaurant", "Formation"],
    companyLogo: "/api/placeholder/60/60",
    experience: "3-5 ans",
    education: "Bac+3 minimum"
  } : null);

  // L'API est maintenant gérée par le hook useJob

  // Utiliser les actions centralisées du hook useJobsInteractions
  // Note: toggleFavorite supprimé car le système de favoris a été retiré

  const handleToggleBookmark = () => {
    // La vérification d'auth est déjà dans toggleBookmark du hook
    const jobId = parseInt(params.id as string);
    interactionsActions.toggleBookmark(jobId);
  };

  const handleShareJob = async () => {
    if (!job) return;
    await interactionsActions.shareJob(job);
  };

  const applyToJob = () => {
    // Vérifier l'authentification avant d'ouvrir le modal
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour postuler à cette offre",
        variant: "default"
      });
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/jobs/${jobId}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setShowApplicationModal(true);
  };

  const submitApplication = () => {
    if (!job) return;
    
    applyToJobMutation(job.id, {
      onSuccess: () => {
        toast({
          title: "Candidature envoyée",
          description: "Votre candidature a été envoyée avec succès",
          variant: "default"
        });
        setShowApplicationModal(false);
        // Mettre à jour l'état local
        interactionsActions.applyToJob(job.id);
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error.message || "Impossible d'envoyer la candidature",
          variant: "destructive"
        });
      }
    });
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Typography variant="h2">Chargement...</Typography>
      </div>
    );
  }

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container>
          <div className="py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                <Typography variant="h4" className="text-xl font-semibold mb-2">
                  Chargement de l'offre...
                </Typography>
                <Typography variant="muted">
                  Veuillez patienter pendant que nous récupérons les détails de l'offre.
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container>
          <div className="py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <Typography variant="h4" className="text-xl font-semibold mb-2 text-red-600">
                  Erreur de chargement
                </Typography>
                <Typography variant="muted" className="mb-6">
                  {error}
                </Typography>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.reload()} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                  <Button onClick={() => router.push('/jobs')} variant="default">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux offres
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-primary/5">
        <Container>
          <div className="py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <Typography variant="h4" className="text-xl font-semibold mb-2">
                  Offre non trouvée
                </Typography>
                <Typography variant="muted" className="mb-6">
                  Cette offre d'emploi n'existe pas ou a été supprimée.
                </Typography>
                <Button onClick={() => router.push('/jobs')} variant="default">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux offres
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 py-12">
        <Container>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Typography variant="h1" className="text-3xl font-bold">
              Détail de l'offre
            </Typography>
          </div>
        </Container>
      </section>

      {/* Job Details */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-2xl">{job.title}</CardTitle>
                        </div>
                        <CardDescription className="text-lg">
                          {job.company} • {job.location}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                          {job.remote && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>Remote</span>
                            </div>
                          )}
                          {job.salary && job.salary.min && job.salary.max && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>
                                {job.salary.min > 0 && job.salary.max > 0 
                                  ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ${job.salary.currency}`
                                  : job.salary.min > 0 
                                    ? `À partir de ${job.salary.min.toLocaleString()} ${job.salary.currency}`
                                    : `Jusqu'à ${job.salary.max.toLocaleString()} ${job.salary.currency}`
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleToggleBookmark}
                        className={interactionsActions.isSaved(job.id) ? "text-blue-500 hover:text-blue-600" : "hover:text-blue-500"}
                      >
                        <Bookmark className={`h-5 w-5 ${interactionsActions.isSaved(job.id) ? "fill-current" : ""}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleShareJob}
                        className="hover:text-green-500"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description du poste</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {job.description ? job.description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    )) : (
                      <p className="text-muted-foreground">Description non disponible</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Compétences requises</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Avantages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {job.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Button */}
              <Card>
                <CardContent className="p-6">
                  <Button 
                    className="w-full mb-4"
                    size="lg"
                    onClick={applyToJob}
                  >
                    Postuler maintenant
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Publié {job.postedAt}
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>À propos de l'entreprise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <Building className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <Typography variant="small" className="font-medium">
                        {job.company}
                      </Typography>
                      <div className="flex items-center space-x-1">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Entreprise</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Taille non spécifiée</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Voir l'entreprise
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Job Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Détails du poste</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Expérience : {job.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Formation : {job.education}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Type : {job.type}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <Typography variant="h3">Postuler à cette offre</Typography>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowApplicationModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <Typography variant="h4" className="mb-2">{job.title}</Typography>
                <Typography variant="muted">{job.company}</Typography>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <Typography variant="small" className="font-medium mb-1">
                    Votre CV sera automatiquement envoyé
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Assurez-vous que votre CV est à jour dans votre profil
                  </Typography>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <Typography variant="small" className="font-medium mb-1">
                    Lettre de motivation (optionnelle)
                  </Typography>
                  <textarea 
                    className="w-full h-20 p-2 border border-input bg-background rounded-md text-sm resize-none"
                    placeholder="Expliquez pourquoi vous êtes intéressé par ce poste..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowApplicationModal(false)}>
                  Annuler
                </Button>
                <Button onClick={submitApplication} disabled={isApplying}>
                  {isApplying ? "Envoi en cours..." : "Envoyer ma candidature"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
