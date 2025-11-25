/**
 * Configuration de l'application LinkUp
 * Variables d'environnement et constantes
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 10000,
    retryAttempts: 3,
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'LinkUp',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    description: 'Plateforme de recrutement et réseau professionnel',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png').split(','),
    maxFiles: 5,
  },

  // Notifications Configuration
  notifications: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
    pushEnabled: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  },

  // Pagination Configuration
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // Cache Configuration
  cache: {
    userData: 5 * 60 * 1000, // 5 minutes
    jobs: 2 * 60 * 1000, // 2 minutes
    companies: 10 * 60 * 1000, // 10 minutes
  },

  // UI Configuration
  ui: {
    animationDuration: 300,
    toastDuration: 5000,
    debounceDelay: 500,
  },

  // Security Configuration
  security: {
    tokenKey: 'linkup_token',
    refreshTokenKey: 'linkup_refresh_token',
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
} as const;

// Types pour la configuration
export type Config = typeof config;
export type ApiConfig = typeof config.api;
export type AppConfig = typeof config.app;
export type UploadConfig = typeof config.upload;
export type NotificationConfig = typeof config.notifications;
export type PaginationConfig = typeof config.pagination;
export type CacheConfig = typeof config.cache;
export type UIConfig = typeof config.ui;
export type SecurityConfig = typeof config.security;
