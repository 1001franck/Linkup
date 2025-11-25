import express from "express";
import { passwordResetLimiter } from "../middlewares/rateLimiter.js";
import { requestPasswordResetMail, tokenUpdatePassword } from "../services/forgottenPasswordStore.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * POST /forgotten-password/request
 * Envoie un mail avec un lien de réinitialisation
 * Rate limited: 3 tentatives par heure par IP
 */
router.post("/request", passwordResetLimiter, async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ error: "Email requis" });

		const result = await requestPasswordResetMail(email);
		if (result.error) return res.status(400).json({ error: result.error });

		res.json({ message: "Email de réinitialisation envoyé" });
	} catch (error) {
		logger.error("POST /password/forgot error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * POST /forgotten-password/reset
 * Réinitialise le mot de passe avec le token reçu
 * Rate limited: 3 tentatives par heure par IP
 */
router.post("/reset", passwordResetLimiter, async (req, res) => {
	try {
		const { token, newPassword } = req.body;
		if (!token || !newPassword) {
			return res.status(400).json({ error: "Token et nouveau mot de passe requis" });
		}

		const result = await tokenUpdatePassword(token, newPassword);
		if (result.error) return res.status(400).json({ error: result.error });

		res.json({ message: "Mot de passe mis à jour avec succès" });
	} catch (error) {
		logger.error("POST /forgotten-password/reset error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
