# ⚙️ **NEXT.CONFIG.TS - Configuration Next.js**

## 🎯 **Rôle du fichier**
Le fichier `next.config.ts` configure le **comportement de Next.js** pour le projet LinkUp. Il définit les optimisations, les redirections, les variables d'environnement, et les plugins.

## 📋 **Structure du fichier**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration Next.js
};

export default nextConfig;
```

## 🔍 **Analyse Détaillée des Options**

### **1. Configuration de Base**

#### **App Router et Server Components**
```typescript
const nextConfig: NextConfig = {
  experimental: {
    appDir: true,                    // Active l'App Router
    serverComponents: true,          // Active les Server Components
    serverActions: true,             // Active les Server Actions
    typedRoutes: true,               // Routes typées
  },
};
```

**Explication :**
- **appDir: true** : Utilise le nouveau App Router (Next.js 13+)
- **serverComponents: true** : Composants rendus côté serveur
- **serverActions: true** : Actions serveur pour les formulaires
- **typedRoutes: true** : Routes TypeScript typées

#### **Optimisations de Performance**
```typescript
const nextConfig: NextConfig = {
  // Optimisations
  swcMinify: true,                   // Minification SWC (plus rapide)
  compress: true,                     // Compression gzip
  poweredByHeader: false,             // Cache le header X-Powered-By
  
  // Compilation
  typescript: {
    ignoreBuildErrors: false,         // Erreurs TypeScript bloquantes
  },
  eslint: {
    ignoreDuringBuilds: false,       // Erreurs ESLint bloquantes
  },
};
```

**Explication :**
- **swcMinify** : Utilise SWC pour la minification (plus rapide que Terser)
- **compress** : Active la compression gzip
- **poweredByHeader: false** : Cache l'information Next.js
- **typescript/eslint** : Configuration des vérifications

### **2. Configuration des Images**

```typescript
const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',                    // Domaine local
      'images.unsplash.com',          // Images Unsplash
      'via.placeholder.com',          // Placeholder images
    ],
    formats: ['image/webp', 'image/avif'], // Formats optimisés
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,              // Cache minimum 60 secondes
    dangerouslyAllowSVG: true,       // Autorise les SVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};
```

**Explication :**
- **domains** : Domaines autorisés pour les images externes
- **formats** : Formats d'image optimisés (WebP, AVIF)
- **deviceSizes** : Tailles d'écran pour le responsive
- **imageSizes** : Tailles d'images prédéfinies
- **minimumCacheTTL** : Durée de cache des images
- **dangerouslyAllowSVG** : Autorise les SVG (avec CSP)

### **3. Variables d'Environnement**

```typescript
const nextConfig: NextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  publicRuntimeConfig: {
    // Configuration accessible côté client
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    appName: process.env.NEXT_PUBLIC_APP_NAME,
  },
  
  serverRuntimeConfig: {
    // Configuration serveur uniquement
    secretKey: process.env.SECRET_KEY,
    databaseUrl: process.env.DATABASE_URL,
  },
};
```

**Explication :**
- **env** : Variables d'environnement exposées
- **publicRuntimeConfig** : Configuration accessible côté client
- **serverRuntimeConfig** : Configuration serveur uniquement

### **4. Redirections et Rewrites**

```typescript
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,              // Redirection 301
      },
      {
        source: '/legacy/:path*',
        destination: '/modern/:path*',
        permanent: false,             // Redirection 302
      },
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};
```

**Explication :**
- **redirects** : Redirections HTTP (301/302)
- **rewrites** : Réécriture d'URLs (proxy, masquage)
- **permanent** : Redirection permanente (301) ou temporaire (302)

### **5. Headers de Sécurité**

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};
```

**Explication :**
- **X-Frame-Options** : Empêche le clickjacking
- **X-Content-Type-Options** : Empêche le MIME sniffing
- **Referrer-Policy** : Contrôle les référents
- **Content-Security-Policy** : Politique de sécurité du contenu

## 🚀 **Fonctionnalités Avancées**

### **1. Configuration Webpack**

```typescript
const nextConfig: NextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Configuration webpack personnalisée
    
    // Alias pour les imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };
    
    // Plugins webpack
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CUSTOM_KEY': JSON.stringify(process.env.CUSTOM_KEY),
      })
    );
    
    return config;
  },
};
```

**Explication :**
- **webpack** : Configuration webpack personnalisée
- **alias** : Alias pour les imports
- **plugins** : Plugins webpack personnalisés

### **2. Configuration des Builds**

