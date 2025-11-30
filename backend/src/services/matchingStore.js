import supabase from '../database/db.js';
import logger from '../utils/logger.js';
import {
	checkDomainIncompatibility,
	calculateSkillsMatch,
	calculateLocationMatch,
	calculateExperienceMatch,
	calculateTitleMatch,
	calculateIndustryMatch,
	calculateContractMatch,
	calculateSalaryMatch,
	getRecommendation,
} from './matchingCalculators.js';

/**
 * Service de matching intelligent pour les offres d'emploi
 * Calcule un score de compatibilité entre un utilisateur et une offre
 * Les fonctions de calcul sont dans matchingCalculators.js pour améliorer la maintenabilité
 */

/**
 * Calcule le score de matching entre un utilisateur et une offre d'emploi
 * @param {Object} user - Données utilisateur
 * @param {Object} jobOffer - Offre d'emploi
 * @returns {Object} - Score de matching et détails
 */
export async function calculateMatchingScore(user, jobOffer) {
	try {
		logger.debug(
			`[calculateMatchingScore] Calcul pour utilisateur ${user.id_user} et offre ${jobOffer.id_job_offer}`
		);

		// VÉRIFICATION CRITIQUE : Détection d'incompatibilité de domaine
		const domainIncompatibility = checkDomainIncompatibility(user, jobOffer);
		if (domainIncompatibility.isIncompatible) {
			logger.debug(
				`[calculateMatchingScore] Domaines incompatibles détectés: ${domainIncompatibility.reason}`
			);
			// Score très faible pour les domaines incompatibles (max 15%)
			return {
				score: Math.min(15, domainIncompatibility.penaltyScore || 10),
				details: {
					skills: 0,
					location: 0,
					experience: 0,
					title: 0,
					industry: 0,
					contract: 0,
					salary: 0,
					incompatibility: domainIncompatibility.reason,
				},
				weights: {},
				recommendation: `Domaines incompatibles: ${domainIncompatibility.reason} ❌`,
			};
		}

		const scores = {
			skills: 0,
			location: 0,
			experience: 0,
			title: 0,
			industry: 0,
			contract: 0,
			salary: 0,
			total: 0,
		};

		const weights = {
			skills: 0.3, // 30% - Le plus important (augmenté)
			title: 0.25, // 25% - Très important (augmenté)
			industry: 0.2, // 20% - Très important (augmenté)
			location: 0.1, // 10% - Moyennement important (réduit)
			experience: 0.1, // 10% - Moyennement important (réduit)
			contract: 0.03, // 3% - Peu important
			salary: 0.02, // 2% - Peu important
		};

		// 1. MATCHING DES COMPÉTENCES (30%)
		scores.skills = calculateSkillsMatch(user.skills, jobOffer.description, jobOffer.title);

		// 2. MATCHING DU TITRE (25%)
		scores.title = calculateTitleMatch(user.job_title, user.bio_pro, jobOffer.title);

		// 3. MATCHING DU SECTEUR (20%)
		scores.industry = calculateIndustryMatch(
			user.skills,
			jobOffer.industry,
			user.job_title,
			user.bio_pro
		);

		// 4. MATCHING DE LA LOCALISATION (10%)
		scores.location = calculateLocationMatch(
			user.city,
			user.country,
			jobOffer.location,
			jobOffer.remote
		);

		// 5. MATCHING DE L'EXPÉRIENCE (10%)
		scores.experience = calculateExperienceMatch(user.experience_level, jobOffer.experience);

		// 6. MATCHING DU TYPE DE CONTRAT (3%)
		scores.contract = calculateContractMatch(user.availability, jobOffer.contract_type);

		// 7. MATCHING SALARIAL (2%)
		scores.salary = calculateSalaryMatch(
			user.experience_level,
			jobOffer.salary_min,
			jobOffer.salary_max
		);

		// Calcul du score total pondéré
		scores.total = Math.round(
			scores.skills * weights.skills +
				scores.title * weights.title +
				scores.industry * weights.industry +
				scores.location * weights.location +
				scores.experience * weights.experience +
				scores.contract * weights.contract +
				scores.salary * weights.salary
		);

		// S'assurer que le score est entre 0 et 100
		scores.total = Math.max(0, Math.min(100, scores.total));

		logger.debug(`[calculateMatchingScore] Scores calculés:`, scores);

		return {
			score: scores.total,
			details: scores,
			weights,
			recommendation: getRecommendation(scores.total),
		};
	} catch (error) {
		logger.error('[calculateMatchingScore] Erreur:', error);
		return {
			score: 0,
			details: {},
			weights: {},
			recommendation: 'Impossible de calculer le matching',
		};
	}
}

