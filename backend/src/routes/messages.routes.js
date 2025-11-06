import express from "express";
import auth from "../middlewares/auth.js";
import {
	createMessage,
	getMessagesBetweenUsers,
	getConversationsForUser,
	markAsRead,
	deleteMessage,
} from "../services/messageStore.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * POST /messages (protégée)
 * Body: { id_receiver, content }
 */
router.post("/", auth(), async (req, res) => {
	try {
		const { id_receiver, content } = req.body || {};

		if (!id_receiver || !content) {
			return res.status(400).json({ error: "id_receiver et content sont requis" });
		}

		if (id_receiver === req.user.sub) {
			return res.status(400).json({ error: "Vous ne pouvez pas vous envoyer un message à vous-même" });
		}

		const message = await createMessage({
			id_sender: req.user.sub,
			id_receiver,
			content,
		});

		res.status(201).json({ data: message });
	} catch (error) {
		logger.error("POST /messages error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /messages/conversations (protégée)
 * Récupère les conversations de l'utilisateur connecté
 */
router.get("/conversations", auth(), async (req, res) => {
	try {
		const conversations = await getConversationsForUser(req.user.sub);
		res.json({ data: conversations });
	} catch (error) {
		logger.error("GET /messages/conversations error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * GET /messages/:userId (protégée)
 * Récupère les messages entre l'utilisateur connecté et un autre utilisateur
 */
router.get("/:userId", auth(), async (req, res) => {
	try {
		const messages = await getMessagesBetweenUsers(req.user.sub, req.params.userId);
		res.json({ data: messages });
	} catch (error) {
		logger.error("GET /messages/:userId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * PUT /messages/:messageId/read (protégée)
 * Marque un message comme lu
 */
router.put("/:messageId/read", auth(), async (req, res) => {
	try {
		const message = await markAsRead(req.params.messageId, req.user.sub);
		if (!message) {
			return res.status(404).json({ error: "Message introuvable ou non autorisé" });
		}

		res.json({ data: message });
	} catch (error) {
		logger.error("PUT /messages/:messageId/read error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

/**
 * DELETE /messages/:messageId (protégée)
 * Supprime un message
 */
router.delete("/:messageId", auth(), async (req, res) => {
	try {
		const deleted = await deleteMessage(req.params.messageId, req.user.sub);
		if (!deleted) {
			return res.status(404).json({ error: "Message introuvable ou non autorisé" });
		}

		res.status(204).send(); // No Content
	} catch (error) {
		logger.error("DELETE /messages/:messageId error:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
});

export default router;
