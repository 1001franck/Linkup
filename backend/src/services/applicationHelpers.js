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
		return applications;
	}

	try {
		// Récupérer tous les documents pour toutes les candidatures en une seule requête
		const userIds = [...new Set(applications.map((app) => app.id_user))];
		const jobIds = [...new Set(applications.map((app) => app.id_job_offer))];

		logger.debug(
			`[enrichApplicationsWithDocuments] Récupération documents pour ${userIds.length} utilisateurs et ${jobIds.length} offres`
		);

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
			logger.warn(`[enrichApplicationsWithDocuments] Erreur récupération documents:`, docError);
			// Initialiser avec des tableaux vides
			for (const application of applications) {
				application.application_documents = [];
			}
		}
	} catch (docFetchError) {
		logger.error(`[enrichApplicationsWithDocuments] Erreur récupération documents:`, docFetchError);
		// Initialiser avec des tableaux vides
		for (const application of applications) {
			application.application_documents = [];
		}
	}

	return applications;
}

/**
 * Résout les URLs des CV existants (file_url === 'existing_cv') pour toutes les candidatures
 * @param {Array} applications - Liste des candidatures
 * @returns {Promise<Array>} - Candidatures avec URLs CV résolues
 */
export async function resolveExistingCVUrls(applications) {
	if (!applications || applications.length === 0) {
		return applications;
	}

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
				logger.warn(`[resolveExistingCVUrls] Erreur récupération CV existants:`, fileError);
			}
		} catch (resolveError) {
			logger.error(`[resolveExistingCVUrls] Erreur résolution URLs CV existants:`, resolveError);
		}
	}

	return applications;
}

/**
 * Calcule les scores de matching pour toutes les candidatures en parallèle
 * @param {Array} applications - Liste des candidatures
 * @returns {Promise<Array>} - Candidatures avec scores de matching
 */
export async function calculateMatchingScores(applications) {
	if (!applications || applications.length === 0) {
		return applications;
	}

	// Calculer le score de matching pour chaque candidature en parallèle (optimisation N+1)
	// Utiliser Promise.allSettled pour gérer les erreurs individuellement sans bloquer les autres calculs
	const matchingPromises = applications.map(async (application) => {
		if (application.user_ && application.job_offer) {
			try {
				const matchingResult = await calculateMatchingScore(
					application.user_,
					application.job_offer
				);
				application.matchScore = matchingResult.score || 50;
			} catch (error) {
				logger.error(
					`[calculateMatchingScores] Erreur calcul matching pour ${application.id_user}/${application.id_job_offer}:`,
					error
				);
				application.matchScore = 50; // Score par défaut en cas d'erreur
			}
		} else {
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
			logger.warn(
				`[calculateMatchingScores] Erreur calcul matching pour candidature ${index}:`,
				result.reason
			);
		}
	});

	// Retourner les applications avec leurs scores
	return results.map((result) =>
		result.status === 'fulfilled' ? result.value : applications[results.indexOf(result)]
	);
}
