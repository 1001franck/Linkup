/**
 * Transformateur centralisé pour les données d'entreprises
 * Optimisé pour la performance et la cohérence
 */

import { ApiCompany, Company } from '@/types/company';

/**
 * Valeurs par défaut pour éviter la répétition
 */
const DEFAULT_VALUES = {
  name: "Nom non disponible",
  industry: "Secteur non spécifié", 
  location: "Localisation non disponible",
  size: "Taille non spécifiée",
  description: "Description non disponible",
  founded: "Année non disponible",
  website: "",
  benefits: [] as string[],
  jobsAvailable: 0
} as const;

/**
 * Génère un logo placeholder optimisé
 * Retourne null pour utiliser les initiales directement dans le composant
 * au lieu d'essayer de charger une image externe
 */
const generateLogoUrl = (name: string): string | null => {
  // Retourner null pour utiliser les initiales directement dans le composant
  // au lieu d'essayer de charger une image externe depuis via.placeholder.com
  return null;
};

/**
 * Extrait l'ID de l'entreprise de manière robuste
 */
const extractCompanyId = (apiCompany: ApiCompany): number => {
  return apiCompany.Id_company || apiCompany.id_company || 0;
};

/**
 * Détermine la localisation de l'entreprise
 */
const determineLocation = (apiCompany: ApiCompany): string => {
  // Priorité : location > city > country
  if (apiCompany.location) return apiCompany.location;
  if (apiCompany.city) return apiCompany.city;
  if (apiCompany.country) return apiCompany.country;
  return DEFAULT_VALUES.location;
};

/**
 * Détermine l'année de fondation
 * Priorité : founded_year (renseigné par l'entreprise) > founded (legacy) > created_at (fallback)
 */
const determineFoundedYear = (apiCompany: ApiCompany): string => {
  // Priorité 1 : founded_year (champ renseigné par l'entreprise)
  if (apiCompany.founded_year) {
    const year = parseInt(apiCompany.founded_year);
    if (!isNaN(year) && year >= 1800) {
      return year.toString();
    }
  }
  
  // Priorité 2 : founded (legacy, si présent)
  if (apiCompany.founded) return apiCompany.founded;
  
  // Priorité 3 : created_at (date de création du compte - fallback uniquement)
  if (apiCompany.created_at) {
    try {
      const year = new Date(apiCompany.created_at).getFullYear();
      if (!isNaN(year) && year > 1900) {
        return year.toString();
      }
    } catch (error) {
      console.warn('Erreur lors de l\'extraction de l\'année:', error);
    }
  }
  
  return DEFAULT_VALUES.founded;
};

/**
 * Valide et nettoie les avantages
 */
const sanitizeBenefits = (benefits: any): string[] => {
  if (!benefits) return DEFAULT_VALUES.benefits;
  
  if (Array.isArray(benefits)) {
    return benefits
      .filter(benefit => typeof benefit === 'string' && benefit.trim().length > 0)
      .map(benefit => benefit.trim())
      .slice(0, 5); // Limiter à 5 avantages max
  }
  
  if (typeof benefits === 'string') {
    try {
      const parsed = JSON.parse(benefits);
      return sanitizeBenefits(parsed);
    } catch {
      // Si ce n'est pas du JSON valide, traiter comme une chaîne simple
      return benefits.split(',').map(b => b.trim()).filter(b => b.length > 0);
    }
  }
  
  return DEFAULT_VALUES.benefits;
};

/**
 * Transforme une entreprise API en entreprise frontend
 * Version optimisée avec validation et nettoyage des données
 */
export const transformApiCompany = (apiCompany: ApiCompany): Company => {
  // Validation de base
  if (!apiCompany || typeof apiCompany !== 'object') {
    throw new Error('Données d\'entreprise invalides');
  }

  const companyId = extractCompanyId(apiCompany);
  
  if (companyId === 0) {
    console.warn('Entreprise sans ID valide:', apiCompany);
  }

  return {
    // Identifiants
    id: companyId,
    id_company: companyId,
    
    // Informations de base
    name: apiCompany.name?.trim() || DEFAULT_VALUES.name,
    industry: apiCompany.industry?.trim() || DEFAULT_VALUES.industry,
    location: determineLocation(apiCompany),
    size: apiCompany.employees_number?.trim() || DEFAULT_VALUES.size,
    description: apiCompany.description?.trim() || DEFAULT_VALUES.description,
    
    // Métadonnées
    jobsAvailable: Math.max(0, apiCompany.jobsAvailable || DEFAULT_VALUES.jobsAvailable),
    founded: determineFoundedYear(apiCompany),
    website: apiCompany.website?.trim() || DEFAULT_VALUES.website,
    
    // UI
    // Utiliser le logo de la base de données s'il existe, sinon null (les initiales seront affichées par le composant)
    logo: apiCompany.logo && apiCompany.logo.trim() ? apiCompany.logo.trim() : (generateLogoUrl(apiCompany.name) || ""),
    benefits: sanitizeBenefits(apiCompany.benefits)
  };
};

/**
 * Transforme un tableau d'entreprises API en tableau d'entreprises frontend
 * Version optimisée avec gestion d'erreurs
 */
export const transformApiCompanies = (apiCompanies: ApiCompany[]): Company[] => {
  if (!Array.isArray(apiCompanies)) {
    console.warn('Données d\'entreprises invalides, retour d\'un tableau vide');
    return [];
  }

  return apiCompanies
    .filter(company => company && typeof company === 'object') // Filtrer les entrées invalides
    .map(company => {
      try {
        return transformApiCompany(company);
      } catch (error) {
        console.error('Erreur lors de la transformation d\'une entreprise:', error, company);
        return null;
      }
    })
    .filter((company): company is Company => company !== null); // Filtrer les transformations échouées
};

/**
 * Valide qu'une entreprise transformée est complète
 */
export const validateTransformedCompany = (company: Company): boolean => {
  return !!(
    company &&
    company.id > 0 &&
    company.name &&
    company.name !== DEFAULT_VALUES.name &&
    company.industry &&
    company.industry !== DEFAULT_VALUES.industry
  );
};

/**
 * Statistiques de transformation pour le debugging
 */
export const getTransformationStats = (apiCompanies: ApiCompany[], transformedCompanies: Company[]) => {
  return {
    total: apiCompanies.length,
    transformed: transformedCompanies.length,
    failed: apiCompanies.length - transformedCompanies.length,
    valid: transformedCompanies.filter(validateTransformedCompany).length,
    invalid: transformedCompanies.filter(c => !validateTransformedCompany(c)).length
  };
};
