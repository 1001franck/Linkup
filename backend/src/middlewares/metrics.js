import client from 'prom-client';
import logger from '../utils/logger.js';

const register = new client.Registry();
register.setDefaultLabels({
	service: process.env.SERVICE_NAME || 'linkup-backend',
	env: process.env.NODE_ENV || 'development',
});

client.collectDefaultMetrics({
	register,
	prefix: 'linkup_',
});

const httpHistogram = new client.Histogram({
	name: 'linkup_http_request_duration_seconds',
	help: 'Durée des requêtes HTTP en secondes',
	labelNames: ['method', 'route', 'status_code'],
	registers: [register],
	buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});

export function metricsMiddleware(req, res, next) {
	const end = httpHistogram.startTimer({
		method: req.method,
		route: req.route?.path || req.path,
	});

	res.on('finish', () => {
		try {
			end({ status_code: res.statusCode });
		} catch (error) {
			logger.warn('[metricsMiddleware] fin timer', error);
		}
	});

	next();
}

export function metricsAuth(req, res, next) {
	const expectedKey = process.env.METRICS_API_KEY;
	const isProduction = process.env.NODE_ENV === 'production';

	// En production, METRICS_API_KEY est obligatoire
	if (isProduction && !expectedKey) {
		logger.error(
			'[metricsAuth] METRICS_API_KEY manquante en production - endpoint /metrics désactivé'
		);
		return res.status(503).json({
			error: 'Service de métriques non configuré',
			message: 'METRICS_API_KEY doit être définie en production',
		});
	}

	// Si pas de clé configurée (dev uniquement), autoriser l'accès
	if (!expectedKey) {
		logger.warn(
			'[metricsAuth] METRICS_API_KEY non définie - métriques publiques (développement uniquement)'
		);
		return next();
	}

	// Vérifier la clé fournie
	const providedKey = req.headers['x-metrics-key'] || req.query.token;
	if (providedKey === expectedKey) return next();

	return res.status(401).json({ error: 'Non autorisé' });
}

export async function metricsHandler(req, res) {
	try {
		res.set('Content-Type', register.contentType);
		res.send(await register.metrics());
	} catch (error) {
		logger.error('[metricsHandler] export metrics error', error);
		res.status(500).json({ error: 'Erreur génération métriques' });
	}
}
