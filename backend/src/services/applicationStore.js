import supabase from "../database/db.js";
import logger from "../utils/logger.js";
import { calculateMatchingScore } from "./matchingStore.js";

const BUCKET = process.env.SUPABASE_BUCKET || "user_files";

/**
 * Créer une nouvelle candidature
 * @param {Object} applicationData - Données de la candidature
 * @returns {Object} - Candidature créée
 */
export async function createApplication(applicationData) {
	try {
		const { data, error } = await supabase
			.from("apply")
			.insert([applicationData])
			.select()
			.single();

		if (error) {
			logger.error("createApplication error:", error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error("createApplication error:", err);
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
			.from("apply")
			.select(`
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
			`)
			.eq("id_user", userId)
			.order("application_date", { ascending: false });

		if (error) {
			logger.error("getApplicationsByUser error:", error);
			// Si l'erreur vient de la relation company, on essaie sans
			if (error.message && error.message.includes('company')) {
				logger.warn("getApplicationsByUser: Tentative sans relation company");
				const { data: dataWithoutCompany, error: errorWithoutCompany } = await supabase
					.from("apply")
					.select(`
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
					`)
					.eq("id_user", userId)
					.order("application_date", { ascending: false });
				
				if (errorWithoutCompany) {
					logger.error("getApplicationsByUser error (sans company):", errorWithoutCompany);
					throw errorWithoutCompany;
				}
				
				// Enrichir avec les données de l'entreprise séparément si nécessaire
				return dataWithoutCompany || [];
			}
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error("getApplicationsByUser error:", err);
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
			.from("apply")
			.select(`
				*,
				user_!inner(
					id_user,
					firstname,
					lastname,
					email
				)
			`)
			.eq("id_job_offer", jobId)
			.order("application_date", { ascending: false });

		if (error) {
			logger.error("getApplicationsByJob error:", error);
			throw error;
		}

		return data || [];
	} catch (err) {
		logger.error("getApplicationsByJob error:", err);
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
		
		// Construire la requête SANS les documents (relation non définie dans Supabase)
		// Les documents seront récupérés manuellement après
		let query = supabase
			.from("apply")
			.select(`
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
					company!inner(
						id_company,
						name
					)
				)
			`)
			.eq("job_offer.company.id_company", companyId);

		// Appliquer les filtres
		if (filters.status) {
			query = query.eq("status", filters.status);
			logger.debug(`[getApplicationsByCompany] Filtre status appliqué: ${filters.status}`);
		}

		if (filters.jobId) {
			query = query.eq("id_job_offer", filters.jobId);
			logger.debug(`[getApplicationsByCompany] Filtre jobId appliqué: ${filters.jobId}`);
		}

		query = query.order("application_date", { ascending: false });

		const { data, error } = await query;

		if (error) {
			logger.error("[getApplicationsByCompany] Erreur Supabase:", error);
			throw error;
		}

		logger.debug(`[getApplicationsByCompany] ${data?.length || 0} candidatures récupérées`);
		
		// Récupérer les documents manuellement pour toutes les candidatures
		// (la relation n'est pas définie dans Supabase, donc on ne peut pas faire de JOIN)
		if (data && data.length > 0) {
			try {
				// Récupérer tous les documents pour toutes les candidatures en une seule requête
				const userIds = [...new Set(data.map(app => app.id_user))];
				const jobIds = [...new Set(data.map(app => app.id_job_offer))];
				
				logger.debug(`[getApplicationsByCompany] Récupération documents pour ${userIds.length} utilisateurs et ${jobIds.length} offres`);
				
				const { data: allDocuments, error: docError } = await supabase
					.from('application_documents')
					.select('*')
					.in('id_user', userIds)
					.in('id_job_offer', jobIds);

				if (!docError && allDocuments) {
					// Grouper les documents par candidature (id_user + id_job_offer)
					const documentsByApplication = {};
					for (const doc of allDocuments) {
						const key = `${doc.id_user}-${doc.id_job_offer}`;
						if (!documentsByApplication[key]) {
							documentsByApplication[key] = [];
						}
						documentsByApplication[key].push(doc);
					}

					// Assigner les documents à chaque candidature
					for (const application of data) {
						const key = `${application.id_user}-${application.id_job_offer}`;
						application.application_documents = documentsByApplication[key] || [];
						if (application.application_documents.length > 0) {
							logger.debug(`[getApplicationsByCompany] ${application.application_documents.length} documents assignés à la candidature ${key}`);
						}
					}
				} else {
					logger.warn(`[getApplicationsByCompany] Erreur récupération documents:`, docError);
					// Initialiser avec des tableaux vides
					for (const application of data) {
						application.application_documents = [];
					}
				}
			} catch (docFetchError) {
				logger.error(`[getApplicationsByCompany] Erreur récupération documents:`, docFetchError);
				// Initialiser avec des tableaux vides
				for (const application of data) {
					application.application_documents = [];
				}
			}

			// Résoudre les URLs des CV existants (file_url === 'existing_cv') pour toutes les candidatures
			// Récupérer tous les CV existants en une seule requête pour optimiser
			const usersWithExistingCV = [];
			for (const application of data) {
				if (application.application_documents && Array.isArray(application.application_documents)) {
					for (const doc of application.application_documents) {
						if (doc.document_type === 'cv' && doc.file_url === 'existing_cv') {
							usersWithExistingCV.push(application.id_user);
							break; // Un seul par candidature
						}
					}
				}
			}

			// Récupérer tous les CV existants en une seule requête
			if (usersWithExistingCV.length > 0) {
				const uniqueUserIds = [...new Set(usersWithExistingCV)];
				try {
					const { data: userFiles, error: fileError } = await supabase
						.from('user_files')
						.select('id_user, file_url')
						.in('id_user', uniqueUserIds)
						.eq('file_type', 'cv')
						.order('uploaded_at', { ascending: false });

					if (!fileError && userFiles) {
						// Créer un map pour accès rapide
						const cvMap = {};
						for (const file of userFiles) {
							if (!cvMap[file.id_user]) {
								// Construire l'URL publique depuis Supabase Storage
								const { data: publicUrlData } = supabase.storage
									.from(BUCKET)
									.getPublicUrl(file.file_url);
								cvMap[file.id_user] = publicUrlData.publicUrl;
							}
						}

						// Assigner les URLs résolues
						for (const application of data) {
							if (application.application_documents && Array.isArray(application.application_documents)) {
								for (const doc of application.application_documents) {
									if (doc.document_type === 'cv' && doc.file_url === 'existing_cv') {
										if (cvMap[application.id_user]) {
											doc.file_url = cvMap[application.id_user];
											logger.debug(`[getApplicationsByCompany] URL CV existant résolue pour user ${application.id_user}: ${doc.file_url}`);
										} else {
											logger.warn(`[getApplicationsByCompany] CV existant non trouvé dans user_files pour user ${application.id_user}`);
											doc.file_url = null;
										}
									}
								}
							}
						}
					} else {
						logger.warn(`[getApplicationsByCompany] Erreur récupération CV existants:`, fileError);
					}
				} catch (resolveError) {
					logger.error(`[getApplicationsByCompany] Erreur résolution URLs CV existants:`, resolveError);
				}
			}
			
			// Calculer le score de matching pour chaque candidature
			for (const application of data) {
				if (application.user_ && application.job_offer) {
					try {
						const matchingResult = await calculateMatchingScore(application.user_, application.job_offer);
						application.matchScore = matchingResult.score || 50;
					} catch (error) {
						logger.error(`[getApplicationsByCompany] Erreur calcul matching pour ${application.id_user}/${application.id_job_offer}:`, error);
						application.matchScore = 50; // Score par défaut en cas d'erreur
					}
				} else {
					application.matchScore = 50; // Score par défaut si données manquantes
				}
			}
			
			// Log pour déboguer la structure des documents
			if (data.length > 0) {
				logger.debug(`[getApplicationsByCompany] Exemple de structure - Premier élément:`, {
					id_user: data[0].id_user,
					id_job_offer: data[0].id_job_offer,
					matchScore: data[0].matchScore,
					application_documents: data[0].application_documents,
					user_: data[0].user_ ? {
						firstname: data[0].user_.firstname,
						lastname: data[0].user_.lastname,
						email: data[0].user_.email
					} : null
				});
			}
		}

		return data || [];
	} catch (err) {
		logger.error("[getApplicationsByCompany] Erreur:", err);
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
			.from("apply")
			.update(updateData)
			.eq("id_user", userId)
			.eq("id_job_offer", jobId)
			.select()
			.single();

		if (error) {
			logger.error("updateApplicationStatus error:", error);
			throw error;
		}

		return data;
	} catch (err) {
		logger.error("updateApplicationStatus error:", err);
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
			.from("apply")
			.delete()
			.eq("id_user", userId)
			.eq("id_job_offer", jobId);

		if (error) {
			logger.error("removeApplication error:", error);
			throw error;
		}

		return true;
	} catch (err) {
		logger.error("removeApplication error:", err);
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
		let query = supabase
			.from("apply")
			.select("status, application_date");

		if (companyId) {
			query = query.eq("job_offer.company.id_company", companyId);
		}

		const { data, error } = await query;

		if (error) {
			logger.error("getApplicationStats error:", error);
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
			recent: 0 // Candidatures des 7 derniers jours
		};

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		data.forEach(application => {
			// Compter par statut
			if (stats.hasOwnProperty(application.status)) {
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
		logger.error("getApplicationStats error:", err);
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

		let query = supabase
			.from("apply")
			.select(`
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
			`, { count: "exact" });

		// Filtre de recherche
		if (search) {
			logger.debug('🔍 getAllApplications - Ajout du filtre de recherche:', search);
			query = query.or(`user_.firstname.ilike.%${search}%,user_.lastname.ilike.%${search}%,job_offer.title.ilike.%${search}%,job_offer.company.name.ilike.%${search}%`);
		}

		query = query
			.order("application_date", { ascending: false })
			.range(offset, offset + limit - 1);

		logger.debug('🔍 getAllApplications - Exécution de la requête Supabase...');
		const { data, error, count } = await query;
		logger.debug('🔍 getAllApplications - Résultat Supabase:', { 
			dataLength: data?.length, 
			error: error?.message || error, 
			count,
			firstItem: data?.[0] ? {
				id_user: data[0].id_user,
				id_job_offer: data[0].id_job_offer,
				user_: data[0].user_,
				job_offer: data[0].job_offer
			} : null
		});

		if (error) {
			logger.error("❌ getAllApplications error:", error);
			throw error;
		}

		// Enrichir les données avec les informations jointes
		logger.debug('🔍 getAllApplications - Enrichissement des données...');
		const enrichedData = (data || []).map(application => ({
			...application,
			user_name: `${application.user_?.firstname || ''} ${application.user_?.lastname || ''}`.trim(),
			job_title: application.job_offer?.title || '',
			company_name: application.job_offer?.company?.name || '',
			user_email: application.user_?.email || '',
			profile_picture: null // Pas de colonne profile_picture dans la table user_
		}));

		const result = {
			data: enrichedData,
			pagination: {
				page,
				limit,
				total: count || 0,
				totalPages: Math.ceil((count || 0) / limit)
			}
		};

		logger.debug('✅ getAllApplications - Résultat final:', {
			dataLength: result.data.length,
			pagination: result.pagination,
			firstItem: result.data[0] ? {
				id_user: result.data[0].id_user,
				id_job_offer: result.data[0].id_job_offer,
				user_name: result.data[0].user_name,
				job_title: result.data[0].job_title,
				company_name: result.data[0].company_name
			} : null
		});

		return result;
	} catch (err) {
		logger.error("❌ getAllApplications error:", err);
		throw err;
	}
}
