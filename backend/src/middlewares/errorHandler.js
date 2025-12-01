/**
 * Middleware de gestion globale des erreurs
 * Capture toutes les erreurs non gérées et retourne des réponses sécurisées
 */

import logger from '../utils/logger.js';
import { AppError, handleError } from '../utils/errors.js';

/**
 * Middleware de gestion des erreurs
 * Doit être ajouté en dernier dans app.js
 * Utilise la hiérarchie d'erreurs personnalisées pour une meilleure gestion
 */
export function errorHandler(err, req, res, next) {
	// Utiliser la fonction centralisée handleError pour les erreurs AppError
	if (err instanceof AppError) {
		return handleError(err, res, logger);
	}

	// Log de l'erreur pour les erreurs non-AppError
	logger.error('Erreur non gérée:', {
		message: err.message,
		stack: err.stack,
		name: err.name,
		code: err.code,
		details: err.details,
		hint: err.hint,
		method: req.method,
		path: req.path,
		url: req.url,
		ip: req.ip,
		userId: req.user?.sub,
		userRole: req.user?.role,
	});

	// Log supplémentaire pour s'assurer que les détails sont visibles
	if (err.code) {
		logger.error(`Code d'erreur: ${err.code}`);
	}
	if (err.details) {
		logger.error(`Détails: ${JSON.stringify(err.details)}`);
	}
	if (err.hint) {
		logger.error(`Hint: ${err.hint}`);
	}
	if (err.stack) {
		logger.error(`Stack trace: ${err.stack}`);
	}

	// Ne pas exposer les détails de l'erreur en production
	const isProduction = process.env.NODE_ENV === 'production';

	// Déterminer le code de statut
	const statusCode = err.statusCode || err.status || 500;

	// Gestion des erreurs spécifiques (compatibilité avec les anciennes erreurs)
	if (err.name === 'ValidationError' || err.name === 'ZodError') {
		return res.status(400).json({
			error: 'Erreur de validation',
			details: isProduction ? undefined : err.details || err.issues,
		});
	}

	if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'Non autorisé',
		});
	}

	// Erreur par défaut
	const errorResponse = {
		error: isProduction ? 'Erreur serveur' : err.message || 'Erreur serveur',
		...(isProduction
			? {}
			: {
					stack: err.stack,
					details: err.details,
				}),
	};

	res.status(statusCode).json(errorResponse);
}

/**
 * Middleware pour capturer les routes non trouvées
 */
export function notFoundHandler(req, res, next) {
	const isProduction = process.env.NODE_ENV === 'production';

	res.status(404).json({
		error: 'Route non trouvée',
		// Ne pas exposer le chemin complet en production pour éviter de révéler la structure de l'API
		...(isProduction ? {} : { path: req.path }),
	});
}
