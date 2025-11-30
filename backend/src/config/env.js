/**
 * Validation et configuration des variables d'environnement
 * Utilise Zod pour valider toutes les variables au démarrage
 */

import { z } from 'zod';
import logger from '../utils/logger.js';
import { JWT_SECRET_MIN_LENGTH } from '../utils/constants.js';

/**
 * Schéma de validation pour les variables d'environnement
 */
const envSchema = z.object({
	// Variables Supabase (requises)
	SUPABASE_URL: z.string().url('SUPABASE_URL doit être une URL valide'),
	SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY est requis'),
	SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY est requis').optional(),

	// Variables JWT (requises)
	JWT_SECRET: z
		.string()
		.min(
			JWT_SECRET_MIN_LENGTH,
			`JWT_SECRET doit contenir au moins ${JWT_SECRET_MIN_LENGTH} caractères`
		),
	JWT_EXPIRES_IN: z.string().default('7d'),

	// Variables serveur (optionnelles avec valeurs par défaut)
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z
		.string()
		.regex(/^\d+$/, 'PORT doit être un nombre')
		.transform((val) => parseInt(val, 10))
		.default('3000'),

	// Variables frontend (optionnelles)
	FRONTEND_URL: z.string().url('FRONTEND_URL doit être une URL valide').optional(),
	FRONTEND_URLS: z.string().optional(),

	// Variables email (optionnelles)
	EMAIL_USER: z.string().email('EMAIL_USER doit être un email valide').optional(),
	EMAIL_PASS: z.string().optional(),

	// Variables admin (optionnelles)
	CREATE_DEFAULT_ADMIN: z
		.string()
		.transform((val) => val === 'true')
		.default('false')
		.optional(),
	DEFAULT_ADMIN_EMAIL: z.string().email('DEFAULT_ADMIN_EMAIL doit être un email valide').optional(),
	DEFAULT_ADMIN_PASSWORD: z
		.string()
		.min(8, 'DEFAULT_ADMIN_PASSWORD doit contenir au moins 8 caractères')
		.optional(),
	DEFAULT_ADMIN_FIRSTNAME: z.string().optional(),
	DEFAULT_ADMIN_LASTNAME: z.string().optional(),
	DEFAULT_ADMIN_PHONE: z.string().optional(),

	// Variables métriques (optionnelles)
	METRICS_API_KEY: z.string().optional(),

	// Variables Supabase Storage (optionnelles)
	SUPABASE_STORAGE_BUCKET: z.string().optional(),
});

/**
 * Valide et retourne les variables d'environnement
 * @returns {Object} Variables d'environnement validées
 * @throws {Error} Si la validation échoue
 */
export function validateEnv() {
	try {
		const env = envSchema.parse(process.env);
		logger.info("✅ Variables d'environnement validées avec succès");
		return env;
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.error("❌ ERREUR: Variables d'environnement invalides:");
			error.issues.forEach((issue) => {
				logger.error(`   - ${issue.path.join('.')}: ${issue.message}`);
			});
			logger.error("\nVeuillez corriger les variables d'environnement dans le fichier .env");
			process.exit(1);
		}
		throw error;
	}
}

/**
 * Récupère une variable d'environnement validée
 * @param {string} key - Clé de la variable
 * @param {any} defaultValue - Valeur par défaut si non définie
 * @returns {any} Valeur de la variable
 */
export function getEnv(key, defaultValue = undefined) {
	const env = validateEnv();
	return env[key] ?? defaultValue;
}
