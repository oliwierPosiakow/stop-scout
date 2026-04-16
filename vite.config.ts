import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        // Critical: Navigation fallback for SPA offline support
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/\.well-known\//],
        // Ensure index.html is always cached
        maximumFileSizeToCacheInBytes: 5000000,
        runtimeCaching: [
          // Cache index.html with network first
          {
            urlPattern: /^\/(?:index\.html)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-shell',
              networkTimeoutSeconds: 3,
              expiration: {
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          // Cache ZTM stops list
          {
            urlPattern: /^https:\/\/ckan\.multimediagdansk\.pl\/.*stops\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ztm-stops-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache departures with network first
          {
            urlPattern: /^https:\/\/ckan2\.multimediagdansk\.pl\/departures.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ztm-departures-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxAgeSeconds: 60 * 10, // 10 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },

      manifest: {
        name: 'Stop Scout ZTM Gdańsk',
        short_name: 'StopScout',
        description:
          'Monitorowanie rzeczywistych czasów przyjazdów pojazdów komunikacji miejskiej w Gdańsku.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/?utm_source=pwa',
        scope: '/',
        orientation: 'portrait-primary',
        prefer_related_applications: false,
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});

