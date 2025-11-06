import auth from "../middlewares/auth.js";
import express from "express";
import { createJob, findById, searchJobs, updateJob, removeJob, getJobTitleSuggestions, getLocationSuggestions } from "../services/jobStore.js";
import logger from "../utils/logger.js";
const router = express.Router();

/**
 * GET /jobs
 * Query: q, location, contractType, page, limit
 * 
 * MODIFICATION POUR /jobs PAGE:
 * - Ajout de JOIN avec table company pour récupérer name, logo, industry, city, country
 * - Enrichissement des données pour correspondre au format frontend
 * - Mapping des champs: id_job_offer → id, contract_type → type, published_at → postedAt
 * - Création d'objet salary depuis salary_min/salary_max
 * - Formatage des arrays requirements et benefits
 * 
 * Réponse enrichie:
 * {
 *   items: [
 *     {
 *       id: number,                    // id_job_offer
 *       title: string,
 *       description: string,
 *       location: string,
 *       type: string,                  // contract_type
 *       remote: boolean,
 *       salary: { min: number, max: number, currency: "EUR" } | null,
 *       postedAt: string,              // "Il y a X jours"
 *       requirements: string[],        // Array des exigences
 *       benefits: string[],            // Array des avantages
 *       company: string,               // Nom de l'entreprise
 *       companyId: number,             // ID de l'entreprise
 *       companyLogo: string | null,    // Logo de l'entreprise
 *       experience: string,
 *       industry: string,
 *       contract_duration: string,
 *       working_time: string,
 *       formation_required: string,
 *       urgency: string,
 *       education: string
 *     }
 *   ],
 *   page: number,
 *   limit: number,
 *   total: number
 * }
 */
