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
        description: "Veuillez vous connecter pour postuler à cette offre",
        variant: "default"
      });
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/jobs';
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    if (canApply) {
      onOpenApplicationModal(job);
    }
  }, [canApply, job, onOpenApplicationModal, isAuthenticated, authLoading, router, toast]);

  return (
    <Card className="backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
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
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CardTitle className="text-lg">{job.title}</CardTitle>
                {canApply && !isApplied && !isWithdrawn && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <Plus className="h-3 w-3 mr-1" />
                    Disponible
                  </span>
                )}
              </div>
              <CardDescription className="text-base">
                {job.company} • {job.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleToggleBookmark}
              disabled={isSaving}
              className={isSaved ? "text-primary border-primary" : ""}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaving ? 'Sauvegarde...' : (isSaved ? 'Sauvegardée' : 'Sauvegarder')}
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleShareJob}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Partager
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

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
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
            <span>{job.postedAt}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>50-200 employés</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{job.timeAgo || job.postedAt}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleApplyToJob}
                variant="outline"
                size="sm"
                disabled={!canApply}
                className={
                  isApplied 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
                    : isWithdrawn 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200" 
                    : "bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600"
                }
              >
                {isApplied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Déjà postulé
                  </>
                ) : isWithdrawn ? (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Candidature retirée
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Postuler maintenant
                  </>
                )}
              </Button>
              <Button 
                onClick={handleViewJobDetails}
                className="flex-1"
                variant="outline"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Voir l'offre
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JobCard.displayName = 'JobCard';
