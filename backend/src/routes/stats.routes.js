import express from 'express';
import {
	getGlobalStats,
	getCompanyStats,
	getTopCompanies,
	getIndustryStats,
	getApplicationStatusStats,
} from '../services/statsStore.js';

const router = express.Router();

/**
 * GET /stats/global
 * Statistiques globales de la plateforme
 */
router.get('/global', async (_, res) => {
	try {
		const stats = await getGlobalStats();
		res.json({ data: stats });
	} catch (error) {
		console.error('GET /stats/global error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /stats/companies
 * Statistiques par entreprise
 */
router.get('/companies', async (_, res) => {
	try {
		const stats = await getCompanyStats();
		res.json({ data: stats });
	} catch (error) {
		console.error('GET /stats/companies error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /stats/top-companies
 * Entreprises avec le plus d'offres (pour "Entreprises à la une")
 */
router.get('/top-companies', async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 3;
		const stats = await getTopCompanies(limit);
		res.json({ data: stats });
	} catch (error) {
		console.error('GET /stats/top-companies error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /stats/industries
 * Statistiques par industrie
 */
router.get('/industries', async (_, res) => {
	try {
		const stats = await getIndustryStats();
		res.json({ data: stats });
	} catch (error) {
		console.error('GET /stats/industries error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /stats/applications/status
 * Statistiques des candidatures par statut
 */
router.get('/applications/status', async (_, res) => {
	try {
		const stats = await getApplicationStatusStats();
		res.json({ data: stats });
	} catch (error) {
		console.error('GET /stats/applications/status error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /stats/summary
 * Résumé des statistiques globales (accessible à tous)
 */
router.get('/summary', async (_, res) => {
	try {
		const [globalStats, industryStats, applicationStats] = await Promise.all([
			getGlobalStats(),
			getIndustryStats(),
			getApplicationStatusStats(),
		]);

		res.json({
			data: {
				global: globalStats,
				industries: industryStats,
				applications: applicationStats,
			},
		});
	} catch (error) {
		console.error('GET /stats/summary error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
