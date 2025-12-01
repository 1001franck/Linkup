import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { revokeToken } from '../services/tokenRevokeStore.js';
import { findByEmailForAuth, findByEmail, createUser } from '../services/userStore.js';
import { validateUserSignup, isValidEmail } from '../utils/validators.js';
import { BCRYPT_SALT_ROUNDS, JWT_DEFAULT_EXPIRES_IN } from '../utils/constants.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /auth/users/signup
 * Body: { email, password, firstname, lastname, phone?, bio_pro?, city?, country? }
 * Rate limited: 5 tentatives par 15 minutes par IP
 */
router.post('/signup', authLimiter, async (req, res) => {
	try {
		// Validation stricte des entrées
		const validation = validateUserSignup(req.body);

		if (!validation.valid) {
			logger.warn(
				{
					errors: validation.errors,
					body: {
						...req.body,
						password: '[REDACTED]',
						phone: req.body.phone ? `${req.body.phone.substring(0, 5)}...` : 'missing',
					},
					receivedFields: Object.keys(req.body || {}),
					fieldCount: Object.keys(req.body || {}).length,
				},
				'Signup validation failed'
			);
			return res.status(400).json({
				error: 'Données invalides',
				details: validation.errors,
			});
		}

		// Vérifier si l'email existe déjà
		const exists = await findByEmail(validation.sanitized.email);
		if (exists) {
			return res.status(409).json({ error: 'Email déjà utilisé' });
		}

		// Hash du mot de passe (bcrypt async)
		const password_hash = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);

		// Création utilisateur avec données sanitizées
		const user = await createUser({
			...validation.sanitized,
			password_hash,
		});

		// Retour: ne jamais renvoyer le hash du mot de passe
		return res.status(201).json({
			message: 'Utilisateur créé avec succès',
			id_user: user.id_user,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			role: user.role,
			phone: user.phone,
		});
	} catch (error) {
		logger.error(
			{
				err: error,
				code: error.code,
				message: error.message,
				details: error.details,
				hint: error.hint,
				stack: error.stack,
			},
			'Signup error'
		);

		// Gestion spécifique des erreurs Supabase
		if (error.code) {
			// Erreur Supabase avec code (ex: violation de contrainte unique)
			const isProduction = process.env.NODE_ENV === 'production';

			// Codes d'erreur Supabase courants
			if (error.code === '23505') {
				// Violation de contrainte unique (email déjà utilisé)
				return res.status(409).json({
					error: 'Email déjà utilisé',
					details: ['Cet email est déjà associé à un compte'],
				});
			}

			if (error.code === '23502') {
				// Champ NOT NULL manquant
				return res.status(400).json({
					error: 'Données invalides',
					details: [`Champ requis manquant: ${error.column || 'inconnu'}`],
				});
			}

			// Autres erreurs Supabase
			return res.status(500).json({
				error: isProduction ? 'Erreur serveur' : error.message || 'Erreur serveur',
				...(isProduction
					? {}
					: {
							details: error.details,
							hint: error.hint,
							code: error.code,
						}),
			});
		}

		// Erreur générique
		const isProduction = process.env.NODE_ENV === 'production';
		return res.status(500).json({
			error: isProduction ? 'Erreur serveur' : error.message || 'Erreur serveur',
			...(isProduction
				? {}
				: {
						details: error.details,
						hint: error.hint,
						stack: error.stack,
					}),
		});
	}
});

/**
 * POST /auth/users/login
 * Body: { email, password }
 * Rate limited: 5 tentatives par 15 minutes par IP
 */
router.post('/login', authLimiter, async (req, res) => {
	const { email, password } = req.body || {};

	try {
		// Validation de base
		if (!email || !password) {
			return res.status(400).json({ error: 'Email et mot de passe sont requis' });
		}

		// Validation format email
		if (!isValidEmail(email)) {
			return res.status(400).json({ error: "Format d'email invalide" });
		}

		// Normaliser l'email
		const normalizedEmail = email.trim().toLowerCase();

		const user = await findByEmailForAuth(normalizedEmail);
		if (!user) {
			// Ne pas révéler si l'email existe ou non (sécurité)
			return res.status(401).json({ error: 'Identifiants invalides' });
		}

		// Compare provided password with stored hash
		const ok = await bcrypt.compare(String(password), user.password);
		if (!ok) {
			// Ne pas révéler si le mot de passe est incorrect (sécurité)
			return res.status(401).json({ error: 'Identifiants invalides' });
		}

		// Sign JWT containing minimal claims
		const token = jwt.sign(
			{
				sub: user.id_user,
				role: user.role,
				email: user.email,
			},
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN || JWT_DEFAULT_EXPIRES_IN }
		);

		// Définir les options de cookie sécurisées
		const isProduction = process.env.NODE_ENV === 'production';
		const cookieOptions = {
			httpOnly: true, // Protection contre XSS - JavaScript ne peut pas accéder au cookie
			secure: isProduction, // HTTPS uniquement en production
			sameSite: isProduction ? 'none' : 'lax', // 'none' en production pour cross-origin (Vercel -> Render), 'lax' en dev
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
			path: '/', // Cookie disponible sur tout le site
		};

		// Définir le cookie côté serveur (pour les requêtes futures)
		res.cookie('linkup_token', token, cookieOptions);

		return res.json({
			message: 'Connexion réussie',
			// Le token est stocké dans un cookie httpOnly, pas dans le body JSON (sécurité)
			user: {
				id: user.id_user,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		logger.error(
			{
				err: error,
				code: error.code,
				message: error.message,
				details: error.details,
				hint: error.hint,
				stack: error.stack,
			},
			'Login error'
		);
		return res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /auth/users/logout
 * Cookie: token=<token>
 */
router.post('/logout', auth(), async (req, res) => {
	try {
		// Récupérer le token depuis Authorization header (priorité) ou cookies (fallback)
		const authHeader = req.headers.authorization;
		const token =
			authHeader && authHeader.startsWith('Bearer ')
				? authHeader.slice(7)
				: req.cookies?.linkup_token; // Utiliser le bon nom de cookie

		const decoded = jwt.decode(token);
		const exp = decoded && decoded.exp ? decoded.exp : null;

		// Informations utilisateur pour le tracking
		const userInfo = req.user
			? {
					id: req.user.sub,
					role: req.user.role,
				}
			: null;

		// Révoquer le token dans la base de données (non-blocking)
		revokeToken(token, exp, userInfo).catch((e) => {
			logger.warn('[logout] Erreur lors de la révocation du token:', e);
		});

		// Nettoyer les cookies côté serveur
		res.clearCookie('linkup_token');

		return res.json({ ok: true });
	} catch (err) {
		logger.error('Logout error:', err);
		return res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
