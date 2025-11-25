/**
 * Middleware de monitoring des performances
 * Mesure le temps de réponse des requêtes et log les métriques
 */

import logger from "../utils/logger.js";

const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Intercepter la fin de la réponse
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log des métriques de performance
    logger.debug(`[PERFORMANCE] ${req.method} ${req.path} - ${duration}ms - Status: ${res.statusCode}`);
    
    // Log des requêtes lentes (> 1 seconde)
    if (duration > 1000) {
      logger.warn(`[SLOW REQUEST] ${req.method} ${req.path} took ${duration}ms`);
    }
    
    // Appeler la méthode send originale
    originalSend.call(this, data);
  };
  
  next();
};

export default performanceMiddleware;
