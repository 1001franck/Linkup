import supabase from '../database/db.js';
import logger from '../utils/logger.js';

/**
 * Calcule les statistiques actuelles d'un utilisateur
 */
async function getCurrentUserStats(id_user) {
	try {
		logger.debug(`[getCurrentUserStats] Début du calcul pour l'utilisateur ${id_user}`);

		// Récupérer le nombre d'applications actuelles
		const { data: applications, error: applicationsError } = await supabase
			.from('apply')
			.select('id_user, id_job_offer, application_date')
			.eq('id_user', id_user);

		if (applicationsError) {
			logger.error('getCurrentUserStats - applications error:', applicationsError);
			// Ne pas lancer d'erreur, utiliser 0
		}

		// Récupérer le nombre de messages actuels
		const { data: messages, error: messagesError } = await supabase
			.from('message')
			.select('id_message, send_at')
			.or(`id_sender.eq.${id_user},id_receiver.eq.${id_user}`);

		if (messagesError) {
			logger.error('getCurrentUserStats - messages error:', messagesError);
			// Ne pas lancer d'erreur, utiliser 0
		}

		// Récupérer le nombre d'emplois sauvegardés
		const { data: savedJobs, error: savedJobsError } = await supabase
			.from('save')
			.select('id_user, id_job_offer, saved_at')
			.eq('id_user', id_user);

		if (savedJobsError) {
			logger.error('getCurrentUserStats - savedJobs error:', savedJobsError);
			// Ne pas lancer d'erreur, utiliser 0
		}

		const stats = {
			applications: applications?.length || 0,
			messages: messages?.length || 0,
			savedJobs: savedJobs?.length || 0,
			applicationsData: applications || [],
			messagesData: messages || [],
			savedJobsData: savedJobs || [],
		};

		logger.debug(`[getCurrentUserStats] Statistiques calculées:`, stats);
		return stats;
	} catch (err) {
		logger.error('getCurrentUserStats error:', err);
		// Retourner des statistiques par défaut
		return {
			applications: 0,
			messages: 0,
			savedJobs: 0,
			applicationsData: [],
			messagesData: [],
			savedJobsData: [],
		};
	}
}

/**
 * Calcule les statistiques de la semaine précédente
 */
async function getPreviousWeekUserStats(id_user) {
	try {
		logger.debug(`[getPreviousWeekUserStats] Début du calcul pour l'utilisateur ${id_user}`);

		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		const oneWeekAgoISO = oneWeekAgo.toISOString();

		logger.debug(`[getPreviousWeekUserStats] Date de référence: ${oneWeekAgoISO}`);

		// Applications de la semaine précédente
		const { data: applications, error: applicationsError } = await supabase
			.from('apply')
			.select('id_user, id_job_offer, application_date')
			.eq('id_user', id_user)
			.lt('application_date', oneWeekAgoISO);

		if (applicationsError) {
			logger.error('getPreviousWeekUserStats - applications error:', applicationsError);
			// Ne pas lancer d'erreur, utiliser 0
		}

		// Messages de la semaine précédente
		const { data: messages, error: messagesError } = await supabase
			.from('message')
			.select('id_message, send_at')
			.or(`id_sender.eq.${id_user},id_receiver.eq.${id_user}`)
			.lt('send_at', oneWeekAgoISO);

		if (messagesError) {
			logger.error('getPreviousWeekUserStats - messages error:', messagesError);
			// Ne pas lancer d'erreur, utiliser 0
		}

		// Emplois sauvegardés de la semaine précédente
		const { data: savedJobs, error: savedJobsError } = await supabase
			.from('save')
			.select('id_user, id_job_offer, saved_at')
			.eq('id_user', id_user)
			.lt('saved_at', oneWeekAgoISO);

		if (savedJobsError) {
			logger.error('getPreviousWeekUserStats - savedJobs error:', savedJobsError);
			// Ne pas lancer d'erreur, utiliser 0
		}

		const stats = {
			applications: applications?.length || 0,
			messages: messages?.length || 0,
			savedJobs: savedJobs?.length || 0,
		};

		logger.debug(`[getPreviousWeekUserStats] Statistiques semaine précédente:`, stats);
		return stats;
	} catch (err) {
		logger.error('getPreviousWeekUserStats error:', err);
		// Retourner des statistiques par défaut
		return {
			applications: 0,
			messages: 0,
			savedJobs: 0,
		};
	}
}

/**
 * Calcule le pourcentage de changement
 */
