import supabase from '../database/db.js';
import { getProfilePicture } from './userFilesStore.js';
import { calculateMatchingScore } from './matchingStore.js';
import logger from '../utils/logger.js';

/**
 * Service pour les statistiques spécifiques d'une entreprise
 * Gère les données dynamiques du dashboard entreprise
 */

/**
 * Récupère les statistiques complètes d'une entreprise
 * @param {number} id_company - ID de l'entreprise
 * @returns {Object} Statistiques de l'entreprise
 */
async function getCompanyDashboardStats(id_company) {
	try {
		// Récupérer toutes les données en parallèle
		const [
			jobsStats,
			applicationsStats,
			interviewsStats,
			hiredStats,
			recentApplications,
			activeJobs,
		] = await Promise.all([
			getJobsStats(id_company),
			getApplicationsStats(id_company),
			getInterviewsStats(id_company),
			getHiredStats(id_company),
			getRecentApplications(id_company),
			getActiveJobs(id_company),
		]);

		const stats = {
			// Statistiques principales
			totalJobs: jobsStats.total,
			activeJobs: jobsStats.active, // Nombre d'offres actives
			totalApplications: applicationsStats.total,
			newApplications: applicationsStats.thisWeek,
			interviewsScheduled: interviewsStats.total, // Total des entretiens programmés
			hiredCandidates: hiredStats.total, // Total des candidats embauchés

			// Données détaillées
			recentApplications,
			activeJobsList: activeJobs, // Liste des offres actives (renommé pour éviter le conflit)

			// Métadonnées
			generatedAt: new Date().toISOString(),
			companyId: id_company,
		};

		return stats;
	} catch (error) {
		logger.error(`[getCompanyDashboardStats] Erreur pour l'entreprise ${id_company}:`, error);
		throw error;
	}
}

/**
 * Statistiques des offres d'emploi de l'entreprise
 */
