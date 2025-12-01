/**
 * Middleware de rate limiting pour protéger contre les attaques par force brute
 * Utilise express-rate-limit pour limiter le nombre de requêtes par IP
 */

import rateLimit from 'express-rate-limit';

/**
 * Rate limiter général pour toutes les routes
 * Limite à 100 requêtes par 15 minutes par IP
 * En développement, limites réduites pour tester le comportement réel (250 au lieu de 1000)
 */
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: process.env.NODE_ENV === 'production' ? 100 : 250, // 250 en dev (au lieu de 1000), 100 en prod
	message: {
		error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
	},
	standardHeaders: true, // Retourne les headers RateLimit-* dans la réponse
	legacyHeaders: false, // Désactive les headers X-RateLimit-*
	trustProxy: true, // Faire confiance au proxy (Render, Vercel, etc.) pour l'IP réelle
});

/**
 * Rate limiter strict pour les routes d'authentification (login, signup)
 * Limite à 10 tentatives par 2 minutes par IP pour les inscriptions
 * Protection contre les attaques par force brute tout en permettant plusieurs tentatives
 * En développement, limites réduites pour tester le comportement réel (30 au lieu de 100)
 */
export const authLimiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: process.env.NODE_ENV === 'production' ? 10 : 30, // 30 en dev (au lieu de 100), 10 en prod
	message: {
		error: 'Trop de tentatives. Veuillez réessayer dans 2 minutes.',
	},
	standardHeaders: true,
	legacyHeaders: false,
	skipSuccessfulRequests: true, // Ne pas compter les requêtes réussies (inscriptions réussies)
	skipFailedRequests: false, // Compter les échecs pour protéger contre le spam
	trustProxy: true, // Faire confiance au proxy (Render, Vercel, etc.) pour l'IP réelle
});

/**
 * Rate limiter pour les requêtes de réinitialisation de mot de passe
 * Limite à 3 tentatives par heure par IP
 */
export const passwordResetLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 heure
	max: 3, // Limite de 3 tentatives par heure
	message: {
		error: 'Trop de tentatives de réinitialisation. Veuillez réessayer dans une heure.',
	},
	standardHeaders: true,
	legacyHeaders: false,
	trustProxy: true, // Faire confiance au proxy (Render, Vercel, etc.) pour l'IP réelle
});

/**
 * Rate limiter pour les uploads de fichiers
 * Limite à 10 uploads par heure par IP
 */
export const uploadLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 heure
	max: 10, // Limite de 10 uploads par heure
	message: {
		error: "Trop d'uploads. Veuillez réessayer dans une heure.",
	},
	standardHeaders: true,
	legacyHeaders: false,
	trustProxy: true, // Faire confiance au proxy (Render, Vercel, etc.) pour l'IP réelle
});
