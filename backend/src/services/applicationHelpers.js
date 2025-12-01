/**
 * Fonctions utilitaires pour applicationStore.js
 * Découpage de applicationStore.js pour améliorer la maintenabilité
 */

import supabase from '../database/db.js';
import logger from '../utils/logger.js';
import { calculateMatchingScore } from './matchingStore.js';

const BUCKET = process.env.SUPABASE_BUCKET || 'user_files';

/**
 * Récupère et assigne les documents aux candidatures
 * @param {Array} applications - Liste des candidatures
 * @returns {Promise<Array>} - Candidatures avec documents assignés
 */
export async function enrichApplicationsWithDocuments(applications) {
	if (!applications || applications.length === 0) {
		logger.debug('[enrichApplicationsWithDocuments] Aucune candidature à enrichir');
		return applications;
	}

	try {
		// Récupérer tous les documents pour toutes les candidatures en une seule requête
		const userIds = [...new Set(applications.map((app) => app.id_user))];
		const jobIds = [...new Set(applications.map((app) => app.id_job_offer))];

		logger.debug('[enrichApplicationsWithDocuments] Début enrichissement', {
			applicationsCount: applications.length,
			userIdsCount: userIds.length,
			jobIdsCount: jobIds.length,
			userIds: userIds.slice(0, 5), // Log seulement les 5 premiers
			jobIds: jobIds.slice(0, 5),
		});

		const { data: allDocuments, error: docError } = await supabase
			.from('application_documents')
			.select('*')
			.in('id_user', userIds)
			.in('id_job_offer', jobIds);

		if (docError) {
			logger.error('[enrichApplicationsWithDocuments] Erreur Supabase', {
				error: docError.message,
				code: docError.code,
				details: docError.details,
				hint: docError.hint,
			});
		}

		if (!docError && allDocuments) {
			logger.debug('[enrichApplicationsWithDocuments] Documents récupérés', {
				documentsCount: allDocuments.length,
			});
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
			for (const application of applications) {
				const key = `${application.id_user}-${application.id_job_offer}`;
				application.application_documents = documentsByApplication[key] || [];
				if (application.application_documents.length > 0) {
					logger.debug(
						`[enrichApplicationsWithDocuments] ${application.application_documents.length} documents assignés à la candidature ${key}`
					);
				}
			}
		} else {
			logger.warn('[enrichApplicationsWithDocuments] Aucun document trouvé ou erreur', {
				hasError: !!docError,
				error: docError
					? {
							message: docError.message,
							code: docError.code,
						}
					: null,
			});
			// Initialiser avec des tableaux vides
			for (const application of applications) {
				application.application_documents = [];
			}
		}
	} catch (docFetchError) {
		logger.error('[enrichApplicationsWithDocuments] Exception lors de la récupération', {
			error: docFetchError.message,
			stack: docFetchError.stack,
			errorName: docFetchError.name,
		});
		// Initialiser avec des tableaux vides
		for (const application of applications) {
			application.application_documents = [];
		}
	}

	logger.debug('[enrichApplicationsWithDocuments] Enrichissement terminé', {
		applicationsCount: applications.length,
	});

	return applications;
}

/**
 * Résout les URLs des CV existants (file_url === 'existing_cv') pour toutes les candidatures
 * @param {Array} applications - Liste des candidatures
 * @returns {Promise<Array>} - Candidatures avec URLs CV résolues
 */
