/**
 * Middleware de gestion globale des erreurs
 * Capture toutes les erreurs non gérées et retourne des réponses sécurisées
 */

import logger from '../utils/logger.js';

/**
 * Middleware de gestion des erreurs
 * Doit être ajouté en dernier dans app.js
 */
export function errorHandler(err, req, res, next) {
	// Log de l'erreur
	logger.error('Erreur non gérée:', {
		message: err.message,
		stack: err.stack,
		method: req.method,
		path: req.path,
		ip: req.ip,
	});

	// Ne pas exposer les détails de l'erreur en production
	const isProduction = process.env.NODE_ENV === 'production';

	// Déterminer le code de statut
	const statusCode = err.statusCode || err.status || 500;

	// Réponse d'erreur sécurisée
	const errorResponse = {
		error: isProduction ? 'Erreur serveur' : err.message || 'Erreur serveur',
		...(isProduction
			? {}
			: {
					stack: err.stack,
					details: err.details,
				}),
	};

	// Gestion des erreurs spécifiques
	if (err.name === 'ValidationError') {
		return res.status(400).json({
			error: 'Erreur de validation',
			details: isProduction ? undefined : err.details,
		});
	}

	if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'Non autorisé',
		});
	}

	// Erreur par défaut
	res.status(statusCode).json(errorResponse);
}

/**
 * Middleware pour capturer les routes non trouvées
 */
export function notFoundHandler(req, res, next) {
	res.status(404).json({
		error: 'Route non trouvée',
		path: req.path,
	});
}
