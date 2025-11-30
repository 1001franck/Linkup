/**
 * Utilitaires pour gérer les erreurs Supabase de manière centralisée
 * Fournit des fonctions pour interpréter et gérer les différents types d'erreurs Supabase
 */

import logger from './logger.js';

/**
 * Codes d'erreur Supabase/PostgREST courants
 */
export const SUPABASE_ERROR_CODES = {
	// PostgREST: Aucune ligne retournée (normal pour .single() quand aucun résultat)
	NO_ROWS: 'PGRST116',
	// PostgreSQL: Relation (table) n'existe pas
	TABLE_NOT_FOUND: '42P01',
	// PostgreSQL: Violation de contrainte unique (duplicate key)
	UNIQUE_VIOLATION: '23505',
	// PostgreSQL: Violation de contrainte de clé étrangère
	FOREIGN_KEY_VIOLATION: '23503',
	// PostgreSQL: Violation de contrainte NOT NULL
	NOT_NULL_VIOLATION: '23502',
};

/**
 * Vérifie si une erreur Supabase indique qu'aucune ligne n'a été trouvée
 * C'est une situation normale (pas une erreur) pour les requêtes .single() ou .maybeSingle()
 * @param {Object} error - Erreur Supabase
 * @returns {boolean} - true si c'est une erreur "no rows"
 */
export function isNoRowsError(error) {
	return error?.code === SUPABASE_ERROR_CODES.NO_ROWS;
}

/**
 * Vérifie si une erreur Supabase indique que la table n'existe pas
 * @param {Object} error - Erreur Supabase
 * @returns {boolean} - true si la table n'existe pas
 */
export function isTableNotFoundError(error) {
	return (
		error?.code === SUPABASE_ERROR_CODES.TABLE_NOT_FOUND ||
		error?.message?.includes('does not exist')
	);
}

/**
 * Vérifie si une erreur Supabase est une erreur de connexion réseau
 * @param {Object} error - Erreur Supabase
 * @returns {boolean} - true si c'est une erreur de connexion
 */
export function isConnectionError(error) {
	const message = error?.message || '';
	return (
		message.includes('fetch failed') ||
		message.includes('ECONNREFUSED') ||
		message.includes('ENOTFOUND') ||
		message.includes('ETIMEDOUT')
	);
}

/**
 * Vérifie si une erreur Supabase est une violation de contrainte unique (duplicate)
 * @param {Object} error - Erreur Supabase
 * @returns {boolean} - true si c'est une violation unique
 */
export function isUniqueViolationError(error) {
	return (
		error?.code === SUPABASE_ERROR_CODES.UNIQUE_VIOLATION ||
		error?.message?.toLowerCase().includes('duplicate')
	);
}

/**
 * Vérifie si une erreur Supabase est une violation de clé étrangère
 * @param {Object} error - Erreur Supabase
 * @returns {boolean} - true si c'est une violation de FK
 */
export function isForeignKeyViolationError(error) {
	return error?.code === SUPABASE_ERROR_CODES.FOREIGN_KEY_VIOLATION;
}

/**
 * Vérifie si une erreur Supabase est une violation NOT NULL
 * @param {Object} error - Erreur Supabase
 * @returns {boolean} - true si c'est une violation NOT NULL
 */
export function isNotNullViolationError(error) {
	return error?.code === SUPABASE_ERROR_CODES.NOT_NULL_VIOLATION;
}

/**
 * Gère une erreur Supabase de manière standardisée
 * Retourne null pour les erreurs "no rows" (normal), log et throw pour les autres
 * @param {Object} error - Erreur Supabase
 * @param {string} context - Contexte de l'opération (pour le logging)
 * @param {Object} options - Options de gestion
 * @param {boolean} options.ignoreNoRows - Si true, retourne null pour "no rows" au lieu de throw
 * @param {boolean} options.ignoreTableNotFound - Si true, retourne null si table n'existe pas
 * @param {boolean} options.ignoreConnectionErrors - Si true, retourne null pour erreurs de connexion
 * @returns {null|void} - null si l'erreur est ignorée, sinon throw
 */
export function handleSupabaseError(error, context = 'Supabase operation', options = {}) {
	if (!error) return null;

	const {
		ignoreNoRows = true,
		ignoreTableNotFound = false,
		ignoreConnectionErrors = false,
	} = options;

	// Erreur "no rows" - normal pour .single() quand aucun résultat
	if (isNoRowsError(error)) {
		if (ignoreNoRows) {
			return null;
		}
		// Si on ne doit pas ignorer, on throw quand même car c'est attendu
		return null;
	}

	// Table n'existe pas
	if (isTableNotFoundError(error)) {
		if (ignoreTableNotFound) {
			logger.debug(`[${context}] Table n'existe pas encore`);
			return null;
		}
		logger.error(`[${context}] Table n'existe pas:`, error);
		throw error;
	}

	// Erreur de connexion réseau
	if (isConnectionError(error)) {
		if (ignoreConnectionErrors) {
			logger.debug(`[${context}] Erreur de connexion (ignorée):`, error.message);
			return null;
		}
		logger.error(`[${context}] Erreur de connexion:`, error);
		throw error;
	}

	// Violation de contrainte unique (duplicate)
	if (isUniqueViolationError(error)) {
		logger.warn(`[${context}] Violation de contrainte unique:`, error.message);
		throw error;
	}

	// Violation de clé étrangère
	if (isForeignKeyViolationError(error)) {
		logger.warn(`[${context}] Violation de clé étrangère:`, error.message);
		throw error;
	}

	// Violation NOT NULL
	if (isNotNullViolationError(error)) {
		logger.warn(`[${context}] Violation NOT NULL:`, error.message);
		throw error;
	}

	// Autres erreurs - log et throw
	logger.error(`[${context}] Erreur Supabase:`, {
		code: error.code,
		message: error.message,
		details: error.details,
		hint: error.hint,
	});
	throw error;
}

/**
 * Wrapper pour les requêtes Supabase qui gère automatiquement les erreurs
 * @param {Promise} supabaseQuery - Promesse de la requête Supabase
 * @param {string} context - Contexte de l'opération
 * @param {Object} options - Options de gestion d'erreurs
 * @returns {Promise<Object>} - { data, error } avec error géré
 */
export async function safeSupabaseQuery(supabaseQuery, context, options = {}) {
	try {
		const result = await supabaseQuery;
		if (result.error) {
			handleSupabaseError(result.error, context, options);
		}
		return result;
	} catch (error) {
		handleSupabaseError(error, context, options);
		return { data: null, error };
	}
}
