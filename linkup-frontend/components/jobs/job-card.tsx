/**
 * Composant JobCard optimisé avec React.memo
 * Évite les re-renders inutiles et améliore les performances
 */

import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Bookmark, 
  Share2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Briefcase, 
  Plus, 
  Check 
} from 'lucide-react';
import { Job } from '@/types/jobs';

// Interface Job supprimée - utilise le type centralisé de @/types/jobs

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  isApplied?: boolean;
  isWithdrawn?: boolean;
  canApply?: boolean;
  isSaving?: boolean;
  onToggleBookmark: (jobId: number) => void;
  onShareJob: (job: Job) => void;
  onViewJobDetails: (jobId: number) => void;
  onApplyToJob: (jobId: number) => void;
  onOpenApplicationModal: (job: Job) => void;
}

export const JobCard = memo<JobCardProps>(({
  job,
  isSaved,
  isApplied = false,
  isWithdrawn = false,
  canApply = true,
  isSaving = false,
  onToggleBookmark,
  onShareJob,
  onViewJobDetails,
  onApplyToJob,
  onOpenApplicationModal,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const handleToggleBookmark = useCallback(() => {
    // La vérification d'auth est déjà dans toggleBookmark du hook
    onToggleBookmark(job.id);
  }, [job.id, onToggleBookmark]);

  const handleShareJob = useCallback(() => {
    onShareJob(job);
  }, [job, onShareJob]);

  const handleViewJobDetails = useCallback(() => {
    onViewJobDetails(job.id);
  }, [job.id, onViewJobDetails]);

  const handleApplyToJob = useCallback(() => {
    // Vérifier l'authentification avant d'ouvrir le modal
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Trouvez le poste qui vous ressemble ! Connectez-vous pour postuler à cette offre.",
        variant: "default"
      });
      const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/jobs';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}&message=postuler`);
      return;
    }
    
    if (canApply) {
      onOpenApplicationModal(job);
    }
  }, [canApply, job, onOpenApplicationModal, isAuthenticated, authLoading, router, toast]);

  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex items-start space-x-2 sm:space-x-4 flex-1 min-w-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {job.companyLogo && (job.companyLogo.startsWith('http://') || job.companyLogo.startsWith('https://')) ? (
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="h-full w-full object-contain p-1"
                  onError={(e) => {
                    // Fallback si l'image ne charge pas
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback');
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`logo-fallback ${job.companyLogo && (job.companyLogo.startsWith('http://') || job.companyLogo.startsWith('https://')) ? 'hidden' : ''} h-full w-full flex items-center justify-center`}>
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-1 sm:gap-2 mb-1">
                <CardTitle className="text-base sm:text-lg truncate">{job.title}</CardTitle>
                {canApply && !isApplied && !isWithdrawn && (
                  <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 whitespace-nowrap flex-shrink-0">
                    <Plus className="h-3 w-3 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">Disponible</span>
                    <span className="sm:hidden">+</span>
                  </span>
                )}
              </div>
              <CardDescription className="text-sm sm:text-base truncate">
                {job.company} • {job.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleToggleBookmark}
              disabled={isSaving}
              className={`${isSaved ? "text-primary border-primary" : ""} px-2 sm:px-3`}
            >
              <Bookmark className={`h-4 w-4 ${isSaving || isSaved ? "mr-1 sm:mr-2" : "mr-1 sm:mr-2"} ${isSaved ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isSaving ? 'Sauvegarde...' : (isSaved ? 'Sauvegardée' : 'Sauvegarder')}</span>
              <span className="sm:hidden">{isSaving ? '...' : (isSaved ? '✓' : '')}</span>
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleShareJob}
              className="px-2 sm:px-3"
            >
              <Share2 className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Partager</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground line-clamp-2">
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {(job.requirements || []).slice(0, 3).map((req, index) => (
              <span
                key={`req-${index}-${req.slice(0, 10)}`}
                className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded"
              >
                {req}
              </span>
            ))}
            {(job.requirements || []).length > 3 && (
              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                +{(job.requirements || []).length - 3} autres
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{job.type}</span>
              </div>
              {job.remote && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Remote</span>
                </div>
              )}
              {job.salary && job.salary.min && job.salary.max && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
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
            <span className="text-xs sm:text-sm whitespace-nowrap">{job.postedAt}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t gap-3 sm:gap-2">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">50-200 employés</span>
                <span className="sm:hidden">50-200</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">{job.timeAgo || job.postedAt}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                onClick={handleApplyToJob}
                variant="outline"
                size="sm"
                disabled={!canApply}
                className={`w-full sm:w-auto ${
                  isApplied 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
                    : isWithdrawn 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
                    : "bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600"
                }`}
              >
                {isApplied ? (
                  <>
                    <Check className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Déjà postulé</span>
                    <span className="sm:hidden">Postulé</span>
                  </>
                ) : isWithdrawn ? (
                  <>
                    <Users className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Candidature retirée</span>
                    <span className="sm:hidden">Retirée</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Postuler maintenant</span>
                    <span className="sm:hidden">Postuler</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={handleViewJobDetails}
                className="w-full sm:flex-1"
                variant="outline"
                size="sm"
              >
                <Briefcase className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Voir l'offre</span>
                <span className="sm:hidden">Voir</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JobCard.displayName = 'JobCard';
