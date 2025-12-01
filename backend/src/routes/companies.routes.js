import express from 'express';
import multer from 'multer';
import auth from '../middlewares/auth.js';
import {
	findById,
	findByName,
	createCompany,
	updateCompany,
	removeCompany,
	getAllCompanies,
	updateCompanyPassword,
} from '../services/companyStore.js';
import { uploadCompanyLogoToSupabase } from '../services/userFilesStore.js';
import { validatePagination } from '../middlewares/pagination.js';
import { validateNumericId } from '../middlewares/security.js';
import supabase from '../database/db.js';
import logger from '../utils/logger.js';

const router = express.Router();
const upload = multer(); // in-memory

/**
 * GET /companies
 *
 * AMÉLIORATION : Support des filtres industry et city
 *
 * Query Parameters:
 * - page: Numéro de page (optionnel, défaut: 1)
 * - limit: Nombre d'éléments par page (optionnel, défaut: 20)
 * - search: Recherche textuelle sur nom/description (optionnel)
 * - industry: Filtre par secteur d'activité (optionnel)
 * - city: Filtre par ville (optionnel)
 *
 * Exemples d'utilisation:
 * - GET /companies?page=1&limit=10
 * - GET /companies?search=tech&industry=IT&city=Paris
 * - GET /companies?industry=Finance&city=Lyon
 *
 * Réponse:
 * {
 *   data: {
 *     items: Array<Company>,
 *     page: number,
 *     limit: number,
 *     total: number
 *   }
 * }
 */
