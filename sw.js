// =================================================================================
// Service Worker (sw.js) - ULTIMATE & PRODUCTION-READY VERSION
// =================================================================================

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox v7.1.0 loaded successfully!`);

  // -------------------------------------------------------------------
  // Step 1: Activate immediately and take control of pages
  // -------------------------------------------------------------------
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // -------------------------------------------------------------------
  // Step 2: Precache App Shell (HTML, Offline Page, Manifest, Logos, Favicon)
  // -------------------------------------------------------------------
  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: 'v3' },
    { url: '/manifest.webmanifest', revision: 'v3' },
    // Logo
    { url: '/images/logo-sidelinechiangmai.webp', revision: 'v3' },
    { url: '/images/logo-sidelinechiangmai@2x.webp', revision: 'v3' },
    // Placeholder / Favicon / Icons
    { url: '/images/placeholder-profile.webp', revision: 'v3' },
    { url: '/images/favicon.svg', revision: 'v3' },
    { url: '/icons/icon-192x192.png', revision: 'v3' },
    { url: '/icons/icon-512x512.png', revision: 'v3' },
    // Hero images (responsive)
    { url: '/images/hero-sidelinechiangmai-600.webp', revision: 'v3' },
    { url: '/images/hero-sidelinechiangmai-800.webp', revision: 'v3' },
    { url: '/images/hero-sidelinechiangmai-1200.webp', revision: 'v3' },
  ]);

  // -------------------------------------------------------------------
  // Step 3: Caching Strategies
  // -------------------------------------------------------------------

  // --- HTML pages: NetworkFirst with fallback ---
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'sideline-pages',
      networkTimeoutSeconds: 4,
      plugins: [
        new workbox.recipes.offlineFallback({
          pageFallback: '/offline.html',
        }),
      ],
    })
  );

  // --- Supabase Profile Images: CacheFirst 30 days ---
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'hgzbgpbmymoiwjpaypvl.supabase.co',
    new workbox.strategies.CacheFirst({
      cacheName: 'sideline-profile-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 วัน
          purgeOnQuotaError: true,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // --- JS / CSS: Stale-While-Revalidate, TTL 1 ปี ---
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'sideline-static-assets',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ปี
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // --- Fonts: CacheFirst 1 ปี ---
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: 'sideline-fonts',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ปี
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // --- Images (Hero, Logo, Other): CacheFirst 30 วัน ---
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'sideline-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          purgeOnQuotaError: true,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

} else {
  console.log(`[SW] Workbox failed to load.`);
}
