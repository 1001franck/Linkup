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
          {
            key: 'Content-Security-Policy',
            value: (() => {
              const isProduction = process.env.NODE_ENV === 'production';
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
              
              // CSP plus stricte en production
              const directives = [
                "default-src 'self'",
                // Next.js nécessite unsafe-inline et unsafe-eval même en production
                // Mais on peut utiliser nonce ou hash en production (à implémenter plus tard)
                isProduction 
                  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live" // Vercel Analytics
                  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline'", // TailwindCSS nécessite unsafe-inline
                "img-src 'self' data: https: blob:", // Autoriser images depuis HTTPS (Unsplash, Clearbit, etc.)
                "font-src 'self' data:",
                `connect-src 'self' ${apiUrl} https://logo.clearbit.com`, // API backend + Clearbit
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
              ];
              
              // Forcer HTTPS uniquement en production
              if (isProduction) {
                directives.push("upgrade-insecure-requests");
              }
              
              return directives.join('; ');
            })()
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
            ].join(', ')
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
