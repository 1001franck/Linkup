/**
 * Routes admin pour la gestion des filtres
 */

import express from 'express';
import logger from '../../utils/logger.js';
import { getAllFilters } from '../../services/filterStore.js';
import { createFilter, updateFilter, removeFilter } from '../../services/adminStore.js';

const router = express.Router();

/**
 * GET /admin/filters
 * Liste tous les filtres
 */
router.get('/filters', async (req, res) => {
	try {
		const filters = await getAllFilters();
		res.json({ data: filters });
	} catch (error) {
		logger.error('GET /admin/filters error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /admin/filters
 * Créer un filtre (admin seulement)
 */
router.post('/filters', async (req, res) => {
	try {
		const { name, type, options, is_active = true } = req.body;

		if (!name || !type) {
			return res.status(400).json({ error: 'Nom et type requis' });
		}

		const filter = await createFilter({ name, type, options, is_active });
		res.status(201).json({ data: filter });
	} catch (error) {
		logger.error('POST /admin/filters error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /admin/filters/:filterId
 * Modifier un filtre (admin seulement)
 */
router.put('/filters/:filterId', async (req, res) => {
	try {
		const { filterId } = req.params;
		const updateData = req.body;

		const filter = await updateFilter(filterId, updateData);
		res.json({ data: filter });
	} catch (error) {
		logger.error('PUT /admin/filters/:filterId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /admin/filters/:filterId
 * Supprimer un filtre (admin seulement)
 */
router.delete('/filters/:filterId', async (req, res) => {
	try {
		const { filterId } = req.params;

		const result = await removeFilter(filterId);
		res.json({ data: result });
	} catch (error) {
		logger.error('DELETE /admin/filters/:filterId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
