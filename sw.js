importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  // -----------------------------------------------------------
  // 1. CONFIGURATION
  // ⚠️ เปลี่ยนเลขเวอร์ชันทุกครั้งที่มีการอัปเดตไฟล์ เพื่อให้เครื่องลูกค้าโหลดใหม่
  // -----------------------------------------------------------
  const CACHE_VERSION = 'v-2026-02-02-304'; 
  const OFFLINE_PAGE = '/offline.html';

  workbox.core.setCacheNameDetails({
    prefix: 'first-model-hub',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime'
  });

  // -----------------------------------------------------------
  // 2. INSTALLATION (บันทึกหน้า Offline)
  // -----------------------------------------------------------
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(`first-model-hub-precache-${CACHE_VERSION}`).then((cache) => {
        // พยายาม Cache หน้า Offline ถ้ามี ถ้าไม่มีให้ข้ามไป
        return cache.add(OFFLINE_PAGE).catch(err => console.log('Offline page not found, skipping.'));
      })
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    // ล้าง Cache เก่าทิ้งเมื่อมีการเปลี่ยนเวอร์ชัน
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!key.includes(CACHE_VERSION)) {
              return caches.delete(key);
            }
          })
        )
      )
    );
    self.clients.claim();
  });

  // -----------------------------------------------------------
  // 3. CACHING STRATEGIES
  // -----------------------------------------------------------

  // ✅ A.1 HTML Pages (หน้าเว็บ) - ใช้ NetworkFirst 
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-cache-${CACHE_VERSION}`,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
        }),
      ],
    })
  );

  // ✅ A.2 ไฟล์ Static (CSS, JS, Worker) - ใช้ StaleWhileRevalidate
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `static-resources-${CACHE_VERSION}`
    })
  );

  // B. รูปภาพภายในเว็บและไอคอน (CacheFirst)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image' && !request.url.includes('supabase.co'),
    new workbox.strategies.CacheFirst({
      cacheName: `web-assets-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 })
      ]
    })
  );

  // C. รูปภาพโปรไฟล์น้องๆ จาก Supabase (CacheFirst)
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('supabase.co/storage/v1/object/public/'),
    new workbox.strategies.CacheFirst({
      cacheName: `profile-images-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          purgeOnQuotaError: true
        })
      ]
    })
  );

  // D. ข้อมูล Real-time (API) - ห้าม Cache เด็ดขาด
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('rest/v1'),
    new workbox.strategies.NetworkOnly()
  );

  // -----------------------------------------------------------
  // 4. OFFLINE FALLBACK
  // -----------------------------------------------------------
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    return Response.error();
  });

  console.log(`[SW] First Model Hub Service Worker ${CACHE_VERSION} is active!`);
}