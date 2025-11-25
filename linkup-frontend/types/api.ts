/**
 * Types TypeScript pour l'API Backend
 * Correspondance exacte avec la base de données
 */

// Types de base
export interface User {
  id_user: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  bio_pro?: string;
  city?: string;
  website?: string;
  country?: string;
  connexion_index?: number;
  profile_views?: number;
  applies_index?: number;
  private_visibility?: boolean;
  created_at: string;
  role: string;
}

export interface Company {
  Id_company: number;
  name: string;
  description: string;
  website?: string;
  created_at: string;
  industry?: string;
  employees_number?: string;
  recruiter_firstname?: string;
  recruiter_phone?: string;
  recruiter_mail?: string;
  recruiter_lastname?: string;
  city?: string;
  zip_code?: string;
  country?: string;
}

export interface JobOffer {
  // Champs mappés depuis le backend enrichi
  id: number;                    // id_job_offer → id
  title: string;
  description: string;
  location: string;
  type: string;                  // contract_type → type
  postedAt: string;              // published_at → postedAt (formaté)
  remote: boolean;               // remote → boolean
  salary: { min: number; max: number; currency: string } | null; // Objet salary calculé
  requirements: string[];        // Array des exigences
  benefits: string[];            // Array des avantages
  company: string;               // Nom de l'entreprise (depuis JOIN)
  companyId: number;             // id_company → companyId
  companyLogo: string | null;    // Logo de l'entreprise (depuis JOIN)
  
  // Champs supplémentaires
  experience?: string;
  industry?: string;
  contract_duration?: string;
  working_time?: string;
  formation_required?: string;
  urgency?: string;
  education?: string;
  
  // Champs de compatibilité
  views?: number;
  created_by?: any;
  skills?: string[];
  timeAgo?: string;
}

export interface Application {
  Id_user: number;
  Id_job_offer: number;
  application_date: string;
  status: string;
  user?: User;
  job_offer?: JobOffer;
}

export interface Message {
  Id_message: number;
  content: string;
  send_at: string;
  id_receiver: number;
  id_sender: number;
  sender?: User;
  receiver?: User;
}

export interface UserFile {
  Id_user_files: number;
  file_type: string;
  file_url: string;
  uploaded_at: string;
  Id_user: number;
}

export interface SavedJob {
  Id_user: number;
  Id_job_offer: number;
  saved_at: string;
  job_offer?: JobOffer;
}

// Types pour les requêtes
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CompanyLoginRequest {
  recruiter_mail: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  phone: string;
  firstname: string;
  lastname: string;
}

export interface CompanySignupRequest {
  name: string;
  description: string;
  industry: string;
  password: string;
  recruiter_mail: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  location: string;
  contract_type: string;
  id_company: number;
  salary_min?: number;
  salary_max?: number;
  remote?: string;
  experience?: string;
  industry?: string;
}

export interface CreateCompanyRequest {
  name: string;
  description: string;
  industry?: string;
  website?: string;
  city?: string;
  country?: string;
}

export interface SendMessageRequest {
  id_receiver: number;
  content: string;
}

export interface ApplyJobRequest {
  id_job_offer: number;
}

export interface SaveJobRequest {
  id_job_offer: number;
}

// Types pour les réponses
export interface AuthResponse {
  token: string;
  user?: User;
  company?: Company;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

export interface ApplicationsResponse {
  data: Application[];
}

// Types pour les filtres et recherche
export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  industry?: string;
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  remote?: boolean;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  industry?: string;
}

export interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  city?: string;
}

// Types pour les statuts
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
export type UserRole = 'user' | 'company' | 'admin';
export type ContractType = 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Alternance';
export type FileType = 'pdf' | 'photo';

// Types pour les conversations
export interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

// Types pour les statistiques
export interface UserStats {
  profile_views: number;
  connexion_index: number;
  applies_index: number;
  applications_count: number;
  saved_jobs_count: number;
}

export interface CompanyStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  interviewsScheduled: number;
  hiredCandidates: number;
  recentApplications: any[];
  activeJobsList: any[];
  generatedAt: string;
  companyId: number;
}

export interface AdminStats {
  total_users: number;
  total_companies: number;
  total_jobs: number;
  total_applications: number;
  recent_signups: number;
  recent_jobs: number;
}

// Types pour les notifications (à implémenter plus tard)
export interface Notification {
  id: number;
  type: 'job_match' | 'message' | 'connection' | 'application' | 'event' | 'profile_view';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

// Types pour les erreurs
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
