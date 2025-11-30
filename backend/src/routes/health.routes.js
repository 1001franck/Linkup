/**
 * Route de health check améliorée
 * Vérifie l'état de la base de données, de la mémoire et du disque
 */

import express from 'express';
import supabase from '../database/db.js';
import logger from '../utils/logger.js';
import os from 'os';
import { stat } from 'fs/promises';

const router = express.Router();

/**
 * GET /health
 * Health check simple (rapide, pour les load balancers)
 */
router.get('/', async (req, res) => {
	try {
		// Test rapide de la base de données
		const { error } = await supabase.from('user_').select('count').limit(1);

		if (error) {
			return res.status(503).json({
				status: 'unhealthy',
				database: 'disconnected',
				timestamp: new Date().toISOString(),
			});
		}

		res.json({
			status: 'healthy',
			timestamp: new Date().toISOString(),
		});
	} catch (err) {
		logger.error('[health] Erreur health check:', err);
		res.status(503).json({
			status: 'unhealthy',
			timestamp: new Date().toISOString(),
		});
	}
});

/**
 * GET /health/detailed
 * Health check détaillé (pour le monitoring)
 */
router.get('/detailed', async (req, res) => {
	const health = {
		status: 'healthy',
		timestamp: new Date().toISOString(),
		checks: {
			database: { status: 'unknown', responseTime: null },
			memory: { status: 'unknown', usage: null },
			disk: { status: 'unknown', usage: null },
		},
	};

	let allHealthy = true;

	// 1. Vérification de la base de données
	try {
		const dbStart = Date.now();
		const { error } = await supabase.from('user_').select('count').limit(1);
		const dbResponseTime = Date.now() - dbStart;

		if (error) {
			health.checks.database = {
				status: 'unhealthy',
				error: error.message,
				responseTime: dbResponseTime,
			};
			allHealthy = false;
		} else {
			health.checks.database = {
				status: 'healthy',
				responseTime: `${dbResponseTime}ms`,
			};
		}
	} catch (err) {
		health.checks.database = {
			status: 'unhealthy',
			error: err.message,
		};
		allHealthy = false;
	}

	// 2. Vérification de la mémoire
	try {
		const totalMemory = os.totalmem();
		const freeMemory = os.freemem();
		const usedMemory = totalMemory - freeMemory;
		const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

		// Seuil d'alerte: 90% d'utilisation
		const memoryThreshold = 90;
		const isMemoryHealthy = parseFloat(memoryUsagePercent) < memoryThreshold;

		health.checks.memory = {
			status: isMemoryHealthy ? 'healthy' : 'warning',
			usage: `${memoryUsagePercent}%`,
			total: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
			free: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
			used: `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
		};

		if (!isMemoryHealthy) {
			allHealthy = false;
		}
	} catch (err) {
		health.checks.memory = {
			status: 'unknown',
			error: err.message,
		};
	}

	// 3. Vérification de l'espace disque (approximatif via le répertoire courant)
	try {
		// Note: stat() ne donne pas l'espace disque total/libre
		// Pour une vraie vérification, il faudrait utiliser un package comme 'diskusage'
		// Pour l'instant, on vérifie juste que le répertoire est accessible
		await stat(process.cwd());
		health.checks.disk = {
			status: 'healthy',
			message: 'Répertoire accessible',
			// Note: Pour une vérification complète, installer: npm install diskusage
			// et utiliser: diskusage.check(process.cwd(), (err, info) => { ... })
		};
	} catch (err) {
		health.checks.disk = {
			status: 'unhealthy',
			error: err.message,
		};
		allHealthy = false;
	}

	// Définir le statut global
	health.status = allHealthy ? 'healthy' : 'unhealthy';

	// Retourner le code de statut approprié
	const statusCode = allHealthy ? 200 : 503;
	res.status(statusCode).json(health);
});

export default router;
