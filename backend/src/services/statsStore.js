import supabase from "../database/db.js";
import logger from "../utils/logger.js";

/**
 * Statistiques globales de la plateforme
 */
async function getGlobalStats() {
	try {
		// Compter les entreprises
		const { count: totalCompanies, error: companiesError } = await supabase
			.from('company')
			.select('*', { count: 'exact', head: true });

		if (companiesError) {
			logger.error("getGlobalStats companies error:", companiesError);
			throw companiesError;
		}

		// Compter les offres d'emploi
		const { count: totalJobs, error: jobsError } = await supabase
			.from('job_offer')
			.select('*', { count: 'exact', head: true });

		if (jobsError) {
			logger.error("getGlobalStats jobs error:", jobsError);
			throw jobsError;
		}

		// Compter les candidatures
		const { count: totalApplications, error: applicationsError } = await supabase
			.from('apply')
			.select('*', { count: 'exact', head: true });

		if (applicationsError) {
			logger.error("getGlobalStats applications error:", applicationsError);
			throw applicationsError;
		}

		// Compter les utilisateurs
		const { count: totalUsers, error: usersError } = await supabase
			.from('user_')
			.select('*', { count: 'exact', head: true });

		if (usersError) {
			logger.error("getGlobalStats users error:", usersError);
			throw usersError;
		}

		return {
			totalCompanies: totalCompanies || 0,
			totalJobs: totalJobs || 0,
			totalApplications: totalApplications || 0,
			totalUsers: totalUsers || 0
		};
	} catch (err) {
		logger.error("getGlobalStats error:", err);
		throw err;
	}
}

/**
 * Statistiques par entreprise
 */
async function getCompanyStats() {
	try {
		// Récupérer toutes les entreprises avec leurs offres
		const { data: companies, error: companiesError } = await supabase
			.from('company')
			.select(`
				id_company,
				name,
				industry,
				created_at,
				job_offer (
					id_job_offer,
					title,
					published_at
				)
			`);

		if (companiesError) {
			logger.error("getCompanyStats companies error:", companiesError);
			throw companiesError;
		}

		// Récupérer les candidatures par entreprise
		const { data: applications, error: applicationsError } = await supabase
			.from('apply')
			.select(`
				id_job_offer,
				job_offer!inner (
					id_company
				)
			`);

		if (applicationsError) {
			logger.error("getCompanyStats applications error:", applicationsError);
			throw applicationsError;
		}

		// Traiter les données
		const companyStats = companies.map(company => {
			const jobCount = company.job_offer ? company.job_offer.length : 0;
			const applicationCount = applications.filter(app => 
				app.job_offer && app.job_offer.id_company === company.id_company
			).length;

			return {
				id_company: company.id_company,
				name: company.name,
				industry: company.industry,
				created_at: company.created_at,
				totalJobs: jobCount,
				totalApplications: applicationCount,
				jobs: company.job_offer || []
			};
		});

		return companyStats;
	} catch (err) {
		logger.error("getCompanyStats error:", err);
		throw err;
	}
}

/**
 * Récupère les entreprises avec le plus d'offres (pour la section "Entreprises à la une")
 */
async function getTopCompanies(limit = 3) {
	try {
		// Récupérer les entreprises avec le nombre d'offres, triées par nombre d'offres décroissant
		const { data: companies, error } = await supabase
			.from('company')
			.select(`
				id_company,
				name,
				industry,
				job_offers:job_offer(count)
			`)
			.order('created_at', { ascending: false }); // Tri par défaut

		if (error) {
			logger.error("getTopCompanies error:", error);
			throw error;
		}

		// Transformer les données et trier par nombre d'offres
		const enrichedCompanies = (companies || []).map(company => ({
			id_company: company.id_company,
			name: company.name,
			industry: company.industry,
			jobsAvailable: company.job_offers?.[0]?.count || 0
		}));

		// Filtrer les entreprises avec au moins 1 offre, trier par nombre d'offres décroissant et limiter
		return enrichedCompanies
			.filter(company => company.jobsAvailable > 0) // ✅ Seulement les entreprises avec des offres
			.sort((a, b) => b.jobsAvailable - a.jobsAvailable)
			.slice(0, limit);

	} catch (err) {
		logger.error("getTopCompanies error:", err);
		throw err;
	}
}

/**
 * Statistiques des offres par industrie
 */
async function getIndustryStats() {
	try {
		const { data: jobs, error } = await supabase
			.from('job_offer')
			.select('industry');

		if (error) {
			logger.error("getIndustryStats error:", error);
			throw error;
		}

		// Compter par industrie
		const industryStats = {};
		jobs.forEach(job => {
			const industry = job.industry || 'Non spécifié';
			industryStats[industry] = (industryStats[industry] || 0) + 1;
		});

		return industryStats;
	} catch (err) {
		logger.error("getIndustryStats error:", err);
		throw err;
	}
}

/**
 * Statistiques des candidatures par statut
 */
async function getApplicationStatusStats() {
	try {
		const { data: applications, error } = await supabase
			.from('apply')
			.select('status');

		if (error) {
			logger.error("getApplicationStatusStats error:", error);
			throw error;
		}

		// Compter par statut
		const statusStats = {};
		applications.forEach(app => {
			const status = app.status || 'pending';
			statusStats[status] = (statusStats[status] || 0) + 1;
		});

		return statusStats;
	} catch (err) {
		logger.error("getApplicationStatusStats error:", err);
		throw err;
	}
}

export { getGlobalStats, getCompanyStats, getTopCompanies, getIndustryStats, getApplicationStatusStats };