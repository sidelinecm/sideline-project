
// =================================================================================
//  Service Worker (sw.js) - ADVANCED & HIGH-PERFORMANCE VERSION for SidelineCM
// =================================================================================

// ✅ STEP 1: โหลดไลบรารี Workbox ของ Google
// Workbox จะช่วยจัดการเรื่องซับซ้อนทั้งหมดให้เรา
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// ตรวจสอบว่า Workbox โหลดสำเร็จ
if (workbox) {
  console.log(`[SW] Workbox is loaded successfully!`);

  const { precacheAndRoute } = workbox.precaching;
  const { registerRoute } = workbox.routing;
  const { StaleWhileRevalidate, CacheFirst, NetworkFirst } = workbox.strategies;
  const { ExpirationPlugin } = workbox.expiration;
  const { CacheableResponsePlugin } = workbox.cacheableResponse;

  // ✅ [RELIABILITY] สั่งให้ Service Worker ใหม่ทำงานทันที ไม่ต้องรอ
  self.skipWaiting();
  workbox.core.clientsClaim();

  // --- STRATEGY 1: PRECACHING (แคชไฟล์โครงสร้างหลักของแอป) ---
  // ไฟล์เหล่านี้จะถูกดาวน์โหลดเก็บไว้ตั้งแต่ครั้งแรกที่ผู้ใช้เข้าเว็บ
  // Workbox จะจัดการอัปเดตให้เองเมื่อไฟล์มีการเปลี่ยนแปลง
  precacheAndRoute([
    // Core Files
    { url: '/', revision: 'homepage-v1' }, // ให้ revision เพื่อให้ Workbox รู้ว่าต้องอัปเดต
    { url: '/offline.html', revision: null },
    { url: '/manifest.webmanifest', revision: null },
    // Critical Assets
    { url: '/images/logo-sideline-chiangmai.webp', revision: null },
    { url: '/images/placeholder-profile.webp', revision: null },
    { url: '/images/favicon.svg', revision: null },
    // PWA Icons
    { url: '/icons/icon-192x192.png', revision: null },
    { url: '/icons/icon-512x512.png', revision: null },
  ]);

  // --- STRATEGY 2: NETWORK FIRST สำหรับหน้า HTML ---
  // กลยุทธ์: พยายามโหลดหน้าเว็บเวอร์ชันใหม่จากเน็ตเวิร์กก่อนเสมอ
  // ถ้าเน็ตล่ม (Offline) หรือช้า ค่อยไปดึงเวอร์ชันที่แคชไว้มาแสดงแทน
  registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({
      cacheName: 'sideline-cm-pages-cache',
      networkTimeoutSeconds: 4, // รอเน็ต 4 วินาที ถ้าไม่ตอบสนอง ถือว่า offline
      plugins: [
        // ถ้า offline ให้ไปเรียกหน้า offline.html จาก precache มาแสดง
        new workbox.routing.NetworkError(async () => {
            return await caches.match('/offline.html');
        })
      ]
    })
  );

  // --- STRATEGY 3: STALE-WHILE-REVALIDATE สำหรับ CSS & JS ---
  // กลยุทธ์ที่ดีที่สุดสำหรับ Performance & Freshness!
  // 1. โหลดจากแคชทันที (เว็บแสดงผลเร็วมาก)
  // 2. ขณะเดียวกัน ก็ส่ง request ไปเช็คเวอร์ชันใหม่เบื้องหลัง
  // 3. ถ้ามีเวอร์ชันใหม่ จะโหลดมาเก็บไว้ และการเข้าเว็บครั้งถัดไปจะได้ใช้ไฟล์ใหม่
  registerRoute(
    ({ request }) => request.destination === 'style' || request.destination === 'script',
    new StaleWhileRevalidate({
      cacheName: 'sideline-cm-static-assets-cache',
    })
  );

  // --- STRATEGY 4: CACHE FIRST สำหรับรูปภาพ (รวมถึงจาก SUPABASE) ---
  // กลยุทธ์: เมื่อโหลดรูปมาแล้วครั้งหนึ่ง จะเก็บไว้ในแคช
  // ครั้งต่อไปจะดึงจากแคชทันทีโดยไม่ถามเน็ตเวิร์ก (เร็วสุดๆ)
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'sideline-cm-images-cache',
      plugins: [
        // ✅ [OPTIMIZATION] จำกัดจำนวนรูปในแคชไม่ให้บวมเกินไป
        new ExpirationPlugin({
          maxEntries: 150, // เก็บรูปภาพได้สูงสุด 150 รูป
          maxAgeSeconds: 30 * 24 * 60 * 60, // มีอายุ 30 วัน
          purgeOnQuotaError: true, // ถ้าพื้นที่ใกล้เต็ม ให้ลบแคชนี้ทิ้งก่อน
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200], // แคชเฉพาะรูปที่โหลดสำเร็จ
        }),
      ],
    })
  );
  
  // --- STRATEGY 5: CACHE FIRST สำหรับฟอนต์ ---
  // กลยุทธ์: เหมือนรูปภาพ แต่เก็บได้นานกว่าเพราะฟอนต์ไม่เปลี่ยน
    registerRoute(
    ({ request }) => request.destination === 'font',
    new CacheFirst({
      cacheName: 'sideline-cm-fonts-cache',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // เก็บไว้ 1 ปี
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
      ],
    })
  );

} else {
  console.log(`[SW] Workbox didn't load.`);
}






