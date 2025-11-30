/**
 * Types TypeScript stricts pour la section Jobs
 * Définit toutes les interfaces et types utilisés dans la gestion des emplois
 */

// ========================================
// TYPES DE BASE
// ========================================

export interface Job {
  id: number;
  title: string;
  company: string;
  companyId: number;
  location: string;
  type: string;
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  } | null;
  postedAt: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  companyLogo?: string;
  // Champs supplémentaires pour compatibilité API
  id_job_offer?: string;
  id_company?: string;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  experience?: string;
  industry?: string;
  published_at?: string;
  views?: number;
  skills?: string[];
  timeAgo?: string;
  education?: string; // Formation requise
  urgency?: string; // Urgence de l'offre
  applications?: number; // Nombre de candidatures
  contractType?: string; // Type de contrat (alias pour type)
  salaryRange?: string; // Plage de salaire formatée
  publishedAt?: string; // Date de publication (alias pour postedAt)
}

export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  rating: number;
  jobsAvailable: number;
  founded: string;
  website: string;
  logo: string;
  benefits: string[];
  lastActive: string;
}

export interface CompanyStats {
  name: string;
  jobs: number;
}

// ========================================
// TYPES POUR LES FILTRES
// ========================================

export interface JobsFilters {
  search: string;
  location: string;
  contractType: string;
  company: string | null;
}


// ========================================
// TYPES POUR LES INTERACTIONS
// ========================================

export interface JobInteractionsState {
  savedJobs: Set<number>;
  appliedJobs: Set<number>;
  savedJobsLoading: boolean;
}

export interface JobInteractionsActions {
  toggleBookmark: (jobId: number) => void;
  applyToJob: (jobId: number) => void;
  shareJob: (job: Job) => Promise<void>;
  isSaved: (jobId: number) => boolean;
  isApplied: (jobId: number) => boolean;
  isWithdrawn: (jobId: number) => boolean;
  canApply: (jobId: number) => boolean;
}

// ========================================
// TYPES POUR LES DONNÉES
// ========================================

export interface JobsDataState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  topCompanies: CompanyStats[];
  pagination?: PaginationState;
}

export interface JobsDataActions {
  retry: () => void;
}

// ========================================
// TYPES POUR LES COMPOSANTS
// ========================================

export interface JobCardProps {
  job: Job;
  isFavorite: boolean;
  isSaved: boolean;
  isFollowingCompany: boolean;
  onToggleFavorite: (jobId: number) => void;
  onToggleBookmark: (jobId: number) => void;
  onShareJob: (job: Job) => void;
  onViewJobDetails: (jobId: number) => void;
  onToggleFollowCompany: (companyId: number) => void;
}

// JobSkeletonProps supprimé car inutilisé (le composant JobSkeleton n'utilise pas ce type)

export interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onGoHome?: () => void;
}

export interface NoResultsStateProps {
  onClearFilters?: () => void;
  onNewSearch?: () => void;
}

// ========================================
// TYPES POUR LES OPTIONS
// ========================================

export interface LocationOption {
  value: string;
  label: string;
  category: 'city' | 'region' | 'remote' | 'type';
}

export interface ContractTypeOption {
  value: string;
  label: string;
  description?: string;
}

export interface IndustryOption {
  value: string;
  label: string;
  icon?: string;
}

// ========================================
// TYPES POUR LES ÉTATS DE CHARGEMENT
// ========================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStateData {
  state: LoadingState;
  error?: string;
  retryCount?: number;
}

// ========================================
// TYPES POUR LES ACTIONS
// ========================================

export type JobAction = 
  | { type: 'TOGGLE_FAVORITE'; payload: { jobId: number } }
  | { type: 'TOGGLE_BOOKMARK'; payload: { jobId: number } }
  | { type: 'TOGGLE_FOLLOW_COMPANY'; payload: { companyId: number } }
  | { type: 'SHARE_JOB'; payload: { job: Job } }
  | { type: 'VIEW_JOB_DETAILS'; payload: { jobId: number } };

export type FilterAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_CONTRACT_TYPE'; payload: string }
  | { type: 'SET_COMPANY_FILTER'; payload: string | null }
  | { type: 'CLEAR_ALL_FILTERS' };

// ========================================
// TYPES POUR LES ÉVÉNEMENTS
// ========================================

export interface JobEvent {
  type: 'view' | 'favorite' | 'bookmark' | 'share' | 'apply' | 'follow_company';
  jobId: number;
  companyId?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface FilterEvent {
  type: 'search' | 'filter' | 'clear';
  filters: JobsFilters;
  timestamp: Date;
  resultCount?: number;
}

// ========================================
// TYPES POUR LA PAGINATION
// ========================================

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setItemsPerPage: (count: number) => void;
}

// ========================================
// TYPES POUR LES MÉTADONNÉES
// ========================================

export interface JobMetadata {
  viewCount: number;
  favoriteCount: number;
  applicationCount: number;
  lastViewed?: Date;
  isRecommended?: boolean;
  matchScore?: number;
}


// ========================================
// TYPES POUR LES RÉSULTATS DE RECHERCHE
// ========================================

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: JobsFilters;
  suggestions?: string[];
  relatedSearches?: string[];
}

export interface JobSearchResult extends SearchResult<Job> {
  topCompanies: CompanyStats[];
  featuredJobs: Job[];
  recentSearches?: string[];
}

// ========================================
// TYPES POUR LES PRÉFÉRENCES
// ========================================

export interface UserJobPreferences {
  preferredLocations: string[];
  preferredContractTypes: string[];
  preferredIndustries: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  remotePreference: 'none' | 'partial' | 'full';
  notifications: {
    newJobs: boolean;
    priceDrops: boolean;
    companyUpdates: boolean;
  };
}

// ========================================
// TYPES POUR LES ANALYTICS
// ========================================

export interface JobAnalytics {
  totalViews: number;
  uniqueViews: number;
  averageViewTime: number;
  conversionRate: number;
  topSearches: Array<{
    term: string;
    count: number;
  }>;
  popularFilters: Array<{
    filter: string;
    value: string;
    count: number;
  }>;
}
