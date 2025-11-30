import express from 'express';
import auth from '../middlewares/auth.js';
import {
	addApplicationDocument,
	getApplicationDocumentsForApplication,
	deleteApplicationDocument,
} from '../services/applicationDocumentsStore.js';
import { validateNumericId } from '../middlewares/security.js';

const router = express.Router();

// Ajouter un document à une candidature
router.post('/:jobId', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		const { jobId } = req.params;
		const { document_type, file_name, file_url } = req.body;
		const userId = req.user.sub; // Le JWT contient l'ID dans 'sub'

		if (!document_type || !file_name || !file_url) {
			return res.status(400).json({ error: 'Type de document, nom de fichier et URL requis' });
		}

		const validTypes = ['cv', 'cover_letter', 'portfolio'];
		if (!validTypes.includes(document_type)) {
			return res.status(400).json({ error: 'Type de document invalide' });
		}

		const result = await addApplicationDocument(userId, jobId, document_type, file_name, file_url);

		if (result.success) {
			res.status(201).json({ message: 'Document ajouté avec succès', document: result.document });
		} else {
			res.status(400).json({ error: result.error });
		}
	} catch (error) {
		console.error('POST /application-documents error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

// Récupérer les documents d'une candidature
router.get('/:jobId', validateNumericId('jobId'), auth(), async (req, res) => {
	try {
		const { jobId } = req.params;
		const userId = req.user.sub; // Le JWT contient l'ID dans 'sub'

		const documents = await getApplicationDocumentsForApplication(userId, jobId);
		res.json({ documents });
	} catch (error) {
		console.error('GET /application-documents error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

// Supprimer un document
router.delete('/:documentId', validateNumericId('documentId'), auth(), async (req, res) => {
	try {
		const { documentId } = req.params;
		const userId = req.user.sub; // Le JWT contient l'ID dans 'sub'

		const result = await deleteApplicationDocument(documentId, userId);

		if (result.success) {
			res.json({ message: 'Document supprimé avec succès' });
		} else {
			res.status(400).json({ error: result.error });
		}
	} catch (error) {
		console.error('DELETE /application-documents error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
