import supabase from "../database/db.js";
import bcrypt from "bcryptjs";
import logger from "../utils/logger.js";

// Verifier que le mot de passe entré est identique à celui en base
async function verifyPassword(userId, currentPassword) {
	try {
		// 1. Récupérer le mot de passe hashé de l’utilisateur
		const { data: user, error } = await supabase.from("user_").select("password").eq("id_user", userId).single();

		if (error) {
			logger.error("[verifyPassword] Supabase error:", error);
			return false;
		}

		// 2. Vérifier que l’utilisateur existe et qu’il a un mot de passe
		if (!user || !user.password) {
			logger.warn("[verifyPassword] user not found or password missing");
			return false;
		}

		// 3. Comparer le mot de passe fourni avec celui de la BDD
		const match = await bcrypt.compare(currentPassword, user.password);
		return match;
	} catch (err) {
		logger.error("[verifyPassword] Error:", err);
		return false;
	}
}

// Modifier le mot de passe d’un utilisateur
async function updatePassword(userId, currentPassword, newPassword) {
	// 1. Vérifier le mot de passe actuel
	const ok = await verifyPassword(userId, currentPassword);
	if (!ok) {
		const err = new Error("Mot de passe actuel incorrect");
		err.code = "INVALID_CURRENT_PASSWORD";
		throw err;
	}

	// 2. Générer le nouveau hash bcrypt
	const hash = await bcrypt.hash(newPassword, 10);

	// 3. Mettre à jour la BDD via Supabase
	const { error } = await supabase.from("user_").update({ password: hash }).eq("id_user", userId);

	if (error) {
		// Correction: tag de log cohérent avec le nom de la fonction
		logger.error("[updatePassword] Supabase update error:", error);
		throw new Error("Erreur lors de la mise à jour du mot de passe");
	}

	return true;
}

export { verifyPassword, updatePassword };
