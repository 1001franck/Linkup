import express from "express";
import auth from "../middlewares/auth.js";
import { createClient } from '@supabase/supabase-js';
import logger from "../utils/logger.js";
import { 
	getCompanyDashboardStats,
	getJobsStats,
	getApplicationsStats,
	getInterviewsStats,
	getHiredStats,
	getRecentApplications,
	getActiveJobs,
	getUpcomingInterviews,
	getAllJobs,
	getAllJobsForManagement
} from "../services/companyStatsStore.js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const router = express.Router();

/**
 * GET /company-stats/dashboard
 * Récupère toutes les statistiques du dashboard entreprise
 * Header: Authorization: Bearer <token>
 */
router.get("/dashboard", auth(["company", "admin"]), async (req, res) => {
	try {
		logger.debug(`[GET /company-stats/dashboard] Entreprise: ${req.user.sub}`);
		
		const stats = await getCompanyDashboardStats(req.user.sub);
		
		res.json({
			success: true,
			data: stats
		});
	} catch (error) {
		logger.error("GET /company-stats/dashboard error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des statistiques" 
		});
	}
});

/**
 * GET /company-stats/jobs
 * Récupère les statistiques des offres d'emploi
 */
router.get("/jobs", auth(["company", "admin"]), async (req, res) => {
	try {
		const stats = await getJobsStats(req.user.sub);
		res.json({
			success: true,
			data: stats
		});
	} catch (error) {
		logger.error("GET /company-stats/jobs error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des statistiques des offres" 
		});
	}
});

/**
 * GET /company-stats/applications
 * Récupère les statistiques des candidatures
 */
router.get("/applications", auth(["company", "admin"]), async (req, res) => {
	try {
		const stats = await getApplicationsStats(req.user.sub);
		res.json({
			success: true,
			data: stats
		});
	} catch (error) {
		logger.error("GET /company-stats/applications error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des statistiques des candidatures" 
		});
	}
});

/**
 * GET /company-stats/interviews
 * Récupère les statistiques des entretiens
 */
router.get("/interviews", auth(["company", "admin"]), async (req, res) => {
	try {
		const stats = await getInterviewsStats(req.user.sub);
		res.json({
			success: true,
			data: stats
		});
	} catch (error) {
		logger.error("GET /company-stats/interviews error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des statistiques des entretiens" 
		});
	}
});

/**
 * GET /company-stats/hired
 * Récupère les statistiques des embauches
 */
router.get("/hired", auth(["company", "admin"]), async (req, res) => {
	try {
		const stats = await getHiredStats(req.user.sub);
		res.json({
			success: true,
			data: stats
		});
	} catch (error) {
		logger.error("GET /company-stats/hired error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des statistiques des embauches" 
		});
	}
});

/**
 * GET /company-stats/recent-applications
 * Récupère les candidatures récentes
 */
router.get("/recent-applications", auth(["company", "admin"]), async (req, res) => {
	try {
		const applications = await getRecentApplications(req.user.sub);
		res.json({
			success: true,
			data: applications
		});
	} catch (error) {
		logger.error("GET /company-stats/recent-applications error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des candidatures récentes" 
		});
	}
});

/**
 * GET /company-stats/active-jobs
 * Récupère les offres actives
 */
router.get("/active-jobs", auth(["company", "admin"]), async (req, res) => {
	try {
		const jobs = await getActiveJobs(req.user.sub);
		res.json({
			success: true,
			data: jobs
		});
	} catch (error) {
		logger.error("GET /company-stats/active-jobs error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des offres actives" 
		});
	}
});

/**
 * GET /company-stats/upcoming-interviews
 * Récupère les entretiens à venir
 */
router.get("/upcoming-interviews", auth(["company", "admin"]), async (req, res) => {
	try {
		const interviews = await getUpcomingInterviews(req.user.sub);
		res.json({
			success: true,
			data: interviews
		});
	} catch (error) {
		logger.error("GET /company-stats/upcoming-interviews error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des entretiens à venir" 
		});
	}
});

/**
 * GET /company-stats/all-jobs
 * Récupère toutes les offres d'emploi de l'entreprise (pour le dashboard - limité)
 * Header: Authorization: Bearer <token>
 */
router.get("/all-jobs", auth(["company", "admin"]), async (req, res) => {
	try {
		const jobs = await getAllJobs(req.user.sub);
		res.json({
			success: true,
			data: jobs
		});
	} catch (error) {
		logger.error("GET /company-stats/all-jobs error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des offres d'emploi" 
		});
	}
});

/**
 * GET /company-stats/all-jobs-management
 * Récupère toutes les offres d'emploi de l'entreprise pour la page de gestion
 * Header: Authorization: Bearer <token>
 */
router.get("/all-jobs-management", auth(["company", "admin"]), async (req, res) => {
	try {
		const jobs = await getAllJobsForManagement(req.user.sub);
		res.json({
			success: true,
			data: jobs
		});
	} catch (error) {
		logger.error("GET /company-stats/all-jobs-management error:", error);
		res.status(500).json({ 
			success: false,
			error: "Erreur lors de la récupération des offres d'emploi" 
		});
	}
});

export default router;
