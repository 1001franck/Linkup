/**
 * Hiérarchie d'erreurs personnalisées pour une meilleure gestion des erreurs
 * Permet de distinguer les types d'erreurs et de les gérer de manière appropriée
 */

/**
 * Classe de base pour toutes les erreurs de l'application
 */
export class AppError extends Error {
	constructor(message, statusCode = 500, isOperational = true) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.isOperational = isOperational; // Erreur opérationnelle (prévue) vs erreur système

		// Capturer la stack trace
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Erreur de validation (400)
 * Utilisée quand les données d'entrée sont invalides
 */
export class ValidationError extends AppError {
	constructor(message, details = null) {
		super(message, 400);
		this.details = details; // Détails de validation (ex: erreurs Zod)
	}
}

/**
 * Erreur d'authentification (401)
 * Utilisée quand l'utilisateur n'est pas authentifié
 */
export class AuthenticationError extends AppError {
	constructor(message = 'Authentification requise') {
		super(message, 401);
	}
}

/**
 * Erreur d'autorisation (403)
 * Utilisée quand l'utilisateur n'a pas les permissions nécessaires
 */
export class AuthorizationError extends AppError {
	constructor(message = 'Accès non autorisé') {
		super(message, 403);
	}
}

/**
 * Erreur de ressource non trouvée (404)
 * Utilisée quand une ressource demandée n'existe pas
 */
export class NotFoundError extends AppError {
	constructor(resource = 'Ressource', id = null) {
		const message = id ? `${resource} avec l'ID ${id} non trouvé(e)` : `${resource} non trouvé(e)`;
		super(message, 404);
		this.resource = resource;
		this.id = id;
	}
}

/**
 * Erreur de conflit (409)
 * Utilisée quand il y a un conflit (ex: email déjà utilisé)
 */
export class ConflictError extends AppError {
	constructor(message = 'Conflit de ressources') {
		super(message, 409);
	}
}

/**
 * Erreur de limite dépassée (429)
 * Utilisée pour le rate limiting
 */
export class RateLimitError extends AppError {
	constructor(message = 'Trop de requêtes, veuillez réessayer plus tard') {
		super(message, 429);
	}
}

/**
 * Erreur de base de données (500)
 * Utilisée pour les erreurs liées à la base de données
 */
export class DatabaseError extends AppError {
	constructor(message = 'Erreur de base de données', originalError = null) {
		super(message, 500);
		this.originalError = originalError;
	}
}

/**
 * Erreur de service externe (502/503)
 * Utilisée pour les erreurs liées à des services externes
 */
export class ExternalServiceError extends AppError {
	constructor(message = 'Erreur de service externe', serviceName = null) {
		super(message, 503);
		this.serviceName = serviceName;
	}
}

/**
 * Convertit une erreur en réponse HTTP appropriée
 * @param {Error} error - L'erreur à convertir
 * @param {Object} res - L'objet réponse Express
 * @param {Object} logger - Le logger pour enregistrer l'erreur
 */
export function handleError(error, res, logger) {
	// Si c'est une erreur opérationnelle (AppError), on peut l'exposer au client
	if (error instanceof AppError && error.isOperational) {
		logger.warn(`[${error.name}] ${error.message}`, {
			statusCode: error.statusCode,
			details: error.details,
		});

		return res.status(error.statusCode).json({
			error: error.message,
			...(error.details && { details: error.details }),
		});
	}

	// Pour les erreurs non opérationnelles (erreurs système), on ne révèle pas les détails
	logger.error('[Erreur système]', {
		message: error.message,
		stack: error.stack,
		name: error.name,
	});

	return res.status(500).json({
		error: process.env.NODE_ENV === 'production' ? 'Erreur serveur interne' : error.message,
	});
}

/**
 * Wrapper pour les fonctions async qui gère automatiquement les erreurs
 * @param {Function} fn - La fonction async à wrapper
 * @returns {Function} - Fonction wrapper qui gère les erreurs
 */
export function asyncHandler(fn) {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}
