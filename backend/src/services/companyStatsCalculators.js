/**
 * Fonctions de calcul de statistiques pour les entreprises
 * Découpage de companyStatsStore.js pour améliorer la maintenabilité
 */

import supabase from '../database/db.js';
import logger from '../utils/logger.js';

/**
 * Statistiques des offres d'emploi de l'entreprise
 * @param {number} id_company - ID de l'entreprise
 * @returns {Promise<Object>} - {total: number, active: number}
 */
export async function getJobsStats(id_company) {
	try {
		// Total des offres
		const { count: total, error: totalError } = await supabase
			.from('job_offer')
			.select('*', { count: 'exact', head: true })
			.eq('id_company', id_company);

		if (totalError) throw totalError;

		// Offres actives = offres pour lesquelles aucun candidat n'a été accepté
		// D'abord récupérer toutes les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: total || 0, active: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Récupérer les offres qui ont des candidats acceptés
		const { data: acceptedApplications, error: acceptedError } = await supabase
			.from('apply')
			.select('id_job_offer')
			.in('id_job_offer', jobIds)
			.eq('status', 'accepted');

		if (acceptedError) throw acceptedError;

		// Les offres avec des candidats acceptés
		const jobsWithAcceptedCandidates = new Set(
			(acceptedApplications || []).map((app) => app.id_job_offer)
		);

		// Offres actives = total - offres avec candidats acceptés
		const active = (total || 0) - jobsWithAcceptedCandidates.size;

		return {
			total: total || 0,
			active: Math.max(0, active), // S'assurer que c'est pas négatif
		};
	} catch (error) {
		logger.error(`[getJobsStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0, active: 0 };
	}
}

/**
 * Statistiques des candidatures de l'entreprise
 * @param {number} id_company - ID de l'entreprise
 * @returns {Promise<Object>} - {total: number, thisWeek: number}
 */
export async function getApplicationsStats(id_company) {
	try {
		// Total des candidatures - d'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: 0, thisWeek: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Maintenant compter les candidatures pour ces offres
		const { count: total, error: totalError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds);

		if (totalError) throw totalError;

		// Candidatures de cette semaine
		const startOfWeek = new Date();
		startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		const { count: thisWeek, error: weekError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds)
			.gte('application_date', startOfWeek.toISOString());

		if (weekError) throw weekError;

		return {
			total: total || 0,
			thisWeek: thisWeek || 0,
		};
	} catch (error) {
		logger.error(`[getApplicationsStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0, thisWeek: 0 };
	}
}

/**
 * Statistiques des entretiens programmés
 * @param {number} id_company - ID de l'entreprise
 * @returns {Promise<Object>} - {total: number}
 */
export async function getInterviewsStats(id_company) {
	try {
		// D'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Total des entretiens programmés (tous les statuts 'interview')
		const { count: total, error: totalError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds)
			.eq('status', 'interview');

		if (totalError) throw totalError;

		return {
			total: total || 0,
		};
	} catch (error) {
		logger.error(`[getInterviewsStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0 };
	}
}

/**
 * Statistiques des candidats embauchés
 * @param {number} id_company - ID de l'entreprise
 * @returns {Promise<Object>} - {total: number}
 */
export async function getHiredStats(id_company) {
	try {
		// D'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Total des candidats embauchés (tous les statuts 'accepted')
		const { count: total, error: totalError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds)
			.eq('status', 'accepted');

		if (totalError) throw totalError;

		return {
			total: total || 0,
		};
	} catch (error) {
		logger.error(`[getHiredStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0 };
	}
}
