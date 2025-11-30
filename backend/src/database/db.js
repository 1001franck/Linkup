// src/database/db.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
dotenv.config();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Vérification des variables d'environnement critiques
if (!supabaseUrl || !supabaseKey) {
	logger.error("❌ ERREUR CRITIQUE: Variables d'environnement Supabase manquantes");
	logger.error('   SUPABASE_URL:', supabaseUrl ? '[CONFIGURÉE]' : '[MANQUANTE]');
	logger.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '[CONFIGURÉE]' : '[MANQUANTE]');
	process.exit(1);
}

// Configuration optimisée du client Supabase
// Note: Supabase utilise PostgREST qui gère automatiquement le connection pooling côté serveur
// Le client JavaScript utilise HTTP/2 et réutilise les connexions automatiquement
const supabase = createClient(supabaseUrl, supabaseKey, {
	// Configuration pour optimiser les performances
	db: {
		schema: 'public', // Schéma par défaut
	},
	auth: {
		// Désactiver la persistance automatique si non nécessaire
		persistSession: false, // On gère les sessions via JWT dans les cookies
		autoRefreshToken: false, // Pas de refresh automatique pour le service role
	},
	global: {
		// Utiliser fetch natif (ou un fetch optimisé si disponible)
		fetch: globalThis.fetch,
		// Headers par défaut pour optimiser les requêtes
		headers: {
			'x-client-info': 'linkup-backend@1.0.0',
		},
	},
	// Configuration des timeouts pour éviter les requêtes qui traînent
	realtime: {
		// Désactiver realtime si non utilisé (améliore les performances)
		params: {
			eventsPerSecond: 0,
		},
	},
});

// Fonction pour tester la connexion
export async function initDB() {
	try {
		// Test de connexion avec une requête simple
		const { error } = await supabase.from('user_').select('count').limit(1);
		if (error) {
			// Si c'est une erreur de connexion réseau, donner plus de détails
			if (error.message?.includes('fetch failed') || error.message?.includes('ECONNREFUSED')) {
				logger.error('❌ Erreur de connexion à Supabase : Impossible de se connecter au serveur');
				logger.error('   Vérifiez que SUPABASE_URL est correct et que le serveur est accessible');
				logger.error('   Erreur:', error.message);
			} else {
				throw error;
			}
			return;
		}
		logger.info('✅ Connexion à Supabase réussie');
	} catch (err) {
		logger.error('❌ Erreur de connexion à Supabase :', err);
	}
}

export default supabase;
