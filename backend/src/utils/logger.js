/**
 * Utilitaire de logging conditionnel
 * Les logs ne s'affichent qu'en développement (NODE_ENV !== 'production')
 * Utilise les niveaux de log standard : error, warn, info, debug
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logger de base avec niveaux de log
 */
const logger = {
	/**
	 * Log d'erreur (toujours affiché, même en production)
	 * Utilisé pour les erreurs critiques
	 */
	error: (...args) => {
		console.error(...args);
	},

	/**
	 * Log d'avertissement (affiché uniquement en développement)
	 * Utilisé pour les warnings non critiques
	 */
	warn: (...args) => {
		if (!isProduction) {
			console.warn(...args);
		}
	},

	/**
	 * Log d'information (affiché uniquement en développement)
	 * Utilisé pour les informations générales
	 */
	info: (...args) => {
		if (!isProduction) {
			console.log(...args);
		}
	},

	/**
	 * Log de débogage (affiché uniquement en développement)
	 * Utilisé pour le débogage détaillé
	 */
	debug: (...args) => {
		if (!isProduction) {
			console.debug(...args);
		}
	},

	/**
	 * Log standard (affiché uniquement en développement)
	 * Alias pour info()
	 */
	log: (...args) => {
		if (!isProduction) {
			console.log(...args);
		}
	},
};

export default logger;