/**
 * Récupère les offres d'emploi avec scores de matching pour un utilisateur
 * @param {Number} userId - ID de l'utilisateur
 * @param {Object} options - Options de recherche
 * @returns {Array} - Liste des offres avec scores
 */
export async function getMatchingJobs(userId, options = {}) {
	try {
		logger.debug(`[getMatchingJobs] Recherche pour utilisateur ${userId}`);

		// Récupérer les données utilisateur (sans password)
		const { data: user, error: userError } = await supabase
			.from('user_')
			.select(
				'id_user, email, firstname, lastname, phone, bio_pro, city, country, role, created_at, updated_at, job_title, experience_level, skills, portfolio_link, linkedin_link, availability, description'
			)
			.eq('id_user', userId)
			.single();

		if (userError || !user) {
			logger.error('[getMatchingJobs] Utilisateur non trouvé:', userError);
			return [];
		}

		// Récupérer les offres d'emploi
		const { data: jobs, error: jobsError } = await supabase
			.from('job_offer')
			.select(
				`
        *,
        company (
          id_company,
          name,
          logo,
          industry,
          city,
          country,
          website
        )
      `
			)
			.order('published_at', { ascending: false })
			.limit(options.limit || 50);

		if (jobsError) {
			logger.error('[getMatchingJobs] Erreur récupération offres:', jobsError);
			return [];
		}

		// Calculer les scores de matching pour chaque offre
		const jobsWithScores = await Promise.all(
			jobs.map(async (job) => {
				const matchingResult = await calculateMatchingScore(user, job);
				return {
					...job,
					matching: matchingResult,
				};
			})
		);

		// Trier par score de matching (décroissant)
		jobsWithScores.sort((a, b) => b.matching.score - a.matching.score);

		logger.debug(`[getMatchingJobs] ${jobsWithScores.length} offres avec scores calculés`);

		return jobsWithScores;
	} catch (error) {
		logger.error('[getMatchingJobs] Erreur:', error);
		return [];
	}
}

/**
 * Récupère les utilisateurs avec scores de matching pour une offre
 * @param {Number} jobId - ID de l'offre
 * @param {Object} options - Options de recherche
 * @returns {Array} - Liste des utilisateurs avec scores
 */
export async function getMatchingUsers(jobId, options = {}) {
	try {
		logger.debug(`[getMatchingUsers] Recherche pour offre ${jobId}`);

		// Récupérer l'offre d'emploi
		const { data: job, error: jobError } = await supabase
			.from('job_offer')
			.select(
				`
        *,
        company (
          id_company,
          name,
          industry,
          city,
          country,
          website
        )
      `
			)
			.eq('id_job_offer', jobId)
			.single();

		if (jobError || !job) {
			logger.error('[getMatchingUsers] Offre non trouvée:', jobError);
			return [];
		}

		// Récupérer les utilisateurs (sans password)
		const { data: users, error: usersError } = await supabase
			.from('user_')
			.select(
				'id_user, email, firstname, lastname, phone, bio_pro, city, country, role, created_at, updated_at, job_title, experience_level, skills, portfolio_link, linkedin_link, availability, description'
			)
			.eq('role', 'user')
			.limit(options.limit || 100);

		if (usersError) {
			logger.error('[getMatchingUsers] Erreur récupération utilisateurs:', usersError);
			return [];
		}

		// Calculer les scores de matching pour chaque utilisateur
		const usersWithScores = await Promise.all(
			users.map(async (user) => {
				const matchingResult = await calculateMatchingScore(user, job);
				return {
					...user,
					matching: matchingResult,
				};
			})
		);

		// Trier par score de matching (décroissant)
		usersWithScores.sort((a, b) => b.matching.score - a.matching.score);

		logger.debug(`[getMatchingUsers] ${usersWithScores.length} utilisateurs avec scores calculés`);

		return usersWithScores;
	} catch (error) {
		logger.error('[getMatchingUsers] Erreur:', error);
		return [];
	}
}