function calculatePercentageChange(current, previous) {
	if (previous === 0) {
		return current > 0 ? 100 : 0;
	}
	return Math.round(((current - previous) / previous) * 100);
}

/**
 * Récupère les tendances d'un utilisateur (comparaison semaine actuelle vs précédente)
 */
async function getUserTrends(id_user) {
	try {
		logger.debug(`[getUserTrends] Calcul des tendances pour l'utilisateur ${id_user}`);

		// Récupérer les statistiques actuelles avec gestion d'erreur
		let currentStats;
		try {
			currentStats = await getCurrentUserStats(id_user);
			logger.debug(`[getUserTrends] Statistiques actuelles:`, currentStats);
		} catch (currentError) {
			logger.error(`[getUserTrends] Erreur statistiques actuelles:`, currentError);
			// Utiliser des valeurs par défaut
			currentStats = {
				applications: 0,
				messages: 0,
				savedJobs: 0,
			};
		}

		// Récupérer les statistiques de la semaine précédente avec gestion d'erreur
		let previousStats;
		try {
			previousStats = await getPreviousWeekUserStats(id_user);
			logger.debug(`[getUserTrends] Statistiques semaine précédente:`, previousStats);
		} catch (previousError) {
			logger.error(`[getUserTrends] Erreur statistiques semaine précédente:`, previousError);
			// Utiliser des valeurs par défaut
			previousStats = {
				applications: 0,
				messages: 0,
				savedJobs: 0,
			};
		}

		// Calculer les pourcentages de changement
		const applicationsChange = calculatePercentageChange(
			currentStats.applications,
			previousStats.applications
		);

		const messagesChange = calculatePercentageChange(currentStats.messages, previousStats.messages);

		const savedJobsChange = calculatePercentageChange(
			currentStats.savedJobs,
			previousStats.savedJobs
		);

		const trends = {
			applications: {
				current: currentStats.applications,
				previous: previousStats.applications,
				change: applicationsChange,
				trend: applicationsChange >= 0 ? 'up' : 'down',
				changeFormatted: `${applicationsChange >= 0 ? '+' : ''}${applicationsChange}%`,
			},
			messages: {
				current: currentStats.messages,
				previous: previousStats.messages,
				change: messagesChange,
				trend: messagesChange >= 0 ? 'up' : 'down',
				changeFormatted: `${messagesChange >= 0 ? '+' : ''}${messagesChange}%`,
			},
			savedJobs: {
				current: currentStats.savedJobs,
				previous: previousStats.savedJobs,
				change: savedJobsChange,
				trend: savedJobsChange >= 0 ? 'up' : 'down',
				changeFormatted: `${savedJobsChange >= 0 ? '+' : ''}${savedJobsChange}%`,
			},
			period: {
				current: 'Cette semaine',
				previous: 'Semaine précédente',
				comparison: 'Comparaison sur 7 jours',
			},
			status: 'success',
			generatedAt: new Date().toISOString(),
		};

		logger.debug(`[getUserTrends] Tendances calculées:`, trends);
		return trends;
	} catch (err) {
		logger.error('getUserTrends error:', err);

		// Retourner des tendances par défaut en cas d'erreur
		const fallbackTrends = {
			applications: {
				current: 0,
				previous: 0,
				change: 0,
				trend: 'neutral',
				changeFormatted: '0%',
			},
			messages: {
				current: 0,
				previous: 0,
				change: 0,
				trend: 'neutral',
				changeFormatted: '0%',
			},
			savedJobs: {
				current: 0,
				previous: 0,
				change: 0,
				trend: 'neutral',
				changeFormatted: '0%',
			},
			period: {
				current: 'Cette semaine',
				previous: 'Semaine précédente',
				comparison: 'Comparaison sur 7 jours',
			},
			status: 'error',
			error: err.message,
			generatedAt: new Date().toISOString(),
		};

		logger.debug(`[getUserTrends] Retour des tendances par défaut:`, fallbackTrends);
		return fallbackTrends;
	}
}

/**
 * Récupère les statistiques détaillées d'un utilisateur
 */
async function getUserDetailedStats(id_user) {
	try {
		const currentStats = await getCurrentUserStats(id_user);
		const trends = await getUserTrends(id_user);

		return {
			...currentStats,
			trends,
			generatedAt: new Date().toISOString(),
		};
	} catch (err) {
		logger.error('getUserDetailedStats error:', err);
		throw err;
	}
}

export {
	getCurrentUserStats,
	getPreviousWeekUserStats,
	getUserTrends,
	getUserDetailedStats,
	calculatePercentageChange,
};
