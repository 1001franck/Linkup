const cache = new Map();

function get(key) {
    return cache.get(key)?.value;
}

function set(key, value, ttlSeconds) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    cache.set(key, { value, expiresAt });
    // Nettoyer les entrées expirées de temps en temps
    setTimeout(() => cleanExpired(), ttlSeconds * 1000);
}

function del(key) {
    cache.delete(key);
}

function clear() {
    cache.clear();
}

function cleanExpired() {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
        if (entry.expiresAt < now) {
            cache.delete(key);
        }
    }
}

function generateKey(prefix, params) {
    return `${prefix}:${JSON.stringify(params)}`;
}

export default { get, set, del, clear, generateKey };
