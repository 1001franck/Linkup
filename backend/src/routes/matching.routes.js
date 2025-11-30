import express from 'express';
import auth from '../middlewares/auth.js';
import {
	getMatchingJobs,
	getMatchingUsers,
	calculateMatchingScore,
} from '../services/matchingStore.js';
import { findById } from '../services/userStore.js';
import { findById as findJobById } from '../services/jobStore.js';
import { validateNumericId } from '../middlewares/security.js';

const router = express.Router();

/**
 * GET /matching/jobs
 * Récupère les offres d'emploi avec scores de matching pour l'utilisateur connecté
 * Query params: limit, minScore, industry, location
 */
router.get('/jobs', auth(), async (req, res) => {
	try {
		const userId = req.user.sub;
		const { limit = 20, minScore = 0, industry, location } = req.query;

		console.log(`[GET /matching/jobs] Utilisateur: ${userId}, Options:`, {
			limit,
			minScore,
			industry,
			location,
		});

		// Récupérer les offres avec scores de matching
		const matchingJobs = await getMatchingJobs(userId, {
			limit: parseInt(limit),
			minScore: parseInt(minScore),
			industry,
			location,
		});

		// Filtrer par score minimum si spécifié
		const filteredJobs = matchingJobs.filter((job) => job.matching.score >= parseInt(minScore));

		// Filtrer par industrie si spécifiée
		const industryFilteredJobs = industry
			? filteredJobs.filter(
					(job) =>
						job.industry?.toLowerCase().includes(industry.toLowerCase()) ||
						job.company?.industry?.toLowerCase().includes(industry.toLowerCase())
				)
			: filteredJobs;

		// Filtrer par localisation si spécifiée
		const locationFilteredJobs = location
			? industryFilteredJobs.filter((job) =>
					job.location?.toLowerCase().includes(location.toLowerCase())
				)
			: industryFilteredJobs;

		console.log(`[GET /matching/jobs] ${locationFilteredJobs.length} offres retournées`);

		res.json({
			success: true,
			data: locationFilteredJobs,
			meta: {
				total: locationFilteredJobs.length,
				averageScore:
					locationFilteredJobs.length > 0
						? Math.round(
								locationFilteredJobs.reduce((sum, job) => sum + job.matching.score, 0) /
									locationFilteredJobs.length
							)
						: 0,
				filters: { limit, minScore, industry, location },
			},
		});
	} catch (error) {
		console.error('[GET /matching/jobs] Erreur:', error);
		res.status(500).json({
			success: false,
			error: 'Erreur lors du calcul des correspondances',
		});
	}
});

/**
 * GET /matching/jobs/:jobId/score
 * Calcule le score de matching pour une offre spécifique
 */
router.get('/jobs/:jobId/score', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		const userId = req.user.sub;
		const jobId = req.params.jobId;

		console.log(`[GET /matching/jobs/${jobId}/score] Utilisateur: ${userId}`);

		// Récupérer les données utilisateur
		const user = await findById(userId);
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'Utilisateur non trouvé',
			});
		}

		// Récupérer l'offre d'emploi
		const job = await findJobById(jobId);
		if (!job) {
			return res.status(404).json({
				success: false,
				error: "Offre d'emploi non trouvée",
			});
		}

		// Calculer le score de matching
		const matchingResult = await calculateMatchingScore(user, job);

		console.log(`[GET /matching/jobs/${jobId}/score] Score calculé: ${matchingResult.score}`);

		res.json({
			success: true,
			data: {
				jobId: parseInt(jobId),
				userId: parseInt(userId),
				matching: matchingResult,
			},
		});
	} catch (error) {
		console.error(`[GET /matching/jobs/${req.params.jobId}/score] Erreur:`, error);
		res.status(500).json({
			success: false,
			error: 'Erreur lors du calcul du score',
		});
	}
});

/**
 * GET /matching/users/:jobId
 * Récupère les utilisateurs avec scores de matching pour une offre (pour les recruteurs)
 * Nécessite le rôle admin ou company
 */
