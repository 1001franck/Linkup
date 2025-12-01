import jwt from 'jsonwebtoken';
import { isRevoked } from '../services/tokenRevokeStore.js';
import logger from '../utils/logger.js';

function auth(allowedRoles = null) {
	return async (req, res, next) => {
		// Récupérer le token depuis Authorization header (priorité) ou cookies (fallback)
		const authHeader = req.headers.authorization;
		const token =
			authHeader && authHeader.startsWith('Bearer ')
				? authHeader.slice(7)
				: req.cookies?.linkup_token; // Utiliser le bon nom de cookie

		// Log pour déboguer
		logger.debug({
			msg: '[AUTH] Token check',
			hasAuthHeader: !!authHeader,
			hasCookie: !!req.cookies?.linkup_token,
			cookieNames: req.cookies ? Object.keys(req.cookies) : [],
			path: req.path,
		});

		if (!token) {
			return res.status(401).json({ error: 'Token manquant' });
		}

		// Verify token signature and expiration
		try {
			const payload = jwt.verify(token, process.env.JWT_SECRET);
			// payload → { sub, role, email, iat, exp }

			// Reject tokens that were explicitly revoked server-side (async check)
			const revoked = await isRevoked(token);
			if (revoked) return res.status(401).json({ error: 'Token révoqué' });

			// Attach token payload to request for downstream handlers
			req.user = payload;

			// If allowedRoles is provided (array), ensure the role matches
			if (allowedRoles) {
				const userRole = payload.role; // Utiliser uniquement 'role' maintenant
				if (!userRole || !allowedRoles.includes(userRole)) {
					return res.status(403).json({ error: 'Accès interdit' });
				}
			}

			next();
		} catch (e) {
			// Could log e.message for debugging in dev
			return res.status(401).json({ error: 'Token invalide ou expiré' });
		}
	};
}

export default auth;
