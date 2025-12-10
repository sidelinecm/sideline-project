importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox loaded v7.1.0`);

  const CACHE_VERSION = 'v20251112_FIXED';
  const OFFLINE_PAGE = '/offline.html';
  const API_BLACKLIST = ['supabase.co', 'google.com'];

  // Force activation
  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => 
            !key.includes(CACHE_VERSION) ? caches.delete(key) : null
          )
        )
      ).then(() => self.clients.claim())
    );
  });

  // Precache essentials - FIXED revision
  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: OFFLINE_PAGE, revision: '1' },
    { url: '/manifest.webmanifest', revision: '1' },
    { url: '/images/og-default.webp', revision: '1' },
    { url: '/icons/icon-192x192.png', revision: '1' },
    { url: '/icons/icon-512x512.png', revision: '1' },
    { url: '/main.js', revision: '1' },
    { url: '/css/main.css', revision: '1' },
  ]);

  // HTML - NetworkFirst with aggressive timeout
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-${CACHE_VERSION}`,
      networkTimeoutSeconds: 3, // ⏰ เพิ่ม timeout
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
        new workbox.expiration.ExpirationPlugin({ 
          maxEntries: 10, // ลดลงเพื่อ performance
          maxAgeSeconds: 3600 // 1 ชม.
        })
      ]
    })
  );

  // Static Assets - CacheFirst with longer cache
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: `static-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ 
          maxEntries: 100, 
          maxAgeSeconds: 31536000 // 1 ปี
        })
      ]
    })
  );

  // Images - Optimized CacheFirst
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ 
          maxEntries: 60, // ลดจาก 200 เพื่อ memory
          maxAgeSeconds: 604800 // 7 วัน
        })
      ]
    })
  );

  // API Routes - StaleWhileRevalidate สำหรับข้อมูลที่เปลี่ยนบ่อย
  workbox.routing.registerRoute(
    ({ url }) => 
      url.pathname.includes('/api/') && 
      !API_BLACKLIST.some(domain => url.href.includes(domain)),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `api-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
        new workbox.expiration.ExpirationPlugin({ 
          maxEntries: 20, 
          maxAgeSeconds: 300 // 5 นาที สำหรับข้อมูล real-time
        })
      ]
    })
  );

  // Blacklist APIs - NetworkOnly (NO CACHE)
  workbox.routing.registerRoute(
    ({ url }) => API_BLACKLIST.some(domain => url.href.includes(domain)),
    new workbox.strategies.NetworkOnly()
  );

  // Offline fallback - IMPROVED
  workbox.routing.setCatchHandler(async ({ event }) => {
    switch (event.request.destination) {
      case 'document':
        return caches.match(OFFLINE_PAGE);
      case 'image':
        return caches.match('/images/og-default.webp');
      case 'style':
      case 'script':
        return Response.error();
      default:
        return Response.error();
    }
  });

  // 🔥 CRITICAL FIX: Force refresh cache สำหรับ critical files
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });

} else {
  console.error('[SW] Workbox failed to load.');
}
