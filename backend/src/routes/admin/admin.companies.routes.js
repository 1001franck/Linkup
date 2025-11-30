/**
 * Routes admin pour la gestion des entreprises
 */

import express from 'express';
import logger from '../../utils/logger.js';
import {
	getAllCompanies,
	createCompany,
	updateCompany,
	removeCompany,
} from '../../services/companyStore.js';

const router = express.Router();

/**
 * GET /admin/companies
 * Liste des entreprises avec pagination et recherche
 */
router.get('/companies', async (req, res) => {
	try {
		const { page = 1, limit = 20, search = null, industry = null, city = null } = req.query;
		const companies = await getAllCompanies({
			page: parseInt(page),
			limit: parseInt(limit),
			search,
			industry,
			city,
		});
		res.json({ success: true, data: companies });
	} catch (error) {
		logger.error('GET /admin/companies error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /admin/companies
 * Créer une entreprise (admin seulement)
 */
router.post('/companies', async (req, res) => {
	try {
		const {
			name,
			description,
			recruiter_mail,
			password,
			website,
			industry,
			employees_number,
			city,
			zip_code,
			country,
			founded_year,
			logo,
			recruiter_firstname,
			recruiter_lastname,
			recruiter_phone,
		} = req.body;

		if (!name || !description || !recruiter_mail || !password) {
			return res.status(400).json({
				error: 'Nom, description, email recruteur et mot de passe requis',
			});
		}

		const company = await createCompany({
			name,
			description,
			recruiter_mail,
			password,
			website,
			industry,
			employees_number,
			city,
			zip_code,
			country,
			founded_year,
			logo,
			recruiter_firstname,
			recruiter_lastname,
			recruiter_phone,
		});

		res.status(201).json({ data: company });
	} catch (error) {
		logger.error('POST /admin/companies error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /admin/companies/:companyId
 * Modifier une entreprise (admin seulement)
 */
router.put('/companies/:companyId', async (req, res) => {
	try {
		const { companyId } = req.params;
		const updateData = req.body;

		const company = await updateCompany(companyId, updateData);
		res.json({ data: company });
	} catch (error) {
		logger.error('PUT /admin/companies/:companyId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /admin/companies/:companyId
 * Supprimer une entreprise (admin seulement)
 */
router.delete('/companies/:companyId', async (req, res) => {
	try {
		const { companyId } = req.params;

		const result = await removeCompany(companyId);
		res.json({ data: result });
	} catch (error) {
		logger.error('DELETE /admin/companies/:companyId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