router.get("/", async (req, res) => {
	try {
		const { q, location, contractType, minSalary, experience, industry, workMode, education, company, page, limit } = req.query;
		const result = await searchJobs({ q, location, contractType, minSalary, experience, industry, workMode, education, company, page, limit });
		res.json({ data: result }); // { data: { items, page, limit, total } }
	} catch (error) {
		logger.error("GET /jobs error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /jobs/suggestions/titles
 * Retourne des suggestions de titres de postes basées sur les offres existantes
 * Query: q (terme de recherche, optionnel, minimum 2 caractères)
 */
router.get("/suggestions/titles", async (req, res) => {
	try {
		const { q = "" } = req.query;
		const suggestions = await getJobTitleSuggestions(q);
		res.json({ data: suggestions });
	} catch (error) {
		logger.error("GET /jobs/suggestions/titles error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /jobs/suggestions/locations
 * Retourne des suggestions de localisations basées sur les offres existantes
 * Query: q (terme de recherche, optionnel, minimum 2 caractères)
 */
router.get("/suggestions/locations", async (req, res) => {
	try {
		const { q = "" } = req.query;
		const suggestions = await getLocationSuggestions(q);
		res.json({ data: suggestions });
	} catch (error) {
		logger.error("GET /jobs/suggestions/locations error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * POST /jobs  (protégée)
 * Body: { title, description, location?, contractType?, salaryMin?, salaryMax?, companyId? }
 */
router.post("/", auth(), async (req, res) => {
	try {
		const {
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
			contract_duration,
			working_time,
			formation_required,
			requirements,
			benefits,
			urgency,
			education,
			id_company,
		} = req.body || {};

		// Validation des champs obligatoires (correspondance avec la BD)
		const requiredFields = {
			title: title?.trim(),
			description: description?.trim(),
			location: location?.trim(),
			contract_type: contract_type?.trim()
		};

		const missingFields = Object.entries(requiredFields)
			.filter(([key, value]) => !value || value === '')
			.map(([key]) => key);

		if (missingFields.length > 0) {
			return res.status(400).json({ 
				success: false,
				error: `Champs obligatoires manquants: ${missingFields.join(', ')}`,
				missingFields
			});
		}

		// Vérifier que l'utilisateur est une entreprise ou admin
		const userRole = req.user.role || req.user.type;
		if (userRole !== "company" && userRole !== "admin") {
			return res.status(403).json({ error: "Seules les entreprises peuvent créer des offres" });
		}

		// Utiliser l'ID de l'entreprise connectée si pas fourni
		const companyId = id_company || (userRole === "company" ? req.user.sub : id_company);
		if (!companyId) {
			return res.status(400).json({ error: "id_company est requis" });
		}

		logger.debug("[POST /jobs] Création d'offre pour entreprise:", companyId);
		logger.debug("[POST /jobs] Données reçues:", {
			title,
			description,
			location,
			contract_type,
			salary_min,
			salary_max,
			remote,
			experience,
			industry,
			contract_duration,
			working_time,
			formation_required,
			id_company: companyId,
		});

		const job = await createJob({
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
			contract_duration,
			working_time,
			formation_required,
			requirements,
			benefits,
			urgency,
			education,
			id_company: companyId,
		});

		logger.debug("[POST /jobs] Offre créée avec succès:", job);
		res.status(201).json({ 
			success: true,
			data: job,
			message: "Offre d'emploi créée avec succès"
		});
	} catch (error) {
		logger.error("POST /jobs error:", error);
		
		// Gestion d'erreurs spécifiques (codes PostgreSQL)
		if (error.code === '23502') {
			return res.status(400).json({ 
				success: false,
				error: "Champ obligatoire manquant"
			});
		}
		
		if (error.code === '23503') {
			return res.status(400).json({ 
				success: false,
				error: "Référence invalide (entreprise non trouvée)"
			});
		}
		
		// Ne pas exposer les détails d'erreur en production
		res.status(500).json({ 
			success: false,
			error: "Erreur serveur lors de la création du job",
			...(process.env.NODE_ENV !== 'production' && { details: error.message })
		});
	}
});

/**
 * GET /jobs/:id
 * Détail + incrémente compteur de vues
 * 
 * MODIFICATION POUR /jobs PAGE:
 * - Utilise la même logique enrichie que GET /jobs
 * - Retourne les données au format frontend avec JOIN company
 * - Mapping des champs identique à la liste des jobs
 * 
 * Réponse enrichie:
 * {
 *   data: {
 *     id: number,                    // id_job_offer
 *     title: string,
 *     description: string,
 *     location: string,
 *     type: string,                  // contract_type
 *     remote: boolean,
 *     salary: { min: number, max: number, currency: "EUR" } | null,
 *     postedAt: string,              // "Il y a X jours"
 *     requirements: string[],        // Array des exigences
 *     benefits: string[],            // Array des avantages
 *     company: string,               // Nom de l'entreprise
 *     companyId: number,             // ID de l'entreprise
 *     companyLogo: string | null,    // Logo de l'entreprise
 *     experience: string,
 *     industry: string,
 *     contract_duration: string,
 *     working_time: string,
 *     formation_required: string,
 *     urgency: string,
 *     education: string
 *   }
 * }
 */
router.get("/:id", async (req, res) => {
	try {
		const job = await findById(req.params.id);
		if (!job) return res.status(404).json({ error: "Offre introuvable" });
		res.json({ data: job });
	} catch (error) {
		logger.error("GET /jobs/:id error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});


/**
 * PUT /jobs/:id
 * Body: { title, description, location?, contractType?, salaryRange?, companyId?, skills? }
 */
router.put("/:id", auth(), async (req, res) => {
	try {
		const job = await findById(req.params.id);
		if (!job) return res.status(404).json({ error: "Offre introuvable" });

		// Vérifier les permissions : propriétaire (entreprise) ou admin
		const isOwner = job.id_company === req.user.sub;
		const userRole = req.user.role || req.user.type;
		const isAdmin = userRole === "admin";
		if (!isOwner && !isAdmin) {
			return res.status(403).json({ error: "Vous ne pouvez pas modifier cette offre" });
		}

		const updated = await updateJob(job.id_job_offer || job.id || req.params.id, req.body || {});
		return res.json({ data: updated });
	} catch (error) {
		logger.error("PUT /jobs/:id error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /jobs/:id
 * Body: { title, description, location?, contractType?, salaryRange?, companyId?, skills? }
 */
router.delete("/:id", auth(), async (req, res) => {
	try {
		const job = await findById(req.params.id);
		if (!job) return res.status(404).json({ error: "Offre introuvable" });

		// Vérifier les permissions : propriétaire (entreprise) ou admin
		const isOwner = job.id_company === req.user.sub;
		const userRole = req.user.role || req.user.type;
		const isAdmin = userRole === "admin";
		if (!isOwner && !isAdmin) {
			return res.status(403).json({ error: "Vous ne pouvez pas supprimer cette offre" });
		}

		const deleted = await removeJob(job.id_job_offer || job.id || req.params.id);
		if (!deleted) return res.status(404).json({ error: "Offre introuvable" });
		return res.status(204).send(); // No Content
	} catch (error) {
		logger.error("DELETE /jobs/:id error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
