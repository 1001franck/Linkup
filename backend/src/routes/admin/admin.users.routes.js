/**
 * Routes admin pour la gestion des utilisateurs
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import logger from '../../utils/logger.js';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/userStore.js';
import { changeUserPassword } from '../../services/adminStore.js';
import { BCRYPT_SALT_ROUNDS } from '../../utils/constants.js';

const router = express.Router();

/**
 * GET /admin/users
 * Liste des utilisateurs avec pagination et recherche
 */
router.get('/users', async (req, res) => {
	try {
		const { page = 1, limit = 20, search = null } = req.query;
		const users = await getAllUsers({ page: parseInt(page), limit: parseInt(limit), search });
		res.json({ success: true, data: users });
	} catch (error) {
		logger.error('GET /admin/users error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /admin/users
 * Créer un utilisateur
 */
router.post('/users', async (req, res) => {
	try {
		const {
			email,
			password,
			firstname,
			lastname,
			role = 'user',
			phone,
			bio_pro,
			city,
			country,
		} = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email et mot de passe requis' });
		}

		const user = await createUser({
			email,
			password_hash: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS),
			firstname,
			lastname,
			role,
			phone,
			bio_pro,
			city,
			country,
		});

		res.json({ success: true, data: user });
	} catch (error) {
		logger.error('POST /admin/users error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /admin/users/:userId
 * Modifier un utilisateur
 */
router.put('/users/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const updateData = req.body;

		// Ne pas permettre la modification du mot de passe via cette route
		delete updateData.password;

		const user = await updateUser(userId, updateData);
		res.json({ success: true, data: user });
	} catch (error) {
		logger.error('PUT /admin/users/:userId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * DELETE /admin/users/:userId
 * Supprimer un utilisateur
 */
router.delete('/users/:userId', async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await deleteUser(userId);
		res.json({ success: true, data: result });
	} catch (error) {
		logger.error('DELETE /admin/users/:userId error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * PUT /admin/users/:userId/password
 * Changer le mot de passe d'un utilisateur
 */
router.put('/users/:userId/password', async (req, res) => {
	try {
		const { userId } = req.params;
		const { newPassword } = req.body;

		if (!newPassword || newPassword.length < 8) {
			return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
		}

		const result = await changeUserPassword(userId, newPassword);
		res.json({ success: true, data: result });
	} catch (error) {
		logger.error('PUT /admin/users/:userId/password error:', error);
		res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
