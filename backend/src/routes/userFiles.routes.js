import express from 'express';
import multer from 'multer';
import auth from '../middlewares/auth.js';
import {
	uploadFileToSupabase,
	listFilesForUser,
	deleteFile,
	getProfilePicture,
} from '../services/userFilesStore.js';
import { validateFile } from '../utils/fileValidator.js';
import logger from '../utils/logger.js';
import supabase from '../database/db.js';

const router = express.Router();

// Configuration multer avec limite de taille
const upload = multer({
	limits: {
		fileSize: 10 * 1024 * 1024, // 10 MB
		files: 1, // Un seul fichier à la fois
	},
}); // in-memory

/**
 * POST /user-files/upload
 * Header: Authorization
 * Form-Data: file (binary), file_type (pdf|photo)
 */
router.post('/upload', auth(), upload.single('file'), async (req, res) => {
	try {
		const id_user = req.user.sub; // Le JWT contient l'ID dans 'sub'

		// Vérifier que le fichier est présent
		if (!req.file) {
			return res.status(400).json({ error: 'Fichier requis' });
		}

		// Récupérer le type de fichier depuis le body
		const file_type = req.body.file_type;
		if (!file_type) {
			return res
				.status(400)
				.json({ error: 'Type de fichier requis (pdf, photo, cv, cover_letter)' });
		}

		// Validation stricte du fichier
		const validation = validateFile(req.file, file_type);
		if (!validation.valid) {
			return res.status(400).json({ error: validation.error });
		}

		// Vérifier le nombre de fichiers de l'utilisateur (limite à 10 fichiers)
		const userFiles = await listFilesForUser(id_user);
		if (userFiles && userFiles.length >= 10) {
			return res.status(400).json({
				error: "Limite de fichiers atteinte. Supprimez un fichier avant d'en ajouter un nouveau.",
			});
		}

		const result = await uploadFileToSupabase(id_user, file_type, req.file);
		return res.status(201).json({ data: result });
	} catch (err) {
		// Gérer les erreurs spécifiques de multer (fichier trop volumineux)
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res
				.status(400)
				.json({ error: 'Le fichier est trop volumineux. Taille maximum: 10 MB' });
		}

		logger.error('/user-files/upload error:', err);
		return res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /user-files/me
 * Header: Authorization
 */
router.get('/me', auth(), async (req, res) => {
	try {
		const id_user = req.user.sub; // Le JWT contient l'ID dans 'sub'
		const files = await listFilesForUser(id_user);
		res.json({ data: files });
	} catch (err) {
		logger.error('GET /user-files/me error:', err);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * GET /user-files/profile-picture
 * Header: Authorization
 * Returns the profile picture URL for the authenticated user
 */
router.get('/profile-picture', auth(), async (req, res) => {
	try {
		logger.debug(`[GET /user-files/profile-picture] Utilisateur: ${req.user.sub}`);
		const id_user = req.user.sub; // Le JWT contient l'ID dans 'sub'
		const profilePicture = await getProfilePicture(id_user);

		logger.debug(
			`[GET /user-files/profile-picture] Photo de profil: ${profilePicture || 'Aucune'}`
		);
		res.json({ data: { profile_picture: profilePicture } });
	} catch (err) {
		logger.error('GET /user-files/profile-picture error:', err);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /user-files/profile-picture
 * Header: Authorization
 * Supprime la photo de profil de l'utilisateur authentifié
 */
router.delete('/profile-picture', auth(), async (req, res) => {
	try {
		const id_user = req.user.sub; // Le JWT contient l'ID dans 'sub'
		logger.debug(
			`[DELETE /user-files/profile-picture] Suppression de la photo de profil pour l'utilisateur: ${id_user}`
		);

		// Trouver le fichier photo de profil
		const { data: profilePictureFile, error: findError } = await supabase
			.from('user_files')
			.select('id_user_files, file_url')
			.eq('id_user', id_user)
			.eq('file_type', 'photo')
			.order('uploaded_at', { ascending: false })
			.limit(1)
			.maybeSingle();

		if (findError) {
			logger.error('Erreur lors de la recherche de la photo de profil:', findError);
			return res.status(500).json({ error: 'Erreur serveur' });
		}

		if (!profilePictureFile) {
			logger.debug(
				`[DELETE /user-files/profile-picture] Aucune photo de profil trouvée pour l'utilisateur ${id_user} - considéré comme succès`
			);
			return res.status(200).json({
				message: 'Aucune photo de profil à supprimer',
				success: true,
			});
		}

		// Supprimer le fichier de Supabase Storage
		const { error: storageError } = await supabase.storage
			.from('user-files')
			.remove([profilePictureFile.file_url]);

		if (storageError) {
			logger.warn('Erreur lors de la suppression du fichier de storage:', storageError);
			// Continuer même si la suppression du storage échoue
		}

		// Supprimer l'enregistrement de la base de données
		const { error: deleteError } = await supabase
			.from('user_files')
			.delete()
			.eq('id_user_files', profilePictureFile.id_user_files);

		if (deleteError) {
			logger.error("Erreur lors de la suppression de l'enregistrement:", deleteError);
			return res.status(500).json({ error: 'Erreur serveur' });
		}

		logger.debug(
			`[DELETE /user-files/profile-picture] Photo de profil supprimée avec succès pour l'utilisateur ${id_user}`
		);
		return res.status(200).json({
			message: 'Photo de profil supprimée avec succès',
			success: true,
		});
	} catch (err) {
		logger.error('DELETE /user-files/profile-picture error:', err);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /user-files/:id
 * Header: Authorization
 */
router.delete('/:id', auth(), async (req, res) => {
	try {
		const id_user = req.user.sub; // Le JWT contient l'ID dans 'sub'
		const id = req.params.id;
		const result = await deleteFile(id, id_user);
		if (!result.deleted) {
			if (result.reason === 'not_found')
				return res.status(404).json({ error: 'Fichier introuvable' });
			if (result.reason === 'forbidden') return res.status(403).json({ error: 'Non autorisé' });
		}
		return res.status(204).send();
	} catch (err) {
		logger.error('DELETE /user-files/:id error:', err);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
