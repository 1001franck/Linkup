/**
 * Système de cache en mémoire (Map)
 * TODO: Migrer vers Redis pour la production multi-instances
 *
 * Pour migrer vers Redis:
 * 1. Installer: npm install redis
 * 2. Configurer REDIS_URL dans .env
 * 3. Remplacer l'implémentation Map par Redis client
 */

const cache = new Map();

// Nettoyage périodique des entrées expirées (toutes les 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
	cleanExpired();
}, CLEANUP_INTERVAL);

/**
 * Récupère une valeur du cache
 * @param {string} key - Clé du cache
 * @returns {any|null} Valeur en cache ou null si expirée/inexistante
 */
function get(key) {
	const entry = cache.get(key);
	if (!entry) {
		return null;
	}

	// Vérifier si l'entrée est expirée
	if (entry.expiresAt < Date.now()) {
		cache.delete(key);
		return null;
	}

	return entry.value;
}

/**
 * Stocke une valeur dans le cache avec TTL
 * @param {string} key - Clé du cache
 * @param {any} value - Valeur à stocker
 * @param {number} ttlSeconds - Durée de vie en secondes
 */
function set(key, value, ttlSeconds) {
	const expiresAt = Date.now() + ttlSeconds * 1000;
	cache.set(key, { value, expiresAt });
}

/**
 * Supprime une entrée du cache
 * @param {string} key - Clé à supprimer
 */
function del(key) {
	cache.delete(key);
}

/**
 * Vide tout le cache
 */
function clear() {
	cache.clear();
}

/**
 * Nettoie les entrées expirées
 */
function cleanExpired() {
	const now = Date.now();
	for (const [key, entry] of cache.entries()) {
		if (entry.expiresAt < now) {
			cache.delete(key);
		}
	}
}

/**
 * Génère une clé de cache à partir d'un préfixe et de paramètres
 * @param {string} prefix - Préfixe de la clé
 * @param {object} params - Paramètres à inclure dans la clé
 * @returns {string} Clé générée
 */
function generateKey(prefix, params) {
	const paramsStr = JSON.stringify(params, Object.keys(params || {}).sort());
	return `${prefix}:${paramsStr}`;
}

/**
 * Récupère les statistiques du cache
 * @returns {object} Statistiques (taille, entrées)
 */
function getStats() {
	return {
		size: cache.size,
		keys: Array.from(cache.keys()),
	};
}

export default { get, set, del, clear, generateKey, getStats };
