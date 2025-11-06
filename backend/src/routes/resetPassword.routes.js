import express from "express";
import auth from "../middlewares/auth.js";
import { verifyPassword, updatePassword } from "../services/resetPasswordStore.js";

const router = express.Router();

/**
 * POST /reset-password/verify
 */
router.post("/verify", auth(), async (req, res) => {
	const userId = req.user.sub;
	const { currentPassword } = req.body;
	if (!currentPassword) return res.status(400).json({ error: "currentPassword requis" });

	try {
		const valid = await verifyPassword(userId, currentPassword);
		if (valid) return res.status(200).json({ valid: true });
		return res.status(401).json({ valid: false, error: "Mot de passe incorrect" });
	} catch (err) {
		console.error("POST /auth/users/verify-password error:", err);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * PUT /reset-password/update
 */
router.put("/update", auth(), async (req, res) => {
	const userId = req.user.sub;
	const { currentPassword, newPassword } = req.body;
	if (!currentPassword || !newPassword) return res.status(400).json({ error: "currentPassword et newPassword requis" });

	try {
		await updatePassword(userId, currentPassword, newPassword);
		return res.status(200).json({ message: "Mot de passe mis à jour" });
	} catch (err) {
		if (err.code === "INVALID_CURRENT_PASSWORD") return res.status(401).json({ error: "Mot de passe actuel incorrect" });
		console.error("PUT /auth/users/password error:", err);
		return res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
