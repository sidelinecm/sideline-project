importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox loaded v7.1.0`);

  const CACHE_VERSION = 'v20251112_FINAL';
  const OFFLINE_PAGE = '/offline';
  const API_BLACKLIST = ['supabase.co', 'google.com'];

  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(keys =>
        Promise.all(keys.map(key => !key.includes(CACHE_VERSION) ? caches.delete(key) : null))
      ).then(() => self.clients.claim())
    );
  });

  // Precache essentials
  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: CACHE_VERSION },
    { url: OFFLINE_PAGE, revision: CACHE_VERSION },
    { url: '/manifest.webmanifest', revision: CACHE_VERSION },
    { url: '/images/og-default.webp', revision: CACHE_VERSION },
    { url: '/icons/icon-192x192.png', revision: CACHE_VERSION },
    { url: '/icons/icon-512x512.png', revision: CACHE_VERSION },
    { url: '/main.js', revision: CACHE_VERSION },
    { url: '/css/main.css', revision: CACHE_VERSION },
  ]);

  // HTML - NetworkFirst with offline fallback
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
        new workbox.expiration.ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 86400 })
      ]
    })
  );

  // JS / CSS - StaleWhileRevalidate
  workbox.routing.registerRoute(
    ({ request }) => ['script','style'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `static-${CACHE_VERSION}`,
      plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 31536000 })]
    })
  );

  // Fonts - CacheFirst
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: `fonts-${CACHE_VERSION}`,
      plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 31536000 })]
    })
  );

  // Images - CacheFirst 30 วัน
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [new workbox.expiration.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 2592000 })]
    })
  );

  // API Blacklist - NetworkOnly
  self.addEventListener('fetch', event => {
    if (API_BLACKLIST.some(domain => event.request.url.includes(domain))) {
      event.respondWith(new workbox.strategies.NetworkOnly().handle({ event, request: event.request }));
    }
  });

  // Global fallback for offline
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    return Response.error();
  });

} else {
  console.error('[SW] Workbox failed to load.');
}
