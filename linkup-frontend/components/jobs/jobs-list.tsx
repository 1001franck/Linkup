/**
 * Composant JobsList pour la page Jobs
 * Gère l'affichage de la liste des emplois avec filtrage et pagination
 */

import React from 'react';
import { JobCard } from './job-card';
import { JobSkeletonList } from './job-skeleton';
import { NoResultsState } from './error-states';
import { Job, JobInteractionsState, JobInteractionsActions } from '@/types/jobs';

interface JobsListProps {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  interactions: JobInteractionsState;
  actions: JobInteractionsActions;
  onViewJobDetails: (jobId: number) => void;
  onClearFilters: () => void;
  onNewSearch: () => void;
  onOpenApplicationModal: (job: Job) => void;
}

export const JobsList: React.FC<JobsListProps> = ({
  jobs,
  loading,
  error,
  interactions,
  actions,
  onViewJobDetails,
  onClearFilters,
  onNewSearch,
  onOpenApplicationModal,
}) => {
  // Skeleton de chargement
  if (loading) {
    return <JobSkeletonList count={3} />;
  }

  // État d'erreur
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-muted-foreground mb-4">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Aucun résultat
  if (jobs.length === 0) {
    return (
      <div className="animate-fade-in">
        <NoResultsState 
          onClearFilters={onClearFilters}
          onNewSearch={onNewSearch}
        />
      </div>
    );
  }

  // Liste des emplois
  return (
    <div className="space-y-6 animate-fade-in">
      {jobs.map((job, index) => (
        <div 
          key={job.id || job.id_job_offer || `job-${index}`}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <JobCard
            job={job}
            isSaved={actions.isSaved(job.id)}
            isApplied={actions.isApplied(job.id)}
            isWithdrawn={actions.isWithdrawn(job.id)}
            canApply={actions.canApply(job.id)}
            isSaving={interactions.savedJobsLoading}
            onToggleBookmark={actions.toggleBookmark}
            onShareJob={actions.shareJob}
            onViewJobDetails={onViewJobDetails}
            onApplyToJob={actions.applyToJob}
            onOpenApplicationModal={onOpenApplicationModal}
          />
        </div>
      ))}
    </div>
  );
};
