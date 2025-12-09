// --- START OF FILE sw.js ---

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox loaded v7.1.0 - Ready to serve!`);

  // -----------------------------------------------------------
  // 1. CONFIGURATION
  // -----------------------------------------------------------
  const CACHE_VERSION = 'v-2025-12-09-03'; // 🔄 อัปเดตเลขเวอร์ชันทุกครั้งที่แก้โค้ด
  const OFFLINE_PAGE = '/offline.html'; // ⚠️ ต้องมีไฟล์นี้อยู่จริง ห้ามลืมสร้าง!

  workbox.core.setCacheNameDetails({
    prefix: 'sideline-cm',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime',
  });

  // -----------------------------------------------------------
  // 2. LIFECYCLE
  // -----------------------------------------------------------
  self.addEventListener('install', (event) => {
    self.skipWaiting();
  });

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
  // 3. PRECACHE
  // -----------------------------------------------------------
  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: CACHE_VERSION },
    { url: '/main.js', revision: CACHE_VERSION },
    { url: '/styles.css', revision: CACHE_VERSION },
    { url: OFFLINE_PAGE, revision: CACHE_VERSION }, // ⚠️ ถ้าหาไฟล์ไม่เจอ SW จะ Error ทันที
    { url: '/manifest.webmanifest', revision: CACHE_VERSION },
    { url: '/images/logo-sidelinechiangmai.webp', revision: CACHE_VERSION },
    { url: '/images/og-default.webp', revision: CACHE_VERSION }, // รูปสำรองเวลารูปหลักโหลดไม่ได้
  ]);

  // -----------------------------------------------------------
  // 4. ROUTING STRATEGIES
  // -----------------------------------------------------------

  // A. หน้าเว็บ HTML (NetworkFirst + Timeout)
  // เพิ่ม networkTimeoutSeconds: 3 คือถ้าเน็ตอืดเกิน 3 วิ ให้เอาของเก่ามาโชว์ก่อนเลย ลูกค้าจะได้ไม่รอนาน
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

  // B. Static Assets (JS/CSS/Fonts)
  workbox.routing.registerRoute(
    ({ request }) => 
      ['style', 'script', 'worker'].includes(request.destination),
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

  // C. Google Fonts (Cache ลึกๆ หน่อย)
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: `google-fonts-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 ปี
        }),
      ],
    })
  );

  // D. รูปภาพน้องๆ (Supabase + Local)
  workbox.routing.registerRoute(
    ({ request, url }) => 
      request.destination === 'image' ||
      url.href.includes('/storage/v1/object/public/'),
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150, // เก็บ 150 รูปพอ กันเครื่องลูกค้าเต็ม
          maxAgeSeconds: 30 * 24 * 60 * 60, 
          purgeOnQuotaError: true,
        }),
      ],
    })
  );

  // E. Supabase API (NetworkOnly) - ห้าม Cache เด็ดขาด
  workbox.routing.registerRoute(
    ({ url }) => 
      url.href.includes('rest/v1') || 
      url.href.includes('google-analytics'), 
    new workbox.strategies.NetworkOnly()
  );

  // -----------------------------------------------------------
  // 5. OFFLINE FALLBACK
  // -----------------------------------------------------------
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    if (event.request.destination === 'image') {
      return caches.match('/images/og-default.webp');
    }
    return Response.error();
  });

} else {
  console.error('[SW] Workbox failed to load.');
}
