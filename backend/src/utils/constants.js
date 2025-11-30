/**
 * Constantes centralisées pour l'application
 * Évite les "magic numbers" dispersés dans le code
 */

// ============================================
// SÉCURITÉ
// ============================================

/**
 * Nombre de rounds pour bcrypt (salt rounds)
 * 10 est un bon compromis entre sécurité et performance
 * Plus élevé = plus sécurisé mais plus lent
 */
export const BCRYPT_SALT_ROUNDS = 10;

/**
 * Durée d'expiration par défaut pour les tokens JWT
 */
export const JWT_DEFAULT_EXPIRES_IN = '7d';

/**
 * Durée d'expiration pour les tokens de reset de mot de passe
 */
export const PASSWORD_RESET_TOKEN_EXPIRES_IN = '15m';

/**
 * Longueur minimale requise pour JWT_SECRET
 */
export const JWT_SECRET_MIN_LENGTH = 32;

// ============================================
// FICHIERS
// ============================================

/**
 * Taille maximale d'un fichier uploadé (10 MB)
 */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Taille maximale d'un fichier uploadé en format lisible
 */
export const MAX_FILE_SIZE_MB = 10;

// ============================================
// PAGINATION
// ============================================

/**
 * Limite par défaut pour la pagination
 */
export const DEFAULT_PAGE_LIMIT = 20;

/**
 * Limite maximale pour la pagination (protection DoS)
 */
export const MAX_PAGE_LIMIT = 100;

/**
 * Numéro de page par défaut
 */
export const DEFAULT_PAGE = 1;

// ============================================
// RECHERCHE & SANITIZATION
// ============================================

/**
 * Longueur maximale par défaut pour les paramètres de recherche
 */
export const DEFAULT_SEARCH_MAX_LENGTH = 200;

/**
 * Longueur maximale pour les paramètres de recherche courts (ville, industrie, etc.)
 */
export const SHORT_SEARCH_MAX_LENGTH = 100;

// ============================================
// CACHE
// ============================================

/**
 * Durée de cache pour les statistiques globales (en secondes)
 */
export const CACHE_GLOBAL_STATS_TTL = 300; // 5 minutes

/**
 * Durée de cache pour les top companies (en secondes)
 */
export const CACHE_TOP_COMPANIES_TTL = 600; // 10 minutes

/**
 * Intervalle de nettoyage du cache (en millisecondes)
 */
export const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// ============================================
// RATE LIMITING
// ============================================

/**
 * Nombre maximum de requêtes par fenêtre de temps (production)
 */
export const RATE_LIMIT_GENERAL_MAX_PROD = 1000;
export const RATE_LIMIT_GENERAL_MAX_DEV = 250;

/**
 * Nombre maximum de requêtes d'authentification par fenêtre de temps
 */
export const RATE_LIMIT_AUTH_MAX_PROD = 100;
export const RATE_LIMIT_AUTH_MAX_DEV = 30;

/**
 * Fenêtre de temps pour le rate limiting (en millisecondes)
 */
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// ============================================
// COMPRESSION
// ============================================

/**
 * Niveau de compression pour les réponses HTTP
 * 1-9, 6 est un bon compromis performance/taille
 */
export const COMPRESSION_LEVEL_PROD = 6;
export const COMPRESSION_LEVEL_DEV = 4;

/**
 * Seuil minimal pour compresser une réponse (en bytes)
 */
export const COMPRESSION_THRESHOLD = 1024; // 1 KB

// ============================================
// REQUÊTES
// ============================================

/**
 * Taille maximale du body JSON (1 MB)
 */
export const MAX_JSON_BODY_SIZE = '1mb';

/**
 * Taille maximale du body JSON en bytes
 */
export const MAX_JSON_BODY_SIZE_BYTES = 1024 * 1024; // 1 MB

// ============================================
// PAGINATION OPTIMISATION
// ============================================

/**
 * Multiplicateur pour charger plus de données que nécessaire pour le tri
 * Utilisé dans getAllCompanies pour optimiser le chargement
 */
export const PAGINATION_LOAD_MULTIPLIER = 3;

/**
 * Limite maximale d'éléments à charger pour le tri (protection mémoire)
 */
export const MAX_ITEMS_FOR_SORTING = 200;

// ============================================
// COOKIES
// ============================================

/**
 * Durée de vie des cookies d'authentification (en millisecondes)
 */
export const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

// ============================================
// VALIDATION
// ============================================

/**
 * Longueur minimale d'un mot de passe
 */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Longueur maximale d'un mot de passe
 */
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Longueur maximale d'un email
 */
export const EMAIL_MAX_LENGTH = 320;
