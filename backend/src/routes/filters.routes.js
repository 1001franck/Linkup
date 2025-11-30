import express from 'express';
import auth from '../middlewares/auth.js';
import {
	createFilter,
	getAllFilters,
	findById,
	updateFilter,
	removeFilter,
} from '../services/filterStore.js';
import { validateNumericId } from '../middlewares/security.js';

const router = express.Router();

/**
 * GET /filters
 * Récupère tous les filtres disponibles
 */
router.get('/', async (_, res) => {
	try {
		const filters = await getAllFilters();
		res.json({ data: filters });
	} catch (error) {
		console.error('GET /filters error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /filters/:id
 * Récupère un filtre par son ID
 */
router.get('/:id', validateNumericId('id'), async (req, res) => {
	const { id } = req.params;
	try {
		const filter = await findById(id);
		if (!filter) {
			return res.status(404).json({ error: 'Filtre introuvable' });
		}
		res.json({ data: filter });
	} catch (error) {
		console.error('GET /filters/:id error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /filters (protégée - admin seulement)
 * Body: { filter_name }
 */
router.post('/', auth(['admin']), async (req, res) => {
	const { filter_name } = req.body || {};
	try {
		if (!filter_name) {
			return res.status(400).json({ error: 'filter_name est requis' });
		}

		const filter = await createFilter(filter_name);
		if (filter.error) {
			return res.status(409).json({ error: filter.error });
		}

		res.status(201).json({ data: filter });
	} catch (error) {
		console.error('POST /filters error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /filters/:id (protégée - admin seulement)
 * Body: { filter_name }
 */
router.put('/:id', validateNumericId('id'), auth(['admin']), async (req, res) => {
	try {
		const { id } = req.params;
		const { filter_name } = req.body || {};

		if (!filter_name) {
			return res.status(400).json({ error: 'filter_name est requis' });
		}

		const updated = await updateFilter(id, filter_name);
		if (!updated) {
			return res.status(404).json({ error: 'Filtre introuvable' });
		}

		if (updated.error) {
			return res.status(409).json({ error: updated.error });
		}

		res.json({ data: updated });
	} catch (error) {
		console.error('PUT /filters/:id error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /filters/:id (protégée - admin seulement)
 */
router.delete('/:id', validateNumericId('id'), auth(['admin']), async (req, res) => {
	try {
		const deleted = await removeFilter(req.params.id);
		if (!deleted) {
			return res.status(404).json({ error: 'Filtre introuvable' });
		}

		res.status(204).send(); // No Content
	} catch (error) {
		console.error('DELETE /filters/:id error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
