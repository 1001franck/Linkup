import express from "express";
import auth from "../middlewares/auth.js";
import { saveJob, getSavedJobs, removeSavedJob } from "../services/jobSaveStore.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * GET /saved-jobs
 * Récupère toutes les offres sauvegardées de l'utilisateur connecté
 * Note: Les entreprises n'ont pas de jobs sauvegardés, mais on autorise l'accès pour éviter les erreurs 403
 */
router.get("/", auth(["user", "admin", "company"]), async (req, res) => {
	try {
		// Vérifier si c'est une entreprise (qui n'a pas de jobs sauvegardés)
		if (req.user.role === 'company') {
			return res.json({ data: [] }); // Retourner un tableau vide pour les entreprises
		}
		
		const savedJobs = await getSavedJobs(req.user.sub);
		res.json({ data: savedJobs });
	} catch (error) {
		logger.error("GET /saved-jobs error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * POST /saved-jobs
 * Sauvegarde une offre pour l’utilisateur connecté
 * Body: { id_job_offer }
 */
router.post("/", auth(["user", "admin"]), async (req, res) => {
	try {
		const { id_job_offer } = req.body || {};
		const id_user = req.user.sub;

		if (!id_job_offer) {
			return res.status(400).json({ error: "id_job_offer est requis" });
		}

		const result = await saveJob(id_user, id_job_offer);

		if (result.error) {
			return res.status(409).json({ error: result.error });
		}

		res.status(201).json({ data: result });
	} catch (error) {
		logger.error("POST /saved-jobs error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /saved-jobs/:id_job_offer
 * Supprime une offre sauvegardée
 */
router.delete("/:id_job_offer", auth(["user", "admin"]), async (req, res) => {
	try {
		const id_user = req.user.sub;
		const { id_job_offer } = req.params;

		const deleted = await removeSavedJob(id_user, id_job_offer);

		if (!deleted) {
			return res.status(404).json({ error: "Offre non trouvée ou non sauvegardée" });
		}

		res.status(204).send(); // No Content
	} catch (error) {
		logger.error("DELETE /saved-jobs/:id_job_offer error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