router.get('/users/:jobId', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		const jobId = req.params.jobId;
		const { limit = 20, minScore = 0 } = req.query;

		// Vérifier que l'utilisateur est un recruteur ou admin
		const user = await findById(req.user.sub);
		if (!user || (user.role !== 'admin' && user.role !== 'company')) {
			return res.status(403).json({
				success: false,
				error: 'Accès non autorisé. Réservé aux recruteurs et administrateurs.',
			});
		}

		console.log(`[GET /matching/users/${jobId}] Utilisateur: ${req.user.sub}, Options:`, {
			limit,
			minScore,
		});

		// Récupérer les utilisateurs avec scores de matching
		const matchingUsers = await getMatchingUsers(jobId, {
			limit: parseInt(limit),
			minScore: parseInt(minScore),
		});

		// Filtrer par score minimum si spécifié
		const filteredUsers = matchingUsers.filter((user) => user.matching.score >= parseInt(minScore));

		console.log(`[GET /matching/users/${jobId}] ${filteredUsers.length} utilisateurs retournés`);

		res.json({
			success: true,
			data: filteredUsers,
			meta: {
				total: filteredUsers.length,
				averageScore:
					filteredUsers.length > 0
						? Math.round(
								filteredUsers.reduce((sum, user) => sum + user.matching.score, 0) /
									filteredUsers.length
							)
						: 0,
				filters: { limit, minScore },
			},
		});
	} catch (error) {
		console.error(`[GET /matching/users/${req.params.jobId}] Erreur:`, error);
		res.status(500).json({
			success: false,
			error: 'Erreur lors du calcul des correspondances',
		});
	}
});

/**
 * GET /matching/insights/:userId
 * Récupère des insights sur le matching pour un utilisateur
 */
router.get('/insights/:userId', validateNumericId('userId'), auth(), async (req, res) => {
	try {
		const userId = req.params.userId;
		const requestingUserId = req.user.sub;

		// Vérifier que l'utilisateur peut accéder à ces données
		if (userId !== requestingUserId && req.user.role !== 'admin') {
			return res.status(403).json({
				success: false,
				error: 'Accès non autorisé',
			});
		}

		console.log(`[GET /matching/insights/${userId}] Utilisateur: ${requestingUserId}`);

		// Récupérer les offres avec scores de matching
		const matchingJobs = await getMatchingJobs(userId, { limit: 100 });

		if (matchingJobs.length === 0) {
			return res.json({
				success: true,
				data: {
					totalJobs: 0,
					averageScore: 0,
					topSkills: [],
					topIndustries: [],
					recommendations: [],
				},
			});
		}

		// Calculer les insights
		const averageScore = Math.round(
			matchingJobs.reduce((sum, job) => sum + job.matching.score, 0) / matchingJobs.length
		);

		// Top 5 des offres avec le meilleur score
		const topJobs = matchingJobs.slice(0, 5);

		// Analyser les industries les plus représentées
		const industryCount = {};
		matchingJobs.forEach((job) => {
			const industry = job.industry || job.company?.industry || 'Autre';
			industryCount[industry] = (industryCount[industry] || 0) + 1;
		});

		const topIndustries = Object.entries(industryCount)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([industry, count]) => ({ industry, count }));

		// Générer des recommandations
		const recommendations = [];

		if (averageScore < 60) {
			recommendations.push('Complétez votre profil avec plus de compétences techniques');
		}

		if (topIndustries.length > 0) {
			recommendations.push(
				`Concentrez-vous sur les offres dans le secteur ${topIndustries[0].industry}`
			);
		}

		if (matchingJobs.some((job) => job.matching.details.location < 50)) {
			recommendations.push('Envisagez le télétravail pour élargir vos opportunités');
		}

		console.log(`[GET /matching/insights/${userId}] Insights calculés:`, {
			totalJobs: matchingJobs.length,
			averageScore,
			topIndustries: topIndustries.length,
		});

		res.json({
			success: true,
			data: {
				totalJobs: matchingJobs.length,
				averageScore,
				topJobs: topJobs.map((job) => ({
					id: job.id_job_offer,
					title: job.title,
					company: job.company?.name,
					score: job.matching.score,
					recommendation: job.matching.recommendation,
				})),
				topIndustries,
				recommendations,
				scoreDistribution: {
					excellent: matchingJobs.filter((job) => job.matching.score >= 90).length,
					good: matchingJobs.filter((job) => job.matching.score >= 70 && job.matching.score < 90)
						.length,
					average: matchingJobs.filter((job) => job.matching.score >= 50 && job.matching.score < 70)
						.length,
					poor: matchingJobs.filter((job) => job.matching.score < 50).length,
				},
			},
		});
	} catch (error) {
		console.error(`[GET /matching/insights/${req.params.userId}] Erreur:`, error);
		res.status(500).json({
			success: false,
			error: 'Erreur lors du calcul des insights',
		});
	}
});

export default router;
