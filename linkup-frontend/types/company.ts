/**
 * Types centralisés pour les entreprises
 * Interface unique pour éviter la duplication
 */

// Interface pour les données API brutes (backend)
export interface ApiCompany {
  Id_company?: number;
  id_company?: number;
  name: string;
  industry?: string;
  city?: string;
  country?: string;
  employees_number?: string;
  description: string;
  created_at: string;
  website?: string;
  logo?: string; // URL du logo stocké dans la base de données
  jobsAvailable?: number; // Nombre d'offres actives calculé par le backend
  founded?: string; // Année de création calculée par le backend (legacy)
  founded_year?: number; // Année de fondation réelle de l'entreprise (renseignée par l'entreprise)
  location?: string; // Localisation calculée par le backend
  benefits?: string[]; // Avantages agrégés depuis les offres d'emploi
}

// Interface frontend pour les entreprises (format transformé)
export interface Company {
  id: number;
  id_company: number; // ID pour le backend (compatibilité)
  name: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  jobsAvailable: number;
  founded: string;
  website: string;
  logo: string;
  benefits: string[];
}

// Interface pour les statistiques d'entreprise
export interface CompanyStats {
  name: string;
  jobs: number;
}

// Interface pour les filtres d'entreprise
export interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  city?: string;
}

// Interface pour les interactions d'entreprise
export interface CompanyInteractions {
  selectedCompany: Company | null;
  showCompanyModal: boolean;
  showContactModal: boolean;
  isSubmittingContact: boolean;
}

// Interface pour le formulaire de contact
export interface ContactForm {
  name: string;
  email: string;
  message: string;
}