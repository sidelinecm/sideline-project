importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox loaded v7.1.0 - Ready to serve!`);

  // -----------------------------------------------------------
  // 1. CONFIGURATION (ตั้งค่าเวอร์ชัน)
  // ⚠️ สำคัญ: เปลี่ยนเลขเวอร์ชันทุกครั้งที่มีการแก้โค้ดเว็บ เพื่อให้ลูกค้าได้ไฟล์ใหม่ทันที
  // -----------------------------------------------------------
  const CACHE_VERSION = 'v-2026-01-02-05'; 
  const OFFLINE_PAGE = '/offline.html'; // ต้องสร้างไฟล์นี้ไว้ในโปรเจกต์ด้วย

  // ตั้งค่า Config พื้นฐาน
  workbox.core.setCacheNameDetails({
    prefix: 'sideline-cm',
    suffix: CACHE_VERSION,
    precache: 'precache',
    runtime: 'runtime',
  });

  // -----------------------------------------------------------
  // 2. LIFECYCLE (การติดตั้งและเปิดใช้งาน)
  // -----------------------------------------------------------
  self.addEventListener('install', (event) => {
    // บังคับให้ SW ตัวใหม่ทำงานทันที ไม่ต้องรอปิดแท็บ
    self.skipWaiting();
  });

  self.addEventListener('activate', (event) => {
    // ล้าง Cache เก่าทิ้งทันทีที่เปลี่ยนเวอร์ชัน
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (!key.includes(CACHE_VERSION)) {
              console.log(`[SW] Cleaning old cache: ${key}`);
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
    { url: '/styles.css', revision: CACHE_VERSION }, // ตรวจสอบชื่อไฟล์ css ของคุณให้ตรง
    { url: OFFLINE_PAGE, revision: CACHE_VERSION },
    { url: '/manifest.webmanifest', revision: CACHE_VERSION },
    { url: '/images/logo-sidelinechiangmai.webp', revision: CACHE_VERSION },
    { url: '/images/og-default.webp', revision: CACHE_VERSION },
  ]);

  // -----------------------------------------------------------
  // 4. ROUTING STRATEGIES (สูตรการโหลดไฟล์แต่ละแบบ)
  // -----------------------------------------------------------

  // A. หน้าเว็บ HTML (NetworkFirst)
  // พยายามโหลดหน้าล่าสุดจากเน็ตก่อน ถ้าไม่มีเน็ตค่อยเอาจาก Cache
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
      ],
    })
  );

  // B. ไฟล์ Static JS/CSS/Fonts (StaleWhileRevalidate)
  // โหลดจาก Cache มาโชว์ก่อนเลย (เร็วมาก) แล้วแอบโหลดตัวใหม่มาเก็บไว้รอบหน้า
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
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

  // C. รูปภาพจาก Supabase Storage และในเว็บ (CacheFirst)
  // เก็บรูปไว้ยาวๆ เพราะรูปน้องๆ ไม่ค่อยเปลี่ยน (ประหยัดเน็ตลูกค้า)
  workbox.routing.registerRoute(
    ({ request, url }) => 
      request.destination === 'image' ||
      url.href.includes('/storage/v1/object/public/'), // Supabase Storage
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200], // รองรับ CORS (0) และ OK (200)
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200, // เก็บรูปสูงสุด 200 รูป
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 วัน
          purgeOnQuotaError: true, // ถ้าเมมเต็มให้ลบรูปทิ้งก่อน
        }),
      ],
    })
  );

  // D. Supabase API & ข้อมูล Real-time (NetworkOnly)
  // ⚠️ ห้าม Cache ข้อมูล JSON เด็ดขาด สถานะต้องล่าสุดเสมอ
  workbox.routing.registerRoute(
    ({ url }) => 
      url.href.includes('rest/v1') || // Supabase DB endpoint
      url.href.includes('google-analytics'), 
    new workbox.strategies.NetworkOnly()
  );

  // -----------------------------------------------------------
  // 5. OFFLINE FALLBACK (กันเหนียว)
  // -----------------------------------------------------------
  workbox.routing.setCatchHandler(async ({ event }) => {
    // ถ้าเป็นหน้าเว็บ (HTML) แล้วโหลดไม่ได้ ให้ส่งหน้า Offline ไปแทน
    if (event.request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    // ถ้าเป็นรูป แล้วโหลดไม่ได้ ให้ส่งรูป Placeholder
    if (event.request.destination === 'image') {
      return caches.match('/images/og-default.webp');
    }
    return Response.error();
  });

} else {
  console.error('[SW] Workbox failed to load.');
}