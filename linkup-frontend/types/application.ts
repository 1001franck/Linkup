/**
 * Types pour la gestion des candidatures - LinkUp
 * Architecture modulaire pour une meilleure maintenabilité
 */

// ========================================
// TYPES DE BASE
// ========================================

export type ApplicationStatus = "pending" | "interview" | "accepted" | "rejected" | "withdrawn";
export type UrgencyLevel = "low" | "medium" | "high";
export type DocumentType = "cv" | "cover_letter" | "portfolio";

// ========================================
// TYPES POUR LES DOCUMENTS
// ========================================

export interface Document {
  name: string;
  url: string;
  uploadedAt: string;
}

export interface ApplicationDocuments {
  cv: Document | null;
  coverLetter: Document | null;
  portfolio: Document | null;
}

// ========================================
// TYPES POUR L'ENTREPRISE
// ========================================

export interface CompanyInfo {
  id: string;
  name: string;
  logo: string;
  website?: string;
  industry?: string;
  city?: string;
  country?: string;
  recruiterName?: string;
  recruiterEmail?: string;
}

// ========================================
// TYPES POUR L'OFFRE D'EMPLOI
// ========================================

export interface JobOfferInfo {
  id: string;
  title: string;
  description: string;
  location: string;
  contractType: string;
  salaryRange: string;
  requirements: string[];
  benefits: string[];
  experience: string;
  education: string;
  remote: boolean;
  urgency: UrgencyLevel;
}

// ========================================
// TYPES POUR LES MÉTADONNÉES
// ========================================

export interface ApplicationMetadata {
  id: string;
  status: ApplicationStatus;
  isArchived: boolean;
  isBookmarked: boolean;
  appliedDate: string;
  interviewDate?: string;
  notes?: string;
}

// ========================================
// INTERFACE PRINCIPALE MODULAIRE
// ========================================

export interface Application {
  // Métadonnées de base
  metadata: ApplicationMetadata;
  
  // Informations sur l'entreprise
  company: CompanyInfo;
  
  // Informations sur l'offre d'emploi
  jobOffer: JobOfferInfo;
  
  // Documents joints
  documents: ApplicationDocuments;
}

// ========================================
// TYPES POUR LES ACTIONS
// ========================================

export interface ApplicationActions {
  withdrawApplication: (applicationId: string) => void;
  requestFeedback: (applicationId: string) => void;
  toggleArchive: (applicationId: string) => void;
  viewInterviewDetails: (applicationId: string) => void;
}

// ========================================
// TYPES POUR LES FILTRES
// ========================================

export interface ApplicationFilters {
  searchTerm: string;
  selectedFilter: string;
  showRecentFirst: boolean;
  showArchived: boolean;
}

// ========================================
// TYPES POUR LA PAGINATION
// ========================================

export interface ApplicationPagination {
  currentPage: number;
  applicationsPerPage: number;
  totalPages: number;
  totalItems: number;
}

// ========================================
// TYPES POUR LES STATISTIQUES
// ========================================

export interface ApplicationStats {
  total: number;
  pending: number;
  interview: number;
  accepted: number;
  rejected: number;
  bookmarked: number;
}

// ========================================
// TYPES POUR LES ÉTATS D'AFFICHAGE
// ========================================

export interface ApplicationDisplayState {
  expandedApplication: string | null;
  showDocumentUpload: string | null;
  confirmationModal: {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "default" | "warning" | "danger" | "success" | "info";
    confirmText?: string;
    cancelText?: string;
  };
}

// ========================================
// TYPES POUR LES UTILITAIRES
// ========================================

export interface ApplicationUtils {
  getStatusIcon: (status: ApplicationStatus) => React.ReactElement;
  getStatusLabel: (status: ApplicationStatus) => string;
  getStatusColor: (status: ApplicationStatus) => string;
  getUrgencyColor: (urgency: UrgencyLevel) => string;
  parseDate: (dateString: string) => Date;
}
