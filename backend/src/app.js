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

const app = express();

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

	// Origines de développement (toujours autorisées)
	origins.push('http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002');

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

		// En développement, être plus permissif
		if (process.env.NODE_ENV !== 'production') {
			// Autoriser les requêtes sans origin (Postman, curl, etc.)
			if (!origin) {
				return callback(null, true);
			}
			// Autoriser toutes les origines localhost en développement
			if (
				origin &&
				(origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))
			) {
				logger.debug(`[CORS] Origine autorisée (dev): ${origin}`);
				// Retourner l'origine spécifique pour que les headers CORS soient correctement définis
				return callback(null, origin);
			}
		}

		// Vérifier si l'origine est autorisée
		if (!origin || allowedOrigins.includes(origin)) {
			// Retourner l'origine spécifique pour que les headers CORS soient correctement définis
			logger.debug(`[CORS] Origine autorisée: ${origin}`);
			callback(null, origin || '*');
		} else {
			logger.warn(`[CORS] Origine non autorisée: ${origin}. Origines autorisées:`, allowedOrigins);
			callback(new Error(`Non autorisé par CORS. Origine: ${origin}`));
		}
	},
	credentials: true, // Permettre les cookies
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
	maxAge: 86400, // Cache preflight requests for 24 hours
};

app.use(cors(corsOptions));

// Compression des réponses (améliore les performances)
app.use(compression());

// Limite de taille pour les body JSON (protection contre les attaques DoS)
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(performanceMiddleware); // Monitoring des performances

// Middlewares de sécurité supplémentaires
app.use(limitRequestSize(2 * 1024 * 1024)); // Limite à 2MB pour toutes les requêtes
app.use(sanitizeSearchParams); // Sanitize les paramètres de recherche

// Headers de sécurité
app.use((req, res, next) => {
	// Protection XSS
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Content Security Policy (basique - à adapter selon vos besoins)
	if (process.env.NODE_ENV === 'production') {
		res.setHeader(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
		);
	}

	next();
});

// Santé
app.get('/health', (req, res) => {
	res.json({ status: 'ok', uptime: process.uptime() });
});

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
