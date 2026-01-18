importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  // -----------------------------------------------------------
  // 1. CONFIGURATION
  // ⚠️ เปลี่ยนเลขเวอร์ชันทุกครั้งที่มีการอัปเดตไฟล์ CSS/JS หลัก
  // -----------------------------------------------------------
  const CACHE_VERSION = 'v-2026-01-18-02'; 
  const OFFLINE_PAGE = '/offline.html';

  workbox.core.setCacheNameDetails({
    prefix: 'sideline-cm',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime'
  });

  // -----------------------------------------------------------
  // 2. INSTALLATION (สำคัญ: บันทึกหน้า Offline ลงเครื่องทันที)
  // -----------------------------------------------------------
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(`sideline-cm-precache-${CACHE_VERSION}`).then((cache) => {
        return cache.add(OFFLINE_PAGE);
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

  // A. ไฟล์หลัก (HTML, CSS, JS) - เน้นความเร็วแต่ต้องอัปเดต (StaleWhileRevalidate)
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'document' || 
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

  // D. ข้อมูล Real-time (API) - ห้าม Cache เพื่อให้สถานะ "ว่าง/ไม่ว่าง" เป็นปัจจุบันเสมอ
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

  console.log(`[SW] Sideline Chiangmai Service Worker ${CACHE_VERSION} is active!`);
}