
// =============================================================================
//  Service Worker (v3.0 - High-Performance with Google Workbox)
// =============================================================================

// ✅ 1. IMPORT WORKBOX
// Workbox คือไลบรารีของ Google ที่ทำให้การเขียน Service Worker ง่ายและทรงพลัง
try {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
} catch (e) {
  console.error('[SW] Failed to import Workbox:', e);
}

if (workbox) {
  console.log(`[SW] Workbox is loaded successfully!`);

  // ✅ 2. DESTRUCTURE WORKBOX MODULES
  // ดึงเครื่องมือที่จำเป็นออกมาจาก Workbox เพื่อให้โค้ดสั้นลง
  const { precacheAndRoute } = workbox.precaching;
  const { registerRoute, NavigationRoute } = workbox.routing;
  const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  // ✅ 3. IMMEDIATE CONTROL
  // สั่งให้ Service Worker เวอร์ชันใหม่ทำงานทันที ไม่ต้องรอ
  self.skipWaiting();
  workbox.core.clientsClaim();

  // ✅ 4. PRECACHING (การสต็อกของจำเป็น)
  // Cache ไฟล์ที่สำคัญที่สุด ที่จำเป็นต่อการแสดงผล "App Shell" หรือโครงสร้างหลักของเว็บ
  // revision: null หมายถึงให้มันอัปเดตตามเนื้อหาไฟล์เสมอ
  precacheAndRoute([
    { url: '/offline.html', revision: null },
    { url: '/manifest.webmanifest', revision: null },
    { url: '/images/logo-sideline-chiangmai.webp', revision: null },
    { url: '/images/placeholder-profile.webp', revision: null },
    { url: '/images/favicon.svg', revision: null },
    // เพิ่มไอคอนสำหรับ PWA เข้าไปด้วย
    { url: '/icons/icon-192x192.png', revision: null },
    { url: '/icons/icon-512x512.png', revision: null },
  ]);

  // ✅ 5. ROUTING STRATEGIES (กลยุทธ์สำหรับไฟล์แต่ละประเภท)

  // --- STRATEGY FOR HTML PAGES (Network-First) ---
  // สำหรับหน้าเว็บ (HTML), ให้พยายามไปดึงข้อมูลจากอินเทอร์เน็ตก่อนเสมอ
  // เพื่อให้ผู้ใช้ได้เห็นเนื้อหาล่าสุด แต่ถ้าเน็ตล่มหรือไม่เสถียร ก็จะไปดึงจาก Cache มาแสดงแทน
  registerRoute(
    new NavigationRoute(
      new NetworkFirst({
        cacheName: 'sideline-cm-pages',
        networkTimeoutSeconds: 4, // ถ้าเน็ตช้าเกิน 4 วิ ให้ไปเอาจากแคช
        plugins: [
          // ถ้า Network ล้มเหลว (Offline) ให้ไปดึงหน้า offline.html มาแสดง
          {
            handlerDidError: async () => await caches.match('/offline.html'),
          },
        ],
      })
    )
  );

  // --- STRATEGY FOR CSS & JS (Stale-While-Revalidate) ---
  // กลยุทธ์ที่เร็วที่สุดสำหรับไฟล์ที่ไม่สำคัญเท่า HTML:
  // 1. ตอบกลับจาก Cache ทันที (เร็วมาก)
  // 2. พร้อมกันนั้น ก็ส่งคำขอไปที่เน็ตเวิร์คเบื้องหลังเพื่ออัปเดต Cache ให้เป็นเวอร์ชันล่าสุด
  registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new StaleWhileRevalidate({
      cacheName: 'sideline-cm-static-assets',
      plugins: [
        // เพิ่ม plugin เพื่อไม่ให้เก็บไฟล์ที่ไม่สมบูรณ์ (error) ไว้ใน cache
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

  // --- STRATEGY FOR IMAGES (Cache-First with Expiration) ---
  // สำหรับรูปภาพ (รวมถึงรูปจาก Supabase), เมื่อโหลดมาครั้งแรกแล้ว ให้เก็บไว้ใน Cache เลย
  // ครั้งต่อไปให้ดึงจาก Cache ทันทีโดยไม่ต้องถามเน็ตเวิร์ค
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'sideline-cm-images',
      plugins: [
        // จำกัดจำนวนและอายุของ Cache เพื่อไม่ให้กินพื้นที่เครื่องผู้ใช้มากเกินไป
        new ExpirationPlugin({
          maxEntries: 150, // เก็บรูปภาพได้สูงสุด 150 รูป
          maxAgeSeconds: 30 * 24 * 60 * 60, // เก็บไว้นาน 30 วัน
          purgeOnQuotaError: true, // ถ้าพื้นที่ใกล้เต็ม ให้ลบแคชนี้ทิ้งก่อน
        }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );
  
  // --- STRATEGY FOR FONTS (Cache-First with Long Expiration) ---
  // สำหรับฟอนต์, เหมือนกับรูปภาพ แต่เก็บไว้นานกว่ามากเพราะไม่ค่อยเปลี่ยนแปลง
  registerRoute(
    ({ request }) => request.destination === 'font',
    new CacheFirst({
      cacheName: 'sideline-cm-fonts',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30, // เก็บฟอนต์ได้สูงสุด 30 ไฟล์
          maxAgeSeconds: 365 * 24 * 60 * 60, // เก็บไว้นาน 1 ปีเต็ม
        }),
        new CacheableResponsePlugin({ statuses: [0, 200] }),
      ],
    })
  );

} else {
  console.error(`[SW] Workbox failed to load.`);
}



