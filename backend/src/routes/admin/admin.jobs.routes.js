/**
 * Routes admin pour la gestion des offres d'emploi
 */

import express from 'express';
import logger from '../../utils/logger.js';
import {
	searchJobs,
	getAllJobs,
	createJob,
	updateJob,
	removeJob,
} from '../../services/jobStore.js';

const router = express.Router();

/**
 * GET /admin/jobs
 * Liste toutes les offres d'emploi avec recherche et pagination
 */
router.get('/jobs', async (req, res) => {
	try {
		const { page = 1, limit = 20, q, location, contractType, search = null } = req.query;

		// Si q, location ou contractType sont présents, utiliser searchJobs
		if (q || location || contractType) {
			const result = await searchJobs({ q, location, contractType, page, limit });
			res.json({ data: result });
		} else {
			// Sinon, utiliser getAllJobs avec pagination
			const jobs = await getAllJobs({ page: parseInt(page), limit: parseInt(limit), search });
			res.json({ success: true, data: jobs });
		}
	} catch (error) {
		logger.error('GET /admin/jobs error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /admin/jobs
 * Créer une offre d'emploi (admin seulement)
 */
router.post('/jobs', async (req, res) => {
	try {
		const jobData = req.body;

		if (!jobData.title || !jobData.id_company) {
			return res.status(400).json({ error: 'Titre et ID entreprise requis' });
		}

		const job = await createJob(jobData);
		res.status(201).json({ data: job });
	} catch (error) {
		logger.error('POST /admin/jobs error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /admin/jobs/:jobId
 * Modifier une offre d'emploi (admin seulement)
 */
router.put('/jobs/:jobId', async (req, res) => {
	try {
		const { jobId } = req.params;
		const updateData = req.body;

		const job = await updateJob(jobId, updateData);
		res.json({ data: job });
	} catch (error) {
		logger.error('PUT /admin/jobs/:jobId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /admin/jobs/:jobId
 * Supprimer une offre d'emploi (admin seulement)
 */
router.delete('/jobs/:jobId', async (req, res) => {
	try {
		const { jobId } = req.params;

		const result = await removeJob(jobId);
		res.json({ data: result });
	} catch (error) {
		logger.error('DELETE /admin/jobs/:jobId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
