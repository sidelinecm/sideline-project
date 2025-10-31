importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js');

if (workbox) {
  console.log(`[SW] Workbox loaded v7.1.0 and ready for action!`);

  // 💡 CACHE_VERSION: ควรอัปเดตค่านี้เมื่อมีการเปลี่ยนแปลงไฟล์สำคัญที่ถูก Precache
  // การเปลี่ยน Version จะกระตุ้น Logic ลบ Cache เก่าใน activate event
  const CACHE_VERSION = 'v20251031_FINAL'; 
  const OFFLINE_PAGE = '/offline.html'; // สมมติว่ามีไฟล์นี้สำหรับการ Fallback
  const API_BLACKLIST = ['supabase.co', 'google.com']; // รายชื่อ API ที่ไม่ควร Cache

  // -----------------------------------
  // STEP 1: Install & Activate (Cache Management)
  // -----------------------------------
  
  // ใช้งาน skipWaiting() เพื่อให้ Service Worker ใหม่ทำงานได้ทันที โดยไม่ต้องรอให้ผู้ใช้ปิดแท็บเก่า
  self.addEventListener('install', () => {
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    // ลบ cache เก่าทั้งหมดที่ไม่ใช่ version ปัจจุบัน (Cache Busting)
    event.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(
          keys.map(key => {
            if (!key.includes(CACHE_VERSION)) {
              console.log(`[SW] Deleting old cache: ${key}`);
              return caches.delete(key);
            }
          })
        );
      }).then(() => {
        console.log(`[SW] Activate successful. Claiming clients.`);
        self.clients.claim();
      })
    );
  });

  // -----------------------------------
  // STEP 2: Precache Offline Essentials
  // -----------------------------------
  // Precache ไฟล์สำคัญที่จำเป็นต้องโหลดเร็วและรองรับ Offline
  workbox.precaching.precacheAndRoute([
    // ไฟล์หลักของ SPA
    { url: '/index.html', revision: CACHE_VERSION }, 
    { url: OFFLINE_PAGE, revision: CACHE_VERSION },
    // ไฟล์ PWA/Assets
    { url: '/manifest.webmanifest', revision: CACHE_VERSION },
    { url: '/images/og-default.webp', revision: CACHE_VERSION }, // รูปภาพ default
    // Icons
    { url: '/icons/icon-192x192.png', revision: CACHE_VERSION },
    { url: '/icons/icon-512x512.png', revision: CACHE_VERSION },
    // เพิ่มไฟล์ CSS/JS ที่ไม่มี Hash ในชื่อไฟล์ ที่นี่
  ]);

  // -----------------------------------
  // STEP 3: Routing & Strategy
  // -----------------------------------
  
  // 1. Documents (HTML Pages - Network First with Offline Fallback)
  // พยายามดึงจาก Network ก่อนเสมอ เพื่อให้ได้เนื้อหาสดใหม่ แต่หาก Offline ให้ Fallback ไป Offline Page
  workbox.routing.registerRoute(
    ({ request, url, event }) => request.mode === 'navigate', // สำหรับการนำทาง HTML
    new workbox.strategies.NetworkFirst({
      cacheName: `pages-${CACHE_VERSION}`,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [200] }),
        new workbox.expiration.ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 86400 }), // 1 วัน
        // 💡 Offline Fallback
        {
          handlerDidError: async () => {
            return caches.match(OFFLINE_PAGE);
          }
        }
      ],
    })
  );

  // 2. JS / CSS (StaleWhileRevalidate)
  // เร็วด้วยการแสดง Cache เก่าทันที พร้อมตรวจสอบ Network เพื่ออัปเดตเบื้องหลัง (ดีที่สุดสำหรับ Static Assets)
  workbox.routing.registerRoute(
    ({ request }) => ['script', 'style'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: `static-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 31536000 }) // 1 ปี
      ],
    })
  );

  // 3. Fonts (CacheFirst - อายุยาวนาน)
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'font',
    new workbox.strategies.CacheFirst({
      cacheName: `fonts-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 31536000 }),
      ],
    })
  );

  // 4. Images (CacheFirst - อายุ 30 วัน)
  // เหมาะสำหรับรูปโปรไฟล์ที่อาจจะมีการเปลี่ยนแปลงแต่ไม่บ่อย
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: `images-${CACHE_VERSION}`,
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 2592000 }), // 30 วัน
      ],
    })
  );
  
  // 5. **API Whitelist (ป้องกันการ Cache ข้อมูล API)**
  // ต้องแน่ใจว่าการเรียก API ภายนอก (เช่น Supabase) ไม่ถูก Service Worker Cache
  self.addEventListener('fetch', event => {
    const shouldBypass = API_BLACKLIST.some(domain => event.request.url.includes(domain));
    
    if (shouldBypass) {
      console.log(`[SW] Bypassing cache for API: ${event.request.url}`);
      // ใช้ NetworkOnly เพื่อดึงข้อมูลสดใหม่จาก Network ทุกครั้ง
      event.respondWith(
        new workbox.strategies.NetworkOnly().handle({ event: event, request: event.request })
      );
    }
  });

} else {
  console.error('[SW] Workbox failed to load. PWA features disabled.');
}
