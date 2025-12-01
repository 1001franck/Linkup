/**
 * Middlewares de sécurité supplémentaires
 * Protection CSRF, validation stricte des entrées, etc.
 */

import logger from '../utils/logger.js';
import { sanitizeSearchParam } from '../utils/validators.js';

/**
 * Valide et sanitize les paramètres de recherche pour éviter les injections
 * Utilise la fonction centralisée de validators.js
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Next middleware
 */

export function sanitizeSearchParams(req, res, next) {
	// Sanitizer les paramètres de recherche dans query (limite de 200 caractères)
	if (req.query.search) {
		req.query.search = sanitizeSearchParam(req.query.search, 200);
	}

	if (req.query.q) {
		req.query.q = sanitizeSearchParam(req.query.q, 200);
	}

	// Sanitizer les autres paramètres de recherche (limite de 100 caractères)
	['location', 'industry', 'city', 'company', 'experience', 'education'].forEach((param) => {
		if (req.query[param]) {
			req.query[param] = sanitizeSearchParam(req.query[param], 100);
		}
	});

	next();
}

/**
 * Valide les IDs numériques pour éviter les injections
 * @param {string} paramName - Nom du paramètre à valider
 * @returns {Function} - Middleware Express
 */
export function validateNumericId(paramName = 'id') {
	return (req, res, next) => {
		const id = req.params[paramName] || (req.body && req.body[paramName]) || req.query[paramName];

		if (id !== undefined) {
			const numId = parseInt(id, 10);
			if (isNaN(numId) || numId < 1 || numId > Number.MAX_SAFE_INTEGER) {
				return res.status(400).json({
					error: `Paramètre ${paramName} invalide`,
					message: `${paramName} doit être un nombre entier positif`,
				});
			}
			// Remplacer par la valeur validée
			if (req.params[paramName]) req.params[paramName] = numId;
			if (req.body && req.body[paramName]) req.body[paramName] = numId;
			if (req.query[paramName]) req.query[paramName] = numId;
		}

		next();
	};
}

/**
 * Middleware pour limiter la taille des requêtes (protection DoS)
 * @param {number} maxSize - Taille maximale en bytes (défaut: 1MB)
 * @returns {Function} - Middleware Express
 */
export function limitRequestSize(maxSize = 1024 * 1024) {
	return (req, res, next) => {
		const contentLength = parseInt(req.headers['content-length'], 10);

		if (contentLength && contentLength > maxSize) {
			logger.warn(`[limitRequestSize] Requête trop volumineuse: ${contentLength} bytes`);
			return res.status(413).json({
				error: 'Requête trop volumineuse',
				message: `La taille maximale autorisée est ${maxSize / 1024 / 1024} MB`,
			});
		}

		next();
	};
}

/**
 * Valide les paramètres de tri pour éviter les injections
 * @param {Array} allowedFields - Champs autorisés pour le tri
 * @param {Array} allowedOrders - Ordres autorisés (asc, desc)
 * @returns {Function} - Middleware Express
 */
export function validateSortParams(allowedFields = [], allowedOrders = ['asc', 'desc']) {
	return (req, res, next) => {
		if (req.query.sort) {
			const sortField = String(req.query.sort).trim();
			if (allowedFields.length > 0 && !allowedFields.includes(sortField)) {
				return res.status(400).json({
					error: 'Paramètre de tri invalide',
					message: `Champ de tri autorisé: ${allowedFields.join(', ')}`,
				});
			}
		}

		if (req.query.order) {
			const order = String(req.query.order).trim().toLowerCase();
			if (!allowedOrders.includes(order)) {
				return res.status(400).json({
					error: 'Ordre de tri invalide',
					message: `Ordres autorisés: ${allowedOrders.join(', ')}`,
				});
			}
		}

		next();
	};
}
