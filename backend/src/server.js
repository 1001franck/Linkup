import dotenv from 'dotenv';
import app from './app.js';
import { initDB } from './database/db.js';
import { createUser } from './services/userStore.js';
import { validateEnv } from './config/env.js';
import logger from './utils/logger.js';
dotenv.config();

// Valider toutes les variables d'environnement au démarrage
const env = validateEnv();
const PORT = env.PORT;

// Gestion des erreurs non capturées (production-ready)
process.on('uncaughtException', (error) => {
	logger.error('UNCAUGHT EXCEPTION - Arrêt du serveur', {
		message: error.message,
		stack: error.stack,
		name: error.name,
		code: error.code,
		details: error.details,
		hint: error.hint,
	});
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	logger.error('UNHANDLED REJECTION - Promise rejetée', {
		reason: reason?.message || reason,
		stack: reason?.stack,
		name: reason?.name,
		code: reason?.code,
		details: reason?.details,
		hint: reason?.hint,
	});
	// Ne pas arrêter le serveur pour les rejections non gérées, juste logger
});

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', () => {
	logger.info('SIGTERM reçu - Arrêt propre du serveur');
	process.exit(0);
});

process.on('SIGINT', () => {
	logger.info('SIGINT reçu - Arrêt propre du serveur');
	process.exit(0);
});

// Affichage des variables d'environnement importantes
// (La validation complète est déjà faite par validateEnv() ci-dessus)
logger.info('===== Configuration validée =====');
logger.info(`NODE_ENV: ${env.NODE_ENV}`);
logger.info(`PORT: ${PORT}`);
logger.info(`SUPABASE_URL: ${env.SUPABASE_URL ? '[CONFIGURÉE]' : '[MANQUANTE]'}`);
logger.info(
	`JWT_SECRET: ${env.JWT_SECRET ? `[CONFIGURÉ - ${env.JWT_SECRET.length} caractères]` : '[MANQUANT]'}`
);

// Initialiser la connexion à la base de données
initDB();

// Crée un administrateur par défaut au démarrage (uniquement si activé via variables d'environnement)
async function createDefaultAdmin() {
	// Vérifier si la création d'admin par défaut est activée
	const CREATE_DEFAULT_ADMIN = env.CREATE_DEFAULT_ADMIN;

	if (!CREATE_DEFAULT_ADMIN) {
		logger.info(
			"⚠️  Création d'admin par défaut désactivée. Pour l'activer, définir CREATE_DEFAULT_ADMIN=true"
		);
		return;
	}

	try {
		const { findByEmail } = await import('./services/userStore.js');

		// Email et mot de passe configurables via variables d'environnement
		const adminEmail = env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
		const adminPassword = env.DEFAULT_ADMIN_PASSWORD;

		if (!adminPassword) {
			logger.error('❌ DEFAULT_ADMIN_PASSWORD est requis si CREATE_DEFAULT_ADMIN=true');
			return;
		}

		const existingAdmin = await findByEmail(adminEmail);
		if (existingAdmin) {
			logger.info(`L'administrateur par défaut (${adminEmail}) existe déjà.`);
			return;
		}

		logger.info(`Création de l'administrateur par défaut (${adminEmail})...`);

		// Hasher le mot de passe avant de l'envoyer
		const bcrypt = await import('bcryptjs');
		const { BCRYPT_SALT_ROUNDS } = await import('./utils/constants.js');
		const password_hash = await bcrypt.hash(adminPassword, BCRYPT_SALT_ROUNDS);

		await createUser({
			email: adminEmail,
			password_hash,
			firstname: env.DEFAULT_ADMIN_FIRSTNAME || 'Admin',
			lastname: env.DEFAULT_ADMIN_LASTNAME || 'User',
			role: 'admin',
			phone: env.DEFAULT_ADMIN_PHONE || '0123456789',
		});

		logger.info(`✅ Administrateur par défaut créé : ${adminEmail}`);
	} catch (error) {
		logger.error("❌ Erreur lors de la création de l'administrateur par défaut:", error.message);
	}
}

app.listen(PORT, async () => {
	logger.info(`--- API démarrée sur http://localhost:${PORT} ---`);

	// Création de l'administrateur par défaut
	await createDefaultAdmin();
});
