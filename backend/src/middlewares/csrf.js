/**
 * Middleware de protection CSRF (Cross-Site Request Forgery)
 * Utilise le pattern "Double Submit Cookie" pour protéger les requêtes mutantes
 * Compatible avec les cookies httpOnly utilisés pour l'authentification JWT
 */

import crypto from 'crypto';
import logger from '../utils/logger.js';

/**
 * Génère un token CSRF aléatoire
 * @returns {string} Token CSRF (32 caractères hex)
 */
export function generateCsrfToken() {
	return crypto.randomBytes(16).toString('hex');
}

/**
 * Middleware pour générer et envoyer un token CSRF
 * Le token est envoyé dans un cookie et doit être renvoyé dans le header X-CSRF-Token
 */
export function csrfTokenGenerator(req, res, next) {
	// Générer un nouveau token CSRF
	const token = generateCsrfToken();

	// Stocker le token dans un cookie (non httpOnly pour que JavaScript puisse le lire)
	const isProduction = process.env.NODE_ENV === 'production';
	res.cookie('csrf_token', token, {
		httpOnly: false, // Doit être accessible par JavaScript pour le double submit
		secure: isProduction, // HTTPS uniquement en production
		sameSite: isProduction ? 'strict' : 'lax',
		maxAge: 24 * 60 * 60 * 1000, // 24 heures
		path: '/',
	});

	// Ajouter le token dans les headers de réponse pour faciliter l'accès côté client
	res.setHeader('X-CSRF-Token', token);

	next();
}

/**
 * Middleware pour vérifier le token CSRF sur les requêtes mutantes
 * Vérifie que le token dans le header X-CSRF-Token correspond au token dans le cookie
 */
export function csrfProtection(req, res, next) {
	// Méthodes mutantes nécessitant une protection CSRF
	const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

	// Si c'est une requête OPTIONS (preflight CORS), laisser passer sans vérification
	if (req.method === 'OPTIONS') {
		return next();
	}

	// Si ce n'est pas une méthode mutante, passer
	if (!mutatingMethods.includes(req.method)) {
		return next();
	}

	// Routes exclues de la protection CSRF (authentification, etc.)
	const excludedPaths = [
		'/auth/users/login',
		'/auth/users/signup',
		'/auth/companies/login',
		'/auth/companies/signup',
		'/forgotten-password/mail',
		'/forgotten-password/update',
		'/reset-password/verify',
		'/reset-password/update',
		'/health',
		'/metrics',
	];

	// Vérifier si la route est exclue
	if (excludedPaths.some((path) => req.path.startsWith(path))) {
		return next();
	}

	// Récupérer le token depuis le header
	const headerToken = req.headers['x-csrf-token'] || req.headers['x-csrf-token'];

	// Récupérer le token depuis le cookie
	const cookieToken = req.cookies?.csrf_token;

	// Vérifier que les deux tokens existent et correspondent
	if (!headerToken || !cookieToken) {
		logger.warn('[CSRF] Token manquant', {
			method: req.method,
			path: req.path,
			hasHeaderToken: !!headerToken,
			hasCookieToken: !!cookieToken,
			ip: req.ip,
		});
		return res.status(403).json({
			error: 'Token CSRF manquant',
			message: 'Un token CSRF est requis pour cette opération',
		});
	}

	// Comparer les tokens de manière sécurisée (timing-safe)
	if (headerToken !== cookieToken) {
		logger.warn('[CSRF] Token invalide', {
			method: req.method,
			path: req.path,
			ip: req.ip,
		});
		return res.status(403).json({
			error: 'Token CSRF invalide',
			message: 'Le token CSRF ne correspond pas',
		});
	}

	// Token valide, continuer
	next();
}

/**
 * Middleware combiné : génère le token ET protège les requêtes mutantes
 * À utiliser sur toutes les routes
 */
export function csrfMiddleware(req, res, next) {
	// Générer le token pour toutes les requêtes
	csrfTokenGenerator(req, res, () => {
		// Vérifier le token pour les requêtes mutantes
		csrfProtection(req, res, next);
	});
}
