/**
 * Types globaux pour l'application LinkUp
 * Respect des principes SOLID - Interface Segregation Principle
 */

// Types de base pour l'utilisateur
export interface User {
  id_user: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'user' | 'company' | 'admin';
  avatar?: string;
  title?: string;
  company?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  created_at?: string;
  birth_date?: string;
  phone?: string;
}

// Types pour l'expérience professionnelle
export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

// Types pour l'éducation
export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

// Types pour les offres d'emploi - Interface Job supprimée
// Utilise maintenant le type centralisé de @/types/jobs

// Types pour les posts/réseau
export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

// Types pour la navigation
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

// Types pour les composants UI
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

// Types pour les thèmes
export type Theme = 'light' | 'dark' | 'system';

// Types pour les états de chargement
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Types pour les préférences de confidentialité
export interface PrivacyPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  required?: boolean;
  category?: string;
}

export interface PrivacyPreferences {
  dataCollection: PrivacyPreference[];
  communication: PrivacyPreference[];
  profile: PrivacyPreference[];
  security: PrivacyPreference[];
}

export interface PrivacySectionProps {
  title: string;
  description?: string;
  preferences: PrivacyPreference[];
  onPreferenceChange?: (id: string, enabled: boolean) => void;
  className?: string;
}

export interface PrivacyHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  onSavePreferences?: () => void;
  onResetToDefaults?: () => void;
  className?: string;
}