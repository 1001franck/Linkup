import express from "express";
import bcrypt from "bcryptjs";
import auth from "../middlewares/auth.js";
import supabase from "../database/db.js";
import logger from "../utils/logger.js";
import { findByEmail, findById, getAllUsers, createUser, updateUser, deleteUser } from "../services/userStore.js";
import { getAllCompanies, createCompany, updateCompany, removeCompany } from "../services/companyStore.js";
import { searchJobs, getAllJobs, createJob, updateJob, removeJob } from "../services/jobStore.js";
import { getAllApplications, createApplication, updateApplicationStatus, removeApplication } from "../services/applicationStore.js";
import { getAllFilters } from "../services/filterStore.js";
import {
	getAdminDashboardStats,
	changeUserPassword,
	// CRUD Messages
	createMessage,
	deleteMessage,
	// CRUD Filtres
	createFilter,
	updateFilter,
	removeFilter,
} from "../services/adminStore.js";

const router = express.Router();

// Middleware pour vérifier que l'utilisateur est admin
router.use(auth(["admin"]));

/**
 * GET /admin/dashboard
 * Tableau de bord administrateur avec statistiques complètes
 */
router.get("/dashboard", async (req, res) => {
	try {
		const dashboardStats = await getAdminDashboardStats();
		res.json({ data: dashboardStats });
	} catch (error) {
		logger.error("GET /admin/dashboard error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});



/**
 * GET /admin/jobs
 * Liste toutes les offres d'emploi
 */
router.get("/jobs", async (req, res) => {
	try {
		const { page = 1, limit = 20, q, location, contractType } = req.query;
		const result = await searchJobs({ q, location, contractType, page, limit });
		res.json({ data: result });
	} catch (error) {
		logger.error("GET /admin/jobs error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/filters
 * Liste tous les filtres
 */
router.get("/filters", async (req, res) => {
	try {
		const filters = await getAllFilters();
		res.json({ data: filters });
	} catch (error) {
		logger.error("GET /admin/filters error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/stats/users
 * Statistiques détaillées des utilisateurs
 */
router.get("/stats/users", async (req, res) => {
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
		logger.error("GET /admin/stats/users error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/stats/companies
 * Statistiques détaillées des entreprises
 */
router.get("/stats/companies", async (req, res) => {
	try {
		// Utiliser une requête optimisée pour les statistiques
		const { data: companies, error } = await supabase
			.from('company')
			.select('industry, created_at');

		if (error) {
			logger.error("GET /admin/stats/companies error:", error);
			throw error;
		}

		const stats = {
			total: companies.length,
			byIndustry: companies.reduce((acc, company) => {
				const industry = company.industry || "Non spécifié";
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
		logger.error("GET /admin/stats/companies error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/stats/jobs
 * Statistiques détaillées des offres d'emploi
 */
router.get("/stats/jobs", async (req, res) => {
	try {
		// Utiliser une requête optimisée pour les statistiques
		const { data: jobs, error } = await supabase
			.from('job_offer')
			.select('contract_type, location, published_at');

		if (error) {
			logger.error("GET /admin/stats/jobs error:", error);
			throw error;
		}

		const stats = {
			total: jobs.length,
			byContractType: jobs.reduce((acc, job) => {
				const contractType = job.contract_type || "Non spécifié";
				acc[contractType] = (acc[contractType] || 0) + 1;
				return acc;
			}, {}),
			byLocation: jobs.reduce((acc, job) => {
				const location = job.location || "Non spécifié";
				acc[location] = (acc[location] || 0) + 1;
				return acc;
			}, {}),
			recent: jobs.filter((job) => {
				const created = new Date(job.published_at);
				const sevenDaysAgo = new Date();
				sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
				return created > sevenDaysAgo;
			}).length,
		};
		res.json({ data: stats });
	} catch (error) {
		logger.error("GET /admin/stats/jobs error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/stats/applications
 * Statistiques détaillées des candidatures
 */
router.get("/stats/applications", async (req, res) => {
	try {
		const applications = await getAllApplications();
		const stats = {
			total: applications.length,
			byStatus: applications.reduce((acc, app) => {
				const status = app.status || "pending";
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			}, {}),
			recent: applications.filter((app) => {
				const created = new Date(app.application_date);
				const sevenDaysAgo = new Date();
				sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
				return created > sevenDaysAgo;
			}).length,
		};
		res.json({ data: stats });
	} catch (error) {
		logger.error("GET /admin/stats/applications error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/stats/dashboard
 * Statistiques du dashboard admin
 */
router.get("/stats/dashboard", async (req, res) => {
	try {
		const dashboardStats = await getAdminDashboardStats();
		res.json({ success: true, data: dashboardStats });
	} catch (error) {
		logger.error("GET /admin/stats/dashboard error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/users
 * Liste des utilisateurs avec pagination et recherche
 */
router.get("/users", async (req, res) => {
	try {
		const { page = 1, limit = 20, search = null } = req.query;
		const users = await getAllUsers({ page: parseInt(page), limit: parseInt(limit), search });
		res.json({ success: true, data: users });
	} catch (error) {
		logger.error("GET /admin/users error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * POST /admin/users
 * Créer un utilisateur
 */
router.post("/users", async (req, res) => {
	try {
		const { email, password, firstname, lastname, role = "user", phone, bio_pro, city, country } = req.body;
		
		if (!email || !password) {
			return res.status(400).json({ error: "Email et mot de passe requis" });
		}

		const user = await createUser({
			email,
			password_hash: await bcrypt.hash(password, 10),
			firstname,
			lastname,
			role,
			phone,
			bio_pro,
			city,
			country
		});

		res.json({ success: true, data: user });
	} catch (error) {
		logger.error("POST /admin/users error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * PUT /admin/users/:userId
 * Modifier un utilisateur
 */
router.put("/users/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const updateData = req.body;
		
		// Ne pas permettre la modification du mot de passe via cette route
		delete updateData.password;
		
		const user = await updateUser(userId, updateData);
		res.json({ success: true, data: user });
	} catch (error) {
		logger.error("PUT /admin/users/:userId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /admin/users/:userId
 * Supprimer un utilisateur
 */
router.delete("/users/:userId", async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await deleteUser(userId);
		res.json({ success: true, data: result });
	} catch (error) {
		logger.error("DELETE /admin/users/:userId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/companies
 * Liste des entreprises avec pagination et recherche
 */
router.get("/companies", async (req, res) => {
	try {
		const { page = 1, limit = 20, search = null, industry = null, city = null } = req.query;
		const companies = await getAllCompanies({ 
			page: parseInt(page), 
			limit: parseInt(limit), 
			search, 
			industry, 
			city 
		});
		res.json({ success: true, data: companies });
	} catch (error) {
		logger.error("GET /admin/companies error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/jobs
 * Liste des offres d'emploi avec pagination et recherche
 */
router.get("/jobs", async (req, res) => {
	try {
		const { page = 1, limit = 20, search = null } = req.query;
		const jobs = await getAllJobs({ page: parseInt(page), limit: parseInt(limit), search });
		res.json({ success: true, data: jobs });
	} catch (error) {
		logger.error("GET /admin/jobs error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/applications
 * Liste des candidatures avec pagination et recherche
 */
router.get("/applications", async (req, res) => {
	try {
		logger.debug('🔍 GET /admin/applications - Début de la requête');
		const { page = 1, limit = 20, search = null } = req.query;
		logger.debug('🔍 GET /admin/applications - Paramètres reçus:', { page, limit, search });
		
		const applications = await getAllApplications({ page: parseInt(page), limit: parseInt(limit), search });
		logger.debug('✅ GET /admin/applications - Applications récupérées:', {
			dataLength: applications.data?.length,
			pagination: applications.pagination
		});
		
		res.json({ success: true, data: applications });
	} catch (error) {
		logger.error("❌ GET /admin/applications error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /admin/stats/activity
 * Activité récente (24h)
 */
router.get("/stats/activity", async (req, res) => {
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
			period: "24h",
		};

		res.json({ data: stats });
	} catch (error) {
		logger.error("GET /admin/stats/activity error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// ========================================
// ROUTES CRUD UTILISATEURS - SUPPRESSION DES DOUBLONS
// Les routes POST /admin/users, PUT /admin/users/:userId, DELETE /admin/users/:userId
// sont déjà définies plus haut (lignes 239-299) et sont plus complètes
// ========================================

/**
 * PUT /admin/users/:userId/password
 * Changer le mot de passe d'un utilisateur (admin seulement)
 */
router.put("/users/:userId/password", async (req, res) => {
	try {
		const { userId } = req.params;
		const { password } = req.body;

		if (!password) {
			return res.status(400).json({ error: "Nouveau mot de passe requis" });
		}

		const result = await changeUserPassword(userId, password);
		res.json({ data: result });
	} catch (error) {
		if (process.env.NODE_ENV !== 'production') {
			logger.error("PUT /admin/users/:userId/password error:", error);
		}
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// ========================================
// ROUTES CRUD ENTREPRISES
// ========================================

/**
 * POST /admin/companies
 * Créer une entreprise (admin seulement)
 */
router.post("/companies", async (req, res) => {
	try {
		const {
			name,
			description,
			industry,
			website,
			size,
			location,
			logo_url,
			password,
			recruiter_mail,
			recruiter_firstname,
			recruiter_lastname,
			recruiter_phone,
		} = req.body;

		// Validate required fields expected by createCompany
		if (!name) {
			return res.status(400).json({ error: "Nom de l'entreprise requis" });
		}
		if (!description) {
			return res.status(400).json({ error: "Description de l'entreprise requise" });
		}
		if (!recruiter_mail || !password) {
			return res.status(400).json({ error: "recruiter_mail et password sont requis pour créer une entreprise" });
		}

		// Générer des valeurs par défaut si non fournies
		const defaultPassword = password || "defaultPassword123";
		const defaultRecruiterMail = recruiter_mail || `recruiter@${name.toLowerCase().replace(/\s+/g, "")}.com`;
		const defaultRecruiterFirstname = recruiter_firstname || "Admin";
		const defaultRecruiterLastname = recruiter_lastname || "Company";

		const company = await createCompany({
			name,
			description,
			industry,
			website,
			size,
			location,
			logo_url,
			password: defaultPassword,
			recruiter_mail: defaultRecruiterMail,
			recruiter_firstname: defaultRecruiterFirstname,
			recruiter_lastname: defaultRecruiterLastname,
			recruiter_phone: recruiter_phone || "0123456789",
		});
		res.status(201).json({ data: company });
	} catch (error) {
		logger.error("POST /admin/companies error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * PUT /admin/companies/:companyId
 * Modifier une entreprise (admin seulement)
 */
router.put("/companies/:companyId", async (req, res) => {
	try {
		const { companyId } = req.params;
		const updateData = req.body;

		const company = await updateCompany(companyId, updateData);
		res.json({ data: company });
	} catch (error) {
		logger.error("PUT /admin/companies/:companyId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /admin/companies/:companyId
 * Supprimer une entreprise (admin seulement)
 */
router.delete("/companies/:companyId", async (req, res) => {
	try {
		const { companyId } = req.params;

		const result = await removeCompany(companyId);
		res.json({ data: result });
	} catch (error) {
		logger.error("DELETE /admin/companies/:companyId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// ========================================
// ROUTES CRUD OFFRES D'EMPLOI
// ========================================

/**
 * POST /admin/jobs
 * Créer une offre d'emploi (admin seulement)
 */
router.post("/jobs", async (req, res) => {
	try {
		const jobData = req.body;

		if (!jobData.title || !jobData.id_company) {
			return res.status(400).json({ error: "Titre et ID entreprise requis" });
		}

		const job = await createJob(jobData);
		res.status(201).json({ data: job });
	} catch (error) {
		logger.error("POST /admin/jobs error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * PUT /admin/jobs/:jobId
 * Modifier une offre d'emploi (admin seulement)
 */
router.put("/jobs/:jobId", async (req, res) => {
	try {
		const { jobId } = req.params;
		const updateData = req.body;

		const job = await updateJob(jobId, updateData);
		res.json({ data: job });
	} catch (error) {
		logger.error("PUT /admin/jobs/:jobId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /admin/jobs/:jobId
 * Supprimer une offre d'emploi (admin seulement)
 */
router.delete("/jobs/:jobId", async (req, res) => {
	try {
		const { jobId } = req.params;

		const result = await removeJob(jobId);
		res.json({ data: result });
	} catch (error) {
		logger.error("DELETE /admin/jobs/:jobId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// ========================================
// ROUTES CRUD CANDIDATURES
// ========================================

/**
 * POST /admin/applications
 * Créer une candidature (admin seulement)
 */
router.post("/applications", async (req, res) => {
	try {
		const { id_user, id_job_offer, status = "pending", cover_letter, cv_url } = req.body;

		if (!id_user || !id_job_offer) {
			return res.status(400).json({ error: "ID utilisateur et ID offre requis" });
		}

		const application = await createApplication({ id_user, id_job_offer, status, cover_letter, cv_url });
		res.status(201).json({ data: application });
	} catch (error) {
		logger.error("POST /admin/applications error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * PUT /admin/applications/:applicationId
 * Modifier une candidature (admin seulement)
 */
router.put("/applications/:applicationId", async (req, res) => {
	try {
		const { applicationId } = req.params;
		const updateData = req.body;

		const application = await updateApplicationStatus(applicationId, updateData);
		res.json({ data: application });
	} catch (error) {
		logger.error("PUT /admin/applications/:applicationId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /admin/applications/:applicationId
 * Supprimer une candidature (admin seulement)
 */
router.delete("/applications/:applicationId", async (req, res) => {
	try {
		const { applicationId } = req.params;

		const result = await removeApplication(applicationId);
		res.json({ data: result });
	} catch (error) {
		logger.error("DELETE /admin/applications/:applicationId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// ========================================
// ROUTES CRUD MESSAGES
// ========================================

/**
 * POST /admin/messages
 * Créer un message (admin seulement)
 */
router.post("/messages", async (req, res) => {
	try {
		const { id_sender, id_receiver, content, message_type = "text" } = req.body;

		if (!id_sender || !id_receiver || !content) {
			return res.status(400).json({ error: "Expéditeur, destinataire et contenu requis" });
		}

		const message = await createMessage({ id_sender, id_receiver, content, message_type });
		res.status(201).json({ data: message });
	} catch (error) {
		logger.error("POST /admin/messages error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// Route updateMessage supprimée - fonction non disponible dans messageStore.js

/**
 * DELETE /admin/messages/:messageId
 * Supprimer un message (admin seulement)
 */
router.delete("/messages/:messageId", async (req, res) => {
	try {
		const { messageId } = req.params;

		const result = await deleteMessage(messageId);
		res.json({ data: result });
	} catch (error) {
		logger.error("DELETE /admin/messages/:messageId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

// ========================================
// ROUTES CRUD FILTRES
// ========================================

/**
 * POST /admin/filters
 * Créer un filtre (admin seulement)
 */
router.post("/filters", async (req, res) => {
	try {
		const { name, type, options, is_active = true } = req.body;

		if (!name || !type) {
			return res.status(400).json({ error: "Nom et type requis" });
		}

		const filter = await createFilter({ name, type, options, is_active });
		res.status(201).json({ data: filter });
	} catch (error) {
		logger.error("POST /admin/filters error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * PUT /admin/filters/:filterId
 * Modifier un filtre (admin seulement)
 */
router.put("/filters/:filterId", async (req, res) => {
	try {
		const { filterId } = req.params;
		const updateData = req.body;

		const filter = await updateFilter(filterId, updateData);
		res.json({ data: filter });
	} catch (error) {
		logger.error("PUT /admin/filters/:filterId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /admin/filters/:filterId
 * Supprimer un filtre (admin seulement)
 */
router.delete("/filters/:filterId", async (req, res) => {
	try {
		const { filterId } = req.params;

		const result = await removeFilter(filterId);
		res.json({ data: result });
	} catch (error) {
		logger.error("DELETE /admin/filters/:filterId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;