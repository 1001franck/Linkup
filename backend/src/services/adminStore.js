import supabase from "../database/db.js";
import logger from "../utils/logger.js";
import { getGlobalStats, getCompanyStats, getIndustryStats, getApplicationStatusStats } from "./statsStore.js";
import { createUser, updateUser, deleteUser, getAllUsers } from "./userStore.js";
import { createCompany, updateCompany, removeCompany } from "./companyStore.js";
import { createJob, updateJob, removeJob } from "./jobStore.js";
import { createApplication, updateApplicationStatus, removeApplication } from "./applicationStore.js";
import { createMessage, deleteMessage } from "./messageStore.js";
import { createFilter, updateFilter, removeFilter } from "./filterStore.js";

// ===== STATS ADMIN =====

/**
 * Récupère les statistiques du dashboard admin
 */
async function getAdminDashboardStats() {
	try {
		// Récupérer les statistiques de base
		const usersResult = await supabase.from("user_").select("*", { count: "exact" });
		const companiesResult = await supabase.from("company").select("*", { count: "exact" });
		const jobsResult = await supabase.from("job_offer").select("*", { count: "exact" });
		const applicationsResult = await supabase.from("apply").select("*", { count: "exact" });

		// Statistiques des dernières 24h
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayISO = yesterday.toISOString();

		const newUsersResult = await supabase.from("user_").select("*", { count: "exact" }).gte("created_at", yesterdayISO);
		const newCompaniesResult = await supabase.from("company").select("*", { count: "exact" }).gte("created_at", yesterdayISO);
		const newJobsResult = await supabase.from("job_offer").select("*", { count: "exact" }).gte("created_at", yesterdayISO);
		const newApplicationsResult = await supabase.from("apply").select("*", { count: "exact" }).gte("application_date", yesterdayISO);

		const stats = {
			// Statistiques totales
			totalUsers: usersResult.count || 0,
			totalCompanies: companiesResult.count || 0,
			totalJobs: jobsResult.count || 0,
			totalApplications: applicationsResult.count || 0,
			
			// Statistiques 24h
			newUsers24h: newUsersResult.count || 0,
			newCompanies24h: newCompaniesResult.count || 0,
			newJobs24h: newJobsResult.count || 0,
			newApplications24h: newApplicationsResult.count || 0,
			
			// Activité récente
			recentActivity: await getRecentActivity(),
			
			generatedAt: new Date().toISOString()
		};

		return stats;
	} catch (error) {
		logger.error("getAdminDashboardStats error:", error);
		throw error;
	}
}

/**
 * Récupère l'activité récente (dernières 24h)
 */
async function getRecentActivity() {
	try {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		const { data, error } = await supabase
			.from('user_')
			.select('id_user, firstname, lastname, email, created_at')
			.gte('created_at', yesterday.toISOString())
			.order('created_at', { ascending: false })
			.limit(10);

		if (error) throw error;
		return data || [];
	} catch (err) {
		logger.error("getRecentActivity error:", err);
		throw err;
	}
}

// getUsersList supprimé - utilise getAllUsers directement

/**
 * Change le mot de passe d'un utilisateur (fonction admin-spécifique)
 */
async function changeUserPassword(userId, newPassword) {
	try {
		const bcrypt = await import("bcryptjs");
		const password_hash = await bcrypt.hash(newPassword, 10);

		const { data, error } = await supabase
			.from('user_')
			.update({ password: password_hash })
			.eq('id_user', userId)
			.select()
			.single();

		if (error) throw error;
		return data;
	} catch (err) {
		logger.error("changeUserPassword error:", err);
		throw err;
	}
}

// ===== EXPORTS =====

// Stats
export { getAdminDashboardStats };

// Users (réutilise les fonctions existantes)
export { createUser, updateUser, deleteUser, changeUserPassword, getAllUsers };

// Companies (réutilise les fonctions existantes)
export { createCompany, updateCompany, removeCompany };

// Jobs (réutilise les fonctions existantes)
export { createJob, updateJob, removeJob };

// Applications (réutilise les fonctions existantes)
export { createApplication, updateApplicationStatus, removeApplication };

// Messages (réutilise les fonctions existantes)
export { createMessage, deleteMessage };

// Filters (réutilise les fonctions existantes)
export { createFilter, updateFilter, removeFilter };