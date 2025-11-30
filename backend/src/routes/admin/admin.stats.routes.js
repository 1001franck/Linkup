/**
 * Routes admin pour les statistiques et le dashboard
 */

import express from 'express';
import supabase from '../../database/db.js';
import logger from '../../utils/logger.js';
import { getAllUsers } from '../../services/userStore.js';
import { getAllCompanies } from '../../services/companyStore.js';
import { getAllJobs } from '../../services/jobStore.js';
import { getAllApplications } from '../../services/applicationStore.js';
import { getAdminDashboardStats } from '../../services/adminStore.js';

const router = express.Router();

/**
 * GET /admin/dashboard
 * Tableau de bord administrateur avec statistiques complètes
 */
router.get('/dashboard', async (req, res) => {
	try {
		const dashboardStats = await getAdminDashboardStats();
		res.json({ data: dashboardStats });
	} catch (error) {
		logger.error('GET /admin/dashboard error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /admin/stats/users
 * Statistiques détaillées des utilisateurs
 */
router.get('/stats/users', async (req, res) => {
	try {
		const users = await getAllUsers();
		const stats = {
			total: users.length,
			byRole: users.reduce((acc, user) => {
				acc[user.role] = (acc[user.role] || 0) + 1;
				return acc;
			}, {}),
			recent: users.filter((user) => {
				const created = new Date(user.created_at);
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
				return created > thirtyDaysAgo;
			}).length,
		};
		res.json({ data: stats });
	} catch (error) {
		logger.error('GET /admin/stats/users error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /admin/stats/companies
 * Statistiques détaillées des entreprises
 */
router.get('/stats/companies', async (req, res) => {
	try {
		const companies = await getAllCompanies();
		const stats = {
			total: companies.length,
			byIndustry: companies.reduce((acc, company) => {
				const industry = company.industry || 'Non spécifié';
				acc[industry] = (acc[industry] || 0) + 1;
				return acc;
			}, {}),
			recent: companies.filter((company) => {
				const created = new Date(company.created_at);
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
				return created > thirtyDaysAgo;
			}).length,
		};
		res.json({ data: stats });
	} catch (error) {
		logger.error('GET /admin/stats/companies error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /admin/stats/jobs
 * Statistiques détaillées des offres d'emploi
 */
router.get('/stats/jobs', async (req, res) => {
	try {
		const jobs = await getAllJobs();
		const stats = {
			total: jobs.length,
			byContractType: jobs.reduce((acc, job) => {
				const contractType = job.contract_type || 'Non spécifié';
				acc[contractType] = (acc[contractType] || 0) + 1;
				return acc;
			}, {}),
			byRemote: {
				remote: jobs.filter((job) => job.remote === true).length,
				onSite: jobs.filter((job) => job.remote === false).length,
			},
			recent: jobs.filter((job) => {
				const published = new Date(job.published_at);
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
				return published > thirtyDaysAgo;
			}).length,
		};
		res.json({ data: stats });
	} catch (error) {
		logger.error('GET /admin/stats/jobs error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /admin/stats/applications
 * Statistiques détaillées des candidatures
 */
router.get('/stats/applications', async (req, res) => {
	try {
		const applications = await getAllApplications();
		const stats = {
			total: applications.length,
			byStatus: applications.reduce((acc, application) => {
				const status = application.status || 'pending';
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			}, {}),
			recent: applications.filter((application) => {
				const applied = new Date(application.application_date);
				const thirtyDaysAgo = new Date();
				thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
				return applied > thirtyDaysAgo;
			}).length,
		};
		res.json({ data: stats });
	} catch (error) {
		logger.error('GET /admin/stats/applications error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /admin/stats/dashboard
 * Statistiques complètes pour le dashboard
 */
router.get('/stats/dashboard', async (req, res) => {
	try {
		const dashboardStats = await getAdminDashboardStats();
		res.json({ data: dashboardStats });
	} catch (error) {
		logger.error('GET /admin/stats/dashboard error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /admin/stats/activity
 * Activité récente (24h)
 */
router.get('/stats/activity', async (req, res) => {
	try {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayISO = yesterday.toISOString();

		// Requêtes optimisées pour l'activité des 24h
		const [usersResult, companiesResult, jobsResult, applicationsResult] = await Promise.all([
			supabase.from('user_').select('created_at').gte('created_at', yesterdayISO),
			supabase.from('company').select('created_at').gte('created_at', yesterdayISO),
			supabase.from('job_offer').select('published_at').gte('published_at', yesterdayISO),
			supabase.from('apply').select('application_date').gte('application_date', yesterdayISO),
		]);

		const stats = {
			newUsers: usersResult.data?.length || 0,
			newCompanies: companiesResult.data?.length || 0,
			newJobs: jobsResult.data?.length || 0,
			newApplications: applicationsResult.data?.length || 0,
			period: '24h',
		};

		res.json({ data: stats });
	} catch (error) {
		logger.error('GET /admin/stats/activity error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
