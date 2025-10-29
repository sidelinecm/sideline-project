importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox loaded v7.1.0`);

  const CACHE_VERSION = 'v20251026';

  // -----------------------------------
  // STEP 1: Install & Activate
  // ลบ cache เก่าเฉพาะในกรณีที่จำเป็น
  self.addEventListener('install', event => {
    // อาจไม่จำเป็นต้องลบ cache ทุกอัน
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    // ลบ cache เก่าเฉพาะที่ไม่ใช่ version ปัจจุบัน
    event.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (!key.includes(CACHE_VERSION)) {
              return caches.delete(key);
            }
          })
        );
      }).then(() => self.clients.claim())
    );
  });

  // -----------------------------------
  // STEP 2: Precache Offline Essentials
  // ควรมีไฟล์ offline.html เพื่อรองรับ offline
  workbox.precaching.precacheAndRoute([
    { url: '/offline.html', revision: CACHE_VERSION },
    { url: '/manifest.webmanifest', revision: CACHE_VERSION },
    { url: '/images/logo.webp', revision: CACHE_VERSION },
    { url: '/icons/icon-192x192.png', revision: CACHE_VERSION },
    { url: '/icons/icon-512x512.png', revision: CACHE_VERSION },
  ]);

  // -----------------------------------
  // STEP 3: Caching Strategies
  // HTML pages
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-${CACHE_VERSION}`,
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 86400 })
      ],
    })
  );

  // JS / CSS
  workbox.routing.registerRoute(
    ({ request }) => ['script', 'style'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `static-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 31536000 })
      ],
    })
  );

  // Fonts
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: `fonts-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 31536000 }),
      ],
    })
  );

  // Images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 2592000 }),
      ],
    })
  );

  // ไม่ cache request ไปยัง supabase.co
  self.addEventListener('fetch', event => {
    if (event.request.url.includes('supabase.co')) {
      event.respondWith(
        fetch(event.request, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      );
    }
  });

  // Default handler
  workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst());

} else {
  console.log(`[SW] Workbox failed to load.`);
}



