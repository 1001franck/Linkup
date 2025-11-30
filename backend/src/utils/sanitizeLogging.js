/**
 * Utilitaires pour sanitizer les données avant de les logger
 * Évite l'exposition de données sensibles dans les logs
 */

/**
 * Champs sensibles à masquer dans les logs
 */
const SENSITIVE_FIELDS = [
	'password',
	'password_hash',
	'passwordHash',
	'token',
	'access_token',
	'refresh_token',
	'authorization',
	'secret',
	'api_key',
	'apiKey',
	'private_key',
	'privateKey',
	'credit_card',
	'creditCard',
	'cvv',
	'ssn',
	'social_security_number',
	'email', // Optionnel : masquer les emails si nécessaire
];

/**
 * Masque une valeur sensible
 * @param {string} value - Valeur à masquer
 * @returns {string} Valeur masquée
 */
function maskValue(value) {
	if (!value || typeof value !== 'string') {
		return '***';
	}
	if (value.length <= 4) {
		return '****';
	}
	// Afficher les 2 premiers et 2 derniers caractères, masquer le reste
	return `${value.slice(0, 2)}${'*'.repeat(Math.min(value.length - 4, 20))}${value.slice(-2)}`;
}

/**
 * Sanitize un objet en masquant les champs sensibles
 * @param {any} data - Données à sanitizer
 * @param {number} depth - Profondeur maximale de récursion (défaut: 5)
 * @returns {any} Données sanitizées
 */
export function sanitizeForLogging(data, depth = 5) {
	// Limiter la profondeur pour éviter les boucles infinies
	if (depth <= 0) {
		return '[Max depth reached]';
	}

	// Gérer les valeurs null/undefined
	if (data === null || data === undefined) {
		return data;
	}

	// Gérer les primitives
	if (typeof data !== 'object') {
		return data;
	}

	// Gérer les arrays
	if (Array.isArray(data)) {
		return data.map((item) => sanitizeForLogging(item, depth - 1));
	}

	// Gérer les objets
	const sanitized = {};
	for (const [key, value] of Object.entries(data)) {
		const lowerKey = key.toLowerCase();

		// Vérifier si le champ est sensible
		const isSensitive = SENSITIVE_FIELDS.some((field) => lowerKey.includes(field.toLowerCase()));

		if (isSensitive) {
			sanitized[key] = maskValue(String(value));
		} else if (typeof value === 'object' && value !== null) {
			// Récursion pour les objets imbriqués
			sanitized[key] = sanitizeForLogging(value, depth - 1);
		} else {
			sanitized[key] = value;
		}
	}

	return sanitized;
}

/**
 * Sanitize une chaîne de caractères qui pourrait contenir des données sensibles
 * @param {string} str - Chaîne à sanitizer
 * @returns {string} Chaîne sanitizée
 */
export function sanitizeStringForLogging(str) {
	if (!str || typeof str !== 'string') {
		return str;
	}

	// Masquer les patterns courants de tokens/secrets
	let sanitized = str;

	// Masquer les tokens JWT (format: eyJ...)
	sanitized = sanitized.replace(
		/\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g,
		'[JWT_TOKEN]'
	);

	// Masquer les emails si nécessaire (optionnel)
	// sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');

	// Masquer les numéros de carte de crédit (format: 1234-5678-9012-3456)
	sanitized = sanitized.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[CARD_NUMBER]');

	return sanitized;
}

/**
 * Sanitize les headers HTTP pour le logging
 * @param {object} headers - Headers HTTP
 * @returns {object} Headers sanitizés
 */
export function sanitizeHeadersForLogging(headers) {
	if (!headers || typeof headers !== 'object') {
		return headers;
	}

	const sanitized = { ...headers };

	// Masquer les headers sensibles
	const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token', 'x-csrf-token'];

	for (const header of sensitiveHeaders) {
		const lowerHeader = header.toLowerCase();
		for (const key in sanitized) {
			if (key.toLowerCase() === lowerHeader) {
				sanitized[key] = maskValue(String(sanitized[key]));
			}
		}
	}

	return sanitized;
}

/**
 * Sanitize une requête Express complète pour le logging
 * @param {object} req - Requête Express
 * @returns {object} Requête sanitizée
 */
export function sanitizeRequestForLogging(req) {
	if (!req) {
		return req;
	}

	return {
		method: req.method,
		path: req.path,
		url: req.url,
		ip: req.ip,
		headers: sanitizeHeadersForLogging(req.headers),
		body: sanitizeForLogging(req.body),
		query: sanitizeForLogging(req.query),
		params: sanitizeForLogging(req.params),
		// Ne pas logger les cookies complets
		cookies: req.cookies ? '[COOKIES]' : undefined,
	};
}
