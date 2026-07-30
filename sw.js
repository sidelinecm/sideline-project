importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  // -----------------------------------------------------------
  // 1. CONFIGURATION
  // 🟢 อัปเกรดเลขเวอร์ชันแคชใหม่เพื่อบังคับให้เครื่องลูกค้าล้างไฟล์จำเก่าทิ้ง
  // -----------------------------------------------------------
  const CACHE_VERSION = 'v-2026-07-30-v5'; 
  const OFFLINE_PAGE = '/offline.html';

  workbox.core.setCacheNameDetails({
    prefix: 'first-model-hub',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime'
  });

  // ปิดการแจ้งเตือน log ส่วนเกินใน Production เพื่อความสะอาดของ Console
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // -----------------------------------------------------------
  // 2. INSTALLATION & ACTIVATION
  // -----------------------------------------------------------
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(`first-model-hub-precache-${CACHE_VERSION}`).then((cache) => {
        return cache.add(OFFLINE_PAGE).catch(() => console.log('[SW] Offline page not found, skipping precache.'));
      })
    );
  });

  self.addEventListener('activate', (event) => {
    // ล้าง Cache เก่าทิ้งทั้งหมดเมื่อมีการเปลี่ยนเวอร์ชันป้องกันข้อมูลตีกัน
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
  });

  // -----------------------------------------------------------
  // 3. CACHING STRATEGIES
  // -----------------------------------------------------------

  // ✅ A.1 HTML Pages (หน้าเว็บ SSR และหน้า Static) - ใช้ NetworkFirst 
  // ตั้ง timeout 3 วินาที ถ้าเน็ตช้าหรือออฟไลน์จะดึงจาก Cache ทันที
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-cache-${CACHE_VERSION}`,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100, // ขยายให้รองรับหน้าจังหวัดต่างๆ ได้มากขึ้น
          maxAgeSeconds: 24 * 60 * 60, // เก็บไว้สูงสุด 24 ชั่วโมง
        }),
      ],
    })
  );

  // 🟢 A.2 ไฟล์ Static (CSS, JS, Worker) - NetworkFirst
  // การันตีว่าผู้ใช้งานจะได้ดีไซน์และโค้ดอัปเดตล่าสุดเสมอ
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'worker',
    new workbox.strategies.NetworkFirst({
      cacheName: `static-resources-${CACHE_VERSION}`,
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 7 * 24 * 60 * 60, // เก็บไว้ 7 วัน
        }),
      ],
    })
  );

  // B. รูปภาพภายในเว็บและไอคอนทั่วไป (CacheFirst)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image' && !request.url.includes('supabase.co') && !request.url.includes('cloudinary.com'),
    new workbox.strategies.CacheFirst({
      cacheName: `web-assets-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ 
          maxEntries: 80, 
          maxAgeSeconds: 30 * 24 * 60 * 60 
        })
      ]
    })
  );

  // C. รูปภาพโปรไฟล์น้องๆ จาก Cloudinary และ Supabase (CacheFirst)
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('supabase.co/storage/v1/') || url.href.includes('res.cloudinary.com'),
    new workbox.strategies.CacheFirst({
      cacheName: `profile-images-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 250,
          maxAgeSeconds: 30 * 24 * 60 * 60,
          purgeOnQuotaError: true
        })
      ]
    })
  );

  // D. ข้อมูล Real-time หรือ API (Supabase REST) - NetworkOnly (ห้ามแคชเด็ดขาด)
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('rest/v1'),
    new workbox.strategies.NetworkOnly()
  );

  // -----------------------------------------------------------
  // 4. OFFLINE FALLBACK
  // -----------------------------------------------------------
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      const cache = await caches.open(`first-model-hub-precache-${CACHE_VERSION}`);
      const cachedOffline = await cache.match(OFFLINE_PAGE);
      if (cachedOffline) return cachedOffline;
    }
    return Response.error();
  });

  console.log(`[SW] First Model Hub Service Worker ${CACHE_VERSION} is active and optimized!`);
}