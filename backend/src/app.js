import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import performanceMiddleware from "./middlewares/performance.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import logger from "./utils/logger.js";

import authUserRoutes from "./routes/auth.users.routes.js";
import usersRoutes from "./routes/users.routes.js";
import jobsRoutes from "./routes/jobs.routes.js";
import companiesRoutes from "./routes/companies.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";
import applicationDocumentsRoutes from "./routes/applicationDocuments.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import filtersRoutes from "./routes/filters.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authCompanyRoutes from "./routes/auth.companies.routes.js";
import userFilesRoutes from "./routes/userFiles.routes.js";
import matchingRoutes from "./routes/matching.routes.js";
import jobSaveRoutes from "./routes/jobSave.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import companyStatsRoutes from "./routes/companyStats.routes.js";
import forgottenPasswordRoutes from "./routes/forgottenPassword.routes.js";
import resetPasswordRoutes from "./routes/resetPassword.routes.js";

const app = express();

// Activer trust proxy pour Render (nécessaire pour express-rate-limit derrière un proxy)
// Render utilise un reverse proxy, donc on doit faire confiance aux headers X-Forwarded-*
// Utiliser 1 au lieu de true pour faire confiance uniquement au premier proxy (plus sécurisé)
app.set('trust proxy', 1);

// Désactiver le header X-Powered-By pour la sécurité
app.disable('x-powered-by');

// Configuration CORS - DOIT être AVANT le rate limiter pour les requêtes OPTIONS
const corsOptions = {
	origin: (origin, callback) => {
		// Toujours autoriser les requêtes sans origin (Postman, curl, etc.)
		if (!origin) {
			return callback(null, true);
		}
		
		// Autoriser toutes les origines localhost en développement
		if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
			return callback(null, true);
		}
		
		// Autoriser TOUS les sous-domaines Vercel (*.vercel.app)
		if (origin.endsWith('.vercel.app')) {
			logger.info(`[CORS] Origine Vercel autorisée: ${origin}`);
			return callback(null, true);
		}
		
		// Autoriser les origines depuis FRONTEND_URL
		if (process.env.FRONTEND_URL) {
			const frontendUrls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
			if (frontendUrls.includes(origin)) {
				logger.info(`[CORS] Origine autorisée (FRONTEND_URL): ${origin}`);
				return callback(null, true);
			}
		}
		
		// Par défaut, autoriser (pour éviter les blocages)
		// En production, vous pouvez restreindre en ajoutant des vérifications ici
		logger.info(`[CORS] Origine autorisée (par défaut): ${origin}`);
		callback(null, true);
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
	exposedHeaders: ['Content-Range', 'X-Content-Range'],
	maxAge: 86400,
	preflightContinue: false,
};

// CORS DOIT être AVANT le rate limiter
app.use(cors(corsOptions));

// Rate limiting global (appliqué à toutes les routes sauf celles avec leur propre limiter)
app.use(generalLimiter);

// Compression des réponses (améliore les performances)
app.use(compression());

// Limite de taille pour les body JSON (protection contre les attaques DoS)
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(performanceMiddleware); // Monitoring des performances

// Headers de sécurité
app.use((req, res, next) => {
	// Protection XSS
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
	
	// Content Security Policy (basique - à adapter selon vos besoins)
	if (process.env.NODE_ENV === 'production') {
		res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
	}
	
	next();
});

// Santé
app.get("/health", (req, res) => {
	res.json({ status: "ok", uptime: process.uptime() });
});

// Route de test simple (désactivée en production pour la sécurité)
if (process.env.NODE_ENV !== 'production') {
	app.post("/test", (req, res) => {
		res.json({ message: "Test réussi!", data: req.body });
	});
}

// Routes API
// Authentification
app.use("/auth/users", authUserRoutes);
app.use("/auth/companies", authCompanyRoutes);

// Entités principales
app.use("/reset-password", resetPasswordRoutes);
app.use("/forgotten-password", forgottenPasswordRoutes);
app.use("/saved-jobs", jobSaveRoutes);
app.use("/user-files", userFilesRoutes);
app.use("/matching", matchingRoutes);
app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);
app.use("/companies", companiesRoutes);
app.use("/applications", applicationsRoutes);
app.use("/application-documents", applicationDocumentsRoutes);
app.use("/messages", messagesRoutes);
app.use("/filters", filtersRoutes);
app.use("/admin", adminRoutes);
app.use("/stats", statsRoutes);
app.use("/company-stats", companyStatsRoutes);

// Gestion des routes non trouvées (404)
app.use(notFoundHandler);

// Gestion globale des erreurs (doit être le dernier middleware)
app.use(errorHandler);

export default app;