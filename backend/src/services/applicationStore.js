import supabase from '../database/db.js';
import logger from '../utils/logger.js';
import { sanitizeSearchParam } from '../utils/validators.js';
import {
	enrichApplicationsWithDocuments,
	resolveExistingCVUrls,
	calculateMatchingScores,
} from './applicationHelpers.js';

/**
 * Créer une nouvelle candidature
 * @param {Object} applicationData - Données de la candidature
 * @returns {Object} - Candidature créée
 */
export async function createApplication(applicationData) {
	try {
		const { data, error } = await supabase
			.from('apply')
			.insert([applicationData])
			.select()
			.single();

		if (error) {
			logger.error('createApplication error:', error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error('createApplication error:', err);
		throw err;
	}
}

/**
 * Récupérer les candidatures d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Array} - Liste des candidatures
 */
export async function getApplicationsByUser(userId) {
	try {
		// Requête simplifiée pour éviter les erreurs de relation
		// On récupère d'abord les candidatures avec les infos de base de l'offre
		const { data, error } = await supabase
			.from('apply')
			.select(
				`
				*,
				job_offer!inner(
					id_job_offer,
					title,
					description,
					location,
					contract_type,
					salary_min,
					salary_max,
					salary,
					remote,
					experience,
					industry,
					education,
					formation_required,
					requirements,
					benefits,
					urgency,
					published_at,
					id_company,
					company!inner(
						id_company,
						name,
						logo
					)
				)
			`
			)
			.eq('id_user', userId)
			.order('application_date', { ascending: false });

		if (error) {
			logger.error('getApplicationsByUser error:', error);
			// Si l'erreur vient de la relation company, on essaie sans
			if (error.message && error.message.includes('company')) {
				logger.warn('getApplicationsByUser: Tentative sans relation company');
				const { data: dataWithoutCompany, error: errorWithoutCompany } = await supabase
					.from('apply')
					.select(
						`
						*,
						job_offer!inner(
							id_job_offer,
							title,
							description,
							location,
							contract_type,
							salary_min,
							salary_max,
							salary,
							remote,
							experience,
							industry,
							education,
							formation_required,
							requirements,
							benefits,
							urgency,
							published_at,
							id_company
						)
					`
					)
					.eq('id_user', userId)
					.order('application_date', { ascending: false });

				if (errorWithoutCompany) {
					logger.error('getApplicationsByUser error (sans company):', errorWithoutCompany);
					throw errorWithoutCompany;
				}

				// Enrichir avec les données de l'entreprise séparément si nécessaire
				return dataWithoutCompany || [];
			}
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error('getApplicationsByUser error:', err);
		throw err;
	}
}

/**
 * Récupérer les candidatures pour une offre d'emploi
 * @param {number} jobId - ID de l'offre d'emploi
 * @returns {Array} - Liste des candidatures
 */
export async function getApplicationsByJob(jobId) {
	try {
		const { data, error } = await supabase
			.from('apply')
			.select(
				`
				*,
				user_!inner(
					id_user,
					firstname,
					lastname,
					email
				)
			`
			)
			.eq('id_job_offer', jobId)
			.order('application_date', { ascending: false });

		if (error) {
			logger.error('getApplicationsByJob error:', error);
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error('getApplicationsByJob error:', err);
		throw err;
	}
}

/**
 * Récupérer les candidatures pour une entreprise
 * @param {number} companyId - ID de l'entreprise
 * @param {Object} filters - Filtres optionnels (status, jobId)
 * @returns {Array} - Liste des candidatures avec documents
 */
export async function getApplicationsByCompany(companyId, filters = {}) {
	try {
		logger.debug(`[getApplicationsByCompany] Début - Company: ${companyId}, Filters:`, filters);

		// D'abord récupérer les IDs des offres d'emploi de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', companyId);

		if (jobsError) {
			logger.error(
				'[getApplicationsByCompany] Erreur lors de la récupération des offres:',
				jobsError
			);
			throw jobsError;
		}

		if (!companyJobs || companyJobs.length === 0) {
			logger.debug(
				`[getApplicationsByCompany] Aucune offre trouvée pour l'entreprise ${companyId}`
			);
			return [];
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Si un filtre jobId est spécifié, vérifier qu'il appartient à l'entreprise
		if (filters.jobId && !jobIds.includes(filters.jobId)) {
			logger.debug(
				`[getApplicationsByCompany] L'offre ${filters.jobId} n'appartient pas à l'entreprise ${companyId}`
			);
			return [];
		}

		// Construire la requête pour récupérer les candidatures
		let query = supabase
			.from('apply')
			.select(
				`
				*,
				user_!inner(
					id_user,
					firstname,
					lastname,
					email,
					phone,
					city,
					country,
					job_title,
					experience_level,
					skills,
					portfolio_link,
					linkedin_link,
					bio_pro,
					availability
				),
				job_offer!inner(
					id_job_offer,
					title,
					description,
					experience,
					industry,
					location,
					remote,
					contract_type,
					salary_min,
					salary_max,
					requirements,
					id_company,
					company!inner(
						id_company,
						name
					)
				)
			`
			)
			.in('id_job_offer', jobIds);

		// Appliquer les filtres
		if (filters.status) {
			query = query.eq('status', filters.status);
			logger.debug(`[getApplicationsByCompany] Filtre status appliqué: ${filters.status}`);
		}

		if (filters.jobId) {
			query = query.eq('id_job_offer', filters.jobId);
			logger.debug(`[getApplicationsByCompany] Filtre jobId appliqué: ${filters.jobId}`);
		}

		query = query.order('application_date', { ascending: false });

		const { data, error } = await query;

		if (error) {
			logger.error('[getApplicationsByCompany] Erreur Supabase:', error);
			throw error;
		}

		logger.debug(`[getApplicationsByCompany] ${data?.length || 0} candidatures récupérées`);

		// Enrichir les candidatures avec documents, CV et scores de matching
		if (data && data.length > 0) {
			// 1. Récupérer et assigner les documents
			await enrichApplicationsWithDocuments(data);

			// 2. Résoudre les URLs des CV existants
			await resolveExistingCVUrls(data);

			// 3. Calculer les scores de matching en parallèle
			await calculateMatchingScores(data);

			// Log pour déboguer la structure des documents
			if (data.length > 0) {
				logger.debug(`[getApplicationsByCompany] Exemple de structure - Premier élément:`, {
					id_user: data[0].id_user,
					id_job_offer: data[0].id_job_offer,
					matchScore: data[0].matchScore,
					application_documents: data[0].application_documents,
					user_: data[0].user_
						? {
								firstname: data[0].user_.firstname,
								lastname: data[0].user_.lastname,
								email: data[0].user_.email,
							}
						: null,
				});
			}
		}

		return data || [];
	} catch (err) {
		logger.error('[getApplicationsByCompany] Erreur:', err);
		throw err;
	}
}

/**
 * Mettre à jour le statut d'une candidature
 * @param {number} userId - ID de l'utilisateur
 * @param {number} jobId - ID de l'offre d'emploi
 * @param {string} status - Nouveau statut
 * @param {string} notes - Notes optionnelles
 * @returns {Object} - Candidature mise à jour
 */
export async function updateApplicationStatus(userId, jobId, status, notes = null) {
	try {
		const updateData = { status };
		if (notes !== null) {
			updateData.notes = notes;
		}

		const { data, error } = await supabase
			.from('apply')
			.update(updateData)
			.eq('id_user', userId)
			.eq('id_job_offer', jobId)
			.select()
			.single();

		if (error) {
			logger.error('updateApplicationStatus error:', error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error('updateApplicationStatus error:', err);
		throw err;
	}
}

/**
 * Supprimer une candidature
 * @param {number} userId - ID de l'utilisateur
 * @param {number} jobId - ID de l'offre d'emploi
 * @returns {boolean} - Succès de la suppression
 */
export async function removeApplication(userId, jobId) {
	try {
		const { error } = await supabase
			.from('apply')
			.delete()
			.eq('id_user', userId)
			.eq('id_job_offer', jobId);

		if (error) {
			logger.error('removeApplication error:', error);
			throw error;
		}

		return true;
	} catch (err) {
		logger.error('removeApplication error:', err);
		throw err;
	}
}

/**
 * Récupérer les statistiques des candidatures
 * @param {number} companyId - ID de l'entreprise (optionnel)
 * @returns {Object} - Statistiques des candidatures
 */
export async function getApplicationStats(companyId = null) {
	try {
		let query = supabase.from('apply').select('status, application_date');

		if (companyId) {
			query = query.eq('job_offer.company.id_company', companyId);
		}

		const { data, error } = await query;

		if (error) {
			logger.error('getApplicationStats error:', error);
			throw error;
		}

		const stats = {
			total: data.length,
			pending: 0,
			accepted: 0,
			rejected: 0,
			interview: 0,
			withdrawn: 0,
			archived: 0,
			recent: 0, // Candidatures des 7 derniers jours
		};

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		data.forEach((application) => {
			// Compter par statut
			if (Object.prototype.hasOwnProperty.call(stats, application.status)) {
				stats[application.status]++;
			}

			// Compter les candidatures récentes
			const applicationDate = new Date(application.application_date);
			if (applicationDate >= sevenDaysAgo) {
				stats.recent++;
			}
		});

		return stats;
	} catch (err) {
		logger.error('getApplicationStats error:', err);
		throw err;
	}
}

/**
 * Récupérer toutes les candidatures (pour l'admin)
 * @param {Object} options - Options de pagination et filtrage
 * @returns {Object} - Liste paginée des candidatures
 */
export async function getAllApplications(options = {}) {
	try {
		logger.debug('🔍 getAllApplications - Début avec options:', options);
		const { page = 1, limit = 20, search = null } = options;
		const offset = (page - 1) * limit;
		logger.debug('🔍 getAllApplications - Paramètres calculés:', { page, limit, offset, search });

		let query = supabase.from('apply').select(
			`
				*,
				user_!inner(
					id_user,
					firstname,
					lastname,
					email
				),
				job_offer!inner(
					id_job_offer,
					title,
					company!inner(
						id_company,
						name
					)
				)
			`,
			{ count: 'exact' }
		);

		// Filtre de recherche
		if (search) {
			const sanitizedSearch = sanitizeSearchParam(search, 200);
			logger.debug('🔍 getAllApplications - Ajout du filtre de recherche:', sanitizedSearch);
			query = query.or(
				`user_.firstname.ilike.%${sanitizedSearch}%,user_.lastname.ilike.%${sanitizedSearch}%,job_offer.title.ilike.%${sanitizedSearch}%,job_offer.company.name.ilike.%${sanitizedSearch}%`
			);
		}

		query = query.order('application_date', { ascending: false }).range(offset, offset + limit - 1);

		logger.debug('🔍 getAllApplications - Exécution de la requête Supabase...');
		const { data, error, count } = await query;
		logger.debug('🔍 getAllApplications - Résultat Supabase:', {
			dataLength: data?.length,
			error: error?.message || error,
			count,
			firstItem: data?.[0]
				? {
						id_user: data[0].id_user,
						id_job_offer: data[0].id_job_offer,
						user_: data[0].user_,
						job_offer: data[0].job_offer,
					}
				: null,
		});

		if (error) {
			logger.error('❌ getAllApplications error:', error);
			throw error;
		}

		// Enrichir les données avec les informations jointes
		logger.debug('🔍 getAllApplications - Enrichissement des données...');
		const enrichedData = (data || []).map((application) => ({
			...application,
			user_name:
				`${application.user_?.firstname || ''} ${application.user_?.lastname || ''}`.trim(),
			job_title: application.job_offer?.title || '',
			company_name: application.job_offer?.company?.name || '',
			user_email: application.user_?.email || '',
			profile_picture: null, // Pas de colonne profile_picture dans la table user_
		}));

		const result = {
			data: enrichedData,
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages: Math.ceil((count || 0) / limit),
			},
		};

		logger.debug('✅ getAllApplications - Résultat final:', {
			dataLength: result.data.length,
			pagination: result.pagination,
			firstItem: result.data[0]
				? {
						id_user: result.data[0].id_user,
						id_job_offer: result.data[0].id_job_offer,
						user_name: result.data[0].user_name,
						job_title: result.data[0].job_title,
						company_name: result.data[0].company_name,
					}
				: null,
		});

		return result;
	} catch (err) {
		logger.error('❌ getAllApplications error:', err);
		throw err;
	}
}