router.get('/', validatePagination({ defaultLimit: 20, maxLimit: 100 }), async (req, res) => {
	try {
		// 🔍 RÉCUPÉRATION DES PARAMÈTRES DE FILTRAGE
		const { search, industry, city } = req.query;

		// 📊 APPEL DU SERVICE AVEC TOUS LES FILTRES
		const result = await getAllCompanies({
			page: req.pagination.page,
			limit: req.pagination.limit,
			search,
			industry, // ✅ NOUVEAU : Filtre par secteur
			city, // ✅ NOUVEAU : Filtre par ville
		});

		// 📤 RETOUR DES RÉSULTATS
		res.json({ data: result });
	} catch (error) {
		logger.error('GET /companies error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /companies/me (protégée)
 * Récupère les informations de l'entreprise connectée
 */
router.get('/me', auth(), async (req, res) => {
	try {
		// Log pour déboguer
		const companyId = req.user.sub;
		logger.info({
			msg: '[GET /companies/me] Company ID from token',
			companyId,
			role: req.user.role,
			recruiter_mail: req.user.recruiter_mail,
			userPayload: req.user,
		});

		const company = await findById(companyId);
		if (!company) {
			logger.error({
				msg: '[GET /companies/me] Entreprise non trouvée',
				companyId,
				companyIdType: typeof companyId,
				tokenPayload: req.user,
			});
			return res.status(404).json({ error: `Entreprise introuvable avec l'ID ${companyId}` });
		}

		// Ne renvoie pas le mot de passe
		const { password, ...companyData } = company;
		res.json(companyData);
	} catch (error) {
		logger.error('GET /companies/me error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /companies/:id
 */
router.get('/:id', validateNumericId('id'), async (req, res) => {
	try {
		const companyId = req.params.id;
		logger.debug('[GET /companies/:id] Début requête', {
			id: companyId,
			idType: typeof companyId,
		});

		const company = await findById(companyId);

		logger.debug('[GET /companies/:id] Résultat findById', {
			found: !!company,
			hasId: company ? !!company.id_company : false,
		});

		if (!company) {
			logger.warn('[GET /companies/:id] Entreprise non trouvée', {
				id: companyId,
			});
			return res.status(404).json({ error: 'Entreprise introuvable' });
		}

		// Ne pas renvoyer le mot de passe si présent
		const companyData = { ...company };
		delete companyData.password;

		logger.debug('[GET /companies/:id] Envoi réponse', {
			id: companyData.id_company,
			hasName: !!companyData.name,
		});

		res.json({ data: companyData });
	} catch (error) {
		logger.error('GET /companies/:id error:', {
			error: error.message,
			stack: error.stack,
			id: req.params.id,
			errorCode: error.code,
			errorDetails: error.details,
			errorName: error.name,
		});

		// En développement, retourner plus de détails sur l'erreur
		const isDevelopment = process.env.NODE_ENV !== 'production';
		res.status(500).json({
			error: 'Erreur serveur',
			...(isDevelopment && {
				details: error.message,
				code: error.code,
				stack: error.stack,
			}),
		});
	}
});

/**
 * POST /companies (protégée)
 * Body: { name, description, website? }
 */
router.post('/', auth(['company', 'admin']), async (req, res) => {
	try {
		const { name, description, website, size, industry } = req.body || {};

		if (!name || !description) {
			return res.status(400).json({ error: 'name et description sont requis' });
		}

		// Vérifier si l'entreprise existe déjà
		const existing = await findByName(name);
		if (existing) {
			return res.status(409).json({ error: 'Cette entreprise existe déjà' });
		}

		const company = await createCompany({ name, description, website, size, industry });
		res.status(201).json({ data: company });
	} catch (error) {
		logger.error('POST /companies error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /companies/:id (protégée)
 * Body: { name?, description?, website? }
 */
router.put('/:id', validateNumericId('id'), auth(['company', 'admin']), async (req, res) => {
	try {
		const company = await findById(req.params.id);
		if (!company) {
			return res.status(404).json({ error: 'Entreprise introuvable' });
		}

		// Vérifier si l'utilisateur peut modifier (admin ou propriétaire)
		// Pour l'instant, on accepte tous les utilisateurs connectés
		const updated = await updateCompany(req.params.id, req.body || {});
		if (updated && updated.error) {
			return res.status(409).json({ error: updated.error });
		}

		res.json({ data: updated });
	} catch (error) {
		logger.error('PUT /companies/:id error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /companies/me (protégée - entreprise seulement)
 * Supprime le compte de l'entreprise connectée
 */
router.delete('/me', auth(), async (req, res) => {
	try {
		// Vérifier que c'est bien une entreprise connectée
		const userRole = req.user.role;
		if (userRole !== 'company') {
			return res
				.status(403)
				.json({ error: 'Seules les entreprises peuvent supprimer leur compte' });
		}

		const deleted = await removeCompany(req.user.sub);
		if (!deleted) {
			return res.status(404).json({ error: 'Entreprise introuvable' });
		}

		// Token sera révoqué automatiquement

		res.status(204).send(); // No Content
	} catch (error) {
		logger.error('DELETE /companies/me error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /companies/:id (protégée - admin seulement)
 */
router.delete('/:id', validateNumericId('id'), auth(['admin']), async (req, res) => {
	try {
		const company = await findById(req.params.id);
		if (!company) {
			return res.status(404).json({ error: 'Entreprise introuvable' });
		}

		const deleted = await removeCompany(req.params.id);
		if (!deleted) {
			return res.status(404).json({ error: 'Entreprise introuvable' });
		}

		res.status(204).send(); // No Content
	} catch (error) {
		logger.error('DELETE /companies/:id error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /companies/:id/logo
 * Upload du logo d'une entreprise
 * Header: Authorization (entreprise)
 * Form-Data: file (image)
 */
router.post(
	'/:id/logo',
	validateNumericId('id'),
	auth(['company']),
	upload.single('file'),
	async (req, res) => {
		try {
			logger.debug('🔍 POST /companies/:id/logo - Début');
			logger.debug('🔍 Headers:', req.headers);
			logger.debug('🔍 User:', req.user);
			logger.debug(
				'🔍 File:',
				req.file
					? { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype }
					: 'Aucun fichier'
			);

			const companyId = parseInt(req.params.id);
			const id_company = req.user.sub; // ID de l'entreprise connectée

			logger.debug('🔍 Company ID from params:', companyId);
			logger.debug('🔍 Company ID from token:', id_company);

			// Vérifier que l'entreprise peut modifier son propre logo
			if (companyId !== id_company) {
				logger.debug('❌ Accès refusé - IDs ne correspondent pas');
				return res.status(403).json({ error: 'Accès refusé' });
			}

			if (!req.file) {
				logger.debug('❌ Aucun fichier fourni');
				return res.status(400).json({ error: 'Fichier requis' });
			}

			// Vérifier que c'est une image
			if (!req.file.mimetype.startsWith('image/')) {
				logger.debug("❌ Fichier n'est pas une image:", req.file.mimetype);
				return res.status(400).json({ error: 'Le fichier doit être une image' });
			}

			logger.debug('🔍 Upload vers Supabase...');
			// Upload du fichier vers Supabase Storage
			const result = await uploadCompanyLogoToSupabase(id_company, req.file);
			logger.debug('✅ Upload réussi:', result);

			logger.debug('🔍 Mise à jour base de données...');
			// Mettre à jour la base de données avec l'URL du logo
			const { error: updateError } = await supabase
				.from('company')
				.update({ logo: result.url })
				.eq('id_company', id_company);

			if (updateError) {
				logger.error('❌ Erreur mise à jour logo:', updateError);
				return res.status(500).json({ error: 'Erreur lors de la mise à jour du logo' });
			}

			logger.debug('✅ Logo mis à jour avec succès');
			res.json({
				success: true,
				data: {
					logo_url: result.url,
					message: 'Logo mis à jour avec succès',
				},
			});
		} catch (error) {
			logger.error('❌ POST /companies/:id/logo error:', error);
			res.status(500).json({ error: 'Erreur serveur' });
		}
	}
);

/**
 * PUT /companies/me/password (protégée - entreprise seulement)
 * Change le mot de passe de l'entreprise connectée
 * Body: { currentPassword, newPassword }
 */
router.put('/me/password', auth(['company']), async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({ error: 'currentPassword et newPassword sont requis' });
		}

		await updateCompanyPassword(req.user.sub, currentPassword, newPassword);
		return res.status(200).json({ message: 'Mot de passe mis à jour' });
	} catch (err) {
		if (err.code === 'INVALID_CURRENT_PASSWORD') {
			return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
		}
		logger.error('PUT /companies/me/password error:', err);
		return res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
