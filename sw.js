importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox loaded v7.1.0 - Ready to serve!`);

  // -----------------------------------------------------------
  // 1. CONFIGURATION
  // -----------------------------------------------------------
  // ⚠️ เปลี่ยนเลขเวอร์ชันทุกครั้งที่มีการแก้โค้ด เพื่อให้ลูกค้าได้ไฟล์ใหม่
  const CACHE_VERSION = 'v-2025-12-09-FINAL-01'; 
  const OFFLINE_PAGE = '/offline.html'; // ⚠️ ต้องมีไฟล์นี้อยู่จริง

  workbox.core.setCacheNameDetails({
    prefix: 'sideline-cm',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime',
  });

  // -----------------------------------------------------------
  // 2. LIFECYCLE
  // -----------------------------------------------------------
  // ติดตั้งและทำงานทันที ไม่ต้องรอปิดแท็บ
  self.addEventListener('install', (event) => self.skipWaiting());

  // ล้าง Cache เก่าทิ้งเมื่อมีการอัปเดตเวอร์ชัน
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!key.includes(CACHE_VERSION)) {
              return caches.delete(key);
            }
          })
        )
      ).then(() => self.clients.claim())
    );
  });

  // -----------------------------------------------------------
  // 3. PRECACHE (โหลดไฟล์สำคัญมารอไว้เลย)
  // -----------------------------------------------------------
  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: CACHE_VERSION },
    { url: '/main.js', revision: CACHE_VERSION },
    { url: '/styles.css', revision: CACHE_VERSION },
    { url: OFFLINE_PAGE, revision: CACHE_VERSION },
    { url: '/manifest.webmanifest', revision: CACHE_VERSION },
    { url: '/images/logo-sidelinechiangmai.webp', revision: CACHE_VERSION },
    { url: '/images/favicon.ico', revision: CACHE_VERSION }
  ]);

  // -----------------------------------------------------------
  // 4. ROUTING STRATEGIES
  // -----------------------------------------------------------

  // A. หน้าเว็บ HTML (NetworkFirst + Timeout)
  // โหลดจากเน็ตก่อน ถ้าช้าเกิน 3 วินาที ให้เอา Cache มาโชว์
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-${CACHE_VERSION}`,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
      ],
    })
  );

  // B. Static Assets (CSS, JS, Fonts) - StaleWhileRevalidate
  // เอาของเก่ามาโชว์ก่อนเลย (เร็วมาก) แล้วแอบโหลดตัวใหม่มาเก็บไว้รอบหน้า
  workbox.routing.registerRoute(
    ({ request }) => 
      ['style', 'script', 'worker', 'font'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `static-assets-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 วัน
        }),
      ],
    })
  );

  // C. รูปภาพ (CacheFirst) - เก็บยาวๆ ประหยัดเน็ต
  workbox.routing.registerRoute(
    ({ request, url }) => 
      request.destination === 'image' ||
      url.href.includes('/storage/v1/object/public/'), // Supabase Storage
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 วัน
          purgeOnQuotaError: true,
        }),
      ],
    })
  );

  // D. Supabase API (NetworkOnly) - ห้าม Cache เด็ดขาด!
  // เพื่อให้ข้อมูลน้องๆ (ว่าง/ไม่ว่าง) เป็นปัจจุบันเสมอ
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('rest/v1'), 
    new workbox.strategies.NetworkOnly()
  );

  // -----------------------------------------------------------
  // 5. OFFLINE FALLBACK
  // -----------------------------------------------------------
  workbox.routing.setCatchHandler(async ({ event }) => {
    // ถ้าเป็นหน้าเว็บแล้วไม่มีเน็ต -> ส่งหน้า offline.html ไปให้
    if (event.request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    return Response.error();
  });

} else {
  console.error('[SW] Workbox failed to load.');
}
