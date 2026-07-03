import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import sentry from '@sentry/astro';
import AstroPWA from '@vite-pwa/astro';

import vercel from '@astrojs/vercel';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const apiKey = env.COTIZAVE_API_KEY;

export default defineConfig({
  integrations: [
    react(),
    sentry({
      dsn: "https://c9cdc427796ce08ddcc2087c7776fbd0@o4501632557555216.ingest.us.sentry.io/4501632694894352",
      project: "javascript-astro",
      org: "gabrielvazquezdev",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallback: '/pwa/radar/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.cotizave\.com\/.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cotizave-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 15 // 15 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Radar',
        short_name: 'Radar BCV',
        description: 'Calculadora de conversiones y tasas BCV / Paralelo',
        theme_color: '#090d16',
        background_color: '#090d16',
        display: 'standalone',
        start_url: '/pwa/radar/',
        scope: '/',
        icons: [
          {
            src: '/radar-icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/radar-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
  ],

  vite: {
    envPrefix: ['VITE_', 'PUBLIC_'],
    plugins: [
      tailwindcss(),
      {
        name: 'api-proxy-dev',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/rates')) {
              try {
                if (!apiKey) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'COTIZAVE_API_KEY is not defined in environment variables' }));
                  return;
                }
                const apiRes = await fetch('https://api.cotizave.com/v1/fx/rates', {
                  headers: {
                    'X-API-Key': apiKey,
                    'Accept': 'application/json'
                  }
                });
                if (!apiRes.ok) {
                  res.statusCode = apiRes.status;
                  res.end(JSON.stringify({ error: `Cotizave API returned status ${apiRes.status}` }));
                  return;
                }
                const data = await apiRes.json();
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(data));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message || 'Server error' }));
              }
              return;
            }
            next();
          });
        }
      }
    ],
    ssr: {
      noExternal: ['react-phone-number-input', 'libphonenumber-js'],
    },
  },

  adapter: vercel(),
});