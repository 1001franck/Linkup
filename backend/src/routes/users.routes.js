import express from 'express';
import auth from '../middlewares/auth.js';
import { findById, getAllUsers, updateUser, deleteUser } from '../services/userStore.js';
import { getUserTrends, getUserDetailedStats } from '../services/userStatsStore.js';
import { getProfilePicture } from '../services/userFilesStore.js';
import { validateNumericId } from '../middlewares/security.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * GET /users/me
 * Header: Authorization: Bearer <token>
 */
router.get('/me', auth(), async (req, res) => {
	try {
		const me = await findById(req.user.sub);
		if (!me) {
			return res.status(404).json({ error: 'Utilisateur introuvable' });
		}

		// Récupérer la photo de profil
		const profilePicture = await getProfilePicture(req.user.sub);

		// Ne renvoie pas password_hash
		return res.json({
			id_user: me.id_user,
			email: me.email,
			firstname: me.firstname,
			lastname: me.lastname,
			role: me.role,
			phone: me.phone,
			bio_pro: me.bio_pro,
			city: me.city,
			country: me.country,
			website: me.website,
			profile_picture: profilePicture,
			connexion_index: me.connexion_index,
			profile_views: me.profile_views,
			applies_index: me.applies_index,
			private_visibility: me.private_visibility,
			created_at: me.created_at,
		});
	} catch (error) {
		logger.error('GET /users/me error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /users/me (protégée)
 * MODIFICATION FRONTEND: Extension pour supporter la page settings
 * Body: { firstname?, lastname?, phone?, bio_pro?, website?, city?, country? }
 */
router.put('/me', auth(), async (req, res) => {
	try {
		// MODIFICATION FRONTEND: Ajout de nouveaux champs pour la page settings ET profile/complete
		const {
			firstname,
			lastname,
			phone,
			bio_pro, // ← Bio professionnelle (settings)
			website, // ← Site web personnel (settings)
			city, // ← Ville (settings)
			country, // ← Pays (settings)
			description, // ← NOUVEAU: Description détaillée (profile/complete)
			skills, // ← NOUVEAU: Compétences array (profile/complete)
			job_title, // ← NOUVEAU: Titre du poste (profile/complete)
			experience_level, // ← NOUVEAU: Niveau d'expérience (profile/complete)
			availability, // ← NOUVEAU: Disponibilité (profile/complete)
			portfolio_link, // ← NOUVEAU: Lien portfolio (profile/complete)
			linkedin_link, // ← NOUVEAU: Lien LinkedIn (profile/complete)
		} = req.body || {};

		const updated = await updateUser(req.user.sub, {
			firstname,
			lastname,
			phone,
			bio_pro, // ← Bio professionnelle (settings)
			website, // ← Site web personnel (settings)
			city, // ← Ville (settings)
			country, // ← Pays (settings)
			description, // ← NOUVEAU: Description détaillée (profile/complete)
			skills, // ← NOUVEAU: Compétences array (profile/complete)
			job_title, // ← NOUVEAU: Titre du poste (profile/complete)
			experience_level, // ← NOUVEAU: Niveau d'expérience (profile/complete)
			availability, // ← NOUVEAU: Disponibilité (profile/complete)
			portfolio_link, // ← NOUVEAU: Lien portfolio (profile/complete)
			linkedin_link, // ← NOUVEAU: Lien LinkedIn (profile/complete)
		});
		if (!updated) {
			return res.status(404).json({ error: 'Utilisateur introuvable' });
		}

		// MODIFICATION FRONTEND: Retour de tous les champs dans la réponse
		res.json({
			id_user: updated.id_user,
			email: updated.email,
			firstname: updated.firstname,
			lastname: updated.lastname,
			role: updated.role,
			phone: updated.phone,
			bio_pro: updated.bio_pro, // ← Bio professionnelle (settings)
			website: updated.website, // ← Site web personnel (settings)
			city: updated.city, // ← Ville (settings)
			country: updated.country, // ← Pays (settings)
			description: updated.description, // ← NOUVEAU: Description détaillée (profile/complete)
			skills: updated.skills, // ← NOUVEAU: Compétences array (profile/complete)
			job_title: updated.job_title, // ← NOUVEAU: Titre du poste (profile/complete)
			experience_level: updated.experience_level, // ← NOUVEAU: Niveau d'expérience (profile/complete)
			availability: updated.availability, // ← NOUVEAU: Disponibilité (profile/complete)
			portfolio_link: updated.portfolio_link, // ← NOUVEAU: Lien portfolio (profile/complete)
			linkedin_link: updated.linkedin_link, // ← NOUVEAU: Lien LinkedIn (profile/complete)
			updated_at: updated.updated_at,
		});
	} catch (error) {
		logger.error('PUT /users/me error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /users/me (protégée)
 * Supprime le compte de l'utilisateur connecté
 */
router.delete('/me', auth(), async (req, res) => {
	try {
		const deleted = await deleteUser(req.user.sub);
		if (!deleted) {
			return res.status(404).json({ error: 'Utilisateur introuvable' });
		}

		// Token sera révoqué automatiquement

		res.status(204).send(); // No Content
	} catch (error) {
		logger.error('DELETE /users/me error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

router.get('/', async (_, res) => {
	try {
		const users = await getAllUsers();
		res.json({ data: users });
	} catch (err) {
		logger.error('GET /users error:', err);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /users/me/stats/trends
 * Récupère les tendances de l'utilisateur connecté (comparaison semaine actuelle vs précédente)
 * Header: Authorization: Bearer <token>
 */
router.get('/me/stats/trends', auth(), async (req, res) => {
	try {
		logger.debug(`[GET /users/me/stats/trends] Utilisateur: ${req.user.sub}`);
		logger.debug(`[GET /users/me/stats/trends] Token payload:`, req.user);

		const trends = await getUserTrends(req.user.sub);
		logger.debug(`[GET /users/me/stats/trends] Tendances retournées:`, trends);

		res.json({ data: trends });
	} catch (error) {
		logger.error('GET /users/me/stats/trends error:', error);

		// Ne pas exposer les détails d'erreur en production
		res.status(500).json({
			error: 'Erreur serveur',
			...(process.env.NODE_ENV !== 'production' && { details: error.message }),
		});
	}
});

/**
 * GET /users/me/stats/detailed
 * Récupère les statistiques détaillées de l'utilisateur connecté
 * Header: Authorization: Bearer <token>
 */
router.get('/me/stats/detailed', auth(), async (req, res) => {
	try {
		logger.debug(`[GET /users/me/stats/detailed] Utilisateur: ${req.user.sub}`);
		const detailedStats = await getUserDetailedStats(req.user.sub);
		res.json({ data: detailedStats });
	} catch (error) {
		logger.error('GET /users/me/stats/detailed error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /users/:id/stats/trends
 * Récupère les tendances d'un utilisateur spécifique (pour les admins)
 * Header: Authorization: Bearer <token>
 */
router.get('/:id/stats/trends', validateNumericId('id'), auth(), async (req, res) => {
	try {
		// Vérifier si l'utilisateur est admin ou s'il accède à ses propres stats
		if (req.user.role !== 'admin' && req.user.sub !== parseInt(req.params.id)) {
			return res.status(403).json({ error: 'Accès non autorisé' });
		}

		logger.debug(`[GET /users/${req.params.id}/stats/trends] Utilisateur: ${req.params.id}`);
		const trends = await getUserTrends(req.params.id);
		res.json({ data: trends });
	} catch (error) {
		logger.error('GET /users/:id/stats/trends error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
