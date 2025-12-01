import express from 'express';
import jwt from 'jsonwebtoken';
import auth from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { revokeToken } from '../services/tokenRevokeStore.js';
import { createCompany, verifyCompanyCredentials } from '../services/companyStore.js';
import { validateCompanySignup, isValidEmail } from '../utils/validators.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * POST /auth/companies/signup
 * Body: { name, description, website, password, recruiter_mail, recruiter_firstname, recruiter_lastname, recruiter_phone, industry, city, zip_code, country, employees_number }
 * Rate limited: 5 tentatives par 15 minutes par IP
 */
router.post('/signup', authLimiter, async (req, res) => {
	try {
		// Validation stricte des entrées
		const validation = validateCompanySignup(req.body);

		if (!validation.valid) {
			return res.status(400).json({
				error: 'Données invalides',
				details: validation.errors,
			});
		}

		// Création entreprise avec données sanitizées
		// Note: createCompany hash le mot de passe en interne
		const company = await createCompany({
			...validation.sanitized,
			password: req.body.password, // Password en clair, sera hashé par createCompany
		});

		res.status(201).json({ data: company });
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
			'Signup company error'
		);

		// Ne pas exposer les détails d'erreur en production
		const errorMessage =
			process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message || 'Erreur serveur';

		res.status(500).json({ error: errorMessage });
	}
});

/**
 * POST /auth/companies/login
 * Body: { recruiter_mail, password }
 * Rate limited: 5 tentatives par 15 minutes par IP
 */
router.post('/login', authLimiter, async (req, res) => {
	const { recruiter_mail, password } = req.body || {};

	try {
		// Validation de base
		if (!recruiter_mail || !password) {
			return res.status(400).json({ error: 'recruiter_mail et password sont requis' });
		}

		// Validation format email
		if (!isValidEmail(recruiter_mail)) {
			return res.status(400).json({ error: "Format d'email invalide" });
		}

		// Normaliser l'email
		const normalizedEmail = recruiter_mail.trim().toLowerCase();

		const company = await verifyCompanyCredentials(normalizedEmail, password);
		if (!company) {
			// Ne pas révéler si l'email existe ou non (sécurité)
			return res.status(401).json({ error: 'Identifiants invalides' });
		}

		// Sign a token for the company account
		const token = jwt.sign(
			{
				sub: company.id_company,
				role: 'company', // Utiliser 'role' pour la cohérence avec les utilisateurs
				recruiter_mail: company.recruiter_mail,
				name: company.name,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		);

		// Définir les options de cookie sécurisées
		const isProduction = process.env.NODE_ENV === 'production';
		const cookieOptions = {
			httpOnly: true, // Protection contre XSS
			secure: isProduction, // HTTPS uniquement en production
			sameSite: isProduction ? 'strict' : 'lax', // 'lax' en dev pour permettre les redirections
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
			path: '/',
		};

		// Définir le cookie côté serveur
		res.cookie('linkup_token', token, cookieOptions);

		res.json({
			message: 'Connexion entreprise réussie',
			// Le token est stocké dans un cookie httpOnly, pas dans le body JSON (sécurité)
			company: {
				id: company.id_company,
				name: company.name,
				recruiter_mail: company.recruiter_mail,
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
			'Login company error'
		);
		return res.status(500).json({ error: 'Erreur serveur' });
	}
});

/**
 * POST /auth/companies/logout
 */
router.post('/logout', auth(), async (req, res) => {
	try {
		const authHeader = req.headers.authorization;
		const token =
			authHeader && authHeader.startsWith('Bearer ')
				? authHeader.slice(7)
				: req.cookies?.linkup_token; // Utiliser le bon nom de cookie

		const decoded = jwt.decode(token);
		const exp = decoded && decoded.exp ? decoded.exp : null;

		// Informations entreprise pour le tracking
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

		return res.json({ ok: true });
	} catch (err) {
		logger.error('Logout company error:', err);
		return res.status(500).json({ error: 'Erreur serveur' });
	}
});

export default router;
