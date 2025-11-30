/**
 * Fonctions utilitaires pour jobStore.js
 * Découpage de jobStore.js pour améliorer la maintenabilité
 */

/**
 * Convertit une valeur en nombre ou null
 * @param {any} v - Valeur à convertir
 * @returns {number|null} - Nombre ou null si la conversion échoue
 */
export function numOrNull(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

/**
 * Calcule le temps écoulé depuis la publication d'une offre
 * @param {string|Date} publishedAt - Date de publication
 * @returns {string} - Temps écoulé formaté (ex: "Il y a 2 jours")
 */
export function getTimeAgo(publishedAt) {
	if (!publishedAt) return 'Date inconnue';

	const now = new Date();
	const publishDate = new Date(publishedAt);
	const diffInMs = now - publishDate;

	if (diffInMs < 0) return 'Dans le futur';

	const diffInSeconds = Math.floor(diffInMs / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	const diffInWeeks = Math.floor(diffInDays / 7);
	const diffInMonths = Math.floor(diffInDays / 30);

	if (diffInSeconds < 60) {
		return diffInSeconds <= 1 ? "À l'instant" : `Il y a ${diffInSeconds} secondes`;
	}
	if (diffInMinutes < 60) {
		return diffInMinutes === 1 ? 'Il y a 1 minute' : `Il y a ${diffInMinutes} minutes`;
	}
	if (diffInHours < 24) {
		return diffInHours === 1 ? 'Il y a 1 heure' : `Il y a ${diffInHours} heures`;
	}
	if (diffInDays < 7) {
		return diffInDays === 1 ? 'Il y a 1 jour' : `Il y a ${diffInDays} jours`;
	}
	if (diffInDays < 30) {
		return diffInWeeks === 1 ? 'Il y a 1 semaine' : `Il y a ${diffInWeeks} semaines`;
	}
	if (diffInDays < 365) {
		return diffInMonths === 1 ? 'Il y a 1 mois' : `Il y a ${diffInMonths} mois`;
	}

	const diffInYears = Math.floor(diffInDays / 365);
	return diffInYears === 1 ? 'Il y a 1 an' : `Il y a ${diffInYears} ans`;
}
