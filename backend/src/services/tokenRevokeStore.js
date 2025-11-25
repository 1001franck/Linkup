/**
 * Token revocation store utilisant Supabase (base de données)
 * Permet la révocation distribuée de tokens JWT en production
 * Compatible avec plusieurs instances de serveur
 */

import crypto from 'crypto';
import supabase from '../database/db.js';
import logger from '../utils/logger.js';

/**
 * Hash un token pour le stocker en base de données
 * Utilise SHA-256 pour créer un hash unique du token
 * @param {string} token - Token JWT à hasher
 * @returns {string} - Hash du token
 */
function hashToken(token) {
	return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Nettoie les tokens expirés de la base de données
 * Supprime tous les tokens dont la date d'expiration est passée
 */
async function cleanupExpiredTokens() {
	try {
		const now = new Date().toISOString();
		const { error } = await supabase.from('revoked_tokens').delete().lt('expires_at', now);

		if (error) {
			// Ignorer l'erreur si la table n'existe pas encore (code 42P01 = relation does not exist)
			if (error.code === '42P01' || error.message?.includes('does not exist')) {
				logger.debug(
					"[tokenRevokeStore] Table revoked_tokens n'existe pas encore. Exécutez backend/token_revocation.sql"
				);
				return;
			}
			logger.warn('[tokenRevokeStore] Erreur lors du nettoyage:', error);
		}
	} catch (e) {
		// Ignorer les erreurs de connexion réseau silencieusement
		if (e.message?.includes('fetch failed') || e.message?.includes('ECONNREFUSED')) {
			logger.debug('[tokenRevokeStore] Impossible de se connecter à Supabase pour le nettoyage');
			return;
		}
		logger.warn('[tokenRevokeStore] Erreur lors du nettoyage:', e);
	}
}

// Nettoyer les tokens expirés toutes les heures (pas au démarrage pour éviter les erreurs si la table n'existe pas)
// Le nettoyage sera fait lors de la première vérification de token
setInterval(cleanupExpiredTokens, 60 * 60 * 1000).unref(); // Toutes les heures

/**
 * Marque un token comme révoqué jusqu'à son expiration
 * @param {string} token - Token JWT à révoquer
 * @param {number|null} expSeconds - Date d'expiration du token en secondes depuis epoch (optionnel)
 * @param {object} userInfo - Informations sur l'utilisateur (optionnel) { id, role }
 */
export async function revokeToken(token, expSeconds = null, userInfo = null) {
	try {
		const tokenHash = hashToken(token);

		// Calculer la date d'expiration
		const expiresAt = expSeconds
			? new Date(expSeconds * 1000).toISOString()
			: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(); // Par défaut 7 jours

		// Insérer ou mettre à jour le token révoqué
		const { error } = await supabase.from('revoked_tokens').upsert(
			{
				token_hash: tokenHash,
				expires_at: expiresAt,
				user_id: userInfo?.id || null,
				user_role: userInfo?.role || null,
			},
			{
				onConflict: 'token_hash',
			}
		);

		if (error) {
			// Ignorer l'erreur si la table n'existe pas encore (code 42P01 = relation does not exist)
			if (error.code === '42P01' || error.message?.includes('does not exist')) {
				logger.debug(
					"[tokenRevokeStore] Table revoked_tokens n'existe pas encore. La révocation sera ignorée jusqu'à création de la table."
				);
				return;
			}
			logger.warn('[tokenRevokeStore] Erreur lors de la révocation:', error);
		}
	} catch (e) {
		// Ignorer les erreurs de connexion réseau silencieusement
		if (e.message?.includes('fetch failed') || e.message?.includes('ECONNREFUSED')) {
			logger.debug(
				'[tokenRevokeStore] Impossible de se connecter à Supabase pour révoquer le token'
			);
			return;
		}
		logger.warn('[tokenRevokeStore] Erreur lors de la révocation:', e);
	}
}

/**
 * Vérifie si un token a été révoqué
 * Nettoie les tokens expirés avant de vérifier
 * @param {string} token - Token JWT à vérifier
 * @returns {Promise<boolean>} - true si le token est révoqué, false sinon
 */
export async function isRevoked(token) {
	try {
		// Nettoyer les tokens expirés avant de vérifier (silencieusement)
		cleanupExpiredTokens().catch(() => {}); // Ne pas bloquer si le nettoyage échoue

		const tokenHash = hashToken(token);

		const { data, error } = await supabase
			.from('revoked_tokens')
			.select('token_hash')
			.eq('token_hash', tokenHash)
			.single();

		if (error) {
			// PGRST116 = no rows returned (token non révoqué, c'est normal)
			if (error.code === 'PGRST116') {
				return false;
			}
			// Si la table n'existe pas encore, considérer comme non révoqué
			if (error.code === '42P01' || error.message?.includes('does not exist')) {
				logger.debug("[tokenRevokeStore] Table revoked_tokens n'existe pas encore");
				return false;
			}
			// Pour les autres erreurs, logger en debug seulement
			logger.debug('[tokenRevokeStore] Erreur lors de la vérification:', error.message);
			return false; // En cas d'erreur, considérer comme non révoqué pour ne pas bloquer
		}

		return !!data; // true si le token est trouvé (révoqué), false sinon
	} catch (e) {
		// Ignorer les erreurs de connexion réseau
		if (e.message?.includes('fetch failed') || e.message?.includes('ECONNREFUSED')) {
			logger.debug('[tokenRevokeStore] Impossible de vérifier la révocation (connexion échouée)');
			return false;
		}
		logger.debug('[tokenRevokeStore] Erreur lors de la vérification:', e.message);
		return false; // En cas d'erreur, considérer comme non révoqué
	}
}

export default { revokeToken, isRevoked };
