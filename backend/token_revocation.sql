-- Table pour stocker les tokens JWT révoqués
-- Permet de gérer la révocation de tokens de manière persistante et distribuée

CREATE TABLE IF NOT EXISTS revoked_tokens (
    token_hash VARCHAR(255) PRIMARY KEY, -- Hash du token (pour sécurité et performance)
    expires_at TIMESTAMP NOT NULL,        -- Date d'expiration du token
    revoked_at TIMESTAMP NOT NULL DEFAULT NOW(), -- Date de révocation
    user_id INTEGER,                       -- ID de l'utilisateur (optionnel, pour statistiques)
    user_role VARCHAR(50)                 -- Rôle de l'utilisateur (optionnel)
);

-- Index pour optimiser les recherches et le nettoyage
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires_at ON revoked_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_user_id ON revoked_tokens(user_id);

-- Fonction pour nettoyer automatiquement les tokens expirés (optionnel)
-- Cette fonction peut être appelée périodiquement par un cron job
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM revoked_tokens WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

