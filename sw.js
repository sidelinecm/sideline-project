// =================================================================================
// Service Worker (sw.js) - ULTIMATE & STABLE PRODUCTION VERSION (NO CACHE DATA)
// =================================================================================

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox v7.1.0 loaded successfully!`);

  // -------------------------------------------------------------------
  // STEP 1: Activate immediately + Clear old cache
  // -------------------------------------------------------------------
  const CACHE_VERSION = 'v20251010'; // เปลี่ยนเลขเวอร์ชันเมื่ออัปเดตเว็บ

  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(
        keys.map(k => caches.delete(k))
      ))
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    );
    self.clients.claim();
  });

  // -------------------------------------------------------------------
  // STEP 2: Precache (Offline Essentials)
  // -------------------------------------------------------------------
  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: CACHE_VERSION },
    { url: '/manifest.webmanifest', revision: CACHE_VERSION },
    { url: '/images/logo-sidelinechiangmai.webp', revision: CACHE_VERSION },
    { url: '/images/logo-sidelinechiangmai@2x.webp', revision: CACHE_VERSION },
    { url: '/images/placeholder-profile.webp', revision: CACHE_VERSION },
    { url: '/images/favicon.svg', revision: CACHE_VERSION },
    { url: '/icons/icon-192x192.png', revision: CACHE_VERSION },
    { url: '/icons/icon-512x512.png', revision: CACHE_VERSION },
    { url: '/images/hero-sidelinechiangmai-600.webp', revision: CACHE_VERSION },
    { url: '/images/hero-sidelinechiangmai-800.webp', revision: CACHE_VERSION },
    { url: '/images/hero-sidelinechiangmai-1200.webp', revision: CACHE_VERSION },
  ]);

  // -------------------------------------------------------------------
  // STEP 3: Caching Strategies
  // -------------------------------------------------------------------

  // --- HTML pages ---
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-${CACHE_VERSION}`,
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60, // 1 วัน
        }),
      ],
    })
  );

 // ✅ ป้องกัน Browser cache response ของ Supabase ซ้ำ
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    );
  }
});

  // --- JS / CSS ---
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `static-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // --- Fonts ---
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: `fonts-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        }),
      ],
    })
  );

  // --- Images (ทั่วไป) ---
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          purgeOnQuotaError: true,
        }),
      ],
    })
  );

  // --- Default handler ---
  workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkFirst()
  );

} else {
  console.log(`[SW] Workbox failed to load.`);
}