export async function resolveExistingCVUrls(applications) {
	if (!applications || applications.length === 0) {
		logger.debug('[resolveExistingCVUrls] Aucune candidature à traiter');
		return applications;
	}

	logger.debug('[resolveExistingCVUrls] Début résolution URLs CV', {
		applicationsCount: applications.length,
	});

	// Identifier les utilisateurs avec CV existants
	const usersWithExistingCV = [];
	for (const application of applications) {
		if (application.application_documents && Array.isArray(application.application_documents)) {
			for (const doc of application.application_documents) {
				if (doc.document_type === 'cv' && doc.file_url === 'existing_cv') {
					usersWithExistingCV.push(application.id_user);
					break; // Un seul par candidature
				}
			}
		}
	}

	logger.debug('[resolveExistingCVUrls] Utilisateurs avec CV existants identifiés', {
		count: usersWithExistingCV.length,
		userIds: [...new Set(usersWithExistingCV)].slice(0, 5),
	});

	// Récupérer tous les CV existants en une seule requête
	if (usersWithExistingCV.length > 0) {
		const uniqueUserIds = [...new Set(usersWithExistingCV)];
		try {
			logger.debug('[resolveExistingCVUrls] Requête Supabase pour récupérer les CV', {
				userIdsCount: uniqueUserIds.length,
			});

			const { data: userFiles, error: fileError } = await supabase
				.from('user_files')
				.select('id_user, file_url')
				.in('id_user', uniqueUserIds)
				.eq('file_type', 'cv')
				.order('uploaded_at', { ascending: false });

			if (fileError) {
				logger.error('[resolveExistingCVUrls] Erreur Supabase', {
					error: fileError.message,
					code: fileError.code,
					details: fileError.details,
				});
			}

			if (!fileError && userFiles) {
				logger.debug('[resolveExistingCVUrls] CV récupérés', {
					filesCount: userFiles.length,
				});
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
				for (const application of applications) {
					if (
						application.application_documents &&
						Array.isArray(application.application_documents)
					) {
						for (const doc of application.application_documents) {
							if (doc.document_type === 'cv' && doc.file_url === 'existing_cv') {
								if (cvMap[application.id_user]) {
									doc.file_url = cvMap[application.id_user];
									logger.debug(
										`[resolveExistingCVUrls] URL CV existant résolue pour user ${application.id_user}: ${doc.file_url}`
									);
								} else {
									logger.warn(
										`[resolveExistingCVUrls] CV existant non trouvé dans user_files pour user ${application.id_user}`
									);
									doc.file_url = null;
								}
							}
						}
					}
				}
			} else {
				logger.warn('[resolveExistingCVUrls] Aucun CV trouvé ou erreur', {
					hasError: !!fileError,
					error: fileError
						? {
								message: fileError.message,
								code: fileError.code,
							}
						: null,
				});
			}
		} catch (resolveError) {
			logger.error('[resolveExistingCVUrls] Exception lors de la résolution', {
				error: resolveError.message,
				stack: resolveError.stack,
				errorName: resolveError.name,
			});
		}
	} else {
		logger.debug('[resolveExistingCVUrls] Aucun utilisateur avec CV existant à traiter');
	}

	logger.debug('[resolveExistingCVUrls] Résolution terminée', {
		applicationsCount: applications.length,
	});

	return applications;
}

/**
 * Calcule les scores de matching pour toutes les candidatures en parallèle
 * @param {Array} applications - Liste des candidatures
 * @returns {Promise<Array>} - Candidatures avec scores de matching
 */
export async function calculateMatchingScores(applications) {
	if (!applications || applications.length === 0) {
		logger.debug('[calculateMatchingScores] Aucune candidature à traiter');
		return applications;
	}

	logger.debug('[calculateMatchingScores] Début calcul des scores', {
		applicationsCount: applications.length,
	});

	// Calculer le score de matching pour chaque candidature en parallèle (optimisation N+1)
	// Utiliser Promise.allSettled pour gérer les erreurs individuellement sans bloquer les autres calculs
	const matchingPromises = applications.map(async (application, index) => {
		if (application.user_ && application.job_offer) {
			try {
				logger.debug('[calculateMatchingScores] Calcul score pour candidature', {
					index,
					id_user: application.id_user,
					id_job_offer: application.id_job_offer,
				});

				const matchingResult = await calculateMatchingScore(
					application.user_,
					application.job_offer
				);
				application.matchScore = matchingResult.score || 50;

				logger.debug('[calculateMatchingScores] Score calculé', {
					index,
					score: application.matchScore,
				});
			} catch (error) {
				logger.error('[calculateMatchingScores] Erreur calcul matching', {
					index,
					id_user: application.id_user,
					id_job_offer: application.id_job_offer,
					error: error.message,
					stack: error.stack,
				});
				application.matchScore = 50; // Score par défaut en cas d'erreur
			}
		} else {
			logger.debug('[calculateMatchingScores] Données manquantes pour candidature', {
				index,
				hasUser: !!application.user_,
				hasJobOffer: !!application.job_offer,
			});
			application.matchScore = 50; // Score par défaut si données manquantes
		}
		return application;
	});

	// Attendre que tous les calculs soient terminés (même en cas d'erreur sur certains)
	// Promise.allSettled garantit que toutes les promesses sont résolues, même en cas d'erreur
	const results = await Promise.allSettled(matchingPromises);

	// Logger les erreurs éventuelles sans bloquer
	results.forEach((result, index) => {
		if (result.status === 'rejected') {
			logger.warn('[calculateMatchingScores] Candidature rejetée', {
				index,
				reason: result.reason?.message || result.reason,
			});
		}
	});

	logger.debug('[calculateMatchingScores] Calcul terminé', {
		applicationsCount: applications.length,
		fulfilled: results.filter((r) => r.status === 'fulfilled').length,
		rejected: results.filter((r) => r.status === 'rejected').length,
	});

	// Retourner les applications avec leurs scores
	return results.map((result) =>
		result.status === 'fulfilled' ? result.value : applications[results.indexOf(result)]
	);
}
