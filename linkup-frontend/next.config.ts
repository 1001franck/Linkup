import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Production optimizations
  productionBrowserSourceMaps: false, // Désactiver les source maps en production pour la sécurité
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },
  
  // Compresser les réponses
  compress: true,
  
  // Optimisations
  poweredByHeader: false, // Supprimer le header X-Powered-By
};

export default nextConfig;
