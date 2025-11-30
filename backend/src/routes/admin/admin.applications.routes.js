/**
 * Routes admin pour la gestion des candidatures
 */

import express from 'express';
import logger from '../../utils/logger.js';
import {
	getAllApplications,
	createApplication,
	updateApplicationStatus,
	removeApplication,
} from '../../services/applicationStore.js';

const router = express.Router();

/**
 * GET /admin/applications
 * Liste des candidatures avec pagination et recherche
 */
router.get('/applications', async (req, res) => {
	try {
		logger.debug('🔍 GET /admin/applications - Début de la requête');
		const { page = 1, limit = 20, search = null } = req.query;
		logger.debug('🔍 GET /admin/applications - Paramètres reçus:', { page, limit, search });

		const applications = await getAllApplications({
			page: parseInt(page),
			limit: parseInt(limit),
			search,
		});
		logger.debug('✅ GET /admin/applications - Applications récupérées:', {
			dataLength: applications.data?.length,
			pagination: applications.pagination,
		});

		res.json({ success: true, data: applications });
	} catch (error) {
		logger.error('❌ GET /admin/applications error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /admin/applications
 * Créer une candidature (admin seulement)
 */
router.post('/applications', async (req, res) => {
	try {
		const { id_user, id_job_offer, status = 'pending', cover_letter, cv_url } = req.body;

		if (!id_user || !id_job_offer) {
			return res.status(400).json({ error: 'ID utilisateur et ID offre requis' });
		}

		const application = await createApplication({
			id_user,
			id_job_offer,
			status,
			cover_letter,
			cv_url,
		});
		res.status(201).json({ data: application });
	} catch (error) {
		logger.error('POST /admin/applications error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /admin/applications/:applicationId
 * Modifier une candidature (admin seulement)
 */
router.put('/applications/:applicationId', async (req, res) => {
	try {
		const { applicationId } = req.params;
		const updateData = req.body;

		const application = await updateApplicationStatus(applicationId, updateData);
		res.json({ data: application });
	} catch (error) {
		logger.error('PUT /admin/applications/:applicationId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /admin/applications/:applicationId
 * Supprimer une candidature (admin seulement)
 */
router.delete('/applications/:applicationId', async (req, res) => {
	try {
		const { applicationId } = req.params;

		const result = await removeApplication(applicationId);
		res.json({ data: result });
	} catch (error) {
		logger.error('DELETE /admin/applications/:applicationId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
