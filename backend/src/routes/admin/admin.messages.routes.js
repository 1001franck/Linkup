/**
 * Routes admin pour la gestion des messages
 */

import express from 'express';
import logger from '../../utils/logger.js';
import { createMessage, deleteMessage } from '../../services/adminStore.js';

const router = express.Router();

/**
 * POST /admin/messages
 * Créer un message (admin seulement)
 */
router.post('/messages', async (req, res) => {
	try {
		const { id_sender, id_receiver, content, message_type = 'text' } = req.body;

		if (!id_sender || !id_receiver || !content) {
			return res.status(400).json({ error: 'Expéditeur, destinataire et contenu requis' });
		}

		const message = await createMessage({ id_sender, id_receiver, content, message_type });
		res.status(201).json({ data: message });
	} catch (error) {
		logger.error('POST /admin/messages error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /admin/messages/:messageId
 * Supprimer un message (admin seulement)
 */
router.delete('/messages/:messageId', async (req, res) => {
	try {
		const { messageId } = req.params;

		const result = await deleteMessage(messageId);
		res.json({ data: result });
	} catch (error) {
		logger.error('DELETE /admin/messages/:messageId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