async function getJobsStats(id_company) {
	try {
		// Total des offres
		const { count: total, error: totalError } = await supabase
			.from('job_offer')
			.select('*', { count: 'exact', head: true })
			.eq('id_company', id_company);

		if (totalError) throw totalError;

		// Offres actives = offres pour lesquelles aucun candidat n'a été accepté
		// D'abord récupérer toutes les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: total || 0, active: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Récupérer les offres qui ont des candidats acceptés
		const { data: acceptedApplications, error: acceptedError } = await supabase
			.from('apply')
			.select('id_job_offer')
			.in('id_job_offer', jobIds)
			.eq('status', 'accepted');

		if (acceptedError) throw acceptedError;

		// Les offres avec des candidats acceptés
		const jobsWithAcceptedCandidates = new Set(
			(acceptedApplications || []).map((app) => app.id_job_offer)
		);

		// Offres actives = total - offres avec candidats acceptés
		const active = (total || 0) - jobsWithAcceptedCandidates.size;

		return {
			total: total || 0,
			active: Math.max(0, active), // S'assurer que c'est pas négatif
		};
	} catch (error) {
		logger.error(`[getJobsStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0, active: 0 };
	}
}

/**
 * Statistiques des candidatures de l'entreprise
 */
async function getApplicationsStats(id_company) {
	try {
		// Total des candidatures - d'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: 0, thisWeek: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Maintenant compter les candidatures pour ces offres
		const { count: total, error: totalError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds);

		if (totalError) throw totalError;

		// Candidatures de cette semaine
		const startOfWeek = new Date();
		startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
		startOfWeek.setHours(0, 0, 0, 0);

		const { count: thisWeek, error: weekError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds)
			.gte('application_date', startOfWeek.toISOString());

		if (weekError) throw weekError;

		return {
			total: total || 0,
			thisWeek: thisWeek || 0,
		};
	} catch (error) {
		logger.error(`[getApplicationsStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0, thisWeek: 0 };
	}
}

/**
 * Statistiques des entretiens programmés
 */
async function getInterviewsStats(id_company) {
	try {
		// D'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Total des entretiens programmés (tous les statuts 'interview')
		const { count: total, error: totalError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds)
			.eq('status', 'interview');

		if (totalError) throw totalError;

		return {
			total: total || 0,
		};
	} catch (error) {
		logger.error(`[getInterviewsStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0 };
	}
}

/**
 * Statistiques des candidats embauchés
 */
async function getHiredStats(id_company) {
	try {
		// D'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return { total: 0 };
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);

		// Total des candidats embauchés (tous les statuts 'accepted')
		const { count: total, error: totalError } = await supabase
			.from('apply')
			.select('id_user', { count: 'exact', head: true })
			.in('id_job_offer', jobIds)
			.eq('status', 'accepted');

		if (totalError) throw totalError;

		return {
			total: total || 0,
		};
	} catch (error) {
		logger.error(`[getHiredStats] Erreur pour l'entreprise ${id_company}:`, error);
		return { total: 0 };
	}
}

/**
 * Récupère les candidatures récentes de l'entreprise
 */
async function getRecentApplications(id_company) {
	try {
		// D'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer, title')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return [];
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);
		const jobTitles = companyJobs.reduce((acc, job) => {
			acc[job.id_job_offer] = job.title;
			return acc;
		}, {});

		// Maintenant récupérer les candidatures pour ces offres (sans jointure d'abord)
		const { data: applications, error } = await supabase
			.from('apply')
			.select(
				`
				id_user,
				id_job_offer,
				application_date,
				status,
				interview_date
			`
			)
			.in('id_job_offer', jobIds)
			.order('application_date', { ascending: false })
			.limit(3);

		if (error) throw error;

		// Si on a des candidatures, récupérer les infos utilisateur séparément
		if (applications && applications.length > 0) {
			const userIds = applications.map((app) => app.id_user);
			const { data: users, error: usersError } = await supabase
				.from('user_')
				.select('*')
				.in('id_user', userIds);

			if (usersError) {
				logger.error(`[getRecentApplications] Erreur utilisateurs:`, usersError);
				return [];
			}

			// Récupérer les offres complètes pour le calcul de matching
			const { data: jobOffers, error: jobsError } = await supabase
				.from('job_offer')
				.select('*')
				.in('id_job_offer', jobIds);

			if (jobsError) {
				logger.error(`[getRecentApplications] Erreur offres:`, jobsError);
			}

			const jobOfferMap = (jobOffers || []).reduce((acc, job) => {
				acc[job.id_job_offer] = job;
				return acc;
			}, {});

			// Créer un map des utilisateurs
			const userMap = users.reduce((acc, user) => {
				acc[user.id_user] = user;
				return acc;
			}, {});

			// Transformer les données pour correspondre au format frontend
			const transformedApplications = await Promise.all(
				applications.map(async (app) => {
					const user = userMap[app.id_user];
					const jobOffer = jobOfferMap[app.id_job_offer];
					const firstname = user?.firstname || '';
					const lastname = user?.lastname || '';

					// Récupérer la photo de profil de l'utilisateur
					let profilePicture = null;
					if (user) {
						try {
							profilePicture = await getProfilePicture(app.id_user);
						} catch (error) {
							logger.error(
								`[getRecentApplications] Erreur récupération photo pour ${app.id_user}:`,
								error
							);
						}
					}

					// Calculer le vrai score de matching
					let matchScore = 50; // Score par défaut
					if (user && jobOffer) {
						try {
							const matchingResult = await calculateMatchingScore(user, jobOffer);
							matchScore = matchingResult.score || 50;
						} catch (error) {
							logger.error(
								`[getRecentApplications] Erreur calcul matching pour ${app.id_user}/${app.id_job_offer}:`,
								error
							);
						}
					}

					// Fallback vers les initiales si pas de photo
					const avatar =
						profilePicture || (user ? `${firstname.charAt(0)}${lastname.charAt(0)}` : '??');

					return {
						id: `${app.id_user}-${app.id_job_offer}`, // Clé composite
						candidateName: user
							? `${firstname} ${lastname}`.trim() || 'Utilisateur sans nom'
							: 'Utilisateur inconnu',
						candidateTitle: user?.job_title || 'Candidat',
						jobTitle: jobTitles[app.id_job_offer] || "Offre d'emploi",
						appliedDate: new Date(app.application_date).toLocaleDateString('fr-FR'),
						status: app.status,
						experience: user?.experience_level || 'Non spécifié',
						location: user
							? `${user.city || ''} ${user.country || ''}`.trim() || 'Non spécifié'
							: 'Non spécifié',
						matchScore, // Score calculé avec l'algorithme de matching
						avatar,
						profilePicture, // Ajouter la photo de profil
						email: user?.email || '',
						interviewDate: app.interview_date,
					};
				})
			);

			return transformedApplications;
		}

		return [];
	} catch (error) {
		logger.error(`[getRecentApplications] Erreur pour l'entreprise ${id_company}:`, error);
		return [];
	}
}

/**
 * Récupère les offres actives de l'entreprise avec statistiques
 */
async function getActiveJobs(id_company) {
	try {
		// D'abord récupérer toutes les offres de l'entreprise
		const { data: allJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select(
				`
				id_job_offer,
				title,
				location,
				contract_type,
				salary_min,
				salary_max,
				published_at,
				industry,
				experience
			`
			)
			.eq('id_company', id_company)
			.order('published_at', { ascending: false });

		if (jobsError) throw jobsError;

		if (!allJobs || allJobs.length === 0) {
			return [];
		}

		const jobIds = allJobs.map((job) => job.id_job_offer);

		// Récupérer les offres qui ont des candidats acceptés
		const { data: acceptedApplications, error: acceptedError } = await supabase
			.from('apply')
			.select('id_job_offer')
			.in('id_job_offer', jobIds)
			.eq('status', 'accepted');

		if (acceptedError) throw acceptedError;

		// Les offres avec des candidats acceptés
		const jobsWithAcceptedCandidates = new Set(
			(acceptedApplications || []).map((app) => app.id_job_offer)
		);

		// Filtrer pour ne garder que les offres actives (sans candidats acceptés)
		const activeJobs = allJobs.filter((job) => !jobsWithAcceptedCandidates.has(job.id_job_offer));

		// Limiter à 6 offres maximum
		const jobs = activeJobs.slice(0, 6);

		// Pour chaque offre, récupérer les statistiques
		const jobsWithStats = await Promise.all(
			(jobs || []).map(async (job) => {
				// Compter les candidatures
				const { count: applicationsCount } = await supabase
					.from('apply')
					.select('id_user', { count: 'exact', head: true })
					.eq('id_job_offer', job.id_job_offer);

				// Transformer les données pour correspondre au format frontend
				return {
					id: job.id_job_offer,
					title: job.title,
					department: job.industry || 'Général',
					location: job.location || 'Non spécifié',
					type: job.contract_type || 'CDI',
					salary:
						job.salary_min && job.salary_max
							? `${job.salary_min}-${job.salary_max}k€`
							: 'Non spécifié',
					applications: applicationsCount || 0,
					postedDate: new Date(job.published_at).toLocaleDateString('fr-FR'),
					status: 'active', // Toutes les offres sont actives par défaut
					experience: job.experience || 'Non spécifié',
				};
			})
		);

		return jobsWithStats;
	} catch (error) {
		logger.error(`[getActiveJobs] Erreur pour l'entreprise ${id_company}:`, error);
		return [];
	}
}

/**
 * Récupère les entretiens à venir de l'entreprise avec informations complètes
 */
async function getUpcomingInterviews(id_company) {
	try {
		// D'abord récupérer les offres de l'entreprise
		const { data: companyJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('id_job_offer, title')
			.eq('id_company', id_company);

		if (jobsError) throw jobsError;

		if (!companyJobs || companyJobs.length === 0) {
			return [];
		}

		const jobIds = companyJobs.map((job) => job.id_job_offer);
		const jobTitles = companyJobs.reduce((acc, job) => {
			acc[job.id_job_offer] = job.title;
			return acc;
		}, {});

		const now = new Date();

		// Récupérer les entretiens pour ces offres (sans jointure d'abord)
		// Conditions : statut = 'interview' ET date future ET interview_date non null
		const { data: interviews, error } = await supabase
			.from('apply')
			.select(
				`
				id_user,
				id_job_offer,
				interview_date,
				status,
				notes
			`
			)
			.in('id_job_offer', jobIds)
			.eq('status', 'interview')
			.not('interview_date', 'is', null) // S'assurer que la date existe
			.gte('interview_date', now.toISOString()) // Date future uniquement
			.order('interview_date', { ascending: true })
			.limit(6); // Limiter à 6 comme demandé

		if (error) throw error;

		if (!interviews || interviews.length === 0) {
			return [];
		}

		// Récupérer les infos utilisateur séparément
		const userIds = interviews.map((interview) => interview.id_user);
		const { data: users, error: usersError } = await supabase
			.from('user_')
			.select('id_user, firstname, lastname, job_title, city, country')
			.in('id_user', userIds);

		if (usersError) {
			logger.error(`[getUpcomingInterviews] Erreur utilisateurs:`, usersError);
			return [];
		}

		// Créer un map des utilisateurs
		const userMap = users.reduce((acc, user) => {
			acc[user.id_user] = user;
			return acc;
		}, {});

		// Transformer les données pour correspondre au format frontend
		const transformedInterviews = await Promise.all(
			interviews.map(async (interview) => {
				const user = userMap[interview.id_user];

				// Vérifier que la date d'entretien est valide et future
				if (!interview.interview_date) {
					return null;
				}

				const interviewDate = new Date(interview.interview_date);

				// Double vérification que la date est future
				if (interviewDate <= now) {
					return null;
				}

				// Récupérer la photo de profil de l'utilisateur
				let profilePicture = null;
				if (user) {
					try {
						profilePicture = await getProfilePicture(interview.id_user);
					} catch (error) {
						logger.error(
							`[getUpcomingInterviews] Erreur récupération photo pour ${interview.id_user}:`,
							error
						);
					}
				}

				// Fallback vers les initiales si pas de photo
				const firstname = user?.firstname || '';
				const lastname = user?.lastname || '';
				const avatar =
					profilePicture || (user ? `${firstname.charAt(0)}${lastname.charAt(0)}` : '??');

				return {
					id: `${interview.id_user}-${interview.id_job_offer}`, // Clé composite
					candidateName: user
						? `${firstname} ${lastname}`.trim() || 'Utilisateur sans nom'
						: 'Utilisateur inconnu',
					candidateTitle: user?.job_title || 'Candidat',
					jobTitle: jobTitles[interview.id_job_offer] || "Offre d'emploi",
					date: interviewDate.toLocaleDateString('fr-FR'),
					time: interviewDate.toLocaleTimeString('fr-FR', {
						hour: '2-digit',
						minute: '2-digit',
					}),
					type: 'Visioconférence', // Valeur par défaut car interview_type n'existe pas
					interviewer: 'À définir', // Valeur par défaut car interviewer_name n'existe pas
					status: interview.status,
					interviewDate: interview.interview_date,
					avatar,
					profilePicture,
					location: user
						? `${user.city || ''} ${user.country || ''}`.trim() || 'Non spécifié'
						: 'Non spécifié',
					notes: interview.notes || '',
				};
			})
		);

		// Filtrer les entretiens null (dates invalides ou passées)
		const validInterviews = transformedInterviews.filter((interview) => interview !== null);

		return validInterviews;
	} catch (error) {
		logger.error(`[getUpcomingInterviews] Erreur pour l'entreprise ${id_company}:`, error);
		return [];
	}
}

/**
 * Récupère toutes les offres d'emploi de l'entreprise pour la page de gestion
 * (sans limitation, avec tous les statuts)
 */
async function getAllJobsForManagement(id_company) {
	try {
		// Récupérer toutes les offres (actives, en pause, fermées)
		const { data: allJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select(
				`
				id_job_offer,
				title,
				location,
				contract_type,
				salary_min,
				salary_max,
				published_at,
				industry,
				experience,
				remote,
				urgency
			`
			)
			.eq('id_company', id_company)
			.order('published_at', { ascending: false });

		if (jobsError) throw jobsError;

		if (!allJobs || allJobs.length === 0) {
			return [];
		}

		const jobIds = allJobs.map((job) => job.id_job_offer);

		// Récupérer les offres qui ont des candidats acceptés
		const { data: acceptedApplications, error: acceptedError } = await supabase
			.from('apply')
			.select('id_job_offer')
			.in('id_job_offer', jobIds)
			.eq('status', 'accepted');

		if (acceptedError) throw acceptedError;

		// Les offres avec des candidats acceptés
		const jobsWithAcceptedCandidates = new Set(
			(acceptedApplications || []).map((app) => app.id_job_offer)
		);

		// Pour la page de gestion, on veut TOUTES les offres, pas seulement les actives
		// Pas de filtrage par statut, pas de limite
		const jobs = allJobs;

		// Pour chaque offre, récupérer les statistiques
		const jobsWithStats = await Promise.all(
			(jobs || []).map(async (job) => {
				// Compter les candidatures
				const { count: applicationsCount } = await supabase
					.from('apply')
					.select('id_user', { count: 'exact', head: true })
					.eq('id_job_offer', job.id_job_offer);

				// Déterminer le statut réel de l'offre
				let realStatus = 'active'; // Par défaut, toutes les offres sont actives
				if (jobsWithAcceptedCandidates.has(job.id_job_offer)) {
					realStatus = 'closed'; // Offre fermée car candidat accepté
				}

				// Transformer les données pour correspondre au format frontend
				return {
					id: job.id_job_offer,
					title: job.title,
					department: job.industry || 'Général',
					location: job.location || 'Non spécifié',
					type: job.contract_type || 'CDI',
					salary:
						job.salary_min && job.salary_max
							? `${job.salary_min}-${job.salary_max}k€`
							: 'Non spécifié',
					applications: applicationsCount || 0,
					postedDate: new Date(job.published_at).toLocaleDateString('fr-FR'),
					status: realStatus, // Statut réel de l'offre
					urgent: job.urgency === 'high',
					remote: job.remote === 'Oui',
					experience: job.experience || 'Non spécifié',
				};
			})
		);

		return jobsWithStats;
	} catch (error) {
		logger.error(`[getAllJobsForManagement] Erreur pour l'entreprise ${id_company}:`, error);
		return [];
	}
}

/**
 * Récupère toutes les offres d'emploi de l'entreprise (pour le dashboard - limité)
 */
async function getAllJobs(id_company) {
	try {
		// Récupérer toutes les offres (actives, en pause, fermées)
		const { data: allJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select(
				`
				id_job_offer,
				title,
				location,
				contract_type,
				salary_min,
				salary_max,
				published_at,
				industry,
				experience,
				remote,
				urgency
			`
			)
			.eq('id_company', id_company)
			.order('published_at', { ascending: false });

		if (jobsError) throw jobsError;

		if (!allJobs || allJobs.length === 0) {
			return [];
		}

		const jobIds = allJobs.map((job) => job.id_job_offer);

		// Récupérer les offres qui ont des candidats acceptés
		const { data: acceptedApplications, error: acceptedError } = await supabase
			.from('apply')
			.select('id_job_offer')
			.in('id_job_offer', jobIds)
			.eq('status', 'accepted');

		if (acceptedError) throw acceptedError;

		// Les offres avec des candidats acceptés
		const jobsWithAcceptedCandidates = new Set(
			(acceptedApplications || []).map((app) => app.id_job_offer)
		);

		// Filtrer pour ne garder que les offres actives (sans candidats acceptés)
		const activeJobs = allJobs.filter((job) => !jobsWithAcceptedCandidates.has(job.id_job_offer));

		// Limiter à 6 offres maximum
		const jobs = activeJobs.slice(0, 6);

		// Pour chaque offre, récupérer les statistiques
		const jobsWithStats = await Promise.all(
			(jobs || []).map(async (job) => {
				// Compter les candidatures
				const { count: applicationsCount } = await supabase
					.from('apply')
					.select('id_user', { count: 'exact', head: true })
					.eq('id_job_offer', job.id_job_offer);

				// Transformer les données pour correspondre au format frontend
				return {
					id: job.id_job_offer,
					title: job.title,
					department: job.industry || 'Général',
					location: job.location || 'Non spécifié',
					type: job.contract_type || 'CDI',
					salary:
						job.salary_min && job.salary_max
							? `${job.salary_min}-${job.salary_max}k€`
							: 'Non spécifié',
					applications: applicationsCount || 0,
					postedDate: new Date(job.published_at).toLocaleDateString('fr-FR'),
					status: 'active', // Toutes les offres sont actives par défaut
					urgent: job.urgency === 'high',
					remote: job.remote === 'Oui',
					experience: job.experience || 'Non spécifié',
				};
			})
		);

		return jobsWithStats;
	} catch (error) {
		logger.error(`[getAllJobs] Erreur pour l'entreprise ${id_company}:`, error);
		return [];
	}
}

export {
	getCompanyDashboardStats,
	getJobsStats,
	getApplicationsStats,
	getInterviewsStats,
	getHiredStats,
	getRecentApplications,
	getActiveJobs,
	getUpcomingInterviews,
	getAllJobs,
	getAllJobsForManagement,
};
