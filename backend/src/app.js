import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import hpp from 'hpp';
import performanceMiddleware from './middlewares/performance.js';
import { generalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { metricsMiddleware, metricsHandler, metricsAuth } from './middlewares/metrics.js';
import { sanitizeSearchParams, limitRequestSize } from './middlewares/security.js';
import { csrfMiddleware } from './middlewares/csrf.js';
import logger from './utils/logger.js';

import authUserRoutes from './routes/auth.users.routes.js';
import usersRoutes from './routes/users.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import companiesRoutes from './routes/companies.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import applicationDocumentsRoutes from './routes/applicationDocuments.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import filtersRoutes from './routes/filters.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authCompanyRoutes from './routes/auth.companies.routes.js';
import userFilesRoutes from './routes/userFiles.routes.js';
import matchingRoutes from './routes/matching.routes.js';
import jobSaveRoutes from './routes/jobSave.routes.js';
import statsRoutes from './routes/stats.routes.js';
import companyStatsRoutes from './routes/companyStats.routes.js';
import forgottenPasswordRoutes from './routes/forgottenPassword.routes.js';
import resetPasswordRoutes from './routes/resetPassword.routes.js';
import healthRoutes from './routes/health.routes.js';

const app = express();

// Trust proxy pour Render (nécessaire pour express-rate-limit avec X-Forwarded-For)
// Render utilise un reverse proxy, donc on doit faire confiance aux headers X-Forwarded-For
app.set('trust proxy', 1);

// Désactiver le header X-Powered-By pour la sécurité
app.disable('x-powered-by');

// Protection standard HTTP (headers + param pollution)
app.use(helmet());
app.use(hpp());

// Rate limiting global (appliqué à toutes les routes sauf celles avec leur propre limiter)
app.use(generalLimiter);
app.use(metricsMiddleware);

// Configuration CORS pour la production
const getAllowedOrigins = () => {
	const origins = [];

	// Origines de développement (whitelist explicite)
	const devOrigins = [
		'http://localhost:3000',
		'http://localhost:3001',
		'http://localhost:3002',
		'http://127.0.0.1:3000',
		'http://127.0.0.1:3001',
		'http://127.0.0.1:3002',
	];
	origins.push(...devOrigins);

	// Origines de production depuis les variables d'environnement
	if (process.env.FRONTEND_URL) {
		const frontendUrls = process.env.FRONTEND_URL.split(',').map((url) => url.trim());
		origins.push(...frontendUrls);
	}

	// Si FRONTEND_URLS est défini (format alternatif)
	if (process.env.FRONTEND_URLS) {
		const frontendUrls = process.env.FRONTEND_URLS.split(',').map((url) => url.trim());
		origins.push(...frontendUrls);
	}

	return origins;
};

const corsOptions = {
	origin: (origin, callback) => {
		const allowedOrigins = getAllowedOrigins();
		const isProduction = process.env.NODE_ENV === 'production';
		const hasFrontendUrl = !!process.env.FRONTEND_URL || !!process.env.FRONTEND_URLS;

		// Si FRONTEND_URL est défini, on considère qu'on est en production (même si NODE_ENV n'est pas défini)
		const shouldUseProductionLogic = isProduction || hasFrontendUrl;

		// En développement (local uniquement), whitelist explicite (pas de wildcard)
		if (!shouldUseProductionLogic) {
			// Autoriser les requêtes sans origin uniquement pour les outils de test (Postman, curl)
			// Mais logger un avertissement pour la sécurité
			if (!origin) {
				logger.debug('[CORS] Requête sans origin autorisée (dev - outils de test uniquement)');
				return callback(null, true);
			}

			// Vérifier si l'origine est dans la whitelist explicite
			if (allowedOrigins.includes(origin)) {
				logger.debug(`[CORS] Origine autorisée (dev): ${origin}`);
				return callback(null, origin);
			}

			// Rejeter les origines non autorisées même en dev
			logger.warn(`[CORS] Origine non autorisée en dev: ${origin}. Whitelist:`, allowedOrigins);
			return callback(new Error(`Non autorisé par CORS. Origine: ${origin}`));
		}

		// En production ou si FRONTEND_URL est défini, vérification stricte
		// Autoriser les requêtes sans origin (outils de test)
		if (!origin) {
			logger.debug('[CORS] Requête sans origin autorisée (prod - outils de test)');
			return callback(null, '*');
		}

		// Vérifier si l'origine est dans la whitelist
		if (allowedOrigins.includes(origin)) {
			logger.debug(`[CORS] Origine autorisée (prod): ${origin}`);
			return callback(null, origin);
		}

		// Autoriser toutes les URLs Vercel (production + previews)
		// Pattern flexible pour accepter tous les formats Vercel :
		// - Production: https://linkup-phi.vercel.app
		// - Previews: https://linkup-1kj3oafq2-1001francks-projects.vercel.app
		// - Autres: https://*.vercel.app
		if (origin && origin.includes('.vercel.app')) {
			logger.debug(`[CORS] Origine Vercel autorisée: ${origin}`);
			return callback(null, origin);
		}

		// Rejeter les autres origines
		logger.warn(
			`[CORS] Origine non autorisée (prod): ${origin}. Origines autorisées:`,
			allowedOrigins,
			`Vercel check: ${origin && origin.includes('.vercel.app') ? 'match' : 'no match'}`
		);
		callback(new Error(`Non autorisé par CORS. Origine: ${origin}`));
	},
	credentials: true, // Permettre les cookies
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
	maxAge: 86400, // Cache preflight requests for 24 hours
};

app.use(cors(corsOptions));

// Compression optimisée des réponses (améliore les performances)
// Configuration fine : niveau de compression, types MIME, filtres
app.use(
	compression({
		// Niveau de compression (1-9, 6 est un bon compromis performance/taille)
		level: process.env.NODE_ENV === 'production' ? 6 : 4,
		// Filtrer les types MIME à compresser
		filter: (req, res) => {
			// Ne pas compresser si le client ne le supporte pas
			if (req.headers['x-no-compression']) {
				return false;
			}
			// Utiliser le filtre par défaut de compression
			return compression.filter(req, res);
		},
		// Types MIME à compresser (par défaut: text/*, application/json, etc.)
		// On peut être plus spécifique pour optimiser
		threshold: 1024, // Compresser seulement si la taille est > 1KB
	})
);

// Limite de taille pour les body JSON (protection contre les attaques DoS)
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(performanceMiddleware); // Monitoring des performances

// Middlewares de sécurité supplémentaires
app.use(limitRequestSize(2 * 1024 * 1024)); // Limite à 2MB pour toutes les requêtes
app.use(sanitizeSearchParams); // Sanitize les paramètres de recherche

// Protection CSRF (génère le token et vérifie pour les requêtes mutantes)
// Note: Désactivé en développement pour faciliter les tests, activé en production
if (process.env.NODE_ENV === 'production') {
	app.use(csrfMiddleware);
	logger.info('✅ Protection CSRF activée');
} else {
	logger.debug('⚠️  Protection CSRF désactivée en développement');
}

// Headers de sécurité renforcés
app.use((req, res, next) => {
	const isProduction = process.env.NODE_ENV === 'production';

	// Protection XSS
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Permissions-Policy (anciennement Feature-Policy)
	// Désactive les fonctionnalités non nécessaires pour améliorer la sécurité
	res.setHeader(
		'Permissions-Policy',
		'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
	);

	// Strict-Transport-Security (HSTS) - uniquement en production avec HTTPS
	if (isProduction) {
		// HSTS: Force HTTPS pendant 1 an, inclut les sous-domaines
		res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
	}

	// Content Security Policy renforcée
	if (isProduction) {
		// CSP stricte pour la production
		res.setHeader(
			'Content-Security-Policy',
			"default-src 'self'; " +
				"script-src 'self'; " +
				"style-src 'self' 'unsafe-inline'; " +
				"img-src 'self' data: https:; " +
				"font-src 'self' data:; " +
				"connect-src 'self' https:; " +
				"frame-ancestors 'none'; " +
				"base-uri 'self'; " +
				"form-action 'self'; " +
				'upgrade-insecure-requests;'
		);
	} else {
		// CSP plus permissive en développement pour faciliter le debug
		res.setHeader(
			'Content-Security-Policy',
			"default-src 'self'; " +
				"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
				"style-src 'self' 'unsafe-inline'; " +
				"img-src 'self' data: https: http:; " +
				"connect-src 'self' http://localhost:* https:;"
		);
	}

	next();
});

// Health check (doit être avant les autres routes pour être accessible rapidement)
app.use('/health', healthRoutes);

// Export Prometheus metrics (protégé par clé optionnelle)
app.get('/metrics', metricsAuth, metricsHandler);

// Route de test simple (désactivée en production pour la sécurité)
if (process.env.NODE_ENV !== 'production') {
	app.post('/test', (req, res) => {
		res.json({ message: 'Test réussi!', data: req.body });
	});
}

// Routes API
// Authentification
app.use('/auth/users', authUserRoutes);
app.use('/auth/companies', authCompanyRoutes);

// Entités principales
app.use('/reset-password', resetPasswordRoutes);
app.use('/forgotten-password', forgottenPasswordRoutes);
app.use('/saved-jobs', jobSaveRoutes);
app.use('/user-files', userFilesRoutes);
app.use('/matching', matchingRoutes);
app.use('/users', usersRoutes);
app.use('/jobs', jobsRoutes);
app.use('/companies', companiesRoutes);
app.use('/applications', applicationsRoutes);
app.use('/application-documents', applicationDocumentsRoutes);
app.use('/messages', messagesRoutes);
app.use('/filters', filtersRoutes);
app.use('/admin', adminRoutes);
app.use('/stats', statsRoutes);
app.use('/company-stats', companyStatsRoutes);

// Gestion des routes non trouvées (404)
app.use(notFoundHandler);

// Gestion globale des erreurs (doit être le dernier middleware)
app.use(errorHandler);

export default app;
