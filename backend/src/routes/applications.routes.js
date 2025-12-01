import express from 'express';
import auth from '../middlewares/auth.js';
import supabase from '../database/db.js';
import logger from '../utils/logger.js';
import {
	createApplication,
	getApplicationsByUser,
	getApplicationsByJob,
	getApplicationsByCompany,
	updateApplicationStatus,
	removeApplication,
	getApplicationStats,
} from '../services/applicationStore.js';
import { validateApplicationDocuments } from '../utils/documentValidator.js';
import { validateNumericId } from '../middlewares/security.js';

const router = express.Router();

/**
 * POST /applications (protégée)
 *
 * AMÉLIORATION FRONTEND: Cette route a été améliorée pour :
 * - Accepter les nouvelles colonnes (notes, interview_date, is_archived)
 * - Valider les données d'entrée
 * - Ajouter des logs détaillés pour le débogage
 *
 * Body: {
 *   id_job_offer,
 *   status?,
 *   notes?,
 *   interview_date?,
 *   is_archived?
 * }
 */
router.post('/', auth(), async (req, res) => {
	try {
		logger.debug(`[POST /applications] Nouvelle candidature - Utilisateur: ${req.user.sub}`);
		logger.debug(`[POST /applications] Données reçues:`, req.body);

		// EXTRACTION: Récupérer les données de la requête
		const {
			id_job_offer,
			status = 'pending',
			notes = null,
			interview_date = null,
			is_archived = false,
		} = req.body || {};

		// VALIDATION: Vérifier que l'ID de l'offre est fourni
		if (!id_job_offer) {
			logger.debug(`[POST /applications] Erreur: id_job_offer manquant`);
			return res.status(400).json({ error: 'id_job_offer est requis' });
		}

		// VALIDATION: Vérifier que l'utilisateur a uploadé les 2 documents requis
		const userId = req.user.sub;
		const documentValidation = await validateApplicationDocuments(userId, id_job_offer);

		if (!documentValidation.isValid) {
			logger.debug(`[POST /applications] Erreur: ${documentValidation.error}`);
			return res.status(400).json({ error: documentValidation.error });
		}

		logger.debug(
			`[POST /applications] Documents validés:`,
			documentValidation.documents?.map((d) => d.document_type)
		);

		// VALIDATION: Vérifier que le statut est valide
		const validStatuses = [
			'pending',
			'reviewed',
			'interview',
			'accepted',
			'rejected',
			'withdrawn',
			'archived',
		];
		if (!validStatuses.includes(status)) {
			logger.debug(`[POST /applications] Erreur: statut invalide - ${status}`);
			return res.status(400).json({
				error: `Statut invalide. Statuts acceptés: ${validStatuses.join(', ')}`,
			});
		}

		// CRÉATION: Créer la candidature avec toutes les données
		const application = await createApplication({
			id_user: req.user.sub,
			id_job_offer,
			status,
			notes,
			interview_date,
			is_archived,
		});

		// GESTION ERREUR: Si la candidature existe déjà
		if (application.error) {
			logger.debug(`[POST /applications] Candidature déjà existante: ${application.error}`);
			return res.status(409).json({ error: application.error });
		}

		logger.debug(
			`[POST /applications] Candidature créée avec succès - ID: ${application.id_user}-${application.id_job_offer}`
		);
		res.status(201).json({ data: application });
	} catch (error) {
		logger.error('[POST /applications] Erreur serveur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /applications/my (protégée)
 *
 * AMÉLIORATION FRONTEND: Cette route a été améliorée pour :
 * - Récupérer les candidatures avec tous les détails (offre + entreprise)
 * - Inclure les nouvelles colonnes (notes, interview_date, is_archived)
 * - Ajouter des logs détaillés pour le débogage
 * - Gérer les paramètres de filtrage (statut, archivage)
 *
 * Query params: status?, is_archived?
 * Récupère les candidatures de l'utilisateur connecté
 */
router.get('/my', auth(), async (req, res) => {
	try {
		logger.debug(`[GET /applications/my] Début - Utilisateur: ${req.user.sub}`);

		// EXTRACTION: Récupérer les paramètres de filtrage
		const { status, is_archived } = req.query;

		// RÉCUPÉRATION: Obtenir toutes les candidatures de l'utilisateur
		const applications = await getApplicationsByUser(req.user.sub);

		logger.debug(`[GET /applications/my] ${applications?.length || 0} candidatures récupérées`);

		// FILTRAGE: Appliquer les filtres si fournis
		let filteredApplications = applications || [];

		if (status) {
			filteredApplications = filteredApplications.filter((app) => app.status === status);
		}

		if (is_archived !== undefined) {
			const archivedFilter = is_archived === 'true';
			filteredApplications = filteredApplications.filter(
				(app) => app.is_archived === archivedFilter
			);
		}

		logger.debug(
			`[GET /applications/my] ${filteredApplications.length} candidatures après filtrage`
		);
		res.json({ data: filteredApplications });
	} catch (error) {
		logger.error('[GET /applications/my] Erreur serveur:', error);
		logger.error('[GET /applications/my] Stack:', error.stack);
		res.status(500).json({
			error: 'Erreur serveur',
			...(process.env.NODE_ENV !== 'production' && {
				details: error.message,
				stack: error.stack,
			}),
		});
	}
});

/**
 * GET /applications/job/:jobId (protégée)
 * Récupère les candidatures pour une offre d'emploi
 */
router.get('/job/:jobId', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		const applications = await getApplicationsByJob(req.params.jobId);
		res.json({ data: applications });
	} catch (error) {
		logger.error('GET /applications/job/:jobId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /applications/company/:companyId (protégée)
 *
 * AMÉLIORATION FRONTEND: Cette route a été créée pour :
 * - Permettre aux entreprises de récupérer toutes leurs candidatures
 * - Inclure les détails complets des candidats et des offres
 * - Gérer les filtres par statut et par offre
 *
 * Query params: status?, jobId?
 * Récupère les candidatures pour une entreprise
 */
router.get('/company/:companyId', validateNumericId('companyId'), auth(), async (req, res) => {
	try {
		logger.debug('[GET /applications/company/:companyId] Début requête', {
			companyId: req.params.companyId,
			companyIdType: typeof req.params.companyId,
			userRole: req.user?.role,
			userId: req.user?.sub,
		});

		// Vérifier que l'utilisateur est bien l'entreprise concernée
		const requestedCompanyId = parseInt(req.params.companyId);
		const userCompanyId = req.user.sub;

		logger.debug('[GET /applications/company/:companyId] Vérification des permissions', {
			requestedCompanyId,
			userCompanyId,
			userRole: req.user.role,
			match: req.user.role === 'company' && userCompanyId === requestedCompanyId,
		});

		if (req.user.role !== 'company' || userCompanyId !== requestedCompanyId) {
			logger.warn('[GET /applications/company/:companyId] Accès refusé', {
				role: req.user.role,
				userId: userCompanyId,
				requestedId: requestedCompanyId,
			});
			return res.status(403).json({ error: 'Accès refusé' });
		}

		// Récupérer les filtres
		const { status, jobId } = req.query;
		const filters = {};
		if (status) filters.status = status;
		if (jobId) filters.jobId = parseInt(jobId);

		logger.debug('[GET /applications/company/:companyId] Filtres appliqués', {
			filters,
		});

		// Récupérer les candidatures
		logger.debug('[GET /applications/company/:companyId] Appel getApplicationsByCompany', {
			companyId: requestedCompanyId,
			filters,
		});

		let applications;
		try {
			applications = await getApplicationsByCompany(requestedCompanyId, filters);
		} catch (getApplicationsError) {
			logger.error('[GET /applications/company/:companyId] Erreur dans getApplicationsByCompany', {
				error: getApplicationsError.message,
				stack: getApplicationsError.stack,
				errorName: getApplicationsError.name,
				errorCode: getApplicationsError.code,
				errorDetails: getApplicationsError.details,
				errorHint: getApplicationsError.hint,
				companyId: requestedCompanyId,
			});
			throw getApplicationsError;
		}

		logger.debug('[GET /applications/company/:companyId] Candidatures récupérées', {
			count: applications.length,
			companyId: requestedCompanyId,
		});

		res.json({ data: applications });
	} catch (error) {
		// Log détaillé de l'erreur
		logger.error('[GET /applications/company/:companyId] Erreur serveur complète');
		logger.error('Message:', error.message);
		logger.error('Nom:', error.name);
		logger.error('Code:', error.code);
		logger.error('Détails:', error.details);
		logger.error('Hint:', error.hint);
		logger.error('Stack:', error.stack);
		logger.error('CompanyId:', req.params.companyId);
		logger.error('UserRole:', req.user?.role);
		logger.error('UserId:', req.user?.sub);

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
 * PUT /applications/:jobId/status (protégée)
 *
 * AMÉLIORATION FRONTEND: Cette route a été améliorée pour :
 * - Accepter les nouvelles colonnes (notes, interview_date, is_archived)
 * - Étendre les statuts valides (reviewed, withdrawn, archived)
 * - Valider les données d'entrée
 * - Ajouter des logs détaillés pour le débogage
 *
 * Body: {
 *   status,
 *   notes?,
 *   interview_date?,
 *   is_archived?
 * }
 * Met à jour le statut d'une candidature et les informations associées
 */
router.put('/:jobId/status', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		logger.debug(
			`[PUT /applications/:jobId/status] Mise à jour candidature - Utilisateur: ${req.user.sub}, Job: ${req.params.jobId}`
		);
		logger.debug(`[PUT /applications/:jobId/status] Données reçues:`, req.body);

		// EXTRACTION: Récupérer les données de la requête
		const { status, notes, interview_date, is_archived } = req.body || {};

		// VALIDATION: Vérifier que le statut est fourni
		if (!status) {
			logger.debug(`[PUT /applications/:jobId/status] Erreur: status manquant`);
			return res.status(400).json({ error: 'status est requis' });
		}

		// VALIDATION: Vérifier que le statut est valide (statuts étendus)
		const validStatuses = [
			'pending',
			'reviewed',
			'interview',
			'accepted',
			'rejected',
			'withdrawn',
			'archived',
		];
		if (!validStatuses.includes(status)) {
			logger.debug(`[PUT /applications/:jobId/status] Erreur: statut invalide - ${status}`);
			return res.status(400).json({
				error: `Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`,
			});
		}

		// PRÉPARATION: Construire les données supplémentaires
		const additionalData = {};
		if (notes !== undefined) additionalData.notes = notes;
		if (interview_date !== undefined) additionalData.interview_date = interview_date;
		if (is_archived !== undefined) additionalData.is_archived = is_archived;

		// MISE À JOUR: Exécuter la mise à jour avec toutes les données
		const updated = await updateApplicationStatus(
			req.user.sub,
			req.params.jobId,
			status,
			additionalData
		);

		if (!updated) {
			logger.debug(
				`[PUT /applications/:jobId/status] Candidature introuvable - Utilisateur: ${req.user.sub}, Job: ${req.params.jobId}`
			);
			return res.status(404).json({ error: 'Candidature introuvable' });
		}

		logger.debug(
			`[PUT /applications/:jobId/status] Candidature mise à jour avec succès - ID: ${updated.id_user}-${updated.id_job_offer}`
		);
		res.json({ data: updated });
	} catch (error) {
		logger.error('[PUT /applications/:jobId/status] Erreur serveur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /applications/:jobId/status/company (protégée - entreprises uniquement)
 * Permet aux entreprises de mettre à jour le statut des candidatures qu'elles reçoivent
 * Body: {
 *   status,
 *   notes?,
 *   interview_date?,
 *   is_archived?
 * }
 */
router.put('/:jobId/status/company', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		logger.debug(
			`[PUT /applications/:jobId/status/company] Mise à jour par entreprise - Entreprise: ${req.user.sub}, Job: ${req.params.jobId}`
		);
		logger.debug(`[PUT /applications/:jobId/status/company] Données reçues:`, req.body);

		// Vérifier que l'utilisateur est une entreprise
		if (req.user.role !== 'company') {
			logger.debug(
				`[PUT /applications/:jobId/status/company] Erreur: accès refusé - Role: ${req.user.role}`
			);
			return res.status(403).json({ error: 'Accès refusé - Entreprises uniquement' });
		}

		// EXTRACTION: Récupérer les données de la requête
		const { status, notes, interview_date, is_archived } = req.body || {};

		// VALIDATION: Vérifier que le statut est fourni
		if (!status) {
			logger.debug(`[PUT /applications/:jobId/status/company] Erreur: status manquant`);
			return res.status(400).json({ error: 'status est requis' });
		}

		// VALIDATION: Vérifier que le statut est valide
		const validStatuses = [
			'pending',
			'reviewed',
			'interview',
			'accepted',
			'rejected',
			'withdrawn',
			'archived',
		];
		if (!validStatuses.includes(status)) {
			logger.debug(`[PUT /applications/:jobId/status/company] Erreur: statut invalide - ${status}`);
			return res.status(400).json({
				error: `Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`,
			});
		}

		// Vérifier que l'offre d'emploi appartient à l'entreprise
		const { data: jobOffer, error: jobError } = await supabase
			.from('job_offer')
			.select('id_company')
			.eq('id_job_offer', req.params.jobId)
			.single();

		if (jobError || !jobOffer) {
			logger.debug(
				`[PUT /applications/:jobId/status/company] Erreur: offre d'emploi introuvable - Job: ${req.params.jobId}`
			);
			return res.status(404).json({ error: "Offre d'emploi introuvable" });
		}

		if (jobOffer.id_company !== req.user.sub) {
			logger.debug(
				`[PUT /applications/:jobId/status/company] Erreur: accès refusé - Entreprise: ${req.user.sub}, Propriétaire: ${jobOffer.id_company}`
			);
			return res.status(403).json({ error: 'Accès refusé - Cette offre ne vous appartient pas' });
		}

		// Récupérer l'ID de l'utilisateur depuis le body de la requête
		const { id_user } = req.body || {};

		if (!id_user) {
			logger.debug(`[PUT /applications/:jobId/status/company] Erreur: id_user manquant`);
			return res.status(400).json({ error: 'id_user est requis' });
		}

		// Mise à jour du statut pour la candidature spécifique
		const updateData = { status };
		if (notes !== undefined) updateData.notes = notes;
		if (interview_date !== undefined) updateData.interview_date = interview_date;
		if (is_archived !== undefined) updateData.is_archived = is_archived;

		const { data: updated, error: updateError } = await supabase
			.from('apply')
			.update(updateData)
			.eq('id_job_offer', req.params.jobId)
			.eq('id_user', id_user)
			.select('*')
			.single();

		if (updateError) {
			logger.error(`[PUT /applications/:jobId/status/company] Erreur Supabase:`, updateError);
			return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
		}

		if (!updated) {
			logger.debug(
				`[PUT /applications/:jobId/status/company] Aucune candidature trouvée - Job: ${req.params.jobId}`
			);
			return res.status(404).json({ error: 'Aucune candidature trouvée pour cette offre' });
		}

		logger.debug(
			`[PUT /applications/:jobId/status/company] Statut mis à jour avec succès - Job: ${req.params.jobId}, Status: ${status}`
		);
		res.json({ data: updated });
	} catch (error) {
		logger.error('[PUT /applications/:jobId/status/company] Erreur serveur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /applications/:jobId/archive (protégée)
 * Archive ou désarchive une candidature
 * Body: { is_archived: boolean }
 */
router.put('/:jobId/archive', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		const { is_archived } = req.body || {};

		if (typeof is_archived !== 'boolean') {
			return res.status(400).json({ error: 'is_archived doit être un booléen' });
		}

		// Mise à jour directe du flag is_archived sans changer le statut
		const { data, error } = await supabase
			.from('apply')
			.update({ is_archived })
			.eq('id_user', req.user.sub)
			.eq('id_job_offer', req.params.jobId)
			.select()
			.single();

		if (error) {
			throw error;
		}

		const updated = data;
		if (!updated) {
			return res.status(404).json({ error: 'Candidature introuvable' });
		}

		res.json({ data: updated });
	} catch (error) {
		logger.error('PUT /applications/:jobId/archive error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /applications/:jobId (protégée)
 * Supprime une candidature
 */
router.delete('/:jobId', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		const deleted = await removeApplication(req.user.sub, req.params.jobId);
		if (!deleted) {
			return res.status(404).json({ error: 'Candidature introuvable' });
		}

		res.status(204).send(); // No Content
	} catch (error) {
		logger.error('DELETE /applications/:jobId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /applications/stats (protégée - admin seulement)
 * Statistiques des candidatures
 */
router.get('/stats', auth(['admin']), async (req, res) => {
	try {
		const stats = await getApplicationStats();
		res.json({ data: stats });
	} catch (error) {
		logger.error('GET /applications/stats error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /applications/:jobId/bookmark (protégée)
 * Marquer/démarquer une candidature comme favori
 */
router.put('/:jobId/bookmark', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		logger.debug(
			`[PUT /applications/:jobId/bookmark] Toggle bookmark - Utilisateur: ${req.user.sub}, Job: ${req.params.jobId}`
		);

		const { is_bookmarked } = req.body;

		if (typeof is_bookmarked !== 'boolean') {
			return res.status(400).json({ error: 'is_bookmarked doit être un booléen' });
		}

		// Pour l'instant, on simule la fonctionnalité
		// TODO: Ajouter une colonne is_bookmarked dans la table apply
		res.json({
			data: {
				jobId: req.params.jobId,
				is_bookmarked,
				message: is_bookmarked
					? 'Candidature ajoutée aux favoris'
					: 'Candidature retirée des favoris',
			},
		});
	} catch (error) {
		logger.error('[PUT /applications/:jobId/bookmark] Erreur serveur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /applications/:jobId/feedback-request (protégée)
 * Demander un retour détaillé sur une candidature
 */
router.post('/:jobId/feedback-request', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		logger.debug(
			`[POST /applications/:jobId/feedback-request] Demande de retour - Utilisateur: ${req.user.sub}, Job: ${req.params.jobId}`
		);

		// Pour l'instant, on simule la fonctionnalité
		// TODO: Implémenter l'envoi d'email au recruteur
		res.json({
			data: {
				jobId: req.params.jobId,
				message: 'Demande de retour envoyée au recruteur',
			},
		});
	} catch (error) {
		logger.error('[POST /applications/:jobId/feedback-request] Erreur serveur:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
