/**
 * ========================================
 * TYPES DE BASE DE DONNÉES - DATABASE.TS
 * ========================================
 * 
 * 🎯 OBJECTIF :
 * Définition des types TypeScript pour la base de données
 * Structure des données utilisateur et des réponses API
 * Préparation pour l'intégration backend
 * 
 * 🏗️ ARCHITECTURE :
 * - Types stricts pour la sécurité des données
 * - Interfaces cohérentes avec le backend
 * - Support des rôles utilisateur multiples
 * - Types pour les formulaires et l'état
 * 
 * 🚀 INTÉGRATION BACKEND :
 * - Correspondance exacte avec les modèles backend
 * - Types des requêtes et réponses API
 * - Gestion des tokens d'authentification
 * - Validation des données côté client
 * 
 * 📱 UTILISATION :
 * - Typage des composants React
 * - Validation des formulaires
 * - Gestion de l'état d'authentification
 * - Types des réponses API
 */

// ========================================
// TYPES DE BASE - ENTITÉS PRINCIPALES
// ========================================

/**
 * Interface utilisateur de base
 * Correspond au modèle User de la base de données
 * 
 * @interface User
 */
export interface User {
  /** Identifiant unique de l'utilisateur */
  id_user: string;
  /** Prénom de l'utilisateur */
  firstname: string;
  /** Nom de famille de l'utilisateur */
  lastname: string;
  /** Email de l'utilisateur (unique) */
  email: string;
  /** Hash du mot de passe (côté backend uniquement) */
  password_hash: string;
  /** Rôle de l'utilisateur */
  role: 'user' | 'company' | 'admin';
  /** Date de création du compte */
  created_at: Date;
  /** Date de naissance (optionnel) */
  birth_date?: string;
  /** Numéro de téléphone (optionnel) */
  phone?: string;
}

/**
 * Interface des rôles utilisateur
 * Définit les types de rôles disponibles
 * 
 * @interface Role
 */
export interface Role {
  /** Identifiant unique du rôle */
  id: string;
  /** Nom du rôle : user, company, ou admin */
  name: 'user' | 'company' | 'admin';
  /** Date de création du rôle */
  created_at: Date;
}

/**
 * Interface du profil utilisateur
 * Informations détaillées du profil utilisateur
 * 
 * @interface UserProfile
 */
export interface UserProfile {
  /** ID de l'utilisateur associé */
  user_id: string;
  /** URL de la photo de profil (optionnel) */
  profile_picture?: string;
  /** URL de la bannière de profil (optionnel) */
  banner_picture?: string;
  /** Bio courte (max 200 caractères) */
  bio?: string;
  /** Description détaillée du profil */
  description?: string;
  /** Liste des compétences */
  skills: string[];
  /** Localisation de l'utilisateur */
  location?: string;
  /** Titre du poste actuel */
  job_title?: string;
  /** Niveau d'expérience */
  experience_level?: 'Junior' | 'Intermédiaire' | 'Senior';
  /** Lien vers le portfolio */
  portfolio_link?: string;
  /** Lien vers le profil LinkedIn */
  linkedin_link?: string;
  /** Disponibilité pour un emploi */
  availability: boolean;
  /** Date de création du profil */
  created_at: Date;
  /** Date de dernière mise à jour */
  updated_at: Date;
}

// ========================================
// TYPES POUR LES FORMULAIRES
// ========================================

/**
 * Interface pour les données d'inscription
 * 
 * @interface RegisterFormData
 */
export interface RegisterFormData {
  /** Prénom de l'utilisateur */
  firstname: string;
  /** Nom de famille de l'utilisateur */
  lastname: string;
  /** Email de l'utilisateur */
  email: string;
  /** Mot de passe */
  password: string;
  /** Confirmation du mot de passe */
  confirmPassword: string;
  /** Acceptation des conditions d'utilisation */
  acceptTerms: boolean;
  /** Date de naissance (optionnel) */
  birth_date?: string;
  /** Numéro de téléphone (optionnel) */
  phone?: string;
}

/**
 * Interface pour les données de connexion
 * 
 * @interface LoginFormData
 */
export interface LoginFormData {
  /** Email de l'utilisateur */
  email: string;
  /** Mot de passe */
  password: string;
  /** Se souvenir de moi */
  rememberMe: boolean;
}

/**
 * Interface pour les données du profil
 * 
 * @interface ProfileFormData
 */
export interface ProfileFormData {
  /** URL de la photo de profil */
  profile_picture?: string;
  /** URL de la bannière de profil */
  banner_picture?: string;
  /** Bio courte */
  bio?: string;
  /** Description détaillée */
  description?: string;
  /** Liste des compétences */
  skills: string[];
  /** Localisation */
  location?: string;
  /** Titre du poste */
  job_title?: string;
  /** Niveau d'expérience */
  experience_level?: 'Junior' | 'Intermédiaire' | 'Senior';
  /** Lien vers le portfolio */
  portfolio_link?: string;
  /** Lien vers LinkedIn */
  linkedin_link?: string;
  /** Disponibilité */
  availability: boolean;
}

// ========================================
// TYPES POUR L'ÉTAT DE L'APPLICATION
// ========================================

/**
 * Interface pour l'état d'authentification
 * 
 * @interface AuthState
 */
export interface AuthState {
  /** Utilisateur actuellement connecté */
  user: User | null;
  /** Profil de l'utilisateur */
  profile: UserProfile | null;
  /** État d'authentification */
  isAuthenticated: boolean;
  /** État de chargement */
  isLoading: boolean;
}

// ========================================
// TYPES POUR LES RÉPONSES API
// ========================================

/**
 * Interface générique pour les réponses API
 * 
 * @interface ApiResponse
 * @template T - Type des données retournées
 */
export interface ApiResponse<T> {
  /** Indique si la requête a réussi */
  success: boolean;
  /** Données retournées (optionnel) */
  data?: T;
  /** Message de succès (optionnel) */
  message?: string;
  /** Message d'erreur (optionnel) */
  error?: string;
}

/**
 * Interface pour la réponse de connexion
 * 
 * @interface LoginResponse
 */
export interface LoginResponse {
  /** Données utilisateur */
  user: User;
  /** Profil utilisateur (optionnel) */
  profile: UserProfile | null;
  /** Token d'authentification */
  token: string;
}

/**
 * Interface pour la réponse d'inscription
 * 
 * @interface RegisterResponse
 */
export interface RegisterResponse {
  /** Données utilisateur créé */
  user: User;
  /** Message de confirmation */
  message: string;
}
