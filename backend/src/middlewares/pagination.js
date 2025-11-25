/**
 * Middleware de validation et normalisation de la pagination
 * Protège contre les attaques DoS via pagination excessive
 */

/**
 * Valide et normalise les paramètres de pagination
 * @param {Object} options - Options de configuration
 * @param {number} options.defaultLimit - Limite par défaut (défaut: 20)
 * @param {number} options.maxLimit - Limite maximale (défaut: 100)
 * @returns {Function} - Middleware Express
 */
export function validatePagination(options = {}) {
	const { defaultLimit = 20, maxLimit = 100 } = options;

	return (req, res, next) => {
		// Récupérer les paramètres de la query string
		let page = parseInt(req.query.page, 10);
		let limit = parseInt(req.query.limit, 10);

		// Validation et normalisation de la page
		if (isNaN(page) || page < 1) {
			page = 1;
		}

		// Validation et normalisation de la limite
		if (isNaN(limit) || limit < 1) {
			limit = defaultLimit;
		} else if (limit > maxLimit) {
			limit = maxLimit; // Limiter à maxLimit pour éviter les DoS
		}

		// Stocker les valeurs normalisées dans req.pagination
		req.pagination = {
			page,
			limit,
			offset: (page - 1) * limit,
		};

		next();
	};
}

/**
 * Crée un objet de réponse paginée standardisé
 * @param {Array} items - Tableau d'éléments
 * @param {number} page - Numéro de page
 * @param {number} limit - Limite par page
 * @param {number} total - Nombre total d'éléments
 * @returns {Object} - Objet de réponse paginée
 */
export function createPaginationResponse(items, page, limit, total) {
	return {
		items: items || [],
		page,
		limit,
		total: total || 0,
		totalPages: Math.ceil((total || 0) / limit),
		hasNext: page * limit < total,
		hasPrev: page > 1,
	};
}