```typescript
const nextConfig: NextConfig = {
  // Configuration de build
  output: 'standalone',              // Build standalone
  trailingSlash: false,              // Pas de slash final
  generateBuildId: async () => {
    return 'build-' + Date.now();    // ID de build personnalisé
  },
  
  // Configuration de production
  productionBrowserSourceMaps: false, // Pas de source maps en production
  generateEtags: true,               // Génération des ETags
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,       // Cache des pages
    pagesBufferLength: 2,            // Buffer des pages
  },
};
```

**Explication :**
- **output: 'standalone'** : Build optimisé pour Docker
- **trailingSlash** : Gestion des slashes dans les URLs
- **generateBuildId** : ID de build personnalisé
- **productionBrowserSourceMaps** : Source maps en production

### **3. Configuration des Routes**

```typescript
const nextConfig: NextConfig = {
  // Configuration des routes
  basePath: '',                      // Chemin de base
  assetPrefix: '',                  // Préfixe des assets
  
  // Configuration des pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'], // Extensions de pages
  distDir: '.next',                 // Dossier de build
  
  // Configuration des API
  api: {
    bodyParser: {
      sizeLimit: '1mb',             // Taille limite des requêtes
    },
    responseLimit: '8mb',           // Taille limite des réponses
  },
};
```

**Explication :**
- **basePath** : Chemin de base pour l'application
- **assetPrefix** : Préfixe pour les assets statiques
- **pageExtensions** : Extensions de fichiers pour les pages
- **distDir** : Dossier de build personnalisé

## 🔧 **Optimisations Spécifiques LinkUp**

### **1. Configuration API**

```typescript
const nextConfig: NextConfig = {
  // Configuration pour l'API LinkUp
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*', // Proxy vers le backend
      },
    ];
  },
  
  // Configuration des images
  images: {
    domains: [
      'localhost',
      'linkup.com',
      'cdn.linkup.com',
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};
```

### **2. Configuration de Développement**

```typescript
const nextConfig: NextConfig = {
  // Configuration de développement
  devIndicators: {
    buildActivity: true,             // Indicateur de build
    buildActivityPosition: 'bottom-right', // Position de l'indicateur
  },
  
  // Configuration du serveur de développement
  devServer: {
    port: 3001,                      // Port de développement
    hostname: 'localhost',           // Hostname
  },
  
  // Configuration des hot reloads
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,      // Cache des pages
    pagesBufferLength: 2,            // Buffer des pages
  },
};
```

### **3. Configuration de Production**

```typescript
const nextConfig: NextConfig = {
  // Configuration de production
  output: 'standalone',              // Build standalone pour Docker
  compress: true,                     // Compression gzip
  poweredByHeader: false,            // Cache le header X-Powered-By
  
  // Configuration des assets
  assetPrefix: process.env.NODE_ENV === 'production' ? '/assets' : '',
  
  // Configuration des builds
  generateBuildId: async () => {
    return 'linkup-' + Date.now();
  },
};
```

## 🔍 **Dépannage Courant**

### **1. Erreurs de Build**

```typescript
// Erreur : TypeScript strict
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,        // ❌ Erreurs bloquantes
  },
};

// Solution : Vérifier les types
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,        // ✅ Vérifier les types
  },
};
```

### **2. Erreurs d'Images**

```typescript
// Erreur : Domaine non autorisé
const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],          // ❌ Domaine manquant
  },
};

// Solution : Ajouter le domaine
const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'example.com'], // ✅ Domaine ajouté
  },
};
```

### **3. Erreurs de Redirection**

```typescript
// Erreur : Redirection infinie
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/page',
        destination: '/page',        // ❌ Redirection infinie
        permanent: true,
      },
    ];
  },
};

// Solution : Destination différente
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',    // ✅ Destination différente
        permanent: true,
      },
    ];
  },
};
```

## 📊 **Métriques et Performance**

### **Temps de Build**
- **Développement** : ~5-10 secondes
- **Production** : ~30-60 secondes
- **Hot reload** : ~500ms-2 secondes

### **Optimisations**
- **swcMinify** : -30% du temps de build
- **compress** : -50% de la taille des assets
- **standalone** : -80% de la taille du build

## 🎯 **Résumé**

La configuration Next.js de LinkUp est **optimisée** pour :

1. **Performance** : SWC, compression, optimisations
2. **Sécurité** : Headers de sécurité, CSP
3. **Développement** : Hot reload, source maps
4. **Production** : Build standalone, optimisations
5. **Intégration** : API proxy, images optimisées

Cette configuration permet un **développement efficace** et un **déploiement optimisé** de l'application LinkUp.
